import { describe,it,expect } from 'vitest';
import {validateEvidence,validateIndependentReview,safeSourceUrl,diagramSvg} from '../automation/lib/server-editorial.ts';
import {reserveCall,assertEditorialPairBudget} from '../automation/lib/ai-budget.ts';
import {interactionText,readInteractionStream} from '../automation/lib/ai-provider.ts';
import {selectSourceExcerpt,sourceKeywords} from '../automation/lib/source-excerpts.ts';
import {shouldHoldTopic} from '../automation/lib/editorial-failure.ts';
describe('서버 발행 근거 보호',()=>{
  it('작성만 가능한 잔여 예산이면 시작 전 차단하고 사용량은 바꾸지 않는다',()=>{
    const state={day:'2026-10-11',month:'2026-10',dailyCalls:3,monthlyCalls:20,reservedTokens:2000000};
    expect(()=>assertEditorialPairBudget(state,'2026-10-11')).toThrow('무료 호출 보호 한도');
    expect(state.dailyCalls).toBe(3);
    expect(()=>assertEditorialPairBudget({...state,dailyCalls:2},'2026-10-11')).not.toThrow();
    expect(()=>assertEditorialPairBudget({...state,dailyCalls:0,monthlyCalls:123},'2026-10-11')).toThrow();
  });
  it('시험·공급자 지연은 주제를 영구 차단하지 않고 근거 오류는 보류한다',()=>{
    expect(shouldHoldTopic('원문과 일치하는 근거가 없는 사실',false)).toBe(true);
    expect(shouldHoldTopic('원문과 일치하는 근거가 없는 사실',true)).toBe(false);
    expect(shouldHoldTopic('무료 글 작성 시간 초과 (420초, 단계: stream-received)',false)).toBe(false);
    expect(shouldHoldTopic('무료 AI 응답 503: 재시도 없이 중단',false)).toBe(false);
    expect(shouldHoldTopic('무료 호출 보호 한도',false)).toBe(false);
  });
  it('긴 공식 문서는 질문과 관련 있는 뒷부분도 포함해 입력량을 제한한다',()=>{
    const raw='Official scope and eligibility. ' + 'Generic introduction sentence. '.repeat(120) +
      'File History supports backup and restore options. ' + 'Other introductory details. '.repeat(120) +
      'System protection and restore points have separate purposes. ' + 'Other notes. '.repeat(120);
    const keywords=sourceKeywords('windows-backup-file-history-restore-guide');
    const extracted=selectSourceExcerpt(raw,keywords,2600);
    expect(extracted.length).toBeLessThanOrEqual(2600);
    expect(extracted).toContain('Official scope');
    expect(extracted).toContain('File History supports backup');
    expect(extracted).toContain('System protection and restore points');
    expect(raw.replace(/\s+/g,' ').includes(extracted.slice(0,25))).toBe(true);
  });
  it('구두점 없는 긴 원문도 적정 크기로 발췌한다',()=>{
    const extracted=selectSourceExcerpt(('backup file history restore and details ').repeat(2000),['backup','restore']);
    expect(extracted.length).toBeGreaterThan(500);
    expect(extracted.length).toBeLessThanOrEqual(4600);
  });
  it('스트림의 한글 바이트 경계를 보존하고 사고 단계는 제외한다',async()=>{
    const events=[{event_type:'step.start',index:0,step:{type:'thought'}},{event_type:'step.delta',index:0,delta:{type:'text',text:'검토 메모'}},{event_type:'step.start',index:1,step:{type:'model_output'}},{event_type:'step.delta',index:1,delta:{type:'text',text:'{"body":"한글 본문"}'}},{event_type:'interaction.completed',interaction:{status:'completed'}}];
    const bytes=new TextEncoder().encode(events.map(e=>'data: '+JSON.stringify(e)+'\n\n').join('')+'data: [DONE]\n\n');
    const stream=new ReadableStream({start(c){for(let i=0;i<bytes.length;i+=3)c.enqueue(bytes.slice(i,i+3));c.close();}});
    expect(await readInteractionStream(new Response(stream))).toBe('{"body":"한글 본문"}');
  });
  it('텍스트가 일부 있어도 종료 확인이 없는 스트림은 차단한다',async()=>{
    const data=[{event_type:'step.start',index:1,step:{type:'model_output'}},{event_type:'step.delta',index:1,delta:{type:'text',text:'미완성'}}].map(e=>'data: '+JSON.stringify(e)+'\n\n').join('')+'data: [DONE]\n\n';
    await expect(readInteractionStream(new Response(data))).rejects.toThrow('미완료');
  });
  it('공식 완료 이벤트가 오면 열린 연결의 종료를 기다리지 않고 완성 응답을 반환한다',async()=>{
    const events=[{event_type:'step.start',index:1,step:{type:'model_output'}},{event_type:'step.delta',index:1,delta:{type:'text',text:'{"body":"본문"}'}},{event_type:'interaction.completed',interaction:{status:'completed'}}];
    const raw=events.map(e=>'data: '+JSON.stringify(e)+'\n\n').join('');
    let canceled=false;
    const stream=new ReadableStream({start(c){c.enqueue(new TextEncoder().encode(raw));},cancel(){canceled=true;}});
    const trace:string[]=[];
    const answer=await Promise.race([readInteractionStream(new Response(stream),event=>trace.push(event.kind)),new Promise<never>((_,reject)=>setTimeout(()=>reject(new Error('완료 이벤트를 놓침')),500))]);
    expect(answer).toBe('{"body":"본문"}');
    expect(trace).toEqual(['response','first-output','output-chunk','completed']);
    expect(canceled).toBe(true);
  });
  it('완료 이벤트여도 실패한 상태는 폐기한다',async()=>{
    const raw=['data: '+JSON.stringify({event_type:'step.start',index:1,step:{type:'model_output'}}),'data: '+JSON.stringify({event_type:'step.delta',index:1,delta:{type:'text',text:'미확인'}}),'data: '+JSON.stringify({event_type:'interaction.completed',interaction:{status:'failed'}})].join('\n\n')+'\n\n';
    await expect(readInteractionStream(new Response(raw))).rejects.toThrow('정상 완료되지 않은');
  });
  it('새 작성 응답에서 중간 상태와 사고 단계는 공개 본문으로 처리하지 않는다',()=>{
    expect(()=>interactionText({status:'incomplete',steps:[{type:'model_output',content:[{type:'text',text:'미완료'}]}]})).toThrow();
    expect(interactionText({status:'completed',steps:[{type:'thought',content:[{type:'text',text:'검토 메모'}]},{type:'model_output',content:[{type:'text',text:'{"body":"본문"}'}]}]})).toBe('{"body":"본문"}');
  });
  it('승인된 추가 시험 예외가 다음 날짜와 일반 예약에 번지지 않는다',()=>{
    const prior=process.env.EDITORIAL_PREVIEW_EXCEPTION;
    process.env.EDITORIAL_PREVIEW_EXCEPTION='2026-10-10';
    try {
      const state={day:'2026-10-10',month:'2026-10',dailyCalls:4,monthlyCalls:4,reservedTokens:400000};
      expect(reserveCall(state,'2026-10-10',100000).dailyCalls).toBe(5);
      expect(()=>reserveCall({...state,day:'2026-10-11'},'2026-10-11',100000)).toThrow();
      delete process.env.EDITORIAL_PREVIEW_EXCEPTION;
      expect(()=>reserveCall(state,'2026-10-10',100000)).toThrow();
    } finally {if(prior===undefined)delete process.env.EDITORIAL_PREVIEW_EXCEPTION;else process.env.EDITORIAL_PREVIEW_EXCEPTION=prior;}
  });
  it('있는 원문이라도 실제 짧은 근거가 없으면 거절한다',()=>{
    const facts=Array.from({length:12},()=>({claim:'점검',sourceUrl:'https://support.google.com/example',evidence:'존재하지 않는 원문 근거입니다'}));
    expect(()=>validateEvidence(facts,[{url:facts[0].sourceUrl,text:'실제 공식 자료는 다른 내용입니다'}])).toThrow();
  });
  it('다른 주소·사설 주소·위장 도메인을 수집하지 않는다',()=>{
    for(const url of ['https://google.com.attacker.test/','https://127.0.0.1/','http://support.google.com/','https://user@support.google.com/']) expect(()=>safeSourceUrl(url)).toThrow();
    expect(safeSourceUrl('https://support.google.com/chrome/').hostname).toBe('support.google.com');
  });
  it('승인 문구만으로 사실 검토를 통과시키지 않는다',()=>{
    expect(()=>validateIndependentReview({approved:true,problems:[]})).toThrow();
    expect(()=>validateIndependentReview({approved:true,allFactualClaimsSupported:true,noFabricatedExperience:true,noUnresolvedConflicts:true,noUnsupportedNumbers:true,expertDepth:true,naturalKorean:true,checkedClaims:Array(12).fill({}),problems:['미확인 사실']})).toThrow();
  });
  it('도해 문구를 코드로 실행하지 않고 글자로 처리한다',()=>{
    expect(diagramSvg(['<script>','자료 저장','설정 비교','결과 기록'])).toContain('&lt;script&gt;');
    expect(()=>diagramSvg(['하나'])).toThrow();
  });
});
