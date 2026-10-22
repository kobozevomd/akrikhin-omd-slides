// Все варианты слайдов 2–15 деки Comprehensive в одной презентации — для выбора.
// По каждому слайду: сначала текущая версия из деки, потом варианты. Каждый слайд — свой раздел.
//   node decks/variants_all.js            → ../Comprehensive_2027_варианты_2-15.pptx
//   node decks/variants_all.js v06_07     → только один модуль (для проверки) → out/варианты_v06_07.pptx
const path = require('path');
const fs = require('fs');
const { Deck, C } = require('../lib/akrikhin');

const VDIR = path.join(__dirname, 'variants');
const PARTS = path.join(__dirname, 'comprehensive');

// текущая версия слайда n — из part-файлов основной деки
function currentBuilder(n) {
  for (const f of fs.readdirSync(PARTS).filter((f) => /^part_[a-z]\.js$/.test(f))) {
    const part = require(path.join(PARTS, f));
    if (part[n]) return part[n];
  }
  return null;
}

(async () => {
  const only = process.argv[2];
  const files = fs.readdirSync(VDIR).filter((f) => /^v\d.*\.js$/.test(f) && (!only || f === only + '.js')).sort();
  const variants = {};
  for (const f of files) Object.assign(variants, require(path.join(VDIR, f)));
  const d = new Deck({ title: 'Comprehensive 2027 — варианты слайдов 2–15' });
  const nums = Object.keys(variants).map(Number).sort((a, b) => a - b);
  for (const n of nums) {
    d.section(`Слайд ${n}`);
    const cur = currentBuilder(n);
    if (cur && !only) {
      cur(d);
      const sl = d.pres.slides[d.pres.slides.length - 1];
      sl.addNotes(`Слайд ${n} · сейчас в деке`);
    }
    variants[n].forEach((fn) => fn(d));
  }
  const out = only ? path.join(__dirname, '..', 'out', `варианты_${only}.pptx`)
    : path.join(__dirname, '..', '..', 'Comprehensive_2027_варианты_2-15.pptx');
  await d.save(out);
})();
