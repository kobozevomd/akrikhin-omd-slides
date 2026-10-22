// Азелик · стратегия 2027 — часть H: слайды исходника 53–59.
// 53 — блогеры 2027 (две картинки слоями → живой текст, фото блогеров из media), 54 — AI Visibility Stream
// (картинка → живой текст + вырезанный мокап), 55 — промостраницы (скрытый), 56 — контекст: роль Поиска и РСЯ,
// 57 — comprehensive в e-com (скрытый), 58 — digital-календарь 2027, 59 — итог: что даёт рост инвестиций.
// Аналоги в серии — Clindovit 16–19 (clindovit/part_e.js) и Acriol 21–23 (acriol/part_d.js).
const path = require('path');
const { C, countLines, textWidth, typo, tr, balanceTitle, columns, PT } = require('../../../lib/akrikhin');
const V = require('../../variants/common'); // TOP, GRID
const A = require('./common');              // MEDIA, CROPS, stageTag, STAGE

const MEDIA = A.MEDIA;
const CROPS = A.CROPS;
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
// Высота списка так же, как её оценивает s.bullets
const bulletsH = (items, w, size = 16, lh = 1.2, gap = 6, indent = 18) =>
  Math.round(sum(items.map((it) => countLines(view(it), size, w - indent, false) * size * lh)) + gap * (items.length - 1));
// Общий кегль для ряда чисел: самый крупный, при котором каждое влезает в свою ширину
const commonSize = (items, max, min, bold = true) => {
  let sz = max;
  while (sz > min && items.some(([t, w]) => widthOf(t, sz, bold) > w * 0.97)) sz -= 1;
  return sz;
};
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

