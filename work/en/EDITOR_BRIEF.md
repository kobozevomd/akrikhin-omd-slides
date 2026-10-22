# Editor brief — English deck, final language pass

Working folder: `<корень проекта>/work/en`

Six translators translated the deck “Akrikhin Trends · Comprehensive 2027” (52 slides) from Russian into English, each a different slide range. You are the **senior editor**: one voice, one terminology, human and easy to read. The audience is the marketing team of a large pharma company.

## Read first
1. `STYLE_GUIDE.md` — voice, format rules, glossary (binding).
2. The humanizer guidance: the `humanizer` skill if it is installed (`~/.claude/skills/humanizer/SKILL.md` or `~/.codex/skills/humanizer/SKILL.md`; otherwise use the checklist in this brief and `STYLE_GUIDE_EN.md`) — use its pattern catalogue (AI vocabulary, negative parallelisms, rule of three, filler, inflated significance, promotional tone, em-dash overuse in running prose, etc.) as a checklist. **Do not** load the author voice profile in `voice/` — it describes Russian texts, not this deck. **Double-check every humanizer-style change**: slides are fragments, labels and formulas by design — don't turn them into prose, don't remove structural arrows/slashes/dashes that the layout relies on, don't add personality or opinions, never change facts or numbers.
3. `review.md` — the whole deck side by side: for every slide, each item’s id, the Russian and the current English. Look at slide renders for context when needed: `../../out/render/ru_src/slide-NN.png`.
4. The merged translation is `merged.json` (`{id: english}`); the source items are `source.json` (has `tags` counts).

## What to fix
- **Terminology drift** across slides (same Russian term → different English). Make it one term deck-wide, per glossary; where the glossary is silent, pick the best and apply everywhere.
- **Literal / translated-sounding English** (“implementation of personalization is carried out…”), calques, wrong collocations, article errors, unnatural word order.
- **AI-sounding phrasing** and agency clichés (see style guide + humanizer catalogue).
- **Consistency of headings/labels** (sentence case for titles, caps where the source is caps, parallel structure in lists).
- **Meaning errors** versus the Russian (mistranslations, dropped facts, wrong numbers or units, decimal commas left in place).
- Length: English must not be longer than the Russian for on-slide text (`kind` slide/chartstr). Tighten if needed.

Keep tags `[n]…[/n]` and the number of `\n` exactly as in the current English (they are already validated). Leave items alone if they are fine — minimal, purposeful edits.

## Output
1. `edits.json` — only the items you change: `{ "<id>": "<new english>" }`.
2. Run `python3 merge_edits.py` (applies edits.json to merged.json → merged_final.json and validates tags/line breaks/Cyrillic/length). Fix anything it reports.
3. Short report: terminology decisions you made (RU → EN), the kinds of fixes, anything you think the client should double-check (e.g. brand spellings, ambiguous source).

## Known issues from translators (must fix)
- «ГВ / ИВ / смесь» (Bobotic test, ORM slide) = breastfeeding / formula feeding / **mixed feeding** — not “breast / formula”. Use e.g. “Breastfed / formula / mixed” (keep it short) wherever it appears, including its explanation line.
- Spelling of “AI video” vs “AI-video” differs between batches — pick one deck-wide (recommend “AI video” as a noun, “AI-video” only as a compound modifier is also acceptable, but be consistent).
- Dates: some batches wrote “Aug 27, 2026”, others may keep dd.mm.yyyy — unify to “Aug 27, 2026” style.
- «РЕЗУЛЬТАТ / РЕЗУЛЬТАТ AI / Результат:» rendered as RESULT / AI OUTPUT / Output — check they read naturally and consistently.
- «блогеры / инфлюенсеры / авторы»: influencer(s) / creator(s) — make consistent deck-wide.
- Slide numbers inside speaker notes («Слайд 25 …») are internal labels — fine as “Slide 25 …”.
- Retail turnover slide: «ТОВАРЫ / ОБЩЕПИТ / ПРОДУКТЫ / УСЛУГИ» = Rosstat breakdown: non-food goods / food service / food / services → use **NON-FOOD / FOOD SERVICE / FOOD / SERVICES** (and the same in chart series names and line-end labels, lower case where the source is lower case).
- «Минэкономразвития» was shortened to “Economy Ministry” where space is tight — acceptable; use it consistently.
