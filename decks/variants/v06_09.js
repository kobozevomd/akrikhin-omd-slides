// Варианты визуала для слайдов 6, 7, 9 деки Comprehensive (Market Trends: каналы покупок, пол и возраст, маркетплейсы).
// По два варианта на слайд — на выбор. Данные — из json черновика.
const path = require('path');
const { C, chartMap, textWidth, countLines } = require('../../lib/akrikhin');
const { SRC, MUTED, GRID, TOP, BOT, SIDE, MAIN, r1, fmt, chartData, tag, yearAxis, gridY, legend, statTile, numMark } = require('./common');

const avg = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const sgn = (v) => (v > 0 ? '+' : v < 0 ? '−' : '') + fmt(Math.abs(v));       // «+15,8» / «−1,2»
const ty = (y, size) => y - Math.round(size * 0.67);                          // верх текста, чтобы строка встала по центру y
// точка с белой обводкой (видна, даже когда две точки наползают друг на друга)
const dot = (s, x, y, d, fill) => s.circle({ x: x - d / 2, y: y - d / 2, d, fill, stroke: C.white, sw: 2 });

// ===================== Слайд 6: онлайн и офлайн по типам магазинов =====================
const T6 = 'Покупатели совмещают онлайн и офлайн-каналы';
const C6 = [
  'Точки продаж FMCG и фармы сохраняют уверенное преобладание офлайн-покупателей',
  'Несмотря на лидерство e-Commerce в сегменте непродовольственных товаров по объему трат, даже среди 12–64 в количестве покупателей небольшой перевес остается за офлайном',
];
const SRC6 = 'Источник: Mediascope, BrandPulse 2026. Онлайн-покупки пересчитаны от всего населения';
// на слайде 6 значения целые (как в черновике) — берём исходные, без предварительного округления до 0,1
const D6 = require(path.join(SRC, 'slide-06.json')).shapes.find((sh) => sh.t === 'CHART').chart.plots[0];
const FMCG = ['Аптеки', 'Супермаркеты, гипермаркеты', 'Магазины фиксированных цен'];
const EXC = 'Салоны связи';
const ROWS6 = D6.cats.map((c, i) => {
  const n = String(c).trim();
  const on = D6.series[0].values[i];
  const off = D6.series[1].values[i];
  return { n, on, off, gap: off - on, hot: FMCG.includes(n), exc: n === EXC };
});
// непродовольственные (всё, кроме FMCG и фармы): в скольких офлайн-покупателей больше
const NONFOOD = ROWS6.filter((r) => !r.hot);
const NF_OFF = NONFOOD.filter((r) => r.off > r.on).length;
const i0 = (v) => String(Math.round(v));
const row6 = (n) => ROWS6.find((r) => r.n === n);
const BLUE_SOFT = '8DB3DB';     // онлайн у фоновых строк
const RED_SOFT = 'F49DB2';      // офлайн у фоновых строк

