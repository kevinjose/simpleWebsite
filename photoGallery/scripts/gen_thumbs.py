from PIL import Image, ImageOps
import os

# Change this if you move the image folder
IMAGE_DIR = os.path.join(os.path.dirname(__file__), '..', 'images')
IMAGE_DIR = os.path.abspath(IMAGE_DIR)

MAIN_SUFFIX = '_main.jpg'
THUMB_SUFFIX = '_thumb.jpg'
MAIN_SIZE = 2000
THUMB_SIZE = 300

def is_eligible(filename):
    return filename.lower().endswith('.jpg') and \
           not filename.endswith(MAIN_SUFFIX) and \
           not filename.endswith(THUMB_SUFFIX)

def resize_main(image):
    image.thumbnail((MAIN_SIZE, MAIN_SIZE))
    return image

def make_thumb(image):
    width, height = image.size
    min_dim = min(width, height)
    left = (width - min_dim) // 2
    top = (height - min_dim) // 2
    crop = image.crop((left, top, left + min_dim, top + min_dim))
    return crop.resize((THUMB_SIZE, THUMB_SIZE))

def process_image(filepath):
    base, ext = os.path.splitext(filepath)
    main_path = f"{base}_main.jpg"
    thumb_path = f"{base}_thumb.jpg"

    if os.path.exists(main_path) and os.path.exists(thumb_path):
        return

    with Image.open(filepath) as img:
        img = ImageOps.exif_transpose(img)
        img = img.convert("RGB")

        if not os.path.exists(main_path):
            resized = resize_main(img.copy())
            resized.save(main_path, "JPEG", quality=85)

        if not os.path.exists(thumb_path):
            thumb = make_thumb(img.copy())
            thumb.save(thumb_path, "JPEG", quality=85)

def main():
    for file in os.listdir(IMAGE_DIR):
        filepath = os.path.join(IMAGE_DIR, file)
        if os.path.isfile(filepath) and is_eligible(file):
            process_image(filepath)

if __name__ == '__main__':
    main()
