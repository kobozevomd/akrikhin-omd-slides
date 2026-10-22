// Варианты визуала для слайдов 13–15 деки Comprehensive (инфлюенс-маркетинг и челленджи медиапространства).
// По два варианта на слайд — на выбор. Данные — из json черновика.
const path = require('path');
const { C, ACCENTS, chartMap, textWidth, countLines, columns, typo } = require('../../lib/akrikhin');
const { SRC, MUTED, GRID, TOP, BOT, SIDE, MAIN, tag, numMark, legend } = require('./common');

const SOURCE = 'Источник: OMD Snapshot, города 1М+, 18–55, 625 респондентов, 1–3.07.2026 W19, онлайн-опрос Tiburon Research';
const INSTA = '*Instagram принадлежит Meta, деятельность которой признана экстремистской и запрещена в РФ';

// Доли из черновика (0…1) → целые проценты. chartData из common округляет до 0,1 — для долей не подходит.
function shares(n, k = 0) {
  const j = require(path.join(SRC, `slide-${String(n).padStart(2, '0')}.json`));
  const p = j.shapes.filter((sh) => sh.t === 'CHART')[k].chart.plots[0];
  return p.cats.map((c, i) => ({ name: String(c).trim(), v: Math.round(p.series[0].values[i] * 100) }));
}
const ratio = (a, b) => (Math.round((a / b) * 10) / 10).toFixed(1).replace('.', ',');

// Шкала-прогресс: дорожка + заливка доли v (0…100)
function progress(s, { x, y, w, v, h = 16, track = C.tint, fill = C.blue, trackT }) {
  s.box({ x, y, w, h, fill: track, r: h / 2, transparency: trackT });
  s.box({ x, y, w: Math.max(h, (w * v) / 100), h, fill, r: h / 2 });
}

// Чипы в строку с переносом. items: [[текст, выделен?, иконка?]]. Возвращает высоту блока.
function chips(s, items, { x, y, w, size = 17, h = 40, gap = 10, pad = 34, color = C.blue }) {
  let cx = x;
  let cy = y;
  const isz = Math.round(h * 0.5);
  items.forEach(([t, hot, icon]) => {
    const iw = icon ? isz + 8 : 0;
    const tw = Math.ceil(textWidth(t, size, true)) + 8;
    const cw = tw + pad + iw;
    if (cx > x && cx + cw > x + w) { cx = x; cy += h + gap; }
    s.box({ x: cx, y: cy, w: cw, h, fill: hot ? color : C.white, stroke: color, sw: 2, r: h / 2 });
    if (icon) s.icon(icon, { x: cx + pad / 2, y: cy + (h - isz) / 2, size: isz, color: hot ? C.white : color });
    s.text(t, { x: cx + pad / 2 + iw, y: cy, w: tw, h, size, bold: true, lh: 1.0, color: hot ? C.white : C.navy, align: 'center', valign: 'middle' });
    cx += cw + gap;
  });
  return cy + h - y;
}

// ===================== Слайд 13: диверсификация инфлюенс-рынка =====================
const T13 = 'Идет диверсификация рынка, больше половины блогеров хотят идти на новые платформы';
const BR = shares(13, 0);   // используемые брендами: Telegram, ВК, YouTube, Макс, RuTube
const INF = shares(13, 1);  // используемые инфлюенсерами: Telegram, ВК, YouTube, Instagram*, Макс
const TR = {
  diver: [76, 'рекламодателей называют диверсификацию ключевым трендом инфлюенс-рынка'],
  budget: [42, 'рекламодателей планируют увеличить бюджет на рекламу в социальных сетях и мессенджерах в 2027\u00a0году'],
  blog: [64, 'блогеров планируют осваивать новые платформы в 2027\u00a0году'],
};
// объединённый список площадок: сначала топ брендов, потом то, что есть только у инфлюенсеров
const PLATFORMS = [...BR.map((p) => p.name), ...INF.map((p) => p.name).filter((n) => !BR.some((b) => b.name === n))];
const val13 = (list, name) => (list.find((p) => p.name === name) || {}).v ?? null;

