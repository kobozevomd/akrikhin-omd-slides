// Рендер иконки в PNG 256×256 с прозрачным фоном.
//   node lib/render_icon.js <name> <color> <out.png> [bg]
// name: имя файла из assets/icons без .svg (фирменные иконки из фигмы, белые — перекрашиваются в color)
//       или "tb:TbTarget" — любая иконка react-icons (tb = Tabler, lu = Lucide, md = Material и т.д.)
// bg:   для check_circle — цвет кружка (по умолчанию малиновый EA2854)
'use strict';
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const [name, color, out, bg] = process.argv.slice(2);

(async () => {
  let svg;
  if (name.includes(':')) {
    const React = require('react');
    const RDS = require('react-dom/server');
    const [lib, iconName] = name.split(':');
    const Icon = require('react-icons/' + lib)[iconName];
    if (!Icon) throw new Error(`Иконка ${name} не найдена в react-icons/${lib}`);
    svg = RDS.renderToStaticMarkup(React.createElement(Icon, { size: 256, color: '#' + color }));
  } else {
    const file = path.join(__dirname, '..', 'assets', 'icons', name + '.svg');
    if (!fs.existsSync(file)) throw new Error(`Нет файла ${file}`);
    svg = fs.readFileSync(file, 'utf8')
      .replace(/(fill|stroke)="(white|#fff|#ffffff)"/gi, `$1="#${color}"`);
    if (bg) svg = svg.replace(/#EA2854/gi, '#' + bg);
  }
  await sharp(Buffer.from(svg), { density: 600 })
    .resize({ width: 256, height: 256, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(out + '.' + process.pid + '.tmp');
  fs.renameSync(out + '.' + process.pid + '.tmp', out); // атомарно: сборки могут идти параллельно
})().catch((e) => { console.error(e.message); process.exit(1); });
