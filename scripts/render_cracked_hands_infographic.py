#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 62번째 겨울 손끝 갈라짐·핸드크림 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
d.rectangle([0, 0, W, 344], fill=DEEP)
d.rounded_rectangle([60, 38, 60 + 900, 38 + 66], radius=14, fill=RED)
d.text((60 + 450, 38 + 33), "손끝 갈라져 피 나는 사람 필독", font=F(32), fill=(22, 4, 4), anchor="mm")
d.text((W // 2, 186), "향 좋은 핸드크림부터 사면 살점이 더 찢어집니다", font=F(35), fill=GRAY, anchor="mm")
d.text((W // 2, 276), "손 습진 겪은 성인 31.2% · 그중 33.6%가 겨울에 최악", font=F(35), fill=(255, 178, 120), anchor="mm")

# 히어로: 글리세린 농도
d.text((W // 2, 404), "글리세린 농도별 2주 개선 등급 (0~5)", font=F(26, False), fill=GRAY, anchor="mm")
d.text((W // 2, 496), "20% 1.74 vs 40% 1.80", font=F(66), fill=RED, anchor="mm")
d.text((W // 2, 574), "40% 마케팅은 두 배 효과가 아닙니다 · 차이 0.06", font=F(26, False), fill=GRAY, anchor="mm")

# 카드 1: 원인
y = 626
d.rounded_rectangle([56, y, W - 56, y + 268], radius=26, fill=CARD)
d.text((96, y + 24), "손끝이 트는 이유는 세 갈래로 갈립니다", font=F(26), fill=GRAY)
d.text((96, y + 74), "각질층이 말라 힘을 못 받음 → 고보습", font=F(30), fill=BLUE)
d.text((96, y + 122), "물·세제로 벗겨짐 → 하루 15회 씻어도 보습이면 버팀", font=F(28), fill=AMBER)
d.text((96, y + 170), "손 습진 염증 → 균열 46.7%, 진료가 먼저", font=F(30), fill=RED)
d.text((96, y + 216), "이 셋을 가르지 않으면 같은 돈을 두 번 씁니다", font=F(23, False), fill=GRAY)

# 카드 2: 성분
y = 918
d.rounded_rectangle([56, y, W - 56, y + 404], radius=26, fill=CARD)
d.text((96, y + 26), "3초 비교: 세 성분은 하는 일이 다릅니다", font=F(28), fill=GRAY)
rows = [
    ("오킵스 워킹핸즈 96g · 9,020원", "무향 · 글리세린+파라핀 피막 · 후기 3,163건", GREEN),
    ("카밀 클래식 100ml x3 · 6,810원", "개당 2,270원 · 후기 51,956건 · 향 있음", AMBER),
    ("뉴트로지나 시카 56g · 6,620원", "판테놀+알란토인 · 향료 있음 · 40%는 해외 표기", BLUE),
]
yy = y + 82
for name, desc, col in rows:
    d.text((96, yy), name, font=F(27), fill=WHITE)
    d.text((96, yy + 36), desc, font=F(22, False), fill=col)
    yy += 100

# 카드 3: 바세린/우레아
y = 1346
d.rounded_rectangle([56, y, W - 56, y + 272], radius=26, fill=CARD)
d.text((96, y + 22), "우레아는 농도가 다르면 다른 제품입니다", font=F(26), fill=GRAY)
d.text((96, y + 66), "10% 이하 = 보습 / 30% 초과 = 각질 벗기기", font=F(31), fill=WHITE)
d.text((96, y + 114), "바세린은 수분을 주지 않고 빼앗기지 않게 막음", font=F(26), fill=WHITE)
d.text((96, y + 158), "TEWL 98% 감소 · 젖은 손에 바르고 면장갑", font=F(24, False), fill=GREEN)
d.text((96, y + 200), "갈라진 손에 30% 이상 바르면 따갑습니다", font=F(24, False), fill=RED)
d.text((96, y + 238), "향료 패치 양성은 손 습진 환자 658명 중 10.2%", font=F(22, False), fill=GRAY)

# 하단 스트립
d.rectangle([0, 1646, W, H], fill=DEEP)
d.text((W // 2, 1700), "손끝이 피 날 때 순서", font=F(30), fill=(255, 196, 120), anchor="mm")
d.text((W // 2, 1760), "진물·열감 → 진료 / 각질 두꺼움 → 우레아 10~30%", font=F(26), fill=WHITE, anchor="mm")
d.text((W // 2, 1812), "촉촉한 손 → 무향 크림 → 자기 전 바세린+면장갑", font=F(26), fill=WHITE, anchor="mm")
d.text((W // 2, 1876), "실측 가격·배송일 비교표는 프로필 링크", font=F(24, False), fill=(235, 200, 180), anchor="mm")

img.save("/workspace/downloads/cracked_hands_threads_infographic.png", "PNG")
print("saved", img.size)
