#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 41번째 겨울 보일러 동결·온수 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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

# 상단 경고 배너 (레드/블랙)
d.rectangle([0, 0, W, 300], fill=(140, 20, 20))
d.text((W//2, 62), "내일 아침 샤워하다 찬물만 나오면, 부르지 마세요", font=F(46), fill=WHITE, anchor="mm")
d.text((W//2, 148), "보일러 고장 90%가 아니라 배관 결빙·물 부족입니다", font=F(32), fill=(255, 220, 120), anchor="mm")
d.text((W//2, 218), "사설 해빙 부르면 최대 50만원 — 정식 A/S 출장비 2만3천원대", font=F(30, False), fill=WHITE, anchor="mm")
d.text((W//2, 266), "언 보일러 가동으로 녹이기 = 폭발 위험 절대 금지", font=F(30, False), fill=(255, 190, 190), anchor="mm")

d.line([(60, 336), (W-60, 336)], fill=(70, 80, 95), width=3)
d.text((W//2, 380), "온수가 안 나오는 3대 원인", font=F(50), fill=WHITE, anchor="mm")

rows = [
    ("원인 1", "직수·온수 배관 결빙", "찬물은 나오는데 온수만 안 나온다면 이것 — 60도 미만으로 해빙", RED),
    ("원인 2", "잠긴 직수 밸브", "보일러 마주 보고 오른쪽 첫 번째 밸브 — 배관과 나란히가 열림", ORANGE),
    ("원인 3", "난방수 부족", "압력계 0.5bar 이하면 물보충 — 정상은 1~1.5bar, 채우고 잠금", ORANGE),
]

y = 424
for badge, title, desc, color in rows:
    card_h = 140
    d.rounded_rectangle([60, y, W-60, y+card_h], radius=22, fill=CARD, outline=color, width=4)
    d.rounded_rectangle([92, y+24, 92+120, y+24+54], radius=12, fill=color)
    d.text((92+60, y+24+27), badge, font=F(34), fill=(20, 24, 30), anchor="mm")
    d.text((236, y+52), title, font=F(38), fill=WHITE, anchor="lm")
    d.text((92, y+116), desc, font=F(27, False), fill=GRAY, anchor="lm")
    y += card_h + 14

# 해빙 정석 박스
y += 4
d.rounded_rectangle([60, y, W-60, y+190], radius=22, fill=CARD, outline=GREEN, width=4)
d.text((92, y+40), "배관 해빙 정석 (제조사 공식)", font=F(38), fill=GREEN, anchor="lm")
d.text((92, y+96), "전원 뽑기 → 온수 틀어두기 → 60도 미만 물수건·드라이어", font=F(31), fill=WHITE, anchor="lm")
d.text((92, y+142), "급수·온수 두 배관 동시 해빙 · 굴곡부·조인트부터 가열", font=F(29, False), fill=GRAY, anchor="lm")

# 절대 금지 박스
y += 228
d.rounded_rectangle([60, y, W-60, y+320], radius=22, fill=CARD, outline=RED, width=4)
d.text((92, y+40), "이러면 수백만 원 배상됩니다", font=F(38), fill=RED, anchor="lm")
lines = [
    ("끓는 물", "급격한 온도변화로 배관·계량기 균열", RED),
    ("보일러 가동", "동결 상태 가동은 폭발 위험", RED),
    ("토치 불", "집중 화염은 배관 파열", RED),
    ("사설 무단개조", "견적 회피 업체는 피할 것", ORANGE),
]
ly = y + 80
for tag, desc, color in lines:
    d.rounded_rectangle([92, ly, 92+230, ly+50], radius=12, fill=(35, 45, 60))
    d.text((92+115, ly+25), tag, font=F(27), fill=color, anchor="mm")
    d.text((350, ly+25), desc, font=F(27, False), fill=WHITE, anchor="lm")
    ly += 52

# 대응 박스
y += 348
d.rounded_rectangle([60, y, W-60, y+150], radius=22, fill=CARD, outline=GOLD, width=4)
d.text((92, y+36), "동파 계량기는 무료 교체 구간입니다", font=F(35), fill=GOLD, anchor="lm")
d.text((92, y+88), "계량기 유리가 깨졌다면 다산콜 120·수도사업소 신고 — 직접 녹이지 마세요", font=F(29, False), fill=WHITE, anchor="lm")
d.text((92, y+124), "예방: 전원 플러그 상시 · 배관 보온재 · 외출모드 · 물 한두 방울", font=F(29, False), fill=GREEN, anchor="lm")

# 결론 박스
d.rounded_rectangle([60, H-300, W-60, H-170], radius=22, fill=(30, 45, 35), outline=GREEN, width=4)
d.text((W//2, H-262), "증상 3분류 → 밸브·압력계·리셋 → 60도 미만 해빙", font=F(36), fill=GREEN, anchor="mm")
d.text((W//2, H-208), "3사 에러코드 자가해결표까지 — 사설 부르기 전 5분이면 됩니다", font=F(28, False), fill=GRAY, anchor="mm")

# 하단 CTA
d.text((W//2, H-96), "경동·귀뚜라미·린나이 에러코드 해석표 → 프로필 링크", font=F(38), fill=WHITE, anchor="mm")
d.text((W//2, H-40), "따져봄 ttajyeobom.com | 출처: 한국에너지공단·경동나비엔·귀뚜라미·서울시", font=F(22, False), fill=GRAY, anchor="mm")

img.save("/workspace/downloads/threads_boiler_freeze_infographic.png")
print("saved", img.size)
