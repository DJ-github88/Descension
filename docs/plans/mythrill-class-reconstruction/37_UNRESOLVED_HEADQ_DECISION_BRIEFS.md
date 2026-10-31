# 30-Class Restoration: Unresolved HeadQ Decision Briefs

**Date:** 2026-10-30  
**Status:** Creator-Facing Decision Briefs & Coherent Alternatives  
**Authority:** `AGENTS.md`, `01_EXECUTIVE_DECISIONS.md`, `03_HISTORICAL_CLASS_GENEALOGY.md`, `22_CREATOR_DECISION_REGISTER.md`, `30_CLASS_HEADQ_DECISION_PACKET.md`.

---

## Brief 1: Exorcist — Holy Expulsion & Sin-Eating vs. Historical Demon-Binding

### 1. Source Evidence & Approved Baseline
- **Approved Canon:** Creator Decision Register item **CD09** explicitly states: *"Exorcist versus historical demon binder. Creator wants expulsion/purification; don't automatically import old demon leash. Needed before Exorcist identity and tree design."*
- **Historical Material (`fc096627~1`):** `exorcistData.js` (68.1KB) and `exorcist.js` (13.3KB, 36 nodes) modeled demonic enslavement and multi-demon pet management (`EXORCIST_DEMONOLOGIST`, `_DEMON_LORD`, `_POSSESSED`, IDs `demo_*`, Dominance Die degradation).
- **Settled Direction:** Expulsion and purification of host victims; no demonic summoning, leashes, or dark pacts.

### 2. The Exact Unresolved Choice
How does the Exorcist's holy expulsion manifest mechanically during standard tactical tabletop play when enemies are NOT possessed mortals (e.g., encountering natural beasts, bandits, constructs, or uncorrupted humanoids)?

### 3. Coherent Alternatives & Recommendation

- **Alternative A (Pure Consecration / Anathema Striker):**
  Expulsion rites act as consecrated radiant damage against unholy/Wyrd targets, while providing defensive sanctuary wards, condition cleansing, and forced movement (repelling foes) against mundane targets.
- **Alternative B (Host Transference / Sin-Eating):** *(Recommended)*
  The Exorcist absorbs debilitating conditions and psychic trauma from allies into their own consecrated vessel (`Purification Sanctity`), transmuting the absorbed "sin" into radiant shockwaves or discharging it into lead-lined reliquaries. Against all enemy types, the Exorcist disrupts concentration, seals spellcasting, and purges buffs.
  *Rationale:* Firmly distinguishes Exorcist from Crusader (vanguard attacker) and Spellguard (arcane shielder) by emphasizing the terrifying self-sacrificial burden of sin-eating without relying on demon-binding pets.
- **Alternative C (Vessel Possession Risk / Dangerous Borrowed Power):**
  The Exorcist temporarily traps purged entities within their own body, gaining risky volatile power at the expense of escalating madness.
  *Rejection:* Violates CD09 and blurs identity with False Prophet.

### 4. Affected Records, Trees, Resource Rules, Lore, and UI
- **Records Affected:** All 48 actions and 48 passives. Replaces `demo_*` records with `exo_*` expulsion and sin-eating rites.
- **Trees:** Replaces `DEMONOLOGIST` / `DEMON_LORD` / `POSSESSED` with `EXORCIST_LITURGIST`, `EXORCIST_SINEATER`, and `EXORCIST_INQUISITORIAL_PURGER`.
- **Resource:** Purification Sanctity (0–10).
- **UI:** Circular silver salt ring HUD.

### 5. Historical ID Safety
The historical `demo_*` IDs cannot be safely retained for mechanics because their names and schemas explicitly refer to demon binding (e.g., `demo_t1_legion_mind`, `demo_t1_steady_rein`). They are retired to compatibility archives. New stable IDs (`exo_*`) are authored for all records.

---

## Brief 2: Covenbane — Division of Anti-Magic Work from Legacy Inquisitor

