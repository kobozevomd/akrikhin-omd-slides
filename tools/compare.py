# Сравнение рендера с эталоном фигмы: python3 tools/compare.py out/render/demo/slide-2.png reference/figma_slide_02.png out.png
# Склеивает два слайда друг под другом (сверху — наш, снизу — фигма) в половинном масштабе.
import sys
from PIL import Image, ImageDraw

ours, ref, out = sys.argv[1:4]
scale = float(sys.argv[4]) if len(sys.argv) > 4 else 0.5
a = Image.open(ours).convert('RGB').resize((1920, 1080))
b = Image.open(ref).convert('RGB').resize((1920, 1080))
w, h = int(1920 * scale), int(1080 * scale)
canvas = Image.new('RGB', (w, h * 2 + 6), (40, 40, 40))
canvas.paste(a.resize((w, h)), (0, 0))
canvas.paste(b.resize((w, h)), (0, h + 6))
d = ImageDraw.Draw(canvas)
d.text((8, 8), 'PPTX', fill=(255, 0, 0))
d.text((8, h + 14), 'FIGMA', fill=(255, 0, 0))
canvas.save(out)
