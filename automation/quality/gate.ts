// 발행 전 자동 품질 검수 (Quality Gate)
// fail 이 하나라도 있거나 점수가 기준 미만이면 발행하지 않습니다 → 초안으로 저장 + 사유 기록
import fs from 'node:fs';
import path from 'node:path';
import { postSchema } from '../../src/lib/shared/post-schema.ts';
import { ALLOWED_IMAGE_LICENSES, CATEGORIES } from '../../src/config/taxonomy.ts';
import { countChars, isValidSlug, stripMarkdown } from '../../src/lib/shared/korean.ts';
import { TfIdfIndex, textSimilarity } from '../../src/lib/shared/similarity.ts';
import { countTables, extractHeadings, extractImages, extractLinks, type PostFile } from '../lib/content.ts';
import { CONFIG_DIR, PUBLIC_DIR } from '../lib/paths.ts';
import { readJson } from '../lib/fsutil.ts';
import {
  copyRisk,
  duplicateSentences,
  extractNumericClaims,
  findPatterns,
  normalizeNumber,
  phraseRepetitionRatio,
  repeatedOpeners,
} from './text-checks.ts';

export type CheckStatus = 'pass' | 'warn' | 'fail' | 'skip';
export interface CheckResult {
  id: string;
  label: string;
  status: CheckStatus;
  detail?: string;
}

export interface GateReport {
  slug: string;
  pass: boolean;
  score: number;
  checkedAt: string;
  stats: { chars: number; h2: number; tables: number; sources: number; internalLinks: number; images: number };
  failures: string[];
  warnings: string[];
  checks: CheckResult[];
}

export interface GateContext {
  /** 비교 대상이 되는 다른 글 전체 (초안 포함) */
  allPosts: PostFile[];
  /** 조사 단계에서 모은 사실(숫자) 근거. 없으면 숫자 근거 검사를 건너뜀 */
  evidenceNumbers?: string[];
  /** 조사 단계에서 수집한 원문 텍스트 (표절 위험 검사용, 커밋하지 않음) */
  sourceTexts?: string[];
  /** 출처 URL 실제 접속 확인 */
  online?: boolean;
  /** 자동 발행 판단 여부 (high YMYL 은 자동 발행 금지) */
  forAutoPublish?: boolean;
  now?: Date;
}

interface QualityConfig {
  minChars: number;
  targetChars: number;
  minH2: number;
  minSources: number;
  minInternalLinks: number;
  maxTableColumns: number;
  titleChars: { min: number; max: number };
  descriptionChars: { min: number; max: number };
  duplicateBody: { warn: number; fail: number };
  duplicateTitle: { warn: number; fail: number };
  duplicateTopic: { warn: number; fail: number };
  plagiarism: { maxCopiedRunChars: number; containmentWarn: number; containmentFail: number };
  factSupport: { warnRatio: number; failRatio: number };
  sourceMaxAgeDays: Record<'high' | 'medium' | 'low', number>;
  passScore: number;
  penalty: { fail: number; warn: number };
}

interface PolicyConfig {
  blockTopics: string[];
  sensitiveTitle: string[];
  ymylHigh: string[];
  adInducement: string[];
  bannedPhrasesFail: string[];
  bannedPhrasesWarn: string[];
  clickbait: string[];
  typos: { pattern: string; fix: string }[];
}

export const loadQualityConfig = () => readJson<QualityConfig>(path.join(CONFIG_DIR, 'quality.json'), {} as QualityConfig);
export const loadPolicy = () => readJson<PolicyConfig>(path.join(CONFIG_DIR, 'policy.json'), {} as PolicyConfig);

const STATIC_ROUTES = ['/', '/posts/', '/tags/', '/search/', '/about/', '/author/editor/', '/editorial-policy/', '/contact/', '/privacy/', '/terms/', '/disclaimer/', '/rss.xml', '/sitemap.xml'];

