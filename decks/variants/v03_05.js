// Варианты визуала для слайдов 3–5 деки Comprehensive (Market Trends: доходы, регионы, розница).
// По два варианта на слайд — на выбор. Данные — из json черновика.
const path = require('path');
const { Deck, C, IN, PT, chartMap, textWidth } = require('../../lib/akrikhin');

const SRC = path.join(__dirname, '..', '..', 'work', 'comprehensive', 'src');
const MUTED = 'A9BFD9';       // приглушённый сине-серый для фона (второстепенные линии/полосы)
const TOP = 221;
const BOT = 1005;
const r1 = (v) => Math.round(v * 10) / 10;
const fmt = (v) => r1(v).toFixed(1).replace('.', ',');

function chartData(n) {
  const j = require(path.join(SRC, `slide-${String(n).padStart(2, '0')}.json`));
  const p = j.shapes.find((sh) => sh.t === 'CHART').chart.plots[0];
  return { labels: p.cats.map((c) => String(c).trim()), series: p.series.map((s) => ({ name: s.name, values: s.values.map(r1) })) };
}

// «какой это вариант» — в заметки к слайду
function tag(s, text) {
  s.notes(text); // какой это вариант — в заметках к слайду, не на самом слайде
}

// годы под осью: подписи по центру своих кварталов/месяцев + тонкие разделители
function yearAxis(s, m, groups, y, { size = 18, sep = true } = {}) {
  let i0 = 0;
  groups.forEach(([label, count], gi) => {
    const x1 = m.cat(i0) - m.step / 2;
    const x2 = m.cat(i0 + count - 1) + m.step / 2;
    s.text(label, { x: x1, y, w: x2 - x1, size, bold: true, color: C.navy, align: 'center' });
    if (sep && gi > 0) s.seg(x1, y - 6, x1, y + size + 6, { color: C.line, width: 1.5 });
    i0 += count;
  });
}

// ===================== Слайд 3: доходы =====================
const INC = chartData(3);                       // 10 кварталов 2024 Q1 … 2026 Q2
const incV = INC.series[0].values;
const quarters = INC.labels.map((l) => l.split(' ')[1]); // Q1…Q4

function slide3A(d) {
  const s = d.slide({ title: 'Рост доходов в 2026 практически остановился' });
  tag(s, 'Вариант 3А · линия + акцент на 2026');
  s.card({ x: 58, y: TOP, w: 1330, h: BOT - TOP });
  s.label('Динамика реальных располагаемых доходов, % г/г', { x: 94, y: 255, w: 1200, color: C.blue });
  const P = { x: 130, y: 360, w: 1200, h: 500 };
  const m = chartMap('line', 10, P, 0, 12);
  // заливка 2026
  const bx = m.cat(8) - m.step / 2;
  s.box({ x: bx, y: 310, w: P.x + P.w - bx, h: P.y + P.h - 310, fill: C.crimson, transparency: 92, r: 0 });
  s.text('2026', { x: bx + 16, y: 322, w: 200, size: 20, bold: true, color: C.crimson });
  s.chart('line', [{ name: 'Реальные располагаемые доходы, % г/г', labels: INC.labels, values: incV }],
    { x: 100, y: 330, w: 1260, h: 560, plot: P, min: 0, max: 12, values: false, legend: false, lineSize: 3, symbolSize: 9,
      extra: { catAxisHidden: true } });
  // 2026 — малиновым поверх
  for (let i = 7; i < 9; i++) s.seg(m.cat(i), m.val(incV[i]), m.cat(i + 1), m.val(incV[i + 1]), { color: C.crimson, width: 4.5 });
  [8, 9].forEach((i) => s.circle({ x: m.cat(i) - 9, y: m.val(incV[i]) - 9, d: 18, fill: C.crimson }));
  // подписи значений: над точкой, у локальных минимумов — под ней
  incV.forEach((v, i) => {
    const below = i === 4 || i >= 8;
    const hot = i >= 8;
    const sz = hot ? 26 : 18;
    s.text(fmt(v), { x: m.cat(i) - 50, y: below ? m.val(v) + 14 : m.val(v) - sz - 16, w: 100, size: sz, bold: true,
      color: hot ? C.crimson : C.navy, align: 'center' });
  });
  s.seg(P.x, m.val(0), P.x + P.w, m.val(0), { color: C.line, width: 2 });
  quarters.forEach((q, i) => s.text(q, { x: m.cat(i) - 40, y: m.val(0) + 12, w: 80, size: 16, color: C.blueText, align: 'center' }));
  yearAxis(s, m, [['2024', 4], ['2025', 4], ['2026', 2]], m.val(0) + 42);

  // справа: две цифры и прогноз
  const X = 1410;
  const Wc = 452;
  s.box({ x: X, y: TOP, w: Wc, h: 170, fill: C.blue });
  s.text('10,4%', { x: X + 28, y: TOP + 22, w: 300, size: 64, bold: true, lh: 1.1, color: C.white });
  s.text('пик роста — Q4 2024', { x: X + 28, y: TOP + 112, w: Wc - 56, size: 20, color: C.white });
  s.box({ x: X, y: TOP + 190, w: Wc, h: 170, fill: C.crimson });
  s.text('1,5%', { x: X + 28, y: TOP + 212, w: 300, size: 64, bold: true, lh: 1.1, color: C.white });
  s.text('Q2 2026 — рост почти остановился', { x: X + 28, y: TOP + 302, w: Wc - 56, size: 20, color: C.white });
  s.card({ x: X, y: TOP + 380, w: Wc, h: BOT - TOP - 380 });
  s.label('Прогноз Минэкономразвития', { x: X + 30, y: TOP + 410, w: Wc - 60, size: 20, color: C.crimson });
  [['+0,8%', 'по итогам 2026 года'], ['+2,1%', 'в 2027 — возобновление роста']].forEach(([v, t], k) => {
    const y = TOP + 460 + k * 140;
    s.text(v, { x: X + 30, y, w: 220, size: 54, bold: true, lh: 1.1, color: C.navy });
    s.text(t, { x: X + 30, y: y + 66, w: Wc - 60, size: 18, color: C.blueText });
    if (k === 0) s.hline(X + 30, y + 118, Wc - 60);
  });
  s.footnote('Источник: Росстат, Реальные располагаемые денежные доходы населения по Российской Федерации, 29.07.2026');
}

