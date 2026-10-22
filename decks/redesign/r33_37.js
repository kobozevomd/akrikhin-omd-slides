// Новые варианты слайдов 33, 35, 37 деки Comprehensive 2027 (аудит, REDESIGN_BRIEF.md).
// 33 — выводы 2026 цифрами → поток Playbook 1→2→3 + отдельная дорожка AI-video;
// 35 — один сюжет слева направо: три фазы с крупными номерами;
// 37 — разбит на два слайда: 01 персонализация e-com контакта / 02 тест новых механик.
// Тексты — дословно из decks/comprehensive/part_f.js и part_g.js.
const path = require('path');
const { C, columns, textWidth, countLines } = require('../../lib/akrikhin');
const V = require('../variants/common');

const TOP = 221;   // верх контента
const CB = 905;    // низ контента над плашкой
const BOT = 1005;  // низ контента на слайдах без плашки (37)

// ---------- помощники ----------

// Крупная метка части слайда: «01» цветом + название (слайды 37·1, 37·2)
function partMark(s, { x = 58, y = TOP, n, text, color = C.crimson }) {
  s.text(n, { x, y: y - 6, w: 90, size: 54, bold: true, lh: 1.0, color });
  s.text(text, { x: x + 92, y: y + 6, w: 1200, size: 34, bold: true, lh: 1.1, color: C.navy });
}

// Чипы в строку с переносом. Возвращает высоту блока
function chips(s, items, { x, y, w, size = 18, h = 40, gap = 10, pad = 30, fill = C.white, stroke = C.blue, color = C.navy, bold = true }) {
  let cx = x;
  let cy = y;
  items.forEach((t) => {
    const cw = Math.ceil(textWidth(t, size, bold)) + 8 + pad;
    if (cx > x && cx + cw > x + w) { cx = x; cy += h + gap; }
    s.box({ x: cx, y: cy, w: cw, h, fill, stroke, sw: 2, r: h / 2 });
    s.text(t, { x: cx, y: cy, w: cw, h, size, bold, lh: 1.0, color, align: 'center', valign: 'middle' });
    cx += cw + gap;
  });
  return cy + h - y;
}

// Картинка по высоте с сохранением пропорций (размеры исходника в px) → ширина
function imageH(s, file, src, { x, y, h }) {
  const w = Math.round((h * src[0]) / src[1]);
  s.image(path.join(V.MEDIA, file), { x, y, w, h });
  return w;
}

