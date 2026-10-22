// Акримиколь · стратегия 2027 — часть D: слайды исходника 16–20.
// 16 — архитектура кампании 2027 vs 2026: слои ALWAYS ON / SPRINT × 2026 / 2027 (живые фигуры; подача — как Acriol 14, Dinobutin 17, Normobact 20);
// 17 — роль каналов CREATE → CAPTURE → REASSURE → CONVERT (картинка → живой текст; как Bobotic 20, Dinobutin 15);
// 18 — видео: модульная персонализация (картинка → живой текст + вырезки d_18_*.png). Не помещается в один слайд
//      без сжатия текста ниже минимумов — два слайда: 18a «задачи видео + AI-мастер», 18b «как строим ролик» (каркас, модули, микросцены, версии);
// 19 — OLV двумя волнами: распределение по месяцам (живой график), почему работает, от KPI к медиавесу, что получает бренд (как Bobotic 22, Dinobutin 19);
// 20 — календарь баннерной коммуникации: гант мар–сен по 6 оккейженам + примеры сообщений с фото (вырезки d_20_*.png).
// Слайды-картинки: ориентир — итоговый рендер исходника (видимый текст картинки), мелкий текст сверен по увеличенным кускам.
// Цвета этапов и слоёв — как в части E: CREATE crimson, CAPTURE blue, REASSURE purple, CONVERT green; ALWAYS ON navy, SPRINT crimson.
const path = require('path');
const fs = require('fs');
const { C, countLines, textWidth, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT, MUTED
const K = require('./common');                            // CROPS

const TOP = V.TOP;   // 221 — верх контента
const BOT = V.BOT;   // 1005 — низ контента без плашки
const CB = 905;      // низ контента над плашкой
const X0 = 58;
const X1 = 1862;

const STG = { CREATE: C.crimson, CAPTURE: C.blue, REASSURE: C.purple, CONVERT: C.green, AON: C.navy, SPRINT: C.crimson };

// ---------- Локальные хелперы ----------
const view = (t) => typo(tr(String(t))).replace(/\*\*|\[\[|\]\]/g, '');
const measure = (t, w, size = 18, bold = false, lh = 1.2) => Math.round(countLines(view(t), size, w, bold) * size * lh);
const widthOf = (t, size, bold = false) => Math.ceil(textWidth(view(t), size, bold));
// Смешение цвета с белым: k = 0 — белый, 1 — исходный цвет
function tintOf(hex, k) {
  const c = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return c.map((v) => Math.round(255 + (v - 255) * k).toString(16).padStart(2, '0')).join('').toUpperCase();
}
// Размер PNG (ширина, высота) — чтобы ставить вырезки без искажения пропорций
function pngSize(file) {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}
const crop = (f) => path.join(K.CROPS, f);
// Картинка заданной высоты; ширина — по пропорции файла. Возвращает ширину.
function photoH(s, f, { x, y, h, alt }) {
  const { w: iw, h: ih } = pngSize(crop(f));
  const w = Math.round(h * iw / ih);
  s.image(crop(f), { x, y, w, h, alt });
  return w;
}
// Картинка заданной ширины; высота — по пропорции файла. Возвращает высоту.
function photoW(s, f, { x, y, w, alt }) {
  const { w: iw, h: ih } = pngSize(crop(f));
  const h = Math.round(w * ih / iw);
  s.image(crop(f), { x, y, w, h, alt });
  return h;
}

// Ярлык статуса канала (NEW — малиновый, REINFORCED — синий), как в деках серии
function tag(s, t, x, y, { size = 13, h = 24 } = {}) {
  const w = widthOf(t, size, true) + 20;
  s.box({ x, y, w, h, fill: t === 'NEW' ? C.crimson : C.blue, r: h / 2 });
  s.text(t, { x, y, w, h, size, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
  return w;
}
// Строки текста при переносе по словам (как countLines: запас 3%) — чтобы поставить ярлык после последней строки
function wrapLines(t, size, w, bold = false) {
  const words = view(t).split(/\s+/);
  const sp = textWidth(' ', size, bold);
  const lines = [];
  let cur = '';
  let cw = 0;
  words.forEach((wd) => {
    const ww = textWidth(wd, size, bold);
    if (cur && cw + sp + ww > w * 0.97) { lines.push(cw); cur = wd; cw = ww; } else { cw = cur ? cw + sp + ww : ww; cur = cur ? cur + ' ' + wd : wd; }
  });
  lines.push(cw);
  return lines;
}
// Список каналов / сегментов: строка + ярлык статуса сразу после неё; длинная строка переносится, ярлык — после последней строки
function chanList(s, items, { x, y, w, size = 19, pitch = 31 }) {
  const LH = Math.round(size * 1.2);
  let yy = y;
  items.forEach((it) => {
    const [t, tg] = Array.isArray(it) ? it : [it];
    const tagW = tg ? widthOf(tg, 13, true) + 20 : 0;
    // сначала пробуем уместить в одну строку, уменьшив кегль до 16; не вышло — переносим
    let sz = size;
    while (tg && sz > 16 && widthOf(t, sz) + 10 + tagW > w * 0.97) sz -= 1;
    let lines = wrapLines(t, sz, w);
    if (tg && lines[lines.length - 1] + 10 + tagW > w) lines = wrapLines(t, sz, w - tagW - 10);
    s.text(t, { x, y: yy + Math.round((size - sz) * 0.6), w: tg ? w - tagW - 10 : w, size: sz, lh: 1.2, color: C.navy });
    if (tg) tag(s, tg, x + Math.ceil(lines[lines.length - 1]) + 10, yy + (lines.length - 1) * LH + Math.round((LH - 24) / 2));
    yy += lines.length * LH + (pitch - LH);
  });
}
// Заголовок карточки: номер в кружке + заголовок
function numHead(s, { x, y, w, n, text, color = C.blue, d = 42, size = 25 }) {
  s.badge({ x, y, d, n, color, size: 22 });
  s.text(text, { x: x + d + 14, y, w: w - d - 14, h: d, size, bold: true, lh: 1.0, color: C.navy, valign: 'middle', fit: true, maxLines: 1, minSize: 19 });
}
// Заголовок карточки: иконка в кружке + заголовок (до 2 строк)
function iconHead(s, { x, y, w, icon, text, color = C.blue, d = 52, size = 27 }) {
  s.icon(icon, { x, y, size: d, circle: color });
  s.text(text, { x: x + d + 16, y: y - 6, w: w - d - 16, h: d + 12, size, bold: true, lh: 1.05, color: C.navy, valign: 'middle', fit: true, maxLines: 2, minSize: 20 });
}

// Цепочка медиарасчёта: плитки «цифра + подпись» с шевронами; accent: 'soft' | 'main'
function chain(s, items, { x, y, w, h = 140, gap = 34 }) {
  const tw = (w - gap * (items.length - 1)) / items.length;
  items.forEach((c, i) => {
    const bx = Math.round(x + i * (tw + gap));
    const bw = Math.round(tw);
    const main = c.accent === 'main';
    const soft = c.accent === 'soft';
    s.box({ x: bx, y, w: bw, h, fill: main ? C.crimson : soft ? tintOf(C.crimson, 0.1) : C.cardTint });
    s.text(c.v, { x: bx + 16, y: y + 22, w: bw - 32, size: 34, bold: true, lh: 1.0, color: main ? C.white : soft ? C.crimson : C.navy,
      fit: true, maxLines: 1, minSize: 24 });
    s.text(c.t, { x: bx + 16, y: y + 70, w: bw - 26, h: h - 76, size: 17, lh: 1.15, color: main ? C.white : C.blueText, fit: true, minSize: 14 });
    if (i < items.length - 1) s.chevron({ cx: bx + bw + gap / 2, cy: y + h / 2, w: 16, h: 24, color: C.crimson });
  });
}

// Блок «Что получает бренд»: строки «ярлык │ текст» с разделителями, ряды растягиваются на высоту h
function gets(s, rows, { x, y, w, h }) {
  const PILL_W = Math.max(...rows.map((g) => widthOf(g.k, 17, true))) + 40;
  const tw = w - PILL_W - 20;
  const rh = rows.map((g) => Math.max(40, measure(g.t, tw, 18)));
  const spare = h - rh.reduce((a, b) => a + b, 0);
  const gap = Math.max(20, Math.floor(spare / rows.length));
  let yy = y + Math.max(0, Math.round((spare - gap * (rows.length - 1)) / 2));
  rows.forEach((g, i) => {
    if (i > 0) s.hline(x, yy - gap / 2, w);
    s.pill(g.k, { x, y: yy + Math.round((rh[i] - 40) / 2), w: PILL_W, h: 40, color: g.color, size: 17 });
    s.text(g.t, { x: x + PILL_W + 20, y: yy + Math.round((rh[i] - measure(g.t, tw, 18)) / 2), w: tw, size: 18, lh: 1.2, color: C.navy });
    yy += rh[i] + gap;
  });
}

module.exports = {
  // =====================================================================
  // 16 · Архитектура кампании 2027 vs 2026 (живые фигуры)
  // =====================================================================
  16: (d) => {
    const s = d.slide({
      title: 'Акримиколь 2027: архитектура кампании vs 2026',
      subtitle: 'AON круглый год защищает и конвертирует сформированный спрос, сезонный Sprint расширяет его за счёт новых потребителей и релевантных жизненных ситуаций',
    });
    const LB = { x: X0, w: 206 };      // метки слоёв
    const A = { x: 284, w: 566 };      // 2026
    const B = { x: 970, w: X1 - 970 }; // 2027
    const G = { x: A.x + A.w, w: B.x - A.x - A.w };   // зазор с приростами
    const R1 = { y: 334, h: 266 };
    const R2 = { y: 614, h: 298 };
    const R3 = { y: 930, h: 54 };

    // ---- шапки колонок: год и бюджет тотал ----
    const head = (X, year, value, color) => {
      s.text(year, { x: X.x, y: TOP, w: 200, size: 26, bold: true, lh: 1.0, color });
      const vw = widthOf(value, 60, true);
      s.text(value, { x: X.x, y: 252, w: vw + 8, size: 60, bold: true, lh: 1.0, color });
      const uw = widthOf('млн ₽', 30, true);
      s.text('млн ₽', { x: X.x + vw + 14, y: 276, w: uw + 8, size: 30, bold: true, lh: 1.0, color });
      s.text('(вкл. доп. кост)*', { x: X.x + vw + 14 + uw + 18, y: 284, w: X.w - vw - uw - 40, size: 18, lh: 1.0, color: C.blueText });
    };
    head(A, '2026', '6', C.navy);
    head(B, '2027', '20', C.crimson);

    // ---- метки слоёв: название + путь ----
    const layer = (R, { name, sub, icon, color }) => {
      s.box({ x: LB.x, y: R.y, w: LB.w, h: R.h, fill: color });
      s.icon(icon, { x: LB.x + 18, y: R.y + 18, size: 48, color: C.white });
      const sh = measure(sub, LB.w - 36, 17, false, 1.15);
      s.text(sub, { x: LB.x + 18, y: R.y + R.h - 20 - sh, w: LB.w - 36, size: 17, lh: 1.15, color: C.white });
      s.text(name, { x: LB.x + 18, y: R.y + R.h - 20 - sh - 8 - 26, w: LB.w - 36, size: 24, bold: true, lh: 1.0, color: C.white, fit: true, maxLines: 1, minSize: 18 });
    };
    layer(R1, { name: 'ALWAYS ON', sub: 'Capture →\nReassure →\nConvert', icon: 'tb:TbInfinity', color: STG.AON });
    layer(R2, { name: 'SPRINT', sub: 'Create consumer demand', icon: 'tb:TbBolt', color: STG.SPRINT });

    // ---- ячейка: заголовок, период, бюджет, списки ----
    const HEAD = { [R1.y]: 80, [R2.y]: 100 };   // высота шапки ячейки по строке (в спринте — ещё строка периода)
    const cell = (X, R, { title, period, budget, accent, tint, lists, split = 0.42 }) => {
      s.card({ x: X.x, y: R.y, w: X.w, h: R.h, tint });
      const px = X.x + 26;
      const pw = X.w - 52;
      const bw = widthOf(budget, 36, true) + 8;
      const tw = pw - bw - 20;
      const one = countLines(view(title), 18, tw, true) === 1;   // в одну строку (кегль до 18), иначе — две строки
      const th = s.text(title, { x: px, y: R.y + 20, w: tw, size: 21, bold: true, lh: 1.1, color: C.navy, fit: true, maxLines: one ? 1 : 2, minSize: 18 });
      if (period) {
        s.icon('tb:TbCalendar', { x: px, y: R.y + 20 + th + 8, size: 24, color: accent });
        s.text(period, { x: px + 32, y: R.y + 20 + th + 9, w: pw - bw - 52, size: 19, bold: true, lh: 1.1, color: accent });
      }
      s.text(budget, { x: X.x + X.w - 26 - bw, y: R.y + 18, w: bw, size: 36, bold: true, lh: 1.0, color: accent, align: 'right' });
      const ly = R.y + HEAD[R.y];
      s.hline(px, ly, pw);
      const gap = 24;
      const widths = lists.length === 1 ? [pw] : [Math.round(pw * split) - gap / 2, pw - Math.round(pw * split) - gap / 2];
      let lx = px;
      lists.forEach(([title2, items], k) => {
        if (k > 0) s.vline(lx - gap / 2, ly + 16, R.y + R.h - ly - 34);
        s.label(title2, { x: lx, y: ly + 16, w: widths[k], size: 15, color: C.blueText });
        chanList(s, items, { x: lx, y: ly + 44, w: widths[k] });
        lx += widths[k] + gap;
      });
    };
    cell(A, R1, { title: 'Основное размещение в рамках 2026 года', budget: '3,3 млн ₽', accent: C.navy, split: 0.4,
      lists: [['Каналы', ['ORM', 'Paid Search']], ['Сегменты', ['Брендовые, транзакционные и запросы по симптомам']]] });
    cell(B, R1, { title: 'Не теряем сформированный спрос', budget: '5,6 млн ₽', accent: C.crimson, tint: true, split: 0.4,
      lists: [['Каналы', ['ORM', ['GEO|AEO', 'NEW'], 'Paid Search', ['Внешние публикации', 'NEW']]],
        ['Сегменты', ['Новички', 'Хроники', ['Лишай', 'NEW']]]] });
    cell(A, R2, { title: 'T&L comprehensive in media', period: 'Сентябрь–октябрь', budget: '2,1 млн ₽', accent: C.navy, split: 0.4,
      lists: [['Каналы', ['Programmatic']], ['Сегменты', ['Новички, страдающие грибком или лишаем', 'Хроник с грибком кожи стоп']]] });
    cell(B, R2, { title: 'Создаём новый consumer demand в сезонный пик', period: 'Март–сентябрь', budget: '11,5 млн ₽', accent: C.crimson, tint: true, split: 0.33,
      lists: [['Каналы', [['OLV', 'NEW'], ['Programmatic', 'REINFORCED'], ['Social', 'NEW']]],
        ['Сегменты', ['Новички, Хроники', ['Симптомы после отпуска', 'NEW'], ['Работа, связанная с длительным пребыванием в обуви', 'NEW'], ['Залы / бассейны / сауны', 'NEW']]]] });

    // ---- доп. косты ----
    s.pill('+ Production 300 тыс. ₽ | Adriver 300 тыс. ₽', { x: A.x, y: R3.y, w: A.w, h: R3.h, color: C.blue, caps: false, size: 20 });
    s.pill('+ Production 2 млн ₽ | Adriver 900 тыс. ₽', { x: B.x, y: R3.y, w: B.w, h: R3.h, color: C.blue, caps: false, size: 20 });

    // ---- приросты по слоям (расчёт OMD) ----
    const delta = (R, text, color) => {
      const mid = R.y + Math.round(R.h / 2);
      if (text) s.text(text, { x: G.x + 4, y: mid - 36, w: G.w - 8, size: 20, bold: true, lh: 1.0, color, align: 'center', fit: true, maxLines: 1, minSize: 15 });
      s.arrow({ dir: 'right', x: G.x + 18, y: mid + 4, len: G.w - 36, head: 24, headLen: 14, stem: 4, color });
    };
    delta(R1, '+2,3 млн ₽', C.crimson);
    delta(R2, '+9,4 млн ₽', C.crimson);
    delta(R3, '', C.blueText);

    s.footnote('*Бюджеты тотал представлены с учетом тех костов, АК, РС и продакшн. Приросты 2027 vs 2026 по слоям — расчёт OMD');
    s.notes('Слайд 16 исходника: матрица ALWAYS ON / SPRINT × 2026 / 2027. Скрытые надписи под метками слоёв исходника (SPRINT, FREQUENCY) не переносятся.');
  },

  // =====================================================================
  // 17 · Роль каналов: CREATE → CAPTURE → REASSURE → CONVERT (картинка → живой текст)
  // =====================================================================
  17: (d) => {
    const s = d.slide({
      title: 'Роль каналов: каждый слой отвечает за отдельный шаг к покупке',
      subtitle: 'Медиамикс строится не вокруг форматов,\nа вокруг задачи Create → Capture → Reassure → Convert',
    });
    const steps = [
      { k: 'CREATE', icon: 'tb:TbPlayerPlay', ch: 'OLV · Programmatic · Social', t: 'Сформировать релевантность категории и бренда до активного поиска' },
      { k: 'CAPTURE', icon: 'tb:TbSearch', ch: 'Paid Search', t: 'Перехватить симптомный, категорийный и брендовый спрос' },
      { k: 'REASSURE', icon: 'tb:TbShieldCheck', ch: 'ORM · GEO/AEO · внешние публикации', t: 'Дать доказательства выбора и снизить неопределённость' },
      { k: 'CONVERT', icon: 'tb:TbShoppingCart', ch: 'Retargeting · Search boost', t: 'Сократить путь до карточки товара и покупки в рамках промо-акций в пик сезона' },
    ];
    const GAP = 44;
    const W4 = Math.floor((X1 - X0 - GAP * 3) / 4);
    const PAD = 30;
    const iw = W4 - PAD * 2;
    const chH = Math.max(...steps.map((st) => measure(st.ch, iw, 30, true, 1.15)));
    const tH = Math.max(...steps.map((st) => measure(st.t, iw, 27, false, 1.25)));
    // свободную высоту карточки делим поровну между зазорами (иначе внизу карточек — пустая полоса)
    const g = Math.max(0, Math.floor((CB - 30 - (TOP + 30 + 64 + 40 + 110 + 40 + chH + 34 + 34 + tH)) / 4));
    const ICON_Y = TOP + 30 + 64 + 40 + g;
    const CH_Y = ICON_Y + 110 + 40 + g;     // строка каналов
    const LINE_Y = CH_Y + chH + 34 + g;
    steps.forEach((st, i) => {
      const x = X0 + i * (W4 + GAP);
      const col = STG[st.k];
      s.card({ x, y: TOP, w: W4, h: CB - TOP, fill: tintOf(col, 0.04), stroke: tintOf(col, 0.4) });
      s.pill(st.k, { x: x + PAD, y: TOP + 30, w: iw, h: 64, color: col, size: 28 });
      s.icon(st.icon, { x: x + PAD, y: ICON_Y, size: 110, circle: col });
      s.text(st.ch, { x: x + PAD, y: CH_Y, w: iw, size: 30, bold: true, lh: 1.15, color: C.navy });
      s.hline(x + PAD, LINE_Y, iw, tintOf(col, 0.45), 2);
      s.text(st.t, { x: x + PAD, y: LINE_Y + 34, w: iw, size: 27, lh: 1.25, color: C.navy });
      if (i < steps.length - 1) s.chevron({ cx: x + W4 + GAP / 2, cy: TOP + 30 + 32, w: 18, h: 28, color: C.crimson });
    });
    s.principle({ label: 'Принцип', icon: 'tb:TbChartBar',
      text: 'Верхняя часть воронки создаёт новый спрос, эффективность оцениваем по медиа и бизнес-сигналам: Search Lift, post-click, CR, Sales lift, продажи' });
    s.notes('Слайд 17 исходника: картинка-макет; все тексты перенесены живым текстом. Цвета этапов — общие для слайдов 16–17 и 24–25.');
  },

  // =====================================================================
  // 18 · Видео в стратегии Акримиколь: модульная персонализация (картинка → два слайда)
  // =====================================================================
  18: (d) => {
    // ---------- 18a: задачи видео + AI-мастер ----------
    {
      const s = d.slide({
        title: 'Видео в стратегии Акримиколь: модульная персонализация',
        subtitle: 'Один брендовый каркас и персонализированные первые секунды под ключевые ситуации и стадию проблемы',
      });
      const L = { x: X0, w: 884 };
      const R = { x: X0 + 884 + 24, w: X1 - X0 - 884 - 24 };
      const PAD = 34;
      const HY = TOP + 30;
      const BODY_Y = HY + 52 + 30;
      const BODY_H = BOT - 26 - BODY_Y;

      // левая карточка — задачи видео
      s.card({ x: L.x, y: TOP, w: L.w, h: BOT - TOP });
      iconHead(s, { x: L.x + PAD, y: HY, w: L.w - PAD * 2, icon: 'tb:TbPlayerPlay', text: 'Задачи, которые решает видео' });
      const tasks = [
        { icon: 'tb:TbChartBar', t: '**Формируем знание бренда** и попадаем в consideration list между периодами обострения' },
        { icon: 'tb:TbShield', t: '**Создаём образ современного,** понятного и надёжного решения при грибке кожи' },
        { icon: 'tb:TbMessageCircle', t: '**Помогаем простым языком объяснить значение симптомов** и снизить барьер начала лечения' },
        { icon: 'tb:TbUsers', t: '**Работаем на таргетированный охват и будущий выбор бренда,** пока поиск и баннеры перехватывают текущий спрос' },
      ];
      const ID = 72;
      const tw = L.w - PAD * 2 - ID - 24;
      const rows = (items, draw, X) => {
        const hs = items.map((it) => Math.max(ID, measure(it.t, tw, 26, false, 1.25)));
        const gap = Math.floor((BODY_H - hs.reduce((a, b) => a + b, 0)) / items.length);
        let y = BODY_Y + Math.round(gap / 2);
        items.forEach((it, i) => {
          if (i > 0) s.hline(X.x + PAD, y - Math.round(gap / 2), X.w - PAD * 2);
          draw(it, i, y, hs[i]);
          y += hs[i] + gap;
        });
      };
      rows(tasks, (it, i, y, h) => {
        s.icon(it.icon, { x: L.x + PAD, y: y + Math.round((h - ID) / 2), size: ID, circle: C.blue });
        s.text(it.t, { x: L.x + PAD + ID + 24, y: y + Math.round((h - measure(it.t, tw, 26, false, 1.25)) / 2), w: tw, size: 26, lh: 1.25, color: C.navy });
      }, L);

      // правая карточка — 1 AI-мастер с модульной персонализацией
      s.card({ x: R.x, y: TOP, w: R.w, h: BOT - TOP, tint: true });
      iconHead(s, { x: R.x + PAD, y: HY, w: R.w - PAD * 2, icon: 'tb:TbMovie', text: 'Используем 1 AI-мастер с модульной персонализацией', color: C.crimson });
      const master = [
        { t: '**Один брендовый каркас** (70–80% контента) для всех версий.' },
        { t: '**Персонализируем первые секунды** под ключевые ситуации и стадию проблемы.' },
        { t: 'Создаём **набор модулей** с помощью AI-продакшена без существенного увеличения бюджета.' },
        { t: '**Тестируем и масштабируем** наиболее эффективные версии по VTR / post-view / Search Lift.' },
      ];
      const twR = R.w - PAD * 2 - ID - 24;
      const hsR = master.map((it) => Math.max(ID, measure(it.t, twR, 26, false, 1.25)));
      const gapR = Math.floor((BODY_H - hsR.reduce((a, b) => a + b, 0)) / master.length);
      let y = BODY_Y + Math.round(gapR / 2);
      master.forEach((it, i) => {
        if (i > 0) s.hline(R.x + PAD, y - Math.round(gapR / 2), R.w - PAD * 2);
        s.badge({ x: R.x + PAD, y: y + Math.round((hsR[i] - ID) / 2), d: ID, n: i + 1, color: C.white, textColor: C.crimson, size: 30 });
        s.circle({ x: R.x + PAD, y: y + Math.round((hsR[i] - ID) / 2), d: ID, stroke: tintOf(C.crimson, 0.45), sw: 2 });
        s.text(it.t, { x: R.x + PAD + ID + 24, y: y + Math.round((hsR[i] - measure(it.t, twR, 26, false, 1.25)) / 2), w: twR, size: 26, lh: 1.25, color: C.navy });
        y += hsR[i] + gapR;
      });
      s.notes('Слайд 18 исходника (1 из 2): левая колонка картинки — задачи видео и принцип «1 AI-мастер». Продолжение — на следующем слайде.');
    }

    // ---------- 18b: как строим ролик — каркас, модули, микросцены, версии ----------
    {
      const s = d.slide({
        title: 'Как строим ролик: один мастер → персонализированные версии',
        subtitle: 'Видео в стратегии Акримиколь: модульная персонализация',
      });
      const LZ = { x: X0, w: 1420 };
      const RZ = { x: X0 + 1420 + 22, w: X1 - X0 - 1420 - 22 };
      const PAD = 24;
      const GAPV = 12;

      // --- A. Единый брендовый каркас ---
      const AY = TOP;
      const FG = 30;
      const FW = Math.floor((LZ.w - PAD * 2 - FG * 4) / 5);
      const FH = Math.round(FW / 2);
      const capH = 44;
      const AH = 16 + 28 + 12 + FH + 8 + capH + 10;
      s.card({ x: LZ.x, y: AY, w: LZ.w, h: AH });
      s.text('Единый брендовый каркас (70–80%)', { x: LZ.x + PAD, y: AY + 16, w: 900, size: 23, bold: true, lh: 1.0, color: C.navy });
      const FY = AY + 16 + 28 + 12;
      const frames = [
        { img: 'd_18_frame_symptoms.png', cap: 'Симптомы' },
        { img: 'd_18_frame_situation.png', cap: 'Узнаваемая ситуация' },
        { img: 'd_18_frame_product.png', cap: 'Акримиколь — современное решение' },
        { live: true, cap: 'Ключевые преимущества' },
        { img: 'd_18_frame_packshot.png', cap: 'Packshot / CTA' },
      ];
      frames.forEach((f, i) => {
        const x = LZ.x + PAD + i * (FW + FG);
        if (f.live) {
          s.box({ x, y: FY, w: FW, h: FH, fill: C.blue });
          const hh = s.text('5 действий против грибка кожи', { x: x + 12, y: FY + 9, w: FW - 24, size: 16, bold: true, lh: 1.1, color: C.white, fit: true, maxLines: 2, minSize: 14 });
          s.text('Устраняет грибок · Снимает зуд · Уменьшает воспаление · Способствует восстановлению кожи · Предотвращает повторение',
            { x: x + 12, y: FY + 9 + hh + 5, w: FW - 24, h: FH - hh - 22, size: 14, lh: 1.15, color: C.white, fit: true, minSize: 13 });
        } else {
          s.image(crop(f.img), { x, y: FY, w: FW, h: FH, alt: 'Кадр ролика Акримиколь: ' + f.cap });
        }
        s.text(f.cap, { x, y: FY + FH + 8, w: FW, size: 17, lh: 1.15, color: C.navy, align: 'center', fit: true, maxLines: 2, minSize: 15 });
        if (i < frames.length - 1) s.chevron({ cx: x + FW + FG / 2, cy: FY + FH / 2, w: 14, h: 22, color: C.crimson });
      });

      // --- C. Дополнительные микросцены (снизу, от низа зоны) ---
      const MG = 14;
      const MW = Math.floor((LZ.w - PAD * 2 - MG * 4) / 5);
      const MH = Math.round(MW / 2.15);
      const CH = 14 + 26 + 10 + MH + 6 + 22 + 12;
      const CY = BOT - CH;

      // --- B. Модульные первые секунды (между A и C) ---
      const BY = AY + AH + GAPV;
      const BH = CY - GAPV - BY;
      s.card({ x: LZ.x, y: BY, w: LZ.w, h: BH, fill: tintOf(C.crimson, 0.04), stroke: tintOf(C.crimson, 0.35) });
      s.text('[[**Модульные первые секунды (20–30%)**]] — адаптируем под ключевые сегменты и ситуации',
        { x: LZ.x + PAD, y: BY + 14, w: LZ.w - PAD * 2, size: 22, lh: 1.0, color: C.crimson, fit: true, maxLines: 1, minSize: 18 });
      const SG = 16;
      const SW = Math.floor((LZ.w - PAD * 2 - SG) / 2);
      const SY = BY + 14 + 22 + 12;
      const SH = BY + BH - 14 - SY;
      const segs = [
        { k: 'Новички', q: 'Первые симптомы:\n«Это может быть грибок?»', imgs: ['d_18_new_1.png', 'd_18_new_2.png', 'd_18_new_3.png'],
          caps: ['«Зуд? Шелушение? Трещинки?»', '«Зуд после бассейна?»', '«После отпуска или в бассейне?»'] },
        { k: 'Хроники', q: 'Рецидив:\n«Привычные симптомы снова вернулись?»', imgs: ['d_18_chr_1.png', 'd_18_chr_2.png', 'd_18_chr_3.png'],
          caps: ['«Снова те же симптомы?»', '«Мешает в спорте и повседневной жизни?»', '«Пробовали, но не помогло надолго?»'] },
      ];
      const P2 = 16;
      const PG = 12;
      const PW = Math.floor((SW - P2 * 2 - PG * 2) / 3);
      const PH = Math.round(PW / 1.8);
      segs.forEach((g, i) => {
        const x = LZ.x + PAD + i * (SW + SG);
        s.box({ x, y: SY, w: SW, h: SH, fill: C.white, stroke: tintOf(C.crimson, 0.3), sw: 1.5, r: 16 });
        const kw = widthOf(g.k.toUpperCase(), 24, true) + 8;
        s.text(g.k.toUpperCase(), { x: x + P2, y: SY + 14, w: kw, size: 24, bold: true, lh: 1.0, color: C.blue });
        s.text(g.q, { x: x + P2 + kw + 16, y: SY + 10, w: SW - P2 * 2 - kw - 16, size: 17, lh: 1.15, color: C.navy, fit: true, maxLines: 2, minSize: 15 });
        const py = SY + 10 + 42 + 10;
        g.imgs.forEach((f, k) => {
          const px = x + P2 + k * (PW + PG);
          s.image(crop(f), { x: px, y: py, w: PW, h: PH, alt: g.k + ': ' + g.caps[k] });
          s.text(g.caps[k], { x: px, y: py + PH + 8, w: PW, h: SY + SH - 8 - (py + PH + 8), size: 16, lh: 1.15, color: C.navy, align: 'center', fit: true, minSize: 14 });
        });
      });

      // --- C (отрисовка) ---
      s.card({ x: LZ.x, y: CY, w: LZ.w, h: CH });
      s.text('**Дополнительные микросцены** (при необходимости)', { x: LZ.x + PAD, y: CY + 14, w: 900, size: 22, lh: 1.0, color: C.navy });
      const micro = ['После отпуска', 'Бассейн / спорт', 'Активный образ жизни', 'Ранние симптомы', 'Рецидив'];
      micro.forEach((m, i) => {
        const x = LZ.x + PAD + i * (MW + MG);
        const y = CY + 14 + 26 + 10;
        s.image(crop(`d_18_micro_${i + 1}.png`), { x, y, w: MW, h: MH, alt: 'Микросцена: ' + m });
        s.text(m, { x, y: y + MH + 6, w: MW, size: 17, lh: 1.1, color: C.navy, align: 'center', fit: true, maxLines: 1, minSize: 14 });
      });

      // --- Примеры версий (правая колонка) ---
      s.card({ x: RZ.x, y: TOP, w: RZ.w, h: BOT - TOP, tint: true });
      const RP = 20;
      const rw = RZ.w - RP * 2;
      iconHead(s, { x: RZ.x + RP, y: TOP + 20, w: rw, icon: 'tb:TbList', text: 'Примеры версий', d: 44, size: 24 });
      const vers = [
        { k: 'Версия для новичков', img: 'd_18_ver_new.png', q: 'Зуд?\nШелушение?\nТрещинки?' },
        { k: 'Версия для хроников', img: 'd_18_ver_chr.png', q: 'Привычные симптомы снова вернулись?' },
      ];
      const VH = 236;
      const VLH = 30;
      const top0 = TOP + 20 + 44 + 30;
      const vgap = Math.floor((BOT - 24 - top0 - 2 * (VLH + 10 + VH)) / 2);
      vers.forEach((v, i) => {
        const y = top0 + i * (VLH + 10 + VH + vgap) + Math.round(vgap / 2);
        s.text(v.k, { x: RZ.x + RP, y, w: rw, size: 20, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 16 });
        const by = y + VLH + 10;
        s.box({ x: RZ.x + RP, y: by, w: rw, h: VH, fill: C.white, stroke: C.line, sw: 1.5, r: 14 });
        const pw = photoH(s, v.img, { x: RZ.x + RP, y: by, h: VH, alt: 'Превью: ' + v.k.toLowerCase() });
        const qx = RZ.x + RP + pw + 14;
        const qw = rw - pw - 14 - 12;
        s.text(v.q, { x: qx, y: by + 18, w: qw, h: VH - 18 - 70, size: 20, bold: true, lh: 1.15, color: C.navy, fit: true, minSize: 16 });
        s.icon('tb:TbPlayerPlayFilled', { x: RZ.x + RP + rw - 14 - 50, y: by + VH - 14 - 50, size: 50, circle: C.blue });
      });
      s.notes('Слайд 18 исходника (2 из 2): средняя и правая колонки картинки — брендовый каркас, модульные первые секунды, микросцены, примеры версий. Фото — вырезки из картинок исходника (crops/d_18_*.png); надпись на превью «Привычные симптомы снова верпулись?» исправлена на «вернулись» и вынесена живым текстом.');
    }
  },

  // =====================================================================
  // 19 · OLV работает двумя волнами (картинка → живой текст и живой график)
  // =====================================================================
  19: (d) => {
    const s = d.slide({
      title: 'OLV работает двумя волнами: строим знание до роста поискового спроса и обновляем контакт перед пиком спроса',
      subtitle: 'Концентрируем медиавес в апреле–июне и сохраняем поддержку в июле, чтобы обеспечить охват 60–70% ЦА в ядре продаж на частоте 5+',
    });
    const LC = { x: X0, w: 1140 };
    const RC = { x: LC.x + LC.w + 22, w: X1 - (LC.x + LC.w + 22) };
    const PAD = 28;
    const HD = 42;
    const R1 = { y: TOP, h: 378 };
    const R2 = { y: TOP + 378 + 16, h: BOT - (TOP + 378 + 16) };

    // ---- 1. Распределение OLV по месяцам ----
    s.card({ x: LC.x, y: R1.y, w: LC.w, h: R1.h });
    numHead(s, { x: LC.x + PAD, y: R1.y + 20, w: LC.w - PAD * 2, n: 1, text: 'Рекомендуемое распределение OLV в сезон (март–июль)' });
    const months = ['Март', 'Апрель', 'Май', 'Июнь', 'Июль'];
    const share = [10, 35, 15, 25, 15];   // правка Романа 22.10: апрель 35%, июнь 25% (сумма 100%)
    const wave = [false, true, false, true, false];
    const LBW = 190;
    const P = { x: LC.x + PAD + LBW, y: R1.y + 128, w: LC.w - PAD * 2 - LBW, h: 96 };
    const m = s.chart('col', [
      { name: 'Волны', labels: months, values: share.map((v, i) => (wave[i] ? v : 0)) },
      { name: 'Остальные месяцы', labels: months, values: share.map((v, i) => (wave[i] ? 0 : v)) },
    ], { x: P.x, y: P.y, w: P.w, h: P.h, plot: P, min: 0, max: 35, colors: [C.crimson, V.MUTED], legend: false, values: false, gap: 45, overlap: 100,
      extra: { catAxisHidden: true, catAxisLineShow: false } });
    share.forEach((v, i) => {
      s.text(`${v}%`, { x: m.cat(i) - 80, y: m.val(v) - 36, w: 160, size: 28, bold: true, lh: 1.0, color: wave[i] ? C.crimson : C.navy, align: 'center' });
      s.text(months[i], { x: m.cat(i) - 80, y: P.y + P.h + 10, w: 160, size: 20, bold: true, lh: 1.0, color: C.navy, align: 'center' });
    });
    s.hline(P.x, P.y + P.h, P.w, C.line, 1.5);
    const roles = ['Вход в сезон / priming', 'WAVE 1\nBuild', 'Пауза / снижение давления', 'WAVE 2\nBoost', 'Reminder в июле'];
    const TY = P.y + P.h + 44;
    const TH = 76;
    roles.forEach((r, i) => {
      const tw = Math.round(m.step - 16);
      const tx = Math.round(m.cat(i) - tw / 2);
      s.box({ x: tx, y: TY, w: tw, h: TH, fill: wave[i] ? tintOf(C.crimson, 0.08) : C.cardTint, stroke: wave[i] ? C.crimson : undefined, sw: 1.5, r: 12 });
      s.text(r, { x: tx + 8, y: TY + 4, w: tw - 16, h: TH - 8, size: wave[i] ? 19 : 17, bold: wave[i] || i === 4, lh: 1.1,
        color: wave[i] ? C.crimson : i === 4 ? C.blue : C.blueText, align: 'center', valign: 'middle', fit: true, minSize: 14 });
    });
    s.text('Доля OLV-бюджета', { x: LC.x + PAD, y: P.y + P.h - 44, w: LBW - 20, size: 17, lh: 1.15, color: C.blueText });
    s.text('Роль коммуникации', { x: LC.x + PAD, y: TY + 16, w: LBW - 20, size: 17, lh: 1.15, color: C.blueText });

    // ---- 2. Почему такая модель работает ----
    s.card({ x: RC.x, y: R1.y, w: RC.w, h: R1.h });
    const rw = RC.w - PAD * 2;
    numHead(s, { x: RC.x + PAD, y: R1.y + 20, w: rw, n: 2, text: 'Почему такая модель работает' });
    const why = [
      { icon: 'tb:TbChartBar', k: 'Концентрация в апреле–июне', t: 'Быстрее набираем охват и знание, чтобы стимулировать рост поискового спроса перед пиком категории' },
      { icon: 'tb:TbCalendar', k: 'Поддержка в июле', t: 'Сохраняем присутствие в момент максимального спроса и продаж' },
      { icon: 'tb:TbTrendingUp', k: 'Эффективная частота', t: 'Оптимизируем давление по неделям, избегаем избыточной частоты и повышаем качество контакта' },
    ];
    const WI = 48;
    const KW = 172;
    const WT = rw - WI - 14 - KW - 14;
    const wy0 = R1.y + 20 + HD + 14;
    const wh = Math.floor((R1.y + R1.h - 16 - wy0) / why.length);
    why.forEach((w, i) => {
      const y = wy0 + i * wh;
      if (i > 0) s.hline(RC.x + PAD, y, rw);
      const mid = y + wh / 2;
      s.icon(w.icon, { x: RC.x + PAD, y: Math.round(mid - WI / 2), size: WI, circle: C.blue });
      const kh = measure(w.k, KW, 18, true, 1.1);
      s.text(w.k, { x: RC.x + PAD + WI + 14, y: Math.round(mid - kh / 2), w: KW, size: 18, bold: true, lh: 1.1, color: C.navy });
      const th = measure(w.t, WT, 16, false, 1.2);
      s.text(w.t, { x: RC.x + PAD + WI + 14 + KW + 14, y: Math.round(mid - th / 2), w: WT, size: 16, lh: 1.2, color: C.blueText });
    });

    // ---- 3. От KPI к требуемому медиавесу ----
    s.card({ x: LC.x, y: R2.y, w: LC.w, h: R2.h });
    const iw = LC.w - PAD * 2;
    numHead(s, { x: LC.x + PAD, y: R2.y + 20, w: iw, n: 3, text: 'От KPI к требуемому медиавесу' });
    s.text('Для выхода на **Effective Reach 5+ ~70%** при **Universe 2,95 млн** в географии ядра продаж требуется **~10,3 млн показов**, что при **~320 CPM** требует инвестиций в **3,3 млн рублей**.',
      { x: LC.x + PAD, y: R2.y + 20 + HD + 16, w: iw, size: 19, lh: 1.25, color: C.navy });
    const CHH = 150;
    chain(s, [
      { v: '≈2,95 млн*', t: '25–55 с проблемами заболеваниями кожи' },
      { v: '70%', t: 'Effective Reach 5+', accent: 'soft' },
      { v: '2,07 млн', t: 'ЦА в контакте 5+' },
      { v: '≈10,3 млн', t: 'impressions' },
      { v: '3,3 млн ₽', t: 'инвестиции', accent: 'main' },
    ], { x: LC.x + PAD, y: R2.y + R2.h - 26 - CHH, w: iw, h: CHH });

    // ---- 4. Что получает бренд ----
    s.card({ x: RC.x, y: R2.y, w: RC.w, h: R2.h });
    numHead(s, { x: RC.x + PAD, y: R2.y + 20, w: rw, n: 4, text: 'Что получает бренд' });
    gets(s, [
      { k: 'SCALE', t: '**70% ядра ЦА** в целевой географии (ядро продаж) на эффективной частоте', color: C.blue },
      { k: 'RELEVANCE', t: 'precise AI targeting (clusters/signals) + In-stream inventory + AI video production with personalization', color: C.crimson },
      { k: 'PROOF', t: 'BLS + VTR / completed views\n+ Brand Search / post-view', color: C.navy },
    ], { x: RC.x + PAD, y: R2.y + 20 + HD + 14, w: rw, h: R2.h - 20 - HD - 14 - 20 });

    s.footnote('* Расчетная оценка OMD: население М/Ж 25–55 РФ × оценочная распространенность дерматофитий × корректировка на симптомное/актуальное состояние\n36,9% — доля географии ядра продаж внутри РФ',
      { w: 1700, size: 13 });
    s.notes('Слайд 19 исходника: картинка-макет; все тексты перенесены живым текстом, распределение OLV по месяцам — живым графиком. Звёздочка сноски в исходнике не стоит ни у одной цифры — поставлена у Universe (≈2,95 млн), к которому относится расчёт.');
  },

  // =====================================================================
  // 20 · Календарь баннерной коммуникации (картинка → гант + примеры сообщений)
  // =====================================================================
  20: (d) => {
    const s = d.slide({ title: 'Календарь баннерной коммуникации: сегменты и оккейжены' });
    // ---- гант ----
    const GL = { x: X0, w: 900 };
    const LABW = 284;   // «После отпуска / отеля» — в одну строку
    const MX = GL.x + LABW;
    const MSTEP = (GL.w - LABW) / 7;
    const months = ['Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен'];
    const HH = 56;
    s.card({ x: GL.x, y: TOP, w: GL.w, h: BOT - TOP });
    s.box({ x: GL.x, y: TOP, w: GL.w, h: HH, fill: C.navy, r: 20 });
    s.box({ x: GL.x, y: TOP + HH - 20, w: GL.w, h: 20, fill: C.navy, r: 0 });
    s.text('Сегмент / оккейжен', { x: GL.x + 24, y: TOP, w: LABW - 30, h: HH, size: 19, bold: true, lh: 1.0, color: C.white, valign: 'middle', fit: true, maxLines: 1, minSize: 15 });
    months.forEach((mm, i) => {
      s.text(mm, { x: MX + i * MSTEP, y: TOP, w: MSTEP, h: HH, size: 19, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
      s.vline(MX + i * MSTEP, TOP + 12, HH - 24, tintOf(C.white, 0.35), 1);
    });
    const rows = [
      { seg: 'Новички', occ: 'Не просто сухость', icon: 'tb:TbDroplet', light: [0, 6], dark: [2, 4] },
      { seg: 'Оба сегмента', occ: 'Весь день в закрытой обуви', icon: 'tb:TbShoe', light: [0, 6], dark: [2, 5] },
      { seg: 'Оба сегмента', occ: 'Бассейны / сауны / спортзалы', icon: 'tb:TbSwimming', light: [0, 6], dark: [2, 5] },
      { seg: 'Новички', occ: 'После отпуска / отеля', icon: 'tb:TbLuggage', light: [3, 6], dark: [4, 6] },
      { seg: 'Хроники', occ: 'Грибок возвращается', icon: 'tb:TbRotate', light: [0, 6], dark: [2, 4] },
      { seg: 'Хроники', occ: 'Привычное средство не справилось', icon: 'tb:TbShieldCheck', light: [0, 6], dark: [2, 4] },
    ];
    const RY0 = TOP + HH;
    const RH = (BOT - RY0) / rows.length;
    for (let i = 1; i < 7; i++) s.seg(MX + i * MSTEP, RY0 + 8, MX + i * MSTEP, BOT - 10, { color: C.line, width: 1, dash: 'dash' });
    s.vline(MX, RY0, BOT - RY0, C.line, 1.5);
    const SEGC = { 'Новички': C.cyan, 'Хроники': C.purple, 'Оба сегмента': C.blue };
    rows.forEach((r, i) => {
      const y = Math.round(RY0 + i * RH);
      if (i > 0) s.hline(GL.x + 12, y, GL.w - 24);
      const mid = y + RH / 2;
      const ID = 54;
      s.icon(r.icon, { x: GL.x + 20, y: Math.round(mid - ID / 2), size: ID, circle: tintOf(SEGC[r.seg], 0.14), color: SEGC[r.seg] === C.cyan ? C.teal : SEGC[r.seg] });
      const tx = GL.x + 20 + ID + 14;
      const tw = LABW - (tx - GL.x) - 10;
      const oh = measure(r.occ, tw, 17, false, 1.15);
      const blockH = 22 + 6 + oh;
      const ty = Math.round(mid - blockH / 2);
      s.text(r.seg, { x: tx, y: ty, w: tw, size: 20, bold: true, lh: 1.0, color: SEGC[r.seg] === C.cyan ? C.teal : SEGC[r.seg], fit: true, maxLines: 1, minSize: 16 });
      s.text(r.occ, { x: tx, y: ty + 28, w: tw, size: 17, lh: 1.15, color: C.navy });
      const bar = ([a, b], fill) => {
        const bx = MX + a * MSTEP + 6;
        const bw = (b - a + 1) * MSTEP - 12;
        s.box({ x: bx, y: Math.round(mid - 14), w: bw, h: 28, fill, r: 14 });
      };
      bar(r.light, tintOf(C.blue, 0.22));
      bar(r.dark, C.blue);
    });

    // ---- примеры баннерных сообщений ----
    const EX = { x: GL.x + GL.w + 24, w: X1 - (GL.x + GL.w + 24) };
    s.text('Примеры баннерных сообщений', { x: EX.x, y: TOP + 6, w: EX.w, size: 28, bold: true, lh: 1.0, color: C.navy });
    const ex = [
      { img: 'd_20_b1.png', t: 'Не просто сухость', b: 'Шелушение, зуд и дискомфорт между пальцами могут быть признаками грибка кожи. Акримиколь помогает вовремя взять ситуацию под контроль.' },
      { img: 'd_20_b2.png', t: 'Весь день в закрытой обуви', b: 'Когда ноги весь день в закрытой обуви, важно не игнорировать зуд и раздражение. Акримиколь помогает вернуть коже комфорт.' },
      { img: 'd_20_b3.png', t: 'Бассейны / сауны / спортзалы', b: 'После бассейна или душевой важно не игнорировать дискомфорт кожи. Акримиколь помогает быстро перейти от неприятных ощущений к контролю.' },
      { img: 'd_20_b4.png', t: 'После отпуска / отеля', b: 'После поездки кожа стоп может напомнить о себе зудом и шелушением. Акримиколь помогает быстро перейти от дискомфорта к контролю.' },
      { img: 'd_20_b5.png', t: 'Грибок возвращается', b: 'Если симптомы возвращаются, не откладывайте лечение. Акримиколь помогает снова взять грибок кожи под контроль.' },
      { img: 'd_20_b6.png', t: 'Привычное средство не справилось', b: 'Если прошлое средство не дало нужного результата, стоит выбрать понятное современное решение. Акримиколь помогает бороться с грибком кожи.' },
    ];
    const EY = TOP + 56;
    const EG = 14;
    const EW = Math.floor((EX.w - EG) / 2);
    const EH = Math.floor((BOT - EY - EG * 2) / 3);
    const IP = 10;
    ex.forEach((e, i) => {
      const x = EX.x + (i % 2) * (EW + EG);
      const y = EY + Math.floor(i / 2) * (EH + EG);
      s.card({ x, y, w: EW, h: EH, r: 18 });
      const pw = photoH(s, e.img, { x: x + IP, y: y + IP, h: EH - IP * 2, alt: 'Пример баннера: ' + e.t });
      const tx = x + IP + pw + 18;
      const tw = EW - (tx - x) - 16;
      const th = s.text(e.t, { x: tx, y: y + 18, w: tw, size: 20, bold: true, lh: 1.1, color: C.blue });
      s.text(e.b, { x: tx, y: y + 18 + th + 8, w: tw, h: EH - 18 - th - 8 - 12, size: 17, lh: 1.2, color: C.navy, fit: true, minSize: 15 });
    });
    s.notes('Слайд 20 исходника: картинка-макет; гант и тексты — живые, фото примеров — вырезки (crops/d_20_*.png). Светлые и тёмные полосы перенесены как в исходнике (легенды к ним в исходнике нет).');
  },
};
