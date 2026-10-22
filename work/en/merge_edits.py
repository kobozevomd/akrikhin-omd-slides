# Применить правки редактора: merged.json + edits.json → merged_final.json, с проверками
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
TAG = re.compile(r'\[(/?)(\d+)\]')
CYR = re.compile('[А-Яа-яЁё]')
src = {i['id']: i for i in json.load(open(os.path.join(HERE, 'source.json'), encoding='utf-8'))}
merged = json.load(open(os.path.join(HERE, 'merged.json'), encoding='utf-8'))
ep = os.path.join(HERE, 'edits.json')
edits = json.load(open(ep, encoding='utf-8')) if os.path.exists(ep) else {}
errs = []
for i, en in edits.items():
    if i not in src:
        errs.append(f'unknown id {i}')
        continue
    old = merged[i]
    if sorted(TAG.findall(old)) != sorted(TAG.findall(en)):
        errs.append(f'TAGS changed {i}: {en[:80]}')
    if old.count('\n') != en.count('\n'):
        errs.append(f'LINEBREAKS changed {i}')
    if CYR.search(en):
        errs.append(f'CYRILLIC {i}')
    ru = src[i]['ru']
    if src[i]['kind'] in ('slide', 'chartstr') and len(TAG.sub('', en)) > len(TAG.sub('', ru)) + 3:
        errs.append(f'LONGER than RU {i}: ru {len(TAG.sub("", ru))} en {len(TAG.sub("", en))}')
final = dict(merged)
final.update({k: v for k, v in edits.items() if k in src})
json.dump(final, open(os.path.join(HERE, 'merged_final.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'edits {len(edits)}, problems {len(errs)}')
for e in errs:
    print('  ', e)
