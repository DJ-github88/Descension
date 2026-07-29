import { UTILITY_SPELLS } from '../spells/utilitySpells';
/**
 * Chronarch Class Data
 *
 * Complete class information for the Chronarch - a time manipulator
 * who builds temporal energy and manages strain to control the battlefield.
 *
 * === substrate AUTOPSY ===
 * Why Bring Me: The ONLY class capable of total momentum and duration distortion.
 * They possess the exclusive ability to lock down whole groups of enemies in perfect
 * stasis frames, manually extend or freeze active debuff counters on targets, and
 * entirely rewind an ally's positioning and action state to an earlier round.
 * Fatal Flaw: Temporal Inversion and Fragility. Because they are actively tearing
 * the fabric of probability, their atomic alignment is dangerously thin. They possess
 * a permanent, massive vulnerability to raw blight forces, and if caught
 * in a zone that accelerates time or inflicts mass impact (forced movement), their
 * internal clock breaks, dropping Dodge to zero and triggering instantaneous backlash.
 * Mechanical Fix: Implemented a permanent max HP erosion tax (-1 to -10 max HP until Long Rest)
 * on all heavy Flux spending abilities. Converted the static 10-Strain Temporal Backlash
 * into a terrifying, unpredictable 1d6 anomaly table. Shifted Level 1 kit to aggressively
 * kick off Shard-building and Strain-cooling on Turn 1.
 */

