// Часть D деки «Comprehensive draft 2027»: слайды черновика 22, 24, 25, 26.
// Эталоны фигмы: 22 ↔ figma_slide_06 (цикл из 6 шагов), 24 ↔ 07 (OMD Voice, три карточки),
// 25 ↔ 08 (активация сегментов), 26 ↔ 09 (процесс + иллюстрация + правая карточка).
const { C, ACCENTS, CHART_COLORS, columns, IN, PT, countLines, fitSize, typo } = require('../../lib/akrikhin');
const MEDIA = require('path').join(__dirname, '..', '..', 'work', 'comprehensive', 'src', 'media');

// ---------- Локальные хелперы ----------

// Высота текста так же, как её оценивает s.text (строки × кегль × интерлиньяж)
const measure = (text, w, size = 16, bold = false, lh = 1.2) =>
  Math.round(countLines(String(text).replace(/\*\*|\[\[|\]\]/g, ''), size, w, bold) * size * lh);

// Список с галочками / крестиками, шаг по фактической высоте пунктов (а не фиксированный pitch)
function checkList(s, items, { x, y, w, size = 18, gap = 16, mark, color = C.crimson, textColor = C.blueText }) {
  let cy = y;
  items.forEach((it) => {
    s.icon(mark === 'x' ? 'x_circle' : 'check_circle', { x, y: cy, size: 35, color: C.white, bg: color });
    const h = s.text(it, { x: x + 52, y: cy + 2, w: w - 52, size, lh: 1.2, color: textColor });
    cy += Math.max(35, h) + gap;
  });
  return cy - gap - y;
}
const checkListHeight = (items, { w, size = 18, gap = 16 }) =>
  items.reduce((a, it) => a + Math.max(35, measure(it, w - 52, size)) + gap, 0) - gap;

// Нумерованные шаги с вертикальной линией (как s.steps), но шаг считается по высоте текста,
// чтобы двухстрочные русские заголовки не наезжали на следующий пункт
function stepList(s, items, { x, y, w, d = 38, gap = 18, titleSize = 23, size = 16 }) {
  const tx = x + d + 21;
  const tw = w - d - 21;
  const hs = items.map((it) => {
    const th = measure(it.title, tw, titleSize, true, 1.0);
    return { th, h: Math.max(d, 5 + th + (it.text ? 9 + measure(it.text, tw, size) : 0)) };
  });
  const ys = [];
  let cy = y;
  hs.forEach((m) => { ys.push(cy); cy += m.h + gap; });
  if (items.length > 1) s.vline(x + d / 2, y + d / 2, ys[ys.length - 1] - y, C.line, 1.5);
  items.forEach((it, i) => {
    const hl = it.highlight;
    s.badge({ x, y: ys[i], d, n: i + 1, color: hl ? C.crimson : C.tint, textColor: hl ? C.white : C.blueText });
    s.text(it.title, { x: tx, y: ys[i] + 5, w: tw, size: titleSize, bold: true, lh: 1.0, color: C.blueText });
    if (it.text) s.text(it.text, { x: tx, y: ys[i] + 5 + hs[i].th + 9, w: tw, size, lh: 1.2 });
  });
  return cy - gap - y;
}