function slide3B(d) {
  const s = d.slide({ title: 'Рост доходов в 2026 практически остановился' });
  tag(s, 'Вариант 3Б · столбцы + прогноз отдельно');
  s.card({ x: 58, y: TOP, w: 1330, h: BOT - TOP });
  s.label('Факт: реальные располагаемые доходы, % г/г', { x: 94, y: 255, w: 1200, color: C.blue });
  const P = { x: 130, y: 330, w: 1200, h: 520 };
  const colors = incV.map((_, i) => (i >= 8 ? C.crimson : C.blue));
  const m = s.chart('col', [{ name: 'Доходы, % г/г', labels: INC.labels, values: incV }],
    { x: 100, y: 300, w: 1260, h: 600, plot: P, min: 0, max: 12, colors, gap: 45, legend: false,
      labelSize: 20, labelBold: true, format: '0.0', extra: { catAxisHidden: true } });
  // среднее за 2024–2025 — контекст для 2026
  const avg = incV.slice(0, 8).reduce((a, b) => a + b, 0) / 8;
  s.seg(P.x, m.val(avg), P.x + P.w, m.val(avg), { color: C.navy, width: 2, dash: 'dash' });
  s.text(`среднее 2024–2025: ${fmt(avg)}%`, { x: m.cat(8) - m.step / 2 + 8, y: m.val(avg) - 30, w: 300, size: 18, bold: true, color: C.navy });
  s.seg(P.x, m.val(0), P.x + P.w, m.val(0), { color: C.line, width: 2 });
  quarters.forEach((q, i) => s.text(q, { x: m.cat(i) - 40, y: m.val(0) + 12, w: 80, size: 16, color: C.blueText, align: 'center' }));
  yearAxis(s, m, [['2024', 4], ['2025', 4], ['2026', 2]], m.val(0) + 42);

  // справа: прогноз в той же шкале (столбцы с пунктиром — «ещё не факт»)
  const X = 1410;
  const Wc = 452;
  s.card({ x: X, y: TOP, w: Wc, h: BOT - TOP });
  s.label('Прогноз МЭР, % за год', { x: X + 30, y: 255, w: Wc - 60, color: C.crimson });
  [['2026', 0.8], ['2027', 2.1]].forEach(([yr, v], k) => {
    const bw = 120;
    const bx = X + 70 + k * 190;
    const y0 = m.val(0);
    const y1 = m.val(v);
    s.s.addShape(s.shapes.rect, { x: IN(bx), y: IN(y1), w: IN(bw), h: IN(y0 - y1), fill: { color: C.crimson, transparency: 85 },
      line: { color: C.crimson, width: PT(2.5), dashType: 'dash' } });
    s.text(`+${fmt(v)}%`, { x: bx - 30, y: y1 - 40, w: bw + 60, size: 26, bold: true, color: C.navy, align: 'center' });
    s.text(yr, { x: bx - 30, y: y0 + 12, w: bw + 60, size: 18, bold: true, color: C.navy, align: 'center' });
  });
  s.seg(X + 40, m.val(0), X + Wc - 40, m.val(0), { color: C.line, width: 2 });
  s.seg(X + 40, m.val(avg), X + Wc - 40, m.val(avg), { color: C.navy, width: 2, dash: 'dash' });
  s.text(`${fmt(avg)}% — среднее 2024–2025`, { x: X + 40, y: m.val(avg) - 30, w: Wc - 80, size: 17, bold: true, color: C.navy, align: 'right' });
  s.text('По итогам года Минэкономразвития ожидает рост +0,8%, в 2027 — возобновление роста до +2,1%',
    { x: X + 30, y: 330, w: Wc - 60, size: 20, bold: true, lh: 1.2, color: C.navy });
  s.footnote('Источник: Росстат, Реальные располагаемые денежные доходы населения по Российской Федерации, 29.07.2026; прогноз — Минэкономразвития');
}

