# Translator brief — Akrikhin brand strategy decks (RU → EN)

Working folder: the project root (the folder with `AGENTS.md`); paths below are relative to it.

You are a senior marketing translator/copywriter (native-level English, pharma and media marketing background). The deck is OMD’s 2027 brand strategy for an Akrikhin brand; readers are the client’s marketing team. The English deck is built from the same code as the Russian one: every Russian string is replaced by your translation at build time, and the layout re-flows.

## Read first
1. `work/brands/STYLE_GUIDE_EN.md` — voice, format rules (markup `**…**`, `[[…]]`, line breaks), numbers, base glossary. Binding.
2. `work/brands/glossary_en.md` — terms already settled for this series. Binding; add nothing to it yourself — list proposals in your report.
3. Your batch: `work/brands/<brand>/tr/batch_K.json` — items `{id, slide, ru}`; `slide` is the slide number in the **source** deck.
4. Context: the rebuilt Russian slides — `out/render/<brand>_ru/slide-NN.png` (NN — position in the new deck; it can differ from the source number by ±1–2, find the slide by its text) and the original source slides `work/brands/<brand>/src/slide-NN.png` (NN = source number). Look at them: they tell you what is a title, a label, a bullet, a chart axis.

## Do
- Translate every item; keep markup pairs and line-break counts exactly; ALL CAPS stays caps.
- Length ≤ Russian (characters). Titles, labels, chips, chart categories — tighter still.
- Same Russian → same English across the batch. Chart labels: short standard forms (Jan, Feb, Q1, M, F, YoY, pp, RUB M).
- Numbers: decimal point, thousands comma (the build also converts automatically, but write them right).
- Product names: Latin brand names (Acriol Pro, EMLA, Anesta, Gleisa…); keep Latin/English terms already in the source (AON, SOV, DOLs, Paid Search, GEO/AEO…).
- Read each line as a native marketer would. If it sounds translated or AI-generated, rewrite it — same facts, plain human English.

## Output
Write `work/brands/<brand>/tr/out_K.json` — one JSON object `{ "<id>": "<english>" }` (valid UTF-8 JSON, `\n` for line breaks). Then run:
```bash
python3 work/brands/tr_tools.py check <brand> K
```
Fix every error; resolve length warnings unless truly impossible (then mention it).

## Report (short)
Batch, item count, checker status; terms you were unsure about (RU → your choice); anything ambiguous or wrong in the source; glossary proposals.
