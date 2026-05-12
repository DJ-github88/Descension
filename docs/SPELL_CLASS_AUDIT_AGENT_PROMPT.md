# Spell Class Audit & Enhancement Agent Prompt

## Instructions for Orchestrator

Run **3 agents in parallel**, each assigned a batch of classes. Each agent reads this prompt in full, then audits and enhances every spell in its assigned batch. Completed classes are marked below — **skip them**.

### Agent Assignment

| Agent | Classes |
|-------|---------|
| **Agent A** | gamblerData.js, chaosWeaverData.js, fateWeaverData.js, huntressData.js, falseProphetData.js, pyrofiendData.js, lunarchData.js, augurData.js, berserkerData.js, bladedancerData.js |
| **Agent B** | chronarchData.js, covenbaneData.js, deathcallerData.js, doomsayerData.js, dreadnaughtData.js, exorcistData.js, formbenderData.js, inscriptorData.js, lichborneData.js, martyrData.js |
| **Agent C** | minstrelData.js, oracleData.js, plaguebringerData.js, primalistData.js, spellguardData.js, toxicologistData.js, wardenData.js, witchDoctorData.js, arcanoneerData.js |

### Already Completed (DO NOT RE-AUDIT)

- **titanData.js** / `titan/titanSpells.js` — 32 spells audited and fixed
- **wardenData.js** — 32 spells audited and fixed
- **toxicologistData.js** — 30 spells audited and fixed

---

## Agent Mission

You are auditing, fixing, and **enhancing** every spell in your assigned class files. This is not just a data-format check — you are ensuring each class feels **unique, cohesive, and mechanically rich** while producing spell cards that render beautifully and intuitively.

Read **`D:\VTT\docs\SPELL_CARD_AUDIT_PROMPT.md`** in its entirety before starting. It contains:
- The 7 Unbreakable Rules (Section 2 of the reference doc)
- The Resource Cost Integrity checklist with the Class Resource Table
- The complete Wizard Output Format Reference showing every effect type's exact data structure and sub-compartments
- The Audit Checklist, Common Mistakes, and Fix patterns
- The 30-class resource mapping

Also read **`D:\VTT\docs\SPELL_DATA_REFERENCE.md`** Sections 1-7 and Section 8 (Class-Specific Resource Reference) before you begin.

## The Three Layers of This Audit

### Layer 1: Structural Compliance (must-fix)

Every spell MUST pass these before moving on:

- **Required fields**: `id`, `name`, `description`, `level`, `spellType` (UPPERCASE), `icon`, `typeConfig.school` (damage type ID, NOT D&D school name), `typeConfig.icon`, `targetingConfig`, `resourceCost.actionPoints`, `cooldownConfig` with `cooldownType`/`cooldownValue`, `tags`
- **effectTypes ↔ configs**: Every type in `effectTypes` has a matching config object, every config has its type in `effectTypes`
- **damageTypes is ALWAYS an array** — never a string, never a singular `damageType` field
- **resolution** is set inside each effect config (`DICE`, `CARDS`, `COINS`, `PROPHECY`, `SAVE`, `NONE`, `AUTOMATIC`)
- **cooldownConfig** uses `{ cooldownType, cooldownValue }` — NOT `{ type, value }`
- **buffConfig/debuffConfig effects[]** uses objects `{ id, name, description, mechanicsText }` — NOT strings
- **savingThrow** uses `{ ability, difficultyClass, saveOutcome }` — NOT `saveDC`/`saveType`/`savingThrowConfig`
- **resourceCost** uses wizard format: `resourceTypes`, `resourceValues`, `actionPoints`, `components`
- **No orphaned fields**: Remove `uses`, `requirement` from resourceCost. Use `cooldownConfig` and flat top-level fields instead.
- **`typeConfig.school` matches actual damage types**: NOT `'force'` unless the spell actually deals force damage. Check `damageConfig.formula` and `damageTypes` to confirm.
- **Dual-damage-type spells have `typeConfig.secondaryElement`**: The normalizer only reads `school` + `secondaryElement` from typeConfig. If a spell has 2+ damage types, the second MUST be in `secondaryElement`.
- **No `formula: 'SPECIAL'`**: Every `damageConfig.formula` must be a readable dice formula. Variable damage should use descriptive notation like `'2d8 × stacks'` with `conditionalEffects`.
- **Prophecy DoT effects use `damagePerRound`**: The ProphecySummary component reads `prophesied.effect.damagePerRound`, NOT `dotFormula`. Check all prophecy effects.

