// 안전한 계산식 평가기 (eval 사용 안 함).
// AI가 숫자를 "추측"하지 않도록, 계산표는 '입력값 + 계산식'을 받아 여기서 직접 계산합니다.
// 지원: + - * / % ^ ( ), 함수 min max round ceil floor abs, 변수(영문/숫자/_)

type Token = { t: 'num'; v: number } | { t: 'id'; v: string } | { t: 'op'; v: string } | { t: 'lp' } | { t: 'rp' } | { t: 'comma' };

type Node =
  | { k: 'num'; v: number }
  | { k: 'var'; name: string }
  | { k: 'neg'; a: Node }
  | { k: 'bin'; op: string; a: Node; b: Node }
  | { k: 'call'; fn: string; args: Node[] };

const FUNCS: Record<string, (...a: number[]) => number> = {
  min: Math.min,
  max: Math.max,
  abs: Math.abs,
  ceil: Math.ceil,
  floor: Math.floor,
  round: (x: number, digits = 0) => {
    const f = 10 ** digits;
    return Math.round(x * f) / f;
  },
};

function tokenize(src: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < src.length && /[0-9._]/.test(src[j])) j++;
      const raw = src.slice(i, j).replace(/_/g, '');
      const v = Number(raw);
      if (!Number.isFinite(v)) throw new Error(`잘못된 숫자: ${raw}`);
      out.push({ t: 'num', v });
      i = j;
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++;
      out.push({ t: 'id', v: src.slice(i, j) });
      i = j;
      continue;
    }
    if ('+-*/%^'.includes(c)) {
      out.push({ t: 'op', v: c });
      i++;
      continue;
    }
    if (c === '(') out.push({ t: 'lp' });
    else if (c === ')') out.push({ t: 'rp' });
    else if (c === ',') out.push({ t: 'comma' });
    else throw new Error(`허용되지 않는 문자: ${c}`);
    i++;
  }
  return out;
}

function parse(tokens: Token[]): Node {
  let pos = 0;
  const peek = () => tokens[pos];
  const next = () => tokens[pos++];

  const primary = (): Node => {
    const tk = next();
    if (!tk) throw new Error('식이 끝났습니다');
    if (tk.t === 'num') return { k: 'num', v: tk.v };
    if (tk.t === 'op' && tk.v === '-') return { k: 'neg', a: power() };
    if (tk.t === 'op' && tk.v === '+') return power();
    if (tk.t === 'lp') {
      const e = expr();
      if (next()?.t !== 'rp') throw new Error('괄호가 닫히지 않았습니다');
      return e;
    }
    if (tk.t === 'id') {
      if (peek()?.t === 'lp') {
        next();
        const args: Node[] = [];
        if (peek()?.t !== 'rp') {
          args.push(expr());
          while (peek()?.t === 'comma') {
            next();
            args.push(expr());
          }
        }
        if (next()?.t !== 'rp') throw new Error('함수 괄호가 닫히지 않았습니다');
        if (!Object.hasOwn(FUNCS, tk.v)) throw new Error(`허용되지 않는 함수: ${tk.v}`);
        return { k: 'call', fn: tk.v, args };
      }
      return { k: 'var', name: tk.v };
    }
    throw new Error('식 형식이 올바르지 않습니다');
  };

  const power = (): Node => {
    const base = primary();
    const tk = peek();
    if (tk?.t === 'op' && tk.v === '^') {
      next();
      return { k: 'bin', op: '^', a: base, b: power() };
    }
    return base;
  };

  const term = (): Node => {
    let a = power();
    for (;;) {
      const tk = peek();
      if (tk?.t === 'op' && (tk.v === '*' || tk.v === '/' || tk.v === '%')) {
        next();
        a = { k: 'bin', op: tk.v, a, b: power() };
      } else return a;
    }
  };

  const expr = (): Node => {
    let a = term();
    for (;;) {
      const tk = peek();
      if (tk?.t === 'op' && (tk.v === '+' || tk.v === '-')) {
        next();
        a = { k: 'bin', op: tk.v, a, b: term() };
      } else return a;
    }
  };

  const root = expr();
  if (pos !== tokens.length) throw new Error('식 뒤에 해석할 수 없는 내용이 있습니다');
  return root;
}

