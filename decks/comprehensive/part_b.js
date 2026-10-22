// Comprehensive 2027 — часть B: слайды черновика 9–15 (блок «Market Trends 2027: Media»)
const path = require('path');
const fs = require('fs');
const { C, ACCENTS, CHART_COLORS, columns, IN, PT, textWidth, countLines, typo } = require('../../lib/akrikhin');

const MEDIA = path.join(__dirname, '..', '..', 'work', 'comprehensive', 'src', 'media');
const SRC = path.join(__dirname, '..', '..', 'work', 'comprehensive', 'src');
const TOP = 221;   // верх контентной зоны
const BOT = 1005;  // низ карточек на слайдах без плашки-вывода (в черновике плашек нет)
const FONT = 'Tahoma';

// Данные графиков — прямо из json черновика
function charts(n) {
  const j = JSON.parse(fs.readFileSync(path.join(SRC, `slide-${String(n).padStart(2, '0')}.json`), 'utf8'));
  const out = [];
  const walk = (arr) => arr.forEach((sh) => {
    if (sh.chart) out.push(sh.chart);
    if (sh.children) walk(sh.children);
  });
  walk(j.shapes);
  return out;
}

// Excel-серийная дата → «янв-23»
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
function monthLabel(serial) {
  const d = new Date(Date.UTC(1899, 11, 30) + Number(serial) * 86400000);
  return `${MONTHS[d.getUTCMonth()]}-${String(d.getUTCFullYear()).slice(2)}`;
}
const pct = (v) => (v >= 0 ? '+' : '-') + Math.round(Math.abs(v) * 100) + '%';

// Ручная легенда: цветной квадрат + подпись цветом текста. Выравнивание по правому краю right.
function legend(s, items, { right, y, size = 16, gap = 28 }) {
  const sw = 16;
  const widths = items.map(([name]) => Math.ceil(textWidth(name, size, false)) + 4);
  const total = widths.reduce((a, w) => a + sw + 8 + w, 0) + gap * (items.length - 1);
  let x = right - total;
  items.forEach(([name, color], i) => {
    s.box({ x, y: y + (size * 1.2 - sw) / 2, w: sw, h: sw, fill: color, r: 3 });
    x += sw + 8;
    s.text(name, { x, y, w: widths[i], size, lh: 1.2, color: C.blueText });
    x += widths[i] + gap;
  });
}

// Общие стили графиков — как в s.chart библиотеки
function chartBase(o) {
  return {
    x: IN(o.x), y: IN(o.y), w: IN(o.w), h: IN(o.h),
    showTitle: false, showLegend: false,
    dataLabelFontFace: FONT, dataLabelFontSize: PT(o.labelSize ?? 14),
    catAxisLabelFontFace: FONT, catAxisLabelFontSize: PT(o.axisSize ?? 14), catAxisLabelColor: C.blueText,
    catAxisLineShow: true, catAxisLineColor: C.line, catAxisMajorTickMark: 'none',
    valAxisHidden: true, valAxisLineShow: false, valAxisLabelFontFace: FONT,
    valGridLine: { style: 'none' }, catGridLine: { style: 'none' },
    plotArea: { fill: { color: 'FFFFFF', transparency: 100 } },
  };
}

// Накопленные столбцы + подписи итогов над столбцами.
// В библиотеке нет комбинированного графика: итоги — невидимая линия на той же (единственной) оси значений.
function stackedWithTotals(s, cats, series, totals, o) {
  const P = s.deck.pres;
  const types = [
    {
      type: P.ChartType.bar,
      data: series.map((ser) => ({ name: ser.name, labels: cats, values: ser.values })),
      options: {
        barDir: 'col', barGrouping: 'stacked', barGapWidthPct: o.gap ?? 45, barOverlapPct: 100,
        chartColors: o.colors, showValue: false,
      },
    },
    {
      type: P.ChartType.line,
      data: [{ name: o.totalName ?? 'Тотал', labels: cats, values: totals }],
      options: {
        chartColors: ['FFFFFF'], lineSize: 0, lineDataSymbol: 'none', showValue: true,
        dataLabelPosition: 't', dataLabelColor: C.navy, dataLabelFontBold: true, dataLabelFormatCode: o.format ?? '#,##0',
      },
    },
  ];
  const opt = chartBase(o);
  if (o.max !== undefined) opt.valAxisMaxVal = o.max;
  opt.valAxisMinVal = 0;
  s.s.addChart(types, opt);
}

