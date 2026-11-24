"""Inspect the owner dashboard mockup."""
import os

from PIL import Image

SRC = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\owner-dashboard.png"
OUT = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\inspect"

im = Image.open(SRC).convert("RGB")

for name, box, scale in [
    ("od_overview", (0, 0, 561, 402), 2),
    ("od_left", (0, 0, 180, 402), 3),
    ("od_main", (170, 0, 561, 402), 2),
]:
    c = im.crop(box)
    c = c.resize((c.width * scale, c.height * scale), Image.LANCZOS)
    c.save(os.path.join(OUT, name + ".png"))
    print(name, c.size)

def hexat(x, y):
    return "#%02x%02x%02x" % im.getpixel((x, y))

for k, (x, y) in {
    "sidebar_bg": (40, 200),
    "page_bg": (350, 200),
    "card_bg": (400, 150),
    "accent": (500, 100),
}.items():
    print(k, hexat(x, y))
