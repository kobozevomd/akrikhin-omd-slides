// Боботик · стратегия 2027 — часть B: слайды исходника 7–11
// 7 — «перекрыть нашим УТП усиливающуюся конкуренцию» (скрытый; текст из картинки исходника — живым текстом);
// 8 — категория: замедление в 1ПГ (живые графики «колики» / «газики», выводы за полугодие);
// 9 — география Digital: ядро / рост / планировочная гипотеза (аналог — Acriol 10);
// 10 — Search demand dynamics 2026: Wordstat и Ozon (аналог — Acriol 5, Azelik 16);
// 11 — comprehensive-подход подтвердил эффективность occasion-based модели (скрытый; аналог — Azelik 17).
const path = require('path');
const { C, ACCENTS, CHART_COLORS, columns, IN, PT, chartMap, textWidth, fitSize, countLines, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT, MUTED, GRID, fmt, pct, statTile, numMark, legend, yearAxis, gridY
const B = require('./common');                            // SRC, MEDIA, CROPS, fromSource, video
const SRC = B.SRC;

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
const BAND = mix('FFFFFF', C.crimson, 0.08);   // подсветка периода
const BASE = mix('FFFFFF', C.blue, 0.07);      // подсветка базового периода сравнения
const thin = (v) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');   // 40000 → «40 000»

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

// Цифра + подпись на одной базовой линии: «1,15%» крупно, «CTR» мельче справа
function valueUnit(s, { x, y, w, value, unit, size = 64, unitSize = 20, color = C.navy, unitColor = C.blueText, unitBold = true }) {
  const vw = Math.ceil(widthOf(value, size, true)) + 6;
  const vh = size * 1.1;
  s.text(value, { x, y, w: vw, size, bold: true, lh: 1.1, color });
  if (unit) {
    const uw = w - vw - 12;
    const uh = measure(unit, uw, unitSize, unitBold);
    s.text(unit, { x: x + vw + 12, y: y + vh - uh - (size - unitSize) * 0.16, w: uw, size: unitSize, bold: unitBold, lh: 1.2, color: unitColor });
  }
  return vh;
}

// Подписи месяцев под осью недель: подпись по центру своей группы + тонкие разделители
// (узкий декабрь — 1 неделя — подпись шире своей группы, чтобы не рвалась)
function monthAxis(s, m, groups, y, { size = 15 } = {}) {
  let i0 = 0;
  groups.forEach(([mo, n], gi) => {
    const xa = m.cat(i0) - m.step / 2;
    const xb = m.cat(i0 + n - 1) + m.step / 2;
    const lw = Math.max(xb - xa, Math.ceil(widthOf(mo, size, true)) + 12);
    s.text(mo, { x: (xa + xb) / 2 - lw / 2, y: y + 6, w: lw, size, bold: true, color: C.navy, align: 'center' });
    if (gi > 0) s.seg(xa, y, xa, y + 26, { color: C.line, width: 1.5 });
    i0 += n;
  });
}

module.exports = {
  // =====================================================================
  // 7 · В медиа поле мы должны перекрыть нашим УТП усиливающуюся конкуренцию (скрытый)
  // В исходнике поверх живого текста лежит картинка-макет во весь слайд: видна только она.
  // Переносим текст картинки (итоговый вид); живой текст под картинкой — черновик, не переносим.
  // =====================================================================
  7: (d) => {
    const s = d.slide({ title: 'В медиа поле мы должны перекрыть нашим УТП и усиливающуюся конкуренцию за проблематику колик' });
    s.s.hidden = true;

    // ── верх: проблема → наше преимущество ──
    const topH = 146;
    const gapX = 23;
    const lw = 860;
    const rw = X1 - X0 - lw - gapX;
    const pair = [
      { x: X0, w: lw, icon: 'tb:TbTarget', circle: C.blue, fill: C.card, color: C.navy,
        text: 'Причин колик множество, и конкуренция за эту проблему усиливается: мамы ищут решения у разных брендов, но даже зная это, продолжают искать более комплексную помощь' },
      { x: X0 + lw + gapX, w: rw, icon: 'tb:TbShieldCheck', circle: C.crimson, fill: C.cardTint, color: C.navy,
        text: 'Мы можем помочь при любых видах колик и связанных симптомах (газики, вздутие), и это наше ключевое преимущество — [[Боботик]]' },
    ];
    pair.forEach((p) => {
      s.card({ x: p.x, y: TOP, w: p.w, h: topH, fill: p.fill });
      const d0 = 72;
      s.icon(p.icon, { x: p.x + 30, y: TOP + (topH - d0) / 2, size: d0, circle: p.circle });
      const tx = p.x + 30 + d0 + 26;
      const tw = p.x + p.w - 30 - tx;
      s.text(p.text, { x: tx, y: TOP + 14, w: tw, h: topH - 28, size: 21, bold: true, lh: 1.2, color: p.color, valign: 'middle', fit: true, minSize: 18 });
    });

    // ── 4 направления: синяя плитка-тезис → пояснение + действие (малиновым) ──
    const rows = [
      { icon: 'tb:TbMessageCircle', title: 'Коммуникационно: колики не только из-за лактазы',
        text: 'Мамы сталкиваются с разными причинами колик и газообразования — не только с лактазной недостаточностью. В медиаполе присутствуют бренды с разными механизмами действия, и каждый из них предлагает свое решение.',
        act: 'Показываем более полную картину проблемы и нашу экспертизу.' },
      { icon: 'tb:TbHeartHandshake', title: 'Мы надежный удобный помощник маме — простое решение в сложный момент',
        text: 'Мамы выбирают продукты, которые помогают быстро и безопасно облегчить состояние ребенка. Важно говорить о простоте применения Боботика (капли, можно с первых дней жизни), надежности и эффективности — это ключевые факторы выбора.',
        act: 'Подчеркиваем простоту, удобство и надежность Боботика.' },
      { icon: 'tb:TbSwords', title: 'Конкуренты расширяют коммуникацию и заходят на территорию колик',
        text: 'Ряд брендов, включая Лактазар, усиливают присутствие в теме колик через UGC, более широкое позиционирование и образовательный контент. Мы видим рост интереса к категории и смещение коммуникации конкурентов в сторону комплексного подхода к комфорту животика.',
        act: 'Отвечаем сильным контентом, экспертизой и заметным присутствием в ключевых каналах.' },
      { icon: 'tb:TbSearch', title: 'Перехватить весь категорийный спрос на решение от колик',
        text: 'Работать по ключевым запросам: брендовые (Боботик, колики у новорожденных и т.д.) / категорийные (колики, газики, вздутие, мучают колики и т.д.) / конкурентные (включая Лактазар и др.). Использовать поиск, контент, отзывы, экспертные материалы и карточки товара.',
        act: 'Быть заметными на всем пути мамы — от первого вопроса до покупки.' },
    ];
    const RY = TOP + topH + 22;
    const rg = 14;
    const RH = Math.floor((BOT - RY - rg * (rows.length - 1)) / rows.length);
    const TW = 470;                       // плитка-тезис
    const AX = X0 + TW;                   // стрелка
    const CX = X0 + TW + 30;              // карточка пояснения
    const CW = X1 - CX;
    const tp = 28;
    const tw = CW - tp * 2;
    // кегль пояснений — общий для всех строк, по самой длинной
    let fs = 20;
    const need = (sz) => Math.max(...rows.map((r) => measure(r.text, tw, sz) + 8 + measure(r.act, tw, sz, true)));
    while (fs > 16 && need(fs) > RH - 24) fs -= 1;
    rows.forEach((r, i) => {
      const y = RY + i * (RH + rg);
      s.box({ x: X0, y, w: TW, h: RH, fill: C.blue, r: 20 });
      s.icon(r.icon, { x: X0 + 26, y: y + (RH - 56) / 2, size: 56, color: C.white });
      s.text(r.title, { x: X0 + 26 + 56 + 22, y: y + 10, w: TW - 26 - 56 - 22 - 22, h: RH - 20, size: 21, bold: true, lh: 1.15, color: C.white, valign: 'middle', fit: true, minSize: 17 });
      s.card({ x: CX, y, w: CW, h: RH });
      s.chevron({ cx: AX + 15, cy: y + RH / 2, dir: 'right', color: C.crimson });
      const th = measure(r.text, tw, fs);
      const ah = measure(r.act, tw, fs, true);
      const ty = y + (RH - th - 8 - ah) / 2;
      s.text(r.text, { x: CX + tp, y: ty, w: tw, size: fs, lh: 1.2, color: C.blueText });
      s.text(r.act, { x: CX + tp, y: ty + th + 8, w: tw, size: fs, bold: true, lh: 1.2, color: C.crimson });
    });
  },

  // =====================================================================
  // 8 · Категория: замедление в 1ПГ, выравнивание по году
  // =====================================================================
  8: (d) => {
    const s = d.slide({ title: 'Категория демонстрирует замедление в 1ПГ, но выравнивается по всему году' });
    const ch = charts(8);
    const find = (key) => ch.find((c) => c.plots[0].series[0].name.toLowerCase().includes(key)).plots[0];
    const kol = find('колики');
    const gaz = find('газики');
    const iso = kol.cats.map(xlDate);                       // 2024-01 … 2026-06, 30 месяцев
    const N = iso.length;
    const kolV = kol.series[0].values.map(Math.round);
    const gazV = gaz.series[0].values.map(Math.round);

    // ---- левая карточка: два графика на общей оси месяцев ----
    const CARD = { x: X0, y: TOP, w: 1250, h: BOT - TOP };
    s.card(CARD);
    const PX0 = 168;
    const PX1 = CARD.x + CARD.w - 36;
    const LX = CARD.x + 36;
    const P1 = { x: PX0, y: 318, w: PX1 - PX0, h: 250 };
    const P2 = { x: PX0, y: 652, w: PX1 - PX0, h: 216 };
    const K = { lo: 30000, hi: 55000 };
    const G = { lo: 6000, hi: 13000 };
    const m1 = chartMap('line', N, P1, K.lo, K.hi);
    const m2 = chartMap('line', N, P2, G.lo, G.hi);
    // сезонные окна исходника (розовые полосы) — период «лето–зима»; в исходнике они сдвигаются по годам
    // («сезонность немного меняется из года в год»): ≈ авг–дек 2024, ≈ июль–ноя 2025 и третья полоса с июня 2026
    // (замерено по рендеру исходника: полосы 5,2 месяца шириной, края — 6,85…12,1 и 17,5…22,7 по индексу месяца, третья — от 28,8 до края)
    const seasons = [[iso.indexOf('2024-08-01'), iso.indexOf('2024-12-01')], [iso.indexOf('2025-07-01'), iso.indexOf('2025-11-01')],
      [iso.indexOf('2026-06-01'), iso.indexOf('2026-06-01')]];
    const bands = (m, P, top = 0) => seasons.forEach(([a, b]) => {
      const xa = m.cat(a) - m.step / 2;
      const xb = m.cat(b) + m.step / 2;
      s.box({ x: xa, y: P.y - top, w: xb - xa, h: P.h + top, fill: BAND, r: 0 });
    });
    bands(m1, P1, 30);
    bands(m2, P2, 0);
    // подпись — только там, где помещается (узкая полоса июня 2026 — без подписи)
    seasons.forEach(([a, b]) => {
      if ((b - a + 1) * m1.step - 20 < widthOf(String(tr('лето–зима')).toUpperCase(), 15, true) + 4) return;
      s.text('лето–зима', { x: m1.cat(a) - m1.step / 2 + 10, y: P1.y - 24, w: (b - a + 1) * m1.step - 20, size: 15, bold: true, lh: 1.0, color: C.crimson, caps: true });
    });
    const grid = (m, P, vals) => vals.forEach((v) => {
      s.seg(P.x, m.val(v), P.x + P.w, m.val(v), { color: GRID, width: 1.25 });
      s.text(thin(v), { x: P.x - 92, y: m.val(v) - 10, w: 80, size: 14, color: C.blueText, align: 'right' });
    });
    grid(m1, P1, [30000, 40000, 50000]);
    grid(m2, P2, [6000, 8000, 10000, 12000]);
    s.label('«Колики у новорожденного»', { x: LX, y: 247, w: 700, size: 20, color: C.blue });
    s.label('«Газики у новорожденного»', { x: LX, y: P2.y - 50, w: 700, size: 20, color: C.blue });
    const labels = iso.map((x) => `${MONTHS[Number(x.slice(5, 7)) - 1]} ${x.slice(0, 4)}`);
    const lineOpts = (P, lo, hi) => ({ x: P.x - 12, y: P.y - 12, w: P.w + 24, h: P.h + 24, plot: P, min: lo, max: hi, values: false, legend: false,
      colors: [C.blue], symbol: 'none', lineSize: 3, extra: { catAxisHidden: true, catAxisLineShow: false } });
    s.chart('line', [{ name: 'Колики у новорожденного', labels, values: kolV }], lineOpts(P1, K.lo, K.hi));
    s.chart('line', [{ name: 'Газики у новорожденного', labels, values: gazV }], lineOpts(P2, G.lo, G.hi));
    // точки: начало ряда, пик 2025 года, последний месяц
    const dot = (m, i, v, pos) => {
      const x = m.cat(i);
      const y = m.val(v);
      s.circle({ x: x - 7, y: y - 7, d: 14, fill: C.blue, stroke: C.white, sw: 2 });
      const t = thin(v);
      const w = Math.ceil(widthOf(t, 17, true)) + 8;
      if (pos === 'up') s.text(t, { x: x - w / 2, y: y - 30, w, size: 17, bold: true, lh: 1.0, color: C.navy, align: 'center' });
      else if (pos === 'right') s.text(t, { x: x + 10, y: y - 26, w, size: 17, bold: true, lh: 1.0, color: C.navy });
      else s.text(t, { x: x - w + 4, y: y - 30, w, size: 17, bold: true, lh: 1.0, color: C.navy, align: 'right' });
    };
    const peak = (vals, year) => {
      const idx = iso.map((x, i) => (x.startsWith(year) ? i : -1)).filter((i) => i >= 0);
      return idx.reduce((a, i) => (vals[i] > vals[a] ? i : a), idx[0]);
    };
    [[m1, kolV], [m2, gazV]].forEach(([m, vals]) => {
      dot(m, 0, vals[0], 'start');
      const p = peak(vals, '2025');
      dot(m, p, vals[p], 'up');
      dot(m, N - 1, vals[N - 1], 'up');
    });
    // ось: месяцы и годы
    s.seg(P2.x, P2.y + P2.h, P2.x + P2.w, P2.y + P2.h, { color: C.line, width: 1.5 });
    iso.forEach((x, i) => s.text(MONTHS[Number(x.slice(5, 7)) - 1], { x: m2.cat(i) - 22, y: P2.y + P2.h + 8, w: 44, size: 14, color: C.blueText, align: 'center' }));
    V.yearAxis(s, m2, [['2024', 12], ['2025', 12], ['2026', 6]], P2.y + P2.h + 36, { size: 17 });

    // ---- правая колонка: выводы за 1 полугодие ----
    const RX = CARD.x + CARD.w + 24;
    const RW = X1 - RX;
    s.label('За 1 полугодие:', { x: RX, y: TOP + 2, w: RW, size: 20, color: C.crimson });
    const pad = 24;
    const iw = RW - pad * 2;
    const blocks = [
      { head: '«Колики у новорожденного» **сокращались**',
        a: ['−4,7%', 'в 2025'], b: ['−10,0%', 'в 2026'], note: 'При этом в тотале 24 vs 25 год падения около 1%.' },
      { head: '«Газики у новорожденного» также **упали**',
        a: ['+16,2%', 'в 2025'], b: ['−15,4%', 'в 2026'], note: 'При этом в тотале 24 vs 25 год рост 17%.' },
    ];
    let y = TOP + 38;
    const tileH = 92;
    const tW = (iw - 14) / 2;
    blocks.forEach((bk) => {
      const hh = measure(bk.head, iw, 19);
      const nh = measure(bk.note, iw, 17, true);
      const h = pad + hh + 14 + tileH + 14 + nh + pad - 4;
      s.card({ x: RX, y, w: RW, h });
      s.text(bk.head, { x: RX + pad, y: y + pad - 2, w: iw, size: 19, lh: 1.2, color: C.navy });
      const ty = y + pad + hh + 12;
      s.box({ x: RX + pad, y: ty, w: tW, h: tileH, fill: C.cardTint, stroke: C.line, sw: 2 });
      s.text(bk.a[0], { x: RX + pad + 20, y: ty + 10, w: tW - 30, size: 40, bold: true, lh: 1.1, color: C.navy });
      s.text(bk.a[1], { x: RX + pad + 20, y: ty + 58, w: tW - 30, size: 17, bold: true, color: C.navy });
      s.box({ x: RX + pad + tW + 14, y: ty, w: tW, h: tileH, fill: C.crimson });
      s.text(bk.b[0], { x: RX + pad + tW + 34, y: ty + 10, w: tW - 30, size: 40, bold: true, lh: 1.1, color: C.white });
      s.text(bk.b[1], { x: RX + pad + tW + 34, y: ty + 58, w: tW - 30, size: 17, bold: true, color: C.white });
      s.text(bk.note, { x: RX + pad, y: ty + tileH + 14, w: iw, size: 17, bold: true, lh: 1.2, color: C.navy });
      y += h + 16;
    });
    // категория в целом и сезонность: строки с иконками (зелёная «весна», синяя «сезонность», малиновое «замедление»)
    const tail = [
      { icon: 'tb:TbTrendingDown', color: C.crimson, t: 'В 1ПГ 26 года категорийный рост также **замедляется −10% и 15%**.' },
      { icon: 'tb:TbCalendarStats', color: C.blue, t: '**Сезонность спроса** немного меняется из года в год, но период **лето–зима** остаётся наиболее высоким.' },
      { icon: 'tb:TbPlant', color: C.green, t: 'В то время как **весной** наблюдается снижение интереса.' },
    ];
    s.card({ x: RX, y, w: RW, h: BOT - y, tint: true });
    const ID = 44;
    const tx = RX + pad + ID + 16;
    const tw = RX + RW - pad - tx;
    let fs = 18;
    const rowH = (t, sz) => Math.max(ID, measure(t, tw, sz));
    const tailH = (sz) => tail.reduce((a, r) => a + rowH(r.t, sz), 0);
    while (fs > 16 && tailH(fs) + 2 * 14 > BOT - y - 40) fs -= 1;
    const tg = Math.min(26, (BOT - y - 44 - tailH(fs)) / (tail.length - 1));
    let ty = y + (BOT - y - tailH(fs) - tg * (tail.length - 1)) / 2;
    tail.forEach((r) => {
      const h = rowH(r.t, fs);
      const th = measure(r.t, tw, fs);
      s.icon(r.icon, { x: RX + pad, y: ty + (h - ID) / 2, size: ID, circle: r.color });
      s.text(r.t, { x: tx, y: ty + (h - th) / 2, w: tw, size: fs, lh: 1.2, color: C.navy });
      ty += h + tg;
    });
  },

  // =====================================================================
  // 9 · География Digital: ядро / рост / планировочная гипотеза (аналог — Acriol 10)
  // =====================================================================
  9: (d) => {
    const s = d.slide({ title: 'География Digital: усиливаем ядро и точки роста, сохраняя национальное присутствие' });

    // ── полоса цифр: три про ядро + планировочная гипотеза (малиновая) ──
    const kp = [
      { lab: 'Ядро Digital', val: '50,0%', sub: 'продаж H1’26 в 14\u00a0регионах' },
      { lab: 'Актуальный спрос', val: '53,9%', sub: 'июльских продаж в ядре' },
      { lab: 'DI* ядра', val: '83,6%', sub: 'средневзвешенный DI H1’26' },
      { lab: 'Планировочная гипотеза', val: '55–60%', sub: 'digital-инвестиций — ядро', hl: true },
    ];
    const kc = columns(4, { gap: 23 });
    const KH = 112;
    kp.forEach((k, i) => {
      const c = kc[i];
      s.box({ x: c.x, y: TOP, w: c.w, h: KH, fill: k.hl ? C.crimson : C.cardTint, stroke: k.hl ? undefined : C.line, sw: 2 });
      const ink = k.hl ? C.white : C.navy;
      s.text(k.lab, { x: c.x + 24, y: TOP + 16, w: c.w - 48, size: 16, bold: true, lh: 1.0, color: k.hl ? C.white : C.blueText, caps: true });
      valueUnit(s, { x: c.x + 24, y: TOP + 40, w: c.w - 40, value: k.val, unit: k.sub, size: 46, unitSize: 17, color: k.hl ? C.white : C.blue, unitColor: ink, unitBold: false });
    });

    // ── три колонки ──
    const cols = columns(3, { gap: 23 });
    const CY = TOP + KH + 22;
    const pad = 32;
    const bd = 52;
    const cw = cols[0].w - pad * 2;
    const head = (col, n, text, color) => {
      s.badge({ x: col.x + pad, y: CY + 24, d: bd, n, color, size: 26 });
      s.text(text, { x: col.x + pad + bd + 18, y: CY + 24, w: col.w - pad * 2 - bd - 18, h: bd, size: 27, bold: true, lh: 1.05, color: C.navy, valign: 'middle', fit: true, minSize: 22 });
    };
    const leadY = CY + 24 + bd + 20;
    const leads = [
      // «/ защита позиции» не начинает строку
      'Крупный объём продаж + достаточная доступность\u00a0/ защита позиции',
      'Разный вес по устойчивости спроса и DI',
      'Логика выбора',
    ];
    const leadH = Math.max(...leads.map((t) => measure(t, cw, 19, true)));
    const lineY = leadY + leadH + 18;
    const geo = [
      { n: 1, t: 'Ядро Digital', color: C.blue, ink: C.blue, share: '50,0%',
        regions: ['Москва', 'МО', 'Краснодарский край', 'Ростовская обл.', 'Свердловская обл.', 'Челябинская обл.', 'Башкортостан',
          'Нижегородская обл.', 'Татарстан', 'СПб+ЛО', 'Красноярский край', 'Новосибирская обл.', 'Иркутская обл.', 'Кемеровская обл.'] },
      { n: 2, t: 'Рост', color: C.cyan, ink: C.teal, share: '10,0%',
        regions: ['Ставропольский край', 'Курская обл.', 'Вологодская обл.', 'Ульяновская обл.', 'Брянская обл.',
          'Ивановская обл.', 'Владимирская обл.', 'Ярославская обл.', 'Оренбургская обл.', 'Тюменская обл.'] },
    ];
    const FH = 70;                        // плашка «доля продаж» внизу колонки
    const FY = CB - pad + 8 - FH;
    geo.forEach((g, i) => {
      const col = cols[i];
      const x = col.x + pad;
      s.card({ x: col.x, y: CY, w: col.w, h: CB - CY });
      head(col, g.n, g.t, g.color);
      s.text(leads[i], { x, y: leadY, w: cw, size: 19, bold: true, lh: 1.2, color: C.navy });
      s.hline(x, lineY, cw);
      // два столбца регионов; шаг строки — по более высокому из пары
      const half = Math.ceil(g.regions.length / 2);
      const rw = cw / 2 - 26;
      const rows = [];
      for (let k = 0; k < half; k++) rows.push([g.regions[k], g.regions[half + k]].filter(Boolean));
      const rh = rows.map((pr) => Math.max(...pr.map((r) => measure(r, rw, 19, false, 1.15))));
      const avail = FY - 18 - (lineY + 20);
      const gap = Math.min(16, (avail - rh.reduce((a, b) => a + b, 0)) / Math.max(1, rows.length - 1));
      let cy = lineY + 20;
      rows.forEach((pr, k) => {
        pr.forEach((r, j) => {
          const cx = x + (j ? cw / 2 + 6 : 0);
          s.circle({ x: cx, y: cy + 7, d: 10, fill: g.color });
          s.text(r, { x: cx + 22, y: cy, w: rw, size: 19, lh: 1.15, color: C.navy });
        });
        cy += rh[k] + gap;
      });
      // доля продаж ядра / роста
      s.box({ x, y: FY, w: cw, h: FH, fill: C.cardTint, r: 15 });
      const vw = Math.ceil(widthOf(g.share, 36, true)) + 8;
      s.text(g.share, { x: x + 20, y: FY, w: vw, h: FH, size: 36, bold: true, lh: 1.0, color: g.ink, valign: 'middle' });
      s.text('продаж, янв.–июль 2026', { x: x + 20 + vw + 12, y: FY, w: cw - vw - 52, h: FH, size: 19, bold: true, lh: 1.15, color: C.navy, valign: 'middle', fit: true, minSize: 16 });
    });

    // колонка 3: планировочная гипотеза — три веса
    const col = cols[2];
    const x = col.x + pad;
    s.card({ x: col.x, y: CY, w: col.w, h: CB - CY, tint: true });
    head(col, 3, 'Планировочная гипотеза', C.crimson);
    s.text(leads[2], { x, y: leadY, w: cw, size: 19, bold: true, lh: 1.2, color: C.navy });
    s.hline(x, lineY, cw);
    const logic = [
      { color: C.blue, t: '**Ядро = 50% продаж → максимальный вес 55–60% инвестиций**: доказанный спрос + достаточная доступность позволяют эффективно конвертировать медиадавление' },
      { color: C.cyan, t: '**Рост = 10% продаж → перевзвешиваем инвестиции до 20–25%**, чтобы ускорить территории с положительной динамикой и потенциалом; DI используем как фильтр готовности, а не как жесткое ограничение.' },
      { color: MUTED, t: '**Остальная РФ = 40% продаж → сохраняем 15–20% базового присутствия**: спрос значим, но распределен между большим количеством регионов без достаточного масштаба каждого отдельного GEO' },
    ];
    const lx = x + 20;
    const lw = cw - 20;
    const top = lineY + 20;
    const availL = CB - 24 - top;
    let ls = 18;
    const logicH = (sz) => logic.reduce((a, l) => a + measure(l.t, lw, sz), 0);
    while (ls > 16 && logicH(ls) + 2 * 22 > availL) ls -= 1;
    const lg = Math.min(30, (availL - logicH(ls)) / 2);
    let ly = top;
    logic.forEach((l) => {
      const h = measure(l.t, lw, ls);
      s.box({ x, y: ly + 2, w: 6, h: h - 4, fill: l.color, r: 3 });
      s.text(l.t, { x: lx, y: ly, w: lw, size: ls, lh: 1.2, color: C.blueText });
      ly += h + lg;
    });

    s.principle({ label: 'Вывод', icon: 'target',
      text: 'География задает разный вес инвестиций, а не ограничивает кампанию: защищаем 50% продаж в ядре, ускоряем точки роста в рамках медиа-флайтов, сохраняем национальное присутствие для 40% продаж в long tail с AON инструментами' });
    s.footnote('*DI — Distribution Index = показатель аптечной дистрибуции препарата');
  },

  // =====================================================================
  // 10 · Боботик / Search demand dynamics / 2026 (аналог — Acriol 5, Azelik 16)
  // Подзаголовок исходника (одно длинное предложение) в 2 строки шапки не помещается —
  // переносим его целиком в нижнюю плашку.
  // =====================================================================
  10: (d) => {
    const s = d.slide({ title: 'Боботик / Search demand dynamics / 2026' });
    const ch = charts(10);
    const wsC = ch.find((c) => c.plots.some((p) => p.type === 'LinePlot' && p.series.some((x) => x.name.includes('Wordstat'))));
    const ozC = ch.find((c) => c.plots.some((p) => p.type === 'LinePlot' && p.series.some((x) => x.name.includes('Ozon'))));
    const wsBar = wsC.plots.find((p) => p.type === 'BarPlot');
    const wsLine = wsC.plots.find((p) => p.type === 'LinePlot');
    const ozLine = ozC.plots.find((p) => p.type === 'LinePlot');
    const isoW = wsLine.cats.map(xlDate);                   // 29.12.2025 … 24.08.2026, 35 недель
    const isoO = ozLine.cats.map(xlDate);                   // 23.03.2026 … 24.08.2026, 23 недели
    const weeks = isoW.map(ddmm);
    const ozWeeks = isoO.map(ddmm);
    const OFF = isoW.indexOf(isoO[0]);                      // 12
    const r1 = (v) => Math.round(v * 10) / 10;
    const ser = (plot, key) => plot.series.find((x) => x.name.includes(key)).values.map(r1);
    const wsBrand = ser(wsLine, 'Боботик');
    const wsCat = ser(wsLine, 'категория');
    const ozBrand = ser(ozLine, 'Боботик');
    const ozCat = ser(ozLine, 'категория');
    const imp = wsBar.series[0].values.map((v) => Math.round(v / 1e5) / 10);   // показы, млн (0,1)
    const N = weeks.length;

    // ---- левая карточка: три ряда на общей оси недель ----
    const CARD = { x: X0, y: TOP, w: 1222, h: CB - TOP };
    s.card(CARD);
    const PX0 = 136;
    const PX1 = CARD.x + CARD.w - 30;
    const step = (PX1 - PX0) / N;
    const W = { x: PX0, w: step * N };
    const LX = CARD.x + 36;
    const LR = CARD.x + CARD.w - 30;
    const iOf = (iso) => isoW.indexOf(iso);
    // периоды сравнения из подписей цифр: Wordstat — янв–фев → июнь–август; Ozon — март–апрель → август
    const span = (a, b) => [isoW.findIndex((x) => x >= a), isoW.length - 1 - [...isoW].reverse().findIndex((x) => x <= b)];
    const per = {
      wsBase: span('2026-01-01', '2026-02-28'), wsCmp: span('2026-06-01', '2026-08-31'),
      ozBase: span('2026-03-23', '2026-04-30'), ozCmp: span('2026-08-01', '2026-08-31'),
    };
    // полоса периода + подпись над областью построения (линии до неё не достают)
    const band = (P, [a, b], fill, caption, color) => {
      s.box({ x: PX0 + a * step, y: P.y - 24, w: (b - a + 1) * step, h: P.h + 24, fill, r: 0 });
      if (caption) s.text(caption, { x: PX0 + a * step, y: P.y - 20, w: (b - a + 1) * step, size: 14, bold: true, lh: 1.0, color, align: 'center' });
    };
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
      s.seg(W.x, m.val(v), W.x + W.w, m.val(v), { color: v === 100 ? C.line : GRID, width: v === 100 ? 2 : 1.25, dash: v === 100 ? 'dash' : undefined });
      s.text(String(v), { x: PX0 - 60, y: m.val(v) - 10, w: 50, size: 14, color: C.blueText, align: 'right' });
    });
    // Боботик — синий, как на слайдах 3–4 (малиновый там — Лактазар) и как свой бренд в Azelik 16; категория — приглушённая
    const lineOpts = (P, lo, hi) => ({ x: P.x - 10, y: P.y - 10, w: P.w + 20, h: P.h + 20, plot: P, min: lo, max: hi, values: false, legend: false,
      colors: [MUTED, C.blue], symbol: 'none', lineSize: 2.5, extra: { catAxisHidden: true, catAxisLineShow: false } });
    // метка ряда + пояснение сразу за ней (ширина метки — по переведённому тексту)
    const rowLabel = (text, y, note) => {
      s.label(text, { x: LX, y, w: 640, size: 20, color: C.blue });
      if (note) {
        const lw = widthOf(String(tr(text)).toUpperCase(), 20, true);
        s.text(note, { x: LX + lw + 16, y: y + 2, w: 360, size: 15, color: C.blueText });
      }
    };
    const LO = 60;
    const HI = 140;

    // Wordstat
    rowLabel('Wordstat: динамика запросов', 245, 'линии — индекс запросов');
    legendRow(s, LR, 244, [[C.blue, 'Боботик'], [MUTED, 'категория']]);
    const PW = { ...W, y: 300, h: 178 };
    const mW = chartMap('line', N, PW, LO, HI);
    band(PW, per.wsBase, BASE, 'янв–фев', C.blue);
    band(PW, per.wsCmp, BAND, 'июнь–август', C.crimson);
    monthLines(PW);
    grid(mW, [60, 80, 100, 120, 140]);
    s.chart('line', [
      { name: 'Wordstat · категория, индекс', labels: weeks, values: wsCat },
      { name: 'Wordstat · Боботик, индекс', labels: weeks, values: wsBrand },
    ], lineOpts(PW, LO, HI));

    // Ozon (на той же оси недель, с 23.03.2026)
    rowLabel('Ozon: динамика запросов', 502, 'линии — индекс запросов');
    legendRow(s, LR, 501, [[C.blue, 'Боботик'], [MUTED, 'категория']]);
    const PO = { x: PX0 + OFF * step, w: step * (N - OFF), y: 556, h: 144 };
    const POfull = { ...W, y: PO.y, h: PO.h };
    const mO = chartMap('line', N, POfull, LO, HI);
    band(POfull, per.ozBase, BASE, 'март–апрель', C.blue);
    band(POfull, per.ozCmp, BAND, 'август', C.crimson);
    monthLines(POfull);
    grid(mO, [60, 100, 140]);
    s.text(`Данные Ozon доступны с ${ozWeeks[0]}`, { x: PX0 + 14, y: PO.y + 44, w: OFF * step - 28, size: 16, color: C.blueText });
    s.chart('line', [
      { name: 'Ozon · категория, индекс', labels: ozWeeks, values: ozCat },
      { name: 'Ozon · Боботик, индекс', labels: ozWeeks, values: ozBrand },
    ], lineOpts(PO, LO, HI));

    // показы кампании (вторая ось исходника — отдельным рядом)
    rowLabel('Показы кампании, млн', 726);
    const PI = { ...W, y: 790, h: 64 };
    s.chart('col', [{ name: 'Показы кампании, млн', labels: weeks, values: imp }],
      { x: PI.x - 10, y: PI.y - 30, w: PI.w + 20, h: PI.h + 30, plot: PI, min: 0, max: 1.8, colors: [MUTED], legend: false, gap: 30,
        format: '0.0', labelSize: 14, labelColor: C.blueText, extra: { catAxisHidden: true, catAxisLineShow: false } });
    const mAx = chartMap('col', N, PI, 0, 1.8);
    s.seg(W.x, PI.y + PI.h, W.x + W.w, PI.y + PI.h, { color: C.line, width: 1.5 });
    monthAxis(s, mAx, groups, PI.y + PI.h + 2, { size: 15 });

    // ---- правая колонка: цифры и выводы ----
    const X = CARD.x + CARD.w + 24;
    const Wc = X1 - X;
    const tileW = (Wc - 16) / 2;
    const TH = 104;
    const block = (y0, a, b, caption) => {
      s.box({ x: X, y: y0, w: tileW, h: TH, fill: C.blue });
      s.text(a[0], { x: X + 22, y: y0 + 10, w: tileW - 36, size: 48, bold: true, lh: 1.1, color: C.white });
      s.text(a[1], { x: X + 22, y: y0 + 68, w: tileW - 36, size: 17, bold: true, color: C.white });
      s.box({ x: X + tileW + 16, y: y0, w: tileW, h: TH, fill: C.cardTint, stroke: C.line, sw: 2 });
      s.text(b[0], { x: X + tileW + 38, y: y0 + 10, w: tileW - 36, size: 48, bold: true, lh: 1.1, color: C.navy });
      s.text(b[1], { x: X + tileW + 38, y: y0 + 68, w: tileW - 36, size: 17, bold: true, color: C.navy });
      return y0 + TH + 8 + s.text(caption, { x: X, y: y0 + TH + 8, w: Wc, size: 15, color: C.blueText }) + 12;
    };
    const t1 = 'Поисковый спрос на Боботик вырос на 33%, но категория росла быстрее (+77%) — разница в темпах составляет 44 п.п. В 2027 важно усиливать присутствие Боботика в категорийном поиске и закреплять связь между потребностью «колики/животик» и брендом. Эффект оценивать по динамике брендовых запросов, доле поиска и CR';
    const t2 = 'На Ozon спрос на Боботик остался стабильным при небольшом росте категории (2%), что говорит о необходимости поддерживать брендовый спрос. В 2027 важно усилить видимость карточки товара через внешнюю коммуникацию, контент и инструменты продвижения внутри Ozon';
    const tw = Wc - 48;
    // кегль выводов — общий; высота карточек — по тексту
    const cap1 = 'Средний недельный спрос июнь–август vs янв–фев';
    const cap2 = 'Средний недельный спрос август vs март–апрель';
    const fixedH = 2 * (TH + 8 + measure(cap1, Wc, 15) + 12) + 18;
    let fs = 17;
    const cardH = (t, sz) => 18 + 20 + 12 + measure(t, tw, sz) + 16;
    while (fs > 15 && fixedH + cardH(t1, fs) + cardH(t2, fs) > CB - TOP) fs -= 1;
    const conc = (y0, h, t) => {
      s.card({ x: X, y: y0, w: Wc, h });
      s.label('Вывод', { x: X + 24, y: y0 + 18, w: 200, size: 18, color: C.crimson });
      s.text(t, { x: X + 24, y: y0 + 18 + 20 + 12, w: tw, size: fs, lh: 1.2, color: C.blueText });
    };
    let y = block(TOP, ['+33%', 'Боботик · Wordstat'], ['+77%', 'Категория · Wordstat'], cap1);
    const h1 = cardH(t1, fs);
    conc(y, h1, t1);
    y += h1 + 18;
    y = block(y, ['0%', 'Боботик · Ozon'], ['+2%', 'Категория · Ozon'], cap2);
    conc(y, CB - y, t2);

    s.principle({ label: 'Ключевой вывод', icon: 'tb:TbTrendingUp',
      text: 'Боботик по средненедельному уровню спроса за июнь–август опережает показатели января–февраля на 33%, однако категория растёт быстрее в поиске (+77%), что требует усиления присутствия бренда в категорийном поле' });
    s.footnote('Источник: данные Ozon* и Яндекс Вордстат. Индекс запросов = значение недели / значение предыдущей недели × 100\nДля сравнения в выводах: Wordstat — средняя неделя июнь–август vs январь–февраль; Ozon — средний недельный спрос август vs март–апрель',
      { y: 1027, w: 1700 });
  },

  // =====================================================================
  // 11 · Comprehensive-подход Боботика подтвердил эффективность occasion-based модели (скрытый; аналог — Azelik 17)
  // =====================================================================
  11: (d) => {
    const s = d.slide({
      title: 'Comprehensive-подход Боботика подтвердил эффективность occasion-based модели',
      subtitle: 'AI-сегментация по сценариям мам стала базой для paid media,\nперсонализированных креативов, ORM и Search-валидации',
    });
    s.s.hidden = true;

    // ── A. Роль подхода: текст слева, схема occasion → activation → validation справа ──
    s.label('Роль comprehensive-подхода в продвижении Боботик', { x: X0, y: TOP, w: 1100, size: 20, color: C.blue });
    const AY = TOP + 36;
    const roleW = 560;
    const FH = 104;
    s.text('Роль comprehensive-подхода в Боботик — стимулирование продаж и рост знания через персонализацию под поведенческие триггеры мам в момент колик: «перепробовали всё», кормление, длительные ночные колики',
      { x: X0, y: AY, w: roleW, h: FH + 6, size: 18, lh: 1.2, color: C.navy, fit: true, minSize: 16 });
    const flow = [
      { t: 'AI occasion segmentation', d: '3 сценария: Колики / Сон / Кормление' },
      { t: 'Personalized activation', d: 'Paid media + креативы + ORM + блогеры\u00a0(H2)' },
      { t: 'Comprehensive validation', d: 'post-click/media-metrics → Search → Reputation → Sales Lift (H2)', hl: true },
    ];
    const FX = X0 + roleW + 36;
    const AG = 52;
    const FW = (X1 - FX - AG * 2) / 3;
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

    // ── B. Три уровня доказательства ──
    const BY = AY + FH + 26;
    s.label('3 уровня доказательства эффективности', { x: X0, y: BY, w: 1000, size: 20, color: C.blue });
    const cols3 = columns(3, { gap: 24 });
    const CY = BY + 34;
    const CH = 222;
    const P = 30;
    cols3.forEach((c) => s.card({ x: c.x, y: CY, w: c.w, h: CH }));
    const cx = (k) => cols3[k].x + P;
    const cw = (k) => cols3[k].w - P * 2;
    const ly = CY + 22;
    const vy = CY + 52;
    ['Media response', 'Full-funnel impact', 'ORM + Search signals'].forEach((t, k) => s.label(t, { x: cx(k), y: ly, w: cw(k), size: 20, color: C.navy }));
    // Media response
    let h = valueUnit(s, { x: cx(0), y: vy, w: cw(0), value: '1,15%', unit: 'CTR', size: 58, color: C.crimson });
    let y = vy + h + 8;
    y += s.text('+47% vs plan  |  143 тыс. кликов', { x: cx(0), y, w: cw(0), size: 20, bold: true, color: C.navy }) + 6;
    s.text('94 тыс. качественных визитов  |  +14% vs plan', { x: cx(0), y, w: cw(0), size: 18, color: C.blueText });
    // Full-funnel impact
    h = valueUnit(s, { x: cx(1), y: vy, w: cw(1), value: '51%', unit: 'Social / Native / Programmatic', size: 50, unitSize: 19, color: C.crimson });
    h += 4 + valueUnit(s, { x: cx(1), y: vy + h + 4, w: cw(1), value: '49%', unit: 'Paid Search', size: 50, unitSize: 19, color: C.crimson });
    s.text('доля H1-конверсий в «Где купить»', { x: cx(1), y: vy + h + 8, w: cw(1), size: 18, color: C.blueText });
    // ORM + Search signals
    h = valueUnit(s, { x: cx(2), y: vy, w: cw(2), value: '2/3', unit: 'оккейжена', size: 50, unitSize: 20, color: C.crimson });
    y = vy + h + 2;
    y += s.text('показали синхронность ORM-активности и спроса', { x: cx(2), y, w: cw(2), size: 17, color: C.blueText }) + 6;
    const sig = [['r=0,96', 'длительные / сильные колики'], ['+23%', '«перепробовали всё» к базе янв.–фев.'], ['+272%', 'новая семантика ГВ / ИВ']];
    const sw = Math.max(...sig.map(([v]) => Math.ceil(widthOf(v, 18, true)))) + 12;
    sig.forEach(([v, t]) => {
      s.text(v, { x: cx(2), y, w: sw, size: 18, bold: true, color: C.crimson });
      y += s.text(t, { x: cx(2) + sw, y, w: cw(2) - sw, size: 18, color: C.navy }) + 3;
    });

    // ── C. Decision gate по оккейженам ──
    const GY = CY + CH + 24;
    s.label('3 occasions дали основу для decision gate', { x: X0, y: GY, w: 1000, size: 20, color: C.blue });
    const KY = GY + 34;
    const KH = CB - KY;
    const gate = [
      { pill: 'Масштабировать', color: C.green, items: [
        '**«Колики»** — главный драйвер первичного отклика: CTR\u00a02,65%; сценарий подходит для первого контакта и построения охватного пула для ретаргетинга',
        'Сценарий показывает результат не только с точки зрения медийных показателей, но и демонстрирует наиболее яркую синхронность с поисковым спросом'] },
      { pill: 'Усиливает действие', color: C.orange, items: [
        '**«Кормление»** — самый конверсионный сценарий: CR «Где купить» 3,5%, корзина 0,80%, лучшее время на сайте 00:41 → приоритет в нижней воронке'] },
      { pill: 'Развиваем персонализацию в H2 и 2027 году', color: C.blue, items: [
        '**Результат:** 2 из 3 оккейженов показали синхронность с тематическим спросом, зафиксированы новые формулировки в ГВ/ИВ',
        '**Рекомендация:** сегментировать ORM-сценарии и продуктовые аргументы по оккейженам + еженедельный трекинг Wordstat (3 корзины запросов) с привязкой к ORM, медиа и сезонности'] },
    ];
    const gc = columns(3, { gap: 24 });
    const PH = 44;
    let gs = 17;
    const colH = (g, sz) => g.items.reduce((a, t) => a + measure(t, gc[0].w - 40, sz), 0) + 12 * (g.items.length - 1);
    while (gs > 16 && Math.max(...gate.map((g) => colH(g, gs))) > KH - PH - 30) gs -= 1;
    gate.forEach((g, i) => {
      const c = gc[i];
      s.card({ x: c.x, y: KY, w: c.w, h: KH, tint: i === 2 });
      s.pill(g.pill, { x: c.x, y: KY, w: c.w, h: PH, color: g.color, size: 18 });
      let iy = KY + PH + 14;
      g.items.forEach((t, k) => {
        if (k) iy += 4;
        iy += s.text(t, { x: c.x + 20, y: iy, w: c.w - 40, size: gs, lh: 1.2, color: C.blueText }) + 8;
      });
    });

    s.principle({ label: '2027', icon: 'target',
      text: 'Масштабируем occasion-based comprehensive как рабочую модель — Paid media и Search отвечают за трафик и конверсию, ORM закрепляет доверие, а Sales Lift валидирует бизнес-вклад' });
  },
};
