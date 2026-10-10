import { describe,it,expect } from 'vitest';
import {validateEvidence,validateIndependentReview,safeSourceUrl,diagramSvg} from '../automation/lib/server-editorial.ts';
describe('서버 발행 근거 보호',()=>{
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
