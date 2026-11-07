#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 48번째 라텍스 위 온열매트 축열 화재 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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


BG = (12, 14, 18)
CARD = (26, 30, 38)
RED = (255, 70, 70)
DEEP = (130, 16, 16)
AMBER = (255, 176, 32)
WHITE = (245, 247, 250)
GRAY = (168, 176, 188)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# 상단 경고 배너
d.rectangle([0, 0, W, 316], fill=DEEP)
d.rounded_rectangle([70, 38, 70 + 330, 38 + 62], radius=14, fill=RED)
d.text((70 + 165, 38 + 31), "소방청·소비자원 경고", font=F(30), fill=(20, 10, 10), anchor="mm")
d.text((W // 2, 158), "라텍스 침대 위 온열매트", font=F(63), fill=WHITE, anchor="mm")
d.text((W // 2, 238), "300만원 태워먹는 조합", font=F(63), fill=(255, 196, 120), anchor="mm")

# 온도 히어로
d.text((W // 2, 400), "8시간 실험, 라텍스 베개 표면", font=F(34, False), fill=GRAY, anchor="mm")
d.text((W // 2, 505), "100℃", font=F(160), fill=RED, anchor="mm")
d.text((W // 2, 610), "전기용품안전기준 발열체 허용선은 95℃", font=F(33), fill=WHITE, anchor="mm")

d.line([(70, 668), (W - 70, 668)], fill=(70, 78, 92), width=3)

# 팩트 카드 3개
rows = [
    ("01", "라텍스는 열을 쌓는다", "흡수는 빠르고 배출은 느림 — 소방청 '라텍스 매트 위 사용 금지'", RED),
    ("02", "안전사고 4,154건", "전기장판·전기요 2,666건(64.2%) · 온수매트 684건(16.5%)", AMBER),
    ("03", "취침은 37℃ 이하", "44℃부터 표피 화상 · 2도 화상 사례 63.1%", (90, 170, 255)),
]

y = 708
card_h = 196
for badge, title, desc, color in rows:
    d.rounded_rectangle([60, y, W - 60, y + card_h], radius=22, fill=CARD, outline=color, width=4)
    d.rounded_rectangle([92, y + 30, 92 + 92, y + 30 + 56], radius=12, fill=color)
    d.text((92 + 46, y + 30 + 28), badge, font=F(30), fill=(16, 18, 22), anchor="mm")
    d.text((212, y + 62), title, font=F(44), fill=WHITE, anchor="lm")
    d.text((92, y + 148), desc, font=F(26, False), fill=GRAY, anchor="lm")
    y += card_h + 18

# 하단 경고 박스
by = y + 18
d.rounded_rectangle([60, by, W - 60, by + 250], radius=22, fill=(52, 16, 16), outline=RED, width=4)
d.text((92, by + 42), "불이 나면 매트 값으로 안 끝난다", font=F(36), fill=(255, 200, 200), anchor="lm")
d.text((92, by + 108), "세입자 구상금 32,487,985원 판결", font=F(42), fill=WHITE, anchor="lm")
d.text((92, by + 166), "제조사는 '축열은 사용자 과실'이라며 보상 거부", font=F(27, False), fill=GRAY, anchor="lm")
d.text((92, by + 210), "라텍스·메모리폼 위에는 열선 매트를 깔지 마세요", font=F(29), fill=(255, 170, 150), anchor="lm")

# 푸터
d.line([(70, 1770), (W - 70, 1770)], fill=(70, 78, 92), width=3)
d.text((W // 2, 1822), "따져봄 | 겨울 난방·안전 팩트 가이드", font=F(34), fill=WHITE, anchor="mm")
d.text((W // 2, 1872), "상세 비교표는 프로필 링크 ttajyeobom.com", font=F(27, False), fill=GRAY, anchor="mm")

img.save("/workspace/downloads/mat_fire_threads_infographic.png", "PNG")
print("saved", img.size)
