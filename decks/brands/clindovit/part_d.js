// Клиндовит · стратегия 2027 — часть D: слайды исходника 12–15
// (архитектура кампании 2027 vs 2026, результаты сегментов 2026, барьеры → система видимости, GEO и внешние публикации)
const path = require('path');
const L = require('../../../lib/akrikhin');
const { C, ACCENTS, CHART_COLORS, columns, IN, PT, chartMap, textWidth, fitSize, countLines, typo } = L;
const V = require('../../variants/common');               // TOP, BOT, MUTED, GRID, fmt, pct, statTile, numMark, legend, yearAxis, gridY

// Название сегмента в переводе не влезло в строку — переносим перед возрастом («Young women / 18–25»), а не внутри «18–25»
const ageBreak = (t, w, size) => {
  const v = L.tr(t);
  if (v === t || v.includes('\n') || L.countLines(v, size, w, true) <= 1) return v;
  return v.replace(/ (?=\d+–\d+$)/, '\n');
};
const SRC = path.join(__dirname, '..', '..', '..', 'work', 'brands', 'clindovit', 'src');
const MEDIA = path.join(SRC, 'media');
const CROPS = path.join(SRC, 'crops');   // d_seg1..3.png — фото сегментов, вырезанные из картинки слайда 13 (скругление в PNG, углы цветом карточки)

// Ширина / число строк так, как текст окажется на слайде (с переводом и типографикой)
const strip = (t) => String(t).replace(/\*\*|\[\[|\]\]/g, '');
const wOf = (t, size, bold = false) => textWidth(typo(strip(L.tr(t))), size, bold);
const linesOf = (t, size, w, bold = false) => countLines(typo(strip(L.tr(t))), size, w, bold);
// Ширина блока, при которой текст занимает столько же строк, но строки ровнее — без висящего последнего слова
const evenW = (t, w, size, bold = false) => {
  const n = linesOf(t, size, w, bold);
  if (n < 2) return w;
  let lo = w * 0.4;
  let hi = w;
  while (hi - lo > 1) { const m = (lo + hi) / 2; if (linesOf(t, size, m, bold) <= n) hi = m; else lo = m; }
  return Math.min(w, Math.ceil(hi) + 4);
};

