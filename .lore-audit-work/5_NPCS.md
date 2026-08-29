# NPCs & CHARACTERS — LORE CAPTURE & AUDIT

**Scope:** `npcStore.js`, `factionStore.js` (leader/member refs), `lore.json` (all character/historical_figure/entity entries), cross-checked vs `CANON_REFERENCE.md`, `CORE_LORE_FRAMEWORK.md`, `GM_WORLD_GUIDE.md`, and v3 findings (`LORE_CONSISTENCY_AUDIT_v3_FINDINGS.md`).
**Read-only audit.** No source files modified.

Present year ≈ **Year 800 of the Dimming**. Founding-year canon from CANON_REFERENCE §11.

---

## A. COMPLETE LORE PICTURE (master NPC table)

### A.1 Living / current NPCs present in `npcStore.js` (35 entries)

| ID | Name (title) | Faction(s) / House | Race | Class (founder?) | Age / Era | Key relationships | Location | Status |
|----|--------------|--------------------|------|------------------|-----------|--------------------|----------|--------|
| aldren-thalreth | Aldren Thalreth (Lord of Greymark, de jure) | House Thalreth / Scribe-Sentinels | Thalren human | — | elder; memory-fog | father of Kaelen & Caedren; namesake of "Aldren Thalreth the Elder" (frozen in Frozen Archive) | greymark-keep | Active (impaired) |
| kaelen-thalreth | Kaelen Thalreth ("Quill-Lord", Jarl-Archivist, de facto leader) | House Thalreth / Scribe-Sentinels | Thalren human | — | 41 | son of Aldren | greymark-keep / scribes-tower | Active |
| elara-thalreth | Elara Thalreth (Keeper of the High Hearth) | House Thalreth | Thalren human | — | 52 | distant cousin of Aldren | greymark-keep | Active |
| caedren-thalreth | Caedren Thalreth (Master Scribe) | House Thalreth / Scribe-Sentinels | Thalren human | — | 38 | 2nd son of Aldren | scribes-tower | Active |
| halvar-skalvyr | Halvar Skalvyr ("Jarn-Tand"/"Iron-Tooth", High King-Jarl) | House Skalvyr | Skald human | — | 61 | brother of Sigurd; father of Frigga | fjord-gate | Active |
| sigurd-skalvyr | Sigurd Skalvyr (Custodian of Frozen Archive) | House Skalvyr | Skald human | — | 58 | brother of Halvar | frozen-archive | Active |
| frigga-skalvyr | Frigga Skalvyr (Geothermal Negotiator) | House Skalvyr | Skald human | — | young (temporal-friction altered) | daughter of Halvar | frozen-archive / over-shanty | Active (clandestine) |
| thorn-speaker | The Thorn-Speaker (Voice of the Ironwood) | Trueborn Briaran / House Viridane | Trueborn Briaran | — | Unknown | — | ironwood-heart | Active |
| the-first-liar | The First Liar (Leader of Unlit Veil) | Unlit Veil | Astril (Silath/Unlit) | — | Unknown (Veil ≥3 centuries) | — | synod-hold | Active (possibly multiple) |
| valeria-the-grim | Valeria the Grim (Doomsayer-Priestess) | Doom-Choir | Solvarn human | — | ≥200 (stasis) | apprentice/successor of Malakor | frozen-archive | Sealed in meditation |
| old-maren | Old Maren (Root & Resin proprietor) | (none; ex-Sentinel) | Thalren human | — | 72 | — | greymark-keep | Active |
| korrin-the-shade | Korrin the Shade (Shadow Confessor) | (none) | Human (Morren) | — | 39 | — | over-shanty | Active |
| loras-ordavan | Loras Ordavan (Steppe-Lord) | House Ordavan | **Solvarn human [see N-10]** | — | 44 | husband of Lady Mira | synod-hold | Active: figurehead [conflict N-09] |
| hark-ash-hammer | Hark Ash-Hammer (Keeper of First Forge / Blood-Priest) | Bloodhammer Line | Skald human | — | 67 | — | harath-vault / emberspire-caldera | Active |
| sera-three-scars | Sera Three-Scars (Voice of Ancestral Convergence) | Ancestral Convergence | Morren human | — | 49 | — | frozen-archive | Active: failing |
| vel-otharen | Vel-Otharen (Senior Signatory, Canopy-Ledger) | Canopy-Ledger / House Morrath | Velun Neth | — | 412 | heir to Valerius | atropolis | Active |
| skadi-glass-eye | Skadi Glass-Eye (Keeper of Elk-Rites) | Frozen Order of the Elk / House Skalvyr | Skald human | — | 54 | descendant of Cassia | frozen-archive | Active |
| fex-vestara | Fex-Vestara (Conclave-Prime) | Frostmaw Conclave | Kethrin Fexrick | — | 88 | heir to Nesta | frostmaw-holdfast | Active: racing clock |
| mor-vereth | Mor-Vereth (Weaver of Congregation of Silence) | Congregation of Silence | Morren human | — | 41 | serves/keeps Li Wei | starfall-vale | Active: terrified |
| merr-cael | Merr-Cael (Harbor-Master, Merrowport House) | Merrowport House | Merryn human | — | 58 | heir to Jax/Lyra | merrowport | Active: losing |
| malakor | Malakor the Finite (Choir-Prime of Doom-Arithmetic) | Doom-Choir / House Skalvyr | Skald human | **Harbinger co-founder** | 471 | partner of Xyris; teacher of Valeria | frozen-archive | Active |
| vrael-forty-seventh | Vrael the Forty-Seventh (Last Commander, Barbed Vow) | Barbed Vow | Thalren human | — | 52 | — | the-sunken-spire | Active: half-erased |
| bri-vessela | Bri-Vessela (Regent of Lunar Communion) | Lunar Communion / Briaran Groves | Trueborn Briaran | — | 63 | serves Selene | frostwood-reach | Active: acting |
| sol-kaessen | Sol-Kaessen (Vigil-Mother, Covenant of the Scar) | Covenant of the Scar / Dawn Vigil / The Risen | Solvarn human | — | 47 | tends Sera Solvan's scar | emberspire-caldera | Active |
| mer-lyrisa | Mer-Lyrisa (Tide-Choir Mistress) | Tide-Choir | Merryn human | — | 36 | named for Lyris | merrowport | Active: hoarse |
| vespera | Vespera (Blight-Mother / First Host) | Cultivar | Clean Vreken | **Plaguebringer founder** | 300+ | — | bryngloom-forest | Active: bedridden, dying |
| sol-vareths | Sol-Vareths (Last-Ember / Most-Converted) | Ashen Communion / The Sunderers | Solvarn human | — | 34 (effective) | — | emberspire-caldera | Active: countdown |
| kor-vasseth | Kor-Vasseth (Threshold-Keeper, Twice-Born) | Twice-Born | Mixed Vreken-Neth | — | **431 [see N-01]** | carries Kora + Vesper arts | bryngloom-forest | Active [age error] |
| veyra | Veyra the Merged (Form-Matriarch) | Form-Convergence | Mimir | **Shaper founder** | 600+ [see N-12] | merged Sylvanus + Torin | frostmaw-holdfast | Active |
| thrak-damos | Thrak-Damos (Bulwark-Captain, Aegis) | Aegis | Thrask Emberth | — | 51 | enforces Damon's method | emberspire-caldera | Active |
| varis | Varis the Trembling (Venom-Master, Distillery) | Distillery | Thalren human | **Toxicologist founder** | 400+ | — | frostwood-reach | Active |
| alaric | Alaric the Law-Keeper (Chain-Lord / First Bound) | The Bound / Vat-Breakers Guild | Groven | **Warden founder** | 700+ | — | frostmaw-holdfast | Active |
| sylas | Sylas (Silent-Master / First Hunter) | Silent Hunt | Mimir | **Apex founder** | Unknown | — | frostwood-reach | Active: deaf |
| dawn-vigil-commander | The First Dawn (Commander, Dawn Vigil) | Dawn Vigil | Unknown | — | sealed | — | emberspire-caldera | Identity sealed (secretly dead 80 yrs) |
| saren-vel | Saren-Vel (The Nameless Flame) | Drun Outcasts | Velun Neth (Drun) | — | Historical | founder of Drun subrace | over-shanty / black-fen | **DEAD vs ALIVE conflict [N-03]** |

