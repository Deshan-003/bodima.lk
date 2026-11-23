"""Extract the gallery photos from the property-details mockup into public/assets/."""
import os

from PIL import Image, ImageFilter

SRC = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\details.png"
OUT = r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\public\assets"

os.makedirs(OUT, exist_ok=True)
im = Image.open(SRC).convert("RGB")

# (name, box, upscale) - boxes measured from reference/details.png (507x567)
CROPS = [
    ("detail-main.jpg", (20, 62, 250, 260), 4),
    ("detail-thumb-1.jpg", (16, 242, 62, 294), 5),
    ("detail-thumb-2.jpg", (65, 242, 111, 294), 5),
    ("detail-thumb-3.jpg", (114, 242, 160, 294), 5),
]

for name, box, scale in CROPS:
    c = im.crop(box)
    c = c.resize((c.width * scale, c.height * scale), Image.LANCZOS)
    c = c.filter(ImageFilter.UnsharpMask(radius=2, percent=75, threshold=2))
    c.save(os.path.join(OUT, name), quality=92)
    print(name, c.size)