// ===================== Слайд 4: регионы =====================
const REG = chartData(4);
const regV = REG.series[0].values;
const regN = REG.labels.map((l) => l.replace('а.о.', 'АО').replace('обл.', 'область'));
const CAPITAL = ['Москва', 'Московская область', 'Санкт-Петербург'];
const FAREAST = ['Чукотский АО', 'Хабаровский край', 'Магаданская область', 'Забайкальский край', 'Республика Бурятия'];
const groupColor = (n) => (CAPITAL.includes(n) ? C.crimson : FAREAST.includes(n) ? C.blue : MUTED);
const AVG = 4.4;

function legend(s, x, y, items, size = 18) {
  items.forEach(([color, text], k) => {
    s.circle({ x, y: y + k * 40 + 3, d: 18, fill: color });
    s.text(text, { x: x + 30, y: y + k * 40, w: 480, size, color: C.navy });
  });
}

function slide4A(d) {
  const s = d.slide({ title: 'Снижение территориального неравенства закончилось' });
  tag(s, 'Вариант 4А · группы цветом + среднее');
  s.card({ x: 58, y: TOP, w: 1240, h: BOT - TOP });
  s.label('Темп роста реальных доходов за Q1 2026, топ-15 регионов, % г/г', { x: 94, y: 255, w: 1150, color: C.blue });
  const P = { x: 380, y: 330, w: 820, h: 640 };
  const m = s.chart('bar', [{ name: 'Темп роста, % г/г', labels: regN, values: regV }],
    { x: 80, y: 320, w: 1200, h: 660, plot: P, min: 0, max: 26, colors: regN.map(groupColor), gap: 35, legend: false,
      format: '0.0', labelSize: 18, labelBold: true, axisSize: 17 });
  s.seg(m.val(AVG), P.y - 22, m.val(AVG), P.y + P.h, { color: C.navy, width: 2, dash: 'dash' });
  s.text('в среднем по России +4,4%', { x: m.val(AVG) + 8, y: P.y - 34, w: 320, size: 17, bold: true, color: C.navy });

  const X = 1320;
  const Wc = 542;
  s.card({ x: X, y: TOP, w: Wc, h: 330, tint: true });
  s.text('Самые богатые регионы с 2025 года вновь в топе по темпам роста доходов. Также высокие темпы сохраняются в регионах Дальнего Востока',
    { x: X + 30, y: TOP + 30, w: Wc - 60, size: 22, bold: true, lh: 1.2, color: C.navy });
  legend(s, X + 30, TOP + 210, [[C.crimson, 'Москва, Петербург и Подмосковье — 3 из 15'], [C.blue, 'Дальний Восток — 5 из 15'], [MUTED, 'Остальные регионы']], 17);
  [['×5,5', 'Чукотка: рост доходов в 5,5 раза выше среднего по России', C.blue], ['×3,4', 'Москва: в 3,4 раза выше среднего', C.crimson]].forEach(([v, t, col], k) => {
    const y = TOP + 350 + k * 217;
    s.box({ x: X, y, w: Wc, h: 197, fill: col });
    s.text(v, { x: X + 30, y: y + 22, w: 260, size: 64, bold: true, lh: 1.1, color: C.white });
    s.text(t, { x: X + 30, y: y + 112, w: Wc - 60, size: 20, lh: 1.2, color: C.white });
  });
  s.footnote('Источник: Росстат, Реальные денежные доходы населения по субъектам Российской Федерации, 29.07.2026. Кратность к среднему — расчёт OMD');
}