export const CHRONARCH_DATA = {
 restrictions: {
   "allowedSubraces": [
    "kethrin_fexrick",
    "ithran_groven",
    "tessen_human",
    "velun_neth"
   ],
  "hardBlocks": [
   "thalren_human",
   "skald_human",
   "solvarn_human",
   "merryn_human",
   "ordan_human",
   "morren_human",
   "astril",
   "vreken",
   "florae",
   "myrathil",
   "mimir"
  ],
  "narrativeUnlock": true,
  "justification": "Requires temporal-suspension training only available in Cragjaw. Outsiders have never learned the technique, it requires Fexric gear-craft and Groven bone-knowledge."
 },

 /**
 * Subrace Variants, the Chronarch engine is half gear-craft (Fexric) and half
 * living-bone interface (Groven), and the Tessen learned it by sending emissaries up
 * to Frostmaw. Each subrace treats the same temporal engine as a different object:
 * machine, body, or anchor.
 */
 
  // EQUIPMENT (added 2026-07-28 audit fix)
  // TODO: design team to add startingEquipment and proficiencies.
  // TODO: review weapon/armor lists for class accuracy per lore compendium.
  equipment: {
   weapons: ['staff', 'orb', 'wand'],
   armor: ['light_armor', 'robes'],
   offHand: ['orb', 'tome', 'wand']
  },
subraceVariants: {
 kethrin_fexrick: {
   subraceName: 'Clockwork Fexric - Fexric',
  title: 'The Gear-Stitcher',
  reframe: `The guild-bound <LoreLink termId="fexrick">Clockwork Fexric</LoreLink> built the gear-craft half of Nesta's engine, and they have never stopped believing the Chronarch tradition is, fundamentally, an engineering discipline that happens to be embedded in a person. A Clockwork Fexric Chronarch treats time as a mechanism with replaceable parts, and treats their own chest-engine as a machine that, with sufficient maintenance, need not kill them. (It still kills them.)`,
  signatureAbility: {
  name: 'Gear-Swap',
  description: `Temporal effects are modulated by physically swapping gear-configurations in the chest-engine, a maintenance action that briefly destabilizes the user but allows re-tuning of a temporal effect mid-cast. The Clockwork Fexric alone can hot-swap without lethal feedback.`
  },
  currentCrisisAngle: `Nesta is disappearing, and the Clockwork Fexric read this as a *maintainable failure*, a fault in the oldest engine that a sufficiently skilled guild-master could, in theory, repair. The Clockwork Fexric guilds have begun the most ambitious repair attempt in history: rebuilding Nesta's engine from recorded schematics, hoping that if the machine persists, its inventor will too.`,
  signatureQuote: {
  text: '"Time is a gearbox. Nesta is a gearbox. Both can be rebuilt. The only question is whether we have the parts, and we have always had the parts."',
  speaker: 'Guild-Master Fex-Torren',
  context: 'A Clockwork Fexric engineer, unveiling the reconstruction schematics'
  }
 },

 ithran_groven: {
  subraceName: 'Ithran Groven',
  title: 'The Bone-Calibrator',
  reframe: `The volcanic-glass gears of a Chronarch engine must interface with *living bone* to function, and the long-limbed <LoreLink termId="groven">Ithran Groven</LoreLink>, the bridge-builders, the diplomats who instinctively read load and stress, provide the ideal substrate. An Ithran Chronarch does not own their engine so much as *host* it; the gears grow into the extended limbs, and the tradition reads as much like architecture as like time.`,
  signatureAbility: {
  name: 'Span-Calibration',
  description: `Temporal effects scale with the reach and stability of the host's limbs, an Ithran Chronarch can stretch a local time-dilation across a wider area than any other practitioner, anchoring the field through their own outstretched body the way a bridge distributes load.`
  },
  currentCrisisAngle: `Nesta's disappearance terrifies the Ithran most: they feel temporal friction as *bone-ache*, and as Nesta fades, every Ithran Chronarch's limbs ache a little more. Some have begun to splint their own arms, not for injury, but because the bone-engine interface is vibrating at a frequency the living skeleton cannot sustain.`,
  signatureQuote: {
  text: '"My grandmother built a bridge from the bones of her dead. I build a bridge from the bones of my living. Hers still stands. Ask me in a century about mine."',
  speaker: 'Ith-Sparra Long-Limb',
  context: 'An Ithran Chronarch, splinting her forearm before a long cast'
  }
 },

 tessen_human: {
  subraceName: 'Tessen',
  title: 'The Keep-Anchor',
  reframe: `The <LoreLink termId="house_tesshan">Tessen</LoreLink> learned the Chronarch art by sending emissaries up through the <LoreLink termId="cragjaw-peaks">Cragjaw</LoreLink> trade-routes to Frostmaw, and they practice it for one reason: to keep their sealed keeps from collapsing *in time*, not merely in stone. A Tessen Chronarch does not manipulate time to win battles, they manipulate it to delay the arrival of a future their entire culture has been dreading for four centuries.`,
  signatureAbility: {
  name: 'Keep-Anchor',
  description: `Temporal effects are drastically amplified when cast inside a single fixed structure the Augur has inhabited for years, the keep itself becomes a stasis-anchor. Outside their home keep, a Tessen Chronarch is the weakest of the tradition. Inside it, they are nearly omnipotent over local time.`
  },
  currentCrisisAngle: `The Tessen's keeps are failing *and* Nesta is disappearing, and the Tessen Chronarchs have realized the two events are linked. Nesta's engine and the Tessen keeps were built in the same decade, on the same geothermal line. As Nesta fades, the keeps' temporal integrity fails. The Tessen face a choice no other tradition shares: save Nesta, or save home.`,
  signatureQuote: {
  text: '"I learned to bend time so that my granddaughter could grow old in the same hall I did. I will not bend it so that the hall falls on her instead."',
  speaker: 'Castellan Tess-Varek',
  context: 'A Tessen Chronarch, refusing a summons to the Frostmaw conclave'
  }
 },

 velun_neth: {
  subraceName: 'Velun Neth',
  title: 'The Archive-Keeper',
  reframe: `To the <LoreLink termId="velun">Velun</LoreLink>, time is not an engine  —  it is a document. Every moment is a filed entry; every erased moment is a redacted clause. A Velun Chronarch treats temporal manipulation as archival work: rewind is retrieval, loop is review, displacement is misfiling. Their temporal engine is not a gear-box but a memory-glass lattice  —  a crystal archive that stores every moment they have ever witnessed. The Velun Chronarch does not lose their memories to temporal feedback; they externalize them. The cost is that the archive grows heavier, and carrying centuries of perfectly-preserved moments requires a stillness the young Velun are beginning to find unbearable.`,
   adoptionBridge: `The Velun Neth encountered temporal manipulation during the post-war reconstruction of Frostmaw. Neth archivists were contracted to catalog the damage to the Fexric archive-halls  —  the same memory-preservation work the Neth had done for themselves for centuries. Observing Nesta's engine, the Velun recognized a different application: time was not a mechanism to be repaired, but a document to be preserved. The engine could be replaced with a memory-glass lattice  —  an archive that stored moments instead of clauses. The first Velun Chronarch, **Archivist Vel-Thalen**, spent thirty years adapting the principle before successfully externalizing her first memory.`,
   signatureAbility: {
   name: 'Memory-Glass Lattice',
   description: `Temporal effects are stored in a crystal archive rather than the body; the Velun Chronarch externalizes temporal feedback into an ever-growing memory-glass lattice, allowing them to recall any witnessed moment with perfect clarity but at the cost of an increasingly encumbered stillness the young Velun are beginning to find unbearable.`
   },
   currentCrisisAngle: `The archive grows heavier with every stored moment, and the young Velun are beginning to reject the stillness their elders require. The Velun Chronarchs face a schism between the old, who carry centuries of perfectly-preserved memory and cannot imagine discarding it, and the young, who feel the weight of a history they did not choose to archive bearing down on them.`,
  signatureQuote: {
  text: '"I remember the day my grandmother was born. I remember the day she died. I remember every heartbeat between. The archive is complete. The archive is unbearable. The archive is mine."',
  speaker: 'Archivist Vel-Sevar',
  context: 'A Velun Chronarch, touching the memory-glass for the last time before walking out'
  }
 }
 },


 id : "chronarch",
 name: "Chronarch",
 icon: "fas fa-clock",
 role: "Control",
 damageTypes: ["storm", "arcane"],

 classIdentity: {
 title: "The Accidental Anchor",
 subtitle: "A Dying Vessel Bound to a Bleeding Timeline",
 utility: "Unmatched, absolute battlefield manipulation and time distortion. The Chronarch is the only class capable of freezing entire areas in perfect stasis frames, manually pausing or extending debuff clocks on enemies, and entirely rewinding an ally's HP and position back to an earlier round. They bend duration itself to their whim.",
 fatalFlaw: "Temporal Inversion and Fragility. Because they actively crack probability, their atomic alignment is dangerously thin. They possess a permanent 50% vulnerability to raw Silence and blight forces, which unravels their chronal coherence. and, if they are caught in a zone that accelerates time or are struck by a heavy physical impact (forced movement/shoves), their internal clock fractures,dropping their Dodge rating to zero and triggering an instantaneous Temporal Backlash roll on their 1d6 table."
 },

 // Overview section
 livingOrder: {
 orderName: 'The Frostmaw Conclave',
 founder: {
  name: '<LoreLink termId="nesta">Nesta</LoreLink>',
  status: `Disappearing. Physical records bearing her name are going blank; people who knew her are forgetting. She built the first time-dilation engine of volcanic glass and alchemical gears, hooked it into her chest at <LoreLink termId="frostmaw_holdfast">Frostmaw Holdfast</LoreLink>, and has been living in perpetual agonizing present ever since.`,
  note: `The only Chronarch whose temporal friction feeds back into her own historical existence. If she ceases to exist retroactively, every living Chronarch inherits her accumulated temporal debt.`
 },
 currentLeader: {
  name: '<LoreLink termId="fex-vestara">Conclave-Prime Fex-Vestara</LoreLink>',
  title: 'Keeper of the Reconstruction Schematics',
  characterization: `A guild-bound <LoreLink termId="fexrick">Clockwork Fexric</LoreLink> engineer who refuses to accept that <LoreLink termId="nesta">Nesta</LoreLink>'s disappearance is unpreventable. She has spent six years rebuilding <LoreLink termId="nesta">Nesta</LoreLink>'s original engine from recorded schematics, arguing that if the machine persists, its inventor will too. The other Conclave members consider this either genius or grief.`
 },
 headquarters: { name: 'Frostmaw Holdfast', locationId: 'frostmaw_holdfast' },
 crisisConnection: `<LoreLink termId="fex-vestara">Fex-Vestara</LoreLink>'s reconstruction is a race against <LoreLink termId="nesta">Nesta</LoreLink>'s erasure, and the Conclave has gathered at Frostmaw to witness what they believe will be <LoreLink termId="nesta">Nesta</LoreLink>'s final collapse. If <LoreLink termId="fex-vestara">Fex-Vestara</LoreLink> completes the rebuild before <LoreLink termId="nesta">Nesta</LoreLink> vanishes, the founder may persist as a clause in the new engine. If she is too late, every Chronarch's temporal debt comes due at once. She is three weeks from completion. <LoreLink termId="nesta">Nesta</LoreLink> is estimated at four.`
 },

 worldFriction: [
  { region: 'cragjaw-peaks', location: 'frostmaw_holdfast', status: 'celebrated', consequence: 'In the Cragjaw, Chronarchs are the engineers of last resort, their temporal stitching has held collapsing spans and stalled mine-cave-ins. House Tesshan grants them privileged heat-line access, though the Jarl-Tesshan records their every stitch in knotted cord (the Chronarchs resent the surveillance).', workaround: 'A Chronarch who refuses to log a stitch is suspected of temporal crime; the knotted cord-record is both protection and leash.' },
  { region: 'nordhalla', status: 'distrusted', consequence: 'The Skald genealogists despise temporal manipulation, an unraveled moment can edit an ancestor out of the record. Chronarchs are tolerated at the Frozen Archive only under escort, and a Chronarch caught stitching near the glacier-tombs may be lawfully killed by any Rune-Keeper.' },
  { region: 'sundale', status: 'persecuted', consequence: 'The Dawn Vigil views chronomancy as an attempt to delay Sol\'s final Reforging, classifying temporal manipulation as a form of cosmic treason.', workaround: 'Chronarchs hide in the subterranean coal-mines of Emberspire, offering temporal stasis loops to miners trapped by tunnel collapses in exchange for food and coal.' }
 ],

 overview: {
   originStory: `A chronarch has learned that time is not a river. It is a mechanism, and like all mechanisms, it can be rebuilt. The art was invented during the War of Thousand Screams, a conflict between Fexric holdfasts and the Deep Alchemists over geothermal vent access beneath Frostmaw Crag that lasted from Year 310 to 325 of the Dimming. The Alchemists, seeking to restart their Groven experiments, attempted to collapse a glacier onto the holdfast's main ventilation shafts. Three levels of Frostmaw were crushed before Nesta, a Clockwork Fexric guild-engineer, hooked a prototype time-dilation engine directly into her own chest. The collapse froze mid-fall. The Fexric evacuated. Nesta's engine trapped her timeline in a feedback loop that has never fully closed.

The engine was built from volcanic glass and alchemical gears. Nesta had designed it as a theoretical exercise. The glacier gave her thirty seconds to make it practical. She succeeded, and the success has been slowly erasing her from history ever since. Records bearing her name are going blank. People who once knew her are forgetting. If she ceases to exist retroactively, every living chronarch inherits her accumulated temporal debt. The current leader, Conclave-Prime Fex-Vestara, is rebuilding Nesta's original engine from recorded schematics. Completion is estimated in three weeks. Nesta is estimated at four.

Each subrace manipulates time through a different cultural lens. The Clockwork Fexric treat it as precision engineering, calibrated gears, documented tolerances, replaceable parts, their chest-engine a machine that will eventually kill them regardless. The Ithran Groven provide the living-bone interface, their extended limbs distributing temporal fields across wider areas through bridge-builder bone-knowledge. The Tessen learned the art to keep their sealed keeps from collapsing not merely in stone but in time, the keep-preservation applied to chronology itself, nearly omnipotent inside their own walls and the weakest variant outside them. The Velun Neth encountered temporal manipulation during the post-war reconstruction when Neth archivists were contracted to catalog damage to the Fexric archive-halls. An archivist named Vel-Thalen spent thirty years adapting the principle: time as a document to be preserved, a memory-glass lattice replacing the gear-engine.

Temporal Strain is the accumulated paradox-weight of every causality violation. Small rewinds accumulate. Loops compound. At ten strain, the timeline's self-correction instinct activates, not out of malice, but because the accumulated paradox has become noticeable to the fundamental laws of cause and effect. The backlash is reality's immune response to being edited.`,
  title: "The Chronarch",
 subtitle: "The Accidental Anchor",
 illustration: "/assets/images/classes/chronarch_illustration.png",
  illustrationCaption: "A Fexric Chronarch using starlight sand to stabilize a bleeding timeline.",

 quickOverview: {
  title: "Quick Overview",
   content: `**Who they are**: An accidental anchor  —  a dying mortal whose cells hum with high-velocity temporal friction, hooked into a time-dilation engine of volcanic glass and alchemical gears embedded in their chest. They did not choose chronomancy; it chose them.

**The hook**: Bank Time Shards through basic spells, then spend them on Flux abilities that violate causality  —  rewind an ally's fatal wound, freeze an enemy in perfect stasis, or open a dilation field that grants your party extra actions while halving enemy speed. Shards persist between fights, letting you open the next battle with devastating high-level Flux.

**The cost**: Every Flux ability deepens Temporal Strain. At 10 Strain, the timeline snaps back, phasing you out of reality and forcing an unpredictable anomaly roll  —  hostile clones, localized gravity implosions, or accelerated aging. You take double damage from arcane and blight. One hard shove drops your dodge to zero and triggers instant backlash.

**Bring one for**: The only class that can undo tactical mistakes  —  rewind a fatal blow, reset a spent cooldown, or trap a boss in a loop of its own movement. Errors are final without a Chronarch.`
 },

 description: `The Chronarch did not choose this path, chronomancy chose them. They are Prisoners of Relativity, flesh-bound anchors tethered to a timeline that never wanted them. Every wound they rewind from an ally etches kinetic recoil onto their own body instead. Every frozen moment demands intense cellular focus. They carry hourglasses not as tools of mastery, but as reminders of the extreme metabolic cost that ticks faster with each spell cast. The Chronarch is the only living soul capable of reversing the combat state, undoing tactical errors, resetting cooldowns, trapping enemies in temporal loops of their own creation, while managing the high physical strain of altered reality.`,

 roleplayIdentity: {
  title: "Roleplay Identity",
  content: `**HISTORY: THE GENESIS**
The chronarch's temporal manipulation was first manifested in the high passes of the <LoreLink termId="cragjaw-peaks">Cragjaw Peaks</LoreLink>. A Fexric clockwork engineer named **Nesta** sought to repair an alchemical engine and accidentally trapped her own timeline in a feedback loop of temporal friction.

The price of this chronal mastery was rapid localized aging and memory displacement. Every time she manipulated time to prolong an ally's lifespan or delay a threat, her own personal history decayed, leaving her past as blank grey stone.

**CITIES & CIVIL RECEPTION**
Chronarchs are highly respected and given places of honor in the library-cathedrals of the <LoreLink termId="frozen_archive">Frozen Archive</LoreLink> and the guild chambers of <LoreLink termId="frostmaw_holdfast">Frostmaw Holdfast</LoreLink>.

**RACES & CULTURAL AFFILIATION**
The class is heavily practiced by the guild-bound <LoreLink termId="fexrick">Clockwork Fexric</LoreLink>, long-limbed Groven diplomats who oversee the Ancestor-Spans, the isolated Tessen keep-holders, and the <LoreLink termId="velun">Velun Neth</LoreLink> archivists of the memory-glass.

**NOTABLE FIGURES**
* **Nesta the Clockwork Engineer**: The Fexric builder who halted a glacier's advance by trapping herself in a temporal loop.
* **Chronos the Blind**: A prehistoric Fexric master who built the clockwork galleries in <LoreLink termId="frostmaw_holdfast">Frostmaw Holdfast</LoreLink>.`
 },

 signatureQuote: {
  text: '"I have already lived this conversation. I know exactly what you are going to say next. Please, say it anyway, the version where you chose differently gives me headaches."',
  speaker: 'Nesta of the Cragjaw Peaks',
  context: 'Reported by several engineers at Frostmaw Holdfast; Nesta herself has no memory of these encounters'
 },

 philosophy: {
  coreTenet: 'Time is not a river. It is a scar. Every moment that passes leaves a mark on the universe, and some of us are marked more deeply than others. The Chronarch does not control time, they simply remember what has not happened yet, and that memory gives them wield.',
  relationship: 'The Chronarch\'s power comes from temporal friction, the resistance generated by living in a timeline where they do not fully belong. They are out of sync with the present, their cells resonating at a frequency slightly different from everyone around them. This friction can be harnessed to create localized time-effects: slowing, stuttering, or, rarely, reversing the flow for a precious few seconds.',
  paradox: 'The Chronarch accumulates Time Shards by living through moments of high temporal stress, near-death experiences, emotional extremes, chronal coincidences. But every shard they hoard increases their Temporal Strain, calcifying their bones and erasing their past. The Chronarch must choose: live long enough to make a difference, or stay human enough to remember why.'
 },

 currentCrisis: `Nesta is disappearing. Not dying, disappearing. The original Chronarch, who hooked the time-dilation engine to her chest during the War of Thousand Screams nearly five centuries ago, has begun to fade from history. Physical records mentioning her name are going blank. People who knew her are forgetting. The other Chronarchs have gathered at Frostmaw Holdfast to witness what they believe will be her final temporal collapse.

If Nesta ceases to exist retroactively, the temporal friction she generated will redistribute to every other living Chronarch. The engineers calculate that the strain will be fatal to half of them. Worse: Nesta's disappearance may create a chronal vacuum that pulls the entire Cragjaw Peaks out of sync with the rest of the timeline, a region-sized temporal bubble that experiences time at an entirely different rate.`,

 meaningfulTradeoffs: `To be a Chronarch is to experience time as a burden. They remember conversations before they happen. They feel the weight of every possible future pressing on them simultaneously. Simple pleasures, surprise, anticipation, the joy of an unexpected gift, are unavailable to them. They already know how the meal will taste, how the song will end, how the relationship will conclude. Chronarchs become profoundly, achingly bored. The only thing that still surprises them is death, and they are never entirely sure it will stick.`,

 classSpecificLocations: [
  {
  name: 'The Chronostasis Chamber',
  locationId: 'frostmaw-holdfast',
  description: 'A sealed chamber beneath Frostmaw Holdfast where Nesta\'s original time-dilation engine continues to hum. The chamber is kept at precisely -12 degrees Celsius, the temperature at which temporal friction is minimized. Chronarchs gather here to calibrate their internal clocks and share time shards.',
  purpose: 'Calibration, meditation, and temporal maintenance',
  status: 'Active, Nesta\'s chair at the center of the chamber has been empty for three weeks'
  }
 ],

 combatRole: {
  title: "Combat Role",
  content: `The Chronarch is the ONLY class that can rewind the combat state. No one else can unmake a tactical mistake, reset a spent cooldown, or trap an enemy in a loop of their own movement. You bring a Chronarch because without one, errors are final and positioning is permanent.

**Battlefield Control**: Freeze enemies in temporal stasis, forcing them to watch helplessly as your allies reposition.
**Damage Mitigation**: Rewind damage taken by allies, but each wound you erase grafts localized kinetic recoil into your own body.
**Tactical Repositioning**: Displace allies and enemies through coordinates swapping, rewriting positioning that took entire turns to establish.
**Why Your Body Pays**: Every Flux ability deepens Temporal Strain  —  your cells undergo micro-strain as you bend causality. You take increased Arcane and Blight damage because your tether to the present is frayed; those damage types resonate with the temporal fractures already embedded in your biology.

**Weaknesses**:
- Chronal Fragility: you take +50% Arcane and Blight damage  —  those types resonate with the fractures already laced through your body.
- Shatter on Impact: forced movement, shoves, or heavy physical impacts crack your internal clock  —  your Dodge drops to 0 and you immediately roll the Temporal Backlash table.
- Strain Tightrope: every Flux pushes you toward Backlash  —  you must space your big spells or the timeline snaps back at 10 Strain.
- Backlash at 10: hit 10 Temporal Strain and the timeline snaps back, phasing you out and forcing an unpredictable, often dangerous Anomaly roll.
- Fragile and Dragging: light armor, and your movement slows as local chronal drag builds  —  you are not where the front line happens.
- Already-Lived (social): you know how every conversation, meal, and song ends; you blurt "I already know what you'll say," and your own past is going blank. You read as bored, rude, or unhinged, and you forget your own history.`
 },

 playstyle: {
  title: "Playstyle & Strategy",
  content: `Playing a Chronarch is managing an alchemical limit. Every round is a calculation of how much more your body can take before it rejects the local timeline entirely.

**Time Shard Generation**:
- Every spell cast generates 1 Time Shard (some powerful basic spells generate 2).
- Maximum capacity: 10 Time Shards, the most stolen moments your focus can hold.
- Spend shards on powerful Flux abilities that violate causality.
- Shards persist between encounters, your accumulated debt to time carries forward.

**Temporal Strain Management, Your Decay Gauge**:
- Each Temporal Flux ability deepens cellular strain (1-8 Strain).
- Strain naturally decreases by 1 per turn if no Flux abilities are used, your body fights to restabilize.
- At 10 Strain, Temporal Backlash: the timeline snaps back, phasing you out and forcing an Anomaly Table roll.

**Strategic Timing, Reading Your Decay**:
- **Low Strain (0-3)**: Safe. Your body can handle it. Use Flux abilities as needed.
- **Mid Strain (4-6)**: Caution. You feel the physical drag. Every spell costs visibly.
- **High Strain (7-9)**: Danger. Your focus vibrates violently. One more Flux may break you.
- **Critical Strain (10)**: Backlash. Your body temporarily desynchronizes from the timeline.`
 },

 immersiveCombatExample: {
  title: "Immersive Combat Example: The Chronal Recall",
  content: `Time is a thread. You have learned to pull it, to loop it, to fray it. The ironclad vanguard does not know that your presence rewrites the order of events. It charges. You are already three moves ahead.

**Round 1, Establishing the Engine**: The battle begins as a massive ironclad vanguard charges your fragile marksman ally. You cast Chrono Bolt (5 mana) at a nearby archer, dealing 1d8 + INT storm damage and slowing it. Because you are at 0 Temporal Strain, the spell kickstarts your focus and generates 2 Time Shards (2/10). Strain: 0.

**Round 2, Reaction Recovery**: The vanguard's heavy warhammer connects with your marksman. You cast Temporal Rewind as a Reaction (6 mana), rewinding the immediate trauma to heal 2d6 + Spirit. The ally's wounds knit, but you take 2 blight damage as you absorb the shock into your own nervous system as localized recoil. You gain 1 Shard (3/10). Strain: 0.

**Round 3, Heavy Flux Violation**: With 3 Shards banked, you cast Temporal Flux: Speed on your rogue (12 mana, 4 Shards, +2 Strain). The rogue is hyper-accelerated, gaining +2 AP and double movement. Your focus shimmers with silver heat; you permanently lose 1 maximum HP until your next Long Rest as cellular stability fractures. Shards: 0/10. Strain: 2.`
 }
 },

 // Resource System
 resourceSystem: {
 title: "Time Shards & Temporal Strain",
 subtitle: "Dual Resource Management System",
 description: "The Chronarch navigates the tides of time by stealing moments and paying for them in physical stamina. Time Shards represent stolen fragments of chronal energy stored in their focus. Temporal Strain measures immediate cellular fatigue as the caster bends causality. Push too far and the timeline snaps back, temporarily phasing them out of reality.",

 cards: [
  {
  title: "Time Shards (0-10)",
  stats: "Generated by Casting",
  details: "Your fuel for Temporal Flux. Every basic spell cast generates 1 Shard. Shards are persistent between encounters."
  },
  {
  title: "Temporal Strain (0-10)",
  stats: "Decays 1 per Turn",
  details: "The heat generated by Flux. If you reach 10, you suffer Temporal Backlash. Decays naturally if no Flux is used during your turn."
  }
 ],

 generationTable: {
  headers: ["Trigger", "Time Shards", "Temporal Strain", "Notes"],
  rows: [
  ["Basic Spell (Mana Only)", "+1", ",", "Primary fuel source. 2 Shards on Turn 1 if at 0 Strain."],
  ["Flux Ability (Shard Cost)", "-Cost", "+1 to +8", "Violations of causality degrade cellular structure."],
  ["No Flux Cast on Turn", ",", "-1", "Passive cellular restabilization."],
  ["Temporal Backlash", ",", "Reset to 0", "Timeline snaps back, phasing you out and triggering anomaly."],
  ["Long Rest", "Reset to 0", "Reset to 0", "Full atomic alignment restored; Temporal Strain and Backlash risk reset."]
  ]
 },

 usage: {
  momentum: "Generate Time Shards through basic spells like Chrono Bolt, Temporal Mend, or Temporal Step. Bank them to fuel high-tier Flux violations.",
  flourish: "Spend Time Shards on powerful Flux abilities. Manage your Temporal Strain closely to avoid the catastrophic 10-Strain threshold."
 },

  overheatRules: {
   title: "Temporal Backlash (10 Strain)",
   content: `Temporal Strain is not an abstract resource  —  it is the accumulated paradox-weight of every causality violation the Chronarch has committed. Reality tolerates small violations (rewinding a wound, looping a few seconds) but accrues resistance with each one. At 10 Strain, the timeline's self-correction instinct activates  —  not out of malice, but because the accumulated paradox has become noticeable to the fundamental laws that govern cause and effect. The backlash is reality's immune response to being edited.

Reaching 10 Temporal Strain causes the timeline to snap back violently, temporarily desynchronizing you from the present.

**The Desynchronization**:
- You are **Phased Out** of reality for 1 round.
- You lose your next turn completely and cannot take Reactions.
- You are completely untargetable and immune to all damage during this phase.

**The Anomaly Matrix (1d6 Table)**:
When the timeline snaps, roll 1d6 to determine the chaotic chronal fallout:
1. **Accelerated Aging**: Take 3d6 blight damage until your next Long Rest.
2. **Entropic Echo**: An entropic, hostile clone of yourself manifests in an adjacent space for 1 round, attacking your closest ally using basic Chrono Bolt profiles.
3. **Causality Loop**: Pinned to the timeline. For 1 round, you cannot move and must repeat the exact action you took last turn.
4. **Timeline Desynchronization**: You desynchronize completely, lengthening your Phased Out status to 2 rounds.
5. **Chronal Singularity**: A localized gravity implosion pulls all creatures within 15ft 10ft toward you, dealing 4d6 Storm damage to all caught in the collapse (including yourself).
6. **Paradoxical Cascade**: Suffer 4d8 Storm damage and your speed is halved for 2 rounds, but your Time Shards are instantly capped at 10.`
 },

 timeShardTable: {
  title: "Time Shard Persistence",
  headers: ["Stored Shards", "Chronal Residue Effect", "Aesthetic Shift"],
  rows: [
  ["0-3", "Negligible temporal drift. Normal interactions.", "Faint hum in the ears."],
  ["4-7", "Light refracts weirdly around hands. +1 Initiative.", "Veins shimmer with faint silver light."],
  ["8-9", "Objects drop slower around you. +2 Initiative, -2 Dodge.", "Hair strands turn stark white; skin goes cold."],
  ["10", "Stolen time overflows. +3 Initiative, -4 Dodge, -10ft Speed.", "Eyes glow silver; shadow moves out of sync."]
  ]
 },

 strategicConsiderations: {
  title: "The Toll of Causality",
  content: `**Persistent Fuel**: Time Shards do not decay after combat. If you end an encounter with 8 shards, you begin the next fight with 8 shards. This allows you to launch devastating high-level Flux spells on Turn 1,at the cost of immediate cellular decay.

**The Strain Economy**: The heaviest Flux spells (spending 4+ Shards) push multiple points of Temporal Strain at once  —  bringing you closer to the Backlash threshold. Chronomancy's cost is tracked on the Strain gauge, not in flesh: bank Shards, spend them on Flux, and manage Strain so the timeline doesn't snap back.

**Vulnerability to Silence/Necrotic**: Because your atomic anchor is frayed, you take 50% extra damage from all Silence and Necrotic sources. and, if you are subjected to forced movement (shoves, pulls, knockbacks) or time acceleration fields, your internal clock fractures,instantly dropping your Dodge rating to 0 and triggering an immediate roll on the Temporal Backlash Table.`
 },

 playingInPerson: {
  title: "Tabletop Tracking Guide",
  subtitle: "Managing Chronology with Physical Dice",
  content: `Tracking the Chronarch's dual resources is simple with two standard dice.

**Table Setup**:
- **Blue d10 (Time Shards)**: Keep this on the left. Rotate it to track stolen moments (0-10).
- **Red d10 (Temporal Strain)**: Keep this on the right. Rotate it to track cellular decay (0-10).

**The Flow**:
1. When you cast a basic spell, rotate the Blue d10 up by 1.
2. When you cast a Flux spell, rotate the Blue d10 down by the Shard cost, and rotate the Red d10 up by the Strain gain.
3. If the Red d10 hits 10, immediately tip both dice over, announce your desynchronization, and roll a standard d6 for the Backlash Anomaly.`
 }
 },

 // Specializations
 specializations: {
 title: "Chronomantic Specializations",
 subtitle: "Three Paths of causality Distortion",
 description: "Every Chronarch must decide how they will channel the chronal decay consuming their body.",

 specs: [
  {
  id : "stasis",
  name: "Arc of Stasis",
  icon: "fas fa-snowflake",
  color: "#4A90E2",
  theme: "Warden of Still Moments",
  playstyle: "Battlefield freeze, single-target lock down, zone control.",
  description: "Warden of Still Moments. These Chronarchs specialize in trapping enemies inside frozen instants,sealing them in temporal amber while their allies are dismantled around them.",
  strengths: [
   "Powerful crowd control through Stun/Stasis",
   "Excellent defensive zones and barriers",
   "Can freeze debuffs, preventing them from decaying"
  ],
  weaknesses: [
   "Lower mobility options",
   "Highly reliant on constitution saves landing",
   "High Strain cost for heavy freeze spells"
  ],
  specPassive: {
   name: "Temporal Amber",
   description: "Enemies trapped in your stasis effects have their saving throws against your chronal locks reduced by 2."
  }
  },
  {
  id : "displacement",
  name: "Arc of Displacement",
  icon: "fas fa-exchange-alt",
  color: "#F5A623",
  theme: "The Shattered Pace",
  playstyle: "High mobility, turn-order manipulation, tactical coordinates swap.",
  description: "The Shattered Pace. Speed specialists who manipulate movement and position by tearing the temporal fabric between allies and enemies.",
  strengths: [
   "Highest mobility of all specializations",
   "Can swap positions of allies and enemies",
   "Excellent AP generation for party members"
  ],
  weaknesses: [
   "Rapid Strain accumulation",
   "Very fragile positioning",
   "Requires strict turn-order planning"
  ],
  specPassive: {
   name: "Pace Folding",
   description: "Whenever you swap coordinates with a creature, you gain +2 Dodge and +10ft speed for 1 round."
  }
  },
  {
  id : "rewinding",
  name: "Arc of Rewinding",
  icon: "fas fa-history",
  color: "#7ED321",
  theme: "The Harrowing Martyr",
  playstyle: "Aggressive healing, debuff stripping, state reversal.",
  description: "The Harrowing Martyr. These Chronarchs absorb the kinetic trauma of others by rewinding time around injuries and erasing harmful effects.",
  strengths: [
   "Unparalleled healing and recovery",
   "Can completely undo recent damage",
   "Excellent debuff and condition cleanses"
  ],
  weaknesses: [
   "Caster takes self-inflicted blight damage on heals",
   "High mana expenditure",
   "Extremely punishing cellular decay on ultimates"
  ],
  specPassive: {
   name: "Wound Grafting",
   description: "Whenever you rewind damage for an ally, you absorb a fraction of the impact, dealing 2 blight damage to yourself but increasing the healing output by +1d8."
  }
  }
 ]
 },

 // Character Creation steps
 characterCreation: {
 steps: [
  "Choose your timepiece arcane focus, an ornate hourglass, ancient pocket watch, crystalline sundial, or water clock.",
  "Select your specialization: Arc of Stasis (control), Arc of Displacement (speed), or Arc of Rewinding (undoing).",
  "Pick your 3 starting spells from the Level 1 spell pool (Chrono Bolt, Temporal Mend, Temporal Step).",
  "Record your starting Time Shards (0/10) and Temporal Strain (0/10).",
  "Review your Temporal Backlash threshold, reaching 10 Strain means your body rejects the timeline, Phasing Out and triggering a roll on the 1d6 Temporal Backlash Table."
 ],
 choices: [
  {
  name: "Equipment Path A: Warden of Stillness",
  icon: "fas fa-shield-alt",
  items: [
   "Rune-Etched Quarterstaff (1d6 bludgeoning, hums with localized inertia)",
   "Steel-Bound Arcane Hourglass (Focus, sand shimmers and flows selectively)",
   "Scholar's Robes (Armor 10, weaves of protective silver mesh)"
  ],
  description: "Designed for tactical momentum, zone management, and slower, stasis-based battlefield control."
  },
  {
  name: "Equipment Path B: Shattered Velocity",
  icon: "fas fa-bolt",
  items: [
   "Dual Chrono-Daggers (1d4 piercing each, blades hum with micro-vibrations of accelerated time)",
   "Brass Chronal Astrolabe (Focus, mechanical gears spin dynamically with speed)",
   "Reinforced Leather Tunic (Armor 11, light and highly agile)"
  ],
  description: "Optimized for high-velocity playstyles, rapid Time Shard generation, and reactive coordinates swapping."
  }
 ],
 standardGear: [
  "Chronarch's Journal (contains starting spells and relativity formulas)",
  "Vial of alchemical chronal powder",
  "1d10 x 5 rusted copper coins"
 ],
 notes: "Requires an active timepiece focus to stabilize temporal reality during casting."
 },

 // Resource bars
 resourceBars: [
 {
  id : "time_shards",
  name: "Time Shards",
  icon: "fas fa-gem",
  maxValue: 10,
  color: "#4A90E2",
  description: "Generated by casting spells, spent on Temporal Flux abilities"
 },
 {
  id : "temporal_strain",
  name: "Temporal Strain",
  icon: "fas fa-fire",
  maxValue: 10,
  color: "#E53935",
  description: "Accumulated when using Temporal Flux abilities. At 10, suffer Temporal Backlash."
 }
 ],

 // Spells
 spells: [
 // ========================================
 // LEVEL 1 SPELLS - The Core Engine
 // ========================================
  { id: "chrono_slow_fall",
   name: "Slow Fall",
   description: "Freeze temporal friction beneath falling boots. Target floats down gently (10 ft/sec), taking 0 fall damage regardless of drop height.",
   level: 1,
   spellType: "REACTION",
   icon: "Utility/Speed Dash",
   typeConfig: { school: "storm", icon: "Utility/Speed Dash", tags: ["utility", "reaction", "temporal", "chronarch"], castTime: 1, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 60, targetRestrictions: ["ally", "self"] },
   resourceCost: { actionPoints: 1, mana: 0 },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 }
  },
  { id: "chrono_time_blink",
   name: "Time Blink",
   description: "Step through a micro-second gap in the clockwork lattice. Instantly teleport 30 ft to an unoccupied sightline space, cleansing all non-magical Roots and Grapples.",
   level: 2,
   spellType: "ACTION",
   icon: "Utility/Speed Dash",
   typeConfig: { school: "storm", icon: "Utility/Speed Dash", tags: ["utility", "teleport", "blink", "chronarch"], castTime: 1, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "point", rangeType: "ranged", rangeDistance: 30 },
   resourceCost: { actionPoints: 1, mana: 0 },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 }
  },
 { id: "chrono_bolt",
  name: "Chrono Bolt",
  description: "Hurl a bolt of calcified chronal energy dealing 1d8 + INT storm damage. If at 0 Temporal Strain, generate 2 Time Shards instead of 1, kickstarting your engine on Turn 1.",
  level: 1,
  spellType: "ACTION",
  icon: "Arcane/Missile",
  typeConfig: {
  school: "storm",
  icon: "Arcane/Missile",
  tags: ["ranged", "damage", "slow", "stasis"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 60,
  targetRestrictions: ["enemy"]
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards"],
  resourceValues: {
   mana: 5,
   time_shard_generate: 1
  },
  classResource: { type: "time_shards", cost: -1 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Tempus Decurrit",
  somaticText: "Flick your wrist forward, throwing a silver bolt of calcified temporal force."
  },
  resolution: "DICE",
  effectTypes: ["damage", "debuff"],
  damageConfig: {
  formula: "1d8 + intelligence",
  elementType: "storm",
  damageTypes: ["storm"],
  canCrit: true,
  critMultiplier: 2,
  resolution: "DICE"
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   {
   id : "chrono_bolt_slow",
   name: "Calcified Gait",
   description: "Movement speed is reduced by 10 feet.",
   mechanicsText: "Reduce movement speed by 10 feet.",
   movementPenalty: 10,
   statusEffect: {
    type: "speed_penalty",
    value: -10
   }
   }
  ],
  durationValue: 2,
  durationType: "rounds",
  durationUnit: "rounds"
  },
  tags: ["ranged", "damage", "slow", "stasis", "starter", "chronarch"]
 },

 { id: "temporal_mend",
  name: "Temporal Mend",
  description: "Rewind the immediate physical trauma of an ally, restoring 1d8 + Spirit HP. Consume 1 Time Shard to heal an additional 1d6 and cool your own Strain by 1.",
  level: 1,
  spellType: "ACTION",
  icon: "Arcane/Sands of Time",
  typeConfig: {
  school: "arcane",
  icon: "Arcane/Sands of Time",
  tags: ["heal", "rewinding", "support"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 30,
  targetRestrictions: ["ally"]
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards"],
  resourceValues: {
   mana: 6,
   time_shard_generate: 1
  },
  classResource: { type: "time_shards", cost: -1 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Tempus Restituere",
  somaticText: "Trace a counter-clockwise circle in the air to reverse localized skin and tissue stress."
  },
  resolution: "DICE",
  effectTypes: ["healing"],
  healingConfig: {
  formula: "1d8 + spirit",
  resolution: "DICE",
  healingType: "direct"
  },
  tags: ["heal", "rewinding", "support", "starter", "chronarch"]
 },

 { id: "temporal_step",
  name: "Temporal Step",
  description: "Step through local temporal cracks to reposition up to 20 feet. Generates 1 Time Shard and adds +1 Temporal Strain, instantly priming your chronal engine.",
  level: 1,
  spellType: "ACTION",
  icon: "Arcane/Quick Step",
  typeConfig: {
  school: "arcane",
  icon: "Arcane/Quick Step",
  tags: ["utility", "mobility", "displacement"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "self",
  rangeType: "self"
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards", "temporal_strain"],
  resourceValues: {
   mana: 8,
   time_shard_generate: 1,
   temporal_strain_gain: 1
  },
  classResource: [
   { type: "time_shards", cost: -1 },
   { type: "temporal_strain", cost: -1 }
  ],
  actionPoints: 1,
  components: ["somatic"],
  somaticText: "Step forward as space shimmers, vanishing and reappearing 20 feet away."
  },
  resolution: "AUTOMATIC",
  effectTypes: ["utility"],
  utilityConfig: {
  utilityType: "reposition",
  selectedEffects: [
   {
   id : "temporal_dash",
   name: "Chronal Leap",
   description: "Move up to 20 feet without provoking attacks of opportunity."
   }
  ]
  },
  tags: ["utility", "mobility", "displacement", "starter", "chronarch"]
 },

 { id: "chrono_frailty",
  name: "Temporal Inversion & Fragility",
  description: "Frayed coherence gives you 50% blight vulnerability. Forced movement or acceleration drops Dodge to 0 and triggers immediate Temporal Backlash.",
  level: 1,
  spellType: "PASSIVE",
  icon: "Arcane/Rewind Time",
  effectTypes: ["passive", "debuff"],
  typeConfig: {
  school: "arcane",
  icon: "Arcane/Rewind Time",
  tags: ["passive", "weakness", "fatal-flaw"],
  castTime: 0,
  castTimeType: "PASSIVE"
  },
  targetingConfig: {
  targetingType: "self",
  rangeType: "self"
  },
  resourceCost: {
  actionPoints: 0
  },
  resolution: "AUTOMATIC",
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   {
   id : "frayed_chronal_coherence",
   name: "Frayed Anchor",
   description: "Takes 50% extra damage from Silence and blight damage.",
   mechanicsText: "Gain 50% vulnerability to Silence and blight damage.",
   statusEffect: {
    type: "vulnerability",
    vulnerabilityTypes: ["blight", "blight"],
    percentage: 50
   }
   },
   {
   id : "internal_clock_fracture",
   name: "Temporal Inversion",
   description: "If subjected to forced movement, Dodge drops to 0 and triggers immediate Temporal Backlash.",
   mechanicsText: "Forced movement drops Dodge to 0 and triggers Temporal Backlash.",
   statusEffect: {
    type: "condition_trigger",
    trigger: "forced_movement_or_acceleration",
    dodgePenalty: "set_to_zero",
    backlashTrigger: true
   }
   }
  ],
  durationValue: 0,
  durationType: "permanent"
  },
  tags: ["passive", "weakness", "fatal-flaw", "chronarch"]
 },

 { id: "temporal_backlash",
  name: "Temporal Backlash Anomaly",
  description: "Reaching 10 Temporal Strain resets Strain to 0, forces a Phased Out state (lose next turn and reactions), and triggers a roll on the 1d6 Anomaly Table.",
  level: 1,
  spellType: "PASSIVE",
  icon: "Arcane/Spiral Vortex",
  effectTypes: ["passive"],
  typeConfig: {
  school: "storm",
  icon: "Arcane/Spiral Vortex",
  tags: ["passive", "backlash", "anomaly"],
  castTime: 0,
  castTimeType: "PASSIVE"
  },
  targetingConfig: {
  targetingType: "self",
  rangeType: "self"
  },
  resourceCost: {
  actionPoints: 0
  },
  resolution: "AUTOMATIC",
  rollableTable: {
  enabled: true,
  tableName: "Temporal Backlash Anomalies",
  description: "Roll 1d6 when you reach 10 Temporal Strain. The timeline fractures, manifesting one of the following tragic anomalies:",
  diceFormula: "1d6",
  resolutionType: "DICE",
  resolutionConfig: {
   diceType: "d6"
  },
  entries: [
   {
   range: { min: 1, max: 1 },
   customName: "Accelerated Aging",
   effect: "Your cellular clock accelerates under friction. Take 3d6 blight damage until your next Long Rest."
   },
   {
   range: { min: 2, max: 2 },
   customName: "Entropic Echo",
   effect: "An entropic, hostile clone of yourself manifests in an adjacent space. It acts on its own initiative, casts basic Chrono Bolt at your closest ally, then dissolves."
   },
   {
   range: { min: 3, max: 3 },
   customName: "Causality Loop",
   effect: "You are pinned in space. For 1 round, you cannot move, and you must repeat the exact action you took on your previous turn."
   },
   {
   range: { min: 4, max: 4 },
   customName: "Timeline Desynchronization",
   effect: "You completely desynchronize from the present. You are Phased Out, lose your next turn, and cannot take reactions. You are immune to all damage during this time."
   },
   {
   range: { min: 5, max: 5 },
   customName: "Chronal Singularity",
   effect: "An implosive distortion forms. All creatures within 15 feet (including yourself) must make an Agility save or be pulled 10 feet toward you and take 4d6 Storm damage."
   },
   {
   range: { min: 6, max: 6 },
   customName: "Paradoxical Cascade",
   effect: "A cascade of chronal energy erupts. You take 4d8 Storm damage and speed is halved for 2 rounds, but Time Shards are instantly capped at 10."
   }
  ]
  },
  tags: ["passive", "backlash", "anomaly", "chronarch"]
 },

 // ========================================
 // LEVEL 2 SPELLS - Stasis, Rewinding, displacement
 // ========================================
 { id: "stasis_field",
  name: "Stasis Field",
  description: "Trap an enemy inside frozen temporal amber, stunning them for 1 round (DC 14 Con save negates). Somatic feedback inflicts 3 direct damage to the caster.",
  level: 2,
  spellType: "ACTION",
  icon: "Force/Force Field",
  typeConfig: {
  school: "arcane",
  icon: "Force/Force Field",
  tags: ["stasis", "control", "stun"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 30,
  targetRestrictions: ["enemy"]
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards"],
  resourceValues: {
   mana: 8,
   time_shard_generate: 1
  },
  classResource: { type: "time_shards", cost: -1 },
  hp: 3,
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Tempus Tene, Siste",
  somaticText: "Clench your fist tightly toward the target, absorbing 3 points of calcifying feedback."
  },
  resolution: "SAVE",
  effectTypes: ["debuff"],
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   {
   id : "stasis_stun",
   name: "Frozen Moment",
   description: "Stunned. Cannot take actions or reactions.",
   mechanicsText: "Stun target for 1 round.",
   statusType: "stunned"
   }
  ],
  durationValue: 1,
  durationType: "rounds",
  durationUnit: "rounds",
  savingThrow: {
   ability: "constitution",
   difficultyClass: 14,
   saveOutcome: "negates"
  }
  },
  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 1
  },
  tags: ["stasis", "control", "stun", "chronarch"]
 },

 { id: "temporal_rewind",
  name: "Temporal Rewind",
  description: "As a reaction, rewind time around a recent injury to heal an ally for 2d6 + Spirit. The caster takes 2 blight damage from absorbing local recoil.",
  level: 2,
  spellType: "REACTION",
  icon: "Arcane/Rewind Time",
  typeConfig: {
  school: "arcane",
  icon: "Arcane/Rewind Time",
  tags: ["heal", "rewinding", "reaction", "support"],
  castTime: 0,
  castTimeType: "REACTION"
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 30,
  targetRestrictions: ["ally"]
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards", "reaction"],
  resourceValues: {
   mana: 6,
   time_shard_generate: 1,
   reaction: 1
  },
  classResource: { type: "time_shards", cost: -1 },
  actionPoints: 0,
  components: ["somatic"],
  somaticText: "Snap fingers as a reaction, absorbing the ally's impact momentum as a physical shock."
  },
  resolution: "DICE",
  effectTypes: ["healing"],
  healingConfig: {
  formula: "2d6 + spirit",
  resolution: "DICE",
  healingType: "direct"
  },
  triggerConfig: {
  triggers: [
   {
   id : "temporal_rewind_recoil",
   name: "Chronal Recoil",
   triggerType: "on_cast",
   action: "Caster takes 2 blight damage from absorbing local recoil."
   }
  ]
  },
  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 1
  },
  tags: ["heal", "rewinding", "reaction", "support", "chronarch"]
 },

 { id: "chrono_echo",
  name: "Chrono Echo",
  description: "Leave a silver chronal duplicate behind and teleport up to 30 feet. At the start of your next turn, you may choose to swap coordinates with your echo.",
  level: 2,
  spellType: "ACTION",
  icon: "Arcane/Zen",
  typeConfig: {
  school: "arcane",
  icon: "Arcane/Zen",
  tags: ["utility", "mobility", "displacement"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "self",
  rangeType: "self"
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards"],
  resourceValues: {
   mana: 7,
   time_shard_generate: 1
  },
  classResource: { type: "time_shards", cost: -1 },
  actionPoints: 1,
  components: ["somatic"],
  somaticText: "Puff chronal dust, sliding away while leaving a silver echo in place."
  },
  resolution: "AUTOMATIC",
  effectTypes: ["utility"],
  utilityConfig: {
  utilityType: "reposition",
  selectedEffects: [
   {
   id : "echo_teleport",
   name: "Leave Echo",
   description: "Teleport up to 30 feet, leaving a copy at starting location."
   }
  ]
  },
  tags: ["utility", "mobility", "displacement", "chronarch"]
 },

 // ========================================
 // LEVEL 3 SPELLS - Dilation, Crystals, Foresight
 // ========================================
 { id: "temporal_dilation",
  name: "Temporal Dilation",
  description: "Establish a 15ft zone for 3 rounds. Allies inside gain +1 AP per round, while enemies have their speed halved. causality violation adds +1 Strain.",
  level: 3,
  spellType: "ACTION",
  icon: "Arcane/Swirling Vortex",
  typeConfig: {
  school: "arcane",
  icon: "Arcane/Swirling Vortex",
  tags: ["flux", "dilation", "displacement", "support", "slow"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 30,
  aoeShape: "circle",
  aoeParameters: { radius: 15 },
  targetRestrictions: []
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards", "temporal_strain"],
  resourceValues: {
   mana: 8,
   time_shard_cost: 2,
   temporal_strain_gain: 1
  },
  classResource: { type: "time_shards", cost: 2 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Tempus Dilato",
  somaticText: "Spread hands wide, establishing an expanding translucent dome of altered physics."
  },
  resolution: "AUTOMATIC",
  effectTypes: ["buff", "debuff"],
  buffConfig: {
  buffType: "statusEffect",
  effects: [
   {
   id : "dilation_haste",
   name: "Accelerated Cadence",
   description: "Gains +1 Action Point per round.",
   mechanicsText: "Affected allies gain +1 Action Point per round.",
   statusEffect: {
    type: "energized",
    bonusActionPoints: 1
   }
   }
  ],
  durationValue: 3,
  durationType: "rounds"
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   {
   id : "dilation_slow",
   name: "Sluggish Clock",
   description: "Movement speed is halved.",
   mechanicsText: "Affected enemies have movement speed halved.",
   statusEffect: {
    type: "speed_penalty",
    speedMultiplier: 0.5
   }
   }
  ],
  durationValue: 3,
  durationType: "rounds"
  },
  tags: ["flux", "dilation", "displacement", "support", "slow", "chronarch"]
 },

 { id: "time_crystal",
  name: "Time Crystal",
  description: "Condense chronal energy into a barrier on an ally absorbing 2d8 + INT damage. When the shield shatters, it releases a pulse that slows attackers.",
  level: 3,
  spellType: "ACTION",
  icon: "Force/Force Shield",
  typeConfig: {
  school: "storm",
  icon: "Force/Force Shield",
  tags: ["stasis", "shield", "support"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 30,
  targetRestrictions: ["ally"]
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards"],
  resourceValues: {
   mana: 8,
   time_shard_generate: 1
  },
  classResource: { type: "time_shards", cost: -1 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Crystallum Temporis",
  somaticText: "Forge a hexagonal crystalline shell around target with quick finger taps."
  },
  resolution: "DICE",
  effectTypes: ["buff"],
  buffConfig: {
  buffType: "statusEffect",
  effects: [
   {
   id : "time_crystal_shield",
   name: "Chronal Shield",
   description: "Absorbs incoming damage.",
   mechanicsText: "Absorb 2d8 + INT incoming damage.",
   statusEffect: {
    type: "shield",
    shieldAmount: "2d8 + intelligence"
   }
   }
  ],
  durationValue: 3,
  durationType: "rounds"
  },
  tags: ["stasis", "shield", "support", "chronarch"]
  },

  { id: "temporal_foresight",
  name: "Temporal Foresight",
  description: "Glimpse high-probability timelines to grant an ally advantage on all attack rolls and saving throws for 2 rounds as they anticipate threats.",
  level: 3,
  spellType: "ACTION",
  icon: "Arcane/Sands of Time",
  typeConfig: {
  school: "arcane",
  icon: "Arcane/Sands of Time",
  tags: ["buff", "rewinding", "support"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 30,
  targetRestrictions: ["ally"]
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards"],
  resourceValues: {
   mana: 8,
   time_shard_generate: 1
  },
  classResource: { type: "time_shards", cost: -1 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Tempus Providebo",
  somaticText: "Touch the ally's temples, transferring momentary flashes of relative outcomes."
  },
  resolution: "AUTOMATIC",
  effectTypes: ["buff"],
  buffConfig: {
  buffType: "statusEffect",
  effects: [
   {
   id : "foresight_advantage",
   name: "Glimpsed Timelines",
   description: "Gains advantage on attack rolls and saving throws.",
   mechanicsText: "Grant advantage on all attack rolls and saving throws.",
   statusEffect: {
    type: "combat_advantage",
    advantageType: "super"
   }
   }
  ],
  durationValue: 2,
  durationType: "rounds"
  },
  tags: ["buff", "rewinding", "support", "chronarch"]
 },

 { id: "paradox_accumulation",
  name: "Paradox Accumulation",
  description: "Your magic feeds on chronal drift. While you bank 5+ Time Shards, your force and arcane damage spells deal an additional 1d6 damage.",
  level: 3,
  spellType: "PASSIVE",
  icon: "Arcane/Abstract Rune",
  effectTypes: ["passive"],
  typeConfig: {
  school: "arcane",
  icon: "Arcane/Abstract Rune",
  tags: ["passive", "damage", "buff"],
  castTime: 0,
  castTimeType: "PASSIVE"
  },
  targetingConfig: {
  targetingType: "self",
  rangeType: "self"
  },
  resourceCost: {
  actionPoints: 0
  },
  resolution: "AUTOMATIC",
  tags: ["passive", "damage", "buff", "chronarch"]
 },

 // ========================================
 // LEVEL 4 SPELLS - Vortex, Flux: Rewind, Paradox
 // ========================================
 { id: "temporal_vortex",
  name: "Temporal Vortex",
  description: "Create a swirling vortex dealing 3d6 + INT storm damage to enemies in a 20ft radius and pulling them 10ft closer (DC 14 Agility save halves/negates).",
  level: 4,
  spellType: "ACTION",
  icon: "Force/Force Wave",
  typeConfig: {
  school: "storm",
  icon: "Force/Force Wave",
  tags: ["stasis", "damage", "aoe", "pull"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 40,
  aoeShape: "circle",
  aoeParameters: { radius: 20 },
  targetRestrictions: ["enemy"]
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards"],
  resourceValues: {
   mana: 10,
   time_shard_generate: 1
  },
  classResource: { type: "time_shards", cost: -1 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Vortex Temporis",
  somaticText: "Spike hand down, churning the air to establish a gravitation draft."
  },
  resolution: "SAVE",
  effectTypes: ["damage", "debuff"],
  damageConfig: {
  formula: "3d6 + intelligence",
  elementType: "storm",
  damageTypes: ["storm"],
  canCrit: true,
  critMultiplier: 2,
  savingThrow: {
   ability: "agility",
   difficultyClass: 14,
   saveOutcome: "half_damage"
  },
  resolution: "DICE"
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   {
   id : "vortex_pull",
   name: "Gravitational Drift",
   description: "Dragged 10 feet closer to vortex center.",
   mechanicsText: "Drag targets 10 feet closer to the center.",
   statusEffect: {
    type: "forced_movement",
    distance: 10
   }
   }
  ],
  durationValue: 0,
  durationType: "permanent",
  savingThrow: {
   ability: "agility",
   difficultyClass: 14,
   saveOutcome: "negates"
  }
  },
  tags: ["stasis", "damage", "aoe", "pull", "chronarch"]
 },

 { id: "temporal_flux_rewind",
  name: "Temporal Flux: Rewind",
  description: "Heavy Flux. Rewind an ally's timeline to heal 4d8 + Spirit and clear physical debuffs. Caster takes 1d6 blight recoil.",
  level: 4,
  spellType: "ACTION",
  icon: "Arcane/Rewind Time",
  typeConfig: {
  school: "arcane",
  icon: "Arcane/Rewind Time",
  tags: ["flux", "heal", "cleanse", "rewinding"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 30,
  targetRestrictions: ["ally"]
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards", "temporal_strain"],
  resourceValues: {
   mana: 12,
   time_shard_cost: 4,
   temporal_strain_gain: 2
  },
  classResource: { type: "time_shards", cost: 4 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Fluxus Revertere",
  somaticText: "Yank hands backward violently as if pulling threads, absorbing relative backlash."
  },
  resolution: "DICE",
  effectTypes: ["healing"],
  healingConfig: {
  formula: "4d8 + spirit",
  resolution: "DICE",
  healingType: "direct"
  },
  triggerConfig: {
  triggers: [
   {
   id : "temporal_flux_rewind_recoil",
   name: "Chronal Recoil",
   triggerType: "on_cast",
   action: "Caster takes 1d6 blight recoil damage."
   }
  ]
  },
  permanentCost: {
  type: "max_hp",
  amount: 1,
  duration: "long_rest",
  description: "Temporal Strain builds as cellular stability fractures."
  },
  tags: ["flux", "heal", "cleanse", "rewinding", "chronarch"]
 },

 { id: "temporal_paradox",
  name: "Temporal Paradox",
  description: "Create a paradox trap on a single tile. When an enemy steps on it, they are returned to their starting coordinate and speed is reduced to 0.",
  level: 4,
  spellType: "ACTION",
  icon: "Arcane/Sands of Time",
  typeConfig: {
  school: "arcane",
  icon: "Arcane/Sands of Time",
  tags: ["displacement", "trap", "control"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 30,
  targetRestrictions: []
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards"],
  resourceValues: {
   mana: 10,
   time_shard_generate: 1
  },
  classResource: { type: "time_shards", cost: -1 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Paradoxum Locis",
  somaticText: "Etch a circular paradox seal in the air, throwing it down to anchor a tile."
  },
  resolution: "AUTOMATIC",
  effectTypes: ["utility"],
  utilityConfig: {
  utilityType: "trap",
  selectedEffects: [
   {
   id : "paradox_trigger",
   name: "Paradox Loop",
   description: "Enemy is returned to starting position and movement speed drops to 0."
   }
  ]
  },
  tags: ["displacement", "trap", "control", "chronarch"]
 },

 // ========================================
 // LEVEL 5 SPELLS - Anchor, Thorns, Flux: Shield, Flux: Speed
 // ========================================
 { id: "temporal_anchor",
  name: "Temporal Anchor",
  description: "Establish a molecular anchor on a creature. At the end of 2 rounds, they are instantly teleported back to the coordinate where the anchor was cast.",
  level: 5,
  spellType: "ACTION",
  icon: "Arcane/Angular Rune",
  typeConfig: {
  school: "arcane",
  icon: "Arcane/Angular Rune",
  tags: ["displacement", "teleport", "utility"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 30,
  targetRestrictions: []
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards"],
  resourceValues: {
   mana: 12,
   time_shard_generate: 1
  },
  classResource: { type: "time_shards", cost: -1 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Ancora Temporis",
  somaticText: "Slam hand flat onto the air, pinning a molecular marker at target coordinates."
  },
  resolution: "AUTOMATIC",
  effectTypes: ["utility"],
  utilityConfig: {
  utilityType: "reposition",
  selectedEffects: [
   {
   id : "anchor_set",
   name: "Anchored State",
   description: "Positional coordinates are locked and will reset in 2 rounds."
   }
  ]
  },
  tags: ["displacement", "teleport", "utility", "chronarch"]
 },

 { id: "temporal_thorns",
  name: "Temporal Thorns",
  description: "Weave chronal threads on an ally: attackers take 1d6 blight damage and gain disadvantage on attacks against the ally for 3 rounds (DC 15 Con save).",
  level: 5,
  spellType: "ACTION",
  icon: "Force/Force Shield",
  typeConfig: {
  school: "storm",
  icon: "Force/Force Shield",
  tags: ["stasis", "protection", "support", "debuff"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 30,
  targetRestrictions: ["ally"]
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards"],
  resourceValues: {
   mana: 10,
   time_shard_generate: 1
  },
  classResource: { type: "time_shards", cost: -1 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Tempus Protegere",
  somaticText: "Create a static friction temporal barrier by rubbing hands together."
  },
  resolution: "SAVE",
  effectTypes: ["debuff"],
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   {
   id : "temporal_barrier_effect",
   name: "Temporal Aging",
   description: "Attackers age rapidly, taking 1d6 blight damage and having disadvantage on attacks.",
   mechanicsText: "Attackers take 1d6 blight damage and suffer disadvantage on attacks.",
   statusEffect: {
    type: "attackers_disadvantage"
   }
   }
  ],
  durationValue: 3,
  durationType: "rounds",
  durationUnit: "rounds",
  savingThrow: {
   ability: "constitution",
   difficultyClass: 15,
   saveOutcome: "negates"
  }
  },
  tags: ["stasis", "protection", "support", "debuff", "chronarch"]
 },

 { id: "temporal_flux_shield",
  name: "Temporal Flux: Shield",
  description: "Heavy Flux protection. Encase an ally in a stasis bubble absorbing 4d8 + INT damage and granting CC immunity for 2 rounds. Temporal Strain accumulates.",
  level: 5,
  spellType: "ACTION",
  icon: "Force/Force Shield",
  typeConfig: {
  school: "arcane",
  icon: "Force/Force Shield",
  tags: ["flux", "shield", "support", "stasis"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 30,
  targetRestrictions: []
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards", "temporal_strain"],
  resourceValues: {
   mana: 12,
   time_shard_cost: 4,
   temporal_strain_gain: 2
  },
  classResource: { type: "time_shards", cost: 4 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Fluxus Aegis",
  somaticText: "Cross wrists, drawing a shield out of static timelines to wrap target."
  },
  resolution: "DICE",
  effectTypes: ["buff"],
  buffConfig: {
  buffType: "statusEffect",
  effects: [
   {
   id : "flux_shield_absorb",
   name: "Temporal Aegis",
   description: "Absorbs damage and blocks all CC.",
   mechanicsText: "Absorb 4d8 + INT damage and gain total CC immunity.",
   statusEffect: {
    type: "shielded",
    shieldAmount: "4d8 + intelligence"
   }
   }
  ],
  durationValue: 2,
  durationType: "rounds"
  },
   permanentCost: {
   type: "max_hp",
   amount: 1,
   duration: "long_rest",
   description: "Temporal Strain builds as cellular stability fractures."
   },
   triggerConfig: {
   triggers: [
    {
    id : "temporal_flux_shield_recoil",
    name: "Chronal Recoil",
    triggerType: "on_cast",
    action: "Temporal Strain accumulates."
    }
   ]
   },
   tags: ["flux", "shield", "support", "stasis", "chronarch"]
  },

  { id: "temporal_flux_speed",
  name: "Temporal Flux: Speed",
  description: "Heavy Flux acceleration. Grant an ally +2 AP and double movement speed for 2 rounds. Caster suffers cold chills.",
  level: 5,
  spellType: "ACTION",
  icon: "Utility/Speed Boot",
  typeConfig: {
  school: "arcane",
  icon: "Utility/Speed Boot",
  tags: ["flux", "haste", "support", "displacement"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 30,
  targetRestrictions: ["ally"]
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards", "temporal_strain"],
  resourceValues: {
   mana: 12,
   time_shard_cost: 4,
   temporal_strain_gain: 2
  },
  classResource: { type: "time_shards", cost: 4 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Fluxus Celeritas",
  somaticText: "Push target forward, forcing their molecules to vibrate dynamically at high velocities."
  },
  resolution: "AUTOMATIC",
  effectTypes: ["buff"],
  buffConfig: {
  buffType: "statusEffect",
  effects: [
   {
   id : "flux_speed_haste",
   name: "Hyper-Acceleration",
   description: "Gains +2 Action Points and double speed.",
   mechanicsText: "Grant ally +2 Action Points and double speed.",
   statusEffect: {
    type: "haste",
    speedMultiplier: 2.0,
    extraActions: 2
   }
   }
  ],
  durationValue: 2,
  durationType: "rounds"
  },
   permanentCost: {
   type: "max_hp",
   amount: 1,
   duration: "long_rest",
   description: "Temporal Strain builds as time accelerates past cells."
   },
   triggerConfig: {
   triggers: [
    {
    id : "temporal_flux_speed_recoil",
    name: "Chronal Recoil",
    triggerType: "on_cast",
    action: "Temporal Strain accumulates."
    }
   ]
   },
   tags: ["flux", "haste", "support", "displacement", "chronarch"]
  },

  // ========================================
  // LEVEL 6 SPELLS - Fracture, Echoes, Flux: Loop
 // ========================================
 { id: "temporal_fracture",
  name: "Temporal Fracture",
  description: "Tear a micro-fracture in the target's timeline, dealing 4d8 + INT storm damage and blocking them from taking Reactions for 2 rounds.",
  level: 6,
  spellType: "ACTION",
  icon: "Force/Energy Blast 1",
  typeConfig: {
  school: "storm",
  icon: "Force/Energy Blast 1",
  tags: ["stasis", "damage", "debuff"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 60,
  targetRestrictions: ["enemy"]
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards"],
  resourceValues: {
   mana: 12,
   time_shard_generate: 1
  },
  classResource: { type: "time_shards", cost: -1 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Fractura Temporis",
  somaticText: "Flick fingers outward, making a fracturing motion that tears localized air molecules."
  },
  resolution: "DICE",
  effectTypes: ["damage", "debuff"],
  damageConfig: {
  formula: "4d8 + intelligence",
  elementType: "storm",
  damageTypes: ["storm"],
  canCrit: true,
  critMultiplier: 2,
  resolution: "DICE"
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   {
   id : "fracture_silence",
   name: "Severed Reaction",
   description: "Cannot take reactions for 2 rounds.",
   mechanicsText: "Block reactions for 2 rounds.",
   statusEffect: {
    type: "reaction_locked"
   }
   }
  ],
  durationValue: 2,
  durationType: "rounds"
  },
  tags: ["stasis", "damage", "debuff", "chronarch"]
 },

 { id: "temporal_echoes",
  name: "Temporal Echoes",
  description: "Summon two chronal echoes of an ally: their next attack deals +2d6 arcane damage, and attacks against them have a 50% chance to hit an echo instead.",
  level: 6,
  spellType: "ACTION",
  icon: "Arcane/Wizard Spell Casting",
  typeConfig: {
  school: "arcane",
  icon: "Arcane/Wizard Spell Casting",
  tags: ["displacement", "buff", "support"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 30,
  targetRestrictions: ["ally"]
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards"],
  resourceValues: {
   mana: 14,
   time_shard_generate: 1
  },
  classResource: { type: "time_shards", cost: -1 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Echoes Multiplicis",
  somaticText: "Wave hand laterally, trailing two shimmering silver coordinates out from the target."
  },
  resolution: "AUTOMATIC",
  effectTypes: ["buff"],
  buffConfig: {
  buffType: "statusEffect",
  effects: [
   {
   id : "echo_shielding",
   name: "Echo Shells",
   description: "Deals +2d6 arcane damage on next attack and redirect 50% of attacks.",
   mechanicsText: "Next attack deals +2d6 arcane; 50% chance to redirect incoming attacks.",
   statusEffect: {
    type: "damage_shield",
    shieldType: "reflect",
    reductionPercent: 50
   }
   }
  ],
  durationValue: 2,
  durationType: "rounds"
  },
  tags: ["displacement", "buff", "support", "chronarch"]
 },

 { id: "temporal_loop",
  name: "Temporal Flux: Loop",
  description: "Heavy Flux loop. Trap an enemy in a 2-round causality loop, forcing them to repeat their previous round's action exactly (DC 16 Spirit save negates).",
  level: 6,
  spellType: "ACTION",
  icon: "Arcane/Sands of Time",
  typeConfig: {
  school: "arcane",
  icon: "Arcane/Sands of Time",
  tags: ["flux", "control", "stasis"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 30,
  targetRestrictions: ["enemy"]
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards", "temporal_strain"],
  resourceValues: {
   mana: 15,
   time_shard_cost: 5,
   temporal_strain_gain: 3
  },
  classResource: { type: "time_shards", cost: 5 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Tempus Repetere",
  somaticText: "Form a loop with inagility and thumb, pinning the target's timeline coordinate with a gray focus."
  },
  resolution: "SAVE",
  effectTypes: ["debuff"],
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   {
   id : "causality_loop_stun",
   name: "Causality Repeat",
   description: "Trapped in a causality loop, forced to repeat last turn's actions exactly.",
   mechanicsText: "Force target to repeat last turn's actions exactly.",
   statusEffect: {
    type: "staged",
    description: "Must repeat exact action"
   }
   }
  ],
  durationValue: 2,
  durationType: "rounds",
  savingThrow: {
   ability: "spirit",
   difficultyClass: 16,
   saveOutcome: "negates"
  }
  },
   permanentCost: {
   type: "max_hp",
   amount: 2,
   duration: "long_rest",
   description: "Temporal Strain builds as causality bits back."
   },
   triggerConfig: {
   triggers: [
    {
    id : "temporal_loop_recoil",
    name: "Chronal Recoil",
    triggerType: "on_cast",
    action: "Temporal Strain accumulates."
    }
   ]
   },
   tags: ["flux", "control", "stasis", "chronarch"]
  },

  // ========================================
  // LEVEL 7 SPELLS - Flux: Disruption, Reversal, Flux: Echo Chamber
 // ========================================
 { id: "chronal_disruption",
  name: "Chronal Disruption",
  description: "Heavy Flux shockwave. Deal 6d6 + INT storm damage in a 30ft cone and freeze enemies in stasis for 1 round (DC 16 Agility save).",
  level: 7,
  spellType: "ACTION",
  icon: "Force/Force Wave",
  typeConfig: {
  school: "storm",
  icon: "Force/Force Wave",
  tags: ["flux", "damage", "aoe", "stasis"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 30,
  aoeShape: "cone",
  aoeParameters: { angle: 90, length: 30 },
  targetRestrictions: ["enemy"]
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards", "temporal_strain"],
  resourceValues: {
   mana: 22,
   time_shard_cost: 6,
   temporal_strain_gain: 4
  },
  classResource: { type: "time_shards", cost: 6 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Fluxus Disrumpere",
  somaticText: "Throw both arms out, venting localized chronal shocks forward as a grey heat wave."
  },
  resolution: "DICE",
  effectTypes: ["damage", "debuff"],
  damageConfig: {
  formula: "6d6 + intelligence",
  elementType: "storm",
  damageTypes: ["storm"],
  canCrit: true,
  critMultiplier: 2,
  savingThrow: {
   ability: "agility",
   difficultyClass: 16,
   saveOutcome: "half_damage"
  },
  resolution: "DICE"
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   {
   id : "disruption_stasis",
   name: "Chronal Stasis",
   description: "Frozen in time. Stunned for 1 round.",
   mechanicsText: "Freeze targets in stasis for 1 round.",
   statusType: "stunned"
   }
  ],
  durationValue: 1,
  durationType: "rounds",
  savingThrow: {
   ability: "agility",
   difficultyClass: 16,
   saveOutcome: "negates"
  }
  },
   permanentCost: {
   type: "max_hp",
   amount: 2,
   duration: "long_rest",
   description: "Temporal Strain builds as cellular matrix undergoes high strain."
   },
   triggerConfig: {
   triggers: [
    {
    id : "chronal_disruption_recoil",
    name: "Chronal Recoil",
    triggerType: "on_cast",
    action: "Temporal Strain accumulates."
    }
   ]
   },
   tags: ["flux", "damage", "aoe", "stasis", "chronarch"]
  },

  { id: "chronal_reversal",
  name: "Chronal Reversal",
  description: "Rewind the temporal stream for a creature, fully healing all damage taken last round (10d6 + Spirit). Caster takes 3d6 blight recoil.",
  level: 7,
  spellType: "ACTION",
  icon: "Arcane/Rewind Time",
  typeConfig: {
  school: "arcane",
  icon: "Arcane/Rewind Time",
  tags: ["rewinding", "heal", "cleanse"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 30,
  targetRestrictions: ["ally"]
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards"],
  resourceValues: {
   mana: 24,
   time_shard_generate: 2
  },
  classResource: { type: "time_shards", cost: -2 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Reverto Totus",
  somaticText: "Grasp target with both hands, absorbing their kinetic injuries into your own nervous system as localized recoil."
  },
  resolution: "DICE",
  effectTypes: ["healing"],
  healingConfig: {
  formula: "10d6 + spirit",
  resolution: "DICE",
  healingType: "direct"
  },
  triggerConfig: {
  triggers: [
   {
   id : "chronal_reversal_recoil",
   name: "Chronal Recoil",
   triggerType: "on_cast",
   action: "Caster takes 3d6 blight recoil damage."
   }
  ]
  },
  tags: ["rewinding", "heal", "cleanse", "chronarch"]
 },

 { id: "temporal_echo_chamber",
  name: "Temporal Echo Chamber",
  description: "Heavy Flux. Encase a 20ft area: spells/attacks cast within are mirrored 1 round later. Temporal Strain accumulates.",
  level: 7,
  spellType: "ACTION",
  icon: "Force/Force Field",
  typeConfig: {
  school: "storm",
  icon: "Force/Force Field",
  tags: ["flux", "control", "aoe", "displacement"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 40,
  aoeShape: "circle",
  aoeParameters: { radius: 20 },
  targetRestrictions: []
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards", "temporal_strain"],
  resourceValues: {
   mana: 24,
   time_shard_cost: 6,
   temporal_strain_gain: 5
  },
  classResource: { type: "time_shards", cost: 6 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Echo Temporis",
  somaticText: "Spin fingers rapidly, weaving a thick grey temporal mesh box over the area."
  },
  resolution: "AUTOMATIC",
  effectTypes: ["utility"],
  utilityConfig: {
  utilityType: "trap",
  selectedEffects: [
   {
   id : "echo_reverberation",
   name: "Chronal Echoes",
   description: "Spells and attacks repeat automatically in 1 round."
   }
  ]
  },
   permanentCost: {
   type: "max_hp",
   amount: 2,
   duration: "long_rest",
   description: "Temporal Strain builds as your timelines loop."
   },
   triggerConfig: {
   triggers: [
    {
    id : "temporal_echo_chamber_recoil",
    name: "Chronal Recoil",
    triggerType: "on_cast",
    action: "Temporal Strain accumulates."
    }
   ]
   },
   tags: ["flux", "control", "aoe", "displacement", "chronarch"]
  },

  // ========================================
  // LEVEL 8 SPELLS - Flux: Dominion, Flux: Resurrection, Flux: Fate
 // ========================================
 { id: "temporal_flux_dominion",
  name: "Temporal Flux: Dominion",
  description: "Supreme Flux. Seize complete control of an enemy's timeline, forcing them to take their turn under your control (DC 17 Spirit save).",
  level: 8,
  spellType: "ACTION",
  icon: "Arcane/Orb Manipulation",
  typeConfig: {
  school: "arcane",
  icon: "Arcane/Orb Manipulation",
  tags: ["flux", "control", "charm"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 30,
  targetRestrictions: ["enemy"]
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards", "temporal_strain"],
  resourceValues: {
   mana: 24,
   time_shard_cost: 8,
   temporal_strain_gain: 6
  },
  classResource: { type: "time_shards", cost: 8 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Fluxus Imperium",
  somaticText: "Lock gaze, twitching fingers as if they were strings on a chronal puppet."
  },
  resolution: "SAVE",
  effectTypes: ["debuff"],
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   {
   id : "dominion_control",
   name: "Temporal Puppet",
   description: "Controlled by the Chronarch on their turn.",
   mechanicsText: "Gain absolute control of target's next turn.",
   statusEffect: {
    type: "charmed",
    charmLevel: "dominated"
   }
   }
  ],
  durationValue: 1,
  durationType: "rounds",
  savingThrow: {
   ability: "spirit",
   difficultyClass: 17,
   saveOutcome: "negates"
  }
  },
   permanentCost: {
   type: "max_hp",
   amount: 3,
   duration: "long_rest",
   description: "Temporal Strain builds as you override another soul's timeline."
   },
   triggerConfig: {
   triggers: [
    {
    id : "temporal_flux_dominion_recoil",
    name: "Chronal Recoil",
    triggerType: "on_cast",
    action: "Temporal Strain accumulates."
    }
   ]
   },
   tags: ["flux", "control", "charm", "chronarch"]
  },

  { id: "temporal_flux_resurrection",
  name: "Temporal Flux: Resurrection",
  description: "Extreme Flux. Wrench a deceased ally's timeline back, reviving them at 50% HP. Caster takes 4d6 blight.",
  level: 8,
  spellType: "ACTION",
  icon: "Arcane/Open Portal",
  typeConfig: {
  school: "arcane",
  icon: "Arcane/Open Portal",
  tags: ["flux", "heal", "revive", "rewinding"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 15,
  targetRestrictions: ["ally"]
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards", "temporal_strain"],
  resourceValues: {
   mana: 28,
   time_shard_cost: 8,
   temporal_strain_gain: 5
  },
  classResource: { type: "time_shards", cost: 8 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Fluxus Resurgere",
  somaticText: "Touch the fallen ally's heart, transferring their smashing damage vectors into yourself as somatic strain."
  },
  resolution: "DICE",
  effectTypes: ["healing"],
  healingConfig: {
  formula: "50% max_hp",
  resolution: "AUTOMATIC",
  healingType: "direct"
  },
  triggerConfig: {
  triggers: [
   {
   id : "temporal_flux_resurrection_recoil",
   name: "Chronal Recoil",
   triggerType: "on_cast",
   action: "Caster takes 4d6 blight recoil damage."
   }
  ]
  },
  permanentCost: {
  type: "max_hp",
  amount: 3,
  duration: "long_rest",
  description: "Temporal Strain builds as you drag a soul out of timeline decay."
  },
  tags: ["flux", "heal", "revive", "rewinding", "chronarch"]
 },

 { id: "fate_manipulation",
  name: "Temporal Flux: Fate Manipulation",
  description: "Heavy Flux. Rewrite the probability matrix: force a creature to reroll with disadvantage or grant an ally advantage. Temporal Strain accumulates.",
  level: 8,
  spellType: "ACTION",
  icon: "Arcane/Zen",
  typeConfig: {
  school: "arcane",
  icon: "Arcane/Zen",
  tags: ["flux", "luck", "support", "rewinding"],
  castTime: 1,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 60,
  targetRestrictions: []
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards", "temporal_strain"],
  resourceValues: {
   mana: 20,
   time_shard_cost: 6,
   temporal_strain_gain: 4
  },
  classResource: { type: "time_shards", cost: 6 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Fluxus Fati",
  somaticText: "Close eyes, snapping fingers to snap the thread of an unwanted outcome."
  },
  resolution: "AUTOMATIC",
  effectTypes: ["buff"],
  buffConfig: {
  buffType: "statusEffect",
  effects: [
   {
   id : "fate_reroll",
   name: "Probability Bend",
   description: "Force reroll or grant advantage.",
   mechanicsText: "Force target reroll or grant advantage.",
   statusEffect: {
    type: "luck",
    luckType: "reroll"
   }
   }
  ],
  durationValue: 1,
  durationType: "rounds"
  },
   permanentCost: {
   type: "max_hp",
   amount: 2,
   duration: "long_rest",
   description: "Temporal Strain builds as probability cracks your focus."
   },
   triggerConfig: {
   triggers: [
    {
    id : "fate_manipulation_recoil",
    name: "Chronal Recoil",
    triggerType: "on_cast",
    action: "Temporal Strain accumulates."
    }
   ]
   },
   tags: ["flux", "luck", "support", "rewinding", "chronarch"]
  },

  // ========================================
  // LEVEL 9 SPELLS - Flux: Shockwave, Flux: Fracture, Flux: Paradox
 // ========================================
 { id: "temporal_shockwave",
  name: "Temporal Shockwave",
  description: "Cataclysmic Flux. Deal 8d10 + INT storm damage in a 30ft radius and freeze survivors in stasis for 2 rounds (DC 18 Agility save).",
  level: 9,
  spellType: "ACTION",
  icon: "Force/Force Wave",
  typeConfig: {
  school: "storm",
  icon: "Force/Force Wave",
  tags: ["flux", "damage", "aoe", "stasis"],
  castTime: 2,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "self_centered",
  aoeShape: "circle",
  aoeParameters: { radius: 30 },
  targetRestrictions: ["enemy"]
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards", "temporal_strain"],
  resourceValues: {
   mana: 28,
   time_shard_cost: 8,
   temporal_strain_gain: 6
  },
  classResource: { type: "time_shards", cost: 8 },
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Fluxus Terram",
  somaticText: "Raise both arms high, slamming focus into the ground to rupture local timeline coordinates."
  },
  resolution: "DICE",
  effectTypes: ["damage", "debuff"],
  damageConfig: {
  formula: "8d10 + intelligence",
  elementType: "storm",
  damageTypes: ["storm"],
  canCrit: true,
  critMultiplier: 2,
  savingThrow: {
   ability: "agility",
   difficultyClass: 18,
   saveOutcome: "half_damage"
  },
  resolution: "DICE"
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   {
   id : "shockwave_freeze",
   name: "Absolute Freeze",
   description: "Frozen in time. Stunned for 2 rounds.",
   mechanicsText: "Freeze targets in stasis for 2 rounds.",
   statusType: "stunned"
   }
  ],
  durationValue: 2,
  durationType: "rounds",
  savingThrow: {
   ability: "agility",
   difficultyClass: 18,
   saveOutcome: "reduced_duration"
  }
  },
   permanentCost: {
   type: "max_hp",
   amount: 5,
   duration: "long_rest",
   description: "Temporal Strain builds as cellular structures age terminally."
   },
   triggerConfig: {
   triggers: [
    {
    id : "temporal_shockwave_recoil",
    name: "Chronal Recoil",
    triggerType: "on_cast",
    action: "Temporal Strain accumulates."
    }
   ]
   },
   tags: ["flux", "damage", "aoe", "stasis", "chronarch"]
  },

  { id: "reality_fracture",
  name: "Reality Fracture",
  description: "Cataclysmic Flux. Rip open a tear in space dealing 6d12 storm damage in a 20ft radius. Somatic drag deals 1d6 necrotic to caster.",
  level: 9,
  spellType: "ACTION",
  icon: "Arcane/Spiral Vortex",
  typeConfig: {
  school: "storm",
  icon: "Arcane/Spiral Vortex",
  tags: ["flux", "damage", "aoe", "blight"],
  castTime: 2,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 40,
  aoeShape: "circle",
  aoeParameters: { radius: 20 },
  targetRestrictions: ["enemy"]
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards", "temporal_strain"],
  resourceValues: {
   mana: 25,
   time_shard_cost: 7,
   temporal_strain_gain: 5
  },
  classResource: { type: "time_shards", cost: 7 },
  healthCost: "1d6 necrotic",
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Spatium Rumpitur",
  somaticText: "Forcefully part your hands against heavy chronal drag, tearing a localized seam in space."
  },
  resolution: "DICE",
  effectTypes: ["damage"],
  damageConfig: {
  formula: "6d12",
  elementType: "storm",
  damageTypes: ["storm"],
  canCrit: true,
  critMultiplier: 2,
  resolution: "DICE"
  },
   permanentCost: {
   type: "max_hp",
   amount: 3,
   duration: "long_rest",
   description: "Temporal Strain builds as the temporal strain impacts your cells."
   },
   triggerConfig: {
   triggers: [
    {
    id : "reality_fracture_recoil",
    name: "Chronal Recoil",
    triggerType: "on_cast",
    action: "Temporal Strain accumulates."
    }
   ]
   },
   tags: ["flux", "damage", "aoe", "blight", "chronarch"]
  },

  { id: "chronal_paradox",
  name: "Chronal Paradox",
  description: "Cataclysmic Flux. Split enemy timeline: Spirit save each round or take 8d6 arcane and stunned; success halves damage and slows.",
  level: 9,
  spellType: "ACTION",
  icon: "Arcane/Sands of Time",
  typeConfig: {
  school: "arcane",
  icon: "Arcane/Sands of Time",
  tags: ["flux", "damage", "control", "stasis"],
  castTime: 2,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 30,
  targetRestrictions: ["enemy"]
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards", "temporal_strain"],
  resourceValues: {
   mana: 24,
   time_shard_cost: 7,
   temporal_strain_gain: 5
  },
  classResource: { type: "time_shards", cost: 7 },
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Duplex Veritas",
  somaticText: "Touch target's head, splitting their chronal alignment into contradictory threads."
  },
  resolution: "SAVE",
  effectTypes: ["damage", "debuff"],
  damageConfig: {
  formula: "8d6",
  elementType: "arcane",
  damageTypes: ["arcane"],
  canCrit: true,
  critMultiplier: 2,
  savingThrow: {
   ability: "spirit",
   difficultyClass: 18,
   saveOutcome: "half_damage"
  },
  resolution: "DICE"
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   {
   id : "paradox_mind_stun",
   name: "Paradox Stutter",
   description: "Stunned due to reality fracture.",
   mechanicsText: "Stun target on failed save.",
   statusType: "stunned"
   }
  ],
  durationValue: 1,
  durationType: "rounds",
  savingThrow: {
   ability: "spirit",
   difficultyClass: 18,
   saveOutcome: "negates"
  }
  },
   permanentCost: {
   type: "max_hp",
   amount: 3,
   duration: "long_rest",
   description: "Temporal Strain builds as timeline loop splits your cells."
   },
   triggerConfig: {
   triggers: [
    {
    id : "chronal_paradox_recoil",
    name: "Chronal Recoil",
    triggerType: "on_cast",
    action: "Temporal Strain accumulates."
    }
   ]
   },
   tags: ["flux", "damage", "control", "stasis", "chronarch"]
  },

  // ========================================
  // LEVEL 10 SPELLS - Mastery, Flux: Restoration, Flux: Vortex
 // ========================================
 { id: "temporal_mastery",
  name: "Temporal Mastery",
  description: "Ultimate passive. Grant +1 base Action Point at start of combat, and your basic spells generate 2 Time Shards instead of 1.",
  level: 10,
  spellType: "PASSIVE",
  icon: "Arcane/Zen",
  effectTypes: ["passive"],
  typeConfig: {
  school: "arcane",
  icon: "Arcane/Zen",
  tags: ["passive", "ap", "shards"],
  castTime: 0,
  castTimeType: "PASSIVE"
  },
  targetingConfig: {
  targetingType: "self",
  rangeType: "self"
  },
  resourceCost: {
  actionPoints: 0
  },
  resolution: "AUTOMATIC",
  tags: ["passive", "ap", "shards", "chronarch"]
 },

 { id: "chronal_restoration",
  name: "Chronal Restoration",
  description: "Absolute Flux. Fully restore all allies within 30ft to their start-of-combat HP/AP/status. Caster takes 5d6 blight.",
  level: 10,
  spellType: "ACTION",
  icon: "Arcane/Rewind Time",
  typeConfig: {
  school: "arcane",
  icon: "Arcane/Rewind Time",
  tags: ["flux", "heal", "cleanse", "rewinding"],
  castTime: 2,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "self_centered",
  aoeShape: "circle",
  aoeParameters: { radius: 30 },
  targetRestrictions: ["ally"]
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards", "temporal_strain"],
  resourceValues: {
   mana: 30,
   time_shard_cost: 10,
   temporal_strain_gain: 7
  },
  classResource: { type: "time_shards", cost: 10 },
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Restitutio Chronos",
  somaticText: "Force your focus to its resonance limit, channeling intense chronal feedback through your hands."
  },
  resolution: "DICE",
  effectTypes: ["healing"],
  healingConfig: {
  formula: "100% max_hp",
  resolution: "AUTOMATIC",
  healingType: "direct"
  },
  triggerConfig: {
  triggers: [
   {
   id : "chronal_restoration_recoil",
   name: "Chronal Recoil",
   triggerType: "on_cast",
   action: "Caster takes 5d6 blight recoil damage."
   }
  ]
  },
  permanentCost: {
  type: "max_hp",
  amount: 10,
  duration: "long_rest",
  description: "Severe Temporal Strain builds as the universe extracts a violent cellular tax."
  },
  tags: ["flux", "heal", "cleanse", "rewinding", "chronarch"]
 },

 { id: "chronal_vortex",
  name: "Chronal Vortex",
  description: "Absolute Flux. Deal 10d10 + INT storm damage in a 50ft radius, drag all caught to the center, and freeze them in stasis for 2 rounds.",
  level: 10,
  spellType: "ACTION",
  icon: "Force/Force Wave",
  typeConfig: {
  school: "storm",
  icon: "Force/Force Wave",
  tags: ["flux", "damage", "control", "aoe", "stasis"],
  castTime: 2,
  castTimeType: "IMMEDIATE"
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "self_centered",
  aoeShape: "circle",
  aoeParameters: { radius: 50 },
  targetRestrictions: ["enemy"]
  },
  resourceCost: {
  resourceTypes: ["mana", "time_shards", "temporal_strain"],
  resourceValues: {
   mana: 35,
   time_shard_cost: 10,
   temporal_strain_gain: 8
  },
  classResource: { type: "time_shards", cost: 10 },
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Singularitas Chronos",
  somaticText: "Throw focus up, pulling your hands down as it implodes into a silver spatial rift."
  },
  resolution: "DICE",
  effectTypes: ["damage", "debuff"],
  damageConfig: {
  formula: "10d10 + intelligence",
  elementType: "storm",
  damageTypes: ["storm"],
  canCrit: true,
  critMultiplier: 2,
  resolution: "DICE"
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   {
   id : "vortex_absolute_stasis",
   name: "Singularity Lock",
   description: "Frozen in stasis. Stunned for 2 rounds.",
   mechanicsText: "Lock targets in absolute stasis for 2 rounds.",
   statusType: "stunned"
   }
  ],
  durationValue: 2,
  durationType: "rounds"
  },
   permanentCost: {
   type: "max_hp",
   amount: 5,
   duration: "long_rest",
   description: "Temporal Strain builds as your molecular layout unravels."
   },
   triggerConfig: {
   triggers: [
    {
    id : "chronal_vortex_recoil",
    name: "Chronal Recoil",
    triggerType: "on_cast",
    action: "Temporal Strain accumulates."
    }
   ]
   },
   tags: ["flux", "damage", "control", "aoe", "stasis", "chronarch"]
  },

   {
   "id": "chrono_temporal_rewind",
  "name": "Temporal Rewind",
  "description": "Focus your temporal anchor to reverse the immediate past for a tiny, unattended object. A spilled goblet of wine flows back upward to fill its cup, a shattered porcelain vase fuses back into pristine form, or a burned letter stitches itself back into unread ink.",
  "level": 1,
  "spellType": "ACTION",
  "icon": "Arcane/Time Warp",
  "typeConfig": {
   "school": "arcane",
   "icon": "Arcane/Time Warp",
   "tags": [
   "utility",
   "roleplay",
   "chronarch"
   ],
   "castTime": 1,
   "castTimeType": "IMMEDIATE"
  },
  "targetingConfig": {
   "targetingType": "single",
   "rangeType": "touch",
   "targetRestrictions": []
  },
  "resourceCost": {
   "actionPoints": 1,
   "resourceTypes": [
   "mana"
   ],
   "resourceValues": {
   "mana": 4
   },
   "components": [
   "verbal",
   "somatic"
   ],
   "verbalText": "Reductio ad originem!",
   "somaticText": "Slightly twist your wrist backward, tracing a reverse-spiral in the air"
  },
  "resolution": "NONE",
  "effectTypes": [
   "utility"
  ],
  "utilityConfig": {
   "utilityType": "restoration",
   "selectedEffects": [
   {
    "id": "temporal_rewind_effect",
    "name": "Object Restored",
    "description": "Rewinds the physical state of a tiny object (up to 5 lbs) by up to 6 seconds, completely repairing any recent damage, spills, or breaks."
   }
   ],
   "duration": 0,
   "durationUnit": "rounds",
   "concentration": false,
   "power": "minor"
  },
  "cooldownConfig": {
   "cooldownType": "turn_based",
   "cooldownValue": 0
  },
  "tags": [
   "utility",
   "roleplay",
   "chronarch"
   ]
  },
  // ===== NON-COMBAT / TEMPORAL UTILITY (the time-mage out of combat) =====
  { id: "temporal_deja_vu",
   name: "Deja Vu",
   description: "Touch a surface and relive the last minute that played out in this spot as a ghostly accelerated echo  —  words spoken, who stood where, blows struck, which way they left. You see it; you cannot change it. Older echoes are fainter. Out of combat.",
   level: 1,
   spellType: "ACTION",
   icon: "Arcane/Sands of Time",
   effectTypes: ["utility"],
   typeConfig: { school: "arcane", icon: "Arcane/Sands of Time", tags: ["utility","divination","investigation","chronarch"], castTime: 1, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 0 },
   resourceCost: { components: ["verbal","somatic"], actionPoints: 1, mana: 5, classResource: { type: "time_shards", cost: -1 } },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
   utilityConfig: { utilityType: "divination", selectedEffects: [ { id : "deja_vu_echo", name: "One-Minute Echo", description: "Relive the last 60 seconds at the touched location as a sped-up silent vision: speech, positions, violence, departures. Detail fades for events older than a minute per level. You observe only.", mechanicsText: "Replay last 60s at a location; observe only." } ], power: "minor" },
   resolution: "NONE",
   tags: ["utility","divination","investigation","chronarch"],

   somaticText: "Press palm flat to the surface and let the moment unspool backward.",
   verbalText: "Tempus Revoco  —  the recent past answers.",
  },
  { id: "temporal_compression",
   name: "Temporal Compression",
   description: "Wrap a small object or process in a bubble of accelerated time. Brew a potion in seconds, cure leather, dry soaked gear, age wine, grow a seedling, rust a mundane lock, or spoil food. Living creatures and magical items resist. Out of combat.",
   level: 2,
   spellType: "ACTION",
   icon: "Arcane/Sands of Time",
   effectTypes: ["utility"],
   typeConfig: { school: "arcane", icon: "Arcane/Sands of Time", tags: ["utility","exploration","chronarch"], castTime: 1, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 0 },
   resourceCost: { components: ["verbal","somatic"], actionPoints: 1, mana: 7, classResource: { type: "time_shards", cost: 1 } },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
   utilityConfig: { utilityType: "conjuration", selectedEffects: [ { id : "compression_hasten", name: "Hasten Process", description: "Accelerate up to ~1 hour of a mundane process into a single round: brewing, curing, drying, rusting a lock, spoiling food, sprouting a seed. No effect on living creatures or magical items. Costs 1 Temporal Strain.", mechanicsText: "Compress ~1 hour of a mundane process into 1 round." } ], power: "moderate" },
   resolution: "AUTOMATIC",
   tags: ["utility","exploration","chronarch"],

   somaticText: "Cage the object between your palms and let its hours pour out in seconds.",
   verbalText: "Tempus Accelero.",
  },
  { id: "temporal_slow_descent",
   name: "Slow Descent",
   description: "Bend local time around a fall. You, a willing ally, or an object fall at a crawl  —  drifting safely to the ground, and you can slow a falling ally or object within range to catch or save them. No damage on landing. Out of combat or combat.",
   level: 1,
   spellType: "REACTION",
   icon: "Arcane/Quick Step",
   effectTypes: ["utility"],
   typeConfig: { school: "arcane", icon: "Arcane/Quick Step", tags: ["utility","mobility","chronarch"], castTime: 1, castTimeType: "REACTION" },
   targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 60 },
   resourceCost: { components: ["verbal"], actionPoints: 0, mana: 4, classResource: { type: "time_shards", cost: -1 } },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
   utilityConfig: { utilityType: "mobility", selectedEffects: [ { id : "slow_descent_feather", name: "Feathered Time", description: "Slow a falling creature or object to a safe drift; no falling damage on landing. Works as a reaction the instant a fall begins.", mechanicsText: "Negate falling damage for one target." } ], power: "minor" },
   resolution: "AUTOMATIC",
   tags: ["utility","mobility","chronarch"],

   somaticText: "Snap your fingers downward; the air beneath the target thickens with slow seconds.",
   verbalText: "Tempus Lentus.",
  },
  { id: "temporal_foreknowledge",
   name: "Foreknowledge",
   description: "You have already lived the next few seconds of this exchange. Glimpse what a creature within sight is about to say or do, and whether they intend harm in the next minute. Grants advantage on your next social check against them and warns of an imminent attack. Out of combat.",
   level: 2,
   spellType: "ACTION",
   icon: "Arcane/Sands of Time",
   effectTypes: ["utility","buff"],
   typeConfig: { school: "arcane", icon: "Arcane/Sands of Time", tags: ["utility","divination","social","chronarch"], castTime: 1, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "single", rangeType: "sight", rangeDistance: 60 },
   resourceCost: { components: ["verbal","somatic"], actionPoints: 1, mana: 6, classResource: { type: "time_shards", cost: 1 } },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
   utilityConfig: { utilityType: "social", selectedEffects: [ { id : "foreknowledge_read", name: "Already-Lived", description: "For 1 minute you know what one creature is about to say/do next, sense if they intend harm, and gain advantage on social checks against them. Shows the immediate next action only, not long intent.", mechanicsText: "Preview one creature's next action + intent; advantage socially." } ], duration: 1, durationUnit: "minutes", power: "moderate" },
   resolution: "NONE",
   tags: ["utility","divination","social","chronarch"],

   somaticText: "Tilt your head a half-second ahead of their words; you answer before they finish.",
   verbalText: "Tempus Prospicio.",
  },
  { id: "temporal_rewind_blunder",
   name: "Rewind Blunder",
   description: "Unsay it. Undo it. Rewind the last six seconds of your own action and try again  —  re-roll a single failed out-of-combat ability check, or take back a social blunder, a botched pickpocket, or a broken object. The timeline bruises for it: you take 1 Temporal Strain and forget which version was real. Out of combat.",
   level: 3,
   spellType: "REACTION",
   icon: "Arcane/Spiral Vortex",
   effectTypes: ["utility"],
   typeConfig: { school: "arcane", icon: "Arcane/Spiral Vortex", tags: ["utility","rewinding","social","chronarch"], castTime: 1, castTimeType: "REACTION" },
   targetingConfig: { targetingType: "self", rangeType: "self" },
   resourceCost: { components: ["verbal","somatic"], actionPoints: 0, mana: 8, classResource: { type: "time_shards", cost: 2 } },
   cooldownConfig: { cooldownType: "short_rest", cooldownValue: 1 },
   utilityConfig: { utilityType: "special", selectedEffects: [ { id : "rewind_blunder_reroll", name: "Six-Second Take-Back", description: "Immediately re-roll one failed out-of-combat ability check, or undo one social blunder / botched action / broken mundane object from the last 6 seconds. Costs 1 Temporal Strain and you lose the memory of the undone attempt.", mechanicsText: "Re-roll one failed out-of-combat check or undo a 6s blunder; +1 Strain." } ], power: "moderate" },
   resolution: "AUTOMATIC",
   tags: ["utility","rewinding","social","chronarch"],

   somaticText: "Snap your fingers backward; the broken thing un-breaks, the said word unsays.",
   verbalText: "Tempus Redo  —  but you will not recall the first attempt.",
  },
 ],


 // Spell Pools
 spellPools: {
 1: ["chrono_bolt", "temporal_mend", "temporal_step",
  "chrono_temporal_rewind", "temporal_deja_vu", "temporal_slow_descent"],
 2: ["stasis_field", "temporal_rewind", "chrono_echo",
  "temporal_compression", "temporal_foreknowledge"],
 3: ["temporal_dilation", "time_crystal", "temporal_foresight",
  "temporal_rewind_blunder"],
 4: ["temporal_vortex", "temporal_flux_rewind", "temporal_paradox"],
 5: [
  "temporal_anchor",
  "temporal_thorns",
  "temporal_flux_shield",
  "temporal_flux_speed"
 ],
 6: ["temporal_fracture", "temporal_echoes", "temporal_loop"],
 7: ["chronal_disruption", "chronal_reversal", "temporal_echo_chamber"],
 8: [
  "temporal_flux_dominion",
  "temporal_flux_resurrection",
  "fate_manipulation"
 ],
 9: ["temporal_shockwave", "reality_fracture", "chronal_paradox"],
 10: ["temporal_mastery", "chronal_restoration", "chronal_vortex"]
 }
};

export default CHRONARCH_DATA;
