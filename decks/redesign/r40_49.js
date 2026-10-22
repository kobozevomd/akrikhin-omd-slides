// Новые варианты слайдов 40, 44, 49 деки Comprehensive 2027 (по брифу work/comprehensive/REDESIGN_BRIEF.md).
// Тексты — дословно из decks/comprehensive/part_g.js, part_h.js, part_i.js.
const path = require('path');
const { C, ACCENTS, columns, IN, PT, chartMap, textWidth, countLines } = require('../../lib/akrikhin');
const V = require('../variants/common');   // TOP, BOT, MUTED, GRID, fmt, pct, statTile, numMark, legend ...

const { MUTED, GRID } = V;

// ---------- общие помощники ----------

// Скруглённый блок с пунктирной обводкой («вне индекса», «вне периода»)
function dashedBox(s, { x, y, w, h, color = MUTED, fill = C.white, r = 12, sw = 2 }) {
  s.s.addShape(s.shapes.roundRect, {
    x: IN(x), y: IN(y), w: IN(w), h: IN(h), fill: { color: fill },
    line: { color, width: PT(sw), dashType: 'dash' }, rectRadius: IN(r),
  });
}

// Ручной перенос по словам: PowerPoint/LibreOffice иначе рвут длинные слова по дефису («бизнес-/эффекта»).
// Короткий предлог не остаётся в конце строки, тире и стрелка не начинают строку. Разметка ** и [[ ]] не мешает.
const SHORTW = new Set(['в', 'во', 'и', 'с', 'со', 'к', 'о', 'об', 'у', 'а', 'но', 'на', 'по', 'за', 'из', 'от', 'до', 'для', 'не', 'при', 'без']);
function prewrap(text, size, width, bold = false, k = 0.94) {
  const plainW = (w) => textWidth(w.replace(/\*\*|\[\[|\]\]/g, ''), size, bold);
  const raw = text.split(' ');
  const words = [];
  raw.forEach((w) => {
    const prev = words[words.length - 1];
    if (prev !== undefined && (/^[—→×+=]$/.test(w) || SHORTW.has(prev.split(' ').pop().toLowerCase()))) words[words.length - 1] = prev + ' ' + w;
    else words.push(w);
  });
  const max = width * k;
  const lines = [];
  let cur = '';
  words.forEach((w) => {
    const next = cur ? cur + ' ' + w : w;
    if (cur && plainW(next) > max) { lines.push(cur); cur = w; } else cur = next;
  });
  if (cur) lines.push(cur);
  return lines.join('\n');
}

// Заголовок раздела: номер-кружок + КАПС-заголовок (+ подпись в той же строке). Возвращает x конца строки
function sectionHead(s, { x, y, n, title, sub, subColor = C.blueText, subBold = false, color = C.blue }) {
  s.badge({ x, y, d: 40, n, color, size: 22 });
  const t = title.toUpperCase();
  const tw = Math.ceil(textWidth(t, 22, true)) + 8;
  s.text(t, { x: x + 54, y: y + 9, w: tw, size: 22, bold: true, lh: 1.0, color: C.navy });
  let end = x + 54 + tw;
  if (sub) {
    const sw = Math.ceil(textWidth(sub, 18, subBold)) + 8;
    s.text(sub, { x: end + 14, y: y + 11, w: sw, size: 18, bold: subBold, lh: 1.0, color: subColor });
    end += 14 + sw;
  }
  return end;
}

