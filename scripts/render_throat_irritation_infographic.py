#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 61번째 겨울 목 칼칼함·마른기침 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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

# 상단 레드 경고 배지
d.rectangle([0, 0, W, 352], fill=DEEP)
d.rounded_rectangle([44, 40, 44 + 930, 40 + 68], radius=14, fill=RED)
d.text((44 + 465, 40 + 34), "아침에 목 찢어지는 분들 필독", font=F(33), fill=(22, 4, 4), anchor="mm")
d.text((W // 2, 194), "그거 감기 아니라 방 습도 문제일 수 있습니다", font=F(36), fill=GRAY, anchor="mm")
d.text((W // 2, 280), "3주 넘는 마른기침은 원인이 따로 있습니다", font=F(40), fill=(255, 178, 120), anchor="mm")

# 히어로: 겨울 실내 습도
d.text((W // 2, 412), "겨울 아파트 20집 실측 실내 습도", font=F(27, False), fill=GRAY, anchor="mm")
d.text((W // 2, 510), "평균 35.4%", font=F(78), fill=RED, anchor="mm")
d.text((W // 2, 590), "질병관리청 권고 하한 40%보다 4.6%p 낮음", font=F(26, False), fill=GRAY, anchor="mm")

# 카드 1: 원인
y = 644
d.rounded_rectangle([56, y, W - 56, y + 272], radius=26, fill=CARD)
d.text((96, y + 24), "목이 아픈 이유는 세 갈래로 갈립니다", font=F(26), fill=GRAY)
d.text((96, y + 74), "방 습도 40% 아래 → 점막이 마름", font=F(31), fill=BLUE)
d.text((96, y + 122), "감기로 벗겨진 인후부 → 회복 지연", font=F(31), fill=AMBER)
d.text((96, y + 170), "38도 열 + 편도 삼출 → 세균 검사 먼저", font=F(31), fill=RED)
d.text((96, y + 218), "스프레이부터 사면 같은 돈을 두 번 씁니다", font=F(23, False), fill=GRAY)

# 카드 2: 제품
y = 944
d.rounded_rectangle([56, y, W - 56, y + 386], radius=26, fill=CARD)
d.text((96, y + 26), "3초 비교: 세 제품은 하는 일이 다릅니다", font=F(28), fill=GRAY)
rows = [
    ("프로폴리스 스프레이 12,700원", "122명 시험 3일째 인후통 16% (위약 68%)", GREEN),
    ("베타딘 인후스프레이 37,500원", "살균 강함 · 갑상선·6세 미만 금지 · 11/26 도착", AMBER),
    ("도라지 농축 스틱 29,900원", "사포닌은 동물 실험 단계 · 당 함량 확인", BLUE),
]
yy = y + 76
for name, desc, col in rows:
    d.text((96, yy), name, font=F(26), fill=WHITE)
    d.text((96, yy + 34), desc, font=F(22, False), fill=col)
    yy += 96

# 카드 3: 소금물
y = 1354
d.rounded_rectangle([56, y, W - 56, y + 240], radius=26, fill=CARD)
d.text((96, y + 22), "소금물 가글은 농도에서 갈립니다", font=F(26), fill=GRAY)
d.text((96, y + 70), "200ml에 소금 2.5g = 1.25%", font=F(38), fill=RED)
d.text((96, y + 128), "진하게 하면 점막이 더 마릅니다", font=F(27), fill=WHITE)
d.text((96, y + 172), "3%는 200ml에 6g · 매일 하기엔 짭니다", font=F(23, False), fill=GRAY)
d.text((96, y + 206), "삼키지 말고 뱉기 · 어린이는 금지", font=F(23, False), fill=GREEN)

# 하단 스트립
d.rectangle([0, 1608, W, H], fill=DEEP)
d.text((W // 2, 1668), "목 관리 첫 지출은 스프레이가 아닙니다", font=F(31), fill=(255, 196, 120), anchor="mm")
d.text((W // 2, 1732), "온습도계로 40% 확인 → 가습 → 그다음 스프레이", font=F(27), fill=WHITE, anchor="mm")
d.text((W // 2, 1790), "3주 넘는 기침은 기침 일지부터", font=F(27), fill=WHITE, anchor="mm")
d.text((W // 2, 1858), "실구매 1~3위 가격과 배송일은 프로필 링크", font=F(24, False), fill=(235, 200, 180), anchor="mm")

img.save("/workspace/downloads/throat_irritation_threads_infographic.png", "PNG")
print("saved", img.size)
