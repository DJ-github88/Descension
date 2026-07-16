# TALENT TREES & PATHS — AUDIT

**Domain:** Talent trees, paths, disciplines
**Scope audited (all read or grep-swept):**
- `vtt-react/src/data/talentTrees/*.js` — all 23 files: 20 class trees + `index.js` + `transform_descriptions.js` + `debug_script.js`
- `vtt-react/src/data/talentTreeData.js`
- `vtt-react/src/data/pathData.js`
- `vtt-react/src/data/legacyDisciplineData.js`

**Canon benchmark:** `CANON_REFERENCE.md` §1–§13 + `0_MASTER_LORE_MAP_AND_AUDIT.md` Part 2 (items C3/C7/A5/A8/A15).
**Method:** full-read of harbinger, gambit, shaper, inquisitor, martyr, transform_descriptions, index, talentTreeData, pathData, legacyDiscipline; targeted grep-sweep of the remaining 13 trees for founder names, cosmic entities (Keth-Amar/Aex/Sol/Morvane/Watcher/Warden/Aethil/Scathrach/Root-Veil/Solbrand/Dead Moon), era labels, deprecated class names, and the boilerplate-prefix strings.

---

## A. Coverage

| Class | Tree file | Status |
|---|---|---|
| Augur | augur.js | present (3 trees); clean (no cosmic misattribution) |
| Spellguard | spellguard.js | present (3 trees); minor ID-namespace note (TT-12) |
| Martyr | martyr.js | present (3 trees) | **🔴 TT-2** (founder=region "Sundale"; patron=unratified "Solbrand") |
| Warden | warden.js | present (3 trees); clean |
| Animist | animist.js | present (3 trees) | **🔴 TT-1** (real-world Vodou loa invoked) |
| Berserker | berserker.js | present (3 trees); clean (Nordhalla ref correct) |
| Pyrofiend | pyrofiend.js | present (3 trees); clean (no Scathrach timing error here — that bug A11 is in `pyrofiendData.js`, outside this domain) |
| Lunarch | lunarch.js | present (3 trees); clean |
| Apex | apex.js | present (3 trees); clean |
| Harbinger | harbinger.js | present (3 trees) | **🟠 TT-4** (Keth-Amar framed as patron-deity) |
| Shaper | shaper.js | present (3 trees) | **🟠 TT-7** (Groven bridge-craft misattributed) |
| Arcanoneer | arcanoneer.js | present (3 trees); clean |
| Chronarch | chronarch.js | present (3 trees); clean |
| False Prophet | falseprophet.js | present (3 trees); clean (exports SILENCE_SPEAKER/DECEIVER/CULTIST) |
| Gambit | gambit.js | present (3 trees) | **🟡 TT-9** (repetitive "Iceheart Sea" boilerplate) |
| Minstrel | minstrel.js | present (3 trees) | **🟠 TT-3** (hook misattributed to non-canon "Revel Sylvan") |
| Plaguebringer | plaguebringer.js | present (3 trees); clean |
| Revenant | revenant.js | present (3 trees); clean (merges documented in talentTreeData) |
| Inquisitor | inquisitor.js | present (3 trees) | **🟠 TT-5** (deprecated "Covenbane" ×7) |
| Toxicologist | toxicologist.js | present (3 trees); clean |

**Merged-class count — CONFIRMED correct in this domain.** `talentTreeData.js` documents all canonical merges (Dreadnaught→Martyr, Titan→Warden, Bladedancer+Formbender→Shaper, Covenbane+Exorcist→Inquisitor, Deathcaller+Lichborne→Revenant) and its `TALENT_TREES` object contains exactly the **20 canonical active classes**. It AGREES with canon's "8 deprecated names → 5 surviving merged classes." The C7 "6 vs 8" miscount flagged in the master report lives in `THEMATIC_AUDIT.md` / `loreDictionary.js` — **not in this domain.** `legacyDisciplineData.js` is a *different* axis (the cut character-creation disciplines), so it neither agrees nor disagrees with the 8-merged count (its own nit: TT-11). **The one domain file that disagrees is the orphaned `index.js`** (TT-6 — implies ~23 classes via 3 phantom classes).

**No non-canonical era labels** ("Age of …") were found in any talent tree. "The Deepening" is not misused as an era prefix here.

---

## B. INCONSISTENCY MAP

Severity: 🔴 CRITICAL · 🟠 MAJOR · 🟡 MINOR

