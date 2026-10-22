// Азелик · стратегия 2027 — часть F: слайды исходника 39–45
// (архитектура кампании vs 2026, DOOH: новая территория и тест, спецпроекты «Синхронизация» и Clatch,
//  персонализация креатива, Sprint 2027: каналы и сплит)
const path = require('path');
const L = require('../../../lib/akrikhin');
const { C, ACCENTS, CHART_COLORS, columns, IN, PT, chartMap, textWidth, fitSize, countLines, typo } = L;
const V = require('../../variants/common');               // TOP, BOT, MUTED, GRID, fmt, pct, statTile, numMark, legend, yearAxis, gridY
const A = require('./common');                            // SRC, MEDIA, CROPS, stageTag, STAGE
const { MEDIA, CROPS } = A;
// CROPS/f_*.png — вырезки из картинок исходника (обрезка как srcRect исходника, скругление углов прозрачностью)

const TOP = 221;
const BOT = 1005;
const MUTED_TXT = '8A9BB3';   // «погашенные» строки (серые в исходнике)

// Ширина / число строк так, как текст окажется на слайде (с переводом и типографикой)
const strip = (t) => String(t).replace(/\*\*|\[\[|\]\]/g, '');
const wOf = (t, size, bold = false) => textWidth(typo(strip(L.tr(t))), size, bold);
const linesOf = (t, size, w, bold = false) => countLines(typo(strip(L.tr(t))), size, w, bold);
const hOf = (t, size, w, bold = false, lh = 1.2) => Math.round(linesOf(t, size, w, bold) * size * lh);
// Ширина блока, при которой текст занимает столько же строк, но строки ровнее — без висящего последнего слова
const evenW = (t, w, size, bold = false) => {
  const n = linesOf(t, size, w, bold);
  if (n < 2) return w;
  let lo = w * 0.4;
  let hi = w;
  while (hi - lo > 1) { const m = (lo + hi) / 2; if (linesOf(t, size, m, bold) <= n) hi = m; else lo = m; }
  return Math.min(w, Math.ceil(hi) + 4);
};

