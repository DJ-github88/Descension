# SPELLS & SPELLCRAFTING — AUDIT

**Domain:** Spell data files + spellcrafting wizard components
**Canon benchmark:** `CANON_REFERENCE.md` (esp. §9 Classes, §10 Eras, §13 Nature of Magic)
**Date:** 16 July 2026
**Mode:** Read-only. No source files were modified.

---

## A. COVERAGE

### Files read in full
| File | Lines | Lore surface |
|---|---|---|
| `data/generalSpellsData.js` | 41 | Tiny — 2 flavor strings only |
| `data/spellLibraryData.js` | 54 | Flavor strings only (collections empty) |
| `data/customSpellLibraryData.js` | 95 | Flavor strings only (categories empty) |
| `data/universalCombatSpells.js` | 853 | Clean — pure mechanics, no class tags |
| `data/classSpellGenerator.js` | 788 | **Deprecated names + spec-ID mismatches** |
| `data/classSpellCategories.js` | 1249 | Migration comments + spec divergence |
| `data/spellTemplates.js` | 555 | **Non-canonical class list in `adaptTemplateForClass`** |
| `data/classSpellTemplates.js` | 20 | Cleared/empty (testSpells holds data) |
| `data/spellUtils.js` | 381 | Pure utility, no lore |
| `data/classResources.js` | 1982 | Resource flavor + deprecated-name comments |
| `utils/classResourceUtils.js` | 159 | Pure utility, no lore |

### Components scanned (grep + targeted reads)
- `components/hud/ClassResourceBar.jsx` (2115 lines) — deprecated names as **live state hooks**
- `components/hud/ResourceTooltip.jsx`, `FortunePointsResourceBar.jsx`, `EternalFrostPhylacteryResourceBar.jsx`
- `components/spellcrafting-wizard/**` — `Step5Resources.jsx`, `ProphecyStep.jsx`, `SpellwizardApp.jsx`, `Step10Review.jsx`, `UnifiedSpellCard.jsx`, `useResourceFormatters.js`, `core/data/resourceTypes.js`, `core/mechanics/*`, `core/utils/spellNormalizer.js`, `context/spellWizardContext.js`
- `components/character-creation-wizard/steps/Step1CoreDraft.jsx`
- Cross-verified against `data/talentTreeData.js`, `data/classes/martyrData.js`, `data/deepLocationData.js`, `data/backgroundData.js`, `data/races/emberth.js`, `data/races/vreken.js`, `data/languages.js`

### v3 flag verification
- **v3 A-11 "classSpellGenerator.js:160 'Chaos Weaver'"** → STALE line ref. Line 160 is now `// ===== PROPERLY FORMATTED SPELL ARCHETYPES =====`. The actual live `Chaos Weaver` identifier sits at **:514** (call) and **:780** (function def `determineChaosWeaverSpecialization`). See S1.
- **v3 B-12/B-13 wizard/HUD deprecated names** → CONFIRMED across `ClassResourceBar.jsx`, `Step5Resources.jsx`, `ProphecyStep.jsx`, `resourceTypes.js`, `useResourceFormatters.js`. See S7–S9, S13.

---

## B. INCONSISTENCY MAP

### S1 — 🔴 CRITICAL — `determineChaosWeaverSpecialization` returns Harbinger spec IDs that exist nowhere
- **Location:** `data/classSpellGenerator.js:780` (def), `:514` (call), `:781-787` (returns)
- **Canon says:** Harbinger specializations are `wild_prophet`, `deaths_seer`, `fate_rift` (`classSpellCategories.js:191-229`; same IDs echoed in `classResources.js:297-311` Mayhem Gauge spec colors).
- **Lore says:** The function returns `'chaos_dice'`, `'entropy_control'`, `'reality_bending'` — none of which appear in any Harbinger spec list. The function NAME is also a deprecated alias (Chaos Weaver → Harbinger, per Master C3).
- **Notes:** v3 A-11 line number is stale. Effect: every Harbinger spell normalized through `processGenericClassSpells(... determineChaosWeaverSpecialization)` gets a `specialization` tag no consumer can match, so spec-based filtering/display silently drops or mis-buckets them. **Functional bug + deprecated-name identifier.**

