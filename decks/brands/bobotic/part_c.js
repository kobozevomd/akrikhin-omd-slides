// Боботик · стратегия 2027 — часть C: слайды исходника 12–15. В исходнике все четыре — картинки во весь слайд
// (сгенерированные макеты); пересобраны живым текстом, тексты прочитаны по увеличенным фрагментам картинок
// (out/render/brand_bobotic_part_c/zoom/), на 13 — сверены с живым текстом, который лежит под картинкой.
// 12 — 2026 → 2027: три метрики H1 2026, цепочка «Что доказал 2026 → Что нужно достроить → Что меняется в 2027», step-change;
// 13 — тренды современной мамы: 4 карточки вокруг фото + чего хочет мама, вывод — плашкой. Фото c_mom.png — вырезка
//      из media/img_8a29083a5f.png, рамка (600,300)–(975,612) px картинки; фото в исходнике — «капля», поэтому верхний
//      левый угол рамки (белая кайма и край рукописного стикера) залит размытым фоном самого фото. Стикеры не переносим (TASK §4);
// 14 — сегменты и оккейжены: «Сегментация» / «Коммуникация» (фоновые фото пледа и игрушки — декор, не переносим);
// 15 — выбор средств от колик: когда покупают (≈15% / ≈85% — живые кольцевые графики), как происходит выбор, на что смотрят.
// Аналоги в серии: Azelik 17 и Acriol 12 (результаты), Clindovit 10, Azelik 26–30 (аудитория).
const path = require('path');
const { C, columns, countLines, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT
const B = require('./common');                            // SRC, MEDIA, CROPS

const TOP = V.TOP;   // 221 — верх контента
const BOT = V.BOT;   // 1005 — низ контента без плашки
const CB = 905;      // низ контента над плашкой
const X0 = 58;
const X1 = 1862;

// ---------- помощники ----------
// Высота текста так же, как её оценивает s.text — по переведённой строке, чтобы EN-сборка пересчитывала геометрию
const plainTr = (text) => typo(tr(String(text))).replace(/\*\*|\[\[|\]\]/g, '');
const measure = (text, w, size = 18, bold = false, lh = 1.2) =>
  Math.round(countLines(plainTr(text), size, w, bold) * size * lh);
const sum = (a) => a.reduce((x, y) => x + y, 0);

// Смешение цвета с белым: k = 0 — белый, 1 — исходный цвет
function tintOf(hex, k) {
  const c = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return c.map((v) => Math.round(255 + (v - 255) * k).toString(16).padStart(2, '0')).join('').toUpperCase();
}

// Ширина блока, при которой текст занимает столько же строк, но строки ровнее — без висящего последнего слова
function evenW(text, w, size, bold = false) {
  const lines = (ww) => countLines(plainTr(text), size, ww, bold);
  const n = lines(w);
  if (n < 2) return w;
  let lo = w * 0.4;
  let hi = w;
  while (hi - lo > 1) { const m = (lo + hi) / 2; if (lines(m) <= n) hi = m; else lo = m; }
  return Math.min(w, Math.ceil(hi) + 4);
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

// Иконка в кружке + текст справа (по центру кружка, если текст ниже кружка); возвращает высоту строки
function iconText(s, { x, y, w, icon, circle = C.blue, iconColor = C.white, text, d = 56, gap = 20, size = 18, bold = false, color = C.blueText, lh = 1.2 }) {
  const tw = w - d - gap;
  const th = measure(text, tw, size, bold, lh);
  const h = Math.max(d, th);
  s.icon(icon, { x, y: y + (h - d) / 2, size: d, circle, color: iconColor });
  s.text(text, { x: x + d + gap, y: y + (h - th) / 2, w: tw, size, bold, lh, color });
  return h;
}
const iconTextH = ({ w, text, d = 56, gap = 20, size = 18, bold = false, lh = 1.2 }) => Math.max(d, measure(text, w - d - gap, size, bold, lh));

module.exports = {
  // =====================================================================
  // 12 · 2026: падение замедлилось → 2027: стабилизацию в рост  (аналоги — Azelik 17, Acriol 12)
  // =====================================================================
  12: (d) => {
    const s = d.slide({
      title: '2026: падение замедлилось, но этого пока недостаточно для восстановления доли рынка',
      subtitle: '2027: превращаем стабилизацию в рост за счет масштаба, точности и управляемого пути к покупке',
    });

    // ── A. Три метрики H1 2026 ──
    const MH = 166;
    const mc = columns(3, { gap: 24 });
    const metrics = [
      { icon: 'tb:TbChartBar', label: 'Media response H1 2026', value: 'CTR 1,15%', sub: '+47% vs plan', hot: true },
      { icon: 'tb:TbClick', label: 'Traffic H1 2026', value: '143 тыс.', sub: 'кликов' },
      { icon: 'tb:TbUsers', label: 'Quality visits H1 2026', value: '94 тыс.', sub: '+14% vs plan', hot: true },
    ];
    metrics.forEach((m, i) => {
      const { x, w } = mc[i];
      s.card({ x, y: TOP, w, h: MH });
      const D = 96;
      s.icon(m.icon, { x: x + 30, y: TOP + (MH - D) / 2, size: D, circle: C.blue });
      const tx = x + 30 + D + 30;
      const tw = x + w - 24 - tx;
      s.text(m.label.toUpperCase(), { x: tx, y: TOP + 24, w: tw, size: 18, bold: true, lh: 1.0, color: C.blue, fit: true, maxLines: 1, minSize: 14 });
      s.text(m.value, { x: tx, y: TOP + 50, w: tw, size: 56, bold: true, lh: 1.05, color: C.navy, fit: true, maxLines: 1, minSize: 40 });
      s.text(m.sub, { x: tx, y: TOP + 117, w: tw, size: 21, bold: !!m.hot, lh: 1.1, color: m.hot ? C.crimson : C.blueText });
    });

    // ── B. Цепочка: что доказал 2026 → что нужно достроить → что меняется в 2027 ──
    const BY = TOP + MH + 30;
    const HH = 76;
    const AG = 56;                                  // зазор под стрелку между колонками
    const bc = columns(3, { gap: AG });
    const blocks = [
      { icon: 'target', color: C.blue, label: 'Что доказал 2026', items: [
        'Медиаконтакт и качество трафика превысили план',
        'Occasion-based механика подтвердила релевантный отклик',
        'Search / performance + ORM уверенно закрывают сформированный спрос'] },
      { icon: 'bulb', color: C.cyan, label: 'Что нужно достроить', items: [
        'Occasion-based механику протестировали преимущественно в нижней части воронки',
        'Требуется усилить присутствие бренда на более ранних этапах пути мамы',
        'Media → Search / content → purchase ещё не связаны в единую систему'] },
      { icon: 'tb:TbSettings', color: C.crimson, label: 'Что меняется в 2027', items: [
        'Масштабируем точный контакт на большее число релевантных мам',
        'Добавляем видеослой для построения знания и доверия до Search',
        'Связываем media → Search / content → purchase в управляемый путь выбора'] },
    ];
    const KY = BY + HH + 12;
    const KH = CB - KY;
    const P = 30;
    const SZ = 23;
    const DOT = 12;
    blocks.forEach((b, i) => {
      const { x, w } = bc[i];
      headBox(s, { x, y: BY, w, h: HH, color: b.color, icon: b.icon, text: b.label, size: 23 });
      if (i < blocks.length - 1) s.arrow({ dir: 'right', x: x + w + 10, y: BY + HH / 2, len: AG - 20, head: 30, headLen: 16, stem: 8, color: C.blue });
      s.card({ x, y: KY, w, h: KH, tint: i === blocks.length - 1 });
      const tw = w - P * 2 - DOT - 16;
      const hs = b.items.map((t) => measure(t, tw, SZ));
      const free = KH - P * 2 - sum(hs);
      const g = Math.min(56, free / (b.items.length - 1));
      let y = KY + P + Math.max(0, (KH - P * 2 - sum(hs) - g * (b.items.length - 1)) / 2);
      b.items.forEach((t, k) => {
        if (k) s.hline(x + P, y - g / 2, w - P * 2);
        s.circle({ x: x + P, y: y + (SZ * 1.2 - DOT) / 2, d: DOT, fill: b.color });
        s.text(t, { x: x + P + DOT + 16, y, w: tw, size: SZ, lh: 1.2, color: C.navy });
        y += hs[k] + g;
      });
    });

    s.principle({ label: 'Step-change 2027', icon: 'tb:TbMountain',
      text: 'От точечного эффективного контакта **к масштабируемой системе влияния на выбор**' });
  },

  // =====================================================================
  // 13 · Тренды современной мамы  (аналоги — Clindovit 10, Azelik 28)
  // =====================================================================
  13: (d) => {
    const s = d.slide({
      title: 'Тренды современной мамы: осознанность, рациональность и поиск идеала',
      subtitle: 'Современная мама сегодня — это больше знаний, больше ответственности и больше вызовов. Она стремится быть лучшей, принимает взвешенные решения и ищет баланс между идеалом и реальной жизнью.',
    });
    // Раскладка как в исходнике: тренды 1 и 3 слева, 2 и 4 справа, фото мамы с малышом по центру
    const PW = 440;
    const PH = Math.round(PW * 312 / 375);         // вырезка c_mom.png 375×312
    const G = 24;
    const SW = (X1 - X0 - PW - G * 2) / 2;
    const LX = X0;
    const CX = X0 + SW + G;
    const RX = CX + PW + G;
    const RH = (CB - TOP - G) / 2;
    const trends = [
      { n: 1, x: LX, y: TOP, icon: 'tb:TbCrown', color: C.crimson,
        title: 'Хорошая мама и недостижимый идеал',
        text: 'Современное родительство становится более интенсивным: нужно знать, читать, развивать, правильно кормить, правильно лечить и ничего не упустить. Установки на интенсивное родительство связаны с большим родительским стрессом, тогда как осознанное родительство с меньшим. Поэтому коммуникация, которая еще сильнее говорит маме «ты должна делать правильно», может усиливать напряжение.' },
      { n: 2, x: RX, y: TOP, icon: 'tb:TbHeartHandshake', color: C.blue,
        title: 'Материнство — это счастье и серьезная работа',
        text: '[[**86%**]] россиян считают материнство трудной работой, а [[**39%**]] — что сегодня быть матерью сложнее, чем 20\u00a0лет\u00a0назад.\n\nРоссийские исследования также фиксируют родительский стресс и особенно эмоциональное истощение у матерей. Поэтому маме особенно ценны решения, которые снимают часть нагрузки.' },
      { n: 3, x: LX, y: TOP + RH + G, icon: 'tb:TbClipboardSearch', color: C.blue,
        title: 'Осознанное материнство и попытка контролировать',
        text: 'Осознанное материнство и попытка контролировать всевозможные риски, финансы, беременность, жилье, понимание родительства, все нюансы воспитания.\n\nТакже и в лекарствах — мама слушает врача, но все перепроверяет еще раз, сравнивает.' },
      { n: 4, x: RX, y: TOP + RH + G, icon: 'tb:TbPigMoney', color: C.crimson,
        title: 'Семьи экономят рационально, но не хотят жертвовать качеством',
        text: 'В России растет «умное потребление». При этом родители реже остальных выбирают товар только потому, что он самый дешевый; важнее баланс цены, качества и надежности.\n\nДля детского препарата это особенно важно.' },
    ];
    const pad = 30;
    const bd = 46;
    const ID = 64;
    const htw = SW - pad * 2 - bd - 16 - ID - 16;
    // заголовки в одной строке карточек — на одной высоте, текст начинается ровно под самым высоким
    const headH = [0, 1].map((row) => Math.max(...trends.filter((t, k) => Math.floor(k / 2) === row)
      .map((t) => measure(t.title, htw, 23, true, 1.12))));
    trends.forEach((t, k) => {
      const hh = headH[Math.floor(k / 2)];
      s.card({ x: t.x, y: t.y, w: SW, h: RH });
      s.badge({ x: t.x + pad, y: t.y + pad - 2, d: bd, n: t.n, color: C.crimson, size: 24 });
      s.icon(t.icon, { x: t.x + SW - pad - ID, y: t.y + pad - 8, size: ID, circle: tintOf(t.color, 0.1), color: t.color });
      s.text(t.title, { x: t.x + pad + bd + 16, y: t.y + pad + (hh < bd ? (bd - hh) / 2 : 0), w: evenW(t.title, htw, 23, true), size: 23, bold: true, lh: 1.12, color: C.navy });
      const ty = t.y + pad + Math.max(bd, hh, ID - 8) + 16;
      s.text(t.text, { x: t.x + pad, y: ty, w: SW - pad * 2, h: t.y + RH - pad + 6 - ty, size: 20, lh: 1.22, gap: 10, color: C.blueText, fit: true, minSize: 16 });
    });

    // центр: фото и то, чего мама ищет в родительстве (иконки внизу исходника)
    s.image(path.join(B.CROPS, 'c_mom.png'), { x: CX, y: TOP, w: PW, h: PH, alt: 'Мама с малышом' });
    const BY = TOP + PH + G;
    s.card({ x: CX, y: BY, w: PW, h: CB - BY, tint: true });
    const wants = [
      ['tb:TbHeart', 'Меньше стресса'],
      ['tb:TbShieldCheck', 'Больше уверенности'],
      ['tb:TbFriends', 'Больше времени для важного'],
    ];
    const ip = 30;
    const iw = PW - ip * 2;
    const hs = wants.map(([, t]) => iconTextH({ w: iw, text: t, d: 52, gap: 18, size: 21, bold: true }));
    const g = (CB - BY - ip * 2 - sum(hs)) / (wants.length - 1);
    let y = BY + ip;
    wants.forEach(([icon, t], k) => {
      iconText(s, { x: CX + ip, y, w: iw, icon, text: t, d: 52, gap: 18, size: 21, bold: true, color: C.navy });
      y += hs[k] + g;
    });

    s.formula({ text: 'Современная мама стремится к осознанному, спокойному и уверенному родительству, где есть место и любви, и разумному подходу.' });
  },

  // =====================================================================
  // 14 · Анализ сегментов и оккейженов Боботика  (аналоги — Azelik 25–26, Clindovit 10)
  // =====================================================================
  14: (d) => {
    const s = d.slide({ title: 'Анализ сегментов и оккейженов Боботика' });
    const cols = columns(2, { gap: 24 });
    const HH = 76;
    const KY = TOP + HH + 12;
    const pad = 38;
    const D = 52;
    [['tb:TbUsersGroup', 'Сегментация'], ['tb:TbMessages', 'Коммуникация']].forEach(([icon, t], i) => {
      headBox(s, { x: cols[i].x, y: TOP, w: cols[i].w, h: HH, icon, text: t, size: 23 });
      s.card({ x: cols[i].x, y: KY, w: cols[i].w, h: BOT - KY });
    });
    const L = cols[0];
    const R = cols[1];
    const lw = L.w - pad * 2;
    const rw = R.w - pad * 2;
    const HS = 28;   // кегль заголовков блоков
    const TS = 22;   // кегль текста

    // заголовок блока с иконкой в кружке (строки выровнены, без висящего слова); возвращает высоту
    const headTW = (w, text) => evenW(text, w - D - 18, HS, true);
    const headH = (w, text) => Math.max(D, measure(text, headTW(w, text), HS, true, 1.1));
    const blockHead = (x, y, w, icon, color, text) => {
      const tw = headTW(w, text);
      const th = measure(text, tw, HS, true, 1.1);
      const h = Math.max(D, th);
      s.icon(icon, { x, y: y + (h - D) / 2, size: D, circle: color });
      s.text(text, { x: x + D + 18, y: y + (h - th) / 2, w: tw, size: HS, bold: true, lh: 1.1, color: C.navy });
      return h;
    };

    // тексты
    const l1 = { head: 'Текущий выбор подтвержден',
      text: 'Свежие отзывы демонстрируют высокую релевантность выбранных сегментов и оккейженов — они отражают реальные потребности мам и остаются актуальными.' };
    const r1 = { head: 'Коммуникационная территория остается актуальной',
      text: 'Мамы ищут надежного и понятного помощника от колик, который работает в конкретной ситуации и которому можно доверять.' };
    const lSub = 'Мы работаем с основными сегментами и ключевыми оккейженами:';
    const segs = [
      { icon: 'tb:TbBabyCarriage', color: C.blue, text: 'Мамы первенцев' },
      // «ГВ / СВ / ИВ» не рвём по строкам
      { icon: 'tb:TbBabyBottle', color: C.cyan, text: 'Все типы вскармливания: ГВ\u00a0/\u00a0СВ\u00a0/\u00a0ИВ' },
      { icon: 'tb:TbClock', color: C.crimson, text: 'Длительные колики' },
    ];
    const lEnd = 'Текущая сегментация полностью покрывает ключевые потребности аудитории. Новых значимых сегментов или оккейженов, которые можно было бы выделить отдельно и использовать в медиа, не обнаружено.';
    const r2 = 'Продолжаем транслировать ключевую идею бренда';
    const idea = 'Боботик — проверенное, удобное и рациональное решение от газиков и колик, которому мамы доверяют и которое помогает в повседневных ситуациях.';

    // геометрия по высотам: первый блок обеих колонок на одной высоте, второй — тоже; свободное место — в зазор между ними
    const sc = columns(3, { x0: L.x + pad, x1: L.x + L.w - pad, gap: 16 });
    const TSZ = 22;
    const tileTW = sc[0].w - 40;
    const tileTH = Math.max(...segs.map((g) => measure(g.text, tileTW, TSZ, true, 1.12)));
    const IS = 52;
    const TH0 = 22 + IS + 16 + tileTH + 22;
    const h1 = Math.max(headH(lw, l1.head), headH(rw, r1.head));
    const t1 = Math.max(measure(l1.text, evenW(l1.text, lw, TS), TS, false, 1.25), measure(r1.text, evenW(r1.text, rw, TS), TS, false, 1.25));
    const b1 = h1 + 16 + t1;
    const subH = measure(lSub, lw, 23, true, 1.15);
    const endH = measure(lEnd, lw, TS, false, 1.25);
    const inner = BOT - KY - pad * 2 + 8;
    const free = inner - b1 - (subH + 18 + TH0 + 24 + endH);
    const gap = Math.max(48, Math.min(76, free));
    const TH = TH0 + Math.max(0, free - gap);         // остаток места — в высоту плиток сегментов
    const y1 = KY + pad - 4;
    const y2 = y1 + b1 + gap;

    // ── первые блоки
    blockHead(L.x + pad, y1, lw, 'tb:TbCircleCheck', C.green, l1.head);
    blockHead(R.x + pad, y1, rw, 'tb:TbMessageHeart', C.blue, r1.head);
    s.text(l1.text, { x: L.x + pad, y: y1 + h1 + 16, w: evenW(l1.text, lw, TS), size: TS, lh: 1.25, color: C.blueText });
    s.text(r1.text, { x: R.x + pad, y: y1 + h1 + 16, w: evenW(r1.text, rw, TS), size: TS, lh: 1.25, color: C.blueText });
    s.hline(L.x + pad, y2 - gap / 2, lw);
    s.hline(R.x + pad, y2 - gap / 2, rw);

    // ── слева: основные сегменты и оккейжены — плитками, под ними вывод
    let y = y2;
    s.text(lSub, { x: L.x + pad, y, w: evenW(lSub, lw, 23, true), size: 23, bold: true, lh: 1.15, color: C.navy });
    y += subH + 18;
    segs.forEach((g, k) => {
      const { x, w } = sc[k];
      s.box({ x, y, w, h: TH, fill: g.color });
      s.icon(g.icon, { x: x + 20, y: y + 22, size: IS, color: C.white });
      s.text(g.text, { x: x + 20, y: y + TH - 22 - tileTH, w: tileTW, h: tileTH, size: TSZ, bold: true, lh: 1.12, color: C.white, valign: 'bottom' });
    });
    y += TH + 24;
    s.text(lEnd, { x: L.x + pad, y, w: lw, h: BOT - pad + 8 - y, size: TS, lh: 1.25, color: C.navy, fit: true, minSize: 17 });

    // ── справа: ключевая идея бренда — синим блоком до низа карточки, текст по центру блока
    const rh2 = blockHead(R.x + pad, y2, rw, 'tb:TbSpeakerphone', C.blue, r2);
    const iy = y2 + rh2 + 22;
    const IB = BOT - pad + 8;
    s.box({ x: R.x + pad, y: iy, w: rw, h: IB - iy, fill: C.blue });
    const qd = 52;
    const IS2 = 27;
    const iw = rw - 64;
    const ih = measure(idea, iw, IS2, true, 1.25);
    const gy = iy + Math.max(28, (IB - iy - qd - 14 - ih) / 2);
    s.icon('tb:TbQuote', { x: R.x + pad + 32, y: gy, size: qd, color: C.white });
    s.text(idea, { x: R.x + pad + 32, y: gy + qd + 14, w: iw, h: IB - 24 - (gy + qd + 14), size: IS2, bold: true, lh: 1.25, color: C.white, fit: true, minSize: 20 });
  },

  // =====================================================================
  // 15 · Выбор средств от колик происходит в момент проблемы  (аналоги — Azelik 28, Clindovit 10)
  // =====================================================================
  15: (d) => {
    const s = d.slide({ title: 'Выбор средств от колик в большинстве случаев происходит в момент этой проблемы' });
    const cols = columns(3, { gap: 24 });
    const HH = 76;
    const KY = TOP + HH + 12;
    const KH = BOT - KY;
    const pad = 30;
    [['tb:TbShoppingCart', 'Когда покупают'], ['tb:TbArrowsSplit2', 'Как происходит выбор'], ['tb:TbEye', 'На что обращают внимание']]
      .forEach(([icon, t], i) => {
        headBox(s, { x: cols[i].x, y: TOP, w: cols[i].w, h: HH, icon, text: t, size: 22 });
        s.card({ x: cols[i].x, y: KY, w: cols[i].w, h: KH });
      });

    // ── 1. Когда покупают: две доли — живые кольцевые графики, ≈85% — главный акцент
    {
      const { x, w } = cols[0];
      const iw = w - pad * 2;
      const DN = 136;
      const when = [
        { v: 15, color: C.blue, label: 'Во время беременности, при сборе аптечки', texts: [
          'Могут стать [[**тестовым сегментом**]] для построения знания, чтобы в дальнейшем в момент поиска не оставалось только напомнить про **Боботик**.',
          'В качестве теста при ограниченном медиабюджете размещаемся на аудиторию беременных на 3 триместре через программатики на ресурсах для мам.'] },
        { v: 85, color: C.crimson, label: 'Когда колики уже начались', texts: [
          'В большинстве явных пользовательских сценариев указывают на сиюминутную покупку или реактивный поиск: сначала проблема, затем сравнение средств и покупка.'] },
      ];
      const TS = 19;
      const lx = x + pad + DN + 26;
      const lw = x + w - pad - lx;
      const VS = 60;
      const LS = 22;
      const topH = (b) => Math.max(DN, VS * 1.05 + 6 + measure(b.label, lw, LS, true, 1.15));
      const blockH = (b) => topH(b) + 20 + sum(b.texts.map((t) => measure(t, iw, TS, false, 1.25))) + 12 * (b.texts.length - 1);
      const hs = when.map(blockH);
      const g = (KH - pad * 2 - sum(hs)) / (when.length - 1);
      let y = KY + pad;
      when.forEach((b, k) => {
        if (k) s.hline(x + pad, y - g / 2, iw);
        const th = topH(b);
        // кольцо — живой график (доля и остаток до 100%), рядом крупная цифра и подпись
        s.chart('doughnut', [{ name: 'Доля покупок', labels: ['Доля', 'Остальное'], values: [b.v, 100 - b.v] }],
          { x: x + pad - 4, y: y + (th - DN) / 2 - 4, w: DN + 8, h: DN + 8, colors: [b.color, C.tint], values: false, legend: false, hole: 62 });
        const gh = VS * 1.05 + 6 + measure(b.label, lw, LS, true, 1.15);
        const gy = y + (th - gh) / 2;
        s.text(`≈${b.v}%`, { x: lx, y: gy, w: lw, size: VS, bold: true, lh: 1.05, color: b.color });
        s.text(b.label, { x: lx, y: gy + VS * 1.05 + 6, w: lw, size: LS, bold: true, lh: 1.15, color: C.navy });
        let ty = y + th + 20;
        b.texts.forEach((t) => { ty += s.text(t, { x: x + pad, y: ty, w: iw, size: TS, lh: 1.25, color: C.blueText }) + 12; });
        y += hs[k] + g;
      });
    }

    // ── 2. Как происходит выбор: вводная + путь поиск → сообщества / отзывы → покупка
    {
      const { x, w } = cols[1];
      const iw = w - pad * 2;
      let y = KY + pad;
      y += s.text('Педиатр, советы других мам и бренд из памяти часто помогают сформировать **шорт-лист брендов** для сравнения. Финальный выбор уже строится через отзывы, наличие и удобство покупки.',
        { x: x + pad, y, w: iw, size: 19, lh: 1.25, color: C.blueText }) + 30;
      const steps = [
        { icon: 'tb:TbSearch', text: '**Поиск**' },
        { icon: 'tb:TbUsers', text: '**Сообщества в соцсетях (сравнить опыт)** или **отзывы на маркетплейсах** (убедиться в выборе)' },
        { icon: 'tb:TbShoppingCart', text: '**Покупка**' },
      ];
      const SD = 84;
      const tx = x + pad + SD + 24;
      const tw = x + w - pad - tx;
      const sh = steps.map((st) => Math.max(SD, measure(st.text, tw, 21, false, 1.2)));
      const room = KY + KH - pad - y;
      const g = Math.min(96, (room - sum(sh)) / (steps.length - 1));
      y += Math.max(0, (room - sum(sh) - g * (steps.length - 1)) / 2);
      steps.forEach((st, k) => {
        const h = sh[k];
        const cy = y + h / 2;
        if (k < steps.length - 1) {
          const nx = y + h + g + (sh[k + 1] - SD) / 2;      // верх следующего кружка
          s.seg(x + pad + SD / 2, cy + SD / 2 + 6, x + pad + SD / 2, nx - 6, { color: C.line, width: 2 });
          s.chevron({ cx: x + pad + SD / 2, cy: (cy + SD / 2 + nx) / 2, dir: 'down', w: 18, h: 26, color: C.blue });
        }
        s.icon(st.icon, { x: x + pad, y: cy - SD / 2, size: SD, circle: tintOf(C.blue, 0.12), color: C.blue });
        const th = measure(st.text, tw, 21, false, 1.2);
        s.text(st.text, { x: tx, y: cy - th / 2, w: tw, size: 21, lh: 1.2, color: C.navy });
        y += h + g;
      });
    }

    // ── 3. На что обращают внимание: четыре критерия по порядку
    {
      const { x, w } = cols[2];
      const ip = 20;
      const crit = [
        { icon: 'tb:TbHeartHandshake', text: 'В первую очередь мама смотрит, **помог ли он другим детям в похожей ситуации**' },
        { icon: 'tb:TbShieldCheck', text: 'Затем проверяют **безопасность и возраст применения**, понятность механизма действия и схему приема.' },
        { icon: 'tb:TbDroplet', text: 'Важны также удобство применения, возможность **встроить капли в кормление**, скорость заметного облегчения и наличие препарата.' },
        { icon: 'tb:TbTag', text: '**Цена влияет**, но при острой проблеме становится вторичной, если мама уже доверяет бренду и видит подтверждения его эффективности.' },
      ];
      const G = 14;
      const bx = x + ip;
      const bw = w - ip * 2;
      const BH = (KH - ip * 2 - G * (crit.length - 1)) / crit.length;
      crit.forEach((c, k) => {
        const by = KY + ip + k * (BH + G);
        s.box({ x: bx, y: by, w: bw, h: BH, fill: C.cardTint });
        const h = iconTextH({ w: bw - 44, text: c.text, d: 60, gap: 20, size: 19 });
        iconText(s, { x: bx + 22, y: by + (BH - h) / 2, w: bw - 44, icon: c.icon, text: c.text, d: 60, gap: 20, size: 19, color: C.navy });
      });
    }
  },
};
