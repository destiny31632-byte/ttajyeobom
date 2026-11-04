#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 39번째 니트 보풀제거기 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
d.text((W//2, 62), "보풀제거기, 구멍은 칼날이 아닙니다", font=F(50), fill=WHITE, anchor="mm")
d.text((W//2, 148), "당긴 니트에 돌리면 실이 망 구멍으로 빨려 들어갑니다", font=F(34), fill=(255, 220, 120), anchor="mm")
d.text((W//2, 218), "12만원 울 니트가 5분 만에 실내복이 된 실측 사례", font=F(30, False), fill=WHITE, anchor="mm")
d.text((W//2, 266), "캐시미어·성긴 편물은 애초에 전동기 금지", font=F(30, False), fill=(255, 190, 190), anchor="mm")

d.line([(60, 336), (W-60, 336)], fill=(70, 80, 95), width=3)
d.text((W//2, 380), "구멍을 내는 3대 실수", font=F(50), fill=WHITE, anchor="mm")

rows = [
    ("실수 1", "손에 들고 하기", "옷이 팽팽해져 보풀 대신 조직이 잘림", RED),
    ("실수 2", "꾹 누르기", "잘 안 되면 힘 대신 보풀함·배터리 확인", ORANGE),
    ("실수 3", "젖은 옷에 사용", "젖은 편물은 실이 함께 끊김 — 완전 건조 후", ORANGE),
]

y = 424
for badge, title, desc, color in rows:
    card_h = 140
    d.rounded_rectangle([60, y, W-60, y+card_h], radius=22, fill=CARD, outline=color, width=4)
    d.rounded_rectangle([92, y+24, 92+120, y+24+54], radius=12, fill=color)
    d.text((92+60, y+24+27), badge, font=F(34), fill=(20, 24, 30), anchor="mm")
    d.text((236, y+52), title, font=F(38), fill=WHITE, anchor="lm")
    d.text((92, y+116), desc, font=F(28, False), fill=GRAY, anchor="lm")
    y += card_h + 14

# 스펙 기준 박스
y += 4
d.rounded_rectangle([60, y, W-60, y+190], radius=22, fill=CARD, outline=GREEN, width=4)
d.text((92, y+40), "RPM·망 높이, 이것만 기억", font=F(38), fill=GREEN, anchor="lm")
d.text((92, y+96), "회전수 분당 8,000회 이상 후기 좋음 · 니트는 1단", font=F(31), fill=WHITE, anchor="lm")
d.text((92, y+142), "망 높이는 권장보다 한 단계 위 · 망 열면 자동 정지", font=F(29, False), fill=GRAY, anchor="lm")

# 소재 비교 박스
y += 228
d.rounded_rectangle([60, y, W-60, y+320], radius=22, fill=CARD, outline=BLUE, width=4)
d.text((92, y+40), "소재별 사용 가능 여부", font=F(38), fill=BLUE, anchor="lm")
lines = [
    ("울·면", "전동기 가능 — 1단으로 시작", BLUE),
    ("아크릴·혼방", "가능 — 보풀 크고 안 떨어짐", GOLD),
    ("캐시미어", "전동기 금지 — 전용 빗만", RED),
    ("성긴 편물·자수", "금지 — 가위로 개별 제거", RED),
]
ly = y + 80
for tag, desc, color in lines:
    d.rounded_rectangle([92, ly, 92+230, ly+50], radius=12, fill=(35, 45, 60))
    d.text((92+115, ly+25), tag, font=F(27), fill=color, anchor="mm")
    d.text((350, ly+25), desc, font=F(27, False), fill=WHITE, anchor="lm")
    ly += 52

# 예방 박스
y += 356
d.rounded_rectangle([60, y, W-60, y+136], radius=22, fill=CARD, outline=GOLD, width=4)
d.text((92, y+38), "보풀 자체는 세탁 전 뒤집기 30초가 줄입니다", font=F(35), fill=GOLD, anchor="lm")
d.text((92, y+82), "뒤집어 세탁망 + 울코스 · 30도 이하 · 탈수 1분 이내", font=F(29, False), fill=WHITE, anchor="lm")
d.text((92, y+118), "손으로 뜯으면 그 자리가 헐거워져 보풀이 더 생김", font=F(29, False), fill=GREEN, anchor="lm")

# 결론 박스
d.rounded_rectangle([60, H-300, W-60, H-170], radius=22, fill=(30, 45, 35), outline=GREEN, width=4)
d.text((W//2, H-262), "평평하게 · 당기지 않고 · 누르지 않고 · 안쪽 테스트", font=F(36), fill=GREEN, anchor="mm")
d.text((W//2, H-208), "구멍 났으면 그 니트엔 다시 대지 않기 — 번집니다", font=F(28, False), fill=GRAY, anchor="mm")

# 하단 CTA
d.text((W//2, H-96), "회전식 vs 흡입식 비교표·BEST3 랭킹 → 프로필 링크", font=F(38), fill=WHITE, anchor="mm")
d.text((W//2, H-40), "따져봄 ttajyeobom.com | 출처: 울마크·KATRI·국가기술표준원(KS)·노써치", font=F(22, False), fill=GRAY, anchor="mm")

img.save("/workspace/downloads/threads_fabric_shaver_infographic.png")
print("saved", img.size)
