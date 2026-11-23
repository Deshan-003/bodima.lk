"""Final color sampling for the signup page."""
from PIL import Image

im = Image.open(r"C:\Users\hdgan\OneDrive\Desktop\Bodima.lk\reference\signup.png").convert("RGB")

def hexat(x, y):
    return "#%02x%02x%02x" % im.getpixel((x, y))

print("left gradient at x=100:")
for y in range(0, 1024, 128):
    print(" ", y, hexat(100, y))
print("left gradient at x=400:")
for y in range(0, 1024, 128):
    print(" ", y, hexat(400, y))

for k, (x, y) in {
    "form_card_bg": (1150, 200),
    "input_name_bg": (1100, 345),
    "input_email_bg": (1100, 435),
    "active_tab_fill": (1010, 225),
    "inactive_tab_fill": (1210, 225),
    "signup_button": (1150, 835),
    "page_bg_right": (1450, 500),
}.items():
    print(f"{k:20s} {hexat(x,y)}")
