// Азелик · стратегия 2027 — часть G: слайды исходника 46–52 (этап SPRINT, CTV, AI-креативы, AI-таргетинг).
// 46 — Sales Lift по сегментам (скрытый; методология + uplift + таблица приоритетов),
// 47 — расширение ЦА до 25–34 (скрытый; живой график CR «Где купить» + таблица рекомендаций H2),
// 48 — AI-креативы 2027 (скрытый; гипотеза → A/B-тест → статус, 5 сегментов с превью кадров),
// 49 — CTV 2026 → 2027 (было → стало), 50 — пул поставщиков CTV (живой график VTR/VA + рейтинг),
// 51 — CTV → eTRP (скрытый; эстимация, формула, расчёт, output для TTL-video),
// 52 — AI-таргетинг (картинка во весь слайд → живой текст: AI DMP → AI DSP → 2027).
const path = require('path');
const { C, columns, countLines, textWidth, typo, tr, balanceTitle } = require('../../../lib/akrikhin');
const V = require('../../variants/common'); // TOP, MUTED, legend
const A = require('./common');              // MEDIA, CROPS, stageTag

const TOP = V.TOP;        // 221
const BOT = 1005;         // низ контента без плашки
const MUTED_TXT = '6E86AD';

// ---------- Локальные хелперы ----------
const view = (t) => typo(tr(String(t))).replace(/\*\*|\[\[|\]\]/g, '');
const measure = (t, w, size = 16, bold = false, lh = 1.2) => Math.round(countLines(view(t), size, w, bold) * size * lh);
const widthOf = (t, size, bold = false) => Math.ceil(textWidth(view(t), size, bold));
// Ширина блока, при которой текст занимает столько же строк, но строки ровнее — без висящего последнего слова
const evenW = (t, w, size, bold = false) => {
  const n = countLines(view(t), size, w, bold);
  if (n < 2) return w;
  let lo = w * 0.4;
  let hi = w;
  while (hi - lo > 1) { const m = (lo + hi) / 2; if (countLines(view(t), size, m, bold) <= n) hi = m; else lo = m; }
  return Math.min(w, Math.ceil(hi) + 4);
};
const sum = (a) => a.reduce((x, y) => x + y, 0);
// смешение цветов: k = доля второго цвета
const mix = (a, b, k) => [0, 2, 4].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - k) + parseInt(b.slice(i, i + 2), 16) * k)
  .toString(16).padStart(2, '0')).join('').toUpperCase();
const GREEN_T = mix('FFFFFF', C.green, 0.16);
const ORANGE_T = mix('FFFFFF', C.orange, 0.16);
const PINK_T = mix('FFFFFF', C.crimson, 0.1);
// высота строки нативной таблицы по самому длинному тексту (поля ячейки ~14 px по бокам, 8 px сверху/снизу)
const cellH = (txt, w, size, bold) => countLines(view(txt), size, w - 30, bold) * size * 1.2 + 18;
const rowsH = (rows, colW, size) => rows.map((r, ri) => Math.max(...r.map((c, ci) => {
  const cell = typeof c === 'object' ? c : { text: c };
  return cellH(cell.text, colW[ci], size, ri === 0 || !!cell.bold);
})));

// КАПС-метка раздела (как заголовки блоков исходника)
const label = (s, text, x, y, w, color = C.blue, size = 20) => s.label(text, { x, y, w, color, size });

// Номер-кружок + метка в одну строку (шапка блока «1. Почему CTV»)
function numHead(s, { x, y, w, n, text, color = C.blue }) {
  s.badge({ x, y, d: 40, n, color, size: 20 });
  s.label(text, { x: x + 54, y: y + 9, w: w - 54, color: C.navy, size: 22 });
  return 40;
}

