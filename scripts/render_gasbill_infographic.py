#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 54번째 도시가스 고지서 계산·보일러 외출모드 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
DEEP = (18, 30, 54)
AMBER = (255, 176, 32)
BLUE = (86, 168, 255)
GREEN = (60, 205, 145)
WHITE = (246, 248, 252)
GRAY = (172, 180, 194)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# 상단 경고 배지
d.rectangle([0, 0, W, 316], fill=DEEP)
d.rounded_rectangle([56, 42, 56 + 800, 42 + 62], radius=14, fill=RED)
d.text((56 + 400, 42 + 31), "11월 첫 가스 고지서", font=F(30), fill=(20, 6, 6), anchor="mm")
d.text((W // 2, 168), "가스비 3배 폭탄의 범인은", font=F(46), fill=WHITE, anchor="mm")
d.text((W // 2, 248), "보일러 외출모드가 아니다", font=F(54), fill=(255, 196, 120), anchor="mm")

# 히어로: 여름 vs 겨울
d.text((W // 2, 380), "같은 집, 같은 사람이 쓴 같은 가스", font=F(28, False), fill=GRAY, anchor="mm")
d.text((285, 480), "32,779원", font=F(66), fill=BLUE, anchor="mm")
d.text((285, 545), "여름 30㎥", font=F(28, False), fill=GRAY, anchor="mm")
d.line([540, 430, 540, 560], fill=(60, 66, 80), width=3)
d.text((795, 480), "158,396원", font=F(66), fill=RED, anchor="mm")
d.text((795, 545), "겨울 150㎥", font=F(28, False), fill=GRAY, anchor="mm")
d.text((W // 2, 625), "사용량이 5배, 요금은 4.8배", font=F(38), fill=WHITE, anchor="mm")

# 카드 1: 10만원의 정체
y = 690
d.rounded_rectangle([56, y, W - 56, y + 252], radius=26, fill=CARD)
d.text((96, y + 38), "10만원 아끼려면", font=F(30), fill=GRAY)
d.text((96, y + 96), "150㎥ → 54.5㎥", font=F(50), fill=AMBER)
d.text((96, y + 168), "사용량 63% 삭감해야 나오는 금액", font=F(28, False), fill=WHITE)
d.text((96, y + 210), "설정 몇 개로 10만원? 그런 집은 그만큼 안 쓴다", font=F(25, False), fill=GRAY)

# 카드 2: 절감액 5종
y = 975
d.rounded_rectangle([56, y, W - 56, y + 440], radius=26, fill=CARD)
d.text((96, y + 36), "에너지공단이 계산한 월 절감액", font=F(30), fill=GRAY)
rows = [
    ("안 쓰는 방 밸브 잠금", "25,923원"),
    ("온수 55℃ → 40℃", "8,610원"),
    ("샤워 5분 단축", "6,830원"),
    ("틈새 차단(문풍지)", "5,230원"),
    ("실내온도 1℃ 낮추기", "5,150원"),
]
ry = y + 88
for label, val in rows:
    d.text((96, ry), label, font=F(30, False), fill=WHITE)
    d.text((W - 96, ry), val, font=F(32), fill=GREEN, anchor="ra")
    ry += 50
d.line([96, ry + 4, W - 96, ry + 4], fill=(60, 66, 80), width=2)
d.text((96, ry + 22), "합계(단순 합산)", font=F(32), fill=WHITE)
d.text((W - 96, ry + 18), "51,743원", font=F(38), fill=AMBER, anchor="ra")

# 카드 3: 고지서 산식
y = 1442
d.rounded_rectangle([56, y, W - 56, y + 200], radius=26, fill=CARD)
d.text((96, y + 30), "고지서는 이렇게 계산된다", font=F(30), fill=GRAY)
d.text((96, y + 80), "사용량×0.9940×42.5MJ×22.5268원", font=F(34), fill=WHITE)
d.text((96, y + 128), "+ 기본요금 1,250원 → +10% 부가세", font=F(32, False), fill=BLUE)

# 하단 스트립
d.rectangle([0, 1660, W, H], fill=DEEP)
d.text((W // 2, 1718), "오늘 5분이면 되는 것", font=F(32, False), fill=(255, 196, 120), anchor="mm")
d.text((W // 2, 1788), "분배기 밸브 잠그고 온수 40℃", font=F(44), fill=WHITE, anchor="mm")
d.text((W // 2, 1852), "외출은 1~2℃만 낮추기 (하루 이상은 외출모드)", font=F(28, False), fill=WHITE, anchor="mm")
d.text((W // 2, 1900), "자세한 계산표는 프로필 링크", font=F(24, False), fill=(235, 200, 180), anchor="mm")

img.save("/workspace/downloads/gasbill_threads_infographic.png", "PNG")
print("saved /workspace/downloads/gasbill_threads_infographic.png")
