// 빌드 결과 검사 (npm run check:dist / 외부 링크까지: npm run check:links)
import path from 'node:path';
import { resolveSiteUrl } from '../../src/config/site-url.mjs';
import { loadDotEnv } from '../lib/env.ts';
import { writeJson } from '../lib/fsutil.ts';
import { REPORT_DIR } from '../lib/paths.ts';
import { checkDist, checkExternal } from '../quality/dist-check.ts';

loadDotEnv();
const external = process.argv.includes('--external');
const site = resolveSiteUrl(process.env);
const report = checkDist(site);

console.log(`검사한 페이지 ${report.pages}개 (색인 대상 ${report.indexable}개), sitemap URL ${report.sitemapUrls}개`);
console.log(`HTML 평균 ${report.stats.avgHtmlKb}KB / 최대 ${report.stats.maxHtmlKb}KB, 페이지당 외부 스크립트 ${report.stats.scriptsPerPage}개`);
for (const f of report.failures) console.log(`✖ ${f.page} — ${f.message}`);
for (const w of report.warnings.slice(0, 40)) console.log(`△ ${w.page} — ${w.message}`);
if (report.warnings.length > 40) console.log(`△ … 경고 ${report.warnings.length - 40}건 더 있음`);

let externalFailures = 0;
let externalResults: { url: string; status: number }[] = [];
if (external) {
  console.log(`\n외부 링크 ${report.externalLinks.length}개 확인 중…`);
  externalResults = await checkExternal(report.externalLinks);
  for (const r of externalResults) {
    if (r.status === 404 || r.status === 410) {
      externalFailures++;
      console.log(`✖ ${r.status} ${r.url}`);
    } else if (r.status === 0 || r.status >= 400) console.log(`△ ${r.status || '응답 없음'} ${r.url} (차단·일시 오류일 수 있음)`);
  }
}

writeJson(path.join(REPORT_DIR, 'dist-check.json'), { checkedAt: new Date().toISOString(), site, ...report, external: externalResults });
const totalFail = report.failures.length + externalFailures;
console.log(`\n결과: 실패 ${totalFail}건, 경고 ${report.warnings.length}건`);
process.exit(totalFail ? 1 : 0);
