// Динобутин · стратегия 2027 — общие помощники для part_*.js
const path = require('path');
const { execFileSync } = require('child_process');
const { C, IN, PT, tr } = require('../../../lib/akrikhin');

const ROOT = path.join(__dirname, '..', '..', '..');
const SRC = path.join(ROOT, 'work', 'brands', 'dinobutin', 'src');
const MEDIA = path.join(SRC, 'media');
const CROPS = path.join(SRC, 'crops');
const SOURCE_PPTX = path.join(ROOT, 'work', 'brands', 'dinobutin', 'source.pptx');

// файл из исходного .pptx (видео и их обложки не выгружены в media/)
function fromSource(entry) {
  return execFileSync('unzip', ['-p', SOURCE_PPTX, entry], { maxBuffer: 256 * 1024 * 1024 });
}

// Этапы стратегии 2027 — вертикальная метка у левого края слайда (как в исходнике), цвета как на архитектуре кампании
const STAGE = { EXPAND: C.cyan, SPRINT: C.crimson, FREQUENCY: C.navy };
const TAG_W = 30;
// Вертикальная полоса этапа: x 0…30, по высоте контента (221…1005). Контент слайда начинается, как обычно, с x = 58.
function stageTag(s, stage, { y0 = 221, y1 = 1005 } = {}) {
  const color = STAGE[stage];
  if (!color) throw new Error('stageTag: неизвестный этап ' + stage);
  s.box({ x: 0, y: y0, w: TAG_W, h: y1 - y0, fill: color, r: 0 });
  const len = y1 - y0;
  s.s.addText(tr(stage), {
    x: IN(TAG_W / 2 - len / 2), y: IN((y0 + y1) / 2 - TAG_W / 2), w: IN(len), h: IN(TAG_W),
    rotate: 270, fontFace: 'Tahoma', fontSize: PT(16), bold: true, color: C.white, charSpacing: 2,
    align: 'center', valign: 'middle', margin: 0, isTextBox: true, fit: 'none', objectName: 'Stage',
  });
}

// Встроить видео из исходника без изменений: тот же mp4 и та же обложка.
// crop — обрезка кадра как в исходнике ({ t, b, l, r } в 1/1000 %, из <a:srcRect>); w/h задавай по обрезанной пропорции.
function video(s, { media, cover, x, y, w, h, name, crop }) {
  const ext = path.extname(cover).slice(1).replace('jpeg', 'jpg');
  const mime = ext === 'jpg' ? 'jpeg' : ext;
  s.s.addMedia({
    type: 'video', extn: 'mp4',
    data: 'video/mp4;base64,' + fromSource('ppt/media/' + media).toString('base64'),
    cover: `data:image/${mime};base64,` + fromSource('ppt/media/' + cover).toString('base64'),
    x: IN(x), y: IN(y), w: IN(w), h: IN(h),
    objectName: tr(name) + (crop ? ` ⟦crop:${crop.t ?? 0},${crop.b ?? 0},${crop.l ?? 0},${crop.r ?? 0}⟧` : ''),
  });
}

module.exports = { SRC, MEDIA, CROPS, SOURCE_PPTX, fromSource, STAGE, TAG_W, stageTag, video };