// =====================================================================
// 33 · 2027 Production Playbook
// =====================================================================
function slide33(d) {
  const s = d.slide({ title: '2027 Production Playbook: гибридная модель создания баннеров, AI-video — отдельный цикл' });

  // ── слева: 2026, приглушённо ──
  const L = { x: 58, w: 540 };
  s.card({ x: L.x, y: TOP, w: L.w, h: CB - TOP, tint: true });
  const lx = L.x + 34;
  const lw = L.w - 68;
  s.label('2026: ключевые выводы', { x: lx, y: TOP + 34, w: lw, color: C.blue });
  // первый вывод — тремя большими цифрами; блоки по ширине содержимого, зазоры равные
  const nums = [['793', 'версии\nкреативов'], ['6', 'брендов'], ['3', 'AI-video\nD2C']];
  const nW = nums.map(([v, t]) => Math.ceil(Math.max(textWidth(v, 64, true), ...t.split('\n').map((l) => textWidth(l, 18, true)))));
  const nGap = (lw - nW.reduce((a, b) => a + b, 0)) / 2;
  let nx = lx;
  nums.forEach(([v, t], i) => {
    s.text(v, { x: nx, y: TOP + 82, w: nW[i] + 20, size: 64, bold: true, lh: 1.0, color: C.blue });
    s.text(t, { x: nx, y: TOP + 156, w: nW[i] + 20, size: 18, bold: true, lh: 1.2, color: C.navy });
    nx += nW[i] + nGap;
  });
  s.hline(lx, TOP + 226, lw);
  s.bullets([
    '**Classic production** остается необходимым для генерации новых креативных идей, KV, сложной анимации и high legal-risk claims',
    '**CMP** эффективнее для серийных адаптаций: **20+ версий / 3+ сегмента**',
    '**AI-video** требует отдельного workflow, прав и legal QA',
  ], { x: lx, y: TOP + 250, w: lw, size: 20, gap: 16 });
  // ограничение — малиновым блоком
  const lh = 176;
  const ly = CB - 34 - lh;
  s.box({ x: lx, y: ly, w: lw, h: lh, fill: C.crimson });
  s.text('ОГРАНИЧЕНИЕ ДЛЯ БИЗНЕСА:', { x: lx + 26, y: ly + 24, w: lw - 52, size: 22, bold: true, lh: 1.0, color: C.white });
  s.text('без сформированных правил выбора маршрута экономия остается фрагментарной, а доработки сохраняются',
    { x: lx + 26, y: ly + 60, w: lw - 52, h: lh - 80, size: 20, lh: 1.2, color: C.white, fit: true, minSize: 18 });

  // стрелка 2026 → 2027
  s.arrow({ dir: 'right', x: 608, y: (TOP + CB) / 2, len: 34, head: 56, headLen: 26, stem: 22 });

  // ── справа: Playbook 2027 ──
  const R = { x: 652, w: 1210 };
  const laneH = 146;
  const laneY = CB - laneH;
  const aB = laneY - 20;
  s.card({ x: R.x, y: TOP, w: R.w, h: aB - TOP });
  const rx = R.x + 34;
  s.label('Playbook 2027', { x: rx, y: TOP + 34, w: 400, color: C.crimson });
  s.text('баннеры: гибридная модель', { x: rx + Math.ceil(textWidth('PLAYBOOK 2027', 22, true)) + 24, y: TOP + 33, w: 600, size: 22, color: C.blueText });

  const steps = [
    { t: 'Выбираем\nпродакшн-маршрут\nзаранее', b: [
      'Выбираем Classic / CMP / гибридная модель **на этапе брифа**',
      '**Матрица выбора:** наличие master × объем × визуальная сложность × legal risk'] },
    { t: 'Стандартизируем\nвходные данные', b: [
      '**Единый source pack:** brand assets, legal pack, media matrix, segment matrix',
      '**До запуска в production** фиксируем SLA, роли, единицы стоимости и QA checklist'] },
    { t: 'Масштабируем\nповторяемое\nпроизводство', b: [
      '**Classic** = идея / master / claims; **CMP** = пакетные адаптации / экспорт на платформы',
      '**Гибрид** становится базовой моделью:\n**master → template → scale**'] },
  ];
  const cols = columns(3, { x0: rx, x1: R.x + R.w - 34, gap: 52 });
  const by = TOP + 80;
  const bd = 72;
  const tH = 3 * 28 * 1.1;
  cols.forEach((c, i) => {
    const it = steps[i];
    if (i < 2) {
      // соединительная линия к следующему номеру + наконечник
      const x1 = c.x + bd + 16;
      const x2 = cols[i + 1].x - 16;
      s.seg(x1, by + bd / 2, x2 - 16, by + bd / 2, { color: C.line, width: 4 });
      s.chevron({ cx: x2 - 9, cy: by + bd / 2, w: 20, h: 28, color: C.blue });
    }
    s.badge({ x: c.x, y: by, d: bd, n: i + 1, color: C.blue, size: 36 });
    s.text(it.t, { x: c.x, y: by + bd + 20, w: c.w, h: tH, size: 28, bold: true, lh: 1.1, color: C.navy });
    s.bullets(it.b, { x: c.x, y: by + bd + 20 + tH + 18, w: c.w, size: 21, gap: 14 });
  });

  // отдельная дорожка: AI-video
  s.card({ x: R.x, y: laneY, w: R.w, h: laneH, fill: C.white, stroke: C.crimson });
  s.badge({ x: rx, y: laneY + (laneH - bd) / 2, d: bd, n: 4, color: C.crimson, size: 36 });
  s.text('AI-video', { x: rx + bd + 24, y: laneY + 30, w: 600, size: 34, bold: true, lh: 1.0, color: C.crimson });
  s.text('Отдельный production cycle', { x: rx + bd + 24, y: laneY + 78, w: 600, size: 24, lh: 1.1, color: C.navy });
  s.text('→ подробнее на следующем слайде', { x: R.x + R.w - 34 - 440, y: laneY + (laneH - 24) / 2, w: 440, size: 20, color: C.blueText, align: 'right' });

  s.principle({ x: 58, w: 1804, icon: 'tb:TbTrendingUp', label: 'Влияние на бизнес',
    text: 'ранний выбор маршрута → прозрачная экономика → короче production cycle → меньше ручных доработок → масштабируемое производство' });
  s.notes('Слайд 33 · новый вариант: выводы 2026 тремя большими цифрами → поток Playbook 1→2→3 + отдельная дорожка AI-video');
}

