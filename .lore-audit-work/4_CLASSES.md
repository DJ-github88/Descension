# CLASSES — LORE CAPTURE & AUDIT

**Scope:** All 20 canonical playable classes + 8 deprecated/merged concepts.
**Sources read:** `CANON_REFERENCE.md` (§9, §11, §10), `docs/CORE_LORE_FRAMEWORK.md` (§9.1–9.4), `docs/GM_WORLD_GUIDE.md`, `docs/LORE_CONSISTENCY_AUDIT_v3_FINDINGS.md`, `class-lore-compendium.md`, `vtt-react/src/data/classes/*` (index, classDisplayData, all 20 *Data.js), `vtt-react/src/store/classLoreStore.js`, `vtt-react/public/data/lore.json` (all 28 class/concept keys).
**Present year ≈ Year 800 of the Dimming** (used for all age math).

> **Headline:** The class layer is the most internally contradictory category audited so far. Two classes have the **wrong founder in their own `founder` field** (Shaper→Torin instead of Veyra; Animist→unnamed "First Singer" instead of Kael/Nyssa/Theron), one class's `lore.json` entry describes a **different concept entirely** (Lunarch: "silence-light between stars" with no parasite/Dead Moon), the **Augur is consistently dated ~67 years too early** across every class source (vs CANON §11 ~Year 70), and the deprecated names **Chaos Weaver / Doomsayer / Fate Weaver / Gambler** are structurally embedded as Harbinger's and Gambit's two sub-traditions while simultaneously being flagged as deprecated class aliases to remove — an unresolved design contradiction the v3 audit did not surface.

---

## A. COMPLETE LORE PICTURE (per class)

Era key: **BtD** = Before the Deepening · **Deepening** = Year 3 (Binding) / Year 11 (Breach) · **Dimming** = Year 11 → ~800.

