import { UTILITY_SPELLS } from '../spells/utilitySpells';
/**
 * Augur Class Data
 *
 * Complete surgical overhaul for the Augur - the Visceral Haruspex who reads
 * the immediate, blood-soaked future in fresh gore, spilt blood, and splintered marrow.
 *
 * Fueling Benediction and Malediction through d20 Even/Odd outcomes and blood sacrifice,
 * this class dominates immediate preemptive action economy and round-by-round survival.
 */

export const AUGUR_DATA = {
 restrictions: {
  "allowedSubraces": [
   "skald_human",
   "vashir_astril",
   "silath_astril",
   "tessen_human",
   "marked_vreken",
   "korr_solari"
  ],
  "hardBlocks": [
   "merryn_human",
   "ordan_human",
   "morren_human",
   "myrathil"
  ],
  "narrativeUnlock": true,
  "justification": "Requires proximity to preserved dead (glacier-tombs) and access to Frozen Archive's runic mathematics. Cultures without burial-preservation traditions (Ordan leave dead to steppe, Merryn bury at sea) can't maintain the ancestral connection."
 },

 /**
 * Subrace Variants, every Augur reads the future in something dead or dying, but
 * what counts as "entrails" depends entirely on what your people preserve. The
 * star-arithmetic is failing for all of them, but each tradition fails differently.
 */
 
  // EQUIPMENT (added 2026-07-28 audit fix)
  // TODO: design team to add startingEquipment and proficiencies.
  // TODO: review weapon/armor lists for class accuracy per lore compendium.
  equipment: {
   weapons: ['dagger', 'knife', 'sickle'],
   armor: ['light_armor', 'robes'],
   offHand: ['empty', 'tome']
  },
subraceVariants: {
 skald_human: {
  subraceName: 'Skald',
  title: 'The Glacier-Haruspex',
  reframe: `This is Cassia's original tradition. The <LoreLink termId="skald">Skald</LoreLink> read the future in the entrails of sacrificed glacier-elk at the <LoreLink termId="frozen_archive">Frozen Archive</LoreLink>, where the preserved dead stand upright in the ice as witnesses. The glacier-cold slows the cooling of the gore, extending the reading window, a Skald Augur working in a warm room has seconds; working against glacier-ice, they have minutes.`,
  signatureAbility: {
  name: 'Glacier-Reading',
  description: `A reader of the immediate future. Not prophecy. Not cosmic destiny. The trajectory of a blade. The moment a guard will drop. The exact second a killing blow will land. The augur reads these things in fresh violence — blood, entrails, splintered bone — and pays for every vision with sanity or stamina.`,

  },
  currentCrisisAngle: `The accuracy collapse (93% to 41%) began at the Frozen Archive itself, the Skald's seat. The elder Haruspexes insist the elk are still true and that something is interfering with the ice, not the entrails. The younger Skald suspect the elders cannot accept that their founding method is obsolete.`,
  signatureQuote: {
  text: '"The elk has not lied to me in eight hundred years. I will not call her a liar now because the answer frightens me."',
  speaker: 'Cassia',
  context: 'The founder, defending her method against the first contradictory readings'
  }
 },

 vashir_astril: {
  subraceName: 'Earthen Astril - Astril',
  title: 'The Star-Viscera Reader',
   reframe: `The <LoreLink termId="astril">Earthen Astril</LoreLink> read the future not in animal gore but in the resonant fractures of their own crystalline skin. The Lumia heritage's memory echoes *forward* through the crystal lattice, a Earthen Astril Augur's body is the entrail, and the prophecy is the crack that has not yet formed.`,
  signatureAbility: {
  name: 'Lattice-Fracture',
  description: `Visions manifest as stress-fractures in the host's crystalline skin, each fracture a glimpse of a future that has not yet occurred. The deeper the symbiosis, the clearer the crack, but the crack is real, and the skin does not always heal.`
  },
   currentCrisisAngle: `The Earthen Astril's accuracy has not collapsed so much as *inverted*, they now see futures that are vividly clear and entirely wrong. Some Earthen Astril Augurs believe their Lumia heritage is no longer reading the real future but a future the dead world *wants* to be true, the fading memory choosing comfortable lies over the Deepening's truth.`,
  signatureQuote: {
  text: '"My skin broke in the shape of your death three days ago. You are still here. I do not know which of us to believe."',
  speaker: 'Aenith Glass-Skinned',
  context: 'A Earthen Astril Augur to a party member who, by her reading, should be dead'
  }
 },

 silath_astril: {
  subraceName: 'Stellar Astril - Astril',
  title: 'The Suppressed Oracle',
   reframe: `The <LoreLink termId="astril">Stellar Astril</LoreLink> bind and suppress their Lumia heritage, and an Augur among them weaponizes that captivity. The suppressed memory *knows* what is coming and screams it through the crystal the Stellar Astril have gagged. A Stellar Astril Augur's prophecy is the desperate, trapped foreknowledge of a prisoner pounding on the inside of its own cage.`,
  signatureAbility: {
  name: 'Gagged-Foresight',
   description: `Suppressed Lumia heritage leaks prophecy as involuntary flashes, vivid but fragmentary, the memory smuggling warnings past its own bindings. The Stellar Astril cannot control what they see, only endure it.`
  },
   currentCrisisAngle: `The accuracy collapse has, paradoxically, made the Stellar Astril's heritage *easier* to suppress, the future it screams about is now so garbled it barely registers. Some Stellar Astril Augurs are relieved. Others are terrified: a heritage that stops screaming may have stopped because it has nothing left worth warning about.`,
  signatureQuote: {
  text: '"I bound it to silence it. Now it whispers, and I cannot tell whether it is finally dying or finally right."',
  speaker: 'Orathin the Muzzled',
  context: 'A Stellar Astril Augur, the night the readings first contradicted themselves'
  }
 },

 tessen_human: {
  subraceName: 'Tessen',
  title: 'The Keep-Prophet',
   reframe: `Sealed inside their snow-buried keeps for four centuries, the <LoreLink termId="house_tesshan">Tessen</LoreLink> have no elk and no glacier. They read the future in the cracks of their own crumbling architecture, the dying keep *as* entrail, the settling stone a slow-motion sacrifice. A Tessen Augur's prophecy is the sound the wall made before it fell. During the Toll Wars (Years 280-340), a Skald augur named Eira Bone-Reader was part of a trade delegation crossing the Ancestor-Spans. A sudden blizzard trapped her party in a Tessen keep for an entire winter. She taught the keep's archivists the principles of haruspicy in exchange for shelter. The Tessen had no elk and no glacier  —  but they had something the Skald did not: a keep that was dying. The stress-fractures in the ancient stone became their entrails.`,
  signatureAbility: {
  name: 'Stone-Harrow',
  description: `Visions are read in the stress-fractures of load-bearing architecture, the Augur's own keep, or any large masonry structure under strain. The bigger the structure and the closer to collapse, the clearer and more catastrophic the reading.`
  },
  currentCrisisAngle: `The Tessen's crisis is the most literal: their keeps are failing, and the stones now prophesy only one future, the keep's own collapse. Every Tessen Augur reads the same vision: the roof, falling, within a generation. The Tessen elders have classified this as a "structural problem" rather than a prophecy, because they cannot afford to believe otherwise.`,
  signatureQuote: {
  text: '"The wall sang its own death this morning. I have written it down. I will not read it aloud, the keep is listening."',
  speaker: 'Warden-Castellan Tess-Otha',
  context: 'A Tessen Augur, filing a prophecy she dare not share with her garrison'
  }
 },

 clean_vreken: {
  subraceName: 'Clean Vreken',
  title: 'The Bog-Gore Diviner',
   reframe: `The <LoreLink termId="vreken">Clean Vreken</LoreLink> read the future in the preserved dead the bog itself coughs up, peat-mummified corpses whose final, frozen expressions encode their last vision. Where the Skald read fresh sacrifice, the Vreken read the ancient dead the <LoreLink termId="bryngloom-forest">Bryngloom</LoreLink> has been kind enough to return. The Clean Vreken did not learn from the Skald  —  they developed augury independently when the Bryngloom bog, disturbed by the Breach, began coughing up peat-mummified corpses that were centuries old. The Vreken already read their dead through spore-inhalation; reading the *future* through the dead's preserved flesh was a natural extension, discovered by a Clean Vreken crypt-keeper named Mother Ysen.`,
  signatureAbility: {
  name: 'Peat-Reading',
  description: `Visions are parsed from recovered bog-mummies, their posture, expression, and the orientation of their last grasp. The older the corpse, the further forward it sees, but the more degraded the image. A fresh corpse sees hours; a centuries-old mummy sees decades, in fragments.`
  },
  currentCrisisAngle: `The bog has stopped returning its dead. For eight centuries the peat gave up a body every few months; in the past year, nothing. The Clean Vreken read this as the single clearest prophecy of all: the bog itself has seen something so terrible it refuses to let its witnesses surface.`,
  signatureQuote: {
  text: '"The dead come up when they have something to say. The dead have stopped coming up. You tell me what that means."',
  speaker: 'Grave-Keeper Yssen',
  context: 'A Clean Vreken diviner, at the edge of an empty peat-cut'
  }
 },

 marked_vreken: {
  subraceName: 'Marked Vreken',
  title: 'The Mycelium-Haruspex',
  reframe: `The <LoreLink termId="vreken">Marked Vreken</LoreLink>, ghost-mycelium walkers, read the future in the bioluminescent bloom-patterns of the <LoreLink termId="root_veil">mycelial network</LoreLink> threading their skin. The forest's nervous system is a living entrail-spread, and the Marked are the only ones who can feel it think.`,
  signatureAbility: {
  name: 'Bloom-Casting',
  description: `Visions manifest as shifting bioluminescent patterns across the host's fungal network, readable in real time by the Augur and, unfortunately, by any other Marked Vreken in proximity. The prophecy is broadcast as much as it is received.`
  },
  currentCrisisAngle: `The Root-Veil's bloom-patterns have begun *looping*, repeating the same prophecy over and over, as if the network is stuck. Marked Vreken Augurs cannot tell whether the forest is trying to emphasize one future or has simply broken. The repetition is driving the youngest readers to rip the mycelium from their own skin.`,
  signatureQuote: {
  text: '"The forest has one dream now, and it dreams it louder every night. I have stopped sleeping. I am afraid that if I sleep, I will dream it too."',
  speaker: 'Vesh the Bloom-Walked',
  context: 'A Marked Vreken Augur, during the third week of the looping vision'
  }
 },

korr_solari: {
   subraceName: 'Hollow-Solari - Thyrm',
  title: 'The Sol\'s Breath-Reader',
   reframe: `The <LoreLink termId="solari">Hollow-Solari</LoreLink> do not cut flesh or spill entrails. They read the future in the flicker-patterns of the <LoreLink termId="sols_breath">Sol's Breath</LoreLink> itself \u2014 the dying star's pulse as omen. The Hollow-Solari maintain Sol's Breath in sacred, wordless vigil beneath <LoreLink termId="emberspire">Emberspire</LoreLink>. When the flame dims, danger approaches. When it pulses erratically, betrayal is near. When it gutters, death. The Hollow-Solari learned augury not from Skald or Vreken but from watching Sol's Breath for eight centuries. A Hollow-Solari forge-priest named Ignis the Watcher noticed that Sol's Breath's flicker-patterns changed before every major calamity  —  Emberspire eruptions, Wyrd incursions, the Breach itself. He spent forty years cataloging these patterns. Sol's Breath has been dimming for eight centuries. The Hollow-Solari Augurs have been watching it the entire time, and they have seen patterns in the dimming that no one else has ever been told about.`,
signatureAbility: {
  name: 'Flame-Reading',
  description: `Visions are read in the <LoreLink termId="sols_breath">Sol's Breath</LoreLink>'s flicker-patterns, the dying star's pulse serves as the Augur's entrails. The Hollow-Solari read dimming-rate, flare-frequency, and color-shift the way other Augurs read liver-mottling and intestine-convolution. The reading is continuous and passive, a vigil maintained across generations, meaning a Hollow-Solari Augur carries the accumulated observations of every watcher who preceded them.`
},
  currentCrisisAngle: `The accuracy collapse has not affected the Hollow-Solari the way it has affected the elk-readers: Sol's Breath has never been accurate in the short term, it reads in centuries, not minutes. But the long-term pattern has shifted. The dimming-rate the Hollow-Solari have tracked for eight centuries has, in the past decade, begun to accelerate. The elders who have maintained the vigil for eighty years say the flame is dimming now at a rate that predicts total darkness within two generations. They have not told the Dawn Vigil. They have not told the Solari. They have not told anyone.`,
  signatureQuote: {
  text: '"You read entrails and see the next battle. I read the flame and see the next century. The flame tells me there is not going to be one. You tell me which of us should be more afraid."',
  speaker: 'Vigil-Keeper Orm Ember-Eye',
  context: 'A Hollow-Solari Augur, responding to a Skald Haruspex who dismissed flame-reading as imprecise'
  }
 }
 },


 id : "augur",
 name: "Augur",
 icon: "fas fa-skull-crossbones",
  role: "Visceral Haruspex (Omen Reading, Blood Work & Preemptive Evasion)",
 damageTypes: ["wyrd", "ember"],

 livingOrder: {
 orderName: 'The Frozen Order of the Elk',
 founder: {
  name: '<LoreLink termId="cassia">Cassia</LoreLink>',
       status: `Alive, technically. Her body sits in the <LoreLink termId="frozen_archive">Frozen Archive</LoreLink>, preserved upright in the glacier-ice, eyes open. She forgot her own name forty years ago but still reads entrails through the glass. She does not move. She cannot move. The glacier-ice IS the entrail now  —  she reads the future in the stress-fractures forming in her own ice-prison. The Archive-Mistress interprets the crack-patterns for those who cannot read them. The glacier-ice does not preserve her through cold alone  —  it preserves her through the same mathematical resonance she used to read the Deepening. She is trapped in the moment of her greatest vision, the temporal feedback loop that burned her memories also freezing her flesh at the exact instant of perfect clarity. She cannot die because the moment she occupies has not yet finished happening.`,
  note: `The Skald star-watcher who read the Deepening in a sacrificed elk's entrails. The temporal-feedback burn took her past, her family, and eventually her identity, the price of seeing too clearly, paid in installments.`
 },
 currentLeader: {
  name: '<LoreLink termId="skadi-glass-eye">Archive-Mistress <LoreLink termId="skadi-glass-eye">Skadi Glass-Eye</LoreLink></LoreLink>',
  title: 'Keeper of the Elk-Rites',
   characterization: `<LoreLink termId="cassia">Cassia</LoreLink>'s descendant, separated from her ancestor by eight centuries and a title  —  'granddaughter'  —  that the Order uses regardless of actual generational distance, because anyone who learns augury from Cassia's ice-preserved body becomes her heir. Skadi maintains the elk-herds and the ritual calendar, and has presided over the accuracy collapse from 93% to 41% without flinching, at least not where the junior augurs can see.`
 },
 headquarters: { name: 'The Frozen Archive', locationId: 'frozen_archive' },
  crisisConnection: `Skadi defends her founder's method against contradictory readings she cannot explain. Privately, she has begun a secret cross-reference, comparing the elk-readings against <LoreLink termId="cassia">Cassia</LoreLink>'s pre-collapse predictions. The pattern suggests the interference is *temporal*: something is editing the future the elk can see. She has not told the Archive council, because the implication is that the Chronarchs' temporal stitching is responsible.`,
  internalOpposition: {
   name: 'Helgar the Rejector',
   stance: 'A senior Augur who argues the Order should abandon Cassia\'s method entirely  —  the elk-readings have become unreliable, and continuing to trust them is endangering lives. He advocates for pure mathematical star-arithmetic instead of blood-reading, putting him in direct conflict with Skadi.'
  }
  },

 worldFriction: [
 { region: 'nordhalla', location: 'frozen_archive', status: 'celebrated', consequence: 'At the Frozen Archive, Augurs are the prophetic backbone, their readings inform Skald military deployment and House Skalvyr policy. Senior Augurs hold advisory seats and their elk-readings are recorded in the genealogical archives.', workaround: 'This standing is currently fragile: the 41% accuracy collapse has halved their credibility, and junior augurs are increasingly ignored by commanders who remember the 93% era.' },
 { region: 'sundrift-vale', status: 'distrusted', consequence: 'The Ordan leave their dead to the steppe and have no preservation tradition, Augury reads as necromancy to them. An Augur traveling the Vale is treated as a corpse-violator and refused hospitality at migration camps.' }
 ],

 overview: {
 originStory: `A reader of the immediate future. Not prophecy. Not cosmic destiny. The trajectory of a blade. The moment a guard will drop. The exact second a killing blow will land. The augur reads these things in fresh violence, blood, entrails, splintered bone, and pays for every vision with sanity or stamina.

The first was Cassia, a Skald star-watcher at the Frozen Archive. When Sol first darkened and her astrolabes froze solid, she took a bronze scaling knife, opened the abdomen of a sacrificial glacier-elk, and traced the steaming convolutions of its intestines across the icy stone. By the purple mottling of the liver and the coil-pattern of the gut, she read the exact hour of the Deepening.

The temporal feedback burn took her past. The memories of her husband's face were incinerated to clear space for precise coordinate chains of cosmic doom. The names of her children went next. The warmth of the hearth. Her own name. She does not move. She cannot move. Her body sits preserved in the glacier-ice at the Frozen Archive, trapped in the moment of her greatest vision. The glacier-ice is the entrail now, and Cassia reads the future in the stress-fractures forming in her own ice-prison. The Archive-Mistress interprets the crack-patterns for those who cannot read them.

Each culture reads a different entrail. The Skald, Cassia's original tradition, still sacrifice glacier-elk against frozen ground. The Earthen Astril read the future in resonant fractures of their own crystalline skin, Lumian memory echoing forward through the lattice. The Stellar Astril smuggle prophecy past their own suppression, the gagged heritage screaming warnings through crystal. The Tessen read the future in the crumbling architecture of their sealed keeps, the dying keep as sacrificial animal. The Marked Vreken read bioluminescent bloom-patterns across the mycelial network, though the network has begun looping the same prophecy. The Hollow-Solari read Sol's Breath itself, the dying star's pulse as omen, patterns in the dimming that no one else has been told about.

The star-arithmetic is failing. Accuracy has collapsed from ninety-three percent to forty-one percent in three months. One elk shows the Archive intact in ten years. Another shows it collapsed last week. The entrails return contradictory results because something is interfering with the flow of time itself. The current leader, Archive-Mistress Skadi Glass-Eye, privately suspects the Chronarchs' temporal stitching is responsible. A rival within the order, Helgar the Rejector, argues the entire method should be abandoned for pure mathematical calculation with no blood involved.`,

 title: "The Augur",
 subtitle: "Visceral Haruspex of the Ripped Flesh",

 quickOverview: {
  title: "Quick Overview",
     content: `**Who they are**: A visceral haruspex who reads the immediate future in steaming entrails, spilt blood, and splintered marrow. They do not gaze at clean stars  —  they drag prophecy warm and wet from the belly of the dead.

**The hook**: Every d20 roll within sixty feet feeds your dual resource  —  even results bring agonizing foresight to shield allies, odd results bring decaying curses to cripple enemies. You spend these twin visions to rewrite the next six seconds of combat before the blade ever lands.

**The cost**: Your sight demands fresh violence. With no bleeding target or corpse nearby, the future goes blind  —  you must carve runes into your own forearms and endure a self-inflicted Bleed to force the omens to speak. Unspent visions at rest scourge your mind until blood is spilled again.

**Bring one for**: Unmatched preemptive action economy. You do not heal damage after it lands  —  you prevent it from ever connecting, yanking allies out of harm's way and guaranteeing critical counter-strikes that turn a killing blow back on its sender.`,
 },

 description: `The Augur is a tragic seer of the immediate gutter. While scholars squabble over ancient astronomical charts, the Augur reads the heat of fresh battlefields and the trajectory of violence yet to come. They do not predict broad cosmic destinies, they track the exact trajectory of a blade, the moment a guard will drop, and the instant a killing blow will land. Every vision demands a toll of sanity or stamina; magic is not a formula, but a visceral price that must be paid in focus and fortitude.`,

 roleplayIdentity: {
  title: "Roleplay Identity",
  content: `**HISTORY: THE GENESIS**
The augur's foresight was born in the Frozen Archive of <LoreLink termId="nordhalla">Nordhalla</LoreLink>. A Skald star-watcher named **Cassia** read the terrifying portents of Sol's Deepening, her runes burning with intense, blistering heat.

The price of this feedback loop was memory-loss. Cassia had to trade away her own personal memories to glimpse the future, leaving her runes scarred and her mind disoriented.

**CITIES & CIVIL RECEPTION**
Augurs are highly revered as scholars and prophets in the <LoreLink termId="frozen_archive">Frozen Archive</LoreLink> and the high halls of the <LoreLink termId="synod_hold">Synod Hold</LoreLink>.

**RACES & CULTURAL AFFILIATION**
The class is heavily practiced by the <LoreLink termId="skald">Rune Keeper Skald</LoreLink>, the Astril, and the Hollow-Solari <LoreLink termId="solari">Solari</LoreLink> who read Sol's Breath's dying pulse.

**NOTABLE FIGURES**
* **Cassia the Star-Eyed**: The legendary seer of the <LoreLink termId="frozen_archive">Frozen Archive</LoreLink> who predicted the solar eclipse at the cost of her past.
* **Kaelen the Unseen**: An Astril priest who mapped the stellar decay from the Scribe's Tower.`
 },

 signatureQuote: {
  text: '"I opened the elk and saw our chieftain dead, our granary empty, and the sun still dark. The entrails do not lie. They also do not offer comfort."',
  speaker: 'Cassia the Star-Eyed',
  context: 'First recorded augury, Nordhalla Frozen Archive, at the Binding'
 },

 philosophy: {
  coreTenet: 'The future is not hidden, it is written in the present if you know where to look. Blood, bones, entrails, smoke, the scatter of rune-stones, these are not omens. They are data. The Augur reads the data that others are too squeamish to examine.',
  relationship: 'Augurs do not bargain with spirits or petition old powers. They extract information from the physical world through direct, visceral methods. The future is not revealed to them, it is cut open, spilled, and read while steaming. This relationship is purely mechanical: the Augur opens, the future bleeds, the Augur reads.',
  paradox: 'The Augur sees what is coming but cannot change it. The visions are snapshots of probability, not commands. An Augur who sees a party member dying in the next room has two choices: warn them (and be right when they die anyway), or say nothing. The future does not change because it was seen. It changes despite being seen.'
 },

 currentCrisis: `The star-arithmetic is failing. For eight centuries, the Augurs of the Frozen Archive have used Cassia's original elk-entrail method to predict major events with 93% accuracy. In the past three months, accuracy has dropped to 41%. The entrails are not lying, they are returning results that contradict each other. One elk shows the Archive intact in ten years. Another shows it collapsed last week.

The Augurs have identified the cause: something is interfering with the flow of time itself, creating echoes of futures that cannot exist simultaneously. The phenomenon began on the same day the first Doomsayer returned contradictory extinction equations. The Augurs and Doomsayers do not speak to each other, but their numbers are converging on the same conclusion: the timeline is fracturing, and the Augurs are the first to feel the cracks.`,

 meaningfulTradeoffs: `To see the future is to lose the present. Augurs develop a condition called "chronal myopia", their vision of tomorrow is crystal clear, but the room they are standing in now is blurry. They forget conversations that happened five minutes ago. They cannot read a book because the words of the next page overlay the words of the current one. They live in a permanent state of temporal vertigo, seeing every moment overlaid with its potential futures. Cassia forgot her children's names within a year of her first augury.`,

 classSpecificLocations: [
  {
  name: 'The Entrail Chambers',
  locationId: 'frozen-archive',
  description: 'A cold, stone chamber beneath the Frozen Archive where Augurs perform their readings. The floor is sloped and drained, blood washes away into a central basin. Racks of rune-etched bone chisels line the walls. The air smells of iron and old salt.',
  purpose: 'Ritual space for augury readings',
  status: 'Active, but the contradictory results have thrown the chamber into chaos'
  }
 ],

 combatRole: {
  title: "Combat Role",
  content: `In the visceral theater of war, Augurs are architects of survival and suffering:

**Preemptive Evasion**: Utilizing reactions to force attacks to automatically miss, shifting allies out of harm's way before blood is drawn.
**Critical Manipulation**: Guaranteeing devastating critical hits or immediate critical counter-strikes by tracing sigils of congealed blood.
**Visceral Debuffs**: Breaking bones, splintering marrow, and inflicting deep vulnerability through target flesh mutilation.
**Self-Inflicted Fuel**: Sacrificing their own health and enduring self-induced Bleed states to cast spells when the battlefield is clean of fresh gore.

Augurs are not frontline gladiators, nor are they safe, back-line spellcasters. They are high-risk, high-reward catalysts of immediate probability who must bleed to keep their allies breathing.

**Weaknesses**:
- Blind Without Blood: with no bleeding target or fresh corpse within 60 ft, your omens fail � you must cut yourself (1d6 slashing + Bleed) to see anything. Clean rooms, ambushes, and parley are your blind spots.
- Reaction-Window Only: you prevent damage, you never heal it � miss the reaction window and you have done nothing that round.
- Omen Debt: hoard Benediction/Malediction to a long rest and the unspent visions scourge you � -1 to all saves per leftover point (cap -10) until blood is spilled again.
- Cap Overflow Waste: resource generated past your spec cap is lost and deals 1 wyrd damage per wasted point straight to your mind.
- Squishy Soothsayer: light armor and a fragile body � if a frontline reaches you, you fold fast.
- Chronal Myopia (social/exploration): you forget the last five minutes, cannot read (tomorrow's page overlays today's), and lose names � briefings, passwords, and faces slip through you.`,
 },

 playstyle: {
  title: "Playstyle",
  content: `Playing an Augur is a lesson in tragic economy and intense focus:

**Track Every Die**: You are a hawk watching the table. Every d20 roll,attack, save, or check,directly builds your dual pools.
**Balance the Scales**: You must constantly juggle your Benediction (boons) and Malediction (curses), spending them strategically as the dice dictate.
**Accept the Agony**: You must be willing to slice your own HP and suffer Bleed damage when starting a fight from ambush or facing clean enemies, knowing that blood is the only key to your magic.
**Preemptive Focus**: You do not heal damage after it occurs; you prevent it by rewriting the incoming strike before the blade touches meat.`,
 },

 immersiveCombatExample: {
  title: "Combat Example: The Haruspex's Toll",
  content: `**The Setup**: You are an Augur creeping through a plague-blighted ruin with your party. A massive, iron-clad abominable executioner blocks the path. The room is quiet; no blood has been spilt. You have 0 Benediction and 0 Malediction. You must act.

**Turn 1 - The First Incision**
*Because no bleeding targets or fresh corpses exist, your eyes are blind to the future. You pull your ritual flaying hook and drag it across your own left forearm, carving the first sign.*
* **Blood Price**: You take 1d6 slashing damage (4 HP lost) and suffer Bleed (1d4 damage at the start of your turn for 3 rounds). This generates +2 Malediction.
* **Your Action**: Cast "Fractured Fate Portent" on the Executioner (8 Mana + 2 Malediction spent).
* **Effect**: You scream the fracture you see. The executioner staggers as his femur cracks internally. He takes 2d6 wyrd damage and suffers -2 DR and -10ft speed for 3 rounds.
* **Mana**: 45 ? 37/55.
* **Malediction**: 2 ? 0/15.
* **Current State**: Malediction: 0/15 | Benediction: 0/5 | HP: 46/50 | Bleed Active (3 rounds)

**Turn 2 - The Blood Flows**
*The executioner roars in agony, his bones splintering from within. The fight begins.*
* **Fighter's Turn**: Attacks the executioner ? d20+6 ? [12] ? Hit! 
* **Omen Reading**: 12 is even ? +1 Benediction.
* **Enemy's Turn**: The executioner swings his massive cleaver at the Fighter ? d20+7 ? [17] ? Hit!
* **Omen Reading**: 17 is odd ? +1 Malediction.
* **Your Reaction**: Spend 1 Benediction and 1 Malediction to cast "Blood-Read Foresight".
* **Effect**: You read the spray of dust and sweat. You pull the threads of the immediate six seconds. The cleaver cleaves empty air as the Fighter slips 10 feet backward under your frantic warning, completely evading the attack without opportunity strikes.
* **Current State**: Malediction: 0/15 | Benediction: 0/5 | HP: 46/50 | Fighter untouched. The executioner cleaves nothing but shadow.`,
 },
 },

 resourceSystem: {
 title: "Benediction & Malediction of the Haruspex",
 subtitle: "Bleak Foresight & Fracturing Curses",

 description: `The Augur's magic is driven by the immediate vibration of combat. Every d20 roll within 60 feet generated by any creature fuels the Haruspex:
- **Even Rolls**: Generate 1 **Benediction**,the radiant, blinding flash of immediate preservation.
- **Odd Rolls**: Generate 1 **Malediction**,the psychic, decaying rot of immediate doom.

?? **The Haruspex Flaw**: Your omen-reading spells require fresh violence. If no bleeding targets or fresh corpses exist within 60 feet, your vision is blind. You must execute a **Blood Price** action (0 AP, once per round): take 1d6 slashing damage and inflict Bleed (1d4 damage at start of turn for 3 rounds) on yourself to generate 2 Benediction or 2 Malediction of your choice.

?? **Omen Debt**: Your soul cannot safely hold these visions. At the end of a long rest, any unused Benediction or Malediction decays. If you had unused resources, your mind is scourged by the ghosts of unfulfilled futures, inflicting **Omen Debt** (a permanent -1 penalty to all saving throws per unused point, capped at -10) until you spill blood in combat again.`,

 cards: [
  {
  title: "Benediction",
  stats: "0-10 Scale (Hierophant: 15)",
  details:
   "Generated by even d20 rolls. Spent on immediate defense, preemptive evasion, and ember warding of flesh.",
  },
  {
  title: "Malediction",
  stats: "0-10 Scale (Harbinger: 15)",
  details:
   "Generated by odd d20 rolls. Spent on bone-splintering wyrd damage, crippling physical penalties, and vulnerability markings.",
  },
  {
  title: "Visceral Haruspex",
   stats: "Blood Price",
   details:
    "If no fresh violence is spilt, you must cut your own flesh to generate omens. Spills 1d6 HP and inflicts self-bleed for 3 rounds.",
  },
 ],

 usage: {
  momentum:
  "Spill blood early. Once an enemy or ally is bleeding, your vision opens and you no longer need to mutilate yourself. Watch the rolls of allies and foes to dynamically adapt your action plan.",
  flourish:
  "Use your immediate reactions. Saving an ally from a fatal strike with Blood-Read Foresight or guaranteeing a critical counter-strike turns the tides of battle instantly.",
 },

 overheatRules: {
  title: "Omen Exhaustion & The Flesh Tax",
  content: `The Augur's manipulation of immediate fate carries severe physical and mental tolls:

**The Resource Caps**:
Your specialization limits your absolute capacity to store fate:
* **Auspex (Balanced)**: 10 Benediction / 10 Malediction.
* **Harbinger (Doom)**: 5 Benediction / 15 Malediction.
* **Hierophant (Grace)**: 15 Benediction / 5 Malediction.
Any resource generated beyond these caps is lost and immediately deals 1 wyrd damage per wasted point directly to the Augur's mind.

**The Flesh Tax (Operational Friction)**:
Many advanced spells demand an aggressive sacrifice of the caster's own physical integrity. You do not simply spend mana; you spend your own max HP, split your skin, or blind your own eyes to make the omens absolute.

**The Omen Debt (The Unwritten Future)**:
Fate demands resolution. If you hoard Benediction or Malediction without spending them, the unfulfilled paths twist inward. For every point of omen resource remaining at a long rest, you suffer 1 stack of Omen Debt. Each stack reduces all saving throws by 1 (max -10). The only way to cleanse Omen Debt is to complete a combat encounter where you successfully trigger at least three critical strikes or absolute evasions.`,
 },

 essenceGenerationTable: {
  title: "Haruspex Resource Generation",
  headers: ["Action", "Resource Gained", "Notes"],
  rows: [
  [
   "Even d20 Roll within 60ft",
   "+1 Benediction",
   "Generated by attacks, saves, or checks of allies, enemies, or yourself",
  ],
  [
   "Odd d20 Roll within 60ft",
   "+1 Malediction",
   "Generated by attacks, saves, or checks of allies, enemies, or yourself",
  ],
  [
   "Blood Price (No Violence Present)",
   "+2 Benediction or Malediction",
   "Takes 1d6 slashing damage and inflicts self-bleed (1d4/round, 3 rounds)",
  ],
  [
   "Reading Fresh Entrails (Corpse within 10ft)",
   "+3 Benediction or Malediction",
   "Requires 1 Action. Sifts through a creature that died this round",
  ],
  ],
 },

 loaInvocationTable: {
  title: "Immediate Action Rites",
  headers: ["Rite", "Resource Cost", "Defensive / Offensive Focus", "Effect Summary"],
  rows: [
  [
   "Blood-Read Foresight",
   "1 Benediction + 1 Malediction",
   "Absolute Defense",
   "Reaction: Incoming attack automatically misses; ally slips 10ft away",
  ],
  [
   "Omen of the Rending Strike",
   "2 Benediction",
   "Absolute Offense",
   "Action: Next weapon attack is a guaranteed critical hit or critical counter-strike",
  ],
  [
   "Fractured Fate Portent",
   "2 Malediction",
   "Target Crippling",
   "Action: Cracks bones internally. Deals 2d6 psychic, -2 DR, -10ft speed",
  ],
  ],
 },
 },

 specializations: {
 title: "Visceral Specializations",
 subtitle: "Three Paths of the Bleak Sign",

 description: `Every Haruspex must choose how they interpret the spilt gore of the world. Will you balance the scales of agony, rot away in the shadow of doom, or burn your own sight to channel searing grace?`,

 passiveAbility: {
  name: "Omen's Path",
  description:
  "Your specialization alters your dual resource caps and unlocks distinct rites of flesh manipulation.",
 },

 specs: [
  { id : "auspex",
  name: "Auspex",
  icon: "fa-eye",
  color: "#C8A2C8",
  theme: "Balanced Haruspex",

  description: `Auspices seek the perfect, terrifying equilibrium between creation and decay. They believe that fate is a scale that must be balanced in blood. By reading both the ember spray of life and the dark rot of death, they keep their parties hovering just above the grave while dragging their foes into it.`,

  playstyle: "Balanced control, shifting adaptation, dual-purpose warding",

  strengths: [
   "Maximum resource caps set to a balanced 10 Benediction and 10 Malediction",
   "Spelling dual costs (both BN and ML) have their mana costs reduced by 30%",
   "Gain +1 to all saving throws while both resource pools are exactly equal",
   "Can spend 1 Benediction and 1 Malediction to instantly cleanse a physical condition",
  ],

  weaknesses: [
   "Lacks the extreme burst damage of Harbingers",
   "Lacks the high-impact protection zones of Hierophants",
   "Highly vulnerable when one resource pool is empty while the other is full",
  ],

  specPassive: {
   name: "Symmetric Foresight",
   description:
   "10/10 dual resource caps. Dual-cost spells cost 30% less mana. +1 to all saves when pools are balanced.",
  },
  },

  { id : "harbinger",
  name: "Harbinger",
  icon: "fa-cloud-bolt",
  color: "#8B5A8B",
  theme: "Prophet of the Black Ash",

  description: `Harbingers have stared too long into the screaming dark. Their bodies are maps of scars, their veins running with blackened maledictory rot. They care nothing for preservation; they seek only to accelerate the end. Every omen they read is a weapon, every word they whisper a fracture in a foe's skull.`,

  playstyle: "High-risk offensive wyrd damage, crippling debuffs, vulnerability stacking",

  strengths: [
   "Maximum resource caps set to 5 Benediction and 15 Malediction",
   "All wyrd damage ignores enemy resistances entirely",
   "Malediction-fueled spells deal +2d6 additional wyrd damage",
   "Inflicting Bleed on an enemy generates +1 Malediction automatically",
  ],

  weaknesses: [
   "Extremely fragile; max HP reduced permanently by 10%",
   "Almost entirely lacks defensive or healing capabilities",
   "Highly prone to self-induced Bleed hazards",
  ],

  specPassive: {
   name: "Maledictory Rot",
   description:
   "5/15 dual resource caps. wyrd damage ignores resistance. Malediction spells deal +2d6 wyrd damage.",
  },
  },

  { id : "hierophant",
  name: "Hierophant",
  icon: "fa-sun",
  color: "#DAA520",
  theme: "Martyr of the Blinding Splinters",

  description: `Hierophants are tragic martyrs who burn away their own sight to channel the searing, blinding light of tomorrow. They read the golden, agonizing threads of grace, congealing spilt blood into shields of shining marrow. They endure immense physical pain to ensure their allies never feel a wound.`,

  playstyle: "Aggressive defensive support, massive damage-mitigation zones, ember healing",

  strengths: [
   "Maximum resource caps set to 15 Benediction and 5 Malediction",
   "All healing spells restore 50% more HP",
   "Benediction-fueled spells grant allies +2 DR for 2 rounds",
   "Can absorb 50% of all damage taken by nearby allies passively",
  ],

  weaknesses: [
   "Extremely low damage output; physical weapon strikes deal half damage",
   "Spells have high mana costs",
   "Absorbing ally damage makes them highly prone to sudden death",
  ],

  specPassive: {
   name: "Searing Grace",
   description:
   "15/5 dual resource caps. Healing increased by 50%. Benediction spells grant +2 DR to allies.",
  },
  },
 ],
 },

 exampleSpells: [
    ...UTILITY_SPELLS,
    // ============================================================
 // LEVEL 1 SPELLS (5)
 // ============================================================

 { id : "augur_read_the_signs",
  name: "Read the Omen",
  description:
  "You observe the shifting shadows and heat patterns rising from a recent clash. If no conflict is present, you draw upon localized kinetic friction, forcing the omens of fate to speak. The patterns reveal the target's fatal structural flaw.",
  level: 1,
  spellType: "ACTION",
  icon: "Necrotic/Ritual",
  effectTypes: ["debuff"],
  typeConfig: {
  school: "wyrd",
  icon: "Necrotic/Ritual",
  tags: ["debuff", "haruspex", "vulnerability", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 60,
  targetRestrictions: ["enemies"],
  maxTargets: 1,
  requiresLineOfSight: true,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 4 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  classResource: { type: "malediction", cost: 1 },
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   { id : "gut_read_vulnerability",
   name: "Exposed Flaw",
   description: "Target has +50% vulnerability to wyrd damage for 3 rounds.",
   mechanicsText: "Imposes 50% wyrd vulnerability on the target.",
   statusEffect: {
    vulnerabilityType: "wyrd",
    vulnerabilityPercent: 50,
   },
   },
  ],
  savingThrow: {
   ability: "spirit",
   difficultyClass: 13,
   saveOutcome: "negates",
  },
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  canBeDispelled: true,
  },
  resolution: "DICE",
  tags: ["debuff", "haruspex", "vulnerability", "omen"],
 

  somaticText: "Press two fingers to your brow and draw the pattern of what will be.",
  verbalText: "Whisper the reading aloud so the world is bound to it.",
},

 { id : "augur_omen_shield",
  name: "Blood-Read Foresight",
  description:
  "You read the rapid pulse and visual strain of a targeted ally six seconds before the strike lands. Shouting a preemptive warning, you warp the local probability field to yank them out of harm's way, leaving the enemy striking nothing but a fading shadow.",
  level: 1,
  spellType: "REACTION",
  icon: "Nature/Ethereal Bear Spirit",
  effectTypes: ["buff", "utility"],
  typeConfig: {
  school: "wyrd",
  icon: "Nature/Ethereal Bear Spirit",
  tags: ["reaction", "evasion", "preemptive", "omen"],
  castTime: 1,
  castTimeType: "REACTION",
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 30,
  targetRestrictions: ["allies"],
  maxTargets: 1,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 6 },
  actionPoints: 0,
  components: ["verbal"],
  classResource: { type: "benediction", cost: 2 },
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
  buffConfig: {
  buffType: "damageMitigation",
  effects: [
   { id : "preemptive_evasion",
   name: "Blood-Read Evasion",
   description:
    "The next attack targeting this ally automatically misses. The ally immediately shifts up to 10 feet without provoking opportunity strikes.",
   mechanicsText: "Forces next attack to miss. Ally moves 10ft free.",
   },
  ],
  durationType: "rounds",
  durationValue: 1,
  durationUnit: "rounds",
  canBeDispelled: false,
  },
  utilityConfig: {
  utilityType: "movement",
  selectedEffects: [
   { id : "preemptive_shift",
   name: "Fated Shift",
   description: "Shift 10 feet out of danger without provoking opportunity strikes.",
   distance: 10,
   },
  ],
  power: "minor",
  },
  resolution: "AUTOMATIC",
  tags: ["reaction", "evasion", "preemptive", "omen"],
 

  somaticText: "Press two fingers to your brow and draw the pattern of what will be.",
  verbalText: "Whisper the reading aloud so the world is bound to it.",
},

 { id : "augur_minor_portent",
  name: "Pulse Curse",
  description:
  "You project a focused pulse of kinetic pressure toward a foe. The force vibrates in mid-air, forming a floating, glowing rune of doom. Their vision clouds as their heartbeats sync to a slow, halting rhythm.",
  level: 1,
  spellType: "ACTION",
  icon: "Necrotic/Corruption",
  effectTypes: ["debuff", "damage"],
  typeConfig: {
  school: "wyrd",
  icon: "Necrotic/Corruption",
  tags: ["debuff", "damage", "curse", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 60,
  targetRestrictions: ["enemies"],
  maxTargets: 1,
  requiresLineOfSight: true,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 4 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  classResource: { type: "malediction", cost: 1 },
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   { id : "arterial_curse_debuff",
   name: "Withering Decay",
   description: "Target has -2 to all attack rolls as their vision clouds with rot.",
   mechanicsText: "-2 penalty to all attack rolls.",
   },
  ],
  savingThrow: {
   ability: "spirit",
   difficultyClass: 13,
   saveOutcome: "negates",
  },
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  canBeDispelled: true,
  },
  damageConfig: {
  formula: "1d6",
  damageTypes: ["wyrd"],
  resolution: "DICE",
  },
  resolution: "DICE",
  tags: ["debuff", "damage", "curse", "omen"],
 

  somaticText: "Press two fingers to your brow and draw the pattern of what will be.",
  verbalText: "Whisper the reading aloud so the world is bound to it.",
},

 { id : "augur_sign_of_clarity",
  name: "Omen of the Sundered Strike",
  description:
  "You paint a wet, crimson sigil on an ally's weapon. In their mind, they see the absolute, terrifying vulnerability of their foe,their guard shattered, their throat exposed. A guaranteed, bone-splintering strike.",
  level: 1,
  spellType: "ACTION",
  icon: "Radiant/Divine Downward Sword",
  effectTypes: ["buff"],
  typeConfig: {
  school: "ember",
  icon: "Radiant/Divine Downward Sword",
  tags: ["buff", "critical", "support", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 30,
  targetRestrictions: ["allies"],
  maxTargets: 1,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 5 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  classResource: { type: "benediction", cost: 2 },
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
  buffConfig: {
  buffType: "custom",
  effects: [
   { id : "flayed_strike_buff",
   name: "Fated Critical",
   description:
    "The next weapon strike is a guaranteed critical hit. If the ally is attacked before their turn, they may immediately execute a critical counter-strike as a reaction.",
   mechanicsText: "Next attack is a critical hit, or enables critical counter-strike reaction.",
   },
  ],
  durationType: "rounds",
  durationValue: 1,
  durationUnit: "rounds",
  canBeDispelled: true,
  },
  resolution: "AUTOMATIC",
  tags: ["buff", "critical", "support", "omen"],
 

  somaticText: "Snap your wrist to release the gathered omen as a lance of fated heat.",
  verbalText: "Utter the decree that condemns the target to its foretold end.",
},

 { id : "augur_desperate_omen",
  name: "Death-Stretched Panic",
  description:
  "When your flesh is reduced to a bloody pulp, your visions of death sharpen into a hyper-focused panic. Agony overrides your fear, giving you the desperate agility of a cornered beast.",
  level: 1,
  spellType: "PASSIVE",
  icon: "Psychic/Mental Chaos",
  effectTypes: ["passive"],
  typeConfig: {
  school: "wyrd",
  icon: "Psychic/Mental Chaos",
  tags: ["passive", "debuff", "omen", "augur"],
  castTime: 0,
  castTimeType: "PASSIVE",
  },
  targetingConfig: {
  targetingType: "self",
  },
  resourceCost: {
  components: ['verbal', 'somatic'], resourceTypes: [],
  resourceValues: {},
  actionPoints: 0,
  },
  resolution: "AUTOMATIC",
  tags: ["passive", "debuff", "omen", "augur"],
 

  somaticText: "Press two fingers to your brow and draw the pattern of what will be.",
  verbalText: "Whisper the reading aloud so the world is bound to it.",
},

 // ============================================================
 // LEVEL 2 SPELLS (3)
 // ============================================================

 { id : "augur_portent_of_weakness",
  name: "Fractured Fate Portent",
  description:
  "You declare an omen of imminent fracture. An invisible, crushing weight slams down on the target's joints, straining their physical form. They stagger, their defenses splitting under their own weight.",
  level: 2,
  spellType: "ACTION",
  icon: "Necrotic/Bone Shards",
  effectTypes: ["debuff", "damage"],
  typeConfig: {
  school: "wyrd",
  icon: "Necrotic/Bone Shards",
  tags: ["debuff", "damage", "crippling", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 60,
  targetRestrictions: ["enemies"],
  maxTargets: 1,
  requiresLineOfSight: true,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 8 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  classResource: { type: "malediction", cost: 2 },
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
  debuffConfig: {
  debuffType: "statPenalty",
  effects: [
   { id : "fractured_fate_debuff",
   name: "Fractured Frame",
   description: "Target has -2 DR and their Agility is reduced by 2 for 3 rounds.",
   mechanicsText: "-2 DR and -2 Agility.",
   },
  ],
   statPenalties: [
    { stat: "agility", magnitude: -2, magnitudeType: "flat" },
   ],
  savingThrow: {
   ability: "constitution",
   difficultyClass: 14,
   saveOutcome: "negates",
  },
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  canBeDispelled: true,
  },
  damageConfig: {
  formula: "2d6",
  damageTypes: ["wyrd"],
  resolution: "DICE",
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  concentrationRequired: true,
  },
  resolution: "DICE",
  tags: ["debuff", "damage", "crippling", "omen"],
 

  somaticText: "Press two fingers to your brow and draw the pattern of what will be.",
  verbalText: "Whisper the reading aloud so the world is bound to it.",
},

 { id : "augur_terrain_of_ruin",
  name: "Hallowed Consecration",
  description:
  "You pour a chalice of consecrated alchemical oils onto the earth. The soil instantly shimmers, bubbling into a dense mist of kinetic energy. Enemies who walk here are slowed as the heavy pressure drags at their boots.",
  level: 2,
  spellType: "ACTION",
  icon: "Necrotic/Corruption",
  effectTypes: ["damage", "debuff"],
  typeConfig: {
  school: "blight",
  icon: "Necrotic/Corruption",
  tags: ["area", "damage", "debuff", "hazard", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 60,
  areaConfig: { areaType: "circle", areaSize: 20, areaSizeUnit: "ft" },
  targetRestrictions: ["enemies"],
  maxTargets: 15,
  targetSelectionMethod: "manual",
  requiresLineOfSight: true,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 10 },
  actionPoints: 1,
  components: ["verbal", "somatic", "material"],
  materialComponents: "A cup of alchemical oil",
  classResource: { type: "malediction", cost: 3 },
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
  debuffConfig: {
  debuffType: "statPenalty",
  effects: [
   { id : "kinetic_consecration_slow",
   name: "Kinetic Grasp",
   description: "Movement speed halved and -2 to all Agility saving throws while in the zone.",
   mechanicsText: "Speed halved, -2 Agility saves.",
   },
  ],
  statPenalties: [
   { stat: "speed", magnitude: -50, magnitudeType: "percent" },
   { stat: "agility_saves", magnitude: -2, magnitudeType: "flat" },
  ],
  durationType: "rounds",
  durationValue: 5,
  durationUnit: "rounds",
  canBeDispelled: false,
  },
  damageConfig: {
  formula: "1d6",
  damageTypes: ["wyrd"],
  hasDotEffect: true,
  dotConfig: {
   dotFormula: "1d6",
   duration: 5,
   tickFrequency: "turn",
   isProgressiveDot: false,
  },
  resolution: "DICE",
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 5,
  durationUnit: "rounds",
  concentrationRequired: true,
  },
  resolution: "DICE",
  tags: ["area", "damage", "debuff", "hazard", "omen"],
 
  triggerConfig: {
    triggers: [
      { id: "augur_terrain_of_ruin_fate_cost", name: "Fate's Toll", triggerType: "on_cast", action: "Spends 3 malediction to bend fate." }
    ]
  },
  somaticText: "Carve a slow circle in the air, letting the rot of prophecy take root.",
  verbalText: "Chant the names of the doomed until the curse lands.",
},

 { id : "augur_sign_of_protection",
  name: "Fated Aegis",
  description:
  "You trace a protective rune in mid-air and direct it at an ally. A shimmering, iron-hard carapace of crimson and golden light forms around them, drinking incoming trauma.",
  level: 2,
  spellType: "ACTION",
  icon: "Radiant/Divine Blessing",
  effectTypes: ["buff"],
  typeConfig: {
  school: "ember",
  icon: "Radiant/Divine Blessing",
  tags: ["buff", "armor", "mitigation", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 40,
  targetRestrictions: ["allies"],
  maxTargets: 1,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 6 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  classResource: { type: "benediction", cost: 3 },
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
  buffConfig: {
  buffType: "custom",
  effects: [
   { id : "congealed_aegis_buff",
   name: "Steadfast Resolve",
   description: "Grants +3 DR and resistance to the next source of smashing damage.",
   mechanicsText: "+3 DR, physical resistance (1 charge).",
   },
  ],
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  canBeDispelled: true,
  },
  resolution: "AUTOMATIC",
  tags: ["buff", "armor", "mitigation", "omen"],
 
  triggerConfig: {
    triggers: [
      { id: "augur_sign_of_protection_fate_cost", name: "Fate's Toll", triggerType: "on_cast", action: "Spends 3 benediction to bend fate." }
    ]
  },
  somaticText: "Snap your wrist to release the gathered omen as a lance of fated heat.",
  verbalText: "Utter the decree that condemns the target to its foretold end.",
},

 // ============================================================
 // LEVEL 3 SPELLS (3)
 // ============================================================

 { id : "augur_omen_bolt",
  name: "Omen Lance",
  description:
  "You thrust your hand forward, casting a dual lance of burning energy and shattering, resonant wyrd waves. If the immediate combat signs are even, the bolt strikes with terrible, blinding intensity.",
  level: 3,
  spellType: "ACTION",
  icon: "Radiant/Radiant Sunburst",
  effectTypes: ["damage"],
  typeConfig: {
  school: "wyrd",
  secondaryElement: "ember",
  icon: "Radiant/Radiant Sunburst",
  tags: ["attack", "damage", "dual_element", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 60,
  targetRestrictions: ["enemies"],
  maxTargets: 1,
  requiresLineOfSight: true,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 12 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  classResource: { type: "benediction", cost: 2 },
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
  damageConfig: {
  formula: "3d8",
  damageTypes: ["wyrd", "ember"],
  secondaryDamage: {
   formula: "1d8",
   condition: "If the damage roll total is even, deal additional ember damage.",
  },
  resolution: "DICE",
  },
  resolution: "DICE",
  tags: ["attack", "damage", "dual_element", "omen"],
 

  somaticText: "Snap your wrist to release the gathered omen as a lance of fated heat.",
  verbalText: "Utter the decree that condemns the target to its foretold end.",
},

 { id : "augur_harbinger_gaze",
  name: "Unblinking Gaze",
  description:
  "You lock eyes with a target and force them to see the vastness of fate, fracturing their sense of time. The mental shock breaks their concentration, leaving them staggered in blind terror.",
  level: 3,
  spellType: "ACTION",
  icon: "Psychic/Psionic Boom",
  effectTypes: ["damage", "debuff"],
  typeConfig: {
  school: "wyrd",
  icon: "Psychic/Psionic Boom",
  tags: ["damage", "debuff", "fear", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 40,
  targetRestrictions: ["enemies"],
  maxTargets: 1,
  requiresLineOfSight: true,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 12 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  classResource: { type: "malediction", cost: 3 },
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
  damageConfig: {
  formula: "3d6",
  damageTypes: ["wyrd"],
  resolution: "DICE",
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   { id : "unblinking_gaze_fear",
   name: "Frightened",
   description: "Target is Frightened and has disadvantage on all attack rolls.",
   mechanicsText: "Frightened state, disadvantage on attack rolls.",
   },
  ],
  savingThrow: {
   ability: "spirit",
   difficultyClass: 14,
   saveOutcome: "negates",
  },
  durationType: "rounds",
  durationValue: 2,
  durationUnit: "rounds",
  canBeDispelled: true,
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 2,
  durationUnit: "rounds",
  },
  resolution: "DICE",
  tags: ["damage", "debuff", "fear", "omen"],
 
  triggerConfig: {
    triggers: [
      { id: "augur_harbinger_gaze_fate_cost", name: "Fate's Toll", triggerType: "on_cast", action: "Spends 3 malediction to bend fate." }
    ]
  },
  somaticText: "Press two fingers to your brow and draw the pattern of what will be.",
  verbalText: "Whisper the reading aloud so the world is bound to it.",
},

 { id : "augur_sacred_ground",
  name: "Vigilant Sanctuary",
  description:
  "You hammer your staff into the ground, creating a zone of blinding, protective radiance. Allies who stand within have their wounds sealed with warm, restorative light, while enemies are scorched by the searing truth.",
  level: 3,
  spellType: "ACTION",
  icon: "Radiant/Radiant Light Burst",
  effectTypes: ["healing", "damage"],
  typeConfig: {
  school: "ember",
  icon: "Radiant/Radiant Light Burst",
  tags: ["area", "healing", "damage", "consecrated", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 45,
  areaConfig: { areaType: "circle", areaSize: 15, areaSizeUnit: "ft" },
  targetRestrictions: ["any"],
  maxTargets: 15,
  targetSelectionMethod: "manual",
  requiresLineOfSight: true,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 14 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  classResource: { type: "benediction", cost: 3 },
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
  healingConfig: {
  formula: "2d6",
  healingType: "zone",
  hasHotEffect: true,
  hotFormula: "1d6",
  hotDuration: 3,
  hotTickType: "turn",
  resolution: "DICE",
  },
  damageConfig: {
  formula: "2d6",
  damageTypes: ["ember"],
  hasDotEffect: true,
  dotConfig: {
   dotFormula: "1d6",
   duration: 3,
   tickFrequency: "turn",
   isProgressiveDot: false,
  },
  resolution: "DICE",
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  concentrationRequired: true,
  },
  resolution: "DICE",
  tags: ["area", "healing", "damage", "consecrated", "omen"],
 
  triggerConfig: {
    triggers: [
      { id: "augur_sacred_ground_fate_cost", name: "Fate's Toll", triggerType: "on_cast", action: "Spends 3 benediction to bend fate." }
    ]
  },
  somaticText: "Snap your wrist to release the gathered omen as a lance of fated heat.",
  verbalText: "Utter the decree that condemns the target to its foretold end.",
},

 // ============================================================
 // LEVEL 4 SPELLS (3)
 // ============================================================

 { id : "augur_grand_malediction",
  name: "Ruinous Fate Hex",
  description:
  "You speak the ultimate word of decay. The target's temporal anchor begins to unravel. They freeze in absolute, screaming paralysis as their sense of self collapses.",
  level: 4,
  spellType: "ACTION",
  icon: "Necrotic/Death Mark",
  effectTypes: ["damage", "debuff"],
  typeConfig: {
  school: "wyrd",
  icon: "Necrotic/Death Mark",
  tags: ["debuff", "damage", "paralyze", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 45,
  targetRestrictions: ["enemies"],
  maxTargets: 1,
  requiresLineOfSight: true,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 20 },
  actionPoints: 2,
  components: ["verbal", "somatic"],
  classResource: { type: "malediction", cost: 5 },
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
  damageConfig: {
  formula: "4d8",
  damageTypes: ["wyrd"],
  resolution: "DICE",
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   { id : "ruinous_flay_paralysis",
   name: "Unveiled Shock",
   description: "Target is Paralyzed for 2 rounds by catastrophic sensory overload.",
   mechanicsText: "Paralyzed state.",
   },
  ],
  savingThrow: {
   ability: "constitution",
   difficultyClass: 15,
   saveOutcome: "negates",
  },
  durationType: "rounds",
  durationValue: 2,
  durationUnit: "rounds",
  canBeDispelled: true,
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 2,
  durationUnit: "rounds",
  },
  resolution: "DICE",
  tags: ["debuff", "damage", "paralyze", "omen"],
 
  triggerConfig: {
    triggers: [
      { id: "augur_grand_malediction_fate_cost", name: "Fate's Toll", triggerType: "on_cast", action: "Spends 5 malediction to bend fate." }
    ]
  },
  somaticText: "Press two fingers to your brow and draw the pattern of what will be.",
  verbalText: "Whisper the reading aloud so the world is bound to it.",
},

 { id : "augur_balanced_sign",
  name: "Cruciform Omen",
  description:
  "You draw a massive, bloody cross in the air. The intersection creates a highly volatile spatial nexus: allies on one axis are bathed in blinding ember recovery, while enemies on the other are scorched.",
  level: 4,
  spellType: "ACTION",
  icon: "Arcane/Portal Archway",
  effectTypes: ["healing", "damage"],
  typeConfig: {
  school: "ember",
  secondaryElement: "wyrd",
  icon: "Arcane/Portal Archway",
  tags: ["area", "healing", "damage", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 60,
  areaConfig: { areaType: "line", areaSize: 40, areaSizeUnit: "ft" },
  targetRestrictions: ["any"],
  maxTargets: 20,
  targetSelectionMethod: "manual",
  requiresLineOfSight: true,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 18 },
  actionPoints: 2,
  components: ["verbal", "somatic"],
  classResource: [
   { type: "benediction", cost: 3 },
   { type: "malediction", cost: 3 },
  ],
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
  healingConfig: {
  formula: "3d8",
  healingType: "zone",
  resolution: "DICE",
  },
  damageConfig: {
  formula: "3d8",
  damageTypes: ["wyrd"],
  resolution: "DICE",
  },
  resolution: "DICE",
  tags: ["area", "healing", "damage", "omen"],
 

  somaticText: "Snap your wrist to release the gathered omen as a lance of fated heat.",
  verbalText: "Utter the decree that condemns the target to its foretold end.",
},

 { id : "augur_hierophants_ward",
  name: "Martyr's Shroud",
  description:
  "You trace a massive ember shroud across your allies. Their skin hardens with the protective glare of congealed bones, making them completely immune to panic and significantly harder to cut.",
  level: 4,
  spellType: "ACTION",
  icon: "Radiant/Radiant Golden Shield",
  effectTypes: ["buff"],
  typeConfig: {
  school: "ember",
  icon: "Radiant/Radiant Golden Shield",
  tags: ["buff", "support", "armor", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "self_centered",
  rangeDistance: 0,
  areaConfig: { areaType: "sphere", areaSize: 30, areaSizeUnit: "ft" },
  targetRestrictions: ["allies"],
  maxTargets: 6,
  targetSelectionMethod: "auto",
  requiresLineOfSight: false,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 16 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  classResource: { type: "benediction", cost: 4 },
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
  buffConfig: {
  buffType: "custom",
  effects: [
   { id : "martyrs_shroud_buff",
    name: "Searing Shroud",
    description: "Grants +2 DR and absolute immunity to Charmed and Frightened conditions.",
    mechanicsText: "+2 DR, immune to Charmed/Frightened.",
    },
  ],
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  canBeDispelled: true,
  },
  resolution: "AUTOMATIC",
  tags: ["buff", "support", "armor", "omen"],
 
  triggerConfig: {
    triggers: [
      { id: "augur_hierophants_ward_fate_cost", name: "Fate's Toll", triggerType: "on_cast", action: "Spends 4 benediction to bend fate." }
    ]
  },
  somaticText: "Snap your wrist to release the gathered omen as a lance of fated heat.",
  verbalText: "Utter the decree that condemns the target to its foretold end.",
},

 // ============================================================
 // LEVEL 5 SPELLS (3)
 // ============================================================

 { id : "augur_omen_storm",
  name: "Crimson-Mist Tempest",
  description:
  "You conjure a violent, swirling tempest of crimson light and howling chronal echoes. The storm is hyper-volatile: allies within are healed by the life-giving mist, while enemies have their defenses shredded by jagged wind shear.",
  level: 5,
  spellType: "ACTION",
  icon: "Lightning/Thunderstorm",
  effectTypes: ["damage", "healing"],
  typeConfig: {
  school: "wyrd",
  secondaryElement: "ember",
  icon: "Lightning/Thunderstorm",
  tags: ["area", "damage", "healing", "storm", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 60,
  areaConfig: { areaType: "sphere", areaSize: 25, areaSizeUnit: "ft" },
  targetRestrictions: ["any"],
  maxTargets: 20,
  targetSelectionMethod: "manual",
  requiresLineOfSight: true,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 22 },
  actionPoints: 2,
  components: ["verbal", "somatic"],
  classResource: [
   { type: "benediction", cost: 3 },
   { type: "malediction", cost: 3 },
  ],
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
  damageConfig: {
  formula: "4d6",
  damageTypes: ["wyrd", "ember"],
  secondaryDamage: {
   formula: "2d6",
   condition: "If the damage roll total is even, deal additional ember damage.",
  },
  resolution: "DICE",
  },
  healingConfig: {
  formula: "4d6",
  healingType: "zone",
  resolution: "DICE",
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 5,
  durationUnit: "rounds",
  concentrationRequired: true,
  },
  resolution: "DICE",
  tags: ["area", "damage", "healing", "storm", "omen"],
 

  somaticText: "Snap your wrist to release the gathered omen as a lance of fated heat.",
  verbalText: "Utter the decree that condemns the target to its foretold end.",
},

 { id : "augur_field_of_misfortune",
  name: "Desolate Bog of Ruin",
  description:
  "You consecrate a massive area with ancient, agonizing curses. The ground shudders as bones break beneath the surface, creating an oppressive aura that saps all martial coordination and breaks armor.",
  level: 5,
  spellType: "ACTION",
  icon: "Necrotic/Corruption",
  effectTypes: ["debuff", "damage"],
  typeConfig: {
  school: "wyrd",
  icon: "Necrotic/Corruption",
  tags: ["area", "debuff", "damage", "hazard", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 60,
  areaConfig: { areaType: "circle", areaSize: 30, areaSizeUnit: "ft" },
  targetRestrictions: ["enemies"],
  maxTargets: 20,
  targetSelectionMethod: "manual",
  requiresLineOfSight: true,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 24 },
  actionPoints: 2,
  components: ["verbal", "somatic"],
  classResource: { type: "malediction", cost: 5 },
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
  debuffConfig: {
  debuffType: "statPenalty",
  effects: [
   { id : "field_misfortune_debuff",
   name: "Sundered Stance",
   description: "Enemies have -3 to all attack rolls and -3 to DR while in the zone.",
   mechanicsText: "-3 attack rolls, -3 DR.",
   },
  ],
   statPenalties: [
    { stat: "attack_rolls", magnitude: -3, magnitudeType: "flat" },
   ],
  durationType: "rounds",
  durationValue: 5,
  durationUnit: "rounds",
  canBeDispelled: false,
  },
  damageConfig: {
  formula: "3d6",
  damageTypes: ["wyrd"],
  hasDotEffect: true,
  dotConfig: {
   dotFormula: "3d6",
   duration: 5,
   tickFrequency: "turn",
   isProgressiveDot: false,
  },
  resolution: "DICE",
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 5,
  durationUnit: "rounds",
  concentrationRequired: true,
  },
  resolution: "DICE",
  tags: ["area", "debuff", "damage", "hazard", "omen"],
 
  triggerConfig: {
    triggers: [
      { id: "augur_field_of_misfortune_fate_cost", name: "Fate's Toll", triggerType: "on_cast", action: "Spends 5 malediction to bend fate." }
    ]
  },
  somaticText: "Press two fingers to your brow and draw the pattern of what will be.",
  verbalText: "Whisper the reading aloud so the world is bound to it.",
},

 { id : "augur_hierophants_domain",
  name: "Blinding Cathedral of Radiance",
  description:
  "You raise a colossal temple of ember bone splinters. The air burns with golden light, providing absolute shelter for your allies. Their wounds seal, their skin hardens, and all fear is instantly incinerated.",
  level: 5,
  spellType: "ACTION",
  icon: "Healing/Prayer",
  effectTypes: ["healing", "buff"],
  typeConfig: {
  school: "ember",
  icon: "Healing/Prayer",
  tags: ["area", "healing", "buff", "sanctuary", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 60,
  areaConfig: { areaType: "circle", areaSize: 30, areaSizeUnit: "ft" },
  targetRestrictions: ["allies"],
  maxTargets: 10,
  targetSelectionMethod: "manual",
  requiresLineOfSight: true,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 24 },
  actionPoints: 2,
  components: ["verbal", "somatic"],
  classResource: { type: "benediction", cost: 5 },
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
  healingConfig: {
  formula: "4d6",
  healingType: "zone",
  hasHotEffect: true,
  hotFormula: "2d6",
  hotDuration: 5,
  hotTickType: "turn",
  resolution: "DICE",
  },
  buffConfig: {
  buffType: "custom",
  effects: [
   { id : "hierophants_domain_buff",
   name: "Sanctuary of Grace",
   description: "Allies have +3 to all saving throws and gain resistance to wyrd damage.",
   mechanicsText: "+3 all saving throws, wyrd resistance.",
   statModifier: {
    stat: "all_saves",
    magnitude: 3,
    magnitudeType: "flat",
   },
   },
  ],
  durationType: "rounds",
  durationValue: 5,
  durationUnit: "rounds",
  canBeDispelled: false,
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 5,
  durationUnit: "rounds",
  concentrationRequired: true,
  },
  resolution: "DICE",
  tags: ["area", "healing", "buff", "sanctuary", "omen"],
 
  triggerConfig: {
    triggers: [
      { id: "augur_hierophants_domain_fate_cost", name: "Fate's Toll", triggerType: "on_cast", action: "Spends 5 benediction to bend fate." }
    ]
  },
  somaticText: "Snap your wrist to release the gathered omen as a lance of fated heat.",
  verbalText: "Utter the decree that condemns the target to its foretold end.",
},

 // ============================================================
 // LEVEL 6 SPELLS (3)
 // ============================================================

 { id : "augur_omen_shatter",
  name: "Fate-Shattering Portent",
  description:
  "You violently detonate the active omens clinging to your targets. Jagged shards of ember bone and wyrd agony burst outward from their skin, shredding nearby tissue and leaving them bleeding.",
  level: 6,
  spellType: "ACTION",
  icon: "Necrotic/Bone Shards",
  effectTypes: ["damage"],
  typeConfig: {
  school: "wyrd",
  secondaryElement: "ember",
  icon: "Necrotic/Bone Shards",
  tags: ["damage", "aoe", "detonate", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 60,
  areaConfig: { areaType: "sphere", areaSize: 20, areaSizeUnit: "ft" },
  targetRestrictions: ["enemies"],
  maxTargets: 15,
  targetSelectionMethod: "manual",
  requiresLineOfSight: true,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 25 },
  actionPoints: 2,
  components: ["verbal", "somatic"],
  classResource: [
   { type: "benediction", cost: 3 },
   { type: "malediction", cost: 3 },
  ],
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
  damageConfig: {
  formula: "5d8",
  damageTypes: ["wyrd", "ember"],
  resolution: "DICE",
  },
  resolution: "DICE",
  tags: ["damage", "aoe", "detonate", "omen"],
 

  somaticText: "Snap your wrist to release the gathered omen as a lance of fated heat.",
  verbalText: "Utter the decree that condemns the target to its foretold end.",
},

 { id : "augur_curse_of_the_unlucky",
  name: "Doom of the Miscreant",
  description:
  "You cast a horrific curse that binds a target's destiny to immediate misery. Every time they make a d20 roll, odd results are interpreted as natural 1s, causing catastrophic failures and shattering their bones.",
  level: 6,
  spellType: "ACTION",
  icon: "Necrotic/Necrotic Death",
  effectTypes: ["debuff"],
  typeConfig: {
  school: "wyrd",
  icon: "Necrotic/Necrotic Death",
  tags: ["debuff", "curse", "unlucky", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 45,
  targetRestrictions: ["enemies"],
  maxTargets: 1,
  requiresLineOfSight: true,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 28 },
  actionPoints: 2,
  components: ["verbal", "somatic"],
  classResource: { type: "malediction", cost: 6 },
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   { id : "unlucky_curse_debuff",
   name: "Crushing Misfortune",
   description: "All odd d20 rolls count as natural 1s. Target stumbles on every action.",
   mechanicsText: "Odd rolls count as natural 1s.",
   },
  ],
  savingThrow: {
   ability: "spirit",
   difficultyClass: 16,
   saveOutcome: "negates",
  },
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  canBeDispelled: true,
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  },
  resolution: "DICE",
  tags: ["debuff", "curse", "unlucky", "omen"],
 
  triggerConfig: {
    triggers: [
      { id: "augur_curse_of_the_unlucky_fate_cost", name: "Fate's Toll", triggerType: "on_cast", action: "Spends 6 malediction to bend fate." }
    ]
  },
  somaticText: "Press two fingers to your brow and draw the pattern of what will be.",
  verbalText: "Whisper the reading aloud so the world is bound to it.",
},

 { id : "augur_crown_of_radiance",
  name: "Crown of Thorns and Glory",
  description:
  "You crown an ally in a ring of blinding, sharp radiant thorns. The crown bleeds their temples but elevates their soul, providing legendary combat fortune and +3 to all immediate rolls.",
  level: 6,
  spellType: "ACTION",
  icon: "Radiant/Golden Ring",
  effectTypes: ["buff"],
  typeConfig: {
  school: "ember",
  icon: "Radiant/Golden Ring",
  tags: ["buff", "support", "elevate", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 30,
  targetRestrictions: ["allies"],
  maxTargets: 1,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 26 },
  actionPoints: 1,
  components: ["verbal", "somatic"],
  classResource: { type: "benediction", cost: 6 },
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
  buffConfig: {
  buffType: "custom",
  effects: [
   { id : "crown_radiance_buff",
   name: "Crown of Glory",
   description: "Grants +3 to all d20 rolls, and resistance to all damage types.",
   mechanicsText: "+3 to all rolls, all-damage resistance.",
   statModifier: {
    stat: "all_rolls",
    magnitude: 3,
    magnitudeType: "flat",
   },
   },
  ],
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  canBeDispelled: true,
  },
  resolution: "AUTOMATIC",
  tags: ["buff", "support", "elevate", "omen"],
 
  triggerConfig: {
    triggers: [
      { id: "augur_crown_of_radiance_fate_cost", name: "Fate's Toll", triggerType: "on_cast", action: "Spends 6 benediction to bend fate." }
    ]
  },
  somaticText: "Snap your wrist to release the gathered omen as a lance of fated heat.",
  verbalText: "Utter the decree that condemns the target to its foretold end.",
},

 // ============================================================
 // LEVEL 7 SPELLS (3)
 // ============================================================

 { id : "augur_reality_of_omens",
  name: "Splitting of the Veil",
  description:
  "You split reality down the center. On one side, allies are bolstered by protective, golden fate. On the other, enemies have their planar anchors torn away, suffering catastrophic vulnerability.",
  level: 7,
  spellType: "ACTION",
  icon: "Arcane/Portal Archway",
  effectTypes: ["buff", "debuff"],
  typeConfig: {
  school: "wyrd",
  secondaryElement: "ember",
  icon: "Arcane/Portal Archway",
  tags: ["area", "buff", "debuff", "split", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "self_centered",
  rangeDistance: 0,
  areaConfig: { areaType: "sphere", areaSize: 45, areaSizeUnit: "ft" },
  targetRestrictions: ["any"],
  maxTargets: 30,
  targetSelectionMethod: "auto",
  requiresLineOfSight: false,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 35 },
  actionPoints: 2,
  components: ["verbal", "somatic"],
  classResource: [
   { type: "benediction", cost: 4 },
   { type: "malediction", cost: 4 },
  ],
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
  buffConfig: {
  buffType: "custom",
  effects: [
   { id : "reality_allies_buff",
   name: "Fated Step",
   description: "Allies have +2 to all d20 rolls and +2 DR.",
   mechanicsText: "+2 all rolls, +2 DR.",
   statModifier: {
    stat: "all_rolls",
    magnitude: 2,
    magnitudeType: "flat",
   },
   },
  ],
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  canBeDispelled: false,
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   { id : "reality_enemies_debuff",
   name: "Riven Reality",
   description: "Enemies have -2 to all d20 rolls and +50% vulnerability to all damage types.",
   mechanicsText: "-2 all rolls, +50% all damage vulnerability.",
   statusEffect: {
    vulnerabilityType: "all",
    vulnerabilityPercent: 50,
   },
   },
  ],
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  concentrationRequired: true,
  },
  resolution: "AUTOMATIC",
  tags: ["area", "buff", "debuff", "split", "omen"],
 

  somaticText: "Snap your wrist to release the gathered omen as a lance of fated heat.",
  verbalText: "Utter the decree that condemns the target to its foretold end.",
},

 { id : "augur_apocalypse_portent",
  name: "Dirge of the Unmade",
  description:
  "You chant a horrifying, blackened dirge. The sky turns the color of congealed blood as a massive wave of wyrd agony crushes your enemies, shattering their mental armor and leaving them paralyzed.",
  level: 7,
  spellType: "ACTION",
  icon: "Psychic/Agonizing Scream",
  effectTypes: ["damage", "debuff"],
  typeConfig: {
  school: "wyrd",
  icon: "Psychic/Agonizing Scream",
  tags: ["damage", "debuff", "apocalypse", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 60,
  areaConfig: { areaType: "sphere", areaSize: 30, areaSizeUnit: "ft" },
  targetRestrictions: ["enemies"],
  maxTargets: 20,
  targetSelectionMethod: "manual",
  requiresLineOfSight: true,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 38 },
  actionPoints: 2,
  components: ["verbal", "somatic"],
  classResource: { type: "malediction", cost: 7 },
  },
  cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
  damageConfig: {
  formula: "6d8",
  damageTypes: ["wyrd"],
  resolution: "DICE",
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   { id : "apocalypse_debuff_paralyze",
   name: "Mind Shatter",
   description: "Enemies are Paralyzed for 1 round by overwhelming trauma.",
   mechanicsText: "Paralyzed state.",
   },
  ],
  savingThrow: {
   ability: "spirit",
   difficultyClass: 17,
   saveOutcome: "negates",
  },
  durationType: "rounds",
  durationValue: 1,
  durationUnit: "rounds",
  },
  resolution: "DICE",
  tags: ["damage", "debuff", "apocalypse", "omen"],
 
  triggerConfig: {
    triggers: [
      { id: "augur_apocalypse_portent_fate_cost", name: "Fate's Toll", triggerType: "on_cast", action: "Spends 7 malediction to bend fate." }
    ]
  },
  somaticText: "Press two fingers to your brow and draw the pattern of what will be.",
  verbalText: "Whisper the reading aloud so the world is bound to it.",
},

 { id : "augur_divine_sanctuary",
  name: "Hallowed Altar of Grace",
  description:
  "You summon a colossal altar of crimson energy and golden splinters. The altar forms an absolute sanctuary: allies within are immune to all damage, while enemies are violently repelled by the searing light.",
  level: 7,
  spellType: "ACTION",
  icon: "Radiant/Radiant Light Burst",
  effectTypes: ["buff", "utility"],
  typeConfig: {
  school: "ember",
  icon: "Radiant/Radiant Light Burst",
  tags: ["area", "buff", "sanctuary", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "self_centered",
  rangeDistance: 0,
  areaConfig: { areaType: "circle", areaSize: 20, areaSizeUnit: "ft" },
  targetRestrictions: ["any"],
  maxTargets: 15,
  targetSelectionMethod: "auto",
  requiresLineOfSight: false,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 40 },
  actionPoints: 2,
  components: ["verbal", "somatic"],
  classResource: { type: "benediction", cost: 8 },
  },
  cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
  buffConfig: {
  buffType: "custom",
  effects: [
   { id : "divine_sanctuary_buff",
   name: "Unstoppable Altar",
   description: "Allies are immune to all damage and conditions while within the sanctuary.",
   mechanicsText: "Damage and condition immunity.",
   },
  ],
  durationType: "rounds",
  durationValue: 2,
  durationUnit: "rounds",
  canBeDispelled: false,
  },
  utilityConfig: {
  utilityType: "special",
  selectedEffects: [
   { id : "divine_sanctuary_repel",
   name: "Searing Repulsion",
   description: "Enemies are pushed 30 feet away from the sanctuary boundary (no save).",
   mechanicsText: "Pushes enemies 30ft away.",
   },
  ],
  power: "supreme",
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 2,
  durationUnit: "rounds",
  concentrationRequired: true,
  },
  resolution: "AUTOMATIC",
  tags: ["area", "buff", "sanctuary", "omen"],
 
  triggerConfig: {
    triggers: [
      { id: "augur_divine_sanctuary_fate_cost", name: "Fate's Toll", triggerType: "on_cast", action: "Spends 8 benediction to bend fate." }
    ]
  },
  somaticText: "Snap your wrist to release the gathered omen as a lance of fated heat.",
  verbalText: "Utter the decree that condemns the target to its foretold end.",
},

 // ============================================================
 // LEVEL 8 SPELLS (3)
 // ============================================================

 { id : "augur_twist_of_fate",
  name: "Rending Fate Tear",
  description:
  "You reach out with ethereal, bloody talons and tear the thread of a target's destiny. You force an immediate d20 reroll, modifying the final result by up to 5 points by draining your own marrow.",
  level: 8,
  spellType: "REACTION",
  icon: "Arcane/Spiral Vortex",
  effectTypes: ["utility"],
  typeConfig: {
  school: "wyrd",
  icon: "Arcane/Spiral Vortex",
  tags: ["reaction", "manipulation", "fate", "omen"],
  castTime: 1,
  castTimeType: "REACTION",
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 60,
  targetRestrictions: ["any"],
  maxTargets: 1,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 30 },
  actionPoints: 0,
  components: ["verbal"],
  classResource: [
   { type: "benediction", cost: 4 },
   { type: "malediction", cost: 4 },
  ],
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
  utilityConfig: {
  utilityType: "special",
  selectedEffects: [
   { id : "fate_tear_reroll",
   name: "Weighted Reroll",
   description:
    "Force any creature within 60ft to reroll a d20. You may add or subtract up to 5 to the final result.",
   mechanicsText: "Forces d20 reroll, modify result by �5.",
   },
  ],
  power: "supreme",
  },
  resolution: "AUTOMATIC",
  tags: ["reaction", "manipulation", "fate", "omen"],
 

  somaticText: "Press two fingers to your brow and draw the pattern of what will be.",
  verbalText: "Whisper the reading aloud so the world is bound to it.",
},

 { id : "augur_omen_of_death",
  name: "Entropic Harbinger Sign",
  description:
  "You mark a target's forehead with a wet, black sigil of absolute ending. The sign calls the carrion crows; if the target rolls an odd number on any d20, they suffer catastrophic bone failure, collapsing to 0 HP instantly.",
  level: 8,
  spellType: "ACTION",
  icon: "Necrotic/Death Mark",
  effectTypes: ["debuff"],
  typeConfig: {
  school: "blight",
  icon: "Necrotic/Death Mark",
  tags: ["debuff", "curse", "execute", "crows", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 45,
  targetRestrictions: ["enemies"],
  maxTargets: 1,
  requiresLineOfSight: true,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 42 },
  actionPoints: 2,
  components: ["verbal", "somatic"],
  classResource: { type: "malediction", cost: 8 },
  },
  cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   { id : "carrion_sign_death",
   name: "Entropic Omen Sign",
   description:
    "If the target rolls an odd number on any d20 (attack, save, or check), they are instantly reduced to 0 HP (Constitution save DC 18 reduces this to 10d10 blight damage).",
   mechanicsText: "Odd d20 rolls trigger instant 0 HP or 10d10 blight.",
   },
  ],
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  canBeDispelled: false,
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  },
  resolution: "DICE",
  tags: ["debuff", "curse", "execute", "crows", "omen"],
 
  triggerConfig: {
    triggers: [
      { id: "augur_omen_of_death_fate_cost", name: "Fate's Toll", triggerType: "on_cast", action: "Spends 8 malediction to bend fate." }
    ]
  },
  somaticText: "Carve a slow circle in the air, letting the rot of prophecy take root.",
  verbalText: "Chant the names of the doomed until the curse lands.",
},

 { id : "augur_cosmic_aurora",
  name: "Searing Doom Aurora",
  description:
  "You flood the battlefield in a blinding, searing sky-fire of tragic ember light. The aurora bleeds the eyes of all who gaze upon it: allies have their flesh hardened, while enemies are charred to black ash.",
  level: 8,
  spellType: "ACTION",
  icon: "Radiant/Radiant Sunburst",
  effectTypes: ["healing", "damage", "buff"],
  typeConfig: {
  school: "ember",
  icon: "Radiant/Radiant Sunburst",
  tags: ["area", "healing", "damage", "aurora", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "self_centered",
  rangeDistance: 0,
  areaConfig: { areaType: "sphere", areaSize: 60, areaSizeUnit: "ft" },
  targetRestrictions: ["any"],
  maxTargets: 30,
  targetSelectionMethod: "auto",
  requiresLineOfSight: false,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 45 },
  actionPoints: 2,
  components: ["verbal", "somatic"],
  classResource: { type: "benediction", cost: 8 },
  },
  cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
  healingConfig: {
  formula: "5d8",
  healingType: "zone",
  resolution: "DICE",
  },
  damageConfig: {
  formula: "5d8",
  damageTypes: ["ember"],
  resolution: "DICE",
  },
  buffConfig: {
  buffType: "custom",
  effects: [
   { id : "aurora_allies_buff",
    name: "Sky-Clad Form",
    description: "Allies gain +3 DR and immunity to wyrd damage for the duration.",
    mechanicsText: "+3 DR, wyrd immunity.",
    },
  ],
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  canBeDispelled: false,
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  concentrationRequired: true,
  },
  resolution: "DICE",
  tags: ["area", "healing", "damage", "aurora", "omen"],
 
  triggerConfig: {
    triggers: [
      { id: "augur_cosmic_aurora_fate_cost", name: "Fate's Toll", triggerType: "on_cast", action: "Spends 8 benediction to bend fate." }
    ]
  },
  somaticText: "Snap your wrist to release the gathered omen as a lance of fated heat.",
  verbalText: "Utter the decree that condemns the target to its foretold end.",
},

 // ============================================================
 // LEVEL 9 SPELLS (3)
 // ============================================================

 { id : "augur_the_signs_speak",
  name: "The Omen Whispers",
  description:
  "You plunge your mind fully into the screaming network of spilt blood. The whispers of gore become a roaring torrent: for one round, you dictate the exact outcome of every d20 roll within 60 feet.",
  level: 9,
  spellType: "ACTION",
  icon: "Psychic/Psionic Boom",
  effectTypes: ["buff", "utility"],
  typeConfig: {
  school: "wyrd",
  icon: "Psychic/Psionic Boom",
  tags: ["buff", "manipulation", "fate", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "self",
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 50 },
  actionPoints: 3,
  components: ["verbal", "somatic"],
  classResource: [
   { type: "benediction", cost: 6 },
   { type: "malediction", cost: 6 },
  ],
  },
  cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
  buffConfig: {
  buffType: "custom",
  effects: [
   { id : "gore_whispers_buff",
   name: "Dictate Fate",
   description:
    "You choose the exact d20 roll results for all actions within 60 feet for 1 round. All rolls automatically succeed or fail as you command.",
   mechanicsText: "Choose d20 outcomes for 1 round.",
   },
  ],
  durationType: "rounds",
  durationValue: 1,
  durationUnit: "rounds",
  canBeDispelled: false,
  },
  utilityConfig: {
  utilityType: "special",
  selectedEffects: [
   { id : "gore_whispers_fate",
   name: "Sovereign Decree",
   description: "Dictate all d20 results in 60 feet for 1 round.",
   },
  ],
  power: "supreme",
  },
  resolution: "AUTOMATIC",
  tags: ["buff", "manipulation", "fate", "omen"],
 

  somaticText: "Press two fingers to your brow and draw the pattern of what will be.",
  verbalText: "Whisper the reading aloud so the world is bound to it.",
},

 { id : "augur_cataclysm_portent",
  name: "Wounded World Portent",
  description:
  "You declare a portent of absolute seismic collapse. The ground rips open, spraying molten wyrd fire. Enemies are crushed under collapsing mud, stunned, and marked with catastrophic rot.",
  level: 9,
  spellType: "ACTION",
  icon: "Void/Red Energy Burst",
  effectTypes: ["damage", "debuff"],
  typeConfig: {
  school: "wyrd",
  icon: "Void/Red Energy Burst",
  tags: ["damage", "debuff", "stun", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 60,
  areaConfig: { areaType: "circle", areaSize: 40, areaSizeUnit: "ft" },
  targetRestrictions: ["enemies"],
  maxTargets: 25,
  targetSelectionMethod: "manual",
  requiresLineOfSight: true,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 55 },
  actionPoints: 3,
  components: ["verbal", "somatic"],
  classResource: { type: "malediction", cost: 10 },
  },
  cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
  damageConfig: {
  formula: "8d8",
  damageTypes: ["wyrd"],
  resolution: "DICE",
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   { id : "cataclysm_portent_debuff",
   name: "Cataclysmic Shock",
   description: "Enemies are Stunned for 2 rounds by absolute shock, and suffer -3 to Spirit saving throws.",
   mechanicsText: "Stunned state, -3 Spirit saves.",
   },
  ],
  savingThrow: {
   ability: "constitution",
   difficultyClass: 18,
   saveOutcome: "half_damage_no_stun",
  },
  durationType: "rounds",
  durationValue: 2,
  durationUnit: "rounds",
  },
  resolution: "DICE",
  tags: ["damage", "debuff", "stun", "omen"],
 
  triggerConfig: {
    triggers: [
      { id: "augur_cataclysm_portent_fate_cost", name: "Fate's Toll", triggerType: "on_cast", action: "Spends 10 malediction to bend fate." }
    ]
  },
  somaticText: "Press two fingers to your brow and draw the pattern of what will be.",
  verbalText: "Whisper the reading aloud so the world is bound to it.",
},

 { id : "augur_eternal_benediction",
  name: "Unending Immortality Rite",
  description:
  "You perform the ultimate sacrificial rite of grace. You permanently blind your left eye, but raise a blinding, golden canopy of absolute preservation. Allies are immortal, completely immune to death and injury.",
  level: 9,
  spellType: "ACTION",
  icon: "Healing/Ressusitate",
  effectTypes: ["buff", "healing"],
  typeConfig: {
  school: "ember",
  icon: "Healing/Ressusitate",
  tags: ["area", "buff", "healing", "immortality", "omen"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "self_centered",
  rangeDistance: 0,
  areaConfig: { areaType: "circle", areaSize: 45, areaSizeUnit: "ft" },
  targetRestrictions: ["allies"],
  maxTargets: 15,
  targetSelectionMethod: "auto",
  requiresLineOfSight: false,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 55 },
  actionPoints: 3,
  components: ["verbal", "somatic"],
  classResource: { type: "benediction", cost: 10 },
  },
  cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
  buffConfig: {
  buffType: "custom",
  effects: [
   { id : "immortality_rite_buff",
   name: "Unending Grace",
   description:
    "Allies are immune to damage, conditions, and cannot drop below 1 HP. Searing light immediately heals any wound.",
   mechanicsText: "Damage/condition immunity, HP cannot fall below 1.",
   },
  ],
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  canBeDispelled: false,
  },
  healingConfig: {
  formula: "8d8",
  healingType: "zone",
  resolution: "DICE",
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  concentrationRequired: true,
  },
  resolution: "AUTOMATIC",
  tags: ["area", "buff", "healing", "immortality", "omen"],
 
  triggerConfig: {
    triggers: [
      { id: "augur_eternal_benediction_fate_cost", name: "Fate's Toll", triggerType: "on_cast", action: "Spends 10 benediction to bend fate." }
    ]
  },
  somaticText: "Snap your wrist to release the gathered omen as a lance of fated heat.",
  verbalText: "Utter the decree that condemns the target to its foretold end.",
},

 // ============================================================
 // LEVEL 10 SPELLS (3)
 // ============================================================

 { id : "augur_master_of_omens",
  name: "Sovereign Haruspex Transformation",
  description:
  "You ascend as the absolute sovereign of blood and fate. Your skin hardens into an ivory armor of bones, your veins glow with blinding gold. You control all numbers: you write the dice, you rewrite the marrow, you decide who lives.",
  level: 10,
  spellType: "ACTION",
  icon: "Arcane/Portal Archway",
  effectTypes: ["buff", "utility"],
  typeConfig: {
  school: "ember",
  secondaryElement: "wyrd",
  icon: "Arcane/Portal Archway",
  tags: ["ultimate", "transformation", "fate", "sovereign", "omen"],
  castTime: 1,
  castTimeType: "RITUAL",
  },
  targetingConfig: {
  targetingType: "self",
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 60 },
  actionPoints: 3,
  components: ["verbal", "somatic"],
  classResource: [
   { type: "benediction", cost: 10 },
   { type: "malediction", cost: 10 },
  ],
  },
  cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
  buffConfig: {
  buffType: "custom",
  effects: [
   { id : "master_of_omens",
   name: "Sovereign Haruspex",
   description:
    "You control all omens. Declare d20 Even/Odd before any roll. Spend 1 resource to change any result by �1. All allies gain +2 to all rolls, all enemies suffer -2 to all rolls.",
   mechanicsText: "Declare d20 outcomes, modify rolls by �1, allies +2, enemies -2.",
   },
  ],
  durationValue: 10,
  durationType: "rounds",
  durationUnit: "rounds",
  concentrationRequired: true,
  canBeDispelled: false,
  },
  utilityConfig: {
  utilityType: "special",
  selectedEffects: [
   { id : "master_of_omens_utility",
   name: "Omnipotent Reading",
   description: "Declare d20 Even/Odd outcomes before rolls. Spend Benediction/Malediction to modify rolls.",
   mechanicsText: "Modify rolls by �1 per resource spent.",
   },
  ],
  power: "supreme",
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 10,
  durationUnit: "rounds",
  concentrationRequired: true,
  },
  resolution: "AUTOMATIC",
  tags: ["ultimate", "transformation", "fate", "sovereign", "omen"],
 
  triggerConfig: {
    triggers: [
      { id: "augur_master_of_omens_fate_cost", name: "Fate's Toll", triggerType: "on_cast", action: "Spends 0 fate to bend fate." }
    ]
  },
  somaticText: "Snap your wrist to release the gathered omen as a lance of fated heat.",
  verbalText: "Utter the decree that condemns the target to its foretold end.",
},

 { id : "augur_harbinger_supreme",
  name: "Harbinger of the Black Ash",
  description:
  "You dissolve your mortal frame, becoming a walking storm of decaying black ash and screaming wyrd horror. Every enemy who looks upon you staggers as their skin turns to soot, their femur bones cracking under fated weight.",
  level: 10,
  spellType: "ACTION",
  icon: "Void/Black Hole",
  effectTypes: ["debuff", "damage"],
  typeConfig: {
  school: "wyrd",
  icon: "Void/Black Hole",
  tags: ["ultimate", "transformation", "ash", "debuff", "omen"],
  castTime: 1,
  castTimeType: "RITUAL",
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "self_centered",
  rangeDistance: 0,
  areaConfig: { areaType: "sphere", areaSize: 90, areaSizeUnit: "ft" },
  targetRestrictions: ["enemies"],
  maxTargets: 30,
  targetSelectionMethod: "auto",
  requiresLineOfSight: false,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 60 },
  actionPoints: 3,
  components: ["verbal", "somatic"],
  classResource: { type: "malediction", cost: 15 },
  },
  cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   { id : "harbinger_supreme_debuff",
   name: "Screaming Ash",
   description: "Enemies have -3 to all d20 rolls, and you can force one reroll of an enemy success per round.",
   mechanicsText: "-3 to all rolls for enemies. Force one success reroll per round.",
   },
  ],
  durationType: "rounds",
  durationValue: 10,
  durationUnit: "rounds",
  },
  damageConfig: {
  formula: "3d8",
  damageTypes: ["wyrd"],
  hasDotEffect: true,
  dotConfig: {
   dotFormula: "3d8",
   duration: 10,
   tickFrequency: "turn",
   isProgressiveDot: false,
  },
  resolution: "DICE",
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 10,
  durationUnit: "rounds",
  concentrationRequired: true,
  },
  resolution: "AUTOMATIC",
  tags: ["ultimate", "transformation", "ash", "debuff", "omen"],
 
  triggerConfig: {
    triggers: [
      { id: "augur_harbinger_supreme_fate_cost", name: "Fate's Toll", triggerType: "on_cast", action: "Spends 15 malediction to bend fate." }
    ]
  },
  somaticText: "Press two fingers to your brow and draw the pattern of what will be.",
  verbalText: "Whisper the reading aloud so the world is bound to it.",
},

 { id : "augur_hierophant_supreme",
  name: "Hierophant of Blinding Radiance",
  description:
  "You burn away your humanity, transforming into an towering cathedral of blinding, white-hot radiant splinters. The battlefield is consecrated in a sea of golden light: allies are absolute, healed, and blessed with legendary fortune.",
  level: 10,
  spellType: "ACTION",
  icon: "Radiant/Radiant Sunburst",
  effectTypes: ["buff", "healing", "damage"],
  typeConfig: {
  school: "ember",
  icon: "Radiant/Radiant Sunburst",
  tags: ["ultimate", "transformation", "splinters", "buff", "omen"],
  castTime: 1,
  castTimeType: "RITUAL",
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "self_centered",
  rangeDistance: 0,
  areaConfig: { areaType: "sphere", areaSize: 120, areaSizeUnit: "ft" },
  targetRestrictions: ["any"],
  maxTargets: 30,
  targetSelectionMethod: "auto",
  requiresLineOfSight: false,
  },
  resourceCost: {
  resourceTypes: ["mana"],
  resourceValues: { mana: 60 },
  actionPoints: 3,
  components: ["verbal", "somatic"],
  classResource: { type: "benediction", cost: 15 },
  },
  cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
  buffConfig: {
  buffType: "custom",
  effects: [
   { id : "hierophant_supreme_buff",
   name: "Unending Splendor",
   description:
    "Allies gain +3 to all d20 rolls, absolute resistance to all damage types, and immunity to frightened/charmed. Grant one free reroll on a failed roll per round.",
   statModifier: {
    stat: "all_rolls",
    magnitude: 3,
    magnitudeType: "flat",
   },
   mechanicsText: "+3 all rolls, all damage resistance, immune to frightened/charmed. Grant one reroll per round.",
   },
  ],
  durationValue: 10,
  durationType: "rounds",
  durationUnit: "rounds",
  concentrationRequired: true,
  canBeDispelled: false,
  },
  healingConfig: {
  formula: "4d8",
  healingType: "zone",
  hasHotEffect: true,
  hotFormula: "4d8",
  hotDuration: 10,
  hotTickType: "turn",
  resolution: "DICE",
  },
  damageConfig: {
  formula: "4d8",
  damageTypes: ["ember"],
  hasDotEffect: true,
  dotConfig: {
   dotFormula: "4d8",
   duration: 10,
   tickFrequency: "turn",
   isProgressiveDot: false,
  },
  resolution: "DICE",
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 10,
  durationUnit: "rounds",
  concentrationRequired: true,
  },
  resolution: "AUTOMATIC",
  tags: ["ultimate", "transformation", "splinters", "buff", "omen"],
 
  triggerConfig: {
    triggers: [
      { id: "augur_hierophant_supreme_fate_cost", name: "Fate's Toll", triggerType: "on_cast", action: "Spends 15 benediction to bend fate." }
    ]
  },
  somaticText: "Snap your wrist to release the gathered omen as a lance of fated heat.",
  verbalText: "Utter the decree that condemns the target to its foretold end.",
},

  {
  "id": "augur_whisper_harvester",
  "name": "Whisper of the Harvester",
  "description": "Stare intensely at a recently deceased beast or humanoid, reading the fading thermal residues of their final steps. Through sheer mental focus, trace a glowing copper-colored line on the ground mapping where their companions fled.",
  "level": 1,
  "spellType": "ACTION",
  "icon": "Necrotic/Ritual",
  "typeConfig": {
   "school": "wyrd",
   "icon": "Necrotic/Ritual",
   "tags": [
   "utility",
   "roleplay",
   "augur"
   ],
   "castTime": 1,
   "castTimeType": "IMMEDIATE"
  },
  "targetingConfig": {
   "targetingType": "single",
   "rangeType": "ranged",
   "rangeDistance": 10,
   "targetRestrictions": []
  },
  "resourceCost": {
   "actionPoints": 1,
   "resourceTypes": [
   "mana"
   ],
   "resourceValues": {
   "mana": 3
   },
   "components": [
   "verbal",
   "somatic"
   ],
   "verbalText": "Sicut vestigium apparet...",
   "somaticText": "Trace your finger through the damp soil near the target, ignoring the copper smell of rot"
  },
  "resolution": "NONE",
  "effectTypes": [
   "utility"
  ],
  "utilityConfig": {
   "utilityType": "perception",
   "selectedEffects": [
   {
    "id": "whisper_harvester_effect",
    "name": "Thermal Trace",
    "description": "Reveals a glowing trail showing the route taken by up to three of the deceased target's companions within the last hour."
   }
   ],
   "duration": 10,
   "durationUnit": "minutes",
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
   "augur"
  ]
  ,

  somaticText: "Press two fingers to your brow and draw the pattern of what will be.",
  verbalText: "Whisper the reading aloud so the world is bound to it.",
},
 // ===== NON-COMBAT / HARUSPEX DIVINATION (the omen-reader identity) =====
 { id : "augur_cast_the_bones",
  name: "Cast the Bones",
  description: "Scatter rune-scored bone fragments and read the pattern they fall in. Ask one specific question about a near-future event (within one day) and receive a truthful omen: yes, no, ill, or favorable � plus a single cryptic image of what the bones see coming. Out of combat.",
  level: 1,
  spellType: "ACTION",
  icon: "Psychic/Focused Mind",
  effectTypes: ["utility"],
  typeConfig: { school: "wyrd", icon: "Psychic/Focused Mind", tags: ["utility","divination","social","augur"], castTime: 1, castTimeType: "IMMEDIATE" },
  targetingConfig: { targetingType: "self", rangeType: "self" },
  resourceCost: { components: ["somatic"], actionPoints: 1, mana: 4, classResource: { type: "benediction", cost: 1 } },
  cooldownConfig: { cooldownType: "short_rest", cooldownValue: 1 },
  utilityConfig: { utilityType: "divination", selectedEffects: [ { id : "cast_bones_omen", name: "Bone Omen", description: "One yes/no/ill/favorable answer to a near-future (within 1 day) question, plus a single cryptic image. The bones answer the likeliest probability, not destiny � and they are terse.", mechanicsText: "1 near-future yes/no + a cryptic image." } ], power: "minor" },
  resolution: "NONE",
  tags: ["utility","divination","social","augur"],

  somaticText: "Cast the bone-set on bare ground; the scatter is the sentence.",
  verbalText: "The question, once � the bones answer what is asked, not what is meant.",
 },
 { id : "augur_read_the_entrails",
  name: "Read the Entrails",
  description: "Open a fresh kill or fresh corpse and read its steaming viscera. Learn what killed it, what it feared last, what it carried or ate recently, and whether greater danger lies in the direction it came from. Requires a fresh corpse; without one you pay the Blood Price (1d6 slashing + Bleed) to use your own. Out of combat.",
  level: 1,
  spellType: "ACTION",
  icon: "Necrotic/Necrotic Wither",
  effectTypes: ["utility"],
  typeConfig: { school: "wyrd", icon: "Necrotic/Necrotic Wither", tags: ["utility","divination","investigation","exploration","augur"], castTime: 1, castTimeType: "IMMEDIATE" },
  targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 0 },
  resourceCost: { components: ["verbal","somatic"], actionPoints: 1, mana: 5, classResource: { type: "malediction", cost: 1 } },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
  utilityConfig: { utilityType: "divination", selectedEffects: [ { id : "entrails_read", name: "Visceral Reading", description: "From a fresh corpse learn: cause of death, its last fear, recent stomach/contents, and whether greater danger lies back along its trail. No fresh corpse: pay 1d6 slashing + Bleed to read your own viscera for a lesser reading.", mechanicsText: "Read a fresh corpse's last moments + danger on its trail." } ], power: "minor" },
  resolution: "NONE",
  tags: ["utility","divination","investigation","exploration","augur"],

  somaticText: "Hook the blade beneath the ribs and let the heat speak before it cools.",
  verbalText: "A low, droning tone � the entrails will not read themselves in silence.",
 },
 { id : "augur_smoke_sign",
  name: "Smoke-Sign Reading",
  description: "Burn a token of the thing you seek � a lock of hair, a scrap of its clothing, a written name � and read the curl and drift of the smoke. It streams toward the target's current location and grows thick when close, thin when far, letting you track a person, place, or object across any distance for the duration. Out of combat.",
  level: 2,
  spellType: "ACTION",
  icon: "Nature/Wind Gust",
  effectTypes: ["utility"],
  typeConfig: { school: "wyrd", icon: "Nature/Wind Gust", tags: ["utility","divination","tracking","exploration","augur"], castTime: 1, castTimeType: "IMMEDIATE" },
  targetingConfig: { targetingType: "self", rangeType: "self" },
  resourceCost: { components: ["verbal","somatic"], actionPoints: 1, mana: 7, classResource: { type: "benediction", cost: 2 } },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
  utilityConfig: { utilityType: "tracking", selectedEffects: [ { id : "smoke_sign_trail", name: "Smoke Trail", description: "For 1 hour the smoke from a burned token of the target streams toward its current location � thickening as you near, thinning as you move away. Works across any distance; defeated by wards that block divination, not by distance.", mechanicsText: "Track one person/place/object by smoke for 1 hour." } ], duration: 1, durationUnit: "hours", power: "moderate" },
  resolution: "NONE",
  tags: ["utility","divination","tracking","exploration","augur"],

  somaticText: "Feed the token to the flame and watch which way the ash leans.",
  verbalText: "Name the quarry in the old counting-tongue; the smoke listens.",
 },
 { id : "augur_omen_of_the_threshold",
  name: "Omen of the Threshold",
  description: "Before a door, a pass, or a chosen path, slit your palm and read the immediate future of crossing. You glimpse the next minute of what will happen if you proceed � ambushers, traps, who waits beyond, the first blow struck. Visions fade past sixty seconds. Out of combat.",
  level: 2,
  spellType: "ACTION",
  icon: "Arcane/Spiral Vortex",
  effectTypes: ["utility"],
  typeConfig: { school: "wyrd", icon: "Arcane/Spiral Vortex", tags: ["utility","divination","exploration","augur"], castTime: 1, castTimeType: "IMMEDIATE" },
  targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 0 },
  resourceCost: { components: ["verbal","somatic"], actionPoints: 1, mana: 8, classResource: { type: "benediction", cost: 2 } },
  cooldownConfig: { cooldownType: "short_rest", cooldownValue: 1 },
  utilityConfig: { utilityType: "divination", selectedEffects: [ { id : "threshold_glimpse", name: "Sixty-Second Glimpse", description: "Glimpse the next 60 seconds of what occurs if you cross the threshold now � threats, waiting foes, the first attack. Shows the likeliest immediate future only; changes if you delay or alter approach.", mechanicsText: "Preview next 60 seconds past a threshold." } ], power: "moderate" },
  resolution: "NONE",
  tags: ["utility","divination","exploration","augur"],

  somaticText: "Press a bleeding palm to the doorframe and breathe until the room ahead bleeds into view.",
  verbalText: "A counted whisper � one, two, three � the future arrives on the third.",
 },
 { id : "augur_doomseers_mark",
  name: "Doom-Seer's Mark",
  description: "Study a creature within sight and read the omens written on its body � the way it holds its weight, the fate-lines in its skin. Learn its single greatest near-future fear or vulnerability, and sense whether it intends you betrayal within the next hour. Out of combat.",
  level: 3,
  spellType: "ACTION",
  icon: "Psychic/Focused Mind",
  effectTypes: ["utility"],
  typeConfig: { school: "wyrd", icon: "Psychic/Focused Mind", tags: ["utility","divination","social","investigation","augur"], castTime: 1, castTimeType: "IMMEDIATE" },
  targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 30 },
  resourceCost: { components: ["verbal","somatic"], actionPoints: 1, mana: 8, classResource: { type: "malediction", cost: 2 } },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
  utilityConfig: { utilityType: "social", selectedEffects: [ { id : "doomseers_read", name: "Read the Marked", description: "Learn one creature's greatest near-future fear/vulnerability and whether it intends you betrayal within the hour. Surface omens only � not deep secrets or long plans.", mechanicsText: "Read one creature's top fear + betrayal intent." } ], power: "moderate" },
  resolution: "NONE",
  tags: ["utility","divination","social","investigation","augur"],

  somaticText: "Lidless stare at the target until the fate-lines surface on their skin.",
  verbalText: "Silence � the reading is done with the eyes, not the mouth.",
 },
 ],


 spellPools: {
 1: [
  "augur_read_the_signs",
  "augur_omen_shield",
  "augur_minor_portent",
  "augur_sign_of_clarity",
  "augur_omen_bolt",
  "augur_whisper_harvester",
  "augur_cast_the_bones",
  "augur_read_the_entrails",
 ],
 2: [
  "augur_portent_of_weakness",
  "augur_terrain_of_ruin",
  "augur_sign_of_protection",
  "augur_smoke_sign",
  "augur_omen_of_the_threshold",
 ],
 3: [
  "augur_omen_bolt",
  "augur_harbinger_gaze",
  "augur_sacred_ground",
  "augur_doomseers_mark",
 ],
 4: [
  "augur_grand_malediction",
  "augur_balanced_sign",
  "augur_hierophants_ward",
 ],
 5: [
  "augur_omen_storm",
  "augur_field_of_misfortune",
  "augur_hierophants_domain",
 ],
 6: [
  "augur_omen_shatter",
  "augur_curse_of_the_unlucky",
  "augur_crown_of_radiance",
 ],
 7: [
  "augur_reality_of_omens",
  "augur_apocalypse_portent",
  "augur_divine_sanctuary",
 ],
 8: [
  "augur_twist_of_fate",
  "augur_omen_of_death",
  "augur_cosmic_aurora",
 ],
 9: [
  "augur_the_signs_speak",
  "augur_cataclysm_portent",
  "augur_eternal_benediction",
 ],
 10: [
  "augur_master_of_omens",
  "augur_harbinger_supreme",
  "augur_hierophant_supreme",
 ],
 },
};
