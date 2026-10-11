import type { Evidence,SourceText } from './server-editorial.ts';
export type CatalogEntry={id:string;sourceUrl:string;evidence:string};
// 모델이 인용문을 새로 만들거나 번역하지 않도록 원문 구간을 미리 고정합니다.
export function evidenceCatalog(sources:SourceText[]):CatalogEntry[]{
  const out:CatalogEntry[]=[];
  for(const [sourceIndex,source] of sources.entries()){
    const text=source.text.replace(/\s+/g,' ').trim();
    let start=0,index=0;
    while(start<text.length){
      let end=Math.min(start+95,text.length);
      if(end<text.length){const space=text.lastIndexOf(' ',end);if(space>start+30)end=space;}
      const evidence=text.slice(start,end).trim();
      if(evidence.length>=12)out.push({id:`S${sourceIndex+1}E${++index}`,sourceUrl:source.url,evidence});
      start=end;while(text[start]===' ')start++;
    }
  }
  return out;
}
export function bindEvidence(facts:any[],catalog:CatalogEntry[]):Evidence[]{
  if(!Array.isArray(facts))throw new Error('근거 번호 목록 없음');
  const entries=new Map(catalog.map(e=>[e.id,e]));
  return facts.map((fact,i)=>{
    const selected=entries.get(fact.evidenceId);
    if(!selected||selected.sourceUrl!==fact.sourceUrl||typeof fact.claim!=='string'||!fact.claim.trim())throw new Error(`공식 근거 번호 오류: ${i+1}번`);
    return {claim:fact.claim,sourceUrl:selected.sourceUrl,evidence:selected.evidence};
  });
}
