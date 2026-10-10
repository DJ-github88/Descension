# MYTHRILL — GAME & ORIGINAL-IP REVIEW

*A design and IP assessment of the current Descension repository, written as an experienced TTRPG designer, systems designer, and franchise editor. Read-only: no production code or content was modified in producing this review.*

> **Central test for this document:**
> *DON'T SIMULATE THE RPG CATEGORY. SIMULATE THE FANTASY THAT PRODUCED THE CATEGORY.*
> A rule is valuable here when it plays like the fiction it comes from, and suspect when it plays like a generic RPG with Mythrill nouns pasted on.

---

## 0. SCOPE, METHOD, AND STATUS LABELS

### What was reviewed

Current material was preferred over historical audits, per repository instructions. The primary evidence set:

- **Peoples:** `vtt-react/src/data/races/*.js` (10 race files, 25 heritages, shared and subrace traits), `raceData.js`, `raceMechanics.js`, illustration captions and art directives, `docs/subrace_lore_compendium/*`, `docs/MASTER_SUBRACE_LOCATIONS_AND_FIGURES.md`.
- **Classes:** all 21 class data files, `classResources.js`, `classResourceContracts.js`, `classResourceBanks.js`, `classHeritageRegistry.js`, `heritageEdgeContract.js`, `heritageEdgeAdapter.js`, `heritageCapabilityConsumers.js`, class pages rendered live from `public/data/rules.json`.
- **Progression:** `talentTreeData.js`, `talentTrees/*` (`talentSystem.mjs`, per-class trees), `characterSlices/progressionSlice.js`, `utils/experienceUtils.js`, point-buy in `utils/pointBuySystem.js`.
- **Backgrounds:** `backgroundData.js` (51 entries in two layers), `backgroundAbilities.js`, `equipment/backgroundEquipment.js`, selection UI in the creation wizard.
- **Character creation:** `components/character-creation-wizard/**` (5 steps), `CharacterWizardContext.js`, `utils/characterClassAccess.js`.
- **Inventory & equipment:** `store/inventoryStore.js`, `utils/characterUtils.js` (grid + carrying capacity + encumbrance), `utils/itemShapeUtils.js`, `data/containerShapePresets.js`, `utils/containerShapeUtils.js`, `components/windows/InventoryWindow.jsx`, `components/item-generation/ContainerWindow.jsx`, `store/containerStore.js`, `store/characterSlices/statsSlice.js`.
- **Combat & magic:** `public/data/rules.json` (rules v2.2.1), `data/statusEffects.js`, `conditionsData.js`, `spellEffects.js`, `effectProcessingService.js`, `diceUtils.js`, `data/spells/**`, `spellcrafting-wizard/**`.
- **World:** `docs/CORE_LORE_FRAMEWORK.md` (declared current foundations), `docs/GM_WORLD_GUIDE.md`, `SEVEN_CONTINENTS_MASTER_REFERENCE.md`, `docs/CREATURE_COMPENDIUM.md`, `public/data/lore.json` (436 entities), `public/data/creatures.json` (193 creatures), `store/deityStore.js`, `store/factionStore.js`, `store/timelineStore.js`, `store/worldStore.js`.
- **Live runtime spot checks:** the local app at `localhost:3000` (rules codex, class codex, bestiary pages) for rendered player-facing text.

### Status vocabulary used throughout

| Label | Meaning |
|---|---|
| **SHIPPED** | Wired into a live consumer path and observable in play. |
| **PARTIAL** | Exists and is consumed, but with unfinished branches, stubs, or declared `pending` behavior. |
| **CONFIG/DATA ONLY** | Authored data with no confirming consumer or runtime effect found. |
| **DORMANT** | Present in repository, not reachable by current UI/engine paths. |
| **LEGACY** | Superseded content kept for compatibility or archive value. |
| **UNKNOWN** | Insufficient evidence to classify; flagged rather than guessed. |

Where a claim depends on runtime behavior rather than reading, it is marked "runtime-checked." No numerical balance claims are made beyond code inspection; this is not a playtest report.

---

## 1. EXECUTIVE ASSESSMENT

Mythrill is not a reskinned fantasy heartbreaker. It is an original setting with a genuinely authored metaphysical premise — a world whose sun is a living, conscious child hidden in the core, whose warmth is an economy, and whose peoples are largely defined by what they traded away to survive the cold. Its best material is culture-first: mechanics usually arrive as the consequence of a people's history rather than as a class package.

The strongest complete systems are:

1. **Peoples with authored biology and culture** (Morgh/Ithran, Arch/Broken Mimir, Clean/Marked Vreken, Viridian/Oken Florae, and the Myrathil three) — these pass the "remove the proper noun" test.
2. **Class resource identities** (Minstrel note-cadences, Arcanoneer sphere grammar, Gambit Fortune/Debt, Martyr Devotion, Pyrofiend Veil latch, Shaper Flux/Toll) — authored, distinct, and mostly expressed in real gameplay objects.
3. **Inventory as a spatial, physical mini-game** — the single most "tabletop-feeling" system in the project.
4. **Regional realpolitik** (Sovereign Ledger, Press-Warrants, the Great Registry, the Knotted Decree) — institutions that embody the setting's themes of memory, debt, and warmth.

The weakest complete systems are:

1. **The rules text lags the code.** Multiple player-facing pages describe different versions of mechanics than the engine implements (inventory grid orientation, talent point rate, class resource ranges). See §11.
2. **Convergent class resource architecture.** Nearly every class is a rising-risk meter with a catastrophic cap and a vent. The fiction differs; the decision shape repeats. See §4.22.
3. **Human identity.** The five human cultures are well-written, but "short-lived people who burn bright in a dying world" is a familiar frame, and several D&D residues (resurrection spells priced in gp, hit dice, levels 4/8/12/16/20) sit closer to the surface here than anywhere else. See §3.10 and §11.
4. **Contradictory living canon.** `CORE_LORE_FRAMEWORK.md` declares one truth while `lore.json`, several class files, and some art briefs still assert the superseded version (hidden seventh shard/cleansing key, the summit devouring, Vreken arrival dates, class founder identity drift). These are live, player-facing contradictions, not merely archival ones. See §11.

**Verdict:** The franchise identity is real, strong, and legible. The game identity is real but less finished, mostly because the rules layer is mid-migration and the class design has a shared skeleton that shows through the skin. Both problems are fixable without touching the world.

---

## 2. CHARACTER CREATION

### What exists

A five-step wizard (`components/character-creation-wizard`):

1. **Hero Draft** — name, gender, alignment, portrait/icon with transformations, heritage (race → subrace), calling (class), class acquisition (`ClassAcquisitionEditor`), body states, background, point-buy stats, starting spells, all on one screen with slide-out drawers (`Step1CoreDraft.jsx`).
2. **Skills & Languages** (`Step7SkillsLanguages.jsx`).
3. **Starting Equipment** purchase (`Step10EquipmentSelection.jsx`).
4. **Lore & Details** — ten freeform fields (backstory, traits, ideals, bonds, flaws, appearance, goals, fears, allies, enemies, organizations, notes).
5. **Summary** (`Step9CharacterSummary.jsx`).

Validation runs heritage-aware class/background access through `utils/characterClassAccess.js` and `classHeritageRegistry.getClassHeritageAccess()`, distinguishing normal-tradition access, qualified-exception access, and incompatible body states.

### Evaluation

**Onboarding — good, with one cliff.** The wizard teaches setting through choices: heritage files carry `quickFacts`, `culturalBackground`, and `classCompatibility`; class pages render "Tradition," "Resource System," and "Specializations" tabs; LoreLink auto-linking turns proper nouns into codex jumps. A new player learns what Mythrill is by being asked who they are in it. That is exactly right for this project.

The cliff is step 1: race + subrace + class + acquisition method + body state + background + 15-point gritty point-buy + starting spells + portrait is a lot before the player has ever rolled a die. Choice order is lore-first, which suits identity formation, but it front-loads the heaviest mechanical screen and hides the lighter, fun steps (skills, equipment, lore) behind it. Splitting "who" (heritage) from "how" (class/method/stats) into two smaller steps would cost almost nothing narratively and remove a real drop-off risk.

**Cognitive load — unevenly distributed.** Point-buy starting at base 5 with a 15-point pool, a premium cost curve (11→19 points), and racial/background modifiers applied elsewhere is not self-explanatory. The class acquisition editor and body-state toggles are novel and good, but they add vocabulary at the exact moment new players are also parsing heritage. A "recommended for new players" preset per class/heritage already partially exists in the getting-started rules ("Recommended First Character"); surface it inside the wizard.