function evaluate(n: Node, vars: Record<string, number>): number {
  switch (n.k) {
    case 'num':
      return n.v;
    case 'var': {
      if (!Object.hasOwn(vars, n.name)) throw new Error(`정의되지 않은 변수: ${n.name}`);
      return vars[n.name];
    }
    case 'neg':
      return -evaluate(n.a, vars);
    case 'call':
      return FUNCS[n.fn](...n.args.map((a) => evaluate(a, vars)));
    case 'bin': {
      const a = evaluate(n.a, vars);
      const b = evaluate(n.b, vars);
      switch (n.op) {
        case '+':
          return a + b;
        case '-':
          return a - b;
        case '*':
          return a * b;
        case '/':
          if (b === 0) throw new Error('0으로 나눌 수 없습니다');
          return a / b;
        case '%':
          return a % b;
        case '^':
          return a ** b;
      }
    }
  }
  throw new Error('알 수 없는 식');
}

export function calc(expression: string, vars: Record<string, number> = {}): number {
  if (expression.length > 500) throw new Error('식이 너무 깁니다');
  const v = evaluate(parse(tokenize(expression)), vars);
  if (!Number.isFinite(v)) throw new Error('계산 결과가 유효한 숫자가 아닙니다');
  return v;
}

// ── 계산표 ──
export interface CalcColumn {
  header: string;
  /** 행 입력값 키 (input) 또는 계산식 (expr) 중 하나 */
  input?: string;
  expr?: string;
  format?: 'won' | 'number' | 'percent' | 'decimal1' | 'decimal2' | 'text';
  unit?: string;
}

export interface CalcTableSpec {
  columns: CalcColumn[];
  rows: { label?: string; inputs: Record<string, number | string> }[];
  /** 모든 행에 공통으로 쓰는 상수 (단가 등) */
  constants?: Record<string, number>;
}

export function formatValue(v: number | string, format: CalcColumn['format'] = 'number', unit = ''): string {
  if (typeof v === 'string') return v;
  const nf = (digits: number) => v.toLocaleString('ko-KR', { maximumFractionDigits: digits, minimumFractionDigits: 0 });
  switch (format) {
    case 'won':
      return `${Math.round(v).toLocaleString('ko-KR')}원`;
    case 'percent':
      return `${nf(1)}%`;
    case 'decimal1':
      return `${nf(1)}${unit}`;
    case 'decimal2':
      return `${nf(2)}${unit}`;
    case 'text':
      return String(v);
    default:
      return `${nf(0)}${unit}`;
  }
}

/** 계산표를 Markdown 으로. 각 셀 값과 함께 계산된 숫자 목록(검수용)을 돌려줍니다. */
export function buildCalcTable(spec: CalcTableSpec): { markdown: string; values: number[] } {
  const values: number[] = [];
  const header = `| ${spec.columns.map((c) => c.header).join(' | ')} |`;
  const sep = `| ${spec.columns.map(() => '---').join(' | ')} |`;
  const lines = spec.rows.map((row) => {
    const numericInputs: Record<string, number> = { ...(spec.constants ?? {}) };
    for (const [k, v] of Object.entries(row.inputs)) if (typeof v === 'number') numericInputs[k] = v;
    const cells = spec.columns.map((col) => {
      if (col.expr) {
        const v = calc(col.expr, numericInputs);
        values.push(v);
        return formatValue(v, col.format, col.unit);
      }
      const raw = col.input ? row.inputs[col.input] : row.label;
      if (typeof raw === 'number') values.push(raw);
      return formatValue(raw ?? '', col.format ?? (typeof raw === 'number' ? 'number' : 'text'), col.unit);
    });
    return `| ${cells.join(' | ')} |`;
  });
  return { markdown: [header, sep, ...lines].join('\n'), values };
}
