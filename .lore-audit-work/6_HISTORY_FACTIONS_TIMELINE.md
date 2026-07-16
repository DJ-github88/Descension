# HISTORY, FACTIONS & TIMELINE — LORE CAPTURE & AUDIT

**Category:** History (events/timeline) + Factions
**Sources of truth:** `CANON_REFERENCE.md` (§3 Seal/Breach timeline, §7 Faith schism, §10 Eras, §11 founding years), `CORE_LORE_FRAMEWORK.md`, `GM_WORLD_GUIDE.md`, prior `LORE_CONSISTENCY_AUDIT_v3_FINDINGS.md` (B-01..B-10, D-02/D-04/D-05/D-06).
**Data files audited (category):** `vtt-react/src/store/timelineStore.js` (2878 lines, ~70 events), `vtt-react/src/store/factionStore.js` (1782 lines, 49 factions), `vtt-react/public/data/lore.json` (4666 lines — history-event + faction entries).
**Convention:** present ≈ **Year 800 of the Dimming**. Binding = Y3, Corruption = Y3–11, Breach = Y11, Partial Seal Y11→present.

> Severity key: **CRITICAL** = directly contradicts CANON_REFERENCE / breaks the world model. **MAJOR** = significant drift, misleading, or internal contradiction. **MINOR** = wording, casing, data-hygiene, or carry-forward nits.

---

## A. COMPLETE LORE PICTURE

### A.1 — CHRONOLOGICAL TIMELINE (all major historical events, ordered)

