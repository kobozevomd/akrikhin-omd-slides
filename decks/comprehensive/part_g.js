// Comprehensive draft 2027 — часть G: слайды 37, 39, 40 черновика (эталонов фигмы нет).
const path = require('path');
const { C, ACCENTS, columns, fitSize } = require('../../lib/akrikhin');
const MEDIA = path.join(__dirname, '..', '..', 'work', 'comprehensive', 'src', 'media');

// ---------- Локальные хелперы ----------

// Картинка по высоте с сохранением пропорций (размеры исходника в px)
function imageH(s, file, src, { x, y, h }) {
  const w = Math.round((h * src[0]) / src[1]);
  s.image(path.join(MEDIA, file), { x, y, w, h });
  return w;
}

// Строка-ввод под шапкой: тёмная пилюля с меткой + пояснение справа (слайды 39, 40)
function introRow(s, { y, label, text, pillW = 266 }) {
  s.pill(label, { x: 58, y, w: pillW, h: 48 });
  s.text(text, { x: 58 + pillW + 24, y, w: 1862 - (58 + pillW + 24), h: 48, size: 20, valign: 'middle',
    fit: true, maxLines: 1, minSize: 17 });
}

// Нумерованный список с малыми номерами: заголовок пункта + текст, высота считается по тексту
function numbered(s, items, { x, y, w, d = 32, titleSize = 18, size = 16, gap = 14, color = C.blueText }) {
  let cy = y;
  items.forEach((it, i) => {
    s.badge({ x, y: cy, d, n: i + 1, color: C.tint, textColor: C.blueText, size: 16 });
    const tx = x + d + 14;
    const tw = w - d - 14;
    const th = s.text(it.title, { x: tx, y: cy + 5, w: tw, size: titleSize, bold: true, lh: 1.1, color: C.navy });
    const bh = s.text(it.text, { x: tx, y: cy + 5 + th + 4, w: tw, size, lh: 1.2, color });
    cy += Math.max(d, 5 + th + 4 + bh) + gap;
  });
  return cy - gap;
}

// Полоска-доля: светлая дорожка = 100 %, заливка = вес
function shareBar(s, { x, y, w, h = 14, share, color }) {
  s.box({ x, y, w, h, fill: C.tint, r: h / 2 });
  s.box({ x, y, w: Math.round(w * share), h, fill: color, r: h / 2 });
}

// Заголовок колонки-карточки: номер-кружок + КАПС-заголовок (+ подпись под ним)
function cardHead(s, { x, y, w, n, color, title, sub, subColor = C.blueText, subBold = false }) {
  s.badge({ x, y, d: 46, n, color });
  s.text(title.toUpperCase(), { x: x + 60, y: sub ? y - 1 : y + 9, w: w - 60, size: 22, bold: true, lh: 1.1, color: C.navy,
    fit: true, maxLines: 1, minSize: 18 });
  if (sub) s.text(sub, { x: x + 60, y: y + 27, w: w - 60, size: 16, bold: subBold, lh: 1.2, color: subColor });
}