async function checkUrl(url: string): Promise<number> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  const headers = { 'User-Agent': 'Mozilla/5.0 (compatible; ttajyeobom-linkcheck/1.0; +https://github.com/)', Accept: 'text/html,*/*' };
  try {
    let res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: ctrl.signal, headers });
    // 일부 사이트(구글 고객센터 등)는 HEAD 요청에 404/405를 돌려주므로 GET 으로 다시 확인
    if (res.status >= 400) res = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctrl.signal, headers });
    return res.status;
  } catch {
    return 0;
  } finally {
    clearTimeout(timer);
  }
}

export async function runGate(post: PostFile, ctx: GateContext): Promise<GateReport> {
  const cfg = loadQualityConfig();
  const policy = loadPolicy();
  const now = ctx.now ?? new Date();
  const checks: CheckResult[] = [];
  const add = (id: string, label: string, status: CheckStatus, detail?: string) => checks.push({ id, label, status, detail });
  const d = post.data;
  const body = post.body;
  const text = stripMarkdown(body);
  const others = ctx.allPosts.filter((p) => p.slug !== post.slug);
  const publishedOthers = others.filter((p) => !p.data.draft);

  // 1) 스키마
  const parsed = postSchema.safeParse(d);
  if (parsed.success) add('schema', 'frontmatter 형식', 'pass');
  else
    add(
      'schema',
      'frontmatter 형식',
      'fail',
      parsed.error.issues.slice(0, 5).map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
    );

  // 2) 슬러그
  add('slug', '주소(슬러그) 형식', isValidSlug(post.slug) ? 'pass' : 'fail', isValidSlug(post.slug) ? undefined : `영문 소문자-하이픈 형식이 아닙니다: ${post.slug}`);

  // 3) 제목 길이 / 설명 길이
  const tl = [...(d.title ?? '')].length;
  add(
    'title-length',
    `제목 길이 ${tl}자`,
    tl >= cfg.titleChars.min && tl <= cfg.titleChars.max ? 'pass' : tl < 12 || tl > 70 ? 'fail' : 'warn',
    `권장 ${cfg.titleChars.min}~${cfg.titleChars.max}자`,
  );
  const dl = [...(d.description ?? '')].length;
  add(
    'description-length',
    `설명 길이 ${dl}자`,
    dl >= cfg.descriptionChars.min && dl <= cfg.descriptionChars.max ? 'pass' : dl < 50 ? 'fail' : 'warn',
    `권장 ${cfg.descriptionChars.min}~${cfg.descriptionChars.max}자`,
  );

  // 4) 카테고리
  add('category', '카테고리', CATEGORIES.some((c) => c.slug === d.category) ? 'pass' : 'fail');

  // 5) 분량·구조
  const chars = countChars(body);
  add(
    'length',
    `본문 분량 ${chars.toLocaleString('ko-KR')}자`,
    chars >= cfg.targetChars ? 'pass' : chars >= cfg.minChars ? 'warn' : 'fail',
    `최소 ${cfg.minChars}자, 권장 ${cfg.targetChars}자 이상 (공백 제외)`,
  );
  const headings = extractHeadings(body);
  const h2 = headings.filter((h) => h.depth === 2);
  const h1 = headings.filter((h) => h.depth === 1);
  add('h1', '본문에 H1 없음', h1.length === 0 ? 'pass' : 'fail', h1.length ? '본문에는 # 제목을 쓰지 않습니다 (페이지 제목이 H1)' : undefined);
  add('h2', `소제목 ${h2.length}개`, h2.length >= cfg.minH2 ? 'pass' : h2.length >= 3 ? 'warn' : 'fail', `최소 ${cfg.minH2}개`);
  let skipped = false;
  for (let i = 1; i < headings.length; i++) if (headings[i].depth - headings[i - 1].depth > 1) skipped = true;
  if (headings[0] && headings[0].depth > 2) skipped = true;
  add('heading-order', '제목 단계 건너뜀 없음', skipped ? 'warn' : 'pass');
  const headingTexts = headings.map((h) => h.text);
  const dupHeadings = headingTexts.filter((t, i) => headingTexts.indexOf(t) !== i);
  add('heading-unique', '소제목 중복 없음', dupHeadings.length ? 'warn' : 'pass', dupHeadings.join(', ') || undefined);

  // 6) 요약·FAQ·표 (독창적 가치 요소)
  const summaryCount = d.summary?.length ?? 0;
  add('summary', `핵심 요약 ${summaryCount}개`, summaryCount >= 3 ? 'pass' : 'warn', summaryCount >= 3 ? undefined : '3~5개 권장');
  const faqIdx = headings.findIndex((h) => h.depth === 2 && /자주 묻는|FAQ|궁금한 점/i.test(h.text));
  const faqQs = faqIdx >= 0 ? headings.slice(faqIdx + 1).filter((h, i, arr) => h.depth === 3 && !arr.slice(0, i).some((x) => x.depth === 2)).length : 0;
  add('faq', `FAQ 질문 ${faqQs}개`, faqQs >= 3 ? 'pass' : 'warn', faqQs >= 3 ? undefined : "'자주 묻는 질문' H2 아래 H3 질문 3개 이상 권장");
  const tables = countTables(body);
  add('tables', `표 ${tables}개`, tables >= 1 ? 'pass' : 'warn', tables ? undefined : '비교표·계산표가 있으면 원자료 이상의 가치가 생깁니다');
  const wideTable = body
    .split('\n')
    .filter((l) => /^\s*\|.*\|\s*$/.test(l))
    .some((l) => l.split('|').length - 2 > cfg.maxTableColumns);
  add('mobile-table', `표 열 ${cfg.maxTableColumns}개 이하`, wideTable ? 'warn' : 'pass', wideTable ? '열이 많으면 모바일에서 읽기 어렵습니다' : undefined);

  // 7) 출처
  const sources = d.sources ?? [];
  const tier1 = sources.filter((s) => ['government', 'official', 'primary'].includes(s.type)).length;
  add('sources-count', `출처 ${sources.length}개`, sources.length >= cfg.minSources ? 'pass' : sources.length >= 2 ? 'warn' : 'fail', `최소 ${cfg.minSources}개`);
  const ymyl = d.ymyl ?? 'low';
  add(
    'sources-tier',
    `공식·원자료 출처 ${tier1}개`,
    tier1 >= 1 ? 'pass' : ymyl === 'medium' || ymyl === 'high' ? 'fail' : 'warn',
    tier1 >= 1 ? undefined : '정부·공공기관·제조사 공식 문서 등 1차 출처가 필요합니다',
  );
  const urls = sources.map((s) => s.url);
  const dupUrls = urls.filter((u, i) => urls.indexOf(u) !== i);
  const httpOnly = urls.filter((u) => !/^https:\/\//.test(u));
  add('sources-format', '출처 URL 형식', dupUrls.length || httpOnly.length ? 'warn' : 'pass', [...dupUrls.map((u) => `중복: ${u}`), ...httpOnly.map((u) => `https 아님: ${u}`)].join('; ') || undefined);
  const maxAge = cfg.sourceMaxAgeDays[d.volatility ?? 'medium'];
  const stale = sources.filter((s) => {
    const t = new Date(s.accessed).getTime();
    return !Number.isFinite(t) || (now.getTime() - t) / 86400000 > maxAge || t - now.getTime() > 2 * 86400000;
  });
  add('sources-fresh', `출처 조회일 ${maxAge}일 이내`, stale.length ? 'warn' : 'pass', stale.length ? `다시 확인 필요: ${stale.map((s) => s.publisher).join(', ')}` : undefined);
  if (ctx.online) {
    const statuses = await Promise.all(urls.map(async (u) => ({ u, status: await checkUrl(u) })));
    const dead = statuses.filter((s) => s.status === 404 || s.status === 410);
    const flaky = statuses.filter((s) => s.status === 0 || s.status >= 500 || s.status === 403 || s.status === 429);
    add(
      'sources-online',
      '출처 링크 접속',
      dead.length ? 'fail' : flaky.length ? 'warn' : 'pass',
      [...dead.map((s) => `${s.status} ${s.u}`), ...flaky.map((s) => `${s.status || '응답 없음'} ${s.u}`)].join('; ') || undefined,
    );
  } else add('sources-online', '출처 링크 접속', 'skip', '--online 옵션에서 확인');

  // 8) 제목-본문 일치: 제목의 숫자가 본문에 있어야 함
  const titleNums = [...(d.title ?? '').matchAll(/\d[\d,.]*\s?(%|퍼센트|원|만원|달러|가지|개|년|월|일|시간|분|단계|배|kWh|GB)?/g)].map((m) => m[0].trim());
  const bodyCompact = text.replace(/[,\s]/g, '');
  const missingNums = titleNums.filter((n) => !bodyCompact.includes(n.replace(/[,\s]/g, '')));
  add('title-body', '제목의 숫자·주장이 본문에 있음', missingNums.length ? 'fail' : 'pass', missingNums.length ? `본문에서 찾을 수 없음: ${missingNums.join(', ')}` : undefined);

  // 9) 검색 의도: 대상 검색어가 제목/도입부/소제목에 반영됐는지
  const qTokens = (d.targetQuery ?? '').split(/\s+/).filter((t) => t.length >= 2);
  const intro = text.slice(0, 400);
  const inTitle = qTokens.filter((t) => d.title.includes(t)).length;
  const inIntro = qTokens.filter((t) => intro.includes(t)).length;
  const inH2 = qTokens.some((t) => h2.some((h) => h.text.includes(t)));
  const intentOk = qTokens.length === 0 || (inTitle >= Math.ceil(qTokens.length / 2) && inIntro >= 1);
  add('search-intent', '검색어가 제목·도입부에 반영', intentOk ? (inH2 ? 'pass' : 'warn') : 'fail', `검색어 "${d.targetQuery}" — 제목 ${inTitle}/${qTokens.length}, 도입부 ${inIntro}/${qTokens.length}, 소제목 ${inH2 ? '있음' : '없음'}`);

  // 10) 금지 표현 / 광고 클릭 유도 / 낚시성 제목
  const fullText = `${d.title}\n${d.description}\n${(d.summary ?? []).join('\n')}\n${body}`;
  const adHits = findPatterns(fullText, policy.adInducement);
  add('ad-inducement', '광고 클릭 유도 문구 없음', adHits.length ? 'fail' : 'pass', adHits.map((h) => h.sample).join(' / ') || undefined);
  const bannedFail = findPatterns(fullText, policy.bannedPhrasesFail);
  add('banned-phrases', '상투적 AI 표현 없음', bannedFail.length ? 'fail' : 'pass', bannedFail.map((h) => `"${h.sample}"`).join(' / ') || undefined);
  const bannedWarn = findPatterns(fullText, policy.bannedPhrasesWarn);
  const warnTotal = bannedWarn.reduce((s, h) => s + h.count, 0);
  add('cliche', '반복적인 상투 표현', warnTotal >= 4 ? 'fail' : warnTotal ? 'warn' : 'pass', bannedWarn.map((h) => `${h.pattern}×${h.count}`).join(', ') || undefined);
  const bait = findPatterns(`${d.title} ${d.description}`, policy.clickbait);
  add('clickbait', '과장·낚시성 표현 없음', bait.length ? 'fail' : 'pass', bait.map((h) => h.pattern).join(', ') || undefined);

  // 11) 반복
  const dupS = duplicateSentences(body);
  const openers = repeatedOpeners(body);
  const rep = phraseRepetitionRatio(body);
  const repStatus: CheckStatus = dupS.length >= 3 || rep.ratio > 0.06 ? 'fail' : dupS.length || openers.length || rep.ratio > 0.03 ? 'warn' : 'pass';
  add(
    'repetition',
    '의미 없는 반복 없음',
    repStatus,
    [
      dupS.length ? `중복 문장 ${dupS.length}개 (${dupS[0].sentence}…)` : '',
      openers.length ? `같은 시작어 연속: ${openers.join(', ')}` : '',
      rep.ratio > 0.03 ? `반복 어구 비율 ${(rep.ratio * 100).toFixed(1)}% (${rep.top.map((t) => t.phrase).join(' / ')})` : '',
    ]
      .filter(Boolean)
      .join('; ') || undefined,
  );

  // 12) 오탈자·띄어쓰기 (흔한 실수 목록)
  const typoHits = findPatterns(text, policy.typos.map((t) => t.pattern));
  const typoTotal = typoHits.reduce((s, h) => s + h.count, 0);
  add(
    'spelling',
    '흔한 맞춤법 오류',
    typoTotal >= 5 ? 'fail' : typoTotal ? 'warn' : 'pass',
    typoHits.map((h) => `${policy.typos.find((t) => t.pattern === h.pattern)?.fix} ← "${h.sample}"`).join(' / ') || undefined,
  );

  // 13) 기존 글과 중복
  if (others.length) {
    const idx = new TfIdfIndex(3);
    for (const p of others) idx.add(p.slug, stripMarkdown(p.body));
    const top = idx.query(text)[0];
    add(
      'duplicate-body',
      '기존 글과 본문 중복',
      top.score >= cfg.duplicateBody.fail ? 'fail' : top.score >= cfg.duplicateBody.warn ? 'warn' : 'pass',
      `가장 비슷한 글: ${top.id} (${(top.score * 100).toFixed(0)}%)`,
    );
    const titleSim = others.map((p) => ({ slug: p.slug, s: textSimilarity(d.title, p.data.title) })).sort((a, b) => b.s - a.s)[0];
    add(
      'duplicate-title',
      '제목 중복',
      titleSim.s >= cfg.duplicateTitle.fail ? 'fail' : titleSim.s >= cfg.duplicateTitle.warn ? 'warn' : 'pass',
      `가장 비슷한 제목: ${titleSim.slug} (${(titleSim.s * 100).toFixed(0)}%)`,
    );
    const descDup = others.find((p) => p.data.description.trim() === d.description.trim());
    add('duplicate-description', '설명 문구 중복', descDup ? 'fail' : 'pass', descDup ? descDup.slug : undefined);
    const topicSim = others
      .map((p) => ({ slug: p.slug, s: Math.max(textSimilarity(d.targetQuery, p.data.targetQuery), textSimilarity(d.targetQuery, p.data.title) * 0.9) }))
      .sort((a, b) => b.s - a.s)[0];
    add(
      'duplicate-topic',
      '같은 검색 의도의 글 (카니발리제이션)',
      topicSim.s >= cfg.duplicateTopic.fail ? 'fail' : topicSim.s >= cfg.duplicateTopic.warn ? 'warn' : 'pass',
      `가장 비슷한 주제: ${topicSim.slug} (${(topicSim.s * 100).toFixed(0)}%)`,
    );
  } else {
    add('duplicate-body', '기존 글과 본문 중복', 'pass', '비교할 글 없음');
  }

  // 14) 원문 복제 위험
  if (ctx.sourceTexts?.length) {
    const risk = copyRisk(body, ctx.sourceTexts);
    const st: CheckStatus =
      risk.maxRun >= cfg.plagiarism.maxCopiedRunChars || risk.containment >= cfg.plagiarism.containmentFail
        ? 'fail'
        : risk.containment >= cfg.plagiarism.containmentWarn
          ? 'warn'
          : 'pass';
    add('plagiarism', '원문 복제 위험', st, `최장 일치 ${risk.maxRun}자, 포함률 ${(risk.containment * 100).toFixed(1)}%${risk.sample ? ` (예: ${risk.sample})` : ''}`);
  } else add('plagiarism', '원문 복제 위험', 'skip', '조사 원문이 없는 글(직접 작성)은 건너뜀');

  // 15) 숫자 근거
  if (ctx.evidenceNumbers?.length) {
    const evidence = new Set(ctx.evidenceNumbers.map(normalizeNumber));
    const evidenceDigits = ctx.evidenceNumbers.map((e) => e.replace(/[^\d.]/g, ''));
    const claims = extractNumericClaims(body);
    const unsupported = claims.filter((c) => {
      const n = normalizeNumber(c);
      if (evidence.has(n)) return false;
      const digits = n.replace(/[^\d.]/g, '');
      return !evidenceDigits.includes(digits);
    });
    const ratio = claims.length ? unsupported.length / claims.length : 0;
    add(
      'fact-support',
      `숫자 근거 확인 (${claims.length - unsupported.length}/${claims.length})`,
      ratio > cfg.factSupport.failRatio ? 'fail' : ratio > cfg.factSupport.warnRatio ? 'warn' : 'pass',
      unsupported.length ? `근거를 찾지 못한 숫자: ${[...new Set(unsupported)].slice(0, 10).join(', ')}` : undefined,
    );
  } else add('fact-support', '숫자 근거 확인', 'skip', '조사 데이터가 없는 글은 출처 목록으로 대신 확인');

  // 16) 이미지
  const images = extractImages(body);
  const metas = d.images ?? [];
  const imgProblems: string[] = [];
  for (const img of images) {
    if (!img.alt || [...img.alt].length < 5 || /\.(png|jpe?g|webp|svg|avif)$/i.test(img.alt)) imgProblems.push(`alt 부족: ${img.src}`);
    if (!img.src.startsWith('/images/')) imgProblems.push(`외부/비허용 경로: ${img.src}`);
    else if (!fs.existsSync(path.join(PUBLIC_DIR, decodeURI(img.src).replace(/^\//, '')))) imgProblems.push(`파일 없음: ${img.src}`);
    const meta = metas.find((m) => m.src === img.src);
    if (!meta) imgProblems.push(`라이선스 정보 없음: ${img.src}`);
    else {
      if (!ALLOWED_IMAGE_LICENSES.includes(meta.license)) imgProblems.push(`허용되지 않은 라이선스(${meta.license}): ${img.src}`);
      const own = meta.kind === 'own-chart' || meta.kind === 'own-diagram';
      if (!own && (!meta.author || !meta.sourceUrl)) imgProblems.push(`작성자/원본 URL 없음: ${img.src}`);
      if (!own && /BY/.test(meta.license) && !meta.licenseUrl) imgProblems.push(`라이선스 링크 없음: ${img.src}`);
    }
  }
  if (d.ogImage && !fs.existsSync(path.join(PUBLIC_DIR, d.ogImage.replace(/^\//, '')))) imgProblems.push(`OG 이미지 파일 없음: ${d.ogImage}`);
  add('images', `이미지 ${images.length}개 라이선스·대체텍스트`, imgProblems.length ? 'fail' : 'pass', imgProblems.join('; ') || undefined);

  // 17) 내부 링크
  const links = extractLinks(body);
  const internal = links.filter((l) => l.href.startsWith('/'));
  const postSlugs = new Map(ctx.allPosts.map((p) => [p.slug, p]));
  const tagSlugOf = (t: string) => t.trim().replace(/\s+/g, '-');
  const publishedTagSlugs = new Set(
    publishedOthers
      .flatMap((p) => p.data.tags)
      .concat(d.draft ? [] : d.tags)
      .map(tagSlugOf),
  );
  const broken: string[] = [];
  let postLinks = 0;
  for (const l of internal) {
    const href = l.href.split('#')[0];
    const pm = href.match(/^\/posts\/([a-z0-9-]+)\/$/);
    if (pm) {
      const target = postSlugs.get(pm[1]);
      if (!target) broken.push(`${l.href} (없는 글)`);
      else if (target.data.draft && !d.draft) broken.push(`${l.href} (초안 글로 연결)`);
      else postLinks++;
      continue;
    }
    const cm = href.match(/^\/category\/([a-z]+)\/$/);
    if (cm) {
      if (!CATEGORIES.some((c) => c.slug === cm[1])) broken.push(l.href);
      continue;
    }
    const tm = href.match(/^\/tags\/([^/]+)\/$/);
    if (tm) {
      let slug = tm[1];
      try {
        slug = decodeURIComponent(slug);
      } catch {
        /* 그대로 비교 */
      }
      if (!publishedTagSlugs.has(slug)) broken.push(`${l.href} (태그 페이지 없음)`);
      continue;
    }
    if (href.startsWith('/images/')) {
      if (!fs.existsSync(path.join(PUBLIC_DIR, decodeURI(href).replace(/^\//, '')))) broken.push(l.href);
      continue;
    }
    if (!STATIC_ROUTES.includes(href)) broken.push(`${l.href} (알 수 없는 경로)`);
  }
  add('internal-links-valid', '내부 링크 정상', broken.length ? 'fail' : 'pass', broken.join('; ') || undefined);
  const eligible = publishedOthers.filter((p) => p.data.cluster === d.cluster || p.data.category === d.category).length;
  const needLinks = Math.min(cfg.minInternalLinks, eligible);
  add(
    'internal-links-count',
    `관련 글 링크 ${postLinks}개`,
    postLinks >= needLinks ? 'pass' : 'warn',
    postLinks >= needLinks ? undefined : `관련 글 ${eligible}개 중 최소 ${needLinks}개 연결 권장 (npm run links:update 로 자동 추가)`,
  );

  // 18) 외부 링크·마크업 안전성
  const external = links.filter((l) => /^https?:/.test(l.href));
  const badProto = links.filter((l) => !/^(https?:|\/|#|mailto:)/.test(l.href));
  add('external-links', `외부 링크 ${external.length}개`, badProto.length ? 'fail' : external.length > 30 ? 'warn' : 'pass', badProto.map((l) => l.href).join(', ') || undefined);
  const unsafe = /<script|<iframe|<style|<object|<embed|\son[a-z]+\s*=|javascript:/i.test(body);
  add('markup-safety', '위험한 HTML 없음', unsafe ? 'fail' : 'pass');

  // 19) 정책 위험 주제
  const topicText = `${d.title} ${d.targetQuery} ${d.tags.join(' ')}`;
  const blocked = findPatterns(`${topicText} ${text.slice(0, 2000)}`, policy.blockTopics);
  const sensitive = findPatterns(topicText, policy.sensitiveTitle);
  add('policy-topic', '금지·민감 주제 아님', blocked.length || sensitive.length ? 'fail' : 'pass', [...blocked, ...sensitive].map((h) => h.pattern).join(', ') || undefined);
  const ymylHits = findPatterns(topicText, policy.ymylHigh);
  if (ymyl === 'high' || ymylHits.length) {
    add('ymyl', 'YMYL(건강·금융·법률) 고위험', ctx.forAutoPublish ? 'fail' : 'warn', '고위험 주제는 자동 발행하지 않고 사람이 검토합니다');
  } else add('ymyl', `YMYL 수준: ${ymyl}`, 'pass');

  // 20) 날짜
  const pub = new Date(d.pubDate).getTime();
  const upd = d.updatedDate ? new Date(d.updatedDate).getTime() : pub;
  const dateProblems: string[] = [];
  if (!Number.isFinite(pub)) dateProblems.push('pubDate 형식 오류');
  if (pub - now.getTime() > 2 * 86400000) dateProblems.push('pubDate 가 미래');
  if (upd < pub) dateProblems.push('updatedDate 가 pubDate 보다 이전');
  if (d.volatility === 'high' && !d.reviewBy) dateProblems.push('자주 바뀌는 정보인데 reviewBy(재확인일) 없음');
  add('dates', '작성일·수정일·재확인일', dateProblems.some((p) => !p.includes('reviewBy')) ? 'fail' : dateProblems.length ? 'warn' : 'pass', dateProblems.join('; ') || undefined);

  // 점수
  const fails = checks.filter((c) => c.status === 'fail');
  const warns = checks.filter((c) => c.status === 'warn');
  const score = Math.max(0, 100 - fails.length * cfg.penalty.fail - warns.length * cfg.penalty.warn);
  return {
    slug: post.slug,
    pass: fails.length === 0 && score >= cfg.passScore,
    score,
    checkedAt: now.toISOString(),
    stats: { chars, h2: h2.length, tables, sources: sources.length, internalLinks: postLinks, images: images.length },
    failures: fails.map((c) => `${c.label}${c.detail ? ` — ${c.detail}` : ''}`),
    warnings: warns.map((c) => `${c.label}${c.detail ? ` — ${c.detail}` : ''}`),
    checks,
  };
}

export function formatReport(r: GateReport): string {
  const icon: Record<CheckStatus, string> = { pass: '✔', warn: '△', fail: '✖', skip: '·' };
  const lines = [`[${r.pass ? 'PASS' : 'FAIL'}] ${r.slug} — 점수 ${r.score}/100`];
  for (const c of r.checks) lines.push(`  ${icon[c.status]} ${c.label}${c.detail ? ` — ${c.detail}` : ''}`);
  return lines.join('\n');
}