function slide6A(d) {
  const s = d.slide({ title: T6 });
  tag(s, 'Вариант 6А · гантели: онлайн и офлайн в одной строке');
  s.card({ x: MAIN.x, y: TOP, w: MAIN.w, h: BOT - TOP });
  s.label('Личная покупка за 6 мес., %', { x: 94, y: 255, w: 900, color: C.blue });
  const rows = [...ROWS6].sort((a, b) => b.gap - a.gap);   // по разрыву офлайн − онлайн
  const x0 = 560;
  const x1 = 1220;
  const vx = (v) => x0 + (x1 - x0) * v / 100;
  const y0 = 352;
  const pitch = (962 - y0) / rows.length;
  const ry = (i) => y0 + pitch * i + pitch / 2;
  // группы: ① FMCG и фарма (подложка малиновая), ② непродовольственные (голубая), салоны связи — отдельно
  const bandX = 78;
  const bandW = MAIN.w - 40;
  const nHot = rows.filter((r) => r.hot).length;
  const iExc = rows.findIndex((r) => r.exc);
  s.box({ x: bandX, y: y0 - 2, w: bandW, h: pitch * nHot + 2, fill: C.crimson, transparency: 92, r: 8 });
  s.box({ x: bandX, y: y0 + pitch * nHot + 4, w: bandW, h: pitch * (iExc - nHot) - 6, fill: C.cardTint, r: 8 });
  // шкала
  [0, 25, 50, 75, 100].forEach((v) => {
    s.seg(vx(v), y0 - 2, vx(v), y0 + pitch * rows.length + 2, { color: GRID, width: 1.25 });
    s.text(v === 100 ? '100%' : String(v), { x: vx(v) - 40, y: y0 + pitch * rows.length + 8, w: 80, size: 15, color: C.blueText, align: 'center' });
  });
  // подписи каналов над первой строкой (вместо легенды)
  const first = rows[0];
  s.text('онлайн', { x: vx(first.on) - 60, y: y0 - 34, w: 120, size: 17, bold: true, color: C.blue, align: 'center' });
  s.text('офлайн', { x: vx(first.off) - 60, y: y0 - 34, w: 120, size: 17, bold: true, color: C.crimson, align: 'center' });
  rows.forEach((r, i) => {
    const y = ry(i);
    const big = r.hot || r.exc;
    const nsz = big ? 18 : 17;
    s.text(r.n, { x: 94, y: ty(y, nsz), w: x0 - 30 - 94, size: nsz, bold: big, color: big ? C.navy : C.blueText, align: 'right' });
    const lo = Math.min(r.on, r.off);
    const hi = Math.max(r.on, r.off);
    s.seg(vx(lo), y, vx(hi), y, { color: r.hot ? 'F5B3C3' : r.exc ? 'A9C9EA' : 'C3D6EC', width: big ? 8 : 4 });
    const dd = big ? 24 : 18;
    dot(s, vx(r.on), y, dd, big ? C.blue : BLUE_SOFT);
    dot(s, vx(r.off), y, dd, big ? C.crimson : RED_SOFT);
    const vsz = big ? 19 : 16;
    const vcol = big ? C.navy : C.blueText;
    s.text(i0(lo), { x: vx(lo) - dd / 2 - 8 - 60, y: ty(y, vsz), w: 60, size: vsz, bold: big, color: vcol, align: 'right' });
    s.text(i0(hi), { x: vx(hi) + dd / 2 + 8, y: ty(y, vsz), w: 60, size: vsz, bold: big, color: vcol });
    const after = vx(hi) + dd / 2 + 8 + textWidth(i0(hi), vsz, big) + 14;
    if (r.hot) s.text(`+${i0(r.gap)} п.п.`, { x: after, y: ty(y, 18), w: 110, size: 18, bold: true, color: C.crimson });
    if (r.exc) s.text('← онлайн выше офлайна', { x: after, y: ty(y, 17), w: 320, size: 17, bold: true, color: C.blue });
  });
  // номера групп — у правого края подложек
  const mx = bandX + bandW - 58;
  numMark(s, mx, y0 + pitch * nHot / 2 - 20, 1, C.crimson);
  numMark(s, mx, y0 + pitch * (nHot + iExc) / 2 - 18, 2, C.navy);

  // справа: цифра FMCG/фармы, два комментария, исключение
  const X = SIDE.x;
  const Wc = SIDE.w;
  const ph = row6('Аптеки');
  const sm = row6('Супермаркеты, гипермаркеты');
  const hT = 196;
  statTile(s, { x: X, y: TOP, w: Wc, h: hT, color: C.crimson, size: 54, value: `${i0(ph.off)}% vs ${i0(ph.on)}%`,
    text: 'аптеки: офлайн vs онлайн', delta: `супермаркеты — ${i0(sm.off)}% vs ${i0(sm.on)}%` });
  let y = TOP + hT + 20;
  [[1, C.crimson, C6[0], 132, true], [2, C.navy, C6[1].replace('среди 12–64', 'среди\n12–64'), 200, false]].forEach(([n, col, t, h, tint]) => {
    s.card({ x: X, y, w: Wc, h, tint });
    numMark(s, X + 22, y + 22, n, col);
    s.text(t, { x: X + 78, y: y + 24, w: Wc - 100, h: h - 44, size: n === 1 ? 18 : 19, lh: 1.22, bold: n === 1, color: C.navy, fit: true, minSize: 16 });
    y += h + 20;
  });
  const ex = row6(EXC);
  statTile(s, { x: X, y, w: Wc, h: BOT - y, color: C.blue, size: 54, value: `${i0(ex.on)}% vs ${i0(ex.off)}%`,
    text: 'салоны связи — единственный тип магазинов, где онлайн-покупателей больше' });
  s.footnote(`${SRC6}. Разрыв офлайн − онлайн — расчёт OMD`, { w: 1080 });
}

