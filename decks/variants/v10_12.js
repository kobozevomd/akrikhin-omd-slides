// Варианты визуала для слайдов 10–12 деки Comprehensive (маркетплейсы, рекламный рынок, CTV).
// По два варианта на слайд — на выбор. Данные: 10 и 12 — из текста черновика, 11 — из json графиков черновика.
const path = require('path');
const { C, PT, chartMap } = require('../../lib/akrikhin');
const { SRC, MEDIA, MUTED, GRID, TOP, BOT, SIDE, MAIN, tag, statTile } = require('./common');

const NB = ' ';
const int = (v) => String(Math.round(Math.abs(v))).replace(/\B(?=(\d{3})+(?!\d))/g, NB);
const signed = (v) => (Math.round(v) < 0 ? '–' : '+') + int(v);
const pc = (v) => `${Math.round(v)}%`;
// число с мелким «%»: [{80}{%}]
const big = (v, size, unit = '%', k = 0.55) => [{ text: String(v), options: {} }, { text: unit, options: { fontSize: PT(Math.round(size * k)) } }];

// ===================== Слайд 10: пересечение аудиторий маркетплейсов =====================
const T10 = 'Три крупнейших маркетплейса в значительной мере охватывают одних и тех же пользователей';
const S10 = 'Самая большая доля эксклюзивных пользователей у Ozon';
const SRC10 = 'Источник: Mediascope, CrossWeb, июль 2026';
// из черновика: охват за месяц, «только эта площадка», все три, хотя бы одна
const MP = [
  { name: 'Ozon', reach: 68, only: 10, img: 'img_b94a2609be.png', ratio: 2560 / 561, h: 34 },
  { name: 'Wildberries', reach: 62, only: 6, img: 'img_d05a2f8572.png', ratio: 2827 / 811, h: 48 },
  { name: 'Яндекс Маркет', reach: 28, only: 1, img: 'img_0fdb39d87f.png', ratio: 1200 / 230, h: 38 },
];
const ANY = 76;
const ALL3 = 24;
const ONLY = MP.reduce((a, m) => a + m.only, 0);          // 17 — пользуются только одной площадкой
const TWO = ANY - ALL3 - ONLY;                              // 35 — ровно двумя (расчёт)
const NONE = 100 - ANY;                                     // 24 — ни одной
MP.forEach((m) => {
  m.two = m.reach - m.only - ALL3;                          // эта площадка + ещё одна: 34 / 32 / 3
  m.excl = Math.round((m.only / m.reach) * 100);            // доля эксклюзивных в охвате: 15 / 10 / 4
});
const ALL3_C = MUTED;      // все три площадки
const TWO_C = 'D3E0F0';    // ровно две
const logo = (s, m, x, yMid, h = m.h) => s.image(path.join(MEDIA, m.img), { x, y: yMid - h / 2, w: Math.round(h * m.ratio), h, alt: m.name });

