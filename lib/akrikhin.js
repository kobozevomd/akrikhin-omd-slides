// Дизайн-система «Акрихин × OMD» для PowerPoint.
// Источник: Figma «INT Акрихин Продакшн», страница «Слайды Акрихин» (15 слайдов 1920×1080).
// Все координаты и размеры — в пикселях фигмы (холст 1920×1080). Слайд PowerPoint 20×11.25 дюйма,
// поэтому 1 px фигмы = 1/96 дюйма, а кегль: pt = px × 0.75. Правила — в DESIGN.md.
'use strict';
const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const { applyTheme } = require('./apply_theme');
const { postprocess } = require('./postprocess');

const ROOT = path.join(__dirname, '..');
const ASSET = (f) => path.join(ROOT, 'assets', f);
const CACHE = path.join(ROOT, '.cache');

const W = 1920;
const H = 1080;
const IN = (px) => +(px / 96).toFixed(4);
const PT = (px) => +(px * 0.75).toFixed(2);
const FONT = 'Tahoma';

// ---------- Токены ----------
const C = {
  blue: '015DA6',      // шапка, основной синий, номер 1
  blueText: '005CA5',  // основной текст
  navy: '003560',      // заголовки карточек, акцентный текст
  navy2: '00447A',     // тёмно-синий акцент (6-й шаг)
  crimson: 'EA2854',   // главный акцент: плашка-вывод, чек-кружки, «красные» блоки
  cyan: '31A9E1',      // голубой акцент
  sky: '37ADEB',       // светло-голубой (вариант cyan)
  teal: '0B7DAF',      // бирюзово-синий
  green: '3A9D74',
  orange: 'F87E2B',
  purple: '6F60B9',
  card: 'FBFCFE',      // фон карточки
  cardTint: 'EDF3FF',  // фон выделенной карточки
  tint: 'DDEDFB',      // кружки малых номеров, светлые подложки
  line: 'CDE2F5',      // обводка карточек и разделители
  white: 'FFFFFF',
};
// номер страницы: мелко, справа внизу, вровень со сносками
const SLIDE_NUM = { x: IN(1810), y: IN(1036), w: IN(52), h: IN(22), fontFace: 'Tahoma', fontSize: PT(13), color: '6E86AD', align: 'right' };
const ALT = { 'logo_akrikhin_omd.png': 'Акрихин + OMD', 'logo_akrikhin.png': 'Акрихин' };
// Порядок акцентов для нумерованных колонок (как на слайдах 2 и 4 фигмы)
const ACCENTS = [C.blue, C.cyan, C.crimson, C.green, C.purple, C.orange, C.teal, C.navy2];
// Порядок цветов серий на графиках (проверен на различимость для дальтоников; подписи значений обязательны)
const CHART_COLORS = [C.blue, C.crimson, C.cyan, C.green, C.purple, C.orange, C.navy, C.teal];

const THEME = {
  name: 'Akrikhin x OMD',
  colors: {
    dk1: C.navy, lt1: C.white, dk2: C.blueText, lt2: C.cardTint,
    accent1: C.blue, accent2: C.crimson, accent3: C.cyan,
    accent4: C.green, accent5: C.purple, accent6: C.orange,
    hlink: C.blueText, folHlink: C.purple,
  },
};

// Типографика (px фигмы): size, lh — множитель межстрочного, bold
const T = {
  coverTitle: { size: 133, lh: 1.14, bold: true },
  title: { size: 47, lh: 1.0, bold: true },        // шапка без подзаголовка, до 2 строк
  titleSub: { size: 41, lh: 1.0, bold: true },     // шапка с подзаголовком, 1 строка
  subtitle: { size: 29, lh: 1.18, bold: false },   // подзаголовок в шапке, до 2 строк
  colTitle: { size: 36, lh: 1.1, bold: true },     // КАПС-заголовок колонки
  heading: { size: 34, lh: 1.1, bold: true },      // заголовок карточки
  label: { size: 22, lh: 1.0, bold: true },        // КАПС-метка над заголовком
  sub: { size: 28, lh: 1.0, bold: true },          // заголовок внутреннего блока
  item: { size: 23, lh: 1.0, bold: true },         // заголовок пункта списка
  stat: { size: 64, lh: 1.1, bold: true },         // большая цифра
  bodyL: { size: 20, lh: 1.2, bold: false },
  body: { size: 18, lh: 1.2, bold: false },
  bodyS: { size: 16, lh: 1.2, bold: false },
  note: { size: 14, lh: 1.2, bold: false },
  barLabel: { size: 25, lh: 1.0, bold: true },
  barText: { size: 20, lh: 1.2, bold: false },
};

// ---------- Метрики Tahoma для переносов ----------
const METRICS = JSON.parse(fs.readFileSync(ASSET('tahoma_metrics.json'), 'utf8'));
function textWidth(str, size, bold) {
  const t = METRICS[bold ? 'B' : 'R'];
  let w = 0;
  for (const ch of str) w += t[ch] ?? (bold ? 650 : 570);
  return (w / 1000) * size;
}
// Сколько строк займёт текст в ширине width (px). Запас 3% на разницу рендеров.
function countLines(text, size, width, bold) {
  const max = width * 0.97;
  const sp = textWidth(' ', size, bold);
  let lines = 0;
  for (const para of String(text).split(/\n\n?/)) {
    lines++;
    let cur = 0;
    for (const word of para.split(' ')) {
      if (!word) continue;
      const ww = textWidth(word, size, bold);
      if (cur === 0) cur = ww;
      else if (cur + sp + ww <= max) cur += sp + ww;
      else { lines++; cur = ww; }
      while (cur > max) { lines++; cur -= max; }
    }
  }
  return lines;
}

// ---------- Разметка текста ----------
// **жирный**, [[акцент]] (малиновый или opts.accent), \n — перенос строки, \n\n — новый абзац.
// Можно передать и массив ранов pptxgenjs: [{ text, options }]. Вложение работает: [[**жирный акцент**]].

// Символы, которых нет в Tahoma: ставим их отдельным раном шрифтом Arial, чтобы PowerPoint
// и LibreOffice не подбирали замену каждый по-своему
const NO_TAHOMA = /([→←↑↓↔⇒✓✔])/;

function inline(s, style, accent, out) {
  while (s.length) {
    const b = s.indexOf('**');
    const a = s.indexOf('[[');
    if (b < 0 && a < 0) { out.push({ text: s, o: { ...style } }); return; }
    const isBold = b >= 0 && (a < 0 || b < a);
    const i = isBold ? b : a;
    const close = isBold ? s.indexOf('**', i + 2) : s.indexOf(']]', i + 2);
    if (close < 0) { out.push({ text: s, o: { ...style } }); return; }
    if (i > 0) out.push({ text: s.slice(0, i), o: { ...style } });
    const inner = s.slice(i + 2, close);
    inline(inner, isBold ? { ...style, bold: true } : { ...style, color: accent || C.crimson }, accent, out);
    s = s.slice(close + 2);
  }
}