function slide6B(d) {
  const s = d.slide({ title: T6, subtitle: C6[0] });
  tag(s, 'Вариант 6Б · «бабочка»: онлайн влево, офлайн вправо');
  s.card({ x: 58, y: TOP, w: 1804, h: BOT - TOP });
  s.label('Личная покупка за 6 мес., %', { x: 94, y: 255, w: 900, color: C.blue });
  const rows = [...ROWS6].sort((a, b) => b.off - a.off);   // по офлайну
  const k = 6.8;                 // px на п.п. — одна шкала для обеих сторон
  const zL = 556;
  const zR = 1024;
  const y0 = 336;
  const pitch = (982 - y0) / rows.length;
  const ry = (i) => y0 + pitch * i + pitch / 2;
  const names = rows.map((r) => r.n);
  s.text('ОНЛАЙН', { x: zL - 300, y: 294, w: 300, size: 20, bold: true, color: C.blue, align: 'right' });
  s.text('ОФЛАЙН', { x: zR, y: 294, w: 300, size: 20, bold: true, color: C.crimson });
  const maxL = 66;
  const maxR = 100;
  const PL = { x: zL - maxL * k, y: y0, w: maxL * k, h: pitch * rows.length };
  const PR = { x: zR, y: y0, w: maxR * k, h: pitch * rows.length };
  s.chart('bar', [{ name: 'Онлайн', labels: names, values: rows.map((r) => r.on) }], {
    x: PL.x - 10, y: y0 - 10, w: PL.w + 20, h: PL.h + 20, plot: PL, min: 0, max: maxL, gap: 42, legend: false, values: false,
    colors: rows.map((r) => (r.hot || r.exc ? C.blue : MUTED)), extra: { catAxisHidden: true, valAxisOrientation: 'maxMin' } });
  s.chart('bar', [{ name: 'Офлайн', labels: names, values: rows.map((r) => r.off) }], {
    x: PR.x - 10, y: y0 - 10, w: PR.w + 20, h: PR.h + 20, plot: PR, min: 0, max: maxR, gap: 42, legend: false, values: false,
    colors: rows.map((r) => (r.hot ? C.crimson : MUTED)), extra: { catAxisHidden: true } });
  s.seg(zL, y0 - 4, zL, y0 + PL.h + 4, { color: C.line, width: 2 });
  s.seg(zR, y0 - 4, zR, y0 + PR.h + 4, { color: C.line, width: 2 });
  rows.forEach((r, i) => {
    const y = ry(i);
    const big = r.hot || r.exc;
    const nsz = big ? 18 : 17;
    s.text(r.n, { x: zL + 8, y: ty(y, nsz), w: zR - zL - 16, size: nsz, bold: big, color: big ? C.navy : C.blueText, align: 'center' });
    const vsz = big ? 19 : 16;
    s.text(i0(r.on), { x: zL - r.on * k - 70, y: ty(y, vsz), w: 60, size: vsz, bold: big, color: big ? C.navy : C.blueText, align: 'right' });
    s.text(i0(r.off), { x: zR + r.off * k + 10, y: ty(y, vsz), w: 60, size: vsz, bold: r.hot, color: r.hot ? C.navy : C.blueText });
    if (r.exc) {
      const ex = zL - r.on * k - 70 + 60 - textWidth(i0(r.on), vsz, true) - 14;
      s.text('онлайн выше офлайна →', { x: ex - 300, y: ty(y, 17), w: 300, size: 17, bold: true, color: C.blue, align: 'right' });
    }
  });
  // свободный угол справа внизу: вывод о непродовольственных + комментарий
  const cx = 1470;
  const iFree = rows.findIndex((r) => zR + r.off * k + 50 < cx - 16);
  const cw = 1862 - 30 - cx;
  const tw = cw - 56;
  const lead = 'непродовольственных типов магазинов: покупателей офлайн больше, чем онлайн';
  const note = C6[1].replace('лидерство e-Commerce', 'лидерство\ne-Commerce').replace('среди 12–64', 'среди\n12–64');
  const leadH = Math.ceil(countLines(lead, 18, tw, true) * 18 * 1.2);
  const noteH = Math.ceil(countLines(note, 19, tw, false) * 19 * 1.22);
  const need = 24 + 60 + 8 + leadH + 36 + noteH + 26;
  const cy = Math.round(Math.max(ry(iFree) - pitch / 2 + 6, 982 - need));
  s.card({ x: cx, y: cy, w: cw, h: 982 - cy, tint: true });
  s.text(`${NF_OFF} из ${NONFOOD.length}`, { x: cx + 28, y: cy + 22, w: tw, size: 54, bold: true, lh: 1.1, color: C.crimson });
  s.text(lead, { x: cx + 28, y: cy + 92, w: tw, size: 18, bold: true, lh: 1.2, color: C.navy });
  s.hline(cx + 28, cy + 92 + leadH + 16, tw);
  s.text(note, { x: cx + 28, y: cy + 92 + leadH + 34, w: tw, h: noteH + 4, size: 19, lh: 1.22, color: C.navy });
  s.footnote(`${SRC6}. «${NF_OFF} из ${NONFOOD.length}» — расчёт OMD`, { w: 1080 });
}

