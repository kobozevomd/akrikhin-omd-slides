// Динобутин · стратегия 2027 — часть C: слайды исходника 11–15.
// 11 — проверка сегментов с ORM-фильтром: что показала проверка (1–4) + media-сегменты со статусом;
// 12 — взрослая аудитория (скрытый): четыре блока 2 × 2, ключевые цифры — крупно справа;
// 13 — креативная стратегия: что изменили в 2026 → текущий vs новый креатив → инсайты 2027, формула — плашкой;
// 14 — переход 2026 → 2027: четыре карточки результатов 2026 → четыре шага 2027;
// 15 — четыре роли 2027 (CAPTURE & CONVERT / BUILD NEW DEMAND / PERSONALIZE CONSIDERATION / BUILD TRUST & SUPPORT CHOICE) + логика 2027.
// 11, 12, 14, 15 в исходнике — картинка во весь слайд (на 14, 15 под ней тот же живой текст); видимый текст — источник истины.
const path = require('path');
const { C, columns, countLines, textWidth, typo, tr } = require('../../../lib/akrikhin');
const V = require('../../variants/common');               // TOP, BOT
const D = require('./common');                            // SRC, MEDIA, CROPS

const TOP = V.TOP;   // 221 — верх контента
const BOT = V.BOT;   // 1005 — низ контента без плашки
const CB = 905;      // низ контента над плашкой
const X0 = 58;
const X1 = 1862;

// Цвета четырёх ролей 2027 (слайд 15) — как в исходнике; их же повторяют слайды 16, 17, 24–27
const ROLE = {
  capture: C.green,     // 1 · CAPTURE & CONVERT            3A9D74
  demand: C.crimson,    // 2 · BUILD NEW DEMAND             EA2854
  consider: C.purple,   // 3 · PERSONALIZE CONSIDERATION    6F60B9
  trust: C.orange,      // 4 · BUILD TRUST & SUPPORT CHOICE F87E2B
};

// ---------- Локальные хелперы ----------
const view = (t) => typo(tr(String(t))).replace(/\*\*|\[\[|\]\]/g, '');
const measure = (t, w, size = 18, bold = false, lh = 1.2) => Math.round(countLines(view(t), size, w, bold) * size * lh);
const widthOf = (t, size, bold = false) => Math.ceil(textWidth(view(t), size, bold));
// Ширина блока, при которой текст занимает столько же строк, но строки ровнее
const evenW = (t, w, size, bold = false) => {
  const lines = (ww) => countLines(view(t), size, ww, bold);
  const n = lines(w);
  if (n < 2) return w;
  let lo = w * 0.4;
  let hi = w;
  while (hi - lo > 1) { const m = (lo + hi) / 2; if (lines(m) <= n) hi = m; else lo = m; }
  return Math.min(w, Math.ceil(hi * 1.04) + 6);
};
// Смешение цвета с белым: k = 0 — белый, 1 — исходный цвет
function tintOf(hex, k) {
  const c = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return c.map((v) => Math.round(255 + (v - 255) * k).toString(16).padStart(2, '0')).join('').toUpperCase();
}
// Синяя плашка-заголовок колонки с иконкой (как на Bobotic 14)
function headBox(s, { x, y, w, h = 76, color = C.blue, icon, text, size = 23 }) {
  s.box({ x, y, w, h, fill: color });
  const d = 44;
  let tx = x + 26;
  if (icon) { s.icon(icon, { x: tx, y: y + (h - d) / 2, size: d, color: C.white }); tx += d + 20; }
  s.text(String(text).toUpperCase(), { x: tx, y, w: x + w - 22 - tx, h, size, bold: true, lh: 1.05, color: C.white,
    valign: 'middle', fit: true, maxLines: 2, minSize: 16 });
}
// Заголовок колонки-карточки: кружок с номером + заголовок; возвращает y под ним
function colHead(s, { x, y, w, n, title, color = C.blue }) {
  s.badge({ x, y, d: 46, n, color, size: 24 });
  s.text(title, { x: x + 46 + 16, y, w: w - 62, h: 46, size: 26, bold: true, lh: 1.0, color: C.navy, valign: 'middle',
    fit: true, maxLines: 1, minSize: 20 });
  return y + 46;
}

