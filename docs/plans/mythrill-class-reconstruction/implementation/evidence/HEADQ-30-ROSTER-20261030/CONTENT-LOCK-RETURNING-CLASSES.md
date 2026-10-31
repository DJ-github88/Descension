# Content Lock & Historical Inventory: Returning Classes

**Date:** 2026-10-30  
**Status:** Frozen Content Inventory & Modernisation Requirements  
**Scope:** The 6 Returning Classes from Repository History: Covenbane, Exorcist, Dreadnaught, Inscriptor, Witch Doctor, Bladedancer.  
**Historical Source Anchor:** Commit `fc096627~1` (pre-consolidation commit) and historical class definitions.

---

## 1. Overview & Modern Class Package Standard

To qualify for integration into the live Mythrill VTT application and selectable character roster, each returning class must satisfy the repository's established class package contract:

1. **Class Data Module (`src/data/classes/<className>Data.js`):**
   - Canonical display metadata, role, color, damage types, cognitive tags, playstyle description.
   - Core grants (innate signature abilities not charged against optional picks).
   - Stratified levels 1–10 optional spell pools (minimum 4 distinct options per level, including non-damage options).
   - Complete spell object schema: targeting, range, duration, resource costs, action points, consequences, manual tabletop descriptors.
2. **Talent Trees Module (`src/data/talentTrees/<className>.js`):**
   - 3 distinct specialisation trees with exactly 50 total allocated points (Tiers 0–7/8).
   - Standard node schema containing embedded `spell: { name, description, source: 'talent', class, treeId, spellType, ... }` and `rankUpgrades: [{ description }, ...]`.
   - Explicit prerequisites, tier gates, and same-tree point requirements.
   - Clean level-down and single-node refund compliance.
3. **Resource System & Guide (`src/data/resourceSystems/<className>ResourceGuide.js`):**
   - Structured rules, thresholds, generation, spending, and recovery for the class resource.
   - HUD resource component rendering in `src/components/hud/` or `src/data/classes/<className>/components/`.
4. **Heritage & Provenance (`src/data/classHeritageRegistry.js`):**
   - Authoritative institutional background, native tradition, training requirements, equipment proficiencies.
5. **Integration Tests (`src/data/classes/__tests__/<className>Integration.test.js`):**
   - Roster presence, spell pool integrity, talent tree allocation/refund, resource initialization, character-switch safety.

---

## 2. Inventory of Returning Classes

### Class 1: Covenbane (`covenbane`)

- **Historical Artifacts in `fc096627~1`:**
  - `vtt-react/src/data/classes/covenbaneData.js` (111,884 bytes)
  - `vtt-react/src/data/talentTrees/covenbane.js` (12,930 bytes)
- **Role & Theme:** Anti-Magic Hunter / Witch Hunter. Bog-iron weapons, null-salts, tracking residual magic trails.
- **Historical Resource:** Hexbreaker Charges (0–6). Built through spell disruption and spent on punitive strikes.
- **Historical Trees (10 nodes each = 30 nodes total):**
  1. `COVENBANE_SHADOWBANE`: Anti-sorcery tracking, null-aura, silence, stealth interruption.
  2. `COVENBANE_SPELLBREAKER`: Kinetic dispelling, counter-spell retaliation, shield shattering.
  3. `COVENBANE_DEMONHUNTER`: Abyssal entity banishment, holy iron strikes, fear immunity.
- **Historical Spells Identified:** 32 spells with `cov_*` and `covenbane_*` IDs (e.g., `cov_shadow_hunt`, `cov_hex_strike`, `cov_silver_blade`, `cov_dark_pursuit`, `covenbane_magic`).
- **Gaps & Modernisation Requirements:**
  1. *Payload Disentanglement:* Covenbane was partially merged into Inquisitor in earlier consolidation commits. The exact spell and node payload must be disentangled from `inquisitorData.js` so Covenbane reclaims its anti-coven/witch-hunter identity while Inquisitor remains a retired ecclesiastical interrogator.
  2. *Tree Modernisation:* Historical trees are 10 nodes each with flat rank descriptions. Must be expanded to standard 50-point progression trees with embedded `spell` and `rankUpgrades` schemas.
  3. *Resource System:* Author `covenbaneResourceGuide.js` and build HUD component for Hexbreaker Charges.

---

### Class 2: Exorcist (`exorcist`)

- **Historical Artifacts in `fc096627~1`:**
  - `vtt-react/src/data/classes/exorcistData.js` (68,138 bytes)
  - `vtt-react/src/data/talentTrees/exorcist.js` (13,336 bytes)