// =====================================================================
// 35 · DOOH + AI-video 2027
// =====================================================================
function slide35(d) {
  const s = d.slide({
    title: 'DOOH + AI-video 2027: физический контекст как новая точка контакта в едином CJM',
    subtitle: 'DOOH расширяет путь пользователя за пределы Digital: переносит сегментную коммуникацию в релевантные жизненные контексты и позволяет проверить, усиливает ли физическая среда интерес, поиск и действие',
  });
  const cols = columns(3, { gap: 64 });
  const PH = [
    { t: 'Планируем как omnichannel', color: C.blue },
    { t: 'Как активируем', color: C.cyan },
    { t: 'Как поймем, что механика работает', color: C.navy },
  ];
  const bd = 70;
  const cTop = TOP + bd / 2;
  const cBot = 790;
  const pad = 32;
  const tY = TOP + bd + 16;       // заголовок фазы
  const body = tY + 30 + 22;      // начало содержимого фазы
  const end = cBot - 32;          // низ содержимого фазы
  cols.forEach((c, i) => {
    s.card({ x: c.x, y: cTop, w: c.w, h: cBot - cTop });
    s.badge({ x: c.x + pad, y: TOP, d: bd, n: i + 1, color: PH[i].color, size: 36 });
    s.text(PH[i].t, { x: c.x + pad, y: tY, w: c.w - pad * 2, size: 26, bold: true, lh: 1.1, color: C.navy, fit: true, maxLines: 1, minSize: 24 });
    if (i < 2) s.arrow({ dir: 'right', x: c.x + c.w + 12, y: (cTop + cBot) / 2, len: 40, head: 46, headLen: 22, stem: 16 });
  });
  const X = (i) => cols[i].x + pad;
  const Wd = cols[0].w - pad * 2;
  const id = 50;               // иконка в кружке
  const tw = Wd - id - 18;     // ширина текста справа от иконки / номера
  const tx = (i) => X(i) + id + 18;
  const hT = (t) => countLines(t, 20, tw, true) * 20 * 1.1;
  const hB = (t) => countLines(t, 19, tw, false) * 19 * 1.2;

  // ── 1. Планируем как omnichannel: три пункта, растянуты на высоту фазы ──
  const plan = [
    ['ДОПОЛНЯЕМ DIGITAL TOUCHPOINTS', 'DOOH усиливает экранную экосистему и добавляет новый контакт за пределами OLV\u00a0/\u00a0CTV'],
    ['ПЕРЕНОСИМ ПЕРСОНАЛИЗАЦИЮ В КОНТЕКСТ', 'AI-video адаптирует сообщение под сегмент, барьер, оккейжен и место контакта'],
    ['ПРОВЕРЯЕМ ВКЛАД В ЕДИНЫЙ ПУТЬ', 'Тестируем, усиливает ли новый контакт поисковый интерес, визиты и целевые действия'],
  ];
  const ph = plan.map(([t, b]) => Math.max(id, hT(t) + 8 + hB(b)));
  const pg = (end - body - ph.reduce((a, b) => a + b, 0)) / (plan.length - 1);
  let y = body;
  plan.forEach(([t, b], k) => {
    if (k) s.hline(X(0), y - pg / 2, Wd);
    s.badge({ x: X(0), y, d: id, n: '0' + (k + 1), color: C.tint, textColor: C.blue, size: 20 });
    const th = s.text(t, { x: tx(0), y: y + 2, w: tw, size: 20, bold: true, lh: 1.1, color: C.navy });
    s.text(b, { x: tx(0), y: y + 2 + th + 6, w: tw, size: 19, lh: 1.2 });
    y += ph[k] + pg;
  });

  // ── 2. Как активируем: четыре параметра цепочкой + контексты 2027 ──
  const act = [
    ['SEGMENT / OCCASION', 'кого и с какой задачей ищем', 'tb:TbUsers'],
    ['CONTEXT / POI', 'где этот контакт наиболее релевантен', 'tb:TbMapPin'],
    ['AI-VIDEO VERSION', 'какую адаптацию сообщения показываем', 'tb:TbVideo'],
    ['DOOH INVENTORY', 'на каком типе экранов размещаемся', 'tb:TbDeviceTv'],
  ];
  const ctx = ['аптеки и мед. точки', 'ПВЗ', 'food / non-food retail'];
  const chH = 38;
  const chY = end - chH;
  const klY = chY - 32;
  const kTop = klY - 26;          // разделитель над контекстами
  const ap = (kTop - 26 - body - id) / (act.length - 1);
  s.vline(X(1) + id / 2, body + id / 2, ap * (act.length - 1), C.line, 2);
  act.forEach(([t, b, ic], k) => {
    const yy = body + k * ap;
    s.icon(ic, { x: X(1), y: yy, size: id, circle: C.cyan });
    s.text(t, { x: tx(1), y: yy - 1, w: tw, size: 20, bold: true, lh: 1.1, color: C.navy });
    s.text(b, { x: tx(1), y: yy + 25, w: tw, size: 19, lh: 1.2 });
  });
  s.hline(X(1), kTop, Wd);
  s.text('КОНТЕКСТЫ 2027:', { x: X(1), y: klY, w: Wd, size: 19, bold: true, lh: 1.0, color: C.blue });
  // чипы в одну строку: подбираем кегль
  let cs = 18;
  let cp = 24;
  const rowW = (sz, pd) => ctx.reduce((a, t) => a + Math.ceil(textWidth(t, sz, true)) + 8 + pd, 0) + 10 * (ctx.length - 1);
  while (rowW(cs, cp) > Wd && cs > 16) { cs -= 1; cp = Math.max(18, cp - 2); }
  chips(s, ctx, { x: X(1), y: chY, w: Wd, size: cs, h: chH, gap: 10, pad: cp, stroke: C.cyan });

  // ── 3. Как поймем, что механика работает: три метрики + decision gate ──
  const kpi = [
    ['SEARCH LIFT', 'рост поискового интереса по brand / category / symptom', 'tb:TbSearch'],
    ['VISIT LIFT', 'дополнительные визиты / переходы после контакта', 'tb:TbMapPinCheck'],
    ['POST-VIEW ACTION', 'целевые действия: site / e-com / partner', 'tb:TbHandClick'],
  ];
  const gH = 132;
  const gY = end - gH;
  const kh = kpi.map(([, b]) => Math.max(id, 25 + hB(b)));
  const kg = (gY - 24 - body - kh.reduce((a, b) => a + b, 0)) / (kpi.length - 1);
  y = body;
  kpi.forEach(([t, b, ic], k) => {
    s.icon(ic, { x: X(2), y, size: id, circle: C.navy });
    s.text(t, { x: tx(2), y: y - 1, w: tw, size: 20, bold: true, lh: 1.1, color: C.navy });
    s.text(b, { x: tx(2), y: y + 25, w: tw, size: 19, lh: 1.2 });
    y += kh[k] + kg;
  });
  s.box({ x: X(2), y: gY, w: Wd, h: gH, fill: C.crimson });
  s.text('DECISION GATE:', { x: X(2) + 24, y: gY + 20, w: Wd - 48, size: 19, bold: true, lh: 1.0, color: C.white });
  s.text('до запуска задаем прогнозный коридор\n→ после теста сравниваем фактический lift\n→ **scale / optimize / stop**',
    { x: X(2) + 24, y: gY + 48, w: Wd - 48, h: gH - 60, size: 19, lh: 1.2, color: C.white, fit: true, minSize: 17 });

  // ── ценность: две полосы в одну строку ──
  const vY = 810;
  const vH = 95;
  const vals = [
    { label: 'МЕДИЙНАЯ\nЦЕННОСТЬ', items: ['охват за пределами digital', 'новые контексты'], color: C.blue },
    { label: 'ЦЕННОСТЬ\nДЛЯ БРЕНДА', items: ['более уместный контакт', 'связка awareness → action', 'база для cross-brand scale'], color: C.navy },
  ];
  const sep = '   •   ';
  const vw = vals.map((v) => 30 + 160 + 30 + Math.ceil(textWidth(v.items.join(sep), 20, false)) + 34);
  const extra = (1804 - 22 - vw[0] - vw[1]) / 2;
  let vx = 58;
  vals.forEach((v, k) => {
    const w = Math.round(vw[k] + extra);
    s.box({ x: vx, y: vY, w, h: vH, fill: C.cardTint });
    s.text(v.label, { x: vx + 28, y: vY, w: 170, h: vH, size: 19, bold: true, lh: 1.1, color: v.color, valign: 'middle' });
    s.vline(vx + 28 + 170 + 14, vY + 24, vH - 48, C.line, 2);
    s.text(v.items.join(sep), { x: vx + 28 + 170 + 34, y: vY, w: w - (28 + 170 + 34) - 20, h: vH, size: 20, lh: 1.2, color: C.navy, valign: 'middle' });
    vx += w + 22;
  });

  s.principle({ x: 58, w: 1804, label: 'Принцип 2027',
    text: 'DOOH — не отдельный эксперимент, а расширение Personalized Production: AI-video переносит сегментную коммуникацию в физический контекст и добавляет новый измеримый контакт в единый CJM. Бренд для теста — Азелик.' });
  s.notes('Слайд 35 · новый вариант: один сюжет слева направо — три фазы с крупными номерами, ценность полосой ниже');
}

