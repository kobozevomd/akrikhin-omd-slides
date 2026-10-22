// Сборка деки стратегии бренда Акрихин (RU / EN) из decks/brands/<brand>/part_*.js.
//   node decks/brands/build.js <brand>                 → <outDir>/<file>_RU.pptx
//   node decks/brands/build.js <brand> --lang en       → <outDir>/<file>_EN.pptx (переводы: work/brands/<brand>/en.json)
// outDir — папка готовых дек: из local.json в корне ({ "outDir": "…" }, путь от корня), по умолчанию output/
//   node decks/brands/build.js <brand> --record        → RU + work/brands/<brand>/strings_ru.json (все строки для перевода)
//   node decks/brands/build.js <brand> --part part_a   → только одна часть → out/brand_<brand>_part_a.pptx (для проверки)
//   --out <путь> — куда сохранить; в EN-сборке строки без перевода пишутся в work/brands/<brand>/tr/missing.json
// Часть — модуль { [номер слайда исходника]: (d) => { ...слайды... } }; слайды идут по возрастанию номеров.
// brand.json: { "name": "Acriol PRO", "file": "Akrikhin_OMD_Strategy_Acriol_PRO_2027", "slides": 23 [, "title": "свойство «Название» файла", "title_en": "то же для EN"] }
// Годится для любой деки в стиле Акрихин, не только стратегий брендов: slug — любое латинское имя папки.
const path = require('path');
const fs = require('fs');
const L = require('../../lib/akrikhin');

const ROOT = path.join(__dirname, '..', '..');
// папка готовых дек: local.json (не в git) → { "outDir": "..", … }; по умолчанию <корень>/output
function outDir() {
  let dir = 'output';
  const lp = path.join(ROOT, 'local.json');
  if (fs.existsSync(lp)) dir = JSON.parse(fs.readFileSync(lp, 'utf8')).outDir || dir;
  const abs = path.resolve(ROOT, dir);
  fs.mkdirSync(abs, { recursive: true });
  return abs;
}
const CYR = /[А-Яа-яЁё]/;

// Числа для английской версии: 3,44 → 3.44; 2 251 → 2,251
function enNumbers(s) {
  return s.replace(/(?<=\d),(?=\d{1,2}(?!\d))/g, '.').replace(/(?<=\d)[  ](?=\d{3}(?!\d))/g, ',');
}

