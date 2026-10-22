// Нормобакт L · стратегия 2027 — часть C: слайды исходника 11–15.
// 11, 13, 14, 15 в исходнике — картинки во весь слайд (сгенерированные макеты); пересобраны живым текстом,
// тексты и цифры прочитаны по увеличенным фрагментам (out/render/brand_normobact_part_c/zoom/) и сверены
// с живым текстом под картинками; 12 — скрытый слайд с живым текстом.
// 11 — сезонность спроса: тепловая таблица 2025 + 1ПГ 2026 по брендам и категориям + 4 вывода (аналог — Clindovit 9);
// 12 — география Digital: ядро / точки роста / планировочная гипотеза (скрытый; аналог — Bobotic 9);
// 13 — анализ сегментов: три сегмента с размерами и вердиктом ORM-фильтра (аналог — Bobotic 14);
// 14 — связка Нормобакт / Динобутин / Боботик через ретаргетинг: источник → синергия → креатив;
// 15 — learnings 2026 → H2 и 2027: L1–L4 → continue / test (аналоги — Acriol 12, Bobotic 12, Azelik 17).
const { C, columns, textWidth, countLines, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT

const TOP = V.TOP;   // 221 — верх контента
const BOT = V.BOT;   // 1005 — низ контента без плашки
const CB = 905;      // низ контента над плашкой
const X0 = 58;
const X1 = 1862;

// ---------- помощники ----------
// Высота и ширина текста так же, как их оценивает s.text — по переведённой строке (EN-сборка пересчитает геометрию)
const plainTr = (text) => typo(tr(String(text))).replace(/\*\*|\[\[|\]\]/g, '');
const measure = (text, w, size = 18, bold = false, lh = 1.2) =>
  Math.round(countLines(plainTr(text), size, w, bold) * size * lh);
const widthOf = (text, size, bold = false) => textWidth(plainTr(text), size, bold);
// Ширина блока, при которой текст занимает столько же строк, но строки ровнее (без висящего последнего слова)
const evenW = (text, w, size, bold = false) => {
  const lines = (ww) => countLines(plainTr(text), size, ww, bold);
  const n = lines(w);
  if (n < 2) return w;
  let lo = w * 0.4;
  let hi = w;
  while (hi - lo > 1) { const m = (lo + hi) / 2; if (lines(m) <= n) hi = m; else lo = m; }
  return Math.min(w, Math.ceil(hi * 1.04) + 6);   // запас на разницу переносов PowerPoint / LibreOffice
};

// Смешение цвета с белым: k = 0 — белый, 1 — исходный цвет
function tintOf(hex, k) {
  const c = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return c.map((v) => Math.round(255 + (v - 255) * k).toString(16).padStart(2, '0')).join('').toUpperCase();
}

// Цветная плашка-заголовок колонки: белая иконка слева + КАПС-текст
function headBox(s, { x, y, w, h = 76, color = C.blue, icon, text, size = 22 }) {
  s.box({ x, y, w, h, fill: color });
  const D = 44;
  let tx = x + 26;
  if (icon) { s.icon(icon, { x: tx, y: y + (h - D) / 2, size: D, color: C.white }); tx += D + 20; }
  s.text(String(text).toUpperCase(), { x: tx, y, w: x + w - 22 - tx, h, size, bold: true, lh: 1.05, color: C.white,
    valign: 'middle', fit: true, maxLines: 2, minSize: 16 });
}

// Плитка-ярлык «L1»: тёмная, белый жирный текст по центру
function tag(s, text, { x, y, w = 52, h = 34, size = 16, fill = C.navy }) {
  s.box({ x, y, w, h, fill, r: 8 });
  s.text(text, { x, y, w, h, size, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
}

// Цифра + подпись на одной базовой линии: «40,7%» крупно, подпись мельче справа
function valueUnit(s, { x, y, w, value, unit, size = 64, unitSize = 20, color = C.navy, unitColor = C.blueText, unitBold = true }) {
  const vw = Math.ceil(widthOf(value, size, true)) + 6;
  const vh = size * 1.1;
  s.text(value, { x, y, w: vw, size, bold: true, lh: 1.1, color });
  if (unit) {
    const uw = w - vw - 12;
    const uh = measure(unit, uw, unitSize, unitBold);
    s.text(unit, { x: x + vw + 12, y: y + vh - uh - (size - unitSize) * 0.16, w: uw, size: unitSize, bold: unitBold, lh: 1.2, color: unitColor });
  }
  return vh;
}

const dec = (v) => v.toFixed(1).replace('.', ',');   // 37.3 → «37,3»

module.exports = {
  // =====================================================================
  // 11 · Сезонность спроса: 2025 и 1ПГ 2026 (аналог — Clindovit 9)
  // Заголовок исходника в 2 строки шапки не помещается — делим по двоеточию на заголовок и подзаголовок.
  // =====================================================================
  11: (d) => {
    const s = d.slide({
      title: 'Сезонность спроса сохраняется',
      // ручной перенос: иначе PowerPoint рвёт «по-/разному» по дефису
      subtitle: 'В 2025 году пик приходится на зиму и осень,\nа в 1ПГ 2026 брендовый спрос ведет себя по-разному',
    });
    // тыс. запросов в месяц: 2025 янв–дек + 2026 янв–июн — прочитано с картинки исходника
    const M = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек', 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'];
    const DATA = [
      ['Бренды'],
      ['Нормобакт', [37.3, 37.6, 38.9, 33.1, 27.6, 27.1, 30.4, 30.4, 28.9, 34.6, 33.0, 33.8, 29.1, 30.0, 33.9, 32.2, 29.4, 34.8], true],
      ['Энтерол', [385.7, 374.5, 404.7, 353.7, 318.5, 368.9, 443.1, 488.2, 399.0, 429.6, 401.8, 390.6, 402.2, 374.2, 415.6, 415.7, 366.4, 455.6]],
      ['Категория и проблематика'],
      ['Пробиотик для детей', [13.2, 15.1, 16.5, 12.2, 9.8, 9.3, 9.9, 10.8, 11.5, 13.1, 13.0, 14.9, 11.1, 10.8, 12.1, 11.5, 9.7, 12.7]],
      ['Пребиотики для детей', [4.1, 4.8, 5.1, 3.9, 3.2, 2.8, 3.0, 3.1, 3.4, 4.0, 4.1, 4.6, 3.5, 3.7, 3.9, 3.7, 3.3, 4.5]],
      ['Микрофлора кишечника', [72.7, 75.8, 80.2, 68.3, 59.4, 56.7, 54.3, 55.8, 58.8, 69.2, 71.2, 70.6, 64.8, 60.0, 65.8, 64.4, 53.9, 61.7]],
    ];
    // подсветка по строке (январь 2025 — июнь 2026): максимум — малиновый, минимум — синий, остальные — оттенок
    const HI = C.crimson;
    const LO = C.blue;
    const cell = (v, vals, bold) => {
      const lo = Math.min(...vals);
      const hi = Math.max(...vals);
      if (v === hi) return { text: dec(v), fill: HI, color: C.white, bold: true, align: 'center' };
      if (v === lo) return { text: dec(v), fill: LO, color: C.white, bold: true, align: 'center' };
      const t = (v - lo) / (hi - lo);
      const fill = t >= 0.5 ? tintOf(HI, 0.08 + (t - 0.5) * 0.6) : tintOf(C.cyan, 0.08 + (0.5 - t) * 0.6);
      return { text: dec(v), fill, color: C.navy, bold, align: 'center' };
    };
    const MW = 86;
    const nameW = X1 - X0 - MW * 18;
    const rows = [
      [{ text: '' }, { text: '2025', colspan: 12 }, { text: '1ПГ 2026', colspan: 6 }],
      [{ text: 'тыс. запросов', fill: C.cardTint, color: C.blueText }, ...M.map((m) => ({ text: m, fill: C.cardTint, color: C.navy, align: 'center' }))],
    ];
    const rowH = [42, 40];
    DATA.forEach(([name, vals, hl]) => {
      if (!vals) {
        rows.push([{ text: name, colspan: 19, fill: C.tint, color: C.navy, bold: true }]);
        rowH.push(36);
      } else {
        rows.push([{ text: name, color: C.navy, bold: !!hl }, ...vals.map((v) => cell(v, vals, !!hl))]);
        rowH.push(54);
      }
    });
    s.table(rows, { x: X0, y: TOP, w: X1 - X0, colW: [nameW, ...Array(18).fill(MW)], rowH, size: 18 });
    const tH = rowH.reduce((a, b) => a + b, 0);
    s.vline(X0 + nameW + MW * 12, TOP, tH, C.navy, 2.5);   // граница 2025 | 2026

    // легенда подсветки — справа под таблицей; слева — пояснение к цифрам
    const ly = TOP + tH + 12;
    let lx = X1;
    [[LO, 'минимум в строке'], [HI, 'максимум в строке']].forEach(([col, txt]) => {
      const tw = Math.ceil(widthOf(txt, 15)) + 8;
      lx -= tw;
      s.text(txt, { x: lx, y: ly, w: tw, size: 15, lh: 1.0, color: C.blueText });
      lx -= 26;
      s.box({ x: lx, y: ly, w: 18, h: 16, fill: col, r: 4 });
      lx -= 28;
    });
    s.text('Цвет ячейки — по строке, с января 2025 по июнь 2026.', { x: X0, y: ly, w: lx - X0 - 20, size: 15, lh: 1.0, color: C.blueText });

    // четыре вывода
    const cy = ly + 34;
    const cols = columns(4, { gap: 23 });
    const pad = 24;
    const bd = 44;
    const insights = [
      { lead: 'Сезонность в 2025 году',
        body: 'В 2025 году спрос усиливается **зимой**: первый пик приходится на **февраль–март**. После весеннего снижения категория постепенно оживает **осенью**, и к **октябрю–декабрю** формируется вторая волна интереса.' },
      { lead: 'В 1ПГ 2026 бренды ведут себя по-разному',
        sub: 'По сравнению с 1ПГ 2025:',
        stats: [['Энтерол растет', '+10%', C.navy], ['**Нормобакт снижается**', '−6%', C.crimson]] },
      { lead: 'Проблематика в 1ПГ 2026 слабее прошлого года',
        sub: 'Категорийные запросы в первом полугодии снижаются к 1ПГ 2025:',
        stats: [['«пробиотик для детей»', '−11%'], ['«пребиотики для детей»', '−5%'], ['«микрофлора кишечника»', '−10%']] },
      { lead: 'Ключевые периоды для усиления',
        body: 'Для категории наиболее сильными окнами остаются [[**зима и осень**]]. В эти периоды важно входить в коммуникацию заранее: наращивать заметность перед зимним пиком и усиливать присутствие к осеннему возврату спроса.' },
    ];
    insights.forEach((it, i) => {
      const { x, w } = cols[i];
      const iw = w - pad * 2;
      s.card({ x, y: cy, w, h: BOT - cy });
      s.badge({ x: x + pad, y: cy + pad, d: bd, n: i + 1, color: C.blue, size: 24 });
      const lw = iw - bd - 14;
      const lh = measure(it.lead, lw, 21, true, 1.15);
      s.text(it.lead, { x: x + pad + bd + 14, y: cy + pad + Math.max(0, (bd - lh) / 2), w: lw, size: 21, bold: true, lh: 1.15, color: C.navy });
      let y = cy + pad + Math.max(bd, lh) + 16;
      if (it.sub) y += s.text(it.sub, { x: x + pad, y, w: iw, size: 19, lh: 1.2, color: C.blueText }) + 12;
      if (it.stats) {
        const vw = Math.max(...it.stats.map(([, v]) => Math.ceil(widthOf(v, 38, true)))) + 6;
        it.stats.forEach(([lab, val, col]) => {
          const labW = iw - vw - 10;
          const lh2 = measure(lab, labW, 19, false, 1.15);
          const rh = Math.max(44, lh2);
          s.text(lab, { x: x + pad, y: y + (rh - lh2) / 2, w: labW, size: 19, lh: 1.15, color: C.navy });
          s.text(val, { x: x + pad + iw - vw, y: y + (rh - 42) / 2, w: vw, size: 38, bold: true, lh: 1.1, color: col ?? C.crimson, align: 'right' });
          y += rh + 10;
        });
      }
      if (it.body) s.text(it.body, { x: x + pad, y, w: iw, size: 19, lh: 1.3, color: C.blueText });
    });
  },

  // =====================================================================
  // 12 · География Digital (скрытый слайд; аналог — Bobotic 9)
  // =====================================================================
  12: (d) => {
    const s = d.slide({ title: 'География Digital: усиливаем ядро и точки роста, сохраняя национальное присутствие' });
    s.s.hidden = true;

    // ── полоса цифр: три про ядро + планировочная гипотеза (малиновая) ──
    const kp = [
      { lab: 'Ядро Digital', val: '40,7%', sub: 'продаж H1’26 в 10 регионах' },
      { lab: 'Актуальный спрос', val: '48,5%', sub: 'июльских продаж в ядре' },
      { lab: 'DI* ядра', val: '≈89%', sub: 'средний DI июля’26' },
      { lab: 'Планировочная гипотеза', val: '55–60%', sub: 'digital-инвестиций — ядро', hl: true },
    ];
    const kc = columns(4, { gap: 23 });
    const KH = 112;
    kp.forEach((k, i) => {
      const c = kc[i];
      s.box({ x: c.x, y: TOP, w: c.w, h: KH, fill: k.hl ? C.crimson : C.cardTint, stroke: k.hl ? undefined : C.line, sw: 2 });
      const ink = k.hl ? C.white : C.navy;
      s.text(k.lab, { x: c.x + 24, y: TOP + 16, w: c.w - 48, size: 16, bold: true, lh: 1.0, color: k.hl ? C.white : C.blueText, caps: true });
      valueUnit(s, { x: c.x + 24, y: TOP + 40, w: c.w - 40, value: k.val, unit: k.sub, size: 46, unitSize: 17, color: k.hl ? C.white : C.blue, unitColor: ink, unitBold: false });
    });

    // ── три колонки ──
    const cols = columns(3, { gap: 23 });
    const CY = TOP + KH + 22;
    const pad = 32;
    const bd = 52;
    const cw = cols[0].w - pad * 2;
    const head = (col, n, text, color) => {
      s.badge({ x: col.x + pad, y: CY + 24, d: bd, n, color, size: 26 });
      s.text(text, { x: col.x + pad + bd + 18, y: CY + 24, w: col.w - pad * 2 - bd - 18, h: bd, size: 27, bold: true, lh: 1.05, color: C.navy, valign: 'middle', fit: true, minSize: 22 });
    };
    const leadY = CY + 24 + bd + 20;
    const leads = [
      // «/ защита позиции» не начинает строку
      'Высокий спрос + достаточная доступность / защита позиции',
      'Разный вес по потенциалу спроса и готовности DI',
      'Логика выбора',
    ];
    const leadH = Math.max(...leads.map((t) => measure(t, cw, 19, true)));
    const lineY = leadY + leadH + 18;
    const geo = [
      { n: 1, t: 'Ядро Digital', color: C.blue, ink: C.blue, share: '40,7%',
        regions: ['Москва', 'МО', 'Башкортостан', 'Самарская обл.', 'Свердловская обл.',
          'СПб', 'Оренбургская обл.', 'Челябинская обл.', 'Приморский край', 'Татарстан'] },
      { n: 2, t: 'Точка роста', color: C.cyan, ink: C.teal, share: '18,2%',
        regions: ['Ставропольский край', 'Тюменская обл.', 'Иркутская обл.', 'Пермский край',
          'Ростовская обл.', 'Краснодарский край', 'Нижегородская обл.'] },
    ];
    const FH = 70;                        // плашка «доля продаж» внизу колонки
    const FY = CB - pad + 8 - FH;
    geo.forEach((g, i) => {
      const col = cols[i];
      const x = col.x + pad;
      s.card({ x: col.x, y: CY, w: col.w, h: CB - CY });
      head(col, g.n, g.t, g.color);
      s.text(leads[i], { x, y: leadY, w: cw, size: 19, bold: true, lh: 1.2, color: C.navy });
      s.hline(x, lineY, cw);
      // два столбца регионов; шаг строки — по более высокому из пары
      const half = Math.ceil(g.regions.length / 2);
      const rw = cw / 2 - 26;
      const rows = [];
      for (let k = 0; k < half; k++) rows.push([g.regions[k], g.regions[half + k]].filter(Boolean));
      const rh = rows.map((pr) => Math.max(...pr.map((r) => measure(r, rw, 20, false, 1.15))));
      const avail = FY - 18 - (lineY + 22);
      const gap = Math.min(28, (avail - rh.reduce((a, b) => a + b, 0)) / Math.max(1, rows.length - 1));
      let cy = lineY + 22;
      rows.forEach((pr, k) => {
        pr.forEach((r, j) => {
          const cx = x + (j ? cw / 2 + 6 : 0);
          s.circle({ x: cx, y: cy + 8, d: 10, fill: g.color });
          s.text(r, { x: cx + 22, y: cy, w: rw, size: 20, lh: 1.15, color: C.navy });
        });
        cy += rh[k] + gap;
      });
      // доля продаж ядра / точек роста
      s.box({ x, y: FY, w: cw, h: FH, fill: C.cardTint, r: 15 });
      const vw = Math.ceil(widthOf(g.share, 36, true)) + 8;
      s.text(g.share, { x: x + 20, y: FY, w: vw, h: FH, size: 36, bold: true, lh: 1.0, color: g.ink, valign: 'middle' });
      s.text('продаж, янв.–июнь 2026', { x: x + 20 + vw + 12, y: FY, w: cw - vw - 52, h: FH, size: 19, bold: true, lh: 1.15, color: C.navy, valign: 'middle', fit: true, minSize: 16 });
    });

    // колонка 3: планировочная гипотеза — три веса
    const col = cols[2];
    const x = col.x + pad;
    s.card({ x: col.x, y: CY, w: col.w, h: CB - CY, tint: true });
    head(col, 3, 'Планировочная гипотеза', C.crimson);
    s.text(leads[2], { x, y: leadY, w: cw, size: 19, bold: true, lh: 1.2, color: C.navy });
    s.hline(x, lineY, cw);
    const logic = [
      { color: C.blue, t: '**Ядро = 40,7% продаж → максимальный вес 55–60% инвестиций**: подтвержденный спрос + DI ≈89% позволяют эффективно конвертировать медиадавление' },
      { color: C.cyan, t: '**Рост = 18,2% продаж → 20–25% инвестиций**: усиливаем регионы по мере готовности спроса и DI;\n34% e-com снижает зависимость от аптечной доступности' },
      { color: V.MUTED, t: '**Остальная РФ = 41,0% продаж → сохраняем\n15–20% базового присутствия**: значимый спрос распределен между большим количеством регионов без масштаба каждой отдельной географии long tail' },
    ];
    const lx = x + 20;
    const lw = cw - 20;
    const top = lineY + 20;
    const availL = CB - 24 - top;
    let ls = 18;
    const logicH = (sz) => logic.reduce((a, l) => a + measure(l.t, lw, sz), 0);
    while (ls > 16 && logicH(ls) + 2 * 22 > availL) ls -= 1;
    const lg = Math.min(30, (availL - logicH(ls)) / 2);
    let ly = top;
    logic.forEach((l) => {
      const h = measure(l.t, lw, ls);
      s.box({ x, y: ly + 2, w: 6, h: h - 4, fill: l.color, r: 3 });
      s.text(l.t, { x: lx, y: ly, w: lw, size: ls, lh: 1.2, color: C.blueText });
      ly += h + lg;
    });

    s.principle({ label: 'Вывод', icon: 'target',
      text: 'География задает разный вес инвестиций, а не ограничивает кампанию: защищаем 40,7% продаж в ядре, ускоряем 18,2% в точках роста и сохраняем национальное присутствие для 41% продаж остальной РФ' });
    s.footnote('*DI — Distribution Index = показатель аптечной дистрибуции препарата');
  },

  // =====================================================================
  // 13 · Анализ сегментов Нормобакт (аналог — Bobotic 14)
  // Синяя полоса-вывод исходника «Повторный анализ с ORM-фильтром…» — подзаголовком в шапке.
  // =====================================================================
  13: (d) => {
    const s = d.slide({ title: 'Анализ сегментов Нормобакт', subtitle: 'Повторный анализ с ORM-фильтром подтверждает выбранные сегменты' });
    const segs = [
      { icon: 'tb:TbShieldPlus', color: C.blue, name: 'Мамы с детьми 3–10 после курса антибиотиков', size: '~3 млн',
        text: '**Сам сценарий очень хорошо подтверждается и проходит ORM-фильтр.**\n\nНо возраст 3+ может быть расширен, свежие органические кейсы показывают, что пробиотик используется и у детей 1–2 лет и даже младенцев. При этом у самых маленьких сильнее роль врача.' },
      { icon: 'tb:TbVirus', color: C.teal, name: 'Мамы детей 0–10 с кишечной инфекцией и ротавирусом', size: '~0,7 млн',
        text: '**Полностью подтверждается и не требует корректировок**' },
      { icon: 'tb:TbMoodKid', color: C.cyan, name: 'Мамы малышей 1–3 лет с «животиком»: диарея / смена питания / прикорм', size: '~0,9 млн',
        text: '**Сценарий подтверждается очень хорошо.**\n\nСегмент проявляется именно в этом возрасте, когда ребёнок активно осваивает новые продукты, расширяется рацион, начинается переход к общему столу, меняется режим питания.\n\nПри этом в отзывах также встречаются отзывы и до 1 года, но данный сегмент у нас работает в Боботике.' },
    ];
    const G = 20;
    const RH = Math.floor((BOT - TOP - G * 2) / 3);
    const P = 30;
    const ID = 92;
    const nameX = X0 + 14 + P + ID + 26;
    const nameW = 370;
    const statX = nameX + nameW + 30;
    const statW = 290;
    const txtX = statX + statW + 44;
    const txtW = X1 - P - txtX;
    segs.forEach((g, i) => {
      const y = TOP + i * (RH + G);
      s.card({ x: X0, y, w: X1 - X0, h: RH });
      s.box({ x: X0, y: y + 22, w: 10, h: RH - 44, fill: g.color, r: 5 });
      s.icon(g.icon, { x: X0 + 14 + P, y: y + (RH - ID) / 2, size: ID, circle: g.color });
      const nh = measure(g.name, nameW, 26, true, 1.15);
      s.text(g.name, { x: nameX, y: y + (RH - nh) / 2, w: nameW, size: 26, bold: true, lh: 1.15, color: C.navy });
      // размер сегмента — плиткой
      const sy = y + P;
      const sh = RH - P * 2;
      s.box({ x: statX, y: sy, w: statW, h: sh, fill: tintOf(g.color, 0.12) });
      const blockH = 18 + 10 + 52;
      const by = sy + (sh - blockH) / 2;
      s.text('Размер', { x: statX + 24, y: by, w: statW - 48, size: 18, bold: true, lh: 1.0, color: g.color, caps: true });
      let vs = 46;
      while (vs > 34 && widthOf(g.size, vs, true) > (statW - 48) * 0.9) vs -= 1;
      s.text(g.size, { x: statX + 24, y: by + 28 + (46 - vs) * 0.6, w: statW - 36, size: vs, bold: true, lh: 1.1, color: g.color });
      // вердикт ORM-фильтра
      const th = measure(g.text.replace(/\n\n/g, '\n'), txtW, 21, false, 1.25) + (g.text.split('\n\n').length - 1) * 8;
      s.vline(txtX - 22, y + P, RH - P * 2, g.color, 3);
      s.text(g.text, { x: txtX, y: y + (RH - th) / 2, w: txtW, size: 21, lh: 1.25, gap: 8, color: C.blueText });
    });
  },

  // =====================================================================
  // 14 · Нормобакт, Динобутин, Боботик: связка брендов через ретаргетинг
  // Три колонки: источник аудитории → синергия брендов → креатив Нормобакта; по строке на бренд-донор.
  // Иллюстрации исходника — иконками Tabler. «Технический шаг» в исходнике лежит под картинкой (не виден) —
  // на слайд не переносим, только в заметки.
  // =====================================================================
  14: (d) => {
    const s = d.slide({
      title: 'Нормобакт, Динобутин, Боботик: связка брендов через ретаргетинг',
      subtitle: 'Ретаргетинг по аудитории «видевших рекламу» + креативы по пересекающимся ситуациям',
    });
    const cols = columns(3, { gap: 60 });
    const HH = 76;
    const heads = [
      ['tb:TbUsersGroup', 'Источники аудитории', C.navy],
      ['tb:TbLink', 'Синергия брендов', C.blue],
      ['tb:TbSpeakerphone', 'Нормобакт и креативы', C.cyan],
    ];
    heads.forEach(([icon, t, color], i) => headBox(s, { x: cols[i].x, y: TOP, w: cols[i].w, h: HH, icon, text: t, color, size: 23 }));
    const RY = TOP + HH + 18;
    const G = 22;
    const RH = Math.floor((BOT - RY - G) / 2);
    const pad = 30;
    const rows = [
      { brand: 'Боботик', icon: 'tb:TbBabyCarriage', color: C.crimson,
        items: ['Пул: видевшие рекламу Боботика', '**ЦА: Мамы с детьми до года**'],
        synIcon: 'tb:TbBowl', syn: 'Проблемы с животиком у малышей на фоне изменения диеты, ввода прикорма, изменения питания' },
      { brand: 'Динобутин', icon: 'tb:TbMoodKid', color: C.blue,
        items: ['Пул: видевшие рекламу Динобутина', '**ЦА: Женщины 25–45, мамы детей с 3 до 10 лет с ЖКТ-симптоматикой / болями / спазмами / стресс-животом**'],
        synIcon: 'tb:TbPuzzle', syn: 'Поиск комплексного и рабочего подхода для налаживания работы ЖКТ у ребенка, чтобы проблема ушла' },
    ];
    const ID = 64;
    rows.forEach((r, k) => {
      const y = RY + k * (RH + G);
      // ── источник аудитории
      const A = cols[0];
      s.card({ x: A.x, y, w: A.w, h: RH });
      const bw = A.w - pad * 2;
      const blH = r.items.reduce((acc, it) => acc + measure(it, bw - 22, 21, false, 1.2), 0) + 12 * (r.items.length - 1);
      const ay = y + Math.max(pad, (RH - (ID + 24 + blH)) / 2);
      s.icon(r.icon, { x: A.x + pad, y: ay, size: ID, circle: r.color });
      s.text(r.brand, { x: A.x + pad + ID + 20, y: ay + (ID - 36) / 2, w: bw - ID - 20, size: 32, bold: true, lh: 1.1, color: C.navy });
      s.bullets(r.items, { x: A.x + pad, y: ay + ID + 24, w: bw, size: 21, gap: 12, indent: 22, lh: 1.2, color: C.navy });
      // ── синергия брендов — синий блок
      const B = cols[1];
      s.box({ x: B.x, y, w: B.w, h: RH, fill: C.blue, r: 25 });
      const sw = B.w - pad * 2;
      const sh = measure(r.syn, sw, 22, false, 1.25);
      const bh = ID + 22 + sh;
      const by = y + (RH - bh) / 2;
      s.icon(r.synIcon, { x: B.x + pad, y: by, size: ID, circle: C.white, color: C.blue });
      s.text(r.syn, { x: B.x + pad, y: by + ID + 22, w: sw, size: 22, lh: 1.25, color: C.white });
      // стрелки между колонками
      [0, 1].forEach((j) => s.chevron({ cx: cols[j].x + cols[j].w + 30, cy: y + RH / 2, color: C.crimson }));
    });

    // ── креативы Нормобакта
    const Cc = cols[2];
    const cw = Cc.w - pad * 2;
    // строка 1: коммуникация из сегмента
    {
      const y = RY;
      s.card({ x: Cc.x, y, w: Cc.w, h: RH, tint: true });
      const lead = 'Показываем коммуникацию из сегмента';
      const seg = 'Мамы малышей 1–3 лет с «животиком»: диарея / смена питания / прикорм';
      const lh = measure(lead, cw, 20);
      const segH = measure(seg, cw - 48, 24, true, 1.2);
      const boxH = segH + 48;
      const top = y + (RH - (lh + 18 + boxH)) / 2;
      s.text(lead, { x: Cc.x + pad, y: top, w: cw, size: 20, lh: 1.2, color: C.blueText });
      s.box({ x: Cc.x + pad, y: top + lh + 18, w: cw, h: boxH, fill: tintOf(C.crimson, 0.12) });
      s.text(seg, { x: Cc.x + pad + 24, y: top + lh + 18 + 24, w: cw - 48, size: 24, bold: true, lh: 1.2, color: C.navy });
    }
    // строка 2: коммуникация Нормобакта с УТП (дополнительный креатив)
    {
      const y = RY + RH + G;
      s.card({ x: Cc.x, y, w: Cc.w, h: RH, tint: true });
      const t = 'Показываем коммуникацию* **Нормобакта** с демонстрацией ключевых УТП продукта для решения проблем с ЖКТ у ребенка';
      const note = '*дополнительный креатив';
      const th = measure(t, cw - ID - 20, 21, false, 1.25);
      const nh = measure(note, cw, 16);
      const top = y + (RH - (Math.max(ID, th) + 22 + nh)) / 2;
      s.icon('tb:TbShieldPlus', { x: Cc.x + pad, y: top, size: ID, circle: C.cyan });
      s.text(t, { x: Cc.x + pad + ID + 20, y: top, w: cw - ID - 20, size: 21, lh: 1.25, color: C.navy });
      s.text(note, { x: Cc.x + pad, y: top + Math.max(ID, th) + 22, w: cw, size: 16, lh: 1.2, color: C.blueText });
    }
    s.notes('В исходнике под картинкой (на слайде не виден): «Технический шаг: собираем аудитории в рамках запущенных кампаний брендов Боботик и Динобутин, далее на собранный сегмент показываем рекламу бренда Нормобакт с ключевым УТП».');
  },

  // =====================================================================
  // 15 · Нормобакт / Learnings 2026 → H2 и 2027 (аналоги — Acriol 12, Bobotic 12, Azelik 17)
  // =====================================================================
  15: (d) => {
    const s = d.slide({
      title: 'Нормобакт / Learnings 2026 → H2 и 2027',
      subtitle: 'Сильная performance- и ORM-база создаёт возможность расширять категорию через новые сценарии потребления',
    });
    // ── слева: что доказал 2026 ──
    const L = { x: X0, w: 862 };
    s.label('Что доказал 2026', { x: L.x, y: TOP, w: L.w, color: C.blue });
    const learn = [
      { t: 'Performance эффективно закрывает сформированный спрос', b: 'У бренда уже есть сильная конверсионная база — это фундамент для дальнейшего роста', k: '91 тыс. кликов  •  78 тыс. качественных визитов' },
      { t: 'ORM поддерживает выбор бренда', b: 'Высокий уровень доверия помогает принимать решение и снижает барьеры выбора', k: 'Рейтинг 4,6  •  80% позитивной выдачи' },
      { t: '«Проблемные» сценарии расширяют входы в категорию', b: 'Новые ситуации потребления дают дополнительные точки входа в категорию', k: '«Ротавирус» CTR 1,92%' },
      { t: 'Рост требует выхода за lower funnel', b: 'Одной конверсии существующего спроса недостаточно — нужен спрос до момента активного поиска.' },
    ];
    const tx = L.x + 76;
    const tw = L.w - 76;
    const sizes = { t: 20, b: 19, k: 24 };
    const hs = learn.map((l) => measure(l.t.toUpperCase(), tw, sizes.t, true, 1.1) + 8 + measure(l.b, tw, sizes.b)
      + (l.k ? 10 + measure(l.k, tw, sizes.k, true, 1.1) : 0));
    const y0 = TOP + 50;
    const gap = Math.floor((BOT - 6 - y0 - hs.reduce((a, b) => a + b, 0)) / (learn.length - 0.5));
    let y = y0 + 2;
    learn.forEach((l, i) => {
      if (i) s.hline(L.x, y - gap / 2, L.w);
      tag(s, `L${i + 1}`, { x: L.x, y: y - 3, w: 58, h: 42, size: 20 });
      const th = s.text(l.t.toUpperCase(), { x: tx, y, w: tw, size: sizes.t, bold: true, lh: 1.1, color: C.navy });
      const bh = s.text(l.b, { x: tx, y: y + th + 8, w: evenW(l.b, tw, sizes.b), size: sizes.b, lh: 1.2, color: C.blueText });
      if (l.k) s.text(l.k, { x: tx, y: y + th + 8 + bh + 10, w: tw, size: sizes.k, bold: true, lh: 1.1, color: C.crimson });
      y += hs[i] + gap;
    });

    // ── справа: что делаем с этим в H2 и 2027 ──
    const R = { x: 950, w: X1 - 950 };
    s.label('Что делаем с этим в H2 и 2027', { x: R.x, y: TOP, w: R.w, color: C.blue });
    const groups = [
      { pill: 'Continue', color: C.green, h: 'Always-on performance core', items: [
        ['L1', 'Performance-core продолжить как strong lower-funnel base: масштабировать при сохранении качества визита, расширение в сторону AI Visibility Stream'],
        ['L2', 'ORM сохранить как постоянную поддержку выбора и доверительный контур бренда, в 2027 переход на ORM Comprehensive occasion-based'],
      ] },
      { pill: 'Test Q4 2026', color: C.blue, h: 'AI & Data & Retail signals', items: [
        ['L3', 'Comprehensive-подход в Programmatic с персонализированными креативами\nна AI-clusters/signals'],
        ['L4', 'Проверяем, какие признаки потребности действительно повышают качество аудитории и конверсию (Retail Media & Data)'],
        ['L5', 'Decision Gate: media → post-click → CR / e-pharm → Sales Lift. Масштабируем в 2027 после подтверждения вклада в Q4 2026.'],
      ] },
    ];
    const gx = R.x + 24;
    const gw = R.w - 48;
    const pillW = 200;
    const iSize = 20;
    const iw = gw - 70;
    const iGap = 18;
    const gH = groups.map((g) => 44 + 22 + g.items.reduce((a, [, t]) => a + Math.max(36, measure(t, iw, iSize)) + iGap, 0) - iGap);
    // группы — в карточках до низа контента; свободное место делим поровну между карточками
    const CG = 22;
    const cp = 28;
    const extra = (BOT - (TOP + 50) - CG * (groups.length - 1) - gH.reduce((a, b) => a + b, 0) - cp * 2 * groups.length) / groups.length;
    let gy0 = TOP + 50;
    groups.forEach((g, i) => {
      const ch = gH[i] + cp * 2 + extra;
      s.card({ x: R.x - 4, y: gy0, w: X1 - R.x + 4, h: ch, tint: i === 1 });
      let gy = gy0 + cp + extra / 2;
      gy0 += ch + CG;
      s.box({ x: gx, y: gy, w: pillW, h: 44, fill: g.color, r: 22 });
      s.text(g.pill.toUpperCase(), { x: gx, y: gy, w: pillW, h: 44, size: 19, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
      s.text(g.h.toUpperCase(), { x: gx + pillW + 22, y: gy, w: gw - pillW - 22, h: 44, size: 22, bold: true, lh: 1.05, color: C.navy, valign: 'middle', fit: true, minSize: 17 });
      let iy = gy + 44 + 22;
      g.items.forEach(([l, t]) => {
        tag(s, l, { x: gx, y: iy, w: 52, h: 36, size: 17 });
        const h = s.text(t, { x: gx + 70, y: iy + 4, w: iw, size: iSize, lh: 1.2, color: C.blueText });
        iy += Math.max(36, h) + iGap;
      });
    });
  },
};