### 1. Source Evidence & Approved Baseline
- **Approved Canon:** Creator Decision Register item **CD10** states: *"Inquisitor/Covenbane/Exorcist independent viability. Evaluate all three through authority/field countermeasure/expulsion economies. Final occult roster."*
- **Settled Roster Decision:** Covenbane returns as an independent class. Inquisitor is retired from new character creation, but existing Inquisitor characters remain loadable without conversion.
- **Historical Material (`fc096627~1`):** `covenbaneData.js` (111.9KB, 32 spells, Hexbreaker Charges 0–6) was consolidated into Inquisitor in earlier commits, sharing spells with `inquisitorData.js`.

### 2. The Exact Unresolved Choice
Where is the precise operational boundary drawn between Covenbane's anti-magic tools and retired Inquisitor assets, ensuring legacy Inquisitors do not lose spells while Covenbane reclaims its autonomous identity?

### 3. Coherent Alternatives & Recommendation

- **Alternative A (Clean Fork with Independent Prefixes):** *(Recommended)*
  Covenbane receives its full historical suite under native `cov_*` and `cr1_covenbane_*` IDs. Legacy Inquisitor retains its existing `inq_*` records in `inquisitorData.js`. Any historically shared ability is cleanly separated by class prefix.
  *Rationale:* Guarantees zero data loss or save corruption for legacy Inquisitor characters, while allowing Covenbane's bog-iron and null-salt economy to evolve independently.
- **Alternative B (Shared Record Namespace):**
  Both classes reference a shared pool of anti-magic spells in `classSpellGenerator.js`.
  *Rejection:* Violates class independence principles; breaks when Covenbane spells receive balance adjustments.
- **Alternative C (Automatic Migration of Inquisitor Spells to Covenbane):**
  *Rejection:* Strictly prohibited by Settled HeadQ instructions (*"Do not automatically convert Inquisitor characters"*).

### 4. Affected Records, Trees, Resource Rules, Lore, and UI
- **Records Affected:** 32 historical spells mapped to `cov_*`, plus 8 newly authored options to complete levels 1–10 pools (40 total optional picks).
- **Trees:** `COVENBANE_SHADOWBANE`, `COVENBANE_SPELLBREAKER`, `COVENBANE_DEMONHUNTER` expanded to 50 points each.
- **Resource:** Hexbreaker Charges (0–6).
- **UI:** Barbed cold-iron nail head SVG HUD.

### 5. Historical ID Safety
Historical `cov_*` IDs are fully safe to retain and reuse. They do not collide with `inq_*` IDs.

---

## Brief 3: Dreadnaught — Independent Tree Identity & Demarcation from Martyr/Ironclad

### 1. Source Evidence & Approved Baseline
- **Approved Canon:** Creator Decision Register item **CD11** states: *"Dreadnaught and fourth Martyr tree. Test independent equipment/brace fantasy; preserve Ironclad compatibility. Needed before any tree transfer."*
- **Settled Roster Decision:** Martyr remains independent and retains `MARTYR_IRONCLAD` (`vtt-react/src/data/talentTrees/martyrIronclad.js`, IDs `icl_t1_*`–`icl_t7_*`). Dreadnaught must NOT steal or reassign Martyr records.

### 2. The Exact Unresolved Choice
How does Dreadnaught establish a distinct mechanical and visual identity as a heavy armored titan without infringing on Martyr's Ironclad tree?

### 3. Coherent Alternatives & Recommendation

- **Alternative A (Mechanical Boiler-Plate & Steam Pressure):** *(Recommended)*
  Dreadnaught is defined by Groven engineering, heavy hydraulic servos, boiler combustion, and steam venting (`Furnace Pressure 0–100 PSI`). Martyr's Ironclad is defined by religious voluntary immurement, self-wounding, and solar faith (`Devotion 1–6`). Dreadnaught uses `dread_*` IDs, hydraulic ground-cleats, and concussive trample damage.
  *Rationale:* Perfectly honors CD11 and Settled HeadQ decisions. Eliminates all overlap: Martyr is religious/sacrificial; Dreadnaught is industrial/kinetic.
