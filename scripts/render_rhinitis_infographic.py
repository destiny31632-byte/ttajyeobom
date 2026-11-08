#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 50번째 겨울 비염 코세척 안전 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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


BG = (10, 13, 18)
CARD = (24, 30, 38)
RED = (255, 72, 72)
DEEP = (128, 14, 14)
AMBER = (255, 178, 36)
BLUE = (86, 168, 255)
GREEN = (72, 205, 148)
WHITE = (245, 247, 250)
GRAY = (166, 175, 188)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# 상단 경고 배지
d.rectangle([0, 0, W, 320], fill=DEEP)
d.rounded_rectangle([56, 40, 56 + 470, 40 + 60], radius=14, fill=RED)
d.text((56 + 235, 40 + 30), "⚠ 수돗물 코세척의 치명적 참사", font=F(27), fill=(20, 8, 8), anchor="mm")
d.text((W // 2, 160), "코에 수돗물 넣었다가", font=F(58), fill=WHITE, anchor="mm")
d.text((W // 2, 242), "급성 중이염 · 한쪽 청력 상실", font=F(52), fill=(255, 198, 120), anchor="mm")

# 히어로 수치
d.text((W // 2, 402), "수돗물로 코 씻었다가 뇌 감염", font=F(33, False), fill=GRAY, anchor="mm")
d.text((W // 2, 512), "154명 중 4명 생존", font=F(96), fill=RED, anchor="mm")
d.text((W // 2, 606), "미국 CDC 1962~2021 · 생존자는 4명뿐", font=F(30), fill=WHITE, anchor="mm")

d.line([(70, 664), (W - 70, 664)], fill=(68, 76, 90), width=3)

rows = [
    ("01", "수돗물 · 렌즈 세척액은 금지", "끓여 식힌 물·증류수·멸균수만 (1분 끓임)", RED),
    ("02", "농도는 체액과 같은 0.9%", "고장성은 1.5~3%, 3% 초과는 통증·충혈", AMBER),
    ("03", "온도는 미지근하게 40℃", "차갑거나 뜨거우면 통증·점막 부종", BLUE),
    ("04", "'아-' 소리로 이관을 닫아라", "고개 숙이고 한쪽 100~150cc, 압력은 약하게", GREEN),
]
y = 704
card_h = 168
for badge, title, desc, color in rows:
    d.rounded_rectangle([56, y, W - 56, y + card_h], radius=20, fill=CARD, outline=color, width=4)
    d.rounded_rectangle([86, y + 26, 86 + 84, y + 26 + 52], radius=12, fill=color)
    d.text((86 + 42, y + 26 + 26), badge, font=F(28), fill=(14, 16, 20), anchor="mm")
    d.text((196, y + 54), title, font=F(38), fill=WHITE, anchor="lm")
    d.text((196, y + 116), desc, font=F(25, False), fill=GRAY, anchor="lm")
    y += card_h + 14

# 비교 박스
by = y + 6
d.rounded_rectangle([56, by, W - 56, by + 250], radius=20, fill=(16, 30, 40), outline=(60, 140, 210), width=4)
d.text((86, by + 40), "2026-11-08 실구매 비교", font=F(30), fill=(150, 210, 255), anchor="lm")
d.text((86, by + 96), "노즈스위퍼 키트 80p · 18,080원 · 1회 226원", font=F(29), fill=WHITE, anchor="lm")
d.text((86, by + 146), "노즈스위퍼 120포 · 21,780원 · 1회 181원", font=F(29), fill=WHITE, anchor="lm")
d.text((86, by + 196), "오므론 메쉬 네블라이저 · 114,000원 (관류 아님)", font=F(24, False), fill=GRAY, anchor="lm")

# 푸터
d.line([(70, 1772), (W - 70, 1772)], fill=(68, 76, 90), width=3)
d.text((W // 2, 1822), "따져봄 | 겨울 비염 코세척 안전 가이드", font=F(33), fill=WHITE, anchor="mm")
d.text((W // 2, 1874), "상세 비교표는 프로필 링크 ttajyeobom.com", font=F(26, False), fill=GRAY, anchor="mm")

img.save("/workspace/downloads/rhinitis_threads_infographic.png", "PNG")
print("saved", img.size)
