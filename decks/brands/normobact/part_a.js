// Нормобакт L · стратегия 2027 — часть A: слайды исходника 1–5
// (обложка, цели и задачи 2027, Offline Competitive Landscape ×2, Digital Competitive Landscape)
const path = require('path');
const { C, ACCENTS, chartMap, textWidth, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT, yearAxis, gridY
const N = require('./common');                            // SRC, MEDIA, CROPS, fromSource, video
const SRC = N.SRC;

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
const hex = (n) => Math.round(n).toString(16).padStart(2, '0');
// смешение цветов: t = 0 → a, t = 1 → b
const mix = (a, b, t) => [0, 2, 4].map((k) => hex(parseInt(a.substr(k, 2), 16) * (1 - t) + parseInt(b.substr(k, 2), 16) * t)).join('').toUpperCase();
const BAND = mix('FFFFFF', C.crimson, 0.08);   // подсветка периода флайта
const PINK = mix('FFFFFF', C.crimson, 0.5);    // второй главный конкурент
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
// Excel-дата (44927) → { m: 0…11, y: 2023 }
const xl = (n) => { const dt = new Date(Date.UTC(1899, 11, 30) + Number(n) * 86400000); return { m: dt.getUTCMonth(), y: dt.getUTCFullYear() }; };
// ширина строки по переведённому тексту (для раскладки в строку)
const tw = (t, size, bold) => textWidth(typo(tr(t)).replace(/\*\*|\[\[|\]\]/g, ''), size, bold);
// ширина КАПС-метки (s.label) по переведённому тексту
const lw = (t, size = 22) => Math.ceil(textWidth(typo(tr(t)).toUpperCase(), size, true)) + 6;
const pick = (series, key) => series.find((sr) => sr.name.trim().toLowerCase().startsWith(key)).values;

// Число строк с учётом жирных фрагментов (**…**) и переносов по дефису (PowerPoint и LibreOffice рвут «digital-поддержку»)
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
// Легенда в строку: items = [[цвет, текст], ...]; x1 — выровнять по правому краю, иначе от x. mark: 'dot' | 'sq' | 'line'
function legendRow(s, items, { x, x1, y, size = 16, gap = 22, mark = 'dot' }) {
  const mw = mark === 'line' ? 22 : 14;
  const ws = items.map(([, t]) => tw(t, size, false));
  const total = ws.reduce((a, w) => a + mw + 8 + w + gap, 0) - gap;
  let lx = x1 !== undefined ? x1 - total : x;
  items.forEach(([color, t], k) => {
    const my = y + (size * 1.2 - 14) / 2;
    if (mark === 'dot') s.circle({ x: lx, y: my, d: 14, fill: color });
    else if (mark === 'line') s.box({ x: lx, y: my + 5, w: mw, h: 4, fill: color, r: 0 });
    else s.box({ x: lx, y: my, w: 14, h: 14, fill: color, r: 3 });
    s.text(t, { x: lx + mw + 8, y, w: ws[k] + 8, size, color: C.navy });
    lx += mw + 8 + ws[k] + gap;
  });
  return total;
}
// Подпись строки данных: кружок цвета бренда + имя
function rowName(s, b, x, y, w, { bold = false, size = 15 } = {}) {
  s.circle({ x, y: y + (size * 1.2 - 12) / 2, d: 12, fill: b.color });
  s.text(b.name, { x: x + 20, y, w: w - 20, size, bold, color: C.navy });
}
// Ось месяцев + годы под общей шкалой m (chartMap); only — показать только эти месяцы (0…11)
function monthAxis(s, m, step, cats, y, { size = 14, ysize = 16, only, labelW } = {}) {
  cats.forEach((c, i) => {
    if (only && !only.includes(c.m)) return;
    const w = labelW ?? step;
    s.text(MONTHS[c.m], { x: m.cat(i) - w / 2, y, w, size, color: C.blueText, align: 'center' });
  });
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
// Тепловая ячейка: заливка по интенсивности, цифра поверх; hot — обводка (место из Key takeaways)
function heatCell(s, { x, y, w, h, v, vmax, color, text, bold, hot, hotColor = C.navy, size = 14 }) {
  const f = Math.min(1, v / vmax) ** 0.8 * 0.92;
  s.box({ x: x + 1.5, y: y + 1.5, w: w - 3, h: h - 3, fill: mix('FFFFFF', color, f), r: 4, stroke: hot ? hotColor : undefined, sw: 2.5 });
  const fill = mix('FFFFFF', color, f);
  const lum = [0, 2, 4].map((k) => parseInt(fill.substr(k, 2), 16) / 255).reduce((a, c, k) => a + c * [0.299, 0.587, 0.114][k], 0);
  s.text(text, { x, y: y + (h - size * 1.2) / 2, w, size, bold: bold || hot, color: lum < 0.6 ? C.white : C.navy, align: 'center' });
}

// ---------- бренды офлайн-слайдов 3–4 (Mediascope / IQVIA) ----------
// Нормобакта в офлайн-мониторинге нет. Лидеры по бюджету 2026 — Энтерол (малиновый) и Линекс (светло-малиновый),
// остальные — приглушённые оттенки
const OFF = {
  ent: { key: 'энтерол', name: 'Энтерол', color: C.crimson },
  lin: { key: 'линекс', name: 'Линекс', color: PINK },
  aci: { key: 'аципол', name: 'Аципол', color: '5A7BA6' },
  mxb: { key: 'максилак бэби', name: 'Максилак Бэби', color: '64BEE8' },
  mx: { key: 'максилак', name: 'Максилак', color: 'A6DAF2' },
  bac: { key: 'бак-сет', name: 'Бак-Сет', color: '93AACB' },
  bif: { key: 'бифиформ', name: 'Бифиформ', color: 'C3CEDD' },
  syn: { key: 'синбиотик', name: 'Синбиотик', color: 'B7AEDB' },
};
// серия по точному имени бренда («максилак» не должен совпасть с «максилак бэби»)
const brandSeries = (series, b) => series.find((sr) => sr.name.trim().toLowerCase() === b.key).values;

// Карточка «2026 budget» (как в исходнике: 180M / 65M / 21M / 15M; это суммы января–августа 2026 —
// сверено с помесячными данными графика инвестиций слайда 3 и итогами слайда 4)
function offlineBudget(s) {
  const hA = 232;
  s.card({ x: RX, y: TOP, w: RW, h: hA });
  s.label('2026 budget', { x: RX + 30, y: TOP + 28, w: RW - 60, color: C.blue });
  budgetBars(s, [
    { name: 'Энтерол', value: 180, text: '180 млн ₽', color: OFF.ent.color, bold: true },
    { name: 'Линекс', value: 65, text: '65 млн ₽', color: OFF.lin.color, bold: true },
    { name: 'Бак-Сет', value: 21, text: '21 млн ₽', color: OFF.bac.color },
    { name: 'Бифиформ', value: 15, text: '15 млн ₽', color: OFF.bif.color },
  ], { x: RX + 30, y: TOP + 70, w: RW - 60, nameW: 112, valW: 112, pitch: 38 });
  return TOP + hA;
}

// ---------- бренды digital-слайда 5 (DigitalBudget / IQVIA) ----------
const DIG = [
  { key: 'normobact', name: 'Нормобакт', site: 'normobact.ru', color: C.blue, ink: C.white },
  { key: 'enterol', name: 'Энтерол', site: 'enterol.ru', color: C.crimson, ink: C.white },
  // Бак-Сет — тем же серо-синим, что на слайдах 3–4 (розовый там — Линекс); Бифидумбактерина на 3–4 нет — свой нейтральный серый
  { key: 'bac-set', name: 'Бак-Сет', site: 'bac-set.ru', color: OFF.bac.color, ink: C.navy },
  { key: 'bifidumbacterin', name: 'Бифидумбактерин', site: 'bifidumbacterin.ru', color: 'C2C7CF', ink: C.navy },
];

module.exports = {
  // ===================== 1. Обложка =====================
  1: (d) => {
    const s = d.cover({ title: 'Normobact L' });
    s.text('Strategic approach 2027 by OMD', { x: 296, y: 716, w: 1328, size: 44, lh: 1.1, color: C.white, align: 'center' });
  },

  // ===================== 2. Цели и задачи 2027 =====================
  // В исходнике — картинка во весь слайд (три полосы с красными номерами и 3D-иконками), текст — в картинке;
  // перенесён живым (сверен по увеличенным фрагментам), иллюстрации — иконками Tabler.
  // Под картинкой лежит старый живой текст цели 1 («+17%, до 866 тысяч упаковок / 502 млн рублей») — не видно, не переносим.
  2: (d) => {
    const s = d.slide({ title: 'Цели и задачи для Нормобакт в 2027 году' });
    const goals = [
      { icon: 'tb:TbTarget',
        t: 'Продолжить поддержку Нормобакт в медиа и увеличить продажи до [[**745 тысяч**]] упаковок / [[**430 млн рублей**]] в 2027 году' },
      { icon: 'tb:TbChartArrowsVertical',
        t: 'Вырастить знание бренда Нормобакт [[**+0,9 п.п.**]] и достичь показателя [[**8%**]]' },
      { icon: 'tb:TbMessageHeart',
        t: 'В коммуникации **выйти из клаттера** и образа еще одного пробиотика и убедить маму, что Нормобакт — это **лучший выбор для ее ребенка**, когда он испытывает проблемы из-за нарушения микрофлоры' },
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
      title: 'Нормобакт / Offline Competitive Landscape',
      subtitle: 'Конкуренты концентрируют крупные бюджеты в отдельных сезонных окнах — при этом рост продаж зависит не только от масштаба, но и от момента выхода',
    });
    const all = charts(3);
    const invP = all.find((c) => c.type === 'COLUMN_STACKED').plots[0];
    const salesP = all.find((c) => c.type === 'LINE').plots[0];
    const cats = invP.cats.map(xl);                      // янв 2023 … авг 2026 (44 мес.)
    const NC = cats.length;
    const NS = salesP.cats.length;                       // продажи: янв 2023 … июн 2026 (42 мес.)
    const IB = [OFF.ent, OFF.lin, OFF.aci, OFF.mxb, OFF.mx, OFF.bac, OFF.bif];    // порядок накопления: лидеры у оси
    const SBg = [OFF.aci, OFF.mxb, OFF.mx, OFF.bac, OFF.bif, OFF.syn];           // фоновые линии продаж
    const SBm = [OFF.ent, OFF.lin];                                              // главные линии продаж (Линекс — поверх)
    const inv = IB.map((b) => brandSeries(invP.series, b).map((v) => (v == null ? 0 : v / 1e6)));
    const tot = cats.map((_, i) => inv.reduce((a, sr) => a + sr[i], 0));
    const sales = (b) => brandSeries(salesP.series, b).map((v) => v / 1e6);
    const labels = cats.map((c) => `${MONTHS[c.m]} ${c.y}`);

    const CA = { x: 58, y: TOP, w: LW, h: BOT - TOP };
    s.card(CA);
    const X0 = 160;
    const X1 = CA.x + CA.w - 30;
    const step = (X1 - X0) / NC;
    const m = chartMap('col', NC, { x: X0, w: step * NC, y: 0, h: 1 }, 0, 1);
    const xOf = (i) => m.cat(i) - step / 2;

    // легенда брендов — общая для инвестиций и продаж
    legendRow(s, [...IB, OFF.syn].map((b) => [b.color, b.name]), { x: NAME_X, y: 290, size: 16, gap: 22 });

    // флайты из Key takeaways: Аципол фев–апр 2023 и сен–ноя 2023 (3), Линекс янв–фев 2026 (2)
    const idx = (y, mo) => cats.findIndex((c) => c.y === y && c.m === mo);
    const FL = [
      { i0: idx(2023, 1), i1: idx(2023, 3), n: 3 },
      { i0: idx(2023, 8), i1: idx(2023, 10), n: 3 },
      { i0: idx(2026, 0), i1: idx(2026, 1), n: 2 },
    ];

    // ---- ряд 1: инвестиции, млн ₽ — накопленные столбцы, итог месяца над столбцом ----
    const lw1 = lw('Динамика инвестиций');
    s.label('Динамика инвестиций', { x: NAME_X, y: 249, w: lw1, color: C.blue });
    s.text('млн ₽, Mediascope', { x: NAME_X + lw1 + 12, y: 251, w: 300, size: 17, color: C.blueText });
    const P1 = { x: X0, w: step * NC, y: 352, h: 158 };
    FL.forEach((f) => s.box({ x: xOf(f.i0), y: 326, w: step * (f.i1 - f.i0 + 1), h: P1.y + P1.h - 326 + 52, fill: BAND, r: 0 }));
    const m1 = s.chart('col', IB.map((b, k) => ({ name: `${b.name}, млн ₽`, labels, values: inv[k].map((v) => +v.toFixed(3)) })),
      { x: P1.x - 10, y: P1.y - 10, w: P1.w + 20, h: P1.h + 20, plot: P1, min: 0, max: 180, stacked: true, gap: 40,
        colors: IB.map((b) => b.color), legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
    tot.forEach((v, i) => {
      if (v < 1) return;
      s.text(v >= 9.95 ? String(Math.round(v)) : f1(v), { x: m1.cat(i) - 22, y: m1.val(v) - 20, w: 44, size: 14, color: C.navy, align: 'center' });
    });
    s.seg(P1.x, P1.y + P1.h, X1, P1.y + P1.h, { color: C.line, width: 1.5 });

    // доля бренда в инвестициях месяца (SOS) — тонкая 100%-полоса под столбцами (в исходнике — отдельный график)
    const PS = { x: X0, w: step * NC, y: P1.y + P1.h + 8, h: 38 };
    s.text('SOS, %', { x: NAME_X, y: PS.y + 9, w: X0 - NAME_X - 6, size: 14, bold: true, color: C.navy });
    s.chart('col', IB.map((b, k) => ({ name: `${b.name}, доля в инвестициях месяца`, labels, values: inv[k].map((v) => +v.toFixed(3)) })),
      { x: PS.x - 10, y: PS.y - 4, w: PS.w + 20, h: PS.h + 8, plot: PS, min: 0, max: 1, percent: true, gap: 40,
        colors: IB.map((b) => b.color), legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });

    // ---- ряд 2: продажи, млн ₽ — линии (фоновые тонкие, лидеры толстые) ----
    const yS = PS.y + PS.h + 22;
    const lw2 = lw('Динамика продаж');
    s.label('Динамика продаж', { x: NAME_X, y: yS, w: lw2, color: C.blue });
    s.text('млн ₽, IQVIA', { x: NAME_X + lw2 + 12, y: yS + 2, w: 300, size: 17, color: C.blueText });
    const P2 = { x: X0, w: step * NS, y: yS + 50, h: 905 - (yS + 50) };
    const m2 = chartMap('line', NS, P2, 0, 500);
    FL.forEach((f) => s.box({ x: xOf(f.i0), y: P2.y - 14, w: step * (f.i1 - f.i0 + 1), h: P2.h + 14, fill: BAND, r: 0 }));
    V.gridY(s, m2, [0, 100, 200, 300, 400, 500], { suffix: '' });
    const lbS = salesP.cats.map((c) => { const t = xl(c); return `${MONTHS[t.m]} ${t.y}`; });
    const lineOpt = (bs, size) => ({ x: P2.x - 16, y: P2.y - 12, w: P2.w + 32, h: P2.h + 24, plot: P2, min: 0, max: 500, values: false, legend: false,
      colors: bs.map((b) => b.color), lineSize: size, symbol: 'none', extra: { catAxisHidden: true, catAxisLineShow: false } });
    s.chart('line', SBg.map((b) => ({ name: `${b.name}, млн ₽`, labels: lbS, values: sales(b).map((v) => +v.toFixed(2)) })), lineOpt(SBg, 2));
    s.chart('line', SBm.map((b) => ({ name: `${b.name}, млн ₽`, labels: lbS, values: sales(b).map((v) => +v.toFixed(2)) })), lineOpt(SBm, 3.5));
    // номера флайтов в подсветке
    FL.forEach((f) => s.badge({ x: xOf(f.i0) + step * (f.i1 - f.i0 + 1) / 2 - 11, y: P2.y - 12, d: 22, n: f.n, color: C.crimson, size: 13 }));
    // флайт Линекса: продажи январь → апрель 2026 (точки из Key takeaways)
    const lin = sales(OFF.lin);
    [idx(2026, 0), idx(2026, 3)].forEach((i) => {
      const v = lin[i];
      s.circle({ x: m2.cat(i) - 7, y: m2.val(v) - 7, d: 14, fill: PINK, stroke: C.crimson, sw: 2.5 });
      s.text(String(Math.round(v)), { x: m2.cat(i) - 30, y: m2.val(v) + 10, w: 60, size: 16, bold: true, color: C.crimson, align: 'center' });
    });

    // границы годов и ось месяцев (общая для обоих графиков)
    [2024, 2025, 2026].forEach((y) => {
      const x = xOf(idx(y, 0));
      s.seg(x, 326, x, PS.y + PS.h, { color: C.line, width: 1.5, dash: 'dash' });
      s.seg(x, P2.y - 14, x, P2.y + P2.h + 4, { color: C.line, width: 1.5, dash: 'dash' });
    });
    monthAxis(s, m, step, cats, P2.y + P2.h + 8, { only: [0, 3, 6, 9], labelW: 50, size: 14, ysize: 16 });
    if (P2.y + P2.h + 8 + 14 + 7 + 20 > BOT - 8) s.warn('график', 'Динамика продаж', `ось месяцев выходит за карточку: ${Math.round(P2.y + P2.h + 49)}`);

    // ---- правая колонка ----
    const yB = offlineBudget(s) + 18;
    takeaways(s, [
      [
        '**Лидеры категории используют масштабные сезонные флайты для усиления позиции.**',
        'Энтерол и Линекс формируют основной объем инвестиций в категории (**180\u00a0млн\u00a0₽ и 65\u00a0млн\u00a0₽** соответственно), концентрируя активность в ключевые периоды спроса и обеспечивая высокий share of voice',
      ],
      [
        '**Усиление медиаподдержки сопровождается ростом продаж бренда.**',
        'Флайт Линекса на Нац.\u00a0ТВ в январе–феврале 2026 позволил увеличить продажи **с 387\u00a0млн\u00a0₽ до 470\u00a0млн\u00a0₽ (+21%)**, подтверждая потенциал охватных размещений как инструмента стимулирования спроса',
      ],
      'Флайт Аципола в сен–ноя 2023 увеличил продажи бренда **с 111\u00a0млн до 190\u00a0млн**, но в то же время флайт в начале года (фев–апр 2023) не оказал заметного положительного влияния на продажи',
    ], { x: RX, y: yB, w: RW, h: BOT - yB, max: 17, min: 15, gap: 14, pgap: 6 });

    s.footnote('Источник: Mediascope, IQVIA. 2026 budget — январь–август 2026 (сумма помесячных данных, расчёт OMD). SOS — доля бренда в инвестициях месяца', { y: 1030, w: 1730 });
  },

  // ===================== 4. Offline Competitive Landscape — каналы =====================
  4: (d) => {
    const s = d.slide({
      title: 'Нормобакт / Offline Competitive Landscape',
      subtitle: 'По данным мониторинга, лидеры преимущественно используют охватное Нац.\u00a0ТВ (Энтерол, Линекс в 2026, Аципол, Максилак — в 2025). Остальные конкуренты используют OOH, радио, OLV',
    });
    const all = charts(4);
    const shareP = all.find((c) => c.type === 'BAR_STACKED_100').plots[0];
    const absP = all.find((c) => c.type === 'BAR_STACKED').plots[0];
    // бренды — по порядку категорий исходника (энтерол, аципол, линекс, максилак бэби, бак-сет, бифиформ, максилак), по 2 года
    const BR = [OFF.ent, OFF.aci, OFF.lin, OFF.mxb, OFF.bac, OFF.bif, OFF.mx];
    const CH = [
      { key: 'nat.tv', name: 'Нац.\u00a0ТВ', color: C.crimson, ink: C.white },
      { key: 'outdoor', name: 'OOH', color: C.green, ink: C.white },
      { key: 'radio', name: 'Радио', color: C.orange, ink: C.white },
      { key: 'olv', name: 'OLV', color: C.navy, ink: C.white },
      { key: 'press', name: 'Пресса', color: C.cyan, ink: C.navy },
    ];
    const NR = shareP.cats.length;     // 14
    const val = (P, ch, i) => P.series.find((sr) => sr.name === ch.key).values[i] || 0;
    const total = (i) => absP.series.find((sr) => sr.name === 'total').values[i] / 1e6;
    const rowLbl = shareP.cats.map((c) => (c.includes('2025') ? 'янв–авг 2025' : 'янв–авг 2026'));
    const BADGE = { 5: 1, 9: 2, 11: 2 };    // Линекс 2026 — вывод 1; Бак-Сет и Бифиформ 2026 (OOH, радио) — вывод 2

    const CA = { x: 58, y: TOP, w: LW, h: BOT - TOP };
    s.card(CA);
    const YX = 248;              // колонка периода
    const AX0 = 384;             // доли по каналам: 384…790
    const AX1 = 790;
    const BX0 = 850;             // инвестиции, млн ₽: 850…1250 (+ итог справа)
    const BX1 = 1250;
    s.label('Доля инвестиций по каналам', { x: NAME_X, y: 249, w: AX1 - NAME_X, color: C.blue });
    s.label('Инвестиции по каналам', { x: BX0, y: 249, w: lw('Инвестиции по каналам'), color: C.blue });
    s.text('млн ₽', { x: BX0 + lw('Инвестиции по каналам') + 10, y: 251, w: 120, size: 17, color: C.blueText });
    legendRow(s, CH.map((c) => [c.color, c.name]), { x: NAME_X, y: 292, size: 16, gap: 26, mark: 'sq' });

    const PA = { x: AX0, y: 338, w: AX1 - AX0, h: 640 };
    const PB = { x: BX0, y: PA.y, w: BX1 - BX0, h: PA.h };
    const labels = shareP.cats.map((c, i) => `${BR[Math.floor(i / 2)].name}, ${rowLbl[i]}`);
    const mA = s.chart('bar', CH.map((c) => ({ name: c.name, labels, values: shareP.cats.map((_, i) => +val(shareP, c, i).toFixed(4)) })),
      { x: PA.x - 10, y: PA.y - 6, w: PA.w + 20, h: PA.h + 12, plot: PA, min: 0, max: 1, percent: true, gap: 50,
        colors: CH.map((c) => c.color), legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
    const mB = s.chart('bar', CH.map((c) => ({ name: `${c.name}, млн ₽`, labels, values: absP.cats.map((_, i) => +(val(absP, c, i) / 1e6).toFixed(3)) })),
      { x: PB.x - 10, y: PB.y - 6, w: PB.w + 20, h: PB.h + 12, plot: PB, min: 0, max: 180, stacked: true, gap: 50,
        colors: CH.map((c) => c.color), legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
    const barH = mA.step / 1.5;
    for (let i = 0; i < NR; i++) {
      const yc = mA.cat(i);
      const b = BR[Math.floor(i / 2)];
      if (i % 2 === 0) {
        if (i > 0) s.hline(NAME_X - 8, yc - mA.step / 2, 1388 - 30 - (NAME_X - 8));
        s.text(b.name, { x: NAME_X, y: yc - 10, w: YX - NAME_X - 6, size: 17, bold: true, color: C.navy });
      }
      s.text(rowLbl[i], { x: YX, y: yc - 9, w: AX0 - YX - 10, size: 15, color: C.blueText });
      // доли каналов (подписи — от 5%)
      let cum = 0;
      CH.forEach((c) => {
        const v = val(shareP, c, i);
        const xc = PA.x + PA.w * (cum + v / 2);
        cum += v;
        if (v >= 0.05) s.text(`${Math.round(v * 100)}%`, { x: xc - 30, y: yc - 9, w: 60, size: 14, bold: true, color: c.ink, align: 'center' });
      });
      // итог за период, млн ₽
      const t = total(i);
      const xe = mB.val(t);
      const tt = t >= 1 ? f1(t) : f2(t);
      s.text(tt, { x: xe + 8, y: yc - 10, w: 90, size: 16, bold: true, color: C.navy });
      if (BADGE[i]) s.badge({ x: 1388 - 30 - 22, y: yc - 11, d: 22, n: BADGE[i], color: C.crimson, size: 13 });
    }
    if (barH < 20) s.warn('график', 'Доля инвестиций по каналам', `полосы слишком тонкие: ${barH}`);

    // ---- правая колонка ----
    const yB = offlineBudget(s) + 18;
    takeaways(s, [
      'В 2026 году **Линекс полностью сфокусировал инвестиции на Нац.\u00a0ТВ (65\u00a0млн\u00a0₽)**, сохраняя стратегию масштабного охвата аудитории родителей. Аналогичный подход использовали Энтерол и Аципол в сезонные периоды',
      'Крупные игроки категории применяют **ТВ как основной драйвер знания**, тогда как бренды с меньшими инвестициями используют **радио и OOH** для поддержания присутствия и локального охвата',
    ], { x: RX, y: yB, w: RW, h: BOT - yB, max: 18, min: 15, gap: 22 });

    s.footnote('Источник: Mediascope. 2026 budget — январь–август 2026', { y: 1030, w: 1730 });
  },

  // ===================== 5. Digital Competitive Landscape =====================
  5: (d) => {
    const s = d.slide({
      title: 'Нормобакт / Digital Competitive Landscape',
      subtitle: 'Конкуренты усиливают digital-поддержку для захвата спроса, тогда как Нормобакт сохраняет позиции при ограниченном медиавесе',
    });
    const all = charts(5);
    const salesC = all.find((c) => c.type === 'COLUMN_CLUSTERED');
    const budP = all.find((c) => c.type === 'LINE_MARKERS').plots[0];
    const splitP = all.find((c) => c.type === 'BAR_STACKED_100').plots[0];
    const barP = salesC.plots.find((p) => p.type === 'BarPlot').series;
    const lineP = salesC.plots.find((p) => p.type === 'LinePlot').series;
    const B = DIG;
    const sales = B.map((b) => pick(barP, b.key));                          // млн ₽, янв 2025 – июн 2026
    const share = B.map((b) => pick(lineP, b.key).map((v) => v * 100));     // доля продаж, %
    const budget = B.map((b) => pick(budP.series, b.key));                  // digital-бюджет, млн ₽, янв 2025 – июл 2026
    const NB = budP.cats.length;      // 19
    const NS = sales[0].length;       // 18
    const cats = Array.from({ length: NB }, (_, i) => ({ m: i % 12, y: i < 12 ? 2025 : 2026 }));
    const labelsS = cats.slice(0, NS).map((c) => `${MONTHS[c.m]} ${c.y}`);

    // ---- левая карточка: продажи, доля продаж, digital-бюджет на общей оси месяцев ----
    const CA = { x: 58, y: TOP, w: LW, h: 596 };
    s.card(CA);
    const LBL = 'Динамика инвестиций в digital-медиа и продаж';
    s.label(LBL, { x: NAME_X, y: 249, w: lw(LBL), color: C.blue });
    const X0 = 262;
    const X1 = CA.x + CA.w - 28;
    legendRow(s, B.map((b) => [b.color, b.name]), { x1: X1, y: 250, size: 16, gap: 22 });
    const step = (X1 - X0) / NB;
    const m = chartMap('col', NB, { x: X0, w: step * NB, y: 0, h: 1 }, 0, 1);
    const xYear = m.cat(12) - step / 2;

    // ряд 1: продажи, млн ₽ — Нормобакт линией с подписями, конкуренты строками
    const t1 = 'Продажи, млн ₽';
    s.text(t1, { x: NAME_X, y: 292, w: 300, size: 17, bold: true, color: C.navy });
    s.badge({ x: NAME_X + tw(t1, 17, true) + 12, y: 292, d: 22, n: 2, color: C.crimson, size: 13 });
    const P1 = { x: X0, w: step * NS, y: 338, h: 62 };
    rowName(s, B[0], NAME_X, P1.y + 22, X0 - NAME_X - 4, { bold: true });
    const m1 = s.chart('line', [{ name: 'Нормобакт, млн ₽', labels: labelsS, values: sales[0].map((v) => +v.toFixed(2)) }],
      { x: P1.x - 16, y: P1.y - 12, w: P1.w + 32, h: P1.h + 24, plot: P1, min: 30, max: 54, values: false, legend: false,
        colors: [C.blue], lineSize: 3, symbolSize: 7, extra: { catAxisHidden: true, catAxisLineShow: false } });
    sales[0].forEach((v, i) => {
      const last = i === NS - 1;     // июнь 2026 — снижение до 35,4 (Key takeaways)
      if (last) s.circle({ x: m1.cat(i) - 7, y: m1.val(v) - 7, d: 14, fill: C.crimson });
      s.text(f1(v), { x: m1.cat(i) - 30, y: m1.val(v) - 24, w: 60, size: 14, bold: true, color: last ? C.crimson : C.navy, align: 'center' });
    });
    const RS = 21;
    let y = P1.y + P1.h + 10;
    [1, 2, 3].forEach((k, j) => {
      const yy = y + j * RS;
      rowName(s, B[k], NAME_X, yy, X0 - NAME_X - 4, { size: 14 });
      sales[k].forEach((v, i) => s.text(f1(v), { x: m.cat(i) - step / 2, y: yy + 1, w: step, size: 14, color: C.blueText, align: 'center' }));
    });
    y += 3 * RS + 14;

    // ряд 2: доля продаж, % — строки чисел (вторая ось исходника)
    s.text('Доля продаж, %', { x: NAME_X, y, w: 300, size: 17, bold: true, color: C.navy });
    const ySH = y + 27;
    s.box({ x: X0, y: ySH, w: step * NS, h: RS, fill: C.cardTint, r: 4 });
    share.forEach((vals, k) => {
      const yy = ySH + k * RS;
      rowName(s, B[k], NAME_X, yy + 1, X0 - NAME_X - 4, { bold: k === 0, size: 14 });
      vals.forEach((v, i) => s.text(f1(v), { x: m.cat(i) - step / 2, y: yy + 2, w: step, size: 14, bold: k === 0,
        color: k === 0 ? C.navy : C.blueText, align: 'center' }));
    });
    y = ySH + 4 * RS + 14;

    // ряд 3: digital-бюджет, млн ₽ — тепловая полоса
    const t3 = 'Digital-бюджет, млн ₽';
    s.text(t3, { x: NAME_X, y, w: 400, size: 17, bold: true, color: C.navy });
    const bx3 = NAME_X + tw(t3, 17, true) + 12;
    s.badge({ x: bx3, y, d: 22, n: 1, color: C.crimson, size: 13 });
    s.text('Estimated by DigitalBudget', { x: bx3 + 34, y: y + 2, w: 400, size: 15, color: C.blueText });
    const RH = 25;
    const yBU = y + 28;
    budget.forEach((vals, k) => {
      const yy = yBU + k * RH;
      rowName(s, B[k], NAME_X, yy + 4, X0 - NAME_X - 4, { bold: k === 0, size: 14 });
      vals.forEach((v, i) => {
        const hot = (k === 1 || k === 2) && i === 17;     // июнь 2026: Энтерол и Бак-Сет усилили поддержку (Key takeaways)
        heatCell(s, { x: m.cat(i) - step / 2, y: yy, w: step, h: RH, v, vmax: 8, color: B[k].color, text: f2(v), bold: k === 0, hot });
      });
    });
    const yEnd = yBU + 4 * RH;
    s.seg(xYear, 300, xYear, yEnd + 4, { color: C.line, width: 1.5, dash: 'dash' });
    monthAxis(s, m, step, cats, yEnd + 6);
    if (yEnd + 6 + 14 + 7 + 20 > CA.y + CA.h - 6) s.warn('график', LBL, `ось месяцев выходит за карточку: ${Math.round(yEnd + 47)} > ${CA.y + CA.h - 6}`);

    // ---- левая нижняя карточка: доля инвестиций по каналам ----
    const CB = { x: 58, y: CA.y + CA.h + 18, w: LW, h: BOT - (CA.y + CA.h + 18) };
    s.card(CB);
    const LB2 = 'Доля инвестиций по каналам';
    s.label(LB2, { x: NAME_X, y: CB.y + 22, w: lw(LB2), color: C.blue });
    const CH = [
      { name: 'Paid Search', key: 'paid search', color: C.cyan, ink: C.navy },
      { name: 'Banners', key: 'banners', color: C.orange, ink: C.white },
      { name: 'Online Video', key: 'online video', color: C.navy, ink: C.white },
      { name: 'Paid Social', key: 'paid social', color: C.green, ink: C.white },
      { name: 'e-mail Marketing (CRM)', key: 'e-mail', color: C.purple, ink: C.white },
      // «Affilate» в исходнике — опечатка
      { name: 'Affiliate / CPA', key: 'affil', color: 'C9D6E6', ink: C.navy },
    ];
    let lsz = 15;
    const lx0 = NAME_X + lw(LB2) + 30;
    const lwid = (sz) => CH.reduce((a, ch) => a + 14 + 8 + tw(ch.name, sz, false) + 18, 0) - 18;
    while (lsz > 13 && lx0 + lwid(lsz) > X1) lsz -= 1;
    legendRow(s, CH.map((ch) => [ch.color, ch.name]), { x1: X1, y: CB.y + 23, size: lsz, gap: 18, mark: 'sq' });
    const sIdx = B.map((b) => splitP.cats.findIndex((c) => c.toLowerCase() === b.site));
    const sv = (ch, k) => splitP.series.find((sr) => sr.name.toLowerCase().startsWith(ch.key)).values[sIdx[k]] || 0;
    const rowH = 25;
    const PB = { x: X0, y: CB.y + 62, w: X1 - X0, h: rowH * B.length };
    const mb = s.chart('bar', CH.map((ch) => ({ name: ch.name, labels: B.map((b) => b.site), values: B.map((_, k) => +sv(ch, k).toFixed(4)) })),
      { x: PB.x - 10, y: PB.y - 6, w: PB.w + 20, h: PB.h + 12, plot: PB, min: 0, max: 1, percent: true, gap: 30,
        colors: CH.map((ch) => ch.color), legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
    B.forEach((b, k) => {
      const yc = mb.cat(k);
      if (k === 1 || k === 2) s.badge({ x: NAME_X - 4, y: yc - 11, d: 22, n: 1, color: C.crimson, size: 13 });
      s.text(b.site, { x: NAME_X + 26, y: yc - 10, w: X0 - NAME_X - 30, size: 15, bold: k === 0, color: C.navy });
      const tot = CH.reduce((a, ch) => a + sv(ch, k), 0) || 1;
      let cum = 0;
      CH.forEach((ch) => {
        const v = sv(ch, k) / tot;
        const xc = PB.x + PB.w * (cum + v / 2);
        cum += v;
        if (v >= 0.025) s.text(`${Math.round(sv(ch, k) * 100)}%`, { x: xc - 30, y: yc - 9, w: 60, size: 14, bold: true, color: ch.ink, align: 'center' });
      });
    });

    // ---- правая колонка ----
    const hA = 252;
    s.card({ x: RX, y: TOP, w: RW, h: hA });
    s.label('Digital budgets', { x: RX + 30, y: TOP + 28, w: RW - 60, color: C.blue });
    budgetBars(s, [
      { name: 'Энтерол', value: 40.2, text: '40,2 млн ₽', color: B[1].color },
      { name: 'Бак-Сет', value: 33.1, text: '33,1 млн ₽', color: B[2].color },
      { name: 'Нормобакт', value: 2.8, text: '2,8 млн ₽', color: B[0].color, bold: true },
      { name: 'Бифидумбактерин', value: 0.9, text: '0,9 млн ₽', color: B[3].color },
    ], { x: RX + 30, y: TOP + 68, w: RW - 60, nameW: 166, valW: 112, pitch: 37 });
    s.text('Estimated by DigitalBudget', { x: RX + 30, y: TOP + hA - 36, w: RW - 60, size: 14, color: C.blueText });

    const yB = TOP + hA + 18;
    takeaways(s, [
      'Энтерол и Бак-Сет **лидируют по объему digital-инвестиций**, делая основной акцент на **Paid Search (44% и 88% бюджета)**. В июне бренды существенно увеличили медиаподдержку, усиливая захват сформированного спроса',
      'При digital-бюджете 2,8\u00a0млн\u00a0₽ Нормобакт **поддерживал продажи на уровне 39–44\u00a0млн\u00a0₽** в начале года. **Снижение продаж в июне до 35,4\u00a0млн\u00a0₽** происходило на фоне минимальной активности и усиления давления со стороны конкурентов',
    ], { x: RX, y: yB, w: RW, h: BOT - yB, max: 18, min: 15, gap: 22 });

    s.footnote('Источник: DigitalBudget, IQVIA. Estimated by DigitalBudget. Not all channels are covered by the monitoring', { y: 1030, w: 1730 });
  },
};