// Русская типографика: тире вместо дефиса в « - », неразрывный пробел после коротких предлогов и союзов
// (не висят в конце строки), тире/стрелка/плюс не отрываются от соседнего слова
const NB = '\u00a0';
const SHORT_WORDS = 'в|во|и|й|с|со|к|ко|о|об|обо|у|а|но|да|до|по|за|на|из|от|не|ни|для|без|при|над|под|про|или|из-за|что|как';
const RE_SHORT = new RegExp(`(^|[\\s«(„"/])(${SHORT_WORDS}) `, 'giu');
function typo(str) {
  let t = String(str).replace(/ [-–] /g, ' — ');
  let prev;
  do { prev = t; t = t.replace(RE_SHORT, `$1$2${NB}`); } while (t !== prev);
  // названия брендов из двух слов не рвём («Акриол Про», «Acriol PRO»); «Про» после имени — не предлог
  t = t.replace(/(Акриол|АКРИОЛ|Acriol|ACRIOL)[ \u00a0](Про|ПРО|Pro|PRO)[ \u00a0]?/g, (m, a, b) => `${a}${NB}${b}${m.endsWith(' ') || m.endsWith(NB) ? ' ' : ''}`);
  return t.replace(/ —/g, NB + '—').replace(/ ([→+×]) /g, ` $1${NB}`);
}

// ---------- Перевод на уровне библиотеки ----------
// setTranslator(fn): каждая строка, попадающая на слайд (тексты, заголовки, подписи графиков, ячейки таблиц,
// заметки, разделы), проходит через fn до разметки и измерений — так одна и та же сборка даёт RU и EN,
// а подбор кегля и переносы считаются уже по переведённому тексту. Режим записи собирает все строки RU.
let TRANSLATE = null;
function setTranslator(fn) { TRANSLATE = fn; }
function tr(s) {
  if (TRANSLATE == null || s == null) return s;
  if (typeof s !== 'string') return s;
  return TRANSLATE(s);
}

function parseRuns(content, accent) {
  if (Array.isArray(content)) return content.map((r) => (typeof r === 'string' ? { text: typo(tr(r)), options: {} } : { ...r, text: typo(tr(r.text)) }));
  const s = typo(tr(String(content)).replace(/\u2028/g, '\n'));
  const tokens0 = [];
  inline(s, {}, accent, tokens0);
  const tokens = [];
  tokens0.forEach((tk) => tk.text.split(NO_TAHOMA).forEach((part) => {
    if (!part) return;
    tokens.push({ text: part, o: NO_TAHOMA.test(part) ? { ...tk.o, fontFace: 'Arial' } : tk.o });
  }));
  // режем по абзацам и строкам
  const runs = [];
  let pendingSoft = false;
  tokens.forEach((tk) => {
    const paras = tk.text.split('\n\n');
    paras.forEach((para, pi) => {
      if (pi > 0 && runs.length) { runs[runs.length - 1].options.breakLine = true; pendingSoft = false; }
      para.split('\n').forEach((line, li) => {
        if (li > 0) pendingSoft = true;
        // пустой хвост строки («…\n» перед → или **жирным**) не превращаем в пробел — перенос уйдёт следующему рану
        if (line === '') return;
        const o = { ...tk.o };
        if (pendingSoft && runs.length && !runs[runs.length - 1].options.breakLine) o.softBreakBefore = true;
        pendingSoft = false;
        runs.push({ text: line, options: o });
      });
    });
  });
  return runs;
}
const plain = (content) =>
  Array.isArray(content)
    ? content.map((r) => (typeof r === 'string' ? tr(r) : tr(r.text) + (r.options && r.options.breakLine ? '\n' : ''))).join('')
    : typo(tr(String(content)).replace(/\u2028/g, '\n').replace(/\*\*|\[\[|\]\]/g, ''));

// ---------- Колода ----------
class Deck {
  // pageNumbers: номер страницы в правом нижнем углу контентных макетов; uniformPlaques: нижние плашки
  // principle/formula всегда во всю ширину контента (58…1862) — единый вид деки
  constructor({ title = 'Акрихин × OMD', author = 'OMD', subject = '', pageNumbers = false, uniformPlaques = false } = {}) {
    const pres = new pptxgen();
    pres.defineLayout({ name: 'AKR_1920', width: 20, height: 11.25 });
    pres.layout = 'AKR_1920';
    pres.theme = { headFontFace: FONT, bodyFontFace: FONT };
    pres.title = tr(title);
    pres.author = author;
    pres.company = 'OMD';
    pres.subject = subject;
    this.pres = pres;
    this.count = 0;
    this.warnings = [];
    this._section = null;
    this.pageNumbers = pageNumbers;
    this.uniformPlaques = uniformPlaques;
    this._defineLayouts();
  }

