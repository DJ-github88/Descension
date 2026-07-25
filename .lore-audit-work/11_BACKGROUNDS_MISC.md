# BACKGROUNDS & MISC DATA — AUDIT

**Date:** 16 July 2026
**Domain:** `vtt-react/src/data/` — backgroundData.js, backgroundAbilities.js, backgroundAssets.js, rollableTables.js, skillAbilitiesData.js, skillBasedActionsData.js, lootItemsData.js, summonableTokens.js, startingEquipmentData.js, startingCurrencyData.js, explorationRules.js, conditionsData.js, damageTypes.js, statusEffects.js, windowIntros.js
**Canon benchmark:** `CANON_REFERENCE.md` + `0_MASTER_LORE_MAP_AND_AUDIT.md` Part 2.
**Method:** Full read of all 15 files; cross-check of every house/region/race attribution, classId tag, era label, named entity, and IP-leakage signal against canon §1–§13 and master findings A1–F11.

---

## A. COVERAGE

| File | Lines | Lore-bearing? | Read? |
|------|-------|---------------|-------|
| backgroundData.js | 1391 | **YES (heavy)** — 24 backgrounds × origin lore + region/race restrictions + class hooks | ✅ Full |
| backgroundAbilities.js | 432 | Medium — ability names + flavor | ✅ Full |
| backgroundAssets.js | 10 | No — image filenames only | ✅ Full |
| rollableTables.js | 262 | **YES (heavy)** — 9 tables × 20 entries of flavor text | ✅ Full |
| skillAbilitiesData.js | 1186 | Light — mostly mechanical; school assignments + descriptions | ✅ Full |
| skillBasedActionsData.js | 22 | Trivial — CLEARED, empty array + stub | ✅ Full |
| lootItemsData.js | 323 | **YES (medium)** — 20 items with dual D&D/Mythrill flavor | ✅ Full |
| summonableTokens.js | 1032 | **YES (medium)** — 40+ tokens with class-domain flavor | ✅ Full |
| startingEquipmentData.js | 1580 | **YES (medium)** — 60+ universal items, heavily Mythrill-flavored | ✅ Full |
| startingCurrencyData.js | 450 | Light — currency math + flavor strings | ✅ Full |
| explorationRules.js | 482 | **YES (heavy)** — 7 regions + 1 campaign arc with deep lore | ✅ Full |
| conditionsData.js | 224 | Light — generic conditions + boilerplate | ✅ Full |
| damageTypes.js | 127 | Medium — 9 damage types with canon definitions | ✅ Full |
| statusEffects.js | 327 | Light — status effects + boilerplate + WoW icon URLs | ✅ Full |
| windowIntros.js | 49 | None — UI intros only | ✅ Full |

**Coverage: 15/15 files read in full.** Every house↔region pairing, race restriction, classId tag, named NPC, faction, era reference, and damage-type definition verified against canon.

---

## B. INCONSISTENCY MAP

Severity: **🔴 CRITICAL** (lore flatly wrong / inverts canon) · **🟠 MAJOR** (misleading / diverges from canon / significant data bug) · **🟡 MINOR** (polish / echoes known master finding / undefined term).

### 🔴 BG-1. groveWarden "There were eight noble houses" — inverts the 7-house Binding canon
- **Location:** `backgroundData.js:783` (description), `:1218` (BACKGROUND_FLAVOR_TEXT), `:1308` (roleplay hook)
- **Canon says (§4, §F1):** **7** noble houses signed at the Binding (6 trading houses + Viridane as the ORIGINAL 7th). Viridane refused at the *Breach* (Year 11), not the Binding. Official record = 7 (6 + Morrath as substitute for the erased Viridane). Briaran "8th house" = a *folk self-title* counting Viridane as 7th and themselves as 8th.
- **Lore says:** *"There were eight noble houses, not seven. The histories will tell you otherwise. The histories are wrong."* … *"House Viridane (the erased eighth house) sealed its counter-pact when the other houses marched their heirs to be sacrificed to Keth-Amar."* Roleplay hook: *"There were eight houses, not seven. Does the eighth still survive...?"*
- **Notes:** This is the same class of error as master **F1** (timelineStore "Eight noble houses at the Binding"). The groveWarden text (a) invents 8 houses at the bargain table, (b) calls Viridane "the eighth" rather than the original 7th, and (c) contradicts the canon that only 7 signed. The Briaran folk-truth is about *themselves* being 8th (Viridane = 7th), not Viridane being 8th. Appears 3× in this file.