**Meaningful choice — very high.** Heritage/class access is genuinely restrictive (25 heritages × native class rosters), classes have native traditions rather than blanket availability, and incompatible states (e.g., severed First Contract bodies vs. Arcanoneer's contract method, `classHeritageRegistry.js` incompatibleStates) are enforced. This is a meaningful choice system, not cosmetic ancestry.

**World exposition — excellent.** `backgroundData.js` descriptions are miniature setting essays with named institutions, prices, and consequences. `backgroundAbilities.js` and `BACKGROUND_ROLEPLAYING_HOOKS` give each background three direct questions, which is unusually good table-ready material.

**Mechanical comprehension — improvable.** The derived-stat chain (racial modifiers → equipment → buffs → encumbrance → derived stats) is correct but opaque. The review surface should expose the causal chain (e.g., "your pack is in the encumbered zone, so Agility dropped"), because the inventory system's decisions are invisible at creation time.

**Identity formation — the strongest part.** Birthright questions in race files (Mimir, Myrathil samples read) and roleplay hooks in backgrounds make character creation a narrative act. This is the correct design priority and it should be protected.

**Does creating a character naturally teach someone what Mythrill is?** Mostly yes — but the *rules* onboarding (`getting-started/dnd-comparison`, "Transitioning from D&D 5e") teaches Mythrill as a D&D conversion rather than as its own thing. That page is useful for converting existing tables and should stay, but it should not be the first lens. Consider an in-world primer ("What a character in Mythrill knows about warmth, debt, and memory") before the mechanical comparison.

---

## 3. PEOPLES — THE 10 RACES, 25 HERITAGES

Format: identity summary, then the requested dimensions collapsed to the essential verdict, then the proper-noun test. Status notes only where implementation diverges from prose.

### 3.1 Groven — "The Living Bridges of Cragjaw Peaks" (`races/groven.js`)

**Identity.** Two stone-hewn lineages descended from alchemically reshaped Thrumm broodlings. Morgh: short, colossal, cracked granite quarry-masons who bear weight in silence. Ithran: tall, slate-blue, wind-polished bridge-engineers, toll-keepers, and negotiators. Their dead calcify into the Ancestor-Spans — bridges literally grown from willing Groven dead.

- **Visual:** unmistakable. Granite ogre silhouettes strictly separated from orc iconography ("no tusks"); slate-blue aerodynamic Ithran. Art locks are explicit and enforced.
- **Biological:** manufactured people; Vat-Sleep (monthly ancestral dream) and Still-Claiming (death into stone) are biology as culture.
- **Cultural:** a civilization suspended in vertical space; Morgh body-answers vs Ithran claim-answers to "what does a freed tool become."
- **Worldview:** the mountain takes back what it gave; tolls are acknowledgment of the dead you walk on, not greed.
- **Internal variation:** two lineages + rare Murmur-Bloods; ideological split, not racial hierarchy.
- **Environment:** the blizzard is the hiding bargain; the spans are the only route. Landscape and people are one system.
- **Other peoples:** Fexric friction (creators/refusers), Merryn sea-disdain, Tessen dependence, Skald grudging respect.
- **Foothold:** stone folk and bridge engineers are familiar; the dead-as-infrastructure is not.
- **Mechanical expression:** Stone-Scale Plating with a stacking fire-crack drawback, Bridge-Warden's Wall (summoned wall, rooted when broken), Ithran span-reach plus wyrd damage for standing still. Mechanics come from the fiction.
- **Overlap:** none significant with standard dwarves; the closest is dwarven resilience, but the costs invert it.

**Proper-noun test:** yes. Andean rope-bridges, bone architecture, and "the dead hold up the living" — recognizable without "Groven."

### 3.2 Nethien — "The Silver-Touched" (`races/neth.js`)

**Identity.** A scribe people who survived extinction by presenting Morvane (a threshold/memory power) with a legal argument for their preservation — the First Contract. Three states: **Nethien** (pact-bound, preserved, no food/sleep, obsidian eyes), **Veldun** (over-drew the Well; spirit-conduits and probability-readers bound to obligation), **Withered** (severed signatures; mortal, aging, legally nonexistent). Their immortality is an ongoing contract, and their society is literally contract-mediated (birth-contracts, cohabitation agreements, the Great Registry).

- **Visual:** paper-white, unbreathing, still; Veldun slate/fog operators; Withered gaunt unpreserved. Excellent trio.
- **Biological:** preservation resists change — the flaw is amber: perfectly preserved elders incapable of surprise.
- **Cultural:** the contract as the sincerest form of love; the Unraveling (deliberate breach) as freedom at the cost of self.
- **Worldview:** what is written is real; what is remembered is alive.
- **Internal variation:** three distinct well-histories and legal states, plus the Fraying track (0–10) and Archive-Tether distance rules.
- **Environment:** anchored to physical First Contract copies; distance causes Fading (3/7/14 days). Geography is law.
- **Other peoples:** Vreken resentment (same god, different luck), Mimir ledger friction, everyone else as clients or marks.
- **Foothold:** elven scribes are familiar; immortal-accountants whose document literally keeps them alive is authored.
- **Mechanical expression:** no sleep, trance, Archive-Tether, Contractual Lock, Clause powers, Null-Strike for Withered. Specific and thematically loaded.
- **Overlap:** partial with "elven" aesthetics (Vreken share the antecedent); the legal-metaphysics is unique.

**Proper-noun test:** yes — this is "contract lawyers in a world where law is a physical force." Nothing else in the space plays that.

### 3.3 Vreken — "The Gloom-Lit" (`races/vreken.js`)

**Identity.** Formerly elegant elven monks of Morvane who were poisoned when their god was wounded; fungal networks threaded their bodies, curling their ears, lighting their eyes. **Clean** carry stable Deep-Glow (dimmer, immune to the hush); **Marked** carry Ghost-Mycelium (brilliant perception, addiction risk, silver-white eyes). Their dead glow in inverted cathedrals; wealth is ancestral light.

- **Visual:** compact, curled horn-ears, veil-masked lower faces, lantern eyes, reversed spires. Very strong, very specific.
- **Biological:** symbiosis as injury; the Over-Lit as addiction-as-apocalypse.
- **Cultural:** the crypt and the spore; Veil-Speakers sing the dead; Inquisitors kill their own.
- **Worldview:** decay is continuation; a wound carried by a god cannot be renounced.
- **Internal variation:** two strains plus the fallen (Over-Lit, not a third bloodline).
- **Environment:** the Bryngloom is both sanctuary and poison; distance dims the bond.
- **Other peoples:** cold-functional with Nethien, silent kinship with Solari, unsettling doctors to everyone else.
- **Foothold:** goblin-like is an explicit descriptor; lantern-eyes and fungal monks are original enough to carry it.
- **Mechanical expression:** Spore-Sense, Lantern-Eyes stealth penalty, Hush Vulnerability, crypt healing. The costs are real.
- **Overlap:** low; the "disease = people" framing is distinctive.

**Proper-noun test:** yes — "a people whose god's wound infected them, who keep their dead lit" is unmistakable.

### 3.4 Florae — "The Tree-Born House Viridane" (`races/florae.js`)

**Identity.** Descendants of House Viridane, the seventh house that refused the sacrifice and was transformed and erased by the distinct native Unnamed Green. **Viridian** bear contract-thorns and the Unwritten Word (truth-sense, no direct lies); **Oken** are tree-born, planted as sprouts, arms of oak/birch/willow, and can pass in cities under high-collared coats with the blank unstitched crest patch.

- **Visual:** carved wooden faces, amber eyes, branch-arms, blank crest patch, copper water-flask, Wild vs Shorn grooming. One of the most printable visual identities in the book.
- **Biological:** water-dependent timber bodies; fire as terror and temporary weapon; regrowth.
- **Cultural:** oral history over writing; the refusal kept in flesh.
- **Worldview:** growth and refusal; the erased house that lives.
- **Internal variation:** thorn-blood vs timber-blood; Wild/Shorn is lifestyle, not heritage.
- **Environment:** grove sanctuaries vs Ledgered towns; fog erodes them.
- **Other peoples:** Viridane vs Thalreth (fog as spiritual surrender), Hunters/poachers, Mimir grove proximity.
- **Foothold:** treant-kin is familiar; the unstitched crest patch and the refusal are not.
- **Mechanical expression:** bough unarmed strikes, Hearth-Water healing, fire momentum, Unwritten Word, Deep-Root Anchor.
- **Overlap:** medium with druids; the political-exile identity differentiates.

**Proper-noun test:** yes — "a house that chose to be trees rather than die, and wears the absence of its own crest" is authored.

### 3.5 Myrathil — "Free-Born Children of the Sea" (`races/myrathil.js`)

**Identity.** Mareth's foam-spawned people, who exist before the Star-Fall; young emerge anatomically complete and grow under chosen care. **Shoreling** ambassadors, **Deepling** abyssal listeners (Ulvir's "the bottom is speaking"), **Riverling** inland map-makers. Family is chosen, not blood; time is measured in tides.

- **Visual:** bioluminescent vein-lines that change with mood and pressure; huge ocean eyes; the Riverling anatomical lock (explicitly *not* lizardfolk) is disciplined.
- **Biological:** amphibious, lunar-tied, rest requires submersion by heritage.
- **Cultural:** Tide-Sing, First Drift, Tide-Share; directness over inheritance; no concept of bloodline.
- **Worldview:** the sea asks nothing and keeps everything; freedom is non-ownership.
- **Internal variation:** three spawning ecologies with different rest rules and social roles.
- **Environment:** spawning beaches, drift-villages, trenches, rivers; land is a place of damming and theft.
- **Other peoples:** exoticized/collected by humans; wary of everyone; the Minstrel connection is water-born.
- **Foothold:** merfolk/aquatic humanoids are familiar; foam-spawned collectives with no inheritance is not.
- **Mechanical expression:** Dehydration, Born of Spindrift rest rules, subrace environmental auras (Abyssal Adaptation, Brackish Heritage).
- **Overlap:** low. Their origin is biologically odd in a good way.

**Proper-noun test:** yes — "a sea that made people out of foam, who have no bloodline and measure time in tides."

### 3.6 Mimir — "The Faces of Sereth" (`races/mimir.js`)

**Identity.** A maker-god's rejected creations. **Arch Mimir** keep inherited heartwood/storm-glass masks as archives and identity anchors; **Broken Mimir** reject compulsory masking, live unmasked with demon facial scarring and personal golden Motes. Sereth died of its own impossible standards; the shame is condemned — the fallible scripture that says "the final shape held" is the strongest single dramatic premise in the race files.

