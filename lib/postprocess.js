// Постобработка .pptx после pptxgenjs:
// 1) pptxgenjs пишет <a:pPr> перед каждым раном абзаца — по схеме OOXML он может быть только первым.
//    Оставляем первый, остальные удаляем (иначе PowerPoint может предложить «восстановить» файл).
// 2) Стиль заголовка в мастере: Tahoma Bold 35.25 pt белый — так новые слайды, добавленные
//    вручную из макетов в PowerPoint, сразу выглядят как в дизайн-системе.
'use strict';
const fs = require('fs');

function loadJSZip() {
  return require(require.resolve('jszip', { paths: [require.resolve('pptxgenjs')] }));
}

const PPR = /<a:pPr\b[^>]*?(?:\/>|>[\s\S]*?<\/a:pPr>)/g;

function fixParagraphs(xml) {
  return xml.replace(/<a:p>([\s\S]*?)<\/a:p>/g, (m, inner) => {
    let seen = false;
    const startsWithPPr = /^<a:pPr\b/.test(inner);
    const fixed = inner.replace(PPR, (ppr) => {
      if (!seen && startsWithPPr) { seen = true; return ppr; }
      seen = true;
      return '';
    });
    return `<a:p>${fixed}</a:p>`;
  });
}

function fixMaster(xml) {
  return xml.replace(/(<p:titleStyle>\s*<a:lvl1pPr\b[^>]*>[\s\S]*?<a:defRPr\b)([^>]*)(>)([\s\S]*?)(<\/a:defRPr>)/, (m, a, attrs, gt, body, end) => {
    const at = attrs.replace(/\ssz="\d+"/, ' sz="3525"').replace(/\sb="\d"/, '') + ' b="1"';
    const fill = body.replace(/<a:solidFill>[\s\S]*?<\/a:solidFill>/, '<a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill>');
    return a + at + gt + fill + end;
  }).replace(/(<p:titleStyle>\s*<a:lvl1pPr\b[^>]*?)algn="ctr"/, '$1algn="l"');
}

// Дубли id фигур на слайде (pptxgenjs иногда даёт видео тот же id, что у соседней фигуры) —
// PowerPoint может предложить «восстановить» файл. Фигуре, на которую не ссылается <p:timing>, даём новый id.
function fixDuplicateIds(xml) {
  const ids = [...xml.matchAll(/<p:cNvPr id="(\d+)"/g)].map((m) => +m[1]);
  const seen = new Set();
  const dups = new Set(ids.filter((i) => (seen.has(i) ? true : (seen.add(i), false))));
  if (!dups.size) return xml;
  const timed = new Set([...xml.matchAll(/spid="(\d+)"/g)].map((m) => +m[1]));
  let next = Math.max(...ids) + 1;
  const used = new Map();
  return xml.replace(/(<p:(?:sp|pic|graphicFrame|grpSp|cxnSp)>\s*<p:nv\w+Pr>\s*<p:cNvPr id=")(\d+)(")([\s\S]*?)(?=<\/p:nv)/g, (m, a, id, b, rest) => {
    const n = +id;
    if (!dups.has(n)) return m;
    const k = (used.get(n) || 0) + 1;
    used.set(n, k);
    const isMedia = /<a:videoFile|<p14:media|<a:audioFile/.test(rest);
    // оставляем исходный id той фигуре, на которую ссылается timing (обычно видео), остальным — новый
    const keep = timed.has(n) ? isMedia : k === 1;
    return keep ? m : a + next++ + b + rest;
  });
}

// Обрезка видео/картинки как в исходнике: pptxgenjs не умеет srcRect у медиа, поэтому сборка помечает имя фигуры
// « ⟦crop:t,b,l,r⟧» (доли в 1/1000 %, как в OOXML), а здесь метка убирается и в blipFill ставится <a:srcRect>.
function applyCrops(xml) {
  return xml.replace(/<p:pic>[\s\S]*?<\/p:pic>/g, (pic) => {
    const m = pic.match(/ ⟦crop:(\d+),(\d+),(\d+),(\d+)⟧/);
    if (!m) return pic;
    const [, t, b, l, r] = m;
    const rect = `<a:srcRect${+l ? ` l="${l}"` : ''}${+t ? ` t="${t}"` : ''}${+r ? ` r="${r}"` : ''}${+b ? ` b="${b}"` : ''}/>`;
    let out = pic.replace(m[0], '');
    if (!/<a:srcRect\b/.test(out)) out = out.replace(/(<p:blipFill>[\s\S]*?)(<a:stretch>)/, `$1${rect}$2`);
    return out;
  });
}

async function postprocess(file) {
  const JSZip = loadJSZip();
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const names = Object.keys(zip.files).filter((n) => /^ppt\/(slides|slideLayouts)\/[^/]+\.xml$/.test(n));
  for (const n of names) {
    const xml = await zip.file(n).async('string');
    const fixed = applyCrops(fixDuplicateIds(fixParagraphs(xml)));
    if (fixed !== xml) zip.file(n, fixed);
  }
  // AVI из исходников: pptxgenjs пишет тип video/avi, PowerPoint ждёт video/x-msvideo.
  // Заодно убираем Override на несуществующие части (pptxgenjs пишет лишние slideMasterN).
  const ct = zip.file('[Content_Types].xml');
  if (ct) {
    const xml = await ct.async('string');
    const fixed = xml.replace(/(<Default Extension="avi" ContentType=")video\/avi(")/, '$1video/x-msvideo$2')
      .replace(/<Override PartName="\/([^"]+)"[^>]*\/>/g, (m, part) => (zip.file(part) ? m : ''));
    if (fixed !== xml) zip.file('[Content_Types].xml', fixed);
  }
  const master = 'ppt/slideMasters/slideMaster1.xml';
  if (zip.file(master)) {
    const xml = await zip.file(master).async('string');
    zip.file(master, fixMaster(xml));
  }
  const buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(file, buf);
}

module.exports = { postprocess, fixParagraphs };
