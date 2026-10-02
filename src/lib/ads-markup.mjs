// 애드센스 광고 마크업 생성기 (Astro 컴포넌트와 rehype 플러그인이 함께 사용).
// - 게시자 ID가 없거나 형식이 틀리면 아무것도 출력하지 않습니다 → 빈 광고 상자/레이아웃 흔들림 없음.
// - 광고 클릭을 유도하는 문구는 절대 넣지 않습니다. 라벨은 정책상 허용되는 "광고"만 사용합니다.

export const AD_KINDS = /** @type {const} */ (['article-top', 'in-article', 'article-bottom', 'sidebar']);

const CLIENT_RE = /^ca-pub-\d{10,20}$/;
const SLOT_RE = /^\d{6,20}$/;

/**
 * @param {Record<string, string | undefined>} env
 */
export function readAdConfig(env) {
  const client = String(env.PUBLIC_ADSENSE_CLIENT ?? '').trim();
  const enabled = CLIENT_RE.test(client);
  const slot = (v) => {
    const s = String(v ?? '').trim();
    return SLOT_RE.test(s) ? s : '';
  };
  return {
    enabled,
    client: enabled ? client : '',
    slots: {
      'article-top': slot(env.PUBLIC_ADSENSE_SLOT_ARTICLE_TOP),
      'in-article': slot(env.PUBLIC_ADSENSE_SLOT_IN_ARTICLE),
      'article-bottom': slot(env.PUBLIC_ADSENSE_SLOT_ARTICLE_BOTTOM),
      sidebar: slot(env.PUBLIC_ADSENSE_SLOT_SIDEBAR),
    },
  };
}

/**
 * 광고 단위 HTML. 슬롯 ID가 없으면 빈 문자열(자동 광고만 사용하는 경우).
 * @param {'article-top'|'in-article'|'article-bottom'|'sidebar'} kind
 * @param {ReturnType<typeof readAdConfig>} config
 */
export function adMarkup(kind, config) {
  if (!config?.enabled) return '';
  const slot = config.slots?.[kind];
  if (!slot) return '';
  const format =
    kind === 'in-article'
      ? 'data-ad-layout="in-article" data-ad-format="fluid"'
      : 'data-ad-format="auto" data-full-width-responsive="true"';
  const style = kind === 'in-article' ? 'display:block;text-align:center' : 'display:block';
  return (
    `<aside class="ad ad--${kind}" aria-label="광고">` +
    `<p class="ad__label">광고</p>` +
    `<ins class="adsbygoogle" style="${style}" data-ad-client="${config.client}" data-ad-slot="${slot}" ${format}></ins>` +
    `<script>(adsbygoogle=window.adsbygoogle||[]).push({});</script>` +
    `</aside>`
  );
}

/** 페이지 head 에 넣을 애드센스 로더 스크립트 (게시자 ID가 있을 때만) */
export function adLoaderSrc(config) {
  if (!config?.enabled) return '';
  return `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.client}`;
}
