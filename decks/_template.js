// Шаблон сборщика: скопировать в decks/<имя>.js, заполнить слайды, запустить `node decks/<имя>.js`.
// Правила и компоненты — в DESIGN.md.
const path = require('path');
const { Deck, C, ACCENTS, columns } = require('../lib/akrikhin');

const OUT = path.join(__dirname, '..', 'out', 'имя.pptx');

(async () => {
  const d = new Deck({ title: 'Название деки' });

  // d.cover({ title: 'Заголовок обложки' });

  {
    const s = d.slide({ title: 'Заголовок слайда,\nвторая строка' });
    columns(3, { gap: 22 }).forEach((col, i) => {
      s.card({ x: col.x, y: 221, w: col.w, h: 682 });
      s.label('Метка', { x: col.x + 33, y: 255, w: col.w - 66, color: ACCENTS[i] });
      s.heading('Заголовок карточки', { x: col.x + 33, y: 293, w: col.w - 66 });
      s.text('Текст карточки', { x: col.x + 33, y: 380, w: col.w - 66, size: 18 });
    });
    s.principle({ label: '2027 принцип', text: 'Вывод слайда в одну-две строки' });
  }

  await d.save(OUT);
})();