// ===================== Слайд 7: пол и возраст =====================
const T7 = 'Женщины заметно активнее вовлечены в онлайн-покупки';
const C7 = [
  'Особенно активно женщины по сравнению с мужчинами используют маркетплейсы',
  'Также видно, что мужчины чаще дополняют маркетплейсы профильными интернет-магазинами',
];
const SRC7 = 'Источник: Mediascope, CrossWeb, январь–июль 2026 / Ж 12-64';
const D7 = chartData(7);
const AGES = ['12–17', '18–24', '25–34', '35–44', '45–54', '55–64', '65+'];
const TOT = D7.series[0].values;
const MP = D7.series[1].values;
const MEN = { tot: TOT.slice(0, 7), mp: MP.slice(0, 7) };
const WOM = { tot: TOT.slice(7), mp: MP.slice(7) };
const DIFF = AGES.map((_, i) => r1(WOM.mp[i] - MEN.mp[i]));      // Ж − М по маркетплейсам, п.п.
const IMAX = DIFF.indexOf(Math.max(...DIFF));
const POS = DIFF.filter((v) => v > 0);                             // возрасты, где женщин больше (12–64)
const ADD_M0 = avg(MEN.tot.map((v, i) => v - MEN.mp[i]));         // весь e-com − маркетплейсы, среднее по 7 возрастам
const ADD_W0 = avg(WOM.tot.map((v, i) => v - WOM.mp[i]));
const ADD_M = r1(ADD_M0);
const ADD_W = r1(ADD_W0);

function slide7A(d) {
  const s = d.slide({ title: T7 });
  tag(s, 'Вариант 7А · пары М/Ж по возрастам');
  s.card({ x: MAIN.x, y: TOP, w: MAIN.w, h: BOT - TOP });
  s.label('Среднесуточная аудитория маркетплейсов, %', { x: 94, y: 255, w: 900, color: C.blue });
  legend(s, 1010, 252, [[C.blue, 'Мужчины'], [C.crimson, 'Женщины']], { dir: 'row', gap: 165, size: 18 });
  const P = { x: 120, y: 430, w: 1230, h: 490 };
  const m = s.chart('col', [
    { name: 'Мужчины', labels: AGES, values: MEN.mp },
    { name: 'Женщины', labels: AGES, values: WOM.mp },
  ], { x: 100, y: 410, w: 1270, h: 530, plot: P, min: 0, max: 75, colors: [C.blue, C.crimson], gap: 55, overlap: -4, legend: false,
    format: '0.0', labelSize: 17, labelBold: true, extra: { catAxisHidden: true } });
  s.seg(P.x, m.val(0), P.x + P.w, m.val(0), { color: C.line, width: 2 });
  AGES.forEach((a, i) => s.text(a, { x: m.cat(i) - 80, y: m.val(0) + 14, w: 160, size: 20, bold: true, color: C.navy, align: 'center' }));
  // строка разрывов Ж − М над парами
  s.text('Разрыв «женщины − мужчины», п.п.', { x: 94, y: 316, w: 600, size: 16, color: C.blueText });
  DIFF.forEach((v, i) => {
    const w = 118;
    const x = m.cat(i) - w / 2;
    const hero = i === IMAX;
    const neg = v < 0;
    s.box({ x, y: 348, w, h: 40, fill: neg ? C.tint : C.crimson, transparency: hero || neg ? undefined : 82, r: 20 });
    s.text(sgn(v), { x, y: 348, w, h: 40, size: 20, bold: true, color: hero ? C.white : neg ? C.navy : C.crimson, align: 'center', valign: 'middle' });
  });

  // справа: комментарий, максимальный разрыв, «добавка» профильных магазинов
  const X = SIDE.x;
  const Wc = SIDE.w;
  s.card({ x: X, y: TOP, w: Wc, h: 150, tint: true });
  s.text(C7[0], { x: X + 28, y: TOP + 26, w: Wc - 56, h: 100, size: 21, bold: true, lh: 1.2, color: C.navy, fit: true, minSize: 18 });
  statTile(s, { x: X, y: TOP + 170, w: Wc, h: 212, color: C.crimson, value: `+${fmt(DIFF[IMAX])} п.п.`,
    text: `самый большой разрыв — ${AGES[IMAX]} лет: ${fmt(WOM.mp[IMAX])}% женщин против ${fmt(MEN.mp[IMAX])}% мужчин`,
    delta: `в 12–64 — от +${fmt(Math.min(...POS))} до +${fmt(Math.max(...POS))} п.п.` });
  const cy = TOP + 402;
  const ch = BOT - cy;
  s.card({ x: X, y: cy, w: Wc, h: ch });
  const th = s.text(C7[1], { x: X + 28, y: cy + 28, w: Wc - 56, size: 19, bold: true, lh: 1.2, color: C.navy });
  const ly = cy + 28 + th + 18;
  s.text('Весь e-commerce минус маркетплейсы, п.п., в среднем по возрастам', { x: X + 28, y: ly, w: Wc - 56, size: 16, lh: 1.2, color: C.blueText });
  const bw = (v) => (Wc - 56 - 110) * v / Math.max(ADD_M, ADD_W);
  [['Мужчины', ADD_M, C.blue], ['Женщины', ADD_W, C.crimson]].forEach(([t, v, col], k) => {
    const by = ly + 66 + k * 86;
    s.text(t, { x: X + 28, y: by, w: 200, size: 17, color: C.navy });
    s.box({ x: X + 28, y: by + 26, w: bw(v), h: 34, fill: col, r: 4 });
    s.text(fmt(v), { x: X + 28 + bw(v) + 12, y: by + 22, w: 100, size: 32, bold: true, color: C.navy });
  });
  s.footnote(`${SRC7}. Разрывы — расчёт OMD`, { w: 1080 });
}

