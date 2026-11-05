#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 42번째 겨울 안구건조증·온열안대 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
d.text((W//2, 62), "인공눈물 하루 10통 쏟아부어도 눈이 시린 이유", font=F(44), fill=WHITE, anchor="mm")
d.text((W//2, 148), "안구건조증 86%는 눈물 부족이 아니라 눈꺼풀 기름샘(마이봄샘) 굳음", font=F(30), fill=(255, 220, 120), anchor="mm")
d.text((W//2, 218), "물만 채워도 뚜껑(기름막)이 없으면 10분 만에 증발합니다", font=F(30, False), fill=WHITE, anchor="mm")
d.text((W//2, 266), "보존제 인공눈물 하루 6회 이상 = 각막염 위험", font=F(30, False), fill=(255, 190, 190), anchor="mm")

d.line([(60, 336), (W-60, 336)], fill=(70, 80, 95), width=3)
d.text((W//2, 380), "겨울 눈 시림 3대 원인", font=F(50), fill=WHITE, anchor="mm")

rows = [
    ("원인 1", "난방이 습도를 절반 이하로", "장시간 난방 실내는 여름의 절반 이하로 건조 — 가습기 40~50%", RED),
    ("원인 2", "마이봄샘 기름 굳음", "녹는점 32도가 최대 45도로 상승해 샘구멍을 막음", ORANGE),
    ("원인 3", "화면 집중 깜빡임 1/3~1/5", "깜빡임은 기름 짜는 펌프 — 30분마다 눈 쉬기", ORANGE),
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

# 온찜질 정석 박스
y += 4
d.rounded_rectangle([60, y, W-60, y+230], radius=22, fill=CARD, outline=GREEN, width=4)
d.text((92, y+40), "온찜질 정석: 40~45도, 10~15분", font=F(38), fill=GREEN, anchor="lm")
d.text((92, y+96), "40도 찜질 5분에 기름층 두께 57→127.5nm (+120%)", font=F(30), fill=WHITE, anchor="lm")
d.text((92, y+146), "녹인 뒤 눈꺼풀 가장자리 세척 — 질병관리청 1단계 치료", font=F(28, False), fill=GRAY, anchor="lm")
d.text((92, y+192), "45도 초과는 화상 구간 / 밤새 착용 금지", font=F(28, False), fill=(255, 190, 190), anchor="lm")

# 절대 금지 박스
y += 250
d.rounded_rectangle([60, y, W-60, y+290], radius=22, fill=CARD, outline=RED, width=4)
d.text((92, y+36), "이러면 눈이 더 상합니다", font=F(38), fill=RED, anchor="lm")
lines = [
    ("하루 6회 이상", "보존제 인공눈물 연속 점안 = 각막염 위험", RED),
    ("밤새 온열안대", "40~45도도 1~2시간이면 저온화상", RED),
    ("눈 강하게 비비기", "안압 순간 수십 상승·원추각막 위험", RED),
    ("공기압 마사지기", "녹내장·안압 질환자는 압박 기능 금지", ORANGE),
]
ly = y + 74
for tag, desc, color in lines:
    d.rounded_rectangle([92, ly, 92+260, ly+50], radius=12, fill=(35, 45, 60))
    d.text((92+130, ly+25), tag, font=F(26), fill=color, anchor="mm")
    d.text((380, ly+25), desc, font=F(25, False), fill=WHITE, anchor="lm")
    ly += 54

# 제품 선택 박스
y += 306
d.rounded_rectangle([60, y, W-60, y+150], radius=22, fill=CARD, outline=GOLD, width=4)
d.text((92, y+36), "온열안대 고를 때 3가지", font=F(35), fill=GOLD, anchor="lm")
d.text((92, y+88), "40도 전후 발열 · 10~15분 타이머 · KC마크·안전확인 신고번호", font=F(28, False), fill=WHITE, anchor="lm")
d.text((92, y+124), "소비자원 조사: 20개 중 1개 64.2도 초과, KC 표시는 2개뿐", font=F(26, False), fill=GRAY, anchor="lm")

# 결론 박스
d.rounded_rectangle([60, H-300, W-60, H-170], radius=22, fill=(30, 45, 35), outline=GREEN, width=4)
d.text((W//2, H-262), "가습기 40~50% → 온찜질 10분 → 눈꺼풀 세척", font=F(36), fill=GREEN, anchor="mm")
d.text((W//2, H-208), "오늘 밤 이 10분이 인공눈물 통수를 줄입니다", font=F(28, False), fill=GRAY, anchor="mm")

# 하단 CTA
d.text((W//2, H-96), "온열안대·눈마사지기 비교표·자가진단 → 프로필 링크", font=F(38), fill=WHITE, anchor="mm")
d.text((W//2, H-40), "따져봄 ttajyeobom.com | 출처: 질병관리청·건보공단·한국소비자원·IOVS", font=F(22, False), fill=GRAY, anchor="mm")

img.save("/workspace/downloads/threads_dry_eyes_infographic.png")
print("saved", img.size)