function slide13A(d) {
  const s = d.slide({ title: T13 });
  tag(s, 'Вариант 13А · три цифры + бренды vs инфлюенсеры');
  // слева: главная цифра (блогеры) и две цифры рекламодателей
  const L = { x: 58, w: 452 };
  const th = 326;
  s.box({ x: L.x, y: TOP, w: L.w, h: th, fill: C.crimson });
  s.text(`${TR.blog[0]}%`, { x: L.x + 28, y: TOP + 26, w: 300, size: 72, bold: true, lh: 1.1, color: C.white });
  s.text(TR.blog[1], { x: L.x + 28, y: TOP + 120, w: L.w - 56, size: 21, lh: 1.2, color: C.white });
  // шкала «больше половины»: заливка 64%, риска на 50%
  const px = L.x + 28;
  const pw = L.w - 56;
  const py = TOP + 226;
  progress(s, { x: px, y: py, w: pw, v: TR.blog[0], h: 18, track: C.white, trackT: 70, fill: C.white });
  const x50 = px + pw / 2;
  s.seg(x50, py - 8, x50, py + 26, { color: C.navy, width: 2.5 });
  s.text('половина', { x: x50 - 60, y: py + 34, w: 120, size: 15, bold: true, color: C.white, align: 'center' });

  const cy = TOP + th + 20;
  s.card({ x: L.x, y: cy, w: L.w, h: BOT - cy });
  s.label('Рекламодатели', { x: L.x + 28, y: cy + 30, w: L.w - 56, size: 20, color: C.blue });
  let ry = cy + 72;
  [TR.diver, TR.budget].forEach(([v, t], k) => {
    s.text(`${v}%`, { x: L.x + 28, y: ry, w: 200, size: 54, bold: true, lh: 1.1, color: C.navy });
    const h = s.text(t, { x: L.x + 28, y: ry + 66, w: L.w - 56, size: 19, lh: 1.2, color: C.blueText });
    if (k === 0) s.hline(L.x + 28, ry + 66 + h + 26, L.w - 56);
    ry += 66 + h + 52;
  });

  // справа: бренды vs инфлюенсеры по объединённому списку
  const R = { x: 532, w: 1330 };
  s.card({ x: R.x, y: TOP, w: R.w, h: BOT - TOP });
  s.label('Топ-5 платформ: используемые брендами и инфлюенсерами', { x: R.x + 36, y: 255, w: 1000, color: C.blue });
  legend(s, R.x + 36, 302, [[C.blue, 'Бренды'], [C.crimson, 'Инфлюенсеры']], { dir: 'row', gap: 170, size: 18 });
  const n = PLATFORMS.length;
  const P = { x: R.x + 230, y: 360, w: 990, h: 560 };
  const lo = 0;
  const hi = 0.9;
  const m = chartMap('bar', n, P, lo, hi);
  // тонкие разделители строк
  for (let i = 1; i < n; i++) s.seg(R.x + 36, m.cat(i) - m.step / 2, P.x + P.w, m.cat(i) - m.step / 2, { color: GRID, width: 1.25 });
  const GAP = 60;
  const OV = -10;
  s.chart('bar', [
    { name: 'Бренды', labels: PLATFORMS, values: PLATFORMS.map((p) => (val13(BR, p) ?? 0) / 100) },
    { name: 'Инфлюенсеры', labels: PLATFORMS, values: PLATFORMS.map((p) => (val13(INF, p) ?? 0) / 100) },
  ], { x: P.x - 10, y: P.y - 10, w: P.w + 120, h: P.h + 20, plot: P, min: lo, max: hi, colors: [C.blue, C.crimson], gap: GAP, overlap: OV,
    legend: false, format: '0%;;;', labelSize: 18, labelBold: true, extra: { catAxisHidden: true } });
  s.seg(P.x, P.y, P.x, P.y + P.h, { color: C.line, width: 2 });
  // ширина полосы в кластере: step / (n − (n−1)·overlap + gap)
  const bw = m.step / (2 - OV / 100 + GAP / 100);
  const off = (bw * (1 - OV / 100)) / 2;
  PLATFORMS.forEach((p, i) => {
    s.text(p, { x: R.x + 36, y: m.cat(i) - 13, w: P.x - 20 - (R.x + 36), size: 21, bold: true, color: C.navy, align: 'right' });
    [[BR, -off], [INF, off]].forEach(([list, dy]) => {
      if (val13(list, p) == null) {
        s.text('нет в топ-5', { x: P.x + 12, y: m.cat(i) + dy - 10, w: 200, size: 15, color: C.blueText });
      }
    });
  });
  s.text(INSTA, { x: R.x + 36, y: BOT - 46, w: R.w - 72, size: 14, color: C.blueText });
  s.footnote(SOURCE);
}

