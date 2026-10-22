# Перевод .pptx на месте: тексты меняются внутри XML, оформление и правки в PowerPoint сохраняются.
#
#   python3 tools/translate_pptx.py extract <unpacked_dir> <out.json>
#       Собирает все абзацы с кириллицей (слайды, заметки, графики, таблицы) и строки графиков/встроенных xlsx.
#       Абзац с разным форматированием внутри размечен тегами [1]…[/1][2]…[/2]; перенос строки — \n.
#   python3 tools/translate_pptx.py apply <unpacked_dir> <src.json> <translations.json>
#       Пишет переводы обратно. translations.json: {"<id>": "<english>"}.
#
# Стрелки (→ ← ↑ ↓ ✓ …) при записи снова выносятся в отдельные раны шрифтом Arial (в Tahoma их нет).
import sys, os, re, json, glob, copy, zipfile, io, shutil
from lxml import etree

NS = {
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
}
A = '{%s}' % NS['a']
CYR = re.compile('[А-Яа-яЁё]')
ARROWS = '→←↑↓↔⇒✓✔'
ARROW_RE = re.compile('([%s])' % ARROWS)


def q(tag):
    pre, name = tag.split(':')
    return '{%s}%s' % (NS[pre], name)


def slide_order(root):
    pres = open(os.path.join(root, 'ppt/presentation.xml'), encoding='utf-8').read()
    rels = open(os.path.join(root, 'ppt/_rels/presentation.xml.rels'), encoding='utf-8').read()
    ids = re.findall(r'<p:sldId [^>]*r:id="(rId\d+)"', pres)
    m = {}
    for rel in re.findall(r'<Relationship [^>]*/>', rels):
        i = re.search(r'Id="(rId\d+)"', rel).group(1)
        t = re.search(r'Target="([^"]+)"', rel).group(1)
        m[i] = t
    return ['ppt/' + m[i] for i in ids]


def rels_of(root, part):
    d, f = os.path.split(part)
    rp = os.path.join(root, d, '_rels', f + '.rels')
    if not os.path.exists(rp):
        return {}
    out = {}
    for rel in re.findall(r'<Relationship [^>]*/>', open(rp, encoding='utf-8').read()):
        t = re.search(r'Target="([^"]+)"', rel).group(1)
        ty = re.search(r'Type="([^"]+)"', rel).group(1)
        out.setdefault(ty.split('/')[-1], []).append(os.path.normpath(os.path.join(d, t)))
    return out


def fmt_key(rpr):
    if rpr is None:
        return ''
    e = copy.deepcopy(rpr)
    for k in ('lang', 'dirty', 'altLang', 'err', 'noProof'):
        e.attrib.pop(k, None)
    for t in ('latin', 'ea', 'cs', 'sym'):
        for x in e.findall(A + t):
            e.remove(x)
    return etree.tostring(e, encoding='unicode')


def para_tokens(p):
    """Список токенов абзаца: ('r', rPr, text) / ('br',). Стрелочные раны сливаются с соседями."""
    toks = []
    for ch in p:
        tag = etree.QName(ch).localname
        if tag == 'r':
            t = ch.find(A + 't')
            toks.append(['r', ch.find(A + 'rPr'), t.text if t is not None and t.text else ''])
        elif tag == 'br':
            toks.append(['br'])
        elif tag == 'fld':
            t = ch.find(A + 't')
            toks.append(['fld', ch, t.text if t is not None and t.text else ''])
    return toks


def groups_of(toks):
    """Группы ранов с одинаковым форматом (без учёта шрифта у стрелок). Возвращает (groups, seq):
    groups — [rPr]; seq — [('g', idx, text) | ('br',)]"""
    groups, keys, seq = [], [], []
    for t in toks:
        if t[0] == 'br':
            seq.append(('br',))
            continue
        if t[0] == 'fld':
            return None, None
        rpr, text = t[1], t[2]
        is_arrow = text.strip() != '' and all(c in ARROWS or c.isspace() for c in text)
        k = fmt_key(rpr)
        if is_arrow and seq:
            # стрелка — к предыдущей группе
            last = next((s for s in reversed(seq) if s[0] == 'g'), None)
            if last is not None:
                seq.append(('g', last[1], text))
                continue
        if groups and keys[-1] == k and seq and seq[-1][0] == 'g' and seq[-1][1] == len(groups) - 1:
            seq.append(('g', len(groups) - 1, text))
            continue
        if k in keys:
            idx = keys.index(k)
            seq.append(('g', idx, text))
            continue
        groups.append(rpr)
        keys.append(k)
        seq.append(('g', len(groups) - 1, text))
    return groups, seq


def seq_to_string(groups, seq):
    multi = len(groups) > 1
    out, cur, buf = [], None, ''

    def flush():
        nonlocal buf, cur
        if cur is not None and buf != '':
            out.append(f'[{cur + 1}]{buf}[/{cur + 1}]' if multi else buf)
        buf = ''

    for s in seq:
        if s[0] == 'br':
            flush()
            out.append('\n')
            cur = None
            continue
        if s[1] != cur:
            flush()
            cur = s[1]
        buf += s[2]
    flush()
    return ''.join(out)


