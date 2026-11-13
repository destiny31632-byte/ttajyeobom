#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 66번째 겨울 무릎 시림 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1920
FONT = "/usr/share/fonts/pickle-hwp/NotoSansCJKkr-Bold.otf"
FONT_R = "/usr/share/fonts/pickle-hwp/NotoSansCJKkr-Regular.otf"
try:
    ImageFont.truetype(FONT, 20)
except OSError:
    FONT = FONT_R


def F(sz, bold=True):
    return ImageFont.truetype(FONT if bold else FONT_R, sz)


BG = (8, 10, 16)
CARD = (24, 27, 36)
RED = (255, 62, 62)
DEEP = (32, 12, 16)
AMBER = (255, 176, 32)
BLUE = (86, 168, 255)
GREEN = (60, 205, 145)
WHITE = (246, 248, 252)
GRAY = (176, 184, 198)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# 상단 레드 경고 배지
d.rectangle([0, 0, W, 372], fill=DEEP)
d.rounded_rectangle([54, 40, 54 + 972, 40 + 68], radius=14, fill=RED)
d.text((W // 2, 74), "무릎 시리다고 핫팩 붙이고 주무시면 안 됩니다 ⚠️", font=F(29), fill=(22, 4, 4), anchor="mm")
d.text((W // 2, 196), "핫팩 최고 70℃, 열은 10시간 넘게", font=F(36), fill=GRAY, anchor="mm")
d.text((W // 2, 286), "2·3도 화상이 92.2%였습니다", font=F(46), fill=(255, 150, 120), anchor="mm")

# 히어로: 온도별 화상 시간
d.text((W // 2, 424), "뜨겁지 않다고 느끼는 온도가 더 위험합니다", font=F(26, False), fill=GRAY, anchor="mm")
d.text((W // 2, 512), "40~45℃ 1~2시간 → 55℃ 10초 → 60℃ 5초", font=F(34), fill=RED, anchor="mm")
d.text((W // 2, 578), "소비자원 핫팩 화상 226건 · 2도 49.2% · 3도 43.0%", font=F(24, False), fill=GRAY, anchor="mm")

# 카드 1: 찜질기 실태
y = 632
d.rounded_rectangle([56, y, W - 56, y + 300], radius=26, fill=CARD)
d.text((96, y + 26), "온열 찜질기, 사기 전에 볼 숫자", font=F(28), fill=GRAY)
d.text((96, y + 82), "찜질팩 18개 중 9개  유해물질 기준 초과", font=F(28), fill=WHITE)
d.text((96, y + 136), "최고 400배  프탈레이트 가소제(DEHP)", font=F(28), fill=RED)
d.text((96, y + 190), "0개  지속시간·최고온도 표시한 제품", font=F(28), fill=AMBER)
d.text((96, y + 246), "1등급 의료기기 = 압박용 밴드, 온열 아님", font=F(23, False), fill=GRAY)

# 카드 2: 3초 비교
y = 964
d.rounded_rectangle([56, y, W - 56, y + 386], radius=26, fill=CARD)
d.text((96, y + 24), "3초 결론: 오늘 살 3개 (2026-11-14 쿠팡)", font=F(26), fill=GRAY)
rows = [
    ("오아 무선 온열 공기압 무릎 마사지기", "118,000원 · 공기압+온열 · 후기 259", GREEN),
    ("스마일마더 온열 무릎 찜질기", "42,890원 · 유선 온열 · 후기 1,143", AMBER),
    ("레노브라 1등급 의료기기 보호대", "19,800원(2개) · 압박 전용 · 후기 3,034", BLUE),
]
for i, (name, sub, color) in enumerate(rows):
    yy = y + 76 + i * 100
    d.ellipse([96, yy + 6, 96 + 40, yy + 46], fill=color)
    d.text((116, yy + 26), str(i + 1), font=F(24), fill=(10, 10, 14), anchor="mm")
    d.text((156, yy + 2), name, font=F(28), fill=WHITE)
    d.text((156, yy + 44), sub, font=F(23, False), fill=GRAY)

# 카드 3: 핵심 처방
y = 1392
d.rounded_rectangle([56, y, W - 56, y + 316], radius=26, fill=(18, 26, 24))
d.text((96, y + 24), "오늘 밤부터 지킬 3가지", font=F(27), fill=GREEN)
d.text((96, y + 80), "① 잘 때는 핫팩 무릎에 두지 않기", font=F(27), fill=WHITE)
d.text((96, y + 136), "② 온열은 40℃ 근처에서 20분 안쪽", font=F(27), fill=WHITE)
d.text((96, y + 192), "③ 붓고 열나면 온열 대신 냉찜질", font=F(27), fill=WHITE)
d.text((96, y + 258), "10년 뒤에도 걸으려면 오늘 20분이 답입니다", font=F(23, False), fill=GRAY)

# 하단 푸터
d.rectangle([0, 1740, W, H], fill=(12, 14, 20))
d.text((W // 2, 1800), "전체 비교표는 프로필 링크의 ttajyeobom.com", font=F(28), fill=WHITE, anchor="mm")
d.text((W // 2, 1856), "@kkkyy.ya · 숫자로 따져보는 생활 가이드", font=F(22, False), fill=GRAY, anchor="mm")

out = "/workspace/downloads/winter_knee_pain_threads_infographic.png"
img.save(out, "PNG")
print(out)