function slide13B(d) {
  const s = d.slide({ title: T13 });
  tag(s, 'Вариант 13Б · цифры в ряд + два рейтинга в одной шкале');
  const cols = columns(3, { gap: 22 });
  const th = 214;
  // главная цифра — блогеры, малиновым; рекламодатели — спокойнее
  [[TR.blog, true], [TR.diver, false], [TR.budget, false]].forEach(([[v, t], hot], i) => {
    const { x, w } = cols[i];
    if (hot) s.box({ x, y: TOP, w, h: th, fill: C.crimson });
    else s.card({ x, y: TOP, w, h: th });
    s.text(`${v}%`, { x: x + 30, y: TOP + 24, w: 260, size: 64, bold: true, lh: 1.1, color: hot ? C.white : C.navy });
    s.text(t, { x: x + 30, y: TOP + 24 + 70 + 14, w: w - 60, size: 20, lh: 1.2, color: hot ? C.white : C.blueText });
  });

  const y0 = TOP + th + 22;
  const halves = columns(2, { gap: 22 });
  const lo = 0;
  const hi = 0.9;
  [[BR, 'Используемые брендами'], [INF, 'Используемые инфлюенсерами']].forEach(([list, title], k) => {
    const { x, w } = halves[k];
    s.card({ x, y: y0, w, h: BOT - y0 });
    s.label(title, { x: x + 36, y: y0 + 32, w: w - 72, size: 20, color: C.blue });
    const P = { x: x + 190, y: y0 + 86, w: w - 300, h: BOT - y0 - 86 - 64 };
    const m = s.chart('bar', [{ name: title, labels: list.map((p) => p.name), values: list.map((p) => p.v / 100) }],
      { x: P.x - 10, y: P.y - 10, w: P.w + 120, h: P.h + 20, plot: P, min: lo, max: hi, gap: 85, legend: false,
        colors: list.map((p) => (p.name === 'Telegram' ? C.blue : MUTED)), format: '0%', labelSize: 20, labelBold: true,
        extra: { catAxisHidden: true } });
    s.seg(P.x, P.y, P.x, P.y + P.h, { color: C.line, width: 2 });
    list.forEach((p, i) => s.text(p.name, { x: x + 36, y: m.cat(i) - 13, w: P.x - 18 - (x + 36), size: 20, bold: p.name === 'Telegram',
      color: C.navy, align: 'right' }));
    // площадка, которой нет в топ-5 другой группы
    const other = k === 0 ? INF : BR;
    list.forEach((p, i) => {
      if (other.some((o) => o.name === p.name)) return;
      s.text(k === 0 ? 'нет в топ-5 инфлюенсеров' : 'нет в топ-5 брендов', { x: m.val(p.v / 100) + 76, y: m.cat(i) - 10, w: 300, size: 16, color: C.blueText });
    });
    if (k === 1) s.text(INSTA, { x: x + 36, y: BOT - 46, w: w - 72, size: 14, color: C.blueText });
  });
  s.footnote(SOURCE);
}

