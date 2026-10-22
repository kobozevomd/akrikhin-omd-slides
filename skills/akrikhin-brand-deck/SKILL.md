---
name: akrikhin-brand-deck
description: Build PowerPoint presentations in the Akrikhin × OMD design system (Акрихин) — any deck or slide «в стиле Акрихин», brand strategy decks (Акриол, Клиндовит, Азелик, Боботик, Нормобакт, Динобутин, Акримиколь…) rebuilt from a client .pptx into RU + EN versions, and client edits ported back from a returned RU file. Use whenever the user asks to make, rebuild, restyle or translate a presentation or slide for Akrikhin / Акрихин, says «в стиле Акрихин», «в дизайн-системе Акрихин», «следующая презентация», «правки по <бренду>», or mentions akrikhin_ds / akrikhin-omd-slides.
---

# Akrikhin brand deck

**Проект:** `{{AKRIKHIN_ROOT}}` (далее — корень). Путь подставляет `install.sh`. Если выше виден плейсхолдер в фигурных
скобках — корень = папка клонированного репозитория `akrikhin-omd-slides` (в ней лежат `AGENTS.md` и `lib/akrikhin.js`);
найди её и работай оттуда.

**Готовые деки** кладутся в папку из `local.json` (по умолчанию `output/` в корне): `OUT=$(python3 tools/outdir.py)`.

Перед работой:
1. `cd` в корень и `python3 tools/doctor.py`. Если не хватает обязательного — скажи пользователю, что поставить
   (команды печатает doctor), и не начинай вёрстку: без LibreOffice ты не увидишь слайды и не сможешь их проверить.
2. Прочитай `AGENTS.md` — карта проекта и правила, которые нельзя нарушать, — и `DESIGN.md` (дизайн-система).

Знания не дублируются здесь: правила вёрстки — `DESIGN.md` и `work/brands/BRAND_BRIEF.md`, перевод — брифы в `work/brands/`.
Тексты заданий для исполнителей — `references/prompts.md`, отчёт пользователю — `references/report.md`.

Выбери сценарий:
- **A. Дека из исходного .pptx** — пользователь дал презентацию и просит пересобрать её в стиле Акрихин
  (стратегия бренда, «следующая презентация» — или любая другая дека).
- **B. Правки** — пользователь вернул свою RU-деку с правками («правки по …», «с правками»).
- **C. Новая дека без .pptx-исходника** — из текста, документа, таблицы, тезисов, картинок.
- **D. Отдельные слайды** — «оформи этот слайд / эти несколько слайдов».

Английская версия — если пользователь её просит или это серия стратегий брендов (там всегда RU + EN). Иначе только RU.

Параллельность. Если умеешь запускать параллельных исполнителей — раздай части по шаблонам из `references/prompts.md`
(верстальщики по 4–6 слайдов, переводчики, 2 проверяющих, редактор, 2 вычитки носителем). Если не умеешь — делай те же шаги
сам, последовательно, часть за частью, по тем же брифам. Порядок и проверки не меняются. На каждом шаге коротко сообщай
пользователю, что делаешь.

## A. Дека из исходного .pptx

1. **Заготовка и разведка.**
   ```bash
   cd <корень>
   python3 tools/brand_new.py <slug> "<путь к исходнику>" --name "<Название латиницей>" [--file <Имя_файла>]
   python3 tools/contact_sheet.py out/render/<slug>_src out/<slug>_src_1.jpg --slides 1-9   # и 10-18, 19-27 …
   ```
   `<slug>` — латинское имя папки (`azelik`, `q3_review`), `--name` — заголовок обложки, `--file` — имя готового файла
   без `_RU/_EN` (для стратегий брендов не нужен: `Akrikhin_OMD_Strategy_<Name>_2027`). Для не-стратегий допиши в
   `decks/brands/<slug>/brand.json` поле `"title"` (свойство «Название» файла).
   Скрипт копирует исходник, выгружает тексты/данные графиков/картинки в `work/brands/<slug>/src/`, рендерит его
   (со скрытыми слайдами), создаёт `brand.json` и `common.js`, печатает скрытые слайды, видео, слайды-картинки, метки этапов.
   Посмотри листы превью целиком.
