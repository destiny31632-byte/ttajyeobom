#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 63번째 겨울 얼굴 속건조·장벽 크림 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
DEEP = (30, 14, 20)
AMBER = (255, 176, 32)
BLUE = (86, 168, 255)
GREEN = (60, 205, 145)
WHITE = (246, 248, 252)
GRAY = (176, 184, 198)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# 상단 레드 경고 배지
d.rectangle([0, 0, W, 350], fill=DEEP)
d.rounded_rectangle([60, 38, 60 + 900, 38 + 66], radius=14, fill=RED)
d.text((60 + 450, 38 + 33), "히터 켠 방에서 얼굴 찢어지는 사람 필독", font=F(30), fill=(22, 4, 4), anchor="mm")
d.text((W // 2, 186), "미스트 뿌리면 각질층 수분까지 같이 날아갑니다", font=F(34), fill=GRAY, anchor="mm")
d.text((W // 2, 272), "한국인 56.8%가 자기 얼굴을 민감성이라 답했습니다", font=F(34), fill=(255, 178, 120), anchor="mm")

# 히어로: 각질층 두께
d.text((W // 2, 410), "얼굴 각질층은 몸보다 얇습니다", font=F(26, False), fill=GRAY, anchor="mm")
d.text((W // 2, 500), "볼 16.8μm vs 전완 22.6μm", font=F(62), fill=RED, anchor="mm")
d.text((W // 2, 578), "볼 기저 수분손실은 전완의 두 배 · 테이프 5회에 장벽 붕괴", font=F(25, False), fill=GRAY, anchor="mm")

# 카드 1: 겨울 얼굴의 정체
y = 630
d.rounded_rectangle([56, y, W - 56, y + 252], radius=26, fill=CARD)
d.text((96, y + 24), "겨울 얼굴은 물이 아니라 지질이 무너집니다", font=F(27), fill=GRAY)
d.text((96, y + 74), "볼 수분량·피지량은 겨울에도 그대로", font=F(30), fill=BLUE)
d.text((96, y + 122), "대신 홍조·피부온도 상승, 각질 교체 빨라짐", font=F(28), fill=AMBER)
d.text((96, y + 170), "겨울 아파트 실내 습도 평균 35.4% (일부 26.7%)", font=F(28), fill=WHITE)
d.text((96, y + 214), "권장 45~55% · 물만 채우면 다음 날 다시 당김", font=F(23, False), fill=GRAY)

# 카드 2: 3초 비교
y = 910
d.rounded_rectangle([56, y, W - 56, y + 400], radius=26, fill=CARD)
d.text((96, y + 24), "3초 결론: 오늘 살 3개 (2026-11-13 쿠팡)", font=F(26), fill=GRAY)
rows = [
    ("에스트라 아토베리어365 플러스 90ml", "29,450원 · 세라마이드 장벽 · 후기 2.7만", GREEN),
    ("일리윤 세라마이드 아토 집중크림 230ml", "14,800원 · 무향 · 100ml당 6,435원", AMBER),
    ("라로슈포제 시카플라스트 밤 B5+ 40ml", "19,580원 · 판테놀 5% 진정 · 로켓배송", BLUE),
]
yy = y + 82
for name, desc, col in rows:
    d.text((96, yy), name, font=F(27), fill=WHITE)
    d.text((96, yy + 36), desc, font=F(22, False), fill=col)
    yy += 102

# 카드 3: 성분 역할
y = 1336
d.rounded_rectangle([56, y, W - 56, y + 268], radius=26, fill=CARD)
d.text((96, y + 22), "성분은 경쟁이 아니라 순서입니다", font=F(26), fill=GRAY)
d.text((96, y + 66), "세라마이드 = 장벽 지질 채우기", font=F(29), fill=WHITE)
d.text((96, y + 112), "판테놀 = 붉고 따가운 날 진정", font=F(29), fill=WHITE)
d.text((96, y + 158), "히알루론산 = 물만 끌어옴 (저분자량은 손실 55.5%↑)", font=F(24, False), fill=RED)
d.text((96, y + 202), "바세린 = 증발 98% 차단, 입가·볼에만 얇게", font=F(24, False), fill=GREEN)
d.text((96, y + 240), "향료·뜨거운 물은 장벽부터 깎습니다", font=F(23, False), fill=GRAY)

# 하단 스트립
d.rectangle([0, 1636, W, H], fill=DEEP)
d.text((W // 2, 1692), "오늘 밤 순서", font=F(30), fill=(255, 196, 120), anchor="mm")
d.text((W // 2, 1752), "미지근한 물로 20초 세안 → 3분 안에 크림", font=F(26), fill=WHITE, anchor="mm")
d.text((W // 2, 1804), "볼·입가 세라마이드 크림 → 붉은 곳 판테놀 밤", font=F(26), fill=WHITE, anchor="mm")
d.text((W // 2, 1868), "실측 가격·성분 비교표는 프로필 링크", font=F(24, False), fill=(235, 200, 180), anchor="mm")

img.save("/workspace/downloads/facial_dryness_threads_infographic.png", "PNG")
print("saved", img.size)
