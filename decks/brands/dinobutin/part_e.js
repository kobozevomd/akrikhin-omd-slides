// Динобутин · стратегия 2027 — часть E: слайды исходника 21–23.
// 21 — AI-production роликов: каркас + сегменты (как Azelik 44; 4 креатива из media — сегменты и их ролики в одной карточке),
// 22 — блогеры 2027 (как Bobotic 25; фото авторов → вырезки crops/e_blogger_*),
// 23 — Paid Search 2027: контур Поиск / РСЯ, доли категорий, РСЯ-сплит, KPI (как Normobact 22 / Bobotic 26).
const path = require('path');
const { C, columns, countLines, textWidth, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common'); // TOP
const D = require('./common');              // MEDIA, CROPS

const { MEDIA, CROPS } = D;
const TOP = V.TOP;      // 221
const BOT0 = 1005;      // низ контента без плашки
const BOT1 = 905;       // низ контента над плашкой
const MUTED_TXT = '6E86AD';
const GREY = '8A9BB3';

// ---------- Локальные хелперы (как в normobact/part_e.js) ----------

// Строка так, как её увидит слайд (перевод + типографика), без разметки
const view = (t) => typo(tr(String(t))).replace(/\*\*|\[\[|\]\]/g, '');
// Высота текста так же, как её оценивает s.text
const measure = (t, w, size = 16, bold = false, lh = 1.2) => Math.round(countLines(view(t), size, w, bold) * size * lh);
const widthOf = (t, size, bold = false) => Math.ceil(textWidth(view(t), size, bold));
const sum = (a) => a.reduce((x, y) => x + y, 0);
// Число строк с учётом **жирных** кусков (как countLines, запас 3%)
const richLines = (t, size, w, bold = false) => {
  const s = typo(tr(String(t))).replace(/\[\[|\]\]/g, '');
  const max = w * 0.97;
  const sp = textWidth(' ', size, bold);
  let lines = 0;
  for (const para of s.split(/\n\n?/)) {
    lines++;
    let b = bold;
    let cur = 0;
    let word = 0;
    let pending = false;
    const flush = () => {
      if (!pending) return;
      if (cur === 0) cur = word;
      else if (cur + sp + word <= max) cur += sp + word;
      else { lines++; cur = word; }
      while (cur > max) { lines++; cur -= max; }
      word = 0;
      pending = false;
    };
    for (let i = 0; i < para.length; i++) {
      if (para.startsWith('**', i)) { b = !b; i++; continue; }
      if (para[i] === ' ') { flush(); continue; }
      word += textWidth(para[i], size, b);
      pending = true;
    }
    flush();
  }
  return lines;
};
// Высота текста с **жирными** кусками
const measureRich = (t, w, size = 16, bold = false, lh = 1.2) => Math.round(Math.max(countLines(view(t), size, w, bold), richLines(t, size, w, bold)) * size * lh);
// Ширина блока, при которой текст занимает столько же строк, но строки ровнее (без висящего слова)
const evenW = (t, w, size, bold = false) => {
  const n = countLines(view(t), size, w, bold);
  if (n < 2 || richLines(t, size, w, bold) > n) return w;
  let lo = w * 0.4;
  let hi = w;
  while (hi - lo > 1) { const m = (lo + hi) / 2; if (richLines(t, size, m, bold) <= n) hi = m; else lo = m; }
  return Math.min(w, Math.ceil(hi) + 4);
};
// Общий кегль для ряда чисел: самый крупный, при котором каждое влезает в свою ширину
const commonSize = (items, max, min, bold = true) => {
  let sz = max;
  while (sz > min && items.some(([t, w]) => widthOf(t, sz, bold) > w * 0.97)) sz -= 1;
  return sz;
};
const pct = (v) => `${String(v).replace('.', ',')}%`;

// Карточка с номером и КАПС-заголовком → y начала контента
function numCard(s, { x, y, w, h, n, color, head, pad = 28, tint = false }) {
  const HD = 44;
  const hw = w - 2 * pad - HD - 14;
  const hh = Math.max(HD, measure(head.toUpperCase(), hw, 21, true, 1.1));
  s.card({ x, y, w, h, tint });
  s.badge({ x: x + pad, y: y + 24 + (hh - HD) / 2, d: HD, n, color, size: 21 });
  s.text(head, { x: x + pad + HD + 14, y: y + 24, w: hw, h: hh, size: 21, bold: true, lh: 1.1, color, caps: true, valign: 'middle' });
  return y + 24 + hh + 18;
}

// Полоса 100%: сегменты { v, c, t? } — ширина по доле от суммы; подпись внутри, если помещается
function shareBar(s, segs, { x, y, w, h = 46, gap = 3, size = 17 }) {
  const total = sum(segs.map((g) => g.v));
  const free = w - gap * (segs.length - 1);
  let bx = x;
  segs.forEach((g, i) => {
    const gw = free * g.v / total;
    s.box({ x: bx, y, w: gw, h, fill: g.c, r: segs.length === 1 ? 10 : (i === 0 || i === segs.length - 1 ? 10 : 0) });
    const t = g.t ?? pct(g.v);
    const ts = widthOf(t, size, true) + 10 <= gw ? size : widthOf(t, 15, true) + 8 <= gw ? 15 : 0;
    if (ts) s.text(t, { x: bx, y, w: gw, h, size: ts, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
    bx += gw + gap;
  });
}

module.exports = {
  // ===================== 21. AI-production роликов =====================
  21: (d) => {
    const s = d.slide({
      title: 'AI-production роликов Динобутин: единый брендовый каркас и разные сообщения по сегментам',
      subtitle: 'Сохраняем узнаваемую визуальную систему бренда, AI используем для быстрого создания вариативных сценариев, кадров и анимаций под разные целевые аудитории',
    });

    // ---- верх слева: принципы производства ----
    const LW = 820;
    let y = TOP;
    y += s.text('Принципы производства AI-роликов', { x: 58, y, w: LW, size: 26, bold: true, lh: 1.1, color: C.navy }) + 8;
    const LEAD = 'Единая логика помогает быстро масштабировать коммуникацию без распада бренда на разные визуальные стили';
    y += s.text(LEAD, { x: 58, y, w: evenW(LEAD, LW, 18), size: 18, lh: 1.2, color: C.navy }) + 16;
    // галочки вручную: строки ровняем evenW, чтобы не висело одно слово
    const PRN = [
      'Фиксируем общий брендовый каркас: визуальный язык, тональность, пэкшот, CTA и фармацевтическая/регуляторная корректность',
      'Меняем только то, что связано с сегментом: инсайт, триггер выбора, жизненный контекст и визуальную метафору',
      'AI ускоряет генерацию раскадровок и анимаций, но человек задаёт стратегию, проверяет референсы и собирает финальный ролик',
    ];
    let cy = y;
    PRN.forEach((t, i) => {
      s.icon('check_circle', { x: 58, y: cy, size: 35, color: C.white, bg: C.blue });
      const h = s.text(t, { x: 58 + 52, y: cy + 1, w: evenW(t, LW - 52, 18), size: 18, lh: 1.2, color: C.blueText });
      cy += Math.max(35, h) + (i < PRN.length - 1 ? 14 : 0);
    });
    const chH = cy - y;
    const topEnd = y + chH;

    // ---- верх справа: рабочая схема адаптации ----
    const SX = 58 + LW + 30;
    const SW = 1862 - SX;
    s.card({ x: SX, y: TOP, w: SW, h: topEnd - TOP + 4 });
    s.label('Рабочая схема адаптации', { x: SX + 30, y: TOP + 26, w: SW - 60, size: 20, color: C.navy });
    const STEPS = [['Сегмент', C.orange], ['Инсайт', C.orange], ['Сценарий', C.orange], ['AI-кадры', C.blue], ['Анимация', C.blue], ['Финал', C.green]];
    const sc = columns(STEPS.length, { x0: SX + 16, x1: SX + SW - 16, gap: 6 });
    const BD = 54;
    const cyy = Math.round((TOP + 60 + topEnd + 4) / 2 - (BD + 12 + 20) / 2);
    s.hline(sc[0].x + sc[0].w / 2, cyy + BD / 2, sc[STEPS.length - 1].x - sc[0].x, C.line, 3);
    STEPS.forEach(([t, col], i) => {
      const c = sc[i];
      s.badge({ x: c.x + c.w / 2 - BD / 2, y: cyy, d: BD, n: i + 1, color: col, size: 24 });
      s.text(t, { x: c.x - 8, y: cyy + BD + 12, w: c.w + 16, size: 17, bold: true, lh: 1.15, color: C.navy, align: 'center', fit: true, maxLines: 2, minSize: 14 });
    });

    // ---- низ: аудиторные сегменты 2027 и их ролики ----
    const ly = topEnd + 30;
    const lw = widthOf('АУДИТОРНЫЕ СЕГМЕНТЫ 2027', 20, true) + 10;
    s.label('Аудиторные сегменты 2027', { x: 58, y: ly, w: lw, size: 20, color: C.navy });
    s.text('Сегмент ЦА', { x: 58 + lw + 16, y: ly + 1, w: 300, size: 17, lh: 1.0, color: MUTED_TXT });
    const cy0 = ly + 36;
    const CH = BOT1 - cy0;
    const cols = columns(4, { gap: 22 });
    const SEGS = [
      { n: 'Сегмент 1', t: 'Повторяющиеся хронические боли и спазмы ЖКТ', c: C.purple, img: 'img_bb10c89aed.png' },
      { n: 'Сегмент 2', t: 'Боли, вздутие, метеоризм на фоне изменения диеты или режима', c: C.orange, img: 'img_07365b9c77.png' },
      { n: 'Сегмент 3', t: '«Стресс-живот»', c: C.blue, img: 'img_35c4b5b468.png' },
      { n: 'Сегмент 4', t: 'Нестабильный стул', c: C.green, img: 'img_3bc8fe652a.png' },
    ];
    const P = 22;
    const IP = 16;                                // ролик шире текста: поля карточки 16
    const tw = cols[0].w - 2 * P;
    const iw = cols[0].w - 2 * IP;
    const tH = Math.max(...SEGS.map((g) => measure(g.t, tw, 20, true, 1.15)));
    const ih = Math.round(iw * 941 / 1672);       // креативы 1672×941, без обрезки
    const IB = 8;                                 // полоса цвета сегмента под роликом, как в исходнике
    SEGS.forEach((g, i) => {
      const { x, w } = cols[i];
      s.card({ x, y: cy0, w, h: CH });
      s.circle({ x: x + P, y: cy0 + P + 1, d: 18, fill: g.c });
      s.text(g.n, { x: x + P + 28, y: cy0 + P, w: tw - 28, size: 16, bold: true, lh: 1.25, color: g.c, caps: true });
      s.text(g.t, { x: x + P, y: cy0 + P + 32, w: evenW(g.t, tw, 20, true), size: 20, bold: true, lh: 1.15, color: C.navy });
      const iy = cy0 + CH - IP - IB - ih;
      s.image(path.join(MEDIA, g.img), { x: x + IP, y: iy, w: iw, h: ih, alt: 'Ролик Динобутин: ' + g.n.toLowerCase() });
      s.box({ x: x + IP, y: iy + ih, w: iw, h: IB, fill: g.c, r: 0 });
    });
    if (cy0 + P + 32 + tH + 14 > cy0 + CH - IP - IB - ih) s.warn('сегменты', SEGS[1].t, 'текст сегмента налезает на ролик');

    s.principle({ label: 'Итог', icon: 'tb:TbRoute', text: 'Сначала утверждаем единые правила серии, затем адаптируем инсайт и визуальную метафору под каждый сегмент — это снижает стоимость вариативности и сохраняет брендовый контроль' });
  },

  // ===================== 22. Блогеры 2027 =====================
  22: (d) => {
    const s = d.slide({
      title: 'Блогеры 2027: встраиваем канал в Comprehensive-подход после теста в Q4 2026',
      subtitle: 'Сегментный автор и сообщение → разрешённая площадка → переход → decision gate между двумя спринтами',
    });

    // --- ряд 1: пять шагов механики ---
    const STEPS = [
      { t: 'Сегмент', d: 'Ж ЦА 25–50 лет, мамы детей с 3\u00a0до 10\u00a0лет, страдающих функциональными нарушениями ЖКТ', c: C.cyan },
      { t: 'Автор + креатив', d: 'Портрет автора под сегмент\nНативный сюжет\nПерсональный продуктовый аргумент', c: C.crimson },
      { t: 'Площадка', d: 'VK — ядро\nMAX — тест\nДзен / RUTUBE — контекст и видео', c: C.blue },
      { t: 'Post-click', d: 'UTM / кликабельная ссылка\nКачество визита\nПереход «Где купить»', c: C.green },
      { t: 'Decision gate', d: 'Спринт 1: валидируем\nСпринт 2: усиливаем касание с ЦА\nНе масштабируем слабые связки', c: C.navy },
    ];
    const scols = columns(5, { gap: 34 });
    const SP = 20;
    const SD = 40;
    const stw = scols[0].w - 2 * SP;
    const stepH = 18 + SD + 10 + Math.max(...STEPS.map((st) => measure(st.d, stw, 16))) + 18;
    STEPS.forEach((st, i) => {
      const { x, w } = scols[i];
      s.card({ x, y: TOP, w, h: stepH });
      s.badge({ x: x + SP, y: TOP + 18, d: SD, n: i + 1, color: st.c, size: 20 });
      s.text(st.t, { x: x + SP + SD + 12, y: TOP + 18, w: w - 2 * SP - SD - 12, h: SD, size: 19, bold: true, lh: 1.0, color: C.navy, caps: true, valign: 'middle', fit: true, maxLines: 1, minSize: 14 });
      s.text(st.d, { x: x + SP, y: TOP + 18 + SD + 10, w: stw, size: 16, lh: 1.2, color: C.blueText });
      if (i < STEPS.length - 1) s.chevron({ cx: x + w + 17, cy: TOP + stepH / 2, dir: 'right', w: 16, h: 26 });
    });

    // --- ряд 2: Telegram и YouTube не закладываем ---
    const BY1 = TOP + stepH + 16;
    const BH1 = 66;
    s.box({ x: 58, y: BY1, w: 1804, h: BH1, fill: 'FCEBEF', r: 15 });
    let bx = 58 + 24;
    [['tb:TbBrandTelegram', 'Telegram'], ['tb:TbBrandYoutube', 'YouTube']].forEach(([ic, alt]) => {
      s.circle({ x: bx, y: BY1 + (BH1 - 38) / 2, d: 38, fill: C.white, stroke: C.crimson, sw: 2 });
      s.icon(ic, { x: bx + 8, y: BY1 + (BH1 - 38) / 2 + 8, size: 22, color: C.crimson, alt });
      bx += 38 + 10;
    });
    const NO = '2027: Telegram и YouTube не закладываем в медиаплан';
    const now = Math.min(widthOf(NO, 20, true) + 8, 700);
    s.text(NO, { x: bx + 8, y: BY1, w: now, h: BH1, size: 20, bold: true, lh: 1.1, color: C.crimson, valign: 'middle', fit: true, maxLines: 2, minSize: 16 });
    const fx = bx + 8 + now + 28;
    s.vline(fx, BY1 + 14, BH1 - 28, C.crimson, 1.5);
    s.text('ФАС обозначила переходный период для рекламы на этих ресурсах только до конца 2026 года. Альтернативы ниже позволяют сохранять кликабельную ссылку и post-click измерение.',
      { x: fx + 24, y: BY1 + 6, w: 1862 - 24 - (fx + 24), h: BH1 - 12, size: 16, lh: 1.2, color: C.navy, valign: 'middle', fit: true, minSize: 14 });

    // --- ряд 3: сплит площадок · портреты блогеров ---
    const y3 = BY1 + BH1 + 24;
    const L = { x: 58, w: 860 };
    const R = { x: 58 + 860 + 24, w: 1862 - (58 + 860 + 24) };
    s.label('Рекомендуемый сплит площадок', { x: L.x, y: y3, w: L.w, size: 20, color: C.navy });
    const plw = widthOf('ПОРТРЕТЫ БЛОГЕРОВ', 20, true) + 10;
    s.label('Портреты блогеров', { x: R.x, y: y3, w: plw, size: 20, color: C.navy });
    const SEL = 'Отбираем по соответствию конкретному CJM-сегменту, естественности опыта и способности дать измеримый переход';
    const sx = R.x + plw + 18;
    const sw = 1862 - sx;
    s.vline(sx - 10, y3, 40, C.line, 1.5);
    const selH = s.text(SEL, { x: sx + 8, y: y3 - 1, w: evenW(SEL, sw - 8, 17), size: 17, lh: 1.2, color: C.blueText });
    const cY = y3 + Math.max(24, selH) + 14;
    const cH = BOT0 - cY;

    // сплит: доля бюджета · площадка · роль
    const SPL = [
      { v: '67%', t: 'VK', d: 'Основной охват + видео/посты. В форматах без внешнего клика — связка с кликабельным постом.', c: C.blue },
      { v: '13%', t: 'RUTUBE', d: 'Тест новой площадки: тематические каналы, видео/пост, встроенные внешние ссылки.', c: C.crimson },
      { v: '13%', t: 'Дзен', d: 'Нативные разборы и рутины; длинный контакт + прямой переход на бренд/аптеку.', c: C.green },
      { v: '7%', t: 'MAX', d: 'Видео у авторов и тематические размещения; ссылка в описании/сопровождающем материале.', c: C.cyan },
    ];
    // карточка сплита начинается сразу под своей меткой, низ — общий с карточками блогеров
    const lY = cY;
    const lH = BOT0 - lY;
    s.card({ x: L.x, y: lY, w: L.w, h: lH });
    const LP = 26;
    const CHW = 96;
    const CHH = 52;
    const ltx = L.x + LP + CHW + 22;
    const ltw = L.x + L.w - LP - ltx;
    const rh = SPL.map((p) => Math.max(CHH, 24 + 4 + measure(p.d, ltw, 17)));
    const lgap = (lH - 2 * 24 - sum(rh)) / (SPL.length - 1);
    let ly = lY + 24;
    SPL.forEach((p, i) => {
      if (i) s.hline(ltx, ly - lgap / 2, ltw);
      s.box({ x: L.x + LP, y: ly + (rh[i] - CHH) / 2, w: CHW, h: CHH, fill: p.c, r: 12 });
      s.text(p.v, { x: L.x + LP, y: ly + (rh[i] - CHH) / 2, w: CHW, h: CHH, size: 26, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
      s.text(p.t, { x: ltx, y: ly, w: ltw, size: 21, bold: true, lh: 1.0, color: C.navy });
      s.text(p.d, { x: ltx, y: ly + 28, w: evenW(p.d, ltw, 17), size: 17, lh: 1.2, color: C.blueText });
      ly += rh[i] + lgap;
    });

    // блогеры: имя · фото · подписчики · ожидаемый охват
    const AU = [
      { name: 'Nika.family', img: 'e_blogger_nika.png', subs: '175,5 тыс.', reach: '120 тыс.' },
      { name: 'Daniel_Official', img: 'e_blogger_daniel.png', subs: '231,1 тыс.', reach: '60 тыс.' },
      { name: 'Emyasheva Life', img: 'e_blogger_emyasheva.png', subs: '114,6 тыс.', reach: '50 тыс.' },
    ];
    const acols = columns(3, { x0: R.x, x1: 1862, gap: 20 });
    const AP = 16;
    const aw = acols[0].w - 2 * AP;
    const LS = 16;
    const STATS = [['subs', 'подписчиков', C.navy], ['reach', 'ожидаемый охват', C.crimson]];
    // значение и подпись в одну строку (как Bobotic 25); общий кегль цифр — чтобы встали все строки
    const vs = commonSize(AU.flatMap((a) => STATS.map(([k, l]) => [a[k], aw - widthOf(l, LS) - 12])), 26, 20);
    const statH = vs;
    const RG = 10;
    const fixedH = AP + 24 + 10 + 14 + 2 * statH + RG + AP;
    const PR = 0.78;                                  // вырезки 780×1000
    const ph = Math.min(Math.round(aw / PR), cH - fixedH);
    const pw = Math.round(ph * PR);
    AU.forEach((a, i) => {
      const { x, w } = acols[i];
      s.card({ x, y: cY, w, h: cH });
      s.text(a.name, { x: x + AP, y: cY + AP, w: aw, size: 20, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 15 });
      const py = cY + AP + 24 + 10;
      s.image(path.join(CROPS, a.img), { x: x + (w - pw) / 2, y: py, w: pw, h: ph, alt: a.name });
      let sy = py + ph + 14;
      STATS.forEach(([k, l, col]) => {
        const vw = widthOf(a[k], vs, true) + 4;
        s.text(a[k], { x: x + AP, y: sy, w: vw, size: vs, bold: true, lh: 1.0, color: col });
        s.text(l, { x: x + AP + vw + 6, y: sy + Math.round((vs - LS) * 0.72), w: aw - vw - 6, size: LS, lh: 1.0, color: C.blueText });
        sy += statH + RG;
      });
    });

    s.footnote('ФАС России — переходный период по Telegram/YouTube до конца 2026; DIDENOK TEAM / Sostav, август 2026; eLama + Telega.in / Sostav, июнь 2026. Эстимация — плановый ориентир; состав АК/ОРД/продакшна внутри 4,5 млн ₽ требует финального подтверждения.', { size: 13 });
    s.notes('Emyasheva Life — https://vk.ru/emyasheva_life\nDaniel_Official — https://vk.ru/public_daniel_official');
  },

  // ===================== 23. Paid Search 2027 =====================
  23: (d) => {
    const s = d.slide({
      title: 'Paid Search 2027: от структуры спроса к покупке',
      subtitle: 'Search — конверсионное ядро; РСЯ — поддерживающий audience-layer. Оптимизируем не по клику, а по движению к покупке.',
    });

    // --- контур Paid Search 2027: Поиск 83% / РСЯ 17% ---
    const KH = 52;
    const KL = 'Контур Paid Search 2027';
    const klw = widthOf(KL, 21, true) + 8;
    s.text(KL, { x: 58, y: TOP, w: klw, h: KH, size: 21, bold: true, lh: 1.0, color: C.navy, valign: 'middle' });
    shareBar(s, [{ v: 83, c: C.blue, t: '83% · Поиск' }, { v: 17, c: C.green, t: '17% · РСЯ' }], { x: 58 + klw + 28, y: TOP, w: 1862 - (58 + klw + 28), h: KH, gap: 4, size: 20 });

    const CY = TOP + KH + 22;
    const LC = { x: 58, w: 1190 };
    const RC = { x: LC.x + LC.w + 22, w: 1862 - (LC.x + LC.w + 22) };
    const PAD = 28;
    const L = { x: LC.x + PAD, w: LC.w - 2 * PAD };
    const R = { x: RC.x + PAD, w: RC.w - 2 * PAD };

    // карточки и подстрочники; полосы долей в обеих карточках — на одной высоте
    const y0 = Math.max(
      numCard(s, { ...LC, y: CY, h: BOT1 - CY, n: 1, color: C.blue, head: 'Поиск: доли выкупаемых категорий запросов' }),
      numCard(s, { ...RC, y: CY, h: BOT1 - CY, n: 2, color: C.green, head: 'РСЯ: отдельный сплит' }));
    const SUBL = 'Бюджетный сплит — по ёмкости спроса и фактической эффективности по CPA';
    const SUBR = 'Сокращаем долю РСЯ в общей коммуникации\nна 25–30%: качество трафика стабильно ниже Search';
    const sl = s.text(SUBL, { x: L.x, y: y0 - 4, w: L.w, size: 17, lh: 1.2, color: MUTED_TXT });
    const sr = s.text(SUBR, { x: R.x, y: y0 - 4, w: R.w, size: 17, lh: 1.2, color: MUTED_TXT });
    const BY = y0 - 4 + Math.max(sl, sr) + 14;
    const BH = 50;

    // плашки внизу карточек: принцип 2027 (Поиск) и роль РСЯ — одной высоты
    const IC = 46;
    const PL = 'Принцип 2027';
    const PT = 'Бренд — отдельный контур видимости; категория / симптомы / конкуренты оптимизируются по CR / CPA. Транзакционный спрос ведём напрямую в e-pharm.';
    const plw = widthOf(PL, 19, true) + 8;
    const ptx = L.x + 6 + IC + 18 + plw + 24;
    const ptw = L.x + L.w - 16 - ptx;
    const ROLE = '**Роль РСЯ:** ремаркетинг + дополнительный контакт, а не основной performance-driver';
    const rw = R.w - IC - 18 - 8;
    const ph = Math.max(IC, measure(PT, ptw, 18), measureRich(ROLE, rw, 18)) + 32;
    const py = BOT1 - 22 - ph;

    // ряды: плитки категорий (слева) и строки РСЯ-сплита (справа) — на общих строках
    const top = BY + BH + 22;
    const TG = 18;
    const th = (py - 22 - top - TG) / 2;
    const rowY = (r) => top + r * (th + TG);

    // --- 1. Поиск: доли выкупаемых категорий запросов ---
    {
      const { x, w } = L;
      const SEG = [
        { v: 5.1, t: 'Бренд', ex: 'Динобутин / инструкция / гель', c: C.blue },
        { v: 24.1, t: 'Категория', ex: 'боль в животе / ЖКТ-средства', c: C.green },
        { v: 23.0, t: 'Конкуренты', ex: 'Тримедат / Необутин', c: C.orange },
        { v: 25.6, t: 'Симптомы', ex: 'боль / запор / понос у ребёнка', c: C.purple },
        { v: 19.5, t: 'Транзакционные', ex: 'купить / цена → аптека', c: C.crimson },
        { v: 2.6, t: 'МКБ', ex: 'диагностическая семантика', c: GREY },
      ];
      const f1 = (v) => pct(v.toFixed(1));
      shareBar(s, SEG.map((g) => ({ v: g.v, c: g.c, t: f1(g.v) })), { x, y: BY, w, h: BH, size: 18 });

      s.box({ x: x - 8, y: py, w: w + 16, h: ph, fill: C.cardTint, r: 15 });
      s.icon('tb:TbBulb', { x: x + 6, y: py + (ph - IC) / 2, size: IC, circle: C.blue, color: C.white });
      s.text(PL, { x: x + 6 + IC + 18, y: py, w: plw, h: ph, size: 19, bold: true, lh: 1.0, color: C.blue, valign: 'middle' });
      s.text(PT, { x: ptx, y: py + 16, w: evenW(PT, ptw, 18), h: ph - 32, size: 18, lh: 1.2, color: C.navy, valign: 'middle' });

      // категории: плитки 3 × 2, порядок как в полосе; доля — крупно цветом категории
      const gc = columns(3, { x0: x - 8, x1: x + w + 8, gap: 18 });
      const TP = 22;
      SEG.forEach((g, i) => {
        const c = gc[i % 3];
        const yy = rowY(Math.floor(i / 3));
        s.box({ x: c.x, y: yy, w: c.w, h: th, fill: C.white, stroke: C.line, sw: 1.5, r: 15 });
        const blockH = 34 + 12 + 18 + 8 + measure(g.ex, c.w - 2 * TP, 17);
        const y1 = yy + (th - blockH) / 2;
        s.text(f1(g.v), { x: c.x + TP, y: y1, w: c.w - 2 * TP, size: 34, bold: true, lh: 1.0, color: g.c });
        s.text(g.t, { x: c.x + TP, y: y1 + 34 + 12, w: c.w - 2 * TP, size: 18, bold: true, lh: 1.0, color: C.navy, caps: true, fit: true, maxLines: 1, minSize: 14 });
        s.text(g.ex, { x: c.x + TP, y: y1 + 34 + 12 + 18 + 8, w: c.w - 2 * TP, size: 17, lh: 1.2, color: C.blueText });
      });
    }

    // --- 2. РСЯ: отдельный сплит ---
    {
      const { x, w } = R;
      shareBar(s, [{ v: 68, c: C.green }, { v: 32, c: C.crimson }], { x, y: BY, w, h: BH, size: 20 });

      s.box({ x: x - 8, y: py, w: w + 16, h: ph, fill: 'EEF7F2', r: 15 });
      s.icon('tb:TbTargetArrow', { x: x + 6, y: py + (ph - IC) / 2, size: IC, circle: C.green, color: C.white });
      s.text(ROLE, { x: x + 6 + IC + 18, y: py + 16, w: rw - 6, h: ph - 32, size: 18, lh: 1.2, color: C.navy, valign: 'middle' });

      const ITEMS = [
        { v: '68%', t: 'Общая оптимизированная', d: 'Категория + симптоматика + конкуренты + интересы / ретаргетинг → сайт', c: C.green },
        { v: '32%', t: 'Транзакционная', d: 'Запросы с высокой готовностью к покупке → e-pharm / аптечная карточка', c: C.crimson },
      ];
      const CHW = 84;
      const CHH = 40;
      const tx = x + CHW + 16;
      const tw = x + w - tx;
      ITEMS.forEach((it, i) => {
        const ih = 30 + measure(it.d, tw, 17);
        const y = rowY(i) + (th - ih) / 2;
        if (i) s.hline(tx, rowY(i) - TG / 2, tw);
        s.box({ x, y, w: CHW, h: CHH, fill: it.c, r: 10 });
        s.text(it.v, { x, y, w: CHW, h: CHH, size: 18, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
        s.text(it.t, { x: tx, y, w: tw, size: 18, bold: true, lh: 1.0, color: C.navy, caps: true, fit: true, maxLines: 1, minSize: 14 });
        s.text(it.d, { x: tx, y: y + 30, w: evenW(it.d, tw, 17), size: 17, lh: 1.2, color: C.blueText });
      });
    }

    s.principle({ label: 'KPI 2027', icon: 'tb:TbChartBar', text: 'CR / CPA «Где купить / покупка» → quality visits → e-pharm sales' });
  },
};
