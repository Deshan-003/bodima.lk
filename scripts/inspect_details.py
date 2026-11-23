"""Inspect the property-details mockup: broad region crops + color grid."""
import os

from PIL import Image

SRC = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\details.png"
OUT = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\inspect"

im = Image.open(SRC).convert("RGB")

for name, (l, t, r, b) in {
    "details_top": (0, 0, 507, 290),
    "details_bottom": (0, 280, 507, 567),
    "details_header": (0, 0, 507, 42),
}.items():
    c = im.crop((l, t, r, b))
    c = c.resize((c.width * 3, c.height * 3), Image.LANCZOS)
    c.save(os.path.join(OUT, name + ".png"))
    print(name, c.size)

def hexat(x, y):
    return "#%02x%02x%02x" % im.getpixel((x, y))

for y in [3, 20, 38, 50, 90, 150, 200, 260, 300, 360, 420, 480, 540]:
    print(y, " ".join(f"{x}:{hexat(x, y)}" for x in [10, 100, 250, 400, 495]))
