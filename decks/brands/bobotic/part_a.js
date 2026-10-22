// Боботик · стратегия 2027 — часть A: слайды исходника 1–6
// (обложка, цели и задачи 2027, Competitive Landscape ×2, креативы конкурентов, коммуникация Лактазара)
const path = require('path');
const { C, ACCENTS, CHART_COLORS, columns, IN, PT, chartMap, textWidth, fitSize, countLines, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT, MUTED, GRID, fmt, pct, statTile, numMark, legend, yearAxis, gridY
const B = require('./common');                            // SRC, MEDIA, CROPS, fromSource, video
const SRC = B.SRC;
const MEDIA = B.MEDIA;
const CROPS = B.CROPS;

const TOP = V.TOP;          // 221 — верх контента
const BOT = V.BOT;          // 1005 — низ контента без плашки
const BOT_P = 905;          // низ контента над плашкой-выводом
const MUTED = '93AACB';     // фоновый бренд 1 (сине-серый)
const MUTED2 = '64BEE8';    // фоновый бренд 2 (голубой)

// ---------- помощники ----------
const charts = (n) => require(path.join(SRC, `slide-${String(n).padStart(2, '0')}.json`))
  .shapes.filter((sh) => sh.t === 'CHART').map((sh) => sh.chart);
const f1 = (v) => v.toFixed(1).replace('.', ',');
const f2 = (v) => v.toFixed(2).replace('.', ',');
const hex = (n) => Math.round(n).toString(16).padStart(2, '0');
// смешение цветов: t = 0 → a, t = 1 → b
const mix = (a, b, t) => [0, 2, 4].map((k) => hex(parseInt(a.substr(k, 2), 16) * (1 - t) + parseInt(b.substr(k, 2), 16) * t)).join('').toUpperCase();
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const EN_M = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
// категории графика исходника ('jan', 'feb', …) → { m, y }; ряд начинается с января 2025 (подпись оси исходника)
const monthCats = (cats, y0 = 2025) => {
  let y = y0;
  let prev = -1;
  return cats.map((c) => {
    const m = EN_M.indexOf(String(c).trim().toLowerCase());
    if (m < prev) y++;
    prev = m;
    return { m, y };
  });
};
// ширина строки по переведённому тексту (для раскладки в строку)
const tw = (t, size, bold) => textWidth(typo(tr(t)).replace(/\*\*|\[\[|\]\]/g, ''), size, bold);
// ширина КАПС-метки (s.label) по переведённому тексту
const lw = (t, size = 22) => Math.ceil(textWidth(typo(tr(t)).toUpperCase(), size, true)) + 6;
const pick = (series, key) => series.find((sr) => sr.name.toLowerCase().includes(key)).values;

// Число строк с учётом жирных фрагментов (**…**) и переносов по дефису (PowerPoint и LibreOffice рвут «digital-поддержки»)
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
  const ws = items.map(([, t]) => tw(t, size, false));
  const total = ws.reduce((a, w) => a + 14 + 8 + w + gap, 0) - gap;
  let lx = x1 !== undefined ? x1 - total : x;
  items.forEach(([color, t], k) => {
    const my = y + (size * 1.2 - 14) / 2;
    if (mark === 'dot') s.circle({ x: lx, y: my, d: 14, fill: color });
    else s.box({ x: lx, y: my, w: 14, h: 14, fill: color, r: 3 });
    s.text(t, { x: lx + 22, y, w: ws[k] + 8, size, color: C.navy });
    lx += 14 + 8 + ws[k] + gap;
  });
  return total;
}
// Подпись строки данных: кружок цвета бренда + имя
function rowName(s, b, x, y, w, { bold = false, size = 15 } = {}) {
  s.circle({ x, y: y + (size * 1.2 - 12) / 2, d: 12, fill: b.color });
  s.text(b.name, { x: x + 20, y, w: w - 20, size, bold, color: C.navy });
}
// Ось месяцев + годы под общей шкалой m (chartMap)
function monthAxis(s, m, step, cats, y, { size = 14, ysize = 16 } = {}) {
  cats.forEach((c, i) => s.text(MONTHS[c.m], { x: m.cat(i) - step / 2, y, w: step, size, color: C.blueText, align: 'center' }));
  const groups = [];
  cats.forEach((c) => { if (!groups.length || groups[groups.length - 1][0] !== String(c.y)) groups.push([String(c.y), 0]); groups[groups.length - 1][1]++; });
  V.yearAxis(s, { ...m, step }, groups, y + size + 7, { size: ysize });
}
// Тепловая ячейка: заливка по интенсивности, цифра поверх
function heatCell(s, { x, y, w, h, v, vmax, color, text, bold, size = 14 }) {
  const f = Math.min(1, v / vmax) ** 0.8 * 0.92;
  s.box({ x: x + 1.5, y: y + 1.5, w: w - 3, h: h - 3, fill: mix('FFFFFF', color, f), r: 4 });
  s.text(text, { x, y: y + (h - size * 1.2) / 2, w, size, bold, color: f > 0.62 ? C.white : C.navy, align: 'center' });
}

