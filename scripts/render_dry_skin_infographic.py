#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 38번째 피부 건조증·바디로션 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
d.text((W//2, 62), "때밀이로 나오는 건 '때'가 아닙니다", font=F(52), fill=WHITE, anchor="mm")
d.text((W//2, 148), "한 번 밀 때 각질층 11~17% 손실 (서울대 실측)", font=F(38), fill=(255, 220, 120), anchor="mm")
d.text((W//2, 218), "수분 10% · 탄력 20% 감소, 항균력까지 소실", font=F(30, False), fill=WHITE, anchor="mm")
d.text((W//2, 266), "긁다 번 상처 → 봉와직염 입원 사례까지", font=F(30, False), fill=(255, 190, 190), anchor="mm")

d.line([(60, 336), (W-60, 336)], fill=(70, 80, 95), width=3)
d.text((W//2, 380), "겨울 가려움의 3대 범인", font=F(50), fill=WHITE, anchor="mm")

rows = [
    ("범인 1", "때밀이·스크럽", "살아 있는 각질층을 긁어냄 — 재생 늦어짐", RED),
    ("범인 2", "뜨거운 물 샤워", "유분막을 녹임 — 미온수 8~10분이 안전선", ORANGE),
    ("범인 3", "샤워 후 방치", "3분 지나면 건조 시작 (질병관리청)", ORANGE),
]

y = 424
for badge, title, desc, color in rows:
    card_h = 140
    d.rounded_rectangle([60, y, W-60, y+card_h], radius=22, fill=CARD, outline=color, width=4)
    d.rounded_rectangle([92, y+24, 92+120, y+24+54], radius=12, fill=color)
    d.text((92+60, y+24+27), badge, font=F(34), fill=(20, 24, 30), anchor="mm")
    d.text((236, y+52), title, font=F(38), fill=WHITE, anchor="lm")
    d.text((92, y+116), desc, font=F(28, False), fill=GRAY, anchor="lm")
    y += card_h + 14

# 골든타임 박스
y += 4
d.rounded_rectangle([60, y, W-60, y+190], radius=22, fill=CARD, outline=GREEN, width=4)
d.text((92, y+40), "샤워 후 3분 골든타임", font=F(38), fill=GREEN, anchor="lm")
d.text((92, y+96), "물기 남긴 채 눌러 닦고 → 3분 안에 보습제", font=F(31), fill=WHITE, anchor="lm")
d.text((92, y+142), "하루 2~3회 덧바르기 · 성인 기준 1주 250g (질병관리청)", font=F(29, False), fill=GRAY, anchor="lm")

# 성분 비교 박스
y += 228
d.rounded_rectangle([60, y, W-60, y+320], radius=22, fill=CARD, outline=BLUE, width=4)
d.text((92, y+40), "세라마이드 vs 우레아 vs 판테놀", font=F(38), fill=BLUE, anchor="lm")
lines = [
    ("세라마이드", "장벽 몰타르 보충 — 푸석한 피부", BLUE),
    ("우레아 10%", "수분 흡수+각질 정리 — 딱딱한 정강이", GOLD),
    ("판테놀 5%", "손상 회복 보조 — 긁은 자리·자극 피부", GREEN),
    ("선택 팁", "로션보다 크림·연고가 밀폐력 우수", WHITE),
]
ly = y + 80
for tag, desc, color in lines:
    d.rounded_rectangle([92, ly, 92+200, ly+50], radius=12, fill=(35, 45, 60))
    d.text((92+100, ly+25), tag, font=F(27), fill=color, anchor="mm")
    d.text((330, ly+25), desc, font=F(27, False), fill=WHITE, anchor="lm")
    ly += 52

# 실내 환경 박스
y += 356
d.rounded_rectangle([60, y, W-60, y+136], radius=22, fill=CARD, outline=GOLD, width=4)
d.text((92, y+38), "실내 습도 40~50%까지가 기본 세팅", font=F(36), fill=GOLD, anchor="lm")
d.text((92, y+82), "난방 실내는 매우 건조 (질병관리청 한파대비 수칙)", font=F(29, False), fill=WHITE, anchor="lm")
d.text((92, y+118), "가습기·젖은 수건 + 면 소재 내의가 정답", font=F(29, False), fill=GREEN, anchor="lm")

# 결론 박스
d.rounded_rectangle([60, H-300, W-60, H-170], radius=22, fill=(30, 45, 35), outline=GREEN, width=4)
d.text((W//2, H-262), "미온수 짧게 · 3분 안에 넉넉히 · 하루 2~3회", font=F(36), fill=GREEN, anchor="mm")
d.text((W//2, H-208), "갈라짐·진물 지속은 2차 감염 신호 → 피부과", font=F(28, False), fill=GRAY, anchor="mm")

# 하단 CTA
d.text((W//2, H-96), "성분 비교표·바디로션 랭킹 전체 → 프로필 링크", font=F(38), fill=WHITE, anchor="mm")
d.text((W//2, H-40), "따져봄 ttajyeobom.com | 출처: 질병관리청·서울대병원·미국피부과학회(AAD)·국민건강지식센터", font=F(22, False), fill=GRAY, anchor="mm")

img.save("/workspace/downloads/threads_dry_skin_infographic.png")
print("saved", img.size)