function slide7B(d) {
  const s = d.slide({ title: T7, subtitle: C7[0] });
  tag(s, 'Вариант 7Б · пирамида: мужчины ← → женщины');
  const cardB = 812;
  s.card({ x: 58, y: TOP, w: 1804, h: cardB - TOP });
  s.label('Среднесуточная аудитория e-commerce, %', { x: 94, y: 255, w: 900, color: C.blue });
  // легенда: заливка — маркетплейсы, светлая часть — весь e-commerce
  const sw2 = (x, a, b) => { s.box({ x, y: 255, w: 14, h: 22, fill: a, r: 0 }); s.box({ x: x + 14, y: 255, w: 14, h: 22, fill: b, r: 0 }); };
  const lx = 1250;
  sw2(lx, C.blue, C.crimson);
  s.text('маркетплейсы', { x: lx + 40, y: 253, w: 180, size: 18, color: C.navy });
  sw2(lx + 220, 'C9DAEE', 'F8C8D4');
  s.text('весь e-commerce', { x: lx + 260, y: 253, w: 220, size: 18, color: C.navy });
  const cx = 960;
  const half = 80;
  const zL = cx - half;
  const zR = cx + half;
  const k = 9;
  const max = 80;
  const y0 = 344;
  const P = { y: y0, h: cardB - 30 - y0 };
  const pitch = P.h / AGES.length;
  const ry = (i) => y0 + pitch * i + pitch / 2;
  s.text('МУЖЧИНЫ', { x: zL - 400, y: 298, w: 400 - 6, size: 22, bold: true, color: C.blue, align: 'right' });
  s.text('ЖЕНЩИНЫ', { x: zR + 6, y: 298, w: 400, size: 22, bold: true, color: C.crimson });
  s.text('Ж − М, п.п.', { x: zL, y: 304, w: zR - zL, size: 15, bold: true, color: C.crimson, align: 'center' });
  const side = (g, P2, colors, rev) => s.chart('bar', [
    { name: 'Весь e-commerce', labels: AGES, values: g.tot },
    { name: 'Маркетплейсы', labels: AGES, values: g.mp },
  ], { x: P2.x - 10, y: P.y - 10, w: P2.w + 20, h: P.h + 20, plot: P2, min: 0, max, gap: 38, overlap: 100, legend: false, values: false,
    colors, extra: rev ? { catAxisHidden: true, valAxisOrientation: 'maxMin' } : { catAxisHidden: true } });
  side(MEN, { x: zL - max * k, y: P.y, w: max * k, h: P.h }, ['C9DAEE', C.blue], true);
  side(WOM, { x: zR, y: P.y, w: max * k, h: P.h }, ['F8C8D4', C.crimson], false);
  AGES.forEach((a, i) => {
    const y = ry(i);
    s.text(a, { x: zL, y: ty(y, 22) - 11, w: zR - zL, size: 22, bold: true, color: C.navy, align: 'center' });
    const dv = DIFF[i];
    s.text(sgn(dv), { x: zL, y: ty(y, 17) + 15, w: zR - zL, size: 17, bold: true, color: dv > 0 ? C.crimson : C.blueText, align: 'center' });
    // маркетплейсы — внутри полосы у её конца, весь e-commerce — за светлым хвостом
    s.text(fmt(MEN.mp[i]), { x: zL - MEN.mp[i] * k + 10, y: ty(y, 18), w: 80, size: 18, bold: true, color: C.white });
    s.text(fmt(WOM.mp[i]), { x: zR + WOM.mp[i] * k - 90, y: ty(y, 18), w: 80, size: 18, bold: true, color: C.white, align: 'right' });
    s.text(fmt(MEN.tot[i]), { x: zL - MEN.tot[i] * k - 80, y: ty(y, 16), w: 70, size: 16, color: C.blueText, align: 'right' });
    s.text(fmt(WOM.tot[i]), { x: zR + WOM.tot[i] * k + 10, y: ty(y, 16), w: 70, size: 16, color: C.blueText });
  });

  // низ: второй комментарий и средняя «светлая часть» у мужчин и женщин
  const y = cardB + 20;
  const h = BOT - y;
  s.card({ x: 58, y, w: 1804, h, tint: true });
  s.text(C7[1], { x: 94, y: y + 20, w: 760, h: h - 40, size: 24, bold: true, lh: 1.2, color: C.navy, valign: 'middle', fit: true, minSize: 18 });
  s.vline(890, y + 26, h - 52);
  s.text('Светлая часть полос — весь e-commerce минус маркетплейсы, в среднем по возрастам, п.п.', { x: 926, y: y + 20, w: 330, h: h - 40, size: 17, lh: 1.25, color: C.blueText, valign: 'middle' });
  [[ADD_M, 'мужчины', C.blue], [ADD_W, `женщины — в ${fmt(ADD_M0 / ADD_W0)} раза меньше`, C.crimson]].forEach(([v, t, col], k2) => {
    const x = 1300 + k2 * 270;
    s.text(fmt(v), { x, y: y + 26, w: 250, size: 60, bold: true, lh: 1.1, color: col });
    s.text(t, { x, y: y + 100, w: k2 ? 290 : 240, size: 17, lh: 1.2, color: C.navy });
  });
  s.footnote(`${SRC7}. Разрывы — расчёт OMD`, { w: 1080 });
}

