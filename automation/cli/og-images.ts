// 글마다 다른 OG(공유) 이미지 생성기 — 1200x630 PNG, sharp 렌더링.
// 사용: node automation/cli/og-images.ts [slug ...]
//   결과는 public/images/og/<slug>.png 로 저장하고 커밋합니다.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { ROOT } from '../lib/paths.ts';
import { loadPosts } from '../lib/content.ts';
import { CATEGORIES } from '../../src/config/taxonomy.ts';
import { buildPostChart, keyFigures } from '../../src/lib/post-chart.ts';

const OUT_DIR = path.join(ROOT, 'public', 'images', 'og');
const WIDTH = 1200;
const HEIGHT = 630;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** 대략적인 글자 폭 (한글 1em, 영문·숫자 0.55em) */
function textWidth(text: string, size: number): number {
  let w = 0;
  for (const ch of text) w += /[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af\u4e00-\u9fff]/.test(ch) ? 1 : ch === ' ' ? 0.32 : 0.56;
  return w * size;
}

function wrap(text: string, size: number, maxWidth: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = '';
  for (const word of words) {
    const next = cur ? `${cur} ${word}` : word;
    if (textWidth(next, size) <= maxWidth) {
      cur = next;
      continue;
    }
    if (cur) lines.push(cur);
    cur = word;
    if (lines.length === maxLines) break;
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  if (lines.length === maxLines) {
    const rest = words.slice(lines.join(' ').split(/\s+/).length);
    if (rest.length && !lines[maxLines - 1].endsWith('…')) {
      let last = lines[maxLines - 1];
      while (textWidth(last + '…', size) > maxWidth && last.length > 1) last = last.slice(0, -1);
      lines[maxLines - 1] = `${last.trimEnd()}…`;
    }
  }
  return lines;
}

function svgFor(title: string, categoryName: string, figures: string[], tags: string[]): string {
  let size = 56;
  let lines = wrap(title, size, 940, 3);
  while (lines.length > 3 || lines.some((l) => textWidth(l, size) > 950)) {
    size -= 4;
    lines = wrap(title, size, 940, 3);
    if (size <= 34) break;
  }
  const lineHeight = Math.round(size * 1.32);
  const blockH = lines.length * lineHeight;
  const titleTop = 300 - blockH / 2 + size;

  const pills = figures.length ? figures.slice(0, 2) : tags.slice(0, 2).map((t) => `#${t}`);
  const pillSvg = pills
    .map((f, i) => {
      const y = 452 + i * 56;
      const label = f.length > 42 ? `${f.slice(0, 41)}…` : f;
      return (
        `<rect x="90" y="${y}" width="${Math.min(1020, Math.round(textWidth(label, 26)) + 56)}" height="44" rx="22" fill="#ffffff" fill-opacity="0.14" stroke="#99f6e4" stroke-opacity="0.45"/>` +
        `<text x="118" y="${y + 29}" font-size="26" fill="#d7f5f1">${esc(label)}</text>`
      );
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" font-family="Noto Sans CJK KR, Noto Sans KR, sans-serif">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f766e"/><stop offset="1" stop-color="#083c39"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <g opacity="0.10" fill="#ffffff">
    <rect x="930" y="382" width="52" height="180" rx="8"/>
    <rect x="1002" y="318" width="52" height="244" rx="8"/>
    <rect x="1074" y="236" width="52" height="326" rx="8"/>
  </g>
  <g transform="translate(90,66)">
    <rect width="46" height="46" rx="12" fill="#5eead4" fill-opacity="0.9"/>
    <rect x="9" y="27" width="6" height="10" rx="2" fill="#0f766e"/>
    <rect x="19" y="21" width="6" height="16" rx="2" fill="#0f766e"/>
    <rect x="29" y="15" width="6" height="22" rx="2" fill="#0f766e"/>
    <text x="62" y="33" font-size="30" font-weight="700" fill="#ffffff">따져봄</text>
  </g>
  <rect x="90" y="140" width="${Math.round(textWidth(categoryName, 22)) + 40}" height="38" rx="19" fill="#ffffff" fill-opacity="0.16"/>
  <text x="110" y="166" font-size="22" fill="#ccfbf1">${esc(categoryName)}</text>
  ${lines.map((line, i) => `<text x="90" y="${titleTop + i * lineHeight}" font-size="${size}" font-weight="700" fill="#ffffff">${esc(line)}</text>`).join('')}
  ${pillSvg}
  <text x="90" y="${HEIGHT - 40}" font-size="24" fill="#a7f3d0">ttajyeobom.com · 숫자로 따져보는 생활 가이드</text>
</svg>`;
}

async function main() {
  const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const posts = loadPosts().filter((p) => (only.length ? only.includes(p.slug) : !p.data.draft));
  fs.mkdirSync(OUT_DIR, { recursive: true });
  let made = 0;
  for (const post of posts) {
    const category = CATEGORIES.find((c) => c.slug === post.data.category);
    const input = { id: post.slug, title: post.data.title, body: post.body };
    const chart = buildPostChart(input);
    const figures = chart && chart.spec.source ? keyFigures(input, 2) : [];
    const svg = svgFor(post.data.title, category?.name ?? '생활 가이드', figures, post.data.tags ?? []);
    const file = path.join(OUT_DIR, `${post.slug}.png`);
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toFile(file);
    made++;
  }
  const total = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('.png')).length;
  console.log(`OG 이미지 ${made}개 생성 (${path.relative(ROOT, OUT_DIR)} 누적 ${total}개)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