- **Alternative B (Dark Obsidian Shadow-Citadel):**
  Dreadnaught returns to its pre-consolidation `DREADNAUGHT_SHADOW_CITADEL` design using shadow-shields and necrotic reflection.
  *Rejection:* Clashes with Groven lore and blurs identity with Deathcaller.

### 4. Affected Records, Trees, Resource Rules, Lore, and UI
- **Records Affected:** 31 historical spells mapped to `dread_*`, filled to 40 options across levels 1–10.
- **Trees:** `DREADNAUGHT_SIEGE_BASTION`, `DREADNAUGHT_FURNACE_ENGINE`, `DREADNAUGHT_JUGGERNAUT_MOMENTUM` (54 nodes, 50 pts each).
- **Resource:** Furnace Pressure (0–100 PSI).
- **UI:** Boiler pressure dial SVG HUD with overheat warning.

### 5. Historical ID Safety
`dread_*` IDs are safe to retain. Martyr's `icl_*` IDs remain 100% untouched.

---

## Brief 4: Bladedancer — Martial Identity & Boundaries from Monk, Rogue, and Hunter

### 1. Source Evidence & Approved Baseline
- **Approved Canon:** Creator Decision Register item **CD12** states: *"Monk and Bladedancer separation: Investigate discipline/footwork versus weapon-sequence rhythm, no anatomy reuse. Needed before their final dossiers."*
- **Settled Roster Decision:** Bladedancer returns as an independent class; Titan, Formbender, and Huntress do not return; Hunter remains independent.

### 2. The Exact Unresolved Choice
What core mechanical hook defines Bladedancer's combat loop to ensure it does not feel like an unarmored Monk, an ambush Rogue/Apex, or a wild Berserker?

### 3. Coherent Alternatives & Recommendation

- **Alternative A (Kinetic Momentum & Musical Tempo Tiers):** *(Recommended)*
  Bladedancer uses twin light curved blades in continuous motion. Moving ≥15 ft, hitting with melee strikes, or parrying incoming attacks builds **Kinetic Momentum (0–10)** across 4 tempo tiers (*Adagio, Andante, Allegro, Presto*). At high tempo, the Bladedancer gains free offhand attacks, dodge reactions, and flurry finishers, but momentum rapidly decays if motion stops.
  *Rationale:* Grounded in Frostwood Skaldic sword-troubadour lore. Distinct from Monk (internal spiritual ki/unarmed discipline), Hunter (stealth, tracking, traps), and Berserker (taking hits to build Rage).
- **Alternative B (Stance-Switching Combat Styles):**
  Bladedancer rotates through 3 static stances (Flow, Duelist, Shadow).
  *Rejection:* Stance switching historically collided with Shaper/Formbender body slots and lacks the continuous motion fantasy.

### 4. Affected Records, Trees, Resource Rules, Lore, and UI
- **Records Affected:** 16 historical spells preserved under `bladedancer_*`; 24 newly authored spells added to fill levels 1–10 pools (40 total).
- **Trees:** `BLADEDANCER_FLOW_MASTER`, `BLADEDANCER_DUELIST`, `BLADEDANCER_SHADOW_DANCER` (54 nodes, 50 pts each).
- **Resource:** Kinetic Momentum (0–10; 4 Tiers).
- **UI:** Dual-arc kinetic momentum compass SVG HUD.

### 5. Historical ID Safety
Historical `bladedancer_*` IDs are safe and preserved.

---

## Brief 5: Witch Doctor — Final In-World Terminology & Cultural Treatment

### 1. Source Evidence & Approved Baseline
- **Approved Canon:** HeadQ directive explicitly mandates: *"For Witch Doctor, inspect and reconcile historical terminology with Mythrill’s own cultures. Do not copy real-world sacred titles into player-facing lore without explicit approval. Preserve useful historical mechanics and IDs where safe, but clearly flag terminology or lore that needs replacement."*
- **Historical Material (`fc096627~1`):** `witchDoctorData.js` and `witchdoctor.js` used Haitian Vodou sacred terms (Bokor, Mambo, Houngan, Loa, Voodoo Essence).

