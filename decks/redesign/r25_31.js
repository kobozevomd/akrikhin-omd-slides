// Новые варианты слайдов 25, 30, 31 деки Comprehensive 2027 (по брифу work/comprehensive/REDESIGN_BRIEF.md).
// Тексты — дословно из decks/comprehensive/part_d.js (25) и part_e.js (30, 31).
const path = require('path');
const { C, ACCENTS, columns, IN, PT, chartMap, countLines, textWidth } = require('../../lib/akrikhin');
const V = require('../variants/common');   // TOP, BOT, MUTED, GRID, fmt, pct, statTile, numMark, legend ...

const strip = (t) => String(t).replace(/\*\*|\[\[|\]\]/g, '');
// Высота текста так же, как её оценивает s.text
const hText = (t, w, size, bold = false, lh = 1.2) => Math.round(countLines(strip(t), size, w, bold) * size * lh);

// ===================== 25 · Активация сегментов =====================
function slide25(d) {
  const s = d.slide({
    title: 'Активация сегментов: от AI DMP к прямым интеграциям с платформами (DSPs)',
    subtitle: 'OMD Voice передает каждой DSP полную техническую карту сегмента; DSP собирает аудиторию на собственных данных и AI, а размер сегмента возвращается в планирование',
  });
  const T = 221;
  const CB = 730;           // низ карточек «было / стало»
  const SY = 750;           // полоса «Два контура / People vs IDs»

  // ---- слева: 2026, приглушённо ----
  const L = { x: 58, w: 556 };
  const lx = L.x + 32;
  const lw = L.w - 64;
  s.card({ x: L.x, y: T, w: L.w, h: CB - T });
  s.label('2026 · Единое DMP-решение', { x: lx, y: T + 30, w: lw, color: C.blueText });
  s.text('Один DMP-сегмент\nдля всех платформ', { x: lx, y: T + 62, w: lw, size: 26, bold: true, lh: 1.1, color: C.blueText });
  const route = [['AI CJM', 'текстовое описание сегмента'], ['DMP', 'сегмент собирается из одного пула данных'], ['Все платформы', 'один и тот же сегмент одновременно']];
  const nh = 54;
  const ng = 20;
  let ry = T + 138;
  route.forEach(([t, txt], i) => {
    s.box({ x: lx, y: ry, w: lw, h: nh, fill: C.white, stroke: C.line, sw: 1.5 });
    s.text(t, { x: lx + 18, y: ry + 6, w: lw - 36, size: 20, bold: true, lh: 1.0, color: C.blueText });
    s.text(txt, { x: lx + 18, y: ry + 30, w: lw - 36, size: 16, color: C.blueText });
    if (i < route.length - 1) s.chevron({ cx: lx + 40, cy: ry + nh + ng / 2, dir: 'down', color: V.MUTED, w: 22, h: 10 });
    ry += nh + ng;
  });
  const gy = ry + 6;
  s.label('Ограничения', { x: lx, y: gy, w: lw, size: 20, color: C.blueText });
  s.checks([
    'Сегменты слишком узкие: один DMP-сегмент одновременно используется на всех платформах',
    'Частота слишком высокая: одни и те же пользователи получают повторные контакты',
  ], { x: lx, y: gy + 32, w: lw, size: 16, mark: 'x', color: V.MUTED, pitch: 'auto', gap: 12 });

  // ---- стрелка «было → стало» ----
  s.arrow({ dir: 'right', x: L.x + L.w + 10, y: Math.round((T + CB) / 2), len: 44, head: 56, headLen: 26, stem: 20 });

  // ---- справа: 2027, ярко ----
  const R = { x: 680, w: 1182 };
  const rx = R.x + 32;
  const rw = R.w - 64;
  s.card({ x: R.x, y: T, w: R.w, h: CB - T });
  s.label('2027 · Прямые интеграции с DSP', { x: rx, y: T + 30, w: rw, color: C.crimson });
  s.text('Платформа собирает аудиторию на основе технической карты OMD Voice', { x: rx, y: T + 62, w: rw, size: 28, bold: true, lh: 1.1, color: C.navy, fit: true, maxLines: 1, minSize: 24 });

  // цикл из трёх узлов: вертикально, с возвратом слева
  const steps = [
    ['tb:TbFileDescription', 'Техническая карта сегмента', 'OMD Voice: Семантика, параметры, правила и готовые признаки сегмента в формате, который платформа может автоматически обработать'],
    ['tb:TbUsersGroup', 'Сборка на стороне платформы', 'MTS Ads и Platforma собирают аудиторию в собственной таксономии с помощью своего AI'],
    ['tb:TbChartDonut', 'Размер возвращается в планирование', 'Размер и состав сегмента возвращаются в медиаплан: охват и\nкросс-платформенные пересечения'],
  ];
  const cyc = { x: rx + 44, y: T + 126, pitch: 120, d: 56 };
  const tx = cyc.x + cyc.d + 22;
  const G = { x: 1426, y: T + 118, w: 404, h: CB - 20 - (T + 118) };
  const tw = G.x - 28 - tx;
  steps.forEach(([icon, t, txt], i) => {
    const y = cyc.y + i * cyc.pitch;
    s.icon(icon, { x: cyc.x, y, size: cyc.d, color: C.white, circle: C.blue });
    s.text(t, { x: tx, y: y + 2, w: tw, size: 22, bold: true, lh: 1.0, color: C.navy });
    s.text(txt, { x: tx, y: y + 32, w: tw, size: 16, color: C.blueText });
    if (i < steps.length - 1) s.arrow({ dir: 'down', x: cyc.x + cyc.d / 2, y: y + cyc.d + 8, len: cyc.pitch - cyc.d - 16, head: 20, headLen: 11, stem: 4, color: C.blue });
  });
  // возврат: от третьего узла к первому
  const lxL = rx + 10;
  const y1 = cyc.y + cyc.d / 2;
  const y3 = cyc.y + 2 * cyc.pitch + cyc.d / 2;
  s.seg(cyc.x - 4, y3, lxL, y3, { color: C.blue, width: 3 });
  s.seg(lxL, y3, lxL, y1, { color: C.blue, width: 3 });
  s.arrow({ dir: 'right', x: lxL, y: y1, len: cyc.x - lxL - 2, head: 18, headLen: 11, stem: 3, color: C.blue });
  s.icon('tb:TbRefresh', { x: lxL - 15, y: Math.round((y1 + y3) / 2) - 15, size: 30, color: C.white, circle: C.blue });

  // «Что получаем»: большая цифра
  s.box({ x: G.x, y: G.y, w: G.w, h: G.h, fill: C.cardTint });
  const gx = G.x + 28;
  const gw = G.w - 56;
  s.label('Что получаем', { x: gx, y: G.y + 24, w: gw, size: 20, color: C.crimson });
  s.text('Экономия', { x: gx, y: G.y + 58, w: gw, size: 24, bold: true, lh: 1.0, color: C.navy });
  s.text('30%+', { x: gx, y: G.y + 84, w: gw, size: 80, bold: true, lh: 1.05, color: C.crimson });
  const dh = s.text('Data cost VS годовая подписка OMD VOICE', { x: gx, y: G.y + 172, w: gw, size: 18, bold: true, color: C.navy });
  const cy0 = G.y + 172 + dh + 18;
  s.hline(gx, cy0 - 10, gw);
  s.checks([
    'Более широкий список платформ, не ограниченный DMP-партнерами',
    'Частота и охват управляются на уровне каждой платформы',
  ], { x: gx, y: cy0 + 4, w: gw, size: 16, pitch: 'auto', gap: 10, color: C.blue });

  // ---- полоса: два контура + People vs IDs ----
  s.card({ x: 58, y: SY, w: 1804, h: 905 - SY });
  const py = SY + 24;
  const A = { x: 90, w: 320 };
  s.label('Два контура', { x: A.x, y: py, w: A.w, size: 20, color: C.blue });
  s.text('Методология переносится по задаче и не привязана к одному DMP-решению', { x: A.x, y: py + 30, w: A.w, size: 18, bold: true, lh: 1.15, color: C.navy });
  s.vline(A.x + A.w + 20, py, 905 - SY - 48);
  const contours = [
    ['Прямые интеграции', 'OMD Voice ↔ DSP и платформы: правила сегментации передаются наружу, объемы сегментов возвращаются'],
    ['Внешние AI-сегменты', 'Поставщики формируют собственные\nAI-кластеры; пересечения с нашими сегментами возвращают learnings в OMD Voice'],
  ];
  const cw = 384;
  contours.forEach(([t, txt], i) => {
    const x = A.x + A.w + 42 + i * (cw + 12);
    s.badge({ x, y: py, d: 34, n: i + 1, color: C.blue, size: 18 });
    s.text(t, { x: x + 46, y: py + 5, w: cw - 46, size: 20, bold: true, lh: 1.0, color: C.navy });
    s.text(txt, { x, y: py + 44, w: cw, size: 16, color: C.blueText });
  });
  const P = { x: 1252, y: py - 4, w: 1838 - 1252, h: 905 - SY - 40 };
  s.box({ x: P.x, y: P.y, w: P.w, h: P.h, fill: C.navy });
  s.text('PEOPLE VS IDs', { x: P.x + 24, y: P.y + 16, w: P.w - 48, size: 22, bold: true, lh: 1.0, color: C.white });
  s.text('OMD Voice оценивает аудиторию в людях; платформа формирует более крупный технический сегмент в IDs. Это ожидаемо: capacity платформы и пересечения учитываются в медиаплане',
    { x: P.x + 24, y: P.y + 46, w: P.w - 48, size: 16, color: C.white });

  s.principle({ label: 'Принцип 2027', icon: 'target', text: 'Нет единого DMP-решения по умолчанию: технологический контур выбирается под каждую задачу с учетом media, data и аудитории' });
  s.notes('Слайд 25 · новый вариант: было → стало (2026 приглушённо, 2027 — цикл из трёх узлов с возвратом), «Экономия 30%+» большой цифрой, «Два контура» и People vs IDs — полосой внизу');
}