- **Role & Theme:** Holy Expulsion / Sin-Eater / Entity Purger.
- **Historical Resource:** Divine Dominance (DD).
- **Historical Trees (12 nodes each = 36 nodes total):**
  1. `EXORCIST_DEMONOLOGIST`: Demon-binding, multi-demon control, dominance die upkeep.
  2. `EXORCIST_DEMON_LORD`: High-tier fiend enslavement and pact manipulation.
  3. `EXORCIST_POSSESSED`: Voluntary self-possession and channeling demonic power.
- **Historical Spells Identified:** Only 6 example spells in `exampleSpells` (e.g., `exo_purge_the_defiled`, `exo_salt_brand`, `exo_scourge_of_submission`, `exo_cinder_leash`, `exo_iron_barrier`, `exo_spectral_dread`). Zero spells in level 1–10 pools.
- **Gaps & Modernisation Requirements:**
  1. *Critical Lore Contradiction:* The historical talent trees model *demon-summoning and enslavement* ("Legion Mind", "Steady Rein", multi-demon slots), which directly violates the approved HeadQ identity: *"Full host-protecting expulsion versus researched supernatural countermeasures... No automatic demon-control restoration or global nullification."* The trees must be completely redesigned around exorcism rites, host cleansing, wards, and salt-sealing.
  2. *Missing Progression Content:* Levels 1–10 spell pools have 0 historical spells. A full 40+ spell library must be authored.
  3. *Resource System:* Author `exorcistResourceGuide.js` and modern HUD display.

---

### Class 3: Dreadnaught (`dreadnaught`)

- **Historical Artifacts in `fc096627~1`:**
  - `vtt-react/src/data/classes/dreadnaughtData.js` (87,480 bytes)
  - `vtt-react/src/data/talentTrees/dreadnaught.js` (19,600 bytes)
- **Role & Theme:** Juggernaut / Walking Fortress / Steam-Furnace Heavy Plate.
- **Historical Resource:** Furnace Pressure / Forge Core.
- **Historical Trees (16 nodes each = 48 nodes total):**
  1. `DREADNAUGHT_SHADOW_CITADEL`: Fortress defense, shadow shields, obsidian armor.
  2. `DREADNAUGHT_SUFFERING_WEAVER`: Absorbing blows, pain conversion.
  3. `DREADNAUGHT_DOOM_BRINGER`: Heavy momentum, trample, crushing destruction.
- **Historical Spells Identified:** 31 spells with `dread_*` IDs (e.g., `dread_furnace_reignition`, `dread_iron_trample`, `dread_steam_vent`, `dread_stoke_coals`).
- **Gaps & Modernisation Requirements:**
  1. *Martyr Ironclad Collision:* In the current live codebase, Martyr already possesses the 4th tree `MARTYR_IRONCLAD` (`vtt-react/src/data/talentTrees/martyrIronclad.js`, IDs `icl_t1_*`–`icl_t7_*`, "The Welded Martyr / Living Forge (Groven Dreadnaught heritage)"). Per Settled HeadQ Decision: *"Do not take Martyr’s Ironclad tree away from existing Martyr characters. If Dreadnaught content historically overlaps with it, preserve Martyr’s stable IDs and give Dreadnaught its own independent content."*
  2. *Tree Modernisation:* Historical trees used legacy DRP / card-proc formats. Dreadnaught must receive its own distinct 3-tree layout (e.g. Siege Juggernaut, Furnace Engine, Bastion Core) using unique `dread_*` IDs without colliding with `icl_*`.
  3. *Stratification:* Organize historical spells into levels 1–10 pools and fill to 40+ records.

---

### Class 4: Inscriptor (`inscriptor`)

- **Historical Artifacts in `fc096627~1`:**
  - `vtt-react/src/data/classes/inscriptorData.js` (93,035 bytes)
  - `vtt-react/src/data/talentTrees/inscriptor.js` (13,369 bytes)
- **Role & Theme:** Runic Inscription / Glyph Mage / Tactical Zone Architect.
- **Historical Resource:** Runic Resonance (0–10). Built by etching runes onto surfaces/gear and discharged through runic detonators.
- **Historical Trees (38 nodes total):**
  1. `INSCRIPTOR_RUNEBINDER` (12 nodes): Rune placement, ground zone control, trigger amplification.
  2. `INSCRIPTOR_ENCHANTER` (13 nodes): Equipment runic engraving, temporary weapon/armor enchantments.
  3. `INSCRIPTOR_GLYPHWEAVER` (13 nodes): Floating glyph lattices, projectile redirection, ward barriers.
