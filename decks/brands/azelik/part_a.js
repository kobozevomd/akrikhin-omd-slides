// Азелик · стратегия 2027 — часть A: слайды исходника 1–9.
// 1 — обложка; 2 — разделитель «Рынок и категория»;
// 3–5 — рынок: две карточки «столбик цифр → панель-комментарий» (общий помощник twoCols, как в исходнике: слева — малиновые цифры, справа — синие);
// 6, 7 — рынок средств от акне и потребители в диджитал: как Клиндовит 5, 6 (код оттуда), тексты сверены с Азеликом; в Азелике не скрыты;
// 7 — в исходнике тексты частично в картинке img_6e9915b46c.png (та же, что у Клиндовита), прочитаны по увеличенным фрагментам
//     (out/render/brand_azelik_part_a/zoom/); в колонке 02 видны только 43% и 15% — 60% и 34% обрезаны кадрированием, не переносим;
// 8 — тренды категории → стратегия: три карточки + вывод; 9 — единый путь потребителя: три шага со стрелками + вывод.
const path = require('path');
const { C, columns, countLines, textWidth, typo, tr, PT } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT
const A = require('./common');                            // SRC, MEDIA, CROPS
const SRC = A.SRC;       // eslint-disable-line no-unused-vars
const MEDIA = A.MEDIA;   // eslint-disable-line no-unused-vars

const TOP = V.TOP;   // 221 — верх контента
const BOT = V.BOT;   // 1005 — низ контента без плашки-вывода
const X0 = 58;
const X1 = 1862;
const PLQ = 905;     // низ контента над плашкой-выводом (плашка 935…1019)

// Высота и ширина текста так же, как их оценивает s.text — по переведённой строке (tr),
// чтобы EN-сборка пересчитывала геометрию под свой текст
const plainTr = (text) => typo(tr(String(text))).replace(/\*\*|\[\[|\]\]/g, '');
const measure = (text, w, size = 18, bold = false, lh = 1.2) =>
  Math.round(countLines(plainTr(text), size, w, bold) * size * lh);
const widthOf = (text, size, bold = false) => textWidth(plainTr(text), size, bold);
const max = (arr) => Math.max(...arr);
const sum = (arr) => arr.reduce((a, b) => a + b, 0);

// сноска-источник; длинная (2 строки) — выше обычного и не заходит на номер страницы справа
function source(s, text) {
  const w = 1730;
  const size = 14;
  const h = measure(text, w, size);
  s.text(text, { x: X0, y: h > 20 ? 1022 : 1034, w, size, lh: 1.2, color: C.blueText });
}

