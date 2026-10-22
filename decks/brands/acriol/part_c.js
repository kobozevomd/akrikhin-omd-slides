// Акриол Про · стратегия 2027 — часть C: слайды исходника 13–18
// (тактическая архитектура, архитектура кампании 2027 vs 2026, HCP ecosystem, авторитетные публикации, DOLs 2027, DOLs selection)
const path = require('path');
const L = require('../../../lib/akrikhin');
const { C, ACCENTS, CHART_COLORS, columns, IN, PT, chartMap, textWidth, fitSize, countLines, typo } = L;
const V = require('../../variants/common');               // TOP, BOT, MUTED, GRID, fmt, pct, statTile, numMark, legend, yearAxis, gridY
const SRC = path.join(__dirname, '..', '..', '..', 'work', 'brands', 'acriol', 'src');
const MEDIA = path.join(SRC, 'media');
const MEDIA_FIXED = path.join(SRC, 'media_fixed');

// Фото Н. Калашниковой: в исходном файле по углам видна синяя круглая рамка — берём кадр внутри круга
// (обрезка 480×640 от (60, 60), масштаб обратно до 600×800). Исходник не трогаем, результат — в media_fixed/.
function croppedPhoto(file, { left, top, width, height }) {
  const out = path.join(MEDIA_FIXED, file);
  if (!require('fs').existsSync(out)) {
    require('fs').mkdirSync(MEDIA_FIXED, { recursive: true });
    const js = `require('sharp')(process.argv[1]).extract({left:${left},top:${top},width:${width},height:${height}})`
      + `.resize(600,800).jpeg({quality:92}).toFile(process.argv[2]).catch((e)=>{console.error(e.message);process.exit(1);})`;
    require('child_process').execFileSync(process.execPath, ['-e', js, path.join(MEDIA, file), out],
      { cwd: path.join(__dirname, '..', '..', '..'), stdio: 'inherit' });
  }
  return out;
}

// Ширина строки так, как она окажется на слайде (с переводом и типографикой) — для размещения ярлыков рядом с текстом
const strip = (t) => String(t).replace(/\*\*|\[\[|\]\]/g, '');
const wOf = (t, size, bold = false) => textWidth(typo(strip(L.tr(t))), size, bold);
const SRC_NOTE = 'Ссылка в заметках исходника: https://brandanalytics.ru/blog/social-media-russia-autumn-2025';