- **Visual:** masks of primal beasts for Arch; theatrical scarred faces with heavy ear jewelry for Broken. The Broken Mimir art lock (jest, puppetry, carnivals) is genuinely unusual.
- **Biological:** genuine shape-shifters; masks anchor identity, not faces.
- **Cultural:** Scriptural recursion; Lineage Witness vs Cliff-Duel dispute customs; mask-gifting and dream inheritance.
- **Worldview:** inherited shame versus recovered selfhood — the race's story is an argument.
- **Internal variation:** masked archive-keepers vs unmasked Mote-anchored; plus Fractured/Woven/Feral historical castes in older text.
- **Environment:** canopy holds, mist, palisades; the fog erodes identity.
- **Other peoples:** Thalren tolerance (fixed identity reassures them), Hunters, gate role in society.
- **Foothold:** masked mystics are familiar; "a species whose identity is literally portable, and whose scripture may absolve them" is authored.
- **Mechanical expression:** mask-dependent benefits, Mote-based self-memory, fog rents.
- **Overlap:** low.

**Proper-noun test:** yes — "god made them, couldn't love them, died of it; now they argue about whether the rejection was real."

### 3.7 Astril — "The Fire-Carried" (`races/astril.js`)

**Identity.** Refugees from Lumia, a world whose star Keth Amar devoured; by fleeing, they led the predator to Mythrill. **Stargazer** preserve stellar memory in pale skin and constellation lines; **Brutish** (Silath) carry void-crystal fractures and suppressed histories. Their nightly rite calls Selunis, the dormant moon-egg sister.

- **Visual:** reptilian slit pupils, luminous eyes, organic markings — but note the Brutish trait text still says "pupil-less silver eyes," contradicting the shared description (see §11).
- **Biological:** inverted vision (see at night, blind in day), Lumia's Echo environmental resilience.
- **Cultural:** guilt as structure; every ritual is penance; the calling is an interpretation, not a fact.
- **Worldview:** the people who doomed this world and stayed to try to save it.
- **Internal variation:** scholars vs martial enclaves; the canon explicitly refuses inherited moral guilt for children.
- **Environment:** starless steppe; Synod Hold; ritual courtyards.
- **Other peoples:** Ordan trade/coexistence, general secrecy; the predator's fate ties them to every faction.
- **Foothold:** star-refugees and penitents is familiar; "the universe's predator, and you are the smell of its last meal" is authored.
- **Mechanical expression:** Inverted Vision, Luminous Eyes, Lumia's Echo, Selunis's Quest; names are mechanically clean.

**Proper-noun test:** yes — "refugees who are also the beacon that led extinction here."

### 3.8 Solari — "Devoted cave-dwelling keepers of Sol's last ember" (`races/solari.js`)

