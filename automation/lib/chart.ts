// 정보 전달용 SVG 차트 생성기 (외부 API·라이브러리 없음, 라이선스 걱정 없는 자체 제작 이미지)
// - 가로 막대(hbar): 긴 한국어 항목명 비교에 적합 (기본)
// - 세로 막대(bar), 선(line): 기간별 변화
// 접근성: role="img" + <title>/<desc>, 본문에서는 의미 있는 alt 를 함께 씁니다.

export interface ChartSeries {
  name: string;
  values: number[];
  color?: string;
}

export interface ChartSpec {
  type?: 'hbar' | 'bar' | 'line';
  title: string;
  subtitle?: string;
  labels: string[];
  series: ChartSeries[];
  unit?: string;
  valueFormat?: 'number' | 'won' | 'percent' | 'decimal1';
  source?: string;
  width?: number;
}

const PALETTE = ['#0f766e', '#d97706', '#2563eb', '#7c3aed', '#64748b', '#db2777'];
const FONT = "-apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif";

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** 대략적인 글자 폭 (한글 1em, 영문·숫자 0.6em) */
export function textWidth(text: string, fontSize: number): number {
  let w = 0;
  for (const ch of text) w += /[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af\u4e00-\u9fff]/.test(ch) ? 1 : ch === ' ' ? 0.32 : 0.6;
  return w * fontSize;
}

export function formatChartValue(v: number, format: ChartSpec['valueFormat'] = 'number', unit = ''): string {
  if (format === 'won') return `${Math.round(v).toLocaleString('ko-KR')}원`;
  if (format === 'percent') return `${v.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}%`;
  if (format === 'decimal1') return `${v.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}${unit}`;
  return `${Math.round(v).toLocaleString('ko-KR')}${unit}`;
}

function niceMax(v: number): number {
  if (v <= 0) return 1;
  const exp = 10 ** Math.floor(Math.log10(v));
  const f = v / exp;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nice * exp;
}

function header(spec: ChartSpec, width: number): { svg: string; height: number } {
  let y = 34;
  let svg = `<text x="24" y="${y}" font-size="20" font-weight="700" fill="#1b1f23">${esc(spec.title)}</text>`;
  if (spec.subtitle) {
    y += 24;
    svg += `<text x="24" y="${y}" font-size="13" fill="#59636e">${esc(spec.subtitle)}</text>`;
  }
  if (spec.series.length > 1) {
    y += 26;
    let x = 24;
    spec.series.forEach((s, i) => {
      const color = s.color ?? PALETTE[i % PALETTE.length];
      svg += `<rect x="${x}" y="${y - 11}" width="12" height="12" rx="2" fill="${color}"/>`;
      svg += `<text x="${x + 18}" y="${y}" font-size="13" fill="#1b1f23">${esc(s.name)}</text>`;
      x += 18 + textWidth(s.name, 13) + 22;
      if (x > width - 120) x = 24;
    });
  }
  return { svg, height: y + 18 };
}

function footer(spec: ChartSpec, y: number): { svg: string; height: number } {
  const text = `${spec.source ? `자료: ${spec.source} · ` : ''}그래픽: 따져봄`;
  return { svg: `<text x="24" y="${y + 18}" font-size="12" fill="#59636e">${esc(text)}</text>`, height: y + 32 };
}

function wrap(body: string, spec: ChartSpec, width: number, height: number): string {
  const desc = spec.labels
    .map((l, i) => `${l}: ${spec.series.map((s) => `${spec.series.length > 1 ? s.name + ' ' : ''}${formatChartValue(s.values[i], spec.valueFormat, spec.unit)}`).join(', ')}`)
    .join(' / ');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${Math.ceil(height)}" width="${width}" height="${Math.ceil(height)}" role="img" aria-labelledby="chart-title chart-desc" font-family="${FONT}">` +
    `<title id="chart-title">${esc(spec.title)}</title><desc id="chart-desc">${esc(desc)}</desc>` +
    `<rect width="100%" height="100%" fill="#ffffff"/>` +
    body +
    `</svg>\n`
  );
}

function validate(spec: ChartSpec): void {
  if (!spec.labels.length) throw new Error('labels 가 비어 있습니다');
  if (!spec.series.length) throw new Error('series 가 비어 있습니다');
  for (const s of spec.series) {
    if (s.values.length !== spec.labels.length) throw new Error(`'${s.name}' 값 개수가 labels 와 다릅니다`);
    if (s.values.some((v) => !Number.isFinite(v) || v < 0)) throw new Error(`'${s.name}'에 음수나 숫자가 아닌 값이 있습니다`);
  }
}

