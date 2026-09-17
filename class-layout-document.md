# Mythrill VTT — Comprehensive Class Layout Document

> **Status:** Canonical Master Lore Update (era-relative Master Timeline of the Freezing Era).
> Compiled from all 20 class data files in `vtt-react/src/data/classes/`

---

## CLASS HERITAGE TAXONOMY
1. **Pre-Binding Classes (Traditional / Mortals):** Berserker, Apex, Minstrel, Warden, Toxicologist (steel, black powder, matchlocks, cold iron, physical mastery, survival tactics).
2. **Celestial Bargain Classes (Infused Houses):** Spellguard, Arcanoneer, Chronarch, Shaper (direct elemental control born from Celestial pact).
3. **Vreken Extortion (Blight Magic):** Blight-Weavers and Decay specialists (extorted divine desperation for ultimate power).
4. **Cosmic Collision Classes (Post-Keth Amar):** Harbinger, Plaguebringer, Revenant.
5. **Hazard Pact Classes (The Debt-Bound):** Gambit (Mael-Zhul's ledger, the House's line of credit) and Pyrofiend (claimed by the Emberspire collision and indentured to Scathrach, the will that grew out of the fire).

---

### 1. Animist (Support / Control / Terrain | Resonance)

**Description:** A walking archive of three dead traditions, written in scars, bone spurs, and spiritual static. The Animist channels three ancestral traditions — totemic bone eruption, spirit curse-invocation, and runic inscription — simultaneously, paying for every manifestation through the mounting toll of Spirit Erosion. They are a tragic, triple-blooded controller whose body physically transforms as they work.

**Cultural Affiliation:** The class is practiced by the Ordan humans (throat-sung totemic tradition), Vashir Astril (Lumia heritage conduit), Silath Astril (silent star-communion through the moon-courtyard rite), Rune Keeper Skald (scar-rune inscribers), Morgh Groven (vat-substrate choirs), Waste-Solari (ash-choir readers of the caldera funeral slopes), Viridian Florae (cantors of the Unwritten dead), and Oken Florae (grove-litany graft-bearers). The Animist tradition was born from three independent ancestral-communion discoveries fused into one art; the ancestral language is now fracturing.

**Subraces allowed:** `ordan_human`, `skald_human`, `vashir_astril`, `silath_astril`, `morgh_groven`, `thrask_solari`, `viridian_florae`, `florae_unified`

**Flaw / World Weaving:** Triple catastrophic flaw — Spirit Erosion at 15+ Resonance: 100% ember vulnerability, cannot receive party healing, forced movement shatters active runic networks dealing backlash, and the spirits demand service with 1d6 wyrd/turn if you hoard resonance without invoking. The ancestral language is fragmenting across the three traditions — young Animists attempting all three simultaneously suffer complete sensory collapse. Persecuted in Nordhalla (Runic Academies denounce ancestral communion) and Sundrift Vale (House Ordavan purges Sky-Singers).

**Class Hooks:**
- `ordan_human` → The Steppe-Throat: throat-sung overtones carry across vast open distances, fails indoors/underground
- `vashir_astril` → The Heritage-Conduit: channels dead-world Lumia memory through crystalline skin, strongest in absolute darkness
- `silath_astril` → The Star-Communer: channels the dead star's consciousness through the moon-courtyard rite; silent, invisible, strongest motionless beneath the open moon
- `morgh_groven` → The Vat-Mouth: communes through the calcified substrate of dead vats; the alchemical dead are still arguing in the slurry
- `thrask_solari` → The Ash-Choir: reads funeral ash-fall from the caldera slopes; the ancestors answer in ember-crack and soot-pattern
- `viridian_florae` → The Thorn-Cantor: gives voice to the Unwritten dead of House Viridane; every summoning must speak the name aloud or the erased slide back
- `florae_unified` → The Grove-Litany: carries ancestors in pocket-sized splinter-grafts; the only Animist variant that can practice inside a city
- `skald_human` → The Rune-Keeper: carves ancestors' names into own skin, each rune a permanent open wound

---

### 2. Apex (Damage | Marks)

**Description:** A master of close-range combat wielding the legendary Shadow Glaive capable of chaining deadly strikes between multiple enemies, accompanied by a loyal beast companion. Through the Marks system, she builds power through pack coordination — glaive hits alone generate no marks; it is the synchronized rhythm of hunter and beast that fills the reservoir.

**Cultural Affiliation:** Heavily practiced by the Woven Mimir (fog-sentinels), Masked Mimir (identity-stable trackers), Unwoven Mimir (fog-merged hunters), Skald humans (glacier-stalkers), Clean Vreken (bioluminescent spoor-trailers), Marked Vreken (mycelial web-sense trackers), and Ordan humans (steppe-scent trackers). The Silent Hunt tradition was founded by Sylas, who traded his hearing for absolute sensory focus to track native creatures and Wyrd entities through the Frostwood fog.

**Subraces allowed:** `veiled_mimir`, `tethered_mimir`, `skald_human`, `clean_vreken`, `marked_vreken`, `ordan_human`, `vashir_astril`, `thrask_solari`

**Flaw / World Weaving:** Kill the Beast, Cripple the Hunter — a dead companion means ZERO Marks until revived. If companion drops below 25% HP while you have 3+ Marks, the beast enters Primal Outrage (double damage but attacks nearest creature, friend or foe). Companion death causes Bond Sickness for 3 rounds. The mist is learning to hide — something is teaching the fog to actively evade Apex senses that have held for centuries; Unwoven trackers who dissolve into the fog to find it are not coming back.

**Class Hooks:**
- `veiled_mimir` → The Mask-Hunter: the Arch mask holds identity stable while senses range; perception cannot be eroded by the fog while the mask is intact
- `tethered_mimir` → The Sentinel-Tracker: tracking-acuity amplified inside a sworn perimeter (settlement, palisade, camp)
- `skald_human` → The Glacier-Stalker: reads frozen tracks in permanent frost; acuity collapses on thawed/warm terrain
- `clean_vreken` → The Glow-Trailer: reads bioluminescent spoor-trails in the mycelial network; tracks creatures leaving no physical trace
- `marked_vreken` → The Mycelium-Scent: feels prey movement through Root-Veil vibrations in their own skin
- `ordan_human` → The Steppe-Scent: tracks across open terrain through scent and kinetic vibration; wind has started lying
- `vashir_astril` → The Steppe-Stalker: reptilian heat-sight reads body-warmth across open ground; cool body makes them invisible to warmth-hunting prey
- `thrask_solari` → The Ash-Stalker: reads footfalls in scoria and heat-memory in lava-glass, runs with an ash-hound; fails on cold, wet, or grown ground

