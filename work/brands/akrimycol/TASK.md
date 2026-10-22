# Akrimycol 2027 — особенности деки (дополнение к work/brands/BRAND_BRIEF.md)

Бренд: `akrimycol`. Исходник `work/brands/akrimycol/source.pptx`, **25 слайдов**, скрытых нет. Части: `decks/brands/akrimycol/part_a…e.js`.
Акрихин × OMD, бренд Акримиколь (противогрибковый крем: грибок кожи / стопы, разноцветный и отрубевидный лишай). Сейчас ~50% продаж идёт через врачебные выписки, в 2027 промо на врачей снижается — digital должен компенсировать и перевести выбор в consumer self-choice. Конкуренты: Залаин, Экзодерил, Офломил, Фунгодерил, Мизол Эвалар, Розилак, Ламизил (ТВ-кейс 2004–2015), Тербинафин, Микодерил и др.
В тексте: «Акримиколь» по-русски, в латинских заголовках исходника — «Acrimycol / …» как в исходнике (Akrimycol — латиница на обложке).

Рендеры исходника: `work/brands/akrimycol/src/slide-NN.png` (NN = номер слайда исходника). Тексты и данные: `src/slide-NN.txt` / `.json`, картинки — `src/media/`.

## 1. Общий модуль — `decks/brands/akrimycol/common.js`
```js
const K = require('./common');   // SRC, MEDIA, CROPS, fromSource, video
```
`K.video(s, { media, cover, x, y, w, h, name })` — видео из source.pptx без изменений (тот же файл, mp4 или avi, та же обложка, пропорции не менять — так попросил Роман). Меток этапов нет.

## 2. Видео
- Слайд 5 (Lamisil / TV campaign): три ролика **AVI** 352×288 — `media3.avi` (обложка `image37.png`, «5 sec»), `media2.avi` (`image36.png`, «10 sec»), `media1.avi` (`image35.png`, «15 sec»). Порядок слева направо в исходнике: 5 / 10 / 15 sec = media3, media2, media1 (проверь по координатам в `src/slide-05.txt`). Пропорция 352:288.
- Слайд 7 (Competitive Analysis / Creative): шесть mp4 — `media4.mp4` (Залаин, `image39.png`, 640×360), `media5.mp4` (Экзодерил, `image40.png`, 1920×1080), `media6.mp4` (Офломил, `image41.png`, 352×288), `media7.mp4` (Фунгодерил, `image42.png`, 640×360), `media8.mp4` (Мизол Эвалар, `image43.png`, 640×360), `media9.mp4` (Розилак, `image44.png`, 352×288). Сверь подписи брендов с позициями видео в `src/slide-07.txt`.

## 3. Слайды-картинки
Картинка во весь слайд (сгенерированный макет) лежит на слайдах **2, 3, 8, 10, 11, 12, 13, 14, 17, 18, 19, 20, 21, 22, 23**. На части из них под или над картинкой есть живой текст (в `src/slide-NN.txt`). Ориентир — **итоговый вид на рендере** `src/slide-NN.png`: всё видимое переносим живым текстом. Если картинка лежит поверх старого живого текста — источник истины то, что видно. То, что только в картинке, читай по кускам с увеличением (PIL crop ×2–3 → свой PNG в `out/render/brand_akrimycol_part_X/zoom/`), каждую цифру сверяй. Явные искажения букв генератором — исправляй и перечисляй в отчёте.
Фото (ноги, кожа, люди), упаковки, креативы, скриншоты (Авито и т. п.) — вырезаем (PIL → `work/brands/akrimycol/src/crops/<буква части>_*.png`) без искажения пропорций и без кусков соседнего текста. Декоративные 3D-иллюстрации и картинки-иконки не переносим (иконки Tabler или ничего).
Не используй символы, которых нет в Tahoma: U+2060, U+2011 — рисуются квадратиками. Неразрывный пробел U+00A0 — можно. Диапазоны дат и периодов пиши слитно («апр–июль», «Jan–Mar») — типограф превращает « – » с пробелами в длинное тире.