function slide4B(d) {
  const s = d.slide({ title: 'Снижение территориального неравенства закончилось',
    subtitle: 'Самые богатые регионы с 2025 года вновь в топе по темпам роста доходов. Также высокие темпы сохраняются в регионах Дальнего Востока' });
  tag(s, 'Вариант 4Б · точки-леденцы во всю ширину');
  s.card({ x: 58, y: TOP, w: 1804, h: BOT - TOP });
  s.label('Темп роста реальных доходов за Q1 2026, топ-15 регионов, % г/г', { x: 94, y: 252, w: 1100, color: C.blue });
  legend(s, 1300, 248, [[C.crimson, 'Москва, Петербург и Подмосковье'], [C.blue, 'Дальний Восток']], 17);
  const x0 = 430;
  const x1 = 1480;
  const vx = (v) => x0 + (x1 - x0) * v / 26;
  const y0 = 350;
  const pitch = 41;
  s.seg(vx(AVG), y0 - 26, vx(AVG), y0 + pitch * 15 - 10, { color: C.navy, width: 2, dash: 'dash' });
  s.text('среднее по России +4,4%', { x: vx(AVG) + 8, y: y0 - 40, w: 300, size: 16, bold: true, color: C.navy });
  regN.forEach((n, i) => {
    const y = y0 + i * pitch + pitch / 2;
    const col = groupColor(n);
    const hot = col !== MUTED;
    s.text(n, { x: 94, y: y - 12, w: x0 - 30 - 94, size: 18, bold: hot, color: hot ? C.navy : C.blueText, align: 'right' });
    s.seg(x0, y, vx(regV[i]), y, { color: hot ? col : C.line, width: hot ? 4 : 3 });
    s.circle({ x: vx(regV[i]) - 12, y: y - 12, d: 24, fill: col });
    s.text(fmt(regV[i]), { x: vx(regV[i]) + 20, y: y - 13, w: 80, size: 19, bold: true, color: C.navy });
  });
  // пояснения у двух лидеров
  const note = (i, text, col) => {
    const y = y0 + i * pitch + pitch / 2;
    const x = vx(regV[i]) + 95;
    s.text(text, { x, y: y - 13, w: 1830 - x, size: 18, bold: true, color: col });
  };
  note(0, '← в 5,5 раза выше среднего', C.blue);
  note(1, '← в 3,4 раза выше среднего', C.crimson);
  // итоги в свободном правом нижнем углу
  [['5 из 15', 'регионов топа — Дальний Восток', C.blue], ['3 из 15', 'Москва, Петербург и Подмосковье', C.crimson]].forEach(([v, t, col], k) => {
    const x = 1160 + k * 345;
    const y = 640;
    s.box({ x, y, w: 325, h: 300, fill: col });
    s.text(v, { x: x + 26, y: y + 26, w: 280, size: 60, bold: true, lh: 1.1, color: C.white });
    s.text(t, { x: x + 26, y: y + 116, w: 270, size: 20, lh: 1.25, color: C.white });
  });
  s.footnote('Источник: Росстат, Реальные денежные доходы населения по субъектам Российской Федерации, 29.07.2026. Кратность к среднему — расчёт OMD');
}

