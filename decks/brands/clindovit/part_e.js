// Клиндовит · стратегия 2027 — часть E: слайды исходника 16–19.
// 16 — Paid Search (картинка → живой текст: роль в воронке, Поиск 66% / РСЯ 34%, KPI, запросы, принципы),
// 17 — блогеры (картинка → живой текст, фото блогеров вырезаны из картинки), 18 — digital-календарь 2027
// (своя сетка-гант + Total KPI 2027 vs 2026), 19 — итог: что даёт рост инвестиций. Аналоги — Acriol 21–23 (part_d).
const path = require('path');
const { C, columns, countLines, textWidth, typo, tr, balanceTitle } = require('../../../lib/akrikhin');
const V = require('../../variants/common'); // TOP, GRID
const SRC = path.join(__dirname, '..', '..', '..', 'work', 'brands', 'clindovit', 'src');
const CROPS = path.join(SRC, 'crops');

const TOP = V.TOP;      // 221
const BOT0 = 1005;      // низ контента без плашки
const MUTED_TXT = '6E86AD';

// ---------- Локальные хелперы ----------

// Строка так, как её увидит слайд (перевод + типографика), без разметки
const view = (t) => typo(tr(String(t))).replace(/\*\*|\[\[|\]\]/g, '');
// Высота текста так же, как её оценивает s.text
const measure = (t, w, size = 16, bold = false, lh = 1.2) => Math.round(countLines(view(t), size, w, bold) * size * lh);
const widthOf = (t, size, bold = false) => Math.ceil(textWidth(view(t), size, bold));
const sum = (a) => a.reduce((x, y) => x + y, 0);
// Число строк с учётом **жирных** кусков: каждый символ меряем своим начертанием (как countLines, запас 3%)
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
// Ширина блока, при которой текст занимает столько же строк, но строки ровнее — без висящего последнего слова
// (число строк — то же, что заложено в высоту блока: measure/countLines; жирные куски учитываем только при сужении)
const evenW = (t, w, size, bold = false) => {
  const n = countLines(view(t), size, w, bold);
  if (n < 2 || richLines(t, size, w, bold) > n) return w;
  let lo = w * 0.4;
  let hi = w;
  while (hi - lo > 1) { const m = (lo + hi) / 2; if (richLines(t, size, m, bold) <= n) hi = m; else lo = m; }
  return Math.min(w, Math.ceil(hi) + 4);
};
// Цитаты-запросы не рвём внутри кавычек: «мазь от угрей» переносится целиком (строка переводится целиком)
const keepQuotes = (t) => tr(String(t)).replace(/[«“][^»”]*[»”]/g, (m) => m.replace(/ /g, ' '));
// Общий кегль для ряда чисел: самый крупный, при котором каждое влезает в свою ширину
const commonSize = (items, max, min, bold = true) => {
  let sz = max;
  while (sz > min && items.some(([t, w]) => widthOf(t, sz, bold) > w * 0.97)) sz -= 1;
  return sz;
};

// Кольцо доли бюджета: живой doughnut + цифра и подпись в центре
function ring(s, { x, y, d, value, color, label, name }) {
  s.chart('doughnut', [{ name, labels: [name, 'Остальной бюджет'], values: [value, 100 - value] }], {
    x, y, w: d, h: d, colors: [color, 'E3ECF7'], values: false, legend: false, hole: 70,
    extra: { layout: { x: 0, y: 0, w: 1, h: 1 } },
  });
  // отверстие кольца — кругом цвета карточки: LibreOffice не понимает holeSize
  const hd = Math.round(d * 0.7);
  s.circle({ x: x + (d - hd) / 2, y: y + (d - hd) / 2, d: hd, fill: C.card });
  const vs = Math.round(d * 0.2);
  s.text(`${value}%`, { x, y: y + d / 2 - vs * 0.78, w: d, size: vs, bold: true, lh: 1.0, color: C.navy, align: 'center' });
  s.text(label, { x: x + d * 0.18, y: y + d / 2 + vs * 0.32, w: d * 0.64, size: Math.max(14, Math.round(d * 0.072)), lh: 1.1, color: C.blueText, align: 'center' });
}

// Цветная плитка-шапка колонки: заголовок + ряд KPI (значение / подпись), разделители
function kpiTile(s, { x, y, w, h, fill, title, kpis, weights }) {
  s.box({ x, y, w, h, fill, r: 25 });
  s.text(title, { x: x + 30, y: y + 20, w: w - 60, size: 26, lh: 1.0, color: C.white, fit: true, maxLines: 1, minSize: 20 });
  const iw = w - 60;
  const ws = weights.map((k) => k * iw);
  const vs = commonSize(kpis.map(([v], i) => [v, ws[i] - (i ? 22 : 0) - 8]), 32, 22);
  let xx = x + 30;
  kpis.forEach(([v, l], i) => {
    const pad = i ? 22 : 0;
    if (i) s.vline(xx, y + 62, h - 80, C.white, 1);
    s.text(v, { x: xx + pad, y: y + 60, w: ws[i] - pad, size: vs, bold: true, lh: 1.0, color: C.white });
    s.text(l, { x: xx + pad, y: y + 64 + vs, w: ws[i] - pad - 4, size: 15, lh: 1.1, color: C.white, fit: true, maxLines: 1, minSize: 13 });
    xx += ws[i];
  });
}

