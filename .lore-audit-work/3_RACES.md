# RACES — LORE CAPTURE & AUDIT

Audit scope: RACES category. Canonical sources of truth (authoritative when they conflict with data):
`CANON_REFERENCE.md` (§8 Races, §10 Eras, §11 Founding Years), `docs/CORE_LORE_FRAMEWORK.md` (§5 Races),
`docs/RACE_LORE_REWORK.md`, `docs/GM_WORLD_GUIDE.md`. Audited data files: `vtt-react/src/data/races/*.js`,
`raceData.js`, `raceMechanics.js`, `languages.js`, and `public/data/lore.json` (race entries).

Canon timeline anchor: Binding = Year 3, Breach = Year 11, present ≈ Year 800 (Age of the Dimming).

---

## A. COMPLETE LORE PICTURE (per race)

### 1. Human — "The Burning Wick"  (human.js, id `human`)
- **Variants/Spelling:** "Human"; regional cultures Thalren / Skald / Tessen / Solvarn / Merryn / Ordan / Morren.
- **Origin/Timeline:** Pre-existed; already present before Sol was buried. 7 noble houses made the Dark Bargains.
  epicHistory (human.js:89) "noble houses emerged in the three centuries preceding the Deepening."
- **Region:** All seven continents (one culture per region).
- **Subraces (7):** Thalren (Frostwood/House Thalreth), Skald (Nordhalla/House Skalvyr), Tessen (Cragjaw/House Tesshan),
  Solvarn (Sundale/House Solvan), Merryn (Iceheart/House Mereval), Ordan (Sundrift/House Ordavan), Morren (Bryngloom/House Morrath).
  House→subrace mapping is consistent across human.js, RACE_LORE_REWORK, GM guide, lore.json. ✅
- **Cosmic ties:** Keth-Amar (the bargains); Sol/Aex (Solvan wielded the flaying blade, human.js:503).
  Viridane refused → Briaran. Morrath = substitute 7th house (Morren borrowed survival from the Neth).
- **Languages:** Common (human.js:78); Skald subrace adds Old Nord (human.js:340), Ordan adds Mound-Tongue (human.js:655).
- **Lifespan:** 60–90 yrs (human.js:79).
- **Mechanics:** Mortal Frailty (-10% HP), The Short Straw (+25% necrotic/aging dmg), Desperate Will (+2 Spirit) (human.js:75).

### 2. Astril — "The Fire-Carried"  (astril.js, id `astril`)
- **Variants/Spelling:** "Astril." Subraces Vashir / Silath. (Note: RACE_LORE_REWORK uses same names ✅.)
- **Origin/Timeline:** Extraterrestrial refugees from a world orbiting star **Lumia**; Keth-Amar devoured Lumia; survivors
  carried Lumia's biosphere in their blood for "ten thousand years" (astril.js:17,29,238 — pre-Mythrill, not a timeline breach).
  Arrived on Mythrill **before the Binding** and advocated for it. ✅ matches CANON_REFERENCE §8.
- **Region:** Sundrift Vale (lore.json:552); small enclaves in Sundale (Vashir) & Nordhalla (Silath) (astril.js:62).
- **Cosmic ties:** Led Keth-Amar to Sol (guilt core). Bound to **Selunis**, dormant lunar deity, via a nightly waking ritual.
- **Languages:** Common, Lumian (astril.js:65). NOTE: "Lumian" is not a language in languages.js (Astril use Celestial/Synod-Speak/Ethereal per languages.js comment).
- **Lifespan:** 140–200 yrs (astril.js:66).
- **Notable:** "Mother Therra… First Voice of Selunis… died at one hundred and ninety" (astril.js:271) — fits lifespan ✅.

### 3. Briaran — "The Forgotten House"  (briaran.js, id `briaran`)
- **Variants/Spelling:** "Briaran." Subraces Trueborn / Shorn. RACE_LORE_REWORK thematic name "The Forgotten"; race file essence "The Forgotten House."
- **Origin/Timeline:** = House Viridane, the house that refused Keth-Amar; fae counter-bargain in moonlit groves; thorns = biological vows.
  Emerged **during the Breach**. ✅ matches canon.
