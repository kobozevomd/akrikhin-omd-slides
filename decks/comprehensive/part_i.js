// Часть I деки «Comprehensive draft 2027»: слайды 46–49 черновика
// (Targeting Accuracy, Traffic Verification, Paid Search quality gate, Roadmap 2027).
const { C, ACCENTS, columns, textWidth } = require('../../lib/akrikhin');

// Плашка-вывод во всю ширину контента: тексты черновика длинные, в 1236 px не встают в 2 строки
const WIDE = { x: 58, w: 1804 };

// Колонка-карточка: номер на кромке (d 46) → КАПС-метка → заголовок. Возвращает { cx, cw, y } — где продолжать
function stageCard(s, { x, w, top, bottom, n, color, label, heading, headSize = 26, pad = 33 }) {
  s.numberedCard({ x, y: top, w, h: bottom - top, n, color, d: 46, pad });
  const cx = x + pad;
  const cw = w - pad * 2;
  s.label(label, { x: cx, y: top + 66, w: cw, color });
  const hh = s.heading(heading, { x: cx, y: top + 99, w: cw, size: headSize });
  return { cx, cw, y: top + 99 + hh };
}

// Иконка в цветном кружке (галочка / крестик / любая tb:)
function roundIcon(s, name, { x, y, d = 44, color }) {
  if (name === 'check_circle' || name === 'x_circle') {
    s.icon(name, { x, y, size: d, color: C.white, bg: color });
    return;
  }
  s.circle({ x, y, d, fill: color });
  const k = Math.round(d * 0.6);
  s.icon(name, { x: x + (d - k) / 2, y: y + (d - k) / 2, size: k, color: C.white });
}

