// Боботик · стратегия 2027 — часть D: слайды исходника 16–20 (все — картинка во весь слайд, пересобраны живым текстом).
// 16 — детская аптечка и средства от колик (скрытый): три строки «тема → факты»;
// 17 — короткое окно релевантности: таймлайн первого года + Core 2027 / Test / Stop-parked;
// 18 — корректировка креативной стратегии: что поменяли в 2026 → новые vs старый креатив (таблица теста) → инсайты 2027;
// 19 — календарь 2027: гант по месяцам (Always on core / Sprint 1 / Decision gate / Sprint 2) + три «почему»;
// 20 — путь мамы и четыре роли инвестиций (27 / 20 / 10 / 43%).
// Ориентир — итоговый рендер исходника: картинка лежит поверх живого текста, видимый текст — тот, что на картинке.
const path = require('path');
const { C, columns, countLines, textWidth, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT
const B = require('./common');                            // SRC, MEDIA, CROPS

const TOP = V.TOP;   // 221 — верх контента
const BOT = V.BOT;   // 1005 — низ контента без плашки
const CB = 905;      // низ контента над плашкой
const X0 = 58;
const X1 = 1862;
const GOLD = C.orange;   // Test / Decision gate — оранжевый, как в исходнике

// ---------- Локальные хелперы ----------
// Строка так, как её увидит слайд (перевод + типографика), без разметки
const view = (t) => typo(tr(String(t))).replace(/\*\*|\[\[|\]\]/g, '');
// Высота текста так же, как её оценивает s.text
const measure = (t, w, size = 18, bold = false, lh = 1.2) => Math.round(countLines(view(t), size, w, bold) * size * lh);
const widthOf = (t, size, bold = false) => Math.ceil(textWidth(view(t), size, bold));
// Ширина блока, при которой текст занимает столько же строк, но строки ровнее (без висящего последнего слова)
const evenW = (t, w, size, bold = false) => {
  const lines = (ww) => countLines(view(t), size, ww, bold);
  const n = lines(w);
  if (n < 2) return w;
  let lo = w * 0.4;
  let hi = w;
  while (hi - lo > 1) { const m = (lo + hi) / 2; if (lines(m) <= n) hi = m; else lo = m; }
  return Math.min(w, Math.ceil(hi * 1.04) + 6);   // запас на разницу переносов PowerPoint / LibreOffice
};
// Сколько слов окажется в последней строке (тот же жадный перенос, что в countLines)
const lastWords = (t, size, w, bold = false) => {
  const max = w * 0.97;
  const sp = textWidth(' ', size, bold);
  let cur = 0;
  let n = 0;
  view(t).split(/\n\n?/).pop().split(/ /).forEach((word) => {
    if (!word) return;
    const ww = textWidth(word, size, bold);
    if (cur === 0) { cur = ww; n = 1; } else if (cur + sp + ww <= max) { cur += sp + ww; n += 1; } else { cur = ww; n = 1; }
    while (cur > max) cur -= max;
  });
  return n;
};
// Ширина без висящего слова: сужаем блок, только если последняя строка — одно слово
const noWidow = (t, w, size, bold = false) =>
  (countLines(view(t), size, w, bold) > 1 && lastWords(t, size, w, bold) === 1 ? evenW(t, w, size, bold) : w);
// Смешение цвета с белым: k = 0 — белый, 1 — исходный цвет
function tintOf(hex, k) {
  const c = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return c.map((v) => Math.round(255 + (v - 255) * k).toString(16).padStart(2, '0')).join('').toUpperCase();
}

// Заголовок колонки-карточки: кружок с номером + заголовок; возвращает y под ним
function colHead(s, { x, y, w, n, title, color = C.blue }) {
  s.badge({ x, y, d: 46, n, color, size: 24 });
  s.text(title, { x: x + 46 + 16, y, w: w - 62, h: 46, size: 26, bold: true, lh: 1.0, color: C.navy, valign: 'middle',
    fit: true, maxLines: 1, minSize: 20 });
  return y + 46;
}

// Цвета оккейженов (слайд 18): колики — малиновый, кормление — голубой, сон — фиолетовый (как в исходнике)
const OCC = { colic: C.crimson, feed: C.cyan, sleep: C.purple };
// Цвет текста для оккейженов: голубой на белом слишком светлый — для текста берём teal
const ink = (c) => (c === C.cyan ? C.teal : c);

module.exports = {
  // =====================================================================
  // 16 · Детская аптечка и средства от колик (скрытый в исходнике)
  // =====================================================================
  16: (d) => {
    const s = d.slide({ title: 'Привычка делать детскую аптечку есть, но для средств от колик она прослеживается реже' });
    s.s.hidden = true;
    const ROWS = [
      { icon: 'tb:TbFirstAidKit', color: C.blue, title: 'Аптечка дома',
        text: 'Только у **~7%** нет детской аптечки, **52%** хранят детские средства вместе со взрослой аптечкой, еще **41%** имеют отдельную детскую. При формировании аптечки **80%** ориентируются на врача, **69%** дополнительно используют интернет, **65%** — поиск. Основа аптечки по рекомендациям и отзывам — жаропонижающие, антигистаминные и энтеросорбенты.' },
      { icon: 'tb:TbBabyBottle', color: C.crimson, title: 'Аптечка против газиков', tint: true,
        text: 'Небольшая доля мам действительно собирают аптечку заранее **~15%**. Но что важно: в ветках обсуждений вырисовывается следующий паттерн рекомендаций — [[**«не покупайте лишнего заранее — докупите по необходимости»**]]. Причины очень практичные: колик может не быть, конкретное средство может не подойти, заранее невозможно угадать, что поможет именно этому ребенку, а аптека/e-com обычно доступны быстро.' },
      { icon: 'tb:TbHomeHeart', color: C.blue, title: 'Под рукой',
        text: 'В нашей категории это чаще происходит после знакомства с проблемой или продуктом. Например: колики начались, мама нашла средство, которое ребенку подходит, после этого его уже логично держать дома и не оставаться без него ночью.' },
    ];
    // строки без коробок, разделены линиями; строка про колики (главная мысль) — выделенная карточка
    const LW = 360;                 // левая зона: иконка + тема
    const TX = X0 + LW + 36;        // текст справа от разделителя
    const TW = X1 - 48 - TX;
    const FS = 24;
    const ID = 72;
    const need = ROWS.map((r) => Math.max(ID + 16 + measure(r.title, LW - 72, 30, true, 1.1), measure(r.text, TW, FS, false, 1.3)));
    const GAP = 16;
    const extra = (BOT - TOP - GAP * (ROWS.length - 1) - need.reduce((a, b) => a + b, 0)) / ROWS.length;
    let y = TOP;
    ROWS.forEach((r, i) => {
      const RH = need[i] + extra;
      if (r.tint) s.card({ x: X0, y, w: X1 - X0, h: RH, fill: tintOf(C.crimson, 0.05), stroke: tintOf(C.crimson, 0.3) });
      else if (i > 0 && !ROWS[i - 1].tint) s.hline(X0, y - GAP / 2, X1 - X0, C.line, 2);
      // тема: иконка в кружке + заголовок, по центру строки по вертикали
      const th = measure(r.title, LW - 72, 30, true, 1.1);
      const bh = ID + 16 + th;
      const by = y + (RH - bh) / 2;
      s.icon(r.icon, { x: X0 + 36, y: by, size: ID, circle: r.color });
      s.text(r.title, { x: X0 + 36, y: by + ID + 16, w: LW - 72, size: 30, bold: true, lh: 1.1, color: r.tint ? C.crimson : C.navy });
      s.vline(X0 + LW, y + 28, RH - 56, r.tint ? tintOf(C.crimson, 0.3) : C.line, 2);
      const h = measure(r.text, TW, FS, false, 1.3);
      s.text(r.text, { x: TX, y: y + (RH - h) / 2, w: evenW(r.text, TW, FS), size: FS, lh: 1.3, color: C.navy });
      y += RH + GAP;
    });
  },

  // =====================================================================
  // 17 · Короткое окно релевантности выбора
  // =====================================================================
  17: (d) => {
    const s = d.slide({
      title: 'Короткое окно релевантности выбора',
      subtitle: 'Мы должны находить маму максимально близко к моменту возникновения колик, а не просто охватывать широкую аудиторию родителей детей до года',
    });
    // главная мысль
    const lead = 'Чем короче окно релевантности, тем дороже ошибка в выборе аудитории.\n[[Точность таргетинга становится бизнес-фактором]]';
    const lh = s.text(lead, { x: X0, y: TOP, w: X1 - X0, size: 30, bold: true, lh: 1.2, color: C.navy });

    // Core / Test / Stop — карточки внизу по высоте текста, таймлайн занимает остальное
    const CARDS = [
      { icon: 'tb:TbUsers', color: C.blue, label: 'Core 2027',
        text: 'Мамы детей первого года жизни с релевантными оккейженами. «Только первенцы» убираем как фильтр; мамы с первенцами остаются внутри пула' },
      { icon: 'tb:TbChartBar', color: GOLD, label: 'Test',
        text: 'Сравниваем 0–6/8 мес. vs 0–12 мес. по reach, CPM, post-click и CR%. Возрастную рамку 2027 фиксируем по результатам 1-го теста.' },
      { icon: 'tb:TbCircleMinus', color: C.crimson, label: 'Stop / Parked',
        text: 'Беременность — не развиваем. Для старших детей внутри первого года — отдельное сообщение' },
    ];
    const kcols = columns(3, { gap: 22 });
    const KP = 34;           // внутренний отступ карточки
    const KI = 60;           // иконка
    const KFS = 22;
    const ktw = kcols[0].w - KP * 2;
    const KH = KP + KI + 22 + Math.max(...CARDS.map((k) => measure(k.text, ktw, KFS, false, 1.25))) + KP;
    const KY = BOT - KH;

    // таймлайн первого года
    const PTS = [
      { label: 'Рождение', text: 'аудитория обновляется' },
      { label: 'Первые недели', text: 'не у всех есть проблема' },
      { label: 'Окно колик', text: 'максимальная релевантность', hl: true },
      { label: '6–8 мес.', text: 'узкий таргетинг\ntest' },
      { label: 'До 12 мес.', text: 'расширенный пул\nrelevance test' },
    ];
    const cols = columns(5, { gap: 20 });
    const T0 = TOP + lh + 34;       // верх полосы таймлайна
    const T1 = KY - 34;             // низ полосы
    const CH = 84;                  // подписи под маркерами
    const HALO = 76;
    const LS = 26;                  // кегль названий этапов
    const free = T1 - T0 - 32 - LS * 1.1 - HALO - CH - 28;   // распределяем по двум промежуткам
    const LY = T0 + 32;
    const MY = LY + LS * 1.1 + free / 2 + HALO / 2;
    const CY = MY + HALO / 2 + free / 2;
    // окно колик — подсветка столбца
    const hl = cols[2];
    s.box({ x: hl.x, y: T0, w: hl.w, h: T1 - T0, fill: tintOf(C.crimson, 0.07), stroke: tintOf(C.crimson, 0.35), sw: 1.5, r: 20 });
    // линия
    s.box({ x: cols[0].x + cols[0].w / 2, y: MY - 4, w: cols[4].x + cols[4].w / 2 - (cols[0].x + cols[0].w / 2), h: 8, fill: C.line, r: 4 });
    PTS.forEach((p, i) => {
      const c = cols[i];
      const cx = c.x + c.w / 2;
      const col = p.hl ? C.crimson : C.blue;
      s.text(p.label.toUpperCase(), { x: c.x + 10, y: LY, w: c.w - 20, size: LS, bold: true, lh: 1.1, color: p.hl ? C.crimson : C.navy,
        align: 'center', fit: true, maxLines: 1, minSize: 18 });
      s.vline(cx, MY, CY - MY, p.hl ? tintOf(C.crimson, 0.45) : C.line, 2);
      s.circle({ x: cx - HALO / 2, y: MY - HALO / 2, d: HALO, fill: tintOf(col, 0.16) });
      s.box({ x: cx - 21, y: MY - 21, w: 42, h: 42, fill: col, r: 10 });
      s.box({ x: c.x + 20, y: CY, w: c.w - 40, h: CH, fill: C.white, stroke: p.hl ? tintOf(C.crimson, 0.35) : C.line, sw: 1.5, r: 14 });
      s.text(p.text, { x: c.x + 30, y: CY, w: c.w - 60, h: CH, size: 21, lh: 1.2, color: p.hl ? C.crimson : C.navy, bold: !!p.hl,
        align: 'center', valign: 'middle', fit: true, minSize: 16 });
    });

    kcols.forEach((c, i) => {
      const k = CARDS[i];
      s.card({ x: c.x, y: KY, w: c.w, h: KH });
      s.icon(k.icon, { x: c.x + KP, y: KY + KP, size: KI, circle: k.color });
      s.text(k.label.toUpperCase(), { x: c.x + KP + KI + 20, y: KY + KP, w: c.w - KP * 2 - KI - 20, h: KI, size: 30, bold: true, lh: 1.0,
        color: k.color, valign: 'middle', fit: true, maxLines: 1, minSize: 20 });
      s.text(k.text, { x: c.x + KP, y: KY + KP + KI + 22, w: evenW(k.text, ktw, KFS), size: KFS, lh: 1.25, color: C.navy });
    });
  },

  // =====================================================================
  // 18 · Корректировка креативной стратегии (весь текст был только в картинке)
  // =====================================================================
  18: (d) => {
    const s = d.slide({
      title: 'Боботик 2027: корректировка креативной стратегии',
      subtitle: 'В 2026 году в рамках креативной концепции был рекомендован уход от феи как главного сюжета к рациональной персонализации под ситуацию.',
    });
    const lead = '**Тест показал:** разные оккейжены решают разные задачи воронки — поэтому в 2027 [[**не меняем всё сразу**]], а точечно [[**усиливаем визуальные связки**]]';
    const lh = s.text(lead, { x: X0, y: TOP - 4, w: X1 - X0, size: 22, lh: 1.2, color: C.navy });
    const CY0 = TOP + lh + 16;
    const CH = 1012 - CY0;
    const cols = columns(3, { gap: 22 });
    const PAD = 24;
    const FS = 17;   // основной кегль внутри колонок

    // ---------- 1 · Что поменяли в 2026 ----------
    {
      const c = cols[0];
      const x = c.x + PAD;
      const w = c.w - PAD * 2;
      s.card({ x: c.x, y: CY0, w: c.w, h: CH });
      let y = colHead(s, { x, y: CY0 + 20, w, n: 1, title: 'Что поменяли в 2026' }) + 18;
      // было → стало
      const AW = 44;
      const bw = (w - AW) / 2;
      const was = 'Фея как эмоциональный бренд-код';
      const now = 'Рациональные УТП + ситуация применения';
      const bh = 14 + 20 + 6 + Math.max(measure(was, bw - 28, FS), measure(now, bw - 28, FS)) + 14;
      s.box({ x, y, w: bw, h: bh, fill: tintOf(C.crimson, 0.09), r: 14 });
      s.text('БЫЛО', { x: x + 14, y: y + 14, w: bw - 28, size: 18, bold: true, lh: 1.1, color: C.crimson });
      s.text(was, { x: x + 14, y: y + 40, w: bw - 28, size: FS, lh: 1.2, color: C.navy });
      s.arrow({ dir: 'right', x: x + bw + 8, y: y + bh / 2, len: AW - 16, head: 22, headLen: 12, stem: 4, color: C.navy });
      s.box({ x: x + bw + AW, y, w: bw, h: bh, fill: C.cardTint, r: 14 });
      s.text('СТАЛО', { x: x + bw + AW + 14, y: y + 14, w: bw - 28, size: 18, bold: true, lh: 1.1, color: C.blue });
      s.text(now, { x: x + bw + AW + 14, y: y + 40, w: bw - 28, size: FS, lh: 1.2, color: C.navy });
      y += bh + 18;
      y += s.text('**Новая персонализация:** оккейжен → предмет → клейм', { x, y, w, size: 18, lh: 1.2, color: C.navy }) + 14;
      // три креатива 2026
      const ROWS = [
        { img: 'd_creative_colic.png', ratio: 612 / 324, color: OCC.colic, label: 'Колики',
          text: 'Лошадка-качелька, как синоним повторяющихся симптомов + направленное действие на причину колик' },
        { img: 'd_creative_feeding.png', ratio: 612 / 328, color: OCC.feed, label: 'Кормление',
          text: 'Бутылочка + удобная форма применения независимо от типа вскармливания' },
        { img: 'd_creative_sleep.png', ratio: 612 / 324, color: OCC.sleep, label: 'Сон',
          text: 'Ночник, как ориентир на ночные колики + простой способ применения' },
      ];
      const sense = '**Смысл:** от единого образа — к креативам, где мама считывает конкретный момент применения, и подходящее под оккейжен УТП продукта';
      const sh = measure(sense, w - 28, FS) + 28;
      const avail = CY0 + CH - 22 - sh - 16 - y;          // место под три строки
      const RG = 14;
      const IH = Math.min(108, Math.floor((avail - RG * 2) / 3));
      ROWS.forEach((r) => {
        const iw = Math.round(IH * r.ratio);
        s.image(path.join(B.CROPS, r.img), { x, y, w: iw, h: IH, alt: 'Креатив Боботик 2026' });
        const tx = x + iw + 18;
        const tw = x + w - tx;
        const blk = 22 + 6 + measure(r.text, tw, 16);
        const ty = y + Math.max(0, (IH - blk) / 2);
        s.text(r.label, { x: tx, y: ty, w: tw, size: 19, bold: true, lh: 1.1, color: ink(r.color) });
        s.text(r.text, { x: tx, y: ty + 27, w: tw, size: 16, lh: 1.2, color: C.blueText });
        y += IH + RG;
      });
      y += 2;
      s.box({ x, y, w, h: sh, fill: C.cardTint, r: 14 });
      s.text(sense, { x: x + 14, y: y + 14, w: w - 28, size: FS, lh: 1.2, color: C.navy });
    }

    // ---------- 2 · Новые vs старый креатив ----------
    {
      const c = cols[1];
      const x = c.x + PAD;
      const w = c.w - PAD * 2;
      s.card({ x: c.x, y: CY0, w: c.w, h: CH });
      let y = colHead(s, { x, y: CY0 + 20, w, n: 2, title: 'Новые vs старый креатив' }) + 18;
      // старый креатив (с феей) + бенчмарк
      const IW = 262;
      const IH = Math.round(IW * 607 / 1080);
      s.image(path.join(B.MEDIA, 'img_7162a79a5d.jpg'), { x, y, w: IW, h: IH, alt: 'Креатив Боботик с феей' });
      const bx = x + IW + 14;
      const bw = x + w - bx;
      s.box({ x: bx, y, w: bw, h: IH, fill: C.cardTint, r: 14 });
      const bt = s.text('OLD с феей как бенчмарк:', { x: bx + 14, y: y + 10, w: bw - 28, size: 17, bold: true, lh: 1.1, color: C.navy });
      const MET = [['CTR', '1,77%'], ['CR ГК', '0,6%'], ['корзина', '0,49%'], ['покупка', '0,26%']];
      const my0 = y + 10 + bt + 6;
      const mstep = (y + IH - 8 - my0) / MET.length;
      MET.forEach(([k, v], i) => {
        const yy = my0 + i * mstep;
        s.text(k, { x: bx + 14, y: yy, w: bw - 100, size: 17, lh: 1.2, color: C.blueText });
        s.text(v, { x: bx + bw - 96, y: yy, w: 82, size: 17, bold: true, lh: 1.2, color: C.navy, align: 'right' });
      });
      y += IH + 16;

      // таблица теста: новые креативы против OLD (↑ / ↓ — выше / ниже бенчмарка; зелёным — лучший результат по столбцу)
      const CW = [178, 104, 104, w - 178 - 208];
      const cx = [x, x + CW[0], x + CW[0] + CW[1], x + CW[0] + CW[1] + CW[2]];
      const HH = 54;
      s.box({ x, y, w, h: HH, fill: C.navy, r: 12 });
      const HEAD = ['Условие сравнения', 'CTR%', 'CR ГК %', 'CR% корзина / покупка*'];
      HEAD.forEach((t, i) => s.text(t, { x: cx[i] + 10, y, w: CW[i] - 20, h: HH, size: 15, bold: true, lh: 1.1, color: C.white,
        align: i ? 'center' : 'left', valign: 'middle', fit: true, minSize: 13 }));
      const ROWS = [
        { name: 'Колики', sub: 'лучший вход', color: OCC.colic, v: [['2,64', 1, 1], ['1,4', 1, 0], ['0,29', 0, 0], ['0,17', 0, 1]] },
        { name: 'Кормление', sub: 'сценарий действия', color: OCC.feed, v: [['1,30', 0, 0], ['1,9', 1, 1], ['0,62', 1, 1], ['0,12', 0, 0]] },
        { name: 'Сон', sub: 'пересборка', color: OCC.sleep, v: [['1,16', 0, 0], ['1,2', 1, 0], ['0,15', 0, 0], ['0,06', 0, 0]] },
      ];
      const fin = '**Вывод из теста:** новые креативы лучше раскрывают [[ситуацию и приводят к «Где купить», но финальную покупку пока лучше удерживает старый узнаваемый код]].';
      const fh = measure(fin, w - 28, FS) + 26;
      const RH = Math.min(96, Math.floor((CY0 + CH - 22 - fh - 16 - (y + HH)) / ROWS.length));
      let ry = y + HH;
      // значение со стрелкой: зелёная ↑ / малиновая ↓; лучший результат по столбцу — зелёный жирный
      const val = ([v, up, best]) => [
        { text: v + ' ', options: { color: best ? C.green : C.navy, bold: true } },
        { text: up ? '↑' : '↓', options: { color: up ? C.green : C.crimson, bold: true, fontFace: 'Arial' } },
      ];
      ROWS.forEach((r, ri) => {
        if (ri) s.hline(x, ry, w, C.line, 1.5);
        const nh = 23 + measure(r.sub, CW[0] - 12, 15);
        s.text(r.name, { x: x + 10, y: ry + (RH - nh) / 2, w: CW[0] - 12, size: 19, bold: true, lh: 1.1, color: C.navy });
        s.text(r.sub, { x: x + 10, y: ry + (RH - nh) / 2 + 23, w: CW[0] - 12, size: 15, lh: 1.2, color: ink(r.color) });
        [0, 1].forEach((k) => s.text(val(r.v[k]), { x: cx[k + 1], y: ry, w: CW[k + 1], h: RH, size: 19, lh: 1.1, align: 'center', valign: 'middle' }));
        // корзина / покупка — две строки
        s.text([...val(r.v[2]), { text: ' /', options: { color: C.navy, bold: true, breakLine: true } }, ...val(r.v[3])],
          { x: cx[3], y: ry, w: CW[3], h: RH, size: 19, lh: 1.1, align: 'center', valign: 'middle' });
        ry += RH;
      });
      s.hline(x, ry, w, C.line, 1.5);
      ry += 16;
      s.box({ x, y: ry, w, h: fh, fill: tintOf(C.crimson, 0.08), r: 14 });
      s.text(fin, { x: x + 14, y: ry + 13, w: w - 28, size: FS, lh: 1.2, color: C.navy });
    }

    // ---------- 3 · Инсайты и доработка 2027 ----------
    {
      const c = cols[2];
      const x = c.x + PAD;
      const w = c.w - PAD * 2;
      s.card({ x: c.x, y: CY0, w: c.w, h: CH });
      let y = colHead(s, { x, y: CY0 + 20, w, n: 3, title: 'Инсайты и доработка 2027' }) + 18;
      const INS = [
        { n: '01', color: OCC.colic, text: '**Колики дают лучший контакт:** сюжет быстро считывается как ключевая проблема мамы и лучше удерживает внимание',
          act: 'Делаем колики главным первым кадром', actText: 'Животик, плач/беспокойство, реакции мамы и продукт рядом — ситуация считывается до чтения текста' },
        { n: '02', color: OCC.feed, text: '**Кормление ведет к действию:** контекст применения ближе к моменту выбора и помогает перевести интерес в аптечный сценарий',
          act: 'Показываем применение как ритуал', actText: 'Ложка / бутылочка / кормление как бытовой момент, где Боботик встроен в заботу, а не появляется только в packshot' },
        { n: '03', color: OCC.sleep, text: '**Сон требует пересборки:** ночной сюжет вызывает интерес, но нуждается в более ясном пути от тревоги к решению',
          act: 'Пересобрать «ночной сюжет»', actText: 'Не просто «колики мешают сну», а путь семьи: тревожная ночь → помощь → спокойствие ребёнка и родителей' },
      ];
      const fin = '**2027:** мама + ребёнок → конкретный момент проблемы → заметная упаковка Боботик → следующий шаг';
      const fh = measure(fin, w - 28, FS) + 26;
      const BD = 42;
      const tx = x + BD + 14;
      const tw = x + w - tx;
      const blockH = (it) => 12 + measure(it.text, tw - 24, FS) + 12 + 10 + measure('→ ' + it.act, tw - 8, 17, true) + 4 + measure(it.actText, tw - 8, 16);
      const total = INS.reduce((a, it) => a + blockH(it), 0);
      const free = CY0 + CH - 22 - fh - 16 - y - total;
      const G = Math.max(10, Math.min(40, free / 3));
      INS.forEach((it) => {
        const th = measure(it.text, tw - 24, FS) + 24;
        s.badge({ x, y: y + (th - BD) / 2, d: BD, n: it.n, color: tintOf(it.color, 0.16), textColor: ink(it.color), size: 17 });
        s.box({ x: tx, y, w: tw, h: th, fill: tintOf(it.color, 0.1), r: 12 });
        s.text(it.text, { x: tx + 12, y: y + 12, w: tw - 24, size: FS, lh: 1.2, color: C.navy });
        let yy = y + th + 10;
        yy += s.text('[[→]] ' + it.act, { x: tx + 4, y: yy, w: tw - 8, size: 17, bold: true, lh: 1.2, color: C.navy, accent: ink(it.color) }) + 4;
        yy += s.text(it.actText, { x: tx + 4, y: yy, w: tw - 8, size: 16, lh: 1.2, color: C.blueText });
        y = yy + G;
      });
      const fy = CY0 + CH - 22 - fh;
      s.box({ x, y: fy, w, h: fh, fill: C.cardTint, r: 14 });
      s.text(fin, { x: x + 14, y: fy + 13, w: w - 28, size: FS, lh: 1.2, color: C.navy });
    }
    s.footnote('Источник: статистика кампании Боботик, август 2026; Review 1H’26. ГК = «Где купить». *Корзина/покупка — транзакционные запросы apteka.ru.', { y: 1024, size: 13 });
  },

  // =====================================================================
  // 19 · Календарь 2027
  // =====================================================================
  19: (d) => {
    const s = d.slide({
      title: 'Календарь 2027: постоянно находим новые аудитории в коротком окне выбора',
      subtitle: 'и масштабируем доказанные comprehensive-связки',
    });
    // принцип календаря
    const PL = 'Принцип календаря';
    const PT_ = 'Каждый месяц перехватываем новые когорты мам в окне выбора после 28 дней жизни ребёнка. Флайты усиливают охват там, где поисковый спрос и давление конкурентов дают дополнительный сигнал, но не являются единственным основанием для присутствия';
    const plw = Math.min(300, widthOf(PL.toUpperCase(), 21, true) + 8);
    const ptx = X0 + 32 + plw + 30;
    const ptw = X1 - 32 - ptx;
    const ph = Math.max(84, measure(PT_, ptw, 19) + 32);
    s.card({ x: X0, y: TOP, w: X1 - X0, h: ph, tint: true });
    s.text(PL.toUpperCase(), { x: X0 + 32, y: TOP, w: plw, h: ph, size: 21, bold: true, lh: 1.1, color: C.blue, valign: 'middle' });
    s.vline(ptx - 16, TOP + 18, ph - 36, C.line, 2);
    s.text(PT_, { x: ptx, y: TOP, w: ptw, h: ph, size: 19, lh: 1.2, color: C.navy, valign: 'middle' });

    // гант по месяцам
    const LW = 270;
    const GX = X0 + LW + 16;
    const MW = (X1 - GX) / 12;
    const mx = (m) => GX + m * MW;
    const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const HY = TOP + ph + 26;
    const HH = 36;
    MONTHS.forEach((m, i) => {
      s.box({ x: mx(i) + 3, y: HY, w: MW - 6, h: HH, fill: C.tint, r: 10 });
      s.text(m, { x: mx(i) + 3, y: HY, w: MW - 6, h: HH, size: 16, bold: true, lh: 1.0, color: C.navy, align: 'center', valign: 'middle' });
    });
    // границы баров: Sprint 1 — май–июль, Decision gate — август – середина сентября, Sprint 2 — середина сентября – ноябрь (правка Романа 20.10)
    const ROWS = [
      { label: 'Always on core', color: C.green, m0: 0, m1: 12, text: 'Paid Search / GEO&AEO / ORM occasion-based / Внешние публикации' },
      { label: 'Sprint 1 | Prove', color: C.crimson, m0: 4, m1: 7, text: 'OLV + Precise Media + Occasions (native & bloggers)' },
      { label: 'Decision gate', color: GOLD, m0: 7, m1: 8.5, text: 'Media & Sales Lift results' },
      { label: 'Sprint 2 | Scale proven', color: C.crimson, m0: 8.5, m1: 11, text: 'перераспределение бюджета в наиболее эффективные решения без OLV' },
    ];
    // три «почему» — карточки внизу по высоте текста; строки ганта делят оставшееся место
    const WHY = [
      { color: C.blue, icon: 'tb:TbCalendarStats', label: 'Почему не жёсткая сезонность',
        text: 'Летние пики повторяются, но не доказаны как стабильная сезонность. Дети рождаются круглый год — окно релевантности постоянно обновляется' },
      { color: C.crimson, icon: 'tb:TbSun', label: 'Почему усиливаем летом',
        text: 'В июле виден всплеск поискового интереса; конкуренты усиливают активность весной–летом. Поэтому первый Sprint начинаем заранее с мая' },
      { color: GOLD, icon: 'tb:TbFilter', label: 'Что фиксируем в Decision gate',
        text: 'Reach 1+ / эффективный охват / VTR/CTR → Brand\u00a0Search → BLS → CR\u00a0«Где купить» / e-pharm → Sales\u00a0Lift' },
    ];
    const kcols = columns(3, { gap: 22 });
    const KP = 28;
    const KI = 48;
    const KFS = 20;
    const ktw = kcols[0].w - KP * 2;
    const KH = KP + KI + 16 + Math.max(...WHY.map((k) => measure(k.text, ktw, KFS, false, 1.25))) + KP;
    const KY = BOT - KH;

    const RG = 12;
    const RY0 = HY + HH + 12;
    const RH = Math.floor((KY - 28 - RY0 - RG * (ROWS.length - 1)) / ROWS.length);
    ROWS.forEach((r, i) => {
      const y = RY0 + i * (RH + RG);
      s.text(r.label.toUpperCase(), { x: X0, y, w: LW, h: RH, size: 20, bold: true, lh: 1.1, color: r.color,
        valign: 'middle', fit: true, maxLines: 2, minSize: 16 });
      s.box({ x: GX, y, w: X1 - GX, h: RH, fill: C.cardTint, r: 12 });
      for (let m = 1; m < 12; m++) s.vline(mx(m), y + 8, RH - 16, C.white, 2);
      const bx = mx(r.m0) + 3;
      const bw = (r.m1 - r.m0) * MW - 6;
      const wide = r.m1 - r.m0 >= 6;
      s.box({ x: bx, y: y + 5, w: bw, h: RH - 10, fill: r.color, r: 10 });
      s.text(r.text, { x: bx + 12, y: y + 5, w: bw - 24, h: RH - 10, size: wide ? 20 : 17, bold: true, lh: 1.1, color: C.white,
        align: wide ? 'left' : 'center', valign: 'middle', fit: true, minSize: 15 });
    });

    kcols.forEach((c, i) => {
      const k = WHY[i];
      s.card({ x: c.x, y: KY, w: c.w, h: KH });
      s.icon(k.icon, { x: c.x + KP, y: KY + KP, size: KI, circle: k.color });
      s.text(k.label.toUpperCase(), { x: c.x + KP + KI + 16, y: KY + KP, w: c.w - KP * 2 - KI - 16, h: KI, size: 20, bold: true, lh: 1.05,
        color: k.color, valign: 'middle', fit: true, maxLines: 2, minSize: 16 });
      s.text(k.text, { x: c.x + KP, y: KY + KP + KI + 16, w: evenW(k.text, ktw, KFS), size: KFS, lh: 1.25, color: C.navy });
    });
  },

  // =====================================================================
  // 20 · Четыре роли инвестиций
  // =====================================================================
  20: (d) => {
    const s = d.slide({
      title: 'Боботик 2027: от первого контакта к выбору и покупке — четыре роли инвестиций в единой системе',
      subtitle: 'Создаём знание о бренде → попадаем в момент потребности →\nусиливаем доверие → превращаем интерес в покупку',
    });
    const ROLES = [
      { color: C.crimson, n: '01', step: 'Узнать', stepSub: 'о бренде',
        label: '1. CREATE DEMAND', share: '27%', icon: 'tb:TbPlayerPlay', chan: 'OLV / occasion-based video',
        text: 'Создаём знание о Боботике до активного поиска решения через концентрированный видеоконтакт в ядре ЦА.', sup: 'Sprint 1' },
      { color: C.blue, n: '02', step: 'Узнать себя', stepSub: 'в ситуации',
        label: '2. WIN THE MOMENT', share: '20%', icon: 'tb:TbTargetArrow', chan: 'Programmatic precise / occasion-based targeting',
        text: 'Находим маму в коротком окне потребности и переводим знание в рассмотрение бренда через релевантное ситуации сообщение.', sup: 'Sprint 1 + 2' },
      { color: C.purple, n: '03', step: 'Довериться', stepSub: 'при выборе',
        label: '3. BUILD TRUST', share: '10%', icon: 'tb:TbUsers', chan: 'Bloggers / occasion-based content',
        text: 'Усиливаем доверие через узнаваемые жизненные истории и личный опыт авторов. Добавляем эмоциональный и социальный контекст в релевантной жизненной ситуации.', sup: 'Sprint 1 + 2' },
      { color: C.green, n: '04', step: 'Купить', stepSub: 'подходящее решение',
        label: '4. CONVERT DEMAND', share: '43%', icon: 'tb:TbShoppingCart', chan: 'AI Visibility + Paid Search + релевантные посадочные страницы',
        text: 'Перехватываем сформированный интерес, помогаем обосновать выбор и сокращаем путь от поиска решения до покупки.', sup: 'Always-on' },
    ];
    // ---------- путь мамы ----------
    const PH = 118;
    const PY = TOP;
    const PHW = Math.round(PH * 780 / 696);           // фото мамы с малышом (вырезано из картинки слайда)
    s.image(path.join(B.CROPS, 'd_mom.png'), { x: X0, y: PY, w: PHW, h: PH, alt: 'Мама с малышом' });
    const PLX = X0 + PHW + 22;
    const PLW = 190;
    s.text('Путь мамы к выбору Боботика'.toUpperCase(), { x: PLX, y: PY, w: PLW, h: PH, size: 20, bold: true, lh: 1.15, color: C.navy,
      valign: 'middle', fit: true, maxLines: 3, minSize: 16 });
    const SX0 = PLX + PLW + 10;
    const CHV = 34;                                     // место под шеврон между шагами
    const SW = (X1 - SX0 - CHV * 3) / 4;
    const SH = 92;
    const SY = PY + (PH - SH) / 2;
    ROLES.forEach((r, i) => {
      const x = SX0 + i * (SW + CHV);
      s.box({ x, y: SY, w: SW, h: SH, fill: tintOf(r.color, 0.1), r: 18 });
      s.badge({ x: x + 16, y: SY + (SH - 54) / 2, d: 54, n: r.n, color: r.color, size: 22 });
      const tx = x + 16 + 54 + 14;
      const tw = x + SW - 12 - tx;
      s.text(r.step.toUpperCase(), { x: tx, y: SY + 18, w: tw, size: 20, bold: true, lh: 1.1, color: C.navy, fit: true, maxLines: 1, minSize: 15 });
      s.text(r.stepSub, { x: tx, y: SY + 18 + 26, w: tw, size: 17, lh: 1.2, color: C.blueText, fit: true, maxLines: 2, minSize: 14 });
      if (i < 3) s.chevron({ cx: x + SW + CHV / 2, cy: SY + SH / 2, w: 16, h: 26, dir: 'right', color: C.navy });
    });

    // ---------- четыре роли ----------
    const KY = PY + PH + 24;
    const KH = CB - KY;
    const cols = columns(4, { gap: 22 });
    const pad = 26;
    const IC = 58;
    const DFS = 20;
    // одинаковые высоты блоков в соседних колонках: канал (рядом с иконкой) и описание
    const cw0 = cols[0].w - pad * 2;
    const chanW = cw0 - IC - 16;
    const chanH = Math.max(IC, ...ROLES.map((r) => measure(r.chan, chanW, 20, true, 1.15)));
    const descH = Math.max(...ROLES.map((r) => measure(r.text, cw0, DFS, false, 1.25)));
    const supH = 76;
    const fixed = 22 + 54 + 14 + 12 + chanH + descH + supH + 22;
    const G = Math.max(18, (KH - fixed) / 3);          // три промежутка: после полосы доли, после канала, перед «Поддержкой»
    ROLES.forEach((r, i) => {
      const c = cols[i];
      const x = c.x + pad;
      const w = c.w - pad * 2;
      s.card({ x: c.x, y: KY, w: c.w, h: KH, fill: tintOf(r.color, 0.04), stroke: tintOf(r.color, 0.35) });
      // метка роли + доля бюджета (полоса — доля от 100%)
      const shW = 112;
      const sy = KY + 22;
      s.box({ x: x + w - shW, y: sy, w: shW, h: 54, fill: tintOf(r.color, 0.14), r: 27 });
      s.text(r.share, { x: x + w - shW, y: sy, w: shW, h: 54, size: 34, bold: true, lh: 1.0, color: r.color, align: 'center', valign: 'middle' });
      s.text(r.label, { x, y: sy, w: w - shW - 10, h: 54, size: 21, bold: true, lh: 1.05, color: r.color, valign: 'middle', fit: true, maxLines: 2, minSize: 16 });
      let y = sy + 54 + 14;
      s.box({ x, y, w, h: 12, fill: tintOf(r.color, 0.14), r: 6 });
      s.box({ x, y, w: Math.max(12, w * parseFloat(r.share) / 100), h: 12, fill: r.color, r: 6 });
      y += 12 + G;
      // иконка + канал
      s.icon(r.icon, { x, y: y + (chanH - IC) / 2, size: IC, circle: r.color });
      const ch = measure(r.chan, chanW, 20, true, 1.15);
      s.text(r.chan, { x: x + IC + 16, y: y + (chanH - ch) / 2, w: chanW, size: 20, bold: true, lh: 1.15, color: C.navy });
      y += chanH + G;
      s.text(r.text, { x, y, w, size: DFS, lh: 1.25, color: C.navy });
      // поддержка — внизу карточки
      const supY = KY + KH - 22 - supH;
      s.box({ x, y: supY, w, h: supH, fill: C.white, stroke: tintOf(r.color, 0.35), sw: 1.5, r: 14 });
      s.text('Поддержка:', { x: x + 16, y: supY + 12, w: w - 32, size: 17, bold: true, lh: 1.1, color: r.color });
      s.text(r.sup, { x: x + 16, y: supY + 12 + 24, w: w - 32, size: 19, bold: true, lh: 1.2, color: C.navy });
    });
    s.formula({ text: 'Не четыре независимых канала, а единая система: от формирования знания и релевантного контакта до обоснованного выбора и покупки Боботика.' });
  },
};
