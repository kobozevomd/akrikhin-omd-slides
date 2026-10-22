// Дека «Comprehensive 2027» (черновик Романа «Comprehensive draft_2027_на доработку (2).pptx», 49 слайдов),
// пересобранная в дизайн-системе. Обложки и разделители — здесь, содержательные слайды — в decks/comprehensive/part_*.js.
//   node decks/comprehensive.js            → ../Comprehensive_2027_Акрихин.pptx
const path = require('path');
const fs = require('fs');
const { Deck } = require('../lib/akrikhin');

const OUT = path.join(__dirname, '..', '..', 'Comprehensive_2027_Акрихин.pptx');
const PARTS_DIR = path.join(__dirname, 'comprehensive');
const VARIANTS_DIR = path.join(__dirname, 'variants');
// Новые варианты содержательных слайдов (аудит после пересборки): идут СРАЗУ ПОСЛЕ исходного слайда,
// в заметках подписано «исходная версия» / «новый вариант». --no-redesign — без них.
const REDESIGN_DIR = path.join(__dirname, 'redesign');

// Слайды с данными 2–15: вместо исходной версии в деку идут все варианты визуала из decks/variants
// (А/Б/В подписаны внизу справа). Когда Роман выберет, оставить здесь только выбранные:
// например PICK = { 6: ['A'], 7: ['B'] }. Без записи в PICK — все варианты. --no-variants — исходные версии.
const PICK = {};

// Слайды без содержательной части: обложки и разделители разделов
const FRAME = {
  1: (d) => { d.section('Market Trends 2027: Consumer'); d.cover({ title: 'Market Trends 2027\nConsumer', size: 118 }); },
  8: (d) => { d.section('Market Trends 2027: Media'); d.divider({ kicker: 'Market Trends 2027', title: 'Media' }); },
  16: (d) => { d.section('Akrikhin + OMD 2027'); d.cover({ title: 'From market trends to Akrikhin+OMD actions in 2027' }); },
  20: (d) => { d.section('Transformation'); d.divider({ kicker: 'Comprehensive approach 2027', title: 'Transformation' }); },
  23: (d) => { d.section('Audience Intelligence'); d.divider({ title: 'Audience Intelligence' }); },
  27: (d) => { d.section('AI Visibility ecosystem'); d.divider({ title: 'AI Visibility ecosystem' }); },
  32: (d) => { d.section('Personalized Production'); d.divider({ title: 'Personalized Production' }); },
  38: (d) => { d.section('AI Analytics'); d.divider({ title: 'AI Analytics' }); },
  43: (d) => { d.section('Systemization & Scale'); d.divider({ title: 'Systemization & Scale' }); },
};

(async () => {
  const builders = { ...FRAME };
  const framesOnly = process.argv.includes('--frames-only');
  for (const f of framesOnly ? [] : fs.readdirSync(PARTS_DIR).filter((f) => /^part_[a-z]\.js$/.test(f)).sort()) {
    const part = require(path.join(PARTS_DIR, f));
    for (const [n, fn] of Object.entries(part)) {
      if (builders[n]) throw new Error(`Слайд ${n} собирается дважды (${f})`);
      builders[n] = fn;
    }
  }
  const variants = {};
  if (!process.argv.includes('--no-variants') && !framesOnly) {
    for (const f of fs.readdirSync(VARIANTS_DIR).filter((f) => /^v\d.*\.js$/.test(f)).sort()) {
      Object.assign(variants, require(path.join(VARIANTS_DIR, f)));
    }
  }
  const redesign = {};
  if (!process.argv.includes('--no-redesign') && !framesOnly) {
    for (const f of fs.readdirSync(REDESIGN_DIR).filter((f) => /^r\d.*\.js$/.test(f)).sort()) {
      Object.assign(redesign, require(path.join(REDESIGN_DIR, f)));
    }
  }
  const d = new Deck({ title: 'Comprehensive 2027 — Акрихин × OMD' });
  const missing = [];
  for (let n = 1; n <= 49; n++) {
    if (variants[n]) {
      const letters = 'ABC';
      variants[n].forEach((fn, i) => { if (!PICK[n] || PICK[n].includes(letters[i])) fn(d); });
    } else if (builders[n]) {
      builders[n](d);
      if (redesign[n]) {
        d.pres.slides[d.pres.slides.length - 1].addNotes(`Слайд ${n} · исходная версия (новый вариант — следующим${redesign[n].length > 1 ? ' слайдами' : ' слайдом'})`);
        redesign[n].forEach((fn) => fn(d));
      }
    } else missing.push(n);
  }
  if (missing.length) console.warn('Нет сборщика для слайдов: ' + missing.join(', '));
  const outArg = process.argv.slice(2).find((a) => !a.startsWith('--'));
  await d.save(outArg ? path.resolve(outArg) : OUT);
})();
