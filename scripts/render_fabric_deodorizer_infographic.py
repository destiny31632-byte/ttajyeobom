#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 113탄 섬유탈취제 쓰레드 인포그래픽 (4:5, 1080x1350) 2장
from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1350
FONT = "/usr/share/fonts/pickle-hwp/NotoSansCJKkr-Regular.otf"

BG = (10, 12, 17)
CARD = (24, 27, 36)
BOX = (18, 21, 29)
TEAL = (38, 214, 170)
RED = (255, 77, 77)
AMBER = (255, 197, 61)
WHITE = (246, 248, 252)
GRAY = (168, 176, 190)
DIM = (120, 128, 142)


def F(sz):
    return ImageFont.truetype(FONT, sz)


def T(d, xy, text, size, fill=WHITE, anchor="la", bold=0):
    d.text(xy, text, font=F(size), fill=fill, anchor=anchor,
           stroke_width=bold, stroke_fill=fill)


# ---------------- Card 1 ----------------
img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

d.rectangle([0, 0, W, 12], fill=TEAL)
T(d, (64, 56), "소비자원 8종 시험 · 2026.08.27", 30, TEAL)
T(d, (64, 110), "패딩·코트에 뿌리는 섬유탈취제", 34, GRAY)

T(d, (64, 176), "고기 냄새 잡는 제품", 62, WHITE, bold=1)
T(d, (64, 252), "8개 중 2개뿐", 92, AMBER, bold=1)

d.rounded_rectangle([64, 392, W - 64, 626], radius=28, fill=CARD)
T(d, (104, 424), "고기구이 냄새 제거 · 상대적 우수", 30, TEAL)
T(d, (104, 476), "스너글 · 아우라", 58, WHITE, bold=1)
T(d, (104, 560), "나머지 5종은 '양호', 1종은 '보통'", 28, GRAY)

T(d, (64, 690), "100mL당 가격은 2.3배 차이", 42, WHITE, bold=1)

bar_x, bar_w = 372, 540
rows = [("스너글", 1479, RED, "1,479원"), ("샤프란케어", 656, TEAL, "656원")]
y = 772
for name, val, color, label in rows:
    T(d, (64, y + 4), name, 30, GRAY)
    d.rounded_rectangle([bar_x, y, bar_x + bar_w, y + 44], radius=10, fill=(40, 44, 56))
    w = int(bar_w * val / 1479)
    d.rounded_rectangle([bar_x, y, bar_x + w, y + 44], radius=10, fill=color)
    T(d, (bar_x + bar_w + 18, y + 4), label, 30, color, bold=1)
    y += 92

T(d, (64, y + 14), "같은 횟수를 뿌리면 두 배 넘게 차이 납니다", 28, GRAY)

# bottom summary
d.line([64, 1042, W - 64, 1042], fill=(52, 58, 72), width=2)
T(d, (64, 1074), "고기 냄새", 28, GRAY)
T(d, (64, 1112), "스너글 · 아우라", 34, WHITE)
T(d, (556, 1074), "100mL 단가", 28, GRAY)
T(d, (556, 1112), "샤프란케어 656원", 34, TEAL)

T(d, (64, H - 88), "출처 한국소비자원 비교공감 제2026-14호", 24, DIM)
img.save("/workspace/thread113/card1_odortype_price.png")
print("card1 ok")

# ---------------- Card 2 ----------------
img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)
d.rectangle([0, 0, W, 12], fill=RED)

T(d, (64, 56), "냄새마다 이기는 제품이 다릅니다", 30, RED)
T(d, (64, 110), "섬유탈취제 8종, 성분별 탈취 시험", 34, GRAY)

T(d, (64, 186), "화장실·생선 냄새", 54, WHITE, bold=1)
d.rounded_rectangle([64, 292, W - 64, 408], radius=24, fill=CARD)
T(d, (96, 320), "8개 중 5개가 '상대적 우수'", 44, TEAL, bold=1)

T(d, (64, 472), "썩은 냄새", 54, WHITE, bold=1)
d.rounded_rectangle([64, 566, W - 64, 682], radius=24, fill=CARD)
T(d, (96, 594), "8개 모두 '보통'", 44, RED, bold=1)

T(d, (64, 726), "하수구·오래된 빨래 냄새는", 30, GRAY)
T(d, (64, 768), "탈취제보다 세탁과 환기가 먼저입니다", 30, WHITE)

d.rounded_rectangle([64, 856, W - 64, 1156], radius=28, fill=BOX)
T(d, (100, 882), "코트에 뿌릴 때", 28, AMBER)
steps = [
    "1.  10cm에서 20cm 거리로",
    "2.  가죽·모피·스웨이드는 피하기",
    "3.  안감 안쪽에 먼저 테스트",
]
sy = 930
for s in steps:
    T(d, (100, sy), s, 33, WHITE)
    sy += 68

T(d, (64, H - 88), "출처 한국소비자원 비교공감 제2026-14호", 24, DIM)
img.save("/workspace/thread113/card2_odor_type.png")
print("card2 ok")
