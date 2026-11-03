#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 37번째 온수매트 누수·세균 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
d.text((W//2, 62), "온수매트 호스 터지면 도배비 몇백만 원", font=F(56), fill=WHITE, anchor="mm")
d.text((W//2, 148), "5년간 온수매트 안전사고 684건 (소비자원)", font=F(40), fill=(255, 220, 120), anchor="mm")
d.text((W//2, 218), "사고 원인 1위 '제품 불량' 60.7% — 누수·화상", font=F(30, False), fill=WHITE, anchor="mm")
d.text((W//2, 266), "아래층 누수 배상 판결 140만~380만 원", font=F(30, False), fill=(255, 190, 190), anchor="mm")

d.line([(60, 336), (W-60, 336)], fill=(70, 80, 95), width=3)
d.text((W//2, 390), "잔수 방치 보관, 이게 왜 문제냐면", font=F(50), fill=WHITE, anchor="mm")

rows = [
    ("보관 1", "물 안 빼고 접어 보관", "밀폐 고인 물 → 악취·곰팡이 (제조사 안내)", RED),
    ("보관 2", "뜨거울 때 바로 배수", "화상 위험 + 제품 고장 (식은 뒤 빼기)", ORANGE),
    ("보관 3", "매트를 세탁기에 돌리기", "내부 호스 꺾임 → 다음 시즌 누수", ORANGE),
]

y = 440
for badge, title, desc, color in rows:
    card_h = 140
    d.rounded_rectangle([60, y, W-60, y+card_h], radius=22, fill=CARD, outline=color, width=4)
    d.rounded_rectangle([92, y+24, 92+120, y+24+54], radius=12, fill=color)
    d.text((92+60, y+24+27), badge, font=F(34), fill=(20, 24, 30), anchor="mm")
    d.text((236, y+52), title, font=F(38), fill=WHITE, anchor="lm")
    d.text((92, y+116), desc, font=F(28, False), fill=GRAY, anchor="lm")
    y += card_h + 14

# 세균 박스
y += 4
d.rounded_rectangle([60, y, W-60, y+220], radius=22, fill=CARD, outline=BLUE, width=4)
d.text((92, y+42), "매트 속 물, 세균은 이 온도에서 자란다", font=F(36), fill=BLUE, anchor="lm")
d.text((92, y+106), "레지오넬라균 증식 구간 25~45도 (질병관리청)", font=F(31), fill=WHITE, anchor="lm")
d.text((92, y+156), "MBC 뜯어보기: 내부 세균 변기급 · 물 썩으면 과부하", font=F(29, False), fill=GRAY, anchor="lm")
d.text((92, y+204), "해결: 시즌 시작 물갈이 + 한 달 1회 전체 교체", font=F(29, False), fill=GREEN, anchor="lm")
y += 240

# 물 종류 팩트 박스
d.rounded_rectangle([60, y, W-60, y+310], radius=22, fill=CARD, outline=GREEN, width=4)
d.text((92, y+42), "수돗물 vs 정수기물, 기준 팩트", font=F(38), fill=GREEN, anchor="lm")
lines = [
    ("수돗물", "가능 — 잔류염소 0.1mg/L 법정 유지", BLUE),
    ("정수기물", "가능 — 염소 없음, 교체 주기 더 짧게", GOLD),
    ("지하수·식염수", "금지 — 배관·펌프 부식 (공식 FAQ)", RED),
    ("세정제·향료", "금지 — 호스·패킹 손상", RED),
]
ly = y + 88
for tag, desc, color in lines:
    d.rounded_rectangle([92, ly, 330, ly+50], radius=12, fill=(35, 45, 60))
    d.text((211, ly+25), tag, font=F(27), fill=color, anchor="mm")
    d.text((350, ly+25), desc, font=F(27, False), fill=WHITE, anchor="lm")
    ly += 56

# 전자파·소음 박스
y += 326
d.rounded_rectangle([60, y, W-60, y+140], radius=22, fill=CARD, outline=BLUE, width=4)
d.text((92, y+40), "전자파·소음의 정체는 펌프 모터", font=F(36), fill=BLUE, anchor="lm")
d.text((92, y+86), "매트 위 전자파 기준 대비 0.17% (국립전파연구원)", font=F(29, False), fill=WHITE, anchor="lm")
d.text((92, y+122), "대응: 보일러 30cm 이격 + 바닥 고무패드", font=F(29, False), fill=GREEN, anchor="lm")

# 결론 박스
d.rounded_rectangle([60, H-300, W-60, H-170], radius=22, fill=(30, 45, 35), outline=GREEN, width=4)
d.text((W//2, H-262), "연결부 30분 점검 · 월 1회 물갈이 · 끝나면 완전 배수", font=F(36), fill=GREEN, anchor="mm")
d.text((W//2, H-208), "누수 반복 2회 → 교환·환급 청구 가능 (소비자분쟁해결기준)", font=F(28, False), fill=GRAY, anchor="mm")

# 하단 CTA
d.text((W//2, H-96), "누수 배상 판례·물 관리 표 전체 → 프로필 링크", font=F(38), fill=WHITE, anchor="mm")
d.text((W//2, H-40), "따져봄 ttajyeobom.com | 출처: 한국소비자원·질병관리청·국립전파연구원·서울중앙지법", font=F(22, False), fill=GRAY, anchor="mm")

img.save("/workspace/downloads/threads_hot_water_mat_infographic.png")
print("saved", img.size)
