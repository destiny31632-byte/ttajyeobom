import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ROOT} from '../lib/paths.ts';
const file=path.join(ROOT,'editorial-ledger/last-run.json');
if(!fs.existsSync(file))process.exit(0);
const report=JSON.parse(fs.readFileSync(file,'utf8'));
const files=['editorial-ledger/'];
if(report.newPost){
  if(!/^[a-z0-9][a-z0-9-]*$/.test(report.newPost))throw new Error('잘못된 발행 경로');
  const slug=report.newPost;
  files.push(`src/content/posts/${slug}.md`,`automation/research/${slug}.json`,`automation/reviews/${slug}.json`,`public/images/posts/${slug}/steps.svg`);
}
function git(args:string[]){const r=spawnSync('git',args,{cwd:ROOT,stdio:'inherit'});if(r.status!==0)throw new Error('발행 저장소 기록 실패');}
git(['add','--',...files]);
const diff=spawnSync('git',['diff','--cached','--quiet'],{cwd:ROOT});
if(diff.status===0)process.exit(0);
git(['commit','-m',report.newPost?`Publish reviewed guide ${report.newPost}`:'Record editorial status without publishing']);
git(['push','origin','HEAD:master']);
