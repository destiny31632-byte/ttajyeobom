#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 34번째 보온 텀블러 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
d.text((W//2, 70), "새 텀블러 그냥 물로", font=F(70), fill=WHITE, anchor="mm")
d.text((W//2, 165), "헹구면 연마제를 그대로 마십니다", font=F(58), fill=(255, 220, 120), anchor="mm")
d.text((W//2, 245), "연마제 주성분 탄화규소 — IARC 2A군 발암 추정 물질", font=F(34, False), fill=WHITE, anchor="mm")
d.text((W//2, 300), "물·세제로는 안 빠지는 소수성 분말입니다", font=F(34, False), fill=(255, 190, 190), anchor="mm")

# 구분선
d.line([(60, 380), (W-60, 380)], fill=(70, 80, 95), width=3)
d.text((W//2, 440), "겨울 보온 텀블러 BEST 3", font=F(58), fill=WHITE, anchor="mm")

rows = [
    ("1위", "데일리 원터치", "써모스 뉴 데일리 원터치 500ml", "28,620원", "경량 원터치 · 상품평 3,395 · 37% 할인", GOLD),
    ("2위", "대용량 빨대형", "스탠리 퀜처 H2.0 플로우스테이트", "42,480원", "887ml 빨대뚜껑 · 상품평 48,637", SILVER),
    ("3위", "슬림 보온병형", "조지루시 원터치 텀블러 600ml", "36,900원", "원터치 보온병 · 상품평 909 · 25% 할인", BRONZE),
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

# 실측 박스
d.rounded_rectangle([60, y, W-60, y+300], radius=26, outline=BLUE, width=5)
d.text((W//2, y+50), "서울YWCA 13종 실측", font=F(50), fill=(120, 180, 255), anchor="mm")
d.text((100, y+125), "① 보온·보냉 총합 1등 = 써모스(캐리 루프)", font=F(37), fill=WHITE, anchor="lm")
d.text((100, y+185), "② 밀폐형 보온 31.3~48.6℃ · 준밀폐형 22.5~26.2℃", font=F(37), fill=WHITE, anchor="lm")
d.text((100, y+245), "③ 제품 간 보온 온도 최대 17.3℃ 차이", font=F(37), fill=WHITE, anchor="lm")
y += 300 + 30

# 안전 수칙 박스
d.rounded_rectangle([60, y, W-60, y+250], radius=26, outline=RED, width=5)
d.text((W//2, y+48), "연마제 제거·세척 순서", font=F(48), fill=RED, anchor="mm")
d.text((100, y+112), "① 식용유 묻힌 키친타월로 닦기 → 식초물 10분 끓이기", font=F(36), fill=WHITE, anchor="lm")
d.text((100, y+168), "② 뚜껑·패킹·빨대 분리 세척 주 2~3회 + 완전 건조", font=F(36), fill=WHITE, anchor="lm")

# 푸터
d.text((W//2, H-170), "스테인리스 304 vs 316 비교표와", font=F(40, False), fill=GRAY, anchor="mm")
d.text((W//2, H-110), "프로필 링크 @kkkyy.ya ttajyeobom.com", font=F(46), fill=GREEN, anchor="mm")
d.text((W//2, H-48), "따져봄 · 숫자로 따져보는 겨울 살림", font=F(30, False), fill=(90, 100, 115), anchor="mm")

img.save("/workspace/downloads/threads_tumbler_infographic.png")
print("saved", img.size)
