#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 36번째 전기요·전기장판 화재 안전 가이드 쓰레드 인포그래픽 (9:16, 1080x1920)
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
d.text((W//2, 62), "소방청 통계 겨울 난방 화재 1위", font=F(60), fill=WHITE, anchor="mm")
d.text((W//2, 148), "난방용품 화재의 64.2%가 전기장판·전기요", font=F(44), fill=(255, 220, 120), anchor="mm")
d.text((W//2, 218), "최근 5년 4,154건 중 2,666건 (소방청)", font=F(30, False), fill=WHITE, anchor="mm")
d.text((W//2, 266), "10년간 사망 47명 · 부상 263명", font=F(30, False), fill=(255, 190, 190), anchor="mm")

d.line([(60, 336), (W-60, 336)], fill=(70, 80, 95), width=3)
d.text((W//2, 390), "이 조합, 절대 금지", font=F(52), fill=WHITE, anchor="mm")

rows = [
    ("위험 1", "라텍스 매트리스 위", "3시간 만에 내부 100도 (경남소방 실험)", RED),
    ("위험 2", "두꺼운 이불 겹쳐 깔기", "열 못 빠져나가 축열 발화", ORANGE),
    ("위험 3", "접어서 사용·보관", "열선 꺾임 → 합선·화재", ORANGE),
]

y = 448
for badge, title, desc, color in rows:
    card_h = 150
    d.rounded_rectangle([60, y, W-60, y+card_h], radius=22, fill=CARD, outline=color, width=4)
    d.rounded_rectangle([92, y+24, 92+110, y+24+54], radius=12, fill=color)
    d.text((92+55, y+24+27), badge, font=F(34), fill=(20, 24, 30), anchor="mm")
    d.text((226, y+52), title, font=F(38), fill=WHITE, anchor="lm")
    d.text((92, y+116), desc, font=F(29, False), fill=GRAY, anchor="lm")
    y += card_h + 16

# 저온화상 박스
y += 6
d.rounded_rectangle([60, y, W-60, y+230], radius=22, fill=CARD, outline=BLUE, width=4)
d.text((92, y+40), "저온화상 — 통증 없이 조직 괴사까지", font=F(36), fill=BLUE, anchor="lm")
d.text((92, y+106), "42~43도에 1시간 이상이면 발생", font=F(33), fill=WHITE, anchor="lm")
d.text((92, y+158), "3년간 전기장판 화상 902건 · 2도 화상 63%", font=F(29, False), fill=GRAY, anchor="lm")
d.text((92, y+200), "예방: 1단계 저온 + 시간예약 + 20분마다 자세", font=F(29, False), fill=GREEN, anchor="lm")
y += 250

# 전자파 팩트 박스
d.rounded_rectangle([60, y, W-60, y+318], radius=22, fill=CARD, outline=GREEN, width=4)
d.text((92, y+42), "'무전자파' 광고, 이렇게 거르세요", font=F(38), fill=GREEN, anchor="lm")
lines = [
    ("KC 인증", "의무 기준 — 자기장 833mG 이하", BLUE),
    ("EMF 인증", "자율 — 2mG, 의무 기준의 1/400", GOLD),
    ("담요 깔기", "자기장 약 50% 감소 (국파연 실측)", GREEN),
    ("차단 스티커·숫돌", "효과 없음 (19종 전수 무효)", RED),
]
ly = y + 92
for tag, desc, color in lines:
    d.rounded_rectangle([92, ly, 330, ly+50], radius=12, fill=(35, 45, 60))
    d.text((211, ly+25), tag, font=F(28), fill=color, anchor="mm")
    d.text((350, ly+25), desc, font=F(27, False), fill=WHITE, anchor="lm")
    ly += 60

# 결론 박스
d.rounded_rectangle([60, H-300, W-60, H-170], radius=22, fill=(30, 45, 35), outline=GREEN, width=4)
d.text((W//2, H-262), "라텍스 금지 · 저온+타이머 · 말아서 보관", font=F(38), fill=GREEN, anchor="mm")
d.text((W//2, H-208), "외출·취침 전 전원 차단은 무조건 (행안부)", font=F(28, False), fill=GRAY, anchor="mm")

# 하단 CTA
d.text((W//2, H-96), "화재 통계·인증 비교표 전체 → 프로필 링크", font=F(38), fill=WHITE, anchor="mm")
d.text((W//2, H-40), "따져봄 ttajyeobom.com | 출처: 소방청·행안부·국립전파연구원·한국소비자원·국표원", font=F(23, False), fill=GRAY, anchor="mm")

img.save("/workspace/downloads/threads_electric_heating_pad_infographic.png")
print("saved", img.size)