### A.2 Historical / founder figures in `lore.json` (NOT in npcStore)

| ID | Name (title) | Faction/House | Race | Class founded | Era / status | Location/Region |
|----|--------------|---------------|------|---------------|--------------|-----------------|
| cassia | Cassia (Augur founder) | Frozen Order of the Elk | Skald | Augur | Dead/historical | nordhalla |
| damon | Damon the Emberth (Spellguard founder) | Aegis | Emberth | Spellguard | Dead/historical | sundale |
| sera (+ sera-solvan dup) | Sera Solvan (Martyr founder) | House Solvan / Covenant of the Scar | Solvarn | Martyr | Dead (~735-740 yrs) | sundale |
| kael / nyssa / theron (+ triune-founders) | Kael / Nyssa / Theron (Animist co-founders) | Ancestral Convergence | Ordan / Vreken / Skald | Animist | Dead/historical | sundrift-vale / bryngloom / nordhalla |
| grum (+ grum-bloodhammer dup) | Grum Bloodhammer (Berserker founder) | Bloodhammer Line | Skald | Berserker | Dead/historical | sundale (Emberspire) |
| torra-bloodhammer | Torra Bloodhammer (Bloodhammer chieftain) | Bloodhammer Line | Skald | — | Dead (cold-water exposure) | nordhalla → sundale |
| first-cabal | The First Cabal (Pyrofiend founders) | Ashen Communion | 7 Solvarn occultists | Pyrofiend | Dead/names erased | sundale |
| selene | Selene of House Viridane (Lunarch founder) | Lunar Communion / House Viridane | Briaran | Lunarch | Alive (fell silent 3 weeks ago) | frostwood-reach |
| xyris | Xyris the Tear (Harbinger co-founder) | Doom-Choir | Astril | Harbinger | Status unclear | nordhalla |
| valerius | Valerius (Arcanoneer founder) | Canopy-Ledger | Velun Neth | Arcanoneer | Dead/historical | atropolis |
| nesta | Nesta (Chronarch founder) | Frostmaw Conclave | Fexrick | Chronarch | Disappearing from history | frostmaw-holdfast |
| li-wei | Li Wei (False Prophet founder) | Congregation of Silence | Ordan | False Prophet | Dead (heart kept beating via Mor-Vereth) | sundrift-vale |
| jax | Jax the Wager (Gambit co-founder) | Merrowport House | Merryn | Gambit | Vanished (walked into sea) | iceheart-sea |
| lyra | Lyra the Clause (Gambit co-founder) | Merrowport House (Deck-Burners) | Kessen Neth | Gambit | Alive (radicalized) | bryngloom / merrowport |
| lyris | Lyris the Tide-Singer (Minstrel founder) | Tide-Choir | Merryn | Minstrel | Dead/historical | iceheart-sea |
| kora | Kora the Veil-Speaker (Revenant co-founder) | Twice-Born | Clean Vreken | Revenant | Dead/historical | bryngloom-forest |
| vesper | Vesper the Scribe (Revenant co-founder) | Twice-Born / House Morrath | **Neth (lore) vs human (GM guide) [N-02]** | Revenant | Undead/contractual | bryngloom-forest |
| orven | Orven the Still-Handed (Inquisitor co-founder) | Barbed Vow | Marked Vreken | Inquisitor | Gone dark (MIA) | bryngloom-forest |
| elias | Elias the Salt-Scarred (Inquisitor co-founder) | Barbed Vow | Thalren | Inquisitor | Dead/historical | frostwood-reach |
| sylvanus | Sylvanus (pre-merger Bladedancer lineage) | Form-Convergence | Mimir | (Shaper root) | Dead/historical | frostwood-reach |
| torin | Torin (pre-merger Formbender lineage) | Form-Convergence | Groven | (Shaper root) | Dead/historical | frostmaw-holdfast |
| orven-sen | Orven-Sen (Kessen probability-weaver) | Neth | Kessen Neth | — (NOT a class founder) | Dead/historical | bryngloom-forest |
| aurel-shorn-first | Aurel Shorn-First (first Shorn Briaran) | Briaran (Shorn) | Briaran | — | Dead/historical | frostwood-reach |
| watcher_in_the_mist | The Watcher in the Mist (= Morvane / Keeper / Root-Veil) | — | entity | — | Extant (fracturing) | frostwood-reach / bryngloom |
| malakor-the-archivist | "Malakor" (DUPLICATE of malakor) | Doom-Choir | Skald | Harbinger | — | nordhalla |

