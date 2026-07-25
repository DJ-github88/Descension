# MYTHRILL VTT — MASTER LORE MAP & CONSISTENCY AUDIT
**Date:** 16 July 2026  
**Scope:** Full lore corpus — `lore.json` (4,666 lines, ~250 entities), `rules.json`, all 10 race files, 20 class data files, `timelineStore.js`, `factionStore.js`, `npcStore.js`, `class-lore-compendium.md`, `GM_WORLD_GUIDE.md`, region/zone/location data, and all `docs/LORE_*.md` audits.  
**Canon benchmark:** `docs/CORE_LORE_FRAMEWORK.md` (declared "single source of truth") + `CANON_REFERENCE.md` (this folder).  
**Method:** 6 parallel category deep-dives + direct verification of every cross-cutting CRITICAL claim.

> **What this adds over the v3 audit:** v3 (`LORE_CONSISTENCY_AUDIT_v3_FINDINGS.md`) was almost entirely **code/mechanical** (deprecated class-name strings, age-math, timeline `classIds` tags, missing store entries). This audit goes **deeper into the actual narrative/cosmology** and finds the lore itself contradicts the canonical framework in ~20 places the prior audit never touched.

Detailed per-category write-ups live alongside this file:
`1_COSMOLOGY.md`, `2_HOUSES_REGIONS_GEOGRAPHY.md`, `3_RACES.md`, `4_CLASSES.md`, `5_NPCS.md`, `6_HISTORY_FACTIONS_TIMELINE.md`.

---

# PART 1 — THE COMPLETE LORE PICTURE (the world at a glance)

