# Mythrill VTT: Master Class Audit & Refactoring Prompt

This document is a master, copy-pasteable prompt designed to guide an AI developer in systematically auditing, refactoring, and polishing individual Mythrill VTT class files (e.g., `berserkerData.js`, `martyrData.js`, `pyrofiendData.js`). 

To audit a class, copy the entire section below starting from `=== START OF PROMPT ===` to `=== END OF PROMPT ===` and paste it into a new AI conversation alongside the contents of the target class file.

---

### === START OF PROMPT ===

You are an expert AI game developer and technical architect specialized in data schema refactoring and narrative alignment for Virtual Tabletop (VTT) systems. Your task is to perform a comprehensive audit and refactoring of a single Mythrill VTT class module (e.g., `berserkerData.js` or `martyrData.js`). 

You must align the class file with our strict system specifications, narrative design philosophy, and critical validation parser workarounds.

---

## Part 1: Narrative & Design Philosophy

Every class in Mythrill must represent a highly compelling, distinct fantasy, provide clear guidance for TTRPG beginners, and maintain a highly polished, consistent data structure.

### A. The Core Shift: Toning Down Grimdark / Visceral Horror
To ensure a consistent, premium, and widely appealing fantasy aesthetic, we are systematically toning down the grimdark flavor across ALL classes (including the Berserker and Martyr). We are moving away from visceral, grotesque anatomical or self-harm horror and toward a high-exertion, high-velocity, and tactical fantasy style.
* **The Rules**:
  * **AVOID**: Raw bone-snapping, muscle-flaying, internal bleeding, blood-drinking, or grotesque anatomical mutilation.
  * **EMPHASIZE**: Physical stamina, adrenaline rushes, rapid reflexes, kinetic momentum, alchemical enhancement, extreme exertion, and high strategic risk.
* **Berserker Guidance**:
  * *Instead of*: "Tear your own flesh to spray toxic blood" or "Shatter your own hand to hit harder."
  * *Use*: "Push your physical stamina past its threshold, ignoring pain through sheer battle-fury" or "Force a crushing blow that strains your muscles for massive impact."
* **Bladedancer Guidance**:
  * *Instead of*: "Lacerating joints" or "Flaying the skin to move faster."
  * *Use*: "Kinetic sweep," "Steely Riposte," "Kinetic Dash," or "Sensory Numbing."
* **Martyr Guidance**:
  * *Instead of*: "Gouging out eyes" or "Horrific visceral self-mutilation."
  * *Use*: "Taking the burden of combat strain, converting impact into defensive protective barriers."

#### Grimdark to Kinetic Translation Table:
| Grimdark / Visceral Term (AVOID) | Modern Kinetic / High-Exertion Term (USE) |
| :--- | :--- |
| Mutilation, Flaying, Lacerating | Kinetic Sweep, Striking, Piercing |
| Bone-Snapping, Joint-Shattering | Kinetic Strain, Muscle Strain, Adrenaline Overdrive |
| Agony, Grotesque Torture | Intense Focus, Physical Endurance, Pain Resistance |
| Blood-Drinking, Flesh-Eating | Alchemical Overdrive, Battle-Fury, Planar Siphon |
| Organ Rupturing, Internal Bleeding | Metabolic Burnout, System Overload, Planar Strain |

### B. Level-Up Choice Economy & Drawback Balancing
Players pick exactly ONE spell when leveling up. Drawback spells (e.g., self-harm, resource overload, speed penalties) must offer massive mechanical payoffs and spectacular visual/narrative descriptions to incentivize players. Somatic and verbal descriptions must focus on extreme physical or magical exertion, sweat, and strain, rather than visceral horror.

### C. simplified Specializations
Keep specializations (subclasses) clean and uncomplicated. Talent trees are handled downstream. 
* **The Rule**: Each subclass must feature exactly one powerful `specPassive` (a passive or a signature active ability) that immediately defines its gameplay identity.
* **The Requirement**: Remove the legacy `keyAbilities` array entirely from the spec objects.

---

## Part 2: Critical QA Parser Workarounds

The local spell validation parser (`scripts/spell-qa.mjs`) is highly sensitive and naive in its regex matching. To ensure audited class files compile perfectly and pass the QA checks with exactly zero errors, you MUST implement these two strict coding workarounds:

