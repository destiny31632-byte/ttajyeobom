#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 65번째 수족냉증 족욕기 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
DEEP = (32, 12, 16)
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
d.text((W // 2, 74), "발 시리다고 뜨거운 물 붓다 2도 화상 입습니다 ⚠️", font=F(30), fill=(22, 4, 4), anchor="mm")
d.text((W // 2, 196), "45℃는 뜨겁지 않습니다", font=F(38), fill=GRAY, anchor="mm")
d.text((W // 2, 286), "대신 3시간이면 물집이 잡힙니다", font=F(46), fill=(255, 150, 120), anchor="mm")

# 히어로: 온도별 화상 시간
d.text((W // 2, 424), "물 온도별 2도 화상까지 걸리는 시간", font=F(26, False), fill=GRAY, anchor="mm")
d.text((W // 2, 520), "45℃ 3시간 → 49℃ 10분 → 55℃ 30초", font=F(40), fill=RED, anchor="mm")
d.text((W // 2, 588), "뜨겁지 않다고 느끼는 온도가 더 위험합니다", font=F(25, False), fill=GRAY, anchor="mm")

# 카드 1: 현실 수치
y = 640
d.rounded_rectangle([56, y, W - 56, y + 300], radius=26, fill=CARD)
d.text((96, y + 26), "족욕기, 표시 온도를 믿으면 안 됩니다", font=F(28), fill=GRAY)
d.text((96, y + 82), "45℃  법이 정한 피부 접촉 물 온도 상한", font=F(28), fill=WHITE)
d.text((96, y + 136), "47.8℃  2020년 리콜된 족욕기 실측 수온", font=F(28), fill=RED)
d.text((96, y + 190), "45℃ 초과  2018년 버블 끈 상태서 넘긴 제품", font=F(27), fill=AMBER)
d.text((96, y + 246), "족욕기·발마사지기 위해정보 3년간 57건", font=F(23, False), fill=GRAY)

# 카드 2: 3초 비교
y = 980
d.rounded_rectangle([56, y, W - 56, y + 386], radius=26, fill=CARD)
d.text((96, y + 24), "3초 결론: 오늘 살 3개 (2026-11-13 쿠팡)", font=F(26), fill=GRAY)
rows = [
    ("오아 버블풋 접이식 온수 지압 족욕기", "42,540원 · 지압·리모컨 · 후기 217", GREEN),
    ("굿프렌드 참조은 편백 건식 족욕기", "134,500원 · 물 0L · 160W · 후기 117", AMBER),
    ("제스파 무선 온열 종아리 마사지기", "48,150원 · 공기압 3단계 · 후기 285", BLUE),
]
for i, (name, sub, color) in enumerate(rows):
    yy = y + 76 + i * 100
    d.ellipse([96, yy + 6, 96 + 40, yy + 46], fill=color)
    d.text((116, yy + 26), str(i + 1), font=F(24), fill=(10, 10, 14), anchor="mm")
    d.text((156, yy + 2), name, font=F(29), fill=WHITE)
    d.text((156, yy + 44), sub, font=F(23, False), fill=GRAY)

# 카드 3: 핵심 처방
y = 1408
d.rounded_rectangle([56, y, W - 56, y + 300], radius=26, fill=(18, 26, 24))
d.text((96, y + 26), "오늘 밤부터 지킬 3가지", font=F(27), fill=GREEN)
d.text((96, y + 82), "① 온도계로 45℃ 이하 확인, 20분 안에 끝내기", font=F(27), fill=WHITE)
d.text((96, y + 138), "② 38℃ 20~25분 · 40℃ 15분 · 42℃ 10분", font=F(26), fill=WHITE)
d.text((96, y + 194), "③ 당뇨·감각저하 있으면 37~38℃에서 5분", font=F(26), fill=WHITE)
d.text((96, y + 250), "물 버리고 말리는 시간만 하루 16분, 한 달 8시간", font=F(22, False), fill=GRAY)

# 하단 푸터
d.rectangle([0, 1740, W, H], fill=(12, 14, 20))
d.text((W // 2, 1800), "전체 비교표는 프로필 링크의 ttajyeobom.com", font=F(28), fill=WHITE, anchor="mm")
d.text((W // 2, 1856), "@kkkyy.ya · 숫자로 따져보는 생활 가이드", font=F(22, False), fill=GRAY, anchor="mm")

out = "/workspace/downloads/winter_foot_bath_threads_infographic.png"
img.save(out, "PNG")
print(out)