// ===================== Слайд 14: Telegram и точки роста =====================
const T14 = 'Рекламодатели продолжают выбирать ТГ';
const BUD = shares(14, 0);   // Telegram 42, ВК 19, YouTube 9
const [TG, VK, YT] = BUD;
const ICON = { Telegram: 'tb:TbBrandTelegram', 'ВК': 'tb:TbBrandVk', YouTube: 'tb:TbBrandYoutube' };
const GROW = [
  [43, 'блогеров испытывают сложности с поиском рекламодателей'],
  [28, 'сложности с монетизацией на нескольких платформах'],
  [89, 'блогеров полностью или скорее согласны, что единый кабинет для управления монетизацией на всех платформах помог бы им в развитии'],
];
const GROW_ICON = ['tb:TbUserSearch', 'tb:TbCoins', 'tb:TbLayoutDashboard'];
const BUD_LABEL = 'Площадки с наибольшей долей в бюджете рекламодателей на инфлюенс-маркетинг';

function slide14A(d) {
  const s = d.slide({ title: T14 });
  tag(s, 'Вариант 14А · Telegram крупно + точки роста');
  s.card({ x: MAIN.x, y: TOP, w: MAIN.w, h: BOT - TOP });
  s.label(BUD_LABEL, { x: 94, y: 255, w: 1250, color: C.blue });
  const P = { x: 420, y: 340, w: 860, h: 600 };
  const lo = 0;
  const hi = 0.5;
  const GAP = 140;
  const m = s.chart('bar', [{ name: 'Доля в бюджете', labels: BUD.map((p) => p.name), values: BUD.map((p) => p.v / 100) }],
    { x: P.x - 10, y: P.y - 10, w: P.w + 20, h: P.h + 20, plot: P, min: lo, max: hi, gap: GAP, legend: false, values: false,
      colors: BUD.map((p) => (p === TG ? C.blue : MUTED)), extra: { catAxisHidden: true } });
  const bh = m.step / (1 + GAP / 100);
  s.seg(P.x, P.y + 20, P.x, P.y + P.h - 20, { color: C.line, width: 2 });
  BUD.forEach((p, i) => {
    const hot = p === TG;
    const y = m.cat(i);
    s.icon(ICON[p.name], { x: 94, y: y - 30, size: 60, color: C.white, circle: hot ? C.blue : MUTED });
    s.text(p.name, { x: 172, y: y - 16, w: P.x - 20 - 172, size: 26, bold: true, color: C.navy });
    const sz = hot ? 72 : 34;
    s.text(`${p.v}%`, { x: m.val(p.v / 100) + 18, y: y - sz * 0.6, w: 220, size: sz, bold: true, lh: 1.1, color: hot ? C.blue : C.navy });
  });
  // «во сколько раз» — прямо внутри полосы Telegram, от уровня ВК
  const xv = m.val(VK.v / 100);
  s.seg(xv, m.cat(0) - bh / 2, xv, m.cat(1) - bh / 2, { color: C.navy, width: 2, dash: 'dash' });
  s.text(`в ${ratio(TG.v, VK.v)} раза больше, чем ВК`, { x: xv + 22, y: m.cat(0) - 14, w: m.val(TG.v / 100) - xv - 30, size: 24, bold: true,
    color: C.white });

  // справа: точки роста рынка
  const X = SIDE.x;
  const Wc = SIDE.w;
  const ch = 430;
  s.card({ x: X, y: TOP, w: Wc, h: ch });
  s.label('Точки роста рынка', { x: X + 28, y: TOP + 28, w: Wc - 56, size: 20, color: C.crimson });
  GROW.slice(0, 2).forEach(([v, t], k) => {
    const y = TOP + 80 + k * 180;
    numMark(s, X + 28, y + 12, k + 1, C.navy);
    s.text(`${v}%`, { x: X + 84, y, w: 200, size: 54, bold: true, lh: 1.1, color: C.navy });
    s.text(t, { x: X + 84, y: y + 66, w: Wc - 112, size: 19, lh: 1.2, color: C.blueText });
    if (k === 0) s.hline(X + 28, y + 158, Wc - 56);
  });
  const ty = TOP + ch + 20;
  s.box({ x: X, y: ty, w: Wc, h: BOT - ty, fill: C.crimson });
  s.badge({ x: X + 28, y: ty + 34, d: 40, n: 3, color: C.white, textColor: C.crimson, size: 22 });
  s.text(`${GROW[2][0]}%`, { x: X + 84, y: ty + 20, w: 300, size: 64, bold: true, lh: 1.1, color: C.white });
  s.text(GROW[2][1], { x: X + 84, y: ty + 20 + 70 + 16, w: Wc - 112, size: 22, lh: 1.25, color: C.white });
  s.footnote(`${SOURCE}. Кратность — расчёт OMD`);
}