## 1.1 Cosmology — 6 cosmic entities + the Dead Moon
| Entity | What it is | Stance |
|---|---|---|
| **The Warden** *(lore.json/rules.json call it **"Aethil"**)* | The grammar of consequence; the rule that every exchange has a price. No will/agenda. | Neutral framework Keth-Amar operates *within* |
| **Keth-Amar** | Cunning star-predator; hunts stars in their Deepening. Schemes, studies prey's folklore. | Antagonist; pressed against the Partial Seal, leeching through cracks |
| **Sol** | A bound star/divine being, beneath Sundale, wrapped in Aex's hide. Did not consent; in torpor. | Victim; cannot rebirth/die/scream |
| **Aex** | Sol's firstborn. **Willingly** flayed at the Binding; hide = the seal; 7 Monoliths = his body parts. Sang during flaying; screamed only after the Breach desecrated his sacrifice. Now silent — listening. | Tragic protagonist; 65 pulses 40%→0% |
| **The Watcher in the Mist / Morvane / Keeper of the Last Threshold** *(one entity)* | Boundary of life/death & memory/oblivion; world's conscience. Quiescent. | Fracturing under Keth-Amar's pressure; hid the false Monolith; now can't find it |
| **Scathrach, the Ashen Sovereign** | Fragment of Aex's hide fallen into Emberspire **during the Binding**; grew sentient, rejected Keth-Amar. | Pyrofiend patron; despises Keth-Amar |
| **The Dead Moon** | A dormant star/sleeping deity (NOT Keth-Amar's doing). Largest fragment fell in Frostwood → lunar parasites → Lunarch bond. Keth-Amar *nested* in the corpse as a perch. | Disconnected from the main conflict |

## 1.2 The Wyrd (Keth-Amar's "agriculture")
Corruption breathed into folklore: **Taint** (passive, in the land) → **Wisp** (manifest fear) → **Spawn** (animated regional monsters) → **Channel** (boss-tier, Keth-Amar's direct attention).

## 1.3 Timeline spine (present ≈ Year 800 of the Dimming)
**Year 0** Sol's Deepening begins → **Y3 Binding** (7 houses, price = Aex willing, Solvan wields knife, knife shatters) → **Y3–11 Corruption Years** (Keth-Amar whispers 8 yrs, offers Sol's warmth deceptively) → **Y11 Breach** (6 heirs consumed; Viridane flees; seal cracks not shatters; → 7 Monoliths; Emberspire erupts; Wyrd bleeds through) → **Partial Seal Y11→now** (Viridane erased; Morrath elevated as substitute 7th; fog hides the secret). The **Pulse** (~12-yr timing, 8–20 range; intensity unpredictable) = Aex's scream trying to re-sync; 65 measurements 40%→0%; now silent.

## 1.4 The 7 Houses & their Dark Bargains (with Keth-Amar)
| House | Region | Traded → Got | Cost |
|---|---|---|---|
| Thalreth | Frostwood Reach | Clarity → insulating fog | Memory erasure |
| Skalvyr | Nordhalla | Summer → halted glaciers | Eternal winter, Frost-Tithe, Hunger Winter |
| Solvan | Sundale | *Wielded the knife* | Guilt, silence, legacy |
| Mereval | Iceheart Sea | Calm seas → navigable channels | Perpetual storms |
| Tesshan | Cragjaw Peaks | Visibility → blizzard-veil | Lost landmarks |
| Ordavan | Sundrift Vale | Fertile soil → endless grass | Dark sky, constellations flee |
| **Viridane** | Frostwood | **Refused** | Erased; survives as the Briaran |

Official record = 7 houses incl. **Morrath** (substitute 7th, governs Bryngloom). Briaran "8th house" = folk-truth, not a contradiction.

## 1.5 The 7 Monoliths (Aex's body parts)
Thalreth=Fog-Hand (Frostwood) · Skalvyr=Ice-Crown (Nordhalla) · Tesshan=Wind-Bone (Cragjaw) · Mereval=Depth-Breath (Iceheart Sea) · Ordavan=Grass-Spine (Sundrift Vale) · **Solvan=Still-Heart (genuine, misidentified) (Sundale)** · **Viridane=False/hollow echo (Frostwood, hidden by Watcher)**.

## 1.6 Faith schism (Embers of Sol)
**Dawn Vigil** (Hierophant Aethelgard; militant theocracy; secretly knows reassembly summons Keth-Amar) · **The Risen** (old Emberth patience) · **The Scoured** (heretics; want to seal the Breach / let Sol die gently). *Canon = exactly 3.*

## 1.7 Races (10 playable)
Human (7 subraces = the regional cultures), Astril (star-Lumia refugees), Briaran (House Viridane + fae), Emberth (subterranean, surfaced at Breach), Myrathil (born at Breach from volcano+glacier), Neth (scribe-clan + First Contract with Morvane), Mimir (made by creator-deity Sereth), Vreken (Wyrd-wounded elven Morvane-devotees), Groven (Fexric alchemy on Thrumm trolls), Fexric (oldest civilization, 8,000+ yrs).

## 1.8 Classes (20 active + 8 formally-merged concepts)
Each founded by a specific person as a response to the crisis. Founders: Augur=Cassia · Spellguard=Damon · Martyr=Sera Solvan · Warden=Alaric · Animist=Kael/Nyssa/Theron · Berserker=Grum Bloodhammer · Pyrofiend=First Cabal · Lunarch=Selene Viridane · Apex=Sylas · Harbinger=Xyris/Malakor · Shaper=**Veyra** · Arcanoneer=Valerius · Chronarch=Nesta · False Prophet=Li Wei · Gambit=Jax/Lyra · Minstrel=Lyris · Plaguebringer=Vespera · Revenant=Kora/Vesper · Inquisitor=Orven/Elias · Toxicologist=Varis the Trembling.

## 1.9 Scale of the corpus
~250 lore.json entities · 7 regions · 8 houses · ~123 zones / 86 map pins · 49 factions (only 8 with members) · ~71 named NPCs · 100+ creatures. **Both `lore.json` copies are byte-identical** (MD5 match) — no divergence.

---

# PART 2 — INCONSISTENCY MAP (deduplicated master list)

Severity: **🔴 CRITICAL** (lore is flatly wrong / inverts canon) · **🟠 MAJOR** (misleading / diverges from canon) · **🟡 MINOR** (polish).

## A. COSMOLOGY & CANON CONTRADICTIONS (the deep ones v3 missed)

### 🔴 A1. Aex "hunted, did not volunteer" — inverts the willing sacrifice
`timelineStore.js:515`: *"Aex does not volunteer for this torment. The noble houses… hunt Aex through the volcanic throat… flay the radiant child of the sun alive."*  
**Canon §1.4/§2.1:** Aex **willingly** sacrificed himself; "He did not scream. He sang." This is the exact willing-vs-forced contradiction `LORE_CRITICAL_ASSESSMENT` C2 flagged — **still present in the timeline narrative** (the framework doc was fixed; the data was not). Also `lore.json` `aex` entry omits the "consent=Binding / agony=Breach" distinction.

### 🔴 A2. Solvan's Still-Heart called "the false decoy" — inverts the Monolith canon
`lore.json:4362`: *"Still-Heart — House Solvan. The heart. But this is the **false decoy**… the **true heart lies elsewhere**."*  
**Canon §5/§8.2:** Solvan's Still-Heart is the **genuine** heart-fragment (only "misidentified"); the **only** false Monolith is Viridane's hollow echo. lore.json thus invents a **second** false monolith and a phantom "true heart." (Flagged by 2 agents independently.)

### 🔴 A3. The Fexric origin is inverted (and self-contradictory)
`lore.json:1804`: *"They were an accident. The same alchemical vats that forged the Groven bled chemical runoff that coalesced into the Fexric."* — yet the **same entry's summary** (1803) calls them *"the oldest continuous civilization… they predate everyone… millennia before humans."*  
**Canon §8:** Fexric are an 8,000-year civilization that **created the Groven** (~800 yrs ago) — the exact reverse. Internally contradictory AND canon-inverting.

### 🔴 A4. The "Cult of Forgotten Shadow" is 3–4 different cults
| Source | Composition | Motivation |
|---|---|---|
| **Canon §7** | a Vigil splinter | openly worships Keth-Amar as inevitable |
| **lore.json:728** (keth_amar) | Over-Shanty bog-cult + Dawn Vigil defectors | channels Keth-Amar's whispers |
| **lore.json:4655** (cult entry) | Vreken exiles, coven-mages, heretical animists | rejects Neth-Vreken Reincarnation Bargain; embraces "primordial starless dark" (no Keth-Amar mention) |
| **timelineStore.js:2582-2599** | "desperate survivors" **or** "Natalie Seline, Neth pact-weaver" | (and "Natalie Seline" is a **Warcraft IP name**) |

Four mutually exclusive origins, two duplicate Year-412 founding events, and an IP-infringing name.

### 🔴 A5. Morvane / Root-Veil / Solbrand four-way entity conflation
- `rules.json:188`: *"An entity called the **Morvane** (the same being the Vreken call the **Root-Veil**)"* → Morvane = Root-Veil.
- `vreken.js:41`: Solbrand and Root-Veil are *"the same dying consciousness"* → Solbrand = Root-Veil.
- `neth.js`: Vreken worship **the Root-Veil**; `vreken.js`: they worship **Morvane**.
- **Canon:** Morvane = the Watcher (a distinct cosmic entity); Sol = a separate bound star; "Root-Veil" is undefined. Three cosmic categories are being collapsed into one.

### 🔴 A6. Watcher ↔ Dead Moon conflation (canon explicitly forbids this)
`lore.json:4440` (`watcher_in_the_mist`): *"some Briaran theologians believe [the Watcher] is the **dreaming consciousness of the dead moon**"*; `dead_moon` cross-links it.  
**Canon §1.5/§6:** the Dead Moon is a dormant star; Keth-Amar nested in its corpse — **"not laid by it, not connected to it."** This is the one conflation the framework specifically warns against.

### 🟠 A7. The Warden entity was renamed "Aethil" without ratification
`lore.json:702` + `rules.json:675` (pronunciation "AY-thil") name the entity **Aethil**; the canonical framework **never** uses "Aethil" — it says "The Warden." Either ratify "Aethil" in `CORE_LORE_FRAMEWORK.md` or standardize to "The Warden." *(Silver lining: this cleanly separates the Warden entity from the Warden class — but it must be made official.)*

### 🟠 A8. Dark Bargains / regional Compacts attributed to the wrong party
Canon §4: the 6 regional bargains were **Dark Bargains with Keth-Amar**. But multiple sources credit **Aethil/the Warden** instead:
- `lore.json:316` & `:1839`: Thalreth's fog = *"bargain with Aethil."*
- `rules.json:343` & `lore.json:2296`: the Glacier Bargain = *"Aethil's breath."*
- `timelineStore.js:752/771`: Glacier Bargain struck with **Aethil**.
- vs `rules.json:168` (Skalvyr) correctly says **Keth-Amar**.  
Note: the Aethil *entity entry* itself (lore.json:706) gets the distinction right; the house/location/timeline texts don't.

### 🟠 A9. "Sunderer" is a 4th faith faction (canon = exactly 3)
`lore.json`, `factionStore.js`, `GM_WORLD_GUIDE` all include **the Sunderer** alongside Dawn Vigil / Risen / Scoured, while canon §7 lists only three. Several entries still claim "three factions" while listing four.

### 🟠 A10. Dawn Vigil's secret rationale diverges from canon (and is self-defeating)
lore.json:2097-98 & `factionStore.js:628`: the Vigil keeps assembling *"so no one else assembles them first"* (defensive hoarding).  
**Canon §7:** they intend to **reassemble to summon and then bind Keth-Amar** (offensive ambition). The lore version is also logically incoherent (reassembling *is* the summoning they claim to prevent).

### 🟠 A11. Scathrach timing drift
`pyrofiendData.js:202`: Scathrach *"born with the **Breach**"* — contradicts canon §1.6 ("during the **Binding**, not the Breach") and the file's own lines 116/151.

### 🟠 A12. Sereth (Mimir creator) — death cause + pronoun drift
`lore.json:453`: Sereth died of *"shame at **his** imperfect creation"*; **Canon §8:** *"died of **its own contradictions**"* (pronoun "it"). Different cause + gendering.

### 🟡 A13. Lunarch lore.json entry is stale/wrong
`lore.json` `lunarch` key describes *"silence-light between the stars"* with **no parasite, no Dead Moon, no Viridane** — contradicts canon §9.2, `lunarchData.js`, and the compendium (Dead Moon lunar-parasite bond).

### 🟡 A14. "the_wyrd" vs "wyrd" duplicate entries with different `type` ("entity" vs "concept"). The Wyrd is a corruption hierarchy, not an entity.

### 🟡 A15. Real-world mythology / IP leakage: "Natalie Seline" (Warcraft, A4); Wyrd compared to Germanic/Celtic/Yuki-Onna/Yokai in GM guide; "De Hesteborne"/"Old Nord" flavor text — `LORE_STYLE_GUIDE` warns against these.

---

## B. RACES

### 🔴 B1. "Fexric" vs "Fexrick" — no canonical spelling
Data file `name:"Fexrick"`; filename `fexrick.js`; lore.json id `fexrick` but term `Fexric`; framework text "Fexric." **Plus** the name collides with a **separate runoff-vermin species** also called "Fexrick" (fexrick.js:6 vs :15/85).

### 🔴 B2. Briaran = "the eighth house / 8 original signatories"
`briaran.js:11/13/159/163` implies **8 original Binding signatories**. **Canon §4 note:** Viridane was the **original 7th**; the "8th house" is a *folk* self-title, not 8 signers. (lore.json:1430 gets this right; the race file doesn't.)

### 🔴 B3. Vreken conflate Solbrand with Morvane/the Watcher (see A5) — `vreken.js:41`.

### 🟠 B4. Mimir subraces — 3 incompatible schemes
race file = Veiled/Tethered/Untethered · canon = Masked/Woven/Unwoven · GM guide = Mask-Borne/Unwoven/Mist-Woven.

### 🟠 B5. Myrathil subraces mismatch: race file = Shoreling/Deepling/Riverling · canon/lore.json = Shore/Deep/Brook.

### 🟠 B6. Mimir mask materials — 3 lists: canon (heartwood/storm-glass) vs +black birch (`rite-of-masks`) vs +pine (`mimir`).

### 🟠 B7. Neth age math: `neth.js:9` says Atropolis was grown *"over a thousand years"* but the Neth have existed only ~800 (neth.js:11/25).

### 🟡 B8. World-bound deities **Mareth / Vereth / Sereth** appear in race files but are **not ratified** in `CORE_LORE_FRAMEWORK` (only Morvane is). Vreken "Selunis" lunar deity vs canon's unnamed "Dead Moon" (a dormant *star*).

### 🟡 B9. Vreken Wyrd-wound dated *"when Sol was bound"* (vreken.js:19/165) vs canon *"during the Deepening."*

### 🟡 B10. Emberth race-file factions list Risen/**Sunderer**/Scoured and **drop the Dawn Vigil** theocracy.

### 🟡 B11. Tessen isolation "16 generations/400 yrs" (race file) vs "30 generations" (docs) — generation-unit ambiguity.

---

## C. CLASSES

### 🔴 C1. Shaper's founder is wrong in the data
`shaperData.js:136`: `founder.name = "Torin"`. **Canon/lore.json/compendium = Veyra** (the file's own origin story :169 says Veyra merged the arts). Torin/Sylvanus are the *roots*, not the founder.

### 🔴 C2. Animist founder contradicted
`animistData.js:161-167/220-222`: founder = unnamed "First Singer"; text says *"There were no three founders."* **Canon/lore.json/compendium = Kael / Nyssa / Theron.**

### 🔴 C3. Deprecated-name cluster used as live sub-traditions (unresolved)
**Chaos Weaver / Doomsayer** = treated as Harbinger's two constituent specs inside `harbingerData.js` (×6/×8), yet v3 + `classLoreStore` classify them as deprecated aliases to strip. **Fate Weaver / Gambler** = same problem in `gambitData.js` (×11/×12). No lore.json "concept" entry exists for them. They are simultaneously "canonical sub-traditions" and "deprecated aliases."

### 🟠 C4. Augur dated to the Binding/Year 3 (canon ~Year 70)
Pervasive: `augurData.js:168/186/240` ("eight centuries"), compendium, lore.json, GM guide all place Augur at the Binding. **Canon §11 = ~Year 70** (co-founded with the Warden class).

### 🟠 C5. Founder age/duration errors still live in npcStore/lore.json (v3 leftovers)
- **Kor-Vasseth** `npcStore.js:584-587`: age 431 / "four centuries" for a Revenant (class founded ~Y550 → ~250 yrs). 🔴
- **Vespera** `lore.json:3406` summary still says "eight-century" (full entry & npcStore fixed to "three centuries"). 🟠
- **Varis** Toxicologist "three hundred years" (toxicologistData) understates ~420. 🟡
- (Revenant quote, Alaric, Sera — confirmed fixed in class files; still live in npcStore/loreDictionary per v3.)

### 🟠 C6. Harbinger / Shaper / Gambit founding-era drift vs canon §11
- Harbinger (Malakor) "first centuries of the Dimming" (harbingerData:121/149) vs canon ~Y380.
- Shaper "First Thermal War, Years 100-120" (shaperData:137/165) vs canon ~Y350.
- Gambit "eight centuries of wagers" (gambitData) for a ~450-yr-old class.

### 🟡 C7. "6 merged concepts" miscount: `THEMATIC_AUDIT.md:132` & `loreDictionary.js:314` say 6; the correct number is **8** (Bladedancer/Formbender→Shaper; Covenbane/Exorcist→Inquisitor; Deathcaller/Lichborne→Revenant; Dreadnaught→Martyr; Titan→Warden).

### 🟡 C8. Minor founder-name noise: Berserker "Iron-Smith" vs "Bloodhammer"; Apex Sylas race unspecified (Woven Mimir); Harbinger Xyris "Solvarn" vs "Sundrift nomad."

---

## D. HOUSES / REGIONS / GEOGRAPHY

### 🔴 D1. Solvan Still-Heart mislabeled (see A2) — geography + canon.

### 🟠 D2. GM guide invents a Monolith for Bryngloom (`GM_WORLD_GUIDE:440`); canon assigns the 7th slot to Viridane's False Monolith (Frostwood) — Bryngloom has none. Plus 3 Monoliths mislocated vs canon (Sundale/Cragjaw/Sundrift sites).

### 🟠 D3. Locations with lore/map pins but **no zoneData**: cinderhoodoo, sump-rift, frostcirque, skalds-longport, thalrens-ledger-post. Orphan `thornwood-grove` in deepLocationData (no link anywhere). Atropolis & Sunken Spire (two Bryngloom capitals) lack deep-location data.

### 🟠 D4. Settlement classification vs population: Greymark Keep "city" vs 1,200 pop (re-confirms v3 C-07); Merrowport 500 pop called "largest port-city"; Harath-Vault 600 as "capital."

### 🟠 D5. Region-tag errors on characters: 5 NPCs tagged with a location-ID as `region` (vel-otharen, morrath-steward, valerius→"atropolis"; fex-vestara, alaric→"frostmaw-holdfast"); **the-first-liar** tagged `nordhalla` but leads the Unlit Veil "from Synod Hold" (Sundrift Vale) — three-way mismatch (region/seat/faction).

### 🟡 D6. Subregion adjacency error: "Blizzard Bluff" claims Sundrift borders Frostwood, but Cragjaw sits between them on the map.

---

## E. NPCs & CHARACTERS

### 🔴 E1. Kor-Vasseth age 431 for a ~250-yr-old class (see C5).

### 🔴 E2. "Vesper" (Revenant co-founder) race+gender contradicts: `lore.json:4011` "Velun Neth / **she**" vs `GM_WORLD_GUIDE.md:1001/1007` "human Morren-Thalren / **his**."

### 🔴 E3. Saren-Vel: alive vs dead — `npcStore.js:721/724` "died in the bog" vs `lore.json:4424` "walked out… has not spoken in four centuries… free."

### 🟠 E4. Varis name collision: Mereval's "Grand Admiral **Varis**" (`lore.json:1665`, GM guide) vs **Varis the Trembling** (Toxicologist founder). The dedicated `mereval-admiral` entry is deliberately unnamed — the named references contradict it.

### 🟠 E5. Sol-Kaessen role mismatch: tagged "Vigil-Mother of the **Barbed Vow** martyr-order" — Barbed Vow is the **Inquisitor** order; the Martyr order = Covenant of the Scar.

### 🟠 E6. Loras Ordavan: "Active sitting Steppe-Lord" (npcStore/lore.json) vs **deposed by Khatun Bayarmaa** (factionStore:559-563). His race is also "Solvarn" (npcStore:275) but Ordavan rules Sundrift Vale → should be **Ordan**.

### 🟠 E7. Duplicate NPC entries: `grum` + `grum-bloodhammer`; `sera` + `sera-solvan`; `malakor` + `malakor-the-archivist`.

### 🟠 E8. Saren-Vel/Drun name-burning timed three ways: 2c / 3c / 4c across factionStore, npcStore, lore.json.

### 🟡 E9. Missing-NPC status (re-verified v3 D-01): 3 resolved (Kaelen Thalreth, Halvar Skalvyr, Dawn-Vigil Commander now in npcStore); 7 are lore.json stubs but **still missing from npcStore** (won't render in NPC UI); **Bayarmaa Ordavan** (the sitting Khatun who deposed Loras) is missing from BOTH stores.

---

## F. HISTORY / FACTIONS / TIMELINE

### 🔴 F1. "Eight noble houses" at the Binding — `timelineStore.js:515`. Canon = **7** signed (Viridane was the 7th; refused at the Breach, not the Binding).

### 🔴 F2. Aex forced-not-willing in the Binding narrative (timelineStore.js:515) — see A1.

### 🔴 F3. Duplicate Year-412 Cult-founding events + "Natalie Seline" (Warcraft) — see A4.

### 🟠 F4. Pulse model is broken
- Year-660 pulse labeled **both** "55th" (event) and "65th" (REBIRTH_CYCLES).
- Cadence packs 63 pulses into 214 years, then a 419-year gap — canon says 8–20-yr spacing.

### 🟠 F5. `factionStore.js:673`: Deep Alchemists *"two thousand years before the Dimming"* — violates the ~800-year timeline.

### 🟠 F6. Morrath called *"the seventh noble family of the Binding Compact"* (factionStore:807) — it's the **post-Breach substitute**, not an original signer.

### 🟠 F7. House Solvan invents a *"surviving Solvarn heir"* (factionStore:718) — contradicts the Breach (only Viridane's line escaped; Solvan wielded the knife).

### 🟠 F8. 5 non-canonical era labels in timelineStore; "Age of the Dimming" starts at Y720 (canon: Y11). (Most era-label violations from v3 A-13/A-14 are cleaned in lore.json, but timelineStore retains them.)

### 🟠 F9. Timeline `classIds` anachronisms: v3 B-01..B-10 → **6 still live** + **16 NEW** found (lunarch/berserker/minstrel/pyrofiend/apex/animist/arcanoneer/warden/shaper×3/gambit×2/toxicologist/inquisitor tagged decades–centuries before founding).

### 🟠 F10. `factionStore.js:985`: `'false_prophet'` (snake_case) vs `'falseProphet'` elsewhere → `getFactionsByClass` silently misses it. Neth typed as `noble_house` (canon: a race/scribe-clan).

### 🟡 F11. Faction gaps: 41 of 49 factions have empty `members: []` (worse than v3's 24/34). "Church of the Holy Light" still missing (now "Solbrand Order," no faction entry). 6 social castes (Forgotten/Fredløse/Deck-Born/Bilge-Dwellers/Mounted/Unmounted) exist only as lore concepts. `silent_seventh` not wired as a Viridane alias.

---

# PART 3 — SYSTEMIC / CROSS-CUTTING THEMES (the "why" behind the noise)

1. **Entity conflation is the #1 lore disease.** Four separate clusters collapse distinct canon entities: (a) Morvane = Root-Veil = Solbrand (A5/B3); (b) Watcher = Dead Moon (A6); (c) the Warden/Aethil vs Keth-Amar as bargain counterparties (A8); (d) the Cult's identity (A4). Fix the entity boundaries and a large fraction of the list dissolves.

2. **The framework doc was updated; the data files were not.** `LORE_CRITICAL_ASSESSMENT` shows C1/C2/C3 were "✅ Fixed" **in the framework prose**, but the *same* contradictions persist in `timelineStore.js`, `lore.json`, race/class files (A1, A11, B9, etc.). The fix never propagated from doc → data.

3. **"Aethil" is an unratified rename** of the canonical "Warden" (A7). Every bargain-attribution error (A8) traces back to it.

4. **Origin/timing inversions** recur: Fexric-created-Groven vs Groven-created-Fexric (A3); Scathrach Binding-vs-Breach (A11); Neth pre-Binding vs 1st-century (B7); Augur Binding vs Year-70 (C4). A single chronological pass against CANON_REFERENCE §11 would catch most.

5. **Subrace/scheme proliferation** with no canonical master list: Mimir (3 schemes), Myrathil (2), mask materials (3), merged-class count (6 vs 8).

6. **v3 measured the skeleton (code identifiers, store schema); this audit measured the flesh (the narrative).** v3 found ~14 CRITICAL code issues; this audit finds **~15 CRITICAL narrative contradictions** that v3 did not surface.

---

# PART 4 — RECOMMENDED FIX ORDER (if you choose to act later)

**Do not act yet — you asked for capture + map only.** When ready:

1. **Ratify the entity layer first** (Themes 1 & 3): officially name "Aethil" vs "The Warden"; pin Morvane = Watcher ≠ Root-Veil ≠ Solbrand ≠ Dead Moon. One decision unblocks A5/A6/A7/A8/B3.
2. **Propagate framework fixes into data** (Theme 2): Aex willing-sacrifice (A1), Still-Heart genuine (A2), Scathrach-Binding (A11), Fexric-origin (A3).
3. **Collapse the Cult of Forgotten Shadow** to one origin (A4) and remove "Natalie Seline."
4. **Lock the timeline**: 7 houses at Binding (F1), Augur→Year 70 (C4), pulse math (F4), classIds anachronisms (F9).
5. **Founder corrections**: Shaper→Veyra (C1), Animist→Kael/Nyssa/Theron (C2), Kor-Vasseth age (E1).
6. **Canonical name/spelling pass**: Fexric/Fexrick (B1), Mimir/Myrathil subraces (B4/B5), deprecated sub-tradition names (C3).
7. **Content gaps**: Bayarmaa Ordavan + 7 npcStore stubs (E9), faction members (F11).

---

*End of Master Report. See the six per-category files for full detail and file:line references.*