### TT-1 🔴 — Animist talent tree invokes real-world Vodou loa by name
- **Location:** `animist.js:128, 137-138, 201, 211`
- **Canon says:** Animist founders = Kael/Nyssa/Theron; the class channels **ancestral spirits via the Watcher's boundary** (CANON §9, §13). Spirit pacts are Mythrill-native (Bryngloom death-boundary).
- **Lore says:** Talents invoke **"Baron Samedi"** (×2), **"Simbi and Erzulie"**, and a capstone literally named **"The Triune Devourer"** — these are Haitian Vodou loa / real-world religion, not Mythrill entities. (The same names are seeded in `transform_descriptions.js` flavor pools — TT-8.)
- **Notes:** Direct A15-style IP/real-world-religion leakage *live in shipped data*, not just a script. Inverts the Animist's canon identity (Mythrill ancestor-Watcher spirits → Caribbean loa). Should be renamed to Mythrill-native spirit names.

### TT-2 🔴 — Martyr tree's "founder" is a region; patron is an unratified alias
- **Location:** `martyr.js` throughout (31× "Sundale", 38× "Solbrand"); e.g. `:10,21,30,39,50,59,70,…`; one correct "Sol's Judgment" at `:132`.
- **Canon says:** Martyr founder = **Sera Solvan** (CANON §9; "takes suffering Keth-Amar would feed on"). The Sol-aligned faith is the **Embers of Sol**; the bound star is **Sol** (CANON §1, §7).
- **Lore says:** The founder figure is called **"Sundale"** — Sundale is the **region/capital of House Solvan**, not a person. The radiant patron is **"Solbrand"** (38×) — an **unratified alias** that is part of the A5 entity-conflation cluster (Solbrand↔Root-Veil↔Morvane). The file even self-contradicts by using the correct "Sol's Judgment" once.
- **Notes:** A region name being used as a person/founder throughout a player-facing tree is the clearest "wrong founder" in this domain. "Solbrand" propagates the master-report A5 conflation into a third class tree (already in `vreken.js`, `neth.js`). Founder should be **Sera Solvan**; patron should be **Sol** / **Embers of Sol**.

### TT-3 🟠 — Minstrel tree's cosmic/regional hook is misattributed to a non-canonical forest
- **Location:** `minstrel.js` throughout — 18× **"Revel Sylvan"** (e.g. `:46,66,75,124,153,164,202,231,242,309,329,340,378,418,438,476,487,507`); **zero** references to Mereval / Iceheart Sea / tide / Lyris.
- **Canon says:** Minstrel = **Lyris, tide-song that calms the Mereval storm** (CANON §9) — a **sea/Iceheart** thematic.
- **Lore says:** The Minstrel is themed entirely around **"Revel Sylvan," a forest/sylvan setting that does not exist** in the canonical 7-region list. The canon tide/sea/Mereval hook is entirely absent.
- **Notes:** "Revel Sylvan" also collides with House **Solvan** (Sundale) — possible conflation. Either ratify "Revel Sylvan" as a zone and keep it, or restore the canon Mereval/sea theme and rename to the Lyris/tide-song framing.

### TT-4 🟠 — Harbinger tree frames Keth-Amar as a cooperative patron-deity
- **Location:** `harbinger.js` — Keth-Amar named 19× as a grantor, e.g. `:130` "Keth-Amar **grants dominion**," `:439` "**rewards those who gamble**," `:450` "**elevates its prophets to godhood**," `:471` "**ascends through you, a deity of chaos made manifest**," `:301` "**incarnates through you as the final prophet of death**."
- **Canon says:** Keth-Amar is an **adversarial cosmic predator**; its Wyrd is "agriculture" it *sows and waits* — it does **not** bestow boons on mortal champions (CANON §1, §2). Harbinger founders **Xyris/Malakor** are listed under "**Weaponize the crisis**" (CANON §9) — i.e., they seize/redirect Keth-Amar's entropy as a weapon, they are not its prophets.
- **Lore says:** Keth-Amar is written as a willing patron who empowers, rewards, and deifies a playable hero — which reads as a Keth-Amar **cult class** (canonically that role belongs to the Wyrd-priests / Cult of Forgotten Shadow, an antagonist faction).
- **Notes:** Grayest call in this audit. *Channeling* Keth-Amar's entropy is canon-plausible; the problem is the **"patron grants boons to chosen prophets"** framing, which inverts both Keth-Amar's nature and the Harbinger's "weaponize-against" category. Recommend re-framing as *seized/turned* power at a price rather than granted dominion.

