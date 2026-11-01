#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 31번째 발열조끼 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
SILVER = (189, 195, 199)
BRONZE = (205, 127, 50)
RED = (255, 82, 82)
GREEN = (46, 204, 113)
WHITE = (245, 247, 250)
GRAY = (160, 170, 185)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# 상단 경고 배너
d.rectangle([0, 0, W, 360], fill=(140, 20, 20))
d.text((W//2, 70), "발열조끼 3단, 최고", font=F(66), fill=WHITE, anchor="mm")
d.text((W//2, 160), "64도까지 올라갔다", font=F(80), fill=(255, 220, 120), anchor="mm")
d.text((W//2, 255), "소비자원 시험 10종 중 4종, 표면온도 50도 초과", font=F(38, False), fill=WHITE, anchor="mm")
d.text((W//2, 315), "40~50도 장시간 노출 = 저온화상 · 질병관리본부", font=F(34, False), fill=(255, 190, 190), anchor="mm")

# 구분선
d.line([(60, 395), (W-60, 395)], fill=(70, 80, 95), width=3)
d.text((W//2, 452), "겨울 발열조끼 BEST 3", font=F(58), fill=WHITE, anchor="mm")

rows = [
    ("1위", "발열조끼", "스위스밀리터리 HIVE-500S", "92,000원", "배터리 포함 · USB 3단 · 상품평 113", GOLD),
    ("2위", "전용 배터리", "드리온 D-20000A 20000mAh", "21,000원", "5V 2A 전용 출력 · 2포트 · 상품평 109", SILVER),
    ("3위", "보온 보조", "글랜필드 발열목도리 SHS-01", "26,500원", "나노그래핀 · KC인증 · 42/48/52도 3단", BRONZE),
]

y = 520
for badge, kind, name, price, spec, color in rows:
    card_h = 205
    d.rounded_rectangle([60, y, W-60, y+card_h], radius=26, fill=CARD, outline=color, width=4)
    d.rounded_rectangle([92, y+28, 92+110, y+28+64], radius=14, fill=color)
    d.text((92+55, y+28+32), badge, font=F(42), fill=(20, 24, 30), anchor="mm")
    d.text((232, y+62), kind, font=F(36), fill=color, anchor="lm")
    d.text((92, y+122), name, font=F(44), fill=WHITE, anchor="lm")
    d.text((W-92, y+120), price, font=F(50), fill=(120, 220, 160), anchor="rm")
    d.text((92, y+178), spec, font=F(31, False), fill=GRAY, anchor="lm")
    y += card_h + 20

# 배터리 계산 박스
d.rounded_rectangle([60, y, W-60, y+280], radius=26, outline=(80, 140, 255), width=5)
d.text((W//2, y+50), "보조배터리 용량별 작동시간", font=F(46), fill=(120, 180, 255), anchor="mm")
d.text((100, y+122), "10,000mAh 최고단 연속  약 3.2시간", font=F(42), fill=WHITE, anchor="lm")
d.text((100, y+182), "20,000mAh 최고단 연속  약 6.3시간", font=F(42), fill=WHITE, anchor="lm")
d.text((100, y+242), "저온단으로 돌리면 9~18시간(소비자원 실측)", font=F(37, False), fill=(120, 220, 160), anchor="lm")
y += 280 + 30

# 안전 수칙 박스
d.rounded_rectangle([60, y, W-60, y+255], radius=26, outline=RED, width=5)
d.text((W//2, y+48), "저온화상 막는 3가지", font=F(50), fill=RED, anchor="mm")
d.text((100, y+115), "① 맨몸 착용 금지 · 잠잘 때는 해제", font=F(40), fill=WHITE, anchor="lm")
d.text((100, y+175), "② 충전은 바닥에서 4시간 이내", font=F(40), fill=WHITE, anchor="lm")
d.text((100, y+230), "③ 세탁 전 배터리 분리·단자 잠금", font=F(40), fill=WHITE, anchor="lm")

# 푸터
d.text((W//2, H-120), "상세 비교표·배터리 작동시간 계산기는", font=F(40, False), fill=GRAY, anchor="mm")
d.text((W//2, H-64), "프로필 링크 @kkkyy.ya ttajyeobom.com", font=F(46), fill=GREEN, anchor="mm")
d.text((W//2, H-20), "따져봄 · 숫자로 따져보는 겨울 방한", font=F(30, False), fill=(90, 100, 115), anchor="mm")

img.save("/workspace/downloads/threads_heated_vest_infographic2.png")
print("saved", img.size)