function slide14B(d) {
  const s = d.slide({ title: T14 });
  tag(s, 'Вариант 14Б · 1 квадрат = 1% + шкалы точек роста');
  // сверху: полоса-сравнение площадок, один квадрат — один процент
  const ch = 404;
  s.card({ x: 58, y: TOP, w: 1804, h: ch });
  s.label(`${BUD_LABEL}, %`, { x: 94, y: 255, w: 1400, color: C.blue });
  s.box({ x: 1742, y: 256, w: 22, h: 22, fill: MUTED, r: 4 });
  s.text('= 1%', { x: 1772, y: 255, w: 60, size: 17, bold: true, color: C.navy });
  const q = 26;
  const qp = 31;
  const x0 = 330;
  const rowY = [336, 428, 520];
  BUD.forEach((p, i) => {
    const hot = p === TG;
    const y = rowY[i];
    s.icon(ICON[p.name], { x: 94, y: y - 10, size: 44, color: C.white, circle: hot ? C.blue : MUTED });
    s.text(p.name, { x: 152, y: y - 1, w: 170, size: 22, bold: true, color: C.navy });
    for (let k = 0; k < p.v; k++) s.box({ x: x0 + k * qp, y, w: q, h: q, fill: hot ? C.blue : MUTED, r: 4 });
    const sz = hot ? 44 : 28;
    s.text(`${p.v}%`, { x: x0 + p.v * qp + 12, y: y + q / 2 - sz * 0.62, w: 140, size: sz, bold: true, lh: 1.1, color: hot ? C.blue : C.navy });
  });
  // вывод — в свободном месте справа, на уровне строк ВК и YouTube
  const cx = 1130;
  s.vline(cx - 30, rowY[1] - 6, rowY[2] - rowY[1] + q + 12, C.blue, 3);
  s.text(`Telegram — в ${ratio(TG.v, VK.v)} раза больше, чем ВК`, { x: cx, y: rowY[1] - 4, w: 1830 - cx, size: 26, bold: true, color: C.navy });
  s.text(`и больше, чем ВК и YouTube вместе: ${VK.v} + ${YT.v} = ${VK.v + YT.v}%`, { x: cx, y: rowY[2] - 1, w: 1830 - cx, size: 22, color: C.blueText });

  // снизу: три точки роста — цифра, шкала, текст; 89% — главная
  const ly = TOP + ch + 26;
  s.label('Точки роста рынка', { x: 58, y: ly, w: 800, size: 22, color: C.crimson });
  const cy = ly + 42;
  const h = BOT - cy;
  columns(3, { gap: 22 }).forEach(({ x, w }, i) => {
    const [v, t] = GROW[i];
    const hot = i === 2;
    if (hot) s.box({ x, y: cy, w, h, fill: C.crimson });
    else s.card({ x, y: cy, w, h });
    s.text(`${v}%`, { x: x + 30, y: cy + 22, w: 240, size: 64, bold: true, lh: 1.1, color: hot ? C.white : C.navy });
    s.icon(GROW_ICON[i], { x: x + w - 30 - 68, y: cy + 24, size: 68, color: hot ? C.crimson : C.blue, circle: hot ? C.white : C.tint });
    progress(s, { x: x + 30, y: cy + 116, w: w - 60, v, h: 18, track: hot ? C.white : C.tint, trackT: hot ? 65 : undefined, fill: hot ? C.white : C.blue });
    s.text(t, { x: x + 30, y: cy + 156, w: w - 60, size: 22, lh: 1.25, color: hot ? C.white : C.blueText });
  });
  s.footnote(`${SOURCE}. Кратность и сумма — расчёт OMD`);
}