---

### 🟠 BG-2. bloodlineHeir frames Viridane as "an eighth" — inverts Viridane's canonical 7th position
- **Location:** `backgroundData.js:208` (description), `:1206` (flavor text)
- **Canon says (§4):** Viridane was the **original 7th** signer at the Binding; Morrath is the post-Breach *substitute* 7th. The Briaran "8th house" folk-truth counts Viridane as 7th and themselves as 8th.
- **Lore says:** *"The histories speak of seven noble houses that sealed the bargains of survival, but some whisper of an eighth: House Viridane, which refused to feed its heir to Keth-Amar... The Briaran, descendants of Viridane, call themselves the eighth house because they count what the official records hide."*
- **Notes:** From the official-record POV (7 = 6 + Morrath), calling Viridane "an eighth" beyond the official 7 has superficial logic — but it contradicts the canonical fact that Viridane *signed as the 7th at the Binding*. The text never identifies Viridane as the original 7th; it consistently positions Viridane as "the eighth." This conflates Viridane's position with the Briaran's "8th house" self-title. Lower severity than BG-1 because the timing ("refused... at the Breach") and Morrath-as-substitute are correct, but the numbering is inverted.

---

### 🟠 BG-3. D&D / Warcraft IP-leakage cluster in lootItemsData.js — non-canonical races & places
- **Location:** `lootItemsData.js` — `dwarven-hammer:40`, `dwarven-ale:61`, `ancient-heartwood:108`, `orcish-greataxe:130`, `warlord-trophy-necklace:155`
- **Canon says (§8):** The 10 playable races are Humans, Astril, Briaran, Emberth, Myrathil, Neth, Mimir, Vreken, Groven, Fexric. **No dwarves, no elves (Vreken are elven-*origin* but now fungal and not called elves), no orcs, no goblins** (Fexric are "goblinoid engineers" but not named goblins).
- **Lore says:**
  - `dwarven-hammer`: *"Forged in the heart of Mount Thunderpeak by Runelord Thrain... crushed a thousand goblin skulls."* — D&D/Warcraft dwarf + goblin references, non-canonical location "Mount Thunderpeak," non-canonical NPC "Runelord Thrain."
  - `dwarven-ale`: *"Brewed from a secret recipe guarded by the Stonebeard clan for seven generations."* — "Stonebeard clan" = Tolkien/D&D dwarf clan. Item itself named "Dwarven Ale."
  - `ancient-heartwood`: *"stood watch over the Eldwood Forest before the first elf spoke a word."* — "Eldwood Forest" not in canon; "the first elf" implies elves exist as a category (they don't, canonically).
  - `orcish-greataxe`: *"used by Warlord Krag to cleave a dwarven shield wall in two at the Battle of Iron Pass."* — orcs + dwarves + non-canonical "Battle of Iron Pass" + non-canonical NPC "Warlord Krag."
  - `warlord-trophy-necklace`: *"Each tooth... marks a chieftain who dared challenge Warlord Krag's rule."* — same Krag cluster.
- **Notes:** These are clearly **D&D SRD leftover items** with a thin Mythrill flavor sentence prepended (Sundered Caldera, Solbrand ember, Bryngloom, Neth Ledger-tome). Echoes master **A15** (real-world mythology / IP leakage). Five items form a coherent cluster; recommend full Mythrill-native rewrite or replacement. The Mythrill-flavored prefixes are fine; the core descriptions are the problem.

---

### 🟠 BG-4. Inquisitor tokens summon Emberspire fiends — wrong class-domain mapping + D&D fiend taxonomy
- **Location:** `summonableTokens.js:140-331` (the `inquisitor` token group, 10 tokens)
- **Canon says (§1, §9):** **Inquisitor** (founded by Orven/Elias) = Wyrd-hunting class. **Pyrofiend** (First Cabal) = the class *exclusively* bound to Scathrach, who dwells in Emberspire's deepest vent. Emberspire's depths = Scathrach's domain (Pyrofiend territory).
- **Lore says:** The Inquisitor token group summons Imp, Shadow Hound, Abyssal Brute, Banshee, Wraith, Pit Fiend, Balor, Lesser Demon, Apocalypse Demon, Demon Prince — **all described as originating from Emberspire**: *"From the smoldering depths of Emberspire, this tiny fiend cackles"* (Imp); *"A lord of Emberspire's seventh circle"* (Pit Fiend); *"The generals of Emberspire's host"* (Balor); *"The throne itself of Emberspire manifests"* (Demon Prince).
- **Notes:** Two layered problems: (1) **Lore:** Inquisitors hunt the Wyrd; they don't command Emberspire's fiend hierarchy. Emberspire's depths belong to Scathrach and the Pyrofiend pact (canon §1: Scathrach "sealed the vent from within"). Having Inquisitors summon Emberspire fiends trespasses on Pyrofiend's exclusive domain. (2) **IP:** Imp/Pit Fiend/Balor/Demon Prince are copyrighted D&D fiends imported wholesale. This is a legacy of the Phase 1.9 "Exorcist → Inquisitor" consolidation (noted in the comment at line 137-139): "Exorcist" thematically fit commanding/binding fiends (D&D exorcist trope), but "Inquisitor" (Mythrill Wyrd-hunter) does not. Recommend retheming to Wyrd-entities (Wyrd-Spawn, Wyrd-Channel bindings) rather than Emberspire fiends.

---

### 🟠 BG-5. "Root-Veil aurora" perpetuates the undefined-entity conflation
- **Location:** `rollableTables.js:64` (weather table, entry 20)
- **Canon says:** The Watcher/Morvane is a distinct cosmic entity (§1). "Root-Veil" is **not defined** in canon — master **A5** flags it as part of a four-way conflation (Morvane = Root-Veil = Solbrand collapse) where Vreken worship "the Root-Veil" in some files and "Morvane" in others.
- **Lore says:** Entry 20 weather result: *"A Root-Veil aurora, bioluminescent sky-glow, rare and ill-omened; the dead grow restless."*
- **Notes:** Treats "Root-Veil" as an established cosmic entity capable of producing auroras and animating the dead — ratifying the very conflation master A5 says to collapse. Echoes A5/B3. If "Root-Veil" is meant to be the Vreken's name for Morvane/the Watcher, it should say so; as written it implies a separate undefined deity.

---

### 🟠 BG-6. Duplicate `starter-oil-flask` ID — data collision
- **Location:** `startingEquipmentData.js:648` (`Bog-Oil Flask`, consumable/POTION) **and** `:1004` (`Lantern Bog-Oil`, consumable/POTION)
- **Canon says:** N/A (data-integrity issue).
- **Lore says:** Two distinct items share the same `id: 'starter-oil-flask'`. One is a "flask of thick bog-oil... greases a terrible death when lit and thrown"; the other is "a pint of bog-oil for lanterns."
- **Notes:** ID collision means any `getAvailableStartingItems` / inventory lookup keyed by `id` will silently return only one of the two; the other becomes unreachable. Not a lore contradiction, but a **functional data bug** in a lore-bearing file. Both descriptions are canon-compliant Mythrill flavor; only the duplicate ID needs fixing (e.g., `starter-lantern-oil-flask` for the second).

---

### 🟠 BG-7. `false_prophet` classId form inconsistent across codebase (extends master F10)
- **Location:** `backgroundData.js:202, 250, 300, 733, 969` (5 occurrences of `'false_prophet'` snake_case in `classHooks`/`tensionPairings`)
- **Canon / codebase says:** The class's own data file (`falseProphetData.js:136`) uses `id: "false_prophet"` (snake_case); but `deepLocationData.js:308,391,1032` uses `'falseProphet'` (camelCase) in `classPresence` arrays; `summonableTokens.js` `CLASS_ID_MAP` normalizes both `'false prophet'` and `'falseprophet'` → `'falseprophet'`. Master **F10** flagged `factionStore.js:985` using `'false_prophet'` vs `'falseProphet'` elsewhere, noting `getFactionsByClass` silently misses it.
- **Lore says:** backgroundData uses the snake_case form in 5 classHook entries.
- **Notes:** This is the same systemic inconsistency as F10 — **three** competing forms (`false_prophet` / `falseProphet` / `falseprophet`) appear across the codebase. Whether `getBackgroundHooks(classId)` resolves depends entirely on which form the consumer passes. backgroundData matches the class's *own* id field (`false_prophet`) but mismatches deepLocationData's `falseProphet`. Recommend ratifying ONE canonical id (likely `'falseProphet'` to match the camelCase convention used by every other class) and migrating all three.

---

### 🟡 BG-8. "Aethil" unratified Warden-name propagates into random table
- **Location:** `rollableTables.js:98` (dungeon_room table, entry 13-14)
- **Canon says (§A7):** "Aethil" is an **unratified rename** of the canonical "Warden" entity — the framework never uses "Aethil."
- **Lore says:** *"Shrine or altar, to Sol, to Aethil, or to something older than either."*
- **Notes:** Echoes master **A7**. Not a contradiction (Aethil IS the in-lore name in lore.json/rules.json), but every use of "Aethil" ratifies the rename by default. Flag for standardization once the A7 decision is made.

---

### 🟡 BG-9. Mimir subrace scheme mismatch (internal) — echoes master B4
- **Location:** `backgroundData.js:817-819` (maskWarden `allowedSubraces`) vs `:833` (maskWarden description)
- **Canon says (§B4):** Mimir subraces have **3 incompatible schemes** — race file = Veiled/Tethered/Untethered · canon = Masked/Woven/Unwoven · GM guide = Mask-Borne/Unwoven/Mist-Woven.
- **Lore says:** `allowedSubraces: ["veiled_mimir", "tethered_mimir", "untethered_mimir"]` (race-file scheme) but the description text uses *"Masked aristocrat, Woven cliff-sentinel, or Unwoven floor-guide"* (canon scheme). Same internal split within a single background entry. `backgroundAbilities.js:286` also uses "Woven."
- **Notes:** Functional (the subrace IDs match the race file's actual implementation) but the prose canon scheme doesn't match the ID scheme. Same in `fogReader` (`:1058-1062`).

---

### 🟡 BG-10. Myrathil subrace scheme mismatch — echoes master B5
- **Location:** `backgroundData.js:1010-1012` (deepCurrentGuide), `:572-574` (merrowSailor)
- **Canon says (§B5):** Myrathil subraces — race file = Shoreling/Deepling/Riverling · canon/lore.json = Shore/Deep/Brook.
- **Lore says:** Both backgrounds use `shoreling_myrathil`, `deepling_myrathil`, `riverling_myrathil` (race-file scheme).
- **Notes:** Functional but perpetuates the non-canonical scheme. Same as BG-9 pattern.

---

### 🟡 BG-11. Echo-Songs vs Sky-Songs naming inconsistency
- **Location:** `backgroundData.js:257` (synodAcademic description) vs `backgroundAbilities.js:82` (synodAcademic "Spell Adaptation" description)
- **Canon says:** No canonical name established; "Echo-Songs" aligns with the Astril/Lumia echo tradition (canon §8: Astril carry "Lumia's echo").
- **Lore says:** backgroundData: *"You learned the forbidden **Echo-Songs**, the throat-sung maps of lineages..."* · backgroundAbilities: *"The forbidden **Sky-Songs** taught you that resonance can be rewritten."*
- **Notes:** Same background, same tradition, two different names in two sibling files. "Echo-Songs" is more canonically resonant (echo = Lumia's resonance); "Sky-Songs" is ambiguous.

---

### 🟡 BG-12. Legacy "force damage" type in background ability
- **Location:** `backgroundAbilities.js:253` (monolithHunter "Ward of Grounding")
- **Canon says (`damageTypes.js`):** `force` is mapped to `storm` via `LEGACY_TYPE_MAP`. The 9 canonical types are physical/ember/rime/storm/arcane/primal/blight/wyrd/sacred. "Force" is a legacy D&D type.
- **Lore says:** *"Wyrd-creatures in the ward take 1d6 **force damage** when they start their turn there."*
- **Notes:** Should be `storm` damage (per the legacy map) or `wyrd` damage (more thematic for an anti-Wyrd ward). Minor but inconsistent with the file's own damageTypes.js canonicalization.

---

### 🟡 BG-13. Real-world mythology leakage in rollable tables & tokens — echoes master A15
- **Location:** `rollableTables.js` (Sluagh `:11`, Schratling `:13`); `summonableTokens.js` (Wendigo `:75`, Banshee `:199`, Balor `:256`); `explorationRules.js` (Hungry Child — name only, `:30`)
- **Canon says (§A15):** `LORE_STYLE_GUIDE` warns against real-world mythology/IP leakage.
- **Lore says:** Creature names borrowed directly from real-world folklore: **Sluagh** (Irish/Scottish host of the unforgiven dead), **Schrat/Schratling** (Germanic forest wight), **Wendigo** (Algonquian), **Banshee** (Irish), **Balor** (Celtic Fomorian).
- **Notes:** Echoes master A15. Some (Schratling, Sluagh) may be deep enough in-setting to grandfather; others (Wendigo, Balor) are strongly recognizable real-world terms. Tonal consistency pass recommended.

---

### 🟡 BG-14. "Sundari" + "kumis" — non-canonical adjectival form & real-world drink
- **Location:** `rollableTables.js:167-168` (tavern_drink table)
- **Canon says:** The Sundale region's people are **Solvarn** (human subrace). No "Sundari" demonym appears in canon. "Kumis" is a real-world Central Asian fermented-mare drink.
- **Lore says:** *"Sundari ash-wine, 2 sp, dark as the caldera, traded by Solvarn caravans"* and *"Ordan kumis, 1 sp, sharp and herd-strong, fermented on the drive."*
- **Notes:** "Sundari" is likely an adjectival coinage for "of Sundale," but non-standard (and "Solvarn caravans" already supplies the demonym two words later — redundant). "Kumis" is a real-world beverage name; recommend a Mythrill-native term.

---

### 🟡 BG-15. "Dawn's Favor" ability-name collision
- **Location:** `skillAbilitiesData.js:846` (Religion skill ability) vs `backgroundAbilities.js:4` (emberspirePilgrim background ability)
- **Canon says:** N/A (naming collision, not lore).
- **Lore says:** Two mechanically distinct abilities share the name **"Dawn's Favor"**: (1) a Religion-based skill ability granting one of four boons via d4 roll; (2) an emberspirePilgrim passive granting radiant resistance + advantage. The name "Dawn's Favor" implies the Dawn Vigil faith, which fits the pilgrim but not the generic Religion skill.
- **Notes:** Could confuse `getBackgroundAbilityByName` / `getSkillAbility` lookups if names are used as keys across domains.

---

### 🟡 BG-16. Boilerplate artifact strings prepended to descriptions
- **Location:** `skillAbilitiesData.js` ("Skill is memory refined by repetition." at lines 281, 391, 859, 942); `conditionsData.js` ("Every condition is a contract between body and world." at lines 17, 26, 122); `statusEffects.js` ("The body remembers what the mind would forget." — pervasive, ~28 entries)
- **Canon says:** N/A (data-quality artifact).
- **Lore says:** Identical flavor sentences robotically prepended to many unrelated entries (e.g., the "Disarm" ability description begins *"Skill is memory refined by repetition. when attacked by an opponent..."*).
- **Notes:** Looks like a templating placeholder that was never replaced with per-entry flavor. Not a lore contradiction, but degrades the lore-bearing text. The "contract between body and world" framing in conditionsData is at least thematically Mythrill (contracts/bargains); the "Skill is memory..." and "body remembers..." strings are generic.

---

### 🟡 BG-17. `wyrd` assigned as school for mundane mental/social skills — semantic drift
- **Location:** `skillAbilitiesData.js` — Deception(267), History(323), Insight(381), Intimidation(443), Investigation(505), Performance(725), Persuasion(791), Perception(673) all use `school: 'wyrd'`
- **Canon says (§2, `damageTypes.js:49-54`):** **Wyrd** = "the raw, entropic corruption of Keth-Amar... spiritual contagion... bleeding through the cracks in the binding seal." It is Keth-Amar's specific corruption agriculture, NOT generic psychic/mental magic.
- **Lore says:** Eight mundane skill abilities (lying, recalling history, reading motives, taunting, analyzing, performing, persuading, spotting) are tagged with the `wyrd` school — the same school as Keth-Amar's cosmic corruption.
- **Notes:** Dilutes the canon meaning of "Wyrd." Either (a) the spell-school taxonomy uses `wyrd` as a catch-all for "mental/psychic" magic (in which case canon §2's definition is being ignored), or (b) these are mislabeled. Recommend either a distinct `psychic`/`mental` school, or renaming to align with the canon Wyrd definition.

---

### 🟡 BG-18. "Revel Sylvan" — undefined faction/location referenced 4×
- **Location:** `startingEquipmentData.js:1296` (bone-flute), `:1319` (frame-drum); `summonableTokens.js:623` (Avatar of Music: "the final chord of the Old Revel"); `startingCurrencyData.js:84` (entertainer: "Revel Sylvan applause-coin")
- **Canon says:** "Revel Sylvan" / "Old Revel" appears nowhere in canon or (per master audit) factionStore's 49 factions. "Sylvan" implies fey/forest, which could fit Frostwood/Briaran territory but isn't established.
- **Lore says:** Referenced as an established minstrel-hall location and cultural tradition ("Revel Sylvan minstrel-hall keeps a rack of these," "Old Revel melodies still march to this drum," "final chord of the Old Revel").
- **Notes:** Undefined entity used as if canonical. Either ratify as a faction/location or replace. Particularly odd given the Minstrel class founder is **Lyris** (canon §9: "tide-song calms Mereval storm") — the Minstrel tradition is maritime (Iceheart), not "Sylvan" (forest/fey).

---

### 🟡 BG-19. "Apprentice" — non-canonical class reference
- **Location:** `skillBasedActionsData.js:18` (SKILL_ACTIONS_CATEGORY description)
- **Canon says (§9):** The 20 canonical classes do not include "Apprentice."
- **Lore says:** *"The tools every Apprentice must master before binding their first contract."*
- **Notes:** The file is CLEARED (empty array, line 12), so this is dead stub text. But "Apprentice" as a class/rank concept is non-canonical. Likely a leftover from the pre-clear version.

---

### 🟡 BG-20. Legacy D&D SRD background IDs retained in startingCurrencyData
- **Location:** `startingCurrencyData.js:14-134` (BACKGROUND_STARTING_CURRENCY keyed by `acolyte`, `criminal`, `folkHero`, `noble`, `sage`, `soldier`, `outlander`, `charlatan`, `entertainer`, `guildArtisan`, `hermit`, `sailor`, `merchant`, `urchin`, `scholar`)
- **Canon says:** `backgroundData.js:7` states "All 15 D&D SRD backgrounds replaced with Mythrill-native backgrounds" (Phase 4, 2026-06-10). The new backgrounds are `emberspirePilgrim`, `shyrRunner`, `ledgerKeeper`, etc.
- **Lore says:** startingCurrencyData still keys its fallback table by the **old D&D IDs** (with flavor retrofit, e.g., "acolyte" → "Temple-keep alms from Solbrand-tenders").
- **Notes:** Functionally **dead code** — `calculateStartingCurrency` (line 291-292) first reads `bgData?.startingCurrency` from backgroundData (all new backgrounds have this), so the legacy fallback never fires for valid new backgrounds. But 15 dead entries with retrofitted flavor remain. The retrofit descriptions (Solbrand, Neth, Thalren, etc.) are themselves canon-compliant, just attached to wrong keys.

---

### 🟡 BG-21. `fexrick` spelling in RACE_STARTING_CURRENCY — echoes master B1
- **Location:** `startingCurrencyData.js:201`
- **Canon says (§8, §B1):** Framework text uses **"Fexric"**; race file is `fexrick.js`; lore.json key is `fexrick`. No canonical spelling ratified.
- **Lore says:** `RACE_STARTING_CURRENCY` uses `'fexrick'` (matching the file/key spelling, not the framework prose).
- **Notes:** Echoes B1. Consistent with the codebase file naming but not with framework prose. Resolves once B1's spelling decision is made.

---

### 🟡 BG-22. Neth `raven_scout` token references subrace `wraith` — not a known Neth subrace
- **Location:** `summonableTokens.js:899` (`neth_raven_scout`)
- **Canon says:** Known Neth subraces (per backgroundData.js `debtNegotiator.allowedSubraces`) are `velun_neth`, `kessen_neth`, `drun_neth`.
- **Lore says:** Token declares `subrace: 'wraith'`.
- **Notes:** "wraith" is not among the three known Neth subraces. Either an undocumented 4th subrace, a deprecated ID, or an error. `getTokensForRace('neth', 'wraith')` would only match characters specifically tagged with that subrace.

---

### 🟡 BG-23. Status-effect icons sourced from World of Warcraft asset CDN
- **Location:** `statusEffects.js` — all 28 entries use `icon: 'https://wow.zamimg.com/images/wow/icons/large/...'`
- **Canon says:** N/A (asset/IP concern, not lore).
- **Lore says:** Every status-effect icon URL points to `wow.zamimg.com` (the WoW database icon CDN — e.g., `spell_frost_stun.jpg`, `ability_rogue_rupture.jpg`).
- **Notes:** External dependency on a third-party game's asset server. Not a lore contradiction, but an asset-resilience and IP concern. The `tokenIcon` fields in summonableTokens.js use local paths (`/assets/icons/...`), so local icon assets exist for other systems — statusEffects should follow suit.

---

### 🟡 BG-24. "knotted cord-Knot Navigation" — duplicated-word typo
- **Location:** `explorationRules.js:301` (rule name), `:303` (description)
- **Canon says:** N/A.
- **Lore says:** Rule named *"knotted cord-Knot Navigation"*; description: *"Navigating paths marked by knotted knotted cord strings rather than written signage."*
- **Notes:** Stuttered phrasing ("knotted cord-Knot," "knotted knotted cord"). Cragjaw/Tesshan knotted-cord navigation is canon-compliant; the typo is purely editorial.

---

### 🟡 BG-25. "Fredløse" (with ø) vs "Fredløse" (ASCII) orthography drift
- **Location:** `explorationRules.js:189` ("Fredløse Passage") vs `backgroundData.js:403` ("Fredløse")
- **Canon says:** N/A (orthography).
- **Lore says:** Nordhalla's outlaw clans spelled "Fredløse" (with Nordic ø) in explorationRules but "Fredløse" (ASCII) in backgroundData.
- **Notes:** Minor orthographic drift. The ø is consistent with Nordhalla's Nordic flavor but breaks grep parity with the ASCII form. Pick one.

---

### 🟡 BG-26. "Martyr Brigades" / "Dawn Vigil Spellguards" — class-name conflation
- **Location:** `explorationRules.js:232` ("Martyr Brigades"), `:237` ("Dawn Vigil Spellguards")
- **Canon says (§9):** **Martyr** is a specific class (Sera Solvan; takes suffering Keth-Amar would feed on). **Spellguard** is a specific class (Damon; defend Aex's seal).
- **Lore says:** Dawn Vigil press-gangs youth into "sulfur mine **Martyr Brigades**" (forced labor); combat option triggers "Dawn Vigil **Spellguards**."
- **Notes:** "Martyr Brigades" uses the class name for generic forced-labor units (the Martyr class is about willing suffering, not penal labor — semantically inverted). "Dawn Vigil Spellguards" implies the Vigil employs Spellguard-class members, which is plausible (a theocracy would employ magical defenders) but blurs the line between the class and a generic unit type. Minor, but worth disambiguating (e.g., "Vigil Ward-Guard" instead of "Spellguard").

---

### 🟡 BG-27. Stale comment "LICHBORNE (1 token)" over a 4-token block
- **Location:** `summonableTokens.js:643`
- **Canon says:** N/A (comment maintenance).
- **Lore says:** Section header comment reads *"LICHBORNE (1 token)"* but the immediately-following `revenant:` array contains **4 tokens** (Ice Wall, Spectral Ally, Skeletal Archers, Spectral Vanguard).
- **Notes:** Stale header from before the Phase 1.10 deathcaller/lichborne → revenant consolidation expanded the block. Pure documentation drift.

---

### 🟡 BG-28. "Celestial Conclave" & "Archmage Elara" — non-canonical NPC/faction names
- **Location:** `lootItemsData.js:174` (arcane-focus-crystal: "an archmage of the Celestial Conclave"), `:187` (mage-robe: "Archmage Elara herself")
- **Canon says:** Neither "Celestial Conclave" nor "Archmage Elara" appears in canon, factionStore, or npcStore (per master audit's ~71 named NPCs / 49 factions).
- **Lore says:** Both referenced as established figures/institutions in item backstories.
- **Notes:** Non-canonical named entities used as flavor. The Mythrill-flavored prefixes (Anchor-stone of the Neth First Contract; Vreken crypt-light) are fine; the D&D-generic "Celestial Conclave"/"Archmage Elara" core is the problem.

---

### 🟡 BG-29. "druid elder" — D&D class term
- **Location:** `lootItemsData.js:118` (thornroot-seed)
- **Canon says (§9):** "Druid" is not one of the 20 canonical classes. The closest Mythrill equivalents are **Animist** (Kael/Nyssa/Theron; ancestral spirits) or **Shaper** (Veyra; flesh-shaping).
- **Lore says:** *"Planted by a druid elder who foresaw the forest's need for a new guardian a millennium hence."*
- **Notes:** D&D class term leaked into flavor text. Recommend "Animist elder" or "Shaper-elder."

---

### 🟡 BG-30. "Cosmic Flatulence Elemental" — tonal break
- **Location:** `summonableTokens.js:581` (harbinger chaos-gate variants list)
- **Canon says:** N/A (tonal).
- **Lore says:** Listed alongside serious variants (Fire Elemental, Silence Wraith, Chaos Slime, etc.) as a possible Harbinger chaos-gate summon: *"Cosmic Flatulence Elemental."*
- **Notes:** Joke entry in an otherwise serious lore corpus. Tonal inconsistency.

---

## C. DEPRECATED-NAME BUGS vs INTENTIONAL

Per the master rule: **comments / migration notes / sub-tradition documentation = INTENTIONAL**; **live classId tags using deprecated names = BUG.**

### INTENTIONAL (comments documenting class consolidations — leave as-is):
| Location | Form | Status |
|----------|------|--------|
| `summonableTokens.js:137-139` | Comment: *"EXORCIST (10 tokens) — 'Exorcist' tokens now used by 'Inquisitor' (Phase 1.9 consolidation)"* | ✅ Intentional migration doc |
| `summonableTokens.js:722` | Comment: *"REMOVED: deathcaller merged into Revenant as Phase 1.10 consolidation"* | ✅ Intentional |
| `summonableTokens.js:643` | Comment: *"LICHBORNE (1 token)"* | ✅ Intentional (but stale count — see BG-27) |
| `summonableTokens.js:927, 931-932, 938, 946` | CLASS_ID_MAP comments: covenbane/exorcist/dreadnaught/lichborne/titan merges | ✅ Intentional |
| `summonableTokens.js:140-331` | Token `id` fields keep `exorcist_` prefix after Inquisitor consolidation | ✅ Intentional (IDs are stable keys; the `key` is `inquisitor`) |
| `backgroundData.js:11-43` | Commented-out D&D SRD backgrounds block | ✅ Intentional (Phase 4 reference) |
| `lootItemsData.js:9-17` | Comments: *"MOVED TO MAIN ITEM STORE"* | ✅ Intentional |
| `skillBasedActionsData.js:4-9` | Comment: *"CLEARED FOR TESTING... Original actions backed up"* | ✅ Intentional |

### BUGS (live tags using deprecated/inconsistent forms):
| Location | Form | Issue | Severity |
|----------|------|-------|----------|
| `backgroundData.js:202,250,300,733,969` | `'false_prophet'` (snake_case) in live `classHooks.classId` | Inconsistent with `'falseProphet'` (deepLocationData) and `'falseprophet'` (summonableTokens map). Extends master **F10**. | 🟠 BG-7 |
| `startingCurrencyData.js:14-134` | Legacy D&D background IDs (`acolyte`, `criminal`, etc.) as live keys | Dead-code fallback; new backgrounds bypass it. Not strictly a bug (graceful fallback) but 15 stale keys. | 🟡 BG-20 |
| `backgroundAbilities.js:253` | `'force damage'` (legacy D&D type) | Should be `storm` per damageTypes.js LEGACY_TYPE_MAP. | 🟡 BG-12 |
| `summonableTokens.js:899` | `subrace: 'wraith'` (Neth) | Not a known Neth subrace; possibly deprecated/undocumented. | 🟡 BG-22 |

**Verdict on deprecated names:** No NEW deprecated-class-name bugs beyond the `false_prophet` form inconsistency (BG-7, which extends F10). The class-consolidation comments are all properly documented as intentional. The token `id` prefixes (`exorcist_*`) are stable identifiers intentionally preserved through the rename. The one genuine concern is the **three-way `falseProphet`/`false_prophet`/`falseprophet` split**, which is systemic (touches factionStore per F10, deepLocationData, summonableTokens, backgroundData, and the class's own data file).

---

## D. SUMMARY

- **Files audited:** 15/15 (full read).
- **Total inconsistencies mapped:** **30** (1 🔴 CRITICAL, 6 🟠 MAJOR, 23 🟡 MINOR).
- **New contradictions not already in master audit:** BG-1 (groveWarden 8 houses — new instance of F1 class), BG-3 (lootItems D&D cluster — new A15 instance with named items), BG-4 (Inquisitor/Emberspire fiend domain conflict — novel), BG-5 (Root-Veil aurora — new A5 instance), BG-6 (duplicate oil-flask ID — novel data bug), BG-11 (Echo/Sky-Songs), BG-15 (Dawn's Favor collision), BG-17 (wyrd school drift), BG-18 (Revel Sylvan), BG-22 (Neth 'wraith' subrace), BG-26 (Martyr/Spellguard class-name conflation), BG-28 (Celestial Conclave/Elara).
- **Echoes of existing master findings:** BG-2 (F1 vein), BG-7 (F10), BG-8 (A7), BG-9 (B4), BG-10 (B5), BG-13 (A15), BG-21 (B1).
- **Single biggest lore fix:** BG-1 + BG-2 (Viridane numbering) — collapse the "eight houses / Viridane-is-eighth" framing to canon's "7 original (Viridane = 7th) + Morrath substitute."
- **Single biggest data fix:** BG-6 (duplicate `starter-oil-flask` ID) — pure functional bug, one rename.
