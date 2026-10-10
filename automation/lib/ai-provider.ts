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
const evidenceSchema={type:'array',items:{type:'object',properties:{claim:{type:'string'},sourceUrl:{type:'string'},evidence:{type:'string'}},required:['claim','sourceUrl','evidence']}};
const responseSchema={type:'object',properties:{body:{type:'string'},description:{type:'string'},summary:{type:'array',items:{type:'string'}},facts:evidenceSchema,diagram:{type:'array',items:{type:'string'}},approved:{type:'boolean'},refused:{type:'boolean'},reason:{type:'string'},allFactualClaimsSupported:{type:'boolean'},noFabricatedExperience:{type:'boolean'},noUnresolvedConflicts:{type:'boolean'},noUnsupportedNumbers:{type:'boolean'},expertDepth:{type:'boolean'},naturalKorean:{type:'boolean'},problems:{type:'array',items:{type:'string'}},checkedClaims:evidenceSchema}};
const writerFields=['body','description','summary','facts','diagram','refused','reason'];
const reviewFields=['approved','allFactualClaimsSupported','noFabricatedExperience','noUnresolvedConflicts','noUnsupportedNumbers','expertDepth','naturalKorean','problems','checkedClaims'];
export function interactionText(data:any):string {
  if(data?.status!=='completed')throw new Error('완료되지 않은 작성 응답: 발행 보류');
  const text=(data.steps??[]).filter((s:any)=>s.type==='model_output').flatMap((s:any)=>s.content??[]).filter((p:any)=>p.type==='text').map((p:any)=>p.text??'').join('');
  if(!text.trim())throw new Error('작성 본문 없음');
  return text;
}
type StreamEvent = { kind: 'response' | 'first-output' | 'output-chunk' | 'completed'; chars: number };
export async function readInteractionStream(response:Response,onEvent?:(event:StreamEvent)=>void):Promise<string> {
  if(!response.body)throw new Error('작성 스트림 없음');
  const reader=response.body.getReader();const decoder=new TextDecoder();
  let pending='',text='',complete=false;const outputSteps=new Set<number>();
  const line=(raw:string)=>{
    if(!raw.startsWith('data:'))return;
    const payload=raw.slice(5).trim();
    if(!payload||payload==='[DONE]')return;
    const event=JSON.parse(payload);
    if(event.event_type==='step.start'&&event.step?.type==='model_output')outputSteps.add(event.index);
    if(event.event_type==='step.delta'&&outputSteps.has(event.index)&&event.delta?.type==='text'){
      if(!text.length)onEvent?.({kind:'first-output',chars:0});
      text+=event.delta.text??'';
      onEvent?.({kind:'output-chunk',chars:text.length});
    }
    if(event.event_type==='interaction.completed'){
      complete=event.interaction?.status==='completed';
      if(!complete)throw new Error('정상 완료되지 않은 작성 응답: 발행 보류');
      onEvent?.({kind:'completed',chars:text.length});
    }
    if(event.event_type==='error'||event.event_type==='interaction.failed')throw new Error('작성 전송 오류: 발행 보류');
  };
  onEvent?.({kind:'response',chars:0});
  while(!complete){const r=await reader.read();if(r.done)break;pending+=decoder.decode(r.value,{stream:true});let i:number;while((i=pending.indexOf('\n'))>=0){line(pending.slice(0,i).trimEnd());pending=pending.slice(i+1);if(complete)break;}if(text.length+pending.length>1_000_000)throw new Error('작성 응답 크기 초과');}
  // 공식 규격상 interaction.completed가 최종 이벤트입니다. 연결이 닫히거나
  // 후속 [DONE] 마커가 오기를 기다리다 제한 시간에 걸리지 않도록 합니다.
  if(complete){void reader.cancel().catch(()=>{});if(!text.trim())throw new Error('작성 본문 없음');return text;}
  pending+=decoder.decode();if(pending.trim())line(pending.trimEnd());
  if(!complete||!text.trim())throw new Error('작성 전송 미완료: 발행 보류');
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
      const started=Date.now();
      const diagnosis:{stage:string;firstOutputMs:number|null;outputChars:number}={stage:'request',firstOutputMs:null,outputChars:0};
      try {
        const res = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions?alt=sse', {
          method: 'POST', signal: AbortSignal.timeout(420000),
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
          body: JSON.stringify({ model,input:prompt,store:false,stream:true,generation_config:{max_output_tokens:14000,temperature:0.3,thinking_level:'low'},response_format:{type:'text',mime_type:'application/json',schema:{type:'object',properties:Object.fromEntries((prompt.startsWith('작성자의 판단')?reviewFields:writerFields).map(k=>[k,responseSchema.properties[k]])),required:prompt.startsWith('작성자의 판단')?reviewFields:writerFields}} }),
        });
        diagnosis.stage='http-response';
        if (!res.ok) throw new Error(`무료 AI 응답 ${res.status}: 재시도·유료 전환 없이 중단`);
        return await readInteractionStream(res,event=>{
          if(event.kind==='response')diagnosis.stage='stream-received';
          if(event.kind==='first-output'){diagnosis.stage='model-output';diagnosis.firstOutputMs=Date.now()-started;}
          if(event.kind==='output-chunk')diagnosis.outputChars=event.chars;
          if(event.kind==='completed'){diagnosis.stage='completed';diagnosis.outputChars=event.chars;}
        });
      } catch(error) {
        const elapsedMs=Date.now()-started;
        const timeout=error instanceof Error && (error.name==='TimeoutError'||/timeout|timed out|시간 초과/i.test(error.message));
        // 문서·본문·키를 로그에 기록하지 않습니다. 미완료 본문은 발행 불가입니다.
        console.warn(JSON.stringify({kind:'editorial-provider-failure',model,stage:diagnosis.stage,elapsedMs,firstOutputMs:diagnosis.firstOutputMs,receivedChars:diagnosis.outputChars,timeout}));
        if(timeout)throw new Error(`무료 글 작성 시간 초과 (${Math.round(elapsedMs/1000)}초, 단계: ${diagnosis.stage}): 발행 보류`);
        throw error;
      }
    } finally { fs.closeSync(fd); fs.unlinkSync(lock); }
  }
}
