// 실행 로그: 콘솔 출력 + 실행 기록(JSON)용 수집. 비밀값이 섞이지 않도록 마스킹합니다.

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export interface LogEntry {
  at: string;
  level: LogLevel;
  step: string;
  message: string;
  data?: unknown;
}

const SECRET_KEYS = [
  'GROQ_API_KEY',
  'CEREBRAS_API_KEY',
  'GEMINI_API_KEY',
  'MISTRAL_API_KEY',
  'OPENROUTER_API_KEY',
  'NAVER_CLIENT_SECRET',
  'NAVER_CLIENT_ID',
  'TAVILY_API_KEY',
  'YOUTUBE_API_KEY',
  'GSC_SERVICE_ACCOUNT_JSON',
  'GITHUB_TOKEN',
];

export function redact(text: string): string {
  let out = text;
  for (const k of SECRET_KEYS) {
    const v = process.env[k];
    if (v && v.length >= 8) out = out.split(v).join(`[${k}]`);
  }
  return out.replace(/(api[_-]?key|token|secret)=([A-Za-z0-9._-]{8,})/gi, '$1=[REDACTED]');
}

export class RunLogger {
  entries: LogEntry[] = [];
  quiet: boolean;

  constructor(quiet = false) {
    this.quiet = quiet;
  }

  log(level: LogLevel, step: string, message: string, data?: unknown): void {
    const entry: LogEntry = { at: new Date().toISOString(), level, step, message: redact(message) };
    if (data !== undefined) entry.data = JSON.parse(redact(JSON.stringify(data)));
    this.entries.push(entry);
    if (!this.quiet || level === 'error') {
      const line = `[${level.toUpperCase()}] ${step}: ${entry.message}`;
      if (level === 'error') console.error(line);
      else if (level === 'warn') console.warn(line);
      else console.log(line);
    }
  }

  info(step: string, message: string, data?: unknown) {
    this.log('info', step, message, data);
  }
  warn(step: string, message: string, data?: unknown) {
    this.log('warn', step, message, data);
  }
  error(step: string, message: string, data?: unknown) {
    this.log('error', step, message, data);
  }
  debug(step: string, message: string, data?: unknown) {
    this.log('debug', step, message, data);
  }
}
