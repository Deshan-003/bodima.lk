"""Inspect the redesigned signup mockup (mobile layout)."""
import os

from PIL import Image

SRC = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\signup2.png"
OUT = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\inspect"

im = Image.open(SRC).convert("RGB")

for name, box, scale in [
    ("su2_overview", (0, 0, 462, 753), 2),
    ("su2_top", (0, 0, 462, 250), 3),
    ("su2_mid", (0, 220, 462, 500), 3),
    ("su2_bottom", (0, 470, 462, 753), 3),
]:
    c = im.crop(box)
    c = c.resize((c.width * scale, c.height * scale), Image.LANCZOS)
    c.save(os.path.join(OUT, name + ".png"))
    print(name, c.size)

def hexat(x, y):
    return "#%02x%02x%02x" % im.getpixel((x, y))

for k, (x, y) in {
    "bg_top": (20, 20),
    "bg_mid": (230, 300),
    "bg_bottom": (230, 720),
    "card": (230, 400),
    "button": (230, 640),
}.items():
    print(f"{k:12s} {hexat(x,y)}")
