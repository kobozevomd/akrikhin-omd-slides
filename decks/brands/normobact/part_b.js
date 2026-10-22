// Нормобакт L · стратегия 2027 — часть B: слайды исходника 6–10
// 6 — Competitive Analysis / Digital Creatives: OLV Линекса и Энтерола (4 видео без изменений) + display Бифиформа (аналог — Azelik 15);
// 7 — Competitive Analysis / Digital Creatives: e-com / e-pharm промо Линекса, Энтерола, Бифиформа, Максилака (аналог — Clindovit 4, Bobotic 5);
// 8 — креативы Нормобакт L vs Энтерол (скрытый; картинка-макет во весь слайд → живой текст + вырезанные креативы);
// 9 — посадочные normobact.ru vs enterol.ru (скрытый; картинка-макет → живой текст + вырезанные скриншоты);
// 10 — Search demand dynamics 2026: Wordstat и Ozon (аналог — Bobotic 10, Azelik 16).
const path = require('path');
const { C, columns, chartMap, textWidth, countLines, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT, MUTED, GRID
const N = require('./common');                            // SRC, MEDIA, CROPS, fromSource, video
const SRC = N.SRC;
const MEDIA = N.MEDIA;
const CROPS = N.CROPS;

const TOP = V.TOP;   // 221 — верх контента
const BOT = V.BOT;   // 1005 — низ контента без плашки
const CB = 905;      // низ контента над плашкой
const X0 = 58;
const X1 = 1862;
const MUTED = V.MUTED;
const GRID = V.GRID;

// ---------- помощники ----------
// Высота и ширина текста так же, как их оценивает s.text — по переведённой строке (EN-сборка пересчитает геометрию)
const plainTr = (text) => typo(tr(String(text))).replace(/\*\*|\[\[|\]\]/g, '');
const measure = (text, w, size = 18, bold = false, lh = 1.2) =>
  Math.round(countLines(plainTr(text), size, w, bold) * size * lh);
const widthOf = (text, size, bold = false) => textWidth(plainTr(text), size, bold);

const charts = (n) => require(path.join(SRC, `slide-${String(n).padStart(2, '0')}.json`))
  .shapes.filter((sh) => sh.t === 'CHART').map((sh) => sh.chart);
// Excel-дата (46020) → 'гггг-мм-дд'
const xlDate = (n) => new Date(Date.UTC(1899, 11, 30) + Number(n) * 86400000).toISOString().slice(0, 10);
const ddmm = (iso) => `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}`;
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const hex = (n) => Math.round(n).toString(16).padStart(2, '0');
// смешение цветов: t = 0 → a, t = 1 → b
const mix = (a, b, t) => [0, 2, 4].map((k) => hex(parseInt(a.substr(k, 2), 16) * (1 - t) + parseInt(b.substr(k, 2), 16) * t)).join('').toUpperCase();
const BAND = mix('FFFFFF', C.crimson, 0.08);   // подсветка периода сравнения
const BASE = mix('FFFFFF', C.blue, 0.07);      // подсветка базового периода

// Легенда точками в строку, выровненная по правому краю xr (ширины — по переведённому тексту)
function legendRow(s, xr, y, items, { size = 17, gap = 26 } = {}) {
  const ws = items.map(([, t]) => Math.ceil(widthOf(t, size)) + 4);
  let x = xr - ws.reduce((a, w) => a + 28 + w, 0) - gap * (items.length - 1);
  items.forEach(([color, t], k) => {
    s.circle({ x, y: y + (size * 1.2 - 16) / 2, d: 16, fill: color });
    s.text(t, { x: x + 26, y, w: ws[k], size, color: C.navy });
    x += 28 + ws[k] + gap;
  });
}

// Подписи месяцев под осью недель: подпись по центру своей группы + тонкие разделители
function monthAxis(s, m, groups, y, { size = 15 } = {}) {
  let i0 = 0;
  groups.forEach(([mo, n], gi) => {
    const xa = m.cat(i0) - m.step / 2;
    const xb = m.cat(i0 + n - 1) + m.step / 2;
    const lw = Math.max(xb - xa, Math.ceil(widthOf(mo, size, true)) + 12);
    s.text(mo, { x: (xa + xb) / 2 - lw / 2, y: y + 6, w: lw, size, bold: true, color: C.navy, align: 'center' });
    if (gi > 0) s.seg(xa, y, xa, y + 26, { color: C.line, width: 1.5 });
    i0 += n;
  });
}

// Цветная пилюля с подписью справа в строку (заголовок колонки на слайдах 8–9, как в исходнике)
function pillHead(s, { x, y, w, text, color, caps = true, note }) {
  const pw = Math.min(w * 0.45, Math.max(220, Math.ceil(widthOf(caps ? String(tr(text)).toUpperCase() : text, 22, true)) + 64));
  s.pill(text, { x, y, w: pw, h: 50, color, size: 22, caps });
  if (note) s.text(note, { x: x + pw + 22, y: y + 12, w: w - pw - 22, h: 26, size: 19, color: C.blueText, fit: true, minSize: 15 });
}

module.exports = {
  // =====================================================================
  // 6 · Competitive Analysis / Digital Creatives — OLV (видео) и display
  // =====================================================================
  6: (d) => {
    const s = d.slide({
      title: 'Competitive Analysis / Digital Creatives',
      subtitle: 'В 2026 году конкуренты активно размещаются в OLV и display. Отличительная черта Энтерол и Бифиформ — оккейжены под ситуации применения',
    });
    const PAD = 30;
    const G = 16;
    const CG = 20;
    // ряд 1: видео 16:9 из исходника без изменений — один ролик Линекса, три ролика Энтерола
    const VW = (X1 - X0 - CG - 4 * PAD - 3 * G) / 4;
    const VH = VW * 9 / 16;
    const LXW = VW + 2 * PAD;
    const R1 = TOP;
    const vy = R1 + 104;
    const R1H = vy - R1 + VH + PAD;
    s.card({ x: X0, y: R1, w: LXW, h: R1H });
    s.label('Линекс', { x: X0 + PAD, y: R1 + 26, w: LXW - 2 * PAD, color: C.blue });
    N.video(s, { media: 'media1.mp4', cover: 'image32.png', x: X0 + PAD, y: vy, w: VW, h: VH, name: 'Линекс — OLV-ролик' });

    const EX = X0 + LXW + CG;
    const EW = X1 - EX;
    s.card({ x: EX, y: R1, w: EW, h: R1H });
    s.label('Энтерол', { x: EX + PAD, y: R1 + 26, w: 400, color: C.blue });
    s.text('Коммуникация под оккейжены «диарея» и «антибиотики»', { x: EX + PAD, y: R1 + 58, w: EW - 2 * PAD, h: 26, size: 19, color: C.blueText, fit: true, minSize: 16 });
    [['media2.mp4', 'image33.png'], ['media3.mp4', 'image34.png'], ['media4.mp4', 'image35.png']].forEach(([media, cover], k) => {
      N.video(s, { media, cover, x: EX + PAD + k * (VW + G), y: vy, w: VW, h: VH, name: `Энтерол — OLV-ролик ${k + 1}` });
    });

    // ряд 2: display Бифиформа — четыре креатива в пропорциях файлов
    const R2 = R1 + R1H + CG;
    const R2H = BOT - R2;
    s.card({ x: X0, y: R2, w: X1 - X0, h: R2H });
    s.label('Бифиформ', { x: X0 + PAD, y: R2 + 26, w: 400, color: C.blue });
    s.text('Коммуникация под оккейжены «диарея», «период отпусков», «антибиотики» и сезонное промо в период аллергии',
      { x: X0 + PAD, y: R2 + 58, w: X1 - X0 - 2 * PAD, h: 26, size: 19, color: C.blueText, fit: true, minSize: 16 });
    const imgs = [
      { f: 'img_ca707d4378.png', r: 1248 / 1249 },
      { f: 'img_941b5f529c.png', r: 936 / 936 },
      { f: 'img_22142ff3c9.jpg', r: 640 / 427 },
      { f: 'img_b7317f6f40.jpg', r: 1230 / 420 },
    ];
    const iw = X1 - X0 - 2 * PAD - G * (imgs.length - 1);
    const IH = Math.min(iw / imgs.reduce((a, im) => a + im.r, 0), R2H - 104 - PAD);
    let x = X0 + PAD;
    const iy = R2 + 104 + (R2H - 104 - PAD - IH) / 2;
    imgs.forEach((im) => {
      s.image(path.join(MEDIA, im.f), { x, y: iy, w: IH * im.r, h: IH, alt: 'Бифиформ — display-креатив' });
      x += IH * im.r + G;
    });
  },

  // =====================================================================
  // 7 · Competitive Analysis / Digital Creatives — e-com / e-pharm промо
  // Механика акций слева — текст с самих креативов (для читаемости), справа — креатив
  // =====================================================================
  7: (d) => {
    const s = d.slide({
      title: 'Competitive Analysis / Digital Creatives',
      subtitle: 'Все конкуренты присутствуют в e-com / e-pharm в моно- или ко-промо кампаниях',
    });
    const cols = columns(2, { gap: 20 });
    const CH = (BOT - TOP - 20) / 2;
    const PAD = 26;
    const items = [
      { brand: 'Линекс', f: 'img_4b462d4bf6.jpg', r: 810 / 540, offer: '**Скидка −40%** за 2 упаковки', when: '17.06.26–31.07.26' },
      { brand: 'Энтерол', f: 'img_7bb2305237.jpg', r: 810 / 540, offer: '**Скидка 260 ₽** на 2-ю упаковку', when: 'с 1 по 30 апреля 2026 года' },
      { brand: 'Бифиформ', f: 'img_efb3b97421.png', r: 1, offer: '**Скидки до −20%**', when: 'с 01.06.2026 по 30.06.2026' },
      { brand: 'Максилак', f: 'img_84cc5ab6fd.jpg', r: 810 / 540, offer: '**Товар дня:** товары по специальной цене', when: '01.06.2026–30.06.2026' },
    ];
    items.forEach((it, k) => {
      const c = cols[k % 2];
      const y = TOP + Math.floor(k / 2) * (CH + 20);
      s.card({ x: c.x, y, w: c.w, h: CH });
      const IH = CH - 2 * PAD;
      const IW = IH * it.r;
      const ix = c.x + c.w - PAD - IW;
      s.image(path.join(MEDIA, it.f), { x: ix, y: y + PAD, w: IW, h: IH, alt: `${it.brand} — промо в e-com / e-pharm` });
      const tx = c.x + 30;
      const tw = ix - 30 - tx;
      s.label(it.brand, { x: tx, y: y + 30, w: tw, size: 26, color: C.blue });
      s.icon('tb:TbShoppingCart', { x: tx, y: y + 78, size: 36, color: C.white, circle: C.crimson });
      let ty = y + 130;
      ty += s.text(it.offer, { x: tx, y: ty, w: tw, size: 21, color: C.navy }) + 8;
      s.text(it.when, { x: tx, y: ty, w: tw, size: 17, color: C.blueText });
    });
  },

  // =====================================================================
  // 8 · Креативные материалы Нормобакт L vs Энтерол (скрытый)
  // В исходнике — картинка-макет во весь слайд. Текст — живым, креативы вырезаны из картинки (crops/b_08_*.png).
  // =====================================================================
  8: (d) => {
    const s = d.slide({
      title: 'Креативные материалы Нормобакт L vs Энтерол:\nбренды визуально разведены',
      subtitle: 'Сравнение показывает: различаются не только палитра, но и тип сторителлинга, герои и роль продукта в коммуникации',
    });
    s.s.hidden = true;
    const cols = columns(2, { gap: 20 });
    const PAD = 26;
    const G = 16;
    const crop = (f) => path.join(CROPS, f);

    // общая вертикальная сетка двух карточек
    const headY = TOP + 20;
    const visY = headY + 50 + 18;               // верх креативов
    const ITEM = 42;                            // шаг строк-признаков
    const itemsH = 3 * ITEM;
    const palH = 34;
    const capH = 50;                            // подпись-пилюля под креативом Нормобакта
    const itemsY = CB - 18 - itemsH;
    const palY = itemsY - 14 - palH;
    const visH = palY - 18 - visY;              // креатив + подпись
    const NH = visH - 8 - capH;                 // высота креатива Нормобакта

    const card = (c, { name, note, color, dots, dotsText, rows }) => {
      s.card({ x: c.x, y: TOP, w: c.w, h: CB - TOP });
      pillHead(s, { x: c.x + PAD, y: headY, w: c.w - 2 * PAD, text: name, color, note });
      // палитра: кружки цветов + подпись
      let dx = c.x + PAD;
      dots.forEach((col) => {
        s.circle({ x: dx, y: palY + 1, d: 32, fill: col, stroke: col === 'FFFFFF' ? C.navy : undefined, sw: 1.5 });
        dx += 42;
      });
      s.text(dotsText, { x: dx + 12, y: palY + 5, w: c.x + c.w - PAD - dx - 12, size: 18, color: C.blueText });
      rows.forEach(([icon, t], k) => {
        const y = itemsY + k * ITEM;
        s.icon(icon, { x: c.x + PAD, y, size: 34, color: C.white, circle: color });
        s.text(t, { x: c.x + PAD + 50, y: y + 6, w: c.w - 2 * PAD - 50, h: 24, size: 19, color: C.navy, fit: true, minSize: 16 });
      });
    };

    // ---- Нормобакт: три креатива с ситуациями применения ----
    const L = cols[0];
    card(L, {
      name: 'Нормобакт', note: 'Функциональная family health-коммуникация', color: C.cyan,
      dots: [C.cyan, C.blue, C.crimson, 'FFFFFF'], dotsText: 'голубой / синий / красный / белый',
      rows: [
        ['tb:TbLeaf', 'светлая медицинская эстетика, много воздуха'],
        ['tb:TbUsers', 'семья и ребенок как основной эмоциональный якорь'],
        ['tb:TbShieldStar', 'акцент на функции: микрофлора, иммунитет, LGG®'],
      ],
    });
    const nbR = 231 / 317;
    const NW = Math.min(NH * nbR, (L.w - 2 * PAD - 2 * G) / 3);
    const NHr = NW / nbR;
    const nbGap = (L.w - 2 * PAD - 3 * NW) / 2;
    [
      ['b_08_nb1.png', 'Питание /\nприкорм (1–3 года)'],
      ['b_08_nb2.png', 'Антибиотики (3–8 лет)'],
      ['b_08_nb3.png', 'Кишечный эпизод\n(3–10 лет)'],
    ].forEach(([f, cap], k) => {
      const x = L.x + PAD + k * (NW + nbGap);
      s.image(crop(f), { x, y: visY, w: NW, h: NHr, alt: 'Нормобакт L — креатив' });
      s.box({ x, y: visY + NHr + 8, w: NW, h: capH, fill: C.cyan });
      s.text(cap, { x: x + 10, y: visY + NHr + 8, w: NW - 20, h: capH, size: 17, bold: true, lh: 1.1, color: C.white,
        align: 'center', valign: 'middle', fit: true, minSize: 14, maxLines: 2 });
    });

    // ---- Энтерол: промо-баннеры и кадры OLV ----
    const R = cols[1];
    card(R, {
      name: 'Энтерол', note: 'Яркий брендовый мир с персонажами', color: C.navy,
      dots: ['252E7E', 'F7D117', '5BBE2D', 'E85BAE'], dotsText: 'темно-синий / желтый / зеленый / розовый',
      rows: [
        ['tb:TbStarFilled', 'контрастная палитра и высокая визуальная заметность'],
        ['tb:TbUsers', 'персонажи и «мир бренда» вместо реалистичной семьи'],
        ['tb:TbSpeakerphone', 'промо и CTA встроены в яркие продуктовые сцены'],
      ],
    });
    const rowsE = [
      [['b_08_ent1.png', 370 / 186], ['b_08_ent2.png', 359 / 186]],
      [['b_08_ent3.png', 331 / 180], ['b_08_ent4.png', 399 / 180]],
    ];
    const EH = (visH - G) / 2;
    rowsE.forEach((row, k) => {
      const sumR = row.reduce((a, [, r]) => a + r, 0);
      const h = Math.min(EH, (R.w - 2 * PAD - G) / sumR);
      let x = R.x + (R.w - (h * sumR + G)) / 2;
      row.forEach(([f, r]) => {
        s.image(crop(f), { x, y: visY + k * (EH + G) + (EH - h) / 2, w: h * r, h, alt: 'Энтерол — креатив' });
        x += h * r + G;
      });
    });

    s.principle({ label: 'Ключевой вывод', icon: 'tb:TbChartBar',
      text: 'Даже в одной категории коммуникация не выглядит похожей — Нормобакт строит доверие через семейный и функциональный контекст, Энтерол — через заметный персонажный бренд-мир и промо-сценарии' });
    s.footnote('Источники: Mediascope, jan 2025–jun 2026, … jan 2026–jul 2026, Orion, aug 2026');
  },

  // =====================================================================
  // 9 · Посадочные normobact.ru vs enterol.ru (скрытый)
  // В исходнике — картинка-макет во весь слайд. Текст — живым, скриншоты сайтов вырезаны (crops/b_09_*.png).
  // =====================================================================
  9: (d) => {
    const s = d.slide({
      title: 'Посадочные: различается первый экран, ритм и цветовая система',
      subtitle: 'На посадочной бренды используют разные визуальные коды: от светлой family health-логики до контрастного персонажного мира',
    });
    s.s.hidden = true;
    const cols = columns(2, { gap: 40 });
    const PAD = 28;
    const sites = [
      { url: 'normobact.ru', f: 'b_09_normobact.png', r: 742 / 456, color: C.cyan, icon: 'tb:TbUsersGroup',
        head: 'Визуальная логика Нормобакта',
        items: ['первый экран светлый, с фотографией семьи и ребенка', 'ключевые выгоды вынесены через понятные иконки',
          'палитра удерживается в медицинском голубом / синем диапазоне'] },
      { url: 'enterol.ru', f: 'b_09_enterol.png', r: 765 / 456, color: C.navy, icon: 'tb:TbDeviceGamepad2',
        head: 'Визуальная логика Энтерола',
        items: ['темный фон + большой желтый бренд-якорь на первом экране', 'персонажная коммуникация и игровые видео-сценарии',
          'более контрастные CTA: «Как принимать» / «Узнать цену»'] },
    ];
    // высота нижней карточки — по самому длинному списку
    const IS = 19;
    const LG = 10;
    const cardH = (c, st) => PAD + 26 + 14 + st.items.reduce((a, t) => a + measure(t, c.w - 2 * PAD - 120 - 26, IS) + LG, -LG) + PAD;
    const KH = Math.max(...sites.map((st, i) => cardH(cols[i], st)));
    const KY = BOT - KH;
    const shotY = TOP + 50 + 18;
    const SH = Math.min(KY - 24 - shotY, ...sites.map((st, i) => cols[i].w / st.r));
    sites.forEach((st, i) => {
      const c = cols[i];
      s.pill(st.url, { x: c.x, y: TOP, w: 320, h: 50, color: st.color, size: 24, caps: false });
      s.image(path.join(CROPS, st.f), { x: c.x, y: shotY, w: SH * st.r, h: SH, alt: `Скриншот посадочной ${st.url}` });
      s.card({ x: c.x, y: KY, w: c.w, h: KH, tint: i === 0 });
      s.icon(st.icon, { x: c.x + PAD, y: KY + (KH - 88) / 2, size: 88, color: C.white, circle: st.color });
      const tx = c.x + PAD + 120;
      const tw = c.w - 2 * PAD - 120;
      s.text(st.head, { x: tx, y: KY + PAD, w: tw, size: 22, bold: true, lh: 1.1, color: C.navy });
      let y = KY + PAD + 26 + 14;
      st.items.forEach((t) => {
        s.circle({ x: tx, y: y + 5, d: 14, fill: st.color });
        y += s.text(t, { x: tx + 26, y, w: tw - 26, size: IS, color: C.blueText }) + LG;
      });
    });
    s.footnote('Источник: скриншоты landing pages normobact.ru и enterol.ru, август 2026');
  },

  // =====================================================================
  // 10 · Нормобакт / Search demand dynamics / 2026 (аналог — Bobotic 10)
  // Данные — из графиков исходника; вторая ось (показы) — отдельным рядом; вывода-плашки в исходнике нет
  // =====================================================================
  10: (d) => {
    const s = d.slide({
      title: 'Нормобакт / Search demand dynamics / 2026',
      subtitle: 'В Wordstat спрос на Нормобакт прирастает менее активно, чем у категории: +10% vs +25% у категории; на Ozon бренд, наоборот, опередил категорию с результатом +8% к средненедельному спросу марта–апреля',
    });
    const ch = charts(10);
    // в исходнике серии бренда подписаны чужими именами («Wordstat · Боботик», «Ozon · АКРИОЛ ПРО») — это серии Нормобакта (по легенде слайда)
    const wsC = ch.find((c) => c.plots.some((p) => p.type === 'LinePlot' && p.series.some((x) => x.name.includes('Wordstat'))));
    const ozC = ch.find((c) => c.plots.some((p) => p.type === 'LinePlot' && p.series.some((x) => x.name.includes('Ozon'))));
    const wsBar = wsC.plots.find((p) => p.type === 'BarPlot');
    const wsLine = wsC.plots.find((p) => p.type === 'LinePlot');
    const ozLine = ozC.plots.find((p) => p.type === 'LinePlot');
    const isoW = wsLine.cats.map(xlDate);                   // 29.12.2025 … 24.08.2026, 35 недель
    const isoO = ozLine.cats.map(xlDate);                   // 23.03.2026 … 24.08.2026, 23 недели
    const weeks = isoW.map(ddmm);
    const ozWeeks = isoO.map(ddmm);
    const OFF = isoW.indexOf(isoO[0]);                      // 12
    const r1 = (v) => Math.round(v * 10) / 10;
    const brandOf = (plot) => plot.series.find((x) => !x.name.includes('категория')).values.map(r1);
    const catOf = (plot) => plot.series.find((x) => x.name.includes('категория')).values.map(r1);
    const wsBrand = brandOf(wsLine);
    const wsCat = catOf(wsLine);
    const ozBrand = brandOf(ozLine);
    const ozCat = catOf(ozLine);
    const imp = wsBar.series[0].values.map((v) => Math.round(v / 1000));   // показы, тыс.
    const NW = weeks.length;

    // ---- левая карточка: три ряда на общей оси недель ----
    const CARD = { x: X0, y: TOP, w: 1222, h: BOT - TOP };
    s.card(CARD);
    const PX0 = 136;
    const PX1 = CARD.x + CARD.w - 30;
    const step = (PX1 - PX0) / NW;
    const W = { x: PX0, w: step * NW };
    const LX = CARD.x + 36;
    const LR = CARD.x + CARD.w - 30;
    const span = (a, b) => [isoW.findIndex((x) => x >= a), isoW.length - 1 - [...isoW].reverse().findIndex((x) => x <= b)];
    const per = {
      wsBase: span('2026-01-01', '2026-02-28'), wsCmp: span('2026-06-01', '2026-08-31'),
      ozBase: span('2026-03-23', '2026-04-30'), ozCmp: span('2026-08-01', '2026-08-31'),
    };
    const band = (P, [a, b], fill, caption, color) => {
      s.box({ x: PX0 + a * step, y: P.y - 24, w: (b - a + 1) * step, h: P.h + 24, fill, r: 0 });
      if (caption) s.text(caption, { x: PX0 + a * step, y: P.y - 20, w: (b - a + 1) * step, size: 14, bold: true, lh: 1.0, color, align: 'center' });
    };
    const groups = [];
    isoW.forEach((iso) => {
      const mo = MONTHS[Number(iso.slice(5, 7)) - 1];
      if (groups.length && groups[groups.length - 1][0] === mo) groups[groups.length - 1][1]++;
      else groups.push([mo, 1]);
    });
    const monthLines = (P) => {
      let gi = 0;
      groups.forEach(([, n], k) => {
        if (k > 0) s.seg(PX0 + gi * step, P.y, PX0 + gi * step, P.y + P.h, { color: GRID, width: 1.25 });
        gi += n;
      });
    };
    const grid = (m, vals) => vals.forEach((v) => {
      s.seg(W.x, m.val(v), W.x + W.w, m.val(v), { color: v === 100 ? C.line : GRID, width: v === 100 ? 2 : 1.25, dash: v === 100 ? 'dash' : undefined });
      s.text(String(v), { x: PX0 - 60, y: m.val(v) - 10, w: 50, size: 14, color: C.blueText, align: 'right' });
    });
    // Нормобакт — синий (свой бренд, как в серии), категория — приглушённая
    const lineOpts = (P, lo, hi) => ({ x: P.x - 10, y: P.y - 10, w: P.w + 20, h: P.h + 20, plot: P, min: lo, max: hi, values: false, legend: false,
      colors: [MUTED, C.blue], symbol: 'none', lineSize: 2.5, extra: { catAxisHidden: true, catAxisLineShow: false } });
    const rowLabel = (text, y, note) => {
      s.label(text, { x: LX, y, w: 640, size: 20, color: C.blue });
      if (note) {
        const lw = widthOf(String(tr(text)).toUpperCase(), 20, true);
        s.text(note, { x: LX + lw + 16, y: y + 2, w: 360, size: 15, color: C.blueText });
      }
    };
    const LO = 60;
    const HI = 140;

    // Wordstat
    rowLabel('Wordstat: динамика запросов', 247, 'линии — индекс запросов');
    legendRow(s, LR, 246, [[C.blue, 'Нормобакт'], [MUTED, 'категория']]);
    const PW = { ...W, y: 306, h: 214 };
    const mW = chartMap('line', NW, PW, LO, HI);
    band(PW, per.wsBase, BASE, 'янв–фев', C.blue);
    band(PW, per.wsCmp, BAND, 'июнь–август', C.crimson);
    monthLines(PW);
    grid(mW, [60, 80, 100, 120, 140]);
    s.chart('line', [
      { name: 'Wordstat · категория, индекс', labels: weeks, values: wsCat },
      { name: 'Wordstat · Нормобакт, индекс', labels: weeks, values: wsBrand },
    ], lineOpts(PW, LO, HI));

    // Ozon (на той же оси недель, с 23.03.2026)
    rowLabel('Ozon: динамика запросов', 548, 'линии — индекс запросов');
    legendRow(s, LR, 547, [[C.blue, 'Нормобакт'], [MUTED, 'категория']]);
    const PO = { x: PX0 + OFF * step, w: step * (NW - OFF), y: 606, h: 184 };
    const POfull = { ...W, y: PO.y, h: PO.h };
    const mO = chartMap('line', NW, POfull, LO, HI);
    band(POfull, per.ozBase, BASE, 'март–апрель', C.blue);
    band(POfull, per.ozCmp, BAND, 'август', C.crimson);
    monthLines(POfull);
    grid(mO, [60, 80, 100, 120, 140]);
    s.text(`Данные Ozon доступны с ${ozWeeks[0]}`, { x: PX0 + 14, y: PO.y + 60, w: OFF * step - 28, size: 16, color: C.blueText });
    s.chart('line', [
      { name: 'Ozon · категория, индекс', labels: ozWeeks, values: ozCat },
      { name: 'Ozon · Нормобакт, индекс', labels: ozWeeks, values: ozBrand },
    ], lineOpts(PO, LO, HI));

    // показы кампании (вторая ось исходника — отдельным рядом)
    rowLabel('Показы кампании, тыс.', 816);
    const PI = { ...W, y: 884, h: 64 };
    const IMAX = 560;
    s.chart('col', [{ name: 'Показы кампании, тыс.', labels: weeks, values: imp }],
      { x: PI.x - 10, y: PI.y - 30, w: PI.w + 20, h: PI.h + 30, plot: PI, min: 0, max: IMAX, colors: [MUTED], legend: false, gap: 30,
        format: '0', labelSize: 14, labelColor: C.blueText, extra: { catAxisHidden: true, catAxisLineShow: false } });
    const mAx = chartMap('col', NW, PI, 0, IMAX);
    s.seg(W.x, PI.y + PI.h, W.x + W.w, PI.y + PI.h, { color: C.line, width: 1.5 });
    monthAxis(s, mAx, groups, PI.y + PI.h + 2, { size: 15 });

    // ---- правая колонка: цифры и выводы ----
    const X = CARD.x + CARD.w + 24;
    const Wc = X1 - X;
    const tileW = (Wc - 16) / 2;
    const TH = 104;
    const block = (y0, a, b, caption) => {
      s.box({ x: X, y: y0, w: tileW, h: TH, fill: C.blue });
      s.text(a[0], { x: X + 22, y: y0 + 10, w: tileW - 36, size: 48, bold: true, lh: 1.1, color: C.white });
      s.text(a[1], { x: X + 22, y: y0 + 68, w: tileW - 36, h: 22, size: 17, bold: true, color: C.white, fit: true, minSize: 14 });
      s.box({ x: X + tileW + 16, y: y0, w: tileW, h: TH, fill: C.cardTint, stroke: C.line, sw: 2 });
      s.text(b[0], { x: X + tileW + 38, y: y0 + 10, w: tileW - 36, size: 48, bold: true, lh: 1.1, color: C.navy });
      s.text(b[1], { x: X + tileW + 38, y: y0 + 68, w: tileW - 36, h: 22, size: 17, bold: true, color: C.navy, fit: true, minSize: 14 });
      return y0 + TH + 8 + s.text(caption, { x: X, y: y0 + TH + 8, w: Wc, size: 15, color: C.blueText }) + 12;
    };
    const t1 = 'Поисковый спрос на Нормобакт вырос на 10%, но категория росла быстрее (+25%). В 2027 г. важно усиливать присутствие Нормобакта в категорийном и контентном поиске и связывать его с брендовой коммуникацией. Эффект оценивать по динамике брендовых запросов, доле поиска и CR';
    const t2 = 'На Ozon спрос на Нормобакт вырос на 8% при менее динамичном росте категории. В 2027 г. необходимо усилить продвижение карточки в поиске Ozon, обеспечить наличие и промоподдержку и повышать конверсию за счёт контента и органических отзывов';
    const tw = Wc - 48;
    const cap1 = 'Средний недельный спрос июнь–август vs янв–фев';
    const cap2 = 'Средний недельный спрос август vs март–апрель';
    const fixedH = 2 * (TH + 8 + measure(cap1, Wc, 15) + 12) + 18;
    let fs = 20;
    const cardH = (t, sz) => 18 + 20 + 12 + measure(t, tw, sz) + 18;
    while (fs > 15 && fixedH + cardH(t1, fs) + cardH(t2, fs) > BOT - TOP) fs -= 1;
    const conc = (y0, h, t) => {
      s.card({ x: X, y: y0, w: Wc, h });
      s.label('Вывод', { x: X + 24, y: y0 + 18, w: 200, size: 18, color: C.crimson });
      s.text(t, { x: X + 24, y: y0 + 18 + 20 + 12, w: tw, size: fs, lh: 1.2, color: C.blueText });
    };
    // свободную высоту делим поровну между двумя карточками-выводами
    const spare = Math.max(0, (BOT - TOP) - fixedH - cardH(t1, fs) - cardH(t2, fs));
    let y = block(TOP, ['+10%', 'Нормобакт · Wordstat'], ['+25%', 'Категория · Wordstat'], cap1);
    const h1 = cardH(t1, fs) + spare / 2;
    conc(y, h1, t1);
    y += h1 + 18;
    y = block(y, ['+8%', 'Нормобакт · Ozon'], ['+2%', 'Категория · Ozon'], cap2);
    conc(y, BOT - y, t2);

    s.footnote('Источник: данные Ozon* и Яндекс Вордстат; данные Ozon доступны с 23.03.2026. Индекс запросов = значение недели / значение предыдущей недели × 100\nДля сравнения в выводах: Wordstat — средняя неделя июнь–август vs январь–февраль; Ozon — средний недельный спрос август vs март–апрель',
      { y: 1027, w: 1740 });
  },
};