### S2 — 🔴 CRITICAL — `determineMartyrSpecialization` returns Martyr spec IDs that match NEITHER canonical list
- **Location:** `data/classSpellGenerator.js:744-774` (returns `redeemer`/`avenger`/`protector`)
- **Canon says:** Martyr specializations = `redemption`, `zealot`, `ascetic` (`classSpellCategories.js:314-364`, matched by `classResources.js:663-697` Devotion spec passives).
- **Lore says:** Generator emits `redeemer`/`avenger`/`protector` — the OLD scheme, orphaned by the rename. Corroborating evidence: `talentTreeData.js:229-231` backdrop map is scrambled in the same way —
  ```
  'redemption' → martyr-protector.jpg
  'zealot'     → martyr-redeemer.jpg
  'ascetic'    → martyr-avenger.jpg
  ```
  i.e. each live spec key points at a backdrop file named for a *different* deprecated spec. The rename was applied to the keys but never to the assets, leaving every Martyr spec rendering the wrong backdrop.
- **Notes:** Confirmed functional (visual + categorization) bug. Compounds with S5.

### S3 — 🔴 CRITICAL — `adaptTemplateForClass` is keyed on a non-canonical class list
- **Location:** `data/spellTemplates.js:453-484` (`classResourceMapping`), `:495-506` (`classDamageMapping`), `:509-520` (`classVisualMapping`), `:536-544` (`classNames`)
- **Canon says:** The 20 canonical classes (CANON_REFERENCE §9): Arcanoneer, Berserker, Shaper, Harbinger, Chronarch, Inquisitor, Revenant, False Prophet, Gambit, Apex, Animist, Lunarch, Martyr, Minstrel, Plaguebringer, Pyrofiend, Spellguard, Toxicologist, Warden, Augur.
- **Lore says:** The mapping table uses `pyrofiend` (1 hit) plus 23 names that are **not canonical classes**: `primalist`, `dreadnaught` (deprecated), `elementalist`, `chronomancer` (canonical is **Chronarch**), `shadowblade` (an Apex/Warden *spec*), `beastmaster` (an Apex *spec*), `runesmith`, `planeswalker`, `alchemist`, `soulbinder`, `druid`, `stormbringer`, `spellblade`, `augur` (OK), `artificer`, `necromancer`, `illusionist`, `battlemage`, `witch`, `celestial`, `shaman`.
- **Notes:** Only `pyrofiend` and `augur` can ever match. Every other canonical class falls through to the `|| 'mana'` default at `:486`, so resource-cost adaptation, damage-type adaptation, and visual-theme adaptation are **silently no-ops** for 18 of 20 classes. Function appears to be a pre-canonical leftover that was never reconciled.

### S4 — 🔴 CRITICAL — Spellcrafting-wizard `resourceTypes.js` has orphaned `classRestriction` values
- **Location:** `components/spellcrafting-wizard/core/data/resourceTypes.js:130,148,166,184,202,221,240,461`; filter at `:504`
- **Canon says:** Restriction values should be one of the 20 canonical class IDs.
- **Lore says:** Live restriction strings include `harrow` (:130), `zealot` (:148 — a Martyr *spec*, not a class), `monk` (:184), `hexer` (:202), `dreadnaught` (:221, :240 — deprecated), `warlock` (:461). Only `apex` (:166), `augur` (:258, :278), `harbinger` (:298) are canonical.
- **Notes:** The consumer at `:504` (`resource.classRestriction === className`) will **never match** a canonical class for the harrow/monk/hexer/warlock/dreadnaught resources, so those resource definitions are unreachable dead data and any UI depending on them cannot resolve. `runicPower`/`runes` (:211-247) are doubly deprecated: description says "Dreadnaught abilities" AND restriction is `'dreadnaught'`.

