#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 30번째 캠핑 난방 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
d.rectangle([0, 0, W, 420], fill=(140, 20, 20))
d.text((W//2, 90), "텐트 난로, 45초 만에", font=F(74), fill=WHITE, anchor="mm")
d.text((W//2, 190), "일산화탄소 500ppm", font=F(88), fill=(255, 220, 120), anchor="mm")
d.text((W//2, 300), "최근 4년간 텐트 CO 중독 119 신고 114건", font=F(44, False), fill=WHITE, anchor="mm")
d.text((W//2, 368), "심정지 6건 · 소방청 실험", font=F(40, False), fill=(255, 190, 190), anchor="mm")

# 구분선
d.line([(60, 460), (W-60, 460)], fill=(70, 80, 95), width=3)
d.text((W//2, 520), "겨울 캠핑·차박 난방 BEST 3", font=F(64), fill=WHITE, anchor="mm")

rows = [
    ("1위", "대류형 등유난로", "파세코 캠프10 선셋", "199,000원", "4.7L 탱크 · 무전원 대류 · KC인증", GOLD),
    ("2위", "정밀제어 팬히터", "신일 SFH-BH900", "379,050원", "9L 탱크 · 온도조절 · 등유 난방", SILVER),
    ("3위", "생명 직결 필수템", "수산홈텍 CO 경보기", "24,650원", "디지털 표시 · 국가검사 · 천장 설치", BRONZE),
]

y = 600
for badge, kind, name, price, spec, color in rows:
    card_h = 240
    d.rounded_rectangle([60, y, W-60, y+card_h], radius=28, fill=CARD, outline=color, width=4)
    # 순위 배지
    d.rounded_rectangle([92, y+34, 92+118, y+34+72], radius=16, fill=color)
    d.text((92+59, y+34+36), badge, font=F(46), fill=(20, 24, 30), anchor="mm")
    d.text((240, y+72), kind, font=F(40), fill=color, anchor="lm")
    d.text((92, y+142), name, font=F(52), fill=WHITE, anchor="lm")
    d.text((W-92, y+140), price, font=F(58), fill=(120, 220, 160), anchor="rm")
    d.text((92, y+206), spec, font=F(36, False), fill=GRAY, anchor="lm")
    y += card_h + 28

# 안전 수칙 박스
box_h = 300
d.rounded_rectangle([60, y, W-60, y+box_h], radius=28, outline=RED, width=5)
d.text((W//2, y+52), "캠핑장에서 죽지 않는 3가지", font=F(54), fill=RED, anchor="mm")
d.text((100, y+122), "① 환기구 2곳 이상 상시 확보", font=F(46), fill=WHITE, anchor="lm")
d.text((100, y+190), "② CO 경보기는 천장 근처 설치", font=F(46), fill=WHITE, anchor="lm")
d.text((100, y+252), "③ 취침 중 난로는 소화", font=F(46), fill=WHITE, anchor="lm")
d.text((W-100, y+252), "침낭·물주머니 전환", font=F(36, False), fill=GRAY, anchor="rm")
y = H

# 푸터
d.text((W//2, H-170), "상세 비교표·환기 계산기는", font=F(44, False), fill=GRAY, anchor="mm")
d.text((W//2, H-108), "프로필 링크 @kkkyy.ya ttajyeobom.com", font=F(50), fill=GREEN, anchor="mm")
d.text((W//2, H-50), "따져봄 · 숫자로 따져보는 겨울 난방", font=F(34, False), fill=(90, 100, 115), anchor="mm")

img.save("/workspace/downloads/threads_camping_heater_infographic.png")
print("saved", img.size)
