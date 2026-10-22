// Слайд «Comprehensive 2026: достижения и динамика Digital Maturity» — по картинке Романа (13.10.2026).
// Две версии: 1 — с сохранением визуала картинки; 2 — переосмысление (одна таблица + гантели зрелости на общей шкале).
//   node decks/maturity_2026.js → ../Comprehensive_2026_digital_maturity.pptx
const path = require('path');
const { Deck, C, IN, PT, textWidth, typo, fitSize } = require('../lib/akrikhin');

const OUT = path.join(__dirname, '..', '..', 'Comprehensive_2026_digital_maturity.pptx');
const MUTED = 'A9BFD9';
const GREEN = '2E9E5B';
const fmt2 = (v) => v.toFixed(2).replace('.', ',');
const sign = (v) => (v >= 0 ? '+' : '−') + fmt2(Math.abs(v));

const TITLE = 'COMPREHENSIVE 2026:\nДОСТИЖЕНИЯ И ДИНАМИКА DIGITAL MATURITY';

// Данные — с картинки. vs категория = 2026 − категория (совпадает с подписями на картинке)
const ROWS = [
  { name: 'Активация и данные', y25: 2.30, y26: 3.50, cat: 2.70, color: C.cyan,
    q: 'Кто наши потребители, что их волнует и как быстро это проверить?',
    tag: 'AI CJM', icon: 'tb:TbBrain', tagColor: C.cyan, hColor: C.cyan,
    h: 'CJM определяет аудитории и сообщения',
    t: 'Систематизировали потребности и барьеры по 6 брендам.\nИспользуем инсайты при планировании коммуникации.' },
  { name: 'Технологии и процессы', y25: 1.90, y26: 3.67, cat: 2.17, color: C.blue,
    q: 'Как объединить данные об аудитории и работать с нужными сегментами?',
    tag: 'TECH & DATA', icon: 'tb:TbDatabaseCog', tagColor: C.teal, hColor: C.blue,
    h: 'DMP связывает данные с рекламной активацией',
    t: 'Развернули DMP-инфраструктуру и применили сегменты в медиа.\nСвязали аудиторные данные с персонализированными креативами.' },
  { name: 'Контент и креатив', y25: 2.30, y26: 3.10, cat: 2.50, color: C.orange,
    q: 'Как говорить с каждым сегментом о том, что важно именно ему?',
    tag: 'PERSONALIZATION', icon: 'tb:TbUser', tagColor: C.orange, hColor: C.crimson,
    h: '700+ баннеров, 6 брендов, 3 AI-видео',
    t: 'AI и CMP помогают масштабировать персонализированный контент\nи создавать варианты сообщений для проверки гипотез.' },
  { name: 'Измерения и аналитика', y25: 2.80, y26: 3.70, cat: 3.20, color: C.crimson,
    q: 'Какие рекламные решения действительно влияют на продажи?',
    tag: 'MEASUREMENT', icon: 'tb:TbChartBar', tagColor: C.crimson, hColor: C.crimson,
    h: 'Начали измерять влияние сегментов на продажи',
    t: 'Провели первый Sales Lift через Adriver / DMP / ВТБ.\nФормируем систему регулярной оценки бизнес-эффекта.' },
  { name: 'E-commerce', y25: 3.20, y26: 3.25, cat: 3.19, color: C.navy,
    q: 'Как встроить e-commerce в единую медийную стратегию бренда?',
    tag: 'E-COMMERCE', icon: 'tb:TbShoppingCart', tagColor: C.navy, hColor: C.navy,
    h: 'Проработали интеграцию e-commerce в стратегию',
    t: 'В 2026 году определили роль e-commerce в CJM и Comprehensive.\nПрактическое внедрение и креативы по воронке планируем на 2027 год.' },
];
ROWS.forEach((r) => { r.vs = Math.round((r.y26 - r.cat) * 100) / 100; });

const PLAQUE_TITLE = 'УГЛУБЛЯЕМ И РАСШИРЯЕМ ПОДХОД';
const PLAQUE_TEXT = 'Включаем e-commerce в CJM и развиваем регулярную оценку бизнес-эффекта';

function diamond(s, cx, cy, d, color) {
  s.s.addShape(s.shapes.diamond, { x: IN(cx - d / 2), y: IN(cy - d / 2), w: IN(d), h: IN(d), fill: { color },
    line: { color: C.white, width: PT(2) } });
}

