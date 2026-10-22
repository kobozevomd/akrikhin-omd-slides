#!/usr/bin/env python3
"""Лист превью из рендера — быстро посмотреть много слайдов разом.

    python3 tools/contact_sheet.py <папка рендера> <out.jpg> [--slides 3,5,9-12] [--cols 3] [--w 640]

В углу каждой миниатюры — номер слайда.
"""
import argparse, os, re
from PIL import Image, ImageDraw


def parse(spec, avail):
    if not spec:
        return avail
    res = []
    for part in spec.split(','):
        if '-' in part:
            a, b = map(int, part.split('-'))
            res += list(range(a, b + 1))
        else:
            res.append(int(part))
    return [n for n in res if n in avail]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('dir')
    ap.add_argument('out')
    ap.add_argument('--slides')
    ap.add_argument('--cols', type=int, default=3)
    ap.add_argument('--w', type=int, default=640)
    a = ap.parse_args()
    files = {int(re.search(r'(\d+)', f).group(1)): f for f in os.listdir(a.dir) if re.match(r'slide-\d+\.png$', f)}
    nums = parse(a.slides, sorted(files))
    ims = [Image.open(os.path.join(a.dir, files[n])).convert('RGB') for n in nums]
    w = a.w
    h = int(w * ims[0].height / ims[0].width)
    rows = (len(ims) + a.cols - 1) // a.cols
    sheet = Image.new('RGB', (a.cols * w + (a.cols - 1) * 6, rows * h + (rows - 1) * 6), 'white')
    d = ImageDraw.Draw(sheet)
    for i, (n, im) in enumerate(zip(nums, ims)):
        x, y = (i % a.cols) * (w + 6), (i // a.cols) * (h + 6)
        sheet.paste(im.resize((w, h)), (x, y))
        d.rectangle([x, y, x + 34, y + 22], fill='black')
        d.text((x + 5, y + 5), str(n), fill='yellow')
    sheet.save(a.out, quality=85)
    print(a.out, len(ims), 'слайдов')


if __name__ == '__main__':
    main()