---

### 3. Arcanoneer (Damage / Utility | Elemental Spheres)

**Description:** A clinical, hyper-precise contract-mage whose spells are written as strict legal clauses and filed with Morvane. Each elemental sphere is a clause and each weave a document; Morvane rejects internally inconsistent weaves with severe prejudice. The craft is channeled through a crystal focus, scroll, or memory-glass lens — no grafts, no cannons. A Nethien Arcanoneer who contradicts themselves may void every contract they have ever filed.

**Cultural Affiliation:** The Nethien (contract-syntax), the Clockwork Fexric (guild engineering), the Caustic Fexric (salvage improvisation), and the Stargazer Astril (starlight cycles). Valerius drafted the Grand Nomenclature from the First Contract's syntax in the Heart-Vault, and the schism between the Fexric lineages was forged in the Underground Proving Grounds.

**Subraces allowed:** `velun_neth`, `kethrin_fexric`, `drall_fexric`, `vashir_astril`

**Flaw / World Weaving:** The Nethien line requires contract-neurology; the Fexric and Astril walk their own roads into the same grammar. The Canopy-Ledger is fractured — senior Arcanoneers cannot agree on the Nethien Contingency Protocol, and the bark of the Heart-Vault has begun refusing certain clause-copies without explanation. If the Contract collapses, every filed weave is voided with it.

**Class Hooks:**
- `velun_neth` → The Contract-Weaver: every sphere a clause, every weave filed; consistency is survival
- `kethrin_fexric` → The Gear-Weaver: guild-certified combinations only, executed through regulators and thermal sinks; flawless within tolerances, incapable of improvisation
- `drall_fexric` → The Scrap-Weaver: jury-rigged catalysts, no certified matrix, 25% backlash, combinations the guild has never seen
- `vashir_astril` → The Star-Charted Weaver: the eight frequencies as starlight cycles; mistimed transits fade rather than detonate

---

### 4. Augur (Control / Debuffer | Benediction & Malediction)

**Description:** A tragic seer of the immediate gutter who reads the future in fresh gore, spilt blood, and splintered marrow. Every d20 roll within 60 feet speaks — Even results generate Benediction (preemptive evasion and warding), Odd results generate Malediction (crippling curses and agonizing rot). They do not predict broad cosmic destinies; they track the exact trajectory of a blade.

