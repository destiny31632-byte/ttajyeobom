import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const POSTS_DIR = path.join(ROOT, 'src', 'content', 'posts');
export const PUBLIC_DIR = path.join(ROOT, 'public');
export const DIST_DIR = path.join(ROOT, 'dist');
export const DATA_DIR = path.join(ROOT, 'src', 'data');
export const AUTOMATION_DIR = path.join(ROOT, 'automation');
export const CONFIG_DIR = path.join(AUTOMATION_DIR, 'config');
export const STATE_DIR = path.join(AUTOMATION_DIR, 'state');
export const LOG_DIR = path.join(AUTOMATION_DIR, 'logs');
export const REPORT_DIR = path.join(AUTOMATION_DIR, 'reports');
export const RESEARCH_DIR = path.join(AUTOMATION_DIR, 'research');
export const BRIEF_DIR = path.join(AUTOMATION_DIR, 'briefs');
export const FAILED_DRAFT_DIR = path.join(AUTOMATION_DIR, 'drafts', 'failed');
export const CACHE_DIR = path.join(AUTOMATION_DIR, '.cache');

export const postFile = (slug: string) => path.join(POSTS_DIR, `${slug}.md`);
export const postImageDir = (slug: string) => path.join(PUBLIC_DIR, 'images', 'posts', slug);
