# Akrikhin × OMD — сборка презентаций в PowerPoint

Дизайн-система слайдов Акрихин × OMD (по фигме «INT Акрихин Продакшн», страница «Слайды Акрихин») и конвейер,
которым собираются презентации в стиле Акрихин: стратегии брендов Акрихин 2027 (RU + EN из одного кода) и любые другие деки.
Установка — `./install.sh` (зависимости + скилл), проверка окружения — `python3 tools/doctor.py`.
Пошаговые сценарии — в скилле `akrikhin-brand-deck` (`skills/akrikhin-brand-deck/`). Этот файл — карта проекта и правила.

## Где что лежит

- `DESIGN.md` — правила дизайн-системы: палитра, типографика, сетка 1920×1080 (координаты в px фигмы), компоненты,
  графики, раскладки. Читать перед любой вёрсткой.
- `lib/akrikhin.js` — библиотека поверх pptxgenjs (класс Deck / Slide: `d.cover`, `d.divider`, `d.slide({title, subtitle})`,
  `s.text`, `s.card`, `s.chart`, `s.table`, `s.image`, `s.icon('tb:TbName')`, `s.principle` …), `setTranslator` для EN.
  `lib/postprocess.js` — чистка OOXML после pptxgenjs (дубли id, обрезка видео, тип AVI, стиль мастера).
  Библиотеку меняем только осознанно: от неё зависят все деки.
- `decks/brands/build.js` — сборщик деки бренда; `decks/brands/<brand>/` — `brand.json`, `common.js`, `part_a…X.js`
  (ключ модуля = номер слайда исходника). `decks/brands/_template/common.js` — шаблон для нового бренда.
- `work/brands/` — брифы и всё про перевод:
  - `BRAND_BRIEF.md` — бриф верстальщика (единый вид, правила контента, грабли, отчёт);
  - `TASK_TEMPLATE.md` → `work/brands/<brand>/TASK.md` — особенности конкретной деки;
  - `TRANSLATOR_BRIEF.md`, `EDITOR_BRIEF.md`, `STYLE_GUIDE_EN.md`, `glossary_en.md` (общий глоссарий серии), `NOTES_TEMPLATE.md`
    → `work/brands/<brand>/tr/NOTES.md`; `tr_tools.py` (split / check / merge);
  - `work/brands/<brand>/` — `source.pptx`, `src/` (выгрузка исходника), `en.json`, `tr/` (батчи, out_K, edits, qa_N,
    en_extra), `upd/` (правки клиента).
- `tools/` — скрипты: `doctor.py` (окружение), `brand_new.py` (заготовка деки из .pptx), `extract_deck.py`, `deck_render.py`,
  `render.sh`, `contact_sheet.py`, `validate_pptx.py` (проверка перед отдачей), `deck_check.py` (видео, символы, EN),
  `upd_diff.py` (правки пользователя), `en_missing.py` (перевод изменённых строк), `outdir.py`, `word_diff.py`.
- Готовые файлы — в папке из `local.json` (`outDir`, по умолчанию `output/` в корне; путь печатает `python3 tools/outdir.py`):
  `<file>_RU.pptx` и `_EN.pptx`, где `<file>` — из `decks/brands/<slug>/brand.json`.
- Прочие деки (не серия брендов): `decks/comprehensive*`, `decks/variants`, `decks/redesign` — старые работы, образцы раскладок.

## Команды

```bash
node decks/brands/build.js <brand>                    # RU → <outDir>/<file>_RU.pptx
node decks/brands/build.js <brand> --part part_c      # одна часть → out/brand_<brand>_part_c.pptx
node decks/brands/build.js <brand> --record           # RU + work/brands/<brand>/strings_ru.json (строки для перевода)
node decks/brands/build.js <brand> --lang en          # EN → <outDir>/<file>_EN.pptx; без перевода → tr/missing.json
python3 tools/validate_pptx.py <deck.pptx>            # обязательна перед отдачей
python3 tools/deck_render.py <deck.pptx> [--en]       # PNG всех слайдов, включая скрытые; --en — английская локаль чисел
python3 tools/contact_sheet.py out/render/<имя> out/sheet.jpg --slides 1-9
python3 tools/deck_check.py <EN.pptx> --en --source work/brands/<brand>/source.pptx
python3 tools/upd_diff.py <моя RU.pptx> <правленая RU.pptx>
python3 tools/en_missing.py <brand> [--apply]
python3 work/brands/tr_tools.py split|check|merge <brand> …
```

Зависимости (`python3 tools/doctor.py` проверит и подскажет, что поставить): node (pptxgenjs, sharp, react-icons в node_modules), python3 (python-pptx, lxml, Pillow), LibreOffice (`soffice`),
poppler (`pdftoppm`), ffprobe. Шрифт Tahoma.

## Правила (не нарушать)

- **Править в основном файле.** Никаких `_v2`, `_final`, копий деки. Перед перезаписью `<outDir>/*.pptx` проверить, что файл не
  открыт в PowerPoint: нет `<outDir>/~$<имя>.pptx`.
- **Фигму не трогать** — только читать.
- **Контент клиента не переписывать.** Можно переставлять, делить на заголовок/пояснение, править опечатки и типографику.
  Нельзя перефразировать по смыслу, выкидывать пункты, придумывать цифры и выводы. Несходящиеся цифры исходника
  не исправлять молча — оставить и вынести в отчёт пользователю. Свои расчёты — с пометкой «расчёт OMD».
- **Видео из исходника — без изменений:** тот же файл (mp4/avi) и обложка, пропорции и обрезка кадра как в исходнике.
- **Скрытые слайды остаются скрытыми.**
- **Единый вид серии:** шапка только через `d.slide`, обложка `d.cover`, свой бренд синий, главный конкурент малиновый,
  одинаковые цвета этапов по всей деке; похожие слайды собирать по образцу уже одобренных брендов (см. TASK_TEMPLATE).
- **EN собирается тем же кодом.** Каждая фраза в part-файле — одной строкой целиком, без склейки русских кусков шаблонами;
  геометрия не завязана на длину русского текста. Перевод — только через `en.json` (out_K → edits → qa_N → en_extra).
  В EN не должно остаться кириллицы, ₽, ёлочек.
- **Символы:** не использовать U+2060 и U+2011 (нет в Tahoma). Диапазоны писать слитно («апр–июль»): « – » с пробелами
  типограф превращает в длинное тире.
- **Перед отдачей:** validate RU и EN, рендер, глазами по листу превью, `deck_check.py --en`, отчёт пользователю:
  что сделано, мои правки на подтверждение, несходящиеся цифры исходника, что уточнить для английской версии.

## Общение

Отвечать на языке пользователя (серия делалась по-русски), коротко и по делу. Деки с видео бывают > 30 МБ — предупреждать,
если файл нужно куда-то пересылать.
