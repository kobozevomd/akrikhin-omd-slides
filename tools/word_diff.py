# Сверка слов: какие слова исходника (≥4 букв) пропали в новой деке. Слайды сопоставляются по номеру.
#   python3 tools/word_diff.py <source.pptx> <new.pptx> [offset]
import sys, re
from pptx import Presentation


def words(sl):
    t = []

    def walk(s):
        if s.shape_type == 6:
            for c in s.shapes: walk(c)
            return
        if s.has_text_frame: t.append(s.text_frame.text)
        if getattr(s, 'has_table', False) and s.has_table:
            for r in s.table.rows:
                for c in r.cells: t.append(c.text)
        if getattr(s, 'has_chart', False) and s.has_chart:
            for pl in s.chart.plots:
                t.extend(str(c) for c in pl.categories); t.extend(str(se.name) for se in pl.series)
    for sh in sl.shapes: walk(sh)
    try:
        t.append(sl.notes_slide.notes_text_frame.text)
    except Exception:
        pass
    txt = ' '.join(t).lower().replace('ё', 'е')
    return set(re.findall(r'[a-zа-я0-9]{4,}', txt))


a, b = Presentation(sys.argv[1]), Presentation(sys.argv[2])
tot = 0
for i, (x, y) in enumerate(zip(a.slides, b.slides), 1):
    miss = sorted(words(x) - words(y))
    if miss:
        tot += len(miss); print(i, 'missing:', ' '.join(miss[:40]))
print('total missing', tot)
