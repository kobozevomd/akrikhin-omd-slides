// Слайд «Comprehensive 2027: план развития» — по картинке Романа (13.10.2026), в дизайн-системе.
// Три колонки (2026 достижения → что улучшаем → 2027 решения) × 6 строк, кружки-иконки, шевроны между колонками.
//   node decks/plan_razvitiya.js → ../Comprehensive_2027_план_развития.pptx
// Модуль также экспортирует build(d) — чтобы при необходимости вставить слайд в основную деку.
const path = require('path');
const { Deck, C, textWidth, typo } = require('../lib/akrikhin');

const OUT = path.join(__dirname, '..', '..', 'Comprehensive_2027_план_развития.pptx');

const ROW_COLORS = [C.cyan, C.teal, C.orange, C.crimson, C.green, C.blue];

const COLS = [
  {
    year: '2026', yearColor: C.blue, head: 'ДОСТИЖЕНИЯ', sub: 'Создали основу для развития', titleColored: true,
    colors: ROW_COLORS,
    rows: [
      ['tb:TbBrain', 'AI CJM', 'Систематизировали CJM и сегменты.\nПрименяем инсайты в стратегиях брендов'],
      ['tb:TbDatabaseCog', 'TECH & DATA', 'Развернули DMP-инфраструктуру\nи активировали сегменты в медиа'],
      ['tb:TbUser', 'PERSONALIZATION', '700+ баннеров для 6 брендов\nи 3 AI-видео на базе AI + CMP'],
      ['tb:TbChartBar', 'MEASUREMENT', 'Провели Sales Lift в спринт-активации\nАзелик для валидации бизнес-результата'],
      ['tb:TbBook', 'BENCHMARKS', 'Формируются PlayBooks и библиотека\nбенчмарок'],
      ['tb:TbShoppingCart', 'E-COMMERCE', 'Определили роль e-com в CJM\nна этапе стратегического планирования'],
    ],
  },
  {
    year: '', head: 'ЧТО УЛУЧШАЕМ', sub: 'Задачи следующего этапа', titleColored: false,
    colors: ROW_COLORS,
    rows: [
      ['tb:TbBrain', 'Точность гипотез', 'Проверять гипотезы до запуска,\nчтобы снижать риск потери инвестиций'],
      ['tb:TbSettings', 'Гибкость активации', 'Выбирать технологии под задачу бренда\nбез зависимости от DMP-решений'],
      ['tb:TbTarget', 'Единый путь к покупке', 'Связать креатив, посадочную страницу\nи этап покупки для повышения конверсии'],
      ['tb:TbChartBar', 'Регулярный бизнес-скоринг', 'Оценивать вклад сегментов в продажи\nна регулярной основе'],
      ['tb:TbBulb', 'Перенос успешных практик', 'Использовать аналитику в новых решениях\nи масштабировать опыт между брендами'],
      ['tb:TbLink', 'Интеграция в общую модель', 'Связать медиа, онлайн-аптеки, маркетплейсы\nи креативы на всех этапах CJM потребителя'],
    ],
  },
  {
    year: '2027', yearColor: C.crimson, head: 'РЕШЕНИЯ', sub: 'Действия для усиления бизнес-результата', titleColored: true,
    colors: [C.cyan, C.teal, C.orange, C.crimson, C.navy, C.blue],
    rows: [
      ['tb:TbSpeakerphone', 'AI CJM + OMD Voice', 'Валидируем сегменты, сообщения\nи Tone of Voice до медиа-активации'],
      ['tb:TbAdjustmentsHorizontal', 'Адаптированный стек активации', 'Подбираем AI DSP под задачу бренда,\nуточняем аудитории по результатам тестов'],
      ['tb:TbFileText', 'Контент + путь пользователя', 'CMP, AI-видео, персональные LP. Связываем\nSEO / GEO / AEO, ORM, внешние публикации и Paid Search'],
      ['tb:TbEye', 'Ранние сигналы + бизнес-эффект', 'Brand Attention Monitoring, media / post-click,\nBLS и Sales Lift после сезонных пиков'],
      ['tb:TbHierarchy', 'BI + библиотека решений', 'Развиваем дашборд, формируем Golden Rules\nи PlayBooks для новых брендов и флайтов'],
      ['tb:TbShoppingCart', 'E-commerce в Comprehensive', 'От стратегической проработки в 2026 году\nк персонализированной активации в 2027 году'],
    ],
  },
];

