// 파비콘·로고·기본 OG 이미지 생성 (sharp, 무료). 한 번 실행해 결과를 커밋합니다.
// 사용: npm run assets:brand
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const pub = path.resolve('public');

const logoSvg = (size: number, pad = 0) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${32 + pad * 2} ${32 + pad * 2}" width="${size}" height="${size}">
  ${pad ? `<rect x="${-pad}" y="${-pad}" width="${32 + pad * 2}" height="${32 + pad * 2}" fill="#ffffff"/>` : ''}
  <rect width="32" height="32" rx="8" fill="#0f766e"/>
  <rect x="7" y="19" width="4" height="6" rx="1" fill="#5eead4" opacity="0.9"/>
  <rect x="14" y="15" width="4" height="10" rx="1" fill="#5eead4" opacity="0.9"/>
  <rect x="21" y="11" width="4" height="14" rx="1" fill="#5eead4" opacity="0.9"/>
  <path d="M7 14.5l4.2 4.2L25 6.5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

async function textLayer(text: string, font: string, color: string, width: number) {
  return sharp({
    text: {
      text: `<span foreground="${color}">${text}</span>`,
      font,
      rgba: true,
      width,
      dpi: 72,
    },
  })
    .png()
    .toBuffer();
}

async function main() {
  fs.writeFileSync(path.join(pub, 'favicon.svg'), logoSvg(32));
  await sharp(Buffer.from(logoSvg(32))).resize(32, 32).png().toFile(path.join(pub, 'favicon-32.png'));
  await sharp(Buffer.from(logoSvg(180, 3))).resize(180, 180).png().toFile(path.join(pub, 'apple-touch-icon.png'));
  await sharp(Buffer.from(logoSvg(512))).resize(512, 512).png().toFile(path.join(pub, 'logo-512.png'));

  // 기본 OG 이미지 1200x630
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f766e"/><stop offset="1" stop-color="#0b4f4a"/></linearGradient></defs>
    <rect width="1200" height="630" fill="url(#g)"/>
    <g opacity="0.12" fill="#ffffff">
      <rect x="860" y="330" width="70" height="200" rx="10"/><rect x="960" y="250" width="70" height="280" rx="10"/><rect x="1060" y="160" width="70" height="370" rx="10"/>
    </g>
  </svg>`);
  const logo = await sharp(Buffer.from(logoSvg(132))).png().toBuffer();
  const title = await textLayer('따져봄', 'Malgun Gothic Bold 110', '#ffffff', 900);
  const tagline = await textLayer('사기 전, 신청 전, 바꾸기 전에\n숫자로 따져보는 생활 가이드', 'Malgun Gothic 46', '#d7f5f1', 1000);
  await sharp(bg)
    .composite([
      { input: logo, left: 90, top: 96 },
      { input: title, left: 90, top: 262 },
      { input: tagline, left: 92, top: 420 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(pub, 'og-default.png'));

  console.log('브랜드 이미지 생성 완료:', ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png', 'logo-512.png', 'og-default.png'].join(', '));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