// ===================== 30 · Paid Search Playbook =====================
function slide30(d) {
  const s = d.slide({
    title: 'Paid Search Playbook 2027: от закупки трафика к управлению спросом и инвестициями',
    subtitle: 'Внутри AI Visibility Paid Search защищает сформированный спрос, расширяет вход в категорию и переводит пользователей с высокой готовностью к действию в покупку',
  });
  const T = 221;
  s.label('3 стратегические роли', { x: 58, y: T, w: 800, color: C.blue });
  const RC = [C.blue, C.teal, C.navy];
  const roles = [
    ['tb:TbShieldCheck', 'Protect', 'Защитить сформированный спрос',
      'Брендовый спрос удерживаем там, где есть риск потери первого контакта конкуренту',
      'Не терять уже сформированный спрос',
      'МЕНЬШЕ\nПОТЕРЬ', 'Не платим там, где органика уже надежно закрывает первый контакт'],
    ['tb:TbTrendingUp', 'Grow', 'Расширить вход в категорию',
      'Категория + симптоматика становятся основной зоной привлечения новой аудитории до выбора бренда',
      'Увеличивать пул потенциальных покупателей',
      'ВЫШЕ\nРОСТ', 'Новая аудитория из категории и симптоматики'],
    ['tb:TbShoppingCart', 'Convert', 'Монетизировать high intent',
      'Брендовые и транзакционные запросы получают кратчайший путь к покупке — бренд / аптека',
      'Переводить намерение в измеримое действие / покупку',
      'БОЛЬШЕ\nКОНВЕРСИЙ', 'Быстрее переводим сформированный спрос в покупку'],
  ];
  const CY = T + 36;
  const CBt = 600;
  columns(3, { gap: 22 }).forEach((c, i) => {
    const [icon, name, head, desc, goal, impT, impX] = roles[i];
    const col = RC[i];
    const x = c.x + 30;
    const w = c.w - 60;
    s.card({ x: c.x, y: CY, w: c.w, h: CBt - CY });
    s.icon(icon, { x, y: CY + 24, size: 64, color: C.white, circle: col });
    s.text(name.toUpperCase(), { x: x + 84, y: CY + 24, w: w - 84, size: 30, bold: true, lh: 1.0, color: col });
    s.text(head.toUpperCase(), { x: x + 84, y: CY + 62, w: w - 84, size: 20, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 17 });
    s.text(desc, { x, y: CY + 106, w, size: 18, color: C.blueText });
    s.text(goal, { x, y: CY + 158, w, size: 18, bold: true, color: col });
    s.text('Влияние на бизнес', { x, y: CY + 224, w, size: 16, bold: true, lh: 1.0, color: col });
    const iy = CY + 248;
    const ih = CBt - 16 - iy;
    s.box({ x, y: iy, w, h: ih, fill: col });
    s.text(impT, { x: x + 20, y: iy, w: 180, h: ih, size: 22, bold: true, lh: 1.1, color: C.white, valign: 'middle' });
    s.vline(x + 206, iy + 16, ih - 32, C.white, 2);
    s.text(impX, { x: x + 224, y: iy + 4, w: w - 244, h: ih - 8, size: 16, color: C.white, valign: 'middle' });
  });

  // ---- ежемесячный decision cycle ----
  const DY = 620;
  const DB = 905;
  const A = { x: 58, w: 1232 };
  s.card({ x: A.x, y: DY, w: A.w, h: DB - DY });
  s.text('**Ежемесячный decision cycle:** результаты → новое правило инвестирования → следующий месяц',
    { x: A.x + 32, y: DY + 22, w: A.w - 64, size: 20, color: C.navy });
  const sig = [
    ['Ёмкость спроса', 'сколько доступного спроса есть в кластере'],
    ['Конкурентное давление', 'риск потери первого контакта / стоимость аукциона'],
    ['Экономика конверсии', 'CR / CPA и качество визита'],
    ['Покрытие SEO и GEO/AEO', 'насколько органика и нейро-ответы уже закрывают спрос'],
  ];
  const sx = A.x + 32;
  const sw = 850;
  const sh = 42;
  const sg = 8;
  const sy0 = DY + 66;
  sig.forEach(([t, txt], i) => {
    const y = sy0 + i * (sh + sg);
    s.box({ x: sx, y, w: sw, h: sh, fill: C.white, stroke: C.line, sw: 1.5, r: 22 });
    s.circle({ x: sx + 18, y: y + sh / 2 - 6, d: 12, fill: C.blue });
    s.text(t, { x: sx + 44, y, w: 280, h: sh, size: 19, bold: true, lh: 1.0, color: C.navy, valign: 'middle' });
    s.text(txt, { x: sx + 330, y, w: sw - 346, h: sh, size: 16, color: C.blueText, valign: 'middle' });
    s.seg(sx + sw, y + sh / 2, sx + sw + 30, y + sh / 2, { color: C.blue, width: 2.5 });
  });
  const jx = sx + sw + 30;
  const yA = sy0 + sh / 2;
  const yZ = sy0 + 3 * (sh + sg) + sh / 2;
  s.seg(jx, yA, jx, yZ, { color: C.blue, width: 2.5 });
  const RB = { x: jx + 48, y: sy0, w: A.x + A.w - 32 - (jx + 48), h: 4 * sh + 3 * sg };
  s.arrow({ dir: 'right', x: jx, y: (yA + yZ) / 2, len: 44, head: 34, headLen: 18, stem: 6, color: C.blue });
  s.box({ x: RB.x, y: RB.y, w: RB.w, h: RB.h, fill: C.crimson });
  s.text('РЕШЕНИЕ', { x: RB.x + 24, y: RB.y + 22, w: RB.w - 48, size: 24, bold: true, lh: 1.0, color: C.white });
  s.bullets(['инвестировать', 'поддержать', 'снизить / перераспределить'],
    { x: RB.x + 24, y: RB.y + 62, w: RB.w - 40, size: 18, gap: 6, bold: true, color: C.white });

  // ---- справа: бюджет и сроки ----
  const B = { x: A.x + A.w + 22, w: 1862 - (A.x + A.w + 22) };
  const bx = B.x + 30;
  const bw = B.w - 60;
  s.card({ x: B.x, y: DY, w: B.w, h: DB - DY, tint: true });
  s.text('Фиксированный бюджет/мес'.toUpperCase(), { x: bx, y: DY + 24, w: bw, size: 18, bold: true, lh: 1.0, color: C.blueText });
  s.arrow({ dir: 'down', x: bx + 14, y: DY + 50, len: 30, head: 26, headLen: 13, stem: 6, color: C.blue });
  s.text('Динамическое распределение инвестиций'.toUpperCase(), { x: bx, y: DY + 88, w: bw, size: 24, bold: true, lh: 1.1, color: C.navy });
  const ly = DY + 166;
  s.hline(bx, ly, bw);
  const tl = [['Q4 2026', 'Синхронизация SEO+GEO/AEO+Paid search', C.blue], ['2027', 'Полная трансформация', C.crimson]];
  tl.forEach(([when, what, col], i) => {
    const y = ly + 22 + i * 52;
    s.circle({ x: bx, y: y + 4, d: 16, fill: col });
    if (i === 0) s.seg(bx + 8, y + 20, bx + 8, y + 56, { color: C.line, width: 2 });
    s.text(when, { x: bx + 30, y, w: 100, size: 20, bold: true, lh: 1.0, color: col });
    s.text(what, { x: bx + 128, y: y + 1, w: bw - 128, size: 18, bold: i === 1, lh: 1.0, color: C.navy });
  });

  s.principle({ icon: 'target', label: 'Принцип 2027', w: 1560,
    text: 'Paid Search = управляемый инвестиционный слой AI Visibility: деньги следуют за возможностью роста, риском потери спроса и доказанной экономикой внутри AI Visibility Stream' });
  s.notes('Слайд 30 · новый вариант: три роли — три колонки с иконками и влиянием на бизнес внизу каждой; decision cycle — 4 сигнала сходятся в «Решение»; справа — переход бюджета и сроки');
}

