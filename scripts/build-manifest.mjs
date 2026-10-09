import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const pages = {};
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) walk(file);
    else if (item.name.endsWith('.html') || ['rss.xml', 'sitemap.xml'].includes(item.name)) {
      const relative = path.relative('dist', file).replaceAll('\\', '/');
      const route = '/' + relative.replace(/index\.html$/, '');
      pages[route] = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    }
  }
}
walk('dist');
// 파일시스템의 Windows/Linux 정렬 차이가 빌드 ID를 바꾸지 않게 합니다.
const stablePages = Object.fromEntries(Object.entries(pages).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
const buildId = crypto.createHash('sha256').update(JSON.stringify(stablePages)).digest('hex');
fs.writeFileSync('dist/build.json', JSON.stringify({ buildId, pages: stablePages }) + '\n');
console.log(`Build manifest: ${Object.keys(pages).length} pages, ${buildId.slice(0, 12)}`);