module.exports = {
  // ===================== 16. Paid Search =====================
  16: (d) => {
    const s = d.slide({
      title: 'Paid Search: перехватываем горячий спрос и доводим пользователей до покупки',
      subtitle: 'Поиск становится конверсионным ядром, а РСЯ усиливает его\nза счёт дополнительного охвата и возврата пользователей.',
    });
    const A = { x: 58, w: 470 };
    const B = { x: 550, w: 760 };
    const R = { x: 1332, w: 530 };
    const PAD = 30;
    const TH = 128;              // плитки-шапки Поиска и РСЯ
    const CY = TOP + TH + 16;    // верх карточек под плитками

    // --- A. Роль Paid Search в воронке + коммуникационные слои ---
    {
      s.card({ x: A.x, y: TOP, w: A.w, h: BOT0 - TOP, tint: true });
      const x = A.x + PAD;
      const w = A.w - 2 * PAD;
      let y = TOP + 28;
      y += s.heading('Роль Paid Search в воронке', { x, y, w, size: 26 }) + 12;
      y += s.text('Работаем на этапе **намерения**: перехватываем пользователей, которые уже ищут решение, и ведём их к покупке.', { x, y, w, size: 18, color: C.blueText }) + 18;
      const FUN = [
        ['Знание', 'tb:TbEye'],
        ['Рассмотрение', 'tb:TbMessages'],
        ['Намерение (Paid Search)', 'tb:TbTargetArrow', true],
        ['Покупка', 'tb:TbShoppingCart'],
      ];
      const fh = 50;
      const sh = 16; // сужение воронки на шаг
      FUN.forEach(([t, ic, hl], i) => {
        const bx = x + i * sh;
        const bw = w - 2 * i * sh;
        s.box({ x: bx, y, w: bw, h: fh, fill: hl ? C.blue : C.white, stroke: hl ? undefined : C.line, sw: 1.5, r: 12 });
        s.icon(ic, { x: bx + 16, y: y + 10, size: 30, color: hl ? C.white : C.blue });
        s.text(t, { x: bx + 60, y, w: bw - 72, h: fh, size: 18, bold: !!hl, lh: 1.0, color: hl ? C.white : C.blueText, valign: 'middle', fit: true, maxLines: 1, minSize: 14 });
        y += fh + 8;
      });
      y += 14;
      s.hline(x, y, w);
      y += 20;
      y += s.text('Отрабатываем ключевые коммуникационные слои', { x, y, w, size: 22, bold: true, lh: 1.1, color: C.navy }) + 18;
      const LAY = [
        ['Помогает, пока пользуюсь', 'Запросы о повторном появлении прыщей', 'tb:TbRefresh'],
        ['От косметики к лекарству', 'Продуктовые и категорийные запросы', 'tb:TbBottle'],
        ['Хочу быстрее, но боюсь переборщить', 'Симптомы, опасения, побочные действия', 'tb:TbShieldCheck'],
      ];
      const ld = 48;
      const tx = x + ld + 16;
      const tw = w - ld - 16;
      const lh = LAY.map(([t, dd]) => Math.max(ld, measure(t, tw, 19, true, 1.1) + 4 + measure(dd, tw, 17)));
      const gap = Math.max(12, (BOT0 - 26 - y - sum(lh)) / (LAY.length - 1));
      LAY.forEach(([t, dd, ic], i) => {
        s.icon(ic, { x, y, size: ld, circle: C.blue, color: C.white });
        // двухстрочный заголовок — с ровным переносом («Хочу быстрее, / но боюсь переборщить»)
        const th = s.text(balanceTitle(t, 19, tw), { x: tx, y, w: tw, size: 19, bold: true, lh: 1.1, color: C.navy });
        s.text(dd, { x: tx, y: y + th + 4, w: tw, size: 17, lh: 1.2, color: C.blueText });
        y += lh[i] + gap;
      });
    }

    // --- B. Поиск: конверсионное ядро ---
    {
      kpiTile(s, { x: B.x, y: TOP, w: B.w, h: TH, fill: C.blue, title: '**Поиск:** конверсионное ядро',
        kpis: [['2,12 млн ₽', 'бюджет'], ['3,6%', 'CR (где купить)'], ['24,7 ₽', 'CPC']], weights: [0.4, 0.32, 0.28] });
      s.card({ x: B.x, y: CY, w: B.w, h: BOT0 - CY });
      const x = B.x + PAD;
      const w = B.w - 2 * PAD;
      const LEAD = 'Забираем транзакционный спрос по бренду, симптоматике, категории и конкурентам.';
      const TYPES = [
        { v: 27, t: 'Категория', d: '**Сайт** — сформированный категорийный спрос', color: C.cyan },
        { v: 28, t: 'Симптоматика', d: '**Сайт** — перехват спроса по решению проблемы', color: C.blue },
        { v: 26, t: 'Транзакционные', d: '**Аптека** — сокращаем путь до покупки', color: C.navy },
        { v: 19, t: 'Конкуренты', d: '**Сайт** — перехват спроса во время поиска альтернатив', color: C.crimson },
      ];
      const EX = [
        { t: 'Транзакционные + бренд', q: '«клиндовит купить в аптеке»', color: C.navy },
        { t: 'Симптоматика', q: '«лечение акне», «черные точки»', color: C.blue },
        { t: 'Конкуренты', q: '«дифферин крем», «зеркалин аналоги»', color: C.crimson },
        { t: 'Продуктовая / категория', q: '«средство против прыщей», «мазь от угрей»', color: C.cyan },
      ];
      // замеры: вводная, кольцо + 4 типа, примеры 2 × 2
      const RD = 214;
      const rx = x + RD + 34;
      const rw = x + w - rx;
      const tw = rw - 84;
      const rh = TYPES.map((r) => Math.max(50, 20 + 4 + measure(r.d, tw, 16)));
      const rgap = 12;
      const blockH = sum(rh) + rgap * (TYPES.length - 1);
      const leadH = measure(LEAD, w, 18);
      const eg = 14;
      const ew = (w - eg) / 2;
      const etw = ew - 18 - 38;
      const eh = EX.map((e) => 14 + measure(e.t, etw, 17, true, 1.1) + 4 + measure(keepQuotes(e.q), etw, 16) + 14);
      const rowH = [Math.max(eh[0], eh[1]), Math.max(eh[2], eh[3])];
      const exHeadH = 24;
      const need = leadH + blockH + exHeadH + 14 + sum(rowH) + 12;
      const free = Math.max(0, BOT0 - 26 - (CY + 24) - need - 18 - 22 - 20);
      const g = free / 3;
      let y = CY + 24;
      s.text(LEAD, { x, y, w, size: 18, color: C.blueText });
      y += leadH + 18 + g;
      ring(s, { x, y: y + (blockH - RD) / 2, d: RD, value: 66, color: C.blue, label: 'доля бюджета', name: 'Поиск' });
      let ry = y;
      TYPES.forEach((r, i) => {
        s.box({ x: rx, y: ry + 1, w: 66, h: 48, fill: r.color, r: 12 });
        s.text(`${r.v}%`, { x: rx, y: ry + 1, w: 66, h: 48, size: 19, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
        s.text(r.t.toUpperCase(), { x: rx + 84, y: ry, w: tw, size: 18, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 15 });
        s.text(r.d, { x: rx + 84, y: ry + 24, w: evenW(r.d, tw, 16), size: 16, lh: 1.2, color: C.blueText });
        ry += rh[i] + rgap;
      });
      y += blockH + 22 + g;
      s.hline(x, y, w);
      y += 20 + g;
      // примеры запросов
      s.icon('tb:TbSearch', { x, y: y - 2, size: 28, color: C.blue });
      s.text('Примеры поисковых запросов', { x: x + 40, y, w: w - 40, size: 21, bold: true, lh: 1.1, color: C.navy });
      y += exHeadH + 14;
      EX.forEach((e, i) => {
        const cx = x + (i % 2) * (ew + eg);
        const cy = y + (i >= 2 ? rowH[0] + 12 : 0);
        const ch = rowH[i >= 2 ? 1 : 0];
        s.box({ x: cx, y: cy, w: ew, h: ch, fill: C.cardTint, r: 14 });
        s.circle({ x: cx + 18, y: cy + 18, d: 14, fill: e.color });
        const th = s.text(e.t, { x: cx + 18 + 26, y: cy + 14, w: etw, size: 17, bold: true, lh: 1.1, color: C.navy });
        s.text(keepQuotes(e.q), { x: cx + 18 + 26, y: cy + 14 + th + 4, w: etw, size: 16, lh: 1.2, color: C.blueText });
      });
    }

    // --- C. РСЯ: поддержка Поиска ---
    {
      kpiTile(s, { x: R.x, y: TOP, w: R.w, h: TH, fill: C.teal, title: '**РСЯ:** поддержка Поиска',
        kpis: [['1,11 млн ₽', 'бюджет'], ['1,8%', 'CR (где купить)'], ['9,6 ₽', 'CPC']], weights: [0.42, 0.31, 0.27] });
      s.card({ x: R.x, y: CY, w: R.w, h: BOT0 - CY });
      const x = R.x + PAD;
      const w = R.w - 2 * PAD;
      let y = CY + 24;
      y += s.text('Усиливаем охват и возвращаем пользователей, которые находятся на стадии выбора решения.', { x, y, w, size: 18, color: C.blueText }) + 18;
      const DEST = [
        { k: 'Бренд + транзакции', to: 'Аптека', d: 'Более выраженный интерес к покупке', fill: C.blue },
        { k: 'Продукт / симптомы / конкуренты', to: 'Сайт', d: 'Более широкая категорийная аудитория', fill: C.cyan },
      ];
      const RD = 160;
      const dx = x + RD + 26;
      const dw = x + w - dx;
      const dh = DEST.map((it) => measure(it.k, dw, 15, true, 1.1) + 6 + 36 + 8 + measure(it.d, dw, 15));
      const dgap = 16;
      const blockH = sum(dh) + dgap;
      ring(s, { x, y: y + (blockH - RD) / 2, d: RD, value: 34, color: C.teal, label: 'доля бюджета', name: 'РСЯ' });
      let yy = y;
      DEST.forEach((it, i) => {
        const kh = s.text(it.k, { x: dx, y: yy, w: dw, size: 15, bold: true, lh: 1.1, color: C.navy });
        s.box({ x: dx, y: yy + kh + 6, w: dw, h: 36, fill: it.fill, r: 10 });
        s.text(it.to.toUpperCase(), { x: dx, y: yy + kh + 6, w: dw, h: 36, size: 18, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
        s.text(it.d, { x: dx, y: yy + kh + 6 + 36 + 8, w: dw, size: 15, lh: 1.2, color: C.blueText });
        yy += dh[i] + dgap;
      });
      y += blockH + 22;
      s.hline(x, y, w);
      y += 22;
      const PR = [
        { t: 'Контролируем долю', d: 'Качество трафика ниже Поиска — не масштабируем только ради объёма.' },
        { t: 'Фокус на post-click', d: 'Глубина просмотра, время на сайте, роботность, qCPV.' },
        { t: 'Разные посадочные', d: 'Выбираем по степени сформированности спроса.' },
      ];
      const bd = 44;
      const tx = x + bd + 18;
      const tw = w - bd - 18;
      const ph = PR.map((p) => Math.max(bd, 4 + measure(p.t, tw, 19, true, 1.05) + 6 + measure(p.d, tw, 16)));
      const pgap = Math.max(12, (BOT0 - 24 - y - sum(ph)) / (PR.length - 1));
      PR.forEach((p, i) => {
        s.badge({ x, y, d: bd, n: `0${i + 1}`, color: C.tint, textColor: C.blueText, size: 18 });
        const th = s.text(p.t, { x: tx, y: y + 4, w: tw, size: 19, bold: true, lh: 1.05, color: C.navy });
        s.text(p.d, { x: tx, y: y + 4 + th + 6, w: tw, size: 16, lh: 1.2, color: C.blueText });
        y += ph[i] + pgap;
      });
    }
  },

  // ===================== 17. Блогеры в 2027 =====================
  17: (d) => {
    const s = d.slide({
      title: 'Блогеры в 2027: comprehensive-подход помогает обучать аудиторию и усиливать путь к покупке',
      subtitle: 'Блогеры остаются важным каналом, чтобы понятным языком объяснять\nприменение Клиндовита и его преимущества.',
    });
    const L = { x: 58, w: 470 };
    const R = { x: 550, w: 1312 };

    // --- справа: как реализуем comprehensive-подход (5 шагов) ---
    const rx = R.x + 32;
    const rw = R.w - 64;
    const HEAD = 'Как мы реализуем comprehensive-подход в блогерах';
    const LEAD = 'В 2027 году мы используем comprehensive-подход: подбираем релевантного автора под каждый сегмент и персонализируем сценарий под мотивацию аудитории.';
    const STEPS = [
      { t: 'Выбираем сегмент', d: 'Определяем целевую аудиторию и её ключевые потребности', ic: 'tb:TbUsers' },
      { t: 'Подбираем релевантного блогера', d: 'Учитываем соответствие аудитории, естественность опыта и способность обеспечить переход', ic: 'tb:TbUserStar' },
      { t: 'Персонализируем сценарий и аргументы', d: 'Создаём нативный сюжет с продуктовым фокусом под мотивацию сегмента', ic: 'tb:TbFilePencil' },
      { t: 'Размещаем на разрешённых площадках', d: 'VK — ядро\nMAX — тест\nTikTok — дополнительный охват\nRUTUBE — контекст и видео', ic: 'tb:TbSpeakerphone' },
      { t: 'Отслеживаем\nпост-клик', d: 'Принимаем решение о сильных связках между флайтами', ic: 'tb:TbChartBar' },
    ];
    const ag = 24;   // зазор под стрелку
    // ширины шагов: заголовок — не больше 2 строк, строки списка (с \n) — без переноса;
    // остальные шаги — поровну (иначе «Размещаем на разрешённых площадках» рвётся на 3 строки)
    const total = rw - ag * (STEPS.length - 1);
    const minW = STEPS.map((st) => {
      const ok = (w) => countLines(view(st.t), 18, w, true) <= 2
        && (!st.d.includes('\n') || view(st.d).split('\n').every((l) => countLines(l, 16, w) === 1));
      let w = 120;
      while (w < total / 2 && !ok(w)) w += 2;
      return w;
    });
    let base = total / STEPS.length;
    for (let k = 0; k < 8; k++) {
      const wide = minW.filter((m) => m > base);
      if (wide.length === STEPS.length) break;
      base = (total - sum(wide)) / (STEPS.length - wide.length);
    }
    const SW = sum(minW) > total ? STEPS.map(() => total / STEPS.length) : minW.map((m) => Math.max(m, base));
    const SX = SW.map((_, i) => rx + sum(SW.slice(0, i)) + ag * i);
    const IC = 62;
    const th = Math.max(...STEPS.map((st, i) => measure(st.t, SW[i], 18, true, 1.1)));
    const dh = Math.max(...STEPS.map((st, i) => measure(st.d, SW[i], 16)));
    const hh = measure(HEAD, rw, 26, true, 1.1);
    const leadH = measure(LEAD, rw, 18);
    const sy = TOP + 26 + hh + 8 + leadH + 26;          // верх шагов
    const topBot = sy + IC + 16 + th + 10 + dh + 26;    // низ верхнего ряда
    s.card({ x: R.x, y: TOP, w: R.w, h: topBot - TOP });
    s.heading(HEAD, { x: rx, y: TOP + 26, w: rw, size: 26 });
    s.text(LEAD, { x: rx, y: TOP + 26 + hh + 8, w: rw, size: 18, color: C.blueText });
    STEPS.forEach((st, i) => {
      const x = SX[i];
      const sw = SW[i];
      s.circle({ x: x + 10, y: sy, d: IC, fill: C.tint });
      s.icon(st.ic, { x: x + 10 + 15, y: sy + 15, size: IC - 30, color: C.blue });
      s.badge({ x, y: sy - 6, d: 30, n: i + 1, color: C.blue, size: 16 });
      if (i < STEPS.length - 1) s.chevron({ cx: x + sw + ag / 2, cy: sy + IC / 2, dir: 'right', w: 16, h: 24, color: C.crimson });
      s.text(balanceTitle(st.t, 18, sw), { x, y: sy + IC + 16, w: sw, size: 18, bold: true, lh: 1.1, color: C.navy });
      s.text(st.d, { x, y: sy + IC + 16 + th + 10, w: evenW(st.d, sw, 16), size: 16, lh: 1.2, color: C.blueText });
    });

    // --- слева: почему блогеры остаются важным каналом ---
    s.box({ x: L.x, y: TOP, w: L.w, h: topBot - TOP, fill: C.blue, r: 25 });
    const lx = L.x + 28;
    const lw = L.w - 56;
    let ly = TOP + 26;
    ly += s.text('Почему блогеры остаются важным каналом', { x: lx, y: ly, w: lw, size: 26, bold: true, lh: 1.1, color: C.white }) + 20;
    const WHY = [
      ['Обучают правильному применению препарата', 'tb:TbSchool'],
      ['Раскрывают преимущества бренда понятным и нативным языком', 'tb:TbThumbUp'],
      ['Помогают перевести интерес\nв post-click и «Где купить»', 'tb:TbShoppingCart'],
    ];
    const wd = 48;
    const wtw = lw - 32 - wd - 18;
    const wh = WHY.map(([t]) => Math.max(wd, measure(t, wtw, 18)) + 26);
    const wgap = Math.max(8, (topBot - 24 - ly - sum(wh)) / (WHY.length - 1));
    WHY.forEach(([t, ic], i) => {
      s.box({ x: lx, y: ly, w: lw, h: wh[i], fill: C.white, transparency: 86, r: 15 });
      s.icon(ic, { x: lx + 16, y: ly + (wh[i] - wd) / 2, size: wd, circle: C.white, color: C.blue });
      s.text(t, { x: lx + 16 + wd + 18, y: ly, w: wtw, h: wh[i], size: 18, lh: 1.2, color: C.white, valign: 'middle' });
      ly += wh[i] + wgap;
    });

    // --- снизу: примеры блогеров под ключевые сегменты ---
    let by = topBot + 22;
    by += s.label('Примеры блогеров под ключевые сегменты', { x: 58, y: by, w: 1804, size: 22, color: C.blue }) + 14;
    const BL = [
      { seg: 'Девушки 18–25', name: 'Софинка Баунти', tag: 'Lifestyle / beauty', img: 'e_blog1.png',
        a: ['tb:TbTarget', 'Быстрый ответ на появившиеся прыщи, уверенность в себе.'],
        b: ['tb:TbFileText', '**Нативный сюжет:** «когда прыщи появляются на моем лице, я хочу средство, которое сразу уберет их».'] },
      { seg: 'Мамы подростков 35–55', name: 'Mama bond 007', tag: 'Семейный / уход за кожей', img: 'e_blog2.png',
        a: ['tb:TbMessageDots', 'Понятный выбор средства для подростка, применение и преимущества.'],
        b: ['tb:TbFileText', '**Личный опыт:** «моему ребенку нужно быстрое и хорошее средство от прыщей, потому что вижу, как они влияют на его настроение».'] },
      { seg: 'Женщины 25–40', name: 'Кристина Лясковец', tag: 'Lifestyle / активный ритм жизни', img: 'e_blog3.png',
        a: ['tb:TbMessageDots', 'Эффективность и удобство в насыщенном графике.'],
        b: ['tb:TbFileText', '**Сюжет:** «у меня нет времени на эти прыщи, я хочу средство, которое поможет мне убрать их как можно скорее».'] },
    ];
    const cols = columns(3, { gap: 22 });
    const ch = BOT0 - by;
    // фото — на всю высоту карточки (без пустой полосы внизу), пока тексты справа помещаются; пропорция вырезки 188 × 227
    const textH = (b, tw) => 38 + 16 + sum([b.a, b.b].map(([, t]) => Math.max(34, measure(t, tw - 46, 16)) + 14)) - 14;
    // фото крупнее — но тексты не должны получить лишнюю строку (иначе висят одиночные слова)
    const nLines = (PW) => BL.map((b) => [b.a, b.b].map(([, t]) => countLines(view(t), 16, cols[0].w - 44 - PW - 20 - 46)).join()).join();
    const lines0 = nLines(174);
    let PH = ch - 90 - 22;
    let PW = Math.round(PH * 188 / 227);
    while (PH > 210 && (nLines(PW) !== lines0 || BL.some((b) => textH(b, cols[0].w - 44 - PW - 20) > PH))) { PH -= 2; PW = Math.round(PH * 188 / 227); }
    BL.forEach((b, i) => {
      const { x, w } = cols[i];
      s.card({ x, y: by, w, h: ch });
      s.badge({ x: x + 22, y: by + 22, d: 50, n: `0${i + 1}`, color: C.blue, size: 20 });
      s.text(b.seg.toUpperCase(), { x: x + 88, y: by + 22, w: w - 110, size: 16, bold: true, lh: 1.0, color: C.crimson, fit: true, maxLines: 1, minSize: 13 });
      s.text(b.name, { x: x + 88, y: by + 44, w: w - 110, size: 26, bold: true, lh: 1.05, color: C.navy, fit: true, maxLines: 1, minSize: 20 });
      const py = by + 90;
      s.image(path.join(CROPS, b.img), { x: x + 22, y: py, w: PW, h: PH, alt: b.name });
      const tx = x + 22 + PW + 20;
      const tw = x + w - 22 - tx;
      // тег-ниша
      s.box({ x: tx, y: py, w: tw, h: 38, fill: C.tint, r: 19 });
      s.icon('tb:TbStar', { x: tx + 14, y: py + 9, size: 20, color: C.blue });
      s.text(b.tag, { x: tx + 44, y: py, w: tw - 54, h: 38, size: 16, lh: 1.0, color: C.navy, valign: 'middle', fit: true, maxLines: 1, minSize: 13 });
      let iy = py + 38 + 16;
      [b.a, b.b].forEach(([ic, t], k) => {
        s.icon(ic, { x: tx, y: iy, size: 34, circle: C.tint, color: C.blue });
        const h = s.text(t, { x: tx + 46, y: iy, w: evenW(t, tw - 46, 16), size: 16, lh: 1.2, color: C.blueText });
        iy += Math.max(34, h) + 14;
      });
    });
  },

  // ===================== 18. Digital support calendar 2027 =====================
  18: (d) => {
    const s = d.slide({ title: 'Digital support calendar 2027: flowchart' });

    // --- полоса KPI: бюджет со сплитом · brand health + sales · медиа-KPI ---
    const KY = TOP;
    const KH = 146;
    const BW = 470;
    s.box({ x: 58, y: KY, w: BW, h: KH, fill: C.blue, r: 25 });
    s.text('BUDGET', { x: 88, y: KY + 24, w: 200, size: 18, bold: true, lh: 1.0, color: C.white });
    s.text('15,9M', { x: 88, y: KY + 54, w: 196, size: 60, bold: true, lh: 1.0, color: C.white, fit: true, maxLines: 1, minSize: 44 });
    s.vline(296, KY + 24, KH - 48, C.white, 1.5);
    const sx = 320;
    const sw = 58 + BW - 28 - sx;
    s.text('Бюджетный сплит*', { x: sx, y: KY + 24, w: sw, size: 15, bold: true, lh: 1.0, color: C.white, caps: true, fit: true, maxLines: 1, minSize: 12 });
    [['Digital media', '14,3M'], ['Tech cost', '1M'], ['Adriver', '0,6M']].forEach(([k, v], i) => {
      const y = KY + 54 + i * 26;
      s.text(k, { x: sx, y, w: sw - 70, size: 17, lh: 1.0, color: C.white });
      s.text(v, { x: sx + sw - 70, y, w: 70, size: 17, bold: true, lh: 1.0, color: C.white, align: 'right' });
    });
    // brand health + sales
    const HX = 58 + BW + 22;
    const HW = 420;
    s.card({ x: HX, y: KY, w: HW, h: KH });
    const hcw = 220;
    s.text('Brand Health KPIs', { x: HX + 26, y: KY + 24, w: hcw - 20, size: 17, bold: true, lh: 1.0, color: C.crimson });
    s.text('Aided BA: 46% → 48%', { x: HX + 26, y: KY + 58, w: hcw - 20, size: 18, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 14 });
    s.text('Usage ever: 23% → 25%', { x: HX + 26, y: KY + 90, w: hcw - 20, size: 18, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 14 });
    s.vline(HX + hcw + 10, KY + 24, KH - 48);
    const scx = HX + hcw + 32;
    const scw = HX + HW - 22 - scx;
    s.text('Sales', { x: scx, y: KY + 24, w: scw, size: 17, bold: true, lh: 1.0, color: C.crimson });
    s.text('338 mln Rub\n(+5%)', { x: scx, y: KY + 54, w: scw, h: 66, size: 24, bold: true, lh: 1.1, color: C.navy, fit: true, maxLines: 2, minSize: 18 });
    // медиа-KPI
    const KX = HX + HW + 22;
    const KW = 1862 - KX;
    s.card({ x: KX, y: KY, w: KW, h: KH });
    s.text('Media KPIs', { x: KX + 26, y: KY + 24, w: 300, size: 17, bold: true, lh: 1.0, color: C.crimson });
    const KPI = [['58M', 'Impressions'], ['14,4M', 'UU'], ['3,2M', 'Unique Reach'], ['4', 'Frequency'], ['172 тыс.', 'Clicks'], ['1,6 тыс.', 'Conversion\n«Где купить»']];
    const k0 = KX + 26;
    const kw = (KW - 40) / KPI.length;
    const ks = commonSize(KPI.map(([v]) => [v, kw - 18]), 34, 24);
    KPI.forEach(([v, t], i) => {
      const x = k0 + i * kw;
      if (i) s.vline(x - 10, KY + 58, KH - 80);
      s.text(v, { x, y: KY + 56, w: kw - 18, size: ks, bold: true, lh: 1.0, color: C.navy });
      s.text(t, { x, y: KY + 62 + ks, w: kw - 18, h: 40, size: 15, lh: 1.15, color: C.blueText, fit: true, maxLines: 2, minSize: 13 });
    });

    // --- календарь: инфо-колонки + 12 месяцев (полумесячная сетка исходника) ---
    const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    // периоды в полумесяцах [от, до) — по заливке ячеек исходника; flights — подписанные флайты поверх строк
    const ALL = [[0, 24]];
    const ROWS = [
      { ch: 'Programmatic (banners)', sup: 'Adsource', seg: 'Ж 18–25 Social girl\nЖ 35–50 родители подростков\nЖ 25–34 бизнес/офис', bud: '4,1M', sob: '28,7%', act: [], boost: [[5, 9, 'Sprint'], [13, 17, 'Sprint']] },
      { ch: 'Bloggers', sup: '—', seg: '—', bud: '2,1M', sob: '14,7%', act: [[6, 8], [14, 16]] },
      { ch: 'Внешние публикации', sup: '—', seg: '—', bud: '1,7M', sob: '11,9%', act: ALL },
      { ch: 'GEO/AEO', sup: '—', seg: '—', bud: '1,5M', sob: '10,5%', act: ALL },
      { ch: 'ORM', sup: '—', seg: '—', bud: '1,7M', sob: '11,9%', act: ALL },
      { ch: 'Paid Search', sup: 'Yandex Search + Network', seg: '—', bud: '3,2M', sob: '22,3%', act: ALL },
    ];
    const STAGES = [['Awareness', 0, 2], ['Consideration', 2, 3], ['Intent', 5, 1]];
    const X0 = 58;
    const CW = { st: 150, ch: 176, sup: 170, seg: 262, bud: 76, sob: 72 };
    const cx = {};
    let acc = X0;
    for (const k of Object.keys(CW)) { cx[k] = acc; acc += CW[k]; }
    const MX = acc;
    const MW = (1862 - MX) / 12;
    const HW2 = MW / 2;
    const PADX = 10;
    const FS = 15;
    const HY = KY + KH + 20;
    const HH = 40;
    const TH = 40;
    const TKH = 128;                    // плитки Total KPI
    const TKY = BOT0 - TKH;
    const TTL = TKY - 40;               // строка заголовка Total KPI
    const yEndMax = TTL - 16;
    const rowT = ROWS.map((r) => Math.max(
      measure(r.ch, CW.ch - 2 * PADX, 16, true, 1.15),
      measure(r.sup, CW.sup - 2 * PADX, FS, false, 1.15),
      measure(r.seg, CW.seg - 2 * PADX, FS, false, 1.15)));
    let rowH = rowT.map((t) => Math.max(52, t + 18));
    const spare = yEndMax - TH - (HY + HH) - sum(rowH);
    rowH = rowH.map((h, i) => (spare > 0 ? h + spare / ROWS.length : Math.max(rowT[i] + 8, h + spare / ROWS.length)));
    // шапка
    s.box({ x: X0, y: HY, w: 1862 - X0, h: HH, fill: C.navy, r: 0 });
    const HEAD = [['Этап', 'st'], ['Канал', 'ch'], ['Поставщики', 'sup'], ['Сегмент', 'seg'], ['Бюджет', 'bud'], ['SOB %', 'sob']];
    const num = (k) => k === 'bud' || k === 'sob';
    HEAD.forEach(([t, k]) => s.text(t.toUpperCase(), { x: cx[k] + PADX - (num(k) ? 6 : 0), y: HY, w: CW[k] - 2 * PADX + (num(k) ? 12 : 0), h: HH, size: 14, bold: true, lh: 1.0, color: C.white,
      valign: 'middle', align: num(k) ? 'center' : 'left', fit: true, maxLines: 1, minSize: 11 }));
    MON.forEach((t, i) => s.text(t, { x: MX + i * MW, y: HY, w: MW, h: HH, size: 14, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' }));
    const ys = [];
    let y = HY + HH;
    ROWS.forEach((r, i) => { ys.push(y); y += rowH[i]; });
    const yEnd = y;
    for (let i = 0; i <= 12; i++) s.vline(MX + i * MW, HY + HH, yEnd - HY - HH, i === 0 ? C.line : V.GRID, i === 0 ? 1.5 : 1.25);
    const bar = (a, b, yc, h, fill, label, color = C.white) => {
      s.box({ x: MX + a * HW2 + 4, y: yc - h / 2, w: (b - a) * HW2 - 8, h, fill, r: h / 2 });
      if (label) s.text(label, { x: MX + a * HW2 + 4, y: yc - h / 2, w: (b - a) * HW2 - 8, h, size: 14, bold: true, lh: 1.0, color, align: 'center', valign: 'middle' });
    };
    ROWS.forEach((r, i) => {
      const y0 = ys[i];
      const h = rowH[i];
      s.hline(cx.ch, y0 + h, 1862 - cx.ch, C.line, 1.5);
      const cell = (k, t, o = {}) => s.text(t, { x: cx[k] + PADX, y: y0, w: CW[k] - 2 * PADX, h, size: o.size ?? FS, bold: !!o.bold, lh: 1.15,
        color: o.color ?? C.blueText, valign: 'middle', align: o.align ?? 'left' });
      cell('ch', r.ch, { size: 16, bold: true, color: C.navy });
      cell('sup', r.sup, r.sup === '—' ? { color: MUTED_TXT } : {});
      cell('seg', r.seg, r.seg === '—' ? { color: MUTED_TXT } : {});
      cell('bud', r.bud, { size: 16, bold: true, color: C.navy, align: 'center' });
      cell('sob', r.sob, { align: 'center' });
      r.act.forEach(([a, b]) => bar(a, b, y0 + h / 2, 16, 'A6CDEE'));
      (r.boost || []).forEach(([a, b, t]) => bar(a, b, y0 + h / 2, 30, C.crimson, t));
    });
    // флайты поверх границы строк — как в исходнике: SLS в июне (Bloggers / Внешние публикации), Frequency (ORM / Paid Search)
    bar(10, 12, ys[2], 30, C.purple, 'SLS');
    bar(1, 23, ys[5], 30, C.crimson, 'Frequency');
    // этапы
    STAGES.forEach(([t, i0, n]) => {
      const yy = ys[i0] + 3;
      const hh = ys[i0 + n - 1] + rowH[i0 + n - 1] - ys[i0] - 6;
      s.box({ x: X0 + 3, y: yy, w: CW.st - 10, h: hh, fill: C.cardTint, r: 10 });
      s.text(t.toUpperCase(), { x: X0 + 12, y: yy, w: CW.st - 28, h: hh, size: 15, bold: true, lh: 1.1, color: C.navy, valign: 'middle', fit: true, maxLines: 1, minSize: 11 });
    });
    // итог
    s.box({ x: X0, y: yEnd, w: 1862 - X0, h: TH, fill: C.navy, r: 0 });
    s.text('TOTAL', { x: cx.ch + PADX, y: yEnd, w: CW.ch, h: TH, size: 16, bold: true, lh: 1.0, color: C.white, valign: 'middle' });
    s.text('14,3M', { x: cx.bud - 6, y: yEnd, w: CW.bud + 12, h: TH, size: 16, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
    s.text('100%', { x: cx.sob, y: yEnd, w: CW.sob, h: TH, size: 15, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });

    // --- Total KPI 2027 vs 2026 ---
    s.text('Total KPI: 2027 vs 2026', { x: 58, y: TTL, w: 900, size: 22, bold: true, lh: 1.0, color: C.navy });
    s.text('Медиапланы · прогноз', { x: 1262, y: TTL + 4, w: 600, size: 16, lh: 1.0, color: MUTED_TXT, align: 'right' });
    const TK = [
      { l: 'Показы', a: '25,4 млн', b: '58 млн', ch: 'Изменение: +128%' },
      { l: 'Охват', a: '4,75 млн', b: '14,4 млн', ch: 'Изменение: +203%' },
      { l: 'Клики', a: '166 тыс.', b: '172 тыс.', ch: 'Изменение: +4%' },
      { l: 'CR «Где купить»', a: '1,93%', b: '2,44%', ch: 'Изменение: +0,51 п.п.' },
    ];
    const tcols = columns(4, { gap: 22 });
    const vw = (tcols[0].w - 56 - 40) / 2;
    const tvs = commonSize(TK.flatMap((t) => [[t.a, vw], [t.b, vw]]), 32, 22);
    TK.forEach((t, i) => {
      const { x, w } = tcols[i];
      s.card({ x, y: TKY, w, h: TKH, tint: true });
      const cw2 = widthOf(t.ch, 16, true) + 4;
      s.text(t.l.toUpperCase(), { x: x + 28, y: TKY + 22, w: w - 56 - cw2 - 12, size: 17, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 13 });
      s.text(t.ch, { x: x + w - 28 - cw2, y: TKY + 23, w: cw2, size: 16, bold: true, lh: 1.0, color: C.crimson, align: 'right' });
      const ax = x + 28;
      const bx = x + 28 + vw + 40;
      s.text('2026', { x: ax, y: TKY + 54, w: vw, size: 14, lh: 1.0, color: MUTED_TXT });
      s.text('2027', { x: bx, y: TKY + 54, w: vw, size: 14, lh: 1.0, color: MUTED_TXT });
      s.text(t.a, { x: ax, y: TKY + 74, w: vw, size: tvs, bold: true, lh: 1.0, color: '7F9DC4' });
      s.text('→', { x: ax + vw, y: TKY + 74 + (tvs - 24) / 2, w: 40, size: 24, bold: true, lh: 1.0, color: C.crimson, align: 'center' });
      s.text(t.b, { x: bx, y: TKY + 74, w: vw, size: tvs, bold: true, lh: 1.0, color: C.navy });
    });

    // легенда + сноска
    const LGY = 1034;
    const lg = [['A6CDEE', 'активный период'], [C.crimson, 'буст / приоритетный флайт']];
    let lxx = 1790;   // правее — номер страницы
    [...lg].reverse().forEach(([col, t]) => {
      const tw = widthOf(t, 15) + 6;
      lxx -= tw;
      s.text(t, { x: lxx, y: LGY, w: tw, size: 15, lh: 1.0, color: C.blueText });
      lxx -= 52;
      s.box({ x: lxx, y: LGY - 2, w: 42, h: 20, fill: col, r: 10 });
      lxx -= 30;
    });
    s.footnote('*Бюджет до НДС, включая АК/РС');
  },

  // ===================== 19. Итог: что даёт рост инвестиций =====================
  19: (d) => {
    const s = d.slide({ title: 'Клиндовит 2027', subtitle: 'Что дает рост инвестиций vs 2026' });

    // --- три плитки: цель, инвестиции, медиа-масштаб ---
    const cols = columns(3, { gap: 22 });
    const TH = 150;
    const TILES = [
      { lab: 'Бизнес-цель 2027', v: '338 млн ₽', sub: ['+5% в деньгах', 'защита доли сегмента'], color: C.crimson },
      { lab: 'Инвестиции', v: '8,9 → 15,9 млн ₽', sub: ['+79% vs 2026'], color: C.blue },
      { lab: 'Медиа-масштаб', v: '58M показов', sub: ['Tech. Reach 4+ 14,4M', 'Unique Reach 1+ 3,2M'], color: C.navy2 },
    ];
    TILES.forEach((t, i) => {
      const { x, w } = cols[i];
      s.box({ x, y: TOP, w, h: TH, fill: t.color, r: 25 });
      s.text(t.lab.toUpperCase(), { x: x + 30, y: TOP + 22, w: w - 60, size: 18, bold: true, lh: 1.0, color: C.white });
      s.text(t.v, { x: x + 30, y: TOP + 50, w: w - 60, size: 52, bold: true, lh: 1.0, color: C.white, fit: true, maxLines: 1, minSize: 38 });
      const us = commonSize([[t.sub.join('      '), w - 60]], 20, 15, true);
      let ux = x + 30;
      t.sub.forEach((u, k) => {
        const uw = widthOf(u, us, k === 0) + 4;
        s.text(u, { x: ux, y: TOP + 114, w: Math.min(uw, x + w - 30 - ux), size: us, bold: k === 0, lh: 1.0, color: C.white });
        ux += uw + 24;
      });
    });

    const MY = TOP + TH + 24;
    const BY = 885;         // нижняя полоса-вывод
    const MH = BY - 22 - MY;

    // --- слева: как развиваем Comprehensive (фазы года) ---
    const L = { x: 58, w: 1010 };
    s.card({ x: L.x, y: MY, w: L.w, h: MH });
    const lx = L.x + 34;
    const lw = L.w - 68;
    s.label('Как развиваем Comprehensive в 2027', { x: lx, y: MY + 30, w: lw, size: 22, color: C.blue });
    const PH = [
      { n: 'AON', per: 'янв–фев', color: C.navy },
      { n: 'Media boost 1', per: 'март–май', color: C.crimson },
      { n: 'Decision gate', per: 'май–июль, 6 нед', color: C.orange },
      { n: 'Media boost 2', per: 'июль–сент, 8 нед', color: C.crimson },
      { n: 'AON', per: 'сент–дек', color: C.navy },
    ];
    const gy = MY + 78;
    const GH = 80;
    const gg = 8;
    const gw = (lw - gg * (PH.length - 1)) / PH.length;
    PH.forEach((p, i) => {
      const x = lx + i * (gw + gg);
      s.box({ x, y: gy, w: gw, h: GH, fill: p.color, r: 12 });
      s.text(p.n, { x: x + 10, y: gy + 15, w: gw - 20, size: 19, bold: true, lh: 1.0, color: C.white, align: 'center', fit: true, maxLines: 1, minSize: 14 });
      s.text(p.per, { x: x + 8, y: gy + 46, w: gw - 16, size: 16, lh: 1.0, color: C.white, align: 'center', fit: true, maxLines: 1, minSize: 13 });
    });
    const rows = [
      { pill: 'AON', color: C.navy, ch: 'Paid Search + GEO/AEO + ORM + внешние публикации', d: 'закрывает выбор и конверсию круглый год' },
      { pill: 'Sprint', color: C.crimson, ch: 'Programmatic + Bloggers', d: 'расширяет спрос в ключевые периоды и подключает новые сегменты' },
    ];
    const PW = 170;
    const tx = lx + PW + 30;
    const tw = lw - PW - 30;
    const rh = rows.map((r) => Math.max(48, measure(r.ch, tw, 22, true, 1.1) + 8 + measure(r.d, tw, 19)));
    const rTop = gy + GH;
    const rBot = MY + MH - 28;
    const free = rBot - rTop - sum(rh);
    let ry = rTop + free * 0.36;
    rows.forEach((r, i) => {
      if (i) s.hline(lx, ry - free * 0.18, lw);
      s.pill(r.pill, { x: lx, y: ry, w: PW, h: 48, size: 20, color: r.color, caps: true });
      const chh = s.text(r.ch, { x: tx, y: ry, w: tw, size: 22, bold: true, lh: 1.1, color: C.navy });
      s.text(r.d, { x: tx, y: ry + chh + 8, w: tw, size: 19, lh: 1.2, color: C.blueText });
      ry += rh[i] + free * 0.36;
    });

    // --- справа: зоны расширения ---
    const R = { x: L.x + L.w + 22, w: 1862 - (L.x + L.w + 22) };
    s.card({ x: R.x, y: MY, w: R.w, h: MH });
    const rx = R.x + 34;
    const rw = R.w - 68;
    s.label('Зоны расширения', { x: rx, y: MY + 30, w: rw, size: 22, color: C.blue });
    const Z = [
      { t: 'Audience barriers', d: 'Отработка барьеров выбора: «пока пользуюсь», переход от косметики к лекарству, страх раздражения' },
      { t: 'AI visibility & trust', d: 'GEO/AEO, ORM и внешние публикации дают экспертный ответ в момент сравнения решений' },
      { t: 'Intent capture & conversion', d: 'Paid Search концентрируется на степени выраженности намерения к покупке' },
    ];
    const bd = 46;
    const ztx = rx + bd + 20;
    const ztw = rw - bd - 20;
    const zh = Z.map((z) => 6 + measure(z.t, ztw, 21, true, 1.05) + 8 + measure(z.d, ztw, 17));
    const zy0 = MY + 80;
    const zgap = (MY + MH - 28 - zy0 - sum(zh)) / (Z.length - 1);
    let zy = zy0;
    Z.forEach((z, i) => {
      if (i) s.hline(ztx, zy - zgap / 2, ztw);
      s.badge({ x: rx, y: zy, d: bd, n: `0${i + 1}`, color: C.tint, textColor: C.blueText, size: 19 });
      const th = s.text(z.t, { x: ztx, y: zy + 8, w: ztw, size: 21, bold: true, lh: 1.05, color: C.navy });
      s.text(z.d, { x: ztx, y: zy + 8 + th + 8, w: ztw, size: 17, lh: 1.2, color: C.blueText });
      zy += zh[i] + zgap;
    });

    // --- нижняя полоса-вывод: простроенная система выбора ---
    const BH = 1019 - BY;
    s.box({ x: 58, y: BY, w: 1804, h: BH, fill: C.crimson, r: 25 });
    const blw = 420;
    s.text('Как расширяем Comprehensive в 2027'.toUpperCase(), { x: 98, y: BY + 22, w: blw, size: 16, bold: true, lh: 1.0, color: C.white, fit: true, maxLines: 1, minSize: 13 });
    s.text('Простроенная\nсистема выбора', { x: 98, y: BY + 46, w: blw, h: BH - 46 - 16, size: 28, bold: true, lh: 1.1, color: C.white, valign: 'middle', fit: true, maxLines: 2, minSize: 22 });
    s.vline(98 + blw + 30, BY + 22, BH - 44, C.white, 2);
    const px = 98 + blw + 60;
    s.text('**Programmatic** с сегментной коммуникацией и **блогеры** формируют охват в новых сегментах, **GEO/AEO + ORM + внешние публикации** снимают барьеры выбора, **Paid Search** переводит сформированный спрос в покупательское действие',
      { x: px, y: BY + 12, w: 1862 - 34 - px, h: BH - 24, size: 20, lh: 1.25, color: C.white, valign: 'middle', fit: true, minSize: 16 });
  },
};