(async () => {
  const args = process.argv.slice(2);
  const brand = args[0];
  const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
  const lang = opt('--lang') || 'ru';
  const record = args.includes('--record');
  const onlyPart = opt('--part');
  const BD = path.join(__dirname, brand);
  const WD = path.join(ROOT, 'work', 'brands', brand);
  const cfg = JSON.parse(fs.readFileSync(path.join(BD, 'brand.json'), 'utf8'));

  let current = 0;
  const seen = new Map();
  const missing = new Map();
  if (record) {
    // варианты одной строки с другими переносами/неразрывными пробелами (после балансировки заголовка) не дублируем
    const norm = (s) => s.replace(/[\u00a0\n]+/g, ' ').replace(/\s+/g, ' ').trim();
    const seenNorm = new Set();
    L.setTranslator((s) => {
      if ((CYR.test(s) || /\d,\d/.test(s)) && !seen.has(s) && !seenNorm.has(norm(s))) { seen.set(s, current); seenNorm.add(norm(s)); }
      return s;
    });
  }
  if (lang === 'en') {
    const map = JSON.parse(fs.readFileSync(path.join(WD, 'en.json'), 'utf8'));
    // служебные строки библиотеки (подписи картинок для экранного чтения, классификация на обложке)
    // название файла (свойства документа): стандартное — переводим сами; своё — brand.json "title_en"
    const defTitle = `${cfg.name} — стратегия 2027 · Акрихин × OMD`;
    map[cfg.title || defTitle] = map[cfg.title || defTitle] || cfg.title_en || (cfg.title ? undefined : `${cfg.name} — 2027 strategy · Akrikhin × OMD`);
    if (map[cfg.title || defTitle] === undefined) delete map[cfg.title || defTitle];
    Object.assign(map, { 'Знак Акрихин': 'Akrikhin mark', 'Изображение': 'Image', 'Иконка': 'Icon', 'Акрихин + OMD': 'Akrikhin + OMD', 'Акрихин': 'Akrikhin',
      'Классификация документа: конфиденциальная информация для внутреннего использования': 'Document classification: confidential, for internal use only' }, { ...map });
    // запасной поиск без учёта неразрывных пробелов и переносов: типографские правки RU после перевода не теряют строку
    const norm = (s) => s.replace(/[ \n]+/g, ' ').replace(/\s+/g, ' ').trim();
    const byNorm = new Map(Object.entries(map).map(([k, v]) => [norm(k), v]));
    L.setTranslator((s) => {
      if (Object.prototype.hasOwnProperty.call(map, s)) return enNumbers(map[s]);
      if (byNorm.has(norm(s))) {
        // пробелы по краям сохраняем: « млн ₽» после числа должно остаться « RUB M», а не склеиться
        const lead = s.match(/^[ \u00a0]*/)[0];
        const trail = s.match(/[ \u00a0]*$/)[0];
        return lead + enNumbers(byNorm.get(norm(s))).trim() + trail;
      }
      const out = enNumbers(s);
      if (CYR.test(out) && !missing.has(s)) missing.set(s, current);
      return out;
    });
  }

  const builders = {};
  const parts = fs.readdirSync(BD).filter((f) => /^part_[a-z]\.js$/.test(f) && (!onlyPart || f === onlyPart + '.js')).sort();
  for (const f of parts) {
    const part = require(path.join(BD, f));
    for (const [n, fn] of Object.entries(part)) {
      if (builders[n]) throw new Error(`Слайд ${n} собирается дважды (${f})`);
      builders[n] = fn;
    }
  }
  const d = new L.Deck({ title: cfg.title || `${cfg.name} — стратегия 2027 · Акрихин × OMD`, pageNumbers: true, uniformPlaques: true });
  const nums = Object.keys(builders).map(Number).sort((a, b) => a - b);
  if (!onlyPart) {
    const miss = [];
    for (let n = 1; n <= cfg.slides; n++) if (!builders[n]) miss.push(n);
    if (miss.length) console.warn('Нет сборщика для слайдов исходника: ' + miss.join(', '));
  }
  for (const n of nums) {
    current = n;
    builders[n](d);
  }

  const suffix = lang === 'en' ? 'EN' : 'RU';
  const out = onlyPart
    ? path.join(ROOT, 'out', `brand_${brand}_${onlyPart}${lang === 'en' ? '_en' : ''}.pptx`)
    : path.join(outDir(), `${cfg.file}_${suffix}.pptx`);
  await d.save(opt('--out') ? path.resolve(opt('--out')) : out);

  if (record) {
    const list = [...seen.entries()].map(([ru, slide]) => ({ slide, ru }));
    fs.writeFileSync(path.join(WD, 'strings_ru.json'), JSON.stringify(list, null, 1));
    console.log(`строк для перевода: ${list.length} → work/brands/${brand}/strings_ru.json`);
  }
  if (lang === 'en') {
    // полный список для tools/en_missing.py (подсказки перевода изменённых строк); пусто — файл убираем
    const mp = path.join(WD, 'tr', 'missing.json');
    if (missing.size) fs.writeFileSync(mp, JSON.stringify([...missing.entries()].map(([ru, slide]) => ({ slide, ru })), null, 1));
    else if (fs.existsSync(mp)) fs.unlinkSync(mp);
  }
  if (missing.size) {
    console.warn(`\n⚠ Без перевода (${missing.size}) → work/brands/${brand}/tr/missing.json:`);
    [...missing.entries()].slice(0, 40).forEach(([s, n]) => console.warn(`  слайд ${n}: ${s.slice(0, 90)}`));
  }
})();