2. **TASK.md.** Скопируй `work/brands/TASK_TEMPLATE.md` → `work/brands/<slug>/TASK.md` и заполни: о чём дека, бренды
   и конкуренты, видео (файлы, обложки, порядок, обрезка; подписи длительностей сверь с ffprobe), скрытые, слайды-картинки,
   образцы похожих слайдов в уже собранных деках (см. раздел 6 шаблона), цвета. Разбей деку на части `part_a…` по 4–6
   слайдов; несколько версий одного слайда (календари под разные бюджеты) — одна функция-сборщик в одной части.
3. **Вёрстка частей** — шаблон «Верстальщик». Каждая часть: `node decks/brands/build.js <slug> --part part_x`,
   `python3 tools/validate_pptx.py out/brand_<slug>_part_x.pptx`, `python3 tools/deck_render.py out/brand_<slug>_part_x.pptx`,
   сверка каждого PNG с `work/brands/<slug>/src/slide-NN.png`. Части пишут только свои файлы.
4. **Сводка.** Прочитай отчёты частей. Собери: свои правки (на подтверждение), ошибки и несходящиеся цифры исходника,
   сомнения. Проверь, что цвета брендов/этапов совпадают между частями и шкалы столбцов от нуля (символы без глифа в Tahoma
   ловит `deck_check.py` на шаге 5). Спорные решения частей поправь сам.
5. **Сборка RU.**
   ```bash
   OUT=$(python3 tools/outdir.py); F=$(python3 -c "import json;print(json.load(open('decks/brands/<slug>/brand.json'))['file'])")
   node decks/brands/build.js <slug>
   python3 tools/validate_pptx.py "$OUT/${F}_RU.pptx"
   python3 tools/deck_check.py "$OUT/${F}_RU.pptx" --source work/brands/<slug>/source.pptx
   python3 tools/deck_render.py "$OUT/${F}_RU.pptx" --name <slug>_ru
   ```
   Если исходный слайд разбит на два, номера рендера дальше сдвигаются — учти в NOTES и заданиях.
6. **Проверка RU** — два проверяющих (шаблон «Проверяющий RU»), слайды пополам. После их правок — снова шаг 5.
   Если английская версия не нужна — переходи к шагу 10.
7. **Перевод.**
   ```bash
   node decks/brands/build.js <slug> --record --out out/<slug>_rec.pptx
   python3 work/brands/tr_tools.py split <slug> 4          # 4–6 батчей по ~7 тыс. знаков
   ```
   Заполни `work/brands/<slug>/tr/NOTES.md` по `work/brands/NOTES_TEMPLATE.md`. Переводчики — шаблон «Переводчик».
   Затем `python3 work/brands/tr_tools.py check <slug> all` и `merge <slug>`; редактор — шаблон «Редактор»
   (пишет `tr/edits.json`, дополняет общий `glossary_en.md`, перечисляет латинские строки в коде, которые надо поправить).
8. **Строки в коде и строки, поменявшиеся после перевода.** Латиница в part-файлах и строки, изменённые после записи,
   переводятся через `work/brands/<slug>/tr/en_extra.json` (ключ — точная строка из кода; строки с `caps: true` — КАПСОМ).
   ```bash
   node decks/brands/build.js <slug> --lang en          # строки без перевода → tr/missing.json
   python3 tools/en_missing.py <slug> [--apply]           # подсказки; --apply сам переносит правки чисел
   python3 work/brands/tr_tools.py merge <slug>
   ```
   Повторять, пока сборка EN не перестанет писать «Без перевода».
