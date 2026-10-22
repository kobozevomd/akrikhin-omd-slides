// Часть H деки Comprehensive 2027: слайды черновика 41, 42, 44, 45 (AI scoring блогеров, Golden Rules, Segment overlap).
// Эталонов фигмы для этих слайдов нет — раскладка по архетипам DESIGN.md (7, 9, 12, 5).
const { C, ACCENTS, CHART_COLORS, columns, IN, PT } = require('../../lib/akrikhin');
const MEDIA = require('path').join(__dirname, '..', '..', 'work', 'comprehensive', 'src', 'media');

// ---------- Локальные хелперы ----------

// Метка раздела черновика («AI SCORING I») + поясняющая строка справа
function tagRow(s, tag, text, y) {
  s.pill(tag, { x: 58, y, w: 220, h: 44, color: C.navy, size: 20 });
  s.text(text, { x: 302, y, w: 1560, h: 44, size: 18, valign: 'middle', fit: true, maxLines: 2, minSize: 16 });
}

// Белый блок с цветной обводкой внутри карточки
function outlined(s, { x, y, w, h, color, sw = 2 }) {
  s.box({ x, y, w, h, fill: C.white, stroke: color, sw });
}

module.exports = {
  // 41. AI scoring I: проверки → AI pre-score → decision gate
  41: (d) => {
    const s = d.slide({
      title: 'AI scoring в работе с блогерами: отбор авторов и оценка вероятности риска',
      subtitle: 'AI переносит выявление рисков на этап до создания сценария и съемок; команды проверяют только приоритетных авторов',
    });
    tagRow(s, 'AI scoring I', 'До начала взаимодействия с блогером предварительно оцениваем соответствие и риски; AI сокращает исходный список и выделяет случаи, требующие экспертной проверки', 221);

    const Y0 = 283;
    const Y1 = 905;

    // Слева: три блока проверок
    const L = { x: 58, w: 540 };
    const blocks = [
      { t: 'СООТВЕТСТВИЕ АУДИТОРИИ И КОНТЕНТА', items: ['Соответствие ЦА / контента айдентике бренда', 'ER, качество аудитории, наличие ботов', 'Характер рекламы, целостность и последовательность контента'] },
      { t: 'COMPLIANCE И ОФИЦИАЛЬНЫЙ СТАТУС', items: ['Регистрация в РКН / проверка официальных реестров', 'Статус иноагента и другие legal red flags', 'Политические / религиозные / запрещенные темы'] },
      { t: 'РЕПУТАЦИЯ И КОНФЛИКТЫ', items: ['Недавние интеграции с конкурентами', 'Скандалы / репутационные инциденты', 'Контекст упоминаний в Media: позитивный / нейтральный / негативный'] },
    ];
    const gapB = 16;
    const bh = Math.floor((Y1 - Y0 - gapB * 2) / 3);
    blocks.forEach((b, i) => {
      const y = Y0 + i * (bh + gapB);
      s.card({ x: L.x, y, w: L.w, h: bh });
      s.badge({ x: L.x + 24, y: y + 20, d: 46, n: i + 1, color: ACCENTS[i] });
      s.text(b.t, { x: L.x + 86, y: y + 20, w: L.w - 110, h: 46, size: 20, bold: true, lh: 1.1, color: C.navy, valign: 'middle', fit: true, maxLines: 2, minSize: 17 });
      s.bullets(b.items, { x: L.x + 30, y: y + 86, w: L.w - 56, h: bh - 98, size: 16, gap: 6 });
      s.chevron({ cx: L.x + L.w + 26, cy: y + bh / 2 });
    });

    // Центр: AI pre-score и четыре шкалы
    const M = { x: 650, w: 570 };
    const inner = (o) => ({ x: o.x + 30, w: o.w - 60 });
    const mi = inner(M);
    s.card({ x: M.x, y: Y0, w: M.w, h: Y1 - Y0, tint: true });
    s.pill('AI pre-score', { x: mi.x, y: Y0 + 28, w: mi.w, h: 52, color: C.blue, size: 22 });
    s.text('AI объединяет сигналы соответствия, качества, соблюдения требований и репутации в единую систему оценки для принятия решений',
      { x: mi.x, y: Y0 + 100, w: mi.w, h: 80, size: 18, bold: true, color: C.navy, fit: true, minSize: 16 });
    const scores = [
      ['FIT SCORE', 'Релевантность аудитории / контента', C.blue],
      ['QUALITY SCORE', 'Подлинность аудитории / рекламная нагрузка', C.teal],
      ['COMPLIANCE RISK', 'Официальные / Legal / brand-safety риски', C.crimson],
      ['REPUTATION RISK', 'Конфликты / контекст упоминаний в медиа / инциденты', C.orange],
    ];
    const RY0 = Y0 + 196;
    const RY1 = Y1 - 28;
    const gapR = 12;
    const rh = Math.floor((RY1 - RY0 - gapR * 3) / 4);
    scores.forEach(([lab, desc, color], i) => {
      const y = RY0 + i * (rh + gapR);
      outlined(s, { x: mi.x, y, w: mi.w, h: rh, color });
      s.text(lab, { x: mi.x + 18, y, w: 168, h: rh, size: 18, bold: true, lh: 1.1, color, valign: 'middle', fit: true, maxLines: 2, minSize: 16 });
      s.text(desc, { x: mi.x + 196, y, w: mi.w - 212, h: rh, size: 16, valign: 'middle', fit: true, minSize: 14 });
    });
    s.chevron({ cx: M.x + M.w + 26, cy: (Y0 + Y1) / 2 });

    // Справа: decision gate
    const R = { x: 1272, w: 590 };
    const ri = inner(R);
    s.card({ x: R.x, y: Y0, w: R.w, h: Y1 - Y0 });
    s.pill('Decision gate', { x: ri.x, y: Y0 + 28, w: ri.w, h: 52, color: C.navy, size: 22 });
    s.text('AI не утверждает блогера — он определяет приоритет следующего действия человека',
      { x: ri.x, y: Y0 + 100, w: ri.w, h: 80, size: 18, bold: true, color: C.navy, fit: true, minSize: 16 });
    const gates = [
      ['GREEN', 'SHORTLIST', 'Высокий fit / низкий риск → к переговорам', C.green],
      ['YELLOW', 'MANUAL REVIEW', 'Сильный потенциал, но есть минимум один risk signal', C.orange],
      ['RED', 'STOP-LIST', 'Критичный compliance / reputation / fit risk', C.crimson],
    ];
    const gapG = 14;
    const gh = Math.floor((RY1 - RY0 - gapG * 2) / 3);
    gates.forEach(([c, name, desc, color], i) => {
      const y = RY0 + i * (gh + gapG);
      outlined(s, { x: ri.x, y, w: ri.w, h: gh, color });
      s.circle({ x: ri.x + 22, y: y + 24, d: 22, fill: color });
      s.text(c, { x: ri.x + 58, y: y + 22, w: 120, size: 20, bold: true, lh: 1.1, color });
      s.text(name, { x: ri.x + 180, y: y + 22, w: ri.w - 200, size: 20, bold: true, lh: 1.1, color: C.navy });
      s.text(desc, { x: ri.x + 22, y: y + 60, w: ri.w - 44, h: gh - 70, size: 16, fit: true, minSize: 14 });
    });

    s.principle({ label: 'Результат AI', icon: 'tb:TbSparkles', w: 1500,
      text: 'Рейтинг приоритета  |  Вероятность риска  |  Stop-list  |  Risk flags  |  Shortlist / резервный пул' });
    s.footnote('**Human in the loop: финальное решение остается за Marketing / Legal**', { size: 16, align: 'center' });
  },

  // 42. AI scoring II: четыре этапа от брифа до обучения
  42: (d) => {
    const s = d.slide({
      title: 'AI scoring в работе с блогерами: сценарий, compliance pre-check и обучение на результатах кампании',
      subtitle: 'AI ускоряет подготовку и раньше выявляет риски; финальное согласование остается за человеком на каждом критическом этапе',
    });
    tagRow(s, 'AI scoring II', 'После отбора блогера повторно используем тот же подход к контролю качества — от первого черновика до финального контента и анализа результатов кампании', 221);

    const Y0 = 283;
    const Y1 = 808;
    const data = [
      { t: 'ЗАФИКСИРОВАННЫЙ БРИФ', h: 'Input', items: ['RTB / обязательные сообщения', 'Tone of voice', 'Do’s & Don’ts'], p: 'Человек: фиксирует бриф / RTB' },
      { t: 'ПЕРВЫЙ ДРАФТ СЦЕНАРИЯ', h: 'AI создает', items: ['Структуру драфта', 'Адаптацию под стиль блогера', 'Версию под формат / платформу'], p: 'Человек: редактирует / утверждает сценарий' },
      { t: 'QA ПЕРЕД ПУБЛИКАЦИЕЙ', h: 'AI проверяет', items: ['Соответствие RTB / брифу', 'Стоп-слова / упоминания конкурентов', 'Med / Legal / Brand маркеры риска'], p: 'Человек: финальное Med / Legal / Brand подтверждение' },
      { t: 'МОНИТОРИНГ И ОБУЧЕНИЕ', h: 'AI обучается', items: ['Тональность комментариев', 'Performance / аномалии CPV', 'Обновленная оценка автора'], p: 'Человек: принимает решение о будущем рейтинге / использовании' },
    ];
    const cols = columns(4, { gap: 50 });
    cols.forEach((col, i) => {
      const it = data[i];
      const color = ACCENTS[i];
      const cx = col.x + 26;
      const cw = col.w - 52;
      s.card({ x: col.x, y: Y0, w: col.w, h: Y1 - Y0 });
      s.badge({ x: cx, y: Y0 + 24, d: 46, n: i + 1, color });
      s.text(it.t, { x: cx + 60, y: Y0 + 24, w: cw - 60, h: 46, size: 20, bold: true, lh: 1.1, color: C.navy, valign: 'middle', fit: true, maxLines: 2, minSize: 17 });
      s.pill(it.h, { x: cx, y: Y0 + 94, w: cw, h: 48, color, size: 20 });
      // пункты — по фиксированной сетке строк, чтобы стояли на одной высоте во всех колонках
      it.items.forEach((b, j) => s.bullets([b], { x: cx + 4, y: Y0 + 176 + j * 72, w: cw - 4, h: 50, size: 20 }));
      const hy = Y1 - 26 - 92;
      outlined(s, { x: cx, y: hy, w: cw, h: 92, color });
      s.icon('tb:TbUserCheck', { x: cx + 16, y: hy + 28, size: 36, color });
      s.text(it.p, { x: cx + 66, y: hy + 6, w: cw - 80, h: 80, size: 16, bold: true, color: C.navy, valign: 'middle', fit: true, minSize: 14 });
      if (i < 3) s.chevron({ cx: col.x + col.w + 25, cy: (Y0 + Y1) / 2 });
    });

    // Полоса: единый слой контроля качества
    s.card({ x: 58, y: 826, w: 1804, h: 79, tint: true });
    s.text('ЕДИНЫЙ AI QUALITY-CONTROL СЛОЙ', { x: 91, y: 826, w: 430, h: 79, size: 20, bold: true, lh: 1.1, color: C.crimson, valign: 'middle', fit: true, maxLines: 2, minSize: 17 });
    s.vline(540, 846, 39, C.line, 2);
    s.text('Одна и та же логика brief / risk применяется на всех этапах: draft generation → pre-check → final content → campaign learning',
      { x: 566, y: 826, w: 1266, h: 79, size: 18, bold: true, color: C.navy, valign: 'middle', fit: true, maxLines: 2, minSize: 16 });

    s.principle({ label: 'Результат AI', icon: 'tb:TbSparkles', w: 1640,
      text: 'Черновик сценария  |  QA-комментарии  |  Risk flags  |  Отклонения финального контента  |  Обновленная оценка автора' });
  },

  // 44. Golden Rules: процесс из 5 шагов + 6 примеров правил
  44: (d) => {
    const s = d.slide({
      title: 'Golden Rules и библиотека решений 2027: каждый тест должен формировать правило для повторного использования',
      subtitle: 'Ценность Test & Learn — в правиле принятия решения, которое можно повторно использовать для следующего бренда в портфеле',
    });

    // Карточка 1: от теста к правилу
    const A0 = 221;
    const A1 = 556;
    s.card({ x: 58, y: A0, w: 1804, h: A1 - A0, tint: true });
    s.label('От теста к правилу', { x: 91, y: A0 + 28, w: 800, color: C.blue });
    const steps = [
      ['ТЕСТ', 'Проводим тест в сопоставимых условиях', 'одинаковая задача / тип инвентаря / логика креатива'],
      ['ДОКАЗАТЕЛЬСТВО', 'Оцениваем полный результат', 'media + post-click\nbrand / business — где применимо'],
      ['DECISION GATE', 'Фиксируем конкретное решение', 'масштабировать / оптимизировать / остановить / повторить тест'],
      ['GOLDEN RULE', 'Переводим результат в правило', 'порог / маршрут / поставщик /\nQA-критерий'],
      ['ПОВТОРНОЕ ИСПОЛЬЗОВАНИЕ', 'Применяем между брендами', 'добавляем в библиотеку планирования и бриф следующего запуска'],
    ];
    const sc = columns(5, { x0: 91, x1: 1829, gap: 36 });
    const by = A0 + 72;
    const bh = A1 - 26 - by;
    sc.forEach((col, i) => {
      const [lab, head, desc] = steps[i];
      const color = ACCENTS[i];
      const cx = col.x + 20;
      const cw = col.w - 40;
      s.box({ x: col.x, y: by, w: col.w, h: bh, fill: C.white, stroke: C.line, sw: 1.5 });
      s.badge({ x: cx, y: by + 18, d: 40, n: i + 1, color });
      s.text(lab, { x: cx + 52, y: by + 16, w: cw - 52, h: 44, size: 18, bold: true, lh: 1.1, color, valign: 'middle', fit: true, maxLines: 2, minSize: 16 });
      s.text(head, { x: cx, y: by + 76, w: cw, h: 50, size: 20, bold: true, lh: 1.1, color: C.navy, fit: true, maxLines: 2, minSize: 17 });
      s.text(desc, { x: cx, y: by + 134, w: cw, h: bh - 146, size: 16, fit: true, minSize: 14 });
      if (i < 4) s.chevron({ cx: col.x + col.w + 18, cy: by + bh / 2 });
    });

    // Карточка 2: примеры Golden Rules
    const B0 = 572;
    const B1 = 905;
    s.card({ x: 58, y: B0, w: 1804, h: B1 - B0, tint: true });
    s.label('Примеры Golden Rules', { x: 91, y: B0 + 28, w: 800, color: C.crimson });
    const rules = [
      ['ТАРГЕТИНГ', 'Пересечение / частота', '>25% пересечения = диагностика, не автоматическая остановка; сохраняем сегмент при высокой эффективности'],
      ['AI DSP', 'Выбор поставщика', 'выбираем по связке аудитория × KPI × подтвержденный результат'],
      ['PRODUCTION', 'Выбор production-маршрута', 'Classic / CMP / гибридная модель выбираем заранее по связке master × объем работ × legal risk'],
      ['AI-VIDEO', 'Критерий масштабирования', 'масштабируем только варианты с подтвержденным дополнительным media / brand эффектом'],
      ['БЛОГЕРЫ', 'Проверка рисков', 'AI pre-score → shortlist / ручная проверка / stop-list до начала переговоров'],
      ['AI VISIBILITY', 'Экосистема спроса', 'SEO / GEO / ORM / Paid Search управляются как единый контур спроса и доверия'],
    ];
    const rc = columns(6, { x0: 91, x1: 1829, gap: 17 });
    const ry = B0 + 72;
    const rh = B1 - 26 - ry;
    rc.forEach((col, i) => {
      const [lab, head, desc] = rules[i];
      const color = ACCENTS[i];
      const cx = col.x + 18;
      const cw = col.w - 36;
      s.box({ x: col.x, y: ry, w: col.w, h: rh, fill: C.white, stroke: C.line, sw: 1.5 });
      s.text(lab, { x: cx, y: ry + 18, w: cw, h: 24, size: 20, bold: true, lh: 1.1, color, fit: true, maxLines: 1, minSize: 17 });
      s.text(head, { x: cx, y: ry + 52, w: cw, h: 40, size: 16, bold: true, color: C.navy, fit: true, maxLines: 2, minSize: 15 });
      s.text(desc, { x: cx, y: ry + 98, w: cw, h: rh - 108, size: 16, fit: true, minSize: 14 });
    });

    s.principle({ label: 'Принцип 2027', icon: 'target', w: 1640,
      text: 'Каждый пилот завершается зафиксированным Decision Gate и условиями повторного использования — иначе это остается кейсом, а не системной компетенцией' });
  },

  // 45. Segment overlap: 2026 → 2027, диагностика / решение / синергия
  45: (d) => {
    const s = d.slide({
      title: 'Segment overlap: от контроля пересечений к управлению синергией сегментов',
      subtitle: 'Overlap — диагностический сигнал, а не критерий исключения: сохраняем эффективные пересечения и управляем каналами, сообщениями и частотой после подтверждения результата',
    });

    // Полоса «было → стало»
    const S0 = 221;
    const SH = 92;
    s.card({ x: 58, y: S0, w: 1804, h: SH, tint: true });
    s.label('2026 логика', { x: 91, y: S0 + 20, w: 560, color: C.blue });
    s.text('Overlap = риск дублирования / потери эффективности', { x: 91, y: S0 + 50, w: 600, size: 20, bold: true, color: C.navy, fit: true, maxLines: 1, minSize: 17 });
    s.arrow({ dir: 'right', x: 722, y: S0 + SH / 2, len: 90, head: 52, headLen: 34, stem: 20 });
    s.label('2027 логика', { x: 846, y: S0 + 20, w: 560, color: C.crimson });
    s.text('Overlap = потенциальная синергия после проверки эффективности и частоты', { x: 846, y: S0 + 50, w: 985, size: 20, bold: true, color: C.navy, fit: true, maxLines: 1, minSize: 17 });

    // Три колонки
    const Y0 = S0 + SH + 16;
    const Y1 = 905;
    const cols = columns(3, { gap: 22 });
    const head = (col, i, lab, text) => {
      const x = col.x + 30;
      const w = col.w - 60;
      s.card({ x: col.x, y: Y0, w: col.w, h: Y1 - Y0 });
      s.badge({ x, y: Y0 + 22, d: 38, n: i + 1, color: ACCENTS[i] });
      s.label(lab, { x: x + 50, y: Y0 + 31, w: w - 50, color: ACCENTS[i] });
      s.text(text, { x, y: Y0 + 76, w, h: 54, size: 22, bold: true, lh: 1.1, color: C.navy, fit: true, maxLines: 2, minSize: 20 });
      return { x, w };
    };

    // 1. Диагностируем
    {
      const { x, w } = head(cols[0], 0, 'Диагностируем', 'Оцениваем overlap в контексте, а не как самостоятельный KPI');
      const rows = [
        ['Уровень overlap', '≤25% — рабочий уровень;\n>25% — диагностируем причины'],
        ['Exclusive reach', '30%+ — минимум;\n40%+ — целевой уровень'],
        ['Frequency', '2–4 контакта — рабочий диапазон'],
        ['Эффективность', 'media + post-click / конверсия'],
      ];
      const ry = Y0 + 156;
      const pitch = 76;
      rows.forEach(([name, desc], i) => {
        const y = ry + i * pitch;
        const hl = i === rows.length - 1;
        s.badge({ x, y: y + 2, d: 34, n: i + 1, color: hl ? C.crimson : C.tint, textColor: hl ? C.white : C.blueText });
        s.text(name, { x: x + 48, y, w: 200, h: 40, size: 19, bold: true, color: C.navy, valign: 'middle', fit: true, maxLines: 1, minSize: 17 });
        s.text(desc, { x: x + 254, y, w: w - 254, h: 40, size: 16, valign: 'middle', fit: true, minSize: 14 });
      });
      s.hline(x, Y1 - 66, w);
      s.text('**ПЛАН:** AiData — прогноз  |  **ФАКТ:** AdRiver — результат кампании', { x, y: Y1 - 52, w, h: 30, size: 16, color: C.navy, fit: true, maxLines: 1, minSize: 14 });
    }

    // 2. Принимаем решение
    {
      const { x, w } = head(cols[1], 1, 'Принимаем решение', 'Одинаковый overlap может вести к разным действиям');
      const opts = [
        ['≤25% + сильный KPI', 'ОСТАВИТЬ', 'Используем как multi-occasion охват', C.green],
        ['>25% + сильный KPI', 'ОСТАВИТЬ / ОПТИМИЗИРОВАТЬ', 'Разводим роли / каналы / вес', C.teal],
        ['>25% + слабый KPI', 'СОКРАТИТЬ / ИСКЛЮЧИТЬ', 'Убираем дублирование без ценности', C.crimson],
      ];
      const oy0 = Y0 + 150;
      const gapO = 14;
      const oh = Math.floor((Y1 - 28 - oy0 - gapO * 2) / 3);
      opts.forEach(([cond, act, desc, color], i) => {
        const y = oy0 + i * (oh + gapO);
        outlined(s, { x, y, w, h: oh, color });
        const t = y + Math.round(oh / 2) - 34; // группа «условие + действие + пояснение» по центру блока
        s.text(cond, { x: x + 20, y: t + 4, w: 240, size: 18, bold: true, lh: 1.1, color: C.navy });
        s.text(act, { x: x + 250, y: t, w: w - 270, h: 42, size: 17, bold: true, lh: 1.1, color, align: 'right', fit: true, maxLines: 2, minSize: 15 });
        s.text(desc, { x: x + 20, y: t + 48, w: w - 40, size: 16 });
      });
    }

    // 3. Создаем синергию
    {
      const { x, w } = head(cols[2], 2, 'Создаем синергию', 'Один пользователь ≠ одно сообщение');
      const th = s.text('Синергия возникает, когда каждый контакт отражает другой релевантный окейжен или CJM-роль',
        { x, y: Y0 + 116, w, size: 18, bold: true, color: C.navy });
      // Схема: USER в центре, три разных контакта вокруг
      const cxm = x + w / 2;
      const ud = 84;
      const uy = Y0 + 116 + th + 30;
      s.circle({ x: cxm - ud / 2, y: uy, d: ud, fill: C.blue });
      s.text('USER', { x: cxm - ud / 2, y: uy, w: ud, h: ud, size: 18, bold: true, color: C.white, align: 'center', valign: 'middle' });
      const my = uy + ud / 2;
      s.hline(cxm - ud / 2 - 44, my, 32, C.cyan, 3);
      s.hline(cxm + ud / 2 + 12, my, 32, C.cyan, 3);
      s.vline(cxm, uy + ud + 8, 20, C.cyan, 3);
      s.text('Проблема /\nтриггер', { x, y: my - 22, w: cxm - ud / 2 - 54 - x, h: 44, size: 16, bold: true, color: C.navy, align: 'right', valign: 'middle' });
      s.text('Контекст /\nокейжен', { x: cxm + ud / 2 + 54, y: my - 22, w: x + w - (cxm + ud / 2 + 54), h: 44, size: 16, bold: true, color: C.navy, valign: 'middle' });
      s.text('Альтернативное сообщение', { x: cxm - 160, y: uy + ud + 34, w: 320, size: 16, bold: true, color: C.navy, align: 'center' });
      // Условия
      const ky = uy + ud + 34 + 20 + 22;
      s.text('Синергия возможна только при 3 условиях:', { x, y: ky, w, size: 18, bold: true, color: C.crimson });
      const cy0 = ky + 34;
      const pitch = 46;
      s.checks(['разные роли / сообщения по оккейженам', 'частота в диапазоне 2–4', 'качество post-click не ухудшается'],
        { x, y: cy0, w, pitch, size: 17 });
      if (cy0 + pitch * 2 + 35 > Y1 - 20) console.warn('слайд 45: условия синергии вылезают за карточку');
    }

    s.principle({ label: 'Принцип 2027', icon: 'target', w: 1804,
      text: 'Оптимизируем портфель сегментов, а не отдельные аудитории — сохраняем эффективных пользователей в пересечении и сокращаем только overlap, который не создает дополнительной ценности' });
  },
};