// Ярлык статуса (NEW) — как в деках Acriol Pro и Clindovit
function tag(s, t, x, y, { size = 14, h = 26, fill } = {}) {
  const w = Math.ceil(wOf(t, size, true)) + 20;
  s.box({ x, y, w, h, fill: fill ?? (t === 'NEW' ? C.crimson : C.blue), r: h / 2 });
  s.text(t, { x, y, w, h, size, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
  return w;
}

// Список каналов / сегментов: строка + ярлык статуса сразу после неё; { t, muted } — серая строка
function chanList(s, items, { x, y, w, size = 17, pitch = 24 }) {
  items.forEach((it, i) => {
    const o = Array.isArray(it) ? { t: it[0], tag: it[1] } : typeof it === 'string' ? { t: it } : it;
    const yy = y + i * pitch;
    const tagW = o.tag ? Math.ceil(wOf(o.tag, 14, true)) + 20 : 0;
    const maxW = w - (o.tag ? tagW + 10 : 0);
    s.text(o.t, { x, y: yy, w: maxW, size, color: o.muted ? MUTED_TXT : C.navy, fit: true, maxLines: 1, minSize: 14 });
    if (o.tag) tag(s, o.tag, x + Math.min(Math.ceil(wOf(o.t, size)), maxW) + 10, yy + Math.round((size * 1.2 - 24) / 2), { h: 24, size: 13 });
  });
}

// Плашка «ярлык: значение» (роль, период спецпроекта)
function chip(s, { x, y, h = 54, icon, text }) {
  const w = Math.ceil(wOf(text, 19, true)) + 46 + (icon ? 44 : 0);
  s.box({ x, y, w, h, fill: C.cardTint, r: h / 2 });
  let tx = x + 22;
  if (icon) { s.icon(icon, { x: tx, y: y + (h - 30) / 2, size: 30, color: C.blue }); tx += 42; }
  s.text(text, { x: tx, y, w: w - (tx - x) - 14, h, size: 19, lh: 1.0, color: C.navy, valign: 'middle' });
  return w;
}

module.exports = {
  // ===================== 39 · Архитектура кампании 2027 vs 2026 (аналог Clindovit 12, Acriol 14) =====================
  39: (d) => {
    const s = d.slide({ title: 'Азелик 2027: архитектура кампании vs 2026' });
    const LB = { x: 58, w: 180 };      // метки слоёв
    const CA = { x: 254, w: 630 };     // 2026
    const CB = { x: 1018, w: 844 };    // 2027
    const G = { x: CA.x + CA.w, w: CB.x - CA.x - CA.w };   // зазор со стрелками прироста

    // ---- шапки колонок: год и бюджет тотал (в одну строку — слайд плотный) ----
    const head = (X, year, value, color) => {
      const yw = Math.ceil(wOf(year, 26, true)) + 4;
      s.text(year, { x: X.x, y: 241, w: yw, size: 26, bold: true, lh: 1.0, color });
      const vx = X.x + yw + 16;
      const vw = Math.ceil(wOf(value, 50, true)) + 6;
      s.text(value, { x: vx, y: 221, w: vw, size: 50, bold: true, lh: 1.0, color });
      // звёздочка — ссылка на сноску о тех. костах
      s.text('млн ₽*', { x: vx + vw + 8, y: 241, w: Math.ceil(wOf('млн ₽*', 26, true)) + 8, size: 26, bold: true, lh: 1.0, color });
    };
    head(CA, '2026', '110', C.navy);
    head(CB, '2027', '160', C.crimson);

    const rows = [
      { label: 'RECRUITMENT / EXPAND THE CATEGORY', icon: 'tb:TbUsersPlus', color: A.STAGE.EXPAND, delta: '+1,7 млн ₽',
        a: { title: 'Recruitment: использование сегментов пилота 2025', budget: '32,8 млн ₽',
          lists: [['Каналы', ['OLV + CTV', 'Programmatic', 'Native / E-com', 'Bloggers / Paid Search']],
            ['Сегменты', ['Ж 25–44 с акне и постакне', 'Ж 18–40 делают пилинг', 'Ж 30–50 с розацеа', 'Подростки 12–18', 'Потребители cosmetic & medical care']]] },
        b: { title: 'Expand: удерживаем спрос между спринтами и расширяем аудиторию', budget: '34,5 млн ₽',
          lists: [['Каналы', ['OLV', ['DOOH', 'NEW'], 'Programmatic', 'Native TGB', ['Special projects', 'NEW'], 'ORM / GEO|AEO']],
            ['Сегменты', ['Все 18–40 акне, постакне', 'Подростки 12–18', ['Ж 40+ акне, предменопауза', 'NEW']]]] } },
      { label: 'SPRINT', icon: 'tb:TbBolt', color: A.STAGE.SPRINT, delta: '+41,2 млн ₽',
        a: { title: 'Sprint: усиливаем защиту лидерства от Skinoclear среди молодой аудитории', budget: '57,5 млн ₽',
          period: 'мар–апр; авг–сен: широкий тест сегментов',
          lists: [['Каналы', ['CTV', 'OLV / Programmatic', 'Display (Thematic)', 'Bloggers / TG Ads', 'Paid Search']],
            ['Сегменты', ['Ж 18–34 пробуют новые средства', 'Social girl 18–34', 'Skinoclear 18–34 негативный опыт', 'Студенты 18–34 самостоятельный уход',
              { t: 'М 18–25 с проблемной кожей', muted: true }, { t: 'М 18–25 спортуход', muted: true }]]] },
        b: { title: 'Sprint: усиливаем защиту лидерства от Skinoclear среди молодой аудитории', budget: '98,7 млн ₽',
          period: 'фев–май; июл–окт: фокус на проверенные сегменты',
          lists: [['Каналы', ['OLV / Programmatic', 'Bloggers', 'Paid Search', 'CTV']],
            ['Сегменты', ['Ж 18–34 пробуют новые средства', 'Social girl 18–34', 'Skinoclear 18–34 негативный опыт', 'М 18–34 с проблемной кожей',
              ['Ж 18–34 чувствительная кожа', 'NEW']]]] } },
      { label: 'FREQUENCY', icon: 'tb:TbRepeat', color: A.STAGE.FREQUENCY, delta: '+4,7 млн ₽',
        a: { title: 'Frequency: повторный контакт и поддержка спроса', budget: '10,2 млн ₽',
          lists: [['Каналы', ['ORM', 'GEO|AEO', 'Programmatic retargeting', 'Paid Search'], 2]] },
        b: { title: 'Frequency: увеличиваем частоту использования через дообучение', budget: '14,9 млн ₽',
          lists: [['Каналы', [['Native Promopages', 'NEW'], 'Paid Search (+ Clindovit visitors)', 'Programmatic retargeting | ОФД'], 2]] } },
    ];

    const PAD = 26;
    const BS = 28;     // кегль бюджета блока
    const TS = 18;     // кегль заголовка блока
    const PS = 17;     // кегль периода и списков
    const SPLIT = { a: 0.4, b: 0.46 };
    const geo = (X, c) => {
      const pw = X.w - PAD * 2;
      const bw = Math.ceil(wOf(c.budget, BS, true)) + 6;
      const tw = pw - bw - 18;
      // период — под заголовком на всю ширину ячейки (бюджет стоит только в первой строке)
      const th = hOf(c.title, TS, tw, true, 1.15) + (c.period ? 6 + hOf(c.period, PS, pw, true) : 0);
      return { pw, bw, tw, th };
    };
    // высота строки — по самому длинному заголовку и списку в обеих колонках; шаг списка — чтобы всё уложилось до 1005
    rows.forEach((r) => {
      r.headH = Math.max(BS + 4, geo(CA, r.a).th, geo(CB, r.b).th);
      r.n = Math.max(...[r.a, r.b].flatMap((c) => c.lists.map(([, items, cols]) => Math.ceil(items.length / (cols || 1)))));
    });
    const Y0 = 286;
    const GAP = 12;
    const fixed = (r) => 16 + r.headH + 12 + 34 + 21 + 12;
    const avail = BOT - Y0 - GAP * (rows.length - 1);
    const PITCH = Math.max(21, Math.min(27, Math.floor((avail - rows.reduce((a, r) => a + fixed(r), 0)) / rows.reduce((a, r) => a + r.n - 1, 0))));
    let y = Y0;
    rows.forEach((r) => { r.h = fixed(r) + (r.n - 1) * PITCH; r.y = y; y += r.h + GAP; });
    // остаток высоты (если есть) — поровну строкам
    const spare = BOT - (y - GAP);
    if (spare > 0) { let acc = 0; rows.forEach((r) => { r.y += acc; const add = Math.floor(spare / rows.length); r.h += add; acc += add; }); }

    const cell = (X, r, c, { accent, tint, split }) => {
      s.card({ x: X.x, y: r.y, w: X.w, h: r.h, tint });
      const px = X.x + PAD;
      const { pw, bw, tw } = geo(X, c);
      const tth = s.text(c.title, { x: px, y: r.y + 16, w: evenW(c.title, tw, TS, true), size: TS, bold: true, lh: 1.15, color: C.navy });
      if (c.period) s.text(c.period, { x: px, y: r.y + 16 + tth + 6, w: pw, size: PS, bold: true, lh: 1.2, color: accent === C.navy ? C.blueText : accent });
      s.text(c.budget, { x: X.x + X.w - PAD - bw, y: r.y + 14, w: bw, size: BS, bold: true, lh: 1.0, color: accent, align: 'right' });
      const ly = r.y + 16 + r.headH + 12;
      s.hline(px, ly, pw);
      const gap = 24;
      const w1 = Math.round(pw * split) - gap / 2;
      const w2 = pw - w1 - gap;
      c.lists.forEach(([title, items, cols], k) => {
        const lx = k === 0 ? px : px + w1 + gap;
        if (k > 0) s.vline(lx - gap / 2, ly + 14, r.y + r.h - ly - 28);
        const lw = c.lists.length === 1 ? pw : (k === 0 ? w1 : w2);
        s.label(title, { x: lx, y: ly + 11, w: lw, size: 15, color: C.blueText });
        if (cols === 2) {
          const h1 = Math.ceil(items.length / 2);
          chanList(s, items.slice(0, h1), { x: lx, y: ly + 34, w: w1, pitch: PITCH });
          chanList(s, items.slice(h1), { x: px + w1 + gap, y: ly + 34, w: w2, pitch: PITCH });
        } else chanList(s, items, { x: lx, y: ly + 34, w: lw, pitch: PITCH });
      });
    };

    rows.forEach((r) => {
      s.tile({ x: LB.x, y: r.y, w: LB.w, h: r.h, color: r.color, text: r.label, icon: r.icon, iconSize: 44, size: 20, textH: 70 });
      cell(CA, r, r.a, { accent: C.navy, split: SPLIT.a });
      cell(CB, r, r.b, { accent: C.crimson, tint: true, split: SPLIT.b });
      // прирост бюджета слоя 2027 vs 2026 (расчёт OMD)
      const mid = r.y + Math.round(r.h / 2);
      s.text(r.delta, { x: G.x + 4, y: mid - 32, w: G.w - 8, size: 19, bold: true, lh: 1.0, color: C.crimson, align: 'center', fit: true, maxLines: 1, minSize: 15 });
      s.arrow({ dir: 'right', x: G.x + 16, y: mid + 4, len: G.w - 32, head: 24, headLen: 14, stem: 4, color: C.crimson });
    });

    s.footnote('*Бюджеты тотал представлены с учетом тех костов, АК и РС, бюджеты блоков указаны с АК и РС без учета тех костов. Приросты 2027 vs 2026 — расчёт OMD');
  },

  // ===================== 40 · DOOH: новая территория (в исходнике — картинка во весь слайд) =====================
  40: (d) => {
    const s = d.slide({
      title: 'DOOH в 2027: новая территория персонализированной коммуникации Азелик',
      subtitle: 'Переносим comprehensive-логику из digital в физическую среду и проверяем, может ли новый контакт усилить интерес к бренду',
    });
    A.stageTag(s, 'EXPAND');
    // ширина без висящего слова: сужаем блок, только если последняя строка — одно слово (тот же жадный перенос, что в countLines)
    const noWidow = (t, w, size) => {
      const max = w * 0.97;
      const sp = textWidth(' ', size);
      let cur = 0;
      let n = 0;
      typo(strip(L.tr(t))).split(/\n\n?/).pop().split(' ').forEach((word) => {
        if (!word) return;
        const ww = textWidth(word, size);
        if (cur === 0) { cur = ww; n = 1; } else if (cur + sp + ww <= max) { cur += sp + ww; n += 1; } else { cur = ww; n = 1; }
        while (cur > max) cur -= max;
      });
      return linesOf(t, size, w) > 1 && n === 1 ? evenW(t, w, size) : w;
    };
    const LX = 58;
    const LW = 1150;
    const RX = LX + LW + 24;
    const RW = 1862 - RX;
    const END = 905;

    // ---- слева: почему тестируем сейчас ----
    s.label('Почему тестируем сейчас', { x: LX, y: TOP, w: LW, color: C.navy });
    const leadY = TOP + 38;
    const leadH = 92;
    s.box({ x: LX, y: leadY, w: LW, h: leadH, fill: C.cardTint });
    s.icon('target', { x: LX + 24, y: leadY + (leadH - 60) / 2, size: 60, circle: C.crimson });
    s.text('Новый для Азелика формат позволяет продолжить сегментную коммуникацию за пределами digital — [[в релевантных повседневных контекстах]]',
      { x: LX + 108, y: leadY + 8, w: LW - 132, h: leadH - 16, size: 22, bold: true, lh: 1.2, color: C.navy, valign: 'middle', fit: true, minSize: 18 });

    const STEPS = [
      { n: '01', title: 'Расширяем точки контакта', text: 'DOOH добавляет физическое присутствие бренда в течение дня и дополняет охват digital-инвентаря' },
      { n: '02', title: 'Усиливаем\nconquest-логику', text: 'Используем новый контакт для молодой аудитории и потенциальных switchers — там, где бренд может встретить их вне digital' },
      { n: '03', title: 'Тестируем новую механику', text: 'Переносим принцип «сегмент → контекст → сообщение» в DOOH и заранее задаём измеримый decision gate' },
    ];
    const sc = columns(3, { x0: LX, x1: LX + LW, gap: 40 });
    const sy = leadY + leadH + 18;
    const SP = 24;
    const NW = 62;
    const stH = STEPS.map((st, i) => {
      const tw = sc[i].w - SP * 2 - NW;
      return hOf(st.title.toUpperCase(), 18, tw, true, 1.1);
    });
    const tH = Math.max(...stH);
    const bH = Math.max(...STEPS.map((st, i) => hOf(st.text, 18, sc[i].w - SP * 2)));
    const SH = 20 + Math.max(tH, 38) + 14 + bH + 20;
    STEPS.forEach((st, i) => {
      const c = sc[i];
      s.card({ x: c.x, y: sy, w: c.w, h: SH });
      s.text(st.n, { x: c.x + SP, y: sy + 18, w: NW, size: 34, bold: true, lh: 1.0, color: C.crimson });
      s.text(st.title.toUpperCase(), { x: c.x + SP + NW, y: sy + 20, w: c.w - SP * 2 - NW, size: 18, bold: true, lh: 1.1, color: C.navy });
      s.text(st.text, { x: c.x + SP, y: sy + 20 + Math.max(tH, 38) + 14, w: c.w - SP * 2, size: 18, lh: 1.2, color: C.blueText });
      if (i < STEPS.length - 1) s.chevron({ cx: c.x + c.w + 20, cy: sy + SH / 2, w: 16, h: 26 });
    });

    const by = sy + SH + 16;
    const BH = 106;
    const bc = columns(2, { x0: LX, x1: LX + LW, gap: 20 });
    [['tb:TbLink', 'Связываем digital intent с местом / моментом и доступностью продукта — один CJM вместо разрозненных активаций'],
      ['tb:TbMapPin', 'Добавляем физический контекст: где и когда сообщение наиболее уместно']].forEach(([ic, t], i) => {
      const c = bc[i];
      s.card({ x: c.x, y: by, w: c.w, h: BH });
      s.icon(ic, { x: c.x + 24, y: by + (BH - 58) / 2, size: 58, color: C.white, circle: C.blue });
      s.text(t, { x: c.x + 102, y: by + 10, w: c.w - 126, h: BH - 20, size: 19, bold: true, lh: 1.2, color: C.navy, valign: 'middle', fit: true, minSize: 16 });
    });

    // ---- слева внизу: параметры теста ----
    const PY = by + BH + 18;
    const PH = END - PY;
    s.card({ x: LX, y: PY, w: LW, h: PH });
    const pmid = PY + PH / 2;
    s.label('Параметры теста', { x: LX + 32, y: pmid - 62, w: 380, size: 20, color: C.navy });
    s.text('1,5 млн ₽', { x: LX + 32, y: pmid - 34, w: 380, size: 60, bold: true, lh: 1.0, color: C.crimson });
    s.text('тестовый бюджет / **июнь**', { x: LX + 32, y: pmid + 34, w: 380, size: 18, lh: 1.0, color: C.blueText });
    const sx0 = LX + 470;
    s.vline(sx0 - 40, PY + 24, PH - 48);
    // как в исходнике — сетка 2 × 2
    const PARAMS = [['27,16 млн', 'OTS'], ['5,96 млн', 'показы'], ['967', 'экранов'], ['58 ₽', 'цена за 1 000 OTS']];
    const pc = columns(2, { x0: sx0, x1: LX + LW - 30, gap: 30 });
    PARAMS.forEach(([v, t], i) => {
      const c = pc[i % 2];
      const yy = pmid - 70 + Math.floor(i / 2) * 76;
      s.text(v, { x: c.x, y: yy, w: c.w, size: 38, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 28 });
      s.text(t, { x: c.x, y: yy + 42, w: c.w, size: 17, lh: 1.0, color: C.blueText });
    });

    // ---- справа: почему именно июнь → гипотеза ----
    s.card({ x: RX, y: TOP, w: RW, h: END - TOP });
    const rx = RX + 30;
    const rw = RW - 60;
    s.label('Почему именно июнь', { x: rx, y: TOP + 30, w: rw, color: C.navy });
    const JUNE = [
      ['tb:TbChartBar', 'Анализ продаж', 'В 2026 году в июне наблюдается небольшое проседание продаж'],
      ['tb:TbSun', 'Сезонность спроса', 'Июнь — период умеренной активности, что позволяет оценить дополнительный эффект теста'],
      ['tb:TbCalendar', 'Оценка результатов отдельно от спринтов', 'В июне нет активных спринтов, что позволяет провести чистую оценку влияния DOOH'],
    ];
    const HH = 150;
    const hy = END - 26 - HH;
    const itH = JUNE.map(([, t, tx]) => {
      const th = hOf(t, 20, rw - 76, true, 1.15);
      return Math.max(56, th + 6 + hOf(tx, 18, rw - 76));
    });
    const iy0 = TOP + 84;
    const igap = Math.min(52, (hy - 50 - iy0 - itH.reduce((a, b) => a + b, 0)) / (JUNE.length - 1));
    let iy = iy0;
    JUNE.forEach(([ic, t, tx], i) => {
      s.icon(ic, { x: rx, y: iy, size: 56, color: C.crimson, circle: 'FDE6EC' });
      const th = s.text(t, { x: rx + 76, y: iy, w: rw - 76, size: 20, bold: true, lh: 1.15, color: C.navy });
      s.text(tx, { x: rx + 76, y: iy + th + 6, w: noWidow(tx, rw - 76, 18), size: 18, lh: 1.2, color: C.blueText });
      iy += itH[i] + igap;
    });
    s.chevron({ cx: RX + RW / 2, cy: hy - 20, dir: 'down', w: 18, h: 30 });
    s.box({ x: RX + 20, y: hy, w: RW - 40, h: HH, fill: C.crimson });
    s.icon('tb:TbTrendingUp', { x: RX + 44, y: hy + (HH - 56) / 2, size: 56, color: C.white });
    s.text('**Наша гипотеза:**\nтест в июне даст прирост в ключевых регионах по продажам **(Москва и Санкт-Петербург)**',
      { x: RX + 124, y: hy + 12, w: RW - 40 - 124, h: HH - 24, size: 19, lh: 1.25, color: C.white, valign: 'middle', fit: true, minSize: 16 });

    s.principle({ label: 'Гипотеза теста', icon: 'bulb',
      text: 'Персонализированный контакт в релевантном контексте даст дополнительный инкремент к поисковому интересу, визитам и целевым действиям' });
    s.footnote('Следующий шаг: ограниченный тест с заранее определёнными сценариями результата и критериями масштабирования.');
  },

  // ===================== 41 · DOOH: кому, где и что показываем; как оценим тест =====================
  41: (d) => {
    const s = d.slide({
      title: 'DOOH в 2027: дополнительная точка контакта для роста аудитории Азелика и укрепления позиции бренда',
      subtitle: 'Тест Яндекс DOOH в Москве и Санкт-Петербурге позволит встретить целевые сегменты в релевантных повседневных контекстах, усилить знание бренда и оценить вклад канала в рост интереса и действий пользователей',
    });
    A.stageTag(s, 'EXPAND');
    const TH = 482;           // высота верхнего яруса
    const LC = { x: 58, y: TOP, w: 1120, h: TH };
    const RC = { x: LC.x + LC.w + 20, y: TOP, w: 1862 - (LC.x + LC.w + 20), h: TH };

    // ---- кому и где показываем: матрица контекст × сегмент + креатив ----
    s.card(LC);
    const px = LC.x + 30;
    s.label('Кому и где показываем', { x: px, y: LC.y + 26, w: LC.w - 60, color: C.navy });
    s.text('Персонализация: сегмент — кому говорим → контекст — где встречаем → креатив — что говорим',
      { x: px, y: LC.y + 58, w: LC.w - 60, size: 16, lh: 1.2, color: C.blueText });
    const KW = 200;                                    // колонка сегментов
    const mc = columns(4, { x0: px + KW, x1: LC.x + LC.w - 22, gap: 10 });
    const PLACES = [
      ['Медицина', 'аптеки и медицинские точки'],
      ['Почта и ПВЗ', 'высокая ежедневная проходимость'],
      ['Non-food Retail', 'beauty и skincare'],
      ['Food Retail', 'массовый охват и регулярные касания'],
    ];
    const hy = LC.y + 98;
    s.text('ГДЕ?', { x: px, y: hy + 2, w: KW - 10, size: 17, bold: true, lh: 1.0, color: C.crimson });
    s.text('КОМУ?', { x: px, y: hy + 40, w: KW - 10, size: 17, bold: true, lh: 1.0, color: C.crimson });
    PLACES.forEach(([p, cap], i) => {
      s.text(p, { x: mc[i].x, y: hy, w: mc[i].w, size: 19, bold: true, lh: 1.0, color: C.navy, align: 'center', fit: true, maxLines: 1, minSize: 16 });
      s.text(cap, { x: mc[i].x, y: hy + 26, w: mc[i].w, size: 15, lh: 1.15, color: C.blueText, align: 'center' });
    });
    const SEG = [['М/Ж 18–40', [1, 1, 1, 1]], ['Подростки 12–18', [0, 1, 1, 1]], ['Женщины 40+', [1, 1, 1, 1]]];
    const RH = 46;
    let ry = hy + 72;
    s.hline(px, ry, LC.w - 52);
    SEG.forEach(([seg, on]) => {
      s.text(seg, { x: px, y: ry + 12, w: KW - 10, size: 20, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 16 });
      on.forEach((v, i) => {
        const cx = mc[i].x + mc[i].w / 2;
        if (v) s.circle({ x: cx - 11, y: ry + RH / 2 - 11, d: 22, fill: C.crimson });
        else s.text('—', { x: cx - 30, y: ry + 10, w: 60, size: 22, lh: 1.0, color: MUTED_TXT, align: 'center' });
      });
      ry += RH;
      s.hline(px, ry, LC.w - 52);
    });
    const wy = ry + 14;
    s.text('ЧТО?', { x: px, y: wy, w: KW - 10, size: 17, bold: true, lh: 1.0, color: C.crimson });
    const WHAT = [
      '**ИИ-Ролик «Негативный опыт после других продуктов»**\nПро сухость и увлажняющий компонент Азелик',
      '**ИИ-Ролик «Новые средства»**\nПро активные компоненты и формулу для борьбы с акне',
      '**ИИ-Ролик «Social girl»**\nПро меньшую маскировку кожи благодаря Азелик',
      '**Ролик «Советы»**\nРолик с «вредными» советами для женщин по борьбе с акне. Классический продакшн',
    ];
    WHAT.forEach((t, i) => s.text(t, { x: mc[i].x + 4, y: wy, w: mc[i].w - 8, h: LC.y + LC.h - 16 - wy, size: 16, lh: 1.2, color: C.blueText, align: 'center', fit: true, minSize: 14 }));

    // ---- пример визуализации: 4 фото в порядке колонок матрицы ----
    s.card(RC);
    s.label('Пример визуализации', { x: RC.x + 28, y: RC.y + 26, w: RC.w - 56, color: C.navy });
    const PG = 14;
    const PW = Math.floor((RC.w - 56 - PG) / 2);
    const PHh = Math.round(PW / 1.5);
    const py0 = RC.y + 66 + Math.max(0, Math.floor((RC.h - 66 - 24 - (PHh * 2 + PG)) / 2));
    [['f_41_pharmacy.png', 1.4911], ['f_41_pvz.png', 1.5], ['f_41_beauty.png', 1.5], ['f_41_food.png', 1.5]].forEach(([f, ar], i) => {
      const x = RC.x + 28 + (i % 2) * (PW + PG);
      const yy = py0 + Math.floor(i / 2) * (PHh + PG);
      const h = Math.round(PW / ar);
      s.image(path.join(CROPS, f), { x, y: yy + Math.round((PHh - h) / 2), w: PW, h, alt: PLACES[i][0] });
    });

    // ---- как поймём, что тест эффективен ----
    const KY = TOP + TH + 20;
    const KH = 905 - KY;
    const KL = { x: 58, w: 450 };
    s.label('Как поймём, что тест эффективен', { x: KL.x, y: KY + 4, w: KL.w, size: 20, color: C.navy });
    const kt = s.text('Сценарный прогноз строим от нормализованного результата релевантного кейса Яндекс DOOH и сознательно дисконтируем benchmark.',
      { x: KL.x, y: KY + 34, w: KL.w - 10, size: 16, lh: 1.2, color: C.blueText });
    s.text('BENCHMARK-ADJUSTED FORECAST', { x: KL.x, y: KY + 34 + kt + 12, w: KL.w, size: 14, bold: true, lh: 1.0, color: MUTED_TXT });
    s.text('**40%** — консервативный\n**70%** — оптимальный', { x: KL.x, y: KY + 34 + kt + 34, w: KL.w, size: 19, lh: 1.25, color: C.navy });

    const KPI = [
      { name: 'SEARCH LIFT', cap: 'наиболее прогнозируемый KPI', v: ['+7,8 тыс.', '+13,6 тыс.'], hl: true },
      { name: 'VISIT LIFT', cap: 'дополнительные визиты', v: ['+4,1 тыс.', '+7,2 тыс.'] },
      { name: 'POST-VIEW', cap: 'целевые действия', v: ['+235', '+410'] },
    ];
    const kc = columns(3, { x0: KL.x + KL.w + 24, x1: 1862, gap: 20 });
    // один кегль на все шесть чисел (иначе «+13,6 тыс.» ужимается сильнее соседей); второе число может занять поле до края карточки
    const vbw = (kc[0].w - 56) / 2;
    let vsz = 33;
    while (vsz > 26 && KPI.some((k) => k.v.some((v, j) => wOf(v, vsz, true) > (vbw - (j ? 6 : 14)) * 0.96))) vsz -= 1;
    KPI.forEach((k, i) => {
      const c = kc[i];
      if (k.hl) s.card({ x: c.x, y: KY, w: c.w, h: KH, tint: true, stroke: C.crimson });
      else s.card({ x: c.x, y: KY, w: c.w, h: KH });
      const cx = c.x + 28;
      s.text(k.name, { x: cx, y: KY + 22, w: c.w - 56, size: 21, bold: true, lh: 1.0, color: C.navy });
      s.text(k.cap, { x: cx, y: KY + 50, w: c.w - 56, size: 16, lh: 1.0, color: C.blueText });
      const vw = (c.w - 56) / 2;
      k.v.forEach((v, j) => {
        s.text(v, { x: cx + j * vw, y: KY + KH - 84, w: vw - (j ? 6 : 14), size: vsz, bold: true, lh: 1.0, color: k.hl ? C.crimson : C.navy, fit: true, maxLines: 1, minSize: 24 });
        s.text(j === 0 ? '40% benchmark' : '70% benchmark', { x: cx + j * vw, y: KY + KH - 42, w: vw - 6, size: 15, lh: 1.0, color: C.blueText });
      });
    });

    s.formula({ text: 'Decision gate: фактический lift сравниваем с прогнозным диапазоном → масштабируем / оптимизируем / не масштабируем' });
    s.footnote('Источник benchmark: кейс Яндекс DOOH «Центр флебологии», 2026. Сценарные коэффициенты — рабочие assumptions.');
  },

  // ===================== 42 · Спецпроект «Синхронизация / Жизнь кожи» =====================
  42: (d) => {
    const s = d.slide({ title: 'Синхронизация / Жизнь кожи' });
    A.stageTag(s, 'EXPAND');
    const LX = 58;
    const LW = 960;
    const RX = 1048;
    const RW = 1862 - RX;

    // ---- справа: референс механики ----
    s.label('Референс механики', { x: RX, y: TOP, w: RW, size: 20, color: C.navy });
    s.text('«Интерактивный лонгрид»', { x: RX + Math.ceil(wOf('РЕФЕРЕНС МЕХАНИКИ', 20, true)) + 14, y: TOP - 1, w: 400, size: 20, lh: 1.0, color: C.blueText });
    const iy = TOP + 38;
    const h1 = Math.round(RW / 1.8673);
    s.image(path.join(CROPS, 'f_42_ref1.png'), { x: RX, y: iy, w: RW, h: h1, alt: 'Референс механики «Интерактивный лонгрид»' });
    const g = 16;
    const h2 = Math.round((RW - g) / (1.7857 + 1.216));
    const w2 = Math.round(h2 * 1.7857);
    s.image(path.join(CROPS, 'f_42_ref2.png'), { x: RX, y: iy + h1 + g, w: w2, h: h2, alt: 'Референс механики «Интерактивный лонгрид»' });
    s.image(path.join(CROPS, 'f_42_ref3.png'), { x: RX + w2 + g, y: iy + h1 + g, w: RW - w2 - g, h: h2, alt: 'Референс механики «Интерактивный лонгрид»' });
    const bottom = iy + h1 + g + h2;

    // ---- слева: суть проекта → механика → роль/период → оценка ----
    const lead = 'Проект помогает понять, почему иногда кожа меняется, как на неё влияет наш образ жизни, какие процессы являются нормой, а где действительно стоит подключать лечение.';
    const leadH = hOf(lead, 21, LW - 64, true) + 40;
    s.box({ x: LX, y: TOP, w: LW, h: leadH, fill: C.cardTint });
    s.text(lead, { x: LX + 32, y: TOP + 20, w: LW - 64, size: 21, bold: true, lh: 1.2, color: C.navy });

    const my = TOP + leadH + 30;
    s.label('Механика проекта', { x: LX, y: my, w: LW, size: 20, color: C.blueText });
    const stH = s.steps([
      { title: 'Интерактивный путеводитель в формате лендинга со статьями и видеокружочками от экспертов',
        text: 'Можно начать с выбора своего образа жизни пользовательницы: **Блогер / Возрастной уход / Мужской уход и т.д.**' },
      { title: 'После выбора открываются — особенности кожи, рекомендации от дерматолога в формате видеокружочка, научные объяснения' },
      { title: 'Отдельный блок: «Если воспаления становятся регулярными — решить проблему за счет изменения лайфстайла уже недостаточно.»',
        text: 'Рассказываем про регулярную терапию Азеликом.' },
    ], { x: LX, y: my + 42, w: LW, pitch: 'auto', titleSize: 21, size: 19, gap: 30, highlightLast: true });

    // таблица — низом вровень с картинками
    const rowH = [58, 46];
    const tY = bottom - rowH[0] - rowH[1];
    const cy = Math.round((my + 42 + stH + tY) / 2) - 27;
    let cx = LX;
    cx += chip(s, { x: cx, y: cy, icon: 'tb:TbTargetArrow', text: 'Роль: **expand & frequency**' }) + 14;
    cx += chip(s, { x: cx, y: cy, icon: 'tb:TbCalendar', text: 'Период: **мар–апр**' }) + 24;
    // «Синхронизация» — партнёр проекта (логотип из исходника, обрезан по полю)
    s.image(path.join(CROPS, 'f_42_sync_logo.png'), { x: cx, y: cy, w: Math.round(54 * 1.7511), h: 54, alt: 'Синхронизация' });
    s.table([
      ['Опция', 'Показы', 'Прогноз кликов', 'Бюджет до НДС*', 'Срок продакшена', 'CPM', 'CTR'],
      ['Лонгрид', '6 млн', '40 тыс.', '1,9 млн', '4–5 недель', '317 руб.', '0,67%'],
    ], { x: LX, y: tY, w: LW, colW: [140, 112, 140, 160, 172, 120, 116], rowH, size: 17 });

    s.footnote('*Бюджет и показатели — эстимация, потребуется пересмотр при детализации и доработке предложения.');
  },

  // ===================== 43 · Спецпроект Clatch / Трекер цикла =====================
  43: (d) => {
    const s = d.slide({ title: 'Clatch / Трекер цикла' });
    A.stageTag(s, 'EXPAND');
    const LX = 58;
    const LW = 960;
    const RX = 1048;
    const RW = 1862 - RX;

    const lead = 'Многим девушкам знакома ситуация, когда перед началом нового цикла появляются воспаления на лице. Вместе с Клатчем разберемся, как можно помочь своей коже в этот период, а также улучшить качество кожи в целом.';
    const leadH = hOf(lead, 21, LW - 64, true) + 40;
    s.box({ x: LX, y: TOP, w: LW, h: leadH, fill: C.cardTint });
    s.text(lead, { x: LX + 32, y: TOP + 20, w: LW - 64, size: 21, bold: true, lh: 1.2, color: C.navy });

    let y = TOP + leadH + 28;
    y += s.text('Для вовлечения пользователей и привлечения внимания к продукту рекомендуем обратить внимание на следующие опции:',
      { x: LX, y, w: LW, size: 19, lh: 1.2, color: C.blueText }) + 22;
    const OPTS = [
      { t: '**Контентный нативный формат** — Сториз.', d: 'Это может быть как полезная обучающая коммуникация, так и сторителлинг в стиле комикса, через который продемонстрируем ситуации, где поможет использование геля Азелик.' },
      { t: '**Игровой контент.** Например, игра в стиле 2048 с брендированными элементами.', d: 'Игровая механика стимулирует контактировать с продуктом чаще, позволяет получать промокоды, скидки и другие бонусы бренда.' },
    ];
    OPTS.forEach((o, i) => {
      s.badge({ x: LX, y, d: 40, n: i + 1, color: C.blue, size: 21 });
      const th = s.text(o.t, { x: LX + 60, y: y + 6, w: LW - 60, size: 20, lh: 1.15, color: C.navy });
      const dh = s.text(o.d, { x: LX + 60, y: y + 6 + th + 8, w: LW - 60, size: 18, lh: 1.2, color: C.blueText });
      y += 6 + th + 8 + dh + 24;
    });

    // ---- справа: референсы форматов ----
    const hTop = 390;
    const wSt = Math.round(hTop * 1.0048);     // сториз (2 телефона)
    const wCm = Math.round(hTop * 0.5139);     // комикс
    const imY = TOP + 62;
    s.text('Референс формата\n**«Серия сториз»**', { x: RX, y: TOP, w: wSt + 40, size: 18, lh: 1.2, color: C.navy });
    s.image(path.join(CROPS, 'f_43_stories.png'), { x: RX, y: imY, w: wSt, h: hTop, alt: 'Референс формата «Серия сториз»' });
    const cmX = RX + wSt + 80;
    s.text('Референс\n**визуала комикса**', { x: cmX, y: TOP, w: RW - (cmX - RX), size: 18, lh: 1.2, color: C.navy });
    s.image(path.join(CROPS, 'f_43_comic.png'), { x: cmX, y: imY, w: wCm, h: hTop, alt: 'Референс визуала комикса' });
    // интерактивные форматы: подпись слева, стрелка к телефонам
    const by = imY + hTop + 34;
    const hBot = BOT - by;
    const wPh = Math.round(hBot * 0.517);
    const phX = RX + 330;
    const capH = s.text('Референс\n**интерактивных форматов**', { x: RX, y: by + hBot / 2 - 24, w: 260, size: 18, lh: 1.2, color: C.navy });
    s.arrow({ dir: 'right', x: RX + 250, y: by + hBot / 2 + capH / 2 - 24 + 12, len: 60, head: 20, headLen: 12, stem: 3, color: C.blue });
    s.image(path.join(CROPS, 'f_43_game.png'), { x: phX, y: by, w: wPh, h: hBot, alt: 'Референс интерактивных форматов' });
    s.image(path.join(CROPS, 'f_43_quiz.png'), { x: phX + wPh + 24, y: by, w: wPh, h: hBot, alt: 'Референс интерактивных форматов' });

    // ---- слева внизу: occasion/период и оценка ----
    const rowH = [58, 46, 46];
    const tY = BOT - rowH.reduce((a, b) => a + b, 0);
    const cy = Math.round((y - 24 + tY) / 2) - 27;
    let cx = LX;
    cx += chip(s, { x: cx, y: cy, icon: 'tb:TbSchool', text: 'Occasion: **BTS**' }) + 14;
    cx += chip(s, { x: cx, y: cy, icon: 'tb:TbCalendar', text: 'Период: **авг/сен**' }) + 24;
    // CLATCH — партнёр проекта (логотип из исходника)
    s.image(path.join(MEDIA, 'img_c52d57c259.png'), { x: cx, y: cy - 2, w: Math.round(58 * 1115 / 317), h: 58, alt: 'CLATCH' });
    s.table([
      ['Опция', 'Показы', 'Охват', 'Уники', 'Бюджет до НДС*', 'CPM', 'CTR', 'CPT (охват)'],
      ['Сториз', '7,4 млн', '1 млн', '4,3 тыс.', '2,9 млн', '392 руб.', '0,06%', '2900 руб.'],
      ['Игра', '605 тыс.', '135 тыс.', '3,4 тыс.', '1,4 млн', '2314 руб.', '0,56%', '10 370 руб.'],
    ], { x: LX, y: tY, w: LW, colW: [110, 112, 108, 108, 150, 118, 100, 154], rowH, size: 17 });

    s.footnote('*Бюджет и показатели — эстимация, потребуется пересмотр при детализации и доработке предложения.');
  },

  // ===================== 44 · Персонализация креатива =====================
  44: (d) => {
    const s = d.slide({
      title: 'Персонализация креатива как основа comprehensive-подхода: единая бренд-система и разные сообщения для сегментов',
      subtitle: 'В 2027 обновляем баннерные креативы в единой визуальной стилистике Азелика и адаптируем коммуникацию под новые аудитории с помощью AI-ускоренного производства',
    });
    A.stageTag(s, 'EXPAND');

    // ---- верх слева: принципы производства ----
    const LW = 930;
    let y = TOP;
    y += s.text('Принципы производства баннеров/видео', { x: 58, y, w: LW, size: 26, bold: true, lh: 1.1, color: C.navy }) + 8;
    y += s.text('Единая логика помогает быстро масштабировать коммуникацию без распада бренда на разные визуальные стили',
      { x: 58, y, w: LW, size: 17, lh: 1.2, color: C.blueText }) + 18;
    const chH = s.checks([
      'Фиксируем общий брендовый каркас: визуальный язык, тональность, пэкшот, CTA и фарм. корректность',
      'Меняем то, что связано с сегментом: инсайт, триггер выбора, жизненный контекст и визуальную метафору',
      'AI ускоряет генерацию ресайзов и анимаций, но человек задаёт стратегию и проверяет результат',
    ], { x: 58, y, w: LW, size: 17, pitch: 'auto', gap: 14, color: C.blue });   // 17: «…и визуальную метафору» встаёт в одну строку, без висящего слова
    const topEnd = y + chH;

    // ---- верх справа: рабочая схема адаптации ----
    const SX = 58 + LW + 30;
    const SW = 1862 - SX;
    s.card({ x: SX, y: TOP, w: SW, h: topEnd - TOP + 4 });
    s.label('Рабочая схема адаптации', { x: SX + 30, y: TOP + 26, w: SW - 60, size: 20, color: C.navy });
    const STEPS = [['Сегмент', C.orange], ['Инсайт', C.orange], ['Триггер', C.orange], ['AI-раскадровка', C.blue], ['Анимация', C.blue], ['Финальные ресайзы/ролики', C.green]];
    const sc = columns(STEPS.length, { x0: SX + 16, x1: SX + SW - 16, gap: 6 });
    const D = 54;
    const cyy = Math.round((TOP + 60 + topEnd + 4) / 2 - (D + 12 + 38) / 2);
    s.hline(sc[0].x + sc[0].w / 2, cyy + D / 2, sc[STEPS.length - 1].x - sc[0].x, C.line, 3);
    STEPS.forEach(([t, col], i) => {
      const c = sc[i];
      s.badge({ x: c.x + c.w / 2 - D / 2, y: cyy, d: D, n: i + 1, color: col, size: 24 });
      // поле подписи шире колонки на 10 px с каждой стороны: «ресайзы/ролики» без ужатия кегля (соседние подписи короткие)
      s.text(t, { x: c.x - 10, y: cyy + D + 12, w: c.w + 20, size: 16, bold: true, lh: 1.15, color: C.navy, align: 'center', fit: true, maxLines: 2, minSize: 14 });
    });

    // ---- низ: аудиторные сегменты 2027 и их креативы ----
    const ly = topEnd + 26;
    const lw = Math.ceil(wOf('АУДИТОРНЫЕ СЕГМЕНТЫ 2027', 20, true)) + 10;
    s.label('Аудиторные сегменты 2027', { x: 58, y: ly, w: lw, size: 20, color: C.navy });
    s.text('Сегмент ЦА', { x: 58 + lw + 16, y: ly + 1, w: 300, size: 17, lh: 1.0, color: MUTED_TXT });
    const cy0 = ly + 36;
    const CH = BOT - cy0;
    const cols = columns(3, { gap: 22 });
    const SEGS = [
      { color: C.purple, t: '**Ж 25–40 с акне и постакне** — «Хочу убрать видимые следы, чтобы вернуть уверенность»',
        old: ['f_44_w2026.png', 0.5938], now: ['f_44_w2027.png', 0.5937] },
      { color: C.teal, t: '**Подростки 12–18, лёгкое/среднее акне, самостоятельный уход** — «Хочу красиво, но без ущерба здоровью»',
        old: ['f_44_teen2026.png', 0.6117], now: ['f_44_teen2027.png', 0.5937] },
      { color: C.orange, t: '**Ж 40+ с акне в предменопаузу** — «Хочу чистую кожу без отказа от привычного ухода»',
        photo: ['f_44_40photo.png', 1.7773], now: ['f_44_40new.png', 0.6] },
    ];
    const tH = Math.max(...SEGS.map((sg, i) => hOf(sg.t, 18, cols[i].w - 56 - 34)));
    SEGS.forEach((sg, i) => {
      const c = cols[i];
      s.card({ x: c.x, y: cy0, w: c.w, h: CH });
      s.circle({ x: c.x + 26, y: cy0 + 26, d: 22, fill: sg.color });
      s.text(sg.t, { x: c.x + 60, y: cy0 + 22, w: c.w - 60 - 26, size: 18, lh: 1.2, color: C.navy });
      const iy = cy0 + 22 + tH + 20;
      const ih = cy0 + CH - 24 - iy - 28;          // высота нового креатива; под картинками — подпись 2026 / NEW
      const nw = Math.round(ih * sg.now[1]);
      const nx = c.x + c.w - 26 - nw;
      s.image(path.join(CROPS, sg.now[0]), { x: nx, y: iy, w: nw, h: ih, alt: 'Креатив 2027' });
      if (sg.old) {
        const oh = Math.round(ih * 0.8);
        const ow = Math.round(oh * sg.old[1]);
        const ox = nx - 64 - ow;
        s.image(path.join(CROPS, sg.old[0]), { x: ox, y: iy + ih - oh, w: ow, h: oh, alt: 'Креатив 2026' });
        s.text('2026', { x: ox, y: iy + ih + 8, w: ow, size: 18, bold: true, lh: 1.0, color: C.navy, align: 'center' });
        s.chevron({ cx: nx - 32, cy: iy + ih - oh / 2, w: 18, h: 30, color: C.blue });
      } else {
        const pw = nx - 24 - (c.x + 26);
        const ph = Math.round(pw / sg.photo[1]);
        s.image(path.join(CROPS, sg.photo[0]), { x: c.x + 26, y: iy + ih - ph, w: pw, h: ph, alt: 'Визуал для сегмента Ж 40+' });
        tag(s, 'NEW', c.x + 26, iy + ih + 4, { size: 15, h: 28 });
      }
    });
  },

  // ===================== 45 · Sprint 2027: каналы и инструменты по сегментам =====================
  45: (d) => {
    const s = d.slide({
      title: 'Sprint 2027: каналы и инструменты по сегментам',
      subtitle: 'CTV становится новым элементом Sprint 2027, усиливая персонализированную работу\nс core-аудиторией',
    });
    A.stageTag(s, 'SPRINT');
    const END = 905;
    // цвета каналов — общие для карточек сегментов и кольца сплита; CTV — новый элемент, акцент
    const CH = {
      CTV: { color: C.crimson, name: 'CTV' },
      OLV: { color: C.blue, name: 'Programmatic OLV' },
      BLG: { color: C.cyan, name: 'Bloggers/Influence' },
      BAN: { color: C.navy, name: 'Programmatic banners' },
      SRCH: { color: V.MUTED, name: 'Paid Search / РСЯ' },
    };
    const LW = 1170;
    const LX = 58;

    // ---- слева: каналы и инструменты по сегментам ----
    s.box({ x: LX, y: TOP, w: LW, h: 50, fill: C.crimson });
    s.text('КАНАЛЫ И ИНСТРУМЕНТЫ SPRINT фев–май; июл–окт 2027', { x: LX + 26, y: TOP, w: LW - 52, h: 50, size: 20, bold: true, lh: 1.0, color: C.white, valign: 'middle' });

    const PADX = 24;
    const money = (v, x, y, w, size, color = C.navy) => s.text(v, { x, y, w, size, bold: true, lh: 1.0, color, align: 'right' });
    // CTV — отдельной полосой на всю ширину
    const cty = TOP + 64;
    const CTH = 58;
    s.card({ x: LX, y: cty, w: LW, h: CTH, tint: true, r: 15 });
    s.circle({ x: LX + PADX, y: cty + CTH / 2 - 9, d: 18, fill: CH.CTV.color });
    s.text('CTV', { x: LX + PADX + 32, y: cty + CTH / 2 - 12, w: 300, size: 21, bold: true, lh: 1.0, color: C.navy });
    money('23,8 млн', LX + LW - PADX - 240, cty + CTH / 2 - 13, 240, 24);

    const SEG = [
      { name: 'Social girl 18–34', total: '18,6 млн', items: [['OLV', '6,7 млн ₽'], ['BLG', '3,2 млн ₽'], ['BAN', '8,5 млн ₽']] },
      { name: 'Ж 18–34: новые средства', total: '15,9 млн', items: [['OLV', '5,8 млн ₽'], ['BLG', '3,2 млн ₽'], ['BAN', '6,9 млн ₽']] },
      { name: '18–34 Скиноклир: негативный опыт', total: '13,1 млн', items: [['OLV', '3,9 млн ₽'], ['BLG', '3,2 млн ₽'], ['BAN', '6,0 млн ₽']] },
      { name: 'М 18–34: проблемная кожа', total: '13,1 млн', items: [['OLV', '3,9 млн ₽'], ['BLG', '3,2 млн ₽'], ['BAN', '6,0 млн ₽']] },
      { name: 'Ж 18–34 чувствительная кожа', tag: 'NEW', total: '9,9 млн', items: [['OLV', '3,9 млн ₽'], ['BAN', '6,0 млн ₽']] },
      { name: 'Purchase intent', total: '4,3 млн', items: [['SRCH', '']] },
    ];
    const gc = columns(2, { x0: LX, x1: LX + LW, gap: 18 });
    const gy0 = cty + CTH + 14;
    const note = 'Бюджет Sprint сконцентрирован на 5 сегментах: Social girl и Ж 18–34, которые масштабируют знание, Skinoclear и М 18–34 отрабатывают барьеры выбора. Ж 18–34 Этап Purchase intent закрывает горячий спрос';
    const noteH = hOf(note, 17, LW - 48);
    const gridEnd = END - noteH - 40;
    const GG = 14;
    const CHh = Math.floor((gridEnd - gy0 - GG * 2) / 3);
    SEG.forEach((sg, i) => {
      const c = gc[i % 2];
      const yy = gy0 + Math.floor(i / 2) * (CHh + GG);
      s.card({ x: c.x, y: yy, w: c.w, h: CHh, r: 15 });
      const tw = c.w - PADX * 2 - 150;
      s.text(sg.name, { x: c.x + PADX, y: yy + 18, w: tw - (sg.tag ? 70 : 0), size: 20, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 16 });
      if (sg.tag) tag(s, sg.tag, c.x + PADX + Math.min(Math.ceil(wOf(sg.name, 20, true)), tw - 70) + 12, yy + 16, { h: 24, size: 13 });
      money(sg.total, c.x + c.w - PADX - 150, yy + 16, 150, 23);
      s.hline(c.x + PADX, yy + 52, c.w - PADX * 2);
      sg.items.forEach(([k, v], j) => {
        const iy = yy + 64 + j * 26;
        s.circle({ x: c.x + PADX, y: iy + 5, d: 12, fill: CH[k].color });
        s.text(CH[k].name, { x: c.x + PADX + 22, y: iy, w: c.w - PADX * 2 - 150, size: 17, lh: 1.2, color: C.blueText });
        if (v) s.text(v, { x: c.x + c.w - PADX - 150, y: iy, w: 150, size: 17, lh: 1.2, color: C.blueText, align: 'right' });
      });
    });
    s.text(note, { x: LX + 24, y: gridEnd + 20, w: LW - 48, size: 17, lh: 1.2, color: C.navy });

    // ---- справа: сплит бюджета Sprint 2027 (живое кольцо, данные из графика исходника) ----
    const RX = LX + LW + 24;
    const RW = 1862 - RX;
    s.card({ x: RX, y: TOP, w: RW, h: END - TOP });
    const rx = RX + 30;
    s.label('Сплит бюджета Sprint 2027', { x: rx, y: TOP + 28, w: RW - 60, size: 22, color: C.navy });
    s.text('по каналам / инструментам, с АК и РС', { x: rx, y: TOP + 58, w: RW - 60, size: 16, lh: 1.0, color: C.blueText });
    // данные кольца — из графика исходника (млн ₽), подписи долей — как в легенде исходника
    const PL = [
      { k: 'CTV', cat: 'CTV', v: 23.8, lab: 'CTV — 24%', sum: '23,8 млн ₽' },
      { k: 'OLV', cat: 'OLV', v: 24.1, lab: 'OLV — 24%', sum: '24,1 млн ₽' },
      { k: 'BLG', cat: 'Bloggers', v: 12.8, lab: 'Bloggers — 13%', sum: '12,8 млн ₽' },
      { k: 'BAN', cat: 'Programmatic banners', v: 33.6, lab: 'Prog. banners — 34%', sum: '33,6 млн ₽' },
      { k: 'SRCH', cat: 'Paid Search / РСЯ', v: 4.3, lab: 'Search/РСЯ — 4%', sum: '4,3 млн ₽' },
    ];
    // пояснение к сплиту — плашкой внизу карточки; кольцо с легендой — по центру свободной зоны над ней
    const txt = 'Медиасплит сбалансирован между охватом и\nperformance-логикой: видео с персонализацией дает охват, Bloggers — обучает аудиторию и отрабатывает барьеры сегментов, programmatic banners — трафик на сайт, Search — работает с горячим спросом';
    const th = hOf(txt, 18, RW - 80);
    const ty = END - 22 - th - 36;
    const Dd = 300;
    const dcx = rx + Dd / 2;
    const dcy = Math.round((TOP + 84 + ty) / 2);
    s.chart('doughnut', [{ name: 'Сплит бюджета Sprint 2027, млн ₽', labels: PL.map((p) => p.cat), values: PL.map((p) => p.v) }],
      { x: dcx - Dd / 2, y: dcy - Dd / 2, w: Dd, h: Dd, colors: PL.map((p) => CH[p.k].color), hole: 60, values: false, legend: false,
        extra: { layout: { x: 0, y: 0, w: 1, h: 1 } } });
    // отверстие — кругом цвета карточки (LibreOffice не понимает holeSize)
    const hd = Math.round(Dd * 0.6);
    s.circle({ x: dcx - hd / 2, y: dcy - hd / 2, d: hd, fill: C.card });
    s.text('Итого', { x: dcx - hd / 2, y: dcy - 44, w: hd, size: 16, lh: 1.0, color: C.blueText, align: 'center' });
    s.text('98,7', { x: dcx - hd / 2, y: dcy - 22, w: hd, size: 44, bold: true, lh: 1.0, color: C.navy, align: 'center' });
    s.text('млн ₽', { x: dcx - hd / 2, y: dcy + 26, w: hd, size: 18, bold: true, lh: 1.0, color: C.navy, align: 'center' });
    // легенда справа от кольца: доля (как в исходнике) + сумма из данных графика
    const lx = rx + Dd + 30;
    const lstep = 56;
    const ly0 = dcy - (lstep * PL.length) / 2 + 6;
    PL.forEach((p, i) => {
      const yy = ly0 + i * lstep;
      s.circle({ x: lx, y: yy + 4, d: 18, fill: CH[p.k].color });
      s.text(p.lab, { x: lx + 30, y: yy, w: RX + RW - 24 - lx - 30, size: 19, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 15 });
      s.text(p.sum, { x: lx + 30, y: yy + 23, w: 200, size: 15, lh: 1.0, color: C.blueText });
    });
    s.box({ x: RX + 20, y: ty, w: RW - 40, h: th + 36, fill: C.cardTint });
    s.text(txt, { x: RX + 40, y: ty + 18, w: RW - 80, size: 18, lh: 1.2, color: C.navy });

    s.formula({ text: 'Большие экраны добавляют качественный охват и частоту контакта, а остальные каналы последовательно отрабатывают барьеры и спрос по сегментам' });
  },
};