function slide10A(d) {
  const s = d.slide({ title: T10, subtitle: S10 });
  tag(s, 'Вариант 10А · охват: общая аудитория и эксклюзив');
  s.card({ x: MAIN.x, y: TOP, w: MAIN.w, h: BOT - TOP });
  s.label('Месячный охват маркетплейсов, % россиян', { x: 94, y: 255, w: 1000, color: C.blue });

  const x0 = 370;
  const k = 11.6;                       // px на 1 п.п. охвата
  const X = (v) => x0 + v * k;
  const bh = 76;
  const y0 = 376;
  const pitch = 142;
  const rowY = (i) => y0 + i * pitch;
  const uy = rowY(3) + 34;              // строка «любой из трёх» — после разделителя
  // пунктир: блок «все три» одинаков во всех строках
  s.seg(X(ALL3), y0 - 48, X(ALL3), uy + bh + 12, { color: C.navy, width: 1.75, dash: 'dash' });
  // подписи сегментов — над первой полосой
  const cap = (t, a, b, y, color = C.navy) => s.text(t, { x: X(a) - 20, y, w: X(b) - X(a) + 40, size: 17, bold: true, color, align: 'center' });
  cap('все три площадки', 0, ALL3, y0 - 36);
  cap('Ozon + ещё одна', ALL3, ALL3 + MP[0].two, y0 - 36);
  cap('только Ozon', ALL3 + MP[0].two, MP[0].reach, y0 - 36, C.crimson);

  const bar = (y, parts, total) => {
    let a = 0;
    parts.forEach(([v, fill, color]) => {
      s.box({ x: X(a), y, w: X(a + v) - X(a), h: bh, fill, r: 0 });
      if (X(a + v) - X(a) >= 34) s.text(String(v), { x: X(a), y: y + bh / 2 - 15, w: X(a + v) - X(a), size: 24, bold: true, color, align: 'center' });
      a += v;
    });
    s.text(big(total, 40), { x: X(total) + 16, y: y + bh / 2 - 26, w: 150, size: 40, bold: true, lh: 1.1, color: C.navy });
  };
  MP.forEach((m, i) => {
    const y = rowY(i);
    logo(s, m, 94, y + bh / 2);
    bar(y, [[ALL3, ALL3_C, C.navy], [m.two, TWO_C, C.navy], [m.only, C.crimson, C.white]], m.reach);
  });
  // «только» у Я.Маркета не влезает внутрь — подпись над сегментом
  const ym = MP[2];
  s.text(`${ym.only} — только Яндекс${NB}Маркет`, { x: X(ym.reach) - 10, y: rowY(2) - 30, w: 360, size: 17, bold: true, color: C.crimson });

  // итог: любой из трёх = все три + ровно две + только одна
  s.hline(94, uy - 32, MAIN.w - 72);
  s.text('Любой\nиз трёх', { x: 94, y: uy + bh / 2 - 26, w: 240, size: 22, bold: true, lh: 1.1, color: C.navy });
  bar(uy, [[ALL3, ALL3_C, C.navy], [TWO, TWO_C, C.navy], [ONLY, C.crimson, C.white]], ANY);
  cap('ровно две', ALL3, ALL3 + TWO, uy + bh + 8, C.blueText);
  cap('только одна', ALL3 + TWO, ANY, uy + bh + 8, C.crimson);

  // справа: охват любого из трёх, все три, эксклюзив Ozon
  const h = (BOT - TOP - 40) / 3;
  statTile(s, { x: SIDE.x, y: TOP, w: SIDE.w, h, color: C.blue, value: '76%', text: 'россиян за месяц посещали один из трёх ключевых маркетплейсов' });
  statTile(s, { x: SIDE.x, y: TOP + h + 20, w: SIDE.w, h, color: C.navy, value: '24%', text: 'используют все три маркетплейса',
    delta: `почти треть всех пользователей маркетплейсов (${ALL3} из ${ANY})` });
  statTile(s, { x: SIDE.x, y: TOP + 2 * (h + 20), w: SIDE.w, h, color: C.crimson, value: `${MP[0].excl}%`, text: 'аудитории Ozon — эксклюзивные пользователи',
    delta: `у Wildberries — ${MP[1].excl}%, у Яндекс${NB}Маркета — ${MP[2].excl}%` });
  s.footnote(`${SRC10}. «Ozon + ещё одна» = охват − только Ozon − все три; «ровно две» = 76 − 24 − 17; доля эксклюзивных = только эта площадка / охват — расчёт OMD`);
}

