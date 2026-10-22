#!/usr/bin/env python3
"""Проверка готовой деки перед отправкой.

    python3 tools/deck_check.py <deck.pptx> [--en]

Всегда: число слайдов, скрытые слайды, видео по слайдам (тип файла, совпадение байтов с source.pptx бренда,
если путь указан через --source), тип AVI в [Content_Types].
Всегда: символы U+2060 / U+2011 (в Tahoma их нет — PowerPoint рисует квадратики).
С --en: кириллица в любом XML (кроме картинок), знак ₽, ёлочки «», склейка «число+RUB», «Acrimycol»-подобные
расхождения не ловит — только формальные признаки.
"""
import argparse, hashlib, re, sys, zipfile


def md5(b):
    return hashlib.md5(b).hexdigest()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('deck')
    ap.add_argument('--en', action='store_true')
    ap.add_argument('--source', help='source.pptx бренда — сверить байты видео')
    a = ap.parse_args()
    z = zipfile.ZipFile(a.deck)
    pres = z.read('ppt/presentation.xml').decode()
    n = len(re.findall(r'<p:sldId ', pres))
    hidden, vids = [], []
    for i in range(1, n + 1):
        x = z.read(f'ppt/slides/slide{i}.xml').decode()
        if 'show="0"' in x[:800]:
            hidden.append(i)
        c = x.count('videoFile')
        if c:
            vids.append((i, c))
    print(f'Слайдов: {n}; скрытые: {hidden or "нет"}; видео: {vids or "нет"}')
    ct = z.read('[Content_Types].xml').decode()
    for ext, typ in re.findall(r'<Default Extension="(avi|mp4|mov|m4v)" ContentType="([^"]+)"', ct):
        print(f'  тип {ext}: {typ}' + ('  ← должно быть video/x-msvideo' if ext == 'avi' and typ != 'video/x-msvideo' else ''))
    if a.source:
        src = zipfile.ZipFile(a.source)
        src_hash = {md5(src.read(f)): f for f in src.namelist() if re.match(r'ppt/media/media\d+\.\w+$', f)}
        mine = [f for f in z.namelist() if re.match(r'ppt/media/media-[\d-]+\.\w+$', f)]
        seen = set()
        for f in mine:
            h = md5(z.read(f))
            if h in seen:
                continue
            seen.add(h)
            print(f'  {f}: ' + (f'= {src_hash[h]}' if h in src_hash else 'НЕ СОВПАДАЕТ с исходником'))
        missing = set(src_hash) - seen
        if missing:
            print('  нет в деке:', sorted(src_hash[h] for h in missing))
    bad = False
    t_all = ' '.join(z.read(f).decode('utf-8', 'ignore') for f in z.namelist() if re.match(r'ppt/slides/slide\d+\.xml$', f))
    nog = {'U+2060': t_all.count('\u2060'), 'U+2011': t_all.count('\u2011')}
    if any(nog.values()):
        print(f'Символы без глифа в Tahoma (будут квадратиками): {nog}')
        bad = True
    if a.en:
        cyr = [f for f in z.namelist() if f.endswith('.xml') and re.search('[А-Яа-яЁё]', z.read(f).decode('utf-8', 'ignore'))]
        t = ' '.join(z.read(f).decode('utf-8', 'ignore') for f in z.namelist() if re.match(r'ppt/slides/slide\d+\.xml$', f))
        rub = t.count('₽')
        quotes = len(re.findall('[«»]', t))
        glued = re.findall(r'\dRUB', t)
        print(f'EN: кириллица в XML: {cyr or "нет"}; ₽: {rub}; «»: {quotes}; склейка число+RUB: {glued[:5] or "нет"}')
        bad = bad or bool(cyr or rub or quotes or glued)
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
