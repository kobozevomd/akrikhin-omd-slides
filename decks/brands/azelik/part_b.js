// Азелик · стратегия 2027 — часть B: слайды исходника 10–15
// (разделитель «Анализ конкурентов», Competitive Landscape, ТВ Базирона, digital compete ×2, креативы конкурентов)
const path = require('path');
const { C, ACCENTS, CHART_COLORS, columns, IN, PT, chartMap, textWidth, fitSize, countLines, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT, MUTED, GRID, fmt, pct, statTile, numMark, legend, yearAxis, gridY
const A = require('./common');                            // SRC, MEDIA, CROPS, video, stageTag
const SRC = A.SRC;
const MEDIA = A.MEDIA;

const TOP = V.TOP;          // 221 — верх контента
const BOT = V.BOT;          // 1005 — низ контента без плашки
const MUTED = '93AACB';     // фоновый бренд 1 (сине-серый)
const MUTED2 = '64BEE8';    // фоновый бренд 2 (голубой)
const SUB = '5A7BA6';       // второстепенные цифры (доли под значениями)

// ---------- помощники ----------
const charts = (n) => require(path.join(SRC, `slide-${String(n).padStart(2, '0')}.json`))
  .shapes.filter((sh) => sh.t === 'CHART').map((sh) => sh.chart);
const f1 = (v) => v.toFixed(1).replace('.', ',');
const f2 = (v) => v.toFixed(2).replace('.', ',');
const hex = (n) => Math.round(n).toString(16).padStart(2, '0');
// смешение цветов: t = 0 → a, t = 1 → b
const mix = (a, b, t) => [0, 2, 4].map((k) => hex(parseInt(a.substr(k, 2), 16) * (1 - t) + parseInt(b.substr(k, 2), 16) * t)).join('').toUpperCase();
const BAND = mix('FFFFFF', C.crimson, 0.07);   // подсветка периода
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
// Excel-дата (45658) → { m: 0…11, y: 2025 }
const xl = (n) => { const dt = new Date(Date.UTC(1899, 11, 30) + Number(n) * 86400000); return { m: dt.getUTCMonth(), y: dt.getUTCFullYear() }; };
// ширина строки по переведённому тексту (для раскладки в строку)
const tw = (t, size, bold) => textWidth(typo(tr(t)).replace(/\*\*|\[\[|\]\]/g, ''), size, bold);
// ширина КАПС-метки (s.label) по переведённому тексту
const lw = (t, size = 22) => Math.ceil(textWidth(typo(tr(t)).toUpperCase(), size, true)) + 6;
const pick = (series, key) => series.find((sr) => sr.name.toLowerCase().includes(key)).values;

// Число строк с учётом жирных фрагментов (**…**) и переносов по дефису (PowerPoint и LibreOffice рвут «digital-поддержки»)
function textLines(text, size, width) {
  const t = typo(tr(text)).replace(/\[\[|\]\]/g, '');
  const max = width;      // жирные слова уже измерены жирным — запас 3% библиотеки здесь даёт лишнюю строку
  const sp = textWidth(' ', size, false);
  let lines = 0;
  for (const para of t.split(/\n/)) {
    lines++;
    let bold = false;
    let cur = 0;
    let word = 0;
    let spaced = false;   // перед текущим куском был пробел
    const flush = (nextSpaced) => {
      if (word) {
        const need = (spaced ? sp : 0) + word;
        if (cur === 0) cur = word;
        else if (cur + need <= max) cur += need;
        else { lines++; cur = word; }
        while (cur > max) { lines++; cur -= max; }
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
  const x0 = lx;
  items.forEach(([color, t], k) => {
    const my = y + (size * 1.2 - 14) / 2;
    if (mark === 'dot') s.circle({ x: lx, y: my, d: 14, fill: color });
    else s.box({ x: lx, y: my, w: 14, h: 14, fill: color, r: 3 });
    s.text(t, { x: lx + 22, y, w: ws[k] + 8, size, color: C.navy });
    lx += 14 + 8 + ws[k] + gap;
  });
  return x0;
}
// Легенда с переносом по ширине: строки по maxW, возвращает высоту
function legendWrap(s, items, { x, y, maxW, size = 14, gap = 18, rowH = 22, mark = 'sq' }) {
  let lx = x;
  let ly = y;
  items.forEach(([color, t]) => {
    const w = 14 + 7 + tw(t, size, false);
    if (lx > x && lx + w > x + maxW) { lx = x; ly += rowH; }
    const my = ly + (size * 1.2 - 13) / 2;
    if (mark === 'dot') s.circle({ x: lx, y: my, d: 13, fill: color });
    else s.box({ x: lx, y: my, w: 13, h: 13, fill: color, r: 3 });
    s.text(t, { x: lx + 20, y: ly, w: w - 14, size, color: C.navy });
    lx += w + gap;
  });
  return ly + rowH - y;
}
// Подпись строки данных: кружок цвета бренда + имя
function rowName(s, b, x, y, w, { bold = false, size = 15 } = {}) {
  s.circle({ x, y: y + (size * 1.2 - 12) / 2, d: 12, fill: b.color });
  s.text(b.name, { x: x + 20, y, w: w - 20, size, bold, color: C.navy });
}
// Ось месяцев + годы под общей шкалой m (chartMap), cats — Excel-даты или индексы
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
// Карточка «Key takeaways» с номерами; кегль подбирается по высоте
function takeaways(s, items, { x, y, w, h, label = 'Key takeaways', max = 18, min = 15, gap = 16, marks = true }) {
  s.card({ x, y, w, h });
  s.label(label, { x: x + 30, y: y + 28, w: w - 60, color: C.crimson });
  const TX = x + 30 + (marks ? 34 : 0);
  const TW = w - 60 - (marks ? 34 : 0);
  const avail = h - 66 - 24;
  let sz = max;
  // оценка с запасом: жирные фрагменты шире, LibreOffice/PowerPoint переносят раньше
  const hOf = (t, z) => textLines(t, z, TW) * z * 1.22;
  const need = (z) => items.reduce((a, t) => a + hOf(t, z), 0) + (items.length - 1) * gap;
  while (sz > min && need(sz) > avail) sz -= 1;
  // свободное место — поровну в промежутки между пунктами (не больше +14 px)
  if (items.length > 1) gap += Math.max(0, Math.min(14, (avail - need(sz)) / (items.length - 1)));
  let ty = y + 66;
  items.forEach((t, k) => {
    if (marks) s.badge({ x: x + 30, y: ty, d: 22, n: k + 1, color: C.crimson, size: 13 });
    const h = Math.ceil(hOf(t, sz));
    s.text(t, { x: TX, y: ty - 1, w: TW, size: sz, lh: 1.22, color: C.navy });   // шаг — по своей оценке (с переносами по дефису)
    ty += h + gap;
  });
  if (ty - gap > y + h - 16) s.warn('takeaways', items[0], `текст выходит за карточку: ${Math.round(ty - gap)} > ${y + h - 16}`);
}
// Тепловая ячейка: заливка по интенсивности, цифра поверх
function heatCell(s, { x, y, w, h, v, vmax, color, text, bold, hot, hotColor = C.navy, size = 14 }) {
  const f = Math.min(1, v / vmax) ** 0.8 * 0.92;
  s.box({ x: x + 1.5, y: y + 1.5, w: w - 3, h: h - 3, fill: mix('FFFFFF', color, f), r: 4, stroke: hot ? hotColor : undefined, sw: 2.5 });
  s.text(text, { x, y: y + (h - size * 1.2) / 2, w, size, bold: bold || hot, color: f > 0.62 ? C.white : C.navy, align: 'center' });
}

// Карточка «Доля инвестиций по каналам» (DigitalBudget): 100%-полосы по сайтам брендов, легенда в строке метки.
// mark: { индекс бренда: номер вывода }, note: { row, text } — подпись справа от полосы бренда
function channelSplit(s, splitP, B, { box, nameX, x0, x1, mark = {}, note }) {
  s.card(box);
  const LBL = 'Доля инвестиций по каналам';
  s.label(LBL, { x: nameX, y: box.y + 22, w: lw(LBL), color: C.blue });
  const CH = [
    { name: 'Online Video', key: 'online video', color: C.navy, ink: C.white },
    { name: 'Banners', key: 'banners', color: C.orange, ink: C.white },
    { name: 'Paid Search', key: 'paid search', color: C.cyan, ink: C.navy },
    { name: 'Paid Social', key: 'paid social', color: C.green, ink: C.white },
    { name: 'e-mail Marketing (CRM)', key: 'e-mail', color: C.purple, ink: C.white },
    { name: 'Affiliate / CPA', key: 'affil', color: 'C9D6E6', ink: C.navy },
  ];
  let lsz = 15;
  const lx0 = nameX + lw(LBL) + 36;
  const lwid = (sz) => CH.reduce((a, ch) => a + 14 + 7 + tw(ch.name, sz, false) + 18, 0) - 18;
  while (lsz > 13 && lx0 + lwid(lsz) > x1) lsz -= 1;
  legendRow(s, CH.map((ch) => [ch.color, ch.name]), { x1, y: box.y + 23, size: lsz, gap: 18, mark: 'sq' });
  const idx = B.map((b) => splitP.cats.findIndex((c) => c.toLowerCase() === b.site));
  const val = (ch, k) => splitP.series.find((sr) => sr.name.toLowerCase().includes(ch.key)).values[idx[k]] || 0;
  const n = B.length;
  const rowH = Math.min(34, (box.h - 62 - 22) / n);
  const PB = { x: x0, y: box.y + 62 + Math.max(0, (box.h - 62 - 22 - rowH * n) / 2), w: (note ? x1 - 420 : x1) - x0, h: rowH * n };
  const mb = s.chart('bar', CH.map((ch) => ({ name: ch.name, labels: B.map((b) => b.site), values: B.map((_, k) => +val(ch, k).toFixed(4)) })),
    { x: PB.x - 10, y: PB.y - 6, w: PB.w + 20, h: PB.h + 12, plot: PB, min: 0, max: 1, percent: true, gap: 34,
      colors: CH.map((ch) => ch.color), legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
  B.forEach((b, k) => {
    const yc = mb.cat(k);
    if (mark[k]) s.badge({ x: nameX - 4, y: yc - 11, d: 22, n: mark[k], color: C.crimson, size: 13 });
    s.text(b.site, { x: nameX + 26, y: yc - 10, w: x0 - nameX - 30, size: 15, bold: k === 0, color: C.navy });
    const tot = CH.reduce((a, ch) => a + val(ch, k), 0) || 1;
    let cum = 0;
    CH.forEach((ch) => {
      const v = val(ch, k) / tot;
      const xc = PB.x + PB.w * (cum + v / 2);
      cum += v;
      if (v >= 0.025) s.text(`${Math.round(val(ch, k) * 100)}%`, { x: xc - 30, y: yc - 9, w: 60, size: 14, bold: true, color: ch.ink, align: 'center' });
    });
  });
  if (note) {
    const yc = mb.cat(note.row);
    s.text(note.text, { x: PB.x + PB.w + 20, y: yc - 22, w: x1 - PB.x - PB.w - 20, h: 48, size: 15, bold: true, color: C.crimson, valign: 'middle', fit: true, minSize: 13 });
  }
}

module.exports = {
  // ===================== 10. Разделитель =====================
  10: (d) => {
    d.section('Анализ конкурентов и результаты 2026');
    d.divider({ title: 'Анализ конкурентов и результаты 2026', kicker: '2027' });
  },

  // ===================== 11. Competitive Landscape =====================
  11: (d) => {
    // первая фраза подзаголовка исходника («По данным MediaScope… только у двух конкурентов») дублирует сноску — объединена со сноской
    const s = d.slide({
      title: 'Azelik / Competitive Landscape',
      subtitle: 'Скиноклир формирует основное конкурентное давление по объему инвестиций, тогда как Базирон сохраняет минимальную OLV-поддержку',
    });
    const all = charts(11);
    const invP = all.find((c) => c.type === 'COLUMN_STACKED').plots[0];
    const sosP = all.find((c) => c.type === 'COLUMN_STACKED_100').plots[0];
    const salesP = all.find((c) => c.type === 'LINE').plots[0];
    const chP = all.find((c) => c.type === 'BAR_STACKED_100').plots[0];
    const cats = invP.cats.map(xl);                    // янв 2025 … июл 2026
    const N = cats.length;
    const B = {
      az: { key: 'азелик', name: 'Азелик', color: C.blue, sales: 'Азелик — продажи, млн ₽' },
      sk: { key: 'скиноклир', name: 'Скиноклир', color: C.crimson, sales: 'Скиноклир — продажи, млн ₽', inv: 'Скиноклир — инвестиции, тыс. ₽' },
      bas: { key: 'базирон', name: 'Базирон АС', color: MUTED, sales: 'Базирон АС — продажи, млн ₽', inv: 'Базирон АС — инвестиции, тыс. ₽' },
      met: { key: 'метрогил', name: 'Метрогил', color: MUTED2, inv: 'Метрогил — инвестиции, тыс. ₽' },
    };
    const SB = [B.az, B.sk, B.bas];
    const IB = [B.sk, B.bas, B.met];
    const sales = SB.map((b) => pick(salesP.series, b.key).map((v) => v / 1e6));
    const inv = IB.map((b) => pick(invP.series, b.key).map((v) => (v == null ? 0 : v / 1000)));
    const sos = IB.map((b) => pick(sosP.series, b.key).map((v) => (v == null ? null : v * 100)));

    // ---- левая карточка: продажи и инвестиции на общей оси месяцев ----
    const LW = 1330;
    const CA = { x: 58, y: TOP, w: LW, h: 580 };
    s.card(CA);
    const X0 = 252;
    const X1 = CA.x + CA.w - 28;
    const step = (X1 - X0) / N;
    const m = chartMap('col', N, { x: X0, w: step * N, y: 0, h: 1 }, 0, 1);
    const NAME_X = 94;
    legendRow(s, [B.az, B.sk, B.bas, B.met].map((b) => [b.color, b.name]), { x1: X1, y: 249, size: 17, gap: 26 });

    // подсветка: Азелик опережает Скиноклир с марта 2026 (индексы 14…18)
    const bx = m.cat(14) - step / 2;
    s.box({ x: bx, y: 288, w: X1 - bx, h: 206, fill: BAND, r: 0 });
    s.badge({ x: bx + 8, y: 292, d: 22, n: 2, color: C.crimson, size: 13 });
    s.text('с марта 2026', { x: bx + 34, y: 293, w: X1 - bx - 36, size: 15, bold: true, color: C.crimson });
    const xYear = m.cat(12) - step / 2;

    // ряд 1: продажи, млн ₽ — линии + цифры
    const lw1 = lw('Динамика продаж');
    s.label('Динамика продаж', { x: NAME_X, y: 249, w: lw1, color: C.blue });
    s.text('млн ₽, IQVIA', { x: NAME_X + lw1 + 12, y: 251, w: 200, size: 17, color: C.blueText });
    const P1 = { x: X0, w: step * N, y: 318, h: 100 };
    s.chart('line', SB.map((b, k) => ({ name: b.sales, labels: cats.map((c) => MONTHS[c.m]), values: sales[k].map((v) => +v.toFixed(2)) })),
      { x: P1.x - 16, y: P1.y - 12, w: P1.w + 32, h: P1.h + 24, plot: P1, min: 50, max: 140, values: false, legend: false,
        colors: SB.map((b) => b.color), lineSize: 2.5, symbolSize: 6, extra: { catAxisHidden: true, catAxisLineShow: false } });
    const RH = 22;
    const yS = 426;
    SB.forEach((b, k) => {
      const y = yS + k * RH;
      rowName(s, b, NAME_X, y, X0 - NAME_X - 4, { bold: k === 0 });
      sales[k].forEach((v, i) => s.text(f1(v), { x: m.cat(i) - step / 2, y: y + 1, w: step, size: 14, bold: k === 0,
        color: k === 0 ? C.navy : C.blueText, align: 'center' }));
    });

    // ряд 2: digital-инвестиции, тыс. ₽ (Mediascope) — накопленные столбцы + цифры и доля бренда в месяце (SOS)
    const yI = 512;
    const lw2 = lw('Динамика инвестиций');
    s.label('Динамика инвестиций', { x: NAME_X, y: yI, w: lw2, color: C.blue });
    s.text('тыс. ₽, Mediascope; под значением — доля бренда в инвестициях месяца (SOS), %', { x: NAME_X + lw2 + 12, y: yI + 2, w: X1 - NAME_X - lw2 - 12, size: 16, color: C.blueText });
    const P2 = { x: X0, w: step * N, y: 556, h: 70 };
    s.chart('col', IB.map((b, k) => ({ name: b.inv, labels: cats.map((c) => MONTHS[c.m]), values: inv[k].map((v) => +v.toFixed(1)) })),
      { x: P2.x - 10, y: P2.y - 10, w: P2.w + 20, h: P2.h + 20, plot: P2, min: 0, max: 800, stacked: true, gap: 45,
        colors: IB.map((b) => b.color), legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
    s.seg(P2.x, P2.y + P2.h, X1, P2.y + P2.h, { color: C.line, width: 1.5 });
    const RI = 36;
    const yR = P2.y + P2.h + 8;
    IB.forEach((b, k) => {
      const y = yR + k * RI;
      if (k % 2 === 0) s.box({ x: NAME_X - 8, y: y - 2, w: X1 - NAME_X + 8, h: RI, fill: 'F3F7FC', r: 6 });
      rowName(s, b, NAME_X, y + 1, X0 - NAME_X - 4, { bold: k === 0 });
      inv[k].forEach((v, i) => {
        if (!v) return;
        const t = v >= 10 ? String(Math.round(v)) : f1(v);
        s.text(t, { x: m.cat(i) - step / 2, y: y + 1, w: step, size: 14, bold: true, color: C.navy, align: 'center' });
        if (sos[k][i] != null) s.text(`${Math.round(sos[k][i])}%`, { x: m.cat(i) - step / 2, y: y + 17, w: step, size: 14, color: SUB, align: 'center' });
      });
    });
    const yEnd = yR + 3 * RI;
    // граница годов — двумя отрезками: не пересекает подпись ряда «Динамика инвестиций»
    s.seg(xYear, 300, xYear, yS + SB.length * RH, { color: C.line, width: 1.5, dash: 'dash' });
    s.seg(xYear, P2.y - 6, xYear, yEnd, { color: C.line, width: 1.5, dash: 'dash' });
    monthAxis(s, m, step, cats, yEnd + 6);

    // ---- левая нижняя карточка: доля инвестиций по каналам ----
    const CB = { x: 58, y: CA.y + CA.h + 18, w: LW, h: BOT - (CA.y + CA.h + 18) };
    s.card(CB);
    const LBL = 'Доля инвестиций по каналам';
    s.label(LBL, { x: NAME_X, y: CB.y + 22, w: lw(LBL), color: C.blue });
    const CH = [
      { key: 'olv', name: 'OLV', color: C.navy, ink: C.white },
      { key: 'outdoor', name: 'Outdoor', color: C.green, ink: C.white },
      { key: 'press', name: 'Пресса', color: C.cyan, ink: C.navy },
    ];
    legendRow(s, CH.map((c) => [c.color, c.name]), { x1: X1, y: CB.y + 22, size: 16, mark: 'sq' });
    const rows = [
      { brand: B.sk, period: 'янв–июл 2025', i: 0 },
      { brand: B.sk, period: 'янв–июл 2026', i: 1, mark: 1 },
      { brand: B.bas, period: 'янв–июл 2025', i: 2 },
      { brand: B.bas, period: 'янв–июл 2026', i: 3, mark: 3 },
    ];
    const BX0 = 360;
    const PB = { x: BX0, y: CB.y + 62, w: X1 - 36 - BX0, h: 4 * 26 };
    const mb = s.chart('bar', CH.map((c) => ({ name: c.name, labels: rows.map((r) => r.period), values: rows.map((r) => +(pick(chP.series, c.key)[r.i] || 0).toFixed(4)) })),
      { x: PB.x - 10, y: PB.y - 6, w: PB.w + 20, h: PB.h + 12, plot: PB, min: 0, max: 1, percent: true, gap: 30,
        colors: CH.map((c) => c.color), legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
    rows.forEach((r, k) => {
      const yc = mb.cat(k);
      if (k % 2 === 0) s.text(r.brand.name, { x: NAME_X, y: yc - 10, w: 130, size: 16, bold: true, color: C.navy });
      s.text(r.period, { x: 222, y: yc - 9, w: BX0 - 230, size: 15, color: C.blueText });
      let cum = 0;
      CH.forEach((c) => {
        const v = pick(chP.series, c.key)[r.i] || 0;
        const xc = PB.x + PB.w * (cum + v / 2);
        cum += v;
        if (v >= 0.05) s.text(`${Math.round(v * 100)}%`, { x: xc - 30, y: yc - 9, w: 60, size: 14, bold: true, color: c.ink, align: 'center' });
      });
      if (r.mark) s.badge({ x: PB.x + PB.w + 10, y: yc - 11, d: 22, n: r.mark, color: C.crimson, size: 13 });
    });

    // ---- правая колонка ----
    const X = 58 + LW + 20;
    const Wc = 1862 - X;
    const hA = 158;
    s.card({ x: X, y: TOP, w: Wc, h: hA });
    s.label('2026 budget', { x: X + 30, y: TOP + 28, w: Wc - 60, color: C.blue });
    budgetBars(s, [
      { name: 'Скиноклир', value: 417, text: '417 тыс. ₽', color: C.crimson, bold: true },
      { name: 'Базирон АС', value: 188, text: '188 тыс. ₽', color: MUTED },
    ], { x: X + 30, y: TOP + 70, w: Wc - 60, nameW: 130, valW: 120 });

    const yB = TOP + hA + 18;
    takeaways(s, [
      'Среди отмониторенных конкурентов наибольший объем digital-инвестиций приходится на Скиноклир — **417 тыс. руб.** в 2026 году. Бренд использует преимущественно **Прессу (67%) и OLV (25%)**, дополняя их небольшим объемом Outdoor',
      'На фоне ограниченного конкурентного digital-давления **Азелик с марта 2026 года опережает Скиноклир** по продажам в рублях. За январь–июль продажи Азелика выросли на **+31% год к году**',
      'Базирон АС — второй отмониторенный конкурент: в 2026 году его digital-поддержка **полностью сосредоточена в OLV** (15+ площадок, включая rutube.ru, mediavitrina.ru, dzen.ru, ctc.ru), при этом общий объем инвестиций существенно ниже Скиноклира — **188 тыс. руб.**',
    ], { x: X, y: yB, w: Wc, h: BOT - yB, max: 18, min: 15 });

    s.footnote('Источник: Mediascope, IQVIA. По данным Mediascope, в 2026 году digital-размещения удалось отмониторить только у двух конкурентов — Скиноклира и Базирона АС. Отсутствие других брендов в мониторинге не означает отсутствие их активности', { w: 1730 });
  },

  // ===================== 12. Basiron AC / TV activity =====================
  12: (d) => {
    // подзаголовок исходника не помещался в 2 строки: вторая половина («гипотеза в том, что…») — вывод слайда, вынесена в плашку
    const s = d.slide({
      title: 'Basiron AC / TV activity',
      subtitle: 'Конкурент активно размещался на ТВ с роликом с достаточно запоминающимся слоганом в период 2009–2021 гг.',
    });
    const [tvC, lenC, chC] = charts(12).map((c) => c.plots[0]);
    const years = tvC.cats;                          // 2009 … 2021
    const NY = years.length;
    const OTHER = 'B9C6D6';
    const S = [
      { key: 'нет прыщей', name: '«нет прыщей на лице»', series: '«Нет прыщей на лице» — ТВ-инвестиции, млн ₽', color: C.crimson, ink: C.white },
      { key: 'от прыщей', name: '«от прыщей на лице»', series: '«От прыщей на лице» — ТВ-инвестиции, млн ₽', color: C.blue, ink: C.white },
      { key: 'другое', name: 'другое', series: 'Другое — ТВ-инвестиции, млн ₽', color: OTHER, ink: C.navy },
    ];
    const tv = S.map((sr) => pick(tvC.series, sr.key).map((v) => (v == null ? 0 : v / 1e6)));
    const tot = years.map((_, i) => tv.reduce((a, sr) => a + sr[i], 0));

    // ---- карточка A: динамика ТВ-инвестиций + два ролика ----
    const LW = 1330;
    const CA = { x: 58, y: TOP, w: LW, h: 372 };
    s.card(CA);
    const LBL = 'Динамика ТВ-инвестиций';
    s.label(LBL, { x: 94, y: 249, w: lw(LBL), color: C.blue });
    s.text('млн ₽', { x: 94 + lw(LBL) + 12, y: 251, w: 120, size: 17, color: C.blueText });
    legendRow(s, S.map((sr) => [sr.color, sr.name]), { x1: CA.x + CA.w - 30, y: 249, size: 17, gap: 26 });
    const P = { x: 100, y: 300, w: 1260, h: 246 };
    const MAX = 230;
    const mt = s.chart('col', S.map((sr, k) => ({ name: sr.series, labels: years, values: tv[k].map((v) => +v.toFixed(2)) })),
      { x: P.x - 10, y: P.y - 10, w: P.w + 20, h: P.h + 20, plot: P, min: 0, max: MAX, stacked: true, gap: 50,
        colors: S.map((sr) => sr.color), legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
    const stepY = P.w / NY;
    const barW = stepY / 1.5;
    years.forEach((yr, i) => {
      s.text(f1(tot[i]), { x: mt.cat(i) - stepY / 2, y: mt.val(tot[i]) - 22, w: stepY, size: 15, bold: true, color: C.navy, align: 'center' });
      // значения внутри столбца — где в году больше одного сегмента от 0,5 млн ₽ (2016 — смена креатива; 2013, 2014, 2017, 2020 — есть «другое»)
      const segs = tv.map((sr) => sr[i]).filter((v) => v >= 0.5).length;
      if (segs > 1) {
        let cum = 0;
        tv.forEach((sr, k) => {
          const v = sr[i];
          const hpx = (v / MAX) * P.h;
          const yc = mt.val(cum + v / 2);
          cum += v;
          if (hpx >= 24) s.text(f1(v), { x: mt.cat(i) - barW / 2 - 6, y: yc - 9, w: barW + 12, size: 14, bold: true, color: S[k].ink, align: 'center' });
        });
      }
      s.text(String(yr), { x: mt.cat(i) - stepY / 2, y: P.y + P.h + 6, w: stepY, size: 15, color: C.blueText, align: 'center' });
    });
    s.seg(P.x, P.y + P.h, P.x + P.w, P.y + P.h, { color: C.line, width: 1.5 });
    // смена креатива: граница 2015 | 2016
    const xB = mt.cat(7) - stepY / 2;
    s.seg(xB, 326, xB, P.y + P.h, { color: C.navy, width: 1.5, dash: 'dash' });
    s.text('← смена креатива →', { x: xB - 110, y: 300, w: 220, size: 16, bold: true, color: C.navy, align: 'center' });
    // ролики: старый креатив — над низкими столбцами 2009–2011, новый — над 2020–2021 (обрезка кадра как в исходнике)
    const VW = 206;
    // пропорция видимого кадра = 352 / (288 · (1 − (t + b) / 100000))
    const v1h = VW * 288 * (1 - (10983 + 13399) / 100000) / 352;
    const v2h = VW * 288 * (1 - (13351 + 12182) / 100000) / 352;
    const v1x = P.x + 6;
    const v2x = CA.x + CA.w - 26 - VW;
    A.video(s, { media: 'media1.mp4', cover: 'image39.png', x: v1x, y: 300, w: VW, h: v1h, name: 'Базирон АС — ролик «нет прыщей на лице»', crop: { t: 10983, b: 13399 } });
    A.video(s, { media: 'media2.mp4', cover: 'image40.png', x: v2x, y: 300, w: VW, h: v2h, name: 'Базирон АС — ролик «от прыщей на лице»', crop: { t: 13351, b: 12182 } });
    const cap = (t, x, color, align) => {
      s.icon('tb:TbPlayerPlayFilled', { x: align === 'right' ? x - 26 : x, y: 302, size: 26, color: C.white, circle: color });
      s.text(t, { x: align === 'right' ? x - 26 - 8 - 230 : x + 34, y: 303, w: 230, size: 16, bold: true, color, align });
    };
    cap('«нет прыщей на лице»', v1x + VW + 14, C.crimson, 'left');
    cap('«от прыщей на лице»', v2x - 14, C.blue, 'right');

    // ---- две нижние карточки: длина роликов и каналы (100%) ----
    const yR2 = CA.y + CA.h + 18;
    const hR2 = 905 - yR2;
    const halfW = (LW - 20) / 2;
    // высота легенды с переносом (как в legendWrap) — у обеих карточек общая, чтобы графики стояли на одной линии
    const wrapH = (items) => {
      let lx = 0;
      let rows = 1;
      items.forEach(([, t]) => { const w = 14 + 7 + tw(t, 14, false); if (lx > 0 && lx + w > halfW - 60) { lx = 0; rows++; } lx += w + 16; });
      return rows * 21;
    };
    let LGH = 0;
    const mix100 = (o) => {
      const { x, label, plot, legendItems, series, colors, inks, minLabel = 0.12 } = o;
      s.card({ x, y: yR2, w: halfW, h: hR2 });
      s.label(label, { x: x + 30, y: yR2 + 22, w: lw(label), color: C.blue });
      const lh = Math.max(LGH, legendWrap(s, legendItems, { x: x + 30, y: yR2 + 58, maxW: halfW - 60, size: 14, gap: 16, rowH: 21 }));
      const PL = { x: x + 30, y: yR2 + 58 + lh + 8, w: halfW - 60, h: hR2 - (58 + lh + 8) - 40 };
      const ml = s.chart('col', series.map((sr) => ({ name: sr.name, labels: years, values: sr.values.map((v) => +(v || 0).toFixed(4)) })),
        { x: PL.x - 6, y: PL.y - 6, w: PL.w + 12, h: PL.h + 12, plot: PL, min: 0, max: 1, percent: true, gap: 18,
          colors, legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
      const st = PL.w / NY;
      years.forEach((yr, i) => {
        let cum = 0;
        const tot1 = series.reduce((a, sr) => a + (sr.values[i] || 0), 0) || 1;
        series.forEach((sr, k) => {
          const v = (sr.values[i] || 0) / tot1;
          const yc = PL.y + PL.h * (1 - (cum + v / 2));
          cum += v;
          if (v >= minLabel) s.text(`${Math.round(v * 100)}%`, { x: ml.cat(i) - st / 2, y: yc - 8, w: st, size: 13, bold: true, color: inks[k], align: 'center' });
        });
        s.text(String(yr), { x: ml.cat(i) - st / 2 - 4, y: PL.y + PL.h + 6, w: st + 8, size: 14, color: C.blueText, align: 'center' });
      });
    };
    // длина роликов: 10" — основной синий, 15" — малиновый (рост после 2016), 20" — голубой, остальное приглушено
    const LEN = [
      { key: "5''", name: '5"', color: 'C9D6E6', ink: C.navy },
      { key: "10''", name: '10"', color: C.blue, ink: C.white },
      { key: "15''", name: '15"', color: C.crimson, ink: C.white },
      { key: "20''", name: '20"', color: C.cyan, ink: C.navy },
      { key: "25''", name: '25"', color: '7F95B5', ink: C.white },
      { key: 'спонсор', name: 'Спонсорство', color: 'B9C6D6', ink: C.navy },
    ];
    // каналы: ТНТ, СТС и Пятница (о них Key takeaways) — цветом, остальные — оттенками серо-синего
    const CHN = [
      { key: 'тнт', name: 'ТНТ', color: C.blue, ink: C.white },
      { key: 'стс', name: 'СТС', color: C.crimson, ink: C.white, exact: 'Стс' },
      { key: 'пятница', name: 'Пятница', color: C.cyan, ink: C.navy },
      { key: 'ю', name: 'Ю', color: '5C7BA6', ink: C.white, exact: 'Ю' },
      { key: 'солнце', name: 'Солнце', color: '8DA3C2', ink: C.white },
      { key: 'первый', name: 'Первый канал', color: 'A9BBD3', ink: C.navy },
      { key: '2x2', name: '2х2', color: 'C3D0E2', ink: C.navy },
      { key: 'love', name: 'СТС Love', color: 'F4A3B6', ink: C.navy },
      { key: 'другие', name: 'Другие', color: 'DCE4EE', ink: C.navy },
    ];
    const chVals = (c) => (c.exact ? chC.series.find((sr) => sr.name === c.exact) : chC.series.find((sr) => sr.name.toLowerCase().includes(c.key))).values;
    LGH = Math.max(wrapH(LEN.map((l) => [l.color, l.name])), wrapH(CHN.map((c) => [c.color, c.name])));
    mix100({ x: 58, label: 'Длина роликов',
      legendItems: LEN.map((l) => [l.color, l.name]),
      series: LEN.map((l) => ({ name: l.name, values: pick(lenC.series, l.key.toLowerCase()) })),
      colors: LEN.map((l) => l.color), inks: LEN.map((l) => l.ink) });
    mix100({ x: 58 + halfW + 20, label: 'Каналы',
      legendItems: CHN.map((c) => [c.color, c.name]),
      series: CHN.map((c) => ({ name: c.name, values: chVals(c) })),
      colors: CHN.map((c) => c.color), inks: CHN.map((c) => c.ink) });

    // ---- правая колонка: бюджет и выводы ----
    const X = 58 + LW + 20;
    const Wc = 1862 - X;
    const hS = 150;
    s.box({ x: X, y: TOP, w: Wc, h: hS, fill: C.blue });
    s.text([{ text: '1 303', options: {} }, { text: ' млн ₽', options: { fontSize: PT(30) } }], { x: X + 28, y: TOP + 18, w: Wc - 56, size: 56, bold: true, lh: 1.1, color: C.white });
    s.text('2009–2021 total TV budget', { x: X + 28, y: TOP + 92, w: Wc - 56, size: 19, bold: true, color: C.white });
    s.text('Basiron AC', { x: X + 28, y: TOP + 117, w: Wc - 56, size: 16, color: C.white });

    const yK = TOP + hS + 18;
    const hK = 905 - yK;
    s.card({ x: X, y: yK, w: Wc, h: hK });
    s.label('Key takeaways', { x: X + 30, y: yK + 28, w: Wc - 60, color: C.crimson });
    const KT = [
      ['2009', C.crimson, 'Запуск кампании **«нет прыщей на лице»**. Фокус на 10" и 20" ролики, высокая доля канала ТНТ в миксе. Присутствие на ТВ близко к always on'],
      ['2016', C.blue, 'Смена креатива и слогана на **«от прыщей на лице»**. Снижение доли 10" роликов в миксе, рост доли 15" версий. Сокращение доли ТНТ в миксе с 2018, рост доли СТС и Пятницы'],
    ];
    let ky = yK + 72;
    KT.forEach(([yr, color, t]) => {
      s.box({ x: X + 30, y: ky, w: 74, h: 32, fill: color, r: 8 });
      s.text(yr, { x: X + 30, y: ky + 4, w: 74, size: 19, bold: true, color: C.white, align: 'center' });
      ky += 46;
      ky += s.text(t, { x: X + 30, y: ky, w: Wc - 60, size: 20, lh: 1.25, color: C.navy }) + 34;
    });
    if (ky - 30 > yK + hK - 16) s.warn('takeaways', 'Basiron', 'текст выходит за карточку');

    s.principle({ label: 'Гипотеза', icon: 'bulb', text: 'Здесь продолжает работать накопленный эффект, сформированный за счет масштабной ТВ-поддержки' });
    s.footnote('Источник: Mediascope');
  },

  // ===================== 13. Digital compete — азелаиновая кислота =====================
  13: (d) => {
    const s = d.slide({
      title: 'Azelik / Digital compete — Azelaic acid',
      subtitle: 'Высокий уровень инвестиций поддерживает лидерство Азелика, однако сближение уровня продаж со Скиноклиром требует усилить не только создание, но и перехват сформированного спроса',
    });
    const all = charts(13);
    const salesC = all.find((c) => c.type === 'COLUMN_CLUSTERED');
    const budP = all.find((c) => c.type === 'LINE_MARKERS').plots[0];
    const splitP = all.find((c) => c.type === 'BAR_STACKED_100').plots[0];
    const B = [
      { key: 'azelik', name: 'Азелик', color: C.blue, ink: C.white, sales: 'Азелик — продажи, млн ₽', share: 'Азелик — доля продаж, %', site: 'azelik.ru' },
      { key: 'skinoklir', name: 'Скиноклир', color: C.crimson, ink: C.white, sales: 'Скиноклир — продажи, млн ₽', share: 'Скиноклир — доля продаж, %', site: 'skinoklir.ru' },
      { key: 'skinoren', name: 'Скинорен', color: MUTED, ink: C.navy, sales: 'Скинорен — продажи, млн ₽', share: 'Скинорен — доля продаж, %', site: 'skinoren.ru' },
    ];
    const barP = salesC.plots.find((p) => p.type === 'BarPlot').series;
    const lineP = salesC.plots.find((p) => p.type === 'LinePlot').series;
    const sales = B.map((b) => pick(barP, b.key));                          // млн ₽, янв 2025 – июл 2026
    const share = B.map((b) => pick(lineP, b.key).map((v) => v * 100));     // доля продаж, %
    const budget = B.map((b) => pick(budP.series, b.key));                  // digital-бюджет, млн ₽
    const N = 19;
    const cats = Array.from({ length: N }, (_, i) => ({ m: i % 12, y: i < 12 ? 2025 : 2026 }));
    const labels = cats.map((c) => `${MONTHS[c.m]} ${c.y}`);

    // ---- левая карточка: доля, продажи, digital-бюджет на общей оси месяцев ----
    const LW = 1300;
    const CA = { x: 58, y: TOP, w: LW, h: 584 };
    s.card(CA);
    const LBL = 'Динамика инвестиций в digital-медиа и продаж';
    s.label(LBL, { x: 94, y: 249, w: lw(LBL), color: C.blue });
    const X0 = 240;
    const X1 = CA.x + CA.w - 28;
    legendRow(s, B.map((b) => [b.color, b.name]), { x1: X1, y: 249, size: 17, gap: 26 });
    const step = (X1 - X0) / N;
    const m = chartMap('col', N, { x: X0, w: step * N, y: 0, h: 1 }, 0, 1);
    const NAME_X = 94;
    const xYear = m.cat(12) - step / 2;

    // ряд 1: доля продаж, % — линии Азелика и Скиноклира (подпись большего — над точкой, меньшего — под), Скинорен — строкой
    const t1 = 'Доля продаж, %';
    s.text(t1, { x: NAME_X, y: 290, w: 300, size: 17, bold: true, color: C.navy });
    s.badge({ x: NAME_X + tw(t1, 17, true) + 12, y: 290, d: 22, n: 2, color: C.crimson, size: 13 });
    const P1 = { x: X0, w: step * N, y: 334, h: 70 };
    const m1 = s.chart('line', B.slice(0, 2).map((b, k) => ({ name: b.share, labels, values: share[k].map((v) => +v.toFixed(1)) })),
      { x: P1.x - 16, y: P1.y - 12, w: P1.w + 32, h: P1.h + 24, plot: P1, min: 34, max: 56, values: false, legend: false,
        colors: [C.blue, C.crimson], lineSize: 2.5, symbolSize: 7, extra: { catAxisHidden: true, catAxisLineShow: false } });
    for (let i = 0; i < N; i++) {
      const a = share[0][i];
      const b = share[1][i];
      const hiA = a >= b;
      [[a, 0, hiA], [b, 1, !hiA]].forEach(([v, k, hi]) => {
        const y = hi ? m1.val(v) - 22 : m1.val(v) + 5;
        s.text(`${Math.round(v)}%`, { x: m1.cat(i) - 30, y, w: 60, size: 14, bold: k === 0, color: k === 0 ? C.navy : C.crimson, align: 'center' });
      });
    }
    const RS = 21;
    let y = 430;
    rowName(s, B[2], NAME_X + 20, y, X0 - NAME_X - 24, { size: 14 });
    share[2].forEach((v, i) => s.text(f1(v), { x: m.cat(i) - step / 2, y: y + 1, w: step, size: 14, color: C.blueText, align: 'center' }));

    // ряд 2: продажи, млн ₽ — накопленные столбцы с подписями в сегментах; Скинорен — строкой
    y = 462;
    s.text('Продажи, млн ₽', { x: NAME_X, y, w: 300, size: 17, bold: true, color: C.navy });
    const P2 = { x: X0, w: step * N, y: 470, h: 118 };
    const SMAX = 250;
    const m2 = s.chart('col', B.map((b, k) => ({ name: b.sales, labels, values: sales[k].map((v) => +v.toFixed(2)) })),
      { x: P2.x - 10, y: P2.y - 10, w: P2.w + 20, h: P2.h + 20, plot: P2, min: 0, max: SMAX, stacked: true, gap: 26,
        colors: B.map((b) => b.color), legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
    const barW = step / 1.26;
    for (let i = 0; i < N; i++) {
      let cum = 0;
      [0, 1].forEach((k) => {
        const v = sales[k][i];
        const yc = m2.val(cum + v / 2);
        cum += v;
        s.text(f1(v), { x: m2.cat(i) - barW / 2 - 4, y: yc - 9, w: barW + 8, size: 14, bold: k === 0, color: C.white, align: 'center' });
      });
    }
    s.seg(P2.x, P2.y + P2.h, X1, P2.y + P2.h, { color: C.line, width: 1.5 });
    y = P2.y + P2.h + 8;
    rowName(s, B[2], NAME_X + 20, y, X0 - NAME_X - 24, { size: 14 });
    sales[2].forEach((v, i) => s.text(f2(v), { x: m.cat(i) - step / 2, y: y + 1, w: step, size: 14, color: C.blueText, align: 'center' }));

    // ряд 3: digital-бюджет, млн ₽ — тепловая полоса
    const yBU = y + RS + 34;
    const t3 = 'Digital-бюджет, млн ₽';
    s.text(t3, { x: NAME_X, y: yBU - 28, w: 400, size: 17, bold: true, color: C.navy });
    s.badge({ x: NAME_X + tw(t3, 17, true) + 12, y: yBU - 28, d: 22, n: 3, color: C.crimson, size: 13 });
    const RH = 25;
    budget.forEach((vals, k) => {
      const yy = yBU + k * RH;
      rowName(s, B[k], NAME_X, yy + 3, X0 - NAME_X - 4, { bold: k === 0 });
      vals.forEach((v, i) => {
        const hot = (k === 0 && i >= 13 && i <= 15) || (k === 1 && i === 18);   // флайт Азелика фев–апр 2026 и рост Скиноклира в июле 2026 — из Key takeaways
        heatCell(s, { x: m.cat(i) - step / 2, y: yy, w: step, h: RH, v, vmax: 6, color: B[k].color, text: f2(v), bold: k === 0, hot });
      });
    });
    const yEnd = yBU + 3 * RH;
    s.seg(xYear, 300, xYear, yEnd + 4, { color: C.line, width: 1.5, dash: 'dash' });
    monthAxis(s, m, step, cats, yEnd + 8);

    // ---- левая нижняя карточка: доля инвестиций по каналам ----
    const CB = { x: 58, y: CA.y + CA.h + 18, w: LW, h: BOT - (CA.y + CA.h + 18) };
    channelSplit(s, splitP, B, { box: CB, nameX: NAME_X, x0: X0, x1: X1, mark: { 0: 1, 1: 1 } });

    // ---- правая колонка ----
    const X = 58 + LW + 20;
    const Wc = 1862 - X;
    const hA = 212;
    s.card({ x: X, y: TOP, w: Wc, h: hA });
    s.label('Digital budgets*', { x: X + 30, y: TOP + 28, w: Wc - 60, color: C.blue });
    budgetBars(s, [
      { name: 'Азелик', value: 67, text: '67 млн ₽', color: C.blue, bold: true },
      { name: 'Скиноклир', value: 41, text: '41 млн ₽', color: C.crimson },
      { name: 'Скинорен', value: 3.6, text: '3,6 млн ₽', color: MUTED },
    ], { x: X + 30, y: TOP + 68, w: Wc - 60, nameW: 120, valW: 110, pitch: 37 });
    s.text('Estimated by DigitalBudget x agency OMD', { x: X + 30, y: TOP + hA - 34, w: Wc - 60, size: 14, color: C.blueText });

    const yB = TOP + hA + 18;
    takeaways(s, [
      'Азелик **доминирует по объему инвестиций** и строит коммуникацию преимущественно через охватные форматы. Скиноклир же инвестирует значительно меньше, но использует **более сбалансированный микс** с высокой ролью Search и Social',
      'Преимущество Азелика в инвестициях остается значительным, однако **рост активности Скиноклира и сокращение разрыва в продажах** усиливают необходимость не только создавать спрос, но и эффективнее перехватывать его ближе к покупке',
      'В 2026 году Азелик сформировал выраженный **инвестиционный флайт в феврале–апреле**, тогда как Скиноклир до июля поддерживал значительно более низкий уровень активности. При этом **в июле Скиноклир резко усиливает инвестиции**, что важно учитывать как потенциальное усиление конкурентного давления во втором полугодии. Скинорен остается практически неактивным в Digital и сохраняет долю продаж менее 1%',
    ], { x: X, y: yB, w: Wc, h: BOT - yB, max: 17, min: 15, gap: 14 });

    s.footnote('Источник: DigitalBudget, IQVIA. Digital-бюджет — Estimated by DigitalBudget x agency OMD; доля инвестиций по каналам — Estimated by DigitalBudget, not all channels accepted to monitoring. * Январь 2025 – июль 2026 (сумма помесячных данных)', { w: 1730 });
  },

  // ===================== 14. Digital compete — другие молекулы =====================
  14: (d) => {
    // подзаголовок исходника не помещался в 2 строки: его вторая часть почти дословно повторяет Key takeaway 2;
    // в шапке — общий тезис, конкретика про Базирон и Метрогил — подписями на графике у своих данных (с меткой 2)
    const s = d.slide({
      title: 'Azelik / Digital compete — Other competing molecules',
      subtitle: 'Азелик сохраняет лидерство по масштабу digital-инвестиций, однако конкуренты используют разные модели поддержки',
    });
    const all = charts(14);
    const salesC = all.find((c) => c.type === 'COLUMN_CLUSTERED');
    const splitP = all.find((c) => c.type === 'BAR_STACKED_100').plots[0];
    const B = [
      { key: 'azelik', name: 'Азелик', color: C.blue, ink: C.white, sales: 'Азелик — продажи, млн ₽', site: 'azelik.ru' },
      { key: 'basiron', name: 'Базирон', color: C.crimson, ink: C.white, sales: 'Базирон — продажи, млн ₽', site: 'basiron.ru' },
      { key: 'metrogil', name: 'Метрогил', color: MUTED, ink: C.navy, sales: 'Метрогил — продажи, млн ₽', site: 'метрогил.рф' },
      { key: 'zyneryt', name: 'Зинерит', color: MUTED2, ink: C.navy, sales: 'Зинерит — продажи, млн ₽', site: 'zineryt.ru' },
    ];
    const barP = salesC.plots.find((p) => p.type === 'BarPlot').series;
    const lineP = salesC.plots.find((p) => p.type === 'LinePlot').series;
    const sales = B.map((b) => pick(barP, b.key));
    const share = B.map((b) => pick(lineP, b.key).map((v) => v * 100));
    const N = 19;
    const cats = Array.from({ length: N }, (_, i) => ({ m: i % 12, y: i < 12 ? 2025 : 2026 }));
    const labels = cats.map((c) => `${MONTHS[c.m]} ${c.y}`);

    const LW = 1300;
    const CA = { x: 58, y: TOP, w: LW, h: 548 };
    s.card(CA);
    const LBL = 'Динамика инвестиций в digital-медиа и продаж';
    s.label(LBL, { x: 94, y: 249, w: lw(LBL), color: C.blue });
    const X0 = 240;
    const X1 = CA.x + CA.w - 28;
    legendRow(s, B.map((b) => [b.color, b.name]), { x1: X1, y: 249, size: 17, gap: 24 });
    const step = (X1 - X0) / N;
    const m = chartMap('col', N, { x: X0, w: step * N, y: 0, h: 1 }, 0, 1);
    const NAME_X = 94;
    const xYear = m.cat(12) - step / 2;

    // ряд 1: доля продаж, % — строки чисел (значения в исходнике округлены до целых)
    const t1 = 'Доля продаж, %';
    s.text(t1, { x: NAME_X, y: 290, w: 300, size: 17, bold: true, color: C.navy });
    s.badge({ x: NAME_X + tw(t1, 17, true) + 12, y: 290, d: 22, n: 1, color: C.crimson, size: 13 });
    const RS = 22;
    const yS = 318;
    s.box({ x: X0, y: yS, w: step * N, h: RS, fill: C.cardTint, r: 4 });
    share.forEach((vals, k) => {
      const yy = yS + k * RS;
      rowName(s, B[k], NAME_X, yy + 1, X0 - NAME_X - 4, { bold: k === 0 });
      vals.forEach((v, i) => s.text(`${Math.round(v)}`, { x: m.cat(i) - step / 2, y: yy + 2, w: step, size: 14, bold: k === 0,
        color: k === 0 ? C.navy : C.blueText, align: 'center' }));
    });

    // ряд 2: продажи, млн ₽ — накопленные столбцы; Азелик и Базирон подписаны в сегментах, Метрогил и Зинерит — строками
    const yT = yS + 4 * RS + 22;
    const t2 = 'Продажи, млн ₽';
    s.text(t2, { x: NAME_X, y: yT, w: 300, size: 17, bold: true, color: C.navy });
    const cx = NAME_X + tw(t2, 17, true) + 24;
    s.badge({ x: cx, y: yT, d: 22, n: 2, color: C.crimson, size: 13 });
    s.text('Базирон демонстрирует сопоставимый уровень продаж при значительно меньшем объеме digital-инвестиций', { x: cx + 32, y: yT + 1, w: X1 - cx - 32, size: 16, bold: true, color: C.crimson, fit: true, maxLines: 1, minSize: 14 });
    const P2 = { x: X0, w: step * N, y: yT + 34, h: 168 };
    const m2 = s.chart('col', B.map((b, k) => ({ name: b.sales, labels, values: sales[k].map((v) => +v.toFixed(2)) })),
      { x: P2.x - 10, y: P2.y - 10, w: P2.w + 20, h: P2.h + 20, plot: P2, min: 0, max: 300, stacked: true, gap: 26,
        colors: B.map((b) => b.color), legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
    const barW = step / 1.26;
    for (let i = 0; i < N; i++) {
      let cum = 0;
      [0, 1].forEach((k) => {
        const v = sales[k][i];
        const yc = m2.val(cum + v / 2);
        cum += v;
        s.text(f1(v), { x: m2.cat(i) - barW / 2 - 4, y: yc - 9, w: barW + 8, size: 14, bold: k === 0, color: C.white, align: 'center' });
      });
    }
    s.seg(P2.x, P2.y + P2.h, X1, P2.y + P2.h, { color: C.line, width: 1.5 });
    let y = P2.y + P2.h + 8;
    [2, 3].forEach((k) => {
      rowName(s, B[k], NAME_X, y, X0 - NAME_X - 4);
      sales[k].forEach((v, i) => s.text(v < 1 ? f2(v) : f1(v), { x: m.cat(i) - step / 2, y: y + 1, w: step, size: 14, color: C.blueText, align: 'center' }));
      y += RS;
    });
    s.seg(xYear, yS - 6, xYear, yS + 4 * RS + 4, { color: C.line, width: 1.5, dash: 'dash' });
    s.seg(xYear, P2.y - 8, xYear, y + 2, { color: C.line, width: 1.5, dash: 'dash' });
    monthAxis(s, m, step, cats, y + 6);

    // ---- доля инвестиций по каналам ----
    const CB = { x: 58, y: CA.y + CA.h + 18, w: LW, h: BOT - (CA.y + CA.h + 18) };
    channelSplit(s, splitP, B, { box: CB, nameX: NAME_X, x0: X0, x1: X1, mark: { 2: 2 },
      note: { row: 2, text: 'Метрогил использует более диверсифицированный медиамикс с Search и Social' } });

    // ---- правая колонка ----
    const X = 58 + LW + 20;
    const Wc = 1862 - X;
    const hA = 264;
    s.card({ x: X, y: TOP, w: Wc, h: hA });
    s.label('Digital budgets', { x: X + 30, y: TOP + 28, w: Wc - 60, color: C.blue });
    budgetBars(s, [
      { name: 'Азелик', value: 67, text: '67 млн ₽', color: C.blue, bold: true },
      { name: 'Базирон', value: 3.8, text: '3,8 млн ₽', color: C.crimson },
      { name: 'Метрогил', value: 16.7, text: '16,7 млн ₽', color: MUTED },
      { name: 'Зинерит', value: 1.4, text: '1,4 млн ₽', color: MUTED2 },
    ], { x: X + 30, y: TOP + 70, w: Wc - 60, nameW: 120, valW: 120 });
    s.text('Estimated by DigitalBudget x agency OMD', { x: X + 30, y: TOP + hA - 34, w: Wc - 60, size: 14, color: C.blueText });

    const yB = TOP + hA + 18;
    takeaways(s, [
      'Азелик сохраняет сильные позиции в категории: в 2026 году продажи растут, а **доля бренда увеличивается до 11%**. Digital-поддержка преимущественно направлена на масштабное формирование контакта с аудиторией за счет охватных форматов',
      'Конкуренты используют **разные модели digital-поддержки**: Базирон работает при значительно меньшем объеме инвестиций, тогда как Метрогил использует более диверсифицированный медиамикс с привлечением Search и Social',
      'При сохранении лидерства по инвестициям ключевая задача Азелика — **повысить эффективность перехода от знания к выбору**: дополнить масштабную охватную поддержку инструментами, которые помогают конвертировать сформированный спрос в покупку',
    ], { x: X, y: yB, w: Wc, h: BOT - yB, max: 18, min: 15 });

    s.footnote('Источник: DigitalBudget, IQVIA. Доля инвестиций по каналам — Estimated by DigitalBudget, not all channels accepted to monitoring', { w: 1730 });
  },

  // ===================== 15. Competitive Analysis / Creative =====================
  15: (d) => {
    const s = d.slide({
      title: 'Competitive Analysis / Creative',
      subtitle: 'В отмониторенных размещениях Скиноклира и Базирона зафиксированы e-com, OLV и блогерские интеграции',
    });
    const img = (file, x, y, w, h, alt) => s.image(path.join(MEDIA, file), { x, y, w, h, alt });
    const PAD = 30;
    const G = 16;
    // заголовок блока: иконка + жирное название + пояснение (в строку, если помещается, иначе ниже); возвращает высоту
    const head = (icon, title, desc, x, y, w, { inline = true } = {}) => {
      s.icon(icon, { x, y: y - 1, size: 28, color: C.white, circle: C.crimson });
      const tx = x + 38;
      const tsz = 21;
      const tW = tw(title, tsz, true);
      s.text(title, { x: tx, y, w: Math.min(w - 38, tW + 8), size: tsz, bold: true, color: C.navy });
      if (!desc) return 30;
      if (inline && tx + tW + 14 + tw(desc, 17, false) <= x + w) {
        s.text(desc, { x: tx + tW + 14, y: y + 3, w: x + w - (tx + tW + 14), size: 17, color: C.blueText });
        return 30;
      }
      const h = s.text(desc, { x: tx, y: y + 30, w: w - 38, size: 17, color: C.blueText });
      return 30 + h + 2;
    };

    // ---- Скиноклир ----
    const KW = 944;
    const KX = 58;
    s.card({ x: KX, y: TOP, w: KW, h: BOT - TOP });
    s.label('Скиноклир', { x: KX + PAD, y: TOP + 26, w: 400, color: C.blue });
    const ix = KX + PAD;
    const iw = KW - 2 * PAD;
    // OLV: 4 ролика в ряд — три 16:9 и один вертикальный 4:5 (пропорции файлов, без обрезки)
    let y = TOP + 70;
    y += head('tb:TbPlayerPlayFilled', 'OLV-кампания', 'с креативами для женской ЦА, ведущая на брендовую посадочную', ix, y, iw) + 14;
    const VH = (iw - 3 * G) / (3 * 16 / 9 + 360 / 450);
    const vids = [
      { media: 'media6.mp4', cover: 'image47.png', r: 854 / 480, name: 'Скиноклир — OLV-ролик 1' },
      { media: 'media7.mp4', cover: 'image48.png', r: 1920 / 1080, name: 'Скиноклир — OLV-ролик 2' },
      { media: 'media4.mp4', cover: 'image43.png', r: 640 / 360, name: 'Скиноклир — OLV-ролик 3' },
      { media: 'media5.mp4', cover: 'image44.png', r: 360 / 450, name: 'Скиноклир — OLV-ролик 4' },
    ];
    let vx = ix;
    vids.forEach((v) => {
      A.video(s, { media: v.media, cover: v.cover, x: vx, y, w: VH * v.r, h: VH, name: v.name });
      vx += VH * v.r + G;
    });
    y += VH + 34;
    // Telegram: три поста в бьюти-каналах со ссылками
    y += head('tb:TbBrandTelegram', 'Telegram', 'посевы в бьюти-каналах', ix, y, iw) + 14;
    const posts = [
      { file: 'img_9d6ca82b54.png', r: 754 / 1354, url: 'https://t.me/beauty_giid/6969' },
      { file: 'img_db7dd7b26a.png', r: 758 / 1366, url: 'https://t.me/bazabeautykov/6101' },
      { file: 'img_4170662d9c.png', r: 756 / 1112, url: 'https://t.me/kadigrob/12384' },
    ];
    const PH = BOT - PAD - 22 - y;
    const PG = 34;
    let px = ix;
    posts.forEach((p) => {
      const w = PH * p.r;
      img(p.file, px, y, w, PH, 'Скиноклир — пост в Telegram');
      s.text(p.url, { x: px, y: y + PH + 5, w: w + PG - 4, size: 13, color: C.blueText });
      px += w + PG;
    });

    // ---- Базирон АС ----
    const BX = KX + KW + 20;
    const BW = 1862 - BX;
    s.card({ x: BX, y: TOP, w: BW, h: BOT - TOP });
    s.label('Базирон АС', { x: BX + PAD, y: TOP + 26, w: 400, color: C.blue });
    const bx = BX + PAD;
    const bw = BW - 2 * PAD;
    // ряд 1: OLV-ролик 16:9 + co-promo в TG с Ригла
    const R1 = { v: 16 / 9, tg: 2188 / 1564 };
    const H1 = (bw - G) / (R1.v + R1.tg);
    const R2 = { z: 620 / 290, a: 1 };
    const H2 = (bw - G) / (R2.z + R2.a);
    // вертикальный запас карточки делим поровну между рядами
    const head1 = 34;
    const head2 = 30 + 2 * 17 * 1.2 + 6;
    const free = (BOT - PAD) - (TOP + 70) - head1 - H1 - head2 - H2;
    const gapR = Math.max(24, Math.min(90, free));
    let by = TOP + 70;
    const w1 = H1 * R1.v;
    head('tb:TbPlayerPlayFilled', 'OLV-кампания', null, bx, by, w1);
    head('tb:TbBrandTelegram', 'Co-promo в TG с Ригла', null, bx + w1 + G, by, bw - w1 - G);
    by += head1 + 10;
    A.video(s, { media: 'media3.mp4', cover: 'image42.png', x: bx, y: by, w: w1, h: H1, name: 'Базирон АС — OLV-ролик' });
    img('img_eb797c78a7.png', bx + w1 + G, by, H1 * R1.tg, H1, 'Базирон АС — co-promo в Telegram с Ригла');
    by += H1 + gapR - 10;
    // ряд 2: Zdravcity и Apteka.ru
    const wz = H2 * R2.z;
    const wa = H2 * R2.a;
    const site = (name, desc, x, w) => {
      s.icon('tb:TbShoppingCart', { x, y: by - 1, size: 28, color: C.white, circle: C.crimson });
      s.text(name, { x: x + 38, y: by, w: w - 38, size: 21, bold: true, color: C.navy });
      s.text(desc, { x, y: by + 32, w, h: 2 * 17 * 1.2 + 2, size: 17, color: C.blueText, fit: true, minSize: 15 });
    };
    site('Zdravcity', 'средние баннеры в категории 1 уровня', bx, wz);
    site('Apteka.ru', 'баннер 2 на главной странице', bx + wz + G, wa);
    by += head2;
    img('img_43532cca1f.jpg', bx, by, wz, H2, 'Базирон АС — баннер на Zdravcity');
    img('img_2394bbad9b.png', bx + wz + G, by, wa, H2, 'Базирон АС — баннер на Apteka.ru');

    s.footnote('Источник: WIB 2026');
  },
};
