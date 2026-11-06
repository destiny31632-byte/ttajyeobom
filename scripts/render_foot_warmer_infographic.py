#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 46번째 겨울 발 시림·풋워머 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
d.text((W//2, 62), "두꺼운 수면양말, 왜 발을 더 시리게 할까?", font=F(43), fill=WHITE, anchor="mm")
d.text((W//2, 138), "땀을 못 흡수해서다 — 기화열이 발바닥 체온을 뺏는다", font=F(37), fill=(255, 220, 120), anchor="mm")
d.text((W//2, 208), "오늘 아침 서울 영하 1도·체감 영하 4도 첫 영하권 —", font=F(29, False), fill=WHITE, anchor="mm")
d.text((W//2, 256), "방치한 발 시림은 레이노증후군 괴사 경고까지 간다", font=F(29, False), fill=(255, 190, 190), anchor="mm")

d.line([(60, 336), (W-60, 336)], fill=(70, 80, 95), width=3)
d.text((W//2, 382), "발 보온, 무엇으로 해결하나", font=F(48), fill=WHITE, anchor="mm")

rows = [
    ("폴리에스터 양말", "땀 흡수 못함 → 기화열 참사", "습기 오래 지속 시 무좀·습진 위험까지", RED),
    ("메리노울 양말", "무게의 30%까지 습기 흡수", "수분 버퍼링 폴리에스터 대비 96% 우수", GREEN),
    ("발열 깔창", "발바닥 직접 발열, 즉효", "표면 39~64℃ 편차 — 37℃ 이하로 쓴다", BLUE),
    ("온열 풋워머", "책상 아래 공간 난방", "77~155W급, 월 전기요금 2천원대부터", ORANGE),
]

y = 424
card_h = 130
for badge, title, desc, color in rows:
    d.rounded_rectangle([60, y, W-60, y+card_h], radius=22, fill=CARD, outline=color, width=4)
    d.rounded_rectangle([92, y+22, 92+196, y+22+52], radius=12, fill=color)
    d.text((92+98, y+22+26), badge, font=F(28), fill=(20, 24, 30), anchor="mm")
    d.text((316, y+48), title, font=F(30), fill=WHITE, anchor="lm")
    d.text((92, y+110), desc, font=F(25, False), fill=GRAY, anchor="lm")
    y += card_h + 10

# 수족냉증 경고 박스
y += 14
by = y
d.rounded_rectangle([60, by, W-60, by+230], radius=22, fill=CARD, outline=GOLD, width=4)
d.text((92, by+40), "수족냉증 방치 체크 (전 인구 12%)", font=F(34), fill=GOLD, anchor="lm")
steps = [
    "① 손발가락 하얗게→파랗게→붉게 3단계 색 변화",
    "② 찌릿한 통증 동반 시 레이노증후군 의심",
    "③ 방치하면 피부궤양·피부괴사 경고(류마티스내과)",
]
sy = by + 92
for s in steps:
    d.text((92, sy), s, font=F(27, False), fill=WHITE, anchor="lm")
    sy += 46

# 동상 위험 박스
ey = by + 246
d.rounded_rectangle([60, ey, W-60, ey+200], radius=22, fill=(30, 20, 20), outline=RED, width=4)
d.text((92, ey+36), "두꺼운 양말+꽉 낀 신발의 대가 (질병관리청)", font=F(31), fill=RED, anchor="lm")
d.text((92, ey+88), "신발 속 습도 상승 → 동상 위험 증가", font=F(28), fill=WHITE, anchor="lm")
d.text((92, ey+136), "땀 배출 잘되는 적당한 두께 양말이 정답", font=F(28), fill=(255, 220, 120), anchor="lm")
d.text((92, ey+180), "동상 괴사 노출 시 5~6시간 내 조직 손상 경고", font=F(25, False), fill=WHITE, anchor="lm")

# 전기요금 박스
cy = ey + 216
d.rounded_rectangle([60, cy, W-60, cy+140], radius=22, fill=(20, 40, 30), outline=GREEN, width=4)
d.text((92, cy+34), "발 보온 기기 전기요금 (1단계 120.0원/kWh)", font=F(30), fill=GREEN, anchor="lm")
d.text((92, cy+82), "데스크매트 77W 월 2,218원 · 파티션 155W 월 2,790원", font=F(27, False), fill=WHITE, anchor="lm")
d.text((92, cy+122), "누진 3단계(307.3원/kWh) 진입 시 2.6배 — 구간 확인 먼저", font=F(25, False), fill=WHITE, anchor="lm")

# 화재 경고 박스
fy = cy + 156
d.rounded_rectangle([60, fy, W-60, fy+130], radius=22, fill=(30, 20, 20), outline=RED, width=4)
d.text((92, fy+34), "최근 3년 전기난로·전기장판 화재 1,403건", font=F(30), fill=RED, anchor="lm")
d.text((92, fy+80), "가연물 근접 49% · 타이머·플러그 뽑기 필수", font=F(27, False), fill=WHITE, anchor="lm")
d.text((92, fy+112), "사망 21명·부상 142명 — 무인 가동 금지", font=F(25, False), fill=(255, 190, 190), anchor="lm")

# 하단 CTA
d.rectangle([0, H-160, W, H], fill=(140, 20, 20))
d.text((W//2, H-108), "메리노울 vs 발열 깔창 vs 풋워머 정면 비교표", font=F(33), fill=WHITE, anchor="mm")
d.text((W//2, H-52), "프로필 링크 @kkkyy.ya — 따져봄 ttajyeobom.com", font=F(29), fill=(255, 220, 120), anchor="mm")

img.save("/workspace/downloads/foot_warmer_threads_infographic.png", quality=95)
print("saved")
