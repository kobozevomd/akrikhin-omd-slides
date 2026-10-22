// Comprehensive draft 2027 — часть F: слайды 33–36 черновика
// 33 — Production Playbook (архетип 5 «было → стало»), 34 — AI-video: 4 этапа (архетип 9/11),
// 35 — DOOH + AI-video (две колонки карточек), 36 — Paid Search (эталон figma_slide_15).
const { C, columns, countLines } = require('../../lib/akrikhin');

// ---------- локальные хелперы ----------

// Белая вложенная карточка на тонированной (радиус 15, обводка line)
const inner = (s, o) => s.box({ x: o.x, y: o.y, w: o.w, h: o.h, fill: C.white, stroke: o.stroke ?? C.line, sw: o.sw ?? 2 });

// Кегль, при котором каждый пункт списка помещается в одну строку (от max до min)
function oneLineSize(items, w, max, min, indent = 18) {
  let sz = max;
  while (sz > min && items.some((t) => countLines(t, sz, w - indent, false) > 1)) sz -= 1;
  return sz;
}

// Заливная полоса «ценности»: КАПС-заголовок + список пунктов белым (слайд 34)
function valueBox(s, { x, y, w, h, color, title, items }) {
  s.box({ x, y, w, h, fill: color });
  s.text(title, { x: x + 30, y: y + 20, w: w - 60, size: 24, bold: true, lh: 1.0, color: C.white });
  const sz = oneLineSize(items, w - 60, 18, 16);
  s.bullets(items, { x: x + 30, y: y + 56, w: w - 60, size: sz, gap: 6, color: C.white });
}

// Заливная полоса «метка │ текст» без иконки (слайд 35): колонка метки фиксированной ширины
// Пункты черновика (через «•» в одну строку) идут столбиком — так ни один не рвется переносом.
function valueBar(s, { x, y, w, h, color, label, items, labelW = 250 }) {
  s.box({ x, y, w, h, fill: color });
  s.text(label, { x: x + 30, y, w: labelW, h, size: 22, bold: true, lh: 1.1, color: C.white, valign: 'middle' });
  s.vline(x + 30 + labelW + 20, y + h / 2 - 24, 48, C.white, 2);
  const tx = x + 30 + labelW + 46;
  const size = 20;
  const gap = 2;
  const need = items.length * size * 1.2 + gap * (items.length - 1);
  s.bullets(items, { x: tx, y: y + (h - need) / 2, w: x + w - 30 - tx, size, gap, color: C.white });
}

// Кружок с белой иконкой внутри
function iconCircle(s, { x, y, d, color, icon }) {
  s.circle({ x, y, d, fill: color });
  const is = Math.round(d * 0.58);
  s.icon(icon, { x: x + (d - is) / 2, y: y + (d - is) / 2, size: is, color: C.white });
}

