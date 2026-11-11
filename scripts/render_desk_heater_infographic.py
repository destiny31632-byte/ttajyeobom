#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 59번째 겨울 사무실 데스크 히터 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
d.rectangle([0, 0, W, 348], fill=DEEP)
d.rounded_rectangle([44, 40, 44 + 860, 40 + 68], radius=14, fill=RED)
d.text((44 + 430, 40 + 34), "발밑에 미니 온풍기 틀어둔 분들", font=F(31), fill=(22, 4, 4), anchor="mm")
d.text((W // 2, 190), "사무실 18℃, 발끝은 이미 얼어 있습니다", font=F(38), fill=GRAY, anchor="mm")
d.text((W // 2, 274), "같은 8시간, 전기세는 11배 차이", font=F(54), fill=(255, 178, 120), anchor="mm")

# 히어로: 월 추가 요금
d.text((W // 2, 412), "하루 8시간 · 월 20일 쓰면 청구서가", font=F(27, False), fill=GRAY, anchor="mm")
d.text((W // 2, 512), "6,799원 vs 77,658원", font=F(74), fill=RED, anchor="mm")
d.text((W // 2, 592), "165W 파티션 히터  →  1,500W PTC 온풍기", font=F(26, False), fill=GRAY, anchor="mm")

# 카드 1: 규정
y = 650
d.rounded_rectangle([56, y, W - 56, y + 262], radius=26, fill=CARD)
d.text((96, y + 30), "18℃는 덥지 않은 게 아니라 규정 상한", font=F(28), fill=GRAY)
d.text((96, y + 86), "공공기관 난방 평균 18℃ 이하", font=F(36), fill=WHITE)
d.text((96, y + 140), "근무시간 개인난방기 금지 (승인 예외)", font=F(26, False), fill=AMBER)
d.text((96, y + 188), "사무실 기준 18–24℃ · 습도 40–70%", font=F(25, False), fill=GRAY)
d.text((96, y + 226), "WHO 18℃는 최저선, 우리 규정은 상한", font=F(24, False), fill=BLUE)

# 카드 2: 전기료 표
y = 942
d.rounded_rectangle([56, y, W - 56, y + 344], radius=26, fill=CARD)
d.text((96, y + 26), "월 250kWh 집 · 8시간×20일 추가 요금", font=F(27), fill=GRAY)
rows = [("165W 파티션 히터", "6,799원", GREEN), ("400W 카본 미니히터", "16,493원", AMBER), ("1,000W 온풍기", "48,693원", (255, 140, 90)), ("1,500W 온풍기", "77,658원", RED)]
yy = y + 84
for name, val, col in rows:
    d.text((96, yy), name, font=F(27, False), fill=WHITE)
    d.text((W - 96, yy), val, font=F(30), fill=col, anchor="ra")
    yy += 62
d.text((96, y + 310), "누진 3단계 집은 같은 39.6kWh도 14,346원", font=F(23, False), fill=GRAY)

# 카드 3: 화재
y = 1326
d.rounded_rectangle([56, y, W - 56, y + 250], radius=26, fill=CARD)
d.text((96, y + 26), "전열기 화재 5년 2,390건 · 사망 48명", font=F(28), fill=GRAY)
d.text((96, y + 82), "12월·1월에 42% 집중", font=F(38), fill=RED)
d.text((96, y + 138), "원인 1위는 부주의 45% — 켜둔 채 자리 비움", font=F(25, False), fill=WHITE)
d.text((96, y + 184), "KC 인증 · 타이머 · 전도 차단 3개만 확인", font=F(24, False), fill=GREEN)

# 하단 스트립
d.rectangle([0, 1610, W, H], fill=DEEP)
d.text((W // 2, 1672), "발이 시린지 손이 시린지부터 나누세요", font=F(33), fill=(255, 196, 120), anchor="mm")
d.text((W // 2, 1740), "발·무릎 → 4면 접이식 165W", font=F(34), fill=WHITE, anchor="mm")
d.text((W // 2, 1796), "손·키보드 → 온열 데스크패드", font=F(34), fill=WHITE, anchor="mm")
d.text((W // 2, 1858), "실구매 1–3위 가격은 프로필 링크", font=F(24, False), fill=(235, 200, 180), anchor="mm")

img.save("/workspace/downloads/desk_heater_threads_infographic.png", "PNG")
print("saved /workspace/downloads/desk_heater_threads_infographic.png", img.size)