module.exports = {
  // 22. Операционный цикл: 6 колонок, плитки с иконками, полоса-цикл (эталон figma_slide_06)
  22: (d) => {
    const s = d.slide({ title: 'Операционный цикл Comprehensive 2027:\nUnderstand → Validate → Activate → Personalize → Measure → Learn' });
    const colors = [C.sky, C.teal, C.blue, C.orange, C.crimson, C.navy2];
    const data = [
      ['UNDERSTAND', 'AI CJM', 'Потребности, барьеры, оккейжены, сегментные гипотезы', 'tb:TbZoomQuestion', 'Find the right problem'],
      ['VALIDATE', 'OMD Voice', 'Синтетические панели, pre-test сообщения / оффера / tone of voice', 'tb:TbMessageQuestion', 'Challenge the hypothesis'],
      ['ACTIVATE', 'AI DSPs', 'Выбор AdTech-поставщика, динамический поиск аудитории', 'tb:TbUsers', 'Find the right people'],
      ['PERSONALIZE', 'Creative + Experience', 'CMP, AI-видео, perso-LP, SEO + GEO/AEO + ORM + Paid Search', 'tb:TbMessageDots', 'Deliver the right message'],
      ['MEASURE', 'Signals → Business', 'Brand Attention Monitoring, post-click, BLS, Sales Lift', 'tb:TbRosetteDiscountCheck', 'Prove what changed'],
      ['LEARN\n& RE-APPLY', 'Benchmarks', 'Golden Rules, decision gates, cross-brand learnings', 'tb:TbHandClick', 'Make the next decision better'],
    ];
    // один кегль подписи во всех шести плитках
    const tileSize = Math.min(...data.map((r) => fitSize(typo(r[4]), 26, 18, 235 - 32, 2, true)));
    columns(6, { gap: 17 }).forEach((col, i) => {
      const [lab, name, desc, icon, tileText] = data[i];
      const { cx, cw } = s.numberedCard({ x: col.x, y: 225, w: col.w, h: 565, n: i + 1, color: colors[i], d: 70, pad: 27 });
      s.text(lab, { x: cx, y: 341, w: cw, size: 30, bold: true, lh: 1.1, color: colors[i] });
      const nh = s.text(name, { x: cx, y: 425, w: cw, size: 29, bold: true, lh: 1.1, color: C.navy });
      s.text(desc, { x: cx, y: 425 + nh + 10, w: cw, h: 581 - 12 - (425 + nh + 10), size: 16, fit: true, minSize: 15 });
      s.tile({ x: col.x + 26, y: 581, w: 235, h: 182, color: colors[i], icon, text: tileText, size: tileSize });
    });
    s.card({ x: 124, y: 823, w: 1669, h: 79 });
    s.text('Результаты кампании → обновленное правило по сегменту / креативу / поставщику → планирование следующего флайта → cross-brand использование',
      { x: 154, y: 823, w: 1609, h: 79, size: 20, bold: true, color: C.blue, align: 'center', valign: 'middle', fit: true, maxLines: 1, minSize: 17 });
    s.arrow({ dir: 'left', x: 58, y: 862, len: 66, head: 79, headLen: 37, stem: 39 });
    s.arrow({ dir: 'right', x: 1796, y: 862, len: 66, head: 79, headLen: 37, stem: 39 });
    s.principle({ x: 245, w: 1431, icon: 'tb:TbRefresh', label: 'Замкнутый цикл обучения', text: 'Одна система, много инструментов: каждый пилот 2027 должен завершаться правилом принятия решения, а не только результатом кампании' });
  },

  // 24. OMD Voice: три карточки (эталон figma_slide_07)
  24: (d) => {
    // заголовок не влезает в 1 строку → библиотека сама включает шапку «заголовок в 2 строки + подзаголовок»
    const s = d.slide({
      title: 'OMD Voice: AI CJM развивается в калиброванную синтетическую панель аудиторий',
      subtitle: 'Та же логика сегментов, что и в AI CJM, но с большей точностью: каждый сегмент калибруется на открытых, индустриальных и брендовых данных и может отвечать на вопросы как реальный респондент',
    });
    const top = 221;
    const bottom = 903;
    const cols = columns(3, { gap: 22 });
    const HS = 30; // общий кегль заголовков карточек: русские заголовки длиннее, 34 даёт 3 строки
    const ix = cols.map((c) => c.x + 33);
    const iw = cols[0].w - 66;

    // левая — выделенная
    s.card({ x: cols[0].x, y: top, w: cols[0].w, h: bottom - top, tint: true });
    s.label('Логичный следующий шаг', { x: ix[0], y: top + 32, w: iw, color: C.green });
    s.heading('OMD Voice развивает AI CJM,\nзначительно повышая точность', { x: ix[0], y: top + 68, w: iw, size: HS });
    let y = top + 68 + 2 * HS * 1.1 + 24;
    const bx = ix[0] + 2;
    const bw = iw - 4;
    const t1 = 'Считывает digital-сигналы и язык потребителя. Формирует сегменты, потребности, барьеры и occasions.';
    const b1h = 18 + 28 + 10 + measure(t1, bw - 34, 18) + 8 + 22 + 18;
    s.box({ x: bx, y, w: bw, h: b1h, fill: C.white, stroke: C.line });
    s.text('AI CJM · 2026', { x: bx + 17, y: y + 18, w: bw - 34, size: 28, bold: true, lh: 1.0 });
    const h1 = s.text(t1, { x: bx + 17, y: y + 56, w: bw - 34, size: 18 });
    s.text('**Результат:** [[**гипотеза об аудитории**]]', { x: bx + 17, y: y + 56 + h1 + 8, w: bw - 34, size: 18 });
    y += b1h;
    s.arrow({ dir: 'down', x: bx + 174, y: y + 18, len: 48 });
    s.text('+ калибровка на реальных данных', { x: bx + 207, y: y + 30, w: 300, size: 14, bold: true, lh: 1.0, color: C.crimson });
    y += 68;
    const t2 = 'Каждый сегмент становится группой смоделированных респондентов с заданным соц-дем профилем, мотивами и барьерами. Панель отвечает на вопросы и оценивает сообщения, офферы и креативы.';
    const t3 = 'Результат для маркетинга: валидированная гипотеза, размер сегмента в людях, карта тачпоинтов включая e-com, роль врача в выборе';
    s.box({ x: bx, y, w: bw, h: bottom - 34 - y, fill: C.crimson });
    s.text('OMD VOICE · 2027', { x: bx + 17, y: y + 18, w: bw - 34, size: 28, bold: true, lh: 1.0, color: C.white });
    const h2 = s.text(t2, { x: bx + 17, y: y + 56, w: bw - 34, size: 18, color: C.white });
    s.text(t3, { x: bx + 17, y: y + 56 + h2 + 10, w: bw - 34, size: 18, bold: true, color: C.white });

    // средняя — шаги калибровки
    s.card({ x: cols[1].x, y: top, w: cols[1].w, h: bottom - top });
    s.label('Калибровка', { x: ix[1], y: top + 32, w: iw, color: C.cyan });
    s.heading('Каждый сегмент опирается\nна реальные данные', { x: ix[1], y: top + 68, w: iw, size: HS });
    stepList(s, [
      { title: 'Открытые исследования\nи официальная статистика', text: 'Росстат, ВЦИОМ, опубликованные исследования → размер сегментов и демографические данные' },
      { title: 'Mediascope Brand Pulse', text: 'Brand awareness и воронка по категории → позиция бренда в каждом сегменте' },
      { title: 'Mediascope TV Index & Cross Web', text: 'Media consumption → роли каналов и карта тачпоинтов для каждого сегмента' },
      { title: 'Язык потребителя', text: 'Отзывы, форумы, social media, e-pharmacies → мотивы, барьеры и реальные формулировки' },
      { title: 'Результаты кампаний\nи внешние AI-сегменты', text: 'Post-click, BLS, пересечения с AI-кластерами поставщиков → learnings возвращаются в панель', highlight: true },
    ], { x: ix[1], y: top + 68 + 2 * HS * 1.1 + 24, w: iw, gap: 19, titleSize: 21 });

    // правая — галочки + красный блок
    s.card({ x: cols[2].x, y: top, w: cols[2].w, h: bottom - top });
    s.label('Контроль качества', { x: ix[2], y: top + 32, w: iw, color: C.purple });
    s.heading('Встроенная проверка устойчивости\nи достоверности результатов', { x: ix[2], y: top + 68, w: iw, size: HS, h: 2 * HS * 1.1 });
    checkList(s, [
      '3 независимые сборки с нуля, сотни прогонов: в карту попадают только воспроизводимые сегменты',
      'Каждая цифра подтверждается внешними данными и исследованиями',
      'Placebo traps и повторные прогоны: результат учитывается только при устойчивом разрыве между вариантами',
      'Метод SSR*: до 90% human test-retest reliability в 57 реальных исследованиях (PyMC Labs, 2025)',
    ], { x: ix[2], y: top + 68 + 2 * HS * 1.1 + 28, w: iw, size: 18, gap: 16 });
    const dt = 'Можно задавать любому сегменту вопросы в свободной форме — фокус-группа или глубинное интервью. Ответ — от 15 минут до 2 часов.';
    const de = 'Пример: насколько рекомендация врача влияет на выбор в этом сегменте?';
    const dh = 18 + 28 + 10 + measure(dt, bw - 34, 18, true) + 8 + measure(de, bw - 34, 18) + 18;
    const dy = bottom - 34 - dh;
    s.box({ x: ix[2] + 2, y: dy, w: bw, h: dh, fill: C.crimson });
    s.text('РЕЖИМ ДИАЛОГА', { x: ix[2] + 19, y: dy + 18, w: bw - 34, size: 28, bold: true, lh: 1.0, color: C.white });
    const dth = s.text(dt, { x: ix[2] + 19, y: dy + 56, w: bw - 34, size: 18, bold: true, color: C.white });
    s.text(de, { x: ix[2] + 19, y: dy + 56 + dth + 8, w: bw - 34, size: 18, color: C.white });

    s.formula({ x: 232, w: 1453, text: 'Карта сегментов AI CJM → калибровка на открытых, индустриальных и брендовых данных → панель OMD Voice → валидированный ответ до вложения инвестиций' });
    s.footnote('*SSR — Semantic Similarity Rating: респондент отвечает своими словами, ответ сопоставляется по смыслу со шкальными утверждениями и преобразуется в распределение scores', { x: 58, w: 1804, y: 1030, size: 14 });
  },

  // 25. Активация сегментов: 2026 DMP → 2027 прямые интеграции → два контура (эталон figma_slide_08)
  25: (d) => {
    const s = d.slide({
      title: 'Активация сегментов: от AI DMP к прямым интеграциям с\u00A0платформами (DSPs)', // неразрывный пробел: «с» не висит в конце строки
      subtitle: 'OMD Voice передает каждой DSP полную техническую карту сегмента; DSP собирает аудиторию на собственных данных и AI, а размер сегмента возвращается в планирование',
    });
    const top = 221;
    const bottom = 903;
    const cols = columns(3, { gap: 22 });
    const HS = 27; // максимум, при котором все три заголовка карточек встают в 2 строки
    const ix = cols.map((c) => c.x + 33);
    const iw = cols[0].w - 66;
    const hy = top + 68;           // заголовок карточки
    const by = hy + 2 * HS * 1.1 + 24; // начало содержимого

    // левая — 2026, выделенная
    s.card({ x: cols[0].x, y: top, w: cols[0].w, h: bottom - top, tint: true });
    s.label('2026 · Единое DMP-решение', { x: ix[0], y: top + 32, w: iw, color: C.green });
    s.heading('Один DMP-сегмент\nдля всех платформ', { x: ix[0], y: hy, w: iw, size: HS });
    const route = [['AI CJM', 'текстовое описание сегмента'], ['DMP', 'сегмент собирается из одного пула данных'], ['Все платформы', 'один и тот же сегмент одновременно']];
    const rh = 84;
    const rg = 16;
    route.forEach(([t, txt], i) => {
      const ry = by + i * (rh + rg);
      s.box({ x: ix[0] + 2, y: ry, w: iw - 4, h: rh, fill: C.white, stroke: C.line });
      s.text(t, { x: ix[0] + 19, y: ry + 14, w: iw - 40, size: 26, bold: true, lh: 1.0 });
      s.text(txt, { x: ix[0] + 19, y: ry + 48, w: iw - 40, size: 16 });
      if (i < route.length - 1) s.chevron({ cx: ix[0] + iw / 2, cy: ry + rh + rg / 2, dir: 'down', color: C.blue, w: 30, h: 14 });
    });
    // средняя — 2027 прямые интеграции
    s.card({ x: cols[1].x, y: top, w: cols[1].w, h: bottom - top });
    s.label('2027 · Прямые интеграции с DSP', { x: ix[1], y: top + 32, w: iw, color: C.cyan });
    s.heading('Платформа собирает аудиторию на основе технической карты OMD Voice', { x: ix[1], y: hy, w: iw, size: HS, h: 2 * HS * 1.1 });
    const sh = stepList(s, [
      { title: 'Техническая карта сегмента', text: 'OMD Voice: Семантика, параметры, правила и готовые признаки сегмента в формате, который платформа может автоматически обработать', highlight: true },
      { title: 'Сборка на стороне платформы', text: 'MTS Ads и Platforma собирают аудиторию в собственной таксономии с помощью своего AI', highlight: true },
      { title: 'Размер возвращается в планирование', text: 'Размер и состав сегмента возвращаются в медиаплан: охват и кросс-платформенные пересечения', highlight: true },
    ], { x: ix[1], y: by, w: iw, gap: 18, titleSize: 21 });
    // «Ограничения» слева и «Что получаем» в середине — на одной высоте
    const gy = Math.max(by + 3 * rh + 2 * rg + 30, by + sh + 30);
    s.label('Ограничения', { x: ix[0], y: gy, w: iw, color: C.crimson });
    checkList(s, [
      'Сегменты слишком узкие: один DMP-сегмент одновременно используется на всех платформах',
      'Частота слишком высокая: одни и те же пользователи получают повторные контакты',
    ], { x: ix[0], y: gy + 40, w: iw, size: 16, gap: 12, mark: 'x' });
    s.label('Что получаем', { x: ix[1], y: gy, w: iw, color: C.crimson });
    checkList(s, [
      '**[[Экономия 30%+]] Data cost VS годовая подписка OMD\u00A0VOICE**',
      'Более широкий список платформ, не ограниченный DMP-партнерами',
      'Частота и охват управляются на уровне каждой платформы',
    ], { x: ix[1], y: gy + 40, w: iw, size: 16, gap: 12 });

    // правая — два контура + People vs IDs
    s.card({ x: cols[2].x, y: top, w: cols[2].w, h: bottom - top });
    s.label('Два контура', { x: ix[2], y: top + 32, w: iw, color: C.purple });
    s.heading('Методология переносится по задаче и не привязана к одному DMP-решению', { x: ix[2], y: hy, w: iw, size: HS, h: 2 * HS * 1.1 });
    const contours = [
      ['Прямые интеграции', 'OMD Voice ↔ DSP и платформы: правила сегментации передаются наружу, объемы сегментов возвращаются'],
      ['Внешние AI-сегменты', 'Поставщики формируют собственные AI-кластеры; пересечения с нашими сегментами возвращают learnings в OMD Voice'],
    ];
    let cy = by;
    contours.forEach(([t, txt], i) => {
      s.badge({ x: ix[2], y: cy, d: 38, n: i + 1, color: C.blue });
      s.text(t, { x: ix[2] + 59, y: cy + 5, w: iw - 59, size: 21, bold: true, lh: 1.0 });
      const th = s.text(txt, { x: ix[2] + 59, y: cy + 5 + 21 + 9, w: iw - 59, size: 16 });
      cy += 5 + 21 + 9 + th + 22;
    });
    const pt = 'OMD Voice оценивает аудиторию в людях; платформа формирует более крупный технический сегмент в IDs. Это ожидаемо: capacity платформы и пересечения учитываются в медиаплане';
    const ph = 18 + 28 + 10 + measure(pt, iw - 38, 18) + 18;
    const py = bottom - 34 - ph;
    s.box({ x: ix[2] + 2, y: py, w: iw - 4, h: ph, fill: C.crimson });
    s.text('PEOPLE VS IDs', { x: ix[2] + 19, y: py + 18, w: iw - 38, size: 28, bold: true, lh: 1.0, color: C.white });
    s.text(pt, { x: ix[2] + 19, y: py + 56, w: iw - 38, size: 18, color: C.white });

    s.principle({ label: 'Принцип 2027', icon: 'target', text: 'Нет единого DMP-решения по умолчанию: технологический контур выбирается под каждую задачу с учетом media, data и аудитории' });
  },

  // 26. Персонализированный контент: процесс из 4 шагов, иллюстративная таблица, правая карточка (эталон figma_slide_09)
  26: (d) => {
    const s = d.slide({
      title: 'Персонализированный контент с OMD Voice: Generate → Pre-test → Launch',
      subtitle: 'Нейросеть генерирует креативы и посадочные страницы для каждого сегмента и сразу проверяет их на панели: каждый сегмент получает сообщение, на которое реагирует лучше',
    });
    const top = 221;
    const bottom = 903;
    // левая широкая карточка
    const L = { x: 58, w: 1194 };
    const lx = L.x + 33;
    const lw = L.w - 66;
    s.card({ x: L.x, y: top, w: L.w, h: bottom - top, tint: true });
    s.label('Как это работает', { x: lx, y: 255, w: lw, color: C.green });
    s.heading('AI генерирует версии для каждого сегмента,\nа панель тестирует их до запуска', { x: lx, y: 293, w: lw, size: 34 });

    const steps = [
      ['Профиль сегмента', 'Мотивы, барьеры, оккейжены и реальные формулировки из панели'],
      ['AI generation', 'Креативы, AI video и версии посадочных страниц для каждого сегмента'],
      ['Panel test', 'Каждый сегмент оценивает версии → результаты формируют сравнительный рейтинг'],
      ['Launch', 'Лучшие версии масштабируются через CMP, AI-video и персонализированные посадочные страницы'],
    ];
    const sg = 24;
    const sw = (lw - 3 * sg) / 4;
    const sy = 410;
    const sh = 174;
    steps.forEach(([t, txt], i) => {
      const x = lx + i * (sw + sg);
      s.box({ x, y: sy, w: sw, h: sh, fill: C.white, stroke: C.line });
      s.badge({ x: x + 16, y: sy - 19, d: 38, n: i + 1, color: C.crimson });
      s.text(t, { x: x + 16, y: sy + 31, w: sw - 32, size: 23, bold: true, lh: 1.0, fit: true, maxLines: 1, minSize: 20 });
      s.text(txt, { x: x + 16, y: sy + 64, w: sw - 32, h: sh - 64 - 12, size: 16 });
      if (i < steps.length - 1) s.chevron({ cx: x + sw + sg / 2, cy: sy + sh / 2, color: C.crimson });
    });
    s.text('← Слабые версии → доработка → повторный тест', { x: lx, y: sy + sh + 14, w: lw, size: 16, color: C.crimson, align: 'center' });

    // иллюстративная таблица версий
    const ty = 646;
    s.label('Пример сравнения версий по сегментам', { x: lx, y: ty, w: lw, size: 22, color: C.crimson });
    const segW = 120;
    const cw = 186;
    const cg = 14;
    const cx0 = lx + segW;
    const rowY = [ty + 72, ty + 72 + 54, ty + 72 + 108];
    const ch = 42;
    ['Версия 1', 'Версия 2', 'Версия 3'].forEach((v, j) => {
      s.text(v, { x: cx0 + j * (cw + cg), y: ty + 42, w: cw, size: 16, bold: true, color: C.navy, align: 'center' });
    });
    const best = [1, 0, 2];
    ['Сегмент A', 'Сегмент B', 'Сегмент C'].forEach((seg, r) => {
      s.text(seg, { x: lx, y: rowY[r], w: segW - 10, h: ch, size: 16, bold: true, color: C.navy, valign: 'middle' });
      for (let j = 0; j < 3; j++) {
        const x = cx0 + j * (cw + cg);
        const win = best[r] === j;
        s.box({ x, y: rowY[r], w: cw, h: ch, fill: win ? C.crimson : C.white, stroke: win ? undefined : C.line, r: 12 });
        s.text(win ? '✓ лучший вариант' : 'ниже оценка', { x: x + 6, y: rowY[r], w: cw - 12, h: ch, size: 16, bold: win, color: win ? C.white : C.blueText, align: 'center', valign: 'middle' });
      }
    });
    // вывод к таблице
    const nx = cx0 + 3 * cw + 2 * cg + 32;
    const nw = lx + lw - nx;
    s.box({ x: nx, y: rowY[0], w: nw, h: rowY[2] + ch - rowY[0], fill: C.crimson });
    s.text('**Разные сегменты лучше реагируют на разные версии.** Панель показывает, какую версию запускать для каждого сегмента.',
      { x: nx + 24, y: rowY[0], w: nw - 48, h: rowY[2] + ch - rowY[0], size: 18, color: C.white, valign: 'middle', fit: true, minSize: 16 });

    // правая карточка — что получаем
    const R = { x: 1275, w: 587 };
    const rx = R.x + 33;
    const rw = R.w - 66;
    s.card({ x: R.x, y: top, w: R.w, h: bottom - top });
    s.label('Что получаем', { x: rx, y: 255, w: rw, color: C.purple });
    s.heading('Точная коммуникация\nс каждым сегментом', { x: rx, y: 293, w: rw, size: 34 });
    checkList(s, [
      'Message, RTB и tone of voice проверяются самим сегментом до запуска',
      'Больше вариантов без дополнительных исследований: тест занимает часы, а не недели',
      'Слабые версии отсеиваются до продакшн-этапа и вложения инвестиций',
    ], { x: rx, y: 400, w: rw, size: 18, gap: 18 });
    const items = ['CMP для массовых адаптаций', 'AI video для CTV/OLV', 'Персонализированные посадочные страницы для повышения post-click результатов'];
    const ih = items.reduce((a, it) => a + measure(it, rw - 34 - 18, 18), 0) + 6 * (items.length - 1);
    const ph = 18 + 28 + 14 + ih + 20;
    const py = bottom - 34 - ph;
    s.box({ x: rx + 2, y: py, w: rw - 4, h: ph, fill: C.crimson });
    s.text('ИНТЕГРИРУЕТСЯ В PRODUCTION 2027', { x: rx + 19, y: py + 18, w: rw - 38, size: 28, bold: true, lh: 1.0, color: C.white, fit: true, maxLines: 1, minSize: 22 });
    s.bullets(items, { x: rx + 19, y: py + 60, w: rw - 38, size: 18, gap: 6, color: C.white });

    s.principle({ label: 'Принцип 2027', icon: 'target', text: 'Ни одна версия не выходит без пре-теста: каждый сегмент получает вариант, на который реагирует лучше всего' });
  },
};
