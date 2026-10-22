# Dinobutin 2027 — особенности деки (дополнение к work/brands/BRAND_BRIEF.md)

Бренд: `dinobutin`. Исходник `work/brands/dinobutin/source.pptx`, **27 слайдов**. Части: `decks/brands/dinobutin/part_a…f.js`.
Акрихин × OMD, бренд Динобутин (тримебутин для детей 3–10 лет: функциональные нарушения ЖКТ — боли и спазмы, вздутие, метеоризм, нестабильный стул). Запущен в 2025 (2027 — второй год после лонча). Главные конкуренты: Тримедат и Необутин (тот же тримебутин), Тримебутин. Сестринские бренды Акрихина: Нормобакт, Боботик.
В тексте: «Динобутин» по-русски, в латинских заголовках исходника — «Динобутин / …» как в исходнике (Dinobutin — латиница на обложке).

Рендеры исходника: `work/brands/dinobutin/src/slide-NN.png` (NN = номер слайда исходника, скрытый тоже отрендерен). Тексты и данные: `src/slide-NN.txt` / `.json`, картинки — `src/media/`.

## 1. Общий модуль — `decks/brands/dinobutin/common.js`
```js
const D = require('./common');   // SRC, MEDIA, CROPS, fromSource, video
```
`D.video(s, { media, cover, x, y, w, h, name })` — видео из source.pptx без изменений (тот же mp4 и обложка, пропорции не менять — так попросил Роман). Меток этапов нет — `stageTag` не используем.

## 2. Видео
- Слайд 6 (Competitive Analysis / Digital Creatives, Необутин): `media1.mp4` (обложка `image34.png`, 1920×1080, 16:9).
- Слайд 7 (Competitive Analysis / Digital Creatives, Тримедат): `media2.mp4` (`image39.png`), `media3.mp4` (`image40.png`), `media4.mp4` (`image41.png`) — все 854×480 (16:9). Без обрезки.

## 3. Скрытые слайды
Слайд **12** в исходнике скрыт. Пересобираем так же и прячем: `s.s.hidden = true;`. LibreOffice скрытые слайды не рендерит — для своей проверки делай копию pptx без ` show="0"` в `ppt/slides/slideN.xml` (Python zipfile) и рендери её.

## 4. Слайды-картинки
Картинка во весь слайд (сгенерированный макет) лежит на слайдах **2, 9, 11, 12, 14, 15, 16, 18, 19, 20**, на 13, 21, 22 — крупные картинки-креативы/фото. На части из них под или над картинкой есть живой текст (в `src/slide-NN.txt`). Ориентир — **итоговый вид на рендере** `src/slide-NN.png`: всё видимое переносим живым текстом. Если картинка лежит поверх старого живого текста — источник истины то, что видно. То, что только в картинке, читай по кускам с увеличением (PIL crop ×2–3 → свой PNG в `out/render/brand_dinobutin_part_X/zoom/`), каждую цифру сверяй. Явные искажения букв генератором — исправляй и перечисляй в отчёте.
Фото людей (мамы, дети, блогеры), упаковки, креативы — вырезаем (PIL → `work/brands/dinobutin/src/crops/<буква части>_*.png`) без искажения пропорций и без кусков соседнего текста. Декоративные 3D-иллюстрации и картинки-иконки не переносим (иконки Tabler или ничего).
Не используй символы, которых нет в Tahoma: U+2060 (word joiner), U+2011 (неразрывный дефис) — рисуются квадратиками. Неразрывный пробел U+00A0 — можно.

## 5. Обложка
Слайд 1 — `d.cover({ title: 'Dinobutin' })`, как у остальных брендов серии (подпись «Strategic approach 2027 by OMD»). Фото с обложки исходника не переносим.

## 6. Аналоги в серии (единый вид — бери за основу, код можно копировать в свой файл)
Одобренные деки: Normobact (`decks/brands/normobact/`, рендеры `out/render/normobact_ru/`, NN = номер слайда), Bobotic (`decks/brands/bobotic/`, `out/render/bobotic_ru/`, исходный 24 разбит на два → исходные 25–28 = рендеры 26–29), Azelik (`decks/brands/azelik/`, `out/render/azelik_ru_final/`), Clindovit (`decks/brands/clindovit/`, `out/render/clindovit_ru/`).
Структура этой деки почти совпадает с Normobact — бери прежде всего его:
- цели 2027 (Dinobutin 2) ≈ Normobact 2, Bobotic 2;
- offline / digital competitive landscape (3, 4, 5) ≈ Normobact 3, 4, 5 (`normobact/part_a.js`);
- креативы конкурентов с видео (6, 7) ≈ Normobact 6 (`normobact/part_b.js`), Azelik 15;
- search demand dynamics (8) ≈ Normobact 10, Bobotic 10; сезонность-таблица (9) ≈ Normobact 11, Clindovit 9;
- география (10) ≈ Normobact 12, Bobotic 9;
- проверка сегментов (11, 12) ≈ Normobact 13, Bobotic 14;
- креативная стратегия (13) ≈ Bobotic 18 (`bobotic/part_d.js`);
- переход 2026 → 2027 / от перехвата спроса к выбору (14, 15) ≈ Normobact 15, 19; Bobotic 12, 20;
- варианты распределения поддержки по году (16) ≈ Bobotic 19 (гант), Azelik 32;
- архитектура кампании vs 2026 (17) ≈ Normobact 20, Bobotic 21, Azelik 39 — здесь в 2027 три варианта бюджета V1/V2/V3;
- video value (18), CTV/OLV (19, 20) ≈ Bobotic 22 (OLV), Normobact 18;
- AI-production роликов (21) ≈ Azelik 44, Bobotic 23; блогеры (22) ≈ Bobotic 25 (в новой деке 26), Azelik 53; Paid Search (23) ≈ Normobact 22, Bobotic 26 (27);
- Digital support calendar — **три версии бюджета** (24, 25, 26) ≈ Normobact 23, Bobotic 27 (28): одна функция-сборщик на три слайда;
- «3 сценария инвестиций» (27) ≈ Normobact 24, Bobotic 28 (29), Azelik 59.

## 7. Прочее
Логотип «Акрихин 90 лет», красные полосы-подчёркивания, номера страниц исходника — не переносим (шапка `d.slide`). КАПС в заголовках — в обычный регистр (кроме аббревиатур и названий этапов/слоёв: CAPTURE & CONVERT, BUILD NEW DEMAND, PERSONALIZE CONSIDERATION, BUILD TRUST & SUPPORT CHOICE и т. п. — они остаются капсом как имена). Цвет Динобутина — синий (свой бренд), Тримедат — малиновый (главный конкурент), Необутин — второй акцент, остальные приглушённые; одинаково на всех слайдах.
