"""Inspect the Sign Up mockup: half panels, form zoom, and color samples."""
import os

from PIL import Image

SRC = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\signup.png"
OUT = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\inspect"

im = Image.open(SRC).convert("RGB")

for name, box, scale in [
    ("su_overview", (0, 0, 1536, 1024), 0.55),
    ("su_left", (0, 0, 768, 1024), 1.0),
    ("su_right", (768, 0, 1536, 1024), 1.0),
    ("su_form", (860, 130, 1480, 950), 1.0),
]:
    c = im.crop(box)
    if scale != 1.0:
        c = c.resize((int(c.width * scale), int(c.height * scale)), Image.LANCZOS)
    c.save(os.path.join(OUT, name + ".png"))
    print(name, c.size)

def hexat(x, y):
    return "#%02x%02x%02x" % im.getpixel((x, y))

pts = {
    "left_bg_top": (100, 60),
    "left_bg_mid": (380, 500),
    "left_bg_bottom": (700, 950),
    "right_bg": (1300, 60),
    "card_bg": (1100, 400),
    "heading": (1000, 220),
    "input_bg": (1000, 400),
    "primary_btn": (1200, 800),
    "link": (900, 900),
}
for k, (x, y) in pts.items():
    print(f"{k:16s} {hexat(x,y)}")