**Founder-identity verdict (canon §9 check):** All 20 classes' founders are present and correctly attributed (Augur=Cassia, Spellguard=Damon, Martyr=Sera Solvan, Warden=Alaric, Animist=Kael/Nyssa/Theron, Berserker=Grum, Pyrofiend=First Cabal, Lunarch=Selene Viridane, Apex=Sylas, Harbinger=Xyris/Malakor, Shaper=Veyra, Arcanoneer=Valerius, Chronarch=Nesta, False Prophet=Li Wei, Gambit=Jax/Lyra, Minstrel=Lyris, Plaguebringer=Vespera, Revenant=Kora/Vesper, Inquisitor=Orven/Elias, Toxicologist=Varis). **No founder is filed under the wrong class.** (Confirms v3 E-03 for the NPC layer.)

**Distinct-identity verdicts (item e):**
- **Vespera ≠ Vesper.** Vespera = Plaguebringer founder (Clean Vreken); Vesper the Scribe = Revenant co-founder (Neth). Correctly distinct everywhere; names are intentionally similar.
- **Sera Solvan ≠ Sera Three-Scars ≠ "Sera" (key).** Sera Solvan = Martyr founder (dead); Sera Three-Scars = current Animist leader (Morren). Distinct. NOTE: the bare `"sera"` lore.json key (line 413) is a *duplicate* of `sera-solvan`, not a third person (see N-11).
- **Orven ≠ Orven-Sen.** Orven the Still-Handed = Inquisitor co-founder (Marked Vreken); Orven-Sen = a Kessen Neth probability-weaver who predicted Emberspire's eruption. Correctly distinct.
- **Malakor = Malakor-the-archivist** (duplicate entry — see N-11).

