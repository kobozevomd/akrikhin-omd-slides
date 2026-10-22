// Боботик · стратегия 2027 — часть E: слайды исходника 21–24
// (архитектура кампании vs 2026, OLV как слой знания, master-концепция + 3 occasion-адаптации, precise targeting)
const path = require('path');
const L = require('../../../lib/akrikhin');
const { C, ACCENTS, CHART_COLORS, columns, IN, PT, chartMap, textWidth, fitSize, countLines, typo } = L;
const V = require('../../variants/common');               // TOP, BOT, MUTED, GRID, fmt, pct, statTile, numMark, legend, yearAxis, gridY
const B = require('./common');                            // SRC, MEDIA, CROPS
const { CROPS } = B;
// CROPS/e_creative_*.png — три кадра-адаптации, вырезанные из картинки слайда 23 (внутри рамки макета, углы скруглены прозрачностью)

const TOP = 221;
const BOT = 1005;

// Ширина / число строк так, как текст окажется на слайде (с переводом и типографикой)
const strip = (t) => String(t).replace(/\*\*|\[\[|\]\]/g, '');
const wOf = (t, size, bold = false) => textWidth(typo(strip(L.tr(t))), size, bold);
const linesOf = (t, size, w, bold = false) => countLines(typo(strip(L.tr(t))), size, w, bold);
const hOf = (t, size, w, bold = false, lh = 1.2) => Math.round(linesOf(t, size, w, bold) * size * lh);
// Ширина блока, при которой текст занимает столько же строк, но строки ровнее — без висящего последнего слова
const evenW = (t, w, size, bold = false) => {
  const n = linesOf(t, size, w, bold);
  if (n < 2) return w;
  let lo = w * 0.4;
  let hi = w;
  while (hi - lo > 1) { const m = (lo + hi) / 2; if (linesOf(t, size, m, bold) <= n) hi = m; else lo = m; }
  return Math.min(w, Math.ceil(hi) + 4);
};

