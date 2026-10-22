// Часть E деки «Comprehensive draft 2027»: слайды 28–31 черновика (AI Visibility, Paid Search, ORM).
// Раскладка 28, 30, 31 — по эталонам фигмы 11, 12, 13; 29 — без эталона (цикл из 4 шагов, как фигма 11/14).
const { C, ACCENTS, CHART_COLORS, columns, IN, PT } = require('../../lib/akrikhin');
const MEDIA = require('path').join(__dirname, '..', '..', 'work', 'comprehensive', 'src', 'media');

module.exports = {
  // 28 ↔ фигма 11: логика CJM из 5 шагов со стрелками + 5 колонок каналов + плашка
  28: (d) => {
    const s = d.slide({
      title: 'AI Visibility Stream 2027',
      subtitle: 'Переход к единой системе присутствия на пути\nПоиск → AI-ответ → Проверка доверия → Выбор → Действие',
    });
    const cols = columns(5);
    const colors = [C.blue, C.cyan, C.green, C.orange, C.crimson];
    s.label('Логика CJM 2027', { x: 58, y: 223, w: 600, color: C.blue });

    const steps = [
      ['Поиск', 'вопрос / симптом / категория'],
      ['Получение ответа', 'поисковая выдача / AI / LLM'],
      ['Проверка', 'экспертность / отзывы / обсуждения'],
      ['Выбор', 'сравнение вариантов'],
      ['Действие', 'переход / покупка'],
    ];
    cols.forEach((c, i) => {
      // карточка шага 300…442, номер d70 висит на верхней кромке
      s.numberedCard({ x: c.x, y: 262, w: c.w, h: 180, n: i + 1, color: colors[i], d: 70, pad: 28 });
      s.text(steps[i][0].toUpperCase(), { x: c.x + 28, y: 348, w: c.w - 46, h: 30, size: 26, bold: true, lh: 1.1,
        color: colors[i], fit: true, maxLines: 1, minSize: 22 });
      s.text(steps[i][1], { x: c.x + 28, y: 386, w: c.w - 46, h: 42, size: 16, fit: true, minSize: 15 });
      if (i < cols.length - 1) s.chevron({ cx: c.x + c.w + 11.5, cy: 371, color: C.blue });
    });

    const ch = [
      ['SEO', 'Фундамент видимости',
        'Органическая поисковая видимость: сайт, структура, семантика, контент и техническая база',
        'приоритетные темы, сильные страницы, органический спрос'],
      ['GEO / AEO', 'Присутствие в AI-ответах',
        'Делает бренд и продукт понятными генеративным системам; повышает вероятность упоминания и цитирования',
        'слабые промты, gap-темы, список цитируемых источников'],
      ['Внешние публикации', 'Авторитет вне сайта',
        'Создают независимые экспертные источники, на которые могут опираться поиск и AI-системы',
        'авторитетные подтверждения и дополнительные точки контакта'],
      ['ORM + сообщества', 'Доверие и рекомендации',
        'Формируют внешнее информационное поле: отзывы, рейтинги, Q&A, тематические обсуждения и ответы бренда',
        'реальные вопросы,\nриск-тезисы, пользовательский язык'],
      ['Paid Search', 'Захват и защита спроса',
        'Учитывает намерение пользователя, защищает бренд и перехватывает спрос на разных этапах выбора — от симптома и категории до покупки',
        'спрос, конкуренцию, CR / CPA и быстрые сигналы качества'],
    ];
    cols.forEach((c, i) => {
      const [name, role, desc, gives] = ch[i];
      const x = c.x + 28;
      const w = c.w - 56;
      s.card({ x: c.x, y: 470, w: c.w, h: 435 });
      // ряды колонок на одной высоте: канал 494, роль 590, описание 662, «Передает» 768
      s.text(name.toUpperCase(), { x, y: 494, w, h: 76, size: 34, bold: true, lh: 1.1, color: colors[i], fit: true, maxLines: 2, minSize: 28 });
      s.text(role.toUpperCase(), { x, y: 590, w, h: 64, size: 28, bold: true, lh: 1.1, color: C.navy, fit: true, maxLines: 2, minSize: 22 });
      s.text(desc, { x, y: 662, w, h: 98, size: 16, fit: true, minSize: 15 });
      s.box({ x: c.x + 20, y: 768, w: c.w - 40, h: 114, fill: colors[i] });
      s.text('Передает:', { x: c.x + 38, y: 782, w: c.w - 76, size: 16, color: C.white });
      s.text(gives, { x: c.x + 38, y: 806, w: c.w - 76, h: 62, size: 16, bold: true, color: C.white, fit: true, minSize: 14 });
    });

    s.principle({ icon: 'target', label: '2027 принцип', w: 1674,
      text: 'Единый AI Visibility Stream: общая семантика и фактология → разные роли каналов → единый цикл данных и оптимизации' });
  },

  // 29 (эталона нет): единый цикл из 4 шагов → полоса обратной связи → ключевые правила → синяя плашка
  29: (d) => {
    const s = d.slide({
      title: 'Операционная модель 2027: единая семантика и один цикл оптимизации',
      subtitle: 'AI Visibility Stream работает как замкнутая система: запросы → контент → внешняя авторитетность → доверие → захват спроса → новые данные для следующего цикла',
    });
    s.label('Единый цикл', { x: 58, y: 223, w: 600, color: C.blue });
    const cols = columns(4, { gap: 40 });
    const colors = [C.blue, C.cyan, C.purple, C.crimson];
    const data = [
      ['Запросы', 'SEO-ядро + Paid Search запросы + GEO промпты + вопросы из сообществ',
        'Единая карта: что ищут / спрашивают / сравнивают'],
      ['Собственный контент', 'SEO-страницы + контент под извлекаемость GEO/AEO + релевантные посадочные страницы',
        'Закрываем приоритетные темы и оккейжены'],
      ['Внешний авторитет', 'Экспертные публикации + ORM + Q&A + тематические обсуждения',
        'Подтверждаем фактологию вне сайта и усиливаем доверие'],
      ['Захват спроса и новые данные', 'Paid Search + SEO + AI monitoring +\npost-click / CR / CPA',
        'Захватываем спрос и возвращаем данные в следующий цикл'],
    ];
    cols.forEach((c, i) => {
      const [t, desc, res] = data[i];
      // карточка 300…572
      s.numberedCard({ x: c.x, y: 262, w: c.w, h: 310, n: i + 1, color: colors[i], d: 70, pad: 30 });
      const x = c.x + 30;
      const w = c.w - 60;
      s.text(t.toUpperCase(), { x, y: 348, w, h: 58, size: 26, bold: true, lh: 1.1, color: colors[i], fit: true, maxLines: 2, minSize: 22 });
      s.text(desc, { x, y: 420, w, h: 66, size: 18, fit: true, minSize: 16 });
      s.box({ x: c.x + 20, y: 496, w: c.w - 40, h: 58, fill: C.cardTint });
      s.text(res, { x: c.x + 36, y: 496, w: c.w - 72, h: 58, size: 16, bold: true, color: C.navy, valign: 'middle', fit: true, minSize: 14 });
      if (i < cols.length - 1) s.chevron({ cx: c.x + c.w + 20, cy: 436, w: 26, h: 40, color: C.blue });
    });

    // полоса обратной связи: данные цикла возвращаются в планирование (стрелки по краям, как в фигме 6)
    s.card({ x: 124, y: 594, w: 1672, h: 56 });
    s.text('новые поисковые запросы / слабые AI-темы / возражения / конкуренты / CR / CPA / quality signals → приоритизация следующего цикла',
      { x: 150, y: 594, w: 1620, h: 56, size: 20, bold: true, color: C.blue, align: 'center', valign: 'middle', fit: true, maxLines: 1, minSize: 16 });
    s.arrow({ dir: 'left', x: 58, y: 622, len: 62, head: 58, headLen: 28, stem: 28 });
    s.arrow({ dir: 'right', x: 1800, y: 622, len: 62, head: 58, headLen: 28, stem: 28 });

    // ключевые правила
    s.card({ x: 58, y: 672, w: 1804, h: 233 });
    s.label('Ключевые правила 2027', { x: 91, y: 696, w: 800, color: C.crimson });
    const rules = [
      ['SEO + Paid Search', 'Не дублируем автоматически: решение по кластеру зависит от органической позиции, конкурентного давления и\nкост-эффективности'],
      ['GEO/AEO → Content', 'Слабые промпты и отсутствующие цитируемые источники становятся входом в контент-план и внешние публикации'],
      ['ORM → Visibility', 'Работаем не на объем отзывов, а на темы, площадки и обсуждения, которые влияют на доверие и могут становиться источниками для AI.'],
    ];
    columns(3, { x0: 91, x1: 1829, gap: 22 }).forEach((c, i) => {
      s.box({ x: c.x, y: 734, w: c.w, h: 148, fill: C.cardTint });
      s.text(rules[i][0], { x: c.x + 24, y: 754, w: c.w - 48, size: 22, bold: true, lh: 1.0, color: C.navy });
      s.text(rules[i][1], { x: c.x + 24, y: 788, w: c.w - 48, h: 70, size: 18, fit: true, minSize: 16 });
    });

    s.principle({ color: C.blue, icon: 'tb:TbRefresh', label: 'Единая модель', x: 58, w: 1804,
      text: 'Единый ежемесячный обмен данными: поисковый спрос + AI Visibility + внешние источники + репутация + результаты кампаний → общие приоритеты для Tier-2' });
  },

  // 30 ↔ фигма 12: 3 стратегические роли + трансформация (цветные плитки → решение) + business impact
  30: (d) => {
    // заголовок длиннее 1 строки → библиотека сама ставит шапку «заголовок в 2 строки + подзаголовок»
    const s = d.slide({
      title: 'Paid Search Playbook 2027: от закупки трафика к управлению спросом и инвестициями',
      subtitle: 'Внутри AI Visibility Paid Search защищает сформированный спрос, расширяет вход в категорию и переводит пользователей с высокой готовностью к действию в покупку',
    });

    // --- 3 стратегические роли ---
    s.card({ x: 58, y: 221, w: 1804, h: 276, tint: true });
    s.label('3 стратегические роли', { x: 91, y: 243, w: 800, color: C.blue });
    const roleColors = [C.blue, C.cyan, C.crimson];
    const roles = [
      ['Protect', 'Защитить сформированный спрос',
        'Брендовый спрос удерживаем там, где есть риск потери первого контакта конкуренту',
        'Не терять уже сформированный спрос'],
      ['Grow', 'Расширить вход в категорию',
        'Категория + симптоматика становятся основной зоной привлечения новой аудитории до выбора бренда',
        'Увеличивать пул потенциальных покупателей'],
      ['Convert', 'Монетизировать high intent',
        'Брендовые и транзакционные запросы получают кратчайший путь к покупке — бренд / аптека',
        'Переводить намерение в измеримое действие / покупку'],
    ];
    const S = 281; // верх под-карточек ролей
    columns(3, { x0: 91, x1: 1829, gap: 12 }).forEach((c, i) => {
      const [name, head, desc, goal] = roles[i];
      const x = c.x + 28;
      const w = c.w - 56;
      s.box({ x: c.x, y: S, w: c.w, h: 196, fill: C.white, stroke: C.line, sw: 1.5 });
      s.badge({ x, y: S + 18, d: 30, n: i + 1, color: roleColors[i], size: 16 });
      s.text(name.toUpperCase(), { x: x + 40, y: S + 20, w: w - 40, size: 24, bold: true, lh: 1.0, color: roleColors[i] });
      s.text(head.toUpperCase(), { x, y: S + 60, w, h: 28, size: 23, bold: true, lh: 1.1, color: C.navy, fit: true, maxLines: 1, minSize: 20 });
      s.text(desc, { x, y: S + 97, w, h: 44, size: 18, fit: true, maxLines: 2, minSize: 16 });
      s.text(goal, { x, y: S + 155, w, h: 22, size: 16, bold: true, color: C.blue, fit: true, maxLines: 1, minSize: 15 });
    });

    // --- трансформация ---
    s.card({ x: 58, y: 517, w: 1804, h: 388, tint: true });
    s.text('Синхронизация SEO+GEO/AEO+Paid search — Q4 2026\nПолная трансформация — 2027'.toUpperCase(),
      { x: 91, y: 538, w: 760, size: 20, bold: true, lh: 1.1, color: C.crimson });
    s.text('Фиксированный бюджет/мес → динамическое распределение инвестиций'.toUpperCase(),
      { x: 860, y: 549, w: 969, size: 20, bold: true, lh: 1.1, color: C.blue, align: 'right', fit: true, maxLines: 1, minSize: 17 });

    const tiles = [
      ['Ёмкость спроса', 'сколько доступного спроса есть в кластере', C.blue],
      ['Конкурентное давление', 'риск потери первого контакта / стоимость аукциона', C.orange],
      ['Экономика конверсии', 'CR / CPA и качество визита', C.green],
      ['Покрытие SEO и GEO/AEO', 'насколько органика и нейро-ответы уже закрывают спрос', C.purple],
    ];
    const ty = 598;
    const th = 134;
    tiles.forEach(([t, desc, color], i) => {
      const x = 91 + i * 348;
      s.box({ x, y: ty, w: 336, h: th, fill: color });
      s.text(t.toUpperCase(), { x: x + 24, y: ty + 16, w: 288, h: 54, size: 24, bold: true, lh: 1.1, color: C.white, fit: true, maxLines: 2, minSize: 20 });
      s.text(desc, { x: x + 24, y: ty + 78, w: 288, h: 42, size: 16, color: C.white, fit: true, maxLines: 2, minSize: 14 });
    });
    s.arrow({ dir: 'right', x: 1480, y: ty + th / 2, len: 40, head: 54, headLen: 24, stem: 18 });
    s.box({ x: 1529, y: ty, w: 300, h: th, fill: C.crimson });
    s.text('РЕШЕНИЕ', { x: 1553, y: ty + 16, w: 252, size: 24, bold: true, lh: 1.1, color: C.white });
    s.bullets(['инвестировать', 'поддержать', 'снизить / перераспределить'],
      { x: 1553, y: ty + 54, w: 260, size: 16, gap: 2, bold: true, color: C.white });

    s.text('Ежемесячный decision cycle: результаты → новое правило инвестирования → следующий месяц',
      { x: 91, y: 748, w: 1738, size: 18, color: C.blueText, align: 'center' });

    // business impact
    const iy = 790;
    const ih = 94;
    s.text('Влияние на бизнес'.toUpperCase(), { x: 91, y: iy + ih / 2 - 11, w: 270, size: 22, bold: true, lh: 1.0, color: C.blue });
    const impact = [
      ['ВЫШЕ\nРОСТ', 'Новая аудитория из категории и симптоматики', C.cyan],
      ['МЕНЬШЕ\nПОТЕРЬ', 'Не платим там, где органика уже надежно закрывает первый контакт', C.green],
      ['БОЛЬШЕ\nКОНВЕРСИЙ', 'Быстрее переводим сформированный спрос в покупку', C.crimson],
    ];
    columns(3, { x0: 370, x1: 1829, gap: 12 }).forEach((c, i) => {
      const [t, txt, color] = impact[i];
      s.box({ x: c.x, y: iy, w: c.w, h: ih, fill: C.white, stroke: C.line, sw: 1.5 });
      s.text(t, { x: c.x + 22, y: iy, w: 160, h: ih, size: 22, bold: true, lh: 1.1, color, valign: 'middle' });
      s.vline(c.x + 190, iy + 18, ih - 36, C.line, 2);
      s.text(txt, { x: c.x + 206, y: iy + 6, w: c.w - 222, h: ih - 12, size: 16, color: C.navy, valign: 'middle', fit: true, minSize: 14 });
    });

    s.principle({ icon: 'target', label: 'Принцип 2027', w: 1560,
      text: 'Paid Search = управляемый инвестиционный слой AI Visibility: деньги следуют за возможностью роста, риском потери спроса и доказанной экономикой внутри AI Visibility Stream' });
  },

  // 31 ↔ фигма 13: подход / результаты теста с крупными цифрами / принцип использования
  31: (d) => {
    // заголовок черновика не влезает в 2 строки даже на 38 px → делим по двоеточию, как на эталоне фигмы 13
    const s = d.slide({
      title: 'Comprehensive ORM 2027',
      subtitle: 'От точечных активаций к масштабируемой системе управления поисковым спросом и репутацией Tier-2 брендов',
    });
    const X = [{ x: 58, w: 490 }, { x: 571, w: 708 }, { x: 1302, w: 560 }];
    const colors = [C.green, C.cyan, C.purple];
    const labels = ['Approach logic', 'H1 2026 Bobotic test results', '2027 usage principle'];
    const heads = [
      'Персонализация ORM по реальным ситуациям и барьерам аудитории',
      'Occasion-based ORM можно связать с измеримой динамикой поискового интереса',
      'Для Tier-2 важна не единая коммуникация, а единый управляемый стандарт работы',
    ];
    const pad = 33;
    X.forEach((c, i) => {
      s.numberedCard({ x: c.x, y: 221, w: c.w, h: 684, n: i + 1, color: colors[i], d: 38, pad });
      s.label(labels[i], { x: c.x + pad, y: 268, w: c.w - pad * 2, color: colors[i] });
      s.heading(heads[i], { x: c.x + pad, y: 300, w: c.w - pad * 2, h: 108, size: 32 });
    });
    const BY = 826; // нижние блоки колонок 2 и 3 (вывод / формула кейса) на одной высоте
    const BH = 64;

    // --- колонка 1: подход ---
    {
      const x = X[0].x + pad;
      const w = X[0].w - pad * 2;
      const items = [
        ['Выделяем оккейжны', 'реальные ситуации, в которых возникает потребность / вопрос'],
        ['Адаптируем отзывы и комментарии', 'тональность, аргумент и сценарий под конкретный контекст'],
        ['Управляем репутационным полем', 'публикации, ответы, рейтинги и поисковая выдача'],
        ['Смотрим изменение спроса', 'как меняется релевантный интерес к бренду / продукту'],
        ['Оптимизируем и масштабируем', 'усиливаем работающие сценарии,\nслабые — меняем или останавливаем'],
      ];
      items.forEach(([t, desc], i) => {
        const y = 428 + i * 92;
        s.icon('check_circle', { x, y: y - 2, size: 34, color: C.white, bg: C.crimson });
        s.text(t, { x: x + 46, y: y + 2, w: w - 46, h: 24, size: 20, bold: true, lh: 1.0, color: C.blueText, fit: true, maxLines: 1, minSize: 18 });
        s.text(desc, { x: x + 46, y: y + 30, w: w - 46, h: 40, size: 16 });
        if (i < items.length - 1) s.hline(x, y + 80, w);
      });
    }

    // --- колонка 2: результаты теста с крупными цифрами ---
    {
      const x = X[1].x + pad;
      const w = X[1].w - pad * 2;
      const tx = x + 50;                // текст пунктов
      const tw = 370;
      const nx = tx + tw + 18;          // колонка цифр за вертикальным разделителем
      const nw = x + w - nx - 6;
      s.text('BASELINE: средненедельный уровень янв.–фев. = 100', { x, y: 424, w, size: 19, bold: true, lh: 1.0, color: C.crimson, fit: true, maxLines: 1, minSize: 16 });
      const items = [
        { t: '«Перепробовали всё»', num: '+23%',
          desc: 'Средненедельный прирост июнь vs янв.–фев. по сравнительным запросам: «Боботик или Эспумизан», «Саб Симплекс или Боботик», «что лучше» и др.' },
        { t: '«ГВ / ИВ / смесь»', num: '+272%',
          desc: 'Средненедельный прирост июнь vs янв.–фев. за счёт расширения семантики: «Боботик как применять на ГВ», «Можно ли Боботик добавлять в смесь» и др.' },
        { t: 'Высокая синхронность динамики ORM-активности и поискового интереса', num: 'r = 0,96', cap: 'Коэффициент Пирсона',
          desc: '**ORM-реагирования: 7 → 8 → 6 → 7\n«Боботик от коликов отзывы»:\n90 → 108 → 66 → 97**' },
      ];
      const NS = 46;
      let y = 464;
      items.forEach((it, i) => {
        s.badge({ x, y, d: 38, n: i + 1, color: C.crimson });
        const h1 = s.text(it.t, { x: tx, y: y + 6, w: tw, size: 20, bold: true, lh: 1.05, color: C.blueText });
        const h2 = s.text(it.desc, { x: tx, y: y + 6 + h1 + 6, w: tw, size: 14, lh: 1.2 });
        const ih = Math.max(6 + h1 + 6 + h2, 84);
        s.vline(nx - 10, y, ih);
        const numH = Math.round(NS * 1.1) + (it.cap ? 22 : 0);
        const ny = y + Math.round((ih - numH) / 2);
        if (it.cap) s.text(it.cap, { x: nx + 6, y: ny, w: nw, size: 14, lh: 1.0, color: C.blueText });
        s.text(it.num, { x: nx + 6, y: it.cap ? ny + 22 : ny, w: nw, size: NS, bold: true, lh: 1.1, color: C.crimson });
        y += ih + 22;
      });
      // красный блок-вывод
      s.box({ x, y: BY, w, h: BH, fill: C.crimson });
      s.text('ВЫВОД', { x: x + 20, y: BY + BH / 2 - 13, w: 100, size: 24, bold: true, lh: 1.0, color: C.white });
      s.vline(x + 130, BY + 14, BH - 28, C.white, 2);
      s.text('Оккейжны дают разные измеримые сигналы спроса; методологию можно переносить на Tier-2 и оптимизировать еженедельно.',
        { x: x + 148, y: BY + 4, w: w - 164, h: BH - 8, size: 16, color: C.white, valign: 'middle', fit: true, maxLines: 2, minSize: 14 });
    }

    // --- колонка 3: принцип использования ---
    {
      const x = X[2].x + pad;
      const w = X[2].w - pad * 2;
      const items = [
        ['01', 'Универсальная методология', 'сегмент → оккейжен → барьер → ORM-сценарий → продуктовый аргумент'],
        ['02', 'Персонализация остается\nбренд-специфичной', 'каждый бренд получает свои ситуации, аргументы и поисковую семантику'],
        ['03', 'Эффект можно видеть раньше', 'еженедельная динамика релевантных групп запросов и репутационного поля дает ранний сигнал для оптимизации'],
        ['04', 'Масштабируем только подтвержденное', 'baseline → occasion-based test → weekly tracking → scale / change / stop'],
      ];
      let y = 428;
      items.forEach(([n, t, desc], i) => {
        if (i > 0) s.hline(x, y - 12, w);
        s.badge({ x, y: y - 2, d: 38, n, color: C.crimson, size: 16 });
        const h1 = s.text(t, { x: x + 52, y: y + 2, w: w - 52, size: 20, bold: true, lh: 1.05, color: C.blueText });
        const h2 = s.text(desc, { x: x + 52, y: y + 2 + h1 + 6, w: w - 52, size: 16 });
        y += Math.max(2 + h1 + 6 + h2, 40) + 24;
      });
      s.box({ x, y: BY, w, h: BH, fill: C.blue });
      s.text('BOBOTIC H1’26 = validation case\nTIER 2 2027 = replicate the method, not the content',
        { x: x + 20, y: BY, w: w - 32, h: BH, size: 18, bold: true, lh: 1.15, color: C.white, valign: 'middle', fit: true, maxLines: 2, minSize: 15 });
    }

    s.principle({ icon: 'tb:TbPuzzle', label: '2027 принцип', w: 1680,
      text: 'Закрепить Comprehensive ORM как единый стандарт для Tier-2 — базовый уровень → активация по ситуациям потребления → еженедельный мониторинг спроса и репутации → масштабирование' });
  },
};
