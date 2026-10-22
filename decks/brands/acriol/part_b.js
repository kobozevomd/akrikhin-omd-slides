// Акриол Про · стратегия 2027 — часть B: слайды исходника 8–12.
// 8 — защита от выхода Глейсы (сравнение + что меняем + тактическая модель);
// 9 — стратегический ответ: три направления + 8 контактов;
// 10 — география 2027: ядро / рост / распределение 65-20-15 (подложку исходника не переносим);
// 11 — сезонность 2027: продажи 2025 и календарь давления на одной оси месяцев + роль инструментов;
// 12 — learnings H1 2026 → continue / start / stop.
// «Акриол Про» пишем с неразрывным пробелом ( ): иначе typo() принимает «Про» за предлог
// и приклеивает его к следующему слову, а бренд рвётся между строками.
const path = require('path');
const { C, ACCENTS, CHART_COLORS, columns, IN, PT, chartMap, textWidth, fitSize, countLines, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT, MUTED, GRID, fmt, pct, statTile, numMark, legend, yearAxis, gridY
const SRC = path.join(__dirname, '..', '..', '..', 'work', 'brands', 'acriol', 'src');
const MEDIA = path.join(SRC, 'media');

const TOP = V.TOP;   // 221 — верх контента
const CB = 905;      // низ контента над плашкой
const X0 = 58;
const X1 = 1862;

// Высота и ширина текста так же, как их оценивает s.text — по переведённой строке (tr), чтобы EN-сборка
// пересчитывала геометрию под свой текст
const plainTr = (text) => typo(tr(String(text))).replace(/\*\*|\[\[|\]\]/g, '');
const measure = (text, w, size = 18, bold = false, lh = 1.2) =>
  Math.round(countLines(plainTr(text), size, w, bold) * size * lh);
const widthOf = (text, size, bold = false) => textWidth(plainTr(text), size, bold);

// Плитка-ярлык «L1»: тёмная, белый жирный текст по центру
function tag(s, text, { x, y, w = 52, h = 34, size = 16, fill = C.navy }) {
  s.box({ x, y, w, h, fill, r: 8 });
  s.text(text, { x, y, w, h, size, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
}

// Модель контактов на тёмной полосе: белые плитки-слагаемые «3 + 4 + 1» и итог «8».
// items: [{ n, label, text? }]. С text — плитки делят ширину поровну, подпись слева (title), итог справа «= 8 …».
// Без text (totalFirst) — компактно: «8 … → 3 + 4 + 1», плитки по ширине содержимого, всё по центру полосы.
function contactModel(s, { x = X0, y, w = X1 - X0, h, title, items, total, totalLabel, totalFirst = false }) {
  s.box({ x, y, w, h, fill: C.navy, r: 20 });
  const pad = 34;
  const opW = 56;
  const mid = y + h / 2;
  // плитки с пояснением чуть выше (поле 10 вместо 14), чтобы двухстрочная подпись не прижималась к низу
  const withText = items.some((it) => it.text);
  const ty = y + (withText ? 10 : 14);
  const th = h - (withText ? 20 : 28);
  const op = (ch, at) => s.text(ch, { x: at, y: mid - 24, w: opW, size: 40, bold: true, lh: 1.0, color: C.white, align: 'center' });
  const numW = (n) => Math.ceil(textWidth(String(n), 52, true)) + 10;
  const totNumW = Math.ceil(textWidth(String(total), 64, true)) + 8;
  // ширина подписи итога по тексту: в одну строку, если короткая, иначе в две (по самому длинному слову)
  const labFull = Math.ceil(widthOf(totalLabel, 20, true));
  const totLabW = labFull <= 260 ? labFull + 10 : Math.ceil(Math.max(...plainTr(totalLabel).split(/\s+/).map((wd) => textWidth(wd, 20, true)))) + 12;
  const drawTotal = (tx) => {
    s.text(String(total), { x: tx, y: mid - 39, w: totNumW, size: 64, bold: true, lh: 1.1, color: C.white });
    s.text(totalLabel, { x: tx + totNumW + 14, y: mid - 30, w: totLabW, h: 60, size: 20, bold: true, lh: 1.15, color: C.white, valign: 'middle', fit: true, minSize: 16 });
  };
  const tile = (it, tx, tw, dhMax = 0) => {
    s.box({ x: tx, y: ty, w: tw, h: th, fill: C.white, r: 15 });
    const nw = numW(it.n);
    s.text(String(it.n), { x: tx + 22, y: mid - 31, w: nw, size: 52, bold: true, lh: 1.1, color: C.crimson });
    const lx = tx + 22 + nw + 10;
    const lw = tx + tw - 16 - lx;
    if (it.text) {
      // заголовки всех плиток на одной линии: блок центрируется по самой высокой подписи
      const by = ty + (th - (22 + 6 + dhMax)) / 2;
      s.text(it.label.toUpperCase(), { x: lx, y: by, w: lw, size: 19, bold: true, lh: 1.0, color: C.blue });
      s.text(it.text, { x: lx, y: by + 28, w: lw, h: dhMax + 4, size: 18, bold: true, lh: 1.15, color: C.navy });
    } else {
      s.text(it.label, { x: lx, y: ty, w: lw, h: th, size: 24, bold: true, lh: 1.1, color: C.navy, valign: 'middle', fit: true, minSize: 18 });
    }
  };
  if (totalFirst) {
    const tws = items.map((it) => 22 + numW(it.n) + 10 + Math.ceil(widthOf(it.label, 24, true)) + 40);
    const totalW = totNumW + 14 + totLabW + opW + tws.reduce((a, b) => a + b, 0) + opW * (items.length - 1);
    let cx = x + (w - totalW) / 2;
    drawTotal(cx);
    cx += totNumW + 14 + totLabW;
    s.text('→', { x: cx, y: mid - 24, w: opW, size: 40, bold: true, lh: 1.0, color: C.white, align: 'center' });
    cx += opW;
    items.forEach((it, i) => {
      tile(it, cx, tws[i]);
      cx += tws[i];
      if (i < items.length - 1) { op('+', cx); cx += opW; }
    });
    return;
  }
  let cx = x + pad;
  if (title) {
    s.text(title, { x: cx, y: y + 12, w: 230, h: h - 24, size: 22, bold: true, lh: 1.1, color: C.white, valign: 'middle', caps: true, fit: true, minSize: 18 });
    cx += 250;
  }
  const endX = x + w - pad - (totNumW + 14 + totLabW) - opW;
  const n = items.length;
  const tw = (endX - cx - opW * (n - 1)) / n;
  const lwT = tw - 22 - numW(9) - 10 - 16;
  const dhMax = Math.max(...items.map((it) => (it.text ? measure(it.text, lwT, 18, true, 1.15) : 0)));
  items.forEach((it, i) => {
    const tx = cx + i * (tw + opW);
    tile(it, tx, tw, dhMax);
    if (i < n - 1) op('+', tx + tw);
  });
  op('=', endX);
  drawTotal(endX + opW);
}

module.exports = {
  // =====================================================================
  // 8 · Как защитить Акриол Про от выхода Глейсы
  // =====================================================================
  8: (d) => {
    const s = d.slide({
      title: 'Как защитить Акриол Про от выхода Глейсы',
      subtitle: 'У нового конкурента совпадает ключевой фарм-код, поэтому защита должна строиться на профессиональном предпочтении, а не только на статусе ЛП',
    });

    // ── слева: сравнение. Колонка Акриол Про выделена, совпадающие строки отмечены «=» ──
    const K = { x: X0, w: 226 };
    const A = { x: X0 + 238, w: 300 };
    const EQ = { x: A.x + A.w, w: 50 };
    const G = { x: EQ.x + EQ.w, w: 300 };
    const tR = G.x + G.w;                       // 946
    const tB = 760;
    s.label('Акриол Про vs Глейса', { x: X0, y: TOP, w: tR - X0, color: C.blue });
    const hY = TOP + 42;
    const hH = 50;
    const rows = [
      { k: 'Состав', a: 'Лидокаин + прилокаин\n2,5% + 2,5%', g: 'Лидокаин + прилокаин\n25 + 25 мг/г', eq: true },
      { k: 'Статус', a: 'Лекарственный препарат;\nбезрецептурный', g: 'Лекарственный препарат;\nбезрецептурный', eq: true },
      { k: 'Регистрация', a: 'Акриол Про на рынке\nс 2017 года', g: 'РУ от 27.04.2026;\nновый бренд' },
      { k: 'Фасовки', a: '5 / 30 / 100 г', g: '5 / 30 / 100 г', eq: true },
      { k: 'Профессиональная база', a: '9+ лет опыта;\nсформированная привычка', g: 'Нужно сформировать\nпрофессиональное доверие' },
      { k: 'Ключевой актив', a: 'Накопленный опыт,\nдоверие, рабочая привычка', g: 'Новизна + ресурс\nкрупной фармгруппы' },
    ];
    const rY = hY + hH + 6;
    const rH = (tB - rY) / rows.length;
    s.box({ x: A.x, y: hY, w: A.w, h: tB - hY, fill: C.cardTint, r: 15 });
    s.text('Критерий', { x: K.x, y: hY, w: K.w, h: hH, size: 18, bold: true, color: C.blueText, valign: 'middle' });
    s.box({ x: A.x, y: hY, w: A.w, h: hH, fill: C.blue, r: 15 });
    s.text('Акриол Про', { x: A.x + 20, y: hY, w: A.w - 40, h: hH, size: 22, bold: true, color: C.white, valign: 'middle' });
    s.box({ x: G.x, y: hY, w: G.w, h: hH, fill: C.navy, r: 15 });
    s.text('Глейса', { x: G.x + 20, y: hY, w: G.w - 40, h: hH, size: 22, bold: true, color: C.white, valign: 'middle' });
    rows.forEach((r, i) => {
      const y = rY + i * rH;
      if (i > 0) s.hline(K.x, y, tR - K.x);
      s.text(r.k, { x: K.x, y, w: K.w - 10, h: rH, size: 19, bold: true, lh: 1.1, color: C.navy, valign: 'middle' });
      s.text(r.a, { x: A.x + 20, y, w: A.w - 28, h: rH, size: 18, bold: !r.eq, lh: 1.2, color: r.eq ? C.blueText : C.navy, valign: 'middle' });
      s.text(r.g, { x: G.x + 20, y, w: G.w - 28, h: rH, size: 18, lh: 1.2, color: C.blueText, valign: 'middle' });
      if (r.eq) {
        const dd = 34;
        s.circle({ x: EQ.x + (EQ.w - dd) / 2, y: y + (rH - dd) / 2, d: dd, fill: C.tint });
        s.text('=', { x: EQ.x, y: y + (rH - dd) / 2, w: EQ.w, h: dd, size: 24, bold: true, lh: 1.0, color: C.blue, align: 'center', valign: 'middle' });
      }
    });

    // ── справа: что меняем в защите ──
    const R = { x: 1010, w: X1 - 1010 };
    s.label('Что меняем в защите', { x: R.x, y: TOP, w: R.w, color: C.blue });
    const mY = hY;
    const mH = 150;
    s.box({ x: R.x, y: mY, w: R.w, h: mH, fill: C.crimson, r: 15 });
    s.text('Не «мы тоже ЛП»', { x: R.x + 30, y: mY + 22, w: R.w - 60, size: 22, bold: true, lh: 1.0, color: C.white, caps: true });
    s.arrow({ dir: 'right', x: R.x + 32, y: mY + 96, len: 40, head: 30, headLen: 18, stem: 6, color: C.white });
    s.text('«Акриол Про уже встроен в работу специалиста»', { x: R.x + 92, y: mY + 56, w: R.w - 122, h: mH - 72, size: 30, bold: true, lh: 1.1, color: C.white, valign: 'middle', fit: true, minSize: 24 });
    s.steps([
      { title: 'Own the criteria', text: 'Заранее задаём критерии выбора: опыт, предсказуемость, удобство процесса, фасовки, доступность, экономика процедуры.' },
      { title: 'Build preference', text: 'DOL + экспертный контент + кейсы процедур. Закрепляем Акриол Про как привычный профессиональный инструмент ДО усиления конкуренции.' },
      { title: 'Defend consideration', text: 'Search, GEO/AEO, HCP-среда и ретаргетинг забирают момент сравнения: категория + конкурентные запросы + образовательные сценарии.' },
    ].map((it) => ({ ...it, title: it.title.toUpperCase() })), { x: R.x, y: mY + mH + 30, w: R.w, pitch: 'auto', size: 18, gap: 22, d: 42 });

    // ── тактическая модель: 3 + 4 + 1 = 8 контактов в месяц ──
    contactModel(s, {
      y: 784, h: CB - 784, title: 'Тактическая модель',
      items: [
        { n: 3, label: 'Awareness', text: 'Охват + экспертность' },
        { n: 4, label: 'Consideration', text: 'GEO/AEO + публикации + Search' },
        { n: 1, label: 'Conversion', text: 'Search + e-com' },
      ],
      total: 8, totalLabel: 'контактов / мес.',
    });

    s.principle({ x: X0, w: X1 - X0, icon: 'flow', label: 'Логика',
      text: 'заранее сформировать профессиональное предпочтение → удержать момент сравнения → расширить использование' });
  },

  // =====================================================================
  // 9 · Стратегический ответ на усиление конкурентов
  // =====================================================================
  9: (d) => {
    const s = d.slide({
      title: 'Стратегический ответ на усиление конкурентов',
      subtitle: 'Защищаем Акриол Про не от конкретного игрока, а от переключения - заранее укрепляем профессиональное предпочтение',
    });
    const cols = columns(3, { gap: 23 });
    const data = [
      { t: 'Build the moat', h: 'Закрепляем Акриол Про\nв профессиональной среде ДО усиления конкуренции', color: C.blue,
        items: ['DOL и экспертные мнения врачей', 'Кейсы и разборы процедур', 'Критерии выбора анестетика', 'Преимущества зарегистрированного ЛП'] },
      { t: 'Defend consideration', h: 'Не отдаем момент сравнения новому ЛС', color: C.crimson, tint: true,
        items: ['Search и образовательные сценарии', 'Авторитетные публикации в HCP-контуре', 'Фокус на профессиональных критериях выбора', 'Усиление присутствия при росте давления'] },
      { t: 'Expand & protect', h: 'Расширяем территорию использования и дополнительные точки контакта', color: C.blue,
        items: ['Аппаратная косметология — ключевая зона роста', 'Переводим «профессиональность» с косметики на критерии процедуры', 'Эпиляция / ПМ / тату — отдельные причины выбора', 'Поддерживаем самостоятельный спрос'] },
    ];
    const cardB = 792;
    const pad = 34;
    const cw = cols[0].w - pad * 2;
    const bd = 60;
    const tY = TOP + 30;
    const hY = tY + bd + 26;
    const hSize = 27;
    const hH = Math.max(...data.map((c) => measure(c.h, cw, hSize, true, 1.15)));
    const lineY = hY + hH + 24;
    const iSize = 22;
    const iw = cw - 36;
    const rowH = data[0].items.map((_, k) => Math.max(...data.map((c) => measure(c.items[k], iw, iSize))));
    const iY = lineY + 26;
    const iGap = Math.min(44, Math.floor((cardB - 30 - iY - rowH.reduce((a, b) => a + b, 0)) / (rowH.length - 1)));
    cols.forEach((col, i) => {
      const c = data[i];
      const x = col.x + pad;
      s.card({ x: col.x, y: TOP, w: col.w, h: cardB - TOP, tint: c.tint });
      s.badge({ x, y: tY, d: bd, n: `0${i + 1}`, color: c.color, size: 26 });
      s.text(c.t.toUpperCase(), { x: x + bd + 20, y: tY, w: cw - bd - 20, h: bd, size: 30, bold: true, lh: 1.05, color: c.color, valign: 'middle', fit: true, minSize: 24, maxLines: 1 });
      s.text(c.h, { x, y: hY, w: cw, size: hSize, bold: true, lh: 1.15, color: C.navy });
      s.hline(x, lineY, cw);
      let y = iY;
      c.items.forEach((it, k) => {
        s.circle({ x, y: y + 6, d: 16, fill: c.color });
        s.text(it, { x: x + 36, y, w: iw, size: iSize, lh: 1.2, color: C.blueText });
        y += rowH[k] + iGap;
      });
    });

    contactModel(s, {
      y: 810, h: CB - 810, totalFirst: true,
      items: [{ n: 3, label: 'Awareness' }, { n: 4, label: 'Consideration' }, { n: 1, label: 'Conversion' }],
      total: 8, totalLabel: 'качественных контактов',
    });

    s.principle({ x: X0, w: X1 - X0, icon: 'flow', label: 'Главная логика',
      text: 'Заранее формируем профессиональное предпочтение → удерживаем consideration → расширяем использование' });
  },

  // =====================================================================
  // 10 · География 2027: система весов
  // =====================================================================
  10: (d) => {
    const s = d.slide({
      title: 'География 2027: система весов внутри национальной кампании для медиа-активаций',
      subtitle: 'Paid Search - поддержка национального слоя',
    });
    const cols = columns(3, { gap: 23 });
    const pad = 34;
    const bd = 56;
    const cardB = CB;
    const head = (col, n, text, color) => {
      s.badge({ x: col.x + pad, y: TOP + 28, d: bd, n, color, size: 28 });
      s.text(text, { x: col.x + pad + bd + 18, y: TOP + 28, w: col.w - pad * 2 - bd - 18, h: bd, size: 28, bold: true, lh: 1.05, color: C.navy, valign: 'middle', fit: true, minSize: 22 });
    };
    const leadY = TOP + 28 + bd + 24;
    const leadSize = 20;
    const cw = cols[0].w - pad * 2;
    const leads = [
      '9 крупнейших регионов формируют две трети H1’26 и растут двузначно - концентрируем максимальный вес в Sprint 1 и 2',
      '6 территорий уже растут быстрее ядра. Их доля продаж пока мала, поэтому здесь оправдан повышающий коэффициент к медийному весу',
      'Гео-веса применяем к медийным инструментам; нижняя воронка остается национальной',
    ];
    const leadH = Math.max(...leads.map((t) => measure(t, cw, leadSize)));

    // колонки 1–2: три цифры + список регионов
    const geo = [
      { n: 1, t: 'Коммерческое ядро', color: C.blue, ink: C.blue,
        stats: [['Доля продаж', '66,6%', 'H1’26'], ['YoY', '+12,5%', 'H1’26 vs H1’25'], ['Регионов', '9', 'первый приоритет']],
        list: 'Ядро первого приоритета',
        regions: ['Москва + МО', 'Санкт-Петербург + ЛО', 'Свердловская обл.', 'Краснодарский край', 'Челябинская обл.', 'Ростовская обл.', 'Новосибирская обл.', 'Пермский край', 'Башкортостан'] },
      { n: 2, t: 'География роста', color: C.cyan, ink: C.teal,
        stats: [['Доля продаж', '7,0%', 'H1’26'], ['YoY', '+26,4%', 'агрегировано'], ['Регионов', '6', 'точки роста']],
        list: 'Усиление / рост',
        regions: ['Хабаровский край', 'Воронежская обл.', 'Ставропольский край', 'Красноярский край', 'Омская обл.', 'Алтайский край'] },
    ];
    const stY = leadY + leadH + 32;
    const stH = 124;
    const listY = stY + stH + 36;
    geo.forEach((g, i) => {
      const col = cols[i];
      const x = col.x + pad;
      s.card({ x: col.x, y: TOP, w: col.w, h: cardB - TOP });
      head(col, g.n, g.t, g.color);
      s.text(leads[i], { x, y: leadY, w: cw, size: leadSize, lh: 1.2, color: C.blueText });
      // три цифры без коробок, через тонкие разделители
      const sws = [cw * 0.33, cw * 0.36, cw * 0.31];
      let sx0 = x;
      g.stats.forEach(([lab, val, sub], k) => {
        const sw = sws[k];
        const sx = sx0 + (k ? 18 : 0);
        if (k) s.vline(sx0, stY, stH, C.line, 1.5);
        s.text(lab.toUpperCase(), { x: sx, y: stY, w: sw - 22, size: 16, bold: true, lh: 1.0, color: C.blueText });
        s.text(val, { x: sx, y: stY + 26, w: sw - 20, size: 40, bold: true, lh: 1.05, color: k === 1 ? C.green : g.ink, fit: true, minSize: 32, maxLines: 1 });
        s.text(sub, { x: sx, y: stY + 80, w: sw - 22, size: 16, lh: 1.15, color: C.blueText });
        sx0 += sw;
      });
      s.hline(x, listY - 20, cw);
      s.label(g.list, { x, y: listY, w: cw, size: 20, color: g.ink });
      // два столбца; шаг строки — по более высокому из пары (длинное название в EN уйдёт на 2 строки)
      const half = Math.ceil(g.regions.length / 2);
      const rw = cw / 2 - 28;
      let cy = listY + 42;
      for (let k = 0; k < half; k++) {
        const pair = [g.regions[k], g.regions[half + k]].filter(Boolean);
        pair.forEach((r, j) => {
          const cx = x + (j ? cw / 2 + 6 : 0);
          s.circle({ x: cx, y: cy + 8, d: 10, fill: g.color });
          s.text(r, { x: cx + 22, y: cy, w: rw, size: 20, lh: 1.15, color: C.navy });
        });
        cy += Math.max(...pair.map((r) => measure(r, rw, 20, false, 1.15))) + 19;
      }
    });

    // колонка 3: распределение инвестиций — одна полоса 100% + три строки с цифрами
    const col = cols[2];
    const x = col.x + pad;
    s.card({ x: col.x, y: TOP, w: col.w, h: cardB - TOP, tint: true });
    head(col, 3, 'Распределение инвестиций', C.crimson);
    s.text(leads[2], { x, y: leadY, w: cw, size: leadSize, lh: 1.2, color: C.blueText });
    const split = [
      { v: 65, name: 'Ядро', sub: 'максимальный вес в Sprint', color: C.blue, ink: C.blue },
      { v: 20, name: 'Рост', sub: 'дополнительное давление', color: C.cyan, ink: C.teal },
      { v: 15, name: 'Остальная РФ', sub: 'базовое присутствие', color: V.MUTED, ink: C.navy },
    ];
    const bY = stY;
    const bH = 58;
    s.chart('bar', split.map((p) => ({ name: p.name, labels: ['2027'], values: [p.v] })), {
      x: x - 6, y: bY - 6, w: cw + 12, h: bH + 12, plot: { x, y: bY, w: cw, h: bH }, min: 0, max: 100,
      stacked: true, gap: 0, legend: false, values: false,
      colors: split.map((p) => p.color), extra: { catAxisHidden: true, catAxisLineShow: false } });
    let acc = 0;
    split.forEach((p) => {
      const sx = x + (cw * acc) / 100;
      const sw = (cw * p.v) / 100;
      s.text(`${p.v}%`, { x: sx, y: bY, w: sw, h: bH, size: 22, bold: true, lh: 1.0, color: p.color === V.MUTED ? C.navy : C.white, align: 'center', valign: 'middle' });
      acc += p.v;
    });
    let ry = bY + bH + 34;
    split.forEach((p, k) => {
      if (k) s.hline(x, ry - 16, cw);
      s.text(`${p.v}%`, { x, y: ry, w: 130, size: 44, bold: true, lh: 1.05, color: p.ink });
      s.text(p.name.toUpperCase(), { x: x + 150, y: ry + 2, w: cw - 150, size: 20, bold: true, lh: 1.0, color: C.navy });
      s.text(p.sub, { x: x + 150, y: ry + 28, w: cw - 150, size: 18, lh: 1.2, color: C.blueText });
      ry += 88;
    });
    s.hline(x, ry - 16, cw);
    s.text('Paid Search - РФ always-on; гео-веса для Programmatic (HCP-signals) и Social (MAX)', { x, y: ry + 4, w: cw, h: cardB - 26 - ry - 4, size: 19, bold: true, lh: 1.2, color: C.navy, fit: true, minSize: 16 });

    s.principle({ x: X0, w: X1 - X0, icon: 'target', label: 'Планировочный принцип',
      text: '65% защищают коммерческое ядро → 20% ускоряют доказанные точки роста → 15% сохраняют национальное присутствие' });
  },

  // =====================================================================
  // 11 · Сезонность 2027
  // =====================================================================
  11: (d) => {
    const s = d.slide({ title: 'Сезонность 2027: усиливаем охват в периоды роста продаж, между флайтами - конвертируем сформированный спрос' });
    const MONTHS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    // «Продажи 2025, М ₽» — в исходнике нарисованы фигурами, значения — из подписей столбиков
    const SALES = [37.9, 47.5, 58.1, 62.5, 64.8, 62.1, 42.8, 37.2, 47.7, 58.7, 66, 75.8];
    // фазы календаря по месяцам: 0 — AON, 1 — Sprint, 2 — Capture (как в календаре исходника)
    const PH = [0, 0, 1, 1, 1, 2, 0, 0, 1, 1, 1, 2];
    const PHC = [V.MUTED, C.blue, C.cyan];
    // высоты столбиков «рекомендуемого давления» — схема исходника (px его фигур), значений нет
    const PRESS = [40, 40, 118, 118, 118, 75, 52, 52, 118, 118, 118, 75];

    // ── карточка: продажи и календарь на одной оси месяцев ──
    const topB = 628;
    const L = { x: X0, w: 1196 };
    s.card({ x: L.x, y: TOP, w: L.w, h: topB - TOP });
    const gx = 340;
    const gw = L.x + L.w - 28 - gx;
    const P = { x: gx, y: 338, w: gw, h: 112 };
    const m = chartMap('col', 12, P, 0, 80);
    const bandTop = TOP + 22;
    const bandB = topB - 54;
    // полосы спринтов — через оба ряда
    [[2, 4, 'Sprint 1'], [8, 10, 'Sprint 2']].forEach(([a, b, t]) => {
      const bx = m.cat(a) - m.step / 2 + 3;
      const bw = m.cat(b) + m.step / 2 - 3 - bx;
      s.box({ x: bx, y: bandTop, w: bw, h: bandB - bandTop, fill: C.cardTint, r: 12 });
      s.box({ x: bx + 10, y: bandTop + 10, w: bw - 20, h: 34, fill: C.blue, r: 17 });
      s.text(t.toUpperCase(), { x: bx + 10, y: bandTop + 10, w: bw - 20, h: 34, size: 18, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
    });
    s.chart('col', [{ name: 'Продажи 2025, млн ₽', labels: MONTHS, values: SALES }], {
      x: P.x - 10, y: P.y - 40, w: P.w + 20, h: P.h + 50, plot: P, min: 0, max: 80, gap: 45, legend: false,
      format: '0.0', labelSize: 16, labelBold: true, colors: [C.navy], extra: { catAxisHidden: true } });
    const axY = P.y + P.h;
    s.seg(P.x, axY, P.x + P.w, axY, { color: C.line, width: 2 });
    MONTHS.forEach((mo, i) => s.text(mo, { x: m.cat(i) - 40, y: axY + 8, w: 80, size: 17, bold: true, color: C.navy, align: 'center' }));
    // ряд 2: рекомендуемое медиа-давление (схема, цвет — фаза)
    const cBase = bandB - 14;
    const cMax = 78;
    const bwid = m.step * 0.55;
    s.seg(P.x, cBase, P.x + P.w, cBase, { color: C.line, width: 2 });
    PRESS.forEach((v, i) => {
      const hh = Math.round((v / 118) * cMax);
      s.box({ x: m.cat(i) - bwid / 2, y: cBase - hh, w: bwid, h: hh, fill: PHC[PH[i]], r: 4 });
    });
    s.text('База → max давление → усиленный спрос → max давление', { x: P.x, y: bandB + 12, w: P.w, size: 18, bold: true, color: C.navy, align: 'center' });
    // подписи рядов слева
    const lx = L.x + 34;
    const lw = gx - 24 - lx;
    s.text('Продажи 2025, млн ₽', { x: lx, y: P.y - 8, w: lw, size: 21, bold: true, lh: 1.1, color: C.blue, caps: true });
    s.text('Сезонный ориентир', { x: lx, y: P.y + 52, w: lw, size: 17, lh: 1.2, color: C.blueText });
    const r2 = cBase - cMax;
    s.text('Календарь продвижения', { x: lx, y: r2 - 6, w: lw, size: 21, bold: true, lh: 1.1, color: C.blue, caps: true });
    s.text('Рекомендуемое\nмедиа-давление', { x: lx, y: r2 + 50, w: lw, size: 17, lh: 1.2, color: C.blueText });

    // ── справа: цифры сезонности ──
    const R = { x: L.x + L.w + 22, w: X1 - (L.x + L.w + 22) };
    s.card({ x: R.x, y: TOP, w: R.w, h: topB - TOP, tint: true });
    const rx = R.x + 30;
    const rw = R.w - 60;
    s.label('Сезонность спроса и продаж', { x: rx, y: TOP + 30, w: rw, size: 20, color: C.blue });
    const stats = [['H1’26 sell-in', '+10,6%', 'vs H1’25'], ['Мар–май', '59%', 'продаж H1’26'], ['Wordstat', '+54%', 'июн–авг vs янв–фев']];
    const sws = [rw * 0.34, rw * 0.28, rw * 0.38];
    const sy = TOP + 76;
    let sx0 = rx;
    stats.forEach(([lab, val, sub], k) => {
      const sw = sws[k];
      const sx = sx0 + (k ? 16 : 0);
      if (k) s.vline(sx0, sy, 112, C.line, 1.5);
      s.text(lab.toUpperCase(), { x: sx, y: sy, w: sw - 18, size: 15, bold: true, lh: 1.0, color: C.blueText });
      s.text(val, { x: sx, y: sy + 24, w: sw - 16, size: 40, bold: true, lh: 1.05, color: C.blue, fit: true, minSize: 30, maxLines: 1 });
      s.text(sub, { x: sx, y: sy + 76, w: sw - 18, size: 15, lh: 1.15, color: C.blueText });
      sx0 += sw;
    });
    s.hline(rx, sy + 134, rw);
    s.text('Продажи формируют два выраженных пика: весенний рост март–июнь и максимальный Q4; июль–август — окно сезонной просадки, когда важно конвертировать высокий поисковый интерес в покупку.',
      { x: rx, y: sy + 156, w: rw, h: topB - 26 - (sy + 156), size: 20, lh: 1.25, color: C.navy, fit: true, minSize: 16 });

    // ── роль инструментов по фазам календаря ──
    const bY = topB + 20;
    s.card({ x: X0, y: bY, w: X1 - X0, h: CB - bY });
    const blx = X0 + 34;
    s.text('Роль инструментов', { x: blx, y: bY + 30, w: 196, h: 120, size: 22, bold: true, lh: 1.1, color: C.blue, caps: true, fit: true, minSize: 17 });
    const ph = [
      { name: 'AON', color: V.MUTED, periods: [['Янв–фев, июл–авг', 'забираем спрос']],
        tools: 'GEO/AEO · ORM · Внешние публикации\n· Paid Search', text: 'Всегда присутствуем в моменте выбора и забираем сформированный спрос' },
      { name: 'Sprint 1 и 2', color: C.blue, periods: [['Мар–май · Sprint 1', 'max охват · рост аппаратки'], ['Сен–ноя · Sprint 2', 'max охват · защита доли']],
        tools: 'DOLs · Programmatic', text: 'Формируем знание и закрепляем Акриол Про в профессиональном выборе' },
      { name: 'Capture · усиление спроса', color: C.cyan, periods: [['Июнь, дек', 'конвертация спроса в покупку · retargeting']],
        tools: 'Paid Search + Retargeting', text: 'В июне и декабре акцент на поиске, e-com CTA и возврате заинтересованных пользователей' },
    ];
    const pc = columns(3, { x0: blx + 220, x1: X1 - 34, gap: 44 });
    pc.forEach((c, i) => {
      const p = ph[i];
      let y = bY + 30;
      if (i) s.vline(c.x - 22, bY + 26, CB - bY - 52, C.line, 1.5);
      s.box({ x: c.x, y: y + 1, w: 22, h: 22, fill: p.color, r: 4 });
      s.text(p.name.toUpperCase(), { x: c.x + 34, y, w: c.w - 34, size: 22, bold: true, lh: 1.05, color: C.navy });
      y += 40;
      p.periods.forEach(([per, act]) => {
        const pw = Math.ceil(widthOf(per, 17, true)) + 12;
        s.text(per, { x: c.x, y, w: pw, size: 17, bold: true, lh: 1.2, color: C.blue });
        const ah = s.text(act, { x: c.x + pw + 6, y, w: c.w - pw - 6, size: 17, lh: 1.2, color: C.blueText });
        y += Math.max(21, ah) + 6;
      });
      y += 10;
      const th = s.text(p.tools, { x: c.x, y, w: c.w, size: 19, bold: true, lh: 1.15, color: C.navy });
      y += th + 8;
      s.text(p.text, { x: c.x, y, w: c.w, size: 17, lh: 1.2, color: C.blueText });
    });

    s.formula({ text: 'Охват усиливаем в коммерческие пики', w: 1236 });
  },

  // =====================================================================
  // 12 · Learnings H1 2026 → H2 2026 и 2027
  // =====================================================================
  12: (d) => {
    // «Главный вывод:» в начале подзаголовка снят: место подзаголовка и есть главный вывод, а целиком он не влезал в 2 строки
    const s = d.slide({
      title: 'Acriol Pro: learnings H1 2026 → H2 2026 и 2027',
      subtitle: 'Нижняя воронка уже работает; в 2027 масштабируем доказанные механики, новые инвестиции - после подтверждения бизнес-эффекта сегментной коммуникации в Programmatic по итогам H2 2026',
    });
    // ── слева: что доказал 2026 ──
    const L = { x: X0, w: 862 };
    s.label('Что доказал 2026', { x: L.x, y: TOP, w: L.w, color: C.blue });
    const learn = [
      { t: 'Search — доказанное performance-ядро', b: 'Competitive дал 5% CR «Где купить», Transaction — 4% в корзину и 1% в покупку. Поиск уже закрывает выбор бренда и аптечную конверсию.', k: '5% CR  •  4% корзина  •  1% покупка' },
      { t: 'РСЯ работает после оптимизации, а не «сама по себе»', b: 'К июню качество заметно улучшилось: отказы 60%→38%, время 0:24→0:36; CR «Где купить» вырос. Масштаб оправдан только при сохранении post-click качества.', k: 'BR 60→38%  •  time +50%' },
      { t: 'TG / MAX — перспективное расширение, но тест был коротким', b: 'За 2 недели получено 160 конверсий «Где купить» и сильный post-click. Для уверенного масштабирования нужен более длинный период и более широкая структура таргетингов.', k: '160 конверсий  •  2 недели' },
      { t: 'Вклад верхней воронки в продажи пока не доказан', b: 'H1 был в основном performance-led. Снижение поддержки в апреле–июне совпало со снижением доли продаж 71%→66%, но прямую связь это не подтверждает.', k: '71% → 66% доля продаж' },
    ];
    const tx = L.x + 72;
    const tw = L.w - 72;
    const sizes = { t: 20, b: 18, k: 21 };
    const hs = learn.map((l) => measure(l.t.toUpperCase(), tw, sizes.t, true, 1.1) + 6 + measure(l.b, tw, sizes.b) + 8 + measure(l.k, tw, sizes.k, true, 1.1));
    const y0 = TOP + 46;
    const gap = Math.floor((CB - y0 - hs.reduce((a, b) => a + b, 0)) / learn.length);
    let y = y0 + 2;
    learn.forEach((l, i) => {
      if (i) s.hline(L.x, y - gap / 2, L.w);
      tag(s, `L${i + 1}`, { x: L.x, y: y - 3, w: 56, h: 40, size: 19 });
      const th = s.text(l.t.toUpperCase(), { x: tx, y, w: tw, size: sizes.t, bold: true, lh: 1.1, color: C.navy });
      const bh = s.text(l.b, { x: tx, y: y + th + 6, w: tw, size: sizes.b, lh: 1.2, color: C.blueText });
      s.text(l.k, { x: tx, y: y + th + 6 + bh + 8, w: tw, size: sizes.k, bold: true, lh: 1.1, color: C.crimson });
      y += hs[i] + gap;
    });

    // ── справа: что делаем с этим в 2027 ──
    const R = { x: 950, w: X1 - 950 };
    s.vline(R.x - 20, TOP, CB - TOP, C.line, 1.5);
    s.label('Что делаем с этим в 2027', { x: R.x + 10, y: TOP, w: R.w, color: C.blue });
    const groups = [
      { pill: 'Continue', color: C.green, h: 'Масштабировать то, что уже доказало вклад', items: [
        ['L1', 'Paid Search оставить always-on ядром: приоритет Transaction; оптимизировать по CR и аптечным действиям, а не только по кликам'],
        ['L2', 'РСЯ масштабировать при сохранении результата по BR / времени / CR'],
        ['L3', 'TG / MAX продолжить как конверсионное расширение — более длинными флайтами и с расширенным пулом тематик'],
      ] },
      { pill: 'Start in H2 26', color: C.blue, h: 'Добавить то, чего не хватало для роста', items: [
        ['L4', 'В рамках второго полугодия запустили репрезентативный comprehensive-тест на «Мастеров» и «Потребителей»: персонализированная коммуникация + измерение Sales Lift'],
        ['L4', 'GEO / AEO вести как pilot с заранее заданным decision gate: SOV в AI-ответах, упоминания бренда и динамика брендового спроса'],
      ] },
      { pill: 'Stop', color: C.crimson, h: 'Не масштабировать без доказательства', items: [
        ['L2', 'Не наращивать РСЯ только из-за низкого CPC или объёма кликов — без сохранения post-click качества'],
        ['L3', 'Не увеличивать охватные инвестиции только по media KPI — бизнес-вклад должен подтверждаться Sales Lift / инкрементальностью'],
        ['L4', 'Не повторяем в 2027 году опыт с площадками, которые плохо себя показали в рамках 2026 года'],
      ] },
    ];
    const gx = R.x + 10;
    const gw = R.w - 10;
    const pillW = 200;
    const iSize = 18;
    const iw = gw - 66;
    const iGap = 12;
    const gH = groups.map((g) => 40 + 16 + g.items.reduce((a, [, t]) => a + Math.max(34, measure(t, iw, iSize)) + iGap, 0) - iGap);
    const gGap = Math.floor((CB - (TOP + 46) - gH.reduce((a, b) => a + b, 0)) / groups.length);
    let gy = TOP + 46 + 2;
    groups.forEach((g, i) => {
      if (i) s.hline(gx, gy - gGap / 2, gw);
      s.box({ x: gx, y: gy, w: pillW, h: 40, fill: g.color, r: 20 });
      s.text(g.pill.toUpperCase(), { x: gx, y: gy, w: pillW, h: 40, size: 18, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
      s.text(g.h.toUpperCase(), { x: gx + pillW + 20, y: gy, w: gw - pillW - 20, h: 40, size: 20, bold: true, lh: 1.05, color: C.navy, valign: 'middle', fit: true, minSize: 17 });
      let iy = gy + 40 + 16;
      g.items.forEach(([l, t]) => {
        tag(s, l, { x: gx, y: iy, w: 48, h: 32, size: 15 });
        const h = s.text(t, { x: gx + 66, y: iy + 3, w: iw, size: iSize, lh: 1.2, color: C.blueText });
        iy += Math.max(34, h) + iGap;
      });
      gy += gH[i] + gGap;
    });

    s.principle({ x: X0, w: X1 - X0, icon: 'tb:TbTrendingUp', label: '2027 = controlled scaling',
      text: 'Search / РСЯ / TG-MAX масштабируем по доказанной эффективности; comprehensive и GEO/AEO — только после прохождения business decision gate' });
    s.footnote('Источник: DigitalBudget, IQVIA');
  },
};