9. **Сборка EN и вычитка носителем.**
   ```bash
   node decks/brands/build.js <slug> --lang en
   python3 tools/validate_pptx.py "$OUT/${F}_EN.pptx"
   python3 tools/deck_check.py "$OUT/${F}_EN.pptx" --en --source work/brands/<slug>/source.pptx
   python3 tools/deck_render.py "$OUT/${F}_EN.pptx" --name <slug>_en --en
   ```
   Две вычитки (шаблон «Носитель», слайды пополам) пишут `tr/qa_1.json`, `tr/qa_2.json`; правки к строкам в коде —
   в `en_extra.json`. Потом merge, финальная сборка EN, `deck_check --en` с кодом выхода 0, рендер, глазами по листу превью.
10. **Отдача.** Пути к файлам + отчёт по `references/report.md`.

## B. Правки

Пользователь присылает свою RU-деку с правками (проверь, что приложен нужный файл: имя бренда и дата).
```bash
OUT=$(python3 tools/outdir.py)
mkdir -p work/brands/<slug>/upd
cp "<его файл>" work/brands/<slug>/upd/ru_upd.pptx
cp "$OUT/<file>_RU.pptx" work/brands/<slug>/upd/ru_mine.pptx
python3 tools/upd_diff.py work/brands/<slug>/upd/ru_mine.pptx work/brands/<slug>/upd/ru_upd.pptx
```
1. По каждому отличию найди строку в `decks/brands/<slug>/part_*.js` (grep по числу или фрагменту; в строках бывают
   ` ` и разметка `**…**`) и поправь там. Число на графике — меняй данные и, если нужно, шкалу (`max`).
2. Не переносить: таблицу, растянутую PowerPoint при открытии (upd_diff помечает), типографские огрехи правки
   (дефис вместо тире, двойной пробел) — оставь нашу типографику и упомяни в отчёте.
3. RU: сборка, validate, `upd_diff.py` новой RU против `ru_upd.pptx` — текст должен совпасть.
4. EN (если есть): сборка → `tools/en_missing.py <slug> --apply` → остальное вручную в `en_extra.json` по образцу старого EN →
   merge → сборка EN без «Без перевода» → `deck_check --en`.
5. Рендер изменённых слайдов, глазами. Отчёт: что поменялось по слайдам, что не переносил и почему, какие вопросы открыты.

## C. Новая дека без .pptx-исходника

1. Разбери материал (текст, документ, таблицу) в план слайдов: заголовок + главная мысль + содержимое каждого слайда.
   Покажи план пользователю, если материал допускает разные трактовки; иначе — сразу в работу.
2. `mkdir -p decks/brands/<slug> work/brands/<slug>`, `brand.json` вида
   `{ "name": "<Название>", "file": "<Имя_файла>", "slides": <N>, "title": "<Название файла>", "title_en": "<то же по-английски>" }`,
   `common.js` — копия `decks/brands/_template/common.js` с заменой `__BRAND__`/`__NAME__` (видео тут не нужны).
3. Для каждого слайда выбери архетип из `DESIGN.md` и ближайший образец в уже собранных деках (см. раздел 6
   `work/brands/TASK_TEMPLATE.md`), пиши части `part_a.js…` по правилам `BRAND_BRIEF.md` (ключ — номер слайда плана).
   Данные для графиков — из присланной таблицы; не выдумывай цифры.
4. Дальше — как в сценарии A с шага 3: сборка частей, проверка, RU, при необходимости EN, отдача.

## D. Отдельные слайды

Прочитай `DESIGN.md` (таблица архетипов), возьми ближайшую раскладку из `decks/` (серия брендов — лучший источник),
пиши `decks/<имя>.js` на `lib/akrikhin.js` по образцу `decks/_template.js`, собирай, `tools/validate_pptx.py`,
`tools/deck_render.py`, сверка с эталонами `reference/figma_slide_NN.png`. Смысл текста не переписывать;
служебные пометки — в заметки слайда, не на слайд.
