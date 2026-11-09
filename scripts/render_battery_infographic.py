#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 53번째 겨울철 스마트폰 배터리·보조배터리 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
DEEP = (120, 12, 12)
AMBER = (255, 176, 32)
BLUE = (86, 168, 255)
GREEN = (60, 205, 145)
WHITE = (246, 248, 252)
GRAY = (172, 180, 194)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# 상단 경고 배지
d.rectangle([0, 0, W, 316], fill=DEEP)
d.rounded_rectangle([56, 42, 56 + 780, 42 + 62], radius=14, fill=RED)
d.text((56 + 390, 42 + 31), "겨울철 폰이 30%에서 꺼지는 이유", font=F(30), fill=(20, 6, 6), anchor="mm")
d.text((W // 2, 168), "핫팩을 폰에 붙이면", font=F(46), fill=WHITE, anchor="mm")
d.text((W // 2, 248), "배터리가 부푼다", font=F(58), fill=(255, 196, 120), anchor="mm")

# 히어로 수치: 온도 비교
d.text((W // 2, 388), "핫팩 최고온도 vs 아이폰 작동 상한", font=F(30, False), fill=GRAY, anchor="mm")
d.text((300, 500), "70℃", font=F(120), fill=RED, anchor="mm")
d.text((790, 500), "35℃", font=F(120), fill=BLUE, anchor="mm")
d.text((300, 585), "핫팩 (안전기준 상한)", font=F(28, False), fill=GRAY, anchor="mm")
d.text((790, 585), "아이폰 (애플 공식)", font=F(28, False), fill=GRAY, anchor="mm")
d.line([540, 430, 540, 600], fill=(60, 66, 80), width=3)
d.text((W // 2, 655), "두 배 넘는 열이 배터리 수명을 태운다", font=F(34), fill=WHITE, anchor="mm")

# 카드 1: 꺼짐의 정체
y = 715
d.rounded_rectangle([56, y, W - 56, y + 250], radius=26, fill=CARD)
d.text((96, y + 40), "왜 꺼지나", font=F(30), fill=GRAY)
d.text((96, y + 100), "방전이 아니라 전압 강하", font=F(46), fill=WHITE)
d.text((96, y + 170), "저온 → 내부저항 증가 → 전압 급락 → 보호 셧다운", font=F(28, False), fill=GRAY)
d.text((96, y + 210), "온도가 돌아오면 원래대로 (삼성전자)", font=F(28, False), fill=GREEN)

# 카드 2: 실사용 용량
y = 1000
d.rounded_rectangle([56, y, W - 56, y + 250], radius=26, fill=CARD)
d.text((96, y + 40), "보조배터리 실사용", font=F(30), fill=GRAY)
d.text((96, y + 100), "10,000mAh → 6,500mAh", font=F(44), fill=AMBER)
d.text((96, y + 170), "3.7V를 5V로 올리며 손실 / 폰 두 번 남짓", font=F(28, False), fill=GRAY)
d.text((96, y + 210), "소비자원 시험 충전 1.91~2.3회", font=F(28, False), fill=WHITE)

# 카드 3: 기내 반입
y = 1285
d.rounded_rectangle([56, y, W - 56, y + 250], radius=26, fill=CARD)
d.text((96, y + 40), "비행기 기준은 Wh", font=F(30), fill=GRAY)
d.text((96, y + 100), "100Wh 이하 = 5개", font=F(44), fill=BLUE)
d.text((96, y + 170), "100Wh = 약 27,000mAh (3.7V) / 위탁 금지", font=F(28, False), fill=GRAY)
d.text((96, y + 210), "선반 보관 금지, 몸에 소지", font=F(28, False), fill=WHITE)

# 하단 경고 스트립
d.rectangle([0, 1580, W, H], fill=DEEP)
d.text((W // 2, 1650), "오늘부터", font=F(36, False), fill=(255, 196, 120), anchor="mm")
d.text((W // 2, 1730), "핫팩은 손 주머니, 폰은 반대 주머니", font=F(44), fill=WHITE, anchor="mm")
d.text((W // 2, 1810), "실내 들어오면 10~15분 뒤 충전", font=F(34), fill=WHITE, anchor="mm")
d.text((W // 2, 1875), "자세한 계산표는 프로필 링크", font=F(26, False), fill=(235, 200, 180), anchor="mm")

img.save("/workspace/downloads/battery_threads_infographic.png", "PNG")
print("saved /workspace/downloads/battery_threads_infographic.png")