---

## B. INCONSISTENCY MAP

### CRITICAL

#### N-01 [CRITICAL] Kor-Vasseth age "431 / four centuries" impossible — Revenant class only ~250 years old
- **Location:** `npcStore.js:584` (age `'431'`), `:585` (status `'frightened for the first time in four centuries'`), `:587` (`'frightened for the first time in four centuries'`)
- **Canon says:** Revenant class founded **Year 550 of the Dimming** (CANON_REFERENCE §11). Present ≈ Year 800 → Revenant tradition is only **~250 years** old.
- **Lore says:** Kor-Vasseth, Threshold-Keeper of the Twice-Born (a Revenant order carrying "both founders' arts, Kora's Toll and Vesper's Phylactery"), is **431 years old** and has been frightened "for the first time in four centuries."
- **Notes:** Same class of error as v3 A-03. A Revenant cannot have been one for 400 years when the class has existed for only ~250. Either drop the age to ≤~250 / "two centuries," or reframe him as pre-Revenant lineage. **New finding (deeper Revenant age-math issue).**

#### N-02 [CRITICAL] Vesper (Revenant co-founder) — race AND gender contradict across sources
- **Location:** `lore.json:4011` ("A Velun Neth of the Bryngloom, she bound her soul to a carved basalt phylactery") vs `GM_WORLD_GUIDE.md:1001` ("The human scribe Vesper, dying of the sumps' lung-rot… binding **his** soul to a basalt phylactery") and `:1007` ("the human **Morren/Thalren** phylactery-path (Vesper)").
- **Canon says:** CANON_REFERENCE §9 lists Revenant founders = Kora/Vesper; race not pinned at canon level, so the data files must agree.
- **Lore says:** lore.json = **Velun Neth, female**; GM guide = **human (Morren/Thalren), male**.
- **Notes:** Also note `factionStore.js:1196` typo "Vestpers." This is a hard contradiction on two axes (race + gender) for a class co-founder.

