// Нормобакт L · стратегия 2027 — часть E: слайды исходника 21–24.
// 21 — внешние экспертные публикации (картинка во весь слайд → живой текст, три колонки «где / что / как»),
// 22 — Paid Search: от структуры спроса к покупке (картинка → живой текст, как Bobotic 26 / Azelik 56),
// 23 — digital-календарь 2027 (своя сетка-гант, как Bobotic 27 / Azelik 58 / Clindovit 18),
// 24 — итог: от конверсии спроса к более раннему влиянию на выбор vs 2026 (как Bobotic 28 / Azelik 59 / Clindovit 19).
const { C, countLines, textWidth, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common'); // TOP, GRID

const TOP = V.TOP;      // 221
const BOT0 = 1005;      // низ контента без плашки
const BOT1 = 905;       // низ контента над плашкой
const MUTED_TXT = '6E86AD';

// Этапы деки Нормобакта — цвета как на архитектуре кампании (слайд 20): CAPTURE DEMAND & VISIBILITY зелёный, CHOICE & CONVERSION фиолетовый
const STG = { CAPTURE: C.green, CHOICE: C.purple };

// ---------- Локальные хелперы (как в bobotic/part_f.js) ----------

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

// Три карточки-колонки с номером и КАПС-заголовком → y начала контента
function colCards(s, COL, HEADS, { y = TOP, bottom = BOT1, colors, pad = 28, tint = [] } = {}) {
  const HD = 44;
  const headW = (c) => c.w - 2 * pad - HD - 14;
  const headH = Math.max(HD, ...HEADS.map((h, i) => measure(h.toUpperCase(), headW(COL[i]), 21, true, 1.1)));
  COL.forEach((c, i) => {
    s.card({ x: c.x, y, w: c.w, h: bottom - y, tint: tint.includes(i) });
    s.badge({ x: c.x + pad, y: y + 24 + (headH - HD) / 2, d: HD, n: i + 1, color: colors ? colors[i] : C.blue, size: 21 });
    s.text(HEADS[i], { x: c.x + pad + HD + 14, y: y + 24, w: headW(c), h: headH, size: 21, bold: true, lh: 1.1, color: C.navy, caps: true, valign: 'middle' });
  });
  return y + 24 + headH + 20;
}

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
  // ===================== 21. Внешние экспертные публикации =====================
  21: (d) => {
    const s = d.slide({
      title: 'Внешние экспертные публикации: независимый доказательный слой для Нормобакта',
      subtitle: 'Создаём индексируемые экспертные источники, которые объясняют роль продукта, закрепляют связь Нормобакт L ↔ LGG и усиливают Search / GEO / AEO',
    });

    // --- цепочка сверху ---
    const CH = 62;
    s.box({ x: 58, y: TOP, w: 1804, h: CH, fill: C.cardTint, r: 15 });
    s.text('**OCCASION → [[экспертное объяснение]] → LGG [[как доказательное основание]] → Search / e-pharm / [[покупка]]**', {
      x: 88, y: TOP, w: 1744, h: CH, size: 23, lh: 1.0, color: C.navy, align: 'center', valign: 'middle', fit: true, maxLines: 1, minSize: 17 });

    const COL = [{ x: 58, w: 560 }, { x: 640, w: 610 }, { x: 1272, w: 590 }];
    const ACC = [C.green, C.purple, C.orange];
    const CY = TOP + CH + 20;
    const y0 = colCards(s, COL, ['Где публикуем', 'Что публикуем', 'Как делаем материал цитируемым'], { y: CY, colors: ACC });
    const PAD = 28;
    const CB = BOT1;

    // --- 1. Где публикуем ---
    {
      const c = COL[0];
      const x = c.x + PAD;
      const w = c.w - 2 * PAD;
      const IC = 52;
      const tx = x + IC + 18;
      const tw = x + w - tx;
      const ITEMS = [
        { t: 'Медицинские и экспертные медиа', site: 'medikforum.ru  •  MedAboutMe.ru', role: '**Роль:** доказательный и образовательный контекст', c: C.green, ic: 'tb:TbStethoscope' },
        { t: 'Родительские площадки', site: 'stranamam.ru  •  baby.ru', role: '**Роль:** знакомая ситуация + понятное объяснение выбора', c: C.blue, ic: 'tb:TbUsers' },
        { t: 'Аптечные / health-ресурсы', site: 'planetazdorovo.ru  •  farmlend.ru\nstolichki.ru  •  ozerki.ru', role: '**Роль:** максимально близко к выбору и покупке', c: C.orange, ic: 'tb:TbShoppingCart' },
      ];
      const ih = ITEMS.map((it) => measure(it.t, tw, 21, true, 1.1) + 10 + measure(it.site, tw, 19) + 10 + measureRich(it.role, tw, 18));
      const gap = (CB - 24 - y0 - sum(ih)) / (ITEMS.length - 1);
      let y = y0;
      ITEMS.forEach((it, i) => {
        if (i) s.hline(x, y - gap / 2, w);
        s.icon(it.ic, { x, y: y - 2, size: IC, circle: it.c, color: C.white });
        const th = s.text(it.t, { x: tx, y, w: tw, size: 21, bold: true, lh: 1.1, color: it.c });
        const sh = s.text(it.site, { x: tx, y: y + th + 10, w: tw, size: 19, lh: 1.2, color: C.navy });
        s.text(it.role, { x: tx, y: y + th + 10 + sh + 10, w: tw, size: 18, lh: 1.2, color: C.blueText });
        y += ih[i] + gap;
      });
    }

    // --- 2. Что публикуем ---
    {
      const c = COL[1];
      const x = c.x + PAD;
      const w = c.w - 2 * PAD;
      const IC = 44;
      const LW = 168;
      const lx = x + IC + 14;
      const dx = lx + LW + 22;
      const dw = x + w - dx;
      const ITEMS = [
        { t: 'Антибиотики', d: 'Как поддержать микрофлору ребёнка на фоне / после курса антибиотиков', c: C.green, ic: 'tb:TbPill' },
        { t: 'ОКИ / ротавирус', d: 'Что важно в период восстановления и на что смотреть при выборе поддержки', c: C.crimson, ic: 'tb:TbVirus' },
        { t: 'Смена питания / стул', d: 'Почему ЖКТ реагирует на изменение рациона и как поддержать микрофлору', c: C.blue, ic: 'tb:TbBabyBottle' },
        { t: 'LGG — объяснение', d: 'Что такое LGG и почему изученность штамма важна при выборе', c: C.purple, ic: 'tb:TbMicroscope' },
        { t: 'Специфика Нормобакта', d: 'Раскрываем изученность и доказательный контекст LGG, контекст потребления', c: C.navy, ic: 'tb:TbFileText', hl: true },
      ];
      const ih = ITEMS.map((it) => Math.max(IC, measure(it.t.toUpperCase(), LW, 17, true, 1.1), measure(it.d, dw, 17)));
      // последний пункт — в выделенной подложке
      const HLP = 14;
      const last = ITEMS.length - 1;
      const gap = (CB - 24 - HLP - y0 - sum(ih)) / (ITEMS.length - 1);
      let y = y0;
      ITEMS.forEach((it, i) => {
        if (it.hl) {
          y += 4;
          s.box({ x: x - 12, y: y - HLP, w: w + 24, h: ih[i] + 2 * HLP, fill: C.cardTint, r: 15 });
        } else if (i) s.hline(x, y - gap / 2, w);
        s.icon(it.ic, { x, y: y + (ih[i] - IC) / 2, size: IC, circle: it.c, color: C.white });
        const lh = measure(it.t.toUpperCase(), LW, 17, true, 1.1);
        s.text(it.t, { x: lx, y: y + (ih[i] - lh) / 2, w: LW, size: 17, bold: true, lh: 1.1, color: it.c, caps: true });
        const dh = measure(it.d, dw, 17);
        s.text(it.d, { x: dx, y: y + (ih[i] - dh) / 2, w: dw, size: 17, lh: 1.2, color: it.hl ? C.navy : C.blueText });
        y += ih[i] + (i < last ? gap : 0);
      });
    }

    // --- 3. Как делаем материал цитируемым ---
    {
      const c = COL[2];
      const x = c.x + PAD;
      const w = c.w - 2 * PAD;
      // частота — внизу карточки
      const IC = 48;
      const FL = 'Частота';
      const FV = '1 публикация / месяц';
      const FC = 'индексация → цитирование в AI → Positive Source Coverage → переходы / Search';
      const ftx = x + IC + 18;
      const ftw = x + w - ftx;
      const fh = 18 + 20 + 8 + 30 + 8 + measure(FC, ftw - 8, 17) + 18;
      const fy = CB - 20 - fh;
      s.box({ x: x - 8, y: fy, w: w + 16, h: fh, fill: C.cardTint, r: 15 });
      s.icon('tb:TbCalendar', { x: x + 4, y: fy + 18, size: IC, circle: C.blue, color: C.white });
      s.text(FL, { x: ftx, y: fy + 18, w: ftw, size: 17, bold: true, lh: 1.0, color: C.blue, caps: true });
      s.text(FV, { x: ftx, y: fy + 18 + 20 + 8, w: ftw, size: 26, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 20 });
      s.text(FC, { x: ftx, y: fy + 18 + 20 + 8 + 30 + 8, w: evenW(FC, ftw - 8, 17), size: 17, lh: 1.2, color: C.blueText });
      // правила
      const RULES = [
        ['tb:TbUser', 'Автор и квалификация специалиста'],
        ['tb:TbListDetails', 'Прямой ответ в начале материала + FAQ'],
        ['tb:TbLink', 'Ссылки на первоисточники и проверяемая фактология'],
        ['tb:TbWorld', 'Индексируемый, бессрочный URL'],
        ['tb:TbShieldCheck', 'Бренд и LGG связаны в корректном контексте'],
        ['tb:TbChartBar', 'Темы выбираем по слабым GEO/AEO-кластерам, а не по трафику площадки'],
      ];
      const RI = 40;
      const rtx = x + RI + 16;
      const rtw = x + w - rtx;
      const rh = RULES.map(([, t]) => Math.max(RI, measure(t, rtw, 18)));
      const gap = (fy - 20 - y0 - sum(rh)) / (RULES.length - 1);
      let y = y0;
      RULES.forEach(([ic, t], i) => {
        s.icon(ic, { x, y: y + (rh[i] - RI) / 2, size: RI, circle: C.orange, color: C.white });
        const th = measure(t, rtw, 18);
        s.text(t, { x: rtx, y: y + (rh[i] - th) / 2, w: rtw, size: 18, lh: 1.2, color: C.navy });
        y += rh[i] + gap;
      });
    }

    s.principle({ label: 'Принцип', icon: 'bulb',
      text: 'Внешняя публикация должна быть не рекламной единицей, а независимым экспертным источником, который помогает пользователю обосновать выбор и одновременно усиливает поисковый и AI-контур бренда' });
  },

  // ===================== 22. Paid Search =====================
  22: (d) => {
    const s = d.slide({
      title: 'Paid Search: от структуры спроса к покупке',
      subtitle: 'Search остаётся always-on конверсионным ядром: объединяем семантику по уровню намерения, даём алгоритмам достаточно данных для обучения и связываем поиск с ретаргетингом и e-pharm*',
    });
    const COL = [{ x: 58, w: 580 }, { x: 660, w: 580 }, { x: 1262, w: 600 }];
    const PAD = 28;
    const CB = BOT1;
    const y0 = colCards(s, COL, ['Структура спроса', 'Логика кампаний', 'Retargeting → покупка']);

    // --- 1. Структура спроса ---
    {
      const c = COL[0];
      const x = c.x + PAD;
      const w = c.w - 2 * PAD;
      s.text('Доли Search-сплита по категориям запросов', { x, y: y0 - 4, w, size: 16, lh: 1.0, color: MUTED_TXT });
      const SEG = [
        { v: 50, t: 'Бренд + транзакционные', ex: 'купить Нормобакт / цена / пробиотики для детей', c: C.blue },
        { v: 22, t: 'Категория', ex: 'микрофлора ребёнка / средства для кишечника', c: C.green },
        { v: 14, t: 'Симптоматика', ex: 'стул после антибиотиков / нарушение стула', c: C.purple },
        { v: 14, t: 'Конкуренты', ex: 'Энтерол / Линекс / другие бренды', c: C.orange },
      ];
      const pct = (v) => `${v}%`;
      const by = y0 + 24;
      const bh = 46;
      let bx = x;
      SEG.forEach((g, i) => {
        const gw = (w - 3 * 3) * g.v / 100;
        s.box({ x: bx, y: by, w: gw, h: bh, fill: g.c, r: i === 0 || i === SEG.length - 1 ? 10 : 0 });
        s.text(pct(g.v), { x: bx, y: by, w: gw, h: bh, size: 17, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
        bx += gw + 3;
      });
      // принцип сплита — внизу карточки
      const SUM = '**Принцип сплита:** ёмкость запросов + фактическая эффективность по CPA; доли определяются потенциалом и качеством спроса';
      const sw = w - 40;
      const sh = measureRich(SUM, sw, 18) + 32;
      const sy = CB - 20 - sh;
      s.box({ x: x - 8, y: sy, w: w + 16, h: sh, fill: C.cardTint, r: 15 });
      s.text(SUM, { x: x + 12, y: sy + 16, w: sw, size: 18, lh: 1.2, color: C.navy });
      // сегменты спроса
      const CHW = 72;
      const tx = x + CHW + 16;
      const tw = x + w - tx;
      const rh = SEG.map((g) => Math.max(40, 20 + 6 + measure(g.ex, tw, 17)));
      const top = by + bh + 26;
      const gap = (sy - 22 - top - sum(rh)) / (SEG.length - 1);
      let y = top;
      SEG.forEach((g, i) => {
        if (i) s.hline(tx, y - gap / 2, tw);
        s.box({ x, y: y + (rh[i] - 40) / 2, w: CHW, h: 40, fill: g.c, r: 10 });
        s.text(pct(g.v), { x, y: y + (rh[i] - 40) / 2, w: CHW, h: 40, size: 18, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
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
        { t: 'Объединяем бренд + транзакционные запросы', d: 'При малом объёме трафика единая кампания даёт автостратегиям больше данных → стабильнее обучение и управляемость', c: C.blue },
        { t: 'Разводим намерение по посадочным страницам', d: 'Транзакционный спрос ведём к аптеке; категория, симптомы и конкуренты — на сайт / релевантный контент (персо-LP / SEO-статьи)', c: C.green },
        { t: 'Оптимизируем по действию, а не клику', d: 'Основной сигнал: CR / CPA «Где купить / покупка» + качество визита. CPC / CTR — диагностические метрики', c: C.orange },
      ];
      const LOG = '**Брендовая видимость сохраняется внутри транзакционной кампании** — без прямой конкуренции с аптеками за тот же спрос';
      const IC = 46;
      const lw = w - IC - 18 - 8;
      const lh = Math.max(IC, measureRich(LOG, lw, 18)) + 32;
      const ly = CB - 20 - lh;
      s.box({ x: x - 8, y: ly, w: w + 16, h: lh, fill: C.cardTint, r: 15 });
      s.icon('tb:TbShieldCheck', { x: x + 6, y: ly + (lh - IC) / 2, size: IC, circle: C.blue, color: C.white });
      s.text(LOG, { x: x + 6 + IC + 18, y: ly + 16, w: lw - 6, h: lh - 32, size: 18, lh: 1.2, color: C.navy, valign: 'middle' });
      const BD = 40;
      const tx = x + BD + 18;
      const tw = x + w - tx;
      const ih = ITEMS.map((it) => measure(it.t, tw, 21, true, 1.1) + 10 + measure(it.d, tw, 17));
      const top = y0;
      const gap = (ly - 22 - top - sum(ih)) / (ITEMS.length - 1);
      let y = top;
      ITEMS.forEach((it, i) => {
        if (i) s.hline(tx, y - gap / 2, tw);
        s.badge({ x, y: y - 4, d: BD, n: i + 1, color: it.c, size: 19 });
        const th = s.text(it.t, { x: tx, y, w: tw, size: 21, bold: true, lh: 1.1, color: C.navy });
        s.text(it.d, { x: tx, y: y + th + 10, w: tw, size: 17, lh: 1.2, color: C.blueText });
        y += ih[i] + gap;
      });
    }

    // --- 3. Retargeting → покупка ---
    {
      const c = COL[2];
      const x = c.x + PAD;
      const w = c.w - 2 * PAD;
      // РСЯ 2027 — в подложке внизу карточки
      const RSY = [
        'Конкуренты + проблематика + категория + ретаргетинг → одна оптимизированная кампания',
        'Транзакционный сценарий сохраняем отдельно',
        'Алгоритм перераспределяет трафик туда, где конверсия эффективнее',
      ];
      const ch = sum(RSY.map((t) => Math.max(35, measure(t, w - 52, 17)))) + 12 * (RSY.length - 1);
      const head = 'РСЯ 2027: поддерживающий audience-layer';
      const hh = measure(head, w - 8, 20, true, 1.1);
      const rbh = 20 + hh + 16 + ch + 22;
      const ry = CB - 20 - rbh;
      s.box({ x: x - 8, y: ry, w: w + 16, h: rbh, fill: 'EEF7F2', r: 15 });
      s.text(head, { x: x + 8, y: ry + 20, w: w - 8, size: 20, bold: true, lh: 1.1, color: C.green });
      s.checks(RSY, { x: x + 8, y: ry + 20 + hh + 16, w: w - 16, size: 17, pitch: 'auto', gap: 12, color: C.green });
      // ретаргетинг через сестринские бренды — блоки равномерно над подложкой
      const RT = [
        { b: 'Боботик', t: 'Посетители сайта / контента → ретаргетинг в РСЯ, мамы с детьми 1–3', c: C.blue },
        { b: 'Динобутин', t: 'Релевантные ЖКТ-сегменты → matching occasion Нормобакта → повторный контакт', c: C.purple },
      ];
      const bhs = RT.map((r) => 18 + 32 + 14 + measure(r.t, w - 24, 19, true, 1.2) + 20);
      const rgap = Math.min(28, (ry - y0 - sum(bhs)) / 2);
      let y = y0 + Math.max(0, (ry - y0 - sum(bhs) - 2 * rgap) / 2);
      RT.forEach((r, i) => {
        const pw = Math.max(150, widthOf(r.b.toUpperCase(), 16, true) + 32);
        s.box({ x: x - 8, y, w: w + 16, h: bhs[i], fill: C.white, stroke: C.line, sw: 1.5, r: 15 });
        s.box({ x: x + 8, y: y + 18, w: pw, h: 32, fill: r.c, r: 10 });
        s.text(r.b, { x: x + 8, y: y + 18, w: pw, h: 32, size: 16, bold: true, lh: 1.0, color: C.white, caps: true, align: 'center', valign: 'middle' });
        s.text(r.t, { x: x + 8, y: y + 18 + 32 + 14, w: w - 24, size: 19, bold: true, lh: 1.2, color: C.navy });
        y += bhs[i] + rgap;
      });
    }

    s.principle({ label: 'KPI 2027', icon: 'tb:TbChartBar', text: 'CR / CPA «Где купить / покупка» + quality visits → Brand Search / e-pharm sales' });
    s.footnote('* e-pharm — карточки товара в онлайн-аптеках');
  },

  // ===================== 23. Digital support calendar 2027 =====================
  23: (d) => {
    const s = d.slide({ title: 'Digital support calendar 2027: flowchart' });

    // --- полоса KPI: бюджет со сплитом · медиа-KPI ---
    const KY = TOP;
    const KH = 146;
    const BW = 470;
    s.box({ x: 58, y: KY, w: BW, h: KH, fill: C.blue, r: 25 });
    s.text('Budget', { x: 88, y: KY + 24, w: 180, size: 18, bold: true, lh: 1.0, color: C.white, caps: true });
    s.text('10M', { x: 88, y: KY + 56, w: 170, size: 60, bold: true, lh: 1.0, color: C.white, fit: true, maxLines: 1, minSize: 44 });
    s.vline(270, KY + 24, KH - 48, C.white, 1.5);
    const sx = 292;
    const sw = 58 + BW - 28 - sx;
    s.text('Бюджетный сплит', { x: sx, y: KY + 24, w: sw, size: 15, bold: true, lh: 1.0, color: C.white, caps: true, fit: true, maxLines: 1, minSize: 12 });
    [['Digital media', '9,4M'], ['Tech cost', '600K']].forEach(([k, v], i) => {
      const y = KY + 62 + i * 32;
      s.text(k, { x: sx, y, w: sw - 80, size: 18, lh: 1.0, color: C.white });
      s.text(v, { x: sx + sw - 80, y, w: 80, size: 18, bold: true, lh: 1.0, color: C.white, align: 'right' });
    });
    // медиа-KPI
    const KX = 58 + BW + 22;
    const KW = 1862 - KX;
    s.card({ x: KX, y: KY, w: KW, h: KH });
    s.text('Media KPIs', { x: KX + 26, y: KY + 24, w: 300, size: 17, bold: true, lh: 1.0, color: C.crimson });
    const KPI = [['17,2M', 'Impressions'], ['4,9M', 'Tech. reach'], ['1,8M', 'Unique reach'], ['200 тыс.', 'Clicks'], ['31 тыс.', 'Conversions\n«cookie-banner»']];
    const k0 = KX + 26;
    const wts = [1, 1, 1, 1.05, 1.2];
    const kws = wts.map((k) => k * (KW - 40) / sum(wts));
    const ks = commonSize(KPI.map(([v], i) => [v, kws[i] - 18]), 36, 22);
    let kx = k0;
    KPI.forEach(([v, t], i) => {
      if (i) s.vline(kx - 10, KY + 58, KH - 80);
      s.text(v, { x: kx, y: KY + 54, w: kws[i] - 18, size: ks, bold: true, lh: 1.0, color: C.navy });
      s.text(t, { x: kx, y: KY + 60 + ks, w: kws[i] - 18, h: 40, size: 15, lh: 1.15, color: C.blueText, fit: true, maxLines: 2, minSize: 13 });
      kx += kws[i];
    });

    // --- календарь: инфо-колонки + 12 месяцев ---
    const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    // периоды в месяцах [от, до) — по заливке ячеек исходника: светлая — активный период, яркая — спринт / усиление
    const ALL = [[0, 12]];
    const ROWS = [
      { ch: 'Retail Media / Data Programmatic', sup: 'TBD после тестов Q4 2026', fmt: 'Banners with personalization', bud: '1,8M', sob: '19%', sprint: [[0, 3], [8, 12]] },
      { ch: 'Внешние публикации', sup: 'Мед. и экспертные медиа / родительские площадки / аптеки', fmt: 'Content', bud: '950K', sob: '10%', sprint: [[1, 3], [4, 5], [7, 8], [9, 11]] },
      { ch: 'ORM', sup: 'Reviews / forums\nSERP / e-pharm cards', fmt: 'Отзывы, обзоры, Q&A, дискуссии — occasion-based', bud: '1,5M', sob: '16%', act: ALL },
      { ch: 'GEO / AEO', sup: 'GEO / AI-answers', fmt: 'GEO-оптимизация под AI-ответы', bud: '1,9M', sob: '20%', act: ALL },
      { ch: 'Paid Search', sup: 'Yandex Direct', fmt: 'Text + image', bud: '3,2M', sob: '35%', act: ALL, sprint: [[5, 8]] },
    ];
    const STAGES = [['CHOICE & CONVERSION', STG.CHOICE, 0, 1], ['CAPTURE DEMAND & VISIBILITY', STG.CAPTURE, 1, 4]];
    const X0 = 58;
    const CW = { st: 156, ch: 210, sup: 250, fmt: 250, bud: 76, sob: 70 };
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
    // этапы — цветами этапов деки (слайд 20)
    STAGES.forEach(([t, col, i0, n]) => {
      const yy = ys[i0] + 4;
      const hh = ys[i0 + n - 1] + rowH[i0 + n - 1] - ys[i0] - 8;
      s.box({ x: X0 + 3, y: yy, w: CW.st - 10, h: hh, fill: col, r: 10 });
      s.text(t, { x: X0 + 14, y: yy, w: CW.st - 30, h: hh, size: 16, bold: true, lh: 1.1, color: C.white, valign: 'middle', fit: true, maxLines: 4, minSize: 12 });
    });
    // итог
    s.box({ x: X0, y: yEnd, w: 1862 - X0, h: TH, fill: C.navy, r: 0 });
    s.text('TOTAL', { x: cx.ch + PADX, y: yEnd, w: CW.ch, h: TH, size: 16, bold: true, lh: 1.0, color: C.white, valign: 'middle' });
    s.text('9,4M', { x: cx.bud - 8, y: yEnd, w: CW.bud + 16, h: TH, size: 16, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
    s.text('100%', { x: cx.sob, y: yEnd, w: CW.sob, h: TH, size: 15, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });

    calLegend(s, [['A6CDEE', 'активный период'], [C.crimson, 'спринт / усиление']]);
    s.footnote('Бюджет до НДС, включая АК/РС', { w: 900 });
  },

  // ===================== 24. Итог: от конверсии спроса к более раннему влиянию на выбор =====================
  24: (d) => {
    const s = d.slide({ title: 'Нормобакт 2027', subtitle: 'От эффективной конверсии спроса — к более раннему влиянию на выбор vs 2026' });

    // --- три плитки: бизнес-цель, инвестиции, масштаб digital ---
    const cols = [{ x: 58, w: 587 }, { x: 667, w: 586 }, { x: 1275, w: 587 }];
    const TH = 136;
    const TILES = [
      { lab: 'Бизнес-цель 2027', v: '430 млн ₽', sub: '745 тыс. упаковок', color: C.crimson },
      { lab: 'Инвестиции', v: '9 → 10 млн ₽', sub: '+1 млн ₽ / +11% к 2026', color: C.blue },
      { lab: 'Масштаб digital', v: '1,8 млн UU', sub: 'показы 17,2 млн', color: C.navy2 },
    ];
    const tvs = commonSize(TILES.map((t, i) => [t.v, cols[i].w - 56]), 48, 32);
    TILES.forEach((t, i) => {
      const { x, w } = cols[i];
      s.box({ x, y: TOP, w, h: TH, fill: t.color, r: 25 });
      s.text(t.lab, { x: x + 30, y: TOP + 22, w: w - 60, size: 17, bold: true, lh: 1.0, color: C.white, caps: true, fit: true, maxLines: 1, minSize: 13 });
      s.text(t.v, { x: x + 30, y: TOP + 45, w: w - 60, size: tvs, bold: true, lh: 1.0, color: C.white });
      s.text(t.sub, { x: x + 30, y: TOP + 101, w: w - 60, size: 18, bold: true, lh: 1.0, color: C.white, fit: true, maxLines: 1, minSize: 14 });
    });

    // --- нижняя часть: 2026 → 2027 (над плашкой) ---
    const T26 = 'Paid Search + ORM эффективно закрывают уже сформированный спрос';
    const T27 = 'Сигнал потребности → релевантная ситуация → **LGG как доказательство** → Retail / e-pharm → покупка';
    const L26 = { x: 58, w: 470 };
    const L27 = { x: 58 + 470 + 64, w: 1862 - (58 + 470 + 64) };
    const g27w = L27.w - 56;
    const sbH = Math.max(28 + 22 + 10 + measure(T26, L26.w - 56, 18) + 24, 28 + 22 + 10 + measureRich(T27, g27w, 18) + 24);
    const SBY = BOT1 - sbH;
    const SLY = SBY - 40;

    // --- середина: как работает Comprehensive · три новые возможности ---
    const MY = TOP + TH + 22;
    const MH = SLY - 24 - MY;
    const L = { x: 58, w: 1010 };
    s.card({ x: L.x, y: MY, w: L.w, h: MH });
    const lx = L.x + 32;
    const lw = L.w - 64;
    s.label('Как работает Comprehensive в 2027', { x: lx, y: MY + 26, w: lw, size: 21, color: C.blue });
    const GH = 46;
    const ay = MY + 66;
    // Always-on = слой CAPTURE DEMAND & VISIBILITY (Search / ORM / GEO / публикации) — зелёный, как на слайдах 20 и 23
    s.box({ x: lx, y: ay, w: lw, h: GH, fill: STG.CAPTURE, r: 12 });
    s.text('Always-on: Search · ORM · GEO/AEO · экспертные публикации', { x: lx + 16, y: ay, w: lw - 32, h: GH, size: 18, bold: true, lh: 1.0, color: C.white, caps: true, align: 'center', valign: 'middle', fit: true, maxLines: 1, minSize: 14 });
    const py = ay + GH + 8;
    const gg = 8;
    // фазы — цвета как в исходнике
    const PH = [['Q1 · test Retail/Data', C.crimson], ['Gate · media & sales', C.orange], ['Лето · Paid Search boost', C.blue], ['Q4 · scale', C.purple]];
    const PHH = 56;
    const pw = (lw - 3 * gg) / 4;
    PH.forEach(([t, col], i) => {
      const px = lx + i * (pw + gg);
      s.box({ x: px, y: py, w: pw, h: PHH, fill: col, r: 12 });
      s.text(t, { x: px + 10, y: py, w: pw - 20, h: PHH, size: 16, bold: true, lh: 1.05, color: C.white, caps: true, align: 'center', valign: 'middle', fit: true, maxLines: 2, minSize: 13 });
    });
    const NOTES = [
      { t: 'AON защищает и конвертирует сформированный спрос, **приоритет инвестиций №1**.', c: STG.CAPTURE },
      { t: 'Retail/Data тестируем на тёплой аудитории → Gate по post-click / CR / e-pharm. Летом усиливаем Search + контент под ротавирус / отпуск / аптечку; осенью масштабируем подтверждённые в Q1 сигналы.', c: C.crimson },
    ];
    const ntw = lw - 22;
    const nh = NOTES.map((n) => measureRich(n.t, ntw, 18));
    const nTop = py + PHH + 22;
    const free = MY + MH - 26 - nTop - sum(nh);
    const ngap = Math.max(14, Math.min(28, free / 2));
    let ny = nTop + Math.max(0, (free - ngap) / 2);
    NOTES.forEach((n, i) => {
      s.box({ x: lx, y: ny, w: 6, h: nh[i], fill: n.c, r: 0 });
      s.text(n.t, { x: lx + 22, y: ny, w: ntw, size: 18, lh: 1.2, color: C.navy });
      ny += nh[i] + ngap;
    });

    const R = { x: L.x + L.w + 22, w: 1862 - (L.x + L.w + 22) };
    s.card({ x: R.x, y: MY, w: R.w, h: MH });
    const rx = R.x + 32;
    const rw = R.w - 64;
    s.label('Три новые возможности для бренда', { x: rx, y: MY + 26, w: rw, size: 21, color: C.blue });
    const OP = [
      { st: 'Ранние сигналы Retail/Data', t: 'Search / контент / retail-data → раньше находим мам с признаками потребности', c: C.crimson },
      { st: 'Proof & AI visibility + LGG', t: 'Ситуация → роль продукта → LGG как RTB; экспертный контент усиливает GEO/AEO + ORM', c: C.blue },
      { st: 'Сокращаем путь до покупки', t: 'Тёплая аудитория → PDP / e-pharm → покупка', c: C.purple },
    ];
    const bd = 46;
    const otx = rx + bd + 18;
    const otw = rx + rw - otx;
    const oh = OP.map((o) => Math.max(bd, measure(o.st.toUpperCase(), otw, 19, true, 1.05) + 6 + measure(o.t, otw, 17)));
    const oy0 = MY + 72;
    const ogap = (MY + MH - 24 - oy0 - sum(oh)) / (OP.length - 1);
    let oy = oy0;
    OP.forEach((o, i) => {
      if (i) s.hline(otx, oy - ogap / 2, rx + rw - otx);
      s.badge({ x: rx, y: oy + (oh[i] - bd) / 2, d: bd, n: `0${i + 1}`, color: o.c, size: 18 });
      const sth = measure(o.st.toUpperCase(), otw, 19, true, 1.05);
      const tth = measure(o.t, otw, 17);
      const top = oy + (oh[i] - sth - 6 - tth) / 2;
      s.text(o.st, { x: otx, y: top, w: otw, size: 19, bold: true, lh: 1.05, color: C.navy, caps: true });
      s.text(o.t, { x: otx, y: top + sth + 6, w: otw, size: 17, lh: 1.2, color: C.blueText });
      oy += oh[i] + ogap;
    });

    // --- как инвестиции переводят сильную конверсионную базу в рост: 2026 → 2027 ---
    s.label('Как инвестиции переводят сильную конверсионную базу в рост', { x: 58, y: SLY, w: 1804, size: 21, color: C.blue });
    s.card({ x: L26.x, y: SBY, w: L26.w, h: sbH });
    s.text('2026 · сильная конверсия', { x: L26.x + 28, y: SBY + 26, w: L26.w - 56, size: 18, bold: true, lh: 1.0, color: MUTED_TXT, caps: true });
    s.text(T26, { x: L26.x + 28, y: SBY + 26 + 22 + 10, w: L26.w - 56, size: 18, lh: 1.2, color: C.navy });
    s.arrow({ dir: 'right', x: L26.x + L26.w + 12, y: SBY + sbH / 2, len: 40, head: 34, headLen: 18, stem: 10, color: C.crimson });
    s.card({ x: L27.x, y: SBY, w: L27.w, h: sbH, tint: true });
    s.text('2027 · от раннего сигнала потребности к покупке', { x: L27.x + 28, y: SBY + 26, w: g27w, size: 18, bold: true, lh: 1.0, color: C.blue, caps: true });
    s.text(T27, { x: L27.x + 28, y: SBY + 26 + 22 + 10, w: g27w, size: 18, lh: 1.2, color: C.navy });

    s.formula({ text: 'Найти сигнал → дать релевантность → доказать выбор → сократить путь к покупке', color: C.crimson, size: 24 });
  },
};