// «=» в связках не начинает строку: «кислота = терапия» — знак держится за предыдущее слово (после перевода)
const glueEq = (t) => tr(String(t)).replace(/ = /g, '\u00a0= ');
// Цепочку ролей «EXPAND → WIN → FREQUENCY» не рвём (после перевода)
const glueRoles = (t) => tr(String(t)).replace(/(EXPAND|WIN) → /g, '$1\u00a0→\u00a0');

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
  // ===================== 53. Блогеры 2027: comprehensive-персонализация =====================
  53: (d) => {
    const s = d.slide({
      title: 'Блогеры 2027: comprehensive-персонализация',
      subtitle: 'Подбираем конкретных блогеров под сегменты и задачи благодаря AI-скорингу\nи превращаем охваты в измеримый post-click',
    });

    // --- ряд 1: как подбираем (AI-скоринг → персонализированное сообщение) · площадки 2027 ---
    const HOW = [
      { t: 'AI-скоринг блогеров', ic: 'tb:TbUsersGroup',
        items: ['Анализ аудитории и контента блогеров', 'Оценка соответствия сегментам и KPI', 'Выбор оптимального формата и тональности сообщения под каждый сегмент', 'Прогноз эффективности и минимизация рисков'] },
      { t: 'Персонализированное сообщение', ic: 'tb:TbTargetArrow',
        items: ['Сюжеты и форматы, релевантные интересам сегмента', 'Нативная интеграция продукта в опыт блогера', 'Переход на выбранную площадку и измерение post-click'] },
    ];
    const W1 = 1010;
    const PAD = 24;
    const AG = 44;                 // зазор под стрелку между блоками
    const hw = (W1 - 2 * PAD - AG) / 2;
    const BS = 16;
    const BLH = 1.15;
    const BG = 4;
    const IC = 38;
    const bh = HOW.map((h) => bulletsH(h.items, hw, BS, BLH, BG));
    const R1H = 18 + IC + 10 + Math.max(...bh) + 18;
    s.card({ x: 58, y: TOP, w: W1, h: R1H });
    HOW.forEach((h, i) => {
      const x = 58 + PAD + i * (hw + AG);
      s.icon(h.ic, { x, y: TOP + 18, size: IC, circle: C.blue, color: C.white });
      s.text(h.t, { x: x + IC + 12, y: TOP + 18, w: hw - IC - 12, h: IC, size: 21, bold: true, lh: 1.0, color: C.navy, valign: 'middle', fit: true, maxLines: 1, minSize: 17 });
      s.bullets(h.items, { x, y: TOP + 18 + IC + 10, w: hw, size: BS, lh: BLH, gap: BG });
    });
    s.chevron({ cx: 58 + PAD + hw + AG / 2, cy: TOP + R1H / 2, dir: 'right', w: 18, h: 30 });

    // площадки: используемые (логотипы) · не закладываем (Telegram, YouTube + пояснение ФАС)
    const X2 = 58 + W1 + 22;
    const W2 = 1862 - X2;
    s.card({ x: X2, y: TOP, w: W2, h: R1H });
    const px = X2 + PAD;
    const LG = 58;
    const lgap = 20;
    const pw = 4 * LG + 3 * lgap;
    s.text('Используемые площадки', { x: px, y: TOP + 20, w: pw + 10, size: 19, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 15 });
    const LOGOS = [
      [path.join(CROPS, 'h_vk.png'), 'VK'],
      [path.join(MEDIA, 'img_dd07a2f219.png'), 'MAX'],
      [path.join(CROPS, 'h_dzen.png'), 'Дзен'],
      [path.join(CROPS, 'h_rutube.png'), 'RUTUBE'],
    ];
    const ly = TOP + (R1H - (LG + 8 + 18)) / 2 + 14;
    LOGOS.forEach(([f, t], i) => {
      const x = px + i * (LG + lgap);
      s.image(f, { x, y: ly, w: LG, h: LG, alt: t });
      s.text(t, { x: x - 12, y: ly + LG + 8, w: LG + 24, size: 15, lh: 1.0, color: C.navy, align: 'center' });
    });
    const vx = px + pw + 24;
    s.vline(vx, TOP + 20, R1H - 40);
    const xx = vx + 24;
    const xw = X2 + W2 - PAD - xx;
    s.text('Не закладываем в медиаплан 2027', { x: xx, y: TOP + 20, w: xw, size: 19, bold: true, lh: 1.0, color: C.crimson, fit: true, maxLines: 1, minSize: 15 });
    let cx = xx;
    const cy = TOP + 54;
    [['tb:TbBrandTelegram', 'Telegram'], ['tb:TbBrandYoutube', 'YouTube']].forEach(([ic, t]) => {
      s.circle({ x: cx, y: cy, d: 34, fill: C.white, stroke: C.crimson, sw: 2 });
      s.icon(ic, { x: cx + 7, y: cy + 7, size: 20, color: C.crimson });
      const tw = widthOf(t, 17, true) + 4;
      s.text(t, { x: cx + 44, y: cy + 7, w: tw, size: 17, bold: true, lh: 1.0, color: C.navy });
      cx += 44 + tw + 26;
    });
    s.text('ФАС обозначила переходный период для рекламы на этих ресурсах только до конца 2026 года. Рекламу на этих площадках не планируем.',
      { x: xx, y: cy + 46, w: xw, h: TOP + R1H - 14 - (cy + 46), size: 15, lh: 1.2, color: C.blueText, fit: true, minSize: 14 });

    // --- ряд 2: 4 сегмента → конкретные блогеры и задачи ---
    const y2 = TOP + R1H + 18;
    const HEAD = '4 сегмента → конкретные блогеры и задачи';
    const headW = widthOf(HEAD, 24, true) + 6;
    s.text(HEAD, { x: 58, y: y2, w: headW, size: 24, bold: true, lh: 1.0, color: C.navy });
    s.text('Отбираем по соответствию сегменту, естественности опыта и способности дать измеримый результат',
      { x: 58 + headW + 28, y: y2 + 5, w: 1862 - (58 + headW + 28), size: 17, lh: 1.0, color: C.blueText, fit: true, maxLines: 1, minSize: 14 });

    const BY = 873;                 // нижняя полоса: результаты 2026 · бюджет · ожидаемый результат
    const y3 = y2 + 24 + 14;
    const CH = BY - 16 - y3;
    const BL = [
      { name: 'Юля Гаврилина', who: 'Ж 18–34', tag: 'Social girl', img: 'img_5beb4b0d6a.png', color: C.crimson,
        items: ['Lifestyle / beauty / fashion; часть повседневности', '«Не маскировать, а контролировать акне в привычную рутину»', 'Вертикальное видео + кликабельный пост'],
        task: 'Повысить интерес и вовлечённость молодой аудитории, стимулировать переходы на брендовый сайт/«Где купить»' },
      { name: 'Адель Мифтахова', who: 'Ж 18–34', tag: 'Beauty enthusiast', img: 'img_5cecea2c67.png', color: C.blue,
        items: ['Уход за кожей, разборы средств и составов', 'Азелик как регулярный аптечный уход рядом с привычным уходом', 'Заявленная кислота + увлажняющая основа, разбор рутины + ссылка'],
        task: 'Формировать знание и доверие, обучать правильному применению, давать кликабельную ссылку' },
      { name: 'Настя Дашкевич', who: 'Ж 18–34 · опыт аптечных anti-acne', tag: 'Skinoclear Switcher', img: 'img_77196fdbf2.png', color: C.cyan,
        items: ['Личный опыт проблемной кожи и использования аптечных anti-acne', 'Объективный опыт сухости/чувствительной кожи, сравнение с конкурентами', 'Эффективность + бережность, переход со Skinoclear'],
        task: 'Помочь аудитории с негативным опытом конкурента рассмотреть Азелик и перейти на покупку' },
      { name: 'Дима Ермузевич', who: 'М 18–34', tag: 'Clean boy', img: 'img_4b1e0d8cf6.png', color: C.green,
        items: ['Фитнес / лайфстайл / фэшн', 'Мужская аудитория — ядро, чистая минималистичная подача', 'Короткая понятная рутина, уход без лишних шагов, креатив + ссылка'],
        task: 'Повысить знание и интерес среди мужской аудитории, показать простую и эффективную рутину, стимулировать кликабельные переходы' },
    ];
    const cols = columns(4, { gap: 20 });
    const CP = 20;
    const PH = 100;
    const IW = cols[0].w - 2 * CP;
    const TS = 16;
    const bl = BL.map((b) => bulletsH(b.items, IW, 16, 1.15, 6));
    const bTop = y3 + 18 + PH + 16;
    const taskY = bTop + Math.max(...bl) + 16;
    BL.forEach((b, i) => {
      const { x, w } = cols[i];
      s.card({ x, y: y3, w, h: CH });
      s.box({ x: x + 24, y: y3, w: w - 48, h: 5, fill: b.color, r: 0 });
      s.image(path.join(MEDIA, b.img), { x: x + CP, y: y3 + 18, w: PH, h: PH, alt: b.name });
      const tx = x + CP + PH + 16;
      const tw = x + w - CP - tx;
      s.text(b.name, { x: tx, y: y3 + 22, w: tw, size: 21, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 17 });
      s.text(b.who, { x: tx, y: y3 + 50, w: tw, size: 16, lh: 1.0, color: C.blueText, fit: true, maxLines: 1, minSize: 13 });
      const pw2 = Math.min(tw, widthOf(b.tag, 16, true) + 32);
      s.box({ x: tx, y: y3 + 18 + PH - 32, w: pw2, h: 32, fill: b.color, r: 16 });
      s.text(b.tag, { x: tx, y: y3 + 18 + PH - 32, w: pw2, h: 32, size: 16, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle', fit: true, maxLines: 1, minSize: 13 });
      s.bullets(b.items, { x: x + CP, y: bTop, w: IW, size: 16, lh: 1.15, gap: 6 });
      // задача
      const th = y3 + CH - 16 - taskY;
      s.box({ x: x + 12, y: taskY, w: w - 24, h: th, fill: C.cardTint, r: 15 });
      s.text('Задача', { x: x + CP + 4, y: taskY + 12, w: IW - 8, size: 16, bold: true, lh: 1.0, color: b.color, caps: true });
      s.text(b.task, { x: x + CP + 4, y: taskY + 34, w: IW - 4, h: th - 34 - 6, size: TS, lh: 1.2, color: C.navy, fit: true, minSize: 14 });
    });

    // --- нижняя полоса: результаты 2026 · бюджет 2027 · ожидаемый результат ---
    const BH = BOT0 - BY;
    const RW = 930;
    s.box({ x: 58, y: BY, w: RW, h: BH, fill: C.navy, r: 25 });
    s.text('Результаты 2026', { x: 86, y: BY + 16, w: RW - 56, size: 18, bold: true, lh: 1.0, color: C.white, caps: true });
    const RES = [
      { a: '24%', b: '38%', l: 'BR%', dl: '−14 п.п.', dc: C.green },
      { a: '1,7', b: '1,6', l: 'depth', dl: '+0,1', dc: C.navy },
      { a: '25%', b: '2,7%', l: 'CR% «где купить»', dl: '×9', dc: C.green },
    ];
    const rx0 = 58 + 16;
    const rg = 14;
    const rcw = (58 + RW - 16 - rx0 - rg * 2) / 3;
    RES.forEach((r, i) => {
      const x = rx0 + i * (rcw + rg);
      const y = BY + 46;
      const h = BH - 46 - 16;
      s.box({ x, y, w: rcw, h, fill: C.white, r: 15 });
      const dw = widthOf(r.dl, 23, true) + 6;
      s.text([{ text: r.a, options: { bold: true } }, { text: ' / ' + r.b, options: { fontSize: PT(20) } }],
        { x: x + 18, y: y + 8, w: rcw - 36 - dw, size: 30, bold: false, lh: 1.0, color: C.navy });
      s.text(r.l, { x: x + 18, y: y + h - 28, w: rcw - 36 - dw + 20, size: 17, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 14 });
      s.text(r.dl, { x: x + rcw - 16 - dw, y, w: dw, h, size: 23, bold: true, lh: 1.0, color: r.dc, align: 'right', valign: 'middle' });
    });
    const BX = 58 + RW + 18;
    const BW2 = 330;
    s.box({ x: BX, y: BY, w: BW2, h: BH, fill: C.blue, r: 25 });
    s.icon('tb:TbCoins', { x: BX + 24, y: BY + (BH - 54) / 2, size: 54, color: C.white });
    s.text('Бюджет 2027', { x: BX + 96, y: BY + 22, w: BW2 - 112, size: 18, bold: true, lh: 1.0, color: C.white, caps: true });
    s.text('12 млн ₽', { x: BX + 96, y: BY + 48, w: BW2 - 112, size: 46, bold: true, lh: 1.0, color: C.white, fit: true, maxLines: 1, minSize: 34 });
    s.text('на 2 спринта', { x: BX + 96, y: BY + 100, w: BW2 - 112, size: 18, lh: 1.0, color: C.white });
    const EX = BX + BW2 + 18;
    const EW = 1862 - EX;
    s.card({ x: EX, y: BY, w: EW, h: BH, tint: true });
    s.icon('tb:TbChartBar', { x: EX + 22, y: BY + 16, size: 36, circle: C.crimson, color: C.white });
    s.text('Ожидаемый результат', { x: EX + 70, y: BY + 25, w: EW - 92, size: 17, bold: true, lh: 1.0, color: C.crimson, caps: true, fit: true, maxLines: 1, minSize: 14 });
    const ET = 'Масштабируем успешные связки 2026, усиливаем post-click и обеспечиваем рост интереса к бренду за счёт персонализированного подхода.';
    // кегль 16 и ширина ≥ 460: «post-click» встаёт в первую строку целиком (иначе рвётся по дефису)
    s.text(ET, { x: EX + 22, y: BY + 62, w: EW - 44, h: BH - 62 - 10, size: 16, lh: 1.2, color: C.navy, fit: true, minSize: 14 });
  },

  // ===================== 54. AI Visibility Stream =====================
  54: (d) => {
    const s = d.slide({
      title: 'AI Visibility Stream усиливает присутствие Азелика в момент поиска решения',
      subtitle: 'Внешние публикации и контентная выдача помогают занять релевантный контекст в поиске и AI-системах и закрепить связку: «Азелик — препарат с азелаиновой кислотой для терапии акне и постакне».',
    });
    A.stageTag(s, 'EXPAND');
    const BY = 873;                 // нижняя полоса: для Азелика → результат
    const MB = BY - 20;             // низ карточек
    const L = { x: 58, w: 600 };
    const R = { x: 1342, w: 520 };

    // --- слева: почему слой внешних публикаций работает ---
    s.card({ x: L.x, y: TOP, w: L.w, h: MB - TOP });
    const lx = L.x + 28;
    const lw = L.w - 56;
    s.text('Почему слой внешних публикаций работает', { x: lx, y: TOP + 24, w: lw, size: 22, bold: true, lh: 1.1, color: C.navy, fit: true, maxLines: 1, minSize: 18 });
    const WHY = [
      ['Экспертная нейтральная подача', 'Контент объясняет роль активных компонентов, сценарии применения и различия между подходами без рекламной тональности.', 'tb:TbSchool', C.crimson],
      ['Релевантность поисковому намерению', 'Материалы отвечают на реальные запросы пользователей: «чем мазать прыщи на лице», «азелаиновая кислота от акне», «что помогает от постакне».', 'tb:TbFileText', C.blue],
      ['Видимость в Search и AI', 'Статьи, обзоры и карточки ответов повышают вероятность появления бренда в органической выдаче, AI-ответах и рекомендательных блоках.', 'tb:TbSearch', C.crimson],
      ['Закрепление бренд-ассоциации', 'Повторяемая связка «Азелик = азелаиновая кислота = терапия акне и постакне» формирует понятную роль бренда в категории.', 'tb:TbChartBar', C.blue],
    ];
    const WD = 48;
    const wtx = lx + WD + 18;
    const wtw = lw - WD - 18;
    const wh = WHY.map(([t, dd]) => Math.max(WD, measure(t, wtw, 19, true, 1.1) + 5 + measure(dd, wtw, 16)));
    const wy0 = TOP + 24 + 26 + 24;
    const wgap = (MB - 24 - wy0 - sum(wh)) / (WHY.length - 1);
    let wy = wy0;
    WHY.forEach(([t, dd, ic, col], i) => {
      if (i) s.hline(wtx, wy - wgap / 2, wtw);
      s.icon(ic, { x: lx, y: wy, size: WD, circle: col, color: C.white });
      const th = s.text(t, { x: wtx, y: wy, w: wtw, size: 19, bold: true, lh: 1.1, color: C.navy });
      const gd = glueEq(dd);
      s.text(gd, { x: wtx, y: wy + th + 5, w: evenW(gd, wtw, 16), size: 16, lh: 1.2, color: C.blueText });
      wy += wh[i] + wgap;
    });

    // --- в центре: мокап (статья на сайте + AI-ответ в поиске) ---
    const MX = L.x + L.w + 22;
    const MW = R.x - 22 - MX;
    const mw = MW;
    const mh = Math.round(mw * 1190 / 1504);
    s.image(path.join(CROPS, 'h_mockup.png'), { x: MX, y: TOP + (MB - TOP - mh) / 2, w: mw, h: mh, alt: 'Пример: экспертная статья и AI-ответ в поиске' });

    // --- справа: роль в AI Visibility Stream ---
    s.card({ x: R.x, y: TOP, w: R.w, h: MB - TOP, tint: true });
    const rx = R.x + 28;
    const rw = R.w - 56;
    s.label('Роль в AI Visibility Stream', { x: rx, y: TOP + 26, w: rw, size: 20, color: C.navy });
    const ROLE = [
      ['Фокус', 'Search + AI + content discovery', 'tb:TbTargetArrow', C.crimson],
      ['Целевые интенты', 'Акне / постакне / азелаиновая кислота', 'tb:TbUsersGroup', C.blue],
      ['Контентный формат', 'Экспертные статьи, разборы, ответы', 'tb:TbFileText', C.crimson],
      ['Целевая связка', 'Азелик = азелаиновая кислота = терапия акне и постакне', 'tb:TbLink', C.blue],
    ];
    const RD = 48;
    const rtx = rx + RD + 18;
    const rtw = rw - RD - 18;
    const rh = ROLE.map(([c, v]) => Math.max(RD, 19 + 5 + measure(v, rtw, 21, true, 1.1)));
    const ry0 = TOP + 26 + 22 + 26;
    const rgap = (MB - 24 - ry0 - sum(rh)) / (ROLE.length - 1);
    let ry = ry0;
    ROLE.forEach(([c, v, ic, col], i) => {
      if (i) s.hline(rtx, ry - rgap / 2, rtw);
      s.icon(ic, { x: rx, y: ry, size: RD, circle: col, color: C.white });
      s.text(c, { x: rtx, y: ry, w: rtw, size: 16, lh: 1.0, color: C.blueText });
      const gv = glueEq(v);
      s.text(gv, { x: rtx, y: ry + 24, w: evenW(gv, rtw, 21, true), size: 21, bold: true, lh: 1.1, color: C.crimson });
      ry += rh[i] + rgap;
    });

    // --- нижняя полоса: для Азелика → результат ---
    const BH = BOT0 - BY;
    s.box({ x: 58, y: BY, w: 1804, h: BH, fill: C.crimson, r: 25 });
    const half = (1804 - 80) / 2;
    const PARTS = [
      { ic: 'tb:TbTargetArrow', lab: 'Для Азелика', t: 'Слой внешних публикаций помогает бренду быть найденным в момент выбора решения и формирует экспертную роль в категории.', bold: true },
      { ic: 'tb:TbChartBarPopular', lab: 'Результат', t: 'Бренд присутствует внутри релевантного контента и AI-ответов, укрепляя узнаваемую связку активного компонента, показания и бренда.', bold: false },
    ];
    PARTS.forEach((p, i) => {
      const x = 58 + 30 + i * (half + 40);
      s.icon(p.ic, { x, y: BY + (BH - 52) / 2, size: 52, color: C.white });
      const tx = x + 52 + 24;
      const tw = x + half - 20 - tx;
      s.text(p.lab, { x: tx, y: BY + 18, w: tw, size: 17, bold: true, lh: 1.0, color: C.white, caps: true });
      s.text(p.t, { x: tx, y: BY + 42, w: tw, h: BH - 42 - 12, size: 19, bold: p.bold, lh: 1.2, color: C.white, fit: true, minSize: 16 });
    });
    s.chevron({ cx: 58 + 30 + half + 20, cy: BY + BH / 2, dir: 'right', w: 20, h: 32, color: C.white });
  },

  // ===================== 55. Промостраницы 2027 (скрытый) =====================
  55: (d) => {
    const s = d.slide({ title: 'Промостраницы 2027: поддерживаем регулярность применения и возвращаем аудиторию к бренду' });
    s.s.hidden = true;
    A.stageTag(s, 'FREQUENCY');
    const L = { x: 58, w: 700 };
    const R = { x: 780, w: 1082 };
    const PAD = 30;

    // --- слева: что такое промостраницы · как используем в 2027 ---
    const lx = L.x + PAD;
    const lw = L.w - 2 * PAD;
    const WHAT_H = 'Сервис Яндекса для создания и размещения рекламных статей с вовлекающим контактом';
    const WHAT = ['Scroll to Site переводит пользователя со статьи на сайт клиента', 'Показы в РСЯ/Поиске с автотаргетингом по интересам и контенту', 'Возможна настройка GEO'];
    const c1h = 26 + 22 + 14 + measure(WHAT_H, lw, 20, true, 1.15) + 14 + bulletsH(WHAT, lw, 18, 1.2, 8) + 28;
    s.card({ x: L.x, y: TOP, w: L.w, h: c1h });
    let y = TOP + 26;
    y += s.label('Что такое промостраницы?', { x: lx, y, w: lw, size: 20, color: C.crimson }) + 14;
    y += s.text(WHAT_H, { x: lx, y, w: lw, size: 20, bold: true, lh: 1.15, color: C.navy }) + 14;
    s.bullets(WHAT, { x: lx, y, w: lw, size: 18, lh: 1.2, gap: 8 });

    const c2y = TOP + c1h + 22;
    s.card({ x: L.x, y: c2y, w: L.w, h: BOT0 - c2y });
    y = c2y + 26;
    y += s.label('Как используем в 2027', { x: lx, y, w: lw, size: 20, color: C.navy }) + 14;
    y += s.text('Размещаем статьи на базе контента сайта — это ускоряет подготовку и процесс согласования', { x: lx, y, w: lw, size: 20, bold: true, lh: 1.15, color: C.navy }) + 22;
    const USE = ['Формируем привычку регулярного использования азелаиновой кислоты', 'Стимул к repeat purchase', 'Привлечение «тёплой» аудитории', 'Поддержание спроса между Sprint-флайтами'];
    const ud = 42;
    const ug = 12;
    const ubh = (BOT0 - 22 - y - ug * (USE.length - 1)) / USE.length;
    const utw = lw - 16 - ud - 18 - 12;
    USE.forEach((t, i) => {
      s.box({ x: lx - 8, y, w: lw + 16, h: ubh, fill: C.cardTint, r: 15 });
      s.badge({ x: lx + 8, y: y + (ubh - ud) / 2, d: ud, n: i + 1, color: C.crimson, size: 20 });
      s.text(t, { x: lx + 8 + ud + 18, y, w: utw, h: ubh, size: 19, bold: true, lh: 1.15, color: C.navy, valign: 'middle', fit: true, minSize: 16 });
      y += ubh + ug;
    });

    // --- справа: главная мысль, примеры статей, KPI ---
    const rx = R.x;
    const rw = R.w;
    const MAIN = 'Промостраницы работают как [[поддерживающий контентный слой]]: повышают осведомленность о продукте и механике его применения, сохраняют интерес к теме между флайтами и возвращают пользователя к бренду';
    const mh = s.text(MAIN, { x: rx, y: TOP, w: rw, size: 25, bold: true, lh: 1.2, color: C.navy });
    // KPI снизу
    const KH = 128;
    const KY = BOT0 - KH;
    const KL = KY - 38;
    // примеры статей между главной мыслью и KPI
    const IMG = [['img_a11cdb389e.png', 512, 575], ['img_1f49f7ad9d.png', 509, 576], [path.join(CROPS, 'h_promo3.png'), 513, 581]];
    const ig = 22;
    const iyTop = TOP + mh + 26;
    const ihMax = KL - 24 - iyTop;
    let ih = ihMax;
    const iwOf = (h) => IMG.map(([, w0, h0]) => Math.round(h * w0 / h0));
    while (sum(iwOf(ih)) + ig * 2 > rw) ih -= 2;
    const iws = iwOf(ih);
    let ix = rx + (rw - sum(iws) - ig * 2) / 2;
    IMG.forEach(([f], i) => {
      s.image(path.isAbsolute(f) ? f : path.join(MEDIA, f), { x: ix, y: iyTop + (ihMax - ih) / 2, w: iws[i], h: ih, alt: 'Пример промостраницы' });
      ix += iws[i] + ig;
    });
    s.label('KPI и параметры размещения', { x: rx, y: KL, w: rw, size: 20, color: C.navy });
    s.card({ x: rx, y: KY, w: rw, h: KH, tint: true });
    const KPI = [['300К', 'бюджет в месяц', C.crimson], ['20 ₽', 'CPC на сайт клиента', C.navy], ['~1 млн', 'охват за 1 месяц', C.crimson], ['~10 ₽', 'цена дочитывания', C.navy]];
    const kw = rw / KPI.length;
    const ks = commonSize(KPI.map(([v]) => [v, kw - 40]), 44, 30);
    KPI.forEach(([v, t, col], i) => {
      const x = rx + i * kw;
      if (i) s.vline(x, KY + 22, KH - 44);
      s.text(v, { x: x + 20, y: KY + 22, w: kw - 40, size: ks, bold: true, lh: 1.0, color: col, align: 'center' });
      s.text(t, { x: x + 16, y: KY + 30 + ks, w: kw - 32, size: 17, lh: 1.15, color: C.blueText, align: 'center', fit: true, maxLines: 2, minSize: 14 });
    });
  },

  // ===================== 56. Контекстный подход: роль Поиска и РСЯ =====================
  56: (d) => {
    const s = d.slide({
      title: 'Азелик 2027: контекстный подход — разделяем роль Поиска и РСЯ',
      subtitle: 'Поиск забирает наиболее конверсионный спрос, РСЯ расширяет и возвращает аудиторию',
    });
    A.stageTag(s, 'FREQUENCY');
    const SC = C.blue;    // Поиск
    const RC = C.teal;    // РСЯ

    // --- полоса: общий сплит 2027 ---
    const TH = 116;
    s.card({ x: 58, y: TOP, w: 1804, h: TH });
    s.text('Общий сплит 2027', { x: 90, y: TOP + 24, w: 290, size: 18, bold: true, lh: 1.0, color: C.navy, caps: true });
    s.text('7,0 млн ₽', { x: 90, y: TOP + 50, w: 290, size: 46, bold: true, lh: 1.0, color: C.crimson, fit: true, maxLines: 1, minSize: 36 });
    const bx = 410;
    const bw = 1862 - 32 - bx;
    const by = TOP + 22;
    const bh = 44;
    const SPL = [
      { v: 46, bar: '**Поиск 46%** · 3,2 млн ₽', role: '**Поиск** — горячий спрос и целевые действия', col: SC },
      { v: 54, bar: '**РСЯ 54%** · 3,8 млн ₽', role: '**РСЯ** — масштабирование и возврат', col: RC },
    ];
    let sx = bx;
    SPL.forEach((p, i) => {
      const w = bw * p.v / 100 - (i === 0 ? 3 : 0);
      s.box({ x: sx, y: by, w, h: bh, fill: p.col, r: 12 });
      s.text(p.bar, { x: sx + 18, y: by, w: w - 36, h: bh, size: 19, lh: 1.0, color: C.white, valign: 'middle' });
      s.text(p.role, { x: sx + 2, y: by + bh + 12, w: w - 10, size: 17, lh: 1.0, color: C.navy });
      sx += w + 6;
    });

    // --- две колонки: Поиск забирает спрос · РСЯ расширяет и возвращает ---
    const CY = TOP + TH + 20;
    const cols = columns(2, { gap: 22 });
    const PAD = 28;
    const HH = 56;
    const COLS = [
      { head: '1. Поиск — забираем спрос', col: SC,
        rows: [
          { t: 'Бренд + бренд-транзакция', to: 'Аптека', v: 36, ex: 'Азелик действие, Азелик помогает при' },
          { t: 'Транзакционная', to: 'Аптека', v: 12, ex: 'Купить гель от акне, от угрей' },
          { t: 'Конкуренты', to: 'Сайт', v: 22, ex: 'Либридерм, Аравия, Базирон' },
          { t: 'Продукт', to: 'Сайт', v: 15, ex: 'Азелаиновая кислота, гель от угрей' },
          { t: 'Проблематика', to: 'Сайт', v: 15, ex: 'Воспаление, чёрные точки, жирная кожа' },
        ],
        why: 'Бренд отдельно: выше CR и прозрачнее контроль спроса. Сплит тактик — по ёмкости и фактической CPA.',
        goal: '«Где купить» + контроль качества трафика',
        goalT: 'Бренд ведём на аптеку; продуктовые, конкурентные и проблемные запросы — на сайт. Для небрендового спроса оцениваем не только конверсию, но и глубину, время на сайте и роботность.' },
      { head: '2. РСЯ — расширяем и возвращаем', col: RC,
        rows: [
          { t: 'Ретаргетинг', to: 'Аптека', v: 6, ex: 'Посетители сайта Азелик + Клиндовит' },
          { t: 'Брендовая', to: 'Сайт', v: 37, ex: 'Бренд + бренд-транзакционный' },
          { t: 'Общая оптимизированная', to: 'Сайт', v: 57, ex: 'Конкуренты + продукт + проблематика' },
        ],
        why: 'Конкуренты + продукт + проблематика объединены: больше данных для обучения и гибкое перераспределение бюджета для привлечения новой ЦА. Ретаргетинг — возвращает аудиторию Азелика и Клиндовита.',
        goal: '«Где купить» + качество трафика + возврат аудитории',
        goalT: 'Ретаргетинг и бренд оставляем отдельными контурами; общая РК даёт алгоритму больше свободы перераспределять бюджет.' },
    ];
    const iw = cols[0].w - 2 * PAD;
    const CHIP = 74;
    const DW = 120;        // колонка «куда ведём»
    const ttw = iw - CHIP - 18 - DW - 14;
    const rowH = (r) => Math.max(48, 22 + 4 + measure(r.ex, ttw, 16));
    const whyH = Math.max(...COLS.map((c) => 16 + 18 + 8 + measure(c.why, iw - 40, 17) + 16));
    const goalH = Math.max(...COLS.map((c) => 16 + measure(c.goal, iw - 40 - 70, 19, true, 1.1) + 8 + measure(c.goalT, iw - 40, 16) + 16));
    const BOT = BOT0;
    const rowsTop = CY + HH + 18;
    const whyY = BOT - 18 - goalH - 14 - whyH;
    const goalY = BOT - 18 - goalH;
    COLS.forEach((c, ci) => {
      const { x, w } = cols[ci];
      s.card({ x, y: CY, w, h: BOT - CY });
      s.box({ x, y: CY, w, h: HH, fill: c.col, r: 25 });
      s.box({ x, y: CY + HH - 25, w, h: 25, fill: c.col, r: 0 });
      s.text(c.head, { x: x + PAD, y: CY, w: w - 2 * PAD, h: HH, size: 22, bold: true, lh: 1.0, color: C.white, valign: 'middle' });
      // тактики: доля бюджета · тактика + примеры · куда ведём
      const hs = c.rows.map(rowH);
      const avail = whyY - 16 - rowsTop;
      const gap = (avail - sum(hs)) / (c.rows.length - 1);
      let y = rowsTop + (c.rows.length < 4 ? gap / 2 - 6 : 0);
      const g2 = c.rows.length < 4 ? (avail - sum(hs) - (gap - 12)) / (c.rows.length - 1) : gap;
      c.rows.forEach((r, i) => {
        const h = hs[i];
        const xx = x + PAD;
        s.box({ x: xx, y: y + (h - 44) / 2, w: CHIP, h: 44, fill: c.col, r: 12 });
        s.text(`${r.v}%`, { x: xx, y: y + (h - 44) / 2, w: CHIP, h: 44, size: 20, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
        const tx = xx + CHIP + 18;
        s.text(r.t, { x: tx, y, w: ttw, size: 19, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 15 });
        s.text(r.ex, { x: tx, y: y + 26, w: ttw, size: 16, lh: 1.2, color: C.blueText });
        const ph = 32;
        const pharm = r.to === 'Аптека';
        s.box({ x: x + w - PAD - DW, y: y + (h - ph) / 2, w: DW, h: ph, fill: pharm ? C.crimson : C.tint, r: 16 });
        s.text(r.to, { x: x + w - PAD - DW, y: y + (h - ph) / 2, w: DW, h: ph, size: 16, bold: true, lh: 1.0, color: pharm ? C.white : C.navy, align: 'center', valign: 'middle', caps: true });
        if (i < c.rows.length - 1) s.hline(tx, y + h + g2 / 2, x + w - PAD - tx);
        y += h + g2;
      });
      // почему так
      s.box({ x: x + 16, y: whyY, w: w - 32, h: whyH, fill: C.white, stroke: C.line, sw: 1.5, r: 15 });
      s.text('Почему так', { x: x + 36, y: whyY + 16, w: 300, size: 17, bold: true, lh: 1.0, color: C.crimson, caps: true });
      s.text(c.why, { x: x + 36, y: whyY + 16 + 26, w: evenW(c.why, iw - 40, 17), size: 17, lh: 1.2, color: C.blueText });
      // цель
      s.box({ x: x + 16, y: goalY, w: w - 32, h: goalH, fill: C.cardTint, r: 15 });
      s.text('Цель', { x: x + 36, y: goalY + 18, w: 60, size: 17, bold: true, lh: 1.0, color: C.crimson, caps: true });
      const gh = s.text(c.goal, { x: x + 36 + 70, y: goalY + 16, w: iw - 40 - 70, size: 19, bold: true, lh: 1.1, color: C.navy });
      s.text(c.goalT, { x: x + 36, y: goalY + 16 + gh + 8, w: evenW(c.goalT, iw - 40, 16), size: 16, lh: 1.2, color: C.blueText });
    });
    s.footnote('* Общий сплит Поиск / РСЯ — по сводному медиаплану; сплит тактик — по структуре соответствующих кампаний.');
  },

  // ===================== 57. Comprehensive в e-com (скрытый) =====================
  57: (d) => {
    const s = d.slide({
      title: 'Как переносим comprehensive подход в e-com',
      subtitle: 'Масштабируем связку «сегмент → e-com сигнал → персонализированный креатив»\nи тестируем новые креативные механики маркетплейсов',
    });
    s.s.hidden = true;
    const L = { x: 58, w: 890 };
    const R = { x: 970, w: 892 };
    const PH = 46;
    s.pill('01  Персонализируем e-com контакт', { x: L.x, y: TOP, w: L.w, h: PH, color: C.crimson, align: 'left', size: 20 });
    s.pill('02  Тестируем новые механики', { x: R.x, y: TOP, w: R.w, h: PH, color: C.navy, align: 'left', size: 20 });

    // --- слева: сегмент → контекст → креатив ---
    const CW = { seg: 360, ctx: 330, cr: L.w - 360 - 330 };
    const CX = { seg: L.x, ctx: L.x + CW.seg, cr: L.x + CW.seg + CW.ctx };
    const hy = TOP + PH + 20;
    const HEADS = [['seg', '01', 'Сегмент', 'берём из digital-стратегии', C.crimson], ['ctx', '02', 'Контекст', 'подбираем e-com сигнал', C.cyan], ['cr', '03', 'Креатив', 'повторяем 360° message', C.crimson]];
    HEADS.forEach(([k, n, t, sub, col], i) => {
      const x = CX[k] + (i ? 20 : 0);
      s.text(n, { x, y: hy + 4, w: 40, size: 18, bold: true, lh: 1.0, color: col });
      s.text(t, { x: x + 38, y: hy, w: CW[k] - 60, size: 24, bold: true, lh: 1.0, color: C.navy });
      s.text(sub, { x, y: hy + 32, w: CW[k] - 24, size: 15, lh: 1.0, color: MUTED_TXT });
      if (i < 2) s.chevron({ cx: CX[k] + CW[k] - 6, cy: hy + 12, dir: 'right', w: 14, h: 22, color: C.line });
    });
    const ROWS = [
      { st: 'SPRINT win the competition', seg: 'Ж 18–34 · Новые средства', d: 'Ищут новое решение и готовы пробовать альтернативы привычному уходу (анти-акне уход + проф. косметологические процедуры)',
        ctx: 'Покупки / интересы к средствам/лекарствам категории «уход за лицом, проблемная кожа, аптечная косметика»; покупки смежных SKU', img: 'img_44a17bb2bf.png', iw: 184, ih: 393, col: C.crimson },
      { st: 'SPRINT win the competition', seg: 'Switchers МЖ 18–34 (Skinoclear)', d: 'Пользователи / потенциальные switchers конкурентов',
        ctx: 'Покупки / интерес к конкурентным брендам и anti-acne SKU; ретаргетинг по релевантным карточкам', img: 'img_990dd37847.png', iw: 225, ih: 403, col: C.cyan },
      { st: 'Expand the category', seg: 'МЖ 18–40 · акне / постакне', d: 'Важно не только убрать воспаления, но и работать с последствиями',
        ctx: 'Повторные покупки; просмотр / корзина derm-SKU', img: 'img_abbb1acb3e.png', iw: 276, ih: 463, col: C.navy },
    ];
    const EVH = 186;                 // карточка «как оценить» снизу
    const EVY = BOT0 - EVH;
    const ry0 = hy + 66;
    const segTW = CW.seg - 22;
    const rowT = ROWS.map((r) => 15 + 6 + measure(r.seg, segTW, 17, true, 1.1) + 6 + measure(r.d, segTW, 15));
    const avail = EVY - 18 - ry0;
    const IH = Math.min(150, Math.floor((avail - 2 * 16) / 3));
    const rh = ROWS.map((r, i) => Math.max(IH, rowT[i]));
    const rgap = (avail - sum(rh)) / (ROWS.length - 1);
    let y = ry0;
    ROWS.forEach((r, i) => {
      const h = rh[i];
      s.box({ x: L.x, y, w: 6, h, fill: r.col, r: 0 });
      let yy = y + Math.max(0, (h - rowT[i]) / 2);
      s.text(r.st, { x: L.x + 20, y: yy, w: segTW, size: 15, bold: true, lh: 1.0, color: r.col, caps: true });
      yy += 21;
      yy += s.text(r.seg, { x: L.x + 20, y: yy, w: segTW, size: 17, bold: true, lh: 1.1, color: C.navy }) + 6;
      s.text(r.d, { x: L.x + 20, y: yy, w: segTW, size: 15, lh: 1.2, color: C.blueText });
      s.text(r.ctx, { x: CX.ctx + 20, y, w: CW.ctx - 40, h, size: 16, lh: 1.2, color: C.blueText, valign: 'middle' });
      const ih = Math.min(h, IH);
      const iw = Math.round(ih * r.iw / r.ih);
      s.image(path.join(MEDIA, r.img), { x: CX.cr + 20 + (CW.cr - 20 - iw) / 2, y: y + (h - ih) / 2, w: iw, h: ih, alt: 'Персонализированный креатив' });
      if (i < ROWS.length - 1) s.hline(L.x, y + h + rgap / 2, L.w);
      y += h + rgap;
    });
    // как оценить эффективность персонализации
    s.card({ x: L.x, y: EVY, w: L.w, h: EVH, tint: true });
    let ey = EVY + 22;
    ey += s.text('Как оценить эффективность персонализации в e-com', { x: L.x + 28, y: ey, w: L.w - 56, size: 20, bold: true, lh: 1.1, color: C.navy }) + 10;
    ey += s.text('**Контроль:** тот же сегмент + тот же e-com сигнал + базовый креатив\n**Тест:** тот же сегмент/контекст + персонализированный 360° message', { x: L.x + 28, y: ey, w: L.w - 56, size: 16, lh: 1.25, color: C.blueText }) + 12;
    s.text('Сравниваем uplift: CTR → Add-to-cart → To buy\n**Decision gate: масштабируем связку при uplift по CTR/корзине/заказам**', { x: L.x + 28, y: ey, w: L.w - 56, size: 17, lh: 1.25, color: C.crimson });

    // --- справа: A/B-тест главного фото ---
    const rx = R.x + 28;
    const rw = R.w - 56;
    let ty = TOP + PH + 20;
    ty += s.text('A/B-тест главного фото: проверяем креатив уже внутри карточки', { x: R.x, y: ty, w: R.w, size: 22, bold: true, lh: 1.1, color: C.navy, fit: true, maxLines: 1, minSize: 18 }) + 16;
    const PIW = 330;
    const PIH = Math.round(PIW * 1086 / 1448);
    const ptw = R.w - PIW - 24;
    const PARA = '**Переносим персонализацию внутрь карточки:** для одного SKU показываем разные главные фото разным сегментам аудитории. Сегмент задаём по параметрам **пол, возраст, семейное положение и регион**, а WB автоматически подбирает наиболее релевантных пользователей. Так связка **«сегмент → персонализированный креатив»** продолжается уже в e-com';
    const ph1 = s.text(PARA, { x: R.x, y: ty, w: ptw, size: 16, lh: 1.2, color: C.blueText });
    const AUD = '* Фактический состав аудитории может частично отличаться от заданных параметров.';
    s.text(AUD, { x: R.x, y: ty + ph1 + 10, w: evenW(AUD, ptw, 14), size: 14, lh: 1.2, color: MUTED_TXT });   // без висящего «параметров.»
    s.image(path.join(MEDIA, 'img_0874aa6a47.png'), { x: R.x + R.w - PIW, y: ty - 6, w: PIW, h: PIH, alt: 'Карточки товара для разных сегментов' });
    const AY = Math.max(ty + ph1 + 10 + 40, ty - 6 + PIH) + 18;
    s.card({ x: R.x, y: AY, w: R.w, h: BOT0 - AY, tint: true });
    let ay = AY + 22;
    ay += s.text('Как оценить эффективность карточки для целевой аудитории', { x: rx, y: ay, w: rw, size: 20, bold: true, lh: 1.1, color: C.navy }) + 10;
    ay += s.label('Методология A/B-теста', { x: rx, y: ay, w: rw, size: 16, color: C.crimson }) + 14;
    const STEPS = [
      { title: 'Делим аудиторию 50/50', text: 'Параллельно тестируем **текущее фото (A)** и **новый персонализированный креатив (B)** на сопоставимых группах пользователей' },
      { title: 'Фиксируем условия теста', text: 'Тест идет **1–8 недель**. В этот период не меняем главное фото вручную и поддерживаем наличие товара, чтобы результат отражал именно эффект креатива' },
      { title: 'Масштабируем только подтвержденный вариант', text: 'Сравниваем варианты по воронке **переход в карточку → корзина → заказ**. При статистически значимом uplift масштабируем победивший креатив; если разницы нет — **продлеваем тест или проверяем новую гипотезу**.' },
    ];
    const SCALE = 'Scale: победивший visual → default на карточке';
    const stH = s.steps(STEPS, { x: rx, y: ay, w: rw, pitch: 'auto', gap: 12, titleSize: 18, size: 16, d: 34 });
    s.text(SCALE, { x: rx, y: Math.min(ay + stH + 14, BOT0 - 22 - 24), w: rw, size: 18, bold: true, lh: 1.0, color: C.crimson });

    // сноски: метрики · источник
    s.footnote('* Метрики — по доступности данных площадки / поставщика', { w: L.w });
    s.footnote('Источник: Wildberries Seller, «А/Б-тестирование главного фото в карточке товара», обновлено 27.08.2026', { x: R.x, w: 1790 - R.x });
  },

  // ===================== 58. Digital support calendar 2027 =====================
  58: (d) => {
    const s = d.slide({ title: 'Digital support calendar 2027: flowchart' });

    // --- полоса KPI: бюджет со сплитом · brand health + sales · медиа-KPI ---
    const KY = TOP;
    const KH = 140;
    const BW = 450;
    s.box({ x: 58, y: KY, w: BW, h: KH, fill: C.blue, r: 25 });
    s.text('Budget', { x: 88, y: KY + 24, w: 180, size: 18, bold: true, lh: 1.0, color: C.white, caps: true });
    s.text('160M', { x: 88, y: KY + 54, w: 170, size: 60, bold: true, lh: 1.0, color: C.white, fit: true, maxLines: 1, minSize: 44 });
    s.vline(270, KY + 24, KH - 48, C.white, 1.5);
    const sx = 292;
    const sw = 58 + BW - 26 - sx;
    s.text('Бюджетный сплит*', { x: sx, y: KY + 24, w: sw, size: 15, bold: true, lh: 1.0, color: C.white, caps: true, fit: true, maxLines: 1, minSize: 12 });
    [['Digital media', '148,1M'], ['Tech cost', '11,9M'], ['Adriver', '2,8M']].forEach(([k, v], i) => {
      const y = KY + 54 + i * 26;
      s.text(k, { x: sx, y, w: sw - 80, size: 17, lh: 1.0, color: C.white });
      s.text(v, { x: sx + sw - 80, y, w: 80, size: 17, bold: true, lh: 1.0, color: C.white, align: 'right' });
    });
    // brand health + sales
    const HX = 58 + BW + 22;
    const HW = 560;
    s.card({ x: HX, y: KY, w: HW, h: KH });
    const hcw = 330;
    s.text('Brand Health KPIs', { x: HX + 26, y: KY + 24, w: hcw - 20, size: 17, bold: true, lh: 1.0, color: C.crimson });
    ['Grow purchase frequency 1,5 → 1,6', 'Aided Brand Awareness: 65% → 67%', 'Usage: 37% → 39%'].forEach((t, i) => {
      s.text(t, { x: HX + 26, y: KY + 54 + i * 26, w: hcw - 16, size: 17, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 14 });
    });
    s.vline(HX + 26 + hcw, KY + 24, KH - 48);
    const scx = HX + 26 + hcw + 22;
    const scw = HX + HW - 22 - scx;
    s.text('Sales', { x: scx, y: KY + 24, w: scw, size: 17, bold: true, lh: 1.0, color: C.crimson });
    s.text('+234 млн ₽\n(+22,2%)', { x: scx, y: KY + 54, w: scw, h: 66, size: 24, bold: true, lh: 1.1, color: C.navy, fit: true, maxLines: 2, minSize: 18 });
    // медиа-KPI
    const KX = HX + HW + 22;
    const KW = 1862 - KX;
    s.card({ x: KX, y: KY, w: KW, h: KH });
    s.text('Media KPIs', { x: KX + 26, y: KY + 24, w: 300, size: 17, bold: true, lh: 1.0, color: C.crimson });
    const KPI = [['590M', 'Impressions'], ['7,8M', 'Unique reach'], ['5,5', 'Freq.'], ['139M', 'Views'], ['2,4M', 'Clicks'], ['31 тыс.', 'Conversion\n«Где купить»']];
    const k0 = KX + 26;
    const wts = [1, 1, 0.8, 1, 0.9, 1.3];
    const kws = wts.map((k) => k * (KW - 40) / sum(wts));
    const ks = commonSize(KPI.map(([v], i) => [v, kws[i] - 18]), 32, 22);
    let kx = k0;
    KPI.forEach(([v, t], i) => {
      if (i) s.vline(kx - 10, KY + 58, KH - 80);
      s.text(v, { x: kx, y: KY + 56, w: kws[i] - 18, size: ks, bold: true, lh: 1.0, color: C.navy });
      s.text(t, { x: kx, y: KY + 62 + ks, w: kws[i] - 18, h: 40, size: 15, lh: 1.15, color: C.blueText, fit: true, maxLines: 2, minSize: 13 });
      kx += kws[i];
    });

    // --- календарь: инфо-колонки + 12 месяцев (полумесячная сетка исходника) ---
    const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    // периоды в полумесяцах [от, до) — по заливке ячеек исходника
    const ALL = [[0, 24]];
    const SPRINTS = [[3, 9], [13, 19]];   // буст: вторая половина февраля – первая половина мая; вторая половина июля – первая половина октября
    const SEG_SPRINT = 'Ж 18–34 новые средства\nЖ 18–34 Social girl\nВсе 18–34 Скиноклир\nМ 18–34 проблемная кожа\nЖ 18–34 чувствительная кожа';
    const ROWS = [
      { ch: 'Programmatic (banners+OLV)', sup: 'Mediasniper, Adsource', seg: 'All 18–45, акне пост-акне\n12–18 Подростки\nЖ 40+', bud: '18,1M', sob: '12,3%', act: ALL },
      { ch: 'Native', sup: 'NativeRent', seg: '—', bud: '3,6M', sob: '2,4%', act: ALL },
      { ch: 'Special Project', sup: 'Синхронизация, Clatch', seg: '—', bud: '3,5M', sob: '2,3%', act: [[4, 8], [14, 18]] },
      { ch: 'DOOH', sup: 'Yandex', seg: '—', bud: '1,6M', sob: '1,2%', act: [[10, 12]] },
      { ch: 'ORM', sup: '—', seg: '—', bud: '5,0M', sob: '3,4%', act: ALL },
      { ch: 'GEO | AEO', sup: '—', seg: '—', bud: '2,7M', sob: '1,8%', act: ALL },
      { ch: 'CTV', sup: 'MTS, GPM, Everest', seg: 'All 18–45', bud: '23,8M', sob: '16,2%', sprint: true },
      { ch: 'OLV', sup: 'MediaSniper + DPM cost', seg: null, bud: '24,1M', sob: '16,3%', sprint: true },
      { ch: 'Programmatic', sup: 'MS, Roxot, Adsource, Astralab + DPM cost', seg: null, bud: '33,6M', sob: '22,7%', sprint: true },
      { ch: 'Influencers', sup: 'VK, MAX, Zen, Rutube', seg: null, bud: '12,9M', sob: '8,7%', sprint: true },
      { ch: 'Paid Search', sup: 'Yandex Search + Network', seg: '—', bud: '4,3M', sob: '2,9%', sprint: true },
      { ch: 'Programmatic (banners)', sup: 'FirstData, Mediasniper', seg: 'All 18–45 покупатели анти-акне косметики\nРетаргетинг', bud: '9,0M', sob: '6,0%', act: [[4, 22]] },
      { ch: 'Native', sup: 'Promopages', seg: 'All 18–45', bud: '3,1M', sob: '2,0%', act: ALL },
      { ch: 'Paid Search', sup: 'Yandex Search + Network', seg: '—', bud: '2,8M', sob: '1,8%', act: ALL },
    ];
    const STAGES = [['EXPAND', 'Expand the category', 0, 6], ['SPRINT', 'Sprint\nWin the competition', 6, 5], ['FREQUENCY', 'Frequency', 11, 3]];
    const X0 = 58;
    const CW = { st: 128, ch: 196, sup: 214, seg: 262, bud: 76, sob: 70 };
    const cx = {};
    let acc = X0;
    for (const k of Object.keys(CW)) { cx[k] = acc; acc += CW[k]; }
    const MX = acc;
    const MW = (1862 - MX) / 12;
    const HW2 = MW / 2;
    const PADX = 10;
    const FS = 15;
    const HY = KY + KH + 18;
    const HH = 38;
    const TH = 38;
    const rowT = ROWS.map((r) => Math.max(
      measure(r.ch, CW.ch - 2 * PADX, 16, true, 1.15),
      measure(r.sup, CW.sup - 2 * PADX, FS, false, 1.15),
      r.seg ? measure(r.seg, CW.seg - 2 * PADX, FS, false, 1.15) : 0));
    let rowH = rowT.map((t) => t + 12);
    const spare = BOT0 - TH - (HY + HH) - sum(rowH);
    rowH = rowH.map((h, i) => (spare > 0 ? h + spare / ROWS.length : Math.max(rowT[i] + 4, h + spare / ROWS.length)));
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
    const bar = (a, b, yc, h, fill) => s.box({ x: MX + a * HW2 + 4, y: yc - h / 2, w: (b - a) * HW2 - 8, h, fill, r: h / 2 });
    const segSprintRows = [7, 8, 9];
    ROWS.forEach((r, i) => {
      const y0 = ys[i];
      const h = rowH[i];
      // разделители строк (сегмент спринта объединён на три строки — линию в его колонке не рисуем)
      if (segSprintRows.includes(i) && i < 9) {
        s.hline(cx.ch, y0 + h, cx.seg - cx.ch, C.line, 1.5);
        s.hline(cx.bud, y0 + h, 1862 - cx.bud, C.line, 1.5);
      } else s.hline(cx.ch, y0 + h, 1862 - cx.ch, C.line, 1.5);
      const cell = (k, t, o = {}) => s.text(t, { x: cx[k] + PADX, y: o.y ?? y0, w: CW[k] - 2 * PADX, h: o.h ?? h, size: o.size ?? FS, bold: !!o.bold, lh: 1.15,
        color: o.color ?? C.blueText, valign: 'middle', align: o.align ?? 'left' });
      cell('ch', r.ch, { size: 16, bold: true, color: C.navy });
      cell('sup', r.sup, r.sup === '—' ? { color: MUTED_TXT } : {});
      if (r.seg) cell('seg', r.seg, r.seg === '—' ? { color: MUTED_TXT } : {});
      cell('bud', r.bud, { size: 16, bold: true, color: C.navy, align: 'center' });
      cell('sob', r.sob, { align: 'center' });
      (r.act || []).forEach(([a, b]) => bar(a, b, y0 + h / 2, 16, 'A6CDEE'));
    });
    // объединённая ячейка сегментов спринта (OLV · Programmatic · Influencers)
    s.text(SEG_SPRINT, { x: cx.seg + PADX, y: ys[7], w: CW.seg - 2 * PADX, h: ys[9] + rowH[9] - ys[7], size: FS, lh: 1.15, color: C.blueText, valign: 'middle' });
    // спринты: один флайт на все каналы этапа + медиа-KPI флайта (как в исходнике)
    const sy0 = ys[6] + 6;
    const sy1 = ys[10] + rowH[10] - 6;
    SPRINTS.forEach(([a, b]) => {
      const x = MX + a * HW2 + 4;
      const w = (b - a) * HW2 - 8;
      s.box({ x, y: sy0, w, h: sy1 - sy0, fill: C.crimson, r: 16 });
      const KP = [['Unique reach', '3M'], ['Freq.', '5'], ['VTR', '89%']];
      const lh = 50;
      const ky0 = sy0 + (sy1 - sy0 - lh * KP.length) / 2;
      KP.forEach(([l, v], k) => {
        s.text(l, { x: x + 12, y: ky0 + k * lh, w: w - 24, size: 15, lh: 1.0, color: C.white, align: 'center' });
        s.text(v, { x: x + 12, y: ky0 + k * lh + 19, w: w - 24, size: 22, bold: true, lh: 1.0, color: C.white, align: 'center' });
      });
    });
    // этапы — цветами меток этапов деки
    STAGES.forEach(([k, t, i0, n]) => {
      const yy = ys[i0] + 3;
      const hh = ys[i0 + n - 1] + rowH[i0 + n - 1] - ys[i0] - 6;
      s.box({ x: X0 + 3, y: yy, w: CW.st - 10, h: hh, fill: A.STAGE[k], r: 10 });
      s.text(t.toUpperCase(), { x: X0 + 12, y: yy, w: CW.st - 28, h: hh, size: 15, bold: true, lh: 1.1, color: C.white, valign: 'middle', fit: true, maxLines: 3, minSize: 11 });
    });
    // итог
    s.box({ x: X0, y: yEnd, w: 1862 - X0, h: TH, fill: C.navy, r: 0 });
    s.text('TOTAL', { x: cx.ch + PADX, y: yEnd, w: CW.ch, h: TH, size: 16, bold: true, lh: 1.0, color: C.white, valign: 'middle' });
    s.text('148,1M', { x: cx.bud - 8, y: yEnd, w: CW.bud + 16, h: TH, size: 16, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
    s.text('100%', { x: cx.sob, y: yEnd, w: CW.sob, h: TH, size: 15, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });

    calLegend(s, [['A6CDEE', 'активный период'], [C.crimson, 'буст / приоритетный флайт']]);
    s.footnote('*Бюджет до НДС, включая АК/РС');
  },

  // ===================== 59. Итог: что даёт рост инвестиций =====================
  59: (d) => {
    const s = d.slide({ title: 'Азелик 2027', subtitle: 'Что дает рост инвестиций vs 2026' });

    // --- три плитки: бизнес-цель, инвестиции, охват ---
    const cols = columns(3, { gap: 22 });
    const TH = 150;
    // бизнес-цель: два показателя
    {
      const { x, w } = cols[0];
      s.box({ x, y: TOP, w, h: TH, fill: C.crimson, r: 25 });
      s.text('Бизнес-цель 2027', { x: x + 30, y: TOP + 22, w: w - 60, size: 18, bold: true, lh: 1.0, color: C.white, caps: true });
      // два показателя строками: «+14,9% Volume  1,365 → 1,569 млн уп.» (как в исходнике — друг под другом)
      const GO = [['+14,9%', 'Volume', '1,365 → 1,569 млн уп.'], ['+22,2%', 'Gross Sales', '1,053 → 1,287 млрд ₽']];
      const vw = Math.max(...GO.map(([v, u]) => widthOf(v, 36, true) + widthOf(' ' + u, 21, true))) + 8;
      GO.forEach(([v, u, sub], i) => {
        const gy = TOP + 52 + i * 46;
        s.text([{ text: v, options: {} }, { text: ' ' + u, options: { fontSize: PT(21) } }], { x: x + 30, y: gy, w: vw, size: 36, bold: true, lh: 1.0, color: C.white });
        s.text(sub, { x: x + 30 + vw + 14, y: gy + 13, w: x + w - 30 - (x + 30 + vw + 14), size: 18, lh: 1.0, color: C.white, fit: true, maxLines: 1, minSize: 14 });
      });
    }
    const TILES = [
      { lab: 'Инвестиции', v: '110 → 160 млн ₽', sub: ['+45% к 2026'], color: C.blue },
      { lab: 'Уникальный охват', v: '6M → 7,8M', sub: ['+30%', '87% Universe 18–40 акне'], color: C.navy2 },
    ];
    TILES.forEach((t, i) => {
      const { x, w } = cols[i + 1];
      s.box({ x, y: TOP, w, h: TH, fill: t.color, r: 25 });
      s.text(t.lab.toUpperCase(), { x: x + 30, y: TOP + 22, w: w - 60, size: 18, bold: true, lh: 1.0, color: C.white });
      s.text(t.v, { x: x + 30, y: TOP + 50, w: w - 60, size: 52, bold: true, lh: 1.0, color: C.white, fit: true, maxLines: 1, minSize: 38 });
      let ux = x + 30;
      t.sub.forEach((u, k) => {
        const uw = widthOf(u, 20, k === 0) + 4;
        s.text(u, { x: ux, y: TOP + 114, w: Math.min(uw, x + w - 30 - ux), size: 20, bold: k === 0, lh: 1.0, color: C.white });
        ux += uw + 24;
      });
    });

    const MY = TOP + TH + 24;
    const BY = 885;         // нижняя полоса-вывод
    const MH = BY - 22 - MY;

    // --- слева: как масштабируем Comprehensive (фазы года) ---
    const L = { x: 58, w: 1010 };
    s.card({ x: L.x, y: MY, w: L.w, h: MH });
    const lx = L.x + 34;
    const lw = L.w - 68;
    s.label('Как масштабируем Comprehensive в 2027', { x: lx, y: MY + 30, w: lw, size: 22, color: C.blue });
    const PH = [
      { n: 'AON', per: 'янв–фев', color: C.navy },
      { n: 'Sprint 1 + AON', per: '3,5 мес', color: C.crimson },
      { n: 'Поддержка', per: 'май–июл', color: C.cyan },
      { n: 'Sprint 2 + AON', per: '3 месяца', color: C.crimson },
      { n: 'AON', per: 'ноя–дек', color: C.navy },
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
    const LEAD = 'AON + 2 расширенных demand windows + поддержка в летний сезон (Graduation / BTS)';
    const CHAIN = ['Раньше входим в сезон', 'Дольше удерживаем спрос', 'Sprint 2 масштабирует winners'];
    const leadH = measure(LEAD, lw, 21, true, 1.15);
    const cg = 40;
    const cw = (lw - cg * (CHAIN.length - 1)) / CHAIN.length;
    const chH = Math.max(...CHAIN.map((t) => measure(t, cw - 36, 19, true, 1.15))) + 36;
    const free = MY + MH - 30 - (gy + GH) - leadH - chH;
    let yy = gy + GH + free * 0.36;
    s.text(balanceTitle(LEAD, 21, lw), { x: lx, y: yy, w: lw, size: 21, bold: true, lh: 1.15, color: C.navy });
    yy += leadH + free * 0.28;
    CHAIN.forEach((t, i) => {
      const x = lx + i * (cw + cg);
      s.box({ x, y: yy, w: cw, h: chH, fill: C.cardTint, r: 15 });
      s.text(t, { x: x + 18, y: yy, w: cw - 36, h: chH, size: 19, bold: true, lh: 1.15, color: C.navy, valign: 'middle', align: 'center' });
      if (i < CHAIN.length - 1) s.text('→', { x: x + cw, y: yy + chH / 2 - 15, w: cg, size: 26, bold: true, lh: 1.0, color: C.crimson, align: 'center' });
    });

    // --- справа: зоны расширения ---
    const R = { x: L.x + L.w + 22, w: 1862 - (L.x + L.w + 22) };
    s.card({ x: R.x, y: MY, w: R.w, h: MH });
    const rx = R.x + 34;
    const rw = R.w - 68;
    s.label('Зоны расширения', { x: rx, y: MY + 30, w: rw, size: 22, color: C.blue });
    const Z = [
      { t: 'New audiences & occasions', d: '4 AI-сегмента валидированы в 2026 + 2 новых сегмента на T&L (Ж 40+ акне, Ж 18–34 чувствительная кожа)' },
      { t: 'Personalization at scale', d: '2 AI-video 2026 + 3 новых perso-video; 4 + 3 новых пакета perso-creatives' },
      { t: 'Expanded consumer journey', d: 'Большой экран CTV → Search/AI → e-com → repeat' },
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
      s.text(z.d, { x: ztx, y: zy + 8 + th + 8, w: evenW(z.d, ztw, 17), size: 17, lh: 1.2, color: C.blueText });
      zy += zh[i] + zgap;
    });

    // --- нижняя полоса-вывод: единый CJM ---
    const BH = 1019 - BY;
    s.box({ x: 58, y: BY, w: 1804, h: BH, fill: C.crimson, r: 25 });
    const blw = 420;
    s.text('Как расширяем Comprehensive в 2027'.toUpperCase(), { x: 98, y: BY + 22, w: blw, size: 16, bold: true, lh: 1.0, color: C.white, fit: true, maxLines: 1, minSize: 13 });
    s.text('Единый CJM', { x: 98, y: BY + 46, w: blw, h: BH - 46 - 16, size: 34, bold: true, lh: 1.1, color: C.white, valign: 'middle', fit: true, maxLines: 2, minSize: 22 });
    s.vline(98 + blw + 30, BY + 22, BH - 44, C.white, 2);
    const px = 98 + blw + 60;
    s.text(glueRoles('**CTV** добавляет большой экран, **DOOH** — физические контексты, **Paid Search + GEO/AEO + ORM** становятся единым контуром видимости, **e-com** продолжает персонализированный путь до покупки. Каналы работают не независимо, а по ролям **EXPAND → WIN → FREQUENCY**.'),
      { x: px, y: BY + 12, w: 1862 - 34 - px, h: BH - 24, size: 20, lh: 1.25, color: C.white, valign: 'middle', fit: true, minSize: 16 });
  },
};
