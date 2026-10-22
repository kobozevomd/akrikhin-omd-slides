// Варианты визуала для слайда 2 деки Comprehensive: оценки экономического положения и ситуации в стране.
const path = require('path');
const { Deck, C, chartMap } = require('../../lib/akrikhin');

const SRC = path.join(__dirname, '..', '..', 'work', 'comprehensive', 'src');
const TOP = 221;
const BOT = 1005;
const r1 = (v) => Math.round(v * 10) / 10;
const fmt = (v) => r1(v).toFixed(1).replace('.', ',');
const SOURCE = 'Источник: OMD Snapshot, города 1М+, 18–55, 625 респондентов, 1–3.07.2026 W19, онлайн-опрос Tiburon Research';
const TITLE = 'В июле негативные оценки достигли максимальных значений с конца сентября 2022 года';

// оба графика черновика: [экономика, страна]
const j = require(path.join(SRC, 'slide-02.json'));
const charts = j.shapes.filter((sh) => sh.t === 'CHART').map((sh) => sh.chart.plots[0]);
const Q = charts.map((p) => {
  const v = p.series.map((s) => s.values.map(r1));
  return { vg: v[0], g: v[1], b: v[2], vb: v[3], dk: v[4], neg: v[2].map((x, i) => r1(x + v[3][i])), pos: v[0].map((x, i) => r1(x + v[1][i])) };
});
const [ECO, CTRY] = Q;
const N = 21;
const LAST = N - 1;
// подписи волн под осью и годы
const WAVES = ['мар', 'апр', 'июн', 'сен\nнач.', 'сен\nкон.', 'фев', 'май', 'июл', 'сен', 'ноя', 'мар', 'июл', 'окт', 'дек', 'мар', 'июл', 'окт', 'дек', 'мар', 'июн', 'июл'];
const YEARS = [['2022', 5], ['2023', 5], ['2024', 4], ['2025', 4], ['2026', 3]];
const SEP22 = 4;   // конец сентября 2022
const MAR25 = 14;  // минимум негатива

function tag(s, text) {
  s.notes(text); // какой это вариант — в заметках к слайду, не на самом слайде
}
function axis(s, m, y, { waveSize = 13, yearSize = 17 } = {}) {
  WAVES.forEach((w, i) => s.text(w, { x: m.cat(i) - 30, y, w: 60, size: waveSize, lh: 1.05, color: C.blueText, align: 'center' }));
  let i0 = 0;
  YEARS.forEach(([label, n], gi) => {
    const x1 = m.cat(i0) - m.step / 2;
    const x2 = m.cat(i0 + n - 1) + m.step / 2;
    s.text(label, { x: x1, y: y + 34, w: x2 - x1, size: yearSize, bold: true, color: C.navy, align: 'center' });
    if (gi > 0) s.seg(x1, y - 4, x1, y + 34 + yearSize + 4, { color: C.line, width: 1.5 });
    i0 += n;
  });
}
function lastBand(s, m, y1, y2) {
  const bx = m.cat(LAST) - m.step / 2;
  s.box({ x: bx, y: y1, w: m.step, h: y2 - y1, fill: C.crimson, transparency: 90, r: 0 });
}
function statTile(s, x, y, w, h, color, value, text, delta) {
  s.box({ x, y, w, h, fill: color });
  s.text(value, { x: x + 28, y: y + 22, w: w - 56, size: 64, bold: true, lh: 1.1, color: C.white });
  const th = s.text(text, { x: x + 28, y: y + 108, w: w - 56, size: 19, lh: 1.2, color: C.white });
  if (delta) s.text(delta, { x: x + 28, y: y + 108 + th + 10, w: w - 56, size: 19, bold: true, lh: 1.2, color: C.white });
}