// =====================================================================================
// 40 · Brand Attention Monitor: сверху вниз — источники (полоса 100%) → индекс → пример
// =====================================================================================
function slide40(d) {
  const s = d.slide({
    title: 'Brand Attention Monitor в деталях: источники, индекс и пример использования',
    subtitle: 'Автоматический ежедневный сбор из открытых источников, единый еженедельный индекс с калибровкой по BHT и доля внимания внутри конкурентного набора',
  });

  // Как это работает — одна строка-цепочка
  s.pill('Как это работает', { x: 58, y: 221, w: 266, h: 44 });
  s.text('Открытые источники → единый еженедельный индекс → доля внимания vs конкуренты → решения для бренд-команды',
    { x: 348, y: 221, w: 1514, h: 44, size: 20, valign: 'middle', color: C.navy });

  // ---- 1. Источники и веса: одна полоса 100% ----
  const y1 = 293;
  sectionHead(s, { x: 58, y: y1, n: 1, title: 'Источники и веса', sub: 'стартовые веса, калибруются по BHT', subColor: C.blue, subBold: true });
  const BX = 58;
  const BW = 1460;
  const BY = y1 + 54;
  const BH = 62;
  const GAPB = 5;
  const src = [
    ['Search', 0.4, 'Wordstat, поиск в online-аптеках, AI-ответы', C.navy],
    ['Video', 0.2, 'YouTube, Rutube, VK Video, TikTok;\nголос учитывается через\nавто-субтитры', C.blue],
    ['Telegram', 0.2, 'каналы врачей, педиатров и мам', C.blue],
    ['Media', 0.2, 'Фармвестник, Vademecum и деловые Media', C.blue],
  ];
  let sx = BX;
  let descBottom = 0;
  src.forEach(([name, share, desc, color]) => {
    const full = Math.round(BW * share);
    const w = full - GAPB;
    s.box({ x: sx, y: BY, w, h: BH, fill: color, r: 10 });
    s.text(name, { x: sx + 18, y: BY, w: w - 110, h: BH, size: 22, bold: true, lh: 1.0, color: C.white, valign: 'middle' });
    s.text(`${Math.round(share * 100)}%`, { x: sx + w - 108, y: BY, w: 90, h: BH, size: 30, bold: true, lh: 1.0, color: C.white, align: 'right', valign: 'middle' });
    const h = s.text(desc, { x: sx + 2, y: BY + BH + 10, w: w - 14, size: 16, lh: 1.2, color: C.blueText });
    descBottom = Math.max(descBottom, BY + BH + 10 + h);
    sx += full;
  });
  // вне индекса — за правой границей 100%
  const OX = BX + BW + 20;
  dashedBox(s, { x: OX, y: BY, w: 1862 - OX, h: BH, color: MUTED });
  s.text('**Вне индекса:** аптечная полка и маркетплейсы как контекст покупки',
    { x: OX + 18, y: BY, w: 1862 - OX - 30, h: BH, size: 16, lh: 1.15, color: C.navy, valign: 'middle' });

  // ---- 2. Индекс: формула крупно + пояснения ----
  const y2 = descBottom + 22;
  const H2 = 150;
  s.box({ x: 58, y: y2, w: 1804, h: H2, fill: C.cardTint, r: 20 });
  sectionHead(s, { x: 88, y: y2 + 22, n: 2, title: 'Единый еженедельный индекс' });
  s.text('Индекс = 100 × Σ (вес × текущая неделя ÷ базовая неделя)',
    { x: 88, y: y2 + 76, w: 900, h: 50, size: 30, bold: true, lh: 1.1, color: C.navy, valign: 'middle', fit: true, minSize: 24 });
  s.bullets([
    '100 — нормальный уровень бренда; линия показывает рост / снижение относительно него',
    'Share of Attention — доля бренда внутри конкурентного набора',
    'Веса источников перекалибруются по BHT после каждой волны',
    'Препарат, названный только голосом в видео, учитывается через авто-субтитры',
  ], { x: 1030, y: y2 + 22, w: 810, size: 17, gap: 8 });

  // ---- 3. Пример: Azelik vs Skinoclear ----
  const y3 = y2 + H2 + 24;
  const hx = sectionHead(s, { x: 58, y: y3, n: 3, title: 'Пример · Azelik vs Skinoclear', sub: 'Демо Акрихин, сентябрь 2026' });
  V.legend(s, hx + 40, y3 + 11, [[C.blue, 'Azelik'], [MUTED, 'Skinoclear']], { dir: 'row', gap: 150, size: 18 });

  // доли — парные полосы в одной шкале
  const cats = ['Доля в поиске (Wordstat)', 'Доля поиска в online-аптеках'];
  const catText = ['Доля в поиске\n(Wordstat)', 'Доля поиска\nв online-аптеках'];
  const P = { x: 330, y: y3 + 60, w: 530, h: 905 - (y3 + 60) };
  const lo = 0;
  const hi = 0.6;
  const m = chartMap('bar', 2, P, lo, hi);
  const GAP = 45;
  const OV = -12;
  s.chart('bar', [
    { name: 'Azelik', labels: cats, values: [0.46, 0.53] },
    { name: 'Skinoclear', labels: cats, values: [0.49, 0.41] },
  ], { x: P.x - 10, y: P.y - 6, w: P.w + 100, h: P.h + 12, plot: P, min: lo, max: hi, colors: [C.blue, MUTED], gap: GAP, overlap: OV,
    legend: false, format: '0%', labelSize: 20, labelBold: true, extra: { catAxisHidden: true } });
  s.seg(P.x, P.y, P.x, P.y + P.h, { color: C.line, width: 2 });
  cats.forEach((c, i) => {
    s.text(catText[i], { x: 58, y: m.cat(i) - 24, w: P.x - 58 - 20, h: 48, size: 18, bold: true, lh: 1.1, color: C.navy, align: 'right', valign: 'middle' });
  });

  // просмотры YouTube — отдельно цифрами (своя единица, не в общей шкале)
  const YX = 1010;
  s.vline(YX - 40, P.y, P.h, C.line, 1.5);
  s.text('Просмотры YouTube, 90 дней', { x: YX, y: P.y, w: 400, size: 18, bold: true, color: C.navy });
  s.text('52K', { x: YX, y: P.y + 34, w: 170, size: 54, bold: true, lh: 1.1, color: C.blue });
  s.text('vs', { x: YX + 118, y: P.y + 64, w: 40, size: 20, bold: true, lh: 1.0, color: C.blueText, align: 'center' });
  s.text('168K', { x: YX + 170, y: P.y + 34, w: 200, size: 54, bold: true, lh: 1.1, color: C.navy });
  V.legend(s, YX, P.y + 100, [[C.blue, 'Azelik']], { size: 16 });
  V.legend(s, YX + 170, P.y + 100, [[MUTED, 'Skinoclear']], { size: 16 });
  s.text('в 3,2 раза', { x: YX, y: 905 - 36, w: 330, size: 30, bold: true, lh: 1.1, color: C.crimson });

  // вывод
  const WX = 1400;
  s.box({ x: WX, y: P.y - 4, w: 1862 - WX, h: 905 - P.y + 4, fill: C.crimson });
  const outW = 1862 - WX - 52;
  s.text(prewrap('**Вывод:** паритет в поиске, преимущество в online-аптеках и 3× отставание в видео. Самое сильное видео конкурента — у врача-блогера → основание для DOL и интеграций с блогерами', 19, outW),
    { x: WX + 26, y: P.y - 4, w: outW, h: 905 - P.y + 4, size: 19, lh: 1.2, color: C.white, valign: 'middle' });

  s.principle({ x: 110, w: 1700, icon: 'tb:TbShieldCheck', label: 'Pharm-safe',
    text: 'Rx: инвестиции и внимание не объединяем на одном экране | работаем с агрегированными цифрами, а не с пользовательскими текстами | индекс не равен охвату и продажам' });
  s.footnote('Пример источников: Wordstat (Россия, 4 недели до 31.08.2026), поиск в online-аптеках, YouTube (90 дней). «В 3,2 раза» = 168K ÷ 52K — расчёт OMD',
    { x: 110, w: 1700, align: 'center' });
  s.notes('Слайд 40 · новый вариант: сверху вниз по цепочке «источники → индекс → пример»: веса — одна полоса 100%, формула крупно, доли — парные полосы в одной шкале, просмотры YouTube — отдельно цифрами');
}