function hbar(spec: ChartSpec): string {
  const width = spec.width ?? 760;
  const head = header(spec, width);
  const labelW = Math.min(240, Math.max(...spec.labels.map((l) => textWidth(l, 14))) + 16);
  const valueW = Math.max(...spec.series.flatMap((s) => s.values.map((v) => textWidth(formatChartValue(v, spec.valueFormat, spec.unit), 13)))) + 14;
  const plotX = 24 + labelW;
  const plotW = width - plotX - valueW - 16;
  const barH = spec.series.length > 1 ? 16 : 24;
  const groupGap = spec.series.length > 1 ? 14 : 12;
  const max = niceMax(Math.max(...spec.series.flatMap((s) => s.values)));
  let y = head.height + 6;
  let body = head.svg;
  spec.labels.forEach((label, i) => {
    const groupH = spec.series.length * barH + (spec.series.length - 1) * 4;
    body += `<text x="${plotX - 10}" y="${y + groupH / 2 + 5}" font-size="14" fill="#1b1f23" text-anchor="end">${esc(label)}</text>`;
    spec.series.forEach((s, si) => {
      const v = s.values[i];
      const w = Math.max(2, (v / max) * plotW);
      const by = y + si * (barH + 4);
      const color = s.color ?? PALETTE[si % PALETTE.length];
      body += `<rect x="${plotX}" y="${by}" width="${w.toFixed(1)}" height="${barH}" rx="3" fill="${color}"/>`;
      body += `<text x="${(plotX + w + 6).toFixed(1)}" y="${by + barH / 2 + 4.5}" font-size="13" fill="#1b1f23">${esc(formatChartValue(v, spec.valueFormat, spec.unit))}</text>`;
    });
    y += groupH + groupGap;
  });
  body += `<line x1="${plotX}" y1="${head.height}" x2="${plotX}" y2="${y - groupGap + 4}" stroke="#cbd2d9"/>`;
  const foot = footer(spec, y);
  return wrap(body + foot.svg, spec, width, foot.height);
}

function vbar(spec: ChartSpec, asLine = false): string {
  const width = spec.width ?? 760;
  const head = header(spec, width);
  const plotTop = head.height + 16;
  const plotH = 240;
  const plotX = 70;
  const plotW = width - plotX - 24;
  const max = niceMax(Math.max(...spec.series.flatMap((s) => s.values)));
  let body = head.svg;
  for (let t = 0; t <= 4; t++) {
    const v = (max / 4) * t;
    const y = plotTop + plotH - (v / max) * plotH;
    body += `<line x1="${plotX}" y1="${y}" x2="${plotX + plotW}" y2="${y}" stroke="#e3e6ea"/>`;
    body += `<text x="${plotX - 8}" y="${y + 4}" font-size="11" fill="#59636e" text-anchor="end">${esc(formatChartValue(v, spec.valueFormat, spec.unit))}</text>`;
  }
  const n = spec.labels.length;
  const slot = plotW / n;
  spec.labels.forEach((label, i) => {
    body += `<text x="${plotX + slot * i + slot / 2}" y="${plotTop + plotH + 20}" font-size="12" fill="#1b1f23" text-anchor="middle">${esc(label)}</text>`;
  });
  if (asLine) {
    spec.series.forEach((s, si) => {
      const color = s.color ?? PALETTE[si % PALETTE.length];
      const pts = s.values.map((v, i) => `${(plotX + slot * i + slot / 2).toFixed(1)},${(plotTop + plotH - (v / max) * plotH).toFixed(1)}`);
      body += `<polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>`;
      s.values.forEach((v, i) => {
        const [x, y] = pts[i].split(',');
        body += `<circle cx="${x}" cy="${y}" r="4" fill="${color}"/>`;
      });
    });
  } else {
    const groupW = slot * 0.7;
    const barW = groupW / spec.series.length;
    spec.series.forEach((s, si) => {
      const color = s.color ?? PALETTE[si % PALETTE.length];
      s.values.forEach((v, i) => {
        const h = (v / max) * plotH;
        const x = plotX + slot * i + (slot - groupW) / 2 + si * barW;
        body += `<rect x="${x.toFixed(1)}" y="${(plotTop + plotH - h).toFixed(1)}" width="${(barW - 2).toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="${color}"/>`;
        if (spec.series.length === 1) {
          body += `<text x="${(x + barW / 2).toFixed(1)}" y="${(plotTop + plotH - h - 6).toFixed(1)}" font-size="12" fill="#1b1f23" text-anchor="middle">${esc(formatChartValue(v, spec.valueFormat, spec.unit))}</text>`;
        }
      });
    });
  }
  const foot = footer(spec, plotTop + plotH + 30);
  return wrap(body + foot.svg, spec, width, foot.height);
}

export function renderChart(spec: ChartSpec): string {
  validate(spec);
  const type = spec.type ?? 'hbar';
  if (type === 'hbar') return hbar(spec);
  return vbar(spec, type === 'line');
}

/** 본문 alt 텍스트용 요약 문장 */
export function chartAltText(spec: ChartSpec): string {
  const s = spec.series[0];
  const max = Math.max(...s.values);
  const min = Math.min(...s.values);
  const hi = spec.labels[s.values.indexOf(max)];
  const lo = spec.labels[s.values.indexOf(min)];
  return `${spec.title}: ${hi}이(가) ${formatChartValue(max, spec.valueFormat, spec.unit)}로 가장 크고, ${lo}이(가) ${formatChartValue(min, spec.valueFormat, spec.unit)}로 가장 작습니다.`;
}