// Бренды графиков слайдов 3–4: свой — синий, главный digital-конкурент Лактазар (крупнейший бюджет) — малиновый,
// лидер продаж Эспумизан и Baby Calm — приглушённые
const BRANDS = [
  { key: 'bobotik', name: 'Боботик', site: 'bobotik.ru', color: C.blue, ink: C.white,
    sales: 'Боботик, млн ₽', share: 'Боботик, доля продаж, %' },
  { key: 'laktazar', name: 'Лактазар', site: 'laktazar.ru', color: C.crimson, ink: C.white,
    sales: 'Лактазар, млн ₽', share: 'Лактазар, доля продаж, %' },
  { key: 'espumisan', name: 'Эспумизан', site: 'espumisan.ru', color: MUTED, ink: C.navy,
    sales: 'Эспумизан, млн ₽', share: 'Эспумизан, доля продаж, %' },
  { key: 'baby', name: 'Baby Calm', site: 'baby-calm.ru', color: MUTED2, ink: C.navy,
    sales: 'Baby Calm, млн ₽', share: 'Baby Calm, доля продаж, %' },
];

// Правая колонка слайдов 3–4: Digital budgets (как в исходнике: 0,4M / 1,9M / 2,3M / 0,09M; это суммы января–июля 2026 —
// сверено с помесячными данными графика слайда 3)
const RIGHT_X = 58 + 1300 + 20;
const RIGHT_W = 1862 - RIGHT_X;
function budgetsCard(s, { star = false } = {}) {
  const X = RIGHT_X;
  const Wc = RIGHT_W;
  const rows = [
    { b: BRANDS[1], value: 2.3, text: '2,3 млн ₽' },
    { b: BRANDS[0], value: 1.9, text: '1,9 млн ₽', bold: true },
    { b: BRANDS[2], value: 0.4, text: '0,4 млн ₽', star },
    { b: BRANDS[3], value: 0.09, text: '0,09 млн ₽' },
  ];
  const hA = 250;
  s.card({ x: X, y: TOP, w: Wc, h: hA });
  s.label('Digital budgets', { x: X + 30, y: TOP + 28, w: Wc - 60, color: C.blue });
  const nameW = 132;
  const valW = 116;
  const bx = X + 30 + nameW;
  const bw = Wc - 60 - nameW - valW;
  rows.forEach((r, k) => {
    const y = TOP + 70 + k * 38;
    s.text(r.star ? r.b.name + '*' : r.b.name, { x: X + 30, y: y + 3, w: nameW - 8, size: 17, bold: !!r.bold, color: C.navy });
    const w = Math.max(4, bw * r.value / 2.3);
    s.box({ x: bx, y: y + 2, w, h: 26, fill: r.b.color, r: 4 });
    s.text(r.text, { x: bx + w + 10, y: y + 2, w: valW + bw - w, size: 18, bold: true, color: C.navy });
  });
  s.text('Estimated by DigitalBudget', { x: X + 30, y: TOP + hA - 36, w: Wc - 60, size: 14, color: C.blueText });
  return TOP + hA;
}
// Карточка «Key takeaways» с номерами; пункт — строка или массив абзацев; кегль подбирается по высоте
function takeaways(s, items, { x, y, w, h, label = 'Key takeaways', max = 18, min = 15, gap = 18, pgap = 8 }) {
  s.card({ x, y, w, h });
  s.label(label, { x: x + 30, y: y + 28, w: w - 60, color: C.crimson });
  const TX = x + 30 + 34;
  const TW = w - 60 - 34;
  const avail = h - 66 - 26;
  const paras = items.map((it) => (Array.isArray(it) ? it : [it]));
  const hOf = (t, z) => textLines(t, z, TW) * z * 1.22;
  const need = (z) => paras.reduce((a, ps) => a + ps.reduce((b, t) => b + hOf(t, z), 0) + (ps.length - 1) * pgap, 0) + (paras.length - 1) * gap;
  let sz = max;
  while (sz > min && need(sz) > avail) sz -= 1;
  if (paras.length > 1) gap += Math.max(0, Math.min(16, (avail - need(sz)) / (paras.length - 1)));
  let ty = y + 66;
  paras.forEach((ps, k) => {
    s.badge({ x: x + 30, y: ty, d: 22, n: k + 1, color: C.crimson, size: 13 });
    ps.forEach((t, j) => {
      s.text(t, { x: TX, y: ty - 1, w: TW, size: sz, lh: 1.22, color: C.navy });
      ty += Math.ceil(hOf(t, sz)) + (j < ps.length - 1 ? pgap : 0);
    });
    ty += gap;
  });
  if (ty - gap > y + h - 16) s.warn('takeaways', paras[0][0], `текст выходит за карточку: ${Math.round(ty - gap)} > ${y + h - 16}`);
}