// ============ 2А: две линии доли негатива ============
function slide2A(d) {
  const s = d.slide({ title: TITLE });
  tag(s, 'Вариант 2А · линии доли негатива');
  s.card({ x: 58, y: TOP, w: 1330, h: BOT - TOP });
  s.label('Доля негативных оценок: «скорее плохое» + «очень плохое», %', { x: 94, y: 255, w: 1200, color: C.blue });
  // легенда
  [[C.navy, 'Ситуация в стране в целом'], [C.blue, 'Экономическое положение России']].forEach(([col, t], k) => {
    const x = 94 + k * 420;
    s.seg(x, 316, x + 36, 316, { color: col, width: 4 });
    s.text(t, { x: x + 48, y: 304, w: 360, size: 18, color: C.navy });
  });
  const P = { x: 150, y: 370, w: 1080, h: 470 };
  const lo = 30;
  const hi = 80;
  const m = chartMap('line', N, P, lo, hi);
  [40, 50, 60, 70].forEach((v) => {
    s.seg(P.x, m.val(v), P.x + P.w, m.val(v), { color: 'E6EEF8', width: 1.25 });
    s.text(`${v}%`, { x: P.x - 64, y: m.val(v) - 11, w: 54, size: 15, color: C.blueText, align: 'right' });
  });
  lastBand(s, m, P.y - 10, P.y + P.h);
  s.chart('line', [
    { name: 'Ситуация в стране в целом', labels: WAVES, values: CTRY.neg },
    { name: 'Экономическое положение России', labels: WAVES, values: ECO.neg },
  ], { x: 120, y: 340, w: 1220, h: 540, plot: P, min: lo, max: hi, values: false, legend: false, lineSize: 3, symbol: 'circle',
    symbolSize: 7, colors: [C.navy, C.blue], extra: { catAxisHidden: true } });
  // пунктир «на этом уровне последний раз — в сентябре 2022»
  [[CTRY, C.navy], [ECO, C.blue]].forEach(([q, col]) => {
    s.seg(m.cat(SEP22), m.val(q.neg[LAST]), m.cat(LAST), m.val(q.neg[LAST]), { color: C.crimson, width: 1.75, dash: 'dash' });
    s.circle({ x: m.cat(LAST) - 10, y: m.val(q.neg[LAST]) - 10, d: 20, fill: C.crimson });
    s.text(`${fmt(q.neg[LAST])}%`, { x: m.cat(LAST) + 16, y: m.val(q.neg[LAST]) - 15, w: 110, size: 24, bold: true, color: C.navy });
  });
  s.text('последний раз выше — в конце сентября 2022', { x: m.cat(7), y: m.val(CTRY.neg[LAST]) - 32, w: m.cat(18) - m.cat(7), size: 17, bold: true,
    color: C.crimson, align: 'center' });
  s.seg(P.x, P.y + P.h, P.x + P.w, P.y + P.h, { color: C.line, width: 2 });
  axis(s, m, P.y + P.h + 10);

  const X = 1410;
  const Wc = 452;
  const hT = 250;
  statTile(s, X, TOP, Wc, hT, C.crimson, `${fmt(CTRY.neg[LAST])}%`, 'оценивают ситуацию в стране как плохую (июль 2026)',
    `+${fmt(CTRY.neg[LAST] - CTRY.neg[LAST - 1])} п.п. к июню`);
  statTile(s, X, TOP + hT + 20, Wc, hT, C.blue, `${fmt(ECO.neg[LAST])}%`, 'оценивают экономическое положение России как плохое',
    `+${fmt(ECO.neg[LAST] - ECO.neg[LAST - 1])} п.п. к июню`);
  const cy = TOP + 2 * hT + 40;
  s.card({ x: X, y: cy, w: Wc, h: BOT - cy });
  s.label('Лучшая точка — март 2025', { x: X + 28, y: cy + 26, w: Wc - 56, size: 19, color: C.green });
  [[CTRY, 'страна'], [ECO, 'экономика']].forEach(([q, t], k) => {
    const y = cy + 66 + k * 78;
    s.text(`**${fmt(q.neg[MAR25])}%** негатива — ${t}`, { x: X + 28, y, w: Wc - 56, size: 22, color: C.navy });
    s.text(`с тех пор **+${fmt(q.neg[LAST] - q.neg[MAR25])} п.п.**`, { x: X + 28, y: y + 32, w: Wc - 56, size: 18, color: C.crimson });
  });
  s.footnote(SOURCE + '. Доли и изменения — расчёт OMD');
}

