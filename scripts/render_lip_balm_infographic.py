#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 47번째 겨울 입술 건조·립밤 성분 비교 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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


BG = (13, 17, 23)
CARD = (23, 30, 41)
GOLD = (255, 193, 7)
RED = (255, 82, 82)
GREEN = (46, 204, 113)
BLUE = (80, 140, 255)
ORANGE = (255, 140, 40)
WHITE = (245, 247, 250)
GRAY = (160, 170, 185)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# 상단 레드 경고 배너
d.rectangle([0, 0, W, 300], fill=(140, 20, 20))
d.text((W // 2, 58), "립밤 덧바를수록 입술이 더 트는 이유", font=F(43), fill=WHITE, anchor="mm")
d.text((W // 2, 132), "멘톨·향료가 각질을 벗긴다 — 침의 소화효소까지 겹친다", font=F(31), fill=(255, 220, 120), anchor="mm")
d.text((W // 2, 202), "오늘 아침 서울 영하 1도·체감 영하 4도 첫 영하권", font=F(29, False), fill=WHITE, anchor="mm")
d.text((W // 2, 252), "입술은 피지선·땀샘이 없어 보호막 자체가 없다", font=F(29, False), fill=(255, 190, 190), anchor="mm")

d.line([(60, 338), (W - 60, 338)], fill=(70, 80, 95), width=3)
d.text((W // 2, 388), "그래서 무엇을 발라야 하나", font=F(48), fill=WHITE, anchor="mm")

rows = [
    ("바셀린", "증발만 막는 밀폐제", "수분 공급은 없음 — 취침 전 두껍게", GREEN),
    ("판테놀(B5)", "장벽 회복 쪽", "7일 도포로 각질층 수분↑ 손실↓", BLUE),
    ("세라마이드", "각질층 지질 보충", "즉각 밀폐는 약함 — 유지·관리용", ORANGE),
    ("멘톨·캄파", "청량감 뒤 각질 탈락", "AAD·서울대병원 모두 회피 권고", RED),
]

y = 436
card_h = 172
for badge, title, desc, color in rows:
    d.rounded_rectangle([60, y, W - 60, y + card_h], radius=22, fill=CARD, outline=color, width=4)
    d.rounded_rectangle([92, y + 30, 92 + 208, y + 30 + 56], radius=12, fill=color)
    d.text((92 + 104, y + 30 + 28), badge, font=F(28), fill=(20, 24, 30), anchor="mm")
    d.text((330, y + 58), title, font=F(31), fill=WHITE, anchor="lm")
    d.text((92, y + 128), desc, font=F(26, False), fill=GRAY, anchor="lm")
    y += card_h + 16

# 가격 팩트 박스
by = y + 14
d.rounded_rectangle([60, by, W - 60, by + 288], radius=22, fill=CARD, outline=GOLD, width=4)
d.text((92, by + 44), "가격 따져보면", font=F(30), fill=GOLD, anchor="lm")
d.text((92, by + 104), "립밤 7종 1g당 1,020~4,545원, 최대 4.5배", font=F(28, False), fill=WHITE, anchor="lm")
d.text((92, by + 152), "그런데 피부 자극지수는 전 제품 0.00", font=F(28, False), fill=WHITE, anchor="lm")
d.text((92, by + 202), "비싼 값은 성분이 아니라 향·제형·브랜드 값", font=F(26, False), fill=GRAY, anchor="lm")
d.text((92, by + 250), "확인일 2026-11-07 · 대전충남소비자연맹 시험", font=F(22, False), fill=(130, 140, 155), anchor="lm")

# 하단 경고 박스
wy = by + 306
d.rounded_rectangle([60, wy, W - 60, wy + 250], radius=22, fill=(60, 16, 16), outline=RED, width=4)
d.text((92, wy + 44), "2주에서 3주 안에 안 나으면", font=F(30), fill=WHITE, anchor="lm")
d.text((92, wy + 106), "립밤이 아니라 진료가 답이다", font=F(34), fill=(255, 200, 200), anchor="lm")
d.text((92, wy + 168), "아랫입술 각질이 오래가면 광선 구순염", font=F(25, False), fill=GRAY, anchor="lm")
d.text((92, wy + 212), "그 6~10%는 편평상피암으로 진행한다", font=F(25, False), fill=GRAY, anchor="lm")

d.text((W // 2, H - 84), "자세한 성분 비교표는 프로필 링크에", font=F(26, False), fill=(120, 132, 150), anchor="mm")
d.text((W // 2, H - 42), "ttajyeobom.com", font=F(31), fill=GOLD, anchor="mm")

out = "/workspace/downloads/lip_balm_threads_infographic.png"
img.save(out)
print(out, wy + 250)
