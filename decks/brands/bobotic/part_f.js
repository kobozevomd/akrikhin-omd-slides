// Боботик · стратегия 2027 — часть F: слайды исходника 25–28.
// 25 — блогеры 2027 (картинка во весь слайд → живой текст, фото авторов из media, вырезки crops/f_author_*),
// 26 — Paid Search 2027 → составляющая AI Visibility Stream (картинка → живой текст),
// 27 — digital-календарь 2027 (своя сетка-гант, как Azelik 58 / Clindovit 18),
// 28 — итог: что даёт рост инвестиций vs 2026 (как Azelik 59 / Clindovit 19).
const path = require('path');
const { C, columns, countLines, textWidth, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common'); // TOP, GRID
const B = require('./common');              // MEDIA, CROPS

const CROPS = B.CROPS;
const TOP = V.TOP;      // 221
const BOT0 = 1005;      // низ контента без плашки
const BOT1 = 905;       // низ контента над плашкой
const MUTED_TXT = '6E86AD';

// Этапы воронки Боботика — цвета как в исходнике (слайды 20, 28): CREATE красный, WIN синий, TRUST фиолетовый, CONVERT зелёный
const STG = { CREATE: C.crimson, WIN: C.blue, TRUST: C.purple, CONVERT: C.green };

// ---------- Локальные хелперы (как в azelik/part_h.js) ----------

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
// Цепочку этапов «CREATE DEMAND → WIN THE MOMENT → …» не рвём внутри имени этапа (после перевода)
const glueStages = (t) => tr(String(t)).replace(/(CREATE|WIN|THE|BUILD|CONVERT) /g, '$1 ');

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

module.exports = {
  // ===================== 25. Блогеры 2027 =====================
  25: (d) => {
    const s = d.slide({
      title: 'Блогеры 2027: дополняем ORM/media/AI & Paid Search',
      subtitle: 'Расширение occasion-based Comprehensive-подхода через доверительный контакт\nв релевантной жизненной ситуации',
    });

    // --- ряд 1: пять шагов механики ---
    const STEPS = [
      { t: 'Сегмент', d: 'ЦА: Женщина 20–45 лет с детьми от рождения и до 6–8 месяцев', c: C.cyan },
      { t: 'Автор + креатив', d: 'Портрет автора под сегмент\nНативный сюжет\nПерсональный продуктовый аргумент', c: C.crimson },
      { t: 'Площадка', d: 'VK — ядро\nMAX — тест\nДзен / RUTUBE — контекст и видео', c: C.blue },
      { t: 'Post-click', d: 'UTM / кликабельная ссылка\nКачество визита\nПереход «Где купить»', c: C.green },
      { t: 'Decision gate', d: 'Спринт 1: валидируем\nСпринт 2: усиливаем касание с ЦА\nНе масштабируем слабые связки', c: C.navy },
    ];
    const scols = columns(5, { gap: 34 });
    const SP = 20;
    const SD = 40;
    const stw = scols[0].w - 2 * SP;
    const stepH = 18 + SD + 10 + Math.max(...STEPS.map((st) => measure(st.d, stw, 16))) + 18;
    STEPS.forEach((st, i) => {
      const { x, w } = scols[i];
      s.card({ x, y: TOP, w, h: stepH });
      s.badge({ x: x + SP, y: TOP + 18, d: SD, n: i + 1, color: st.c, size: 20 });
      s.text(st.t, { x: x + SP + SD + 12, y: TOP + 18, w: w - 2 * SP - SD - 12, h: SD, size: 19, bold: true, lh: 1.0, color: C.navy, caps: true, valign: 'middle', fit: true, maxLines: 1, minSize: 14 });
      s.text(st.d, { x: x + SP, y: TOP + 18 + SD + 10, w: stw, size: 16, lh: 1.2, color: C.blueText });
      if (i < STEPS.length - 1) s.chevron({ cx: x + w + 17, cy: TOP + stepH / 2, dir: 'right', w: 16, h: 26 });
    });

    // --- ряд 2: Telegram и YouTube не закладываем ---
    const BY1 = TOP + stepH + 16;
    const BH1 = 66;
    s.box({ x: 58, y: BY1, w: 1804, h: BH1, fill: 'FCEBEF', r: 15 });
    let bx = 58 + 24;
    [['tb:TbBrandTelegram', 'Telegram'], ['tb:TbBrandYoutube', 'YouTube']].forEach(([ic, alt]) => {
      s.circle({ x: bx, y: BY1 + (BH1 - 38) / 2, d: 38, fill: C.white, stroke: C.crimson, sw: 2 });
      s.icon(ic, { x: bx + 8, y: BY1 + (BH1 - 38) / 2 + 8, size: 22, color: C.crimson, alt });
      bx += 38 + 10;
    });
    const NO = '2027: Telegram и YouTube не закладываем в медиаплан';
    const now = Math.min(widthOf(NO, 20, true) + 8, 700);
    s.text(NO, { x: bx + 8, y: BY1, w: now, h: BH1, size: 20, bold: true, lh: 1.1, color: C.crimson, valign: 'middle', fit: true, maxLines: 2, minSize: 16 });
    const fx = bx + 8 + now + 28;
    s.vline(fx, BY1 + 14, BH1 - 28, C.crimson, 1.5);
    s.text('ФАС обозначила переходный период для рекламы на этих ресурсах только до конца 2026 года. Альтернативы ниже позволяют сохранять кликабельную ссылку и post-click измерение.',
      { x: fx + 24, y: BY1 + 6, w: 1862 - 24 - (fx + 24), h: BH1 - 12, size: 16, lh: 1.2, color: C.navy, valign: 'middle', fit: true, minSize: 14 });

    // --- ряд 3: сплит площадок · авторы ---
    const y3 = BY1 + BH1 + 24;
    const L = { x: 58, w: 860 };
    const R = { x: 58 + 860 + 24, w: 1862 - (58 + 860 + 24) };
    const lhH = s.label('Рекомендуемый сплит площадок', { x: L.x, y: y3 + 2, w: L.w, size: 20, color: C.navy });
    const SEL = '**Отбираем авторов** по соответствию конкретному оккейжену, естественности опыта и способности дать измеримый переход';
    const rhH = measureRich(SEL, R.w, 17);
    s.text(SEL, { x: R.x, y: y3, w: evenW(SEL, R.w, 17), size: 17, lh: 1.2, color: C.blueText });
    const cY = y3 + Math.max(lhH + 4, rhH) + 14;
    const cH = BOT1 - cY;

    // сплит: доля бюджета · площадка · роль
    const SPL = [
      { v: '67%', t: 'VK', d: 'Основной охват + видео/посты. В форматах без внешнего клика — связка с кликабельным постом.', c: C.blue },
      { v: '13%', t: 'RUTUBE', d: 'Тест новой площадки: тематические каналы, видео/пост, встроенные внешние ссылки.', c: C.crimson },
      { v: '12%', t: 'Дзен', d: 'Нативные разборы и рутины; длинный контакт + прямой переход на бренд/аптеку.', c: C.green },
      { v: '8%', t: 'MAX', d: 'Видео у авторов и тематические размещения; ссылка в описании/сопровождающем материале.', c: C.cyan },
    ];
    s.card({ x: L.x, y: cY, w: L.w, h: cH });
    const LP = 26;
    const CHW = 96;
    const CHH = 52;
    const ltx = L.x + LP + CHW + 22;
    const ltw = L.x + L.w - LP - ltx;
    const rh = SPL.map((p) => Math.max(CHH, 24 + 4 + measure(p.d, ltw, 16)));
    const lgap = (cH - 2 * 22 - sum(rh)) / (SPL.length - 1);
    let ly = cY + 22;
    SPL.forEach((p, i) => {
      if (i) s.hline(ltx, ly - lgap / 2, ltw);
      s.box({ x: L.x + LP, y: ly + (rh[i] - CHH) / 2, w: CHW, h: CHH, fill: p.c, r: 12 });
      s.text(p.v, { x: L.x + LP, y: ly + (rh[i] - CHH) / 2, w: CHW, h: CHH, size: 26, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
      s.text(p.t, { x: ltx, y: ly, w: ltw, size: 21, bold: true, lh: 1.0, color: C.navy });
      s.text(p.d, { x: ltx, y: ly + 28, w: evenW(p.d, ltw, 16), size: 16, lh: 1.2, color: C.blueText });
      ly += rh[i] + lgap;
    });

    // авторы: фото · имя · подписчики · ожидаемый охват
    const AU = [
      { name: 'Виктория Касимова', img: 'f_author_kasimova.png', subs: '813 тыс.', reach: '100 тыс.' },
      { name: 'В гости к Наде', img: 'f_author_nadya.png', subs: '18 тыс.', reach: '10 тыс.' },
      { name: 'Катя Дима', img: 'f_author_katya_dima.png', subs: '460,9 тыс.', reach: '120 тыс.' },
    ];
    const acols = columns(3, { x0: R.x, x1: 1862, gap: 20 });
    const AP = 16;
    const aw = acols[0].w - 2 * AP;
    // подписчики и охват — строками «значение + подпись», как в исходнике
    const LS = 16;
    const STATS = [['subs', 'подписчиков', C.navy], ['reach', 'ожидаемый охват', C.crimson]];
    const lbw = Math.max(...STATS.map(([, l]) => widthOf(l, LS))) + 4;
    const vs = commonSize(AU.flatMap((a) => STATS.map(([k]) => [a[k], aw - lbw - 10])), 26, 20);
    const RG = 8;
    const fixedH = AP + 24 + 10 + 14 + 2 * vs + RG + AP;
    const ph = Math.min(Math.round(aw / 1.12), cH - fixedH);
    const pw = Math.round(ph * 1.12);
    AU.forEach((a, i) => {
      const { x, w } = acols[i];
      s.card({ x, y: cY, w, h: cH });
      s.text(a.name, { x: x + AP, y: cY + AP, w: aw, size: 20, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 15 });
      const py = cY + AP + 24 + 10;
      s.image(path.join(CROPS, a.img), { x: x + (w - pw) / 2, y: py, w: pw, h: ph, alt: a.name });
      let sy = py + ph + 14;
      STATS.forEach(([k, l, col]) => {
        const vwid = widthOf(a[k], vs, true) + 4;
        s.text(a[k], { x: x + AP, y: sy, w: vwid, size: vs, bold: true, lh: 1.0, color: col });
        s.text(l, { x: x + AP + vwid + 6, y: sy + Math.round((vs - LS) * 0.72), w: aw - vwid - 6, size: LS, lh: 1.0, color: C.blueText });
        sy += vs + RG;
      });
    });

    s.formula({ text: '3 оккейжена → персонализированное сообщение → разрешённая площадка → переход → decision gate между двумя спринтами' });
    s.footnote('ФАС России — переходный период по Telegram/YouTube до конца 2026; DIDENOK TEAM / Sostav, август 2026; eLama + Telega.in / Sostav, июнь 2026.');
    s.notes('https://brandanalytics.ru/blog/social-media-russia-autumn-2025');
  },

  // ===================== 26. Paid Search 2027 =====================
  26: (d) => {
    const s = d.slide({
      title: 'Paid Search 2027: переход от автономного Performance-канала к составляющей AI Visibility Stream',
      subtitle: 'Paid Search и SEO синхронизируют семантику; Paid Search-инвестиции снижаются там, где бренд органически силён, и перераспределяются в зоны слабой SEO-видимости',
    });
    // цвета семантики: бренд + транзакционные — синий, категория — зелёный, конкуренты — оранжевый, общая оптимизированная — фиолетовый
    const COL = [{ x: 58, w: 560 }, { x: 640, w: 590 }, { x: 1252, w: 610 }];
    const PAD = 28;
    const HD = 44;
    const HEADS = ['Структура спроса', 'Логика кампаний', 'Общая оптимизированная семантика'];
    const headW = (c) => c.w - 2 * PAD - HD - 14;
    const headH = Math.max(HD, ...HEADS.map((h, i) => measure(h.toUpperCase(), headW(COL[i]), 21, true, 1.1)));
    const CB = BOT1;
    COL.forEach((c, i) => {
      s.card({ x: c.x, y: TOP, w: c.w, h: CB - TOP, tint: i === 2 });
      s.badge({ x: c.x + PAD, y: TOP + 24 + (headH - HD) / 2, d: HD, n: i + 1, color: C.blue, size: 21 });
      s.text(HEADS[i], { x: c.x + PAD + HD + 14, y: TOP + 24, w: headW(c), h: headH, size: 21, bold: true, lh: 1.1, color: C.navy, caps: true, valign: 'middle' });
    });
    const y0 = TOP + 24 + headH + 18;

    // --- 1. Структура спроса ---
    {
      const c = COL[0];
      const x = c.x + PAD;
      const w = c.w - 2 * PAD;
      s.text('Доли общего Paid Search контура, 100%', { x, y: y0, w, size: 16, lh: 1.0, color: MUTED_TXT });
      const SEG = [
        { v: 34.5, t: 'Бренд + транзакционные', ex: 'Боботик / купить / капли от колик / газики цена', c: C.blue },
        { v: 38.3, t: 'Категория', ex: 'колики / газики / средство от колик', c: C.green },
        { v: 13.7, t: 'Конкуренты', ex: 'Эспумизан Бэби / симетикон / бренды категории', c: C.orange },
        { v: 13.5, t: 'Общая оптимизированная', ex: 'бренд / категория / конкуренты / interests + LAL', c: C.purple },
      ];
      const pct = (v) => `${String(v).replace('.', ',')}%`;
      // полоса 100%
      const by = y0 + 28;
      const bh = 46;
      let bx = x;
      SEG.forEach((g, i) => {
        const gw = (w - 3 * 3) * g.v / 100;
        s.box({ x: bx, y: by, w: gw, h: bh, fill: g.c, r: i === 0 || i === SEG.length - 1 ? 10 : 0 });
        s.text(pct(g.v), { x: bx, y: by, w: gw, h: bh, size: 16, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
        bx += gw + 3;
      });
      // итог сплита — внизу карточки
      const SUM = '**Сплит 2027: [[72,8%]] — основной спрос (категория + бренд/транзакция); 13,7% — конкуренты; 13,5% — общая оптимизированная семантика через РСЯ.**';
      const sw = w;
      const sh = measureRich(SUM, sw - 40, 17, true) + 32;
      const sy = CB - 20 - sh;
      s.box({ x: x - 8, y: sy, w: w + 16, h: sh, fill: C.cardTint, r: 15 });
      s.text(SUM, { x: x + 12, y: sy + 16, w: sw - 40, size: 17, lh: 1.2, color: C.navy });
      // сегменты спроса
      const CHW = 78;
      const tx = x + CHW + 16;
      const tw = x + w - tx;
      const rh = SEG.map((g) => Math.max(40, 20 + 6 + measure(g.ex, tw, 17)));
      const top = by + bh + 24;
      const gap = (sy - 20 - top - sum(rh)) / (SEG.length - 1);
      let y = top;
      SEG.forEach((g, i) => {
        if (i) s.hline(tx, y - gap / 2, tw);
        s.box({ x, y: y + (rh[i] - 40) / 2, w: CHW, h: 40, fill: g.c, r: 10 });
        s.text(pct(g.v), { x, y: y + (rh[i] - 40) / 2, w: CHW, h: 40, size: 17, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
        s.text(g.t, { x: tx, y, w: tw, size: 17, bold: true, lh: 1.0, color: C.navy, caps: true, fit: true, maxLines: 1, minSize: 14 });
        s.text(g.ex, { x: tx, y: y + 26, w: tw, size: 17, lh: 1.2, color: C.blueText });
        y += rh[i] + gap;
      });
    }

    // --- 2. Логика кампаний ---
    {
      const c = COL[1];
      const x = c.x + PAD;
      const w = c.w - 2 * PAD;
      const ITEMS = [
        { t: 'Бренд + транзакционные → аптечная посадочная', d: 'Самый короткий путь к покупке: объединяем брендовый и транзакционный спрос и ведём напрямую к аптеке.', c: C.blue },
        { t: 'Категория + конкуренты → сайт', d: 'Сначала раскрываем преимущества Боботика и только затем переводим пользователя к блоку аптек / «Где купить».', c: C.green },
        { t: 'Общая оптимизированная → РСЯ / сайт', d: 'Объединяем бренд, категорию, конкурентов и interests/LAL: больше данных для автостратегии и гибкое перераспределение трафика.', c: C.purple },
      ];
      const LOG = '**Единая логика:** intent определяет посадочную, а CR / CPA по движению к аптеке определяют оптимизацию.';
      const IC = 46;
      const lw = w - IC - 18 - 8;
      const lh = Math.max(IC, measureRich(LOG, lw, 18)) + 32;
      const ly = CB - 20 - lh;
      s.box({ x: x - 8, y: ly, w: w + 16, h: lh, fill: 'F1EEFA', r: 15 });
      s.icon('tb:TbBulb', { x: x + 6, y: ly + (lh - IC) / 2, size: IC, circle: C.purple, color: C.white });
      s.text(LOG, { x: x + 6 + IC + 18, y: ly + 16, w: lw - 6, h: lh - 32, size: 18, lh: 1.2, color: C.navy, valign: 'middle' });
      const BD = 40;
      const tx = x + BD + 18;
      const tw = x + w - tx;
      const ih = ITEMS.map((it) => measure(it.t, tw, 21, true, 1.1) + 10 + measure(it.d, tw, 18));
      const top = y0 + 4;
      const gap = (ly - 22 - top - sum(ih)) / (ITEMS.length - 1);
      let y = top;
      ITEMS.forEach((it, i) => {
        if (i) s.hline(tx, y - gap / 2, tw);
        s.badge({ x, y: y - 4, d: BD, n: i + 1, color: it.c, size: 19 });
        const th = s.text(it.t, { x: tx, y, w: tw, size: 21, bold: true, lh: 1.1, color: C.navy });
        s.text(it.d, { x: tx, y: y + th + 10, w: evenW(it.d, tw, 18), size: 18, lh: 1.2, color: C.blueText });
        y += ih[i] + gap;
      });
    }

    // --- 3. Общая оптимизированная семантика ---
    {
      const c = COL[2];
      const x = c.x + PAD;
      const w = c.w - 2 * PAD;
      // доля + состав единой РСЯ
      const CHW = 96;
      const U = 'Единая РСЯ: бренд + категория + конкуренты + interests/LAL';
      const utw = w - CHW - 18;
      const uh = Math.max(44, measure(U, utw, 18, true, 1.15));
      let y = y0;
      s.box({ x, y: y + (uh - 44) / 2, w: CHW, h: 44, fill: C.purple, r: 10 });
      s.text('13,5%', { x, y: y + (uh - 44) / 2, w: CHW, h: 44, size: 19, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
      s.text(U, { x: x + CHW + 18, y: y + (uh - measure(U, utw, 18, true, 1.15)) / 2, w: utw, size: 18, bold: true, lh: 1.15, color: C.navy });
      y += uh + 20;
      // посадочная
      const LND = 'Весь трафик РСЯ ведём на сайт: здесь ниже стоимость целевого действия и больше возможностей для post-click оптимизации';
      const pillW = Math.max(150, widthOf('ПОСАДОЧНАЯ', 15, true) + 30);
      const lndH = 16 + 30 + 10 + measure(LND, w - 24, 17) + 16;
      s.box({ x: x - 8, y, w: w + 16, h: lndH, fill: C.white, stroke: C.line, sw: 1.5, r: 15 });
      s.box({ x: x + 8, y: y + 16, w: pillW, h: 30, fill: C.purple, r: 15 });
      s.text('Посадочная', { x: x + 8, y: y + 16, w: pillW, h: 30, size: 15, bold: true, lh: 1.0, color: C.white, caps: true, align: 'center', valign: 'middle' });
      s.text(LND, { x: x + 8, y: y + 16 + 30 + 10, w: evenW(LND, w - 24, 17), size: 17, lh: 1.2, color: C.navy });
      y += lndH + 22;
      // цепочка до покупки — внизу
      const CHN = 'РСЯ → сайт → блок аптек / «Где купить» →\ne-pharm / покупка';
      const IC = 44;
      const cw = w - IC - 18 - 8;
      const ch = Math.max(IC, measure(CHN, cw, 18, true, 1.15)) + 30;
      const cy = CB - 20 - ch;
      s.box({ x: x - 8, y: cy, w: w + 16, h: ch, fill: C.white, stroke: C.line, sw: 1.5, r: 15 });
      s.icon('tb:TbSitemap', { x: x + 6, y: cy + (ch - IC) / 2, size: IC, circle: C.green, color: C.white });
      s.text(CHN, { x: x + 6 + IC + 18, y: cy + 15, w: cw - 6, h: ch - 30, size: 18, bold: true, lh: 1.15, color: C.navy, valign: 'middle' });
      // зачем объединяем
      const WHY = ['Больше данных для обучения автостратегии', 'Быстрее выход из периода обучения', 'Алгоритм перераспределяет показы туда, где целевое действие дешевле', 'Не переводим РСЯ напрямую в аптеки, даём доп. контент на персонализированных посадочных страницах'];
      const wh = 24 + 14 + sum(WHY.map((t) => Math.max(35, measure(t, w - 52, 17)))) + 12 * (WHY.length - 1);
      const wy = y + Math.max(0, (cy - 20 - y - wh) / 2);
      s.text('Зачем объединяем', { x, y: wy, w, size: 20, bold: true, lh: 1.0, color: C.green });
      s.checks(WHY, { x, y: wy + 24 + 14, w, size: 17, pitch: 'auto', gap: 12, color: C.green });
    }

    s.principle({ label: 'KPI 2027', icon: 'tb:TbChartBar', text: 'CR / CPA «Где купить + аптеки / покупка» + quality visits → perso-LPs/e-pharm' });
  },

  // ===================== 27. Digital support calendar 2027 =====================
  27: (d) => {
    const s = d.slide({ title: 'Digital support calendar 2027: full-funnel flowchart' });

    // --- полоса KPI: бюджет со сплитом · медиа-KPI ---
    const KY = TOP;
    const KH = 146;
    const BW = 470;
    s.box({ x: 58, y: KY, w: BW, h: KH, fill: C.blue, r: 25 });
    s.text('Budget', { x: 88, y: KY + 24, w: 180, size: 18, bold: true, lh: 1.0, color: C.white, caps: true });
    s.text('19M', { x: 88, y: KY + 56, w: 170, size: 60, bold: true, lh: 1.0, color: C.white, fit: true, maxLines: 1, minSize: 44 });
    s.vline(270, KY + 24, KH - 48, C.white, 1.5);
    const sx = 292;
    const sw = 58 + BW - 28 - sx;
    s.text('Бюджетный сплит', { x: sx, y: KY + 24, w: sw, size: 15, bold: true, lh: 1.0, color: C.white, caps: true, fit: true, maxLines: 1, minSize: 12 });
    [['Digital media', '17,1M'], ['Tech cost', '1,9M']].forEach(([k, v], i) => {
      const y = KY + 62 + i * 32;
      s.text(k, { x: sx, y, w: sw - 80, size: 18, lh: 1.0, color: C.white });
      s.text(v, { x: sx + sw - 80, y, w: 80, size: 18, bold: true, lh: 1.0, color: C.white, align: 'right' });
    });
    // медиа-KPI
    const KX = 58 + BW + 22;
    const KW = 1862 - KX;
    s.card({ x: KX, y: KY, w: KW, h: KH });
    s.text('Media KPIs', { x: KX + 26, y: KY + 24, w: 300, size: 17, bold: true, lh: 1.0, color: C.crimson });
    const KPI = [['40M', 'Impressions'], ['6,56M', 'Tech. reach'], ['1M UU', 'Unique reach'], ['9,6M', 'Views'], ['225 тыс.', 'Clicks'],
      ['44 тыс.', 'Conversion\ncookie-banner'], ['1,2 тыс.', 'Conversion\nwhere-to-buy*']];
    const k0 = KX + 26;
    const wts = [0.9, 1, 1.05, 0.9, 1.1, 1.15, 1.15];
    const kws = wts.map((k) => k * (KW - 40) / sum(wts));
    const ks = commonSize(KPI.map(([v], i) => [v, kws[i] - 18]), 32, 22);
    let kx = k0;
    KPI.forEach(([v, t], i) => {
      if (i) s.vline(kx - 10, KY + 58, KH - 80);
      s.text(v, { x: kx, y: KY + 56, w: kws[i] - 18, size: ks, bold: true, lh: 1.0, color: C.navy });
      s.text(t, { x: kx, y: KY + 62 + ks, w: kws[i] - 18, h: 40, size: 15, lh: 1.15, color: C.blueText, fit: true, maxLines: 2, minSize: 13 });
      kx += kws[i];
    });

    // --- календарь: инфо-колонки + 12 месяцев ---
    const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    // периоды в месяцах [от, до) — по заливке ячеек исходника: светлая — активный период, яркая — спринт
    const ALL = [[0, 12]];
    const S1 = [4, 7];    // май–июль
    const S2 = [8.5, 11]; // середина сентября – ноябрь (правка Романа 20.10)
    const ROWS = [
      { ch: 'OLV', sup: 'AI DSPs', fmt: 'AI-Video 15” with personalization, Instream', bud: '4,6M', sob: '27%', sprint: [S1] },
      { ch: 'Programmatic', sup: 'Alfa-bank / T-bank / FirstData', fmt: 'Banners with personalization, precise-targeting', bud: '3,3M', sob: '20%', sprint: [S1, S2] },
      { ch: 'Bloggers', sup: 'VK / MAX / Dzen / Rutube', fmt: 'Posts, clips, shorts-video', bud: '1,8M', sob: '10%', sprint: [[4, 5], [8, 9]] },
      { ch: 'ORM + внешние публикации', sup: 'Reviews / forums\nSERP / e-pharm cards', fmt: 'Отзывы, обзоры, Q&A, дискуссии', bud: '2,9M', sob: '17%', act: ALL },
      { ch: 'GEO / AEO', sup: 'GEO / AI-answers', fmt: 'GEO-оптимизация под AI-ответы', bud: '1,9M', sob: '11%', act: ALL },
      { ch: 'Paid Search', sup: 'Yandex Direct', fmt: 'Text + image', bud: '2,6M', sob: '15%', act: ALL, sprint: [S1, S2] },
    ];
    const STAGES = [['CREATE DEMAND', STG.CREATE, 0, 1], ['WIN THE MOMENT', STG.WIN, 1, 1], ['BUILD TRUST', STG.TRUST, 2, 1], ['CONVERT DEMAND', STG.CONVERT, 3, 3]];
    const X0 = 58;
    const CW = { st: 146, ch: 196, sup: 220, fmt: 268, bud: 76, sob: 70 };
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
    let rowH = rowT.map((t) => Math.max(52, t + 18));
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
      s.hline(cx.ch, y0 + h, 1862 - cx.ch, C.line, 1.5);
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
    // этапы — цветами этапов деки
    STAGES.forEach(([t, col, i0, n]) => {
      const yy = ys[i0] + 4;
      const hh = ys[i0 + n - 1] + rowH[i0 + n - 1] - ys[i0] - 8;
      s.box({ x: X0 + 3, y: yy, w: CW.st - 10, h: hh, fill: col, r: 10 });
      s.text(t, { x: X0 + 14, y: yy, w: CW.st - 30, h: hh, size: 16, bold: true, lh: 1.1, color: C.white, valign: 'middle', fit: true, maxLines: 3, minSize: 12 });
    });
    // итог
    s.box({ x: X0, y: yEnd, w: 1862 - X0, h: TH, fill: C.navy, r: 0 });
    s.text('TOTAL', { x: cx.ch + PADX, y: yEnd, w: CW.ch, h: TH, size: 16, bold: true, lh: 1.0, color: C.white, valign: 'middle' });
    s.text('17,1M', { x: cx.bud - 8, y: yEnd, w: CW.bud + 16, h: TH, size: 16, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
    s.text('100%', { x: cx.sob, y: yEnd, w: CW.sob, h: TH, size: 15, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });

    calLegend(s, [['A6CDEE', 'активный период'], [C.crimson, 'спринт']]);
    s.footnote('Бюджет до НДС, включая АК/РС. *Конверсия «Где купить»', { w: 900 });
  },

  // ===================== 28. Итог: что даёт рост инвестиций =====================
  28: (d) => {
    const s = d.slide({ title: 'Боботик 2027', subtitle: 'Что даёт рост инвестиций vs 2026' });

    // --- четыре плитки: бизнес-цель, инвестиции, масштаб digital, качество охвата OLV ---
    const cols = columns(4, { gap: 22 });
    const TH = 150;
    const TILES = [
      { lab: 'Бизнес-цель 2027', v: '296 млн ₽', sub: '705 тыс. упаковок', color: C.crimson },
      { lab: 'Инвестиции', v: '13,1 → 19 млн ₽', sub: '+5,9 млн ₽ / +45% к 2026', color: C.blue },
      { lab: 'Масштаб digital', v: '1 млн UU', sub: 'охват 80% Universe', color: C.navy2 },
      { lab: 'OLV качество охвата', v: '75% / F 5+', sub: '≈540 тыс. мам ядра и роста', color: C.purple },
    ];
    const tvs = commonSize(TILES.map((t, i) => [t.v, cols[i].w - 56]), 48, 32);
    TILES.forEach((t, i) => {
      const { x, w } = cols[i];
      s.box({ x, y: TOP, w, h: TH, fill: t.color, r: 25 });
      s.text(t.lab, { x: x + 28, y: TOP + 22, w: w - 56, size: 17, bold: true, lh: 1.0, color: C.white, caps: true, fit: true, maxLines: 1, minSize: 13 });
      s.text(t.v, { x: x + 28, y: TOP + 52, w: w - 56, size: tvs, bold: true, lh: 1.0, color: C.white });
      s.text(t.sub, { x: x + 28, y: TOP + 110, w: w - 56, size: 18, bold: true, lh: 1.0, color: C.white, fit: true, maxLines: 1, minSize: 14 });
    });

    // --- нижняя часть: стабилизация → рост (над плашкой) ---
    const GROW = '**OLV** создаёт знание → **precise targeting** находит маму в момент потребности → **блогеры** усиливают доверие → **AI Visibility ecosystem + Paid Search** ведут к выбору и покупке';
    const L26 = { x: 58, w: 470 };
    const L27 = { x: 58 + 470 + 64, w: 1862 - (58 + 470 + 64) };
    const g27w = L27.w - 56;
    const sbH = Math.max(28 + 22 + 10 + measure('Замедлили снижение; долю рынка ещё предстоит восстановить', L26.w - 56, 18) + 24,
      28 + 22 + 10 + measureRich(GROW, g27w, 18) + 24);
    const SBY = BOT1 - sbH;
    const SLY = SBY - 40;

    // --- середина: как работает Comprehensive · три новые возможности ---
    const MY = TOP + TH + 24;
    const MH = SLY - 24 - MY;
    const L = { x: 58, w: 1010 };
    s.card({ x: L.x, y: MY, w: L.w, h: MH });
    const lx = L.x + 32;
    const lw = L.w - 64;
    s.label('Как работает Comprehensive в 2027', { x: lx, y: MY + 26, w: lw, size: 21, color: C.blue });
    const GH = 46;
    const ay = MY + 66;
    // Always-on = слой CONVERT DEMAND (Search / ORM / GEO / публикации) — зелёный, как Always on core на слайде 19 и «Always-on» на 20
    s.box({ x: lx, y: ay, w: lw, h: GH, fill: STG.CONVERT, r: 12 });
    s.text('Always-on: Search · ORM · GEO/AEO · публикации', { x: lx + 16, y: ay, w: lw - 32, h: GH, size: 18, bold: true, lh: 1.0, color: C.white, caps: true, align: 'center', valign: 'middle', fit: true, maxLines: 1, minSize: 14 });
    const py = ay + GH + 8;
    const gg = 8;
    const PH = [['Sprint 1 · май–июл', 0.42, C.crimson], ['Gate', 0.16, C.orange], ['Sprint 2 · осень', 0.42, C.crimson]];
    let px = lx;
    PH.forEach(([t, k, col]) => {
      const w = (lw - 2 * gg) * k;
      s.box({ x: px, y: py, w, h: GH, fill: col, r: 12 });
      s.text(t, { x: px + 10, y: py, w: w - 20, h: GH, size: 18, bold: true, lh: 1.0, color: C.white, caps: true, align: 'center', valign: 'middle', fit: true, maxLines: 1, minSize: 14 });
      px += w + gg;
    });
    const NOTES = [
      { t: 'AON защищает сформированный спрос и поддерживает выбор круглый год', c: STG.CONVERT },
      { t: 'Спринт 1: OLV + precise media + блогеры → Decision Gate по BLS, Search, CR «Где купить» и Sales Lift → перераспределение в Sprint 2 без OLV', c: C.crimson },
    ];
    const ntw = lw - 22;
    const nh = NOTES.map((n) => measure(n.t, ntw, 18));
    const nTop = py + GH + 22;
    const ngap = Math.max(14, (MY + MH - 26 - nTop - sum(nh)) / 2);
    let ny = nTop + Math.max(0, (MY + MH - 26 - nTop - sum(nh) - ngap) / 2);
    NOTES.forEach((n, i) => {
      s.box({ x: lx, y: ny, w: 6, h: nh[i], fill: n.c, r: 0 });
      s.text(n.t, { x: lx + 22, y: ny, w: evenW(n.t, ntw, 18), size: 18, lh: 1.2, color: C.navy });
      ny += nh[i] + ngap;
    });

    const R = { x: L.x + L.w + 22, w: 1862 - (L.x + L.w + 22) };
    s.card({ x: R.x, y: MY, w: R.w, h: MH });
    const rx = R.x + 32;
    const rw = R.w - 64;
    s.label('Три новых возможности для бренда', { x: rx, y: MY + 26, w: rw, size: 21, color: C.blue });
    const OP = [
      { st: 'CREATE DEMAND · OLV', v: '4,5 млн ₽', t: 'видеоконтакт до активного поиска', c: STG.CREATE },
      { st: 'WIN THE MOMENT · PROGRAMMATIC', v: '3,2 млн ₽', t: 'точное попадание в окно колик', c: STG.WIN },
      { st: 'BUILD TRUST · BLOGGERS', v: '1,8 млн ₽', t: 'доверие через жизненные истории', c: STG.TRUST },
    ];
    const bd = 46;
    const vW = Math.max(...OP.map((o) => widthOf(o.v, 24, true))) + 8;
    const otx = rx + bd + 18;
    const otw = rx + rw - vW - 16 - otx;
    const oh = OP.map((o) => Math.max(bd, measure(o.st, otw, 19, true, 1.05) + 6 + measure(o.t, otw, 17)));
    const oy0 = MY + 74;
    const ogap = (MY + MH - 24 - oy0 - sum(oh)) / (OP.length - 1);
    let oy = oy0;
    OP.forEach((o, i) => {
      if (i) s.hline(otx, oy - ogap / 2, rx + rw - otx);
      s.badge({ x: rx, y: oy + (oh[i] - bd) / 2, d: bd, n: `0${i + 1}`, color: o.c, size: 18 });
      const th = s.text(o.st, { x: otx, y: oy + (oh[i] - measure(o.st, otw, 19, true, 1.05) - 6 - measure(o.t, otw, 17)) / 2, w: otw, size: 19, bold: true, lh: 1.05, color: C.navy });
      s.text(o.t, { x: otx, y: oy + (oh[i] - th - 6 - measure(o.t, otw, 17)) / 2 + th + 6, w: otw, size: 17, lh: 1.2, color: C.blueText });
      s.text(o.v, { x: rx + rw - vW, y: oy, w: vW, h: oh[i], size: 24, bold: true, lh: 1.0, color: o.c, align: 'right', valign: 'middle' });
      oy += oh[i] + ogap;
    });

    // --- как инвестиции переводят стабилизацию в рост: 2026 → 2027 ---
    s.label('Как инвестиции переводят стабилизацию в рост', { x: 58, y: SLY, w: 1804, size: 21, color: C.blue });
    s.card({ x: L26.x, y: SBY, w: L26.w, h: sbH });
    s.text('2026 · стабилизация', { x: L26.x + 28, y: SBY + 26, w: L26.w - 56, size: 18, bold: true, lh: 1.0, color: MUTED_TXT, caps: true });
    s.text('Замедлили снижение; долю рынка ещё предстоит восстановить', { x: L26.x + 28, y: SBY + 26 + 22 + 10, w: L26.w - 56, size: 18, lh: 1.2, color: C.navy });
    s.arrow({ dir: 'right', x: L26.x + L26.w + 12, y: SBY + sbH / 2, len: 40, head: 34, headLen: 18, stem: 10, color: C.crimson });
    s.card({ x: L27.x, y: SBY, w: L27.w, h: sbH, tint: true });
    s.text('2027 · управляемый рост', { x: L27.x + 28, y: SBY + 26, w: g27w, size: 18, bold: true, lh: 1.0, color: C.blue, caps: true });
    s.text(GROW, { x: L27.x + 28, y: SBY + 26 + 22 + 10, w: evenW(GROW, g27w, 18), size: 18, lh: 1.2, color: C.navy });

    s.formula({ text: glueStages('CREATE DEMAND → WIN THE MOMENT → BUILD TRUST → CONVERT DEMAND'), color: C.crimson, size: 24 });
  },
};
