#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 32번째 패딩 세탁 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
BLUE = (80, 140, 255)
WHITE = (245, 247, 250)
GRAY = (160, 170, 185)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# 상단 경고 배너
d.rectangle([0, 0, W, 340], fill=(140, 20, 20))
d.text((W//2, 70), "고가 패딩, 드라이에", font=F(66), fill=WHITE, anchor="mm")
d.text((W//2, 160), "맡기면 손해입니다", font=F(80), fill=(255, 220, 120), anchor="mm")
d.text((W//2, 245), "5회 반복세탁 시 보온율 87.3% vs 물세탁 99.8%", font=F(38, False), fill=WHITE, anchor="mm")
d.text((W//2, 300), "드라이 유기용제가 오리털 유지분을 녹입니다", font=F(34, False), fill=(255, 190, 190), anchor="mm")

# 구분선
d.line([(60, 380), (W-60, 380)], fill=(70, 80, 95), width=3)
d.text((W//2, 440), "패딩 세탁·관리 BEST 3", font=F(58), fill=WHITE, anchor="mm")

rows = [
    ("1위", "다운 전용 세제", "울샴푸 다운워시 800ml", "8,690원", "중성세제 · 유지분 보호 · 상품평 16,876", GOLD),
    ("2위", "털뭉침 복원", "코멧 울드라이어볼 6p", "6,990원", "양모볼 · 필파워 복원 · 상품평 4,565", SILVER),
    ("3위", "발수 코팅 복원", "닉왁스 다이렉스 스프레이온", "14,100원", "DWR 갱신 · 아웃도어 의류용 · 448평", BRONZE),
]

y = 505
for badge, kind, name, price, spec, color in rows:
    card_h = 200
    d.rounded_rectangle([60, y, W-60, y+card_h], radius=26, fill=CARD, outline=color, width=4)
    d.rounded_rectangle([92, y+28, 92+110, y+28+64], radius=14, fill=color)
    d.text((92+55, y+28+32), badge, font=F(42), fill=(20, 24, 30), anchor="mm")
    d.text((232, y+62), kind, font=F(36), fill=color, anchor="lm")
    d.text((92, y+120), name, font=F(42), fill=WHITE, anchor="lm")
    d.text((W-92, y+118), price, font=F(50), fill=(120, 220, 160), anchor="rm")
    d.text((92, y+174), spec, font=F(30, False), fill=GRAY, anchor="lm")
    y += card_h + 20

# 세탁 온도 박스
d.rounded_rectangle([60, y, W-60, y+300], radius=26, outline=BLUE, width=5)
d.text((W//2, y+50), "물세탁 성공 3조건", font=F(50), fill=(120, 180, 255), anchor="mm")
d.text((100, y+125), "① 물 온도 최대 30℃ (라벨 숫자는 최대치)", font=F(38), fill=WHITE, anchor="lm")
d.text((100, y+185), "② 다운 전용 중성세제 · 유연제·표백제 금지", font=F(38), fill=WHITE, anchor="lm")
d.text((100, y+245), "③ 탈수 1분 내외 · 울볼 넣고 저온 건조", font=F(38), fill=WHITE, anchor="lm")
y += 300 + 30

# 안전 수칙 박스
d.rounded_rectangle([60, y, W-60, y+230], radius=26, outline=RED, width=5)
d.text((W//2, y+48), "발수 스프레이 흡입 주의", font=F(48), fill=RED, anchor="mm")
d.text((100, y+115), "① 반드시 환기되는 실외 · 마스크 착용", font=F(38), fill=WHITE, anchor="lm")
d.text((100, y+172), "② 밀폐 실내 사용 → 폐렴 입원 사례 보고", font=F(38), fill=WHITE, anchor="lm")

# 푸터
d.text((W//2, H-120), "소재별 세탁 체크리스트·배상 기준 정리는", font=F(40, False), fill=GRAY, anchor="mm")
d.text((W//2, H-64), "프로필 링크 @kkkyy.ya ttajyeobom.com", font=F(46), fill=GREEN, anchor="mm")
d.text((W//2, H-20), "따져봄 · 숫자로 따져보는 겨울 살림", font=F(30, False), fill=(90, 100, 115), anchor="mm")

img.save("/workspace/downloads/threads_down_jacket_laundry_infographic.png")
print("saved", img.size)
