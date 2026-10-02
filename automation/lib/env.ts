import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './paths.ts';

let loaded = false;

/** .env 파일을 읽어 process.env 에 채웁니다 (이미 있는 값은 덮어쓰지 않음). 비밀값은 출력하지 않습니다. */
export function loadDotEnv(file = path.join(ROOT, '.env')): void {
  if (loaded) return;
  loaded = true;
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const [, key, rawValue] = m;
    let value = rawValue;
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (process.env[key] === undefined || process.env[key] === '') process.env[key] = value;
  }
}

export function env(key: string, fallback = ''): string {
  loadDotEnv();
  const v = process.env[key];
  return v === undefined || v === '' ? fallback : v;
}

export function envBool(key: string, fallback = false): boolean {
  const v = env(key, '').toLowerCase();
  if (!v) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(v);
}

export function hasEnv(...keys: string[]): boolean {
  return keys.every((k) => env(k) !== '');
}