module.exports = {
  // ===================== 46. Sales Lift: от тестирования сегментов к управлению инвестициями (скрытый) =====================
  46: (d) => {
    const s = d.slide({
      title: 'От тестирования сегментов к управлению инвестициями: используем Sales Lift для выбора приоритетных аудиторий',
      subtitle: 'В H1’26 проверили вклад сегментов в бизнес-результат, перераспределили фокус в рамках Sprint 2 2026 и продолжаем применять подход Sales Lift для оптимизации коммуникации в 2027 году',
    });
    s.s.hidden = true;
    A.stageTag(s, 'SPRINT');
    const H1 = 172;

    // --- методология экстраполяции + базовый коэффициент ---
    {
      const M = { x: 58, w: 1000 };
      s.card({ x: M.x, y: TOP, w: M.w, h: H1 });
      const px = M.x + 32;
      const tw = 650;
      label(s, 'Методология экстраполяции Sales Lift', px, TOP + 26, tw);
      let y = TOP + 26 + 20 + 16;
      y += s.text('Сравнили объем продаж по данным ВТБ и внутренним данным Акрихина', { x: px, y, w: tw, size: 18 }) + 6;
      s.text('Доля ВТБ в продажах составила 15,3%; базовый коэффициент пересчёта\u00a0=\u00a0×6,53', { x: px, y, w: tw, size: 18 });
      const vx = px + tw + 22;
      s.vline(vx, TOP + 26, H1 - 52);
      const kx = vx + 26;
      const kw = M.x + M.w - 28 - kx;
      s.text('×6,53', { x: kx, y: TOP + 16, w: kw, size: 56, bold: true, lh: 1.1, color: C.navy });
      s.text('базовый коэффициент экстраполяции результатов', { x: kx, y: TOP + 16 + 66, w: kw, h: H1 - 16 - 66 - 12, size: 17, bold: true, color: C.navy, fit: true, minSize: 15 });
    }

    // --- uplift по конверсии: рк и post-период ---
    {
      const x0 = 1081;
      const tw = (1862 - x0 - 23) / 2;
      [
        { x: x0, color: C.blue, v: '+5,8%', k: 'рк vs pre-период' },
        { x: x0 + tw + 23, color: C.crimson, v: '+25%', k: 'post-период vs pre-период' },
      ].forEach((t) => {
        s.box({ x: t.x, y: TOP, w: tw, h: H1, fill: t.color });
        s.text(t.v, { x: t.x + 26, y: TOP + 14, w: tw - 52, size: 54, bold: true, lh: 1.1, color: C.white });
        const kh = s.text(t.k, { x: t.x + 26, y: TOP + 14 + 64, w: tw - 52, size: 18, bold: true, lh: 1.1, color: C.white, fit: true, maxLines: 1, minSize: 15 });
        s.text('up-lift по конверсии покупателя тестовой группы к контрольной', { x: t.x + 26, y: TOP + 14 + 64 + kh + 6, w: tw - 52, h: H1 - 14 - 64 - kh - 6 - 10, size: 16, lh: 1.15, color: C.white, fit: true, minSize: 14 });
      });
    }

    // --- таблица: прирост уникальных покупателей по сегментам ---
    const ly = TOP + H1 + 26;
    label(s, 'Прирост уникальных покупателей в post-периоде vs pre-периоде', 58, ly, 1500);
    const ty = ly + 20 + 14;
    const G = (t) => ({ text: t, fill: GREEN_T, color: C.green, bold: true, align: 'center' });
    const N = (t) => ({ text: t, align: 'center' });
    const SEG = (t) => ({ text: t, bold: true, color: C.navy });
    const rows = [
      ['Сегмент', 'CTR', 'CR%', 'Post vs pre*', 'Приоритет', 'Комментарий'],
      [SEG('Ж 18–25, новые средства'), N('0,20%'), N('0,45%'), G('+111%'), { text: '2', bold: true, color: C.navy, align: 'center' },
        'Сохраняем в сплите: большой сегмент, отложенный эффект и потенциал с учетом корректировки креатива'],
      [SEG('Social girl 18–25'), N('0,19%'), G('0,59%'), G('+169%'), { text: '1', bold: true, color: C.green, fill: GREEN_T, align: 'center' },
        'Один из ключевых сегментов для Sprint 2: высокий post-click и сильный post-period uplift'],
      [SEG('Switch Skinoclear'), N('0,19%'), N('0,32%'), G('+800%'), { text: '3', bold: true, color: C.navy, align: 'center' },
        '+800% — максимальный uplift, но на малой базе; сегмент используем как defense/switch-триггер, а не как основной масштабный growth-сегмент'],
      [SEG('М 18–25 проблемная кожа'), N('0,19%'), N('0,43%'), G('+51%'), { text: '4', bold: true, color: C.navy, align: 'center' },
        'Широкий мужской сегмент для дообучения через верх воронки и awareness-коммуникацию'],
      [SEG('М 18–28 спорт / уход'), N('0,21%'), G('0,68%'), { text: '—', color: MUTED_TXT, align: 'center' }, { text: 'RELOCATE', bold: true, color: C.orange, fill: ORANGE_T, align: 'center' },
        'Сегмент показал сильный post-click интерес, но не подтвердил устойчивый business-effect в Sales Lift. Поэтому не ведем его отдельным закупочным сегментом, а коммуницируем через широкую аудиторию М 18–25 проблемная кожа'],
      [SEG('Студенты 18–25'), N('0,19%'), N('0,07%'), { text: '—', color: MUTED_TXT, align: 'center' }, { text: 'STOP', bold: true, color: C.crimson, fill: PINK_T, align: 'center' },
        'Был отключен в ходе рк; не имеет весомой базы для SL аналитики. Эффект лучше собирать внутри более широких сегментов того же соц-дема'],
    ];
    const size = 16;
    const colW = [272, 104, 104, 150, 150];
    colW.push(1804 - sum(colW));
    const rh = rowsH(rows, colW, size).map((h, i) => (i === 0 ? Math.max(h, 44) : Math.max(h, 50)));
    const total = sum(rh);
    if (total > BOT - ty) s.warn('таблица', 'Sales Lift по сегментам', `высота ~${Math.round(total)}px больше ${BOT - ty}px`);
    const k = Math.min(1.5, (BOT - ty) / total);
    s.table(rows, { x: 58, y: ty, w: 1804, colW, rowH: rh.map((h) => h * k), size });
    s.footnote('* Uplift по сегментам — прирост количества уникальных покупателей post-периода относительно pre-периода; «—» означает отсутствие прироста или базы для расчёта', { w: 1730 });
  },

  // ===================== 47. Sprint 1: аудитория 25–34 входит в ядро (скрытый) =====================
  47: (d) => {
    const s = d.slide({
      title: 'Анализ Sprint 1 выявил потенциал расширения ЦА: аудитория 25–34 включается в ядро коммуникации в 2027',
      subtitle: 'Сравнение результатов внутри сегментов показало более высокий потенциал старшей возрастной группы — поэтому в H2’26 расширили соцдем-фокус и закрепили 18–34 как основу Sprint-активаций и в 2027 году',
    });
    s.s.hidden = true;
    A.stageTag(s, 'SPRINT');
    const L = { x: 58, w: 800 };
    const R = { x: 881, w: 981 };
    const PAD = 32;

    // --- слева: общий лернинг ---
    const lx = L.x + PAD;
    const lw = L.w - 2 * PAD;
    const BUL = [
      '25–34 системно лучше конвертируется в женских сегментах и сегменте пользователей с негативным опытом Skinoclear',
      '18–24 релевантна для верхнего контакта, но слабее по purchase-сигналу',
    ];
    const bulH = sum(BUL.map((b) => measure(b, lw - 22, 18))) + 8 * (BUL.length - 1);
    const H1 = 26 + 20 + 22 + 70 + 6 + 40 + 22 + 20 + 24 + 12 + bulH + 26;
    s.card({ x: L.x, y: TOP, w: L.w, h: H1 });
    let y = TOP + 26;
    label(s, 'Общий лернинг по 4 сегментам', lx, y, lw);
    y += 20 + 22;
    const SW = 300;
    s.text('0,47%', { x: lx, y, w: 230, size: 64, bold: true, lh: 1.1, color: C.crimson });
    s.text('vs', { x: lx + 236, y: y + 24, w: 50, size: 28, bold: true, lh: 1.0, color: MUTED_TXT });
    s.text('0,17%', { x: lx + SW, y, w: 230, size: 64, bold: true, lh: 1.1, color: MUTED_TXT });
    y += 70 + 6;
    s.text('CR 25–34 в «Где купить»', { x: lx, y, w: SW - 30, size: 17, bold: true, color: C.navy });
    s.text('CR 18–24 в «Где купить»', { x: lx + SW, y, w: SW - 30, size: 17, bold: true, color: C.navy });
    y += 40 + 22;
    s.hline(lx, y, lw);
    y += 20;
    s.text('Что это значит', { x: lx, y, w: lw, size: 20, bold: true, lh: 1.1, color: C.navy });
    y += 24 + 12;
    s.bullets(BUL, { x: lx, y, w: lw, size: 18, gap: 8 });

    // --- справа: живой график CR «Где купить» по сегментам ---
    s.card({ x: R.x, y: TOP, w: R.w, h: H1 });
    const rx = R.x + PAD;
    const rw = R.w - 2 * PAD;
    label(s, 'CR «Где купить»: 25–34 сильнее 18–24', rx, TOP + 26, rw - 300);
    V.legend(s, R.x + R.w - PAD - 300, TOP + 24, [[V.MUTED, '18–24'], [C.crimson, '25–34']], { dir: 'row', gap: 150, size: 18 });
    const cats = ['Ж 18–22', 'Social girl', 'М 18–25', 'Skinoclear'];
    const v1824 = [0.00145260864302143, 0.00176879343019583, 0.000705716302046577, 0.00163429505311459];
    const v2534 = [0.0045645840077695, 0.0047179702243657, 0.00147783251231527, 0.00493530745631586];
    const cy = TOP + 26 + 20 + 22;
    s.chart('col', [
      { name: '18–24', labels: cats, values: v1824 },
      { name: '25–34', labels: cats, values: v2534 },
    ], { x: rx, y: cy, w: rw, h: TOP + H1 - 18 - cy, colors: [V.MUTED, C.crimson], legend: false, format: '0.00%',
      labelSize: 17, axisSize: 17, gap: 70, overlap: -8, labelBold: true });

    // --- снизу: рекомендации по соц-дем группам в H2 ---
    const ly = TOP + H1 + 26;
    label(s, 'Рекомендации по доуточнению соц-дем групп в H2', 58, ly, 1500);
    const ty = ly + 20 + 14;
    const SEG = (t) => ({ text: t, bold: true, color: C.navy });
    const REC = (t) => ({ text: t, fill: C.cardTint, color: C.navy });
    const rows = [
      ['Сегмент', 'Что показал Sprint 1', 'Рекомендация H2'],
      [SEG('Ж 18–22\n«новые средства»'), '**CR 0,46% (25–34)** vs 0,15% (18–24)\n25–34 дает более высокий CR в действие', REC('Расширить перформанс-ядро до **Ж 18–34**')],
      [SEG('Ж 18–25\nSocial girl'), '**CR 0,47% (25–34)** vs 0,18% (18–24)\n25–34 дает более высокий CR в действие', REC('Расширить перформанс-ядро до **Ж 18–34**')],
      [SEG('М 18–25\nпроблемная кожа'), '**CR 0,15% (25–34)** vs 0,07% (18–24)\n25–34 дает более высокий CR в действие', REC('Тестировать **М 18–34** как perf-гипотезу')],
      [SEG('МЖ 18–25\nнегативный опыт Skinoclear'), '**CR 0,49% (25–34)** vs 0,16% (18–24)\nсамый высокий результат среди сегментов 25–34', REC('Расширить перформанс-ядро до **МЖ 18–34**')],
    ];
    const size = 17;
    const colW = [420, 760, 624];
    const lines = (t, w, b) => t.split('\n').reduce((a, p) => a + countLines(view(p), size, w - 30, b), 0);
    const rh = rows.map((r, ri) => Math.max(ri === 0 ? 44 : 56, ...r.map((c, ci) => {
      const cell = typeof c === 'object' ? c : { text: c };
      return lines(cell.text, colW[ci], ri === 0 || !!cell.bold) * size * 1.2 + 18;
    })));
    const total = sum(rh);
    if (total > BOT - ty) s.warn('таблица', 'рекомендации H2', `высота ~${Math.round(total)}px больше ${BOT - ty}px`);
    const k = Math.min(1.4, (BOT - ty) / total);
    s.table(rows, { x: 58, y: ty, w: 1804, colW, rowH: rh.map((h) => h * k), size });
  },

  // ===================== 48. AI-креативы 2027 (скрытый) =====================
  48: (d) => {
    const s = d.slide({
      title: 'AI-креативы Азелика 2027: масштабируем comprehensive-персонализацию без роста стоимости продакшена',
      subtitle: 'A/B-тест показал: AI-ролики дают сопоставимый результат с роликами классического продакшена — это открывает возможность масштабировать сегментированные коммуникации',
    });
    s.s.hidden = true;
    A.stageTag(s, 'SPRINT');
    const PAD = 30;
    const GAP = 44;                         // зазор под ► между блоками
    const H = { x: 58, w: 500 };
    const T = { x: H.x + H.w + GAP, w: 680 };
    const S = { x: T.x + T.w + GAP, w: 1862 - (T.x + T.w + GAP) };

    // высота верхнего ряда — по гипотезе и таблице
    const HYP = '**Персонализированные AI-ролики** должны сильнее **вовлекать** аудиторию и давать дополнительный эффект **аплифта** по бренд-метрикам — прежде всего по **рассмотрению бренда при покупке**.';
    const hypH = measure(HYP, H.w - 2 * PAD, 21);
    const size = 18;
    const colW = [268, 176, 176];
    const rows = [
      ['Сегмент', 'AI', 'Не AI'],
      [{ text: 'Скиноклир 18–34\nнегативный опыт', bold: true, color: C.navy },
        '**77%** VTR\n**0,59%** CTR\n**0,34%** CR', '**77%** VTR\n**0,58%** CTR\n**0,34%** CR'],
      [{ text: 'М 18–34\nпроблемная кожа', bold: true, color: C.navy },
        '**76%** VTR\n**0,58%** CTR\n**0,33%** CR', '**76%** VTR\n**0,58%** CTR\n**0,34%** CR'],
    ];
    const rh = [42, 3 * size * 1.2 + 20, 3 * size * 1.2 + 20];
    const H1 = Math.max(26 + 20 + 18 + hypH + 28, 26 + 20 + 18 + sum(rh) + 26);

    // --- гипотеза ---
    s.card({ x: H.x, y: TOP, w: H.w, h: H1 });
    label(s, 'Гипотеза', H.x + PAD, TOP + 26, H.w - 2 * PAD);
    s.text(HYP, { x: H.x + PAD, y: TOP + 26 + 20 + 18, w: H.w - 2 * PAD, size: 21, color: C.blueText });
    s.chevron({ cx: H.x + H.w + GAP / 2, cy: TOP + H1 / 2 });

    // --- A/B-тест ---
    s.card({ x: T.x, y: TOP, w: T.w, h: H1 });
    label(s, 'A/B-тест: AI vs классический продакшн', T.x + PAD, TOP + 26, T.w - 2 * PAD);
    s.table(rows, { x: T.x + PAD, y: TOP + 26 + 20 + 18, w: T.w - 2 * PAD, colW, rowH: rh, size });
    s.chevron({ cx: T.x + T.w + GAP / 2, cy: TOP + H1 / 2 });

    // --- статус: вывод теста ---
    s.box({ x: S.x, y: TOP, w: S.w, h: H1, fill: C.crimson, r: 25 });
    s.icon('tb:TbCircleCheck', { x: S.x + PAD, y: TOP + 22, size: 34, color: C.white });
    s.label('Статус', { x: S.x + PAD + 46, y: TOP + 29, w: S.w - 2 * PAD - 46, color: C.white, size: 20 });
    let y = TOP + 26 + 20 + 26;
    y += s.text('**Доказали:** AI-ролики не уступают классическому продакшену по медийным метрикам', { x: S.x + PAD, y, w: S.w - 2 * PAD, size: 21, color: C.white }) + 22;
    s.hline(S.x + PAD, y, S.w - 2 * PAD, 'F59AB0', 1.5);
    y += 22;
    s.text('**Следующий шаг:** BLS покажет влияние персонализации на бренд-метрики', { x: S.x + PAD, y, w: S.w - 2 * PAD, size: 21, color: C.white });

    // --- аудиторные сегменты 2027 + превью кадров AI-роликов ---
    const ly = TOP + H1 + 28;
    label(s, 'Аудиторные сегменты 2027', 58, ly, 900, C.blue, 22);
    const lw = widthOf(tr('Аудиторные сегменты 2027').toUpperCase(), 22, true);
    // подписи исходника: «Сегмент ЦА» (к списку сегментов) и «Превью кадров» (к ленте кадров) — в карточках они вместе
    const sw1 = widthOf('Сегмент ЦА', 20) + 4;
    s.text('Сегмент ЦА', { x: 58 + lw + 24, y: ly + 1, w: sw1, size: 20, lh: 1.0, color: MUTED_TXT });
    s.text('·', { x: 58 + lw + 24 + sw1 + 4, y: ly + 1, w: 16, size: 20, lh: 1.0, color: MUTED_TXT, align: 'center' });
    s.text('Превью кадров', { x: 58 + lw + 24 + sw1 + 24, y: ly + 1, w: 400, size: 20, lh: 1.0, color: MUTED_TXT });
    const SEGS = [
      { n: 'Сегмент 1', color: C.purple, img: 'g_48_seg1.png', t: 'Ж 18–34 любящие пробовать новые средства', q: '«Хочу результат без побочек»' },
      { n: 'Сегмент 2', color: C.orange, img: 'g_48_seg2.png', t: 'Ж 18–34 Social girl, маскирующие кожу', q: '«Хочу перейти на более легкий макияж, улучшим качество кожи»' },
      { n: 'Сегмент 3', color: C.blue, img: 'g_48_seg3.png', t: 'Все 18–34 негативный опыт Скиноклир', q: '«Не могу длительно использовать другие продукты из-за сухости кожи»' },
      { n: 'Сегмент 4', color: C.green, img: 'g_48_seg4.png', t: 'М 18–34 проблемная кожа', q: '«Мне нужно простое и быстрое решение, чтобы не разбираться в сложных схемах нанесения»' },
      { n: 'Сегмент 5', color: C.cyan, img: 'g_48_seg5.png', t: 'Ж 18–34 чувствительная кожа', q: '«Когда кожа реагирует — особенно важен комфортный уход»' },
    ];
    const cols = columns(5);
    const cy = ly + 22 + 18;
    const IP = 14;
    // названия сегментов — разной длины: цитаты во всех колонках начинаем с одной высоты
    const nameH = Math.max(...cols.map((c, i) => measure(SEGS[i].t, c.w - 2 * IP - 8, 20, true, 1.15)));
    cols.forEach((c, i) => {
      const sg = SEGS[i];
      s.card({ x: c.x, y: cy, w: c.w, h: BOT - cy });
      const iw = c.w - 2 * IP;
      const ih = Math.round(iw * 9 / 16);
      s.image(path.join(A.CROPS, sg.img), { x: c.x + IP, y: cy + IP, w: iw, h: ih, alt: 'Превью кадра AI-ролика' });
      s.box({ x: c.x + IP, y: cy + IP + ih, w: iw, h: 7, fill: sg.color, r: 0 });
      let yy = cy + IP + ih + 7 + 16;
      s.label(sg.n, { x: c.x + IP + 4, y: yy, w: iw - 8, color: sg.color, size: 18 });
      yy += 18 + 12;
      s.text(sg.t, { x: c.x + IP + 4, y: yy, w: iw - 8, size: 20, bold: true, lh: 1.15, color: C.navy });
      yy += nameH + 10;
      s.text(sg.q, { x: c.x + IP + 4, y: yy, w: iw - 8, h: BOT - 14 - yy, size: 18, lh: 1.2, color: C.blueText, fit: true, minSize: 15 });
    });
  },

  // ===================== 49. CTV: из точечного канала в comprehensive =====================
  49: (d) => {
    const s = d.slide({
      title: 'В 2027 переводим CTV из точечного канала в часть комплексной персонализированной коммуникации',
      subtitle: 'От единого ролика для приоритетных сегментов — к персонализированным сообщениям\nдля core-аудитории 18–34, работающим с ключевыми барьерами POME',
    });
    A.stageTag(s, 'SPRINT');
    const L = { x: 58, w: 860 };
    const R = { x: 1002, w: 860 };
    const PAD = 30;
    const IMG_H = 420;
    const IMG_W = Math.round(IMG_H * 1024 / 1536);   // макет двух ТВ 2:3
    const ltw = L.w - 2 * PAD - IMG_W - 20;            // текст слева от макета
    const rtw = R.w - 2 * PAD;

    const SPRINT_L = ['Ж 18–34 любящие пробовать новые средства', 'Ж 18–34 Social girl'];
    const SPRINT_R = ['Ж 18–34 любящие пробовать новые средства', 'Ж 18–34 Social girl', 'Все 18–34 негативный опыт Скиноклир', 'М 18–34 проблемная кожа'];
    const listH = (items, w) => sum(items.map((t) => measure(t, w, 18)));
    const boxH = (items, w) => 16 + 20 + 8 + listH(items, w) + 16;
    const bL1 = boxH(SPRINT_L, ltw - 40);
    const bL2 = boxH(['Ж 18–40'], ltw - 40);
    const bR = boxH(SPRINT_R, rtw - 40);
    const CRE_L = 'Единый студийный ролик для всех ЦА';
    const CRE_R = 'Персонализированные креативы, отрабатывающие основные барьеры POME аудитории';
    const ROLE_L = '**Роль:** дополнительный охват на больших экранах';
    const ROLE_R = '**Роль:** продолжение единой коммуникации бренда на больших экранах — с тем же инсайтом и сообщением, что в других digital-каналах';

    // общие ряды для обеих карточек
    const yPill = TOP + 22;
    const y0 = yPill + 52 + 24;                              // «Где использовали / используем»
    const y1 = y0 + 22 + 14;                                 // блоки сегментов
    const y2 = y1 + Math.max(bL1 + 12 + bL2, bR) + 24;       // «Подход к креативу»
    const creH = Math.max(measure(CRE_L, ltw, 19, true), measure(CRE_R, rtw, 19, true));
    const y3 = y2 + 22 + 10 + creH + 22;                     // роль
    const roleH = Math.max(measure(ROLE_L, ltw - 40, 18), measure(ROLE_R, rtw - 40, 18)) + 32;
    const CB = y3 + roleH + 24;                              // низ карточек

    const segBox = (x, y, w, tag, color, items, h) => {
      s.box({ x, y, w, h, fill: C.white, stroke: C.line, sw: 1.5 });
      s.text(tag, { x: x + 20, y: y + 16, w: w - 40, size: 18, bold: true, lh: 1.1, color });
      s.text(items.join('\n'), { x: x + 20, y: y + 16 + 20 + 8, w: w - 40, size: 18, lh: 1.2, color: C.blueText });
    };

    // --- 2026 ---
    {
      s.card({ x: L.x, y: TOP, w: L.w, h: CB - TOP });
      s.pill('2026 — точечное использование CTV', { x: L.x + 22, y: yPill, w: L.w - 44, h: 52, color: C.navy, size: 21 });
      const x = L.x + PAD;
      s.text('Где использовали', { x, y: y0, w: ltw, size: 20, bold: true, lh: 1.1, color: C.navy });
      segBox(x, y1, ltw, 'SPRINT', C.crimson, SPRINT_L, bL1);
      segBox(x, y1 + bL1 + 12, ltw, 'RECRUITMENT', C.blue, ['Ж 18–40'], bL2);
      s.text('Подход к креативу', { x, y: y2, w: ltw, size: 20, bold: true, lh: 1.1, color: C.navy });
      s.text(CRE_L, { x, y: y2 + 32, w: ltw, size: 19, bold: true, color: C.blueText });
      s.box({ x, y: y3, w: ltw, h: roleH, fill: C.tint });
      s.text(ROLE_L, { x: x + 20, y: y3, w: ltw - 40, h: roleH, size: 18, color: C.navy, valign: 'middle' });
      // макет: студийный ролик 2026 на экранах Smart TV
      const ix = L.x + L.w - PAD - IMG_W;
      const iy = Math.round((y1 + CB - 24) / 2 - IMG_H / 2);
      s.image(path.join(A.MEDIA, 'img_264bf71dda.png'), { x: ix, y: iy, w: IMG_W, h: IMG_H, alt: 'Креатив Азелика 2026 на экранах Smart TV' });
    }

    // --- стрелка ---
    s.arrow({ dir: 'right', x: L.x + L.w + 16, y: (TOP + CB) / 2, len: R.x - L.x - L.w - 32, head: 46, headLen: 24, stem: 12 });

    // --- 2027 ---
    {
      s.card({ x: R.x, y: TOP, w: R.w, h: CB - TOP, tint: true });
      s.pill('2027 — comprehensive CTV', { x: R.x + 22, y: yPill, w: R.w - 44, h: 52, color: C.blue, size: 21 });
      const x = R.x + PAD;
      s.text('Где используем', { x, y: y0, w: rtw, size: 20, bold: true, lh: 1.1, color: C.navy });
      segBox(x, y1, rtw, 'SPRINT', C.crimson, SPRINT_R, Math.max(bR, bL1 + 12 + bL2));
      s.text('Подход к креативу', { x, y: y2, w: rtw, size: 20, bold: true, lh: 1.1, color: C.navy });
      s.text(CRE_R, { x, y: y2 + 32, w: rtw, size: 19, bold: true, color: C.blueText });
      s.box({ x, y: y3, w: rtw, h: roleH, fill: C.blue });
      s.text(ROLE_R, { x: x + 20, y: y3, w: rtw - 40, h: roleH, size: 18, color: C.white, valign: 'middle' });
    }

    // --- что даёт переход к comprehensive ---
    const ly = CB + 24;
    label(s, 'Что дает переход к comprehensive', 58, ly, 1200, C.navy, 22);
    const by = ly + 22 + 16;
    const BEN = [
      { t: 'Релевантность', d: 'Сообщение + инсайт + креатив соответствует конкретной потребности, а не просто общей ЦА', ic: 'tb:TbTarget' },
      { t: 'Единая коммуникация', d: 'CTV продолжает ту же логику, что digital, а не существует отдельным роликом', ic: 'tb:TbLink' },
      { t: 'Масштабируемая персонализация', d: 'Больше сегментов и сообщений без пропорционального роста стоимости продакшена за студийный ролик', ic: 'tb:TbArrowsMaximize' },
    ];
    // заголовки трёх карточек — на одной высоте: отступ по самой высокой карточке
    const bcols = columns(BEN.length);
    const btw = bcols[0].w - 28 - 60 - 22 - 28;
    const bneed = Math.max(...BEN.map((b) => 22 + 10 + measure(b.d, btw, 18)));
    BEN.forEach((b, i) => {
      const c = bcols[i];
      const ch = BOT - by;
      s.card({ x: c.x, y: by, w: c.w, h: ch });
      const ID = 60;
      const tx = c.x + 28 + ID + 22;
      const tw = c.x + c.w - 28 - tx;
      const ty = by + Math.max(18, (ch - bneed) / 2);
      s.icon(b.ic, { x: c.x + 28, y: by + (ch - ID) / 2, size: ID, circle: C.crimson, color: C.white });
      s.text(b.t.toUpperCase(), { x: tx, y: ty, w: tw, size: 20, bold: true, lh: 1.1, color: C.crimson, fit: true, maxLines: 1, minSize: 15 });
      s.text(b.d, { x: tx, y: ty + 32, w: tw, h: BOT - 14 - (ty + 32), size: 18, lh: 1.2, color: C.blueText, fit: true, minSize: 15 });
    });
  },

  // ===================== 50. Масштабируем CTV: пул поставщиков =====================
  50: (d) => {
    const s = d.slide({
      title: 'Масштабируем CTV и формируем пул поставщиков под разные задачи',
      subtitle: 'Единый скоринг помогает выбрать качественный инвентарь, роли поставщиков — обеспечить масштаб, заметный контакт и дополнительные возможности таргетинга',
    });
    A.stageTag(s, 'SPRINT');

    // --- полоса: единая роль CTV в 2027 ---
    const SH = 104;
    s.card({ x: 58, y: TOP, w: 1804, h: SH, tint: true });
    s.text('Единая роль CTV в 2027', { x: 88, y: TOP, w: 250, h: SH, size: 26, bold: true, lh: 1.1, color: C.navy, valign: 'middle' });
    const ROLE = [
      { t: 'Smart TV среда', d: 'большой экран и высокое качество контакта', ic: 'tb:TbDeviceTv' },
      { t: 'Multi-roll база', d: 'основной формат для видеоконтакта', ic: 'tb:TbPlayerPlay' },
      { t: 'CPM закупка', d: 'единая модель для сравнения эффективности', ic: 'tb:TbScale' },
      { t: 'Замер эффективности', d: 'BLS Tiburon', ic: 'tb:TbChartBar' },
    ];
    const rx0 = 360;
    const rcol = (1862 - 24 - rx0) / ROLE.length;
    ROLE.forEach((r, i) => {
      const x = rx0 + i * rcol;
      s.vline(x, TOP + 22, SH - 44);
      s.icon(r.ic, { x: x + 22, y: TOP + (SH - 50) / 2, size: 50, circle: C.blue, color: C.white });
      const tx = x + 22 + 50 + 14;
      const tw = x + rcol - 10 - tx;
      const th = 22;
      const dh = measure(r.d, tw, 16);
      const ty = TOP + (SH - th - 4 - dh) / 2;
      s.text(r.t, { x: tx, y: ty, w: tw, size: 19, bold: true, lh: 1.1, color: C.navy, fit: true, maxLines: 1, minSize: 16 });
      s.text(r.d, { x: tx, y: ty + th + 4, w: tw, size: 16, lh: 1.2, color: C.blueText });
    });

    const Y = TOP + SH + 22;
    const L = { x: 58, w: 620 };
    const R = { x: 701, w: 1161 };
    const PAD = 30;

    // --- 1. Почему CTV ---
    {
      s.card({ x: L.x, y: Y, w: L.w, h: BOT - Y });
      const x = L.x + PAD;
      const w = L.w - 2 * PAD;
      let y = Y + 24;
      y += numHead(s, { x, y, w, n: 1, text: 'Почему CTV' }) + 18;
      y += s.text('Больший экран связан с более качественным видеоконтактом', { x, y, w, size: 21, bold: true, lh: 1.1, color: C.navy }) + 14;
      V.legend(s, x, y, [[V.MUTED, '0–49% площади экрана'], [C.crimson, '90–100% площади экрана']], { dir: 'col', step: 30, size: 17 });
      y += 30 + 26 + 4;
      const BUL = [
        'заметный контакт в среде больших экранов',
        'более высокая досматриваемость и видимость видео',
        'качественный охват поверх mobile / desktop',
        'единая оценка: CPM-сравнение + lift-замеры',
      ];
      const bulH = sum(BUL.map((b) => measure(b, w - 18, 18))) + 6 * (BUL.length - 1);
      const NOTE = 'При 90–100% экрана VA более чем в 2 раза выше; VTR выше на 17,7 п.п.';
      const noteH = measure(NOTE, w, 16);
      const chH = BOT - 24 - bulH - 12 - 24 - 18 - 18 - noteH - 12 - y;
      s.chart('col', [
        { name: '0–49% площади экрана', labels: ['VTR', 'VA'], values: [0.776, 0.309] },
        { name: '90–100% площади экрана', labels: ['VTR', 'VA'], values: [0.953, 0.748] },
      ], { x: x - 10, y, w: w + 20, h: chH, colors: [V.MUTED, C.crimson], legend: false, format: '0.0%',
        labelSize: 19, axisSize: 18, labelBold: true, gap: 60, overlap: -8, min: 0, max: 1.08 });
      y += chH + 12;
      y += s.text(NOTE, { x, y, w, size: 16, color: C.blueText }) + 18;
      s.hline(x, y, w);
      y += 18;
      y += s.text('Что это дает бренду', { x, y, w, size: 20, bold: true, lh: 1.1, color: C.crimson }) + 12;
      s.bullets(BUL, { x, y, w, size: 18, gap: 6 });
    }

    // --- 2. Как переводим это в план 2027 ---
    {
      s.card({ x: R.x, y: Y, w: R.w, h: BOT - Y });
      const x = R.x + PAD;
      const w = R.w - 2 * PAD;
      let y = Y + 24;
      y += numHead(s, { x, y, w, n: 2, text: 'Как переводим это в план 2027' }) + 18;
      y += s.text('Пул поставщиков для поддержки спринт-активаций', { x, y, w, size: 21, bold: true, lh: 1.1, color: C.navy }) + 18;
      const PW = 410;                 // карточки поставщиков справа
      const aw = w - PW - 30;         // рейтинг слева
      const px = x + aw + 30;
      const y0 = y;

      // критерии рейтинга
      y += s.text('Критерии рейтинга', { x, y, w: aw, size: 18, bold: true, lh: 1.1, color: C.navy }) + 10;
      const CR = [['Внимание ×1,5', true], ['Стоимость ×1'], ['Ёмкость ×1'], ['Trackability ×1']];
      const cg = 10;
      const cwid = CR.map(([t]) => widthOf(t, 16, true) + 30);
      const scale = Math.min(1, (aw - cg * (CR.length - 1)) / sum(cwid));
      let cx = x;
      CR.forEach(([t, hl], i) => {
        const cw = i === CR.length - 1 ? x + aw - cx : Math.floor(cwid[i] * scale + (aw - cg * (CR.length - 1) - sum(cwid) * scale) / CR.length);
        s.box({ x: cx, y, w: cw, h: 40, fill: hl ? C.crimson : C.tint, r: 12 });
        s.text(t, { x: cx + 6, y, w: cw - 12, h: 40, size: 16, bold: true, lh: 1.0, color: hl ? C.white : C.navy, align: 'center', valign: 'middle', fit: true, maxLines: 1, minSize: 13 });
        cx += cw + cg;
      });
      y += 40 + 22;

      // рейтинг для ранжирования: полосы (шкала 0…6), поставщики пула — цветом своей карточки
      y += s.text('Рейтинг для ранжирования', { x, y, w: aw, size: 18, bold: true, lh: 1.1, color: C.navy }) + 12;
      const POOL = { 'MTC Premium Video': ['#1', C.crimson], GPM: ['#2', C.navy], Everest: ['#3', C.cyan] };
      const RT = [['MTC Premium Video', 5.94], ['GPM', 5.91], ['Digital Alliance', 5.67], ['Экран', 5.47], ['Everest', 5.36], ['SberSeller', 5.28]];
      const NW = 200;
      const TAGW = 44;
      const VW = 54;
      const bx = x + NW + TAGW + 8;
      const bw = x + aw - VW - 8 - bx;
      const pitch = 36;
      RT.forEach(([n, v], i) => {
        const yy = y + i * pitch;
        const pool = POOL[n];
        s.text(n, { x, y: yy + 5, w: NW, size: 17, bold: !!pool, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 14 });
        if (pool) {
          s.box({ x: x + NW, y: yy + 4, w: TAGW, h: 24, fill: pool[1], r: 12 });
          s.text(pool[0], { x: x + NW, y: yy + 4, w: TAGW, h: 24, size: 14, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
        }
        s.box({ x: bx, y: yy + 8, w: bw, h: 16, fill: 'EEF3FA', r: 8 });
        s.box({ x: bx, y: yy + 8, w: Math.round(bw * v / 6), h: 16, fill: pool ? pool[1] : V.MUTED, r: 8 });
        s.text(String(v).replace('.', ','), { x: bx + bw + 8, y: yy + 5, w: VW, size: 17, bold: true, lh: 1.0, color: C.navy, align: 'right' });
      });
      y += RT.length * pitch + 14;

      // период и роль активации
      const PER = ['**Период:** активация параллельно Sprint 1 и Sprint 2', '**Роль:** усиление видимости в моменты пикового спроса для защиты от Skinoclear и конкурентов'];
      const perH = sum(PER.map((t) => measure(t, aw - 44, 18))) + 8;
      const ph = Math.max(perH + 36, BOT - 26 - y);
      s.box({ x, y, w: aw, h: ph, fill: C.cardTint });
      let py = y + (ph - perH) / 2;
      PER.forEach((t) => { py += s.text(t, { x: x + 22, y: py, w: aw - 44, size: 18, color: C.navy }) + 8; });

      // карточки поставщиков пула
      const PV = [
        { n: 'МТС', tag: '#1', color: C.crimson, a: '**Smart TV/VOD.** Достройка таргетинга через контент + соц-дем', r: '**Роль:** качественный видеоконтакт в Smart TV' },
        { n: 'GPM', tag: '#2', color: C.navy, a: '**Streaming.** Достройка таргетинга через каналы GPM + соц-дем', r: '**Роль:** качественный видеоконтакт в Online TV' },
        { n: 'Everest', tag: '#3', color: C.cyan, a: '**Smart TV/VOD.** Достройка таргетинга через контент + соц-дем + интересы', r: '**Роль:** качественный видеоконтакт в Smart TV' },
      ];
      const pg = 14;
      const pH = (BOT - 26 - y0 - pg * (PV.length - 1)) / PV.length;
      PV.forEach((p, i) => {
        const yy = y0 + i * (pH + pg);
        s.box({ x: px, y: yy, w: PW, h: pH, fill: C.white, stroke: C.line, sw: 1.5 });
        s.box({ x: px, y: yy, w: PW, h: 46, fill: p.color });
        s.text(p.tag, { x: px + 18, y: yy, w: 50, h: 46, size: 18, bold: true, lh: 1.0, color: C.white, valign: 'middle' });
        s.text(p.n, { x: px + 60, y: yy, w: PW - 120, h: 46, size: 22, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
        const tw = PW - 36;
        const bodyH = measure(p.a, tw, 16) + 6 + measure(p.r, tw, 16);
        let ty = yy + 46 + (pH - 46 - bodyH) / 2;
        ty += s.text(p.a, { x: px + 18, y: ty, w: tw, size: 16, color: C.navy }) + 6;
        s.text(p.r, { x: px + 18, y: ty, w: tw, size: 16, color: C.blueText });
      });
    }
    s.footnote('* Источник: AdRiver, видео size split, 06.02–06.09.');
  },

  // ===================== 51. CTV → TRP: интеграция CTV в TTL-video блок (скрытый) =====================
  51: (d) => {
    const s = d.slide({
      title: 'CTV → TRP: как интегрировать CTV в TTL-video блок',
      subtitle: 'Плановый eTRP позволяет включить CTV в общий TV-блок,\nсохраняя digital-логику закупки и измерения',
    });
    s.s.hidden = true;
    A.stageTag(s, 'SPRINT');
    const PAD = 28;
    const C1 = { x: 58, w: 560 };
    const C2 = { x: 641, w: 640 };
    const C3 = { x: 1304, w: 558 };
    const H1 = 420;

    // --- эстимация 2027 ---
    {
      s.card({ x: C1.x, y: TOP, w: C1.w, h: H1 });
      const x = C1.x + PAD;
      const w = C1.w - 2 * PAD;
      label(s, 'Эстимация 2027', x, TOP + 24, w, C.crimson);
      const g = 14;
      const bw = (w - g) / 2;
      const bh = 120;
      const ST = [
        { v: '23,8M ₽', k: 'Объем инвестиций', c: 'с АК/РС; вкл. BLS tech', color: C.crimson },
        { v: '53,5M', k: 'Объем показов Streaming + VOD', c: 'gross target impressions', color: C.blue },
        { v: '26,5M', k: 'Sprint 1', c: 'Показы фев–май', color: C.navy },
        { v: '27,0M', k: 'Sprint 2', c: 'Показы июл–окт', color: C.navy },
      ];
      ST.forEach((t, i) => {
        const bx = x + (i % 2) * (bw + g);
        const by = TOP + 24 + 22 + 16 + Math.floor(i / 2) * (bh + g);
        s.box({ x: bx, y: by, w: bw, h: bh, fill: C.white, stroke: C.line, sw: 1.5 });
        s.text(t.v, { x: bx + 18, y: by + 12, w: bw - 36, size: 34, bold: true, lh: 1.1, color: t.color });
        const kh = s.text(t.k, { x: bx + 18, y: by + 12 + 42, w: bw - 36, size: 16, bold: true, lh: 1.1, color: C.navy });
        s.text(t.c, { x: bx + 18, y: by + 12 + 42 + kh + 4, w: bw - 36, size: 14, lh: 1.1, color: MUTED_TXT });
      });
      let y = TOP + 24 + 22 + 16 + 2 * bh + g + 20;
      s.text('Показы пул поставщиков · Ж 18–45 · f=5', { x, y, w, size: 15, bold: true, lh: 1.1, color: MUTED_TXT });
      y += 18 + 10;
      // полоса показов пула — длины пропорциональны показам (сумма 53,5M)
      const POOL = [['MTS 17,5M', 17.5, C.blue], ['GPM 18,0M', 18.0, C.navy], ['Everest 18,0M', 18.0, C.purple]];
      const tot = sum(POOL.map((p) => p[1]));
      let px = x;
      POOL.forEach(([t, v, color], i) => {
        const pw = i === POOL.length - 1 ? x + w - px : Math.round((w - 2 * 4) * v / tot);
        s.box({ x: px, y, w: pw, h: 42, fill: color, r: 10 });
        s.text(t, { x: px + 6, y, w: pw - 12, h: 42, size: 16, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle', fit: true, maxLines: 1, minSize: 13 });
        px += pw + 4;
      });
    }

    // --- логика перевода CTV → eTRP ---
    {
      s.card({ x: C2.x, y: TOP, w: C2.w, h: H1, tint: true });
      const x = C2.x + PAD;
      const w = C2.w - 2 * PAD;
      s.text('ЛОГИКА ПЕРЕВОДА CTV → eTRP', { x, y: TOP + 24, w, size: 20, bold: true, lh: 1.0, color: C.blue });
      const top0 = TOP + 24 + 20 + 16;
      const fy0 = top0 + (TOP + H1 - 28 - top0 - (34 + 30 + 92 + 40 + 64)) / 2;
      s.text('CTV eTRP =', { x, y: fy0, w, size: 34, bold: true, lh: 1.0, color: C.navy, align: 'center' });
      const fy = fy0 + 34 + 30;
      const fh = 92;
      const B1 = { x: x + 4, w: 210 };
      const B2 = { x: x + 4 + 210 + 56, w: 210 };
      [[B1, 'CTV', C.crimson, 'IMPRESSIONS'], [B2, 'TV TARGET', C.blue, 'UNIVERSE']].forEach(([b, k, kc, t]) => {
        s.box({ x: b.x, y: fy, w: b.w, h: fh, fill: C.white, stroke: C.line, sw: 1.5 });
        s.text(k, { x: b.x + 10, y: fy + 18, w: b.w - 20, size: 16, bold: true, lh: 1.0, color: kc, align: 'center' });
        s.text(t, { x: b.x + 10, y: fy + 46, w: b.w - 20, size: 20, bold: true, lh: 1.0, color: C.navy, align: 'center', fit: true, maxLines: 1, minSize: 15 });
      });
      s.text('÷', { x: B1.x + B1.w, y: fy, w: 56, h: fh, size: 40, bold: true, lh: 1.0, color: C.blue, align: 'center', valign: 'middle' });
      s.text('×100', { x: B2.x + B2.w + 8, y: fy, w: x + w - (B2.x + B2.w + 8), h: fh, size: 30, bold: true, lh: 1.0, color: C.blue, align: 'center', valign: 'middle' });
      const uy = fy + fh + 40;
      s.box({ x, y: uy, w, h: 64, fill: C.white, stroke: C.crimson, sw: 2 });
      s.text('TV UNIVERSE Ж 18–45 = 26,0 млн', { x: x + 16, y: uy, w: w - 32, h: 64, size: 21, bold: true, lh: 1.0, color: C.navy, align: 'center', valign: 'middle', fit: true, maxLines: 1, minSize: 16 });
    }

    // --- как считаем ---
    {
      s.card({ x: C3.x, y: TOP, w: C3.w, h: H1 });
      const x = C3.x + PAD;
      const w = C3.w - 2 * PAD;
      label(s, 'Как считаем', x, TOP + 24, w, C.navy);
      const STP = [
        { title: 'Одна ЦА', text: 'CTV и TV считаем на одном target/universe' },
        { title: 'Gross impressions', text: 'VTR не умножаем на TRP — это отдельный quality KPI' },
        { title: 'Без double count reach', text: 'суммируем показы поставщиков, но не их reach' },
        { title: 'Fact after campaign', text: 'actual eTRP = CTV impressions / universe ×100' },
      ];
      const sd = 40;
      const stw = w - sd - 21;
      const sy = TOP + 24 + 22 + 22;
      const stH = sum(STP.map((it) => Math.max(sd, 5 + measure(it.title, stw, 22, true, 1.0) + 9 + measure(it.text, stw, 17))));
      const sg = Math.max(14, (TOP + H1 - 26 - sy - stH) / (STP.length - 1));
      s.steps(STP, { x, y: sy, w, pitch: 'auto', titleSize: 22, size: 17, d: sd, gap: sg });
    }

    // --- output для TTL-video блока ---
    const ly = TOP + H1 + 24;
    label(s, 'Output для TTL-video блока', 58, ly, 1000, C.crimson);
    const oy = ly + 20 + 14;
    const OH = 138;
    const OUT = [
      { k: 'Sprint 1', v: '≈ 102 eTRP', c: '26,5M / 26,0M ×100' },
      { k: 'Sprint 2', v: '≈ 104 eTRP', c: '27,0M / 26,0M ×100' },
      { k: 'Total CTV', v: '≈ 206 eTRP', c: '53,5M / 26,0M ×100', hl: true },
      { k: 'Total video pressure', v: 'TV TRP + CTV eTRP', c: 'единая gross-оценка', tint: true },
    ];
    columns(OUT.length).forEach((c, i) => {
      const o = OUT[i];
      if (o.hl) s.box({ x: c.x, y: oy, w: c.w, h: OH, fill: C.crimson, r: 25 });
      else s.card({ x: c.x, y: oy, w: c.w, h: OH, tint: !!o.tint });
      const fg = o.hl ? C.white : C.navy;
      s.label(o.k, { x: c.x + 28, y: oy + 22, w: c.w - 56, color: o.hl ? C.white : C.blue, size: 18 });
      s.text(o.v, { x: c.x + 28, y: oy + 22 + 26, w: c.w - 56, h: 48, size: o.tint ? 28 : 38, bold: true, lh: 1.1, color: fg, valign: 'middle', fit: true, maxLines: 1, minSize: 22 });
      s.text(o.c, { x: c.x + 28, y: oy + 22 + 26 + 52, w: c.w - 56, size: 16, lh: 1.1, color: o.hl ? C.white : MUTED_TXT });
    });

    // --- CPP и пояснения ---
    const cy = oy + OH + 20;
    const CW = columns(4)[1].x + columns(4)[1].w - 58;   // под двумя первыми плитками
    const CPP = 'CTV CPP* ≈ 116K ₽ / eTRP';
    const CPP_D = '23,8M ₽ / 206 eTRP; сравниваем с TV только при одинаковом составе затрат в бюджете';
    const cppH = 30 + 8 + measure(CPP_D, CW - 56, 17);
    const cpy = cy + Math.max(14, (BOT - cy - cppH) / 2);
    s.box({ x: 58, y: cy, w: CW, h: BOT - cy, fill: C.cardTint, r: 25 });
    s.text(CPP, { x: 58 + 28, y: cpy, w: CW - 56, size: 28, bold: true, lh: 1.05, color: C.navy });
    s.text(CPP_D, { x: 58 + 28, y: cpy + 38, w: CW - 56, size: 17, lh: 1.2, color: C.blueText });
    const nx = 58 + CW + 36;
    const nw = 1862 - nx;
    const NOTE = 'eTRP — planning equivalent для интеграции CTV в TV-план; это не рейтинг MediaScope. Universe Ж 18–45 = 26,0 млн используется как база расчета. Post-campaign используем valid Smart TV impressions после верификации AdRiver.';
    const NOTE2 = '* CPP — стоимость одного рейтингового пункта CTV.';
    const nh = measure(NOTE, nw, 17) + 10 + measure(NOTE2, nw, 17);
    let ny = cy + Math.max(0, (BOT - cy - nh) / 2);
    ny += s.text(NOTE, { x: nx, y: ny, w: nw, size: 17, color: C.blueText }) + 10;
    s.text(NOTE2, { x: nx, y: ny, w: nw, size: 17, color: C.blueText });
  },

  // ===================== 52. AI-таргетинг: от экспорта данных к экспорту методов (картинка → живой текст) =====================
  52: (d) => {
    const s = d.slide({
      title: 'AI-таргетинг: от экспорта данных к экспорту методов',
      subtitle: 'Переход от точечных закупок заранее сформированных аудиторий к постоянному поиску пользователей с высокой вероятностью отклика с использованием AI-возможностей DSP',
    });
    const GAP = 40;
    const cw = (1804 - 2 * GAP) / 3;
    const COL = [0, 1, 2].map((i) => ({ x: Math.round(58 + i * (cw + GAP)), w: Math.round(cw) }));
    const CB = 905;
    const PAD = 30;
    const D = 64;
    const head = (c, i, color, lab, title, tint) => {
      s.numberedCard({ x: c.x, y: TOP, w: c.w, h: CB - TOP, n: `0${i}`, color, d: D, pad: PAD, tint });
      const x = c.x + PAD;
      const w = c.w - 2 * PAD;
      let y = TOP + D + 14;
      y += s.label(lab, { x, y, w, color, size: 20 }) + 10;
      y += s.text(balanceTitle(title, 25, w), { x, y, w, size: 25, bold: true, lh: 1.1, color: C.navy }) + 18;
      return { x, w, y };
    };
    [0, 1].forEach((i) => s.chevron({ cx: COL[i].x + COL[i].w + GAP / 2, cy: (TOP + CB) / 2 + 20 }));

    // --- 1. AI DMP: подход H1 2026 ---
    {
      const c = COL[0];
      let { x, w, y } = head(c, 1, C.blue, 'AI DMP: подход H1 2026', 'AI DMP как базовый маршрут в 2026 году');
      const BL = [
        { t: 'Что мы использовали', ic: 'tb:TbDatabase', items: ['Заранее сформированные сегменты аудиторий', 'Фиксированные условия для активации', 'Стабильный, но менее адаптивный таргетинг'] },
        { t: 'Как мы работали', ic: 'tb:TbSettings', items: ['Применение по ключевым сегментам', 'Единые медианастройки', 'Использование как база для сравнения'] },
      ];
      // кегль 18 и поле до края плашки: пункты встают в одну строку, без висящих «аудиторий» / «таргетинг»
      const ID = 46;
      const tx = 22 + ID + 14;
      const tw = w - tx - 4;
      const need = BL.map((b) => 24 + 12 + sum(b.items.map((it) => measure(it, tw - 18, 18))) + 8 * (b.items.length - 1));
      const g = 18;
      const bh = (CB - 26 - y - g) / BL.length;
      BL.forEach((b, i) => {
        s.box({ x, y, w, h: bh, fill: C.cardTint });
        const iy = y + (bh - need[i]) / 2;
        s.icon(b.ic, { x: x + 22, y: iy - 4, size: ID, circle: C.blue, color: C.white });
        s.text(b.t, { x: x + tx, y: iy, w: tw, size: 22, bold: true, lh: 1.1, color: C.navy });
        s.bullets(b.items, { x: x + tx, y: iy + 24 + 12, w: tw, size: 18, gap: 8 });
        y += bh + g;
      });
    }

    // --- 2. AI DSP: тест H2 2026 ---
    {
      const c = COL[1];
      let { x, w, y } = head(c, 2, C.crimson, 'AI DSP: тест H2 2026', 'A/B-тест на двух сегментах аудиторий', true);
      y -= 8;
      y += s.text(balanceTitle('Изменён источник данных, остальные настройки оставались равными', 17, w, false), { x, y, w, size: 17, color: C.blueText }) + 16;
      // AI DSP vs AI DMP
      const vh = 48;
      const half = (w - 0) / 2;
      s.box({ x, y, w: half, h: vh, fill: PINK_T, r: 12 });
      s.box({ x: x + half, y, w: half, h: vh, fill: C.tint, r: 12 });
      s.text('AI DSP', { x, y, w: half - 30, h: vh, size: 21, bold: true, lh: 1.0, color: C.crimson, align: 'center', valign: 'middle' });
      s.text('AI DMP', { x: x + half + 30, y, w: half - 30, h: vh, size: 21, bold: true, lh: 1.0, color: C.navy, align: 'center', valign: 'middle' });
      s.circle({ x: x + half - 30, y: y + vh / 2 - 30, d: 60, fill: C.navy });
      s.text('VS', { x: x + half - 30, y: y + vh / 2 - 30, w: 60, h: 60, size: 20, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
      y += vh + 20;
      y += s.label('Результаты теста H2 2026', { x, y, w, color: C.blue, size: 19 }) + 12;
      const RS = [
        { t: 'CTR [[+12,5%]]', d: '0,45% vs 0,40%', ic: 'tb:TbChartBar' },
        { t: 'Лучшее качество пост-клика', d: 'Bounce -3,6 п.п. | Глубина +12% | Время на сайте +55%', ic: 'tb:TbPlayerPlay' },
        { t: 'Более вовлечённая аудитория', d: '«Где купить» CR ×2,6 | 2,0% vs 0,8%', ic: 'tb:TbShoppingCart' },
        { t: 'Ниже стоимость трафика', d: 'CPM -20% | CPC -28% | CPV +33%', ic: 'tb:TbCoins' },
      ];
      const ID = 44;
      const tx = x + ID + 16;
      const tw = x + w - tx;
      const WIN = '**AI DSP показал лучшие результаты,**\nчем AI DMP, на обоих тестируемых сегментах';
      const [w1, w2] = view(WIN).split('\n');
      const ww = w - 18 - 36 - 14 - 18;
      const winH = Math.round((countLines(w1, 18, ww, true) + (w2 ? countLines(w2, 18, ww, false) : 0)) * 18 * 1.2) + 30;
      const rh = RS.map((r) => Math.max(ID, measure(r.t, tw, 19, true, 1.1) + 4 + measure(r.d, tw, 16)));
      const g = Math.max(10, (CB - 24 - winH - 16 - y - sum(rh)) / (RS.length));
      RS.forEach((r, i) => {
        s.icon(r.ic, { x, y, size: ID, circle: C.blue, color: C.white });
        const th = s.text(r.t, { x: tx, y, w: tw, size: 19, bold: true, lh: 1.1, color: C.navy });
        s.text(r.d, { x: tx, y: y + th + 4, w: tw, size: 16, color: C.blueText });
        y += rh[i] + g;
        if (i < RS.length - 1) s.hline(tx, y - g / 2, tw, C.line, 1);
      });
      const wy = CB - 24 - winH;
      s.box({ x, y: wy, w, h: winH, fill: C.crimson });
      s.icon('tb:TbTrophy', { x: x + 18, y: wy + (winH - 36) / 2, size: 36, color: C.white });
      s.text(WIN, { x: x + 18 + 36 + 14, y: wy, w: w - 18 - 36 - 14 - 18, h: winH, size: 18, lh: 1.2, color: C.white, valign: 'middle' });
    }

    // --- 3. 2027: следующий этап ---
    {
      const c = COL[2];
      let { x, w, y } = head(c, 3, C.navy, '2027: следующий этап', 'Продолжаем тестирование и масштабируем возможности AI DSP');
      const IT = [
        { t: 'Снижение стоимости за дату', d: 'Использование AI-возможностей DSP позволяет эффективнее распределять бюджет и снижать стоимость за дату', ic: 'tb:TbDatabase' },
        { t: 'Постоянный поиск новых аудиторий', d: 'AI DSP находит пользователей с высокой вероятностью отклика в реальном времени', ic: 'tb:TbUsersGroup' },
        { t: 'Масштабирование', d: 'Тестируем AI-подбор аудиторий и кластеризацию, масштабируем на весь бренд', ic: 'tb:TbArrowsDiagonal' },
        { t: 'От экспорта данных к экспорту методов', d: 'Переходим от использования готовых сегментов к экспорту AI-методов подбора аудиторий — это более гибкий и эффективный подход для нас', ic: 'tb:TbAffiliate' },
      ];
      const ID = 44;
      const tx = x + ID + 16;
      const tw = x + w - tx;
      const ih = IT.map((r) => Math.max(ID, measure(r.t, tw, 20, true, 1.1) + 4 + measure(r.d, tw, 17)));
      const g = Math.max(12, (CB - 26 - y - sum(ih)) / (IT.length - 1));
      IT.forEach((r, i) => {
        s.icon(r.ic, { x, y, size: ID, circle: C.navy, color: C.white });
        const th = s.text(r.t, { x: tx, y, w: tw, size: 20, bold: true, lh: 1.1, color: C.navy });
        s.text(r.d, { x: tx, y: y + th + 4, w: evenW(r.d, tw, 17), size: 17, color: C.blueText });
        y += ih[i] + g;
        if (i < IT.length - 1) s.hline(tx, y - g / 2, tw, C.line, 1);
      });
    }

    s.principle({ label: 'Оценка эффективности', icon: 'tb:TbChartBar', color: C.blue,
      text: '**Метрики:** CTR • Качество пост-клика (bounce rate / глубина / время на сайте) • Конверсии (целевые действия)' });
  },
};
