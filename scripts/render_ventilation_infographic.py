#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 52번째 겨울철 환기·습도 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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


BG = (9, 10, 14)
CARD = (24, 27, 36)
RED = (255, 62, 62)
DEEP = (120, 12, 12)
AMBER = (255, 176, 32)
BLUE = (86, 168, 255)
GREEN = (60, 205, 145)
WHITE = (246, 248, 252)
GRAY = (172, 180, 194)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# 상단 경고 배지
d.rectangle([0, 0, W, 300], fill=DEEP)
d.rounded_rectangle([56, 40, 56 + 700, 40 + 60], radius=14, fill=RED)
d.text((56 + 350, 40 + 30), "⚠️ 공기청정기는 CO2를 1도 못 거른다", font=F(28), fill=(20, 6, 6), anchor="mm")
d.text((W // 2, 160), "창문 닫고 공기청정기만 틀었다가", font=F(46), fill=WHITE, anchor="mm")
d.text((W // 2, 238), "아침 두통의 정체", font=F(54), fill=(255, 196, 120), anchor="mm")

# 히어로 수치
d.text((W // 2, 372), "닫힌 교실, 수업 30분 만에", font=F(30, False), fill=GRAY, anchor="mm")
d.text((W // 2, 455), "2,000ppm", font=F(140), fill=RED, anchor="mm")
d.text((W // 2, 585), "실내공기질 기준 1,000ppm의 2배", font=F(32, False), fill=WHITE, anchor="mm")

# 비교 카드
card_y = 640
d.rounded_rectangle([56, card_y, W - 56, card_y + 300], radius=26, fill=CARD)
d.text((96, card_y + 44), "무엇을 걸러내나", font=F(30), fill=GRAY)
d.line([96, card_y + 96, W - 96, card_y + 96], fill=(60, 66, 80), width=2)

rows = [
    ("미세먼지", "공기청정기 O", GREEN, "환기 X", GRAY),
    ("이산화탄소", "공기청정기 X", RED, "환기 O", GREEN),
    ("산소 회복", "공기청정기 X", RED, "환기 O", GREEN),
]
ry = card_y + 130
for label, a, ac, b, bc in rows:
    d.text((96, ry), label, font=F(34), fill=WHITE)
    d.text((470, ry), a, font=F(34), fill=ac)
    d.text((760, ry), b, font=F(30), fill=bc)
    ry += 62

# 3가지 숫자 룰
d.text((W // 2, 1030), "오늘부터 맞출 세 숫자", font=F(40), fill=WHITE, anchor="mm")

box_top = 1085
items = [
    ("하루 3번", "5~10분, 두 창문 동시에", BLUE),
    ("18~20℃", "실내 적정온도, 난방비도 절약", AMBER),
    ("40~50%", "습도. 60% 넘으면 곰팡이", GREEN),
]
y = box_top
for big, small, color in items:
    d.rounded_rectangle([56, y, W - 56, y + 150], radius=22, fill=CARD)
    d.rectangle([56, y, 72, y + 150], fill=color)
    d.text((110, y + 38), big, font=F(64), fill=color)
    d.text((110, y + 112), small, font=F(30, False), fill=GRAY)
    y += 172

# 하단 경고 스트립
d.rectangle([0, 1660, W, H], fill=DEEP)
d.text((W // 2, 1712), "공기청정기 켜둔 채로도 환기는 하루 3번", font=F(36), fill=WHITE, anchor="mm")
d.text((W // 2, 1772), "자세한 기준표는 프로필 링크에", font=F(32, False), fill=(255, 205, 150), anchor="mm")
d.text((W // 2, 1840), "환경부 · 질병관리청 · 한국소비자원 자료 기준", font=F(24, False), fill=(240, 180, 180), anchor="mm")

out = "/workspace/downloads/ventilation_threads_infographic.png"
img.save(out, "PNG")
print(out, img.size)
