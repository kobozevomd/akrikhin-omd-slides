#!/usr/bin/env bash
# Сборка английской версии деки из русской: tools/build_en.sh <ru.pptx> <translations.json> <out.pptx>
# Перевод на месте (оформление и правки из PowerPoint сохраняются) → доводка вёрстки → точечные правки → проверка.
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$HERE")"
RU="$1"; TR="$2"; OUT="$3"
W="$(mktemp -d /tmp/en_build_XXXXXX)"
mkdir -p "$W/ru" "$W/en"
(cd "$W/ru" && unzip -q "$RU")
(cd "$W/en" && unzip -q "$RU")
python3 "$HERE/translate_pptx.py" apply "$W/en" "$ROOT/work/en/source.json" "$TR"
python3 "$HERE/en_layout_fix.py" "$W/ru" "$W/en"
python3 "$HERE/en_manual_fixes.py" "$W/en" "$ROOT/work/en/source.json" "$TR"
rm -f "$OUT"
(cd "$W/en" && zip -qXr "$OUT" '[Content_Types].xml' _rels docProps ppt)
rm -rf "$W"
python3 "$ROOT/tools/validate_pptx.py" "$OUT" | tail -1
python3 - "$OUT" << 'PY'
import sys, zipfile, re, io
z = zipfile.ZipFile(sys.argv[1]); bad = []
for n in z.namelist():
    d = z.read(n)
    if n.endswith('.xml') and re.search('[А-Яа-яЁё]', d.decode('utf-8', 'ignore')): bad.append(n)
    if n.endswith('.xlsx'):
        zz = zipfile.ZipFile(io.BytesIO(d))
        bad += [n + ':' + m for m in zz.namelist() if re.search('[А-Яа-яЁё]', zz.read(m).decode('utf-8', 'ignore'))]
print('кириллица осталась в:', bad if bad else 'нигде')
PY
