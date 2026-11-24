"""Inspect the Add Property form mockup."""
import os

from PIL import Image

SRC = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\add-property.jpeg"
OUT = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\inspect"

im = Image.open(SRC).convert("RGB")

for name, box, scale in [
    ("ap_overview", (0, 0, 516, 272), 3),
    ("ap_left", (0, 0, 260, 272), 4),
    ("ap_right", (255, 0, 516, 272), 4),
]:
    c = im.crop(box)
    c = c.resize((c.width * scale, c.height * scale), Image.LANCZOS)
    c.save(os.path.join(OUT, name + ".png"))
    print(name, c.size)

def hexat(x, y):
    return "#%02x%02x%02x" % im.getpixel((x, y))

for k, (x, y) in {
    "bg": (250, 130),
    "card": (130, 130),
    "button": (400, 230),
    "input": (350, 120),
}.items():
    print(k, hexat(x, y))