### S5 — 🟠 MAJOR — Martyr specialization lists diverge across files; "Ironclad" exists in class data but not in the spell system
- **Location:** `data/classSpellCategories.js:314-364` (redemption/zealot/ascetic) vs `data/classes/martyrData.js:735` (`{ id: "ironclad", name: "Ironclad" }`)
- **Canon says:** A class has ONE set of specializations. `classSpellCategories` and `classResources` agree on `redemption/zealot/ascetic`.
- **Lore says:** `martyrData.js` defines `ironclad` (and the surrounding prose, :84-90, :741-775, treats "Ironclad" as a full Martyr spec — "Ironclad Vow grants stacking DR… uniqueTo: 'Ironclad'"). Multiple migration comments (`classSpellCategories.js:699`, `classResources.js:996/1549`, `talentTreeData.js:33/179/281`) assert "Dreadnaught absorbed into Martyr as Ironclad specialization," but the spell/resource files never add Ironclad to their spec list.
- **Notes:** Two parallel truths: (a) the **migration comment is half-finished** — Ironclad was added to `martyrData` but never propagated into `classSpellCategories`/`classResources` spec arrays; (b) `classSpellGenerator.determineMartyrSpecialization` returns neither set (see S2). Net result: the Martyr specialization layer is inconsistent in three different ways across three files.

### S6 — 🟠 MAJOR — Revenant resource origin attributed to "Aldren Thalreth" (wrong entity)
- **Location:** `data/classResources.js:494` ("Aldren Thalreth learned to harvest frost from undeath itself"), `:593` ("Aldren Thalreth's frost-harvesting turns spilled blood into volatile deep-ice")
- **Canon says:** Revenant founders = **Kora / Vesper** (CANON_REFERENCE §9; Master E2). Aldren Thalreth is a **Thalreth house scribe-elder** — Jarl-Archivist Kaelen Thalreth's father, the Ledger Purge architect, now fog-addled (`backgroundData.js:166`, `deepLocationData.js:21/55/169/195`, `rollableTables.js:214/226`).
- **Lore says:** The Revenant's Blight Ascension + Blood Tokens system is described as Aldren Thalreth's invention.
- **Notes:** Pure entity conflation — a house scribe is credited with founding a class's core mechanic. Echoes Master Theme 1 (entity conflation). The Frozen Archive / Nordhalla frost angle is canon-adjacent for Revenant, but the named inventor is wrong.

### S7 — 🟠 MAJOR — Deprecated class names in USER-FACING spellcrafting-wizard resource descriptions
- **Location:** `components/spellcrafting-wizard/components/steps/Step5Resources.jsx`
  - `:135` `'Chaos Weaver mayhem modifiers'` (category `chaos_mechanics`; canonical class = **Harbinger**)
  - `:146` `'Fate Weaver token mechanics'` (category `fate_mechanics`; canonical class = **Gambit**)
  - `:210` `'Deathcaller blood magic and ascension mechanics'` (category `necrotic_ascension`; canonical class = **Revenant**)
  - `:222` `'Dreadnaught damage-to-power conversion mechanics'` (category `dark_resilience_points`; canonical class = **Martyr/Ironclad**)
- **Canon says:** These four names are deprecated aliases (Master C3: Chaos Weaver/Doomsayer→Harbinger, Fate Weaver/Gambler→Gambit, Deathcaller/Lichborne→Revenant, Dreadnaught→Martyr).
- **Lore says:** The wizard shows them to the user as the *current* class names for those resource categories.
- **Notes:** Category IDs themselves (`chaos_mechanics`, `fate_mechanics`, etc.) are stable, so this is a label/lore leak rather than a dispatch break. But it is user-visible and contradicts the canonical class names a new player just picked on the previous wizard step.