// ============ Версия 1: как на картинке ============
function slideFaithful(d) {
  const s = d.slide({ title: TITLE });
  s.image('header_line_crimson.png', { x: 0, y: 187, w: 760, h: 5 });

  // шапки колонок и легенда
  s.text('ЗРЕЛОСТЬ 2025–2026', { x: 86, y: 208, w: 330, size: 22, bold: true, color: C.blue });
  s.text('ВОПРОСЫ ДЛЯ РАЗВИТИЯ', { x: 452, y: 208, w: 360, size: 22, bold: true, color: C.blue });
  s.text([{ text: '2026', options: {} }, { text: '  РЕШЕНИЯ И ДОСТИЖЕНИЯ', options: {} }],
    { x: 862, y: 204, w: 1000, size: 28, bold: true, color: C.crimson });
  const ly = 243;
  s.box({ x: 86, y: ly + 3, w: 18, h: 16, fill: MUTED, r: 0 });
  s.text('2025', { x: 110, y: ly, w: 60, size: 16, color: C.blueText });
  s.box({ x: 176, y: ly + 3, w: 18, h: 16, fill: C.blue, r: 0 });
  s.text('2026', { x: 200, y: ly, w: 60, size: 16, color: C.blueText });
  s.text('Шкала 0–5', { x: 266, y: ly, w: 110, size: 16, color: C.blueText });
  diamond(s, 386, ly + 11, 16, C.orange);
  s.text('Категория', { x: 400, y: ly, w: 110, size: 16, color: C.blueText });

  const ROW0 = 276;
  const RH = 115;
  const GAP = 10;
  const BX = 132;            // начало шкалы зрелости
  const BW = 200;            // 0…5
  const bx = (v) => BX + BW * v / 5;
  ROWS.forEach((r, i) => {
    const y = ROW0 + i * (RH + GAP);
    // левая карточка: зрелость + вопрос; правая — решение
    s.box({ x: 92, y, w: 748, h: RH, fill: C.white, stroke: C.line, sw: 1.5, r: 18 });
    s.box({ x: 852, y, w: 1010, h: RH, fill: C.cardTint, stroke: C.line, sw: 1.5, r: 18 });
    s.badge({ x: 58, y: y + RH / 2 - 29, d: 58, n: i + 1, color: r.color, size: 28 });

    s.text(r.name, { x: BX, y: y + 8, w: 300, size: 21, bold: true, lh: 1.0, color: C.blue });
    // столбики 2025 / 2026
    [[r.y25, MUTED, y + 38, false], [r.y26, C.blue, y + 58, true]].forEach(([v, col, yy, b]) => {
      s.box({ x: BX, y: yy, w: bx(v) - BX, h: 15, fill: col, r: 0 });
      s.text(fmt2(v), { x: bx(v) + 8, y: yy - 2, w: 60, size: 16, bold: true, lh: 1.0, color: b ? C.navy : C.blueText });
    });
    // шкала 0–5 с категорией
    const sy = y + 89;
    s.seg(BX, sy, BX + BW, sy, { color: C.line, width: 3 });
    s.text('0', { x: BX - 26, y: sy - 9, w: 18, size: 14, color: C.blueText, align: 'right' });
    s.text('5', { x: BX + BW + 6, y: sy - 9, w: 18, size: 14, color: C.blueText });
    diamond(s, bx(r.cat), sy, 16, C.orange);
    s.text(fmt2(r.cat), { x: bx(r.cat) - 30, y: sy + 8, w: 60, size: 15, bold: true, lh: 1.0, color: C.orange, align: 'center' });
    s.text(`+${fmt2(r.vs)}`, { x: 362, y: sy - 22, w: 80, size: 19, bold: true, lh: 1.0, color: GREEN });
    s.text('vs категория', { x: 362, y: sy, w: 90, size: 13, lh: 1.0, color: C.blueText });

    // вопрос
    s.text(r.q, { x: 452, y, w: 330, h: RH, size: 21, lh: 1.2, color: C.navy, valign: 'middle' });
    s.icon('tb:TbChevronRight', { x: 794, y: y + RH / 2 - 17, size: 34, color: C.cyan });

    // решение: плашка-тег + заголовок + текст
    const py = y + RH / 2 - 31;
    s.box({ x: 872, y: py, w: 212, h: 62, fill: r.tagColor, r: 12 });
    s.icon(r.icon, { x: 890, y: py + 14, size: 34, color: C.white });
    s.text(r.tag, { x: 934, y: py, w: 146, h: 62, size: r.tag.length > 12 ? 13 : 16, bold: true, color: C.white, valign: 'middle' });
    const hx = 1104;
    const hw = 1862 - 20 - hx;
    const hs = fitSize(typo(r.h), 28, 24, hw, 1, true);
    s.text(r.h, { x: hx, y: y + 12, w: hw, size: hs, bold: true, lh: 1.0, color: r.hColor });
    s.text(r.t, { x: hx, y: y + 52, w: hw, size: 18, lh: 1.22, color: C.navy });
  });

  // преимущество к категории
  const ay = ROW0 + 5 * (RH + GAP) + 2;
  s.text('ПРЕИМУЩЕСТВО К КАТЕГОРИИ', { x: 86, y: ay, w: 380, size: 21, bold: true, color: C.blue });
  s.vline(472, ay - 2, 30, C.line, 2);
  s.text('Технологии +1,50     Активация +0,80     Креатив +0,60', { x: 500, y: ay, w: 900, size: 21, bold: true, color: C.navy });

  // плашка 2027
  const py = 950;
  s.box({ x: 58, y: py, w: 1804, h: 84, fill: C.crimson, r: 22 });
  s.text('2027', { x: 92, y: py, w: 140, h: 84, size: 44, bold: true, color: C.white, valign: 'middle' });
  s.vline(252, py + 20, 44, C.white, 2);
  s.text(PLAQUE_TITLE, { x: 280, y: py + 12, w: 1500, size: 25, bold: true, lh: 1.0, color: C.white });
  s.text(PLAQUE_TEXT, { x: 280, y: py + 46, w: 1500, size: 19, lh: 1.0, color: C.white });
  s.notes('Comprehensive 2026: digital maturity · версия 1 — с сохранением визуала картинки');
}