module.exports = {
  // =====================================================================
  // 11 · Проверка сегментов с ORM-фильтром  (аналоги — Normobact 13, Bobotic 14)
  // =====================================================================
  11: (d) => {
    const s = d.slide({ title: 'Проверка сегментов Динобутин с ORM-фильтром' });
    const LW = 690;
    const GAP = 24;
    const L = { x: X0, w: LW };
    const R = { x: X0 + LW + GAP, w: X1 - X0 - LW - GAP };
    const HH = 76;
    const KY = TOP + HH + 12;
    headBox(s, { x: L.x, y: TOP, w: L.w, h: HH, icon: 'tb:TbListSearch', text: 'Что показала проверка' });
    headBox(s, { x: R.x, y: TOP, w: R.w, h: HH, icon: 'tb:TbUsersGroup', text: 'Media-сегменты' });
    s.card({ x: L.x, y: KY, w: L.w, h: BOT - KY });
    s.card({ x: R.x, y: KY, w: R.w, h: BOT - KY });

    // ---------- слева: что показала проверка — четыре пункта ----------
    const FIND = [
      'Повторная проверка сегментов ИИ-агентом через отзывы с добавлением ORM-фильтра показала, что **2\u00a0сегмента** не требуют корректировок.',
      'При этом новый массив отзывов позволил найти **дополнительный сегмент** и показал необходимость небольшой корректировки сегмента **Стресс-стул**.',
      '**Стресс-стул** меняем на **стресс-живот**, потому что в свежих обсуждениях первым проявлением чаще становятся боль, спазм и вздутие на фоне волнения.',
      'Также в отзывах появился сегмент **Нестабильный стул**. Он строится вокруг ситуаций, когда у ребёнка запор или, наоборот, жидкий стул и так далее.',
    ];
    {
      const pad = 32;
      const BD = 46;
      const x = L.x + pad;
      const tx = x + BD + 20;
      const tw = L.x + L.w - pad - tx;
      const FS = 22;
      const hs = FIND.map((t) => Math.max(BD, measure(t, tw, FS, false, 1.25)));
      const y0 = KY + 28;
      const y1 = BOT - 28;
      const G = (y1 - y0 - hs.reduce((a, b) => a + b, 0)) / FIND.length;   // половина зазора сверху и снизу каждого пункта
      let y = y0 + G / 2;
      FIND.forEach((t, i) => {
        if (i) s.hline(x, y - G / 2, L.w - pad * 2);
        const th = measure(t, tw, FS, false, 1.25);
        s.badge({ x, y: y + Math.max(0, (Math.min(th, 82) - BD) / 2), d: BD, n: i + 1, color: C.blue, size: 24 });
        s.text(t, { x: tx, y, w: tw, size: FS, lh: 1.25, color: C.navy });
        y += hs[i] + G;
      });
    }

    // ---------- справа: media-сегменты — строка на сегмент: иконка · название · описание · статус ----------
    const SEG = [
      { icon: 'tb:TbRefresh', color: C.crimson, name: 'Повторяющиеся хронические боли или спазмы в ЖКТ',
        text: 'Боль возвращается снова и снова; мама ищет понятное и устойчивое решение.', st: 'ok' },
      { icon: 'tb:TbToolsKitchen2', color: C.blue, name: 'Боли, вздутие, метеоризм на фоне изменения диеты/режима',
        text: 'Симптомы появляются после новой еды, праздников, поездок или смены привычного режима.', st: 'ok' },
      { icon: 'tb:TbBrain', color: C.navy, name: 'Стресс-живот',
        text: 'Живот реагирует на волнение, адаптацию, садик или школу.', st: 'fix' },
      { icon: 'tb:TbWaveSine', color: C.cyan, name: 'Нестабильный стул',
        text: 'То запор, то жидкий стул; нужен более предсказуемый ритм и комфорт.', st: 'new' },
    ];
    const ST = {
      ok: { color: C.green, icon: 'tb:TbCheck', text: 'Сегмент подтвержден' },
      fix: { color: C.purple, icon: 'tb:TbPlus', text: 'Сегмент уточнен и скорректирован' },
      new: { color: C.crimson, icon: 'tb:TbStar', text: 'Новый сегмент' },
    };
    {
      const pad = 28;
      const x = R.x + pad;
      const w = R.w - pad * 2;
      const IC = 78;                   // плитка с иконкой
      const NX = x + IC + 20;
      const NW = 300;                  // название + возраст
      const DX = NX + NW + 26;
      const SW = 262;                  // статус
      const SX = x + w - SW;
      const DW = SX - 26 - DX;         // описание
      // подпись столбца описаний — один раз сверху
      const LY = KY + 22;
      s.text('Описание'.toUpperCase(), { x: DX, y: LY, w: DW, size: 16, bold: true, lh: 1.0, color: C.crimson });
      const RY0 = LY + 30;
      const RH = (BOT - 18 - RY0) / SEG.length;
      SEG.forEach((g, i) => {
        const y = RY0 + i * RH;
        if (i) s.hline(x, y, w);
        const cy = y + RH / 2;
        // иконка
        s.box({ x, y: cy - IC / 2, w: IC, h: IC, fill: g.color, r: 16 });
        s.icon(g.icon, { x: x + 17, y: cy - IC / 2 + 17, size: IC - 34, color: C.white });
        // название + возраст
        const nh = measure(g.name, NW, 19, true, 1.15);
        const CH = 34;
        const bh = nh + 10 + CH;
        const ny = cy - bh / 2;
        s.text(g.name, { x: NX, y: ny, w: NW, size: 19, bold: true, lh: 1.15, color: C.navy });
        const age = 'Дети 3–10 лет';
        const aw = widthOf(age, 16) + 32;
        s.box({ x: NX, y: ny + nh + 10, w: aw, h: CH, fill: C.tint, r: 17 });
        s.text(age, { x: NX, y: ny + nh + 10, w: aw, h: CH, size: 16, lh: 1.0, color: C.blueText, align: 'center', valign: 'middle' });
        // описание
        s.vline(DX - 13, y + 18, RH - 36);
        const dh = measure(g.text, DW, 19, false, 1.25);
        s.text(g.text, { x: DX, y: cy - dh / 2, w: DW, size: 19, lh: 1.25, color: C.navy });
        // статус
        const st = ST[g.st];
        const sh = RH - 30;
        s.box({ x: SX, y: cy - sh / 2, w: SW, h: sh, fill: tintOf(st.color, 0.1), r: 16 });
        const SD = 50;
        s.icon(st.icon, { x: SX + 16, y: cy - SD / 2, size: SD, circle: st.color });
        const stx = SX + 16 + SD + 14;
        s.text(st.text, { x: stx, y: cy - sh / 2, w: SX + SW - 12 - stx, h: sh, size: 19, bold: true, lh: 1.15, color: st.color,
          valign: 'middle', fit: true, maxLines: 3, minSize: 16 });
      });
    }
  },

  // =====================================================================
  // 12 · Взрослая аудитория для Динобутина (скрытый в исходнике)
  // =====================================================================
  12: (d) => {
    const s = d.slide({ title: 'Взрослая аудитория для Динобутина: отдельный тест не выглядит целесообразным' });
    s.s.hidden = true;
    const cols = columns(2, { gap: 24 });
    const RG = 22;
    const KH = (BOT - TOP - RG) / 2;
    const rows = [TOP, TOP + KH + RG];
    const BLK = [
      { n: 1, head: 'Проблема дозировки и стоимости',
        text: 'Взрослому требуется 10–20 мл геля за приём, 3 раза в день (100–200 мг). Это 2–4 мерные ложки за один раз и 6–12 ложек в день. Тубы 100 г хватает примерно на 1,5–3 дня.\n\nКурс 28 дней обойдётся ориентировочно в **7–14\u00a0тыс.\u00a0₽**, что в несколько раз дороже таблетированных аналогов.',
        value: '7–14', unit: 'тыс. ₽', cap: 'курс 28 дней' },
      { n: 2, head: 'Проще выпить таблетку',
        text: 'Тримебутин в таблетках — проще и привычнее: разовая доза 200 мг принимается 1 таблеткой за приём (обычно 2–3 раза в день).\n\nЕсть пролонгированные формы: Тримедат Форте 300\u00a0мг — 1\u00a0табл. 2\u00a0раза в день.\n\nРоссийский рынок подтверждает этот тренд: таблетки — наиболее востребованная форма и формируют **46,5% расходов** на лекарства.',
        value: '46,5%', cap: 'расходов на лекарства — таблетки' },
      { n: 3, head: 'Что говорят отзывы со стороны взрослых',
        text: 'Органических отзывов взрослых о Динобутине немного. Главный сигнал — сомнения в удобстве и экономике курса:',
        quote: '«при СРК его надо несколько тюбиков. эта форма только для детей, в общем»',
        after: 'Взрослые чаще выбирают таблетки из-за простоты: одна таблетка за приём, без ложек, вкуса и мерной формы.' },
      { n: 4, head: 'Отдельный тест сегмента не оправдан', end: true,
        text: 'Совокупно все факторы говорят о том, что смысла в отдельном тесте взрослого сегмента немного. Дополнительно проверка поискового спроса это подтвердила: запросы, связанные с дисфагией, трудностями глотания и поиском жидкой формы тримебутина, либо практически отсутствуют, либо дают лишь **50–100 запросов в месяц**. Такой объём слишком мал, чтобы рассчитывать на заметный охват и устойчивый результат теста.',
        value: '50–100', cap: 'запросов в месяц' },
    ];
    const pad = 32;
    const BD = 52;
    const PW0 = 220;
    // высота места под текст в блоке и нужная высота текста при кегле fs
    const bodyTop = (b) => pad - 4 + Math.max(BD, measure(b.head, cols[0].w - pad * 2 - BD - 18, 27, true, 1.1)) + 18;
    const room = (b) => KH - bodyTop(b) - pad + 6;
    const need = (b, fs) => {
      const w = cols[0].w - pad * 2;
      if (b.quote) return measure(b.text, w, fs, false, 1.25) + 14 + measure(b.quote, w - 96, fs + 1, true, 1.25) + 32 + 14 + measure(b.after, w, fs, false, 1.25);
      const tw = w - (b.value ? PW0 + 26 : 0);
      const paras = b.text.split('\n\n');
      return paras.reduce((a, t) => a + measure(t, tw, fs, false, 1.25), 0) + 8 * (paras.length - 1);
    };
    let FS = 22;
    while (FS > 17 && BLK.some((b) => need(b, FS) > room(b) - 6)) FS -= 1;
    BLK.forEach((b, i) => {
      const c = cols[i % 2];
      const y0 = rows[Math.floor(i / 2)];
      const accent = b.end ? C.crimson : C.blue;
      s.card({ x: c.x, y: y0, w: c.w, h: KH, fill: b.end ? tintOf(C.crimson, 0.06) : undefined, stroke: b.end ? tintOf(C.crimson, 0.3) : undefined });
      const x = c.x + pad;
      const w = c.w - pad * 2;
      // номер + заголовок
      const hw = w - BD - 18;
      const hh = Math.max(BD, measure(b.head, hw, 27, true, 1.1));
      s.badge({ x, y: y0 + pad - 4 + (hh - BD) / 2, d: BD, n: b.n, color: accent, size: 26 });
      s.text(b.head, { x: x + BD + 18, y: y0 + pad - 4 + (hh - measure(b.head, hw, 27, true, 1.1)) / 2, w: hw, size: 27, bold: true, lh: 1.1, color: C.navy });
      const ty = y0 + pad - 4 + hh + 18;
      const yEnd = y0 + KH - pad + 6;
      // ключевая цифра — справа
      const PW = b.value ? PW0 : 0;
      const tw = w - (PW ? PW + 26 : 0);
      if (b.value) {
        const px = x + w - PW;
        const ph = yEnd - ty;
        s.box({ x: px, y: ty, w: PW, h: ph, fill: tintOf(accent, b.end ? 0.12 : 0.08), r: 16 });
        const vs = b.unit ? 50 : 54;
        const capH = measure(b.cap, PW - 40, 17, false, 1.2);
        const unitH = b.unit ? 34 : 0;
        const bh = vs * 1.05 + unitH + 10 + capH;
        const by = ty + (ph - bh) / 2;
        s.text(b.value, { x: px + 20, y: by, w: PW - 40, size: vs, bold: true, lh: 1.05, color: accent, fit: true, maxLines: 1, minSize: 38 });
        if (b.unit) s.text(b.unit, { x: px + 20, y: by + vs * 1.05, w: PW - 40, size: 28, bold: true, lh: 1.1, color: accent });
        s.text(b.cap, { x: px + 20, y: by + vs * 1.05 + unitH + 10, w: PW - 40, size: 17, lh: 1.2, color: C.navy });
      }
      if (b.quote) {
        let y = ty;
        y += s.text(b.text, { x, y, w, size: FS, lh: 1.25, color: C.navy }) + 14;
        const qh = measure(b.quote, w - 96, FS + 1, true, 1.25) + 32;
        s.box({ x, y, w, h: qh, fill: C.cardTint, r: 16 });
        s.icon('tb:TbQuote', { x: x + 22, y: y + (qh - 40) / 2, size: 40, color: C.blue });
        s.text(b.quote, { x: x + 76, y: y + 16, w: w - 96, size: FS + 1, bold: true, lh: 1.25, color: C.blueText });
        y += qh + 14;
        s.text(b.after, { x, y, w, h: yEnd - y, size: FS, lh: 1.25, color: C.navy, fit: true, minSize: 17 });
      } else {
        s.text(b.text, { x, y: ty, w: tw, h: yEnd - ty, size: FS, lh: 1.25, gap: 8, color: C.navy, fit: true, minSize: 16 });
      }
    });
  },

  // =====================================================================
  // 13 · Динобутин 2027: от продуктовых сюжетов — к жизненным ситуациям  (аналог — Bobotic 18)
  // =====================================================================
  13: (d) => {
    // подзаголовок исходника длиннее двух строк шапки — он идёт вводной строкой над колонками (как на Bobotic 18)
    const s = d.slide({ title: 'Динобутин 2027: от продуктовых сюжетов — к жизненным ситуациям' });
    const lead = 'В 2026 мы персонализировали коммуникацию по ключевым проблемам детей 3–10 лет. В 2027 следующий шаг — [[**очеловечить креативы**]]: добавить ребенка в центр истории, чтобы родитель быстрее узнавал знакомую ситуацию и вовлекался в сообщение';
    const lh = s.text(lead, { x: X0, y: TOP - 4, w: X1 - X0, size: 21, lh: 1.2, color: C.navy });
    const cols = columns(3, { gap: 22 });
    const CY0 = TOP - 4 + lh + 16;
    const CH = BOT + 4 - CY0;
    const PAD = 24;
    const FS = 17;

    // ---------- 1 · Что изменили в 2026 ----------
    {
      const c = cols[0];
      const x = c.x + PAD;
      const w = c.w - PAD * 2;
      s.card({ x: c.x, y: CY0, w: c.w, h: CH });
      let y = colHead(s, { x, y: CY0 + 20, w, n: 1, title: 'Что изменили в 2026' }) + 16;
      // было → стало
      const AW = 44;
      const bw = (w - AW) / 2;
      const was = 'Единая продуктовая коммуникация';
      const now = 'Персонализация по симптомам и ситуациям';
      const bh = 12 + 20 + 6 + Math.max(measure(was, bw - 28, FS), measure(now, bw - 28, FS)) + 12;
      s.box({ x, y, w: bw, h: bh, fill: tintOf(C.crimson, 0.09), r: 14 });
      s.text('Было'.toUpperCase(), { x: x + 14, y: y + 12, w: bw - 28, size: 18, bold: true, lh: 1.1, color: C.crimson });
      s.text(was, { x: x + 14, y: y + 38, w: bw - 28, size: FS, lh: 1.2, color: C.navy });
      s.arrow({ dir: 'right', x: x + bw + 8, y: y + bh / 2, len: AW - 16, head: 22, headLen: 12, stem: 4, color: C.navy });
      s.box({ x: x + bw + AW, y, w: bw, h: bh, fill: C.cardTint, r: 14 });
      s.text('Стало'.toUpperCase(), { x: x + bw + AW + 14, y: y + 12, w: bw - 28, size: 18, bold: true, lh: 1.1, color: C.blue });
      s.text(now, { x: x + bw + AW + 14, y: y + 38, w: bw - 28, size: FS, lh: 1.2, color: C.navy });
      y += bh + 16;
      y += s.text('Текущие сегментированные креативы', { x, y, w, size: 19, bold: true, lh: 1.15, color: C.navy }) + 10;

      // «что уже работает» и «где резерв» — снизу, креативы — на оставшееся место
      const works = ['сообщение адаптировано под разные проблемы', 'рациональный claim привязан к оккейжну', 'продукт и бренд хорошо считываются'];
      const reserve = 'Визуальная подача остается преимущественно продуктовой: симптом понятен, но ребенок и жизненная сцена не становятся главным крючком вовлечения';
      const wh = 12 + 22 + 6 + works.reduce((a, t) => a + measure(t, w - 28 - 18, 16), 0) + 4 * (works.length - 1) + 12;
      const rh = 12 + 22 + 6 + measure(reserve, w - 28, 16) + 12;
      const bottomY = CY0 + CH - 20 - rh - 12 - wh;
      // три креатива 2026 с ярлыками оккейженов
      const CR = [
        { img: 'img_457d3418c8.jpg', label: 'Боли / спазмы', color: C.crimson },
        { img: 'img_a402cf1471.jpg', label: 'Диета / поездки', color: C.blue },
        { img: 'img_b35c01b86f.jpg', label: 'Стресс-стул', color: C.teal },
      ];
      const LH = 32;
      const IG = 14;
      const avail = bottomY - 14 - y - LH - 8;
      const IH = Math.min(Math.round((w - IG * 2) / 3 * 1350 / 1080), avail);
      const IW = Math.round(IH * 1080 / 1350);
      const gx = (w - IW * 3) / 2;                   // равномерные промежутки между креативами
      CR.forEach((r, i) => {
        const ix = x + i * (IW + gx);
        s.box({ x: ix, y, w: IW, h: LH, fill: tintOf(r.color, 0.1), r: 10 });
        s.text(r.label, { x: ix + 4, y, w: IW - 8, h: LH, size: 16, bold: true, lh: 1.0, color: r.color, align: 'center', valign: 'middle', fit: true, maxLines: 1, minSize: 13 });
        s.image(path.join(D.MEDIA, r.img), { x: ix, y: y + LH + 8, w: IW, h: IH, alt: 'Креатив Динобутин 2026' });
      });
      // что уже работает
      let by = bottomY;
      s.box({ x, y: by, w, h: wh, fill: C.cardTint, r: 14 });
      s.text('Что уже работает', { x: x + 14, y: by + 12, w: w - 28, size: 18, bold: true, lh: 1.1, color: C.blue });
      s.bullets(works, { x: x + 14, y: by + 12 + 22 + 6, w: w - 28, size: 16, gap: 4, color: C.navy });
      by += wh + 12;
      s.box({ x, y: by, w, h: rh, fill: tintOf(C.crimson, 0.08), r: 14 });
      s.text('Где резерв на 2027', { x: x + 14, y: by + 12, w: w - 28, size: 18, bold: true, lh: 1.1, color: C.crimson });
      s.text(reserve, { x: x + 14, y: by + 12 + 22 + 6, w: w - 28, size: 16, lh: 1.2, color: C.navy });
    }

    // ---------- 2 · Текущий vs новый креатив ----------
    {
      const c = cols[1];
      const x = c.x + PAD;
      const w = c.w - PAD * 2;
      s.card({ x: c.x, y: CY0, w: c.w, h: CH });
      let y = colHead(s, { x, y: CY0 + 20, w, n: 2, title: 'Текущий vs новый креатив' }) + 16;
      const AW = 52;
      const sw = (w - AW) / 2;
      const SIDES = [
        { x, head: '2026: показываем проблему', sub: 'продуктовый, иллюстративный', color: C.crimson,
          img: path.join(D.MEDIA, 'img_457d3418c8.jpg'), ratio: 1080 / 1350, alt: 'Креатив Динобутин 2026',
          cap: 'Симптом считывается, но ситуация остается абстрактной' },
        { x: x + sw + AW, head: '2027: показываем ребенка', sub: 'живой сюжет с ситуацией', color: C.blue,
          img: path.join(D.CROPS, 'c_creative_2027.png'), ratio: 320 / 482, alt: 'Креатив Динобутин 2027',
          cap: 'Родитель узнает знакомый момент, затем считывает решение в виде бренда' },
      ];
      // шапки сторон
      const hh = 10 + Math.max(...SIDES.map((sd) => measure(sd.head, sw - 24, 18, true, 1.1))) + 4
        + Math.max(...SIDES.map((sd) => measure(sd.sub, sw - 24, 16))) + 10;
      SIDES.forEach((sd) => {
        s.box({ x: sd.x, y, w: sw, h: hh, fill: sd.color === C.crimson ? tintOf(C.crimson, 0.09) : C.cardTint, r: 14 });
        const h1 = s.text(sd.head, { x: sd.x + 12, y: y + 10, w: sw - 24, size: 18, bold: true, lh: 1.1, color: sd.color, align: 'center' });
        s.text(sd.sub, { x: sd.x + 12, y: y + 10 + h1 + 4, w: sw - 24, size: 16, lh: 1.2, color: C.navy, align: 'center' });
      });
      y += hh + 14;
      // главный сдвиг 2027 + формула нового креатива — внизу колонки (в исходнике формула — полосой под «главным сдвигом»)
      const shiftT = 'Не усложнять сегментацию, а усилить эмоциональную и жизненную визуализацию уже найденных оккейженов: ребенок становится первым кадром истории';
      const formula = 'Формула нового креатива: ребенок → узнаваемая ситуация → проблема → Динобутин как решение';
      const SI = 44;
      const stw = w - 28 - SI - 14;
      const fh = measure(formula, w - 28, 17, true, 1.2) + 24;
      const shH = 14 + 24 + 6 + measure(shiftT, stw, 16) + 14 + fh;
      const shY = CY0 + CH - 20 - shH;
      // подписи под креативами
      const capH = Math.max(...SIDES.map((sd) => measure(sd.cap, sw - 24, 16, true, 1.2))) + 22;
      const IH = Math.min(Math.round(sw / SIDES[0].ratio), shY - 14 - capH - 12 - y);
      SIDES.forEach((sd) => {
        const iw = Math.round(IH * sd.ratio);
        s.image(sd.img, { x: sd.x + (sw - iw) / 2, y, w: iw, h: IH, alt: sd.alt });
        const cy = y + IH + 12;
        s.box({ x: sd.x, y: cy, w: sw, h: capH, fill: C.white, stroke: tintOf(sd.color, 0.35), sw: 1.5, r: 12 });
        s.text(sd.cap, { x: sd.x + 12, y: cy, w: sw - 24, h: capH, size: 16, bold: true, lh: 1.2, color: C.navy, align: 'center', valign: 'middle' });
      });
      s.arrow({ dir: 'right', x: x + sw + 10, y: y + IH / 2, len: AW - 20, head: 24, headLen: 13, stem: 5, color: C.navy });
      // главный сдвиг
      s.box({ x, y: shY, w, h: shH, fill: C.cardTint, r: 14 });
      s.icon('tb:TbTrendingUp', { x: x + 14, y: shY + 14, size: SI, circle: C.blue });
      s.text('Главный сдвиг 2027', { x: x + 14 + SI + 14, y: shY + 14, w: stw, size: 20, bold: true, lh: 1.1, color: C.navy });
      s.text(shiftT, { x: x + 14 + SI + 14, y: shY + 14 + 24 + 6, w: stw, size: 16, lh: 1.2, color: C.navy });
      // формула — синей полосой по низу блока
      s.box({ x, y: shY + shH - fh, w, h: fh, fill: C.blue, r: 14 });
      s.text(formula, { x: x + 14, y: shY + shH - fh, w: w - 28, h: fh, size: 17, bold: true, lh: 1.2, color: C.white, align: 'center', valign: 'middle' });
    }

    // ---------- 3 · Инсайты и доработка 2027 ----------
    {
      const c = cols[2];
      const x = c.x + PAD;
      const w = c.w - PAD * 2;
      s.card({ x: c.x, y: CY0, w: c.w, h: CH });
      let y = colHead(s, { x, y: CY0 + 20, w, n: 3, title: 'Инсайты и доработка 2027' }) + 18;
      const INS = [
        { n: '01', color: C.purple, head: 'Ребенок — визуальный якорь',
          text: 'Симптом показываем через эмоцию, позу и поведение ребенка: держится за живот, отказывается от еды / игры, выглядит уставшим' },
        { n: '02', color: C.blue, head: 'Оккейжн → жизненная сцена',
          text: 'Абстрактный симптом переводим в понятный момент: дома, перед школой, в поездке или в гостях' },
        { n: '03', color: C.green, head: 'Продукт — финальное решение',
          text: 'Сначала родитель узнает ситуацию с ребенком, затем видит проблему и после этого — Динобутин и benefit' },
      ];
      const fin = '**Итог:** рациональную персонализацию сохраняем, но очеловечиваем ее — ребенок становится центром истории, а Динобутин естественно закрывает знакомую родителю ситуацию';
      const IS = 18;
      const fh = measure(fin, w - 28, IS) + 28;
      const BD = 42;
      const tw = w - 28 - BD - 14;
      const blockH = (it) => 16 + measure(it.head, tw, 21, true, 1.1) + 8 + measure(it.text, tw, IS) + 18;
      const total = INS.reduce((a, it) => a + blockH(it), 0);
      const fy = CY0 + CH - 20 - fh;
      const G = Math.max(12, (fy - 18 - y - total) / INS.length);   // равные зазоры, последний — перед «Итогом»
      INS.forEach((it) => {
        const bh = blockH(it);
        s.box({ x, y, w, h: bh, fill: tintOf(it.color, 0.09), r: 14 });
        s.badge({ x: x + 14, y: y + 14, d: BD, n: it.n, color: it.color, size: 17 });
        const ty = y + 16 + (BD - 2 - 23) / 2;
        const hy = s.text(it.head, { x: x + 14 + BD + 14, y: ty, w: tw, size: 21, bold: true, lh: 1.1, color: C.navy });
        s.text(it.text, { x: x + 14 + BD + 14, y: ty + hy + 8, w: tw, size: IS, lh: 1.2, color: C.blueText });
        y += bh + G;
      });
      s.box({ x, y: fy, w, h: fh, fill: tintOf(C.crimson, 0.08), r: 14 });
      s.text(fin, { x: x + 14, y: fy + 14, w: w - 28, size: IS, lh: 1.2, color: C.navy });
    }
  },

  // =====================================================================
  // 14 · Переход 2026 → 2027  (аналоги — Normobact 15, Bobotic 12)
  // =====================================================================
  14: (d) => {
    const s = d.slide({
      title: 'Переход от работы преимущественно со сформированным спросом в 2026',
      subtitle: 'к раннему объяснению проблемы, формированию знания и последующей конвертации интереса в выбор бренда в 2027',
    });
    const LW = 800;
    const AW = 70;
    const L = { x: X0, w: LW };
    const R = { x: X0 + LW + AW, w: X1 - X0 - LW - AW };
    const YH = 44;
    s.text('2026', { x: L.x, y: TOP - 6, w: L.w, h: YH, size: 34, bold: true, lh: 1.0, color: C.navy, align: 'center', valign: 'middle' });
    s.text('2027', { x: R.x, y: TOP - 6, w: R.w, h: YH, size: 34, bold: true, lh: 1.0, color: C.blue, align: 'center', valign: 'middle' });
    const KY = TOP + YH + 8;

    // ---------- 2026: четыре карточки результатов ----------
    const RES = [
      { label: 'Собственный спрос', color: C.crimson,
        m: [{ v: '+181%', c: 'brand search Jun–Aug vs Jan–Feb' }, { v: '+5%', c: 'категория' }] },
      { label: 'Search = performance core H1', color: C.blue,
        m: [{ v: '2,05%', c: 'CTR' }, { v: '138 тыс.', c: 'кликов' }, { v: '55 тыс.', c: 'качественных визитов' }] },
      { label: 'ORM = trust core', color: C.green,
        m: [{ v: '4,03', c: 'рейтинг' }, { v: '100%', c: 'TOP-результатов позитивные' }] },
      { label: 'Сигналы по сегментам', color: C.orange,
        lines: ['«Диета/режим» и «хронические боли» — **лучшие сигналы**', '«Стресс-живот» — **validate**'] },
    ];
    const KG = 14;
    const KH = (BOT - KY - KG * (RES.length - 1)) / RES.length;
    const pad = 28;
    RES.forEach((r, i) => {
      const y = KY + i * (KH + KG);
      s.card({ x: L.x, y, w: L.w, h: KH });
      s.box({ x: L.x + 3, y: y + 18, w: 6, h: KH - 36, fill: r.color, r: 3 });
      const x = L.x + pad;
      const w = L.w - pad * 2;
      s.label(r.label, { x, y: y + 20, w, size: 21, color: r.color });
      const by = y + 20 + 21 + 14;
      const bodyH = y + KH - 20 - by;
      if (r.m) {
        // ширина метрики — по цифре или подписи (подпись в одну строку), метрики подряд слева направо
        const VS = 40;
        const CS = 17;
        const mw = r.m.map((m) => Math.max(widthOf(m.v, VS, true), widthOf(m.c, CS)) + 56);
        const mh = VS + 8 + CS * 1.2;
        const my = by + Math.max(0, (bodyH - mh) / 2) - 4;
        let mx = x;
        r.m.forEach((m, k) => {
          const cw = k === r.m.length - 1 ? x + w - mx : mw[k];
          s.text(m.v, { x: mx, y: my, w: cw - 8, size: VS, bold: true, lh: 1.0, color: C.navy, fit: true, maxLines: 1, minSize: 30 });
          s.text(m.c, { x: mx, y: my + VS + 8, w: cw - 8, size: CS, lh: 1.2, color: C.blueText });
          if (k) s.vline(mx - 24, my + 4, mh - 4);
          mx += mw[k];
        });
      } else {
        const t = r.lines.join('\n');
        const th = measure(t, w, 19, false, 1.35);
        s.text(t, { x, y: by + Math.max(0, (bodyH - th) / 2) - 4, w, size: 19, lh: 1.35, color: C.navy });
      }
    });

    // стрелка 2026 → 2027
    s.arrow({ dir: 'right', x: L.x + L.w + 12, y: (KY + BOT) / 2, len: AW - 24, head: 40, headLen: 22, stem: 12, color: C.crimson });

    // ---------- 2027: четыре шага ----------
    s.card({ x: R.x, y: KY, w: R.w, h: BOT - KY, tint: true });
    const STEPS = [
      { head: 'Сохраняем доказанное ядро', text: 'Search + ORM остаются обязательной базой конверсии и доверия' },
      { head: 'Добавляем brand-building layer', text: 'Awareness + Consideration до активного поиска: CTV/OLV, сегментная медийная поддержка, релевантный путь.' },
      { head: 'Управляем сегментами от результатов', text: '«Диета/Режим, Хронические боли» — **Scale**\n«Стресс-живот» — **Validate**\n«Нестабильный стул» — **Develop**' },
      { head: 'Масштабируем только после доказательства', text: 'Sprint 1 → BLS/Search/CR/Sales Lift → **Scale / Optimize / Stop**' },
    ];
    {
      const rp = 36;
      const x = R.x + rp;
      const w = R.w - rp * 2;
      const SQ = 54;
      const tx = x + SQ + 24;
      const tw = x + w - tx;
      const hs = STEPS.map((st) => 24 + 8 + measure(st.text, tw, 19, false, 1.3));
      const y0 = KY + 24;
      const G = (BOT - 24 - y0 - hs.reduce((a, b) => a + b, 0)) / STEPS.length;
      let y = y0 + G / 2;
      STEPS.forEach((st, i) => {
        if (i) s.hline(x, y - G / 2, w);
        s.box({ x, y: y - 2, w: SQ, h: SQ, fill: C.blue, r: 12 });
        s.text(String(i + 1), { x, y: y - 2, w: SQ, h: SQ, size: 26, bold: true, lh: 1.0, color: C.white, align: 'center', valign: 'middle' });
        s.text(st.head.toUpperCase(), { x: tx, y, w: tw, size: 22, bold: true, lh: 1.05, color: C.navy, fit: true, maxLines: 1, minSize: 18 });
        s.text(st.text, { x: tx, y: y + 24 + 8, w: tw, size: 19, lh: 1.3, color: C.blueText });
        y += hs[i] + G;
      });
    }
  },

  // =====================================================================
  // 15 · Динобутин 2027: от перехвата спроса к устойчивому выбору  (аналоги — Bobotic 20, Normobact 19)
  // =====================================================================
  15: (d) => {
    const s = d.slide({
      title: 'Динобутин 2027: от перехвата спроса к устойчивому выбору',
      subtitle: 'В 2026 Digital в основном работал с уже возникшим интересом; в 2027 сохраняем конверсионное ядро и расширяем слои влияния до момента выбора',
    });
    const ROLES = [
      { color: ROLE.capture, name: 'CAPTURE & CONVERT', tools: 'Paid Search + GEO/AEO + Внешние публикации + ORM',
        role: 'Перехватываем сформированный спрос; выходим в AI-поиск, защищаем выбор и поддерживаем репутацию до действия',
        st: '2026 CORE → сохраняем и усиливаем эффективность AON', chain: 'Capture & convert' },
      { color: ROLE.demand, name: 'BUILD NEW DEMAND', tools: 'CTV + OLV in-stream',
        role: 'Формируем знание, помогаем маме узнать знакомую ситуацию и связать ее с брендом, объясняем разные проявления функциональных нарушений ЖКТ до возникновения активного поиска, создаем спрос',
        st: 'NEW 2027 → системный brand-building layer, Sprints', chain: 'Build new demand' },
      { color: ROLE.consider, name: 'PERSONALIZE CONSIDERATION', tools: 'Data & AI Programmatic + Native + Social (MAX)',
        role: 'Продолжаем сегментный путь после видеоконтакта: находим пользователя по сигналу потребности, персонализируем сообщение и ведём к Search / покупке',
        st: '2027 EXTENDED → от таргетинга к сегментному пути, Sprints', chain: 'Personalize Consideration' },
      { color: ROLE.trust, name: 'BUILD TRUST & SUPPORT CHOICE', tools: 'Bloggers + Social',
        role: 'Добавляем живые истории и экспертный proof-layer в social',
        st: '2027 EXTENDED → trust layer + scale after proof, Sprints', chain: 'Support choice' },
    ];

    // ---------- полоса 2026 → 2027 ----------
    const SH = 84;
    const CHV = 56;
    const HW = (X1 - X0 - CHV) / 2;
    const yl = (t, x, color) => {
      s.text(t, { x, y: TOP, w: 90, h: SH, size: 28, bold: true, lh: 1.0, color, valign: 'middle' });
      s.vline(x + 90, TOP + 20, SH - 40, C.line, 2);
      return x + 90 + 22;
    };
    s.box({ x: X0, y: TOP, w: HW, h: SH, fill: C.cardTint, r: 18 });
    let tx = yl('2026', X0 + 26, C.navy);
    s.text('Search + ORM / performance + CTV test → сформированный спрос', { x: tx, y: TOP, w: X0 + HW - 20 - tx, h: SH, size: 19, bold: true, lh: 1.2,
      color: C.navy, valign: 'middle', fit: true, maxLines: 2, minSize: 16 });
    s.chevron({ cx: X0 + HW + CHV / 2, cy: TOP + SH / 2, w: 20, h: 32, dir: 'right', color: C.navy });
    const R2 = X0 + HW + CHV;
    s.box({ x: R2, y: TOP, w: HW, h: SH, fill: C.cardTint, r: 18 });
    tx = yl('2027', R2 + 26, C.crimson);
    // цепочка ролей — каждое имя своим цветом роли
    const runs = [];
    ROLES.forEach((r, i) => {
      runs.push({ text: r.chain, options: { color: r.color, bold: true } });
      // перенос — после второй роли: строки ровные, стрелка не начинает строку
      if (i < ROLES.length - 1) runs.push({ text: i === 1 ? '  →' : '  →  ', options: { color: C.navy, bold: true, breakLine: i === 1 } });
    });
    s.text(runs, { x: tx, y: TOP, w: X1 - 20 - tx, h: SH, size: 19, lh: 1.25, valign: 'middle' });

    // ---------- четыре роли ----------
    const KY = TOP + SH + 24;
    const KH = CB - KY;
    const cols = columns(4, { gap: 22 });
    const pad = 26;
    const BD = 50;
    const NS = 23;    // имя роли
    const TS = 21;    // инструменты
    const RS = 20;    // роль
    const LS = 17;    // метки
    const cw0 = cols[0].w - pad * 2;
    const nameW = cw0 - BD - 14;
    // одинаковые высоты блоков в соседних колонках
    const nameH = Math.max(BD, ...ROLES.map((r) => measure(r.name, nameW, NS, true, 1.05)));
    const toolsH = Math.max(...ROLES.map((r) => measure(r.tools, cw0, TS, true, 1.2)));
    const roleH = Math.max(...ROLES.map((r) => measure(r.role, cw0, RS, false, 1.25)));
    const stH = Math.max(...ROLES.map((r) => measure(r.st, cw0 - 28, 17, true, 1.2))) + 26;
    const fixed = 22 + nameH + (LS + 8 + toolsH) + (LS + 8 + roleH) + stH + 20;
    const G = Math.max(18, Math.min(60, (KH - fixed) / 3));   // промежутки: после имени, после инструментов, перед статусом
    ROLES.forEach((r, i) => {
      const c = cols[i];
      const x = c.x + pad;
      const w = c.w - pad * 2;
      s.card({ x: c.x, y: KY, w: c.w, h: KH, fill: tintOf(r.color, 0.04), stroke: tintOf(r.color, 0.45) });
      let y = KY + 22;
      s.badge({ x, y: y + (nameH - BD) / 2, d: BD, n: i + 1, color: r.color, size: 24 });
      const nh = measure(r.name, nameW, NS, true, 1.05);
      s.text(r.name, { x: x + BD + 14, y: y + (nameH - nh) / 2, w: nameW, size: NS, bold: true, lh: 1.05, color: r.color });
      y += nameH + G;
      s.label('Инструменты', { x, y, w, size: LS, color: r.color });
      y += LS + 8;
      s.text(r.tools, { x, y, w, size: TS, bold: true, lh: 1.2, color: C.navy });
      y += toolsH + G;
      s.label('Роль', { x, y, w, size: LS, color: r.color });
      y += LS + 8;
      const sy = KY + KH - 20 - stH;
      s.text(r.role, { x, y, w, h: sy - 10 - y, size: RS, lh: 1.25, color: C.navy, fit: true, minSize: 16 });
      s.box({ x, y: sy, w, h: stH, fill: C.white, stroke: tintOf(r.color, 0.45), sw: 1.5, r: 14 });
      s.text(r.st, { x: x + 14, y: sy, w: w - 28, h: stH, size: 17, bold: true, lh: 1.2, color: r.color, valign: 'middle' });
    });
    s.principle({ label: 'Логика 2027', icon: 'flow',
      text: 'Сохранить работающий спрос → создать новый спрос → перевести его в рассмотрение → усилить доверие и довести до выбора' });
  },
};