function slide10B(d) {
  const s = d.slide({ title: T10, subtitle: S10 });
  tag(s, 'Вариант 10Б · 100 россиян');
  s.card({ x: MAIN.x, y: TOP, w: MAIN.w, h: BOT - TOP });
  s.label('Из 100 россиян за месяц пользуются…', { x: 94, y: 255, w: 1000, color: C.blue });

  const groups = [
    { n: ALL3, fill: C.blue, t: 'всеми тремя маркетплейсами' },
    { n: TWO, fill: C.cyan, t: 'ровно двумя из трёх' },
    { n: MP[0].only, fill: C.crimson, t: 'только', m: MP[0], hero: true },
    { n: MP[1].only, fill: 'F27E98', t: 'только', m: MP[1] },
    { n: MP[2].only, fill: 'F7B1C1', t: 'только', m: MP[2] },
    { n: NONE, fill: null, t: 'ни одним из трёх' },
  ];
  // сетка 10×10 — по строкам, группы подряд
  const D = 50;
  const P = 64;
  const gx = 94;
  const gy = 318;
  let idx = 0;
  groups.forEach((g) => {
    for (let j = 0; j < g.n; j++, idx++) {
      const x = gx + (idx % 10) * P;
      const y = gy + Math.floor(idx / 10) * P;
      if (g.fill) s.circle({ x, y, d: D, fill: g.fill });
      else s.circle({ x: x + 2, y: y + 2, d: D - 4, stroke: MUTED, sw: 2.5 });
    }
  });

  // легенда: группы с большими цифрами
  const lx = 812;
  const lw = 1352 - lx;
  let y = 334;
  const RP = 72;
  const head = (t, color) => { s.text(t.toUpperCase(), { x: lx, y, w: lw, size: 17, bold: true, color }); y += 40; };
  const row = (g) => {
    if (g.fill) s.circle({ x: lx, y: y + 12, d: 26, fill: g.fill });
    else s.circle({ x: lx + 1, y: y + 13, d: 24, stroke: MUTED, sw: 2.5 });
    s.text(String(g.n), { x: lx + 42, y: y - 4, w: 80, size: 40, bold: true, lh: 1.1, color: g.hero ? C.crimson : C.navy });
    if (g.m) {
      s.text(g.t, { x: lx + 118, y: y + 10, w: 80, size: 20, color: C.navy });
      logo(s, g.m, lx + 190, y + 24, Math.round(g.m.h * 0.8));
    } else s.text(g.t, { x: lx + 118, y: y + 10, w: lw - 118, size: 20, color: C.navy });
    y += RP;
  };
  head(`Несколькими площадками — ${ALL3 + TWO}`, C.blue);
  row(groups[0]);
  row(groups[1]);
  y += 22;
  head(`Только одной — ${ONLY}`, C.crimson);
  row(groups[2]);
  row(groups[3]);
  row(groups[4]);
  s.hline(lx, y + 4, lw);
  y += 30;
  row(groups[5]);

  // справа: выводы
  const h = (BOT - TOP - 40) / 3;
  const avg = MP.reduce((a, m) => a + m.reach, 0) / ANY;
  statTile(s, { x: SIDE.x, y: TOP, w: SIDE.w, h, color: C.navy, value: avg.toFixed(1).replace('.', ','),
    text: 'маркетплейса в среднем на одного пользователя', delta: `сумма охватов ${MP.reduce((a, m) => a + m.reach, 0)}%, а уникальный охват — ${ANY}%` });
  statTile(s, { x: SIDE.x, y: TOP + h + 20, w: SIDE.w, h, color: C.blue, value: `${ALL3 + TWO} из ${ANY}`, text: 'пользователей маркетплейсов ходят на две площадки или на все три' });
  statTile(s, { x: SIDE.x, y: TOP + 2 * (h + 20), w: SIDE.w, h, color: C.crimson, value: `${MP[0].only} из ${ONLY}`, text: 'тех, кто ограничивается одной площадкой, — пользователи Ozon' });
  s.footnote(`${SRC10}. «Ровно двумя» = 76 − 24 − 10 − 6 − 1; среднее число площадок = сумма охватов / охват любой из трёх — расчёт OMD`);
}