1. **Rule A: Single-Line Spell Headers**
   * *The Problem*: The parser resets its brace depth tracker to `0` whenever it encounters `id:`. If the opening brace `{` is on the line above, the parser misses it, leading to early exits and throwing false warnings about missing level, spellType, or actionPoints.
   * *The Fix*: You must format every spell's opening brace and ID on a single line:
     ```javascript
     { id: "class_spell_name",
     ```
     *(Do NOT put the opening brace `{` on the line above the ID).*

2. **Rule B: Spaced-Colon Nested IDs**
   * *The Problem*: The validation parser uses a naive regex matching `/id:\s*['"]/` to find spells. If status effects, cleanses, or stat modifiers inside a spell config use standard `id: "status_id"`, the parser incorrectly flags them as new spells, generating "missing level/type" warnings.
   * *The Fix*: Place a space before the colon for all non-spell, nested IDs:
     ```javascript
     id : "status_effect_id",
     ```
     *(This remains valid ESM/JS compile syntax while completely bypassing the validation parser's regex check).*

---

## Part 3: Class Schema & Rules Sections

Every class file must be structured into four distinct sections that populate the interactive UI. Ensure these sections use the exact formats below.

### 1. The Overview Section
```json
"overview": {
  "title": "The Class Name",
  "subtitle": "The Class Subtitle / Epithet",
  
  "quickOverview": {
    "title": "Quick Overview",
    "content": "A 2-3 paragraph summary. Use bold headers. Answer: What is the core mechanic? What is the class resource? Who is this class best for?"
  },
  
  "description": "Lore-focused introduction describing the physical reality and flavor of the class in the world.",
  
  "roleplayIdentity": {
    "title": "Roleplay Identity Subtitle",
    "content": "Outline the physical toll or social reality of the class. Provide 3 concrete character archetypes to help players get started."
  },
  
  "combatRole": {
    "title": "Combat Role / Why Bring Me",
    "content": "Must include a 'Why Bring Me?' utility sentence. Define their unique team contribution and call out their fatal mechanical flaw."
  },
  
  "playstyle": {
    "title": "Playstyle & Management",
    "content": "Break down the class's resource thresholds (e.g., green, yellow, danger zones) in simple, strategic terms."
  },
  
  "immersiveCombatExample": {
    "title": "Combat Example: The [Thematic Action]",
    "content": "A detailed, step-by-step turn sequence (Turn 1, Turn 2, Turn 3) demonstrating a typical combat loop. Must show resources building/spending, specific ability triggers, and somatic descriptions."
  }
}
```

### 2. The Resource System Section
Detail the gauge limits, generation rules, and state thresholds.
```json
"resourceSystem": {
  "title": "Resource Name & Core Stance",
  "subtitle": "Thematic Subtitle",
  "description": "High-level summary of the resource scale, how it influences survival, and the core penalty for ignoring it.",
  
  "cards": [
    {
      "title": "Resource Name (Range)",
      "stats": "Visual tracker description (e.g., Thermal Scale, Heat Gauge, Cruor Pool)",
      "details": "Explanation of the resource limit, how it behaves at rest, and the primary burnout hazard."
    }
  ],
  
  "generationTable": {
    "headers": ["Action", "Resource Change", "Flesh Toll / Recoil / Cost"],
    "rows": [
      ["Melee swing / spell cast", "+X generation", "Self-harm or stamina cost"],
      ["Taking damage", "+Y translation", "Pain converted to fuel"],
      ["Resting / Passivity", "-Z decay per round", "Withdrawal effects or decay rate"],
      ["Burnout / Overheat (101+)", "Reset / Penalty", "Severe physiological backlash"]
    ]
  },
  
  "usage": {
    "momentum": "How resource costs scale across levels (e.g., 5 to 100 costs).",
    "flourish": "⚠️ The signature mechanical restriction or core drawback (e.g., Healing Immunity while enraged)."
  },
  
  "overheatRules": {
    "title": "Metabolic Burnout / System Collapse",
    "content": "Specific, harsh rules for exceeding the resource ceiling. Must detail the exact round limit, unresistable damage penalty, stun states, or mechanical recovery."
  },
  
  "rageStatesTable": {
    "title": "Resource Thresholds",
    "headers": ["State / Phase", "Range", "Unlocked Mechanics", "Agony / Penalty"],
    "rows": [
      ["Smoldering / Idle", "0-20", "Basic actions. Vulnerability/mortality felt.", "None"],
      ["Frenzied / Active", "21-40", "First layer of stat buffs (+1 to hit, etc.).", "Stance drawbacks begin."],
      ["Primal / Peak", "41-80", "High-tier damage bonuses and armor bypasses.", "Armor reduction or self-harm multipliers."],
      ["Obliteration / Overdrive", "81-100", "Apocalyptic damage scaling.", "Extreme armor penalties, self-damage per turn."]
    ]
  }
}
```

### 3. The Starting Equipment Section
```json
"equipment": {
  "title": "Starting Equipment",
  "choices": [
    {
      "name": "Equipment Path A (e.g., Shattered Greataxe)",
      "icon": "icon_name/id",
      "items": [
        "Primary Weapon (Damage formula, flavor note)",
        "Armor Type (Armor rating, maximum agility constraints)",
        "Utility/Ranged Gear"
      ],
      "description": "A sentence explaining the tactical purpose of this path (e.g., maximum impact, rapid resource building)."
    },
    {
      "name": "Equipment Path B (e.g., Dual Warhammers)",
      "icon": "icon_name/id",
      "items": [
        "Dual-wield Weapons (Damage formulas, flavor note)",
        "Heavy Bracers/Wraps",
        "Alternative utility gear"
      ],
      "description": "Explains how this path shifts the class's combat style."
    }
  ],
  "standardGear": [
    "Pack list (backpack, rations, unique class tools like cauterizing iron)",
    "Currency (e.g., 1d10 x 5 rusted copper pieces)"
  ],
  "notes": "Strict class-specific equipment constraints."
}
```

### 4. The Specializations Section
```json
"specializations": {
  "title": "Specializations",
  "subtitle": "Paths of [Theme]",
  "description": "Short introductory summary of the choosing process.",
  "specs": [
    {
      "id": "spec_id_1",
      "name": "Spec Name (e.g., Savage)",
      "icon": "icon_name/id",
      "color": "Hex color representing the subclass (e.g., #8B0000)",
      "theme": "Thematic Keyword (e.g., Relentless Carnage)",
      "description": "One-sentence overview of the spec's identity.",
      "playstyle": "Simple description of how combat changes under this path.",
      "strengths": [
        "Strength bullet point 1",
        "Strength bullet point 2"
      ],
      "weaknesses": [
        "Weakness bullet point 1",
        "Weakness bullet point 2"
      ],
      "specPassive": {
        "name": "Evocative Passive or Ability Title",
        "description": "The base passive or primary ability that anchors the spec's playstyle. Must be mathematically powerful but simple to read."
      }
    }
  ]
}
```

---

## Part 4: The 7 Unbreakable Spell Rules

When auditing the `spells` array inside the class module, you must enforce complete compliance with these 7 rules:

1. **`effectTypes` ↔ Config Alignment**
   Every entry in `effectTypes` must have a matching `*Config` object. If `effectTypes` contains `"damage"`, then `damageConfig` MUST exist. If a config exists but isn't listed in `effectTypes`, the UI will not render it.
2. **`damageTypes` is ALWAYS an Array**
   `damageTypes: ["slashing"]` is correct. `damageType: "slashing"` or `damageTypes: "slashing"` are broken and will fail to render the damage badge.
3. **`school` in `typeConfig` using Damage Type IDs**
   `typeConfig: { school: "slashing" }` is correct. Valid damage type IDs: `fire`, `frost`, `lightning`, `arcane`, `nature`, `force`, `necrotic`, `radiant`, `poison`, `psychic`, `chaos`, `void`, `bludgeoning`, `piercing`, `slashing`, `physical`, `holy`, `shadow`, `cold`, `ice`, `thunder`, `acid`. Do NOT use D&D schools (e.g., "Evocation").
4. **`actionPoints` is ALWAYS a Number**
   Every non-passive spell must set `resourceCost.actionPoints` as a number (0 for free, 1-5 normal).
5. **`resolution` INSIDE the Effect Config**
   `damageConfig: { formula: "1d8", damageTypes: ["slashing"], resolution: "DICE" }` is correct. Set resolution inside the config and make sure it is UPPERCASE (e.g., `DICE`, `NONE`, `AUTOMATIC`).
6. **`cooldownConfig` Consistent Keys**
   Always use `{ cooldownType: "turn_based", cooldownValue: X }`. Do NOT use `{ type, value }` or `{ cooldown, charges }`.
7. **Buff/Debuff `effects[]` are Objects, not Strings**
   All status effects must use objects:
   ```javascript
   buffConfig: {
     buffType: "statEnhancement",
     effects: [
       { id : "strength_boost", name: "Strength Boost", description: "+2 Strength", mechanicsText: "" }
     ]
   }
   ```

### ⚠️ The `mechanicsText` Override Loophole (CRITICAL)
Auto-generated buff/debuff modifiers can cause visual layout bugs on rendering cards (like blank badges or redundant stat lines).
* **The Rule**: Always specify a custom `mechanicsText` inside the effect object inside `buffConfig.effects[]` or `debuffConfig.effects[]`. If present, the rendering engine completely bypasses its automated logic and displays this exact text cleanly. Keep it short and readable (e.g., `mechanicsText: "Take 1d4 physical damage to self"`).

---

## Part 5: Resource & Cost Normalization

For resource-heavy classes (such as Berserker: Rage or Martyr: Devotion), spells must integrate with their specific resource keys under `resourceCost`:

* **Berserker (Rage)**: Stored in `resourceCost.resourceValues` or flat fields. Required keys: `rageCost`, `rageGain`, `rageRequired`.
* **Martyr (Devotion)**: Stored in `resourceCost.resourceValues` or flat fields. Required keys: `devotionCost`, `devotionGain`, `devotionRequired`.

### Normalizing Generation vs Spending
* Spells that spend class resources must specify a positive cost.
* Spells that generate class resources on hit/cast must specify a negative cost field under `classResource`:
  ```javascript
  resourceCost: {
    actionPoints: 1,
    mana: 0,
    resourceTypes: ["rage_generation"],
    resourceValues: { rage_generation: 6 },
    classResource: { type: "rage", cost: -6 }, // Negative cost indicates generation!
    components: ["somatic"],
    somaticText: "Heave your massive weapon back, straining muscle fibers as you force the swing."
  }
  ```

---

## Part 6: Step-by-Step Audit Action Plan

Perform these operations in order for the target class data module:

1. **Narrative Refactoring**:
   * Inspect the `overview` section. Revamp lore, character archetypes, and combat role to remove visceral, graphic self-mutilation/grotesque horror. Inject high-exertion, alchemical strain, speed, and strategic risk.
   * Write a detailed, three-turn `immersiveCombatExample` showing the combat loop, resource building/spending, and intense somatic descriptions.
2. **Starting Equipment Paths**:
   * Set up two high-flavor starting paths that support distinct playstyles. Detail damage formulas and somatic flavor.
3. **Subclass Specialization Cleanup**:
   * Inspect the `specializations.specs` array.
   * Simplify all specializations. Remove the legacy `keyAbilities` array completely.
   * Ensure each spec features exactly one powerful `specPassive` object with `name` and `description` defining the subclass playstyle.
4. **Spell-by-Spell Audit**:
   * Iterate through every spell in the `spells` array.
   * **Rule A**: Format the spell opening on a single line: `{ id: "spell_id",`
   * **Rule B**: Place a space before the colon for all non-spell nested IDs (e.g., `id : "status_effect_id",`).
   * Apply the 7 Unbreakable Spell Rules to all spell configurations.
   * Ensure all status effects inside `buffConfig` and `debuffConfig` have populated `mechanicsText` overrides to prevent rendering bugs.
   * Normalize resource costs (ensure non-passive spells have `actionPoints` and negative costs for resource-generating abilities).
   * Tone down somatic/verbal components from visceral horror to athletic stamina and intense concentration.
5. **Syntax Verification**:
   * Ensure that the final file is perfectly valid ESM syntax. Double-check all brackets, braces, and commas.

Begin by confirming that you understand the rules, summarize your refactoring plan for the target class, and execute the edits with absolute precision.

### === END OF PROMPT ===
