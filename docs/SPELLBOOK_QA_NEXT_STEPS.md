# Spellbook QA Continuation Prompt

Copy this prompt into a new chat to continue the spellbook spellcard QA work.

---

## Context

We just completed a major spellbook formatting overhaul (Phase 1-4). Here's what was done:

### Already Completed
1. **CSS Header Color Unification** — All spell card headers now use a single dark Pathfinder red gradient (`#7a3b2e → #5e2e23 → #45211a`) across all 7 rendering contexts. Removed 15+ competing `!important` CSS rules.
2. **Canonical Damage Type Color Map** — `SpellCardUtils.js` is now the single source of truth for damage type colors using a dark Pathfinder RPG palette. CSS variables in `variables.css`, badge colors in `cards.css`, school accents in `Step3Abilities.css`, and border colors in `wow-classic.css` all updated to match.
3. **Data Migration** — Migrated `acid→poison` (dreadnaughtData.js), `thunder→lightning` (minstrelData.js, berserkerData.js), and `cold→frost` (dreadnaughtData.js) in structured data fields. Added `level` to 11 lichborne spells.
4. **QA Script** — Created `scripts/spell-qa.mjs` for automated validation.

### Canonical Damage Types (15)
`fire`, `frost`, `lightning`, `nature`, `bludgeoning`, `piercing`, `slashing`, `force`, `psychic`, `radiant`, `arcane`, `necrotic`, `poison`, `void`, `chaos`
Plus general categories: `physical`, `magical`

### Alias Resolution (in SpellCardUtils.js color lookup)
`cold/ice→frost`, `shadow→necrotic`, `holy→radiant`, `electric→lightning`, `acid→poison`, `thunder→lightning`, `physical→bludgeoning`

### Key Files (Single Source of Truth)
- **Colors**: `vtt-react/src/components/spellcrafting-wizard/components/common/SpellCardUtils.js` — `DAMAGE_TYPE_COLORS` constant + `getDamageTypeColor()` + `getBorderColor()`
- **CSS Variables**: `vtt-react/src/components/spellcrafting-wizard/styles/pathfinder/core/variables.css` — `--pf-fire` through `--pf-slashing`
- **CSS Badges**: `vtt-react/src/components/spellcrafting-wizard/styles/pathfinder/components/cards.css` — `.pf-damage-type-badge.<type>` classes
- **Spell Data Reference**: `docs/SPELL_DATA_REFERENCE.md` (3,334 lines — definitive guide)
- **QA Script**: `scripts/spell-qa.mjs`
- **Full QA Report**: `scripts/spell-qa-full-report.txt`

---

## Remaining Work

### Task 1: Migrate remaining legacy damage type names in free text and tags

There are **106 remaining references** to `acid`, `thunder`, and `cold` across **12 class data files** that need migration. Structured data fields were fixed; these are mostly tags arrays, damage strings, and description text.

**Priority order (by count):**

| File | Legacy Term | Count | What to fix |
|------|------------|-------|-------------|
| `lichborneData.js` | `cold` | 50 | 48 tag arrays + id/name/description refs |
| `formbenderData.js` | `cold` + `thunder` | 12 | tags, damage strings, effect text |
| `spellguardData.js` | `cold` | 10 | elements array + description text |
| `inscriptorData.js` | `cold` | 10 | description/example text |
| `arcanoneerData.js` | `cold` | 5 | description text |
| `minstrelData.js` | `thunder` | 5 | tags arrays + description text |
| `chaosWeaverData.js` | `acid` | 4 | effect strings (damageType already fixed to 'poison') |
| `toxicologistData.js` | `acid` | 5 | description/example text |
| `deathcallerData.js` | `cold` | 3 | description text |
| `titanData.js` | `cold` | 3 | structured: element, type, formula fields |
| `berserkerData.js` | `thunder` | 1 | description text |
| `gamblerData.js` | `thunder` | 1 | effect string |
| `plaguebringerData.js` | `cold` | 1 | string in array |
| `pyrofiendData.js` | `cold` | 1 | example text |
| `dreadnaughtData.js` | `cold` | 2 | tutorial text |

**Rules for migration:**
- In `tags` arrays: replace `'cold'` with `'frost'`, `'thunder'` with `'lightning'`, `'acid'` with `'poison'`
- In `description` text: replace damage type references (e.g., "cold damage" → "frost damage", "thunder damage" → "lightning damage")
- In structured fields (`damage`, `element`, `type`, `formula`, `elements`): replace the value
- **DO NOT** replace "cold" when used as an English adjective (temperature, metaphor). There are ~22 instances of legitimate "cold" as adjective (e.g., "cold fury", "cold blue light", "supernatural cold"). See the excluded list below.
- In `effect` strings where the `damageType` is already `'poison'` but text says "acid" — update the text to match

**Excluded "cold" (NOT damage type — do not change):**
- lichborneData.js: lines 37, 43, 47, 103, 125, 136, 218, 305
- deathcallerData.js: line 122
- arcanoneerData.js: lines 194, 695, 996, 1424

### Task 2: Trim 52 long descriptions

52 spells across the class data files have descriptions over 200 characters. These should be reviewed and tightened. The full list is in `scripts/spell-qa-full-report.txt`. Many of these are in `lichborneData.js`, `covenbaneData.js`, and other class files.

**Approach:** For each spell, read the description, tighten it to be concise while preserving the flavor, and edit in place. Target: under 180 characters for most.

### Task 3: Visual spot-check

After text migration, render sample spell cards from several classes in the browser to verify:
- Header color is consistent dark red across all contexts (spellbook, library, rules, character creation, creature wizard)
- Damage type badge colors match the dark RPG palette
- No raw formula tokens (CARD_VALUE, HEADS_COUNT, etc.) visible on cards
- Tags show canonical names (frost, not cold; lightning, not thunder)

### How to run the QA script
```bash
node scripts/spell-qa.mjs
```

### Class data file locations
All 28 class data files: `vtt-react/src/data/classes/<className>Data.js`
- arcanoneer, berserker, bladedancer, chaosWeaver, chronarch, covenbane, deathcaller, dreadnaught, exorcist, falseProphet, fateWeaver, formbender, gambler, huntress, inscriptor, lichborne, lunarch, martyr, minstrel, oracle, plaguebringer, primalist, pyrofiend, spellguard, titan, toxicologist, warden, witchDoctor