| Year | Event (id) | One-line description | Factions / Classes involved |
|---|---|---|---|
| −100 | First Ignition / Aex Firstborn / Fexrick 1st Holdfast / Thrumm Awaken / Vreken Cultivate / Morvane Dominion / Mareth (7 pre-Deepening) | Stars ignite; Aex born; Fexric carve 1st holdfast; Thrumm wake; Vreken cultivate fungi; Morvane claims Bryngloom; Mareth experiments | — (no classIds) |
| 0 | Sol Enters the Deepening (event-sol-deepening) | Sol’s vulnerable cycle begins; Cassia reads the signs | houses Thalreth/Skalvyr/Solvan/Ordavan; **harbinger** |
| 1 | Keth-Amar Descends (event-keth-amar-descends) | Predator circles the dying sun | — |
| 2–50 | False Spring Traditions (event-false-spring-traditions) | Five combat traditions born: Augur(~Y2 Cassia), Spellguard(~Y3 Damon), Martyr(~Y5 Sera Solvan), Pyrofiend(~Y12 First Cabal), Apex(~Y10–30 Sylas) | house-solvan, house-skalvyr |
| 3 | Entombment of Sol / The Binding (event-entombment) | 7 houses flay Aex; Solvan wields the knife; seal set | all 7 houses (incl. viridane); spellguard, augur |
| 3 | Keth-Amar Weaves the Corruption (event-keth-amar-corruption, Y3–11) | 8 years of whispered bargains | 6 capitulating houses; pyrofiend, martyr |
| 3 | Underground Exodus (event-the-underground-exodus) | Emberth retreat to Harath-Vault; Mimir to Fog-Vales | — |
| 5 | Fog Compact (event-fog-compact / event-the-fog-compact-founding-of-greymark) ⚠ DUPLICATE | Thalreth trades clarity for memory-fog; Greymark founded; Scribe-Sentinels founded | house-thalreth, scribe-sentinels; **apex** |
| 7 | Skalvyr Glacier Bargain (event-glacier-bargain) | Skalvyr halts glaciers, loses summer; Frost-Tithe set | house-skalvyr; berserker, augur |
| 7–10 | Hunger Winter (event-hunger-winter) | Skald consume their dead → Hunger Pact seed | house-skalvyr; berserker |
| 11 | Keth-Amar Consumes the Heirs / The Breach (event-keth-amar-breach) | 6 heirs consumed as vessel-keys; seal cracks into 7 Monoliths | 6 houses; martyr, **inquisitor**, apex, **lunarch** |
| 11 | Emberspire Erupts (event-emberspire-eruption) | Volcano erupts; False Spring begins | house-solvan; pyrofiend, **berserker** |
| 11 | Myrathil Spawn (event-myrathil-spawning) | Foam-born from fire+ice | **minstrel** |
| 11 | Refusal of House Viridane (event-viridane-flight) | Viridane flees south; Briaran born; Morrath elevated substitute | house-viridane; **lunarch** |
| 11 | Sera Solvan, First Martyr (event-sera-solvan-the-first-martyr) | Sera carves child’s name → first Vow | — |
| 11 | First Exorcists Rise (event-the-first-exorcists-rise) | Wyrd-immune response; Exorcists/Apexes/Deathcallers/Inquisitors named (textual) | — (narrative names deprecated classes) |
| 12 | First Failed Rebirth 40% (event-first-rebirth) | First pulse; Aex screams; False Dawn month named | augur |
| 12 | Remaining Bargains Struck (event-remaining-bargains, Y12–50) | Ordavan/Mereval/Tesshan bargains + Neth First Contract prep | house-ordavan/mereval/tesshan; **animist, gambit, shaper** |
| 13 | Founding of the Solbrand Order (event-church-founding) | Greymark reorganized; Scribe-Sentinels appointed; “Church” later splinters | house-thalreth, scribe-sentinels; martyr |
| 15 | Astril First Vessels (event-astril-first-vessels) | Lumia’s echos take mortal form in Sundrift Vale | house-ordavan; augur |
| 17 | Preservation Compact (event-preservation-pact) | 6 houses + Morrath formalize bargains; Viridane erased | 7 official houses; martyr |
| 25 | First Contract (event-first-contract) | Neth bargain with Morvane → immortality | **arcanoneer** |
| 30 | Synod Hold Established (event-synod-hold-established) | Ordavan trade-post; Astril gather | — |
| 40 | Vat-Breakers’ Revolt (event-vat-breakers-revolt) | Groven shatter vats, flee; Lost Brood left behind | deep-alchemists, vat-breakers-guild; **warden** |
| 60 | First Vent Failure (event-first-vent-failure) | Cragjaw vent dies; first thermal refugees | — |
| 60 | Fifth Rebirth 28% (event-fifth-rebirth) | Decline undeniable | augur |
| 60–200 | First Ebbing Traditions (event-first-ebbing-traditions) | Arcanoneer(~Y60 Valerius), Warden(~Y70 Alaric), Lunarch(~Y80 Selene), Minstrel(~Y100 Lyris), Animist(~Y120–200 triune) | arcanoneer, warden, lunarch, minstrel, animist |
| 75 | Shorn Emerge (event-briaran-shorn) | Aurel Shorn-First passes as human | trueborn-briaran |
| 80 | Bloodhammer Migration South (event-bloodhammer-migration) | Skald march to Emberspire over decades | house-skalvyr; **berserker** |
| 89 | Ledger Purge (event-northern-schism / stasis-of-aldren) | Aldren Thalreth consolidates ledgers; later sealed in glacier ice | house-thalreth |
| 100 | Sovereign Ledger Established (event-sovereign-ledger) | Ledgered vs Forgotten; Scribe-Cartel formed | house-thalreth, scribe-sentinels, scribe-cartel |
| 100 | Grum Ignites Blood-Heat (event-berserker-founding) | Berserker tradition born at Emberspire | house-solvan; berserker |
| 100 | Deep Myrathil Emerge (event-deep-born-emerge) | Abyssal Myrathil | minstrel |
| 110 | First Thermal War (event-first-thermal-war) | Groven vs Fexric vs refugees over vents; Torin’s precursor act | vat-breakers-guild; **shaper** |
| 150 | Fogwood Schism (event-fogwood-schism) | Preservationists vs Adaptationists; Forgotten underclass | house-thalreth, scribe-cartel |
| 150 | Brook Myrathil Emerge (event-brook-emerge) | Venn proves freshwater survival | **gambit** |
| 150 | Synod Organizes (event-synod-founded) | Astril council at Synod Hold | augur |
| 150 | Unlit Veil reach Synod Hold (event-the-unlit-veil-reach-synod-hold) | Unlit Veil infiltration begins | — |
| 203 | Ledger Halls Collapse (event-ledger-collapse) | Archive disaster; Great Forgetting | house-thalreth, scribe-sentinels; animist |
| 220 | Mimir Purge (event-mimir-purge) | Mask-Mothers killed; mask-forging lost | apex |
| 240 | Mimir Rupture / Three Castes (event-mimir-rupture) | Masked/Woven/Unwoven split | apex, **shaper** |
| 240 | Twentieth Rebirth 15% (event-twentieth-rebirth) | Learned classes accept Aex fading | augur |
| 250–300 | Vashir-Silath Schism (event-astril-schism) | Astril fracture; Tharun Silath assassinated | augur |
| 250–350 | Memory Wars (event-memory-wars) | Ink/ledger cold war; Mist-Sentinels raised | scribe-cartel, house-thalreth, mist-sentinels; **toxicologist, inquisitor** |
| 280–340 | Toll Wars (event-toll-wars) | 60 yrs over Ancestor-Spans; Ithra-Mal treaties | vat-breakers-guild, house-skalvyr, house-solvan; warden, **shaper** |
| 280–400 | Contraction Traditions (event-contraction-traditions) | Chronarch(~Y310 Nesta), Gambit(~Y350 Jax/Lyra), Shaper(~Y350 Veyra), Inquisitor(~Y380 Orven/Elias), Harbinger(~Y380 Xyris/Malakor), Toxicologist(~Y380 Varis) | chronarch, gambit, shaper, inquisitor, harbinger, toxicologist |
| 300 | Brine-Bond Syndicate Founded (event-brine-bond-syndicate) | Luck-Ledger; storm-luck commodified | house-mereval, brine-bond-syndicate; **gambit**, minstrel |
| 300–320 | War of Thousand Screams (event-war-thousand-screams) | Deep Alchemist overrun + vent failure; Chronarch born; Dreadnaughts forged | vat-breakers-guild, steam-line-cartel, deep-alchemists; chronarch, warden |
| 311 | Dawn Vigil Founded (event-dawn-vigil-founded) | Quietist Martyr order → later militarizes under Aethelgard | dawn-vigil, house-solvan; martyr |
| 350 | Briaran Uprising / Siege of Greymark (event-briaran-uprising / event-the-briaran-siege-of-greymark) | Trueborn raids; Thalreth suppression | trueborn-briaran, house-thalreth, mist-sentinels; apex, lunarch |
| 380 | Drun Severing (event-drun-severing) | Saren-Vel burns her name → Drun subrace | gambit |
| 380 | Inquisitor Traditions Merge (event-inquisitor-merge) | Orven + Elias → Barbed Vow | inquisitor |
| 400–450 | Over-Lit Epidemic (event-vreken-overlit-epidemic) | Ghost-Mycelium over-exposure; Clean Vreken rise | inquisitor, **plaguebringer** |
| 412 | Over-Shanty / Cult of Forgotten Shadow (event-cult-founding) ⚠ AND (event-cult-of-forgotten-shadow-founded) — DUPLICATE, conflicting founders | Bog-cult coalesces; later Vigil defectors merge | drun-outcasts, cult-of-forgotten-shadow; **falseProphet, revenant** |
| 480 | Fortieth Rebirth 8% (event-fortieth-rebirth) | Common people see no warming | house-solvan; augur |
| 480 | False Dawn Riots (event-false-dawn-riots) | Temples burned; Solvan Imperium collapses; Vigil militarizes | house-solvan, dawn-vigil; martyr, harbinger |
| 480 | Solbrand Concealment Begins (event-solbrand-concealment) | Korr hide Solbrand’s dimming; by Y780 three factions form | house-solvan, dawn-vigil; martyr, pyrofiend |
| 480–600 | Squeeze Traditions (event-squeeze-traditions) | Plaguebringer(~Y500 Vespera), Revenant(~Y550 Kora/Vesper), False Prophet(~Y598 Li Wei) | plaguebringer, revenant, falseProphet |
| 500 | Great Revision (event-memory-editing) | Scribe-Sentinels edit ledgers; Viridane the template | scribe-sentinels, house-thalreth, scribe-cartel; animist |
| 500 | Mounds Fall Silent (event-the-mounds-fall-silent) | Ordan ancestral mounds go silent (Unlit Veil siphoning) | — |
| 500 | Erasure of House Viridane (event-the-erasure-of-house-viridane) | 3-century erasure project (compressed) | — |
| 598 | Silence Between Stars (event-silence-between-stars) | Cult makes 2-way contact; False Prophet born (Li Wei) | cult-of-forgotten-shadow; falseProphet, revenant, harbinger |
| 650 | Great Fire of the Over-Shanty (event-the-great-fire-of-the-over-shanty) | Cult earns Drun respect | — |
| 660 | Last Rebirth Window 0% (event-last-rebirth) | 65th pulse; Aex silent (**mislabeled “fifty-fifth”**) | augur |
| 720 | Silence-Heat Heresy (event-skalyvr-silence) | Skalvyr scion builds obsidian heat-engine under Frozen Archive | house-skalvyr; pyrofiend, augur |
| 740 | The Nethering (event-nethering) | Morvane distracted; First Contract frays; Arcanoneer crisis | arcanoneer, revenant, falseProphet |
| 760 | Augur Collapse (event-augur-collapse) | Accuracy 93%→41%; temporal friction | house-skalvyr; augur |
| 770 | Last Mimir Birth (event-the-last-mimir-birth) | Mother-flame dies; final Unwoven child | — |
| 780 | Solbrand Fails (event-solbrand-failing) | Dimming visible; Risen/Sunderer/Scoured crystallize | house-solvan, dawn-vigil; martyr, pyrofiend, spellguard |
| 780 | Sundale Civil War (event-sundale-civil-war) | Three-way doctrinal war; Aethelgard conscripts Martyrs | house-solvan, dawn-vigil, the-risen, the-sunderers; martyr, berserker, pyrofiend, spellguard |
| 780 | Monoliths Change Resonance (event-the-monoliths-change-resonance) | Monoliths wake in sequence | — |
| 790 | Frostmaw Geothermal Collapse (event-geothermal-collapse) | Cragjaw famine; Deep Alchemists reopen labs | steam-line-cartel, deep-alchemists; chronarch, warden, shaper |
| 795 | Silent Sea (event-silent-sea) | Tidesong stops; Lyris vanishes | brine-bond-syndicate, house-mereval; minstrel, gambit |
| 795 | Waking of the Monoliths (event-monoliths-waking) | All 7 hum; bog-dead march; campaign start | dawn-vigil, cult-of-forgotten-shadow; **all** |
| 795 | Marching Dead (event-bog-dead-march) | Bryngloom dead march toward Monoliths | revenant, inquisitor, plaguebringer |
| 795 | Shifting of the Spawning Gales (event-the-shifting-of-the-spawning-gales) | Myrathil spawning moves north | — |

