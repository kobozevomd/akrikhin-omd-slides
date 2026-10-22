// Акриол Про · стратегия 2027 — часть A: слайды исходника 1–7
// (обложка, цели 2027, digital compete, креативы конкурентов, поисковый спрос, ЦА, сегменты по CJM)
const path = require('path');
const { execFileSync } = require('child_process');
const { C, ACCENTS, CHART_COLORS, columns, IN, PT, chartMap, textWidth, fitSize, countLines, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT, MUTED, GRID, fmt, pct, statTile, numMark, legend, yearAxis, gridY
const SRC = path.join(__dirname, '..', '..', '..', 'work', 'brands', 'acriol', 'src');
const MEDIA = path.join(SRC, 'media');
const SOURCE_PPTX = path.join(__dirname, '..', '..', '..', 'work', 'brands', 'acriol', 'source.pptx');

const TOP = V.TOP;          // 221 — верх контента
const BOT = V.BOT;          // 1005 — низ контента без плашки
const MUTED = V.MUTED;      // A9BFD9 — фоновые серии
const MUTED2 = '64BEE8';    // второй фоновый (голубой, читается на белом)
const GRID = V.GRID;

// ---------- помощники ----------
const charts = (n) => require(path.join(SRC, `slide-${String(n).padStart(2, '0')}.json`))
  .shapes.filter((sh) => sh.t === 'CHART').map((sh) => sh.chart);
const f2 = (v) => v.toFixed(2).replace('.', ',');
const f1 = (v) => v.toFixed(1).replace('.', ',');
// Excel-дата (46020) → 'дд.мм.гггг'
const xlDate = (n) => {
  const dt = new Date(Date.UTC(1899, 11, 30) + Number(n) * 86400000);
  return `${String(dt.getUTCDate()).padStart(2, '0')}.${String(dt.getUTCMonth() + 1).padStart(2, '0')}.${dt.getUTCFullYear()}`;
};
const hex = (n) => Math.round(n).toString(16).padStart(2, '0');
// смешение цветов: t = 0 → a, t = 1 → b
const mix = (a, b, t) => [0, 2, 4].map((k) => hex(parseInt(a.substr(k, 2), 16) * (1 - t) + parseInt(b.substr(k, 2), 16) * t)).join('').toUpperCase();
const BAND = mix('FFFFFF', C.crimson, 0.08);   // подсветка периода
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

// файл из исходного .pptx (видео креатива и его обложка не выгружены в media/)
function fromSource(entry) {
  return execFileSync('unzip', ['-p', SOURCE_PPTX, entry], { maxBuffer: 64 * 1024 * 1024 });
}

module.exports = {
  // ===================== 1. Обложка =====================
  1: (d) => {
    const s = d.cover({ title: 'Acriol Pro' });
    s.text('Strategic approach 2027 by OMD', { x: 296, y: 716, w: 1328, size: 44, lh: 1.1, color: C.white, align: 'center' });
  },

  // ===================== 2. Четыре цели 2027 =====================
  2: (d) => {
    const s = d.slide({ title: 'Акриол 2027: Защитить лидерство, ускорить рост в аппаратной косметологии и расширить профессиональное использование' });
    const goals = [
      { icon: 'tb:TbShieldCheck', t: 'Защитить лидерство Акриол\u00a0Про в косметологии',
        d: 'Сохранить долю и статус препарата выбора в инъекционных процедурах и противостоять усилению конкурентов, включая новые косметологические анестетики и ЛС' },
      { icon: 'tb:TbTrendingUp', t: 'Обеспечить рост в аппаратной косметологии',
        d: 'Увеличить долю назначений Акриол Про за счёт отстройки от косметологических анестетиков и более активного присутствия в профессиональной среде' },
      { icon: 'tb:TbUsersGroup', t: 'Расширить использование бренда среди специалистов и потребителей',
        // в исходнике описание дословно повторяет цель 1 — оставлено как есть (ошибка исходника, в отчёте)
        d: 'Сохранить долю и статус препарата выбора в инъекционных процедурах и противостоять усилению конкурентов, включая новые косметологические анестетики и ЛС' },
      { icon: 'tb:TbDeviceAnalytics', t: 'Выстроить эффективную digital-стратегию на весь год',
        d: 'Сформировать оптимальный медиамикс с сохранением digital KPI 2026 года, обеспечить качественное попадание в ЦА, рост SOV и конверсию в использование и покупку' },
    ];
    const cols = columns(4, { gap: 24 });
    const TILE = 340;
    goals.forEach((g, i) => {
      const c = cols[i];
      const col = ACCENTS[i];
      const { cx, cy, cw } = s.numberedCard({ x: c.x, y: TOP, w: c.w, h: BOT - TOP, n: i + 1, color: col });
      s.tile({ x: cx, y: cy, w: cw, h: TILE, color: col, icon: g.icon, iconSize: 64, text: g.t, size: 30, textH: 180 });
      s.text(g.d, { x: cx, y: cy + TILE + 32, w: cw, h: BOT - 36 - (cy + TILE + 32), size: 23, lh: 1.25, fit: true, minSize: 18 });
    });
  },

  // ===================== 3. Digital compete =====================
  3: (d) => {
    const s = d.slide({
      title: 'Acriol Pro / Digital compete',
      subtitle: 'Акриол сохраняет лидерство в категории, однако снижение digital-поддержки в апреле–июне совпало с сокращением доли продаж с 71% до 66%',
    });
    const [salesC, shareC, budC] = charts(3);
    const NAMES = ['Акриол Про', 'Эмла', 'Анеста'];
    const COLS = [C.blue, '93AACB', MUTED2];
    const sales = salesC.plots[0].series.map((sr) => sr.values);                 // 17 мес.: янв 2025 – май 2026
    const share = shareC.plots[0].series.map((sr) => sr.values.map((v) => v * 100));
    const bud0 = budC.plots[0].series;                                            // 19 мес.: янв 2025 – июл 2026
    const budget = ['acriol', 'эмла', 'anesta'].map((k) => bud0.find((sr) => sr.name.toLowerCase().includes(k)).values);
    const N = 19;
    const NS = 17;
    const cats = Array.from({ length: N }, (_, i) => `${String((i % 12) + 1).padStart(2, '0')}.${i < 12 ? 2025 : 2026}`);

    // ---- левая карточка: три ряда на общей оси месяцев ----
    const CARD = { x: 58, y: TOP, w: 1330, h: 905 - TOP };
    s.card(CARD);
    s.label('Динамика инвестиций в digital-медиа и продаж', { x: 94, y: 249, w: 760, color: C.blue });
    V.legend(s, 920, 247, NAMES.map((n, k) => [COLS[k], n]), { dir: 'row', gap: 150, size: 17 });
    const X0 = 250;
    const X1 = 1360;
    const step = (X1 - X0) / N;
    const full = { x: X0, w: step * N };
    const part = { x: X0, w: step * NS };

    // ряды по вертикали
    const R1 = { y: 330, h: 132 };      // доля
    const R2 = { y: 532, h: 158 };      // продажи
    const R3 = { y: 742, rh: 30 };      // бюджет — тепловая полоса 3 строки
    const m = chartMap('line', N, { ...full, y: R1.y, h: R1.h }, 0, 80);

    // подсветка апрель–июнь 2026 (индексы 15–17)
    const bx = m.cat(15) - step / 2;
    const BY0 = 292;
    const BY1 = R3.y + 3 * R3.rh + 4;
    s.box({ x: bx, y: BY0, w: step * 3, h: BY1 - BY0, fill: BAND, r: 0 });
    s.text('апрель–июнь', { x: bx, y: BY0 + 6, w: step * 3, size: 15, bold: true, color: C.crimson, align: 'center' });
    // граница 2025 | 2026
    const xYear = m.cat(12) - step / 2;
    s.seg(xYear, 300, xYear, BY1, { color: C.line, width: 1.5, dash: 'dash' });

    // ряд 1: доля продаж, %
    s.text('Доля продаж, %', { x: 94, y: 292, w: 400, size: 17, bold: true, color: C.navy });
    const P1 = { ...part, y: R1.y, h: R1.h };
    const m1 = s.chart('line', NAMES.map((n, k) => ({ name: `${n}, доля продаж %`, labels: cats.slice(0, NS), values: share[k].map((v) => +v.toFixed(1)) })),
      { x: P1.x - 20, y: P1.y - 20, w: P1.w + 40, h: P1.h + 40, plot: P1, min: 0, max: 80, values: false, legend: false,
        colors: COLS, lineSize: 2.5, symbolSize: 7, extra: { catAxisHidden: true, catAxisLineShow: false } });
    share.forEach((vals, k) => vals.forEach((v, i) => {
      const hot = k === 0 && (i === 14 || i === 16);       // 71% в марте и 66% в мае 2026 — цифры из подзаголовка
      const below = k === 2;
      const y = below ? m1.val(v) + 6 : m1.val(v) - 22;
      s.text(`${Math.round(v)}%`, { x: m1.cat(i) - 30, y, w: 60, size: k === 0 ? 15 : k === 2 ? 15 : 14, bold: k === 0, color: hot ? C.crimson : (k === 0 ? C.navy : C.blueText), align: 'center' });
    }));

    // ряд 2: продажи, млн ₽
    s.text('Продажи, млн ₽', { x: 94, y: R2.y - 38, w: 400, size: 17, bold: true, color: C.navy });
    const P2 = { ...part, y: R2.y, h: R2.h };
    const GAP = 45;
    const m2 = s.chart('col', NAMES.map((n, k) => ({ name: `${n}, продажи млн ₽`, labels: cats.slice(0, NS), values: sales[k].map((v) => +v.toFixed(2)) })),
      { x: P2.x - 10, y: P2.y - 30, w: P2.w + 20, h: P2.h + 40, plot: P2, min: 0, max: 46, colors: COLS, legend: false, gap: GAP, overlap: 0,
        values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
    // подписи: Акриол — по центру столбца; Эмла и Анеста — от левого края своего столбца, чтобы не наезжать на соседний
    const barW = step / (3 + GAP / 100);
    sales.forEach((vals, k) => vals.forEach((v, i) => {
      const c = m2.cat(i);
      const y = m2.val(v) - 20;
      if (k === 0) s.text(f1(v), { x: c - barW - 22, y: y - 2, w: 44, size: 14, bold: true, color: C.navy, align: 'center' });
      else s.text(f1(v), { x: c + (k === 1 ? -0.5 : 0.5) * barW + 1, y, w: 40, size: 14, color: C.blueText });
    }));
    s.seg(P2.x, P2.y + P2.h, full.x + full.w, P2.y + P2.h, { color: C.line, width: 1.5 });

    // ряд 3: digital-бюджет, млн ₽ — тепловая полоса с числами
    s.text('Digital-бюджет, млн ₽', { x: 94, y: R3.y - 38, w: 400, size: 17, bold: true, color: C.navy });
    const VMAX = 3;
    budget.forEach((vals, k) => {
      const y = R3.y + k * R3.rh;
      s.text(NAMES[k], { x: 94, y: y + 5, w: X0 - 104, size: 15, bold: k === 0, color: C.navy });
      vals.forEach((v, i) => {
        const inBand = i >= 15 && i <= 17;
        const t = Math.min(1, v / VMAX) ** 0.8;
        const f = t * 0.92;
        const fill = mix(inBand ? BAND : 'FFFFFF', C.blue, f);
        const hot = k === 0 && (i === 15 || i === 17);     // 1,43 → 0,72 млн ₽ — цифры из Key takeaways
        s.box({ x: m.cat(i) - step / 2 + 1.5, y: y + 1.5, w: step - 3, h: R3.rh - 3, fill, r: 4, stroke: hot ? C.crimson : undefined, sw: 2 });
        s.text(f2(v), { x: m.cat(i) - step / 2, y: y + 5, w: step, size: 14, bold: k === 0,
          color: f > 0.5 ? C.white : (hot ? C.crimson : C.navy), align: 'center' });
      });
    });
    // ось месяцев и годы
    const yM = R3.y + 3 * R3.rh + 12;
    for (let i = 0; i < N; i++) s.text(MONTHS[i % 12], { x: m.cat(i) - step / 2, y: yM, w: step, size: 14, color: C.blueText, align: 'center' });
    V.yearAxis(s, m, [['2025', 12], ['2026', 7]], yM + 24, { size: 16 });

    // ---- правая колонка ----
    const X = 1410;
    const Wc = 452;
    const totals = [['9,7', 9.7], ['4,4', 4.4], ['1,7', 1.7]];
    const hA = 236;
    s.card({ x: X, y: TOP, w: Wc, h: hA });
    s.label('Digital budgets*', { x: X + 30, y: TOP + 28, w: Wc - 60, color: C.blue });
    const bx0 = X + 160;
    const bw = Wc - 30 - bx0 + X - 90;
    totals.forEach(([t, v], k) => {
      const y = TOP + 72 + k * 44;
      s.text(NAMES[k], { x: X + 30, y: y + 4, w: 125, size: 17, bold: k === 0, color: C.navy });
      const w = bw * v / 9.7;
      s.box({ x: bx0, y: y + 2, w, h: 28, fill: COLS[k], r: 4 });
      s.text(`${t} млн ₽`, { x: bx0 + w + 10, y: y + 3, w: 110, size: 18, bold: true, color: C.navy });
    });
    s.text('Estimated by DigitalBudget', { x: X + 30, y: TOP + hA - 38, w: Wc - 60, size: 14, color: C.blueText });

    const yB = TOP + hA + 18;
    s.card({ x: X, y: yB, w: Wc, h: 905 - yB });
    s.label('Key takeaways', { x: X + 30, y: yB + 28, w: Wc - 60, color: C.crimson });
    s.text('В 2026 Акриол сохраняет доминирующую позицию в категории: доля бренда по продажам находилась в диапазоне **66–71%**. В феврале рост digital-бюджета до **1,64 млн ₽** совпал с увеличением продаж относительно января, однако дальнейшая динамика не подтверждает прямую помесячную зависимость: максимальные продажи были достигнуты в марте при более низком объёме инвестиций. При этом на участке апрель–июнь сокращение digital-бюджета **с 1,43 до 0,72 млн ₽** сопровождалось снижением доли продаж **с 71% до 66%**. Это не доказывает прямого влияния медиа, но указывает на риск ослабления позиции бренда при снижении рекламной поддержки.',
      { x: X + 30, y: yB + 66, w: Wc - 60, h: 905 - yB - 66 - 22, size: 17, lh: 1.2, fit: true, minSize: 16 });

    s.principle({ label: 'Вывод', icon: 'bulb', w: 1600,
      text: 'Это указывает на необходимость поддерживать достаточное инвестиционное давление в ключевые периоды' });
    s.footnote('Источник: DigitalBudget, IQVIA. * Бюджет указан за весь период 2025–2026');
  },

  // ===================== 4. Креативы конкурентов =====================
  4: (d) => {
    const s = d.slide({
      title: 'Competitive Analysis / Creative Acriol Pro',
      subtitle: 'Конкуренты продвигаются в основном с баннерными форматами. При этом использование персонализированного подхода в рамках креативной стратегии брендов не замечено',
    });
    const img = (file, x, y, w, h) => s.image(path.join(MEDIA, file), { x, y, w, h });
    const PAD = 30;
    const IY = 290;                       // верх картинок
    const IH = BOT - PAD - IY;            // 685 по высоте
    const G = 16;
    // Эмла (6 креативов, ~2/3 ширины): слева квадрат над видео, справа три сторис той же высоты, внизу растяжка во всю ширину
    // сторис: [файл, размер файла, область без белых/прозрачных полей] — поля обрезаем, чтобы три макета стояли ровно
    const st = [
      ['img_24ff05c7b5.png', [322, 522], [10, 9, 300, 500]],
      ['img_5b03728512.png', [321, 432], [42, 21, 240, 400]],
      ['img_e52988a380.png', [314, 514], [10, 6, 300, 500]],
    ];
    const rS = st.reduce((acc, [, , c]) => acc + c[2] / c[3], 0);
    const cropImg = (file, [fw, fh], [cx0, cy0, cw0, ch0], X, Y, h) => {
      const k = h / ch0;
      s.s.addImage({ path: path.join(MEDIA, file), x: IN(X), y: IN(Y), w: IN(fw * k), h: IN(fh * k), altText: tr('Изображение'),
        sizing: { type: 'crop', x: IN(cx0 * k), y: IN(cy0 * k), w: IN(cw0 * k), h: IN(ch0 * k) } });
      return cw0 * k;
    };
    const VR = 852 / 480;                 // видео 852×480
    const BR = 1565 / 200;                // растяжка
    const We = 1200;                      // ширина блока Эмлы
    // колонка A шириной a: квадрат a + G + видео a/VR = высота сторис r; ширина: a + G + (rS·r + 2G) = We
    const a = (We - G - 2 * G - rS * G) / (1 + rS * (1 + 1 / VR));
    const r = a * (1 + 1 / VR) + G;
    const bh = We / BR;
    const He = r + G + bh;
    const EW = We + 2 * PAD;
    s.card({ x: 58, y: TOP, w: EW, h: BOT - TOP });
    s.label('Эмла', { x: 58 + PAD, y: TOP + 26, w: 300, color: C.blue });
    const ex = 58 + PAD;
    const ey = IY + Math.round((IH - He) / 2);
    img('img_2474a8ec45.jpg', ex, ey, a, a);
    const vy = ey + a + G;
    try {
      const cover = 'data:image/png;base64,' + fromSource('ppt/media/image21.png').toString('base64');
      const video = 'video/mp4;base64,' + fromSource('ppt/media/media1.mp4').toString('base64');
      s.s.addMedia({ type: 'video', data: video, cover, extn: 'mp4', x: IN(ex), y: IN(vy), w: IN(a), h: IN(a / VR), objectName: tr('Эмла — видео') });
    } catch (e) {
      s.warn('видео', 'Эмла', 'не удалось взять видео из source.pptx: ' + e.message);
    }
    s.icon('tb:TbPlayerPlayFilled', { x: ex + 10, y: vy + 10, size: 40, color: C.white, circle: C.crimson });
    let x = ex + a + G;
    st.forEach(([f, size, crop]) => { x += cropImg(f, size, crop, x, ey, r) + G; });
    img('img_4db466fc82.png', ex, ey + r + G, We, bh);

    // Анеста: сверху портрет, снизу два баннера рядом
    const AX = 58 + EW + 20;
    const AW = 1862 - AX;
    s.card({ x: AX, y: TOP, w: AW, h: BOT - TOP });
    s.label('Анеста', { x: AX + PAD, y: TOP + 26, w: 300, color: C.blue });
    const inner = AW - 2 * PAD;
    const lw = (inner - G) / 2;
    const lh = lw / 1.5;
    // по высоте — как блок Эмлы, чтобы верх и низ картинок совпадали в обеих карточках
    const ph = Math.min(He - lh - G, inner * 516 / 387);
    const pw = ph * 387 / 516;
    const ay = ey;
    img('img_15336a3427.jpg', AX + PAD + (inner - pw) / 2, ay, pw, ph);
    img('img_dfa9fb29f3.jpg', AX + PAD, ay + ph + G, lw, lh);
    img('img_eb32b8f182.jpg', AX + PAD + lw + G, ay + ph + G, lw, lh);
  },

  // ===================== 5. Поисковый спрос: Wordstat и Ozon =====================
  5: (d) => {
    const s = d.slide({
      title: 'Acriol Pro / Search demand dynamics / 2026',
      subtitle: 'Рост брендового интереса к Акриол Про опережает категорию, следующий шаг — конвертация спроса в e-commerce',
    });
    const [, wsC, ozC] = charts(5);
    const wsBar = wsC.plots.find((p) => p.type === 'BarPlot');
    const wsLine = wsC.plots.find((p) => p.type === 'LinePlot');
    const ozLine = ozC.plots.find((p) => p.type === 'LinePlot');
    const weeks = wsLine.cats.map(xlDate);                  // 29.12.2025 … 24.08.2026, 35 недель
    const ozWeeks = ozLine.cats.map(xlDate);                // 23.03.2026 … 24.08.2026, 23 недели
    const OFF = weeks.indexOf(ozWeeks[0]);                  // 12
    const r0 = (v) => Math.round(v * 10) / 10;
    // серии: в данных исходника первая линия Wordstat названа «Боботик», в легенде слайда — «Акриол Про»; по правке Романа (UPD 19.10) на слайде +79% — значение по данным этой линии
    const wsBrand = wsLine.series[0].values.map(r0);
    const wsCat = wsLine.series[1].values.map(r0);
    const ozBrand = ozLine.series[0].values.map(r0);
    const ozCat = ozLine.series[1].values.map(r0);
    const impK = wsBar.series[0].values.map((v) => Math.round(v / 1000));   // показы, тыс.
    const N = weeks.length;

    const CARD = { x: 58, y: TOP, w: 1272, h: BOT - TOP };
    s.card(CARD);
    const X0 = 150;
    const X1 = 1300;
    const step = (X1 - X0) / N;
    const W = { x: X0, w: step * N };
    const lineOpts = (P, max, n) => ({ x: P.x - 10, y: P.y - 10, w: P.w + 20, h: P.h + 20, plot: P, min: 0, max, values: false, legend: false,
      colors: [MUTED, C.crimson], symbol: 'none', extra: { catAxisHidden: true, catAxisLineShow: false } });
    const grid = (m, vals) => vals.forEach((v) => {
      s.seg(W.x, m.val(v), W.x + W.w, m.val(v), { color: v === 100 ? C.line : GRID, width: v === 100 ? 2 : 1.25, dash: v === 100 ? 'dash' : undefined });
      s.text(String(v), { x: X0 - 62, y: m.val(v) - 10, w: 52, size: 14, color: C.blueText, align: 'right' });
    });
    const lg = (y) => V.legend(s, 860, y, [[C.crimson, 'Акриол Про'], [MUTED, 'категория']], { dir: 'row', gap: 190, size: 17 });
    // метка ряда + пояснение сразу за ней (ширина метки — по переведённому тексту)
    const rowLabel = (text, y, note) => {
      s.label(text, { x: 94, y, w: 720, color: C.blue });
      if (note) {
        const lw = textWidth(tr(text).toUpperCase(), 22, true);
        s.text(note, { x: 94 + lw + 18, y: y + 3, w: 840 - lw - 40, size: 16, color: C.blueText });
      }
    };
    // границы месяцев — тонкие вертикали через все три ряда
    const groups = [];
    weeks.forEach((w) => {
      const mo = MONTHS[Number(w.slice(3, 5)) - 1];
      if (groups.length && groups[groups.length - 1][0] === mo) groups[groups.length - 1][1]++;
      else groups.push([mo, 1]);
    });
    let gi = 0;
    groups.forEach(([, n], k) => {
      if (k > 0) s.seg(W.x + gi * step, 296, W.x + gi * step, 926, { color: GRID, width: 1.25 });
      gi += n;
    });

    // Wordstat
    rowLabel('Wordstat: динамика запросов', 249, 'линии — индекс запросов');
    lg(247);
    const PW = { ...W, y: 300, h: 230 };
    const mW = chartMap('line', N, PW, 0, 400);
    grid(mW, [0, 100, 200, 300, 400]);
    s.chart('line', [
      { name: 'Wordstat · категория, индекс', labels: weeks, values: wsCat },
      { name: 'Wordstat · Акриол Про, индекс', labels: weeks, values: wsBrand },
    ], { ...lineOpts(PW, 400), lineSize: 2.5 });
    // толще линия бренда: поверх рисуем ещё раз не надо — достаточно цвета

    // Ozon (на той же оси недель, с 23.03.2026)
    rowLabel('Ozon: динамика запросов', 560, 'линии — индекс запросов');
    lg(558);
    const PO = { x: X0 + OFF * step, w: step * (N - OFF), y: 608, h: 150 };
    const mO = chartMap('line', N, { ...W, y: PO.y, h: PO.h }, 0, 200);
    grid(mO, [0, 100, 200]);
    s.text('Данные Ozon доступны с 23.03.2026', { x: X0 + 16, y: PO.y + 18, w: OFF * step - 40, size: 16, color: C.blueText });
    s.chart('line', [
      { name: 'Ozon · категория, индекс', labels: ozWeeks, values: ozCat },
      { name: 'Ozon · Акриол Про, индекс', labels: ozWeeks, values: ozBrand },
    ], { ...lineOpts(PO, 200), lineSize: 2.5 });

    // показы кампании
    rowLabel('Показы кампании, тыс.', 786);
    const PI = { ...W, y: 836, h: 90 };
    s.chart('col', [{ name: 'Показы кампании, тыс.', labels: weeks, values: impK }],
      { x: PI.x - 10, y: PI.y - 30, w: PI.w + 20, h: PI.h + 40, plot: PI, min: 0, max: 700, colors: [MUTED], legend: false, gap: 35,
        format: '0', labelSize: 14, labelColor: C.blueText, extra: { catAxisHidden: true, catAxisLineShow: false } });
    // ось месяцев (недели по понедельникам)
    const mAx = chartMap('col', N, PI, 0, 700);
    s.seg(W.x, PI.y + PI.h, W.x + W.w, PI.y + PI.h, { color: C.line, width: 1.5 });
    V.yearAxis(s, mAx, groups, PI.y + PI.h + 14, { size: 15 });

    // ---- правая колонка: цифры и выводы ----
    const X = 1350;
    const Wc = 512;
    const tileW = (Wc - 16) / 2;
    const block = (y0, a, b, caption, text) => {
      s.box({ x: X, y: y0, w: tileW, h: 132, fill: C.crimson });
      s.text(a[0], { x: X + 24, y: y0 + 14, w: tileW - 40, size: 54, bold: true, lh: 1.1, color: C.white });
      s.text(a[1], { x: X + 24, y: y0 + 84, w: tileW - 40, size: 17, bold: true, color: C.white });
      s.box({ x: X + tileW + 16, y: y0, w: tileW, h: 132, fill: C.cardTint, stroke: C.line, sw: 2 });
      s.text(b[0], { x: X + tileW + 40, y: y0 + 14, w: tileW - 40, size: 54, bold: true, lh: 1.1, color: C.navy });
      s.text(b[1], { x: X + tileW + 40, y: y0 + 84, w: tileW - 40, size: 17, bold: true, color: C.navy });
      let y = y0 + 132 + 10;
      y += s.text(caption, { x: X, y, w: Wc, size: 15, color: C.blueText }) + 14;
      const ch = BOT - y;
      return { y, ch };
    };
    const b1 = block(TOP, ['+79%', 'Акриол Про · Wordstat'], ['+27%', 'Категория · Wordstat'],
      'Средний недельный спрос июнь–август vs январь–февраль');
    const t1 = 'Поисковый спрос на Акриол Про вырос на 79%, тогда как категория росла медленнее (+27%). В 2027 следует продолжать присутствие Акриол Про в категорийном и контентном поиске и связывать его с брендовой коммуникацией';
    s.card({ x: X, y: b1.y, w: Wc, h: 196 });
    s.label('Вывод', { x: X + 24, y: b1.y + 20, w: 200, size: 18, color: C.crimson });
    s.text(t1, { x: X + 24, y: b1.y + 48, w: Wc - 48, h: 196 - 60, size: 17, lh: 1.2, fit: true, minSize: 16 });

    const y2 = b1.y + 196 + 26;
    const b2 = block(y2, ['+3%', 'Акриол Про · Ozon'], ['+30%', 'Категория · Ozon'],
      'Средний недельный спрос август vs март–апрель');
    const t2 = 'На Ozon спрос на Акриол Про демонстрирует ограниченную положительную динамику (+3% vs +30% у категории). В 2027 важно усиливать брендовую коммуникацию с CTA «Ищите Акриол Про на Ozon», повышать видимость в категорийной выдаче и конверсию карточки товара';
    s.card({ x: X, y: b2.y, w: Wc, h: BOT - b2.y });
    s.label('Вывод', { x: X + 24, y: b2.y + 20, w: 200, size: 18, color: C.crimson });
    s.text(t2, { x: X + 24, y: b2.y + 48, w: Wc - 48, h: BOT - b2.y - 60, size: 17, lh: 1.2, fit: true, minSize: 16 });

    s.footnote('Источник: данные Ozon* и Яндекс Вордстат. Индекс запросов = значение недели / значение предыдущей недели × 100\n* Категория Ozon: обезболивающий крем / для эпиляции / для депиляции, крем с лидокаином обезболивающий, анестетик',
      { y: 1026 });
  },

  // ===================== 6. Целевая аудитория =====================
  6: (d) => {
    const s = d.slide({ title: 'Целевая аудитория фокусируется на тех, кто формирует выбор и использование анестетика' });
    s.text('В 2027 сохраняем профессиональную ЦА как ядро, но разделяем ее по роли в выборе и бизнес-задаче',
      { x: 58, y: 236, w: 1804, size: 28, bold: true, lh: 1.15, color: C.navy, fit: true, maxLines: 2, minSize: 22 });
    const roles = [
      { tag: 'Core', name: 'Врачи-косметологи', icon: 'tb:TbStethoscope', color: C.blue,
        rows: [['Инъекционная косметология', 'Защита лидерства и статуса препарата выбора'], ['Аппаратная косметология', 'Основная зона роста назначений']] },
      { tag: 'Expansion', name: 'Специалисты / мастера', icon: 'tb:TbBrush', color: C.green,
        rows: [['Лазерная эпиляция', 'Расширение использования'], ['Перманентный макияж', 'Рост рекомендации'], ['Удаление тату', 'Рост использования']] },
      { tag: 'Support', name: 'Потребители услуг', icon: 'tb:TbUsers', color: C.purple,
        rows: [['Инъекции и аппаратная косметология', 'Дополнительный спрос'], ['Эпиляция и ПМ', 'Поддержка самостоятельного выбора']] },
    ];
    const cols = columns(3, { gap: 24 });
    const Y = 312;
    const PITCH = 122;                                  // строки сегментов на одной высоте во всех колонках
    roles.forEach((r, i) => {
      const { x, w } = cols[i];
      s.card({ x, y: Y, w, h: 905 - Y });
      const px = x + 39;
      const pw = w - 78;
      s.icon(r.icon, { x: px, y: Y + 32, size: 72, circle: r.color });
      s.heading(r.name, { x: px + 94, y: Y + 50, w: pw - 94, h: 40, size: 32 });
      s.hline(px, Y + 134, pw);
      r.rows.forEach(([seg, task], k) => {
        const y = Y + 162 + k * PITCH;
        const h1 = s.text(seg, { x: px + 22, y, w: pw - 22, size: 23, bold: true, lh: 1.1, color: C.navy });
        const h2 = s.text(task, { x: px + 22, y: y + h1 + 8, w: pw - 22, size: 21, lh: 1.2, color: C.blueText });
        s.box({ x: px, y: y + 2, w: 6, h: h1 + 8 + h2 - 2, fill: r.color, r: 3 });
      });
      s.pill(r.tag, { x: px, y: 905 - 36 - 58, w: pw, h: 58, color: r.color, size: 24 });
    });
    s.principle({ label: 'Ключевой принцип', icon: 'target', w: 1300,
      text: 'Не расширяем ЦА ради охвата — каждому профессиональному сегменту даем собственную причину предпочесть Акриол Про' });
  },

  // ===================== 7. Сегменты по этапам CJM =====================
  7: (d) => {
    const s = d.slide({ title: 'Актуализация сегментов и проверка на данных 2026: есть различия в выборе у разных сегментов' });
    const tbl = require(path.join(SRC, 'slide-07.json')).shapes.find((sh) => sh.t === 'TABLE').table;
    const HOT = 'ТОЧКА ВЛИЯНИЯ АКРИОЛ ПРО';
    const BOLD = ['ГЛАВНЫЙ БАРЬЕР', 'РОЛЬ АКРИОЛ ПРО'];
    const PINK = mix('FFFFFF', C.crimson, 0.08);
    const colW = [254, ...Array(5).fill((1804 - 254) / 5)];
    const size = 18;
    const rows = tbl.map((r, ri) => r.map((cell0, ci) => {
      const cell = cell0.replace(/АКРИОЛ ПРО/g, 'АКРИОЛ\u00a0ПРО');
      if (ri === 0) return { text: cell, fill: ci === 0 ? C.navy : C.blue };
      const hot = r[0] === HOT;
      const bold = BOLD.includes(r[0]);
      if (ci === 0) return { text: cell, bold: true, color: hot ? C.crimson : C.navy, fill: hot ? PINK : C.cardTint };
      return { text: cell, bold: hot || bold, color: hot ? C.crimson : bold ? C.navy : C.blueText, fill: hot ? PINK : C.white };
    }));
    // высоты строк по тексту
    const lineH = (txt, w, bold, sz) => countLines(tr(txt), sz, w - 28, bold) * sz * 1.2 + 16;   // по переведённому тексту
    const rowH = rows.map((r, ri) => Math.max(...r.map((c, ci) => lineH(c.text, colW[ci], ri === 0 || c.bold, size))));
    const total = rowH.reduce((a, b) => a + b, 0);
    if (total > BOT - TOP) s.warn('таблица', 'сегменты CJM', `высота ~${Math.round(total)}px больше ${BOT - TOP}px`);
    const k = Math.min(1.6, (BOT - TOP) / total);   // EN короче — растягиваем строки, чтобы таблица заполняла слайд
    s.table(rows, { x: 58, y: TOP, w: 1804, colW, rowH: rowH.map((h) => h * k), size });
  },
};
