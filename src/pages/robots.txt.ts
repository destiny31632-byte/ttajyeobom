import type { APIContext } from 'astro';

export function GET(context: APIContext) {
  const sitemap = new URL('/sitemap.xml', context.site).href;
  const body = ['User-agent: *', 'Allow: /', 'Disallow: /search/', 'Disallow: /pagefind/', '', `Sitemap: ${sitemap}`, ''].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
