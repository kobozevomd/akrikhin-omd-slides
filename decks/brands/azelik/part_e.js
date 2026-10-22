// Азелик · стратегия 2027 — часть E: слайды исходника 31–38.
// 31 — сезонность в категории (живой линейный график из slide-31.json + 3 вывода);
// 32 — флайтинг 2027: матрица по месяцам (период и формат / сегменты / роль / события);
// 33 — выбор каналов: этап роста → каналы → роль (цвета этапов — как метки A.STAGE на 40–56);
// 34 — Азелик и Клиндовит: различия в сегментах и потребностях; 35 — синергия без каннибализации;
// 36 — бренд-сайты 2027 (мокапы сайтов — схемой живыми фигурами); 37 — обучающие AI-видео;
// 38 — AI visibility + e-com. Цвета брендов на 34–38: Азелик — синий, Клиндовит — малиновый.
const path = require('path');
const { C, columns, countLines, textWidth, typo, tr, chartMap, IN } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT, GRID, legend, yearAxis
const A = require('./common');                            // SRC, STAGE

const TOP = V.TOP;   // 221 — верх контента
const BOT = V.BOT;   // 1005 — низ контента без плашки
const CB = 905;      // низ контента над плашкой
const X0 = 58;
const X1 = 1862;
const AZ = C.blue;       // Азелик
const CL = C.crimson;    // Клиндовит

// ---------- Локальные хелперы ----------
// Строка так, как её увидит слайд (перевод + типографика), без разметки
const view = (t) => typo(tr(String(t))).replace(/\*\*|\[\[|\]\]/g, '');
// Высота текста так же, как её оценивает s.text
const measure = (t, w, size = 18, bold = false, lh = 1.2) => Math.round(countLines(view(t), size, w, bold) * size * lh);
const widthOf = (t, size, bold = false) => Math.ceil(textWidth(view(t), size, bold));
// Ширина блока, при которой текст занимает столько же строк, но строки ровнее — без висящего последнего слова
const evenW = (t, w, size, bold = false, caps = false) => {
  const v = caps ? view(t).toUpperCase() : view(t);
  const lines = (ww) => countLines(v, size, ww, bold);
  const n = lines(w);
  if (n < 2) return w;
  let lo = w * 0.4;
  let hi = w;
  while (hi - lo > 1) { const m = (lo + hi) / 2; if (lines(m) <= n) hi = m; else lo = m; }
  return Math.min(w, Math.ceil(hi) + 4);
};
// Сколько слов окажется в последней строке (тот же жадный перенос, что в countLines)
const lastWords = (t, size, w, bold = false) => {
  const max = w * 0.97;
  const sp = textWidth(' ', size, bold);
  let cur = 0;
  let n = 0;
  view(t).split(/\n\n?/).pop().split(' ').forEach((word) => {
    if (!word) return;
    const ww = textWidth(word, size, bold);
    if (cur === 0) { cur = ww; n = 1; } else if (cur + sp + ww <= max) { cur += sp + ww; n += 1; } else { cur = ww; n = 1; }
    while (cur > max) cur -= max;
  });
  return n;
};
// Ширина без висящего слова: сужаем блок, только если последняя строка — одно слово
const noWidow = (t, w, size, bold = false) =>
  (countLines(view(t), size, w, bold) > 1 && lastWords(t, size, w, bold) === 1 ? evenW(t, w, size, bold) : w);

// Возраст в конце строки («Подростки 12–18») не рвём по тире: если строка не влезает — переносим перед возрастом
const ageBreak = (t, w, size, bold = false) => {
  const v = typo(tr(String(t)));
  if (v.includes('\n') || countLines(v.replace(/\*\*|\[\[|\]\]/g, ''), size, w, bold) <= 1) return t;
  return v.replace(/[ \u00a0](?=\d+–\d+$)/, '\n');
};

// Смешение цвета с белым: k = 0 — белый, 1 — исходный цвет
function tintOf(hex, k) {
  const c = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return c.map((v) => Math.round(255 + (v - 255) * k).toString(16).padStart(2, '0')).join('').toUpperCase();
}

// Мини-упаковка бренда (схема вместо мокапа исходника): название + полоса с действующим веществом
function pack(s, { x, y, w = 210, h = 74, brand }) {
  const az = brand === 'az';
  s.box({ x, y, w, h, fill: C.white, stroke: C.line, sw: 2, r: 10 });
  s.text(az ? 'Азелик' : 'Клиндовит', { x: x + 14, y: y + 10, w: w - 28, h: 22, size: 18, bold: true, lh: 1.0, color: C.navy,
    fit: true, maxLines: 1, minSize: 14 });
  s.box({ x: x + 10, y: y + h - 34, w: w - 20, h: 24, fill: az ? AZ : CL, r: 6 });
  s.text(az ? 'азелаиновая кислота 15%' : 'клиндамицин 1%', { x: x + 18, y: y + h - 34, w: w - 36, h: 24, size: 14, bold: true, lh: 1.0,
    color: C.white, valign: 'middle', fit: true, maxLines: 1, minSize: 13 });
}

// Иконка в цветном кружке + жирный заголовок + пояснение справа; возвращает высоту
function iconRow(s, { x, y, w, icon, color, title, text, d = 44, gap = 16, tSize = 19, bSize = 17, titleColor = C.navy }) {
  s.icon(icon, { x, y, size: d, circle: color });
  const tx = x + d + gap;
  const tw = w - d - gap;
  let h = 0;
  if (title) h += s.text(title, { x: tx, y: y + 1, w: tw, size: tSize, bold: true, lh: 1.15, color: titleColor });
  if (text) h += (title ? 6 : 0) + s.text(text, { x: tx, y: y + 1 + h + (title ? 6 : 0), w: tw, size: bSize, lh: 1.2, color: C.blueText });
  return Math.max(d, h);
}

