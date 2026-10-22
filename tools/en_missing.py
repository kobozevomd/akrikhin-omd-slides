#!/usr/bin/env python3
"""Подсказки перевода для строк, которые поменялись после перевода (правки клиента, правки вёрстки).

    node decks/brands/build.js <brand> --lang en      # пишет work/brands/<brand>/tr/missing.json
    python3 tools/en_missing.py <brand>

Для каждой строки без перевода ищет в work/brands/<brand>/en.json самую похожую русскую строку и печатает:
новую RU, старую RU, старый EN и (если правка — только числа) готовый EN с заменёнными числами.
Готовые пары дописываются в work/brands/<brand>/tr/en_extra.json только с флагом --apply и только
для строк, где поменялись одни числа (остальное переводится руками, тоже в en_extra.json).
После — python3 work/brands/tr_tools.py merge <brand> и снова сборка EN.
"""
import argparse, difflib, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NUM = re.compile(r'\d+(?:[.,  ]\d+)*')


def norm(s):
    return re.sub(r'\s+', ' ', s.replace(' ', ' ').replace('\n', ' ')).strip()


def ru2en_num(n):
    # 3,5 → 3.5 ; 2 251 → 2,251
    n = n.replace(' ', ' ')
    if re.fullmatch(r'\d{1,3}( \d{3})+', n):
        return n.replace(' ', ',')
    return n.replace(',', '.')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('brand')
    ap.add_argument('--apply', action='store_true', help='дописать в en_extra.json пары, где поменялись только числа')
    a = ap.parse_args()
    W = os.path.join(ROOT, 'work', 'brands', a.brand)
    mp = os.path.join(W, 'tr', 'missing.json')
    if not os.path.exists(mp):
        print('missing.json нет — все строки переведены (или EN ещё не собирали)')
        return
    missing = json.load(open(mp, encoding='utf-8'))
    en = json.load(open(os.path.join(W, 'en.json'), encoding='utf-8'))
    keys = list(en)
    nkeys = [norm(k) for k in keys]
    xp = os.path.join(W, 'tr', 'en_extra.json')
    extra = json.load(open(xp, encoding='utf-8')) if os.path.exists(xp) else {}
    added = 0
    for it in missing:
        ru = it['ru']
        best = difflib.get_close_matches(norm(ru), nkeys, n=1, cutoff=0.5)
        print(f"\n— слайд {it['slide']}\n  НОВАЯ RU: {ru}")
        if not best:
            print('  похожей строки нет — перевести вручную')
            continue
        old_ru = keys[nkeys.index(best[0])]
        old_en = en[old_ru]
        print(f'  СТАРАЯ RU: {old_ru}\n  СТАРЫЙ EN: {old_en}')
        # правка только в числах?
        if NUM.sub('#', norm(ru)) == NUM.sub('#', norm(old_ru)):
            olds, news = NUM.findall(old_ru), NUM.findall(ru)
            cand = old_en
            ok = True
            for o, n in zip(olds, news):
                if o == n:
                    continue
                oe, ne = ru2en_num(o), ru2en_num(n)
                if oe not in cand:
                    ok = False
                    break
                cand = cand.replace(oe, ne, 1)
            if ok:
                print(f'  ГОТОВЫЙ EN: {cand}')
                if a.apply:
                    extra[ru] = cand
                    added += 1
                continue
        print('  поменялись слова — перевести вручную по образцу старого EN')
    if a.apply and added:
        json.dump(extra, open(xp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print(f'\nдобавлено в en_extra.json: {added}. Дальше: python3 work/brands/tr_tools.py merge {a.brand}')


if __name__ == '__main__':
    main()