- **Historical Spells Identified:** 37 spells with `inscriptor_*` IDs (e.g., `inscriptor_shackled_to_stone`, `inscriptor_runic_backlash`, `inscriptor_arcane_inscription`).
- **Gaps & Modernisation Requirements:**
  1. *Tree Schema:* Nodes lack the modern `spell` object and `rankUpgrades` array format required by `talentSystem.mjs` and `TalentTreeContent.jsx`.
  2. *Manual Tabletop Surface Rules:* Clarify physical rune etching requirements (surface preparation, max active runes, disruption rules) for manual VTT play without requiring complex spatial automation.
  3. *Resource System:* Author `inscriptorResourceGuide.js` and HUD display.

---

### Class 5: Witch Doctor (`witchDoctor`)

- **Historical Artifacts in `fc096627~1`:**
  - `vtt-react/src/data/classes/witchDoctorData.js` (116,425 bytes)
  - `vtt-react/src/data/talentTrees/witchdoctor.js` (16,669 bytes)
- **Role & Theme:** Hexer / Fetish Crafter / Curse & Miasma Alchemist.
- **Historical Resource:** Voodoo Essence.
- **Historical Trees (41 nodes total):**
  1. `WITCH_DOCTOR_BOKOR` (13 nodes): Dark curses, soul drain, corpse bursts.
  2. `WITCH_DOCTOR_MAMBO` (14 nodes): Spirit healing, sympathetic doll bonds, cleansing smoke.
  3. `WITCH_DOCTOR_HOUNGAN` (14 nodes): War masks, venom infusions, sacrificial totems.
- **Historical Spells Identified:** 34 spells with `witch_doctor_*` IDs (e.g., `witch_doctor_withering_hex`, `witch_doctor_venomous_sting`, `witch_doctor_spirit_link`, `witch_doctor_totem_of_warding`).
- **Gaps & Modernisation Requirements:**
  1. *Cultural & Lore Alignment:* Historical module heavily imported real-world Haitian Vodou terminology (Bokor, Mambo, Houngan, Loa). In accordance with Mythrill world lore principles and HeadQ instructions, these must be reconciled into authentic Mythrill cultural traditions (e.g., Bog Witchcraft, Fetish Crafting, Hexbinding) without copying Animist's ancestral communion or Druid's primal nature roles.
  2. *Tree Modernisation:* Reformat 41 nodes to 50-point standard schema with embedded `spell` and `rankUpgrades`.
  3. *Resource System:* Rename resource to fit Mythrill canon (e.g. Fetish Essence / Effigy Wax) and author `witchDoctorResourceGuide.js`.

---

### Class 6: Bladedancer (`bladedancer`)

- **Historical Artifacts in `fc096627~1`:**
  - `vtt-react/src/data/classes/bladedancerData.js` (49,524 bytes)
  - `vtt-react/src/data/talentTrees/bladedancer.js` (12,125 bytes)
- **Role & Theme:** Kinetic Duelist / Flow-State Melee Striker.
- **Historical Resource:** Momentum & Trauma.
- **Historical Trees (10 nodes each = 30 nodes total):**
  1. `BLADEDANCER_FLOW_MASTER`: Continuous blade flourishes, dodge-strike chaining, momentum conservation.
  2. `BLADEDANCER_DUELIST`: Single-target parry-riposte, posture breaking, precision cuts.
  3. `BLADEDANCER_SHADOW_DANCER`: Acrobatic repositioning, blind-spot strikes, blurred footwork.
- **Historical Spells Identified:** 16 spells with `bladedancer_*` IDs (e.g., `bladedancer_the_flayed_truth`, `bladedancer_kinetic_dissection`, `bladedancer_frantic_laceration`).
- **Gaps & Modernisation Requirements:**
  1. *Spell Pool Shortage:* Only 16 historical spells exist (needs 40+ stratified across levels 1–10).
  2. *Martial Demarcation:* Distinguish Bladedancer's kinetic flow from Hunter/Apex tracking and Berserker rage. Bladedancer focuses on acrobatic footwork, twin light blades, and tempo/momentum rather than heavy armor or stealth ambush.
  3. *Tree Modernisation:* Reconstruct 3 trees to 50-point standard with embedded `spell` and `rankUpgrades`.
  4. *Resource System:* Author `bladedancerResourceGuide.js` and HUD momentum gauge.
