// Клиндовит · стратегия 2027 — часть B: слайды исходника 5–7.
// Все три в исходнике — картинка во весь слайд; текст перенесён живым, прочитан по увеличенным фрагментам
// (out/render/brand_clindovit_part_b/zoom/). Декоративные 3D-иллюстрации и карту России не переносим.
// 5 — рынок средств против акне растёт: 4 колонки «заголовок → пояснение → цифры» (скрытый);
// 6 — потребители ищут решения в диджитал: мир / Россия / что говорят люди (скрытый);
// 7 — что рыночные тренды значат для Клиндовита: 4 строки «тренд → что делать».
const path = require('path');
const { C, columns, countLines, textWidth, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT
const SRC = path.join(__dirname, '..', '..', '..', 'work', 'brands', 'clindovit', 'src');
const MEDIA = path.join(SRC, 'media');   // eslint-disable-line no-unused-vars

const TOP = V.TOP;   // 221 — верх контента
const BOT = V.BOT;   // 1005 — низ контента (плашки-вывода в исходнике нет)
const X0 = 58;
const X1 = 1862;

// Высота и ширина текста так же, как их оценивает s.text — по переведённой строке (tr),
// чтобы EN-сборка пересчитывала геометрию под свой текст
const plainTr = (text) => typo(tr(String(text))).replace(/\*\*|\[\[|\]\]/g, '');
const measure = (text, w, size = 18, bold = false, lh = 1.2) =>
  Math.round(countLines(plainTr(text), size, w, bold) * size * lh);
const widthOf = (text, size, bold = false) => textWidth(plainTr(text), size, bold);
const max = (arr) => Math.max(...arr);
const sum = (arr) => arr.reduce((a, b) => a + b, 0);

// длинная сноска в 2 строки — выше обычного и не заходит на номер страницы справа
function source(s, text) {
  const w = 1730;
  const size = 14;
  const h = measure(text, w, size);
  s.text(text, { x: X0, y: h > 20 ? 1022 : 1034, w, size, lh: 1.2, color: C.blueText });
}

module.exports = {
  // =====================================================================
  // 5 · Рынок средств против акне продолжает активно расти (скрытый)
  // =====================================================================
  5: (d) => {
    // заголовки колонок — с переносами, как в исходнике; «Санкт-Петербург» не рвём по дефису (ручной перенос)
    const s = d.slide({ title: 'Рынок средств против акне продолжает активно расти' });
    s.s.hidden = true;

    const cols = columns(4, { gap: 23 });
    const pad = 30;
    const cw = cols[0].w - pad * 2;
    const VS = 56;                 // кегль больших цифр
    const VH = Math.round(VS * 1.05);
    const CAP = 19;                // подпись цифры
    const SUB = 16;                // уточнение периода

    // Цифра над подписью: value, cap, sub → высота
    const vH = (it, w) => VH + 6 + measure(it.cap, w, CAP, false, 1.2) + (it.sub ? 4 + measure(it.sub, w, SUB, false, 1.2) : 0);
    const vDraw = (it, x, y, w, ink) => {
      s.text(it.v, { x, y, w, size: VS, bold: true, lh: 1.05, color: ink, fit: true, maxLines: 1, minSize: 40 });
      const ch = s.text(it.cap, { x, y: y + VH + 6, w, size: CAP, lh: 1.2, color: C.navy });
      if (it.sub) s.text(it.sub, { x, y: y + VH + 6 + ch + 4, w, size: SUB, lh: 1.2, color: C.blueText });
    };
    // Цифра слева, подпись справа (строки регионов)
    const LW = 160;
    const rH = (it, w) => Math.max(VH, measure(it.cap, w - LW - 12, CAP, false, 1.2));

    const data = [
      {
        n: '01', color: C.blue, ink: C.blue,
        h: 'Категория росла\nв 2025 году',
        t: 'Рынок препаратов от акне показал уверенный рост: спрос увеличился как в денежном выражении, так и в упаковках. Это подтверждает устойчивую актуальность категории и высокий интерес к решениям проблемы акне.',
        kind: 'pair',
        // «в 2025 году к 2024 году» в исходнике повторено под обеими цифрами — выносим одной подписью над парой, как в колонке 02
        label: '**В 2025 году**\nк 2024 году',
        items: [
          { v: '+43%', cap: 'рост продаж в деньгах' },
          { v: '+25%', cap: 'рост продаж в упаковках' },
        ],
      },
      {
        n: '02', color: C.cyan, ink: C.teal,
        h: 'И продолжила рост в 2026',
        t: 'В январе–июле 2026 года продажи препаратов от акне достигли **13,1\u00a0млрд\u00a0₽**, что на 28% больше, чем за аналогичный период 2025 года. В натуральном выражении рынок также растёт — на **16%**.',
        kind: 'pair',
        label: '**Январь–июль 2026 года**\n(к январю–июлю 2025)',
        items: [
          { v: '+28%', cap: 'в деньгах' },
          { v: '+16%', cap: 'в упаковках' },
        ],
        note: 'Объём продаж:\nболее **13,1\u00a0млрд\u00a0₽** и **8\u00a0млн\u00a0упаковок**.', noteIcon: 'tb:TbCoins',
      },
      {
        n: '03', color: C.purple, ink: C.purple,
        // ручной перенос: иначе строка рвётся по дефису «по-/прежнему»
        h: 'Наружные препараты\nпо-прежнему формируют основу потребления',
        t: 'Местные средства остаются самым популярным выбором: на них приходится 69% всех проданных упаковок категории. При этом в денежном выражении более 55% выручки уже формируют системные препараты (пероральные ретиноиды), главным драйвером которых остаётся изотретиноин.',
        kind: 'stack',
        items: [
          { v: '69%', cap: 'всех проданных упаковок — местные средства' },
          { v: '55%', cap: 'выручки категории приходится на пероральные препараты (системная терапия)' },
        ],
      },
      {
        n: '04', color: C.crimson, ink: C.crimson,
        h: 'Рост происходит\nво всех регионах России',
        t: 'Спрос на препараты от акне растёт по всей стране — увеличение продаж зафиксировано во всех регионах. Наибольшая доля в денежном выражении приходится на Москву и Московскую область, а также\nСанкт-Петербург, при этом значительная часть рынка формируется и в других регионах.',
        kind: 'rows',
        items: [
          { v: '~22%', cap: 'Москва и Московская область' },
          { v: '~8,5%', cap: 'Санкт-Петербург' },
          { v: '~38%', cap: '**ТОП-5** регионов России' },
        ],
      },
    ];

    // высоты блоков с цифрами — верх цифр стоит на одной линии во всех колонках
    const half = (cw - 25) / 2;
    const LBL = 18;
    const NOTE = 18;
    const NI = 50;   // иконка у объёма продаж
    const statsH = (c) => {
      if (c.kind === 'pair') {
        let h = max(c.items.map((it) => vH(it, half)));
        if (c.label) h += measure(c.label, cw, LBL, false, 1.2) + 14;
        if (c.note) h += 24 + Math.max(NI, measure(c.note, cw - NI - 16, NOTE, false, 1.2));
        return h;
      }
      if (c.kind === 'stack') return sum(c.items.map((it) => vH(it, cw))) + 34 * (c.items.length - 1);
      return sum(c.items.map((it) => rH(it, cw))) + 30 * (c.items.length - 1);
    };
    const SH = max(data.map(statsH));

    // шапка колонки: номер на кромке карточки, заголовок под ним, пояснение, затем цифры
    const bd = 52;
    const HS = 26;
    const hY = TOP + bd + 20;
    const hH = max(data.map((c) => measure(c.h, cw, HS, true, 1.1)));
    const tY = hY + hH + 18;
    const SEP = 48;   // от текста до цифр (разделитель посередине)
    // кегль пояснений — общий для всех колонок: самый крупный, при котором цифры встают в карточку
    const TL = 1.22;
    let TS = 20;
    const textH = (sz) => max(data.map((c) => measure(c.t, cw, sz, false, TL)));
    while (TS > 16 && tY + textH(TS) + SEP + SH > BOT - 28) TS -= 1;
    const statsY = tY + textH(TS) + SEP;
    if (statsY + SH > BOT - 28) s.warn('колонки', 'слайд 5', `цифры не влезают на ~${Math.round(statsY + SH - BOT + 28)}px`);

    data.forEach((c, i) => {
      const col = cols[i];
      const x = col.x + pad;
      s.numberedCard({ x: col.x, y: TOP, w: col.w, h: BOT - TOP, n: c.n, color: c.color, d: bd, pad });
      s.text(c.h, { x, y: hY, w: cw, size: HS, bold: true, lh: 1.1, color: C.navy });
      s.text(c.t, { x, y: tY, w: cw, size: TS, lh: TL, color: C.blueText });
      // нижняя часть карточки — светлая панель с цифрами (одинаковой высоты во всех колонках)
      s.box({ x: col.x + 14, y: statsY - 28, w: col.w - 28, h: BOT - 14 - (statsY - 28), fill: C.cardTint });

      let y = statsY;
      if (c.kind === 'pair') {
        if (c.label) y += s.text(c.label, { x, y, w: cw, size: LBL, lh: 1.2, color: C.navy }) + 14;
        const ph = max(c.items.map((it) => vH(it, half)));
        c.items.forEach((it, k) => {
          const xx = x + k * (half + 25);
          if (k) s.vline(xx - 13, y + 4, ph - 4, C.white, 2.5);
          vDraw(it, xx, y, half, c.ink);
        });
        y += ph;
        if (c.note) {
          y += 24;
          const nh = measure(c.note, cw - NI - 16, NOTE, false, 1.2);
          const rowH = Math.max(NI, nh);
          s.icon(c.noteIcon, { x, y: y + (rowH - NI) / 2, size: NI, circle: c.color });
          s.text(c.note, { x: x + NI + 16, y: y + (rowH - nh) / 2, w: cw - NI - 16, size: NOTE, lh: 1.2, color: C.navy });
        }
      } else if (c.kind === 'stack') {
        c.items.forEach((it, k) => {
          if (k) { s.hline(x, y + 16, cw, C.white, 2.5); y += 34; }
          vDraw(it, x, y, cw, c.ink);
          y += vH(it, cw);
        });
      } else {
        c.items.forEach((it, k) => {
          if (k) { s.hline(x, y + 14, cw, C.white, 2.5); y += 30; }
          const h = rH(it, cw);
          const ch = measure(it.cap, cw - LW - 12, CAP, false, 1.2);
          s.text(it.v, { x, y: y + (h - VH) / 2, w: LW, size: VS, bold: true, lh: 1.05, color: c.ink, fit: true, maxLines: 1, minSize: 36 });
          s.text(it.cap, { x: x + LW + 12, y: y + (h - ch) / 2, w: cw - LW - 12, size: CAP, lh: 1.2, color: C.navy });
          y += h;
        });
      }
    });

    source(s, '**Источник:** RNC Pharma. Рынок препаратов для лечения угревой сыпи в России. 2024, 2025, янв.–июль 2026.');
  },

  // =====================================================================
  // 6 · Потребители активно ищут решения в диджитал (скрытый)
  // =====================================================================
  6: (d) => {
    const s = d.slide({ title: 'Потребители активно ищут решения в диджитал и хотят быстрый результат' });
    s.s.hidden = true;

    const cols = columns(3, { gap: 23 });
    const pad = 30;
    const cw = cols[0].w - pad * 2;
    const bd = 52;
    const HS = 25;
    const LS = 18;   // вводный абзац колонки
    const heads = [
      { n: '01', color: C.blue, h: 'В мире: социальные сети — неотъемлемая часть пути к решению',
        t: 'Люди с акне активно ищут информацию об уходе и лечении в цифровой среде: читают врачей и блогеров, сравнивают средства, вдохновляются опытом других и принимают реальные решения на основе увиденного.' },
      { n: '02', color: C.crimson, h: 'В России: интернет становится частью выбора лекарства',
        t: 'Российские пользователи всё чаще самостоятельно изучают препараты в интернете, сравнивают варианты и переходят от поиска информации к покупке. Цифровые источники уже работают рядом с врачом и фармацевтом, а также растёт интерес к новым технологиям, включая ИИ.' },
      { n: '03', color: C.purple, h: 'Что говорят люди: ключевые потребности и барьеры',
        t: 'В обсуждениях о лечении акне пользователи чаще всего делятся такими переживаниями:' },
    ];
    // шапки колонок: номер на кромке карточки (как на слайде 5), заголовок под ним во всю ширину
    const hY = TOP + bd + 20;
    const hH = max(heads.map((c) => measure(c.h, cw, HS, true, 1.1)));
    const lY = hY + hH + 16;
    const lead = heads.map((c) => measure(c.t, cw, LS, false, 1.2));
    const IN0 = BOT - 28;   // нижняя граница содержимого карточки

    // раскладка блоков колонки по высоте: остаток делим на зазоры между блоками
    const flow = (y0, hs, minGap = 16, maxGap = 34) => {
      const free = IN0 - y0 - sum(hs);
      const gap = Math.max(minGap, Math.min(maxGap, free / hs.length));
      if (free < minGap * hs.length) s.warn('колонка', 'слайд 6', `не влезает на ~${Math.round(minGap * hs.length - free)}px`);
      const ys = [];
      let y = y0 + gap;
      hs.forEach((h) => { ys.push(y); y += h + gap; });
      return { ys, gap };
    };

    heads.forEach((c, i) => {
      const col = cols[i];
      const x = col.x + pad;
      s.numberedCard({ x: col.x, y: TOP, w: col.w, h: BOT - TOP, n: c.n, color: c.color, d: bd, pad });
      s.text(c.h, { x, y: hY, w: cw, size: HS, bold: true, lh: 1.1, color: C.navy });
      s.text(c.t, { x, y: lY, w: cw, size: LS, lh: 1.2, color: C.blueText });
    });

    // ---------- колонка 1: в мире ----------
    {
      const col = cols[0];
      const x = col.x + pad;
      const ink = C.blue;
      // 97% — главная цифра колонки на светлой подложке
      const big = { v: '97%', cap: 'пациентов с акне пользуются социальными сетями' };
      const BI = 64;
      const BV = 64;
      const bvW = Math.ceil(widthOf(big.v, BV, true)) + 12;
      const bcW = cw - 24 - BI - 18 - bvW - 18 - 18;
      const bigH = Math.max(BI, measure(big.cap, bcW, 18, false, 1.2)) + 32;
      // «Где ищут» / «Кого читают»: две подколонки по 3 строки
      const sw = (cw - 28) / 2;
      const RI = 42;
      const RV = 26;
      const rw = sw - RI - 14;
      const where = { t: 'Где ищут информацию о коже?', rows: [['tb:TbBrandInstagram', '25,5%', 'Instagram'], ['tb:TbBrandTiktok', '18,4%', 'TikTok'], ['tb:TbBrandGoogle', '10,0%', 'Google']] };
      const whom = { t: 'Кого читают?', rows: [['tb:TbStethoscope', '44,4%', 'дерматологов'], ['tb:TbStar', '31,4%', 'блогеров'], ['tb:TbFlower', '17,9%', 'специалистов по красоте']] };
      const subH = max([where, whom].map((b) => measure(b.t, sw, 19, true, 1.15)));
      const rowH = where.rows.map((_, k) => max([where, whom].map((b) => Math.round(RV * 1.05) + 2 + measure(b.rows[k][2], rw, 17, false, 1.15))));
      const RG = 12;
      const listH = subH + 14 + sum(rowH) + RG * (rowH.length - 1);
      // нижняя пара: покупки и отложенный визит к врачу
      const pair = [
        ['tb:TbShoppingCart', '28,2%', 'покупали средство после того, как увидели его в социальных сетях'],
        ['tb:TbClockPause', '34,1%', 'откладывали обращение к врачу\nиз-за рекомендаций в социальных сетях'],
      ];
      const PI = 42;
      const PV = 32;
      const pw = sw - PI - 14;
      const pairH = Math.round(PV * 1.05) + 4 + max(pair.map((p) => measure(p[2], pw, 17, false, 1.2)));

      const { ys } = flow(lY + lead[0], [bigH, listH, pairH], 18, 30);
      // 97%
      s.box({ x, y: ys[0], w: cw, h: bigH, fill: C.cardTint });
      s.icon('tb:TbUsers', { x: x + 24, y: ys[0] + (bigH - BI) / 2, size: BI, circle: ink });
      s.text(big.v, { x: x + 24 + BI + 18, y: ys[0] + (bigH - BV * 1.05) / 2, w: bvW, size: BV, bold: true, lh: 1.05, color: ink });
      const bch = measure(big.cap, bcW, 18, false, 1.2);
      s.text(big.cap, { x: x + 24 + BI + 18 + bvW + 18, y: ys[0] + (bigH - bch) / 2, w: bcW, size: 18, lh: 1.2, color: C.navy });
      // где ищут / кого читают
      [where, whom].forEach((b, j) => {
        const bx = x + j * (sw + 28);
        if (j) s.vline(bx - 14, ys[1], listH, C.line, 1.5);
        s.text(b.t, { x: bx, y: ys[1], w: sw, size: 19, bold: true, lh: 1.15, color: C.navy });
        let y = ys[1] + subH + 14;
        b.rows.forEach(([icon, v, name], k) => {
          s.icon(icon, { x: bx, y: y + 2, size: RI, circle: ink });
          s.text(v, { x: bx + RI + 14, y, w: rw, size: RV, bold: true, lh: 1.05, color: ink });
          s.text(name, { x: bx + RI + 14, y: y + Math.round(RV * 1.05) + 2, w: rw, size: 17, lh: 1.15, color: C.navy });
          y += rowH[k] + RG;
        });
      });
      // пара внизу
      s.hline(x, ys[2] - 14, cw);
      pair.forEach(([icon, v, cap], j) => {
        const bx = x + j * (sw + 28);
        if (j) s.vline(bx - 14, ys[2], pairH, C.line, 1.5);
        s.icon(icon, { x: bx, y: ys[2] + 2, size: PI, circle: ink });
        s.text(v, { x: bx + PI + 14, y: ys[2], w: pw, size: PV, bold: true, lh: 1.05, color: ink });
        s.text(cap, { x: bx + PI + 14, y: ys[2] + Math.round(PV * 1.05) + 4, w: pw, size: 17, lh: 1.2, color: C.navy });
      });
    }

    // ---------- колонка 2: в России ----------
    {
      const col = cols[1];
      const x = col.x + pad;
      const ink = C.crimson;
      const items = [
        ['tb:TbSearch', '60%', 'россиян стали чаще самостоятельно искать информацию о лекарствах в интернете.'],
        ['tb:TbBrowser', '34%', 'используют поисковые системы как источник информации о препаратах.'],
        ['tb:TbUser', '43%', 'покупают лекарства по рекомендациям медицинских блогов.'],
        ['tb:TbAi', '15%', 'россиян хотя бы раз за последний год использовали ИИ для предварительного определения диагноза или поиска подходящего лекарства.'],
      ];
      const I = 56;
      const VS = 42;
      const tw = cw - I - 20;
      const hs = items.map((it) => Math.round(VS * 1.05) + 4 + measure(it[2], tw, 18, false, 1.2));
      const { ys, gap } = flow(lY + lead[1], hs, 16, 34);
      items.forEach(([icon, v, cap], k) => {
        const y = ys[k];
        if (k) s.hline(x, y - gap / 2, cw);
        s.icon(icon, { x, y: y + 2, size: I, circle: ink });
        s.text(v, { x: x + I + 20, y, w: tw, size: VS, bold: true, lh: 1.05, color: ink });
        s.text(cap, { x: x + I + 20, y: y + Math.round(VS * 1.05) + 4, w: tw, size: 18, lh: 1.2, color: C.navy });
      });
    }

    // ---------- колонка 3: что говорят люди ----------
    {
      const col = cols[2];
      const x = col.x + pad;
      const ink = C.purple;
      const items = [
        ['tb:TbBolt', '«Хочу результат быстрее»', 'Люди хотят видеть заметные улучшения в короткие сроки, особенно когда появляются воспалительные элементы. Важна простая и понятная схема применения.'],
        ['tb:TbShieldHalf', '«Хочу лечить, но боюсь испортить кожу»', 'Пользователи переживают о возможной сухости, раздражении и ухудшении состояния кожи. Для них важно, чтобы средство было эффективным, но при этом хорошо переносилось.'],
        ['tb:TbTarget', '«Мне нужно, чтобы это реально работало»', 'Потребители устали от множества средств и хотят доказанной эффективности. Они сравнивают опыт других пользователей и выбирают то, чему можно доверять.'],
        ['tb:TbHeart', '«Прыщи влияют на меня сильнее, чем кажется»', 'Акне затрагивает не только кожу, но и эмоциональное состояние: уверенность в себе, настроение, общение и качество жизни. Для многих это не просто косметическая проблема, а важная часть повседневной жизни.'],
      ];
      const I = 50;
      const QS = 19;
      const tw = cw - I - 18;
      const qh = items.map((it) => measure(it[1], tw, QS, true, 1.1));
      // пояснения 18 px; если (например, в EN) не встают с зазорами ≥ 14 — уменьшаем до 16
      const y0 = lY + lead[2];
      let ES = 18;
      const ehAt = (sz) => items.map((it) => measure(it[2], tw, sz, false, 1.2));
      while (ES > 16 && sum(items.map((_, k) => Math.max(I, qh[k] + 6 + ehAt(ES)[k]))) + 14 * items.length > IN0 - y0) ES -= 1;
      const eh = ehAt(ES);
      const hs = items.map((_, k) => Math.max(I, qh[k] + 6 + eh[k]));
      const { ys, gap } = flow(y0, hs, 14, 30);
      items.forEach(([icon, q, e], k) => {
        const y = ys[k];
        if (k) s.hline(x, y - gap / 2, cw);
        s.icon(icon, { x, y, size: I, circle: ink });
        s.text(q, { x: x + I + 18, y, w: tw, size: QS, bold: true, lh: 1.1, color: C.navy });
        s.text(e, { x: x + I + 18, y: y + qh[k] + 6, w: tw, size: ES, lh: 1.2, color: C.blueText });
      });
    }

    source(s, '**Источник:** 1) Journal of Cosmetic Dermatology. 2026. Исследование среди 408 пациентов с акне (средний возраст 20,9 года). 2) Яндекс Реклама. Фармацевтическая отрасль: исследование и тренды. 2026 (данные опроса, сентябрь 2025). 3) Анализ отзывов и пользовательских обсуждений. 2024–2026.');
  },

  // =====================================================================
  // 7 · Что рыночные тренды значат для Клиндовита
  // =====================================================================
  7: (d) => {
    // заголовок исходника — одно предложение в 3 строки; в шапку не влезает, делим на заголовок и подзаголовок
    const s = d.slide({
      title: 'Для Клиндовита рыночные тренды значат: быть понятным, заметным и своевременным выбором',
      subtitle: 'в моменты, когда потребитель уже ищет быстрое и эффективное решение от прыщей',
    });
    const rows = [
      { icon: 'tb:TbTrendingUp', color: C.blue,
        h: 'Категория растёт — нужно защищать долю точечно',
        t: 'Рынок средств против акне продолжает расти, но конкуренты инвестируют заметно больше. Для Клиндовита это означает не попытку конкурировать объёмом, а **необходимость точно защищать долю**: фокусироваться на самых ценных сегментах, усиливаться в периоды сезонного спроса и вкладываться в инструменты, которые реально влияют на выбор.' },
      { icon: 'tb:TbDeviceLaptop', color: C.cyan,
        h: 'Решение ищут в интернете',
        t: 'Потребитель всё чаще сам изучает препараты, читает отзывы, статьи и смотрит рекомендации в цифровой среде. Для бренда это усиливает роль **Поиска, ORM, нативных статей, блогеров и GEO** как каналов влияния на выбор.' },
      { icon: 'tb:TbStopwatch', color: C.crimson,
        h: 'Нужен быстрый и понятный результат',
        t: 'В обсуждениях заметен устойчивый запрос: средство должно реально работать, давать быстрый эффект и не пугать лишними сложностями. Значит, коммуникация Клиндовита должна делать акцент **на лечении прыщей, эффективности, антибактериальном действии и понятном применении**.' },
      { icon: 'tb:TbTarget', color: C.green,
        h: 'Знание бренда нужно наращивать точечно',
        t: 'Конкуренты растут быстрее в брендовом спросе, поэтому Клиндовиту важно усиливать знание и быть заметным в сезонные пики спроса. Фокус — **ядро аудитории, работающие инструменты и два ключевых окна усиления**.' },
    ];
    const padX = 40;
    const I = 84;
    const hx = X0 + padX + I + 30;
    const hw = 540;
    const sepX = hx + hw + 34;
    const bx = sepX + 36;
    const bw = X1 - padX - bx;
    const HS = 30;
    s.card({ x: X0, y: TOP, w: X1 - X0, h: BOT - TOP });
    const inner = BOT - TOP - 2 * 14;
    const rowH = inner / rows.length;
    // кегль текста — общий: самый крупный, при котором самый длинный абзац встаёт в строку с полями
    let BS = 24;
    while (BS > 18 && max(rows.map((r) => measure(r.t, bw, BS, false, 1.25))) > rowH - 44) BS -= 1;
    rows.forEach((r, k) => {
      const y0 = TOP + 14 + k * rowH;
      const mid = y0 + rowH / 2;
      if (k) s.hline(X0 + padX, y0, X1 - X0 - padX * 2);
      const hh = measure(r.h, hw, HS, true, 1.1);
      const th = measure(r.t, bw, BS, false, 1.25);
      s.icon(r.icon, { x: X0 + padX, y: mid - I / 2, size: I, circle: r.color });
      s.text(r.h, { x: hx, y: mid - hh / 2, w: hw, size: HS, bold: true, lh: 1.1, color: C.navy });
      s.vline(sepX, y0 + 26, rowH - 52, C.line, 1.5);
      s.text(r.t, { x: bx, y: mid - th / 2, w: bw, size: BS, lh: 1.25, color: C.blueText });
    });
  },
};
