# Editor brief — English brand strategy deck, final language pass

Working folder: the project root (the folder with `AGENTS.md`).

Several translators translated one Akrikhin brand strategy deck (RU → EN), each a slide range. You are the senior editor: one voice, one terminology, human and easy to read. Audience: the client’s pharma marketing team.

## Read first
1. `work/brands/STYLE_GUIDE_EN.md` and `work/brands/glossary_en.md` (binding).
2. Humanizer guidance as a checklist: the `humanizer` skill if it is installed (`~/.claude/skills/humanizer/SKILL.md` or `~/.codex/skills/humanizer/SKILL.md`; otherwise use the checklist in this brief and `STYLE_GUIDE_EN.md`) (AI vocabulary, negative parallelisms, rule of three, filler, inflated significance, promotional tone). **Don’t** load the author voice profile in `voice/` (it’s Russian). Double-check every humanizer-style change: slides are fragments, labels and formulas by design — no prose, no added opinions, never change facts or numbers.
3. `work/brands/<brand>/tr/review.md` — every string: id, Russian, current English, grouped by source slide. Renders for context: `out/render/<brand>_ru/slide-NN.png`, source `work/brands/<brand>/src/slide-NN.png`.

## Fix
Terminology drift (one term deck-wide, consistent with the glossary and earlier decks); translated-sounding or AI-sounding English; grammar, articles, collocations; parallel structure of lists and labels; meaning errors vs the Russian (dropped facts, wrong numbers/units); length (English ≤ Russian). Keep markup pairs `**…**` / `[[…]]` and the number of `\n` exactly. Minimal, purposeful edits.

## Output
1. `work/brands/<brand>/tr/edits.json` — only changed items `{ "<id>": "<new english>" }`.
2. `python3 work/brands/tr_tools.py merge <brand>` — builds `en.json` (out_* + your edits) and refreshes review.md.
3. Append settled terms (RU → EN) for future brand decks to `work/brands/glossary_en.md` (right section), keep it short.
4. Short report: terminology decisions, kinds of fixes, what the client should double-check.

## Decisions for Acriol Pro (apply deck-wide, then add to glossary)
- врачи-косметологи / косметологи (doctors) → **aesthetic doctors** (not “cosmetologists” — in US English that means beauty-school professionals); тесно в подписях графика — “Aesthetic drs” нельзя, лучше “Doctors”.
- косметология (аппаратная / инъекционная) → **aesthetics** (device-based / injectable aesthetics).
- мастера (лазерная эпиляция, ПМ, тату) → **beauty technicians** (in tight labels: **Technicians**); not “masters”, not “practitioners”.
- ПМ / татуаж → **PMU**; эпиляция → **hair removal** where space allows, **epilation** only in very tight chart labels.
- потребители услуг → **beauty clients**.
- РСЯ → **YAN (Yandex Advertising Network)** on first use in the deck, then **YAN**.
- Дзен → **Dzen**.
- Money: **RUB 4.2M**, **RUB 800K**; after a big standalone number use “**RUB M**” style consistently (or put the unit before: “RUB 9.5M”) — pick one deck-wide, readable.
- «АК / РС» in budget footnotes: АК = agency commission, РС = рекламный сбор (Russian advertising levy) → “incl. agency commission and ad levy”.
- Translators used “beauty pros”, “practitioners”, “technicians”, “cosmetologists”, “device-based cosmetology” — replace per the decisions above.
