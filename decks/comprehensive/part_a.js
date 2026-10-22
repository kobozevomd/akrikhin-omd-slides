// Comprehensive 2027 — часть A: блок «Market Trends 2027: Consumer» (слайды черновика 2–7).
// Архетип: шапка-инсайт → слева карточка-комментарий черновика, справа карточка с живым графиком
// и КАПС-меткой (название графика из черновика) → источник сноской. Плашек в черновике нет,
// поэтому карточки занимают и зону плашки: 221…1005, сноска 1034.
const path = require('path');
const { C, ACCENTS, CHART_COLORS, columns, IN, PT, countLines } = require('../../lib/akrikhin');
const MEDIA = path.join(__dirname, '..', '..', 'work', 'comprehensive', 'src', 'media');
const SRC = path.join(__dirname, '..', '..', 'work', 'comprehensive', 'src');

const TOP = 221;
const BOT = 1005;
const SIDE = { x: 58, w: 500 };                 // карточка-комментарий
const MAIN = { x: 580, w: 1862 - 580 };         // карточка с графиком

// Данные графика из json черновика: n — номер слайда, k — какой по счёту график на слайде
function chartData(n, k = 0, { trim = true, rename = {} } = {}) {
  const j = require(path.join(SRC, `slide-${String(n).padStart(2, '0')}.json`));
  const ch = j.shapes.filter((sh) => sh.t === 'CHART')[k].chart;
  const p = ch.plots[0];
  const labels = p.cats.map((c) => (trim ? String(c).trim() : c));
  return p.series.map((sr) => ({ name: rename[sr.name] ?? sr.name, labels, values: sr.values }));
}

// Карточка графика: КАПС-метка сверху, возвращает область под график
function chartCard(s, { x, w, label, y = TOP, h = BOT - TOP, pad = 18 }) {
  s.card({ x, y, w, h });
  const lh = s.label(label, { x: x + 36, y: y + 34, w: w - 72, color: C.blue });
  const cy = y + 34 + lh + 14;
  return { x: x + pad, y: cy, w: w - pad * 2, h: y + h - 14 - cy };
}

// Карточка-комментарий слева: плитка с иконкой, первый абзац — акцентный, остальные — текст.
// Блок центрируется по высоте карточки (тексты короткие — так карточка не выглядит пустой снизу)
function commentCard(s, { icon, lead, paras = [] }) {
  const { x, w } = SIDE;
  const tx = x + 36;
  const tw = w - 72;
  const L = { size: 28, lh: 1.15 };
  const P = { size: 20, lh: 1.25 };
  const leadH = countLines(lead, L.size, tw, true) * L.size * L.lh;
  const parasH = paras.map((p) => countLines(p, P.size, tw, false) * P.size * P.lh);
  const total = 72 + 34 + leadH + parasH.reduce((a, h) => a + 22 + h, 0);
  s.card({ x, y: TOP, w, h: BOT - TOP, tint: true });
  let y = Math.round(TOP + Math.max(36, (BOT - TOP - total) * 0.45));
  s.box({ x: tx, y, w: 72, h: 72, fill: C.blue });
  s.icon(icon, { x: tx + 12, y: y + 12, size: 48, color: C.white });
  y += 72 + 34;
  s.text(lead, { x: tx, y, w: tw, h: Math.ceil(leadH), size: L.size, bold: true, lh: L.lh, color: C.navy });
  y += leadH;
  paras.forEach((p, i) => {
    y += 22;
    s.text(p, { x: tx, y, w: tw, h: Math.ceil(parasH[i]), size: P.size, lh: P.lh, color: C.blueText });
    y += parasH[i];
  });
  if (y > BOT - 30) s.warn('комментарий', lead, `текст выходит за карточку: низ ~${Math.round(y)}px`);
}

