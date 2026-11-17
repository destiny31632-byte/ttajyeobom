// 글마다 하나씩 들어가는 '고유 시각 자료' 생성기.
// 1) 제휴 추천 제품이 있는 글: 확인일 판매가 비교 막대
// 2) 그 외 글: 본문 첫 비교표에서 가장 의미 있는 수치 열을 골라 막대
// 숫자는 본문에 이미 적힌 값만 사용합니다(새 수치를 만들어 넣지 않음).
import { chartAltText, renderChart, textWidth, type ChartSpec } from '../../automation/lib/chart.ts';
import { getAffiliateRankingForPost } from './affiliate.ts';

export interface PostChart {
  svg: string;
  alt: string;
  caption: string;
  spec: ChartSpec;
}

export interface ChartInput {
  id: string;
  title: string;
  body: string;
}

const MONEY_WORDS = /(가격|판매가|요금|비용|수수료|청구|지출|금액|원가|환급|월세|보험료|공과금|수입)/;
const PERCENT_WORDS = /(%|퍼센트|률|율|비율|할인|점유|비중|만족도)/;
const COUNT_WORDS = /(개수|건수|대수|장수|매수|수량|사용량|소비량|시간|개월|일수|점수|Wh|mAh|W|MJ|dB|㎡|kcal|v|V)/;