// ===================== Слайд 9: охват маркетплейсов =====================
const T9 = 'Расклад сил в сегменте маркетплейсов меняется';
const C9 = [
  'На фоне снижения охватов WB Озон становится уверенным лидером в категории, охватывая почти 70% россиян за месяц',
  'Яндекс.Маркет значительно сократил рекламную поддержку в 2026 и быстро теряет охваты',
  'Аналогичная ситуация с Мегамаркетом наблюдается с осени 2024. В 2026 охват площадки составляет менее 5%',
  'AliExpress оказался наиболее устойчивым без рекламной поддержки с марта 2022, однако с апреля 2026 вернулся в Наружную рекламу',
];
const SRC9 = 'Источник: Mediascope, CrossWeb, Россия 0+, 12+';
const D9 = chartData(9);
const N9 = D9.labels.length;                                   // 43 месяца: янв 2023 … июл 2026
const MON = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const monthOf = (i) => `${MON[i % 12]} ${2023 + Math.floor(i / 12)}`;
const YEARS9 = [['2023', 12], ['2024', 12], ['2025', 12], ['2026', 7]];
const NAME9 = { Ozon: 'Ozon', Wildberries: 'Wildberries', 'Яндекс.Маркет (Ya)': 'Яндекс.Маркет', Aliexpress: 'AliExpress', Joom: 'Joom', Megamarket: 'Мегамаркет' };
const P9 = D9.series.map((sr) => {
  const v = sr.values;
  let last = v.length - 1;
  while (v[last] == null) last--;
  return { key: sr.name, name: NAME9[sr.name], values: v, last, first: v[0], end: v[last] };
});
const byKey = (k) => P9.find((p) => p.key === k);
const labels9 = D9.labels.map((_, i) => monthOf(i));