> **Pulse record (REBIRTH_CYCLES):** 65 logged cycles, cycle 1 = Y12 (40%) … cycle 63 = Y226 (3%), cycle 64 = Y645 (1%), cycle 65 = Y660 (0%). Canon: ~12-yr cadence (range 8–20), 65 measurements 40%→0%.

### A.2 — FACTION ROSTER (factionStore.js, 49 entries)

| # | Faction (id) | Type | Region | Stated founding / era | Leader (npcId) | Members | Public goal (abbrev.) |
|---|---|---|---|---|---|---|---|
| 1 | House Thalreth (house-thalreth) | noble_house | frostwood-reach | Fog Compact Y5 | kaelen-thalreth | **4** | Rule Reach; ironwood trade |
| 2 | Scribe-Sentinels (scribe-sentinels) | guild | frostwood-reach | Y5 (Fog Compact) | caedren-thalreth | **2** | Preserve archives vs fog |
| 3 | House Skalvyr (house-skalvyr) | noble_house | nordhalla | Glacier Bargain Y7 | halvar-skalvyr | **3** | Rule fjords; geothermal sumps |
| 4 | Trueborn Briaran (trueborn-briaran) | tribal | frostwood-reach | (Viridane flight Y11) | thorn-speaker | **1** | Reject Fog Compact |
| 5 | Unlit Veil (unlit-veil) | secret_society | sundrift-vale | — | the-first-liar | **1** | Intelligence brokerage |
| 6 | House Ordavan (house-ordavan) | noble_house | sundrift-vale | Remaining Bargains Y12–50 | bayarmaa-ordavan | **2** | Rule Vale; herds |
| 7 | Dawn Vigil (dawn-vigil) | religious_order | sundale | Y311 (event) / “generations” | dawn-vigil-commander | 0 | Reassemble Monoliths (public) |
| 8 | Deep Alchemists (deep-alchemists) | guild | cragjaw-peaks | “~2000 yrs before Dimming” | deep-alchemist-prime | 0 | Alchemical transformation |
| 9 | Vat-Breakers’ Guild (vat-breakers-guild) | guild | cragjaw-peaks | Revolt Y40 | vat-breaker-foreman | 0 | Groven sovereignty; Ancestor-Spans |
| 10 | House Solvan (house-solvan) | noble_house | sundale | Binding Y3 | solvan-steward | 0 | Rule Sundale badlands |
| 11 | House Mereval (house-mereval) | noble_house | iceheart-sea | Remaining Bargains Y12–50 | mereval-admiral | 0 | Rule Iceheart; sea-lanes |
| 12 | House Tesshan (house-tesshan) | noble_house | cragjaw-peaks | Remaining Bargains Y12–50 | tesshan-lord | 0 | Rule Peaks; coal-iron |
| 13 | House Morrath (house-morrath) | noble_house | bryngloom-forest | substitute post-Breach | morrath-steward | 0 | Govern Bryngloom via Neth law |
| 14 | House Viridane (house-viridane) | noble_house | frostwood-reach | refused Y11 | thorn-speaker | 0 | Survive, remember, wait |
| 15 | Bloodhammer Line (bloodhammer-line) | military | sundale | Grum Y100 | hark-ash-hammer | 0 | Keep Forge of Grum lit |
| 16 | Ancestral Convergence (ancestral-convergence) | guild | nordhalla | Animist merge | sera-three-scars | 0 | Hold 3 Animist dialects |
| 17 | Canopy-Ledger (canopy-ledger) | guild | bryngloom-forest | Valerius / First Contract | vel-otharen | 0 | Arbitrate First Contract |
| 18 | Frozen Order of the Elk (frozen-order-of-the-elk) | religious_order | nordhalla | Cassia | skadi-glass-eye | 0 | Elk-entrail auguries |
| 19 | Frostmaw Conclave (frostmaw-conclave) | guild | cragjaw-peaks | Nesta | fex-vestara | 0 | Rebuild Chronarch engine |
| 20 | Congregation of the Silence (congregation-of-the-silence) | cult | sundrift-vale | Li Wei Y598 | mor-vereth | 0 | Obey the Silence |
| 21 | Merrowport House (merrowport-house) | guild | iceheart-sea | Jax/Lyra Y350 | merr-cael | 0 | Keep Gambit order solvent |
| 22 | Doom-Choir (doom-choir) | religious_order | nordhalla | Xyris/Malakor Y380 | malakor | 0 | Proclaim doom-arithmetic |
| 23 | Barbed Vow (barbed-vow) | military | bryngloom-forest | Orven/Elias Y380 | vrael-forty-seventh | 0 | Hunt Wyrd-corrupted |
| 24 | Lunar Communion (lunar-communion) | religious_order | frostwood-reach | Selene ~Y80 | bri-vessela | 0 | Transcribe Selene’s whispers |
| 25 | Briaran Groves (briaran-groves) | tribal | frostwood-reach | (Viridane) | bri-vessela | 0 | Guard moonlit groves |
| 26 | Covenant of the Scar (covenant-of-the-scar) | religious_order | sundale | Sera Solvan Y5 | sol-kaessen | 0 | Tend Martyr Vow |
| 27 | Tide-Choir (tide-choir) | guild | iceheart-sea | Lyris ~Y100 | mer-lyrisa | 0 | Hold tide-song |
| 28 | Cultivar (cultivar) | guild | bryngloom-forest | Vespera Y500 | vespera | 0 | Engineer successor disease-strain |
| 29 | Ashen Communion (ashen-communion) | cult | sundale | First Cabal Y12 | sol-vareths | 0 | Organize Pyrofiends |
| 30 | Twice-Born (twice-born) | religious_order | bryngloom-forest | Kora/Vesper Y550 | kor-vasseth | 0 | Stop marching dead |
| 31 | Form-Convergence (form-convergence) | guild | cragjaw-peaks | Veyra Y350 | veyra | 0 | Teach 6 Shaping Forms |
| 32 | The Aegis (aegis) | military | sundale | Damon Y3 | thrak-damos | 0 | Spellguard defense |
| 33 | Distillery (distillery) | guild | frostwood-reach | Varis Y380 | varis | 0 | Fog-venom defense |
| 34 | The Bound (the-bound) | military | cragjaw-peaks | Alaric Y70 | alaric | 0 | Chain-graft tradition |
| 35 | Silent Hunt (silent-hunt) | guild | frostwood-reach | Sylas Y10–30 | sylas | 0 | Apex trackers |
| 36 | Watcher in the Mist (watcher-in-the-mist) | entity | frostwood/bryngloom | pre-Keth-Amar | null | 0 | Maintain life/death boundary |
| 37 | Scribe-Cartel (scribe-cartel) | guild | frostwood-reach | Fog Compact Y5 | caedren-thalreth | 0 | Ink/parchment monopoly |
| 38 | Steam-Line Cartel (steam-line-cartel) | guild | cragjaw-peaks | 1st Thermal War | tesshan-lord | 0 | Geothermal pipeline monopoly |
| 39 | Mist-Sentinels (mist-sentinels) | military | frostwood-reach | Memory Wars | caedren-thalreth | 0 | Patrol Ironwood Palisade |
| 40 | Brine-Bond Syndicate (brine-bond-syndicate) | merchant | iceheart-sea | Y300 | mereval-admiral | 0 | Merrowport docking; Luck-Ledger |
| 41 | Drun Outcasts (drun-outcasts) | tribe | bryngloom-forest | Drun Severing Y380 | saren-vel | 0 | Survive outside First Contract |
| 42 | Cult of Forgotten Shadow (cult-of-forgotten-shadow) | cult | bryngloom-forest | “Y412” | mor-vereth | 0 | Hasten Keth-Amar intrusion |
| 43 | The Risen (the-risen) | religious_order | sundale | Y780+ | sol-kaessen | **1** | Tend Solbrand; old faith |
| 44 | The Sunderer (the-sunderers) | cult | sundale | Y780+ | sol-vareths | **1** | Extinguish Solbrand |
| 45 | The Scoured (the-scoured) | cult | sundale | Y780+ | ‘none’ | 0 | Seal Breach with shards |
| 46 | The Neth (neth) | noble_house ⚠ | bryngloom-forest | First Contract Y25 | morrath-steward | 0 | Keep First Contract / Registry |
| 47–49 | (house IDs continue: bloodhammer-line, ancestral-convergence, canopy-ledger already listed) | | | | | | |

