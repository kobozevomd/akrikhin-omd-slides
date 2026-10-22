// Акримиколь · стратегия 2027 — часть E: слайды исходника 21–25.
// 21 — AI targeting в Programmatic (картинка → живой текст: сигналы → сегменты → креатив → оценка, тест H2 2026; как Azelik 52 / Bobotic 24),
// 22 — целевой таргетинг на Авито (картинка + живой текст; скриншот Авито и примеры форматов — вырезки e_*.png),
// 23 — Paid Search 2027 (картинка → живой текст; как Normobact 22 / Dinobutin 23),
// 24 — digital-календарь 2027 (своя сетка-гант, как Dinobutin 24 / Normobact 23),
// 25 — итог: что даёт рост инвестиций vs 2026 (как Dinobutin 27 / Normobact 24).
const path = require('path');
const { C, countLines, textWidth, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common'); // TOP, GRID
const K = require('./common');              // CROPS

const TOP = V.TOP;      // 221
const BOT0 = 1005;      // низ контента без плашки
const BOT1 = 905;       // низ контента над плашкой
const MUTED_TXT = '6E86AD';

// Этапы и слои — как в части D (слайды 16–17): CREATE / CAPTURE / REASSURE / CONVERT, ALWAYS ON / SPRINT
const STG = { CREATE: C.crimson, CAPTURE: C.blue, REASSURE: C.purple, CONVERT: C.green, AON: C.navy, SPRINT: C.crimson };

// ---------- Локальные хелперы (как в dinobutin/part_f.js) ----------
const view = (t) => typo(tr(String(t))).replace(/\*\*|\[\[|\]\]/g, '');
const measure = (t, w, size = 16, bold = false, lh = 1.2) => Math.round(countLines(view(t), size, w, bold) * size * lh);
const widthOf = (t, size, bold = false) => Math.ceil(textWidth(view(t), size, bold));
const sum = (a) => a.reduce((x, y) => x + y, 0);
// Число строк с учётом **жирных** кусков (как countLines, запас 3%)
const richLines = (t, size, w, bold = false) => {
  const s = typo(tr(String(t))).replace(/\[\[|\]\]/g, '');
  const max = w * 0.97;
  const sp = textWidth(' ', size, bold);
  let lines = 0;
  for (const para of s.split(/\n\n?/)) {
    lines++;
    let b = bold;
    let cur = 0;
    let word = 0;
    let pending = false;
    const flush = () => {
      if (!pending) return;
      if (cur === 0) cur = word;
      else if (cur + sp + word <= max) cur += sp + word;
      else { lines++; cur = word; }
      while (cur > max) { lines++; cur -= max; }
      word = 0;
      pending = false;
    };
    for (let i = 0; i < para.length; i++) {
      if (para.startsWith('**', i)) { b = !b; i++; continue; }
      if (para[i] === ' ') { flush(); continue; }
      word += textWidth(para[i], size, b);
      pending = true;
    }
    flush();
  }
  return lines;
};
const measureRich = (t, w, size = 16, bold = false, lh = 1.2) => Math.round(Math.max(countLines(view(t), size, w, bold), richLines(t, size, w, bold)) * size * lh);
// Ширина блока, при которой текст занимает столько же строк, но строки ровнее (без висящего слова)
const evenW = (t, w, size, bold = false) => {
  const n = countLines(view(t), size, w, bold);
  if (n < 2 || richLines(t, size, w, bold) > n) return w;
  let lo = w * 0.4;
  let hi = w;
  while (hi - lo > 1) { const m = (lo + hi) / 2; if (richLines(t, size, m, bold) <= n) hi = m; else lo = m; }
  return Math.min(w, Math.ceil(hi) + 4);
};
// Общий кегль для ряда чисел: самый крупный, при котором каждое влезает в свою ширину
const commonSize = (items, max, min, bold = true) => {
  let sz = max;
  while (sz > min && items.some(([t, w]) => widthOf(t, sz, bold) > w * 0.97)) sz -= 1;
  return sz;
};
// смешение цветов: k = доля второго цвета
const mix = (a, b, k) => [0, 2, 4].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - k) + parseInt(b.slice(i, i + 2), 16) * k)
  .toString(16).padStart(2, '0')).join('').toUpperCase();
const PINK_T = mix('FFFFFF', C.crimson, 0.1);

// Карточка с цветной шапкой: [номер] │ КАПС-заголовок [иконка справа] → y начала контента
const BAND = 64;
function bandCard(s, { x, y, w, h, color, n, title, icon, tint }) {
  s.card({ x, y, w, h, tint });
  s.box({ x, y, w, h: BAND, fill: color, r: 25 });
  s.box({ x, y: y + BAND / 2, w, h: BAND / 2, fill: color, r: 0 });
  let tx = x + 24;
  if (n !== undefined) {
    s.circle({ x: tx, y: y + (BAND - 42) / 2, d: 42, fill: C.white });
    s.text(String(n), { x: tx, y: y + (BAND - 42) / 2, w: 42, h: 42, size: 21, bold: true, lh: 1.0, color, align: 'center', valign: 'middle' });
    tx += 42 + 16;
    s.vline(tx, y + 16, BAND - 32, C.white, 1.5);
    tx += 16;
  }
  const iw = icon ? 34 : 0;
  if (icon) s.icon(icon, { x: x + w - 24 - iw, y: y + (BAND - iw) / 2, size: iw, color: C.white });
  s.text(title, { x: tx, y, w: x + w - 24 - iw - (icon ? 12 : 0) - tx, h: BAND, size: 21, bold: true, lh: 1.0, color: C.white, caps: true,
    valign: 'middle', fit: true, maxLines: 1, minSize: 15 });
  return y + BAND;
}

// Легенда календаря (правее — номер страницы)
function calLegend(s, items, y = 1034) {
  let x = 1790;
  [...items].reverse().forEach(([col, t]) => {
    const tw = widthOf(t, 15) + 6;
    x -= tw;
    s.text(t, { x, y, w: tw, size: 15, lh: 1.0, color: C.blueText });
    x -= 52;
    s.box({ x, y: y - 2, w: 42, h: 20, fill: col, r: 10 });
    x -= 30;
  });
}