### S8 — 🟠 MAJOR — Deprecated class names as LIVE state identifiers in `ClassResourceBar.jsx`
- **Location:** `components/hud/ClassResourceBar.jsx`
  - `:105` `chaosWeaverState` / `setChaosWeaverState` (Harbinger)
  - `:146-152` `hexbreakerState` + `covenbaneHexbreakerCharges` / `covenbaneAttackCounter` (Covenbane→Inquisitor)
  - `:191-196` `fateWeaverState` / `selectedFateWeaverSpec` (Gambit)
  - `:204-211` `gamblerState` / `gamblerSpec` / `gamblerHoverSection` (Gambit)
  - `:272-277` `deathcallerState` (Revenant)
  - `:278-282` `dreadnaughtState` (Martyr)
  - `:283-291` `exorcistState` (Inquisitor)
  - `:292-294` `lichborneState` (Revenant)
  - `:231-237` `phylacteryState.lichborneSpec` (Revenant)
- **Canon says:** All of Chaos Weaver/Covenbane/Fate Weaver/Gambler/Deathcaller/Dreadnaught/Exorcist/Lichborne are deprecated (Master C3/C7).
- **Lore says:** These hooks still drive menu toggles and hover sections (per the comment at `:270-271` "setters below still drive menu toggles").
- **Notes:** Code **runs** (values are read from the `classResource` prop, not these states), so this is technical-debt/labeling rather than a runtime break. But the deprecated names propagate into the rendered hover-section identifiers and into child components (`FortunePointsResourceBar.jsx` receives `setGamblerState`/`setGamblerHoverSection`; `EternalFrostPhylacteryResourceBar.jsx:30,224` exposes `setLichborneSpec`). The v3 B-12/B-13 flag is confirmed here.

### S9 — 🟠 MAJOR — `ProphecyStep.jsx` renders a "Doomsayer Prophecy" heading to the user
- **Location:** `components/spellcrafting-wizard/components/steps/ProphecyStep.jsx:424` (`<h3>Doomsayer Prophecy</h3>`)
- **Canon says:** Doomsayer → Harbinger (Master C3). The prophecy mechanic is now a generic optional step ("available for any spell, not just Doomsayer" — `spellWizardContext.js:314`).
- **Lore says:** The step still brands itself "Doomsayer" in the rendered H3.
- **Notes:** User-facing deprecated name. The surrounding wizard code (`SpellwizardApp.jsx:372`, `Step10Review.jsx:92/1128`, `spellNormalizer.js:230`, `resourceManager.js:538`, `SimplifiedMechanicsConfig.jsx:140`) carries "Doomsayer" only in *comments*, which is acceptable migration annotation; the `<h3>` is the one live UI leak.

### S10 — 🟡 MINOR — Wyrd-sphere flavor conflates Morvane with the Warden
- **Location:** `data/classResources.js:1277` — Wyrd sphere `flavor: 'The clause Morvane will not interpret.'`
- **Canon says:** The **Warden** is the grammar of consequence / interpreter of bargains (CANON_REFERENCE §1, §13). **Morvane** = the Watcher in the Mist, the life/death boundary entity — a *different* cosmic entity that "does NOT serve the Warden" (CANON_REFERENCE §1).
- **Lore says:** Implies Morvane is the clause-interpreter who refuses to interpret Wyrd.
- **Notes:** Minor echo of Master A5/A7 (entity conflation cluster). Flavorful line, but it assigns the Warden's role to Morvane.

### S11 — 🟡 MINOR — "Revel Sylvan" is an unratified Minstrel origin
- **Location:** `data/classResources.js:40,54,84,156,161` ("Revel Sylvan's groves", "Revel Sylvan's ancient songs", etc.)
- **Canon says:** Minstrel founder = **Lyris** (CANON_REFERENCE §9). "Revel Sylvan" appears nowhere in `CANON_REFERENCE` or the Master map.
- **Lore says:** Positions "Revel Sylvan" as the Minstrel's ancestral home / fae grove.
- **Notes:** "The Old Revel" / "the Revel's abandoned courtiers" appears in `languages.js:42` as fae-culture flavor, so this is internally半-canonical folklore rather than a hard contradiction — but the specific name "Revel Sylvan" is unratified and the Minstrel's canonical founder is never credited in the resource file.

