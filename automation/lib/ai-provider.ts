import fs from 'node:fs';
import path from 'node:path';
import { STATE_DIR } from './paths.ts';
import { writeJson } from './fsutil.ts';
import { env, envBool } from './env.ts';
import { kstDate } from './time.ts';
import { reserveCall, type UsageBudget } from './ai-budget.ts';

export interface TextProvider { generate(prompt: string): Promise<string> }
export class GeminiFreeProvider implements TextProvider {
  async generate(prompt: string): Promise<string> {
    if (envBool('AI_DISABLED', true)) throw new Error('AI 호출 비활성화');
    // 이 확인값은 공급자의 실제 과금 차단을 대신하지 않습니다.
    if (env('AI_BILLING_TIER') !== 'free-unlinked-confirmed') throw new Error('결제 계정 미연결 무료 프로젝트 확인 필요');
    const key = env('GEMINI_API_KEY');
    const model = env('GEMINI_MODEL');
    if (!key || !/^gemini-[a-z0-9.-]+$/.test(model)) throw new Error('무료 모델 및 API 키 설정 필요');
    if (prompt.length > 8_000) throw new Error('프롬프트 크기 제한 초과');
    const file = path.join(STATE_DIR, 'ai-usage.json');
    const lock = path.join(STATE_DIR, 'ai.lock');
    fs.mkdirSync(STATE_DIR, { recursive: true });
    let fd: number;
    try { fd = fs.openSync(lock, 'wx'); } catch { throw new Error('다른 AI 실행 중 또는 이전 잠금 점검 필요'); }
    try {
      let previous: UsageBudget | null = null;
      if (fs.existsSync(file)) previous = JSON.parse(fs.readFileSync(file, 'utf8'));
      // 요청 전에 예산을 예약합니다. 실패해도 환원·재시도하지 않습니다.
      writeJson(file, reserveCall(previous, kstDate(), 30_000));
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST', signal: AbortSignal.timeout(60000),
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 6000, temperature: 0.4 } }),
      });
      if (!res.ok) throw new Error(`무료 AI 응답 ${res.status}: 재시도·유료 전환 없이 중단`);
      const data = await res.json() as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
      const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
      if (!text.trim()) throw new Error('AI 결과 없음');
      return text;
    } finally { fs.closeSync(fd); fs.unlinkSync(lock); }
  }
}
