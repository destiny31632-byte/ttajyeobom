#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 43번째 겨울 전기히터·온풍기 전기세 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
d.text((W//2, 62), "2만원짜리 미니 온풍기가 다음 달 고지서를 태웁니다", font=F(42), fill=WHITE, anchor="mm")
d.text((W//2, 148), "원룸 전기요금 57,760원 → 162,370원 (하루 5시간 가동)", font=F(30), fill=(255, 220, 120), anchor="mm")
d.text((W//2, 218), "평소 350kWh 집이 하루 8시간 틀면 245,650원 — 24만원대 폭탄", font=F(30, False), fill=WHITE, anchor="mm")
d.text((W//2, 266), "2,000W = 에어컨(1,000W)보다 전기를 2배로 먹는 기기", font=F(30, False), fill=(255, 190, 190), anchor="mm")

d.line([(60, 336), (W-60, 336)], fill=(70, 80, 95), width=3)
d.text((W//2, 380), "전기세가 터지는 3단계 구조", font=F(50), fill=WHITE, anchor="mm")

rows = [
    ("1단계", "200kWh 이하 120.0원", "냉장고·전기요만 써도 여기 머무는 원룸이 대부분", GREEN),
    ("2단계", "201~400kWh 214.6원", "겨울 가습기·냉장고 가동만으로 진입하기 쉬움", ORANGE),
    ("3단계", "400kWh 초과 307.3원", "기본요금 7,300원 + 단가 2.5배 — 온풍기가 트리거", RED),
]

y = 424
for badge, title, desc, color in rows:
    card_h = 140
    d.rounded_rectangle([60, y, W-60, y+card_h], radius=22, fill=CARD, outline=color, width=4)
    d.rounded_rectangle([92, y+24, 92+120, y+24+54], radius=12, fill=color)
    d.text((92+60, y+24+27), badge, font=F(34), fill=(20, 24, 30), anchor="mm")
    d.text((236, y+52), title, font=F(36), fill=WHITE, anchor="lm")
    d.text((92, y+116), desc, font=F(26, False), fill=GRAY, anchor="lm")
    y += card_h + 14

# 실측 계산 박스
y += 4
d.rounded_rectangle([60, y, W-60, y+230], radius=22, fill=CARD, outline=GOLD, width=4)
d.text((92, y+40), "한전 요금표 실측 계산 (2026년 기준)", font=F(38), fill=GOLD, anchor="lm")
d.text((92, y+96), "하루 5시간 = 300kWh 추가 → +104,610원", font=F(30), fill=WHITE, anchor="lm")
d.text((92, y+146), "하루 8시간 = 480kWh 추가 → 227,550원", font=F(30), fill=WHITE, anchor="lm")
d.text((92, y+192), "누진 3단계 1시간 가동 = 약 720원이 매달 붙는다", font=F(28, False), fill=(255, 190, 190), anchor="lm")

# 화재 경고 박스
y += 250
d.rounded_rectangle([60, y, W-60, y+290], radius=22, fill=CARD, outline=RED, width=4)
d.text((92, y+36), "카본·할로겐 히터는 이렇게 불난다", font=F(38), fill=RED, anchor="lm")
lines = [
    ("가드면 183도", "일본 소방청 실험: 카본·할로겐 최고온도", RED),
    ("78초 착화", "가드에 접촉한 수건이 무염착화된 시간", RED),
    ("멀티탭 금지", "정격 16A(약 3,500W) — 2,000W가 절반 소진", ORANGE),
    ("외출 시 차단", "11~2월 화재의 50.8%가 부주의", ORANGE),
]
ly = y + 74
for tag, desc, color in lines:
    d.rounded_rectangle([92, ly, 92+280, ly+50], radius=12, fill=(35, 45, 60))
    d.text((92+140, ly+25), tag, font=F(26), fill=color, anchor="mm")
    d.text((400, ly+25), desc, font=F(25, False), fill=WHITE, anchor="lm")
    ly += 54

# 저전력 대안 박스
y += 306
d.rounded_rectangle([60, y, W-60, y+150], radius=22, fill=CARD, outline=GREEN, width=4)
d.text((92, y+36), "절약 정석: 방이 아니라 몸을 데운다", font=F(35), fill=GREEN, anchor="lm")
d.text((92, y+88), "전기요 100W 하루 8시간 한 달 = +6,190원 (온풍기의 1/27)", font=F(28, False), fill=WHITE, anchor="lm")
d.text((92, y+124), "온풍기는 아침 30분 타이머용 + PTC·전도차단 장치 확인", font=F(26, False), fill=GRAY, anchor="lm")

# 결론 박스
d.rounded_rectangle([60, H-300, W-60, H-170], radius=22, fill=(30, 45, 35), outline=GREEN, width=4)
d.text((W//2, H-262), "명판 소비전력 확인 → 단독 콘센트 → 1m 거리", font=F(36), fill=GREEN, anchor="mm")
d.text((W//2, H-208), "이 3가지가 24만원 고지서와 화재를 같이 막습니다", font=F(28, False), fill=GRAY, anchor="mm")

# 하단 CTA
d.text((W//2, H-96), "누진 3단계 계산기·방식별 비교표 → 프로필 링크", font=F(38), fill=WHITE, anchor="mm")
d.text((W//2, H-40), "따져봄 ttajyeobom.com | 출처: 한국전력공사·소방청·한국소비자원", font=F(22, False), fill=GRAY, anchor="mm")

img.save("/workspace/downloads/threads_heater_electricity_infographic.png")
print("saved", img.size)