// ===================== Слайд 11: рекламный рынок =====================
const T11 = 'Динамика рекламного рынка в России';
const SRC11 = 'Источник: АКАР, оценка агентства';
const NOTE11 = 'eRetail Media является главным драйвером роста сегмента интернета и рекламного рынка в целом';
const AD = (() => {
  const j = require(path.join(SRC, 'slide-11.json'));
  const charts = j.shapes.filter((sh) => sh.t === 'CHART').map((sh) => sh.chart);
  const bigc = charts.find((c) => c.plots[0].series[0].name === 'Тотал');
  const years = bigc.plots[0].cats.map((c) => c.replace(' (F)', ''));
  const total = bigc.plots[0].series[0].values.map((v) => v / 1000);          // млн → млрд руб.
  const S = Object.fromEntries(bigc.plots[1].series.map((x) => [x.name, x.values.map((v) => (v == null ? null : v / 1000))]));
  const dyn = charts.find((c) => c.type === 'LINE_MARKERS').plots[0].series[0].values;
  const fc = bigc.plots[0].cats.map((c) => c.includes('(F)'));
  return { years, total, S, dyn, fc };
})();
const N11 = AD.years.length;
const I22 = AD.years.indexOf('2022');
const I27 = N11 - 1;
const v0 = (v) => v ?? 0;
// снизу вверх: прочие (приглушённо) → ТВ → интернет → eRetail Media
const STACK = [
  { key: 'Пресса', color: 'DCE6F2' },
  { key: 'Радио', color: 'C4D4E8' },
  { key: 'Наружная реклама', color: MUTED },
  { key: 'ТВ', color: C.navy, label: 'ТВ' },
  { key: 'Интернет', color: C.blue, label: 'Интернет' },
  { key: 'eRetail Media', color: C.crimson, label: 'eRetail Media' },
];
const OTHER = ['Наружная реклама', 'Радио', 'Пресса'];
const otherAt = (i) => OTHER.reduce((a, k) => a + v0(AD.S[k][i]), 0);
const eShare = (i) => (v0(AD.S['eRetail Media'][i]) / AD.total[i]) * 100;
const growth = AD.total[I27] - AD.total[I22];
const dE = AD.S['eRetail Media'][I27] - AD.S['eRetail Media'][I22];
// вклад в прирост 2022 → 2027 по медиа
const CONTRIB = ['eRetail Media', 'Интернет', 'ТВ', 'Наружная реклама', 'Радио', 'Пресса']
  .map((k) => ({ k, d: v0(AD.S[k][I27]) - v0(AD.S[k][I22]) }))
  .sort((a, b) => b.d - a.d);
const segLabelsAt = (i) => {
  // середины сегментов в столбце i: [{label, lo, hi, value}]
  let acc = 0;
  const out = [];
  STACK.forEach((st) => {
    const v = v0(AD.S[st.key][i]);
    out.push({ ...st, lo: acc, hi: acc + v, v });
    acc += v;
  });
  return out;
};

function forecastBand(s, m, i1, yTop, yBot, label = 'прогноз') {
  const bx = m.cat(i1) - m.step / 2;
  const P = m.plot;
  s.box({ x: bx, y: yTop, w: P.x + P.w - bx, h: yBot - yTop, fill: C.navy, transparency: 94, r: 0 });
  s.text(label, { x: bx, y: yTop + 8, w: P.x + P.w - bx, size: 16, bold: true, color: C.blueText, align: 'center' });
}

// подписи сегментов справа от последнего столбца (values: false — только названия, значения внутри столбцов)
function endLabels(s, m, i, x, { size = 17, values = true, w = 250 } = {}) {
  const segs = segLabelsAt(i);
  const groups = [
    { name: 'Наружка, радио, пресса', lo: 0, hi: otherAt(i), v: otherAt(i) },
    ...segs.filter((g) => g.label).map((g) => ({ name: g.label, lo: g.lo, hi: g.hi, v: g.v, hero: g.key === 'eRetail Media' })),
  ];
  let prevTop = m.val(0) + 4;
  groups.forEach((g) => {
    const sz = g.hero ? size + 2 : size;
    const hh = sz * 1.2 * (values ? 2 : 1);
    let top = (m.val(g.lo) + m.val(g.hi)) / 2 - hh / 2;
    top = Math.min(top, prevTop - hh - 2);
    const t = values ? `${g.name}\n**${int(g.v)}**` : g.name;
    s.text(t, { x, y: top, w, size: sz, bold: !values && g.hero, lh: 1.2, color: g.hero ? C.crimson : C.navy });
    prevTop = top;
  });
}

