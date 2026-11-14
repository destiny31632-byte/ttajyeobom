#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 67번째 겨울 안면 홍조·붉은기 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
d.text((W // 2, 74), "얼굴 빨개진다고 얼음찜질 하면 안 됩니다 ⚠️", font=F(29), fill=(22, 4, 4), anchor="mm")
d.text((W // 2, 196), "찬 것 대면 혈관 줄었다가 떼는 순간 다시 벌어집니다", font=F(30), fill=GRAY, anchor="mm")
d.text((W // 2, 286), "붉은기가 돌아오고, 반복되면 만성 홍조", font=F(44), fill=(255, 150, 120), anchor="mm")

# 히어로: 악화인자 수치
d.text((W // 2, 424), "주사피부염 환자가 직접 꼽은 악화인자", font=F(26, False), fill=GRAY, anchor="mm")
d.text((W // 2, 508), "자외선 81% · 스트레스 79%", font=F(38), fill=RED, anchor="mm")
d.text((W // 2, 566), "더운 날씨 75% · 찬 바람 46% · 매운 음식 45%", font=F(30), fill=AMBER, anchor="mm")
d.text((W // 2, 626), "국내 환자는 1인당 평균 4.63개를 호소", font=F(24, False), fill=GRAY, anchor="mm")

# 카드 1: 성분 근거
y = 676
d.rounded_rectangle([56, y, W - 56, y + 300], radius=26, fill=CARD)
d.text((96, y + 24), "비타민K · 시카 · 판테놀, 근거는 따로 봐야", font=F(26), fill=GRAY)
d.text((96, y + 78), "비타민K  레이저 후 멍만 소폭, 홍조 근거 없음", font=F(26), fill=RED)
d.text((96, y + 132), "시카  수분손실 감소, 단 4주 25명 소규모", font=F(26), fill=GREEN)
d.text((96, y + 186), "판테놀 5%  자극 방어·장벽 회복 위약대조", font=F(26), fill=BLUE)
d.text((96, y + 244), "스테로이드 연고 3~4주면 피부위축·모세혈관확장", font=F(22, False), fill=GRAY)

# 카드 2: 3초 비교
y = 1006
d.rounded_rectangle([56, y, W - 56, y + 372], radius=26, fill=CARD)
d.text((96, y + 24), "3초 결론: 오늘 살 3개 (2026-11-14 쿠팡)", font=F(26), fill=GRAY)
rows = [
    ("헬로셀 비타민K 크림 15ml", "13,000원 · 후기 1,623 · 멍 자국용", GREEN),
    ("닥터지 시카 수딩 세럼 50ml", "15,900원 · 51% ↓ · 후기 1,968", AMBER),
    ("라로슈포제 시카플라스트 밤 B5+", "19,580원 · 후기 10,833 · 장벽용", BLUE),
]
ry = y + 84
for name, spec, col in rows:
    d.rectangle([96, ry + 6, 104, ry + 54], fill=col)
    d.text((126, ry), name, font=F(28), fill=WHITE)
    d.text((126, ry + 38), spec, font=F(23, False), fill=GRAY)
    ry += 94

# 하단: 실내 기준
y = 1406
d.rounded_rectangle([56, y, W - 56, y + 232], radius=26, fill=(18, 22, 30))
d.text((96, y + 26), "난방기 켜두는 방, 이 숫자만 지키세요", font=F(26), fill=GRAY)
d.text((96, y + 82), "실내 18~20℃ · 습도 40~60%", font=F(30), fill=WHITE)
d.text((96, y + 138), "환기 하루 3번, 10~30분", font=F(28), fill=GREEN)
d.text((96, y + 188), "세안은 미지근한 물로 하루 1~2회", font=F(24, False), fill=GRAY)

# 하단 CTA 밴드
d.rectangle([0, 1690, W, H], fill=(16, 18, 26))
d.text((W // 2, 1758), "피부과가 화장품보다 먼저인 신호", font=F(26, False), fill=GRAY, anchor="mm")
d.text((W // 2, 1818), "30분 지나도 안 사라지면 · 구진·고름물집 · 눈 따가움", font=F(26), fill=RED, anchor="mm")
d.text((W // 2, 1876), "자세한 비교표는 프로필 링크에", font=F(22, False), fill=(255, 176, 32), anchor="mm")

img.save("/workspace/downloads/winter_facial_flushing_threads_infographic.png", quality=95)
print("saved", img.size)
