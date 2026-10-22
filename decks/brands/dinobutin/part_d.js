// Динобутин · стратегия 2027 — часть D: слайды исходника 16–20.
// 16 — варианты распределения поддержки по году: гант (Always-on core + варианты 1/2/3), логика сценариев, как принимать решение (картинка);
// 17 — архитектура кампании 2027 vs 2026: 4 слоя, в 2027 три варианта бюджета V1/V2/V3 (живые фигуры; подача — как Bobotic 21, Normobact 20, Azelik 39);
// 18 — Video Value для бизнеса: why / media / value + value chain (картинка);
// 19 — CTV: сценарии 1 и 2 (цепочка Universe → охват → контакты → показы → бюджет), что покупаем, что получает бренд (картинка; подача — как Bobotic 22);
// 20 — сценарий 3: CTV + OLV, что покупаем внутри OLV, что получает бренд (картинка).
// Слайды-картинки: ориентир — итоговый рендер исходника (видимый текст картинки), а не живой текст под ней.
// Цвета 4 слоёв — как на слайде 15: CAPTURE / PROTECT & CONVERT — green, BUILD NEW DEMAND — crimson,
// PERSONALIZE CONSIDERATION — purple, BUILD TRUST & SUPPORT CHOICE — orange.
const { C, IN, PT, columns, countLines, textWidth, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT
const D = require('./common');                            // SRC, MEDIA, CROPS

const TOP = V.TOP;   // 221 — верх контента
const BOT = V.BOT;   // 1005 — низ контента без плашки
const CB = 905;      // низ контента над плашкой
const X0 = 58;
const X1 = 1862;
const WW = X1 - X0;

// Цвета слоёв (одинаковые со слайдом 15)
const LAYER = { protect: C.green, demand: C.crimson, personalize: C.purple, trust: C.orange };

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
// Цвет текста для акцента: оранжевый на белом слишком светлый — для текста берём более тёмный
const ink = (c) => (c === C.cyan ? C.teal : c === C.orange ? 'D9661A' : c);
// Смешение цвета с белым: k = 0 — белый, 1 — исходный цвет
function tintOf(hex, k) {
  const c = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return c.map((v) => Math.round(255 + (v - 255) * k).toString(16).padStart(2, '0')).join('').toUpperCase();
}

// Ярлык статуса (NEW) — как в деках серии
function tag(s, t, x, y, { size = 13, h = 24, color = C.crimson } = {}) {
  const w = widthOf(t, size, true) + 20;
  s.box({ x, y, w, h, fill: color, r: h / 2 });
  s.text(t, { x, y, w, h, size, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
  return w;
}

// Список (каналы / сегменты): строка + ярлык статуса сразу после неё
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

// Заголовок блока: иконка в цветном кружке + заголовок в одну строку
function blockHead(s, { x, y, w, icon, text, color = C.blue, d = 42, size = 25 }) {
  s.icon(icon, { x, y, size: d, circle: color });
  s.text(text, { x: x + d + 14, y, w: w - d - 14, h: d, size, bold: true, lh: 1.0, color: C.navy, valign: 'middle', fit: true, maxLines: 1, minSize: 19 });
  return d;
}

// Цепочка медиарасчёта: 5 плиток (Universe → Охват → Контакты → Показы → Бюджет) с шевронами.
// items: [{ k: 'Universe', v: '≈3,4 млн', t: 'мам с детьми 3–10 в ядре географии', accent: 'soft' | 'main' }]
function chain(s, items, { x, y, w, h = 124, gap = 34 }) {
  const tw = (w - gap * (items.length - 1)) / items.length;
  items.forEach((c, i) => {
    const bx = Math.round(x + i * (tw + gap));
    const bw = Math.round(tw);
    const main = c.accent === 'main';
    const soft = c.accent === 'soft';
    s.box({ x: bx, y, w: bw, h, fill: main ? C.crimson : soft ? tintOf(C.crimson, 0.1) : C.cardTint });
    const big = h >= 150;
    const vs = big ? 40 : 32;     // кегль цифры
    const ds = big ? 18 : 16;     // кегль подписи
    const ky = big ? 20 : 12;
    const vy = ky + (big ? 28 : 22);
    const dy = vy + vs + (big ? 14 : 8);
    s.text(c.k.toUpperCase(), { x: bx + 16, y: y + ky, w: bw - 32, size: big ? 15 : 14, bold: true, lh: 1.0,
      color: main ? C.white : soft ? C.crimson : C.blueText, fit: true, maxLines: 1, minSize: 12 });
    s.text(c.v, { x: bx + 16, y: y + vy, w: bw - 32, size: vs, bold: true, lh: 1.0, color: main ? C.white : soft ? C.crimson : C.navy,
      fit: true, maxLines: 1, minSize: 24 });
    s.text(c.t, { x: bx + 16, y: y + dy, w: bw - 28, h: h - dy - 4, size: ds, lh: 1.1, color: main ? C.white : C.blueText, fit: true, minSize: 14 });
    if (i < items.length - 1) s.chevron({ cx: bx + bw + gap / 2, cy: y + h / 2, w: 16, h: 24, color: C.crimson });
  });
  return h;
}

// Блок «Что получает бренд»: строки «ярлык │ текст» с разделителями, ряды растягиваются на высоту h
function gets(s, rows, { x, y, w, h }) {
  const PILL_W = Math.max(...rows.map((g) => widthOf(g.k, 17, true))) + 40;
  const tw = w - PILL_W - 20;
  const rh = rows.map((g) => Math.max(40, measure(g.t, tw, 18)));
  const spare = h - rh.reduce((a, b) => a + b, 0);
  const gap = Math.max(20, Math.floor(spare / rows.length));
  let yy = y + Math.max(0, Math.round((spare - gap * (rows.length - 1)) / 2));
  rows.forEach((g, i) => {
    if (i > 0) s.hline(x, yy - gap / 2, w);
    s.pill(g.k, { x, y: yy + Math.round((rh[i] - 40) / 2), w: PILL_W, h: 40, color: g.color, size: 17 });
    s.text(g.t, { x: x + PILL_W + 20, y: yy + Math.round((rh[i] - measure(g.t, tw, 18)) / 2), w: g.even ? evenW(g.t, tw, 18) : tw, size: 18, lh: 1.2, color: C.navy });
    yy += rh[i] + gap;
  });
}

// Мини-карточка «ключ: значение» (что покупаем)
function spec(s, { x, y, w, h, k, v }) {
  s.box({ x, y, w, h, fill: C.cardTint });
  const kh = s.text(k, { x: x + 18, y: y + 14, w: w - 36, size: 18, bold: true, lh: 1.15, color: C.navy });
  s.text(v, { x: x + 18, y: y + 14 + kh + 4, w: evenW(v, w - 36, 18), h: h - kh - 30, size: 18, lh: 1.2, color: C.blueText, fit: true, minSize: 15 });
}
const specH = (k, v, w) => 14 + measure(k, w - 36, 18, true, 1.15) + 4 + measure(v, w - 36, 18) + 16;

module.exports = {
  // =====================================================================
  // 16 · Варианты распределения поддержки в течение 2027 года (картинка → гант живыми фигурами)
  // =====================================================================
  16: (d) => {
    const s = d.slide({
      title: 'Варианты распределения охватной и персонализированной поддержки в течение 2027 года',
      subtitle: 'Options to discuss',
    });

    // ---- нижние карточки: логика сценариев + как принимать решение (высота — по тексту) ----
    const kc = columns(2, { gap: 22 });
    const KP = 28;
    const logic = [
      'Все варианты сохраняют always-on базу Search / ORM / GEO',
      'Видео-only распределяется по-разному в зависимости от сценария',
      'Финальный выбор зависит от business value и результатов тестов',
    ];
    const decide = [
      { k: 'SCALE', color: C.green, t: 'медийные KPI выполнены и есть сигналы ниже по воронке' },
      { k: 'OPTIMIZE', color: C.orange, t: 'медийные KPI выполнены, но сигналы ниже по воронке неоднозначны' },
      { k: 'REALLOCATE', color: C.crimson, t: 'сильнее сработал альтернативный календарный сценарий' },
    ];
    const KW = kc[0].w - KP * 2;
    const DK = Math.max(...decide.map((r) => widthOf(r.k, 19, true))) + 26;
    const ROWP = 36;
    const bodyH = Math.max(
      logic.reduce((a, t) => a + measure(t, KW - 30, 19), 0) + 10 * (logic.length - 1),
      decide.reduce((a, r) => a + Math.max(ROWP - 12, measure(r.t, KW - DK - 20, 18)), 0) + 10 * (decide.length - 1),
    );
    const KH = KP + 28 + 14 + bodyH + KP - 8;
    const KY = BOT - KH;

    // ---- гант ----
    const LW = 396;
    const GX = X0 + LW + 16;
    const MW = (X1 - GX) / 12;
    const mx = (m) => GX + m * MW;
    const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const HY = TOP;
    const HH = 34;
    MONTHS.forEach((m, i) => {
      s.box({ x: mx(i) + 3, y: HY, w: MW - 6, h: HH, fill: C.tint, r: 10 });
      s.text(m, { x: mx(i) + 3, y: HY, w: MW - 6, h: HH, size: 16, bold: true, lh: 1.0, color: C.navy, align: 'center', valign: 'middle' });
    });

    // Always-on core
    const AY = HY + HH + 12;
    const AH = 50;
    s.text('ALWAYS-ON CORE', { x: X0, y: AY, w: LW, h: AH, size: 22, bold: true, lh: 1.0, color: C.green, valign: 'middle' });
    s.box({ x: GX, y: AY, w: X1 - GX, h: AH, fill: C.green, r: 12 });
    s.text('GEO + AEO / Внешние публикации / ORM / Paid Search', { x: GX + 20, y: AY, w: X1 - GX - 40, h: AH, size: 20, bold: true, lh: 1.0,
      color: C.white, align: 'center', valign: 'middle' });

    // Варианты: две дорожки — видео / always-on ниже воронки; бары — цвета исходника
    const CTV = C.blue;
    const PRG = C.crimson;
    const ANL = C.orange;
    const OLV = C.purple;
    const prog = { m0: 0, m1: 3, color: PRG, text: 'Programmatic — AI & Data /\nbloggers / native / social' };
    const anl = { m0: 3, m1: 6, color: ANL, text: 'Анализ результатов и корректировка подхода' };
    const VARS = [
      { n: 'Вариант 1', desc: 'Формирование знания, CTV big screen, январь–март', note: 'Концентрация знания в Q1',
        lanes: [
          [{ m0: 0, m1: 3, color: CTV, text: 'CTV big screen' }],
          [prog, anl, { m0: 7, m1: 11, color: PRG, text: 'Перераспределение бюджета в наиболее эффективные решения без CTV' }],
        ] },
      { n: 'Вариант 2', desc: 'Две волны знания: январь–февраль и сентябрь–октябрь', note: 'Две волны поддержки в течение года',
        lanes: [
          [{ m0: 0, m1: 2, color: CTV, text: 'CTV big screen' }, { m0: 8, m1: 10, color: CTV, text: 'CTV big screen' }],
          [prog, anl, { m0: 7, m1: 11, color: PRG, text: 'Перераспределение бюджета в наиболее эффективные решения' }],
        ] },
      { n: 'Вариант 3', desc: 'Максимальная концентрация в период повышенного категорийного спроса',
        note: 'Между периодами — анализ результатов и корректировка подхода',
        lanes: [
          [{ m0: 0, m1: 3, color: CTV, text: 'CTV / master video —\nформирование знания' },
            { m0: 7, m1: 11, color: OLV, text: 'OLV / персонализированные видео по сегментам — добор охвата на частоте' }],
          [prog, anl, { m0: 7, m1: 11, color: PRG, text: 'Перераспределение бюджета в наиболее эффективные решения' }],
        ] },
    ];
    const RG = 12;
    const RY0 = AY + AH + RG;
    const RH = Math.floor((KY - 18 - RY0 - RG * (VARS.length - 1)) / VARS.length);
    const LP = 20;
    VARS.forEach((v, i) => {
      const y = RY0 + i * (RH + RG);
      // подпись варианта
      s.box({ x: X0, y, w: LW, h: RH, fill: C.cardTint, r: 15 });
      const lw = LW - LP * 2;
      const nh = 24;
      const dh = measure(v.desc, lw, 18);
      const th = measure(v.note, lw, 15);
      const ly = y + 14;
      s.text(v.n.toUpperCase(), { x: X0 + LP, y: ly, w: lw, size: 22, bold: true, lh: 1.0, color: C.navy });
      s.text(v.desc, { x: X0 + LP, y: ly + nh + 8, w: lw, size: 18, lh: 1.2, color: C.navy });
      s.text(v.note, { x: X0 + LP, y: Math.max(ly + nh + 8 + dh + 6, y + RH - 12 - th), w: lw, size: 15, lh: 1.2, color: C.blueText });
      // поле ганта
      s.box({ x: GX, y, w: X1 - GX, h: RH, fill: C.cardTint, r: 12 });
      for (let m = 1; m < 12; m++) s.vline(mx(m), y + 8, RH - 16, C.white, 2);
      const P = 8;
      const LG = 8;
      const lh = (RH - P * 2 - LG) / 2;
      v.lanes.forEach((lane, li) => {
        const by = Math.round(y + P + li * (lh + LG));
        lane.forEach((b) => {
          const bx = mx(b.m0) + 4;
          const bw = (b.m1 - b.m0) * MW - 8;
          s.box({ x: bx, y: by, w: bw, h: Math.round(lh), fill: b.color, r: 10 });
          s.text(b.text, { x: bx + 10, y: by, w: bw - 20, h: Math.round(lh), size: 17, bold: true, lh: 1.1, color: C.white,
            align: 'center', valign: 'middle', fit: true, minSize: 14 });
        });
      });
    });

    // ---- логика сценариев ----
    s.card({ x: kc[0].x, y: KY, w: kc[0].w, h: KH });
    s.text('Логика сценариев', { x: kc[0].x + KP, y: KY + KP - 4, w: KW, size: 24, bold: true, lh: 1.1, color: C.navy });
    let y = KY + KP + 28 + 14;
    logic.forEach((t) => {
      s.circle({ x: kc[0].x + KP + 2, y: y + 6, d: 12, fill: C.blue });
      y += s.text(t, { x: kc[0].x + KP + 30, y, w: KW - 30, size: 19, lh: 1.2, color: C.navy }) + 10;
    });

    // ---- как принимать решение ----
    s.card({ x: kc[1].x, y: KY, w: kc[1].w, h: KH });
    s.text('Как принимать решение', { x: kc[1].x + KP, y: KY + KP - 4, w: KW, size: 24, bold: true, lh: 1.1, color: C.navy });
    y = KY + KP + 28 + 14;
    decide.forEach((r) => {
      const rh = Math.max(ROWP - 12, measure(r.t, KW - DK - 20, 18));
      s.text(r.k, { x: kc[1].x + KP, y, w: DK, size: 19, bold: true, lh: 1.2, color: ink(r.color) });
      s.vline(kc[1].x + KP + DK - 12, y + 2, rh - 4, C.line, 2);
      s.text(r.t, { x: kc[1].x + KP + DK + 4, y: y + 1, w: KW - DK - 4, size: 18, lh: 1.2, color: C.navy });
      y += rh + 10;
    });
  },

  // =====================================================================
  // 17 · Архитектура кампании 2027 vs 2026 (живые фигуры; в 2027 — три варианта бюджета)
  // =====================================================================
  17: (d) => {
    const s = d.slide({ title: 'Динобутин 2027: архитектура кампании vs 2026' });
    const LB = { x: 58, w: 176 };      // метки слоёв
    const CA = { x: 246, w: 598 };     // 2026
    const CBX = { x: 872, w: 990 };    // 2027
    const G = { x: CA.x + CA.w, w: CBX.x - CA.x - CA.w };   // зазор со стрелкой 2026 → 2027

    // ---------- шапки колонок: год и бюджет тотал ----------
    const unit = 'млн ₽*';
    const head26 = () => {
      const yw = widthOf('2026', 26, true) + 4;
      s.text('2026', { x: CA.x, y: 241, w: yw, size: 26, bold: true, lh: 1.0, color: C.navy });
      const vx = CA.x + yw + 14;
      const vw = widthOf('12', 50, true) + 6;
      s.text('12', { x: vx, y: 221, w: vw, size: 50, bold: true, lh: 1.0, color: C.navy });
      s.text(unit, { x: vx + vw + 8, y: 241, w: widthOf(unit, 26, true) + 8, size: 26, bold: true, lh: 1.0, color: C.navy });
    };
    const head27 = () => {
      const col = C.crimson;
      const yw = widthOf('2027', 26, true) + 4;
      s.text('2027', { x: CBX.x, y: 241, w: yw, size: 26, bold: true, lh: 1.0, color: col });
      let x = CBX.x + yw + 22;
      [['V1', '20,3'], ['V2', '26,8'], ['V3', '32']].forEach(([v, val], i) => {
        if (i > 0) { s.vline(x - 14, 228, 44, C.line, 2); }
        const lw = widthOf(v, 20, true) + 4;
        s.text(v, { x, y: 244, w: lw, size: 20, bold: true, lh: 1.0, color: C.blueText });
        const vw = widthOf(val, 46, true) + 6;
        s.text(val, { x: x + lw + 6, y: 223, w: vw, size: 46, bold: true, lh: 1.0, color: col });
        x += lw + 6 + vw + 28;
      });
      s.text(unit, { x: x - 18, y: 241, w: widthOf(unit, 26, true) + 8, size: 26, bold: true, lh: 1.0, color: col });
    };
    head26();
    head27();

    const SEG26 = ['Хронические боли и спазмы ЖКТ', 'Смена питания/диеты', 'Стресс-стул'];
    const SEG27 = ['Хронические боли и спазмы ЖКТ', 'Смена питания/диеты', 'Стресс-живот', ['Нестабильный стул', 'NEW']];
    const rows = [
      { label: 'BUILD NEW DEMAND', icon: 'tb:TbPlayerPlay', color: LAYER.demand,
        a: { title: 'Тестирование видео-канала с последующей валидацией эффекта', budget: '4,3 млн ₽',
          lists: [['Каналы', ['CTV']]] },
        b: { title: 'Создаём новый спрос до Search через заметный и релевантный видеоконтакт',
          budgets: [['V1', '3,1 млн ₽'], ['V2', '5,3 млн ₽'], ['V3', '6,9 млн ₽']],
          lists: [['Каналы', ['CTV', ['OLV', 'NEW']]], ['Сегменты', SEG27, 2]] } },
      { label: 'PERSONALIZE CONSIDERATION', icon: 'tb:TbTarget', color: LAYER.personalize,
        a: { title: 'Присутствие в медиапространстве через широкие сегменты интересов', budget: '2,0 млн ₽',
          lists: [['Каналы', ['Programmatic', 'Thematic display', 'Social', 'Native'], 2], ['Сегменты', SEG26]] },
        b: { title: 'От широкого таргетинга → к персонализированному пути по сигналу потребности',
          budgets: [['V1', '5,4 млн ₽'], ['V2', '7,5 млн ₽'], ['V3', '9,7 млн ₽']],
          lists: [['Каналы', [['Programmatic — precise targeting', 'NEW'], 'Native']], ['Сегменты', SEG27, 2]] } },
      { label: 'BUILD TRUST & SUPPORT CHOICE', icon: 'tb:TbUsers', color: LAYER.trust,
        a: { title: 'Формирование дополнительного доверия к бренду через авторитетную коммуникацию', budget: '1,1 млн ₽',
          lists: [['Каналы', ['Bloggers']]] },
        b: { title: 'Усиливаем основание выбора и масштабируем только доказанные trust-связки',
          budgets: [['V1', '2,6 млн ₽'], ['V2', '4,8 млн ₽'], ['V3', '4,8 млн ₽']],
          lists: [['Каналы', ['Bloggers', 'Social']], ['Сегменты', SEG27, 2]] } },
      { label: 'PROTECT & CONVERT', icon: 'tb:TbShoppingCart', color: LAYER.protect,
        a: { title: 'Перехват спроса, присутствие на всех этапах выбора', budget: '4,0 млн ₽',
          lists: [['Каналы', ['ORM', 'Paid Search']], ['Сегменты', SEG26]] },
        b: { title: 'Конвертируем сформированный спрос в выбор и покупку', budget: '7,5 млн ₽',
          lists: [['Каналы', ['ORM', ['GEO|AEO', 'NEW'], 'Paid Search', ['Внешние публикации', 'NEW']]], ['Сегменты', SEG27, 2]] } },
    ];

    const PAD = 24;
    const BS = 28;      // кегль единого бюджета блока
    const TS = 18;      // кегль заголовка блока
    const LS = 17;      // кегль списков
    const SEGC = 272;   // ширина одной колонки сегментов
    const TILE = { h: 36, gap: 6, ls: 13, vs: 16, p: 9 };
    const tileW = (v, val) => TILE.p + widthOf(v, TILE.ls, true) + 7 + widthOf(val, TILE.vs, true) + TILE.p;
    // геометрия ячейки: ширины колонок «Каналы» / «Сегменты», ширина заголовка
    const geo = (X, c) => {
      const pw = X.w - PAD * 2;
      const bw = c.budgets
        ? c.budgets.reduce((a, [v, val]) => a + tileW(v, val), 0) + TILE.gap * (c.budgets.length - 1)
        : widthOf(c.budget, BS, true) + 6;
      const tw = pw - bw - 20;
      const seg = c.lists.find(([t]) => t === 'Сегменты');
      const segW = seg ? (seg[2] === 2 ? SEGC * 2 + 16 : SEGC) : 0;
      const w1 = seg ? pw - 24 - segW : pw;
      return { pw, bw, tw, w1, segW, th: measure(c.title, tw, TS, true, 1.15) };
    };
    rows.forEach((r) => {
      const cells = [[CA, r.a], [CBX, r.b]];
      r.headH = Math.max(BS + 6, ...cells.map(([X, c]) => geo(X, c).th));
      r.n = Math.max(...cells.flatMap(([, c]) => c.lists.map(([, items, cols]) => Math.ceil(items.length / (cols || 1)))));
    });
    const Y0 = 292;
    const GAP = 10;
    const fixed = (r) => 13 + r.headH + 10 + 30 + 22 + 12;
    const avail = BOT - Y0 - GAP * (rows.length - 1);
    const PITCH = Math.max(21, Math.min(26, Math.floor((avail - rows.reduce((a, r) => a + fixed(r), 0)) / rows.reduce((a, r) => a + r.n - 1, 0))));
    let y = Y0;
    rows.forEach((r) => { r.h = fixed(r) + (r.n - 1) * PITCH; r.y = y; y += r.h + GAP; });
    const spare = BOT - (y - GAP);
    if (spare > 0) { let acc = 0; rows.forEach((r) => { r.y += acc; const add = Math.floor(spare / rows.length); r.h += add; acc += add; }); }

    const cell = (X, r, c, { accent, tint }) => {
      s.card({ x: X.x, y: r.y, w: X.w, h: r.h, tint });
      const px = X.x + PAD;
      const { pw, bw, tw, w1, segW } = geo(X, c);
      s.text(c.title, { x: px, y: r.y + 14, w: c.budgets ? tw : evenW(c.title, tw, TS, true), size: TS, bold: true, lh: 1.15, color: C.navy });
      if (c.budgets) {
        // компактная строка плиток V1 / V2 / V3
        let tx = X.x + X.w - PAD - bw;
        c.budgets.forEach(([v, val]) => {
          const w = tileW(v, val);
          s.box({ x: tx, y: r.y + 12, w, h: TILE.h, fill: C.white, stroke: C.line, sw: 1.5, r: 10 });
          const lw = widthOf(v, TILE.ls, true) + 2;
          s.text(v, { x: tx + TILE.p, y: r.y + 12, w: lw, h: TILE.h, size: TILE.ls, bold: true, lh: 1.0, color: C.blueText, valign: 'middle' });
          s.text(val, { x: tx + TILE.p + lw + 5, y: r.y + 12, w: w - lw - TILE.p * 2 - 3, h: TILE.h, size: TILE.vs, bold: true, lh: 1.0, color: accent, valign: 'middle' });
          tx += w + TILE.gap;
        });
      } else {
        s.text(c.budget, { x: X.x + X.w - PAD - bw, y: r.y + 12, w: bw, size: BS, bold: true, lh: 1.0, color: accent, align: 'right' });
      }
      const ly = r.y + 13 + r.headH + 10;
      s.hline(px, ly, pw);
      c.lists.forEach(([title, items, cols], k) => {
        const lx = k === 0 ? px : px + w1 + 24;
        const lw = k === 0 ? w1 : segW;
        if (k > 0) s.vline(lx - 12, ly + 12, r.y + r.h - ly - 24);
        s.label(title, { x: lx, y: ly + 10, w: lw, size: 15, color: C.blueText });
        if (cols === 2) {
          const h1 = Math.ceil(items.length / 2);
          // ширина первой колонки — по её самой длинной строке (вторая получает остаток)
          const iw = (it) => (Array.isArray(it) ? widthOf(it[0], LS) + widthOf(it[1], 13, true) + 30 : widthOf(it, LS)) + 4;
          const cw = Math.max((lw - 16) / 2, Math.min(lw - 16 - Math.max(...items.slice(h1).map(iw)), Math.max(...items.slice(0, h1).map(iw))));
          chanList(s, items.slice(0, h1), { x: lx, y: ly + 32, w: cw, size: LS, pitch: PITCH });
          chanList(s, items.slice(h1), { x: lx + cw + 16, y: ly + 32, w: lw - 16 - cw, size: LS, pitch: PITCH });
        } else chanList(s, items, { x: lx, y: ly + 32, w: lw, size: LS, pitch: PITCH });
      });
    };

    rows.forEach((r) => {
      s.tile({ x: LB.x, y: r.y, w: LB.w, h: r.h, color: r.color, text: r.label, icon: r.icon, iconSize: 40, size: 18, textH: 66 });
      cell(CA, r, r.a, { accent: C.navy });
      cell(CBX, r, r.b, { accent: C.crimson, tint: true });
      s.chevron({ cx: G.x + G.w / 2, cy: r.y + Math.round(r.h / 2), w: 16, h: 24, color: C.crimson });
    });

    s.footnote('*Бюджеты тотал представлены с учетом тех костов, АК и РС, бюджеты блоков указаны с АК и РС без учета тех костов');
  },

  // =====================================================================
  // 18 · Video Value для бизнеса (картинка → живой текст)
  // =====================================================================
  18: (d) => {
    const s = d.slide({
      title: 'Динобутин 2027: Video Value для бизнеса',
      subtitle: 'Видео не просто добавляет охват: оно заранее объясняет проблему, формирует знание и создает спрос, который затем перехватывают Search, ORM и конверсионные инструменты',
    });
    const cols = columns(3, { gap: 22 });
    const P = 28;
    const iw = cols[0].w - P * 2;

    // ---- value chain внизу: высота фиксирована, карточки — до неё ----
    const CHH = 172;
    const CHY = BOT - CHH;
    const CY = TOP;
    const CH = CHY - 16 - CY;

    // общий верх колонки: метка-плашка + заголовок
    const colHead = (c, label, color, title) => {
      s.card({ x: c.x, y: CY, w: c.w, h: CH });
      const lw = widthOf(label, 17, true) + 40;
      s.box({ x: c.x + P, y: CY + 24, w: lw, h: 30, fill: color, r: 8 });
      s.text(label, { x: c.x + P, y: CY + 24, w: lw, h: 30, size: 17, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
      const th = s.text(title, { x: c.x + P, y: CY + 70, w: iw, size: 28, bold: true, lh: 1.1, color: C.navy, fit: true, maxLines: 1, minSize: 22 });
      return CY + 70 + th + 14;
    };

    // ---- WHY ----
    let y = colHead(cols[0], 'WHY', C.blue, 'Зачем Video Динобутину');
    const why = [
      '**Проблема бизнеса:** Динобутин — относительно новый бренд в категории, где выбор часто происходит уже на этапе сформированного спроса, а мама ищет понятное решение знакомой ЖКТ-ситуации.',
      '**Роль Video:** до активного поиска видео помогает объяснить разные проявления функциональных нарушений ЖКТ, показать знакомую жизненную ситуацию и связать её с брендом.',
      '**Бизнес-задача:** сформировать знание и первичный спрос, который дальше конвертируют Search / ORM / «Где купить» / e-pharm.',
    ];
    why.forEach((t) => { y += s.text(t, { x: cols[0].x + P, y, w: evenW(t, iw, 18), size: 18, lh: 1.2, color: C.navy }) + 14; });
    // +181%: блок-доказательство внизу колонки
    const note = '2026 доказал: бренд способен создавать собственный спрос.\n2027 — **масштабируем** это через видео.';
    const SBH = 18 + 52 + 14 + measure(note, iw - 32, 15) + 18;
    const sby = CY + CH - P - SBH + 6;
    s.box({ x: cols[0].x + P - 8, y: sby, w: iw + 16, h: SBH, fill: C.cardTint });
    const vw = widthOf('+181%', 50, true) + 8;
    s.text('+181%', { x: cols[0].x + P + 10, y: sby + 16, w: vw, size: 50, bold: true, lh: 1.0, color: C.crimson });
    s.vline(cols[0].x + P + 10 + vw + 12, sby + 18, 48, C.line, 2);
    s.text('**рост брендового спроса**\nvs +5% категория', { x: cols[0].x + P + 10 + vw + 28, y: sby + 16, w: iw - vw - 50, size: 19, lh: 1.2, color: C.navy });
    s.text(note, { x: cols[0].x + P + 10, y: sby + 18 + 52 + 14, w: iw - 32, size: 15, lh: 1.2, color: C.blueText });

    // ---- MEDIA ----
    y = colHead(cols[1], 'MEDIA', C.blue, 'Какую бизнес-роль играет видео');
    const mx = cols[1].x + P;
    const layer = (title, items) => {
      y += s.text(title, { x: mx, y, w: iw, size: 20, bold: true, lh: 1.15, color: C.navy }) + 10;
      items.forEach((t) => {
        s.icon('check_circle', { x: mx, y: y + 1, size: 22, color: C.white, bg: C.blue });
        y += s.text(t, { x: mx + 32, y, w: evenW(t, iw - 32, 17), size: 17, lh: 1.2, color: C.navy }) + 7;
      });
    };
    layer('CTV = слой знания и доверия', [
      'масштабно объясняет проблему до поиска',
      'дает широкий качественный контакт на большом экране',
      'помогает маме узнать ситуацию и запомнить бренд',
    ]);
    y += 10;
    layer('OLV = слой объяснения и доведения', [
      'добирает частоту в ядре ЦА',
      'точнее раскрывает релевантные симптомы / ситуации',
      'подводит к следующему действию: Search / «Где купить» / e-pharm',
    ]);
    // две цифры AdRiver
    const sw = (iw + 16 - 12) / 2;
    const stats = [
      { icon: 'tb:TbEye', t: 'Высокая видимость на большом экране', v: '84,6%', n: 'VA при 90–95% площади экрана vs 37,3% в среднем по РК*' },
      { icon: 'tb:TbPlayerPlay', t: 'Высокая досматриваемость', v: '92,3%', n: 'VTR при 90–95% площади экрана vs 57,6% в среднем по РК*' },
    ];
    const stH = 16 + 40 + 8 + 44 + 8 + Math.max(...stats.map((k) => measure(k.n, sw - 32, 15))) + 14;
    const sty = CY + CH - P - stH + 6;
    stats.forEach((k, i) => {
      const x = Math.round(mx - 8 + i * (sw + 12));
      s.box({ x, y: sty, w: Math.round(sw), h: stH, fill: C.cardTint });
      s.icon(k.icon, { x: x + 16, y: sty + 16, size: 40, circle: C.blue });
      s.text(k.t, { x: x + 66, y: sty + 16, w: sw - 80, h: 40, size: 15, bold: true, lh: 1.15, color: C.navy, valign: 'middle', fit: true, minSize: 13 });
      s.text(k.v, { x: x + 16, y: sty + 16 + 40 + 8, w: sw - 32, size: 44, bold: true, lh: 1.0, color: C.blue });
      s.text(k.n, { x: x + 16, y: sty + 16 + 40 + 8 + 44 + 8, w: evenW(k.n, sw - 32, 15), size: 15, lh: 1.2, color: C.blueText });
    });

    // ---- VALUE ----
    y = colHead(cols[2], 'VALUE', C.crimson, 'Как оцениваем бизнес-эффект');
    const vx = cols[2].x + P;
    const steps = [
      { title: 'Формирование знания', text: 'BLS / ad recall / consideration' },
      { title: 'Создание спроса', text: 'Brand Search / post-view interest / visits after contact' },
      { title: 'Перевод в действие', text: 'CR по «Где купить», quality visits, e-pharm / PDP traffic' },
      { title: 'Вклад в бизнес', text: 'Sales Lift / repeat / incremental sales в ядре и регионах роста' },
    ];
    const valT = 'VALUE: Video создает спрос, который затем конвертируют Search и performance-инструменты';
    const VBH = measure(valT, iw - 40, 18, true) + 30;
    const vby = CY + CH - P - VBH + 6;
    const BD = 46;
    const stepH = steps.map((k) => Math.max(BD, 22 + 6 + measure(k.text, iw - BD - 18, 17)));
    const free = vby - 16 - y - stepH.reduce((a, b) => a + b, 0);
    const sg = Math.max(12, Math.floor(free / steps.length));
    steps.forEach((k, i) => {
      s.badge({ x: vx, y, d: BD, n: i + 1, color: tintOf(C.crimson, 0.12), textColor: C.crimson, size: 24 });
      s.text(k.title, { x: vx + BD + 18, y: y + 1, w: iw - BD - 18, size: 20, bold: true, lh: 1.1, color: C.navy });
      s.text(k.text, { x: vx + BD + 18, y: y + 28, w: evenW(k.text, iw - BD - 18, 17), size: 17, lh: 1.2, color: C.blueText });
      y += stepH[i] + sg;
    });
    s.box({ x: vx - 8, y: vby, w: iw + 16, h: VBH, fill: C.navy });
    s.text(valT, { x: vx + 12, y: vby, w: iw - 24, h: VBH, size: 18, bold: true, lh: 1.2, color: C.white, align: 'center', valign: 'middle' });

    // ---- value chain ----
    s.card({ x: X0, y: CHY, w: WW, h: CHH });
    s.text('Value chain: как видео работает на бизнес', { x: X0 + P, y: CHY + 18, w: WW - P * 2, size: 22, bold: true, lh: 1.1, color: C.navy });
    const ch = [
      { icon: 'tb:TbDeviceTv', k: 'Video CTV', t: 'объясняет проблему' },
      { icon: 'tb:TbPlayerPlay', k: 'Video OLV', t: 'углубляет понимание' },
      { icon: 'tb:TbUsers', k: 'Узнавание бренда', t: 'знание + связь с ситуацией' },
      { icon: 'tb:TbSearch', k: 'Search / ORM / Где купить', t: 'перехват сформированного спроса' },
      { icon: 'tb:TbChartBar', k: 'Sales / Repeat', t: 'выбор и продажи', main: true },
    ];
    const AW = 40;
    const bw = (WW - P * 2 - AW * (ch.length - 1)) / ch.length;
    const by = CHY + 62;
    const bh = CHH - 62 - 20;
    ch.forEach((k, i) => {
      const x = Math.round(X0 + P + i * (bw + AW));
      s.box({ x, y: by, w: Math.round(bw), h: bh, fill: k.main ? C.navy : C.white, stroke: k.main ? undefined : C.line, sw: 1.5 });
      s.icon(k.icon, { x: x + 16, y: by + (bh - 44) / 2, size: 44, color: k.main ? C.white : C.blue });
      const tx = x + 16 + 44 + 14;
      const tw = Math.round(bw) - (tx - x) - 10;
      s.text(k.k, { x: tx, y: by + 12, w: tw, size: 18, bold: true, lh: 1.1, color: k.main ? C.white : C.navy, fit: true, maxLines: 1, minSize: 14 });
      s.text(k.t, { x: tx, y: by + 38, w: tw, h: bh - 44, size: 16, lh: 1.15, color: k.main ? C.white : C.blueText, fit: true, minSize: 14 });
      if (i < ch.length - 1) s.chevron({ cx: x + Math.round(bw) + AW / 2, cy: by + bh / 2, w: 14, h: 22, color: C.crimson });
    });

    s.footnote('*Источник: AdRiver, общие результаты по РК, усредненный результат по видеоинвентарю');
  },

  // =====================================================================
  // 19 · CTV: сценарии 1 и 2 (картинка → живой текст; подача — как Bobotic 22)
  // =====================================================================
  19: (d) => {
    const s = d.slide({ title: 'CTV как масштабный видеоконтакт для построения знания и доверия в ядре географии' });
    const LC = { x: X0, w: 1150 };
    const RC = { x: LC.x + LC.w + 22, w: X1 - (LC.x + LC.w + 22) };
    const PAD = 28;
    const HD = 42;
    const GAPR = 16;
    const UNI = '**Расчет Universe:** 9,6 млн × 79% (3–10 лет) × 46% от населения РФ';

    const scen = [
      { n: 1, title: 'Сценарий 1: Q1 (янв.–март)', sub: 'Масштабное покрытие в начале года для формирования знания',
        chain: [
          { k: 'Universe', v: '≈3,4 млн', t: 'мам с детьми 3–10 в ядре географии' },
          { k: 'Охват', v: '~60%', t: 'Effective Reach 3+', accent: 'soft' },
          { k: 'Контакты', v: '≈2,1 млн', t: 'мам в контакте 3+' },
          { k: 'Показы', v: '≈7,5 млн', t: 'impressions' },
          { k: 'Бюджет', v: '2,9 млн ₽', t: 'инвестиции', accent: 'main' },
        ],
        facts: ['**CPM:** 390 ₽', '**Период:** 12 недель', '**Эффективная частота:** 3+'] },
      { n: 2, title: 'Сценарий 2: Q1 + Q4 (янв.–фев. + сен.–окт.)', sub: 'Два флайта для усиления знания и поддержания присутствия в высокий сезон',
        chain: [
          { k: 'Universe', v: '≈3,4 млн', t: 'мам с детьми 3–10 в ядре географии' },
          { k: 'Охват', v: '~65%', t: 'Effective Reach 5+', accent: 'soft' },
          { k: 'Контакты', v: '≈2,2 млн', t: 'мам в контакте 5+' },
          { k: 'Показы', v: '≈11 млн', t: 'impressions' },
          { k: 'Бюджет', v: '5 млн ₽', t: 'инвестиции', accent: 'main' },
        ],
        facts: ['**CPM:** 454 ₽', '**Период:** 19 недель', '**Эффективная частота:** 5+'] },
    ];
    const H = Math.floor((CB - TOP - GAPR) / 2);
    const iw = LC.w - PAD * 2;
    const FH = 46;
    scen.forEach((sc, i) => {
      const y0 = TOP + i * (H + GAPR);
      s.card({ x: LC.x, y: y0, w: LC.w, h: H });
      s.badge({ x: LC.x + PAD, y: y0 + 20, d: HD, n: sc.n, color: C.blue, size: 22 });
      s.text(sc.title, { x: LC.x + PAD + HD + 14, y: y0 + 20, w: iw - HD - 14, h: HD, size: 25, bold: true, lh: 1.0, color: C.navy, valign: 'middle',
        fit: true, maxLines: 1, minSize: 19 });
      let y = y0 + 20 + HD + 8;
      y += s.text(sc.sub, { x: LC.x + PAD, y, w: iw, size: 18, lh: 1.2, color: C.navy }) + 10;
      s.text(UNI, { x: LC.x + PAD, y, w: iw, size: 17, lh: 1.2, color: C.blueText, fit: true, maxLines: 1, minSize: 15 });
      // цепочка и строка фактов — от низа карточки
      const fy = y0 + H - 20 - FH;
      const ty = fy - 14 - 118;
      chain(s, sc.chain, { x: LC.x + PAD, y: ty, w: iw, h: 118 });
      s.box({ x: LC.x + PAD, y: fy, w: iw, h: FH, fill: C.cardTint });
      const fw = iw / 3;
      sc.facts.forEach((f, k) => {
        if (k > 0) s.vline(LC.x + PAD + k * fw, fy + 10, FH - 20, C.line, 2);
        s.text(f, { x: LC.x + PAD + k * fw + 10, y: fy, w: fw - 20, h: FH, size: 18, lh: 1.0, color: C.navy, align: 'center', valign: 'middle' });
      });
    });

    // ---- что покупаем внутри CTV ----
    const rw = RC.w - PAD * 2;
    const specs = [
      ['Таргетинг:', 'мамы с детьми 3–10 в ядре географии'],
      ['Инвентарь:', 'Smart TV (MTS)'],
      ['Креатив:', 'AI-видео'],
      ['Роль в медиа-миксе:', 'Reach + Effective Frequency'],
    ];
    const SW = (rw - 12) / 2;
    const sh = [0, 1].map((r) => Math.max(specH(specs[r * 2][0], specs[r * 2][1], SW), specH(specs[r * 2 + 1][0], specs[r * 2 + 1][1], SW)));
    const H1 = 20 + HD + 12 + 30 + 14 + sh[0] + 12 + sh[1] + 24;
    s.card({ x: RC.x, y: TOP, w: RC.w, h: H1 });
    blockHead(s, { x: RC.x + PAD, y: TOP + 20, w: rw, icon: 'tb:TbShoppingCart', text: 'Что покупаем внутри CTV', d: HD });
    let y = TOP + 20 + HD + 12;
    s.text('MTS Premium Package', { x: RC.x + PAD, y, w: rw, size: 25, bold: true, lh: 1.0, color: C.crimson });
    y += 30 + 14;
    specs.forEach(([k, v], i) => {
      const r = Math.floor(i / 2);
      spec(s, { x: Math.round(RC.x + PAD + (i % 2) * (SW + 12)), y: y + (r ? sh[0] + 12 : 0), w: Math.round(SW), h: sh[r], k, v });
    });

    // ---- что получает бренд ----
    const Y2 = TOP + H1 + GAPR;
    s.card({ x: RC.x, y: Y2, w: RC.w, h: CB - Y2 });
    blockHead(s, { x: RC.x + PAD, y: Y2 + 20, w: rw, icon: 'tb:TbTrophy', text: 'Что получает бренд', d: HD });
    gets(s, [
      { k: 'SCALE', t: '**70% ядра ЦА** в целевой географии роста на эффективной частоте', color: C.blue },
      { k: 'RELEVANCE', t: 'Big screen + relevant content', color: C.crimson },
      { k: 'PROOF', t: 'BLS + VTR / completed views + Brand Search / post-view', color: C.navy, even: true },
    ], { x: RC.x + PAD, y: Y2 + 20 + HD + 14, w: rw, h: CB - Y2 - 20 - HD - 14 - 20 });

    s.formula({ text: 'Видео запускает спрос, который перехватывают Search, ORM и другие конверсионные инструменты', color: C.crimson, size: 22 });
  },

  // =====================================================================
  // 20 · Сценарий 3: CTV + OLV (картинка → живой текст)
  // =====================================================================
  20: (d) => {
    const s = d.slide({ title: 'Добавляем к CTV OLV в ядре географии для добора частоты и персонализации сообщения по сегментам' });
    const LC = { x: X0, w: 1150 };
    const RC = { x: LC.x + LC.w + 22, w: X1 - (LC.x + LC.w + 22) };
    const PAD = 28;
    const HD = 42;
    const GAPR = 16;
    const iw = LC.w - PAD * 2;
    const UNI = '**Расчет Universe:** 9,6 млн × 79% (3–10 лет) × 46% от населения РФ';
    const TH = 160;

    // ---- сценарий 3: CTV + OLV ----
    s.card({ x: LC.x, y: TOP, w: LC.w, h: BOT - TOP });
    s.badge({ x: LC.x + PAD, y: TOP + 20, d: HD, n: 3, color: C.blue, size: 22 });
    s.text('Сценарий 3: CTV Q1 (янв.–мар) + OLV авг.–ноя.', { x: LC.x + PAD + HD + 14, y: TOP + 20, w: iw - HD - 14, h: HD, size: 25, bold: true, lh: 1.0,
      color: C.navy, valign: 'middle', fit: true, maxLines: 1, minSize: 19 });
    const olvT = '**InStream слой** качественного контакта на эффективной частоте, а также сегментная точность благодаря precision-таргетингам и персонализации по occasion-based ситуациям';
    const blocks = [
      { k: 'CTV', text: null,
        chain: [
          { k: 'Universe', v: '≈3,4 млн', t: 'мам с детьми 3–10 в ядре географии' },
          { k: 'Охват', v: '~60%', t: 'Effective Reach 3+', accent: 'soft' },
          { k: 'Контакты', v: '≈2,1 млн', t: 'мам в контакте 3+' },
          { k: 'Показы', v: '≈7,5 млн', t: 'impressions' },
          { k: 'Бюджет', v: '2,9 млн ₽', t: 'инвестиции', accent: 'main' },
        ] },
      { k: 'OLV', text: olvT,
        chain: [
          { k: 'Universe', v: '≈3,4 млн', t: 'мам с детьми 3–10' },
          { k: 'Охват', v: '70%', t: 'Effective Reach 5+', accent: 'soft' },
          { k: 'Контакты', v: '2,4 млн', t: 'мам в контакте 5+' },
          { k: 'Показы', v: '≈11 млн', t: 'impressions' },
          { k: 'Бюджет', v: '3,5 млн ₽', t: 'инвестиции', accent: 'main' },
        ] },
    ];
    const PILL = { w: 110, h: 36 };
    const bh = blocks.map((b) => PILL.h + 14 + 22 + (b.text ? 6 + measure(b.text, iw, 18) : 0) + 16 + TH);
    const y0 = TOP + 20 + HD + 16;
    const free = BOT - 24 - y0 - bh.reduce((a, b) => a + b, 0);
    const sep = Math.floor(free * 0.6);
    let y = y0 + Math.floor(free * 0.25);
    blocks.forEach((b, i) => {
      if (i > 0) { s.hline(LC.x + PAD, y - sep / 2, iw); }
      s.pill(b.k, { x: LC.x + PAD, y, w: PILL.w, h: PILL.h, color: C.navy, size: 19 });
      let yy = y + PILL.h + 14;
      s.text(UNI, { x: LC.x + PAD, y: yy, w: iw, size: 17, lh: 1.2, color: C.blueText, fit: true, maxLines: 1, minSize: 15 });
      yy += 22;
      if (b.text) yy += 6 + s.text(b.text, { x: LC.x + PAD, y: yy + 6, w: evenW(b.text, iw, 18), size: 18, lh: 1.2, color: C.navy });
      yy += 16;
      chain(s, b.chain, { x: LC.x + PAD, y: yy, w: iw, h: TH });
      y += bh[i] + sep;
    });

    // ---- что покупаем внутри OLV ----
    const rw = RC.w - PAD * 2;
    const SW = (rw - 12) / 2;
    const s1 = Math.max(specH('Таргетинг:', 'AI / occasion-based / precision segments', SW),
      specH('Креатив:', 'персонализированные occasion-based ролики из master AI-видео', SW));
    const s2 = specH('Роль в медиа-миксе:', 'Reach extension + Effective Frequency', rw);
    const H1 = 20 + HD + 12 + 30 + 14 + s1 + 12 + s2 + 24;
    s.card({ x: RC.x, y: TOP, w: RC.w, h: H1 });
    blockHead(s, { x: RC.x + PAD, y: TOP + 20, w: rw, icon: 'tb:TbShoppingCart', text: 'Что покупаем внутри OLV', d: HD });
    y = TOP + 20 + HD + 12;
    s.text('AI DSPs, InStream Inventory', { x: RC.x + PAD, y, w: rw, size: 25, bold: true, lh: 1.0, color: C.crimson });
    y += 30 + 14;
    spec(s, { x: RC.x + PAD, y, w: Math.round(SW), h: s1, k: 'Таргетинг:', v: 'AI / occasion-based / precision segments' });
    spec(s, { x: Math.round(RC.x + PAD + SW + 12), y, w: Math.round(SW), h: s1, k: 'Креатив:', v: 'персонализированные occasion-based ролики из master AI-видео' });
    spec(s, { x: RC.x + PAD, y: y + s1 + 12, w: rw, h: s2, k: 'Роль в медиа-миксе:', v: 'Reach extension + Effective Frequency' });

    // ---- что получает бренд ----
    const Y2 = TOP + H1 + GAPR;
    s.card({ x: RC.x, y: Y2, w: RC.w, h: BOT - Y2 });
    blockHead(s, { x: RC.x + PAD, y: Y2 + 20, w: rw, icon: 'tb:TbTrophy', text: 'Что получает бренд', d: HD });
    gets(s, [
      { k: 'SCALE', t: 'Выкуп ядра ЦА в целевой географии роста на эффективной частоте в пиковые периоды', color: C.blue },
      { k: 'RELEVANCE', t: 'Precision targeting + occasion-based personalization', color: C.crimson },
      { k: 'PROOF', t: 'BLS + VTR / completed views + Brand Search / post-view', color: C.navy, even: true },
    ], { x: RC.x + PAD, y: Y2 + 20 + HD + 14, w: rw, h: BOT - Y2 - 20 - HD - 14 - 24 });
  },
};
