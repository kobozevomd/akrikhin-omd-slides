// Клиндовит · стратегия 2027 — часть A: слайды исходника 1–4
// (обложка, цели и задачи 2027, digital compete, OLV и e-com коммуникации конкурентов)
const path = require('path');
const { execFileSync } = require('child_process');
const { C, ACCENTS, CHART_COLORS, columns, IN, PT, chartMap, textWidth, fitSize, countLines, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT, MUTED, GRID, fmt, pct, statTile, numMark, legend, yearAxis, gridY
const SRC = path.join(__dirname, '..', '..', '..', 'work', 'brands', 'clindovit', 'src');
const MEDIA = path.join(SRC, 'media');
const SOURCE_PPTX = path.join(__dirname, '..', '..', '..', 'work', 'brands', 'clindovit', 'source.pptx');

const TOP = V.TOP;          // 221 — верх контента
const BOT = V.BOT;          // 1005 — низ контента без плашки
const MUTED = '93AACB';     // фоновый бренд 1 (сине-серый)
const MUTED2 = '64BEE8';    // фоновый бренд 2 (голубой)

// ---------- помощники ----------
const charts = (n) => require(path.join(SRC, `slide-${String(n).padStart(2, '0')}.json`))
  .shapes.filter((sh) => sh.t === 'CHART').map((sh) => sh.chart);
const f2 = (v) => v.toFixed(2).replace('.', ',');
const f1 = (v) => v.toFixed(1).replace('.', ',');
const hex = (n) => Math.round(n).toString(16).padStart(2, '0');
// смешение цветов: t = 0 → a, t = 1 → b
const mix = (a, b, t) => [0, 2, 4].map((k) => hex(parseInt(a.substr(k, 2), 16) * (1 - t) + parseInt(b.substr(k, 2), 16) * t)).join('').toUpperCase();
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

// файл из исходного .pptx (видео креативов и их обложки не выгружены в media/)
function fromSource(entry) {
  return execFileSync('unzip', ['-p', SOURCE_PPTX, entry], { maxBuffer: 64 * 1024 * 1024 });
}

module.exports = {
  // ===================== 1. Обложка =====================
  1: (d) => {
    const s = d.cover({ title: 'Clindovit' });
    s.text('Strategic approach 2027 by OMD', { x: 296, y: 716, w: 1328, size: 44, lh: 1.1, color: C.white, align: 'center' });
  },

  // ===================== 2. Цели и задачи 2027 =====================
  // В исходнике — картинка во весь слайд (2×2 карточки с 3D-иллюстрациями); текст перенесён живым, иллюстрации — иконками
  2: (d) => {
    const s = d.slide({ title: 'Цели и задачи Клиндовит на 2027 год' });
    const cols = columns(4, { gap: 24 });
    const TILE = 250;
    const goals = [
      { icon: 'tb:TbChartBar', t: 'Бизнес',
        d: 'Удержать рынок в упаковках на уровне 2026 года и показать рост в деньгах.' },
      { icon: 'target', t: 'Маркетинговая задача',
        // «POME» — латиницей (на картинке исходника не отличить от кириллицы; вероятно paid / owned / media / earned — уточнить у автора)
        d: 'Сохранить позиционирование Клиндовит гель как понятного и доступного решения для легкой и средней степени акне, усиливая его роль в POME.' },
      { icon: 'tb:TbMessages', t: 'Коммуникация',
        d: 'В коммуникации транслировать ключевые УТП бренда: эффективность и антибактериальное действие, удобство благодаря форме геля, а также выгодную цену.' },
      { icon: 'tb:TbBrain', t: 'Бренд-метрики' },
    ];
    goals.forEach((g, i) => {
      const c = cols[i];
      const col = ACCENTS[i];
      const { cx, cy, cw } = s.numberedCard({ x: c.x, y: TOP, w: c.w, h: BOT - TOP, n: i + 1, color: col });
      s.tile({ x: cx, y: cy, w: cw, h: TILE, color: col, icon: g.icon, iconSize: 64, text: g.t, size: 32, textH: 76 });
      const ty = cy + TILE + 34;
      if (g.d) {
        s.text(g.d, { x: cx, y: ty, w: cw, h: BOT - 36 - ty, size: 27, lh: 1.25, fit: true, minSize: 20 });
        return;
      }
      // бренд-метрики: две цели по знанию и использованию
      const kpi = [
        ['Рост знания', '**[[+2 п.п.]]** до **[[48%]]**'],
        ['Рост использования', '**[[+2 п.п.]]** до **[[25%]]**'],
      ];
      let y = ty;
      kpi.forEach(([lbl, val], k) => {
        if (k > 0) { s.hline(cx, y, cw); y += 26; }
        y += s.text(lbl, { x: cx, y, w: cw, size: 27, lh: 1.2, color: C.blueText }) + 4;
        // кегль — по ширине жирного начертания (цифры жирные), чтобы строка не переносилась
        const vs = fitSize(typo(tr(val)).replace(/\*\*|\[\[|\]\]/g, ''), 54, 34, cw, 1, true);
        y += s.text(val, { x: cx, y, w: cw, size: vs, lh: 1.1, color: C.navy, accent: col }) + 28;
      });
    });
  },

  // ===================== 3. Digital compete =====================
  3: (d) => {
    const s = d.slide({
      title: 'Clindovit / Digital compete',
      subtitle: 'Зеркалин лидирует по digital-бюджетам, делая ставку на Paid Search, тогда как Базирон и Дифферин концентрируются преимущественно на Online Video и удерживают позиции в категории',
    });
    const all = charts(3);
    const salesC = all.find((c) => c.type === 'COLUMN_CLUSTERED');
    const budC = all.find((c) => c.type === 'LINE_MARKERS');
    const splitC = all.find((c) => c.type === 'BAR_STACKED_100');
    // бренды: свой — синий, лидер digital-бюджетов Зеркалин — малиновый, остальные — приглушённые
    const B = [
      { key: 'clindovit', name: 'Клиндовит', color: C.blue, ink: C.white,
        sales: 'Клиндовит — продажи, млн ₽', share: 'Клиндовит — доля продаж, %', split: 'Клиндовит' },
      { key: 'zer', name: 'Зеркалин', color: C.crimson, ink: C.white,
        sales: 'Зеркалин — продажи, млн ₽', share: 'Зеркалин — доля продаж, %', split: 'Зеркалин' },
      { key: 'basiron', name: 'Базирон', color: MUTED, ink: C.navy,
        sales: 'Базирон — продажи, млн ₽', share: 'Базирон — доля продаж, %', split: 'Базирон' },
      { key: 'differin', name: 'Дифферин', color: MUTED2, ink: C.navy,
        sales: 'Дифферин — продажи, млн ₽', share: 'Дифферин — доля продаж, %', split: 'Дифферин' },
    ];
    const pick = (series, key) => series.find((sr) => sr.name.toLowerCase().includes(key)).values;
    const salesP = salesC.plots.find((p) => p.type === 'BarPlot').series;
    const shareP = salesC.plots.find((p) => p.type === 'LinePlot').series;
    const sales = B.map((b) => pick(salesP, b.key));                       // 17 мес.: янв 2025 – май 2026, млн ₽
    const share = B.map((b) => pick(shareP, b.key).map((v) => v * 100));   // доля продаж в деньгах, %
    const budget = B.map((b) => pick(budC.plots[0].series, b.key));        // 20 мес.: янв 2025 – авг 2026, млн ₽
    const N = 20;
    const NS = 17;
    const cats = (n) => Array.from({ length: n }, (_, i) => `${String((i % 12) + 1).padStart(2, '0')}.${i < 12 ? 2025 : 2026}`);

    // ---- левая карточка: продажи, доля, digital-бюджет на общей оси месяцев ----
    const LW = 1314;                       // ширина левой колонки
    const A = { x: 58, y: TOP, w: LW, h: 815 - TOP };
    s.card(A);
    s.label('Динамика инвестиций в digital-медиа и продаж', { x: 94, y: 249, w: 700, color: C.blue });
    V.legend(s, 800, 247, B.map((b) => [b.color, b.name]), { dir: 'row', gap: 136, size: 17 });
    const X0 = 240;
    const X1 = A.x + A.w - 28;
    const step = (X1 - X0) / N;
    const m = chartMap('col', N, { x: X0, w: step * N, y: 0, h: 1 }, 0, 1);
    const NAME_X = 120;
    const rowName = (b, k, y) => {
      s.circle({ x: 100, y: y + 5, d: 12, fill: b.color });
      s.text(b.name, { x: NAME_X, y: y + 1, w: X0 - NAME_X - 6, size: 15, bold: k === 0, color: C.navy });
    };

    // ряд 1: продажи, млн ₽ — накопленные столбцы с подписями в сегментах
    const P2 = { x: X0, w: step * NS, y: 296, h: 186 };
    const tot = sales[0].map((_, i) => sales.reduce((a, sr) => a + sr[i], 0));
    const SMAX = Math.ceil(Math.max(...tot));
    s.text('Продажи, млн\u00a0₽', { x: 94, y: P2.y, w: X0 - 104, size: 17, bold: true, color: C.navy });
    const GAP = 26;
    const m2 = s.chart('col', B.map((b, k) => ({ name: b.sales, labels: cats(NS), values: sales[k].map((v) => +v.toFixed(2)) })),
      { x: P2.x - 10, y: P2.y - 10, w: P2.w + 20, h: P2.h + 20, plot: P2, min: 0, max: SMAX, stacked: true, gap: GAP,
        colors: B.map((b) => b.color), legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
    const barW = step / (1 + GAP / 100);
    for (let i = 0; i < NS; i++) {
      let cum = 0;
      B.forEach((b, k) => {
        const v = sales[k][i];
        const yc = m2.val(cum + v / 2);
        cum += v;
        s.text(f1(v), { x: m2.cat(i) - barW / 2 - 4, y: yc - 9, w: barW + 8, size: 14, bold: k === 0, color: b.ink, align: 'center' });
      });
    }
    s.seg(P2.x, P2.y + P2.h, X0 + step * N, P2.y + P2.h, { color: C.line, width: 1.5 });

    // ряд 2: доля продаж, % — строки чисел
    const RH1 = 22;
    const ySH = 524;
    s.text('Доля продаж, %', { x: 94, y: ySH - 28, w: 600, size: 17, bold: true, color: C.navy });
    s.box({ x: X0, y: ySH, w: step * NS, h: RH1, fill: C.cardTint, r: 4 });
    share.forEach((vals, k) => {
      const y = ySH + k * RH1;
      rowName(B[k], k, y);
      vals.forEach((v, i) => s.text(f1(v), { x: m.cat(i) - step / 2, y: y + 2, w: step, size: 14, bold: k === 0,
        color: k === 0 ? C.navy : C.blueText, align: 'center' }));
    });

    // ряд 3: digital-бюджет, млн ₽ — тепловая полоса (интенсивность цвета бренда)
    const RH2 = 25;
    const yBU = ySH + 4 * RH1 + 40;
    const hBU = 'Digital-бюджет, млн ₽';
    s.text(hBU, { x: 94, y: yBU - 28, w: 600, size: 17, bold: true, color: C.navy });
    s.badge({ x: 94 + textWidth(typo(tr(hBU)), 17, true) + 12, y: yBU - 28, d: 22, n: 3, color: C.crimson, size: 13 });
    const VMAX = 2;
    budget.forEach((vals, k) => {
      const y = yBU + k * RH2;
      rowName(B[k], k, y + 1);
      vals.forEach((v, i) => {
        const f = Math.min(1, v / VMAX) ** 0.8 * 0.92;
        const hot = k === 1 && (i === 14 || i === 17);     // пики Зеркалина в марте и июне 2026 — из Key takeaways
        s.box({ x: m.cat(i) - step / 2 + 1.5, y: y + 1.5, w: step - 3, h: RH2 - 3, fill: mix('FFFFFF', B[k].color, f), r: 4,
          stroke: hot ? C.navy : undefined, sw: 2.5 });
        // белые цифры — только на насыщенной заливке: на светло-розовой/голубой (0,85; 0,93; 1,20…) контраст белого < 3
        s.text(f2(v), { x: m.cat(i) - step / 2, y: y + 4, w: step, size: 14, bold: k === 0 || hot,
          color: f > 0.75 ? C.white : C.navy, align: 'center' });
      });
    });
    // граница 2025 | 2026 и ось месяцев
    const yEnd = yBU + 4 * RH2;
    const xYear = m.cat(12) - step / 2;
    s.seg(xYear, P2.y - 6, xYear, yEnd + 4, { color: C.line, width: 1.5, dash: 'dash' });
    const yM = yEnd + 8;
    for (let i = 0; i < N; i++) s.text(MONTHS[i % 12], { x: m.cat(i) - step / 2, y: yM, w: step, size: 14, color: C.blueText, align: 'center' });
    V.yearAxis(s, { ...m, step }, [['2025', 12], ['2026', 8]], yM + 21, { size: 16 });

    // ---- левая нижняя карточка: доля инвестиций по каналам (100%) ----
    const Bc = { x: 58, y: 833, w: LW, h: BOT - 833 };
    s.card(Bc);
    const LBL = 'Доля инвестиций по каналам';
    s.label(LBL, { x: 94, y: Bc.y + 22, w: 520, color: C.blue });
    const CH = [
      { name: 'Online Video', key: 'online video', color: C.navy, ink: C.white },
      { name: 'Paid Search', key: 'paid search', color: C.cyan, ink: C.navy },
      { name: 'Banners', key: 'banners', color: C.orange, ink: C.white },
      { name: 'Paid Social', key: 'paid social', color: C.green, ink: C.white },
      { name: 'e-mail Marketing (CRM)', key: 'e-mail', color: C.purple, ink: C.white },
      { name: 'Affiliate / CPA', key: 'affil', color: 'C9D6E6', ink: C.navy },
    ];
    const sp = splitC.plots[0];
    const siteIdx = B.map((b) => sp.cats.findIndex((c) => c.toLowerCase().includes(b.key)));
    const val = (ch, k) => sp.series.find((sr) => sr.name.toLowerCase().includes(ch.key)).values[siteIdx[k]];
    // легенда каналов в строке метки (ширины — по переведённому тексту)
    let lsz = 15;
    const lw = (sz) => CH.reduce((a, ch) => a + 14 + 7 + textWidth(tr(ch.name), sz, false) + 20, 0) - 20;
    const lx0 = 94 + textWidth(tr(LBL).toUpperCase(), 22, true) + 40;
    while (lsz > 13 && lx0 + lw(lsz) > X1) lsz -= 1;
    let lx = X1 - lw(lsz);
    CH.forEach((ch) => {
      s.box({ x: lx, y: Bc.y + 26, w: 14, h: 14, fill: ch.color, r: 3 });
      const tw = textWidth(tr(ch.name), lsz, false);
      s.text(ch.name, { x: lx + 21, y: Bc.y + 24, w: tw + 6, size: lsz, color: C.navy });
      lx += 14 + 7 + tw + 20;
    });
    const PB = { x: X0, y: Bc.y + 62, w: X1 - X0, h: 4 * 24 };
    const GB = 32;
    const mb = s.chart('bar', CH.map((ch) => ({ name: ch.name, labels: B.map((b) => b.split), values: B.map((_, k) => +val(ch, k).toFixed(4)) })),
      { x: PB.x - 10, y: PB.y - 6, w: PB.w + 20, h: PB.h + 12, plot: PB, min: 0, max: 1, percent: true, gap: GB,
        colors: CH.map((ch) => ch.color), legend: false, values: false, extra: { catAxisHidden: true, catAxisLineShow: false } });
    const marks = { 1: 2, 2: 1, 3: 1 };        // строка бренда → номер вывода (Зеркалин — 2, Базирон и Дифферин — 1)
    B.forEach((b, k) => {
      const yc = mb.cat(k);
      if (marks[k]) s.badge({ x: 90, y: yc - 11, d: 22, n: marks[k], color: C.crimson, size: 13 });
      s.text(b.name, { x: NAME_X, y: yc - 9, w: X0 - NAME_X - 6, size: 15, bold: k === 0, color: C.navy });
      let cum = 0;
      CH.forEach((ch) => {
        const v = val(ch, k);
        const xc = PB.x + PB.w * (cum + v / 2);
        cum += v;
        if (v >= 0.015) s.text(`${Math.round(v * 100)}%`, { x: xc - 30, y: yc - 9, w: 60, size: 14, bold: true, color: ch.ink, align: 'center' });
      });
    });

    // ---- правая колонка ----
    const X = 58 + LW + 20;
    const Wc = 1862 - X;
    const totals = [[1, '16,4 млн ₽', 16.4], [0, '4,9 млн ₽', 4.9], [2, '1 млн ₽', 1], [3, '0,6 млн ₽', 0.6]];   // как в исходнике
    const hA = 252;
    s.card({ x: X, y: TOP, w: Wc, h: hA });
    s.label('Digital budgets*', { x: X + 30, y: TOP + 28, w: Wc - 60, color: C.blue });
    const bx0 = X + 160;
    const bw = Wc - 30 - 160 - 120;
    totals.forEach(([k, t, v], r) => {
      const y = TOP + 70 + r * 38;
      s.text(B[k].name, { x: X + 30, y: y + 3, w: 125, size: 17, bold: k === 0, color: C.navy });
      const w = Math.max(4, bw * v / 16.4);
      s.box({ x: bx0, y: y + 2, w, h: 26, fill: B[k].color, r: 4 });
      s.text(t, { x: bx0 + w + 10, y: y + 2, w: 130, size: 18, bold: true, color: C.navy });
    });
    s.text('Estimated by DigitalBudget', { x: X + 30, y: TOP + hA - 36, w: Wc - 60, size: 14, color: C.blueText });

    const yB = TOP + hA + 18;
    s.card({ x: X, y: yB, w: Wc, h: BOT - yB });
    s.label('Key takeaways', { x: X + 30, y: yB + 28, w: Wc - 60, color: C.crimson });
    const tk = [
      'У Базирона и Дифферина подавляющая доля digital-инвестиций приходится на **Online Video (96% и 94% соответственно)** — это указывает на фокус на охват, знание и прогрев аудитории. Такая стратегия направлена на расширение базы потребителей и формирование первичного интереса к брендам.',
      'У лидера категории по бюджету Зеркалина (**16,4\u00a0млн\u00a0₽**) сплит разделен между **Paid Search (56%)**, Online Video (34%) и Banners (8%), что соответствует перформанс-ориентированной стратегии.',
      'В весенне-летний период 2026 года Зеркалин демонстрирует стабильно высокий уровень инвестиций с пиком **в марте (1,66\u00a0млн\u00a0₽) и июне (1,67\u00a0млн\u00a0₽)**. При этом Клиндовит сохраняет умеренную, но стабильную медийную активность (**0,1–0,3\u00a0млн\u00a0₽ в месяц**), поддерживая постоянное присутствие в категории.',
    ];
    const TX = X + 30 + 34;
    const TW = Wc - 60 - 34;
    const avail = BOT - 22 - (yB + 66);
    let tsz = 17;
    const need = (sz) => tk.reduce((a, t) => a + countLines(typo(tr(t)).replace(/\*\*/g, ''), sz, TW, false) * sz * 1.2, 0) + 2 * 16;
    while (tsz > 15 && need(tsz) > avail) tsz -= 1;
    let ty = yB + 66;
    tk.forEach((t, k) => {
      s.badge({ x: X + 30, y: ty, d: 22, n: k + 1, color: C.crimson, size: 13 });
      ty += s.text(t, { x: TX, y: ty - 1, w: TW, size: tsz, lh: 1.2, color: C.navy }) + 16;
    });

    s.footnote('Источник: DigitalBudget, IQVIA. Доля инвестиций по каналам — Estimated by DigitalBudget, not all channels accepted to monitoring. * Бюджет за весь период: январь 2025 – август 2026');
  },

  // ===================== 4. OLV и e-com коммуникации =====================
  4: (d) => {
    const s = d.slide({
      title: 'Clindovit / OLV & E-COM коммуникации брендов',
      subtitle: 'В OLV бренды фокусируются на эмоциональных креативах под ЦА, в e-com бренды используют размещения на сайтах e-аптек и скидки для стимулирования покупки',
    });
    const PAD = 30;
    const img = (file, x, y, w, h) => s.image(path.join(MEDIA, file), { x, y, w, h });

    // ---- OLV: два видео, 16:9 без обрезки ----
    const OW = 480;
    s.card({ x: 58, y: TOP, w: OW, h: BOT - TOP });
    s.label('OLV', { x: 58 + PAD, y: TOP + 26, w: 200, color: C.blue });
    const vx = 58 + PAD;
    const vw = OW - 2 * PAD;
    const vh = vw * 9 / 16;
    const videos = [
      { name: 'Зеркалин', text: 'Креатив ориентирован на молодую женскую и мужскую аудиторию',
        media: 'ppt/media/media1.mp4', cover: 'ppt/media/image33.png', alt: 'Зеркалин — видео' },
      { name: 'Базирон', text: 'Кампания с креативом для женской ЦА и упоминанием сайта бренда',
        media: 'ppt/media/media2.mp4', cover: 'ppt/media/image34.png', alt: 'Базирон — видео' },
    ];
    let y = TOP + 70;
    videos.forEach((v) => {
      s.icon('tb:TbPlayerPlayFilled', { x: vx, y: y - 1, size: 30, color: C.white, circle: C.crimson });
      y += s.text(v.name, { x: vx + 40, y, w: vw - 40, size: 23, bold: true, color: C.navy }) + 6;
      y += s.text(v.text, { x: vx, y, w: vw, size: 18, lh: 1.2, color: C.blueText }) + 14;
      try {
        const cover = 'data:image/png;base64,' + fromSource(v.cover).toString('base64');
        const video = 'video/mp4;base64,' + fromSource(v.media).toString('base64');
        s.s.addMedia({ type: 'video', data: video, cover, extn: 'mp4', x: IN(vx), y: IN(y), w: IN(vw), h: IN(vh), objectName: tr(v.alt) });
      } catch (e) {
        s.warn('видео', v.name, 'не удалось взять видео из source.pptx: ' + e.message);
      }
      y += vh + 30;
    });
    if (y - 30 > BOT - 20) s.warn('OLV', 'видео', `блок OLV выходит за низ карточки: ${Math.round(y - 36)}px`);

    // ---- E-COM: креативы на сайтах e-аптек ----
    const EXc = 58 + OW + 20;
    const EWc = 1862 - EXc;
    s.card({ x: EXc, y: TOP, w: EWc, h: BOT - TOP });
    s.label('E-COM', { x: EXc + PAD, y: TOP + 26, w: 200, color: C.blue });
    const EX = EXc + PAD;
    const EW = EWc - 2 * PAD;
    const EY = TOP + 74;
    const EB = BOT - PAD;
    const HH = 64;          // заголовок группы: бренд + площадки
    const G = 14;           // между картинками внутри группы
    const GG = 40;          // между группами
    const GV = 30;          // между верхним рядом и Зеркалином
    // пропорции файлов (высота / ширина)
    const R = { sq: 1, bThin: 200 / 1565, bMid: 383 / 1326, d1: 428 / 816, d2: 420 / 1230, cl: 800 / 480, z: 200 / 1565 };
    const kB = R.sq + R.bThin + R.bMid;
    const kD = R.d1 + R.d2;
    // подбор: Базирон и Дифферин одной высоты, Зеркалин — во всю их ширину снизу
    let wl = EW - 400;
    let TH = 0;
    let wb = 0;
    let wd = 0;
    for (let it = 0; it < 12; it++) {
      TH = (EB - EY) - 2 * HH - GV - wl * R.z;
      wb = (TH - 2 * G) / kB;
      wd = (TH - G) / kD;
      wl = wb + GG + wd;
    }
    const group = (name, sites, x, yy, w, own) => {
      s.text(name, { x, y: yy, w, size: 23, bold: true, color: own ? C.blue : C.navy });
      s.icon('tb:TbShoppingCart', { x, y: yy + 34, size: 20, color: C.blueText });
      s.text(sites, { x: x + 26, y: yy + 34, w: w - 26, size: 17, color: C.blueText });
    };
    // Базирон
    let gy = EY + HH;
    group('Базирон', 'AptekaRu · Eapteka · Zdravcity', EX, EY, wb);
    img('img_78dbc32e64.png', EX, gy, wb, wb * R.sq); gy += wb * R.sq + G;
    img('img_60adcf67fd.png', EX, gy, wb, wb * R.bThin); gy += wb * R.bThin + G;
    img('img_4829f6923f.png', EX, gy, wb, wb * R.bMid);
    // Дифферин
    const DX = EX + wb + GG;
    gy = EY + HH;
    group('Дифферин', 'Eapteka · Zdravcity', DX, EY, wd);
    img('img_3b2e0ca28e.png', DX, gy, wd, wd * R.d1); gy += wd * R.d1 + G;
    img('img_fffe604553.jpg', DX, gy, wd, wd * R.d2);
    // Зеркалин — снизу во всю ширину пары
    const zh = wl * R.z;
    const ZY = EB - zh - HH;
    group('Зеркалин', 'AptekaRu', EX, ZY, wl);
    img('img_50879c296c.png', EX, EB - zh, wl, zh);
    // Клиндовит — выделенная панель справа
    const CX = EX + wl + GG;
    const CW = EX + EW - CX;
    s.box({ x: CX, y: EY - 16, w: CW, h: EB - EY + 16, fill: C.cardTint, stroke: C.line, sw: 2 });
    const CP = 24;
    group('Клиндовит', 'Eapteka', CX + CP, EY, CW - 2 * CP, true);
    const chMax = EB - CP - (EY + HH);
    const cw = Math.min(CW - 2 * CP, chMax / R.cl);
    img('img_0a372b8549.png', CX + (CW - cw) / 2, EY + HH, cw, cw * R.cl);

    s.footnote('Источник: Mediascope, OLV desktop, eSov, январь 2025 – август 2026');
  },
};