// Геометрия (px слайда 1920×1080)
const GAP = 40;                  // зазор между колонками — в нём шевроны
const CARD_PAD = 16;             // внутренний отступ колонки
const ROW_PAD = 14;              // отступ внутри строки
const CIRCLE = 74;               // кружок-иконка
const TEXT_GAP = 18;             // от кружка до текста
const TOP = 214;
const BOTTOM = 1012;
const ROWS_TOP = 322;
const ROW_GAP = 11;
const ROW_H = Math.floor((BOTTOM - 17 - ROWS_TOP - ROW_GAP * 5) / 6);
const TITLE = 22;
const DESC = 18;
const CHROME = CARD_PAD * 2 + ROW_PAD * 2 + CIRCLE + TEXT_GAP;

// Ширины колонок — под самую длинную строку описания в каждой, остаток делим поровну
function columnWidths() {
  const need = COLS.map((c) => Math.max(...c.rows.flatMap((r) => r[2].split('\n').map((l) => textWidth(typo(l), DESC, false))),
    ...c.rows.map((r) => textWidth(r[1], TITLE, true))) / 0.97 + CHROME);
  const spare = 1804 - GAP * 2 - need.reduce((a, b) => a + b, 0);
  if (spare < 0) throw new Error('Колонки не помещаются: уменьшите DESC');
  return need.map((w) => Math.floor(w + spare / 3));
}

function build(d) {
  const s = d.slide({ title: 'COMPREHENSIVE 2027: ПЛАН РАЗВИТИЯ' });
  // тонкая малиновая линия под шапкой, как на исходнике
  s.image('header_line_crimson.png', { x: 0, y: 187, w: 760, h: 5 });

  const widths = columnWidths();
  let x = 58;
  const xs = widths.map((w) => { const x0 = x; x += w + GAP; return x0; });

  COLS.forEach((col, ci) => {
    const cx = xs[ci];
    const cw = widths[ci];
    s.card({ x: cx, y: TOP, w: cw, h: BOTTOM - TOP, tint: true, sw: 2 });
    // шапка колонки: «2026  ДОСТИЖЕНИЯ»
    const head = col.year
      ? [{ text: col.year, options: { color: col.yearColor } }, { text: '   ' + col.head, options: { color: C.navy } }]
      : [{ text: col.head, options: { color: C.navy } }];
    s.text(head, { x: cx + CARD_PAD + 10, y: TOP + 22, w: cw - CARD_PAD * 2 - 20, size: 34, bold: true, lh: 1.1 });
    s.text(col.sub, { x: cx + CARD_PAD + 10, y: TOP + 66, w: cw - CARD_PAD * 2 - 20, size: 21, color: C.navy });

    col.rows.forEach(([icon, title, desc], ri) => {
      const ry = ROWS_TOP + ri * (ROW_H + ROW_GAP);
      const rx = cx + CARD_PAD;
      const rw = cw - CARD_PAD * 2;
      const color = col.colors[ri];
      s.box({ x: rx, y: ry, w: rw, h: ROW_H, fill: C.white, stroke: C.line, sw: 1.5, r: 14 });
      s.icon(icon, { x: rx + ROW_PAD, y: ry + (ROW_H - CIRCLE) / 2, size: CIRCLE, color: C.white, circle: color });
      const tx = rx + ROW_PAD + CIRCLE + TEXT_GAP;
      const tw = rw - (tx - rx) - ROW_PAD;
      const block = TITLE + 6 + 2 * DESC * 1.22;
      const ty = ry + (ROW_H - block) / 2;
      s.text(title, { x: tx, y: ty, w: tw, size: TITLE, bold: true, lh: 1.0, color: col.titleColored ? color : C.navy });
      s.text(desc, { x: tx, y: ty + TITLE + 6, w: tw, size: DESC, lh: 1.22, color: C.navy });

      // шеврон к следующей колонке — по центру строки, в зазоре
      if (ci < COLS.length - 1) {
        const gx = cx + cw + GAP / 2;
        s.icon('tb:TbChevronRight', { x: gx - 17, y: ry + ROW_H / 2 - 17, size: 34, color: C.cyan });
      }
    });
  });
  s.notes('Comprehensive 2027: план развития — по картинке Романа, 13.10.2026');
  return s;
}

module.exports = { build };

if (require.main === module) {
  (async () => {
    const d = new Deck({ title: 'Comprehensive 2027: план развития' });
    build(d);
    await d.save(process.argv[2] ? path.resolve(process.argv[2]) : OUT);
  })();
}