// ===================== 31 · Comprehensive ORM =====================
function slide31(d) {
  const s = d.slide({
    title: 'Comprehensive ORM 2027',
    subtitle: 'От точечных активаций к масштабируемой системе управления поисковым спросом и репутацией Tier-2 брендов',
  });
  const T = 221;
  // ---- доказательство: три большие цифры ----
  s.label('H1 2026 Bobotic test results', { x: 58, y: T, w: 900, color: C.blue });
  s.text('BASELINE: средненедельный уровень янв.–фев. = 100', { x: 958, y: T + 2, w: 904, size: 18, bold: true, lh: 1.0, color: C.crimson, align: 'right' });
  s.text('Occasion-based ORM можно связать с измеримой динамикой поискового интереса', { x: 58, y: T + 32, w: 1804, size: 28, bold: true, lh: 1.1, color: C.navy });
  const nums = [
    { t: '«Перепробовали всё»', num: '+23%',
      desc: 'Средненедельный прирост июнь vs янв.–фев. по сравнительным запросам: «Боботик или Эспумизан», «Саб Симплекс или Боботик», «что лучше» и др.' },
    { t: '«ГВ / ИВ / смесь»', num: '+272%',
      desc: 'Средненедельный прирост июнь vs янв.–фев. за счёт расширения семантики: «Боботик как применять на ГВ», «Можно ли Боботик добавлять в смесь» и др.' },
    { t: 'Высокая синхронность динамики ORM-активности и поискового интереса', num: 'r = 0,96', cap: 'Коэффициент\nПирсона',
      desc: '**ORM-реагирования: 7 → 8 → 6 → 7\n«Боботик от коликов отзывы»: 90 → 108 → 66 → 97**' },
  ];
  const NY = T + 82;     // заголовки цифр
  const NS = 66;
  columns(3, { gap: 48 }).forEach((c, i) => {
    const it = nums[i];
    if (i > 0) s.vline(c.x - 24, NY, 196);
    s.text(it.t, { x: c.x, y: NY, w: c.w, h: 42, size: 20, bold: true, lh: 1.05, color: C.navy, valign: 'bottom' });
    s.text(it.num, { x: c.x, y: NY + 46, w: c.w, size: NS, bold: true, lh: 1.1, color: C.crimson });
    if (it.cap) {
      const nw = Math.ceil(textWidth(it.num, NS, true));
      s.text(it.cap, { x: c.x + nw + 18, y: NY + 62, w: 160, size: 16, lh: 1.15, color: C.blueText });
    }
    s.text(it.desc, { x: c.x, y: NY + 46 + 76, w: c.w, size: 16, color: C.blueText });
  });
  const VY = NY + 200;
  s.box({ x: 58, y: VY, w: 1804, h: 50, fill: C.navy });
  s.text('ВЫВОД', { x: 82, y: VY, w: 110, h: 50, size: 22, bold: true, lh: 1.0, color: C.white, valign: 'middle' });
  s.vline(196, VY + 12, 26, C.white, 2);
  s.text('Оккейжны дают разные измеримые сигналы спроса; методологию можно переносить на Tier-2 и оптимизировать еженедельно.',
    { x: 216, y: VY, w: 1620, h: 50, size: 19, color: C.white, valign: 'middle' });

  // ---- низ: две колонки ----
  const BY = VY + 72;
  const L = { x: 58, w: 760 };
  const R = { x: 868, w: 994 };
  s.vline(L.x + L.w + 26, BY, 905 - BY);
  // Approach logic
  s.label('Approach logic', { x: L.x, y: BY, w: L.w, size: 20, color: C.blue });
  s.text('Персонализация ORM по реальным ситуациям и барьерам аудитории', { x: L.x, y: BY + 28, w: L.w, size: 20, bold: true, lh: 1.05, color: C.navy });
  const steps = [
    ['Выделяем оккейжны', 'реальные ситуации, в которых возникает потребность / вопрос'],
    ['Адаптируем отзывы и комментарии', 'тональность, аргумент и сценарий под конкретный контекст'],
    ['Управляем репутационным полем', 'публикации, ответы, рейтинги и поисковая выдача'],
    ['Смотрим изменение спроса', 'как меняется релевантный интерес к бренду / продукту'],
    ['Оптимизируем и масштабируем', 'усиливаем работающие сценарии, слабые — меняем или останавливаем'],
  ];
  const sy0 = BY + 72;
  const sp = 50;
  const bd = 30;
  s.vline(L.x + bd / 2, sy0 + bd / 2, sp * (steps.length - 1));
  steps.forEach(([t, txt], i) => {
    const y = sy0 + i * sp;
    s.badge({ x: L.x, y, d: bd, n: i + 1, color: C.tint, textColor: C.blueText, size: 16 });
    s.text(t, { x: L.x + bd + 16, y: y + 1, w: L.w - bd - 16, size: 18, bold: true, lh: 1.0, color: C.navy });
    s.text(txt, { x: L.x + bd + 16, y: y + 22, w: L.w - bd - 16, size: 16, lh: 1.15, color: C.blueText });
  });
  // 2027 usage principle
  s.label('2027 usage principle', { x: R.x, y: BY, w: R.w, size: 20, color: C.blue });
  s.text('Для Tier-2 важна не единая коммуникация, а единый управляемый стандарт работы', { x: R.x, y: BY + 28, w: R.w, size: 20, bold: true, lh: 1.05, color: C.navy });
  const use = [
    ['01', 'Универсальная методология', 'сегмент → оккейжен → барьер → ORM-сценарий → продуктовый аргумент'],
    ['02', 'Персонализация остается\nбренд-специфичной', 'каждый бренд получает свои ситуации, аргументы и поисковую семантику'],
    ['03', 'Эффект можно видеть раньше', 'еженедельная динамика релевантных групп запросов и репутационного поля дает ранний сигнал для оптимизации'],
    ['04', 'Масштабируем только подтвержденное', 'baseline → occasion-based test → weekly tracking → scale / change / stop'],
  ];
  const uw = (R.w - 28) / 2;
  const utw = uw - 46;
  const uh = use.map(([, t, txt]) => hText(t, utw, 18, true, 1.05) + 5 + hText(txt, utw, 16, false, 1.15));
  const rowH = [Math.max(uh[0], uh[1]), Math.max(uh[2], uh[3])];
  let uy = BY + 72;
  use.forEach(([n, t, txt], i) => {
    const x = R.x + (i % 2) * (uw + 28);
    if (i === 2) uy += rowH[0] + 18;
    s.badge({ x, y: uy - 4, d: 34, n, color: C.blue, size: 15 });
    const th = s.text(t, { x: x + 46, y: uy, w: utw, size: 18, bold: true, lh: 1.05, color: C.navy });
    s.text(txt, { x: x + 46, y: uy + th + 5, w: utw, size: 16, lh: 1.15, color: C.blueText });
  });
  const QY = uy + rowH[1] + 18;
  s.box({ x: R.x, y: QY, w: R.w, h: 56, fill: C.blue });
  s.text('**BOBOTIC H1’26 = validation case  ·  TIER 2 2027 = replicate the method, not the content**',
    { x: R.x + 24, y: QY, w: R.w - 48, h: 56, size: 18, color: C.white, valign: 'middle', align: 'center' });

  s.principle({ icon: 'tb:TbPuzzle', label: '2027 принцип', w: 1680,
    text: 'Закрепить Comprehensive ORM как единый стандарт для Tier-2 — базовый уровень → активация по ситуациям потребления → еженедельный мониторинг спроса и репутации → масштабирование' });
  s.notes('Слайд 31 · новый вариант: доказательство в центре — три большие цифры (+23%, +272%, r = 0,96) с пояснениями и выводом; ниже Approach logic (5 шагов) и 2027 usage principle (4 пункта) с плашкой Bobotic → Tier 2');
}

module.exports = {
  25: [slide25],
  30: [slide30],
  31: [slide31],
};