module.exports = {
  // ---------- 33. 2027 Production Playbook ----------
  33: (d) => {
    const s = d.slide({ title: '2027 Production Playbook: гибридная модель создания баннеров, AI-video — отдельный цикл' });

    // слева — выводы 2026 и ограничение
    s.card({ x: 58, y: 221, w: 560, h: 684, tint: true });
    s.label('2026: ключевые выводы', { x: 91, y: 255, w: 494, color: C.blue });
    s.bullets([
      '793 версии креативов / 6 брендов / 3 AI-video D2C',
      'Classic production остается необходимым для генерации новых креативных идей, KV, сложной анимации и high legal-risk claims',
      'CMP эффективнее для серийных адаптаций: 20+ версий / 3+ сегмента',
      'AI-video требует отдельного workflow, прав и legal\u00A0QA', // неразрывный пробел: без висящего «QA»
    ], { x: 91, y: 302, w: 494, size: 20, gap: 18 });
    s.box({ x: 91, y: 668, w: 494, h: 204, fill: C.crimson });
    s.text('ОГРАНИЧЕНИЕ ДЛЯ БИЗНЕСА:', { x: 117, y: 694, w: 446, size: 28, bold: true, lh: 1.0, color: C.white });
    s.text('без сформированных правил выбора маршрута экономия остается фрагментарной, а доработки сохраняются',
      { x: 117, y: 742, w: 446, h: 106, size: 22, lh: 1.2, color: C.white, fit: true, minSize: 18 });

    // стрелка между карточками
    s.arrow({ dir: 'right', x: 640, y: 563, len: 56, head: 68, headLen: 30, stem: 30 });

    // справа — Playbook 2027 из 4 блоков
    s.card({ x: 718, y: 221, w: 1144, h: 684, tint: true });
    s.label('Playbook 2027', { x: 751, y: 255, w: 1000, color: C.crimson });
    const blocks = [
      { t: 'Выбираем продакшн-маршрут заранее', b: [
        'Выбираем Classic / CMP / гибридная модель на этапе брифа',
        'Матрица выбора: наличие master × объем × визуальная сложность × legal risk'] },
      { t: 'Стандартизируем входные данные', b: [
        'Единый source pack: brand assets, legal pack, media matrix, segment matrix',
        'До запуска в production фиксируем SLA, роли, единицы стоимости и QA checklist'] },
      { t: 'Масштабируем повторяемое производство', b: [
        'Classic = идея / master / claims; CMP = пакетные адаптации / экспорт на платформы',
        'Гибрид становится базовой моделью: master → template → scale'] },
      { t: 'AI-video', b: ['Отдельный production cycle'], hl: true },
    ];
    const bw = 528;
    const bh = 275;
    blocks.forEach((it, i) => {
      const bx = 751 + (i % 2) * (bw + 22);
      const by = 300 + Math.floor(i / 2) * (bh + 22);
      const color = it.hl ? C.crimson : C.blue;
      inner(s, { x: bx, y: by, w: bw, h: bh, stroke: it.hl ? C.crimson : C.line });
      s.badge({ x: bx + 26, y: by + 26, d: 46, n: i + 1, color });
      s.text(it.t, { x: bx + 88, y: by + 26, w: bw - 88 - 26, h: 46, size: 23, bold: true, lh: 1.0,
        color: it.hl ? C.crimson : C.navy, valign: 'middle', fit: true, minSize: 20 });
      s.bullets(it.b, { x: bx + 26, y: by + 96, w: bw - 52, size: 20, gap: 12 });
    });

    s.principle({ w: 1500, icon: 'tb:TbTrendingUp', label: 'Влияние на бизнес',
      text: 'ранний выбор маршрута → прозрачная экономика → короче production cycle → меньше ручных доработок → масштабируемое производство' });
  },

  // ---------- 34. AI-video production 2027 ----------
  34: (d) => {
    const s = d.slide({ title: 'AI-video production 2027:\nот пилотов к cross-brand системе' });
    const stages = [
      { p: '2026 Q2 · Азелик', h: 'Гибридная AI-video персонализация', sec: [
        ['Источник', 'Classic master / продуктовый модуль'],
        ['AI-слой', 'Hero + context + end-state по сегментам'],
        ['Voice / test', 'Human VO · AI vs Classic в OLV / CTV']],
        r: 'Более быстрый и экономичный production vs Classic' },
      { p: '2026 Q2 · Динобутин', h: 'AI-first видео без Classic shoot', sec: [
        ['Источник', 'AI-first; классическая съемка не требуется'],
        ['Процесс', 'Сценарий → storyboard → AI-визуалы / анимация'],
        ['Human QA', 'Финальный монтаж, VO, color + brand / legal']],
        r: 'AI-video для брендов без отдельного video-production бюджета' },
      { p: '2026 Q4 · Комфодерм HCP', h: 'AI/3D обучающий ролик для фармацевтов', sec: [
        ['Задача', '2 визуальные концепции + сценарий + покадровая раскадровка'],
        ['Роль', 'Поддержать переключение лояльного покупателя внутри аптеки'],
        ['Версии/звук', 'Master 1:30 + версия 0:30; VO — профессиональный диктор']],
        r: 'AI-video расширяется от D2C к HCP education' },
      { p: '2027 · Масштабирование', h: 'Cross-brand AI-video engine', sec: [
        ['Масштаб применения', 'D2C/HCP × CTV/OLV inventory'],
        ['Модульность', 'Адаптации: сегмент × инсайт/оккейжн × барьер'],
        ['Масштабирование', 'AI voice — после подтверждения quality и legal standards']],
        r: 'Масштабируемый метод — не разовая инновация', hl: true },
    ];
    const cols = columns(4, { gap: 46 });
    const top = 221;
    const ch = 512;
    cols.forEach((col, i) => {
      const it = stages[i];
      const color = it.hl ? C.crimson : C.blue;
      const cx = col.x + 26;
      const cw = col.w - 52;
      s.card({ x: col.x, y: top, w: col.w, h: ch, tint: it.hl });
      s.pill(it.p, { x: cx, y: top + 24, w: cw, h: 50, color, size: 20 });
      s.text(it.h, { x: cx, y: top + 96, w: cw, h: 62, size: 26, bold: true, lh: 1.1, color: C.navy, fit: true, minSize: 22 });
      it.sec.forEach(([lab, txt], j) => {
        const y = top + 174 + j * 88;
        s.text(lab.toUpperCase(), { x: cx, y, w: cw, size: 18, bold: true, lh: 1.0, color });
        s.text(txt, { x: cx, y: y + 25, w: cw, h: 44, size: 18, lh: 1.2, fit: true, minSize: 16 });
      });
      s.hline(cx, top + 432, cw);
      s.text(it.r, { x: cx, y: top + 444, w: cw, h: 44, size: 17, bold: true, lh: 1.2, color: C.navy, fit: true, minSize: 16 });
      if (i < 3) s.chevron({ cx: col.x + col.w + 23, cy: top + ch / 2 });
    });

    valueBox(s, { x: 58, y: 751, w: 891, h: 154, color: C.blue, title: 'МЕДИЙНАЯ ЦЕННОСТЬ', items: [
      'Больше вариантов креатива + быстрее обновление в рамках одной кампании',
      'Тестируем сегмент × сообщение при одинаковых настройках; сравниваем VTR / CTR / post-click',
      'Ниже порог входа для OLV/CTV; потенциальная экономия до 70% vs Classic',
    ] });
    valueBox(s, { x: 971, y: 751, w: 891, h: 154, color: C.navy, title: 'ЦЕННОСТЬ ДЛЯ БРЕНДА', items: [
      'Более высокая релевантность → рост Ad Recall / Consideration / Image атрибутов',
      'BLS разделяет эффект по креативу, сегменту, типу инвентаря',
      'Test → validate → scale только с сохранением brand / legal consistency',
    ] });

    s.principle({ w: 1400, label: 'Принцип 2027',
      text: 'AI-video становится стандартом production-маршрута для D2C/HCP × CTV/OLV' });
  },

  // ---------- 35. DOOH + AI-video 2027 ----------
  35: (d) => {
    // заголовок не влезает в 1 строку → библиотека сама берет шапку «2 строки + подзаголовок»
    const s = d.slide({
      title: 'DOOH + AI-video 2027: физический контекст как новая точка контакта в едином CJM',
      subtitle: 'DOOH расширяет путь пользователя за пределы Digital: переносит сегментную коммуникацию в релевантные жизненные контексты и позволяет проверить, усиливает ли физическая среда интерес, поиск и действие',
    });

    const top = 221;

    // ── слева: планируем как omnichannel ──
    s.card({ x: 58, y: top, w: 952, h: 424, tint: true });
    s.label('Планируем как omnichannel', { x: 91, y: top + 28, w: 560, color: C.green });
    // в черновике этот текст спрятан под карточкой — не показываем
    // s.text('PERSONALIZED PRODUCTION', { x: 600, y: top + 28, w: 377, size: 22, bold: true, lh: 1.0, color: C.blue, align: 'right' });
    const plan = [
      ['ДОПОЛНЯЕМ\nDIGITAL TOUCHPOINTS', 'DOOH усиливает экранную экосистему и добавляет новый контакт за пределами OLV / CTV'],
      ['ПЕРЕНОСИМ\nПЕРСОНАЛИЗАЦИЮ\nВ КОНТЕКСТ', 'AI-video адаптирует сообщение под сегмент, барьер, оккейжен и место контакта'],
      ['ПРОВЕРЯЕМ ВКЛАД\nВ ЕДИНЫЙ ПУТЬ', 'Тестируем, усиливает ли новый контакт поисковый интерес, визиты и целевые действия'],
    ];
    columns(3, { x0: 91, x1: 977, gap: 20 }).forEach((c, i) => {
      const y = top + 74;
      inner(s, { x: c.x, y, w: c.w, h: 324 });
      s.badge({ x: c.x + 20, y: y + 20, d: 46, n: '0' + (i + 1), color: C.crimson, size: 19 });
      s.text(plan[i][0], { x: c.x + 20, y: y + 82, w: c.w - 40, h: 66, size: 20, bold: true, lh: 1.1, color: C.navy, fit: true, minSize: 17 });
      s.text(plan[i][1], { x: c.x + 20, y: y + 162, w: c.w - 40, h: 140, size: 20, lh: 1.2, fit: true, minSize: 17 });
    });

    valueBar(s, { x: 58, y: 663, w: 952, h: 112, color: C.blue, label: 'МЕДИЙНАЯ ЦЕННОСТЬ',
      items: ['охват за пределами digital', 'новые контексты'] });
    valueBar(s, { x: 58, y: 793, w: 952, h: 112, color: C.navy, label: 'ЦЕННОСТЬ ДЛЯ БРЕНДА',
      items: ['более уместный контакт', 'связка awareness → action', 'база для cross-brand scale'] });

    // ── справа сверху: как активируем ──
    const rx = 1033;
    const rw = 829;
    s.card({ x: rx, y: top, w: rw, h: 336, tint: true });
    s.label('Как активируем', { x: rx + 33, y: top + 28, w: 700, color: C.blue });
    const act = [
      ['SEGMENT / OCCASION', 'кого и с какой задачей ищем', 'tb:TbUsers'],
      ['CONTEXT / POI', 'где этот контакт наиболее релевантен', 'tb:TbMapPin'],
      ['AI-VIDEO VERSION', 'какую адаптацию сообщения показываем', 'tb:TbVideo'],
      ['DOOH INVENTORY', 'на каком типе экранов размещаемся', 'tb:TbDeviceTv'],
    ];
    columns(4, { x0: rx + 33, x1: rx + rw - 33, gap: 28 }).forEach((c, i) => {
      const by = top + 87;
      inner(s, { x: c.x, y: by, w: c.w, h: 152 });
      iconCircle(s, { x: c.x + 14, y: by - 22, d: 44, color: C.cyan, icon: act[i][2] });
      s.text(act[i][0], { x: c.x + 14, y: by + 32, w: c.w - 24, h: 38, size: 17, bold: true, lh: 1.1, color: C.navy, fit: true, minSize: 15 });
      s.text(act[i][1], { x: c.x + 14, y: by + 80, w: c.w - 24, h: 62, size: 16, lh: 1.2, fit: true, minSize: 14 });
      if (i < 3) s.chevron({ cx: c.x + c.w + 14, cy: by + 76, w: 14, h: 22 });
    });
    s.box({ x: rx + 33, y: top + 259, w: rw - 66, h: 48, fill: C.tint });
    s.text('КОНТЕКСТЫ 2027: аптеки и мед. точки • ПВЗ • food / non-food retail',
      { x: rx + 53, y: top + 259, w: rw - 106, h: 48, size: 17, bold: true, lh: 1.1, color: C.navy, align: 'center', valign: 'middle', fit: true, maxLines: 1, minSize: 15 });

    // ── справа снизу: как поймем, что механика работает ──
    const by2 = 575;
    s.card({ x: rx, y: by2, w: rw, h: 330, tint: true });
    s.label('Как поймем, что механика работает', { x: rx + 33, y: by2 + 30, w: 760, color: C.purple });
    const kpi = [
      ['SEARCH LIFT', 'рост поискового интереса\nпо brand / category / symptom'],
      ['VISIT LIFT', 'дополнительные визиты /\nпереходы после контакта'],
      ['POST-VIEW ACTION', 'целевые действия:\nsite / e-com / partner'],
    ];
    columns(3, { x0: rx + 33, x1: rx + rw - 33, gap: 20 }).forEach((c, i) => {
      const y = by2 + 78;
      inner(s, { x: c.x, y, w: c.w, h: 140 });
      s.text(kpi[i][0], { x: c.x + 18, y: y + 20, w: c.w - 36, size: 19, bold: true, lh: 1.0, color: C.navy });
      s.text(kpi[i][1], { x: c.x + 18, y: y + 52, w: c.w - 36, h: 62, size: 16, lh: 1.2, fit: true, minSize: 14 });
    });
    s.text('[[**Decision gate:**]] **до запуска задаем прогнозный коридор → после теста сравниваем фактический lift → scale / optimize / stop**',
      { x: rx + 33, y: by2 + 246, w: rw - 66, h: 50, size: 17, lh: 1.2, color: C.navy, fit: true, minSize: 16 });

    s.principle({ x: 58, w: 1804, label: 'Принцип 2027',
      text: 'DOOH — не отдельный эксперимент, а расширение Personalized Production: AI-video переносит сегментную коммуникацию в физический контекст и добавляет новый измеримый контакт в единый CJM. Бренд для теста — Азелик.' });
  },

  // ---------- 36. Paid Search 2027 (эталон figma_slide_15) ----------
  36: (d) => {
    const s = d.slide({ title: 'Paid Search 2027: поисковое намерение становится ключом к персонализации сообщения и посадочной страницы' });

    // ── логика 2027 ──
    s.card({ x: 58, y: 221, w: 1192, h: 274, tint: true });
    s.label('Логика 2027', { x: 91, y: 255, w: 600, color: C.green });
    s.text('Персонализируем search journey на уровне намерения пользователя',
      { x: 91, y: 290, w: 1126, size: 34, bold: true, lh: 1.1, color: C.navy, fit: true, maxLines: 1, minSize: 28 });
    const steps = [
      ['Намерение', 'Что именно ищет пользователь'],
      ['Сообщение', 'Какой ответ даем в\u00A0объявлении'],
      ['Посадочная', 'Куда ведем и что показываем'],
      ['KPI', 'Какое действие считаем успехом'],
    ];
    columns(4, { x0: 91, x1: 1217, gap: 23 }).forEach((c, i) => {
      const y = 364;
      inner(s, { x: c.x, y, w: c.w, h: 106, sw: 1.5 });
      s.badge({ x: c.x + 15, y: y - 19, d: 38, n: i + 1, color: C.crimson });
      s.text(steps[i][0], { x: c.x + 16, y: y + 24, w: c.w - 28, size: 23, bold: true, lh: 1.0, color: C.blue });
      s.text(steps[i][1], { x: c.x + 16, y: y + 54, w: c.w - 28, h: 40, size: 16, lh: 1.2, fit: true, minSize: 14 });
      if (i < 3) s.chevron({ cx: c.x + c.w + 11.5, cy: y + 53 });
    });

    // ── 5 персонализированных маршрутов ──
    s.card({ x: 58, y: 512, w: 1192, h: 393, tint: true });
    s.label('5 персонализированных маршрутов', { x: 91, y: 545, w: 1000, color: C.blue });
    const routes = [
      ['ШИРОКАЯ ПРОБЛЕМАТИКА', C.crimson, 'tb:TbZoomQuestion', 'Экспертный ответ на проблему', 'Статья / контентный LP', 'Вовлечение → ретаргетинг'],
      ['КАТЕГОРИЯ / СИМПТОМ', C.blue, 'tb:TbListDetails', 'Понимание проблемы + решение', 'Продуктовая страница', 'CR в целевое действие'],
      ['БРЕНД', C.sky, 'tb:TbRosette', 'Официальность, доверие, удобство', 'Продуктовая страница', '«Где купить»'],
      ['КОНКУРЕНТЫ', C.orange, 'tb:TbUsersGroup', 'RTB и критерии выбора', 'Страница преимуществ', 'CR / CPA'],
      ['ПОКУПКА', C.green, 'tb:TbShoppingCartCheck', 'Наличие, цена, простой путь', 'Аптека / партнер', 'Оформление заказа'],
    ];
    const colX = [395, 672, 948];
    routes.forEach((r, i) => {
      const y = 582 + i * 52;
      s.box({ x: 91, y, w: 281, h: 42, fill: r[1], r: 10 });
      s.icon(r[2], { x: 100, y: y + 6, size: 30, color: C.white });
      s.text(r[0], { x: 140, y, w: 224, h: 42, size: 16, bold: true, lh: 1.0, color: C.white, valign: 'middle', fit: true, maxLines: 1, minSize: 14 });
      colX.forEach((vx, j) => {
        s.vline(vx, y + 2, 38);
        s.text(r[3 + j], { x: vx + 15, y, w: (j < 2 ? colX[j + 1] : 1217) - vx - 25, h: 42, size: 16, lh: 1.15, valign: 'middle', fit: true, minSize: 14 });
      });
      if (i < routes.length - 1) s.hline(395, y + 47, 1217 - 395);
    });
    s.icon('tb:TbScript', { x: 95, y: 851, size: 34, color: C.crimson });
    s.text('Отдельное правило для широкой проблематики: сначала экспертный контент и качество чтения, затем ретаргетинг на продуктовую страницу',
      { x: 140, y: 848, w: 900, h: 40, size: 16, bold: true, lh: 1.2, color: C.crimson, fit: true, minSize: 14 });

    // ── что меняется ──
    const rx = 1273;
    const rw = 589;
    const cx = rx + 33;
    const cw = rw - 66;
    s.card({ x: rx, y: 221, w: rw, h: 684, tint: true });
    s.label('Что меняется', { x: cx, y: 255, w: cw, color: C.purple });
    s.text('Paid Search становится частью персонализированного production-контура',
      { x: cx, y: 290, w: cw, h: 114, size: 34, bold: true, lh: 1.1, color: C.navy, fit: true, minSize: 28 });
    s.text('Модульно производим:', { x: cx, y: 424, w: cw, size: 23, bold: true, lh: 1.0, color: C.crimson });
    s.checks([
      'разные заголовки и тексты по кластерам',
      'расширения и CTA под этап CJM',
      'релевантные LP / статьи / аптечные маршруты',
    ], { x: cx, y: 462, w: cw, pitch: 42, size: 18 });
    s.text('Измеряем по роли кампании:', { x: cx, y: 600, w: cw, size: 23, bold: true, lh: 1.0, color: C.crimson });
    const roles = [
      ['Поиск', 'CR / CPA / целевое действие'],
      ['Проблематика', 'вовлечение + ретаргетинг'],
      ['РСЯ', 'качество визита / post-click / CPQV'],
    ];
    const mw = (cw - 14) / 2;
    roles.forEach((r, i) => {
      const x = cx + (i % 2) * (mw + 14);
      const y = 636 + Math.floor(i / 2) * 104;
      inner(s, { x, y, w: mw, h: 92, sw: 1.5 });
      s.text(r[0], { x: x + 16, y: y + 13, w: mw - 28, size: 23, bold: true, lh: 1.0, color: C.blue });
      s.text(r[1], { x: x + 16, y: y + 44, w: mw - 28, h: 40, size: 16, lh: 1.2, fit: true, minSize: 14 });
    });
    s.text('Персонализация = не больше объявлений, а точнее связка intent → message → LP → KPI',
      { x: cx, y: 852, w: cw, h: 40, size: 16, bold: true, lh: 1.2, color: C.crimson, fit: true, minSize: 14 });

    s.principle({ label: 'Принцип 2027',
      text: 'Единая подтвержденная база сообщений → модульные поисковые объявления и LPs → разные KPI по намерению пользователя' });
  },
};