## 4. Обложка
Слайд 1 — `d.cover({ title: 'Akrimycol' })`, как у остальных брендов серии (подпись «Strategic approach 2027 by OMD»).

## 5. Аналоги в серии (единый вид — бери за основу, код можно копировать в свой файл)
Одобренные деки: Dinobutin (`decks/brands/dinobutin/`, рендеры `out/render/dinobutin_ru/`), Normobact (`decks/brands/normobact/`, `out/render/normobact_ru/`), Bobotic (`decks/brands/bobotic/`, `out/render/bobotic_ru/` — исходные 25–28 = рендеры 26–29), Azelik (`decks/brands/azelik/`, `out/render/azelik_ru_final/`), Clindovit (`decks/brands/clindovit/`, `out/render/clindovit_ru/`). NN в рендерах = номер слайда исходника той деки (кроме оговорки по Bobotic).
- цели 2027 (2) ≈ Dinobutin 2, Normobact 2; «Digital должен компенсировать…» (3) ≈ Clindovit 8, Bobotic 12;
- offline / digital competitive landscape (4, 6) ≈ Dinobutin 3, 5; Normobact 3, 5;
- ТВ-кейс Ламизила с видео (5) ≈ Azelik 12 (Basiron AC / TV activity: `decks/brands/azelik/part_b.js` ключ 12) — та же подача;
- креативы конкурентов с видео (7) ≈ Normobact 6, Azelik 15, Dinobutin 6–7;
- сезонность-таблица (8) ≈ Dinobutin 9, Normobact 11; search demand dynamics (9) ≈ Dinobutin 8, Normobact 10;
- сегменты (10), оккейжены (11), CJM (12, 13) ≈ Normobact 13, Dinobutin 11, Bobotic 14–15, Clindovit 10;
- география (14) ≈ Dinobutin 10, Normobact 12; сезонность 2027 / медиадавление (15) ≈ Bobotic 19, Dinobutin 16;
- архитектура кампании vs 2026 (16) ≈ Dinobutin 17, Normobact 20, Bobotic 21 — та же подача;
- роли каналов (17) ≈ Bobotic 20, Dinobutin 15; модульная видео-персонализация (18) ≈ Azelik 44, Dinobutin 21;
- OLV двумя волнами (19) ≈ Bobotic 22, Dinobutin 19–20; календарь баннеров (20) ≈ Azelik 32;
- AI targeting (21) ≈ Azelik 52, Bobotic 24; Авито (22) — новый формат, подача как у карточек Azelik 41–43;
- Paid Search (23) ≈ Normobact 22, Dinobutin 23;
- Digital support calendar (24) ≈ Dinobutin 24, Normobact 23;
- «Что даёт рост инвестиций vs 2026» (25) ≈ Dinobutin 27, Normobact 24.

## 6. Прочее
Логотип «Акрихин 90 лет», красные полосы-подчёркивания, номера страниц исходника — не переносим (шапка `d.slide`). КАПС в заголовках — в обычный регистр (кроме аббревиатур и названий этапов/слоёв: CREATE / CAPTURE / REASSURE / CONVERT, ALWAYS ON, SPRINT и т. п.).
Цвета: Акримиколь — синий (свой бренд), главный конкурент Залаин — малиновый, Экзодерил — второй акцент C.cyan, остальные приглушённые; одинаково на всех слайдах. Этапы CREATE / CAPTURE / REASSURE / CONVERT (17, 25) и слои на 16, 24 — задай в части D (слайд 16–17) и повтори в части E (24–25): CREATE — C.crimson, CAPTURE — C.blue, REASSURE — C.purple, CONVERT — C.green; ALWAYS ON — C.navy, SPRINT — C.crimson.
