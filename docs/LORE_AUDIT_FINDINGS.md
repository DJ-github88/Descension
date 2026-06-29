# Mythrill Lore Audit — Findings & Proposals

> **Status:** Generated 2026-06-29. Canonical sources: `rulesData.js`, `loreDictionary.js`, per-class `overview`/`originStory` blocks, `raceData.js`/races/*.js, `backgroundData.js`, `zoneData.js`, `deepLocationData.js`.  
> The `GM_WORLD_GUIDE.md` is a convenience summary, **not** authoritative where it conflicts.

---

## 1. Phase 1 Progress (Edits Already Applied)

### 1.1 Silent Seventh Contradiction — RESOLVED

**Files edited:**
- `rulesData.js` (The Refusal + The Silent Seventh sections)
- `loreDictionary.js` (briaran, silent_seventh, house_viridane entries)

**New unified canon:** House Viridane was the **seventh** binding family — one of the original seven signatories of Sol's Binding Compact. When they refused Keth-Amar's demands, the remaining six houses **elevated House Morrath as a replacement** and spent three centuries erasing every trace of Viridane. The "eighth house" label is the public's term: counting the seven official families plus the one that was hidden.

### 1.2 Bryngloom Bargain Origin — RESOLVED

**No files needed changing** — the existing text already established House Morrath as an "administrative regency" for the Neth (`loreDictionary.js:house_morrath`). The Neth are the true bargain-holders. House Morrath administers the First Contract on the surface.

### 1.3 Name Collision Resolution — DECIDED

**Decision:** Keep **Warden** as the class name. The cosmic entity and class share the same name but occupy different contexts (mechanical vs. narrative), and the collision is manageable without a rename.

Rationale: The entity "The Warden" (cosmic arbitrator of the Original Binding, referenced in the Deepening myth, the Still Crag, Infernal language) and the playable Warden class (chain-graft penitent jailer) are distinct enough in context — one is a cosmic force, the other is a mortal calling. No rename needed.

Affected files for rename: N/A — decision reversed, class name kept as Warden.

---

## 2. Critical Overview

### Macro Concern #1: Symmetry Over Function

Seven regions, seven noble houses, seven Sundered Monoliths, seven human subraces, every region follows the same structural template (Dark Bargain > Seat of Power > Social Divide > Wyrd Threats > Daily Life). This forces every region into the same narrative shape even when the material wants to be different.

**Example:** Bryngloom's Dark Bargain wasn't struck by a noble family — it was Neth ancestors making a legal argument to the Keeper. Yet it's forced into the template, losing what makes it unique.

### Macro Concern #2: Zero Hard Restrictions

The lore is rich with implied barriers — "Thalren produce Animists naturally," "Skald produce Berserkers first," "Berserkers are banned from Atropolis" — but there are **zero mechanical restrictions** in the codebase. Any race can be any class. Any background can be chosen by any subrace. This is the single biggest dilution of world identity.

### Macro Concern #3: Geographic Bloat Without Differentiation

86 zones across 7 regions (~12/region) + 11 deep location profiles. Many zones serve identical purposes: guard-post settlements, hazardous wilderness passages, ancient ruins. The count exceeds what any single campaign can meaningfully use.

---

## 3. Consistency Breakdown

### 3.1 The Warden Entity Is Nearly Unused (OPEN)

The cosmic entity is defined in `loreDictionary.js` with detail, but appears nowhere in class lore, party store, faction store, or any quest hook beyond one rollable table shrine entry. It exists in a vacuum.

### 3.2 Corvani Are a Schrödinger's Race — DECIDED

**Decision: Strip mechanical scaffolding. Corvani are creature/NPC-only.**

They were never intended as a playable race — they're a creature race with leftover scaffolding (distinct class presence, named NPCs, locations, Corvid-Speech). Remove the mechanical remnants: Corvid-Speech from `languages.js`, Corvani references from class-practiced-by lists, and Corvani NPC entries. Mark explicitly as "GM-only creature race" wherever ambiguous.

### 3.3 Human Debuff Asymmetry — DECIDED

**Decision: Option A — Add universal weaknesses to every race.**

Preserves the design intent (every race has a trade-off) without nerfing Humans. The mythrill world is harsh; every ancestry should carry a flaw that reflects its biology/spirituality.

### 3.4 Class Overlap — Thematic Bloat — DECIDED

**Decision: Keep all classes. Warden name kept as-is.**

- **Plaguebringer vs. Toxicologist:** Keep both. Plaguebringer cultivates internal disease ecosystems (Bryngloom, Drun Neth/Morren). Toxicologist engineers external poisons (Frostwood, Thalren/Mimir). Different paradigms — one lives inside you, the other coats your blade.
- **Harbinger vs. Chronarch:** Keep both. Harbinger weaponizes *prophecy of doom* (entropy priests who see the world ending). Chronarch manipulates *time itself* (weavers who pull threads of past/future). One predicts, the other stitches.
- **Inquisitor vs. Martyr vs. Warden:** Keep all three. Inquisitor hunts Wyrd corruption (offensive). Martyr redirects damage to self (defensive). Warden tethers enemies (control). Mechanically distinct.
- **Warden (class):** Name kept as-is — collision with cosmic entity is manageable (different contexts).

### 3.5 Berserker Origin Still Has Residual Friction — DECIDED

**Decision: Text consistency pass only. No new lore needed.**

The origin story is already patched (Skald ancestry in Nordhalla → migration to Sundale under Torra). Remaining friction is limited to ~2-3 flavor strings in `berserkerData.js` that assume one location. Fix: ensure all flavor text uses the migration narrative explicitly (mention both Nordhalla ancestry and Sundale present-day distribution).

### 3.6 Briaran/Neth Count Discrepancy (RESOLVED)

Unified: House Morrath is the administrative regency; the Neth are the true bargain-holders.

### 3.7 The Silent Seventh (RESOLVED)

Unified: Viridane was original 7th binding family, replaced by Morrath.

---

## 4. Per-Class Origin Inventory

Each class entry documents: origin story, founding figure(s), region, which races/subraces practice it (per existing lore), implied cultural boundaries, and current crisis.

### Animist
| Field | Detail |
|---|---|
| **Origin** | Three independent discoveries fused: Kael (Ordan, Sundrift Vale) totemic communion via bone eruption. Nyssa (Vreken, Bryngloom) loa-bargaining via spore inhalation. Theron (Skald, Nordhalla Frozen Archive) runic inscription via skin-carving. Traditions merged when carriers met at a crossroads and recognized each other's scars. |
| **Region** | Sundrift Vale / Bryngloom / Nordhalla (tri-regional) |
| **Practiced By (lore)** | Ordan humans, Sylen Astril, Clean Vreken, Morren humans, Rune Keeper Skald, Velun Neth |
| **Implied Barriers** | Requires ancestral spirit-channeling. Emberth commune with volcanic entities (different paradigm). Fexrick see spirits as machine-failure states. Tessen isolation prevents access. Myrathil have no land tradition. |
| **Current Crisis** | Triune Dissonance — the three traditions' dialects no longer align. Totem-resonance creates unstable harmonics with runic networks. Young Animists learning all three simultaneously experience sensory collapse. |

### Arcanoneer
| Field | Detail |
|---|---|
| **Origin** | Valerius, a Neth archivist, drafted the First Contract with the Keeper of the Last Threshold. By structuring incantations as strict legal syntax, he bypassed chaotic magical feedback. Price: blood crystallized into volatile shards, siphoned through a pig-iron forearm graft. |
| **Region** | Bryngloom Forest (Atropolis, Ironjaw Port) |
| **Practiced By (lore)** | Almost exclusively Velun Neth |
| **Implied Barriers** | Requires inability to lie (Neth-specific trait for contract submission without breach). Non-Neth lack the biological-legal architecture. |
| **Current Crisis** | Canopy-Ledger fractured. Someone is breaching the First Contract; the Keeper rejects clauses it once accepted. |

### Augur
| Field | Detail |
|---|---|
| **Origin** | Cassia, Skald star-watcher of Nordhalla. Read the Deepening's hour in a sacrificed glacier-elk's entrails at the Frozen Archive. Price: temporal feedback burned away her past — memories of husband, hearth, children incinerated for cosmic doom coordinates. |
| **Region** | Nordhalla (Frozen Archive) |
| **Practiced By (lore)** | Heavily practiced by Rune Keeper Skald and Astril |
| **Implied Barriers** | Requires proximity to preserved dead (glacier-tombs) and access to Frozen Archive's runic mathematics. Cultures without burial-preservation traditions (Ordan leave dead to steppe, Merryn bury at sea) can't maintain the ancestral connection. |
| **Current Crisis** | Star-arithmetic is failing — elk-entrail method dropped from 93% to 41% accuracy. Results contradict each other. Something is interfering with time itself. |

### Berserker
| Field | Detail |
|---|---|
| **Origin** | Grum the Iron-Smith in Sundale's volcanic caldera tunnels. When an ice-wyrm burst into the forge-halls, Grum let furnace-heat occupy his marrow — veins boiled, tendons snapped, he shattered the wyrm with bare hands. The Bloodhammer clans had migrated south from Nordhalla under Torra Bloodhammer. |
| **Region** | Sundale (Harath-Vault, Emberspire caldera tunnels) with Nordhalla ancestry |
| **Practiced By (lore)** | Heavily practiced by massive Skald and hot-headed Thrask Emberth |
| **Implied Barriers** | Requires Hunger Pact lineage (Skald) or deliberate Blood-Heat adoption (Thrask). Mimir are too identity-fragile to sustain the emotional singularity. Neth can't suppress their contract-nature. Ordan reject self-destruction over migration. |
| **Current Crisis** | "Unbound" Berserkers manifest Blood-Heat spontaneously without the Hunger Pact ritual. Elders call them abominations. |

### Chronarch
| Field | Detail |
|---|---|
| **Origin** | Nesta the Fexric engineer during the War of Thousand Screams. Built a time-dilation engine of volcanic glass and alchemical gears to stop a collapsing glacier at Frostmaw Holdfast. Hooked it into her chest; past incinerated, lives in perpetual agonizing present. Every second of manipulation calcifies her bones. |
| **Region** | Cragjaw Peaks (Frostmaw Holdfast) |
| **Practiced By (lore)** | Heavily practiced by guild-bound Kethrin Fexrick and long-limbed Groven diplomats |
| **Implied Barriers** | Requires temporal-suspension training only available in Cragjaw. Outsiders have never learned the technique — it requires Fexric gear-craft and Groven bone-knowledge. |
| **Current Crisis** | Nesta is disappearing from history. If she ceases to exist retroactively, temporal friction redistributes to every living Chronarch. |

### False Prophet
| Field | Detail |
|---|---|
| **Origin** | Li Wei, a nomadic Ordan herd-watcher, followed a meteor into a crystalline crater in the starless grasslands. Found a Sundered Monolith humming with black vacuum. Looked into the void where Sol once shone and saw the gospel of cosmic death. Returned blind, mind shattered, heart beating in erratic patterns. |
| **Region** | Sundrift Vale |
| **Practiced By (lore)** | Practiced by desperate humans and constellationless Unlit Astril |
| **Implied Barriers** | Requires a population desperate enough for manufactured meaning. Steppe nomads (Ordan) and debt-trapped Morren fit. Skald and Thalren are too institutionally rigid to embrace nihilism as salvation. |
| **Current Crisis** | The Voice of the Silence is getting louder — now gives specific instructions. Something trapped since the Age of the Deepening may be using them to free it. |

### Gambit
| Field | Detail |
|---|---|
| **Origin** | Two discoveries merged: Jax the Merryn pirate wagered his lifeline against a storm-spirit in Merrowport — won the wind but lost his blood's warmth. Lyra the Kessen Neth probability-watcher in Cragjaw used rune-etched cards to pluck the single timeline where her caravan survived — fracture of consciousness. |
| **Region** | Iceheart Sea (Merrowport) / Cragjaw Peaks (multi-regional) |
| **Practiced By (lore)** | Merryn humans, Breakers-Born Myrathil, Kessen Neth, fine-scaled Ithran Groven |
| **Implied Barriers** | Requires a culture that embraces risk-calculation. Tessen too isolated and risk-averse. Skald too honor-bound (gambling is dishonorable). Ordan too pragmatic. Astril too spiritually governed (spirit forbids random chance). |
| **Current Crisis** | Jax missing — seen walking into the Iceheart Sea with a smile. Lyra radicalized; her Deck-Burners faction seeks to force the universe to choose. |

### Harbinger
| Field | Detail |
|---|---|
| **Origin** | Two catastrophic traditions merged: Xyris the nomad (Sundrift Vale) spliced temporal friction into her veins, tore open reality. Malakor the archivist (Nordhalla) calculated the arithmetic of doom — exactly when those holes would consume everything. |
| **Region** | Sundrift Vale / Nordhalla (multi-regional) |
| **Practiced By (lore)** | Heavily practiced by Sylen Astril, Solvarn humans, Rune Keeper Skald |
| **Implied Barriers** | Requires cultural proximity to entropy. These three cultures have been waiting for extinction long enough to weaponize it. Merryn are too opportunistic. Thalren too preservationist. |
| **Current Crisis** | Chaos Pockets are becoming permanent in Sundrift Vale. Grass grows sideways, rain falls upward, time passes at different rates per location. |

### Inquisitor
| Field | Detail |
|---|---|
| **Origin** | Two parallel traditions from the same wound. Orven the Still-Handed (Vreken, Bryngloom) forged the first cold-iron blade and swore the Barbed Vow to hunt corrupted kinsmen. Elias the Salt-Scarred (Thalren, Frostwood) opened his veins to draw Wyrd's face-stealing horrors into living flesh. Merged when incursion rate tripled. |
| **Region** | Bryngloom Forest / Frostwood Reach (multi-regional) |
| **Practiced By (lore)** | Primarily Marked Vreken, Thalren humans, Unwoven Mimir |
| **Implied Barriers** | Requires either the Ghost-Mycelium (Vreken) or a lifetime of anti-Wyrd training. Other races lack the supernatural exposure density. Emberth too hot for stealth hunts. Fexrick too mechanical. Myrathil too distant from surface threats. |
| **Current Crisis** | Only 47 active Inquisitors remain; recruits are refusing the oath. Wyrd bleeds faster. New unnamed entities emerging. |

### Lunarch
| Field | Detail |
|---|---|
| **Origin** | Selene of House Viridane bargained with wildwood fae in the moonlit groves of the Frostwood. Bound a lunar parasite to her bones. The fae granted the light but took the warmth from her blood — permanent chill in her marrow. |
| **Region** | Frostwood Reach (Ironwood Heart) |
| **Practiced By (lore)** | Exclusively practiced by the Briaran descendants of House Viridane |
| **Implied Barriers** | Requires fog-dense environments where void-light is accessible. The parasite specifically responded to Viridane blood. Non-Briaran who enter the moonlit groves may be chosen, but the Briaran are the original bloodline. |
| **Current Crisis** | The dead moon was an egg. Elder parasites are communicating across hosts. Selene has been silent for three weeks, whispering in a dead language. |

### Martyr
| Field | Detail |
|---|---|
| **Origin** | Sera Solvan, a mother of House Solvan. Refused to let her sacrificed child's name be erased by the noble houses' purge. Carved the name into her forearm with volcanic obsidian. The wound healed into a glowing, sympathetic solar scar — absorbing others' suffering. |
| **Region** | Sundale (volcanic badlands) |
| **Practiced By (lore)** | Heavily practiced by Solvarn humans and Korr Emberth |
| **Implied Barriers** | Requires a theological framework for willing suffering. Solvarn have the sun-vigil. Korr have the Vault-Breath. Neth Velun have contract-martyrdom. Other cultures are too survival-pragmatic to embrace suffering as power. |
| **Current Crisis** | The Martyr's Vow is being weaponized. Noble houses "recruit" through indoctrination and child-training. Conscripted Martyrs heal less cleanly. |

### Minstrel
| Field | Detail |
|---|---|
| **Origin** | Lyris the Merryn sailor sang a sacred sea-symphony to the Iceheart Sea's churning gales, calming the waves. The ocean mother accepted the song but stole her spoken voice — she can only communicate through melodic whispers or lute strings. Screaming causes her throat to bleed and lungs to fill with saltwater. |
| **Region** | Iceheart Sea (Merrowport) |
| **Practiced By (lore)** | Heavily practiced by Merryn humans and Breakers-Born Myrathil |
| **Implied Barriers** | Requires a maritime culture with oral-performance tradition. Tessen too isolated. Cragjaw too vertical. Thalren too archival (song is unreliable). Ordan use throat-singing for navigation (functional, not artistic). |
| **Current Crisis** | The Iceheart Sea has fallen silent. No tidesong, no deep-bass pulse. Lyris vanished. Minstrels fear the sea is dying. |

### Plaguebringer
| Field | Detail |
|---|---|
| **Origin** | Vespera the Vreken alchemist bonded with bog-rot to cure the spore-hush ravaging her family's cave-keeps. Injected decaying moss from the Sunken Spire directly into her veins. Cured the hush but became a permanent host for active decay — waxy, pale, cold skin, constantly cultivating new diseases. |
| **Region** | Bryngloom Forest (Peat-bog Sinks) |
| **Practiced By (lore)** | Heavily practiced by Drun Neth and Morren outcasts |
| **Implied Barriers** | Requires the Bryngloom's unique fungal-bog ecosystem. Other regions lack the specific biological agents. Drun Neth's partial-death allows hosting. Morren's desperation drives acceptance. |
| **Current Crisis** | Vespera's foundational bacterial strain is dying after eight centuries. Cultivated diseases mutating into virulent forms that attack the host. |

### Pyrofiend
| Field | Detail |
|---|---|
| **Origin** | When Sol was entombed, a cabal of Solvarn occultists gathered in an obsidian cavern beneath Emberspire. Drew a summoning circle in their own blood with volcanic glass knives, carving Scathrach's seven sigils. Swallowed demonic coals of burning sulfur. Blood became liquid fire, bones seared black. |
| **Region** | Sundale (Emberspire caldera) |
| **Practiced By (lore)** | Heavily practiced by Thrask Emberth and hot-blooded Solvarn humans |
| **Implied Barriers** | Requires proximity to Scathrach's influence and a culture that frames self-destruction as power. No Ordan or Morren would willingly make that pact. The cold-loving Skald see it as antithetical. |
| **Current Crisis** | Scathrach is calling in ALL debts simultaneously. No Pyrofiend has ever survived contract collection. |

### Revenant
| Field | Detail |
|---|---|
| **Origin** | Two death-magic traditions in Bryngloom's peat-bogs. Kora the Veil-Speaker (Vreken) bargained with the Root-Veil — every spell drained her life, voice reduced to a whisper by screaming ancestors. Vesper the Scribe (Morren) performed the Rite of the Cold Hearth — bound his soul to a basalt phylactery, heart halts to once per hour. |
| **Region** | Bryngloom Forest (Peat-bog Sinks) |
| **Practiced By (lore)** | Heavily practiced by Clean Vreken and Drun Neth. Desperate Morren also take the path. |
| **Implied Barriers** | Requires cultural acceptance of undeath as continuation of obligation. Morren have the Postmortem Corvée. Vreken have ancestral binding. Tessen have sealed keeps that may freeze undeath. |
| **Current Crisis** | Bog-graves waking on their own. Twelve Revenants found dead, drained of blood but unwounded. The dead march toward the Sundered Monoliths. |

### Shaper
| Field | Detail |
|---|---|
| **Origin** | Sylvanus (Frostwood Reach) learned to synchronize strikes with wind-swept ironwood branches — kinetic momentum dance. Torin (Cragjaw Peaks) drank raw alchemical sulfur-clay, forcing skeleton to calcify and expand. Mimir chronicler Veyra merged both into the Shaper art. |
| **Region** | Frostwood Reach / Cragjaw Peaks (multi-regional) |
| **Practiced By (lore)** | Heavily practiced by Mist-Woven Mimir and Morgh Groven |
| **Implied Barriers** | Requires biological form-shifting capability. Hard Block: Humans can't physically reshape (bodies too fixed). Emberth bodies are too mineral-dense. Neth bodies are contract-locked by the First Contract. Myrathil are too fluid (can't hold shape). |
| **Current Crisis** | Convergence Collapse — young Shapers attempt every transformation at once. Mimir burn through crystalline skin in years. Purist vs. converger schism worsening. |

### Spellguard
| Field | Detail |
|---|---|
| **Origin** | Damon the Emberth blacksmith blocked a solar flare with an alchemical tower shield during Sol's entombment. Solar energy permanently scarred his flesh — veins hum with volatile trapped mana. Hands frozen in rigid shielding posture. |
| **Region** | Sundale |
| **Practiced By (lore)** | Heavily practiced by Velun Neth and Thalren humans |
| **Implied Barriers** | Requires access to Emberspire's volcanic forge-tradition and the Solbrand's residual energy. The Neth Velun provide precise magical cancellation. Thalren provide anti-Wyrd paranoia. |
| **Current Crisis** | Ambient magic levels are rising. Spellguards' Void Resonance fills faster than they can purge it. Some Arcane Saturation causes spontaneous Radiation Bursts. |

### Toxicologist
| Field | Detail |
|---|---|
| **Origin** | Varis the Thalren alchemist extracted raw venom from Frostwood fog-predators to create chemical defenses against face-stealing horrors. Years in ironwood canopies distilling toxic moss and acidic secretions. Constant exposure caused chronic tremors, burned away taste, left fingers permanently stained. |
| **Region** | Frostwood Reach (The Shallows) |
| **Practiced By (lore)** | Heavily practiced by Thalren humans and Unwoven Mimir |
| **Implied Barriers** | Requires deep knowledge of fungal/pharmacological reagents unique to the Frostwood. Unwoven Mimir brew floor-toxins. Morren know the bog's chemistry. Other regions lack the specific reagents. |
| **Current Crisis** | The fog is changing Frostwood's chemistry. Airborne toxins relied on for generations are becoming unstable, degrading in weeks instead of years. |

### Warden
| Field | Detail |
|---|---|
| **Origin** | Alaric the Law-Keeper, a Groven mine-guard in Frostmaw Holdfast's lower tunnels. When Deep Alchemists' vat-laboratories collapsed, experiments poured out. Alaric drove an ore-hauling chain through his own forearm into the largest specimen's ribcage. Held for three days. Chain rusted into his bone. He said no to removing it. |
| **Region** | Cragjaw Peaks (Frostmaw Holdfast) |
| **Practiced By (lore)** | Heavily practiced by Morgh Groven and Fexrick Drall. Spread to desperate Neth archivists, Skald glacier-hunters, and penitent Vreken. |
| **Implied Barriers** | Requires access to the chain-graft surgical tradition only available in Frostmaw Holdfast and the Frozen Archive. Non-Groven can learn the technique but must undergo the surgical graft, which few cultures accept. |
| **Current Crisis** | The chains are breaking. Cragjaw's cold makes traditional iron brittle. Fexric Drall propose chardalyn alloy — stronger but causes madness on prolonged contact. |

### Apex
| Field | Detail |
|---|---|
| **Origin** | Sylas tracked Wyrd-creatures through the Frostwood Reach by tuning senses to silent vibrations of pine needles and damp earth. Stalked a conceptual entity for seven days. To achieve absolute sensory focus, paid with his hearing — completely deaf to kin, living in a silent predatory world. |
| **Region** | Frostwood Reach (Ironwood Heart) |
| **Practiced By (lore)** | Heavily practiced by Mist-Woven Mimir and Skald hunters |
| **Implied Barriers** | Requires cultures with predator-tracking traditions. Skald hunt in the Hunger Glaciers. Mimir track Wyrd in the mist. Other cultures lack the sensory training. |
| **Current Crisis** | The mist is learning to hide — fog that used to ripple and reveal Wyrd is becoming static and deliberately unresponsive. May be hiding something large that has moved through the Reach for months without leaving trace. |

---

## 5. Class-Lore Integration Matrix (Expanded)

This section applies the **WoW Classic Rule**: why can Race A be this class but Race B cannot? What cultural boundaries define access?

### 5.1 Hard Restrictions by Class

| Class | Primary Region | Hard Block | Subrace Gate | Narrative Unlock Available? | Lore Justification |
|---|---|---|---|---|---|
| **Animist** | Multi | Emberth, Fexrick, Myrathil, Tessen | Ordan, Sylen Astril, Clean Vreken, Morren, Rune Keeper Skald, Velun Neth | Yes (DM backstory: outsider trained by a wandering Animist) | Requires ancestral spirit-channeling. Emberth commune with volcanic entities (different paradigm). Fexrick see spirits as machine-failure states. Tessen isolation prevents access. Myrathil have no land spirit tradition. |
| **Arcanoneer** | Bryngloom | All non-Neth | Velun Neth only | No | Requires inability to lie (Neth-specific biological/legal trait). Contract-magic syntax requires Neth neurology. Non-Neth would breach First Contract terms causing soul-fading. |
| **Augur** | Nordhalla | Merryn, Ordan, Morren, Myrathil | Rune Keeper Skald, Astril, Tessen, Vreken | Yes (outsider who studied at the Frozen Archive) | Requires proximity to preserved dead (glacier-tombs) and access to Frozen Archive's runic mathematics. Cultures without burial-preservation can't maintain ancestral connection. |
| **Berserker** | Sundale/ Nordhalla | Mimir, Neth, Astril, Merryn, Ordan | Skald, Thrask Emberth, Morgh Groven | Yes (adopted into a Bloodhammer clan) | Requires Hunger Pact lineage or deliberate Blood-Heat adoption. Mimir too identity-fragile. Neth can't suppress contract-nature. Ordan reject self-destruction. |
| **Chronarch** | Cragjaw | All non-Cragjaw natives | Kethrin Fexrick, Ithran Groven, Tessen | Yes | Requires temporal-suspension training only available in Cragjaw. Outsiders have never learned it — needs Fexric gear-craft and Groven bone-knowledge. |
| **False Prophet** | Sundrift Vale | Skald, Thalren, Tessen, Emberth | Ordan, Unlit Astril, Morren | Yes | Requires a population desperate enough for manufactured meaning. Skald/Thalren too institutionally rigid. Emberth have the Dawn Vigil (competing faith). |
| **Gambit** | Iceheart/ Multi | Tessen, Skald, Ordan, Astril | Merryn, Breakers-Born Myrathil, Kessen Neth, Ithran Groven | Yes | Requires risk-calculation culture. Tessen too isolated. Skald view gambling as dishonorable. Ordan too pragmatic. Astril too spiritually governed (spirit forbids chance). |
| **Harbinger** | Nordhalla/Vale | Merryn, Thalren, Morren, Neth | Sylen Astril, Solvarn, Rune Keeper Skald, Ordan | Yes (rare — outsider who glimpsed the end) | Requires cultural proximity to entropy. Merryn too opportunistic. Thalren too preservationist. Neth can't accept anything that breaks contracts. |
| **Inquisitor** | Bryngloom/ Frostwood | Emberth, Fexrick, Myrathil, Skald | Marked Vreken, Thalren, Unwoven Mimir, Morren | Yes | Requires Ghost-Mycelium or anti-Wyrd training. Emberth too hot for stealth hunts. Fexrick too mechanical. Myrathil too distant from surface Wyrd. |
| **Lunarch** | Frostwood | All non-Briaran, non-Mimir | Briaran, Mimir, Thalren | Yes (must enter moonlit groves and be chosen) | The lunar parasite responds to Viridane blood specifically. Non-Briaran can be chosen at the fae's whims, but the Briaran are the native carriers. Mimir's fetch-bond creates compatibility. |
| **Martyr** | Sundale | Skald, Tessen, Merryn, Ordan, Neth, Mimir | Solvarn, Korr Emberth, Velun Neth | Yes (adopted into Dawn Vigil) | Requires theological framework for willing suffering. Solvarn have sun-vigil. Korr have Vault-Breath. Others too survival-pragmatic. |
| **Minstrel** | Iceheart | Tessen, Cragjaw natives, Thalren, Ordan | Merryn, Breakers-Born Myrathil | Yes | Requires maritime culture with oral-performance tradition. Tessen too isolated. Cragjaw too vertical. Thalren too archival. |
| **Plaguebringer** | Bryngloom | All non-Bryngloom natives | Drun Neth, Morren outcasts, Vreken | No | Requires unique fungal-bog ecosystem only in Bryngloom. Drun Neth's partial-death allows hosting. Morren desperation drives acceptance. |
| **Pyrofiend** | Sundale | Neth, Mimir, Myrathil, Groven, Briaran | Solvarn, Thrask Emberth, Skald outcasts | Yes (an outcast who found Scathrach) | Requires proximity to Scathrach's influence. No Ordan/Morren would willingly pact with a demon. Cold-adapted cultures reject fire-pacts. |
| **Revenant** | Bryngloom | Emberth, Myrathil, Astril, Fexrick | Clean Vreken, Drun Neth, Morren, Tessen | Yes | Requires cultural acceptance of undeath as obligation-continuation. Reframing undeath as contract renewal is Neth/Vreken-specific. |
| **Shaper** | Frostwood/ Cragjaw | **Humans (all), Emberth, Neth, Myrathil, Briaran** | Mist-Woven Mimir, Morgh Groven | No (biological limit) | Requires biological form-shifting. Humans can't physically reshape. Emberth too mineral-dense. Neth contract-locked. Myrathil too fluid to hold form. |
| **Spellguard** | Sundale | Myrathil, Ordan, Groven, Briaran | Velun Neth, Thalren, Solvarn, Emberth | Yes | Requires volcanic forge-tradition and Solbrand energy. Neth Velun provide magic cancellation. Thalren provide anti-Wyrd paranoia. |
| **Toxicologist** | Frostwood | All non-Frostwood natives, Emberth, Fexrick | Thalren, Unwoven Mimir, Morren, Briaran | No (region-locked reagents) | Requires reagents unique to Frostwood. Fexrick too mechanical. Emberth too hot (toxins denature). |
| **Warden** | Cragjaw | Merryn, Ordan, Astril, Emberth | Morgh Groven, Fexrick Drall, Neth Kessen, Skald, Vreken | Yes (must undergo surgical graft) | Requires chain-graft surgery only in Frostmaw/Frozen Archive. Non-Groven can learn but must accept surgical alteration. |
| **Apex** | Frostwood | Emberth, Neth, Myrathil, Tessen | Mist-Woven Mimir, Skald hunters, Vreken | Yes | Requires cultures with predator-tracking traditions. Others lack sensory training. |

### 5.2 Cultural Spin Analysis

For each race/subrace, here is how they *differently practice* the same class:

| Race/Subrace | Class | Cultural Spin |
|---|---|---|
| **Thalren** | Animist | Through the Sovereign Ledger — spirits are catalogued, summoned by chained journal entries, each summoning a bureaucratic act of memory-preservation |
| **Ordan** | Animist | Throat-sung spirit-channeling, the totem is woven from the steppe-horse's mane, the ancestor speaks through harmonic overtones |
| **Vreken** | Animist | Fungal-spore invocation — the loa are inhaled, the spirit speaks through bioluminescent patterns on the skin |
| **Skald** | Berserker | The Hunger Pact is literal — the first Berserker rage was born from consuming one's own dead to survive. Every rage is a partial reliving of that meal |
| **Thrask Emberth** | Berserker | Blood-Heat is geothermal, not ancestral. They burn because the caldera burns, not because of what their ancestors ate |
| **Merryn** | Gambit | Sea-omen gambling — the dice are weighted with salt-coral, the stakes are always voyage-shares, the loss is always someone else's debt added to yours |
| **Myrathil** | Gambit | Tide-probability reading — the odds are written in foam patterns, the gamble is with the sea mother herself, and the payment is always in memory |
| **Neth** | Gambit | Contract-probability calculation — every hand of cards is a clause analysis, the opponent's tells are legal vulnerabilities, the prize is always a renegotiated term |
| **Solvarn** | Martyr | The sun is the template — every wound accepted is a small death in imitation of Sol's entombment, suffering is prayer |
| **Korr Emberth** | Martyr | The Vault-Breath is the template — accepting suffering is keeping vigil, every hit absorbed is another minute of silence in Sol's tomb |
| **Briaran** | Lunarch | The parasite is fae-contract enforcement — the thorn-blood remembers what the fae loaned, the moon phases control the debt's interest |
| **Mimir** | Lunarch | The parasite bonds to the fetch — the lunar parasite replaces the stone mask as identity anchor, the Mimir wears the moon instead |
| **Groven** | Warden | The chains are Vat-Sleep grounding — the Groven Warden tethers enemies to remind themselves what imprisonment felt like in the alchemical vats |
| **Fexrick** | Warden | The chains are mechanical calibration — the Fexrick Warden treats tethering as engineering, the tension is a gear ratio to be optimized |

---

## 6. The Frost-Tithe (formerly Milk-Grief) — COMPLETE

### 6.1 What It Is

The Frost-Tithe is Keth-Amar's birth-debt on the **Rime-Born** of Nordhalla — the bargain's interest collected on each new generation. Manifestation:
- During labor, ambient temperature plummets, frost crawls walls, water freezes
- Mother's warmth is drained into the child — not as biology, but as the bargain's debt collection
- 3/10 mothers freeze to death during delivery
- Surviving infants (Frostbound): blue skin, brittle as thin ice, marked by Keth-Amar's lingering attention
- Quieted with Ice-Cradles: hollows carved into living glacier faces where the deep cold suppresses the tithe's pull

**References:** `rulesData.js:319,343,750`, `GM_WORLD_GUIDE.md:112,138,1171-1173`, `loreDictionary.js:594`

### 6.2 The Objection (Historical)

Problems with the original "Milk-Grief" name:
1. **Name** — "Milk-Grief" was tonally dissonant. "Milk" evokes nourishment and infancy — the opposite of freezing death.
2. **Mechanistic framing** — read as a medical condition (mortality rate, symptoms, Cradle-Forges) rather than a supernatural curse.
3. **Frostbound identity crisis** — simultaneously an NPC faction, a creature type, a biome encounter, and a talent tree reference, but none of these were connected.

### 6.3 Decision — Frost-Tithe (Chosen)

- Renamed to **"The Frost-Tithe"**
- Reframed as Keth-Amar's bargain-interest: every frost-touched birth pays a life to the cold. The child survives by absorbing the mother's warmth as the bargain's interest.
- Frostbound are children marked by Keth-Amar's attention before birth.
- Cradle-Forges replaced with **Ice-Cradles**: hollows carved into living glacier faces.
- All references updated across rulesData.js, GM_WORLD_GUIDE.md, loreDictionary.js.

---

## 7. Background Availability & Character Creation Logic

### 7.1 Current State: Zero Restrictions

`rulesData.js:1530` explicitly states: *"Your Race, Class, and Background are entirely independent choices. There are no restrictions."* All 15 backgrounds in `backgroundData.js` have no `restrictions`, `allowedRaces`, or `allowedRegions` fields. The Zealot background in `enhancedBackgroundData.js` is a generic fantasy archetype with no Mythrill-world ties.

### 7.2 The Implicit Problem

Every background is deeply tied to specific regions — "Frost Chanter" is Nordhalla-specific by description, "Emberspire Pilgrim" is Sundale-specific, "Merrow Sailor" is Iceheart-specific — yet any character from any region can select them. A Tessen character who has never left their sealed keep can take "Merrow Sailor." A Fexrick who has never seen open sky can take "Shyr Runner."

### 7.3 Universal Backgrounds (Available to All Races/Regions)

These backgrounds describe trans-regional archetypes or internal character traits rather than specific geographic training:

| Background | Why Universal |
|---|---|
| **Bloodline Heir** | Any race/subrace can be born into a noble house — even erased/subjugated ones (though with narrative tension for erased bloodlines) |
| **Hush Survivor** | Any character could have traveled to the Bryngloom and survived the spore-hush — though should require a narrative reason for being there |
| **Monolith Hunter** | The seven Monoliths are scattered across all regions; any character could hunt them |
| **Forge Wright** | Every region has some form of metalworking; the flavor shifts by region |

### 7.4 Region-Locked Backgrounds (Restricted by Birth Region)

These backgrounds describe training or experience that requires physical presence in a specific region for a significant period:

| Background | Default Region | Default Subraces | Why Locked |
|---|---|---|---|
| **Emberspire Pilgrim** | Sundale | Solvarn, Korr Emberth, Thalren | The pilgrimage to Emberspire is a specific journey requiring proximity to Sundale. Outsiders can take it with a narrative reason for the pilgrimage. |
| **Shyr Runner** | Sundale | Thrask Emberth, Solvarn | The Basalt Shyr is a 90-mile road in Sundale. Running it requires Sundale geography knowledge. |
| **Ledger Keeper** | Frostwood Reach | Thalren | The Sovereign Ledger and Scribe-Cartel are Frostwood-specific. Exclude: Ordan (Steppe-Staves), Skald (runic genealogy), Tessen (khipu-cords) — they use different record-keeping systems. |
| **Sumps Veteran** | Nordhalla | Skald, Rime-Born | Bloodhammer Sump skirmishes and Hunger Glacier defense are Nordhalla-specific. |
| **Frost Chanter** | Nordhalla | Skald, Rime-Born, Corvani | Requires Nordhalla oral-history training and the specific context of Járn-Tand's cultural suppression. |
| **Debt Negotiator** | Bryngloom | Neth, Morren | Neth contract law (First Contract, Great Registry) is Bryngloom-specific. Exclude: Skald, Ordan — neither uses written contract law. |
| **Gloomway Trader** | Bryngloom | Neth, Morren, Vreken | Requires knowledge of Bryngloom Toll-Dikes, Mist-Gate Market, and peat-oil trade routes. |
| **Shanty Rat** | Bryngloom | Morren, Drun Neth, Marked Vreken | The Over-Shanty is beneath Atropolis specifically. A non-Bryngloom native has never been there. |
| **Merrow Sailor** | Iceheart Sea | Merryn, Breakers-Born Myrathil | Requires Iceheart Sea maritime knowledge. Exclude: Tessen (sealed keep), Ordan (steppe nomads), Astril (crystalline bodies may not float). |
| **Peak Tracker** | Cragjaw | Tessen, Groven, Fexrick | Requires knowledge of Ancestor-Spans and Cragjaw geography. |
| **Synod Academic** | Sundrift Vale | Ordan, Sylen Astril | Requires access to Synod-Hold crystal archives and steppe scholarship. |

### 7.5 The Zealot Problem — DECIDED

**Decision: Remove the Zealot entry. It is a remnant of the old discipline system.**

Zealot was never a background — it was a former discipline entry left behind when disciplines were removed. No integration needed, just delete the Zealot entry from `enhancedBackgroundData.js` (or the whole file if nothing else depends on it).

---

## 8. Geographic Bloat Analysis

### 8.1 Nordhalla Zones (12 zones)

| Zone | Type | Redundancy Verdict |
|---|---|---|
| Frozen Archive | Capital | — |
| Bloodhammer Sump | Settlement | — |
| Fjord-Gate | Settlement | — |
| Hunger Glaciers | Wilderness | — |
| Rimor's Hearth | Ruin | — |
| Ymir's Col | Wilderness | — |
| Vargtor | Settlement | — |
| Frostcirque | Ruin | Redundant with The Still Crag (both are ritual/religious sites with Stel/Skrei creatures) |
| The Still Crag | Wilderness | See above. Has unique Warden's Breath lore worth preserving as sub-location |
| Rook's Promontory | Wilderness | Corvani-specific. Keep if Corvani remain relevant |
| The Black Firth | Wilderness | Setting description, not a destination. Fold into Fjord-Gate |
| Vespera's Perch | Settlement | Corvani-specific. Keep if Corvani remain relevant |

**Recommendation:** Cut or merge 2 zones.

### 8.2 All Regions

| Region | Current Zones | Target | Candidates for Merge/Cut |
|---|---|---|---|
| Sundale | 13 | 10 | Cinder Strait (transitional — fold into Basalt Shyr) |
| Sundrift Vale | 12 | 10 | Ancestor Wold + Ancestor Mounds (keep both, distinct enough) |
| Bryngloom | 12 | 10 | Root-Veil Scriptorium (fold into Atropolis) |
| Cragjaw | 12 | 10 | Reduce redundancy in mine/tunnel locations |
| Frostwood | 13 | 10 | Mistbarrow (redundant with Wraithfen) |
| Nordhalla | 12 | 10 | Black Firth → Fjord-Gate; Frostcirque + Still Crag merge |
| Iceheart Sea | 12 | 10 | Reduce port redundancy |

---

## 9. Logistical Realism & Trade Analysis

### 9.1 What Each Region Produces & Needs

| Region | Exports | Imports | Key Trade Partners |
|---|---|---|---|
| **Nordhalla** | Iron ore, mammoth skins, walrus ivory, whale oil, cold-iron, glacier ice | Grain, salt, southern manufactured goods | Iceheart Sea (maritime route via Black Firth) |
| **Frostwood Reach** | Ironwood timber, soot-resin ink, peat-parchment, memory-glass | Whale oil (for lamps), grain | Iceheart Sea (via Skald's Longport) |
| **Sundale** | Obsidian, high-temp alloys, volcanic sulfur, geothermal coal, Solbrand steel, fire-coral | Ice-melt water, woolly herd-hides, timber | Sundrift Vale (hides), Iceheart Sea (maritime), Cragjaw (alchemical trade) |
| **Iceheart Sea** | Whale oil, bioluminescent organisms, thermal crystals, fire-coral, dried fish | Grain, metal goods | All regions (central maritime hub) |
| **Cragjaw Peaks** | Alchemical reagents, bone tools, geothermal heat | Food (terraces cooling — may need grain imports soon) | Nordhalla (geothermal pipes), Iceheart Sea (Fexric guilds vs Neth) |
| **Sundrift Vale** | Wool, hides, steppe-horses, fermented mare's milk, dried mutton | Metal tools, salt | Bryngloom (forest-steppe edge trade), Sundale (via Cragjaw) |
| **Bryngloom Forest** | Memory-glass, bog-preserved ironwood, alchemical moss, fungal lights, peat-oil | Wool, hides, metal goods | Sundrift Vale (forest-steppe edge), Iceheart Sea (via Ironjaw Port) |

### 9.2 Trade Routes & Infrastructure

| Route | Mode | Controlled By | Logistical Notes |
|---|---|---|---|
| Black Firth → Iceheart Sea | Maritime | Icechamber Syndicate (Nordhalla) | Primary iron ore + whale oil export route. Syndicate sets prices. |
| Ember Lagoon → Merrowport | Maritime (200 mi, 4 days) | Sulfur Cartel / Brine-Bond Syndicate | Sundale's only warm-water port. First trade agreement signed Year 88 Dimming. |
| Synod Hold → Emberspire | Overland (80 mi, 3 days via Ash-Road) | Thrask toll-collectors | Caravan trail marked by charcoal cairns. Thrask demand tolls in blood-ore. |
| Ancestor-Spans (Cragjaw) | Bridge network | Groven toll-keepers | Only safe passage through Cragjaw. Bridges are calcified Groven dead. Cracking with age. |
| Forest-Steppe Edge | Land trade | Morren outpost / Ordan caravans | Bryngloom exchanges fungal lights, memory-glass, bog reagents for Ordan wool and hide. |
| Ironwood Palisade (Frostwood) | Land checkpoint | Scribe-Cartel | Petrified timber check-posts taxing journals and verifying legal identity. |
| Toll-Dikes (Bryngloom) | Canal/river gates | Neth Velun | Living ironwood gates across swamp channels. Covenant-Scrolls required for passage. |
| The Shyr (Sundale) | Land road (90 mi) | Thrask patrols | Basalt highway. Only safe route in Sundale. Alternative paths pass through Wyrd-rifts. |

### 9.3 Cartels & Monopolies

| Cartel | Region | Commodity | Logistical Impact |
|---|---|---|---|
| Scribe-Cartel | Frostwood Reach (+ maybe Bryngloom) | Ink, parchment, journals | Controls who gets recorded as a citizen. Without ink, you don't exist in the Ledger. |
| Icechamber Syndicate | Nordhalla | Iron ore, mammoth skins, walrus ivory, grain imports | Forces low export prices, sells grain at life-threatening rates. Nordhalla is a colonial extraction economy. |
| Sulfur Cartel | Sundale | Coal, sulfur, Solbrand steel | Priests control all heat and metal. Dawn Vigil diverts resources to Monolith reforging. |
| Brine-Bond Syndicate | Iceheart Sea | Whale oil, voyage bonds | Fractional voyage-shares lock crews in permanent debt. Steam-trawlers pollute channels. |
| Steam-Line Cartel | Cragjaw Peaks | Geothermal heat, runic pipes | Controls who stays warm. Demands heavy tribute. Terraces cooling = food crisis looming. |
| Peat-Debt Bondage | Bryngloom | Memory, lifeline mortgages | Neth control who exists legally. Postmortem Corvée conscripts corpses for labor. |

### 9.4 Logistical Inconsistencies Found

**#1: Scribe-Cartel spans two regions unclearly. — DECIDED**
The Cartel is introduced as a Frostwood entity controlling ink/parchment (`rulesData.js:267,308`), yet also controls Bryngloom's memory-glass and alchemical moss exports (`rulesData.js:609`). **Decision: Scribe-Cartel is Frostwood-only.** The Bryngloom reference in `rulesData.js:609` is an error — it should reference the Neth Regency's trade monopoly (First Contract, Great Registry). The Neth control memory-glass and alchemical moss through their contract system, not the Scribe-Cartel.

**#2: "Southern grain" is never sourced. — DECIDED**
Nordhalla receives "life-saving grain and salt" from the Icechamber Syndicate (`rulesData.js:357`). The Iceheart Sea trades "southern grain for northern whale oil." **Decision: Sundrift Vale is the grain source.** The Ordan steppe culture produces herds AND grain (Synod Hold explicitly trades grain as a commodity). Grain ships from Synod Hold → Iceheart Sea ports → Nordhalla via the Icechamber Syndicate. Add an explicit text reference in `rulesData.js:357` naming Sundrift Vale / Synod Hold as the origin.

**#3: Cragjaw food deficit not explicitly connected to imports.**
Cragjaw's geothermal potato-terraces are cooling (`rulesData.js:487`), creating a food crisis. Every other region's deficit is explicitly connected to an import source. Cragjaw's is not. They likely need grain from Sundrift Vale or Sundale, but the text never states this.

**#4: Sundale imports "woolly herd-hides" via Cragjaw chokepoint.**
Sundale's hide imports logically come from Sundrift Vale. The overland route requires crossing Cragjaw's Ancestor-Spans — controlled by Groven tolls and cracking with age. If the Spans collapse, Sundale loses its hide supply. This is a potentially interesting vulnerability but is nowhere acknowledged in the text.

**#5: Nordhalla's economy is a colonial extraction trap.**
The Icechamber Syndicate controls both export prices (low) and import prices (high), creating a classic colonial dependency. This is thematically rich but extremely extreme — Nordhalla has no economic agency at all. This may be intentional (tragic setting), but it should be acknowledged as a deliberate design choice.

---

## 10. NPC Redundancy

| NPC | Role | Overlaps With | Verdict |
|---|---|---|---|
| Jarl Eirik Skalvyr | Outlander rebel leader | Khan Orda (steppe ally, also a rebel) | If connected, make explicit. If not, cut one. |
| Mara of the Badlands | Sundale smuggler | Shyr Runner (player background) | Either Mara is the archetypal Shyr Runner NPC, or cut one. |
| High-Oracle Skari | Blind scholar rewriting Frost-Tithe | — | Keep (unique goal — ties to the birth-curse plot) |
| Sylvain of the Unwoven | Mimir rebel | — | Keep (unique) |

---

## 11. The Human Debuff Problem — DECIDED

**Decision: Option A — Add universal weaknesses to every race.**

**Current state:** All Humans share "Mortal Frailty" (-10% base HP) and "The Short Straw" (+25% damage from necrotic/aging/time effects). Only universal strength: "Desperate Will" (+2 Spirit, advantage vs Fear/Charm/Domination).

**Problem:** No other race has an equivalent universal penalty.

**Selected approach — universal weaknesses per race:**
- Mimir: Maskless penalty (cannot use identity-based magic without a mask)
- Drun Neth: Cannot use magic (already in lore, not mechanically enforced)
- Fexrick: Mechanical grafts attract lightning/Wyrd damage
- Astril: Constellation-spirit can override body during stress
- Myrathil: Must stay hydrated or suffer damage
- Emberth: Cold vulnerability
- Briaran: Thorns cause social penalties + occasional HP loss from snagging
- Groven: Vat-Sleep leaves disoriented after long rests
- Vreken: Fungal Hush addiction vulnerability

**Option B (Rejected — Remove The Short Straw, replace with a universal advantage):**
- "Adaptive Resilience": +1 to any saving throw per long rest
- "Desperate Innovation": Once per day, reroll a failed skill check

---

## 12. Meticulous Action Plan

### Phase 1: Canon Contradictions — COMPLETE (1.1, 1.2)
- [x] Resolve Silent Seventh (Viridane = original 7th, Morrath = replacement)
- [x] Unify Bryngloom bargain origin (Morrath = admin regency, Neth = true holders)
- [x] Decide rename direction: Keep Warden as class name (no rename needed)

### Phase 2: The Frost-Tithe — COMPLETE
- [x] Decision: Frost-Tithe direction chosen (Keth-Amar's bargain-interest framing)
- [x] Edit `rulesData.js` (Nordhalla section + bullet list) — renamed, reframed
- [x] Edit `GM_WORLD_GUIDE.md` (Nordhalla section + Historical Scars section) — renamed, Cradle-Forges → Ice-Cradles
- [x] Edit `loreDictionary.js` (rime_born entry) — renamed, Keth-Amar tie-in
- [x] Edit `creatureLibraryData.js` (Myling/Frostbound creature) — renamed
- [x] Edit all "Frostbound" references to align with new naming

### Phase 3: Race/Class/Background Restrictions
- [ ] Add `restrictions` field to all class data files (21 files)
- [ ] Add `restrictions` field to backgroundData.js (15 backgrounds)
- [x] Zealot decision: remove — remnant of old discipline system, not a background
- [ ] Build validation function in character creation (characterUtils.js)
- [ ] Implement tiered restriction system (Hard Block / Subrace Gate / Narrative Unlock)

### Phase 4: Geographic Consolidation
- [ ] Merge Frostcirque + The Still Crag
- [ ] Fold The Black Firth into Fjord-Gate
- [ ] Merge Mistbarrow into Wraithfen
- [ ] Fold Cinder Strait into Basalt Shyr
- [ ] Target: 8-10 zones per region
- [ ] Add explicit Cragjaw food-import trade partner to text

### Phase 5: Human Debuff Rebalance
- [x] Decision: Option A — add universal weaknesses to all races (equal trade-off)
- [ ] Implement weakness for each race per Section 11 list

### Phase 6: Corvani Decision
- [x] Decision: Corvani are creature/NPC-only — strip mechanical scaffolding
- [ ] Remove Corvid-Speech from languages.js
- [ ] Remove Corvani from class-practiced-by lists
- [ ] Mark Corvani NPCs as "GM-only creature race"

### Phase 7: Class Overlap Audit
- [x] All kept — distinct paradigms confirmed (see 3.4)
- [x] Warden class name kept as-is (collision with cosmic entity is manageable)

### Phase 8: Logistical Consistency
- [x] Scribe-Cartel scope: Frostwood only. Bryngloom reference is an error (should be Neth Regency)
- [x] Southern grain source: Sundrift Vale (Synod Hold / Ordan steppe)
- [ ] Fix `rulesData.js:609` — change Scribe-Cartel → Neth Regency monopoly
- [ ] Add explicit text in `rulesData.js:357` naming Sundrift Vale as grain origin
- [ ] Add Cragjaw food-import dependency to text
- [ ] Add Sundale hide-supply vulnerability via Cragjaw chokepoint to text

### Phase 9: NPC Consolidation
- [ ] Audit all named NPCs for duplicate roles
- [ ] Connect or cut overlapping rebel-leader archetypes

---

## Appendix: Files Touched in Phase 1

| File | Edit |
|---|---|
| `vtt-react/src/data/rulesData.js` | The Refusal + The Silent Seventh rewritten |
| `vtt-react/src/data/loreDictionary.js` | briaran, silent_seventh, house_viridane entries updated |