// ============ 2Б: баланс «хорошо / плохо» от нуля ============
function diverging(s, q, { x, y, w, h, label, stat }) {
  s.card({ x, y, w, h });
  s.label(label, { x: x + 36, y: y + 26, w: 1000, size: 20, color: C.blue });
  const P = { x: x + 70, y: y + 70, w: w - 470, h: h - 150 };
  const lo = -88;
  const hi = 60;
  const m = chartMap('col', N, P, lo, hi);
  lastBand(s, m, P.y - 6, P.y + P.h + 6);
  s.chart('col', [
    { name: 'Скорее хорошее', labels: WAVES, values: q.g },
    { name: 'Очень хорошее', labels: WAVES, values: q.vg },
    { name: 'Скорее плохое', labels: WAVES, values: q.b.map((v) => -v) },
    { name: 'Очень плохое', labels: WAVES, values: q.vb.map((v) => -v) },
  ], { x: P.x - 20, y: P.y - 10, w: P.w + 40, h: P.h + 20, plot: P, min: lo, max: hi, stacked: true, values: false, legend: false,
    gap: 45, colors: [C.cyan, C.blue, C.orange, C.crimson], extra: { catAxisHidden: true } });
  s.seg(P.x, m.val(0), P.x + P.w, m.val(0), { color: C.navy, width: 2 });
  // итоги: «хорошо» над столбцом, «плохо» под ним
  q.pos.forEach((v, i) => s.text(Math.round(v), { x: m.cat(i) - 24, y: m.val(v) - 22, w: 48, size: 14, bold: i === LAST, color: C.navy, align: 'center' }));
  q.neg.forEach((v, i) => s.text(Math.round(v), { x: m.cat(i) - 24, y: m.val(-v) + 4, w: 48, size: 14, bold: i === LAST,
    color: i === LAST ? C.crimson : C.navy, align: 'center' }));
  axis(s, m, P.y + P.h + 8, { waveSize: 12, yearSize: 15 });
  // справа — цифра
  const sx = P.x + P.w + 60;
  const sw = x + w - 30 - sx;
  s.box({ x: sx, y: y + 26, w: sw, h: h - 52, fill: C.crimson });
  s.text(`${fmt(q.neg[LAST])}%`, { x: sx + 24, y: y + 46, w: sw - 48, size: 54, bold: true, lh: 1.1, color: C.white });
  const th = s.text(stat, { x: sx + 24, y: y + 122, w: sw - 48, size: 17, lh: 1.2, color: C.white });
  s.text(`+${fmt(q.neg[LAST] - q.neg[LAST - 1])} п.п. к июню`, { x: sx + 24, y: y + 122 + th + 10, w: sw - 48, size: 17, bold: true, color: C.white });
}

function slide2B(d) {
  const s = d.slide({ title: TITLE });
  tag(s, 'Вариант 2Б · хорошо вверх, плохо вниз');
  // общая легенда
  [[C.blue, 'Очень хорошее'], [C.cyan, 'Скорее хорошее'], [C.orange, 'Скорее плохое'], [C.crimson, 'Очень плохое']].forEach(([col, t], k) => {
    const x = 58 + k * 250;
    s.box({ x, y: TOP + 2, w: 22, h: 22, fill: col, r: 4 });
    s.text(t, { x: x + 32, y: TOP, w: 210, size: 17, color: C.navy });
  });
  s.text('«Затрудняюсь ответить» не показано', { x: 1100, y: TOP, w: 762, size: 15, color: C.blueText, align: 'right' });
  const h = (BOT - TOP - 44 - 20) / 2;
  diverging(s, ECO, { x: 58, y: TOP + 44, w: 1804, h, label: 'Как бы вы оценили экономическое положение России?, %',
    stat: 'негативных оценок в июле 2026 — максимум с конца сентября 2022' });
  diverging(s, CTRY, { x: 58, y: TOP + 44 + h + 20, w: 1804, h, label: 'Как бы вы оценили ситуацию в стране в целом?, %',
    stat: 'негативных оценок в июле 2026 — максимум с конца сентября 2022' });
  s.footnote(SOURCE);
}

