# Проверка, что переведённый текст помещается туда же, где стоял исходный.
#   python3 tools/fit_check.py <ru_unpacked> <en_unpacked> [--fix]
# Для каждой фигуры с текстом считает строки (метрики Tahoma) до и после перевода.
# Если строк стало больше — фигура в списке. --fix уменьшает кегль в такой фигуре (не ниже 85%),
# пока строк не станет столько же; что не удалось — печатает для ручной правки.
import sys, os, re, json, glob
from lxml import etree

A = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
P = '{http://schemas.openxmlformats.org/presentationml/2006/main}'
EMU_PX = 914400 / 96
HERE = os.path.dirname(os.path.abspath(__file__))
M = json.load(open(os.path.join(HERE, '..', 'assets', 'tahoma_metrics.json'), encoding='utf-8'))


def tw(text, size_pt, bold):
    t = M['B' if bold else 'R']
    w = sum(t.get(ch, 650 if bold else 570) for ch in text)
    return w / 1000 * size_pt


def para_lines(p, width_pt, scale=1.0):
    runs = []
    for r in p:
        n = etree.QName(r).localname
        if n == 'r':
            rp = r.find(A + 'rPr')
            sz = int(rp.get('sz', '1800')) / 100 if rp is not None else 18
            b = rp is not None and rp.get('b') == '1'
            t = r.find(A + 't')
            runs.append((t.text or '' if t is not None else '', sz * scale, b))
        elif n == 'br':
            runs.append(('\n', 0, False))
    if not runs:
        return 1, 18 * scale
    maxsz = max((s for _, s, _ in runs if s), default=18 * scale)
    # раскладка по словам с учётом кегля каждого рана
    lines, cur = 1, 0.0
    words = []
    for text, sz, b in runs:
        if text == '\n':
            words.append(('\n', 0, 0))
            continue
        for tok in re.split(r'(\s+)', text):
            if tok:
                words.append((tok, sz, b))
    for tok, sz, b in words:
        if tok == '\n':
            lines += 1
            cur = 0
            continue
        w = tw(tok, sz, b)
        if tok.isspace():
            cur += w
            continue
        if cur > 0 and cur + w > width_pt * 0.98:
            lines += 1
            cur = w
        else:
            cur += w
        while cur > width_pt * 0.98:   # слово шире строки — его разорвёт
            lines += 1
            cur -= width_pt * 0.98
    return lines, maxsz


def shape_lines(sp, scale=1.0):
    xfrm = sp.find('.//' + A + 'xfrm')
    if xfrm is None:
        return None
    ext = xfrm.find(A + 'ext')
    if ext is None or ext.get('cx') is None:
        return None
    body = sp.find('.//' + P + 'txBody')
    if body is None:
        body = sp.find('.//' + A + 'txBody')
    if ext is None or body is None:
        return None
    bp = body.find(A + 'bodyPr')
    li = int(bp.get('lIns', '91440')) if bp is not None else 91440
    ri = int(bp.get('rIns', '91440')) if bp is not None else 91440
    w_pt = (int(ext.get('cx')) - li - ri) / 12700
    if w_pt <= 0:
        return None
    total = 0
    for p in body.findall(A + 'p'):
        n, sz = para_lines(p, w_pt, scale)
        total += n
    return total


def text_of(sp):
    return ''.join(t.text or '' for t in sp.iter(A + 't'))


def scale_sizes(sp, k):
    for el in sp.iter():
        if etree.QName(el).localname in ('rPr', 'endParaRPr', 'defRPr') and el.get('sz'):
            el.set('sz', str(max(800, int(round(int(el.get('sz')) * k / 25.0)) * 25)))
        if etree.QName(el).localname == 'spcPts' and el.get('val'):
            el.set('val', str(int(round(int(el.get('val')) * k))))


def main():
    ru, en = sys.argv[1], sys.argv[2]
    fix = '--fix' in sys.argv
    bad = []
    for f in sorted(glob.glob(os.path.join(en, 'ppt/slides/slide*.xml')), key=lambda x: int(re.findall(r'(\d+)\.xml', x)[0])):
        name = os.path.basename(f)
        tr = etree.parse(os.path.join(ru, 'ppt/slides', name))
        te = etree.parse(f)
        sr = [s for s in tr.iter(P + 'sp')]
        se = [s for s in te.iter(P + 'sp')]
        changed = False
        for a, b in zip(sr, se):
            if not text_of(b).strip():
                continue
            lr, le = shape_lines(a), shape_lines(b)
            if lr is None or le is None or le <= lr:
                continue
            msg = f'{name}: строк {lr} → {le}: {text_of(b)[:70]}'
            if fix:
                k = 1.0
                while k > 0.85 and shape_lines(b, k) > lr:
                    k -= 0.02
                if shape_lines(b, k) <= lr:
                    scale_sizes(b, k)
                    changed = True
                    msg += f'  → кегль ×{k:.2f}'
                else:
                    msg += '  → НЕ ВЛЕЗАЕТ, нужно сократить'
            bad.append(msg)
        if changed:
            te.write(f, xml_declaration=True, encoding='UTF-8', standalone=True)
    print(f'фигур с ростом числа строк: {len(bad)}')
    for m in bad:
        print('  ' + m)


if __name__ == '__main__':
    main()
