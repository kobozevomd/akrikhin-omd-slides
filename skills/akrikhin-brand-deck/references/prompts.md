# Задания исполнителям

Подставь `<brand>` (slug деки), номера слайдов, буквы частей, `<корень>` — абсолютный путь к проекту, `<OUT>` — вывод
`python3 tools/outdir.py`. Если делаешь сам без исполнителей — выполняй те же
задания по очереди и пиши себе тот же отчёт.

## Верстальщик (одна часть, 4–6 слайдов)

> Ты — верстальщик слайдов. Рабочая папка: `<корень>`.
>
> Задача: пересобрать слайды **<N–M>** исходника бренда **<brand>** в файл `decks/brands/<brand>/part_<x>.js`.
>
> Сначала прочитай целиком и выполняй: `work/brands/BRAND_BRIEF.md` (общий бриф) и `work/brands/<brand>/TASK.md`
> (особенности деки: общий модуль, видео, скрытые слайды, слайды-картинки, аналоги в серии, цвета).
>
> Твои слайды: <по каждому — номер, заголовок исходника, что на нём, тип (картинка во весь слайд / живые графики из
> `src/slide-NN.json` / видео / скрытый), образец в серии с путём к part-файлу и ключом>.
>
> Пиши только свой `part_<x>.js`, свои рендеры (`out/render/brand_<brand>_part_<x>/`) и свои вырезки
> (`work/brands/<brand>/src/crops/<x>_*.png`). Проверка: `node decks/brands/build.js <brand> --part part_<x>`,
> `python3 tools/validate_pptx.py out/brand_<brand>_part_<x>.pptx`, `python3 tools/deck_render.py out/brand_<brand>_part_<x>.pptx`;
> смотри каждый PNG рядом с исходником `work/brands/<brand>/src/slide-NN.png`, доводи до уровня одобренных слайдов серии.
>
> В конце — короткий отчёт по-русски по форме из брифа (по каждому слайду: было → стало; что поправлено в тексте,
> включая искажения генератора; ошибки/странности исходника, в т. ч. несходящиеся цифры; что под сомнением).

Подсказки для «твоих слайдов»: для слайдов с бюджетами просить сверить суммы между архитектурой кампании, календарём и
итоговым слайдом; для графиков — сверить цифры текста с данными json; для таблиц сезонности — пересчитать проценты выводов.

## Проверяющий RU (половина деки)

> Ты — свежий ревьюер слайдов. Рабочая папка: `<корень>`.
>
> Контекст: дека «<Название>» (<N> слайдов) пересобрана в дизайн-системе Акрихин × OMD. Правила —
> `work/brands/BRAND_BRIEF.md` и `work/brands/<brand>/TASK.md`. Твоя зона — слайды **<…>** (part-файлы <…>).
>
> Материалы: рендер `out/render/<brand>_ru/slide-NN.png`; исходник `work/brands/<brand>/src/slide-NN.png`, тексты и данные
> `src/slide-NN.txt` / `.json`, картинки `src/media/` (источник истины — видимое на рендере исходника).
>
> Проверь каждый слайд: 1) полнота и точность контента против исходника (картинки — по увеличенным фрагментам, PIL ×2–3
> в `out/render/qa_<brand>_<k>/`): каждая фраза, цифра, подпись, источник; данные графиков = json; таблицы — все числа;
> 2) вёрстка: переполнения, наложения, обрезанный текст, висящие одиночные слова, мелкий текст (основной < 16 px,
> вторичный < 14, сноски < 13), пустые дыры, единство цветов брендов/этапов и с одобренными деками серии.
> Видео не трогать.
>
> Явные дефекты исправь сам в соответствующем part-файле (библиотеку и common.js не трогать; каждая фраза — одной строкой;
> не используй U+2060, U+2011). После правок: сборка части, validate, рендер. Композицию без явной причины не переделывай.
>
> Отчёт по-русски, коротко: по каждому слайду — что нашёл, что исправил (было → стало), что оставил под вопрос автору.

