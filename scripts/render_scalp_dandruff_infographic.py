#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 60번째 겨울 두피 각질·비듬 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
d.rectangle([0, 0, W, 352], fill=DEEP)
d.rounded_rectangle([44, 40, 44 + 930, 40 + 68], radius=14, fill=RED)
d.text((44 + 465, 40 + 34), "비듬 샴푸 아무거나 쓰는 분들", font=F(33), fill=(22, 4, 4), anchor="mm")
d.text((W // 2, 194), "겨울엔 두피 장벽부터 녹아내립니다", font=F(40), fill=GRAY, anchor="mm")
d.text((W // 2, 280), "하얀 가루와 노란 각질은 원인이 다릅니다", font=F(42), fill=(255, 178, 120), anchor="mm")

# 히어로: 겨울 실내 습도
d.text((W // 2, 412), "겨울 아파트 20집 실측 실내 습도", font=F(27, False), fill=GRAY, anchor="mm")
d.text((W // 2, 510), "평균 35.4%", font=F(78), fill=RED, anchor="mm")
d.text((W // 2, 590), "권고 하한 40%를 밑돈 6집은 평균 26.7%", font=F(26, False), fill=GRAY, anchor="mm")

# 카드 1: 갈래
y = 644
d.rounded_rectangle([56, y, W - 56, y + 272], radius=26, fill=CARD)
d.text((96, y + 24), "어깨에 떨어지는 각질 색으로 먼저 가르세요", font=F(26), fill=GRAY)
d.text((96, y + 74), "하얗고 자잘하다 → 건조(건성잔비늘증)", font=F(32), fill=BLUE)
d.text((96, y + 120), "필요한 것: 약산성 · 보습 · 습도 40%", font=F(24, False), fill=GRAY)
d.text((96, y + 170), "노랗고 붙어 있다 → 지루 피부염 쪽", font=F(32), fill=AMBER)
d.text((96, y + 216), "필요한 것: 항진균 성분 + 주 2~3회", font=F(24, False), fill=GRAY)

# 카드 2: 성분
y = 944
d.rounded_rectangle([56, y, W - 56, y + 386], radius=26, fill=CARD)
d.text((96, y + 26), "약용 성분 4개는 하는 일이 다릅니다", font=F(28), fill=GRAY)
rows = [
    ("케토코나졸 2%", "3~5분 방치 · 주 2회", GREEN),
    ("셀레늄 설파이드 2.5%", "항진균+각질용해 · 자극 주의", AMBER),
    ("징크피리치온", "입자로 남아 서서히 작용", BLUE),
    ("살리실산", "각질만 녹임 · 항진균 아님", (255, 140, 90)),
]
yy = y + 76
for name, desc, col in rows:
    d.text((96, yy), name, font=F(26), fill=WHITE)
    d.text((96, yy + 34), desc, font=F(22, False), fill=col)
    yy += 70

# 카드 3: 임상
y = 1354
d.rounded_rectangle([56, y, W - 56, y + 240], radius=26, fill=CARD)
d.text((96, y + 22), "246명 이중맹검 임상이 가른 건 효과가 아니었습니다", font=F(25), fill=GRAY)
d.text((96, y + 70), "효과는 비슷, 자극은 한쪽", font=F(38), fill=RED)
d.text((96, y + 128), "이상반응 9건이 전부 셀레늄 설파이드군", font=F(27), fill=WHITE)
d.text((96, y + 174), "모발 탈색 · 두피 착색 · 가려움 포함", font=F(23, False), fill=GRAY)
d.text((96, y + 206), "민감한 두피라면 자극 적은 성분부터", font=F(23, False), fill=GREEN)

# 하단 스트립
d.rectangle([0, 1608, W, H], fill=DEEP)
d.text((W // 2, 1668), "씻는 법만 바꿔도 절반은 끝납니다", font=F(31), fill=(255, 196, 120), anchor="mm")
d.text((W // 2, 1732), "물 36–38℃ · 드라이어 15cm · 스케일러 주 1–2회", font=F(27), fill=WHITE, anchor="mm")
d.text((W // 2, 1790), "젖은 채 2시간 두면 그게 더 큰 손상입니다", font=F(27), fill=WHITE, anchor="mm")
d.text((W // 2, 1858), "실구매 1–3위 가격과 성분표는 프로필 링크", font=F(24, False), fill=(235, 200, 180), anchor="mm")

img.save("/workspace/downloads/dandruff_scalp_threads_infographic.png", "PNG")
print("saved", img.size)