  _defineLayouts() {
    const p = this.pres;
    const band = [
      { rect: { x: 0, y: 0, w: IN(W), h: IN(187), fill: { color: C.blue } } },
      { image: { x: IN(1441), y: 0, w: IN(479), h: IN(187), path: ASSET('header_corner.png'), altText: tr('Знак Акрихин') } },
    ];
    p.defineSlideMaster({
      title: 'AKR_COVER',
      background: { path: ASSET('cover_bg.jpg') },
      objects: [
        { placeholder: { options: { name: 'title', type: 'title', x: IN(296), y: IN(330), w: IN(1328), h: IN(580),
          fontFace: FONT, bold: true, color: C.white, align: 'center', valign: 'middle', margin: 0 }, text: '' } },
      ],
    });
    p.defineSlideMaster({
      title: 'AKR_SECTION',
      background: { path: ASSET('section_bg.jpg') },
      objects: [
        { placeholder: { options: { name: 'title', type: 'title', x: IN(120), y: IN(400), w: IN(1000), h: IN(420),
          fontFace: FONT, bold: true, color: C.white, align: 'left', valign: 'top', margin: 0 }, text: '' } },
      ],
    });
    p.defineSlideMaster({
      title: 'AKR_TITLE',
      background: { color: C.white },
      slideNumber: this.pageNumbers ? SLIDE_NUM : undefined,
      objects: [
        ...band,
        { placeholder: { options: { name: 'title', type: 'title', x: IN(58), y: IN(20), w: IN(1370), h: IN(147),
          fontFace: FONT, bold: true, color: C.white, align: 'left', valign: 'middle', margin: 0 }, text: '' } },
      ],
    });
    p.defineSlideMaster({
      title: 'AKR_TITLE_SUB',
      background: { color: C.white },
      slideNumber: this.pageNumbers ? SLIDE_NUM : undefined,
      objects: [
        ...band,
        { placeholder: { options: { name: 'title', type: 'title', x: IN(58), y: IN(34), w: IN(1380), h: IN(46),
          fontFace: FONT, bold: true, color: C.white, align: 'left', valign: 'top', margin: 0 }, text: '' } },
        { placeholder: { options: { name: 'subtitle', type: 'body', x: IN(58), y: IN(87), w: IN(1300), h: IN(80),
          fontFace: FONT, bold: false, color: C.white, align: 'left', valign: 'top', margin: 0 }, text: '' } },
      ],
    });
    // Длинный заголовок в 2 строки + подзаголовок (эталон фигмы 12)
    p.defineSlideMaster({
      title: 'AKR_TITLE2_SUB',
      background: { color: C.white },
      slideNumber: this.pageNumbers ? SLIDE_NUM : undefined,
      objects: [
        ...band,
        { placeholder: { options: { name: 'title', type: 'title', x: IN(58), y: IN(20), w: IN(1380), h: IN(80),
          fontFace: FONT, bold: true, color: C.white, align: 'left', valign: 'top', margin: 0 }, text: '' } },
        { placeholder: { options: { name: 'subtitle', type: 'body', x: IN(58), y: IN(104), w: IN(1340), h: IN(66),
          fontFace: FONT, bold: false, color: C.white, align: 'left', valign: 'top', margin: 0 }, text: '' } },
      ],
    });
    // То же с однострочным подзаголовком: блок опущен, чтобы стоять по центру полосы
    p.defineSlideMaster({
      title: 'AKR_TITLE2_SUB1',
      background: { color: C.white },
      slideNumber: this.pageNumbers ? SLIDE_NUM : undefined,
      objects: [
        ...band,
        { placeholder: { options: { name: 'title', type: 'title', x: IN(58), y: IN(34), w: IN(1380), h: IN(80),
          fontFace: FONT, bold: true, color: C.white, align: 'left', valign: 'top', margin: 0 }, text: '' } },
        { placeholder: { options: { name: 'subtitle', type: 'body', x: IN(58), y: IN(118), w: IN(1340), h: IN(40),
          fontFace: FONT, bold: false, color: C.white, align: 'left', valign: 'top', margin: 0 }, text: '' } },
      ],
    });
    p.defineSlideMaster({ title: 'AKR_BLANK', background: { color: C.white }, objects: [], slideNumber: this.pageNumbers ? SLIDE_NUM : undefined });
    // pptxgenjs обнуляет lineSpacing у плейсхолдеров макета и потом затирает им межстрочный слайда.
    // Кегль в макете тоже не задаём: иначе он перебивает подобранный на слайде. Дефолт — в мастере (postprocess).
    for (const L of p.slideLayouts) {
      for (const o of L._slideObjects || []) {
        if (o._type === 'placeholder' && o.options) {
          delete o.options.lineSpacing;
          delete o.options.lineSpacingMultiple;
          delete o.options.fontSize;
        }
      }
    }
  }

  section(title) {
    title = tr(title);
    this.pres.addSection({ title });
    this._section = title;
  }

  _add(masterName) {
    const opts = { masterName };
    if (this._section) opts.sectionTitle = this._section;
    const s = this.pres.addSlide(opts);
    this.count++;
    return new Slide(this, s, this.count);
  }

  // Обложка: фон фигмы, связка логотипов, крупный заголовок по центру
  cover({ title, note = 'Классификация документа: конфиденциальная информация для внутреннего использования', logo = 'akrikhin_omd', size } = {}) {
    const sl = this._add('AKR_COVER');
    const fs_ = size || fitSize(plain(title), 133, 80, 1328, 3, true);
    sl.s.addText(parseRuns(title), { placeholder: 'title', fontFace: FONT, fontSize: PT(fs_), bold: true, color: C.white,
      align: 'center', valign: 'middle', lineSpacing: PT(fs_ * 1.14), margin: 0, fit: 'none' });
    if (logo === 'akrikhin_omd') sl.image('logo_akrikhin_omd.png', { x: 601, y: 175, w: 718, h: 113 });
    else if (logo === 'akrikhin') sl.image('logo_akrikhin.png', { x: 766, y: 181, w: 388, h: 101 });
    if (note) sl.text(note, { x: 360, y: 1030, w: 1200, size: 14, lh: 1.14, color: C.white, align: 'center' });
    return sl;
  }

  // Разделитель раздела (производный от обложки, в фигме его нет)
  divider({ title, kicker } = {}) {
    const sl = this._add('AKR_SECTION');
    const fs_ = fitSize(plain(title), 96, 64, 1000, 3, true);
    if (kicker) sl.text(kicker.toUpperCase(), { x: 120, y: 340, w: 1000, size: 29, bold: true, color: C.white, lh: 1 });
    sl.s.addText(parseRuns(title), { placeholder: 'title', fontFace: FONT, fontSize: PT(fs_), bold: true, color: C.white,
      align: 'left', valign: 'top', lineSpacing: PT(fs_ * 1.1), margin: 0, fit: 'none' });
    sl.image('logo_akrikhin.png', { x: 120, y: 80, w: 290, h: 75 }); // пропорция 3.85:1
    return sl;
  }

  // Контентный слайд: синяя шапка. С subtitle — вариант «заголовок в 1 строку + подзаголовок»
  slide({ title, subtitle } = {}) {
    if (subtitle) {
      // заголовок не влезает в 1 строку даже на 34 px → вариант «заголовок в 2 строки (37) + подзаголовок (25)»
      if (countLines(plain(title), 34, 1380, true) > 1 || longestWord(plain(title), 34, true) > 1338) return this._slideTwoLine(title, subtitle);
      const sl = this._add('AKR_TITLE_SUB');
      const ts = fitSize(plain(title), 41, 34, 1380, 1, true);
      sl.s.addText(parseRuns(title), { placeholder: 'title', fontFace: FONT, fontSize: PT(ts), bold: true, color: C.white,
        valign: 'top', lineSpacing: PT(ts), margin: 0, fit: 'none' });
      const ss = fitSize(plain(subtitle), 29, 24, 1300, 2, false);
      if (countLines(plain(subtitle), ss, 1300, false) > 2) sl.warn('шапка', subtitle, 'подзаголовок длиннее 2 строк — сократи');
      sl.s.addText(parseRuns(subtitle), { placeholder: 'subtitle', fontFace: FONT, fontSize: PT(ss), bold: false, color: C.white,
        valign: 'top', lineSpacing: PT(ss * 1.18), margin: 0, fit: 'none' });
      return sl;
    }
    if (!title) return this._add('AKR_BLANK');
    const sl = this._add('AKR_TITLE');
    const ts = fitSize(plain(title), 47, 38, 1370, 2, true);
    if (countLines(plain(title), ts, 1370, true) > 2) sl.warn('шапка', title, 'заголовок длиннее 2 строк — сократи');
    title = balanceTitle(title, ts, 1370);
    sl.s.addText(parseRuns(title), { placeholder: 'title', fontFace: FONT, fontSize: PT(ts), bold: true, color: C.white,
      valign: 'middle', lineSpacing: PT(ts), margin: 0, fit: 'none' });
    return sl;
  }

