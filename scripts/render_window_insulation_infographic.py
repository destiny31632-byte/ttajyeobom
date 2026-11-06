#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 45번째 겨울 창문 단열 뽁뽁이 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
d.text((W//2, 62), "뽁뽁이 붙였는데 왜 안 따뜻하지?", font=F(44), fill=WHITE, anchor="mm")
d.text((W//2, 138), "유리는 데워도 틈새바람은 그대로다", font=F(42), fill=(255, 220, 120), anchor="mm")
d.text((W//2, 208), "결로가 뽁뽁이 안에 갇히면 곰팡이 —", font=F(29, False), fill=WHITE, anchor="mm")
d.text((W//2, 256), "방치한 방은 퇴실 때 도배비 50만원 청구로 이어진다", font=F(29, False), fill=(255, 190, 190), anchor="mm")

d.line([(60, 336), (W-60, 336)], fill=(70, 80, 95), width=3)
d.text((W//2, 382), "창문 단열, 무엇이 무엇을 막나", font=F(48), fill=WHITE, anchor="mm")

rows = [
    ("뽁뽁이", "유리 표면 냉기만 차단", "실험 1시간 뒤 대조군 7.0도 vs 에어캡 9.2도", RED),
    ("풍지판·문풍지", "틈새바람(침기) 차단", "실측 침기풍속 0.77에서 0.09 m/s — 89% 저감", GREEN),
    ("방풍비닐", "창 전체 공기층(간이 이중창)", "실내온도 2에서3℃ 상승 조합(에너지공단)", BLUE),
    ("결로 관리", "맞통풍 환기 + 물기 닦기", "젖은 곳은 24에서48시간 안에 말려야 한다", ORANGE),
]

y = 424
card_h = 138
for badge, title, desc, color in rows:
    d.rounded_rectangle([60, y, W-60, y+card_h], radius=22, fill=CARD, outline=color, width=4)
    d.rounded_rectangle([92, y+22, 92+196, y+22+52], radius=12, fill=color)
    d.text((92+98, y+22+26), badge, font=F(30), fill=(20, 24, 30), anchor="mm")
    d.text((316, y+48), title, font=F(31), fill=WHITE, anchor="lm")
    d.text((92, y+110), desc, font=F(25, False), fill=GRAY, anchor="lm")
    y += card_h + 12

# 열손실 구조 박스
y += 14
by = y
d.rounded_rectangle([60, by, W-60, by+252], radius=22, fill=CARD, outline=GOLD, width=4)
d.text((92, by+44), "집에서 새는 열의 목격담 (국토해양부)", font=F(36), fill=GOLD, anchor="lm")
steps = [
    "① 창문 30% — 지붕 16%, 벽체 15%보다 가장 크다",
    "② 뽁뽁이는 유리면만 담당, 창틀 틈은 별도 조치",
    "③ 기밀 부자재(풍지판·모헤어)로 침기 82~89% 저감 실측",
]
sy = by + 100
for s in steps:
    d.text((92, sy), s, font=F(28, False), fill=WHITE, anchor="lm")
    sy += 48

# 곰팡이 경고 박스
ey = by + 268
d.rounded_rectangle([60, ey, W-60, ey+250], radius=22, fill=(30, 20, 20), outline=RED, width=4)
d.text((92, ey+40), "봄에 떼면 나오는 것 (판례 기준)", font=F(36), fill=RED, anchor="lm")
d.text((92, ey+96), "통상 사용 마모 = 임차인 몫 아님", font=F(29), fill=WHITE, anchor="lm")
d.text((92, ey+148), "관리 잘못으로 번진 곰팡이 = 배상 대상", font=F(29), fill=(255, 220, 120), anchor="lm")
d.text((92, ey+200), "입주·퇴실 사진이 증거 — 오늘 찍어둬라", font=F(29), fill=WHITE, anchor="lm")

# 환기 룰 하단 바
cy = ey + 266
d.rounded_rectangle([60, cy, W-60, cy+196], radius=22, fill=(20, 40, 30), outline=GREEN, width=4)
d.text((92, cy+38), "환기 골든룰 (질병관리청)", font=F(34), fill=GREEN, anchor="lm")
d.text((92, cy+94), "맞바람 두 창 동시 개방 · 하루 2번 이상", font=F(29), fill=WHITE, anchor="lm")
d.text((92, cy+148), "1회 최소 10분에서 30분 · 습도 40~50% 유지", font=F(29), fill=WHITE, anchor="lm")

# 하단 CTA
d.rectangle([0, H-160, W, H], fill=(140, 20, 20))
d.text((W//2, H-108), "창문 단열 설치 순서 · 결로 대응 체크리스트", font=F(33), fill=WHITE, anchor="mm")
d.text((W//2, H-52), "프로필 링크 @kkkyy.ya — 따져봄 ttajyeobom.com", font=F(29), fill=(255, 220, 120), anchor="mm")

img.save("/workspace/downloads/window_insulation_threads_infographic.png", quality=95)
print("saved")