### TT-5 🟠 — Inquisitor tree uses the deprecated pre-merge name "Covenbane" as a live class reference
- **Location:** `inquisitor.js:28, 46, 55, 121, 148, 178, 223` — identical boilerplate **"The Covenbane purges with fire that remembers Sol."** prepended to 7 talent descriptions across **all three** specs (Witch Hammer, Iron Verdict, Hollow Saint).
- **Canon says:** Canonical merged class = **Inquisitor** (Covenbane + Exorcist → Inquisitor).
- **Lore says:** Refers to the class by its deprecated pre-merge name as the grammatical subject of the sentence (a functional class reference, not a talent title).
- **Notes:** See §C — adjudicated **BUG**. (Also note the boilerplate is machine-injected identical filler across all 3 specs, confirming it's not an intentional sub-tradition naming one fused tradition.)

### TT-6 🟠 — Orphaned `index.js` barrel references 3 non-canonical phantom classes + 6 non-existent exports
- **Location:** `index.js:40-50` (phantom Gambit exports), `:91-95` (`./inscriptor.js` — does not exist), `:104-107` (`./witchdoctor.js` — does not exist), `:121-125` (`./primalist.js` — does not exist).
- **Canon says:** Exactly **20** canonical classes (CANON §9). Inscriber, Witch Doctor, Primalist are **not** among them (they overlap canonically with Arcanoneer / Plaguebringer / Animist).
- **Lore says:** The barrel imports `INSCRIPTOR_*`, `WITCH_DOCTOR_*`, `PRIMALIST_*` from three files that don't exist, and exports 6 Gambit names (`FORTUNE_TELLER/CARD_MASTER/THREAD_WEAVER/LUCK_MANIPULATION/RISK_MANAGEMENT/FATE_CONTROL`) that `gambit.js` does **not** export (actual: `PROBABILITY_SAVANT/HIGH_ROLLER/KARMIC_WEAVER`).
- **Notes:** The barrel is **orphaned** — grep confirms nothing imports `from '…/talentTrees'` (all consumers import specific files via `talentTreeData.js`), so it doesn't crash the app. But it is broken/dead code that implies ~23 classes and 6 phantom Gambit specs, contradicting the canonical 20. Recommend deleting `index.js`.

### TT-7 🟠 — Shaper tree misattributes the Groven race's bridge-craft
- **Location:** `shaper.js:37, 166, 175, 184, 241, 259` — identical prefix **"Groven ancestor-bridges calcify into something stronger."** on 6 talents across Flow Master / Iron Dancer / Primal Shadow.
- **Canon says:** Shaper = **Veyra**; merges Bladedancer + Formbender (a form/blade-dance martial art). **Groven** are a **race** (Fexric-bred bridge-builders, CANON §8) — their ancestor-bridge craft is a racial trait, not the Shaper's tradition.
- **Lore says:** The Shaper tree is flavored with Groven bridge imagery as if it were the class's core lore.
- **Notes:** Stale machine-injected flavor prefix (same sentence ×6). Race craft misattributed to an unrelated class. Shaper's real hook (Veyra's form-fusion) is absent from the tree entirely.

### TT-8 🟡 — `transform_descriptions.js` is a flavor-injection migration script that injects real-world loa + has a dead pattern
- **Location:** `transform_descriptions.js:24-31, 40-41` (Vodou loa in Animist pools: "Baron Samedi collects what is owed," "Simbi and Erzulie answer the call of blood and ink," "The Triune Devourer"); `:924` stale pattern `/FALSE_PROPHET_VOIDCALLER/` that can never match (actual export is `FALSE_PROPHET_SILENCE_SPEAKER`; no VOIDCALLER pool exists).
- **Canon says:** No real-world mythology (A15). Spec names must match exports.
- **Lore says:** The script's flavor pools contain Haitian-Vodou loa (the source of TT-1's live pollution) and one pattern references a spec that doesn't exist.
- **Notes:** This is debug/migration tooling left in the data directory (cf. `debug_script.js` in the same folder). It is the architectural cause of the boilerplate-prefix pollution behind TT-5 / TT-7 / TT-9. Recommend removing the script (its job — bulk flavor injection — is long since done, and it re-introduces A15 violations if ever re-run).

