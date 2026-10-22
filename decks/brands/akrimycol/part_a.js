// Акримиколь · стратегия 2027 — часть A: слайды исходника 1–5
// (обложка, цели и задачи 2027, «Digital должен компенсировать…», Offline Competitive Landscape, ТВ-кейс Ламизила)
// Подача — как у одобренных Dinobutin 1–3 (decks/brands/dinobutin/part_a.js) и Azelik 12 (decks/brands/azelik/part_b.js).
const path = require('path');
const { C, ACCENTS, PT, chartMap, textWidth, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT, MUTED, yearAxis
const K = require('./common');                            // SRC, MEDIA, CROPS, fromSource, video
const SRC = K.SRC;

const TOP = V.TOP;          // 221 — верх контента
const BOT = V.BOT;          // 1005 — низ контента без плашки
const PB = 905;             // низ контента над плашкой-выводом
const LW = 1330;            // левая карточка с графиками: 58…1388
const RX = 58 + LW + 20;    // правая колонка: 1408…1862
const RW = 1862 - RX;
const NAME_X = 94;          // подписи рядов внутри левой карточки

// ---------- помощники ----------
const charts = (n) => require(path.join(SRC, `slide-${String(n).padStart(2, '0')}.json`))
  .shapes.filter((sh) => sh.t === 'CHART').map((sh) => sh.chart);
const f0 = (v) => String(Math.round(v));
const f1 = (v) => v.toFixed(1).replace('.', ',');
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
// Excel-дата (45658) → { m: 0…11, y: 2025 }
const xl = (n) => { const dt = new Date(Date.UTC(1899, 11, 30) + Number(n) * 86400000); return { m: dt.getUTCMonth(), y: dt.getUTCFullYear() }; };
// ширина строки по переведённому тексту
const tw = (t, size, bold) => textWidth(typo(tr(t)).replace(/\*\*|\[\[|\]\]/g, ''), size, bold);
// ширина КАПС-метки (s.label) по переведённому тексту
const lw = (t, size = 22) => Math.ceil(textWidth(typo(tr(t)).toUpperCase(), size, true)) + 6;
const hex = (n) => Math.round(n).toString(16).padStart(2, '0');
const mix = (a, b, t) => [0, 2, 4].map((k) => hex(parseInt(a.substr(k, 2), 16) * (1 - t) + parseInt(b.substr(k, 2), 16) * t)).join('').toUpperCase();
const BAND = mix('FFFFFF', C.crimson, 0.07);   // подсветка периодов кампании
const pick = (series, key) => series.find((sr) => sr.name.trim().toLowerCase() === key).values;

// Число строк с учётом жирных фрагментов (**…**) и переносов по дефису
function textLines(text, size, width) {
  const t = typo(tr(text)).replace(/\[\[|\]\]/g, '');
  const sp = textWidth(' ', size, false);
  let lines = 0;
  for (const para of t.split(/\n/)) {
    lines++;
    let bold = false;
    let cur = 0;
    let word = 0;
    let spaced = false;
    const flush = (nextSpaced) => {
      if (word) {
        const need = (spaced ? sp : 0) + word;
        if (cur === 0) cur = word;
        else if (cur + need <= width) cur += need;
        else { lines++; cur = word; }
        while (cur > width) { lines++; cur -= width; }
      }
      word = 0;
      spaced = nextSpaced;
    };
    for (let i = 0; i < para.length; i++) {
      if (para.startsWith('**', i)) { bold = !bold; i++; continue; }
      const ch = para[i];
      if (ch === ' ') { flush(true); continue; }
      word += textWidth(ch, size, bold);
      if (ch === '-' && word > textWidth('-', size, bold) && /[\p{L}\d]/u.test(para[i + 1] || '')) flush(false);
    }
    flush(false);
  }
  return lines;
}
// Легенда в строку: items = [[цвет, текст], ...]; x1 — выровнять по правому краю, иначе от x. mark: 'dot' | 'sq'
function legendRow(s, items, { x, x1, y, size = 16, gap = 22, mark = 'dot' }) {
  const mw = 14;
  const ws = items.map(([, t]) => tw(t, size, false));
  const total = ws.reduce((a, w) => a + mw + 8 + w + gap, 0) - gap;
  let lx = x1 !== undefined ? x1 - total : x;
  items.forEach(([color, t], k) => {
    const my = y + (size * 1.2 - 14) / 2;
    if (mark === 'dot') s.circle({ x: lx, y: my, d: 14, fill: color });
    else s.box({ x: lx, y: my, w: 14, h: 14, fill: color, r: 3 });
    s.text(t, { x: lx + mw + 8, y, w: ws[k] + 8, size, color: C.navy });
    lx += mw + 8 + ws[k] + gap;
  });
  return total;
}
// Легенда с переносом строк (квадратики); возвращает высоту
function legendWrap(s, items, { x, y, maxW, size = 14, gap = 16, rowH = 21 }) {
  let lx = x;
  let ly = y;
  items.forEach(([color, t]) => {
    const w = 14 + 7 + tw(t, size, false);
    if (lx > x && lx + w > x + maxW) { lx = x; ly += rowH; }
    s.box({ x: lx, y: ly + (size * 1.2 - 13) / 2, w: 13, h: 13, fill: color, r: 3 });
    s.text(t, { x: lx + 20, y: ly, w: w - 14 + 6, size, color: C.navy });
    lx += w + gap;
  });
  return ly + rowH - y;
}
// Карточка «Key takeaways» с номерами; пункт — строка или массив абзацев; кегль подбирается по высоте
function takeaways(s, items, { x, y, w, h, label = 'Key takeaways', max = 18, min = 15, gap = 18, pgap = 8, numbers = true }) {
  s.card({ x, y, w, h });
  s.label(label, { x: x + 30, y: y + 28, w: w - 60, color: C.crimson });
  const TX = x + 30 + (numbers ? 34 : 0);
  const TW = w - 60 - (numbers ? 34 : 0);
  const avail = h - 66 - 22;
  const paras = items.map((it) => (Array.isArray(it) ? it : [it]));
  const hOf = (t, z) => textLines(t, z, TW) * z * 1.22;
  const need = (z) => paras.reduce((a, ps) => a + ps.reduce((b, t) => b + hOf(t, z), 0) + (ps.length - 1) * pgap, 0) + (paras.length - 1) * gap;
  let sz = max;
  while (sz > min && need(sz) > avail) sz -= 1;
  if (paras.length > 1) gap += Math.max(0, Math.min(16, (avail - need(sz)) / (paras.length - 1)));
  let ty = y + 66;
  paras.forEach((ps, k) => {
    if (numbers) s.badge({ x: x + 30, y: ty + (sz * 1.22 - 22) / 2, d: 22, n: k + 1, color: C.crimson, size: 13 });
    ps.forEach((t, j) => {
      s.text(t, { x: TX, y: ty - 1, w: TW, size: sz, lh: 1.22, color: C.navy });
      ty += Math.ceil(hOf(t, sz)) + (j < ps.length - 1 ? pgap : 0);
    });
    ty += gap;
  });
  if (ty - gap > y + h - 14) s.warn('takeaways', paras[0][0], `текст выходит за карточку: ${Math.round(ty - gap)} > ${y + h - 14}`);
  return ty - gap;
}
// Синяя плитка с большой цифрой (как у Azelik 12): value + unit, подпись, кто
function budgetTile(s, { x, y, w, h, value, unit, text, who }) {
  s.box({ x, y, w, h, fill: C.blue });
  s.text([{ text: value, options: {} }, { text: ' ' + unit, options: { fontSize: PT(30) } }], { x: x + 28, y: y + 16, w: w - 56, size: 56, bold: true, lh: 1.1, color: C.white });
  s.text(text, { x: x + 28, y: y + 88, w: w - 56, size: 19, bold: true, color: C.white });
  s.text(who, { x: x + 28, y: y + 113, w: w - 56, size: 16, color: C.white });
}
// Разнести подписи по вертикали, чтобы не налезали: items = [{ y }], возвращает те же объекты с полем ly
function spread(items, minGap, lo, hi) {
  const a = [...items].sort((p, q) => p.y - q.y);
  a.forEach((it, k) => { it.ly = k ? Math.max(it.y, a[k - 1].ly + minGap) : Math.max(it.y, lo); });
  for (let k = a.length - 1; k >= 0; k--) {
    const lim = k === a.length - 1 ? hi : a[k + 1].ly - minGap;
    if (a[k].ly > lim) a[k].ly = lim;
  }
  return items;
}

// ---------- бренды (одинаково на всех слайдах деки) ----------
// Акримиколь — синий (свой бренд), Залаин — малиновый (главный конкурент), Экзодерил — cyan, остальные — приглушённые
const BR = {
  akr: { key: 'акримиколь', name: 'Акримиколь', color: C.blue },
  zal: { key: 'залаин', name: 'Залаин', color: C.crimson },
  exo: { key: 'экзодерил', name: 'Экзодерил', color: C.cyan },
  oflomil: { key: 'офломил', name: 'Офломил', color: '5C7BA6' },
  term: { key: 'термикон', name: 'Термикон', color: '7F95B5' },
  myco: { key: 'микодерил', name: 'Микодерил', color: '9FB2CC' },
  oflomic: { key: 'офломикол', name: 'Офломикол', color: 'B9C6D6' },
};

module.exports = {
  // ===================== 1. Обложка =====================
  1: (d) => {
    const s = d.cover({ title: 'Akrimycol' });
    s.text('Strategic approach 2027 by OMD', { x: 296, y: 716, w: 1328, size: 44, lh: 1.1, color: C.white, align: 'center' });
  },

  // ===================== 2. Цели и задачи 2027 =====================
  // В исходнике — картинка во весь слайд (три полосы с красными номерами и иконками) поверх старого живого текста
  // с теми же формулировками; видимый текст сверен по увеличенным фрагментам. Иконки — Tabler.
  2: (d) => {
    const s = d.slide({ title: 'Цели и задачи для Акримиколь в 2027 году' });
    const goals = [
      { icon: 'tb:TbSpeakerphone',
        t: 'Усилить рекламу для бренда **Акримиколь** в медиа и нивелировать снижение промоции через врачей' },
      { icon: 'tb:TbTrendingUp',
        t: 'Стать **препаратом первого выбора** у потребителей с грибковыми поражениями кожи и достичь продаж в [[**420 тыс. упаковок**]] и доли рынка в [[**3,8%**]] в упаковках в 2027 году' },
      { icon: 'tb:TbShieldCheck',
        t: 'В коммуникации донести до потребителей, что Акримиколь является **современным препаратом** для лечения грибка кожи и обладает **важными УТП**' },
    ];
    const G = 24;
    const RH = (BOT - TOP - 2 * G) / 3;
    const PAD = 28;
    const NUM = 150;          // плитка с номером
    const ICON = 120;         // иконка в кружке справа
    goals.forEach((g, i) => {
      const col = ACCENTS[i];
      const y = TOP + i * (RH + G);
      s.card({ x: 58, y, w: 1804, h: RH });
      s.box({ x: 58 + PAD, y: y + PAD, w: NUM, h: RH - 2 * PAD, fill: col });
      s.text(String(i + 1), { x: 58 + PAD, y: y + PAD, w: NUM, h: RH - 2 * PAD, size: 110, bold: true, lh: 1, color: C.white, align: 'center', valign: 'middle' });
      const tx = 58 + PAD + NUM + 48;
      const ix = 1862 - PAD - 20 - ICON;
      s.text(g.t, { x: tx, y: y + PAD, w: ix - 48 - tx, h: RH - 2 * PAD, size: 36, lh: 1.22, color: C.navy, valign: 'middle', fit: true, minSize: 26 });
      s.icon(g.icon, { x: ix, y: y + (RH - ICON) / 2, size: ICON, color: C.white, circle: col });
    });
  },

  // ===================== 3. 2027: Digital должен компенсировать снижение врачебных выписок =====================
  // В исходнике — картинка во весь слайд, живого текста нет; всё перенесено живым текстом по увеличенным фрагментам.
  // Строка «26% — врач · 31% — фармацевт · 43% — самостоятельный выбор» (под выводом) — полосой долей в строке 3.
  3: (d) => {
    const s = d.slide({
      title: '2027: Digital должен компенсировать снижение врачебных выписок',
      subtitle: 'Этап роста — перевод части выбора препарата из врачебного контура\nв самостоятельный consumer choice',
    });
    const rows = [
      { lab: 'Текущая база', stat: '50% продаж', icon: 'tb:TbStethoscope',
        t: 'Акримиколь — TOP-3 в назначениях дерматологов. Врачебная выписка сегодня является **ключевым драйвером продаж**.' },
      { lab: 'Что меняется в 2027', stat: '[[↓]] HCP promo', icon: 'tb:TbTrendingDown',
        t: 'Промодавление на врачей снижается → бренд **не может продолжать опираться** на данный источник спроса.' },
      { lab: 'Где есть потенциал', stat: '43% self-choice', icon: 'tb:TbUsersGroup', mix: true,
        t: 'В категории крупнейший драйвер покупки — **самостоятельный выбор потребителя**.' },
    ];
    const G = 18;
    const RH = (PB - TOP - 2 * G) / 3;
    const PAD = 26;
    const NUM = 130;
    const ICON = 104;
    const SX = 58 + PAD + NUM + 40;     // колонка «метка + большая цифра»
    const SW = 560;
    const DX = SX + SW + 44;            // описание
    const IX = 1862 - PAD - 16 - ICON;
    const DW = IX - 40 - DX;
    rows.forEach((r, i) => {
      const col = ACCENTS[i];
      const y = TOP + i * (RH + G);
      s.card({ x: 58, y, w: 1804, h: RH, tint: i === 2 });
      s.box({ x: 58 + PAD, y: y + PAD, w: NUM, h: RH - 2 * PAD, fill: col });
      s.text(String(i + 1), { x: 58 + PAD, y: y + PAD, w: NUM, h: RH - 2 * PAD, size: 96, bold: true, lh: 1, color: C.white, align: 'center', valign: 'middle' });
      // метка + большая цифра
      const blockH = 22 + 14 + 66;
      const by = y + (RH - blockH) / 2;
      s.label(r.lab, { x: SX, y: by, w: SW, color: col === C.cyan ? C.teal : col });
      s.text(r.stat, { x: SX, y: by + 32, w: SW, h: 76, size: 62, bold: true, lh: 1.1, color: C.navy, fit: true, minSize: 44, maxLines: 1 });
      s.vline(DX - 24, y + PAD + 6, RH - 2 * PAD - 12);
      // описание (+ полоса долей в строке 3)
      if (!r.mix) {
        s.text(r.t, { x: DX, y: y + PAD, w: DW, h: RH - 2 * PAD, size: 24, lh: 1.25, color: C.navy, valign: 'middle', fit: true, minSize: 18 });
      } else {
        const th = Math.min(2, textLines(r.t, 24, DW)) * 24 * 1.25;
        const BH = 38;
        const ty = y + (RH - (th + 16 + BH)) / 2;
        s.text(r.t, { x: DX, y: ty, w: DW, h: th + 4, size: 24, lh: 1.25, color: C.navy, fit: true, minSize: 18, maxLines: 2 });
        const parts = [
          { v: 26, t: '26% — врач', fill: 'B9C6D6', ink: C.navy },
          { v: 31, t: '31% — фармацевт', fill: '7F95B5', ink: C.white },
          { v: 43, t: '43% — самостоятельный выбор', fill: C.crimson, ink: C.white },
        ];
        let bx = DX;
        const yb = ty + th + 16;
        parts.forEach((p, k) => {
          const w = DW * p.v / 100;
          s.box({ x: bx + (k ? 2 : 0), y: yb, w: w - (k ? 2 : 0), h: BH, fill: p.fill, r: 6 });
          s.text(p.t, { x: bx + 12, y: yb, w: w - 20, h: BH, size: 17, bold: true, color: p.ink, valign: 'middle', fit: true, minSize: 14, maxLines: 1 });
          bx += w;
        });
      }
      s.icon(r.icon, { x: IX, y: y + (RH - ICON) / 2, size: ICON, color: C.white, circle: col });
    });
    s.principle({ label: 'Стратегический вывод', icon: 'target',
      text: 'Digital в 2027 должен **не только перехватывать готовый спрос**, но и **заранее формировать знание и основания для выбора** Акримиколя — до момента брендового запроса.' });
  },

  // ===================== 4. Offline Competitive Landscape =====================
  4: (d) => {
    const s = d.slide({
      title: 'Acrimycol / Offline Competitive Landscape',
      subtitle: 'Из конкурентов в виде кремовых форм по данным мониторинга\nразмещался только бренд Офломил',
    });
    const all = charts(4);
    const invP = all.find((c) => c.type === 'COLUMN_STACKED').plots[0];
    const salesP = all.find((c) => c.type === 'LINE').plots[0];
    const cats = invP.cats.map((c) => xl(c));          // янв 2025 … июл 2026 (19 мес.)
    const NC = cats.length;
    const labels = cats.map((c) => `${MONTHS[c.m]} ${c.y}`);
    const inv = pick(invP.series, 'офломил').map((v) => (v == null ? 0 : v / 1e6));
    // порядок линий: фоновые бренды, затем Залаин и Акримиколь поверх
    const LB = [BR.myco, BR.oflomic, BR.term, BR.oflomil, BR.zal, BR.akr];
    // у Офломила нет продаж в янв–фев 2025 (в исходнике пусто) — 0
    const sales = LB.map((b) => pick(salesP.series, b.key).map((v) => (v == null ? 0 : v / 1e6)));

    const CA = { x: 58, y: TOP, w: LW, h: BOT - TOP };
    s.card(CA);
    const X0 = 128;
    const X1 = CA.x + CA.w - 176;        // справа — место под подписи концов линий
    const step = (X1 - X0) / NC;
    const m = chartMap('col', NC, { x: X0, w: step * NC, y: 0, h: 1 }, 0, 1);
    const i26 = cats.findIndex((c) => c.y === 2026);
    const xY = m.cat(i26) - step / 2;

    // ---- ряд 1: инвестиции в ТВ, млн ₽ ----
    const L1 = 'Динамика инвестиций';
    s.label(L1, { x: NAME_X, y: 249, w: lw(L1), color: C.blue });
    s.text('млн ₽, Mediascope', { x: NAME_X + lw(L1) + 12, y: 251, w: 300, size: 17, color: C.blueText });
    legendRow(s, [[BR.oflomil.color, 'Офломил']], { x1: CA.x + CA.w - 30, y: 251, size: 17, mark: 'sq' });
    s.text('Акримиколь — размещений нет', { x: CA.x + CA.w - 30 - 360, y: 280, w: 360, size: 15, color: C.blueText, align: 'right' });
    const P1 = { x: X0, w: step * NC, y: 330, h: 126 };
    const MAX1 = 3.9;
    const m1 = s.chart('col', [{ name: 'Офломил — инвестиции в ТВ, млн ₽', labels, values: inv.map((v) => +v.toFixed(3)) }],
      { x: P1.x - 10, y: P1.y - 10, w: P1.w + 20, h: P1.h + 20, plot: P1, min: 0, max: MAX1, gap: 45,
        colors: [BR.oflomil.color], legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
    inv.forEach((v, i) => {
      if (v <= 0) return;
      s.text(f1(v), { x: m1.cat(i) - 30, y: m1.val(v) - 22, w: 60, size: 15, bold: true, color: C.navy, align: 'center' });
    });
    s.seg(P1.x, P1.y + P1.h, X1, P1.y + P1.h, { color: C.line, width: 1.5 });
    // вывод 1 — размещения Офломила 2026
    const iM26 = cats.findIndex((c) => c.y === 2026 && c.m === 4);
    s.badge({ x: m1.cat(iM26) - 11, y: m1.val(inv[iM26]) - 52, d: 22, n: 1, color: C.crimson, size: 13 });

    // ---- ряд 2: продажи, млн ₽ ----
    const yS = P1.y + P1.h + 30;
    const L2 = 'Динамика продаж';
    s.hline(NAME_X - 8, yS - 14, CA.w - 2 * (NAME_X - 8 - CA.x));
    s.label(L2, { x: NAME_X, y: yS + 6, w: lw(L2), color: C.blue });
    s.text('млн ₽, IQVIA', { x: NAME_X + lw(L2) + 12, y: yS + 8, w: 300, size: 17, color: C.blueText });
    const P2 = { x: X0, w: step * NC, y: yS + 76, h: 0 };
    P2.h = 924 - P2.y;
    const MAX2 = 32;
    const nf = LB.length - 2;      // фоновые серии
    const lineOpt = (cols, size, sym) => ({ x: P2.x - 16, y: P2.y - 12, w: P2.w + 32, h: P2.h + 24, plot: P2, min: 0, max: MAX2, values: false, legend: false,
      colors: cols, lineSize: size, symbolSize: sym, extra: { catAxisHidden: true, catAxisLineShow: false } });
    s.chart('line', LB.slice(0, nf).map((b, k) => ({ name: `${b.name} — продажи, млн ₽`, labels, values: sales[k].map((v) => +v.toFixed(2)) })),
      lineOpt(LB.slice(0, nf).map((b) => b.color), 2.25, 4));
    const m2 = s.chart('line', LB.slice(nf).map((b, k) => ({ name: `${b.name} — продажи, млн ₽`, labels, values: sales[nf + k].map((v) => +v.toFixed(2)) })),
      lineOpt(LB.slice(nf).map((b) => b.color), 3.5, 7));
    s.seg(P2.x, P2.y + P2.h, X1, P2.y + P2.h, { color: C.line, width: 1.5 });
    // значения Акримиколя и Залаина: у верхней из двух точек — над точкой, у нижней — под точкой
    const za = sales[nf];
    const ak = sales[nf + 1];
    const ZOFF = { 11: [-30, 4], 15: [34, -22], 16: [-30, -24] };   // дек 2025, апр и май 2026
    const AOFF = { 10: [0, -25] };                                  // ноя 2025 — над точкой, чтобы освободить место
    for (let i = 0; i < NC - 1; i++) {     // июль 2026 — в подписях у концов линий
      const top = ak[i] >= za[i];
      [[ak[i], BR.akr.color, top, false], [za[i], BR.zal.color, !top, true]].forEach(([v, color, up, isZ]) => {
        const yv = m2.val(v);
        // Залаин в точках пересечения и резкого разворота — подпись сбоку, чтобы не легла на линии
        const [dx, dy] = (isZ ? ZOFF[i] : AOFF[i]) || [0, up ? -25 : 7];
        s.text(f1(v), { x: m2.cat(i) - 28 + dx, y: yv + dy, w: 56, size: 14, bold: true, color, align: 'center' });
      });
    }
    // подписи у концов линий (имя + значение июля 2026), разнесённые по вертикали
    const ends = spread(LB.map((b, k) => ({ b, k, y: m2.val(sales[k][NC - 1]) - 10 })), 22, P2.y - 10, P2.y + P2.h - 12);
    ends.forEach(({ b, k, ly }) => {
      const focus = k >= nf;
      s.text(`${tr(b.name)} ${f1(sales[k][NC - 1])}`, { x: m2.cat(NC - 1) + 16, y: ly, w: 170, size: 16, bold: focus, color: focus ? b.color : C.navy });
    });
    s.badge({ x: m2.cat(NC - 1) - 11, y: m2.val(ak[NC - 1]) - 36, d: 22, n: 2, color: C.crimson, size: 13 });

    // граница годов и ось месяцев (общая для обоих графиков)
    s.seg(xY, 300, xY, P1.y + P1.h, { color: C.line, width: 1.5, dash: 'dash' });
    s.seg(xY, P2.y - 30, xY, P2.y + P2.h + 4, { color: C.line, width: 1.5, dash: 'dash' });
    cats.forEach((c, i) => s.text(MONTHS[c.m], { x: m.cat(i) - step / 2, y: P2.y + P2.h + 8, w: step, size: 14, color: C.blueText, align: 'center' }));
    const groups = [];
    cats.forEach((c) => { if (!groups.length || groups[groups.length - 1][0] !== String(c.y)) groups.push([String(c.y), 0]); groups[groups.length - 1][1]++; });
    V.yearAxis(s, { ...m, step }, groups, P2.y + P2.h + 29, { size: 16 });

    // ---- правая колонка ----
    const hT = 150;
    budgetTile(s, { x: RX, y: TOP, w: RW, h: hT, value: '2,5', unit: 'млн ₽', text: '2026 budget', who: 'Офломил' });
    const yK = TOP + hT + 18;
    takeaways(s, [
      'Офломил из медиаканалов использовал **только Нац. ТВ**. Бренд размещался небольшим объемом спонсорской рекламы (50 рейтингов 25–55 и 52 выхода тотал за 1–7 2026) на каналах ТНТ и ТНТ 4. **Значительного влияния на продажи такая рекламная активность не оказала.**',
      'Продажи Акримиколя **выросли в 2 раза** с начала года, и сейчас **бренд лидирует**. Таким же темпом выросли продажи у Термикона в этом году. Продажи Офломикола и Микодерила находятся на уровне 11–14 млн на протяжении последних 5 месяцев. У Залаина наблюдается **резкий рост продаж с мая 2026** (с 4 млн в апреле до 21 млн в июле).',
    ], { x: RX, y: yK, w: RW, h: BOT - yK, max: 19, min: 15, gap: 24 });

    s.footnote('Источник: Mediascope, IQVIA', { y: 1030, w: 1730 });
  },

  // ===================== 5. Lamisil / TV campaign Cream for Women =====================
  5: (d) => {
    // «Вывод: ТВ-кампания демонстрирует измеримый эффект на продажи» из Key takeaways — в плашку-вывод;
    // «Периоды размещений» — строкой под осью лет (у столбцов своих годов).
    const s = d.slide({ title: 'Lamisil / TV campaign Cream for Women' });
    const all = charts(5);
    const salesP = all.find((c) => c.type === 'LINE').plots[0];
    const invP = all.find((c) => c.type === 'COLUMN_CLUSTERED').plots[0];
    const [lenP, chP] = all.filter((c) => c.type === 'BAR_STACKED_100').map((c) => c.plots[0]);
    const years = salesP.cats;                         // 2004 … 2015
    const NY = years.length;
    const SS = [
      { key: 'cream f/ext.', name: 'Крем', series: 'Ламизил крем — продажи, млн ₽', color: C.crimson, ink: C.crimson },
      { key: 'spray & gel', name: 'Спрей и гель', series: 'Ламизил спрей и гель — продажи, млн ₽', color: '7F95B5', ink: C.navy },
    ];
    const IS = [
      { key: 'ламизил для жещин', name: 'Ламизил для женщин', series: 'Ламизил для женщин — инвестиции в Нац. ТВ, млн ₽', color: C.crimson },
      { key: 'другие кампании', name: 'Другие кампании', series: 'Другие кампании — инвестиции в Нац. ТВ, млн ₽', color: V.MUTED },
    ];
    const sales = SS.map((sr) => pick(salesP.series, sr.key).map((v) => v / 1e6));
    const inv = IS.map((sr) => pick(invP.series, sr.key).map((v) => (v == null ? 0 : v / 1e6)));
    const camp = ['2006', '2007', '2008', '2011'];     // годы кампании «для женщин»

    // ---- карточка A: продажи и инвестиции в Нац. ТВ по годам ----
    const CA = { x: 58, y: TOP, w: LW, h: 439 };
    s.card(CA);
    const X0 = 290;
    const X1 = CA.x + CA.w - 30;
    const step = (X1 - X0) / NY;
    const m = chartMap('col', NY, { x: X0, w: step * NY, y: 0, h: 1 }, 0, 1);
    // подсветка лет кампании (под обоими графиками и строками TVR / периодов)
    const yBand0 = 296;
    const yBand1 = CA.y + CA.h - 12;
    camp.forEach((yr) => {
      const i = years.indexOf(yr);
      s.box({ x: m.cat(i) - step / 2 + 2, y: yBand0, w: step - 4, h: yBand1 - yBand0, fill: BAND, r: 8 });
    });

    // ряд 1: продажи, млн ₽ — линии (крем малиновым)
    const L1 = 'Динамика продаж';
    s.label(L1, { x: NAME_X, y: 249, w: lw(L1), color: C.blue });
    s.text('млн ₽, IQVIA', { x: NAME_X + lw(L1) + 12, y: 251, w: 300, size: 17, color: C.blueText });
    legendRow(s, SS.map((sr) => [sr.color, sr.name]), { x1: X1, y: 251, size: 17, gap: 26 });
    const P1 = { x: X0, w: step * NY, y: 318, h: 74 };
    const m1 = s.chart('line', SS.map((sr, k) => ({ name: sr.series, labels: years, values: sales[k].map((v) => +v.toFixed(1)) })),
      { x: P1.x - 16, y: P1.y - 12, w: P1.w + 32, h: P1.h + 24, plot: P1, min: 80, max: 510, values: false, legend: false,
        colors: SS.map((sr) => sr.color), lineSize: 3, symbolSize: 6, extra: { catAxisHidden: true, catAxisLineShow: false } });
    sales.forEach((vals, k) => vals.forEach((v, i) => {
      const yv = m1.val(v);
      s.text(f0(v), { x: m1.cat(i) - 30, y: k === 0 ? yv - 24 : yv + 6, w: 60, size: 14, bold: k === 0, color: SS[k].ink, align: 'center' });
    }));

    // ряд 2: инвестиции в Нац. ТВ, млн ₽ — столбцы рядом
    const yI = P1.y + P1.h + 28;
    const L2 = 'Динамика инвестиций Нац. ТВ';
    s.label(L2, { x: NAME_X, y: yI, w: lw(L2), color: C.blue });
    s.text('млн ₽, Mediascope', { x: NAME_X + lw(L2) + 12, y: yI + 2, w: 300, size: 17, color: C.blueText });
    legendRow(s, IS.map((sr) => [sr.color, sr.name]), { x1: X1, y: yI + 2, size: 17, gap: 26, mark: 'sq' });
    const P2 = { x: X0, w: step * NY, y: yI + 52, h: 100 };
    const MAX2 = 285;
    const GAP = 40;
    const m2 = s.chart('col', IS.map((sr, k) => ({ name: sr.series, labels: years, values: inv[k].map((v) => +v.toFixed(2)) })),
      { x: P2.x - 10, y: P2.y - 10, w: P2.w + 20, h: P2.h + 20, plot: P2, min: 0, max: MAX2, gap: GAP, overlap: 0,
        colors: IS.map((sr) => sr.color), legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
    const bw = step / (2 + GAP / 100);
    inv.forEach((vals, k) => vals.forEach((v, i) => {
      if (v <= 0) return;
      const xc = m2.cat(i) + (k - 0.5) * bw;
      s.text(f0(v), { x: xc - 22, y: m2.val(v) - 19, w: 44, size: 13, bold: k === 0, color: k === 0 ? C.crimson : C.navy, align: 'center' });
    }));
    s.seg(P2.x, P2.y + P2.h, X1, P2.y + P2.h, { color: C.line, width: 1.5 });
    // ось лет
    const yA = P2.y + P2.h + 6;
    years.forEach((yr, i) => s.text(yr, { x: m.cat(i) - step / 2, y: yA, w: step, size: 16, bold: camp.includes(yr), color: C.navy, align: 'center' }));
    // строки TVR и периодов размещений
    const yT = yA + 26;
    s.text('TVR 25–55', { x: NAME_X, y: yT, w: X0 - NAME_X - 12, size: 16, bold: true, color: C.navy });
    const TVR = { 2006: '1300', 2007: '1565', 2008: '1019', 2011: '565' };
    const PER = { 2006: 'май–июль', 2007: 'май–август', 2008: 'февраль–март', 2011: 'март–апрель' };
    const yP = yT + 24;
    s.text('Периоды размещений', { x: NAME_X, y: yP, w: X0 - NAME_X - 8, size: 16, bold: true, color: C.navy, fit: true, minSize: 14, maxLines: 1 });
    camp.forEach((yr) => {
      const i = years.indexOf(yr);
      s.text(TVR[yr], { x: m.cat(i) - step / 2, y: yT, w: step, size: 16, bold: true, color: C.crimson, align: 'center' });
      s.text(PER[yr], { x: m.cat(i) - step / 2 - 6, y: yP + 1, w: step + 12, size: 14, color: C.navy, align: 'center', fit: true, minSize: 12, maxLines: 1 });
    });
    if (yP + 22 > CA.y + CA.h - 10) s.warn('график', L2, `строка периодов выходит за карточку: ${Math.round(yP + 22)}`);

    // ---- правая колонка: бюджет и выводы ----
    const hT = 150;
    budgetTile(s, { x: RX, y: TOP, w: RW, h: hT, value: '157', unit: 'млн ₽', text: '2006–2011 total budget', who: 'Lamisil' });
    const yK = TOP + hT + 18;
    takeaways(s, [
      'Запуск кампании «Любимые пяточки» (2006–2011) обеспечил **рост продаж крема в 1,5 раза** относительно 2005 г. После прекращения рекламной поддержки видно **снижение на 7%** (с 368 до 342–349 млн руб.)',
      'Ламизил размещался 5, 10 и 20-секундными роликами, постепенно **расширяя микс каналов, с 4 в 2006 до 17 в 2011**.',
    ], { x: RX, y: yK, w: RW, h: CA.y + CA.h - yK, max: 18, min: 15, gap: 18 });

    // ---- нижний ряд: длина роликов, каналы, ролики ----
    const yR = CA.y + CA.h + 18;
    const hR = PB - yR;
    const yrs = lenP.cats;                               // 2006, 2007, 2008, 2011
    const bars100 = ({ x, w, label, items, src, legendMaxW }) => {
      s.card({ x, y: yR, w, h: hR });
      s.label(label, { x: x + 30, y: yR + 22, w: lw(label), color: C.blue });
      const lh = legendWrap(s, items.map((it) => [it.color, it.name]), { x: x + 30, y: yR + 56, maxW: legendMaxW ?? w - 60, size: 14, gap: 14, rowH: 21 });
      const YW = 52;
      const PL = { x: x + 30 + YW, y: yR + 56 + lh + 8, w: w - 60 - YW, h: 0 };
      PL.h = yR + hR - 18 - PL.y;
      const vals = items.map((it) => pick(src.series, it.key).map((v) => v || 0));
      const ml = s.chart('bar', items.map((it, k) => ({ name: it.series ?? it.name, labels: yrs, values: vals[k].map((v) => +v.toFixed(4)) })),
        { x: PL.x - 6, y: PL.y - 4, w: PL.w + 12, h: PL.h + 8, plot: PL, min: 0, max: 1, percent: true, gap: 30,
          colors: items.map((it) => it.color), legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
      yrs.forEach((yr, i) => {
        const yc = ml.cat(i);
        s.text(yr, { x: x + 30, y: yc - 10, w: YW, size: 15, bold: true, color: C.navy });
        const tot = vals.reduce((a, sr) => a + sr[i], 0) || 1;
        let cum = 0;
        items.forEach((it, k) => {
          const v = vals[k][i] / tot;
          const xc = PL.x + PL.w * (cum + v / 2);
          cum += v;
          if (v * PL.w >= 34) s.text(`${Math.round(v * 100)}%`, { x: xc - 26, y: yc - 9, w: 52, size: 13, bold: true, color: it.ink, align: 'center' });
        });
      });
    };
    const LEN = [
      { key: "5''", name: '5"', series: 'Ролики 5"', color: 'B9C6D6', ink: C.navy },
      { key: "10''", name: '10"', series: 'Ролики 10"', color: C.cyan, ink: C.navy },
      { key: "20''", name: '20"', series: 'Ролики 20"', color: C.blue, ink: C.white },
    ];
    const CHN = [
      { key: 'нтв', name: 'НТВ', color: C.blue, ink: C.white },
      { key: 'тнт', name: 'ТНТ', color: C.cyan, ink: C.navy },
      { key: 'тв-3', name: 'ТВ-3', color: C.navy, ink: C.white },
      { key: 'рен тв', name: 'РЕН ТВ', color: '5C7BA6', ink: C.white },
      { key: 'тв центр', name: 'ТВ Центр', color: '8DA3C2', ink: C.white },
      { key: 'стс', name: 'СТС', color: C.teal, ink: C.white },
      { key: 'первый канал', name: 'Первый канал', color: '9FD3F0', ink: C.navy },
      { key: 'россия 1', name: 'Россия 1', color: 'B9C6D6', ink: C.navy },
      { key: 'другие', name: 'Другие', color: 'DCE4EE', ink: C.navy },
    ];
    const VG = 22;
    const VH = hR - 22 - 36 - 20;
    const VW = Math.round(VH * 352 / 288);
    const wV = 3 * VW + 2 * VG + 60;
    const wLen = 400;
    const wCh = 1804 - wV - wLen - 36;
    bars100({ x: 58, w: wLen, label: 'Длина роликов', items: LEN, src: lenP });
    bars100({ x: 58 + wLen + 18, w: wCh, label: 'Каналы', items: CHN, src: chP });

    // ролики: 5 / 10 / 20 sec (в исходнике слева направо media3, media2, media1; пропорция 352:288)
    const xV = 1862 - wV;
    s.card({ x: xV, y: yR, w: wV, h: hR });
    const yCap = yR + 22;
    const yVid = yCap + 36;
    [
      { media: 'media3.avi', cover: 'image37.png', cap: '5 sec', name: 'Ламизил для женщин — ролик 5 секунд' },
      { media: 'media2.avi', cover: 'image36.png', cap: '10 sec', name: 'Ламизил для женщин — ролик 10 секунд' },
      // в исходнике подписан «15 sec», но ролик длится 20 секунд (как и 20" в данных о длине роликов)
      { media: 'media1.avi', cover: 'image35.png', cap: '20 sec', name: 'Ламизил для женщин — ролик 20 секунд' },
    ].forEach((v, k) => {
      const x = xV + 30 + k * (VW + VG);
      s.icon('tb:TbPlayerPlayFilled', { x, y: yCap, size: 26, color: C.white, circle: C.crimson });
      s.text(v.cap, { x: x + 34, y: yCap + 1, w: VW - 34, size: 18, bold: true, color: C.navy });
      K.video(s, { media: v.media, cover: v.cover, x, y: yVid, w: VW, h: VH, name: v.name });
    });

    s.principle({ label: 'Вывод', icon: 'bulb', text: 'ТВ-кампания демонстрирует измеримый эффект на продажи' });
    s.footnote('Источник: Mediascope, IQVIA', { y: 1030, w: 1730 });
  },
};