// ============ 2В: три среза — тогда, лучшая точка, сейчас ============
function snapshot(s, q, { x, y, w, h, label, delta }) {
  s.card({ x, y, w, h });
  s.label(label, { x: x + 33, y: y + 30, w: w - 66, size: 20, color: C.blue });
  const rows = [[SEP22, 'Конец сентября 2022'], [MAR25, 'Март 2025 — минимум негатива'], [LAST, 'Июль 2026']];
  const P = { x: x + 33, y: y + 110, w: w - 66, h: 440 };
  const series = [['Очень хорошее', 'vg'], ['Скорее хорошее', 'g'], ['Затрудняюсь ответить', 'dk'], ['Скорее плохое', 'b'], ['Очень плохое', 'vb']]
    .map(([name, k]) => ({ name, labels: rows.map((r) => r[1]), values: rows.map((r) => q[k][r[0]]) }));
  const m = chartMap('bar', 3, P, 0, 1);
  // подписи строк — над полосами
  rows.forEach(([, t], i) => s.text(t, { x: P.x, y: m.cat(i) - m.step * 0.24 - 32, w: P.w, size: 19, bold: i === 2, color: i === 2 ? C.crimson : C.navy }));
  s.chart('bar', series, { x: P.x - 10, y: P.y - 10, w: P.w + 20, h: P.h + 20, plot: P, min: 0, max: 1, percent: true, values: true,
    format: '0', labelSize: 18, labelBold: true, gap: 110, legend: false, colors: [C.blue, C.cyan, 'D9E3EF', C.orange, C.crimson],
    extra: { catAxisHidden: true } });
  // итог «плохо» справа от каждой полосы не нужен — он внутри; ниже — вывод
  s.box({ x: x + 33, y: y + h - 150, w: w - 66, h: 118, fill: C.cardTint, stroke: C.line });
  s.text(delta, { x: x + 57, y: y + h - 136, w: w - 114, h: 90, size: 20, bold: true, lh: 1.25, color: C.navy, valign: 'middle' });
}

function slide2C(d) {
  const s = d.slide({ title: TITLE });
  tag(s, 'Вариант 2В · три среза: тогда, лучшая точка, сейчас');
  [[C.blue, 'Очень хорошее'], [C.cyan, 'Скорее хорошее'], ['D9E3EF', 'Затрудняюсь ответить'], [C.orange, 'Скорее плохое'], [C.crimson, 'Очень плохое']].forEach(([col, t], k) => {
    const x = 58 + k * 300;
    s.box({ x, y: TOP + 2, w: 22, h: 22, fill: col, r: 4, stroke: col === 'D9E3EF' ? C.line : undefined });
    s.text(t, { x: x + 32, y: TOP, w: 260, size: 17, color: C.navy });
  });
  const w = (1804 - 22) / 2;
  const y = TOP + 50;
  const h = BOT - y;
  snapshot(s, ECO, { x: 58, y, w, h, label: 'Как бы вы оценили экономическое положение России?, %',
    delta: `[[Плохих оценок ${fmt(ECO.neg[LAST])}%]] — на ${fmt(ECO.neg[LAST] - ECO.neg[MAR25])} п.п. больше, чем в марте 2025; выше было в последний раз в конце сентября 2022 (${fmt(ECO.neg[SEP22])}%)` });
  snapshot(s, CTRY, { x: 58 + w + 22, y, w, h, label: 'Как бы вы оценили ситуацию в стране в целом?, %',
    delta: `[[Плохих оценок ${fmt(CTRY.neg[LAST])}%]] — на ${fmt(CTRY.neg[LAST] - CTRY.neg[MAR25])} п.п. больше, чем в марте 2025; выше было в последний раз в конце сентября 2022 (${fmt(CTRY.neg[SEP22])}%)` });
  s.footnote(SOURCE + '. Изменения — расчёт OMD');
}

module.exports = { 2: [slide2A, slide2B, slide2C] };
