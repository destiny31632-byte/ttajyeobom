#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 58번째 겨울 정전기·니트·방지 스프레이 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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


BG = (8, 10, 16)
CARD = (24, 27, 36)
RED = (255, 62, 62)
DEEP = (30, 14, 20)
AMBER = (255, 176, 32)
BLUE = (86, 168, 255)
GREEN = (60, 205, 145)
WHITE = (246, 248, 252)
GRAY = (172, 180, 194)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# 상단 경고 배지
d.rectangle([0, 0, W, 348], fill=DEEP)
d.rounded_rectangle([56, 44, 56 + 810, 44 + 66], radius=14, fill=RED)
d.text((56 + 405, 44 + 33), "문손잡이 잡을 때마다 '탁!' 하는 분들", font=F(30), fill=(22, 4, 4), anchor="mm")
d.text((W // 2, 190), "정전기는 따끔한 게 끝이 아닙니다", font=F(40), fill=GRAY, anchor="mm")
d.text((W // 2, 274), "옷에 먼지·꽃가루를 끌어당깁니다", font=F(50), fill=(255, 178, 120), anchor="mm")

# 히어로: 니트 벗을 때 전압
d.text((W // 2, 410), "아크릴 스웨터를 벗을 때 몸에 쌓이는 전압", font=F(27, False), fill=GRAY, anchor="mm")
d.text((W // 2, 512), "4,500–5,000V", font=F(88), fill=RED, anchor="mm")
d.text((W // 2, 594), "폴리에스터 작업복 4,000–4,500V · 25℃ 40%RH 기준", font=F(25, False), fill=GRAY, anchor="mm")

# 카드 1: 습도
y = 656
d.rounded_rectangle([56, y, W - 56, y + 286], radius=26, fill=CARD)
d.text((96, y + 30), "같은 동작, 습도만 바꿔도", font=F(28), fill=GRAY)
d.text((96, y + 86), "습도 10–20%  →  35,000V", font=F(40), fill=RED)
d.text((96, y + 152), "습도 50%       →  7,500V", font=F(36), fill=AMBER)
d.text((96, y + 210), "겨울 아파트 20가구 실측 평균 35.4%", font=F(27, False), fill=WHITE)
d.text((96, y + 252), "가습 없이 40% 넘기기 어렵습니다", font=F(25, False), fill=GRAY)

# 카드 2: 통증 기준
y = 972
d.rounded_rectangle([56, y, W - 56, y + 278], radius=26, fill=CARD)
d.text((96, y + 30), "정전기 통증, 전압보다 감각 기준", font=F(28), fill=GRAY)
d.text((96, y + 86), "3,000V부터 '약한 통증'", font=F(42), fill=WHITE)
d.text((96, y + 150), "2,000V 이물감 · 2,500V 통증 없는 바늘", font=F(26, False), fill=GRAY)
d.text((96, y + 198), "4,000V 깊은 바늘 통증", font=F(28, False), fill=GRAY)
d.text((96, y + 240), "2,000V 아래로만 낮춰도 '찌릿'은 사라집니다", font=F(25, False), fill=BLUE)

# 카드 3: 비교
y = 1288
d.rounded_rectangle([56, y, W - 56, y + 318], radius=26, fill=CARD)
d.text((96, y + 26), "수단별로 듣는 곳이 다릅니다", font=F(28), fill=GRAY)
d.text((96, y + 78), "스프레이  옷 전체 코팅 · 다음 세탁까지", font=F(26), fill=WHITE)
d.text((96, y + 126), "양모볼    과건조 방지 · 정전기 제거 아님", font=F(26), fill=WHITE)
d.text((96, y + 174), "옷핀      접지 경로 없음 · 효과 미미", font=F(26), fill=RED)
d.text((96, y + 222), "동전      문손잡이 전 접촉 · 통증 감소", font=F(26), fill=GREEN)
d.text((96, y + 268), "폴리에스터엔 유연제도 한계(소비자원 11개 시험)", font=F(23, False), fill=GRAY)

# 하단 스트립
d.rectangle([0, 1636, W, H], fill=DEEP)
d.text((W // 2, 1696), "오늘 밤 10분 체크", font=F(32, False), fill=(255, 196, 120), anchor="mm")
d.text((W // 2, 1762), "습도 40–60% · 니트 안에 면 티", font=F(38), fill=WHITE, anchor="mm")
d.text((W // 2, 1822), "외출 전 스프레이 · 문손잡이 전 동전", font=F(30, False), fill=WHITE, anchor="mm")
d.text((W // 2, 1878), "실구매 1–3위 비교는 프로필 링크", font=F(24, False), fill=(235, 200, 180), anchor="mm")

img.save("/workspace/downloads/static_electricity_threads_infographic.png", "PNG")
print("saved /workspace/downloads/static_electricity_threads_infographic.png", img.size)
