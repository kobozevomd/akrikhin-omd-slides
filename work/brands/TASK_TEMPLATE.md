# <Name> 2027 — особенности деки (дополнение к work/brands/BRAND_BRIEF.md)

<!-- Шаблон. Скопировать в work/brands/<brand>/TASK.md и заполнить по выводу tools/brand_new.py и просмотру
     листа превью исходника (tools/contact_sheet.py out/render/<brand>_src …). Удалить ненужные разделы. -->

Бренд: `<brand>`. Исходник `work/brands/<brand>/source.pptx`, **N слайдов**. Части: `decks/brands/<brand>/part_a…X.js` (по 4–6 слайдов на часть).
Акрихин × OMD, бренд <Название> (<что это за препарат, для кого>). Конкуренты: <…>. Сестринские бренды Акрихина в деке: <…>.
В тексте: «<Название>» по-русски, в латинских заголовках исходника — как в исходнике.

Рендеры исходника: `work/brands/<brand>/src/slide-NN.png` (NN = номер слайда исходника, скрытые тоже отрендерены). Тексты и данные: `src/slide-NN.txt` / `.json`, картинки — `src/media/`.

## 1. Общий модуль — `decks/brands/<brand>/common.js`
```js
const B = require('./common');   // SRC, MEDIA, CROPS, fromSource, video, stageTag, STAGE
```
`B.video(s, { media, cover, x, y, w, h, name, crop })` — видео из source.pptx побайтно (mp4 или avi, та же обложка, пропорции и обрезка кадра как в исходнике). Видео не менять — так попросил Роман.
`B.stageTag(s, 'EXPAND' | 'SPRINT' | 'FREQUENCY')` — только если в исходнике есть вертикальные метки этапов у левого края.

## 2. Видео
<из вывода brand_new.py: слайд, файл, обложка, размер кадра, обрезка, порядок слева направо; сверить подписи с длительностью>

## 3. Скрытые слайды
Слайды **<…>** в исходнике скрыты. Пересобираем так же и прячем: `s.s.hidden = true;`. Проверять рендером копии без скрытия: `python3 tools/deck_render.py out/brand_<brand>_part_X.pptx`.

## 4. Слайды-картинки
Картинка во весь слайд (сгенерированный макет) лежит на слайдах **<…>**. На части из них под или над картинкой есть живой текст (в `src/slide-NN.txt`). Ориентир — **итоговый вид на рендере** `src/slide-NN.png`: всё видимое переносим живым текстом. Если картинка лежит поверх старого живого текста — источник истины то, что видно. То, что только в картинке, читай по кускам с увеличением (PIL crop ×2–3 → `out/render/brand_<brand>_part_X/zoom/`), каждую цифру сверяй. Явные искажения букв генератором — исправляй и перечисляй в отчёте.
Фото людей, упаковки, креативы, скриншоты — вырезаем (PIL → `work/brands/<brand>/src/crops/<буква части>_*.png`) без искажения пропорций и без кусков соседнего текста. Декоративные 3D-иллюстрации и картинки-иконки не переносим (иконки Tabler или ничего).

## 5. Обложка
Слайд 1 — `d.cover({ title: '<Latin Name>' })`, подпись «Strategic approach 2027 by OMD» — как у остальных брендов серии. Фото с обложки исходника не переносим.

## 6. Аналоги в серии (единый вид — бери за основу, код можно копировать в свой файл)
Одобренные деки: Akrimycol, Dinobutin, Normobact, Bobotic, Azelik, Clindovit, Acriol (`decks/brands/<brand>/`, рендеры `out/render/<brand>_ru/` — NN = номер слайда исходника той деки; у Bobotic и Akrimycol один исходный слайд разбит на два, дальше номера сдвинуты на +1).
Типовые слайды серии и где взять образец:
- цели 2027 → Dinobutin 2, Normobact 2;
- offline / digital competitive landscape с графиками → Dinobutin 3–5, Normobact 3–5;
- ТВ-кейс конкурента с видео → Azelik 12, Akrimycol 5; креативы конкурентов с видео → Normobact 6, Azelik 15;
- сезонность-таблица → Dinobutin 9, Normobact 11; search demand dynamics → Dinobutin 8, Normobact 10;
- сегменты, оккейжены, CJM → Normobact 13, Dinobutin 11, Akrimycol 10–13; география → Dinobutin 10, Normobact 12;
- архитектура кампании vs 2026 → Dinobutin 17, Normobact 20, Bobotic 21;
- OLV / CTV цепочки Universe → охват → показы → бюджет → Bobotic 22, Dinobutin 19–20, Akrimycol 19;
- блогеры → Bobotic 25, Azelik 53; Paid Search → Normobact 22, Dinobutin 23;
- Digital support calendar → Dinobutin 24–26, Normobact 23, Akrimycol 24;
- «Что даёт рост инвестиций vs 2026» → Dinobutin 27, Normobact 24, Akrimycol 25.

## 7. Цвета (одинаково на всех слайдах деки)
Свой бренд — `C.blue`, главный конкурент — `C.crimson`, второй — `C.cyan`, остальные приглушённые. Этапы/слои деки: <например CREATE — C.crimson, CAPTURE — C.blue, REASSURE — C.purple, CONVERT — C.green; ALWAYS ON — C.navy, SPRINT — C.crimson>. Задаются в одной части и повторяются в остальных.

## 8. Прочее
Логотип «Акрихин 90 лет», красные полосы-подчёркивания, номера страниц исходника — не переносим (шапка `d.slide`). КАПС в заголовках — в обычный регистр (кроме аббревиатур и названий этапов).
