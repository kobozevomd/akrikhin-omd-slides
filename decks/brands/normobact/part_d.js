// Нормобакт L · стратегия 2027 — часть D: слайды исходника 16–20.
// 16 — стратегический приоритет 2027: три факта + вывод, причинно-следственная цепочка 1–5, формула (в исходнике — картинка);
// 17 — кого ищем: сигнал / источник / как используем / статус / роль в пути + правило (картинка);
// 18 — коммуникация 2027: три ситуации → LGG как доказательный слой → раскрытие LGG по каналам (картинка);
// 19 — стратегия 2027: обязательное конверсионное ядро → усиление выбора ближе к покупке + фокус (картинка);
// 20 — архитектура кампании 2027 vs 2026 (живые фигуры; подача — как Bobotic 21, Azelik 39, Clindovit 12).
// Слайды-картинки: ориентир — итоговый рендер исходника (видимый текст картинки), а не живой текст под ней.
const { C, IN, PT, columns, countLines, textWidth, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT
const N = require('./common');                            // SRC, MEDIA, CROPS

const TOP = V.TOP;   // 221 — верх контента
const BOT = V.BOT;   // 1005 — низ контента без плашки
const CB = 905;      // низ контента над плашкой
const X0 = 58;
const X1 = 1862;
const WW = X1 - X0;
const MUTED_INK = '7A93B3';   // «фоновая» цифра категории рядом с цифрой бренда

// ---------- Локальные хелперы ----------
// Строка так, как её увидит слайд (перевод + типографика), без разметки
const view = (t) => typo(tr(String(t))).replace(/\*\*|\[\[|\]\]/g, '');
// Высота текста так же, как её оценивает s.text
const measure = (t, w, size = 18, bold = false, lh = 1.2) => Math.round(countLines(view(t), size, w, bold) * size * lh);
const widthOf = (t, size, bold = false) => Math.ceil(textWidth(view(t), size, bold));
// Ширина блока, при которой текст занимает столько же строк, но строки ровнее (без висящего последнего слова)
const evenW = (t, w, size, bold = false) => {
  const lines = (ww) => countLines(view(t), size, ww, bold);
  const n = lines(w);
  if (n < 2) return w;
  let lo = w * 0.4;
  let hi = w;
  while (hi - lo > 1) { const m = (lo + hi) / 2; if (lines(m) <= n) hi = m; else lo = m; }
  return Math.min(w, Math.ceil(hi * 1.04) + 6);   // запас на разницу переносов PowerPoint / LibreOffice
};
// Смешение цвета с белым: k = 0 — белый, 1 — исходный цвет
function tintOf(hex, k) {
  const c = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return c.map((v) => Math.round(255 + (v - 255) * k).toString(16).padStart(2, '0')).join('').toUpperCase();
}
// Цвет текста для акцента: голубой и оранжевый на белом слишком светлые — для текста берём более тёмные
const ink = (c) => (c === C.cyan ? C.teal : c === C.orange ? 'D9661A' : c);

// Ярлык статуса (NEW / SPECIFIED) — как в деках серии
function tag(s, t, x, y, { size = 13, h = 24, color = C.crimson } = {}) {
  const w = widthOf(t, size, true) + 20;
  s.box({ x, y, w, h, fill: color, r: h / 2 });
  s.text(t, { x, y, w, h, size, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
  return w;
}

// Список каналов: строка + ярлык статуса сразу после неё
function chanList(s, items, { x, y, w, size = 17, pitch = 24 }) {
  items.forEach((it, i) => {
    const [t, tg] = Array.isArray(it) ? it : [it];
    const yy = y + i * pitch;
    const tagW = tg ? widthOf(tg, 13, true) + 20 : 0;
    const maxW = w - (tg ? tagW + 10 : 0);
    s.text(t, { x, y: yy, w: maxW, size, color: C.navy, fit: true, maxLines: 1, minSize: 14 });
    if (tg) tag(s, tg, x + Math.min(widthOf(t, size), maxW) + 10, yy + Math.round((size * 1.2 - 24) / 2));
  });
}

// Пустая ячейка (слоя в этом году нет): пунктирная рамка без заливки
function emptyCell(s, { x, y, w, h }) {
  s.s.addShape(s.shapes.roundRect, {
    x: IN(x), y: IN(y), w: IN(w), h: IN(h), fill: { type: 'none' },
    line: { color: C.line, width: PT(2.5), dashType: 'dash' }, rectRadius: IN(25),
  });
}

module.exports = {
  // =====================================================================
  // 16 · Стратегический приоритет 2027 (картинка → живой текст)
  // =====================================================================
  16: (d) => {
    const s = d.slide({
      title: 'Стратегический приоритет 2027: раньше входить в момент потребности и сокращать путь от интереса до покупки',
      subtitle: 'Не инвестируем в широкий охват: приоритет — мамы, уже демонстрирующие признаки потребности',
    });

    // ---------- три факта + вывод ----------
    const FY = TOP;
    const FH = 322;
    const cols = columns(4, { gap: 22 });
    const PAD = 28;
    const LBL = 20;                       // кегль КАПС-метки факта
    const lblH = Math.max(...['Спрос бренда растёт медленнее категории', 'Ближе к покупке бренд сильнее', 'Конверсионное ядро работает']
      .map((t) => measure(t.toUpperCase(), cols[0].w - PAD * 2, LBL, true, 1.1)));

    // пара «бренд vs категория»: две большие цифры с подписями
    const pair = (c, color, label, a, aCap, b, bCap, note) => {
      s.card({ x: c.x, y: FY, w: c.w, h: FH, fill: tintOf(color, 0.04), stroke: tintOf(color, 0.35) });
      const x = c.x + PAD;
      const w = c.w - PAD * 2;
      s.text(label.toUpperCase(), { x, y: FY + 24, w, size: LBL, bold: true, lh: 1.1, color: ink(color) });
      const NS = 48;
      const nh = measure(note, w, 20, false, 1.2);
      const noteY = FY + FH - 26 - nh;
      const top = FY + 24 + lblH;
      const ny = Math.round(top + (noteY - top - (NS + 4 + 22)) / 2);
      const aw = widthOf(a, NS, true) + 4;
      s.text(a, { x, y: ny, w: aw, size: NS, bold: true, lh: 1.0, color: ink(color) });
      s.text(aCap, { x, y: ny + NS + 4, w: Math.max(aw, 150), size: 16, lh: 1.15, color: C.navy, fit: true, maxLines: 1, minSize: 13 });
      const vx = x + Math.max(aw, 150) + 8;
      s.text('vs', { x: vx, y: ny + 14, w: 34, size: 20, bold: true, lh: 1.0, color: C.blueText, align: 'center' });
      const bx = vx + 34 + 8;
      s.text(b, { x: bx, y: ny, w: x + w - bx, size: NS, bold: true, lh: 1.0, color: MUTED_INK });
      s.text(bCap, { x: bx, y: ny + NS + 4, w: x + w - bx, size: 16, lh: 1.15, color: C.navy, fit: true, maxLines: 1, minSize: 13 });
      s.text(note, { x, y: noteY, w, size: 20, lh: 1.2, color: C.navy });
    };
    pair(cols[0], C.crimson, 'Спрос бренда растёт медленнее категории', '+10%', 'Brand Search', '+25%', 'категория',
      '→ часть возникающего спроса бренд забирает слишком поздно');
    pair(cols[1], C.blue, 'Ближе к покупке бренд сильнее', '+8%', 'Нормобакт на Ozon', '+2%', 'категория',
      '→ в среде высокой готовности бренд конкурентоспособен');

    // конверсионное ядро: три цифры столбиком
    {
      const c = cols[2];
      const color = C.green;
      s.card({ x: c.x, y: FY, w: c.w, h: FH, fill: tintOf(color, 0.04), stroke: tintOf(color, 0.35) });
      const x = c.x + PAD;
      const w = c.w - PAD * 2;
      s.text('Конверсионное ядро работает'.toUpperCase(), { x, y: FY + 24, w, size: LBL, bold: true, lh: 1.1, color: ink(color) });
      const items = [['91 тыс.', 'кликов'], ['78 тыс.', 'quality visits'], ['4,6', 'ORM']];
      const NS = 34;
      const nw = Math.max(...items.map(([v]) => widthOf(v, NS, true))) + 14;
      const y0 = FY + 24 + lblH + 22;
      const step = Math.floor((FY + FH - 18 - y0) / items.length);
      items.forEach(([v, cap], i) => {
        const y = y0 + i * step;
        s.text(v, { x, y, w: nw, size: NS, bold: true, lh: 1.0, color: ink(color) });
        s.text(cap, { x: x + nw, y: y + NS - 22, w: w - nw, size: 19, lh: 1.1, color: C.navy, fit: true, maxLines: 1, minSize: 15 });
      });
    }

    // вывод — главная мысль слайда, акцентом
    {
      const c = cols[3];
      s.box({ x: c.x, y: FY, w: c.w, h: FH, fill: C.crimson, r: 25 });
      const x = c.x + PAD;
      const w = c.w - PAD * 2;
      s.icon('bulb', { x, y: FY + 22, size: 40, color: C.white });
      s.text('Вывод'.toUpperCase(), { x: x + 52, y: FY + 30, w: w - 52, size: LBL, bold: true, lh: 1.1, color: C.white });
      const t = 'Проблема не в способности конвертировать — проблема в позднем входе в путь выбора';
      const ty = FY + 22 + 40 + 16;
      s.text(t, { x, y: ty, w, h: FY + FH - 22 - ty, size: 25, bold: true, lh: 1.2, color: C.white, fit: true, minSize: 20, valign: 'middle' });
    }

    // ---------- причинно-следственная цепочка 1–5 ----------
    const HY = FY + FH + 30;
    s.text('Единая причинно-следственная цепочка стратегии', { x: X0, y: HY, w: WW, size: 25, bold: true, lh: 1.0, color: C.navy });
    const STEPS = [
      { color: C.crimson, title: 'Бизнес-проблема', text: 'категорийный спрос возникает быстрее, чем бренд успевает его забрать' },
      { color: C.blue, title: 'Тёплый потребитель', text: 'мама ребёнка 1–10 лет, уже демонстрирующая признаки потребности' },
      { color: C.purple, title: 'Сигналы потребности', text: 'поисковые запросы / контент / детские покупки / корзины в retail media' },
      { color: C.orange, title: 'Релевантное сообщение', text: 'ситуация → роль Нормобакта → LGG как proof' },
      { color: C.green, title: 'Кратчайший путь', text: 'Paid Search / retail media → PDP / e-pharm → покупка' },
    ];
    const SY = HY + 25 + 22;
    const SH = CB - SY;
    const CHV = 30;
    const SW = (WW - CHV * 4) / 5;
    const SP = 22;
    const BD = 46;
    const TS = 20;
    const tw = SW - SP * 2 - BD - 12;
    const titleH = Math.max(BD, ...STEPS.map((st) => measure(st.title.toUpperCase(), tw, TS, true, 1.1)));
    STEPS.forEach((st, i) => {
      const x = X0 + i * (SW + CHV);
      s.card({ x, y: SY, w: SW, h: SH, fill: tintOf(st.color, 0.04), stroke: tintOf(st.color, 0.35) });
      s.box({ x: x + SP, y: SY + SP + (titleH - BD) / 2, w: BD, h: BD, fill: st.color, r: 12 });
      s.text(String(i + 1), { x: x + SP, y: SY + SP + (titleH - BD) / 2, w: BD, h: BD, size: 24, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
      const th = measure(st.title.toUpperCase(), tw, TS, true, 1.1);
      s.text(st.title.toUpperCase(), { x: x + SP + BD + 12, y: SY + SP + (titleH - th) / 2, w: tw, size: TS, bold: true, lh: 1.1, color: ink(st.color) });
      const ly = SY + SP + titleH + 16;
      s.hline(x + SP, ly, SW - SP * 2, tintOf(st.color, 0.3));
      s.text(st.text, { x: x + SP, y: ly + 18, w: SW - SP * 2, size: 21, lh: 1.25, color: C.navy });
      if (i < 4) s.chevron({ cx: x + SW + CHV / 2, cy: SY + SH / 2, w: 14, h: 22, dir: 'right', color: C.navy });
    });

    s.formula({ text: 'Формула: сигнал потребности → релевантная ситуация → LGG как доказательный слой → кратчайший путь до покупки', w: WW, x: X0 });
  },

  // =====================================================================
  // 17 · Кого именно ищем: аудитория с признаками потребности (картинка → живой текст)
  // =====================================================================
  17: (d) => {
    const s = d.slide({
      title: 'Кого именно ищем: аудитория с признаками потребности',
      subtitle: 'ЦА 2027: мамы детей 1–10 лет. Сигналы используются только там, где есть понятный источник данных, канал активации и статус доступности',
    });
    const NOW = { color: C.blue, text: 'Доступен сейчас' };
    const TEST = { color: C.orange, text: 'Тест / валидация Q4\u00a02026' };
    const AFTER = { color: C.green, text: 'После валидации теста Q4\u00a02026' };
    const ROWS = [
      ['Поисковая и контекстная активность', 'Yandex / site search / intent', 'Paid Search, РСЯ, персонализированные LP', NOW, 'перехват уже сформированного интереса'],
      ['Потребление релевантного контента', 'AI clusters / contextual signals', 'AI Programmatic', NOW, 'ранний признак проблемы / интереса'],
      ['Покупки в аптечных и retail-экосистемах', 'Retailer / e-pharm 1P data', 'Retail Media → PDP / карточка товара', TEST, 'максимально близко к покупке'],
      ['Покупки детских товаров', 'Детский мир / PIM MEDIA', 'Retail-data activation / audience enrichment', TEST, 'проверка качества теплой аудитории'],
      ['Взаимодействие с карточками препаратов и аптечным инвентарём', 'E-pharm / retail inventory', 'Ретаргетинг / direct-to-PDP / персонализированный путь', AFTER, 'сокращение пути от интереса до действия'],
    ];
    const HEAD = ['Сигнал', 'Источник', 'Как используем', 'Статус', 'Роль в пути'];
    const GAP = 14;
    const CW = [380, 330, 400, 316, 0];
    CW[4] = WW - CW.slice(0, 4).reduce((a, b) => a + b, 0) - GAP * 4;
    const CX = CW.map((_, i) => X0 + CW.slice(0, i).reduce((a, b) => a + b, 0) + GAP * i);

    const PH = 54;
    HEAD.forEach((h, i) => s.pill(h, { x: CX[i], y: TOP, w: CW[i], h: PH, size: 20 }));

    const RG = 12;
    const RY0 = TOP + PH + 14;
    const RH = Math.floor((CB - RY0 - RG * (ROWS.length - 1)) / ROWS.length);
    const PADX = 22;
    ROWS.forEach((r, k) => {
      const y = RY0 + k * (RH + RG);
      r.forEach((cell, i) => {
        const x = CX[i];
        const w = CW[i];
        if (i === 3) {
          // статус — цветная ячейка с точкой
          s.box({ x, y, w, h: RH, fill: tintOf(cell.color, 0.12), stroke: tintOf(cell.color, 0.45), sw: 1.5, r: 15 });
          s.circle({ x: x + PADX, y: y + RH / 2 - 8, d: 16, fill: cell.color });
          const tx = x + PADX + 16 + 14;
          s.text(cell.text.toUpperCase(), { x: tx, y, w: x + w - PADX + 6 - tx, h: RH, size: 17, bold: true, lh: 1.15, color: C.navy, valign: 'middle', fit: true, maxLines: 2, minSize: 14 });
          return;
        }
        s.box({ x, y, w, h: RH, fill: i === 0 ? C.cardTint : C.white, stroke: C.line, sw: 1.5, r: 15 });
        s.text(cell, { x: x + PADX, y, w: w - PADX * 2, h: RH, size: i === 0 ? 19 : 18, bold: i === 0, lh: 1.2,
          color: C.navy, valign: 'middle', fit: true, maxLines: 3, minSize: 16 });
      });
    });

    s.principle({ label: 'Правило', icon: 'checklist', x: X0, w: WW,
      text: 'data-сигнал ≠ аудитория сам по себе. **Сигнал становится рабочим только после проверки media / post-click / CR.**' });
  },

  // =====================================================================
  // 18 · Коммуникация 2027: сначала ситуация, затем LGG (картинка → живой текст)
  // =====================================================================
  18: (d) => {
    const s = d.slide({
      title: 'Коммуникация 2027: сначала ситуация, затем LGG как доказательство доверия',
      subtitle: 'Потребитель выбирает решение своей ситуации, а не штамм. Поэтому LGG усиливает выбор Нормобакта, но не заменяет problem-based коммуникацию',
    });
    const cols = columns(3, { gap: 22 });

    // ---------- три ситуации ----------
    const SIT = [
      { color: C.green, icon: 'tb:TbPill', title: 'Антибиотики', sub: 'На фоне / после курса',
        text: 'Поддержка микрофлоры ребёнка в знакомом сценарии восстановления', quote: '«После антибиотиков — забота о микрофлоре»' },
      { color: C.crimson, icon: 'tb:TbVirus', title: 'ОКИ / ротавирус', sub: 'Острый период / восстановление',
        text: 'Понятная роль продукта в момент повышенной потребности', quote: '«Помощь желудочно-кишечному тракту в период болезни»' },
      { color: C.blue, icon: 'tb:TbSalad', title: 'Смена питания / дискомфорт', sub: 'Рацион / поездки / нестабильный стул',
        text: 'Релевантное объяснение реакции ЖКТ и поддержки микрофлоры', quote: '«Комфорт животика каждый день и в новых условиях»' },
    ];
    const SY = TOP;
    const SH = 300;
    const PAD = 26;
    const IC = 60;
    const tw = cols[0].w - PAD * 2 - IC - 18;
    const headH = Math.max(...SIT.map((t) => measure(t.title.toUpperCase(), tw, 21, true, 1.1) + 6 + measure(t.sub, tw, 18, true, 1.15)));
    const QH = 82;
    SIT.forEach((t, i) => {
      const c = cols[i];
      const x = c.x + PAD;
      const w = c.w - PAD * 2;
      s.card({ x: c.x, y: SY, w: c.w, h: SH, fill: tintOf(t.color, 0.04), stroke: tintOf(t.color, 0.35) });
      s.icon(t.icon, { x, y: SY + PAD + (headH - IC) / 2, size: IC, circle: t.color });
      const th = measure(t.title.toUpperCase(), tw, 21, true, 1.1);
      const hy = SY + PAD + (headH - th - 6 - measure(t.sub, tw, 18, true, 1.15)) / 2;
      s.text(t.title.toUpperCase(), { x: x + IC + 18, y: hy, w: tw, size: 21, bold: true, lh: 1.1, color: ink(t.color) });
      s.text(t.sub, { x: x + IC + 18, y: hy + th + 6, w: tw, size: 18, bold: true, lh: 1.15, color: C.navy });
      const ty = SY + PAD + headH + 14;
      s.text(t.text, { x, y: ty, w, size: 20, lh: 1.25, color: C.navy });
      const qy = SY + SH - PAD + 6 - QH;
      s.box({ x: x - 6, y: qy, w: w + 12, h: QH, fill: tintOf(t.color, 0.12), r: 18 });
      const qw = evenW(t.quote, w - 20, 19, true);
      s.text(t.quote, { x: x + 10 + Math.round((w - 20 - qw) / 2), y: qy, w: qw, h: QH, size: 19, bold: true, lh: 1.2, color: ink(t.color), align: 'center', valign: 'middle', fit: true, minSize: 16 });
    });

    // ---------- второй уровень: LGG ----------
    const LY0 = SY + SH + 12;
    const lvl = '↓  Второй уровень  ↓';
    s.text(lvl.toUpperCase(), { x: X0, y: LY0, w: WW, size: 20, bold: true, lh: 1.0, color: C.purple, align: 'center' });
    const LY = LY0 + 20 + 12;
    const LH = 164;
    s.card({ x: X0, y: LY, w: WW, h: LH, fill: tintOf(C.purple, 0.07), stroke: tintOf(C.purple, 0.45) });
    const LD = 104;
    s.circle({ x: X0 + 34, y: LY + (LH - LD) / 2, d: LD, fill: C.purple });
    s.text('LGG', { x: X0 + 34, y: LY + (LH - LD) / 2, w: LD, h: LD, size: 32, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
    const LTX = X0 + 34 + LD + 30;
    const LTW = 400;
    s.text('LGG = доказательный слой', { x: LTX, y: LY, w: LTW, h: LH, size: 32, bold: true, lh: 1.1, color: C.purple, valign: 'middle', fit: true, maxLines: 2, minSize: 26 });
    const VX = LTX + LTW + 30;
    s.vline(VX, LY + 28, LH - 56, tintOf(C.purple, 0.4), 2);
    s.text('Изученность и качество LGG помогают ответить на вопрос «почему Нормобакту можно доверять» после того, как пользователь уже узнал свою ситуацию и понял роль продукта.',
      { x: VX + 32, y: LY, w: X1 - 36 - VX - 32, h: LH, size: 21, lh: 1.25, color: C.navy, valign: 'middle', fit: true, minSize: 18 });

    // ---------- раскрытие LGG по каналам ----------
    const HY = LY + LH + 26;
    s.text('Как раскрываем LGG по каналам', { x: X0, y: HY, w: WW, size: 24, bold: true, lh: 1.0, color: C.navy });
    const CY = HY + 24 + 16;
    const CH = BOT - CY;
    const CHN = [
      { color: C.blue, icon: 'tb:TbSearch', title: 'Paid Search / Retail Media', text: 'Короткий доказательный акцент без превращения LGG в hero-message' },
      { color: C.purple, icon: 'tb:TbDeviceLaptop', title: 'Персо-LP / сайт', text: 'Более глубокое объяснение: роль продукта → LGG → FAQ / источники' },
      { color: C.green, icon: 'tb:TbFileText', title: 'Внешние публикации', text: 'Максимальная доказательность: экспертные статьи, первоисточники, изученность штамма' },
    ];
    const CI = 76;
    CHN.forEach((t, i) => {
      const c = cols[i];
      s.card({ x: c.x, y: CY, w: c.w, h: CH, fill: tintOf(t.color, 0.04), stroke: tintOf(t.color, 0.35) });
      const x = c.x + PAD;
      s.icon(t.icon, { x, y: CY + (CH - CI) / 2, size: CI, circle: t.color });
      const tx = x + CI + 20;
      const w = c.x + c.w - PAD - tx;
      const th = measure(t.title.toUpperCase(), w, 22, true, 1.1);
      const bh = measure(t.text, w, 20, false, 1.25);
      const y = CY + (CH - th - 10 - bh) / 2;
      s.text(t.title.toUpperCase(), { x: tx, y, w, size: 22, bold: true, lh: 1.1, color: ink(t.color) });
      s.text(t.text, { x: tx, y: y + th + 10, w, size: 20, lh: 1.25, color: C.navy });
    });
  },

  // =====================================================================
  // 19 · Стратегия 2027: ядро → усиление выбора (картинка → живой текст)
  // =====================================================================
  19: (d) => {
    const s = d.slide({
      title: 'Стратегия 2027: сначала защищаем и конвертируем сформированный спрос, затем усиливаем выбор ближе к покупке',
    });
    const GAPC = 64;
    const CW = (WW - GAPC) / 2;
    const CY = TOP;
    const CH = CB - CY;
    const PAD = 36;
    const BLOCKS = [
      { color: C.green, n: '1', title: 'Обязательное конверсионное ядро',
        chan: 'Paid Search + ORM + GEO/AEO + внешние экспертные публикации',
        roles: ['перехват сформированного спроса', 'защита доверия и поисковой/AI-видимости', 'минимальный доказательный контент',
          'кратчайший путь к e-pharm / покупке', 'усиление в летний период: ротавирус / отпуск / аптечка в дорогу'] },
      { color: C.purple, n: '2', title: 'Усиление выбора и сокращение пути до покупки',
        chan: 'Retail Media + data-driven programmatic',
        roles: ['находить пользователя по сигналу потребности', 'переводить в персонализированный контент / PDP', 'сокращать дистанцию от интереса до покупки'],
        note: 'Retail Media — приоритетный тест; Programmatic — масштаб / extension после теста Q4' },
    ];
    const BD = 58;
    const titleW = CW - PAD * 2 - BD - 18;
    const TS = 25;
    const titleH = Math.max(BD, ...BLOCKS.map((b) => measure(b.title.toUpperCase(), titleW, TS, true, 1.1)));
    const chanH = Math.max(...BLOCKS.map((b) => measure(b.chan, CW - PAD * 2 - 44, 24, true, 1.2)));
    const FH = 92;      // нижняя полоса: режим работы блока
    BLOCKS.forEach((b, i) => {
      const x0 = X0 + i * (CW + GAPC);
      const x = x0 + PAD;
      const w = CW - PAD * 2;
      s.card({ x: x0, y: CY, w: CW, h: CH, fill: tintOf(b.color, 0.04), stroke: tintOf(b.color, 0.4) });
      let y = CY + 30;
      s.badge({ x, y, d: BD, n: b.n, color: b.color, size: 30 });
      const th = measure(b.title.toUpperCase(), titleW, TS, true, 1.1);
      s.text(b.title.toUpperCase(), { x: x + BD + 18, y: y + (titleH - th) / 2, w: titleW, size: TS, bold: true, lh: 1.1, color: ink(b.color) });
      y += titleH + 24;
      // каналы — в светлой плашке
      const ch = chanH + 32;
      s.box({ x, y, w, h: ch, fill: tintOf(b.color, 0.12), r: 15 });
      s.text(b.chan, { x: x + 22, y: y + Math.round((ch - measure(b.chan, w - 44, 24, true, 1.2)) / 2), w: w - 44, size: 24, bold: true, lh: 1.2, color: C.navy });
      y += ch + 24;
      s.label('Роль', { x, y, w, size: 21, color: ink(b.color) });
      y += 21 + 18;
      const bh = s.bullets(b.roles, { x, y, w, size: 24, gap: 14, indent: 24, color: C.navy });
      y += bh + 30;
      if (b.note) s.text(b.note, { x, y, w: evenW(b.note, w, 22), size: 22, lh: 1.25, color: C.blueText });
      // нижняя полоса
      const fy = CY + CH - 26 - FH;
      s.box({ x, y: fy, w, h: FH, fill: b.color, r: 18 });
      if (i === 0) {
        s.icon('tb:TbRepeat', { x: x + 24, y: fy + (FH - 44) / 2, size: 44, color: C.white });
        const ax = x + 24 + 44 + 18;
        const aw = widthOf('Always-on', 26, true) + 6;
        s.text('Always-on', { x: ax, y: fy, w: aw, h: FH, size: 26, bold: true, lh: 1.0, color: C.white, valign: 'middle' });
        s.vline(ax + aw + 20, fy + 24, FH - 48, C.white, 2);
        s.text('1-й приоритет инвестиций', { x: ax + aw + 40, y: fy, w: x + w - 20 - (ax + aw + 40), h: FH, size: 24, bold: true, lh: 1.1, color: C.white, valign: 'middle', fit: true, maxLines: 2, minSize: 18 });
      } else {
        const sw = widthOf('Sprint Q1+Q4', 24, true) + 6;
        s.text('Sprint Q1+Q4', { x: x + 24, y: fy, w: sw, h: FH, size: 24, bold: true, lh: 1.0, color: C.white, valign: 'middle' });
        // этапы спринта: TEST ► DECISION GATE ► SCALE
        const stg = ['Test', 'Decision gate', 'Scale'];
        const sx0 = x + 24 + sw + 22;
        const chv = 26;
        const avail = x + w - 18 - sx0 - chv * (stg.length - 1);
        const ws = stg.map((t) => widthOf(t.toUpperCase(), 18, true) + 28);
        const k = Math.min(1.25, avail / ws.reduce((a, b2) => a + b2, 0));
        let sx = sx0;
        stg.forEach((t, j) => {
          const cw = Math.floor(ws[j] * k);
          s.box({ x: sx, y: fy + (FH - 46) / 2, w: cw, h: 46, fill: C.white, r: 23 });
          s.text(t.toUpperCase(), { x: sx, y: fy + (FH - 46) / 2, w: cw, h: 46, size: 18, bold: true, lh: 1.0, color: ink(b.color), align: 'center', valign: 'middle', fit: true, maxLines: 1, minSize: 14 });
          sx += cw;
          if (j < stg.length - 1) { s.chevron({ cx: sx + chv / 2, cy: fy + FH / 2, w: 12, h: 18, dir: 'right', color: C.white }); sx += chv; }
        });
      }
    });
    // порядок: сначала ядро, затем усиление
    s.chevron({ cx: X0 + CW + GAPC / 2, cy: CY + CH / 2, w: 22, h: 34, dir: 'right', color: C.navy });

    s.principle({ label: 'Фокус', icon: 'target', x: X0, w: WW,
      text: 'теплый потребитель + доказательный контент + retail/data → путь до покупки' });
  },

  // =====================================================================
  // 20 · Архитектура кампании 2027 vs 2026 (аналог Bobotic 21, Azelik 39, Clindovit 12)
  // =====================================================================
  20: (d) => {
    const s = d.slide({
      title: 'Нормобакт 2027: архитектура кампании vs 2026',
      subtitle: 'Формируем сплит по принципу bottom-up с сохранением AI Visibility stream + Retail Media/Data Driven Programmatic по итогам тестов Q4 2026',
    });
    const LB = { x: 58, w: 172 };      // метки слоёв
    const CA = { x: 244, w: 680 };     // 2026
    const CBX = { x: 1046, w: 816 };   // 2027
    const G = { x: CA.x + CA.w, w: CBX.x - CA.x - CA.w };   // зазор со стрелками изменения

    // ---------- шапки колонок: год и бюджет тотал ----------
    const head = (X, year, value, color) => {
      const yw = widthOf(year, 26, true) + 4;
      s.text(year, { x: X.x, y: 241, w: yw, size: 26, bold: true, lh: 1.0, color });
      const vx = X.x + yw + 14;
      const vw = widthOf(value, 50, true) + 6;
      s.text(value, { x: vx, y: 221, w: vw, size: 50, bold: true, lh: 1.0, color });
      const uw = widthOf('млн ₽*', 26, true) + 8;
      s.text('млн ₽*', { x: vx + vw + 8, y: 241, w: uw, size: 26, bold: true, lh: 1.0, color });
    };
    head(CA, '2026', '9', C.navy);
    head(CBX, '2027', '10', C.crimson);

    const rows = [
      { label: 'CAPTURE DEMAND & VISIBILITY', icon: 'tb:TbSearch', color: C.green, delta: '+3,8 млн ₽', up: true,
        a: { title: 'Спрос закрываем через поиск, РСЯ и ORM', budget: '3,8 млн ₽',
          chans: ['Paid Search + РСЯ', 'ORM'], approach: 'Фокус на перехвате уже сформированного спроса и повторном контакте' },
        b: { title: 'Усиливаем видимость и защиту спроса, формируем доказательный слой под роль продукта', budget: '7,6 млн ₽',
          chans: ['Paid Search + РСЯ', 'ORM', ['GEO/AEO', 'NEW'], ['Внешние публикации', 'NEW']],
          approach: 'К поиску и ORM добавляем GEO/AEO: бренд должен быть виден не только в выдаче, но и в AI-ответах. Внешние публикации объясняют, зачем Нормобакт нужен в ключевых сценариях: после антибиотиков, при инфекции и смене питания' } },
      { label: 'CHOICE & CONVERSION', icon: 'tb:TbShoppingCart', color: C.purple, delta: '−2,5 млн ₽', up: false,
        a: { title: 'Выбор строится на programmatic', budget: '4,3 млн ₽',
          chans: ['Programmatic', 'Native'], approach: 'Находим нужные аудитории по данным и интересам, но не доводим их в retail-среду выбора' },
        b: { title: 'Доводим выбор ближе к покупке', budget: '1,8 млн ₽',
          chans: [['Retail Media/Data', 'SPECIFIED']], approach: 'Находим и конвертируем пользователей с сигналами потребности ближе к покупке' } },
      { label: 'TRUST T&L', icon: 'tb:TbShieldCheck', color: C.orange, delta: null,
        a: { title: 'Доверие не было отдельным масштабируемым каналом', budget: '<0,01 млн ₽',
          chans: ['VK / TG Ads', 'точечный social-тест'], approach: 'Social использовался точечно' },
        b: null },
    ];

    const PAD = 24;
    const BS = 28;     // кегль бюджета блока
    const TS = 18;     // кегль заголовка блока
    const AS = 18;     // кегль текста подхода
    const SPLIT = { a: 0.4, b: 0.36 };
    const GUT = 24;
    const geo = (X, c, split) => {
      const pw = X.w - PAD * 2;
      const bw = widthOf(c.budget, BS, true) + 6;
      const tw = pw - bw - 18;
      const w1 = Math.round(pw * split) - GUT / 2;
      const w2 = pw - w1 - GUT;
      return { pw, bw, tw, w1, w2, th: measure(c.title, tw, TS, true, 1.15), ah: measure(c.approach, w2, AS, false, 1.2) };
    };
    const PITCH = 27;
    rows.forEach((r) => {
      const cells = [[CA, r.a, SPLIT.a], [CBX, r.b, SPLIT.b]].filter(([, c]) => c);
      const gs = cells.map(([X, c, sp]) => geo(X, c, sp));
      r.headH = Math.max(BS + 4, ...gs.map((g) => g.th));
      r.bodyH = Math.max(...cells.map(([, c], k) => Math.max(c.chans.length * PITCH, gs[k].ah)));
    });
    const Y0 = 292;
    const GAP = 12;
    const fixed = (r) => 14 + r.headH + 10 + 32 + r.bodyH + 18;
    let y = Y0;
    rows.forEach((r) => { r.h = fixed(r); r.y = y; y += r.h + GAP; });
    // остаток высоты — поровну строкам
    const spare = BOT - (y - GAP);
    if (spare > 0) { let acc = 0; rows.forEach((r) => { r.y += acc; const add = Math.floor(spare / rows.length); r.h += add; acc += add; }); }

    const cell = (X, r, c, { accent, tint, split, year }) => {
      s.card({ x: X.x, y: r.y, w: X.w, h: r.h, tint });
      const px = X.x + PAD;
      const { pw, bw, tw, w1, w2 } = geo(X, c, split);
      s.text(c.title, { x: px, y: r.y + 14, w: evenW(c.title, tw, TS, true), size: TS, bold: true, lh: 1.15, color: C.navy });
      s.text(c.budget, { x: X.x + X.w - PAD - bw, y: r.y + 12, w: bw, size: BS, bold: true, lh: 1.0, color: accent, align: 'right' });
      const ly = r.y + 14 + r.headH + 10;
      s.hline(px, ly, pw);
      s.label('Каналы', { x: px, y: ly + 10, w: w1, size: 15, color: C.blueText });
      chanList(s, c.chans, { x: px, y: ly + 32, w: w1, size: 18, pitch: PITCH });
      const ax = px + w1 + GUT;
      s.vline(ax - GUT / 2, ly + 12, r.y + r.h - ly - 24);
      s.label(year === 2026 ? 'Подход 2026' : 'Подход 2027', { x: ax, y: ly + 10, w: w2, size: 15, color: year === 2026 ? C.blueText : C.crimson });
      s.text(c.approach, { x: ax, y: ly + 32, w: w2, size: AS, lh: 1.2, color: C.navy });
    };

    rows.forEach((r) => {
      s.tile({ x: LB.x, y: r.y, w: LB.w, h: r.h, color: r.color, text: r.label, icon: r.icon, iconSize: 40, size: 18, textH: 66 });
      if (r.a) cell(CA, r, r.a, { accent: C.navy, split: SPLIT.a, year: 2026 });
      else emptyCell(s, { x: CA.x, y: r.y, w: CA.w, h: r.h });
      if (r.b) cell(CBX, r, r.b, { accent: C.crimson, tint: true, split: SPLIT.b, year: 2027 });
      else emptyCell(s, { x: CBX.x, y: r.y, w: CBX.w, h: r.h });
      if (!r.delta) return;
      // изменение бюджета слоя 2027 vs 2026 (расчёт OMD)
      const col = r.up ? C.crimson : C.blueText;
      const mid = r.y + Math.round(r.h / 2);
      s.text(r.delta, { x: G.x + 4, y: mid - 32, w: G.w - 8, size: 19, bold: true, lh: 1.0, color: col, align: 'center', fit: true, maxLines: 1, minSize: 15 });
      s.arrow({ dir: 'right', x: G.x + 16, y: mid + 4, len: G.w - 32, head: 24, headLen: 14, stem: 4, color: col });
    });

    s.footnote('*Бюджеты тотал представлены с учетом тех костов, АК и РС, бюджеты блоков указаны с АК и РС без учета тех костов. Изменения 2027 vs 2026 по слоям — расчёт OMD');
  },
};