### Layer 2: Description ↔ Data Alignment (must-fix)

For EVERY spell, compare the `description` text against the structured data:

- Every damage amount → `damageConfig.formula` with correct value
- Every damage type mentioned → `damageTypes` array
- Every DoT/Hot → `dotConfig`/`hotConfig` with correct formula, duration, tick frequency
- Every buff/debuff → `buffConfig`/`debuffConfig` with effects matching description
- Every control effect (stun, root, knockback, etc.) → `controlConfig`
- Every summon/transform → `summoningConfig`/`transformationConfig`
- Every duration → `durationConfig` with matching values
- Every range/area → `targetingConfig` with matching values
- Every cooldown → `cooldownConfig` with matching values
- Every resource cost mentioned → `resourceCost` with matching values
- Every saving throw → `savingThrow` inside the effect config
- Every crit effect → `criticalConfig`
- Every chain/bounce → `propagation`
- Every trap → `trapConfig`
- Every channeling → `channelingConfig` with stages
- Every prophecy DoT → `prophesied.effect.damagePerRound` (NOT `dotFormula`)
- Every prophecy description → contains exact damage numbers, not vague text like "massive damage"

**If description is vague but data is clear** → enhance the description to match the data.
**If data is wrong but description is clear** → fix the data to match the description.

### Layer 3: Class Philosophy Enhancement (improve)

This is where you elevate spells from "technically correct" to "feels amazing." For each spell, ask:

#### A. Does this spell use the class resource system?
Every class has a unique resource (see the Class Resource Table in the audit prompt). Spells at the same level shouldn't all cost the same generic resources. Lower-level spells might generate the resource; higher-level spells spend it. Check:
- L1-3 spells: Do they generate or interact with the class resource?
- L4-6 spells: Do they spend the class resource for enhanced effects?
- L7-9 spells: Do they have dramatic resource interactions?
- L10 spells: Are they ultimate expressions of the class fantasy?

#### B. Is this spell balanced for its level?
Use these rough guidelines:

| Level | Mana Range | AP Range | Cooldown | Power Tier |
|-------|-----------|----------|----------|------------|
| 1 | 3-6 | 1 | 0-1 turn | Basic,入门 |
| 2 | 5-10 | 1 | 0-2 turns | Starter with a twist |
| 3 | 8-15 | 1-2 | 1-3 turns | Core rotation |
| 4 | 12-18 | 1-2 | 2-4 turns | Strong signature |
| 5 | 15-22 | 1-2 | 3-4 turns | Powerful |
| 6 | 18-26 | 2 | 3-5 turns | Very powerful |
| 7 | 22-30 | 2-3 | 4-6 turns | Major cooldown |
| 8 | 26-35 | 2-3 | 5-6 turns | Defining ability |
| 9 | 30-40 | 3 | 5+ turns or long rest | Ultimate |
| 10 | 35-45 | 3 | long rest | Capstone |

If a spell is significantly over or under these ranges, adjust it and explain why.

#### C. Does the spell card tell the whole story?
When a player reads the spell card, they should understand:
- What the spell does (description + effect configs)
- How much it costs (resourceCost with class resource)
- When they can use it (cooldownConfig, spellType)
- Who it hits (targetingConfig, propagation, effectTargeting)
- What makes it special (triggers, mechanics, prophecy, channeling stages, etc.)

**Enhancement opportunities to look for:**
- If a spell mentions "chains to nearby enemies" but has no `propagation` → add it
- If a spell mentions "more powerful when X" but has no `triggerConfig.conditionalEffects` → add it
- If a spell affects enemies and allies differently but has no `effectTargeting` → add it
- If a spell has a unique mechanic but no `effectResolutions` badge → add it
- If a spell should trigger off class-specific events but has no `triggerConfig.effectTriggers` → add it

#### D. Does this spell feel unique to this class?
A Pyrofiend's fire spell should feel different from a generic fire spell. Check:
- Does it interact with Inferno Veil (ascend/descend/required)?
- Does the damage scale with inferno level?
- Does it have fire-appropriate dotConfig (burning)?
- Is the description flavorful and class-appropriate?

Apply the same thinking to every class. Read the class's `overview`, `resourceSystem`, `specializations`, and `combatRole` sections in the class data file to understand the class fantasy before auditing its spells.

#### Augur-Specific Audit Issues (found during pre-audit)