function slide9A(d) {
  const s = d.slide({ title: T9 });
  tag(s, 'Вариант 9А · одна картина с пометками');
  s.card({ x: MAIN.x, y: TOP, w: MAIN.w, h: BOT - TOP });
  s.label('Динамика месячного охвата маркетплейсов, %', { x: 94, y: 255, w: 1000, color: C.blue });
  const P = { x: 150, y: 318, w: 1000, h: 604 };
  const lo = 0;
  const hi = 72;
  const m = chartMap('line', N9, P, lo, hi);
  gridY(s, m, [0, 20, 40, 60]);
  const bg = ['Яндекс.Маркет (Ya)', 'Aliexpress', 'Joom', 'Megamarket'].map(byKey);
  const hero = ['Wildberries', 'Ozon'].map(byKey);
  s.chart('line', bg.map((p) => ({ name: p.name, labels: labels9, values: p.values })), {
    x: P.x - 20, y: P.y - 20, w: P.w + 40, h: P.h + 40, plot: P, min: lo, max: hi, values: false, legend: false, lineSize: 2, symbol: 'none',
    colors: bg.map(() => MUTED), extra: { catAxisHidden: true } });
  // комментируемые участки — тёмной линией поверх
  const over = (p, i1, i2) => { for (let i = i1; i < i2; i++) s.seg(m.cat(i), m.val(p.values[i]), m.cat(i + 1), m.val(p.values[i + 1]), { color: C.navy, width: 3 }); };
  over(byKey('Яндекс.Маркет (Ya)'), 36, 42);   // 2026
  over(byKey('Megamarket'), 20, 35);           // с осени 2024
  over(byKey('Aliexpress'), 39, 42);           // с апреля 2026
  s.chart('line', hero.map((p) => ({ name: p.name, labels: labels9, values: p.values })), {
    x: P.x - 20, y: P.y - 20, w: P.w + 40, h: P.h + 40, plot: P, min: lo, max: hi, values: false, legend: false, lineSize: 3.5, symbol: 'none',
    colors: [C.crimson, C.blue], extra: { catAxisHidden: true } });
  // подписи у концов линий
  P9.forEach((p) => {
    const isHero = p.key === 'Ozon' || p.key === 'Wildberries';
    const col = p.key === 'Ozon' ? C.blue : p.key === 'Wildberries' ? C.crimson : C.navy;
    const x = m.cat(p.last);
    const y = m.val(p.end);
    dot(s, x, y, isHero ? 16 : 12, col);
    const sz = isHero ? 21 : 17;
    const dy = p.key === 'Megamarket' ? 14 : 0;   // Мегамаркет обрывается в декабре 2025 — подпись ниже линии Joom
    s.text(`**${fmt(p.end)}** ${p.name}${p.key === 'Megamarket' ? ' (дек 2025)' : ''}`, { x: x + 14, y: ty(y, sz) + dy, w: 300, size: sz, bold: isHero, color: isHero ? C.navy : C.blueText });
  });
  yearAxis(s, m, YEARS9, m.val(0) + 14);
  // пометки ①–④ — рядом с участком, о котором комментарий
  const oz = byKey('Ozon').values;
  const ym = byKey('Яндекс.Маркет (Ya)').values;
  const ali = byKey('Aliexpress').values;
  const mm = byKey('Megamarket').values;
  const mark = (i, v, n) => numMark(s, m.cat(i) - 20, m.val(v) - 20, n, C.navy);
  const up = 32 / (P.h / (hi - lo));            // 32 px над линией — в п.п.
  mark(37, oz[37] + up + 0.8, 1);
  mark(39, ym[39] + up, 2);
  mark(27, mm[27] + up, 3);
  mark(40, ali[40] + up, 4);

  // справа: Ozon крупно + четыре комментария
  const X = SIDE.x;
  const Wc = SIDE.w;
  const oz1 = byKey('Ozon');
  const wb1 = byKey('Wildberries');
  const h1 = 250;
  s.box({ x: X, y: TOP, w: Wc, h: h1, fill: C.blue });
  s.badge({ x: X + Wc - 62, y: TOP + 24, d: 40, n: 1, color: C.white, textColor: C.blue, size: 22 });
  s.text(`${fmt(oz1.end)}%`, { x: X + 28, y: TOP + 20, w: 300, size: 60, bold: true, lh: 1.1, color: C.white });
  s.text(`охват Ozon в июле 2026 — на ${fmt(oz1.end - wb1.end)} п.п. больше, чем у WB`, { x: X + 28, y: TOP + 100, w: Wc - 56, size: 19, bold: true, lh: 1.2, color: C.white });
  s.text(C9[0], { x: X + 28, y: TOP + 158, w: Wc - 56, h: h1 - 172, size: 17, lh: 1.2, color: C.white, fit: true, minSize: 15 });
  const ch = (BOT - TOP - h1 - 60) / 3;
  [2, 3, 4].forEach((n, k) => {
    const y = TOP + h1 + 20 + k * (ch + 20);
    s.card({ x: X, y, w: Wc, h: ch });
    numMark(s, X + 22, y + 22, n, C.navy);
    s.text(C9[n - 1], { x: X + 78, y: y + 24, w: Wc - 100, h: ch - 40, size: 19, lh: 1.22, color: C.navy, fit: true, minSize: 15 });
  });
  s.footnote(`${SRC9}. Разница Ozon − WB — расчёт OMD`, { w: 1080 });
}