### 2. The Exact Unresolved Choice
Which specific in-world cultural terms replace the historical Haitian Vodou terms across class data, talent tree files, ability names, and UI?

### 3. Coherent Alternatives & Recommendation

- **Alternative A (Authentic Mythrill Marsh-Folk Tradition):** *(Recommended)*
  - *Bokor* -> **Hexweaver / Effigy Crafter** (Sympathetic poppets, damage reflection, needle curses).
  - *Mambo* -> **Bog Apothecary / Marrow Healer** (Peat poultices, antivenoms, vital transference).
  - *Houngan* -> **Miasma Priest / Bane Shaman** (Caustic swamp smoke, mask rites, toxic field denial).
  - *Voodoo Essence* -> **Bog Tallow / Fetish Wax (0–100)** (The physical peat-wax used to mold effigies).
  - *Loa* -> **Marsh Vaettir / Land Spirits** (Directly aligns with `CORE_LORE_FRAMEWORK.md §1.1`).
  *Rationale:* Completely eliminates cultural appropriation of living Afro-Caribbean religions while preserving 100% of the sympathetic effigy, curse, and herbal gameplay. Grounded directly in Bryngloom and Sundale marsh folklore.
- **Alternative B (Necromantic Cultist Nomenclature):**
  Rename terms to Bone Priest, Blood Binder, Grave Shaman.
  *Rejection:* Clashes with Deathcaller and Animist; loses the apothecary/herbalist flavor.

### 4. Affected Records, Trees, Resource Rules, Lore, and UI
- **Records Affected:** 34 historical spells preserved under `witch_doctor_*` with sanitized display names; 6 newly authored spells added to complete levels 1–10 pools (40 total).
- **Trees:** `WITCH_DOCTOR_HEXWEAVER`, `WITCH_DOCTOR_APOTHECARY`, `WITCH_DOCTOR_MIASMA` (54 nodes, 50 pts each).
- **Resource:** Bog Tallow (0–100).
- **UI:** Clay crucible with peat tallow SVG HUD.

### 5. Historical ID Safety
The code IDs (`witch_doctor_*`) can be safely retained as internal technical identifiers, while player-facing display names, tree titles, and descriptions are updated to the approved in-world nomenclature.

---

## Brief 6: Totemist — Independent Identity & Exact Pylon Placement Rules

### 1. Source Evidence & Approved Baseline
- **Approved Canon:** HeadQ Settled Decision: *"Animist stays its own class. Totemist is a second, separate class. Do not rename, merge, replace, or remake Animist as Totemist. Preserve all Animist records, IDs, assets, lore, and compatibility. Totemist is a new creator-approved direction, not a recovered historical class. Author a distinct proposal using the latest approved lore material. Never present newly authored Totemist content as historical or already approved."*
- **Historical Material:** Zero (0) historical records exist in the repository history.

### 2. The Exact Unresolved Choice
What are the exact tabletop placement, durability, and action-economy rules for deploying physical totem pylons onto tactical battle maps?

### 3. Coherent Alternatives & Recommendation

- **Alternative A (Physical Ground-Anchored Pylons with Grid Durability):** *(Recommended)*
  The Totemist deploys up to 3 physical pylon tokens onto specific grid tiles (costs 1 AP + 1 Pylon Slot). Each pylon has Durability = 3 × Level + Attunement, emits a 15-ft aura, and can be targeted or destroyed by enemies. Linked pylons form conductive vectors.
  *Rationale:* Provides distinct territorial zoning gameplay that feels like tactical architecture. Completely demarcates Totemist from Animist (who has 0 physical tokens and focuses on ancestral spirit communion).
- **Alternative B (Aura-Only Virtual Totems):**
  Totems exist as abstract party buffs without physical tokens or durability.
  *Rejection:* Fails the physical pylon fantasy and feels like generic paladin auras.