// =====================================================================================
// 44 · Golden Rules: лента из 5 шевронов + 6 карточек правил 3×2
// =====================================================================================
function slide44(d) {
  const s = d.slide({
    title: 'Golden Rules и библиотека решений 2027: каждый тест должен формировать правило для повторного использования',
    subtitle: 'Ценность Test & Learn — в правиле принятия решения, которое можно повторно использовать для следующего бренда в портфеле',
  });

  s.label('От теста к правилу', { x: 58, y: 221, w: 800, color: C.blue });
  const steps = [
    ['ТЕСТ', 'Проводим тест в сопоставимых условиях', 'одинаковая задача / тип инвентаря / логика креатива'],
    ['ДОКАЗАТЕЛЬСТВО', 'Оцениваем полный результат', 'media + post-click\nbrand / business — где применимо'],
    ['DECISION GATE', 'Фиксируем конкретное решение', 'масштабировать / оптимизировать / остановить / повторить тест'],
    ['GOLDEN RULE', 'Переводим результат в правило', 'порог / маршрут / поставщик /\nQA-критерий'],
    ['ПОВТОРНОЕ ИСПОЛЬЗОВАНИЕ', 'Применяем между брендами', 'добавляем в библиотеку планирования и бриф следующего запуска'],
  ];
  const CY = 256;
  const CH = 80;
  const NOTCH = CH / 2;      // глубина выреза шеврона (adj по умолчанию = 50% высоты)
  const OVL = NOTCH - 10;    // нахлёст соседних шевронов (зазор 10 px)
  const CW = Math.round((1804 + OVL * 4) / 5);
  // подписи под шевронами: заголовки шагов в одну высоту, пояснения — с общей линии
  const geo = steps.map((st, i) => {
    const x = 58 + i * (CW - OVL);
    const tx = x + (i === 0 ? 24 : NOTCH + 10);
    const pw = (i === 4 ? 1856 : x + CW - OVL + NOTCH + 10 - 30) - tx;
    return { x, tx, pw };
  });
  const HY = CY + CH + 18;
  const headH = Math.max(...steps.map(([, head], i) => countLines(head, 22, geo[i].pw, true) * 22 * 1.1));
  let textBottom = 0;
  steps.forEach(([lab, head, desc], i) => {
    const { x, tx, pw } = geo[i];
    const hot = i === 3;
    const color = hot ? C.crimson : C.blue;
    s.s.addShape(i === 0 ? s.shapes.homePlate : s.shapes.chevron, {
      x: IN(x), y: IN(CY), w: IN(CW), h: IN(CH), fill: { color },
    });
    const tw = x + CW - NOTCH - 8 - tx;
    s.text(lab, { x: tx, y: CY, w: tw, h: CH, size: 24, bold: true, lh: 1.05, color: C.white, valign: 'middle', fit: true, maxLines: 2, minSize: 20 });
    s.text(head, { x: tx, y: HY, w: pw, size: 22, bold: true, lh: 1.1, color: hot ? C.crimson : C.navy });
    const dh = s.text(desc, { x: tx, y: HY + headH + 8, w: pw, size: 18, lh: 1.2, color: C.blueText });
    textBottom = Math.max(textBottom, HY + headH + 8 + dh);
  });

  // Примеры Golden Rules — 3×2
  const LY = textBottom + 26;
  s.label('Примеры Golden Rules', { x: 58, y: LY, w: 800, color: C.crimson });
  const rules = [
    ['Таргетинг', 'Пересечение / частота', '>25% пересечения = диагностика, не автоматическая остановка; сохраняем сегмент при высокой эффективности', 'tb:TbTarget'],
    ['AI DSP', 'Выбор поставщика', 'выбираем по связке аудитория × KPI × подтвержденный результат', 'tb:TbCpu'],
    ['Production', 'Выбор production-маршрута', 'Classic / CMP / гибридная модель выбираем заранее по связке master × объем работ × legal risk', 'tb:TbBrush'],
    ['AI-video', 'Критерий масштабирования', 'масштабируем только варианты с подтвержденным дополнительным media / brand эффектом', 'tb:TbVideo'],
    ['Блогеры', 'Проверка рисков', 'AI pre-score → shortlist / ручная проверка / stop-list до начала переговоров', 'tb:TbUsers'],
    ['AI Visibility', 'Экосистема спроса', 'SEO / GEO / ORM / Paid Search управляются как единый контур спроса и доверия', 'tb:TbEye'],
  ];
  const cols = columns(3, { gap: 22 });
  const GY = LY + 40;
  const RG = 18;
  const RH = Math.floor((905 - GY - RG) / 2);
  rules.forEach(([cat, head, text, icon], i) => {
    const { x, w } = cols[i % 3];
    const y = GY + Math.floor(i / 3) * (RH + RG);
    s.card({ x, y, w, h: RH, r: 18 });
    const cx = x + 30;
    const cw = w - 60;
    const chip = cat.toUpperCase();
    const chw = Math.ceil(textWidth(chip, 16, true)) + 30;
    s.box({ x: cx, y: y + 24, w: chw, h: 32, fill: C.tint, r: 16 });
    s.text(chip, { x: cx, y: y + 24, w: chw, h: 32, size: 16, bold: true, lh: 1.0, color: C.blue, align: 'center', valign: 'middle' });
    s.icon(icon, { x: x + w - 30 - 48, y: y + 16, size: 48, circle: C.blue, color: C.white });
    const hh = s.text(head, { x: cx, y: y + 68, w: cw - 10, size: 26, bold: true, lh: 1.1, color: C.navy });
    s.text(text, { x: cx, y: y + 68 + hh + 8, w: cw, h: RH - (68 + hh + 8) - 6, size: 19, lh: 1.2, color: C.blueText, fit: true, minSize: 16 });
  });

  s.principle({ label: 'Принцип 2027', icon: 'target', w: 1640,
    text: 'Каждый пилот завершается зафиксированным Decision Gate и условиями повторного использования — иначе это остается кейсом, а не системной компетенцией' });
  s.notes('Слайд 44 · новый вариант: крупная лента-шевроны «Тест → … → Повторное использование» с акцентом на Golden rule + 6 правил карточками 3×2');
}