#### N-03 [CRITICAL] Saren-Vel alive vs dead
- **Location:** `npcStore.js:721` (status `'Historical — died centuries ago'`), `:724` ("She died in the bog, her name already gone, unnamed even in death") vs `lore.json:4424` ("She walked out past guards who could not touch her… **She has not spoken a word in four centuries**… legally nonexistent… and free.").
- **Canon says:** Not pinned at canon level; the two data sources must agree.
- **Lore says:** npcStore = **dead** (died in the bog); lore.json = **alive** (walked out, silent for 4 centuries, free).
- **Notes:** The drun-outcasts faction (`factionStore.js:1440`) calls her "the memory of Saren-Vel," leaning toward dead/legend, but her own lore.json entry reads as a living person.

### MAJOR

#### N-04 [MAJOR] "Grand Admiral Varis / Varis Mereval" — name collision with Varis the Trembling (Toxicologist)
- **Location:** `lore.json:1665` ("House Mereval rules the Iceheart Sea under **Grand Admiral Varis**"); `GM_WORLD_GUIDE.md:243` ("led by **Grand Admiral Varis**"), `:253` ("**Grand Admiral Varis Mereval**… Varis constructed the Unfreezing Booms").
- **Canon says:** The Mereval Grand Admiral is a distinct role/character.
- **Lore says:** "Varis" is ALSO the Toxicologist founder (Varis the Trembling — `npcStore.js:636`, `lore.json:3477`, Thalren, Frostwood). Meanwhile the dedicated character entry `lore.json:3700 mereval-admiral` is deliberately **unnamed** ("The Grand Admiral of Merrowport").
- **Notes:** Internal inconsistency (named "Varis" in house text, unnamed in character entry) AND identity collision with the prominent Toxicologist NPC. Recommend the Grand Admiral take a distinct name.

#### N-05 [MAJOR] Vespera summary STILL says "eight-century" — A-01 unfixed in lore.json summary
- **Location:** `lore.json:3406` (summary: "Her **eight-century** foundational strain is dying") vs `lore.json:3407` (fullEntry: "**Three centuries** on, she still leads…") and `npcStore.js:546-548` ("three centuries").
- **Canon says:** Plaguebringer founded Year 500 (~300 years). v3 A-01 mandated "three centuries."
- **Lore says:** The fix was applied to npcStore and to lore.json's *fullEntry*, but NOT to lore.json's *summary* field, which still reads "eight-century."
- **Notes:** Re-confirms/persists A-01 in one location; the same record contradicts itself (summary 8c / fullEntry 3c).

#### N-06 [MAJOR] Sol-Kaessen role misattributes the Martyr order to the Barbed Vow (Inquisitor order)
- **Location:** `lore.json:3372` (role: "Vigil-Mother of the **Barbed Vow** martyr-order").
- **Canon says:** The Barbed Vow is the **Inquisitor** order (`factionStore.js:1035`, leader vrael-forty-seventh). The Martyr order is the **Covenant of the Scar** (`factionStore.js:1101`, leader sol-kaessen). npcStore (`:499`) gets it right: "Vigil-Mother of the Covenant of the Scar."
- **Lore says:** lore.json fuses the two — "Barbed Vow martyr-order."
- **Notes:** Wrong-order attribution for an order leader.

