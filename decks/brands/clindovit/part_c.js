// Клиндовит · стратегия 2027 — часть C: слайды исходника 8–11 (в исходнике — картинки во весь слайд,
// пересобраны живым текстом; тексты прочитаны по увеличенным фрагментам картинок).
// 8 — бизнес-вызов → наше решение + три шага;
// 9 — сезонность поискового спроса: тепловая таблица 2025 – июнь 2026 + 4 вывода (скрытый слайд);
// 10 — три приоритетных сегмента (фото вырезаны из картинки исходника) + новые слои и потребности;
// 11 — медиа-стратегия 2027: три направления + таймлайн периодов.
const path = require('path');
const { C, ACCENTS, CHART_COLORS, columns, IN, PT, chartMap, textWidth, fitSize, countLines, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT, MUTED, GRID, fmt, pct, statTile, numMark, legend, yearAxis, gridY
const SRC = path.join(__dirname, '..', '..', '..', 'work', 'brands', 'clindovit', 'src');
const MEDIA = path.join(SRC, 'media');
const CROPS = path.join(SRC, 'crops');

const TOP = V.TOP;   // 221 — верх контента
const BOT = V.BOT;   // 1005 — низ контента (нижней плашки на этих слайдах нет)
const X0 = 58;
const X1 = 1862;

// Высота текста так же, как её оценивает s.text — по переведённой строке (tr), чтобы EN-сборка
// пересчитывала геометрию под свой текст
const plainTr = (text) => typo(tr(String(text))).replace(/\*\*|\[\[|\]\]/g, '');
// Название сегмента в переводе не влезло в строку — переносим перед возрастом («Young women / 18–25»), а не внутри «18–25»
const ageBreak = (t, w, size) => {
  const v = tr(t);
  if (v === t || v.includes('\n') || countLines(v, size, w, true) <= 1) return v;
  return v.replace(/ (?=\d+–\d+$)/, '\n');
};
const measure = (text, w, size = 18, bold = false, lh = 1.2) =>
  Math.round(countLines(plainTr(text), size, w, bold) * size * lh);

// Смешение цвета с белым: k = 0 — белый, 1 — исходный цвет
function tintOf(hex, k) {
  const c = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return c.map((v) => Math.round(255 + (v - 255) * k).toString(16).padStart(2, '0')).join('').toUpperCase();
}

// Иконка в цветном кружке + жирный заголовок + пояснение справа; возвращает высоту строки
function iconRow(s, { x, y, w, icon, color, title, text, d = 44, gap = 16, tSize = 18, bSize = 16, titleColor = C.navy }) {
  s.icon(icon, { x, y, size: d, circle: color });
  const tx = x + d + gap;
  const tw = w - d - gap;
  let h = 0;
  if (title) h += s.text(title, { x: tx, y, w: tw, size: tSize, bold: true, lh: 1.15, color: titleColor });
  if (text) h += (title ? 4 : 0) + s.text(text, { x: tx, y: y + h + (title ? 4 : 0), w: tw, size: bSize, lh: 1.2, color: C.blueText });
  return Math.max(d, h);
}
function iconRowH({ w, title, text, d = 44, gap = 16, tSize = 18, bSize = 16 }) {
  const tw = w - d - gap;
  let h = 0;
  if (title) h += measure(title, tw, tSize, true, 1.15);
  if (text) h += (title ? 4 : 0) + measure(text, tw, bSize);
  return Math.max(d, h);
}

module.exports = {
  // =====================================================================
  // 8 · Бизнес-вызов → наше решение → три шага
  // =====================================================================
  8: (d) => {
    const s = d.slide({ title: 'Бизнес-вызов и наше решение' });
    const pad = 40;
    const iw = X1 - X0 - pad * 2;
    // бизнес-вызов — главная мысль слайда, крупно
    const chal = 'Переломить негативный тренд и сохранить долю рынка [[в\u00a0упаковках]] при ограниченном бюджете.';
    const chSize = 50;
    const labY = TOP + 34;
    const chY = labY + 22 + 20;
    const chH = measure(chal, iw, chSize, true, 1.1);
    const chB = chY + chH + 34;
    s.card({ x: X0, y: TOP, w: X1 - X0, h: chB - TOP });
    s.label('Бизнес-вызов', { x: X0 + pad, y: labY, w: iw, color: C.crimson });
    s.text(chal, { x: X0 + pad, y: chY, w: iw, size: chSize, bold: true, lh: 1.1, color: C.navy });

    // стрелка к решению
    const aY = chB + 8;
    const aLen = 34;
    s.arrow({ dir: 'down', x: 960, y: aY, len: aLen, head: 44, headLen: 22, stem: 12 });

    // наше решение
    const sol = '**Концентрируемся на [[ядре аудитории]]**, дополняя новыми слоями в коммуникации. [[**Фокус на проверенных и эффективных инструментах**]], которые уже доказали эффективность, и выходим с охватным усилением [[**в ключевые периоды спроса**]].';
    const solSize = 26;
    const sY = aY + aLen + 8;
    const sLabY = sY + 32;
    const sTxtY = sLabY + 22 + 18;
    const solH = measure(sol, iw, solSize, false, 1.3);
    const sB = sTxtY + solH + 30;
    s.card({ x: X0, y: sY, w: X1 - X0, h: sB - sY, tint: true });
    s.label('Наше решение', { x: X0 + pad, y: sLabY, w: iw, color: C.blue });
    s.text(sol, { x: X0 + pad, y: sTxtY, w: iw, size: solSize, lh: 1.3, color: C.navy, accent: C.blue });

    // три шага решения
    const steps = [
      { icon: 'tb:TbUsers', color: C.blue, title: 'Фокус на ядре аудитории',
        text: 'Работаем с основными сегментами, дополняя коммуникацию новыми потребительскими слоями.' },
      { icon: 'tb:TbChartArrowsVertical', color: C.crimson, title: 'Фокус на проверенных и эффективных инструментах и таргетингах',
        text: 'Усиливаем инструменты, которые уже доказали эффективность и приносят результат.' },
      { icon: 'tb:TbCalendarEvent', color: C.purple, title: 'Охватное усиление в ключевые периоды спроса',
        text: 'Выходим с широкой коммуникацией в моменты наибольшей востребованности категории.' },
    ];
    const sy = sB + 24;
    const cols = columns(3, { gap: 23 });
    const sp = 34;
    const ic = 72;
    const cw = cols[0].w - sp * 2;
    const hSize = 26;
    const bSize = 20;
    const hH = Math.max(...steps.map((st) => measure(st.title, cw, hSize, true, 1.12)));
    const hY = sy + sp + ic + 24;
    steps.forEach((st, i) => {
      const { x, w } = cols[i];
      s.card({ x, y: sy, w, h: BOT - sy });
      s.icon(st.icon, { x: x + sp, y: sy + sp, size: ic, circle: st.color });
      s.text(`0${i + 1}`, { x: x + sp + ic + 20, y: sy + sp + (ic - 44) / 2, w: 120, size: 40, bold: true, lh: 1.1, color: st.color });
      s.text(st.title, { x: x + sp, y: hY, w: cw, size: hSize, bold: true, lh: 1.12, color: C.navy });
      s.text(st.text, { x: x + sp, y: hY + hH + 12, w: cw, size: bSize, lh: 1.25, color: C.blueText });
    });
  },

  // =====================================================================
  // 9 · Сезонность поискового спроса (скрытый слайд)
  // =====================================================================
  9: (d) => {
    const s = d.slide({ title: 'Сезонность поискового спроса в категории' });
    s.s.hidden = true;
    // тыс. запросов в месяц (Wordstat), 2025 янв–дек + 2026 янв–июн — прочитано с картинки исходника
    const M = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек', 'янв', 'фев', 'мар', 'апр', 'май', 'июн'];
    const DATA = [
      ['Категория'],
      ['Акне', [422, 406, 438, 401, 582, 490, 446, 457, 412, 446, 458, 421, 434, 378, 434, 409, 389, 401]],
      ['Прыщи', [2303, 2121, 2278, 2186, 2213, 2280, 2443, 2526, 2206, 2287, 2290, 2131, 2128, 1875, 2175, 2155, 2087, 2186]],
      ['Бренды'],
      ['Базирон', [70, 61, 67, 63, 62, 65, 74, 88, 74, 79, 76, 75, 73, 68, 77, 72, 78, 98]],
      ['Клиндовит', [61, 60, 66, 63, 60, 63, 72, 77, 67, 65, 66, 57, 56, 52, 59, 58, 59, 71]],
      ['Дифферин', [67, 64, 50, 47, 58, 54, 59, 86, 68, 67, 72, 66, 71, 59, 76, 65, 76, 91]],
    ];
    // подсветка по строке: максимум — малиновый, минимум — синий, остальные — оттенок по месту между ними
    const HI = C.crimson;
    const LO = C.blue;
    const cell = (v, vals) => {
      const lo = Math.min(...vals);
      const hi = Math.max(...vals);
      if (v === hi) return { text: String(v), fill: HI, color: C.white, bold: true, align: 'center' };
      if (v === lo) return { text: String(v), fill: LO, color: C.white, bold: true, align: 'center' };
      const t = (v - lo) / (hi - lo);
      const fill = t >= 0.5 ? tintOf(HI, 0.08 + (t - 0.5) * 0.6) : tintOf(C.cyan, 0.08 + (0.5 - t) * 0.6);
      return { text: String(v), fill, color: C.navy, align: 'center' };
    };
    const NAMEW = 196;
    const MW = Math.floor((X1 - X0 - NAMEW) / 18);
    const nameW = X1 - X0 - MW * 18;
    const rows = [
      [{ text: '' }, { text: '2025', colspan: 12 }, { text: '2026', colspan: 6 }],
      [{ text: 'Показатель', fill: C.cardTint, color: C.navy }, ...M.map((m) => ({ text: m, fill: C.cardTint, color: C.navy, align: 'center' }))],
    ];
    const rowH = [42, 40];
    DATA.forEach(([name, vals]) => {
      if (!vals) {
        rows.push([{ text: name, colspan: 19, fill: C.tint, color: C.navy, bold: true }]);
        rowH.push(38);
      } else {
        rows.push([{ text: name, color: C.navy, bold: name === 'Клиндовит' }, ...vals.map((v) => cell(v, vals))]);
        rowH.push(53);
      }
    });
    s.table(rows, { x: X0, y: TOP, w: X1 - X0, colW: [nameW, ...Array(18).fill(MW)], rowH, size: 17 });
    const tH = rowH.reduce((a, b) => a + b, 0);
    // граница 2025 | 2026
    s.vline(X0 + nameW + MW * 12, TOP, tH, C.navy, 2.5);

    // легенда подсветки
    const ly = TOP + tH + 14;
    const legendItems = [[HI, 'максимум в строке'], [LO, 'минимум в строке']];
    let lx = X1;
    [...legendItems].reverse().forEach(([col, txt]) => {
      const tw = Math.ceil(textWidth(plainTr(txt), 15, false)) + 8;
      lx -= tw;
      s.text(txt, { x: lx, y: ly, w: tw, size: 15, lh: 1.0, color: C.blueText });
      lx -= 26;
      s.box({ x: lx, y: ly, w: 18, h: 16, fill: col, r: 4 });
      lx -= 28;
    });

    // четыре вывода
    const cy = ly + 34;
    const cols = columns(4, { gap: 23 });
    const pad = 24;
    const bd = 44;
    const insights = [
      { lead: 'Категория формирует два сезонных окна спроса: [[весна и конец лета]].',
        body: 'В 2025 году заметные пики приходятся на май и июль–август; в 1ПГ\u00a02026 весенняя волна была заметнее **в марте и мае**.' },
      { lead: 'Средний месяц 1ПГ\u00a02026 vs 1ПГ\u00a02025:',
        stats: [['«акне»', '−10,8%'], ['«прыщи»', '−5,8%']],
        body: 'Несмотря на более сдержанную базу, весенний всплеск 2026 подтверждает сезонное оживление категории.' },
      { lead: '**В брендах лидеры растут быстрее:** средний месяц 1ПГ\u00a02026 vs 1ПГ\u00a02025 —',
        stats: [['Базирон', '+20,0%'], ['Дифферин', '+28,7%'], ['Клиндовит', '−4,8%', C.crimson]],
        body: 'Для Клиндовита важно прицельно усиливать знание бренда, чтобы догонять конкурентов.' },
      { lead: '**Ключевые периоды для усиления коммуникации:** [[**весна**]] как первая волна спроса и [[**конец лета**]] как второй сезонный пик.',
        body: 'Коммуникацию важно выводить заранее —\nсо 2-й декады июля, чтобы войти\nв август–сентябрь, уже с накопленным присутствием.' },
    ];
    insights.forEach((it, i) => {
      const { x, w } = cols[i];
      s.card({ x, y: cy, w, h: BOT - cy });
      s.badge({ x: x + pad, y: cy + pad, d: bd, n: i + 1, color: C.blue, size: 24 });
      const lw = w - pad * 2 - bd - 14;
      const leadBold = !/\*\*/.test(it.lead);
      const lh = s.text(it.lead, { x: x + pad + bd + 14, y: cy + pad + 2, w: lw, size: 18, bold: leadBold, lh: 1.2, color: C.navy });
      let y = cy + pad + Math.max(bd, lh + 2) + 14;
      if (it.stats) {
        it.stats.forEach(([lab, val, col]) => {
          s.text(lab, { x: x + pad, y: y + 9, w: 170, size: 18, lh: 1.0, color: C.navy });
          s.text(val, { x: x + pad + 160, y, w: w - pad * 2 - 160, size: 34, bold: true, lh: 1.0, color: col ?? C.blue });
          y += 46;
        });
        y += 4;
      }
      s.text(it.body, { x: x + pad, y, w: w - pad * 2, size: 18, lh: 1.2, color: C.blueText });
    });

    s.footnote('Источник: Wordstat, анализ динамики поискового спроса по категории и брендам, 2025 — июнь 2026. Значения в таблице — тыс. запросов.');
  },

  // =====================================================================
  // 10 · Три приоритетных сегмента + новые слои и потребности
  // =====================================================================
  10: (d) => {
    const s = d.slide({
      title: 'Сохраняем фокус на трёх приоритетных сегментах',
      subtitle: 'Усиливаем коммуникацию с учётом их потребностей и барьеров, чтобы укрепить позиции Клиндовита в момент выбора',
    });
    const segs = [
      { name: 'Девушки 18–25', color: C.crimson, photo: 'c_seg1.png',
        quote: '«Когда прыщи появляются на моем лице, я хочу средство, которое сразу же уберет их».',
        needs: [['tb:TbBolt', '**Ключевое желание** — быстро убрать появившиеся прыщи.'],
          ['tb:TbUsersGroup', '**Сильный социальный дискомфорт:** прыщи влияют на уверенность, общение, фото и самоощущение.']] },
      { name: 'Матери 35–55\nподростков 12–17', color: C.blue, photo: 'c_seg2.png',
        quote: '«Моему ребенку нужно быстрое и хорошее средство от прыщей, потому что вижу, как они влияют на его настроение и состояние».',
        needs: [['tb:TbShieldPlus', '**Главная потребность** — найти быстрое и хорошее средство для ребенка.'],
          ['tb:TbHeart', '**Мама — главный инициатор и принимающий решение.**']] },
      { name: 'Женщины 25–40', color: C.purple, photo: 'c_seg3.png',
        quote: '«У меня нет времени на эти прыщи, я хочу средство, которое поможет мне убрать их как можно скорее».',
        needs: [['tb:TbClock', '**Нет времени на прыщи** — важно быстрое и рабочее решение, чтобы не выпадать из привычного ритма жизни, работы и встреч.'],
          ['tb:TbRefresh', '**Устала от повторного проявления прыщей:** не хочет снова проходить круг экспериментов и искать, что сработает.']] },
    ];
    const cols = columns(3, { gap: 23 });
    const pad = 26;
    const PW = 195;                 // фото 3:4 (вырезка 330×440)
    const PH = 260;
    const bd = 48;
    const leftW = cols[0].w - pad * 2 - PW - 18;
    const nameSize = 26;
    segs.forEach((g) => { g.name = ageBreak(g.name, leftW - bd - 14, nameSize); });
    const nameH = Math.max(...segs.map((g) => measure(g.name, leftW - bd - 14, nameSize, true, 1.1)));
    const qY = TOP + pad + Math.max(bd, nameH) + 18;
    // потребности: строки на одной высоте во всех колонках
    const nIn = 18;
    const nw = cols[0].w - pad * 2 - nIn * 2;
    const nd = 44;
    const needH = [0, 1].map((k) => Math.max(...segs.map((g) => iconRowH({ w: nw, text: g.needs[k][1], d: nd, gap: 14, bSize: 17 }))));
    const boxY = TOP + pad + PH + 20;
    const boxH = nIn + needH[0] + 18 + needH[1] + nIn;
    const cardB = boxY + boxH + pad - 6;
    segs.forEach((g, i) => {
      const { x, w } = cols[i];
      s.card({ x, y: TOP, w, h: cardB - TOP });
      s.image(path.join(CROPS, g.photo), { x: x + w - pad - PW, y: TOP + pad, w: PW, h: PH, alt: g.name.replace('\n', ' ') });
      s.badge({ x: x + pad, y: TOP + pad, d: bd, n: i + 1, color: g.color, size: 26 });
      s.text(g.name, { x: x + pad + bd + 14, y: TOP + pad + (nameH < bd ? (bd - nameH) / 2 : 0), w: leftW - bd - 14, size: nameSize, bold: true, lh: 1.1, color: C.navy });
      s.text(g.quote, { x: x + pad, y: qY, w: leftW, h: boxY - 12 - qY, size: 22, lh: 1.25, color: C.navy, fit: true, minSize: 18 });
      s.box({ x: x + pad, y: boxY, w: w - pad * 2, h: boxH, fill: tintOf(g.color, 0.08) });
      let y = boxY + nIn;
      g.needs.forEach(([icon, text], k) => {
        iconRow(s, { x: x + pad + nIn, y, w: nw, icon, color: g.color, text, d: nd, gap: 14, bSize: 17 });
        y += needH[k] + 18;
      });
    });

    // полоса «Новые слои и потребности»
    const sy = cardB + 22;
    const sh = BOT - sy;
    s.card({ x: X0, y: sy, w: X1 - X0, h: sh, tint: true });
    const LW = 330;
    s.text('**Новые слои и потребности,**\nкоторые могут усилить коммуникацию Клиндовита',
      { x: X0 + 34, y: sy + 30, w: LW, h: sh - 60, size: 26, lh: 1.15, color: C.navy, fit: true, minSize: 22 });
    const layers = [
      { icon: 'tb:TbRefresh', color: C.crimson, title: 'Помогает, пока пользуюсь',
        text: 'Часть аудитории сообщает о возвращении проблемы после курса и временности эффекта.' },
      { icon: 'tb:TbBottle', color: C.blue, title: 'Переход от косметики к лекарству',
        text: 'Многие начинают с ухода и самостоятельных экспериментов (умывалки, маски, косметика), но при отсутствии заметного результата переходят к аптечным средствам или врачу.' },
      { icon: 'tb:TbShieldCheck', color: C.purple, title: 'Желание быстро убрать прыщи конкурирует со страхом переборщить',
        text: 'Пользователи хотят ускорить результат, иногда наносят средство в большем количестве и получают раздражение. Этот страх важно снять в коммуникации Клиндовита.' },
    ];
    const lc = columns(3, { x0: X0 + 34 + LW + 30, x1: X1 - 24, gap: 18 });
    const lp = 22;
    const ld = 46;
    const ltW = lc[0].w - lp * 2 - ld - 14;
    const ltH = Math.max(...layers.map((l) => measure(l.title, ltW, 19, true, 1.15)));
    layers.forEach((l, i) => {
      const { x, w } = lc[i];
      const by = sy + 18;
      s.box({ x, y: by, w, h: sh - 36, fill: C.white, stroke: C.line, sw: 1.5 });
      s.icon(l.icon, { x: x + lp, y: by + lp, size: ld, circle: l.color });
      s.text(l.title, { x: x + lp + ld + 14, y: by + lp + (ltH < ld ? (ld - ltH) / 2 : 0), w: ltW, size: 19, bold: true, lh: 1.15, color: l.color });
      const ty = by + lp + Math.max(ld, ltH) + 12;
      s.text(l.text, { x: x + lp, y: ty, w: w - lp * 2, h: by + sh - 36 - lp + 6 - ty, size: 18, lh: 1.2, color: C.blueText, fit: true, minSize: 16 });
    });

    s.footnote('* Свежий анализ с фильтром ORM подтверждает все 3 сегмента');
  },

  // =====================================================================
  // 11 · Медиа-стратегия Клиндовит 2027
  // =====================================================================
  11: (d) => {
    const s = d.slide({
      title: 'Медиа-стратегия Клиндовит 2027',
      subtitle: 'Фокус на: точности таргетинга, эффективных инструментах и ключевом тайминге.',
    });
    const cols = columns(3, { gap: 23 });
    const pad = 28;
    const bd = 56;
    const cw = cols[0].w - pad * 2;
    const hw = cw - bd - 16;
    const hSize = 24;
    const items = { d: 42, gap: 14, tSize: 18, bSize: 16 };
    const data = [
      { color: C.blue, title: 'Концентрируемся на самых ценных контактах',
        lead: 'Работаем с тремя приоритетными сегментами и усиливаемся в ключевые периоды, когда спрос на решение особенно высок.',
        rows: [
          { icon: 'tb:TbUsers', title: '3 приоритетных сегмента', text: 'с релевантными сообщениями и форматами.' },
          { icon: 'tb:TbCalendarEvent', title: 'Два ключевых периода спроса',
            bullets: ['**Март–май** — подготовка к лету.', '**Август–сентябрь** — возвращение к привычному ритму и учёбе (BTS).', '**Старт кампании — со 2-й декады июля,** чтобы быть заметными перед пиком.'] },
          { icon: 'tb:TbTarget', title: 'Перехватываем сформированный спрос', text: 'в течение всего года через поиск.' },
        ] },
      { color: C.crimson, tint: true, title: 'Фокус на проверенных и эффективных инструментах и таргетингах',
        lead: 'Основной бюджет — в проверенные инструменты, которые приводят аудиторию и влияют на выбор.',
        rows: [
          { icon: 'tb:TbSearch', title: 'Поиск', text: 'Перехватываем тех, кто уже ищет решение.' },
          { icon: 'tb:TbAd2', title: 'Баннерная реклама', text: 'Последовательно напоминаем о бренде и догоняем тех, кто сомневается.' },
          { icon: 'tb:TbUserStar', title: 'Блогеры', text: 'Дополнительный охват и доверие через реальные истории.' },
        ],
        box: 'Максимально используем проверенные инструменты и фокусируемся на результате.' },
      { color: C.purple, title: 'Обогащаем коммуникацию новыми слоями',
        lead: 'Базовые сообщения уже неизменно остаются ядром. Новые приоритетные слои усиливают их, помогая снять дополнительные барьеры перед выбором.',
        rows: [
          { icon: 'tb:TbRefresh', title: '«Помогает, пока пользуешься»', text: 'Рассказываем, что Клиндовит помогает быстро решить проблему, передаем эстафету длительного ухода Азелик.' },
          { icon: 'tb:TbBottle', title: '«От косметики к лекарству»', text: 'Объясняем, когда стоит перейти от ухода к лечению и почему это разумное решение.' },
          { icon: 'tb:TbShieldCheck', title: '«Хочу быстрее, но боюсь переборщить»', text: 'Снижаем страх раздражения и даём понятные рекомендации по применению.' },
        ],
        formats: { title: 'Используем форматы, которые помогают раскрыть эти темы:',
          list: [['tb:TbMessages', 'Отзывы и репутация'], ['tb:TbArticle', 'Статьи и нативный контент'], ['tb:TbUser', 'Блогеры и эксперты'], ['tb:TbSparkles', 'GEO и ИИ-поиск']] } },
    ];
    const cardB = 826;
    const hH = Math.max(...data.map((c) => measure(c.title, hw, hSize, true, 1.1)));
    const topBlock = Math.max(bd, hH);
    const leadY = TOP + pad + topBlock + 14;
    const leadH = Math.max(...data.map((c) => measure(c.lead, cw, 16, false, 1.2)));
    const rowY0 = leadY + leadH + 18;
    const bulletW = cw - items.d - items.gap - 20;
    data.forEach((c, i) => {
      const { x, w } = cols[i];
      const cx = x + pad;
      s.card({ x, y: TOP, w, h: cardB - TOP, tint: c.tint });
      s.badge({ x: cx, y: TOP + pad, d: bd, n: `0${i + 1}`, color: c.color, size: 24 });
      s.text(c.title, { x: cx + bd + 16, y: TOP + pad + (hH < bd ? (bd - hH) / 2 : 0), w: hw, size: hSize, bold: true, lh: 1.1, color: C.navy });
      s.text(c.lead, { x: cx, y: leadY, w: cw, size: 16, lh: 1.2, color: C.blueText });
      // нижний блок колонки (малиновая плашка / форматы) прижат к низу карточки
      let bottomTop = cardB - pad;
      if (c.box) {
        const bh = measure(c.box, cw - 40 - 52, 17, true, 1.2) + 32;
        bottomTop = cardB - pad - bh;
        s.box({ x: cx, y: bottomTop, w: cw, h: bh, fill: C.crimson });
        s.icon('tb:TbChartBar', { x: cx + 18, y: bottomTop + (bh - 36) / 2, size: 36, color: C.white });
        s.text(c.box, { x: cx + 18 + 36 + 16, y: bottomTop, w: cw - 40 - 52, h: bh, size: 17, bold: true, lh: 1.2, color: C.white, valign: 'middle' });
      }
      if (c.formats) {
        // форматы: сетка 2 × 2, иконка слева от подписи
        const fl = c.formats.list;
        const fgap = 16;
        const fw = (cw - fgap) / 2;
        const fd = 36;
        const labW = fw - fd - 10;
        const cellH = Math.max(fd, ...fl.map(([, t]) => measure(t, labW, 16, false, 1.15)));
        const capH = measure(c.formats.title, cw, 16, true, 1.2);
        const fh = capH + 12 + cellH * 2 + 10;
        bottomTop = cardB - pad - fh;
        s.hline(cx, bottomTop - 14, cw);
        s.text(c.formats.title, { x: cx, y: bottomTop, w: cw, size: 16, bold: true, lh: 1.2, color: C.navy });
        fl.forEach(([icon, t], k) => {
          const fx = cx + (k % 2) * (fw + fgap);
          const fy = bottomTop + capH + 12 + Math.floor(k / 2) * (cellH + 10);
          s.icon(icon, { x: fx, y: fy + (cellH - fd) / 2, size: fd, circle: c.color });
          s.text(t, { x: fx + fd + 10, y: fy, w: labW, h: cellH, size: 16, lh: 1.15, color: C.blueText, valign: 'middle' });
        });
        bottomTop -= 14;
      }
      // строки с иконками: свободное место делим поровну между ними
      const rowsH = c.rows.map((r) => (r.bullets
        ? iconRowH({ ...items, w: cw, title: r.title }) + 6 + r.bullets.reduce((a, b) => a + measure(b, bulletW, 16, false, 1.2) + 4, 0)
        : iconRowH({ ...items, w: cw, title: r.title, text: r.text })));
      const free = bottomTop - 16 - rowY0 - rowsH.reduce((a, b) => a + b, 0);
      const g = Math.max(10, Math.min(44, free / (c.rows.length - (c.box || c.formats ? 0 : 1))));
      let y = rowY0;
      c.rows.forEach((r, k) => {
        if (r.bullets) {
          iconRow(s, { ...items, x: cx, y, w: cw, icon: r.icon, color: c.color, title: r.title });
          let by = y + measure(r.title, cw - items.d - items.gap, items.tSize, true, 1.15) + 8;
          const bx = cx + items.d + items.gap;
          r.bullets.forEach((b) => {
            s.circle({ x: bx, y: by + 6, d: 8, fill: c.color });
            const bh = s.text(b, { x: bx + 20, y: by, w: bulletW, size: 16, lh: 1.2, color: C.blueText });
            by += bh + 4;
          });
        } else {
          iconRow(s, { ...items, x: cx, y, w: cw, icon: r.icon, color: c.color, title: r.title, text: r.text });
        }
        y += rowsH[k] + g;
      });
    });

    // таймлайн периодов: цветные плашки-периоды на общей оси со стрелкой
    const ty = cardB + 20;
    const periods = [
      { when: 'Март — май', icon: 'tb:TbPlant', color: C.blue, title: 'Волна спроса', text: 'Подготовка к лету и важным событиям' },
      { when: 'Со 2-й декады июля', icon: 'tb:TbPlayerPlay', color: C.crimson, title: 'Старт кампании', text: 'Наращиваем присутствие перед пиком' },
      { when: 'Август — сентябрь', icon: 'tb:TbChartBar', color: C.purple, title: 'Пиковая волна спроса', text: 'Максимально используем интерес к категории' },
    ];
    const ph = 36;
    s.seg(X0, ty + ph / 2, X1 - 16, ty + ph / 2, { color: C.line, width: 3 });
    s.chevron({ cx: X1 - 8, cy: ty + ph / 2, w: 16, h: 22, color: C.line });
    periods.forEach((p, i) => {
      const { x, w } = cols[i];
      s.box({ x, y: ty, w: w - 70, h: ph, fill: p.color, r: 18 });
      s.text(p.when.toUpperCase(), { x: x + 20, y: ty, w: w - 110, h: ph, size: 17, bold: true, lh: 1.0, color: C.white, valign: 'middle', fit: true, minSize: 14 });
      const iy = ty + ph + 14;
      s.icon(p.icon, { x, y: iy, size: 44, circle: p.color });
      s.text(p.title, { x: x + 58, y: iy - 2, w: w - 58, size: 18, bold: true, lh: 1.15, color: C.navy });
      s.text(p.text, { x: x + 58, y: iy + 22, w: w - 58, size: 16, lh: 1.2, color: C.blueText });
    });
    // постоянный слой — весь год
    const ay = BOT - 46;
    s.box({ x: X0, y: ay, w: X1 - X0, h: 46, fill: C.cardTint, stroke: C.line, sw: 1.5 });
    s.icon('tb:TbRefresh', { x: X0 + 18, y: ay + 7, size: 32, color: C.blue });
    s.text('Работаем с отзывами и перехватываем горячий спрос в течение всего года', { x: X0 + 64, y: ay, w: X1 - X0 - 80, h: 46, size: 19, bold: true, lh: 1.1, color: C.navy, valign: 'middle' });
  },
};
