// Демо: пересборка эталонных слайдов фигмы (1, 2, 6, 7) средствами библиотеки — для сверки.
const path = require('path');
const { Deck, C, ACCENTS, columns } = require('../lib/akrikhin');

(async () => {
  const d = new Deck({ title: 'Акрихин × OMD — демо дизайн-системы' });

  // 1. Обложка
  d.cover({ title: 'From market trends to Akrikhin+OMD actions in 2027' });

  // 2. Пять трендов: колонки с номером, стат-плитка, «что это меняет», плашка-вывод
  {
    const s = d.slide({ title: 'Market 2027: 5 ключевых трендов,\nкоторые меняют путь потребителя' });
    const data = [
      { t: 'ВИДЕО = ЭКОСИСТЕМА ЭКРАНОВ', d: 'CTV становится самостоятельным слоем на фоне фрагментации просмотра и роста Smart TV.', v: '80%', l: 'проникновение Smart TV к 2029', c: 'Нужна единая роль CTV + OLV, AI-видео продакшн, а не конкуренция видеоформатов.' },
      { t: 'ПОИСК СТАНОВИТСЯ AI-ASSISTED', d: 'Пользователь все чаще получает готовый ответ, а не только список ссылок — особенно в health-information journey.', v: '49,5', u: 'млн', l: 'ежемесячно взаимодействуют с ответами Алисы AI', c: 'Бренду нужно управлять присутствием не только в SERP, но и в AI-ответах / LLM.' },
      { t: 'DIGITAL ДОРОЖАЕТ БЫСТРЕЕ ЭФФЕКТИВНОСТИ', d: 'Инфляция медиа и рост стоимости действия делают fixed split менее устойчивым.', v: '+26%', l: 'рост стоимости целевого действия в Q1’26', c: 'Инвестиции должны следовать за доказанным эффектом, а не за прошлогодним сплитом.' },
      { t: 'ПОКУПКА СТАНОВИТСЯ ГИБРИДНОЙ', d: 'Фарма остается офлайн-категорией, но ePharm быстро растет — online и offline работают в одном пути.', v: '28%', l: 'доля online в фармрознице', c: 'CJM должен доводить пользователя от медиа и поиска до доступной покупки.' },
      { t: 'INFLUENCE ФРАГМЕНТИРУЕТСЯ ПО ПЛАТФОРМАМ', d: 'Блогеры и бренды распределяют активность между несколькими площадками; растет роль качества контента и системного контроля.', v: '64%', l: 'блогеров планируют осваивать новые платформы', c: 'Нужны единый Playbook и AI-scoring, а не ручная логика под каждую платформу.' },
    ];
    columns(5).forEach((col, i) => {
      const it = data[i];
      const color = ACCENTS[i];
      const { cx, cy, cw } = s.numberedCard({ x: col.x, y: 222, w: col.w, h: 684, n: i + 1, color });
      const th = s.text(it.t, { x: cx, y: cy, w: cw, h: 120, size: 36, bold: true, lh: 1.1, color: C.navy, fit: true, minSize: 22 });
      s.text(it.d, { x: cx, y: Math.min(cy + th + 12, 483), w: cw + 3, h: 95, size: 16 });
      s.stat({ x: cx, y: 585, w: 261, value: it.v, unit: it.u, label: it.l, color });
      s.text('Что это меняет', { x: cx, y: 764, w: cw, size: 16, bold: true, color });
      s.text(it.c, { x: cx, y: 793, w: cw + 3, h: 95, size: 16, bold: true, color: C.navy });
    });
    s.principle({ icon: 'bulb', label: 'Общий вывод', text: 'Рынок дробится на множество точек контакта, но путь пользователя должен оставаться единым — от первого контакта до выбора и покупки' });
  }

  // 3. Операционный цикл: 6 колонок, плитки с иконками, строка-цикл со стрелками
  {
    const s = d.slide({ title: 'Операционный цикл Comprehensive 2027:\nUnderstand → Validate → Activate → Personalize → Measure → Learn' });
    const colors = [C.sky, C.teal, C.blue, C.orange, C.crimson, C.navy2];
    const data = [
      ['UNDERSTAND', 'AI CJM', 'tb:TbZoomQuestion', 'Find the right problem'],
      ['VALIDATE', 'OMD Voice', 'tb:TbMessageQuestion', 'Challenge the hypothesis'],
      ['ACTIVATE', 'AI DSPs', 'tb:TbUsers', 'Find the right people'],
      ['PERSONALIZE', 'Creative + Experience', 'tb:TbMessageDots', 'Deliver the right message'],
      ['MEASURE', 'Signals → Business', 'tb:TbRosetteDiscountCheck', 'Prove what changed'],
      ['LEARN\n& RE-APPLY', 'Benchmarks', 'tb:TbHandClick', 'Make the next decision better'],
    ];
    columns(6, { gap: 17 }).forEach((col, i) => {
      const [lab, name, icon, tileText] = data[i];
      const { cx, cw } = s.numberedCard({ x: col.x, y: 225, w: col.w, h: 565, n: i + 1, color: colors[i], d: 70, pad: 27 });
      // строки колонок выровнены по сетке: метка 341, название 425, описание под названием
      s.text(lab, { x: cx, y: 341, w: cw, size: 30, bold: true, lh: 1.1, color: colors[i] });
      const nh = s.text(name, { x: cx, y: 425, w: cw, size: 29, bold: true, lh: 1.1, color: C.navy });
      s.text('Потребности, барьеры, окейжены, сегментные гипотезы', { x: cx, y: 425 + nh + 10, w: cw, size: 16 });
      s.tile({ x: col.x + 26, y: 581, w: 235, h: 182, color: colors[i], icon, text: tileText });
    });
    s.card({ x: 124, y: 823, w: 1669, h: 79 });
    s.text('Результаты кампании → обновленное правило по сегменту / креативу / поставщику → планирование следующего флайта → cross-brand использование',
      { x: 154, y: 823, w: 1609, h: 79, size: 20, bold: true, color: C.blue, align: 'center', valign: 'middle', fit: true, maxLines: 1, minSize: 17 });
    s.arrow({ dir: 'left', x: 58, y: 862, len: 66, head: 79, headLen: 37, stem: 39 });
    s.arrow({ dir: 'right', x: 1796, y: 862, len: 66, head: 79, headLen: 37, stem: 39 });
    s.principle({ x: 245, w: 1431, icon: 'tb:TbRefresh', label: 'Замкнутый цикл обучения', text: 'Одна система, много инструментов: каждый пилот 2027 должен завершаться правилом принятия решения, а не только результатом кампании' });
  }

  // 4. Три колонки с подзаголовком в шапке
  {
    const s = d.slide({
      title: 'OMD Voice: AI CJM Evolves into a Calibrated Synthetic Audience Panel',
      subtitle: 'Same segment logic as AI CJM, much higher precision: every segment is calibrated on open,\nindustry and brand data and can be questioned like a live respondent',
    });
    const cols = columns(3, { gap: 22 });
    // левая — выделенная
    s.card({ x: cols[0].x, y: 221, w: cols[0].w, h: 682, tint: true });
    s.label('Logical next step', { x: 91, y: 255, w: 500, color: C.green });
    s.heading('OMD Voice continues AI CJM,\nwith far higher precision', { x: 91, y: 293, w: 520 });
    s.box({ x: 93, y: 399, w: 516, h: 169, fill: C.white, stroke: C.line });
    s.text('AI CJM · 2026', { x: 110, y: 419, w: 476, size: 28, bold: true, lh: 1.0 });
    s.text('Reads digital signals and consumer language.\nBuilds segments, needs, barriers and occasions.', { x: 110, y: 459, w: 476, size: 18 });
    s.text('**Output:** [[**audience hypothesis**]]', { x: 110, y: 525, w: 476, size: 18 });
    s.arrow({ dir: 'down', x: 267, y: 588, len: 50 });
    s.text('+ calibration on real data', { x: 300, y: 597, w: 250, size: 13, bold: true, lh: 1.0, color: C.crimson });
    s.box({ x: 93, y: 637, w: 516, h: 232, fill: C.crimson });
    s.text('OMD VOICE · 2027', { x: 110, y: 657, w: 476, size: 28, bold: true, lh: 1.0, color: C.white });
    s.text('Each segment becomes a group of modeled respondents with defined soc-dem, motives and barriers. It answers questions and rates messages, offers and creatives.', { x: 110, y: 697, w: 476, size: 18, color: C.white });
    s.text("Output: validated hypothesis, segment size in people, touchpoint map incl. e-com, the doctor's role in the choice", { x: 110, y: 782, w: 476, size: 18, bold: true, color: C.white });

    // средняя — шаги
    s.card({ x: cols[1].x, y: 221, w: cols[1].w, h: 682 });
    s.label('Calibration', { x: 699, y: 255, w: 500, color: C.cyan });
    s.heading('Every segment is anchored\nto real data', { x: 699, y: 293, w: 520 });
    s.steps([
      { title: 'Open research & official statistics', text: 'Rosstat, VCIOM, published studies → segment sizes\nand demographics' },
      { title: 'Mediascope Brand Pulse', text: 'Brand awareness and funnel by category → brand position in each segment' },
      { title: 'Mediascope TV Index & Cross Web', text: 'Media consumption → channel roles and touchpoint map\nfor each segment' },
      { title: 'Consumer language', text: 'Reviews, forums, social media, e-pharmacies → motives, barriers and real wording' },
      { title: 'Campaign results & external\nAI segments', text: 'Post-click, BLS, overlaps with supplier AI clusters → learnings return to the panel' },
    ], { x: 699, y: 389, w: 500, pitch: 95.5, highlightLast: true });

    // правая — галочки + красный блок
    s.card({ x: cols[2].x, y: 221, w: cols[2].w, h: 682 });
    s.label('Quality control', { x: 1307, y: 255, w: 500, color: C.purple });
    s.heading('Built-in protection\nfrom hallucinations', { x: 1307, y: 293, w: 520 });
    s.checks([
      '3 independent builds from scratch, hundreds of runs: only reproducible segments enter the map',
      'Every figure is confirmed by external data\nand research',
      'Placebo traps and repeated runs: a result counts only if the gap between options is stable',
      'SSR method*: up to 90% of human test-retest reliability in 57 real surveys (PyMC Labs, 2025)',
    ], { x: 1307, y: 395, w: 500 });
    s.box({ x: 1309, y: 672, w: 516, h: 197, fill: C.crimson });
    s.text('DIALOGUE MODE', { x: 1326, y: 692, w: 476, size: 28, bold: true, lh: 1.0, color: C.white });
    s.text('Ask any segment in free form, like a focus group or an in-depth interview. Answer in 15 minutes to 2 hours.', { x: 1326, y: 732, w: 476, size: 18, bold: true, color: C.white });
    s.text("Example: how much does a doctor's advice drive choice\nin this segment?", { x: 1326, y: 805, w: 476, size: 18, color: C.white });

    s.formula({ x: 232, w: 1453, text: 'AI CJM segment map → calibration on open, industry and brand data → OMD Voice panel → validated answer before media spend' });
    s.footnote('*SSR — Semantic Similarity Rating: the respondent answers in its own words, the answer is matched by meaning to scale statements and turned into a score distribution', { x: 232, w: 1453, y: 1030, size: 14, align: 'center' });
  }

  // 5. Шпаргалка: палитра, типографика, компоненты
  {
    const s = d.slide({ title: 'Дизайн-система Акрихин × OMD:\nпалитра, шрифты, компоненты' });
    s.card({ x: 58, y: 221, w: 880, h: 682 });
    s.label('Палитра', { x: 91, y: 255, w: 400, color: C.blue });
    const sw = [
      ['blue', C.blue, 'шапка, №1'], ['blueText', C.blueText, 'основной текст'], ['navy', C.navy, 'заголовки'], ['navy2', C.navy2, 'тёмный акцент'],
      ['crimson', C.crimson, 'вывод, акцент'], ['cyan', C.cyan, '№2'], ['green', C.green, '№4'], ['purple', C.purple, '№5'],
      ['orange', C.orange, '№6'], ['teal', C.teal, 'доп. синий'], ['cardTint', C.cardTint, 'фон выделения'], ['line', C.line, 'обводки'],
    ];
    sw.forEach(([name, hex, role], i) => {
      const x = 91 + (i % 4) * 207;
      const y = 300 + Math.floor(i / 4) * 190;
      s.box({ x, y, w: 186, h: 100, fill: hex, stroke: hex === C.cardTint || hex === C.line ? C.line : undefined });
      s.text(`**${name}**  #${hex}`, { x, y: y + 110, w: 200, size: 16, color: C.navy });
      s.text(role, { x, y: y + 132, w: 200, size: 14 });
    });
    s.card({ x: 961, y: 221, w: 901, h: 682 });
    s.label('Шрифт Tahoma · кегли в пикселях', { x: 994, y: 255, w: 800, color: C.crimson });
    let y = 300;
    [['Заголовок шапки 47', 47, true, C.navy], ['Заголовок карточки 34', 34, true, C.navy], ['КАПС-МЕТКА 22', 22, true, C.green],
     ['Пункт списка 23', 23, true, C.blueText], ['Основной текст 18 / 16', 18, false, C.blueText], ['Сноска 14', 14, false, C.blueText]].forEach(([t, sz, b, col]) => {
      y += s.text(t, { x: 994, y, w: 820, size: sz, bold: b, lh: 1.1, color: col }) + 18;
    });
    s.badge({ x: 994, y: 690, d: 84, n: 1, color: C.blue });
    s.badge({ x: 1098, y: 697, d: 70, n: 2, color: C.cyan });
    s.badge({ x: 1188, y: 713, d: 38, n: 3, color: C.tint, textColor: C.blueText });
    s.stat({ x: 1250, y: 660, w: 261, value: '+26%', label: 'стат-плитка: цифра и подпись', color: C.crimson });
    s.checks(['галочка-пункт'], { x: 1540, y: 680, w: 300 });
    s.tile({ x: 1540, y: 740, w: 290, h: 130, color: C.green, icon: 'tb:TbChartLine', text: 'Плитка с иконкой', textH: 30 });
    s.principle({ label: '2027 принцип', text: 'Плашка-вывод закрывает каждый содержательный слайд: иконка, метка капсом, одна мысль в 1–2 строки' });
  }

  // 6. Разделитель раздела (производный элемент)
  d.divider({ kicker: 'Раздел 2', title: 'AI Visibility и поиск 2027' });

  await d.save(path.join(__dirname, '..', 'out', 'demo.pptx'));
})();