### S12 — 🟡 MINOR — "Sundered Caldera" is an unratified Pyrofiend sub-feature
- **Location:** `data/classResources.js:29` (Pyrofiend tooltip), `data/lootItemsData.js:40` ("Pulled from the cooled obsidian of the Sundered Caldera")
- **Canon says:** Pyrofiend pacts flow from **Scathrach** in Emberspire's deepest vent (CANON_REFERENCE §1, §13). Emberspire is the canonical volcano; "Sundered Caldera" is not in `CANON_REFERENCE`.
- **Lore says:** Treats "Sundered Caldera" as a named Pyrofiend/Emberspire sub-feature and heat source.
- **Notes:** Plausible in-world geography, but unratified and (more importantly) the Pyrofiend resource flavor never names **Scathrach**, the canonical patron — so the actual canon source is elided in favor of a folk term. Related to Master A11 (Pyrofiend/Scathrach timing drift).

### S13 — 🟡 MINOR — `resourceTypes.js` mixes deprecated + canonical names inside single records
- **Location:** `components/spellcrafting-wizard/core/data/resourceTypes.js`
  - `:289-306` `havoc` — description "for the Doomsayer" but `classRestriction: 'harbinger'` (canonical). Same record uses BOTH schemes.
  - `:211-228` `runicPower` and `:229-247` `runes` — description "Dreadnaught abilities" AND `classRestriction: 'dreadnaught'` (both deprecated).
- **Canon says:** Doomsayer→Harbinger, Dreadnaught→Martyr.
- **Lore says:** Self-inconsistent (havoc) or fully deprecated (runicPower/runes).
- **Notes:** Compounds S4. The `havoc` record is a tidy one-line illustration of the half-finished rename: the dispatch key was updated but the prose wasn't.

---

## C. Deprecated-name BUGS vs INTENTIONAL

### 🔴 FUNCTIONAL BUGS (deprecated name breaks or silently misroutes behavior)
| ID | Site | Canonical fix |
|---|---|---|
| **S1** | `classSpellGenerator.js:780,514,781-787` — `determineChaosWeaverSpecialization` returns `chaos_dice`/`entropy_control`/`reality_bending` | Rename → `determineHarbingerSpecialization`; return `wild_prophet`/`deaths_seer`/`fate_rift` |
| **S2** | `classSpellGenerator.js:744-774` — `determineMartyrSpecialization` returns `redeemer`/`avenger`/`protector` | Return `redemption`/`zealot`/`ascetic`. Also fix `talentTreeData.js:229-231` backdrop mapping (assets still named for the old specs) |
| **S3** | `spellTemplates.js:453-544` — `adaptTemplateForClass` keyed on 24 non-canonical class names | Re-key to the 20 canonical class IDs (`chronarch` not `chronomancer`, drop `dreadnaught`/`druid`/`shaman`/etc.) |
| **S4** | `resourceTypes.js:130,148,184,202,221,240,461` — unreachable `classRestriction` values | Map to canonical classes (or remove if the resource is itself deprecated) |
| **S5** | Martyr spec list diverges (`classSpellCategories`/`classResources` = redemption/zealot/ascetic; `martyrData.js:735` adds `ironclad`) | Reconcile: either add Ironclad to the spell/resource spec arrays, or document it as a subrace-locked variant only |
| **S6** | `classResources.js:494,593` — Aldren Thalreth credited as Revenant resource inventor | Replace with Kora/Vesper (canonical Revenant founders) |
| **S7** | `Step5Resources.jsx:135,146,210,222` — user-facing descriptions say Chaos Weaver/Fate Weaver/Deathcaller/Dreadnaught | Rewrite to Harbinger/Gambit/Revenant/Martyr |
| **S8** | `ClassResourceBar.jsx:105,146-152,191-196,204-211,231-237,272-294` — deprecated state-hook names | Rename to canonical class names (cosmetic but propagates into child props) |
| **S9** | `ProphecyStep.jsx:424` `<h3>Doomsayer Prophecy</h3>` | → `<h3>Prophecy</h3>` or `<h3>Harbinger Prophecy</h3>` |

