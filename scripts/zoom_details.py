"""Zoom into details mockup areas to read text precisely."""
import os

from PIL import Image

SRC = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\details.png"
OUT = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\inspect"

im = Image.open(SRC).convert("RGB")

for name, (l, t, r, b), scale in [
    ("d_breadcrumb", (0, 38, 507, 62), 4),
    ("d_thumbs", (10, 235, 260, 300), 5),
    ("d_details", (10, 290, 260, 500), 4),
    ("d_facilities", (10, 470, 260, 567), 4),
    ("d_booking", (250, 90, 500, 360), 4),
    ("d_booking_lower", (250, 340, 500, 567), 4),
]:
    c = im.crop((l, t, r, b))
    c = c.resize((c.width * scale, c.height * scale), Image.LANCZOS)
    c.save(os.path.join(OUT, name + ".png"))
    print(name, c.size)
