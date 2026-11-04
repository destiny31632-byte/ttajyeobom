#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 40번째 겨울 타이어 공기압 경고등 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
RED = (255, 82, 82)
GREEN = (46, 204, 113)
BLUE = (80, 140, 255)
ORANGE = (255, 140, 40)
WHITE = (245, 247, 250)
GRAY = (160, 170, 185)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# 상단 경고 배너 (레드/블랙)
d.rectangle([0, 0, W, 300], fill=(140, 20, 20))
d.text((W//2, 62), "겨울 아침 공기압 경고등, 무시하면 전복입니다", font=F(46), fill=WHITE, anchor="mm")
d.text((W//2, 148), "펑크가 아니라 기온입니다 — 기온 10도 하강마다 1~2psi 자연 감압", font=F(32), fill=(255, 220, 120), anchor="mm")
d.text((W//2, 218), "경고등 기준은 20% 빠진 뒤 — 이미 늦은 신호", font=F(30, False), fill=WHITE, anchor="mm")
d.text((W//2, 266), "저공기압 고속주행 = 스탠딩 웨이브 파열·전복 경로", font=F(30, False), fill=(255, 190, 190), anchor="mm")

d.line([(60, 336), (W-60, 336)], fill=(70, 80, 95), width=3)
d.text((W//2, 380), "경고등이 켜지는 3대 원인", font=F(50), fill=WHITE, anchor="mm")

rows = [
    ("원인 1", "기온 급강하", "기온 10도 내려갈 때마다 1~2psi 감소 — 첫 한파 아침에 집중", RED),
    ("원인 2", "자연 누출", "결함 없어도 월 0.25~0.5psi씩 고무로 새어나감 — 월 1회 점검", ORANGE),
    ("원인 3", "한 곳만 빠짐", "네 바퀴 중 유독 한 곳이면 펑크·밸브 누출 — 정비소 점검", ORANGE),
]

y = 424
for badge, title, desc, color in rows:
    card_h = 140
    d.rounded_rectangle([60, y, W-60, y+card_h], radius=22, fill=CARD, outline=color, width=4)
    d.rounded_rectangle([92, y+24, 92+120, y+24+54], radius=12, fill=color)
    d.text((92+60, y+24+27), badge, font=F(34), fill=(20, 24, 30), anchor="mm")
    d.text((236, y+52), title, font=F(38), fill=WHITE, anchor="lm")
    d.text((92, y+116), desc, font=F(27, False), fill=GRAY, anchor="lm")
    y += card_h + 14

# 숫자 기준 박스
y += 4
d.rounded_rectangle([60, y, W-60, y+190], radius=22, fill=CARD, outline=GREEN, width=4)
d.text((92, y+40), "숫자로 기억하는 공기압 팩트", font=F(38), fill=GREEN, anchor="lm")
d.text((92, y+96), "점등 기준 20%·150kPa · 겨울철 기준보다 10% 높이기", font=F(31), fill=WHITE, anchor="lm")
d.text((92, y+142), "측정은 주행 3시간 뒤 냉간 상태 · 45psi 과다 주입 금지", font=F(29, False), fill=GRAY, anchor="lm")

# 위험 비교 박스
y += 228
d.rounded_rectangle([60, y, W-60, y+320], radius=22, fill=CARD, outline=BLUE, width=4)
d.text((92, y+40), "무시하면 얼마나 위험한가", font=F(38), fill=BLUE, anchor="lm")
lines = [
    ("파손 사고", "치사율 일반 사고의 2.5배", RED),
    ("파열 사고", "치사율 12.3배", RED),
    ("젖은 노면", "28.6% 부족 시 제동거리 2.2m 증가", ORANGE),
    ("고속주행", "150km/h 전후 스탠딩 웨이브 파열", RED),
]
ly = y + 80
for tag, desc, color in lines:
    d.rounded_rectangle([92, ly, 92+230, ly+50], radius=12, fill=(35, 45, 60))
    d.text((92+115, ly+25), tag, font=F(27), fill=color, anchor="mm")
    d.text((350, ly+25), desc, font=F(27, False), fill=WHITE, anchor="lm")
    ly += 52

# 대응 박스
y += 348
d.rounded_rectangle([60, y, W-60, y+150], radius=22, fill=CARD, outline=GOLD, width=4)
d.text((92, y+36), "대응은 3시간 뒤 재고 10% 높여 넣기", font=F(35), fill=GOLD, anchor="lm")
d.text((92, y+88), "문 안쪽 스티커 기준 30~35psi · 주행 중 꺼져도 공기 보충 아님", font=F(29, False), fill=WHITE, anchor="lm")
d.text((92, y+124), "트렁크 전동 에어펌프(오토스톱)가 겨울 아침 30분을 줄임", font=F(29, False), fill=GREEN, anchor="lm")

# 결론 박스
d.rounded_rectangle([60, H-300, W-60, H-170], radius=22, fill=(30, 45, 35), outline=GREEN, width=4)
d.text((W//2, H-262), "냉간 측정 · 겨울 10% 보충 · 월 1회 점검", font=F(36), fill=GREEN, anchor="mm")
d.text((W//2, H-208), "경고등 무시하고 고속도로 오르는 한 끼가 파열 사고가 됩니다", font=F(28, False), fill=GRAY, anchor="mm")

# 하단 CTA
d.text((W//2, H-96), "스탠딩 웨이브 원리·에어펌프 BEST3 랭킹 → 프로필 링크", font=F(38), fill=WHITE, anchor="mm")
d.text((W//2, H-40), "따져봄 ttajyeobom.com | 출처: 국가법령정보센터·NHTSA·한국교통안전공단·기아", font=F(22, False), fill=GRAY, anchor="mm")

img.save("/workspace/downloads/threads_tire_pressure_infographic.png")
print("saved", img.size)