- **Region:** Frostwood Reach (deep ironwood groves) (lore.json:1428).
- **Cosmic ties:** Fae (Sylvan contract); Aex (oral "hunt" memory, briaran.js:173); reject Thalreth's Fog Compact (lore.json:1430).
- **Languages:** Common, Sylvan (briaran.js:48). Lifespan 180–250 yrs (briaran.js:49).
- **⚠ Origin-count issue:** Race file repeatedly labels **Viridane the "eighth house"** and implies **8 original houses** — see B, R-04.

### 4. Emberth — "Devoted cave-dwelling nomads, keepers of Sol's last ember"  (emberth.js, id `emberth`)
- **Variants/Spelling:** "Emberth." Subraces Korr / Thrask ✅ (matches RACE_LORE_REWORK).
- **Origin/Timeline:** Already underground before the sun died; received final Sol image (the Solbrand) when Sol was bound;
  **surfaced when Emberspire erupted (Breach)**. ✅ Pre-existed; surfaced at Breach (CANON_REFERENCE §8).
- **Region:** Sundale (lore.json:487); capital Harath-Vault.
- **Cosmic ties:** Sol (the Solbrand = Sol's last ember); Sun-Speakers. First faithful; Dawn Vigil broke from them ~300 yrs later (CANON §7).
- **Languages:** Common, Sundari (emberth.js:47). Lifespan 90–130 yrs (emberth.js:48).
- **Factions:** currentCrisis lists Risen / Sunderer / Scoured (emberth.js:113–119).

### 5. Myrathil — "Free-born children of the sea"  (myrathil.js, id `myrathil`)
- **Variants/Spelling:** "Myrathil." ⚠ Subraces **Shoreling / Deepling / Riverling** in race file (myrathil.js:42,222,462),
  but **Shore / Deep / Brook** in lore.json:1752, RACE_LORE_REWORK & GM guide — see B, R-06.
- **Origin/Timeline:** Spawned from volcanic foam + glacial meltwater when Emberspire erupted (Breach). Mareth's "experiment." ✅ Created at Breach.
- **Region:** Iceheart Sea (lore.json:1751); cities Salt-Hinge, Drift-Home, First Shore, Brinewell, Rillmeet.
- **Cosmic ties:** **Mareth** (sea deity); lunar (tides). Sundered Monolith in Treakous Rift (myrathil.js:25).
- **Languages:** Common, Aquan (myrathil.js:52); Deep subrace adds Primordial (myrathil.js:715). Lifespan 140–200 yrs (myrathil.js:53).

### 6. Neth — "The Silver-Touched"  (neth.js, id `neth`)
- **Variants/Spelling:** "Neth." Subraces Velun / Kessen / Drun ✅ (matches RACE_LORE_REWORK & rules.json:624).
- **Origin/Timeline:** Dying scribe-clan; presented a legal argument to **Morvane the Keeper**; First Contract; preserved (pact-bound).
  "Eight centuries" (neth.js:11,25) ✅. Canon dates it **during freeze, 1st century** (CANON §8/§11).
- **Region:** Bryngloom Forest; capital **Atropolis** (lore.json:1378). Outposts: Ironjaw Port, Frostwood embassy, Sundale crossroads.
- **Cosmic ties:** Morvane (= the Watcher/Keeper per CANON §1). The Drun burned their names from the Contract.
- **Languages:** Common, Gloom-Tongue (neth.js:58). Lifespan "Indefinite (pact-bound)" (neth.js:59).
- **⚠ Age math:** "Atropolis… coaxed into cathedral-shapes over a thousand years" (neth.js:9) vs Neth existing only 800 yrs — see B, R-10.

### 7. Mimir — "The Mask-Bound"  (mimir.js, id `mimir`)
- **Variants/Spelling:** "Mimir." ⚠ Subraces **Veiled / Tethered / Untethered** (mimir.js:38,334,552,750) vs
  **Masked / Woven / Unwoven** (RACE_LORE_REWORK) and **Mask-Borne / Unwoven / Mist-Woven** (GM guide) — see B, R-05.
- **Origin/Timeline:** Created by **Sereth** (world-bound deity of creation/perfection), reshaped across centuries;
  Sereth died of its own contradictions. ✅ Pre-existed (CANON §8). "Rupture… third century of the Dimming" (mimir.js:64).
- **Region:** Frostwood Reach (canopy-holds, Spire-Aeries, Deep Floor).
- **Cosmic ties:** Sereth (dead creator); masks = identity anchors; Fetch-Motes (Untethered).
- **Languages:** Common, Vale-Speak (mimir.js:47). Lifespan 90–130 yrs (mimir.js:48).
- **Generation claim:** masks "re-carved across eleven generations" (mimir.js:337) — Mimir pre-existed Binding, so plausible ✅.

### 8. Vreken — "The Gloom-Lit"  (vreken.js, id `vreken`)
- **Variants/Spelling:** "Vreken." Subraces Clean (Deep-Glow) / Marked (Ghost-Mycelium) ✅ (matches RACE_LORE_REWORK).
- **Origin/Timeline:** Originally elegant elven monastery-folk devoted to Morvane; Wyrd wounded Morvane → fungal transformation;
  bioluminescent lantern-eyes. "Older than the Neth, older than the noble houses, older than the Binding" (vreken.js:15) ✅
  (CANON: oldest besides Fexric). ⚠ Wound timing: race file = "when Sol was bound" (vreken.js:19,165); canon = "during the Deepening" — see B, R-09.
- **Region:** Bryngloom Forest (lore.json:1402); Sunken Spires (inverted cathedrals).
- **Cosmic ties:** Morvane; Root-Veil; Ghost-Mycelium; the hush/Over-Lit. ⚠ Claims Solbrand & Root-Veil are "the same dying consciousness" — see B, R-08.
- **Languages:** Common, Gloom-Tongue (vreken.js:56). Lifespan 160–240 yrs (vreken.js:57).

### 9. Groven — "Humanoid bridge-trolls of the Cragjaw Peaks"  (groven.js, id `groven`)
- **Variants/Spelling:** "Groven." Subraces Morgh / Ithran (+ Murmur-Blooded outcasts) ✅ (matches RACE_LORE_REWORK & GM guide).
- **Origin/Timeline:** Fexric Deep Alchemists' alchemical experiments on **Thrumm** trolls; Vat-Breakers rebelled & fled.
  Created ~800 yrs ago / ~Year 40 (fexrick.js:83; CANON §8/§11) ✅. "Toll Wars (Years 280–340, Dimming)" (groven.js:55).
- **Region:** Cragjaw Peaks (lore.json:1770); Frostmaw Crag; Ancestor-Spans.
- **Cosmic ties:** Aex (Sundered Monolith beneath Frostmaw Crag, groven.js:57); Fexric (creators/enemies); Still-Claiming.
- **Languages:** Common, Terran (groven.js:30). Lifespan 200–350 yrs (groven.js:31).

### 10. Fexric / Fexrick — "The Cyber-Graft Guilds"  (fexrick.js, id `fexrick`)
- **Variants/Spelling:** ⚠ **MAJOR — see B, R-01/R-02/R-03.** Race file: `name:'Fexrick'`, id `fexrick`, with explicit comment
  (fexrick.js:2–4) that "Fexrick" = race name, "Fexric" = adjective. CANON/CORE_LORE/RACE_LORE_REWORK use "Fexric" as the race name.
  lore.json: id `fexrick` but `term:"Fexric"` (lore.json:1799–1800). languages.js: language "Fexric."
- **Subraces:** Kethrin (Guild-Bound) / Drall (Clan-Free) ✅ (matches RACE_LORE_REWORK).
- **Origin/Timeline:** "Oldest continuous civilization on Mythrill… eight thousand years" (fexrick.js:30,73) ✅ Pre-existed.
  Created the Groven ~800 yrs ago (fexrick.js:83). ⚠ **lore.json gives a contradictory origin** — see B, R-02.
- **Region:** Cragjaw Peaks (lore.json:1802); Frostmaw Holdfast; First Holdfast.
- **Cosmic ties:** None direct (predate the cosmic crisis); created Groven + (accidentally) the "Fexrick" vermin.
- **Languages:** Common, Fexric (fexrick.js:62). Lifespan 180–250 yrs (fexrick.js:63).

### Non-playable / quasi-race keys identified in lore.json
- **corvani** (lore.json:1334): `type:"subfolk"`, region Nordhalla. GM-only non-playable creature race — raven-marked glacier-dwellers
  bound to Corvid Fate-Spirits; trade memories for passage. (Not a playable race; absent from raceData.js — correct.)
- **corvid_speech** (lore.json:1349): `type:"language"`, Nordhalla. GM-only creature language of the Corvani. (Not a standard language; absent from languages.js — consistent with "GM-only".)
- **rime_born** (lore.json:1361): `type:"race"`, Nordhalla. "Rime-Born" (aka Breath-Takers / Hrym) — frost-touched Skald-kind
  carrying the Frost-Tithe birth-curse (House Skalvyr's Hunger Pact). Typed as a race in lore.json but functionally a Nordhalla
  subfolk/sub-variant of Skald; **not** in raceData.js (which holds only the 10 playable races). GM guide treats Rime-Born as a Skald subgroup.
- **atropolis** (lore.json:1378): `type:"location"`, Bryngloom. The Neth cathedral-grove capital (NOT a race).

---

## B. INCONSISTENCY MAP

Severity scale: **CRITICAL** (direct contradiction of canon / breaks timeline / entity identity) · **HIGH** (named-thing or origin mismatch a GM/player will hit) · **MEDIUM** (cross-file drift, ambiguous) · **LOW** (cosmetic/labeling).

### R-01 — CRITICAL — "Fexric" vs "Fexrick": no canonical race-name spelling
- **Location:** fexrick.js:2–6 (name "Fexrick"); lore.json:1799–1800 (id `fexrick`, term "Fexric"); languages.js (language "Fexric"); raceData.js (key `fexrick`).
- **Canon says:** CANON_REFERENCE §8 and CORE_LORE_FRAMEWORK §5 both name the race **"Fexric."**
- **Lore says:** The data file's `name` field is **"Fexrick"** and an inline comment decrees "Fexrick" = race noun / "Fexric" = adjective — a convention that appears nowhere in the canonical docs. lore.json is itself split (id `fexrick`, display term `Fexric`).
- **Notes:** Every prose passage uses "Fexric" for the people. The canonical docs never use "Fexrick" as the race name. Either canon must be amended to "Fexrick" or the data file's `name`/id must revert to "Fexric." Primary spelling deliverable flagged in CANON_REFERENCE §8.

### R-02 — CRITICAL — Fexric ORIGIN contradicted by lore.json
- **Location:** lore.json:1803–1804 (fexrick entry).
- **Canon says:** Fexric are the oldest continuous civilization (8,000+ yrs), pre-existed everyone, and **created** the Groven from Thrumm blood (CANON §8; CORE_LORE §5; fexrick.js:73,83).
- **Lore says:** lore.json states the Fexric **"were an accident. The same alchemical vats that forged the Groven bled chemical runoff that coalesced into the Fexric"** — i.e., the Fexric race is a byproduct of the Groven vats (~800 yrs ago), the inverse of every other source.
- **Notes:** This also inverts the creator/created relationship (Groven→Fexric instead of Fexric→Groven) and collapses an 8,000-yr civilization to ~800 yrs. Severe.

### R-03 — HIGH — "Fexrick" naming collision (race vs vermin)
- **Location:** fexrick.js:6 (race name "Fexrick"); fexrick.js:15,85 (a separate creature also called "the Fexrick," an accidental sapient vermin from alchemical runoff).
- **Canon says:** No canon for this; the race is "Fexric" in canon (see R-01).
- **Lore says:** The race file uses "Fexrick" as the proper name of the cyber-grafter race AND "the Fexrick" as the name of a runoff-born vermin species — two unrelated sapient entities sharing one name. The race file itself struggles to keep them distinct (fexrick.js:15,85).
- **Notes:** Compounds R-01. The vermin entity should be renamed (or the race revert to "Fexric") to remove the collision.

### R-04 — CRITICAL — Briaran label Viridane the "eighth house" / imply 8 original houses
- **Location:** briaran.js:7,11,13,159,161,163.
- **Canon says:** Viridane was the **original 7th** signatory of the Binding; 7 houses signed total (Thalreth, Skalvyr, Solvan, Mereval, Tesshan, Ordavan, Viridane). The "8th house" is a **folk truth** used by the Briaran for *themselves* (counting Viridane as 7th, themselves as 8th) — CANON_REFERENCE §4/§8; CORE_LORE §4.
- **Lore says:** briaran.js states "There were eight houses, not seven… the eighth house existed: **House Viridane**" (briaran.js:11,13,159) and "House Viridane was the youngest of the noble families… **The seven older houses**… agreed to the bargain" (briaran.js:161,163) — which (a) assigns the "8th house" label to Viridane instead of the Briaran, and (b) implies **8 original signatories** (7 older + Viridane).
- **Notes:** Directly contradicted by lore.json:1430 ("House Viridane was the **original seventh signatory**") and by human.js:15,53,95,97. briaran.js is also internally inconsistent (its own cardFlavor uses "eighth house" in the correct folk-truth sense). Needs correction to "seventh house / original seventh signatory."

### R-05 — HIGH — Mimir subrace names differ across all sources
- **Location:** mimir.js:38,334,552,750 (Veiled / Tethered / Untethered).
- **Canon says:** RACE_LORE_REWORK "Subrace Table": **Masked / Woven / Unwoven.** GM guide: **Mask-Borne / Unwoven / Mist-Woven.**
- **Lore says:** Race data file uses **Veiled / Tethered / Untethered** — a third distinct scheme.
- **Notes:** Three mutually incompatible naming sets for the same three lineages (aristocrat/crafter/maskless). Players/GMs will be unable to match subrace references across docs and the data file.

### R-06 — HIGH — Myrathil subrace names differ across sources
- **Location:** myrathil.js:42,222,462 (Shoreling / Deepling / Riverling).
- **Canon says:** lore.json:1752, RACE_LORE_REWORK, and GM guide all use **Shore / Deep / Brook** (and "Shore Myrathil / Deep Myrathil / Brook Myrathil").
- **Lore says:** Race data file uses **Shoreling / Deepling / Riverling.**
- **Notes:** Same lineage concepts, different names. "Brook" (canon) vs "Riverling" (data) is the clearest mismatch.

### R-07 — HIGH — "Root-Veil" defined three different ways
- **Location:** (a) lore.json:1404 & neth.js:15 → Root-Veil = the **entity** (Vreken name for Morvane); (b) vreken.js:19,37,163 → Root-Veil = the **mycelial network / Morvane's nervous system**; (c) languages.js → Root-Veil = a **language** ("the mycelial network's ancient whisper-language… Spoken by Morvane").
- **Canon says:** No single canon definition; CANON §1 names the entity "Morvane / the Watcher / the Keeper."
- **Lore says:** Three incompatible referents for the same term (deity vs network vs language).
- **Notes:** Echoes and deepens the prior "Thrum/Thrumm/Deep-Thrum" terminology problem. Needs a single glossary definition.

### R-08 — HIGH — Vreken conflate Solbrand and Root-Veil (Sol ≈ Morvane)
- **Location:** vreken.js:41.
- **Canon says:** Sol (a bound star) and Morvane/the Watcher (a boundary entity "older than Keth-Amar's interest") are **distinct** cosmic entities (CANON_REFERENCE §1; CORE_LORE §1).
- **Lore says:** "The Solbrand, the eternal ember the Emberth tend, and the Root-Veil the Vreken venerate are **fragments of the same dying consciousness**."
- **Notes:** This implies Sol and Morvane are one entity, collapsing the canon's strict entity separation. Either the line is poetic overreach or a real doctrinal error; either way it contradicts canon.

### R-09 — MEDIUM — Vreken/Morvane Wyrd-wound timing
- **Location:** vreken.js:19,165.
- **Canon says:** "Wyrd wounded their deity **during the Deepening**" (CANON_REFERENCE §8; CORE_LORE §5). [Note: the Wyrd canonically leaks after the Breach, Year 11, so canon is itself mildly tense here.]
- **Lore says:** "**When Sol was bound** and the world froze, the Wyrd seeped up… Morvane was wounded" (vreken.js:19,165) — dates the wound to the Binding or later, not the Deepening.
- **Notes:** Reconcile to one event (Deepening vs Binding vs Breach) across canon and the race file.

### R-10 — HIGH — Neth Atropolis age math (1000 > 800)
- **Location:** neth.js:9.
- **Canon says:** Neth First Contract ≈ 1st century of the Dimming; present ≈ Year 800 (CANON §11). Neth exist "eight centuries" (neth.js:11,25).
- **Lore says:** "a city… built from living ironwood **coaxed into cathedral-shapes over a thousand years**."
- **Notes:** The city cannot have been grown over 1,000 years by a people who have only existed 800 years. lore.json:1384 safely says "over centuries." New generation/age math error (category c).

### R-11 — MEDIUM — Neth phrasing implies they pre-existed the Binding
- **Location:** neth.js:11 ("the people who live there have been writing in it since before the sun was stolen").
- **Canon says:** The Neth (as the pact-bound Neth) were **created during the freeze, 1st century** — after the Binding/Breach (CANON §8). Only the predecessor scribe-clan pre-existed.
- **Lore says:** Attributes pre-Binding antiquity to "the Neth" rather than to the pre-contract clan.
- **Notes:** Minor wording fix ("the scribe-clan that would become the Neth…").

### R-12 — MEDIUM — "Selunis" (lunar deity) vs "The Dead Moon" (dormant star) — naming/description gap
- **Location:** astril.js (throughout — e.g., astril.js:23,35,192; Selunis's Quest trait astril.js:191).
- **Canon says:** CANON_REFERENCE §1/§6 names the body "**The Dead Moon**" and specifies it is a **DORMANT STAR / sleeping deity**, NOT connected to Keth-Amar. CORE_LORE_FRAMEWORK (the declared canonical source) does not name it at all.
- **Lore says:** RACE_LORE_REWORK and astril.js call it "**Selunis**," a "lunar deity," and describe a centuries-long Astril ritual to **wake** it.
- **Notes:** Selunis = the Dead Moon by all indications, but (a) the canonical framework omits the name entirely, and (b) "deity" (race file) vs "dormant star" (canon) is a description mismatch. Needs canonical ratification of the name "Selunis" and its nature.

### R-13 — LOW — Tessen isolation generation-count drift across files
- **Location:** human.js:22,422 ("sixteen generations" / "four hundred years").
- **Canon says:** RACE_LORE_REWORK and GM guide say the Tessen "have not seen sky in **thirty generations**."
- **Lore says:** Race file says "**sixteen generations**" / "four hundred years."
- **Notes:** human.js is internally consistent (16 × ~25 yrs ≈ 400), but cross-file it disagrees with the "thirty generations" in the docs. Pick one.

### R-14 — LOW — Thalren genealogy "thirty-two generations"
- **Location:** human.js:108 (Thalra Greymark: genealogy "stretching back thirty-two generations").
- **Canon says:** Timeline ≈ 800 yrs since Binding.
- **Lore says:** 32 generations of recorded Frostwood genealogy.
- **Notes:** At a 25-yr genealogical generation ≈ 800 yrs (plausible), but against a 60–90-yr lifespan the "generation" unit is ambiguous. Borderline; flag for verification against how "generation" is used elsewhere.

### R-15 — LOW — "Deep Thrum" / "Deep-Thrum" / "Thrumm" spelling
- **Location:** groven.js ("the Deep Thrum," mineral consciousness, two words); languages.js (language "**Deep-Thrum**," hyphenated); "Thrumm" = the stone-troll race (groven.js, fexrick.js, lore.json `thrumm`).
- **Canon says:** No single spelling ratified.
- **Lore says:** The mineral consciousness is written "Deep Thrum" (race file) and "Deep-Thrum" (languages.js), while the unrelated stone-troll race is "Thrumm."
- **Notes:** Confirms and updates the prior audit's Thrum/Thrumm/Deep-Thrum note. Standardize hyphenation.

### R-16 — LOW — Emberth faction list overlaps two canon faction sets
- **Location:** emberth.js:113–119 (Risen / Sunderer / Scoured).
- **Canon says:** The **faith schism** (Embers of Sol) = **Dawn Vigil / Risen / Scoured** (CORE_LORE §7; CANON §7). The later **Sundale civil war** (~Year 780) = **Risen / Sunderer / Scoured** (CANON §11).
- **Lore says:** emberth.js currentCrisis uses "Risen / **Sunderer** / Scoured," dropping the **Dawn Vigil** (the ruling Sundale theocracy, GM guide) in favor of "Sunderer."
- **Notes:** The race file blends the two faction lists. "Dawn Vigil" (the dominant Sundale theocracy under Hierophant Aethelgard) is absent from the Emberth race file's own faction breakdown despite being central to Sundale lore.

### R-17 — LOW — Emberth essence tagline vs thematic name
- **Location:** emberth.js:4 (essence "Devoted cave-dwelling nomads, keepers of Sol's last ember").
- **Canon says:** RACE_LORE_REWORK thematic name "**The Faithful**."
- **Lore says:** Race file uses a descriptive tagline rather than the thematic label every other race uses in its `essence` field.
- **Notes:** Cosmetic; align `essence` to "The Faithful."

### R-18 — MEDIUM — World-bound deities (Mareth/Vereth/Sereth) have no anchor in the canonical framework
- **Location:** myrathil.js (Mareth); briaran.js (fae/Vereth); mimir.js (Sereth); neth.js & vreken.js (Morvane); astril.js (Selunis).
- **Canon says:** CORE_LORE_FRAMEWORK (declared canonical source of truth) defines only the 6 cosmic entities + Dead Moon. It names no "world-bound deities." CANON §1 ratifies **Morvane = the Watcher/Keeper**, but Mareth, Vereth, and Sereth appear only in RACE_LORE_REWORK (Tier-2) and the race files.
- **Lore says:** Race lore leans heavily on Mareth (Myrathil origin), Vereth (Briaran transformation), and Sereth (Mimir creator).
- **Notes:** Gap, not a contradiction. These deities need to be either ratified into CORE_LORE or marked as regional belief rather than canon cosmology.

### R-19 — LOW — Briaran oral history reframes Aex's sacrifice as a predatory "hunt"
- **Location:** briaran.js:173.
- **Canon says:** Aex **willingly** sacrificed; **House Solvan** wielded the knife at the **Binding (Year 3)**; 7 houses went to the Warden (CORE_LORE §2.1; CANON §3).
- **Lore says:** Briaran elders speak of a pre-Binding "hunt" where "the seven families gathered not to save the world but to take from it… they hunted something in the dark above the world… **Aex**… flayed it alive," and "House Viridane was present at that hunt."
- **Notes:** Recasts a willing Binding sacrifice as an aggressive hunt and broadens the flaying from "Solvan wielded the knife" to "the families." Defensible as biased oral tradition, but it contradicts canon's emphasis and should be flagged as in-universe folklore, not fact.

### R-20 — LOW — What do the Vreken worship? (Root-Veil vs Morvane)
- **Location:** neth.js:15 ("The Vreken call it the Root-Veil and **worship it**"); vreken.js:11,15,37 (Vreken "devoted to **Morvane**"; Root-Veil = Morvane's nervous system, the object of communion, not a separate worshipped entity).
- **Canon says:** —
- **Lore says:** neth.js says Vreken worship **the Root-Veil** (the network); vreken.js says they worship **Morvane** (the deity) and treat the Root-Veil as a medium.
- **Notes:** Subset of R-07, but worth its own line because it changes the object of Vreken devotion (network vs deity).

---

### Re-confirmed prior-audit items
- **A-05..A-07 / B-11 generation-count errors & C-04 era labels:** The category-RACES files contain no new instance of the previously-flagged impossible generation math *within a single file*; the cross-file Tessen drift (R-13) and the new Atropolis 1000-vs-800 error (R-10) are the fresh findings. Era labels inside race files are largely canonical ("Dimming," "the Deepening"); the only soft hits are the in-world period name "**the Collection**" (myrathil.js:86, related to CANON §10's flagged "Age of Collection") and "**Year of Ash 203**" (human.js:99, Solvan Imperium founding — non-canonical era label).
- **"Thrum" vs "Thrumm" / "Deep-Thrum":** re-confirmed, refined as R-15.
