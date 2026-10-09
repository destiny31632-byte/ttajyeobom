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
const buildId = crypto.createHash('sha256').update(JSON.stringify(pages)).digest('hex');
fs.writeFileSync('dist/build.json', JSON.stringify({ buildId, pages }) + '\n');
console.log(`Build manifest: ${Object.keys(pages).length} pages, ${buildId.slice(0, 12)}`);