// ---------------------------------------------------------------------
// Слайды 3–5: две карточки. Вверху — столбик «большая цифра → подпись» с разделителями,
// внизу — светлая панель: иконка, метка (период / тема, если есть в исходнике) и абзац-комментарий.
// data: [{ color, icon, label?, text, stats: [{ v, u?, cap }] }] — у обеих колонок одинаковое число цифр.
// ---------------------------------------------------------------------
function twoCols(s, data) {
  const cols = columns(2, { gap: 24 });
  const pad = 36;
  const cw = cols[0].w - pad * 2;
  const n = data[0].stats.length;
  const VS = n > 3 ? 60 : 72;            // кегль цифры
  const US = Math.round(VS * 0.55);      // единица («трлн ₽», «млн») мельче
  const VH = Math.round(VS * 1.05);
  const CS = 22;                         // подпись цифры
  const valW = (st) => widthOf(st.v + (st.u ? ' ' : ''), VS, true) + (st.u ? widthOf(st.u, US, true) : 0);
  // ширина под цифры — своя в каждой карточке (подпись стоит рядом с цифрой), высоты строк — общие
  const VW = data.map((c) => Math.ceil(max(c.stats.map(valW))) + 32);
  const capW = VW.map((vw) => cw - vw);
  const rows = Array.from({ length: n }, (_, k) => max(data.map((c, i) => Math.max(VH, measure(c.stats[k].cap, capW[i], CS, false, 1.2)))));

  // панель комментария: кегль абзаца — общий, самый крупный, при котором всё встаёт
  const inset = 14;
  const PP = 30;                          // поля панели
  const PI = 60;                          // иконка в кружке
  const tw = cols[0].w - inset * 2 - PP * 2 - PI - 24;
  const LS = 24;                          // метка панели
  const labH = (c) => (c.label ? measure(c.label, tw, LS, true, 1.1) + 12 : 0);
  const panelH = (ts) => PP * 2 + max(data.map((c) => Math.max(PI, labH(c) + measure(c.text, tw, ts, false, 1.3))));
  const MINGAP = 34;
  const statsMin = sum(rows) + MINGAP * (n - 1);
  let TS = 23;
  while (TS > 18 && TOP + 34 + statsMin + 34 + panelH(TS) > BOT - inset) TS -= 1;
  const PH = panelH(TS);
  const panelY = BOT - inset - PH;
  if (TOP + 34 + statsMin + 34 > panelY) s.warn('колонки', data[0].text, `не влезает на ~${Math.round(TOP + 34 + statsMin + 34 - panelY)}px`);

  // цифры: зазор между строками — по свободному месту (не больше 76), остаток — поровну сверху и снизу
  const area = panelY - 30 - (TOP + 30);
  const gap = Math.min(76, Math.max(MINGAP, (area - sum(rows)) / (n - 1)));
  const blockH = sum(rows) + gap * (n - 1);
  const y0 = TOP + 30 + Math.max(0, (area - blockH) / 2);

  data.forEach((c, i) => {
    const col = cols[i];
    const x = col.x + pad;
    s.card({ x: col.x, y: TOP, w: col.w, h: BOT - TOP });
    let y = y0;
    c.stats.forEach((st, k) => {
      if (k) s.hline(x, y - gap / 2, cw);
      const rh = rows[k];
      const value = st.u ? [{ text: st.v + ' ', options: {} }, { text: st.u, options: { fontSize: PT(US) } }] : st.v;
      s.text(value, { x, y: y + (rh - VH) / 2, w: VW[i], size: VS, bold: true, lh: 1.05, color: c.color });
      const ch = measure(st.cap, capW[i], CS, false, 1.2);
      s.text(st.cap, { x: x + VW[i], y: y + (rh - ch) / 2, w: capW[i], size: CS, lh: 1.2, color: C.navy });
      y += rh + gap;
    });
    // панель-комментарий
    const px = col.x + inset;
    s.box({ x: px, y: panelY, w: col.w - inset * 2, h: PH, fill: C.cardTint });
    s.icon(c.icon, { x: px + PP, y: panelY + PP, size: PI, circle: c.color });
    const tx = px + PP + PI + 24;
    const ch = labH(c) + measure(c.text, tw, TS, false, 1.3);
    let ty = panelY + PP + Math.max(0, (PI - ch) / 2);
    if (c.label) ty += s.text(c.label, { x: tx, y: ty, w: tw, size: LS, bold: true, lh: 1.1, color: c.color }) + 12;
    s.text(c.text, { x: tx, y: ty, w: tw, size: TS, lh: 1.3, color: C.blueText });
  });
}

// ---------------------------------------------------------------------
// Слайды 8–9: три карточки с номером на кромке. Внизу каждой — цветной блок (стратегия / роль бренда).
// ---------------------------------------------------------------------
function footBlock(s, { x, w, color, label, text, pad = 20 }) {
  const LS = 19;
  const TS = 21;
  const lh = label ? measure(label, w - pad * 2, LS, true, 1.1) + 6 : 0;
  const th = measure(text, w - pad * 2, TS, true, 1.2);
  const h = pad * 2 + lh + th - 4;
  return {
    h,
    // hh — общая высота блоков в ряду; содержимое по центру
    draw: (yy, hh = h) => {
      s.box({ x, y: yy, w, h: hh, fill: color });
      if (!label) {
        // одна строка или две — текст по центру блока по фактическому числу строк
        s.text(text, { x: x + pad, y: yy, w: w - pad * 2, h: hh, size: TS, bold: true, lh: 1.2, color: C.white, valign: 'middle' });
        return;
      }
      let ty = yy + pad - 2 + (hh - h) / 2;
      ty += s.text(label, { x: x + pad, y: ty, w: w - pad * 2, size: LS, bold: true, lh: 1.1, color: C.white }) + 6;
      s.text(text, { x: x + pad, y: ty, w: w - pad * 2, size: TS, bold: true, lh: 1.2, color: C.white });
    },
  };
}

