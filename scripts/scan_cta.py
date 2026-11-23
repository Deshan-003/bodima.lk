from PIL import Image

im = Image.open(r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\qa.png").convert("RGB")

print("yellow pixels near right edge of CTA crop:")
for y in range(578, 646):
    for x in range(396, 420):
        p = im.getpixel((x, y))
        if p[0] > 200 and p[1] > 140 and p[2] < 130:
            print("  yellow at", x, y, p)
            break

print("column 350 bottom rows:")
for y in range(634, 650):
    print("  y", y, im.getpixel((350, y)))
