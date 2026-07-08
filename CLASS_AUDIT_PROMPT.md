# Class Spell Audit — Continuation Prompt

## Goal
Critically assess all 20 class spell arrays for **lore fit, variety, richness, and compliance** with `docs/SPELL_DATA_REFERENCE.md` and `docs/CLASS_AUDIT_STANDARDS.md`. This is the creative/design assessment phase — "does this spell belong in this class?" — plus remaining grimdark name cleanup.

## Project Location
- Working directory: `D:\VTT`
- Class data files: `vtt-react/src/data/classes/*Data.js` (20 files)
- Reference docs: `docs/SPELL_DATA_REFERENCE.md`, `docs/CLASS_AUDIT_STANDARDS.md`, `docs/ABILITY_AUDIT.md`

## What's Already Done (DO NOT REDO)

### Mechanical Compliance — COMPLETE ✅
All 20 classes have been verified:
- **642 total spells** across 20 files
- **0 missing verbalText/somaticText** — every spell with `components: ["verbal", ...]` or `["somatic", ...]` has matching text fields
- **0 invalid schools** — all within canonical 9-school list (physical, ember, rime, storm, arcane, primal, blight, wyrd, divine)
- **159 triggerConfig blocks** documenting self-damage/sacrifice mechanics across 15 classes
- **All ESM imports succeed**, all braces balanced
- **1 orphaned spellPool ID fixed** (Arcanoneer: `arc_aetheric_lantern`)
- **Syntax errors fixed** (Gambit bare comma, Toxicologist formatting)

### Grimdark Name Renames — PARTIAL (4 of 20 classes done)
- **Animist** (32 spells): Fixed 2 invalid schools (force→arcane, sacred→divine). No name renames needed.
- **Augur** (33 spells): 23 grimdark names renamed
- **Warden** (33 spells): 7 grimdark names renamed
- **Shaper** (31 spells): 1 rename (Frantic Laceration→Frantic Rend)

### triggerConfig — COMPLETE ✅
| Class | Count | Theme |
|-------|-------|-------|
| Berserker | 22 | (pre-existing) |
| Warden | 23 | Tether Strain |
| Shaper | 21 | Kinetic Toll |
| Augur | 19 | Fate's Toll |
| Lunarch | 14 | Parasitic Toll |
| Chronarch | 16 | Chronal Recoil |
| Animist | 13 | Blood Price |
| Revenant | 9 | Blood Sacrifice |
| FalseProphet | 8 | Blood Toll |
| Martyr | 8 | Sacred Sacrifice |
| Arcanoneer | 5 | Aetheric Recoil |
| Gambit | 4 | Karmic Reckoning |
| Harbinger | 4 | (pre-existing) |
| Inquisitor | 4 | (pre-existing) |
| Pyrofiend | 3 | (pre-existing) |

## What Remains To Be Done

### 1. Lore Fit Assessment (ALL 20 classes)
For each class, read every spell and assess:
- Does the spell's name, description, and mechanics thematically fit the class identity?
- Are there spells that feel like they belong in a different class?
- Do the spells collectively tell a cohesive story about what this class IS?
- Are the damage types and schools consistent with the class theme?

### 2. Variety Assessment (ALL 20 classes)
- Are spells mechanically repetitive (too many single-target damage rolls with no twists)?
- Does each spell level offer meaningful tactical choices?
- Are there duplicate or near-duplicate spells?
- Is there good spread across damage/utility/buff/debuff/control?

### 3. Richness Assessment (ALL 20 classes)
- Are spell descriptions vivid and specific, or generic filler?
- Do mechanics have interesting tradeoffs and decision points?
- Are higher-level spells dramatically more powerful/interesting than lower ones?
- Do spells interact with the class's unique resource system meaningfully?

### 4. Grimdark Name Cleanup (16 classes remaining)
Per `CLASS_AUDIT_STANDARDS.md` §1.D: No grimdark names. A grimdark name evokes body horror, excessive violence, or nihilistic darkness that undermines the heroic fantasy tone.

**Classes with known grimdark name issues (flagged but not yet addressed):**
- **FalseProphet** (37 spells): WORST OFFENDER. 30+ extremely dark names: "Blood Sermon", "Blood Tithe", "Communion of Blood", "Stitch of Suffering", "Parasitic Link", "Empathetic Agony", "Heresy of the Flesh", "Devouring Omen", etc. The class IS thematically dark (corrupt faith leader), but many names cross from "dark fantasy" into "body horror."
- **Arcanoneer** (34 spells): "Marrow-Piercing Slug", "Blood-Shard Barrage", "Marrow-Shatter Concussion" — gritty industrial names that may be too visceral.
- **Remaining 14 classes**: Not yet assessed for grimdark names.

**IMPORTANT**: When renaming, keep the same spell ID (only change the display `name` field). This is safe for spellPool references.

### 5. Spell Pool Balance Check (ALL 20 classes)
For classes with `spellPools` (not `exampleSpells`):
- Does each level offer 3-5 meaningful choices?
- Are there levels with too few or too many options?
- Are any spellPool IDs orphaned (referenced but not defined)?

## Class Data File Overview

