import fs from 'node:fs';
import path from 'node:path';
import {createMarkdownProcessor} from '@astrojs/markdown-remark';
import {loadPosts} from '../lib/content.ts';
import {validateLongDraft,validateEvidence,validateIndependentReview,diagramSvg} from '../lib/server-editorial.ts';
import {countChars} from '../../src/lib/shared/korean.ts';
const dir=path.resolve(process.argv[2]);
const output=path.resolve(process.argv[3]);
const g=JSON.parse(fs.readFileSync(path.join(dir,'draft.json'),'utf8'));
const material=JSON.parse(fs.readFileSync(path.join(dir,'sources.json'),'utf8'));
if(g.refused)throw new Error('본문이 없는 거절 결과');
validateLongDraft(g,material.topic.sources.map((s:any)=>s.url),material.internal.map((p:any)=>p.url));
const checks:any={chars:countChars(g.body),evidence:false,independent:false};
try{validateEvidence(g.facts,material.sources);checks.evidence=true;}catch(e){checks.evidenceProblem=String(e);}
if(fs.existsSync(path.join(dir,'review.json'))){const r=JSON.parse(fs.readFileSync(path.join(dir,'review.json'),'utf8'));try{validateIndependentReview(r);validateEvidence(r.checkedClaims,material.sources);checks.independent=true;}catch(e){checks.reviewProblem=String(e);}}
fs.mkdirSync(output,{recursive:true});
const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const markdown=`# ${material.topic.title}\n\n${g.summary.map((s:string)=>`- ${s}`).join('\n')}\n\n${g.body}\n\n## 확인한 공식 자료\n\n${material.topic.sources.map((s:any)=>`- [${s.title}](${s.url})`).join('\n')}\n`;
fs.writeFileSync(path.join(output,'article.md'),markdown);
const rendered=await (await createMarkdownProcessor({syntaxHighlight:false})).render(markdown);
fs.writeFileSync(path.join(output,'article.html'),`<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${esc(material.topic.title)}</title><style>body{margin:0;background:#f6f7f9;color:#1f2937;font:18px/1.85 system-ui,sans-serif}main{max-width:900px;margin:32px auto;background:white;padding:40px;border-radius:18px}h1{font-size:32px;line-height:1.4}h2{margin-top:48px;font-size:26px}h3{font-size:21px;margin-top:30px}table{border-collapse:collapse;font-size:15px;display:block;overflow:auto}th,td{border:1px solid #cbd5e1;padding:12px;min-width:105px}th{background:#f0fdfa}a{color:#087f72}svg{width:100%;height:auto}.notice{background:#fff7ed;padding:16px;border-radius:10px;font-size:15px}@media(max-width:600px){main{padding:22px;margin:0}body{font-size:16px}h1{font-size:26px}}</style><main><p class="notice">운영자 검토용 초안입니다. 공개 사이트에 발행한 글이 아닙니다.</p>${rendered.code}${diagramSvg(g.diagram)}</main></html>`);
fs.writeFileSync(path.join(output,'checks.json'),JSON.stringify(checks,null,2));
console.log(JSON.stringify(checks,null,2));