// Ярлык статуса (NEW) — как в деках Acriol Pro, Clindovit, Azelik
function tag(s, t, x, y, { size = 13, h = 24 } = {}) {
  const w = Math.ceil(wOf(t, size, true)) + 20;
  s.box({ x, y, w, h, fill: t === 'NEW' ? C.crimson : C.blue, r: h / 2 });
  s.text(t, { x, y, w, h, size, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
  return w;
}

// Список каналов / оккейженов: строка + ярлык статуса сразу после неё
function chanList(s, items, { x, y, w, size = 17, pitch = 24 }) {
  items.forEach((it, i) => {
    const [t, tg] = Array.isArray(it) ? it : [it];
    const yy = y + i * pitch;
    const tagW = tg ? Math.ceil(wOf(tg, 13, true)) + 20 : 0;
    const maxW = w - (tg ? tagW + 10 : 0);
    s.text(t, { x, y: yy, w: maxW, size, color: C.navy, fit: true, maxLines: 1, minSize: 14 });
    if (tg) tag(s, tg, x + Math.min(Math.ceil(wOf(t, size)), maxW) + 10, yy + Math.round((size * 1.2 - 24) / 2));
  });
}

// Пустая ячейка (слоя в этом году не было): пунктирная рамка без заливки
function emptyCell(s, { x, y, w, h }) {
  s.s.addShape(s.shapes.roundRect, {
    x: IN(x), y: IN(y), w: IN(w), h: IN(h), fill: { type: 'none' },
    line: { color: C.line, width: PT(2.5), dashType: 'dash' }, rectRadius: IN(25),
  });
}

// Заголовок блока: номер в кружке + заголовок в одну строку
function blockHead(s, { x, y, w, n, text, color = C.blue, d = 42, size = 25 }) {
  s.badge({ x, y, d, n, color, size: Math.round(d * 0.52) });
  s.text(text, { x: x + d + 14, y, w: w - d - 14, h: d, size, bold: true, lh: 1.0, color: C.navy, valign: 'middle', fit: true, maxLines: 1, minSize: 19 });
  return d;
}

module.exports = {
  // ===================== 21 · Архитектура кампании 2027 vs 2026 (аналог Azelik 39, Clindovit 12) =====================
  21: (d) => {
    const s = d.slide({
      title: 'Боботик 2027: архитектура кампании vs 2026',
      subtitle: 'Дополнительный бюджет инвестируем не в пропорциональное увеличение медиа-веса, а в 3 новые возможности: создать новый качественный контакт → точнее найти маму → довести до выбора и покупки',
    });
    const LB = { x: 58, w: 172 };      // метки слоёв
    const CA = { x: 244, w: 680 };     // 2026
    const CB = { x: 1046, w: 816 };    // 2027
    const G = { x: CA.x + CA.w, w: CB.x - CA.x - CA.w };   // зазор со стрелками прироста

    // ---- шапки колонок: год, бюджет тотал и формула года ----
    const head = (X, year, value, desc, color) => {
      const yw = Math.ceil(wOf(year, 26, true)) + 4;
      s.text(year, { x: X.x, y: 241, w: yw, size: 26, bold: true, lh: 1.0, color });
      const vx = X.x + yw + 14;
      const vw = Math.ceil(wOf(value, 50, true)) + 6;
      s.text(value, { x: vx, y: 221, w: vw, size: 50, bold: true, lh: 1.0, color });
      // звёздочка — ссылка на сноску о тех. костах
      const uw = Math.ceil(wOf('млн ₽*', 26, true)) + 8;
      s.text('млн ₽*', { x: vx + vw + 8, y: 241, w: uw, size: 26, bold: true, lh: 1.0, color });
      const dx = vx + vw + 8 + uw + 22;
      s.vline(dx - 12, 224, 50);
      const dw = X.x + X.w - dx;
      s.text(desc, { x: dx, y: 219, w: evenW(desc, dw, 17, true), h: 56, size: 17, bold: true, lh: 1.15, color: C.navy, valign: 'middle', fit: true, minSize: 14 });
    };
    head(CA, '2026', '13,1', 'широкие сегменты + захват существующего спроса', C.navy);
    head(CB, '2027', '19', 'новый качественный охват + precise targeting + управляемый путь к покупке', C.crimson);

    const OCC = ['Перепробовали все', 'Кормление', 'Сон'];
    const rows = [
      { label: 'CREATE DEMAND', icon: 'tb:TbPlayerPlay', color: C.crimson, delta: '+4,6 млн ₽', up: true,
        a: null,
        b: { title: 'Концентрированный видео-контакт в ядре ЦА на эффективной частоте с персонализацией', budget: '4,6 млн ₽',
          lists: [['Каналы', [['OLV', 'NEW']]], ['Оккейжены', OCC]] } },
      { label: 'WIN THE MOMENT', icon: 'tb:TbTarget', color: C.blue, delta: '−2,0 млн ₽', up: false,
        a: { title: 'Присутствие в медиапространстве через широкие сегменты интересов', budget: '5,3 млн ₽',
          lists: [['Каналы', ['Programmatic', 'Thematic display', 'Social', 'Native']], ['Оккейжены', OCC]] },
        b: { title: 'От широких interest-сегментов → к precise-сигналам', budget: '3,3 млн ₽',
          lists: [['Каналы', [['Programmatic — precise targeting', 'NEW']]], ['Оккейжены', OCC]] } },
      { label: 'BUILD TRUST', icon: 'tb:TbUsers', color: C.purple, delta: '+0,5 млн ₽', up: true,
        a: { title: 'Формирование дополнительного доверия к бренду через авторитетную коммуникацию', budget: '1,3 млн ₽',
          lists: [['Каналы', ['Bloggers']], ['Оккейжены', OCC]] },
        b: { title: 'Масштабирование успешных коммуникационных подходов после тестирования', budget: '1,8 млн ₽',
          lists: [['Каналы', ['Bloggers']], ['Оккейжены', OCC]] } },
      { label: 'CONVERT DEMAND', icon: 'tb:TbShoppingCart', color: C.green, delta: '+2,4 млн ₽', up: true,
        a: { title: 'Перехват спроса, присутствие на всех этапах выбора', budget: '5 млн ₽',
          lists: [['Каналы', ['ORM', 'GEO|AEO', 'Paid Search'], 2]] },
        b: { title: 'Доминирование в момент осуществления выбора', budget: '7,4 млн ₽',
          lists: [['Каналы', ['ORM', 'GEO|AEO', 'Paid Search', ['Внешние публикации', 'NEW']], 2]] } },
    ];

    const PAD = 24;
    const BS = 28;     // кегль бюджета блока
    const TS = 18;     // кегль заголовка блока
    const SPLIT = { a: 0.5, b: 0.5 };
    const geo = (X, c) => {
      const pw = X.w - PAD * 2;
      const bw = Math.ceil(wOf(c.budget, BS, true)) + 6;
      const tw = pw - bw - 18;
      return { pw, bw, tw, th: hOf(c.title, TS, tw, true, 1.15) };
    };
    // высота строки — по самому длинному заголовку и списку в обеих колонках; шаг списка — чтобы всё уложилось до 1005
    rows.forEach((r) => {
      const cells = [r.a, r.b].filter(Boolean);
      r.headH = Math.max(BS + 4, ...cells.map((c) => geo(c === r.a ? CA : CB, c).th));
      r.n = Math.max(...cells.flatMap((c) => c.lists.map(([, items, cols]) => Math.ceil(items.length / (cols || 1)))));
    });
    const Y0 = 292;
    const GAP = 10;
    const fixed = (r) => 13 + r.headH + 9 + 30 + 21 + 9;
    const avail = BOT - Y0 - GAP * (rows.length - 1);
    const PITCH = Math.max(21, Math.min(26, Math.floor((avail - rows.reduce((a, r) => a + fixed(r), 0)) / rows.reduce((a, r) => a + r.n - 1, 0))));
    let y = Y0;
    rows.forEach((r) => { r.h = fixed(r) + (r.n - 1) * PITCH; r.y = y; y += r.h + GAP; });
    // остаток высоты (если есть) — поровну строкам
    const spare = BOT - (y - GAP);
    if (spare > 0) { let acc = 0; rows.forEach((r) => { r.y += acc; const add = Math.floor(spare / rows.length); r.h += add; acc += add; }); }

    const cell = (X, r, c, { accent, tint, split }) => {
      s.card({ x: X.x, y: r.y, w: X.w, h: r.h, tint });
      const px = X.x + PAD;
      const { pw, bw, tw } = geo(X, c);
      s.text(c.title, { x: px, y: r.y + 14, w: evenW(c.title, tw, TS, true), size: TS, bold: true, lh: 1.15, color: C.navy });
      s.text(c.budget, { x: X.x + X.w - PAD - bw, y: r.y + 12, w: bw, size: BS, bold: true, lh: 1.0, color: accent, align: 'right' });
      const ly = r.y + 13 + r.headH + 9;
      s.hline(px, ly, pw);
      const gap = 24;
      const w1 = Math.round(pw * split) - gap / 2;
      const w2 = pw - w1 - gap;
      c.lists.forEach(([title, items, cols], k) => {
        const lx = k === 0 ? px : px + w1 + gap;
        if (k > 0) s.vline(lx - gap / 2, ly + 12, r.y + r.h - ly - 22);
        const lw = c.lists.length === 1 ? pw : (k === 0 ? w1 : w2);
        s.label(title, { x: lx, y: ly + 9, w: lw, size: 15, color: C.blueText });
        if (cols === 2) {
          const h1 = Math.ceil(items.length / 2);
          chanList(s, items.slice(0, h1), { x: lx, y: ly + 31, w: w1, pitch: PITCH });
          chanList(s, items.slice(h1), { x: px + w1 + gap, y: ly + 31, w: w2, pitch: PITCH });
        } else chanList(s, items, { x: lx, y: ly + 31, w: lw, pitch: PITCH });
      });
    };

    rows.forEach((r) => {
      s.tile({ x: LB.x, y: r.y, w: LB.w, h: r.h, color: r.color, text: r.label, icon: r.icon, iconSize: 40, size: 19, textH: 46 });
      if (r.a) cell(CA, r, r.a, { accent: C.navy, split: SPLIT.a });
      else emptyCell(s, { x: CA.x, y: r.y, w: CA.w, h: r.h });
      cell(CB, r, r.b, { accent: C.crimson, tint: true, split: SPLIT.b });
      // изменение бюджета слоя 2027 vs 2026 (расчёт OMD)
      const col = r.up ? C.crimson : C.blueText;
      const mid = r.y + Math.round(r.h / 2);
      s.text(r.delta, { x: G.x + 4, y: mid - 32, w: G.w - 8, size: 19, bold: true, lh: 1.0, color: col, align: 'center', fit: true, maxLines: 1, minSize: 15 });
      s.arrow({ dir: 'right', x: G.x + 16, y: mid + 4, len: G.w - 32, head: 24, headLen: 14, stem: 4, color: col });
    });

    s.footnote('*Бюджеты тотал представлены с учетом тех костов, АК и РС, бюджеты блоков указаны с АК и РС без учета тех костов. Изменения 2027 vs 2026 по слоям — расчёт OMD');
  },

  // ===================== 22 · OLV как концентрированный слой знания (в исходнике — картинка поверх живого текста) =====================
  22: (d) => {
    const s = d.slide({
      title: 'OLV как концентрированный слой знания в ядре ЦА',
      subtitle: 'Концентрация 75% видеовеса в географии ядра и роста позволяет достичь целевого эффективного охвата внутри регионов, формирующих основной объём продаж и потенциал ускорения',
    });
    const LC = { x: 58, w: 1150 };
    const RC = { x: 1230, w: 632 };
    const PAD = 28;
    const HD = 42;               // кружок номера блока
    const GAPR = 16;

    // ---- содержимое блоков: считаем высоты, чтобы поделить 221…905 между двумя рядами ----
    // 1. От KPI к требуемому медиавесу
    const t1 = 'Для выхода на Effective Reach 5+ на уровне 75% при Universe 1,2 млн РФ → 720K (60%) мам в географии продаж ядро + рост необходимо охватить **~540K мам**';
    const chain = [
      { v: '≈720 тыс.', t: 'мам детей до 1 года' },
      { v: '75%', t: 'Effective Reach 5+', accent: 'soft' },
      { v: '540 тыс.', t: 'мам в контакте 5+' },
      { v: '≈13,2 млн', t: 'impressions' },
      { v: '4,3 млн ₽', t: 'media budget', accent: 'main' },
    ];
    const iw1 = LC.w - PAD * 2;
    const TILE_H = 118;
    const h1 = 22 + HD + 18 + hOf(t1, 20, iw1) + 20 + TILE_H + 28;

    // 2. Почему 12 недель
    const lead2 = 'Май–июль = 3 × 4 недели концентрированного присутствия';
    const why = [
      ['Concentration', 'Не растягиваем бюджет на весь год; создаём рабочий 3-месячный медиавес.'],
      ['Frequency', 'Удерживаем частоту 5+ в узкой ЦА, а не просто собираем reach 1+.'],
      ['Measurability', 'Получаем базу для BLS и оценки изменения знания.'],
    ];
    const iw2 = RC.w - PAD * 2;
    const TERM_W = Math.ceil(Math.max(...why.map(([k]) => wOf(k, 18, true)))) + 18;
    const whyH = why.map(([, t]) => Math.max(22, hOf(t, 17, iw2 - TERM_W)));
    const h2 = 22 + HD + 18 + hOf(lead2, 20, iw2, true, 1.15) + 14 + whyH.reduce((a, b) => a + b, 0) + 2 * 22 + 24;

    // 3. Что покупаем внутри OLV
    const lead3 = 'PRECISION OLV — Astralab + Adsource';
    const t3 = 'Единый in-stream слой качественного контакта на эффективной частоте, а также сегментная точность благодаря precision-таргетингу и персонализации по occasion-based ситуациям в рамках AI DSPs';
    const spec = [
      ['Targeting', 'AI / occasion-based / precision segments'],
      ['Inventory', 'in-stream only'],
      ['Creative', 'персонализированные occasion-based сообщения'],
      ['Media role', 'targeted reach + Effective Frequency 5+'],
      ['Business value', 'ближе к моменту потребности + закрепление сообщения'],
    ];
    const iw3 = iw1;
    const KEY_W = Math.ceil(Math.max(...spec.map(([k]) => wOf(k, 18, true)))) + 24;
    const SPEC_ROW = 31;
    const h3 = 22 + HD + 12 + 28 + 6 + hOf(t3, 18, iw3) + 16 + spec.length * SPEC_ROW + 20;

    // 4. Что получает бренд
    const gets = [
      { k: 'SCALE', t: '**75% ядра ЦА** на эффективной частоте', color: C.blue },
      { k: 'RELEVANCE', t: 'precision targeting + occasion-based personalization', color: C.crimson },
      { k: 'PROOF', t: 'BLS + VTR / completed views + Brand Search / post-view', color: C.navy },
    ];
    const PILL_W = Math.ceil(Math.max(...gets.map((g) => wOf(g.k, 17, true)))) + 40;
    const getsTW = iw2 - PILL_W - 20;
    const getsH = gets.map((g) => Math.max(40, hOf(g.t, 18, getsTW)));
    const h4 = 22 + HD + 18 + getsH.reduce((a, b) => a + b, 0) + 2 * 26 + 24;

    // ряды: верхний — по высоте блоков 1/2, нижний — остаток до 905 (не меньше, чем нужно блокам 3/4)
    const need1 = Math.max(h1, h2);
    const need2 = Math.max(h3, h4);
    const spare = 905 - TOP - GAPR - need1 - need2;
    const H1 = need1 + Math.floor(Math.max(0, spare) / 4);   // нижнему ряду — больше: в блоке 3 плотнее всего
    const Y2 = TOP + H1 + GAPR;
    const H2 = 905 - Y2;

    // ---- 1. От KPI к требуемому медиавесу ----
    s.card({ x: LC.x, y: TOP, w: LC.w, h: H1 });
    let y = TOP + 22;
    blockHead(s, { x: LC.x + PAD, y, w: iw1, n: 1, text: 'От KPI к требуемому медиавесу', d: HD });
    y += HD + 18;
    y += s.text(t1, { x: LC.x + PAD, y, w: iw1, size: 20, lh: 1.2, color: C.blueText });
    const ty = TOP + H1 - 28 - TILE_H;
    const CHEV = 34;
    const tw = (iw1 - CHEV * (chain.length - 1)) / chain.length;
    chain.forEach((c, i) => {
      const x = Math.round(LC.x + PAD + i * (tw + CHEV));
      const main = c.accent === 'main';
      s.box({ x, y: ty, w: Math.round(tw), h: TILE_H, fill: main ? C.crimson : C.cardTint });
      const vc = main ? C.white : c.accent === 'soft' ? C.crimson : C.navy;
      s.text(c.v, { x: x + 16, y: ty + 18, w: Math.round(tw) - 32, size: 32, bold: true, lh: 1.0, color: vc, fit: true, maxLines: 1, minSize: 24 });
      s.text(c.t, { x: x + 16, y: ty + 62, w: Math.round(tw) - 32, h: TILE_H - 70, size: 16, lh: 1.15, color: main ? C.white : C.blueText, fit: true, minSize: 14 });
      if (i < chain.length - 1) s.chevron({ cx: x + Math.round(tw) + CHEV / 2, cy: ty + TILE_H / 2, w: 16, h: 24, color: C.crimson });
    });

    // ---- 2. Почему 12 недель ----
    s.card({ x: RC.x, y: TOP, w: RC.w, h: H1 });
    y = TOP + 22;
    blockHead(s, { x: RC.x + PAD, y, w: iw2, n: 2, text: 'Почему 12 недель', d: HD });
    y += HD + 18;
    y += s.text(lead2, { x: RC.x + PAD, y, w: evenW(lead2, iw2, 20, true), size: 20, bold: true, lh: 1.15, color: C.crimson });
    // термины — колонкой слева, пояснения справа; ряды растягиваем на свободную высоту
    const wy0 = y + 14;
    const wSpare = TOP + H1 - 24 - wy0 - whyH.reduce((a, b) => a + b, 0);
    const wGap = Math.max(22, Math.floor(wSpare / (why.length - 1 + 0.6)));
    y = wy0 + Math.max(0, Math.round((wSpare - wGap * (why.length - 1)) / 2));
    why.forEach(([k, t], i) => {
      if (i > 0) s.hline(RC.x + PAD, y - wGap / 2, iw2);
      s.text(k, { x: RC.x + PAD, y, w: TERM_W, size: 18, bold: true, lh: 1.2, color: C.navy });
      s.text(t, { x: RC.x + PAD + TERM_W, y: y + 1, w: iw2 - TERM_W, size: 17, lh: 1.2, color: C.blueText });
      y += whyH[i] + wGap;
    });

    // ---- 3. Что покупаем внутри OLV ----
    s.card({ x: LC.x, y: Y2, w: LC.w, h: H2 });
    y = Y2 + 22;
    blockHead(s, { x: LC.x + PAD, y, w: iw3, n: 3, text: 'Что покупаем внутри OLV', d: HD });
    y += HD + 12;
    s.text(lead3, { x: LC.x + PAD, y, w: iw3, size: 24, bold: true, lh: 1.0, color: C.crimson, fit: true, maxLines: 1, minSize: 20 });
    y += 28 + 6;
    y += s.text(t3, { x: LC.x + PAD, y, w: evenW(t3, iw3, 18), size: 18, lh: 1.2, color: C.blueText });
    // характеристики закупки — строки «ключ │ значение» на подложке
    const sh = spec.length * SPEC_ROW;
    const sy = Y2 + H2 - 22 - sh;
    s.box({ x: LC.x + PAD - 12, y: sy - 8, w: iw3 + 24, h: sh + 16, fill: C.cardTint });
    spec.forEach(([k, v], i) => {
      const yy = sy + i * SPEC_ROW;
      if (i > 0) s.hline(LC.x + PAD, yy, iw3, C.line);
      s.text(k, { x: LC.x + PAD, y: yy + 5, w: KEY_W, size: 18, bold: true, lh: 1.2, color: C.navy });
      s.text(v, { x: LC.x + PAD + KEY_W, y: yy + 5, w: iw3 - KEY_W, size: 18, lh: 1.2, color: C.navy, fit: true, maxLines: 1, minSize: 15 });
    });

    // ---- 4. Что получает бренд ----
    s.card({ x: RC.x, y: Y2, w: RC.w, h: H2 });
    y = Y2 + 22;
    blockHead(s, { x: RC.x + PAD, y, w: iw2, n: 4, text: 'Что получает бренд', d: HD });
    y += HD + 18;
    const gSpare = Y2 + H2 - 24 - y - getsH.reduce((a, b) => a + b, 0);
    const gGap = Math.max(26, Math.floor(gSpare / (gets.length - 1 + 0.5)));
    y += Math.max(0, Math.round((gSpare - gGap * (gets.length - 1)) / 2));
    gets.forEach((g, i) => {
      if (i > 0) s.hline(RC.x + PAD, y - gGap / 2, iw2);
      const rh = getsH[i];
      s.pill(g.k, { x: RC.x + PAD, y: y + Math.round((rh - 40) / 2), w: PILL_W, h: 40, color: g.color, size: 17 });
      s.text(g.t, { x: RC.x + PAD + PILL_W + 20, y: y + Math.round((rh - hOf(g.t, 18, getsTW)) / 2), w: getsTW, size: 18, lh: 1.2, color: C.navy });
      y += rh + gGap;
    });

    s.formula({ text: 'OLV = controlled reach layer в ядре ЦА\n3 принципа: AI/context signals → relevant occasion → personalized video message', size: 22 });
  },

  // ===================== 23 · 1 master-концепция + 3 occasion-based адаптации (в исходнике — картинка во весь слайд) =====================
  23: (d) => {
    const s = d.slide({
      title: 'Боботик 2027: 1 master-концепция 15 сек + 3 occasion-based адаптации',
      subtitle: 'Единый визуальный каркас ролика, персонализация через первые/ключевые секунды и озвучку под occasion',
    });
    // три кадра-адаптации: вырезки 455×650 из макета исходника
    const PILL_H = 46;
    const GAPC = 24;
    const IW = 405;                              // кадры — 3 × 405, справа остаётся ~510 под три пункта
    const IH = Math.round(IW * 650 / 455);
    const GY = TOP + Math.round((905 - TOP - (PILL_H + 12 + IH)) / 2);   // группа «ярлык + кадр» по центру зоны 221…905
    const IY = GY + PILL_H + 12;
    const frames = [
      { label: '1. Колики', file: 'e_creative_colic.png' },
      { label: '2. Кормление', file: 'e_creative_feeding.png' },
      { label: '3. Сон', file: 'e_creative_sleep.png' },
    ];
    frames.forEach((f, i) => {
      const x = 58 + i * (IW + GAPC);
      s.pill(f.label, { x, y: GY, w: IW, h: PILL_H, color: C.blue, caps: false, size: 22 });
      s.image(path.join(CROPS, f.file), { x, y: IY, w: IW, h: IH, alt: f.label });
    });

    // справа — как устроена система: три пункта
    const RX = 58 + 3 * IW + 2 * GAPC + 28;
    const RW = 1862 - RX;
    s.card({ x: RX, y: GY, w: RW, h: IY + IH - GY });
    const PAD = 30;
    const BD = 46;
    const tx = RX + PAD + BD + 18;
    const tw = RW - PAD * 2 - BD - 18;
    const items = [
      { t: '1 master-концепция 15 сек', d: 'Единый визуальный бренд-каркас ролика.', icon: 'tb:TbSettings' },
      { t: 'Первые / ключевые секунды + озвучка', d: 'Создают 3 occasion-based адаптации внутри OLV.', icon: 'tb:TbChartBar' },
      { t: 'Персонализация начинается с узнавания ситуации', d: 'Точный вход в occasion с первых секунд.', icon: 'tb:TbTarget' },
    ];
    const ih = items.map((it) => hOf(it.t, 24, tw, true, 1.1) + 10 + hOf(it.d, 19, tw));
    const inner = IY + IH - GY - PAD * 2;
    const gap = Math.floor((inner - ih.reduce((a, b) => a + b, 0)) / items.length);
    let y = GY + PAD + Math.round(gap / 2);
    items.forEach((it, i) => {
      if (i > 0) s.hline(RX + PAD, y - Math.round(gap / 2), RW - PAD * 2);
      s.badge({ x: RX + PAD, y: y - 4, d: BD, n: i + 1, color: ACCENTS[i], size: 24 });
      const th = s.text(it.t, { x: tx, y, w: evenW(it.t, tw, 24, true), size: 24, bold: true, lh: 1.1, color: C.navy });
      s.text(it.d, { x: tx, y: y + th + 10, w: evenW(it.d, tw, 19), size: 19, lh: 1.2, color: C.blueText });
      y += ih[i] + gap;
    });

    s.principle({ label: 'Новое качество для Боботика', icon: 'tb:TbDiamond',
      text: 'Не просто разные финальные кадры, а управляемая персонализация входа в ролик' });
  },

  // ===================== 24 · Precise targeting (в исходнике — картинка во весь слайд; делим на два слайда) =====================
  24: (d) => {
    // ---------- 24а · шаги 1–3 и 5: вводные → сигналы → обогащение → validation & scale + пилот Q4 2026 ----------
    {
      const s = d.slide({
        title: 'Precise targeting: как попасть в короткое окно релевантности',
        subtitle: 'От раннего знания к выбору: персонализация на основе данных, сигналов и реальных потребностей мам в разные периоды',
      });
      const CH = 30;   // зазор со стрелкой между шагами
      const X1 = { x: 58, w: 320 };
      const X2 = { x: X1.x + X1.w + CH, w: 316 };
      const X3 = { x: X2.x + X2.w + CH, w: 402 };
      const X5 = { x: X3.x + X3.w + CH, w: 340 };   // «e-com search / brand search» — одной строкой, без висящего «search»
      const XP = { x: X5.x + X5.w + 20, w: 1862 - (X5.x + X5.w + 20) };
      const PAD = 22;
      const HD = 40;
      const BS = 19;   // кегль пунктов
      const IND = 20;
      const HEAD_H = 22 + HD + 26;
      const bulletsH = (items, X, gap) => items.reduce((a, it) => a + linesOf(it, BS, X.w - PAD * 2 - IND) * BS * 1.2, 0) + gap * (items.length - 1);

      // ---- содержимое шагов ----
      const inputs = [
        { icon: 'tb:TbUser', k: 'Communication audience:', t: 'мамы новорожденных (с рождения)' },
        { icon: 'tb:TbShoppingCart', k: 'Product usage:', t: 'согласно инструкции — с 28-го дня' },
        { icon: 'tb:TbPhotoEdit', k: 'Персонализация:', t: 'креатив' },
      ];
      const ID = 44;
      const iw = X1.w - PAD * 2 - ID - 14;
      const inH = inputs.map((it) => Math.max(ID, hOf(it.k, BS, iw, true, 1.15) + 4 + hOf(it.t, 18, iw)));
      const c1 = inH.reduce((a, b) => a + b, 0) + (inputs.length - 1) * 40;
      const sig = ['поисковые запросы и симптоматика', 'контент про колики / кормление / сон', 'обсуждения в сети',
        'поведение в e-pharm и на маркетплейсах', 'SMS-сообщения', 'super geo: посещение роддома 3+ дня без перерыва'];
      const enr = ['paid data и DMP / DSP-сегменты', 'retail-сигналы', 'AI look-alike на базе occasion-based enrichment', 'telecom data'];
      const val = ['CTR и quality visits', 'CR / клик по кнопке «Где купить»', 'e-com search / brand search', 'Sales Lift'];
      const G2 = 12;
      const G3 = 14;
      const G5 = 16;
      const cMax = Math.max(c1, bulletsH(sig, X2, G2), bulletsH(enr, X3, G3), bulletsH(val, X5, G5));
      const Yc = TOP + HEAD_H + Math.ceil(cMax) + 24;      // низ карточек шагов
      const Yb = Yc + 22;                                   // полоса площадок — под шагами 1–5

      const head = (X, n, t) => {
        s.badge({ x: X.x + PAD, y: TOP + 22, d: HD, n, color: C.blue, size: 22 });
        const hw = X.w - PAD * 2 - HD - 12;
        s.text(t, { x: X.x + PAD + HD + 12, y: TOP + 16, w: hw, h: 52, size: 22, bold: true, lh: 1.05, color: C.navy, valign: 'middle', fit: true, maxLines: 2, minSize: 18 });
        return TOP + HEAD_H;
      };
      const bullets = (items, X, y, gap) => y + s.bullets(items, { x: X.x + PAD, y, w: X.w - PAD * 2, size: BS, gap, color: C.navy, indent: IND });
      [X1, X2, X3, X5].forEach((X) => s.card({ x: X.x, y: TOP, w: X.w, h: Yc - TOP }));
      // стрелки между шагами 1 → 2 → 3 → 5 (шаг 4 — механика теста — на следующем слайде)
      [X1, X2, X3].forEach((X) => s.chevron({ cx: X.x + X.w + CH / 2, cy: TOP + 22 + HD / 2, w: 14, h: 22, color: C.crimson }));

      // 1. Исходные вводные
      let y = head(X1, 1, 'Исходные вводные');
      inputs.forEach((it, i) => {
        if (i > 0) { s.hline(X1.x + PAD, y + 20, X1.w - PAD * 2); y += 40; }
        s.icon(it.icon, { x: X1.x + PAD, y, size: ID, circle: C.crimson, color: C.white });
        const kh = s.text(it.k, { x: X1.x + PAD + ID + 14, y, w: iw, size: BS, bold: true, lh: 1.15, color: C.navy });
        s.text(it.t, { x: X1.x + PAD + ID + 14, y: y + kh + 4, w: iw, size: 18, lh: 1.2, color: C.blueText });
        y += inH[i];
      });

      // 2. Сигналы потребности
      bullets(sig, X2, head(X2, 2, 'Сигналы потребности'), G2);
      // 3. Обогащение аудиторий
      bullets(enr, X3, head(X3, 3, 'Обогащение аудиторий'), G3);
      // 5. Validation & scale
      bullets(val, X5, head(X5, 5, 'Validation & scale'), G5);

      // ---- где можно тестировать таргетинги (часть шага 3) — полоса под шагами ----
      const BX = { x: 58, w: X5.x + X5.w - 58 };
      s.card({ x: BX.x, y: Yb, w: BX.w, h: 905 - Yb, tint: true });
      s.chevron({ cx: X3.x + X3.w / 2, cy: Yc + 11, dir: 'down', w: 26, h: 14, color: C.crimson });
      const BP = 28;
      s.text('Где можно тестировать таргетинги', { x: BX.x + BP, y: Yb + 20, w: BX.w - BP * 2, size: 22, bold: true, lh: 1.0, color: C.crimson, fit: true, maxLines: 1, minSize: 18 });
      const platforms = [
        ['Astralab', 'AI-кластеры'],
        ['Adsource', 'AI occasion-based enrichment'],
        ['PIM и First Data', 'ретейл-данные по покупкам товаров с коротким окном потребления (одежда 50–62, подгузники XS–M и др.)'],
        ['МегаФон', 'таргетинг по SMS-сообщениям (поступление маткапитала, пособий)'],
      ];
      const PG = 30;
      const pcw = Math.floor((BX.w - BP * 2 - PG * (platforms.length - 1)) / platforms.length);
      const py0 = Yb + 20 + 22 + 16;
      const pH = 31 + Math.max(...platforms.map(([, t]) => hOf(t, 19, pcw)));
      const pFree = 905 - 22 - py0 - pH;
      if (pFree < 0) s.warn('текст', 'Где можно тестировать таргетинги', `полоса площадок не влезает: не хватает ${-pFree}px`);
      const py = py0 + Math.max(0, Math.round(pFree / 2));
      platforms.forEach(([n, t], i) => {
        const px = BX.x + BP + i * (pcw + PG);
        if (i > 0) s.vline(px - PG / 2, py, pH);
        s.text(n, { x: px, y: py, w: pcw, size: 21, bold: true, lh: 1.15, color: C.navy });
        s.text(t, { x: px, y: py + 31, w: pcw, size: 19, lh: 1.2, color: C.blueText });
      });

      // ---- START NOW / Q4 2026 PILOT ----
      s.card({ x: XP.x, y: TOP, w: XP.w, h: 905 - TOP, tint: true, stroke: C.crimson });
      s.icon('bulb', { x: XP.x + PAD, y: TOP + 20, size: 46, circle: C.crimson, color: C.white });
      s.text('START NOW /\nQ4 2026 PILOT', { x: XP.x + PAD + 58, y: TOP + 17, w: XP.w - PAD * 2 - 58, h: 52, size: 22, bold: true, lh: 1.1, color: C.crimson, valign: 'middle', fit: true, minSize: 17 });
      const cw = XP.w - PAD * 2;
      const concl = 'Подтверждаем эффективность подхода и масштабируем в 2027 году';
      const ch = hOf(concl, 19, cw - 36, true) + 36;
      const cy = 905 - PAD - ch;
      s.checks(['AI/data сегменты', 'retail/product signals', 'тест узкого age targeting', 'первые audience enrichment / look-alike', 'benchmark CTR/CPC/quality visit'],
        { x: XP.x + PAD, y: TOP + HEAD_H, w: cw, size: 18, pitch: 'auto', gap: 24 });
      s.box({ x: XP.x + PAD, y: cy, w: cw, h: ch, fill: C.crimson });
      s.text(concl, { x: XP.x + PAD + 18, y: cy + 18, w: cw - 36, size: 19, bold: true, lh: 1.2, color: C.white });

      s.principle({ label: 'Почему это важно', icon: 'bulb',
        text: 'В категории колик выигрывает тот, кто встречает маму ближе к моменту возникновения проблемы — и сопровождает ее на всем пути: от первых вопросов до осознанного выбора' });
    }

    // ---------- 24б · 4. механика теста сегментов + кейс смежной категории ----------
    {
      const s = d.slide({ title: 'Precise targeting: механика теста сегментов и бизнес-обоснование' });
      const PAD = 30;
      const X = { x: 58, w: 1804 };
      const iw = X.w - PAD * 2;

      // --- 4. Механика теста сегментов / бизнес-обоснование ---
      const steps = [
        { icon: 'tb:TbUsers', t: '**Узкая ЦА:** мамы новорожденных и мамы 1–12 мес.' },
        { icon: 'tb:TbCalendar', t: '**Короткое окно возможности:** контакт важен именно в период колик' },
        // блок чуть уже (narrow), чтобы «момент» не висел один в третьей строке: «…попадания / в нужный момент»
        { icon: 'tb:TbTarget', t: '**Разные типы таргетинга дают** разную точность попадания в нужный момент', narrow: 24 },
        { icon: 'tb:TbChartBar', t: '**Оцениваем, какие сигналы и типы таргетинга лучше попадают в узкую аудиторию**' },
      ];
      const SS = 20;
      const CHV = 46;
      const sw = Math.floor((iw - CHV * (steps.length - 1)) / steps.length);
      const stepTH = Math.max(...steps.map((st) => hOf(st.t, SS, sw - 32 - (st.narrow || 0), false)));
      const stepH = 16 + 40 + 14 + stepTH + 20;
      const rows3 = [
        { icon: 'tb:TbFlask', k: 'Тест:', t: 'оцениваем разные типы таргетинга' },
        { icon: 'tb:TbChartBar', k: 'Смотрим:', t: 'CTR / quality visits / CR «Где купить» / add-to-cart / e-com search / brand search / to buy / Sales Lift' },
        { icon: 'tb:TbFlag', k: 'Цель:', t: 'понять, какие типы таргетинга дают наилучшую точность попадания в узкую аудиторию по метрикам demo 5' },
      ];
      const GW = 30;
      const rw = Math.floor((iw - GW * 2) / 3);
      const RI = 50;
      const rtw = rw - RI - 16;
      const rowTH = Math.max(...rows3.map((r) => 28 + hOf(r.t, 18, rtw)));

      const y0 = TOP;
      const h4 = 24 + 44 + 22 + stepH + 22 + 22 + rowTH + 26;
      s.card({ x: X.x, y: y0, w: X.w, h: h4 });
      let y = y0 + 24;
      blockHead(s, { x: X.x + PAD, y, w: iw, n: 4, text: 'Механика теста сегментов / бизнес-обоснование', d: 44, size: 26 });
      y += 44 + 22;
      steps.forEach((st, i) => {
        const x = X.x + PAD + i * (sw + CHV);
        s.box({ x, y, w: sw, h: stepH, fill: C.cardTint });
        s.badge({ x: x + 16, y: y + 16, d: 40, n: i + 1, color: C.crimson, size: 21 });
        s.icon(st.icon, { x: x + 16 + 40 + 14, y: y + 16, size: 40, color: C.blue });
        s.text(st.t, { x: x + 16, y: y + 16 + 40 + 14, w: sw - 32 - (st.narrow || 0), size: SS, lh: 1.2, color: C.navy });
        if (i < steps.length - 1) s.chevron({ cx: x + sw + CHV / 2, cy: y + stepH / 2, w: 16, h: 24, color: C.crimson });
      });
      y += stepH + 22;
      s.hline(X.x + PAD, y, iw);
      y += 22;
      rows3.forEach((r, i) => {
        const x = X.x + PAD + i * (rw + GW);
        if (i > 0) s.vline(x - GW / 2, y, rowTH);
        s.icon(r.icon, { x, y, size: RI, circle: C.blue, color: C.white });
        s.text(r.k, { x: x + RI + 16, y: y - 1, w: rtw, size: 21, bold: true, lh: 1.0, color: C.navy });
        s.text(r.t, { x: x + RI + 16, y: y + 28, w: rtw, size: 18, lh: 1.2, color: C.blueText });
      });

      // --- Дополнительное обоснование: кейс смежной категории ---
      const cy0 = y0 + h4 + 16;
      const ch = BOT - cy0;
      s.card({ x: X.x, y: cy0, w: X.w, h: ch, tint: true });
      s.icon('tb:TbTrendingUp', { x: X.x + PAD, y: cy0 + 22, size: 44, circle: C.crimson, color: C.white });
      s.text('Дополнительное обоснование: кейс смежной категории', { x: X.x + PAD + 58, y: cy0 + 22, w: 1100, h: 44, size: 26, bold: true, lh: 1.0, color: C.navy, valign: 'middle', fit: true, maxLines: 1, minSize: 19 });
      const STW = 900;    // три цифры справа
      const txw = iw - STW - 44;
      const caseT = 'По данным кейса клиента смежной категории, тест со сравнением стандартного таргетинга и обогащённой модели сегментации показал, что более точный подход к выявлению сегмента аудитории способен одновременно повысить качество попадания в ЦА и улучшать медийную эффективность. Для нашей задачи это важный аргумент в пользу того, что precise targeting должен рассматриваться не как техническая настройка, а как инструмент повышения качества контакта в коротком окне релевантности.';
      const bodyY = cy0 + 22 + 44 + 20;
      const bodyH = cy0 + ch - 26 - bodyY;
      s.text(caseT, { x: X.x + PAD, y: bodyY, w: txw, h: bodyH, size: 20, lh: 1.25, color: C.navy, fit: true, minSize: 16, valign: 'middle' });
      const stats = [
        { k: 'CTR', v: '+20%' },
        { k: 'CPC', v: '−3%' },
        { k: 'Target accuracy', v: '+7,1', u: 'п.п.' },
      ];
      const sx0 = X.x + X.w - PAD - STW;
      const sgap = 18;
      const stw = Math.floor((STW - sgap * 2) / 3);
      const SH = Math.min(bodyH, 170);
      // одна величина кегля для всех трёх цифр — по самой длинной
      const vW = (st, sz) => wOf(st.v, sz, true) + (st.u ? wOf(' ' + st.u, Math.round(sz * 0.55), true) : 0);
      let VS = 64;
      while (VS > 40 && stats.some((st) => vW(st, VS) > (stw - 44) * 0.97)) VS -= 1;
      const sy = bodyY + Math.round((bodyH - SH) / 2);
      stats.forEach((st, i) => {
        const x = sx0 + i * (stw + sgap);
        s.box({ x, y: sy, w: stw, h: SH, fill: C.white, stroke: C.line, sw: 2 });
        s.text(st.k, { x: x + 22, y: sy + 22, w: stw - 44, size: 21, bold: true, lh: 1.0, color: C.blueText, fit: true, maxLines: 1, minSize: 16 });
        const runs = st.u ? [{ text: st.v, options: {} }, { text: ' ' + st.u, options: { fontSize: PT(Math.round(VS * 0.55)) } }] : st.v;
        s.text(runs, { x: x + 22, y: sy + SH - 22 - Math.round(VS * 1.1), w: stw - 44, size: VS, bold: true, lh: 1.1, color: C.crimson });
      });
      s.footnote('Источник: кейс клиента смежной категории, test standard vs enriched targeting, MediaSniper / Mediascope.');
    }
  },
};
