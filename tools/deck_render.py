#!/usr/bin/env python3
"""Рендер деки в PNG вместе со скрытыми слайдами (LibreOffice их пропускает).

    python3 tools/deck_render.py <deck.pptx> [--name имя] [--en]

Копия без show="0" → out/<имя>.pptx → out/render/<имя>/slide-NN.png (NN = номер слайда в деке).
--en — рендер с английской локалью (точки в числах графиков, как у англоязычного клиента).
Имя по умолчанию — имя файла без расширения.
"""
import argparse, os, re, subprocess, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('deck')
    ap.add_argument('--name')
    ap.add_argument('--en', action='store_true')
    a = ap.parse_args()
    name = a.name or os.path.splitext(os.path.basename(a.deck))[0]
    os.makedirs(os.path.join(ROOT, 'out'), exist_ok=True)
    out = os.path.join(ROOT, 'out', f'{name}.pptx')
    zi = zipfile.ZipFile(a.deck)
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as zo:
        for it in zi.infolist():
            d = zi.read(it.filename)
            if re.match(r'ppt/slides/slide\d+\.xml$', it.filename):
                d = d.replace(b' show="0"', b'')
            zo.writestr(it, d)
    env = dict(os.environ)
    if a.en:
        env['RENDER_LOCALE'] = 'en-US'
    subprocess.run([os.path.join(ROOT, 'tools', 'render.sh'), out], check=True, env=env, stdout=subprocess.DEVNULL,
                   stderr=subprocess.DEVNULL)
    rdir = os.path.join(ROOT, 'out', 'render', name)
    n = len([f for f in os.listdir(rdir) if f.endswith('.png')])
    print(f'{rdir} — {n} PNG')


if __name__ == '__main__':
    main()