// ===================== Слайд 15: ключевые челленджи (текст) =====================
const T15 = 'Ключевые челленджи в медиапространстве';
const CH = [
  {
    t: 'Цена растет,\nа эффективность — нет',
    p: [
      'Инвестиции в диджитал растут быстрее других медиа, в том числе из-за инфляции **10−20%\u00a0YoY**.',
      'Стоимость целевого действия в Q1 2026-го выросла сильнее — **на 26%** (E-Promo Group), то\u00a0есть эффективность падает.',
      'Клик подорожал **лишь на 3%**, что косвенно указывает на рост фрода.',
      'Видимость креативов снижается везде, кроме мобильных баннеров (АЦРИР 2025)',
    ],
  },
  {
    t: 'Видео фрагментируется,\nCTV — ключевой драйвер',
    p: [
      'Видеопотребление не монолитно: все половозрастные группы смотрят **ТВ, CTV, OLV и вертикальное видео**.',
      'Территории видеоселлеров смешались: большинство игроков продают рекламу на всех устройствах, что делает **централизацию видеопланирования обязательной**',
    ],
  },
  {
    t: 'Соцсети и их рекламные\nвозможности стагнируют',
    p: [
      'В соцсетях сохраняются тренды на\n**кросс-платформенность, фабрики контента** (бренды + блогеры/ИИ), форматы «shop now».',
      'Компании переходят к **ROI-внедрению**, разделяя качественные работы и «ИИ-слоп», при этом набирает силу обратный тренд на **нарочито ручной, человеческий контент** и ценность эксперта',
    ],
  },
];
const plain = (t) => typo(t.replace(/\*\*|\[\[|\]\]/g, ''));
// высота пункта: строки × кегль × интерлиньяж
const paraH = (t, size, w, lh = 1.25) => countLines(plain(t), size, w, false) * size * lh;

function slide15A(d) {
  const s = d.slide({ title: T15 });
  tag(s, 'Вариант 15А · три широкие строки');
  const gap = 20;
  const h = (BOT - TOP - gap * 2) / 3;
  const LX = 94;
  const VX = 660;          // разделитель «заголовок | пункты»
  const BX = VX + 44;
  const colGap = 52;
  const bw = (1862 - 40 - BX - colGap) / 2;
  const size = 22;
  const pg = 14;
  CH.forEach((it, i) => {
    const y = TOP + i * (h + gap);
    const col = ACCENTS[i];
    s.card({ x: 58, y, w: 1804, h });
    s.badge({ x: LX, y: y + (h - 70) / 2, d: 70, n: i + 1, color: col });
    s.heading(it.t, { x: LX + 98, y: y + h / 2 - 37, w: VX - 30 - (LX + 98), size: 32 });
    s.vline(VX, y + 30, h - 60);
    // пункты: половина — в левую колонку, половина — в правую; обе колонки начинаются на одной высоте
    const half = Math.ceil(it.p.length / 2);
    const lists = [it.p.slice(0, half), it.p.slice(half)];
    const hgt = (list) => list.reduce((a, p) => a + paraH(p, size, bw - 28), 0) + pg * (list.length - 1);
    const top = y + (h - Math.max(...lists.map(hgt))) / 2;
    lists.forEach((list, c) => {
      const x = BX + c * (bw + colGap);
      let yy = top;
      list.forEach((p) => {
        s.circle({ x, y: yy + size * 0.45, d: 10, fill: col });
        const ph = s.text(p, { x: x + 28, y: yy, w: bw - 28, size, lh: 1.25, color: C.blueText });
        yy += ph + pg;
      });
    });
  });
}

