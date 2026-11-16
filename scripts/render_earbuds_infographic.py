#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 82번째 무선이어폰 가격·성능 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1920
FONT = "/usr/share/fonts/pickle-hwp/NotoSansCJKkr-Bold.otf"
FONT_R = "/usr/share/fonts/pickle-hwp/NotoSansCJKkr-Regular.otf"
try:
    ImageFont.truetype(FONT, 20)
except OSError:
    FONT = "/usr/share/fonts/pickle-hwp/NotoSansCJKkr-Regular.otf"


def F(sz, bold=True):
    return ImageFont.truetype(FONT if bold else FONT_R, sz)


BG = (8, 10, 16)
CARD = (26, 29, 38)
RED = (255, 78, 78)
DEEP = (96, 12, 24)
AMBER = (255, 184, 48)
BLUE = (94, 172, 255)
GREEN = (58, 208, 148)
WHITE = (247, 249, 253)
GRAY = (170, 178, 194)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# 상단 배지
d.rectangle([0, 0, W, 320], fill=DEEP)
d.rounded_rectangle([56, 44, 56 + 640, 44 + 62], radius=16, fill=RED)
d.text((56 + 320, 44 + 31), "소비자원 시험 10종", font=F(30), fill=(24, 6, 8), anchor="mm")
d.text((W // 2, 170), "3만원과 35만원 이어폰", font=F(58), fill=WHITE, anchor="mm")
d.text((W // 2, 252), "소리 등급은 같았다", font=F(66), fill=(255, 208, 120), anchor="mm")

# 히어로 수치
d.text((W // 2, 398), "원음재생 성능 우수", font=F(32, False), fill=GRAY, anchor="mm")
d.text((W // 2, 486), "10개 중 8개", font=F(132), fill=GREEN, anchor="mm")
d.text((W // 2, 600), "값은 24,800원에서 359,000원까지 14.5배", font=F(32, False), fill=WHITE, anchor="mm")

# 카드 1: 어디서 갈리나
cy = 660
d.rounded_rectangle([56, cy, W - 56, cy + 430], radius=28, fill=CARD)
d.text((96, cy + 40), "값 차이가 나는 곳", font=F(34), fill=GRAY)
d.line([96, cy + 92, W - 96, cy + 92], fill=(62, 68, 84), width=2)

rows = [
    ("노이즈캔슬링", "14dB", "22dB", RED),
    ("재생시간", "4시간 50분", "15시간 10분", BLUE),
    ("통화품질", "조용한 곳 5종", "시끄러운 곳 3종", AMBER),
]
ry = cy + 126
for label, a, b, col in rows:
    d.text((96, ry), label, font=F(30), fill=WHITE)
    d.text((96, ry + 46), a, font=F(34), fill=GRAY)
    d.text((520, ry + 46), b, font=F(38), fill=col)
    ry += 96

# 카드 2: 통화 순서
cy2 = 1130
d.rounded_rectangle([56, cy2, W - 56, cy2 + 330], radius=28, fill=CARD)
d.text((96, cy2 + 40), "통화는 장소가 순서를 바꾼다", font=F(34), fill=GRAY)
d.line([96, cy2 + 92, W - 96, cy2 + 92], fill=(62, 68, 84), width=2)
d.text((96, cy2 + 116), "조용한 방", font=F(30), fill=WHITE)
d.text((96, cy2 + 162), "삼성 · 소니 · 애플 · 브리츠 · 샤오미", font=F(30, False), fill=(206, 214, 228))
d.text((96, cy2 + 218), "버스·기차", font=F(30), fill=WHITE)
d.text((96, cy2 + 264), "삼성 · 애플 · LG xboom", font=F(30, False), fill=(206, 214, 228))

# 하단 경고
d.rectangle([0, 1500, W, 1640], fill=(72, 20, 10))
d.text((W // 2, 1570), "ANC는 켜면 재생시간이 0에서 48퍼센트까지 깎인다", font=F(31), fill=(255, 202, 150), anchor="mm")

d.text((W // 2, 1700), "4만원짜리 산 사람이 아끼는 건 소리가 아니라", font=F(29, False), fill=GRAY, anchor="mm")
d.text((W // 2, 1752), "ANC 8dB와 통화, 배터리다", font=F(40), fill=WHITE, anchor="mm")
d.text((W // 2, 1845), "자세한 시험표는 프로필 링크에", font=F(28, False), fill=(140, 148, 164), anchor="mm")

img.save("/workspace/downloads/earbuds-82-infographic.png", quality=95)
print("saved")