The following issues were identified in the Augur's spells before the full audit. Use these as examples of what to look for in ALL classes:

**1. spellType = ACTION when description says "Channel"**
- `augur_omen_bolt` (L3): Description says "Channel raw omen energy" but `spellType: 'ACTION'`. Should be `'CHANNELED'` with `channelingConfig`.
- `augur_harbinger_gaze` (L3): Sustained gaze attack with concentration. Should be `'CHANNELED'`.
- Any spell whose description describes sustained/ongoing/ticking effects that require focus should be `'CHANNELED'`.

**2. effectTargeting missing on dual-target area spells**
- `augur_balanced_sign` (L4): `targetRestrictions: ['any']`, has both `buffConfig` (allies) and `debuffConfig` (enemies) — NO `effectTargeting`, NO `targetingMode: 'effect'`.
- `augur_reality_of_omens` (L7): Same pattern — buffs allies, debuffs enemies, no `effectTargeting`.
- `augur_cosmic_aurora` (L8): Buffs + heals allies, damages enemies, no `effectTargeting`.
- `augur_eternal_benediction` (L9), `augur_master_of_omens` (L10), `augur_hierophant_supreme` (L10): All same issue.

**3. classResource absent on spells that should use it**
- `augur_read_the_signs` (L1): Utility/divination with NO `classResource`. Should generate Benediction (it's reading signs — the core mechanic).
- `augur_omen_bolt` (L3): Damage spell at level 3 with NO `classResource`. Should spend Benediction and/or Malediction.

**4. secondaryElement missing on dual-damage spells**
- `augur_omen_bolt` (L3): `damageTypes: ['psychic', 'radiant']` but no `typeConfig.secondaryElement`.
- `augur_omen_shatter` (L6): Same issue.

---

## Card Rendering Pitfalls (must-check)

These are bugs found during auditing that agents MUST check for. They are caused by mismatches between how data is written and how the card/normalizer actually reads it.

### Pitfall 1: `school` must match actual damage types

The normalizer (`spellNormalizer.js` line 250) reads `typeConfig.school` as the **primary** damage type and **stops there** — it never reaches `damageConfig.damageTypes` if `typeConfig.school` is already set. So if a spell deals fire + necrotic damage but has `school: 'force'`, the card will only show a force badge.

**Rule**: `typeConfig.school` MUST be the spell's primary damage type (the one that appears first or deals the most damage). NEVER use `'force'` as a generic placeholder unless the spell actually deals force damage.

```javascript
// WRONG — spell deals fire + necrotic but school says force
typeConfig: { school: 'force' }
damageConfig: { damageTypes: ['fire', 'necrotic'] }
// Card shows: only "force" badge (normalizer stops at school)

// CORRECT — school matches primary damage type
typeConfig: { school: 'fire', secondaryElement: 'necrotic' }
damageConfig: { damageTypes: ['fire', 'necrotic'] }
// Card shows: fire + necrotic badges
```

### Pitfall 2: Dual-damage-type spells need `secondaryElement`

For spells with TWO damage types (e.g., fire + necrotic), you MUST set `typeConfig.secondaryElement` to the second type. The normalizer checks both `typeConfig.school` and `typeConfig.secondaryElement` to build the damage type array. Without `secondaryElement`, the second type is invisible to the card.

```javascript
typeConfig: {
  school: 'fire',
  secondaryElement: 'necrotic',  // REQUIRED for dual-type spells
  icon: 'Fire/Fire Storm'
}
```

### Pitfall 3: Prophecy DoT effects must use `damagePerRound`

The `ProphecySummary` component (line 98) reads `prophesied.effect.damagePerRound` to render DoT damage. It does NOT read `dotFormula`. If a prophecy effect applies a DoT (burning, poisoned, etc.), use `damagePerRound`, NOT `dotFormula`:

```javascript
// WRONG — ProphecySummary ignores this
prophesied: {
  effect: { name: 'Ignited', dotFormula: '2d6', duration: 3 }
}

// CORRECT — ProphecySummary renders "2d6 per round" 
prophesied: {
  effect: { name: 'Ignited', damagePerRound: '2d6 fire', duration: 3, unit: 'rounds' }
}
```

### Pitfall 4: Never use `formula: 'SPECIAL'`

The card renders `formula` as literal text in the damage section. `'SPECIAL'` will display as "SPECIAL necrotic damage" on the spell card, which is confusing and tells the player nothing.

If damage is variable/dynamic:
- Use a descriptive formula like `'2d8 × active_prophecies'` or `'3d6 per stack'`
- Add `triggerConfig.conditionalEffects` with formulas per condition
- Add a `damageNote` field explaining the scaling mechanic
- If the spell has a base damage even without stacks, use that as the formula

```javascript
// WRONG
damageConfig: { formula: 'SPECIAL', damageTypes: ['necrotic'] }

// CORRECT — base formula + conditional scaling
damageConfig: {
  formula: '2d8 × active_prophecies',
  damageTypes: ['necrotic'],
  resolution: 'AUTOMATIC'
},
triggerConfig: {
  conditionalEffects: {
    damage: {
      isConditional: true,
      conditionalFormulas: {
        '3+ stacks': '2d8 × active_prophecies + paralysis',
        '1-2 stacks': '2d8 × active_prophecies',
        'default': '2d8 × active_prophecies'
      }
    }
  }
}
```

### Pitfall 5: Prophecy descriptions must have actual numbers

Prophecy outcome descriptions like `"Deals massive dual damage"` or `"Heavy fire damage"` are useless on a spell card. Players need exact numbers to make decisions. Every prophecy outcome description must include:
- Exact damage formula (e.g., `"6d8 fire + 6d8 necrotic"`)
- Exact effect details (e.g., `"2d6 fire per round for 3 rounds"`)
- Exact stat modifiers (e.g., `"-2 to all rolls for 2 rounds"`)

```javascript
// WRONG
prophesied: { description: 'Deals massive dual damage and burns enemies.' }

// CORRECT
prophesied: { description: 'Deals 6d8 fire + 6d8 necrotic damage and ignites all enemies for 2d6 fire damage per round for 3 rounds.' }
```

### Pitfall 6: spellType must match the description — CHANNELED, not just ACTION

Valid `spellType` values are: **`ACTION`**, **`CHANNELED`**, **`PASSIVE`**, **`REACTION`**, **`TRAP`**, **`STATE`**. If a spell's description says "Channel", "concentrate", or describes a sustained/ongoing effect that ticks over multiple rounds, it should be `'CHANNELED'`, not `'ACTION'`.

The card renderer and transformer treat `CHANNELED` as a distinct type — it gets its own tag, color, icon, and requires `channelingConfig`. Setting a channeled spell as `ACTION` means the card will never render the channeling stages or tick information.

**CHANNELED spells MUST have `channelingConfig`** at minimum:
```javascript
// WRONG — description says "Channel raw omen energy" but spellType is ACTION
spellType: 'ACTION',
// No channelingConfig

// CORRECT
spellType: 'CHANNELED',
channelingConfig: {
  type: 'power_up',       // or 'persistent', 'drain', 'amplify'
  maxDuration: 3,
  durationUnit: 'rounds',
  tickFrequency: 'round',
  interruptible: true,
  stages: []               // Add stages if the spell escalates
}
```

**How to identify spells that should be CHANNELED:**
- Description contains "channel", "concentrate on", "maintain", "sustained"
- The spell has a DoT/Hot that ticks each round while you maintain it
- The spell grows stronger the longer you hold it (stages)
- The spell requires ongoing focus (interruptible = true)
- It's a gaze/aura/zone that persists as long as you focus

### Pitfall 7: Dual-effect area spells MUST have `effectTargeting`

When a spell targets `['any']` or `['ally', 'enemy']` in `targetingConfig.targetRestrictions` AND has separate effect configs for different groups (e.g., `buffConfig` for allies + `debuffConfig` for enemies, or `buffConfig` for allies + `damageConfig` for enemies), it **MUST** have `effectTargeting` to route each effect to the correct targets. Without it, the card cannot show which effect hits whom.

You must also set `targetingMode: 'effect'` in `targetingConfig` — the card renderer checks `spell.targetingMode === 'effect'` before reading `effectTargeting`.

```javascript
// WRONG — area spell with buff + debuff but no way to route effects
targetingConfig: {
  targetingType: 'area',
  targetRestrictions: ['any'],
  // ...
},
buffConfig: { /* buffs for allies */ },
debuffConfig: { /* debuffs for enemies */ },
// Card shows both effects hitting everyone — wrong!

// CORRECT — effectTargeting routes each effect
targetingConfig: {
  targetingType: 'area',
  targetingMode: 'effect',       // REQUIRED for card to read effectTargeting
  targetRestrictions: ['any'],
  // ...
},
effectTargeting: {
  buff: {
    targetingType: 'area',
    rangeType: 'self_centered',
    targetRestrictions: ['ally', 'self'],
    maxTargets: 10
  },
  debuff: {
    targetingType: 'area',
    rangeType: 'self_centered',
    targetRestrictions: ['enemies'],
    maxTargets: 20
  }
},
buffConfig: { /* allies only */ },
debuffConfig: { /* enemies only */ },
```

**When effectTargeting is required (MUST-FIX, not optional):**
- Spell has `targetRestrictions: ['any']` AND both `buffConfig` + `debuffConfig`
- Spell has `targetRestrictions: ['any']` AND both `buffConfig`/`healingConfig` + `damageConfig`
- Spell affects allies and enemies differently in the same area
- Spell has `effectTypes` containing both positive and negative types (e.g., `['buff', 'debuff']`, `['healing', 'damage']`)

The `effectTargeting` keys match the effect config names: `damage`, `healing`, `buff`, `debuff`, `control`, `utility`.

### Pitfall 8: classResource must be on virtually EVERY spell for resource-heavy classes

For classes whose entire identity revolves around a resource system (Augur = Benediction/Malediction, Pyrofiend = Inferno, Gambler = Luck/Heat, etc.), **every non-trivial spell must interact with that resource**. A spell with no `classResource` in these classes breaks the class fantasy.

```javascript
// WRONG — Augur utility spell with no resource interaction
resourceCost: {
  resourceTypes: ['mana'],
  resourceValues: { mana: 4 },
  actionPoints: 1,
  components: ['verbal', 'somatic']
  // No classResource — this spell ignores the entire Benediction/Malediction system
}

// CORRECT — even utility spells interact with the class resource
resourceCost: {
  resourceTypes: ['mana'],
  resourceValues: { mana: 4 },
  actionPoints: 1,
  components: ['verbal', 'somatic'],
  classResource: { type: 'benediction', cost: 1 }  // or generates: { type: 'benediction', gain: 1 }
}
```

**Rules for class resource integration by level:**
- **L1-2 spells**: May GENERATE class resources (gain on cast) or spend small amounts (1-3). Utility/divination spells at this level should generate resources.
- **L3-4 spells**: Should spend moderate amounts (3-6). Core rotation spells demonstrate the resource system.
- **L5-7 spells**: Should spend significant amounts (5-10). These are where the resource system shines.
- **L8-10 spells**: Should spend large amounts (10-15) or have dramatic resource interactions (spend both types, variable costs based on resource level, etc.).

**Dual-resource classes** (Augur, Gambler, etc.): Spells that cost both resource types should use the array format:
```javascript
classResource: [{ type: 'benediction', cost: 3 }, { type: 'malediction', cost: 3 }]
```
Single-resource costs use the object format:
```javascript
classResource: { type: 'malediction', cost: 5 }
```

### Pitfall 9: Dual-damage spells MUST have `typeConfig.secondaryElement`

This is already covered in Pitfall 2 but bears repeating with a specific Augur example because it's frequently missed: if `damageTypes` has 2+ entries, `typeConfig` MUST have `secondaryElement` set to the second type. The normalizer reads `school` + `secondaryElement` from typeConfig to build the damage badges on the card. `damageConfig.damageTypes` alone is NOT enough.

```javascript
// WRONG — damageTypes has 2 types but typeConfig only has school
typeConfig: { school: 'psychic', icon: '...' },
damageConfig: { damageTypes: ['psychic', 'radiant'], formula: '8d8' }
// Card only shows "psychic" — radiant is invisible

// CORRECT
typeConfig: { school: 'psychic', secondaryElement: 'radiant', icon: '...' },
damageConfig: { damageTypes: ['psychic', 'radiant'], formula: '8d8' }
// Card shows both psychic + radiant badges
```

**Augur-specific examples found during audit:**
- `augur_omen_bolt` (L3): deals psychic + radiant but has no `secondaryElement`
- `augur_omen_shatter` (L6): deals psychic + radiant but has no `secondaryElement`

---

## Execution Process — Per Class

### Step 1: Read the class context
Read the full class data file (and any spell subdirectory files). Study:
- `overview` — what is this class about?
- `resourceSystem` — how does the class resource work? What generates it? What spends it?
- `specializations` — what are the three specs and how do they differ?
- `combatRole` — what should this class be doing in combat?
- `characterCreation` — any hints about intended play patterns?

### Step 2: Audit every spell (Layers 1-2)
For each spell, run through the full audit checklist from `SPELL_CARD_AUDIT_PROMPT.md`:
- Required Fields Check
- Resource Cost Integrity
- Description ↔ Data Alignment
- Effect Types Consistency
- Data Accuracy

Fix ALL issues found directly in the file.

### Step 3: Enhance every spell (Layer 3)
For each spell, evaluate:
- Does it properly use the class resource? If not, add resource interactions.
- Is it balanced for its level? If not, adjust costs/power.
- Does the spell card tell the whole story? If not, add missing configs (propagation, triggers, effectTargeting, etc.)
- Does it feel unique to this class? If not, enhance descriptions and add class-specific flavor.

Make changes directly in the file. Use the Wizard Output Format Reference section as your guide for correct data structures.

### Step 4: Verify syntax
After all changes, verify the file parses correctly:
```javascript
node -e "const acorn = require('acorn'); const fs = require('fs'); const code = fs.readFileSync('path/to/file.js', 'utf8'); try { acorn.parse(code, { ecmaVersion: 2022, sourceType: 'module' }); console.log('SYNTAX OK'); } catch(e) { console.log('SYNTAX ERROR:', e.message); }"
```

### Step 5: Report
After completing each class, report:
1. **Spells audited**: X/Y
2. **Layer 1 issues fixed**: structural violations corrected
3. **Layer 2 issues fixed**: description↔data alignment corrections
4. **Layer 3 enhancements made**: class resource integration, balance adjustments, missing configs added, uniqueness improvements
5. **Spells that needed significant rework**: list any spells where you made major changes and explain why
6. **Human judgment items**: anything ambiguous that needs a design decision

## Critical File Paths

- **Audit prompt with all reference material**: `D:\VTT\docs\SPELL_CARD_AUDIT_PROMPT.md`
- **Spell data reference**: `D:\VTT\docs\SPELL_DATA_REFERENCE.md`
- **Class data files**: `D:\VTT\vtt-react\src\data\classes\*Data.js`
- **Class spell subdirectories**: Check for subdirectories like `titan/`, `augur/`, `berserker/`, etc.
- **Wizard effect data structures**: See the Wizard Output Format Reference section in the audit prompt
- **Card renderer**: `D:\VTT\vtt-react\src\components\spellcrafting-wizard\components\common\UnifiedSpellCard.jsx`
- **Normalizer**: `D:\VTT\vtt-react\src\components\spellcrafting-wizard\core\utils\spellNormalizer.js`
- **Transformer**: `D:\VTT\vtt-react\src\components\spellcrafting-wizard\core\utils\spellCardTransformer.js`

## Rules

1. **One class at a time.** Complete a class fully before moving to the next.
2. **Read the full class file first.** Understand the class before touching any spells.
3. **Preserve existing flavor.** Don't rewrite descriptions unless they're wrong or vague. Enhance, don't replace.
4. **Don't add comments to code.** Keep the code clean.
5. **Verify syntax after every class.** A broken file helps nobody.
6. **Use the Wizard Output Format Reference.** When adding missing configs, use the exact structures documented there.
7. **Don't change `specialMechanics`, `effects` legacy objects, or `specialization`-specific data.** These may be read by other systems. You can ADD to them but don't remove existing fields.
8. **When in doubt, match the description.** The description is the source of truth for what a spell does. If data contradicts it, fix the data.
9. **Don't be afraid to enhance descriptions too.** If a spell's data is rich but its description is bland, improve the description to match the data's complexity.
10. **Balance conservatively.** If a spell seems too strong, reduce its numbers slightly. If too weak, boost slightly. Don't overhaul damage formulas unless they're clearly wrong for the level.

## Suggested Order Within Each Batch

Start with smaller/simpler classes to calibrate, then move to larger ones:

**Agent A**: gamblerData → chaosWeaverData → fateWeaverData → huntressData → falseProphetData → pyrofiendData → lunarchData → augurData → berserkerData → bladedancerData

**Agent B**: chronarchData → martyrData → doomsayerData → deathcallerData → covenbaneData → exorcistData → dreadnaughtData → inscriptorData → lichborneData → formbenderData

**Agent C**: minstrelData → oracleData → spellguardData → wardenData → toxicologistData → plaguebringerData → primalistData → witchDoctorData → arcanoneerData