function slide11A(d) {
  const s = d.slide({ title: T11 });
  tag(s, 'Вариант 11А · один график, eRetail Media акцентом');
  s.card({ x: MAIN.x, y: TOP, w: MAIN.w, h: BOT - TOP });
  s.label('Объём рекламного рынка по медиа, млрд руб.', { x: 94, y: 255, w: 1000, color: C.blue });
  const P = { x: 100, y: 362, w: 1030, h: 540 };
  const MAX = 2400;
  const m = chartMap('col', N11, P, 0, MAX);
  forecastBand(s, m, N11 - 2, P.y - 56, P.y + P.h);
  s.chart('col', STACK.map((st) => ({ name: st.key, labels: AD.years, values: AD.S[st.key] })),
    { x: P.x - 20, y: P.y - 20, w: P.w + 40, h: P.h + 40, plot: P, min: 0, max: MAX, stacked: true, values: false, legend: false,
      gap: 38, colors: STACK.map((st) => st.color), extra: { catAxisHidden: true } });
  s.seg(P.x, m.val(0), P.x + P.w, m.val(0), { color: C.line, width: 2 });
  AD.total.forEach((v, i) => {
    const key = i === I22 || i === I27;
    s.text(int(v), { x: m.cat(i) - 40, y: m.val(v) - (key ? 28 : 23), w: 80, size: key ? 19 : 15, bold: true, color: C.navy, align: 'center' });
    s.text(AD.years[i], { x: m.cat(i) - 32, y: m.val(0) + 10, w: 64, size: 15, bold: key, color: C.navy, align: 'center' });
    const g = AD.dyn[i] * 100;
    s.text(`${g < 0 ? '–' : '+'}${Math.round(Math.abs(g))}%`, { x: m.cat(i) - 32, y: m.val(0) + 36, w: 64, size: 15, color: g < 0 ? C.crimson : C.blueText, align: 'center' });
  });
  // подписи рядов под осью — справа, как и названия сегментов
  s.text('прирост рынка за год', { x: P.x + P.w + 6, y: m.val(0) + 36, w: 220, size: 15, color: C.blueText });
  endLabels(s, m, I27, P.x + P.w + 6);

  // справа: вывод черновика и две цифры
  const X = SIDE.x;
  const Wc = SIDE.w;
  const ch = 214;
  s.card({ x: X, y: TOP, w: Wc, h: ch, tint: true });
  s.icon('tb:TbTrendingUp', { x: X + 28, y: TOP + 26, size: 44, color: C.crimson });
  s.text(NOTE11, { x: X + 28, y: TOP + 80, w: Wc - 56, h: ch - 100, size: 21, bold: true, lh: 1.2, color: C.navy, fit: true, minSize: 18 });
  const h = (BOT - TOP - ch - 40) / 2;
  statTile(s, { x: X, y: TOP + ch + 20, w: Wc, h, color: C.crimson, size: 56, value: `${pc(eShare(I22))} → ${pc(eShare(I27))}`,
    text: `доля eRetail${NB}Media в рекламном рынке`, delta: `${AD.years[I22]} → ${AD.years[I27]} (прогноз)` });
  statTile(s, { x: X, y: TOP + ch + 40 + h, w: Wc, h, color: C.blue, value: pc((dE / growth) * 100),
    text: `прироста рынка за ${AD.years[I22]}–${AD.years[I27]} приходится на eRetail${NB}Media`, delta: `+${int(dE)} из +${int(growth)} млрд руб.` });
  s.footnote(`${SRC11}. 2026–2027 — прогноз. Доли eRetail Media и вклад в прирост — расчёт OMD`);
}