// ===================== Слайд 5: розница =====================
const RET = chartData(5);                       // 30 месяцев янв.24 … июн.26, 4 серии
const S = Object.fromEntries(RET.series.map((x) => [x.name, x.values]));
const N = RET.labels.length;
const SPIKE = [26, 29];                          // мар.26 … июн.26
const YEARS = [['2024', 12], ['2025', 12], ['2026', 6]];
const TXT1 = 'В марте 2026 сыграло роль снижение ключевой ставки, а также стремление населения купить авто до повышения цены за счет нового утильсбора';
const TXT2 = 'Также влияет отложенный спрос (замедление в январе-феврале), относительное восстановление кредитов весной и начало расходования сбережений';

function numMark(s, x, y, n, color = C.crimson) {
  s.badge({ x, y, d: 40, n, color, size: 22 });
}

function slide5A(d) {
  const s = d.slide({ title: 'Новый всплеск оборота розницы' });
  tag(s, 'Вариант 5А · одна главная линия');
  s.card({ x: 58, y: TOP, w: 1330, h: BOT - TOP });
  s.label('Динамика оборота товаров и услуг, % г/г', { x: 94, y: 255, w: 1200, color: C.blue });
  const P = { x: 150, y: 390, w: 1040, h: 520 };
  const m = chartMap('line', N, P, -2, 18);
  // сетка и шкала
  [0, 5, 10, 15].forEach((v) => {
    s.seg(P.x, m.val(v), P.x + P.w, m.val(v), { color: v === 0 ? C.line : 'E6EEF8', width: v === 0 ? 2 : 1.25 });
    s.text(`${v}%`.replace('0%', v === 0 ? '0' : '0%'), { x: P.x - 64, y: m.val(v) - 11, w: 54, size: 15, color: C.blueText, align: 'right' });
  });
  // два периода: ② январь–февраль 2026, ① март–июнь 2026
  const band = (i1, i2, color, n) => {
    const bx = m.cat(i1) - m.step / 2;
    const bw = m.cat(i2) + m.step / 2 - bx;
    s.box({ x: bx, y: 320, w: bw, h: P.y + P.h - 320, fill: color, transparency: 90, r: 0 });
    numMark(s, bx + bw / 2 - 20, 330, n, color);
  };
  band(24, 25, C.navy, 2);
  band(SPIKE[0], SPIKE[1], C.crimson, 1);
  const order = ['Продукты', 'Общепит', 'Услуги', 'Товары'];
  s.chart('line', order.map((k) => ({ name: k, labels: RET.labels, values: S[k] })),
    { x: 80, y: 340, w: 1260, h: 600, plot: P, min: -2, max: 18, values: false, legend: false, lineSize: 2, symbol: 'none',
      colors: [MUTED, MUTED, MUTED, C.crimson], extra: { catAxisHidden: true } });
  const tv = S['Товары'];
  for (let i = 0; i < N - 1; i++) s.seg(m.cat(i), m.val(tv[i]), m.cat(i + 1), m.val(tv[i + 1]), { color: C.crimson, width: 4.5 });
  s.circle({ x: m.cat(N - 1) - 9, y: m.val(tv[N - 1]) - 9, d: 18, fill: C.crimson });
  // подписи в конце линий вместо легенды (текст — цветом текста, линия несёт цвет)
  order.forEach((k) => {
    const v = S[k][N - 1];
    const hero = k === 'Товары';
    s.text(`**${fmt(v)}** ${k.toLowerCase()}`, { x: m.cat(N - 1) + 18, y: m.val(v) - (hero ? 15 : 12), w: 175, size: hero ? 22 : 17,
      bold: hero, color: hero ? C.navy : C.blueText });
  });
  yearAxis(s, m, YEARS, m.val(-2) + 14);

  // справа: цифра всплеска, два объяснения, прогноз
  const X = 1410;
  const Wc = 452;
  s.box({ x: X, y: TOP, w: Wc, h: 170, fill: C.crimson });
  s.text(`${fmt(tv[25])}% → ${fmt(tv[26])}%`, { x: X + 28, y: TOP + 24, w: Wc - 56, size: 48, bold: true, lh: 1.1, color: C.white });
  s.text('товары: февраль → март 2026', { x: X + 28, y: TOP + 106, w: Wc - 56, size: 20, color: C.white });
  [[1, C.crimson, TXT1], [2, C.navy, TXT2]].forEach(([n, col, t], k) => {
    const y = TOP + 190 + k * 210;
    s.card({ x: X, y, w: Wc, h: 190, tint: k === 0 });
    numMark(s, X + 22, y + 22, n, col);
    s.text(t, { x: X + 78, y: y + 22, w: Wc - 100, h: 150, size: 17, lh: 1.22, color: C.navy, fit: true, minSize: 15 });
  });
  s.box({ x: X, y: TOP + 610, w: Wc, h: BOT - TOP - 610, fill: C.blue });
  s.text('+0,8', { x: X + 28, y: TOP + 628, w: 160, size: 54, bold: true, lh: 1.1, color: C.white });
  s.text('Прогноз 2026\n(Минэкономразвития)', { x: X + 200, y: TOP + 642, w: Wc - 220, size: 18, lh: 1.2, color: C.white });
  s.footnote('Источник: Росстат');
}