module.exports = {
  // ===================== 21. AI targeting в Programmatic =====================
  21: (d) => {
    const s = d.slide({
      title: 'AI targeting в Programmatic: ищем аудиторию по сигналам проблемы',
      subtitle: 'Задача — превратить набор AI-сигналов (кластеры / контекстуальный таргетинг / пользовательские намерения) в сегменты и быстро определить связки, которые лучше переводят рекламный контакт в CR и покупку',
    });

    // --- четыре колонки: сигналы → сегменты → креатив → оценка ---
    const GAP = 36;
    const WS = [372, 300, 548, 548];
    const k = (1804 - 3 * GAP) / sum(WS);
    let cx = 58;
    const COL = WS.map((w) => { const c = { x: Math.round(cx), w: Math.round(w * k) }; cx += w * k + GAP; return c; });
    const CY = TOP;
    const CB = 684;
    const HEAD = [
      { t: 'Сигналы', color: C.cyan, icon: 'tb:TbBroadcast' },
      { t: 'Сегменты', color: C.blue, icon: 'tb:TbUsers' },
      { t: 'Креатив', color: C.navy, icon: 'tb:TbBulb' },
      { t: 'Оценка', color: C.crimson, icon: 'tb:TbChartBar' },
    ];
    const by = COL.map((c, i) => bandCard(s, { x: c.x, y: CY, w: c.w, h: CB - CY, color: HEAD[i].color, n: i + 1, title: HEAD[i].t, icon: HEAD[i].icon }));
    [0, 1, 2].forEach((i) => s.chevron({ cx: COL[i].x + COL[i].w + GAP / 2, cy: CY + BAND / 2 }));
    const PAD = 18;
    const ID = 44;

    // 1–2: плитки «иконка + текст»
    const tiles = (c, y0, items, color, { center = false, gap = 12 } = {}) => {
      const x = c.x + PAD;
      const w = c.w - 2 * PAD;
      const avail = CB - PAD - y0;
      const th = center ? 84 : (avail - gap * (items.length - 1)) / items.length;
      let y = center ? y0 + (avail - items.length * th - gap * (items.length - 1)) / 2 : y0;
      items.forEach(([ic, t]) => {
        s.box({ x, y, w, h: th, fill: C.cardTint, r: 15 });
        s.icon(ic, { x: x + 14, y: y + (th - ID) / 2, size: ID, circle: color, color: C.white });
        s.text(t, { x: x + 14 + ID + 14, y, w: w - 14 - ID - 14 - 10, h: th, size: 19, bold: true, lh: 1.1, color: C.navy, valign: 'middle', fit: true, maxLines: 2, minSize: 16 });
        y += th + gap;
      });
    };
    tiles(COL[0], by[0] + PAD, [
      ['tb:TbStethoscope', 'Симптомы'],
      ['tb:TbSwimming', 'Спорт / бассейн / сауна'],
      ['tb:TbPlane', 'Отпуск'],
      ['tb:TbSearch', 'История поиска лечения'],
    ], C.cyan);
    tiles(COL[1], by[1] + PAD, [
      ['tb:TbUsersGroup', 'Хроники'],
      ['tb:TbUser', 'Новички'],
    ], C.blue, { center: true, gap: 22 });

    // 3–4: строки «иконка │ ключ │ пояснение»
    const rows = (c, y0, items, color, keyColor, keyW, keySize) => {
      const x = c.x + PAD;
      const w = c.w - 2 * PAD;
      const rh = (CB - 8 - y0) / items.length;
      items.forEach(([ic, key, t], i) => {
        const y = y0 + i * rh;
        if (i) s.hline(x + ID + 12, y, w - ID - 12, C.line, 1.25);
        s.icon(ic, { x, y: y + (rh - ID) / 2, size: ID, circle: color, color: C.white });
        const kx = x + ID + 14;
        s.text(key, { x: kx, y, w: keyW, h: rh, size: keySize, bold: true, lh: 1.05, color: keyColor, valign: 'middle', fit: true, maxLines: 2, minSize: 14 });
        const dx = kx + keyW + 12;
        s.vline(dx, y + rh * 0.25, rh * 0.5, C.line, 1.5);
        s.text(t, { x: dx + 14, y, w: x + w - dx - 14, h: rh, size: 17, lh: 1.15, color: C.blueText, valign: 'middle', fit: true, maxLines: 2, minSize: 15 });
      });
    };
    rows(COL[2], by[2] + 6, [
      ['tb:TbSpeakerphone', 'Новички', 'первичное распознавание'],
      ['tb:TbBuilding', 'Новички', 'после отпуска / отеля'],
      ['tb:TbBarbell', 'Новички + Хроники', 'спортзал / бассейн / сауна'],
      ['tb:TbRefresh', 'Хроники', 'рецидив'],
      ['tb:TbShieldCheck', 'Хроники', 'современное решение'],
    ], C.navy, C.blue, 196, 18);
    rows(COL[3], by[3] + 6, [
      ['tb:TbChartBar', 'CTR', 'качество контакта'],
      ['tb:TbPointer', 'Post-click', 'глубина / переходы'],
      ['tb:TbSearch', 'Search lift', 'рост поискового интереса'],
      ['tb:TbFilter', 'CR', 'конверсия'],
      ['tb:TbShoppingCart', 'Sales / SL', 'бизнес-эффект'],
    ], C.crimson, C.navy, 150, 19);

    // --- результаты теста H2 2026 ---
    const RY = CB + 20;
    const RB = BOT1;
    s.card({ x: 58, y: RY, w: 1804, h: RB - RY, tint: true });
    s.icon('tb:TbChartBar', { x: 86, y: RY + 18, size: 32, color: C.blue });
    s.text('H2 2026 результаты теста AI DSP vs AI DMP, дерматология Акрихин', { x: 130, y: RY + 22, w: 1500, size: 21, bold: true, lh: 1.0, color: C.navy });
    const RS = [
      { ic: 'tb:TbChartBar', t: 'CTR [[+12,5%]]', d: '0,45% vs 0,40%' },
      { ic: 'tb:TbPointer', t: 'Качество post-click ↑', d: 'Bounce -3,6 p.p. | Depth +12% | Time +55%' },
      { ic: 'tb:TbShoppingCart', t: 'Совершение покупки ↑', d: '«Где купить» CR ×2,6 | 2,0% vs 0,8%' },
      { ic: 'tb:TbDatabase', t: 'Цена инвентаря ↓', d: 'CPM -20% | CPC -28% | CPV -33%' },
    ];
    const RW = [0.2, 0.28, 0.27, 0.25];
    const rx0 = 86;
    const rwAll = 1862 - 28 - rx0;
    const my = RY + 50;
    const mh = RB - 20 - my;
    let rx = rx0;
    RS.forEach((r, i) => {
      const w = RW[i] * rwAll;
      if (i) s.vline(rx - 18, my + 6, mh - 12, C.line, 1.5);
      const RD = 54;
      s.icon(r.ic, { x: rx, y: my + (mh - RD) / 2, size: RD, circle: PINK_T, color: C.crimson });
      const tx = rx + RD + 16;
      const tw = rx + w - 30 - tx;
      const h1 = 26;
      const h2 = measure(r.d, tw, 16);
      const ty = my + (mh - h1 - 6 - h2) / 2;
      s.text(r.t, { x: tx, y: ty, w: tw, size: 22, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 17 });
      s.text(r.d, { x: tx, y: ty + h1 + 6, w: tw, size: 16, lh: 1.2, color: C.blueText });
      rx += w;
    });

    s.principle({ label: 'Decision gate', icon: 'tb:TbTargetArrow', color: C.blue, x: 58, w: 1804,
      text: '**SCALE** — связки, которые дают качественный post-click / CR; **STOP** — сегменты без эффекта за 1-й месяц' });
  },

  // ===================== 22. Целевой таргетинг на Авито =====================
  22: (d) => {
    const s = d.slide({
      title: 'Целевой таргетинг на Авито',
      subtitle: 'Используем поведенческий контекст как триггер для поиска аудитории с повышенной вероятностью проблем кожи стоп',
    });

    // --- слева: скриншот Авито (вырезка из картинки исходника, 656×666) ---
    const IH = BOT1 - TOP - 24;
    const IW = Math.round(IH * 656 / 666);
    s.card({ x: 58, y: TOP, w: IW + 24, h: BOT1 - TOP });
    s.image(path.join(K.CROPS, 'e_avito.png'), { x: 70, y: TOP + 12, w: IW, h: IH, alt: 'Авито: подработка в Москве' });

    // --- справа: четыре пункта ---
    const X = 58 + IW + 24 + 22;
    const W = 1862 - X;
    const PAD = 24;
    const BD = 46;
    const tx = X + PAD + BD + 18;
    const tw = X + W - PAD - tx;
    const G = 14;
    const pill = (t, y) => {
      const pw = widthOf(t, 20, true) + 40;
      s.box({ x: X + W - PAD - pw, y, w: pw, h: 40, fill: PINK_T, r: 12 });
      s.text(t, { x: X + W - PAD - pw, y, w: pw, h: 40, size: 20, bold: true, lh: 1.0, color: C.crimson, align: 'center', valign: 'middle' });
      return pw;
    };
    const ITEMS = [
      { t: 'Пакет DMP-сегментов с учетом таргетинга на аудиторию', pill: '5M UU',
        b: ['МЖ 24–64', '**Подработка**, включенные категории: обслуживание покупателей, курьерская доставка, приготовление пищи, уборка, складские работы, сбор и выдача заказов, курьеры'] },
      { t: 'Почему этот сегмент «Новички + Хроники: весь день в обуви»',
        b: ['Длительное время на ногах — высокая ежедневная нагрузка на стопы', 'Закрытая рабочая обувь — тепло, влажность и трение повышают актуальность проблем кожи стоп', 'Повторяющийся рабочий контекст — фактор риска возникает регулярно, а не эпизодически'] },
      { t: 'Стратегическая гипотеза',
        p: 'Подработка → длительная смена на ногах → закрытая обувь / влажность / трение → выше актуальность проблем кожи стоп → **релевантные коммуникации Акримиколя**' },
      { t: 'Форматы', pill: '~CTR 0,16%', p: 'Медийный премиум + Медийный стандарт + Нативный баннер', imgs: true },
    ];
    const BS = 17;
    const TS = 20;
    const titleW = (it) => (it.pill ? tw - widthOf(it.pill, 20, true) - 40 - 16 : tw);
    const textH = ITEMS.map((it) => {
      const h1 = measure(it.t, titleW(it), TS, true, 1.1);
      const h2 = it.b ? sum(it.b.map((b) => measureRich(b, tw - 18, BS))) + 4 * (it.b.length - 1) : measureRich(it.p, tw, BS);
      return h1 + 8 + h2;
    });
    // форматы: три превью по высоте остатка
    const THUMBS = [['e_fmt_premium.png', 294, 175], ['e_fmt_standard.png', 230, 175], ['e_fmt_native.png', 182, 175]];
    const fixed = sum(textH.slice(0, 3).map((h) => Math.max(h, BD) + 2 * 20)) + 3 * G;
    const H4 = BOT1 - TOP - fixed;
    const thH = Math.min(175 * 1.0, H4 - 2 * 20 - textH[3] - 14);
    let y = TOP;
    ITEMS.forEach((it, i) => {
      const h = i < 3 ? Math.max(textH[i], BD) + 2 * 20 : H4;
      s.card({ x: X, y, w: W, h, tint: i === 3 });
      s.badge({ x: X + PAD, y: y + 18, d: BD, n: `0${i + 1}`, color: C.blue, size: 19 });
      let yy = y + 20;
      if (it.pill) pill(it.pill, y + 16);
      yy += s.text(it.t, { x: tx, y: yy, w: titleW(it), size: TS, bold: true, lh: 1.1, color: C.navy }) + 8;
      if (it.b) s.bullets(it.b, { x: tx, y: yy, w: tw, size: BS, gap: 4 });
      else yy += s.text(it.p, { x: tx, y: yy, w: evenW(it.p, tw, BS), size: BS, lh: 1.2, color: C.blueText }) + 14;
      if (it.imgs) {
        const tws = THUMBS.map(([, w, hh]) => Math.round(thH * w / hh));
        const gg = (tw - sum(tws)) / 2;
        let ix = tx;
        THUMBS.forEach(([f], j) => {
          s.image(path.join(K.CROPS, f), { x: ix, y: yy, w: tws[j], h: thH, alt: 'Пример формата на Авито' });
          ix += tws[j] + Math.min(gg, 40);
        });
      }
      y += h + G;
    });

    s.principle({ label: 'Главный принцип', icon: 'tb:TbChartBar', x: 58, w: 1804,
      text: 'Используем поведенческие сигналы и контекст интересов, чтобы находить аудиторию с повышенным риском проблем кожи стоп и показывать релевантные сообщения в момент, когда потребность наиболее актуальна' });
  },

  // ===================== 23. Paid Search 2027 =====================
  23: (d) => {
    const s = d.slide({
      title: 'Paid Search 2027: защищаем спрос и сокращаем путь до покупки',
      subtitle: 'AON-слой работает весь год: готовый спрос ведём в e-com, информационный — на персонализированные LPs на сайте; оптимизируем по конверсии и качеству трафика',
    });
    const CB = BOT1;
    const L = { x: 58, w: 1150 };
    const R = { x: L.x + L.w + 22, w: 1862 - (L.x + L.w + 22) };

    // --- слева: архитектура кампании 2027 ---
    {
      const y0 = bandCard(s, { x: L.x, y: TOP, w: L.w, h: CB - TOP, color: C.navy, title: 'Архитектура кампании 2027', icon: 'tb:TbRoute' });
      const x = L.x + 28;
      const w = L.w - 56;
      const HEADT = 'Маршрутизируем спрос по степени готовности к покупке';
      const sub = 'Чем выше намерение купить, тем короче путь пользователя. Информационный спрос сначала получает аргументы выбора.';
      const ROWS = [
        { k: 'High intent', c: C.crimson, sem: 'Бренд + транзакционные', to: 'Аптека.ру / e-com', path: 'готовый спрос → к покупке' },
        { k: 'Mid intent', c: C.blue, sem: 'Диагноз · симптомы · конкуренты · продукт', to: 'Сайт → блок аптек', path: 'изучение → доказательства → выбор' },
        { k: 'Discovery', c: C.green, sem: 'РСЯ / occasion-сигналы', to: 'Сайт', path: 'инкрементальный спрос → контроль качества' },
      ];
      const SEM = [[33, 'бренд + транзакционные', C.crimson], [19, 'диагноз', C.blue], [14, 'симптомы', C.cyan], [16, 'конкуренты', C.navy], [18, 'продукт', C.green]];
      const lt = 'Приоритет семантики внутри Search';
      const RH = 92;
      const RG = 12;
      const BH = 52;
      const hH = measure(HEADT, w, 25, true, 1.1);
      const sH = measure(sub, w, 18);
      const semH = 24 + 14 + BH + 8 + 20;
      const content = hH + 8 + sH + 3 * RH + 2 * RG + semH;
      const g = (CB - 26 - (y0 + 24) - content) / 2;
      let y = y0 + 24;
      y += s.text(HEADT, { x, y, w, size: 25, bold: true, lh: 1.1, color: C.navy }) + 8;
      y += s.text(sub, { x, y, w: evenW(sub, w, 18), size: 18, lh: 1.2, color: C.blueText }) + g;
      const KW = 160;
      const SW = 300;
      const DW = 210;
      const PW = w - 10 - KW - 24 - SW - 18 - DW - 18 - 16;
      ROWS.forEach((r) => {
        s.box({ x, y, w, h: RH, fill: C.white, stroke: C.line, sw: 1.5, r: 15 });
        let cx = x + 10;
        s.box({ x: cx, y: y + 10, w: KW, h: RH - 20, fill: mix('FFFFFF', r.c, 0.1), r: 12 });
        s.text(r.k, { x: cx + 6, y: y + 10, w: KW - 12, h: RH - 20, size: 18, bold: true, lh: 1.05, color: r.c, caps: true, align: 'center', valign: 'middle', fit: true, maxLines: 2, minSize: 14 });
        cx += KW + 24;
        s.text(r.sem, { x: cx, y, w: SW, h: RH, size: 19, bold: true, lh: 1.15, color: C.navy, valign: 'middle', fit: true, maxLines: 2, minSize: 15 });
        cx += SW + 18;
        s.text(r.to, { x: cx, y, w: DW, h: RH, size: 19, bold: true, lh: 1.15, color: r.c, valign: 'middle', fit: true, maxLines: 2, minSize: 15 });
        cx += DW + 18;
        s.text(r.path, { x: cx, y, w: PW, h: RH, size: 17, lh: 1.2, color: C.blueText, valign: 'middle', fit: true, maxLines: 2, minSize: 14 });
        y += RH + RG;
      });
      // приоритет семантики внутри Search
      y += g - RG;
      s.text(lt, { x, y, w, size: 20, bold: true, lh: 1.1, color: C.navy });
      y += 24 + 14;
      let px = x;
      const tot = sum(SEM.map((e) => e[0]));
      SEM.forEach(([v, t, c], i) => {
        const sw = w * v / tot - (i < SEM.length - 1 ? 4 : 0);
        s.box({ x: px, y, w: sw, h: BH, fill: c, r: 10 });
        s.text(`${v}%`, { x: px, y, w: sw, h: BH, size: 20, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
        s.text(t, { x: px - 10, y: y + BH + 8, w: sw + 20, size: 16, lh: 1.1, color: C.blueText, align: 'center', fit: true, maxLines: 1, minSize: 13 });
        px += sw + 4;
      });
    }

    // --- справа: оптимизация и KPI ---
    {
      const y0 = bandCard(s, { x: R.x, y: TOP, w: R.w, h: CB - TOP, color: C.crimson, title: 'Оптимизация и KPI', icon: 'tb:TbAdjustmentsHorizontal' });
      const x = R.x + 28;
      const w = R.w - 56;
      const HEADT = 'Search — основной conversion-layer';
      const sub = 'РСЯ сохраняем как контролируемый источник дополнительного спроса, но не масштабируем трафик без post-click эффекта.';
      const KP = [['Search', C.blue, 'CR 0,4%', 'CPA 4,46 тыс. ₽'], ['РСЯ', C.crimson, 'CR 0,2%', 'CPA 6,85 тыс. ₽']];
      const DR = [['Scale', C.green, '— растёт CR / снижается CPA'], ['Shift', C.blue, '— перераспределяем бюджет между семантиками'], ['Stop', C.crimson, '— ограничиваем РСЯ без quality / conversion эффекта']];
      const KH = 80;
      const dh = DR.map((r) => measure(r[2], w - 142, 17));
      const hH = measure(HEADT, w, 25, true, 1.1);
      const sH = measure(sub, w, 18);
      let y = y0 + 24;
      y += s.text(HEADT, { x, y, w, size: 25, bold: true, lh: 1.1, color: C.navy }) + 8;
      y += s.text(sub, { x, y, w: evenW(sub, w, 18), size: 18, lh: 1.2, color: C.blueText }) + 24;
      KP.forEach(([n, c, cr, cpa]) => {
        s.box({ x, y, w, h: KH, fill: C.white, stroke: C.line, sw: 1.5, r: 15 });
        s.text(n, { x: x + 24, y, w: 130, h: KH, size: 20, bold: true, lh: 1.0, color: c, caps: true, valign: 'middle' });
        s.text(cr, { x: x + 170, y, w: 150, h: KH, size: 26, bold: true, lh: 1.0, color: C.navy, valign: 'middle' });
        s.text(cpa, { x: x + 336, y, w: w - 356, h: KH, size: 19, lh: 1.0, color: C.blueText, valign: 'middle' });
        y += KH + 12;
      });
      // decision rules — во всю оставшуюся высоту
      y += 12;
      const DB = CB - 24;
      s.box({ x, y, w, h: DB - y, fill: C.cardTint, r: 15 });
      const inner = 26 + sum(dh);
      const dg = Math.min(26, (DB - y - 44 - inner) / 3);
      let yy = y + (DB - y - inner - 3 * dg) / 2;
      yy += s.text('Decision rules', { x: x + 22, y: yy, w: w - 44, size: 23, bold: true, lh: 1.1, color: C.navy }) + dg;
      DR.forEach(([k, c, t], i) => {
        s.text(k, { x: x + 22, y: yy, w: 90, size: 19, bold: true, lh: 1.15, color: c, caps: true });
        s.text(t, { x: x + 120, y: yy + 1, w: w - 142, size: 17, lh: 1.2, color: C.blueText });
        yy += dh[i] + dg;
      });
    }

    // --- 2027 transformation: плашка с четырьмя сдвигами ---
    {
      const y = 935;
      const h = 84;
      s.box({ x: 58, y, w: 1804, h, fill: C.navy, r: 25 });
      const lab = '2027 transformation';
      const lw = 210;
      s.text(lab, { x: 88, y, w: lw, h, size: 22, bold: true, lh: 1.05, color: C.white, caps: true, valign: 'middle', fit: true, maxLines: 2, minSize: 17 });
      const CH = [['Бренд + транзакционные → e-com', C.crimson], ['Диагноз / симптомы → сайт', C.blue], ['РСЯ → сайт, долю контролируем', C.green], ['Главный KPI → покупательское действие', C.navy]];
      const x0 = 88 + lw + 20;
      const g = 12;
      const cw = (1862 - 16 - x0 - g * 3) / 4;
      CH.forEach(([t, c], i) => {
        const cx = x0 + i * (cw + g);
        s.box({ x: cx, y: y + 12, w: cw, h: h - 24, fill: C.white, r: 15 });
        s.text(t, { x: cx + 12, y: y + 12, w: cw - 24, h: h - 24, size: 17, bold: true, lh: 1.1, color: c, align: 'center', valign: 'middle', fit: true, maxLines: 2, minSize: 14 });
      });
    }
  },

  // ===================== 24. Digital support calendar 2027 =====================
  24: (d) => {
    const s = d.slide({ title: 'Digital support calendar 2027: full-funnel flowchart Акримиколь' });

    // --- полоса KPI: бюджет со сплитом · медиа-KPI ---
    const KY = TOP;
    const KH = 150;
    const BW = 560;
    s.box({ x: 58, y: KY, w: BW, h: KH, fill: C.blue, r: 25 });
    s.text('Budget', { x: 88, y: KY + 22, w: 200, size: 18, bold: true, lh: 1.0, color: C.white, caps: true, fit: true, maxLines: 1, minSize: 14 });
    s.text('20M', { x: 88, y: KY + 56, w: 190, size: 66, bold: true, lh: 1.0, color: C.white, fit: true, maxLines: 1, minSize: 44 });
    const vx = 300;
    s.vline(vx, KY + 22, KH - 44, C.white, 1.5);
    const sx = vx + 22;
    const sw = 58 + BW - 28 - sx;
    s.text('Бюджетный сплит', { x: sx, y: KY + 18, w: sw, size: 14, bold: true, lh: 1.0, color: C.white, caps: true, fit: true, maxLines: 1, minSize: 11 });
    const SPLIT = [['Digital media', '16,6M'], ['Production', '2M'], ['Adriver', '900K'], ['Sales Lift', '500K']];
    SPLIT.forEach(([k, val], i) => {
      const y = KY + 42 + i * 25;
      s.text(k, { x: sx, y, w: sw - 80, size: 17, lh: 1.0, color: C.white });
      s.text(val, { x: sx + sw - 80, y, w: 80, size: 17, bold: true, lh: 1.0, color: C.white, align: 'right' });
    });
    // медиа-KPI
    const KX = 58 + BW + 22;
    const KW = 1862 - KX;
    s.card({ x: KX, y: KY, w: KW, h: KH });
    s.text('Media KPIs', { x: KX + 26, y: KY + 24, w: 300, size: 17, bold: true, lh: 1.0, color: C.crimson });
    const KPI = [['80M', 'Impressions'], ['12,5M', 'Tech. reach'], ['4,3M', 'Unique reach'], ['8M', 'Views'], ['290K', 'Clicks'], ['175K', 'Visits'], ['23,8K', 'Conversions\n«cookie-banner»']];
    const wts = [0.95, 1.0, 1.05, 0.8, 0.9, 0.9, 1.2];
    const kws = wts.map((k) => k * (KW - 40) / sum(wts));
    const ks = commonSize(KPI.map(([t], i) => [t, kws[i] - 18]), 34, 22);
    let kx = KX + 26;
    KPI.forEach(([val, name], i) => {
      if (i) s.vline(kx - 10, KY + 60, KH - 84);
      s.text(val, { x: kx, y: KY + 58, w: kws[i] - 18, size: ks, bold: true, lh: 1.0, color: C.navy });
      s.text(name, { x: kx, y: KY + 64 + ks, w: kws[i] - 18, h: 40, size: 15, lh: 1.15, color: C.blueText, fit: true, maxLines: 2, minSize: 13 });
      kx += kws[i];
    });

    // --- календарь: инфо-колонки + 12 месяцев ---
    // Периоды [от, до) в месяцах — по заливке ячеек таблицы исходника (ppt/slides/slide24.xml). В исходнике все залитые месяцы
    // одного цвета BAE0FF («буст / приоритетный флайт»), цвет «активный период» в сетке не встречается. Как во всех деках серии
    // (Dinobutin 24, Normobact 23): каналы ALWAYS ON — светлым «активным периодом» (act), SPRINT-каналы — малиновым бустом (boost).
    const ALL = [0, 12];
    const ROWS = [
      { ch: 'Display', sup: 'Авито', fmt: 'Медийные форматы', seg: 'Работа в обуви', bud: '2,1M', sob: '12%', boost: [[3, 9]] },
      { ch: 'OLV AI', sup: 'OLV', fmt: 'Instream video', seg: 'Общий (микросцены)', bud: '3,5M', sob: '20%', boost: [[2, 7]] },
      { ch: 'Programmatic', sup: 'Programmatic', fmt: 'Banner', seg: 'Хроники / Новички', bud: '3,4M', sob: '20%', boost: [[2, 7]] },
      { ch: 'Social', sup: 'MAX', fmt: 'Posts', seg: 'Хроники / Новички + Общий', bud: '1,2M', sob: '8%', boost: [[2, 9]] },
      { ch: 'Внешние публикации', sup: '', fmt: 'Статьи', seg: 'Общий', bud: '1M', sob: '6%', act: [[2, 11]] },
      { ch: 'GEO', sup: '', fmt: 'GEO-оптимизация\nпод AI-ответы', seg: 'Общий', bud: '1,7M', sob: '11%', act: [ALL] },
      { ch: 'ORM', sup: 'Reviews / forums\nSERP / e-pharm cards', fmt: 'Отзывы, обзоры, Q&A, дискуссии', seg: 'Общий', bud: '1,7M', sob: '11%', act: [ALL] },
      { ch: 'Paid Search', sup: 'Yandex Direct\ne-pharm co-promo', fmt: 'Текст + баннеры', seg: 'Расширенные сегменты', bud: '2M', sob: '12%', act: [ALL] },
    ];
    // Слои (в исходнике колонка «Этап» пустая) — по архитектуре кампании (слайд 16) и итогу (слайд 25):
    // Sprint — OLV + Programmatic + Social (+ Display на Авито, сегмент «работа в обуви»), AON — Search + GEO/AEO + ORM + внешние публикации
    const LAYERS = [['Sprint', STG.SPRINT, 0, 4], ['Always on', STG.AON, 4, 4]];
    const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const X0 = 58;
    const CW = { st: 130, ch: 168, sup: 180, fmt: 222, seg: 176, bud: 70, sob: 62 };
    const cx = {};
    let acc = X0;
    for (const k of Object.keys(CW)) { cx[k] = acc; acc += CW[k]; }
    const MX = acc;
    const MW = (1862 - MX) / 12;
    const PADX = 10;
    const FS = 15;
    const HY = KY + KH + 20;
    const HH = 40;
    const TH = 40;
    const rowT = ROWS.map((r) => Math.max(
      measure(r.ch, CW.ch - 2 * PADX, 16, true, 1.15),
      measure(r.sup, CW.sup - 2 * PADX, FS, false, 1.15),
      measure(r.fmt, CW.fmt - 2 * PADX, FS, false, 1.15),
      measure(r.seg, CW.seg - 2 * PADX, FS, false, 1.15)));
    let rowH = rowT.map((t) => Math.max(48, t + 16));
    const spare = BOT0 - TH - (HY + HH) - sum(rowH);
    rowH = rowH.map((h, i) => (spare > 0 ? h + spare / ROWS.length : Math.max(rowT[i] + 8, h + spare / ROWS.length)));
    // шапка
    s.box({ x: X0, y: HY, w: 1862 - X0, h: HH, fill: C.navy, r: 0 });
    const HEAD = [['Этап', 'st'], ['Канал', 'ch'], ['Поставщики', 'sup'], ['Формат', 'fmt'], ['Сегмент', 'seg'], ['Бюджет', 'bud'], ['SOB %', 'sob']];
    const num = (k) => k === 'bud' || k === 'sob';
    HEAD.forEach(([t, k]) => s.text(t.toUpperCase(), { x: cx[k] + PADX - (num(k) ? 6 : 0), y: HY, w: CW[k] - 2 * PADX + (num(k) ? 12 : 0), h: HH, size: 14, bold: true, lh: 1.0, color: C.white,
      valign: 'middle', align: num(k) ? 'center' : 'left', fit: true, maxLines: 1, minSize: 11 }));
    MON.forEach((t, i) => s.text(t, { x: MX + i * MW, y: HY, w: MW, h: HH, size: 14, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' }));
    const ys = [];
    let y = HY + HH;
    ROWS.forEach((r, i) => { ys.push(y); y += rowH[i]; });
    const yEnd = y;
    for (let i = 0; i <= 12; i++) s.vline(MX + i * MW, HY + HH, yEnd - HY - HH, i === 0 ? C.line : V.GRID, i === 0 ? 1.5 : 1.25);
    const bar = (a, b, yc, h, fill) => s.box({ x: MX + a * MW + 5, y: yc - h / 2, w: (b - a) * MW - 10, h, fill, r: h / 2 });
    ROWS.forEach((r, i) => {
      const y0 = ys[i];
      const h = rowH[i];
      if (i < ROWS.length - 1) s.hline(cx.ch, y0 + h, 1862 - cx.ch, C.line, 1.5);
      const cell = (k, t, o = {}) => s.text(t, { x: cx[k] + PADX, y: y0, w: CW[k] - 2 * PADX, h, size: o.size ?? FS, bold: !!o.bold, lh: 1.15,
        color: o.color ?? C.blueText, valign: 'middle', align: o.align ?? 'left' });
      cell('ch', r.ch, { size: 16, bold: true, color: C.navy });
      if (r.sup) cell('sup', r.sup);
      cell('fmt', r.fmt);
      cell('seg', r.seg);
      cell('bud', r.bud, { size: 16, bold: true, color: C.navy, align: 'center' });
      cell('sob', r.sob, { align: 'center' });
      (r.act || []).forEach(([a, b]) => bar(a, b, y0 + h / 2, 16, 'A6CDEE'));
      (r.boost || []).forEach(([a, b]) => bar(a, b, y0 + h / 2, 28, C.crimson));
    });
    // слои
    LAYERS.forEach(([t, col, i0, n]) => {
      const yy = ys[i0] + 4;
      const hh = ys[i0 + n - 1] + rowH[i0 + n - 1] - ys[i0] - 8;
      s.box({ x: X0 + 3, y: yy, w: CW.st - 10, h: hh, fill: col, r: 10 });
      s.text(t, { x: X0 + 14, y: yy, w: CW.st - 30, h: hh, size: 16, bold: true, lh: 1.1, color: C.white, caps: true, valign: 'middle', fit: true, maxLines: 3, minSize: 12 });
    });
    // итог
    s.box({ x: X0, y: yEnd, w: 1862 - X0, h: TH, fill: C.navy, r: 0 });
    s.text('TOTAL', { x: cx.ch + PADX, y: yEnd, w: CW.ch, h: TH, size: 16, bold: true, lh: 1.0, color: C.white, valign: 'middle' });
    s.text('16,6M', { x: cx.bud - 10, y: yEnd, w: CW.bud + 20, h: TH, size: 16, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
    s.text('100%', { x: cx.sob, y: yEnd, w: CW.sob, h: TH, size: 15, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });

    calLegend(s, [['A6CDEE', 'активный период'], [C.crimson, 'буст / приоритетный флайт']]);
    s.footnote('*Бюджет до НДС, включая АК/РС', { w: 900 });
    s.notes('Слайд 24 исходника: в таблице все залитые месяцы одного цвета (BAE0FF, «буст / приоритетный флайт»), цвета заливки не различались — каналы ALWAYS ON выглядели бустом на весь год. Здесь, как во всех деках серии: ALWAYS ON (внешние публикации, GEO, ORM, Paid Search) — светлый «активный период», SPRINT (Display, OLV AI, Programmatic, Social) — малиновый буст. Периоды месяцев — как в исходнике.');
  },

  // ===================== 25. Что даёт рост инвестиций vs 2026 =====================
  25: (d) => {
    const s = d.slide({ title: 'Акримиколь 2027', subtitle: 'Что даёт рост инвестиций vs 2026' });

    // --- четыре плитки ---
    const TILES = [
      { lab: 'Бизнес-цель 2027', v: '420 тыс. уп.', sub: '3,8% доля рынка · ≈ +14% volume', color: C.crimson },
      { lab: 'Инвестиции', v: '6 млн ₽ → 20 млн ₽', sub: '+233% vs 2026', color: C.blue },
      { lab: 'Тех. охват', v: '5,4M → 12,5M', sub: '+131% | Unique Reach 4,3M', color: C.navy2 },
      { lab: 'OLV knowledge-layer', v: 'F 5+ · 70% ядра ЦА', sub: 'Концентрированный охват в целевой географии', color: C.purple },
    ];
    const GAP = 22;
    const PAD = 28;
    const need = TILES.map((t) => Math.max(widthOf(t.v, 34, true), widthOf(t.sub, 17, true), widthOf(t.lab.toUpperCase(), 16, true)) + 2 * PAD + 8);
    const free = 1804 - 3 * GAP - sum(need);
    const tw = need.map((n) => n + free / TILES.length);
    const TH = 136;
    const tvs = commonSize(TILES.map((t, i) => [t.v, tw[i] - 2 * PAD]), 40, 26);
    let tx = 58;
    TILES.forEach((t, i) => {
      const w = tw[i];
      s.box({ x: tx, y: TOP, w, h: TH, fill: t.color, r: 25 });
      s.text(t.lab, { x: tx + PAD, y: TOP + 22, w: w - 2 * PAD, size: 16, bold: true, lh: 1.0, color: C.white, caps: true, fit: true, maxLines: 1, minSize: 13 });
      s.text(t.v, { x: tx + PAD, y: TOP + 50, w: w - 2 * PAD, size: tvs, bold: true, lh: 1.0, color: C.white });
      s.text(t.sub, { x: tx + PAD, y: TOP + 100, w: w - 2 * PAD, size: 17, bold: true, lh: 1.0, color: C.white, fit: true, maxLines: 1, minSize: 13 });
      tx += w + GAP;
    });

    // --- нижняя часть: как расширяем Comprehensive (над плашкой) ---
    const LEFT = 'От Search-first\nк full-funnel';
    const BODY = '**OLV** формирует знание в приоритетной географии продаж, **Programmatic / Social** активируют релевантные жизненные ситуации, **GEO/AEO + ORM + внешние публикации** укрепляют выбор, **Paid Search** переводит сформированный спрос в e-pharm во время сезонных акций.';
    const LBW = 330;
    const BX = 58 + LBW + 22;
    const BWd = 1862 - 28 - BX;
    const BS = 19;
    const sbH = measureRich(BODY, BWd, BS) + 48;
    const SBY = BOT1 - sbH;
    const SLY = SBY - 38;

    // --- середина: как масштабируем · зоны расширения ---
    const MY = TOP + TH + 20;
    const MH = SLY - 20 - MY;
    const L = { x: 58, w: 960 };
    s.card({ x: L.x, y: MY, w: L.w, h: MH });
    const lx = L.x + 28;
    const lw = L.w - 56;
    s.label('Как масштабируем Comprehensive в 2027', { x: lx, y: MY + 22, w: lw, size: 20, color: C.blue });
    // фазы года: AON янв–фев · SPRINT + AON март–авг · AON сен–дек (ширина — по числу месяцев)
    const PH = [['AON', 'янв–фев', 2, STG.AON], ['Sprint + AON', 'март–авг', 6, STG.SPRINT], ['AON', 'сен–дек', 4, STG.AON]];
    const pg = 8;
    const pwAll = lw - pg * 2;
    const py = MY + 62;
    const PHH = 52;
    let px = lx;
    PH.forEach(([t, per, m, col]) => {
      const w = pwAll * m / 12;
      s.box({ x: px, y: py, w, h: PHH, fill: col, r: 12 });
      s.text(t, { x: px + 6, y: py, w: w - 12, h: PHH, size: 19, bold: true, lh: 1.0, color: C.white, caps: true, align: 'center', valign: 'middle', fit: true, maxLines: 1, minSize: 13 });
      s.text(per, { x: px, y: py + PHH + 8, w, size: 16, bold: true, lh: 1.0, color: MUTED_TXT, align: 'center' });
      px += w + pg;
    });
    const NOTES = [
      [STG.AON, '**AON** защищает и конвертирует сформированный спрос круглый год'],
      [STG.SPRINT, '**Sprint** создает новый пользовательский спрос в сезонный пик, строим знание о бренде'],
    ];
    const MIX = ['**AON:** Search + GEO/AEO + ORM + внешние публикации', '**Sprint:** OLV + Programmatic + Social'];
    const ntw = lw - 22;
    const nh = NOTES.map(([, t]) => measureRich(t, ntw, 19));
    const mixH = sum(MIX.map((t) => measureRich(t, lw, 18))) + 4;
    const nTop = py + PHH + 6 + 18 + 18;
    const nBot = MY + MH - 22;
    const ng = Math.max(12, (nBot - nTop - sum(nh) - mixH) / 3);
    let ny = nTop + ng / 2;
    NOTES.forEach(([col, t], i) => {
      s.box({ x: lx, y: ny, w: 6, h: nh[i], fill: col, r: 0 });
      s.text(t, { x: lx + 22, y: ny, w: evenW(t, ntw, 19), size: 19, lh: 1.2, color: C.navy });
      ny += nh[i] + ng / 2;
    });
    ny += ng / 2;
    MIX.forEach((t) => { ny += s.text(t, { x: lx, y: ny, w: lw, size: 18, lh: 1.2, color: MUTED_TXT }) + 4; });

    const R = { x: L.x + L.w + 22, w: 1862 - (L.x + L.w + 22) };
    s.card({ x: R.x, y: MY, w: R.w, h: MH });
    const rx = R.x + 28;
    const rw = R.w - 56;
    s.label('Зоны расширения', { x: rx, y: MY + 22, w: rw, size: 20, color: C.blue });
    const ZN = [
      { st: 'New demand & occasions', t: 'Расширение сегментов Новички и Хроники через оккейжены' },
      { st: 'OLV + AI video production', t: 'AI-video для расширения покрытия инвентаря и охвата в целевой географии max доли продаж' },
      { st: 'AI visibility & conversion', t: 'GEO/AEO + ORM + публикации + Search; high-intent спрос ведём в e-pharm' },
    ];
    const bd = 44;
    const otx = rx + bd + 18;
    const otw = rx + rw - otx;
    const parts = ZN.map((o) => [measure(o.st.toUpperCase(), otw, 19, true, 1.05), measure(o.t, otw, 17)]);
    const oh = parts.map((p) => Math.max(p[0] + 6 + p[1], bd));
    const oy0 = MY + 64;
    const ogap = (MY + MH - 22 - oy0 - sum(oh)) / (ZN.length - 1);
    let oy = oy0;
    ZN.forEach((o, i) => {
      const [h1, h2] = parts[i];
      s.badge({ x: rx, y: oy, d: bd, n: `0${i + 1}`, color: C.crimson, size: 17 });
      const ty = oy + Math.max(0, (bd - (h1 + 6 + h2)) / 2);
      s.text(o.st, { x: otx, y: ty, w: otw, size: 19, bold: true, lh: 1.05, color: C.navy, caps: true });
      s.text(o.t, { x: otx, y: ty + h1 + 6, w: evenW(o.t, otw, 17), size: 17, lh: 1.2, color: C.blueText });
      if (i < ZN.length - 1) s.hline(otx, oy + oh[i] + ogap / 2, otw, C.line, 1.25);
      oy += oh[i] + ogap;
    });

    // --- как расширяем Comprehensive в 2027 ---
    s.label('Как расширяем Comprehensive в 2027', { x: 58, y: SLY, w: 1804, size: 20, color: C.blue });
    s.card({ x: 58, y: SBY, w: 1804, h: sbH, tint: true });
    s.box({ x: 58 + 14, y: SBY + 14, w: LBW - 14, h: sbH - 28, fill: C.navy, r: 15 });
    s.text(LEFT, { x: 58 + 34, y: SBY + 14, w: LBW - 54, h: sbH - 28, size: 20, bold: true, lh: 1.1, color: C.white, caps: true, valign: 'middle', fit: true, maxLines: 3, minSize: 15 });
    s.text(BODY, { x: BX, y: SBY + 24, w: BWd, size: BS, lh: 1.2, color: C.navy });

    s.formula({ text: 'Каналы работают как единый путь CREATE → CAPTURE → REASSURE → CONVERT', color: C.crimson, size: 24, x: 58, w: 1804 });
  },
};