// Ярлык статуса канала (NEW) — как в деке Acriol Pro
function tag(s, t, x, y) {
  const w = Math.ceil(wOf(t, 14, true)) + 20;
  s.box({ x, y, w, h: 26, fill: t === 'NEW' ? C.crimson : C.blue, r: 13 });
  s.text(t, { x, y, w, h: 26, size: 14, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
  return w;
}

// Список каналов / сегментов: строка + ярлык статуса сразу после неё
function chanList(s, items, { x, y, w, size = 19, pitch = 30 }) {
  items.forEach((it, i) => {
    const [t, tg] = Array.isArray(it) ? it : [it];
    const yy = y + i * pitch;
    const tagW = tg ? Math.ceil(wOf(tg, 14, true)) + 20 : 0;
    const maxW = w - (tg ? tagW + 12 : 0);
    s.text(t, { x, y: yy, w: maxW, size, color: C.navy, fit: true, maxLines: 1, minSize: 15 });
    if (tg) tag(s, tg, x + Math.min(Math.ceil(wOf(t, size)), maxW) + 12, yy + Math.round((size * 1.2 - 26) / 2));
  });
  return items.length * pitch;
}

module.exports = {
  // ===================== 12 · Архитектура кампании 2027 vs 2026 (аналог Acriol 14) =====================
  12: (d) => {
    const s = d.slide({
      title: 'Клиндовит 2027: архитектура кампании vs 2026',
      subtitle: 'В 2027 сохраняем сегментный подход, усиливая перехват спроса на этапе рассмотрения',
    });
    const LB = { x: 58, w: 236 };     // метки слоёв
    const A = { x: 314, w: 600 };     // 2026
    const B = { x: 1062, w: 800 };    // 2027
    const G = { x: A.x + A.w, w: B.x - A.x - A.w };   // зазор со стрелками прироста

    // ---- шапки колонок: год и бюджет тотал ----
    const head = (X, year, value, color) => {
      s.text(year, { x: X.x, y: 221, w: X.w, size: 24, bold: true, lh: 1.0, color });
      const vw = Math.ceil(wOf(value, 56, true));
      s.text(value, { x: X.x, y: 250, w: vw + 8, size: 56, bold: true, lh: 1.0, color });
      // звёздочка — ссылка на сноску о тех. костах (в исходнике у тотала её нет, но сноска относится к нему)
      s.text('млн ₽*', { x: X.x + vw + 14, y: 272, w: Math.ceil(wOf('млн ₽*', 28, true)) + 8, size: 28, bold: true, lh: 1.0, color });
    };
    head(A, '2026', '8,9', C.navy);
    head(B, '2027', '15,9', C.crimson);

    const SEG = ['Ж 18–25 Social girl', 'Ж 35–50 родители подростков', 'Ж 25–34 бизнес/офис'];
    const rows = [
      { label: 'AWARENESS', icon: 'tb:TbSpeakerphone', color: C.sky, delta: '+1,1 млн ₽',
        a: { title: 'Recruitment новой ЦА:\nмай–июнь, авг, сен–окт', budget: '5,1 млн ₽',
          lists: [['Каналы', ['Native', 'Social', 'Programmatic', 'Bloggers']], ['Сегменты', SEG]] },
        b: { title: 'Recruitment новой ЦА: март–май, июль–сентябрь', budget: '6,2 млн ₽',
          lists: [['Каналы', ['Programmatic AI DSP', 'Bloggers']], ['Сегменты', SEG]] } },
      { label: 'CONSIDERATION', icon: 'tb:TbScale', color: C.crimson, delta: '+3,4 млн ₽',
        a: { title: 'ORM — единичный слой, бустящий рассмотрение к покупке', budget: '1,5 млн ₽',
          lists: [['Каналы', ['ORM']]] },
        b: { title: 'Усиливаем присутствие в момент выбора, повышаем AI-видимость, перехватываем спрос', budget: '4,9 млн ₽',
          lists: [['Каналы', [['Внешние публикации — статьи', 'NEW'], ['GEO', 'NEW'], 'ORM']],
            ['Слои', ['Помогает, пока пользуюсь', 'От косметики к лекарству', 'Хочу быстрее, но боюсь переборщить']]] } },
      { label: 'INTENT', icon: 'tb:TbShoppingCart', color: C.navy, delta: '+1,6 млн ₽',
        a: { title: 'Frequency: повторный контакт и поддержка спроса', budget: '1,6 млн ₽', lists: [['Каналы', ['Paid Search']]] },
        b: { title: 'Обрабатываем горячий спрос и приводим к покупке', budget: '3,2 млн ₽', lists: [['Каналы', ['Paid Search']]] } },
    ];

    const PAD = 28;
    const BS = 32;      // кегль бюджета блока
    const TS = 19;      // кегль заголовка блока
    const PITCH = 30;
    const geo = (X, c) => {
      const pw = X.w - PAD * 2;
      const bw = Math.ceil(wOf(c.budget, BS, true)) + 8;
      const tw = pw - bw - 20;
      return { pw, bw, tw, th: Math.round(linesOf(c.title, TS, tw, true) * TS * 1.15) };
    };
    // высота строки — по самому длинному заголовку и списку в обеих колонках
    rows.forEach((r) => {
      r.headH = Math.max(BS + 6, geo(A, r.a).th, geo(B, r.b).th);
      const n = Math.max(...[r.a, r.b].flatMap((c) => c.lists.map(([, items]) => items.length)));
      r.h = 18 + r.headH + 14 + 14 + 30 + n * PITCH + 10;
    });
    const GAP = 14;
    let y = 326;
    rows.forEach((r) => { r.y = y; y += r.h + GAP; });

    const cell = (X, r, c, { accent, tint, split }) => {
      s.card({ x: X.x, y: r.y, w: X.w, h: r.h, tint });
      const px = X.x + PAD;
      const { pw, bw, tw } = geo(X, c);
      s.text(c.title, { x: px, y: r.y + 20, w: tw, size: TS, bold: true, lh: 1.15, color: C.navy });
      s.text(c.budget, { x: X.x + X.w - PAD - bw, y: r.y + 16, w: bw, size: BS, bold: true, lh: 1.0, color: accent, align: 'right' });
      const ly = r.y + 18 + r.headH + 14;
      s.hline(px, ly, pw);
      const gap = 24;
      const w1 = c.lists.length === 1 ? pw : Math.round(pw * split) - gap / 2;
      const widths = c.lists.length === 1 ? [pw] : [w1, pw - w1 - gap];
      let lx = px;
      c.lists.forEach(([title, items], k) => {
        if (k > 0) s.vline(lx - gap / 2, ly + 14, r.y + r.h - ly - 28);
        s.label(title, { x: lx, y: ly + 14, w: widths[k], size: 16, color: C.blueText });
        chanList(s, items, { x: lx, y: ly + 44, w: widths[k], pitch: PITCH });
        lx += widths[k] + gap;
      });
    };

    rows.forEach((r) => {
      s.tile({ x: LB.x, y: r.y, w: LB.w, h: r.h, color: r.color, text: r.label, icon: r.icon, iconSize: 52, size: 22, textH: 30 });
      cell(A, r, r.a, { accent: C.navy, split: 0.42 });
      cell(B, r, r.b, { accent: C.crimson, tint: true, split: 0.5 });
      // прирост бюджета слоя 2027 vs 2026 (расчёт OMD)
      const mid = r.y + Math.round(r.h / 2);
      s.text(r.delta, { x: G.x + 4, y: mid - 34, w: G.w - 8, size: 20, bold: true, lh: 1.0, color: C.crimson, align: 'center', fit: true, maxLines: 1, minSize: 16 });
      s.arrow({ dir: 'right', x: G.x + 18, y: mid + 4, len: G.w - 36, head: 24, headLen: 14, stem: 4, color: C.crimson });
    });

    s.footnote('*Бюджеты тотал представлены с учетом тех костов, АК и РС, бюджеты блоков указаны с АК и РС без учета тех костов. Приросты 2027 vs 2026 — расчёт OMD');
  },

  // ===================== 13 · Comprehensive-подход: результаты сегментов 2026 =====================
  13: (d) => {
    const s = d.slide({
      title: 'Comprehensive-подход: результаты 2026 подтверждают релевантность сегментов и задают learning agenda на 2027 год',
      subtitle: 'Все 3 сегмента остаются рабочими. В 2027 году фокус смещается на усиление персонализации сообщений и тест новых клеймов, чтобы точнее отрабатывать мотивацию аудитории и акцентировать скорость решения проблемы.',
    });
    // цвета сегментов — как на слайде 10 (1 — малиновый, 2 — синий, 3 — фиолетовый)
    const segs = [
      { n: 1, color: C.crimson, photo: 'd_seg1.png', name: 'Девушки 18–25', desc: 'Сегмент с сильным вовлечением и качественным трафиком',
        stats: [['0,26%', 'CTR'], ['476', 'конверсий «Где купить»'], ['4,38%', 'CR']],
        learning: 'Лучше остальных приводит на сайт заинтересованную аудиторию и формирует качественный трафик.' },
      { n: 2, color: C.blue, photo: 'd_seg2.png', name: 'Мамы подростков\n35–55', desc: 'Наиболее сильный сегмент по конечной конверсии',
        stats: [['0,25%', 'CTR'], ['503', 'конверсии «Где купить»'], ['4,77%', 'CR']],
        learning: 'Несмотря на более дорогой визит, сегмент лучше остальных доходит до целевого действия и подтверждает роль мамы как покупателя.' },
      { n: 3, color: C.purple, photo: 'd_seg3.png', name: 'Женщины 25–40', desc: 'Релевантный сегмент, требующий донастройки сообщений',
        stats: [['0,27%', 'CTR'], ['453', 'конверсии «Где купить»'], ['4,24%', 'CR']],
        learning: 'Сегмент хорошо реагирует на рекламу, но требует более точного сообщения и усиления акцента на быстром решении проблемы.' },
    ];
    // колонки строки
    const X0 = 58;
    const X1 = 1862;
    const PH = { x: X0 + 16 };                         // фото
    const NM = { x: 264, w: 330 };                     // сегмент
    const ST = { x: 614, w: 664 };                     // результаты 2026: 3 цифры (отступ 20 после разделителя)
    const SW = [214, 236, 194];                        // ширины колонок цифр: CTR, конверсии, CR
    const LR = { x: 1294, w: X1 - 16 - 1294 };         // learning
    const HY = 221;
    const RY = 262;
    const RH = 200;
    const GAP = 14;

    // заголовки колонок
    s.text('СЕГМЕНТ', { x: PH.x, y: HY, w: 400, size: 20, bold: true, lh: 1.0, color: C.navy });
    s.text('РЕЗУЛЬТАТЫ 2026', { x: ST.x + 20, y: HY, w: ST.w - 20, size: 20, bold: true, lh: 1.0, color: C.navy });
    s.text('LEARNING', { x: LR.x + 24, y: HY, w: LR.w - 24, size: 20, bold: true, lh: 1.0, color: C.navy });

    segs.forEach((g, i) => {
      const y = RY + i * (RH + GAP);
      s.card({ x: X0, y, w: X1 - X0, h: RH });
      // фото: кадр 198×208 (пропорция вырезки), высота — по строке
      const ph = RH - 28;
      const pw = Math.round(ph * 198 / 208);
      s.image(path.join(CROPS, g.photo), { x: PH.x, y: y + 14, w: pw, h: ph, alt: g.name });
      // сегмент: номер + название, описание
      s.badge({ x: NM.x, y: y + 26, d: 40, n: g.n, color: g.color, size: 21 });
      const nh = s.text(ageBreak(g.name, NM.w - 54, 26), { x: NM.x + 54, y: y + 28, w: NM.w - 54, size: 26, bold: true, lh: 1.1, color: C.navy, fit: true, maxLines: 2, minSize: 22 });
      s.text(g.desc, { x: NM.x, y: y + 28 + Math.max(nh, 36) + 14, w: NM.w, size: 18, lh: 1.2, color: C.blueText });
      s.vline(ST.x - 4, y + 24, RH - 48);
      // три цифры результатов 2026
      let cx = ST.x + 20;
      g.stats.forEach(([value, label], k) => {
        s.text(value, { x: cx, y: y + 50, w: SW[k] - 16, size: 48, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 36 });
        s.text(label, { x: cx, y: y + 110, w: SW[k] - 12, size: 18, lh: 1.2, color: C.blueText, fit: true, maxLines: 2, minSize: 15 });
        cx += SW[k];
      });
      // learning
      s.box({ x: LR.x, y: y + 14, w: LR.w, h: RH - 28, fill: C.cardTint });
      s.icon('tb:TbBulb', { x: LR.x + 24, y: y + Math.round((RH - 52) / 2), size: 52, color: C.white, circle: g.color });
      s.text(g.learning, { x: LR.x + 96, y: y + 14, w: evenW(g.learning, LR.w - 96 - 24, 19), h: RH - 28, size: 19, lh: 1.2, color: C.navy, valign: 'middle', fit: true, minSize: 16 });
    });

    s.principle({ label: 'Вывод по сегментам', icon: 'tb:TbChartBar',
      text: 'Сегменты подтверждены Media & post-click результатами → в 2027 году тестируем новые клеймы с акцентом на скорость решения проблемы' });
  },

  // ===================== 14 · Барьеры выбора → система видимости =====================
  14: (d) => {
    const s = d.slide({
      title: 'Барьеры выбора задают систему видимости Клиндовита',
      subtitle: 'Каналы переводят реальные вопросы пользователей в понятные роли: где бренд находят, объясняют и подтверждают',
    });
    // ---- логика раздела: 3 шага ----
    const steps = [
      ['Барьеры аудитории', 'что мешает выбрать Клиндовит'],
      ['Система видимости', 'где закрываем вопрос пользователя'],
      ['Детализация каналов', ''],
    ];
    const SG = 60;
    const sc = columns(3, { gap: SG });
    const SY = 221;
    const SH = 78;
    steps.forEach(([t, sub], i) => {
      const { x, w } = sc[i];
      s.card({ x, y: SY, w, h: SH, tint: true });
      s.badge({ x: x + 20, y: SY + 16, d: 46, n: i + 1, color: C.blue, size: 23 });
      const tx = x + 84;
      const tw = w - 84 - 20;
      if (sub) {
        s.text(t, { x: tx, y: SY + 12, w: tw, size: 22, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 18 });
        s.text(sub, { x: tx, y: SY + 43, w: tw, size: 17, lh: 1.0, color: C.blueText, fit: true, maxLines: 1, minSize: 15 });
      } else {
        s.text(t, { x: tx, y: SY, w: tw, h: SH, size: 22, bold: true, lh: 1.0, color: C.navy, valign: 'middle', fit: true, maxLines: 1, minSize: 18 });
      }
      if (i < steps.length - 1) s.chevron({ cx: x + w + SG / 2, cy: SY + SH / 2, color: C.blue });
    });

    // ---- две части: барьеры (слева) и инструменты (справа) ----
    const LX = 58;
    const LW = 590;
    const RX = 678;
    const RW = 1862 - RX;
    const HY = 322;
    const CY = 370;
    const CG = 18;
    const CH = Math.floor((1005 - CY - CG * 2) / 3);
    s.text('От барьера к сценарию выбора', { x: LX, y: HY, w: LW, size: 26, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 21 });
    s.text('Инструменты единой системы видимости', { x: RX, y: HY, w: RW, size: 26, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 21 });

    const barriers = [
      ['tb:TbRefresh', 'Помогает, пока пользуюсь', 'Снимаем тревогу о возврате проблемы и показываем, как поддерживать результат.'],
      ['tb:TbPill', 'От косметики к лекарству', 'Помогаем перейти от бесконечных экспериментов к понятному аптечному решению.'],
      ['tb:TbShieldCheck', 'Хочу быстрее, но боюсь переборщить', 'Объясняем правильное применение и снимаем страх раздражения.'],
    ];
    barriers.forEach(([icon, t, txt], i) => {
      const y = CY + i * (CH + CG);
      s.card({ x: LX, y, w: LW, h: CH });
      s.icon(icon, { x: LX + 28, y: y + Math.round((CH - 84) / 2), size: 84, color: C.blue, circle: C.tint });
      const tx = LX + 136;
      const tw = LW - 136 - 28;
      // заголовок + текст — блоком по центру карточки
      const th0 = Math.round(linesOf(t, 26, tw, true) * 26 * 1.1);
      const bh0 = Math.round(linesOf(txt, 20, tw) * 20 * 1.2);
      const ty = y + Math.max(20, Math.round((CH - th0 - 10 - bh0) / 2));
      // двухстрочный заголовок — с ровным переносом («Хочу быстрее, / но боюсь переборщить»)
      const th = s.text(L.balanceTitle(t, 26, tw), { x: tx, y: ty, w: tw, size: 26, bold: true, lh: 1.1, color: C.navy });
      s.text(txt, { x: tx, y: ty + th + 10, w: evenW(txt, tw, 20), size: 20, lh: 1.2, color: C.blueText });
    });

    const tools = [
      ['SEO', 'Фундамент поиска', 'Страницы и семантика под запросы о лечении, возврате и применении.', 'tb:TbSearch'],
      ['GEO / AEO', 'Присутствие в ИИ-ответах', 'Факты о бренде считываются в ответах по акне и аптечному решению.', 'tb:TbMessageChatbot'],
      ['Внешние публикации', 'Независимое подтверждение', 'Экспертные материалы создают источники за пределами сайта бренда.', 'tb:TbFileText'],
      ['ORM + сообщества', 'Доверие в живых сценариях', 'Отзывы и Q&A снимают страхи, возражения и сомнения.', 'tb:TbUsers'],
      ['Paid Search', 'Захват намерения', 'Забирает спрос по категории, симптомам, конкурентам и e-pharm.', 'tb:TbTarget'],
      ['Блогеры', 'Объяснение простым языком', 'Переводят сложный выбор в понятный опыт применения и покупки.', 'tb:TbVideo'],
    ];
    const tc = columns(2, { x0: RX, x1: 1862, gap: 16 });
    tools.forEach(([name, kicker, txt, icon], i) => {
      const { x, w } = tc[i % 2];
      const y = CY + Math.floor(i / 2) * (CH + CG);
      const hot = name === 'Paid Search';
      const accent = hot ? C.crimson : C.blue;
      s.card({ x, y, w, h: CH, tint: hot });
      s.badge({ x: x + 24, y: y + 24, d: 46, n: i + 1, color: accent, size: 23 });
      const tx = x + 86;
      s.icon(icon, { x: x + w - 24 - 56, y: y + 22, size: 56, color: accent, circle: hot ? C.white : C.tint });
      s.text(name, { x: tx, y: y + 28, w: w - 86 - 24 - 70, size: 28, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 20 });
      s.text(kicker, { x: tx, y: y + 68, w: w - 86 - 24 - 70, size: 20, bold: true, lh: 1.0, color: accent, fit: true, maxLines: 1, minSize: 16 });
      s.text(txt, { x: tx, y: y + 106, w: evenW(txt, w - 86 - 28, 20), h: CH - 106 - 14, size: 20, lh: 1.2, color: C.blueText, fit: true, minSize: 16 });
    });
  },

  // ===================== 15 · GEO и внешние публикации (скрытый) =====================
  15: (d) => {
    const s = d.slide({
      title: 'GEO и внешние публикации — инструменты, где мы можем делать больший упор на экспертный контент',
      subtitle: 'Экспертный контент позволяет подробно рассказывать о преимуществах бренда и влиять на выбор в ключевые моменты поиска решения.',
    });
    s.s.hidden = true;
    const cols = columns(3, { gap: 24 });
    const CY = 221;
    const CH = 618;
    const pad = 32;

    // шапка карточки: номер + КАПС-заголовок (как в Acriol 16)
    const cardHead = (x, w, n, title, dark) => {
      s.badge({ x: x + pad, y: CY + 26, d: 44, n, color: dark ? C.crimson : C.blue, size: 22 });
      // по центру номера: при уменьшенном кегле (длинный заголовок) строка не «подпрыгивает»
      s.text(title.toUpperCase(), { x: x + pad + 58, y: CY + 26, w: w - pad * 2 - 58, h: 44, size: 24, bold: true, lh: 1.0,
        color: dark ? C.white : C.navy, valign: 'middle', fit: true, maxLines: 1, minSize: 18 });
      return CY + 96;
    };
    // пункт с иконкой в кружке
    const point = (x, y, w, icon, text, { dark } = {}) => {
      s.icon(icon, { x, y, size: 48, color: dark ? C.white : C.blue, circle: dark ? C.blue : C.tint });
      return Math.max(48, s.text(text, { x: x + 66, y: y + 1, w: evenW(text, w - 66, 20), size: 20, lh: 1.2, color: dark ? C.white : C.navy }));
    };

    const intros = [
      'Создаём экспертные внешние публикации о Клиндовите: как работает, когда применять, на что обратить внимание.',
      'Помогаем аудитории находить верную и полезную информацию о Клиндовите в поиске и AI-сервисах.',
    ];
    const iw = cols[0].w - pad * 2;
    const introH = Math.max(...intros.map((t) => Math.round(linesOf(t, 20, iw) * 20 * 1.2)));
    const PY = CY + 96 + introH + 24;   // пункты в карточках 1 и 2 — на одной высоте
    // примеры из макетов исходника — внизу карточек 1 и 2, верх на одной высоте
    const ans = '**Клиндовит** — гель для лечения угревой сыпи с антибактериальным действием. Помогает уменьшить воспаления и способствует более чистой коже.';
    const ah = Math.round(linesOf(ans, 17, iw - 40) * 17 * 1.2) + 28;
    const ay = CY + CH - pad - ah;
    const qy = ay - 12 - 48;

    // 1 · внешние публикации
    {
      const { x, w } = cols[0];
      s.card({ x, y: CY, w, h: CH });
      const y0 = cardHead(x, w, 1, 'Внешние публикации');
      s.text(intros[0], { x: x + pad, y: y0, w: iw, size: 20, lh: 1.2, color: C.blueText });
      let y = PY;
      [['tb:TbFileText', 'Простым языком объясняем пользу и преимущества'],
        ['tb:TbShieldCheck', 'Снимаем частые вопросы и сомнения'],
        ['tb:TbUsers', 'Формируем доверие к бренду через экспертный контент']]
        .forEach(([ic, t]) => { y += point(x + pad, y, iw, ic, t) + 20; });
      // пример публикации (из макета статьи в исходнике)
      const bh = CY + CH - pad - qy;
      s.box({ x: x + pad, y: qy, w: iw, h: bh, fill: C.white, stroke: C.line, sw: 2 });
      s.icon('tb:TbArticle', { x: x + pad + 24, y: qy + Math.round((bh - 64) / 2), size: 64, color: C.white, circle: C.blue });
      s.text('«Как быстро и правильно лечить угревую сыпь?»', { x: x + pad + 112, y: qy, w: iw - 112 - 24, h: bh, size: 24, bold: true, lh: 1.15, color: C.navy, valign: 'middle', fit: true, minSize: 18 });
    }
    // 2 · GEO-контент и ответы в AI-сервисах
    {
      const { x, w } = cols[1];
      s.card({ x, y: CY, w, h: CH });
      const y0 = cardHead(x, w, 2, 'GEO-контент и ответы в AI-сервисах');
      s.text(intros[1], { x: x + pad, y: y0, w: iw, size: 20, lh: 1.2, color: C.blueText });
      let y = PY;
      [['tb:TbSearch', 'Клиндовит появляется в ответах на ключевые вопросы пользователей'],
        ['tb:TbMessageDots', 'Доносим выгоды бренда в момент активного поиска решения'],
        ['tb:TbFileText', 'Повышаем заметность бренда в новых источниках информации']]
        .forEach(([ic, t]) => { y += point(x + pad, y, iw, ic, t) + 20; });
    }
    // 3 · что это даёт бренду (тёмная)
    {
      const { x, w } = cols[2];
      s.box({ x, y: CY, w, h: CH, fill: C.navy, r: 25 });
      let y = cardHead(x, w, 3, 'Что это даёт бренду', true);
      const items = [
        ['tb:TbChartBar', 'Возможность подробно и убедительно коммуницировать ключевые выгоды Клиндовита: эффективность, антибактериальное действие, удобная форма, доступная цена'],
        ['tb:TbUsers', 'Влияет на выбор в момент, когда человек ищет информацию и сравнивает варианты'],
        ['tb:TbLeaf', 'Усиливает знание бренда и формирует доверие за счёт экспертного контента'],
      ];
      const bx = x + 20;
      const bw = w - 40;
      // три блока делят высоту карточки поровну; самый длинный текст должен влезть
      const BG = 16;
      const bh = Math.floor((CY + CH - 20 - y - BG * (items.length - 1)) / items.length);
      items.forEach(([ic, t]) => {
        s.box({ x: bx, y, w: bw, h: bh, fill: C.navy2 });
        s.icon(ic, { x: bx + 20, y: y + Math.round((bh - 54) / 2), size: 54, color: C.white, circle: C.blue });
        s.text(t, { x: bx + 94, y: y + 10, w: bw - 94 - 20, h: bh - 20, size: 20, lh: 1.2, color: C.white, valign: 'middle', fit: true, minSize: 17 });
        y += bh + BG;
      });
    }
    // ответ AI-сервиса (из макета телефона в исходнике) — внизу карточки 2
    {
      const { x } = cols[1];
      const qw = Math.ceil(wOf('Чем лечить прыщи?', 18)) + 84;
      s.box({ x: x + pad, y: qy, w: qw, h: 48, fill: C.cardTint, r: 24 });
      s.icon('tb:TbSparkles', { x: x + pad + 16, y: qy + 10, size: 28, color: C.purple });
      s.text('Чем лечить прыщи?', { x: x + pad + 54, y: qy, w: qw - 64, h: 48, size: 18, lh: 1.0, color: C.navy, valign: 'middle' });
      s.box({ x: x + pad, y: ay, w: iw, h: ah, fill: C.white, stroke: C.line, sw: 2 });
      s.text(ans, { x: x + pad + 20, y: ay + 14, w: iw - 40, size: 17, lh: 1.2, color: C.blueText });
    }

    // ---- роль в пути пользователя: цепочка ----
    const SY = CY + CH + 20;
    const SH = 1003 - SY;
    s.card({ x: 58, y: SY, w: 1804, h: SH, tint: true });
    const mid = SY + Math.round(SH / 2);
    s.text('РОЛЬ В ПУТИ ПОЛЬЗОВАТЕЛЯ', { x: 90, y: mid - 26, w: 200, h: 52, size: 20, bold: true, lh: 1.1, color: C.navy, valign: 'middle', fit: true, minSize: 16 });
    const nodes = [
      ['tb:TbSearch', 'Ищет информацию о проблеме'],
      ['tb:TbFileText', 'Читает внешние публикации'],
      ['tb:TbMessageDots', 'Получает ответы в GEO / AI-сервисах'],
      ['tb:TbBulb', 'Узнаёт о Клиндовите и его преимуществах'],
      ['tb:TbShoppingCart', 'Выбирает Клиндовит'],
    ];
    const NX0 = 316;
    const NX1 = 1840;
    const AW = 46;                                 // стрелка между узлами
    const NW = Math.floor((NX1 - NX0 - AW * (nodes.length - 1)) / nodes.length);
    nodes.forEach(([ic, t], i) => {
      const nx = NX0 + i * (NW + AW);
      const last = i === nodes.length - 1;
      const color = last ? C.crimson : C.blue;
      s.icon(ic, { x: nx, y: mid - 28, size: 56, color: C.white, circle: color });
      s.text(t, { x: nx + 68, y: mid - 32, w: NW - 70, h: 64, size: 19, bold: last, lh: 1.2, color: last ? C.crimson : C.navy, valign: 'middle', fit: true, minSize: 15 });
      if (!last) s.arrow({ dir: 'right', x: nx + NW + 6, y: mid, len: AW - 12, head: 20, headLen: 12, stem: 4, color: C.blue });
    });
  },
};
