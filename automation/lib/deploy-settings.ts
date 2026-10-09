export function deploymentProblems(env: Record<string, string | undefined>): string[] {
  const problems: string[] = [];
  try {
    const url = new URL(env.SITE_URL ?? '');
    if (url.protocol !== 'https:' || url.username || url.password || url.port || url.pathname !== '/' || url.search || url.hash || /(^|\.)(localhost|vercel\.app)$/.test(url.hostname)) problems.push('상업 운영 가능한 실제 HTTPS 사이트 주소 필요');
  } catch { problems.push('명시적인 SITE_URL 필요'); }
  const email = env.PUBLIC_CONTACT_EMAIL?.trim() ?? '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /@(?:example\.(?:com|org|net)|localhost)$/i.test(email)) problems.push('운영자가 공개를 확인한 실제 문의 이메일 필요');
  if (env.CLOUDFLARE_FREE_CONFIRMED !== 'true') problems.push('Cloudflare 무료 플랜 실제 확인 필요');
  return problems;
}