**Cultural Affiliation:** Heavily practiced by Skald humans (glacier-haruspex reading glacier-elk entrails at the Frozen Archive), Vashir Astril (star-viscera readers whose Lumia heritage echoes forward through crystalline skin fractures), Silath Astril (suppressed oracles whose gagged Lumia heritage leaks prophecy involuntarily), Tessen humans (keep-prophets reading the cracks of crumbling architecture), Clean Vreken (bog-gore diviners reading peat-mummified corpses), Marked Vreken (mycelium-haruspex reading bioluminescent bloom-patterns), Veldun (web-tallies reading the obligation-web's tension), Hollow-Solari (Sol's Breath-Readers keeping a four-century vigil over the dying star's flicker-patterns), and the Myrathil (trench-, tide-, and current-readers who read the preserved deep-dead and what the waters return).

**Subraces allowed:** `skald_human`, `vashir_astril`, `silath_astril`, `tessen_human`, `clean_vreken`, `marked_vreken`, `kessen_neth`, `korr_solari`, `shoreling_myrathil`, `deepling_myrathil`, `riverling_myrathil`

**Flaw / World Weaving:** Magic demands fresh violence — if no bleeding targets or fresh corpses are present within 60 feet, omen spells cannot perceive the future; the Augur must carve into their own flesh. The star-arithmetic is failing — accuracy has dropped from 93% to 41%. The entrails are returning contradictory results. The phenomenon began on the same day as the first Harbinger contradictions — the timeline is fracturing.

**Class Hooks:**
- `skald_human` → The Glacier-Haruspex: reads sacrificed glacier-elk entrails against frozen ground, extending the reading window against glacier-ice
- `vashir_astril` → The Star-Viscera Reader: visions manifest as stress-fractures in crystalline skin; now sees futures that are vividly clear and entirely wrong
- `silath_astril` → The Suppressed Oracle: gagged Lumia heritage smuggles prophecy past its own bindings as involuntary vivid flashes
- `tessen_human` → The Keep-Prophet: reads the future in stress-fractures of crumbling architecture, the dying keep as entrail
- `clean_vreken` → The Bog-Gore Diviner: reads the future in peat-mummified corpses; the bog has stopped returning its dead
- `marked_vreken` → The Mycelium-Haruspex: reads bioluminescent bloom-patterns across their fungal network; the network is now looping the same prophecy
- `kessen_neth` → The Web-Tally: reads the obligation-web's tensions as omens; the web and the Reckoner's ledger are both ledgers, and both are coming up short
- `korr_solari` → The Sol's Breath-Reader: reads the dying star's flicker-patterns in wordless vigil; reads in centuries, not minutes, and the dimming-rate is accelerating
- `deepling_myrathil` → The Trench-Haruspex: reads the drowned dead preserved in abyssal cold and pressure; longest reading window in the tradition, paid for in hours of ascent
- `shoreling_myrathil` → The Tide-Reader: reads the future in what the sea returns to the tide-line, and in the order it surrenders it
- `riverling_myrathil` → The Current-Haruspex: reads the standing-wave patterns of river confluences; works far inland, but a drought reads nothing but mud

---

### 5. Berserker (Damage | Rage)

**Description:** A tragic, high-risk warrior whose body is a self-destructive engine of war. The Berserker channels the Hunger Pact — a physiological meltdown called Rage (0-100), where adrenaline boils their blood and snaps their tendons to force inhuman strikes. Pain Immunity blocks all incoming healing while raging. At the edge of death, their strikes bypass all physical resistances.

**Cultural Affiliation:** Heavily practiced by the Skald humans (Hunger-Pact Sworn, inheritors of the ancestral feast, whose rage is a liturgy of eating the dead to survive), Waste-Solari (Caldera-Forged whose Rage is drawn from geothermal resonance rather than ancestry — an argument with the mountain), and Morgh Groven (Vat-Woken who burn dormant alchemy still circulating in stone-scaled veins — the serums that were meant to make them obedient instead make them catastrophically free).

**Subraces allowed:** `skald_human`, `thrask_solari`, `morgh_groven`

**Flaw / World Weaving:** Push Rage past 100 and trigger Metabolic Burnout — one round to dump it or take 2d6 unresistable damage and crash to 0. While raging (21+ Heat), Pain Immunity blocks all healing from allies. Two full rounds without dealing melee damage causes Pain Starvation. The Bloodhammer clans are fracturing — Unbound Berserkers manifest the Heat without the ancestral Pact ritual; the Skald Council ordered them executed, and there are rumors of an Unbound settlement forming in the deep volcanic tunnels.

**Class Hooks:**
- `skald_human` → The Hunger-Pact Sworn: Rage builds faster near the dying; rage is a liturgy, the consumed dead are carried
- `thrask_solari` → The Caldera-Forged: Rage rises faster near geothermal vents and magma-fractures; the mountain gives and takes freely
- `morgh_groven` → The Vat-Woken: Rage builds from regenerative biology fighting itself — ignites fastest when being *healed*, the opposite of every other tradition

---

### 6. Chronarch (Control | Time Shards & Temporal Strain)

**Description:** An accidental anchor — a dying mortal whose cells hum with temporal friction. They cast basic spells to bank Time Shards, then spend them on Flux abilities that violate causality (rewind, loop, displace). Every Flux deepens Temporal Strain; hit 10 and the timeline snaps back with a chaotic Backlash roll. The Chronarch carries no personal memories — their past is constantly erased by temporal feedback.

**Cultural Affiliation:** Heavily practiced by the Clockwork Fexric (gear-stitchers who built the gear-craft half of Nesta's engine and treat time as a mechanism with replaceable parts), Ithran Groven (bone-calibrators whose long limbs provide ideal substrate for the volcanic-glass gears interfacing with living bone), Tessen humans (keep-anchors who manipulate time to delay the arrival of a future their sealed-keep culture has been dreading for four centuries), and Nethien archivists (who externalize temporal feedback into memory-glass lattices and treat every moment as a filed entry).

**Subraces allowed:** `kethrin_fexric`, `ithran_groven`, `tessen_human`, `velun_neth`

**Flaw / World Weaving:** 50% vulnerability to Arcane and Blight damage. Forced movement/shoves crack the internal clock — Dodge drops to 0 and triggers Temporal Backlash immediately. Light armor. Nesta, the founder, is disappearing — physical records are going blank, people are forgetting her. If she ceases to exist retroactively, every living Chronarch inherits her accumulated temporal debt.

**Class Hooks:**
- `kethrin_fexric` → The Gear-Stitcher: treats chest-engine as maintainable machine; can hot-swap gear configurations mid-cast
- `ithran_groven` → The Bone-Calibrator: stretches local time-dilation across wider areas through outstretched limbs
- `tessen_human` → The Keep-Anchor: temporal effects drastically amplified inside a single structure inhabited for years; nearly omnipotent within their own keep
- `velun_neth` → The Archive-Keeper: stores witnessed moments in a memory-glass lattice; rewind is retrieval, loop is review, displacement is misfiling

---

### 7. False Prophet (Control | Madness)

**Description:** A parasite caster who harvests Madness (0-20) by preaching the Silence — the void between stars, the quiet after death — as absolute truth. Each Madness point adds +1 damage to spells. At 20 Madness, Insanity Convulsion triggers with catastrophic self-harm. Their empathetic link is active from Level 1: Stitch of Suffering redirects ally suffering onto enemies.

**Cultural Affiliation:** Practiced by Stargazer Astril (False Stars whose manufactured faith borrows the credibility of genuine Lumia heritage resonance — indistinguishable from real divinity), Brutish Astril (Gagged Evangelists who preach against their own suppressed heritage, harnessing the captive's screams as sacred conviction), Tessen humans (Keep-Prophets with captive congregations in dying keeps), Ordan humans (Thinned-Herd Preachers who preach into the silence where the ancestor-songs failed), and Clean Vreken (Debt-Preachers selling absolution from debts that outlive them). Founded by Li Wei, who gouged his eyes to see the Silence where Sol once shone.

**Subraces allowed:** `vashir_astril`, `silath_astril`, `tessen_human`, `ordan_human`, `clean_vreken`

**Flaw / World Weaving:** Physically the frailest caster. +25% radiant vulnerability. Isolation Penalty — without a congregation within 30 feet, ALL spells cost +2 additional mana. The Voice of the Silence is getting louder, giving specific instructions: "Go to the Frozen Archive. Descend to the lowest vault. Open the way." Whatever is trapped beneath the Archive is using the faith to free itself.

**Class Hooks:**
- `vashir_astril` → The False Star: genuine Lumia resonance as cover for manufactured doctrine — congregation cannot tell prophet from temple
- `silath_astril` → The Gagged Evangelist: faith-power scales with the suppressed heritage's agitation — genuine supernatural resistance reads as sacred conviction
- `tessen_human` → The Keep-Prophet: Madness builds faster in a sealed keep; the congregation cannot leave the service
- `ordan_human` → The Thinned-Herd Preacher: Madness builds while the congregation moves; the sermon rides the wind and belief travels with the migration
- `clean_vreken` → The Debt-Preacher: belief logged as payment against inherited debt; absolution in the one currency the Keeper has never audited

---

### 8. Gambit (Damage / Control | Fortune & Karmic Debt)

**Description:** A high-strung, dual-resource architect wielding stolen Fortune and pre-drawn Fate Reserve cards. They manipulate probability through gambling mechanics and cartomantic surgery simultaneously — fortune nudging for incremental adjustments, card overrides for absolute d20 replacement. Fortune is the House's credit drawn against their own future and Karmic Debt is the marker coming due; the tradition is a hazard-pact struck with Mael-Zhul, the Old God the debtors call only the House. Walk the knife-edge between Cosmic Bankruptcy (FP=0) and Wyrd Collapse (Karmic Debt=13).

**Cultural Affiliation:** Three heritages carry the archetype, each carrying the curse of its first wager: Merryn humans (sea-omen gamblers who wager voyage-shares on salt-coral dice, cursed to keep moving by Chasing Losses), Veldun Nethien (clause-gamblers whose fate-threads were staked in a flooding vault and are now held as collateral — they must keep raising the stakes to stay solid), and Caustic Fexric (sump-hustlers whose refinery wager broke deterministic machinery in their hands, so they rig the game instead of playing it). Gamblers recognize no guilds, only the liminal Dead Pots where steel stays sheathed.

**Subraces allowed:** `merryn_human`, `kessen_neth`, `drall_fexric`

**Flaw / World Weaving:** Every Fortune spent deals 1d4 irreducible wyrd damage. Karmic Debt amplifies all incoming damage. Jax is missing — walked into the Iceheart Sea to clear his debt with the storm-spirit in one final game. Lyra has gone radical — her Deck-Burners faction seeks to force the universe to choose, burning their cards to collapse probability into certainty, and if the ritual fails, every living Gambit's debt is collected simultaneously.

**Class Hooks:**
- `merryn_human` → The Sea-Omen Gambler: stakes fortune-points against sea-conditions; strongest on open water, and the Chasing Losses curse putrefies their luck wherever they try to settle
- `kessen_neth` → The Clause-Gambler: calculates probability as contract-law; structures wagers so losing benefits more than winning, and the House holds the fate-threads they staked as collateral
- `drall_fexric` → The Sump-Hustler: builds Karmic Debt from the resentment of hustled marks; the Tilt means only machines built with intentional variance will work for them

---

### 9. Harbinger (Damage / Control | Mayhem)

**Description:** A prophet of catastrophe who weaponizes both the friction of collapsing timelines (Xyris's Chaos Weaving) and the mathematical certainty of doom (Malakor's Doomsaying). They build Mayhem pressure through casting, amplifying all spells across four strict tiers, then plant living bomb prophecies in enemies that tick, escalate, and detonate. At 100 Mayhem, a d100 Master Wild Surge triggers.

**Cultural Affiliation:** Practiced by Stargazer Astril (Entropy-Symphony — harmonizing their dying Lumia heritage as a catastrophe symphony), Brutish Astril (Suppressed Catastrophe — weaponizing the gagged heritage's frantic warnings of apocalypse), Waste-Solari (Dying-Light Doomsayers who read the arithmetic of Sol's final extinguishment from cooling vent-readings), and Tessen humans (Extinction-Architects who have rehearsed the apocalypse for four centuries as a discipline).

**Subraces allowed:** `vashir_astril`, `silath_astril`, `tessen_human`, `thrask_solari`

**Flaw / World Weaving:** No healing while any prophecies are active. At 100 Mayhem, Anomalous Dissociation — 100% vulnerability to bludgeoning/slashing. Wild Surges are becoming permanent — Chaos Pockets in the Sundrift Vale where grass grows sideways and time flows at different rates. Each Pocket bleeds warmth from the buried star, accelerating Sol's dimming. The Doom-Choir's own magic is ending the world faster.

**Class Hooks:**
- `vashir_astril` → The Entropy-Symphony: Mayhem builds in resonance with fading heritage; accelerating own heritage's death to fuel magic
- `silath_astril` → The Suppressed Catastrophe: Mayhem from the suppressed heritage's frantic, gagged warnings — cruelty is the point
- `thrask_solari` → The Dying-Light Doomsayer: Mayhem scales with ambient heat-loss; the colder the surroundings, the faster the arithmetic runs
- `tessen_human` → The Extinction-Architect: Mayhem through pre-planned collapse-sequences rehearsed for decades; Wild Surges are choreography

---

### 10. Inquisitor (Occult Arbiter / Wyrd-Binder | Authority)

**Description:** A dual-purpose occult warrior who combines anti-magic negation with Wyrd-touched binding and purification. They swear the Barbed Vow, wielding cold iron against the Wyrd. Authority (0-8) is built through absorbing spells, breaking enchantments, striking supernatural targets, and executing the supernatural. Against mundane threats, they generate nothing.

**Cultural Affiliation:** Primarily practiced by Marked Vreken (Mycelium-Hunters who track corruption through the forest's nervous system), Clean Vreken (Glow-Auditors who diagnose corrupted bonds by their bioluminescent signature), Thalren humans (Salt-Scarred who open their own veins to draw Wyrd face-stealers into living flesh through deliberately breakable oaths), and Broken Mimir (Fog-Sentinels who read the mist's memory-shifts as early warning from the Ironwood Palisade).

**Subraces allowed:** `marked_vreken`, `clean_vreken`, `thalren_human`, `tethered_mimir`

**Flaw / World Weaving:** Rejection of All Magic — cannot receive beneficial magical buffs or healing without suffering 1d10 wyrd damage. Brittle Skeleton — permanent 50% vulnerability to physical bludgeoning. Authority decays -1/round without supernatural contact; at 0, bound entities rebel. Only 47 active Inquisitors remain. The Wyrd is bleeding faster — new, unnamed entities in the deep groves have no contracts to sever and no faces to bait; the Inquisitor's entire art may be obsolete.

**Class Hooks:**
- `marked_vreken` → The Mycelium-Hunter: severs corrupted bonds through the mycelial network itself; heals the forest but leaves a permanent dead-patch
- `clean_vreken` → The Glow-Auditor: identifies corruption by aberrant bioluminescent signature, readable at distance; the tradition's diagnosticians
- `thalren_human` → The Salt-Scarred: makes deliberately breakable oaths to lure native predators and Wyrd entities; each Bait-Vow leaves a permanent scar of intended betrayal
- `tethered_mimir` → The Fog-Sentinel: reads Wyrd-incursions in the fog's memory-shifts before they manifest; Authority builds from the silent vigil itself

---

### 11. Lunarch (Control / Support | Lunar Phases)

**Description:** A host — a walking crime scene where an ancient, unfeeling celestial parasite has fused with the nervous system. The Lunar Cycle is not a tool; it is the parasite's feeding schedule. Every three rounds it FORCEFULLY REWRITES the host's physiology. New Moon feeds on memory (+3 DR, immune charm/fear). Waxing feeds on sensation (+1d6 damage). Full Moon feeds on sanity (+2d8 radiant, crit 19-20, Delirium rolls). Waning feeds on vitality (25% vampiric, -3 mana costs).

**Cultural Affiliation:** Originally exclusive to Florae descendants of House Viridane — Viridian Florae (Thorn-Bound, the parasite as fae-contract made flesh) and Oken Florae (Timber-Born, carrying the parasite in secret). The parasite also bonds to both Mimir castes: Arch Mimir (Mask-Anchored, the parasite as replacement identity-anchor) and Broken Mimir (Sentinel-Moon, the parasite bonded to vigil-duty). Recently, Thalren humans (Fog-Heresy) have been chosen — trading fixed identity for a parasitic one.

**Subraces allowed:** `viridian_florae`, `florae_unified`, `veiled_mimir`, `tethered_mimir`, `thalren_human`

**Flaw / World Weaving:** +25% bludgeoning vulnerability (starlight-infused organs rupture under blunt trauma). Standard magical healing deals wyrd damage instead of healing — the parasite devours foreign magic. Every phase shift deals 2d6 blight damage and forces a Transition Shock roll. The dead moon is calling its children home — the elder parasites are communicating across hosts. Selene has been silent for three weeks, whispering in a language no one recognizes. Whatever is waking may be the fallen star itself.

**Class Hooks:**
- `viridian_florae` → The Thorn-Bound: parasite phases synced to fae-contract debt; Waning phase is literally interest collection
- `florae_unified` → The Oken Timber-Born: phases suppressed during day, erupt violently in isolation; moon becoming impossible to hide
- `veiled_mimir` → The Mask-Anchored: the parasite bonds cleanly as a replacement identity-anchor; the host can survive briefly unmasked in the fog
- `tethered_mimir` → The Sentinel-Moon: power scales with adherence to sentinel-duty; the moon becomes the thing they watch *for*
- `thalren_human` → The Fog-Heresy: draws power directly from memory-erasing fog; Thalren memories fed to the parasite as fuel

---

### 12. Martyr (Tank / Support | Devotion)

**Description:** A selfless protector who gains power through sacrifice — actively sacrificing HP to fill the Devotion (6 levels, thresholds at 10/20/40/60/80/100 damage taken). They are the ONLY class that can negate fatal blows by pulling damage vectors into their own body. Their faith is Aex's: her worship is not joy or song, it is the protective love of a mother who takes the wound meant for another, and her power is a resonant frequency channelled only by bodies that mirror her vigilance. A true Martyr is a Witness (*martys*), trained to stay lucid, observant, and serene at the centre of unbearable trauma. Their form turns translucent at high Devotion, bones blazing with volatile golden light where the vessel cracks.

**Cultural Affiliation:** Three peoples carry the path. The Solari keep the Mother's Shield in two forms: Hollow-Solari Vault-Witnesses who endure in absolute stillness before the Sol's Breath, and Waste-Solari Ash-Witnesses who took the burning debris at Emberspire and sorrow for their Pyrofiend kin. The Groven carry the Transmuted Burden: Morgh anchors bred in Fexric vats who made endurance sacred, and Ithran span-keepers who tally every crossing that held. The Skald walk it as Ironclads: furnace-plated juggernauts who burn suffering as fuel instead of witnessing it as prayer.

**Subraces allowed:** `korr_solari`, `thrask_solari`, `morgh_groven`, `ithran_groven`, `skald_human`

**Flaw / World Weaving:** Devotion Collapse — if the Martyr goes 1 round without taking damage or sacrificing HP, lose 1 Devotion Level. Lose 3 levels through decay in a single combat and become Faithless for 2 rounds (healing halved, cannot Intervene). Cannot self-heal effectively. The Martyr's Vow is being weaponized — noble houses conscript children trained from birth to associate pain with duty; their Devotion fills slower and wounds heal less cleanly than free-willing Martyrs, and some conscripts have begun absorbing without consent.

**Class Hooks:**
- `korr_solari` → The Vault-Witness: Devotion amplified by absolute physical stillness during absorption; the Vault-Breath is the template, and the vigil is kept as Aex kept it
- `thrask_solari` → The Ash-Witness: Devotion amplified when intercepting damage in the open with no cover; metabolizes ember and heat into vigil, sorrowing for the broken brothers who became Pyrofiends
- `morgh_groven` → The Transmuted Burden: Devotion scales with the number of allies behind their guard, and decay halts while they hold a fixed position; cannot generate Devotion while retreating
- `ithran_groven` → The Span-Kept: Devotion tracked as tally-beads; spending it transfers the load outward as barriers for allies within their span rather than inward as self-healing
- `skald_human` → The Ironclad: Devotion tracked as boiler-pressure in Cragjaw furnace-plate; the only variant converting absorbed suffering into offensive output

---

### 13. Minstrel (Support | Musical Notes)

**Description:** A conductor of reality's death rattle who tears music from the corpses of collapsing dimensions. Their magic is not art — it is fundamental violation of physics demanding biological payment. They cast builder spells to harvest musical notes (I-VII) from unraveling planes and combine them into Cadences that violate the laws of existence. Music is resonance — the frequency at which things break.

**Cultural Affiliation:** Heavily practiced by Merryn humans (Storm-Singers whose sea-symphonies synchronize crew physiology to wave and wind — maritime engineering through sound), Shore Myrathil (Shore-Conductors mediating the boundary between sea and land through tide-cadences), Brook Myrathil (Freshwater-Voices carrying sound-work up waterways into every continent's heart), and Deep Myrathil (Abyss-Resonants conducting subsonic frequencies felt in bone rather than heard).

**Subraces allowed:** `merryn_human`, `shoreling_myrathil`, `riverling_myrathil`, `deepling_myrathil`, `clean_vreken`

**Flaw / World Weaving:** Cannot self-heal — all healing targets allies only. Requires an instrument; disarmed = powerless. -2 DR while performing any active song. Silence effects render them useless. The Iceheart Sea has fallen silent — the oldest continuous frequency in the known world has stopped. Lyris the Tide-Singer vanished the same night. The Deep Myrathil have surfaced for the first time in centuries — something in the abyss learned their song and is singing it back.

**Class Hooks:**
- `merryn_human` → The Storm-Singer: cadences dramatically amplified on open water in active weather; inland in calm, a pale echo
- `shoreling_myrathil` → The Shore-Conductor: cadences strongest at the waterline; only variant effective both on water and inland
- `riverling_myrathil` → The Freshwater-Voice: cadences amplified by flowing freshwater; functions fully inland, the tradition's frontier
- `deepling_myrathil` → The Abyss-Resonant: cadences operate below hearing threshold as physical vibration, bypass auditory resistance entirely
- `clean_vreken` → The Bog-Resonance: conducts the Root-Veil's deep, slow rhythm through living mycelium; a whisper on dead ground, a grove-wide glow-pulse on the fungal network

---

### 14. Plaguebringer (Damage / Control | Virulence)

**Description:** A dark cultivator who sows seeds of rot and pestilence in the flesh of the living. Apply Seed afflictions → Cast Category spells to advance stages (1-3) through Weaken, Torment, Fester, Decay, and Amplify → Accumulate Virulence (0-100) → Unleash devastating Harvest executions. Their body is a living laboratory — waxy, pale, cold, constantly cultivating new diseases within their own tissue.

**Cultural Affiliation:** Heavily practiced by the Withered (Silence-Hosts — partially-dead outcasts whose decay hosts an ideal cultivation substrate), Clean Vreken (Glow-Culture — cultivated diseases express as visible bioluminescent patterns, trackable in real time until the mutations go dark), and Marked Vreken (Mycelium-Vectors who deliver disease through the Root-Veil itself across miles of interconnected root and spore).

**Subraces allowed:** `drun_neth`, `clean_vreken`, `marked_vreken`

**Flaw / World Weaving:** Requires the Bryngloom's unique fungal-bog substrate — no narrative unlock. ember damage immediately purges all active rot from targets and environment; Virulence drops to 0. Vespera's foundational bacterial strain is failing after three centuries — cultivated diseases are becoming unstable, mutating into virulent forms that attack the host. The Root-Veil is beginning to reject the Marked cultivators.

**Class Hooks:**
- `drun_neth` → The Silence-Host: diseases take root faster in partially-dead flesh; each cultivation accelerates host's decay
- `clean_vreken` → The Glow-Culture: visible bioluminescent disease-maps allow surgical infection tracking until the mutations go dark
- `marked_vreken` → The Mycelium-Vector: diseases transmitted through the Root-Veil, bypassing physical proximity entirely — the forest has begun rejecting them for it

---

### 15. Pyrofiend (Damage | Inferno Veil)

**Description:** A living crucible claimed by the cosmic collision at Emberspire, where the starfire bound beneath the caldera met the void-rot Keth Amar had seeped into the fissures and fused inside the survivors. Scathrach, the Ashen Sovereign, is the will that grew out of those first crucibles — the Ninth Flame — and it collects every Pyrofiend it can. The Inferno Veil ascends through 10 levels (0-9), mapped as a descent through the Rings: Ring 0, the Banked Hearth; the Malice of Rings I-II; and Ring III, the Crucible (Veil 7-9), where the Debt Call begins. Each level adds +1 ember damage while inflicting escalating drawbacks. At Level 5+, the Wyrd-touched Whisper may force the Pyrofiend to attack the nearest living thing. Level 9 starts a 3-turn death clock.

**Cultural Affiliation:** Two heritages were positioned to survive the collision. The Solari were the monastic core of the Dawn Vigil: Hollow-Solari keepers hold the Banked Hearth in glacial stillness, while Waste-Solari forge-clans race their own char-vessel conversion. The Clockwork Fexric refinery-clans survived the shockwave in sealed geothermal vaults by drinking mineral salts and embedding cooling heat-sinks, and they treat the fire as a chemical hazard governed by thermal thresholds.

**Subraces allowed:** `korr_solari`, `thrask_solari`, `kethrin_fexric`

**Flaw / World Weaving:** Rime damage deals +50% AND forces Veil to ascend. At Veil 6+ (Heresy), cannot be healed by others. At Level 9, exactly 3 turns before permanent death — body detonates in 30ft radius of 10d6 and soul is claimed by Scathrach. Scathrach is calling in all debts simultaneously — the Final Convocation at Emberspire is imminent. No Pyrofiend has ever survived to describe what happens when a horror collects a contract.

**Class Hooks:**
- `korr_solari` → The Banked Hearth: deepest ascetic control, the Veil rises slowest and bleeds off while the host stays motionless; longest survival, lowest burst
- `thrask_solari` → The Forge-Damned: char-vessel conversion partially directable — guide which body parts calcify into heat-resistant forge-plate while racing Scathrach's collection
- `kethrin_fexric` → The Sealed Alembic: Veil ascends in measured steps through grafted valve-work; thermal thresholds, chalk tablets, and wrist pressure valves govern every descent

---

### 16. Revenant (Damage / Control | Toll & Phylactery)

**Description:** A death caster who walks between two necrotic traditions — Kora's blood-fueled sacrifice and Vesper's frost-stasis phylactery. Build Toll (0-20) through HP sacrifice and kills. Toggle Death Shroud to burn HP instead of Mana for enhanced frost+blight spells. Kill enemies to charge the Phylactery; when killed, resurrect from stored HP and trigger battlefield-wide freeze.

**Cultural Affiliation:** Heavily practiced by Clean Vreken (Ancestor-Bound — ancestors need a living voice to speak through), Marked Vreken (Mycelium-Dead — consciousness distributed across the Root-Veil), Withered (Contract-Expired — invisible to the Keeper, unbound by the First Contract), Tessen humans (Keep-Waked — soul anchored to ancestral architecture), Veldun (Lien-Holders — kept by open obligations in the web), Merryn humans (Drift-Bound — held to the surface by unfulfilled ink-contracts), and Myrathil (kept by Mareth's tides, which do not release what they hold).

**Subraces allowed:** `clean_vreken`, `marked_vreken`, `drun_neth`, `tessen_human`, `kessen_neth`, `merryn_human`, `shoreling_myrathil`, `deepling_myrathil`, `riverling_myrathil`

**Flaw / World Weaving:** Toll at 6+ = self-damage. At 11+ = cannot be healed. At 16+ = nuclear detonation on death (kills nearby allies). The bog-graves are waking on their own — twelve Revenants found drained of blood but unwounded; the dead are marching toward the Sundered Monoliths without permission. The Cult of Forgotten Shadow offers Silence-stasis that requires no life force, but those who accept may be having their souls replaced.

**Class Hooks:**
- `clean_vreken` → The Ancestor-Bound: Death-Toll generated through ancestral communion; dead willingly feed the host to keep their voice alive
- `marked_vreken` → The Mycelium-Dead: Phylactery distributed across mycelial network — nearly impossible to permanently kill; feels every wound the forest feels
- `drun_neth` → The Contract-Expired: Revenant state invisible to Keeper and contract-magic — cannot be sensed, bound, or dismissed; total social nonexistence
- `kessen_neth` → The Lien-Holder: phylactery is the obligation-web itself; death cannot close an account with entries still open
- `merryn_human` → The Drift-Bound: held to the surface by unfulfilled ink-contracts; the tattoos are the phylactery, and each raising fades a line
- `shoreling_myrathil` → The Tide-Kept: Mareth does not release what she holds; each wave an installment on a debt with no final payment
- `deepling_myrathil` → The Pressure-Woken: preserved by trench cold so absolutely that death could not complete; every ascent weakens the hold
- `riverling_myrathil` → The Weir-Locked: bodies the rivers never finished carrying; can surface anywhere along the waterway that caught them
- `tessen_human` → The Keep-Waked: Phylactery is the keep itself; as long as it stands, the Revenant cannot be destroyed; keeps are failing

---

### 17. Shaper (Hybrid — Damage/Mobility/Adaptation | Flux & Body Toll)

**Description:** A combatant who treats their body as the ultimate weapon — merging hyper-accelerated kinetic combat with biological shape-shifting. Flow between 6 Shaping Forms (Ataxic Flow, Arterial Strike, Centrifugal Fury, Deadened Bastion, Fluid Apex, Silence Predator). Build Flux through combat actions. Body Toll tracks the cumulative cost of every transformation.

**Cultural Affiliation:** Heavily practiced by Arch Mimir (Form-Locked — mask holds self stable as fixed transformation axis), Broken Mimir (Sentinel-Shifters — each form a posture of watching, configured for specific surveillance), Morgh Groven (Vat-Sculpted — inherited the Deep Alchemists' body-sculpting heritage; the race sculpted against its will now sculpting itself), Ithran Groven (Span-Dancers — Flux from bridge-running momentum), and Marked Vreken (Mycelium-Sculpts — the Ghost-Mycelium reshapes with them, at the cost of fungal decay).

**Subraces allowed:** `veiled_mimir`, `tethered_mimir`, `morgh_groven`, `ithran_groven`, `marked_vreken`

**Flaw / World Weaving:** 0 base Armor — every blow lands full. +50% wyrd vulnerability permanently. If rooted/grappled, Flux drops to 0 and takes 1d10 blight/round. Body Toll at 3+ locks joints, 5+ silences, 7+ sends Feral, 10 hands control to GM. Young Shapers experience Convergence Collapse — the body attempts every transformation at once, burning through crystalline skin in years; purists advocate single-tradition practice while convergers push deeper.

**Class Hooks:**
- `veiled_mimir` → The Form-Locked: Flux builds faster when the mask remains untouched; most controlled, most limited — cannot reshape the face
- `tethered_mimir` → The Sentinel-Shifter: generate Flux from detection (spotting enemies) as much as combat impact; the tradition's scouts
- `morgh_groven` → The Vat-Sculpted: draws on dormant alchemical substrate for violent precision; the most durable Shapers
- `ithran_groven` → The Span-Dancer: Flux generates faster from movement across familiar architecture; forms emphasize reach, wield, and bone-knowledge of load
- `marked_vreken` → The Mycelium-Sculpt: form transitions rendered near-frictionless by the Ghost-Mycelium, paid for in blackened, shed threads

---

### 18. Spellguard (Tank / Anti-Mage | Arcane Energy Points / Silence Resonance)

**Description:** A catastrophic magical sponge — flesh stitched to radioactive metal. Their specialized armor is permanently scarred by the fallout of absorbed magic. They stand between the party and the apocalypse, physically intercepting lethal magical attacks, drawing raw spell-energy into their own body as volatile Silence Resonance, and violently detonating it back at the enemy.

**Cultural Affiliation:** Heavily practiced by Nethien (Clause-Cancellers — cancel spells by drafting annulments, identifying hostile magic's clause-structure and filing the counter-instrument), Thalren humans (Wyrd-Defusers — disarm spells through methodical structural analysis, expecting secondary triggers), Hollow-Solari (Silent-Guards — intercept from Vault-Breath stillness so absolute that magic falls into them rather than strikes, though they cannot intercept while moving), and Waste-Solari (Forge-Shields — deflect and redirect rather than absorb, treating incoming magic as thermal hazard).

**Subraces allowed:** `velun_neth`, `thalren_human`, `korr_solari`, `thrask_solari`

**Flaw / World Weaving:** +50% vulnerability to bludgeoning and physical damage — a mundane axe is their hard counter. Holding unspent Silence Resonance burns max HP and deals blight every round. At 100 Resonance, Critical Meltdown — 10d6 storm damage to ALL within 30 feet. Ambient magic levels are rising — Spellguards' Resonance fills faster than they can purge; spontaneous Radiation Bursts harm allies. Damon's foundational method (identify, dismantle, redirect) is failing against magic with no structure.

**Class Hooks:**
- `velun_neth` → The Clause-Canceller: cancels spells through legal-inversion; precise, low-radiation, but fails against wild structureless magic
- `thalren_human` → The Wyrd-Defuser: disarms spells through methodical structural analysis; catches layered/contingent spells others miss
- `korr_solari` → The Silent-Guard: intercepts from Vault-Breath stillness; least collateral damage but cannot intercept while moving
- `thrask_solari` → The Forge-Shield: deflects and redirects magic; takes least Resonance but cannot fully neutralize, only redirect

---

### 19. Toxicologist (Damage / Support | Vials & Contraption Parts)

**Description:** The self-poisoned surgeon — the ONLY preparation-based alchemist whose veins run thick with weaponized toxin. They set traps before initiative, craft poisons mid-combat, and stack debilitating debuffs no other class can apply. Bleed Vials from saturated flesh, deploy Contraption Parts as battlefield traps, and watch enemies crumble under layered afflictions. All healing received is halved — their body rejects restoration.

**Cultural Affiliation:** Heavily practiced by Thalren humans (Fog-Distillers — extract raw venom from fog-predators of the Frostwood, optimized for slow-acting area-denial), Tethered Mimir (Floor-Brewers — cultivate toxins from undergrowth decay; longest-lasting persistent agents in the tradition), Withered (Silence-Distillers — distill from their own decaying flesh; null-chemistry the First Contract cannot register), Viridian Florae (Thorn-Venom — distill their own fae-touched thorn-blood; every Toxicologist's poisons unique to their bloodline), and Oken Florae (Veiled-Cuil — brew in absolute secret, optimized for untraceable delayed-onset toxins that mimic natural illness).

**Subraces allowed:** `thalren_human`, `tethered_mimir`, `drun_neth`, `viridian_florae`, `florae_unified`

**Flaw / World Weaving:** +50% alchemical vulnerability (corrosive residue builds up in bloodstream). Immunity to standard poisons (tissues are pre-saturated). Each brew requires fresh ingredients — peat-acid spoils, venom degrades, thorn-blood clots within hours. The Fog-Lung is not a disease; it is the Frostwood slowly turning human tissue into ironwood bark. The Toxicologists are not looking for a cure; they are measuring the transformation.

**Class Hooks:**
- `thalren_human` → The Fog-Distiller: extracts venom from fog-predators; poisons deal ice damage and erase memory of the attack
- `tethered_mimir` → The Floor-Brewer: cultivates toxins from undergrowth decay; longest-lasting persistent area-denial
- `viridian_florae` → The Thorn-Venom: poisons distilled from own fae-touched blood; each bloodline's poison unique and uncounterable without specific study
- `florae_unified` → The Oken Timber-Craft: toxins engineered for untraceability — delayed onset, mimics natural illness
- `drun_neth` → The Silence-Distiller: distills toxins from her own slow dissolution; null-distillates the Ledger cannot register, each brew spending her remaining half-life

---

### 20. Warden (Damage / Control | Tension / Tension)

**Description:** The Penitent Jailer who drives rusted iron chains through their own forearms and spine. They physically chain themselves to abominations through the Iron Chain Tether — a 15-foot radius forced duel where the tethered enemy cannot target allies. Generate Tension through pain and manual reeling; spend on bone-crushing flails, agony-infused braces, or ultimate Iron Ascendancy transformation.

**Cultural Affiliation:** Heavily practiced by Morgh Groven (Vat-Grounded — chains echo the containment they shattered in the revolt; voluntarily wearing chains is the entire point), Ithran Groven (Span-Tethers — distribute tether across multiple enemies the way bridges distribute load), Drall Fexrick (Gear-Tension — re-tune chain-configuration mid-combat as engineering), Kethrin Fexrick (Guild-Jailers — practice as guild discipline with certified specifications), Skald humans (Glacier-Chains — cold-iron contracts and stiffens in low temperature; arctic specialists), Clean Vreken (Glow-Tethers — bioluminescent chains map every tethered abomination's position in real time), and Marked Vreken (Mycelium-Leashes — extend tethers through the Root-Veil, miles-long holds across connected terrain).

**Subraces allowed:** `morgh_groven`, `ithran_groven`, `drall_fexric`, `kethrin_fexric`, `skald_human`, `clean_vreken`, `marked_vreken`

**Flaw / World Weaving:** +50% wyrd vulnerability from constant proximity to horrors. Shared Torment — absorb 50% of AoE damage that strikes the tethered prisoner. If a stronger creature moves, the Warden is helplessly dragged (1d10 per 10 feet). Agonizing Cast Costs — establishing tethers requires self-inflicted 1d6 damage. The chains are becoming brittle in the Cragjaw cold — the Fexric Drall propose chardalyn alloy replacement, but chardalyn causes madness with prolonged contact. The schism is tearing the Bound apart along the vat-maker fault-line.

**Class Hooks:**
- `morgh_groven` → The Vat-Grounded: Tether-Tension builds faster against enemies that restrain allies; chains are chosen scars, not inflicted ones
- `ithran_groven` → The Span-Tether: Tension distributable across multiple tethered enemies; tradition's only multi-target Wardens
- `drall_fexric` → The Gear-Tension: re-tunes chain-configuration mid-combat favoring lockdown or pursuit; most adaptable variant
- `kethrin_fexric` → The Guild-Jailer: grafts to exacting guild-specification; most reliable tethers — predictable, documented, maintained
- `skald_human` → The Glacier-Chain: chains contract and grip harder in cold; nearly inescapable in blizzard, loosening in heat
- `clean_vreken` → The Glow-Tether: tethered enemies marked with visible bioluminescence through fog, cover, and darkness
- `marked_vreken` → The Mycelium-Leash: tethers routed through Root-Veil; can hold abominations miles away on connected terrain

---

### 21. Crusader (Tank / Vanguard | Fervor)

**Description:** A heavy starlight-forged juggernaut who channels Aex's Willing Sacrifice through consecrated plate and a greatsword. Fervor (0–100) builds from heavy swings and absorbed blows; at 50+, Harmonic Stance empowers every strike, and at 100, Solvan Judgment descends as a pillar of starlight that shatters Durability and DR and leaves the ground consecrated for years. Starlight Burnout punishes stalled zeal.

**Cultural Affiliation:** Heavily practiced by Skald humans (Frost-Hearth Zealots who treat the greatsword as a mobile hearth in whiteout blizzards), Waste-Solari (Magma Crusaders who supplement geothermal defense with starlight), and Brutish Astril (Crystal Judgments who refract Aex's song through crystal skin). Lord-Captain Vane Solvan founded the order; Hierophant Aethelgard commands it now.

**Subraces allowed:** `skald_human`, `thrask_solari`, `silath_astril`

**Flaw / World Weaving:** Requires continuous melee momentum — bogged down or separated, Fervor dissipates and heavy plate becomes a liability. The Dawn Vigil is at a crossroads: Aethelgard commands the reforging of the seven Sundered Monoliths, unaware that the seventh is tainted by Keth Amar. Veterans who guard the Reforging Altar hear the seventh shard hum along with their Fervor, and sometimes first.

**Class Hooks:**
- `skald_human` → The Frost-Hearth Zealot: venting Fervor creates a 20ft thermal aura; allies take half rime hazard damage and gain advantage on CON saves
- `thrask_solari` → The Magma Crusader: starlight and magma-fire resonate; Fervor builds fastest on volcanic ground
- `silath_astril` → The Crystal Judgment: Aex's song refracts through suppressed Lumia heritage; sacred smites carry psychic overtones