**Member count:** 8 factions populated (Thalreth 4, Skalvyr 3, Scribe-Sentinels 2, Ordavan 2, Trueborn-Briaran 1, Unlit-Veil 1, the-risen 1, the-sunderers 1). **41 of 49 have empty `members: []`.**

### A.3 — SOCIAL CASTES that appear in lore.json (type `concept`) but have NO factionStore entry
the_forgotten, the_fredlose, the_deck_born, the_bilge_dwellers, the_mounted, the_unmounted, sovereign-ledger, the_deepening (event). These are regional castes/systems, not formal factions — flagged for awareness, not necessarily errors.

---

## B. INCONSISTENCY MAP

### B.1 — CRITICAL

| ID | Location | CANON says | LORE says | Notes |
|---|---|---|---|---|
| **HF-C1** | `lore.json:4362` (`sundered_monoliths`) | CANON §5/§8.2: Solvan’s Still-Heart is the **genuine heart-fragment** of Aex — “misidentified” only in that some mistake it for the False Monolith. The False Monolith is **Viridane’s hollow echo** (no body part). | “**Still-Heart — House Solvan. The heart. But this is the false decoy.** Solvan’s Monolith was deliberately misidentified; the true heart lies elsewhere, hidden even from the houses.” | Invents a 7th “true heart elsewhere,” directly inverts canon’s clarification, and mislabels the genuine Still-Heart as the decoy. (Confirms & carries forward Houses-audit HG-01 — still unfixed in lore.json.) |
| **HF-C2** | `timelineStore.js:752,771` (event-glacier-bargain, Y7) | CANON §2.2/§4 + `lore.json:706` (`the_warden`): Dark Bargains were **struck with Keth-Amar directly. Aethil had no part in them.** | “House Skalvyr **bargained with Aethil** to freeze the ice sheets… **Aethil accepted but decreed** that summer would never return.” narrative: “strikes the **Glacier Bargain with Aethil**.” | Re-casts the Warden/Aethil as the active bargainer who “accepts/decrees,” contradicting canon + lore.json’s own the_warden entry. Same class of error as Houses HG-07/COS-C2, now in the **timeline** (Skalvyr bargain). |
| **HF-C3** | `timelineStore.js:2582-2599` (event-cult-of-forgotten-shadow-founded) vs `timelineStore.js:1772-1801` (event-cult-founding) — **both Year 412** | CANON §7: Cult = “a Vigil splinter that went too far, openly worshipping Keth-Amar.” A single origin. | Two **duplicate events at the same year** give **two different founders**: (a) event-cult-founding = “desperate survivors… centuries later Dawn Vigil defectors merged in”; (b) event-cult-of-forgotten-shadow-founded = “**Natalie Seline, a rogue Neth pact-weaver**, founds the Cult.” | Plus 3 more origins elsewhere (see HF-C5). “Natalie Seline” is also a direct **Warcraft shadow-priest IP name** (LORE_STYLE_GUIDE §6.5B violation). Duplicate same-year events for one faction is a data-integrity error. |
| **HF-C4** | `factionStore.js:627-628` (dawn-vigil hiddenAgenda) + `lore.json:2097-2098` (`dawn_vigil`) | CANON §7: Vigil **publicly reassembles**; secretly **KNOWS** reassembly summons Keth-Amar and **believes they can BIND Keth-Amar** as Aex was bound (offensive). | factionStore: “They continue the expeditions **not for restoration, but to ensure no one else assembles them first**.” (defensive/preventive). lore.json identical reversal (COS-C4). | Motivation is **reversed** in both data stores vs canon. The Vigil is characterized as gatekeeping-defensive, not bind-the-predator-offensive. (Confirms COS-C4; now also pinned to factionStore.) |
| **HF-C5** | Cult of Forgotten Shadow — **5 mutually inconsistent origins** across sources | CANON §7: Vigil splinter, Keth-Amar-worshipping. | (1) `lore.json:4655` = Vreken exiles + heretical animists, reject Neth-Vreken Reincarnation Bargain, **Year 412**; (2) `lore.json:728` (keth_amar) = merger of Over-Shanty bog-cult + Dawn Vigil defectors; (3) `timelineStore event-cult-founding` = desperate survivors + later Vigil defectors; (4) `timelineStore event-cult-of-forgotten-shadow-founded` = Natalie Seline (Neth pact-weaver); (5) `factionStore:1461,1471` = organized merger of bog-cult + Vigil defectors; (6) canon = Vigil splinter worshipping Keth-Amar. | The single most inconsistently-described entity in the lore. Founder, composition, motive, and Keth-Amar relationship all differ. Needs ONE canonical origin. (Extends COS-C3 from 3→6 versions.) |