function slide5B(d) {
  const s = d.slide({ title: 'Новый всплеск оборота розницы' });
  tag(s, 'Вариант 5Б · четыре мини-графика');
  const cards = [['Товары', C.crimson], ['Общепит', C.blue], ['Продукты', C.blue], ['Услуги', C.blue]];
  const gap = 22;
  const cw = (1804 - gap * 3) / 4;
  const ch = 610;
  cards.forEach(([k, col], i) => {
    const x = 58 + i * (cw + gap);
    const hero = i === 0;
    s.card({ x, y: TOP, w: cw, h: ch, tint: hero });
    s.label(k, { x: x + 28, y: TOP + 28, w: cw - 56, size: 22, color: hero ? C.crimson : C.blue });
    const last = S[k][N - 1];
    s.text(`${fmt(last)}%`, { x: x + 28, y: TOP + 62, w: 220, size: 54, bold: true, lh: 1.1, color: C.navy });
    s.text('июнь 2026, г/г', { x: x + 28, y: TOP + 124, w: 220, size: 16, color: C.blueText });
    const P = { x: x + 64, y: TOP + 190, w: cw - 92, h: 350 };
    const m = chartMap('line', N, P, -2, 18);
    const bx = m.cat(SPIKE[0]) - m.step / 2;
    s.box({ x: bx, y: P.y - 8, w: m.cat(SPIKE[1]) + m.step / 2 - bx, h: P.h + 8, fill: C.crimson, transparency: 90, r: 0 });
    [0, 10].forEach((v) => {
      s.seg(P.x, m.val(v), P.x + P.w, m.val(v), { color: v === 0 ? C.line : 'E6EEF8', width: v === 0 ? 1.5 : 1.25 });
      s.text(v === 0 ? '0' : '10%', { x: P.x - 50, y: m.val(v) - 10, w: 42, size: 14, color: C.blueText, align: 'right' });
    });
    s.chart('line', [{ name: k, labels: RET.labels, values: S[k] }],
      { x: x + 10, y: P.y - 10, w: cw - 20, h: P.h + 20, plot: P, min: -2, max: 18, values: false, legend: false,
        lineSize: hero ? 3.5 : 2.5, symbol: 'none', colors: [col], extra: { catAxisHidden: true } });
    s.circle({ x: m.cat(N - 1) - 7, y: m.val(last) - 7, d: 14, fill: col });
    yearAxis(s, m, YEARS, P.y + P.h + 12, { size: 14 });
  });
  // нижняя полоса: объяснения и прогноз
  const y = TOP + ch + 22;
  const h = BOT - y;
  const w3 = [700, 700, 1804 - 1400 - gap * 2];
  let x = 58;
  [[1, C.crimson, TXT1], [2, C.navy, TXT2]].forEach(([n, col, t], k) => {
    s.card({ x, y, w: w3[k], h, tint: k === 0 });
    numMark(s, x + 26, y + 26, n, col);
    s.text(t, { x: x + 86, y: y + 26, w: w3[k] - 112, h: h - 44, size: 20, lh: 1.25, color: C.navy, fit: true, minSize: 16 });
    x += w3[k] + gap;
  });
  s.box({ x, y, w: w3[2], h, fill: C.blue });
  s.text('+0,8', { x: x + 28, y: y + 20, w: 160, size: 54, bold: true, lh: 1.1, color: C.white });
  s.text('Прогноз 2026 (Минэкономразвития)', { x: x + 28, y: y + 96, w: w3[2] - 56, size: 18, color: C.white });
  s.footnote('Источник: Росстат. Заливка — март–июнь 2026');
}

module.exports = { 3: [slide3A, slide3B], 4: [slide4A, slide4B], 5: [slide5A, slide5B] };
