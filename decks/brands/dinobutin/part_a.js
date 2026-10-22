// Динобутин · стратегия 2027 — часть A: слайды исходника 1–5
// (обложка, цели и задачи 2027, Offline Competitive Landscape ×2, Digital Competitive Landscape)
// Подача — как у одобренных Normobact 1–5 (decks/brands/normobact/part_a.js).
const path = require('path');
const { C, ACCENTS, chartMap, textWidth, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT, MUTED, yearAxis, gridY
const D = require('./common');                            // SRC, MEDIA, CROPS, fromSource, video
const SRC = D.SRC;

const TOP = V.TOP;          // 221 — верх контента
const BOT = V.BOT;          // 1005 — низ контента (в исходнике нет плашки-вывода)
const LW = 1330;            // левая карточка с графиками: 58…1388
const RX = 58 + LW + 20;    // правая колонка: 1408…1862
const RW = 1862 - RX;
const NAME_X = 94;          // подписи рядов внутри левой карточки

// ---------- помощники ----------
const charts = (n) => require(path.join(SRC, `slide-${String(n).padStart(2, '0')}.json`))
  .shapes.filter((sh) => sh.t === 'CHART').map((sh) => sh.chart);
const f1 = (v) => v.toFixed(1).replace('.', ',');
const f2 = (v) => v.toFixed(2).replace('.', ',');
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
// Excel-дата (45658) → { m: 0…11, y: 2025 }; shift — сдвиг в днях (неделя с понедельника относится к месяцу своего четверга)
const xl = (n, shift = 0) => { const dt = new Date(Date.UTC(1899, 11, 30) + (Number(n) + shift) * 86400000); return { m: dt.getUTCMonth(), y: dt.getUTCFullYear() }; };
// ширина строки по переведённому тексту (для раскладки в строку)
const tw = (t, size, bold) => textWidth(typo(tr(t)).replace(/\*\*|\[\[|\]\]/g, ''), size, bold);
// ширина КАПС-метки (s.label) по переведённому тексту
const lw = (t, size = 22) => Math.ceil(textWidth(typo(tr(t)).toUpperCase(), size, true)) + 6;
const hex = (n) => Math.round(n).toString(16).padStart(2, '0');
const mix = (a, b, t) => [0, 2, 4].map((k) => hex(parseInt(a.substr(k, 2), 16) * (1 - t) + parseInt(b.substr(k, 2), 16) * t)).join('').toUpperCase();

// Число строк с учётом жирных фрагментов (**…**) и переносов по дефису
function textLines(text, size, width) {
  const t = typo(tr(text)).replace(/\[\[|\]\]/g, '');
  const sp = textWidth(' ', size, false);
  let lines = 0;
  for (const para of t.split(/\n/)) {
    lines++;
    let bold = false;
    let cur = 0;
    let word = 0;
    let spaced = false;
    const flush = (nextSpaced) => {
      if (word) {
        const need = (spaced ? sp : 0) + word;
        if (cur === 0) cur = word;
        else if (cur + need <= width) cur += need;
        else { lines++; cur = word; }
        while (cur > width) { lines++; cur -= width; }
      }
      word = 0;
      spaced = nextSpaced;
    };
    for (let i = 0; i < para.length; i++) {
      if (para.startsWith('**', i)) { bold = !bold; i++; continue; }
      const ch = para[i];
      if (ch === ' ') { flush(true); continue; }
      word += textWidth(ch, size, bold);
      if (ch === '-' && word > textWidth('-', size, bold) && /[\p{L}\d]/u.test(para[i + 1] || '')) flush(false);
    }
    flush(false);
  }
  return lines;
}
// Легенда в строку: items = [[цвет, текст], ...]; x1 — выровнять по правому краю, иначе от x. mark: 'dot' | 'sq'
function legendRow(s, items, { x, x1, y, size = 16, gap = 22, mark = 'dot' }) {
  const mw = 14;
  const ws = items.map(([, t]) => tw(t, size, false));
  const total = ws.reduce((a, w) => a + mw + 8 + w + gap, 0) - gap;
  let lx = x1 !== undefined ? x1 - total : x;
  items.forEach(([color, t], k) => {
    const my = y + (size * 1.2 - 14) / 2;
    if (mark === 'dot') s.circle({ x: lx, y: my, d: 14, fill: color });
    else s.box({ x: lx, y: my, w: 14, h: 14, fill: color, r: 3 });
    s.text(t, { x: lx + mw + 8, y, w: ws[k] + 8, size, color: C.navy });
    lx += mw + 8 + ws[k] + gap;
  });
  return total;
}
// Подпись строки данных: кружок цвета бренда + имя
function rowName(s, b, x, y, w, { bold = false, size = 15, name } = {}) {
  s.circle({ x, y: y + (size * 1.2 - 12) / 2, d: 12, fill: b.color });
  s.text(name ?? b.name, { x: x + 20, y, w: w - 20, size, bold, color: C.navy });
}
// Ось месяцев + годы под общей шкалой m; cats = [{ m, y }] по категориям
function monthAxis(s, m, step, cats, y, { size = 14, ysize = 16 } = {}) {
  cats.forEach((c, i) => s.text(MONTHS[c.m], { x: m.cat(i) - step / 2, y, w: step, size, color: C.blueText, align: 'center' }));
  const groups = [];
  cats.forEach((c) => { if (!groups.length || groups[groups.length - 1][0] !== String(c.y)) groups.push([String(c.y), 0]); groups[groups.length - 1][1]++; });
  V.yearAxis(s, { ...m, step }, groups, y + size + 7, { size: ysize });
}
// Горизонтальные полосы бюджета: rows = [{ name, value, text, color, bold }]
function budgetBars(s, rows, { x, y, w, nameW = 128, valW = 120, pitch = 40, size = 17 }) {
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
// Карточка «Key takeaways» с номерами; пункт — строка или массив абзацев; кегль подбирается по высоте
function takeaways(s, items, { x, y, w, h, label = 'Key takeaways', max = 18, min = 15, gap = 18, pgap = 8, numbers = true }) {
  s.card({ x, y, w, h });
  s.label(label, { x: x + 30, y: y + 28, w: w - 60, color: C.crimson });
  const TX = x + 30 + (numbers ? 34 : 0);
  const TW = w - 60 - (numbers ? 34 : 0);
  const avail = h - 66 - 26;
  const paras = items.map((it) => (Array.isArray(it) ? it : [it]));
  const hOf = (t, z) => textLines(t, z, TW) * z * 1.22;
  const need = (z) => paras.reduce((a, ps) => a + ps.reduce((b, t) => b + hOf(t, z), 0) + (ps.length - 1) * pgap, 0) + (paras.length - 1) * gap;
  let sz = max;
  while (sz > min && need(sz) > avail) sz -= 1;
  if (paras.length > 1) gap += Math.max(0, Math.min(16, (avail - need(sz)) / (paras.length - 1)));
  let ty = y + 66;
  paras.forEach((ps, k) => {
    if (numbers) s.badge({ x: x + 30, y: ty + (sz * 1.22 - 22) / 2, d: 22, n: k + 1, color: C.crimson, size: 13 });
    ps.forEach((t, j) => {
      s.text(t, { x: TX, y: ty - 1, w: TW, size: sz, lh: 1.22, color: C.navy });
      ty += Math.ceil(hOf(t, sz)) + (j < ps.length - 1 ? pgap : 0);
    });
    ty += gap;
  });
  if (ty - gap > y + h - 16) s.warn('takeaways', paras[0][0], `текст выходит за карточку: ${Math.round(ty - gap)} > ${y + h - 16}`);
  return ty - gap;
}
// Тепловая ячейка: заливка по интенсивности, цифра поверх
function heatCell(s, { x, y, w, h, v, vmax, color, text, bold, size = 14 }) {
  const f = Math.min(1, v / vmax) ** 0.8 * 0.92;
  const fill = mix('FFFFFF', color, f);
  s.box({ x: x + 1.5, y: y + 1.5, w: w - 3, h: h - 3, fill, r: 4 });
  const lum = [0, 2, 4].map((k) => parseInt(fill.substr(k, 2), 16) / 255).reduce((a, c, k) => a + c * [0.299, 0.587, 0.114][k], 0);
  s.text(text, { x, y: y + (h - size * 1.2) / 2, w, size, bold, color: lum < 0.6 ? C.white : C.navy, align: 'center' });
}

// ---------- бренды (одинаково на всех слайдах деки) ----------
// Динобутин — синий (свой бренд), Тримедат — малиновый (главный конкурент), Необутин — второй акцент (cyan),
// Тримебутин — приглушённый
const BR = {
  din: { name: 'Динобутин', color: C.blue, ink: C.white },
  trm: { name: 'Тримедат', color: C.crimson, ink: C.white },
  neo: { name: 'Необутин', color: C.cyan, ink: C.navy },
  tmb: { name: 'Тримебутин', color: V.MUTED, ink: C.navy },
};
const brandSeries = (series, key) => series.find((sr) => sr.name.trim().toLowerCase().startsWith(key)).values;

// Карточка «2026 budget» (как в исходнике: 292M / 240M; это суммы января–августа 2026 —
// сверено с помесячными данными графика инвестиций слайда 3 и итогами слайда 4)
function offlineBudget(s) {
  const hA = 172;
  s.card({ x: RX, y: TOP, w: RW, h: hA });
  s.label('2026 budget', { x: RX + 30, y: TOP + 28, w: RW - 60, color: C.blue });
  budgetBars(s, [
    { name: 'Тримедат', value: 292, text: '292 млн ₽', color: BR.trm.color, bold: true },
    { name: 'Необутин', value: 240, text: '240 млн ₽', color: BR.neo.color, bold: true },
  ], { x: RX + 30, y: TOP + 72, w: RW - 60, nameW: 112, valW: 112, pitch: 42 });
  return TOP + hA;
}

module.exports = {
  // ===================== 1. Обложка =====================
  1: (d) => {
    const s = d.cover({ title: 'Dinobutin' });
    s.text('Strategic approach 2027 by OMD', { x: 296, y: 716, w: 1328, size: 44, lh: 1.1, color: C.white, align: 'center' });
  },

  // ===================== 2. Цели и задачи 2027 =====================
  // В исходнике — картинка во весь слайд (три полосы с красными номерами и иконками), текст — в картинке;
  // перенесён живым (сверен по увеличенным фрагментам), иконки — Tabler.
  // Под картинкой лежит старый живой текст цели 1 («…достичь 190 млн продаж в рублях и занять долю рынка 15%
  // в детском сегменте») — его не видно, источник истины — картинка (328 тыс. упаковок и 147 млн рублей).
  2: (d) => {
    const s = d.slide({ title: 'Цели и задачи для Динобутин в 2027 году' });
    const goals = [
      { icon: 'tb:TbTarget',
        t: 'Продолжить поддержку после запуска Динобутин в медиа и достичь продаж [[**328 тыс. упаковок**]] и [[**147 млн рублей**]] в 2027 году' },
      { icon: 'tb:TbChartBar',
        t: 'В брендметриках **вырастить знание** Динобутин и **конвертировать его в первую и повторную покупку**' },
      { icon: 'tb:TbHeartHandshake',
        t: 'В коммуникации убедить маму, что Динобутин — это **лучший выбор** при функциональных нарушениях работы ЖКТ у ребенка и донести до нее **УТП\u00a0Динобутина**' },
    ];
    const G = 24;
    const RH = (BOT - TOP - 2 * G) / 3;
    const PAD = 28;
    const NUM = 150;          // плитка с номером
    const ICON = 120;         // иконка в кружке справа
    goals.forEach((g, i) => {
      const col = ACCENTS[i];
      const y = TOP + i * (RH + G);
      s.card({ x: 58, y, w: 1804, h: RH });
      s.box({ x: 58 + PAD, y: y + PAD, w: NUM, h: RH - 2 * PAD, fill: col });
      s.text(String(i + 1), { x: 58 + PAD, y: y + PAD, w: NUM, h: RH - 2 * PAD, size: 110, bold: true, lh: 1, color: C.white, align: 'center', valign: 'middle' });
      const tx = 58 + PAD + NUM + 48;
      const ix = 1862 - PAD - 20 - ICON;
      s.text(g.t, { x: tx, y: y + PAD, w: ix - 48 - tx, h: RH - 2 * PAD, size: 36, lh: 1.22, color: C.navy, valign: 'middle', fit: true, minSize: 26 });
      s.icon(g.icon, { x: ix, y: y + (RH - ICON) / 2, size: ICON, color: C.white, circle: col });
    });
  },

  // ===================== 3. Offline Competitive Landscape — инвестиции и продажи =====================
  3: (d) => {
    const s = d.slide({
      title: 'Динобутин / Offline Competitive Landscape / 2025–2026',
      subtitle: 'Необутин и Тримедат находятся в паритете по уровню инвестиций в январе–июле 2026. При этом по уровню продаж Тримедат, как минимум, в 2 раза превосходит Необутин',
    });
    const all = charts(3);
    const invP = all.find((c) => c.type === 'COLUMN_STACKED').plots[0];
    const salesP = all.find((c) => c.type === 'LINE').plots[0];
    const cats = invP.cats.map((c) => xl(c));          // янв 2025 … сен 2026 (21 мес.)
    const NC = cats.length;
    const NS = salesP.cats.length;                       // продажи: янв 2025 … июн 2026 (18 мес.)
    const B = [{ ...BR.trm, key: 'тримедат' }, { ...BR.neo, key: 'необутин' }];
    const inv = B.map((b) => brandSeries(invP.series, b.key).map((v) => (v == null ? 0 : v / 1e6)));
    const sales = B.map((b) => brandSeries(salesP.series, b.key).map((v) => v / 1e6));
    const labels = cats.map((c) => `${MONTHS[c.m]} ${c.y}`);
    const idx = (y, mo) => cats.findIndex((c) => c.y === y && c.m === mo);

    const CA = { x: 58, y: TOP, w: LW, h: BOT - TOP };
    s.card(CA);
    const X0 = 160;
    const X1 = CA.x + CA.w - 30;
    const step = (X1 - X0) / NC;
    const m = chartMap('col', NC, { x: X0, w: step * NC, y: 0, h: 1 }, 0, 1);
    const xOf = (i) => m.cat(i) - step / 2;

    // ---- ряд 1: инвестиции, млн ₽ — столбцы брендов рядом ----
    const lw1 = lw('Динамика инвестиций');
    s.label('Динамика инвестиций', { x: NAME_X, y: 249, w: lw1, color: C.blue });
    s.text('млн ₽, Mediascope', { x: NAME_X + lw1 + 12, y: 251, w: 300, size: 17, color: C.blueText });
    legendRow(s, B.map((b) => [b.color, b.name]), { x1: X1, y: 251, size: 17, gap: 26 });
    const P1 = { x: X0, w: step * NC, y: 318, h: 214 };
    const GAP = 40;
    const m1 = s.chart('col', B.map((b, k) => ({ name: `${b.name}, млн ₽`, labels, values: inv[k].map((v) => +v.toFixed(3)) })),
      { x: P1.x - 10, y: P1.y - 10, w: P1.w + 20, h: P1.h + 20, plot: P1, min: 0, max: 90, gap: GAP, overlap: 0,
        colors: B.map((b) => b.color), legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
    const bw = step / (2 + GAP / 100);
    inv.forEach((vals, k) => vals.forEach((v, i) => {
      if (v <= 0) return;
      const xc = m1.cat(i) + (k - 0.5) * bw;
      s.text(v >= 9.95 ? String(Math.round(v)) : f1(v), { x: xc - 20, y: m1.val(v) - 19, w: 40, size: 13, bold: k === 0, color: C.navy, align: 'center' });
    }));
    s.seg(P1.x, P1.y + P1.h, X1, P1.y + P1.h, { color: C.line, width: 1.5 });
    // 2026: рост инвестиций Тримедата (вывод 2)
    const i26 = idx(2026, 0);
    s.badge({ x: xOf(i26) + 8, y: 290, d: 22, n: 2, color: C.crimson, size: 13 });

    // доля бренда в инвестициях месяца (SOS) — 100%-полоса под столбцами (в исходнике — отдельный график)
    const PS = { x: X0, w: step * NC, y: P1.y + P1.h + 10, h: 56 };
    s.text('SOS, %', { x: NAME_X, y: PS.y + 13, w: X0 - NAME_X - 6, size: 15, bold: true, color: C.navy });
    s.chart('col', B.map((b, k) => ({ name: `${b.name}, доля в инвестициях месяца`, labels, values: inv[k].map((v) => +v.toFixed(3)) })),
      { x: PS.x - 10, y: PS.y - 4, w: PS.w + 20, h: PS.h + 8, plot: PS, min: 0, max: 1, percent: true, gap: 30,
        colors: B.map((b) => b.color), legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
    cats.forEach((_, i) => {
      const tot = inv[0][i] + inv[1][i];
      if (tot <= 0) return;
      const sh = inv.map((sr) => sr[i] / tot);
      const yc = [PS.y + PS.h - sh[0] * PS.h / 2, PS.y + sh[1] * PS.h / 2];   // Тримедат снизу, Необутин сверху
      sh.forEach((v, k) => {
        if (v * PS.h < 14.5) return;
        s.text(`${Math.round(v * 100)}%`, { x: m.cat(i) - 26, y: yc[k] - 8, w: 52, size: 13, bold: true, color: B[k].ink, align: 'center' });
      });
    });

    // ---- ряд 2: продажи, млн ₽ — линии с подписями ----
    const yS = PS.y + PS.h + 24;
    const lw2 = lw('Динамика продаж');
    s.label('Динамика продаж', { x: NAME_X, y: yS, w: lw2, color: C.blue });
    s.text('млн ₽, IQVIA', { x: NAME_X + lw2 + 12, y: yS + 2, w: 300, size: 17, color: C.blueText });
    const P2 = { x: X0, w: step * NS, y: yS + 66, h: 0 };
    P2.h = 930 - P2.y;
    const lbS = salesP.cats.map((c) => { const t = xl(c); return `${MONTHS[t.m]} ${t.y}`; });
    const m2 = s.chart('line', B.map((b, k) => ({ name: `${b.name}, млн ₽`, labels: lbS, values: sales[k].map((v) => +v.toFixed(2)) })),
      { x: P2.x - 16, y: P2.y - 12, w: P2.w + 32, h: P2.h + 24, plot: P2, min: 0, max: 70, values: false, legend: false,
        colors: B.map((b) => b.color), lineSize: 3.5, symbolSize: 7, extra: { catAxisHidden: true, catAxisLineShow: false } });
    s.seg(P2.x, P2.y + P2.h, X1, P2.y + P2.h, { color: C.line, width: 1.5 });
    sales.forEach((vals, k) => vals.forEach((v, i) => {
      s.text(f1(v), { x: m2.cat(i) - 28, y: m2.val(v) - 25, w: 56, size: 14, bold: k === 0, color: C.navy, align: 'center' });
    }));
    // подписи у концов линий + номер вывода 1
    B.forEach((b, k) => {
      const v = sales[k][NS - 1];
      s.text(b.name, { x: m2.cat(NS - 1) + 18, y: m2.val(v) - 11, w: 140, size: 17, bold: true, color: k === 0 ? C.crimson : C.navy });
    });
    s.badge({ x: m2.cat(NS - 1) + 18, y: m2.val(sales[0][NS - 1]) + 16, d: 22, n: 1, color: C.crimson, size: 13 });

    // граница годов и ось месяцев (общая для обоих графиков)
    const xY = xOf(i26);
    s.seg(xY, 290, xY, PS.y + PS.h, { color: C.line, width: 1.5, dash: 'dash' });
    s.seg(xY, P2.y - 30, xY, P2.y + P2.h + 4, { color: C.line, width: 1.5, dash: 'dash' });
    monthAxis(s, m, step, cats, P2.y + P2.h + 8);
    if (P2.y + P2.h + 8 + 14 + 7 + 20 > BOT - 8) s.warn('график', 'Динамика продаж', `ось месяцев выходит за карточку: ${Math.round(P2.y + P2.h + 49)}`);

    // ---- правая колонка ----
    const yB = offlineBudget(s) + 18;
    takeaways(s, [
      'Тримедат и Необутин инвестируют сопоставимые объемы (**292 млн ₽ и 240 млн ₽**), однако **продажи Тримедата остаются более чем в 2 раза выше**, что указывает на влияние силы бренда и накопленного спроса',
      'Несмотря на **рост инвестиций Тримедата в 2,2 раза** в 2026 году, **продажи остались стабильными (−3% YoY)**, подтверждая необходимость комплексной работы с потребительским спросом',
    ], { x: RX, y: yB, w: RW, h: BOT - yB, max: 20, min: 15, gap: 26 });

    s.footnote('Источник: Mediascope, IQVIA. 2026 budget — январь–август 2026; рост в 2,2 раза — инвестиции январь–август 2026 к январю–августу 2025; −3% YoY — продажи январь–июнь 2026 к январю–июню 2025 (расчёт OMD). SOS — доля бренда в инвестициях месяца', { y: 1030, w: 1730 });
  },

  // ===================== 4. Offline Competitive Landscape — каналы и рейтинги ТВ =====================
  4: (d) => {
    const s = d.slide({
      title: 'Динобутин / Offline Competitive Landscape / 2025–2026',
      subtitle: 'Вся категория играет через Нац. ТВ как основной инструмент формирования знания и доверия',
    });
    const all = charts(4);
    const shareP = all.find((c) => c.type === 'BAR_STACKED_100').plots[0];
    const absP = all.find((c) => c.type === 'BAR_STACKED').plots[0];
    const tvP = all.find((c) => c.type === 'COLUMN_STACKED').plots[0];
    // категории исходника: необутин (1-8 2025, 1-8 2026), тримедат (1-8 2025, 1-8 2026)
    const RB = [BR.neo, BR.trm];
    const CH = [
      { key: 'nat.tv', name: 'Нац. ТВ', color: C.crimson, ink: C.white },
      { key: 'olv', name: 'OLV', color: C.navy, ink: C.white },
      { key: 'outdoor', name: 'OOH', color: C.green, ink: C.white },
    ];
    const NR = shareP.cats.length;     // 4
    const val = (P, ch, i) => P.series.find((sr) => sr.name === ch.key).values[i] || 0;
    const total = (i) => absP.series.find((sr) => sr.name === 'total').values[i] / 1e6;
    const rowLbl = shareP.cats.map((c) => (c.includes('2025') ? 'янв–авг 2025' : 'янв–авг 2026'));

    const CA = { x: 58, y: TOP, w: LW, h: BOT - TOP };
    s.card(CA);
    const YX = 228;              // колонка периода
    const AX0 = 384;             // доли по каналам: 384…790
    const AX1 = 790;
    const BX0 = 850;             // инвестиции, млн ₽: 850…1220 (+ итог справа)
    const BX1 = 1220;
    const LB1 = 'Доля инвестиций по каналам';
    s.label(LB1, { x: NAME_X, y: 249, w: lw(LB1), color: C.blue });
    s.badge({ x: NAME_X + lw(LB1) + 8, y: 249, d: 22, n: 1, color: C.crimson, size: 13 });
    s.label('Инвестиции по каналам', { x: BX0, y: 249, w: lw('Инвестиции по каналам'), color: C.blue });
    s.text('млн ₽', { x: BX0 + lw('Инвестиции по каналам') + 10, y: 251, w: 120, size: 17, color: C.blueText });
    legendRow(s, CH.map((c) => [c.color, c.name]), { x: NAME_X, y: 290, size: 16, gap: 26, mark: 'sq' });

    const PA = { x: AX0, y: 330, w: AX1 - AX0, h: 4 * 46 };
    const PB = { x: BX0, y: PA.y, w: BX1 - BX0, h: PA.h };
    const labels = shareP.cats.map((c, i) => `${RB[Math.floor(i / 2)].name}, ${rowLbl[i]}`);
    const mA = s.chart('bar', CH.map((c) => ({ name: c.name, labels, values: shareP.cats.map((_, i) => +val(shareP, c, i).toFixed(4)) })),
      { x: PA.x - 10, y: PA.y - 6, w: PA.w + 20, h: PA.h + 12, plot: PA, min: 0, max: 1, percent: true, gap: 50,
        colors: CH.map((c) => c.color), legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
    const mB = s.chart('bar', CH.map((c) => ({ name: `${c.name}, млн ₽`, labels, values: absP.cats.map((_, i) => +(val(absP, c, i) / 1e6).toFixed(3)) })),
      { x: PB.x - 10, y: PB.y - 6, w: PB.w + 20, h: PB.h + 12, plot: PB, min: 0, max: 300, stacked: true, gap: 50,
        colors: CH.map((c) => c.color), legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
    for (let i = 0; i < NR; i++) {
      const yc = mA.cat(i);
      const b = RB[Math.floor(i / 2)];
      if (i % 2 === 0) {
        if (i > 0) s.hline(NAME_X - 8, yc - mA.step / 2, 1388 - 30 - (NAME_X - 8));
        rowName(s, b, NAME_X, yc - 10, YX - NAME_X - 6, { bold: true, size: 17 });
      }
      s.text(rowLbl[i], { x: YX, y: yc - 9, w: AX0 - YX - 10, size: 15, color: C.blueText });
      let cum = 0;
      CH.forEach((c) => {
        const v = val(shareP, c, i);
        const xc = PA.x + PA.w * (cum + v / 2);
        cum += v;
        if (v >= 0.05) s.text(`${Math.round(v * 100)}%`, { x: xc - 30, y: yc - 9, w: 60, size: 14, bold: true, color: c.ink, align: 'center' });
      });
      // итог за период + OOH Тримедата 2026 подписью
      const t = total(i);
      const xe = mB.val(t);
      s.text(f1(t), { x: xe + 8, y: yc - 10, w: 90, size: 16, bold: true, color: C.navy });
      const ooh = val(absP, CH[2], i) / 1e6;
      if (ooh > 0) s.text(`OOH ${f1(ooh)}`, { x: xe + 70, y: yc - 9, w: 120, size: 14, color: C.green, bold: true });
    }

    // ---- нижняя часть: динамика рейтингов Нац. ТВ по неделям ----
    const yT = PA.y + PA.h + 14;
    s.hline(NAME_X - 8, yT, 1388 - 30 - (NAME_X - 8));
    const LB3 = 'Динамика рейтингов Нац. ТВ';
    s.label(LB3, { x: NAME_X, y: yT + 22, w: lw(LB3), color: C.blue });
    s.badge({ x: NAME_X + lw(LB3) + 8, y: yT + 22, d: 22, n: 2, color: C.crimson, size: 13 });
    s.text('TVR, Ж 25–50 с детьми 3–10 лет', { x: NAME_X + lw(LB3) + 42, y: yT + 24, w: 420, size: 17, color: C.blueText });
    const TB = [{ ...BR.trm, key: 'тримедат' }, { ...BR.neo, key: 'необутин' }];   // Тримедат у оси
    const X0 = 160;
    const X1 = 1358;
    legendRow(s, TB.map((b) => [b.color, b.name]), { x1: X1, y: yT + 24, size: 17, gap: 26 });
    const NW = tvP.cats.length;     // 88 недель: 30.12.2024 … 31.08.2026
    const wk = tvP.cats.map((c) => xl(c, 3));     // месяц и год недели — по её четвергу
    const P3 = { x: X0, w: X1 - X0, y: yT + 84, h: 0 };
    P3.h = 940 - P3.y;
    const m3 = chartMap('col', NW, P3, 0, 550);
    V.gridY(s, m3, [0, 100, 200, 300, 400, 500], { suffix: '' });
    const wl = wk.map((c, i) => `${MONTHS[c.m]} ${c.y}, неделя ${i + 1}`);
    s.chart('col', TB.map((b) => ({ name: `${b.name}, TVR`, labels: wl, values: brandSeries(tvP.series, b.key).map((v) => (v == null ? 0 : +v.toFixed(1))) })),
      { x: P3.x - 10, y: P3.y - 10, w: P3.w + 20, h: P3.h + 20, plot: P3, min: 0, max: 550, stacked: true, gap: 35,
        colors: TB.map((b) => b.color), legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
    // ось месяцев по неделям: подпись по центру группы недель месяца
    const mg = [];
    wk.forEach((c, i) => { const k = `${c.y}-${c.m}`; if (!mg.length || mg[mg.length - 1].k !== k) mg.push({ k, m: c.m, i0: i, n: 0 }); mg[mg.length - 1].n++; });
    const yM = P3.y + P3.h + 8;
    mg.forEach((g) => {
      const x0 = m3.cat(g.i0) - m3.step / 2;
      const w = Math.max(g.n * m3.step, 40);
      s.text(MONTHS[g.m], { x: x0 + g.n * m3.step / 2 - w / 2, y: yM, w, size: 14, color: C.blueText, align: 'center' });
    });
    const yg = [];
    wk.forEach((c) => { if (!yg.length || yg[yg.length - 1][0] !== String(c.y)) yg.push([String(c.y), 0]); yg[yg.length - 1][1]++; });
    V.yearAxis(s, m3, yg, yM + 21, { size: 16 });
    const xY = m3.cat(yg[0][1]) - m3.step / 2;
    s.seg(xY, P3.y - 10, xY, P3.y + P3.h + 4, { color: C.line, width: 1.5, dash: 'dash' });
    if (yM + 21 + 20 > BOT - 8) s.warn('график', LB3, `ось недель выходит за карточку: ${Math.round(yM + 41)}`);

    // ---- правая колонка ----
    const yB = offlineBudget(s) + 18;
    takeaways(s, [
      'Необутин и Тримедат направляют **до 100% рекламных инвестиций в Нац. ТВ**, обеспечивая масштабное присутствие среди целевой аудитории через регулярные сезонные флайты',
      [
        '**Конкуренты используют ТВ не как разовую поддержку, а как постоянный драйвер видимости бренда.**',
        'В 2026 году **Необутин реализовал 3 флайта, Тримедат — 4 флайта**, поддерживая высокий уровень контакта с аудиторией',
      ],
    ], { x: RX, y: yB, w: RW, h: BOT - yB, max: 20, min: 15, gap: 26, pgap: 8 });

    s.footnote('Источник: Mediascope. 2026 budget — январь–август 2026. Рейтинги Нац. ТВ — по неделям', { y: 1030, w: 1730 });
  },

  // ===================== 5. Digital Competitive Landscape =====================
  5: (d) => {
    const s = d.slide({
      title: 'Динобутин / Digital Competitive Landscape / 2025–2026',
      subtitle: 'Динобутин смог быстро занять место в категории при минимальном уровне инвестиций, но для дальнейшего роста необходимо закрепить достигнутый результат и проверить масштабируемость поддержки',
    });
    const all = charts(5);
    const salesC = all.find((c) => c.type === 'COLUMN_CLUSTERED');
    const budP = all.find((c) => c.type === 'LINE_MARKERS').plots[0];
    const barP = salesC.plots.find((p) => p.type === 'BarPlot').series;
    // порядок рядов: свой бренд, затем конкуренты по объёму продаж
    const B = [
      { ...BR.din, key: 'dinobutin', site: 'dinobutin.ru' },
      { ...BR.trm, key: 'trimedat', site: 'trimedat.ru' },
      { ...BR.neo, key: 'neobutin', site: 'neobutin.ru' },
      // в мониторинге DigitalBudget Тримебутин — это сайт gastrocanon.ru (в исходнике подписан TRIMEBUTIN)
      { ...BR.tmb, key: 'trimebutin', site: 'gastrocanon.ru', star: true },
    ];
    const sales = B.map((b) => pick(barP, b.key));                          // млн ₽, янв 2025 – июн 2026
    const NS = sales[0].length;       // 18
    // доля продаж — доля бренда в сумме продаж четырёх брендов (так считана линия исходника; в июне 2026 там
    // округлённые 0,66 / 0,29 / 0 / 0,05 — пересчитываем из продаж того же графика, чтобы сходилось с выводом «65,7%»)
    const share = B.map((_, k) => sales[k].map((v, i) => 100 * v / sales.reduce((a, sr) => a + sr[i], 0)));
    const budget = B.map((b) => pick(budP.series, b.site));                 // digital-бюджет, млн ₽, янв 2025 – авг 2026
    const NB = budP.cats.length;      // 20
    const cats = Array.from({ length: NB }, (_, i) => ({ m: i % 12, y: i < 12 ? 2025 : 2026 }));
    const labelsS = cats.slice(0, NS).map((c) => `${MONTHS[c.m]} ${c.y}`);

    // ---- левая карточка: продажи, доля продаж, digital-бюджет на общей оси месяцев ----
    const CA = { x: 58, y: TOP, w: LW, h: BOT - TOP };
    s.card(CA);
    const LBL = 'Динамика инвестиций в digital-медиа и продаж';
    s.label(LBL, { x: NAME_X, y: 249, w: lw(LBL), color: C.blue });
    const X0 = 262;
    const X1 = CA.x + CA.w - 28;
    legendRow(s, B.map((b) => [b.color, b.name]), { x1: X1, y: 250, size: 16, gap: 22 });
    const step = (X1 - X0) / NB;
    const m = chartMap('col', NB, { x: X0, w: step * NB, y: 0, h: 1 }, 0, 1);
    const xYear = m.cat(12) - step / 2;
    const RS = 27;

    // ряд 1: продажи, млн ₽ — Динобутин линией с подписями (своя шкала), конкуренты строками
    s.text('Продажи, млн ₽', { x: NAME_X, y: 296, w: 300, size: 18, bold: true, color: C.navy });
    const P1 = { x: X0, w: step * NS, y: 356, h: 124 };
    rowName(s, B[0], NAME_X, P1.y + P1.h - 30, X0 - NAME_X - 4, { bold: true, size: 16 });
    const m1 = s.chart('line', [{ name: 'Динобутин, млн ₽', labels: labelsS, values: sales[0].map((v) => +v.toFixed(3)) }],
      { x: P1.x - 16, y: P1.y - 12, w: P1.w + 32, h: P1.h + 24, plot: P1, min: 0, max: 3.6, values: false, legend: false,
        colors: [C.blue], lineSize: 3.5, symbolSize: 7, extra: { catAxisHidden: true, catAxisLineShow: false } });
    sales[0].forEach((v, i) => {
      if (v <= 0) return;
      const last = i === NS - 1;
      s.text(f2(v), { x: m1.cat(i) - (last ? 34 : 30), y: m1.val(v) - 26, w: 60, size: 14, bold: true, color: C.blue, align: 'center' });
    });
    let y = P1.y + P1.h + 16;
    [1, 2, 3].forEach((k, j) => {
      const yy = y + j * RS;
      rowName(s, B[k], NAME_X, yy + 2, X0 - NAME_X - 4, { size: 15 });
      sales[k].forEach((v, i) => s.text(k === 3 ? f2(v) : f1(v), { x: m.cat(i) - step / 2, y: yy + 3, w: step, size: 14, color: C.blueText, align: 'center' }));
    });
    y += 3 * RS + 24;

    // ряд 2: доля продаж, % — строки чисел (вторая ось исходника)
    const t2 = 'Доля продаж, %';
    s.text(t2, { x: NAME_X, y, w: 300, size: 18, bold: true, color: C.navy });
    s.badge({ x: NAME_X + tw(t2, 18, true) + 12, y: y + 1, d: 22, n: 1, color: C.crimson, size: 13 });
    const ySH = y + 32;
    s.box({ x: X0, y: ySH, w: step * NS, h: RS, fill: C.cardTint, r: 4 });
    share.forEach((vals, k) => {
      const yy = ySH + k * RS;
      rowName(s, B[k], NAME_X, yy + 3, X0 - NAME_X - 4, { bold: k === 0, size: 15 });
      vals.forEach((v, i) => {
        // Тримедат: январь и июнь 2026 — точки из Key takeaways (70,2% → 65,7%)
        const hot = k === 1 && (i === 12 || i === 17);
        if (hot) s.box({ x: m.cat(i) - step / 2 + 2, y: yy + 1, w: step - 4, h: RS - 2, fill: C.white, stroke: C.crimson, sw: 2, r: 4 });
        s.text(f1(v), { x: m.cat(i) - step / 2, y: yy + 4, w: step, size: 14, bold: k === 0 || hot,
          color: hot ? C.crimson : k === 0 ? C.navy : C.blueText, align: 'center' });
      });
    });
    y = ySH + 4 * RS + 24;

    // ряд 3: digital-бюджет, млн ₽ — тепловая полоса
    const t3 = 'Digital-бюджет, млн ₽';
    s.text(t3, { x: NAME_X, y, w: 400, size: 18, bold: true, color: C.navy });
    s.text('Estimated by DigitalBudget', { x: NAME_X + tw(t3, 18, true) + 14, y: y + 3, w: 400, size: 15, color: C.blueText });
    const RH = 33;
    const yBU = y + 36;
    budget.forEach((vals, k) => {
      const yy = yBU + k * RH;
      rowName(s, B[k], NAME_X, yy + 7, X0 - NAME_X - 4, { bold: k === 0, size: 15, name: B[k].site });
      vals.forEach((v, i) => heatCell(s, { x: m.cat(i) - step / 2, y: yy, w: step, h: RH, v, vmax: 10, color: B[k].color, text: f2(v), bold: k === 0 }));
    });
    const yEnd = yBU + 4 * RH;
    s.seg(xYear, 296, xYear, yEnd + 4, { color: C.line, width: 1.5, dash: 'dash' });
    monthAxis(s, m, step, cats, yEnd + 8);
    if (yEnd + 8 + 14 + 7 + 20 > BOT - 8) s.warn('график', LBL, `ось месяцев выходит за карточку: ${Math.round(yEnd + 49)} > ${BOT - 8}`);

    // ---- правая колонка ----
    const hA = 288;
    s.card({ x: RX, y: TOP, w: RW, h: hA });
    s.label('Digital budgets', { x: RX + 30, y: TOP + 28, w: RW - 60, color: C.blue });
    budgetBars(s, [
      { name: 'Необутин', value: 11.9, text: '11,9 млн ₽', color: BR.neo.color },
      { name: 'Тримедат', value: 4.3, text: '4,3 млн ₽', color: BR.trm.color },
      { name: 'Динобутин', value: 0.7, text: '0,7 млн ₽', color: BR.din.color, bold: true },
      { name: 'Тримебутин*', value: 0.4, text: '0,4 млн ₽', color: BR.tmb.color },
    ], { x: RX + 30, y: TOP + 70, w: RW - 60, nameW: 146, valW: 116, pitch: 42 });
    s.text('Estimated by DigitalBudget', { x: RX + 30, y: TOP + hA - 44, w: RW - 60, size: 14, color: C.blueText });

    const yB = TOP + hA + 18;
    takeaways(s, [
      'Тримедат по доле продаж **сохраняет лидерство**, однако **его доля снизилась с 70,2% в январе до 65,7% в июне**. Доля Необутина колебалась в диапазоне 29–33%, тогда как **Динобутин последовательно укреплял позицию**. Это создаёт потенциал для дальнейшего роста нового бренда, но не позволяет напрямую говорить о перетоке продаж от конкретного конкурента',
    ], { x: RX, y: yB, w: RW, h: BOT - yB, max: 20, min: 15 });

    s.footnote('Источник: DigitalBudget (estimated), IQVIA. Доля продаж — доля бренда в продажах четырёх брендов на графике; Digital budgets — январь–август 2026 (расчёт OMD). * Тримебутин в мониторинге DigitalBudget — сайт gastrocanon.ru', { y: 1030, w: 1730 });
  },
};

function pick(series, key) {
  return series.find((sr) => sr.name.trim().toLowerCase().startsWith(key)).values;
}
