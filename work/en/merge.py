# Склейка партий перевода → merged.json + review.md (для редактора)
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
src = json.load(open(os.path.join(HERE, 'source.json'), encoding='utf-8'))
merged = {}
for n in range(1, 7):
    merged.update(json.load(open(os.path.join(HERE, f'out_{n}.json'), encoding='utf-8')))
missing = [i['id'] for i in src if i['id'] not in merged]
print('missing', len(missing), missing[:5])
json.dump(merged, open(os.path.join(HERE, 'merged.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

lines = ['# Review: RU → EN, slide by slide\n']
cur = None
for it in sorted(src, key=lambda i: (i['slide'], i['kind'] != 'slide', i['id'])):
    if it['slide'] != cur:
        cur = it['slide']
        lines.append(f'\n## Slide {cur}\n')
    en = merged.get(it['id'], '∅')
    lines.append(f"- `{it['id']}` ({it['kind']})\n  - RU: {it['ru']!r}\n  - EN: {en!r}")
open(os.path.join(HERE, 'review.md'), 'w', encoding='utf-8').write('\n'.join(lines))
print('review.md written')