### B.2 — MAJOR

| ID | Location | Issue |
|---|---|---|
| **HF-M1** | `timelineStore.js:1979-1987` (event-last-rebirth) vs `timelineStore.js:296-299` (REBIRTH_CYCLES cycle 65) | **Pulse-numbering contradiction.** event-last-rebirth (Year 660, 0%) is titled/described as “The **fifty-fifth** pulse,” but REBIRTH_CYCLES explicitly maps **cycle 65 = Year 660 = 0%** (“The sixty-fifth pulse”). Year 660 is simultaneously the 55th and 65th pulse. event-augur-collapse further muddies with “65 pulses: 55 logged, 10 unlogged.” |
| **HF-M2** | `timelineStore.js:192-300` (REBIRTH_CYCLES) vs CANON §6 | **Pulse cadence model is broken.** Canon: ~12-year pulse spacing (range 8–20). The table packs **63 pulses into Y12→Y226 (~3.4 yrs/pulse)** then jumps c64=Y645, c65=Y660 (a **419-year gap** with one pulse). Both regimes are impossible under canon’s 8–20-year cadence. |
| **HF-M3** | `factionStore.js:673` (deep-alchemists lore) | **Timescale violation.** “Emerged as a distinct guild roughly **two thousand years before the Dimming**.” GM_WORLD_GUIDE:9 states legacy “2,000 years”/“thousands of years” mentions were corrected to the ~800-yr timeline; this one survives. Inconsistent with the post-Breach frame. |
| **HF-M4** | `timelineStore.js:3-34,115-150` (CHRONOLOGY_ERA_DISPLAY + calendar.eras) vs CANON §10 | **Non-canonical era system.** Canon = 3 eras (Before the Deepening / [Binding-Breach] / Age of the Dimming Y11→present). timelineStore uses **5 display eras**: “The Age Before Ages” (should be “Before the Deepening”), “The Deepening” (CANON: Deepening = Sol’s cycle **event**, NOT an era label — §10 explicitly flags “Age of the Deepening”), “The Deepening: The Breach”, “The Age of the Dimming: **Adaptation**” (Y14–719), and “The Age of the Dimming” (Y720+). The canonical **Age of the Dimming is Y11→present**, but timelineStore doesn’t start it until **Y720**, re-labeling Y11–719 as Breach/Adaptation. (Store-level form of v3 A-14.) |
| **HF-M5** | `factionStore.js:807` (house-morrath publicDescription) vs CANON §4 | **Morrath miscast as original Binding signatory.** “the **seventh noble family of the Binding Compact**, yet the one with the least surviving record… they had nothing left to trade.” Canon + timelineStore (event-viridane-flight, event-preservation-pact): Morrath was **elevated as a SUBSTITUTE 7th AFTER the Breach** (Viridane was the original 7th). Calling Morrath a Binding-Compact family contradicts both canon and the timeline. |
| **HF-M6** | `factionStore.js:718-719` (house-solvan hiddenAgenda) vs CANON §3 | **Invents a surviving Solvan heir.** “The current Steward believes **one of the original Solvarn heirs survived**: Keth-Amar was tricked or placated with a substitute.” Canon: 6 of 7 heirs consumed as vessel-keys (incl. Solvan’s); **only Viridane** refused/escaped. A surviving Solvan heir contradicts the Breach account. |
| **HF-M7** | `lore.json:4463-4478` + `lore.json:4204-4223` + `factionStore.js:1476-1547` vs CANON §7 | **Faith schism = 3 vs 4 factions.** CANON §7 names exactly **three**: Dawn Vigil / The Risen / The Scoured. The data adds a **fourth**, **The Sunderer** (`the_sunderers`), present in lore.json, factionStore, and timelineStore. Worse, `the_risen` lore claims “the largest of the **three** factions” and `the-sundale-civil-war` says “three faiths… three ways” — while **four** factions exist. Either canon must be amended to include Sunderer, or Sunderer must be folded into Scoured. (Confirms COS-M2; re-confirmed in all three category files.) |
| **HF-M8** | `timelineStore.js:2031` (event-skalyvr-silence narrative) vs `lore.json:4192` (the-silence-heat-heresy) | **Silence-Heat architect conflict.** lore.json names **Frigga Skalvyr** as the sole builder of the heat-engine. timelineStore event description says “**a Skalvyr scion of the younger generation**” (unnamed), and its narrative attributes it to “a secret faction within the Frozen Archive, **the Cult of Forgotten Shadow**” — but the Cult is Bryngloom-based, not Nordhalla. Three different attributions for one event. |
| **HF-M9** | `timelineStore.js:1387,1410` (event-mimir-purge: year 220 / dateDisplay “~90 BP”) | **Year/dateDisplay mismatch.** Year field = 220 (~580 BP at present=800), but `dateDisplay` = “**~90 BP**.” Off by ~490 years. The “~90 BP” matches GM_WORLD_GUIDE’s “Purge ninety years ago” claim — so the GM guide and the dateDisplay agree with each other but **contradict the event’s own year field (220)**. Either the purge is Y220 or Y~710; cannot be both. |
| **HF-M10** | `timelineStore.js` (multiple `dateDisplay` BP values) | **Systemic BP-conversion errors** (present ≈ 800): event-astril-first-vessels Y15 → “~600 BP” (should be ~785); event-first-contract Y25 → “~650 BP” (~775); event-vat-breakers-revolt Y40 → “~700 BP” (~760); event-silence-between-stars Y598/eraId=adaptation → “Year 598, **Dimming**” (wrong era; Dimming starts Y720); event-solbrand-failing Y780 → “~60 BP” (~20). Several events are internally inconsistent between `year`/`eraId` and `dateDisplay`. |
| **HF-M11** | `timelineStore.js:209,213` (event-twentieth-rebirth, Y240) + `factionStore.js` | **“Eight centuries” overuse drift.** Phrase appears ~12× across stores. Most are defensible (~800 yrs since Breach), but `deep-alchemists:656` “created the Groven **eight hundred years ago**” (Groven ~Y40 → ~760 yrs; rounds up acceptably) vs `deep-alchemists:673` “**two thousand years** before the Dimming” (HF-M3). Inconsistent eras of antiquity for the same faction. |
| **HF-M12** | `lore.json:620-634` (`the_deepening`) | **Event miscategorized.** Summary: “The **entombment** of a dying star whose rebirth cycle was severed by noble bargains.” Canon: The Deepening = **Sol’s vulnerability cycle** (the trance, pre-Year 3); the **Entombment = the Binding** (Year 3). The entry conflates the Deepening with the Binding/Entombment. |
| **HF-M13** | `lore.json:4294-4300` (`the_corruption_years`) | **Ambiguous/contradictory dating.** Summary: “Years 3-11 **after the Binding**.” If Binding = Y3, “3-11 after” ⇒ Y6–14, which would push the Breach to Y14 (canon: Y11). fullEntry is self-consistent (“held eight years… then it broke”), but the summary’s “after the Binding” double-counts and conflicts with the Breach=11 anchor. |
| **HF-M14** | `factionStore.js:985` (congregation-of-the-silence classAffinities) | **Class-ID casing inconsistency.** Uses `['false_prophet']` (snake_case) while every other faction uses `'falseProphet'` (camelCase): house-ordavan, house-morrath, cult-of-forgotten-shadow, event-silence-between-stars, etc. `getFactionsByClass('falseProphet')` will **silently miss** this faction. |
| **HF-M15** | `factionStore.js:1549-1568` (`neth`) | **Type miscategorization.** `type: 'noble_house'`. CANON §8: Neth are a **race** (dying scribe-clan that bargained with Morvane), not a noble house. They govern via the First Contract, not bloodline nobility. Distinct from the 7(+1) noble houses. |
| **HF-M16** | `timelineStore.js:2487-2504` (event-the-first-exorcists-rise, Y11) narrative | **Textual class anachronism.** Narrative states “Within months of the breach, the first **Exorcists** emerge… **Apexes**… **Deathcallers**… **Inquisitors**” all rising at Y11. Inquisitor founded ~Y380; Deathcaller (deprecated→Revenant) ~Y550. `classIds` is empty (so not tagged), but the prose asserts these classes exist at Y11. |