function slide11B(d) {
  const s = d.slide({ title: T11 });
  tag(s, 'Вариант 11Б · кто вырастил рынок');
  // слева: 2022–2027 крупно
  const LW = 930;
  s.card({ x: 58, y: TOP, w: LW, h: BOT - TOP });
  s.label('Объём рекламного рынка, млрд руб.', { x: 94, y: 255, w: 800, color: C.blue });
  const yrs = AD.years.slice(I22);
  const n = yrs.length;
  const P = { x: 94, y: 362, w: 640, h: 540 };
  const MAX = 2350;
  const m = chartMap('col', n, P, 0, MAX);
  forecastBand(s, m, n - 2, P.y - 56, P.y + P.h);
  const gap = 40;
  s.chart('col', STACK.map((st) => ({ name: st.key, labels: yrs, values: AD.S[st.key].slice(I22) })),
    { x: P.x - 20, y: P.y - 20, w: P.w + 40, h: P.h + 40, plot: P, min: 0, max: MAX, stacked: true, values: false, legend: false,
      gap, colors: STACK.map((st) => st.color), extra: { catAxisHidden: true } });
  s.seg(P.x, m.val(0), P.x + P.w, m.val(0), { color: C.line, width: 2 });
  const bw = m.step / (1 + gap / 100);
  yrs.forEach((yr, j) => {
    const i = I22 + j;
    s.text(int(AD.total[i]), { x: m.cat(j) - 60, y: m.val(AD.total[i]) - 30, w: 120, size: 21, bold: true, color: C.navy, align: 'center' });
    s.text(yr, { x: m.cat(j) - 50, y: m.val(0) + 12, w: 100, size: 18, bold: true, color: C.navy, align: 'center' });
    segLabelsAt(i).filter((g) => g.label).forEach((g) => {
      const hpx = m.val(g.lo) - m.val(g.hi);
      const ym = (m.val(g.lo) + m.val(g.hi)) / 2 - 10;
      if (hpx >= 24) s.text(int(g.v), { x: m.cat(j) - bw / 2, y: ym, w: bw, size: 16, bold: true, color: C.white, align: 'center' });
      else if (g.key === 'eRetail Media') s.text(int(g.v), { x: m.cat(j) + bw / 2 + 5, y: ym, w: 40, size: 16, bold: true, color: C.crimson });
    });
  });
  endLabels(s, m, I27, P.x + P.w + 8, { size: 17, values: false, w: 58 + LW - 20 - (P.x + P.w + 8) });

  // справа: вклад в прирост
  const RX = 58 + LW + 22;
  const RW = 1862 - RX;
  const RH = 532;
  s.card({ x: RX, y: TOP, w: RW, h: RH });
  s.label(`Вклад в прирост рынка ${AD.years[I22]} → ${AD.years[I27]}`, { x: RX + 34, y: 255, w: RW - 68, color: C.blue });
  const nx = RX + 34;
  const bx0 = RX + 220;
  const sx = RX + RW - 34;            // правый край колонки «доля прироста»
  const kx = 0.40;                    // px на 1 млрд руб.
  const ry0 = 342;
  const rp = 57;
  s.text('млрд руб.', { x: bx0, y: ry0 - 42, w: 200, size: 15, color: C.blueText });
  s.text('доля прироста', { x: sx - 160, y: ry0 - 42, w: 160, size: 15, color: C.blueText, align: 'right' });
  CONTRIB.forEach((c, i) => {
    const y = ry0 + i * rp;
    const hero = c.k === 'eRetail Media';
    const name = { 'Наружная реклама': 'Наружная' }[c.k] ?? c.k;
    s.text(name, { x: nx, y: y + 7, w: bx0 - nx - 16, size: 19, bold: hero, color: hero ? C.navy : C.blueText, align: 'right' });
    const w = Math.max(3, Math.abs(c.d) * kx);
    s.box({ x: bx0, y, w, h: 38, fill: hero ? C.crimson : MUTED, r: 0 });
    s.text(signed(c.d), { x: bx0 + w + 12, y: y + (hero ? 4 : 7), w: 120, size: hero ? 24 : 19, bold: true, color: hero ? C.crimson : C.navy });
    s.text(pc((c.d / growth) * 100), { x: sx - 100, y: y + (hero ? 4 : 7), w: 100, size: hero ? 24 : 19, bold: hero, color: hero ? C.crimson : C.navy, align: 'right' });
  });
  s.seg(bx0, ry0 - 10, bx0, ry0 + rp * (CONTRIB.length - 1) + 48, { color: C.line, width: 2 });
  const ly = ry0 + rp * CONTRIB.length + 2;
  s.hline(nx, ly, RW - 68);
  s.text(`**Всего +${int(growth)} млрд руб.** — рынок вырос в ${(AD.total[I27] / AD.total[I22]).toFixed(1).replace('.', ',')} раза`,
    { x: nx, y: ly + 14, w: RW - 68, size: 18, color: C.navy });
  // вывод черновика
  const cy = TOP + RH + 22;
  const chh = BOT - cy;
  s.box({ x: RX, y: cy, w: RW, h: chh, fill: C.crimson, r: 25 });
  s.icon('tb:TbTrendingUp', { x: RX + 34, y: cy + (chh - 64) / 2, size: 64, color: C.white });
  s.text(NOTE11, { x: RX + 126, y: cy + 24, w: RW - 160, h: chh - 48, size: 26, bold: true, lh: 1.2, color: C.white, valign: 'middle', fit: true, minSize: 21 });
  s.footnote(`${SRC11}. 2026–2027 — прогноз. Вклад в прирост, доли и кратность роста — расчёт OMD`);
}

