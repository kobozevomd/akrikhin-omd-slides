// Общие приёмы для вариантов слайдов-графиков (Market Trends 2–15).
// Стиль: одна история — один акцент (малиновый), фон — приглушённый сине-серый, подписи прямо на графике
// вместо легенд, большие цифры в правой колонке, свои подписи осей вместо стандартных.
const path = require('path');
const { C } = require('../../lib/akrikhin');

const SRC = path.join(__dirname, '..', '..', 'work', 'comprehensive', 'src');
const MEDIA = path.join(SRC, 'media');
const MUTED = 'A9BFD9';   // второстепенные линии/полосы
const GRID = 'E6EEF8';    // линии сетки
const TOP = 221;          // верх контента
const BOT = 1005;         // низ контента (плашки на этих слайдах нет)
const SIDE = { x: 1410, w: 452 };   // правая колонка с цифрами
const MAIN = { x: 58, w: 1330 };    // карточка с графиком слева от неё
const r1 = (v) => Math.round(v * 10) / 10;
const fmt = (v) => r1(v).toFixed(1).replace('.', ',');
const pct = (v) => `${String(r1(v)).replace('.', ',')}%`;

// Данные графика k-го на слайде n черновика (значения округлены до 0,1)
function chartData(n, k = 0) {
  const j = require(path.join(SRC, `slide-${String(n).padStart(2, '0')}.json`));
  const p = j.shapes.filter((sh) => sh.t === 'CHART')[k].chart.plots[0];
  return {
    labels: p.cats.map((c) => String(c).trim()),
    series: p.series.map((s) => ({ name: s.name, values: s.values.map((v) => (v == null ? null : r1(v))) })),
  };
}

// «Какой это вариант» — в заметки к слайду (на слайде служебных подписей нет)
function tag(s, text) {
  s.notes(text); // какой это вариант — в заметках к слайду, не на самом слайде
}

// Годы под осью: подпись по центру своей группы + тонкие разделители. groups: [['2024', 12], ...]
function yearAxis(s, m, groups, y, { size = 18, sep = true } = {}) {
  let i0 = 0;
  groups.forEach(([label, count], gi) => {
    const x1 = m.cat(i0) - m.step / 2;
    const x2 = m.cat(i0 + count - 1) + m.step / 2;
    s.text(label, { x: x1, y, w: x2 - x1, size, bold: true, color: C.navy, align: 'center' });
    if (sep && gi > 0) s.seg(x1, y - 6, x1, y + size + 6, { color: C.line, width: 1.5 });
    i0 += count;
  });
}

// Горизонтальные линии сетки с подписями слева (для вертикальной шкалы)
function gridY(s, m, values, { suffix = '%', zero = true } = {}) {
  const P = m.plot;
  values.forEach((v) => {
    const isZero = v === 0;
    s.seg(P.x, m.val(v), P.x + P.w, m.val(v), { color: isZero ? C.line : GRID, width: isZero ? 2 : 1.25 });
    s.text(isZero && zero ? '0' : `${v}${suffix}`, { x: P.x - 64, y: m.val(v) - 11, w: 54, size: 15, color: C.blueText, align: 'right' });
  });
}

// Легенда точками: items = [[цвет, текст], ...]
function legend(s, x, y, items, { size = 18, step = 40, dir = 'col', gap = 260 } = {}) {
  items.forEach(([color, text], k) => {
    const xx = dir === 'row' ? x + k * gap : x;
    const yy = dir === 'row' ? y : y + k * step;
    s.circle({ x: xx, y: yy + 3, d: 18, fill: color });
    s.text(text, { x: xx + 30, y: yy, w: (dir === 'row' ? gap : 480) - 34, size, color: C.navy });
  });
}

// Плитка с большой цифрой: value, text под ней, delta — жирной строкой ниже
function statTile(s, { x, y, w, h, color = C.blue, value, text, delta, size = 64 }) {
  s.box({ x, y, w, h, fill: color });
  s.text(value, { x: x + 28, y: y + 22, w: w - 56, size, bold: true, lh: 1.1, color: C.white });
  const ty = y + 22 + size * 1.1 + 12;
  const th = text ? s.text(text, { x: x + 28, y: ty, w: w - 56, size: 19, lh: 1.2, color: C.white }) : 0;
  if (delta) s.text(delta, { x: x + 28, y: ty + th + 10, w: w - 56, size: 19, bold: true, lh: 1.2, color: C.white });
}

// Номер-метка (связывает пометку на графике и комментарий)
function numMark(s, x, y, n, color = C.crimson) {
  s.badge({ x, y, d: 40, n, color, size: 22 });
}

module.exports = { SRC, MEDIA, MUTED, GRID, TOP, BOT, SIDE, MAIN, r1, fmt, pct, chartData, tag, yearAxis, gridY, legend, statTile, numMark };
