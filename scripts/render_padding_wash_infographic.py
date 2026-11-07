#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 49번째 구스다운 패딩 드라이클리닝 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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


BG = (12, 14, 18)
CARD = (26, 30, 38)
RED = (255, 70, 70)
DEEP = (130, 16, 16)
AMBER = (255, 176, 32)
BLUE = (90, 170, 255)
WHITE = (245, 247, 250)
GRAY = (168, 176, 188)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# 상단 경고 배너
d.rectangle([0, 0, W, 316], fill=DEEP)
d.rounded_rectangle([70, 38, 70 + 350, 38 + 62], radius=14, fill=RED)
d.text((70 + 175, 38 + 31), "세탁소도 안 하는 짓", font=F(30), fill=(20, 10, 10), anchor="mm")
d.text((W // 2, 158), "100만원 구스다운 패딩", font=F(60), fill=WHITE, anchor="mm")
d.text((W // 2, 238), "드라이 맡기면 벌어지는 일", font=F(60), fill=(255, 196, 120), anchor="mm")

# 히어로 수치
d.text((W // 2, 400), "5회 반복세탁 후 보온율", font=F(34, False), fill=GRAY, anchor="mm")
d.text((W // 2, 508), "87.3%", font=F(170), fill=RED, anchor="mm")
d.text((W // 2, 618), "전용 중성세제 물세탁은 99.8% 유지", font=F(33), fill=WHITE, anchor="mm")

d.line([(70, 676), (W - 70, 676)], fill=(70, 78, 92), width=3)

# 팩트 카드 3개
rows = [
    ("01", "유기용제가 기름막을 녹인다", "거위털 유지분이 빠지면 털이 뭉치고 공기층이 사라짐", RED),
    ("02", "충전도도 100에서 88로", "같은 5회 세탁, 물세탁은 98 유지 · 공인시험기관 실험", AMBER),
    ("03", "세탁 사고 절반이 방법 탓", "소비자원 심의 세탁방법 부적합 497건(50.8%)", BLUE),
]

y = 716
card_h = 196
for badge, title, desc, color in rows:
    d.rounded_rectangle([60, y, W - 60, y + card_h], radius=22, fill=CARD, outline=color, width=4)
    d.rounded_rectangle([92, y + 30, 92 + 92, y + 30 + 56], radius=12, fill=color)
    d.text((92 + 46, y + 30 + 28), badge, font=F(30), fill=(16, 18, 22), anchor="mm")
    d.text((212, y + 62), title, font=F(42), fill=WHITE, anchor="lm")
    d.text((92, y + 148), desc, font=F(26, False), fill=GRAY, anchor="lm")
    y += card_h + 18

# 하단 처방 박스
by = y + 18
d.rounded_rectangle([60, by, W - 60, by + 250], radius=22, fill=(18, 34, 26), outline=(80, 200, 140), width=4)
d.text((92, by + 42), "그래서 정답은 집에서 10분", font=F(36), fill=(170, 255, 210), anchor="lm")
d.text((92, by + 108), "본세탁 10분 · 헹굼 4회 · 강탈수", font=F(40), fill=WHITE, anchor="lm")
d.text((92, by + 166), "마른 수건 넣고 한 번 더 탈수하면 600g이 더 빠짐", font=F(27, False), fill=GRAY, anchor="lm")
d.text((92, by + 210), "라벨에 드라이 표기만 있으면 그건 부자재 때문", font=F(28), fill=(180, 240, 210), anchor="lm")

# 푸터
d.line([(70, 1770), (W - 70, 1770)], fill=(70, 78, 92), width=3)
d.text((W // 2, 1822), "따져봄 | 겨울 패딩 세탁·관리 팩트", font=F(34), fill=WHITE, anchor="mm")
d.text((W // 2, 1872), "상세 비교표는 프로필 링크 ttajyeobom.com", font=F(27, False), fill=GRAY, anchor="mm")

img.save("/workspace/downloads/padding_wash_threads_infographic.png", "PNG")
print("saved", img.size)
