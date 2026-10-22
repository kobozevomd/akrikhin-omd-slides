// Проверка одного файла новых вариантов: node decks/redesign/run.js r25_31
// Собирает исходные слайды и их новые варианты парами → out/redesign_<имя>.pptx
const path = require('path');
const fs = require('fs');
const { Deck } = require('../../lib/akrikhin');

(async () => {
  const name = process.argv[2];
  const mod = require(path.join(__dirname, name + '.js'));
  const parts = {};
  const PD = path.join(__dirname, '..', 'comprehensive');
  for (const f of fs.readdirSync(PD).filter((f) => /^part_[a-z]\.js$/.test(f))) Object.assign(parts, require(path.join(PD, f)));
  const d = new Deck({ title: 'Новые варианты — ' + name });
  for (const n of Object.keys(mod).map(Number).sort((a, b) => a - b)) {
    if (parts[n]) parts[n](d);
    mod[n].forEach((fn) => fn(d));
  }
  await d.save(path.join(__dirname, '..', '..', 'out', 'redesign_' + name + '.pptx'));
})();