### B.3 — MINOR

| ID | Location | Issue |
|---|---|---|
| **HF-m1** | `factionStore.js:1534,1536` (the-scoured) | `leader.npcId: 'none'` and `headquarters: 'none'` use string “none” instead of `null` (cf. watcher-in-the-mist which uses `null`). Data-hygiene inconsistency. |
| **HF-m2** | `lore.json:4494-4508` (`the_scoured`) | Self-contradictory description: “if the Monoliths were ever **reassembled**… it would be Keth-Amar’s. So the Scoured **don’t want the Monoliths put back together**. They want to gather every Shard and **hammer it back into the original binding seal**.” Reassembling shards into the seal vs “not reassembling” reads as contradictory; needs clearer distinction between “reassemble the 7 standing stones” and “reforge the seal.” |
| **HF-m3** | `factionStore.js:1484,1509` | Two NPCs each lead **two** factions: sol-kaessen → the-risen + Covenant of the Scar; sol-vareths → the-sunderers + Ashen Communion. Functionally plausible but worth flagging as a recurring shared-leader pattern (the-risen led by a Martyr; Sunderer by a Pyrofiend — cross-class leadership of faith factions). |
| **HF-m4** | `timelineStore.js:233-239` (REBIRTH_CYCLES cycle 55, Y107, 21%) | Labeled “The last detectable pulse. Aex is exhausted. **The scream has stopped.**” — but cycles 56–65 (Y122–Y660) continue with declining-but-nonzero outputs and the scream “stops” again at cycle 65 (HF-M1). The “scream stopped” milestone is attached to two different pulses. |
| **HF-m5** | `timelineStore.js:2620-2637` (event-the-erasure-of-house-viridane, Y500) | Compresses the Viridane erasure into “**three centuries**” ending ~Y500. Canon presents erasure as beginning at the Breach (Y11) and ongoing (“centuries-long project”). dateDisplay “~300 BP” is correct (800−500), but the “three centuries” framing is narrower than canon’s “since the Breach.” |
| **HF-m6** | timelineStore founding events vs CANON §11 | **Augur founding conflict.** `event-false-spring-traditions` (Y2–50) states “Augur (Year ~2)” (Cassia at the Deepening). CANON §11 says “Warden / Augur ~Year 70.” timelineStore’s own `event-first-ebbing-traditions` does not re-list Augur. Either canon §11 or the timelineStore Augur date is wrong. |

### B.4 — TIMELINE classIds ANACHRONISMS (re-verification of v3 B-01..B-10 + NEW)