### 4. Affected Records, Trees, Resource Rules, Lore, and UI
- **Records Affected:** 2 Core Grants (`totemist_place_conduit`, `totemist_reclaim_conduit`), 40 Optional Picks (levels 1–10), 6 Talent Actives, 48 Passives (96 unique newly authored records).
- **Trees:** `TOTEMIST_HEARTHKEEPER`, `TOTEMIST_EARTHSHAPER`, `TOTEMIST_SKYBINDER` (54 nodes, 50 pts each).
- **Resource:** Conduit Attunement (0–10) & 3 Pylon Slots.
- **UI:** Triangular lithic pedestal with 3 glowing pylon sockets SVG HUD.

### 5. Historical ID Safety
No historical IDs exist. All IDs use the fresh prefix `totemist_*` or `cr1_totemist_*`, guaranteeing zero collision with Animist or any other class.

---

## Brief 7: Inscriptor — Surface Anchoring vs. Portable Tablets & Runic Lexicon Integration

### 1. Source Evidence & Approved Baseline
- **Approved Canon:** `CORE_LORE_FRAMEWORK.md §1.2` establishes the Grand Nomenclature of the Athien and the First Ledger of the Thalreth as the foundational scriptural magic of the setting.
- **Historical Material (`fc096627~1`):** `inscriptorData.js` (93.0KB) and `inscriptor.js` (13.4KB, 38 nodes) described the Inscriptor as a stationary controller who *"treats the battlefield as a blank canvas and blood as ink"*, carving runes into stone, steel, and flesh. Moving broke their painful connection to the earth and triggered backlash.
- **Historical Resource:** Runic Resonance (0–10).

### 2. The Exact Unresolved Choice
Does the Inscriptor remain a strictly stationary battlefield terraformer whose runes must be physically carved into fixed map terrain (risking complete obsolescence during dynamic/mobile encounters), or do they utilize portable slate tablets and gear inscriptions, and how does their runic lexicon connect to the Grand Nomenclature?

### 3. Coherent Alternatives & Recommendation

- **Alternative A (Hybrid: Stationary Grid Runes + Portable Slates):** *(Recommended)*
  The Inscriptor's primary power lies in anchoring stationary geometric rune networks into the tactical grid (carved into terrain or walls with `ins_carve_rune` for lasting territorial dominance). To remain viable in mobile encounters, they also carry portable engraved slate tablets (`ins_slate_anchor`) that provide temporary portable wards and reaction shields.
  *Rationale:* Preserves 100% of the agonizing, spatial-mastery fantasy of the historical Inscriptor while solving the fatal flaw of being dead-weight whenever combat moves across multiple rooms or outdoor terrain.
- **Alternative B (Strict Stationary Terraformer with Backlash):**
  Full fidelity to historical `fc096627~1`: Inscriptor is completely stationary; movement speed is reduced to 0 while maintaining active runes; moving destroys all runes and deals backlash damage to the caster.
  *Rejection:* Severely punishing on modern tabletop battle maps; creates unplayable friction in standard party movement.
- **Alternative C (Gear & Parchment Enchanter Only):**
  Runes are cast only onto weapons, armor, and parchment scrolls, abandoning physical grid placement.
  *Rejection:* Blurs identity with Arcanoneer/Enchanter and eliminates the unique territorial control hook.

### 4. Affected Records, Trees, Resource Rules, Lore, and UI
- **Records Affected:** 37 historical spells mapped to `ins_*` prefix; tree nodes modernized to standard 50-point structure.
- **Trees:** `INSCRIPTOR_RUNEBINDER` (Terrain & Grid Runes), `INSCRIPTOR_ENCHANTER` (Portable Slates & Gear), `INSCRIPTOR_GLYPHWEAVER` (Floating Lexicon Matrices).
- **Resource:** Runic Resonance (0–10 active nodes).
- **UI:** Carved slate tablet with 10 illuminated lapis node sockets SVG HUD.

### 5. Historical ID Safety
Historical `inscriptor_*` and `ins_*` IDs are preserved and safe. They do not collide with any active class.
