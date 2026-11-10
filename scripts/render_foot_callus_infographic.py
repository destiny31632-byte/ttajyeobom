#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 56번째 겨울 발뒤꿈치 각질·굳은살 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
DEEP = (32, 14, 18)
AMBER = (255, 176, 32)
BLUE = (86, 168, 255)
GREEN = (60, 205, 145)
WHITE = (246, 248, 252)
GRAY = (172, 180, 194)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# 상단 경고 배지
d.rectangle([0, 0, W, 340], fill=DEEP)
d.rounded_rectangle([56, 44, 56 + 700, 44 + 64], radius=14, fill=RED)
d.text((56 + 350, 44 + 32), "손톱깎이·면도칼로 뜯지 마세요", font=F(32), fill=(20, 4, 4), anchor="mm")
d.text((W // 2, 184), "겨울 발뒤꿈치 각질", font=F(44), fill=GRAY, anchor="mm")
d.text((W // 2, 264), "뜯으면 2차 감염·연조직염까지", font=F(52), fill=(255, 178, 120), anchor="mm")

# 히어로: 각질층 두께
d.text((W // 2, 402), "발뒤꿈치 각질층은 다른 피부가 아니다", font=F(28, False), fill=GRAY, anchor="mm")
d.text((285, 496), "약 0.28mm", font=F(52), fill=WHITE, anchor="mm")
d.text((285, 560), "발뒤꿈치 각질층", font=F(26, False), fill=GRAY, anchor="mm")
d.line([540, 444, 540, 578], fill=(60, 66, 80), width=3)
d.text((800, 496), "16배", font=F(64), fill=BLUE, anchor="mm")
d.text((800, 560), "비발바닥 대비", font=F(26, False), fill=GRAY, anchor="mm")

# 카드 1: 균열 기준선
y = 640
d.rounded_rectangle([56, y, W - 56, y + 276], radius=26, fill=CARD)
d.text((96, y + 34), "갈라짐을 가르는 숫자", font=F(30), fill=GRAY)
d.text((96, y + 86), "피부 수분 20% 아래 = 균열 시작", font=F(40), fill=AMBER)
d.text((96, y + 152), "균열 있는 뒤꿈치 14.6%", font=F(34), fill=RED)
d.text((96, y + 200), "균열 없는 뒤꿈치 19.1%", font=F(34), fill=WHITE)
d.text((96, y + 244), "당뇨 환자 693명 조사 · 균열 10.4%", font=F(24, False), fill=GRAY)

# 카드 2: 각질제거제 사고
y = 946
d.rounded_rectangle([56, y, W - 56, y + 276], radius=26, fill=CARD)
d.text((96, y + 34), "각질제거제 5년 위해정보 92건", font=F(28), fill=GRAY)
d.text((96, y + 86), "피부 부작용 53건 (57.6%)", font=F(40), fill=RED)
d.text((96, y + 152), "안구 29건 31.5% · 발 14건 15.2%", font=F(28, False), fill=WHITE)
d.text((96, y + 196), "여성 75건 81.5%", font=F(28, False), fill=GRAY)
d.text((96, y + 240), "한국소비자원 2015~2019 CISS", font=F(24, False), fill=GRAY)

# 카드 3: 3단계
y = 1252
d.rounded_rectangle([56, y, W - 56, y + 330], radius=26, fill=CARD)
d.text((96, y + 30), "순서가 있다 · 불리기 → 갈기 → 막기", font=F(28), fill=GRAY)
d.text((96, y + 82), "① 유레아 20% 연고로 불리기", font=F(34), fill=WHITE)
d.text((140, y + 128), "식약처 일반의약품 200mg/g", font=F(24, False), fill=GRAY)
d.text((96, y + 176), "② 방수 전동으로 주 1~2회 갈기", font=F(34), fill=WHITE)
d.text((140, y + 222), "IPX5 이상 · 2단 속도 · KC 확인", font=F(24, False), fill=GRAY)
d.text((96, y + 270), "③ 바세린 98% 밀폐로 막기", font=F(34), fill=GREEN)

# 하단 스트립
d.rectangle([0, 1620, W, H], fill=DEEP)
d.text((W // 2, 1682), "오늘 10분 체크", font=F(32, False), fill=(255, 196, 120), anchor="mm")
d.text((W // 2, 1750), "뒤꿈치 만져보고 금 깊으면 연고부터", font=F(38), fill=WHITE, anchor="mm")
d.text((W // 2, 1812), "갈았으면 바로 보습, 주 1~2회 넘기지 않기", font=F(30, False), fill=WHITE, anchor="mm")
d.text((W // 2, 1872), "3단계 가격 비교와 실구매 1~3위는 프로필 링크", font=F(24, False), fill=(235, 200, 180), anchor="mm")

img.save("/workspace/downloads/foot_callus_threads_infographic.png", "PNG")
print("saved /workspace/downloads/foot_callus_threads_infographic.png")