**Identity.** Human Solvarn antecedents altered by celestial infusion; deep-vault **Hollow-Solari** (stillness, heat-sight, tending the Sol's Breath) and surface **Waste-Solari** (ash-ranging, forge-clans). They do not have a monopoly on Sol; they are the tending institution's people, and the institution is lying about the flame's decline.

- **Visual:** ash-dusted brown-beige skin, black eyes, ash-tinted eye-wraps with clan marks, deliberate stillness. One of the strongest physical cultures in the book.
- **Biological:** heat-adapted, cold-vulnerable, daylight-pained; furnace-lungs.
- **Cultural:** Marking-Rite, Vault-Breath, Solstice Vigil, forge-trials instead of duels.
- **Worldview:** patience as virtue; the ember is the altar; the lie about its decline is the crisis.
- **Internal variation:** Hollow (stillness, deep) vs Waste (movement, surface) with distinct trait packages.
- **Environment:** the Vault, the Shyr, ashlands; their ecology is industrial-sacred.
- **Other peoples:** Fexric trade, Vreken kinship of warmth, Dawn Vigil exploitation, Pyrofiend schism.
- **Foothold:** fire-keepers are familiar; "religious industrialists whose god is a thermal gradient they misinterpret" is authored.
- **Mechanical expression:** Vault-Breath, Still-Claiming-adjacent stillness rules, ash lungs, forge-marks; the former "korr/thrask" ids now surface as Hollow/Waste. Display-name aliasing is functioning (runtime-checked in code paths).
- **Overlap:** low.

**Proper-noun test:** yes — "sitting perfectly still for six hours, listening to a fire that is not answering."

### 3.9 Humans — "The Burning Wick" (`races/human.js`)

**Identity.** Five regional cultures on the shortest lifespan in the world, all descended from peoples whose noble lines made bargains: **Thalren** (archivist fog), **Skald** (endurance/Nordhalla), **Tessen** (sealed keeps), **Merryn** (tattoo-contract sailors), **Ordan** (steppe throat-singers). Their unifying myth is refusal: the wick is short, so burn.

- **Visual:** each culture is distinct and well-illustrated (ink-stained; frost-scarred; pale keep-dwellers; salt-stained; wind-marked).
- **Biological:** Mortal Frailty (−10% HP) and Short Straw (+25% aging/time damage) are mechanically honest for the fiction, though "every human bloodline carries the dark bargain" is in tension with canon that says ordinary people did not all capitulate.
- **Cultural:** the strongest material is not the unifying theme but the specifics: chained journals, glacier-tombs of standing ancestors, tattoo-contracts as legal documents, throat-sung ancestor maps.
- **Worldview:** concentrated at the culture level; the umbrella "sixty good years" speech repeats across several files almost verbatim and starts to feel like copy rather than conviction.
- **Internal variation:** five cultures with 4 traits each — good mechanical breadth.
- **Environment:** each culture is defined by its bad geography, which is correct.
- **Other peoples:** humans are the connective tissue by economics; good.
- **Foothold:** very high — this is the intended entry point.
- **Mechanical expression:** reliable, region-shaped, less authored than other races.
- **Overlap:** the umbrella identity overlaps "humans are the ambitious short-lived ones," a very common frame. The *cultures* do not.

**Proper-noun test:** the cultures pass; the umbrella does not. "Burning wick" would be at home in many settings. The fix is to lean harder on the specific cultures and stop repeating the umbrella speech. Note the internal rule tension: `The Short Straw` says the bargain "touched your blood," while `CORE_LORE_FRAMEWORK.md` says most ordinary mortals never made such a bargain. Reconcile by re-scoping the trait to lineage-marked humans or to "the cold's tax on all humans" rather than an inherited cosmic guilt.

### 3.10 Fexric — "The Cyber-Graft Guilds" (`races/fexrick.js`)

**Identity.** Ancient native engineers of Cragjaw who built their holdfasts around Vurath's borrowed power. **Clockwork** (guild-bound, hereditary knowledge, oral maintenance songs) and **Caustic** (clan-free scavengers, homebrew chemistry). Their beards are resumes; the oldest machines are failing; the songs have lost syllables. They created the Groven and lost them.

- **Visual:** stocky, green or mine-dark skin, elaborate braided tool-beards, one visible mechanical graft. Distinctive.
- **Biological:** grafts conduct storm/wyrd; still-air sense; not born of any bargain.
- **Cultural:** maintenance songs as scripture, guild secrecy as economy, apprenticeship at five, the dead interred in the machines they tended.
- **Worldview:** custodians of a golden age they can no longer build, too proud to admit it.
- **Internal variation:** the Guild Wall is the class divide; each variant is well-developed.
- **Environment:** sealed holdfasts, sumps, gear-fairs; architecture as equipment.
- **Other peoples:** Groven as living shame, Sumpborn as denied people, diaspora clockworkers everywhere.
- **Foothold:** gnome/dwarf engineers are maximally familiar; the failing-song premise and beard-resume are not.
- **Mechanical expression:** Still-Air Sense, Mechanical Interference, guild/caustic traits.
- **Overlap:** the highest of any people with existing fantasy (dwarves + gnomes + steampunk). The authored parts are the *decay* and *guilt*, not the craft.

**Proper-noun test:** partially. Without "Fexric," I would read a very polished gnome-engineer culture with an original tragedy. That is acceptable — familiarity is not failure — but it is the one people most in need of a differentiator beyond craft. The strongest existing differentiator is the oral-song library that is dying: lean into "their holy book is a maintenance manual with missing verses."

---

## 4. BACKGROUNDS

### What exists

Two layers, 51 entries total in `backgroundData.js`:

- **"Calling" backgrounds (17):** region-and-heritage-scoped identities such as Pilgrim (Emberspire), Courier (the Shyr), Scribe (Frostwood Ledgers), Noble Scion, Scholar (Synod), Veteran (Bloodhammer), Negotiator (Atropolis), Storyteller (Nordhalla), Smith, Survivor (the hush), Mountaineer, Sailor, Smuggler, Urchin (Over-Shanty), Relic Hunter, Ranger (Viridane groves), Guardian (Mimir mask-warden).
- **"Profession/lineage" backgrounds (34):** e.g., Machinist, Herder, Astronomer, Navigator, Scout, Delver, Trader, Sentry, Builder, Clerk, Broker, Archivist, Privateer, Nameless, Crypt-Keeper, Zenith Cartographer, Crater Vanguard, Clockwork Horologist, Vitriol Prospector, Peat-Grave Tender, Petrified Timber-Mason, Scripture-Aerie Herald, Quiet-Traded Scavenger, Trench-Listener, Salt-Hinge Envoy, Cataract River-Scout, Vault-Tender, Ash-Dune Skimmer, Sanctuary Conservator, Null-Salt Hunter, Steppe Wind-Singer, Glacier Harpooner, Canopy Bloom-Weaver, Briar-Root Sentinel.

Each background can carry: region/subrace restrictions, `narrativeUnlock`, class hooks, tension pairings, subrace flavor lines, skills, tools, languages, equipment, currency, a feature, stat modifiers, flavor text, roleplay hooks, and (separately, in `backgroundAbilities.js`) two abilities.

### Evaluation

- **Identity:** very strong. "You ran the Basalt Shyr" and "you kept the identity-ledgers" are lived-in premises, not archetype labels.
- **World integration:** the best in the project. Backgrounds are the primary vector by which institutions (the Cartel, the Board, the Registry, the Vigil) become personal.
- **Roleplaying hooks:** three direct questions per background is genuinely table-ready.
- **Mechanical consequence:** features range from flavorful access (Ledger-Bound Identity) to true abilities (Tattoo-Contract, Hunter's Reversal). The class-hook / tension-pairing metadata is smart design guidance, but it is metadata — it is not currently forced or surfaced as a build path in the wizard beyond display.
- **Character differentiation:** high, but uneven. The profession layer gives near one-to-one heritage coverage, which is excellent for representation; however, many profession backgrounds are "region flavor + one utility feature," so two players with different backgrounds may not feel mechanically different.
- **Does it teach the setting?** Yes — better than any other single system.

**Concerns.**
1. The two layers overlap conceptually (Calling vs Profession) and there appears to be no in-UI explanation of why both exist. Treat it as "where you're from / what you did" and say so.
2. Several later backgrounds are species-crossed in ways the lore forbids (e.g., `peatTender` is a Morgh Groven tending Bryngloom peat, `petrifiedMason` is an Ithran Groven petrifying in a way more consistent with Florae, `canopyWeaver` is a Viridian canopy-dweller despite Veridian settlements being described as bastion/citadel architecture). These are small but they read as generated content that skipped a canon pass.
3. `subraceFlavor` maps frequently include heritages not in `allowedSubraces` (e.g., flaok for other races), which is fine as flavor but may confuse validation/warnings.

---

## 5. CLASSES

All 21 base classes confirmed in `data/classes/index.js` (plus three Deepling-compatibility aliases for Myrathil heritage). Every class has: restrictions, an authored subrace-reframe set, a living order with founder/leader/crisis, world friction, a resource contract, specializations, and (mostly) three talent trees. Class access is registry-driven (`classHeritageRegistry.js`), and the heritage-edge layer contracts one bounded advantage + one paired cost per native class/heritage pair.

### 5.1 Classification key

| Class | Core fantasy | Primary loop | Resource model | Identity | Foothold | Classification |
|---|---|---|---|---|---|---|
| **Arcanoneer** | Elemental grammarian | Roll 4d8, combine spheres by recipe/cantrip | Spheres 0–12 bank + mana; chaos/backlash | Authored interface traditions (legal, engineered, salvage, stellar) | Wizard with dice-crafting | **DISTINCTIVE** |
| **Minstrel** | Conductor of resonant patterns | Build I–VII notes, resolve cadences | Note bank (5/pitch, 35 cap), decay, silence lockdown | Music theory as actual spell recipes; stolen voice | Bard | **DISTINCTIVE** (but see dual identity below) |
| **Gambit** | Probability architect | Generate/spend Fortune; override rolls with cards | Fortune 0–7 + Debt 0–13; bankruptcy/collapse | Wager as discipline; House as creditor-god | Rogue/luck | **DISTINCTIVE** |
| **Martyr** | Witness who takes wounds | Absorb/intercept damage, convert to Devotion tiers | Cumulative damage thresholds 0/10/20/40/60/80/100, spendable levels | Aex's protective love as a martial discipline | Paladin/cleric | **DISTINCTIVE** |
| **Warden** | Penitent jailer | Chain-tether a priority target, build/cash Tension | Tension 0–10 + 15 ft tether rules | Voluntarily chained to never re-imprison | Fighter/controller | **DISTINCTIVE** |
| **Chronarch** | Accidental time-anchor | Bank Shards, manipulate durations/positions | Shards 0–10 + Strain 0–10, anomaly table | Temporal friction as a body condition | Time mage | **DISTINCTIVE** |
| **Pyrofiend** | Damned conduit | Ascend the nine Rings, vent before the Debt Call | Veil 0–9 with latched 3-turn death call | Scathrach as creditor, not patron | Warlock/pyromancer | **DISTINCTIVE** |
| **Shaper** | Body as weapon | Shift six Forms, build Flux, manage Toll | Flux 0–20 + Body Toll 0–10 | Reclaiming the vat: self-sculpt as freedom | Druid/monk | **DISTINCTIVE** |
| **Lunarch** | Host of a lunar parasite | Auto-rotating phases, build/wane power | Four-phase clock (3 rounds each), memory costs | Phase downside as identity (New/Full/etc.) | Moon druid | **DISTINCTIVE** |
| **Augur** | Visceral haruspex | Harvest d20 parity, spend omens reactively | Benediction/Malediction 0–10 each | Combat becomes a die-economy of its own | Diviner | **DISTINCTIVE** |
| **False Prophet** | Manufactured faith | Link ally/enemy pain, harvest Madness | Madness 0–20, +1 damage/point, convulsion at cap | The Silence as absence-theology | Enchanter/warlock | **DISTINCTIVE** |
| **Apex** | Pack predator | Companion + glaive coordination, Mark quarry | Marks 0–5, pack-outcome-only generation | Solo hits give nothing; the pack is the class | Ranger/beastmaster | **SOLID** |
| **Animist** | Ancestral conduit | Totems + runes + curses build Resonance | Resonance 0–20, Erosion at 15+ | Three fused traditions; totemic terraform | Shaman | **SOLID** (overlap risk) |
| **Berserker** | Hunger Pact survivor | Take/relay damage, push Rage tiers | Rage 0–100, healing lockout, Burnout at 100 | Ancestral starvation as physiological memory | Barbarian | **SOLID** |
| **Crusader** | Shard-starlight vanguard | Hold line, build Fervor, smite | Fervor 0–100, Harmonic Stance at 50 | Living relic-armor tradition | Paladin | **SOLID** |
| **Inquisitor** | Occult arbiter | Nullify/counterspell, cold-iron binding | Authority 0–8, decays without supernatural contact | Legal authority over the supernatural | Paladin/anti-mage | **SOLID** |
| **Revenant** | Death-mage warden | Spend HP for power, harvest souls into a phylactery | Toll 0–20 volatility + Phylactery 0–50 | Death as contract; resurrection as resource | Necromancer | **SOLID** |
| **Plaguebringer** | Symbiotic disease gardener | Plant seeds, cultivate stages, harvest | Virulence 0–100, fire purge weakness | The body as garden; keep yourself sick to stay alive | Druid/warlock | **SOLID** |
| **Spellguard** | Living spell-absorber | Intercept magic, fill AEP, vent before meltdown | AEP 0–100 with radiation and physical fragility | Anti-magic tank whose weakness is the mundane | Anti-mage tank | **SOLID** |
| **Harbinger** | Doom arithmetician | Plant ticking prophecies; spike Mayhem | Mayhem 0–100, Wild Surge at cap | Entropy as a computation with a pressure limit | Sorcerer | **SOLID** |
| **Toxicologist** | Prep-based poison surgeon | Pre-trap, coat, bleed vials to craft counter-agents | Vials + Contraption Parts (rest-limited) | The only prep-first alchemist: the plan comes before the fight | Alchemist/rogue | **SOLID** |

(No class landed in UNDEREXPLORED, OVERLAPPING, or UNCLEAR as a whole. Those labels applied to *subsystems*, listed below.)

### 5.2 What the classes do right

1. **The resource is the class.** In the best cases the resource bar is not a mana variant; it is a statement about the character: the Minstrel literally holds notes; the Gambit holds debt; the Martyr holds pinned levels of pain; the Pyrofiend holds rings of corruption with a latched death call. This is textbook "mechanic is the fantasy."
2. **Paired costs are real.** Stone scales crack in fire, notes decay, Fortune hurts to spend, healing locks out at high Rage, essence is volatile above six Toll. The project is not afraid of genuine drawbacks, which is rare and correct for its themes.
3. **Native heritage traditions.** 21 classes × a tight native roster produces classes that belong to peoples rather than to a generic adventurer economy. The Deepling compatibility classes are explicitly aliases, not new classes.
4. **Founder/crisis writing.** Living orders with current leaders and active crises (Merr-Cael, Fex-Vestara, Sol-Kaessen, Alaric, Mer-Lyrisa) give GMs usable present-tense material, not just backstory.
5. **Subrace reframes.** The same class reads differently per heritage (Vault-Witness vs Ash-Witness vs Vault-Sculpted vs Span-Keeper), which is one of the strongest IP-bearing structures in the repository.

### 5.3 The systemic weakness: the "thermometer"

List every resource in one column: Veil, Rage, Shards/Strain, Mayhem, Fortune/Debt, Devotion, Flux/Toll, Phases, AEP, Resonance/Erosion, Madness, Virulence, Toll/Phylactery, Notes, Spheres.

Almost all are: **(a) build a rising number; (b) gain escalating power with escalating personal risk; (c) at the cap, a bespoke catastrophe; (d) spend or manage to vent.** Pyrofiend's latched death call, Berserker's burnout, Chronarch's anomaly table, Harbinger's wild surge, Gambit's collapse, Animist's erosion, Spellguard's meltdown, False Prophet's convulsion, Shaper's unraveling — these are the same game shape with different skins and different cap events.

That shape is thematically coherent with Mythrill (warmth, debt, thresholds, prices), so it is not wrong. But when every class answers "what is the tension?" with "my meter is too high," classes start to feel like reskins of one another despite excellent prose. The classes that escape the pattern are the memorable ones: Minstrel (recipe economy), Arcanoneer (hand-building from rolled elements), Gambit (two-resource bargaining), Apex (geometry of pack coordination), Toxicologist (pre-fight resource planning).

**Recommendation:** keep the meter classes, but deliberately diversify the *decision structure* of the next pass — classes that trade resources between allies, classes that choose between mutually exclusive forms, classes whose resource is spatial or social rather than numeric. The written fictions are already different; the player-facing decisions should be too.

### 5.4 Specific identity problems

- **Minstrel has two competing identities inside one file.** The tradition tabs and subrace reframes say: maritime acoustic engineering, the Tide-Choir, Merryn/Myrathil storm-songs, a stolen voice. The headline description says: "a dimensional composer… captures the resonance of unraveling realities," instruments "crafted from bone and grief," music as "cosmic mutilation." One is a powerful authored class about the sea and sound; the other is a generic dark-fantasy bardocalypse. Both can coexist only if the cosmic language is reframed as in-world hyperbole of the same tradition. As written, the player meets two different classes on the same page. **This is the single highest-value class identity fix in the project.**
- **Human class spread still reads as D&D.** Humans natively produce Inquisitor/Toxicologist/Warden/Spellguard (Thalren), Berserker/Martyr/Augur/Harbinger (Skald), Revenant/Chronarch (Tessen), Gambit/Minstrel (Merryn), Animist/False Prophet/Apex (Ordan) — that is a good culture-first spread. But the *umbrella* flavor text for human subraces leaks generic fantasy: "the most physically variable race," "no claws, no fangs." Cut any sentence that explains why humans are interesting for being unremarkable.
- **Tessen cover four classes natively (Revenant, Chronarch, Spellguard, Warden) plus Harbinger** — the sealed-keep culture is doing a lot of explanatory work. Keep an eye on whether the keeps' social identity is actually about death-avoidance and time (it plausibly is), or whether classes were assigned to fill a quota.
- **Berserker** is the most convention-named class and the one whose core loop (hit things, take damage, output scales) is closest to its category ancestor. The Hunger Pact recontextualizes it completely; the *name* does not. This may be acceptable (foothold matters), but it is where a renaming pass would buy the most identity per unit of risk.
- **Harbinger vs Chronarch vs Pyrofiend** all traffic in "entropy is breaking me as I wield it." They are differentiated (prophecy bombs vs. rewrite vs. fire debt), but they are the class cluster most vulnerable to the thermometer critique.

### 5.5 Class evaluation summary

DISTINCTIVE: Arcanoneer, Minstrel (after reconciliation), Gambit, Martyr, Warden, Chronarch, Pyrofiend, Shaper, Lunarch, Augur, False Prophet.
SOLID: Apex, Animist, Berserker, Crusader, Inquisitor, Revenant, Plaguebringer, Spellguard, Harbinger, Toxicologist.
No class is UNDEREXPLORED, OVERLAPPING, or UNCLEAR in execution. The classification risk for all SOLID entries is not quality; it is adjacency to familiar class fantasies (ranger, barbarian, paladin, necromancer, anti-mage, alchemist) combined with shared resource shape.

---

## 6. TALENTS & PROGRESSION

### What exists

- **Talent trees:** 3 per class, 7 tiers, `talentSystem.mjs` defines a coherent WoW-Classic-like economy: level cap 10, 5 talent points per level (50 total), each tree holds exactly 50 investable points, tier N unlocks at (N−1)×5 points in-tree, tier 7 at 30. Ranks are hand-tuned (`rankUpgrades` spread over the prior rank), and talents convert into actual spellbook spells (`convertTalentSpellToLibrarySpell`). `TalentTreeContent.jsx` enforces tier gates, prerequisite DAGs, refund restrictions, primary-specialization lock, build export and printable build sheets.
- **Progression:** XP leveling with a level-up modal awaiting choices (`progressionSlice.js`), spell auto-assignment at 3 + 1/level, `experienceUtils.checkLevelUp`.
- **Heritage edges:** every native class/heritage pair has one bounded advantage plus one paired limitation (`heritageEdgeContract.js`), adapted into clamped engine modifiers (`heritageEdgeAdapter.js`, caps: attack +3, damage +4, movement 15 ft, resource gain 5, etc.), routed to condition hooks (`heritageCapabilityConsumers.js`), and surfaced into spell effect resolution (`spellEffects.js` emits heritage events under a supplied `heritageContext`).

### Evaluation

**Good:** the DAG + tier-gate economy is sound and fully wired. Rank upgrades are concrete ("heals 3d6, then 4d6 + overheal," not "scales"). The build-sheet export and copy/print functions are exactly the kind of tabletop bridge the project should invest in. Requirement gating (prerequisites must be in strictly lower tiers) is provably cycle-free.

**Problems:**
1. **The rules text contradicts the system.** `rules.json` "Talents" says each level grants **1** Talent Point and presents the whole system as "in development, not yet available," while `talentSystem.mjs` says 5/level and the UI spends 5/level. `rules.json` "Attributes" says improvements at levels 4/8/12/16/20 and mentions multiclassing, while the canonical cap is 10. Pick one truth and update the other.
2. **Tier gates and prerequisites can double-gate**, making early builds slower than the fiction of "every level is meaningful" suggests; the live UI is good about explaining, but the playtest risk is real.
3. **Does every class's three trees deliver three genuinely different fantasies?** Spot-checked Minstrel (Soulsinger/Battlechoir/Dissonance) and Arcanoneer (Prism/Entropy/Architect): yes. Berserker (Savage/Juggernaut/Warlord) and Warden (Shadowblade/Jailer/Vengeance/Monolith — note four trees in imports) are the ones to audit for spec-count consistency; `classSpellCategories.js` and `talentTreeData.js` should agree on how many trees each class exposes.
4. **Heritage edges are mostly bounded capability events**, not yet broad passive integration. The contract/adapter/consumer architecture is genuinely good engineering, but the player-facing payload is thin: most edges are conditional named capabilities. The declared flags (`heritageEffectsImplemented: true`) overstate the current depth. This is PARTIAL, and the honest label in code comments ("numeric heritage edges/costs must be implemented before being advertised") is the one to trust.

**Tabletop coherence:** the talent system is a VTT-first design (drag points, hover ranks), but the "Playing in Person" sections for Minstrel and Martyr prove the team can produce physical-tracking instructions (colored tokens, blood stacks, dice as counters). Extend that discipline to every class resource; a printed "resource tracking card" per class would materially serve the project's stated purpose of enhancing physical play.

---

## 7. INVENTORY & EQUIPMENT — DEEP DIVE

### 7.1 What the system is trying to solve

The inventory is designed to make **carrying a physical decision**. It rejects abstract weight totals. Items occupy shaped cells in a pack grid; where you pack them determines whether you're fine, slowed, or a "lumbering wall." Containers are their own shaped grids with locks and failure consequences. Durability is a die ladder, not a hit-point bar. The intended experience: loot, pack, and gear maintenance are tactile tactical problems, the way they are at a table with minis and cards.

### 7.2 The implemented model (runtime-checked)

- **Grid:** `inventoryStore.getCurrentGridSize()` derives grid from `calculateCarryingCapacity(strength, equipmentBonus)` → `getInventoryGridDimensions()` (`utils/characterUtils.js`).
  - Base STR 10–11: **5 rows × 15 columns = 75 slots**, always 15 columns wide, split into three 5-column **vertical zones**.
  - Every 2 STR above 10 adds **one row** to all three zones (+15 slots): STR 12–13 = 90; 14–15 = 105; 16–17 = 120; 18–19 = 135; 20+ = 150.
- **Zones (columns 0–4 / 5–9 / 10–14):** packing anything into columns 5+ sets state *encumbered*; columns 10+ sets *overencumbered*.
- **Encumbrance effects** (`calculateDerivedStats`): encumbered = −5% Agility/Intelligence/Spirit/Charisma, +5% Constitution/Strength, −25% move speed; overencumbered = −15%/+15%, −75% speed, plus a `hasDisadvantage` flag on the effect profile.
- **Shapes & rotation:** items carry a 2D shape (`itemShapeUtils`), rotate 0/1 with collision; legacy items fall back to rectangles. Containers can use custom bag silhouettes (`containerShapePresets.js`, `containerShapeUtils.js`) where non-floor cells are storage voids.
- **Containers:** `ContainerWindow.jsx` renders a container's own grid (default 4×6) with optional custom shape; items are stored under `containerProperties.items`; locks support type `none/thievery/code/numeric`, DC, max attempts, and failure actions (remove items/percentage, destroy, trap, transform).
- **Equipping:** equipping strips an item to 1×1, preserves `inventoryPosition`, and swaps conflicting slots and two-handers back to inventory with original dimensions (`statsSlice.equipItem`). Durability updates live on equipped items; broken items are unequipped automatically.
- **Durability:** armor DR is rolled; rolling 1–2 on the DR die degrades one die step (d10→d8…); below d4 the item breaks, loses enchantments, and is auto-unequipped. Mending is 1 step/short rest, 2/long rest, one item (`rules.json`, code paths consistent).

### 7.3 Where the system succeeds

1. **Physicality is real.** Item dimensions (a 2×3 shield, a 1×4 sword), rotation, and zone placement make packing a genuine mini-game. This directly serves "don't simulate the category — simulate the fantasy." A tetris-shaped pack is a fantasy the category buried under weight spreadsheets.
2. **The zones express body mechanics** (center of mass vs. outer load) rather than bookkeeping. Reading "treasure in the outer columns = crawl" is instantly legible.
3. **Container locks create authored tabletop moments**: lock type, attempts, and failure consequences are GM-facing content, not UI trivia.
4. **Durability as die-step decay** is tactile, printable, and thematically aligned (entropy everywhere).
5. **Equip/unequip round-trips preserve original item geometry**, which is exactly the kind of boring correctness that makes tactile systems trustable.

### 7.4 Where it fails or contradicts itself

1. **Player-facing rules describe the wrong grid.** `rules.json` "Inventory & Encumbrance" says the pack is *5 columns × 15 rows* and that Strength adds **columns**; the engine is *15 columns × 5 rows*, Strength adds **rows**, and capacity is rows × 15. The rules' strength table (4–15 → 10–15) matches the engine numerically but its axis labels are inverted. Worse, the section text and the Quick Facts tile inside the same rules page disagree ("+1 row per 2 STR" in the tile vs "one additional vertical column" in the body). A player following the written rules packs in the wrong direction.
2. **"Weight" is tracked but not used.** `calculateTotalWeight` exists and item weights are stored, but encumbrance is purely positional. There is no combined rule; heavy-but-small items are free, light-but-long items are punishing. That may be intentional (positional load), but then weight should stop being displayed or should feed a secondary rule, or the fiction should say "bulk, not mass."
3. **Nested containers are invisible to encumbrance.** `calculateEncumbranceState` iterates top-level `state.items` and skips anything without a top-level `position`. Items inside `containerProperties.items` have container-local positions only. A character can carry an arbitrarily heavy pack of containers in the free zone with zero consequence. This is a real exploit and a tabletop-representation mismatch (at a table, a bag of holding is still a bag).
4. **Container collision math is coarser than inventory math.** `ContainerWindow.isValidContainerPosition` uses bounding rectangles for items, while the top-level inventory uses occupied-cell sets (`itemShapeUtils.getOccupiedCells`). Rotated or non-rectangular items can behave differently inside a bag than in the pack. One packing rule should win.
5. **The zone math has a weird incentive.** The encumbered and overencumbered zones give **bonuses to STR and CON** (+5%/+15%) while penalizing everything else. A player can deliberately over-pack the outer columns, gain strength-derived carrying capacity and physical checks, and accept a −75% speed crawl. For a "heavy plate centered = free" design this is backwards — the heavy load should make you *stronger-looking but worse at strength checks*, or the bonus should be removed.
6. **Equipped gear avoids the grid entirely**, which is defensible for "worn, not carried," but it means armor weight is free while a spare cloak is not. State that design explicitly.
7. **The encumbrance penalty flows through the stat system**, so lowering Agility changes derived numbers (dodge/initiative/etc.) in ways players cannot see without opening the stats breakdown. The UI should announce the cause, not just the effect.
8. **The rules say zones are "fully automated… speed and modifiers instantly,"** which is true in the store but the docs' example numbers ("+15% STR/CON checks, −15% all other attributes") do not match the code's base-stat percentage behavior. Text and code need one reconciliation pass.

### 7.5 Verdict

The inventory is a **DISTINCTIVE, SHIPPED (with contradictions)** system. It solves a real problem conventional TTRPG inventory does not: it makes carrying *spatial*. It earns most of its complexity. Its costs are payable: fix the rules text to match the engine, decide whether weight matters, count container contents, unify collision math, and remove or re-scope the outer-zone stat bonus. None of that requires redesign.

---

## 8. CORE COMBAT & MAGIC

### 8.1 Combat as authored (rules v2.2.1)

- **Ladder of Trials:** no static DCs; the GM picks a difficulty die (d4 → d20) and the player rolls it plus skill rank. Critical success = max value; critical failure = natural 1; natural 1 on a weapon die is a fumble with a 10-entry consequence table. Mastery (+5 attribute) steps the difficulty die down.
- **Unified strike & damage:** one weapon-die roll resolves hit and damage; 1 = fumble, 2–max−1 = hit for the die + attribute, max = critical with exploding dice and weapon-specific effects (bleed / DR shred / stun / movement halve).
- **Equipment-based DR:** armor rolls a soak die; 1–2 degrades one step; crits bypass DR entirely.
- **Action Points:** 3 AP, no action/bonus split, move 1, attack 2, defend/hide/help/ready 1.
- **Dying:** 1 AP while dying, d20 death saves (10+), 3 successes/failures, nat 20 → 1 HP, damage while down adds failures; system shock and massive damage instant-death rules.
- **Rest:** short rest 1 hr (hit die or ¼ max HP; half resources), long rest 8 hr (full HP, most resources).
- **Push Your Luck:** optional 1d6 push die with exhaustion, lockout, or sustained momentum; subsequent pushes with cumulative −1.
- **Damage modifiers:** standardized tiers Susceptible/Exposed/Vulnerable (+25/50/100%) and Guarded/Resistant/Immune (−25/50/100%), with Leech/Absorb/Invert conversions, resolved base → modifiers → conversion → final.

### 8.2 Magic as authored

Damage-type schools (ember, rime, storm, wyrd, blight, primal, arcane, sacred/smiting, plus physical) drive resistances, spell identity, heritage edges, and creature stat blocks consistently. Spell acquisition is talent-based plus universal spells; the spellcrafting wizard is a 9-step custom-spell pipeline with balance thresholds. "The Silence's Shadow" frames magic corruption as a cost of custom/deep casting.

### 8.3 Assessment

**Strong:** the unified attack roll and die-step durability are genuinely fast, tactile, table-real, and printable. The Ladder of Trials supports the GM as narrator rather than a DC database. AP with no split is cleaner than most 5e-derived systems. Damage-type coherence across spells/creatures/classes is excellent — this is the project's strongest technical accomplishment.

**Concerns:**
1. **Critical-chance inversion by die size.** In combat, crit chance = 1/die size. A d4 dagger crits 25% of the time; a d12 greataxe 8.3%. With exploding dice, the small weapon is a better crit engine than the heavy weapon, which reverses the intended weight of weapon choice. On the Ladder, a "Very Easy" d4 check crits 25% of the time while a "Very Difficult" d20 crits 5%. If the design wants weapon weight to matter, use confirmation, a minimum threshold, or scale crit range to weapon class rather than die face.
2. **Advantage doubles crit chance** (roll two dice, take higher) — worth stating explicitly in the rules, because players will not predict that.
3. **D&D residue is heaviest here**: spell names and gp prices in the resurrection table (Revivify/Raise Dead/Resurrection/True Resurrection/Reincarnation, 100/500/1,000/5,000/25,000 gp), hit dice, and the "Transitioning from D&D 5e" framing. The setting's own metaphysics offers better: resurrection should cost a debt (Morvane's threshold, the Revenant's Toll, the Martyr's scar), or a Hearth-Winter-priced shard-rite, not a gp service list. This is the clearest place where the rules simulate the category instead of the fantasy.
4. **"The Silence" is triple-booked.** It names the False Prophet's absence-theology, generic silence (anti-magic lockdown), and the "Silence's Shadow" corruption section. Rename at least two.
5. **Dying rules use d20 death saves**, the most recognizable 5e mechanic on the page, while everything around them is authored. The conscious-dying 1 AP twist is good; consider a Mythrill-native resolution (e.g., your scar/pact intervenes) to finish the job.
6. **Massive damage / system shock and push-your-luck exhaustion** add good lethality but also more exception text than the rest of combat. Watch table load.

**Tabletop coherence:** combat is *more* physical than most systems (single roll, die ladder, token states), which fits the stated mission. The largest physical-play risk is status-effect bookkeeping; the project already has a condition engine and status icon system, so the fix is presentation.

---

## 9. CREATURES

`public/data/creatures.json` holds **193 creatures**; `docs/CREATURE_COMPENDIUM.md` documents 140 generated with a deliberate method: each entry fuses **two real-world folklore traditions** and adapts them to the region's theme (Frostwood = Germanic + Celtic; Nordhalla = Norse/Alpine; Sundale = Mesopotamian/Egyptian; etc.). Entries carry physical design, ecology, and hooks (Gref is a full example: a memory merchant with stats, loot, and a `loreClassification`).

The classification fields are exactly the right discipline and are mid-flight: 74 `NATIVE-REVIEW`, 68 `NATIVE-PROPOSED`, 26 `HYBRID-REVIEW`, 9 `COSMIC-WYRD-PROPOSED`, 7 `COSMIC-WYRD-REVIEW`, 4 `WYRDSPAWN-PROPOSED`, 3 `DATA-CORRECTION`, 2 `POST-BINDING-REVIEW`. This means roughly a third of the bestiary is still proposed, not canonized. That is healthy process; the risk is presenting proposed creatures as settled in player-facing pages (bestiary and lore auto-linking) before review concludes.

**Strengths:** the four-layer provenance doctrine (native / ancient cosmic Wyrdkin / Keth-spawn / Wyrd-touched) is a genuinely original cosmology for monsters; folklore-as-translation (not folklore-as-creator) prevents the "belief made the monster" cliché; regional folklore pairings produce coherent local ecologies rather than a global monster manual.

**Risks:** (1) two-traditions fusion can become formulaic and produce creature names that are portmanteaus rather than discoveries; (2) the bestiary is large relative to the number of creatures wired into encounter content; quantity is not the contribution — the region-ecology integration is; (3) `lore.json` includes older creature entries (3 typed creature plus creature-like types) that may predate the provenance doctrine; audit those first.

---

## 10. CULTURES, FACTIONS, RELIGION, COSMOLOGY, LOCATIONS, HISTORY

### 10.1 The world premise

A living, unhatched sun (Sol) is hidden in the core by his parents (Aex entombing, Aethil sky-warding); a cosmic predator (Keth Amar) followed refugees (Astril) to the world and hunts him. The Blind Strike fractured Aex's aegis into shards and planted a Counterfeit; the world froze; warmth became money. Native life predates and is independent of all of it. This is a strong, coherent, *original* cosmology, executed with unusual epistemological discipline: doctrine, rumor, and author truth are explicitly separated (`CORE_LORE_FRAMEWORK.md` §1.7 explains why mortal records contradict each other — Keth impersonated Aethil).

### 10.2 Recurring themes (derived from the material)

1. **Memory as survival.** Journals chained to belts, contracts that keep you animate, masks that hold identity, crypt lights that keep the dead named, throat-songs that map the steppe, ink monopolies that decide who legally exists.
2. **Debt as physics.** Bloodline pacts, the First Contract, the Great Registry, House wagers, Postmortem Corvée, Toll on the Revenant, Devotion as blood-stored investment.
3. **Warmth as economy.** Hearth-Winter as a unit of account, vent-terraces, Aex-shard hoards, the Ripple Rule ("adventurers do not find heat; they take it from someone who was counting on it").
4. **The body as medium of history.** Stone that remembers, thorns that hold a contract, fungal eyes that glow with a god's wound, ash-scars that encode clan.
5. **Thresholds and prices.** Every power has a paired cost; every culture traded something for survival.
6. **Institutions that monetize necessity.** Cartels, syndicates, boards, registries, and guilds are the recurring antagonists — not evil gods.
7. **Ancestors as infrastructure.** Bridges of the dead, ice-standing witnesses, glowing crypt-singers, file-clerks of the dead.

### 10.3 Factions and regional realpolitik

The seven-region structure is rich but *suspiciously uniformly shaped*: a noble house makes a bargain; a cartel/monopoly controls the survival resource; society splits into two castes; a state religious/legal apparatus persecutes a folk practice. Houses: Thalreth (fog/ledger), Skalvyr (glaciers/Sunder-Wall), Solvan (sun/ash), Mereval (sea lanes), Tesshan (blizzard/khipu), Ordavan (steppe/herds), Morrath (Bryngloom regency). Institutions: Scribe-Cartel, Icechamber Syndicate, Sulfur Cartel, Lamphera-Bond Syndicate, Steam-Line Cartel, Great Registry, Rime-Brides/Inquisition variants. Castes: Ledgered/Forgotten, Fastboende/Fredløse, Deep-Born/Ash-Dwellers, Deck-Born/Bilge-Dwellers, Terraced/Chasm-Dwellers, Mounted/Unmounted, canopy/Over-Shanty.

The repeated template is a real structural weakness: the regions differ in climate and costume but not in political anatomy. Add variety in the next pass — a kin-confederacy, a theocratic republic, a guild syndicalism, a true democracy under existential threat, a region with no monopoly at all because the resource is too diffuse to control. The material already contains the seeds (the Drift-Council and Tide-Council are the most distinct political forms; the Fexric guild/Clan-Free split is an economic class system, not a caste).

### 10.4 Religion

The seeded pantheon (`deityStore.js`, ~17 entries) is a genuine strength: Aex, Sol, Selunis, the Sleeping Soul, Aethil, Morvane, Sereth, Mareth, Vurath, the Unnamed Green, the Thunder Sovereign, Mael-Zhul, the Quiet, the Reckoner, Scathrach, Keth Amar, and the Unknown Dominator. Distinctively, several "gods" are not gods (Keth is a predator species; the Unknown Dominator is a false attribution; the Thunder Sovereign is a fallen thing) — this is exactly the kind of authored theology that separates Mythrill from polytheist default settings. `CORE_LORE_FRAMEWORK.md` §5.4 (Old Native Gods) and the deity descriptions are consistent in tone. Priests are notably scarce; the setting's "churches" are institutions first (Dawn Vigil, Risen, Sunderer, Scoured), which fits the themes.

### 10.5 Cosmology — the four-layer creature doctrine

The separation of native life, ancient cosmic Wyrdkin, Keth-spawn, and Wyrd-touched natives is the most reusable worldbuilding instrument in the project. It lets any monster be interrogated ("what is its origin, its anchor, its persistence?") and prevents the common error of treating "Wyrd" as "magic did it." Keep this doctrine visible to GMs; it is a design principle, not just canon.

### 10.6 Locations and history

Locations are numerous and deeply textured (145 location entries; subrace compendium files give capitals, figure bios, and art prompts for all 25 heritages). The art direction itself is IP: monochrome rough charcoal/graphite with a single heritage-colored watercolor bloom; "Always Be Chunky" form language; wide-angle city plates without foreground portraits; explicit anatomical locks and negative guardrails (no tusks, no orc snouts, no pig-men; Riverling is human-faced, not reptilian). A franchise with enforceable visual grammar is worth more than one with more pages. Protect this.

History has a clean era spine (Long Before → Star-Fall/Pacting → Slow Cracking → Whispers → Blind Strike/Blizzard's End → Freezing Era) and a strong causal web. Its main problem is canon drift, below.

---

## 11. CONTRADICTIONS & UNEVEN DEVELOPMENT

These are live conflicts between current sources. `CORE_LORE_FRAMEWORK.md` (reconciled to the 2026-09-30 Living Cosmos blueprint) is the declared owner of world truth; `lore.json`, class pages, and some art briefs contain earlier versions.

| # | Conflict | Where | Severity | Suggested resolution |
|---|---|---|---|---|
| 1 | Hidden true seventh Monolith / Viridane cleansing key vs. "no hidden key" canon | `lore.json` `the_breach` ("a true seventh keystone… hidden where the fog keeps its secrets") vs `CORE_LORE_FRAMEWORK.md` §1.6 and `house_viridane` ("No hidden true seventh Monolith… no cleansing key") | **High** (player-facing plot) | Rewrite `the_breach` to the current doctrine; it is directly contradicted in the same dataset |
| 2 | Heirs devoured at a summit vs. heirs died in the Whispered Purge; Blind Strike was the later kinetic assault | `lore.json` `the_deepening` ("The Ingress") / `the_breach` vs `CORE_LORE_FRAMEWORK.md` §1.4–1.5 | **High** | Rewrite event entries; the framework's version is more interesting (a 25-year manipulation, not a monster at a party) |
| 3 | Vreken "arrived three centuries after the Great Binding" vs. Nethien and Vreken both pre-existing / Nethien pre-Starfall | `races/vreken.js` epicHistory vs `CORE_LORE_FRAMEWORK.md` §5.1/§5.3 and `races/neth.js` | Medium | Fix the Vreken epicHistory; the contradiction is inside one file's own summary vs body |
| 4 | Valerius drafted the First Contract vs. Vaelis did (pre-Starfall), Valerius formalized the Nomenclature | `classes/arcanoneerData.js` overview vs `CORE_LORE_FRAMEWORK.md` §3 and `classHeritageRegistry.CLASS_HISTORY` ("Vaelis is a distinct historical female negotiator") | Medium | Update class prose; registry is correct |
| 5 | Minstrel is a maritime Tide-Choir tradition vs. a dimensional bardocalypse | `classes/minstrelData.js` (reframes vs. headline/description) | **High** (class identity) | Pick the maritime frame; re-read the cosmic text as in-world exaggeration or a hostile faction's rhetoric |
| 6 | Shaper founder Veyra is "Deceased" and also the living current leader | `classes/shaperData.js` `livingOrder.founder` vs `currentLeader`; registry says living Veyra | Medium | Correct the founder block; registry matches the intended canon |
| 7 | Human `The Short Straw` says every human bloodline carries the dark bargain; framework says most ordinary mortals never bargained | `races/human.js` sharedTraits vs `CORE_LORE_FRAMEWORK.md` §1.2 | Medium | Re-scope the trait to oath-bearing lineage remnants or cold-inheritance, not universal guilt |
| 8 | Astril slit pupils + "Brutish" dark crystal vs. a subrace trait describing "pupil-less silver eyes" | `races/astril.js` visualDescription vs Brutish trait `Silver Eyes` | Low-Medium | Align the trait text with the organic, slit-pupiled canon |
| 9 | Florae Viridian "cleansing key runs in their blood" vs. no key | `races/florae.js` Viridian description vs framework | Medium | Same fix as #1 |
| 10 | Mimir "every Mimir wears a mask / masks running out" (crisis) vs. Broken Mimir "genuinely unmasked, no mask needed" (summary) | `races/mimir.js` currentCrisis/culturalPractices vs overview | Medium | Scope the mask crisis to Arch institutions; it is already half-fixed in the summary but the crisis prose contradicts it |
| 11 | Neth "player key" is `neth` with legacy `velun_neth`/`kessen_neth`/`drun_neth` ids; old names (High Neth, Kessen) still appear in live text | code + race text | Low | Display-name sweep is in progress; finish it |
| 12 | Inventory grid orientation (rules say 5 cols × 15 rows / Strength adds columns; engine says the reverse) | `rules.json` vs `inventoryStore.js`/`characterUtils.js` | **High** (players pack wrong) | Update rules text; also fix Quick Facts tile vs section body |
| 13 | Talent points: 1/level and "system in development" vs. 5/level, live and fully wired | `rules.json` vs `talentSystem.mjs`/`TalentTreeContent.jsx` | **High** | Update rules text; keep the alpha disclaimer only if the feature is actually gated |
| 14 | Level cap 10 vs. attribute increases at levels 4/8/12/16/20 and a multiclass mention | `talentSystem.mjs` vs `rules.json` attributes page | Medium | Update the advancement page |
| 15 | Class resource card labels vs contracts: Spellguard card says "Resonance," contract is AEP; Gambit quick resource says 0–20 Fortune, contract 0–7; Pyro quick text says Tiers 1–10/demon checks at 5+, contract 0–9 with latched call | live classes codex cards + class files | Medium | One-pass label/summary reconciliation across cards, quick-overviews, and contracts |
| 16 | Resurrection table uses D&D spell names and gp costs | `rules.json` | Medium (identity) | Re-cost into Hearth-Winter/deity-debt; rename or reflavor spells |
| 17 | Background species-crossings that conflict with heritage lore (Morgh peat-tender in Bryngloom; Ithran petrified-mason; Viridian canopy-weaver vs. citadel architecture) | `backgroundData.js` late entries | Low | Canon pass over the 34 profession backgrounds |
| 18 | "Blizzard's End" mortally remembered as the summit; framework says the Purge, not the summit, killed the heirs | docs + lore.json | Medium | Same as #2 |
| 19 | Fey/Unnamed Green vocabulary overlaps older "fae contract" terms in Florae and Mimir texts | race files + docs | Low | Consistency pass on "fae," "Old Revel," "Hollow-Court" vs. canon powers |

**Uneven development snapshot:**
- **Most finished:** heritage registry, class resource contracts, race trait data, lore.json lexicon, regional docs, art prompts.
- **Mid-migration:** lore event entries, class quick-overviews, rules pages for talents/inventory/advancement, bestiary review statuses, heritage edges.
- **Least finished:** reconciliation between `rules.json` and the engine; player-facing explanations of the systems the engine actually has; content-to-encounter wiring for the bestiary.

---

## 12. IF EVERY PROPER NOUN WERE REMOVED

I would still know this is Mythrill because:

- **Warmth is currency**, food is grown on vent-terraces, and heat is hoarded as shards that fade rather than run out.
- **Memory is a legal and physical substance.** People chain journals to themselves; a fog eats recollection; forgetting is a form of death; record-keepers own reality.
- **Debt outlives death.** Contracts preserve the living, conscript the dead, and price souls; the predatory force at the center of the cosmology is an auditor of promises.
- **The dead hold up the world** — as bridges, as lining to preserve the living, as singing lights in inverted cathedrals, as standing witnesses in ice.
- **Every culture is defined by a bargain and its price**: a trade of climate for memory, summer for survival, visibility for shelter, clarity for fog, calm for passage.
- **Monsters are folklore-as-translation, not folklore-as-creation**, and every creature has an origin, an anchor, and a persistence condition.
- **Power always has a paired cost**, and the cost is usually paid by the body — stone that cracks, eyes that betray, notes that decay, blood that cooks.
- **The visual grammar**: monochrome charcoal with one watercolor color per people; cavernous city plates; strict anatomical silhouettes; a design language of chunky, heavy forms against a frozen world.

Remove the names and you still have *a world where people survive a cosmic winter by writing, singing, grafting, and remembering, while the things they promised catch up to them.*

---

## 13. FINAL SECTIONS

### WHAT MYTHRILL IS

- A freeze-age planetary fantasy about a living, hidden sun, a fallible cosmic predator, and the industries of warmth, memory, and debt that grew between them.
- An original RPG whose mechanics usually begin as a people's history and only then become class powers.
- A tactile, tabletop-first VTT project: spatial inventory, die-step durability, note tokens, blood stacks, printable build sheets.
- A worldbuilding archive with proven provenance discipline: native / cosmic / spawn / touched; doctrine / rumor / truth.
- A visual franchise with an enforceable house style and anatomical canon.

### WHAT MYTHRILL IS NOT

- It is not a D&D retroclone with renamed races — except in a handful of places where the rules layer still is one (resurrection table, death saves, attribute vocabulary, "transitioning from 5e" as the onboarding lens).
- It is not grimdark for its own sake; the cruelty is economic and institutional, and ordinary communities, friendships, and victories are explicitly preserved.
- It is not horror-first, though several peoples and classes are horror-adjacent by design.
- It is not a simulation of weather, ecology, or combat realism; it is a ritualization of them.
- It is not finished as a *game*; the world is far ahead of the rulebook.

### WHAT MAKES IT RECOGNIZABLE

The recurrence of memory-as-substance, debt-as-physics, warmth-as-money, the body as a record of history, and prices paired to every power. Also: the visual grammar, the four-layer creature doctrine, and the habit of writing institutions (cartels, boards, registries, guilds) as the real antagonists.

### STRONGEST DESIGN PRINCIPLES (derived from the work, not invented)

1. **Mechanics arrive as consequences of culture.** The resource bar is a people's survival practice, not a class kit.
2. **Every power carries a paired cost**, paid somewhere legible (body, memory, identity, speed, social standing).
3. **Truth has layers and institutions argue about it.** Canon distinguishes author truth, doctrine, rumor, and error — and uses the distinction as a plot engine.
4. **Make the table physical.** Single-roll attacks, die-step decay, token-tracked notes, printed build sheets.
5. **Prefer institutions to villains.** Cartels, registries, and boards cause most of the world's harm, and ordinary people navigate them.
6. **Transformation is identity, not power.** Groven, Florae, Mimir, Vreken, and Solari are all people changed by what was done to them; their mechanics express the change rather than the powerset.
7. **The folklore translates; it does not create.** Native life is real; stories are records, not causes.
8. **Familiarity is a foothold, not shame.** Elves become fungal monks; engineers become dying custodians; bards become sonic engineers. Start familiar, end authored.

### WHAT SHOULD NEVER BE GENERICIZED

- The Ancestor-Spans (dead-as-infrastructure) and the Still-Claiming death economy.
- The First Contract and everything that makes memory and writing legally real (Nethien, the Great Registry, the Sovereign Ledger, Vreken crypt records).
- The Mimir mask/identity architecture and the "final shape held" scripture.
- The four-layer creature provenance doctrine; do not collapse it into "Wyrd = magic."
- The Minstrel's note/cadence system (after unifying its identity).
- The inventory's spatial pack grid and zone encumbrance.
- The visual grammar (monochrome + one watercolor per people, anatomical locks).
- The "every culture traded something to survive" structure — it is the setting's thesis.

### WHERE IDENTITY IS WEAKEST

1. **The umbrella human identity** ("short-lived, burning bright") — keep the cultures, cut the repetition.
2. **The Fexric craft culture** — the death-of-the-songs tragedy is the differentiator; craft alone is gnome/dwarf default.
3. **The shared class resource skeleton** — distinct skin, repeated decision shape.
4. **The uniform regional political template** — house/cartel/castes/theocracy in all seven regions.
5. **The rules/onboarding layer** — where the project most sounds like the category it says it is not.

### WHAT SHOULD BE SIMPLIFIED

- **The class quick-overviews.** Several contradict their own contracts (Gambit 0–20 vs. 0–7; Pyro 1–10 vs. 0–9; Spellguard "Resonance" vs. AEP). One summary per class, generated from the contract, or accept that the summary will drift.
- **Talent point accounting.** Five points per level across 50-point trees with tier gates and prerequisites is three layers of arithmetic before the first fight. Keep the depth; expose it as one number ("points left in this tree / points needed for the next tier").
- **The rules-codex front door.** Lead with an in-world primer before the D&D comparison.
- **Two overlapping background layers with no explanation.** Explain "heritage/calling" vs. "profession," or merge the UI.
- **Encumbrance explanation.** One page, one diagram, matching the engine.

### WHAT SHOULD BE DEVELOPED FURTHER

- **The heritage-edge layer** (contract → adapter → consumer → effects). The architecture is real; the payload is thin. Finish enough edges that class+heritage choice produces reliably felt differences.
- **The bestiary review pipeline.** Commit the ~150 REVIEW/PROPOSED creatures, or mark them explicitly as provisional in player-facing pages.
- **Encounter and quest wiring** for the enormous location/faction/NPC corpus; the world is ahead of the playable content.
- **Resurrection, death, and threshold rituals** as Mythrill-native systems (Morvane, Toll, scars, shard-rites) rather than D&D ports.
- **The social and travel systems** (they exist in the rules data with tabs and tables) — verify consumers and surface them as first-class play.
- **Physical table aids** for every class resource and for inventory packing, building on the excellent "Playing in Person" precedent.
- **The Unwritten, the Sleeping Soul, and the Unnamed Green as play-facing mysteries** — they are the most interesting unknowns and should stay deliberately unresolved while being mechanically present (rumors, omens, institution conflict), not absent.

### WHAT I WOULD PROTECT AT ALL COSTS

1. The **core premise**: a living hidden sun, a fallible predator, warmth as economy, memory as substance.
2. The **provenance doctrine** for creatures and powers (native / cosmic / spawn / touched; doctrine / rumor / truth).
3. The **peoples who were changed by what was done to them** — Groven, Vreken, Florae, Mimir, Astril, Solari, Fexric. Do not sand off the costs to make them play nicer.
4. The **spatial inventory** and die-step durability — the most tabletop-faithful systems in the project.
5. The **Minstrel's cadence economy** and the **Arcanoneer's sphere grammar** — the two mechanics that most prove "don't simulate the category."
6. The **institutional antagonists** (cartels, registries, boards, guilds) and the refusal to reduce conflict to good gods vs. bad gods.
7. The **visual grammar and art-direction discipline**; it is a fungible franchise asset.
8. The **authorship of ordinary life**: the taverns, journals, water-flasks, festivals, puppets, and herd-songs. This is what makes the setting feel inhabited, and it is the hardest thing to retrofit later.

---

*Prepared as a read-only review. All findings cite current repository files; where sources disagree, the disagreement itself is reported rather than silently resolved. Nothing in this document should be treated as an instruction to change production content without the creator's explicit decision.*