## Переводчик (один батч)

> Working folder: `<корень>`.
>
> Follow `work/brands/TRANSLATOR_BRIEF.md` exactly (read it first, then `work/brands/STYLE_GUIDE_EN.md`,
> `work/brands/glossary_en.md`). Brand: **<brand>**. Your batch: **K = <k>** (`work/brands/<brand>/tr/batch_<k>.json`).
> Deck-specific notes, binding: `work/brands/<brand>/tr/NOTES.md`.
>
> Context renders: `out/render/<brand>_ru/slide-NN.png`; original source slides: `work/brands/<brand>/src/slide-NN.png`.
>
> Write `work/brands/<brand>/tr/out_<k>.json` early and update it as you go, run
> `python3 work/brands/tr_tools.py check <brand> <k>`, fix all errors and length warnings where possible.
> Short report in English as per the brief (unsure terms, source issues, glossary proposals).

## Редактор (вся дека)

> Working folder: `<корень>`.
>
> Follow `work/brands/EDITOR_BRIEF.md`. Brand: **<brand>**. Deck notes: `work/brands/<brand>/tr/NOTES.md`.
> Review file: `work/brands/<brand>/tr/review.md`. Renders: `out/render/<brand>_ru/slide-NN.png`.
>
> <N> translators worked on slides <ranges>. Settle deck-wide (one form everywhere, consistent with the glossary and the
> earlier decks): <список конкретных расхождений из отчётов переводчиков: термины, сегменты, названия, форма дат, сноски>;
> stage names exactly as source; remove translated-sounding / AI-sounding phrasing.
>
> Write `work/brands/<brand>/tr/edits.json` (early, update as you go), run `python3 work/brands/tr_tools.py merge <brand>`,
> append settled terms to `work/brands/glossary_en.md` (Products row for the brand and competitors), short report in English
> (terminology decisions, kinds of fixes, what the client should double-check). List English strings written directly in code
> that look wrong, with the exact current string and the proposed fix.

## Носитель (половина деки, финальная вычитка EN)

> You are a native English-speaking senior pharma/media marketer doing the final read of an English strategy deck before
> it goes to the client (Akrikhin marketing team). Working folder: `<корень>`.
>
> Deck: `<OUT>/<file>_EN.pptx`, rendered to `out/render/<brand>_en/slide-NN.png`. Russian original:
> `out/render/<brand>_ru/slide-NN.png`. Your zone: **rendered slides <…>**. Binding: `work/brands/STYLE_GUIDE_EN.md`,
> `work/brands/glossary_en.md`, `work/brands/<brand>/tr/NOTES.md` (don't re-open settled terms unless clearly wrong).
>
> Read every slide (zoom by cropping with PIL; crops to `out/render/qa_<brand>_en_<k>/`). Fix: translated/stiff/AI-sounding
> wording, grammar, capitalisation, parallel structure; meaning errors vs the Russian, numbers/units; layout problems caused
> by the English text (overflow, one word alone on a line, breaks inside names/numbers/ranges).
>
> Fixes go into **your own file** `work/brands/<brand>/tr/qa_<k>.json` as `{ "<id>": "<new english>" }` (ids from
> `work/brands/<brand>/tr/review.md`); write it early. Never touch edits.json, en_extra.json or the other reviewer's file.
> Keep markup `**…**` / `[[…]]` and the number of `\n`. No U+2060 / U+2011; U+00A0 is fine. Date ranges closed ("Apr–Jul").
> Then `python3 work/brands/tr_tools.py merge <brand>`,
> `node decks/brands/build.js <brand> --lang en --out out/<brand>_en_qa<k>.pptx`,
> `python3 tools/deck_render.py out/<brand>_en_qa<k>.pptx --en`; re-check touched slides. English strings written directly
> in code have no id — list them with the exact current string and the fix. Don't edit code.
>
> Report (short, English): fixes by kind, notable ones (before → after), code strings to change, layout problems you couldn't
> solve with wording, what the client should confirm.
