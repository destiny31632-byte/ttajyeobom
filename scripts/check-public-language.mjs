import fs from 'node:fs';
import path from 'node:path';
import { parseHTML } from 'linkedom';

const prohibited = new RegExp(`\\b${String.fromCharCode(65,73)}\\b|인공지능`, 'iu');
const root = path.resolve('dist');
let checked = 0;
function inspect(dir) {
  for (const item of fs.readdirSync(dir, {withFileTypes:true})) {
    const file = path.join(dir,item.name);
    if (item.isDirectory()) inspect(file);
    else if (item.name.endsWith('.html')) {
      const {document} = parseHTML(fs.readFileSync(file,'utf8'));
      for (const element of document.querySelectorAll('script,style,template')) element.remove();
      const visible = document.documentElement?.textContent ?? '';
      const metadata = [...document.querySelectorAll('meta[content]')].map(e=>e.getAttribute('content')).join('\n');
      if (prohibited.test(`${visible}\n${metadata}`)) throw new Error(`공개 문구에 금지 표현이 있습니다: ${path.relative(root,file)}`);
      checked++;
    }
  }
}
inspect(root);
if (!checked) throw new Error('검사할 공개 페이지 없음');
console.log(`공개 문구 검사: ${checked}개 페이지 통과`);