module.exports = {
  // ---------- 37. Comprehensive-подход в E-com ----------
  37: (d) => {
    const s = d.slide({
      title: 'Использование Comprehensive-подхода в E-com',
      subtitle: 'Масштабирование связки «сегмент → e-com сигнал → персонализированный креатив» и тест новых креативных механик в рамках маркетплейсов с реализацией на стороне Акрихин',
    });
    const TOP = 221;
    const BOT = 1019;
    const [L, R] = columns(2, { gap: 23 });

    // ===== 01. Персонализация e-com контакта =====
    s.card({ x: L.x, y: TOP, w: L.w, h: BOT - TOP });
    const lx = L.x + 30;
    const lw = L.w - 60;
    s.label('01  Персонализация e-com контакта', { x: lx, y: 249, w: lw, color: C.crimson });

    // столбцы таблицы: сегмент → контекст → креатив
    const col = [
      { x: lx, w: 318, n: '01', t: 'Сегмент', sub: 'из digital-стратегии' },
      { x: lx + 344, w: 262, n: '02', t: 'Контекст', sub: 'подбор e-com сигнала' },
      { x: lx + 632, w: lw - 632, n: '03', t: 'Креатив', sub: 'повтор 360° message' },
    ];
    const HY = 287;
    col.forEach((c, i) => {
      s.badge({ x: c.x, y: HY, d: 38, n: c.n, color: C.tint, textColor: C.blueText, size: 16 });
      s.text(c.t, { x: c.x + 48, y: HY + 3, w: c.w - 48, size: 26, bold: true, lh: 1.1, color: C.navy });
      s.text(c.sub, { x: c.x, y: HY + 48, w: c.w, size: 16, lh: 1.2, color: C.blueText });
      if (i < 2) s.chevron({ cx: c.x + c.w + 13, cy: HY + 19, w: 14, h: 22 });
    });
    s.hline(lx, 366, lw);

    const rows = [
      {
        color: C.crimson,
        seg: '**SPRINT win the competition**\n**Ж 18–34 · Новые средства**\n- Ищут новое решение и готовы пробовать альтернативы привычному уходу (анти-акне уход + проф. косметологические процедуры)',
        ctx: 'Покупки / интересы к средствам/лекарствам категории «уход за лицом, проблемная кожа, аптечная косметика»; покупки смежных SKU',
        img: ['img_44a17bb2bf.png', [184, 393]],
      },
      {
        color: C.teal,
        seg: '**SPRINT win the competition**\n**Switchers МЖ 18–34 (Skinoclear)**\n- Пользователи / потенциальные switchers конкурентов',
        ctx: 'Покупки / интерес к конкурентным брендам и anti-acne SKU; ретаргетинг по релевантным карточкам',
        img: ['img_990dd37847.png', [225, 403]],
      },
      {
        color: C.purple,
        seg: '**EXPAND THE CATEGORY**\n**МЖ 18–40 · акне / постакне**\n- Важно не только убрать воспаления, но и работать с последствиями',
        ctx: 'Повторные покупки; просмотр / корзина derm-SKU',
        img: ['img_abbb1acb3e.png', [276, 463]],
      },
    ];
    const RY = 380;
    const RH = 136;
    const RP = 152;
    rows.forEach((r, i) => {
      const y = RY + i * RP;
      if (i > 0) s.hline(lx, y - 8, lw);
      s.box({ x: col[0].x, y, w: 6, h: RH, fill: r.color, r: 3 });
      // первая строка сегмента — цветом полоски
      const [l1, ...rest] = r.seg.split('\n');
      const h1 = s.text(l1, { x: col[0].x + 18, y, w: col[0].w - 18, size: 16, lh: 1.2, color: r.color });
      s.text(rest.join('\n'), { x: col[0].x + 18, y: y + h1, w: col[0].w - 18, h: RH - h1, size: 16, lh: 1.2,
        color: C.navy, fit: true, minSize: 14 });
      s.text(r.ctx, { x: col[1].x, y, w: col[1].w, h: RH, size: 16, lh: 1.2, fit: true, minSize: 14 });
      imageH(s, r.img[0], r.img[1], { x: col[2].x, y, h: RH });
    });
    s.vline(col[1].x - 13, RY, RP * 2 + RH);

    // как оценить
    const EY = 836;
    const EB = 989;
    s.box({ x: lx, y: EY, w: lw, h: EB - EY, fill: C.cardTint, stroke: C.line });
    let ey = EY + 16;
    ey += s.text('Как оценить эффективность персонализации в e-com', { x: lx + 20, y: ey, w: lw - 40, size: 20, bold: true, lh: 1.1, color: C.navy }) + 8;
    ey += s.text('**Контроль:** тот же сегмент + тот же e-com сигнал + базовый креатив\n**Тест:** тот же сегмент/контекст + персонализированный 360° message',
      { x: lx + 20, y: ey, w: lw - 40, size: 16 }) + 8;
    s.text('[[**Сравнение uplift:**]] **CTR → Add-to-cart → To buy**\n[[**Decision gate:**]] **масштабирование связки при uplift по CTR/корзине/заказам**',
      { x: lx + 20, y: ey, w: lw - 40, size: 16, color: C.navy });

    // ===== 02. Тест новых механик =====
    s.card({ x: R.x, y: TOP, w: R.w, h: BOT - TOP });
    const rx = R.x + 30;
    const rw = R.w - 60;
    s.label('02  Тест новых механик', { x: rx, y: 249, w: rw, color: C.blue });
    s.heading('A/B-тест главного фото:\nпроверка креатива уже внутри карточки', { x: rx, y: 285, w: rw, size: 28 });

    // перенос персонализации + скриншот карточек
    const BY = 362;
    const BH = 244;
    s.box({ x: rx, y: BY, w: rw, h: BH, fill: C.white, stroke: C.line });
    const ih = BH - 20;
    const iw = Math.round((ih * 1448) / 1086);
    s.image(path.join(MEDIA, 'img_0874aa6a47.png'), { x: rx + rw - 10 - iw, y: BY + 10, w: iw, h: ih });
    const tw = rw - iw - 20 - 34;
    const t1 = s.text('**Перенос персонализации внутрь карточки:** для одного SKU показываются разные главные фото разным сегментам аудитории. Сегмент задаётся по параметрам **пол, возраст, семейное положение и регион**, а WB автоматически подбирает наиболее релевантных пользователей. Так связка **«сегмент → персонализированный креатив»** продолжается уже в e-com',
      { x: rx + 20, y: BY + 16, w: tw, size: 16, fit: true, h: BH - 58, minSize: 14 });
    s.text('* Фактический состав аудитории может частично отличаться от заданных параметров.',
      { x: rx + 20, y: BY + 16 + t1 + 10, w: tw, size: 14 });

    // методология A/B-теста
    const MY = BY + BH + 16;
    s.box({ x: rx, y: MY, w: rw, h: EB - MY, fill: C.cardTint, stroke: C.line });
    let my = MY + 16;
    my += s.text('Как оценить эффективность карточки для целевой аудитории', { x: rx + 20, y: my, w: rw - 40, size: 20, bold: true, lh: 1.1, color: C.navy }) + 10;
    my += s.label('Методология A/B-теста', { x: rx + 20, y: my, w: rw - 40, size: 16, color: C.crimson }) + 10;
    my = numbered(s, [
      { title: 'Деление аудитории 50/50', text: 'Параллельно тестируется **текущее фото (A) и новый персонализированный креатив (B)** на сопоставимых группах пользователей' },
      { title: 'Фиксация условий теста', text: 'Тест **идет 1–8 недель**. В этот период не меняется главное фото вручную и поддерживается наличие товара, чтобы результат отражал именно эффект креатива' },
      { title: 'Масштабирование только подтвержденных вариантов', text: 'Сравниваются варианты по воронке **переход в карточку → корзина → заказ**. При статистически значимом uplift масштабируется победивший креатив; если разницы нет — **продление теста или проверка новой гипотезы.**' },
    ], { x: rx + 20, y: my, w: rw - 40, gap: 12 });
    s.text('Scale: победивший visual → default на карточке', { x: rx + 20, y: my + 12, w: rw - 40, size: 18, bold: true, color: C.crimson });

    s.footnote('* Метрики — по доступности данных площадки / поставщика', { x: L.x, w: L.w });
    s.footnote('Источник: Wildberries Seller, «А/Б-тестирование главного фото в карточке товара», обновлено 27.08.2026', { x: R.x, w: R.w });
  },

  // ---------- 39. Brand Attention Monitor ----------
  39: (d) => {
    const s = d.slide({
      title: 'Brand Attention Monitor: еженедельный сигнал о\u00A0бренде между волнами BHT',
      subtitle: 'Еженедельный сигнал органического интереса, скорректированный по BHT, чтобы бренд-команда могла управлять медиа и реагировать на конкурентов до следующей волны Brand Health',
    });
    introRow(s, { y: 221, label: 'Brand Attention',
      text: 'Регулярный тактический мониторинг, а не отдельная метрика: еженедельное внимание → калибровка по BHT → решения между волнами BHT' });

    // таймлайн между волнами BHT
    const LY = 420;          // ось линии
    const BD = 84;           // круги BHT
    const x0 = 58 + BD;      // линия от круга до круга
    const x1 = 1862 - BD;
    const pitch = (x1 - x0) / 12;
    const dotX = (i) => Math.round(x0 + i * pitch);
    s.hline(x0, LY, x1 - x0, C.sky, 4);
    [[58, 'волна BHT', 'left'], [1862 - BD, 'следующая волна BHT', 'right']].forEach(([x, cap, al]) => {
      s.badge({ x, y: LY - BD / 2, d: BD, n: 'BHT', color: C.blue, size: 22 });
      s.text(cap, { x: al === 'left' ? 58 : 1862 - 260, y: LY + BD / 2 + 8, w: 260, size: 16, bold: true, color: C.navy, align: al });
    });
    const act = { 8: 'перераспределить медиа-вес', 10: 'ответить на активность конкурента' };
    for (let i = 1; i <= 11; i++) {
      const cx = dotX(i);
      if (act[i]) {
        s.circle({ x: cx - 16, y: LY - 16, d: 32, fill: C.crimson });
        s.text(act[i], { x: cx - 130, y: LY + 26, w: 260, size: 16, bold: true, lh: 1.1, color: C.crimson, align: 'center' });
      } else {
        s.circle({ x: cx - 11, y: LY - 11, d: 22, fill: C.sky });
      }
    }

    // три фазы над линией
    const SY = 300;
    [
      { x: 170, t: 'Калибровка по BHT', d: 'Веса источников обновляются после каждой волны BHT' },
      { x: 690, t: 'Еженедельный мониторинг', d: 'Индекс внимания, доля vs конкуренты, Paid vs Unpaid' },
      { x: dotX(8) - 20, t: 'Решения между волнами', d: 'Медиа-вес, каналы, реакция на конкурентов', hl: true },
    ].forEach((st, i) => {
      s.badge({ x: st.x, y: SY, d: 40, n: i + 1, color: st.hl ? C.crimson : C.tint, textColor: st.hl ? C.white : C.blueText, size: 18 });
      s.text(st.t.toUpperCase(), { x: st.x + 54, y: SY + 1, w: 470, size: 20, bold: true, lh: 1.0, color: C.navy });
      s.text(st.d, { x: st.x + 54, y: SY + 27, w: 470, size: 16, color: C.blueText });
    });

    // четыре колонки
    const CY = 518;
    const CH = 905 - CY;
    const data = [
      { t: 'Единый индекс внимания', tag: 'Одна еженедельная динамика', d: 'Paid Search, Video, Telegram и Media объединяются в единую динамику органического интереса + доля внимания бренда vs прямые конкуренты', q: 'Органический интерес растет или снижается?' },
      { t: 'Paid vs Unpaid', tag: 'Отделяем эффект медиа от органики', d: 'Показы кампаний на той же временной шкале: какая часть изменения связана с Paid Media, а какая возникла органически', q: 'Поднял ли flight внимание выше базового тренда?' },
      { t: 'Мониторинг конкурентов', tag: 'Реагируем тактически', d: 'Еженедельно видим активность конкурентов. Пример: растет видеоактивность конкурента → усиливаем поддержку блогерами / TikTok', q: 'Где конкурент усиливается и как мы отвечаем?' },
      { t: 'Между волнами BHT', tag: 'Определяем следующий шаг', d: 'Индекс, скорректированный по BHT, показывает, как Paid и Organic каналы меняют брендовые метрики до следующей волны', q: 'Какие медиа усилить до следующей волны?' },
    ];
    const cols4 = columns(4, { gap: 23 });
    // один кегль заголовков на все четыре колонки — по самому длинному
    const TS = Math.min(...data.map((it) => fitSize(it.t.toUpperCase(), 22, 18, cols4[0].w - 54 - 56, 1, true)));
    cols4.forEach((c, i) => {
      const color = ACCENTS[i];
      const px = c.x + 27;
      const pw = c.w - 54;
      s.card({ x: c.x, y: CY, w: c.w, h: CH });
      s.badge({ x: px, y: CY + 26, d: 46, n: i + 1, color });
      s.text(data[i].t.toUpperCase(), { x: px + 56, y: CY + 26, w: pw - 56, h: 46, size: TS, bold: true, lh: 1.0, color: C.navy,
        valign: 'middle' });
      s.box({ x: px, y: CY + 92, w: pw, h: 58, fill: color });
      s.text(data[i].tag.toUpperCase(), { x: px + 16, y: CY + 92, w: pw - 32, h: 58, size: 18, bold: true, lh: 1.1, color: C.white,
        valign: 'middle', fit: true, maxLines: 2, minSize: 15 });
      s.text(data[i].d, { x: px, y: CY + 172, w: pw, h: 96, size: 18, fit: true, minSize: 16 });
      s.text('ДЛЯ КОМАНДЫ МАРКЕТИНГА', { x: px, y: CY + 290, w: pw, size: 16, bold: true, lh: 1.0, color: C.crimson });
      s.text(data[i].q, { x: px, y: CY + 316, w: pw, h: 44, size: 18, bold: true, lh: 1.2, color: C.navy, fit: true, minSize: 16 });
    });

    s.principle({ x: 110, w: 1700, icon: 'tb:TbChartLine', label: 'Результат',
      text: 'Индекс внимания | Доля внимания | Paid vs Unpaid | Сигналы по конкурентам | Еженедельная рекомендация по оптимизации' });
    s.footnote('**Роль в Comprehensive:** еженедельный сигнал → калибровка по BHT → решение для планирования', { x: 110, w: 1700, size: 16, align: 'center' });
  },

  // ---------- 40. Brand Attention Monitor в деталях ----------
  40: (d) => {
    const s = d.slide({
      title: 'Brand Attention Monitor в деталях: источники, индекс и\u00A0пример использования',
      subtitle: 'Автоматический ежедневный сбор из открытых источников, единый еженедельный индекс с калибровкой по BHT и доля внимания внутри конкурентного набора',
    });
    introRow(s, { y: 221, label: 'Как это работает',
      text: 'Открытые источники → единый еженедельный индекс → доля внимания vs конкуренты → решения для бренд-команды' });

    const CY = 295;
    const CH = 905 - CY;
    const [c1, c2, c3] = columns(3, { gap: 22 });
    const HY = CY + 28;

    // 1. Источники и веса
    {
      const x = c1.x + 30;
      const w = c1.w - 60;
      s.card({ x: c1.x, y: CY, w: c1.w, h: CH });
      cardHead(s, { x, y: HY, w, n: 1, color: ACCENTS[0], title: 'Источники и веса', sub: 'стартовые веса, калибруются по BHT', subColor: C.crimson, subBold: true });
      const src = [
        ['Search', 0.4, 'Wordstat, поиск в online-аптеках, AI-ответы'],
        ['Video', 0.2, 'YouTube, Rutube, VK Video, TikTok; голос учитывается через авто-субтитры'],
        ['Telegram', 0.2, 'каналы врачей, педиатров и мам'],
        ['Media', 0.2, 'Фармвестник, Vademecum и деловые Media'],
      ];
      src.forEach(([name, share, desc], i) => {
        const y = HY + 86 + i * 100;
        s.text(name, { x, y, w: w - 80, size: 20, bold: true, lh: 1.0, color: C.navy });
        s.text(`${Math.round(share * 100)}%`, { x: x + w - 80, y, w: 80, size: 20, bold: true, lh: 1.0, color: C.navy, align: 'right' });
        shareBar(s, { x, y: y + 28, w, share, color: i === 0 ? C.blue : C.cyan });
        s.text(desc, { x, y: y + 50, w, h: 38, size: 15, lh: 1.2, fit: true, minSize: 14 });
      });
      s.box({ x, y: 813, w, h: 64, fill: C.cardTint, stroke: C.line });
      s.text('Вне индекса: аптечная полка и маркетплейсы как контекст покупки', { x: x + 18, y: 813, w: w - 36, h: 64, size: 16, bold: true,
        color: C.navy, valign: 'middle' });
    }

    // 2. Единый еженедельный индекс
    {
      const x = c2.x + 30;
      const w = c2.w - 60;
      s.card({ x: c2.x, y: CY, w: c2.w, h: CH, tint: true });
      cardHead(s, { x, y: HY, w, n: 2, color: ACCENTS[1], title: 'Единый еженедельный индекс' });
      s.box({ x, y: HY + 86, w, h: 120, fill: C.blue });
      s.text('Индекс = 100 × Σ\n(вес × текущая неделя ÷ базовая неделя)', { x: x + 16, y: HY + 86, w: w - 32, h: 120, size: 22, bold: true,
        lh: 1.25, color: C.white, align: 'center', valign: 'middle', fit: true, minSize: 18 });
      s.bullets([
        '100 — нормальный уровень бренда; линия показывает рост / снижение относительно него',
        'Share of Attention — доля бренда внутри конкурентного набора',
        'Веса источников перекалибруются по BHT после каждой волны',
        'Препарат, названный только голосом в видео, учитывается через авто-субтитры',
      ], { x, y: HY + 246, w, size: 18, gap: 30 });
    }

    // 3. Пример: Azelik vs Skinoclear — живые мини-графики
    {
      const x = c3.x + 30;
      const w = c3.w - 60;
      s.card({ x: c3.x, y: CY, w: c3.w, h: CH });
      cardHead(s, { x, y: HY, w, n: 3, color: ACCENTS[2], title: 'Пример · Azelik vs Skinoclear', sub: 'Демо Акрихин, сентябрь 2026' });
      // легенда (одна на три мини-графика)
      const LGY = HY + 84;
      [['Azelik', C.blue], ['Skinoclear', C.crimson]].forEach(([nm, col], i) => {
        const lx = x + i * 150;
        s.box({ x: lx, y: LGY + 2, w: 16, h: 16, fill: col, r: 3 });
        s.text(nm, { x: lx + 24, y: LGY, w: 120, size: 16, bold: true, lh: 1.2, color: C.navy });
      });
      // доли (%) — общий график с одной шкалой; просмотры (тыс.) — отдельный, у них своя шкала.
      // Столбцы, а не полосы: LibreOffice переносит подписи горизонтальных полос по их толщине.
      // Подписи категорий — текстом под графиком (область построения задана вручную, полосы категорий ровные)
      const GY = LGY + 34;
      const GH = 240;
      const chartOpts = { y: GY, h: GH, legend: false, min: 0, gap: 50, overlap: -8, labelSize: 14, labelBold: true,
        extra: { catAxisLabelPos: 'none', layout: { x: 0, y: 0.12, w: 1, h: 0.88 } } };
      const catLabels = (labels, cx, cw) => labels.forEach((t, i) => {
        const bw = cw / labels.length;
        t = t.replace('поиске (', 'поиске\n(').replace('поиска в ', 'поиска\nв ').replace('YouTube, ', 'YouTube,\n');
        s.text(t, { x: Math.round(cx + i * bw + 4), y: GY + GH + 8, w: Math.round(bw - 8), size: 15, lh: 1.1, align: 'center' });
      });
      const wA = 334;
      const catA = ['Доля в поиске (Wordstat)', 'Доля поиска в online-аптеках'];
      s.chart('col', [
        { name: 'Azelik', labels: catA, values: [0.46, 0.53] },
        { name: 'Skinoclear', labels: catA, values: [0.49, 0.41] },
      ], { ...chartOpts, x, w: wA, format: '0%', max: 0.6 });
      catLabels(catA, x, wA);
      s.vline(x + wA + 12, GY + 10, GH + 40);
      const xB = x + wA + 24;
      const wB = w - wA - 24;
      const catB = ['Просмотры YouTube, 90 дней'];
      s.chart('col', [
        { name: 'Azelik', labels: catB, values: [52] },
        { name: 'Skinoclear', labels: catB, values: [168] },
      ], { ...chartOpts, x: xB, w: wB, format: '0"K"', max: 190 });
      catLabels(catB, xB, wB);
      s.box({ x, y: 765, w, h: 112, fill: C.crimson });
      s.text('**Вывод:** паритет в поиске, преимущество в online-аптеках и 3× отставание в видео. Самое сильное видео конкурента — у врача-блогера → основание для DOL и интеграций с блогерами',
        { x: x + 18, y: 765, w: w - 36, h: 112, size: 18, lh: 1.2, color: C.white, valign: 'middle', fit: true, minSize: 16 });
    }

    s.principle({ x: 110, w: 1700, icon: 'tb:TbShieldCheck', label: 'Pharm-safe',
      text: 'Rx: инвестиции и внимание не объединяем на одном экране | работаем с агрегированными цифрами, а не с пользовательскими текстами | индекс не равен охвату и продажам' });
    s.footnote('Пример источников: Wordstat (Россия, 4 недели до 31.08.2026), поиск в online-аптеках, YouTube (90 дней)', { x: 110, w: 1700, align: 'center' });
  },
};
