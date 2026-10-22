// Comprehensive draft 2027 — часть C: слайды 17, 18, 19, 21 черновика.
// Раскладка — по эталонам фигмы 02, 03, 04, 05; тексты — из черновика.
const { C, ACCENTS, columns, textWidth, countLines, fitSize, typo } = require('../../lib/akrikhin');

// Полоса-слой (эталон фигмы 04): карточка во всю ширину, слева КАПС-метка, тонкий разделитель, справа текст
function layerBand(s, { y, h = 76, label, color, text, size = 20 }) {
  s.card({ x: 58, y, w: 1804, h });
  const lw = Math.ceil(textWidth(label, 30, true)) + 6;
  s.text(label, { x: 97, y, w: lw, h, size: 30, bold: true, lh: 1.0, color, valign: 'middle' });
  const vx = 97 + lw + 22;
  s.vline(vx, y + 16, h - 32, C.line, 1.5);
  const tx = vx + 24;
  s.text(text, { x: tx, y: y + 4, w: 1823 - tx, h: h - 8, size, lh: 1.2, color: C.blueText, valign: 'middle', fit: true, minSize: 16 });
}

module.exports = {
  // 17 · Рынок 2027: 5 трендов — эталон фигмы 02 (сборка из decks/demo.js)
  17: (d) => {
    const s = d.slide({ title: 'Рынок 2027: 5 ключевых трендов,\nкоторые меняют путь потребителя' });
    const data = [
      { t: 'ВИДЕО = ЭКОСИСТЕМА ЭКРАНОВ', d: 'CTV становится самостоятельным слоем на фоне фрагментации просмотра и роста Smart TV.', v: '80%', l: 'проникновение Smart TV к 2029', c: 'Нужна единая роль CTV + OLV, AI-видео продакшн, а не конкуренция видеоформатов.' },
      { t: 'ПОИСК СТАНОВИТСЯ AI-ASSISTED', d: 'Пользователь все чаще получает готовый ответ, а не только список ссылок — особенно в health-information journey.', v: '49,5', u: 'млн', l: 'ежемесячно взаимодействуют с ответами Алисы AI', c: 'Бренду нужно управлять присутствием не только в SERP, но и в AI-ответах / LLM.' },
      { t: 'DIGITAL ДОРОЖАЕТ БЫСТРЕЕ ЭФФЕКТИВНОСТИ', d: 'Инфляция медиа и рост стоимости действия делают fixed split менее устойчивым.', v: '+26%', l: 'рост стоимости целевого действия в Q1’26', c: 'Инвестиции должны следовать за доказанным эффектом, а не за прошлогодним сплитом.' },
      { t: 'ПОКУПКА СТАНОВИТСЯ ГИБРИДНОЙ', d: 'Фарма остается офлайн-категорией, но ePharm быстро растет — online и offline работают в одном пути.', v: '28%', l: 'доля online в фармрознице', c: 'CJM должен доводить пользователя от медиа и поиска до доступной покупки.' },
      { t: 'INFLUENCE ФРАГМЕНТИРУЕТСЯ ПО ПЛАТФОРМАМ', d: 'Блогеры и бренды распределяют активность между несколькими площадками; растет роль качества контента и системного контроля.', v: '64%', l: 'блогеров планируют осваивать новые платформы', c: 'Нужны единый Playbook и AI-scoring, а не ручная логика под каждую платформу.' },
    ];
    // один кегль заголовков на все колонки (по самой длинной), описания — на одной высоте
    const tw = columns(5)[0].w - 54;
    const tsz = Math.min(...data.map((it) => fitSize(typo(it.t), 36, 22, tw, 3, true)));
    const tH = Math.max(...data.map((it) => countLines(typo(it.t), tsz, tw, true))) * tsz * 1.1;
    columns(5).forEach((col, i) => {
      const it = data[i];
      const color = ACCENTS[i];
      const { cx, cy, cw } = s.numberedCard({ x: col.x, y: 222, w: col.w, h: 684, n: i + 1, color, pad: 27 });
      s.text(it.t, { x: cx, y: cy, w: cw, size: tsz, bold: true, lh: 1.1, color: C.navy });
      s.text(it.d, { x: cx, y: cy + tH + 14, w: cw, h: 585 - 12 - (cy + tH + 14), size: 16, fit: true, minSize: 14 });
      s.stat({ x: cx, y: 585, w: 261, value: it.v, unit: it.u, label: it.l, color });
      s.text('Что это меняет', { x: cx, y: 764, w: cw, size: 16, bold: true, color });
      s.text(it.c, { x: cx, y: 793, w: cw + 3, h: 95, size: 16, bold: true, color: C.navy });
    });
    s.principle({ icon: 'bulb', label: 'Вывод', text: 'Рынок дробится на множество точек контакта, но путь пользователя должен оставаться единым — от первого контакта до выбора и покупки' });
    s.footnote('*OMD Snapshot / Mediascope / АКАР / Фармвестник / Яндекс / ВЦИОМ (2026).');
  },

  // 18 · Матрица «рынок 2027 → наш ответ → на шаг впереди» — эталон фигмы 03
  18: (d) => {
    const s = d.slide({ title: 'Comprehensive 2027: как мы отвечаем\nна новый путь потребителя' });
    s.card({ x: 58, y: 221, w: 1804, h: 684 });
    s.label('Market → Actions', { x: 97, y: 255, w: 600, color: C.crimson });

    // столбцы матрицы: рынок | наш ответ | на шаг впереди
    const A = { x: 97, w: 490 };
    const B = { x: 610, w: 552 };
    const K = { x: 1185, w: 638 };
    const pillY = 293;
    s.pill('Рынок 2027', { x: A.x, y: pillY, w: A.w, h: 64, size: 28 });
    s.pill('Наш ответ в Comprehensive', { x: B.x, y: pillY, w: B.w, h: 64, size: 28 });
    s.pill('На шаг впереди', { x: K.x, y: pillY, w: K.w, h: 64, size: 28 });

    const rows = [
      { icon: 'tb:TbCircleCaretRight', t: 'Видео фрагментируется между экранами',
        m: 'CTV = масштаб / большой экран\nOLV = сегменты и барьеры\nAI-video = быстрые вариации',
        r: 'Планируем единую видеосистему по роли экрана и аудитории — не отдельные видео-флайты' },
      { icon: 'tb:TbSearch', t: 'Поиск переходит в AI',
        m: 'AI Visibility Stream:\nSEO + GEO/AEO + внешние публикации +\nORM + Paid Search',
        r: 'Управляем не каналами, а полем присутствия и доверия: Search → AI → Trust → Choice → Action' },
      { icon: 'tb:TbCurrencyRubel', t: 'Стоимость media растет',
        m: 'Test → Measure → Decision → Scale\nDynamic investment + Traffic Verification + Golden Rules',
        r: 'Каждый флайт/спринт заканчивается reusable rule; деньги переходят к решениям с доказанной эффективностью' },
      { icon: 'tb:TbRoute', t: 'Путь к покупке становится online + offline',
        m: 'DOOH = physical context\nE-com = персонализированное продолжение\nпути до покупки',
        r: 'Связываем digital intent с местом / моментом и доступностью продукта — один CJM вместо разрозненных активаций' },
      { icon: 'tb:TbUserCircle', t: 'Cross-platform Influence',
        m: 'Bloggers Playbook + 2-step AI scoring + модульное производство контента',
        r: 'AI контролирует качество, а модульное производство контента позволяет масштабировать успешные механики между платформами и брендами внутри категорий' },
    ];
    const top = 381;
    const pitch = 103;
    const vx1 = Math.round((A.x + A.w + B.x) / 2);
    const vx2 = Math.round((B.x + B.w + K.x) / 2);
    rows.forEach((r, i) => {
      const y = top + i * pitch;
      const cy = y + pitch / 2;
      if (i > 0) s.hline(A.x, y, K.x + K.w - A.x);
      s.badge({ x: A.x, y: cy - 31, d: 62, n: i + 1, color: ACCENTS[i] });
      s.icon(r.icon, { x: A.x + 86, y: cy - 26, size: 52, color: C.blue });
      s.text(r.t, { x: A.x + 152, y: y + 6, w: A.x + A.w - (A.x + 152), h: pitch - 12, size: 24, bold: true, lh: 1.05,
        color: C.blueText, valign: 'middle', fit: true, maxLines: 2, minSize: 20 });
      s.vline(vx1, cy - 32, 64);
      s.text(r.m, { x: B.x + 22, y: y + 4, w: B.w - 22, h: pitch - 8, size: 19, lh: 1.2, color: C.blueText, valign: 'middle', fit: true, minSize: 16 });
      s.vline(vx2, cy - 32, 64);
      s.text(r.r, { x: K.x + 26, y: y + 4, w: K.w - 26, h: pitch - 8, size: 19, bold: true, lh: 1.2, color: C.navy, valign: 'middle', fit: true, minSize: 16 });
    });

    // две плашки: IN LINE (синяя) и ONE STEP AHEAD (малиновая)
    s.principle({ x: 58, w: 760, icon: false, color: C.blue, label: 'In line',
      text: 'CTV • AI Search • e-com • cross-platform influence • efficiency pressure' });
    s.principle({ x: 840, w: 1022, icon: false, label: 'One step ahead',
      text: 'единая логика аудитории + единый путь потребителя + непрерывное обучение + правила, которые можно масштабировать' });
  },

  // 19 · Единый CJM: слои пути — эталон фигмы 04
  19: (d) => {
    const s = d.slide({ title: 'Единый CJM 2027: от охвата к покупке —\nу каждой точки контакта своя роль' });
    layerBand(s, { y: 221, label: 'AUDIENCE & INSIGHT LAYER', color: C.blue,
      text: 'AI CJM + [[**OMD Voice**]]  →  WHO × NEED × BARRIER × OCCASION  →  единая сегментная логика для всех тачпоинтов' });

    // цвета колонок — как в эталоне фигмы 04
    const colors = [C.blue, C.cyan, C.green, C.purple, C.orange];
    const data = [
      ['SCALE AWARENESS', 'CTV', 'BIG SCREEN\n+ SCALE', 'Большой экран / масштаб / заметность бренда'],
      ['MAKE RELEVANT', 'OLV + CREATORS', 'SEGMENT\n+ BARRIER', 'Переводим массовый контакт в релевантное сообщение под сегмент / барьер'],
      ['ACTIVATE\nIN CONTEXT', 'DOOH', 'PLACE\n× TIME × POI\n× OCCASION', 'Добавляем физический контекст: где и когда сообщение наиболее уместно'],
      ['ANSWER & BUILD TRUST', 'AI VISIBILITY', 'SEARCH\n+ AI + TRUST', 'SEO + GEO/AEO + ORM + Paid\u00A0Search + внешние публикации отвечают на запрос и укрепляют уверенность в выборе'],
      ['CONVERT', 'E-COM', 'AVAILABILITY\n+ OFFER\n+ PURCHASE', 'Продолжаем персонализацию до аптеки / e-retail: наличие, оффер, покупка'],
    ];
    const colY = 320;
    const colH = 486;
    columns(5).forEach((col, i) => {
      const [stage, channel, tileText, desc] = data[i];
      const color = colors[i];
      const px = col.x + 37;
      const pw = col.w - 74;
      s.card({ x: col.x, y: colY, w: col.w, h: colH });
      s.badge({ x: col.x + 27, y: colY + 27, d: 70, n: i + 1, color });
      s.text(stage, { x: col.x + 109, y: colY + 22, w: col.w - 109 - 14, h: 80, size: 30, bold: true, lh: 1.05, color,
        valign: 'middle', fit: true, maxLines: 2, minSize: 22 });
      s.text(channel, { x: px, y: colY + 130, w: pw, size: 30, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 22 });
      s.tile({ x: px, y: colY + 196, w: pw, h: 135, color, text: tileText, size: 29 });
      s.text(desc, { x: px, y: colY + 349, w: pw, h: colH - 349 - 20, size: 16, lh: 1.2, fit: true, minSize: 15 });
    });

    layerBand(s, { y: 828, label: 'MEASUREMENT & LEARNING LAYER', color: C.crimson, size: 19,
      text: '[[**Brand Attention Monitor**]] + media / post-click + BLS / Sales Lift + Traffic Verification\n\n→  Golden Rules  →  перераспределение следующего флайта' });

    s.principle({ icon: 'target', label: 'Принцип 2027', text: 'Единый CJM: reach → relevance → context → answer & trust → purchase' });
  },

  // 21 · 2026 фундамент → 2027 эволюция — эталон фигмы 05
  21: (d) => {
    const s = d.slide({ title: 'Comprehensive approach 2026 → 2027:\nот внедренной модели к самообучающейся Digital-системе' });

    // слева: 2026 фундамент
    const L = { x: 58, w: 580 };
    s.card({ x: L.x, y: 221, w: L.w, h: 684 });
    const lx = L.x + 39;
    const lw = L.w - 78;
    s.label('2026 фундамент', { x: lx, y: 255, w: lw, color: C.blue });
    s.heading('Comprehensive объединил\n4 ключевых элемента', { x: lx, y: 293, w: lw });
    const found = [
      ['AI CJM', 'Аудиторные инсайты, потребности,\nбарьеры и логика сегментов'],
      ['TECH & DATA STACK', 'DMP / CMP / платформы для\nмедиа-активации с масштабированием'],
      ['MEASUREMENT & ANALYSIS', 'Media, post-click, BLS / Sales Lift'],
      ['BENCHMARKS', 'Правила медиа-планирования, целевые KPI\nи переиспользуемые learnings'],
    ];
    const fTop = 393;
    const fPitch = 125;
    found.forEach(([t, desc], i) => {
      const y = fTop + i * fPitch;
      const cy = y + fPitch / 2;
      if (i > 0) s.hline(lx, y, lw);
      s.badge({ x: lx, y: cy - 31, d: 62, n: i + 1, color: C.tint, textColor: C.blueText });
      const tx = lx + 86;
      const tw = L.x + L.w - 30 - tx;
      // заголовок + описание центрируем по кружку
      const th = 26;
      const dh = Math.round(countLines(desc, 16, tw, false) * 16 * 1.2);
      const by = Math.round(cy - (th + 10 + dh) / 2);
      s.text(t, { x: tx, y: by, w: tw, size: 26, bold: true, lh: 1.0, color: C.blue, fit: true, maxLines: 1, minSize: 22 });
      s.text(desc, { x: tx, y: by + th + 10, w: tw, size: 16, lh: 1.2 });
    });

    // стрелка между карточками
    const ax = 659;
    s.arrow({ dir: 'right', x: ax, y: 530, len: 54, head: 68, headLen: 28, stem: 34 });
    s.text('2027\nEVOLUTION', { x: ax + 27 - 42, y: 572, w: 84, size: 12, bold: true, lh: 1.05, color: C.crimson, align: 'center' });

    // справа: 2027 эволюция
    const R = { x: 733, w: 1129 };
    s.card({ x: R.x, y: 221, w: R.w, h: 684 });
    const rx = R.x + 37;
    const rRight = R.x + R.w - 39;
    s.label('2027 эволюция', { x: rx, y: 255, w: 900, color: C.crimson });
    s.heading('Каждый блок становится быстрее, гибче\nи сильнее опирается на данные', { x: rx, y: 293, w: rRight - rx });
    const evo = [
      [C.sky, 'tb:TbBrain', 'AI CJM', 'AI CJM + OMD Voice', 'Формируем инсайты → валидируем гипотезы,\nTone of Voice и сообщения до активации\nс помощью синтетических AI-панелей'],
      [C.teal, 'tb:TbDatabaseCog', 'TECH & DATA', 'Адаптированный активационный стек', 'Выбор технологии AI DSP под задачу'],
      [C.orange, 'tb:TbUser', 'PERSONALIZATION', 'Персонализированный контент и путь пользователя', 'CMP + AI-видео + персонализированные LP\nИнтегрированная экосистема SEO + GEO/AEO + ORM + внешние публикации + Paid Search'],
      [C.crimson, 'tb:TbChartBar', 'MEASUREMENT', 'Ранние сигналы + доказательство эффекта', 'Brand Attention Monitoring + media / post-click + BLS / Sales Lift'],
      [C.navy, 'tb:TbTrendingUp', 'BENCHMARKS', 'Библиотека решений', 'Каждый тест формирует Golden Rule,\nкоторый можно использовать\nв следующем бренде / флайте'],
    ];
    const eTop = 393;
    const ePitch = 100;
    const tileW = 267;
    const titleX = rx + tileW + 28;
    const vx = 1437;
    const descX = vx + 22;
    evo.forEach(([color, icon, tag, title, desc], i) => {
      const y = eTop + i * ePitch;
      const cy = y + ePitch / 2;
      if (i > 0) s.hline(rx, y, rRight - rx);
      s.box({ x: rx, y: cy - 34, w: tileW, h: 68, fill: color });
      s.icon(icon, { x: rx + 16, y: cy - 23, size: 46, color: C.white });
      s.text(tag, { x: rx + 76, y: cy - 34, w: tileW - 76 - 12, h: 68, size: 18, bold: true, lh: 1.0, color: C.white,
        valign: 'middle', fit: true, maxLines: 1, minSize: 15 });
      s.text(title, { x: titleX, y: y + 5, w: vx - 20 - titleX, h: ePitch - 10, size: 26, bold: true, lh: 1.0, color: C.blue,
        valign: 'middle', fit: true, maxLines: 3, minSize: 20 });
      s.vline(vx, cy - 32, 64);
      s.text(desc, { x: descX, y: y + 4, w: rRight - descX, h: ePitch - 8, size: 16, lh: 1.2, valign: 'middle', fit: true, minSize: 14 });
    });

    s.principle({ x: 300, w: 1320, icon: 'target', label: '2027 принцип',
      text: 'Единая обучающаяся система: каждая активация дает данные, которые улучшают следующее решение по аудитории, креативу, каналу и инвестициям' });
  },
};