> Founding years used (from timelineStore’s own “traditions” events, which match CANON §11 except Augur): Augur ~Y2(timeline)/~Y70(canon); Spellguard ~Y3; Martyr ~Y5; Pyrofiend ~Y12; Apex ~Y10–30; Arcanoneer ~Y60; Warden ~Y70; Lunarch ~Y80; Minstrel ~Y100; Animist ~Y120–200; Chronarch ~Y310; Gambit ~Y350; Shaper ~Y350; Inquisitor ~Y380; Harbinger ~Y380; Toxicologist ~Y380; Plaguebringer ~Y500; Revenant ~Y550; False Prophet ~Y598.

**v3 re-verification (current line numbers — v3 line numbers are STALE, file has changed):**
| v3 ID | Status | Current evidence |
|---|---|---|
| B-01 (falseProphet, astril-schism Y250–300) | **RESOLVED** | event-astril-schism classIds now `['augur']` only — falseProphet removed. |
| B-02 (falseProphet, cult-founding Y412) | **CONFIRMED** | `timelineStore.js:1790-1793` classIds `['falseProphet','revenant']`. Gap 186 yrs (falseProphet) + 138 yrs (revenant). |
| B-03 (falseProphet, false-dawn-riots Y480) | **RESOLVED** | event-false-dawn-riots classIds now `['martyr','harbinger']` — falseProphet removed. |
| B-04 (revenant, keth-amar-breach Y11) | **RESOLVED** | event-keth-amar-breach classIds `['martyr','inquisitor','apex','lunarch']` — revenant removed (but inquisitor remains = B-07). |
| B-05 (harbinger, Y0/Y3–11/Y7/Y15) | **PARTIAL** | event-sol-deepening (Y0) harbinger CONFIRMED (`timelineStore.js:468-470`). Other early events cleaned. |
| B-06 (toxicologist, Y5) | **RESOLVED** | event-fog-compact (Y5) classIds now `['apex']` — toxicologist removed (apex now the anachronism, see NEW). |
| B-07 (inquisitor, Y11) | **CONFIRMED** | `timelineStore.js:581-586` classIds incl. `inquisitor`. Gap 369 yrs. |
| B-08 (gambit, Y12–50) | **CONFIRMED** | `timelineStore.js:829-833` event-remaining-bargains classIds `['animist','gambit','shaper']`. |
| B-09 (shaper, Y12–50) | **CONFIRMED** | same event as B-08. |
| B-10 (plaguebringer, Y400–450) | **CONFIRMED** | `timelineStore.js:1673-1676` event-vreken-overlit-epidemic classIds `['inquisitor','plaguebringer']`. Gap 50–100 yrs. |

**Summary of v3 B-series:** 6 of 10 CONFIRMED (B-02, B-05-partial, B-07, B-08, B-09, B-10); **4 of 10 RESOLVED** (B-01, B-03, B-04, B-06) — partial cleanup occurred, but the file remains the most-issue-dense.

**NEW classIds anachronisms found (beyond v3):**
| NEW ID | Event (year) | classIds offending | Founded | Gap |
|---|---|---|---|---|
| **HF-A1** | event-keth-amar-breach + event-viridane-flight (Y11) | `lunarch` | ~Y80 | ~69 yrs |
| **HF-A2** | event-emberspire-eruption (Y11) | `berserker` | ~Y100 | ~89 yrs |
| **HF-A3** | event-myrathil-spawning (Y11) | `minstrel` | ~Y100 | ~89 yrs |
| **HF-A4** | event-keth-amar-corruption (Y3) | `pyrofiend` | ~Y12 | ~9 yrs |
| **HF-A5** | event-fog-compact (Y5) | `apex` | ~Y10–30 | ~5–25 yrs |
| **HF-A6** | event-glacier-bargain + event-hunger-winter (Y7) | `berserker` | ~Y100 | ~93 yrs |
| **HF-A7** | event-remaining-bargains (Y12–50) | `animist` | ~Y120–200 | ~70–188 yrs |
| **HF-A8** | event-first-contract (Y25) | `arcanoneer` | ~Y60 | ~35 yrs |
| **HF-A9** | event-vat-breakers-revolt (Y40) | `warden` | ~Y70 | ~30 yrs |
| **HF-A10** | event-first-thermal-war (Y110) | `shaper` | ~Y350 | ~240 yrs |
| **HF-A11** | event-mimir-rupture (Y240) | `shaper` | ~Y350 | ~110 yrs |
| **HF-A12** | event-brook-emerge (Y150) | `gambit` | ~Y350 | ~200 yrs |
| **HF-A13** | event-brine-bond-syndicate (Y300) | `gambit` | ~Y350 | ~50 yrs |
| **HF-A14** | event-toll-wars (Y280–340) | `shaper` | ~Y350 | ~10–70 yrs |
| **HF-A15** | event-memory-wars (Y250–350) | `toxicologist`, `inquisitor` | ~Y380 | ~30+ yrs |
| **HF-A16** | event-bloodhammer-migration (Y80) | `berserker` | ~Y100 | ~20 yrs |

> **Note on intent:** Several of these tags are *thematically* defensible (e.g., event-first-thermal-war narrative explicitly says Torin’s Y110 act “would later become the foundation of the Shaper tradition”). But as `getEventsByClass()` filters, they are anachronistic. v3’s recommendation (document classIds as thematic relevance tags, OR fix them) stands; the file currently does **neither** consistently.

### B.5 — CROSS-REFERENCE: timelineStore vs lore.json (same event, different detail)

| Event | timelineStore says | lore.json says | Verdict |
|---|---|---|---|
| Silence-Heat Heresy | anonymous “Skalvyr scion” / Cult of Forgotten Shadow (Y720) | **Frigga Skalvyr** named architect | Conflict (HF-M8) |
| Cult founding (Y412) | two duplicate events, two founders (survivors collective / Natalie Seline) | single entry: Vreken-exile animists, “Year 412 of the Dimming” | Conflict (HF-C3/C5) |
| False Dawn Riots (Y480) | 40th window, no warming; Solvan Imperium collapses; Vigil militarizes | same | **Consistent** ✓ |
| War of Thousand Screams (Y300–320) | Nesta’s Chronarch engine; Dreadnaughts forged; Deep Alchemists sealed | Nesta’s stitch; Chronarch born; Deep Alchemists sealed | **Consistent** ✓ |
| Breach (Y11) | 6 heirs consumed, Viridane fled, 7 Monoliths | same | **Consistent** ✓ |
| Dawn Vigil founding | Y311, “three centuries after the Breach” | (not dated in lore.json) | timelineStore consistent w/ canon §11 ✓ |
| Still-Heart Monolith | (not detailed in timeline) | “false decoy, true heart elsewhere” | lore.json WRONG (HF-C1) |

### B.6 — Viridane-erasure consistency (per scope item h)