// =====================================================================
// 37 · E-com: два слайда
// =====================================================================
const T37 = 'Использование Comprehensive-подхода в E-com';
const S37 = 'Масштабирование связки «сегмент → e-com сигнал → персонализированный креатив» и тест новых креативных механик в рамках маркетплейсов с реализацией на стороне Акрихин';

function slide37a(d) {
  const s = d.slide({ title: T37, subtitle: S37 });
  partMark(s, { n: '01', text: 'Персонализация e-com контакта' });

  // ── таблица сценариев слева: сегмент → контекст → креатив ──
  const T = { x: 58, w: 1236 };
  const col = [
    { x: T.x + 26, w: 480, n: '01', t: 'Сегмент', sub: 'из digital-стратегии' },
    { x: T.x + 566, w: 440, n: '02', t: 'Контекст', sub: 'подбор e-com сигнала' },
    { x: T.x + 1046, w: T.w - 1046, n: '03', t: 'Креатив', sub: 'повтор 360° message' },
  ];
  const HY = 300;
  col.forEach((c, i) => {
    s.badge({ x: c.x, y: HY, d: 40, n: c.n, color: C.blue, size: 17 });
    s.text(c.t, { x: c.x + 50, y: HY + 2, w: c.w - 46, size: 30, bold: true, lh: 1.1, color: C.navy });
    s.text(c.sub, { x: c.x, y: HY + 50, w: c.w + 10, size: 18, lh: 1.2, color: C.blueText });
    if (i < 2) s.chevron({ cx: col[i + 1].x - 30, cy: HY + 20, w: 18, h: 28, color: C.crimson });
  });
  const rows = [
    {
      color: C.blue,
      seg: ['SPRINT win the competition', 'Ж 18–34 · Новые средства', '- Ищут новое решение и готовы пробовать альтернативы привычному уходу (анти-акне уход + проф. косметологические процедуры)'],
      ctx: 'Покупки / интересы к средствам/лекарствам категории «уход за лицом, проблемная кожа, аптечная косметика»; покупки смежных SKU',
      img: ['img_44a17bb2bf.png', [184, 393]],
    },
    {
      color: C.cyan,
      seg: ['SPRINT win the competition', 'Switchers МЖ 18–34 (Skinoclear)', '- Пользователи / потенциальные switchers конкурентов'],
      ctx: 'Покупки / интерес к конкурентным брендам и anti-acne SKU; ретаргетинг по релевантным карточкам',
      img: ['img_990dd37847.png', [225, 403]],
    },
    {
      color: C.teal,
      seg: ['EXPAND THE CATEGORY', 'МЖ 18–40 · акне / постакне', '- Важно не только убрать воспаления, но и работать с последствиями'],
      ctx: 'Повторные покупки;\nпросмотр / корзина derm-SKU',
      img: ['img_abbb1acb3e.png', [276, 463]],
    },
  ];
  const RY = 394;
  const RG = 16;
  const RH = Math.floor((BOT - RY - RG * 2) / 3);
  s.hline(T.x, RY - RG, T.w);
  rows.forEach((r, i) => {
    const y = RY + i * (RH + RG);
    if (i) s.hline(T.x, y - RG / 2, T.w);
    s.box({ x: T.x, y: y + 4, w: 8, h: RH - 8, fill: r.color, r: 4 });
    const c0 = col[0];
    let ty = y + 6;
    ty += s.text(r.seg[0], { x: c0.x, y: ty, w: c0.w, size: 18, bold: true, lh: 1.2, color: r.color }) + 2;
    ty += s.text(r.seg[1], { x: c0.x, y: ty, w: c0.w, size: 23, bold: true, lh: 1.2, color: C.navy }) + 8;
    s.text(r.seg[2], { x: c0.x, y: ty, w: c0.w, h: y + RH - ty, size: 20, lh: 1.2, fit: true, minSize: 16 });
    s.text(r.ctx, { x: col[1].x, y: y + 6, w: col[1].w, h: RH - 10, size: 21, lh: 1.25, fit: true, minSize: 17 });
    imageH(s, r.img[0], r.img[1], { x: col[2].x, y, h: RH });
  });

  // ── как оценить — справа, сверху вниз: контроль / тест → uplift → decision gate ──
  const P = { x: 1318, w: 544 };
  const py = HY - 8;
  s.card({ x: P.x, y: py, w: P.w, h: BOT - py, tint: true });
  const px = P.x + 30;
  const pw = P.w - 60;
  const head = 'Как оценить эффективность персонализации в e-com';
  const yH = py + 28;
  const hH = countLines(head, 24, pw, true) * 24 * 1.1;
  const bxH = 106;
  const upH = 20 + 14 + 40;
  const gH = 132;
  const g1 = 26;
  const g = (BOT - 28 - yH - hH - g1 - (bxH * 2 + 12) - upH - gH) / 2;
  s.text(head, { x: px, y: yH, w: pw, size: 24, bold: true, lh: 1.1, color: C.navy });
  let yy = yH + hH + g1;
  [['Контроль:', 'тот же сегмент + тот же e-com сигнал + базовый креатив', C.line, C.navy],
    ['Тест:', 'тот же сегмент/контекст + персонализированный 360° message', C.blue, C.blue]].forEach(([t, b, st, tc]) => {
    s.box({ x: px, y: yy, w: pw, h: bxH, fill: C.white, stroke: st, sw: 2 });
    s.text(t, { x: px + 20, y: yy + 16, w: pw - 40, size: 19, bold: true, lh: 1.0, color: tc });
    s.text(b, { x: px + 20, y: yy + 46, w: pw - 40, size: 18, lh: 1.2 });
    yy += bxH + 12;
  });
  yy += g - 12;
  s.chevron({ cx: px + pw / 2, cy: yy - g / 2, dir: 'down', w: 34, h: 20, color: C.blue });
  s.text('Сравнение uplift:', { x: px, y: yy, w: pw, size: 20, bold: true, lh: 1.0, color: C.navy });
  yy += 34;
  const up = ['CTR', 'Add-to-cart', 'To buy'];
  chips(s, up, { x: px, y: yy, w: pw, size: 18, h: 40, gap: 36, pad: 30, stroke: C.blue });
  let cx = px;
  up.slice(0, -1).forEach((t) => {
    cx += Math.ceil(textWidth(t, 18, true)) + 8 + 30;
    s.chevron({ cx: cx + 18, cy: yy + 20, w: 12, h: 18, color: C.blue });
    cx += 36;
  });
  yy += 40 + g;
  s.chevron({ cx: px + pw / 2, cy: yy - g / 2, dir: 'down', w: 34, h: 20, color: C.crimson });
  s.box({ x: px, y: yy, w: pw, h: gH, fill: C.crimson });
  s.text('DECISION GATE:', { x: px + 24, y: yy + 20, w: pw - 48, size: 19, bold: true, lh: 1.0, color: C.white });
  s.text('масштабирование связки при uplift по CTR/корзине/заказам', { x: px + 24, y: yy + 52, w: pw - 48, size: 21, bold: true, lh: 1.2, color: C.white });

  s.footnote('* Метрики — по доступности данных площадки / поставщика');
  s.notes('Слайд 37 · новый вариант: часть 1 из 2 — сценарии «сегмент → контекст → креатив» строками с крупными креативами, оценка — справа сверху вниз');
}

