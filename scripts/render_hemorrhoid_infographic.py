#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 68번째 겨울철 치질·변비·좌욕 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1920
FONT = "/usr/share/fonts/pickle-hwp/NotoSansCJKkr-Bold.otf"
FONT_R = "/usr/share/fonts/pickle-hwp/NotoSansCJKkr-Regular.otf"
try:
    ImageFont.truetype(FONT, 20)
except OSError:
    FONT = FONT_R


def F(sz, bold=True):
    return ImageFont.truetype(FONT if bold else FONT_R, sz)


BG = (8, 10, 16)
CARD = (24, 27, 36)
RED = (255, 62, 62)
DEEP = (34, 10, 12)
AMBER = (255, 176, 32)
BLUE = (86, 168, 255)
GREEN = (60, 205, 145)
WHITE = (246, 248, 252)
GRAY = (176, 184, 198)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# 상단 레드 경고 배지
d.rectangle([0, 0, W, 372], fill=DEEP)
d.rounded_rectangle([54, 40, 54 + 972, 40 + 68], radius=14, fill=RED)
d.text((W // 2, 74), "겨울에 뜨거운 물로 좌욕하면 안 됩니다 ⚠️", font=F(29), fill=(22, 4, 4), anchor="mm")
d.text((W // 2, 196), "40~45℃ 물도 1~2시간이면 화상입니다", font=F(30), fill=GRAY, anchor="mm")
d.text((W // 2, 286), "55℃ 10초 · 60℃ 5초 → 2도 화상", font=F(44), fill=(255, 150, 120), anchor="mm")

# 히어로: 겨울 통계
d.text((W // 2, 424), "치핵 진료인원, 5년 월평균 1월이 가장 많아", font=F(26, False), fill=GRAY, anchor="mm")
d.text((W // 2, 508), "1월 87,712명 · 12월 80,588명", font=F(38), fill=RED, anchor="mm")
d.text((W // 2, 566), "2016년 11월 69,293명 → 12월 77,024명 (11.2%↑)", font=F(28), fill=AMBER, anchor="mm")
d.text((W // 2, 626), "추위로 항문 혈관이 좁아지고, 물 섭취는 줄어듭니다", font=F(23, False), fill=GRAY, anchor="mm")

# 카드 1: 3가지 근거
y = 676
d.rounded_rectangle([56, y, W - 56, y + 320], radius=26, fill=CARD)
d.text((96, y + 24), "좌욕 · 차전자피 · 도넛 방석, 근거는 따로", font=F(26), fill=GRAY)
d.text((96, y + 80), "좌욕  통증 감소 근거 약함, 안위·청결용", font=F(26), fill=AMBER)
d.text((96, y + 134), "차전자피  식약처 5.0g vs 효과 구간 10g·4주", font=F(26), fill=GREEN)
d.text((96, y + 188), "도넛 방석  가운데 비우면 압력은 테두리로", font=F(26), fill=RED)
d.text((96, y + 248), "셋 다 치핵을 없애지는 못합니다", font=F(23, False), fill=GRAY)

# 카드 2: 3초 결론
y = 1036
d.rounded_rectangle([56, y, W - 56, y + 372], radius=26, fill=CARD)
d.text((96, y + 24), "3초 결론: 오늘 살 3개 (2026-11-14 쿠팡)", font=F(26), fill=GRAY)
rows = [
    ("비타그램 무선 좌욕기 세트", "19,900원 · 39%↓ · 후기 8,187", GREEN),
    ("종근당 차전자피 30포", "16,900원 · 47%↓ · 후기 47,890", AMBER),
    ("도큐어 도넛 메모리폼 방석", "9,990원 · 66%↓ · 후기 2,305", BLUE),
]
ry = y + 84
for name, spec, col in rows:
    d.rectangle([96, ry + 6, 104, ry + 54], fill=col)
    d.text((126, ry), name, font=F(28), fill=WHITE)
    d.text((126, ry + 38), spec, font=F(23, False), fill=GRAY)
    ry += 94

# 하단: 실천 수칙
y = 1436
d.rounded_rectangle([56, y, W - 56, y + 234], radius=26, fill=(18, 22, 30))
d.text((96, y + 26), "오늘 밤 바꿀 숫자", font=F(26), fill=GRAY)
d.text((96, y + 82), "좌욕 40℃ 근처 · 3~5분 · 하루 2~3회", font=F(28), fill=WHITE)
d.text((96, y + 134), "물 1.5~2L · 섬유질 15~25g", font=F(28), fill=GREEN)
d.text((96, y + 186), "화장실 10분 넘기지 않기 · 30분마다 일어나기", font=F(23, False), fill=GRAY)

# 하단 CTA 밴드
d.rectangle([0, 1690, W, H], fill=(16, 18, 26))
d.text((W // 2, 1758), "병원에 가야 하는 신호", font=F(26, False), fill=GRAY, anchor="mm")
d.text((W // 2, 1818), "반복되는 혈변 · 체중 감소 · 3일 이상 통증", font=F(26), fill=RED, anchor="mm")
d.text((W // 2, 1876), "자세한 비교표는 프로필 링크에", font=F(22, False), fill=(255, 176, 32), anchor="mm")

img.save("/workspace/downloads/winter_hemorrhoid_threads_infographic.png", quality=95)
print("saved", img.size)
