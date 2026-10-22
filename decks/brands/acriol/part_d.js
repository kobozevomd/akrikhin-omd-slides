// Акриол Про · стратегия 2027 — часть D: слайды исходника 19–23.
// 19 — микс площадок (кольцо + описания + «один DOL — не один выход»), 20 — поддерживающий слой (Авито),
// 21 — структура Paid Search, 22 — digital-календарь 2027 (своя сетка-гант), 23 — итог: что даёт рост инвестиций.
const path = require('path');
const { C, columns, countLines, textWidth, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common'); // TOP, MUTED, GRID
const SRC = path.join(__dirname, '..', '..', '..', 'work', 'brands', 'acriol', 'src');
const MEDIA = path.join(SRC, 'media');

const TOP = V.TOP;      // 221
const BOT = 905;        // низ контента над плашкой
const BOT0 = 1005;      // низ контента без плашки

// ---------- Локальные хелперы ----------

// Строка так, как её увидит слайд (перевод + типографика), без разметки
const view = (t) => typo(tr(String(t))).replace(/\*\*|\[\[|\]\]/g, '');
// Высота текста так же, как её оценивает s.text
const measure = (t, w, size = 16, bold = false, lh = 1.2) => Math.round(countLines(view(t), size, w, bold) * size * lh);
const widthOf = (t, size, bold = false) => Math.ceil(textWidth(view(t), size, bold));

// Данные графика со слайда исходника
function chartData(n, k = 0) {
  const j = require(path.join(SRC, `slide-${String(n).padStart(2, '0')}.json`));
  const p = j.shapes.filter((sh) => sh.t === 'CHART')[k].chart.plots[0];
  return { labels: p.cats.map((c) => String(c).trim()), values: p.series[0].values };
}

// Плашка-чип (канал, посадочная): ширина по тексту, возвращает ширину
function chip(s, text, { x, y, h = 40, size = 17, fill = C.tint, color = C.blueText, padX = 20 }) {
  const w = widthOf(text, size, true) + padX * 2;
  s.box({ x, y, w, h, fill, r: h / 2 });
  s.text(text, { x, y, w, h, size, bold: true, lh: 1.0, color, align: 'center', valign: 'middle' });
  return w;
}

module.exports = {
  // ===================== 19. Микс площадок =====================
  19: (d) => {
    const s = d.slide({
      title: 'Потенциал оптимизации стоимости проф. контакта через микс площадок',
      subtitle: 'Сплит учитывает Digital-присутствие выбранных DOL, потенциал CPV, органический добор просмотров и глубину профессионального контакта',
    });
    const J = chartData(19); // Telegram 30 / Instagram* 25 / VK 20 / YouTube 15 / Дзен 10
    const PL = [
      { name: 'Telegram*', tag: 'FREQUENCY', role: 'TG — частота', color: C.navy,
        text: 'Профильная аудитория пула DOL: регулярность контакта, экспертные посты, видео, кейсы, повторные касания' },
      { name: 'Instagram*', tag: 'VISUAL REACH', role: 'IG — органический охват', color: C.blue,
        text: 'Естественная визуальная среда косметологии: процедуры, аппараты, Reels. Органический добор + личный бренд врача' },
      { name: 'VK / VK Video / Clips', tag: 'SCALE', role: 'VK — масштаб', color: C.cyan,
        text: 'Масштабирование контента DOL и video reach через врачей, клиники и школы. Снижение средневзвешенного CPV' },
      { name: 'YouTube*', tag: 'EXPERT DEPTH', role: 'YouTube — доверие', color: V.MUTED, ink: C.navy,
        text: 'Глубокий контакт: интервью, разбор процедуры, протоколы. Формирует доверие, материал используется повторно' },
      { name: 'Дзен', tag: 'LONG-TAIL', role: 'Дзен — долгий хвост', color: C.crimson,
        text: 'Экспертные статьи и поисковый трафик. Контент продолжает получать просмотры после завершения флайта' },
    ].map((p, i) => ({ ...p, v: Math.round(J.values[i]), cat: J.labels[i] }));
    const total = PL.reduce((a, p) => a + p.v, 0);

    // --- A: кольцо + роли площадок ---
    const A = { x: 58, y: TOP, w: 540, h: BOT - TOP };
    s.card(A);
    const D = 400;
    const cx = A.x + A.w / 2;
    const cy = A.y + 30 + D / 2;
    s.chart('doughnut', [{ name: 'Сплит по площадкам, %', labels: PL.map((p) => p.cat), values: PL.map((p) => p.v) }],
      { x: cx - D / 2, y: cy - D / 2, w: D, h: D, colors: PL.map((p) => p.color), hole: 60, values: false, legend: false,
        extra: { layout: { x: 0, y: 0, w: 1, h: 1 } } });
    // отверстие — кругом цвета карточки (LibreOffice не понимает holeSize)
    const hd = Math.round(D * 0.6);
    s.circle({ x: cx - hd / 2, y: cy - hd / 2, d: hd, fill: C.card });
    s.text('100%', { x: cx - hd / 2, y: cy - 52, w: hd, size: 54, bold: true, lh: 1.0, color: C.navy, align: 'center' });
    s.text('PROFESSIONAL CONTENT', { x: cx - 92, y: cy + 10, w: 184, size: 16, bold: true, lh: 1.15, color: C.blueText, align: 'center' });
    // подписи долей на кольце: 0° — «12 часов», по часовой стрелке
    let acc = 0;
    PL.forEach((p) => {
      const a = ((acc + p.v / 2) / total) * 2 * Math.PI;
      acc += p.v;
      const r = D * 0.4;
      const lx = cx + r * Math.sin(a);
      const ly = cy - r * Math.cos(a);
      s.text(`${p.v}%`, { x: lx - 44, y: ly - 13, w: 88, size: 24, bold: true, lh: 1.0, color: p.ink ?? C.white, align: 'center' });
    });
    // роли площадок — легенда кольца
    const ly0 = cy + D / 2 + 34;
    const lstep = (A.y + A.h - 30 - ly0) / PL.length;
    PL.forEach((p, i) => {
      const y = ly0 + i * lstep;
      s.circle({ x: A.x + 44, y: y + 3, d: 18, fill: p.color });
      s.text(p.role, { x: A.x + 76, y, w: A.w - 110, size: 19, bold: true, lh: 1.1, color: C.navy, fit: true, maxLines: 1, minSize: 16 });
    });

    // --- B: роли и доли площадок ---
    const B = { x: 620, y: TOP, w: 640, h: BOT - TOP };
    s.card(B);
    const rh = B.h / PL.length;
    PL.forEach((p, i) => {
      const y0 = B.y + i * rh;
      if (i) s.hline(B.x + 28, y0, B.w - 56);
      const tx = B.x + 58;
      const tw = B.w - 58 - 30;
      s.box({ x: B.x + 30, y: y0 + 22, w: 7, h: rh - 44, fill: p.color, r: 3 });
      s.text(p.name, { x: tx, y: y0 + 20, w: tw - 140, size: 22, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 18 });
      s.text(p.tag, { x: tx, y: y0 + 49, w: tw - 140, size: 14, bold: true, lh: 1.0, color: C.crimson });
      s.text(`${p.v}%`, { x: B.x + B.w - 30 - 150, y: y0 + 14, w: 150, size: 44, bold: true, lh: 1.0, color: p.ink ?? p.color, align: 'right' });
      s.text(p.text, { x: tx, y: y0 + 74, w: tw, h: rh - 74 - 14, size: 16, lh: 1.2, color: C.blueText, fit: true, minSize: 14 });
    });

    // --- C: один DOL → не один выход ---
    const Cc = { x: 1282, y: TOP, w: 580, h: BOT - TOP };
    s.card(Cc);
    const ix = Cc.x + 32;
    const iw = Cc.w - 64;
    s.label('Один DOL → не один выход', { x: ix, y: Cc.y + 32, w: iw, size: 22, color: C.crimson });
    const sy = Cc.y + 72;
    const sh = 64;
    s.box({ x: ix, y: sy, w: iw, h: sh, fill: C.navy });
    s.icon('tb:TbFileText', { x: ix + 18, y: sy + 16, size: 32, color: C.white });
    s.text('Один сильный экспертный материал', { x: ix + 64, y: sy, w: iw - 80, h: sh, size: 20, bold: true, lh: 1.1, color: C.white, valign: 'middle', fit: true, maxLines: 2, minSize: 17 });
    // ветви: YouTube → Instagram → Telegram → VK → Дзен (порядок исходника)
    const OUT = [
      { c: PL[3], t: '**YouTube*** — полный профессиональный разбор' },
      { c: PL[1], t: '**Instagram*** — Reels / короткие фрагменты' },
      { c: PL[0], t: '**Telegram*** — экспертный пост / видео / обсуждение' },
      { c: PL[2], t: '**VK** — Clip / Video / пост' },
      { c: PL[4], t: '**Дзен** — экспертная статья / текстовая версия' },
    ];
    const trunk = ix + 26;
    const bx = ix + 56;
    const bw = iw - 56;
    const NOTE = 'Не производим пять независимых материалов — масштабируем один сильный экспертный контент между площадками';
    const nh = measure(NOTE, iw - 44, 18, true) + 36;
    const ny = Cc.y + Cc.h - 30 - nh;
    const hs = OUT.map((o) => measure(o.t, bw - 58, 18) + 24);
    const top0 = sy + sh + 22;
    const gap = Math.min(26, (ny - 24 - top0 - hs.reduce((a, b) => a + b, 0)) / (OUT.length - 1));
    let y = top0;
    const mids = [];
    OUT.forEach((o, i) => {
      s.box({ x: bx, y, w: bw, h: hs[i], fill: C.white, stroke: C.line, sw: 1.5, r: 12 });
      s.circle({ x: bx + 20, y: y + hs[i] / 2 - 8, d: 16, fill: o.c.color });
      s.text(o.t, { x: bx + 48, y: y + 12, w: bw - 58, size: 18, lh: 1.2, color: C.navy });
      mids.push(y + hs[i] / 2);
      y += hs[i] + gap;
    });
    s.vline(trunk, sy + sh, mids[mids.length - 1] - sy - sh, C.blue, 2);
    mids.forEach((m) => s.hline(trunk, m, bx - trunk, C.blue, 2));
    s.box({ x: ix, y: ny, w: iw, h: nh, fill: C.cardTint });
    s.text(NOTE, { x: ix + 22, y: ny + 18, w: iw - 44, size: 18, bold: true, lh: 1.2, color: C.navy });

    s.principle({ label: 'Принцип', w: 1300, text: 'TG создает частоту. Instagram* дает органику. VK масштабирует.\nYouTube строит доверие. **Дзен продлевает контакт.**' });
    // сноски: сплит + звёздочка (юр. согласование; Instagram — Meta)
    s.footnote('Сплит предварительный и уточняется после получения фактической статистики выбранных DOL, ставок и прогнозного CPV по каждой площадке.', { y: 1030 });
    const F1 = '* Форматы работы с площадками требуют отдельного юридического согласования на 2027.';
    const w1 = widthOf(F1, 14) + 10;
    s.footnote(F1, { y: 1050, w: w1 + 20 });
    s.footnote('Instagram принадлежит Meta, деятельность которой признана экстремистской и запрещена в РФ', { x: 58 + w1, y: 1050, w: 1804 - w1 });
  },

  // ===================== 20. Поддерживающий слой: Авито =====================
  20: (d) => {
    const s = d.slide({
      title: 'Поддерживающий слой: мастера и потребители масштабируют уже сформированный профессиональный выбор',
      subtitle: 'Avito Test&Learn 2026 подтверждает потенциал precise targeting - используем как доказанный слой, дополняющий HCP/DOL',
    });
    s.notes('https://brandanalytics.ru/blog/social-media-russia-autumn-2025');

    // --- левая карточка: результаты теста Авито ---
    const L = { x: 58, y: TOP, w: 1110, h: BOT0 - TOP };
    s.card(L);
    const lx = L.x + 34;
    const lw = L.w - 68;
    s.label('Авито', { x: lx, y: L.y + 32, w: lw, color: C.blue });
    const h1 = s.text('**Кастомный таргетинг + персонализированные креативы:** косметология / для салона красоты, татуаж, эпиляция, потребители beauty-услуг',
      { x: lx, y: L.y + 68, w: lw, size: 20, lh: 1.2, color: C.navy });
    // две конверсии против плана
    const CR = [
      { v: '11%', name: 'CR «Куки-баннер»', plan: 'план 4,5%', x: 'в 2,4 раза выше плана' },
      { v: '1,61%', name: 'CR «Где купить»', plan: 'план 0,6%', x: 'в 2,7 раза выше плана' },
    ];
    const sy = L.y + 68 + h1 + 24;
    const sh = 150;
    const sw = (lw - 22) / 2;
    CR.forEach((c, i) => {
      const x = lx + i * (sw + 22);
      s.box({ x, y: sy, w: sw, h: sh, fill: C.cardTint });
      s.text(c.v, { x: x + 26, y: sy, w: 200, h: sh, size: 64, bold: true, lh: 1.0, color: C.blue, valign: 'middle', fit: true, maxLines: 1, minSize: 48 });
      const tx = x + 250;
      const tw = sw - 250 - 20;
      s.text(c.name, { x: tx, y: sy + 30, w: tw, size: 20, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 16 });
      s.text(c.plan, { x: tx, y: sy + 62, w: tw, size: 18, lh: 1.0, color: C.blueText });
      s.text(c.x, { x: tx, y: sy + 92, w: tw, size: 18, bold: true, lh: 1.15, color: C.crimson, fit: true, maxLines: 2, minSize: 15 });
    });

    // CTR по сегментам против плана 0,10%
    const by = sy + sh + 34;
    const cw = 690;
    s.label('CTR теста 2026 по сегментам', { x: lx, y: by, w: cw, size: 20, color: C.blue });
    const segs = ['Мастера', 'Косметологи', 'Татуаж', 'Эпиляция', 'Потребители'];
    const ctr = [0.13, 0.16, 0.15, 0.14, 0.16];
    const P = { x: lx, y: by + 64, w: cw - 112, h: L.y + L.h - 34 - 34 - (by + 64) };
    const m = s.chart('col', [{ name: 'CTR, %', labels: segs, values: ctr }],
      { x: P.x, y: P.y - 30, w: P.w, h: P.h + 30, plot: P, min: 0, max: 0.18, format: '0.00"%"', labelSize: 20, labelBold: true, gap: 70,
        extra: { catAxisHidden: true } });
    const py = m.val(0.1);
    s.seg(P.x, py, P.x + P.w + 8, py, { color: C.crimson, width: 2.5, dash: 'dash' });
    s.text('план 0,10%', { x: P.x + P.w + 14, y: py - 22, w: cw - P.w - 14, h: 44, size: 17, bold: true, lh: 1.1, color: C.crimson, valign: 'middle', fit: true, maxLines: 2, minSize: 14 });
    s.hline(P.x, P.y + P.h, P.w, C.line, 1.5);
    // один кегль для всех подписей категорий
    let gs = 17;
    while (gs > 13 && segs.some((g) => widthOf(g, gs, true) > m.step - 4)) gs -= 1;
    segs.forEach((g, i) => s.text(g, { x: m.cat(i) - m.step / 2, y: P.y + P.h + 8, w: m.step, size: gs, bold: true, lh: 1.0, color: C.blueText, align: 'center' }));

    // креативы
    const kx = lx + cw + 50;
    s.vline(kx - 26, by, L.y + L.h - 34 - by);
    const IMG = [
      { t: 'Медийный стандарт', f: 'img_e40ca34be4.png', w: 249, h: 144 },
      { t: 'Нативный баннер', f: 'img_3baba6ed36.png', w: 202, h: 143 },
    ];
    // одна ширина у обоих превью (края совпадают), высота — по пропорциям файла
    const iw = 258;
    let iy = by;
    IMG.forEach((im) => {
      s.text(im.t, { x: kx, y: iy, w: L.x + L.w - 34 - kx, size: 17, bold: true, lh: 1.0, color: C.navy });
      const ih = Math.round((iw * im.h) / im.w);
      s.box({ x: kx - 1, y: iy + 29, w: iw + 2, h: ih + 2, fill: C.white, stroke: C.line, sw: 1.5, r: 4 });
      s.image(path.join(MEDIA, im.f), { x: kx, y: iy + 30, w: iw, h: ih, alt: im.t });
      iy += 30 + ih + 32;
    });

    // --- правая карточка: дополнительные возможности ---
    const R = { x: 1190, y: TOP, w: 672, h: BOT0 - TOP };
    s.card(R);
    const rx = R.x + 34;
    const rw = R.w - 68;
    s.label('Дополнительные возможности', { x: rx, y: R.y + 32, w: rw, color: C.navy });
    const SEC = [
      { lab: 'Мастера', head: 'Расширяем использование', color: C.blue, icon: 'tb:TbBrush',
        text: '**Лазерная эпиляция, ПМ, тату:**\nаргументы по процедуре, удобству и профессиональной ценности → персонализированный LP',
        ch: ['Avito'] },
      { lab: 'Потребители', head: 'Переводим интерес в покупку', color: C.green, icon: 'tb:TbShoppingCart',
        text: '**Инъекции, аппаратные процедуры, эпиляция:**\nподтверждение рекомендации специалиста → на e-pharm',
        ch: ['Avito', 'Social MAX', 'Paid Search'] },
    ];
    const half = (R.h - 76) / 2;
    SEC.forEach((sc, i) => {
      const top = R.y + 76 + i * half;
      if (i) s.hline(rx, top, rw);
      const ch = 108 + measure(sc.text, rw, 21, false, 1.25) + 26 + 42;
      const y0 = top + Math.max(0, (half - ch) / 2) - (i ? 0 : 10);
      s.icon(sc.icon, { x: rx, y: y0 + 4, size: 68, color: C.white, circle: sc.color });
      s.label(sc.lab, { x: rx + 92, y: y0 + 6, w: rw - 92, color: sc.color });
      s.text(sc.head, { x: rx + 92, y: y0 + 38, w: rw - 92, size: 29, bold: true, lh: 1.05, color: C.navy, fit: true, maxLines: 1, minSize: 22 });
      const th = s.text(sc.text, { x: rx, y: y0 + 108, w: rw, size: 21, lh: 1.25, color: C.blueText });
      let cx = rx;
      sc.ch.forEach((c) => { cx += chip(s, c, { x: cx, y: y0 + 108 + th + 26, size: 18, h: 42 }) + 12; });
    });
    s.footnote('Кратность к плану — расчёт OMD');
  },

  // ===================== 21. Структура Paid Search 2027 =====================
  21: (d) => {
    const s = d.slide({
      title: 'Обновленная структура Paid Search 2027: перехватываем спрос и сокращаем путь до покупки',
      subtitle: 'Поиск - конверсионное ядро; РСЯ - поддержка с фокусом на качество post-click',
    });
    const COLS = [{ x: 58, w: 690 }, { x: 770, w: 520 }, { x: 1312, w: 550 }];
    const ACC = [C.blue, C.cyan, C.navy2];
    const TITLES = ['Как распределяем спрос в поиске', 'Куда ведём', 'Роль РСЯ'];
    const PAD = 36;
    COLS.forEach((c, i) => {
      s.numberedCard({ x: c.x, y: TOP, w: c.w, h: BOT - TOP, n: i + 1, color: ACC[i], d: 70, pad: PAD });
      s.text(TITLES[i].toUpperCase(), { x: c.x + PAD, y: TOP + 92, w: c.w - PAD * 2, size: 24, bold: true, lh: 1.0, color: ACC[i], fit: true, maxLines: 1, minSize: 18 });
    });
    const y0 = TOP + 140;

    // --- 1. распределение спроса ---
    {
      const x = COLS[0].x + PAD;
      const w = COLS[0].w - PAD * 2;
      const DEM = [
        { v: 30, t: 'Категория', to: 'Сайт', d: 'забираем сформированный категорийный спрос', color: C.blue, core: true },
        { v: 29, t: 'Транзакционная + бренд', to: 'Аптека.ru', d: 'сокращаем путь от спроса до покупки', color: C.navy, core: true },
        { v: 17, t: 'Конкуренты', to: 'Сайт', d: 'перехватываем выбор альтернатив', color: '7F9DC4', ink: C.navy, core: false },
        { v: 24, t: 'Процедурные запросы', to: 'Сайт', d: '8% татуаж · 8% косметология · 8% эпиляция', color: V.MUTED, ink: C.navy, core: false },
      ];
      const core = DEM.filter((r) => r.core).reduce((a, r) => a + r.v, 0); // 59
      s.text(`${core}%`, { x, y: y0 - 6, w: 170, size: 64, bold: true, lh: 1.0, color: C.crimson });
      s.text('ядро Search: транзакционно-брендовый + категорийный спрос', { x: x + 172, y: y0 - 4, w: w - 172, h: 66, size: 20, bold: true, lh: 1.15, color: C.navy, valign: 'middle', fit: true, minSize: 16 });
      // полоса 100% спроса, скобка над ядром
      const P = { x, y: y0 + 96, w, h: 52 };
      const m = s.chart('bar', DEM.map((r) => ({ name: r.t, labels: ['Спрос в поиске'], values: [r.v] })),
        { x: P.x, y: P.y, w: P.w, h: P.h, plot: P, min: 0, max: 100, stacked: true, values: false, legend: false, gap: 0,
          colors: DEM.map((r) => r.color), extra: { catAxisHidden: true, catAxisLineShow: false } });
      let a = 0;
      DEM.forEach((r) => {
        const x1 = m.val(a);
        const x2 = m.val(a + r.v);
        s.text(`${r.v}%`, { x: x1, y: P.y, w: x2 - x1, h: P.h, size: 20, bold: true, lh: 1.0, color: r.ink ?? C.white, align: 'center', valign: 'middle' });
        a += r.v;
      });
      const bxe = m.val(core);
      s.box({ x: P.x, y: P.y - 16, w: bxe - P.x, h: 7, fill: C.crimson, r: 3 });
      // строки
      const ry0 = P.y + P.h + 30;
      const rstep = (BOT - 30 - ry0) / DEM.length;
      DEM.forEach((r, i) => {
        const y = ry0 + i * rstep;
        if (i) s.hline(x, y - 10, w);
        s.box({ x, y: y + 2, w: 64, h: 56, fill: r.color, r: 12 });
        s.text(`${r.v}%`, { x, y: y + 2, w: 64, h: 56, size: 19, bold: true, lh: 1.0, color: r.ink ?? C.white, align: 'center', valign: 'middle' });
        const tx = x + 84;
        const cwid = widthOf('→ ' + r.to, 16, true) + 30;
        s.text(r.t.toUpperCase(), { x: tx, y: y + 4, w: w - 84 - cwid - 10, size: 18, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 15 });
        chip(s, '→ ' + r.to, { x: x + w - cwid, y: y - 2, h: 32, size: 16, padX: 15, fill: r.to === 'Сайт' ? C.tint : C.blue, color: r.to === 'Сайт' ? C.blueText : C.white });
        s.text(r.d, { x: tx, y: y + 32, w: w - 84, size: 17, lh: 1.2, color: C.blueText, fit: true, maxLines: 2, minSize: 15 });
      });
    }

    // --- 2. куда ведём ---
    {
      const x = COLS[1].x + PAD;
      const w = COLS[1].w - PAD * 2;
      s.pill('Семантика → посадочная → действие', { x, y: y0, w, h: 60, size: 19, color: C.navy });
      const FL = [
        { sem: 'Транзакционная + бренд', land: 'Аптека', act: 'Максимально приближаем пользователя к факту покупки', fill: C.blue },
        { sem: 'Категория · конкуренты · процедуры', land: 'Сайт', act: 'Формируем следующий шаг:\n«Где купить» / «Куки-баннер»', fill: C.cyan },
      ];
      const fh = FL.map((f) => measure(f.sem.toUpperCase(), w, 19, true, 1.1) + 12 + 30 + 10 + 58 + 14 + measure(f.act, w, 18));
      const area = BOT - 30 - (y0 + 60 + 28);
      const between = area - fh[0] - fh[1];
      let y = y0 + 60 + 28;
      FL.forEach((f, i) => {
        const sh = s.text(f.sem.toUpperCase(), { x, y, w, size: 19, bold: true, lh: 1.1, color: C.navy });
        let yy = y + sh + 12;
        s.chevron({ cx: x + 40, cy: yy + 15, dir: 'down', w: 22, h: 30, color: C.crimson });
        yy += 30 + 10;
        s.box({ x, y: yy, w, h: 58, fill: f.fill });
        s.text(f.land.toUpperCase(), { x: x + 20, y: yy, w: w - 40, h: 58, size: 24, bold: true, lh: 1.0, color: C.white, valign: 'middle' });
        yy += 58 + 14;
        s.text(f.act, { x, y: yy, w, size: 18, lh: 1.2, color: C.blueText });
        if (i === 0) s.hline(x, y + fh[0] + between / 2, w);
        y += fh[i] + between;
      });
    }

    // --- 3. роль РСЯ ---
    {
      const x = COLS[2].x + PAD;
      const w = COLS[2].w - PAD * 2;
      s.pill('РСЯ', { x, y: y0, w: 130, h: 60, size: 22, color: C.navy });
      s.text('поддержка, а не замена Поиску', { x: x + 150, y: y0, w: w - 150, h: 60, size: 21, bold: true, lh: 1.1, color: C.navy, valign: 'middle', fit: true, maxLines: 2, minSize: 17 });
      const ST = [
        { t: 'Все запросы → сайт', d: 'Структура кампаний сохраняется: РСЯ ведёт пользователя на сайт' },
        { t: 'Доля ниже поиска', d: 'Качество трафика стабильно ниже Search - не масштабируем только ради объёма' },
        { t: 'Фокус на post-click', d: 'Глубина просмотра · время на сайте · роботность · qCPV' },
      ];
      const bd = 46;
      const tx = x + bd + 20;
      const tw = w - bd - 20;
      const hs = ST.map((it) => 6 + measure(it.t, tw, 21, true, 1.05) + 10 + measure(it.d, tw, 18));
      const sy = y0 + 60 + 36;
      const gap = (BOT - 34 - sy - hs.reduce((a, b) => a + b, 0)) / (ST.length - 1);
      let y = sy;
      const ys = [];
      ST.forEach((it, i) => { ys.push(y); y += hs[i] + gap; });
      s.vline(x + bd / 2, sy + bd / 2, ys[ys.length - 1] - sy, C.line, 1.5);
      ST.forEach((it, i) => {
        s.badge({ x, y: ys[i], d: bd, n: `0${i + 1}`, color: C.tint, textColor: C.blueText, size: 19 });
        const th = s.text(it.t, { x: tx, y: ys[i] + 8, w: tw, size: 21, bold: true, lh: 1.05, color: C.navy });
        s.text(it.d, { x: tx, y: ys[i] + 8 + th + 10, w: tw, size: 18, lh: 1.2, color: C.blueText });
      });
    }

    s.principle({ label: 'Принцип', w: 1460, text: 'Приоритет - транзакционно-брендовый спрос и категория. Конкуренты и процедурные кластеры работают как дополнительный источник спроса с контролируемой долей бюджета.' });
  },

  // ===================== 22. Digital support calendar 2027 =====================
  22: (d) => {
    const s = d.slide({ title: 'Digital support calendar 2027: flowchart' });

    // --- полоса KPI: бюджет со сплитом + медиа-KPI ---
    const KY = TOP;
    const KH = 136;
    const BW = 640;
    s.box({ x: 58, y: KY, w: BW, h: KH, fill: C.blue, r: 25 });
    s.text('BUDGET', { x: 92, y: KY + 24, w: 220, size: 18, bold: true, lh: 1.0, color: C.white });
    s.text('13,1M', { x: 92, y: KY + 52, w: 240, size: 60, bold: true, lh: 1.0, color: C.white, fit: true, maxLines: 1, minSize: 44 });
    s.vline(330, KY + 22, KH - 44, C.white, 1.5);
    const sx = 356;
    const sw = 58 + BW - 30 - sx;
    s.text('Бюджетный сплит*', { x: sx, y: KY + 22, w: sw, size: 16, bold: true, lh: 1.0, color: C.white, caps: true, fit: true, maxLines: 1, minSize: 13 });
    [['Digital media', '12M'], ['Production', '900K'], ['Adriver', '200K']].forEach(([k, v], i) => {
      const y = KY + 52 + i * 25;
      s.text(k, { x: sx, y, w: sw - 90, size: 18, lh: 1.0, color: C.white });
      s.text(v, { x: sx + sw - 90, y, w: 90, size: 18, bold: true, lh: 1.0, color: C.white, align: 'right' });
    });
    const KX = 58 + BW + 22;
    const KW = 1862 - KX;
    s.card({ x: KX, y: KY, w: KW, h: KH });
    s.text('Media KPIs', { x: KX + 30, y: KY, w: 150, h: KH, size: 22, bold: true, lh: 1.1, color: C.crimson, valign: 'middle', fit: true, maxLines: 2, minSize: 17 });
    const KPI = [['15M', 'Impressions'], ['1,5M', 'Tech. reach'], ['810K', 'Unique reach'], ['85K', 'Clicks'], ['47K', 'Visits'], ['13,5K', 'Conversions «cookie-banner»']];
    const k0 = KX + 190;
    const kw = (KX + KW - 24 - k0) / KPI.length;
    KPI.forEach(([v, t], i) => {
      const x = k0 + i * kw;
      if (i) s.vline(x - 12, KY + 26, KH - 52);
      s.text(v, { x, y: KY + 24, w: kw - 20, size: 40, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 30 });
      s.text(t, { x, y: KY + 74, w: kw - 20, h: 42, size: 16, lh: 1.15, color: C.blueText, fit: true, maxLines: 2, minSize: 14 });
    });

    // --- календарь: своя сетка (инфо-колонки + 12 месяцев, полосы активности) ---
    const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const a = 1; // активный период
    const b = 2; // буст / приоритетный флайт
    const SEG3 = 'Врачи-косметологи / Мастера / Потребители';
    const ROWS = [
      { ch: 'DOL', sup: 'VK, Дзен', fmt: 'Медийный формат', seg: SEG3, bud: '2,8M', sob: '24%', m: [0, 0, b, b, b, 0, 0, 0, b, b, b, 0] },
      { ch: 'Внешние авторитетные публикации', sup: 'HCP / Медицинские редакционные площадки / Справочники и e-pharm', fmt: 'Статьи, проф. контент', seg: SEG3, bud: '1,2M', sob: '10%', m: [0, a, a, a, a, 0, 0, a, a, a, a, 0] },
      { ch: 'Programmatic', sup: 'Авито', fmt: 'Медийный формат', seg: SEG3, bud: '1,7M', sob: '14%', m: [0, 0, b, b, b, 0, 0, 0, b, b, b, 0] },
      { ch: 'Social', sup: 'MAX', fmt: 'Пост', seg: SEG3, bud: '700K', sob: '6%', m: [0, 0, b, b, b, 0, 0, 0, b, b, b, 0] },
      { ch: 'GEO', sup: 'AI answers', fmt: 'GEO-оптимизация под AI-ответы', seg: '', bud: '1,8M', sob: '15%', m: [a, a, a, a, a, a, a, a, a, a, a, a] },
      { ch: 'ORM', sup: 'Reviews / forums\nSERP / e-pharm cards', fmt: 'Отзывы, обзоры, Q&A, дискуссии', seg: '', bud: '1M', sob: '8%', m: [0, a, a, a, a, 0, 0, a, a, a, a, 0] },
      { ch: 'Paid Search', sup: 'Yandex Direct\ne-pharm co-promo', fmt: 'Текст+баннеры', seg: 'Врачи-косметологи / Потребители', bud: '2,7M', sob: '23%', m: [a, a, a, a, a, a, a, a, a, a, a, a] },
    ];
    const STAGES = [['Охват', 0, 1], ['Экспертность', 1, 3], ['Спрос', 4, 3]];
    const X0 = 58;
    const CW = { st: 142, ch: 190, sup: 226, fmt: 170, seg: 208, bud: 84, sob: 74 };
    const cx = {};
    let acc = X0;
    for (const k of Object.keys(CW)) { cx[k] = acc; acc += CW[k]; }
    const MX = acc;
    const MW = (1862 - MX) / 12;
    const PADX = 10;
    const PADY = 12;
    const FS = 16;
    // высоты строк по самому высокому тексту
    const rowT = ROWS.map((r) => (Math.max(
      measure(r.ch, CW.ch - 2 * PADX, 17, true, 1.15),
      measure(r.sup, CW.sup - 2 * PADX, FS, false, 1.15),
      measure(r.fmt, CW.fmt - 2 * PADX, FS, false, 1.15),
      r.seg ? measure(r.seg, CW.seg - 2 * PADX, FS, false, 1.15) : 0)));
    let rowH = rowT.map((t) => Math.max(66, t + 2 * PADY));
    const HY = KY + KH + 26;
    const HH = 42;
    const TH = 46;
    // свободное место до низа контента — поровну в строки; если тесно (длинный перевод) — ужимаем поля строк
    const spare = BOT0 - 4 - TH - (HY + HH) - rowH.reduce((a2, b2) => a2 + b2, 0);
    if (spare > 0) rowH = rowH.map((h) => h + Math.min(24, spare / ROWS.length));
    else rowH = rowT.map((t) => Math.max(t + 8, Math.max(66, t + 2 * PADY) + spare / ROWS.length));
    // шапка
    s.box({ x: X0, y: HY, w: 1862 - X0, h: HH, fill: C.navy, r: 0 });
    const HEAD = [['Этап', 'st'], ['Канал', 'ch'], ['Поставщики', 'sup'], ['Формат', 'fmt'], ['Сегмент', 'seg'], ['Бюджет', 'bud'], ['SOB %', 'sob']];
    HEAD.forEach(([t, k]) => s.text(t.toUpperCase(), { x: cx[k] + PADX - (k === 'bud' || k === 'sob' ? 6 : 0), y: HY, w: CW[k] - 2 * PADX + (k === 'bud' || k === 'sob' ? 12 : 0), h: HH, size: 14, bold: true, lh: 1.0, color: C.white,
      valign: 'middle', align: k === 'bud' || k === 'sob' ? 'center' : 'left', fit: true, maxLines: 1, minSize: 11 }));
    MON.forEach((t, i) => s.text(t, { x: MX + i * MW, y: HY, w: MW, h: HH, size: 14, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' }));
    // строки
    const ys = [];
    let y = HY + HH;
    ROWS.forEach((r, i) => { ys.push(y); y += rowH[i]; });
    const yEnd = y;
    // сетка месяцев
    for (let i = 0; i <= 12; i++) s.vline(MX + i * MW, HY + HH, yEnd - HY - HH, i === 0 ? C.line : V.GRID, i === 0 ? 1.5 : 1.25);
    ROWS.forEach((r, i) => {
      const y0 = ys[i];
      const h = rowH[i];
      s.hline(cx.ch, y0 + h, 1862 - cx.ch, C.line, 1.5);
      const cell = (k, t, o = {}) => s.text(t, { x: cx[k] + PADX, y: y0, w: CW[k] - 2 * PADX, h, size: o.size ?? FS, bold: !!o.bold, lh: 1.15,
        color: o.color ?? C.blueText, valign: 'middle', align: o.align ?? 'left' });
      cell('ch', r.ch, { size: 17, bold: true, color: C.navy });
      cell('sup', r.sup);
      cell('fmt', r.fmt);
      if (r.seg) cell('seg', r.seg);
      cell('bud', r.bud, { size: 17, bold: true, color: C.navy, align: 'center' });
      cell('sob', r.sob, { size: 16, align: 'center' });
      // полосы активности: непрерывные отрезки одного типа
      let k = 0;
      while (k < 12) {
        const v = r.m[k];
        let e = k;
        while (e + 1 < 12 && r.m[e + 1] === v) e++;
        if (v) {
          const bh = v === b ? 30 : 22;
          s.box({ x: MX + k * MW + 5, y: y0 + (h - bh) / 2, w: (e - k + 1) * MW - 10, h: bh, fill: v === b ? C.crimson : 'A6CDEE', r: bh / 2 });
        }
        k = e + 1;
      }
    });
    // этапы
    STAGES.forEach(([t, i0, n]) => {
      const yy = ys[i0] + 3;
      const hh = ys[i0 + n - 1] + rowH[i0 + n - 1] - ys[i0] - 6;
      s.box({ x: X0 + 3, y: yy, w: CW.st - 10, h: hh, fill: C.cardTint, r: 10 });
      s.text(t.toUpperCase(), { x: X0 + 10, y: yy, w: CW.st - 24, h: hh, size: 15, bold: true, lh: 1.1, color: C.navy, valign: 'middle', fit: true, maxLines: 2, minSize: 12 });
    });
    // итог
    s.box({ x: X0, y: yEnd, w: 1862 - X0, h: TH, fill: C.navy, r: 0 });
    s.text('TOTAL', { x: cx.ch + PADX, y: yEnd, w: CW.ch, h: TH, size: 16, bold: true, lh: 1.0, color: C.white, valign: 'middle' });
    s.text('12M', { x: cx.bud, y: yEnd, w: CW.bud, h: TH, size: 17, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
    s.text('100%', { x: cx.sob, y: yEnd, w: CW.sob, h: TH, size: 16, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });

    // легенда + сноска
    const LGY = 1034;
    const lg = [['A6CDEE', 22, 'активный период'], [C.crimson, 22, 'буст / приоритетный флайт']];
    let lxx = 1790;   // правее — номер страницы
    [...lg].reverse().forEach(([col, bh, t]) => {
      const tw = widthOf(t, 15) + 6;
      lxx -= tw;
      s.text(t, { x: lxx, y: LGY, w: tw, size: 15, lh: 1.0, color: C.blueText });
      lxx -= 52;
      s.box({ x: lxx, y: LGY - 2, w: 42, h: 20, fill: col, r: 10 });
      lxx -= 30;
    });
    s.footnote('*Бюджет до НДС, включая АК/РС');
  },

  // ===================== 23. Итог: что даёт рост инвестиций =====================
  23: (d) => {
    const s = d.slide({ title: 'Акриол Про 2027', subtitle: 'Что дает рост инвестиций vs 2026' });

    // --- три плитки: цель, инвестиции, медиа-масштаб ---
    const cols = columns(3, { gap: 22 });
    const TH = 150;
    const TILES = [
      { lab: 'Бизнес-цель 2027', v: '802 млн ₽', sub: ['+9% к 2026'], color: C.crimson },
      { lab: 'Инвестиции', v: '9,5 → 13,1 млн ₽', sub: ['+38% vs 2026'], color: C.blue },
      { lab: 'Медиа-масштаб', v: '15M показов', sub: ['1,5M tech. reach', '810K unique reach'], color: C.navy2 },
    ];
    TILES.forEach((t, i) => {
      const { x, w } = cols[i];
      s.box({ x, y: TOP, w, h: TH, fill: t.color, r: 25 });
      s.text(t.lab.toUpperCase(), { x: x + 30, y: TOP + 22, w: w - 60, size: 18, bold: true, lh: 1.0, color: C.white });
      s.text(t.v, { x: x + 30, y: TOP + 50, w: w - 60, size: 52, bold: true, lh: 1.0, color: C.white, fit: true, maxLines: 1, minSize: 38 });
      let sx = x + 30;
      t.sub.forEach((u, k) => {
        const uw = widthOf(u, 20, k === 0) + 4;
        s.text(u, { x: sx, y: TOP + 114, w: Math.min(uw, x + w - 30 - sx), size: 20, bold: k === 0, lh: 1.0, color: C.white });
        sx += uw + 26;
      });
    });

    const MY = TOP + TH + 24;
    const BY = 885;         // нижняя полоса-вывод
    const MH = BY - 22 - MY;

    // --- слева: как масштабируем (фазы года) ---
    const L = { x: 58, w: 1010 };
    s.card({ x: L.x, y: MY, w: L.w, h: MH });
    const lx = L.x + 34;
    const lw = L.w - 68;
    s.label('Как масштабируем Comprehensive в 2027', { x: lx, y: MY + 30, w: lw, size: 22, color: C.blue });
    const PH = {
      AON: { color: C.blue, name: 'AON', per: 'янв–фев, июл–авг', ch: 'GEO/AEO + ORM + Paid Search + внешние публикации',
        d: 'забирают сформированный спрос и сохраняют присутствие в моменте выбора весь год' },
      SPR: { color: C.crimson, name: 'Sprint 1 + 2', per: 'мар–май, сен–ноя', ch: 'DOLs + Programmatic HCP + Social',
        d: 'формируют профессиональное предпочтение и усиливают контакт с косметологами, мастерами и потребителями' },
      CAP: { color: C.cyan, name: 'Capture', per: 'июн, дек', ch: 'Search + retargeting + e-pharm CTA',
        d: 'в июне и декабре конвертируют высокий сезонный интерес и возвращают заинтересованных пользователей к покупке' },
    };
    const YEAR = ['AON', 'AON', 'SPR', 'SPR', 'SPR', 'CAP', 'AON', 'AON', 'SPR', 'SPR', 'SPR', 'CAP'];
    const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const gy = MY + 74;
    const gg = 4;
    const gw = (lw - gg * 11) / 12;
    YEAR.forEach((p, i) => {
      const x = lx + i * (gw + gg);
      s.box({ x, y: gy, w: gw, h: 40, fill: PH[p].color, r: 8 });
      s.text(MON[i], { x, y: gy, w: gw, h: 40, size: 15, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
    });
    const rows = ['AON', 'SPR', 'CAP'];
    const PW = 200;
    const tx = lx + PW + 30;
    const tw = lw - PW - 30;
    const rh = rows.map((k) => Math.max(44 + 8 + 20, measure(PH[k].ch, tw, 19, true, 1.1) + 6 + measure(PH[k].d, tw, 17)));
    const ry0 = gy + 40 + 30;
    const rgap = (MY + MH - 28 - ry0 - rh.reduce((a2, b2) => a2 + b2, 0)) / (rows.length - 1);
    let ry = ry0;
    rows.forEach((k, i) => {
      const p = PH[k];
      if (i) s.hline(lx, ry - rgap / 2, lw);
      s.pill(p.name, { x: lx, y: ry, w: PW, h: 44, size: 19, color: p.color, caps: true });
      s.text(p.per, { x: lx, y: ry + 52, w: PW, size: 16, bold: true, lh: 1.0, color: C.blueText, align: 'center' });
      const ch = s.text(p.ch, { x: tx, y: ry, w: tw, size: 19, bold: true, lh: 1.1, color: C.navy });
      s.text(p.d, { x: tx, y: ry + ch + 6, w: tw, size: 17, lh: 1.2, color: C.blueText });
      ry += rh[i] + rgap;
    });

    // --- справа: зоны расширения ---
    const R = { x: L.x + L.w + 22, w: 1862 - (L.x + L.w + 22) };
    s.card({ x: R.x, y: MY, w: R.w, h: MH });
    const rx = R.x + 34;
    const rw = R.w - 68;
    s.label('Зоны расширения', { x: rx, y: MY + 30, w: rw, size: 22, color: C.blue });
    const Z = [
      { t: 'Профессиональное предпочтение', d: 'DOL + HCP/Programmatic создают профессиональное подтверждение до момента поиска и защищают привычный выбор' },
      { t: 'Рост в аппаратном секторе', d: 'Аппаратная косметология - ключевая зона роста: меняем критерий «косметическое = профессиональное» на надежность ЛП и управляемый протокол через DOL' },
      { t: 'AI visibility stream & conversion', d: 'GEO/AEO + ORM + авторитетные внешние публикации + Paid Search возвращают Акриол Про в момент сравнения и ведут к e-pharm' },
    ];
    const bd = 46;
    const ztx = rx + bd + 20;
    const ztw = rw - bd - 20;
    const zh = Z.map((z) => 6 + measure(z.t, ztw, 21, true, 1.05) + 8 + measure(z.d, ztw, 17));
    const zy0 = MY + 80;
    const zgap = (MY + MH - 28 - zy0 - zh.reduce((a2, b2) => a2 + b2, 0)) / (Z.length - 1);
    let zy = zy0;
    Z.forEach((z, i) => {
      if (i) s.hline(ztx, zy - zgap / 2, ztw);
      s.badge({ x: rx, y: zy, d: bd, n: `0${i + 1}`, color: C.tint, textColor: C.blueText, size: 19 });
      const th = s.text(z.t, { x: ztx, y: zy + 8, w: ztw, size: 21, bold: true, lh: 1.05, color: C.navy });
      s.text(z.d, { x: ztx, y: zy + 8 + th + 8, w: ztw, size: 17, lh: 1.2, color: C.blueText });
      zy += zh[i] + zgap;
    });

    // --- нижняя полоса-вывод: от Search-first к Professional-first ---
    const BH = 1019 - BY;
    s.box({ x: 58, y: BY, w: 1804, h: BH, fill: C.crimson, r: 25 });
    const blw = 470;
    s.text('Как расширяем Comprehensive в 2027'.toUpperCase(), { x: 98, y: BY + 22, w: blw, size: 16, bold: true, lh: 1.0, color: C.white, fit: true, maxLines: 1, minSize: 13 });
    s.text('От Search-first\nк Professional-first', { x: 98, y: BY + 46, w: blw, h: BH - 46 - 16, size: 28, bold: true, lh: 1.1, color: C.white, valign: 'middle', fit: true, maxLines: 2, minSize: 22 });
    s.vline(98 + blw + 30, BY + 22, BH - 44, C.white, 2);
    const px = 98 + blw + 60;
    s.text('В 2026 Paid Search доказал роль performance-ядра. В 2027 сохраняем proven core и добавляем влияние ДО поиска: **DOL + authority content** формируют предпочтение; **Programmatic HCP** масштабирует профессиональный контакт; **GEO/AEO + ORM + Paid Search** удерживают момент сравнения и конвертируют спрос.',
      { x: px, y: BY + 12, w: 1862 - 34 - px, h: BH - 24, size: 18, lh: 1.25, color: C.white, valign: 'middle', fit: true, minSize: 16 });
  },
};
