#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 44번째 겨울 가습기 방식별 비교 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
d.rectangle([0, 0, W, 306], fill=(140, 20, 20))
d.text((W//2, 60), "초음파 가습기 틀자마자 공기청정기", font=F(44), fill=WHITE, anchor="mm")
d.text((W//2, 134), "미세먼지 999 — 빨간불 실화다", font=F(44), fill=(255, 220, 120), anchor="mm")
d.text((W//2, 210), "고장이 아니라 '수돗물 + 초음파 분무'가 만드는", font=F(30, False), fill=WHITE, anchor="mm")
d.text((W//2, 264), "백분현상 + 센서 오인. 물통 세균은 폐로 직행한다", font=F(30, False), fill=(255, 190, 190), anchor="mm")

d.line([(60, 342), (W-60, 342)], fill=(70, 80, 95), width=3)
d.text((W//2, 388), "가습기 방식별 최대 리스크", font=F(50), fill=WHITE, anchor="mm")

rows = [
    ("초음파", "백분현상 · 센서 오인 · 세균 에어로졸", "진동자 미생물 검출률 34.5% — 녹농균 포함", RED),
    ("가열식", "99도 증기 화상 · 전기세", "화상 92건 중 77.2%가 만 6세 이하", ORANGE),
    ("복합식", "저온 모드에서 초음파 위험 잔존", "유지비 기종 편차 최대 (연 1.5~18.9만원)", BLUE),
    ("기화식", "필터 곰팡이 냄새", "필터 25,800원 · 3~6개월 교체 필수", GREEN),
]

y = 424
card_h = 136
for badge, title, desc, color in rows:
    d.rounded_rectangle([60, y, W-60, y+card_h], radius=22, fill=CARD, outline=color, width=4)
    d.rounded_rectangle([92, y+22, 92+128, y+22+52], radius=12, fill=color)
    d.text((92+64, y+22+26), badge, font=F(32), fill=(20, 24, 30), anchor="mm")
    d.text((244, y+48), title, font=F(32), fill=WHITE, anchor="lm")
    d.text((92, y+110), desc, font=F(25, False), fill=GRAY, anchor="lm")
    y += card_h + 12

# 백분현상 메커니즘 박스
y += 16
by = y
d.rounded_rectangle([60, by, W-60, by+280], radius=22, fill=CARD, outline=GOLD, width=4)
d.text((92, by+44), "999 찍는 이유 (EPA · 샤오미 공식)", font=F(38), fill=GOLD, anchor="lm")
steps = [
    "① 수돗물 속 칼슘·마그네슘이 초음파 진동자에 의해",
    "     미세 입자로 그대로 분무된다",
    "② 입자가 PM2.5와 직경이 비슷해 센서가 먼지로 오인",
    "③ 가습기 끄면 서서히 복귀 — 물은 정제수로 바꿔라",
]
sy = by + 94
for s in steps:
    d.text((92, sy), s, font=F(28, False), fill=WHITE, anchor="lm")
    sy += 46

# 전기세 비교 박스
ey = by + 296
d.rounded_rectangle([60, ey, W-60, ey+220], radius=22, fill=CARD, outline=RED, width=4)
d.text((92, ey+40), "가열식 하루 8시간 전기세 (월 기준)", font=F(36), fill=RED, anchor="lm")
d.text((92, ey+94), "초음파식  월 약 800원   (연 4,640~6,420원)", font=F(30), fill=GREEN, anchor="lm")
d.text((92, ey+144), "가열식    월 1.2~1.5만원 (연 72,750~91,070원)", font=F(30), fill=WHITE, anchor="lm")
d.text((92, ey+194), "누진 3단계 진입 시 월 2만9천~3만6천원", font=F(30), fill=(255, 220, 120), anchor="lm")

# 세척 주기 하단 바
cy = ey + 236
d.rounded_rectangle([60, cy, W-60, cy+192], radius=22, fill=(20, 40, 30), outline=GREEN, width=4)
d.text((92, cy+38), "세척 주기 (소비자원 · 질병관리청)", font=F(34), fill=GREEN, anchor="lm")
d.text((92, cy+92), "물 교체 매일 · 물통·진동자 닦기 2일 1회", font=F(29), fill=WHITE, anchor="lm")
d.text((92, cy+144), "중성세제 주 1회 · 청소 후 완전 건조 필수", font=F(29), fill=WHITE, anchor="lm")

# 하단 CTA
d.rectangle([0, H-160, W, H], fill=(140, 20, 20))
d.text((W//2, H-108), "가습기 방식별 비교표 · 세척 주기 전체 가이드", font=F(33), fill=WHITE, anchor="mm")
d.text((W//2, H-52), "프로필 링크 @kkkyy.ya — 따져봄 ttajyeobom.com", font=F(29), fill=(255, 220, 120), anchor="mm")

img.save("/workspace/downloads/humidifier_threads_infographic.png", quality=95)
print("saved")