#### N-07 [MAJOR] Saren-Vel / Drun-name-burning event timed three different ways
- **Location:** "two centuries" — `factionStore.js:824` and `:1450`; "three centuries" — `npcStore.js:729`, `factionStore.js:809`, `:813`; "four centuries" — `lore.json:4424`.
- **Canon says:** No fixed year for the Drun founding; the files must at least agree.
- **Lore says:** The same foundational event (a Drun woman/Saren-Vel burning her name from the First Contract) is dated 2, 3, and 4 centuries ago depending on the file.
- **Notes:** Compounds N-03. Pick one duration and propagate.

#### N-08 [MAJOR] The First Liar region tagged "nordhalla," but Synod Hold is in Sundrift Vale
- **Location:** `lore.json:3615` (region `"nordhalla"`), `:3617` ("leads the Unlit Veil from Synod Hold… if you've ever read a banned manuscript in Nordhalla").
- **Canon says:** Synod Hold is the Sundrift Vale seat — `factionStore.js:439` (unlit-veil regionId `sundrift-vale`), `:533` (house-ordavan regionId `sundrift-vale`, HQ `synod-hold`).
- **Lore says:** the-first-liar is tagged nordhalla and the prose says "in Nordhalla," yet operates "from Synod Hold" (Sundrift Vale).
- **Notes:** Spatial/region mismatch. `npcStore.js:166` correctly lists locationIds `['synod-hold']`.

#### N-09 [MAJOR] Loras Ordavan — sitting Steppe-Lord (npcStore/lore.json) vs deposed by Khatun Bayarmaa (factionStore)
- **Location:** `npcStore.js:278` (status `'Active: figurehead'`, title `'Steppe-Lord of the Sundrift Vale'`); `lore.json:3628-3631` ("sits the Steppe-Lord's throne") vs `factionStore.js:559-563` (leader npcId `bayarmaa-ordavan`; "Khatun Bayarmaa Ordavan **deposed him**"), `:571` (Loras member role `'Deposed Steppe-Lord'`).
- **Canon says:** n/a; sources must agree on who currently holds the throne.
- **Lore says:** npcStore/lore.json treat Loras as the sitting (if puppet) lord; factionStore says he was deposed and Bayarmaa rules.
- **Notes:** Update npcStore status/title + lore.json to "deposed" to match factionStore.

#### N-10 [MAJOR] Loras Ordavan race "Solvarn" mismatches his house/region (should be Ordan)
- **Location:** `npcStore.js:275` (race `'Solvarn human'`).
- **Canon says:** House Ordavan rules the **Sundrift Vale**; its people are the **Ordan** subrace (cf. Kael, the Ordan Animist founder, `lore.json:1892`). **Solvarn** = the Sundale subrace (Sol-Kaessen, Sol-Vareths, Solvan Steward).
- **Lore says:** Loras, an Ordavan, is tagged Solvarn (Sundale).
- **Notes:** House/race mismatch.

#### N-11 [MAJOR] Three class founders have DUPLICATE lore.json entries (short-id + long-id)
- **Location:**
  - `lore.json:397 "grum"` (term "Grum Bloodhammer", historical_figure) **+** `lore.json:3789 "grum-bloodhammer"` (term "Grum Bloodhammer", character)
  - `lore.json:413 "sera"` (term "Sera Solvan", historical_figure) **+** `lore.json:3944 "sera-solvan"` (term "Sera Solvan", character)
  - `lore.json:1878 "malakor-the-archivist"` (term "Malakor", historical_figure) **+** `lore.json:3320 "malakor"` (term "Malakor", character)
- **Canon says:** One person each.
- **Lore says:** Two records per founder with slightly different prose (e.g., `grum` tells the ice-wyrm story; `grum-bloodhammer` tells the Torra/Forge story).
- **Notes:** Creates LoreLink-resolution ambiguity (relatedTerms reference both `grum` and `grum-bloodhammer`, `sera` and `sera-solvan`) and risks content drift. Consolidate or make one a canonical alias of the other.

### MINOR

