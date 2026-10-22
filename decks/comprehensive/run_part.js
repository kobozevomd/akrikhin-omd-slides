// Сборка одной части деки Comprehensive для проверки: node decks/comprehensive/run_part.js part_c
// Часть — модуль { [номер слайда черновика]: (d) => { ...один слайд... } }; слайды идут по возрастанию номеров.
const path = require('path');
const { Deck } = require('../../lib/akrikhin');

(async () => {
  const name = process.argv[2];
  const part = require(path.join(__dirname, name + '.js'));
  const d = new Deck({ title: 'Comprehensive 2027 — ' + name });
  Object.keys(part).map(Number).sort((a, b) => a - b).forEach((n) => part[n](d));
  await d.save(path.join(__dirname, '..', '..', 'out', 'comp_' + name + '.pptx'));
})();