// ===================== Слайд 12: CTV =====================
const T12 = 'CTV становится самостоятельным слоем на фоне фрагментации просмотра и роста Smart TV';
const THESIS = 'Территории видеоселлеров смешались: большинство игроков продают рекламу на всех устройствах, что делает [[централизацию видеопланирования обязательной]]';
const SRC12 = 'Источник: https://www.sostav.ru/publication/trendy-reklamy-v-tsifrovykh-media-2027-86219.html';
const CTV = [
  { v: 80, label: 'Smart TV', t: 'Проникновение Smart TV к 2029', color: C.blue, icon: 'tb:TbDeviceTv' },
  { v: 41, label: 'Видеосервисы', t: 'Подписчиков видеосервисов имеют платную подписку без рекламы', color: C.crimson, icon: 'tb:TbAdOff' },
];
const DEVICES = ['tb:TbDeviceTv', 'tb:TbDeviceDesktop', 'tb:TbDeviceLaptop', 'tb:TbDeviceMobile'];
const TRACK = 'E3ECF7';

function slide12A(d) {
  const s = d.slide({ title: T12 });
  tag(s, 'Вариант 12А · тезис + два кольца');
  const LW = 860;
  s.card({ x: 58, y: TOP, w: LW, h: BOT - TOP, tint: true });
  DEVICES.forEach((ic, i) => s.icon(ic, { x: 98 + i * 96, y: 262, size: 76, color: C.white, circle: C.blue }));
  s.text(THESIS, { x: 98, y: 380, w: LW - 80, h: 585, size: 52, bold: true, lh: 1.14, color: C.navy, valign: 'bottom', fit: true, minSize: 40 });

  const cw = (1862 - 58 - LW - 22 - 22) / 2;
  const D = 380;
  CTV.forEach((it, i) => {
    const x = 58 + LW + 22 + i * (cw + 22);
    s.card({ x, y: TOP, w: cw, h: BOT - TOP });
    s.label(it.label, { x: x + 34, y: 255, w: cw - 68, color: it.color });
    const cx = x + cw / 2;
    const cy = 588;
    s.chart('doughnut', [{ name: it.t, labels: [it.t, 'Остальные'], values: [it.v, 100 - it.v] }],
      { x: cx - D / 2, y: cy - D / 2, w: D, h: D, colors: [it.color, TRACK], hole: 70, values: false, legend: false,
        extra: { layout: { x: 0, y: 0, w: 1, h: 1 } } });
    // отверстие кольца — кругом цвета карточки: LibreOffice не понимает holeSize
    const hd = Math.round(D * 0.7);
    s.circle({ x: cx - hd / 2, y: cy - hd / 2, d: hd, fill: C.card });
    s.text(big(it.v, 104), { x: cx - hd / 2, y: cy - 64, w: hd, h: 128, size: 104, bold: true, lh: 1.0, color: C.navy, align: 'center', valign: 'middle' });
    s.text(it.t, { x: x + 34, y: cy + D / 2 + 40, w: cw - 68, h: 100, size: 24, lh: 1.25, color: C.navy, align: 'center', fit: true, minSize: 20 });
  });
  s.footnote(SRC12);
}