| File | Class | Spells | Spell Key | spellPools | Notes |
|------|-------|--------|-----------|------------|-------|
| animistData.js | Animist | 32 | spells | Yes | Text at spell level (not resourceCost) |
| apexData.js | Apex | 35 | exampleSpells | No | Hunter/companion class |
| arcanoneerData.js | Arcanoneer | 34 | spells | Yes | Artificer/gunner, grimdark names flagged |
| augurData.js | Augur | 33 | spells | Yes | Names already cleaned |
| berserkerData.js | Berserker | 23 | spells | Yes | Well-enriched, 22 triggerConfig |
| chronarchData.js | Chronarch | 35 | spells | Yes | Time mage, Flux HP erosion |
| falseProphetData.js | FalseProphet | 37 | exampleSpells | No | WORST grimdark names |
| gambitData.js | Gambit | 63 | spells | Yes | Largest class, gambler theme |
| harbingerData.js | Harbinger | 39 | exampleSpells | Yes | Chaos/doom prophet, single-line resourceCost format |
| inquisitorData.js | Inquisitor | 19 | exampleSpells | No | Anti-magic zealot |
| lunarchData.js | Lunarch | 28 | exampleSpells | No | Fae-parasite, moon phases |
| martyrData.js | Martyr | 32 | spells | Yes | Self-sacrifice healer |
| minstrelData.js | Minstrel | 41 | spells | Yes | Music/bard class |
| plaguebringerData.js | Plaguebringer | 33 | exampleSpells | Yes | Corruption/disease |
| pyrofiendData.js | Pyrofiend | 35 | spells | Yes | Fire/self-immolation |
| revenantData.js | Revenant | 10 | spells | Yes | Death mage, HP sacrifice |
| shaperData.js | Shaper | 31 | spells | Yes | Kinetic/force mage |
| spellguardData.js | Spellguard | 16 | exampleSpells | Yes | Anti-magic warrior |
| toxicologistData.js | Toxicologist | 33 | exampleSpells | No | Poison/alchemy, non-standard fields |
| wardenData.js | Warden | 33 | spells | Yes | Chain/tether controller |

## Technical Notes

### Text Field Location
Classes store verbalText/somaticText in TWO different locations:
- **Inside `resourceCost`**: Apex, Arcanoneer, FalseProphet, Harbinger, Inquisitor, Martyr, Minstrel, Plaguebringer, Pyrofiend, Spellguard, Toxicologist
- **At spell level** (sibling of resourceCost): Animist, Augur, Shaper, Warden
- **Mixed**: Berserker, Chronarch, Gambit, Lunarch, Revenant

Always check BOTH `s.resourceCost?.verbalText` AND `s.verbalText` when verifying.

### ESM Import Verification
Project `.js` files lack `"type": "module"` in `package.json`. To verify ESM import:
```javascript
import fs from 'fs';
fs.copyFileSync('src/data/classes/classNameData.js', 'scripts/tmp-copy.mjs');
const mod = await import('./tmp-copy.mjs');
const DATA = mod.CLASS_NAME_DATA; // Use the named export
```

### Balanced Braces Check
```javascript
const opens = (content.match(/{/g) || []).length;
const closes = (content.match(/}/g) || []).length;
console.log(opens === closes ? 'BALANCED' : 'MISMATCH');
```

### spellPools Orphan Check
```javascript
const poolIds = new Set();
for (const [level, ids] of Object.entries(DATA.spellPools)) {
  if (Array.isArray(ids)) ids.forEach(id => poolIds.add(id));
}
const spellIds = new Set(spells.map(s => s.id));
const orphans = [...poolIds].filter(id => !spellIds.has(id));
```

### Harbinger Special Format
Harbinger uses single-line `resourceCost` objects:
```javascript
resourceCost: { actionPoints: 1, mana: 4, classResource: { type: "mayhem", cost: -2 }, components: ["verbal", "somatic"] },
```
When editing these, insert text INSIDE the braces, not after.

### `docs/ABILITY_AUDIT.md` is Stale
The counts and descriptions in ABILITY_AUDIT.md are frequently wrong (e.g., claimed Animist had "zero spells" but it has 32). Do not rely on it for accurate spell counts.

### No spell-qa.mjs Script
The summary mentions `scripts/spell-qa.mjs` but it does not exist. All QA was done via inline ESM import + brace counting scripts.

## Recommended Workflow Per Class

1. **Read the class data file** — focus on `exampleSpells` or `spells` section
2. **Read the class overview/lore** — understand the class identity from the top of the file
3. **Assess each spell** for lore fit, variety, richness:
   - Does the name match the class theme?
   - Is the description vivid and specific?
   - Are the mechanics interesting or generic?
   - Does it overlap with another spell?
4. **Flag grimdark names** per §1.D — rename keeping same spell ID
5. **Note lore/variety/richness issues** — spells that feel wrong, repetitive, or shallow
6. **Make changes** — rename, rewrite descriptions, adjust mechanics text
7. **Verify**: ESM import + balanced braces + (if applicable) 0 orphaned spellPool IDs
8. **Move to next class**

## Suggested Priority Order
1. **FalseProphet** — 30+ grimdark names, most urgent
2. **Arcanoneer** — flagged grimdark names, verify lore fit of industrial/weapons theme
3. **Plaguebringer** — likely grimdark, disease/corruption theme needs assessment
4. **Harbinger** — chaos/doom theme, verify names fit
5. **Lunarch** — fae-parasite body horror, assess if names are too dark
6. **Martyr** — self-sacrifice theme, verify not crossing into grimdark
7. **Revenant** — death mage, only 10 spells, quick pass
8. **Pyrofiend** — self-immolation fire mage, assess tone
9. **Inquisitor** — anti-magic zealot, assess tone
10. **Spellguard** — anti-magic warrior, only 16 spells
11-20. Remaining classes (Apex, Berserker, Chronarch, Gambit, Minstrel, Toxicologist, Animist, Augur, Warden, Shaper) — lighter passes, focus on variety/richness since names are mostly clean
