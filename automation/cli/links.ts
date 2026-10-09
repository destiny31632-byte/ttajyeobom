import { loadPosts, extractLinks } from '../lib/content.ts';
import { writeJson } from '../lib/fsutil.ts';
import { REPORT_DIR } from '../lib/paths.ts';
import path from 'node:path';

const posts = loadPosts({ includeDrafts: false });
const suggestions = posts.map((post) => {
  const existing = new Set(extractLinks(post.body).map((link) => link.href));
  const matches = posts.filter((p) => p.slug !== post.slug)
    .map((p) => ({ slug: p.slug, title: p.data.title, score:
      (p.data.cluster === post.data.cluster ? 3 : 0) +
      p.data.tags.filter((tag) => post.data.tags.includes(tag)).length }))
    .filter((p) => p.score > 0 && !existing.has(`/posts/${p.slug}/`))
    .sort((a, b) => b.score - a.score).slice(0, 3);
  return { slug: post.slug, suggestions: matches };
});
if (!process.argv.includes('--dry-run')) writeJson(path.join(REPORT_DIR, 'internal-links.json'), suggestions);
console.log(JSON.stringify(suggestions, null, 2));