#### N-12 [MINOR] Veyra age "600+" vs Shaper founded ~Year 350 (~450 yrs)
- **Location:** `npcStore.js:604` (age `'600+'`).
- **Canon says:** Shaper founded ~Year 350 (CANON_REFERENCE §11) → ~450 years. Veyra is the Shaper founder.
- **Lore says:** 600+ implies she was ~150+ years old at founding. Plausible for a long-lived Mimir, but Mimir lifespan is undefined (cf. v3 C-02). Flag as ambiguous until Mimir generational/lifespan canon is set.

#### N-13 [MINOR] Vel-Otharen "thirty generations of refinement" vs age 412
- **Location:** `npcStore.js:346` ("His pig-iron forearm graft is original, fused **thirty generations** of refinement ago"), age 412 (`:344`).
- **Notes:** 412 / 30 ≈ 14 years per "generation," which is odd for a generational measure (Arcanoneer founding year is itself unspecified in §11). Likely means 30 iterative refinements, but the word "generations" collides with the problematic generation-counts flagged in v3 A-05/A-06/A-07/B-11. Clarify or rephrase.

#### N-14 [MINOR] Valeria title uses deprecated class name "Doomsayer"
- **Location:** `npcStore.js:185` (`'Doomsayer-Priestess of the Frozen Archive'`), `:194` ("co-founded the **Doomsayer** tradition with Xyris").
- **Notes:** Canonical class = **Harbinger**. "Doomsayer" is an archived/merged name (GM_WORLD_GUIDE.md:684 acknowledges it as deprecated). Consistent with v3 Category-H (deprecated names); called out here because it sits in an NPC title. The order name "Doom-Choir" / "Doom-Arithmetic" is acceptable as an in-fiction order label.

#### N-15 [MINOR] Typos in character data
- `factionStore.js:1196` — "Vestpers frost-stasis arts" → should be "Vesper's."
- `npcStore.js:348` — "Vel-Otharan presides" → should be "Vel-Otharen."

#### N-16 [MINOR] Sol-Kaessen claims dawn-vigil membership not reflected in factionStore
- **Location:** `npcStore.js:502` (factionIds includes `'dawn-vigil'`) vs `factionStore.js:634` (dawn-vigil `members: []`; leader is `dawn-vigil-commander`).
- **Notes:** Part of the broader v3 D-04 pattern (24/34 factions have empty `members` arrays). Her Dawn Vigil tie is intentional narrative tension (Martyr "torn in half"), but the membership isn't recorded on the faction side.

---

## C. MISSING-NPC STATUS (re-verification of v3 D-01)

v3 D-01 listed **11 NPCs** referenced in lore/factionStore but absent from npcStore. Re-verification:

| D-01 NPC | In npcStore? | In lore.json? | Faction-leader ref? | NEW STATUS |
|----------|--------------|---------------|---------------------|------------|
| Kaelen Thalreth | ✅ YES (`npcStore.js:27`) | ✅ (`lore.json:3523`) | house-thalreth leader | **RESOLVED** |
| Halvar Skalvyr | ✅ YES (`npcStore.js:93`) | ✅ (`lore.json:3538`) | house-skalvyr leader | **RESOLVED** |
| Dawn-Vigil Commander | ✅ YES (`npcStore.js:696`) | ✅ (`lore.json:3638`) | dawn-vigil leader | **RESOLVED** |
| Deep-Alchemist Prime | ❌ no | ✅ (`lore.json:3652`) | deep-alchemists leader | **STILL MISSING from npcStore** (has lore stub) |
| Vat-Breaker Foreman | ❌ no | ✅ (`lore.json:3669`) | vat-breakers-guild leader | **STILL MISSING from npcStore** (has lore stub) |
| Solvan Steward | ❌ no | ✅ (`lore.json:3685`) | house-solvan leader | **STILL MISSING from npcStore** (has lore stub) |
| Mereval Admiral | ❌ no | ✅ (`lore.json:3700`) | house-mereval + brine-bond-syndicate leader | **STILL MISSING from npcStore** (has lore stub) |
| Tesshan Lord | ❌ no | ✅ (`lore.json:3715`) | house-tesshan + steam-line-cartel leader | **STILL MISSING from npcStore** (has lore stub) |
| Morrath Steward | ❌ no | ✅ (`lore.json:3729`) | house-morrath + neth leader | **STILL MISSING from npcStore** (has lore stub) |
| Vellan Archivist | ❌ no | ✅ (`lore.json:3775`) | scribe-sentinels member | **STILL MISSING from npcStore** (has lore stub) |
| Bayarmaa Ordavan | ❌ no | ❌ **NO entry either** | house-ordavan leader (`factionStore.js:559`) | **STILL MISSING EVERYWHERE** — only a factionStore leader npcId |

