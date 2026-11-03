#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 35번째 스노우체인 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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

# 상단 경고 배너 (레드)
d.rectangle([0, 0, W, 300], fill=(140, 20, 20))
d.text((W//2, 62), "폭설 오는 날 아침", font=F(68), fill=WHITE, anchor="mm")
d.text((W//2, 148), "빙판길 제동거리는 마른 노면의 7배", font=F(52), fill=(255, 220, 120), anchor="mm")
d.text((W//2, 222), "시속 30km 승용차 — 1.5m가 10.7m로 (TS실측)", font=F(30, False), fill=WHITE, anchor="mm")
d.text((W//2, 272), "버스는 시속 60km에서 118.7m", font=F(30, False), fill=(255, 190, 190), anchor="mm")

d.line([(60, 336), (W-60, 336)], fill=(70, 80, 95), width=3)
d.text((W//2, 392), "스노우체인 BEST 3", font=F(54), fill=WHITE, anchor="mm")

rows = [
    ("1위", "직물체인", "오토삭 직물체인 697모델", "115,000원", "EN 16662-1 인증 · 3분 장착 · 상품평 17", GOLD),
    ("2위", "우레탄 자동", "태영 자동 우레탄 스노우체인 4호", "60,160원", "39% 할인 · 상품평 487 · 50km/h", SILVER),
    ("3위", "스프레이", "불스원 레인OK NEW 500ml 2개", "16,460원", "24% 할인 · 상품평 4,533 · 비상용", BRONZE),
]

y = 452
for badge, kind, name, price, spec, color in rows:
    card_h = 172
    d.rounded_rectangle([60, y, W-60, y+card_h], radius=24, fill=CARD, outline=color, width=4)
    d.rounded_rectangle([92, y+24, 92+104, y+24+58], radius=13, fill=color)
    d.text((92+52, y+24+29), badge, font=F(38), fill=(20, 24, 30), anchor="mm")
    d.text((224, y+52), kind, font=F(32), fill=color, anchor="lm")
    d.text((92, y+104), name, font=F(34), fill=WHITE, anchor="lm")
    d.text((W-92, y+102), price, font=F(44), fill=(120, 220, 160), anchor="rm")
    d.text((92, y+148), spec, font=F(27, False), fill=GRAY, anchor="lm")
    y += card_h + 18

# 감속 의무 박스
y += 8
d.rounded_rectangle([60, y, W-60, y+186], radius=24, fill=CARD, outline=BLUE, width=4)
d.text((92, y+36), "눈길 법정 감속 (도로교통법 시행규칙)", font=F(34), fill=BLUE, anchor="lm")
d.text((92, y+102), "눈 20mm 미만 — 최고속도의 20% 감속", font=F(37), fill=WHITE, anchor="lm")
d.text((92, y+158), "결빙·적설 20mm 이상 — 50% 감속", font=F(37), fill=(255, 130, 130), anchor="lm")
y += 206

# 방식별 한줄 비교
d.rounded_rectangle([60, y, W-60, y+384], radius=24, fill=CARD, outline=(70, 80, 95), width=3)
d.text((92, y+42), "4가지 방식, 숫자로 따져보면", font=F(38), fill=WHITE, anchor="lm")
lines = [
    ("직물체인", "3분 장착·휠 무손상, 빙판 제동 약함", GREEN),
    ("우레탄·사슬", "빙판 제동 최강, 30km/h 이하", RED),
    ("스프레이", "수백 m면 끝(ADAC) — 비상용", GRAY),
    ("윈터타이어", "눈길 제동 18.49m vs 37.84m", GOLD),
]
ly = y + 100
for title_, desc, color in lines:
    d.rounded_rectangle([92, ly, 302, ly+54], radius=12, fill=(35, 45, 60))
    d.text((197, ly+27), title_, font=F(29), fill=color, anchor="mm")
    d.text((322, ly+27), desc, font=F(28, False), fill=WHITE, anchor="lm")
    ly += 70

# 결론 박스
y += 404
d.rounded_rectangle([60, y, W-60, y+130], radius=24, fill=(30, 45, 35), outline=GREEN, width=4)
d.text((W//2, y+44), "기본은 윈터타이어, 트렁크엔 직물체인", font=F(40), fill=GREEN, anchor="mm")
d.text((W//2, y+98), "결빙 사고 치사율은 평상시의 1.5~1.8배 (도로교통공단)", font=F(28, False), fill=GRAY, anchor="mm")

# 하단 CTA
d.text((W//2, H-72), "차종별 규격표·비교 계산기 → 프로필 링크", font=F(38), fill=WHITE, anchor="mm")
d.text((W//2, H-30), "따져봄 ttajyeobom.com | 출처: TS한국교통안전공단·도로교통공단·기아·현대", font=F(24, False), fill=GRAY, anchor="mm")

img.save("/workspace/downloads/threads_snow_chains_infographic.png")
print("saved", img.size)
