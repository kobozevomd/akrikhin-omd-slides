// Акримиколь · стратегия 2027 — часть B: слайды исходника 6–10
// 6 — Acrimycol / Digital Competitive Landscape: продажи, доля продаж, digital-бюджет на общей оси месяцев + бюджеты и takeaways
//     (аналог — Dinobutin 5, decks/brands/dinobutin/part_a.js; данные — src/slide-06.json);
// 7 — Competitive Analysis / Creative Acrimycol: шесть видео конкурентов без изменений (K.video) + баннер Залаина
//     (аналог — Normobact 6, Azelik 15);
// 8 — сезонность поискового спроса в категории грибковых инфекций кожи: картинка-макет → живая тепловая таблица 2025 + 2026 янв–июн
//     и 4 вывода (аналог — Dinobutin 9; числа прочитаны по увеличенным кускам out/render/brand_akrimycol_part_b/zoom/s08_*.png);
// 9 — Acrimycol / Search demand dynamics / 2026: Wordstat и Ozon (аналог — Dinobutin 8; данные — src/slide-09.json);
// 10 — анализ сегментов: картинка-макет → живые строки сегментов со статусом (аналог — Normobact 13).
const path = require('path');
const { C, columns, chartMap, textWidth, countLines, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT, MUTED, GRID, yearAxis
const K = require('./common');                            // SRC, MEDIA, CROPS, fromSource, video
const SRC = K.SRC;
const MEDIA = K.MEDIA;

const TOP = V.TOP;   // 221 — верх контента
const BOT = V.BOT;   // 1005 — низ контента без плашки
const X0 = 58;
const X1 = 1862;
const MUTED = V.MUTED;
const GRID = V.GRID;

// Цвета брендов — одинаково на всех слайдах деки: Акримиколь — синий (свой бренд), Залаин — малиновый (главный конкурент),
// Экзодерил — второй акцент (cyan), остальные — приглушённые
const BR = {
  akr: { name: 'Акримиколь', color: C.blue },
  zal: { name: 'Залаин', color: C.crimson },
  exo: { name: 'Экзодерил', color: C.cyan },
};

// ---------- помощники ----------
// Высота и ширина текста так же, как их оценивает s.text — по переведённой строке (EN-сборка пересчитает геометрию)
const plainTr = (text) => typo(tr(String(text))).replace(/\*\*|\[\[|\]\]/g, '');
const measure = (text, w, size = 18, bold = false, lh = 1.2) =>
  Math.round(countLines(plainTr(text), size, w, bold) * size * lh);
const widthOf = (text, size, bold = false) => textWidth(plainTr(text), size, bold);
const lw = (t, size = 22) => Math.ceil(textWidth(plainTr(t).toUpperCase(), size, true)) + 6;

const charts = (n) => require(path.join(SRC, `slide-${String(n).padStart(2, '0')}.json`))
  .shapes.filter((sh) => sh.t === 'CHART').map((sh) => sh.chart);
const f1 = (v) => v.toFixed(1).replace('.', ',');
const f2 = (v) => v.toFixed(2).replace('.', ',');
// Excel-дата (46020) → 'гггг-мм-дд'
const xlDate = (n) => new Date(Date.UTC(1899, 11, 30) + Number(n) * 86400000).toISOString().slice(0, 10);
const ddmm = (iso) => `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}`;
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const hex = (n) => Math.round(n).toString(16).padStart(2, '0');
// смешение цветов: t = 0 → a, t = 1 → b
const mix = (a, b, t) => [0, 2, 4].map((k) => hex(parseInt(a.substr(k, 2), 16) * (1 - t) + parseInt(b.substr(k, 2), 16) * t)).join('').toUpperCase();
const BAND = mix('FFFFFF', C.crimson, 0.08);   // подсветка периода сравнения
const BASE = mix('FFFFFF', C.blue, 0.07);      // подсветка базового периода
const pick = (series, key) => series.find((sr) => sr.name.trim().toLowerCase().startsWith(key)).values;

// Легенда точками в строку, выровненная по правому краю xr (ширины — по переведённому тексту)
function legendRow(s, xr, y, items, { size = 16, gap = 22 } = {}) {
  const ws = items.map(([, t]) => Math.ceil(widthOf(t, size)) + 4);
  let x = xr - ws.reduce((a, w) => a + 22 + w, 0) - gap * (items.length - 1);
  items.forEach(([color, t], k) => {
    s.circle({ x, y: y + (size * 1.2 - 14) / 2, d: 14, fill: color });
    s.text(t, { x: x + 22, y, w: ws[k], size, color: C.navy });
    x += 22 + ws[k] + gap;
  });
}
// Подпись строки данных: кружок цвета бренда + имя
function rowName(s, color, name, x, y, w, { bold = false, size = 15 } = {}) {
  s.circle({ x, y: y + (size * 1.2 - 12) / 2, d: 12, fill: color });
  s.text(name, { x: x + 20, y, w: w - 20, size, bold, color: C.navy });
}
// Тепловая ячейка: заливка по интенсивности, цифра поверх
function heatCell(s, { x, y, w, h, v, vmax, color, text, bold, size = 14 }) {
  const f = Math.min(1, v / vmax) ** 0.8 * 0.92;
  const fill = mix('FFFFFF', color, f);
  s.box({ x: x + 1.5, y: y + 1.5, w: w - 3, h: h - 3, fill, r: 4 });
  const lum = [0, 2, 4].map((k) => parseInt(fill.substr(k, 2), 16) / 255).reduce((a, c, k) => a + c * [0.299, 0.587, 0.114][k], 0);
  s.text(text, { x, y: y + (h - size * 1.2) / 2, w, size, bold, color: lum < 0.6 ? C.white : C.navy, align: 'center' });
}
// Горизонтальные полосы бюджета: rows = [{ name, value, text, color, bold }]
function budgetBars(s, rows, { x, y, w, nameW = 140, valW = 120, pitch = 44, size = 17 }) {
  const max = Math.max(...rows.map((r) => r.value));
  const bx = x + nameW;
  const bw = w - nameW - valW;
  rows.forEach((r, k) => {
    const yy = y + k * pitch;
    s.text(r.name, { x, y: yy + 3, w: nameW - 8, size, bold: !!r.bold, color: C.navy });
    const ww = Math.max(4, bw * r.value / max);
    s.box({ x: bx, y: yy + 2, w: ww, h: 26, fill: r.color, r: 4 });
    s.text(r.text, { x: bx + ww + 10, y: yy + 2, w: valW + bw - ww, size: 18, bold: true, color: C.navy });
  });
  return rows.length * pitch;
}
// Подписи месяцев под осью недель: подпись по центру своей группы + тонкие разделители
function monthAxisWeeks(s, m, groups, y, { size = 15 } = {}) {
  let i0 = 0;
  groups.forEach(([mo, n], gi) => {
    const xa = m.cat(i0) - m.step / 2;
    const xb = m.cat(i0 + n - 1) + m.step / 2;
    const w = Math.max(xb - xa, Math.ceil(widthOf(mo, size, true)) + 12);
    s.text(mo, { x: (xa + xb) / 2 - w / 2, y: y + 6, w, size, bold: true, color: C.navy, align: 'center' });
    if (gi > 0) s.seg(xa, y, xa, y + 26, { color: C.line, width: 1.5 });
    i0 += n;
  });
}
// Смешение цвета с белым: k = 0 — белый, 1 — исходный цвет
const tintOf = (c, k) => mix('FFFFFF', c, k);

module.exports = {
  // =====================================================================
  // 6 · Acrimycol / Digital Competitive Landscape (аналог — Dinobutin 5)
  // Комбо-график исходника (столбцы продаж + линии доли на второй оси) и график бюджета → три ряда на общей оси месяцев:
  // продажи (линии), доля продаж (строки чисел), digital-бюджет (тепловая полоса). Справа — бюджеты и key takeaways.
  // =====================================================================
  6: (d) => {
    const s = d.slide({
      title: 'Acrimycol / Digital Competitive Landscape',
      subtitle: 'Акримиколь показывает потенциал роста при ограниченной digital-поддержке, но неравномерное медиадавление пока не позволяет устойчиво закрепить долю продаж',
    });
    const all = charts(6);
    const combo = all.find((c) => c.type === 'COLUMN_CLUSTERED');
    const barS = combo.plots.find((p) => p.type === 'BarPlot').series;
    const shareS = combo.plots.find((p) => p.type === 'LinePlot').series;
    const budS = all.find((c) => c.type === 'LINE_MARKERS').plots[0].series;
    const B = [
      { ...BR.akr, key: 'akrimycol', site: 'akrimycol.ru' },
      { ...BR.zal, key: 'zalain', site: 'zalain.ru' },
      { ...BR.exo, key: 'exoderil', site: 'exoderil.com' },
    ];
    // в исходнике ряды подписаны «…, mln rur», но значения — в рублях: переводим в млн ₽
    const sales = B.map((b) => pick(barS, b.key).map((v) => v / 1e6));
    // доля продаж — как в подписях исходника, в целых процентах (июнь–июль 2026 в данных уже округлены до целых)
    const share = B.map((b) => pick(shareS, b.key).map((v) => Math.round(v * 100)));
    const budget = B.map((b) => pick(budS, b.site));
    const N = sales[0].length;                                // 19: янв 2025 – июл 2026
    const cats = Array.from({ length: N }, (_, i) => ({ m: i % 12, y: i < 12 ? 2025 : 2026 }));
    const labels = cats.map((c) => `${MONTHS[c.m]} ${c.y}`);

    // ---- левая карточка ----
    const LW = 1290;
    const CA = { x: X0, y: TOP, w: LW, h: BOT - TOP };
    s.card(CA);
    const NX = 94;
    const LBL = 'Динамика инвестиций в digital-медиа и продаж';
    s.label(LBL, { x: NX, y: 249, w: lw(LBL), color: C.blue });
    const PX0 = 262;
    const PX1 = CA.x + CA.w - 28;
    legendRow(s, PX1, 250, B.map((b) => [b.color, b.name]));
    const step = (PX1 - PX0) / N;
    const m = chartMap('col', N, { x: PX0, w: step * N, y: 0, h: 1 }, 0, 1);
    const xYear = m.cat(12) - step / 2;
    const RS = 27;

    // ряд 1: продажи, млн ₽ — три линии на одной шкале; подписи значений — у Акримиколя, конкуренты — строками чисел
    s.text('Продажи, млн ₽', { x: NX, y: 296, w: 300, size: 18, bold: true, color: C.navy });
    const P1 = { x: PX0, w: step * N, y: 330, h: 200 };
    const m1 = s.chart('line', [
      { name: 'Экзодерил, млн ₽', labels, values: sales[2].map((v) => +v.toFixed(2)) },
      { name: 'Залаин, млн ₽', labels, values: sales[1].map((v) => +v.toFixed(2)) },
      { name: 'Акримиколь, млн ₽', labels, values: sales[0].map((v) => +v.toFixed(2)) },
    ], { x: P1.x - 16, y: P1.y - 12, w: P1.w + 32, h: P1.h + 24, plot: P1, min: 0, max: 40, values: false, legend: false,
      colors: [BR.exo.color, BR.zal.color, BR.akr.color], lineSize: 2.5, symbolSize: 6,
      extra: { catAxisHidden: true, catAxisLineShow: false } });
    // Акримиколь — подпись над или под точкой: где дальше от линий конкурентов (в этой точке и у соседей)
    sales[0].forEach((v, i) => {
      const py = m1.val(v);
      const others = [];
      [1, 2].forEach((k) => [i - 1, i, i + 1].forEach((j) => {
        if (j < 0 || j >= N) return;
        // точка линии конкурента в середине полушага к соседу
        const yy = j === i ? m1.val(sales[k][i]) : (m1.val(sales[k][i]) + m1.val(sales[k][j])) / 2;
        others.push(yy);
      }));
      const clear = (y0, y1) => Math.min(...others.map((o) => (o >= y0 && o <= y1 ? 0 : Math.min(Math.abs(o - y0), Math.abs(o - y1)))));
      const below = clear(py + 6, py + 26);
      const above = clear(py - 26, py - 6);
      const ty = below >= above ? py + 6 : py - 26;
      s.text(f1(v), { x: m1.cat(i) - 30, y: ty, w: 60, size: 14, bold: true, color: C.blue, align: 'center' });
    });
    // имена линий у правого края
    rowName(s, BR.akr.color, BR.akr.name, NX, P1.y + P1.h - 70, PX0 - NX - 4, { bold: true, size: 16 });
    let y = P1.y + P1.h + 22;
    [1, 2].forEach((k, j) => {
      const yy = y + j * RS;
      rowName(s, B[k].color, B[k].name, NX, yy + 2, PX0 - NX - 4, { size: 15 });
      sales[k].forEach((v, i) => s.text(f1(v), { x: m.cat(i) - step / 2, y: yy + 3, w: step, size: 14, color: C.blueText, align: 'center' }));
    });
    y += 2 * RS + 22;

    // ряд 2: доля продаж, % — строки чисел (вторая ось исходника); выделены январь и июль 2026 из takeaway 2
    const t2 = 'Доля продаж, %';
    s.text(t2, { x: NX, y, w: 300, size: 18, bold: true, color: C.navy });
    s.badge({ x: NX + widthOf(t2, 18, true) + 12, y: y + 1, d: 22, n: 2, color: C.crimson, size: 13 });
    const ySH = y + 32;
    s.box({ x: PX0, y: ySH, w: step * N, h: RS, fill: C.cardTint, r: 4 });
    share.forEach((vals, k) => {
      const yy = ySH + k * RS;
      rowName(s, B[k].color, B[k].name, NX, yy + 3, PX0 - NX - 4, { bold: k === 0, size: 15 });
      vals.forEach((v, i) => {
        const hot = k < 2 && (i === 12 || i === N - 1);
        if (hot) s.box({ x: m.cat(i) - step / 2 + 4, y: yy + 1, w: step - 8, h: RS - 2, fill: C.white, stroke: C.crimson, sw: 2, r: 4 });
        s.text(`${v}%`, { x: m.cat(i) - step / 2, y: yy + 4, w: step, size: 14, bold: k === 0 || hot,
          color: hot ? C.crimson : k === 0 ? C.navy : C.blueText, align: 'center' });
      });
    });
    y = ySH + 3 * RS + 24;

    // ряд 3: digital-бюджет, млн ₽ — тепловая полоса
    const t3 = 'Digital-бюджет, млн ₽';
    s.text(t3, { x: NX, y, w: 400, size: 18, bold: true, color: C.navy });
    const b1x = NX + widthOf(t3, 18, true) + 12;
    s.badge({ x: b1x, y: y + 1, d: 22, n: 1, color: C.crimson, size: 13 });
    s.text('Estimated by DigitalBudget', { x: b1x + 34, y: y + 3, w: 400, size: 15, color: C.blueText });
    const RH = 34;
    const yBU = y + 36;
    budget.forEach((vals, k) => {
      const yy = yBU + k * RH;
      rowName(s, B[k].color, B[k].site, NX, yy + 8, PX0 - NX - 4, { bold: k === 0, size: 15 });
      vals.forEach((v, i) => heatCell(s, { x: m.cat(i) - step / 2, y: yy, w: step, h: RH, v, vmax: 7, color: B[k].color, text: f2(v), bold: k === 0 }));
    });
    const yEnd = yBU + 3 * RH;
    s.seg(xYear, 296, xYear, yEnd + 4, { color: C.line, width: 1.5, dash: 'dash' });
    cats.forEach((c, i) => s.text(MONTHS[c.m], { x: m.cat(i) - step / 2, y: yEnd + 10, w: step, size: 14, color: C.blueText, align: 'center' }));
    V.yearAxis(s, { ...m, step }, [['2025', 12], ['2026', N - 12]], yEnd + 10 + 14 + 8, { size: 16 });
    if (yEnd + 62 > BOT - 8) s.warn('график', LBL, `ось месяцев выходит за карточку: ${Math.round(yEnd + 62)} > ${BOT - 8}`);

    // ---- правая колонка ----
    const RX = X0 + LW + 20;
    const RW = X1 - RX;
    const hA = 262;
    s.card({ x: RX, y: TOP, w: RW, h: hA });
    s.label('Digital budgets *', { x: RX + 30, y: TOP + 28, w: RW - 60, color: C.blue });
    budgetBars(s, [
      { name: 'Залаин', value: 40, text: '40 млн ₽', color: BR.zal.color },
      { name: 'Экзодерил', value: 7.9, text: '7,9 млн ₽', color: BR.exo.color },
      { name: 'Акримиколь', value: 5.7, text: '5,7 млн ₽', color: BR.akr.color, bold: true },
    ], { x: RX + 30, y: TOP + 72, w: RW - 60, nameW: 140, valW: 116, pitch: 44 });
    s.text('* Бюджет указан за весь период 2025–2026 гг. Estimated by DigitalBudget', { x: RX + 30, y: TOP + hA - 62, w: RW - 60, size: 14, color: C.blueText });

    // Key takeaways
    const yB = TOP + hA + 18;
    const KH = BOT - yB;
    s.card({ x: RX, y: yB, w: RW, h: KH });
    s.label('Key takeaways', { x: RX + 30, y: yB + 28, w: RW - 60, color: C.crimson });
    const items = [
      '**Залаин сохраняет значительное преимущество по масштабу digital-поддержки:** инвестиции за январь 2025 — июль 2026 года составили 40 млн ₽ — в 8 раз больше бюджета Акримиколя. Бюджет Акримиколя — 5,7 млн ₽ — сопоставим с Экзодерилом, но распределён неравномерно, с отдельными пиками активности.',
      'С января по июль 2026 года **доля Акримиколя в продажах выросла с 5% до 7%**, а доля Залаина — с 3% до 6%, тогда как доля Экзодерила снизилась.',
      'Результаты указывают, что для закрепления динамики важны не только общий объём инвестиций, но и **своевременность и непрерывность поддержки**. Целесообразно синхронизировать усиление медиа с ключевыми периодами спроса и поддерживать достаточный базовый уровень присутствия',
    ];
    const TX = RX + 30 + 34;
    const TW = RW - 60 - 34;
    const avail = KH - 66 - 24;
    let fs = 18;
    const need = (z) => items.reduce((a, t) => a + measure(t, TW, z, false, 1.22), 0) + 2 * 16;
    while (fs > 15 && need(fs) > avail) fs -= 1;
    const gap = 16 + Math.max(0, Math.min(14, (avail - need(fs)) / 2));
    let ty = yB + 66;
    items.forEach((t, k) => {
      s.badge({ x: RX + 30, y: ty + (fs * 1.22 - 22) / 2, d: 22, n: k + 1, color: C.crimson, size: 13 });
      s.text(t, { x: TX, y: ty - 1, w: TW, size: fs, lh: 1.22, color: C.navy });
      ty += measure(t, TW, fs, false, 1.22) + gap;
    });
    if (ty - gap > BOT - 14) s.warn('takeaways', items[0], `текст выходит за карточку: ${Math.round(ty - gap)} > ${BOT - 14}`);

    s.footnote('Source: DigitalBudget, IQVIA', { y: 1030, w: 1730 });
  },

  // =====================================================================
  // 7 · Competitive Analysis / Creative Acrimycol (аналог — Normobact 6, Azelik 15)
  // Шесть роликов из исходника без изменений (K.video), пропорции — по кадру файла: 16:9; Офломил 4:3 (352×288, пиксель 12:11);
  // Розилак 11:9 (352×288). Баннер Залаина (квадрат) — рядом с его роликом.
  // Лид исходника длиннее двух строк шапки: первое предложение — подзаголовок, второе (про Розилак) — полоса над креативами.
  // =====================================================================
  7: (d) => {
    const s = d.slide({
      title: 'Competitive Analysis / Creative Acrimycol',
      subtitle: 'При ручном мониторинге зафиксировано, что в 2026 году конкуренты активно размещаются, но с другими формами — свечи при молочнице или капли/крем при грибке ногтей',
    });
    const PAD = 28;
    const G = 16;     // зазор внутри карточки
    const CG = 20;    // зазор между карточками
    const HEAD = 70;  // от верха карточки до кадра

    // полоса-вывод сверху: единственный конкурент со средством от микоза кожи
    const SH = 58;
    s.box({ x: X0, y: TOP, w: X1 - X0, h: SH, fill: C.cardTint, r: 15 });
    s.icon('tb:TbAlertCircle', { x: X0 + 22, y: TOP + (SH - 36) / 2, size: 36, color: C.crimson });
    s.text('Средства от микоза кожи в этом году со стороны конкурентов продвигались [[**только у Розилака**]]',
      { x: X0 + 74, y: TOP, w: X1 - X0 - 96, h: SH, size: 21, color: C.navy, valign: 'middle', fit: true, minSize: 17, maxLines: 1 });

    const y1 = TOP + SH + 16;
    const rowH = Math.floor((BOT - y1 - CG) / 2);
    const H = rowH - HEAD - PAD;                                // высота кадра
    const R169 = 16 / 9;
    // карточка бренда: подпись + канал, затем кадры; extra — дополнительная ширина (кадры по центру)
    const card = (x, y, w, b, frames, highlight) => {
      s.card({ x, y, w, h: rowH, tint: highlight, stroke: highlight ? C.crimson : undefined, sw: highlight ? 3 : undefined });
      s.circle({ x: x + PAD, y: y + 30, d: 16, fill: b.color });
      const nw = Math.ceil(widthOf(b.name, 24, true)) + 6;
      s.text(b.name, { x: x + PAD + 26, y: y + 22, w: nw, size: 24, bold: true, lh: 1.1, color: C.navy });
      s.text(b.ch, { x: x + PAD + 26 + nw + 12, y: y + 26, w: w - PAD * 2 - 26 - nw - 12, size: 18, color: C.blueText });
      const fw = frames.reduce((a, f) => a + H * f.r, 0) + G * (frames.length - 1);
      let fx = x + (w - fw) / 2;
      frames.forEach((f) => {
        const fwid = H * f.r;
        if (f.media) K.video(s, { media: f.media, cover: f.cover, x: fx, y: y + HEAD, w: fwid, h: H, name: f.name });
        else s.image(path.join(MEDIA, f.img), { x: fx, y: y + HEAD, w: fwid, h: H, alt: f.name });
        fx += fwid + G;
      });
    };
    const layout = (y, list) => {
      const nat = list.map((it) => it.frames.reduce((a, f) => a + H * f.r, 0) + G * (it.frames.length - 1) + PAD * 2);
      const spare = (X1 - X0 - CG * (list.length - 1)) - nat.reduce((a, b) => a + b, 0);
      if (spare < 0) s.warn('видео', list[0].b.name, `ряд не помещается по ширине: не хватает ${Math.round(-spare)}px`);
      let x = X0;
      list.forEach((it, k) => {
        const w = nat[k] + spare / list.length;
        card(x, y, w, it.b, it.frames, it.hl);
        x += w + CG;
      });
    };
    const OTHER = MUTED;
    layout(y1, [
      { b: { name: 'Залаин', ch: 'Digital', color: BR.zal.color }, frames: [
        { img: 'img_09cd8b98e3.png', r: 1, name: 'Залаин — баннер' },
        { media: 'media4.mp4', cover: 'image39.png', r: R169, name: 'Залаин — ролик' }] },
      { b: { name: 'Экзодерил', ch: 'Digital', color: BR.exo.color }, frames: [
        { media: 'media5.mp4', cover: 'image40.png', r: R169, name: 'Экзодерил — ролик' }] },
      { b: { name: 'Офломил', ch: 'TV + Digital', color: OTHER }, frames: [
        { media: 'media6.mp4', cover: 'image41.png', r: 4 / 3, name: 'Офломил — ролик' }] },
    ]);
    layout(y1 + rowH + CG, [
      { b: { name: 'Фунгодерил', ch: 'TV + Digital', color: OTHER }, frames: [
        { media: 'media7.mp4', cover: 'image42.png', r: R169, name: 'Фунгодерил — ролик' }] },
      { b: { name: 'Мизол Эвалар', ch: 'Digital', color: OTHER }, frames: [
        { media: 'media8.mp4', cover: 'image43.png', r: R169, name: 'Мизол Эвалар — ролик' }] },
      { b: { name: 'Розилак', ch: 'Digital', color: OTHER }, hl: true, frames: [
        { media: 'media9.mp4', cover: 'image44.png', r: 352 / 288, name: 'Розилак — ролик' }] },
    ]);
  },

  // =====================================================================
  // 8 · Сезонность поискового спроса в категории грибковых инфекций кожи (аналог — Dinobutin 9)
  // В исходнике — картинка-макет во весь слайд; все числа прочитаны по увеличенным кускам (zoom/s08_*.png) и сверены:
  // среднее за 18 месяцев = «~N тыс./мес.» в подписи строки, 1ПГ 2026 vs 1ПГ 2025 = итоговая строка макета.
  // =====================================================================
  8: (d) => {
    const s = d.slide({ title: 'Сезонность поискового спроса в категории грибковых инфекций кожи' });
    const M = [...MONTHS, ...MONTHS.slice(0, 6)];
    // тыс. запросов в месяц: 2025 янв–дек, 2026 янв–июн
    const DATA = [
      { name: 'Грибок стопы / между пальцами', avg: '~46', d: '↓ 2%',
        v: [42, 42, 47, 47, 45, 49, 54, 49, 47, 51, 46, 39, 38, 34, 44, 47, 51, 52] },
      { name: 'Общий микоз / грибок кожи', avg: '~117', d: '↓ 4%',
        v: [116, 117, 127, 125, 118, 113, 114, 104, 107, 131, 130, 114, 107, 123, 117, 115, 114, 112] },
      { name: 'Разноцветный отрубевидный лишай', avg: '~70', d: '↓ 6%',
        v: [60, 61, 71, 74, 78, 91, 101, 74, 65, 69, 64, 53, 54, 52, 69, 72, 78, 84] },
      { name: 'Стригущий лишай / микроспория', avg: '~81', d: '↑ 1%',
        v: [77, 80, 79, 73, 67, 67, 80, 91, 97, 104, 105, 94, 81, 74, 77, 73, 71, 71] },
    ];
    // тепловая шкала вокруг среднего строки: выше — малиновый оттенок, ниже — синий; ±35% = максимум
    const cell = (v, mean) => {
      const dv = v / mean - 1;
      const t = Math.min(1, Math.abs(dv) / 0.35);
      const fill = tintOf(dv > 0 ? C.crimson : C.blue, 0.05 + t * 0.5);
      return { text: String(v), fill, color: C.navy, bold: t >= 0.8, align: 'center' };
    };
    const MW = 66;
    const AW = 126;
    const DW = 166;
    const nameW = X1 - X0 - MW * 18 - AW - DW;    // 324
    const rows = [
      [{ text: 'тыс. запросов в месяц', fill: C.navy, color: C.white, bold: false, align: 'left' },
        { text: '2025', colspan: 12 }, { text: '2026 (янв–июн)', colspan: 6 },
        { text: 'Среднее в мес.*', rowspan: 2 }, { text: '1ПГ 2026\nvs 1ПГ 2025', rowspan: 2 }],
      [{ text: 'Показатель', fill: C.cardTint, color: C.blueText }, ...M.map((m) => ({ text: m, fill: C.cardTint, color: C.navy, align: 'center' }))],
    ];
    const RHt = 88;
    const rowH = [44, 54, ...DATA.map(() => RHt)];
    DATA.forEach((r) => {
      const mean = r.v.reduce((a, b) => a + b, 0) / r.v.length;
      rows.push([{ text: '' }, ...r.v.map((v) => cell(v, mean)),
        { text: `${r.avg} тыс.`, color: C.navy, bold: true, align: 'center', fill: C.cardTint },
        { text: r.d, color: C.navy, bold: true, align: 'center', fill: C.cardTint }]);
    });
    s.table(rows, { x: X0, y: TOP, w: X1 - X0, colW: [nameW, ...Array(18).fill(MW), AW, DW], rowH, size: 18 });
    const tH = rowH.reduce((a, b) => a + b, 0);
    s.vline(X0 + nameW + MW * 12, TOP, tH, C.navy, 2.5);   // граница 2025 | 2026
    s.vline(X0 + nameW + MW * 18, TOP, tH, C.navy, 2.5);   // граница данных и итогов
    // названия строк с номерами — номер связывает строку с выводом ниже
    let ry = TOP + rowH[0] + rowH[1];
    DATA.forEach((r, k) => {
      s.badge({ x: X0 + 12, y: ry + (RHt - 36) / 2, d: 36, n: k + 1, color: C.blue, size: 19 });
      const nw = nameW - 12 - 36 - 12 - 8;
      const nh = measure(r.name, nw, 19, true, 1.1);
      s.text(r.name, { x: X0 + 12 + 36 + 12, y: ry + (RHt - nh) / 2, w: nw, size: 19, bold: true, lh: 1.1, color: C.navy });
      ry += RHt;
    });

    // легенда подсветки — справа под таблицей; слева — пояснение
    const ly = TOP + tH + 12;
    let lx = X1;
    [[tintOf(C.blue, 0.5), 'ниже среднего строки'], [tintOf(C.crimson, 0.5), 'выше среднего строки']].forEach(([col, txt]) => {
      const w = Math.ceil(widthOf(txt, 15)) + 8;
      lx -= w;
      s.text(txt, { x: lx, y: ly, w, size: 15, lh: 1.0, color: C.blueText });
      lx -= 26;
      s.box({ x: lx, y: ly, w: 18, h: 16, fill: col, r: 4 });
      lx -= 28;
    });
    const noteH = s.text('* Среднее число каждой группы — среднее число запросов в месяц за январь 2025 — июнь 2026',
      { x: X0, y: ly, w: lx - X0 - 20, size: 15, lh: 1.15, color: C.blueText });

    // четыре вывода — по строкам таблицы
    const cy = ly + Math.max(18, noteH) + 18;
    const cols = columns(4, { gap: 23 });
    const pad = 26;
    const bd = 44;
    const insights = [
      { title: 'Грибок стопы — летний сценарий',
        body: 'Спрос оживает весной и достигает максимума в июне–июле. В начале 2026 года был спад, но в мае–июне интерес снова приближается к летнему пику.' },
      { title: 'Общий микоз — более ровный спрос',
        body: 'Категория менее сезонная: заметные подъёмы приходятся на март–апрель и октябрь–ноябрь. В 1-м полугодии 2026 года спрос снизился на 4%.' },
      { title: 'Разноцветный лишай — самый крупный сезонный всплеск',
        body: 'Рост начинается весной, максимумы приходятся на июнь–июль. Зимой интерес снижается почти вдвое относительно летнего пика.' },
      { title: 'Стригущий лишай — осеннее окно спроса',
        body: 'После спокойного лета запросы быстро растут с августа и достигают максимума в октябре–ноябре. В 1-м полугодии 2026 года спрос вырос на 1% к 2025 году.' },
    ];
    const TS = 21;
    const titleH = Math.max(...insights.map((it, i) => measure(it.title, cols[i].w - pad * 2 - bd - 14, TS, true, 1.15)));
    insights.forEach((it, i) => {
      const { x, w } = cols[i];
      const iw = w - pad * 2;
      s.card({ x, y: cy, w, h: BOT - cy });
      s.badge({ x: x + pad, y: cy + pad, d: bd, n: i + 1, color: C.blue, size: 24 });
      const tw = iw - bd - 14;
      const th = measure(it.title, tw, TS, true, 1.15);
      s.text(it.title, { x: x + pad + bd + 14, y: cy + pad + Math.max(0, (bd - th) / 2), w: tw, size: TS, bold: true, lh: 1.15, color: C.navy });
      const by = cy + pad + Math.max(bd, titleH) + 16;
      s.text(it.body, { x: x + pad, y: by, w: iw, h: BOT - 16 - by, size: 21, lh: 1.25, color: C.blueText, fit: true, minSize: 16 });
    });

    s.footnote('Источник: Yandex Wordstat, данные поисковых запросов. Категории: грибок стопы / общий микоз, разноцветный лишай, «отрубевидный лишай», «стригущий лишай» и микроспория', { y: 1030, w: 1730 });
  },

  // =====================================================================
  // 9 · Acrimycol / Search demand dynamics / 2026 (аналог — Dinobutin 8)
  // Индексы запросов Wordstat и Ozon — живые линии на общей оси недель; столбцы исходника («Показы, млн», вторая ось) —
  // отдельным рядом. Значения столбцов совпадают с рядом Wordstat Brand (индекс бренда = отношение соседних столбцов),
  // поэтому ряд подписан как недельное число запросов Акримиколя в Wordstat.
  // =====================================================================
  9: (d) => {
    const s = d.slide({
      title: 'Acrimycol / Search demand dynamics / 2026',
      subtitle: 'Акримиколь растёт быстрее категории в поиске и на Ozon,\nдемонстрируя усиление интереса к бренду',
    });
    const ch = charts(9).filter((c) => c.plots.some((p) => p.type === 'LinePlot'));
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
    const ser = (plot, word) => plot.series.find((x) => x.name.includes(word)).values.map(r1);
    const wsBrand = ser(wsLine, 'Brand');
    const wsCat = ser(wsLine, 'Category');
    const ozBrand = ser(ozLine, 'Brand');
    const ozCat = ser(ozLine, 'Category');
    const vol = wsBar.series[0].values.map((v) => Math.round(v / 100) / 10);   // запросов в неделю, тыс.
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
    // база Wordstat — с недели 29.12.2025 (с ней плитки исходника +158% / +101% сходятся с данными графика)
    const per = {
      wsBase: span('2025-12-29', '2026-02-28'), wsCmp: span('2026-06-01', '2026-08-31'),
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
    const lineOpts = (P, lo, hi) => ({ x: P.x - 10, y: P.y - 10, w: P.w + 20, h: P.h + 20, plot: P, min: lo, max: hi, values: false, legend: false,
      colors: [MUTED, BR.akr.color], symbol: 'none', lineSize: 2.5, extra: { catAxisHidden: true, catAxisLineShow: false } });
    const rowLabel = (text, y, note) => {
      s.label(text, { x: LX, y, w: 700, size: 20, color: C.blue });
      if (note) s.text(note, { x: LX + lw(text, 20) + 10, y: y + 2, w: 360, size: 15, color: C.blueText });
    };

    // Wordstat: индексы 78…136 — шкала 60…160
    rowLabel('Wordstat: динамика запросов', 247, 'линии — индекс запросов');
    legendRow(s, LR, 246, [[BR.akr.color, 'Акримиколь'], [MUTED, 'категория']], { size: 17, gap: 26 });
    const PW = { ...W, y: 306, h: 200 };
    const mW = chartMap('line', NW, PW, 60, 160);
    band(PW, per.wsBase, BASE, 'янв–фев', C.blue);
    band(PW, per.wsCmp, BAND, 'июнь–август', C.crimson);
    monthLines(PW);
    grid(mW, [80, 100, 120, 140]);
    s.chart('line', [
      { name: 'Wordstat · категория, индекс', labels: weeks, values: wsCat },
      { name: 'Wordstat · Акримиколь, индекс', labels: weeks, values: wsBrand },
    ], lineOpts(PW, 60, 160));

    // Ozon (на той же оси недель, с 23.03.2026): индексы 57…179 — шкала 40…190
    rowLabel('Ozon: динамика запросов', 534, 'линии — индекс запросов');
    legendRow(s, LR, 533, [[BR.akr.color, 'Акримиколь'], [MUTED, 'категория']], { size: 17, gap: 26 });
    const PO = { x: PX0 + OFF * step, w: step * (NW - OFF), y: 592, h: 200 };
    const POfull = { ...W, y: PO.y, h: PO.h };
    const mO = chartMap('line', NW, POfull, 40, 190);
    band(POfull, per.ozBase, BASE, 'март–апрель', C.blue);
    band(POfull, per.ozCmp, BAND, 'август', C.crimson);
    monthLines(POfull);
    grid(mO, [50, 100, 150]);
    s.text(`Данные Ozon доступны с ${ozWeeks[0]}`, { x: PX0 + 14, y: PO.y + 50, w: OFF * step - 28, size: 16, color: C.blueText });
    s.chart('line', [
      { name: 'Ozon · категория, индекс', labels: ozWeeks, values: ozCat },
      { name: 'Ozon · Акримиколь, индекс', labels: ozWeeks, values: ozBrand },
    ], lineOpts(PO, 40, 190));

    // столбцы исходника — отдельным рядом
    rowLabel('Wordstat · Акримиколь, тыс. запросов в неделю', 818);
    const PI = { ...W, y: 884, h: 64 };
    const IMAX = 1.75;
    s.chart('col', [{ name: 'Wordstat · Акримиколь, тыс. запросов в неделю', labels: weeks, values: vol }],
      { x: PI.x - 10, y: PI.y - 30, w: PI.w + 20, h: PI.h + 30, plot: PI, min: 0, max: IMAX, colors: [MUTED], legend: false, gap: 30,
        format: '0.0', labelSize: 13, labelColor: C.blueText, extra: { catAxisHidden: true, catAxisLineShow: false } });
    const mAx = chartMap('col', NW, PI, 0, IMAX);
    s.seg(W.x, PI.y + PI.h, W.x + W.w, PI.y + PI.h, { color: C.line, width: 1.5 });
    monthAxisWeeks(s, mAx, groups, PI.y + PI.h + 2, { size: 15 });

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
    const t1 = 'В Wordstat брендовый спрос заметно опережает категорию. Среднее недельное число запросов по Акримиколю в июне–августе выросло на 158% относительно января–февраля, тогда как категорийный спрос увеличился на 101%. Разница динамики составляет 57 п.п., что говорит о более высокой динамике брендового спроса относительно категории';
    const t2 = 'На Ozon у Акримиколя наблюдается положительная динамика при сравнении уровня спроса августа vs март–апрель (+104%), тогда как категория падает. В 2027 году рекомендуем поддерживать e-com активность и вести часть транзакционного трафика на Ozon';
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
    const spare = Math.max(0, (BOT - TOP) - fixedH - cardH(t1, fs) - cardH(t2, fs));
    let y = block(TOP, ['+158%', 'Акримиколь · Wordstat'], ['+101%', 'Категория · Wordstat'], cap1);
    const h1 = cardH(t1, fs) + spare / 2;
    conc(y, h1, t1);
    y += h1 + 18;
    y = block(y, ['+104%', 'Акримиколь · Ozon'], ['−12%', 'Категория · Ozon'], cap2);
    conc(y, BOT - y, t2);

    s.footnote('Источник: данные Ozon* и Яндекс Вордстат; данные Ozon доступны с 23.03.2026. Индекс запросов = значение недели / значение предыдущей недели × 100\nДля сравнения в выводах: Wordstat — средняя неделя июнь–август vs январь–февраль; Ozon — средний недельный спрос август vs март–апрель',
      { y: 1027, w: 1740 });
  },

  // =====================================================================
  // 10 · Анализ сегментов Акримиколь (аналог — Normobact 13)
  // В исходнике — картинка-макет во весь слайд; текст прочитан по увеличенным кускам (zoom/s10_*.png).
  // Иконки макета — иконками Tabler; цвета полос — как в макете (navy, blue, cyan, crimson).
  // =====================================================================
  10: (d) => {
    const s = d.slide({
      title: 'Анализ сегментов Акримиколь',
      subtitle: 'Сегментацию перестраивать не нужно: свежие данные подтверждают её основу, а новых полноценных сегментов не обнаружено',
    });
    const segs = [
      { icon: 'tb:TbUserStar', color: C.navy, name: 'Новички в категории грибка', text: '**Полностью подтверждается.**' },
      { icon: 'tb:TbRefresh', color: C.blue, name: 'Хроники с грибком стопы', text: '**Очень сильное подтверждение.**' },
      { icon: 'tb:TbSun', color: C.cyan, name: 'Разноцветный / отрубевидный / солнечный лишай', text: '**Сегмент небольшой, но чётко подтверждается в отзывах.**' },
      { icon: 'tb:TbStethoscope', color: C.crimson, name: 'Стригущий / кошачий лишай',
        text: 'Сегмент **не очень сильно заметен в отзывах**, он скорее имеет узкий\nврачебно-ориентированный сценарий.' },
    ];
    const G = 18;
    const RH = Math.floor((BOT - TOP - G * 3) / 4);
    const P = 26;
    const ID = 84;
    const nameX = X0 + 14 + P + ID + 26;
    const nameW = 470;
    const txtX = nameX + nameW + 60;
    const txtW = X1 - P - txtX;
    segs.forEach((g, i) => {
      const y = TOP + i * (RH + G);
      s.card({ x: X0, y, w: X1 - X0, h: RH });
      s.box({ x: X0, y: y + 20, w: 10, h: RH - 40, fill: g.color, r: 5 });
      s.icon(g.icon, { x: X0 + 14 + P, y: y + (RH - ID) / 2, size: ID, circle: g.color });
      const nh = measure(g.name, nameW, 28, true, 1.15);
      s.text(g.name, { x: nameX, y: y + (RH - nh) / 2, w: nameW, size: 28, bold: true, lh: 1.15, color: C.navy });
      s.vline(txtX - 30, y + P, RH - P * 2, g.color, 3);
      const th = measure(g.text, txtW, 26, false, 1.25);
      s.text(g.text, { x: txtX, y: y + (RH - th) / 2, w: txtW, size: 26, lh: 1.25, color: C.navy });
    });
    s.footnote('Источник: AI анализ отзывов', { y: 1030 });
  },
};