// =====================================================================================
// 49 · Roadmap: настоящий таймлайн H2 2026 | Q1 | Q2 | H2 2027, этапы-полосы ступенями вверх
// =====================================================================================
function slide49(d) {
  const s = d.slide({ title: '2027 Transformation Roadmap\nProve → Standardize → Scale' });
  const P = [
    { label: 'H2 2026', x: 58, w: 330 },
    { label: 'Q1 2027', x: 388, w: 474 },
    { label: 'Q2 2027', x: 862, w: 474 },
    { label: 'H2 2027', x: 1336, w: 526 },
  ];
  const G = 8;
  s.label('Roadmap 2027', { x: P[1].x + G, y: 221, w: 600, color: C.blue });
  s.seg(P[1].x + G, 252, 1862, 252, { color: C.blue, width: 3 });
  const AY = 300;
  P.forEach((p) => s.text(p.label, { x: p.x + G, y: 264, w: p.w - 2 * G, size: 24, bold: true, lh: 1.0, color: C.navy }));
  s.seg(58, AY, 1862, AY, { color: C.line, width: 2 });
  P.slice(1).forEach((p) => s.seg(p.x, AY - 8, p.x, 905, { color: C.line, width: 1.5, dash: 'dash' }));

  const stages = [
    { n: 1, name: 'ПОДТВЕРДИТЬ', when: 'Q1 / начало 2027', head: 'Проверить новые возможности на реальных задачах брендов',
      items: ['Калибровка OMD Voice', 'Пилот Brand Attention Monitor', 'Тесты AI-DSP-сегментов из OMD Voice', 'Тесты персонализированных LP', 'Создание AI-video для новых брендов'],
      foot: 'Доказательство' },
    { n: 2, name: 'СТАНДАРТИЗИРОВАТЬ', when: 'Q2 2027', head: 'Перевести успешные пилоты в управляемые операционные правила',
      items: ['Golden Rules / правила принятия решений', 'AI-скоринг блогеров', 'DO & DON’Ts playbook в разбивке по брендам для написания сценариев в Influence', 'Comprehensive для E-com', 'единая система измерения'],
      foot: 'Операционная модель' },
    { n: 3, name: 'МАСШТАБИРОВАТЬ', when: 'H2 2027', head: 'Масштабировать только то, что имеет доказанный эффект и повторяемый процесс',
      items: ['cross-brand повторное использование\nпо типу задачи', 'встроить правила в годовое /\nflight-планирование', 'масштабировать production-\nи targeting-маршруты', 'единая библиотека знаний', 'годовая перекалибровка'],
      foot: 'Масштабируемая компетенция' },
  ];
  const colors = [C.blue, C.cyan, C.crimson];
  const BAR = 56;
  const PITCH = 66;
  const R0 = 344;                       // полоса этапа 3 (верхняя ступень)
  const barY = [R0 + 2 * PITCH, R0 + PITCH, R0];
  const CT = R0 + 3 * PITCH + 26;       // верх колонок с содержимым

  // старт — маркер на нижней ступени
  {
    const y = barY[0];
    s.circle({ x: 58, y: y + (BAR - 52) / 2, d: 52, fill: C.navy });
    s.icon('tb:TbFlag', { x: 58 + 13, y: y + (BAR - 52) / 2 + 13, size: 26, color: C.white });
    s.text('СТАРТОВАЯ ТОЧКА:\nH2 2026', { x: 124, y, w: 250, h: BAR, size: 21, bold: true, lh: 1.05, color: C.navy, valign: 'middle' });
    s.seg(124 + 238, y + BAR / 2, P[1].x + G, y + BAR / 2, { color: C.navy, width: 2, dash: 'sysDot' });
    s.text(prewrap('Comprehensive-подход подтвержден на реальных кампаниях: сегментная модель, правила overlap, пилоты CMP / AI-video, workflow блогеров, DMP-тесты и оценка бизнес-эффекта', 19, P[0].w - 40, true),
      { x: 58, y: CT, w: P[0].w - 40, size: 19, bold: true, lh: 1.25, color: C.navy });
  }

  stages.forEach((st, i) => {
    const p = P[i + 1];
    const color = colors[i];
    const x = p.x + G;
    const w = p.w - 2 * G - (i === 2 ? 14 : 0);
    const y = barY[i];
    s.box({ x, y, w, h: BAR, fill: color, r: 14 });
    const ww = Math.ceil(textWidth(st.when, 16, true)) + 6;
    s.text(`${st.n}  ${st.name}`, { x: x + 22, y, w: w - ww - 70, h: BAR, size: 24, bold: true, lh: 1.0, color: C.white, valign: 'middle', fit: true, maxLines: 1, minSize: 19 });
    s.text(st.when, { x: x + w - 30 - ww, y, w: ww, h: BAR, size: 16, bold: true, lh: 1.0, color: C.white, align: 'right', valign: 'middle' });
    const dx = x + w;
    const fl = st.foot.toUpperCase();
    const fw = Math.ceil(textWidth(fl, 19, true)) + 6;
    s.seg(dx, y - 12, dx, y + BAR / 2 - 18, { color, width: 2 });
    s.s.addShape(s.shapes.diamond, { x: IN(dx - 19), y: IN(y + BAR / 2 - 19), w: IN(38), h: IN(38),
      fill: { color: C.white }, line: { color, width: PT(4) } });
    s.text(fl, { x: dx + 12 - fw, y: y - 36, w: fw, size: 19, bold: true, lh: 1.0, color, align: 'right' });
    // содержимое под периодом
    const cx = x + 6;
    const cw = w - 30;
    const hh = s.text(st.head, { x: cx, y: CT, w: cw, size: 22, bold: true, lh: 1.15, color: C.navy });
    s.bullets(st.items, { x: cx, y: CT + hh + 16, w: cw, size: 19, gap: 10 });
  });

  s.principle({ x: 58, w: 1804, icon: 'flow', label: 'Результат 2027',
    text: 'От отдельных AI-пилотов к масштабируемой системе, которая превращает успешные тесты в общие правила для брендов и повышает отдачу от инвестиций год к году' });
  s.notes('Слайд 49 · новый вариант: настоящий таймлайн H2 2026 | Q1 | Q2 | H2 2027 — этапы полосами на своих периодах, лесенкой вверх, итог-веха (ромб) на конце каждой полосы; задача и пункты — колонкой под своим периодом');
}

module.exports = {
  40: [slide40],
  44: [slide44],
  49: [slide49],
};
