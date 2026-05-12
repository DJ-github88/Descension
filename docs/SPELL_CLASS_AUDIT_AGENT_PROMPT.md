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

- **titanData.js** / `titan/titanSpells.js` — 27 spells audited and fixed

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