function slide37b(d) {
  const s = d.slide({ title: T37, subtitle: S37 });
  partMark(s, { n: '02', text: 'Тест новых механик' });

  // ── скриншот телефонов справа, крупно ──
  // в карточке: фон карточки совпадает с почти белым фоном скриншота, край картинки не виден
  const ch = 404;
  const ih = ch - 16;
  const iw = Math.round((ih * 1448) / 1086);
  const ix = 1862 - iw - 16;
  s.card({ x: ix - 16, y: TOP, w: iw + 32, h: ch });
  s.image(path.join(V.MEDIA, 'img_0874aa6a47.png'), { x: ix, y: TOP + 8, w: iw, h: ih });

  // ── слева: что тестируем ──
  const lw = ix - 16 - 58 - 50;
  let y = 304;
  y += s.heading('A/B-тест главного фото:\nпроверка креатива уже внутри карточки', { x: 58, y, w: lw, size: 36 }) + 22;
  y += s.text('**Перенос персонализации внутрь карточки:** для одного SKU показываются разные главные фото разным сегментам аудитории. Сегмент задаётся по параметрам **пол, возраст, семейное положение и регион**, а WB автоматически подбирает наиболее релевантных пользователей. Так связка [[**«сегмент → персонализированный креатив»**]] продолжается уже в e-com',
    { x: 58, y, w: lw, size: 22, lh: 1.25 }) + 12;
  s.text('* Фактический состав аудитории может частично отличаться от заданных параметров.', { x: 58, y, w: lw, size: 15 });

  // ── как оценить: методология 3 шага + итог ──
  const MY = TOP + ch + 18;
  s.card({ x: 58, y: MY, w: 1804, h: BOT - MY, tint: true });
  s.label('Методология A/B-теста', { x: 92, y: MY + 26, w: 800, size: 18, color: C.blue });
  s.text('Как оценить эффективность карточки для целевой аудитории', { x: 92, y: MY + 52, w: 1500, size: 26, bold: true, lh: 1.1, color: C.navy });
  const st = [
    { t: 'Деление аудитории 50/50', b: 'Параллельно тестируется **текущее фото (A) и новый персонализированный креатив (B)** на сопоставимых группах пользователей' },
    { t: 'Фиксация условий теста', b: 'Тест **идет 1–8 недель**. В этот период не меняется главное фото вручную и поддерживается наличие товара, чтобы результат отражал именно эффект креатива' },
    { t: 'Масштабирование только подтвержденных вариантов', b: 'Сравниваются варианты по воронке **переход в карточку → корзина → заказ**. При статистически значимом uplift масштабируется победивший креатив; если разницы нет — **продление теста или проверка новой гипотезы.**' },
  ];
  const sc = columns(3, { x0: 92, x1: 1828, gap: 56 });
  const sy = MY + 108;
  const bd = 52;
  sc.forEach((c, i) => {
    if (i < 2) s.chevron({ cx: c.x + c.w + 28, cy: sy + bd / 2, w: 18, h: 26, color: C.blue });
    s.badge({ x: c.x, y: sy, d: bd, n: i + 1, color: C.blue, size: 26 });
    s.text(st[i].t, { x: c.x + bd + 16, y: sy, w: c.w - bd - 16, h: bd, size: 22, bold: true, lh: 1.1, color: C.navy, valign: 'middle', fit: true, minSize: 19 });
    s.text(st[i].b, { x: c.x, y: sy + bd + 14, w: c.w, size: 18, lh: 1.25 });
  });
  // итог — Scale
  const sH = 56;
  s.box({ x: 92, y: BOT - 26 - sH, w: 1736, h: sH, fill: C.crimson });
  s.text('Scale: победивший visual → default на карточке', { x: 92, y: BOT - 26 - sH, w: 1736, h: sH, size: 22, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });

  s.footnote('Источник: Wildberries Seller, «А/Б-тестирование главного фото в карточке товара», обновлено 27.08.2026');
  s.notes('Слайд 37 · новый вариант: часть 2 из 2 — A/B-тест главного фото — текст и крупный скриншот, методология тремя шагами, итог Scale');
}

module.exports = {
  33: [slide33],
  35: [slide35],
  37: [slide37a, slide37b],
};