// Строка «большая цифра в плитке + текст справа» (ключевые тренды / точки роста)
function numberRow(s, { x, y, w, h, value, text, color, tileW = 200, size = 22 }) {
  s.box({ x, y, w: tileW, h, fill: color });
  s.text(value, { x, y, w: tileW, h, size: 64, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
  const tx = x + tileW + 28;
  s.text(text, { x: tx, y, w: w - tileW - 28, h, size, lh: 1.2, color: C.navy, valign: 'middle', fit: true, minSize: 18 });
}

module.exports = {
  // 9. Расклад сил в сегменте маркетплейсов: комментарии слева + многолинейный график охвата
  9: (d) => {
    const s = d.slide({ title: 'Расклад сил в сегменте маркетплейсов меняется' });
    const [ch] = charts(9);
    const plot = ch.plots[0];
    const cats = plot.cats.map(monthLabel);
    const colorOf = {};
    plot.series.forEach((ser, i) => { colorOf[ser.name] = CHART_COLORS[i]; });

    // левая карточка: 4 комментария, точка — цвет линии площадки на графике
    s.card({ x: 58, y: TOP, w: 560, h: BOT - TOP });
    const notes = [
      ['Ozon', 'На фоне снижения охватов WB, **Озон** становится уверенным лидером в категории, охватывая почти 70% россиян за месяц'],
      ['Яндекс.Маркет (Ya)', '**Яндекс.Маркет** значительно сократил рекламную поддержку в 2026 и быстро теряет охваты'],
      ['Megamarket', 'Аналогичная ситуация с **Мегамаркетом** наблюдается с осени 2024. В 2026 охват площадки составляет менее 5%'],
      ['Aliexpress', '**AliExpress** оказался наиболее устойчивым без рекламной поддержки с марта 2022, однако с апреля 2026 вернулся в Наружную рекламу'],
    ];
    const pitch = (BOT - TOP - 40) / notes.length;
    notes.forEach(([series, txt], i) => {
      const top = TOP + 20 + i * pitch;
      if (i > 0) s.hline(91, top, 494);
      const est = countLines(txt.replace(/\*\*/g, ''), 22, 462, false) * 22 * 1.2;
      const y = Math.round(top + (pitch - est) / 2);
      s.circle({ x: 91, y: y + 6, d: 18, fill: colorOf[series] });
      s.text(txt, { x: 125, y, w: 462, h: Math.ceil(est) + 6, size: 22, lh: 1.2, color: C.blueText });
    });

    // правая карточка: график
    s.card({ x: 641, y: TOP, w: 1221, h: BOT - TOP });
    s.label('Динамика месячного охвата маркетплейсов, %', { x: 674, y: 255, w: 1150, color: C.blue });
    s.chart('line', plot.series.map((ser) => ({ name: ser.name, labels: cats, values: ser.values })), {
      x: 662, y: 295, w: 1180, h: 695,
      values: false, valAxis: true, grid: true, min: 0, max: 80, format: '0',
      symbol: 'none', lineSize: 2.5, legend: 'b', legendSize: 16, axisSize: 14,
      extra: { catAxisLabelFrequency: 3, valAxisMajorUnit: 10, displayBlanksAs: 'gap', valAxisLabelFormatCode: '0' },
    });
    s.footnote('Источник: Mediascope, CrossWeb, Россия 0+, 12+');
  },

  // 10. Пересечение аудиторий трёх маркетплейсов: цифры охвата слева, диаграмма из окружностей-контуров справа
  10: (d) => {
    // второй абзац заголовка черновика → подзаголовок шапки
    const s = d.slide({
      title: 'Три крупнейших маркетплейса в значительной мере охватывают одних и тех же пользователей',
      subtitle: 'Самая большая доля эксклюзивных пользователей у Ozon',
    });
    const OZ = C.blue;
    const WB = C.crimson;
    const YM = C.cyan;

    // левая карточка: 76% + охват каждой площадки + вывод
    const LW = 640;
    s.card({ x: 58, y: TOP, w: LW, h: BOT - TOP });
    s.heading('За месяц [[76%]] россиян посещали один из трех ключевых маркетплейсов', { x: 91, y: 255, w: LW - 66 });
    const rows = [
      { img: 'img_b94a2609be.png', ratio: 2560 / 561, h: 36, v: '68', color: OZ },
      { img: 'img_d05a2f8572.png', ratio: 2827 / 811, h: 50, v: '62', color: WB },
      { img: 'img_0fdb39d87f.png', ratio: 1200 / 230, h: 40, v: '28', color: YM },
    ];
    const r0 = 448;
    const rp = 172;
    rows.forEach((r, i) => {
      const y = r0 + i * rp;
      const mid = y + rp / 2;
      if (i > 0) s.hline(91, y, LW - 66);
      s.circle({ x: 93, y: mid - 15, d: 30, stroke: r.color, sw: 5 });
      s.image(path.join(MEDIA, r.img), { x: 150, y: mid - r.h / 2, w: Math.round(r.h * r.ratio), h: r.h,
        alt: ['Ozon', 'Wildberries', 'Яндекс Маркет'][i] });
      s.text([{ text: r.v, options: {} }, { text: '%', options: { fontSize: PT(35) } }],
        { x: LW - 230, y: mid - 38, w: 200, h: 76, size: 64, bold: true, lh: 1.1, color: r.color, align: 'right', valign: 'middle' });
    });

    // правая карточка: окружности-контуры (радиусы ∝ √охвата, как в черновике)
    const RX = 58 + LW + 23;
    s.card({ x: RX, y: TOP, w: 1862 - RX, h: BOT - TOP });
    const VX = RX + (1862 - RX) / 2 + 5;
    const k = 1.12;
    const VY = Math.round(TOP + (BOT - TOP - 624 * k) / 2 + 290 * k);
    const circ = [
      { cx: VX - 42 * k, cy: VY, r: 290 * k, color: OZ },
      { cx: VX + 42 * k, cy: VY, r: 280 * k, color: WB },
      { cx: VX - 20 * k, cy: VY + 148 * k, r: 186 * k, color: YM },
    ];
    circ.forEach((c) => s.circle({ x: c.cx - c.r, y: c.cy - c.r, d: c.r * 2, stroke: c.color, sw: 5 }));
    // доли в зонах
    const zone = (t, x, y, color, size = 28) => s.text([{ text: t, options: {} }, { text: '%', options: { fontSize: PT(Math.round(size * 0.6)) } }],
      { x: x - 50, y: y - size * 0.6, w: 100, h: size * 1.2, size, bold: true, lh: 1.0, color, align: 'center', valign: 'middle' });
    zone('10', VX + (-42 - 290 + 48) * k, VY - 40 * k, OZ, 32);
    zone('6', VX + (42 + 280 - 38) * k, VY - 40 * k, WB, 32);
    zone('1', VX - 20 * k, VY + (148 + 186 - 22) * k, YM, 24);
    // три маркетплейса
    s.text([{ text: '24', options: {} }, { text: '%', options: { fontSize: PT(44) } }],
      { x: VX - 20 * k - 150, y: VY + 60 * k, w: 300, h: 96, size: 88, bold: true, lh: 1.0, color: C.navy, align: 'center', valign: 'middle' });
    s.text('используют три маркетплейса', { x: VX - 20 * k - 140, y: VY + 60 * k + 104, w: 280, size: 22, lh: 1.2, color: C.navy, align: 'center' });
    s.footnote('Источник: MediaScope, CrossWeb, июль 2026');
  },

  // 11. Динамика рекламного рынка: накопленные столбцы по годам + три мини-графика по интернету
  11: (d) => {
    const s = d.slide({ title: 'Динамика рекламного рынка в России' });
    const all = charts(11);
    // большой график: столбцы по медиа (млн руб. в исходнике → млрд руб., как в подписи)
    const big = all.find((c) => c.plots[0].series[0].name === 'Тотал');
    const dyn = all.find((c) => c.type === 'LINE_MARKERS').plots[0].series[0].values;
    const totals = big.plots[0].series[0].values.map((v) => v / 1000);
    const media = big.plots[1].series.map((ser) => ({ name: ser.name, values: ser.values.map((v) => (v == null ? null : v / 1000)) }));
    const cats = big.plots[0].cats.map((c, i) => `${c}\n${pct(dyn[i])}`);
    const colors = CHART_COLORS.slice(0, media.length);

    const topH = 452;
    s.card({ x: 58, y: TOP, w: 1804, h: topH });
    s.label('Динамика и объем рекламного рынка, млрд. руб.', { x: 91, y: 250, w: 760, color: C.blue });
    legend(s, media.map((m, i) => [m.name, colors[i]]), { right: 1829, y: 248, size: 16 });
    stackedWithTotals(s, cats, media, totals, { x: 76, y: 284, w: 1768, h: topH - 76, colors, max: 2450, gap: 40 });

    // нижний ряд: вывод + три мини-графика
    const by = TOP + topH + 23;
    const bh = BOT - by;
    const LW = 452;
    s.box({ x: 58, y: by, w: LW, h: bh, fill: C.crimson, r: 25 });
    s.icon('tb:TbTrendingUp', { x: 91, y: by + 30, size: 56, color: C.white });
    s.text('eRetail Media является главным драйвером роста сегмента интернета и рекламного рынка в целом',
      { x: 91, y: by + 104, w: LW - 66, h: bh - 134, size: 28, bold: true, lh: 1.15, color: C.white, fit: true, minSize: 24 });

    const mini = [
      { label: 'eRetail', chart: all.find((c) => c.plots[0].series[0].name === 'eRetail'), color: C.orange },
      { label: 'Интернет традиционный', chart: all.filter((c) => c.plots[0].series[0].name === 'INTERNET')[0], color: C.blue },
      { label: 'Интернет вкл. eRetail', chart: all.filter((c) => c.plots[0].series[0].name === 'INTERNET')[1], color: C.navy },
    ];
    // порядок мини-графиков в json: eRetail, Интернет традиционный (437…687), Интернет вкл. eRetail (601…1737)
    columns(3, { x0: 58 + LW + 23, x1: 1862, gap: 23 }).forEach((col, i) => {
      const m = mini[i];
      const p = m.chart.plots;
      const vals = p[0].series[0].values.map((v) => v / 1000);
      const dd = p[1].series[0].values;
      const mc = p[0].cats.map((c, j) => `${c}\n${pct(dd[j])}`);
      s.card({ x: col.x, y: by, w: col.w, h: bh });
      s.text(m.label, { x: col.x + 27, y: by + 22, w: col.w - 160, size: 24, bold: true, lh: 1.0, color: m.color });
      s.text('млрд. руб.', { x: col.x + col.w - 147, y: by + 27, w: 120, size: 14, color: C.blueText, align: 'right' });
      s.chart('col', [{ name: m.label, labels: mc, values: vals }], {
        x: col.x + 12, y: by + 58, w: col.w - 24, h: bh - 68, color: m.color, format: '#,##0', gap: 45, max: Math.max(...vals) * 1.18,
        axisSize: 14, labelSize: 14, labelBold: true,
        extra: { layout: { x: 0.03, y: 0.12, w: 0.94, h: 0.68 } }, // одинаковая область построения → оси на одной высоте
      });
    });
    s.footnote('Источник: АКАР, оценка агентства');
  },

  // 12. CTV: тезис + две большие цифры в кругах
  12: (d) => {
    const s = d.slide({ title: 'CTV становится самостоятельным слоем на фоне фрагментации просмотра и роста Smart TV' });
    const LW = 820;
    s.box({ x: 58, y: TOP, w: LW, h: BOT - TOP, fill: C.blue, r: 25 });
    s.icon('tb:TbDevices', { x: 100, y: 262, size: 84, color: C.white });
    s.text('Территории видеоселлеров смешались: большинство игроков продают рекламу на всех устройствах, что делает централизацию видеопланирования обязательной',
      { x: 100, y: 400, w: LW - 84, h: 560, size: 41, bold: true, lh: 1.15, color: C.white, valign: 'bottom', fit: true, minSize: 34 });

    const RX = 58 + LW + 23;
    s.card({ x: RX, y: TOP, w: 1862 - RX, h: BOT - TOP });
    const cols = columns(2, { x0: RX + 40, x1: 1862 - 40, gap: 40 });
    const items = [
      { v: '80', t: 'Проникновение Smart TV к 2029', color: C.blue },
      { v: '41', t: 'Подписчиков видеосервисов имеют платную подписку без рекламы', color: C.cyan },
    ];
    const D = 390;
    const capH = 68;
    const cy0 = Math.round(TOP + (BOT - TOP - (D + 36 + capH)) / 2);
    cols.forEach((c, i) => {
      const it = items[i];
      const cx = c.x + c.w / 2;
      s.circle({ x: cx - D / 2, y: cy0, d: D, fill: it.color });
      s.text([{ text: it.v, options: {} }, { text: '%', options: { fontSize: PT(76) } }],
        { x: cx - D / 2, y: cy0, w: D, h: D, size: 138, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
      s.text(it.t, { x: c.x, y: cy0 + D + 36, w: c.w, h: capH, size: 24, lh: 1.2, color: C.navy, align: 'center', fit: true, minSize: 20 });
    });
    s.footnote('Источник: https://www.sostav.ru/publication/trendy-reklamy-v-tsifrovykh-media-2027-86219.html');
  },

  // 13. Инфлюенс: ключевые тренды + топ-5 платформ (два графика)
  13: (d) => {
    const s = d.slide({ title: 'Идет диверсификация рынка, больше половины блогеров хотят идти на новые платформы' });
    const [c1, c2] = charts(13);
    const L = { x: 58, w: 880 };
    const R = { x: 961, w: 901 };
    s.card({ x: L.x, y: TOP, w: L.w, h: BOT - TOP });
    s.label('Ключевые тренды', { x: L.x + 33, y: 255, w: 600, color: C.blue });
    const rows = [
      ['76%', 'рекламодателей называют диверсификацию ключевым трендом инфлюенс-рынка'],
      ['42%', 'рекламодателей планируют увеличить бюджет на рекламу в социальных сетях и мессенджерах в 2027 году'],
      ['64%', 'блогеров планируют осваивать новые платформы в 2027 году'],
    ];
    const rh = 170;
    const rg = (BOT - 40 - 310 - rh * 3) / 2;
    rows.forEach(([v, t], i) => numberRow(s, { x: L.x + 33, y: 310 + i * (rh + rg), w: L.w - 66, h: rh, value: v, text: t, color: ACCENTS[i], tileW: 220, size: 24 }));

    s.card({ x: R.x, y: TOP, w: R.w, h: BOT - TOP });
    s.label('Топ-5 платформ', { x: R.x + 33, y: 255, w: 600, color: C.blue });
    const blocks = [
      { t: 'Используемые брендами', c: c1, y: 300 },
      { t: 'Используемые инфлюенсерами', c: c2, y: 650 },
    ];
    blocks.forEach((b) => {
      s.text(b.t, { x: R.x + 33, y: b.y, w: R.w - 66, size: 23, bold: true, lh: 1.0, color: C.navy });
      const ser = b.c.plots[0].series[0];
      s.chart('col', [{ name: b.t, labels: b.c.plots[0].cats.map((x) => x.trim()), values: ser.values }], {
        x: R.x + 20, y: b.y + 34, w: R.w - 40, h: 300, format: '0%', gap: 70, max: 0.95, axisSize: 16, labelSize: 18, labelBold: true,
      });
    });
    s.footnote('Источник: OMD Snapshot, города 1М+, 18-55, 625 респондентов, 1.-3.07.2026 W19, онлайн-опрос Tiburon Research');
  },

  // 14. Инфлюенс: доли площадок в бюджете + точки роста рынка
  14: (d) => {
    const s = d.slide({ title: 'Рекламодатели продолжают выбирать ТГ' });
    const [c1] = charts(14);
    const L = { x: 58, w: 880 };
    const R = { x: 961, w: 901 };
    s.card({ x: L.x, y: TOP, w: L.w, h: BOT - TOP });
    const lh = s.label('Площадки с наибольшей долей в бюджете рекламодателей на инфлюенс-маркетинг', { x: L.x + 33, y: 255, w: L.w - 66, color: C.blue });
    s.chart('col', [{ name: 'Доля в бюджете', labels: c1.plots[0].cats.map((x) => x.trim()), values: c1.plots[0].series[0].values }], {
      x: L.x + 30, y: 255 + lh + 30, w: L.w - 60, h: BOT - 30 - (255 + lh + 30), format: '0%', gap: 80, max: 0.48, axisSize: 18, labelSize: 22, labelBold: true,
    });

    s.card({ x: R.x, y: TOP, w: R.w, h: BOT - TOP });
    s.label('Точки роста рынка', { x: R.x + 33, y: 255, w: 600, color: C.crimson });
    const rows = [
      ['43%', 'блогеров испытывают сложности с поиском рекламодателей'],
      ['28%', 'сложности с монетизацией на нескольких платформах'],
      ['89%', 'блогеров полностью или скорее согласны, что единый кабинет для управления монетизацией на всех платформах помог бы им в развитии'],
    ];
    const rh = 170;
    const rg = (BOT - 40 - 310 - rh * 3) / 2;
    rows.forEach(([v, t], i) => numberRow(s, { x: R.x + 33, y: 310 + i * (rh + rg), w: R.w - 66, h: rh, value: v, text: t, color: ACCENTS[i], tileW: 220, size: 24 }));
    s.footnote('Источник: OMD Snapshot, города 1М+, 18-55, 625 респондентов, 1.-3.07.2026 W19, онлайн-опрос Tiburon Research');
  },

  // 15. Ключевые челленджи: три колонки-тезиса (архетип 2 фигмы без стат-плиток)
  15: (d) => {
    const s = d.slide({ title: 'Ключевые челленджи в медиапространстве' });
    const data = [
      {
        t: 'Цена растет,\nа эффективность — нет',
        p: [
          'Инвестиции в диджитал растут быстрее других медиа, в том числе из-за инфляции 10−20% YoY.',
          'Стоимость целевого действия в Q1 2026-го выросла сильнее — на 26% (E-Promo Group), то есть эффективность падает.',
          'Клик подорожал лишь на 3%, что косвенно указывает на рост фрода.',
          'Видимость креативов снижается везде, кроме мобильных баннеров (АЦРИР 2025)',
        ],
      },
      {
        t: 'Видео фрагментируется,\nCTV — ключевой драйвер',
        p: [
          'Видеопотребление не монолитно: все половозрастные группы смотрят ТВ, CTV, OLV и вертикальное видео.',
          'Территории видеоселлеров смешались: большинство игроков продают рекламу на всех устройствах, что делает централизацию видеопланирования обязательной',
        ],
      },
      {
        t: 'Соцсети и их рекламные\nвозможности стагнируют',
        p: [
          'В соцсетях сохраняются тренды на кросс-платформенность, фабрики контента (бренды + блогеры/ИИ), форматы "shop now".',
          'Компании переходят к ROI-внедрению, разделяя качественные работы и «ИИ-слоп», при этом набирает силу обратный тренд на нарочито ручной, человеческий контент и ценность эксперта',
        ],
      },
    ];
    // общий кегль текста для трёх колонок: самый крупный, при котором влезает самая длинная колонка
    const cols3 = columns(3, { gap: 22 });
    const cw3 = cols3[0].w - 78;
    const top3 = 222 + 84 + 45 + 134;
    const hAvail = BOT - 36 - top3;
    const fitsAt = (sz) => data.every((it) => it.p.reduce((a, p) => a + countLines(typo(p), sz, cw3, false) * sz * 1.25, 0) + (it.p.length - 1) * 22 <= hAvail);
    let psz = 28;
    while (psz > 18 && !fitsAt(psz)) psz -= 1;
    cols3.forEach((col, i) => {
      const it = data[i];
      const color = ACCENTS[i];
      const { cx, cy, cw } = s.numberedCard({ x: col.x, y: 222, w: col.w, h: BOT - 222, n: i + 1, color });
      s.heading(it.t, { x: cx, y: cy, w: cw, h: 80, size: 34 });
      s.hline(cx, cy + 108, cw);
      s.text(it.p.join('\n\n'), { x: cx, y: cy + 134, w: cw, h: BOT - 36 - (cy + 134), size: psz, lh: 1.25, gap: 22, color: C.blueText });
    });
  },
};