// Ярлык статуса канала (NEW / EXTENDED)
function tag(s, t, x, y) {
  const w = Math.ceil(wOf(t, 14, true)) + 20;
  s.box({ x, y, w, h: 26, fill: t === 'NEW' ? C.crimson : C.blue, r: 13 });
  s.text(t, { x, y, w, h: 26, size: 14, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
  return w;
}

// Список каналов / сегментов: строка текста + ярлык статуса сразу после неё
function chanList(s, items, { x, y, w, size = 20, pitch = 36 }) {
  items.forEach((it, i) => {
    const [t, tg] = Array.isArray(it) ? it : [it];
    const yy = y + i * pitch;
    const tagW = tg ? Math.ceil(wOf(tg, 14, true)) + 20 : 0;
    const maxW = w - (tg ? tagW + 12 : 0);
    s.text(t, { x, y: yy, w: maxW, size, color: C.navy, fit: true, maxLines: 1, minSize: 16 });
    if (tg) tag(s, tg, x + Math.min(Math.ceil(wOf(t, size)), maxW) + 12, yy + Math.round((size * 1.2 - 26) / 2));
  });
  return items.length * pitch;
}

// Подраздел карточки: заголовок + маркированный список; возвращает высоту
function section(s, { x, y, w, head, items, headColor = C.blue, color = C.blueText, size = 20, gap = 4 }) {
  const hh = s.text(head, { x, y, w, size: 22, bold: true, lh: 1.1, color: headColor });
  const bh = s.bullets(items, { x, y: y + hh + 6, w, size, gap, color });
  return hh + 6 + bh;
}

module.exports = {
  // ===================== 13 · Тактическая архитектура: professional-first =====================
  13: (d) => {
    const s = d.slide({
      title: 'Тактическая архитектура 2027: professional-first',
      subtitle: 'Сначала формируем профессиональное предпочтение →\nзатем масштабируем контакт → конвертируем спрос',
    });
    const cols = columns(3, { gap: 60 });
    const COL = [C.blue, C.cyan, C.crimson];
    const data = [
      { label: 'Формируем предпочтение', head: 'DOLs + HCP-контент',
        items: ['авторитет коллег и лидеров мнений', 'протоколы и процедурные кейсы', 'экспертные критерии выбора'],
        task: 'изменить профессиональную привычку', res: 'Охват', icon: 'tb:TbUsersGroup' },
      { label: 'Масштабируем в HCP-среде', head: 'Проф. контент + Programmatic',
        items: ['авторитетные индексируемые публикации', 'таргетинг на основе проф. сигналов', 'повторные контакты по специализации'],
        task: 'перевести специалиста в рассмотрение', res: 'Экспертность', icon: 'tb:TbCertificate' },
      { label: 'Перехватываем спрос', head: 'Paid Search + GEO/AEO + ORM',
        items: ['брендовые / процедурные / конкурентные запросы', 'присутствие в AI-ответах и Paid Search', 'CTA «где купить» и e-pharm LP'],
        task: 'конвертировать сформированный спрос', res: 'Спрос', icon: 'tb:TbShoppingCart' },
    ];
    const TASK_Y = 640;
    const RES_H = 92;
    const RES_Y = 905 - 26 - RES_H;
    data.forEach((c, i) => {
      const { x, w } = cols[i];
      const color = COL[i];
      const { cx, cy, cw } = s.numberedCard({ x, y: 221, w, h: 684, n: `0${i + 1}`, d: 70, color });
      s.label(c.label, { x: cx, y: cy, w: cw, color });
      s.text(c.head, { x: cx, y: cy + 36, w: cw, size: 30, bold: true, lh: 1.1, color: C.navy, fit: true, maxLines: 1, minSize: 24 });
      s.bullets(c.items, { x: cx, y: cy + 100, w: cw, size: 22, gap: 12 });
      // задача шага
      const bx = x + 24;
      const bw = w - 48;
      s.box({ x: bx, y: TASK_Y, w: bw, h: RES_Y - 18 - TASK_Y, fill: C.cardTint });
      s.label('Задача', { x: bx + 24, y: TASK_Y + 20, w: bw - 48, size: 18, color });
      s.text(c.task, { x: bx + 24, y: TASK_Y + 50, w: bw - 48, h: RES_Y - 18 - TASK_Y - 64, size: 24, bold: true, lh: 1.15, color: C.navy, fit: true, minSize: 20 });
      // результат шага
      s.box({ x: bx, y: RES_Y, w: bw, h: RES_H, fill: color });
      s.icon(c.icon, { x: bx + 24, y: RES_Y + 20, size: 52, color: C.white });
      s.text(c.res.toUpperCase(), { x: bx + 96, y: RES_Y, w: bw - 120, h: RES_H, size: 28, bold: true, lh: 1.0, color: C.white, valign: 'middle', fit: true, maxLines: 1, minSize: 20 });
      if (i < 2) s.chevron({ cx: x + w + 30, cy: 540, color: C.crimson });
    });
    s.principle({ label: 'Главный принцип', icon: 'target', text: 'professional influence — отдельный контур, consumer media — поддерживающий слой' });
    s.notes('Слайд 13 исходника: три шага professional-first; подложка-скриншот исходника не переносится, тексты — живые.');
  },

  // ===================== 14 · Архитектура кампании 2027 vs 2026 =====================
  14: (d) => {
    const s = d.slide({
      title: 'Акриол Про 2027: архитектура кампании vs 2026',
      subtitle: 'Сохраняем работающее Performance-ядро; дополнительный бюджет переводит кампанию от перехвата сформированного спроса к формированию профессионального предпочтения до момента выбора',
    });
    const LB = { x: 58, w: 236 };     // метки строк
    const A = { x: 314, w: 584 };     // 2026
    const B = { x: 1062, w: 800 };    // 2027
    const G = { x: A.x + A.w, w: B.x - A.x - A.w };   // зазор со стрелками прироста
    const R1 = { y: 340, h: 266 };
    const R2 = { y: 624, h: 286 };
    const R3 = { y: 930, h: 54 };

    // ---- шапки колонок: стратегия года и бюджет ----
    const head = (X, kicker, value, color) => {
      s.text(kicker, { x: X.x, y: 221, w: X.w, size: 24, bold: true, lh: 1.0, color, fit: true, maxLines: 1, minSize: 18 });
      const vw = Math.ceil(wOf(value, 60, true));
      s.text(value, { x: X.x, y: 256, w: vw + 8, size: 60, bold: true, lh: 1.0, color });
      const uw = Math.ceil(wOf('млн ₽', 30, true));
      s.text('млн ₽', { x: X.x + vw + 14, y: 280, w: uw + 8, size: 30, bold: true, lh: 1.0, color });
      s.text('(вкл. доп. кост)*', { x: X.x + vw + 14 + uw + 18, y: 288, w: X.w - vw - uw - 40, size: 18, lh: 1.0, color: C.blueText });
    };
    head(A, '2026 · Capture & Test', '9,5', C.navy);
    head(B, '2027 · Build Professional Preference & Growth', '13,1', C.crimson);
    // общий прирост убран по правке Романа (UPD 19.10): бюджет 2027 = 13,1 млн ₽

    // ---- метки строк ----
    s.tile({ x: LB.x, y: R1.y, w: LB.w, h: R1.h, color: C.blue, text: 'AON CORE', icon: 'tb:TbInfinity', size: 24 });
    s.tile({ x: LB.x, y: R2.y, w: LB.w, h: R2.h, color: C.crimson, text: 'SPRINT REINFORCEMENT', icon: 'tb:TbBolt', size: 24 });

    // ---- ячейка: период, бюджет, списки ----
    const cell = (X, R, { period, budget, accent, tint, lists }) => {
      s.card({ x: X.x, y: R.y, w: X.w, h: R.h, tint });
      const px = X.x + 28;
      const pw = X.w - 56;
      s.label(period, { x: px, y: R.y + 30, w: pw - 260, size: 20, color: C.navy });
      s.text(budget, { x: X.x + X.w - 28 - 260, y: R.y + 18, w: 260, size: 38, bold: true, lh: 1.0, color: accent, align: 'right' });
      s.hline(px, R.y + 72, pw);
      const gap = 24;
      const widths = lists.length === 1 ? [pw] : [Math.round(pw * 0.56) - gap / 2, pw - Math.round(pw * 0.56) - gap / 2];
      let lx = px;
      lists.forEach(([title, items], k) => {
        if (k > 0) s.vline(lx - gap / 2, R.y + 92, R.h - 116);
        s.label(title, { x: lx, y: R.y + 92, w: widths[k], size: 16, color: C.blueText });
        chanList(s, items, { x: lx, y: R.y + 120, w: widths[k] });
        lx += widths[k] + gap;
      });
    };
    cell(A, R1, { period: 'AON', budget: '4,2 млн ₽', accent: C.navy, lists: [['Каналы', ['GEO/AEO', 'Paid Search']]] });
    cell(B, R1, { period: 'AON', budget: '6,8 млн ₽', accent: C.crimson, tint: true, lists: [['Каналы', [
      ['GEO/AEO', 'EXTENDED'], 'Paid Search', ['ORM', 'NEW'], ['Внешние публикации проф. контент', 'NEW']]]] });
    cell(A, R2, { period: 'Авг–сен', budget: '3,4 млн ₽', accent: C.navy, lists: [
      ['Каналы', ['Display', 'Programmatic', 'Social', 'Bloggers']],
      ['Сегменты', ['Мастера и Потребители']]] });
    cell(B, R2, { period: 'Март–май, сен–ноя', budget: '5,2 млн ₽', accent: C.crimson, tint: true, lists: [
      ['Каналы', [['DOLs: Influence', 'NEW'], ['Programmatic Avito', 'EXTENDED'], 'Social MAX']],
      ['Сегменты', [['Косметологи', 'NEW'], 'Мастера', 'Потребители']]] });

    // ---- доп. косты ----
    s.pill('+ Adriver / SL / Saving — 1,9 млн ₽', { x: A.x, y: R3.y, w: A.w, h: R3.h, color: C.blue, caps: false, size: 20 });
    s.pill('+ Production 900 тыс. ₽ | Adriver 200 тыс. ₽', { x: B.x, y: R3.y, w: B.w, h: R3.h, color: C.blue, caps: false, size: 20 });

    // ---- приросты по строкам (расчёт OMD) ----
    const delta = (R, text, color) => {
      const mid = R.y + Math.round(R.h / 2);
      if (text) s.text(text, { x: G.x + 4, y: mid - 34, w: G.w - 8, size: 20, bold: true, lh: 1.0, color, align: 'center', fit: true, maxLines: 1, minSize: 16 });
      s.arrow({ dir: 'right', x: G.x + 18, y: mid + 4, len: G.w - 36, head: 24, headLen: 14, stem: 4, color });
    };
    delta(R1, '+2,6 млн ₽', C.crimson);
    delta(R2, '+1,8 млн ₽', C.crimson);
    delta(R3, '', C.blueText);   // подпись −0,9 убрана по правке Романа (UPD 19.10), стрелка осталась

    s.footnote('*Бюджеты тотал представлены с учетом тех костов, АК, РС и продакшн. Приросты 2027 vs 2026 — расчёт OMD');
    s.notes('Слайд 14 исходника: матрица AON core / Sprint reinforcement × 2026 / 2027. Скрытые надписи под полосами исходника (SPRINT, FREQUENCY) не переносятся.');
  },

  // ===================== 15 · HCP ecosystem =====================
  15: (d) => {
    const s = d.slide({ title: 'HCP ecosystem: достигаем врача в профессиональной Digital-среде' });
    const cols = columns(3, { gap: 30 });
    const COL = [C.blue, C.teal, C.green];
    const data = [
      { label: 'Доступ к специалисту', head: 'DOLs', icon: 'tb:TbStethoscope',
        items: ['профессиональное community практикующих косметологов', 'процедуры по специализации косметологов', 'масштабирование контента по площадкам присутствия косметолога'],
        role: 'Качественный контакт до момента выбора препарата' },
      { label: 'Сигналы и масштаб', head: 'Programmatic HCP', icon: 'tb:TbTargetArrow',
        items: ['косметология', 'поиск и покупки по аналогичным препаратам', 'мастера — лазерная эпиляция, ПМ, тату'],
        role: 'Расширить охват за пределы собственной базы' },
      { label: 'Источник для поиска / AI', head: 'Authority content', icon: 'tb:TbFileCertificate',
        items: ['экспертные статьи с указанным автором и квалификацией', 'обзоры / сравнения / интервью / карточки протоколов', 'бессрочная индексация + ссылки на первоисточники'],
        role: 'Долгоживущий источник для Search / GEO/AEO' },
    ];
    const ROLE_H = 156;
    const ROLE_Y = 905 - 30 - ROLE_H;
    data.forEach((c, i) => {
      const { x, w } = cols[i];
      const color = COL[i];
      const px = x + 36;
      const pw = w - 72;
      s.card({ x, y: 221, w, h: 684 });
      s.icon(c.icon, { x: px, y: 253, size: 64, color: C.white, circle: color });
      s.text(c.label.toUpperCase(), { x: px + 84, y: 274, w: pw - 84, size: 20, bold: true, lh: 1.0, color, fit: true, maxLines: 1, minSize: 16 });
      s.text(c.head, { x: px, y: 350, w: pw, size: 40, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 30 });
      s.hline(px, 416, pw);
      s.bullets(c.items, { x: px, y: 442, w: pw, size: 22, gap: 18 });
      s.box({ x: x + 24, y: ROLE_Y, w: w - 48, h: ROLE_H, fill: color });
      s.label('Роль', { x: x + 48, y: ROLE_Y + 24, w: w - 96, size: 18, color: C.white });
      s.text(c.role, { x: x + 48, y: ROLE_Y + 54, w: w - 96, h: ROLE_H - 70, size: 24, bold: true, lh: 1.15, color: C.white, fit: true, minSize: 20 });
    });
    s.principle({ label: 'KPI', icon: 'tb:TbChartBar', color: C.blue, w: 1804,
      text: 'quality reach HCP · engagement / save · post-click quality · branded/procedure search · «Где купить» · preference shift' });
    s.notes('Слайд 15 исходника: три канала HCP-экосистемы и KPIs.');
  },

  // ===================== 16 · Авторитетные публикации: HCP + GEO-актив =====================
  16: (d) => {
    const s = d.slide({
      title: 'Авторитетные публикации: HCP + GEO-актив',
      subtitle: 'DOL / врач формирует тезис → авторитетная площадка закрепляет → GEO / Paid Search возвращают контент в момент выбора',
    });
    const cols = columns(3, { gap: 24 });
    const CY = 221;
    const CH = 548;
    const pad = 32;

    // шапка карточки: номер + КАПС-заголовок
    const cardHead = (x, w, n, title, dark) => {
      s.badge({ x: x + pad, y: CY + 26, d: 44, n, color: dark ? C.crimson : C.blue, size: 22 });
      s.text(title.toUpperCase(), { x: x + pad + 58, y: CY + 36, w: w - pad * 2 - 58, size: 24, bold: true, lh: 1.0,
        color: dark ? C.white : C.navy, fit: true, maxLines: 1, minSize: 18 });
      return CY + 92;
    };
    // примечания внизу карточек 1 и 2: разделитель и текст на одной высоте в обеих карточках
    const NOTES = [
      '**2-й приоритет:** Estet-portal / Здравсити; широкие СМИ — только под релевантный инфоповод',
      '**Доп. occasion:** лазерная / электроэпиляция, ПМ',
    ];
    const noteW = cols[0].w - pad * 2;
    const noteH = Math.max(...NOTES.map((t) => Math.round(countLines(strip(typo(L.tr(t))), 17, noteW, false) * 17 * 1.2)));
    const NY = CY + CH - pad - noteH;
    const cardNote = (x, text) => {
      s.hline(x + pad, NY - 16, noteW);
      s.text(text, { x: x + pad, y: NY, w: noteW, size: 17, color: C.blueText });
    };

    // 1 · приоритетный пул площадок
    {
      const { x, w } = cols[0];
      s.card({ x, y: CY, w, h: CH });
      let y = cardHead(x, w, 1, 'Приоритетный пул площадок');
      const o = { x: x + pad, w: w - pad * 2 };
      y += section(s, { ...o, y, head: 'HCP / профессиональный контур', items: ['Медвестник · Фармвестник · Remedium', 'Лечащий врач · Новости эстетической медицины'] }) + 16;
      y += section(s, { ...o, y, head: 'Медицинские редакционные площадки', items: ['МедПортал · Доктор Питер'] }) + 16;
      section(s, { ...o, y, head: 'Справочники и e-pharm', items: ['Видаль · РЛС · Apteka.ru · Ютека · Мегаптека'] });
      cardNote(x, NOTES[0]);
    }
    // 2 · что пишем
    {
      const { x, w } = cols[1];
      s.card({ x, y: CY, w, h: CH });
      let y = cardHead(x, w, 2, 'Что пишем');
      const o = { x: x + pad, w: w - pad * 2 };
      y += section(s, { ...o, y, head: 'Аппаратная косметология / рост', items: ['«До первого импульса»: RF, CO2, лазеры, удаление тату'] }) + 14;
      y += section(s, { ...o, y, head: 'Инъекционная косметология / защита', items: ['«До первого вкола»: критерии профессионального выбора'] }) + 14;
      section(s, { ...o, y, head: 'Практика местной анестезии', items: [
        'как выбирать анестетик: статус ЛП, лидокаин + прилокаин', 'время экспозиции / окклюзия / подготовка кожи', 'безопасность и ожидаемые реакции — строго в рамках инструкции'] });
      cardNote(x, NOTES[1]);
    }
    // 3 · как отбираем и что это дает (тёмная)
    {
      const { x, w } = cols[2];
      s.box({ x, y: CY, w, h: CH, fill: C.navy, r: 25 });
      let y = cardHead(x, w, 3, 'Как отбираем и что это дает', true);
      const o = { x: x + pad, w: w - pad * 2, headColor: C.sky, color: C.white };
      y += section(s, { ...o, y, head: 'Критерии площадки', items: [
        'профильная релевантность и доверие аудитории', 'возможность указывать автора / квалификацию', 'индексация + длительный срок жизни материала',
        'ссылки на первоисточники / корректная маркировка', 'регуляторная совместимость с фарм-контентом'], gap: 10 }) + 20;
      // результат для бренда — малиновый блок внизу карточки
      const res = ['третьестороннее подтверждение экспертности', 'долгоживущий контентный актив для Search / GEO'];
      const bx = x + 16;
      const bw = w - 32;
      const iw = bw - 40;
      const rh = Math.round(22 * 1.1) + 8 + res.reduce((a, t) => a + countLines(strip(typo(L.tr(t))), 20, iw - 18, false) * 24, 0) + 6 * (res.length - 1);
      const BH = rh + 44;
      const ry = Math.max(y, CY + CH - 20 - BH);
      s.box({ x: bx, y: ry, w: bw, h: BH, fill: C.crimson });
      section(s, { x: bx + 20, y: ry + 20, w: iw, head: 'Результат для бренда', items: res, headColor: C.white, color: C.white, gap: 6 });
    }

    // ---- роль в системе 2027: цепочка ----
    const SY = CY + CH + 20;
    const SH = 905 - SY;
    s.card({ x: 58, y: SY, w: 1804, h: SH, tint: true });
    const mid = SY + Math.round(SH / 2);
    s.text('РОЛЬ В СИСТЕМЕ 2027', { x: 92, y: mid - 26, w: 210, h: 52, size: 22, bold: true, lh: 1.1, color: C.navy, valign: 'middle', fit: true, minSize: 18 });
    const nodes = [
      ['tb:TbUserStar', 'Эксперт', 'создает тезис'],
      ['tb:TbArticle', 'Публикация', 'закрепляет и индексирует'],
      ['tb:TbSearch', 'Search / GEO', 'возвращают к выбору'],
      ['tb:TbTrendingUp', 'Предпочтение → спрос', 'измеряем эффект'],
    ];
    const NX0 = 330;
    const AW = 56;
    const NW = Math.floor((1838 - NX0 - AW * 3) / 4);
    nodes.forEach(([icon, t, cap], i) => {
      const nx = NX0 + i * (NW + AW);
      const last = i === nodes.length - 1;
      s.icon(icon, { x: nx, y: mid - 28, size: 56, color: C.white, circle: last ? C.crimson : C.blue });
      s.text(t, { x: nx + 70, y: mid - 28, w: NW - 74, size: 22, bold: true, lh: 1.0, color: last ? C.crimson : C.navy, fit: true, maxLines: 1, minSize: 17 });
      s.text(cap, { x: nx + 70, y: mid + 2, w: NW - 74, size: 18, lh: 1.1, color: C.blueText, fit: true, maxLines: 1, minSize: 15 });
      if (!last) s.arrow({ dir: 'right', x: nx + NW + 8, y: mid, len: AW - 16, head: 22, headLen: 13, stem: 4, color: C.blue });
    });

    s.principle({ label: 'KPI', icon: 'tb:TbChartBar', color: C.blue, w: 1804,
      text: '# публикаций и индексируемых страниц • охват / дочитывания • HCP-трафик •\nбрендовые запросы • SOV / упоминания в AI-ответах • переходы к продукту' });
    s.notes('Слайд 16 исходника: пул площадок, темы, критерии отбора, роль в системе 2027 и KPI. ' + SRC_NOTE);
  },

  // ===================== 17 · DOLs 2027: comprehensive-подход =====================
  17: (d) => {
    const s = d.slide({
      title: 'DOLs 2027: comprehensive-подход Акриол Про',
      subtitle: 'Формируем систему профессионального подтверждения\nс фокусом на релевантных аппаратных процедурах',
    });
    // ---- как меняем профессиональный выбор: 5 шагов ----
    const LX1 = 1322;
    s.label('Как меняем профессиональный выбор', { x: 58, y: 221, w: 1200, color: C.blue });
    const steps = [
      ['Авторитет', '«Коллега, которому я доверяю, объясняет подход»'],
      ['Практика', '«Я вижу, как Акриол применяется именно в моей процедуре»'],
      ['Повторное подтверждение', '«Другие специалисты делают такой же выбор»'],
      ['Собственный опыт', '«Я включаю Акриол в свой протокол»'],
      ['Проф. норма', 'Использую регулярно → рекомендую коллегам'],
    ];
    const SY = 260;
    const SH = 300;
    const cols5 = columns(5, { x0: 58, x1: LX1, gap: 26 });
    steps.forEach(([t, q], i) => {
      const { x, w } = cols5[i];
      const last = i === steps.length - 1;
      if (last) s.box({ x, y: SY, w, h: SH, fill: C.navy, r: 25 });
      else s.card({ x, y: SY, w, h: SH });
      s.badge({ x: x + 22, y: SY + 22, d: 46, n: `0${i + 1}`, color: last ? C.crimson : C.blue, size: 20 });
      s.text(t.toUpperCase(), { x: x + 22, y: SY + 86, w: w - 40, size: 18, bold: true, lh: 1.1, color: last ? C.white : C.navy, fit: true, maxLines: 2, minSize: 15 });
      s.text(q, { x: x + 22, y: SY + 144, w: w - 40, h: SH - 144 - 18, size: 22, lh: 1.2, color: last ? C.white : C.navy, fit: true, minSize: 18 });
      if (!last) s.chevron({ cx: x + w + 13, cy: SY + SH / 2, w: 14, h: 22, color: C.crimson });
    });

    // ---- главный тезис и задача 2027 ----
    const BY = 590;
    const BH = 905 - BY;
    const KW = 560;
    s.box({ x: 58, y: BY, w: KW, h: BH, fill: C.crimson, r: 25 });
    // метка — на одной высоте с «Задача 2027» соседней карточки; тезис крупнее и по центру оставшейся высоты
    const KT = 'Профессиональная среда подтверждает его выбор';
    const KTOP = BY + 70;
    const KBOT = BY + BH - 30;
    const ks = fitSize(typo(L.tr(KT)), 44, 32, KW - 68, 3, true);
    const kth = Math.round(countLines(typo(L.tr(KT)), ks, KW - 68, true) * ks * 1.1);
    s.label('Не один блогер убеждает врача', { x: 92, y: BY + 34, w: KW - 68, size: 22, color: C.white });
    s.text(KT, { x: 92, y: KTOP + Math.max(0, Math.round((KBOT - KTOP - kth) / 2)), w: KW - 68, size: ks, bold: true, lh: 1.1, color: C.white });
    const TX = 58 + KW + 24;
    const TW = LX1 - TX;
    s.card({ x: TX, y: BY, w: TW, h: BH });
    s.label('Задача 2027', { x: TX + 34, y: BY + 34, w: TW - 68, size: 22, color: C.blue });
    const th = s.text('Перевести выбор анестезии из привычки в осознанную часть профессионального протокола', { x: TX + 34, y: BY + 72, w: TW - 68, size: 26, bold: true, lh: 1.15, color: C.navy });
    s.hline(TX + 34, BY + 72 + th + 20, TW - 68);
    s.text('Не только доказать преимущество категории, нужно изменить привычный выбор специалиста в пользу Акриол Про через occasion-based коммуникацию',
      { x: TX + 34, y: BY + 72 + th + 40, w: TW - 68, size: 20, lh: 1.2, color: C.blueText });

    // ---- справа: состав и фокус спринтов ----
    const RX = LX1 + 30;
    const RW = 1862 - RX;
    s.card({ x: RX, y: 221, w: RW, h: 684, tint: true });
    s.box({ x: RX + 28, y: 249, w: RW - 56, h: 150, fill: C.navy });
    s.text('10–15 DOL', { x: RX + 28, y: 249, w: RW - 56, h: 150, size: 64, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle', fit: true, maxLines: 1, minSize: 44 });
    s.label('Фокус Sprint 1+2', { x: RX + 34, y: 441, w: RW - 68, color: C.blue });
    const ch = s.checks(['наиболее релевантные аппаратные процедуры', 'ограниченная частота контактов', 'тест контентных сценариев'],
      { x: RX + 34, y: 490, w: RW - 68, size: 22, pitch: 'auto', gap: 32, color: C.blue });
    s.checks(['первичная оценка влияния на стороне DOL'], { x: RX + 34, y: 490 + ch + 32, w: RW - 68, size: 22, pitch: 'auto', color: C.crimson });

    // ---- логика: цепочка шагов + примечание справа ----
    s.principle({ label: 'Логика', icon: 'flow', color: C.blue, w: 1804,
      text: 'Авторитет → применение → подтверждение → опыт → **профессиональная норма**' });
    const NX = 1862 - 24 - 270;
    s.vline(NX - 24, 935 + 20, 44, C.white, 2);
    s.text('первичная оценка влияния', { x: NX, y: 935, w: 270, h: 84, size: 18, lh: 1.15, color: C.white, valign: 'middle', fit: true, maxLines: 2, minSize: 15 });
    s.notes('Слайд 17 исходника: пять шагов профессионального выбора, 10–15 DOL и фокус Sprint 1+2, тезис и задача 2027, логика. Вторая фраза вводного текста исходника («Задача 2027 — …») объединена с блоком «Задача 2027». ' + SRC_NOTE);
  },

  // ===================== 18 · DOLs selection =====================
  18: (d) => {
    const s = d.slide({
      title: 'DOLs selection для интеграций: профессиональное влияние важнее размера аккаунта',
      subtitle: 'Trusted DOL Score + предварительный TOP-8 по авторитету, процедурам и цифровому присутствию.\nПринцип — выбор 2–3 крупных авторов, добор за счет средних и микро DOL по процедурам',
    });
    // ---- слева: веса скоринга ----
    const LC = { x: 58, w: 470 };
    s.card({ x: LC.x, y: 221, w: LC.w, h: 684 });
    s.text('TRUSTED DOLs SCORE', { x: LC.x + 32, y: 253, w: LC.w - 64, size: 24, bold: true, lh: 1.0, color: C.navy });
    const weights = [
      [30, 'Профессиональный авторитет', C.crimson],
      [25, 'Релевантность процедурам', C.crimson],
      [20, 'Влияние на коллег', C.blue],
      [15, 'Качество digital-присутствия', C.blue],
      [10, 'Безопасность сотрудничества', C.blue],
    ];
    const PX = LC.x + 32;
    const NX = LC.x + 160;
    const NW = LC.x + LC.w - 32 - NX;
    weights.forEach(([p, name, color], i) => {
      const y = 316 + i * 116;
      s.text(`${p}%`, { x: PX, y, w: 112, size: 44, bold: true, lh: 1.0, color });
      s.text(name, { x: NX, y: y + 2, w: NW, size: 20, bold: true, lh: 1.1, color: C.navy, fit: true, maxLines: 2, minSize: 17 });
      s.box({ x: NX, y: y + 58, w: NW, h: 12, fill: C.tint, r: 6 });
      s.box({ x: NX, y: y + 58, w: Math.round(NW * p / 30), h: 12, fill: color, r: 6 });
    });

    // ---- справа: предварительный TOP-8 ----
    const RX0 = LC.x + LC.w + 28;
    const cols = columns(4, { x0: RX0, x1: 1862, gap: 18 });
    const CH = 296;
    const PH = { w: 126, h: 168 };     // фото 3:4, как в файлах (600×800)
    const NXo = 18 + PH.w + 16;        // отступ имени от левого края карточки
    const NWc = cols[0].w - NXo - 14;
    const rows = [
      { cap: 'Аппаратные / сочетанные / инъекционные методы', y: 221, dols: [
        ['img_9b6626a1d4.jpg', 'Яна Юцковская', 94, 'Authority DOL'],
        ['img_41c567b89a.jpg', 'Елена Гольцова', 92, 'Аппаратные протоколы'],
        ['img_6ea9757a03.jpg', 'Екатерина Круглик', 91, 'Procedure DOL'],
        ['img_aa6e25410b.jpg', 'Ирина Брагина', 91, '«До первого импульса»'],
      ] },
      { cap: 'Профессиональный авторитет + релевантный digital', y: 221 + 32 + CH + 28, dols: [
        [croppedPhoto('img_935fe888dc.jpg', { left: 60, top: 60, width: 480, height: 640 }), 'Наталья Калашникова', 90, 'Проф. стандарт'],
        ['img_fb156299df.jpg', 'Ольга Забненкова', 90, 'Доказательный контент'],
        ['img_c86d7ff68b.jpg', 'Наталья Михайлова', 89, 'Защита инъекций'],
        ['img_545ed57f00.jpg', 'Алёна Саромыцкая', 88, 'Digital + Procedure'],
      ] },
    ];
    // общий кегль имён: самый крупный, при котором каждое имя встаёт в 2 строки без разрыва слов
    const nameSize = Math.min(...rows.flatMap((r) => r.dols.map(([, name]) => fitSize(typo(L.tr(name)), 20, 16, NWc, 2, true))));
    rows.forEach((r) => {
      s.text(r.cap, { x: RX0, y: r.y, w: 1862 - RX0, size: 18, bold: true, lh: 1.0, color: C.blueText });
      const cy = r.y + 32;
      r.dols.forEach(([img, name, score, role], i) => {
        const { x, w } = cols[i];
        s.card({ x, y: cy, w, h: CH });
        s.image(path.isAbsolute(img) ? img : path.join(MEDIA, img), { x: x + 18, y: cy + 18, w: PH.w, h: PH.h, alt: name });
        s.badge({ x: x + NXo, y: cy + 18, d: 56, n: score, color: C.navy, size: 24 });
        // имя — по нижней кромке фото
        const nh = Math.round(countLines(typo(L.tr(name)), nameSize, NWc, true) * nameSize * 1.1);
        s.text(name, { x: x + NXo, y: cy + 18 + PH.h - nh - 2, w: NWc, size: nameSize, bold: true, lh: 1.1, color: C.navy });
        s.text(role, { x: x + 18, y: cy + 18 + PH.h + 26, w: w - 36, size: 22, bold: true, lh: 1.1, color: C.blue, fit: true, maxLines: 2, minSize: 18 });
      });
    });

    s.principle({ label: 'Принцип', icon: 'target',
      text: 'Эксперт с 8 000 косметологов в аудитории может быть ценнее автора со 150 000 потребительских подписчиков' });
    s.notes('Слайд 18 исходника: веса Trusted DOLs Score и предварительный TOP-8 DOL (баллы — из исходника). Повторяющиеся описания карточек вынесены подписью над каждым рядом. ' + SRC_NOTE);
  },
};
