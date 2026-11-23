"""Measure card grid + badge detail in the browse mockup."""
import os

from PIL import Image

SRC = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\qb.png"
OUT = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\inspect"

im = Image.open(SRC).convert("RGB")

for name, (l, t, r, b) in {
    "browse_row1": (140, 190, 475, 355),
    "browse_row2": (140, 355, 475, 510),
    "browse_badges": (147, 330, 232, 355),
}.items():
    c = im.crop((l, t, r, b))
    c = c.resize((c.width * 3, c.height * 3), Image.LANCZOS)
    c.save(os.path.join(OUT, name + ".png"))
    print(name, c.size)

# scan for card photo edges: look for white-card gaps along a row through the photos
y = 220
runs = []
prev_white = None
for x in range(140, 476):
    p = im.getpixel((x, y))
    is_white = p[0] > 235 and p[1] > 235 and p[2] > 240
    if is_white != prev_white:
        runs.append((x, "white" if is_white else "photo"))
        prev_white = is_white
print("edge transitions at y=220:", runs)

# vertical extent of row-1 photos at x=180
col = []
prev = None
for y in range(190, 260):
    p = im.getpixel((180, y))
    is_white = p[0] > 235 and p[1] > 235 and p[2] > 240
    if is_white != prev:
        col.append((y, "white" if is_white else "photo"))
        prev = is_white
print("vertical transitions at x=180:", col)

# badge colors precisely
for x, y in [(160, 340), (185, 340), (205, 340), (160, 336), (185, 345)]:
    print(f"badge ({x},{y})", "#%02x%02x%02x" % im.getpixel((x, y)))