const clean = (s: string) =>
  s
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*`_~]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const NUM_RE = /-?\d[\d,]*(?:\.\d+)?/;

function toNumber(cell: string): number | null {
  const text = clean(cell);
  // 계산식(×, →, ~, /)이 섞인 칸은 한 가지 수치로 읽을 수 없으므로 제외
  if (/[×→~∕]|\d\s*\/\s*\d/.test(text)) return null;
  const all = text.match(/-?\d[\d,]*(?:\.\d+)?/g) ?? [];
  if (all.length !== 1) return null;
  const m = all[0];
  const n = Number(m.replace(/,/g, ''));
  if (!Number.isFinite(n)) return null;
  // 연도·날짜처럼 보이는 4자리 값은 수치 비교 대상에서 제외
  if (/^(19|20)\d{2}$/.test(m) && !/원|%|명|건|개/.test(text)) return null;
  return n;
}

function truncate(text: string, maxWidth: number, fontSize = 14): string {
  if (textWidth(text, fontSize) <= maxWidth) return text;
  let out = '';
  for (const ch of text) {
    if (textWidth(out + ch + '…', fontSize) > maxWidth) break;
    out += ch;
  }
  return out.trimEnd() + '…';
}

interface MdTable {
  heading: string;
  header: string[];
  rows: string[][];
}

function splitRow(line: string): string[] {
  return line.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim());
}

export function parseTables(body: string): MdTable[] {
  const lines = body.split(/\r?\n/);
  const tables: MdTable[] = [];
  let heading = '';
  let block: string[] = [];
  let blockHeading = '';

  const flush = () => {
    if (block.length >= 3) {
      const header = splitRow(block[0]);
      const isSeparator = /^\|?[\s:|-]+\|?$/.test(block[1]) && block[1].includes('-');
      const rows = block.slice(isSeparator ? 2 : 1).map(splitRow).filter((r) => r.some((c) => c.length));
      if (rows.length >= 2 && header.length >= 2) tables.push({ heading: blockHeading, header, rows });
    }
    block = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^\s*\|/.test(line)) {
      if (!block.length) blockHeading = heading;
      block.push(line.trim());
      continue;
    }
    if (block.length) flush();
    const h = line.match(/^#{2,4}\s+(.*)$/);
    if (h) heading = clean(h[1]);
  }
  if (block.length) flush();
  return tables;
}

interface ColumnPick {
  index: number;
  values: number[];
  score: number;
}

// 열 이름에 단위가 드러나야 그래프의 눈금을 독자가 오해하지 않습니다.
const UNIT_RE = /(원|%|퍼센트|률|율|W\b|Wh|kWh|mAh|MJ|dB|㎡|kcal|℃|명|건|대|개|시간|일|개월|점|회|L\b)/;

function pickColumn(table: MdTable): ColumnPick | null {
  let best: ColumnPick | null = null;
  const rowCount = table.rows.length;
  for (let i = 1; i < table.header.length; i++) {
    const head = table.header[i];
    if (!UNIT_RE.test(head)) continue;
    if (/가정|기준값/.test(head)) continue;
    const values: number[] = [];
    for (const row of table.rows) {
      const v = toNumber(row[i] ?? '');
      if (v !== null) values.push(v);
    }
    if (values.length < 3 || values.length / rowCount < 0.99) continue;
    const hi = Math.max(...values);
    const lo = Math.min(...values.filter((v) => v > 0));
    if (!Number.isFinite(lo) || hi / lo > 60) continue; // 단위가 섮인 열 제외
    let score = values.length / rowCount;
    if (PERCENT_WORDS.test(head)) score += 1.3;
    else if (MONEY_WORDS.test(head)) score += 1.2;
    else score += 0.5;
    if (new Set(values).size < 2) score -= 0.8;
    if (values.every((v) => v >= 1900 && v <= 2100)) score -= 1;
    score -= i * 0.05;
    if (!best || score > best.score) best = { index: i, values, score };
  }
  return best;
}

function valueFormatFor(header: string, values: number[]): ChartSpec['valueFormat'] {
  if (PERCENT_WORDS.test(header) && !MONEY_WORDS.test(header)) return 'percent';
  if (MONEY_WORDS.test(header)) return 'won';
  if (values.some((v) => !Number.isInteger(v))) return 'decimal1';
  return 'number';
}

/** 열 이름의 단위를 그래프 값 뒤에 붙일 문자열로 추출 (예: '소비전력(W)' → 'W') */
function unitOf(header: string): string {
  const m = header.match(/\(([^)]+)\)/);
  if (!m) return '';
  const unit = m[1].trim();
  return /^(원|%|퍼센트)$/.test(unit) || unit.length > 6 || /가정|기준/.test(unit) ? '' : unit;
}

function fromBodyTable(post: ChartInput): PostChart | null {
  const tables = parseTables(post.body);
  for (const table of tables.slice(0, 6)) {
    const pick = pickColumn(table);
    if (!pick || pick.score < 0.9) continue;
    const rows = table.rows.slice(0, 7);
    const labels = rows.map((r, i) => truncate(clean(r[0] ?? '') || `항목 ${i + 1}`, 210));
    const values = rows.map((r, i) => {
      const v = toNumber(r[pick.index] ?? '');
      return v ?? pick.values[Math.min(i, pick.values.length - 1)] ?? 1;
    });
    if (new Set(values).size < 2) continue;
    const header = clean(table.header[pick.index]);
    const format = valueFormatFor(header, values);
    const spec: ChartSpec = {
      type: 'hbar',
      title: truncate(`${header} 비교`, 620, 20),
      subtitle: table.heading ? truncate(table.heading, 700, 13) : truncate(post.title, 700, 13),
      labels,
      series: [{ name: header, values }],
      unit: format === 'won' || format === 'percent' ? '' : unitOf(header),
      valueFormat: format,
      source: '본문 비교표(같은 값)',
    };
    return {
      spec,
      svg: renderChart(spec),
      alt: chartAltText(spec),
      caption: `본문 표의 ‘${header}’ 값을 같은 숫자로 막대에 옮겼습니다. 표와 함께 보면 차이가 더 분명합니다.`,
    };
  }
  return null;
}

function fromAffiliate(post: ChartInput): PostChart | null {
  const group = getAffiliateRankingForPost(post.id);
  if (!group || group.products.length < 2) return null;
  const items: { label: string; price: number }[] = [];
  for (const p of group.products) {
    const m = (p.tag ?? '').match(/(\d{1,3}(?:,\d{3})+)\s*원/);
    if (!m) continue;
    items.push({ label: truncate(clean(p.productName), 210), price: Number(m[1].replace(/,/g, '')) });
  }
  if (items.length < 2) return null;
  const spec: ChartSpec = {
    type: 'hbar',
    title: '추천 제품 확인일 판매가 비교',
    subtitle: truncate(group.sectionTitle, 700, 13),
    labels: items.map((i) => i.label),
    series: [{ name: '판매가', values: items.map((i) => i.price), color: '#0f766e' }],
    valueFormat: 'won',
    source: '글 작성 시점 쿠팡 판매가(할인·쿠폰은 판매자 사정에 따라 변동)',
  };
  return {
    spec,
    svg: renderChart(spec),
    alt: chartAltText(spec),
    caption: '본문에서 비교한 제품의 확인일 판매가입니다. 쿠폰·카드 할인에 따라 실제 결제 금액은 달라질 수 있습니다.',
  };
}

/** 글마다 하나의 고유 차트를 만듭니다. 수치가 없으면 글의 판단 순서 도해로 대신합니다. */
export function buildPostChart(post: ChartInput): PostChart | null {
  return fromAffiliate(post) ?? fromBodyTable(post) ?? fromStructure(post);
}

/** 글마다 다른 '판단 순서' 도해 — 본문 소제목을 그대로 사용합니다. */
export function fromStructure(post: ChartInput): PostChart | null {
  const steps = post.body
    .split(/\r?\n/)
    .map((line) => line.match(/^##\s+(.+)$/)?.[1])
    .filter((h): h is string => Boolean(h))
    .map((h) => clean(h))
    .filter((h) => !/자주 묻는|FAQ|출처|참고 자료|마무리|정리하기|함께 보면/.test(h))
    .slice(0, 5);
  if (steps.length < 2) return null;

  const width = 760;
  const title = '이 글에서 순서대로 따져보는 것';
  const subtitle = truncate(post.title, 700, 13);
  const cardH = 52;
  const gap = 12;
  const top = 78;
  const height = top + steps.length * (cardH + gap) + 34;
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  let body = `<rect width="100%" height="100%" fill="#ffffff"/>`;
  body += `<text x="24" y="34" font-size="20" font-weight="700" fill="#1b1f23">${esc(title)}</text>`;
  body += `<text x="24" y="58" font-size="13" fill="#59636e">${esc(subtitle)}</text>`;
  steps.forEach((step, i) => {
    const y = top + i * (cardH + gap);
    body += `<rect x="24" y="${y}" width="${width - 48}" height="${cardH}" rx="10" fill="#f6f8f7" stroke="#e2e8e6"/>`;
    body += `<rect x="24" y="${y}" width="5" height="${cardH}" rx="2.5" fill="#0f766e"/>`;
    body += `<circle cx="56" cy="${y + cardH / 2}" r="15" fill="#0f766e"/>`;
    body += `<text x="56" y="${y + cardH / 2 + 5}" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">${i + 1}</text>`;
    body += `<text x="86" y="${y + cardH / 2 + 5.5}" font-size="15" fill="#1b1f23">${esc(truncate(step, 600, 15))}</text>`;
    if (i < steps.length - 1) {
      body += `<line x1="56" y1="${y + cardH}" x2="56" y2="${y + cardH + gap}" stroke="#cbd5d1" stroke-width="2"/>`;
    }
  });
  body += `<text x="24" y="${height - 14}" font-size="12" fill="#59636e">${esc('소제목을 그대로 옮긴 안내 도해 · 그래픽: 따져봄')}</text>`;

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-labelledby="flow-title flow-desc" font-family="-apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif">` +
    `<title id="flow-title">${esc(title)}</title>` +
    `<desc id="flow-desc">${esc(steps.map((s, i) => `${i + 1}단계 ${s}`).join(', '))}</desc>` +
    body +
    `</svg>\n`;

  return {
    svg,
    alt: `이 글에서 순서대로 따져보는 것: ${steps.map((s, i) => `${i + 1}단계 ${s}`).join(', ')}`,
    caption: '글이 다루는 순서를 한 장으로 정리했습니다. 각 단계는 본문의 같은 소제목으로 이어집니다.',
    spec: { type: 'hbar', title, labels: steps, series: [{ name: '단계', values: steps.map((_, i) => i + 1) }] },
  };
}

/** OG 이미지 등에 쓸 대표 수치 (글마다 다르게) */
export function keyFigures(post: ChartInput, limit = 2): string[] {
  const chart = fromAffiliate(post) ?? fromBodyTable(post);
  if (!chart) return [];
  const { spec } = chart;
  const values = spec.series[0].values;
  const order = values.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v).slice(0, limit);
  const fmt = (v: number) =>
    spec.valueFormat === 'won'
      ? `${Math.round(v).toLocaleString('ko-KR')}원`
      : spec.valueFormat === 'percent'
        ? `${v}%`
        : v.toLocaleString('ko-KR');
  return order.map(({ v, i }) => `${truncate(spec.labels[i], 200, 13)} ${fmt(v)}`);
}
