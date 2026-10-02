// 본문(Markdown → HTML) 후처리 rehype 플러그인
// 1) 표를 가로 스크롤 영역으로 감싸 모바일에서 레이아웃이 깨지지 않게 함
// 2) 외부 링크에 새 창 + rel 속성
// 3) /images/ 이미지에 width/height, lazy loading, AVIF <picture>, figure/figcaption(출처·라이선스) 적용
// 4) (광고 설정이 있을 때만) 본문 중간 광고 1개 삽입 — 세 번째 소제목 앞
import fs from 'node:fs';
import path from 'node:path';
import { adMarkup } from '../lib/ads-markup.mjs';

const sizeCache = new Map();

function textOf(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value;
  return (node.children ?? []).map(textOf).join('');
}

function isWhitespaceText(node) {
  return node.type === 'text' && !node.value.trim();
}

function el(tagName, properties = {}, children = []) {
  return { type: 'element', tagName, properties, children };
}

function txt(value) {
  return { type: 'text', value };
}

async function imageSize(publicDir, src) {
  if (sizeCache.has(src)) return sizeCache.get(src);
  const file = path.join(publicDir, decodeURI(src).replace(/^\//, ''));
  let size = null;
  try {
    if (file.toLowerCase().endsWith('.svg')) {
      const svg = fs.readFileSync(file, 'utf8').slice(0, 2000);
      const vb = svg.match(/viewBox="\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*"/);
      const w = svg.match(/<svg[^>]*\swidth="([\d.]+)(px)?"/);
      const h = svg.match(/<svg[^>]*\sheight="([\d.]+)(px)?"/);
      if (w && h) size = { width: Math.round(+w[1]), height: Math.round(+h[1]) };
      else if (vb) size = { width: Math.round(+vb[1]), height: Math.round(+vb[2]) };
    } else if (fs.existsSync(file)) {
      const sharp = (await import('sharp')).default;
      const meta = await sharp(file).metadata();
      if (meta.width && meta.height) size = { width: meta.width, height: meta.height };
    }
  } catch {
    size = null;
  }
  sizeCache.set(src, size);
  return size;
}

function creditNodes(meta) {
  if (!meta) return [];
  const nodes = [];
  if (meta.kind === 'own-chart' || meta.kind === 'own-diagram') {
    nodes.push(txt('그래픽: 따져봄 자체 제작'));
    if (meta.dataSource) nodes.push(txt(` · 데이터: ${meta.dataSource}`));
    return nodes;
  }
  nodes.push(txt('사진: '));
  if (meta.sourceUrl) {
    nodes.push(el('a', { href: meta.sourceUrl, target: '_blank', rel: ['noopener'] }, [txt(meta.author || meta.sourceName || '원본')]));
  } else {
    nodes.push(txt(meta.author || meta.sourceName || ''));
  }
  if (meta.license) {
    nodes.push(txt(', '));
    if (meta.licenseUrl) {
      nodes.push(el('a', { href: meta.licenseUrl, target: '_blank', rel: ['noopener', 'license'] }, [txt(meta.license)]));
    } else {
      nodes.push(txt(meta.license));
    }
  }
  if (meta.sourceName && meta.author) nodes.push(txt(`, ${meta.sourceName}`));
  return nodes;
}

/**
 * @param {{ publicDir?: string, siteHost?: string, ads?: any }} options
 */
export function rehypeArticle(options = {}) {
  const publicDir = options.publicDir ?? path.resolve('public');
  const siteHost = options.siteHost ?? '';
  const adConfig = options.ads ?? null;

  return async function transformer(tree, file) {
    const frontmatter = file?.data?.astro?.frontmatter ?? {};
    const imageMeta = new Map((frontmatter.images ?? []).map((m) => [m.src, m]));

    const tables = [];
    const links = [];
    const imageParagraphs = [];
    const images = [];

    const visit = (node, parent, index) => {
      if (node.type === 'element') {
        if (node.tagName === 'table' && parent) tables.push({ node, parent });
        if (node.tagName === 'a') links.push(node);
        if (node.tagName === 'img') images.push(node);
        if (node.tagName === 'p' && parent) {
          const meaningful = (node.children ?? []).filter((c) => !isWhitespaceText(c));
          if (meaningful.length === 1 && meaningful[0].type === 'element' && meaningful[0].tagName === 'img') {
            imageParagraphs.push({ node, parent, img: meaningful[0] });
          }
        }
      }
      for (let i = 0; i < (node.children?.length ?? 0); i++) visit(node.children[i], node, i);
    };
    visit(tree, null, null);

    // 1) 표 래핑
    tables.forEach(({ node, parent }, i) => {
      const idx = parent.children.indexOf(node);
      if (idx === -1) return;
      const wrapper = el(
        'div',
        { className: ['table-wrap'], role: 'region', ariaLabel: `표 ${i + 1} (가로로 밀어서 볼 수 있음)`, tabIndex: 0 },
        [node],
      );
      parent.children[idx] = wrapper;
    });

    // 2) 외부 링크
    for (const a of links) {
      const href = String(a.properties?.href ?? '');
      if (!/^https?:\/\//i.test(href)) continue;
      let host = '';
      try {
        host = new URL(href).host;
      } catch {
        continue;
      }
      if (siteHost && host === siteHost) continue;
      a.properties.target = '_blank';
      a.properties.rel = ['noopener', 'noreferrer'];
      a.properties.className = [...(a.properties.className ?? []), 'ext'];
    }

    // 3) 이미지 크기/지연 로딩
    for (const img of images) {
      const src = String(img.properties?.src ?? '');
      if (!src.startsWith('/images/')) continue;
      const size = await imageSize(publicDir, src);
      if (size) {
        img.properties.width = size.width;
        img.properties.height = size.height;
      }
      img.properties.loading = 'lazy';
      img.properties.decoding = 'async';
    }

    // 3-2) 단독 이미지 문단 → figure + figcaption, webp 옆에 avif 가 있으면 <picture>
    for (const { node, parent, img } of imageParagraphs) {
      const idx = parent.children.indexOf(node);
      if (idx === -1) continue;
      const src = String(img.properties?.src ?? '');
      const title = img.properties?.title ? String(img.properties.title) : '';
      delete img.properties.title;
      const meta = imageMeta.get(src);

      let media = img;
      if (src.startsWith('/images/') && src.endsWith('.webp')) {
        const avif = src.replace(/\.webp$/, '.avif');
        if (fs.existsSync(path.join(publicDir, avif.replace(/^\//, '')))) {
          media = el('picture', {}, [el('source', { srcSet: avif, type: 'image/avif' }), img]);
        }
      }

      const captionChildren = [];
      const captionText = title || meta?.caption || '';
      if (captionText) captionChildren.push(el('span', { className: ['fig-caption'] }, [txt(captionText)]));
      const credit = creditNodes(meta);
      if (credit.length) captionChildren.push(el('span', { className: ['fig-credit'] }, credit));

      const figure = el('figure', { className: ['figure'] }, [media]);
      if (captionChildren.length) figure.children.push(el('figcaption', {}, captionChildren));
      parent.children[idx] = figure;
    }

    // 4) 본문 중간 광고 (광고 설정이 있을 때만)
    const html = adConfig ? adMarkup('in-article', adConfig) : '';
    if (html) {
      const h2s = tree.children.filter((c) => c.type === 'element' && c.tagName === 'h2');
      if (h2s.length >= 4) {
        const target = h2s[2];
        const idx = tree.children.indexOf(target);
        tree.children.splice(idx, 0, { type: 'raw', value: html });
      }
    }

    // 사용하지 않는 함수 경고 방지용 (textOf 는 디버깅/확장용)
    void textOf;
  };
}

export default rehypeArticle;
