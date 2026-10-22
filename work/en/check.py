# Проверка перевода партии: python3 check.py N  (или check.py all)
import json, re, sys, os

HERE = os.path.dirname(os.path.abspath(__file__))
TAG = re.compile(r'\[(/?)(\d+)\]')
CYR = re.compile('[А-Яа-яЁё]')
BAD = ['leverage', 'unlock', 'harness', 'empower', 'seamless', 'robust', 'holistic', 'cutting-edge', 'game-changer',
       'game changer', 'revolutioniz', 'elevate', 'supercharg', 'delve', 'landscape', 'pivotal', 'testament', 'myriad',
       'foster', 'it is worth', "it's worth", 'not just', 'not only']


def check(n):
    src = json.load(open(os.path.join(HERE, f'batch_{n}.json'), encoding='utf-8'))
    p = os.path.join(HERE, f'out_{n}.json')
    if not os.path.exists(p):
        print(f'batch {n}: нет out_{n}.json')
        return 1
    tr = json.load(open(p, encoding='utf-8'))
    errs, warns = [], []
    for it in src:
        i, ru = it['id'], it['ru']
        if i not in tr:
            errs.append(f'MISSING {i}')
            continue
        en = tr[i]
        if not isinstance(en, str) or not en.strip():
            errs.append(f'EMPTY {i}')
            continue
        if CYR.search(en):
            errs.append(f'CYRILLIC {i}: {en[:60]}')
        if it.get('tags', 1) > 1:
            st = sorted(TAG.findall(ru))
            et = sorted(TAG.findall(en))
            if st != et:
                errs.append(f'TAGS {i}: ru {sorted(set(t[1] for t in st))} en {[(a + b) for a, b in TAG.findall(en)]}')
            # текст вне тегов
            outside = TAG.sub('\x00', en)
            parts = re.split(r'\[\d+\].*?\[/\d+\]', en.replace('\n', '\x01'))
            if any(p.replace('\x01', '').strip() for p in parts):
                warns.append(f'TEXT OUTSIDE TAGS {i}: {en[:80]}')
        if ru.count('\n') != en.count('\n'):
            errs.append(f'LINEBREAKS {i}: ru {ru.count(chr(10))} en {en.count(chr(10))}')
        lr = len(TAG.sub('', ru))
        le = len(TAG.sub('', en))
        if le > lr * 1.0 + 3 and it['kind'] in ('slide', 'chartstr'):
            warns.append(f'LONGER {i}: ru {lr} / en {le}: {TAG.sub("", en)[:90]}')
        low = en.lower()
        for b in BAD:
            if b in low:
                warns.append(f'CLICHE "{b}" {i}: {en[:80]}')
    extra = set(tr) - {it['id'] for it in src}
    if extra:
        warns.append(f'EXTRA ids: {list(extra)[:5]}')
    print(f'batch {n}: {len(src)} items, errors {len(errs)}, warnings {len(warns)}')
    for e in errs:
        print('  E', e)
    for w in warns:
        print('  W', w)
    return 1 if errs else 0


if __name__ == '__main__':
    arg = sys.argv[1]
    ns = range(1, 7) if arg == 'all' else [int(arg)]
    sys.exit(max(check(n) for n in ns))
