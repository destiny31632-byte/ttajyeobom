export function deploymentProblems(env: Record<string, string | undefined>): string[] {
  const problems: string[] = [];
  try {
    const url = new URL(env.SITE_URL ?? '');
    if (url.protocol !== 'https:' || url.username || url.password || url.port || url.pathname !== '/' || url.search || url.hash || /(^|\.)(localhost|vercel\.app)$/.test(url.hostname)) problems.push('상업 운영 가능한 실제 HTTPS 사이트 주소 필요');
  } catch { problems.push('명시적인 SITE_URL 필요'); }
  const email = env.PUBLIC_CONTACT_EMAIL?.trim() ?? '';
  const emailReady = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/@(?:example\.(?:com|org|net)|localhost)$/i.test(email);
  const feedbackReady = env.PUBLIC_CONTACT_URL === 'https://github.com/destiny31632-byte/ttajyeobom/issues';
  if (!emailReady && !feedbackReady) problems.push('공개 문의 이메일 또는 프로젝트 오류 제보 주소 필요');
  if (env.CLOUDFLARE_FREE_CONFIRMED !== 'true') problems.push('Cloudflare 무료 플랜 실제 확인 필요');
  return problems;
}
