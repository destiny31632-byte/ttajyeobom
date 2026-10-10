import fs from 'node:fs';
import path from 'node:path';
import { STATE_DIR } from './paths.ts';
import { writeJson } from './fsutil.ts';
import { env, envBool } from './env.ts';
import { kstDate } from './time.ts';
import { reserveCall, type UsageBudget } from './ai-budget.ts';
import { spawnSync } from 'node:child_process';
import { ROOT } from './paths.ts';

export interface TextProvider { generate(prompt: string): Promise<string> }
export function interactionText(data:any):string {
  if(data?.status!=='completed')throw new Error('완료되지 않은 작성 응답: 발행 보류');
  const text=(data.steps??[]).filter((s:any)=>s.type==='model_output').flatMap((s:any)=>s.content??[]).filter((p:any)=>p.type==='text').map((p:any)=>p.text??'').join('');
  if(!text.trim())throw new Error('작성 본문 없음');
  return text;
}
export class GeminiFreeProvider implements TextProvider {
  async generate(prompt: string): Promise<string> {
    if (envBool('AI_DISABLED', true)) throw new Error('AI 호출 비활성화');
    // 이 확인값은 공급자의 실제 과금 차단을 대신하지 않습니다.
    if (env('AI_BILLING_TIER') !== 'free-unlinked-confirmed') throw new Error('결제 계정 미연결 무료 프로젝트 확인 필요');
    const key = env('GEMINI_API_KEY');
    const model = env('GEMINI_MODEL');
    if (!key || !['gemini-3.8-flash','gemini-3.6-flash'].includes(model)) throw new Error('검증한 무료 모델 및 API 키 설정 필요');
    const verified = Date.parse(env('FREE_PROVIDER_VERIFIED_AT'));
    if (!Number.isFinite(verified) || Date.now() < verified || Date.now() - verified > 30 * 86400000) throw new Error('30일 이내 무료 프로젝트·결제 미연결 재확인 필요');
    if (prompt.length > 80_000) throw new Error('프롬프트 크기 제한 초과');
    const file = process.env.SERVER_EDITORIAL === 'true' ? path.join(ROOT,'editorial-ledger','usage.json') : path.join(STATE_DIR, 'ai-usage.json');
    const lock = path.join(STATE_DIR, 'ai.lock');
    fs.mkdirSync(STATE_DIR, { recursive: true });
    let fd: number;
    try { fd = fs.openSync(lock, 'wx'); } catch { throw new Error('다른 AI 실행 중 또는 이전 잠금 점검 필요'); }
    try {
      let previous: UsageBudget | null = null;
      if (fs.existsSync(file)) previous = JSON.parse(fs.readFileSync(file, 'utf8'));
      // 요청 전에 예산을 예약합니다. 실패해도 환원·재시도하지 않습니다.
      writeJson(file, reserveCall(previous, kstDate(), 100_000));
      // 서버가 중간에 종료돼도 예약량을 잃지 않도록 요청 전에 원격에 기록합니다.
      if(process.env.SERVER_EDITORIAL === 'true') {
        for(const args of [['add','--','editorial-ledger/usage.json'],['commit','-m','Reserve free editorial request budget'],['push','origin','HEAD:master']]) {
          const r=spawnSync('git',args,{cwd:ROOT,stdio:'inherit'});
          if(r.status!==0) throw new Error('사용량 원격 기록 실패: 요청하지 않습니다.');
        }
      }
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
        method: 'POST', signal: AbortSignal.timeout(300000),
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({ model,input:prompt,store:false,generation_config:{max_output_tokens:14000,temperature:0.3,thinking_level:'low'},response_format:{type:'text',mime_type:'application/json',schema:{type:'object',properties:{body:{type:'string'},approved:{type:'boolean'},refused:{type:'boolean'}}}} }),
      });
      if (!res.ok) throw new Error(`무료 AI 응답 ${res.status}: 재시도·유료 전환 없이 중단`);
      return interactionText(await res.json());
    } finally { fs.closeSync(fd); fs.unlinkSync(lock); }
  }
}
