// Динобутин · стратегия 2027 — часть B: слайды исходника 6–10
// 6 — Competitive Analysis / Digital Creatives: Необутин — OLV-ролик (видео без изменений) + display и ко-промо с аптеками (аналог — Normobact 6, Azelik 15);
// 7 — Competitive Analysis / Digital Creatives: Тримедат — 3 OLV-ролика (видео без изменений) + display и ко-промо с аптеками;
// 8 — Динобутин / Search demand dynamics / 2026: Wordstat и Ozon (аналог — Normobact 10, Bobotic 10);
// 9 — сезонность поискового спроса в категории: картинка-макет во весь слайд → живая тепловая таблица 2025 + 2026 янв–июн и 4 вывода
//     (аналог — Normobact 11, Clindovit 9; числа прочитаны по увеличенным кускам out/render/brand_dinobutin_part_b/zoom/s09_*.png);
// 10 — география Digital: ядро / рост и восстановление / планировочная гипотеза (аналог — Normobact 12, Bobotic 9).
const path = require('path');
const { C, columns, chartMap, textWidth, countLines, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT, MUTED, GRID
const D = require('./common');                            // SRC, MEDIA, CROPS, fromSource, video
const SRC = D.SRC;
const MEDIA = D.MEDIA;

const TOP = V.TOP;   // 221 — верх контента
const BOT = V.BOT;   // 1005 — низ контента без плашки
const CB = 905;      // низ контента над плашкой
const X0 = 58;
const X1 = 1862;
const MUTED = V.MUTED;
const GRID = V.GRID;

// Цвета брендов — одинаково на всех слайдах деки: свой бренд — синий, главный конкурент — малиновый, второй конкурент — второй акцент
const BRAND = { dino: C.blue, trim: C.crimson, neo: C.cyan };

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

// Цифра + подпись на одной базовой линии: «52,5%» крупно, подпись мельче справа
function valueUnit(s, { x, y, w, value, unit, size = 64, unitSize = 20, color = C.navy, unitColor = C.blueText, unitBold = true }) {
  const vw = Math.ceil(widthOf(value, size, true)) + 6;
  const vh = size * 1.1;
  s.text(value, { x, y, w: vw, size, bold: true, lh: 1.1, color });
  if (unit) {
    const uw = w - vw - 12;
    const uh = measure(unit, uw, unitSize, unitBold);
    s.text(unit, { x: x + vw + 12, y: y + vh - uh - (size - unitSize) * 0.16, w: uw, size: unitSize, bold: unitBold, lh: 1.2, color: unitColor });
  }
  return vh;
}

// Смешение цвета с белым: k = 0 — белый, 1 — исходный цвет
function tintOf(hexc, k) {
  const c = [0, 2, 4].map((i) => parseInt(hexc.slice(i, i + 2), 16));
  return c.map((v) => Math.round(255 + (v - 255) * k).toString(16).padStart(2, '0')).join('').toUpperCase();
}

module.exports = {
  // =====================================================================
  // 6 · Competitive Analysis / Digital Creatives — Необутин
  // Видео 16:9 (media1.mp4, обложка image34.png) без изменений; под ним два баннера ко-промо с аптеками; справа квадратный display-баннер.
  // =====================================================================
  6: (d) => {
    const s = d.slide({
      title: 'Competitive Analysis / Digital Creatives',
      subtitle: 'Необутин в 2026 году размещался с видео- и баннерным форматами, а также в ко-промо с аптеками, но со взрослой формой препарата',
    });
    const PAD = 30;
    const G = 16;     // зазор между креативами
    const CG = 20;    // зазор между колонками
    s.card({ x: X0, y: TOP, w: X1 - X0, h: BOT - TOP });
    // блок креативов: слева видео + под ним два баннера на всю ширину видео, справа квадратный баннер высотой во весь блок
    const iy = TOP + 82;
    const HB = BOT - PAD - iy;
    const rA = 1170 / 400;     // «Товар дня», февраль (img_ad4a3580e5.jpg)
    const rB = 1444 / 552;     // «Товар дня в марте» (img_be0f4290eb.jpg)
    // HB = VW·9/16 + G + (VW − G)/(rA + rB)
    const VW = (HB - G + G / (rA + rB)) / (9 / 16 + 1 / (rA + rB));
    const VH = VW * 9 / 16;
    const hb = (VW - G) / (rA + rB);
    const SQ = HB;
    const blockW = VW + CG + SQ;
    const bx = X0 + (X1 - X0 - blockW) / 2;
    s.label('Необутин', { x: bx, y: TOP + 30, w: 600, size: 26, color: BRAND.neo });
    D.video(s, { media: 'media1.mp4', cover: 'image34.png', x: bx, y: iy, w: VW, h: VH, name: 'Необутин — OLV-ролик' });
    s.image(path.join(MEDIA, 'img_ad4a3580e5.jpg'), { x: bx, y: iy + VH + G, w: hb * rA, h: hb, alt: 'Необутин — ко-промо с аптеками, «Товар дня»' });
    s.image(path.join(MEDIA, 'img_be0f4290eb.jpg'), { x: bx + hb * rA + G, y: iy + VH + G, w: hb * rB, h: hb, alt: 'Необутин — ко-промо с аптеками, «Товар дня»' });
    s.image(path.join(MEDIA, 'img_e7831f5f4e.png'), { x: bx + VW + CG, y: iy, w: SQ, h: SQ, alt: 'Необутин — display-баннер' });
  },

  // =====================================================================
  // 7 · Competitive Analysis / Digital Creatives — Тримедат
  // Длинный подзаголовок исходника разложен: суть — в шапку, детали — к своим креативам (OLV / display / ко-промо).
  // Видео media2–4.mp4 (обложки image39–41.png) без изменений; баннеры — в пропорциях файлов (в исходнике растянуты).
  // =====================================================================
  7: (d) => {
    const s = d.slide({
      title: 'Competitive Analysis / Digital Creatives',
      subtitle: 'Тримедат в 2026 году активно размещается в OLV и display',
    });
    const PAD = 30;
    const G = 16;
    const CG = 20;
    const IW = X1 - X0 - 2 * PAD;
    const HS = 19;    // кегль пояснений
    // ряд 2: display + ко-промо — два баннера на всю ширину карточки, пояснение над каждым
    const rS = 1326 / 383;     // «В сезон шашлыков» (img_97121f8f7f.png)
    const rT = 810 / 540;      // «Товар дня», март (img_85075a690c.jpg)
    // высота баннеров — компромисс с размером роликов в ряду 1 (на всю ширину баннеры вышли бы вдвое крупнее роликов)
    const hImg = Math.min(300, (IW - 60) / (rS + rT));
    const wS = hImg * rS;
    const wT = hImg * rT;
    const disp = [
      { head: 'Display', text: 'В дисплее использовались ситуационные креативы (под сезон шашлыков)', w: wS },
      // ручной перенос: иначе PowerPoint рвёт «ко-/промо» по дефису
      { head: 'Ко-промо с аптеками', text: 'Дополнительная промоция была в рамках\nко-промо с аптеками', w: wT },
    ];
    const capH = Math.max(...disp.map((b) => measure(b.text, b.w, HS)));
    const R2H = PAD + 26 + 10 + capH + 18 + hImg + PAD;
    const R2 = BOT - R2H;
    // ряд 1: OLV — слева метка бренда и пояснение, справа три ролика (по правому краю)
    const R1H = R2 - 20 - TOP;
    const VH = R1H - 2 * PAD;
    const VW = VH * 16 / 9;
    const vx0 = X1 - PAD - 3 * VW - 2 * G;
    s.card({ x: X0, y: TOP, w: X1 - X0, h: R1H });
    const tx = X0 + PAD;
    const tw = vx0 - 30 - tx;
    s.label('Тримедат', { x: tx, y: TOP + PAD, w: tw, size: 26, color: BRAND.trim });
    s.text('OLV', { x: tx, y: TOP + PAD + 46, w: tw, size: 22, bold: true, lh: 1.0, color: C.navy });
    s.text('В рамках OLV-роликов использовалась персонализация креатива в зависимости от пола и возраста потенциального потребителя — в видеоряде делался акцент на главном герое ролика',
      { x: tx, y: TOP + PAD + 84, w: tw, h: R1H - PAD - 84 - PAD, size: HS, color: C.blueText, fit: true, minSize: 16 });
    [['media2.mp4', 'image39.png'], ['media3.mp4', 'image40.png'], ['media4.mp4', 'image41.png']].forEach(([media, cover], k) => {
      D.video(s, { media, cover, x: vx0 + k * (VW + G), y: TOP + PAD, w: VW, h: VH, name: `Тримедат — OLV-ролик ${k + 1}` });
    });

    s.card({ x: X0, y: R2, w: X1 - X0, h: R2H });
    const imgY = R2 + PAD + 26 + 10 + capH + 18;
    // display — от левого края, ко-промо — по правому краю карточки (под последним роликом)
    [['img_97121f8f7f.png', 'Тримедат — display-креатив «В сезон шашлыков»'], ['img_85075a690c.jpg', 'Тримедат — ко-промо с аптеками, «Товар дня»']].forEach(([f, alt], k) => {
      const b = disp[k];
      const x = k === 0 ? X0 + PAD : X1 - PAD - b.w;
      s.text(b.head, { x, y: R2 + PAD, w: b.w, size: 22, bold: true, lh: 1.0, color: C.navy });
      s.text(b.text, { x, y: R2 + PAD + 36, w: b.w, size: HS, color: C.blueText });
      s.image(path.join(MEDIA, f), { x, y: imgY, w: b.w, h: hImg, alt });
    });
  },

  // =====================================================================
  // 8 · Динобутин / Search demand dynamics / 2026 (аналог — Normobact 10)
  // Данные — из графиков исходника; вторая ось (показы) — отдельным рядом; вывода-плашки в исходнике нет — выводы в правой колонке.
  // =====================================================================
  8: (d) => {
    const s = d.slide({
      title: 'Динобутин / Search demand dynamics / 2026',
      subtitle: 'Динобутин существенно увеличивает брендовый поисковый спрос, однако рост пока не отражается в усилении позиций бренда на Ozon',
    });
    const ch = charts(8);
    // в исходнике серии бренда подписаны чужими именами («Wordstat · Боботик», «Ozon · АКРИОЛ ПРО») — это серии Динобутина (по легенде слайда)
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
    const imp = wsBar.series[0].values.map((v) => Math.round(v / 1000));   // показы, тыс. (на Ozon-графике — те же недели)
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
    // Динобутин — синий (свой бренд), категория — приглушённая
    const lineOpts = (P, lo, hi) => ({ x: P.x - 10, y: P.y - 10, w: P.w + 20, h: P.h + 20, plot: P, min: lo, max: hi, values: false, legend: false,
      colors: [MUTED, BRAND.dino], symbol: 'none', lineSize: 2.5, extra: { catAxisHidden: true, catAxisLineShow: false } });
    const rowLabel = (text, y, note) => {
      s.label(text, { x: LX, y, w: 640, size: 20, color: C.blue });
      if (note) {
        const lw = widthOf(String(tr(text)).toUpperCase(), 20, true);
        s.text(note, { x: LX + lw + 16, y: y + 2, w: 360, size: 15, color: C.blueText });
      }
    };

    // Wordstat: индекс бренда доходит до 224 — шкала 40…240
    rowLabel('Wordstat: динамика запросов', 247, 'линии — индекс запросов');
    legendRow(s, LR, 246, [[BRAND.dino, 'Динобутин'], [MUTED, 'категория']]);
    const PW = { ...W, y: 306, h: 214 };
    const mW = chartMap('line', NW, PW, 40, 240);
    band(PW, per.wsBase, BASE, 'янв–фев', C.blue);
    band(PW, per.wsCmp, BAND, 'июнь–август', C.crimson);
    monthLines(PW);
    grid(mW, [50, 100, 150, 200]);
    s.chart('line', [
      { name: 'Wordstat · категория, индекс', labels: weeks, values: wsCat },
      { name: 'Wordstat · Динобутин, индекс', labels: weeks, values: wsBrand },
    ], lineOpts(PW, 40, 240));

    // Ozon (на той же оси недель, с 23.03.2026): индексы 42…169 — шкала 40…180
    rowLabel('Ozon: динамика запросов', 548, 'линии — индекс запросов');
    legendRow(s, LR, 547, [[BRAND.dino, 'Динобутин'], [MUTED, 'категория']]);
    const PO = { x: PX0 + OFF * step, w: step * (NW - OFF), y: 606, h: 184 };
    const POfull = { ...W, y: PO.y, h: PO.h };
    const mO = chartMap('line', NW, POfull, 40, 180);
    band(POfull, per.ozBase, BASE, 'март–апрель', C.blue);
    band(POfull, per.ozCmp, BAND, 'август', C.crimson);
    monthLines(POfull);
    grid(mO, [50, 100, 150]);
    s.text(`Данные Ozon доступны с ${ozWeeks[0]}`, { x: PX0 + 14, y: PO.y + 60, w: OFF * step - 28, size: 16, color: C.blueText });
    s.chart('line', [
      { name: 'Ozon · категория, индекс', labels: ozWeeks, values: ozCat },
      { name: 'Ozon · Динобутин, индекс', labels: ozWeeks, values: ozBrand },
    ], lineOpts(PO, 40, 180));

    // показы кампании (вторая ось исходника — отдельным рядом)
    rowLabel('Показы кампании, тыс.', 816);
    const PI = { ...W, y: 884, h: 64 };
    const IMAX = 760;
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
    const t1 = 'Средний недельный спрос по Динобутину в июне–августе был на 181% выше уровня января–февраля, тогда как категорийный спрос прирос всего на 5%. Это указывает на рост интереса именно к бренду, а не на следование общей категорийной динамике. В 2027 важно закрепить динамику через always-on Search и сезонную охватную поддержку, оценивая долю брендовых запросов и CR';
    const t2 = 'На Ozon спрос по Динобутину остался стабильным (0%) при небольшом падении категории (−2%). Для роста динамики спроса в e-com необходимо усилить продвижение карточки в поиске Ozon, вести на неё трафик из внешней коммуникации и повышать конверсию за счёт контента, отзывов, наличия и промо';
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
    // свободную высоту делим пропорционально между двумя карточками-выводами
    const spare = Math.max(0, (BOT - TOP) - fixedH - cardH(t1, fs) - cardH(t2, fs));
    let y = block(TOP, ['+181%', 'Динобутин · Wordstat'], ['+5%', 'Категория · Wordstat'], cap1);
    const h1 = cardH(t1, fs) + spare / 2;
    conc(y, h1, t1);
    y += h1 + 18;
    y = block(y, ['0%', 'Динобутин · Ozon'], ['−2%', 'Категория · Ozon'], cap2);
    conc(y, BOT - y, t2);

    s.footnote('Источник: данные Ozon* и Яндекс Вордстат; данные Ozon доступны с 23.03.2026. Индекс запросов = значение недели / значение предыдущей недели × 100\nДля сравнения в выводах: Wordstat — средняя неделя июнь–август vs январь–февраль; Ozon — средний недельный спрос август vs март–апрель. По данным Wordstat средний недельный спрос апр–июнь vs янв–фев — 106%',
      { y: 1027, w: 1740 });
  },

  // =====================================================================
  // 9 · Сезонность поискового спроса в категории (аналог — Normobact 11)
  // В исходнике — картинка-макет во весь слайд; все числа прочитаны по увеличенным кускам (zoom/s09_*.png)
  // и сверены: среднее каждой строки 2025 = 100, 2026 янв–июн = 100.
  // =====================================================================
  9: (d) => {
    const s = d.slide({ title: 'Сезонность поискового спроса в категории' });
    // индексы: 100 = средний уровень периода (2025 — год, 2026 — янв–июн)
    const M = [...MONTHS, ...MONTHS.slice(0, 6)];
    const DATA = [
      ['Бренды'],
      ['Тримедат', [118, 101, 105, 88, 77, 77, 85, 102, 101, 116, 124, 106, 112, 95, 96, 97, 96, 104], BRAND.trim],
      ['Необутин', [124, 122, 112, 86, 81, 82, 82, 98, 97, 109, 104, 103, 113, 106, 111, 97, 84, 89], BRAND.neo],
      ['Проблематика'],
      ['Вздутие', [106, 99, 106, 97, 91, 96, 100, 101, 92, 107, 108, 97, 102, 95, 107, 104, 91, 101]],
      ['Метеоризм', [119, 117, 118, 102, 90, 85, 80, 82, 85, 109, 112, 101, 107, 104, 112, 110, 85, 82]],
      ['Боль в животе у ребёнка', [124, 118, 115, 91, 79, 76, 81, 92, 96, 108, 109, 111, 113, 106, 108, 105, 88, 80]],
    ];
    // тепловая шкала вокруг 100: выше — малиновый оттенок, ниже — голубой; сила — по отклонению (±25 = максимум)
    const HI = C.crimson;
    const LO = C.cyan;
    const cell = (v) => {
      const t = Math.min(1, Math.abs(v - 100) / 25);
      const fill = v === 100 ? 'FFFFFF' : tintOf(v > 100 ? HI : LO, 0.06 + t * 0.5);
      return { text: String(v), fill, color: C.navy, bold: t >= 0.8, align: 'center' };
    };
    const MW = 86;
    const nameW = X1 - X0 - MW * 18;
    const rows = [
      [{ text: '' }, { text: '2025', colspan: 12 }, { text: '2026 (янв–июн)', colspan: 6 }],
      [{ text: 'Показатель', fill: C.cardTint, color: C.blueText }, ...M.map((m) => ({ text: m, fill: C.cardTint, color: C.navy, align: 'center' }))],
    ];
    const rowH = [42, 42];
    DATA.forEach(([name, vals]) => {
      if (!vals) {
        rows.push([{ text: name, colspan: 19, fill: C.tint, color: C.navy, bold: true }]);
        rowH.push(36);
      } else {
        rows.push([{ text: name, color: C.navy, bold: true }, ...vals.map((v) => cell(v))]);
        rowH.push(56);
      }
    });
    s.table(rows, { x: X0, y: TOP, w: X1 - X0, colW: [nameW, ...Array(18).fill(MW)], rowH, size: 18 });
    const tH = rowH.reduce((a, b) => a + b, 0);
    s.vline(X0 + nameW + MW * 12, TOP, tH, C.navy, 2.5);   // граница 2025 | 2026
    // цветная метка бренда у названия (цвета брендов серии)
    let ry = TOP + rowH[0] + rowH[1];
    DATA.forEach(([, vals, color], k) => {
      if (vals && color) s.box({ x: X0 + 2, y: ry + 10, w: 5, h: rowH[k + 2] - 20, fill: color, r: 2 });
      ry += rowH[k + 2];
    });

    // легенда подсветки — справа под таблицей; слева — пояснение к индексам
    const ly = TOP + tH + 12;
    let lx = X1;
    [[tintOf(LO, 0.5), 'ниже 100'], [tintOf(HI, 0.5), 'выше 100']].forEach(([col, txt]) => {
      const tw = Math.ceil(widthOf(txt, 15)) + 8;
      lx -= tw;
      s.text(txt, { x: lx, y: ly, w: tw, size: 15, lh: 1.0, color: C.blueText });
      lx -= 26;
      s.box({ x: lx, y: ly, w: 18, h: 16, fill: col, r: 4 });
      lx -= 28;
    });
    const noteH = s.text('Индексы: 100 = средний уровень периода. Для 2025 — средний уровень 2025 года; для 2026 — средний уровень января–июня 2026 года. Данные по 2026 году — за январь–июнь. Источник: Яндекс Wordstat.',
      { x: X0, y: ly, w: lx - X0 - 20, size: 15, lh: 1.15, color: C.blueText });

    // четыре вывода
    const cy = ly + Math.max(18, noteH) + 16;
    const cols = columns(4, { gap: 23 });
    const pad = 24;
    const bd = 44;
    const insights = [
      { lead: 'Брендовый спрос в 1ПГ 2026 вырос к 1ПГ 2025:',
        stats: [['Тримедат', '+18%', BRAND.trim], ['Необутин', '+9%', BRAND.neo]],
        body: 'Рост особенно заметен в начале года; к маю спрос снижается, а в июне видны первые признаки восстановления.' },
      { lead: 'Проблематика в 1ПГ 2026 в целом близка к прошлому году:',
        stats: [['«вздутие»', '+3%', C.blue], ['«боль в животе у ребёнка» — на уровне 1ПГ 2025'], ['«метеоризм» снизился на', '15%', C.blue]] },
      { lead: 'По динамике 2025 года категория имеет два окна повышенного интереса:',
        accent: 'январь–март\nи октябрь–декабрь.',
        body: 'Самый спокойный период — май–июль.' },
      { lead: 'В 1ПГ 2026 паттерн сохраняется:',
        body: 'высокий старт года, весеннее снижение и первые признаки восстановления уже в июне.' },
    ];
    const LS = 20;
    insights.forEach((it, i) => {
      const { x, w } = cols[i];
      const iw = w - pad * 2;
      s.card({ x, y: cy, w, h: BOT - cy });
      s.badge({ x: x + pad, y: cy + pad, d: bd, n: i + 1, color: C.blue, size: 24 });
      const lw = iw - bd - 14;
      const lh = measure(it.lead, lw, LS, true, 1.15);
      s.text(it.lead, { x: x + pad + bd + 14, y: cy + pad + Math.max(0, (bd - lh) / 2), w: lw, size: LS, bold: true, lh: 1.15, color: C.navy });
      let y = cy + pad + Math.max(bd, lh) + 14;
      if (it.stats) {
        const vals = it.stats.filter((r) => r[1]);
        const vw = Math.max(...vals.map(([, v]) => Math.ceil(widthOf(v, 36, true)))) + 6;
        it.stats.forEach(([lab, val, col]) => {
          const labW = val ? iw - vw - 10 : iw;
          const lh2 = measure(lab, labW, 19, false, 1.15);
          const rh = val ? Math.max(42, lh2) : lh2;
          s.text(lab, { x: x + pad, y: y + (rh - lh2) / 2, w: labW, size: 19, lh: 1.15, color: C.navy });
          if (val) s.text(val, { x: x + pad + iw - vw, y: y + (rh - 40) / 2, w: vw, size: 36, bold: true, lh: 1.1, color: col, align: 'right' });
          y += rh + 8;
        });
        y += 4;
      }
      if (it.accent) y += s.text(it.accent, { x: x + pad, y, w: iw, size: 26, bold: true, lh: 1.15, color: C.crimson }) + 12;
      if (it.body) s.text(it.body, { x: x + pad, y, w: iw, size: 19, lh: 1.25, color: C.blueText });
    });
  },

  // =====================================================================
  // 10 · География Digital (аналог — Normobact 12, Bobotic 9)
  // =====================================================================
  10: (d) => {
    const s = d.slide({ title: 'География Digital: на втором году лонча усиливаем ядро и точки роста, сохраняя национальное присутствие' });

    // ── полоса цифр: три про ядро + планировочная гипотеза (малиновая) ──
    const kp = [
      { lab: 'Ядро Digital', val: '52,5%', sub: 'продаж янв.–июль’26 в 14 регионах' },
      { lab: 'Актуальный спрос', val: '57,3%', sub: 'июльских продаж в ядре' },
      { lab: 'DI* май → июль', val: '+41%', sub: 'при продажах июля ≈ маю (−1%)' },
      { lab: 'Планировочная гипотеза', val: '55–60%', sub: 'digital-инвестиций — ядро', hl: true },
    ];
    const kc = columns(4, { gap: 23 });
    const KH = 112;
    kp.forEach((k, i) => {
      const c = kc[i];
      s.box({ x: c.x, y: TOP, w: c.w, h: KH, fill: k.hl ? C.crimson : C.cardTint, stroke: k.hl ? undefined : C.line, sw: 2 });
      const ink = k.hl ? C.white : C.navy;
      s.text(k.lab, { x: c.x + 24, y: TOP + 16, w: c.w - 48, size: 16, bold: true, lh: 1.0, color: k.hl ? C.white : C.blueText, caps: true });
      valueUnit(s, { x: c.x + 24, y: TOP + 40, w: c.w - 40, value: k.val, unit: k.sub, size: 46, unitSize: 17, color: k.hl ? C.white : C.blue, unitColor: ink, unitBold: false });
    });

    // ── три колонки ──
    const cols = columns(3, { gap: 23 });
    const CY = TOP + KH + 22;
    const pad = 32;
    const bd = 52;
    const cw = cols[0].w - pad * 2;
    const head = (col, n, text, color) => {
      s.badge({ x: col.x + pad, y: CY + 24, d: bd, n, color, size: 26 });
      s.text(text, { x: col.x + pad + bd + 18, y: CY + 24, w: col.w - pad * 2 - bd - 18, h: bd, size: 27, bold: true, lh: 1.05, color: C.navy, valign: 'middle', fit: true, minSize: 22 });
    };
    const leadY = CY + 24 + bd + 20;
    const leads = [
      'Высокий объём продаж + актуальный спрос + достаточная доступность',
      '16,8% продаж: ускоряем точки роста',
      'Логика выбора',
    ];
    const leadH = Math.max(...leads.map((t) => measure(t, cw, 19, true)));
    const lineY = leadY + leadH + 18;
    const geo = [
      { n: 1, t: 'Ядро Digital', color: C.blue, ink: C.blue, share: '52,5%',
        regions: ['Москва', 'МО', 'Краснодарский край', 'СПб + ЛО', 'Свердловская обл.', 'Самарская обл.', 'Челябинская обл.',
          'Красноярский край', 'Татарстан', 'Ростовская обл.', 'Нижегородская обл.', 'Воронежская обл.', 'Тюменская обл.', 'Ставропольский край'] },
      { n: 2, t: 'Рост и восстановление', color: C.cyan, ink: C.teal, share: '16,8%',
        regions: ['Волгоградская обл.', 'Саратовская обл.', 'Рязанская обл.', 'Калининградская обл.', 'Ярославская обл.',
          'Тверская обл.', 'Пермский край', 'Башкортостан', 'Приморский край', 'Оренбургская обл.'] },
    ];
    const FH = 70;                        // плашка «доля продаж» внизу колонки
    const FY = CB - pad + 8 - FH;
    geo.forEach((g, i) => {
      const col = cols[i];
      const x = col.x + pad;
      s.card({ x: col.x, y: CY, w: col.w, h: CB - CY });
      head(col, g.n, g.t, g.color);
      s.text(leads[i], { x, y: leadY, w: cw, size: 19, bold: true, lh: 1.2, color: C.navy });
      s.hline(x, lineY, cw);
      // два столбца регионов (порядок исходника — по столбцам); шаг строки — по более высокому из пары
      const half = Math.ceil(g.regions.length / 2);
      const rw = cw / 2 - 26;
      const rows = [];
      for (let k = 0; k < half; k++) rows.push([g.regions[k], g.regions[half + k]].filter(Boolean));
      const RS = 19;
      const rh = rows.map((pr) => Math.max(...pr.map((r) => measure(r, rw, RS, false, 1.15))));
      const avail = FY - 16 - (lineY + 18);
      const gap = Math.min(26, (avail - rh.reduce((a, b) => a + b, 0)) / Math.max(1, rows.length - 1));
      let cy = lineY + 18;
      rows.forEach((pr, k) => {
        pr.forEach((r, j) => {
          const cx = x + (j ? cw / 2 + 6 : 0);
          s.circle({ x: cx, y: cy + 7, d: 10, fill: g.color });
          s.text(r, { x: cx + 22, y: cy, w: rw, size: RS, lh: 1.15, color: C.navy });
        });
        cy += rh[k] + gap;
      });
      // доля продаж ядра / точек роста
      s.box({ x, y: FY, w: cw, h: FH, fill: C.cardTint, r: 15 });
      const vw = Math.ceil(widthOf(g.share, 36, true)) + 8;
      s.text(g.share, { x: x + 20, y: FY, w: vw, h: FH, size: 36, bold: true, lh: 1.0, color: g.ink, valign: 'middle' });
      s.text('продаж, янв.–июль 2026', { x: x + 20 + vw + 12, y: FY, w: cw - vw - 52, h: FH, size: 19, bold: true, lh: 1.15, color: C.navy, valign: 'middle', fit: true, minSize: 16 });
    });

    // колонка 3: планировочная гипотеза — три веса
    const col = cols[2];
    const x = col.x + pad;
    s.card({ x: col.x, y: CY, w: col.w, h: CB - CY, tint: true });
    head(col, 3, 'Планировочная гипотеза', C.crimson);
    s.text(leads[2], { x, y: leadY, w: cw, size: 19, bold: true, lh: 1.2, color: C.navy });
    s.hline(x, lineY, cw);
    const logic = [
      { color: C.blue, t: '**Ядро = 52,5% продаж → 55–60% инвестиций**: максимальный вес в регионах с доказанным спросом и достаточным DI' },
      { color: C.cyan, t: '**Рост + восстановление = 16,8% продаж → 25–30% инвестиций**: перевзвешиваем в пользу зон ускорения' },
      { color: MUTED, t: '**Остальная РФ = 30,7% продаж → 15–20% инвестиций**: сохраняем базовый национальный слой, т.к. на втором году лонча важно создавать новый спрос, а не только следовать текущим продажам' },
    ];
    const lx = x + 20;
    const lw = cw - 20;
    const top = lineY + 20;
    const availL = CB - 24 - top;
    let ls = 18;
    const logicH = (sz) => logic.reduce((a, l) => a + measure(l.t, lw, sz), 0);
    while (ls > 16 && logicH(ls) + 2 * 22 > availL) ls -= 1;
    const lg = Math.min(30, (availL - logicH(ls)) / 2);
    let ly = top;
    logic.forEach((l) => {
      const h = measure(l.t, lw, ls);
      s.box({ x, y: ly + 2, w: 6, h: h - 4, fill: l.color, r: 3 });
      s.text(l.t, { x: lx, y: ly, w: lw, size: ls, lh: 1.2, color: C.blueText });
      ly += h + lg;
    });

    s.principle({ label: 'Вывод', icon: 'target',
      text: 'География задает вес инвестиций, а не ограничивает кампанию: 69,3% продаж уже сосредоточено в ядре и 2-м слое, но 30,7% long tail требует базового присутствия по РФ' });
    s.footnote('*DI — Distribution Index = показатель аптечной дистрибуции препарата');
  },
};
