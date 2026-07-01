# Mythrill Lore Deepening & Frontend UI Pass — Master Prompt

> **Purpose:** A franchise-founding deepening pass. The integration *scaffold* already exists (Phases A–G + NPC anchoring + gazetteer founders). This prompt's job is to (1) ruthlessly consistency-check that scaffold, (2) inject *deep* lore so every region, class, subrace, and background feels native-grown rather than assigned, and (3) wire all the new lore data into the frontend so players and GMs actually *see* it.
>
> **Tone of the auditor:** Ruthless, specific, unsparing. Cite file + line. Do not congratulate. Every finding must name the file, the field, the contradiction, and the fix.

---

## 0. Role & Mission

You are the **Lore Architect** for Mythrill, a TTRPG/VTT world being built as a franchise foundation. You have access to the full `D:/VTT` codebase. Your mission has three sequential parts:

1. **CONSISTENCY AUDIT** — verify the existing integration layer agrees with itself across every field, every file.
2. **DEEP LORE INJECTION** — add the historical depth, native-weaving, and overarching meta-narrative that turns a mapped world into a *living* one.
3. **FRONTEND UI PASS** — surface every lore field in the React app so it reaches players and GMs.

Do not start Part 2 until Part 1 is resolved or its findings are catalogued. Do not start Part 3 until Part 2's data is in place. Each part produces a report before execution.

---

## 1. What Already Exists — DO NOT REDO, BUILD ON IT

A prior engagement created an integration scaffold. **Your job is to deepen and verify it, not replace it.** Learn these fields before touching anything:

### Class data files (`vtt-react/src/data/classes/*Data.js`) — each class now carries:
- `restrictions` — `{allowedSubraces, hardBlocks, narrativeUnlock, justification}`
- `subraceVariants` — per-allowed-subrace: `{subraceName, title, reframe, signatureAbility, currentCrisisAngle, signatureQuote}`
- `livingOrder` — `{orderName, founder{name,status,note}, currentLeader{name,title,characterization}, headquarters{name,locationId}, crisisConnection}`
- `worldFriction` — array of `{region, location?, status, consequence, workaround?}`
- `overview` — `{title, subtitle, originStory, currentCrisis, meaningfulTradeoffs, classSpecificLocations, ...}` (pre-existing; the canonical class lore)

### `vtt-react/src/data/loreDictionary.js` — each entry carries:
- `region` (primary) + `secondaryRegions` (array, on multi-region classes)
- `summary`, `fullEntry`, `relatedTerms`
- Class-entries for the 20 active classes; `concept` entries for the 8 merged classes now carry `transition: {aftermath, legacySite, survivorNote}`
- 12 dual-origin founder entries (Veyra, Sylvanus, Torin, Xyris, Malakor, Orven, Jax, Lyra, Alaric, Kael, Nyssa, Theron) plus pre-existing founders (Grum, Sera, Valerius, Kora, Vesper, Elias, Damon, Scathrach, Vespera, Cassia, etc.)

### `vtt-react/src/data/backgroundData.js` — each of 22 backgrounds carries:
- `restrictions`, then `classHooks` (array of `{classId, bridge}`) and `tensionPairings` (array of `{classId, tension}`), then the pre-existing `name/description/feature/statModifiers`

### `vtt-react/src/data/races/*.js` (10 files) — each non-human race carries:
- `diasporaVariation` (prose) alongside `integrationNotes.classCompatibility`, `culturalBackground`, `variantDiversity`

### `vtt-react/src/data/rulesData.js` — the 7 regional gazetteers each end with:
- a **"Native Traditions & Founders"** paragraph naming native + co-founded traditions and their founders

### `vtt-react/src/store/npcStore.js` — 20 class-order leader NPCs (`hark-ash-hammer`, `sera-three-scars`, etc.), each with `hooks`

### `vtt-react/src/data/deepLocationData.js` — 11 deep locations; the Frozen Archive and Starfall Vale `npcs:` arrays reference their seated leaders

**Non-breaking rule:** Never alter an existing field's *shape*. Add to it, deepen its content, or add sibling fields. The only consumers to respect: `LoreTooltip.jsx` (reads `entry.region` for border color), `loreAutoLinker.js` (reads `id`/`term` only), `npcStore` selectors, `deepLocationData` helpers, `backgroundData` helpers.

---

## PART 1 — CONSISTENCY AUDIT ACROSS THE INTEGRATION LAYER

