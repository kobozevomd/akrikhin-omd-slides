# Normobact L 2027 — особенности деки (дополнение к work/brands/BRAND_BRIEF.md)

Бренд: `normobact`. Исходник `work/brands/normobact/source.pptx`, **24 слайда**. Части: `decks/brands/normobact/part_a…e.js`.
Акрихин × OMD, бренд Нормобакт L (пробиотик / синбиотик для детей и взрослых, LGG — Lactobacillus rhamnosus GG). Конкуренты: Энтерол, Линекс, Бифиформ, Аципол, Максилак (Бэби), Bac-Set, бифидумбактерин. Сестринские бренды Акрихина в связке: Динобутин, Боботик.
В тексте: «Нормобакт» / «Нормобакт L» по-русски, в латинских заголовках исходника — «Нормобакт / …» как в исходнике (Normobact L — латиница на обложке).

Рендеры исходника: `work/brands/normobact/src/slide-NN.png` (NN = номер слайда исходника, скрытые тоже отрендерены). Тексты и данные: `src/slide-NN.txt` / `.json`, картинки — `src/media/`.

## 1. Общий модуль — `decks/brands/normobact/common.js`
```js
const N = require('./common');   // SRC, MEDIA, CROPS, fromSource, video
```
`N.video(s, { media, cover, x, y, w, h, name })` — видео из source.pptx без изменений (тот же mp4 и обложка, пропорции не менять — так попросил Роман). Меток этапов в этой деке нет — `stageTag` не используем.

## 2. Видео
Слайд 6 («Competitive Analysis / Digital Creatives»): четыре видео 16:9 без обрезки — `media1.mp4` (Линекс, обложка `image32.png`, 480×270), `media2.mp4` (Энтерол, `image33.png`, 1920×1080), `media3.mp4` (Энтерол, `image34.png`, 1920×1080), `media4.mp4` (Энтерол, `image35.png`, 1920×1080).

## 3. Скрытые слайды
Слайды **8, 9, 12** в исходнике скрыты. Пересобираем так же и прячем: `s.s.hidden = true;`. LibreOffice скрытые слайды не рендерит — для своей проверки делай копию pptx без ` show="0"` в `ppt/slides/slideN.xml` (Python zipfile) и рендери её.

## 4. Слайды-картинки
Картинка во весь слайд (сгенерированный макет) лежит на слайдах **2, 8, 9, 11, 13, 14, 15, 16, 17, 18, 19, 21, 22**. На части из них под или над картинкой есть живой текст (в `src/slide-NN.txt`). Ориентир — **итоговый вид на рендере** `src/slide-NN.png`: всё видимое переносим живым текстом. Если картинка лежит поверх старого живого текста — источник истины то, что видно. То, что только в картинке, читай по кускам с увеличением (PIL crop ×2–3 → свой PNG в `out/render/brand_normobact_part_X/zoom/`), каждую цифру сверяй. Явные искажения букв генератором — исправляй и перечисляй в отчёте.
Фото людей (мамы, дети), упаковки, мокапы сайтов и креативов — вырезаем (PIL → `work/brands/normobact/src/crops/<буква части>_*.png`) без искажения пропорций и без кусков соседнего текста. Декоративные 3D-иллюстрации и иконки-картинки не переносим (иконки Tabler или ничего).

## 5. Обложка
Слайд 1 — `d.cover({ title: 'Normobact L' })`, как у остальных брендов серии (подпись «Strategic approach 2027 by OMD» — так же, как у них). Фото с обложки исходника не переносим.

## 6. Аналоги в серии (единый вид — бери за основу, код можно копировать в свой файл)
Одобренные деки: Acriol Pro (`decks/brands/acriol/`, `out/render/acriol_ru/`), Clindovit (`decks/brands/clindovit/`, `out/render/clindovit_ru/`), Azelik (`decks/brands/azelik/`, `out/render/azelik_ru_final/`), Bobotic (`decks/brands/bobotic/`, `out/render/bobotic_ru/` — NN = номер слайда исходника Bobotic для 1–24, исходный 24 разбит на два, исходные 25–28 → 26–29).
- цели 2027 (Normobact 2) ≈ Bobotic 2, Clindovit 2;
- offline / digital competitive landscape с графиками (3, 4, 5) ≈ Bobotic 3–4, Azelik 11–14, Clindovit 3 (ТВ-инвестиции — Azelik 12);
- креативы конкурентов (6, 7) ≈ Azelik 15, Clindovit 4, Bobotic 5 (видео — как в Azelik 15);
- search demand dynamics (10) ≈ Bobotic 10, Azelik 16; сезонность-таблица (11) ≈ Clindovit 9;
- география (12) ≈ Bobotic 9, Acriol 10;
- сегменты (13), связка брендов (14), learnings (15) ≈ Bobotic 14, 11–12; Azelik 17;
- приоритеты / путь / коммуникация (16–19) ≈ Bobotic 15–17, 20; Clindovit 8, 11;
- архитектура кампании vs 2026 (20) ≈ Bobotic 21, Azelik 39, Clindovit 12;
- внешние публикации (21) ≈ Azelik 54; Paid Search (22) ≈ Bobotic 26 (в новой деке 27), Azelik 56;
- Digital support calendar flowchart (23) ≈ Bobotic 27 (в новой деке 28), Azelik 58;
- «Что даёт рост инвестиций vs 2026» (24) ≈ Bobotic 28 (в новой деке 29), Azelik 59.

## 7. Прочее
Логотип «Акрихин 90 лет», красные полосы-подчёркивания, номера страниц исходника — не переносим (шапка `d.slide`). КАПС в заголовках — в обычный регистр (кроме аббревиатур и названий этапов/слоёв, которые в серии пишутся капсом как имена).