def iter_parts(root):
    order = slide_order(root)
    for n, sp in enumerate(order, 1):
        yield n, 'slide', sp
        r = rels_of(root, sp)
        for nt in r.get('notesSlide', []):
            yield n, 'notes', nt
        for ch in r.get('chart', []):
            yield n, 'chart', ch


def extract(root, out):
    items = []
    strings = {}
    for n, kind, part in iter_parts(root):
        path = os.path.join(root, part)
        tree = etree.parse(path)
        for pi, p in enumerate(tree.iter(A + 'p')):
            toks = para_tokens(p)
            text = ''.join(t[2] for t in toks if t[0] != 'br')
            if not CYR.search(text):
                continue
            groups, seq = groups_of(toks)
            if groups is None:
                print('skip field paragraph', part, text[:40], file=sys.stderr)
                continue
            items.append({'id': f'{part}#{pi}', 'slide': n, 'kind': kind, 'part': part, 'p': pi,
                          'tags': len(groups), 'ru': seq_to_string(groups, seq)})
        if kind == 'chart':
            for v in tree.iter(q('c:v')):
                if v.text and CYR.search(v.text):
                    strings.setdefault(v.text, set()).add(n)
    # строки графиков (категории, названия рядов) — отдельным списком
    for sidx, (s, slides) in enumerate(sorted(strings.items())):
        items.append({'id': f'str#{sidx}', 'slide': min(slides), 'kind': 'chartstr', 'ru': s})
    # служебные места: названия разделов, заголовок документа
    pres = open(os.path.join(root, 'ppt/presentation.xml'), encoding='utf-8').read()
    for s in sorted(set(re.findall(r'<p14:section name="([^"]+)"', pres))):
        if CYR.search(s):
            items.append({'id': f'section#{s}', 'slide': 0, 'kind': 'section', 'ru': s})
    core = open(os.path.join(root, 'docProps/core.xml'), encoding='utf-8').read()
    m = re.search(r'<dc:title>([^<]*)</dc:title>', core)
    if m and CYR.search(m.group(1)):
        items.append({'id': 'doc#title', 'slide': 0, 'kind': 'doctitle', 'ru': m.group(1)})
    for lay in sorted(glob.glob(os.path.join(root, 'ppt/slideLayouts/*.xml'))):
        for m in set(re.findall(r'descr="([^"]*[А-Яа-яЁё][^"]*)"', open(lay, encoding='utf-8').read())):
            items.append({'id': f'descr#{m}', 'slide': 0, 'kind': 'descr', 'ru': m})
    json.dump(items, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'{len(items)} items, {sum(len(i["ru"]) for i in items)} chars')


TAG_RE = re.compile(r'\[(\d+)\](.*?)\[/\1\]', re.S)


def parse_translation(s, ngroups):
    """→ [('g', idx, text) | ('br',)]"""
    seq = []
    lines = s.split('\n')
    for li, line in enumerate(lines):
        if li > 0:
            seq.append(('br',))
        if ngroups <= 1:
            if line:
                seq.append(('g', 0, line))
            continue
        pos = 0
        last = 0
        for m in TAG_RE.finditer(line):
            pre = line[pos:m.start()]
            if pre:
                seq.append(('g', last, pre))
            idx = int(m.group(1)) - 1
            if not (0 <= idx < ngroups):
                raise ValueError(f'bad tag {idx + 1}')
            if m.group(2):
                seq.append(('g', idx, m.group(2)))
            last = idx
            pos = m.end()
        tail = line[pos:]
        if tail:
            seq.append(('g', last, tail))
    return seq


def set_font(rpr, face):
    for t in ('latin', 'ea', 'cs'):
        e = rpr.find(A + t)
        if e is None:
            e = etree.SubElement(rpr, A + t)
        e.set('typeface', face)
    # порядок дочерних элементов rPr: ln, fill…, latin, ea, cs, sym, hlink… — переставим шрифты в конец перед hlink
    fonts = [rpr.find(A + t) for t in ('latin', 'ea', 'cs')]
    for f in fonts:
        rpr.remove(f)
    insert_at = len(rpr)
    for i, ch in enumerate(rpr):
        if etree.QName(ch).localname in ('sym', 'hlinkClick', 'hlinkMouseOver', 'rtl', 'extLst'):
            insert_at = i
            break
    for k, f in enumerate(fonts):
        rpr.insert(insert_at + k, f)


def make_run(rpr, text, arrow=False):
    r = etree.Element(A + 'r')
    if rpr is not None:
        rp = copy.deepcopy(rpr)
    else:
        rp = etree.Element(A + 'rPr')
    rp.set('lang', 'en-US')
    if arrow:
        set_font(rp, 'Arial')
    elif rp.find(A + 'latin') is not None and rp.find(A + 'latin').get('typeface') == 'Arial':
        set_font(rp, 'Tahoma')
    r.append(rp)
    t = etree.SubElement(r, A + 't')
    t.text = text
    if text != text.strip():
        t.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
    return r


