import { countChars } from '../../src/lib/shared/korean.ts';
import { extractHeadings, countTables, extractLinks } from './content.ts';
import { isOfficialSource } from './source-audit.ts';

export const PUBLIC_PROHIBITED = new RegExp(`\\b${String.fromCharCode(65,73)}\\b|인공지능`, 'iu');
export type Evidence = { claim: string; sourceUrl: string; evidence: string };
export type SourceText = { url: string; text: string };
export function validateEvidence(facts: Evidence[], sources: SourceText[]) {
  if (!Array.isArray(facts) || facts.length < 12) throw new Error('확인한 사실 최소 12개 필요');
  const normalize = (s: string) => s.replace(/\s+/g,' ').trim();
  for (const [index,f] of facts.entries()) {
    const source = sources.find(s=>s.url === f.sourceUrl);
    if (!source || typeof f.claim !== 'string' || !f.claim.trim() || typeof f.evidence !== 'string' || f.evidence.length < 12 || f.evidence.length > 100 || !normalize(source.text).includes(normalize(f.evidence))) throw new Error(`원문과 일치하는 짧은 근거가 없는 사실: ${index+1}번`);
  }
}
export function validateLongDraft(g: any, sourceUrls: string[], internalUrls: string[]) {
  if (!g || typeof g.body !== 'string' || typeof g.description !== 'string' || !Array.isArray(g.summary)) throw new Error('초안 형식 오류');
  if (countChars(g.body) < 5000 || countChars(g.body) > 14000) throw new Error('본문 공백 제외 5,000~14,000자 필요');
  if (PUBLIC_PROHIBITED.test([g.body,g.description,...g.summary].join('\n'))) throw new Error('공개 금지 표현');
  if (/<\/?[a-z][^>]*>|javascript:|data:text\/html/i.test(g.body)) throw new Error('실행 가능한 문구·HTML 금지');
  const headings = extractHeadings(g.body);
  if (headings.filter(h=>h.depth===2).length < 8 || countTables(g.body)<3) throw new Error('심층 설명 8개·표 3개 필요');
  const faq = g.body.split(/^## 자주 묻는 질문\s*$/m)[1]?.split(/^## /m)[0] ?? '';
  if (extractHeadings(faq).filter(h=>h.depth===3).length<6) throw new Error('실용 질문 6개 필요');
  for(const link of extractLinks(g.body)) {
    if (!sourceUrls.includes(link.href) && !internalUrls.includes(link.href)) throw new Error('조사하지 않은 외부 주소 또는 없는 내부 주소');
  }
  if (new Set(extractLinks(g.body).filter(l=>internalUrls.includes(l.href)).map(l=>l.href)).size<2) throw new Error('관련 내부 글 링크 2개 필요');
}
export function safeSourceUrl(raw: string) {
  const url = new URL(raw);
  if (!isOfficialSource(url) || url.port || url.hash) throw new Error('허용된 공식 HTTPS 주소만 수집');
  return url;
}
export function validateIndependentReview(r: any) {
  if (!r || r.approved!==true || r.allFactualClaimsSupported!==true || r.noFabricatedExperience!==true || r.noUnresolvedConflicts!==true || r.noUnsupportedNumbers!==true || r.expertDepth!==true || r.naturalKorean!==true || !Array.isArray(r.problems) || r.problems.length || !Array.isArray(r.checkedClaims) || r.checkedClaims.length<12) throw new Error('독립 원문·문장 검토 미통과');
}
export function diagramSvg(labels: string[]) {
  if(!Array.isArray(labels) || labels.length!==4 || labels.some(s=>typeof s!=='string'||s.length>18||PUBLIC_PROHIBITED.test(s))) throw new Error('도해 문구 형식 오류');
  const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]!));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 520" role="img"><title>편집부 권장 점검 순서</title><rect width="760" height="520" rx="24" fill="#f0fdfa"/><text x="380" y="52" text-anchor="middle" font-size="25" fill="#134e4a" font-family="sans-serif">편집부 권장 점검 순서</text>${labels.map((s,i)=>`<rect x="55" y="${85+i*100}" width="650" height="72" rx="14" fill="#fff" stroke="#0f766e"/><text x="380" y="${130+i*100}" text-anchor="middle" font-size="24" font-family="sans-serif" fill="#134e4a">${i+1}. ${escape(s)}</text>${i<3?`<path d="M380 ${163+i*100}v16m-7-7 7 7 7-7" fill="none" stroke="#0f766e" stroke-width="3"/>`:''}`).join('')}<text x="380" y="500" text-anchor="middle" font-size="15" font-family="sans-serif" fill="#475569">본문의 권장 절차 요약 · 제조사의 측정 결과가 아닙니다</text></svg>`;
}
