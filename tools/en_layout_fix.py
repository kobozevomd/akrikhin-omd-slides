# Доводка вёрстки после перевода на английский (распакованный .pptx):
#   python3 tools/en_layout_fix.py <ru_unpacked> <en_unpacked>
# 1) Числа: десятичная запятая → точка (3,44 → 3.44), разряды пробелом → запятая (2 251 → 2,251).
# 2) Однострочная подпись стала шире своей рамки (TAKEAWAY в плашке, чип, пилюля): рамку расширяем,
#    соседей справа в том же ряду сдвигаем, последний текст ряда сужаем. Не вышло — уменьшаем кегль.
# 3) Остальной рост числа строк — уменьшаем кегль (fit_check --fix).
import sys, os, re, glob, subprocess
from lxml import etree

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import fit_check as fc  # noqa: E402

A = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
P = '{http://schemas.openxmlformats.org/presentationml/2006/main}'
DEC = re.compile(r'(?<=\d),(?=\d{1,2}(?!\d))')
THOU = re.compile(r'(?<=\d)[  ](?=\d{3}(?!\d))')


def fix_numbers(path):
    tree = etree.parse(path)
    n = 0
    for t in tree.iter(A + 't'):
        if t.text and re.search(r'\d', t.text):
            new = THOU.sub(',', DEC.sub('.', t.text))
            if new != t.text:
                t.text = new
                n += 1
    if n:
        tree.write(path, xml_declaration=True, encoding='UTF-8', standalone=True)
    return n


def bbox(el):
    x = el.find('.//' + A + 'xfrm')
    if x is None or x.find(A + 'off') is None or x.find(A + 'ext') is None:
        return None
    o, e = x.find(A + 'off'), x.find(A + 'ext')
    return [int(o.get('x')), int(o.get('y')), int(e.get('cx')), int(e.get('cy'))]


def set_bbox(el, b):
    x = el.find('.//' + A + 'xfrm')
    o, e = x.find(A + 'off'), x.find(A + 'ext')
    o.set('x', str(int(b[0])))
    o.set('y', str(int(b[1])))
    e.set('cx', str(int(b[2])))
    e.set('cy', str(int(b[3])))


def is_text(el):
    return el.tag == P + 'sp' and any((t.text or '').strip() for t in el.iter(A + 't'))


def is_filled_box(el):
    if el.tag != P + 'sp' or is_text(el):
        return False
    sppr = el.find(P + 'spPr')
    return sppr is not None and sppr.find(A + 'solidFill') is not None


def single_line_width_need(sp):
    """Ширина (EMU), нужная одному абзацу без переносов, и текущая внутренняя ширина."""
    body = sp.find(P + 'txBody')
    bp = body.find(A + 'bodyPr')
    li = int(bp.get('lIns', '91440')) if bp is not None else 91440
    ri = int(bp.get('rIns', '91440')) if bp is not None else 91440
    paras = body.findall(A + 'p')
    need = 0
    for p in paras:
        w = 0
        for r in p.iter(A + 'r'):
            rp = r.find(A + 'rPr')
            sz = int(rp.get('sz', '1800')) / 100 if rp is not None else 18
            b = rp is not None and rp.get('b') == '1'
            w += fc.tw(r.find(A + 't').text or '', sz, b)
        need = max(need, w)
    return need * 12700 * 1.04 + li + ri


def widen(tree, sp, ru_lines):
    shapes = [e for e in tree.iter(P + 'sp', P + 'pic', P + 'cxnSp') if bbox(e) is not None]
    T = bbox(sp)
    need = single_line_width_need(sp)
    dx = need - T[2]
    if dx <= 0:
        return False
    dx += 12700 * 10   # немного воздуха до разделителя
    enclosing = sorted([e for e in shapes if e is not sp and is_filled_box(e)
                        and bbox(e)[0] <= T[0] + 1 and bbox(e)[1] <= T[1] + 1
                        and bbox(e)[0] + bbox(e)[2] >= T[0] + T[2] - 1 and bbox(e)[1] + bbox(e)[3] >= T[1] + T[3] - 1],
                       key=lambda e: bbox(e)[2] * bbox(e)[3])
    pill = None
    cont = None
    if enclosing:
        e1 = bbox(enclosing[0])
        if e1[2] < T[2] + 60 * 12700:
            pill = enclosing[0]
            cont = enclosing[1] if len(enclosing) > 1 else None
        else:
            cont = enclosing[0]
    if cont is None:
        return False
    C = bbox(cont)
    ref = bbox(pill) if pill is not None else T
    y0, y1 = ref[1] - 12700 * 6, ref[1] + ref[3] + 12700 * 6
    right_edge = ref[0] + ref[2]
    movers = []
    for e in shapes:
        if e is sp or e is pill or e is cont:
            continue
        b = bbox(e)
        # только то, что целиком лежит внутри контейнера (иначе зацепим разделители колонок над плашкой)
        if b[0] >= right_edge - 12700 * 4 and b[1] < y1 and b[1] + b[3] > y0 \
                and b[0] >= C[0] and b[0] + b[2] <= C[0] + C[2] + 12700 \
                and b[1] >= C[1] - 12700 and b[1] + b[3] <= C[1] + C[3] + 12700:
            movers.append(e)
    limit = C[0] + C[2] - 12700 * 18
    plan = []
    for e in movers:
        b = bbox(e)
        nb = [b[0] + dx, b[1], b[2], b[3]]
        if nb[0] + nb[2] > limit:
            if not is_text(e):
                return False
            nb[2] = limit - nb[0]
            if nb[2] < b[2] * 0.6:
                return False
        plan.append((e, nb))
    T2 = [T[0], T[1], T[2] + dx, T[3]]
    if T2[0] + T2[2] > limit and not movers:
        return False
    set_bbox(sp, T2)
    if pill is not None:
        pb = bbox(pill)
        set_bbox(pill, [pb[0], pb[1], pb[2] + dx, pb[3]])
    for e, nb in plan:
        set_bbox(e, nb)
    return True


def main():
    ru, en = sys.argv[1], sys.argv[2]
    nums = 0
    for f in glob.glob(os.path.join(en, 'ppt/slides/slide*.xml')) + glob.glob(os.path.join(en, 'ppt/charts/chart*.xml')):
        nums += fix_numbers(f)
    print(f'числа исправлены в {nums} фрагментах')
    widened = []
    for f in sorted(glob.glob(os.path.join(en, 'ppt/slides/slide*.xml')), key=lambda x: int(re.findall(r'(\d+)\.xml', x)[0])):
        name = os.path.basename(f)
        tr = etree.parse(os.path.join(ru, 'ppt/slides', name))
        te = etree.parse(f)
        sr = list(tr.iter(P + 'sp'))
        se = list(te.iter(P + 'sp'))
        changed = False
        for a, b in zip(sr, se):
            if not is_text(b):
                continue
            lr, le = fc.shape_lines(a), fc.shape_lines(b)
            if lr is None or le is None or le <= lr or lr != 1:
                continue
            if widen(te, b, lr) and fc.shape_lines(b) <= lr:
                widened.append(f'{name}: {fc.text_of(b)[:50]}')
                changed = True
        if changed:
            te.write(f, xml_declaration=True, encoding='UTF-8', standalone=True)
    print(f'расширено подписей: {len(widened)}')
    for w in widened:
        print('  ' + w)
    # всё, что осталось, — уменьшение кегля
    subprocess.run([sys.executable, os.path.join(HERE, 'fit_check.py'), ru, en, '--fix'])


if __name__ == '__main__':
    main()
