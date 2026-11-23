"""Second-pass inspection: features strip, footer bottom, and exact color sampling."""
import os

from PIL import Image

SRC = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\qa.png"
OUT = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\inspect"

im = Image.open(SRC).convert("RGB")

# --- extra inspection crops ---
for name, (l, t_, r, b) in {
    "features": (0, 255, 516, 312),
    "bottom_bar": (0, 695, 516, 734),
}.items():
    c = im.crop((l, t_, r, b))
    c = c.resize((c.width * 3, c.height * 3), Image.LANCZOS)
    c.save(os.path.join(OUT, name + ".png"))

# --- color sampling ---
def hexat(x, y):
    p = im.getpixel((x, y))
    return "#%02x%02x%02x" % p

samples = {
    "top_strip_above_header": (258, 3),
    "header_bg": (258, 30),
    "login_pill": (430, 27),
    "signup_pill": (475, 27),
    "hero_top_left": (30, 65),
    "hero_top_right": (500, 62),
    "hero_mid_left": (20, 130),
    "hero_bottom_left": (15, 250),
    "hero_bottom_right": (500, 252),
    "hero_gradient_top_center": (200, 60),
    "hero_bottom_center": (260, 255),
    "features_bg": (258, 281),
    "features_icon_circle": (68, 280),
    "page_bg_locations": (258, 318),
    "card_lavender_bg": (80, 415),
    "why_card_bg": (100, 520),
    "cta_left": (40, 610),
    "cta_right": (470, 610),
    "explore_btn": (445, 610),
    "footer_bg": (258, 700),
    "footer_deep": (60, 725),
    "headline_white": (45, 125),
    "stay_yellow": (230, 128),
    "search_btn_yellow": (455, 219),
    "title_dark": (35, 320),
    "see_all_link": (480, 319),
}
for k, (x, y) in samples.items():
    print(f"{k:28s} {hexat(x,y)}")
