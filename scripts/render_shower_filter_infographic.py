#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 57번째 겨울 샤워·잔류염소·샤워기 필터 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
d.rounded_rectangle([56, 44, 56 + 760, 44 + 64], radius=14, fill=RED)
d.text((56 + 380, 44 + 32), "보습제 10통 발라도 안 되는 이유", font=F(32), fill=(20, 4, 4), anchor="mm")
d.text((W // 2, 184), "겨울 샤워 후 등 가려움·등드름", font=F(42), fill=GRAY, anchor="mm")
d.text((W // 2, 264), "주범은 염소보다 뜨거운 물", font=F(54), fill=(255, 178, 120), anchor="mm")

# 히어로: 뜨거운 물 10분
d.text((W // 2, 402), "41.29℃ 물에 10분 담갔더니", font=F(28, False), fill=GRAY, anchor="mm")
d.text((300, 496), "25.75", font=F(58), fill=WHITE, anchor="mm")
d.text((300, 562), "실험 전 수분손실", font=F(24, False), fill=GRAY, anchor="mm")
d.text((540, 496), "→", font=F(52), fill=RED, anchor="mm")
d.text((790, 496), "58.58", font=F(64), fill=RED, anchor="mm")
d.text((790, 562), "10분 뒤 2.3배", font=F(24, False), fill=GRAY, anchor="mm")

# 카드 1: 잔류염소 기준
y = 640
d.rounded_rectangle([56, y, W - 56, y + 276], radius=26, fill=CARD)
d.text((96, y + 30), "수돗물 잔류염소는 0이 정답이 아니다", font=F(28), fill=GRAY)
d.text((96, y + 84), "0.1–4.0 mg/L 관리 범위", font=F(42), fill=AMBER)
d.text((96, y + 150), "총트리할로메탄 0.1 mg/L · 클로로포름 0.08 mg/L", font=F(27, False), fill=WHITE)
d.text((96, y + 198), "아토피 피부는 0.5 mg/L부터 수분 보유능 저하", font=F(27, False), fill=GRAY)
d.text((96, y + 242), "정상 피부는 2.0 mg/L에서만 차이", font=F(24, False), fill=GRAY)

# 카드 2: 기화 노출
y = 946
d.rounded_rectangle([56, y, W - 56, y + 276], radius=26, fill=CARD)
d.text((96, y + 30), "샤워 10분, 실제 노출량", font=F(28), fill=GRAY)
d.text((96, y + 84), "샤워실 공기 5.8 → 351 μg/㎥", font=F(34), fill=WHITE)
d.text((96, y + 142), "혈중 총트리할로메탄 16.5 → 299 ng/L", font=F(30, False), fill=GRAY)
d.text((96, y + 196), "기화는 사실이다", font=F(34), fill=BLUE)
d.text((96, y + 242), "다만 몸에 남는 양은 μg·ng 단위", font=F(26, False), fill=GRAY)

# 카드 3: 필터 성능 실태
y = 1252
d.rounded_rectangle([56, y, W - 56, y + 330], radius=26, fill=CARD)
d.text((96, y + 28), "필터샤워기 20개 시험 결과", font=F(28), fill=GRAY)
d.text((96, y + 80), "7개(35%)는 염소 제거율 80% 미만", font=F(38), fill=RED)
d.text((140, y + 128), "6개는 시험성적서 없이 판매", font=F(24, False), fill=WHITE)
d.text((96, y + 176), "10%도 못 걸러낸 제품 있었다", font=F(32), fill=WHITE)
d.text((140, y + 222), "2024년 시험선 3개 제품 불검출", font=F(24, False), fill=GRAY)
d.text((96, y + 268), "세디먼트 = 녹물 / 비타민C = 염소", font=F(32), fill=GREEN)

# 하단 스트립
d.rectangle([0, 1620, W, H], fill=DEEP)
d.text((W // 2, 1682), "오늘 10분 체크", font=F(32, False), fill=(255, 196, 120), anchor="mm")
d.text((W // 2, 1750), "물 40℃ 아래, 샤워 10분 안으로", font=F(38), fill=WHITE, anchor="mm")
d.text((W // 2, 1812), "목욕 후 3분 안 보습 · 습도 40–50%", font=F(30, False), fill=WHITE, anchor="mm")
d.text((W // 2, 1872), "필터 비교표와 실구매 1–3위는 프로필 링크", font=F(24, False), fill=(235, 200, 180), anchor="mm")

img.save("/workspace/downloads/shower_filter_threads_infographic.png", "PNG")
print("saved /workspace/downloads/shower_filter_threads_infographic.png", img.size)