### 🟡 MINOR / LORE LEAKS (not breaks, but contradict canon flavor)
- **S10** Morvane/Warden conflation (`classResources.js:1277`) — reword to "The clause the Warden will not name" or similar.
- **S11** "Revel Sylvan" unratified (`classResources.js:40,54,84,156,161`) — ratify in framework, or rename and credit Lyris.
- **S12** "Sundered Caldera" unratified + Scathrach elided (`classResources.js:29`, `lootItemsData.js:40`) — name Scathrach as the canonical Pyrofiend patron.
- **S13** Mixed deprecated/canonical inside `resourceTypes.js` records (S4-adjacent).

### ✅ INTENTIONAL (migration comments / in-world sub-traditions — leave as-is)
These are the *correct* uses of the deprecated names — as historical annotations or explicit in-world folklore:
- **Migration comments** (consistently phrased across the codebase): `classSpellGenerator.js:15,17,42-44,511`; `classSpellCategories.js:424,538,699,703,844`; `classResources.js:488,896-898,1549,1641-1642,1982`; `classes/index.js:8`; `talentTreeData.js:33,179,281`; `talentTrees/index.js:6`; `summonableTokens.js:931`; `equipment/classEquipment.js:1981`; `CharacterPanel.jsx:884-885`; `CharacterManagement.jsx:81,89`; `CharacterManager.jsx:101,121,1742,1784`; `LevelUpChoiceModal.jsx:46-133`; `RulesPage.jsx:204-392`; `Step1CoreDraft.jsx:90,339,342`; `ClassResourceBar.css:10`.
- **In-world sub-tradition framing** (Master C3 explicitly recognizes this dual status): `martyrData.js:84-90,741-775` ("Ironclad" as a Skald/Groven cultural tradition "born from the Dreadnaught tradition"); `deepLocationData.js:1322` ("the foundry… still stamps the Dreadnaught sigil… the only surviving public acknowledgment of the original tradition"); `human.js:62` ("Ironclad Martyrs"); `LanguagesDisplay.jsx:255,269,324,444` (using Exorcist/Lichborne/Gambler as speaker-cultural descriptors). These read as deliberate worldbuilding where the deprecated class names survive as historical/colloquial terms — defensible, though `LanguagesDisplay.jsx` in particular leans on names that the rest of the UI has stopped using.
- **ProphecyStep/SimplifiedMechanicsConfig/etc. code comments** referencing "Doomsayer" as a mechanical annotation (`spellWizardContext.js:314,432`, `SpellwizardApp.jsx:372`, `Step10Review.jsx:92,1128`, `spellNormalizer.js:230`, `resourceManager.js:538`, `SimplifiedMechanicsConfig.jsx:140`) — acceptable migration annotation; only the rendered `<h3>` (S9) is a leak.

---

### Severity tally
- 🔴 CRITICAL (functional): **5** (S1, S2, S3, S4, plus S5 as half-finished merger)
- 🟠 MAJOR: **4** (S5 counted above; S6, S7, S8, S9)
- 🟡 MINOR / lore leak: **4** (S10, S11, S12, S13)

### Verdict
The spell system's *mechanics* (universalCombatSpells, spellUtils, classResources numerics) are canon-clean; the *categorization layer* is not — three independent specialization-ID schemes for Martyr/Harbinger (S1/S2/S5), a template-adapter keyed on 24 non-canonical classes (S3), and a resource-type table with unreachable restrictions (S4) together mean spell-to-class dispatch is silently broken for several classes, while the wizard and HUD still show players six different deprecated class names (S7–S9).
