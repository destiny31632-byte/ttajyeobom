import { SITE } from '../config/site';
import { AUTHORS, getCategory } from '../config/taxonomy';
import { isoKst } from './format';
import { lastModified, postUrl, type Post } from './posts';

const abs = (site: URL, path: string) => new URL(path, site).href;

export function organizationLd(site: URL) {
  return {
    '@type': 'Organization',
    '@id': abs(site, '/#organization'),
    name: SITE.name,
    alternateName: SITE.alternateName,
    url: abs(site, '/'),
    logo: {
      '@type': 'ImageObject',
      url: abs(site, '/logo-512.png'),
      width: 512,
      height: 512,
    },
    ...(SITE.contactEmail
      ? { contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: SITE.contactEmail, availableLanguage: 'Korean' } }
      : {}),
  };
}

export function websiteLd(site: URL) {
  return {
    '@type': 'WebSite',
    '@id': abs(site, '/#website'),
    url: abs(site, '/'),
    name: SITE.name,
    alternateName: SITE.alternateName,
    description: SITE.description,
    inLanguage: 'ko-KR',
    publisher: { '@id': abs(site, '/#organization') },
  };
}

export function personLd(site: URL, authorId: string) {
  const a = AUTHORS[authorId] ?? AUTHORS.editor;
  return {
    '@type': 'Person',
    '@id': abs(site, `/author/${a.id}/#person`),
    name: a.name,
    url: abs(site, `/author/${a.id}/`),
    description: a.shortBio,
    jobTitle: a.role,
    knowsAbout: a.focus,
    worksFor: { '@id': abs(site, '/#organization') },
  };
}

export function breadcrumbLd(site: URL, items: { name: string; href: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(site, it.href),
    })),
  };
}

export function articleLd(site: URL, post: Post, imageUrl: string) {
  const d = post.data;
  const url = abs(site, postUrl(post));
  const category = getCategory(d.category);
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: d.title,
    description: d.description,
    image: [imageUrl],
    datePublished: isoKst(d.pubDate),
    dateModified: isoKst(lastModified(post)),
    author: { '@id': abs(site, `/author/${d.author}/#person`) },
    publisher: { '@id': abs(site, '/#organization') },
    inLanguage: 'ko-KR',
    articleSection: category?.name ?? d.category,
    keywords: d.tags.join(', '),
    isAccessibleForFree: true,
    citation: d.sources.map((s) => ({ '@type': 'CreativeWork', name: s.title, url: s.url, publisher: s.publisher })),
  };
}

export function graph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
