// SVG 차트 만들기
// 사용: node automation/cli/chart.ts --spec chart.json --out public/images/posts/<slug>/<name>.svg
//  spec 형식은 automation/lib/chart.ts 의 ChartSpec 참고
import fs from 'node:fs';
import path from 'node:path';
import { chartAltText, renderChart, type ChartSpec } from '../lib/chart.ts';
import { ensureDir } from '../lib/fsutil.ts';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

const specPath = arg('spec');
const out = arg('out');
if (!specPath || !out) {
  console.error('사용법: node automation/cli/chart.ts --spec <spec.json> --out <public/images/posts/slug/name.svg>');
  process.exit(2);
}
if (!out.replace(/\\/g, '/').includes('public/images/')) {
  console.error('출력 경로는 public/images/ 아래여야 합니다.');
  process.exit(2);
}
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8')) as ChartSpec;
const svg = renderChart(spec);
ensureDir(path.dirname(out));
fs.writeFileSync(out, svg, 'utf8');
const src = '/' + out.replace(/\\/g, '/').split('public/')[1];
console.log(JSON.stringify({ src, bytes: Buffer.byteLength(svg), suggestedAlt: chartAltText(spec) }, null, 2));