### TT-9 🟡 — Gambit tree repetitive "Iceheart Sea" boilerplate (×11)
- **Location:** `gambit.js` — 11× identical prefix **"The Iceheart Sea teaches that every wave is a wager."** (`:15,45,78,98,118,138,151,159,181,191,201`).
- **Canon says:** Gambit = Jax/Lyra, probability-weaving (~Y350; Brine-Bond Syndicate ~Y300 gives plausible sea cover).
- **Lore says:** No founder (Jax/Lyra) or Brine-Bond hook present; instead a sea theme via repetitive filler.
- **Notes:** **Not a contradiction** (sea/gambling thematically fits, and Brine-Bond Syndicate permits it) — the problem is purely the 11× identical boilerplate prefix (noise/stale filler). Lower severity than TT-5/TT-7 because Iceheart Sea isn't a deprecated name or a misattributed craft.

### TT-10 🟡 — Martyr tree uses the unratified term "upper dark"
- **Location:** `martyr.js:204` ("Call down wrath of the upper dark"); +3 more instances seeded in `transform_descriptions.js` ZEALOT/ASCETIC pools (`:506,511,529`).
- **Canon says:** No "upper dark" concept exists (canon terms: Deepening, Dimming, Age of the Dimming, the Void, the Silence, the Wyrd).
- **Lore says:** "upper dark" used as a sacred/celestial source.
- **Notes:** Unratified term; minor. Likely meant to evoke the celestial/heavenly but isn't canonical vocabulary.

### TT-11 🟡 — `legacyDisciplineData.js` header counts 9 disciplines, body defines 8
- **Location:** `legacyDisciplineData.js:4-6` (header comment lists "mystic, zealot, trickster, harrow, arcanist, hexer, reaver, mercenary, sentinel" = 9) vs `:20-62` (object defines **8**; **zealot is missing**).
- **Canon says:** N/A — this is the **cut** character-creation discipline axis (mystic/trickster/…), explicitly superseded by `backgroundData.js`. It is unrelated to the canonical 20 classes / 8 merged.
- **Lore says:** Self-inconsistent (9 advertised, 8 delivered; zealot absent).
- **Notes:** Confirms this file does **not** touch the merged-class question. Purely a header/body count drift in a backward-compat shim. No lore contradiction with canon.

### TT-12 🟡 — Spellguard talent IDs/names collide with the Warden class namespace
- **Location:** `spellguard.js` — Arcane Warden spec uses ID prefix `warden_t0_…` (`:8,19,28,…`) and talent names **"Warden's Hand"** (`:118`), **"Warden's Fortitude"** (`:29`), **"Warden's Sacrifice"** (`:107`).
- **Canon says:** "Warden" is a canonical class (Alaric) AND the cosmic entity's name.
- **Lore says:** Generic English "warden" (protector) used as talent names for the Spellguard's Arcane Warden spec.
- **Notes:** Primarily a **code/ID-namespacing** concern (potential collision with `warden.js` IDs), not a true lore contradiction. Flagged for completeness; lowest priority.

### TT-13 🟡 — `pathData.js` inherits the Solbrand conflation + uses unratified group names
- **Location:** `pathData.js:48` ('bound' path: sworn "to the **Solbrand**"); `:244` ("**Silath**"); `:187` ("**Morgh** warriors," "**Skald** of Nordhalla"); `:215` ("**Ancestor-Span** toll-keepers").
- **Canon says:** Solbrand is an unratified alias (A5); Morvane = the Watcher (CANON §1). "Silath," "Morgh," "Ancestor-Span" are not in the canon reference.
- **Lore says:** Mostly good regional/faction flavor (Briaran/Astril/Neth/Groven/Vat-Breakers all used correctly), but inherits the Solbrand entity-conflation and invents several group names.
- **Notes:** Largely **consistent** with canon regions/houses/races otherwise. The only genuine inherited issue is "Solbrand" (A5/A8); the unratified group names may be intentional in-world flavor to ratify separately. Treat as polish.

---

## C. Sub-tradition-name adjudication (intentional vs bug, per occurrence)

**Scope note (important):** The master-report CL-20/CL-21 "unresolved" cluster — **Chaos Weaver / Doomsayer** (Harbinger) and **Fate Weaver / Gambler** (Gambit) — lives in the class-**DATA** files (`harbingerData.js`, `gambitData.js`), which are **outside this domain**. Within the talent-**TREE** files, those four names are almost entirely absent. The only deprecated-name occurrences in *this* domain are adjudicated below.

