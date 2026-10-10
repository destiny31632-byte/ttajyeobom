// 공식 원문은 전체를 별도로 유지하고, 작성 모델에는 관련 대목만 보냅니다.
// 임의 요약을 생성하지 않아 인용한 문장의 원문 대조가 가능합니다.
const IGNORE = new Set(['guide', 'how', 'with', 'and', 'the', 'for']);

export function sourceKeywords(slug: string): string[] {
  return slug.toLowerCase().split(/[^a-z0-9]+/).filter(word => word.length >= 3 && !IGNORE.has(word));
}

export function selectSourceExcerpt(text: string, keywords: string[], maxChars = 4600): string {
  if (!Number.isSafeInteger(maxChars) || maxChars < 500) throw new Error('근거 발췌 크기 오류');
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxChars) return normalized;
  const sentences: string[] = [];
  for(const sentence of normalized.split(/(?<=[.!?])\s+(?=[A-Z0-9"“(])/u)){
    let remaining=sentence;
    while(remaining.length > 800){
      const end=remaining.lastIndexOf(' ', 800);
      const cut=end>250?end:800;
      sentences.push(remaining.slice(0,cut));
      remaining=remaining.slice(cut).trimStart();
    }
    if(remaining)sentences.push(remaining);
  }
  const entries: { pos: number; text: string; score: number }[] = [];
  let cursor = 0;
  const words = [...new Set(keywords.map(x => x.toLowerCase()).filter(x => /^[a-z0-9]{3,}$/.test(x)))];
  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    entries.push({ pos: cursor, text: sentence, score: words.reduce((score,word) => score + (lower.includes(word) ? 1 : 0), 0) });
    cursor += sentence.length + 1;
  }
  const keep = new Set<number>();
  let size = 0;
  // 문서의 제목·적용 대상 및 주요 제한 조건을 먼저 남깁니다.
  for(let i=0;i<entries.length && size < Math.min(950, maxChars / 4);i++) {
    if(size + entries[i].text.length + 2 > maxChars) break;
    keep.add(i);size += entries[i].text.length + 2;
  }
  const candidates = entries.map((e,i)=>({ ...e, i }))
    .filter(e=>!keep.has(e.i) && e.text.length < maxChars / 2)
    .sort((a,b)=>b.score-a.score || a.pos-b.pos);
  for(const e of candidates) {
    if(size + e.text.length + 2 > maxChars)continue;
    keep.add(e.i);size += e.text.length + 2;
  }
  // 원문 등장 순서를 유지합니다. 각각 완전한 문장만 채택합니다.
  const excerpt = entries.filter((_,i)=>keep.has(i)).map(e=>e.text).join(' ');
  if(excerpt.length < 500 || excerpt.length > maxChars)throw new Error('근거 발췌 실패');
  return excerpt;
}