  _slideTwoLine(title, subtitle) {
    const ss0 = fitSize(plain(subtitle), 25, 21, 1340, 2, false);
    const sl = this._add(countLines(plain(subtitle), ss0, 1340, false) === 1 ? 'AKR_TITLE2_SUB1' : 'AKR_TITLE2_SUB');
    const ts = fitSize(plain(title), 37, 32, 1380, 2, true);
    if (countLines(plain(title), ts, 1380, true) > 2) sl.warn('шапка', title, 'заголовок длиннее 2 строк — сократи');
    title = balanceTitle(title, ts, 1380);
    sl.s.addText(parseRuns(title), { placeholder: 'title', fontFace: FONT, fontSize: PT(ts), bold: true, color: C.white,
      valign: 'top', lineSpacing: PT(ts), margin: 0, fit: 'none' });
    const ss = fitSize(plain(subtitle), 25, 21, 1340, 2, false);
    if (countLines(plain(subtitle), ss, 1340, false) > 2) sl.warn('шапка', subtitle, 'подзаголовок длиннее 2 строк — сократи');
    sl.s.addText(parseRuns(subtitle), { placeholder: 'subtitle', fontFace: FONT, fontSize: PT(ss), bold: false, color: C.white,
      valign: 'top', lineSpacing: PT(ss * 1.18), margin: 0, fit: 'none' });
    return sl;
  }

  async save(file) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    await this.pres.writeFile({ fileName: file });
    await postprocess(file);
    await applyTheme(file, THEME);
    if (this.warnings.length) {
      console.warn(`\n⚠ Предупреждения (${this.warnings.length}):`);
      this.warnings.forEach((w) => console.warn('  ' + w));
    }
    console.log(`✓ ${file} — слайдов: ${this.count}`);
    return file;
  }
}