// ============ Версия 2: переосмысление ============
// Одна таблица: направление + вопрос | гантель 2025 → 2026 на общей шкале 0–5 с отметкой категории | vs категория | решение 2026.
// Сверху — три итоговые цифры (средние — расчёт OMD), снизу — плашка 2027.
function slideRethink(d) {
  const s = d.slide({ title: TITLE });
  const avg = (k) => ROWS.reduce((a, r) => a + r[k], 0) / ROWS.length;
  const a25 = avg('y25');
  const a26 = avg('y26');
  const aCat = avg('cat');
  const ahead = ROWS.filter((r) => r.vs > 0).length;

  // итоговые цифры
  const K = [
    { v: `${fmt2(a26)}`, s: 'из 5', t: `средняя зрелость в 2026\n2025 — ${fmt2(a25)} · категория — ${fmt2(aCat)}`, c: C.blue },
    { v: `${ahead} из 5`, s: '', t: 'направлений выше категории', c: C.navy },
    { v: '+1,50', s: '', t: 'Технологии — главное преимущество к категории.\nАктивация +0,80 · Креатив +0,60', c: C.crimson },
  ];
  const kw = (1804 - 2 * 20) / 3;
  K.forEach((k, i) => {
    const x = 58 + i * (kw + 20);
    s.box({ x, y: 214, w: kw, h: 96, fill: k.c });
    const vw = textWidth(k.v, 54, true);
    s.text(k.v, { x: x + 26, y: 214, w: vw + 10, h: 96, size: 54, bold: true, color: C.white, valign: 'middle' });
    let tx = x + 26 + vw + 16;
    if (k.s) { s.text(k.s, { x: tx - 6, y: 252, w: 70, size: 22, bold: true, color: C.white }); tx += 62; }
    s.text(k.t, { x: tx, y: 214, w: x + kw - 20 - tx, h: 96, size: 17, lh: 1.2, color: C.white, valign: 'middle' });
  });

  // таблица
  const T = { x: 58, y: 328, w: 1804, h: 594 };
  s.card({ x: T.x, y: T.y, w: T.w, h: T.h, sw: 2 });
  const COL = { name: 86, axis0: 528, axis1: 912, vs: 1000, sol: 1116 };
  // полная шкала 0–5 (по просьбе Романа)
  const A0 = 0;
  const A1 = 5;
  const ax = (v) => COL.axis0 + (COL.axis1 - COL.axis0) * (v - A0) / (A1 - A0);
  const HY = T.y + 20;
  s.text('НАПРАВЛЕНИЕ И ВОПРОС ДЛЯ РАЗВИТИЯ', { x: COL.name, y: HY, w: 420, size: 16, bold: true, color: C.blue });
  s.text('ЗРЕЛОСТЬ 2025 → 2026 (ШКАЛА 0–5)', { x: COL.axis0 - 10, y: HY, w: 440, size: 16, bold: true, color: C.blue });
  s.text('VS КАТЕГОРИЯ', { x: COL.vs - 6, y: HY, w: 120, size: 16, bold: true, color: C.blue });
  s.text('2026 · РЕШЕНИЯ И ДОСТИЖЕНИЯ', { x: COL.sol, y: HY, w: 700, size: 16, bold: true, color: C.crimson });
  // легенда и деления шкалы
  const LY = HY + 30;
  s.circle({ x: COL.axis0 - 4, y: LY + 2, d: 14, fill: MUTED });
  s.text('2025', { x: COL.axis0 + 16, y: LY - 1, w: 60, size: 15, color: C.blueText });
  s.circle({ x: COL.axis0 + 84, y: LY + 1, d: 16, fill: C.blue });
  s.text('2026', { x: COL.axis0 + 106, y: LY - 1, w: 60, size: 15, color: C.blueText });
  diamond(s, COL.axis0 + 182, LY + 9, 15, C.orange);
  s.text('категория', { x: COL.axis0 + 196, y: LY - 1, w: 110, size: 15, color: C.blueText });

  const R0 = T.y + 100;
  const RH = (T.y + T.h - 14 - R0) / 5;
  [0, 1, 2, 3, 4, 5].forEach((v) => {
    s.seg(ax(v), R0 - 2, ax(v), R0 + RH * 5 - 10, { color: v === 0 ? C.line : 'E6EEF8', width: v === 0 ? 1.5 : 1.25 });
    s.text(String(v), { x: ax(v) - 15, y: R0 - 22, w: 30, size: 14, color: C.blueText, align: 'center' });
  });

  ROWS.forEach((r, i) => {
    const y = R0 + i * RH;
    if (i > 0) s.hline(T.x + 24, y - 1, T.w - 48, C.line, 1.25);
    // направление + вопрос
    s.badge({ x: COL.name, y: y + 14, d: 38, n: i + 1, color: r.color, size: 20 });
    s.text(r.name, { x: COL.name + 52, y: y + 18, w: 360, size: 21, bold: true, lh: 1.0, color: C.navy });
    s.text(r.q, { x: COL.name + 52, y: y + 46, w: 340, size: 16, lh: 1.2, color: C.blueText });
    // гантель
    const cy = y + RH / 2 - 4;
    s.seg(ax(r.y25), cy, ax(r.y26), cy, { color: 'C9DCF2', width: 7 });
    diamond(s, ax(r.cat), cy, 18, C.orange);
    s.circle({ x: ax(r.y25) - 9, y: cy - 9, d: 18, fill: MUTED });
    s.circle({ x: ax(r.y26) - 11, y: cy - 11, d: 22, fill: C.blue });
    s.text(fmt2(r.y25), { x: ax(r.y25) - 70, y: cy - 10, w: 56, size: 15, lh: 1.0, color: C.blueText, align: 'right' });
    s.text(fmt2(r.y26), { x: ax(r.y26) + 16, y: cy - 12, w: 70, size: 19, bold: true, lh: 1.0, color: C.navy });
    s.text(fmt2(r.cat), { x: ax(r.cat) - 30, y: cy + 14, w: 60, size: 14, bold: true, lh: 1.0, color: C.orange, align: 'center' });
    // vs категория
    s.text(`+${fmt2(r.vs)}`, { x: COL.vs - 6, y: cy - 14, w: 110, size: 24, bold: true, lh: 1.0, color: GREEN });
    // решение 2026
    s.icon(r.icon, { x: COL.sol, y: y + RH / 2 - 26, size: 52, color: C.white, circle: r.tagColor });
    const sx = COL.sol + 70;
    const sw = T.x + T.w - 24 - sx;
    s.text(r.tag, { x: sx, y: y + 12, w: sw, size: 13, bold: true, lh: 1.0, color: r.tagColor });
    s.text(r.h, { x: sx, y: y + 30, w: sw, size: 21, bold: true, lh: 1.0, color: r.hColor === C.cyan ? C.blue : r.hColor });
    s.text(r.t, { x: sx, y: y + 58, w: sw, size: 15, lh: 1.2, color: C.navy });
  });

  s.principle({ x: 58, w: 1804, icon: 'tb:TbTrendingUp', label: '2027', text: `**${PLAQUE_TITLE[0]}${PLAQUE_TITLE.slice(1).toLowerCase()}:** ${PLAQUE_TEXT.charAt(0).toLowerCase()}${PLAQUE_TEXT.slice(1)}` });
  s.footnote('Средние значения и «5 из 5» — расчёт OMD по данным слайда; vs категория = 2026 − категория', { y: 1036 });
  s.notes('Comprehensive 2026: digital maturity · версия 2 — переосмысление: одна таблица, гантели зрелости на общей шкале 0–5, итоговые цифры сверху');
}

module.exports = { slideFaithful, slideRethink };

if (require.main === module) {
  (async () => {
    const d = new Deck({ title: 'Comprehensive 2026: достижения и динамика Digital Maturity' });
    slideFaithful(d);
    slideRethink(d);
    await d.save(process.argv[2] ? path.resolve(process.argv[2]) : OUT);
  })();
}
