// Азелик · стратегия 2027 — часть C: слайды исходника 16–22
// 16 — Search demand dynamics 2026 (Wordstat и Ozon, живые графики + таблица приростов + вывод);
// 17 — Comprehensive-подход доказал эффективность (роль → 3 уровня доказательства → decision gate сегментов);
// 18 — Sprint-модель как слой масштабирования (скрытый);
// 19 — 2026 подтвердил работоспособность full-funnel Digital-системы (скрытый);
// 20 — разделитель «Стратегический подход»;
// 21 — цели и задачи 2027; 22 — ключевые элементы стратегии.
const path = require('path');
const { C, ACCENTS, CHART_COLORS, columns, IN, PT, chartMap, textWidth, fitSize, countLines, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT, MUTED, GRID, fmt, pct, statTile, numMark, legend, yearAxis, gridY
const A = require('./common');                            // SRC, MEDIA, CROPS, fromSource, stageTag, video
const SRC = A.SRC;

const TOP = V.TOP;   // 221 — верх контента
const BOT = V.BOT;   // 1005 — низ контента без плашки
const CB = 905;      // низ контента над плашкой
const X0 = 58;
const X1 = 1862;
const MUTED = V.MUTED;
const GRID = V.GRID;

// ---------- помощники ----------
// Высота и ширина текста так же, как их оценивает s.text — по переведённой строке (EN-сборка пересчитает геометрию)
const plainTr = (text) => typo(tr(String(text))).replace(/\*\*|\[\[|\]\]/g, '');
const measure = (text, w, size = 18, bold = false, lh = 1.2) =>
  Math.round(countLines(plainTr(text), size, w, bold) * size * lh);
const widthOf = (text, size, bold = false) => textWidth(plainTr(text), size, bold);

const charts = (n) => require(path.join(SRC, `slide-${String(n).padStart(2, '0')}.json`))
  .shapes.filter((sh) => sh.t === 'CHART').map((sh) => sh.chart);
// Excel-дата (46020) → 'гггг-мм-дд'
const xlDate = (n) => new Date(Date.UTC(1899, 11, 30) + Number(n) * 86400000).toISOString().slice(0, 10);
const ddmm = (iso) => `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}`;
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const hex = (n) => Math.round(n).toString(16).padStart(2, '0');
// смешение цветов: t = 0 → a, t = 1 → b
const mix = (a, b, t) => [0, 2, 4].map((k) => hex(parseInt(a.substr(k, 2), 16) * (1 - t) + parseInt(b.substr(k, 2), 16) * t)).join('').toUpperCase();
const BAND = mix('FFFFFF', C.crimson, 0.08);   // подсветка периода / ключевой строки
const thin = (v) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');   // 20000 → «20 000»

// Легенда точками в строку, выровненная по правому краю xr (ширины — по переведённому тексту)
function legendRow(s, xr, y, items, { size = 17, gap = 26 } = {}) {
  const ws = items.map(([, t]) => Math.ceil(widthOf(t, size)) + 4);
  let x = xr - ws.reduce((a, w) => a + 28 + w, 0) - gap * (items.length - 1);
  items.forEach(([color, t], k) => {
    s.circle({ x, y: y + (size * 1.2 - 16) / 2, d: 16, fill: color });
    s.text(t, { x: x + 26, y, w: ws[k], size, color: C.navy });
    x += 28 + ws[k] + gap;
  });
}

// Цифра + подпись на одной базовой линии: «+5%» крупно, «vs sales model» мельче справа
function valueUnit(s, { x, y, w, value, unit, size = 64, unitSize = 20, color = C.navy, unitColor = C.blueText }) {
  const vw = Math.ceil(widthOf(value, size, true)) + 6;
  const vh = size * 1.1;
  s.text(value, { x, y, w: vw, size, bold: true, lh: 1.1, color });
  if (unit) {
    // низ подписи — по низу цифры (поправка на разницу нижних выносных элементов)
    const uw = w - vw - 12;
    const uh = measure(unit, uw, unitSize, true);
    s.text(unit, { x: x + vw + 12, y: y + vh - uh - (size - unitSize) * 0.16, w: uw, size: unitSize, bold: true, lh: 1.2, color: unitColor });
  }
  return vh;
}

module.exports = {
  // =====================================================================
  // 16 · Азелик / Search demand dynamics / 2026  (аналог — Acriol 5)
  // =====================================================================
  16: (d) => {
    // Подзаголовок исходника — два предложения (не влезает в 2 строки шапки): первое — подзаголовок,
    // второе (рекомендация на 2027) — нижняя плашка.
    const s = d.slide({
      title: 'Азелик / Search demand dynamics / 2026',
      subtitle: 'Брендовый спрос Азелика заметно усиливается от Sprint к Sprint',
    });
    const [wsC, ozC] = charts(16);
    const wsBar = wsC.plots.find((p) => p.type === 'BarPlot');
    const wsLine = wsC.plots.find((p) => p.type === 'LinePlot');
    const ozLine = ozC.plots.find((p) => p.type === 'LinePlot');
    const isoW = wsLine.cats.map(xlDate);                   // 29.12.2025 … 24.08.2026, 35 недель
    const isoO = ozLine.cats.map(xlDate);                   // 23.03.2026 … 24.08.2026, 23 недели
    const weeks = isoW.map(ddmm);
    const ozWeeks = isoO.map(ddmm);
    const OFF = isoW.indexOf(isoO[0]);                      // 12
    const ser = (plot, key) => plot.series.find((x) => x.name.includes(key)).values.map((v) => Math.round(v));
    const wsAz = ser(wsLine, 'Азелик');
    const wsAcid = ser(wsLine, 'Азелаиновая');
    const wsSk = ser(wsLine, 'Скиноклир');
    const ozAz = ser(ozLine, 'Азелик');
    const ozCat = ser(ozLine, 'категория');
    const ozSk = ser(ozLine, 'Скиноклир');
    const imp = wsBar.series[0].values.map((v) => Math.round(v * 10) / 10);   // показы, млн
    const N = weeks.length;

    // ---- левая карточка: три ряда на общей оси недель ----
    const CARD = { x: X0, y: TOP, w: 1030, h: CB - TOP };
    s.card(CARD);
    const PX0 = 158;
    const PX1 = CARD.x + CARD.w - 30;
    const step = (PX1 - PX0) / N;
    const W = { x: PX0, w: step * N };
    const iOf = (iso) => isoW.indexOf(iso);
    // периоды из подписей цифр: Sprint 1 — март–апрель, Sprint 2 — август
    const SPRINTS = [['Sprint 1', iOf('2026-03-02'), iOf('2026-04-27')], ['Sprint 2', iOf('2026-08-03'), iOf('2026-08-24')]];
    const bands = (P) => SPRINTS.forEach(([, a, b]) => s.box({ x: PX0 + a * step, y: P.y, w: (b - a + 1) * step, h: P.h, fill: BAND, r: 0 }));
    // границы месяцев — тонкие вертикали в каждом ряду
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
      s.seg(W.x, m.val(v), W.x + W.w, m.val(v), { color: v === 0 ? C.line : GRID, width: v === 0 ? 2 : 1.25 });
      s.text(thin(v), { x: PX0 - 76, y: m.val(v) - 10, w: 66, size: 14, color: C.blueText, align: 'right' });
    });
    const lineOpts = (P, max) => ({ x: P.x - 10, y: P.y - 10, w: P.w + 20, h: P.h + 20, plot: P, min: 0, max, values: false, legend: false,
      colors: [MUTED, C.crimson, C.blue], symbol: 'none', lineSize: 2.5, extra: { catAxisHidden: true, catAxisLineShow: false } });
    const LX = CARD.x + 36;
    const LR = CARD.x + CARD.w - 30;

    // Wordstat
    s.label('Wordstat: динамика запросов', { x: LX, y: 245, w: 520, size: 20, color: C.blue });
    legendRow(s, LR, 244, [[C.blue, 'Азелик'], [C.crimson, 'Скиноклир'], [MUTED, 'Азелаиновая кислота']]);
    // подпись исходника «Линии — запросы в абсолютах; столбцы — показы кампании, млн, на правой оси»: столбцы теперь отдельным рядом
    s.text('линии — запросы в абсолютах', { x: LX, y: 272, w: 400, size: 15, color: C.blueText });
    const PW = { ...W, y: 304, h: 196 };
    const mW = chartMap('line', N, PW, 0, 60000);
    bands(PW);
    monthLines(PW);
    grid(mW, [0, 20000, 40000, 60000]);
    SPRINTS.forEach(([name, a, b]) => s.text(name, { x: PX0 + a * step, y: PW.y + 4, w: (b - a + 1) * step, size: 15, bold: true, color: C.crimson, align: 'center' }));
    s.chart('line', [
      { name: 'Wordstat · азелаиновая кислота, запросов', labels: weeks, values: wsAcid },
      { name: 'Wordstat · Скиноклир, запросов', labels: weeks, values: wsSk },
      { name: 'Wordstat · Азелик, запросов', labels: weeks, values: wsAz },
    ], lineOpts(PW, 60000));

    // Ozon (на той же оси недель, с 23.03.2026)
    s.label('Ozon: динамика запросов', { x: LX, y: 527, w: 520, size: 20, color: C.blue });
    legendRow(s, LR, 526, [[C.blue, 'Азелик'], [C.crimson, 'Скиноклир'], [MUTED, 'Категория']]);
    const PO = { x: PX0 + OFF * step, w: step * (N - OFF), y: 574, h: 116 };
    const POfull = { ...W, y: PO.y, h: PO.h };
    const mO = chartMap('line', N, POfull, 0, 10000);
    bands(POfull);
    monthLines(POfull);
    grid(mO, [0, 5000, 10000]);
    s.text(`Данные Ozon доступны с ${ozWeeks[0]}`, { x: PX0 + 14, y: PO.y + 16, w: OFF * step - 28, size: 16, color: C.blueText });
    s.chart('line', [
      { name: 'Ozon · категория, запросов', labels: ozWeeks, values: ozCat },
      { name: 'Ozon · Скиноклир, запросов', labels: ozWeeks, values: ozSk },
      { name: 'Ozon · Азелик, запросов', labels: ozWeeks, values: ozAz },
    ], lineOpts(PO, 10000));

    // показы кампании (вторая ось исходника — отдельным рядом)
    s.label('Показы кампании, млн', { x: LX, y: 714, w: 520, size: 20, color: C.blue });
    const PI = { ...W, y: 770, h: 76 };
    bands({ ...PI, y: PI.y - 22, h: PI.h + 22 });
    s.chart('col', [{ name: 'Показы кампании, млн', labels: weeks, values: imp }],
      { x: PI.x - 10, y: PI.y - 30, w: PI.w + 20, h: PI.h + 30, plot: PI, min: 0, max: 40, colors: [MUTED], legend: false, gap: 30,
        format: '0', labelSize: 14, labelColor: C.blueText, extra: { catAxisHidden: true, catAxisLineShow: false } });
    const mAx = chartMap('col', N, PI, 0, 40);
    s.seg(W.x, PI.y + PI.h, W.x + W.w, PI.y + PI.h, { color: C.line, width: 1.5 });
    // подписи месяцев (узкий декабрь — 1 неделя — подпись шире своей группы, чтобы не рвалась)
    let i0 = 0;
    groups.forEach(([mo, n], gi) => {
      const xa = mAx.cat(i0) - mAx.step / 2;
      const xb = mAx.cat(i0 + n - 1) + mAx.step / 2;
      const lw = Math.max(xb - xa, Math.ceil(widthOf(mo, 15, true)) + 12);
      s.text(mo, { x: (xa + xb) / 2 - lw / 2, y: PI.y + PI.h + 10, w: lw, size: 15, bold: true, color: C.navy, align: 'center' });
      if (gi > 0) s.seg(xa, PI.y + PI.h + 4, xa, PI.y + PI.h + 30, { color: C.line, width: 1.5 });
      i0 += n;
    });

    // ---- правая колонка: приросты среднего недельного спроса (7 цифр исходника) + вывод ----
    const RX = CARD.x + CARD.w + 24;
    const RW = X1 - RX;
    const NW = 158;                                   // колонка цифр
    const cA = RX + RW - 2 * NW;
    const cS = RX + RW - NW;
    s.label('Средний недельный спрос', { x: RX, y: TOP + 4, w: cA - RX - 10, size: 20, color: C.blue });
    s.text('Азелик', { x: cA, y: TOP + 2, w: NW, size: 19, bold: true, color: C.blue, align: 'center', caps: true });
    s.text('Скиноклир', { x: cS, y: TOP + 2, w: NW, size: 19, bold: true, color: C.crimson, align: 'center', caps: true });
    // строки: [площадка · период, Азелик, Скиноклир]; подписи — из подписей плиток исходника («средний недельный спрос» вынесен в заголовок)
    const rows = [
      ['**Wordstat** · Sprint 1 (март–апр) vs янв–фев', '+16%', ''],
      ['**Wordstat** · Sprint 2 (авг) vs янв–фев', '+209%', '+116%'],
      ['**Ozon** · август vs март–апрель', '+22%', '+11%'],
      ['**Wordstat** · Sprint 1 vs PP (март–апр 2025)', '+7,7%', ''],
      ['**Wordstat** · Sprint 2 vs PP (август 2025)', '+98%', ''],
    ];
    const RH = 50;
    let ry = TOP + 40;
    s.hline(RX, ry, RW, C.line, 1.5);
    rows.forEach(([lbl, a, b], i) => {
      if (i === 1) s.box({ x: RX, y: ry + 3, w: RW, h: RH - 6, fill: BAND, r: 10 });
      s.text(lbl, { x: RX + 14, y: ry, w: cA - RX - 24, h: RH, size: 17, color: C.navy, valign: 'middle', fit: true, minSize: 15, maxLines: 2 });
      s.text(a, { x: cA, y: ry, w: NW, h: RH, size: 32, bold: true, lh: 1.0, color: C.blue, align: 'center', valign: 'middle' });
      if (b) s.text(b, { x: cS, y: ry, w: NW, h: RH, size: 32, bold: true, lh: 1.0, color: C.crimson, align: 'center', valign: 'middle' });
      ry += RH;
      s.hline(RX, ry, RW, i === rows.length - 1 ? C.line : GRID, 1.5);
    });

    // вывод исходника: три пункта (жирные места — как в исходнике)
    const conc = [
      ['Второй Sprint значительно усилил брендовый спрос',
        'В Wordstat средний недельный спрос по Азелику вырос на **+209%** к январю–февралю против **+16% в первом Sprint**, а на Ozon — на **+22%**. Это показывает существенное усиление интереса к бренду во втором периоде активности'],
      ['Азелик растёт быстрее Скиноклира',
        'Во втором Sprint рост спроса по Азелику составил **+209% в Wordstat и +22% на Ozon**, против **+116% и +11%** соответственно по Скиноклиру — бренд сохраняет более высокую динамику на обеих площадках'],
      ['Сформированный спрос существенно выше прошлогоднего уровня',
        'Средний недельный спрос по Азелику в августе 2026 года был на **+98% выше августа 2025 года**, подтверждая высокий уровень брендового интереса'],
    ];
    const VY = ry + 22;
    s.card({ x: RX, y: VY, w: RW, h: CB - VY });
    s.label('Вывод', { x: RX + 26, y: VY + 22, w: 300, size: 20, color: C.crimson });
    const tx = RX + 50;
    const tw = RW - 50 - 24;
    const avail = CB - 20 - (VY + 58);
    let fs = 16;
    const blockH = (sz) => conc.map(([h, t]) => measure(h, tw, sz + 2, true) + 4 + measure(t, tw, sz));
    while (fs > 15 && blockH(fs).reduce((a, b) => a + b, 0) + 12 * (conc.length - 1) > avail) fs -= 1;
    const hs = blockH(fs);
    const cgap = Math.min(26, Math.floor((avail - hs.reduce((a, b) => a + b, 0)) / (conc.length - 1)));
    let cy = VY + 58;
    conc.forEach(([h, t], i) => {
      s.circle({ x: RX + 27, y: cy + 6, d: 12, fill: C.crimson });
      const hh = s.text(h, { x: tx, y: cy, w: tw, size: fs + 2, bold: true, lh: 1.2, color: C.navy });
      s.text(t, { x: tx, y: cy + hh + 4, w: tw, size: fs, lh: 1.2, color: C.blueText });
      cy += hs[i] + cgap;
    });

    s.principle({ label: 'Рекомендация', icon: 'tb:TbTrendingUp',
      text: 'В 2027 году стоит масштабировать работающую сегментированную коммуникацию, поддерживать always-on Search и усиливать связку с e-commerce, чтобы конвертировать сформированный брендовый спрос в покупку' });
    s.footnote('Источник: данные Озон* и Яндекс Вордстат, данные Озона за ретроспективный период недоступны\nДинамика категории по данным Яндекс.Вордстата показана по запросу «азелаиновая кислота». Этот запрос менее частотный, чем брендовые запросы по Азелику и Скиноклиру, поэтому линия на графике ниже',
      { y: 1028, w: 1700 });
  },

  // =====================================================================
  // 17 · Comprehensive-подход доказал эффективность
  // =====================================================================
  17: (d) => {
    const s = d.slide({
      title: 'Comprehensive-подход доказал эффективность',
      subtitle: 'Подход валидирован в 2026 году: пост-клик, BHT/SL и бизнес-результаты Спринта подтверждают эффективность и готовность к масштабированию',
    });

    // ── A. Роль подхода: текст слева, схема Sprint → AON → validation справа ──
    s.label('Роль comprehensive-подхода в продвижении Азелик', { x: X0, y: TOP, w: 1000, size: 20, color: C.blue });
    const AY = TOP + 36;
    const roleW = 560;
    s.text('Роль comprehensive-подхода в Азелик — защита лидерства, переключение со Скиноклир и Recruitment новых аудиторий через AI-сегменты и персонализированные креативы',
      { x: X0, y: AY, w: roleW, h: 100, size: 19, lh: 1.25, color: C.navy, fit: true, minSize: 16 });
    const flow = [
      { t: 'Sprint — Defense & Switching', d: '6 AI-сегментов + сегментные креативы' },
      { t: 'AON — Recruitment + Frequency', d: 'новые аудитории + повторный контакт' },
      { t: 'Comprehensive validation', d: 'post-click → BHT → Sales Lift / Business result', hl: true },
    ];
    const FX = X0 + roleW + 36;
    const AG = 52;
    const FW = (X1 - FX - AG * 2) / 3;
    const FH = 100;
    flow.forEach((f, i) => {
      const fx = FX + i * (FW + AG);
      s.box({ x: fx, y: AY, w: FW, h: FH, fill: f.hl ? C.blue : C.cardTint, stroke: f.hl ? undefined : C.line, sw: 2 });
      const th = measure(f.t.toUpperCase(), FW - 36, 17, true, 1.1);
      const dh = measure(f.d, FW - 36, 16);
      const ty = AY + (FH - th - 6 - dh) / 2;
      s.text(f.t.toUpperCase(), { x: fx + 18, y: ty, w: FW - 36, size: 17, bold: true, lh: 1.1, color: f.hl ? C.white : C.navy });
      s.text(f.d, { x: fx + 18, y: ty + th + 6, w: FW - 36, size: 16, lh: 1.2, color: f.hl ? C.white : C.blueText });
      if (i < flow.length - 1) s.arrow({ dir: 'right', x: fx + FW + 10, y: AY + FH / 2, len: AG - 20, head: 30, headLen: 16, stem: 8, color: C.blue });
    });

    // ── B. Три уровня доказательства — главные цифры слайда ──
    const BY = AY + FH + 30;
    s.label('3 уровня доказательства эффективности', { x: X0, y: BY, w: 1000, size: 20, color: C.blue });
    const cols3 = columns(3, { gap: 24 });
    const CY = BY + 36;
    const CH = 206;
    const P = 32;
    cols3.forEach((c) => s.card({ x: c.x, y: CY, w: c.w, h: CH }));
    const cx = (k) => cols3[k].x + P;
    const cw = (k) => cols3[k].w - P * 2;
    const ly = CY + 24;
    const vy = CY + 58;
    ['Business result', 'Sales lift', 'Brand health'].forEach((t, k) => s.label(t, { x: cx(k), y: ly, w: cw(k), size: 20, color: C.navy }));
    // Business result
    let h = valueUnit(s, { x: cx(0), y: vy, w: cw(0), value: '+5%', unit: 'vs sales model' });
    let y = vy + h + 6;
    y += s.text('174,4 млн ₽ продаж', { x: cx(0), y, w: cw(0), size: 22, bold: true, color: C.navy }) + 4;
    s.text('+22% vs Feb | +40% YoY', { x: cx(0), y, w: cw(0), size: 18, color: C.blueText });
    // Sales lift
    h = valueUnit(s, { x: cx(1), y: vy, w: cw(1), value: '+5,8%', unit: 'РК vs pre-период', color: C.crimson });
    valueUnit(s, { x: cx(1), y: vy + h + 4, w: cw(1), value: '+25%', unit: 'post-период vs pre-период', size: 40, unitSize: 18, color: C.crimson });
    // Brand health
    h = valueUnit(s, { x: cx(2), y: vy, w: cw(2), value: '+9 п.п.', unit: 'consideration 64→73%' });
    y = vy + h + 6;
    y += s.text('Prompted BA 37→43% (+6 п.п.)', { x: cx(2), y, w: cw(2), size: 20, bold: true, color: C.navy }) + 6;
    s.text('Usage 17→22% (+5 п.п.)', { x: cx(2), y, w: cw(2), size: 20, bold: true, color: C.navy });

    // ── C. Decision gate по сегментам + новые инструменты 2027 ──
    const GY = CY + CH + 28;
    s.label('4 / 6 сегментов прошли decision gate', { x: X0, y: GY, w: 1000, size: 20, color: C.blue });
    const KY = GY + 36;
    const KH = CB - KY;
    const TW = 588;                                   // карточка «новые инструменты»
    const segX1 = X1 - TW - 24;
    const segCols = columns(3, { x0: X0, x1: segX1, gap: 16 });
    const gate = [
      { pill: 'Масштабировать', color: C.green, items: [
        // неразрывные пробелы и перенос: «CR 0,59%» и «post-period uplift» не рвутся, «uplift» не висит один в строке
        '**Social girl** — CR\u00a00,59%;\n+169% post-period\u00a0uplift',
        '**Ж 18–22 «новые средства»** — CR\u00a00,45%; +111% post-period\u00a0uplift'] },
      { pill: 'Сохранить с изменением роли', color: C.orange, items: [
        '**М 18–25 «проблемная кожа»** — +51% post-period\u00a0uplift → дообучить',
        '**Sport / fitness** — CR\u00a00,68%, но нет устойчивого SL → перенести в широкую аудиторию М 18–25'] },
      { pill: 'Стоп', color: C.crimson, items: [
        '**Students** — CR\u00a00,07%, база SL не сформирована → stop'] },
    ];
    gate.forEach((g, i) => {
      const c = segCols[i];
      s.card({ x: c.x, y: KY, w: c.w, h: KH });
      s.pill(g.pill, { x: c.x, y: KY, w: c.w, h: 44, color: g.color, size: 18 });
      let iy = KY + 44 + 16;
      g.items.forEach((t, k) => {
        if (k) { s.hline(c.x + 20, iy - 8, c.w - 40, C.line, 1.5); iy += 4; }
        iy += s.text(t, { x: c.x + 20, y: iy, w: c.w - 40, size: 17, lh: 1.2, color: C.blueText }) + 14;
      });
    });
    // 2027: вторая часть вывода исходника — список новых инструментов
    const NX = X1 - TW;
    s.card({ x: NX, y: KY, w: TW, h: KH, tint: true });
    const nth = s.text('Внедряем новые инструменты в подход:', { x: NX + 26, y: KY + 18, w: TW - 52, size: 18, bold: true, color: C.navy });
    s.bullets(['Sprint + AON core', 'AI-video & Smart TV/CTV', 'новые AI-подходы к таргетингу', 'GEO/AEO',
      'decision gate для новых тестов: post-click + BLS / brand health + Sales Lift'],
    { x: NX + 26, y: KY + 18 + nth + 10, w: TW - 52, size: 17, gap: 5, color: C.blueText });

    s.principle({ label: '2027', icon: 'target',
      text: 'Сохраняем comprehensive как операционную модель — масштабируем доказанные сегменты и каналы, а не всю модель целиком' });
    s.footnote('Source: IQVIA');
  },

  // =====================================================================
  // 18 · Sprint-модель как слой масштабирования comprehensive-подхода (скрытый)
  // =====================================================================
  18: (d) => {
    const s = d.slide({
      title: 'Sprint-модель как слой масштабирования comprehensive-подхода',
      subtitle: 'Sprint #1 валидирует гипотезы, далее AON удерживает бренд в коммуникационном поле, а Sprint #2 масштабирует эффективные связки на следующем пике категории',
    });
    s.s.hidden = true;

    // ── цикл test → learn → scale ──
    const LW = 1250;                                  // левая часть (цикл)
    s.text('**Comprehensive:** не разовый флайт, а цикл test → learn → scale', { x: X0, y: TOP, w: LW, size: 21, color: C.blue });
    const stages = [
      { t: 'Sprint 1 | Test', d: '2–3 месяца: гипотезы, сегменты, креативы', color: C.blue,
        items: ['быстрый буст медиадавления', 'тест AI-сегментов и креативов', 'оценка CTR / VTR / post-click / CR'] },
      { t: 'AON | Learnings', d: '~2 месяца: удержание контакта + анализ', color: C.cyan,
        items: ['бренд не выпадает из коммуникационного поля', 'анализ BHT / SL / Wordstat', 'фиксируем winners и stop-гипотезы'] },
      { t: 'Sprint 2 | Scale', d: 'следующий пик: масштабирование эффективных связок', color: C.crimson,
        items: ['переносим бюджет в доказанные связки', 'обновляем креативы / AI-video / CTV', 'замеряем инкрементальный вклад'] },
    ];
    const SG = 34;
    const stCols = columns(3, { x0: X0, x1: X0 + LW, gap: SG });
    const SY = TOP + 40;
    const pad = 22;
    const iw = stCols[0].w - pad * 2;
    const dH = Math.max(...stages.map((st) => measure(st.d, iw, 18, true)));
    const bH = Math.max(...stages.map((st) => st.items.reduce((a, t) => a + measure(t, iw - 18, 17) + 5, -5)));
    const SH = pad + 38 + 10 + dH + 14 + bH + pad;
    stages.forEach((st, i) => {
      const c = stCols[i];
      s.card({ x: c.x, y: SY, w: c.w, h: SH });
      s.badge({ x: c.x + pad, y: SY + pad, d: 38, n: i + 1, color: st.color, size: 20 });
      s.text(st.t.toUpperCase(), { x: c.x + pad + 52, y: SY + pad + 7, w: iw - 52, size: 21, bold: true, lh: 1.0, color: C.navy });
      const yy = SY + pad + 38 + 10;
      s.text(st.d, { x: c.x + pad, y: yy, w: iw, size: 18, bold: true, color: C.navy });
      s.hline(c.x + pad, yy + dH + 7, iw);
      s.bullets(st.items, { x: c.x + pad, y: yy + dH + 14, w: iw, size: 17, gap: 5 });
      if (i < stages.length - 1) s.chevron({ cx: c.x + c.w + SG / 2, cy: SY + SH / 2, color: C.crimson, w: 16, h: 26 });
    });
    const noteY = SY + SH + 10;
    const noteH = s.text('Почему важно повторение: первый спринт собирает learning, второй — закрепляет эффект и масштабирует уже проверенные связи, а не повторяет тест с нуля',
      { x: X0, y: noteY, w: LW, size: 16, color: C.blueText });

    // ── справа: кейс Азелик ──
    const KX = X0 + LW + 24;
    const KW = X1 - KX;
    const R1 = noteY + noteH;                          // низ первого ряда
    s.card({ x: KX, y: TOP, w: KW, h: R1 - TOP, tint: true });
    s.label('Кейс Азелик: что доказал Sprint 1', { x: KX + 26, y: TOP + 22, w: KW - 52, size: 19, color: C.navy });
    const cases = [
      { v: '+5%', l: 'vs sales model', d: '+22% vs Feb | +40% YoY', color: C.crimson },
      { v: '+5,8%', l: 'Sales Lift', d: '+25% post vs pre', color: C.crimson },
      { v: '+9 п.п.', l: 'consideration', d: 'PBA +6 п.п. | Usage +5 п.п.', color: C.navy },
      { v: '4/6', l: 'segments passed', d: 'winners идут в Sprint 2', color: C.navy },
    ];
    const cw2 = (KW - 52 - 20) / 2;
    const gy0 = TOP + 62;
    const cellH = (R1 - 18 - gy0 - 14) / 2;
    cases.forEach((c, k) => {
      const gx = KX + 26 + (k % 2) * (cw2 + 20);
      const gy = gy0 + Math.floor(k / 2) * (cellH + 14);
      s.text(c.v, { x: gx, y: gy, w: cw2, size: 42, bold: true, lh: 1.05, color: c.color });
      s.text(c.l, { x: gx, y: gy + 48, w: cw2, size: 17, bold: true, lh: 1.1, color: C.navy });
      s.text(c.d, { x: gx, y: gy + 72, w: cw2, size: 15, lh: 1.2, color: C.blueText });
    });

    // ── ряд 2: отложенный эффект — спрос и продажи ──
    const EY = R1 + 22;
    const ecols = columns(2, { gap: 24 });
    const effects = [
      { lab: 'Отложенный эффект: brand search продолжает расти', head: 'Брендовый спрос после Sprint 1', lines: [
        '**Март (старт Sprint):** [[**+20%**]] к февралю',
        '**Июнь (AON-поддержка):** 130,2 тыс. запросов, [[**+64%**]] к pre-Sprint',
        '**Вывод:** динамика брендового спроса сохраняет положительный тренд в период AON-поддержки, AON может поддерживать накопленный эффект между спринтами'] },
      { lab: 'Продажи сохраняются после Sprint', head: 'Эффект Sprint Азелика (10–18 недели)', lines: [
        '**Во время Sprint:** [[**+20%**]] в рублях / [[**+19%**]] в упаковках vs pre-Sprint',
        '**После Sprint:** рост продолжился, пик на 20 неделе — 21,7 млн ₽ / 28,1 тыс. упаковок',
        '**Вывод:** Sprint формирует накопительный эффект — спрос растёт после завершения флайта при сохранении присутствия бренда'] },
    ];
    const ew = ecols[0].w - 56;
    const ES = 17;
    const eH = 22 + Math.max(...effects.map((e) => 20 + 12 + measure(e.head.toUpperCase(), ew, ES, true, 1.15) + 10
      + e.lines.reduce((a, t) => a + measure(t, ew, ES) + 8, -8))) + 22;
    effects.forEach((e, i) => {
      const c = ecols[i];
      s.card({ x: c.x, y: EY, w: c.w, h: eH });
      let yy = EY + 22;
      yy += s.label(e.lab, { x: c.x + 28, y: yy, w: ew, size: 20, color: C.crimson }) + 12;
      yy += s.text(e.head.toUpperCase(), { x: c.x + 28, y: yy, w: ew, size: ES, bold: true, lh: 1.15, color: C.navy }) + 10;
      e.lines.forEach((t) => { yy += s.text(t, { x: c.x + 28, y: yy, w: ew, size: ES, lh: 1.2, color: C.blueText }) + 8; });
    });

    // ── ряд 3: два спринта = больше, чем два флайта (содержание рекомендации 2027) ──
    const TY = EY + eH + 20;
    s.card({ x: X0, y: TY, w: X1 - X0, h: CB - TY, tint: true });
    const LBW = 300;                                  // слева — метка блока, справа — три шага
    s.text('Два спринта = больше, чем два флайта', { x: X0 + 28, y: TY, w: LBW, h: CB - TY, size: 21, bold: true, lh: 1.1, caps: true,
      color: C.crimson, valign: 'middle', fit: true, minSize: 17 });
    const abc = [
      ['A', 'Проверить гипотезы', 'первый Sprint закладывает тесты сегментов, креативов и каналов'],
      ['B', 'Закрепить эффект', 'AON сохраняет контакт, пока читаем результаты и видим lag в спросе'],
      ['C', 'Масштабировать winners', 'второй Sprint масштабирует проверенные связки, сокращая объем повторного тестирования'],
    ];
    const abcCols = columns(3, { x0: X0 + 28 + LBW + 24, x1: X1 - 28, gap: 30 });
    const abcH = Math.max(...abc.map(([, t, d], i) => measure(t, abcCols[i].w - 44, 19, true) + 4 + measure(d, abcCols[i].w - 44, 17)));
    const y3 = TY + (CB - TY - abcH) / 2;
    abcCols.forEach((c, i) => {
      s.badge({ x: c.x, y: y3 - 3, d: 32, n: abc[i][0], color: C.navy, size: 17 });
      const th = s.text(abc[i][1], { x: c.x + 44, y: y3, w: c.w - 44, size: 19, bold: true, color: C.navy });
      s.text(abc[i][2], { x: c.x + 44, y: y3 + th + 4, w: c.w - 44, size: 17, color: C.blueText });
    });

    s.principle({ label: 'Рекомендация 2027', icon: 'tb:TbRefresh', text: 'Планировать sprint как цикл управления эффективностью' });
    s.footnote('Source: Azelik Sprint review 2026; Akrikhin x OMD Derma Review H1’26; анализ динамики Wordstat по брендовым запросам Азелика');
  },

  // =====================================================================
  // 19 · 2026 подтвердил работоспособность full-funnel Digital-системы (скрытый)
  // =====================================================================
  19: (d) => {
    // Заголовок исходника (3 строки) разбит по двоеточию: заголовок + подзаголовок
    const s = d.slide({
      title: '2026 подтвердил работоспособность full-funnel Digital-системы',
      subtitle: 'Каналы выполняют разные роли, резерв роста — в масштабировании доказанных связок и измерении новых инструментов',
    });
    s.s.hidden = true;

    const RWc = 560;                                  // правая колонка H2 Test & Learn
    const GX1 = X1 - RWc - 28;
    s.label('Как отработали digital-каналы в H1 2026', { x: X0, y: TOP, w: GX1 - X0, size: 20, color: C.blue });
    const ch = [
      { n: 'OLV', role: 'Business-driving video', v: '41–57%', vl: 'доли H1-конверсий «Где\u00a0купить»', color: C.cyan,
        d: 'VTR/CTR выше плана; новый ролик стал лучшим по post-click', h2: 'H2 — масштабирование связки аудитория × креатив × поставщик' },
      { n: 'Paid Search', role: 'Demand capture / lower funnel', v: '27–46%', vl: 'доли H1-конверсий «Где\u00a0купить»', color: C.crimson,
        d: 'брендовые, конкурентные и аптечные сценарии дают измеримый action', h2: 'H2 — усиление purchase-intent, оптимизация РСЯ по качеству' },
      { n: 'Programmatic + Native', role: 'Recruitment / AI-segments', v: '13–16%', vl: 'доли H1-конверсий «Где\u00a0купить»', color: C.blue,
        d: 'CTR выше плана; post-click разделяет сильные и слабые сегменты', h2: 'H2 — масштабирование аудитории после post-click + business validation\u00a0проверки' },
      { n: 'CTV / Smart TV', role: 'Large-screen reach layer', v: '5,2M | 4,1M', vl: 'UU Sprint / Recruitment', color: C.orange,
        d: 'добавление больших экранов в видеомикс', h2: 'H2 — отдельный замер качества контакта и incremental brand effect' },
      { n: 'ORM', role: 'Trust / reputation', v: '+28%', vl: 'брендовый поиск к марту', color: C.green,
        d: 'rating 4,7; выдача «Азелик отзывы» в июне — 100% позитивный TOP', h2: 'Роль подтверждена: поддерживать доверие и защищать брендовый спрос' },
      { n: 'Bloggers', role: 'Reach acceleration', v: '82% | 46%', vl: 'выполнение Sprint / AON', color: C.purple,
        d: 'top-creators перевыполняют план, часть интеграций дает высокую волатильность', h2: 'H2 — резерв авторов, быстрые замены и прогноз по стабильности просмотров' },
    ];
    const gcols = columns(3, { x0: X0, x1: GX1, gap: 20 });
    const GY = TOP + 36;
    const RG = 20;
    const RHc = (CB - GY - RG) / 2;
    const pad = 22;
    const VS = 40;                                     // кегль цифры
    const TS = 17;                                     // кегль текста карточки
    [0, 1].forEach((row) => {
      const items = ch.slice(row * 3, row * 3 + 3);
      const y0 = GY + row * (RHc + RG);
      const iw = gcols[0].w - pad * 2;
      // одинаковые элементы соседних карточек — на одной высоте
      const roleH = Math.max(...items.map((c) => measure(c.role, iw, 20, true, 1.1)));
      const dH = Math.max(...items.map((c) => measure(c.d, iw, TS)));
      items.forEach((c, k) => {
        const g = gcols[k];
        s.card({ x: g.x, y: y0, w: g.w, h: RHc });
        const px = g.x + pad;
        const pw = Math.min(iw, Math.ceil(widthOf(c.n, 16, true)) + 36);
        s.box({ x: px, y: y0 + pad - 2, w: pw, h: 32, fill: c.color, r: 8 });
        s.text(c.n, { x: px, y: y0 + pad - 2, w: pw, h: 32, size: 16, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
        let yy = y0 + pad + 42;
        s.text(c.role, { x: px, y: yy, w: iw, size: 20, bold: true, lh: 1.1, color: C.navy });
        yy += roleH + 12;
        const vw = Math.ceil(widthOf(c.v, VS, true)) + 8;
        s.text(c.v, { x: px, y: yy, w: vw, size: VS, bold: true, lh: 1.05, color: c.color });
        s.text(c.vl, { x: px + vw + 10, y: yy + 2, w: iw - vw - 10, h: VS * 1.05, size: 15, lh: 1.15, color: C.blueText, valign: 'middle', fit: true, minSize: 14 });
        yy += VS * 1.05 + 12;
        s.text(c.d, { x: px, y: yy, w: iw, size: TS, color: C.blueText });
        yy += dH + 16;
        s.hline(px, yy - 8, iw);
        s.text(c.h2, { x: px, y: yy + 2, w: iw, h: y0 + RHc - pad + 6 - (yy + 2), size: TS, bold: true, lh: 1.2, color: C.navy, fit: true, minSize: 15 });
      });
    });

    // ── справа: Learning → H2 Test & Learn ──
    const RX = X1 - RWc;
    s.label('Learning → H2 Test & Learn', { x: RX, y: TOP, w: RWc, size: 20, color: C.blue });
    s.card({ x: RX, y: GY, w: RWc, h: CB - GY, tint: true });
    s.text('H2 2026: Test & Learn', { x: RX + 30, y: GY + 28, w: RWc - 60, size: 26, bold: true, color: C.crimson });
    // «post-click» в Tahoma переносится по дефису — ставим ручной перенос перед словом
    const h2steps = [
      { title: 'AI-video A/B', text: 'master vs AI-адаптации в OLV/CTV; VTR, CTR,\npost-click + BLS / Sales Lift' },
      { title: 'Smart TV / CTV', text: 'сравнение инвентаря / поставщиков по качеству контакта; BLS / Search Lift' },
      { title: 'AI-targeting', text: 'AstraLab AI-clusters vs AiData; CTR, post-click, CR, soc-dem fit' },
      { title: 'GEO / AEO', text: 'проверка нового lower-funnel слоя вокруг горячего спроса и поиска' },
    ];
    const SX = RX + 30;
    const SW = RWc - 60;
    const stw = SW - 38 - 21;
    const sH = h2steps.reduce((a, it) => a + Math.max(38, 5 + measure(it.title, stw, 22, true, 1.0) + 9 + measure(it.text, stw, 18)), 0);
    const SY0 = GY + 96;
    const sgap = Math.max(22, Math.min(64, Math.floor((CB - 34 - SY0 - sH) / (h2steps.length - 1))));
    s.steps(h2steps, { x: SX, y: SY0, w: SW, pitch: 'auto', titleSize: 22, size: 18, gap: sgap });

    s.principle({ label: 'Вывод', icon: 'tb:TbChartLine',
      text: 'Архитектура отработала хорошо: OLV и Search доказали вклад на нижнем этапе воронки, Programmatic — потенциал recruitment, ORM — роль в доверии. Зона роста — лучше измерять и масштабировать сильные связки.' });
  },

  // =====================================================================
  // 20 · Разделитель «Стратегический подход»
  // =====================================================================
  20: (d) => {
    d.section('Стратегический подход');
    d.divider({ title: 'Стратегический подход', kicker: '2027' });
  },

  // =====================================================================
  // 21 · Азелик: цели и задачи 2027  (как цели Clindovit 2 / Acriol 2)
  // =====================================================================
  21: (d) => {
    const s = d.slide({ title: 'Азелик: Цели и задачи 2027' });
    const goals = [
      { icon: 'tb:TbTrendingUp', t: 'Ускорить рост бренда и защитить лидерство',
        d: 'Обеспечить рост Азелика выше рынка: **+14,9% в упаковках и +22,2% в деньгах**, продолжая защищать бренд от переключения на Скиноклир' },
      { icon: 'tb:TbUsersPlus', t: 'Растить проникновение и частоту покупки',
        d: 'Продолжать привлекать новых пользователей категории — прежде всего 18–25 и аудиторию 25–40 — и одновременно формировать привычку **регулярного ежедневного применения Азелика**' },
      { icon: 'tb:TbShieldCheck', t: 'Закрепить территорию долгосрочного контроля акне',
        d: 'Перевести восприятие бренда от средства для борьбы с отдельными высыпаниями к **надежному решению для ежедневного контроля акне**, которое сочетает эффективность лечения и бережный уход за кожей' },
    ];
    const cols = columns(3, { gap: 24 });
    const TILE = 280;
    // ширина, при которой текст занимает столько же строк, но без висящего последнего слова (заголовок 3: «…контроля / акне»)
    const evenW = (t, w, size, bold) => {
      const n = countLines(plainTr(t), size, w, bold);
      if (n < 2) return w;
      let lo = w * 0.5;
      let hi = w;
      while (hi - lo > 1) { const m = (lo + hi) / 2; if (countLines(plainTr(t), size, m, bold) <= n) hi = m; else lo = m; }
      return Math.min(w, Math.ceil(hi) + 6);
    };
    goals.forEach((g, i) => {
      const c = cols[i];
      const col = ACCENTS[i];
      const { cx, cy, cw } = s.numberedCard({ x: c.x, y: TOP, w: c.w, h: BOT - TOP, n: i + 1, color: col });
      // плитка как s.tile, но заголовок — выровненной ширины
      s.box({ x: cx, y: cy, w: cw, h: TILE, fill: col });
      s.icon(g.icon, { x: cx + 16, y: cy + 16, size: 64, color: C.white });
      s.text(g.t, { x: cx + 16, y: cy + TILE - 18 - 112, w: evenW(g.t, cw - 32, 32, true), h: 112, size: 32, bold: true, lh: 1.1,
        color: C.white, fit: true, valign: 'bottom' });
      const ty = cy + TILE + 34;
      s.text(g.d, { x: cx, y: ty, w: cw, h: BOT - 36 - ty, size: 29, lh: 1.25, color: C.blueText, fit: true, minSize: 22 });
    });
  },

  // =====================================================================
  // 22 · Ключевые элементы стратегии Азелик
  // =====================================================================
  22: (d) => {
    // Заголовок исходника — капсом; год «2026» — как в исходнике (см. отчёт)
    const s = d.slide({ title: 'Ключевые элементы стратегии Азелик в 2026 году' });
    const els = [
      { n: '#1', t: 'Recruitment', icon: 'tb:TbUserPlus',
        d: 'Переключать аудиторию потребителей косметических и медицинских средств как основной источник роста бизнеса и доли рынка' },
      { n: '#2', t: 'Frequency', icon: 'tb:TbRepeat',
        d: 'Увеличение частоты использования за счёт обучения аудитории и частоты контакта' },
      { n: '#3', t: 'Defense\n& Switching', icon: 'tb:TbShield',
        d: 'Защититься от основного конкурента Скиноклир через переключение молодой аудитории на Азелик' },
    ];
    const cols = columns(3, { gap: 24 });
    const D = 330;
    const DS = 30;                                    // кегль описания
    const pw = cols[0].w - 80;
    const textH = Math.max(...els.map((e) => measure(e.d, pw, DS, false, 1.25)));
    const G = D + 48 + textH;                         // круг + описание, по центру карточки
    const gy = TOP + Math.max(70, Math.round((BOT - TOP - G) / 2 + 24));
    els.forEach((e, i) => {
      const c = cols[i];
      const col = ACCENTS[i];
      s.card({ x: c.x, y: TOP, w: c.w, h: BOT - TOP });
      const px = c.x + 40;
      s.text(e.n, { x: px, y: TOP + 32, w: 140, size: 44, bold: true, lh: 1.0, color: col });
      const ccx = c.x + c.w / 2;
      s.circle({ x: ccx - D / 2, y: gy, d: D, fill: col });
      // иконка + название — группой по центру круга
      const termH = Math.min(2, countLines(plainTr(e.t), 38, D - 60, true)) * 38 * 1.05;
      const g0 = gy + (D - (72 + 18 + termH)) / 2;
      s.icon(e.icon, { x: ccx - 36, y: g0, size: 72, color: C.white });
      s.text(e.t, { x: ccx - D / 2 + 30, y: g0 + 90, w: D - 60, h: termH + 6, size: 38, bold: true, lh: 1.05, color: C.white, align: 'center', valign: 'top', fit: true, minSize: 26, maxLines: 2 });
      s.text(e.d, { x: px, y: gy + D + 48, w: pw, h: BOT - 30 - (gy + D + 48), size: DS, lh: 1.25, color: C.blueText, fit: true, minSize: 22 });
    });
  },
};
