"""Inspect the Browse-page mockup: region crops at 3x + color sampling."""
import os

from PIL import Image

SRC = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\qb.png"
OUT = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\inspect"

im = Image.open(SRC).convert("RGB")

for name, (l, t, r, b) in {
    "browse_header": (0, 0, 481, 40),
    "browse_hero": (0, 30, 481, 165),
    "browse_sidebar": (0, 160, 140, 561),
    "browse_results_head": (140, 160, 481, 200),
    "browse_card1": (140, 195, 255, 330),
    "browse_card2": (222, 195, 340, 330),
    "browse_pagination": (230, 505, 350, 545),
}.items():
    c = im.crop((l, t, r, b))
    c = c.resize((c.width * 3, c.height * 3), Image.LANCZOS)
    c.save(os.path.join(OUT, name + ".png"))
    print(name, c.size)

def hexat(x, y):
    return "#%02x%02x%02x" % im.getpixel((x, y))

pts = {
    "hero_left_top": (30, 45),
    "hero_right_top": (450, 45),
    "hero_center": (240, 55),
    "hero_bottom": (240, 130),
    "search_btn": (400, 127),
    "search_btn2": (405, 130),
    "page_bg": (300, 170),
    "sidebar_title": (30, 185),
    "apply_btn": (63, 508),
    "reset_btn": (63, 538),
    "slider_track": (60, 297),
    "slider_handle": (120, 297),
    "price_text": (90, 285),
    "results_title": (160, 182),
    "card_title_text": (160, 287),
    "card_price_text": (160, 328),
    "badge_green": (170, 341),
    "badge2": (215, 341),
    "pagination_active": (285, 525),
    "heart_circle": (232, 217),
    "sort_text": (395, 182),
    "location_pin_text": (165, 305),
}
for k, (x, y) in pts.items():
    print(f"{k:22s} {hexat(x,y)}")