**Question: Does the integration scaffold agree with itself?** Cross-check every field against every other. Produce findings in the format below before fixing.

### 1.1 Restriction ↔ subraceVariants parity
For every class: the keys of `subraceVariants` MUST exactly equal `restrictions.allowedSubraces`. No missing variants, no orphan variants. Flag every mismatch with file + class + the discrepant subrace id.

### 1.2 livingOrder.headquarters.locationId ↔ deepLocationData/zoneData existence
Every `headquarters.locationId` must resolve to a real zone or deep-location id. Flag dangling HQ references.

### 1.3 livingOrder.currentLeader ↔ npcStore existence
Every `currentLeader` named in a class file should have a matching NPC entry in `npcStore.js` (the 20 leaders do — verify the names match exactly and the `locationIds` on the NPC point back at the HQ).

### 1.4 classHooks.classId ↔ class restrictions
Every background `classHooks` entry was checked legal at creation — re-verify: for each hook, at least one of the background's `allowedSubraces` can actually take that class (per the class's `allowedSubraces`). Flag any bridge to an impossible combo.

### 1.5 worldFriction.region ↔ real regions
Every `worldFriction.region`/`location` must be a real region id or zone id. Flag invented regions (note: a few use intentional generalizations like `'everywhere-else'`, `'human-settlements'` — these are acceptable; flag only truly undefined ones).

### 1.6 loreDictionary.secondaryRegions ↔ the class's actual dual origin
Cross-check each `secondaryRegions` array against the class's `overview.originStory` and `livingOrder.founder` — the secondary region must be the one the co-founder actually hails from. Flag mismatches.

### 1.7 relatedTerms bidirectionality
For the new founder entries and reworked class entries: if A lists B in `relatedTerms`, B should list A (one-way links are missed connections). Catalogue every asymmetric pair.

### 1.8 NPC ↔ faction ↔ location triad
Each of the 20 leader NPCs has `factionIds` and `locationIds`. Verify those faction ids exist in `factionStore.js` and the location ids exist in zone/deep data. NOTE: several `factionIds` (e.g. `'bloodhammer-line'`, `'canopy-ledger'`) are the *order names* and may not exist as factions yet — flag these as a gap to resolve in Part 2 (create the order-factions or document them as class-internal).