| # | Occurrence | File:line | Form | Verdict | Reasoning |
|---|---|---|---|---|---|
| C-1 | **"Covenbane"** ×7 | inquisitor.js:28,46,55,121,148,178,223 | functional class reference (sentence subject: "The Covenbane purges…") across all 3 specs | **🔴 BUG** | "Covenbane" is the deprecated pre-merge name; canonical class = **Inquisitor** (Covenbane + Exorcist → Inquisitor). It is **not** an intentional sub-tradition: an intentional fusion name would identify *one* spec, but this identical boilerplate blankets *all three* specs as machine-injected filler (smoking gun = `transform_descriptions.js`). Should read "The Inquisitor" (or be removed). |
| C-2 | **"Fate Weaver"** ×1 | harbinger.js:428 | talent **node name** (capstone-adjacent node in the Fate Rift spec) | **🟡 ACCEPTABLE flavor (cleanup optional)** | A talent *title*, not a functional class-id. Thematically apt for Harbinger's fate/probability theme ("the master weaver of fate"). "Fate Weaver" is *also* a deprecated Gambit alias, so it cross-class-collides — worth renaming to avoid confusion, but it is **not** a bug: no functional code resolves it as a Gambit sub-tradition. |
| C-3 | **"Shockwave Gambler"** ×1 | gambit.js:117 | talent **node name** (shockwave node) | **🟢 ACCEPTABLE flavor** | Descriptive talent title using the generic word "gambler"; not a functional class-id, not a sub-tradition label. No action needed. |
| C-4 | **"Bladedancer + Formbender"** ×1 | shaper.js:3 | code **comment** ("// Merged from Bladedancer + Formbender") | **🟢 ACCEPTABLE** | Intentional documentation of the canonical merge (CANON confirms). Not a stale live name. (Same status for the Covenbane/Exorcist, Deathcaller/Lichborne, Dreadnaught→Martyr, Titan→Warden comments in `talentTreeData.js`.) |
| C-5 | **"Chaos Weaver" / "Doomsayer"** | — (absent from all tree files) | n/a | **n/a — not present in domain** | These appear only in `harbingerData.js`. No adjudication needed here; the class-DATA auditor should resolve them. |
| C-6 | **"Gambler" / "Fate Weaver"** as Gambit sub-traditions | — (absent as sub-traditions) | n/a | **n/a — not present in domain** | Neither appears as a functional Gambit spec/sub-tradition reference in the talent trees. "Gambler" occurs only inside "Shockwave Gambler" (C-3); "Fate Weaver" only as a Harbinger node (C-2). |

**Bottom line on sub-traditions:** of the deprecated-name occurrences actually *inside* the talent-tree domain, **only the Inquisitor "Covenbane" boilerplate (C-1) is a genuine bug.** The two talent-titles (C-2, C-3) are acceptable flavor. Everything the master report flagged as "unresolved" (Chaos Weaver / Doomsayer / Fate-Weaver-as-Gambit-subtradition / Gambler-as-Gambit-subtradition) is located in the class-data files, not here.

---

## D. Summary verdicts

- **Merged-class count:** **CONFIRMED at 8** (5 surviving classes) in the live data path (`talentTreeData.js` is correct). No disagreement in this domain except the dead/orphaned `index.js` (TT-6).
- **New contradictions found (not in master report):**
  - **TT-1** (Animist = real-world Vodou loa) — **NEW**, CRITICAL.
  - **TT-2** (Martyr founder = region "Sundale"; patron = unratified "Solbrand") — **NEW**, CRITICAL.
  - **TT-3** (Minstrel hook misattributed to non-canon "Revel Sylvan") — **NEW**, MAJOR.
  - **TT-7** (Shaper flavored with Groven race-craft) — **NEW**, MAJOR.
  - **TT-6** (orphan `index.js` phantom classes) — **NEW**, MAJOR.
  - TT-4/TT-5/TT-8–13 are domain-local confirmations/extensions of master items C3/A5/A15.
- **One-line verdict:** Two CRITICAL new contradictions (Animist tree ships real-world Vodou loa; Martyr tree calls its founder "Sundale" and its patron "Solbrand"); three further MAJOR issues (Minstrel re-skinned to a non-canonical forest, Harbinger re-cast as Keth-Amar's cult, dead `index.js` listing three phantom classes) — plus the Inquisitor "Covenbane" boilerplate is the only true deprecated-name bug in the talent-tree domain.
