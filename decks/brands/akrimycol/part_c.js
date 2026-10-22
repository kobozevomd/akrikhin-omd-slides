// Акримиколь · стратегия 2027 — часть C: слайды исходника 11–15 (все пять — картинки-макеты во весь слайд или поверх живого текста)
// 11 — оккейжены по оси «Новички → Хроники»: 6 карточек + блок «Лишай» (аналог — Dinobutin 11, Clindovit 10);
// 12 — краткость CJM: 84% / 48%, доли каналов онлайн, путь сбора информации, 5 источников A–E (аналог — Bobotic 15, Normobact 13);
// 13 — роли каналов при коротком CJM: видео (64 / 48 / 34%), 4 канала, короткий путь 1–4 (аналог — Bobotic 20, Dinobutin 15);
// 14 — география 2027: ядро / рост / long tail (аналог — Dinobutin 10, Normobact 12);
// 15 — сезонность 2027: индекс категории живым графиком + гант инструментов (аналог — Bobotic 19, Dinobutin 16).
// Тексты 11–13 прочитаны по увеличенным кускам: out/render/brand_akrimycol_part_c/zoom/s1N_*.png.
const path = require('path');
const { C, columns, textWidth, countLines, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT, MUTED, GRID
const K = require('./common');                            // SRC, MEDIA, CROPS
const SRC = K.SRC;
const MEDIA = K.MEDIA;
void SRC; void MEDIA; void path;

const TOP = V.TOP;   // 221
const BOT = V.BOT;   // 1005
const CB = 905;      // низ контента над плашкой
const X0 = 58;
const X1 = 1862;
const MUTED = V.MUTED;

// ---------- помощники ----------
const plainTr = (text) => typo(tr(String(text))).replace(/\*\*|\[\[|\]\]/g, '');
const measure = (text, w, size = 18, bold = false, lh = 1.2) =>
  Math.round(countLines(plainTr(text), size, w, bold) * size * lh);
const widthOf = (text, size, bold = false) => textWidth(plainTr(text), size, bold);
const hex = (n) => Math.round(n).toString(16).padStart(2, '0');
const mix = (a, b, t) => [0, 2, 4].map((k) => hex(parseInt(a.substr(k, 2), 16) * (1 - t) + parseInt(b.substr(k, 2), 16) * t)).join('').toUpperCase();

// Сегменты: Новички — синий, Хроники — малиновый (оси и пометки слайдов 11–12)
const SEG = { nov: C.blue, chr: C.crimson };
const TINT = { blue: C.tint, crimson: mix('FFFFFF', C.crimson, 0.1), green: mix('FFFFFF', C.green, 0.12) };

// Цифра + подпись справа на одной базовой линии
function valueUnit(s, { x, y, w, value, unit, size = 48, unitSize = 18, color = C.navy, unitColor = C.navy, unitBold = false }) {
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

// Легенда точками в строку от x (ширины — по переведённому тексту); возвращает правый край
function legendRow(s, x, y, items, { size = 16, gap = 22 } = {}) {
  items.forEach(([color, t]) => {
    const w = Math.ceil(widthOf(t, size)) + 4;
    s.box({ x, y: y + (size * 1.2 - 14) / 2, w: 14, h: 14, fill: color, r: 3 });
    s.text(t, { x: x + 22, y, w, size, color: C.navy });
    x += 22 + w + gap;
  });
  return x - gap;
}

module.exports = {
  // ───────────── 11. Оккейжены по оси «Новички → Хроники» ─────────────
  11: (d) => {
    const s = d.slide({ title: 'Релевантность коммуникации для основных сегментов мы усиливаем через ключевые оккейжены' });

    const OCC = [
      { icon: 'tb:TbDroplet', t: 'Не просто сухость', tag: 'nov',
        d: 'Шелушение, зуд и трещинки сначала воспринимают как сухость или раздражение. Коммуникация должна помочь распознать проблему и подтолкнуть к первому выбору Акримиколя.' },
      { icon: 'tb:TbLuggage', t: 'После отпуска / отеля', tag: 'nov',
        d: 'Симптомы появляются после моря, поездки или общей душевой в отеле. Это понятный сезонный сценарий с высоким потенциалом для отдельного креатива.' },
      { icon: 'tb:TbShoe', t: 'Весь день в обуви', tag: 'both',
        d: 'Закрытая обувь, потливость и дискомфорт сначала кажутся бытовой проблемой, а затем приводят к поиску лечения. Хороший контекст для симптомной коммуникации.' },
      { icon: 'tb:TbSwimming', t: 'Бассейны / сауны / залы', tag: 'both',
        d: 'Понятный триггер первого или повторного заражения. Подходит для точного таргетинга и отдельного креатива как место, где проблема могла начаться снова.' },
      { icon: 'tb:TbRefreshAlert', t: 'Когда грибок возвращается', tag: 'chr',
        d: 'Самый сильный сценарий хроников: после первых улучшений лечение прерывают, и проблема возвращается. Это сильная территория для коммуникации про рецидив и контроль.' },
      { icon: 'tb:TbCircleX', t: 'Привычное средство больше не справилось', tag: 'chr',
        d: 'Люди с опытом лечения ищут новое решение после неудачного прошлого опыта. Сценарий хорошо подходит для переключения с конкурентов.' },
    ];
    const TAG = {
      nov: { t: 'Больше для новичков', fill: TINT.blue, ink: C.blue },
      both: { t: 'Для обоих сегментов', fill: C.cardTint, ink: C.navy },
      chr: { t: 'Больше для хроников', fill: TINT.crimson, ink: C.crimson },
    };

    // ── блок «Лишай» внизу: высота — по тексту ──
    const LT = 'Из-за специфичности, нишевости и более выраженной врачебной ориентированности эту территорию целесообразно отрабатывать через поиск и ORM: перехватывать сформированный спрос, помогать разобраться с симптомами и поддерживать выбор бренда.';
    const LP = 32;
    const LI = 96;
    const RBW = 380;
    const ltx = X0 + LP + LI + 36;
    const lvx = X1 - LP - RBW - 34;
    const ltw = lvx - 34 - ltx;
    const lth = 30 + 10 + measure(LT, ltw, 19);
    const BH = Math.max(LI, lth) + LP * 2 - 8;
    const BY = BOT - BH;

    // ── ось сегментов ──
    const AY = TOP;
    const AH = 52;
    const PW = 230;
    const cols = columns(6, { gap: 17 });
    const ly = AY + AH / 2;
    const CY = AY + AH + 26;
    s.arrow({ dir: 'right', x: X0 + PW + 18, y: ly, len: X1 - PW - 18 - (X0 + PW + 18), stem: 4, head: 22, headLen: 18, color: MUTED });
    s.pill('Новички', { x: X0, y: AY, w: PW, h: AH, color: SEG.nov, caps: false, size: 24 });
    s.pill('Хроники', { x: X1 - PW, y: AY, w: PW, h: AH, color: SEG.chr, caps: false, size: 24 });
    // точки на оси над карточками 2–5 и ножки к карточкам
    cols.forEach((c, i) => {
      const cx = c.x + c.w / 2;
      if (i === 0 || i === 5) {
        const px = i === 0 ? X0 + PW / 2 : X1 - PW / 2;
        s.vline(px, AY + AH, CY - AY - AH, MUTED, 2);
        return;
      }
      s.vline(cx, ly, CY - ly, MUTED, 2);
      const col = i < 2 ? SEG.nov : i > 3 ? SEG.chr : C.purple;
      s.circle({ x: cx - 9, y: ly - 9, d: 18, fill: col, stroke: C.white, sw: 3 });
    });

    // ── 6 карточек-оккейженов ──
    const CH = BY - 22 - CY;
    const P = 22;
    const cw = cols[0].w - P * 2;
    const ID = 72;
    // заголовки карточек — одним кеглем на всех шести (до 3 строк); описание идёт сразу под своим заголовком, как в исходнике
    const HS = 23;
    const TH = 40;
    OCC.forEach((o, i) => {
      const c = cols[i];
      const x = c.x + P;
      s.card({ x: c.x, y: CY, w: c.w, h: CH });
      s.icon(o.icon, { x, y: CY + P, size: ID, color: C.blue, circle: C.tint });
      const hy = CY + P + ID + 16;
      const headH = Math.round(Math.min(3, countLines(plainTr(o.t), HS, cw, true)) * HS * 1.1);
      s.text(o.t, { x, y: hy, w: cw, h: headH, size: HS, bold: true, lh: 1.1, color: C.navy });
      const dy = hy + headH + 12;
      const tg = TAG[o.tag];
      const ty = CY + CH - P - TH;
      s.text(o.d, { x, y: dy, w: cw, h: ty - 12 - dy, size: 19, lh: 1.2, color: C.blueText, fit: true, minSize: 16 });
      s.box({ x, y: ty, w: cw, h: TH, fill: tg.fill, r: 12 });
      s.text(tg.t, { x: x + 10, y: ty, w: cw - 20, h: TH, size: 16, bold: true, lh: 1.0, color: tg.ink, align: 'center', valign: 'middle', fit: true, minSize: 14 });
    });

    // ── Лишай ──
    s.card({ x: X0, y: BY, w: X1 - X0, h: BH, tint: true });
    s.icon('tb:TbVirusSearch', { x: X0 + LP, y: BY + (BH - LI) / 2, size: LI, color: C.white, circle: C.blue });
    const lty = BY + (BH - lth) / 2;
    s.text('Лишай', { x: ltx, y: lty, w: ltw, size: 26, bold: true, lh: 1.1, color: C.navy });
    s.text(LT, { x: ltx, y: lty + 40, w: ltw, size: 19, lh: 1.2, color: C.blueText });
    s.vline(lvx, BY + 24, BH - 48, C.line, 2);
    const rbh = 76;
    const rby = BY + (BH - rbh) / 2;
    const rbx = X1 - LP - RBW;
    s.box({ x: rbx, y: rby, w: RBW, h: rbh, fill: C.white, stroke: C.line, sw: 2, r: 15 });
    s.icon('tb:TbSearch', { x: rbx + 20, y: rby + (rbh - 44) / 2, size: 44, color: C.blue });
    s.text('**Каналы:** Поиск + ORM', { x: rbx + 78, y: rby, w: RBW - 94, h: rbh, size: 22, lh: 1.1, color: C.navy, valign: 'middle', fit: true, minSize: 18 });

    s.footnote('Источник: AI анализ отзывов');
  },

  // ───────────── 12. Краткость CJM и диджитал-каналы ─────────────
  12: (d) => {
    const s = d.slide({ title: 'Анализ отзывов показывает краткость CJM, а U&A подтверждает важность ключевых диджитал-каналов' });

    const SX = 1410;               // правая колонка 452
    const LX1 = SX - 23;
    // ── две большие цифры ──
    const KH = 128;
    const kw = Math.round((LX1 - X0 - 23) / 2);
    const STATS = [
      { icon: 'tb:TbSearch', v: '84%', t: 'искали информацию о лечении', color: C.blue },
      { icon: 'tb:TbCalendarCheck', v: '48%', t: 'уже при первых симптомах', color: C.crimson },
    ];
    STATS.forEach((st, i) => {
      const x = X0 + i * (kw + 23);
      s.box({ x, y: TOP, w: kw, h: KH, fill: st.color });
      s.icon(st.icon, { x: x + 30, y: TOP + (KH - 72) / 2, size: 72, color: st.color, circle: C.white });
      const vx = x + 30 + 72 + 28;
      const vw = Math.ceil(widthOf(st.v, 72, true)) + 8;
      s.text(st.v, { x: vx, y: TOP, w: vw, h: KH, size: 72, bold: true, lh: 1.0, color: C.white, valign: 'middle' });
      s.text(st.t, { x: vx + vw + 18, y: TOP, w: x + kw - 24 - (vx + vw + 18), h: KH, size: 22, lh: 1.2, color: C.white, valign: 'middle', fit: true, minSize: 18 });
    });

    // ── путь сбора информации по отзывам ──
    const PY = TOP + KH + 22;
    s.label('Путь сбора информации по отзывам', { x: X0, y: PY, w: LX1 - X0, size: 20, color: C.blue });
    const RH = 64;
    const RG = 12;
    const RY = PY + 34;
    const SW = 196;
    const PATHS = [
      { seg: 'Новички', color: SEG.nov, steps: [['tb:TbSearch', 'Симптом'], ['tb:TbWorld', 'поиск'], ['tb:TbMessageDots', 'статьи и отзывы'], ['tb:TbFirstAidKit', 'аптека или врач'], ['tb:TbLock', 'выбор препарата']] },
      { seg: 'Хроники', color: SEG.chr, steps: [['tb:TbSearch', 'Знакомый симптом'], ['tb:TbClock', 'прошлый опыт'], ['tb:TbPill', 'привычное средство'], ['tb:TbScale', 'сравнение альтернатив'], ['tb:TbStethoscope', 'врач при рецидиве']] },
    ];
    const stX = X0 + SW + 14;
    const stW = (LX1 - stX) / 5;
    PATHS.forEach((p, r) => {
      const y = RY + r * (RH + RG);
      s.box({ x: X0, y, w: SW, h: RH, fill: p.color, r: 15 });
      s.icon('tb:TbUser', { x: X0 + 18, y: y + (RH - 32) / 2, size: 32, color: C.white });
      s.text(p.seg, { x: X0 + 60, y, w: SW - 72, h: RH, size: 22, bold: true, lh: 1.0, color: C.white, valign: 'middle', fit: true, minSize: 18 });
      s.box({ x: stX, y, w: LX1 - stX, h: RH, fill: C.cardTint, stroke: C.line, sw: 1.5, r: 15 });
      p.steps.forEach(([ic, t], k) => {
        const sx = stX + k * stW;
        s.icon(ic, { x: sx + 14, y: y + (RH - 42) / 2, size: 42, color: C.white, circle: p.color });
        s.text(t, { x: sx + 66, y, w: stW - 66 - 28, h: RH, size: 17, lh: 1.15, color: C.navy, valign: 'middle', fit: true, maxLines: 2, minSize: 15 });
        if (k < 4) s.chevron({ cx: sx + stW - 12, cy: y + RH / 2, w: 11, h: 16, color: MUTED });
      });
    });
    const PB = RY + 2 * RH + RG;

    // ── справа: внутри онлайна лидируют (полосы долей) ──
    const ONL = [
      ['поисковики', 48, 48, '48%'], ['тематические статьи', 30, 30, '30%'], ['Q&A врача', 24, 24, '24%'],
      ['медобзоры', 23, 23, '23%'], ['отзовики, отзывы и сравнения', 14, 16, '14–16%'],
    ];
    const OP = 26;
    s.card({ x: SX, y: TOP, w: X1 - SX, h: PB - TOP, tint: true });
    s.icon('tb:TbWorld', { x: SX + OP, y: TOP + OP - 4, size: 40, color: C.white, circle: C.blue });
    s.text('Внутри онлайна лидируют:', { x: SX + OP + 52, y: TOP + OP - 4, w: X1 - SX - OP * 2 - 52, h: 40, size: 21, bold: true, lh: 1.1, color: C.navy, valign: 'middle', fit: true, minSize: 17 });
    const ow = X1 - SX - OP * 2;
    const oy0 = TOP + OP + 54;
    const op = (PB - OP + 6 - oy0) / ONL.length;
    const vwid = 86;
    const barW = ow - vwid - 8;
    ONL.forEach(([t, lo, hi, v], k) => {
      const y = oy0 + k * op;
      s.text(t, { x: SX + OP, y, w: ow - vwid, size: 17, lh: 1.1, color: C.navy, fit: true, maxLines: 1, minSize: 14 });
      s.text(v, { x: X1 - OP - vwid, y, w: vwid, size: 18, bold: true, lh: 1.1, color: C.blue, align: 'right' });
      const by = y + 24;
      s.box({ x: SX + OP, y: by, w: barW, h: 10, fill: C.white, r: 5 });
      s.box({ x: SX + OP, y: by, w: Math.max(10, barW * lo / 50), h: 10, fill: k === 0 ? C.blue : MUTED, r: 5 });
      if (hi > lo) s.box({ x: SX + OP + barW * lo / 50 - 4, y: by, w: barW * (hi - lo) / 50 + 4, h: 10, fill: mix('FFFFFF', MUTED, 0.5), r: 5 });
    });

    // ── 5 источников информации ──
    const SRCS = [
      { icon: 'tb:TbSearch', t: 'A. Поиск в интернете', v: '51% / поисковики 48%',
        nov: 'Стартуют с симптомов: зуд, шелушение, трещинки.', chr: 'Ищут препарат, аналоги и причины возврата.',
        imp: 'Новички — очень важно;\nХроники — важно' },
      { icon: 'tb:TbFileText', t: 'B. Статьи и медобзоры', v: '30% / 23%',
        nov: 'Нужны, чтобы быстро понять, что делать.', chr: 'Помогают сверить схему и рассмотреть альтернативы.',
        imp: 'Важно для обоих' },
      { icon: 'tb:TbMessageDots', t: 'C. Отзывы и сравнения', v: '14–16%',
        nov: 'Проверяют, помогает ли средство в похожей ситуации.', chr: 'Сравнивают, что сработало после другого средства.',
        imp: 'Очень важно для обоих' },
      { icon: 'tb:TbStethoscope', t: 'D. Врач / Q&A врача', v: '37% / 24%',
        nov: 'Идут, когда сомневаются в диагнозе.', chr: 'Возвращаются, когда привычная схема не сработала.',
        imp: 'Точечно, но значимо' },
      { icon: 'tb:TbShoppingCart', t: 'E. Фармацевт / интернет-аптеки', v: '18% / 20%',
        nov: 'Нужен понятный бренд и быстрая рекомендация.', chr: 'Чаще приходят уже с пониманием, что ищут.',
        imp: 'Новички — важно;\nХроники — умеренно' },
    ];
    const CY = PB + 22;
    const cols = columns(5, { gap: 17 });
    const P = 22;
    const cw = cols[0].w - P * 2;
    const IS = 50;
    const tw = cw - IS - 14;
    const headH = Math.max(IS, ...SRCS.map((c) => measure(c.t, tw, 20, true, 1.1)));
    const BS = 17;
    const bodyH = (c) => measure(`Новички: ${c.nov}`, cw, BS) + 6 + measure(`Хроники: ${c.chr}`, cw, BS);
    const BH = Math.max(...SRCS.map(bodyH));
    SRCS.forEach((c, i) => {
      const col = cols[i];
      const x = col.x + P;
      s.card({ x: col.x, y: CY, w: col.w, h: CB - CY });
      s.icon(c.icon, { x, y: CY + P, size: IS, color: C.white, bg: undefined, circle: C.blue });
      s.text(c.t, { x: x + IS + 14, y: CY + P, w: tw, h: headH, size: 20, bold: true, lh: 1.1, color: C.navy, valign: 'middle' });
      s.text(c.v, { x, y: CY + P + headH + 10, w: cw, size: 26, bold: true, lh: 1.1, color: C.blue, fit: true, maxLines: 1, minSize: 20 });
      const y0 = CY + P + headH + 10 + 29 + 12;
      let y = y0;
      y += s.text(`**Новички:** ${c.nov}`, { x, y, w: cw, size: BS, lh: 1.2, color: C.blueText }) + 6;
      s.text(`**Хроники:** ${c.chr}`, { x, y, w: cw, size: BS, lh: 1.2, color: C.blueText });
      const hy = y0 + BH + 14;
      s.hline(x, hy, cw, TINT.crimson, 2);
      s.text('Важность по отзывам:', { x, y: hy + 12, w: cw, size: 16, bold: true, lh: 1.2, color: C.crimson });
      s.text(c.imp, { x, y: hy + 12 + 22, w: cw, size: 17, lh: 1.2, color: C.navy });
    });

    s.principle({ label: 'Главный вывод', icon: 'target',
      text: 'Короткий CJM усиливает роль поиска и отзывов, а повторяемость проблемы делает важной запоминаемость бренда, которую можно строить через видео.' });
    s.footnote('Источник: Акрихин U&A + AI анализ отзывов');
  },

  // ───────────── 13. Роли каналов при коротком CJM ─────────────
  13: (d) => {
    const s = d.slide({
      title: 'Как распределить роли каналов при коротком CJM',
      subtitle: 'Короткий CJM не делает Video конверсионным каналом: его роль — заранее сформировать выбор бренда, а момент потребности забрать через search, баннеры и контент.',
    });

    // ── короткий путь 1–4 внизу ──
    const STEPS = [
      { t: 'Видео', d: 'создаёт знание', color: C.blue, icon: 'tb:TbDeviceTv' },
      { t: 'Search', d: 'ловит спрос', color: C.crimson, icon: 'tb:TbSearch' },
      { t: 'Баннеры', d: 'добавляют релевантность', color: C.blue, icon: 'tb:TbDeviceDesktop' },
      { t: 'ORM / контент', d: 'снимают сомнения', color: C.blue, icon: 'tb:TbMessageDots' },
    ];
    const SH = 100;
    const SY = CB - SH;
    const LY = SY - 42;
    const lab = 'Короткий путь не удлиняем — распределяем задачи каналов';
    const lw = Math.ceil(widthOf(lab, 21, true)) + 8;
    s.text(lab, { x: X0, y: LY, w: lw, size: 21, bold: true, lh: 1.1, color: C.blue });
    s.hline(X0 + lw + 16, LY + 12, X1 - X0 - lw - 16, C.line, 2);
    const AG = 46;
    const stw = (X1 - X0 - AG * 3) / 4;
    STEPS.forEach((st, i) => {
      const x = X0 + i * (stw + AG);
      s.box({ x, y: SY, w: stw, h: SH, fill: st.color, r: 15 });
      s.badge({ x: x + 22, y: SY + (SH - 56) / 2, d: 56, n: i + 1, color: C.white, textColor: st.color, size: 28 });
      s.icon(st.icon, { x: x + stw - 22 - 44, y: SY + (SH - 44) / 2, size: 44, color: mix(st.color, 'FFFFFF', 0.45) });
      const tx = x + 22 + 56 + 18;
      const tw = stw - (tx - x) - 22 - 44 - 10;
      s.text(st.t, { x: tx, y: SY + 18, w: tw, size: 24, bold: true, lh: 1.05, color: C.white, fit: true, maxLines: 1, minSize: 19 });
      s.text(st.d, { x: tx, y: SY + 50, w: tw, h: SH - 56, size: 18, lh: 1.15, color: C.white, fit: true, maxLines: 2, minSize: 15 });
      if (i < 3) s.arrow({ dir: 'right', x: x + stw + 8, y: SY + SH / 2, len: AG - 16, stem: 6, head: 22, headLen: 14, color: C.navy });
    });

    // ── карточки: видео (слева) и роль каналов (справа) ──
    const CY = TOP;
    const CH = LY - 26 - CY;
    const LW = 1040;
    const RX = X0 + LW + 23;
    const P = 30;

    // видео
    s.card({ x: X0, y: CY, w: LW, h: CH });
    s.box({ x: X0, y: CY + 20, w: 6, h: CH - 40, fill: C.blue, r: 3 });
    const ix = X0 + P;
    s.box({ x: ix, y: CY + P - 4, w: 64, h: 64, fill: C.blue, r: 15 });
    s.icon('tb:TbDeviceTv', { x: ix + 12, y: CY + P + 8, size: 40, color: C.white });
    s.text('Видео: создаёт знание до симптома', { x: ix + 84, y: CY + P - 6, w: LW - P * 2 - 84, size: 28, bold: true, lh: 1.1, color: C.navy });
    s.text('Исследование категории показывает: проблема часто повторяется', { x: ix + 84, y: CY + P + 32, w: LW - P * 2 - 84, size: 18, lh: 1.2, color: C.blueText });
    const TY = CY + P + 82;
    const TH = 118;
    const tc = columns(3, { x0: ix, x1: X0 + LW - P, gap: 18 });
    [['64%', 'болеют больше года'], ['48%', 'сталкиваются минимум раз в год'], ['34%', 'впервые столкнулись с проблемой']].forEach(([v, t], i) => {
      const c = tc[i];
      s.box({ x: c.x, y: TY, w: c.w, h: TH, fill: C.cardTint, stroke: C.line, sw: 1.5 });
      s.text(v, { x: c.x + 22, y: TY + 12, w: c.w - 44, size: 52, bold: true, lh: 1.05, color: C.blue });
      s.text(t, { x: c.x + 22, y: TY + 12 + 58, w: c.w - 44, h: TH - 76, size: 18, lh: 1.15, color: C.navy, fit: true, maxLines: 2, minSize: 15 });
    });
    const ROWS = [
      { icon: 'tb:TbBrain', t: 'Видео помогает **заранее запомнить Акримиколь**' },
      { icon: 'tb:TbUsers', t: 'Работает на широкую аудиторию **М/Ж 25–55** без дробления на узкие сегменты,\n**но с категорийным таргетингом**' },
      { icon: 'tb:TbShieldPlus', t: '**Сообщение:** зуд, шелушение, трещинки и раздражение кожи могут быть признаками грибка; Акримиколь помогает бороться с грибком кожи и неприятными симптомами' },
    ];
    const rx = ix + 66;
    const rw = X0 + LW - P - rx;
    const RS = 19;
    const r0 = TY + TH + 14;
    const avail = CY + CH - 18 - r0;
    const hs = ROWS.map((r) => Math.max(46, measure(r.t, rw, RS)));
    const rg = (avail - hs.reduce((a, b) => a + b, 0)) / ROWS.length;
    let y = r0;
    ROWS.forEach((r, i) => {
      s.hline(ix, y, LW - P * 2, C.line, 1.5);
      const yy = y + rg / 2;
      s.icon(r.icon, { x: ix, y: yy + (hs[i] - 46) / 2, size: 46, color: C.white, circle: C.blue });
      s.text(r.t, { x: rx, y: yy + (hs[i] - measure(r.t, rw, RS)) / 2, w: rw, size: RS, lh: 1.2, color: C.navy });
      y += hs[i] + rg;
    });

    // роль каналов
    const RW = X1 - RX;
    s.card({ x: RX, y: CY, w: RW, h: CH });
    s.text('Роль каналов', { x: RX + P, y: CY + P - 6, w: RW - P * 2, size: 28, bold: true, lh: 1.1, color: C.navy });
    const CH_ = [
      { icon: 'tb:TbDeviceDesktop', t: 'Баннеры / programmatic', d: 'Персонализируют вход под occasion-сигналы: после бассейна, работа в закрытой обуви, симптомы, рецидив.', color: C.blue },
      { icon: 'tb:TbMessageDots', t: 'ORM / контент', d: 'Помогают распознать проблему, подтвердить выбор и снять сомнения перед покупкой.', color: C.crimson },
      { icon: 'tb:TbSparkles', t: 'GEO / AEO', d: 'Присутствие бренда в нейропоиске и AI-ответах на этапе изучения и выбора.', color: C.blue },
      { icon: 'tb:TbSearch', t: 'Search', d: 'Перехватывает уже сформированный спрос: симптомы, лечение, рецидив, поиск нового решения.', color: C.crimson },
    ];
    const ry0 = CY + P + 46;
    const RG = 12;
    const rh = (CY + CH - 22 - ry0 - RG * 3) / 4;
    const ID = 52;
    const ctx = RX + P + 14 + ID + 18;
    const ctw = X1 - P - 18 - ctx;
    CH_.forEach((c, i) => {
      const yy = ry0 + i * (rh + RG);
      s.box({ x: RX + P, y: yy, w: RW - P * 2, h: rh, fill: C.white, stroke: C.line, sw: 1.5, r: 15 });
      s.box({ x: RX + P, y: yy + 8, w: 6, h: rh - 16, fill: c.color, r: 3 });
      s.icon(c.icon, { x: RX + P + 18, y: yy + (rh - ID) / 2, size: ID, color: C.blue, circle: C.tint });
      const bh = 24 + 8 + measure(c.d, ctw, 18);
      const ty = yy + (rh - bh) / 2;
      s.text(c.t, { x: ctx, y: ty, w: ctw, size: 22, bold: true, lh: 1.1, color: C.navy });
      s.text(c.d, { x: ctx, y: ty + 32, w: ctw, size: 18, lh: 1.2, color: C.blueText });
    });

    s.principle({ label: 'Вывод', icon: 'target',
      text: 'Видео даёт бренду шанс быть вспомненным, а digital-инструменты забирают короткий момент выбора.' });
    s.footnote('Источник: Акрихин U&A');
  },

  // ───────────── 14. География 2027 ─────────────
  14: (d) => {
    const s = d.slide({
      title: 'География 2027: ядро продаж — для концентрации',
      subtitle: 'Недопроникнутые регионы — для роста, long tail — национальное покрытие в рамках Paid\u00a0Search',
    });
    const GEO = { core: C.blue, grow: C.green, tail: C.crimson };

    // ── полоса цифр: ядро, ядро + рост, медиа-сплит ──
    const KH = 104;
    const kc = columns(2, { gap: 23 });
    const KP = 28;
    [
      { lab: 'Ядро для consumer digital', val: '8 кластеров', sub: '51% продаж H1 2026' },
      { lab: 'Ядро + зона роста', val: '≈60%', sub: 'продаж Акримиколя H1 2026' },
    ].forEach((k, i) => {
      const c = kc[i];
      s.box({ x: c.x, y: TOP, w: c.w, h: KH, fill: C.cardTint, stroke: C.line, sw: 2 });
      s.text(k.lab, { x: c.x + KP, y: TOP + 16, w: c.w - KP * 2, size: 16, bold: true, lh: 1.0, color: C.blueText, caps: true });
      valueUnit(s, { x: c.x + KP, y: TOP + 40, w: c.w - KP * 2, value: k.val, unit: k.sub, size: 44, unitSize: 20, color: C.navy });
    });

    // ── три колонки ──
    const cols = columns(3, { gap: 23 });
    const CY = TOP + KH + 22;
    const P = 30;
    const cw = cols[0].w - P * 2;
    const ID = 48;
    const head = (col, icon, color, text) => {
      s.icon(icon, { x: col.x + P, y: CY + 24, size: ID, color: C.white, circle: color });
      s.text(text, { x: col.x + P + ID + 16, y: CY + 24, w: cw - ID - 16, h: ID, size: 26, bold: true, lh: 1.05, color: C.navy, valign: 'middle', fit: true, minSize: 21 });
    };
    const leadY = CY + 24 + ID + 18;
    const LEADS = ['Защита текущей базы: 51% продаж H1 и 52% продаж июля.', 'Категория >90 тыс. уп. H1; доля бренда ≤3,0% при среднем по РФ 3,1%.'];
    const leadH = Math.max(...LEADS.map((t) => measure(t, cw, 18)));
    const NOTES = ['Доля — от продаж Акримиколя в упаковках, H1 2026.', 'Эти 6 регионов добавляют ещё ≈9% продаж бренда H1 2026.'];
    const noteH = Math.max(...NOTES.map((t) => measure(t, cw, 16)));
    const noteY = CB - P + 6 - noteH;
    const chipY0 = leadY + leadH + 20;
    const chipH = noteY - 18 - chipY0;

    // 1. логика выбора географии
    const c1 = cols[0];
    s.card({ x: c1.x, y: CY, w: c1.w, h: CB - CY, tint: true });
    head(c1, 'tb:TbMapPins', C.navy, 'Логика выбора географии');
    const LOGIC = [
      { color: GEO.core, t: '**Масштаб текущих продаж бренда:** защищаем территории, которые уже дают основной объём' },
      { color: C.cyan, t: '**Потенциал роста:** крупная категория + доля Акримиколя ниже / около среднего по РФ (3,1%).' },
      { color: GEO.grow, t: '**Подтверждаем динамикой** H1 2026 vs H1 2025 и не масштабируем регионы только из-за разового всплеска.' },
    ];
    // медиа-сплит — внизу колонки, низ вровень с плашками регионов
    const MH = 92;
    const MY = chipY0 + chipH - MH;
    const MLY = MY - 34;
    s.text('Медиа-сплит по географии', { x: c1.x + P, y: MLY, w: cw, size: 16, bold: true, lh: 1.0, color: C.blueText, caps: true });
    const mg = 12;
    const mtw = (cw - mg * 2) / 3;
    [['60–65%', 'ядро', GEO.core, TINT.blue], ['25–30%', 'рост', GEO.grow, TINT.green], ['≤10%', 'long tail', GEO.tail, TINT.crimson]].forEach(([v, u, col, fill], i) => {
      const x = c1.x + P + i * (mtw + mg);
      s.box({ x, y: MY, w: mtw, h: MH, fill, stroke: C.line, sw: 1.5, r: 12 });
      s.text(v, { x: x + 8, y: MY + 12, w: mtw - 16, h: 40, size: 32, bold: true, lh: 1.1, color: col, align: 'center', fit: true, maxLines: 1, minSize: 24 });
      s.text(u, { x: x + 8, y: MY + 56, w: mtw - 16, size: 17, lh: 1.1, color: C.navy, align: 'center' });
    });
    const lx = c1.x + P + 22;
    const lw = cw - 22;
    const top = leadY + 4;
    const availL = MLY - 28 - top;
    const LS = 19;
    const lhs = LOGIC.map((l) => measure(l.t, lw, LS));
    const lg = Math.min(40, (availL - lhs.reduce((a, b) => a + b, 0)) / (LOGIC.length - 1));
    let ly = top;
    LOGIC.forEach((l, i) => {
      s.box({ x: c1.x + P, y: ly + 2, w: 6, h: lhs[i] - 4, fill: l.color, r: 3 });
      s.text(l.t, { x: lx, y: ly, w: lw, size: LS, lh: 1.2, color: C.navy });
      ly += lhs[i] + lg;
    });

    // 2–3. регионы
    const chips = (col, list, color, fill, rows) => {
      const g = 12;
      const chw = (cw - g) / 2;
      const chh = (chipH - g * (rows - 1)) / rows;
      list.forEach(([name, v], k) => {
        const x = col.x + P + (k % 2) * (chw + g);
        const y = chipY0 + Math.floor(k / 2) * (chh + g);
        s.box({ x, y, w: chw, h: chh, fill, stroke: C.line, sw: 1.5, r: 12 });
        const vw = Math.ceil(widthOf(v, 20, true)) + 6;
        s.text(name, { x: x + 16, y, w: chw - 32 - vw - 6, h: chh, size: 18, lh: 1.1, color: C.navy, valign: 'middle', fit: true, maxLines: 2, minSize: 15 });
        s.text(v, { x: x + chw - 16 - vw, y, w: vw, h: chh, size: 20, bold: true, lh: 1.0, color, valign: 'middle', align: 'right' });
      });
    };
    const c2 = cols[1];
    s.card({ x: c2.x, y: CY, w: c2.w, h: CB - CY });
    head(c2, 'tb:TbTarget', GEO.core, 'Приоритет 1 — ядро');
    s.text(LEADS[0], { x: c2.x + P, y: leadY, w: cw, size: 18, lh: 1.2, color: C.blueText });
    chips(c2, [['Москва + МО', '24,3%'], ['СПб + ЛО', '8,7%'], ['Краснодар', '4,5%'], ['Свердловская', '3,5%'],
      ['Ростовская', '2,7%'], ['Самарская', '2,6%'], ['Татарстан', '2,3%'], ['Новосибирская', '2,3%']], C.blue, C.cardTint, 4);
    s.text(NOTES[0], { x: c2.x + P, y: noteY, w: cw, size: 16, lh: 1.2, color: C.blueText });

    const c3 = cols[2];
    s.card({ x: c3.x, y: CY, w: c3.w, h: CB - CY });
    head(c3, 'tb:TbTrendingUp', GEO.grow, 'Приоритет 2 — география роста');
    s.text(LEADS[1], { x: c3.x + P, y: leadY, w: cw, size: 18, lh: 1.2, color: C.blueText });
    chips(c3, [['Башкортостан', '3,0%'], ['Челябинская', '3,0%'], ['Нижегородская', '2,4%'], ['Красноярский', '2,9%'],
      ['Ставропольский', '2,3%'], ['Приморский', '1,7%']], C.green, TINT.green, 3);
    s.text(NOTES[1], { x: c3.x + P, y: noteY, w: cw, size: 16, lh: 1.2, color: C.blueText });

    s.principle({ label: 'Рекомендация', icon: 'tb:TbMapPin',
      text: 'Long tail закрываем через AON Search для национального присутствия, концентрация в ядре и географии роста в рамках медиа-активностей. Приоритет № 1 — концентрация OLV в географии с ядром продаж.' });
  },

  // ───────────── 15. Сезонность 2027 ─────────────
  15: (d) => {
    const s = d.slide({
      title: 'Сезонность 2027: основной флайт — апрель–июль',
      subtitle: 'Охватное давление усиливаем перед и в пик фактических продаж, AON-инструменты работают весь год',
    });

    // ── три факта ──
    const KH = 108;
    const kc = columns(3, { gap: 23 });
    const KP = 26;
    [
      { lab: 'Категория · сезонность', val: 'Июль = индекс 113', sub: 'максимум среднего профиля 2024–2025' },
      { lab: 'Акримиколь · факт 2026', val: '23,9 → 39,8 тыс. уп.', sub: 'январь → июль; июль — максимум YTD' },
      { lab: 'Поисковый спрос', val: 'Июнь–июль — главный летний пик', sub: 'осенью хвост: микроспория / стригущий лишай' },
    ].forEach((k, i) => {
      const c = kc[i];
      s.box({ x: c.x, y: TOP, w: c.w, h: KH, fill: C.cardTint, stroke: C.line, sw: 2 });
      s.text(k.lab, { x: c.x + KP, y: TOP + 14, w: c.w - KP * 2, size: 16, bold: true, lh: 1.0, color: C.blueText, caps: true });
      s.text(k.val, { x: c.x + KP, y: TOP + 36, w: c.w - KP * 2, h: 38, size: 32, bold: true, lh: 1.1, color: C.navy, fit: true, maxLines: 1, minSize: 24 });
      s.text(k.sub, { x: c.x + KP, y: TOP + 78, w: c.w - KP * 2, size: 16, lh: 1.2, color: C.blueText, fit: true, maxLines: 1, minSize: 14 });
    });

    // общая сетка месяцев для графика и ганта
    const CP = 28;
    const LW = 380;
    const GX = X0 + CP + LW + 10;
    const GW = X1 - CP - GX;
    const MW = GW / 12;
    const mx = (m) => GX + m * MW;
    const MON = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

    // ── график: индекс продаж категории, цвет — интенсивность медиа ──
    const IDX = [91, 93, 101, 105, 103, 107, 113, 105, 99, 98, 93, 93];
    const AKR = ['23,9', '28,7', '33,8', '37,6', '30,6', '34,6', '39,8'];
    // интенсивность по исходнику (высота столбцов): высокая — апр–июль, средняя — мар, авг, сен, низкая — остальные
    const LVL = [0, 0, 1, 2, 2, 2, 2, 1, 1, 0, 0, 0];
    const LCOL = [MUTED, C.blue, C.crimson];
    const Y1 = TOP + KH + 18;
    const H1 = 308;
    s.card({ x: X0, y: Y1, w: X1 - X0, h: H1 });
    const hh = s.text('Принцип медиадавления по году', { x: X0 + CP, y: Y1 + 20, w: LW, size: 22, bold: true, lh: 1.1, color: C.navy });
    const P = { x: GX, y: Y1 + 40, w: GW, h: 162 };   // шкала от 0 — высота столбца честно отражает индекс; сверху место под подписи
    const series = [0, 1, 2].map((lv) => ({
      name: ['Низкая', 'Средняя', 'Высокая'][lv],
      labels: MON,
      values: IDX.map((v, m) => (LVL[m] === lv ? v : null)),
    }));
    s.chart('col', series, { x: P.x, y: P.y, w: P.w, h: P.h, plot: P, min: 0, max: 120, colors: LCOL, legend: false,
      overlap: 100, gap: 45, labelSize: 17, labelColor: C.navy, labelBold: true, extra: { catAxisHidden: true } });
    const MY = P.y + P.h + 6;
    MON.forEach((m, i) => s.text(m, { x: mx(i), y: MY, w: MW, size: 16, bold: true, lh: 1.0, color: C.navy, align: 'center' }));
    const AY = MY + 32;
    s.box({ x: X0 + CP, y: AY - 6, w: X1 - X0 - CP * 2, h: 36, fill: C.cardTint, r: 10 });
    s.text('Акримиколь 2026, тыс. уп.', { x: X0 + CP + 14, y: AY - 6, w: LW - 14, h: 36, size: 17, bold: true, lh: 1.0, color: C.navy, valign: 'middle' });
    AKR.forEach((v, i) => s.text(v, { x: mx(i), y: AY - 6, w: MW, h: 36, size: 17, bold: true, lh: 1.0, color: C.navy, align: 'center', valign: 'middle' }));
    // подписи слева от графика
    const ly = Y1 + 20 + hh + 18;
    s.text('Индекс продаж категории*', { x: X0 + CP, y: ly, w: LW, size: 17, bold: true, lh: 1.2, color: C.navy });
    s.text('Цвет столбца = рекомендуемая интенсивность медиа', { x: X0 + CP, y: ly + 30, w: 300, size: 16, lh: 1.2, color: C.blueText });
    const lgy = ly + 30 + measure('Цвет столбца = рекомендуемая интенсивность медиа', 300, 16) + 10;
    legendRow(s, X0 + CP, lgy, [[C.crimson, 'высокая'], [C.blue, 'средняя'], [MUTED, 'низкая']], { size: 16, gap: 18 });

    // ── гант: распределение инструментов ──
    const Y2 = Y1 + H1 + 18;
    const H2 = BOT - Y2;
    s.card({ x: X0, y: Y2, w: X1 - X0, h: H2 });
    s.text('Распределение инструментов', { x: X0 + CP, y: Y2 + 20, w: LW, size: 22, bold: true, lh: 1.1, color: C.navy });
    s.text('Стартуем до сезонного пика, держим максимум reach-давления в апреле–июле, сохраняем AON-контур весь год',
      { x: GX, y: Y2 + 22, w: GW, size: 19, bold: true, lh: 1.15, color: C.blue, fit: true, maxLines: 1, minSize: 16 });
    const HY = Y2 + 64;
    const HH = 30;
    MON.forEach((m, i) => {
      s.box({ x: mx(i) + 3, y: HY, w: MW - 6, h: HH, fill: C.tint, r: 8 });
      s.text(m, { x: mx(i) + 3, y: HY, w: MW - 6, h: HH, size: 15, bold: true, lh: 1.0, color: C.navy, align: 'center', valign: 'middle' });
    });
    // ячейки по месяцам (как в исходнике): A — AON (синий), P — пик (малиновый), L — поддержка вне пика (светлый), E — пустая рамка
    const LIGHT = mix('FFFFFF', C.cyan, 0.35);
    const FAINT = mix('FFFFFF', C.cyan, 0.07);
    const FILL = { A: C.blue, P: C.crimson, L: LIGHT, E: FAINT };
    const ROWS = [
      ['GEO+AEO / ORM / Paid Search', 'AAAPPPPAAAAA'],
      ['Video', '--EPPEP-----'],
      ['Banners / Programmatic & Display', '--LPPPPLL---'],
      ['Social (MAX)', '--LPPPPLL---'],
      ['Внешние публикации / контент', '--LPPPPLLLL-'],
    ];
    const RY0 = HY + HH + 12;
    const RG = 8;
    const RH = Math.floor((Y2 + H2 - 20 - RY0 - RG * (ROWS.length - 1)) / ROWS.length);
    ROWS.forEach(([name, cells], r) => {
      const y = RY0 + r * (RH + RG);
      s.text(name, { x: X0 + CP, y, w: LW, h: RH, size: 18, bold: true, lh: 1.05, color: C.navy, valign: 'middle', fit: true, maxLines: 1, minSize: 15 });
      s.box({ x: GX, y, w: GW, h: RH, fill: C.cardTint, r: 8 });
      for (let m = 1; m < 12; m++) s.vline(mx(m), y + 4, RH - 8, C.white, 2);
      // соседние одинаковые месяцы — одной полосой
      let m = 0;
      while (m < 12) {
        const t = cells[m];
        let e = m + 1;
        while (e < 12 && cells[e] === t) e++;
        if (t !== '-') {
          const bx = mx(m) + 4;
          const bw = (e - m) * MW - 8;
          s.box({ x: bx, y: y + 4, w: bw, h: RH - 8, fill: FILL[t], stroke: t === 'E' ? C.line : undefined, sw: 1.5, r: 8 });
        }
        m = e;
      }
    });

    s.footnote('*Индекс месяца = средние продажи этого месяца за 2024–2025 / средние месячные продажи за 2024–2025 × 100');
  },
};
