# Точечные правки вёрстки английской версии (по id фигур), после en_layout_fix.py.
#   python3 tools/en_manual_fixes.py <en_unpacked>
import sys, os
from lxml import etree

A = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
P = '{http://schemas.openxmlformats.org/presentationml/2006/main}'
PX = 9525


def load(root, n):
    p = os.path.join(root, f'ppt/slides/slide{n}.xml')
    return p, etree.parse(p)


def shape(tree, sid):
    for sp in tree.iter(P + 'sp', P + 'pic', P + 'cxnSp'):
        c = sp.find('.//' + P + 'cNvPr')
        if c is not None and c.get('id') == str(sid):
            return sp
    raise KeyError(sid)


def geom(sp):
    x = sp.find('.//' + A + 'xfrm')
    return x.find(A + 'off'), x.find(A + 'ext')


def set_x_w(sp, x=None, w=None):
    o, e = geom(sp)
    if x is not None:
        o.set('x', str(int(x * PX)))
    if w is not None:
        e.set('cx', str(int(w * PX)))


def scale_font(sp, k):
    for el in sp.iter(A + 'rPr', A + 'endParaRPr'):
        if el.get('sz'):
            el.set('sz', str(int(round(int(el.get('sz')) * k / 25.0)) * 25))


def slide38(root):
    # ряд «2027 CONTEXTS»: три пилюли (рамка+текст) не помещаются — ужимаем кегль и ширины, раскладываем заново
    p, t = load(root, 38)
    pairs = [(53, 54, 196), (55, 56, 140), (57, 58, 203)]
    k = 0.88
    x = 713
    for box, txt, w in pairs:
        nw = round(w * k)
        for sid in (box, txt):
            set_x_w(shape(t, sid), x=x, w=nw)
        scale_font(shape(t, txt), k)
        x += nw + 8
    t.write(p, xml_declaration=True, encoding='UTF-8', standalone=True)


def latin_strings(root):
    # английские строки, которые были в исходнике уже латиницей, но требуют правки
    rep = {'AI-scoring Bloggers': 'AI influencer scoring', '>AI-video<': '>AI video<', 'AI-video engine': 'AI video engine', 'AI-video pilots': 'AI video pilots'}
    for f in __import__('glob').glob(os.path.join(root, 'ppt/slides/slide*.xml')):
        t = open(f, encoding='utf-8').read()
        t2 = t
        for a, b in rep.items():
            t2 = t2.replace(a, b)
        if t2 != t:
            open(f, 'w', encoding='utf-8').write(t2)


def locale_and_meta(root):
    # язык текста и графиков → en-US (числа в подписях графиков с точкой), служебные русские строки
    import glob, re
    rep = {'descr="Иконка"': 'descr="Icon"', 'descr="Акрихин"': 'descr="Akrikhin"', 'descr="Изображение"': 'descr="Image"',
           'descr="Акрихин + OMD"': 'descr="Akrikhin + OMD"', 'descr="Яндекс Маркет"': 'descr="Yandex Market"',
           'descr="Знак Акрихин"': 'descr="Akrikhin mark"', 'name="Стандартная"': 'name="Default"', 'name="Тема Office"': 'name="Office Theme"',
           'lang="ru-RU"': 'lang="en-US"', '<c:lang val="ru-RU"/>': '<c:lang val="en-US"/>',
           '<PresentationFormat>Произвольный</PresentationFormat>': '<PresentationFormat>Custom</PresentationFormat>'}
    files = glob.glob(os.path.join(root, 'ppt/**/*.xml'), recursive=True) + [os.path.join(root, 'docProps/app.xml')]
    for f in files:
        t = open(f, encoding='utf-8').read()
        t2 = t
        for a, b in rep.items():
            t2 = t2.replace(a, b)
        if t2 != t:
            open(f, 'w', encoding='utf-8').write(t2)


def app_titles(root, src_json, tr_json):
    # список заголовков слайдов в docProps/app.xml
    import json, re
    src = json.load(open(src_json, encoding='utf-8'))
    tr = json.load(open(tr_json, encoding='utf-8'))
    TAG = re.compile(r'\[/?\d+\]')
    norm = lambda s: re.sub(r'\s+', ' ', TAG.sub('', s).replace('\u00a0', ' ').replace('\n', ' ')).strip()
    m = {norm(i['ru']): norm(tr[i['id']]) for i in src if i['id'] in tr}
    m.update({'Использованные шрифты': 'Fonts Used', 'Тема': 'Theme', 'Заголовки слайдов': 'Slide Titles'})
    p = os.path.join(root, 'docProps/app.xml')
    t = open(p, encoding='utf-8').read()

    def rep(mo):
        s = mo.group(1)
        if not re.search('[А-Яа-яЁё]', s):
            return mo.group(0)
        en = m.get(norm(s.replace('&amp;', '&')), '')
        return '<vt:lpstr>' + en.replace('&', '&amp;').replace('<', '&lt;') + '</vt:lpstr>'
    open(p, 'w', encoding='utf-8').write(re.sub(r'<vt:lpstr>([^<]*)</vt:lpstr>', rep, t))


FIXES = [slide38, latin_strings, locale_and_meta]

if __name__ == '__main__':
    root = sys.argv[1]
    for f in FIXES:
        f(root)
        print('ok', f.__name__)
    if len(sys.argv) > 3:
        app_titles(root, sys.argv[2], sys.argv[3])
        print('ok app_titles')
