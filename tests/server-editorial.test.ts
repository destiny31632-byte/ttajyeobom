import { describe,it,expect } from 'vitest';
import {validateEvidence,validateIndependentReview,safeSourceUrl,diagramSvg} from '../automation/lib/server-editorial.ts';
import {reserveCall} from '../automation/lib/ai-budget.ts';
describe('서버 발행 근거 보호',()=>{
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