### 1.9 The merged-class aftermath ↔ zones/NPCs
Phase F added `transition.legacySite` to 8 concept entries. Verify those legacy sites (Old Dance-Floor, Old Foundry, Cleansing Chapels, Covenbane Stronghold, Calcifying Vats, Veil-Speaker Shrine, Sol's Anvil Mesa, etc.) are referenced somewhere in `zoneData.js`/`deepLocationData.js` — or flag them as sites to add.

### 1.10 The pre-existing dangling reference
`loreDictionary.js` `rime_born` references `frostcirque` in `relatedTerms`, but no `frostcirque` entry exists. Resolve per audit Section 8.1 (merge Frostcirque + The Still Crag) — either create the entry or rewire the reference.

**Output for Part 1:** a numbered findings list (BREACH #, file:line, contradiction, fix) and a priority table. Fix all P0 (canonical contradictions) before Part 2.

---

## PART 2 — DEEP LORE INJECTION

**Question: Does the world feel like it *grew* here, or was *assigned* to here?** Inject the historical depth and connective tissue that makes Mythrill a franchise-grade setting. Three sub-missions.

### 2.1 Per-Region Historical Injections (the "Deep Strata")

Each of the 7 regions must acquire a **layered history** — not just "what's happening now" (the bargains, the crises) but the *strata beneath*: pre-Deepening civilizations, the Deepening itself, the long Dimming, and the present fracture. The history must grow from the region's **assigned real-world cultural influences** (these are the flavor roots; deepen them, don't replace them):

| Region | Primary real-world influences | Deepen toward |
|---|---|---|
| **Frostwood Reach** | Germanic / Celtic forest-folklore | Medieval German archive-cities, Celtic fae pacts, the bureaucracy of memory |
| **Nordhalla** | Norse / Alpine | Saga-culture, glacier-preserved ancestor-veneration, the economics of cold |
| **Sundale** | Mesoamerican / forge-cults | Volcanic theocracy, solar-sacrifice cosmology, the caldera-city |
| **Iceheart Sea** | Celtic / maritime | Whaling-culture, sea-law, the ship-as-polity |
| **Cragjaw Peaks** | Andean (Inca) administration + Japanese yokai | Khipu-records, vertical Mit'a labor, yokai-haunted passes |
| **Sundrift Vale** | Mongolian steppe | Horde-logistics, throat-song cartography, the herding-calendar |
| **Bryngloom Forest** | Slavic + Hindu death-folklore | Bog-sainthood, reincarnation-contract law, the mycelial ancestor |

For each region, add to `rulesData.js` regional gazetteer a **"Deep History & Strata"** section (sibling to the existing "Native Traditions & Founders") covering:
- **The Pre-Deepening layer** — who lived there before Sol was buried; what ruins/records persist; how the pre-Deepening culture echoes in the current one.
- **The Deepening & Bargain layer** — the specific local experience of Sol's death and the bargain; a named local trauma-site; the first generation's reaction.
- **The Long Dimming (the 800-year middle)** — at least 2 named historical events per region with dates (Year X of the Dimming) and consequences still visible today. These are the franchise's backlog of adventure-hooks and should cross-reference each other across regions (e.g., a Nordhalla famine that drove migration to Sundale).
- **The Present Fracture** — how the deep history caused the current crisis.

**Standard:** every named historical event must (a) have a date in the Dimming calendar, (b) leave a visible present-day scar (a ruin, a faction, a holiday, a superstition, a place-name), and (c) connect causally to at least one other region's history. Isolated events are failures.

### 2.2 Native-Weaving Standard (classes, subraces, backgrounds grow from the soil)

The integration layer *says* where each tradition is from. Part 2 must make it *feel inevitable* that the tradition arose there. For every class and background, verify and deepen:

- **Ecological inevitability** — the tradition's core mechanic must be a rational response to the region's specific geography/climate/threat. (Berserker Blood-Heat ↔ Sundale's forge-heat + Nordhalla's starvation; Augur entrail-reading ↔ Nordhalla's glacier-preservation of the dead; etc.) Where the link is weak, strengthen it in `overview.originStory` and the class's `loreDictionary` `fullEntry`.
- **Cultural inevitability** — the tradition must express the region's real-world influence. (Cragjaw Chronarch time-stitching should feel Andean-khipu + yokai-suspension; Sundrift False Prophet should feel steppe-shamanism weaponized.) Where a class feels generically-fantasy, re-voice it.
- **Founder embodiment** — each founder (`livingOrder.founder`) must be a *product* of their region's deep history, not a visitor who invented something. Deepen founder backstories in their `loreDictionary` entries to tie them to the Deep Strata events from 2.1.
- **Subrace-native logic** — for each `subraceVariants` entry, the variant's `reframe` must explain why *this subrace specifically* produces *this class* in *this region*. Flag any variant that reads as "X but with a different coat of paint."

### 2.3 Overarching World Meta-Narrative (the connective tissue)

Create a single canonical **"World Timeline & Causal Web"** (add as a new top-level rules subcategory in `rulesData.js`, e.g. `id: 'world-timeline'`) that:

- Lists the **10–15 pivotal events** of the 800-year Dimming in chronological order, each naming every region it touched and the causal consequence. (The Deepening, the Binding, the Breach, the seven regional bargains, the Solvan Imperium's rise & fall, the Vat-Breakers' revolt, the Silent Seventh erasure, the founding of each major tradition, the present crises.)
- Draws the **causal links**: which event caused which. A GM reading this should understand why Sundale's present is the way it is *because* of a chain that starts at the Deepening and runs through Nordhalla and the Iceheart.
- Defines the **through-line**: the single sentence that describes what Mythrill's history is *about* (proposal: "a world that chose survival at a price it is still paying, run by the descendants of the people who signed the bill"). Every region, class, and faction should be expressible as a facet of this through-line.

**Standard:** the meta-narrative must make the world *small enough to hold in one head and large enough to lose a campaign in*. If a player can't state the through-line after one session, the meta-narrative has failed.

### 2.4 Fill the flagged gaps from Part 1
- Create `frostcirque` resolution (or rewire).
- Create the order-factions in `factionStore.js` for any `factionIds` the leader NPCs reference that don't exist (or document them as class-internal).
- Add the Phase F `transition.legacySite` locations to `zoneData.js`/`deepLocationData.js` where flagged.

---

## PART 3 — THE FRONTEND UI PASS

**Question: Can a player or GM actually *see* any of this?** Currently none of the integration fields render. Wire them in. The data is clean and query-ready.

### 3.1 Character Creation — subrace-aware class & background presentation
- When a subrace is selected, the class list should show that subrace's `subraceVariants[subraceId].title` and a one-line `reframe` excerpt (not the full block) so picking a class feels subrace-specific.
- Background selection should surface `classHooks` as "commonly leads to" chips and `tensionPairings` as a soft warning (e.g., a muted "Tension with: Berserker" tag) — narrative guidance, not a hard block.
- Respect `restrictions` (already partially in place) — ensure the UI enforces/flags `hardBlocks` and shows `narrativeUnlock` as a "GM-approval" path.

### 3.2 Lore Tooltip enrichment (`LoreTooltip.jsx`)
- For class entries, render `secondaryRegions` as "Also practiced in: …" under the primary region.
- For class entries, add a collapsible "Reception in the world" section rendering `worldFriction` (status badges: Banned / Celebrated / Persecuted / Distrusted, each with its consequence).
- For concept entries (merged classes), render the `transition` block (Aftermath / Legacy Site / Surviving Purists).
- Verify `region` border-color logic still works after any structural change.

### 3.3 NPC browser / location NPCs
- Surface the 20 leader NPCs: at a deep location, list its `npcs` (and any NPC whose `locationIds` include it). Each NPC card shows title, appearance excerpt, and one hook.
- The class-detail view should show the `livingOrder.currentLeader` as a clickable NPC link.

### 3.4 Race pages
- Render `diasporaVariation` under the race's main description as a "In the wider world" section.

### 3.5 GM World Guide view
- A GM-facing surface that renders the new `world-timeline` (from 2.3) and each region's "Deep History & Strata" (from 2.1) as a readable chronicle — this is the franchise bible view.

**Standard:** every field created in Phases A–G + Part 2 must be *visible* in at least one component by the end of Part 3. Invisible data is a failed deliverable.

---

## Quality Bar & Output Format

### For Part 1 (audit):
```
BREACH #n: [description]
- File:field: [where]
- Contradiction: [what disagrees with what]
- Severity: P0 (canonical) / P1 (integration) / P2 (polish)
- Fix: [specific]
```

### For Part 2 (deepening):
Each injection must cite where it was added (file + field) and name at least one cross-region causal link it strengthens. No orphan content. No event without a date and a present-day scar.

### For Part 3 (UI):
Each wired field must cite the component file and the field it reads. Run the app (or static-analyze) to confirm no render errors. Respect existing component conventions (Zustand stores, Bootstrap classes, `LoreLink` usage).

### Overall:
- **No regressions.** Run `node --check` on every touched file. Re-verify all `termId`/`classId`/`locationId` cross-references resolve.
- **No new dangling references.** Every `relatedTerms` target, every `classId`, every `locationId` must exist.
- **Voice consistency.** All new prose in the solemn, specific Mythrill voice. No cliché ("ancient evil," "mysterious," "long-forgotten"). Show, don't tell.

---

## Source Files (read order)

**Primary:** `vtt-react/src/data/rulesData.js`, `vtt-react/src/data/loreDictionary.js`
**Class layer:** `vtt-react/src/data/classes/*Data.js` (20 files), `vtt-react/src/data/classes/index.js`
**Race layer:** `vtt-react/src/data/races/*.js` (10 files)
**Background layer:** `vtt-react/src/data/backgroundData.js`
**Location/NPC layer:** `vtt-react/src/data/deepLocationData.js`, `vtt-react/src/data/zoneData.js`, `vtt-react/src/store/npcStore.js`, `vtt-react/src/store/factionStore.js`
**Frontend:** `vtt-react/src/components/common/LoreTooltip.jsx`, `vtt-react/src/utils/loreAutoLinker.js`, the character-creation components, the race/class/background detail views
**Reference docs:** `docs/LORE_QUALITY_AUDIT_PROMPT.md`, `docs/LORE_AUDIT_FINDINGS.md`, `docs/GM_WORLD_GUIDE.md`, `docs/RACE_BUILDING_SESSION_PROMPT.md`

---

## Final Instruction

The value of this pass is proportional to its *connectedness*. A new historical event that touches only one region is decoration. A new event that ripples through three regions' economies, two classes' crises, and one faction's goals is *lore*. Make Mythrill a world where nothing is decoration — where every name, every date, every tradition is load-bearing for something else. This is the foundation of a franchise. Build it to hold weight.
