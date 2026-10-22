// Азелик · стратегия 2027 — часть D: слайды исходника 23–30
// 23 — эволюция стратегии: 2026 фундамент → 2027 рост и лидерство («было → стало»);
// 24 — три задачи 2027 (Expand / Win / Grow) → механики, цвета этапов как у меток EXPAND / SPRINT / FREQUENCY;
// 25 — сегментация 2027: сохраняем ядро, усиливаем регулярное применение, расширяем охват;
// 26 — структура аудитории 2027: три сегмента с фото (вырезки d_seg1..3 из картинок исходника);
// 27 — размеры аудиторий (своя таблица, ёмкость крупно);
// 28, 29 — новые сегменты: женщины 40+ и акне + чувствительная кожа (общая раскладка, фото d_women40 / d_sensitive);
// 30 — событийная актуальность: три occasion строками.
const path = require('path');
const { C, ACCENTS, columns, countLines, textWidth, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT, MUTED, GRID, fmt, pct, statTile, numMark, legend, yearAxis, gridY
const A = require('./common');                            // SRC, MEDIA, CROPS, STAGE, stageTag, video

const TOP = V.TOP;   // 221 — верх контента
const BOT = V.BOT;   // 1005 — низ контента без плашки
const X0 = 58;
const X1 = 1862;

// Высота текста так же, как её оценивает s.text — по переведённой строке, чтобы EN-сборка пересчитывала геометрию
const plainTr = (text) => typo(tr(String(text))).replace(/\*\*|\[\[|\]\]/g, '');
const measure = (text, w, size = 18, bold = false, lh = 1.2) =>
  Math.round(countLines(plainTr(text), size, w, bold) * size * lh);

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

// Смешение цвета с белым: k = 0 — белый, 1 — исходный цвет
function tintOf(hex, k) {
  const c = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return c.map((v) => Math.round(255 + (v - 255) * k).toString(16).padStart(2, '0')).join('').toUpperCase();
}

// Иконка в цветном кружке + жирный заголовок + пояснение справа; возвращает высоту строки
function iconRow(s, { x, y, w, icon, color, title, text, d = 48, gap = 18, tSize = 20, bSize = 18, titleColor = C.navy }) {
  s.icon(icon, { x, y, size: d, circle: color });
  const tx = x + d + gap;
  const tw = w - d - gap;
  let h = 0;
  if (title) h += s.text(title, { x: tx, y, w: tw, size: tSize, bold: true, lh: 1.15, color: titleColor });
  if (text) h += (title ? 4 : 0) + s.text(text, { x: tx, y: y + h + (title ? 4 : 0), w: tw, size: bSize, lh: 1.2, color: C.blueText });
  return Math.max(d, h);
}
function iconRowH({ w, title, text, d = 48, gap = 18, tSize = 20, bSize = 18 }) {
  const tw = w - d - gap;
  let h = 0;
  if (title) h += measure(title, tw, tSize, true, 1.15);
  if (text) h += (title ? 4 : 0) + measure(text, tw, bSize);
  return Math.max(d, h);
}

// Пункт «заголовок + пояснение» с цветной чертой слева (как на Acriol 6); возвращает высоту
const BAR = 22;   // отступ текста от черты
function barItem(s, { x, y, w, color, title, text, tSize = 22, bSize = 19 }) {
  const h1 = s.text(title, { x: x + BAR, y, w: w - BAR, size: tSize, bold: true, lh: 1.15, color: C.navy });
  const h2 = s.text(text, { x: x + BAR, y: y + h1 + 4, w: evenW(text, w - BAR, bSize), size: bSize, lh: 1.2, color: C.blueText });
  s.box({ x, y: y + 2, w: 6, h: h1 + 4 + h2 - 2, fill: color, r: 3 });
  return h1 + 4 + h2;
}
const barItemH = ({ w, title, text, tSize = 22, bSize = 19 }) =>
  measure(title, w - BAR, tSize, true, 1.15) + 4 + measure(text, w - BAR, bSize);

// Карточка со списком пунктов barItem: метка сверху, пункты распределены по высоте
function barCard(s, { x, y, w, h, label, color, items, tint }) {
  const pad = 30;
  s.card({ x, y, w, h, fill: tint });
  let cy = y + pad - 4;
  if (label) cy += s.label(label, { x: x + pad, y: cy, w: w - pad * 2, size: 20, color }) + 20;
  const iw = w - pad * 2;
  const hs = items.map(([t, b]) => barItemH({ w: iw, title: t, text: b }));
  const free = y + h - pad + 4 - cy - hs.reduce((a, b) => a + b, 0);
  const g = Math.max(12, Math.min(40, free / Math.max(1, items.length - 1)));
  items.forEach(([t, b], k) => {
    barItem(s, { x: x + pad, y: cy, w: iw, color, title: t, text: b });
    cy += hs[k] + g;
  });
}

// ---------------- 28 / 29: новый сегмент — общая раскладка ----------------
// Слева сверху — вводная, объём аудитории и сообщения; справа — фото; снизу — инсайты и потребности.
function segmentSlide(d, c) {
  const s = d.slide({ title: c.title });
  const P = 430;                                   // фото — квадрат справа сверху
  const px = X1 - P;
  s.image(path.join(A.CROPS, c.photo), { x: px, y: TOP, w: P, h: P, alt: c.alt });
  const LX = X0;
  const LW = px - 24 - LX;
  // вводная: первая фраза — крупно, вторая — пояснение
  let y = TOP - 4;
  y += s.text(c.lead1, { x: LX, y, w: LW, size: 30, bold: true, lh: 1.15, color: C.navy, fit: true, maxLines: 2, minSize: 24 }) + 10;
  y += s.text(c.lead2, { x: LX, y, w: LW, size: 22, lh: 1.2, color: C.blueText }) + 24;
  const rTop = y;
  const rBot = TOP + P;

  // объём аудитории
  const SW = 452;
  const pad = 28;
  s.card({ x: LX, y: rTop, w: SW, h: rBot - rTop });
  let sy = rTop + pad - 4;
  sy += s.label('Объём аудитории', { x: LX + pad, y: sy, w: SW - pad * 2, size: 20, color: c.color }) + 16;
  const vs = 54;
  const capW = SW - pad * 2;
  const statH = c.stats.map(([, cap]) => Math.round(vs * 1.05) + 2 + measure(cap, capW, 19));
  const sFree = rBot - pad + 4 - sy - statH.reduce((a, b) => a + b, 0);
  const sg = Math.max(10, Math.min(44, sFree));
  c.stats.forEach(([val, cap, main], k) => {
    s.text(val, { x: LX + pad, y: sy, w: capW, size: vs, bold: true, lh: 1.05, color: main ? c.color : C.navy, fit: true, maxLines: 1, minSize: 36 });
    s.text(cap, { x: LX + pad, y: sy + Math.round(vs * 1.05) + 2, w: evenW(cap, capW, 19), size: 19, lh: 1.2, color: C.blueText });
    if (k === 0) s.hline(LX + pad, sy + statH[k] + sg / 2, capW);
    sy += statH[k] + sg;
  });

  // сообщения бренда: (заголовок) + три пункта с иконками
  const MX = LX + SW + 23;
  const MW = px - 24 - MX;
  s.card({ x: MX, y: rTop, w: MW, h: rBot - rTop, fill: tintOf(c.color, 0.07), stroke: tintOf(c.color, 0.2) });
  const mw = MW - pad * 2;
  let my = rTop + pad - 2;
  if (c.msgTitle) my += s.text(c.msgTitle, { x: MX + pad, y: my, w: mw, size: 24, bold: true, lh: 1.15, color: c.color }) + 16;
  const row = { d: 52, gap: 18, tSize: 22, bSize: 19 };
  const mh = c.msgs.map(([, t, b]) => iconRowH({ ...row, w: mw, title: t, text: b }));
  const mFree = rBot - pad + 4 - my - mh.reduce((a, b) => a + b, 0);
  const mg = Math.max(8, Math.min(40, mFree / (c.msgs.length - 1)));
  c.msgs.forEach(([icon, t, b], k) => {
    iconRow(s, { ...row, x: MX + pad, y: my, w: mw, icon, color: c.color, title: t, text: b });
    my += mh[k] + mg;
  });

  // инсайты и потребности
  const by = rBot + 22;
  const cols = columns(2, { gap: 23 });
  barCard(s, { ...cols[0], y: by, h: BOT - by, label: 'Ключевые инсайты', color: c.color, items: c.insights });
  barCard(s, { ...cols[1], y: by, h: BOT - by, label: c.needsLabel, color: C.blue, items: c.needs });
}

module.exports = {
  // =====================================================================
  // 23 · Эволюция стратегии: 2026 → 2027
  // =====================================================================
  23: (d) => {
    const s = d.slide({ title: 'Эволюция стратегии Азелик: от защиты к агрессивной экспансии' });
    const CW = 812;
    const sides = [
      { x: X0, year: '2026', name: 'Фундамент', color: C.blue, tint: false,
        lead: 'Мы остановили потерю доли и доказали эффективность сегментного подхода',
        items: [['tb:TbShieldCheck', 'Фокус на защите лидерства'],
          ['tb:TbUserCheck', 'Подтверждена эффективность персонализированной коммуникации']],
        result: 'Переход от защиты к экспансии', rIcon: 'tb:TbArrowBigRightLines' },
      { x: X1 - CW, year: '2027', name: 'Рост и лидерство', color: C.crimson, tint: true,
        lead: 'Перехватываем больше пользователей у Скиноклира и расширяем категорию Азелика',
        items: [['tb:TbSwords', 'Более агрессивное конкурентное наступление'],
          ['tb:TbArrowsMaximize', 'Экспансия в новые сегменты и сценарии']],
        result: 'Масштабирование AI-сегментов и персонализации', rIcon: 'tb:TbSparkles' },
    ];
    const pad = 48;
    const cw = CW - pad * 2;
    const YS = 96;                                    // год — крупно
    const leadSize = 32;
    const leadH = Math.max(...sides.map((c) => measure(c.lead, cw, leadSize, true, 1.15)));
    const ID = 60;
    const IS = 26;
    const itemH = sides[0].items.map((_, k) => Math.max(ID, ...sides.map((c) => measure(c.items[k][1], cw - ID - 24, IS, false, 1.2))));
    const IG = 30;
    const itemsH = itemH.reduce((a, b) => a + b, 0) + IG * (itemH.length - 1);
    const resH = Math.max(...sides.map((c) => measure(c.result, cw - 64 - 40 - 48, 28, true, 1.15))) + 56;
    sides.forEach((c) => {
      s.card({ x: c.x, y: TOP, w: CW, h: BOT - TOP, tint: c.tint });
      const cx = c.x + pad;
      let y = TOP + 34;
      const yw = Math.ceil(textWidth(plainTr(c.year), YS, true)) + 8;
      s.text(c.year, { x: cx, y, w: yw, size: YS, bold: true, lh: 1.0, color: c.color });
      s.text(c.name, { x: cx + yw + 22, y: y + YS - 50, w: cw - yw - 22, size: 40, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 30 });
      y += YS + 30;
      s.hline(cx, y, cw);
      y += 34;
      s.text(c.lead, { x: cx, y, w: evenW(c.lead, cw, leadSize, true), size: leadSize, bold: true, lh: 1.15, color: C.navy });
      y += leadH;
      // итог колонки — заливной блок внизу карточки; пункты — посередине между вводной и итогом
      const ry = BOT - pad + 8 - resH;
      y += Math.round((ry - y - itemsH) / 2);
      c.items.forEach(([icon, t], k) => {
        s.icon(icon, { x: cx, y: y + (itemH[k] - ID) / 2, size: ID, circle: c.color });
        s.text(t, { x: cx + ID + 24, y, w: cw - ID - 24, h: itemH[k], size: IS, lh: 1.2, color: C.navy, valign: 'middle' });
        y += itemH[k] + IG;
      });
      s.box({ x: cx, y: ry, w: cw, h: resH, fill: c.color });
      s.icon(c.rIcon, { x: cx + 28, y: ry + (resH - 64) / 2, size: 64, color: C.white });
      s.text(c.result, { x: cx + 28 + 64 + 28, y: ry, w: cw - 28 - 64 - 28 - 24, h: resH, size: 28, bold: true, lh: 1.15, color: C.white, valign: 'middle' });
    });
    // стрелка «было → стало»
    const gx = X0 + CW;
    const gw = X1 - CW - gx;
    s.arrow({ dir: 'right', x: gx + 22, y: Math.round((TOP + BOT) / 2), len: gw - 44, head: 64, headLen: 32, stem: 22 });
  },

  // =====================================================================
  // 24 · Три задачи 2027 → механики
  // =====================================================================
  24: (d) => {
    // заголовок исходника — одно предложение в 3 строки; в шапку не влезает, делим на заголовок и подзаголовок
    const s = d.slide({
      title: 'В 2027 году важно не просто удержать бренд, а обеспечить рост выше рынка',
      subtitle: 'и продолжить защищать лидерство Азелика от Скиноклира',
    });
    // цвета — этапов кампании (метки EXPAND / SPRINT / FREQUENCY на слайдах механик)
    const rows = [
      { color: A.STAGE.EXPAND, icon: 'tb:TbArrowsMaximize', head: 'Expand the category',
        text: 'Привлечь новые аудитории из косметики и новых пользователей акне', mech: 'RECRUITMENT (AON)', mIcon: 'tb:TbUsersPlus' },
      { color: A.STAGE.SPRINT, icon: 'tb:TbTrophy', head: 'Win the competition',
        text: 'Забрать пользователей у Скиноклира и усилить защиту лидерства', mech: 'SPRINT 1, 2', mIcon: 'tb:TbBolt' },
      { color: A.STAGE.FREQUENCY, icon: 'tb:TbRepeat', head: 'Grow frequency',
        text: 'Увеличить частоту использования через дообучение, блогеров и специнтеграции', mech: 'FREQUENCY MECHANICS', mIcon: 'tb:TbRefresh' },
    ];
    const gap = 22;
    const RH = Math.floor((BOT - TOP - gap * 2) / 3);
    const HX = X0 + 36;            // номер + заголовок
    const BD = 72;
    const HW = 470;
    const SEP = HX + BD + 26 + HW + 16;
    const DX = SEP + 40;           // описание
    const TX = 1418;               // плитка механики
    const TW = X1 - 30 - TX;
    const DW = TX - 90 - DX;
    rows.forEach((r, i) => {
      const y = TOP + i * (RH + gap);
      s.card({ x: X0, y, w: X1 - X0, h: RH });
      s.badge({ x: HX, y: y + (RH - BD) / 2, d: BD, n: i + 1, color: r.color, size: 36 });
      s.text(r.head, { x: HX + BD + 26, y: y + 20, w: HW, h: RH - 40, size: 44, bold: true, lh: 1.05, color: C.navy, valign: 'middle', fit: true, maxLines: 2, minSize: 34 });
      s.vline(SEP, y + 34, RH - 68);
      s.text(r.text, { x: DX, y: y + 20, w: DW, h: RH - 40, size: 28, lh: 1.25, color: C.blueText, valign: 'middle', fit: true, minSize: 22 });
      s.arrow({ dir: 'right', x: TX - 72, y: y + RH / 2, len: 48, head: 34, headLen: 18, stem: 8, color: r.color });
      s.tile({ x: TX, y: y + 24, w: TW, h: RH - 48, color: r.color, icon: r.mIcon, iconSize: 52, text: r.mech, size: 28, textH: 70 });
    });
  },

  // =====================================================================
  // 25 · Сегментация 2027: ядро → регулярное применение → новые аудитории
  // =====================================================================
  25: (d) => {
    const s = d.slide({ title: 'В 2027 году сохраняем проверенную сегментацию и расширяем её новыми аудиториями и сценариями' });
    const cols = columns(3, { gap: 24 });
    const TILE = 236;
    const items = [
      { icon: 'tb:TbShieldCheck', t: 'Сегментация подтверждается — сохраняем ядро',
        d: 'Анализ 2026 подтверждает актуальность выбранных сегментов. В 2027 **сохраняем основную архитектуру** и продолжаем развивать её через поведенческие и потребностные признаки.' },
      { icon: 'tb:TbRepeat', t: 'Усиливаем сценарий регулярного применения',
        d: '**Долгосрочный контроль акне** становится отдельным фокусом коммуникации. Через дообучение и повторные контакты **формируем привычку регулярного применения**, особенно у аудиторий с длительной историей проблемы.' },
      { icon: 'tb:TbUsersPlus', t: 'Расширяем охват новыми аудиториями и occasions',
        d: 'Добавляем **женщин 40+ с акне, акне\u00a0+\u00a0чувствительная кожа** и тестируем новые ситуативные сценарии — **Back\u00a0to\u00a0School, выпускные, начало учебного года** и другие периоды повышенного внимания к внешности.' },
    ];
    // общий кегль описаний — по самой длинной колонке
    const cw0 = cols[0].w - 78;
    const ty0 = TOP + 84 + 45 + TILE + 34;
    let ds = 30;
    while (ds > 20 && Math.max(...items.map((g) => measure(g.d, cw0, ds, false, 1.3))) > BOT - 36 - ty0) ds -= 1;
    items.forEach((g, i) => {
      const c = cols[i];
      const col = ACCENTS[i];
      const { cx, cy, cw } = s.numberedCard({ x: c.x, y: TOP, w: c.w, h: BOT - TOP, n: i + 1, color: col });
      s.tile({ x: cx, y: cy, w: cw, h: TILE, color: col, icon: g.icon, iconSize: 60, text: g.t, size: 30, textH: 104 });
      const ty = cy + TILE + 34;
      s.text(g.d, { x: cx, y: ty, w: cw, h: BOT - 36 - ty, size: ds, lh: 1.3, color: C.blueText, accent: col, fit: true, minSize: 20 });
    });
  },

  // =====================================================================
  // 26 · Структура аудитории 2027: три сегмента
  // =====================================================================
  26: (d) => {
    const s = d.slide({ title: 'Структура аудитории в 2027' });
    const cols = columns(3, { gap: 23 });
    // цвета сегментов — те же на слайдах 28 (40+) и 29 (акне + чувствительная кожа)
    const segs = [
      { color: C.blue, photo: 'd_seg1.png', name: '18–40 — основная аудитория Азелика' },
      { color: C.purple, photo: 'd_seg2.png', name: '40+: новый тестовый сценарий — акне в контексте зрелого ухода' },
      { color: C.crimson, photo: 'd_seg3.png', name: 'Акне\u00a0+ чувствительная кожа' },
    ];
    const HH = 246;                     // шапка сегмента: название + фото
    const pad = 20;
    const PH = HH - pad * 2;            // фото 1,1 : 1 (вырезки 191×174, 209×190, 232×211)
    const PW = Math.round(PH * 1.1);
    const BY = TOP + HH + 16;           // карточка с описанием
    const CB = 905;
    const ip = 30;
    segs.forEach((g, i) => {
      const { x, w } = cols[i];
      s.box({ x, y: TOP, w, h: HH, fill: g.color, r: 25 });
      s.image(path.join(A.CROPS, g.photo), { x: x + w - pad - PW, y: TOP + pad, w: PW, h: PH, alt: g.name });
      s.text(g.name, { x: x + 28, y: TOP + 26, w: w - 28 - PW - pad - 22, h: HH - 52, size: 30, bold: true, lh: 1.12, color: C.white, fit: true, minSize: 22 });
      s.card({ x, y: BY, w, h: CB - BY });
    });

    // 1 · основная аудитория: две возрастные группы — каждая в своей половине карточки
    {
      const { x, w } = cols[0];
      const ages = [
        ['18–34', 'Social girl, «новые средства», мужчины с проблемной кожей, переключение со Скиноклира'],
        ['18–40', 'акне / постакне, косметический и медицинский уход, регулярный контроль'],
      ];
      const AW = 172;
      const tw = w - ip * 2 - AW;
      const half = (CB - BY) / 2;
      ages.forEach(([age, t], k) => {
        const th = measure(t, tw, 23, false, 1.25);
        const y = Math.round(BY + k * half + (half - th) / 2);
        s.text(age, { x: x + ip, y: y - 6, w: AW - 12, size: 42, bold: true, lh: 1.0, color: C.blue, fit: true, maxLines: 1, minSize: 34 });
        s.text(t, { x: x + ip + AW, y, w: tw, size: 23, lh: 1.25, color: C.navy });
      });
      s.hline(x + ip, BY + half, w - ip * 2);
    }
    // 2 · 40+
    {
      const { x, w } = cols[1];
      const tw = w - ip * 2;
      let y = BY + ip;
      y += s.text('Женщины 40–55 — крупная потенциальная аудитория', { x: x + ip, y, w: tw, size: 28, bold: true, lh: 1.15, color: C.purple }) + 20;
      s.text('Для неё актуально сочетание акне и привычного ухода за зрелой кожей, поэтому коммуникацию можно строить вокруг решения проблемы без отказа от уже сформированного ухода.',
        { x: x + ip, y, w: tw, h: CB - ip - y, size: 23, lh: 1.3, color: C.navy, fit: true, minSize: 18 });
    }
    // 3 · акне + чувствительная кожа
    {
      const { x, w } = cols[2];
      const tw = w - ip * 2;
      const ins = '[[**Инсайт:**]] **«Хочу решить проблему, но не хочу ухудшить состояние кожи»**';
      const qd = 44;
      const insW = tw - 36 - qd - 16 + 8;
      const insH = measure(ins, insW, 21, true, 1.2) + 36;
      const iy = CB - ip + 8 - insH;
      let y = BY + ip;
      y += s.text('18–40 М/Ж с акне, для которых чувствительность, сухость или раздражение кожи — отдельный барьер выбора.', { x: x + ip, y, w: tw, size: 22, lh: 1.25, color: C.navy }) + 18;
      s.text('Уже ищут уход для чувствительной / проблемной кожи и хотят сочетать решение проблемы с комфортным уходом.', { x: x + ip, y, w: tw, h: iy - 12 - y, size: 22, lh: 1.25, color: C.navy, fit: true, minSize: 18 });
      s.box({ x: x + ip - 8, y: iy, w: tw + 16, h: insH, fill: tintOf(C.crimson, 0.08) });
      s.icon('tb:TbQuote', { x: x + ip + 10, y: iy + (insH - qd) / 2, size: qd, circle: C.crimson });
      s.text(ins, { x: x + ip + 10 + qd + 16, y: iy, w: insW, h: insH, size: 21, lh: 1.2, color: C.navy, valign: 'middle' });
    }

    s.formula({ text: 'Сохраняем доказанные сегменты → усиливаем наиболее эффективные → добавляем 40+, «чувствительную кожу» и ситуативные сценарии*' });
    s.footnote('* Back to School, особые случаи и др.');
  },

  // =====================================================================
  // 27 · Размеры аудиторий
  // =====================================================================
  27: (d) => {
    const s = d.slide({ title: 'Размеры аудиторий' });
    const tbl = require(path.join(A.SRC, 'slide-27.json')).shapes.find((sh) => sh.t === 'TABLE').table;
    const rows = tbl.slice(1).map((r) => r.map((c) => c.replace(/\u000b/g, ' ').replace(/\s+/g, ' ').trim()));
    // длинное название сегмента — перенос по смыслу, а не по ширине
    rows.forEach((r) => { r[0] = r[0].replace(' / Social girl', ' /\nSocial girl'); });
    const HOT = '18–34 с акне';   // «Главный growth-сегмент» — единственный акцент таблицы
    const COL = [
      { x: X0, w: 560 },
      { x: X0 + 560, w: 330 },
      { x: X0 + 890, w: X1 - X0 - 890 },
    ];
    const HH = 56;
    s.box({ x: X0, y: TOP, w: X1 - X0, h: HH, fill: C.navy, r: 12 });
    ['Аудитория', 'Оценка ёмкости', 'Роль в стратегии 2027'].forEach((t, i) => {
      s.text(t.toUpperCase(), { x: COL[i].x + 28, y: TOP, w: COL[i].w - 56, h: HH, size: 20, bold: true, lh: 1.0, color: C.white,
        valign: 'middle', align: i === 1 ? 'center' : 'left', fit: true, maxLines: 1, minSize: 16 });
    });
    const y0 = TOP + HH + 8;
    const RH = (BOT - y0) / rows.length;
    rows.forEach(([aud, size, role], i) => {
      const y = Math.round(y0 + i * RH);
      const h = Math.round(y0 + (i + 1) * RH) - y;
      const hot = aud === HOT;
      if (hot) s.box({ x: X0, y, w: X1 - X0, h, fill: tintOf(C.crimson, 0.09), r: 0 });
      else if (i > 0 && rows[i - 1][0] !== HOT) s.hline(X0, y, X1 - X0);
      s.text(aud, { x: COL[0].x + 28, y, w: COL[0].w - 48, h, size: 22, bold: true, lh: 1.15, color: C.navy, valign: 'middle', fit: true, maxLines: 2, minSize: 18 });
      s.text(size, { x: COL[1].x + 12, y, w: COL[1].w - 24, h, size: 32, bold: true, lh: 1.0, color: hot ? C.crimson : C.blue, align: 'center', valign: 'middle', fit: true, maxLines: 1, minSize: 24 });
      s.text(role, { x: COL[2].x + 28, y, w: evenW(role, COL[2].w - 56, 21), h, size: 21, lh: 1.2, color: hot ? C.navy : C.blueText, bold: hot, valign: 'middle', fit: true, maxLines: 2, minSize: 17 });
    });
    s.hline(X0, BOT, X1 - X0);
  },

  // =====================================================================
  // 28 · Женщины 40+
  // =====================================================================
  28: (d) => segmentSlide(d, {
    title: 'Женщины 40+ — значимый потенциал для расширения аудитории Азелика',
    color: C.purple, photo: 'd_women40.png', alt: 'Женщины 40+',
    lead1: 'Акне во взрослом возрасте остаётся частой и чувствительной проблемой',
    lead2: 'Женщины 40–55 ищут эффективные, но при этом мягкие решения, которые можно сочетать с привычным уходом за зрелой кожей',
    stats: [
      ['~17,5 млн', 'женщин 40–55 в России (≈16% женского населения)'],
      ['~4 млн', 'потенциальная аудитория женщин 40–55 с акне (≈23% от всех женщин 40–55)', true],
    ],
    msgs: [
      ['tb:TbPuzzle', 'Решение проблемы без отказа от привычного ухода', 'Азелик помогает справляться с акне и легко вписывается в текущий уход за кожей.'],
      ['tb:TbHeart', 'Забота о коже в любом возрасте', 'Чистая и здоровая кожа — не только про молодость, но и про уверенность сегодня.'],
      ['tb:TbStethoscope', 'Экспертность и доверие', 'Поддержка врачей-дерматологов и понятные рекомендации по применению.'],
    ],
    insights: [
      ['Акне во взрослом возрасте — реальная и частая проблема', 'Каждая 4-я женщина 40–49 и каждая 6-я 50+ сталкивается с акне.'],
      ['Влияет на качество жизни и уверенность', 'Высыпания ассоциируются не только с внешним видом, но и с гормональными изменениями, стрессом, образом жизни.'],
      ['Нужны решения, совместимые с уходом за зрелой кожей', 'Важно эффективное, но мягкое средство, которое не конфликтует с антивозрастным уходом.'],
    ],
    needsLabel: 'Потребности и мотивация',
    needs: [
      ['Чистая кожа без раздражения', 'Эффективное решение для высыпаний, которое не пересушивает кожу.'],
      ['Совместимость с антивозрастным уходом', 'Возможность использовать средство в рамках привычного ухода за зрелой кожей.'],
      ['Уверенность в себе', 'Снижение видимости высыпаний и постакне, комфорт в повседневной жизни.'],
    ],
  }),

  // =====================================================================
  // 29 · Акне + чувствительная кожа
  // =====================================================================
  29: (d) => segmentSlide(d, {
    title: 'Акне + чувствительная кожа — новый сегмент для расширения аудитории Азелика',
    color: C.crimson, photo: 'd_sensitive.png', alt: 'Акне и чувствительная кожа',
    lead1: 'При акне чувствительность кожи — частая сопутствующая проблема',
    lead2: 'Аудитория ищет эффективное решение, но опасается сухости и раздражения и хочет сохранить привычный уход за кожей',
    stats: [
      ['~7 млн', 'людей 18–35 с акне / постакне'],
      ['до ~3 млн', 'потенциальная аудитория с акне и чувствительной кожей', true],
    ],
    msgTitle: 'Решение проблемы без отказа от комфортного ухода',
    msgs: [
      ['tb:TbAlertCircle', 'Проблемная кожа требует решения', 'Чувствительность повышает требования к комфортности ухода.'],
      ['tb:TbMessageCircle', 'Акцент коммуникации', 'Эффективное решение + привычный уход за кожей.'],
      ['tb:TbShieldCheck', 'Понятная коммуникация снижает страх', 'Мягкая подача помогает решиться на использование.'],
    ],
    insights: [
      ['Акне + чувствительность — двойная потребность', 'Человек хочет работать с высыпаниями, но сохранить комфорт кожи.'],
      ['Страх сухости и раздражения', 'Переносимость и комфорт становятся отдельным критерием выбора.'],
      ['Привычный уход нельзя ломать', 'Нужно решение, которое можно встроить в уже сформированный уход.'],
    ],
    // в исходнике у этого блока нет заголовка — подпись по аналогии со слайдом 28
    needsLabel: 'Потребности и мотивация',
    needs: [
      ['Чистая кожа без раздражения', 'Эффективное решение для высыпаний без ощущения ухудшения состояния кожи.'],
      ['Совместимость с привычным уходом', 'Возможность сохранить привычные этапы ухода за чувствительной кожей.'],
      ['Комфорт и уверенность', 'Снижение страха перед раздражением и возвращение уверенности в повседневной жизни.'],
    ],
  }),

  // =====================================================================
  // 30 · Событийная актуальность: occasions
  // =====================================================================
  30: (d) => {
    const s = d.slide({ title: 'Для усиления коммуникации рекомендуется добавить событийную актуальность' });
    const occ = [
      { color: C.blue, icon: 'tb:TbSchool', name: 'Back to School / начало учебного года', when: 'август–сентябрь',
        need: 'Возвращение в школу / университет, желание выглядеть уверенно после каникул, усиление внимания к внешности',
        quote: '«Подготовь кожу к новому учебному году»', focus: '**Фокус:** уверенность, чистая кожа, регулярный уход',
        segs: ['Подростки 12–18', 'Ж 18–34 — Social girl', 'Ж 18–34 — «новые средства»'] },
      { color: C.crimson, icon: 'tb:TbConfetti', name: 'Подготовка к важным событиям', when: 'май–июль',
        need: 'Потребность быстро улучшить внешний вид перед важным событием',
        quote: '«Хочу выглядеть уверенно в важный день»', focus: '**Фокус:** решение проблемы акне без экспериментов',
        segs: ['Ж 18–34 — Social girl', 'Ж 18–40 — акне / постакне, косметический и медицинский уход', 'М 18–34 — проблемная кожа'] },
      { color: C.green, icon: 'tb:TbBolt', name: 'После стресса / изменений образа жизни',
        need: 'Стресс, изменение режима, гормональные факторы могут провоцировать ухудшение состояния кожи',
        quote: '«Когда кожа меняется — нужен понятный уход и контроль»', focus: '**Фокус:** сохранить привычный уход и вернуть контроль над состоянием кожи',
        segs: ['Женщины 40–55 — новый тестовый сценарий', 'Акне + чувствительная кожа, 18–34 М/Ж'] },
    ];
    const OC = { x: X0 + 14, w: 420 };
    const NE = { x: OC.x + OC.w + 30, w: 360 };
    const CO = { x: NE.x + NE.w + 36, w: 470 };
    const SG = { x: CO.x + CO.w + 36, w: X1 - 26 - (CO.x + CO.w + 36) };
    const HY = TOP;
    [['Occasion', OC], ['Потребность / триггер', NE], ['Коммуникация', CO], ['Подходящие сегменты', SG]].forEach(([t, c], i) => {
      s.label(t, { x: c.x + (i === 0 ? 4 : 0), y: HY, w: c.w, size: 20, color: C.navy });
    });
    const y0 = HY + 40;
    const gap = 16;
    const RH = Math.floor((BOT - y0 - gap * 2) / 3);
    occ.forEach((o, i) => {
      const y = y0 + i * (RH + gap);
      s.card({ x: X0, y, w: X1 - X0, h: RH });
      // occasion: цветная плитка с иконкой, названием и периодом
      const ty = y + 14;
      const th = RH - 28;
      s.box({ x: OC.x, y: ty, w: OC.w, h: th, fill: o.color });
      s.icon(o.icon, { x: OC.x + 22, y: ty + 22, size: 52, color: C.white });
      const nw = OC.w - 44;
      const nh = measure(o.name, nw, 26, true, 1.12);
      const whenH = o.when ? 34 : 0;
      const ny = ty + th - 22 - whenH - (o.when ? 10 : 0) - nh;
      s.text(o.name, { x: OC.x + 22, y: ny, w: nw, size: 26, bold: true, lh: 1.12, color: C.white });
      if (o.when) {
        s.icon('tb:TbCalendarEvent', { x: OC.x + 22, y: ty + th - 22 - whenH + 4, size: 26, color: C.white });
        s.text(o.when, { x: OC.x + 22 + 34, y: ty + th - 22 - whenH + 2, w: nw - 34, size: 21, lh: 1.2, color: C.white });
      }
      // потребность / триггер
      s.text(o.need, { x: NE.x, y: y + 14, w: evenW(o.need, NE.w, 20), h: RH - 28, size: 20, lh: 1.25, color: C.navy, valign: 'middle', fit: true, minSize: 17 });
      s.vline(CO.x - 18, y + 26, RH - 52);
      // коммуникация: цитата + фокус
      const qw = evenW(o.quote, CO.w, 23, true);
      const qh = measure(o.quote, qw, 23, true, 1.15);
      const fh = measure(o.focus, CO.w, 19, false, 1.2);
      const cy = y + Math.round((RH - qh - 10 - fh) / 2);
      s.text(o.quote, { x: CO.x, y: cy, w: qw, size: 23, bold: true, lh: 1.15, color: o.color });
      s.text(o.focus, { x: CO.x, y: cy + qh + 10, w: CO.w, size: 19, lh: 1.2, color: C.blueText });
      s.vline(SG.x - 18, y + 26, RH - 52);
      // сегменты
      const sh = o.segs.map((t) => measure(t, SG.w - 24, 19, false, 1.2));
      const total = sh.reduce((a, b) => a + b, 0) + 10 * (o.segs.length - 1);
      let sy = y + Math.round((RH - total) / 2);
      o.segs.forEach((t, k) => {
        s.circle({ x: SG.x, y: sy + 7, d: 10, fill: o.color });
        s.text(t, { x: SG.x + 24, y: sy, w: SG.w - 24, size: 19, lh: 1.2, color: C.navy });
        sy += sh[k] + 10;
      });
    });
  },
};