def apply_para(p, ngroups, translation):
    toks = para_tokens(p)
    groups, _ = groups_of(toks)
    if groups is None or len(groups) != ngroups:
        raise ValueError('structure changed')
    seq = parse_translation(translation, ngroups)
    # убрать старые раны/переносы
    for ch in list(p):
        if etree.QName(ch).localname in ('r', 'br'):
            p.remove(ch)
    end = p.find(A + 'endParaRPr')
    new = []
    for s in seq:
        if s[0] == 'br':
            br = etree.Element(A + 'br')
            new.append(br)
            continue
        rpr = groups[s[1]]
        for part in ARROW_RE.split(s[2]):
            if not part:
                continue
            new.append(make_run(rpr, part, arrow=bool(ARROW_RE.fullmatch(part))))
    for el in new:
        if end is not None:
            end.addprevious(el)
        else:
            p.append(el)
    if end is not None:
        end.set('lang', 'en-US')


def xml_escape(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')


def apply(root, src_json, tr_json):
    items = json.load(open(src_json, encoding='utf-8'))
    tr = json.load(open(tr_json, encoding='utf-8'))
    missing = [i['id'] for i in items if i['id'] not in tr]
    if missing:
        print(f'НЕТ ПЕРЕВОДА: {len(missing)}', missing[:10], file=sys.stderr)
    by_part = {}
    for it in items:
        if it['kind'] in ('slide', 'notes', 'chart') and it['id'] in tr:
            by_part.setdefault(it['part'], []).append(it)
    for part, its in by_part.items():
        path = os.path.join(root, part)
        tree = etree.parse(path)
        paras = list(tree.iter(A + 'p'))
        for it in its:
            try:
                apply_para(paras[it['p']], it['tags'], tr[it['id']])
            except Exception as e:
                print('ОШИБКА', it['id'], e, file=sys.stderr)
        tree.write(path, xml_declaration=True, encoding='UTF-8', standalone=True)
    # строки графиков: c:v в xml графиков + встроенные xlsx
    smap = {i['ru']: tr[i['id']] for i in items if i['kind'] == 'chartstr' and i['id'] in tr}
    if smap:
        for cx in glob.glob(os.path.join(root, 'ppt/charts/*.xml')):
            tree = etree.parse(cx)
            ch = False
            for v in tree.iter(q('c:v')):
                if v.text in smap:
                    v.text = smap[v.text]
                    ch = True
            if ch:
                tree.write(cx, xml_declaration=True, encoding='UTF-8', standalone=True)
        for xl in glob.glob(os.path.join(root, 'ppt/embeddings/*.xlsx')):
            zin = zipfile.ZipFile(xl)
            buf = io.BytesIO()
            zout = zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED)
            for info in zin.infolist():
                data = zin.read(info.filename)
                if info.filename.endswith('.xml'):
                    txt = data.decode('utf-8')
                    for ru, en in sorted(smap.items(), key=lambda kv: -len(kv[0])):
                        txt = txt.replace('>' + xml_escape(ru) + '<', '>' + xml_escape(en) + '<')
                        txt = txt.replace('"' + xml_escape(ru) + '"', '"' + xml_escape(en) + '"')
                    data = txt.encode('utf-8')
                zout.writestr(info, data)
            zout.close()
            zin.close()
            open(xl, 'wb').write(buf.getvalue())
    # разделы, заголовок документа, описания картинок
    pp = os.path.join(root, 'ppt/presentation.xml')
    pres = open(pp, encoding='utf-8').read()
    for it in items:
        if it['kind'] == 'section' and it['id'] in tr:
            pres = pres.replace(f'name="{it["ru"]}"', f'name="{xml_escape(tr[it["id"]])}"')
    open(pp, 'w', encoding='utf-8').write(pres)
    cp = os.path.join(root, 'docProps/core.xml')
    core = open(cp, encoding='utf-8').read()
    for it in items:
        if it['kind'] == 'doctitle' and it['id'] in tr:
            core = core.replace(f'<dc:title>{it["ru"]}</dc:title>', f'<dc:title>{xml_escape(tr[it["id"]])}</dc:title>')
    open(cp, 'w', encoding='utf-8').write(core)
    descr = {it['ru']: tr[it['id']] for it in items if it['kind'] == 'descr' and it['id'] in tr}
    if descr:
        for f in glob.glob(os.path.join(root, 'ppt/**/*.xml'), recursive=True):
            t = open(f, encoding='utf-8').read()
            t2 = t
            for ru, en in descr.items():
                t2 = t2.replace(f'descr="{ru}"', f'descr="{xml_escape(en)}"')
            if t2 != t:
                open(f, 'w', encoding='utf-8').write(t2)
    print('applied')


if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'extract':
        extract(sys.argv[2], sys.argv[3])
    elif cmd == 'apply':
        apply(sys.argv[2], sys.argv[3], sys.argv[4])