No timeline event references Viridane **openly in a way that contradicts the erasure premise.** All Viridane references occur in (a) the Breach/flight/erasure events themselves (canonical), (b) Briaran-lineage events, or (c) the hidden `house-viridane` factionStore entry (flagged as erased/hidden). The erasure premise is **respected** in the timeline. Only caveat: HF-m5 (the “three centuries” compression) and `event-the-erasure-of-house-viridane` dating it to Y500 rather than ongoing-since-Y11. **No critical erasure breach found.**

---

## C. FACTION / MISSING-CONTENT STATUS (re-verification of v3 D-02 / D-04 / D-05 / D-06)

### D-02 (v3: 5 factions referenced in lore but missing from factionStore) — **4 of 5 RESOLVED**
| Faction | v3 status | Current status |
|---|---|---|
| Scribe-Cartel | missing | **EXISTS** `factionStore.js:1344` + `lore.json:4242` ✓ |
| Brine-Bond Syndicate | missing | **EXISTS** `factionStore.js:1410` + `lore.json:4261` ✓ |
| Cult of Forgotten Shadow | missing | **EXISTS** `factionStore.js:1454` + `lore.json:4647` ✓ (but see HF-C5 — 6 conflicting origins) |
| The Risen / Sunderer / Scoured | missing | **ALL EXIST** `factionStore.js:1476/1501/1526` + `lore.json:4463/4479/4494` ✓ (but Sunderer is the non-canonical 4th faction — HF-M7) |
| Church of the Holy Light | missing | **STILL MISSING.** The Y13 Greymark founding is now called the **“Solbrand Order”** (`timelineStore.js:931,957`; `npcStore.js:21`). Neither “Church of the Holy Light” nor “Solbrand Order” has a factionStore entry. The “Church of the Holy Light” name appears deprecated, but the founding order has **no faction representation** either way. |

### D-04 (v3: 24 of 34 factions have zero members) — **WORSE: now 41 of 49**
Only **8** factions have populated `members` arrays: house-thalreth (4), house-skalvyr (3), scribe-sentinels (2), house-ordavan (2), trueborn-briaran (1), unlit-veil (1), the-risen (1), the-sunderers (1). The remaining **41** have `members: []`. The faction count grew (34→49) but populated-member ratio shrank (10/34 ≈ 29% → 8/49 ≈ 16%). `getNpcFactions()` and `getFactionMembersAtLocation()` return nothing for 84% of factions.

### D-05 (v3: House Viridane missing from factionStore) — **RESOLVED**
`house-viridane` **EXISTS** at `factionStore.js:829`, correctly flagged as erased/hidden (publicGoal “Survive. Remember. Wait.”, relationship to trueborn-briaran = `successor`). The entry respects the erasure premise.

### D-06 (v3: cult-of-forgotten-shadow has no loreDictionary entry) — **PARTIAL**
The cult **HAS a `lore.json` entry** (`lore.json:4647`, `cult_of_forgotten_shadow`, with alias `cult-of-forgotten-shadow`) — so the LoreLink/auto-link gap in **lore.json is closed**. However, v3 D-06 referred specifically to `loreDictionary.js` (a separate `.js` dictionary file, outside this audit’s category scope). The cult’s `lore.json` entry itself is internally inconsistent with 5 other origins (HF-C5). **Recommend re-checking `loreDictionary.js` separately.**

### Additional faction-completeness gaps (new)
- **D-NEW-1:** The **Solbrand Order / Church of the Holy Light** (founded Y13, referenced in timeline + npcStore) has **no factionStore entry** at all. A foundational Sundale/Greymark religious body is unrepresented in the faction system.
- **D-NEW-2:** Six social castes exist as `lore.json` concepts (`the_forgotten`, `the_fredlose`, `the_deck_born`, `the_bilge_dwellers`, `the_mounted`, `the_unmounted`) with rich regional detail but **no factionStore representation**. Acceptable if treated as castes-within-factions rather than factions; flag for awareness.
- **D-NEW-3:** **No `silent_seventh` cross-link in factionStore.** `lore.json:1818` has `silent_seventh` (Viridane synonym); `factionStore` briaran-groves references “the Silent Seventh’s true name” in prose but there is no faction entry or alias wiring the term.

---

## D. SUMMARY METRICS

| Metric | Count |
|---|---|
| CRITICAL | 5 (HF-C1..C5) |
| MAJOR | 16 (HF-M1..M16) |
| MINOR | 6 (HF-m1..m6) |
| v3 B-series anachronisms CONFIRMED | 6 of 10 |
| v3 B-series anachronisms RESOLVED | 4 of 10 |
| NEW classIds anachronisms (HF-A1..A16) | 16 |
| Factions audited | 49 (8 with members, 41 empty) |
| v3 D-02 resolved | 4 of 5 |
| v3 D-04 | worsened (24/34 → 41/49 empty) |
| v3 D-05 | resolved |
| v3 D-06 | lore.json side resolved; loreDictionary.js side unverified |

### Top-priority fixes (recommended order)
1. **HF-C1** — Restore Solvan Still-Heart as genuine heart-fragment in `lore.json:4362` (the False Monolith is Viridane’s). Carries forward HG-01; highest-impact single-line fix.
2. **HF-C4** — Restore Dawn Vigil’s canonical offensive motivation (leadership WANTS to assemble, believing they can bind Keth-Amar) in `factionStore.js:627` + `lore.json:2097`.
3. **HF-C3 / HF-C5** — Pick ONE Cult of Forgotten Shadow origin; delete the duplicate Year-412 event; rename/remove “Natalie Seline” (Warcraft IP).
4. **HF-C2** — Re-attribute the Glacier Bargain to Keth-Amar in `timelineStore.js:752,771`.
5. **HF-M1 / HF-M2** — Fix the pulse model: reconcile Year-660 = 65th pulse (not 55th); bring REBIRTH_CYCLES cadence into canon’s 8–20-year range.
6. **HF-M5 / HF-M6** — Correct House Morrath (substitute, not original signatory) and House Solvan (no surviving heir).
7. **HF-M7** — Canonically decide whether Sunderer is a 4th faith faction; align the “three factions” claims.
8. **HF-M4** — Align the timelineStore era system to canon’s 3 eras (or formally document the 5-era display convention).
9. **D-04** — Populate `members` for the 41 empty factions (or document them as memberless systems).
10. **HF-A1..A16** + confirmed B-02/05/07/08/09/10 — Either fix or explicitly document timeline `classIds` as thematic relevance tags.

---

*End of History, Factions & Timeline audit.*
