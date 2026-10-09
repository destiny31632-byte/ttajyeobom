import fs from 'node:fs';
import path from 'node:path';
import { BRIEF_DIR, CONFIG_DIR, POSTS_DIR, RESEARCH_DIR } from './paths.ts';
import { serializePost, type Frontmatter, type SourceMeta } from './content.ts';
import { type TextProvider } from './ai-provider.ts';
import { kstIso, kstDate } from './time.ts';

export async function generateDraft(provider: TextProvider): Promise<string | null> {
  const dir = path.join(BRIEF_DIR, 'ready');
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).filter((file) => file.endsWith('.json')).sort();
  for (const file of files) {
    const brief = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (!/^[a-z0-9][a-z0-9-]*$/.test(brief.slug)) throw new Error('조사 브리프 slug 오류');
    const destination = path.join(POSTS_DIR, `${brief.slug}.md`);
    if (fs.existsSync(destination)) continue;
    if (!brief.title || !brief.category || !brief.targetQuery || !brief.cluster || !Array.isArray(brief.tags) || !Array.isArray(brief.sources) || brief.sources.length < 3 || !brief.facts?.length) throw new Error('조사 브리프 필수 항목 부족');
    const sources = brief.sources as SourceMeta[];
    if (sources.some((s) => !s.url?.startsWith('https://') || !s.accessed || !s.publisher)) throw new Error('출처 형식 오류');
    const age = (Date.now() - Date.parse(brief.checkedAt)) / 86400000;
    if (!Number.isFinite(age) || age < 0 || age > 7) throw new Error('7일 이내 실제 조사 날짜 필요');
    if (brief.facts.some((f: { sourceUrl: string }) => !sources.some((s) => s.url === f.sourceUrl))) throw new Error('근거와 출처 불일치');
    const style = fs.readFileSync(path.join(CONFIG_DIR, 'style-guide.md'), 'utf8');
    const prompt = `${style}\n아래 공식 조사 자료만으로 한국어 글 초안을 작성하세요. 확인되지 않은 사실·경험·통계·날짜를 추가하지 마세요. 자료가 부족하면 작성을 거부하세요. HTML·스크립트는 쓰지 마세요. body에는 H2 5개 이상, 표 2개 이상, FAQ 3개 이상, 상황별 선택과 실행 목록을 포함하세요. 본문은 2500자 이상. 출처를 문장 근처에 Markdown 링크로 표시하고 관련 내부 링크는 실제 존재하는 경로만 쓰세요. 응답은 JSON 객체 {description, summary: [문장], body: Markdown}만 반환하세요. 제목과 메타데이터는 아래 조사 브리프를 따릅니다.\n${JSON.stringify(brief)}`;
    const response = await provider.generate(prompt);
    const generated = JSON.parse(response.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, ''));
    if (typeof generated.body !== 'string' || generated.body.length < 2500 || /<\/?[a-z][^>]*>|javascript:|data:text\/html/i.test(generated.body)) throw new Error('AI 결과 형식 미달 또는 비허용 HTML');
    if (typeof generated.description !== 'string' || !Array.isArray(generated.summary)) throw new Error('AI 결과 메타데이터 부족');
    const data: Frontmatter = { title: brief.title, description: generated.description, summary: generated.summary,
      pubDate: kstIso(), category: brief.category, cluster: brief.cluster, targetQuery: brief.targetQuery,
      tags: brief.tags, sources, draft: true, ymyl: brief.ymyl ?? 'low', volatility: brief.volatility ?? 'medium',
      generation: { method: 'pipeline' } };
    const researchFile = path.join(RESEARCH_DIR, `${brief.slug}.json`);
    if (fs.existsSync(researchFile)) throw new Error('기존 조사 기록을 덮어쓸 수 없습니다.');
    fs.writeFileSync(researchFile, JSON.stringify({ slug: brief.slug, checkedAt: brief.checkedAt, facts: brief.facts, calculations: brief.calculations ?? [] }, null, 2) + '\n', { encoding: 'utf8', flag: 'wx' });
    fs.writeFileSync(destination, serializePost(data, generated.body), { encoding: 'utf8', flag: 'wx' });
    return brief.slug;
  }
  return null;
}
