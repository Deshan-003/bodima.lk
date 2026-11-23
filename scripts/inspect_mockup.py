"""Crop key regions of the reference mockup (3x upscaled) for visual inspection."""
import os

from PIL import Image

SRC = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\qa.png"
OUT = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\inspect"

os.makedirs(OUT, exist_ok=True)
t = os.path.join(OUT, "t.txt")
if os.path.exists(t):
    os.remove(t)

im = Image.open(SRC).convert("RGB")

REGIONS = {
    "header": (0, 0, 516, 55),
    "hero_full": (0, 50, 516, 265),
    "locations": (0, 300, 516, 430),
    "why_choose": (0, 440, 516, 575),
    "cta": (0, 570, 516, 665),
    "footer": (0, 660, 516, 734),
}

for name, (l, t_, r, b) in REGIONS.items():
    c = im.crop((l, t_, r, b))
    c = c.resize((c.width * 3, c.height * 3), Image.LANCZOS)
    c.save(os.path.join(OUT, name + ".png"))

print("saved:", sorted(os.listdir(OUT)))