**Summary of D-01 re-verification:**
- **3 RESOLVED** (now full npcStore entries): Kaelen Thalreth, Halvar Skalvyr, Dawn-Vigil Commander.
- **7 promoted to lore.json stubs but STILL MISSING from npcStore**: Deep-Alchemist Prime, Vat-Breaker Foreman, Solvan Steward, Mereval Admiral, Tesshan Lord, Morrath Steward, Vellan Archivist. These exist as `lore.json` character entries but will not appear in NPC UI/store lookups (`getNpc`, `getNpcsByFaction`, etc.).
- **1 STILL MISSING FROM BOTH npcStore AND lore.json**: Bayarmaa Ordavan — referenced only as a faction-leader `npcId` in `factionStore.js`. She is the most underspecified: no portrait, no backstory, no dictionary entry, yet lore (`lore.json:1710`, `factionStore.js:559-563`) names her as the sitting Khatun who deposed Loras.

---

## D. RE-CONFIRMATION OF EXISTING v3 AGE-MATH FINDINGS (NPC scope)

| v3 ID | Subject | Status in NPC-scope files |
|-------|---------|----------------------------|
| A-01 | Vespera "eight centuries" | **Mostly FIXED** — npcStore says "three centuries"; lore.json fullEntry says "Three centuries." **STILL BROKEN in `lore.json:3406` summary** (→ N-05). |
| A-02 | Varis "eight centuries" | **FIXED** — `npcStore.js:648` "four centuries" (Toxicologist Y380 ≈ 420 yrs). lore.json has no explicit duration. |
| A-03 | Revenant quote "eight hundred years / thirty generations" | **FIXED in `GM_WORLD_GUIDE.md:1009`** — now "two hundred years" / "six generations" (Revenant Y550 ≈ 250 yrs). `revenantData.js:226` is outside this audit's file set — recommend re-check. |
| A-04 | Alaric "eight centuries" | **FIXED** — `npcStore.js:664` "700+", `:666` "seven centuries" (Warden Y70 ≈ 730 yrs). |
| C-01 | Sera Solvan "Dead — eight centuries" | Not present in npcStore; lore.json `sera`/`sera-solvan` carry no "eight centuries" claim. `martyrData.js:111` is outside this audit's file set — recommend re-check. |

**New NPC-layer age-math issue found:** N-01 (Kor-Vasseth 431 / "four centuries" vs Revenant ~250 yrs).

---

## E. SUMMARY

- **NPCs catalogued:** 35 living/current (npcStore) + ~28 historical/founders (lore.json) + 7 faction-leader stubs (lore.json only) + 1 leader ref with no entry anywhere = **~71 distinct character entities**.
- **Class-founder identity:** clean — all 20 founders correctly attributed; no founder filed under the wrong class.
- **Distinct-identity confusions (Vespera/Vesper, Sera Solvan/Sera Three-Scars, Orven/Orven-Sen):** correctly separated in the data.
- **CRITICAL issues: 3** (N-01 Kor-Vasseth age; N-02 Vesper race/gender; N-03 Saren-Vel alive/dead).
- **MAJOR issues: 8** (N-04 … N-11).
- **MINOR issues: 5** (N-12 … N-16).
- **D-01 missing-NPC:** 3 resolved, 7 have lore stubs but no npcStore entry, 1 (Bayarmaa Ordavan) missing from both stores.
- **Persistent v3 item:** A-01 half-fixed (lore.json summary still wrong → N-05).
