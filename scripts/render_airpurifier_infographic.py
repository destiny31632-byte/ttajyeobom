#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 55번째 겨울 공기청정기 용량·필터값 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
CARD = (24, 27, 36)
RED = (255, 62, 62)
DEEP = (14, 26, 48)
AMBER = (255, 176, 32)
BLUE = (86, 168, 255)
GREEN = (60, 205, 145)
WHITE = (246, 248, 252)
GRAY = (172, 180, 194)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# 상단 경고 배지
d.rectangle([0, 0, W, 330], fill=DEEP)
d.rounded_rectangle([56, 44, 56 + 620, 44 + 62], radius=14, fill=RED)
d.text((56 + 310, 44 + 31), "12월 1일부터 넉 달", font=F(30), fill=(20, 6, 6), anchor="mm")
d.text((W // 2, 178), "겨울 공기청정기", font=F(46), fill=GRAY, anchor="mm")
d.text((W // 2, 258), "10평 원룸에 30만원은 과잉이다", font=F(52), fill=(255, 196, 120), anchor="mm")

# 히어로: 필요한 용량
d.text((W // 2, 392), "필요한 건 평수가 아니라 청정화능력", font=F(28, False), fill=GRAY, anchor="mm")
d.text((285, 486), "10평(33㎡)", font=F(46), fill=WHITE, anchor="mm")
d.text((285, 548), "내 방", font=F(26, False), fill=GRAY, anchor="mm")
d.line([540, 434, 540, 566], fill=(60, 66, 80), width=3)
d.text((795, 486), "4.29㎥/min", font=F(54), fill=BLUE, anchor="mm")
d.text((795, 548), "필요한 CADR", font=F(26, False), fill=GRAY, anchor="mm")
d.text((W // 2, 630), "협회 단체표준 A = 7.7 × 청정화능력", font=F(34), fill=WHITE, anchor="mm")

# 카드 1: 5년 필터값
y = 700
d.rounded_rectangle([56, y, W - 56, y + 300], radius=26, fill=CARD)
d.text((96, y + 36), "본체보다 필터가 더 든다", font=F(30), fill=GRAY)
d.text((96, y + 92), "5년 필터값 271,000~600,000원", font=F(42), fill=AMBER)
d.text((96, y + 162), "본체 116,820원 기준 2.3~5.1배", font=F(34), fill=WHITE)
d.text((96, y + 214), "1년 필터값 54,200원 = 본체의 46%", font=F(28, False), fill=GRAY)
d.text((96, y + 254), "소비자원 시험: 연 54,200~120,000원, 교체 6~14개월", font=F(24, False), fill=GRAY)

# 카드 2: '보통'의 함정
y = 1030
d.rounded_rectangle([56, y, W - 56, y + 300], radius=26, fill=CARD)
d.text((96, y + 36), "예보가 '보통'이어도", font=F(30), fill=GRAY)
d.text((96, y + 92), "16~35㎍/㎥ = WHO 권고의 2배", font=F(40), fill=RED)
d.text((96, y + 162), "WHO 24시간 권고 15㎍/㎥", font=F(32), fill=WHITE)
d.text((96, y + 212), "12월 평균 24.0㎍/㎥ · 나쁨 6일", font=F(28, False), fill=GRAY)
d.text((96, y + 254), "1월 26.1 · 2월 26.0 · 3월 26.8 (2015~2024 평균)", font=F(24, False), fill=GRAY)

# 카드 3: 못 잡는 것
y = 1360
d.rounded_rectangle([56, y, W - 56, y + 232], radius=26, fill=CARD)
d.text((96, y + 34), "필터가 못 잡는 것", font=F(30), fill=GRAY)
d.text((96, y + 88), "이산화탄소 · 습도", font=F(44), fill=AMBER)
d.text((96, y + 158), "청정기 돌려도 CO₂는 그대로", font=F(28, False), fill=WHITE)
d.text((96, y + 198), "짧게 자주 환기 + 청정기 동시에", font=F(28, False), fill=GRAY)

# 하단 스트립
d.rectangle([0, 1640, W, H], fill=DEEP)
d.text((W // 2, 1700), "오늘 5분이면 되는 것", font=F(32, False), fill=(255, 196, 120), anchor="mm")
d.text((W // 2, 1768), "내 방 ㎡ ÷ 7.7 = 필요한 CADR", font=F(44), fill=WHITE, anchor="mm")
d.text((W // 2, 1832), "후보 3개 필터값·교체주기부터 검색", font=F(28, False), fill=WHITE, anchor="mm")
d.text((W // 2, 1884), "계산표와 실구매 1~3위는 프로필 링크", font=F(24, False), fill=(235, 200, 180), anchor="mm")

img.save("/workspace/downloads/airpurifier_threads_infographic.png", "PNG")
print("saved /workspace/downloads/airpurifier_threads_infographic.png")
