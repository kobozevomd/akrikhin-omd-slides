# Инструменты перевода дек брендов.
#   python3 work/brands/tr_tools.py split <brand> [N]     → work/brands/<brand>/tr/batch_K.json (по слайдам, ~поровну)
#   python3 work/brands/tr_tools.py check <brand> [K|all] → проверка out_K.json (разметка, переносы, кириллица, длина)
#   python3 work/brands/tr_tools.py merge <brand>         → en.json из out_*.json (+ edits.json редактора поверх), review.md
import sys, os, json, re

HERE = os.path.dirname(os.path.abspath(__file__))
CYR = re.compile('[А-Яа-яЁё]')
BAD = ['leverage', 'unlock', 'harness', 'empower', 'seamless', 'robust', 'holistic', 'cutting-edge', 'game-changer',
       'game changer', 'revolutioniz', 'elevate', 'supercharg', 'delve', 'landscape', 'pivotal', 'testament', 'myriad',
       'foster', 'it is worth', "it's worth", 'not just', 'not only']


def marks(s):
    return (s.count('**'), s.count('[['), s.count(']]'), s.count('\n\n'), s.count('\n'))


def plain(s):
    return re.sub(r'\*\*|\[\[|\]\]', '', s)


def split(brand, n=5):
    D = os.path.join(HERE, brand)
    items = json.load(open(os.path.join(D, 'strings_ru.json'), encoding='utf-8'))
    os.makedirs(os.path.join(D, 'tr'), exist_ok=True)
    per = {}
    for i, it in enumerate(items):
        it['id'] = f's{i:04d}'
        per.setdefault(it['slide'], []).append(it)
    total = sum(len(i['ru']) for i in items)
    target = total / n
    batches, cur, acc = [], [], 0
    for sl in sorted(per):
        cur += per[sl]
        acc += sum(len(i['ru']) for i in per[sl])
        if acc >= target * 0.95 and len(batches) < n - 1:
            batches.append(cur); cur, acc = [], 0
    if cur:
        batches.append(cur)
    for k, b in enumerate(batches, 1):
        json.dump(b, open(os.path.join(D, 'tr', f'batch_{k}.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print(k, f"slides {b[0]['slide']}–{b[-1]['slide']}", len(b), 'items', sum(len(i['ru']) for i in b), 'chars')
    json.dump(items, open(os.path.join(D, 'tr', 'all.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


def check_one(D, k):
    src = json.load(open(os.path.join(D, 'tr', f'batch_{k}.json'), encoding='utf-8'))
    p = os.path.join(D, 'tr', f'out_{k}.json')
    if not os.path.exists(p):
        print(f'batch {k}: нет out_{k}.json'); return 1
    tr = json.load(open(p, encoding='utf-8'))
    errs, warns = [], []
    for it in src:
        i, ru = it['id'], it['ru']
        en = tr.get(i)
        if not isinstance(en, str) or not en.strip():
            errs.append(f'MISSING/EMPTY {i}'); continue
        if CYR.search(en):
            errs.append(f'CYRILLIC {i}: {en[:70]}')
        if marks(ru) != marks(en):
            errs.append(f'MARKUP/BREAKS {i}: ru {marks(ru)} en {marks(en)} :: {en[:80]}')
        if len(plain(en)) > len(plain(ru)) + 3:
            warns.append(f'LONGER {i}: ru {len(plain(ru))} / en {len(plain(en))}: {plain(en)[:90]}')
        low = en.lower()
        for b in BAD:
            if b in low:
                warns.append(f'CLICHE "{b}" {i}: {en[:80]}')
    print(f'batch {k}: {len(src)} items, errors {len(errs)}, warnings {len(warns)}')
    for e in errs: print('  E', e)
    for w in warns: print('  W', w)
    return 1 if errs else 0


def check(brand, which='all'):
    D = os.path.join(HERE, brand)
    ks = sorted(int(re.findall(r'\d+', f)[0]) for f in os.listdir(os.path.join(D, 'tr')) if re.match(r'batch_\d+\.json', f))
    if which != 'all':
        ks = [int(which)]
    return max(check_one(D, k) for k in ks)


def merge(brand):
    D = os.path.join(HERE, brand)
    items = json.load(open(os.path.join(D, 'tr', 'all.json'), encoding='utf-8'))
    byid = {}
    for f in sorted(os.listdir(os.path.join(D, 'tr'))):
        if re.match(r'out_\d+\.json', f):
            byid.update(json.load(open(os.path.join(D, 'tr', f), encoding='utf-8')))
    ep = os.path.join(D, 'tr', 'edits.json')
    if os.path.exists(ep):
        byid.update(json.load(open(ep, encoding='utf-8')))
    # правки вычитки носителем: tr/qa_N.json по id (несколько ревьюеров параллельно — у каждого свой файл), поверх edits.json
    for f in sorted(os.listdir(os.path.join(D, 'tr'))):
        if re.match(r'qa_\d+\.json$', f):
            byid.update(json.load(open(os.path.join(D, 'tr', f), encoding='utf-8')))
    en = {}
    lines = ['# Review RU → EN\n']
    cur = None
    for it in items:
        if it['id'] in byid:
            en[it['ru']] = byid[it['id']]
        if it['slide'] != cur:
            cur = it['slide']; lines.append(f'\n## Slide {cur}\n')
        lines.append(f"- `{it['id']}`\n  - RU: {it['ru']!r}\n  - EN: {byid.get(it['id'], '∅')!r}")
    xp = os.path.join(D, 'tr', 'en_extra.json')   # ручные добавки: строки, изменённые после записи, и латиница исходника
    if os.path.exists(xp):
        en.update(json.load(open(xp, encoding='utf-8')))
    json.dump(en, open(os.path.join(D, 'en.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    open(os.path.join(D, 'tr', 'review.md'), 'w', encoding='utf-8').write('\n'.join(lines))
    print(f'en.json: {len(en)} / {len(items)} strings; review.md written')


if __name__ == '__main__':
    cmd, brand = sys.argv[1], sys.argv[2]
    if cmd == 'split':
        split(brand, int(sys.argv[3]) if len(sys.argv) > 3 else 5)
    elif cmd == 'check':
        sys.exit(check(brand, sys.argv[3] if len(sys.argv) > 3 else 'all'))
    elif cmd == 'merge':
        merge(brand)
