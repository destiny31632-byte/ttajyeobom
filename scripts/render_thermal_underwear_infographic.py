#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 33번째 발열내의 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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

BG = (13, 17, 23)
CARD = (23, 30, 41)
GOLD = (255, 193, 7)
SILVER = (189, 195, 199)
BRONZE = (205, 127, 50)
RED = (255, 82, 82)
GREEN = (46, 204, 113)
BLUE = (80, 140, 255)
WHITE = (245, 247, 250)
GRAY = (160, 170, 185)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# 상단 경고 배너
d.rectangle([0, 0, W, 340], fill=(140, 20, 20))
d.text((W//2, 70), "발열내의, 입기만 하면", font=F(66), fill=WHITE, anchor="mm")
d.text((W//2, 160), "따뜻해지지 않습니다", font=F(80), fill=(255, 220, 120), anchor="mm")
d.text((W//2, 245), "흡습발열은 수분(땀)이 있어야 열을 냅니다", font=F(38, False), fill=WHITE, anchor="mm")
d.text((W//2, 300), "건조한 피부·가만히 있는 날엔 발열 효과가 미미합니다", font=F(34, False), fill=(255, 190, 190), anchor="mm")

# 구분선
d.line([(60, 380), (W-60, 380)], fill=(70, 80, 95), width=3)
d.text((W//2, 440), "발열내의·방한내의 BEST 3", font=F(58), fill=WHITE, anchor="mm")

rows = [
    ("1위", "데일리 발열내의", "마른파이브 히트터치 기모 세트", "14,960원", "흡습발열+기모 · 상품평 18,440 · 최고 81%", GOLD),
    ("2위", "혹한기 방한내의", "슬레진저 초극세사 기모 내의", "13,410원", "초극세사 기모 · 상품평 14,480 · 정지 보온", SILVER),
    ("3위", "메리노울 내의", "울파워 크루넥 200 메리노울", "114,400원", "스웨덴산 천연 메리노울 · 자체 흡습열", BRONZE),
]

y = 505
for badge, kind, name, price, spec, color in rows:
    card_h = 200
    d.rounded_rectangle([60, y, W-60, y+card_h], radius=26, fill=CARD, outline=color, width=4)
    d.rounded_rectangle([92, y+28, 92+110, y+28+64], radius=14, fill=color)
    d.text((92+55, y+28+32), badge, font=F(42), fill=(20, 24, 30), anchor="mm")
    d.text((232, y+62), kind, font=F(36), fill=color, anchor="lm")
    d.text((92, y+120), name, font=F(40), fill=WHITE, anchor="lm")
    d.text((W-92, y+118), price, font=F(50), fill=(120, 220, 160), anchor="rm")
    d.text((92, y+174), spec, font=F(29, False), fill=GRAY, anchor="lm")
    y += card_h + 20

# 선택 원칙 박스
d.rounded_rectangle([60, y, W-60, y+300], radius=26, outline=BLUE, width=5)
d.text((W//2, y+50), "발열내의 고르는 3원칙", font=F(50), fill=(120, 180, 255), anchor="mm")
d.text((100, y+125), "① 움직이는 날=발열내의 · 정지하는 날=기모", font=F(37), fill=WHITE, anchor="lm")
d.text((100, y+185), "② 발열≠보온 — 발열 1위와 보온 1위는 다르다", font=F(37), fill=WHITE, anchor="lm")
d.text((100, y+245), "③ '히트'가 다 발열은 아님 — 시험방법 확인", font=F(37), fill=WHITE, anchor="lm")
y += 300 + 30

# 안전 수칙 박스
d.rounded_rectangle([60, y, W-60, y+250], radius=26, outline=RED, width=5)
d.text((W//2, y+48), "가려움·세탁 주의", font=F(48), fill=RED, anchor="mm")
d.text((100, y+112), "① 섬유유연제 금지 — 흡습성 0 사례 존재", font=F(37), fill=WHITE, anchor="lm")
d.text((100, y+168), "② 가려움: 목욕 후 3분 내 보습 · 실내 습도 40~50%", font=F(37), fill=WHITE, anchor="lm")

# 푸터
d.text((W//2, H-170), "소재별(아크릴·레이온·메리노울) 비교표와", font=F(40, False), fill=GRAY, anchor="mm")
d.text((W//2, H-110), "프로필 링크 @kkkyy.ya ttajyeobom.com", font=F(46), fill=GREEN, anchor="mm")
d.text((W//2, H-48), "따져봄 · 숫자로 따져보는 겨울 살림", font=F(30, False), fill=(90, 100, 115), anchor="mm")

img.save("/workspace/downloads/threads_thermal_underwear_infographic.png")
print("saved", img.size)