// Линия с подписями над точками, кроме точек-провалов (below): там подпись над точкой налезает на линию,
// поэтому их подписи ставит вспомогательная серия без линии и маркеров (подпись под точкой).
// Это один нативный комбинированный график: двигается и редактируется целиком.
function lineSplitLabels(s, sr, below, o) {
  const P = s.deck.pres;
  const vals = sr.values.map((v) => Math.round(v * 10) / 10); // 7.099999999999994 → 7.1
  const main = { name: sr.name, labels: sr.labels, values: vals };
  const helper = { name: sr.name + ' — подписи под точками', labels: sr.labels, values: vals.map((v, i) => (below.includes(i) ? v : null)) };
  // у основной серии подписи провалов скрыты форматом (не больше двух условий в формате)
  const hide = below.map((i) => `[=${vals[i]}]""`).join(';') + ';0.0';
  const lb = PT(o.labelSize ?? 18);
  s.s.addChart([
    { type: P.ChartType.line, data: [main], options: {
      chartColors: [C.blue], lineSize: 3, lineDataSymbol: 'circle', lineDataSymbolSize: 12,
      dataLabelPosition: 't', dataLabelFormatCode: hide } },
    { type: P.ChartType.line, data: [helper], options: {
      chartColors: [C.blue, C.blue], lineSize: 0, lineDataSymbol: 'none',
      dataLabelPosition: 'b', dataLabelFormatCode: '0.0' } },
  ], {
    x: IN(o.x), y: IN(o.y), w: IN(o.w), h: IN(o.h),
    showTitle: false, showLegend: false, showValue: true,
    dataLabelFontFace: 'Tahoma', dataLabelFontSize: lb, dataLabelColor: C.navy, dataLabelFontBold: true,
    catAxisLabelFontFace: 'Tahoma', catAxisLabelFontSize: PT(o.axisSize ?? 16), catAxisLabelColor: C.blueText,
    catAxisLineShow: true, catAxisLineColor: C.line, catAxisMajorTickMark: 'none',
    valAxisHidden: true, valAxisLineShow: false, valGridLine: { style: 'none' }, catGridLine: { style: 'none' },
    valAxisMinVal: o.min, valAxisMaxVal: o.max, lineSmooth: false,
    plotArea: { fill: { color: 'FFFFFF', transparency: 100 } },
  });
}

// Разные цвета подписей значений у серий одного графика (в s.chart цвет подписей общий).
// pptxgenjs 4.0.1 при записи XML читает opts.dataLabelColor ровно один раз на каждую серию
// (по порядку), затем один раз для общего блока подписей — отдаём цвета по кругу
// (по кругу — чтобы и повторная запись файла дала те же цвета). Результат проверен в chart*.xml.
function seriesLabelColors(s, colors) {
  const rels = s.s._relsChart;
  const opts = rels[rels.length - 1].opts;
  const seq = [...colors, opts.dataLabelColor];
  let i = 0;
  Object.defineProperty(opts, 'dataLabelColor', {
    configurable: true,
    enumerable: true,
    get() { return seq[i++ % seq.length]; },
  });
}