module.exports = {
  // ===================== 1. Обложка =====================
  1: (d) => {
    const s = d.cover({ title: 'Bobotic' });
    s.text('Strategic approach 2027 by OMD', { x: 296, y: 716, w: 1328, size: 44, lh: 1.1, color: C.white, align: 'center' });
  },

  // ===================== 2. Цели и задачи 2027 =====================
  // В исходнике — картинка во весь слайд (три синие полосы с красными номерами и 3D-иконками), текст только в картинке;
  // перенесён живым (сверен по увеличенным фрагментам), иллюстрации — иконками Tabler
  2: (d) => {
    const s = d.slide({ title: 'Цели и задачи для Боботик в 2027 году' });
    const goals = [
      { icon: 'tb:TbTarget',
        t: 'Достичь продаж [[**705 тысяч упаковок**]] и [[**296 млн рублей**]] в 2027 году' },
      { icon: 'tb:TbBabyCarriage',
        t: 'Стать **первым выбором у новых мам**, когда у ребенка появились колики' },
      // «бренд метрики» в исходнике — без дефиса; «бренд-метрики» — как в серии (Clindovit)
      { icon: 'tb:TbChartArrowsVertical',
        t: 'Растить **бренд-метрики** (знание, рассмотрение и т.д.) и убедить маму, что Боботик является **лучшим выбором от колик**, ведь он надежный, эффективный, качественный и удобный в применении, созданный специально для малышей' },
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

  // ===================== 3. Competitive Landscape / 2026 =====================
  3: (d) => {
    // подзаголовок исходника — две фразы, в 2 строки шапки не помещается; вторая фраза (план на H2) — в плашку-вывод
    const s = d.slide({
      title: 'Боботик / Competitive Landscape / 2026',
      // перенос вручную: иначе строка рвётся по дефису «бизнес-/динамику»
      subtitle: 'Ограниченная digital-поддержка H1 позволила Боботику\nсохранить стабильную бизнес-динамику',
    });
    const all = charts(3);
    const salesC = all.find((c) => c.type === 'COLUMN_CLUSTERED');
    const budP = all.find((c) => c.type === 'LINE_MARKERS').plots[0];
    const barP = salesC.plots.find((p) => p.type === 'BarPlot').series;
    const lineP = salesC.plots.find((p) => p.type === 'LinePlot').series;
    const BR = BRANDS;
    const sales = BR.map((b) => pick(barP, b.key));                        // продажи, млн ₽: янв 2025 – июн 2026
    const share = BR.map((b) => pick(lineP, b.key).map((v) => v * 100));   // доля продаж, %
    const budget = BR.map((b) => pick(budP.series, b.key));                // digital-бюджет, млн ₽: янв 2025 – июл 2026
    const cats = monthCats(budP.cats);
    const N = cats.length;                 // 19
    const NS = sales[0].length;            // 18
    const labelsS = monthCats(salesC.plots[0].cats).map((c) => `${MONTHS[c.m]} ${c.y}`);

    // ---- левая карточка: продажи, доля продаж, digital-бюджет на общей оси месяцев ----
    const LW = 1300;
    const CA = { x: 58, y: TOP, w: LW, h: BOT_P - TOP };
    s.card(CA);
    const LBL = 'Динамика инвестиций в digital-медиа и продаж';
    s.label(LBL, { x: 94, y: 249, w: lw(LBL), color: C.blue });
    const X0 = 236;
    const X1 = CA.x + CA.w - 28;
    legendRow(s, BR.map((b) => [b.color, b.name]), { x1: X1, y: 249, size: 17, gap: 24 });
    const step = (X1 - X0) / N;
    const m = chartMap('col', N, { x: X0, w: step * N, y: 0, h: 1 }, 0, 1);
    const NAME_X = 94;
    const xYear = m.cat(12) - step / 2;

    // ряд 1: продажи, млн ₽ — накопленные столбцы; Боботик, Лактазар, Эспумизан подписаны в сегментах, Baby Calm — строкой
    s.text('Продажи, млн ₽', { x: NAME_X, y: 290, w: X0 - NAME_X, size: 17, bold: true, color: C.navy });
    const P2 = { x: X0, w: step * NS, y: 322, h: 222 };
    const tot = sales[0].map((_, i) => sales.reduce((a, sr) => a + sr[i], 0));
    const SMAX = Math.ceil(Math.max(...tot) / 5) * 5;
    const GAP = 26;
    const m2 = s.chart('col', BR.map((b, k) => ({ name: b.sales, labels: labelsS, values: sales[k].map((v) => +v.toFixed(2)) })),
      { x: P2.x - 10, y: P2.y - 10, w: P2.w + 20, h: P2.h + 20, plot: P2, min: 0, max: SMAX, stacked: true, gap: GAP,
        colors: BR.map((b) => b.color), legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
    const barW = step / (1 + GAP / 100);
    for (let i = 0; i < NS; i++) {
      let cum = 0;
      [0, 1, 2].forEach((k) => {
        const v = sales[k][i];
        const yc = m2.val(cum + v / 2);
        cum += v;
        s.text(f1(v), { x: m2.cat(i) - barW / 2 - 4, y: yc - 9, w: barW + 8, size: 14, bold: k === 0, color: BR[k].ink, align: 'center' });
      });
    }
    s.seg(P2.x, P2.y + P2.h, X1, P2.y + P2.h, { color: C.line, width: 1.5 });
    let y = P2.y + P2.h + 7;
    rowName(s, BR[3], NAME_X, y, X0 - NAME_X - 4, { size: 14 });
    sales[3].forEach((v, i) => s.text(f1(v), { x: m.cat(i) - step / 2, y: y + 1, w: step, size: 14, color: C.blueText, align: 'center' }));

    // ряд 2: доля продаж, % — строки чисел (вторая ось исходника)
    const yT2 = y + 36;
    const t2 = 'Доля продаж, %';
    s.text(t2, { x: NAME_X, y: yT2, w: 300, size: 17, bold: true, color: C.navy });
    s.badge({ x: NAME_X + tw(t2, 17, true) + 12, y: yT2, d: 22, n: 1, color: C.crimson, size: 13 });
    const RS = 21;
    const ySH = yT2 + 27;
    s.box({ x: X0, y: ySH, w: step * NS, h: RS, fill: C.cardTint, r: 4 });
    share.forEach((vals, k) => {
      const yy = ySH + k * RS;
      rowName(s, BR[k], NAME_X, yy + 1, X0 - NAME_X - 4, { bold: k === 0, size: 14 });
      vals.forEach((v, i) => s.text(f1(v), { x: m.cat(i) - step / 2, y: yy + 2, w: step, size: 14, bold: k === 0,
        color: k === 0 ? C.navy : C.blueText, align: 'center' }));
    });

    // ряд 3: digital-бюджет, млн ₽ — тепловая полоса
    const yT3 = ySH + 4 * RS + 16;
    const t3 = 'Digital-бюджет, млн ₽';
    s.text(t3, { x: NAME_X, y: yT3, w: 400, size: 17, bold: true, color: C.navy });
    const bx3 = NAME_X + tw(t3, 17, true) + 12;
    s.badge({ x: bx3, y: yT3, d: 22, n: 2, color: C.crimson, size: 13 });
    s.text('Estimated by DigitalBudget', { x: bx3 + 34, y: yT3 + 2, w: 400, size: 15, color: C.blueText });
    const RH = 25;
    const yBU = yT3 + 28;
    budget.forEach((vals, k) => {
      const yy = yBU + k * RH;
      rowName(s, BR[k], NAME_X, yy + 4, X0 - NAME_X - 4, { bold: k === 0, size: 14 });
      vals.forEach((v, i) => heatCell(s, { x: m.cat(i) - step / 2, y: yy, w: step, h: RH, v, vmax: 0.6, color: BR[k].color, text: f2(v), bold: k === 0 }));
    });
    const yEnd = yBU + 4 * RH;
    s.seg(xYear, P2.y - 4, xYear, yEnd + 4, { color: C.line, width: 1.5, dash: 'dash' });
    monthAxis(s, m, step, cats, yEnd + 8);
    if (yEnd + 8 + 14 + 7 + 20 > BOT_P - 10) s.warn('график', LBL, `ось месяцев выходит за карточку: ${Math.round(yEnd + 49)}`);

    // ---- правая колонка ----
    const yB = budgetsCard(s, { star: true }) + 18;
    takeaways(s, [
      'Боботик **сохраняет позиции при минимальной поддержке**. При digital-инвестициях ниже ключевых конкурентов бренд удерживает **стабильную долю продаж 12–14%**, подтверждая устойчивость текущего спроса и возможность\u00a0масштабирования',
      'Активность конкурентов усиливается в периоды **сезонного роста категории (весна–лето)**, при этом наиболее заметные инвестиционные пики сопровождаются **увеличением доли голоса**',
    ], { x: RIGHT_X, y: yB, w: RIGHT_W, h: BOT_P - yB, max: 18, min: 15 });

    s.principle({ label: 'Вывод', icon: 'tb:TbTrendingUp',
      text: 'В H2 масштабный сезонный флайт с применением comprehensive-подхода позволит оценить потенциал дополнительного роста продаж' });
    s.footnote('Источник: DigitalBudget, IQVIA. Digital budgets — сумма за январь–июль 2026 (расчёт OMD по помесячным данным)', { y: 1028, w: 1730 });
    s.footnote('*Небольшие бюджеты Эспумизан по данным мониторинга связаны с низкой посещаемостью сайта (38 визитов за период с января по июнь 2026 г.) по данным Similarweb', { y: 1048, w: 1730 });
  },

  // ===================== 4. Competitive Landscape / 2026 — доля инвестиций по каналам (скрытый) =====================
  4: (d) => {
    // подзаголовок исходника не помещается в 2 строки: последняя часть («доля Online Video требует методологической оговорки») —
    // подписью у графика рядом с легендой Online Video*, к которой относится сноска
    const s = d.slide({
      title: 'Боботик / Competitive Landscape / 2026',
      subtitle: 'По данным мониторинга, конкуренты преимущественно используют охватные форматы, тогда как подтверждённая поддержка Боботика сочетала Paid Search, баннерные и social-размещения',
    });
    s.s.hidden = true;
    const splitP = charts(4).find((c) => c.type === 'BAR_STACKED_100').plots[0];
    const BR = BRANDS;

    // ---- левая карточка: доля инвестиций по каналам ----
    const LW = 1300;
    const CA = { x: 58, y: TOP, w: LW, h: BOT - TOP };
    s.card(CA);
    const NAME_X = 94;
    const LBL = 'Доля инвестиций по каналам';
    s.label(LBL, { x: NAME_X, y: 249, w: lw(LBL), color: C.blue });
    const CH = [
      { name: 'Online Video*', key: 'online video', color: C.navy, ink: C.white },
      { name: 'Paid Search', key: 'paid search', color: C.cyan, ink: C.navy },
      { name: 'Banners', key: 'banners', color: C.orange, ink: C.white },
      { name: 'Paid Social', key: 'paid social', color: C.green, ink: C.white },
      { name: 'e-mail Marketing (CRM)', key: 'e-mail', color: C.purple, ink: C.white },
      // «Affilate» в исходнике — опечатка
      { name: 'Affiliate / CPA', key: 'affil', color: 'C9D6E6', ink: C.navy },
    ];
    const X0 = 300;
    const X1 = CA.x + CA.w - 36;
    legendRow(s, CH.map((c) => [c.color, c.name]), { x: X0, y: 296, size: 16, gap: 24, mark: 'sq' });
    const idx = BR.map((b) => splitP.cats.findIndex((c) => c.toLowerCase() === b.site));
    const val = (ch, k) => splitP.series.find((sr) => sr.name.toLowerCase().includes(ch.key)).values[idx[k]] || 0;
    const PITCH = 138;
    const PB = { x: X0, y: 352, w: X1 - X0, h: 4 * PITCH };
    const mb = s.chart('bar', CH.map((ch) => ({ name: ch.name, labels: BR.map((b) => b.site), values: BR.map((_, k) => +val(ch, k).toFixed(4)) })),
      { x: PB.x - 10, y: PB.y - 6, w: PB.w + 20, h: PB.h + 12, plot: PB, min: 0, max: 1, percent: true, gap: 90,
        colors: CH.map((c) => c.color), legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
    const mark = { 0: 2, 1: 1, 2: 1, 3: 1 };     // строка бренда → номер вывода
    BR.forEach((b, k) => {
      const yc = mb.cat(k);
      s.badge({ x: NAME_X - 4, y: yc - 11, d: 22, n: mark[k], color: C.crimson, size: 13 });
      s.text(b.name, { x: NAME_X + 30, y: yc - 23, w: X0 - NAME_X - 40, size: 19, bold: true, color: k === 0 ? C.blue : C.navy });
      s.text(b.site, { x: NAME_X + 30, y: yc + 2, w: X0 - NAME_X - 40, size: 15, color: C.blueText });
      const totV = CH.reduce((a, ch) => a + val(ch, k), 0) || 1;
      let cum = 0;
      CH.forEach((ch) => {
        const v = val(ch, k) / totV;
        const xc = PB.x + PB.w * (cum + v / 2);
        cum += v;
        if (v >= 0.025) s.text(`${Math.round(val(ch, k) * 100)}%`, { x: xc - 30, y: yc - 10, w: 60, size: 16, bold: true, color: ch.ink, align: 'center' });
      });
    });
    const yN = PB.y + PB.h + 18;
    const hN = s.text('Доля Online Video требует методологической оговорки*', { x: X0, y: yN, w: X1 - X0, size: 18, bold: true, color: C.crimson });
    s.text('Estimated by DigitalBudget. Not all channels are covered by the monitoring', { x: X0, y: yN + hN + 8, w: X1 - X0, size: 15, color: C.blueText });

    // ---- правая колонка ----
    const yB = budgetsCard(s) + 18;
    takeaways(s, [
      'По оценке DigitalBudget, основная часть активности Эспумизана, Лактазара и Baby Calm классифицируется как **Online Video —\u00a092%, 97% и\u00a094%**. Стоит учитывать, что данные мониторинга являются оценочными и зависят от классификации источников трафика',
      [
        '**48% активности Боботика** отнесено мониторингом к Online Video, хотя фактических видеозапусков в H1 не было. Подтверждённый медиамикс бренда включал **Paid\u00a0Search —\u00a043%**, баннерные форматы —\u00a05% и Paid\u00a0Social —\u00a03%',
        'H1 корректнее характеризовать как сочетание **захвата сформированного спроса** с точечной медийной и social-поддержкой',
      ],
    ], { x: RIGHT_X, y: yB, w: RIGHT_W, h: BOT - yB, max: 17, min: 15, gap: 16 });

    s.footnote('Источник: DigitalBudget, IQVIA. Digital budgets — сумма за январь–июль 2026 (расчёт OMD по помесячным данным)', { y: 1028, w: 1730 });
    s.footnote('*Online Video в DigitalBudget может включать реферальный трафик с ресурсов, классифицированных Similarweb как видеоплощадки или видеохостинги. Данные не подтверждают фактическое размещение видеорекламы Боботика', { y: 1048, w: 1730 });
  },

  // ===================== 5. Competitive Analysis / Digital Creatives =====================
  5: (d) => {
    // описание под заголовком исходника (4 фразы, не помещается в шапку) разнесено по блокам — каждая фраза у своего бренда
    const s = d.slide({ title: 'Competitive Analysis / Digital Creatives' });
    const img = (file, x, y, w, h, alt) => s.image(file, { x, y, w, h, alt });
    const M = (f) => path.join(MEDIA, f);
    const PAD = 28;
    const G = 14;
    const H = BOT - TOP;
    const DS = 17;          // кегль описаний
    // шапка блока: иконка в кружке + бренд + площадка (в строку, если помещается); возвращает высоту
    const head = (icon, name, channel, x, y, w, measure = false) => {
      const nW = tw(name, 21, true);
      const inline = 38 + nW + 12 + tw(channel, 17, false) <= w;
      if (!measure) {
        s.icon(icon, { x, y: y - 1, size: 28, color: C.white, circle: C.crimson });
        s.text(name, { x: x + 38, y, w: Math.min(w - 38, nW + 8), size: 21, bold: true, color: C.navy });
        if (inline) s.text(channel, { x: x + 38 + nW + 12, y: y + 3, w: w - 38 - nW - 12, size: 17, color: C.blueText });
        else s.text(channel, { x: x + 38, y: y + 30, w: w - 38, size: 17, color: C.blueText });
      }
      return inline ? 30 : 30 + 22;
    };
    const descH = (t, w) => Math.ceil(countLines(typo(tr(t)), DS, w, false) * DS * 1.2);
    const R = { simBan: 1565 / 200, simBig: 1080 / 450, lak1: 470 / 303, lak2: 625 / 305, esp: 1, simk: 1920 / 1096 };
    const T = {
      // перенос вручную: иначе «e-/pharm» рвётся по дефису
      sim: 'Симеотик размещался\nв e-pharm и совместной кампании с Экофурил с продвижением взрослого формата капсул.',
      esp: 'В e-pharm замечен Эспумизан Бэби (Еаптека).',
      lak: 'Лактазар активно использует контекстное продвижение Яндекса.',
      simk: 'Симетикотик продвигается в формате нативных статей в Промостраницах.',
    };

    // ---- колонка 3: Эспумизан Бэби — два квадратных креатива друг под другом ----
    let W3 = 350;
    let sq = 0;
    for (let it = 0; it < 6; it++) {
      const iw = W3 - 2 * PAD;
      const over = PAD + head('tb:TbShoppingCart', 'Эспумизан Бэби', 'e-pharm', 0, 0, iw, true) + 8 + descH(T.esp, iw) + 16 + PAD;
      sq = (H - over - G) / 2;
      W3 = sq + 2 * PAD;
    }
    // ---- колонка 2: Лактазар — два поисковых объявления друг под другом ----
    let W2 = 600;
    let w2 = 0;
    for (let it = 0; it < 6; it++) {
      const iw = W2 - 2 * PAD;
      const over = PAD + head('tb:TbSearch', 'Лактазар', 'поиск', 0, 0, iw, true) + 8 + descH(T.lak, iw) + 16 + PAD;
      w2 = (H - over - G) / (1 / R.lak1 + 1 / R.lak2);
      W2 = w2 + 2 * PAD;
    }
    const W1 = 1804 - W2 - W3 - 40;
    const X1c = 58;
    const X2c = X1c + W1 + 20;
    const X3c = X2c + W2 + 20;

    // Эспумизан Бэби
    {
      const x = X3c + PAD;
      const iw = W3 - 2 * PAD;
      s.card({ x: X3c, y: TOP, w: W3, h: H });
      let y = TOP + PAD;
      y += head('tb:TbShoppingCart', 'Эспумизан Бэби', 'e-pharm', x, y, iw) + 8;
      y += s.text(T.esp, { x, y, w: iw, size: DS, lh: 1.2, color: C.blueText }) + 16;
      img(M('img_2565d6c048.jpg'), x, y, sq, sq, 'Эспумизан Бэби — креатив в e-pharm');
      img(M('img_2c3eda6228.jpg'), x, y + sq + G, sq, sq, 'Эспумизан Бэби — креатив в e-pharm');
    }
    // Лактазар
    {
      const x = X2c + PAD;
      const iw = W2 - 2 * PAD;
      s.card({ x: X2c, y: TOP, w: W2, h: H });
      let y = TOP + PAD;
      y += head('tb:TbSearch', 'Лактазар', 'поиск', x, y, iw) + 8;
      y += s.text(T.lak, { x, y, w: iw, size: DS, lh: 1.2, color: C.blueText }) + 16;
      img(M('img_60f9b51776.png'), x, y, w2, w2 / R.lak1, 'Лактазар — поисковое объявление');
      y += w2 / R.lak1 + G;
      img(M('img_83d09dfc9d.png'), x, y, w2, w2 / R.lak2, 'Лактазар — поисковое объявление');
    }
    // колонка 1: Симеотик (сверху) и Симетикотик (снизу); описание — справа от креатива
    {
      const x = X1c + PAD;
      const iw = W1 - 2 * PAD;
      const TXW = 250;                         // колонка описания
      const banH = iw / R.simBan;
      // Симеотик: баннер во всю ширину, под ним — креатив + описание
      const bigW = iw - TXW - 24;
      const bigH = bigW / R.simBig;
      const hSim = PAD + 30 + 14 + banH + G + bigH + PAD;
      s.card({ x: X1c, y: TOP, w: W1, h: hSim });
      let y = TOP + PAD;
      y += head('tb:TbShoppingCart', 'Симеотик', 'e-pharm', x, y, iw) + 14;
      img(M('img_906d0f042d.png'), x, y, iw, banH, 'Симеотик — баннер в e-pharm');
      y += banH + G;
      img(M('img_ee6a024c86.jpg'), x, y, bigW, bigH, 'Симеотик и Экофурил — совместный креатив');
      const hd = s.text(T.sim, { x: x + bigW + 24, y, w: TXW, size: DS, lh: 1.2, color: C.blueText });
      if (hd > bigH + 4) s.warn('Симеотик', T.sim, `описание выше креатива: ${hd} > ${Math.round(bigH)}`);
      // Симетикотик: скриншот промостраницы + описание
      const yS = TOP + hSim + 20;
      const hSk = BOT - yS;
      s.card({ x: X1c, y: yS, w: W1, h: hSk });
      y = yS + PAD;
      y += head('tb:TbNews', 'Симетикотик', 'промостраницы', x, y, iw) + 14;
      const skH = BOT - PAD - y;
      const skW = Math.min(skH * R.simk, iw - TXW - 24);
      img(M('img_13cbdc79df.png'), x, y, skW, skW / R.simk, 'Симетикотик — нативная статья в Промостраницах');
      s.text(T.simk, { x: x + skW + 24, y, w: iw - skW - 24, size: DS, lh: 1.2, color: C.blueText });
    }
  },

  // ===================== 6. Лактазар в коммуникации пытается выйти за рамки показаний (скрытый) =====================
  6: (d) => {
    const s = d.slide({ title: 'Лактазар в коммуникации пытается выйти за рамки показаний' });
    s.s.hidden = true;
    const PAD = 28;
    const G = 16;
    const H = BOT - TOP;

    // ---- правая карточка: UGC — два вертикальных видео 9:16 и комментарий ----
    const WR = 690;
    const XR = 1862 - WR;
    s.card({ x: XR, y: TOP, w: WR, h: H });
    s.label('UGC-контент', { x: XR + PAD, y: TOP + 26, w: WR - 2 * PAD, color: C.blue });
    const ugc = 'Также при поиске бренда заметно количество UGC-контента. В нем также нет основного мотива про лактазу, фокус идет на колики, спокойный сон, демонстрацию использования.';
    const ugcW = WR - 2 * PAD;
    const ugcH = Math.ceil(countLines(typo(tr(ugc)), 18, ugcW, false) * 18 * 1.25);
    const vy = TOP + 68;
    const vhMax = BOT - PAD - ugcH - 22 - vy;
    const vw = Math.min((ugcW - G) / 2, vhMax * 9 / 16);
    const vh = vw * 16 / 9;
    const vx = XR + PAD + (ugcW - (2 * vw + G)) / 2;
    B.video(s, { media: 'media1.mp4', cover: 'image43.png', x: vx, y: vy, w: vw, h: vh, name: 'Лактазар — UGC-видео 1' });
    B.video(s, { media: 'media2.mp4', cover: 'image44.png', x: vx + vw + G, y: vy, w: vw, h: vh, name: 'Лактазар — UGC-видео 2' });
    s.text(ugc, { x: XR + PAD, y: vy + vh + 22, w: ugcW, size: 18, lh: 1.25, color: C.navy });

    // ---- левая карточка: креативы бренда, номера-метки связывают формулировки с местом на креативе ----
    const WL = XR - 20 - 58;
    s.card({ x: 58, y: TOP, w: WL, h: H });
    s.label('Креативы бренда', { x: 58 + PAD, y: TOP + 26, w: WL - 2 * PAD, color: C.blue });
    const x0 = 58 + PAD;
    const iw = WL - 2 * PAD;
    const y0 = TOP + 68;
    // баннер «Лактазар + Аципол» во всю ширину
    const RB = 2316 / 798;
    const RA = 1000 / 792;       // креатив с причиной колик (обрезан снизу, как в исходнике)
    const RC = 1110 / 1038;      // карточка «Лактаза для усвоения лактозы» (обрезана снизу, как в исходнике)
    const TXW = 300;
    // высота нижнего ряда: остаток карточки под баннером; ширина баннера — так, чтобы ряд с текстом поместился
    let banW = iw;
    let rowH = 0;
    for (let it = 0; it < 6; it++) {
      rowH = BOT - PAD - (y0 + banW / RB + G);
      const need = rowH * (RA + RC) + G + 24 + TXW;
      if (need > iw) rowH = (iw - G - 24 - TXW) / (RA + RC);
      banW = Math.min(iw, (BOT - PAD - y0 - G - rowH) * RB);
    }
    const banH = banW / RB;
    s.image(path.join(MEDIA, 'img_64c4f5350b.png'), { x: x0, y: y0, w: banW, h: banH, alt: 'Лактазар и Аципол Малыш — баннер' });
    const yR = y0 + banH + G;
    const wA = rowH * RA;
    const wC = rowH * RC;
    s.image(path.join(CROPS, 'a_laktazar_ad.png'), { x: x0, y: yR, w: wA, h: rowH, alt: 'Лактазар — креатив «Воздействует на причину колик»' });
    s.image(path.join(CROPS, 'a_laktazar_card.png'), { x: x0 + wA + G, y: yR, w: wC, h: rowH, alt: 'Лактазар — карточка бренда' });
    // метки на креативах: 1 — «наиболее частые причины колик» в баннере, 2 — выделенное цветом «Воздействует на причину колик»
    const D = 32;
    s.badge({ x: x0 + banW * (1690 / 2316) - D / 2, y: y0 + banH * (278 / 798) - D / 2, d: D, n: 1, color: C.crimson, size: 18 });
    s.badge({ x: x0 + wA * (44 / 1000) - D / 2, y: yR + rowH * (338 / 792) - D / 2, d: D, n: 2, color: C.crimson, size: 18 });
    // комментарий — справа от нижнего ряда
    const tx = x0 + wA + G + wC + 24;
    const tW = x0 + iw - tx;
    let ty = yR;
    ty += s.text('Лактазар в своей коммуникации пытается выходить за рамки недостатка лактазы через обтекаемые формулировки.', { x: tx, y: ty, w: tW, size: 18, lh: 1.25, color: C.navy }) + 20;
    s.badge({ x: tx, y: ty, d: 26, n: 1, color: C.crimson, size: 15 });
    ty += s.text('**«Наиболее частые причины колик»**', { x: tx + 36, y: ty + 1, w: tW - 36, size: 18, lh: 1.25, color: C.navy }) + 20;
    ty += s.text('Подчеркивает цветом', { x: tx, y: ty, w: tW, size: 18, lh: 1.25, color: C.navy }) + 8;
    s.badge({ x: tx, y: ty, d: 26, n: 2, color: C.crimson, size: 15 });
    ty += s.text('**«Воздействует на причину колик»**', { x: tx + 36, y: ty + 1, w: tW - 36, size: 18, lh: 1.25, color: C.navy });
    if (ty > BOT - PAD) s.warn('комментарий', 'Лактазар в своей коммуникации', `текст выходит за карточку: ${Math.round(ty)}`);
  },
};