module.exports = {
  // ---------- 46. Targeting Accuracy Methodology ----------
  46: (d) => {
    const s = d.slide({
      title: 'Targeting Accuracy Methodology: управляем качеством попадания в ЦА по совокупности сигналов',
      subtitle: 'Подтверждаем попадание корзиной media + post-click данных и улучшаем показатели в 2-недельном цикле',
    });

    // Верхняя полоса: сборка сегмента → проверка качества
    s.card({ x: 58, y: 221, w: 1804, h: 100, tint: true });
    s.label('Сборка сегмента', { x: 91, y: 243, w: 700, color: C.crimson });
    s.text('Разные цифровые сигналы → единая гипотеза аудитории', { x: 91, y: 277, w: 760, size: 23, bold: true, lh: 1.1, color: C.navy });
    s.arrow({ dir: 'right', x: 845, y: 271, len: 92, head: 54, headLen: 32, stem: 20 });
    s.label('Проверка качества', { x: 980, y: 243, w: 700, color: C.crimson });
    s.text('Несколько систем → единый Targeting Accuracy Index → действие', { x: 980, y: 277, w: 860, size: 23, bold: true, lh: 1.1, color: C.navy });

    const cols = columns(3, { gap: 22 });
    const top = 345;
    const bottom = 905;

    // 1. Строим сегмент
    {
      const c = stageCard(s, { ...cols[0], top, bottom, n: 1, color: ACCENTS[0], label: 'Строим сегмент', heading: 'Не один ID, а комбинация цифровых признаков' });
      s.steps([
        { title: 'SOC-DEM', text: 'вероятность пола / возраста по digital-сигналам' },
        { title: 'ИНТЕРЕСЫ И ТЕМЫ', text: 'категории интересов + смежные темы' },
        { title: 'ПОВЕДЕНИЕ', text: 'потребление контента + digital-активность' },
        { title: 'SIMILAR IDS', text: 'похожие cookies / unified IDs + платформенные модели' },
      ], { x: c.cx, y: c.y + 26, w: c.cw, pitch: 87, titleSize: 20, highlightLast: true });
    }

    // 2. Подтверждаем: три системы
    {
      const c = stageCard(s, { ...cols[1], top, bottom, n: 2, color: ACCENTS[1], label: 'Подтверждаем', heading: 'Ни одна система не является единственной «истиной»' });
      const rows = [
        { t: 'AdRiver / MEDIA', v: '35%', color: C.green, d: 'доставка в ЦА • frequency • overlap • площадки' },
        { t: 'Я.МЕТРИКА / POST-CLICK', v: '65%', color: C.blue, d: 'профиль визитов после клика — сигнал ближе к покупке' },
        { t: 'TNS / TIBURON', v: 'DIAGNOSTIC', color: C.crimson, d: 'независимая panel check при достаточной базе' },
      ];
      const bh = 86;
      const gap = 14;
      let y = c.y + 22;
      rows.forEach((r) => {
        s.box({ x: c.cx, y, w: c.cw, h: bh, fill: C.white, stroke: C.line, sw: 1.5 });
        const vs = 26;
        const vw = Math.ceil(textWidth(r.v, vs, true)) + 8;
        s.text(r.v, { x: c.cx + c.cw - 20 - vw, y: y + 11, w: vw, size: vs, bold: true, lh: 1.0, color: r.color, align: 'right' });
        s.text(r.t, { x: c.cx + 20, y: y + 15, w: c.cw - 40 - vw - 10, size: 19, bold: true, lh: 1.0, color: C.navy });
        s.text(r.d, { x: c.cx + 20, y: y + 50, w: c.cw - 40, size: 16, lh: 1.2 });
        y += bh + gap;
      });
      s.text('KPI ≥ 70%', { x: c.cx, y: y + 6, w: c.cw, size: 28, bold: true, lh: 1.0, color: C.crimson });
    }

    // 3. Оптимизируем: схема 2-недельного цикла
    {
      const col = cols[2];
      const c = stageCard(s, { ...col, top, bottom, n: 3, color: ACCENTS[2], label: 'Оптимизируем', heading: '2-недельный цикл: сигнал → действие → повторная проверка' });
      const th = s.text('Если Targeting Accuracy ниже 70%, запускаем диагностику и корректировки, а затем повторно измеряем эффект.',
        { x: c.cx, y: c.y + 14, w: c.cw, size: 17, bold: true, lh: 1.2, color: C.navy });
      const cd = 112;               // круг TA INDEX
      const bw = 172;               // боковые блоки
      const gapX = (c.cw - bw * 2 - cd) / 2;
      // схема (от верха круга до низа нижнего блока = cd + 34 + 74) — по центру свободного места под текстом
      const free0 = c.y + 14 + th;
      const cy = free0 + Math.round((bottom - 30 - free0 - (cd + 108)) / 2) + cd / 2; // центр круга
      const ccx = c.cx + bw + gapX + cd / 2;
      const sideBox = (x, t1, t2) => {
        s.box({ x, y: cy - 46, w: bw, h: 92, fill: C.white, stroke: C.line, sw: 1.5 });
        s.text(`**${t1}**\n${t2}`, { x: x + 10, y: cy - 46, w: bw - 20, h: 92, size: 15, lh: 1.2, color: C.navy, align: 'center', valign: 'middle' });
      };
      sideBox(c.cx, 'ЕЖЕНЕДЕЛЬНО', 'AdRiver + Метрика');
      sideBox(c.cx + c.cw - bw, 'ДИАГНОСТИКА', 'Mediascope / Tiburon');
      s.hline(c.cx + bw, cy, gapX, C.blue, 3);
      s.hline(ccx + cd / 2, cy, gapX, C.blue, 3);
      s.circle({ x: ccx - cd / 2, y: cy - cd / 2, d: cd, fill: C.blue });
      s.text('TA INDEX', { x: ccx - cd / 2, y: cy - cd / 2, w: cd, h: cd, size: 18, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
      const bbw = 330;
      const bby = cy + cd / 2 + 34;
      s.vline(ccx, cy + cd / 2, 34, C.blue, 3);
      s.box({ x: ccx - bbw / 2, y: bby, w: bbw, h: 74, fill: C.white, stroke: C.line, sw: 1.5 });
      s.text('**КОРРЕКТИРУЕМ**\nвеса • filters • exclusions • sources', { x: ccx - bbw / 2 + 10, y: bby, w: bbw - 20, h: 74, size: 15, lh: 1.2, color: C.navy, align: 'center', valign: 'middle' });
    }

    s.principle({ ...WIDE, icon: 'target', label: 'Принцип 2027',
      text: 'Targeting Accuracy - управляемая вероятность попадания, а не «паспортная» точность: строим сегмент на совокупности цифровых сигналов, подтверждаем качество несколькими системами и масштабируем только после KPI ≥70%.' });
  },

  // ---------- 47. Transparency & Traffic Verification ----------
  47: (d) => {
    const s = d.slide({
      title: 'Transparency & Traffic Verification: качество трафика становится стандартом закупки',
      subtitle: 'Управляемый контур: benchmark → еженедельный контроль → оптимизация → выводы по поставщику → следующий флайт',
    });
    const cols = columns(3, { gap: 22 });
    const top = 221;
    const bottom = 905;

    // 1. Benchmarks 2027: метрики с порогами
    {
      const c = stageCard(s, { ...cols[0], top, bottom, n: 1, color: ACCENTS[0], label: 'Benchmarks 2027', heading: 'Единый quality gate для измеримого digital-инвентаря' });
      const rows = [
        ['GIVT', '≤ 0,5%', 'невалидный технический трафик'],
        ['SIVT', '≤ 3,0%', 'сложный невалидный трафик'],
        ['VIEWABILITY DISPLAY', '≥ 68%', 'видимый контакт'],
        ['VIEWABILITY OLV', '≥ 93%', 'видимый видеоконтакт'],
        ['BRAND SAFETY', '≥ 95%', 'безопасный контекст'],
      ];
      const rh = 78;
      const gap = 10;
      let y = c.y + 20;
      rows.forEach(([name, v, desc]) => {
        s.box({ x: c.cx, y, w: c.cw, h: rh, fill: C.cardTint });
        s.text(name, { x: c.cx + 18, y, w: 190, h: rh, size: 17, bold: true, lh: 1.1, color: C.blueText, valign: 'middle' });
        s.text(v, { x: c.cx + 212, y, w: 112, h: rh, size: 26, bold: true, lh: 1.0, color: C.blue, valign: 'middle' });
        s.text(desc, { x: c.cx + 330, y, w: c.cw - 330 - 14, h: rh, size: 15, bold: true, lh: 1.15, color: C.navy, valign: 'middle' });
        y += rh + gap;
      });
      s.text('Источник benchmark: AdRiver - GIVT/SIVT/Viewability;\nАРИР - Brand Safety', { x: c.cx, y: y + 4, w: c.cw, size: 14, lh: 1.2 });
    }

    // 2. Quality gate: шаги
    {
      const c = stageCard(s, { ...cols[1], top, bottom, n: 2, color: ACCENTS[1], label: 'Quality gate', heading: 'Отклонение от benchmark автоматически запускает действие' });
      s.steps([
        { title: 'ДО КАМПАНИИ', text: 'quality KPI + benchmarks + blacklists + full verification, где технически возможно' },
        { title: 'ЕЖЕНЕДЕЛЬНО', text: 'GIVT / SIVT / Viewability / Brand Safety VS benchmark' },
        { title: 'ТРИГГЕР', text: 'GIVT/SIVT: +0,5 п.п. | Viewability/BS: –5 п.п. | либо повтор 2\u00A0недели' },
        { title: 'ДЕЙСТВИЕ', text: 'площадка / SSP → blacklist / whitelist → перераспределение бюджета' },
        { title: 'ПОСЛЕ ФЛАЙТА', text: 'final quality score → learnings → обновленные правила для следующей закупки' },
      ], { x: c.cx, y: c.y + 24, w: c.cw, pitch: 96, titleSize: 20 });
    }

    // 3. Operating standard: три крупных показателя
    {
      const c = stageCard(s, { ...cols[2], top, bottom, n: 3, color: ACCENTS[2], label: 'Operating standard', heading: 'От мониторинга → к стандарту качества закупки' });
      const stats = [
        { value: '82–85%', label: 'покрытие технически верифицируемого сплита', color: C.blue },
        { value: '≤ 3', unit: 'дней', label: 'реакция на отклонение', color: C.crimson },
        { value: '–50%', unit: 'YoY', label: 'повтор проблемных источников', color: C.green },
      ];
      let y = c.y + 20;
      stats.forEach((st) => {
        s.stat({ x: c.cx, y, w: c.cw, h: 122, ...st });
        y += 122 + 16;
      });
      s.text('Скоринг поставщиков + blacklist/whitelist переходят в следующий бренд внутри категории', { x: c.cx, y: y + 4, w: c.cw, size: 16, bold: true, lh: 1.2, color: C.navy });
    }

    s.principle({ ...WIDE, icon: 'checklist', label: 'Принцип 2027',
      text: 'Качество трафика = условие масштабирования: если benchmark нарушен, сначала исправляем источник / закупку, не выделяем доп. инвестиции' });
  },

  // ---------- 48. Paid Search 2027: объявление отвечает намерению ----------
  48: (d) => {
    const s = d.slide({
      title: 'Paid Search 2027: объявление должно отвечать намерению пользователя',
      subtitle: 'До запуска каждое поисковое объявление проходит единую проверку качества: намерение пользователя → полнота объявления → призыв к действию → ценность предложения для покупки',
    });

    // Слева: 4 проверки качества 2 × 2
    const L = { x: 58, y: 221, w: 880, h: 549 };
    s.card(L);
    s.label('Проверка качества перед запуском', { x: L.x + 33, y: 255, w: 800, color: C.purple });
    const checks = [
      { t: 'ЗАГОЛОВОК = НАМЕРЕНИЕ', d: 'Бренд, симптом / категория, конкурент и покупка получают разные формулировки' },
      { t: 'РАСШИРЕНИЯ = МАКСИМУМ', d: 'Быстрые ссылки, описания, уточнения, визитка и промо заполняются там, где доступны' },
      { t: 'CTA = ЭТАП CJM', d: 'Призыв соответствует задаче пользователя: узнать → сравнить → купить' },
      { t: 'ЦЕНА / СКИДКА = ПОКУПКА', d: 'Цена, скидка и наличие используются в транзакционных кампаниях - когда усиливают готовность к заказу' },
    ];
    const gx = columns(2, { x0: L.x + 33, x1: L.x + L.w - 33, gap: 20 });
    const bh = 210;
    checks.forEach((it, i) => {
      const bx = gx[i % 2].x;
      const bw = gx[i % 2].w;
      const by = 297 + Math.floor(i / 2) * (bh + 20);
      const color = ACCENTS[i];
      s.box({ x: bx, y: by, w: bw, h: bh, fill: C.white, stroke: C.line, sw: 1.5 });
      s.badge({ x: bx + 22, y: by + 22, d: 46, n: i + 1, color });
      s.text(it.t, { x: bx + 82, y: by + 22, w: bw - 82 - 16, h: 46, size: 19, bold: true, lh: 1.05, color, valign: 'middle', fit: true, minSize: 17 });
      s.text(it.d, { x: bx + 22, y: by + 90, w: bw - 44, h: bh - 90 - 16, size: 20, lh: 1.2, fit: true, minSize: 16 });
    });

    // Справа: тексты по типу поискового намерения (ярлыки как на слайде 15 фигмы)
    const R = { x: 961, y: 221, w: 901, h: 549 };
    s.card(R);
    s.label('Текст по типу поискового намерения', { x: R.x + 33, y: 255, w: 820, color: C.green });
    const hh = s.heading('Единая согласованная база объявлений - разные акценты в зависимости от типа поискового намерения', { x: R.x + 33, y: 289, w: R.w - 66, size: 24 });
    const intents = [
      { t: 'БРЕНД', icon: 'tb:TbRosette', color: C.cyan, d: 'официальность • доверие • удобство • быстрый переход к действию' },
      { t: 'КАТЕГОРИЯ / СИМПТОМ', icon: 'tb:TbListDetails', color: C.blue, d: 'понимание проблемы • экспертность • решение конкретной потребности' },
      { t: 'КОНКУРЕНТ', icon: 'tb:TbUsersGroup', color: C.orange, d: 'сравнительные преимущества • критерии выбора • УТП' },
      { t: 'ПОКУПКА', icon: 'tb:TbShoppingCart', color: C.green, d: 'наличие • цена • скидка • простой путь к заказу' },
    ];
    const ry0 = 289 + hh + 16;
    const rp = (R.y + R.h - 22 - ry0) / intents.length;
    intents.forEach((it, i) => {
      const ry = ry0 + i * rp;
      if (i > 0) s.hline(R.x + 33, ry, R.w - 66);
      const ty = ry + (rp - 58) / 2;
      s.box({ x: R.x + 33, y: ty, w: 270, h: 58, fill: it.color });
      s.icon(it.icon, { x: R.x + 47, y: ty + 13, size: 32, color: C.white });
      s.text(it.t, { x: R.x + 92, y: ty, w: 200, h: 58, size: 17, bold: true, lh: 1.05, color: C.white, valign: 'middle' });
      s.text(it.d, { x: R.x + 333, y: ry, w: R.w - 333 - 33, h: rp, size: 18, bold: true, lh: 1.2, color: C.navy, valign: 'middle' });
    });

    // Полоса Decision gate: 3 исхода
    const G = { x: 58, y: 793, w: 1804, h: 112 };
    s.card({ ...G, tint: true });
    const my = G.y + G.h / 2;
    s.text('DECISION GATE', { x: 91, y: my - 13, w: 230, size: 25, bold: true, lh: 1.0, color: C.crimson });
    const gates = [
      { icon: 'check_circle', color: C.green, t: 'ПРОШЛО 4 ПРОВЕРКИ', d: 'объявление готово к запуску', x: 360, w: 430 },
      { icon: 'x_circle', color: C.crimson, t: 'НЕ ПРОШЛО ХОТЯ БЫ 1', d: 'возвращаем на корректировку', x: 830, w: 430 },
      { icon: 'tb:TbRefresh', color: C.blue, t: 'ПЕРЕПРОВЕРКА ПРИ ИЗМЕНЕНИИ СЕМАНТИКИ', d: 'правило действует для всех Tier-2 Paid Search РК', x: 1300, w: 540 },
    ];
    gates.forEach((g, i) => {
      if (i > 0) s.vline(g.x - 20, my - 30, 60);
      roundIcon(s, g.icon, { x: g.x, y: my - 22, d: 44, color: g.color });
      s.text(g.t, { x: g.x + 60, y: my - 26, w: g.w - 60, size: 18, bold: true, lh: 1.0, color: C.navy });
      s.text(g.d, { x: g.x + 60, y: my + 3, w: g.w - 60, size: 17, lh: 1.2 });
    });

    s.principle({ ...WIDE, icon: 'bulb', label: 'Принцип 2027',
      text: 'Нет универсального поискового объявления: intent определяет заголовок, набор расширений, CTA и допустимость транзакционного оффера' });
  },

  // ---------- 49. 2027 Transformation Roadmap ----------
  49: (d) => {
    const s = d.slide({ title: '2027 Transformation Roadmap\nProve → Standardize → Scale' });

    s.label('Roadmap 2027', { x: 58, y: 221, w: 600, color: C.blue });
    // Стартовая точка
    const B = { x: 58, y: 254, w: 1804, h: 88 };
    s.card({ ...B, tint: true });
    s.text('СТАРТОВАЯ ТОЧКА:\nH2 2026', { x: 91, y: B.y, w: 260, h: B.h, size: 23, bold: true, lh: 1.1, color: C.crimson, valign: 'middle' });
    s.vline(370, B.y + 18, B.h - 36, C.line, 2);
    s.text('Comprehensive-подход подтвержден на реальных кампаниях: сегментная модель, правила overlap, пилоты CMP / AI-video, workflow блогеров, DMP-тесты и оценка бизнес-эффекта',
      { x: 400, y: B.y, w: 1430, h: B.h, size: 20, bold: true, lh: 1.2, color: C.navy, valign: 'middle' });

    // Три этапа со стрелками
    const stages = [
      { n: 1, name: 'ПОДТВЕРДИТЬ', when: 'Q1 / начало 2027', head: 'Проверить новые возможности на реальных задачах брендов',
        items: ['Калибровка OMD Voice', 'Пилот Brand Attention Monitor', 'Тесты AI-DSP-сегментов из OMD Voice', 'Тесты персонализированных LP', 'Создание AI-video для новых брендов'],
        foot: 'Доказательство' },
      { n: 2, name: 'СТАНДАРТИЗИРОВАТЬ', when: 'Q2 2027', head: 'Перевести успешные пилоты в управляемые операционные правила',
        items: ['Golden Rules / правила принятия решений', 'AI-скоринг блогеров', 'DO & DON’Ts playbook в разбивке по брендам для написания сценариев в Influence', 'Comprehensive для E-com', 'единая система измерения'],
        foot: 'Операционная модель' },
      { n: 3, name: 'МАСШТАБИРОВАТЬ', when: 'H2 2027', head: 'Масштабировать только то, что имеет доказанный эффект и повторяемый процесс',
        items: ['cross-brand повторное использование по типу задачи', 'встроить правила в годовое / flight-планирование', 'масштабировать production- и targeting-маршруты', 'единая библиотека знаний', 'годовая перекалибровка'],
        foot: 'Масштабируемая компетенция' },
    ];
    const cols = columns(3, { gap: 70 });
    const top = 366;
    const bottom = 905;
    const d0 = 70;
    const pad = 33;
    stages.forEach((st, i) => {
      const { x, w } = cols[i];
      const color = ACCENTS[i];
      s.numberedCard({ x, y: top, w, h: bottom - top, n: st.n, color, d: d0, pad });
      const cx = x + pad;
      const cw = w - pad * 2;
      const ty = top + d0 + 16;
      const ww = Math.ceil(textWidth(st.when, 18, true)) + 8;
      s.text(st.name, { x: cx, y: ty, w: cw - ww - 12, size: 30, bold: true, lh: 1.0, color });
      s.text(st.when, { x: cx + cw - ww, y: ty + 7, w: ww, size: 18, bold: true, lh: 1.0, color, align: 'right' });
      const hy = ty + 46;
      s.text(st.head, { x: cx, y: hy, w: cw, h: 76, size: 21, bold: true, lh: 1.15, color: C.navy, fit: true, minSize: 18 });
      s.bullets(st.items, { x: cx, y: hy + 92, w: cw, h: bottom - 84 - (hy + 92), size: 19, gap: 15 });
      s.hline(cx, bottom - 64, cw);
      s.label(st.foot, { x: cx, y: bottom - 46, w: cw, color });
      if (i < stages.length - 1) s.chevron({ cx: x + w + 35, cy: (top + d0 / 2 + bottom) / 2, w: 26, h: 42 });
    });

    s.principle({ ...WIDE, icon: 'flow', label: 'Результат 2027',
      text: 'От отдельных AI-пилотов к масштабируемой системе, которая превращает успешные тесты в общие правила для брендов и повышает отдачу от инвестиций год к году' });
  },
};