module.exports = {
  // =====================================================================
  // 31 · Сезонность в категории
  // =====================================================================
  31: (d) => {
    const s = d.slide({ title: 'Сезонность в категории' });
    const j = require(path.join(A.SRC, 'slide-31.json'));
    const plot = j.shapes.find((sh) => sh.t === 'CHART').chart.plots[0];
    // даты Excel: 45658 = 01.01.2025 … 46204 = 01.07.2026 — 19 месяцев
    const dates = plot.cats.map((n) => new Date(Date.UTC(1899, 11, 30) + Number(n) * 86400000));
    const cats = dates.map((dt) => `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}`);
    const MON = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    const [Q, AZS, SKS] = plot.series;   // запросы «акне», продажи Азелик, продажи Скиноклир
    const N = cats.length;
    // цвета брендов — как на слайдах 11, 13, 14 и 34–38: Азелик синий, Скиноклир малиновый
    const COL = { q: C.cyan, az: C.blue, sk: C.crimson };

    // карточка графика
    const CARD = { x: X0, y: TOP, w: 1330, h: BOT - TOP };
    s.card(CARD);
    V.legend(s, 94, 252, [[COL.q, Q.name], [COL.az, AZS.name], [COL.sk, SKS.name]], { dir: 'row', gap: 410, size: 17 });

    const P = { x: 150, y: 345, w: 1110, h: 540 };
    const lo = 55;
    const hi = 135;
    const m = chartMap('line', N, P, lo, hi);
    // сезонные окна: весна (мар–май) и лето (июн–авг), в 2026 — до июля (конец данных)
    const SPRING = tintOf(C.green, 0.12);
    const SUMMER = tintOf(C.orange, 0.13);
    const band = (i0, i1, fill, label, color) => {
      const xa = m.cat(i0) - m.step / 2;
      const xb = m.cat(i1) + m.step / 2;
      s.box({ x: xa, y: P.y - 40, w: xb - xa, h: P.h + 40, fill, r: 0 });
      s.text(label, { x: xa + 8, y: P.y - 32, w: xb - xa - 12, size: 15, bold: true, lh: 1.0, color, caps: true });
    };
    band(2, 4, SPRING, 'весна', C.green);
    band(5, 7, SUMMER, 'лето', C.orange);
    band(14, 16, SPRING, 'весна', C.green);
    band(17, 18, SUMMER, 'лето', C.orange);
    // сетка и подписи шкалы
    [60, 80, 100, 120].forEach((v) => {
      s.seg(P.x, m.val(v), P.x + P.w, m.val(v), { color: V.GRID, width: 1.25 });
      s.text(String(v), { x: P.x - 64, y: m.val(v) - 10, w: 52, size: 15, color: C.blueText, align: 'right' });
    });
    const common = { x: P.x - 20, y: P.y - 20, w: P.w + 40, h: P.h + 40, plot: P, min: lo, max: hi, values: false, legend: false,
      symbol: 'none', extra: { catAxisHidden: true, catAxisLineShow: false } };
    s.chart('line', [
      { name: Q.name, labels: cats, values: Q.values },
      { name: SKS.name, labels: cats, values: SKS.values },
    ], { ...common, colors: [COL.q, COL.sk], lineSize: 2.75 });
    s.chart('line', [{ name: AZS.name, labels: cats, values: AZS.values }], { ...common, colors: [COL.az], lineSize: 4 });

    // ось месяцев и годы
    s.seg(P.x, P.y + P.h, P.x + P.w, P.y + P.h, { color: C.line, width: 1.5 });
    dates.forEach((dt, i) => s.text(MON[dt.getUTCMonth()], { x: m.cat(i) - 30, y: P.y + P.h + 10, w: 60, size: 15, color: C.blueText, align: 'center' }));
    V.yearAxis(s, m, [['2025', 12], ['2026', 7]], P.y + P.h + 40, { size: 17 });

    // точки и значения: пик запросов, пик продаж, конец ряда
    const dot = (i, v, col, label, pos = 'up') => {
      const x = m.cat(i);
      const y = m.val(v);
      s.circle({ x: x - 7, y: y - 7, d: 14, fill: col, stroke: C.white, sw: 2 });
      if (pos === 'right') s.text(label, { x: x + 12, y: y - 13, w: 70, size: 21, bold: true, lh: 1.0, color: col });
      else s.text(label, { x: x - 40, y: pos === 'up' ? y - 34 : y + 10, w: 80, size: 19, bold: true, lh: 1.0, color: col, align: 'center' });
    };
    const peak = (vals) => vals.indexOf(Math.max(...vals.slice(0, 12)));
    const qi = peak(Q.values);   // май 2025
    const si = peak(SKS.values); // август 2025
    dot(qi, Q.values[qi], COL.q, String(Q.values[qi]));
    dot(si, SKS.values[si], COL.sk, String(SKS.values[si]));
    dot(N - 1, AZS.values[N - 1], COL.az, String(AZS.values[N - 1]), 'right');
    dot(N - 1, SKS.values[N - 1], COL.sk, String(SKS.values[N - 1]), 'right');
    dot(N - 1, Q.values[N - 1], COL.q, String(Q.values[N - 1]), 'right');

    // три вывода справа: цвет иконки = цвет окна на графике
    const RX = 1410;
    const RW = X1 - RX;
    const gap = 18;
    const ch = Math.floor((BOT - TOP - gap * 2) / 3);
    const ins = [
      { icon: 'tb:TbPlant', color: C.green, title: 'Весенний рост интереса к категории',
        text: 'Запросы растут раньше продаж → формируется **окно для усиления медиа**' },
      { icon: 'tb:TbSun', color: C.orange, title: 'Летом усиливаются продажи категории',
        text: 'Летний период является **ключевым окном потребления**' },
      { icon: 'tb:TbSwords', color: C.crimson, title: 'Конкурентное давление усиливается в период пикового спроса',
        text: 'При росте спроса усиливается **борьба за пользователей категории**' },
    ];
    ins.forEach((it, k) => {
      const y = TOP + k * (ch + gap);
      s.card({ x: RX, y, w: RW, h: ch });
      s.icon(it.icon, { x: RX + 26, y: y + 26, size: 56, circle: it.color });
      const tw = RW - 26 * 2 - 56 - 16;
      const th = s.text(it.title, { x: RX + 26 + 56 + 16, y: y + 26, w: tw, size: 22, bold: true, lh: 1.15, color: C.navy });
      const by = y + 26 + Math.max(56, th) + 16;
      s.text(it.text, { x: RX + 26, y: by, w: RW - 52, h: y + ch - 18 - by, size: 20, lh: 1.25, color: C.blueText, fit: true, minSize: 16 });
    });
  },

  // =====================================================================
  // 32 · Флайтинг 2027: периоды, сегменты и роль коммуникации
  // =====================================================================
  32: (d) => {
    const s = d.slide({ title: 'Флайтинг 2027: периоды, сегменты и роль коммуникации' });
    const LW = 150;                     // колонка названий строк
    const GX = X0 + LW + 14;            // начало сетки месяцев
    const MW = (X1 - GX) / 12;          // ширина месяца
    const mx = (mo) => GX + mo * MW;    // mo — месяцы от 1 января
    const CG = 4;                       // половина зазора между ячейками
    const PAD = 14;
    const MONTHS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

    const AON = [
      { icon: 'tb:TbUsers', text: 'Все 18–40 акне, постакне' },
      { icon: 'tb:TbBackpack', text: 'Подростки 12–18' },
    ];
    const SPRINT = [
      { icon: 'tb:TbSparkles', text: 'Ж 18–34 пробуют новые средства' },
      { icon: 'tb:TbHeart', text: 'Social girl 18–34' },
      { icon: 'tb:TbArrowsExchange', text: 'Skinoclear 18–34 негативный опыт' },
      { icon: 'tb:TbUser', text: 'М 18–34 с проблемной кожей' },
    ];
    const NEW = { head: 'NEW — пилотный запуск', items: ['Ж 40+ акне, предменопауза', '+ Ж 18–34 чувствительная кожа'] };
    // границы периодов — как в исходнике: середина февраля, мая, июля и октября
    const PER = [
      { m0: 0, m1: 1.5, when: 'Январь – февраль', fmt: 'Always-on: подготовка спроса', role: 'Формирование потребности',
        ev: { icon: 'tb:TbSnowflake', title: 'Новый год и новые привычки', text: 'Забота о себе, планирование ухода в новом году' } },
      { m0: 1.5, m1: 4.5, sprint: true, when: '2-я пол. февраля – май', fmt: 'Sprint 1 + AON', role: 'Конкурентная защита',
        ev: { icon: 'tb:TbConfetti', title: 'Подготовка к важным событиям', text: 'Весна, выпускные, лето, сезон активности внешности' } },
      { m0: 4.5, m1: 6.5, when: 'Май – июль', fmt: 'Поддержка', role: 'Поддержание знания и напоминание',
        ev: { icon: 'tb:TbSun', title: 'Летний сезон', text: 'Отпуск, путешествия, фотографии, активная социальная жизнь' } },
      { m0: 6.5, m1: 9.5, sprint: true, when: '2-я пол. июля – 1-я пол. октября', fmt: 'Sprint 2 + AON',
        role: 'Возврат внимания, рост применения, конкурентная защита',
        ev: { icon: 'tb:TbSchool', title: 'Back to School / начало учебного года',
          text: 'Возвращение в школу/университет, желание выглядеть уверенно, усиление внимания к внешности' } },
      { m0: 9.5, m1: 12, when: 'Ноябрь – декабрь', fmt: 'AON', role: 'Закрепление регулярного использования',
        ev: { icon: 'tb:TbChristmasTree', title: 'Конец года', text: 'Подведение итогов, закрепление результата, поддержка регулярного ухода' } },
    ];
    const cellX = (p) => mx(p.m0) + CG;
    const cellW = (p) => (p.m1 - p.m0) * MW - CG * 2;
    const SPR_FILL = tintOf(C.crimson, 0.07);
    const SPR_LINE = tintOf(C.crimson, 0.35);
    const cellBox = (p, y, h) => s.box({ x: cellX(p), y, w: cellW(p), h, fill: p.sprint ? SPR_FILL : C.cardTint,
      stroke: p.sprint ? SPR_LINE : C.line, sw: 1.5, r: 14 });

    // шапка месяцев
    const HH = 40;
    MONTHS.forEach((mo, i) => {
      s.box({ x: mx(i) + CG, y: TOP, w: MW - CG * 2, h: HH, fill: C.tint, r: 10 });
      s.text(mo, { x: mx(i) + CG, y: TOP, w: MW - CG * 2, h: HH, size: 18, bold: true, lh: 1.0, color: C.navy, align: 'center', valign: 'middle' });
    });

    // высоты строк — по содержимому
    const SEG_IC = 30;
    const SEG_FS = 17;
    const segTW = (p) => cellW(p) - PAD * 2 - SEG_IC - 10;
    const segList = (p) => (p.sprint ? SPRINT : AON);
    const segH = (p) => {
      let h = segList(p).reduce((a, it) => a + Math.max(SEG_IC, measure(ageBreak(it.text, segTW(p), SEG_FS), segTW(p), SEG_FS)) + 12, -12);
      if (p.sprint) h += 16 + 12 + measure(NEW.head, cellW(p) - PAD * 2 - 24, 16, true) + 6
        + NEW.items.reduce((a, t) => a + measure(t, cellW(p) - PAD * 2 - 24, 16), 0) + 12;
      return h + PAD * 2;
    };
    const roleH = (p) => measure(p.role, cellW(p) - PAD * 2, 18, true, 1.15) + PAD * 2;
    const R = [];
    let y = TOP + HH + 10;
    const PH = 110;
    R.push({ name: 'Период и формат', y, h: PH });
    y += PH + 10;
    const sh = Math.max(...PER.map(segH));
    R.push({ name: 'Сегменты', y, h: sh });
    y += sh + 10;
    const rh = Math.max(76, ...PER.map(roleH));
    R.push({ name: 'Роль', y, h: rh });
    y += rh + 10;
    R.push({ name: 'События', y, h: BOT - y });
    R.forEach((r) => {
      s.box({ x: X0, y: r.y, w: LW, h: r.h, fill: C.navy, r: 14 });
      s.text(r.name.toUpperCase(), { x: X0 + 10, y: r.y, w: LW - 20, h: r.h, size: 17, bold: true, lh: 1.1, color: C.white,
        align: 'center', valign: 'middle', fit: true, minSize: 14 });
    });

    PER.forEach((p) => {
      const x = cellX(p);
      const w = cellW(p);
      const tw = w - PAD * 2;
      // период и формат: спринты — малиновые, always-on / поддержка — светлые
      const [rp, rs, rr, re] = R;
      if (p.sprint) s.box({ x, y: rp.y, w, h: rp.h, fill: C.crimson, r: 14 });
      else cellBox(p, rp.y, rp.h);
      const wh = s.text(p.when, { x: x + PAD, y: rp.y + 14, w: tw, size: 18, bold: true, lh: 1.1, color: p.sprint ? C.white : C.navy });
      s.text(p.fmt, { x: x + PAD, y: rp.y + 14 + wh + 6, w: tw, h: rp.h - 14 - wh - 6 - 8, size: p.sprint ? 20 : 17, bold: p.sprint, lh: 1.1,
        color: p.sprint ? C.white : C.blue, fit: true, minSize: 14 });

      // сегменты
      cellBox(p, rs.y, rs.h);
      let yy = rs.y + PAD;
      segList(p).forEach((it) => {
        s.icon(it.icon, { x: x + PAD, y: yy, size: SEG_IC, circle: p.sprint ? C.crimson : C.blue });
        const t = ageBreak(it.text, segTW(p), SEG_FS);
        const h = s.text(t, { x: x + PAD + SEG_IC + 10, y: yy + (measure(t, segTW(p), SEG_FS) <= 21 ? 4 : 0), w: segTW(p),
          size: SEG_FS, lh: 1.2, color: C.navy });
        yy += Math.max(SEG_IC, h) + 12;
      });
      if (p.sprint) {
        // новые пилотные сегменты
        const ny = yy + 4;
        const nh = rs.y + rs.h - PAD - ny;
        s.box({ x: x + PAD, y: ny, w: tw, h: nh, fill: C.white, stroke: C.crimson, sw: 2, r: 12 });
        const hh = s.text(NEW.head, { x: x + PAD + 12, y: ny + 10, w: tw - 24, size: 16, bold: true, lh: 1.2, color: C.crimson });
        s.text(NEW.items.join('\n'), { x: x + PAD + 12, y: ny + 10 + hh + 4, w: tw - 24, size: 16, lh: 1.25, color: C.navy });
      }

      // роль
      cellBox(p, rr.y, rr.h);
      s.text(p.role, { x: x + PAD, y: rr.y, w: tw, h: rr.h, size: 18, bold: true, lh: 1.15, color: C.navy, valign: 'middle' });

      // события
      s.box({ x, y: re.y, w, h: re.h, fill: C.card, stroke: C.line, sw: 1.5, r: 14 });
      s.icon(p.ev.icon, { x: x + PAD, y: re.y + PAD, size: 40, circle: p.sprint ? C.crimson : C.blue });
      const th = s.text(p.ev.title, { x: x + PAD, y: re.y + PAD + 40 + 10, w: tw, size: 19, bold: true, lh: 1.15, color: C.navy });
      s.text(p.ev.text, { x: x + PAD, y: re.y + PAD + 40 + 10 + th + 6, w: noWidow(p.ev.text, tw, 17), h: re.y + re.h - (re.y + PAD + 40 + 10 + th + 6) - 8,
        size: 17, lh: 1.2, color: C.blueText, fit: true, minSize: 15 });
    });
  },

  // =====================================================================
  // 33 · Выбор каналов для поддержки
  // =====================================================================
  33: (d) => {
    const s = d.slide({ title: 'Выбор каналов для поддержки' });
    const SW = 470;                 // этап роста
    const CX = X0 + SW + 50;        // карточка строки: каналы | роль
    const CHW = 560;                // каналы
    const RX = CX + CHW + 40;       // роль
    const RW = X1 - RX - 30;
    const HP = 52;
    s.pill('Этап роста', { x: X0, y: TOP, w: SW, h: HP });
    s.pill('Каналы', { x: CX, y: TOP, w: RX - 20 - 8 - CX, h: HP });
    s.pill('Роль в стратегии', { x: RX - 20 + 8, y: TOP, w: X1 - RX + 12, h: HP });
    const rows = [
      { stage: 'Expand the category', color: A.STAGE.EXPAND, icon: 'tb:TbUsersPlus', sub: 'Привлекаем новых пользователей в категорию',
        ch: ['OLV', 'DOOH', 'Programmatic', 'Native', 'GEO', 'ORM', 'Спецпроекты'],
        role: 'Расширяем охват за пределы текущих digital-аудиторий, формируем знание о проблеме акне и создаём **новые входы в категорию**' },
      { stage: 'Win the competition', color: A.STAGE.SPRINT, icon: 'tb:TbTrophy', sub: 'Перехватываем пользователей у конкурентов',
        ch: ['Блогеры', 'CTV', 'OLV', 'Programmatic', 'Search'],
        role: 'Усиливаем переключение с альтернативных решений, объясняем преимущества Азелика и помогаем **выбрать бренд вместо конкурентов**' },
      { stage: 'Grow frequency', color: A.STAGE.FREQUENCY, icon: 'tb:TbRepeat', sub: 'Формируем регулярное использование',
        ch: ['Native', 'Retargeting', 'OFD data', 'Search'],
        role: 'Дообучаем пользователей, поддерживаем сценарий длительного контроля акне и повышаем **вероятность повторного применения**' },
    ];
    const y0 = TOP + HP + 18;
    const gap = 18;
    const rh = Math.floor((BOT - y0 - gap * 2) / 3);
    rows.forEach((r, k) => {
      const y = y0 + k * (rh + gap);
      // этап роста — цветная плитка
      s.box({ x: X0, y, w: SW, h: rh, fill: r.color, r: 20 });
      s.icon(r.icon, { x: X0 + 28, y: y + 24, size: 60, color: C.white });
      const subH = measure(r.sub, SW - 64, 22);
      const ly = y + rh - 28 - subH - 12 - 26;
      s.label(r.stage, { x: X0 + 32, y: ly, w: SW - 64, size: 26, color: C.white });
      s.text(r.sub, { x: X0 + 32, y: ly + 26 + 12, w: SW - 64, size: 22, lh: 1.2, color: C.white });
      s.chevron({ cx: X0 + SW + 25, cy: y + rh / 2, color: r.color, w: 22, h: 34 });
      // строка: каналы | роль
      s.card({ x: CX, y, w: X1 - CX, h: rh });
      s.vline(RX - 20, y + 24, rh - 48, C.line, 1.5);
      // каналы — чипы с переносом
      const chipH = 46;
      const chipG = 10;
      const chipFS = 19;
      const lines = [[]];
      let lw = 0;
      const maxW = CHW - 20;
      r.ch.forEach((c) => {
        const cw = widthOf(c, chipFS, true) + 36;
        if (lw && lw + chipG + cw > maxW) { lines.push([]); lw = 0; }
        lines[lines.length - 1].push({ c, cw });
        lw += (lw ? chipG : 0) + cw;
      });
      const blockH = lines.length * chipH + (lines.length - 1) * chipG;
      let cy = y + (rh - blockH) / 2;
      const chipFill = tintOf(r.color, 0.12);
      lines.forEach((ln) => {
        let cx = CX + 30;
        ln.forEach(({ c, cw }) => {
          s.box({ x: cx, y: cy, w: cw, h: chipH, fill: chipFill, r: 23 });
          s.text(c, { x: cx, y: cy, w: cw, h: chipH, size: chipFS, bold: true, lh: 1.0, color: C.navy, align: 'center', valign: 'middle' });
          cx += cw + chipG;
        });
        cy += chipH + chipG;
      });
      // роль в стратегии
      s.text(r.role, { x: RX, y: y + 20, w: RW, h: rh - 40, size: 22, lh: 1.25, color: C.blueText, valign: 'middle', fit: true, minSize: 17 });
    });
  },

  // =====================================================================
  // 34 · Азелик и Клиндовит: различия в сегментах и потребностях
  // =====================================================================
  34: (d) => {
    const s = d.slide({ title: 'Азелик и Клиндовит: различия в сегментах и потребностях' });
    const SW = 600;
    const MID = { x: X0 + SW + 24, w: X1 - X0 - SW * 2 - 48 };
    const H = CB - TOP;
    const PADC = 28;
    const brandCard = (x, color, name, sub, rows, { ls = 18, fs = 17, LW = 170, maxGap = 40 } = {}) => {
      s.card({ x, y: TOP, w: SW, h: H });
      s.box({ x: x + 12, y: TOP + 12, w: SW - 24, h: 64, fill: color, r: 16 });
      s.text(name, { x: x + PADC, y: TOP + 12, w: SW - PADC * 2, h: 64, size: 30, bold: true, lh: 1.0, color: C.white, valign: 'middle', caps: true });
      const sh = s.text(sub, { x: x + PADC, y: TOP + 96, w: SW - PADC * 2, size: 20, bold: true, lh: 1.15, color: C.navy, caps: true });
      const TW = SW - PADC * 2 - LW - 12;
      let y = TOP + 96 + sh + 24;
      const avail = TOP + H - 24 - y;
      const hs = rows.map(([l, t]) => Math.max(measure(l, LW, ls, true, 1.15), measure(t, TW, fs)));
      const gap = Math.min(maxGap, (avail - hs.reduce((a, b) => a + b, 0)) / rows.length);
      rows.forEach(([l, t], k) => {
        if (k > 0) s.hline(x + PADC, y - gap / 2, SW - PADC * 2, C.line, 1.5);
        s.text(l, { x: x + PADC, y, w: LW, size: ls, bold: true, lh: 1.15, color });
        s.text(t, { x: x + PADC + LW + 12, y, w: noWidow(t, TW, fs), size: fs, lh: 1.2, color: C.blueText });
        y += hs[k] + gap;
      });
    };
    brandCard(X0, AZ, 'Азелик', 'Широкая аудитория и длительный сценарий', [
      ['18–40', 'Основная аудитория: акне / постакне, косметический и медицинский уход'],
      ['Ж 18–34', 'Social girl, новые средства, переключение со Скиноклира'],
      ['М 18–34', 'Проблемная кожа, запрос на простое решение'],
      ['12–17', 'Формирование понимания ухода у подростков — вход в категорию'],
      ['Ж 40–55', 'Новый сценарий: акне в контексте зрелого ухода'],
      ['Чувствительная кожа', 'Ж 18–35; важен комфортный уход без усиления сухости и раздражения'],
    ], { ls: 19, fs: 18, LW: 176 });
    brandCard(X1 - SW, CL, 'Клиндовит', 'Точечные сегменты с острой потребностью', [
      ['Ж 18–25', 'Появились прыщи → хочу быстро их убрать; сильный социальный дискомфорт'],
      ['Матери 35–55', 'Покупатель для подростка 12–17; нужен быстрый и понятный вариант'],
      ['Ж 25–40', 'Нет времени на прыщи; нужно быстрое решение, чтобы не выпадать из ритма жизни'],
    ], { ls: 20, fs: 19, LW: 180, maxGap: 110 });

    // общее поле: метка и база сверху, вывод «→ Поэтому…» снизу, два блока — между ними
    const { x, w } = MID;
    s.card({ x, y: TOP, w, h: H, tint: true });
    const ip = 26;
    const iw = w - ip * 2;
    let y = TOP + 28;
    y += s.label('Общее поле', { x: x + ip, y, w: iw, size: 22, color: C.purple }) + 18;
    // пересечение аудиторий: синий круг — Азелик, малиновый — Клиндовит (как карточки по бокам)
    const vd = 132;
    const vo = 50;
    const vx = x + (w - (vd * 2 - vo)) / 2;
    [[AZ, 0], [CL, vd - vo]].forEach(([col, dx]) => s.s.addShape(s.shapes.ellipse, {
      x: IN(vx + dx), y: IN(y), w: IN(vd), h: IN(vd), fill: { color: col, transparency: 25 }, line: { type: 'none' } }));
    y += vd + 18;
    const base = '18–40 с акне — общая категорийная база';
    y += s.text(base, { x: x + ip, y, w: evenW(base, iw, 26, true), size: 26, bold: true, lh: 1.15, color: C.navy });
    const concl = '→ Поэтому коммуникацию разделяем по потребности, а не только по демографии';
    const ch = measure(concl, iw, 20, true);
    const cy = TOP + H - 28 - ch;
    s.text(concl, { x: x + ip, y: cy, w: iw, size: 20, bold: true, lh: 1.2, color: C.purple });
    const b1t = 'Появившиеся / повторяющиеся прыщи влияют на уверенность и внешний вид';
    const q1 = '[[**Клиндовит**]] — быстрее решить острую проблему';
    const q2 = '**Азелик** — контролировать акне и поддерживать результат';
    const BT = 19;   // текст блоков
    const b1h = 20 + 18 + 12 + measure(b1t, iw - 40, BT) + 22;
    const b2h = 20 + 18 + 12 + measure(q1, iw - 40, BT) + 10 + measure(q2, iw - 40, BT) + 22;
    const g = 24;
    y += (cy - y - b1h - b2h - g) / 2;
    // общая проблема
    s.box({ x: x + ip, y, w: iw, h: b1h, fill: C.white, stroke: C.line, sw: 1.5, r: 16 });
    s.label('Общая проблема', { x: x + ip + 20, y: y + 20, w: iw - 40, size: 18, color: C.purple });
    s.text(b1t, { x: x + ip + 20, y: y + 20 + 18 + 12, w: iw - 40, size: BT, lh: 1.2, color: C.blueText });
    y += b1h + g;
    // но разный запрос
    s.box({ x: x + ip, y, w: iw, h: b2h, fill: C.white, stroke: C.line, sw: 1.5, r: 16 });
    s.label('Но разный запрос', { x: x + ip + 20, y: y + 20, w: iw - 40, size: 18, color: C.navy });
    const q1h = s.text(q1, { x: x + ip + 20, y: y + 20 + 18 + 12, w: iw - 40, size: BT, lh: 1.2, color: C.blueText });
    s.text(q2, { x: x + ip + 20, y: y + 20 + 18 + 12 + q1h + 10, w: iw - 40, size: BT, lh: 1.2, color: C.blueText });

    s.principle({ label: 'Стратегический вывод', icon: 'tb:TbArrowsSplit2',
      text: 'Азелик масштабирует и расширяет категорию, Клиндовит точечно забирает сформированную потребность — это позволяет использовать общий рынок акне для синергии, не дублируя коммуникацию.' });
  },

  // =====================================================================
  // 35 · Азелик + Клиндовит: синергия без каннибализации
  // =====================================================================
  35: (d) => {
    const s = d.slide({
      title: 'Азелик + Клиндовит: синергия без каннибализации',
      subtitle: 'Азелик создаёт масштаб, Клиндовит решает острую проблему — последовательный контакт переводит пользователя между брендами',
    });
    // ---- единый путь пользователя ----
    s.label('Единый путь пользователя', { x: X0, y: TOP, w: 1200, size: 22, color: C.navy });
    const CY = TOP + 36;
    const CH = 330;
    const GAPC = 66;
    const cw = Math.floor((X1 - X0 - GAPC * 2) / 3);
    const cards = [
      { brand: 'Азелик', color: AZ, role: 'Масштаб категории', value: '160', unit: 'млн ₽',
        ch: 'CTV / OLV / Programmatic / Influence', aud: ['18–40 + расширение аудитории'], tag: 'Контроль акне • регулярность • комфорт' },
      { brand: 'Клиндовит', color: CL, role: 'Острая потребность', value: '15,9', unit: 'млн ₽',
        ch: 'Поиск / баннеры / блогеры / ORM', aud: ['Social girl 18–25', 'Родители подростков', 'Ж 25–40 офис / бизнес'], tag: 'Быстрое решение от прыщей' },
      { brand: 'Азелик', color: C.navy, role: 'Возврат и удержание', value: 'Следующий шаг',
        ch: 'Retargeting / Внешние публикации + Native', aud: ['Посетители Клиндовита + поведенческие сигналы'], tag: 'Возврат к регулярному контролю' },
    ];
    cards.forEach((c, k) => {
      const x = X0 + k * (cw + GAPC);
      const p = 28;
      const iw = cw - p * 2;
      s.card({ x, y: CY, w: cw, h: CH, tint: k === 1 });
      s.text(c.brand, { x: x + p, y: CY + 24, w: iw, size: 32, bold: true, lh: 1.0, color: c.color, caps: true });
      // бюджет (или «Следующий шаг») — справа, на одной линии с названием бренда
      if (c.unit) {
        const vw = widthOf(c.value, 34, true) + widthOf(' ' + c.unit, 20, true) + 8;
        s.text([{ text: c.value, options: {} }, { text: ' ' + c.unit, options: { fontSize: 15 } }],
          { x: x + cw - p - vw, y: CY + 22, w: vw, size: 34, bold: true, lh: 1.0, color: c.color, align: 'right' });
      } else {
        const bw = widthOf(c.brand.toUpperCase(), 32, true) + 24;
        s.text(c.value, { x: x + p + bw, y: CY + 26, w: iw - bw, h: 34, size: 26, bold: true, lh: 1.0, color: c.color, align: 'right',
          fit: true, maxLines: 1, minSize: 18 });
      }
      s.label(c.role, { x: x + p, y: CY + 70, w: iw, size: 18, color: C.navy });
      s.hline(x + p, CY + 102, iw, C.line, 1.5);
      let y = CY + 118;
      y += iconRow(s, { x: x + p, y, w: iw, icon: 'tb:TbBroadcast', color: c.color, d: 32, gap: 12, title: c.ch, tSize: 19 }) + 12;
      iconRow(s, { x: x + p, y, w: iw, icon: 'tb:TbUsers', color: c.color, d: 32, gap: 12, text: c.aud.join('\n'), bSize: 19 });
      const tagH = 44;
      s.box({ x: x + p - 8, y: CY + CH - 18 - tagH, w: iw + 16, h: tagH, fill: tintOf(c.color, 0.1), r: 12 });
      s.text(c.tag, { x: x + p, y: CY + CH - 18 - tagH, w: iw, h: tagH, size: 18, bold: true, lh: 1.0, color: C.navy, valign: 'middle',
        fit: true, maxLines: 1, minSize: 15 });
      if (k < 2) s.chevron({ cx: x + cw + GAPC / 2, cy: CY + CH / 2, color: c.color, w: 26, h: 40 });
    });

    // ---- тактическая связка ----
    const TY = CY + CH + 20;
    const TH = 138;
    s.box({ x: X0, y: TY, w: X1 - X0, h: TH, fill: tintOf(C.crimson, 0.06), stroke: tintOf(C.crimson, 0.35), sw: 2, r: 22 });
    const tc = [{ x: X0 + 32, w: 400 }, { x: X0 + 490, w: 640 }, { x: X0 + 1190, w: X1 - X0 - 1190 - 32 }];
    s.label('Тактическая связка', { x: tc[0].x, y: TY + 24, w: tc[0].w, size: 22, color: C.crimson });
    s.text('1-й этап — Клиндовит\n2-й этап — Азелик', { x: tc[0].x, y: TY + 60, w: tc[0].w, size: 21, bold: true, lh: 1.25, color: C.navy });
    s.vline(tc[1].x - 30, TY + 22, TH - 44, tintOf(C.crimson, 0.35), 1.5);
    s.vline(tc[2].x - 30, TY + 22, TH - 44, tintOf(C.crimson, 0.35), 1.5);
    s.label('Retargeting', { x: tc[1].x, y: TY + 24, w: tc[1].w, size: 20, color: C.navy });
    s.text('Programmatic + РСЯ\nСайт Клиндовита + видевшие коммуникацию с общим креативом', { x: tc[1].x, y: TY + 58, w: tc[1].w, size: 19, lh: 1.2, color: C.blueText });
    s.label('Внешние публикации + Native', { x: tc[2].x, y: TY + 24, w: tc[2].w, size: 20, color: C.navy });
    s.text('Показываем сценарий в момент выбора решения с общим креативом', { x: tc[2].x, y: TY + 58, w: tc[2].w, size: 19, lh: 1.2, color: C.blueText });

    // ---- хало-эффект ----
    const HY = TY + TH + 24;
    s.label('Как получаем хало-эффект без сильного пересечения', { x: X0, y: HY, w: 1500, size: 22, color: C.navy });
    const IY = HY + 36;
    const cols = columns(3, { gap: 24 });
    const items = [
      { icon: 'tb:TbArrowsSplit2', color: AZ, title: 'Разные роли',
        text: '**Азелик** — масштаб, контроль и регулярность.\n**Клиндовит** — быстрый ответ на острую проблему' },
      { icon: 'tb:TbDoorEnter', color: CL, title: 'Разные входы',
        text: 'Не дублируем контакт: Клиндовит работает на сформированной потребности, Азелик — на следующем шаге' },
      { icon: 'tb:TbRoute', color: AZ, title: 'Последовательный контакт',
        text: 'Переход между брендами по триггеру: визит, взаимодействие или интерес к решению' },
    ];
    items.forEach((it, k) => {
      const { x, w } = cols[k];
      s.card({ x, y: IY, w, h: BOT - IY });
      s.icon(it.icon, { x: x + 24, y: IY + 20, size: 44, circle: it.color });
      s.label(it.title, { x: x + 24 + 44 + 16, y: IY + 32, w: w - 24 * 2 - 60, size: 20, color: C.navy });
      s.text(it.text, { x: x + 24, y: IY + 20 + 44 + 14, w: w - 48, h: BOT - 14 - (IY + 20 + 44 + 14), size: 20, lh: 1.25, color: C.blueText, fit: true, minSize: 16 });
    });
  },

  // =====================================================================
  // 36 · Бренд-сайты 2027: из кросс-ссылок в персонализированные разделы
  // =====================================================================
  36: (d) => {
    const s = d.slide({
      title: 'Бренд-сайты 2027: из кросс-ссылок в персонализированные разделы',
      subtitle: 'Каждый сайт не просто рассказывает о втором бренде, он объясняет следующую задачу пользователя и переводит в релевантный контентный маршрут',
    });
    s.label('Два зеркальных маршрута — одна логика CJM', { x: X0, y: TOP, w: 1400, size: 22, color: C.navy });
    const SY = TOP + 38;
    const SWD = 890;
    const p = 30;                       // поле внутри окна
    const mw = SWD - p * 2;             // ширина модуля Next step
    const PW = 220;                     // мини-упаковка
    const hw = SWD - p * 2 - PW - 26;   // текст рядом с упаковкой
    const tw = mw - 28 * 2 - PW - 24;   // текст модуля Next step
    const sites = [
      { x: X0, url: 'clindovit.ru', own: 'cl', other: 'az', head: 'Активное воспаление: что важно понимать',
        body: 'Основной контент страницы закрывает текущий запрос пользователя и объясняет роль клиндамицина в рамках утверждённой медицинской коммуникации',
        next: 'Next step: что дальше после снижения воспаления?',
        steps: 'Почему контроль акне не заканчивается одним этапом\n→ роль азелаиновой кислоты\n→ постакне / регулярность / дальнейший контроль',
        pers: '**Персонализация:** показываем модуль только на релевантных страницах и пользователям с соответствующим намерением или предыдущим контактом с брендом' },
      { x: X1 - SWD, url: 'azelik.ru', own: 'az', other: 'cl', head: 'Длительный контроль и постакне',
        body: 'Основной контент страницы поддерживает регулярность, долгосрочную логику и работу с последствиями акне',
        next: 'Next step: что делать при новом активном воспалении?',
        steps: 'Образовательный разбор воспалительной фазы\n→ когда нужен другой подход\n→ переход в релевантный материал Клиндовита',
        pers: '**Персонализация:** не показываем второй бренд всем подряд — только когда содержание страницы и поведенческий сигнал делают переход логичным' },
    ];
    // общая геометрия для обоих окон (зеркальные блоки стоят на одной высоте)
    const HS = 23;
    const BS = 18;
    const ry = SY + 84;
    const topH = Math.max(...sites.map((st) => measure(st.head, hw, HS, true, 1.15) + 8 + measure(st.body, hw, BS)), 76);
    const nhs = sites.map((st) => measure(st.next, tw, 21, true, 1.15));
    const mh = Math.max(...sites.map((st, k) => 24 + nhs[k] + 12 + measure(st.steps, tw, 19, false, 1.3) + 24), 24 + 76 + 14 + 46 + 24);
    const ph = Math.max(...sites.map((st) => measure(st.pers, mw, 18)));
    const TH = 124;                                   // плитки внизу
    const SH = BOT - TH - 38 - 24 - SY;               // окно сайта — до нижнего блока
    const extra = Math.max(0, SH - (ry - SY + topH + 24 + mh + 20 + ph + 26)) / 3;
    const my = ry + topH + 24 + extra;
    const py = my + mh + 20 + extra;
    sites.forEach((st, k) => {
      const x = st.x;
      const oc = st.other === 'az' ? AZ : CL;
      // окно браузера
      s.card({ x, y: SY, w: SWD, h: SH });
      s.box({ x: x + 12, y: SY + 12, w: SWD - 24, h: 48, fill: C.cardTint, r: 14 });
      [0, 1, 2].forEach((i) => s.circle({ x: x + 32 + i * 22, y: SY + 30, d: 12, fill: C.line }));
      s.text(st.url, { x: x + 110, y: SY + 12, w: 400, h: 48, size: 20, bold: true, lh: 1.0, color: C.navy, valign: 'middle' });
      // основной контент страницы
      pack(s, { x: x + p, y: ry, w: PW, h: 76, brand: st.own });
      const hx = x + p + PW + 26;
      const hh = s.text(st.head, { x: hx, y: ry - 2, w: hw, size: HS, bold: true, lh: 1.15, color: C.navy });
      s.text(st.body, { x: hx, y: ry - 2 + hh + 8, w: hw, size: BS, lh: 1.2, color: C.blueText });
      // модуль Next step — ведёт во второй бренд
      s.box({ x: x + p, y: my, w: mw, h: mh, fill: tintOf(oc, 0.05), stroke: oc, sw: 2.5, r: 18 });
      s.text(st.next, { x: x + p + 28, y: my + 24, w: noWidow(st.next, tw, 21, true), size: 21, bold: true, lh: 1.15, color: oc });
      s.text(st.steps, { x: x + p + 28, y: my + 24 + nhs[k] + 12, w: tw, size: 19, lh: 1.3, color: C.navy });
      const px = x + p + mw - 28 - PW;
      pack(s, { x: px, y: my + 24, w: PW, h: 76, brand: st.other });
      s.box({ x: px, y: my + 24 + 76 + 14, w: PW, h: 46, fill: oc, r: 12 });
      s.text('Подробнее', { x: px, y: my + 24 + 76 + 14, w: PW, h: 46, size: 19, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
      // персонализация
      s.text(st.pers, { x: x + p, y: py, w: mw, size: 18, lh: 1.2, color: C.blueText });
    });

    // ---- данные и замер ----
    const BY = SY + SH + 24;
    const TY = BY + 38;
    s.label('Данные для персонализации', { x: X0, y: BY, w: SWD, size: 20, color: C.navy });
    const pcols = columns(3, { x0: X0, x1: X0 + SWD, gap: 16 });
    [['Page topic', 'tb:TbFileText'], ['Search intent', 'tb:TbSearch'], ['Prior exposure', 'tb:TbEye']].forEach(([t, ic], k) => {
      const { x, w } = pcols[k];
      s.box({ x, y: TY, w, h: TH, fill: C.navy, r: 14 });
      s.icon(ic, { x: x + 18, y: TY + (TH - 40) / 2, size: 40, color: C.white });
      s.text(t.toUpperCase(), { x: x + 18 + 40 + 14, y: TY, w: w - 18 - 40 - 14 - 14, h: TH, size: 20, bold: true, lh: 1.1, color: C.white,
        valign: 'middle', fit: true, maxLines: 2, minSize: 15 });
    });
    const MX = X1 - SWD;
    s.label('Как замеряем эффект', { x: MX, y: BY, w: SWD, size: 20, color: C.navy });
    const mcols = columns(4, { x0: MX, x1: X1, gap: 14 });
    [
      ['CTR', 'module view → click', C.crimson],
      ['depth / time', 'cross-site visit quality', C.navy],
      ['assisted CR', 'where-to-buy after journey', C.crimson],
      ['journey rate', '7/30-day sequential visit', C.navy],
    ].forEach(([m, t, col], k) => {
      const { x, w } = mcols[k];
      s.box({ x, y: TY, w, h: TH, fill: C.cardTint, stroke: C.line, sw: 1.5, r: 14 });
      s.text(m, { x: x + 16, y: TY + 12, w: w - 32, h: 26, size: 22, bold: true, lh: 1.0, color: col, fit: true, maxLines: 1, minSize: 16 });
      s.text(t, { x: x + 16, y: TY + 44, w: w - 32, h: TH - 44 - 8, size: 17, lh: 1.15, color: C.blueText, fit: true, minSize: 14 });
    });
  },

  // =====================================================================
  // 37 · Обучающие AI-видео
  // =====================================================================
  37: (d) => {
    const s = d.slide({
      title: 'Обучающие AI-видео: одна система контента, разные копии с персонализацией под бренд',
      subtitle: 'AI-video позволяет быстро производить обучающие ролики без рекламных призывов и менять акценты в зависимости от симптома, активного компонента, роли терапии',
    });
    // ---- единая серия (левая колонка во всю высоту) ----
    const LW = 600;
    s.label('Единая серия: что объясняем', { x: X0, y: TOP, w: LW, size: 22, color: C.navy });
    const series = [
      ['Активное воспаление vs долгосрочный контроль', 'Две разные задачи внутри одного пути пользователя в терапии акне'],
      ['Что происходит после снижения воспаления', 'Почему следующая задача — удерживать контроль'],
      ['Почему акне может возвращаться', 'Триггеры, регулярность, новые воспалительные эпизоды'],
      ['Терапия + ежедневный уход', 'Как выстроить понятную последовательность действий'],
    ];
    const LY0 = TOP + 38;
    const lg = 16;
    const lch = Math.floor((BOT - LY0 - lg * 3) / 4);
    series.forEach(([t, b], k) => {
      const y = LY0 + k * (lch + lg);
      s.card({ x: X0, y, w: LW, h: lch });
      const tw = LW - 84 - 26;
      const th = measure(t, tw, 22, true, 1.15);
      const bh = measure(b, tw, 19);
      const ty = y + Math.round((lch - th - 8 - bh) / 2);
      s.text(String(k + 1), { x: X0 + 28, y: ty - 4, w: 44, size: 44, bold: true, lh: 1.0, color: C.crimson });
      s.text(t, { x: X0 + 84, y: ty, w: noWidow(t, tw, 22, true), size: 22, bold: true, lh: 1.15, color: C.navy });
      s.text(b, { x: X0 + 84, y: ty + th + 8, w: noWidow(b, tw, 19), size: 19, lh: 1.2, color: C.blueText });
    });

    // ---- модульная архитектура ----
    const RX = X0 + LW + 32;
    const RW = X1 - RX;
    s.label('Модульная архитектура AI-video', { x: RX, y: TOP, w: RW, size: 22, color: C.navy });
    const MY = TOP + 38;
    const MH = 256;
    const mg = 44;
    const mw = Math.floor((RW - mg * 2) / 3);
    const mods = [
      ['Problem / Occasion', 'Что происходит с кожей?'],
      ['Education', 'Активные компоненты и роли'],
      ['Next step', 'Что делать дальше?'],
    ];
    mods.forEach(([t, b], k) => {
      const x = RX + k * (mw + mg);
      s.card({ x, y: MY, w: mw, h: MH });
      // кадр ролика — схема живыми фигурами, как в исходнике
      const fx = x + 16;
      const fy = MY + 16;
      const fw = mw - 32;
      const fh = 124;
      s.box({ x: fx, y: fy, w: fw, h: fh, fill: C.cardTint, r: 14 });
      const cxm = fx + fw / 2;
      const cym = fy + fh / 2;
      if (k === 0) {
        s.circle({ x: cxm - 36, y: cym - 36, d: 72, fill: tintOf(C.crimson, 0.15) });
        [[-14, -12], [12, -2], [-4, 16]].forEach(([dx, dy]) => s.circle({ x: cxm + dx - 6, y: cym + dy - 6, d: 12, fill: C.crimson }));
      } else if (k === 1) {
        [C.blue, C.crimson, C.green].forEach((col, i) => s.circle({ x: cxm - 102 + i * 72, y: cym - 30, d: 60, fill: col }));
      } else {
        s.arrow({ dir: 'right', x: cxm - 80, y: cym, len: 160, color: C.navy, stem: 8, head: 30, headLen: 22 });
      }
      s.label(t, { x: x + 20, y: fy + fh + 18, w: mw - 40, size: 20, color: C.navy });
      s.text(b, { x: x + 20, y: fy + fh + 18 + 32, w: mw - 40, size: 18, lh: 1.2, color: C.blueText });
      if (k < 2) s.chevron({ cx: x + mw + mg / 2, cy: MY + MH / 2, color: C.navy, w: 20, h: 30 });
    });

    // ---- персонализация под бренд ----
    const PY = MY + MH + 26;
    s.label('Персонализация под бренд', { x: RX, y: PY, w: RW, size: 22, color: C.navy });
    const BY = PY + 38;
    const BH = 184;
    const bw = Math.floor((RW - 24) / 2);
    [
      { brand: 'cl', color: CL, head: 'Clindovit акценты', text: 'активное воспаление\n→ персо-LP/статья\n→ где купить' },
      { brand: 'az', color: AZ, head: 'Azelik акценты', text: 'контроль / постакне\n→ персо-LP/статья\n→ где купить' },
    ].forEach((b, k) => {
      const x = RX + k * (bw + 24);
      s.box({ x, y: BY, w: bw, h: BH, fill: tintOf(b.color, 0.05), stroke: b.color, sw: 2.5, r: 22 });
      pack(s, { x: x + 26, y: BY + 30, w: 220, h: 76, brand: b.brand });
      const tx = x + 26 + 220 + 28;
      const tw = x + bw - 24 - tx;
      s.label(b.head, { x: tx, y: BY + 30, w: tw, size: 20, color: b.color });
      s.text(b.text, { x: tx, y: BY + 64, w: tw, size: 20, lh: 1.3, color: C.navy });
    });

    // ---- где можем использовать ----
    const UY = BY + BH + 26;
    s.label('Где можем использовать', { x: RX, y: UY, w: RW, size: 22, color: C.navy });
    const uses = [['azelik.ru', AZ], ['clindovit.ru', CL], ['VK Video / Rutube*', C.navy], ['HCP adaptations', C.teal]];
    const uy = UY + 38;
    const uw = uses.map(([t]) => widthOf(t, 20, true) + 48);
    const ug = (RW - uw.reduce((a, b) => a + b, 0)) / (uses.length - 1);
    let ux = RX;
    uses.forEach(([t, col], k) => {
      s.pill(t, { x: ux, y: uy, w: uw[k], h: 50, color: col, size: 20, caps: false });
      ux += uw[k] + Math.min(ug, 18);
    });
    const ny = uy + 50 + 16;
    s.box({ x: RX, y: ny, w: RW, h: BOT - ny, fill: C.cardTint, r: 16 });
    s.text('* Ролики работают как экспертный источник внутри стриминговых платформ: AI-система получает корректный видео-контент, транскрипт и метаданные, а бренд получает измеряемую основу для будущей мультимодальной видимости',
      { x: RX + 24, y: ny + 8, w: RW - 48, h: BOT - ny - 16, size: 18, lh: 1.2, color: C.navy, valign: 'middle', fit: true, minSize: 14 });
  },

  // =====================================================================
  // 38 · AI visibility + e-com: два бренда — одна система видимости и покупки
  // =====================================================================
  38: (d) => {
    const s = d.slide({
      title: 'AI visibility + e-com: два бренда — одна система видимости и покупки',
      subtitle: 'Разделяем семантические территории брендов, связываем общие темы и измеряем не только переход между сайтами, но и действие пользователя на следующем этапе воронки',
    });
    // ---- семантические территории ----
    const LW = 560;
    s.label('Семантические территории', { x: X0, y: TOP, w: LW, size: 22, color: C.navy });
    const ty0 = TOP + 38;
    const tg = 16;
    // разделитель «•» привязан неразрывным пробелом к следующему слову (строка не кончается точкой, перенос — перед ней, как в исходнике); цитаты не рвём
    const terr = [
      { brand: 'cl', color: CL, text: 'активное воспаление • воспалительная форма акне • клиндамицин • «что делать сейчас?»' },
      { brand: 'az', color: AZ, text: 'азелаиновая кислота • долгосрочный контроль • постакне • регулярное применение • «как удержать результат?»' },
    ];
    const th = Math.floor((CB - ty0 - tg * 2) / 3);
    terr.forEach((t, k) => {
      const y = ty0 + k * (th + tg);
      s.box({ x: X0, y, w: LW, h: th, fill: tintOf(t.color, 0.05), stroke: t.color, sw: 2.5, r: 22 });
      pack(s, { x: X0 + 22, y: y + 20, w: 220, h: 76, brand: t.brand });
      s.label('Owned territory', { x: X0 + 22 + 220 + 24, y: y + 46, w: LW - 22 * 2 - 220 - 24, size: 20, color: t.color });
      s.text(t.text, { x: X0 + 22, y: y + 20 + 76 + 16, w: LW - 44, h: y + th - 12 - (y + 20 + 76 + 16), size: 19, lh: 1.25, color: C.navy, fit: true, minSize: 15 });
    });
    const cy = ty0 + 2 * (th + tg);
    s.card({ x: X0, y: cy, w: LW, h: th, tint: true });
    s.icon('tb:TbLink', { x: X0 + 22, y: cy + 20, size: 44, circle: C.navy });
    const topics = 'Общие темы, которые связывают CJM';
    s.text(topics, { x: X0 + 22 + 44 + 14, y: cy + 22, w: evenW(topics, LW - 44 - 80, 20, true, true), size: 20, bold: true, lh: 1.15, color: C.navy, caps: true });
    s.text('почему акне возвращается • что делать после снижения воспаления • когда меняется задача терапии • консультация специалиста',
      { x: X0 + 22, y: cy + 20 + 44 + 34, w: LW - 44, h: cy + th - 12 - (cy + 20 + 44 + 34), size: 19, lh: 1.25, color: C.navy, fit: true, minSize: 15 });

    // ---- единый путь от намерения до покупки ----
    const RX = X0 + LW + 32;
    const RW = X1 - RX;
    s.label('Единый путь от намерения до покупки', { x: RX, y: TOP, w: RW, size: 22, color: C.navy });
    const steps = [
      ['Search / AI', C.navy], ['Expert content', C.teal], ['Brand site', C.blue],
      ['Cross-brand next step', C.crimson], ['E-com', C.green], ['Repeat', C.purple],
    ];
    const sg = 30;
    const sw = (RW - sg * 5) / 6;
    const sy = TOP + 38;
    const shh = 78;
    steps.forEach(([t, col], k) => {
      const x = RX + k * (sw + sg);
      const hero = k === 3;
      s.box({ x, y: sy, w: sw, h: shh, fill: hero ? col : C.white, stroke: col, sw: 2.5, r: 16 });
      s.text(t.toUpperCase(), { x: x + 8, y: sy, w: sw - 16, h: shh, size: 17, bold: true, lh: 1.1, color: hero ? C.white : col,
        align: 'center', valign: 'middle', fit: true, maxLines: 2, minSize: 14 });
      if (k < 5) s.chevron({ cx: x + sw + sg / 2, cy: sy + shh / 2, color: C.navy, w: 14, h: 22 });
    });

    // ---- что отслеживаем ----
    const KY = sy + shh + 34;
    const GW = 400;                 // decision gate
    const KW = RW - GW - 24;
    s.label('Что отслеживаем в кросс-брендовом CJM', { x: RX, y: KY, w: KW, size: 22, color: C.navy });
    const kpis = [
      ['Search / AI visibility', 'бренд присутствует в нужных темах и ответах'],
      ['Sequential visit rate', 'доля пользователей, посетивших оба сайта за 7/30 дней'],
      ['Assisted\n«Where-to-buy»', 'конверсия после кросс-брендового взаимодействия'],
      ['E-com downstream action', 'переход / корзины / заказ, где доступно'],
      ['Incremental action lift', 'путь пользователя vs контакт только с одним брендом'],
    ];
    const ky0 = KY + 40;
    const kh = (CB - ky0) / kpis.length;
    const NW = 300;
    kpis.forEach(([n, t], k) => {
      const y = ky0 + k * kh;
      if (k > 0) s.hline(RX, y, KW, C.line, 1.5);
      s.badge({ x: RX, y: y + (kh - 38) / 2, d: 38, n: k + 1, color: C.crimson, size: 19 });
      s.text(n, { x: RX + 54, y, w: NW - 54 - 10, h: kh, size: 19, bold: true, lh: 1.15, color: C.navy, valign: 'middle', fit: true, minSize: 16 });
      s.text(t, { x: RX + NW, y, w: KW - NW, h: kh, size: 18, lh: 1.2, color: C.blueText, valign: 'middle', fit: true, minSize: 15 });
    });

    // ---- decision gate ----
    const GX = X1 - GW;
    s.card({ x: GX, y: KY, w: GW, h: CB - KY, tint: true });
    s.label('Decision gate 2027', { x: GX + 26, y: KY + 26, w: GW - 52, size: 22, color: C.navy });
    const gates = [
      ['Scale', 'если sequential journey повышает действие пользователя на следующем этапе воронки', C.green, 'tb:TbTrendingUp'],
      ['Optimize', 'если есть переход, но нет качества, конверсии', C.teal, 'tb:TbAdjustments'],
      ['Stop / Change', 'если связка добавляет клики, но не ценность', C.crimson, 'tb:TbHandStop'],
    ];
    const gy0 = KY + 72;
    const gh = (CB - 20 - gy0) / 3;
    gates.forEach(([t, b, col, ic], k) => {
      const y = gy0 + k * gh;
      s.icon(ic, { x: GX + 26, y: y + 4, size: 40, circle: col });
      s.label(t, { x: GX + 26 + 40 + 14, y: y + 13, w: GW - 52 - 54, size: 20, color: col });
      s.text(b, { x: GX + 26 + 54, y: y + 44, w: GW - 52 - 54, h: gh - 52, size: 18, lh: 1.2, color: C.navy, fit: true, minSize: 15 });
    });

    s.principle({ label: 'Ключевой принцип', icon: 'tb:TbRoute',
      text: 'Пользователь не обязан проходить весь маршрут. Система показывает следующий релевантный шаг там, где появляется новый вопрос / новое намерение.' });
  },
};
