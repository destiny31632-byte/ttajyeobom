#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 51번째 겨울철 경추베개·목디스크 안전 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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


BG = (9, 10, 14)
CARD = (22, 25, 34)
RED = (255, 62, 62)
DEEP = (118, 10, 10)
AMBER = (255, 176, 32)
BLUE = (84, 166, 255)
GREEN = (60, 205, 145)
WHITE = (246, 248, 252)
GRAY = (168, 176, 190)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# 상단 경고 배지
d.rectangle([0, 0, W, 300], fill=DEEP)
d.rounded_rectangle([56, 38, 56 + 560, 38 + 58], radius=14, fill=RED)
d.text((56 + 280, 38 + 29), "⚠️ 베개 잘못 베면 목디스크 터진다", font=F(27), fill=(18, 6, 6), anchor="mm")
d.text((W // 2, 150), "자고 일어났는데 목이 안 돌아간다면", font=F(44), fill=WHITE, anchor="mm")
d.text((W // 2, 232), "그 범인은 베개 높이일 수 있다", font=F(50), fill=(255, 196, 120), anchor="mm")

# 히어로 수치
d.text((W // 2, 372), "높은 베개는 공식 문서에 적힌 위험 요인", font=F(28, False), fill=GRAY, anchor="mm")
d.text((W // 2, 470), "5kg → 18kg", font=F(104), fill=RED, anchor="mm")
d.text((W // 2, 560), "목을 30도 숙이면 디스크에 걸리는 압박", font=F(29), fill=WHITE, anchor="mm")

d.line([(70, 618), (W - 70, 618)], fill=(64, 72, 88), width=3)

# 황금 높이 박스
d.rounded_rectangle([56, 648, W - 56, 856], radius=22, fill=(30, 22, 14), outline=AMBER, width=4)
d.text((W // 2, 692), "체형별 베개 높이 계산법", font=F(34), fill=AMBER, anchor="mm")
d.text((88, 772), "바로 누우면", font=F(33), fill=GRAY, anchor="lm")
d.text((360, 772), "6~8cm", font=F(48), fill=WHITE, anchor="lm")
d.text((560, 772), "옆으로 누우면", font=F(33), fill=GRAY, anchor="lm")
d.text((1010, 772), "10~15cm", font=F(48), fill=WHITE, anchor="rm")
d.text((W // 2, 828), "옆으로 자는 사람이 71.9%, 대부분은 더 높은 쪽이 맞다", font=F(24, False), fill=GRAY, anchor="mm")

# 소재 비교 카드
rows = [
    ("솜", "수명 짧고 높이 금방 뭉개짐", "높으면 목이 앞으로 꺾여 압력 폭증", RED),
    ("메모리폼", "지지력 최고, 물은 독", "물세탁하면 속이 안 말라 곰팡이", AMBER),
    ("라텍스", "탄성·형태 유지 좋음", "40℃ 이상·햇빛에 경화, 가루 날림", BLUE),
]
y = 900
for name, tag, desc, color in rows:
    d.rounded_rectangle([56, y, W - 56, y + 190], radius=20, fill=CARD, outline=color, width=4)
    d.rounded_rectangle([86, y + 26, 86 + 210, y + 26 + 56], radius=12, fill=color)
    d.text((86 + 105, y + 26 + 28), name, font=F(32), fill=(12, 14, 18), anchor="mm")
    d.text((86, y + 112), tag, font=F(38), fill=WHITE, anchor="lm")
    d.text((86, y + 160), desc, font=F(26, False), fill=GRAY, anchor="lm")
    y += 206

# 결론 박스
d.rounded_rectangle([56, 1548, W - 56, 1756], radius=22, fill=(16, 30, 24), outline=GREEN, width=4)
d.text((W // 2, 1594), "오늘 밤 3분 점검", font=F(33), fill=GREEN, anchor="mm")
d.text((W // 2, 1652), "벽에 등 붙이고 뒤통수 간격 재기", font=F(34), fill=WHITE, anchor="mm")
d.text((W // 2, 1706), "→ 6~8cm 벗어나면 베개부터 의심", font=F(27, False), fill=GRAY, anchor="mm")

# 하단 CTA
d.rectangle([0, 1790, W, H], fill=(14, 16, 22))
d.text((W // 2, 1836), "체형별 높이 계산기 · 3종 비교표", font=F(30), fill=WHITE, anchor="mm")
d.text((W // 2, 1878), "프로필 링크에 정리해뒀습니다", font=F(26, False), fill=GRAY, anchor="mm")

img.save("/workspace/downloads/pillow_threads_infographic.png", quality=95)
print("saved", img.size)