function slide12B(d) {
  const s = d.slide({ title: T12 });
  tag(s, 'Вариант 12Б · тезис полосой + две шкалы');
  const th = 320;
  s.box({ x: 58, y: TOP, w: 1804, h: th, fill: C.blue, r: 25 });
  s.icon('tb:TbDevices', { x: 100, y: TOP + (th - 100) / 2, size: 100, color: C.white });
  s.text(THESIS, { x: 250, y: TOP + 30, w: 1570, h: th - 60, size: 48, bold: true, lh: 1.16, color: C.white, accent: 'FFFFFF', valign: 'middle', fit: true, minSize: 36 });

  const y = TOP + th + 22;
  const h = BOT - y;
  const cw = (1804 - 22) / 2;
  CTV.forEach((it, i) => {
    const x = 58 + i * (cw + 22);
    s.card({ x, y, w: cw, h });
    s.icon(it.icon, { x: x + 40, y: y + 30, size: 64, color: C.white, circle: it.color });
    s.label(it.label, { x: x + 124, y: y + 51, w: cw - 170, color: it.color });
    // цифра + подпись
    const ny = y + 104;
    s.text(big(it.v, 150), { x: x + 36, y: ny, w: 420, h: 170, size: 150, bold: true, lh: 1.0, color: C.navy, valign: 'middle' });
    s.text(it.t, { x: x + 410, y: ny + 10, w: cw - 450, h: 150, size: 28, lh: 1.2, color: C.navy, valign: 'middle', fit: true, minSize: 22 });
    // шкала-прогресс
    const bx = x + 40;
    const bw = cw - 80;
    const by = y + h - 96;
    const bh = 46;
    s.box({ x: bx, y: by, w: bw, h: bh, fill: TRACK, r: bh / 2 });
    s.box({ x: bx, y: by, w: bw * it.v / 100, h: bh, fill: it.color, r: bh / 2 });
    // деления по 10% — шкала читается как «8 из 10»
    for (let t = 10; t < 100; t += 10) s.seg(bx + bw * t / 100, by, bx + bw * t / 100, by + bh, { color: C.white, width: 4 });
    [0, 50, 100].forEach((t) => {
      const tx = bx + bw * t / 100;
      const al = t === 0 ? 'left' : t === 100 ? 'right' : 'center';
      s.text(`${t}%`, { x: al === 'left' ? tx : al === 'right' ? tx - 80 : tx - 40, y: by + bh + 10, w: 80, size: 16, color: C.blueText, align: al });
    });
  });
  s.footnote(SRC12);
}

module.exports = { 10: [slide10A, slide10B], 11: [slide11A, slide11B], 12: [slide12A, slide12B] };