module.exports = {
  // 2. Две 100%-гистограммы оценок: шкала «очень хорошее → очень плохое» от navy к crimson
  2: (d) => {
    const s = d.slide({ title: 'В июле негативные оценки достигли максимальных значений с конца сентября 2022 года' });
    const labels = [
      'Как бы вы оценили экономическое положение России?, %',
      'Как бы вы оценили ситуацию в стране в целом?, %',
    ];
    // хорошо → плохо: тёмно-синий, синий, оранжевый, малиновый; «затрудняюсь» — светлый с тёмными подписями
    const scale = [C.navy, C.blue, C.orange, C.crimson, C.line];
    columns(2, { gap: 22 }).forEach((col, k) => {
      const a = chartCard(s, { x: col.x, w: col.w, label: labels[k] });
      s.chart('col', chartData(2, k), {
        ...a, percent: true, colors: scale, gap: 40,
        // подписи целыми; в сегментах тоньше 2,5% подпись не помещается — скрываем её форматом
        format: '[<2.5]"";0', labelSize: 13, labelBold: true,
        axisSize: 13, rotate: -45, legend: 'b', legendSize: 14,
      });
      seriesLabelColors(s, [C.white, C.white, C.white, C.white, C.navy]);
    });
    s.footnote('Источник: OMD Snapshot, города 1М+, 18-55, 625 респондентов, 1.-3.07.2026 W19, онлайн-опрос Tiburon Research');
  },

  // 3. Линия: реальные располагаемые доходы по кварталам
  3: (d) => {
    const s = d.slide({ title: 'Рост доходов в 2026 практически остановился' });
    commentCard(s, {
      icon: 'tb:TbWallet',
      lead: 'По итогам года Минэкономразвития ожидает рост +0,8%, в 2027 возобновление роста до +2,1%',
    });
    const a = chartCard(s, { ...MAIN, label: 'Динамика реальных располагаемых доходов, % г/г' });
    // подписи над точками; у провалов 2025 Q1 (7,1) и 2026 Q1 (1,7) — под точкой, иначе их пересекает линия
    lineSplitLabels(s, chartData(3)[0], [4, 8], { x: a.x + 20, y: a.y + 10, w: a.w - 40, h: a.h - 10, min: 0, max: 13 });
    s.footnote('Источник: Росстат, Реальные располагаемые денежные доходы населения по Российской Федерации, 29.07.2026');
  },

  // 4. Горизонтальные полосы: топ-15 регионов по темпу роста доходов
  4: (d) => {
    const s = d.slide({ title: 'Снижение территориального неравенства закончилось' });
    commentCard(s, {
      icon: 'tb:TbMapPin',
      lead: 'Самые богатые регионы с 2025 года вновь в топе по темпам роста доходов (среднее по России за первый квартал 2026 +4,4%).',
      paras: ['Также высокие темпы сохраняются в регионах Дальнего Востока'],
    });
    const a = chartCard(s, { ...MAIN, label: 'Темп роста реальных доходов за Q1 2026 год, топ-15 регионов, % г/г' });
    s.chart('bar', chartData(4), {
      ...a, format: '0.0', labelSize: 16, axisSize: 16, gap: 45,
    });
    s.footnote('Источник: Росстат, Реальные денежные доходы населения по субъектам Российской Федерации, 29.07.2026');
  },

  // 5. Четыре линии оборота розницы по месяцам: без подписей значений, с осью и сеткой
  5: (d) => {
    const s = d.slide({ title: 'Новый всплеск оборота розницы' });
    commentCard(s, {
      icon: 'tb:TbShoppingCart',
      lead: 'В марте 2026 сыграло роль снижение ключевой ставки, а также стремление населения купить авто до повышения цены за счет нового утильсбора',
      paras: [
        'Также влияет отложенный спрос (замедление в январе-феврале), относительное восстановление кредитов весной и начало расходования сбережений',
        'Прогноз 2026: +0,8 (Минэкономразвития)',
      ],
    });
    const a = chartCard(s, { ...MAIN, label: 'Динамика оборота товаров и услуг, % г/г' });
    s.chart('line', chartData(5), {
      ...a, values: false, legend: 't', legendSize: 16, valAxis: true, grid: true,
      axisSize: 14, rotate: -45, lineSize: 2.75, symbol: 'none',
      extra: { valAxisLabelFormatCode: '0', valAxisMajorUnit: 2, catAxisLabelPos: 'low' },
    });
    s.footnote('Источник: Росстат');
  },

  // 6. Парные горизонтальные полосы: онлайн / офлайн по типам магазинов
  6: (d) => {
    const s = d.slide({ title: 'Покупатели совмещают онлайн и офлайн-каналы' });
    commentCard(s, {
      icon: 'tb:TbBuildingStore',
      lead: 'Точки продаж FMCG и фармы сохраняют уверенное преобладание офлайн-покупателей',
      paras: ['Несмотря на лидерство e-Commerce в сегменте непродовольственных товаров по объему трат, даже среди 12-64 в количестве покупателей небольшой перевес остается за офлайном'],
    });
    const a = chartCard(s, { ...MAIN, label: 'Личная покупка за 6 мес., %' });
    s.chart('bar', chartData(6), {
      ...a, format: '0', labelSize: 14, axisSize: 15, gap: 40, overlap: 0, legend: 't', legendSize: 16,
    });
    s.footnote('Источник: Mediascope, BrandPulse 2026. Онлайн-покупки пересчитаны от всего населения');
  },

  // 7. Парные столбцы: среднесуточная аудитория e-commerce по полу и возрасту
  7: (d) => {
    const s = d.slide({ title: 'Женщины заметно активнее вовлечены\nв онлайн-покупки' });
    commentCard(s, {
      icon: 'tb:TbUsers',
      lead: 'Особенно активно женщины по сравнению с мужчинами используют маркетплейсы',
      paras: ['Также видно, что мужчины чаще дополняют маркетплейсы профильными интернет-магазинами'],
    });
    const a = chartCard(s, { ...MAIN, label: 'Среднесуточная аудитория e-commerce, %' });
    s.chart('col', chartData(7, 0, { rename: { 'Маркеплейсы': 'Маркетплейсы' } }), {
      ...a, format: '0', labelSize: 15, axisSize: 15, gap: 45, overlap: 0, legend: 't', legendSize: 16,
    });
    s.footnote('Источник: Mediascope, CrossWeb, январь-июль 2026 / Ж 12-64');
  },
};
