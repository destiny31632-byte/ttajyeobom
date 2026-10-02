// 문자 n-gram 기반 TF-IDF 유사도.
// 한국어는 조사가 붙어 단어 단위 비교가 부정확하므로 어절 내부 n-gram 을 사용합니다.
// 외부 임베딩 API 없이(무료) 중복 주제·중복 본문·관련 글 계산에 씁니다.

export type Vector = Map<string, number>;

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function ngrams(text: string, n = 3): Vector {
  const grams: Vector = new Map();
  const add = (g: string) => grams.set(g, (grams.get(g) ?? 0) + 1);
  for (const word of normalizeText(text).split(' ')) {
    if (!word) continue;
    if (word.length <= n) {
      add(word);
      continue;
    }
    for (let i = 0; i <= word.length - n; i++) add(word.slice(i, i + n));
  }
  return grams;
}

export function cosine(a: Vector, b: Vector): number {
  if (!a.size || !b.size) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const [, v] of a) na += v * v;
  for (const [, v] of b) nb += v * v;
  const [small, large] = a.size < b.size ? [a, b] : [b, a];
  for (const [k, v] of small) {
    const w = large.get(k);
    if (w) dot += v * w;
  }
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}

/** 코퍼스 전체의 문서 빈도를 반영한 TF-IDF 벡터 집합 */
export class TfIdfIndex {
  df = new Map<string, number>();
  docs: { id: string; tf: Vector }[] = [];
  vectors = new Map<string, Vector>();
  n: number;

  constructor(n = 3) {
    this.n = n;
  }

  add(id: string, text: string): void {
    const tf = ngrams(text, this.n);
    this.docs.push({ id, tf });
    for (const k of tf.keys()) this.df.set(k, (this.df.get(k) ?? 0) + 1);
    this.vectors.clear();
  }

  weight(tf: Vector): Vector {
    const total = this.docs.length;
    const out: Vector = new Map();
    for (const [k, v] of tf) {
      const idf = Math.log((total + 1) / ((this.df.get(k) ?? 0) + 1)) + 1;
      out.set(k, (1 + Math.log(v)) * idf);
    }
    return out;
  }

  vector(id: string): Vector | undefined {
    if (!this.vectors.has(id)) {
      const doc = this.docs.find((d) => d.id === id);
      if (!doc) return undefined;
      this.vectors.set(id, this.weight(doc.tf));
    }
    return this.vectors.get(id);
  }

  /** 색인에 없는 임의 텍스트와 각 문서의 유사도 (내림차순) */
  query(text: string): { id: string; score: number }[] {
    const q = this.weight(ngrams(text, this.n));
    return this.docs
      .map((d) => ({ id: d.id, score: cosine(q, this.vector(d.id)!) }))
      .sort((a, b) => b.score - a.score);
  }

  similarity(idA: string, idB: string): number {
    const a = this.vector(idA);
    const b = this.vector(idB);
    return a && b ? cosine(a, b) : 0;
  }

  get ids(): string[] {
    return this.docs.map((d) => d.id);
  }
}

/** 두 텍스트의 단순 유사도 (색인 없이) */
export function textSimilarity(a: string, b: string, n = 3): number {
  return cosine(ngrams(a, n), ngrams(b, n));
}
