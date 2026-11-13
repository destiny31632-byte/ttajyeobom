#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 64번째 겨울 젖은 신발·부츠 관리 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1920
FONT = "/usr/share/fonts/pickle-hwp/NotoSansCJKkr-Bold.otf"
FONT_R = "/usr/share/fonts/pickle-hwp/NotoSansCJKkr-Regular.otf"
try:
    ImageFont.truetype(FONT, 20)
except OSError:
    FONT = FONT_R


def F(sz, bold=True):
    return ImageFont.truetype(FONT if bold else FONT_R, sz)


BG = (8, 10, 16)
CARD = (24, 27, 36)
RED = (255, 62, 62)
DEEP = (30, 14, 20)
AMBER = (255, 176, 32)
BLUE = (86, 168, 255)
GREEN = (60, 205, 145)
WHITE = (246, 248, 252)
GRAY = (176, 184, 198)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# 상단 레드 경고 배지
d.rectangle([0, 0, W, 360], fill=DEEP)
d.rounded_rectangle([60, 38, 60 + 900, 38 + 66], radius=14, fill=RED)
d.text((60 + 450, 38 + 33), "젖은 신발 드라이기로 말리면 밑창 들뜹니다 ⚠️", font=F(29), fill=(22, 4, 4), anchor="mm")
d.text((W // 2, 190), "드라이어 토출 공기 45℃에서 108℃", font=F(34), fill=GRAY, anchor="mm")
d.text((W // 2, 276), "생가죽 콜라겐은 60℃부터 수축합니다", font=F(34), fill=(255, 178, 120), anchor="mm")

# 히어로: 신발 속 습도
d.text((W // 2, 420), "신발 속은 이미 곰팡이 온실입니다", font=F(26, False), fill=GRAY, anchor="mm")
d.text((W // 2, 512), "습도 75.8% → 96.6%", font=F(66), fill=RED, anchor="mm")
d.text((W // 2, 590), "곰팡이 발아 기준 80% · 슬리퍼 47.1%에서 무좀균", font=F(25, False), fill=GRAY, anchor="mm")

# 카드 1: 숫자 3개
y = 640
d.rounded_rectangle([56, y, W - 56, y + 268], radius=26, fill=CARD)
d.text((96, y + 24), "겨울 신발이 망가지는 3가지 경로", font=F(27), fill=GRAY)
d.text((96, y + 74), "① 드라이어 열 → 접착제 연화·가죽 수축 18~41%", font=F(28), fill=AMBER)
d.text((96, y + 124), "② 신발 속 습도 → 곰팡이·무좀균 번식", font=F(28), fill=WHITE)
d.text((96, y + 174), "③ 염화칼슘 → 조해성으로 가죽 유분 빼앗아 경화", font=F(27), fill=RED)
d.text((96, y + 224), "소비자원 어그부츠 피해 134건 중 53건이 세탁·경화", font=F(23, False), fill=GRAY)

# 카드 2: 3초 비교
y = 940
d.rounded_rectangle([56, y, W - 56, y + 400], radius=26, fill=CARD)
d.text((96, y + 24), "3초 결론: 오늘 살 3개 (2026-11-13 쿠팡)", font=F(26), fill=GRAY)
rows = [
    ("크린포유 UV 살균 타이머 건조기", "25,900원 · 50℃ 건조 · 후기 567", GREEN),
    ("안젖소 신발 방수 스프레이 200ml", "12,000원 · 후기 8,538 · 눈길 방어", AMBER),
    ("일리마 제습 탈취 팩 75g 4개", "8,530원 · 무향 · 한 달에 한 번 재사용", BLUE),
]
yy = y + 82
for name, desc, col in rows:
    d.text((96, yy), name, font=F(27), fill=WHITE)
    d.text((96, yy + 36), desc, font=F(22, False), fill=col)
    yy += 102

# 카드 3: 순서
y = 1366
d.rounded_rectangle([56, y, W - 56, y + 238], radius=26, fill=CARD)
d.text((96, y + 22), "재료보다 순서가 먼저입니다", font=F(26), fill=GRAY)
d.text((96, y + 66), "마른 솔로 염분 털기 → 물티슈 금지", font=F(28), fill=WHITE)
d.text((96, y + 112), "깔창·끈 분리 → 45~55℃로 나눠 건조", font=F(28), fill=WHITE)
d.text((96, y + 158), "완전 건조 후 방수 스프레이, 보관은 제습 팩", font=F(26, False), fill=GREEN)
d.text((96, y + 202), "UV는 표면만 · 45~55℃는 균을 죽이지 못합니다", font=F(23, False), fill=RED)

# 하단 스트립
d.rectangle([0, 1636, W, H], fill=DEEP)
d.text((W // 2, 1692), "신발 살리는 순서", font=F(30), fill=(255, 196, 120), anchor="mm")
d.text((W // 2, 1752), "가죽 부츠 = 열 끄고 그늘 · 운동화 = 저온 건조", font=F(26), fill=WHITE, anchor="mm")
d.text((W // 2, 1804), "무좀균 포자는 80℃에서도 3.2~4.4분을 버팁니다", font=F(26), fill=WHITE, anchor="mm")
d.text((W // 2, 1868), "실측 가격·비교표는 프로필 링크", font=F(24, False), fill=(235, 200, 180), anchor="mm")

img.save("/workspace/downloads/winter_shoes_threads_infographic.png", "PNG")
print("saved", img.size)