function slide15B(d) {
  const s = d.slide({ title: T15 });
  tag(s, 'Вариант 15Б · колонки с ключевым фактом');
  const cols = columns(3, { gap: 22 });
  const factH = 196;
  const pg = 12;
  // общий кегль текста: самый крупный, при котором влезает самая длинная колонка
  const cw0 = cols[0].w - 78;
  const ty0 = TOP + 70 + 45 + 84 + factH + 28;
  const fits = (sz) => CH.every((it) => it.p.reduce((a, p) => a + paraH(p, sz, cw0), 0) + pg * (it.p.length - 1) <= BOT - 34 - ty0);
  let size = 22;
  while (size > 17 && !fits(size)) size -= 1;
  cols.forEach((col, i) => {
    const it = CH[i];
    const color = ACCENTS[i];
    const { cx, cy, cw } = s.numberedCard({ x: col.x, y: TOP, w: col.w, h: BOT - TOP, n: i + 1, color, d: 70 });
    s.heading(it.t, { x: cx, y: cy - 6, w: cw, h: 70, size: 30 });
    const fy = cy + 84;
    s.box({ x: cx - 12, y: fy, w: cw + 24, h: factH, fill: C.cardTint, stroke: C.line, sw: 1.5 });
    const fx = cx + 12;
    const fw = cw - 24;
    if (i === 0) {
      // две цифры рядом: стоимость целевого действия против стоимости клика
      s.text('Рост стоимости в Q1 2026', { x: fx, y: fy + 20, w: fw, size: 17, bold: true, color: C.blueText });
      const hw = fw / 2;
      [['+26%', 'целевое действие', C.crimson], ['+3%', 'клик', C.navy]].forEach(([v, t, c], k) => {
        const x = fx + k * hw + (k ? 28 : 0);
        s.text(v, { x, y: fy + 54, w: hw - 28, size: 60, bold: true, lh: 1.1, color: c });
        s.text(t, { x, y: fy + 128, w: hw - 28, size: 19, color: C.navy });
      });
      s.vline(fx + hw, fy + 64, 92);
    } else if (i === 1) {
      s.text('Все половозрастные группы смотрят', { x: fx, y: fy + 20, w: fw, size: 17, bold: true, color: C.blueText });
      chips(s, [['ТВ', false, 'tb:TbDeviceTvOld'], ['CTV', true, 'tb:TbDeviceTv'], ['OLV', false, 'tb:TbPlayerPlay'], ['Вертикальное видео', false, 'tb:TbDeviceMobile']],
        { x: fx, y: fy + 60, w: fw, size: 20, h: 50, gap: 12, pad: 30, color });
    } else {
      s.text('Тренды в соцсетях', { x: fx, y: fy + 20, w: fw, size: 17, bold: true, color: C.blueText });
      chips(s, [['Кросс-платформенность', false], ['Фабрики контента', false], ['Shop now', false], ['ROI', false], ['Ручной контент', false]],
        { x: fx, y: fy + 60, w: fw, size: 17, h: 48, gap: 10, pad: 22, color });
    }
    // текст колонки
    let yy = fy + factH + 28;
    it.p.forEach((p) => {
      const ph = s.text(p, { x: cx, y: yy, w: cw, size, lh: 1.25, color: C.blueText });
      yy += ph + pg;
    });
  });
}

module.exports = { 13: [slide13A, slide13B], 14: [slide14A, slide14B], 15: [slide15A, slide15B] };
