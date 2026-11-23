"""Precise color sampling at verified spots in the mockup."""
from PIL import Image

im = Image.open(r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\qa.png").convert("RGB")

def hexat(x, y):
    return "#%02x%02x%02x" % im.getpixel((x, y))

pts = {
    "login_pill_bg": (425, 27),
    "signup_btn_bg": (459, 22),
    "signup_btn_bg2": (490, 30),
    "search_btn_yellow": (447, 217),
    "search_btn_yellow2": (450, 210),
    "stay_yellow_a": (215, 125),
    "stay_yellow_b": (222, 122),
    "why_card_bg_a": (150, 530),
    "why_card_bg_b": (60, 545),
    "why_card_bg_c": (300, 540),
    "cta_purple_right_low": (320, 640),
    "cta_purple_mid": (250, 600),
    "footer_bg_mid": (300, 690),
    "footer_bottom_strip": (258, 730),
    "hero_sky_right": (400, 62),
    "hero_sky_mid": (300, 60),
    "hero_top_left2": (10, 60),
    "hero_bottom_mid_ground": (100, 250),
    "locations_card_label_area": (80, 418),
    "see_all": (478, 320),
    "see_all2": (475, 318),
    "nav_text": (355, 27),
    "header_logo_dark": (185, 27),
    "features_icon": (62, 277),
    "divider_footer": (258, 712),
}
for k, (x, y) in pts.items():
    print(f"{k:26s} {hexat(x,y)}")
