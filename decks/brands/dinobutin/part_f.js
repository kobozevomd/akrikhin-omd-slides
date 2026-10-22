// Динобутин · стратегия 2027 — часть F: слайды исходника 24–27.
// 24, 25, 26 — digital-календарь 2027 в трёх версиях бюджета (V1 20,4M / V2 26,9M / V3 32M):
//              одна функция-сборщик calendar() + данные версий (как Normobact 23 / Bobotic 27);
// 27 — итог: 3 сценария инвестиций и роль видео (как Normobact 24 / Bobotic 28 / Azelik 59).
const { C, countLines, textWidth, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common'); // TOP, GRID

const TOP = V.TOP;      // 221
const BOT0 = 1005;      // низ контента без плашки
const BOT1 = 905;       // низ контента над плашкой
const MUTED_TXT = '6E86AD';

// Слои стратегии 2027 — цвета как на слайде 15 исходника (CAPTURE / PROTECT & CONVERT зелёный, BUILD NEW DEMAND малиновый,
// PERSONALIZE CONSIDERATION фиолетовый, BUILD TRUST & SUPPORT CHOICE оранжевый)
const STG = { DEMAND: C.crimson, PERSONALIZE: C.purple, TRUST: C.orange, CONVERT: C.green };

// ---------- Локальные хелперы (как в normobact/part_e.js) ----------

// Строка так, как её увидит слайд (перевод + типографика), без разметки
const view = (t) => typo(tr(String(t))).replace(/\*\*|\[\[|\]\]/g, '');
// Высота текста так же, как её оценивает s.text
const measure = (t, w, size = 16, bold = false, lh = 1.2) => Math.round(countLines(view(t), size, w, bold) * size * lh);
const widthOf = (t, size, bold = false) => Math.ceil(textWidth(view(t), size, bold));
const sum = (a) => a.reduce((x, y) => x + y, 0);
// Число строк с учётом **жирных** кусков (как countLines, запас 3%)
const richLines = (t, size, w, bold = false) => {
  const s = typo(tr(String(t))).replace(/\[\[|\]\]/g, '');
  const max = w * 0.97;
  const sp = textWidth(' ', size, bold);
  let lines = 0;
  for (const para of s.split(/\n\n?/)) {
    lines++;
    let b = bold;
    let cur = 0;
    let word = 0;
    let pending = false;
    const flush = () => {
      if (!pending) return;
      if (cur === 0) cur = word;
      else if (cur + sp + word <= max) cur += sp + word;
      else { lines++; cur = word; }
      while (cur > max) { lines++; cur -= max; }
      word = 0;
      pending = false;
    };
    for (let i = 0; i < para.length; i++) {
      if (para.startsWith('**', i)) { b = !b; i++; continue; }
      if (para[i] === ' ') { flush(); continue; }
      word += textWidth(para[i], size, b);
      pending = true;
    }
    flush();
  }
  return lines;
};
// Высота текста с **жирными** кусками
const measureRich = (t, w, size = 16, bold = false, lh = 1.2) => Math.round(Math.max(countLines(view(t), size, w, bold), richLines(t, size, w, bold)) * size * lh);
// Ширина блока, при которой текст занимает столько же строк, но строки ровнее (без висящего слова)
const evenW = (t, w, size, bold = false) => {
  const n = countLines(view(t), size, w, bold);
  if (n < 2 || richLines(t, size, w, bold) > n) return w;
  let lo = w * 0.4;
  let hi = w;
  while (hi - lo > 1) { const m = (lo + hi) / 2; if (richLines(t, size, m, bold) <= n) hi = m; else lo = m; }
  return Math.min(w, Math.ceil(hi) + 4);
};
// Общий кегль для ряда чисел: самый крупный, при котором каждое влезает в свою ширину
const commonSize = (items, max, min, bold = true) => {
  let sz = max;
  while (sz > min && items.some(([t, w]) => widthOf(t, sz, bold) > w * 0.97)) sz -= 1;
  return sz;
};
// Цепочку слоёв «CAPTURE & CONVERT → BUILD NEW DEMAND → …» не рвём внутри имени слоя (после перевода)
const glueStages = (t) => tr(String(t)).replace(/(CAPTURE|&|BUILD|NEW|PERSONALIZE|SUPPORT) /g, '$1\u00a0');

// Легенда календаря (правее — номер страницы)
function calLegend(s, items, y = 1034) {
  let x = 1790;
  [...items].reverse().forEach(([col, t]) => {
    const tw = widthOf(t, 15) + 6;
    x -= tw;
    s.text(t, { x, y, w: tw, size: 15, lh: 1.0, color: C.blueText });
    x -= 52;
    s.box({ x, y: y - 2, w: 42, h: 20, fill: col, r: 10 });
    x -= 30;
  });
}

// ===================== Digital support calendar 2027: три версии бюджета =====================
// Периоды в месяцах [от, до) — по заливке ячеек исходника (ppt/slides/slide24–26.xml):
// светлая E7F6FD — активный период, яркая BAE0FF — спринт. Деление сетки — по месяцам (в исходнике ячейки помесячные).
const ALL = [[0, 12]];
const Q1 = [0, 3];        // янв–мар
const AUG_NOV = [7, 11];  // авг–ноя
const ORM = { ch: 'ORM + внешние публикации', sup: 'Reviews / forums\nSERP / e-pharm cards', fmt: 'Отзывы, обзоры, Q&A, дискуссии', bud: '2,9M', act: ALL };
const GEO = { ch: 'GEO / AEO', sup: 'GEO / AI-answers', fmt: 'GEO-оптимизация под AI-ответы', bud: '1,9M', act: ALL };
// Paid Search: спринт янв–апр и авг–дек, между ними (май–июль) — активный период
const SEARCH = { ch: 'Paid Search', sup: 'Yandex Direct', fmt: 'Text + image', bud: '2,7M', act: ALL, sprint: [[0, 4], [7, 12]] };
const PROG = { ch: 'Programmatic — precise targeting', sup: 'Adsourse / PIM media', fmt: 'Banners', sprint: [Q1, AUG_NOV] };
const SOCIAL = { ch: 'Social networks', sup: 'MAX', fmt: 'Text + image', bud: '0,5M', sprint: [Q1, AUG_NOV] };
const BLOG = { ch: 'Bloggers', sup: 'MAX / VK / Dzen / Rutube', fmt: 'Clip / Post' };
const NATIVE = { ch: 'Native', sup: 'NativeRent', fmt: 'Аренда статьи' };

const VERSIONS = {
  // слайд 24
  1: {
    label: 'Budget, version 1', total: '20,4M', split: [['Digital media', '18,7M'], ['Tech cost', '1,7M']], media: '18,7M',
    kpi: ['55,5M', '9,9M', '3M UU', '6,4M', '246 тыс.', '63,4 тыс.', '1,5 тыс.'],
    rows: [
      { ch: 'CTV', sup: 'MTS', fmt: 'Video 15”, multi-roll', bud: '3,1M', sob: '17%', sprint: [Q1] },
      { ...PROG, bud: '5,5M', sob: '29%' },
      { ...SOCIAL, sob: '3%' },
      { ...BLOG, bud: '2,1M', sob: '11%', sprint: [[8, 10]] },
      { ...ORM, sob: '15%' },
      { ...GEO, sob: '10%' },
      { ...SEARCH, sob: '15%' },
    ],
    stages: [[0, 1], [1, 1], [2, 2], [4, 3]],
  },
  // слайд 25
  2: {
    label: 'Budget, version 2', total: '26,9M', split: [['Digital media', '25,2M'], ['Tech cost', '1,7M']], media: '25,2M',
    kpi: ['65,8M', '11,9M', '3,6M UU', '9,35M', '285 тыс.', '68 тыс.', '2,3 тыс.'],
    rows: [
      { ch: 'CTV', sup: 'MTS', fmt: 'Video 15”, multi-roll', bud: '5,4M', sob: '21%', sprint: [[0, 2], [8, 10]] },
      { ...PROG, bud: '6,2M', sob: '24%' },
      { ...NATIVE, bud: '1,3M', sob: '5%', sprint: [[1, 3], [9, 11]] },
      { ...SOCIAL, sob: '2%' },
      { ...BLOG, bud: '4,3M', sob: '17%', sprint: [[1, 3], [9, 11]] },
      { ...ORM, sob: '12%' },
      { ...GEO, sob: '8%' },
      { ...SEARCH, sob: '11%' },
    ],
    stages: [[0, 1], [1, 2], [3, 2], [5, 3]],
  },
  // слайд 26
  3: {
    label: 'Budget, version 3', total: '32M', split: [['Digital media', '29M'], ['Tech cost', '3M']], media: '29M',
    kpi: ['83M', '16M', '4,5M UU', '14,6M', '412 тыс.', '83,4 тыс.', '3,2 тыс.'],
    rows: [
      { ch: 'CTV / OLV', sup: 'MTS / AstraLab', fmt: 'Video 15”, multi-roll', bud: '6,9M', sob: '24%', sprint: [Q1, AUG_NOV] },
      { ...PROG, bud: '7,5M', sob: '26%' },
      { ...NATIVE, bud: '2,2M', sob: '8%', sprint: [Q1, AUG_NOV] },
      { ...SOCIAL, sob: '1%' },
      { ...BLOG, bud: '4,3M', sob: '15%', sprint: [[1, 3], [9, 11]] },
      { ...ORM, sob: '10%' },
      { ...GEO, sob: '7%' },
      { ...SEARCH, sob: '9%' },
    ],
    stages: [[0, 1], [1, 2], [3, 2], [5, 3]],
  },
};
// Слои в порядке исходника: имя, цвет (stages версии — [первая строка, число строк] в том же порядке)
const LAYERS = [['NEW DEMAND', STG.DEMAND], ['PERSONALIZE CONSIDERATION', STG.PERSONALIZE], ['BUILD TRUST & SUPPORT CHOICE', STG.TRUST], ['PROTECT & CONVERT', STG.CONVERT]];
const KPI_NAMES = ['Impressions', 'Tech. reach', 'Unique reach', 'Views', 'Clicks', 'Conversion\ncookie-banner', 'Conversion\nwhere-to-buy*'];

function calendar(d, ver) {
  const v = VERSIONS[ver];
  const s = d.slide({ title: 'Digital support calendar 2027: full-funnel flowchart' });

  // --- полоса KPI: бюджет версии со сплитом · медиа-KPI ---
  const KY = TOP;
  const KH = 146;
  const BW = 500;
  s.box({ x: 58, y: KY, w: BW, h: KH, fill: C.blue, r: 25 });
  s.text(v.label, { x: 88, y: KY + 20, w: BW - 60, size: 18, bold: true, lh: 1.0, color: C.white, caps: true, fit: true, maxLines: 1, minSize: 14 });
  s.text(v.total, { x: 88, y: KY + 58, w: 190, size: 60, bold: true, lh: 1.0, color: C.white, fit: true, maxLines: 1, minSize: 40 });
  const vx = 298;
  s.vline(vx, KY + 56, KH - 76, C.white, 1.5);
  const sx = vx + 22;
  const sw = 58 + BW - 28 - sx;
  s.text('Бюджетный сплит', { x: sx, y: KY + 56, w: sw, size: 14, bold: true, lh: 1.0, color: C.white, caps: true, fit: true, maxLines: 1, minSize: 11 });
  v.split.forEach(([k, val], i) => {
    const y = KY + 80 + i * 28;
    s.text(k, { x: sx, y, w: sw - 80, size: 18, lh: 1.0, color: C.white });
    s.text(val, { x: sx + sw - 80, y, w: 80, size: 18, bold: true, lh: 1.0, color: C.white, align: 'right' });
  });
  // медиа-KPI
  const KX = 58 + BW + 22;
  const KW = 1862 - KX;
  s.card({ x: KX, y: KY, w: KW, h: KH });
  s.text('Media KPIs', { x: KX + 26, y: KY + 24, w: 300, size: 17, bold: true, lh: 1.0, color: C.crimson });
  const k0 = KX + 26;
  const wts = [0.95, 0.9, 1.05, 0.9, 1.05, 1.1, 1.1];
  const kws = wts.map((k) => k * (KW - 40) / sum(wts));
  const ks = commonSize(v.kpi.map((t, i) => [t, kws[i] - 18]), 32, 22);
  let kx = k0;
  v.kpi.forEach((val, i) => {
    if (i) s.vline(kx - 10, KY + 58, KH - 80);
    s.text(val, { x: kx, y: KY + 56, w: kws[i] - 18, size: ks, bold: true, lh: 1.0, color: C.navy });
    s.text(KPI_NAMES[i], { x: kx, y: KY + 62 + ks, w: kws[i] - 18, h: 40, size: 15, lh: 1.15, color: C.blueText, fit: true, maxLines: 2, minSize: 13 });
    kx += kws[i];
  });

  // --- календарь: инфо-колонки + 12 месяцев ---
  const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const ROWS = v.rows;
  const X0 = 58;
  const CW = { st: 170, ch: 184, sup: 204, fmt: 252, bud: 74, sob: 62 };
  const cx = {};
  let acc = X0;
  for (const k of Object.keys(CW)) { cx[k] = acc; acc += CW[k]; }
  const MX = acc;
  const MW = (1862 - MX) / 12;
  const PADX = 10;
  const FS = 15;
  const HY = KY + KH + 20;
  const HH = 40;
  const TH = 40;
  const rowT = ROWS.map((r) => Math.max(
    measure(r.ch, CW.ch - 2 * PADX, 16, true, 1.15),
    measure(r.sup, CW.sup - 2 * PADX, FS, false, 1.15),
    measure(r.fmt, CW.fmt - 2 * PADX, FS, false, 1.15)));
  let rowH = rowT.map((t) => Math.max(48, t + 16));
  // слой из одной строки должен вместить своё имя (PERSONALIZE CONSIDERATION в версии 1)
  v.stages.forEach(([i0, n], li) => {
    if (n !== 1) return;
    const need = measure(LAYERS[li][0], CW.st - 30, 15, true, 1.1) + 20;
    rowH[i0] = Math.max(rowH[i0], need);
  });
  const spare = BOT0 - TH - (HY + HH) - sum(rowH);
  rowH = rowH.map((h, i) => (spare > 0 ? h + spare / ROWS.length : Math.max(rowT[i] + 8, h + spare / ROWS.length)));
  // шапка
  s.box({ x: X0, y: HY, w: 1862 - X0, h: HH, fill: C.navy, r: 0 });
  const HEAD = [['Этап', 'st'], ['Канал', 'ch'], ['Поставщики', 'sup'], ['Формат', 'fmt'], ['Бюджет', 'bud'], ['SOB %', 'sob']];
  const num = (k) => k === 'bud' || k === 'sob';
  HEAD.forEach(([t, k]) => s.text(t.toUpperCase(), { x: cx[k] + PADX - (num(k) ? 6 : 0), y: HY, w: CW[k] - 2 * PADX + (num(k) ? 12 : 0), h: HH, size: 14, bold: true, lh: 1.0, color: C.white,
    valign: 'middle', align: num(k) ? 'center' : 'left', fit: true, maxLines: 1, minSize: 11 }));
  MON.forEach((t, i) => s.text(t, { x: MX + i * MW, y: HY, w: MW, h: HH, size: 14, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' }));
  const ys = [];
  let y = HY + HH;
  ROWS.forEach((r, i) => { ys.push(y); y += rowH[i]; });
  const yEnd = y;
  for (let i = 0; i <= 12; i++) s.vline(MX + i * MW, HY + HH, yEnd - HY - HH, i === 0 ? C.line : V.GRID, i === 0 ? 1.5 : 1.25);
  const bar = (a, b, yc, h, fill) => s.box({ x: MX + a * MW + 5, y: yc - h / 2, w: (b - a) * MW - 10, h, fill, r: h / 2 });
  ROWS.forEach((r, i) => {
    const y0 = ys[i];
    const h = rowH[i];
    if (i < ROWS.length - 1) s.hline(cx.ch, y0 + h, 1862 - cx.ch, C.line, 1.5);
    const cell = (k, t, o = {}) => s.text(t, { x: cx[k] + PADX, y: y0, w: CW[k] - 2 * PADX, h, size: o.size ?? FS, bold: !!o.bold, lh: 1.15,
      color: o.color ?? C.blueText, valign: 'middle', align: o.align ?? 'left' });
    cell('ch', r.ch, { size: 16, bold: true, color: C.navy });
    cell('sup', r.sup);
    cell('fmt', r.fmt);
    cell('bud', r.bud, { size: 16, bold: true, color: C.navy, align: 'center' });
    cell('sob', r.sob, { align: 'center' });
    (r.act || []).forEach(([a, b]) => bar(a, b, y0 + h / 2, 16, 'A6CDEE'));
    (r.sprint || []).forEach(([a, b]) => bar(a, b, y0 + h / 2, 28, C.crimson));
  });
  // слои — цветами слоёв деки (слайд 15)
  v.stages.forEach(([i0, n], li) => {
    const [t, col] = LAYERS[li];
    const yy = ys[i0] + 4;
    const hh = ys[i0 + n - 1] + rowH[i0 + n - 1] - ys[i0] - 8;
    s.box({ x: X0 + 3, y: yy, w: CW.st - 10, h: hh, fill: col, r: 10 });
    s.text(t, { x: X0 + 14, y: yy, w: CW.st - 30, h: hh, size: 15, bold: true, lh: 1.1, color: C.white, valign: 'middle', fit: true, maxLines: 4, minSize: 12 });
  });
  // итог
  s.box({ x: X0, y: yEnd, w: 1862 - X0, h: TH, fill: C.navy, r: 0 });
  s.text('TOTAL', { x: cx.ch + PADX, y: yEnd, w: CW.ch, h: TH, size: 16, bold: true, lh: 1.0, color: C.white, valign: 'middle' });
  s.text(v.media, { x: cx.bud - 8, y: yEnd, w: CW.bud + 16, h: TH, size: 16, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
  s.text('100%', { x: cx.sob, y: yEnd, w: CW.sob, h: TH, size: 15, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });

  calLegend(s, [['A6CDEE', 'активный период'], [C.crimson, 'спринт']]);
  s.footnote('Бюджет до НДС, включая АК/РС. *Конверсия «Где купить»', { w: 900 });
}

module.exports = {
  24: (d) => calendar(d, 1),
  25: (d) => calendar(d, 2),
  26: (d) => calendar(d, 3),

  // ===================== 27. Три сценария инвестиций: как меняется роль видео =====================
  27: (d) => {
    const s = d.slide({ title: 'Динобутин 2027', subtitle: '3 сценария инвестиций: как меняется роль видео' });

    // --- четыре плитки: бизнес-цель, инвестиции, масштаб digital, video layer ---
    const TILES = [
      { lab: 'Бизнес-цель 2027', v: '190 млн ₽', sub: '15% доли в детском сегменте', color: C.crimson },
      { lab: 'Инвестиции', v: '12,3 → 20,4 / 26,9 / 32 млн ₽', sub: '+65% / +120% / +160% к 2026', color: C.blue },
      { lab: 'Масштаб digital', v: '3M / 3,6M / 4,5M', sub: 'Unique Reach, Universe 7,6M UU', color: C.navy2 },
      { lab: 'Video layer', v: '3,1 / 5,4 / 6,9 млн ₽', sub: 'CTV Q1 → CTV Q1+Q4 → CTV Q1 + OLV Q4', color: C.purple },
    ];
    // ширины плиток — по длине содержимого, остаток поровну
    const GAP = 22;
    const PAD = 28;
    const need = TILES.map((t) => Math.max(widthOf(t.v, 34, true), widthOf(t.sub, 17, true), widthOf(t.lab.toUpperCase(), 16, true)) + 2 * PAD + 8);
    const free = 1804 - 3 * GAP - sum(need);
    const tw = need.map((n) => n + free / TILES.length);
    const TH = 136;
    const tvs = commonSize(TILES.map((t, i) => [t.v, tw[i] - 2 * PAD]), 40, 26);
    let tx = 58;
    TILES.forEach((t, i) => {
      const w = tw[i];
      s.box({ x: tx, y: TOP, w, h: TH, fill: t.color, r: 25 });
      s.text(t.lab, { x: tx + PAD, y: TOP + 22, w: w - 2 * PAD, size: 16, bold: true, lh: 1.0, color: C.white, caps: true, fit: true, maxLines: 1, minSize: 13 });
      s.text(t.v, { x: tx + PAD, y: TOP + 50, w: w - 2 * PAD, size: tvs, bold: true, lh: 1.0, color: C.white });
      s.text(t.sub, { x: tx + PAD, y: TOP + 100, w: w - 2 * PAD, size: 17, bold: true, lh: 1.0, color: C.white, fit: true, maxLines: 1, minSize: 13 });
      tx += w + GAP;
    });

    // --- нижняя часть: 2026 → 2027 (над плашкой) ---
    const T26 = 'Search + ORM + CTV-test: бренд умеет создавать собственный спрос (+181% Brand Search)';
    const T27 = '**V1:** создать знание → **V2:** поддержать знание в двух окнах спроса → **V3:** добавить targeted frequency и персонализацию → Programmatic с сегментными сообщениями → AI Visibility Stream конвертируют новый спрос в выбор';
    const L26 = { x: 58, w: 540 };
    const L27 = { x: 58 + 540 + 64, w: 1862 - (58 + 540 + 64) };
    const g26w = L26.w - 56;
    const g27w = L27.w - 56;
    const BS = 17;
    const sbH = Math.max(22 + 20 + 10 + measure(T26, g26w, BS) + 22, 22 + 20 + 10 + measureRich(T27, g27w, BS) + 22);
    const SBY = BOT1 - sbH;
    const SLY = SBY - 38;

    // --- середина: как работает Comprehensive в 3 сценариях · что меняет дополнительная инвестиция ---
    const MY = TOP + TH + 20;
    const MH = SLY - 20 - MY;
    const L = { x: 58, w: 960 };
    s.card({ x: L.x, y: MY, w: L.w, h: MH });
    const lx = L.x + 28;
    const lw = L.w - 56;
    s.label('Как работает Comprehensive в 3 сценариях', { x: lx, y: MY + 22, w: lw, size: 20, color: C.blue });
    const GH = 42;
    const ay = MY + 58;
    // Always-on = слой CAPTURE & CONVERT (Search / ORM / GEO / публикации) — зелёный, как на слайдах 15 и 24–26
    s.box({ x: lx, y: ay, w: lw, h: GH, fill: STG.CONVERT, r: 12 });
    s.text('Always-on: Search · ORM · GEO/AEO · публикации', { x: lx + 16, y: ay, w: lw - 32, h: GH, size: 17, bold: true, lh: 1.0, color: C.white, caps: true, align: 'center', valign: 'middle', fit: true, maxLines: 1, minSize: 14 });
    // три сценария — три ряда фаз (как в исходнике: спринт 1 · decision gate · спринт 2)
    const VC = [C.crimson, C.blue, C.purple]; // цвета номеров сценариев — как 01/02/03 справа
    const SCN = [
      ['**Sprint 1 (Q1)**\nCTV + Precise Media', '**Decision Gate**\nMedia', '**Sprint 2 Aug–Nov**\nScale media winner w/o CTV'],
      ['**Sprint 1 (Q1)**\nCTV Jan–Feb + Precise Media', '**Decision Gate**\nMedia', '**Sprint 2 Aug–Nov**\nCTV Sep–Oct. Scale media winner'],
      ['**Sprint 1 (Q1)**\nCTV + Precise Media', '**Decision Gate**\nMedia', '**Sprint 2 Aug–Nov**\nOLV + Scale media winner'],
    ];
    const NOTE = '**Общий принцип:** AON AI Visibility Stream; рост бюджета идёт в создание нового спроса и качество видеоконтакта';
    const ntw = lw - 22;
    const noteH = measureRich(NOTE, ntw, 17);
    const vtag = 44;
    const gg = 8;
    const px0 = lx + vtag + 10;
    const pwAll = lx + lw - px0 - 2 * gg;
    const PW = [0.36, 0.22, 0.42].map((k) => k * pwAll);
    const PCOL = [C.crimson, C.orange, C.crimson];
    const py0 = ay + GH + 12;
    const pAvail = MY + MH - 22 - noteH - 18 - py0;
    const PHH = Math.min(60, (pAvail - 2 * gg) / 3);
    SCN.forEach((row, r) => {
      const py = py0 + r * (PHH + gg);
      s.badge({ x: lx, y: py + (PHH - 40) / 2, d: 40, n: `V${r + 1}`, color: VC[r], size: 15 });
      let px = px0;
      row.forEach((t, k) => {
        s.box({ x: px, y: py, w: PW[k], h: PHH, fill: PCOL[k], r: 12 });
        s.text(t, { x: px + 8, y: py, w: PW[k] - 16, h: PHH, size: 15, lh: 1.1, color: C.white, align: 'center', valign: 'middle', fit: true, maxLines: 2, minSize: 12 });
        px += PW[k] + gg;
      });
    });
    const nyTop = py0 + 3 * PHH + 2 * gg;
    const ny = nyTop + (MY + MH - 22 - nyTop - noteH) / 2;
    s.box({ x: lx, y: ny, w: 6, h: noteH, fill: STG.CONVERT, r: 0 });
    s.text(NOTE, { x: lx + 22, y: ny, w: evenW(NOTE, ntw, 17), size: 17, lh: 1.2, color: C.navy });

    const R = { x: L.x + L.w + 22, w: 1862 - (L.x + L.w + 22) };
    s.card({ x: R.x, y: MY, w: R.w, h: MH });
    const rx = R.x + 28;
    const rw = R.w - 56;
    s.label('Что меняет дополнительная инвестиция', { x: rx, y: MY + 22, w: rw, size: 20, color: C.blue });
    const OP = [
      { st: 'V1 · CTV only, Q1', m: '20,4 млн ₽ total · 3,1 млн ₽ CTV', t: '60% F 3+ в ядре · знание до активного поиска' },
      { st: 'V2 · CTV two waves Q1+Q4', m: '26,9 млн ₽ total · 5,4 млн ₽ video', t: '65% F 5+ в ядре · две волны знания в Q1 и Q4' },
      { st: 'V3 · CTV Q1 + OLV Q4', m: '32,0 млн ₽ total · 6,9 млн ₽ video', t: 'CTV = knowledge · OLV = targeted frequency + personalization' },
    ];
    const bd = 44;
    const otx = rx + bd + 18;
    const otw = rx + rw - otx;
    const parts = OP.map((o) => [measure(o.st.toUpperCase(), otw, 19, true, 1.05), measure(o.m, otw, 17, true), measure(o.t, otw, 17)]);
    const oh = parts.map((p) => Math.max(p[0], bd - 8) + 6 + p[1] + 2 + p[2]);
    const oy0 = MY + 64;
    const ogap = (MY + MH - 20 - oy0 - sum(oh)) / (OP.length - 1);
    let oy = oy0;
    OP.forEach((o, i) => {
      const [h1, h2, h3] = parts[i];
      const top = oy;
      s.badge({ x: rx, y: top, d: bd, n: `0${i + 1}`, color: VC[i], size: 17 });
      s.text(o.st, { x: otx, y: top + (bd - h1) / 2 - 1, w: otw, size: 19, bold: true, lh: 1.05, color: C.navy, caps: true });
      const y2 = top + Math.max(h1, bd - 8) + 6;
      s.text(o.m, { x: otx, y: y2, w: otw, size: 17, bold: true, lh: 1.2, color: VC[i] });
      s.text(o.t, { x: otx, y: y2 + h2 + 2, w: otw, size: 17, lh: 1.2, color: C.blueText });
      oy += oh[i] + ogap;
    });

    // --- как растёт бизнес-ценность: 2026 → 2027 ---
    s.label('Как растёт бизнес-ценность по мере увеличения инвестиций', { x: 58, y: SLY, w: 1804, size: 20, color: C.blue });
    s.card({ x: L26.x, y: SBY, w: L26.w, h: sbH });
    s.text('2026 · доказано', { x: L26.x + 28, y: SBY + 22, w: g26w, size: 17, bold: true, lh: 1.0, color: MUTED_TXT, caps: true });
    s.text(T26, { x: L26.x + 28, y: SBY + 22 + 20 + 10, w: evenW(T26, g26w, BS), size: BS, lh: 1.2, color: C.navy });
    s.arrow({ dir: 'right', x: L26.x + L26.w + 12, y: SBY + sbH / 2, len: 40, head: 34, headLen: 18, stem: 10, color: C.crimson });
    s.card({ x: L27.x, y: SBY, w: L27.w, h: sbH, tint: true });
    s.text('2027 · 3 уровня масштабирования', { x: L27.x + 28, y: SBY + 22, w: g27w, size: 17, bold: true, lh: 1.0, color: C.blue, caps: true });
    s.text(T27, { x: L27.x + 28, y: SBY + 22 + 20 + 10, w: evenW(T27, g27w, BS), size: BS, lh: 1.2, color: C.navy });

    s.formula({ text: glueStages('CAPTURE & CONVERT → BUILD NEW DEMAND → PERSONALIZE CONSIDERATION → SUPPORT CHOICE'), color: C.crimson, size: 24 });
  },
};