module.exports = {
  // =====================================================================
  // 1 · Обложка (как у Acriol Pro и Clindovit)
  // =====================================================================
  1: (d) => {
    // своя секция у обложки: при секциях PowerPoint не допускает слайдов вне секций (иначе — «восстановление» файла)
    d.section('Обложка');
    const s = d.cover({ title: 'Azelik' });
    s.text('Strategic approach 2027 by OMD', { x: 296, y: 716, w: 1328, size: 44, lh: 1.1, color: C.white, align: 'center' });
  },

  // =====================================================================
  // 2 · Разделитель «Рынок и категория»
  // =====================================================================
  2: (d) => {
    d.section('Рынок и категория');
    d.divider({ title: 'Рынок и категория', kicker: '2027' });
  },

  // =====================================================================
  // 3 · Рынок растёт в деньгах, но с важными изменениями
  // =====================================================================
  3: (d) => {
    const s = d.slide({ title: 'Рынок растёт в деньгах, но с важными изменениями' });
    twoCols(s, [
      {
        color: C.crimson, icon: 'tb:TbBuildingStore',
        // «1–8 месяц 2026» в исходнике — исправлено согласование
        label: '1–8 месяцы 2026',
        // «цена упаковки растёт 432,5 руб.» — пропущено «до»
        text: 'Фармрынок растёт в деньгах, но натуральный спрос снижается. В 2026 году категория становится дороже, средняя цена упаковки растёт до **432,5 руб.** (+14,8% к январю–августу 2025 г.). Показатель среднего чека в российских аптеках по общему ассортименту (включая ЛП и парафармацевтику) в августе 2026 г. составил **888,5 руб.** (+15% к августу 2025 г.).',
        stats: [
          { v: '1,34', u: 'трлн ₽', cap: 'объём розничного рынка ЛП' },
          { v: '+11,5%', cap: 'рост рынка в рублях' },
          { v: '–2,9%', cap: 'снижение в упаковках' },
        ],
      },
      {
        color: C.blue, icon: 'tb:TbPrescription',
        label: '1ПГ 2026',
        // «превысили 15,9 млрд» — без единицы, как в исходнике
        text: 'Главный импульс рынку дают рецептурные препараты: они растут в рублях и формируют большую часть денежного оборота. Безрецептурный сегмент, наоборот, сталкивается со снижением спроса. Рынок резко меняют высокостоимостные препараты: продажи «Тирзепты» за полугодие превысили **15,9 млрд**, «Седжаро» вырос **в 87 раз**.',
        stats: [
          { v: '15,8%', cap: 'рост Rx в рублях' },
          { v: '–4,4%', cap: 'динамика OTC в рублях' },
          { v: '60%', cap: 'доля Rx в денежном рынке' },
        ],
      },
    ]);
    source(s, '**Источник:** Фармвестник 2026');
  },

  // =====================================================================
  // 4 · Большой экран становится цифровым, как и аптечная полка
  // =====================================================================
  4: (d) => {
    const s = d.slide({ title: 'Большой экран становится цифровым, как и аптечная полка' });
    twoCols(s, [
      {
        color: C.crimson, icon: 'tb:TbDeviceTv',
        label: 'КЛЮЧЕВОЙ ТРЕНД',
        text: 'Классическое телевидение по-прежнему занимает ключевое место в медиамиксе фармы, но сам большой экран быстро меняется. Аудитория всё чаще смотрит контент через Smart\u00a0TV и CTV, а рекламный рынок следует за ней: по оценке PHD, объём DTV в России в 2026 году может вырасти **с 6 до 15\u00a0млрд рублей**. Фарма уже входит в число крупнейших рекламодателей этого сегмента — в I квартале её доля голоса достигла **около\u00a018%**.',
        stats: [
          { v: '15', u: 'млрд ₽', cap: 'прогноз рынка DTV к концу 2026' },
          { v: '18%', cap: 'SOV фармы в DTV за Q1’26' },
          { v: '24%', cap: 'чаще всего встречают рекламу лекарств на Smart\u00a0TV/CTV' },
        ],
      },
      {
        color: C.blue, icon: 'tb:TbShoppingCart',
        label: '1ПГ 2026',
        // 40% (в исходнике было 4%) — правка Романа 20.10
        text: 'Онлайн-продажи и бронирование аптечного ассортимента растут почти втрое быстрее общей выручки российских аптек: **+28,8% против +9,7%** в первой половине 2026 года. Доля ePharma уже достигла **28,2%** рынка против 24% годом ранее. 40% покупателей лекарств используют онлайн-канал, а каждый пятый покупает лекарства исключительно в интернете.',
        stats: [
          { v: '349', u: 'млрд ₽', cap: 'объём online-продаж и брони' },
          { v: '29%', cap: 'рост год к году' },
          { v: '28%', cap: 'доля онлайна в фармрознице' },
        ],
      },
    ]);
    source(s, '**Источники:** Фармвестник 2026; RNC Pharma 2026');
  },

  // =====================================================================
  // 5 · Поиск уходит в ИИ, компании хотят ИИ, но внедряют не все
  // =====================================================================
  5: (d) => {
    const s = d.slide({ title: 'Поиск пользователей постепенно идёт к ИИ, бренды тоже хотят применять ИИ, но получается не у всех' });
    twoCols(s, [
      {
        color: C.crimson, icon: 'tb:TbWorldSearch',
        text: 'Поиск информации о здоровье продолжает расти, но сам способ поиска вместе с ростом пользовательской базы ИИ также постепенно видоизменяется.',
        stats: [
          { v: '380', u: 'млн', cap: 'фарм-запросов в Яндекс, +13% год к году' },
          { v: '49,5', u: 'млн', cap: 'пользователей ежемесячно взаимодействуют с ответами Алисы AI' },
          { v: '50%', cap: 'пользователей нейропоиска уже применяли его при выборе медицинских услуг' },
          { v: '27%', cap: 'готовы доверить AI подбор возможных лекарств или рекомендации по симптомам' },
        ],
      },
      {
        color: C.blue, icon: 'tb:TbBuildingFactory2',
        text: 'Компании запускают пилоты в прогнозировании продаж, логистике, документообороте и персонализации коммуникаций. Однако **разрыв между интересом и реальным внедрением** остаётся очень большим. Главным ограничением становится не сама технология, а готовность инфраструктуры.',
        stats: [
          { v: '100%', cap: 'опрошенных фармкомпаний проявляют интерес к AI' },
          { v: '72%', cap: 'считают свои данные неготовыми' },
          { v: '8%', cap: 'AI-пилотов дошли до промышленного масштаба' },
          { v: '67%', cap: 'компаний сворачивают AI-инициативы из-за проблем с данными' },
        ],
      },
    ]);
    source(s, '**Источники:** AdIndex 2026; Яндекс 2026; ВЦИОМ 2026; Фармвестник 2026');
  },

  // =====================================================================
  // 6 · Рынок средств против акне продолжает активно расти (= Клиндовит 5; в Азелике не скрыт)
  // =====================================================================
  6: (d) => {
    const s = d.slide({ title: 'Рынок средств против акне продолжает активно расти' });

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
        // в исходнике «в 2025 году к 2024 году» стоит под цифрой +43%, но относится к обеим — выносим подписью над парой
        label: '**В 2025 году**\nк 2024 году',
        items: [
          { v: '+43%', cap: 'рост продаж в деньгах' },
          { v: '+25%', cap: 'рост продаж в упаковках' },
        ],
      },
      {
        n: '02', color: C.cyan, ink: C.teal,
        h: 'И продолжила рост в 2026',
        t: 'В январе–июле 2026 года продажи препаратов от акне достигли **13,1 млрд ₽**, что на 28% больше, чем за аналогичный период 2025 года. В натуральном выражении рынок также растёт — на **16%**.',
        kind: 'pair',
        label: '**Январь–июль 2026**',
        items: [
          { v: '+28%', cap: 'в деньгах' },
          { v: '+16%', cap: 'в упаковках' },
        ],
      },
      {
        n: '03', color: C.purple, ink: C.purple,
        // ручной перенос: иначе строка рвётся по дефису «по-/прежнему»
        h: 'Наружные препараты\nпо-прежнему формируют основу потребления',
        t: 'Местные средства остаются самым популярным выбором — на них приходится 69% всех проданных упаковок.\n\nПри этом в деньгах более 55% выручки формируют системные препараты (пероральные ретиноиды). Главный драйвер — изотретиноин.',
        kind: 'stack',
        items: [
          { v: '69%', cap: 'всех упаковок — местные средства' },
          { v: '55%', cap: 'выручки категории — системные препараты' },
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
    const statsH = (c) => {
      if (c.kind === 'pair') {
        let h = max(c.items.map((it) => vH(it, half)));
        if (c.label) h += measure(c.label, cw, LBL, false, 1.2) + 14;
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
    if (statsY + SH > BOT - 28) s.warn('колонки', 'слайд 6', `цифры не влезают на ~${Math.round(statsY + SH - BOT + 28)}px`);

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
  // 7 · Потребители активно ищут решения в диджитал (= Клиндовит 6; в Азелике не скрыт)
  // =====================================================================
  7: (d) => {
    const s = d.slide({ title: 'Потребители активно ищут решения в диджитал и хотят быстрый результат' });

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
    // шапки колонок: номер на кромке карточки, заголовок под ним во всю ширину
    const hY = TOP + bd + 20;
    const hH = max(heads.map((c) => measure(c.h, cw, HS, true, 1.1)));
    const lY = hY + hH + 16;
    const lead = heads.map((c) => measure(c.t, cw, LS, false, 1.2));
    const IN0 = BOT - 28;   // нижняя граница содержимого карточки

    // раскладка блоков колонки по высоте: остаток делим на зазоры между блоками
    const flow = (y0, hs, minGap = 16, maxGap = 34) => {
      const free = IN0 - y0 - sum(hs);
      const gap = Math.max(minGap, Math.min(maxGap, free / hs.length));
      if (free < minGap * hs.length) s.warn('колонка', 'слайд 7', `не влезает на ~${Math.round(minGap * hs.length - free)}px`);
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
    // В Азелике на картинке видны только 43% и 15% (60% и 34% обрезаны кадрированием) — два пункта, крупнее, чем у Клиндовита
    {
      const col = cols[1];
      const x = col.x + pad;
      const ink = C.crimson;
      const items = [
        ['tb:TbUser', '43%', 'покупают лекарства по рекомендациям медицинских блогов.'],
        ['tb:TbAi', '15%', 'россиян хотя бы раз за последний год использовали ИИ для предварительного определения диагноза или поиска подходящего лекарства.'],
      ];
      const I = 72;
      const VS = 56;
      const CS = 20;
      const tw = cw - I - 22;
      const y0 = lY + lead[1] + 30;
      const hs = items.map((it) => Math.round(VS * 1.05) + 6 + measure(it[2], tw, CS, false, 1.25));
      // пункты на светлой подложке до низа карточки, по вертикали — поровну
      const boxY = y0;
      const boxH = IN0 - boxY + 14;
      s.box({ x: col.x + 14, y: boxY, w: col.w - 28, h: boxH, fill: C.cardTint });
      const g = (boxH - sum(hs)) / (items.length + 1);
      let y = boxY + g;
      items.forEach(([icon, v, cap], k) => {
        if (k) s.hline(x, y - g / 2, cw, C.white, 2.5);
        s.icon(icon, { x, y: y + 2, size: I, circle: ink });
        s.text(v, { x: x + I + 22, y, w: tw, size: VS, bold: true, lh: 1.05, color: ink });
        s.text(cap, { x: x + I + 22, y: y + Math.round(VS * 1.05) + 6, w: tw, size: CS, lh: 1.25, color: C.navy });
        y += hs[k] + g;
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
        ['tb:TbHeart', '«Прыщи влияют на меня сильнее,\nчем кажется»', 'Акне затрагивает не только кожу, но и эмоциональное состояние: уверенность в себе, настроение, общение и качество жизни. Для многих это не просто косметическая проблема, а важная часть повседневной жизни.'],
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

    source(s, '**Источники:** 1) Journal of Cosmetic Dermatology, 2026. Исследование среди 408 пациентов с акне (средний возраст 20,9 года). 2) Яндекс Реклама. Фармацевтическая отрасль: исследование и тренды, 2026 (данные опроса, сентябрь 2025). 3) Анализ отзывов и пользовательских обсуждений, 2024–2026.');
  },

  // =====================================================================
  // 8 · Тренды в категории: что это значит для Азелик в 2027
  // =====================================================================
  8: (d) => {
    const s = d.slide({
      title: 'Тренды в категории: что это значит для Азелик в 2027',
      subtitle: 'Меняется не только рынок - меняется путь пользователя к выбору и регулярному применению',
    });
    const leadH = s.text('Три изменения в категории напрямую поддерживают текущую стратегию: расширение аудитории + Comprehensive + работа на регулярность',
      { x: X0, y: TOP, w: X1 - X0, size: 24, bold: true, lh: 1.2, color: C.navy, fit: true, maxLines: 2, minSize: 20 });

    const cards = [
      { n: '01', color: C.blue, icon: 'tb:TbTrendingUp',
        h: 'Категория растёт',
        // ручные переносы: иначе строка рвётся перед «–июле» и «+16%» отрывается от «в упаковках»
        f: 'Рынок препаратов от акне\nв январе–июле 2026:\n[[+28% в деньгах]]\nи [[+16% в упаковках]].',
        t: 'Для Азелика важно усиливать территорию наружного лечения и переводить разовый выбор в регулярный контроль.',
        st: '**СТРАТЕГИЯ →** Recruitment + Frequency' },
      { n: '02', color: C.crimson, icon: 'tb:TbDeviceLaptop',
        h: 'Путь выбора становится цифровым',
        f: '[[60%]] самостоятельно ищут информацию о препаратах в интернете;\n[[34%]] используют поиск.',
        t: 'Пользователь собирает решение из нескольких источников — поэтому каналы должны работать последовательно, а не изолированно.',
        st: '**СТРАТЕГИЯ →** Comprehensive' },
      { n: '03', color: C.green, icon: 'tb:TbHeartHandshake',
        h: 'Две ключевые потребности',
        f: '«Хочу заметный результат»\nи «Боюсь испортить кожу».',
        t: 'Коммуникация должна одновременно доказывать эффективность и снимать барьер по комфорту — особенно для чувствительной кожи и 40+.',
        st: '**СТРАТЕГИЯ →** новые потребностные сегменты' },
    ];
    const cols = columns(3, { gap: 24 });
    const pad = 34;
    const cw = cols[0].w - pad * 2;
    const bd = 56;
    const y0 = TOP + leadH + 26;                 // верх кружка с номером
    const HS = 28;                               // КАПС-заголовок колонки
    const hY = y0 + bd + 20;
    const hH = max(cards.map((c) => measure(c.h.toUpperCase(), cw, HS, true, 1.1)));
    const fY = hY + hH + 34;                     // под разделителем
    const foot = cards.map((c, i) => footBlock(s, { x: cols[i].x + 14, w: cols[i].w - 28, pad: pad - 14, color: c.color, text: c.st }));
    const FH = max(foot.map((f) => f.h));
    const footY = PLQ - 14 - FH;
    // кегли факта и пояснения — общие, самые крупные, при которых всё встаёт над цветным блоком
    let FS = 27;
    let TS = 23;
    const need = () => max(cards.map((c) => measure(c.f, cw, FS, true, 1.2))) + 22 + max(cards.map((c) => measure(c.t, cw, TS, false, 1.3)));
    while ((FS > 22 || TS > 18) && fY + need() > footY - 24) { if (FS > 22) FS -= 1; if (TS > 18) TS -= 1; }
    if (fY + need() > footY - 24) s.warn('карточки', 'слайд 8', `не влезает на ~${Math.round(fY + need() - footY + 24)}px`);
    const fH = max(cards.map((c) => measure(c.f, cw, FS, true, 1.2)));

    cards.forEach((c, i) => {
      const col = cols[i];
      const x = col.x + pad;
      s.numberedCard({ x: col.x, y: y0, w: col.w, h: PLQ - y0, n: c.n, color: c.color, d: bd, pad });
      s.text(c.h.toUpperCase(), { x, y: hY, w: cw, size: HS, bold: true, lh: 1.1, color: C.navy });
      s.hline(x, fY - 17, cw);
      s.text(c.f, { x, y: fY, w: cw, size: FS, bold: true, lh: 1.2, color: C.navy, accent: c.color });
      s.text(c.t, { x, y: fY + fH + 22, w: cw, size: TS, lh: 1.3, color: C.blueText });
      foot[i].draw(footY, FH);
    });

    s.principle({ label: 'ВЫВОД ДЛЯ 2027', icon: 'bulb',
      text: 'Не просто расширяем охват: привлекаем → помогаем выбрать → снимаем барьер → формируем регулярное применение.' });
    source(s, '**Источники:** RNC Pharma 2026; исследования и анализ пользовательских обсуждений, представленные в стратегии Azelik 2027.');
  },

  // =====================================================================
  // 9 · Consumer-centric 2027: от потребности до повторного выбора
  // =====================================================================
  9: (d) => {
    // третья строка шапки исходника («Меняется не только рынок…») — повтор подзаголовка слайда 8, не переносим (см. отчёт)
    const s = d.slide({
      title: 'Consumer-centric 2027: от потребности до повторного выбора',
      // перенос после двоеточия: цепочка целиком на второй строке, а не «→ повторное применение» отдельно
      subtitle: 'Категорийные тренды переводим в единую систему:\nDigital → E-com / точка продажи → повторное применение',
    });
    const lab = s.label('ЕДИНЫЙ ПУТЬ ПОТРЕБИТЕЛЯ', { x: X0, y: TOP, w: X1 - X0, color: C.navy, size: 24 });

    const steps = [
      { n: '01', color: C.blue, h: 'Сопровождаем',
        f: 'Путь к решению становится цифровым и нелинейным',
        t1: 'Потребитель изучает акне, сравнивает решения и обращается к нескольким источникам.',
        t2: 'Digital формирует потребность и предпочтение → Search / GEO / AEO / ORM помогают выбрать.',
        role: 'Быть рядом в момент возникновения потребности и поиска решения' },
      { n: '02', color: C.crimson, h: 'Конвертируем',
        f: 'Рост категории повышает значение момента выбора',
        t1: 'Сформированный интерес должен без потерь переходить в покупку — там, где потребитель готов её совершить.',
        t2: 'Digital → E-com → аптека / дистрибуция: спрос превращаем в доступную покупку.',
        role: 'Не терять пользователя между интересом и покупкой' },
      { n: '03', color: C.green, h: 'Удерживаем',
        f: 'После первого решения важно сформировать регулярное применение',
        t1: 'В акне одновременно важны эффективный результат и уверенность, что средство не ухудшит состояние кожи.',
        t2: 'Контент → ретаргетинг / AON → повторная покупка + поддержка врача там, где нужен экспертный выбор.',
        role: 'Перевести разовый выбор в устойчивый сценарий использования' },
    ];
    const GAP = 60;                                // между карточками — стрелки ►
    const cols = columns(3, { gap: GAP });
    const pad = 32;
    const cw = cols[0].w - pad * 2;
    const bd = 56;
    const y0 = TOP + lab + 22;
    const HS = 30;
    const hY = y0 + bd + 18;
    const hH = max(steps.map((c) => measure(c.h.toUpperCase(), cw, HS, true, 1.1)));
    const fY = hY + hH + 14;
    const FS = 24;
    const fH = max(steps.map((c) => measure(c.f, cw, FS, true, 1.2)));
    const sepY = fY + fH + 20;
    const t1Y = sepY + 20;
    const foot = steps.map((c, i) => footBlock(s, { x: cols[i].x + 14, w: cols[i].w - 28, pad: pad - 14, color: c.color, label: 'РОЛЬ АЗЕЛИК', text: c.role }));
    const FH = max(foot.map((f) => f.h));
    const footY = PLQ - 14 - FH;
    // пояснение и цепочка каналов (на светлой подложке) — общий кегль, самый крупный, при котором встают над блоком роли
    const BP = pad - 14;                           // поля подложки: текст на ней — на одной вертикали с остальным
    let TS = 23;
    const t1H = (ts) => max(steps.map((c) => measure(c.t1, cw, ts, false, 1.25)));
    const t2H = (ts) => max(steps.map((c) => measure(c.t2, cw, ts, false, 1.25)));
    const need = (ts) => t1H(ts) + 20 + t2H(ts) + BP * 2;
    while (TS > 17 && t1Y + need(TS) > footY - 20) TS -= 1;
    if (t1Y + need(TS) > footY - 20) s.warn('шаги', 'слайд 9', `не влезает на ~${Math.round(t1Y + need(TS) - footY + 20)}px`);
    // подложку цепочки ставим посередине между пояснением и блоком роли
    const free = footY - 20 - (t1Y + need(TS));
    const t2Y = t1Y + t1H(TS) + 20 + Math.max(0, free / 2);
    const t2BoxH = t2H(TS) + BP * 2;

    steps.forEach((c, i) => {
      const col = cols[i];
      const x = col.x + pad;
      s.numberedCard({ x: col.x, y: y0, w: col.w, h: PLQ - y0, n: c.n, color: c.color, d: bd, pad });
      s.text(c.h.toUpperCase(), { x, y: hY, w: cw, size: HS, bold: true, lh: 1.1, color: c.color });
      s.text(c.f, { x, y: fY, w: cw, size: FS, bold: true, lh: 1.2, color: C.navy });
      s.hline(x, sepY, cw);
      s.text(c.t1, { x, y: t1Y, w: cw, size: TS, lh: 1.25, color: C.blueText });
      s.box({ x: col.x + 14, y: t2Y, w: col.w - 28, h: t2BoxH, fill: C.cardTint });
      s.text(c.t2, { x, y: t2Y + BP, w: cw, size: TS, lh: 1.25, color: C.navy });
      foot[i].draw(footY, FH);
      // стрелка к следующему шагу — цветом текущего шага
      if (i < steps.length - 1) s.chevron({ cx: col.x + col.w + GAP / 2, cy: (y0 + bd / 2 + PLQ) / 2, w: 26, h: 40, color: c.color });
    });

    s.principle({ label: 'ВЫВОД 2027', icon: 'flow',
      text: 'Digital создаёт и сопровождает спрос → E-com и дистрибуция превращают его в покупку → повторные контакты и врачебная поддержка формируют дальнейшее использование.' });
  },
};