// Балансировка двухстрочного заголовка: перенос там, где строки примерно равны; лучше после «:» или «,»;
// короткий предлог/союз в конце первой строки — штраф. Только для заголовков без ручных переносов и разметки.
const SHORT = new Set(['в', 'во', 'с', 'со', 'и', 'к', 'ко', 'о', 'об', 'у', 'на', 'по', 'за', 'из', 'от', 'до', 'для', 'не', 'а', 'но', 'или', 'что', 'как', 'the', 'a', 'to', 'of', 'in', 'and', '—', '-', '→']);
function balanceTitle(text, size, width, bold = true) {
  text = typo(tr(text));   // переносим уже переведённый текст
  if (/\n|\*\*|\[\[/.test(text)) return text;
  if (countLines(text, size, width, bold) !== 2) return text;
  const words = text.split(' ');
  const sp = textWidth(' ', size, bold);
  const ww = words.map((w) => textWidth(w, size, bold));
  let best = null;
  for (let k = 1; k < words.length; k++) {
    const w1 = ww.slice(0, k).reduce((a, b) => a + b, 0) + sp * (k - 1);
    const w2 = ww.slice(k).reduce((a, b) => a + b, 0) + sp * (words.length - k - 1);
    if (w1 > width * 0.97 || w2 > width * 0.97) continue;
    const last = words[k - 1].toLowerCase();
    let score = Math.max(w1, w2);
    if (/[:,;]$/.test(last)) score -= width * 0.12;
    if (SHORT.has(last.replace(/[^\p{L}—→-]/gu, ''))) score += width;
    if (SHORT.has(words[k].toLowerCase()) && /^[—→-]$/.test(words[k])) score += width; // тире/стрелку не начинаем строку
    if (!best || score < best.score) best = { k, score };
  }
  if (!best) return text;
  return words.slice(0, best.k).join(' ') + '\n' + words.slice(best.k).join(' ');
}

// Ширина самого длинного слова — если оно шире блока, PowerPoint разорвёт его посередине
function longestWord(text, size, bold) {
  return Math.max(0, ...String(text).split(/\s+/).map((w) => textWidth(w, size, bold)));
}

// Подбор кегля: уменьшаем от max до min, пока текст не уложится в maxLines
// и пока самое длинное слово не встанет в строку целиком
function fitSize(text, max, min, width, maxLines, bold) {
  let s = max;
  while (s > min && (countLines(text, s, width, bold) > maxLines || longestWord(text, s, bold) > width * 0.97)) s -= 1;
  return s;
}

// ---------- Слайд и компоненты ----------
class Slide {
  constructor(deck, s, n) {
    this.deck = deck;
    this.s = s;
    this.n = n;
    this.shapes = deck.pres.ShapeType;
  }

  warn(what, text, msg) {
    const snip = plain(text).replace(/\s+/g, ' ').slice(0, 50);
    this.deck.warnings.push(`слайд ${this.n}, ${what} «${snip}…»: ${msg}`);
  }

  // Текст. o: x, y, w, [h], size, bold, color, align, valign, lh, caps, gap (px между абзацами),
  // fit: true — ужать кегль до minSize, чтобы влезть в h (и в maxLines строк); accent — цвет для [[...]].
  // Возвращает фактическую оценку высоты в px — удобно, чтобы ставить следующий блок под текстом.
  text(content, o = {}) {
    const st = o.style ? T[o.style] : {};
    let size = o.size ?? st.size ?? 18;
    const bold = o.bold ?? st.bold ?? false;
    const lh = o.lh ?? st.lh ?? 1.2;
    const gap = o.gap ?? 0;
    if (o.caps) content = typeof content === 'string' ? content.toUpperCase() : content;
    const txt = plain(content);
    const paras = txt.split('\n\n').length;
    const est = (sz) => countLines(txt, sz, o.w, bold) * sz * lh + (paras - 1) * gap;
    if (o.fit) {
      const min = o.minSize ?? Math.max(12, Math.round(size * 0.8));
      const tooBig = (sz) => (o.h && est(sz) > o.h) || longestWord(txt, sz, bold) > o.w * 0.97
        || (o.maxLines && countLines(txt, sz, o.w, bold) > o.maxLines);
      while (size > min && tooBig(size)) size -= 1;
    }
    const need = est(size);
    if (o.h && need > o.h + 2) this.warn('текст', content, `не влезает: нужно ~${Math.round(need)}px, есть ${o.h}px`);
    if (longestWord(txt, size, bold) > o.w * 0.99) this.warn('текст', content, 'длинное слово не помещается в строку и будет разорвано');
    const h = o.h ?? Math.ceil(need + 4);
    this.s.addText(parseRuns(content, o.accent), {
      x: IN(o.x), y: IN(o.y), w: IN(o.w), h: IN(h),
      fontFace: FONT, fontSize: PT(size), bold, color: o.color ?? C.blueText,
      align: o.align ?? 'left', valign: o.valign ?? 'top', margin: 0,
      lineSpacing: PT(size * lh), paraSpaceAfter: gap ? PT(gap) : undefined,
      isTextBox: true, fit: 'none', objectName: o.name,
    });
    return Math.round(need);
  }

  // Маркированный список. items — массив строк (поддерживает **жирный**)
  bullets(items, o = {}) {
    const size = o.size ?? 16;
    const lh = o.lh ?? 1.2;
    const gap = o.gap ?? 6;
    const indent = o.indent ?? 18;
    const runs = [];
    items.forEach((it, i) => {
      const r = parseRuns(it, o.accent);
      r[0].options.bullet = { indent: PT(indent) };
      r[r.length - 1].options.breakLine = i < items.length - 1;
      runs.push(...r);
    });
    const need = items.reduce((a, it) => a + countLines(plain(it), size, o.w - indent, o.bold) * size * lh, 0) + gap * (items.length - 1);
    if (o.h && need > o.h + 2) this.warn('список', items[0], `не влезает: нужно ~${Math.round(need)}px, есть ${o.h}px`);
    this.s.addText(runs, {
      x: IN(o.x), y: IN(o.y), w: IN(o.w), h: IN(o.h ?? need + 4),
      fontFace: FONT, fontSize: PT(size), bold: !!o.bold, color: o.color ?? C.blueText, margin: 0, valign: 'top',
      lineSpacing: PT(size * lh), paraSpaceAfter: PT(gap), isTextBox: true, fit: 'none',
    });
    return Math.round(need);
  }

  // Карточка: светлый фон, голубая обводка 3px, радиус 25. tint: true — выделенная (голубоватая)
  card(o) {
    this.s.addShape(this.shapes.roundRect, {
      x: IN(o.x), y: IN(o.y), w: IN(o.w), h: IN(o.h),
      fill: { color: o.fill ?? (o.tint ? C.cardTint : C.card) },
      line: { color: o.stroke ?? C.line, width: PT(o.sw ?? 3) },
      rectRadius: IN(o.r ?? 25), objectName: o.name,
    });
  }

  // Заливной блок (плитка) радиус 15. stroke — необязательная обводка (для белых вложенных карточек)
  box(o) {
    const opt = {
      x: IN(o.x), y: IN(o.y), w: IN(o.w), h: IN(o.h),
      fill: { color: o.fill ?? C.blue, transparency: o.transparency }, rectRadius: IN(o.r ?? 15), objectName: o.name,
    };
    if (o.stroke) opt.line = { color: o.stroke, width: PT(o.sw ?? 1) };
    this.s.addShape(o.r === 0 ? this.shapes.rect : this.shapes.roundRect, opt);
  }

  // Кружок с номером. d — диаметр (84 / 70 / 46 / 38)
  badge(o) {
    const d = o.d ?? 84;
    const fill = o.color ?? C.blue;
    this.s.addShape(this.shapes.ellipse, { x: IN(o.x), y: IN(o.y), w: IN(d), h: IN(d), fill: { color: fill } });
    const size = o.size ?? Math.round(d * 0.5);
    this.s.addText(String(o.n), {
      x: IN(o.x), y: IN(o.y), w: IN(d), h: IN(d), fontFace: FONT, fontSize: PT(size), bold: true,
      color: o.textColor ?? C.white, align: 'center', valign: 'middle', margin: 0, isTextBox: true, fit: 'none',
    });
  }

  // Колонка-карточка с номером, «висящим» на верхней кромке (слайды 2, 4, 6, 12, 13 фигмы).
  // Возвращает { cx, cy, cw } — где начинать контент внутри.
  numberedCard(o) {
    const d = o.d ?? 84;
    const pad = o.pad ?? 39;
    this.card({ x: o.x, y: o.y + d / 2 + 3, w: o.w, h: o.h - d / 2 - 3, tint: o.tint });
    this.badge({ x: o.x + pad, y: o.y, d, n: o.n, color: o.color });
    return { cx: o.x + pad, cy: o.y + d + 45, cw: o.w - pad * 2 };
  }

  // Цветная плитка с большой цифрой и подписью (слайд 2)
  // unit — единица мельче цифры («49,5» + «млн»)
  stat(o) {
    const h = o.h ?? 135;
    this.box({ x: o.x, y: o.y, w: o.w, h, fill: o.color ?? C.blue });
    let vs = o.size ?? 64;
    const vw = (sz) => textWidth(String(o.value), sz, true) + (o.unit ? textWidth(' ' + o.unit, Math.round(sz * 0.55), true) : 0);
    if (!o.size) while (vs > 40 && vw(vs) > (o.w - 36) * 0.97) vs -= 1;
    const value = o.unit
      ? [{ text: String(o.value), options: {} }, { text: ' ' + o.unit, options: { fontSize: PT(Math.round(vs * 0.55)) } }]
      : String(o.value);
    this.text(value, { x: o.x + 18, y: o.y + 8, w: o.w - 30, size: vs, bold: true, lh: 1.1, color: C.white });
    if (o.label) this.text(o.label, { x: o.x + 18, y: o.y + 80, w: o.w - 34, h: h - 86, size: 16, lh: 1.2, color: C.white, fit: true, minSize: 14 });
  }

  // Плитка с КАПС-текстом (и необязательной иконкой) — слайды 4, 6, 9 фигмы
  tile(o) {
    const h = o.h ?? 135;
    this.box({ x: o.x, y: o.y, w: o.w, h, fill: o.color ?? C.blue });
    let ty = o.y + 18;
    if (o.icon) {
      this.icon(o.icon, { x: o.x + 16, y: o.y + 16, size: o.iconSize ?? 68, color: C.white });
      ty = o.y + h - 18 - (o.textH ?? 58);
    }
    this.text(o.text, { x: o.x + 16, y: ty, w: o.w - 32, h: o.textH ?? (o.icon ? 58 : h - 36), size: o.size ?? 26, bold: true,
      lh: 1.1, color: C.white, fit: true, valign: o.icon ? 'bottom' : 'top' });
  }

  // Плашка-заголовок столбца: тёмная скруглённая, белый жирный капс по центру (слайды 3, 14)
  pill(text, o) {
    const h = o.h ?? 56;
    this.box({ x: o.x, y: o.y, w: o.w, h, fill: o.color ?? C.navy, r: o.r ?? 15 });
    this.text(o.caps === false ? text : String(text).toUpperCase(), { x: o.x + 16, y: o.y, w: o.w - 32, h, size: o.size ?? 22, bold: true,
      lh: 1.1, color: C.white, align: o.align ?? 'center', valign: 'middle', fit: true, maxLines: 2, minSize: 15 });
  }

  // КАПС-метка над заголовком (цветная)
  label(text, o) {
    return this.text(String(text).toUpperCase(), { x: o.x, y: o.y, w: o.w, size: o.size ?? 22, bold: true, lh: 1.0, color: o.color ?? C.green });
  }

  // Заголовок внутри карточки (тёмно-синий, жирный)
  heading(text, o) {
    return this.text(text, { x: o.x, y: o.y, w: o.w, h: o.h, size: o.size ?? 34, bold: true, lh: 1.1, color: o.color ?? C.navy, fit: !!o.h });
  }

  // Плашка-вывод внизу слайда: иконка | МЕТКА | текст (малиновая по умолчанию).
  // Стандартное место: y 935, высота 84. Ширина по умолчанию 1236, по центру.
  principle(o) {
    if (this.deck.uniformPlaques) o = { ...o, x: 58, w: 1804 };
    const w = o.w ?? 1236;
    const h = o.h ?? 84;
    const x = o.x ?? Math.round((W - w) / 2);
    const y = o.y ?? 935;
    const color = o.color ?? C.crimson;
    this.box({ x, y, w, h, fill: color, r: 25 });
    const mid = y + h / 2;
    let cx = x + 43;
    if (o.icon !== false) {
      this.icon(o.icon ?? 'target', { x: cx, y: mid - 28, size: 56, color: C.white });
      cx += 56 + 44;
      this.vline(cx, mid - 22, 44, C.white, 2);
      cx += 50;
    }
    const label = tr(String(o.label ?? '2027 ПРИНЦИП').toUpperCase());   // ширина метки — по переведённому тексту
    const lw = Math.ceil(textWidth(label, 25, true)) + 6;
    this.text(label, { x: cx, y: mid - 13, w: lw, size: 25, bold: true, lh: 1.0, color: C.white });
    cx += lw + 40;
    this.vline(cx, mid - 22, 44, C.white, 2);
    cx += 46;
    const tw = x + w - 24 - cx;
    const ts = fitSize(plain(o.text), 20, 16, tw, 2, false);
    if (countLines(plain(o.text), ts, tw, false) > 2) this.warn('плашка', o.text, 'текст плашки длиннее 2 строк — сократи или расширь плашку');
    const bt = typeof o.text === 'string' ? balanceTitle(o.text, ts, tw, false) : o.text;
    this.text(bt, { x: cx, y: y + 6, w: tw, h: h - 12, size: ts, lh: 1.2, color: C.white, valign: 'middle' });
  }

  // Синяя плашка-формула: одна строка жирного текста по центру (слайд 7 фигмы)
  formula(o) {
    if (this.deck.uniformPlaques) o = { ...o, x: 58, w: 1804 };
    const w = o.w ?? 1453;
    const h = o.h ?? 84;
    const x = o.x ?? Math.round((W - w) / 2);
    const y = o.y ?? 935;
    this.box({ x, y, w, h, fill: o.color ?? C.blue, r: 25 });
    const ts = fitSize(plain(o.text), o.size ?? 21, 16, w - 60, 2, true);
    this.text(o.text, { x: x + 30, y, w: w - 60, h, size: ts, bold: true, lh: 1.2, color: C.white, align: 'center', valign: 'middle' });
  }

  // Нумерованный список с вертикальной линией (слайд 7, «CALIBRATION»).
  // items: [{ title, text }], highlightLast — последний номер малиновый
  steps(items, o) {
    // pitch: 'auto' — шаг по реальной высоте текста (+ gap, по умолчанию 22); возвращает высоту блока
    const d = o.d ?? 38;
    const auto = o.pitch === 'auto';
    const pitch = auto ? 0 : (o.pitch ?? 95);
    const tx = o.x + d + 21;
    const tw = o.w - d - 21;
    const ts = o.titleSize ?? 23;
    const bs = o.size ?? 16;
    const ys = [];
    let y = o.y;
    items.forEach((it, i) => {
      ys.push(y);
      if (auto) {
        const th = countLines(plain(it.title), ts, tw, true) * ts;
        const bh = it.text ? 9 + countLines(plain(it.text), bs, tw, false) * bs * 1.2 : 0;
        y += Math.max(d, 5 + th + bh) + (o.gap ?? 22);
      } else y += pitch;
    });
    if (items.length > 1) this.vline(o.x + d / 2, o.y + d / 2, ys[ys.length - 1] - o.y, C.line, 1.5);
    items.forEach((it, i) => {
      const yy = ys[i];
      const hl = (o.highlightLast && i === items.length - 1) || it.highlight;
      this.badge({ x: o.x, y: yy, d, n: i + 1, color: hl ? C.crimson : C.tint, textColor: hl ? C.white : C.blueText });
      const th = this.text(it.title, { x: tx, y: yy + 5, w: tw, size: ts, bold: true, lh: 1.0, color: C.blueText });
      if (it.text) this.text(it.text, { x: tx, y: yy + 5 + th + 9, w: tw, size: bs, lh: 1.2, color: C.blueText });
    });
    return Math.round(y - o.y - (auto ? (o.gap ?? 22) : 0));
  }


  // Список с малиновыми галочками (слайд 7, «QUALITY CONTROL»). mark: 'x' — крестики (ограничения, слайд 8)
  checks(items, o) {
    // pitch: 'auto' — шаг по реальной высоте текста (+ gap, по умолчанию 18); возвращает высоту блока
    const auto = o.pitch === 'auto';
    const pitch = o.pitch ?? 65;
    const size = o.size ?? 18;
    let y = o.y;
    items.forEach((it) => {
      this.icon(o.mark === 'x' ? 'x_circle' : 'check_circle', { x: o.x, y, size: 35, color: C.white, bg: o.color ?? C.crimson });
      const h = this.text(it, { x: o.x + 52, y: y + 1, w: o.w - 52, size, lh: 1.2, color: o.textColor ?? C.blueText });
      y += auto ? Math.max(35, h) + (o.gap ?? 18) : pitch;
    });
    return Math.round(y - o.y - (auto ? (o.gap ?? 18) : 0));
  }


  // Стрелка из ножки и треугольника (как в фигме). dir: down | right | up | left.
  // (x, y) — начало ножки по центральной оси; len — общая длина
  arrow(o) {
    const dir = o.dir ?? 'down';
    const color = o.color ?? C.crimson;
    const len = o.len ?? 53;
    const hw = o.head ?? 51;
    const hl = o.headLen ?? 24;
    const sw = o.stem ?? 12;
    const stemLen = Math.max(0, len - hl);
    const S = this.shapes;
    const rot = { down: 180, up: 0, right: 90, left: 270 }[dir];
    if (dir === 'down' || dir === 'up') {
      const sy = dir === 'down' ? o.y : o.y + hl;
      const hy = dir === 'down' ? o.y + stemLen : o.y;
      if (stemLen) this.s.addShape(S.rect, { x: IN(o.x - sw / 2), y: IN(sy), w: IN(sw), h: IN(stemLen), fill: { color } });
      this.s.addShape(S.triangle, { x: IN(o.x - hw / 2), y: IN(hy), w: IN(hw), h: IN(hl), fill: { color }, rotate: rot });
    } else {
      const sx = dir === 'right' ? o.x : o.x + hl;
      const hx = dir === 'right' ? o.x + stemLen : o.x;
      if (stemLen) this.s.addShape(S.rect, { x: IN(sx), y: IN(o.y - sw / 2), w: IN(stemLen), h: IN(sw), fill: { color } });
      // треугольник рисуется вертикально и поворачивается вокруг центра
      const cx = hx + hl / 2;
      this.s.addShape(S.triangle, { x: IN(cx - hw / 2), y: IN(o.y - hl / 2), w: IN(hw), h: IN(hl), fill: { color }, rotate: rot });
    }
  }

  // Круг / окружность: fill — заливка (или null), stroke — обводка
  circle(o) {
    const opt = { x: IN(o.x), y: IN(o.y), w: IN(o.d), h: IN(o.d) };
    if (o.fill) opt.fill = { color: o.fill };
    else opt.fill = { type: 'none' };
    if (o.stroke) opt.line = { color: o.stroke, width: PT(o.sw ?? 3) };
    this.s.addShape(this.shapes.ellipse, opt);
  }

  // Живой график PowerPoint в фирменном стиле.
  // kind: 'col' (столбцы) | 'bar' (горизонтальные полосы) | 'line' | 'area' | 'pie' | 'doughnut'
  // series: [{ name, labels: [...], values: [...] }]
  // o: x, y, w, h, stacked, percent (100%-накопление), colors, legend ('b'|'t'|'r'|false),
  //    values (true — подписи значений), format ('0', '0.0', '0%', '#,##0'), labelPos, labelColor,
  //    axisSize / labelSize (px), rotate (угол подписей оси), gap (зазор между столбцами, %),
  //    reverse (для 'bar': первая категория сверху), valAxis (показать ось значений), min / max
  // Правила: одна ось значений (без второй оси), текст — цветами текста, а не серий.
  chart(kind, series, o) {
    const P = this.deck.pres;
    series = series.map((sr) => ({ ...sr, name: tr(sr.name), labels: (sr.labels || []).map((l) => tr(String(l))) }));
    const type = { col: P.ChartType.bar, bar: P.ChartType.bar, line: P.ChartType.line, area: P.ChartType.area,
      pie: P.ChartType.pie, doughnut: P.ChartType.doughnut }[kind];
    const many = series.length > 1;
    const round = kind === 'pie' || kind === 'doughnut';
    const ax = PT(o.axisSize ?? 14);
    const lb = PT(o.labelSize ?? 14);
    const opt = {
      x: IN(o.x), y: IN(o.y), w: IN(o.w), h: IN(o.h),
      chartColors: o.colors ?? (many || round ? CHART_COLORS : [o.color ?? C.blue]),
      showTitle: false,
      showLegend: o.legend === undefined ? (many || round) : !!o.legend,
      legendPos: o.legend || 'b', legendFontFace: FONT, legendFontSize: PT(o.legendSize ?? 14), legendColor: C.blueText,
      showValue: o.values ?? true,
      dataLabelFontFace: FONT, dataLabelFontSize: lb, dataLabelColor: o.labelColor ?? C.navy, dataLabelFontBold: o.labelBold ?? false,
      dataLabelFormatCode: o.format ?? '0',
      catAxisLabelFontFace: FONT, catAxisLabelFontSize: ax, catAxisLabelColor: C.blueText,
      catAxisLineShow: !round, catAxisLineColor: C.line, catAxisMajorTickMark: 'none',
      valAxisHidden: !o.valAxis, valAxisLabelFontFace: FONT, valAxisLabelFontSize: ax, valAxisLabelColor: C.blueText,
      valAxisLineShow: false,
      valGridLine: o.grid ? { color: C.line, size: 0.75 } : { style: 'none' },
      catGridLine: { style: 'none' },
      plotArea: { fill: { color: 'FFFFFF', transparency: 100 } },
    };
    if (kind === 'col' || kind === 'bar') {
      opt.barDir = kind === 'bar' ? 'bar' : 'col';
      opt.barGrouping = o.percent ? 'percentStacked' : o.stacked ? 'stacked' : 'clustered';
      opt.barGapWidthPct = o.gap ?? 60;
      if (o.stacked || o.percent) { opt.barOverlapPct = 100; opt.dataLabelPosition = o.labelPos ?? 'ctr'; opt.dataLabelColor = o.labelColor ?? C.white; }
      else { opt.dataLabelPosition = o.labelPos ?? 'outEnd'; if (many) opt.barOverlapPct = o.overlap ?? -6; }
      if (kind === 'bar' && o.reverse !== false) opt.catAxisOrientation = 'maxMin';
    }
    if (kind === 'line') {
      opt.lineSize = o.lineSize ?? 2.25;
      opt.lineDataSymbol = o.symbol ?? 'circle';
      opt.lineDataSymbolSize = o.symbolSize ?? 6;
      opt.lineSmooth = !!o.smooth;
      opt.dataLabelPosition = o.labelPos ?? 't';
    }
    if (round) {
      opt.dataLabelPosition = o.labelPos ?? (kind === 'pie' ? 'bestFit' : undefined);
      opt.dataLabelColor = o.labelColor ?? C.white;
      opt.showPercent = !!o.showPercent;
      if (kind === 'doughnut') opt.holeSize = o.hole ?? 60;
    }
    if (o.rotate !== undefined) opt.catAxisLabelRotate = o.rotate;
    if (o.min !== undefined) opt.valAxisMinVal = o.min;
    if (o.max !== undefined) opt.valAxisMaxVal = o.max;
    // plot: { x, y, w, h } — точная область построения (px слайда). Нужна, чтобы рисовать поверх графика
    // подписи, линию среднего, заливку периода: метод вернёт преобразование «данные → px».
    let map = null;
    if (o.plot) {
      const P = o.plot;
      opt.layout = { x: (P.x - o.x) / o.w, y: (P.y - o.y) / o.h, w: P.w / o.w, h: P.h / o.h };
      const n = series[0].labels.length;
      const lo = o.min ?? 0;
      const hi = o.max;
      if (hi === undefined) throw new Error('chart: для plot нужен max (и min, если не 0)');
      opt.valAxisMinVal = lo;
      opt.valAxisMaxVal = hi;
      map = chartMap(kind, n, P, lo, hi);
    }
    if (o.extra) Object.assign(opt, o.extra);
    this.s.addChart(type, series, opt);
    return map;
  }

  // Отрезок любой ориентации; dash: 'dash' | 'sysDot' | 'lgDash' …
  seg(x1, y1, x2, y2, { color = C.line, width = 1.5, dash } = {}) {
    const line = { color, width: PT(width) };
    if (dash) line.dashType = dash;
    this.s.addShape(this.shapes.line, {
      x: IN(Math.min(x1, x2)), y: IN(Math.min(y1, y2)), w: IN(Math.abs(x2 - x1)), h: IN(Math.abs(y2 - y1)),
      line, flipH: (x2 < x1) !== (y2 < y1) && x1 !== x2 && y1 !== y2,
    });
  }

  // Нативная таблица PowerPoint в фирменном стиле. rows: массив строк, ячейка — строка (с **разметкой**)
  // или { text, fill, color, bold, align, colspan }. o: x, y, w, colW (массив px), rowH (px), size (px),
  // header (true — первая строка шапкой navy), headFill, zebra (true — чередование cardTint)
  table(rows, o) {
    const size = o.size ?? 16;
    const data = rows.map((r, ri) => r.map((cell) => {
      const c = typeof cell === 'object' && cell !== null && !Array.isArray(cell) ? cell : { text: cell };
      const head = o.header !== false && ri === 0;
      const opts = {
        bold: c.bold ?? head, color: c.color ?? (head ? C.white : C.blueText),
        fill: { color: c.fill ?? (head ? (o.headFill ?? C.navy) : (o.zebra && ri % 2 === 0 ? C.cardTint : C.white)) },
        align: c.align ?? (head ? 'center' : 'left'), valign: 'middle',
      };
      if (c.colspan) opts.colspan = c.colspan;
      if (c.rowspan) opts.rowspan = c.rowspan;
      return { text: parseRuns(String(c.text ?? ''), o.accent), options: opts };
    }));
    const opt = {
      x: IN(o.x), y: IN(o.y), w: IN(o.w), fontFace: FONT, fontSize: PT(size), color: C.blueText,
      border: { type: 'solid', pt: 1, color: C.line }, margin: [PT(6), PT(10), PT(6), PT(10)].map((v) => v / 72), valign: 'middle',
      autoPage: false,
    };
    if (o.colW) opt.colW = o.colW.map(IN);
    if (o.rowH) opt.rowH = Array.isArray(o.rowH) ? o.rowH.map(IN) : IN(o.rowH);
    this.s.addTable(data, opt);
  }

  // Треугольник-разделитель между шагами (►), центр в (cx, cy)
  chevron(o) {
    const w = o.w ?? 22;
    const h = o.h ?? 34;
    const rot = { right: 90, down: 180, left: 270, up: 0 }[o.dir ?? 'right'];
    const vert = rot === 90 || rot === 270;
    const bw = vert ? h : w;
    const bh = vert ? w : h;
    this.s.addShape(this.shapes.triangle, {
      x: IN(o.cx - bw / 2), y: IN(o.cy - bh / 2), w: IN(bw), h: IN(bh), fill: { color: o.color ?? C.crimson }, rotate: rot,
    });
  }

  vline(x, y, len, color = C.line, width = 1.5) {
    this.s.addShape(this.shapes.line, { x: IN(x), y: IN(y), w: 0, h: IN(len), line: { color, width: PT(width) } });
  }

  hline(x, y, len, color = C.line, width = 1.5) {
    this.s.addShape(this.shapes.line, { x: IN(x), y: IN(y), w: IN(len), h: 0, line: { color, width: PT(width) } });
  }

  // Иконка: фирменная из assets/icons (bulb, target, checklist, flow, check_circle) или 'tb:TbUsers' из react-icons
  icon(name, o) {
    // circle: цвет кружка-подложки (иконка вписывается в него с полями), например { circle: C.blue }
    if (o.circle) {
      this.circle({ x: o.x, y: o.y, d: o.size, fill: o.circle });
      const pad = Math.round(o.size * 0.22);
      return this.icon(name, { ...o, circle: undefined, x: o.x + pad, y: o.y + pad, size: o.size - pad * 2 });
    }
    const color = (o.color ?? C.white).replace('#', '');
    const bg = o.bg ? o.bg.replace('#', '') : '';
    fs.mkdirSync(CACHE, { recursive: true });
    const file = path.join(CACHE, `${name.replace(/[:/]/g, '_')}_${color}${bg ? '_' + bg : ''}.png`);
    if (!fs.existsSync(file)) {
      execFileSync(process.execPath, [path.join(__dirname, 'render_icon.js'), name, color, file, bg].filter(Boolean), { stdio: 'inherit' });
    }
    this.s.addImage({ path: file, x: IN(o.x), y: IN(o.y), w: IN(o.size), h: IN(o.size), altText: tr(o.alt ?? 'Иконка') });
  }

  image(file, o) {
    const p = path.isAbsolute(file) ? file : ASSET(file);
    const opt = { path: p, x: IN(o.x), y: IN(o.y), w: IN(o.w), h: IN(o.h), altText: tr(o.alt ?? ALT[path.basename(p)] ?? 'Изображение') };
    if (o.cover) opt.sizing = { type: 'cover', w: IN(o.w), h: IN(o.h) };
    if (o.r) opt.rounding = false;
    this.s.addImage(opt);
  }

  // Сноска внизу слайда
  footnote(text, o = {}) {
    return this.text(text, { x: o.x ?? 58, y: o.y ?? 1034, w: o.w ?? 1804, size: o.size ?? 14, lh: 1.2, color: o.color ?? C.blueText, align: o.align ?? 'left' });
  }

  notes(text) {
    this.s.addNotes(tr(text));
  }
}

// Преобразование «данные → px» для графика с заданной областью построения P (как у s.chart с plot).
// Можно вызвать до рисования графика, чтобы положить под него заливку периода.
function chartMap(kind, n, P, lo, hi) {
  const t = (v) => (v - lo) / (hi - lo);
  return kind === 'bar'
    ? { cat: (i) => P.y + (i + 0.5) * P.h / n, val: (v) => P.x + P.w * t(v), step: P.h / n, plot: P }
    : { cat: (i) => P.x + (i + 0.5) * P.w / n, val: (v) => P.y + P.h * (1 - t(v)), step: P.w / n, plot: P };
}

// Раскладка N колонок между x0 и x1 с зазором gap → массив { x, w }
function columns(n, { x0 = 58, x1 = 1862, gap = 23 } = {}) {
  const w = (x1 - x0 - gap * (n - 1)) / n;
  return Array.from({ length: n }, (_, i) => ({ x: Math.round(x0 + i * (w + gap)), w: Math.round(w) }));
}

module.exports = { setTranslator, tr, Deck, Slide, C, ACCENTS, CHART_COLORS, T, parseRuns, THEME, W, H, IN, PT, columns, countLines, textWidth, fitSize, longestWord, balanceTitle, typo, chartMap };
