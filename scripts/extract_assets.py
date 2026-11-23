"""Extract usable image assets from the reference mockup into public/assets/.

The mockup is a 516x734 screenshot of the target design. Photos are small, so
every crop is upscaled 3x with Lanczos to stay presentable at render size.
"""
import os

from PIL import Image, ImageFilter

SRC = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\qa.png"
OUT = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\public\assets"

os.makedirs(OUT, exist_ok=True)
im = Image.open(SRC).convert("RGB")

SCALE = 3


def save(name, box, sharpen=True):
    c = im.crop(box)
    c = c.resize((c.width * SCALE, c.height * SCALE), Image.LANCZOS)
    if sharpen:
        c = c.filter(ImageFilter.UnsharpMask(radius=2, percent=80, threshold=2))
    c.save(os.path.join(OUT, name), quality=92)
    print(f"{name:22s} {c.size}")


# Hero: modern house at dusk (right side of hero, above the baked search bar)
save("hero-house.jpg", (267, 55, 516, 199))

# Hero: palm trees top-left (clean band above the baked headline)
save("hero-palms.jpg", (0, 55, 95, 106), sharpen=False)

# Popular Locations card photos
save("loc-colombo.jpg", (30, 337, 142, 402))
save("loc-kandy.jpg", (153, 337, 262, 402))
save("loc-gampaha.jpg", (274, 337, 384, 402))
save("loc-galle.jpg", (396, 337, 506, 402))

# CTA banner house illustration (banner purple baked in; blends over matching CSS gradient)
save("cta-house.png", (272, 578, 420, 644), sharpen=False)

print("banner bg colors for CSS blending:")
for x, y in [(275, 582), (275, 640), (415, 582), (415, 640), (350, 645), (270, 610)]:
    print(f"  ({x},{y}) #%02x%02x%02x" % im.getpixel((x, y)))