function slide9B(d) {
  const s = d.slide({ title: T9 });
  tag(s, 'Вариант 9Б · шесть мини-графиков в одной шкале');
  const order = [['Ozon', 1], ['Wildberries', 1], ['Яндекс.Маркет (Ya)', 2], ['Megamarket', 3], ['Aliexpress', 4], ['Joom', 0]];
  const gap = 20;
  const cw = (1804 - 2 * gap) / 3;
  const stripH = 140;
  const gridB = BOT - stripH - gap;
  const ch = (gridB - TOP - gap) / 2;
  const lo = 0;
  const hi = 72;
  order.forEach(([key, n], i) => {
    const p = byKey(key);
    const x = 58 + (i % 3) * (cw + gap);
    const y = TOP + Math.floor(i / 3) * (ch + gap);
    const dv = r1(p.end - p.first);
    const col = dv >= 2 ? C.blue : dv <= -2 ? C.crimson : C.navy;
    s.card({ x, y, w: cw, h: ch });
    s.label(p.name, { x: x + 26, y: y + 22, w: cw - 120, size: 20, color: C.navy });
    if (n) numMark(s, x + cw - 26 - 40, y + 16, n, C.navy);
    s.text(`${fmt(p.first)} → ${fmt(p.end)}%`, { x: x + 26, y: y + 50, w: 330, size: 34, bold: true, lh: 1.1, color: C.navy });
    s.text(`${sgn(dv)} п.п.`, { x: x + cw - 26 - 200, y: y + 60, w: 200, size: 24, bold: true, color: col, align: 'right' });
    s.text(`янв 2023 → ${monthOf(p.last)}`, { x: x + 26, y: y + 90, w: 300, size: 15, color: C.blueText });
    const P = { x: x + 62, y: y + 124, w: cw - 62 - 26, h: ch - 124 - 46 };
    const m = chartMap('line', N9, P, lo, hi);
    [0, 30, 60].forEach((v) => {
      s.seg(P.x, m.val(v), P.x + P.w, m.val(v), { color: v === 0 ? C.line : GRID, width: v === 0 ? 1.5 : 1.25 });
      s.text(v === 0 ? '0' : `${v}%`, { x: P.x - 52, y: m.val(v) - 10, w: 44, size: 15, color: C.blueText, align: 'right' });
    });
    const others = P9.filter((q) => q.key !== key);
    s.chart('line', others.map((q) => ({ name: q.name, labels: labels9, values: q.values })), {
      x: P.x - 10, y: P.y - 10, w: P.w + 20, h: P.h + 20, plot: P, min: lo, max: hi, values: false, legend: false, lineSize: 1.5, symbol: 'none',
      colors: others.map(() => 'D3DFEC'), extra: { catAxisHidden: true } });
    s.chart('line', [{ name: p.name, labels: labels9, values: p.values }], {
      x: P.x - 10, y: P.y - 10, w: P.w + 20, h: P.h + 20, plot: P, min: lo, max: hi, values: false, legend: false, lineSize: 3, symbol: 'none',
      colors: [col], extra: { catAxisHidden: true } });
    dot(s, m.cat(0), m.val(p.first), 12, col);
    dot(s, m.cat(p.last), m.val(p.end), 16, col);
    // пик посередине периода — чтобы был виден спад
    const vals = p.values.slice(0, p.last + 1);
    const ip = vals.indexOf(Math.max(...vals));
    if (ip > 0 && ip < p.last && vals[ip] - p.end >= 2) {
      s.circle({ x: m.cat(ip) - 6, y: m.val(vals[ip]) - 6, d: 12, fill: C.white, stroke: col, sw: 2.5 });
      s.text(`пик ${fmt(vals[ip])}`, { x: m.cat(ip) - 70, y: m.val(vals[ip]) - 30, w: 140, size: 15, bold: true, color: col, align: 'center' });
    }
    yearAxis(s, m, YEARS9, P.y + P.h + 10, { size: 15 });
  });
  // полоса комментариев
  const sw = (1804 - 3 * gap) / 4;
  C9.forEach((t, k) => {
    const x = 58 + k * (sw + gap);
    const y = BOT - stripH;
    s.card({ x, y, w: sw, h: stripH, tint: true });
    numMark(s, x + 20, y + 20, k + 1, C.navy);
    s.text(t, { x: x + 72, y: y + 18, w: sw - 90, h: stripH - 30, size: 17, lh: 1.2, color: C.navy, fit: true, minSize: 16 });
  });
  s.footnote(`${SRC9}. Изменения и пики — расчёт OMD`, { w: 1080 });
}

module.exports = { 6: [slide6A, slide6B], 7: [slide7A, slide7B], 9: [slide9A, slide9B] };