| # | Class | Founder(s) (CANON §9) | Founding era/year (CANON §11) | Cosmic hook / alignment (CANON §9.4) | Refuses / Philosophy | Faction likelihood | Sub-archetypes |
|---|-------|----------------------|-------------------------------|--------------------------------------|----------------------|-------------------|----------------|
| 1 | **Augur** | Cassia (Skald star-watcher) | **~Year 70** (per §11) — *but every class source says Binding/Deepening, Year 3; see CL-06/07* | Aligned: Watcher (truth). Opposed: Keth-Amar (lies). Listens for Aex's scream; measures the Pulse. | That the future cannot be read | Risen / independent | Glacier-Haruspex, Star-Viscera, Bog-Gore, Mycelium-Haruspex, Keep-Prophet, Solbrand-Flame |
| 2 | **Spellguard** | Damon (Emberth blacksmith) | At the Binding (Year 3); §11 gives no year | Aligned: Sol/Seal. Opposed: Keth-Amar / Vigil extremists. Defends Aex's seal; resists Wyrd. | That Sol cannot be protected | Guard the seal, not the Vigil | Clause-Canceller, Wyrd-Defuser, Tomb-Aegis, Silent-Guard, Forge-Shield |
| 3 | **Martyr** | Sera Solvan | Year 5 (just after Binding) | Aligned: Sol/Dawn Vigil. Opposed: Keth-Amar. Absorbs suffering Keth-Amar would feed on; the Vow starves the predator. | That sacrifice is meaningless | Vigil (majority) or Scoured | Sun-Vigil, Vault-Silent, Contract-Martyr, Ironclad (=absorbed Dreadnaught) |
| 4 | **Warden** | Alaric the Law-Keeper (Groven) | **~Year 70** | Aligned: Warden (entity). Opposed: bargain-breakers. Chain-surgeons enforce bargains. | That the Warden has no name | Independent enforcers | Vat-Grounded, Span-Tether, Gear-Tension, Guild-Jailer, Glacier-Chain, Glow-Tether, Mycelium-Leash, Monolith (=absorbed Titan) |
| 5 | **Animist** | **Kael / Nyssa / Theron** (Ordan totemic / Vreken spore / Skald runic) | Early Dimming (no §11 year) | Aligned: Watcher's boundary (ancestral spirits). Opposed: erasure of the dead. | That the dead cannot speak | Independent (Convergence rotates) | Steppe-Throat, Heritage-Conduit, Spore-Inhaler, Debt-Bound, Rune-Keeper, Ledger-Summoner |
| 6 | **Berserker** | Grum Bloodhammer | First centuries of Dimming (no §11 year) | Aligned: Sol (heat as fuel). Opposed: Keth-Amar (cold hunger). **Hunger Pact** = Nordhalla cold + Sundale heat fused in one bloodline. | That the Hunger Pact is shame | Mercenary | Hunger-Pact Sworn, Caldera-Forged, Vat-Woken |
| 7 | **Pyrofiend** | The First Cabal (7 Solvarn occultists) | Just after the Breach (Year 11+) | Aligned: **Scathrach** (patron). Opposed: Keth-Amar (by Scathrach's will). Bound to Scathrach; surrendered flesh for volcanic fire. | That the vents will die | Independent contractors bound to a shared patron; no unified cult | Sun-Blasphemer, Forge-Damned, Cold-Traitor, Vat-Ignition (Morgh, patronless) |
| 8 | **Lunarch** | Selene Viridane (of House Viridane) | First centuries of Dimming (no §11 year) | Aligned: Watcher / Viridane. Opposed: Keth-Amar (memory-hunter). **Parasitic bond with lunar creatures hatched from Dead Moon fragment.** | That the moon is dead | Briaran / Watcher-protected | Thorn-Bound, Hidden Moon, Moon-Masked, Sentinel-Moon, Moon-Saved, Fog-Heresy |
| 9 | **Apex** | Sylas (Woven Mimir sentinel) | Early Dimming / "years before the Breach" (no §11 year) | Aligned: Self (survival). Opposed: Wyrd (prey). Sensory refinement to hunt Wyrd. | That the Wyrd cannot be tracked | Mercenary; often Risen-adjacent | Mask-Hunter, Sentinel-Tracker, Fog-Walker, Glacier-Stalker, Glow-Trailer, Mycelium-Scent, Steppe-Scent |
| 10 | **Harbinger** | Xyris / Malakor | **~Year 380** (mid-Dimming) | Aligned: Keth-Amar (entropy). Opposed: Vigil (denial). Weaponized entropy/prophecy. | That the future must be accepted | Drawn to cults or solitude | Entropy-Symphony, Suppressed Catastrophe, Dying-Light, Extinction-Architect (+ specs: Wild Prophet / Death's Seer / Fate Rift = blends of "Chaos Weaver" + "Doomsayer" traditions) |
| 11 | **Shaper** | **Veyra** (the Merged) | **~Year 350** | Aligned: Self (biological). Opposed: none (apolitical). Body as weapon; fused Frostwood momentum-dance (Sylvanus) + Cragjaw body-sculpting (Torin). | (Survival is form) | Mercenary | Form-Locked, Sentinel-Shifter, Dissolving, Vat-Sculpted, Span-Dancer |
| 12 | **Arcanoneer** | Valerius (Velun Neth archivist) | First centuries of Dimming (drafted the First Contract; no §11 year) | Aligned: Neth contract-law. Opposed: bargain-breakers. Contract-magic / loopholes. | (Magic is filed law) | Bryngloom loyalists | Contract-Caster, Clause-Weaver, Severed-Caster |
| 13 | **Chronarch** | Nesta (Kethrin Fexric engineer) | Mid-Dimming (~4 centuries ago ≈ Year ~400) | Aligned: Fexric engineering. Opposed: none. Time-stitching; the Pulse destabilizes time. | — | Independent | Gear-Stitcher, Bone-Calibrator, Keep-Anchor |
| 14 | **False Prophet** | Li Wei (Ordan herd-watcher) | **~Year 598** (most recent centuries) | Aligned: Keth-Amar / Wyrd. Opposed: Seal (resists truth). Manufactures meaning from the Silence. | (Belief is a harvestable resource) | Cult of Forgotten Shadow | False Star, Gagged Evangelist, Debt-Preacher, Honest Heretic, Captive Congregation |
| 15 | **Gambit** | Jax / Lyra (Merryn pirate / Kessen Neth probability-watcher) | **~Year 350** (gambitData says merger Year 310) | Aligned: Self (survival). Opposed: Determinism. Probability-weaving. | (The future is a bet) | Independent / syndicates | Sea-Omen Gambler (= "Gambler" half), Tide-Reader, Clause-Gambler (= "Fate Weaver" half), Span-Better |
| 16 | **Minstrel** | Lyris the Tide-Singer (Merryn) | First centuries of Dimming (no §11 year) | Aligned: Mereval (sea). Opposed: Storms (Wyrd manifestation). Tide-song calms the Mereval storm. | — | Independent | Storm-Singer, Shore-Conductor, Freshwater-Voice, Abyss-Resonant |
| 17 | **Plaguebringer** | Blight-Mother Vespera (Vreken) | **~Year 500** (~300 yrs ago) | Aligned: Wyrd (by nature). Opposed: Vigil (purges her). Disease-hosting; decay as continuation. | (Decay is continuation) | Independent / Scoured-adjacent | Silence-Host, Desperation-Cultivator, Glow-Culture, Mycelium-Vector |
| 18 | **Revenant** | Kora / Vesper (Vreken Veil-Speaker / Velun Neth scribe) | **~Year 550** (~250 yrs ago) | Aligned: Neth / Keeper. Opposed: Keth-Amar (consumes memory). Postmortem obligation; death does not cancel the contract. | (Death does not end the contract) | Bryngloom loyalists | Ancestor-Bound (= "Deathcaller" half), Mycelium-Dead, Contract-Expired (= "Lichborne" half), Debt-Revenant, Keep-Waked |
| 19 | **Inquisitor** | Orven / Elias (Vreken Still-Handed / Thalren Salt-Scarred) | **~Year 380** (mid-Dimming) | Aligned: Risen / Watcher. Opposed: Wyrd / Cult of Forgotten Shadow. Wyrd-hunting; polices supernatural breaches. | — | Risen-adjacent | Mycelium-Hunter (= "Covenbane" half), Glow-Auditor, Salt-Scarred, Contract-Severer (+ Exorcist "Hedge-Cleanser" legacy) |
| 20 | **Toxicologist** | Varis the Trembling (Thalren) | **~Year 380** (~420 yrs ago) | Aligned: Self. Opposed: Vigil (censorship). Chemistry as weapon; Wyrd has chemical signatures. | — | Independent / syndicates | Fog-Distiller, Floor-Brewer, Bog-Chemist, Thorn-Venom, Hidden-Cuil |

**Explicit user-request confirmations:**
- ✅ **Berserker** fuses Nordhalla cold + Sundale heat via the Hunger Pact (Bloodhammer line migrated south under Torra Bloodhammer into Emberspire; Grum ignited the Blood-Heat). Consistent in compendium, lore.json, berserkerData, GM guide.
- ✅ **Pyrofiend** patron = Scathrach the Ashen Sovereign (fragment of Aex's hide). Consistent everywhere — *except* one internal line (CL-18).
- ✅ **Lunarch** = lunar parasites from the Dead Moon (a dormant star; fragment fell in Frostwood groves). Correct in lunarchData.js + compendium. **The `lore.json` lunarch entry is the outlier (CL-17).** No "Watcher/Viridane" confusion — Selene Viridane is correctly the Briaran founder; the parasite is correctly Dead-Moon-sourced.

---

## B. CANONICAL vs DEPRECATED / ALIAS NAME MAP

**Active canonical classes = 20** (confirmed: `index.js` ALL_CLASSES_DATA has 20 keys; `classDisplayData.js` has 20 entries; `LORE_AUDIT_SUMMARY.md:14`).

**Deprecated / merged concepts with a formal `lore.json` entry (`type: "concept"`, with `transition` block) = 8:**

| Deprecated name | Canonical class | Absorbed as | Phase | lore.json key | Notes |
|-----------------|-----------------|-------------|-------|---------------|-------|
| **Bladedancer** | Shaper | Frostwood momentum-dance half | 1.8 | `bladedancer` | ✅ clean concept entry |
| **Formbender** | Shaper | Cragjaw body-sculpting half | 1.8 | `formbender` | ✅ clean concept entry |
| **Covenbane** | Inquisitor | Martial witch-hunting half (cold-iron, Barbed Vow) | 1.9 | `covenbane` | ✅ clean concept entry |
| **Exorcist** | Inquisitor | Purification/defensive half | 1.9 | `exorcist` | ✅ clean concept entry |
| **Deathcaller** | Revenant | Blood-covenant half (Kora) | 1.10 | `deathcaller` | ✅ clean concept entry |
| **Lichborne** | Revenant | Frost-stasis/phylactery half (Vesper) | 1.10 | `lichborne` | ✅ clean concept entry |
| **Dreadnaught** | Martyr | Ironclad specialization (furnace-armor) | — | `dreadnaught` | ✅ clean concept entry |
| **Titan** | Warden | Monolith specialization (bone-calcification) | — | `titan` | ✅ clean concept entry |

**Deprecated names with NO `lore.json` concept entry — but still used as ACTIVE sub-tradition identifiers inside class data (the unresolved cluster):**

| Deprecated name | Canonical class | Used in class data as… | Mapping in `classLoreStore.js` |
|-----------------|-----------------|------------------------|--------------------------------|
| **Chaos Weaver** | Harbinger | Xyris's half of Harbinger (6 uses in harbingerData) | (not in NAME_TO_ID; v3 B-11/B-12 flags it) |
| **Doomsayer** | Harbinger | Malakor's half of Harbinger (8 uses in harbingerData) | `doomsayer → harbinger` |
| **Fate Weaver** | Gambit | Lyra's half of Gambit (11 uses in gambitData) | (v3 A-10 flags `Fate Weaver → Gambit`) |
| **Gambler** | Gambit | Jax's half of Gambit (12 uses in gambitData) | (v3 B-14 flags `Gambler`) |
| **Oracle** | Augur | (absorbed as Seer spec) | comment in NAME_TO_ID: "oracle absorbed into Augur" |

→ This is the core asymmetry: **8 merged concepts are formalized** (lore.json entries + clean index.js comments), but **Chaos Weaver / Doomsayer / Fate Weaver / Gambler** are simultaneously (a) used as the *canonical names of the two sub-traditions* that compose Harbinger/Gambit, and (b) classified as *deprecated class aliases to be stripped*. They cannot be both. See CL-20 / CL-21.

**Other deprecated identifiers seen in code (outside class data, per v3 audit, for completeness):** `classEquipment.js` ('Chaos Weaver'×5, 'Lichborne'×1), `ClassResourceBar.jsx` ('Fate Weaver'), `classSpellGenerator.js` ('Chaos Weaver'), `Step1BasicInfo.jsx` ('Doomsayer'), legacy state vars (`covenbaneState`, `exorcistState`, `deathcallerState`, `dreadnaughtState`, `lichborneState`, `gamblerState`).

---

## C. INCONSISTENCY MAP

Severity: **CRITICAL** = lore is wrong / breaks identity · **MAJOR** = misleading or contradicts CANON §9/§11 · **MINOR** = polish / wording · **INFO** = re-confirmation.

### Founder attribution

| ID | Sev | Location | CANON says | LORE says | Notes |
|----|-----|----------|-----------|-----------|-------|
| **CL-01** | CRITICAL | `shaperData.js:136` (`founder.name`) | §9.3 Shaper founder = **Veyra** (the Mimir chronicler who merged the two arts) | `founder.name = Torin` (the Morgh Groven miner). shaperData's *own* origin (`:169`) says Veyra "was the first to merge Cragjaw bone-sculpting with Mimir fluid transformation" — so the file contradicts its own founder field. lore.json + compendium both = Veyra. | Torin is a *root-tradition* predecessor, not the class founder. Fix: `founder.name = Veyra`. |
| **CL-02** | CRITICAL | `animistData.js:161-167` (`founder`), `:220-222` (origin) | §9.1 Animist founders = **Kael / Nyssa / Theron** (Ordan totemic / Vreken spore / Skald runic) | animistData founder = unnamed **"First Singer"** ("Died unrecorded… The Ordan do not know who first sang…"); origin states **"There were no three founders."** Directly denies the three named founders. Current leader also diverges (animistData: Bayar Wind-Throat vs compendium: Convenor Sera Three-Scars). | lore.json animist + compendium both correctly name Kael/Nyssa/Theron. animistData is the sole outlier and inverts the founding myth. |
| CL-03 | MINOR | `class-lore-compendium.md:107`; `GM_WORLD_GUIDE.md:773`; `berserkerData.js:139` (origin) | §9.2 Berserker founder = **Grum Bloodhammer** | Origin narratives call him **"Grum the Iron-Smith"**; founder fields call him "Grum Bloodhammer." "Bloodhammer" is the clan (Torra Bloodhammer); "Iron-Smith" is his title. | Reconcile to "Grum Bloodhammer, called the Iron-Smith" everywhere. |
| CL-04 | MINOR | `class-lore-compendium.md` Apex origin vs `apexData.js:176,196` & `lore.json` apex nativeWeaving | §9.2 silent on Sylas's race | compendium = "Sylas, a wood-ranger" (race unspecified); apexData + lore.json = "**Woven Mimir** sentinel." | Standardize to Woven Mimir. |
| CL-05 | MINOR | `harbingerData.js:125,161` | §9.2 Xyris/Malakor (no race given) | harbingerData = "Xyris was a **Solvarn** student"; compendium/lore.json = "the **nomad Xyris**" of the **Sundrift Vale** (Ordavan territory). A Solvarn (Sundale) operating in Sundrift is geographically inconsistent with "nomad of the Sundrift." | Pick Xyris's origin (Solvarn-in-Sundrift or Sundrift nomad). |

### Founding year / era (vs CANON §11)

| ID | Sev | Location | CANON §11 says | LORE says | Notes |
|----|-----|----------|----------------|-----------|-------|
| **CL-06** | MAJOR | `augurData.js:168,186,240`; `class-lore-compendium.md:82`; `lore.json` augur fullEntry; `GM_WORLD_GUIDE.md:792` | Augur **~Year 70** | ALL class sources place Augur at the **Binding/Deepening (Year 3)**: "Founded in the Deepening," "When Sol first darkened," "eight centuries"/"eight hundred years." | ~67-year gap. Every class source agrees *with each other* and disagrees with §11. |
| **CL-07** | MAJOR | `augurData.js` ("eight centuries") vs `wardenData.js:160` ("seven centuries") | §11 groups **"Warden / Augur ~Year 70"** (co-founded) | Warden data says "seven centuries" (≈ Year 70 ✅); Augur data says "eight centuries" (≈ Year 3 ❌). The co-founded pair are given ages ~100 years apart. | Augur is the outlier; align Augur to "seven centuries"/Year 70. |
| **CL-08** | MAJOR | `harbingerData.js:121,149`; `GM_WORLD_GUIDE.md:1058` | Harbinger **~Year 380** (mid-Dimming) | harbingerData origin = "**first centuries of the Dimming**" for Malakor's founding arithmetic; GM guide = "first solar eclipse of Sol's Deepening." Also internally inconsistent with harbingerData's own founder (`:109` "four centuries" ≈ Year 400). | Founder status ("four centuries") is correct vs §11; the origin "first centuries" is wrong. |
| **CL-09** | MAJOR | `shaperData.js:137,165` | Shaper **~Year 350** | Torin's founding act placed in "**First Thermal War (Years 100-120)**"; "Shaping Hall established at Frostmaw Crag" immediately after ⇒ tradition ≈ Year 120. ~230-year gap. | (Compound with CL-01: Shaper's founder AND era are both off in shaperData.) |
| **CL-10** | MAJOR | `gambitData.js:113,116,181` | Gambit **~Year 350** (~450 yrs old) | "eight centuries of lost wagers," "a miracle that has not happened for eight centuries." Attributes an ~800-year wager history to a ~450-year-old class (conflation with Sol's 8-century entombment). | gambitData's explicit merger year (**Year 310**, `:177,:205`) is fine vs §11 ~350. Only the "eight centuries of wagers" phrasing is wrong. |
| **CL-11** | MAJOR | `toxicologistData.js:143,190,213,239` | Toxicologist **~Year 380** (~420 yrs) | Varis "has been old for **three hundred years**"; "Tongue-Burned for over **three centuries**." Understates by ~120 yrs. Internally inconsistent with toxicologistData's own correct "**four centuries**" claims (`:159,:201,:284,:298`). | v3 A-02 flagged npcStore/loreDictionary "eight centuries" (overstated); the class data itself *understates* as "three centuries." Both wrong; ~420 yrs is right. |
| CL-12 | MINOR (✅ fixed) | `revenantData.js:86,223` | Revenant **~Year 550** (~250 yrs) | Now reads "**two hundred years**" (was "eight hundred years" per v3 A-03). | FIXED in class data. ⚠️ v3 also cited `GM_WORLD_GUIDE.md:980` for the old quote — not re-verified here; likely still stale. |
| CL-13 | MINOR | `spellguardData.js:141` | Founded at Binding (Year 3); §11 gives no year | "Dead, **eight centuries**." Damon died ~Year 3 ⇒ ~797 yrs. Rounds to 8 but technically just under. | Same ~3-yr-overstatement pattern as Sera Solvan (v3 C-01). Acceptable/borderline. |
| CL-14 | MINOR | `berserkerData.js:207` | Berserker founded post-Glacier-Bargain/migration (Year ~50+) | "coal-seam that burned **eight centuries** ago." ~750 yrs ⇒ "seven centuries" is more accurate. | Minor overstatement. |
| CL-15 | INFO (✅ correct) | `plaguebringerData.js:141,142,147,163,212` | Plaguebringer **~Year 500** (~300 yrs) | Consistently "**three centuries**." | CORRECT. v3 A-01's "eight centuries" error lives in npcStore/loreDictionary, NOT in plaguebringerData. |
| CL-16 | INFO (✅ correct) | `wardenData.js:160,226` | Warden **~Year 70** (~730 yrs) | "**seven centuries** beyond a normal Groven lifespan." | CORRECT. v3 A-04's "eight centuries" error lives in loreDictionary/npcStore, NOT in wardenData. |

### Cosmic hook / alignment

| ID | Sev | Location | CANON says | LORE says | Notes |
|----|-----|----------|-----------|-----------|-------|
| **CL-17** | CRITICAL | `lore.json` → key `lunarch` (fullEntry, summary, relatedTerms) | §9.2 + §1 (Dead Moon): Lunarch = **parasitic bond with lunar creatures hatched from the Dead Moon fragment**; founder Selene Viridane; opposed to Keth-Amar (memory-hunter). | lore.json lunarch = "a silence-touched mage who draws power from the **absent sky**, channeling the **dark between the stars** that Sol's absence left exposed… the specific quality of space that darkness reveals." **No mention of lunar parasite, Dead Moon, moon-egg, or Viridane bloodline.** relatedTerms = only `frostwood-reach, keth_amar, the_deepening`. | STALE/WRONG entry describing a different concept (≈ False-Prophet/Harbinger "silence" territory). lunarchData.js + compendium Lunarch are both CORRECT (parasite + Dead Moon). lore.json entry must be rewritten to match. |
| **CL-18** | MAJOR | `pyrofiendData.js:202` (philosophy.relationship) | §1.6: Scathrach fragment "fell into Emberspire's deepest vent **DURING THE BINDING (not the Breach)**" | "it is not ancient — it was **born with the Breach**, and its hunger is still young." | Contradicts CANON's explicit "(not the Breach)" AND pyrofiendData's own patron block (`:116`) + origin (`:151`), both of which say "born during the Binding." Internal + canon contradiction. |
| CL-19 | MINOR | `CANON_REFERENCE.md` §9.4 table | — | The §9.4 cosmic-relationships table lists **"Warden (class)" twice** (rows 9 and 20). | Formatting error in the source-of-truth doc itself. |

### Deprecated names used as active identifiers

| ID | Sev | Location | CANON / v3 says | LORE says | Notes |
|----|-----|----------|----------------|-----------|-------|
| **CL-20** | CRITICAL | `harbingerData.js` (Chaos Weaver ×6, Doomsayer ×8; esp. `:209,347,374,401`) + `GM_WORLD_GUIDE.md:1058` | v3 B-11/B-12 + `classLoreStore.js` (`doomsayer→harbinger`): "Chaos Weaver"/"Doomsayer" are **deprecated class names to remove/replace**. | harbingerData uses them as the **canonical names of Harbinger's two constituent sub-traditions**: every specialization is "Chaos Weaver's [X] tradition + Doomsayer's [Y] specialization." No `lore.json` concept entry exists for either. | Unresolved design contradiction. Unlike the 8 formalized merges, these have no concept entry yet are structurally load-bearing. Decision needed: (a) formalize as Harbinger's two sub-traditions with concept entries + new non-deprecated names, or (b) rename throughout. |
| **CL-21** | CRITICAL | `gambitData.js` (Fate Weaver ×11, Gambler ×12) + `class-lore-compendium.md:175` | v3 A-10/B-13/B-14: "Fate Weaver"/"Gambler" are **deprecated class names** (Fate Weaver→Gambit, Gambler→Gambit). | gambitData + compendium use them as the **canonical names of Gambit's two sub-traditions** (Jax = "Gambler"/sea-omen half; Lyra = "Fate Weaver"/cartomancy half). No `lore.json` concept entry for either. | Same asymmetry as CL-20. Decision needed. |
| CL-22 | MINOR | `augurData.js` (Doomsayer ×2, Oracle ×1); `falseProphetData.js` (Oracle ×1) | Doomsayer→Harbinger, Oracle→Augur (deprecated) | Used as cross-class descriptors ("the first Doomsayer returned contradictory extinction equations"; "Oracle"). | Replace with canonical names or document as in-world epithets. |

### Merged-concept count

| ID | Sev | Location | Correct count | Stated count | Notes |
|----|-----|----------|---------------|--------------|-------|
| **CL-24** | MAJOR | `vtt-react/src/data/THEMATIC_AUDIT.md:132` (says "6", table lists 8); `loreDictionary.js:314` (per `LORE_CRITICAL_ASSESSMENT.md:73`: "20 active traditions + 6 merged concepts") | **8** merged concepts (Bladedancer, Formbender, Covenbane, Exorcist, Deathcaller, Lichborne, Dreadnaught, Titan) | "**6** merged concepts" | THEMATIC_AUDIT self-contradicts: header says 6, its own table (`:136-143`) lists 8. `LORE_DEEPENING_AND_UI_PASS_PROMPT.md:35` correctly says "8 merged classes." Index.js comments also enumerate 8. |
| CL-25 | INFO | `index.js` (ALL_CLASSES_DATA); `classDisplayData.js`; `LORE_AUDIT_SUMMARY.md:14` | 20 active classes | 20 | ✅ CONFIRMED. (The "20 active" half of the claim is right; only "6 merged" is wrong.) |

### Cross-file subrace naming (surfaces in class data)

| ID | Sev | Location | Issue | Notes |
|----|-----|----------|-------|-------|
| CL-26 | MINOR | `lunarchData.js` (Veiled/Tethered/Untethered Mimir) vs `class-lore-compendium.md` Lunarch (Masked/Woven/Unwoven) vs `lore.json` apex nativeWeaving (Maskborne/Mistwoven/Unwoven) vs `apexData.js` (Masked/Woven/Unwoven) | The same three Mimir subcastes are named **four different ways** across class files. | Root cause is likely the race file (`mimir`), but it manifests as inconsistency inside class data. Standardize one scheme. |

---

## D. SUMMARY OF DELIVERABLES

**Inconsistency counts (this audit, class category):**
- **CRITICAL: 5** — CL-01 (Shaper founder=Torin), CL-02 (Animist denies Kael/Nyssa/Theron), CL-17 (lore.json Lunarch = wrong concept), CL-20 (Harbinger sub-traditions = deprecated names), CL-21 (Gambit sub-traditions = deprecated names).
- **MAJOR: 7** — CL-06 (Augur ~Year 3 vs canon Year 70), CL-07 (Augur/Warden co-found age mismatch), CL-08 (Harbinger "first centuries" vs Year 380), CL-09 (Shaper ~Year 120 vs Year 350), CL-10 (Gambit "8 centuries of wagers"), CL-11 (Toxicologist "3 centuries" understated), CL-18 (Scathrach "born with the Breach"), CL-24 ("6 merged" should be 8).
- **MINOR: 8** — CL-03, CL-04, CL-05, CL-12 (✅ fixed), CL-13, CL-14, CL-19, CL-22, CL-26.
- **INFO (positive re-confirmations): 3** — CL-15 (Plaguebringer correct), CL-16 (Warden correct), CL-25 (20 active count correct).

**Top-priority fixes:**
1. **CL-17** — Rewrite `lore.json` `lunarch` entry (currently describes silence-light between stars; must be Dead-Moon lunar parasite + Selene Viridane). Highest-impact single fix.
2. **CL-01 / CL-02** — Correct `founder` fields in `shaperData.js` (→Veyra) and `animistData.js` (→Kael/Nyssa/Theron); these contradict CANON and their own origin text.
3. **CL-20 / CL-21** — Make a design decision on Chaos Weaver/Doomsayer/Fate Weaver/Gambler: either formalize as Harbinger/Gambit sub-traditions (with lore.json concept entries + non-deprecated names, mirroring Bladedancer/Formbender) or rename them out of the class data. The current "deprecated alias AND canonical sub-tradition name" dual status is unsustainable.
4. **CL-06 / CL-07** — Reconcile Augur founding year: either redate Augur to ~Year 70 in all class sources, or amend CANON §11 if the Binding founding is intended.
5. **CL-24** — Correct the "6 merged concepts" count to 8 in `THEMATIC_AUDIT.md` and `loreDictionary.js`.

*End of Classes audit.*
