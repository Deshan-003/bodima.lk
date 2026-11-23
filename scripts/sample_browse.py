"""Sample violet button surfaces + extract 6 listing photos (patching out baked hearts)."""
import os

from PIL import Image, ImageFilter

SRC = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\qb.png"
OUT = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\public\assets"

im = Image.open(SRC).convert("RGB")

def hexat(x, y):
    return "#%02x%02x%02x" % im.getpixel((x, y))

print("search button:", [hexat(x, y) for x, y in [(395, 122), (415, 125), (420, 130), (430, 135)]])
print("apply button:", [hexat(x, y) for x, y in [(60, 505), (85, 512), (110, 515), (50, 512)]])
print("pagination active:", [hexat(x, y) for x, y in [(283, 520), (288, 525), (290, 530)]])
print("slider track:", [hexat(x, y) for x, y in [(80, 300), (100, 300), (110, 301)]])
print("card title:", [hexat(x, y) for x, y in [(155, 288), (165, 289), (175, 290)]])
print("price:", [hexat(x, y) for x, y in [(152, 327), (160, 328), (170, 329)]])
print("select border:", [hexat(x, y) for x, y in [(30, 220), (125, 230)]])
print("hero grad:", [(x, y, hexat(x, y)) for x, y in [(10, 40), (240, 40), (470, 40), (240, 150), (10, 150), (470, 150)]])

# --- extract listing photos, patching the baked heart with a mirrored patch ---
CARDS = {
    "listing-colombo.jpg": (147, 201, 247, 274),
    "listing-wellawatte.jpg": (258, 201, 358, 274),
    "listing-kandy.jpg": (369, 201, 469, 274),
    "listing-gampaha.jpg": (147, 362, 247, 428),
    "listing-nugegoda.jpg": (258, 362, 358, 428),
    "listing-moratuwa.jpg": (369, 362, 469, 428),
}

SCALE = 4
for name, (l, t, r, b) in CARDS.items():
    c = im.crop((l, t, r, b))
    # patch the top-right heart: mirror the patch immediately to its left over it
    w, h = c.size
    hx0, hy0 = w - 26, 2
    hx1, hy1 = w - 2, 26
    src_patch = c.crop((hx0 - 26, hy0, hx1 - 26, hy1)).transpose(Image.FLIP_LEFT_RIGHT)
    src_patch = src_patch.filter(ImageFilter.GaussianBlur(1.2))
    c.paste(src_patch, (hx0, hy0))
    c = c.resize((c.width * SCALE, c.height * SCALE), Image.LANCZOS)
    c = c.filter(ImageFilter.UnsharpMask(radius=2, percent=70, threshold=2))
    c.save(os.path.join(OUT, name), quality=92)
    print(name, c.size)
