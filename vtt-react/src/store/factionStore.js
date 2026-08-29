import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStorageConfig } from '../utils/storageUtils';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured, auth } from '../config/firebase';



const SEEDED_FACTIONS = [

 {

  id: 'house-thalreth',

  name: 'House Thalreth',

  type: 'noble_house',

  regionId: 'frostwood-reach',

  icon: '/assets/icons/factions/thalreth.png',

  colors: { primary: '#4a3728', secondary: '#8b7355' },

  publicGoal: 'Protect the Frostwood Reach and maintain the ironwood timber trade',

  publicDescription:

   'The ancient ruling family of the Frostwood Reach, seated at Greymark Keep. House Thalreth traded the region\'s spatial clarity for an insulating fog that shields their timber keeps from the killing freeze. Their descendants maintain exhaustive ledger-libraries to verify their own lineages before the fog eats what they remember.',

  hiddenAgenda:

   'Preserve their bloodline\'s memories before the encroaching fog erases them entirely — the Fog Compact is slowly consuming their descendants\' identities, and the family is racing against its own bargain.',

  hiddenDescription:

   'The fog that protects the Reach does not merely obscure — it erases. Every generation of Thalreth loses more of their ancestral memories. The current Lord can no longer recall his own mother\'s face. The ledger-libraries aren\'t just bureaucracy — they are the family\'s last thread connecting them to who they were.',

  leader: {

   npcId: 'kaelen-thalreth',

   title: 'Jarl-Archivist',

   description:

    'Jarl-Archivist Kaelen Thalreth ("The Quill-Lord"), who has recently seized de facto control of the house due to his father Lord Aldren\'s advanced memory-fog, ruthlessly enforcing the Sovereign Ledger.'

  },

  members: [

   { npcId: 'kaelen-thalreth', role: 'Jarl-Archivist (De Facto Leader)', locationId: 'greymark-keep' },

   { npcId: 'aldren-thalreth', role: 'Lord (De Jure Elder)', locationId: 'greymark-keep' },

   { npcId: 'elara-thalreth', role: 'Keeper of the High Hearth', locationId: 'greymark-keep' },

   { npcId: 'caedren-thalreth', role: 'Master Scribe', locationId: 'scribes-tower' }

  ],

  headquarters: 'greymark-keep',

  territory: ['greymark-keep', 'scribes-tower', 'the-shallows', 'mistbarrow', 'greythorn-copse', 'mirror-mere', 'skalds-landing'],

  relationships: [

   {

    targetFactionId: 'scribe-sentinels',

    type: 'allied',

    description: 'The Sentinels serve as Thalreth\'s archivists — their quills keep the ledgers that preserve the House\'s thinning memory'

   },

   {

    targetFactionId: 'house-skalvyr',

    type: 'rival',

    description: 'Northern trade disputes over timber routes; Skalvyr covets the Reach\'s ironwood for their fjord-keeps'

   },

   {

    targetFactionId: 'trueborn-florae',

    type: 'hostile',

    description: 'The Florae reject the Fog Compact entirely, seeing it as spiritual surrender — they raid timber caravans and burn ledger-shrines'

   },

  ],

  classAffinities: ['animist', 'warden', 'martyr'],

  lore:

   'House Thalreth was the first of the seven families to bargain during the Slow Cracks. While others sacrificed heirs or territory, Thalreth traded something more insidious: clarity itself. The resulting fog keeps their forests alive but slowly consumes the memories of anyone born under its canopy.',

  secrets:

   'The current Lord has forgotten the location of a critical ledger — the one that records the exact terms of the Fog Compact. Without it, no one knows when the fog\'s price will be paid in full.',

  quests: []

 },



 {

  id: 'scribe-sentinels',

  name: 'Scribe Sentinels Guild',

  type: 'guild',

  regionId: 'frostwood-reach',

  icon: '/assets/icons/factions/scribe-sentinels.png',

  colors: { primary: '#2d2d2d', secondary: '#d4af37' },

  publicGoal: 'Maintain the archives, maps, and genealogies that preserve knowledge against the fog',

  publicDescription:

   'An ancient guild of master archivists, cartographers, and memory keepers. Scribe Sentinels spend their lives in silent shifts, copying records onto heavy vellum to preserve the collective memory of the Reach.',

  hiddenAgenda:

   'Senior archivists have begun selectively editing the ledgers to remove inconvenient truths and protect House Thalreth interests.',

  hiddenDescription:

   'The fog doesn\'t just eat memory —  it makes memory malleable. A small cadre of elder Sentinels discovered they could rewrite the past by simply changing what the ledgers say. Since no one remembers the original events, no one can contradict them.',

  leader: {

   npcId: 'caedren-thalreth',

   title: 'Master Scribe',

   description:

    'Caedren Thalreth, second son of the Lord. He knows about the edits. He authorized many of them. He tells himself it\'s for the good of the Reach.'

  },

  members: [

   { npcId: 'caedren-thalreth', role: 'Master Scribe', locationId: 'scribes-tower' },

   { npcId: 'vellan-archivist', role: 'Senior Archivist', locationId: 'scribes-tower' }

  ],

  headquarters: 'scribes-tower',

  territory: ['scribes-tower', 'ledger-halls', 'mistbarrow', 'the-shifting-fen'],

  relationships: [

   {

    targetFactionId: 'house-thalreth',

    type: 'allied',

    description: 'Officially neutral archivists, unofficially House Thalreth\'s most essential servants — their quills literally define Thalreth\'s reality'

   },

   {

    targetFactionId: 'house-ordavan',

    type: 'neutral',

    description: 'Share a mutual respect for record-keeping; exchange maps and genealogies along trade routes'

   },

   {

    targetFactionId: 'house-skalvyr',

    type: 'allied',

    description: 'The Sentinels maintain the glacier-wall genealogies that validate Skalvyr bloodline claims'

   },

   {

    targetFactionId: 'trueborn-florae',

    type: 'hostile',

    description: 'The Florae reject the Sentinels\' ledger-keeping entirely: every Sentinel patrol is an intrusion on hallowed ground'

   },

   {

    targetFactionId: 'house-morrath',

    type: 'overlord',

    description: 'The Sentinels maintain the legal archives that prove the Morrath line exists: without their records, the seventh seat would be declared vacant'

   }

  ],

  classAffinities: ['animist', 'augur'],

   lore:

   'Founded the same year as the Fog Compact by Thalreth family members who volunteered to have their memories erased before taking their vows, ensuring their objectivity. This tradition continues: every new Sentinel surrenders their past. Formally appointed at Greymark Keep, the Sentinels\' authority grew as the fog consumed more of the Reach. The Great Revision — the ongoing conspiracy of systematic ledger-editing — was begun by senior Sentinels long ago and has since grown beyond their control.',

  secrets:

   'The edits to the ledgers have grown more aggressive. Entire family lines have been erased. At least three noble houses that "never existed" were actually written out by Sentinel quills.',

  quests: []

 },



 {

  id: 'house-skalvyr',

  name: 'House Skalvyr',

  type: 'noble_house',

  regionId: 'nordhalla',

  icon: '/assets/icons/factions/skalvyr.png',

  colors: { primary: '#1a3a5c', secondary: '#7ec8e3' },

  publicGoal: 'Rule Nordhalla\'s fjord-keeps and maintain the geothermal sumps that keep the glaciers at bay',

  publicDescription:

   'The unyielding northern lords of Nordhalla. When titanic glaciers advanced to grind their mountain keeps into dust, House Skalvyr struck a bargain within Aethil\'s framework to freeze the ice sheets in place permanently. Summer never returned to the north, and the Skalvyr have ruled the frozen fjords ever since, valuing cold-resistance and bloodline purity above all.',

  hiddenAgenda:

   'House Skalvyr is secretly negotiating with renegade Solari pyrofiends to weaponize geothermal heat as a last-resort power source — a dangerous alliance that could draw Keth-Amar\'s attention if the volatile energy signatures are detected.',

  hiddenDescription:

   'The geothermal sumps are failing. Volcanic vents that have burned for centuries are cooling. Skalvyr engineers project total freeze within three generations. Desperate, the house\'s younger generation has made clandestine contact with outcast pyrofiends who claim volcanic fury can be harnessed at a cost the elders refuse to discuss.',

  leader: {

   npcId: 'halvar-skalvyr',

   title: 'King-Jarl of Nordhalla',

   description:

    'King-Jarl Halvar Skalvyr (Jarn-Tand), who consolidated his rule by force, constructed the Sunder-Wall to tax nomads, and governs Nordhalla with an iron grip.'

  },

  members: [

   { npcId: 'halvar-skalvyr', role: 'King-Jarl', locationId: 'fjord-gate' },

   { npcId: 'sigurd-skalvyr', role: 'Jarl of the Archive (Custodian)', locationId: 'frozen-archive' },

   { npcId: 'frigga-skalvyr', role: 'Geothermal Negotiator', locationId: 'frozen-archive' }

  ],

  headquarters: 'frozen-archive',

  territory: ['frozen-archive', 'fjord-gate', 'rimors-hearth', 'vargtor', 'skadis-col', 'bloodhammer-sump', 'vesperas-perch'],

  relationships: [

   {

    targetFactionId: 'house-thalreth',

    type: 'rival',

    description: 'Covet the Reach\'s ironwood for construction — the Skalvyr offer nothing in return but cold disdain'

   },

   {

    targetFactionId: 'scribe-sentinels',

    type: 'allied',

    description: 'The Sentinels maintain the glacier-wall genealogies that validate Skalvyr bloodline claims'

   },

   {

    targetFactionId: 'house-tesshan',

    type: 'rival',

    description: 'Disputed territory along the Cragjaw-Nordhalla border. Both houses claim the geothermal vents.'

   }

  ],

  classAffinities: ['minstrel', 'harbinger', 'warden'],

  lore:

   'Skalvyr\'s bargain was the harshest of all seven houses. Where others traded memory or heirs, Skalvyr traded summer itself, condemning their entire region to eternal winter in exchange for survival. Every Skalvyr child is taught this: their comfort is built on the suffering of every living thing in Nordhalla. House Skalvyr struck the Glacier Bargain generations ago, trading summer forever to halt the grinding ice. The Hunger Winter (in the years leading to the Devouring). when ancestors consumed their dead: seeded the Hunger Pact in Skald blood. The house has ruled Nordhalla\'s frozen fjords for nearly four centuries.',

  secrets:

   'The geothermal negotiations have already produced results. A prototype heat-engine powered by volatile Emberspire obsidian exists in a sealed chamber beneath the Frozen Archive. It works. It also hums with a resonance that disturbs the glacier-preserved dead whenever it runs.',

  quests: []

 },





 {

  id: 'trueborn-florae',

  name: 'The Trueborn Florae',

  type: 'tribal',

  regionId: 'frostwood-reach',

  icon: '/assets/icons/factions/florae.png',

  colors: { primary: '#2d5a1e', secondary: '#8b4513' },

  publicGoal: 'Live free of the Fog Compact — reject the bargains that traded nature for survival',

  publicDescription:

   'The Florae are the indigenous people of the Frostwood Reach who refused House Thalreth\'s Fog Compact. They live deep in the untouched ironwood groves, following the old ways — hunting, gathering, and maintaining a spiritual connection to the forest that predates the noble houses. They have no written language, no ledgers, and no memory-loss.',

  hiddenAgenda:

   'The Florae\'s shamans have discovered a way to reverse the Fog Compact. It requires burning the original contract — which is stored in the Ledger Halls. They are planning a raid.',

  hiddenDescription:

   'The Florae shamans call the fog "Thalreth\'s Lie." They have spent generations studying its nature and believe it is not a permanent condition — it is a spell sustained by the Compact\'s original text. The text is a living document, and it feeds on the memories the fog consumes. Destroy the text, and the fog starves.',

  leader: {

   npcId: 'thorn-speaker',

   title: 'Thorn-Speaker',

   description:

    'The current Thorn-Speaker, whose birth name was surrendered to the forest. She speaks for the ironwoods, and the ironwoods speak through her — literally. Her voice carries the creak of ancient timber.'

  },

  members: [

   { npcId: 'thorn-speaker', role: 'Thorn-Speaker', locationId: 'ironwood-heart' }

  ],

  headquarters: 'ironwood-heart',

  territory: ['ironwood-heart', 'bramble-heath', 'greythorn-copse'],

  relationships: [

   {

    targetFactionId: 'house-thalreth',

    type: 'hostile',

    description: 'The Florae see Thalreth as spiritual traitors who sold the forest\'s soul for protection from the cold'

   },

   {

    targetFactionId: 'scribe-sentinels',

    type: 'hostile',

    description: 'The Sentinels patrol the mists that the Florae consider sacred — every patrol is an intrusion on hallowed ground'

   }

  ],

  classAffinities: ['animist', 'apex', 'warden'],

  lore:

   'Florae children are not named at birth. They earn their names through a rite called the Thorn-Walk, where they enter the deepest ironwood grove alone and do not return until the forest gives them a name — or until three days pass, whichever comes first. Those who return nameless are cast out.',

  secrets:

   'The Thorn-Speaker knows exactly where the original Fog Compact text is stored. She has memorized the patrol routes of the Scribe-Sentinels. The raid will happen on the next moonless night.',

  quests: []

 },



 {

  id: 'unlit-veil',

  name: 'The Unlit Veil',

  type: 'secret_society',

  regionId: 'sundrift-vale',

  icon: '/assets/icons/factions/astril.png',

  colors: { primary: '#2a1a3a', secondary: '#8b6bae' },

  publicGoal: 'Facilitate information exchange, provide navigation services, and maintain communication across the steppe trade routes',

  publicDescription:

   'To most, the Unlit Veil are reliable information brokers and steppe guides — expensive but worth it. They control the message-routes through the Sundrift Vale, operate listening posts at every mound-camp, and offer "memory consultation" to settlements that can afford it.',

  hiddenAgenda:

   'The Unlit Veil are Astril who have learned to smother their Lumian glow until their skin runs dark, and they have built a continent-spanning intelligence network on that singular advantage. Their goal is not conquest but indispensability: a world where no deal closes, no secret stays buried, and no ruler makes a decision without their whispered counsel. Behind this, they work to dismantle the Synod\'s authority from within, erasing the distinction between Earthen Astril and Stellar Astril by making both irrelevant.',

  hiddenDescription:

   'The Veil\'s true power is the lie. Every Unlit broker is a trained observer. Every listening post is an intelligence hub. Every consultation contract includes a clause allowing the Veil to "review" the client\'s records. They know who is starving, who is hoarding, who is plotting, and who is vulnerable — and they sell this knowledge to the highest bidder, or withhold it from the lowest, as strategy demands.',

  leader: {

   npcId: 'the-first-liar',

   title: 'The First Liar',

   description:

    'No one knows the First Liar\'s real name or whether they are one Unlit or many sharing a title. Their orders arrive as memory-crystal fragments delivered by Unlit couriers who genuinely do not know what message they carry. The instructions are precise, impersonal, and structured in perfect iambic meter — a signature no forger has ever replicated.'

  },

  members: [

   { npcId: 'the-first-liar', role: 'Leader', locationId: 'synod-hold' }

  ],

  headquarters: 'synod-hold',

  territory: ['synod-hold', 'merrowport', 'ironjaw-port', 'the-unlit-knoll', 'starfall-vale', 'novas-heath', 'root-veil-scriptorium', 'the-sunken-spire'],

  relationships: [

   {

    targetFactionId: 'house-ordavan',

    type: 'puppet_master',

    description: 'House Ordavan believes they control the steppe trade. Every Ordavan trade minister has an Unlit Veil "advisor" who actually writes the policy.'

   },

   {

    targetFactionId: 'house-mereval',

    type: 'neutral',

    description: 'Uneasy maritime truce — the Veil needs Mereval\'s ships; Mereval needs Veil intelligence. Neither trusts the other.'

   },

   {

    targetFactionId: 'house-morrath',

    type: 'rival',

    description: 'The Veil\'s intelligence network periodically uncovers Morrath debts the Neth would rather keep buried: a pressure game that cuts both ways'

   }

  ],

  classAffinities: ['gambit', 'toxicologist', 'shaper'],

   lore:

   'The Unlit Veil was founded by an Astril who realized that smothering the Lumian glow until the skin ran dark was not surrender but a weapon. Where other Astril blazed their every conviction across their skin for the steppe to read, the Veil learned to go cold and unreadable, leaving no resonance-trace on their markings when they deceived. Named for the Unlit Knoll where they hold their judgments, within a generation the Veil had stopped trading in goods entirely and shifted to trading in secrets.',

  secrets:

   'The First Liar is not one operative. It is a rotating council of seven, each of whom believes they are the only First Liar. None of them know the others exist. The memory-crystals deliver contradictory orders, and whichever order is fulfilled first becomes "the First Liar\'s true intent."',

  quests: []

 },



 {

  id: 'house-ordavan',

  name: 'House Ordavan',

  type: 'noble_house',

  regionId: 'sundrift-vale',

  icon: '/assets/icons/factions/ordavan.png',

  colors: { primary: '#8b6914', secondary: '#d4c5a0' },

  publicGoal: 'Govern the Sundrift Vale, maintain the eternal migration of the woolly herds, and steward the starless grasslands',

  publicDescription:

   'House Ordavan traded fertile soil for the endless migration, ensuring the steppe\'s grass always returns to feed the great woolly herds — but nothing deeper than grass can take root. Their nomadic clans follow the herds along routes mapped by ancestral burial mounds that hum with the last recorded songs of the dead.',

  hiddenAgenda:

   'House Ordavan has lost control of their own trade policy to the Unlit Veil, who have installed "advisors" at every level of Ordavan governance. The house maintains the appearance of sovereignty while their decisions are increasingly made by the Veil.',

  hiddenDescription: '',

  leader: {

   npcId: 'bayarmaa-ordavan',

   title: 'Khatun',

   description: 'The previous Steppe-Lord, Loras Ordavan, was an Unlit Veil puppet who presided over the house\'s decline for decades. Khatun Bayarmaa Ordavan (\'The Steel-Voiced\') deposed him and reclaimed the house\'s authority, though the Unlit Veil\'s embedded advisors still hold key trade-policy positions.'

  },

  members: [

   { npcId: 'bayarmaa-ordavan', role: 'Khatun', locationId: 'synod-hold' },

   { npcId: 'loras-ordavan', role: 'Deposed Steppe-Lord', locationId: 'synod-hold' }

  ],

  headquarters: 'synod-hold',

  territory: ['synod-hold', 'kumis-downs', 'ancestor-mounds', 'the-long-steppe', 'mound-camps'],

  relationships: [

   {

    targetFactionId: 'unlit-veil',

    type: 'puppet',

    description: 'The Unlit Veil control Ordavan trade policy through embedded advisors — the house is a figurehead'

   },

   {

    targetFactionId: 'scribe-sentinels',

    type: 'neutral',

    description: 'Exchange maps and genealogies along trade routes, though the Sentinels increasingly view Ordavan as unreliable'

   }

  ],

  classAffinities: ['augur', 'false_prophet', 'gambit'],

  lore:

   'Ordavan\'s ancestral mounds are more than monuments —  they are acoustic chambers. Each mound was constructed to capture and preserve the voice-print of a single ancestor. On the anniversary of a death, the mound "sings" —  a playback of the last words the ancestor spoke. Some families gather at their mounds to hear the same final words, year after year, for generations.',

  secrets:

   'At least three of the ancestral mounds have fallen silent in the past decade. No one knows why. The Steppe-Lord has forbidden investigation, which means he either knows the cause or fears it.',

  quests: []

 },

 {
  id: 'dawn-vigil',
  name: 'The Dawn Vigil Order',
  type: 'religious_order',
  regionId: 'sundale',
  icon: '/assets/icons/factions/dawn-vigil.png',
  colors: { primary: '#d4a030', secondary: '#1a1a2e' },
  publicGoal: 'Expeditionary companies range into every region seeking Monolith fragments. Their sigil is a rising sun pierced by obsidian.',
  publicDescription:
   'The Dawn Vigil is the most militant of the Solari restoration factions, a holy fighting order that believes the Sundered Monoliths can be reassembled to restart Sol. Their expeditionary companies operate across all seven regions, recovering Monolith fragments by any means necessary.',
  hiddenAgenda:
   'The Vigil inner council has calculated that reassembling the Monoliths will summon Keth Amar back to finish the meal. They continue expeditions to draw the Sun Eater down deliberately and bind the predator.',
  leader: {
   npcId: 'dawn-vigil-commander',
   title: 'First Dawn',
   description: 'The identity of the First Dawn is a Vigil secret. In truth, the First Dawn has been dead for eighty years; the basalt tablets are sent by an Augur executing death vision orders.'
  },
  members: [
   { npcId: 'dawn-vigil-commander', role: 'First Dawn (Commander)', locationId: 'emberspire-caldera' },
   { npcId: 'sol-kaessen', role: 'High Priestess of the Risen (Vigil Liaison)', locationId: 'harath-vault' }
  ],
  headquarters: 'emberspire-caldera',
  territory: ['emberspire-caldera', 'basalt-shyr', 'cinder-badlands', 'sols-anvil-mesa', 'ember-lagoon'],
  relationships: [
   { targetFactionId: 'house-solvan', type: 'allied', description: 'The Vigil is the Solvan house sword arm: officially deniable, unofficially essential.' },
   { targetFactionId: 'deep-alchemists', type: 'rival', description: 'The Alchemists Wyrd experimentation threatens to wake what the Vigil is trying to keep asleep.' }
  ],
  classAffinities: ['martyr', 'pyrofiend', 'augur'],
  lore: 'The Vigil was founded generations ago by a Martyr who absorbed suffering across the continent. Militarized under Hierophant Aethelgard following the False Dawn Riots, their deepest secret is that reassembling the Seven Sundered Monoliths summons Keth Amar.',
  secrets: 'The First Dawn has been dead for eighty years. The basalt tablets are sent by an Augur executing death vision orders.',
  quests: []
 },

 {
  id: 'deep-alchemists',
  name: 'Deep Alchemists Guild',
  type: 'guild',
  regionId: 'cragjaw-peaks',
  icon: '/assets/icons/factions/deep-alchemists.png',
  colors: { primary: '#2d4a1e', secondary: '#8b6914' },
  publicGoal: 'Advance the science of alchemical transformation through any means necessary',
  publicDescription:
   'The Deep Alchemists are a clandestine guild of methodical experimenters who treat living tissue as raw material. Operating from sealed vat laboratories beneath Frostmaw Crag, they continue ancient research begun before the sun was buried.',
  hiddenAgenda:
   'The Alchemists believe the Wyrd itself can be distilled and injected to create life that transcends organic and Wyrd biology.',
  leader: {
   npcId: 'deep-alchemist-prime',
   title: 'Prime Alchemist',
   description: 'The current Prime Alchemist has replaced so much flesh with alchemical grafts that none remember their original form.'
  },
  members: [
   { npcId: 'deep-alchemist-prime', role: 'Prime Alchemist', locationId: 'lost-brood-vats' }
  ],
  headquarters: 'lost-brood-vats',
  territory: ['lost-brood-vats', 'sump-galleries', 'gearworks-gulch'],
  relationships: [
   { targetFactionId: 'vat-breakers-guild', type: 'hostile', description: 'The Groven were their creation. The Groven shattered their vats. Neither has forgiven the other.' },
   { targetFactionId: 'dawn-vigil', type: 'rival', description: 'The Vigil suppression of the Wyrd conflicts with the Alchemists refinement of the same cosmic material.' },
   { targetFactionId: 'house-mereval', type: 'rival', description: 'Mereval ocean mapping expeditions trespass into the Alchemists submerged tunnel networks.' }
  ],
  classAffinities: ['toxicologist', 'plaguebringer', 'shaper'],
  lore: 'The Deep Alchemists predate the Dark Bargains, refining living matter in the deep tunnels before humans discovered fire. Sealed themselves into the deepest tunnels after the Vat Breakers Revolt.',
  secrets: 'Recent Groven expeditions have returned with evidence of fresh alchemical residue, suggesting the Lost Brood is still alive.',
  quests: []
 },

 {
  id: 'vat-breakers-guild',
  name: 'Vat Breakers Guild',
  type: 'guild',
  regionId: 'cragjaw-peaks',
  icon: '/assets/icons/factions/vat-breakers.png',
  colors: { primary: '#5a3a1e', secondary: '#8b6b4a' },
  publicGoal: 'Protect Groven sovereignty, maintain the Ancestor Spans, and prevent any resumption of Fexric alchemical experimentation',
  publicDescription:
   'The Vat Breakers Guild is the governing body of the Groven, founded by the first generation who shattered their containment vats and rose against the Deep Alchemists. They maintain the Ancestor Spans, adjudicate Groven law, and patrol the lower tunnels.',
  hiddenAgenda:
   'The Guild maintains a secret archive of Fexric alchemical formulae stolen during the revolt that they study in case they ever need to create more Groven.',
  leader: {
   npcId: 'vat-breaker-foreman',
   title: 'First Foreman',
   description: 'The First Foreman is elected by the Council of Spans and serves until calcification advances too far.'
  },
  members: [
   { npcId: 'vat-breaker-foreman', role: 'First Foreman', locationId: 'frostmaw-holdfast' },
   { npcId: 'alaric', role: 'The Bound (Guild Consultant)', locationId: 'frostmaw-holdfast' }
  ],
  headquarters: 'frostmaw-holdfast',
  territory: ['frostmaw-holdfast', 'the-spans', 'ancestor-gaps', 'the-great-gorge', 'stags-rest-moraine', 'deepchasm-keep'],
  relationships: [
   { targetFactionId: 'deep-alchemists', type: 'hostile', description: 'Generations of war, temporarily paused. The Alchemists stay in deep tunnels while Groven patrol the surface.' },
   { targetFactionId: 'house-tesshan', type: 'allied', description: 'The Tesshan depend on the Ancestor Spans for travel above the blizzard line.' }
  ],
  classAffinities: ['warden', 'shaper', 'berserker'],
  lore: 'The first foreman of the Guild was the Groven who shattered the first vat. Her calcified skeleton still stands in the Guild hall in Frostmaw Holdfast, her outstretched hand forming the keystone of the main Ancestor Span.',
  secrets: 'One of the Guild alchemical formulae describes a process for reversing calcification. If it works, it could cure the Groven condition; if it fails, it restarts the war.',
  quests: []
 },

 {
  id: 'house-solvan',
  name: 'House Solvan',
  type: 'noble_house',
  regionId: 'sundale',
  icon: '/assets/icons/factions/solvan.png',
  colors: { primary: '#d4700a', secondary: '#1a1a1a' },
  publicGoal: 'Rule Sundale badlands and refuse to abandon the tomb of their star',
  publicDescription:
   'House Solvan is the most narratively significant of the seven houses: it was Solvan who wielded the knife that flayed Aex to weave the binding seal. Their descendants remain in the scorched, soot-choked badlands, refusing to leave because leaving would mean admitting the sacrifice was meaningless.',
  hiddenAgenda:
   'The current Steward of Emberspire believes one of the original Solvan heirs survived, and is funding expeditions to find the lost heir bloodline.',
  leader: {
   npcId: 'solvan-steward',
   title: 'Steward of Emberspire',
   description: 'The Steward of Emberspire: the Solari refuse to call anyone Lord until the sun returns.'
  },
  members: [
   { npcId: 'solvan-steward', role: 'Steward of Emberspire (Acting Head)', locationId: 'great-forge' }
  ],
  headquarters: 'great-forge',
  territory: ['great-forge', 'basalt-shyr', 'cinder-badlands', 'the-ashen-escarpment', 'vulkars-karst', 'slag-gulch', 'harath-vault'],
  relationships: [
   { targetFactionId: 'dawn-vigil', type: 'allied', description: 'The Vigil is Solvan sword arm, pursuing Monolith fragments that the house cannot officially seek.' },
   { targetFactionId: 'house-tesshan', type: 'neutral', description: 'Tesshan coal iron feeds Solvan forges: a trade relationship neither house can afford to jeopardize.' }
  ],
  classAffinities: ['martyr', 'pyrofiend', 'spellguard'],
  lore: 'Sera Solvan carved her child name into her flesh with volcanic obsidian. The wound glowed rather than healed, making her the first Martyr.',
  secrets: 'The Steward has found records suggesting the lost heir fled to the Sundrift Vale and intermarried with the Ordavan.',
  quests: []
 },

 {
  id: 'order-of-solbrand',
  name: 'The Order of Solbrand Knights',
  type: 'military',
  regionId: 'sundale',
  icon: '/assets/icons/factions/solbrand.png',
  colors: { primary: '#e8c440', secondary: '#1a0a00' },
  publicGoal: 'Guard Emberspire, the Harath Vault, and the approaches to Sundale; hold the line against Wyrd incursions and Monolith-seekers alike',
  publicDescription:
   'The Order of Solbrand is the ancient martial order of Sundale: sun knights who have held the line at Emberspire since the first century of the Freezing Era. They are the disciplined wall between the vault of Aex and the Wyrd that presses against it.',
  hiddenAgenda:
   'The Order inner circle knows the Dawn Vigil intends to reassemble the Monoliths, which will summon Keth Amar. The Solbrand intends to be the wall that stops the Sun Eater when it comes.',
  leader: {
   npcId: 'grandmaster-solbrand',
   title: 'Grandmaster of the Sun',
   description: 'The Grandmaster of the Sun is elected by the Chapter of Ten for a seven-year term, or until death.'
  },
  members: [
   { npcId: 'grandmaster-solbrand', role: 'Grandmaster of the Sun', locationId: 'sun-keep' },
   { npcId: 'solbrand-captain-ashen', role: 'Captain of the Ashen Escarpment', locationId: 'the-ashen-escarpment' },
   { npcId: 'solbrand-captain-vault', role: 'Captain of the Vault Watch', locationId: 'harath-vault' },
   { npcId: 'solbrand-captain-badlands', role: 'Captain of the Badlands Patrol', locationId: 'slag-gulch' }
  ],
  headquarters: 'sun-keep',
  territory: ['sun-keep', 'the-ashen-escarpment', 'harath-vault', 'basalt-shyr', 'cinder-badlands', 'slag-gulch', 'vulkars-karst'],
  relationships: [
   { targetFactionId: 'house-solvan', type: 'allied', description: 'The Order guards the house ancestral duty: the vault and the seal.' },
   { targetFactionId: 'dawn-vigil', type: 'tense_allied', description: 'The Vigil is the Order most capable ally against the Wyrd, but the Order knows the Vigil true purpose.' },
   { targetFactionId: 'covenant-of-the-scar', type: 'allied', description: 'The Martyrs of the Scar complement the Order hold the line doctrine.' },
   { targetFactionId: 'cult-of-forgotten-shadow', type: 'hostile', description: 'The Cult seeks to wake Keth Amar; the Order exists to keep it asleep.' }
  ],
  classAffinities: ['martyr', 'spellguard', 'warden'],
  lore: 'The Order was founded in Year 47 of the Freezing Era by a Solvan captain who watched his entire company burn holding the Emberspire approaches. Four centuries later, the Order still holds the Ashen Escarpment.',
  secrets: 'The Order has quietly acquired three Sundered Monolith fragments to study Keth Amar resonance and prepare a counter ritual.',
  quests: []
  },

  {
  id: 'house-mereval',
  name: 'House Mereval',
  type: 'noble_house',
  regionId: 'iceheart-sea',
  icon: '/assets/icons/factions/mereval.png',
  colors: { primary: '#1a3a5e', secondary: '#5a7a9a' },
  publicGoal: 'Rule the Iceheart Sea, maintain the unfreezing trade lanes, and oversee all maritime commerce between the seven regions',
  publicDescription:
   'House Mereval governs the violent, churning expanse of the Iceheart Sea from Merrowport: a floating city anchored to a warm submarine volcano. Their bargain traded calm waters for navigable sea-lanes that never freeze, dooming the ocean to perpetual storm-cycles.',
  hiddenAgenda:
   'House Mereval has been secretly mapping the deep-ocean trenches beneath the Iceheart, cataloguing what the Myrathil call Mareth: an entity they believe can be bargained with for a second compact.',
   leader: {
    npcId: 'mereval-admiral',
    title: 'Grand Admiral of Merrowport',
    description:     'The Grand Admiral rules from the prow of the Wave-Kept, a ship that has not docked in forty years. In truth, the Admiral has been dead for three years; her first mate impersonates her voice through a Merryn throat-singing technique. The crew knows. No one has said anything.'
   },
   members: [
     { npcId: 'mereval-admiral', role: 'Grand Admiral of Merrowport (Deceased — Impersonated)', locationId: 'merrowport' },
     { npcId: 'mereval-steward', role: 'Steward of Merrowport (De Facto Ruler)', locationId: 'merrowport' }
   ],
   headquarters: 'merrowport',
   territory: ['merrowport', 'gale-storm-shallows', 'first-shore', 'spindrift-lagoon', 'deepwell-archipelago', 'wraithsound', 'the-saltmaw-estuary', 'brinehorse-cove'],
   relationships: [
    { targetFactionId: 'unlit-veil', type: 'neutral', description: 'Uneasy maritime truce: the Veil needs Mereval\'s ships; Mereval needs Veil intelligence' },
   { targetFactionId: 'deep-alchemists', type: 'rival', description: 'Mereval\'s deep-ocean mapping expeditions keep trespassing into the Alchemists\' submerged tunnel-networks: both sides claim the deeps' }
  ],
  classAffinities: ['minstrel', 'gambit', 'warden'],
  lore: 'The Mereval were the first humans to cross the Iceheart Sea, landing at the First Shore in the age before the Star-Fall. Their skeletal archers still stand guard there, frozen in eternal watch.',
  secrets: 'The current Grand Admiral has been dead for three years. The Wave-Kept is being captained by her first mate, who impersonates her voice through a Merryn throat-singing technique. The crew knows. No one has said anything.',
  quests: []
 },

 {
  id: 'house-tesshan',
  name: 'House Tesshan',
  type: 'noble_house',
  regionId: 'cragjaw-peaks',
  icon: '/assets/icons/factions/tesshan.png',
  colors: { primary: '#4a3a5e', secondary: '#8b7aae' },
  publicGoal: 'Rule the Cragjaw Peaks, maintain the highland keeps, and oversee the coal-iron mining operations that fuel the world',
  publicDescription:
   'House Tesshan governs the vertical labyrinth of the Cragjaw Peaks from Frostmaw Holdfast. Their bargain traded visibility for a perpetual blizzard: a snow-veil that hides their fortress-keeps from starving lowland raiders but buries all natural landmarks.',
  hiddenAgenda:
   'The Tesshan high council has been secretly negotiating with a faction of Groven separatists who want to break from the Vat-Breakers\' Guild and establish their own Ancestor-Span authority: directly under Tesshan control.',
  leader: {
   npcId: 'tesshan-lord',
   title: 'Jarl-Tesshan of the Peaks',
   description:     'The Jarl-Tesshan of Tesshan rules from the uppermost gallery of Frostmaw Holdfast, where the blizzard wind is loudest and the altitude sickness keeps visitors brief.'
  },
    members: [
     { npcId: 'tesshan-lord', role: 'Jarl-Tesshan of the Peaks', locationId: 'frostmaw-holdfast' },
     { npcId: 'tesshan-steward', role: 'Steward of Frostmaw (Senior Administrator)', locationId: 'frostmaw-holdfast' }
    ],
   headquarters: 'frostmaw-holdfast',
   territory: ['frostmaw-holdfast', 'sump-galleries', 'iron-ravine', 'frostmaw-massif', 'gearworks-gulch'],
   relationships: [
    { targetFactionId: 'house-skalvyr', type: 'rival', description: 'Disputed territory along the Cragjaw-Nordhalla border. Both houses claim the geothermal vents.' },
   { targetFactionId: 'vat-breakers-guild', type: 'allied', description: 'The Tesshan depend on Groven Ancestor-Spans: the Guild is simultaneously indispensable and increasingly independent' }
  ],
  classAffinities: ['chronarch', 'harbinger', 'warden'],
  lore: 'The perpetual blizzard that hides the Peaks was Tesshan\'s price: visibility for safety. Tesshan children learn to navigate by touch, sound, and the vibration of Ancestor-Spans before they learn to read.',
  secrets: 'The Groven separatists are led by an Ithran elder who claims to have found a way to grow Ancestor-Spans without calcifying the donor. If true, it would give Tesshan a monopoly on bridge-construction and break the Vat-Breakers\' Guild\'s power.',
  quests: []
 },

 {
  id: 'house-morrath',
  name: 'House Morrath',
  type: 'noble_house',
  regionId: 'bryngloom-forest',
  icon: '/assets/icons/factions/morrath.png',
  colors: { primary: '#3a2a4a', secondary: '#7a6a9a' },
  publicGoal: 'Govern the Bryngloom Forest in absentia: their authority is mediated entirely through Neth contract-law',
  publicDescription:
   'House Morrath is the ghost among houses: the replacement seventh house elevated after Viridane fled the Blooding, yet the one with the least surviving record. Unlike the original six: they had nothing left to trade that Keth-Amar would accept, so they borrowed their survival from the Neth rather than striking their own Dark Bargain. The official records list them as the seventh house of the Great Binding, but the truth is subtler — they were installed to fill the gap Viridane left.',
  hiddenAgenda:
   'House Morrath has been functionally extinct for three centuries. The Velun Pact-Lords of Atropolis continue to issue decrees in Morrath\'s name because a void in the seventh seat would legally invalidate the Bargain Compact.',
  leader: {
   npcId: 'morrath-steward',
   title: 'Steward of the Seventh Seat (Velun Appointee)',
   description: 'The current Steward is a Velun Neth who has been "acting" in Morrath\'s name for over three centuries. No Morrath descendant has presented themselves to claim the seat in living memory.'
  },
   members: [
    { npcId: 'morrath-steward', role: 'Steward of the Seventh Seat (Regent)', locationId: 'atropolis' },
    { npcId: 'vel-otharen', role: 'Canopy-Ledger (Morrath Records Keeper)', locationId: 'atropolis' }
   ],
   headquarters: 'atropolis',
   territory: ['atropolis', 'peat-bog-sinks', 'over-shanty', 'morrens-bogpost', 'vel-keth-bayou', 'aran-glen', 'fangmere-grove', 'widows-quagmire', 'black-fen', 'drowned-dingle', 'hunters-gully', 'merryns-drift'],
   relationships: [
    { targetFactionId: 'scribe-sentinels', type: 'vassal', description: 'The Sentinels maintain the legal archives that prove the Morrath line exists: without their records, the seventh seat would be declared vacant' },
   { targetFactionId: 'unlit-veil', type: 'rival', description: 'Morrath descendants still exist among the Drun: unrecognized, unnamed, uncounted' }
  ],
  classAffinities: ['arcanoneer', 'false_prophet', 'plaguebringer'],
  lore: 'The Morrath are mentioned in exactly one clause of the First Contract: a rider specifying that their debt to the Neth is "perpetual until a living Morrath heir presents themselves to renegotiate." No heir has ever come.',
  secrets: 'A Morrath descendant IS alive: a Drun woman who burned her name from the First Contract two centuries ago. She does not know her bloodline. The Velun have been searching for her for eighty years.',
  quests: []
 },

 {
  id: 'house-viridane',
  name: 'House Viridane',
  type: 'noble_house',
  regionId: 'frostwood-reach',
  icon: '/assets/icons/factions/viridane.png',
  colors: { primary: '#2d5a27', secondary: '#8fbc8f' },
  publicGoal: 'Survive. Remember. Wait.',
  publicDescription:
   'The forgotten seventh house: struck from every record by the six houses who sealed Keth-Amar\'s bargain. When the other houses marched their firstborn to the northern peaks as sacrifice, Viridane refused and fled south through the Frostwood Reach, making a counter-bargain with fae entities in the moonlit groves. Their descendants are the Florae.',
  hiddenAgenda:
   'House Viridane does not seek restoration. The original bloodline made peace with being forgotten a century and a half ago. What they seek is the final truth: what spoke to them in the moonlit groves before Keth-Amar\'s whispers could reach them, and whether that presence has a price that is still due.',
  leader: {
   npcId: 'thorn-speaker',
   title: 'Voice of the Ironwood',
   description: 'The Thorn-Speaker is the closest thing Viridane has to a leader: a Florae elder who remembers the oral history of the flight south and speaks for the Trueborn in the deep groves.'
  },
   members: [
    { npcId: 'thorn-speaker', role: 'Voice of the Ironwood (De Facto Leader)', locationId: 'ironwood-heart' }
   ],
   headquarters: 'ironwood-heart',
   territory: ['ironwood-heart', 'frostwood-reach'],
   relationships: [
{ targetFactionId: 'trueborn-florae', type: 'successor', description: 'The Trueborn Florae are the direct descendants of House Viridane: they carry the original fae contract in their blood and thorns' },
    { targetFactionId: 'house-thalreth', type: 'rival', description: 'The Thalreth participated in the erasure of Viridane from every record and still enforce the Sovereign Ledger\'s silence on the original seventh house, now remembered by the folk as the "eighth house" — the wound in human history' }
  ],
  classAffinities: ['lunarch', 'apex'],
  lore: 'House Viridane made a counter-bargain with ancient fae entities in the Frostwood\'s moonlit groves during their flight south generations ago. The Florae still carry this contract in their flesh: their thorns migrate toward unfulfilled promises. The seven houses spent three centuries erasing every trace of Viridane\'s existence. The Florae have been hiding ever since.',
  secrets: 'The original fae contract still exists: a living document grown from thorn-vine and moonlight, buried beneath the oldest Florae grove. It can be read only by a Florae Lunarch during a lunar eclipse. The contract contains a clause that the Florae have never invoked: the fae entities owe House Viridane a debt that has never been collected.',
  quests: []
 },

 {
  id: 'bloodhammer-line',
  name: 'The Bloodhammer Legion',
  type: 'military',
  regionId: 'sundale',
  icon: '/assets/icons/factions/bloodhammer-line.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Keep the Forge of Grum lit and police who may carry the Hunger Pact',
  publicDescription: 'A regimented Berserker legion, keepers of the Forge of Grum in the Harath Vault arenas, who enforce the Skald Council martial decrees against the Pactless Unbound.',
  leader: { npcId: 'hark-ash-hammer', title: 'Blood Priest and Keeper of the First Forge', description: 'Hark Ash Hammer is a scarred, furnace-eyed elder whose hands are permanently blackened from tending the First Forge.' },
  members: [
   { npcId: 'hark-ash-hammer', role: 'Blood Priest and Keeper of the First Forge', locationId: 'harath-vault' }
  ],
  headquarters: 'harath-vault',
  territory: ['harath-vault'],
  relationships: [
   { targetFactionId: 'house-skalvyr', type: 'rival', description: 'The Bloodhammer legion blames Skalvyr hunger wars for the exile that drove their ancestors south to Emberspire.' },
   { targetFactionId: 'house-solvan', type: 'allied', description: 'Both forge cults honor Grum; the legion keeps the Solvan forges lit beneath Emberspire.' }
  ],
  classAffinities: ['berserker'],
  lore: 'Founded by Grum Bloodhammer when he first ignited the Rage. Now fractured along the Unbound schism: Pact sworn elders hunt deep tunnel Berserkers who ignite without ritual.',
  secrets: 'Pact sworn elders know the location of the deep tunnel Unbound settlement and have declined to burn it because three of their own bloodline ignite without the rite.',
  quests: []
 },
 {
  id: 'ancestral-convergence',
  name: 'Ancestral Animists Fellowship',
  type: 'guild',
  regionId: 'nordhalla',
  icon: '/assets/icons/factions/ancestral-convergence.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Hold the three Animist dialects together as they fracture',
  publicDescription: 'The pan-regional guild that fuses the Ordan totemic, Vreken spore, and Skald runic Animist traditions into one unified craft.',
  leader: { npcId: 'sera-three-scars', title: 'Voice of the Ancestral Fellowship', description: 'Sera Three Scars survived the three initiation rites of Ordan, Vreken, and Skald Animism, each leaving a mark on her spirit.' },
  members: [
   { npcId: 'sera-three-scars', role: 'Voice of the Ancestral Fellowship', locationId: 'frozen-archive' }
  ],
  headquarters: 'frozen-archive',
  territory: ['frozen-archive'],
  relationships: [
   { targetFactionId: 'house-ordavan', type: 'allied', description: 'The Ordan totemic root is one of the three traditions the Fellowship binds together.' },
   { targetFactionId: 'cult-of-forgotten-shadow', type: 'hostile', description: 'The cult speaks for the silence the Animists say is devouring the ancestors.' }
  ],
  classAffinities: ['animist'],
  lore: 'Founded when the three tradition carriers met at a crossroads and recognized each other scars. The ancestral language is fracturing and only the Fellowship keeper can still hold all three dialects.',
  secrets: 'The Fellowship keeper has begun hearing a fourth dialect in the silence between the other three, one no ancestor should still be speaking.',
  quests: []
 },
 {
  id: 'canopy-ledger',
  name: 'The Canopy Ledger Guild',
  type: 'guild',
  regionId: 'bryngloom-forest',
  icon: '/assets/icons/factions/canopy-ledger.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Arbitrate the First Contract and keep the Heart Vault clauses valid',
  publicDescription: 'The Arcanoneer guild that arbitrates and enforces contract magic from the Atropolis Heart Vault.',
  leader: { npcId: 'vel-otharen', title: 'Senior Signatory of the Canopy Ledger', description: 'Vel Otharen is a meticulous, parchment-pale Arcanoneer who inherited Valerius seat at the Heart Vault.' },
  members: [
   { npcId: 'vel-otharen', role: 'Senior Signatory of the Canopy Ledger', locationId: 'atropolis' }
  ],
  headquarters: 'atropolis',
  territory: ['atropolis'],
  relationships: [
   { targetFactionId: 'house-morrath', type: 'allied', description: 'The Canopy Ledger arbitrates the Neth contract magic that holds Morrath in being.' },
   { targetFactionId: 'unlit-veil', type: 'rival', description: 'The Veil trades in secrets the Arcanoneers are sworn to file and seal.' }
  ],
  classAffinities: ['arcanoneer'],
  lore: 'Heir to Valerius who drafted the First Contract with Morvane. Now Morvane is rejecting clauses it once accepted and arbitration cannot resolve the Velun Contingency Protocol.',
  secrets: 'The Velun Contingency Protocol contains a clause that would void every Morrath debt at once if a living heir were ever proven, and the Canopy Ledger has buried it on purpose.',
  quests: []
 },
 {
  id: 'frozen-order-of-the-elk',
  name: 'The Frozen Order of the Elk',
  type: 'religious_order',
  regionId: 'nordhalla',
  icon: '/assets/icons/factions/frozen-order-of-the-elk.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Maintain the sacred elk auguries and the ritual calendar',
  publicDescription: 'The venerable Augur order, keepers of Cassia sacred elk rites at the Frozen Archive.',
  leader: { npcId: 'skadi-glass-eye', title: 'Keeper of the Elk Rites', description: 'Skadi Glass Eye replaced her left eye with a frozen elk stone during her initiation to perceive omens.' },
  members: [
   { npcId: 'skadi-glass-eye', role: 'Keeper of the Elk Rites', locationId: 'frozen-archive' }
  ],
  headquarters: 'frozen-archive',
  territory: ['frozen-archive'],
  relationships: [
   { targetFactionId: 'scribe-sentinels', type: 'allied', description: 'The Augurs depend on the Scribe Sentinels Guild to preserve the elk rites against the fog.' },
   { targetFactionId: 'cult-of-forgotten-shadow', type: 'hostile', description: 'The cult readings threaten to replace sacred auguries with silence.' }
  ],
  classAffinities: ['augur'],
  lore: 'Founded by Cassia, who read the First Failing in a sacrificed elk. The accuracy has collapsed from 93% to 41% as temporal friction contaminates the readings.',
  secrets: 'Cassia preserved body weeps frozen tears only when a pulse should have come; the Order has hidden three such weepings since the silence began.',
  quests: []
 },
 {
  id: 'frostmaw-conclave',
  name: 'Frostmaw Chronarchs Guild',
  type: 'guild',
  regionId: 'cragjaw-peaks',
  icon: '/assets/icons/factions/frostmaw-conclave.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Rebuild Nesta time dilation engine before its inventor disappears',
  publicDescription: 'The Chronarch guild at Frostmaw Holdfast, reconstructing the original volcanic glass time engine from recorded schematics.',
  leader: { npcId: 'fex-vestara', title: 'Conclave Prime and Keeper of Schematics', description: 'Fex Vestara is a precise, restless Chronarch whose hands tremble with temporal friction from studying Nesta vanishing.' },
  members: [
   { npcId: 'fex-vestara', role: 'Conclave Prime and Keeper of Schematics', locationId: 'frostmaw-holdfast' }
  ],
  headquarters: 'frostmaw-holdfast',
  territory: ['frostmaw-holdfast'],
  relationships: [
   { targetFactionId: 'vat-breakers-guild', type: 'allied', description: 'The Chronarchs rebuild Nesta engine with Groven calcified stone and spans.' },
   { targetFactionId: 'deep-alchemists', type: 'hostile', description: 'The Alchemists would seize the time engine to refine the Wyrd.' }
  ],
  classAffinities: ['chronarch'],
  lore: 'Heir to Nesta, who hooked a volcanic glass time engine into her chest. Nesta is disappearing from history; if she ceases to exist, temporal friction redistributes to every living Chronarch.',
  secrets: 'The Conclave has a partial recording of Nesta voice from before she vanished, and playing it rewinds whoever listens by several heartbeats.',
  quests: []
 },
 {
  id: 'congregation-of-the-silence',
  name: 'Congregation of the Black Silence',
  type: 'cult',
  regionId: 'sundrift-vale',
  icon: '/assets/icons/factions/congregation-of-the-silence.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Decode and obey the Voice of the Silence',
  publicDescription: 'A sinister False Prophet cult network built around Li Wei broken revelations in the Sundrift Vale.',
  leader: { npcId: 'mor-vereth', title: 'Weaver of the Black Silence', description: 'Mor Vereth is a gaunt, hollow-voiced False Prophet who channels the Voice of the Silence to cells across the Vale.' },
  members: [
   { npcId: 'mor-vereth', role: 'Weaver of the Black Silence', locationId: 'starfall-vale' }
  ],
  headquarters: 'starfall-vale',
  territory: ['starfall-vale'],
  relationships: [
   { targetFactionId: 'cult-of-forgotten-shadow', type: 'allied', description: 'The Congregation receives the same dark silence the cult opened.' },
   { targetFactionId: 'dawn-vigil', type: 'rival', description: 'The Vigil calls the False Prophets heresy and hunts the cult cells.' }
  ],
  classAffinities: ['false_prophet'],
  lore: 'Founded by Li Wei, who peered into the Void where Sol once shone. The Voice now gives instructions toward the Frozen Archive lowest vault to free something ancient.',
  secrets: 'Mor Vereth has received instructions to open the Frozen Archive lowest vault, where something trapped since the Shattering waits to be freed.',
  quests: []
 },
 {
  id: 'merrowport-house',
  name: 'Merrowport Merchant Guild',
  type: 'guild',
  regionId: 'iceheart-sea',
  icon: '/assets/icons/factions/merrowport-house.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Keep maritime commerce solvent across contested storm routes',
  publicDescription: 'The Gambit and maritime guild of Merrowport, navigating the shifting odds of sea commerce and storm voyages.',
  leader: { npcId: 'merr-cael', title: 'Harbor Master and Master of Odds', description: 'Merr Cael is a silver-tongued merchant elder who walks the line between raw luck and binding commercial clause.' },
  members: [
   { npcId: 'merr-cael', role: 'Harbor Master and Master of Odds', locationId: 'merrowport' }
  ],
  headquarters: 'merrowport',
  territory: ['merrowport'],
  relationships: [
   { targetFactionId: 'house-mereval', type: 'allied', description: 'The guild operates under House Mereval maritime charter.' },
   { targetFactionId: 'brine-bond-syndicate', type: 'neutral', description: 'The Syndicate taxes shipping routes, and the Guild pays to preserve dock access.' }
  ],
  classAffinities: ['gambit'],
  lore: 'Heir to Jax and Lyra. Jax walked into the sea; Lyra radicalized and sought to force the universe to choose. The Guild now manages the mercantile balance.',
  secrets: 'The Guild sits on a ledger of marked routes, knowing which voyages are doomed by sea anomalies and profiting from advance knowledge.',
  quests: []
 },
 {
  id: 'doom-choir',
  name: 'The Doom Choir Order',
  type: 'religious_order',
  regionId: 'nordhalla',
  icon: '/assets/icons/factions/doom-choir.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Compute and proclaim the exact arithmetic of the world end',
  publicDescription: 'The solemn Harbinger order at the Frozen Archive, calculating the doom arithmetic of cosmic fissures.',
  leader: { npcId: 'malakor', title: 'Choir Prime of the Doom Arithmetic', description: 'Malakor is a cold, luminous Harbinger who co-founded the Doom Choir after reality cracked.' },
  members: [
   { npcId: 'malakor', role: 'Choir Prime of the Doom Arithmetic', locationId: 'frozen-archive' },
   { npcId: 'valeria-the-grim', role: 'Doom Chanter', locationId: 'frozen-archive' }
  ],
  headquarters: 'frozen-archive',
  territory: ['frozen-archive'],
  relationships: [
   { targetFactionId: 'house-skalvyr', type: 'allied', description: 'The Choir computes doom arithmetic from the Frozen Archive under Skalvyr protection.' },
   { targetFactionId: 'cult-of-forgotten-shadow', type: 'hostile', description: 'The cult would hasten the end the Choir only calculates.' }
  ],
  classAffinities: ['harbinger'],
  lore: 'Co-founded by Xyris and Malakor. Each Chaos Pocket bleeds warmth from the buried star, accelerating the convergence the Choir predicts.',
  secrets: 'Malakor has computed a second date, later than the first, when cosmic tears will stabilize, and he has revealed it to no one.',
  quests: []
 },
 {
  id: 'barbed-vow',
  name: 'The Barbed Vow Regiment',
  type: 'military',
  regionId: 'bryngloom-forest',
  icon: '/assets/icons/factions/barbed-vow.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Hunt the Wyrd corrupted and sever forbidden contracts',
  publicDescription: 'An elite Inquisitor military regiment sworn at the Sunken Spire, baiting Wyrd horrors into physical form where they can be named and eliminated.',
  leader: { npcId: 'vrael-forty-seventh', title: 'Commander of the Barbed Vow', description: 'Vrael the Forty Seventh is a grim inquisitor commander who has survived the deepest grove purges.' },
  members: [
   { npcId: 'vrael-forty-seventh', role: 'Commander of the Barbed Vow', locationId: 'the-sunken-spire' }
  ],
  headquarters: 'the-sunken-spire',
  territory: ['the-sunken-spire'],
  relationships: [
   { targetFactionId: 'scribe-sentinels', type: 'allied', description: 'The Inquisitors share archival intelligence with the Scribe Sentinels Guild.' },
   { targetFactionId: 'cult-of-forgotten-shadow', type: 'hostile', description: 'The cult is the deep grove corruption the Barbed Vow was sworn to cut down.' }
  ],
  classAffinities: ['inquisitor'],
  lore: 'Forged from cold iron Vreken and Thalren arts. Only forty seven elite inquisitors remain in active service.',
  secrets: 'The Inquisitors have catalogued forty seven face stealing entities in the deep bogs that defy conventional counter rites.',
  quests: []
 },
 {
  id: 'lunar-communion',
  name: 'Order of the Lunar Communion',
  type: 'religious_order',
  regionId: 'frostwood-reach',
  icon: '/assets/icons/factions/lunar-communion.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Transcribe lunar revelations and maintain monastic harmony',
  publicDescription: 'A sacred Lunarch order in the Frostwood moonlit groves, tending the stellar celestial binding and keeping the holy lunar rites.',
  leader: { npcId: 'bri-vessela', title: 'Regent of the Lunar Communion', description: 'Bri Vessela is a serene Lunarch whose bones carry a fragment of stellar binding.' },
  members: [
   { npcId: 'bri-vessela', role: 'Regent of the Lunar Communion', locationId: 'ironwood-heart' }
  ],
  headquarters: 'ironwood-heart',
  territory: ['ironwood-heart'],
  relationships: [
   { targetFactionId: 'trueborn-florae', type: 'allied', description: 'The Communion tends the stellar symbionts bound in the groves the Trueborn guard.' },
   { targetFactionId: 'congregation-of-the-silence', type: 'rival', description: 'The False Prophets preach a void the Lunarchs say consumes the fallen star.' }
  ],
  classAffinities: ['lunarch'],
  lore: 'Founded by Selene of House Viridane, who bound a fragment of a dormant star to her lineage. The elders synchronize with lunar phases.',
  secrets: 'The Communion has decoded prophecies indicating a convergence requiring rare astral sacrifice.',
  quests: []
 },
 {
  id: 'florae-groves',
  name: 'The Florae Grove Keepers',
  type: 'tribal',
  regionId: 'frostwood-reach',
  icon: '/assets/icons/factions/florae-groves.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Guard the deepest moonlit groves where ancient nature law holds',
  publicDescription: 'The hidden Florae custodians of the Viridane ancestral groves where primal lunar rites were first bound.',
  leader: { npcId: 'bri-vessela', title: 'Voice of the Moonlit Groves', description: 'Bri Vessela speaks the ancient fae law in the sacred groves.' },
  members: [
   { npcId: 'bri-vessela', role: 'Voice of the Moonlit Groves', locationId: 'ironwood-heart' }
  ],
  headquarters: 'ironwood-heart',
  territory: ['ironwood-heart'],
  relationships: [
   { targetFactionId: 'trueborn-florae', type: 'allied', description: 'The Grove Keepers are custodians of sacred ancient ironwood groves.' },
   { targetFactionId: 'house-thalreth', type: 'hostile', description: 'Thalreth seeks to claim timber territory from the ancient groves.' }
  ],
  classAffinities: ['lunarch'],
  lore: 'The shadow custodians of Viridane heritage, guarding the sacred heartwoods and oral covenants.',
  secrets: 'The Keepers hold the true ancestral name of the lost house, spoken only during high solstice rites.',
  quests: []
 },
 {
  id: 'covenant-of-the-scar',
  name: 'The Covenant of the Scar',
  type: 'religious_order',
  regionId: 'sundale',
  icon: '/assets/icons/factions/covenant-of-the-scar.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Tend the foundational scar and uphold the sacred vow of willing suffering',
  publicDescription: 'A devoted Martyr order beneath Emberspire who take the pain of others into the Devotion to protect the faithful.',
  leader: { npcId: 'sol-kaessen', title: 'Vigil Mother and Keeper of the First Scar', description: 'Sol Kaessen is a weathered Martyr whose arms bear the carved runes of suffering absorbed into the Devotion.' },
  members: [
   { npcId: 'sol-kaessen', role: 'Vigil Mother and Keeper of the First Scar', locationId: 'emberspire-caldera' }
  ],
  headquarters: 'emberspire-caldera',
  territory: ['emberspire-caldera'],
  relationships: [
   { targetFactionId: 'dawn-vigil', type: 'allied', description: 'The Covenant is the spiritual heart of the Solari faithful beneath Emberspire.' },
   { targetFactionId: 'the-sunderers', type: 'hostile', description: 'The Sunderer Cabal seeks to extinguish the sacred flame the Covenant protects.' }
  ],
  classAffinities: ['martyr'],
  lore: 'Founded by Sera Solvan, who bore the first sacrificial brand. The order preserves the sacred alchemy of suffering.',
  secrets: 'Sol Kaessen suspects the Devotion can be inverted to absorb immense cosmic energy in times of crisis.',
  quests: []
 },
 {
  id: 'tide-choir',
  name: 'Tide Singers Guild',
  type: 'guild',
  regionId: 'iceheart-sea',
  icon: '/assets/icons/factions/tide-choir.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Calm the storm swells and decode harmonic tide resonances',
  publicDescription: 'The Minstrel and tide singer guild at Merrowport, maintaining navigational acoustics as the ocean swells rage.',
  leader: { npcId: 'mer-lyrisa', title: 'Tide Mistress and Mistress of Frequency', description: 'Mer Lyrisa communicates through harmonic acoustic resonance after years on the open brine.' },
  members: [
   { npcId: 'mer-lyrisa', role: 'Tide Mistress and Mistress of Frequency', locationId: 'merrowport' }
  ],
  headquarters: 'merrowport',
  territory: ['merrowport'],
  relationships: [
   { targetFactionId: 'house-mereval', type: 'allied', description: 'The Guild sings under House Mereval maritime authority.' },
   { targetFactionId: 'cult-of-forgotten-shadow', type: 'hostile', description: 'The cult dark presence disrupts the delicate acoustic balance of the sea.' }
  ],
  classAffinities: ['minstrel'],
  lore: 'Founded by Lyris the Tide Singer, who calmed violent gales through pure acoustic vibration.',
  secrets: 'Lyrisa discovered a resonance frequency that can disrupt monolith vibrations across the water.',
  quests: []
 },
 {
  id: 'cultivar',
  name: 'The Blightcrafters Guild',
  type: 'guild',
  regionId: 'bryngloom-forest',
  icon: '/assets/icons/factions/cultivar.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Cultivate medicinal spore strains and master bog rot pathology',
  publicDescription: 'A guild of botanical Plaguebringers who harvest Bryngloom fungal culture and mold compounds to engineer remedies and defenses.',
  leader: { npcId: 'vespera', title: 'Guildmaster Vespera', description: 'Vespera has cultivated decay moss strains for generations to unlock immunological secrets.' },
  members: [
   { npcId: 'vespera', role: 'Guildmaster Vespera', locationId: 'the-sunken-spire' }
  ],
  headquarters: 'the-sunken-spire',
  territory: ['the-sunken-spire'],
  relationships: [
   { targetFactionId: 'twice-born', type: 'allied', description: 'The Guild and the Twice Born cooperate on swamp flora preservation.' },
   { targetFactionId: 'house-morrath', type: 'rival', description: 'Morrath tax collectors continuously attempt to levy duties on medicinal spore harvests.' }
  ],
  classAffinities: ['plaguebringer'],
  lore: 'Founded to study how bog flora thrives amidst cold stagnation and rot, turning nature decay into potent medicine.',
  secrets: 'Vespera is finalizing a restorative spore compound capable of resisting unnatural tissue calcification.',
  quests: []
 },
 {
  id: 'ashen-communion',
  name: 'The Ashen Coven',
  type: 'cult',
  regionId: 'sundale',
  icon: '/assets/icons/factions/ashen-communion.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Channel volcanic heat and bind primordial fire spirits',
  publicDescription: 'A fanatic Pyrofiend cult dwelling in deep caldera shafts, consuming sacred coals to commune with fiery abyssal forces.',
  leader: { npcId: 'sol-vareths', title: 'Coven Patriarch Sol Vareths', description: 'Sol Vareths is a fire cultist whose skin has vitrified into volcanic obsidian.' },
  members: [
   { npcId: 'sol-vareths', role: 'Coven Patriarch Sol Vareths', locationId: 'emberspire-caldera' }
  ],
  headquarters: 'emberspire-caldera',
  territory: ['emberspire-caldera'],
  relationships: [
   { targetFactionId: 'house-solvan', type: 'allied', description: 'The Coven secretly serves Solvan deep forge projects beneath Emberspire.' },
   { targetFactionId: 'the-risen', type: 'hostile', description: 'The Risen condemn the Coven extreme fire communion as dangerous heresy.' }
  ],
  classAffinities: ['pyrofiend'],
  lore: 'Formed by zealots who ingested molten volcanic coals to awaken inner pyromantic resonance.',
  secrets: 'The Coven prepares for an astronomical alignment where caldera magma chambers will fully awaken.',
  quests: []
 },
 {
  id: 'twice-born',
  name: 'Order of the Twice Born',
  type: 'religious_order',
  regionId: 'bryngloom-forest',
  icon: '/assets/icons/factions/twice-born.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Shepherd the undying and preserve sacred death rites',
  publicDescription: 'A solemn Revenant monastic order in the Bryngloom wetlands who guide lost spirits and guard the boundary between life and death.',
  leader: { npcId: 'kor-vasseth', title: 'Warden of the Waking Graves', description: 'Kor Vasseth is an ancient revenant monk who keeps vigil over the quiet barrows.' },
  members: [
   { npcId: 'kor-vasseth', role: 'Warden of the Waking Graves', locationId: 'the-sunken-spire' }
  ],
  headquarters: 'the-sunken-spire',
  territory: ['the-sunken-spire'],
  relationships: [
   { targetFactionId: 'canopy-ledger', type: 'allied', description: 'The Order registers transition pacts through the Canopy Ledger Guild.' },
   { targetFactionId: 'cult-of-forgotten-shadow', type: 'hostile', description: 'The cult disturbs ancient graves the Twice Born are sworn to keep at peace.' }
  ],
  classAffinities: ['revenant'],
  lore: 'Rooted in ancient funerary arts, the Twice Born embrace cyclical renewal rather than mortal decay.',
  secrets: 'Kor Vasseth preserves ancient stasis tombs that shield fallen heroes until the realm calls them.',
  quests: []
 },
 {
  id: 'form-convergence',
  name: 'Form Shapers Guild',
  type: 'guild',
  regionId: 'cragjaw-peaks',
  icon: '/assets/icons/factions/form-convergence.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Perfect kinetic and biological body sculpting arts',
  publicDescription: 'A guild of Shaper masters at Frostmaw Holdfast who study the integration of kinetic momentum and biological crystallization.',
  leader: { npcId: 'veyra', title: 'Form Matriarch Veyra', description: 'Veyra is an elder craftswoman who teaches the delicate geometry of the Six Shaping Forms.' },
  members: [
   { npcId: 'veyra', role: 'Form Matriarch Veyra', locationId: 'frostmaw-holdfast' }
  ],
  headquarters: 'frostmaw-holdfast',
  territory: ['frostmaw-holdfast'],
  relationships: [
   { targetFactionId: 'vat-breakers-guild', type: 'allied', description: 'The Shapers collaborate with the Groven on architectural reinforcement.' },
   { targetFactionId: 'deep-alchemists', type: 'hostile', description: 'The Deep Alchemists Guild constantly attempts to steal Shaper morphological techniques.' }
  ],
  classAffinities: ['shaper'],
  lore: 'Founded by Mimir scholars who discovered how to reinforce living muscle with mineral lattices.',
  secrets: 'Veyra has mastered an elusive seventh form capable of temporary phasing through solid stone.',
  quests: []
 },
 {
  id: 'aegis',
  name: 'The Aegis Bulwark',
  type: 'military',
  regionId: 'sundale',
  icon: '/assets/icons/factions/aegis.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Defend the frontiers and neutralize chaotic magical surges',
  publicDescription: 'A heavy military Spellguard battalion stationed at Emberspire fortifications, specialized in absorbing and deflecting arcane bombardments.',
  leader: { npcId: 'thrak-damos', title: 'Bulwark Captain Thrak Damos', description: 'Thrak Damos is a battle-hardened commander who wields an alchemical fortress tower shield.' },
  members: [
   { npcId: 'thrak-damos', role: 'Bulwark Captain Thrak Damos', locationId: 'emberspire-caldera' }
  ],
  headquarters: 'emberspire-caldera',
  territory: ['emberspire-caldera'],
  relationships: [
   { targetFactionId: 'dawn-vigil', type: 'allied', description: 'The Aegis Bulwark provides heavy shield protection for Dawn Vigil outposts.' },
   { targetFactionId: 'cult-of-forgotten-shadow', type: 'hostile', description: 'The cult chaotic magic threatens to destabilize Aegis defensive perimeter wards.' }
  ],
  classAffinities: ['spellguard'],
  lore: 'Formed when solar flares battered the southern passes, creating a need for indestructible defensive shield-phalanxes.',
  secrets: 'Captain Damos maintains experimental acoustic dampening wards capable of neutralizing entire magic fields.',
  quests: []
 },
 {
  id: 'distillery',
  name: 'The Toxicologists Distillery Guild',
  type: 'guild',
  regionId: 'frostwood-reach',
  icon: '/assets/icons/factions/distillery.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Distill antidotes and chemical defenses against wilderness predators',
  publicDescription: 'An apothecary and chemical guild in the Frostwood Reach that refines venomous secretions and mist flora into protective serums.',
  leader: { npcId: 'varis', title: 'Master Distiller Varis', description: 'Varis is a meticulous chemist whose distillation chambers supply critical antitoxins across the Reach.' },
  members: [
   { npcId: 'varis', role: 'Master Distiller Varis', locationId: 'the-shallows' }
  ],
  headquarters: 'the-shallows',
  territory: ['the-shallows'],
  relationships: [
   { targetFactionId: 'house-thalreth', type: 'allied', description: 'The Distillery supplies House Thalreth garrisons with winter antitoxins.' },
   { targetFactionId: 'trueborn-florae', type: 'hostile', description: 'The Florae dispute guild rights to harvest rare resin from deep forest barks.' }
  ],
  classAffinities: ['toxicologist'],
  lore: 'The distillery was founded to protect northern travelers from toxic mist spores and predator stings.',
  secrets: 'Varis has formulated a neutralizing tonic that grants complete temporary immunity to cryogenic shock.',
  quests: []
 },
 {
  id: 'the-bound',
  name: 'The Ironbound Warden Legion',
  type: 'military',
  regionId: 'cragjaw-peaks',
  icon: '/assets/icons/factions/the-bound.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Hold the chain graft iron tradition and restrain abomination threats',
  publicDescription: 'A disciplined Warden military legion at the Chain Hold in Frostmaw, who tether and subdue mountain horrors with chains grafted into their armor.',
  leader: { npcId: 'alaric', title: 'Legion Commander Alaric', description: 'Alaric is the original Law Keeper who drove an ore chain through his forearm to hold a captured abomination.' },
  members: [
   { npcId: 'alaric', role: 'Legion Commander Alaric', locationId: 'frostmaw-holdfast' }
  ],
  headquarters: 'frostmaw-holdfast',
  territory: ['frostmaw-holdfast'],
  relationships: [
   { targetFactionId: 'vat-breakers-guild', type: 'allied', description: 'The Wardens tether what the Groven will not let walk free.' },
   { targetFactionId: 'deep-alchemists', type: 'hostile', description: 'The Alchemists breed the abominations the Bound chain.' }
  ],
  classAffinities: ['warden'],
  lore: 'Founded by Alaric the Law Keeper. The iron chains are maintained through rigorous discipline against cold fatigue.',
  secrets: 'Alaric commands deep subterranean bastions where subdued titanic specimens are held in stasis.',
  quests: []
 },
 {
  id: 'silent-hunt',
  name: 'The Silent Stalkers Guild',
  type: 'guild',
  regionId: 'frostwood-reach',
  icon: '/assets/icons/factions/silent-hunt.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Track elusive wilderness threats and map uncharted frost territory',
  publicDescription: 'A guild of elite Apex trackers in the Frostwood who operate with total acoustic discipline and sensory mastery.',
  leader: { npcId: 'sylas', title: 'Master Scout Sylas', description: 'Sylas is a deaf, unnervingly still Apex tracker who stalked conceptual Wyrd entities to found his guild.' },
  members: [
   { npcId: 'sylas', role: 'Master Scout Sylas', locationId: 'ironwood-heart' }
  ],
  headquarters: 'ironwood-heart',
  territory: ['ironwood-heart'],
  relationships: [
   { targetFactionId: 'trueborn-florae', type: 'allied', description: 'The Silent Stalkers share the groves with Trueborn trackers.' },
   { targetFactionId: 'mist-sentinels', type: 'hostile', description: 'The Sentinels patrol boundaries that the Stalkers navigate freely.' }
  ],
  classAffinities: ['apex'],
  lore: 'Founded by Sylas to master survival and tracking in the shifting whiteout fog of the Reach.',
  secrets: 'Sylas has tracked ancient entities that move without leaving prints across the snow.',
  quests: []
 },
 {
  id: 'watcher-in-the-mist',
  name: 'The Watcher in the Mist',
  type: 'entity',
  regionId: 'frostwood-reach',
  icon: '/assets/icons/factions/watcher.png',
  colors: { primary: '#2a3a4a', secondary: '#6b8fa0' },
  publicGoal: 'Maintain the boundary between life and death, memory and oblivion',
  publicDescription: 'The impartial cosmic boundary entity between life, death, memory, and oblivion. Known as Morvane in the Bryngloom.',
  leader: null,
  members: [
   { npcId: 'the-first-liar', role: 'Manifestation of the Boundary', locationId: 'frostwood-reach' }
  ],
  headquarters: null,
  territory: ['ironwood-heart', 'atropolis', 'the-sunken-spire'],
  relationships: [
   { targetFactionId: 'house-viridane', type: 'secret_ally', description: 'Offered sanctuary in the mist during the great flight.' },
   { targetFactionId: 'cult-of-forgotten-shadow', type: 'hostile', description: 'Cosmic pressure from the cult threatens to fracture the boundary.' }
  ],
  classAffinities: ['lunarch', 'augur', 'inquisitor', 'arcanoneer'],
  lore: 'The Watcher is the realm memory and equilibrium, older than the mortal houses.',
  secrets: 'The Watcher holds lost memories that remain sealed until the proper convergence.',
  quests: []
 },
 {
  id: 'scribe-cartel',
  name: 'Scribes Ink Guild',
  type: 'guild',
  regionId: 'frostwood-reach',
  icon: '/assets/icons/factions/scribe-cartel.png',
  colors: { primary: '#3a2d1a', secondary: '#d4af37' },
  publicGoal: 'Produce the soot resin ink and peat parchment that resist the fog',
  publicDescription: 'The premier Frostwood artisan guild that brews specialized fog resistant ink and durable vellum, supplying archivists throughout the Reach.',
  leader: { npcId: 'caedren-thalreth', title: 'Guildmaster of the Quill', description: 'The guild licensing authority is overseen by a Thalreth Master Scribe.' },
  members: [
   { npcId: 'caedren-thalreth', role: 'Guildmaster of the Quill', locationId: 'scribes-tower' }
  ],
  headquarters: 'scribes-tower',
  territory: ['scribes-tower', 'greymark-keep'],
  relationships: [
   { targetFactionId: 'scribe-sentinels', type: 'rival', description: 'The Sentinels copy records while the Guild controls the raw materials.' },
   { targetFactionId: 'house-thalreth', type: 'allied', description: 'The Guild provides archival materials essential to the Sovereign Ledger.' }
  ],
  classAffinities: ['toxicologist', 'augur'],
  lore: 'Established to solve the rapid ink deterioration caused by atmospheric moisture and fog.',
  secrets: 'The Guild maintains specialized compound reserves that make ink completely fireproof.',
  quests: []
 },
 {
  id: 'steam-line-cartel',
  name: 'Steamline Thermal Syndicate',
  type: 'guild',
  regionId: 'cragjaw-peaks',
  icon: '/assets/icons/factions/steam-line-cartel.png',
  colors: { primary: '#3a2a1a', secondary: '#c08040' },
  publicGoal: 'Maintain the geothermal pipeline network across the Cragjaw Peaks',
  publicDescription: 'A guild of thermal engineers and pipe masters who maintain the high pressure geothermal conduits warming the mountain holds.',
  leader: { npcId: 'tesshan-lord', title: 'Master of the Sump', description: 'The Syndicate operations are chartered by House Tesshan.' },
  members: [
   { npcId: 'tesshan-steward', role: 'Master of the Sump (Proxy)', locationId: 'frostmaw-holdfast' }
  ],
  headquarters: 'frostmaw-holdfast',
  territory: ['frostmaw-holdfast', 'gearworks-gulch'],
  relationships: [
   { targetFactionId: 'vat-breakers-guild', type: 'rival', description: 'The Groven built the spans that support the massive pipelines.' },
   { targetFactionId: 'house-tesshan', type: 'allied', description: 'House Tesshan licenses the pipeline grid in exchange for steady heat.' }
  ],
  classAffinities: ['chronarch', 'warden'],
  lore: 'Formed to consolidate fragmented heating shafts into a unified engineering infrastructure.',
  secrets: 'The Syndicate maintains secondary steam valves capable of venting superheated steam as a defensive barrier.',
  quests: []
 },
 {
  id: 'mist-sentinels',
  name: 'Mist Sentinels Vanguard',
  type: 'military',
  regionId: 'frostwood-reach',
  icon: '/assets/icons/factions/mist-sentinels.png',
  colors: { primary: '#2d3a4a', secondary: '#6b8fa0' },
  publicGoal: 'Patrol the Ironwood Palisade and guard the Reach frontiers',
  publicDescription: 'A disciplined military vanguard guarding the timber borders and fortified palisades of the Frostwood Reach against wilderness incursions.',
  leader: { npcId: 'caedren-thalreth', title: 'Vanguard Commander Caedren', description: 'Commander Caedren leads the armed border patrols along the timber frontier.' },
  members: [
   { npcId: 'caedren-thalreth', role: 'Vanguard Commander Caedren', locationId: 'the-shallows' }
  ],
  headquarters: 'the-shallows',
  territory: ['the-shallows', 'ironwood-heart', 'greythorn-copse'],
  relationships: [
   { targetFactionId: 'trueborn-florae', type: 'hostile', description: 'The Vanguard enforces border garrisons against unauthorized forest crossings.' },
   { targetFactionId: 'house-thalreth', type: 'allied', description: 'The Vanguard acts as the martial enforcement arm of House Thalreth.' }
  ],
  classAffinities: ['inquisitor', 'apex'],
  lore: 'Raised during border conflicts to secure supply roads between timber outposts and Greymark Keep.',
  secrets: 'The Vanguard maintains concealed watchtowers throughout the ironwood canopy for long range reconnaissance.',
  quests: []
 },
 {
  id: 'brine-bond-syndicate',
  name: 'Brine Bond Syndicate',
  type: 'merchant',
  regionId: 'iceheart-sea',
  icon: '/assets/icons/factions/brine-bond-syndicate.png',
  colors: { primary: '#1a3a4e', secondary: '#5a9aae' },
  publicGoal: 'Regulate Merrowport docking charters and insure maritime commerce',
  publicDescription: 'The dominant merchant syndicate of the Iceheart Sea, financing maritime expeditions, managing docking fees, and insuring storm cargo.',
  leader: { npcId: 'mereval-steward', title: 'Syndicate Chancellor', description: 'The Chancellor oversees trade contracts and harbor tariffs under the Grand Admiral seal.' },
  members: [
   { npcId: 'mereval-steward', role: 'Syndicate Chancellor', locationId: 'merrowport' }
  ],
  headquarters: 'merrowport',
  territory: ['merrowport', 'brinehorse-cove', 'spindrift-lagoon'],
  relationships: [
   { targetFactionId: 'house-mereval', type: 'rival', description: 'The Syndicate handles day to day commerce while vying for naval policy influence.' },
   { targetFactionId: 'merrowport-house', type: 'neutral', description: 'The Merrowport Merchant Guild operates within Syndicate harbor zones.' }
  ],
  classAffinities: ['gambit', 'minstrel'],
  lore: 'Formed by wealthy shipwrights and cargo merchants to pool financial risk across dangerous icy voyages.',
  secrets: 'The Syndicate maintains a private fleet of icebreaker galleys equipped for deep salvage missions.',
  quests: []
 },
 {
  id: 'drun-outcasts',
  name: 'The Drun Outcast Clans',
  type: 'tribe',
  regionId: 'bryngloom-forest',
  icon: '/assets/icons/factions/drun-outcasts.png',
  colors: { primary: '#3a3a3a', secondary: '#7a7a7a' },
  publicGoal: 'Survive in freedom beyond the reach of feudal registry',
  publicDescription: 'Independent tribal clans who dwell in the Over Shanty and deep bogs, choosing total self reliance over civilization hierarchy.',
  leader: { npcId: 'saren-vel', title: 'Elder Saren Vel', description: 'Saren Vel is a respected tribal elder who guides the outcast communities with ancient wisdom.' },
  members: [
   { npcId: 'saren-vel', role: 'Elder Saren Vel', locationId: 'over-shanty' }
  ],
  headquarters: 'over-shanty',
  territory: ['over-shanty', 'black-fen', 'vel-keth-bayou'],
  relationships: [
   { targetFactionId: 'scribe-sentinels', type: 'hostile', description: 'The Drun resist all attempts by external guilds to register or tax their settlements.' },
   { targetFactionId: 'house-morrath', type: 'allied', description: 'Drun clans maintain ancient kinship ties with forgotten forest lineages.' }
  ],
  classAffinities: ['plaguebringer', 'revenant'],
  lore: 'Formed by independent thinkers and survivors who built resilient stilt villages above the Bryngloom mire.',
  secrets: 'The Drun have discovered natural underwater pathways through the marsh that bypass all toll gates.',
  quests: []
 },
 {
  id: 'cult-of-forgotten-shadow',
  name: 'Cult of the Forgotten Shadow',
  type: 'cult',
  regionId: 'bryngloom-forest',
  icon: '/assets/icons/factions/cult-of-forgotten-shadow.png',
  colors: { primary: '#1a1a2e', secondary: '#4a2d6b' },
  publicGoal: 'Commune with the deep dark and hasten the cosmic eclipse',
  publicDescription: 'A sinister cult of dark mystics and void zealots operating in the Sunken Spire, conducting rituals to embrace primordial darkness.',
  leader: { npcId: 'mor-vereth', title: 'High Priest Mor Vereth', description: 'Mor Vereth channels dark whispers from the abyssal rift.' },
  members: [
   { npcId: 'mor-vereth', role: 'High Priest Mor Vereth', locationId: 'the-sunken-spire' }
  ],
  headquarters: 'the-sunken-spire',
  territory: ['the-sunken-spire', 'over-shanty', 'atropolis'],
  relationships: [
   { targetFactionId: 'dawn-vigil', type: 'rival', description: 'The Dawn Vigil hunts the cult as dangerous apostates.' },
   { targetFactionId: 'watcher-in-the-mist', type: 'hostile', description: 'The cult dark invocations directly threaten the stability of the cosmic boundary.' }
  ],
  classAffinities: ['false_prophet', 'revenant'],
  lore: 'Emerged from occult sects seeking power from the void between the stars.',
  secrets: 'The cult has discovered an abyssal resonance stone capable of silencing sacred light.',
  quests: []
 },
 {
  id: 'the-risen',
  name: 'The Risen Faithful',
  type: 'religious_order',
  regionId: 'sundale',
  icon: '/assets/icons/factions/the-risen.png',
  colors: { primary: '#d4a030', secondary: '#1a1a2e' },
  publicGoal: 'Tend the sacred solar flame and keep faith in dawn restoration',
  publicDescription: 'A revered ecclesiastical order of Solari faithful who guard the Harath Vault and tend the sacred embers, believing solar dawn will return through piety.',
  leader: { npcId: 'sol-kaessen', title: 'High Priestess Sol Kaessen', description: 'Sol Kaessen tends the eternal warmth of the sacred altar.' },
  members: [
   { npcId: 'sol-kaessen', role: 'High Priestess Sol Kaessen', locationId: 'harath-vault' }
  ],
  headquarters: 'harath-vault',
  territory: ['harath-vault', 'emberspire-caldera'],
  relationships: [
   { targetFactionId: 'house-solvan', type: 'allied', description: 'The Risen are the spiritual guardians of House Solvan ancestral faith.' },
   { targetFactionId: 'the-sunderers', type: 'hostile', description: 'The Sunderer Cabal seeks to extinguish the sacred flame.' },
   { targetFactionId: 'the-scoured', type: 'hostile', description: 'The Cult of the Scoured Flesh rejects ecclesiastical rites in favor of radical sacrifice.' }
  ],
  classAffinities: ['martyr', 'pyrofiend'],
  lore: 'Preserves orthodox Solari liturgy and holds the sacred rites of dawn.',
  secrets: 'The high priestess guards the Sol Crystal, a relic that continues to emanate gentle solar warmth.',
  quests: []
 },
 {
  id: 'the-sunderers',
  name: 'The Sunderer\'s Cabal',
  type: 'cult',
  regionId: 'sundale',
  icon: '/assets/icons/factions/the-sunderers.png',
  colors: { primary: '#a12323', secondary: '#1a1a1a' },
  publicGoal: 'Extinguish the false flame and sever all cosmic tethers',
  publicDescription: 'A destructive apocalyptic cult believing the remaining solar sparks are conduits that draw cosmic predators. They seek to extinguish all embers to starve the beast.',
  leader: { npcId: 'sol-vareths', title: 'Cabal Hierophant Sol Vareths', description: 'Sol Vareths preaches the cold release of the world from cosmic hunger.' },
  members: [
   { npcId: 'sol-vareths', role: 'Cabal Hierophant Sol Vareths', locationId: 'emberspire-caldera' }
  ],
  headquarters: 'emberspire-caldera',
  territory: ['emberspire-caldera', 'basalt-shyr'],
  relationships: [
   { targetFactionId: 'the-risen', type: 'hostile', description: 'The Risen preserve the flame the Cabal is sworn to extinguish.' },
   { targetFactionId: 'dawn-vigil', type: 'rival', description: 'The Vigil seeks to rekindle what the Cabal believes must be put out forever.' },
   { targetFactionId: 'the-scoured', type: 'rival', description: 'The Cabal seeks total flame extinction while the Scoured seek seal reconstruction.' }
  ],
  classAffinities: ['pyrofiend', 'martyr'],
  lore: 'Emerged as a nihilistic schism from apocalyptic fire worshipers.',
  secrets: 'The Cabal has identified a subterranean magma conduit that could be detonated to quench the central caldera.',
  quests: []
 },
 {
  id: 'the-scoured',
  name: 'Cult of the Scoured Flesh',
  type: 'cult',
  regionId: 'sundale',
  icon: '/assets/icons/factions/the-scoured.png',
  colors: { primary: '#bfa37a', secondary: '#4a3728' },
  publicGoal: 'Reassemble the Monolith shards to seal the cosmic rift permanently',
  publicDescription: 'A fanatical zealot cult whose initiates ritualistically scour their skin of all forge marks, dedicating their lives to recovering scattered Monolith fragments.',
  leader: { npcId: 'none', title: 'Council of the Scoured', description: 'The Scoured operate through decentralized fanatic cells across the continents.' },
  members: [
   { npcId: 'sol-vareths', role: 'Cell Coordinator', locationId: 'basalt-shyr' }
  ],
  headquarters: 'none',
  territory: ['basalt-shyr', 'cinder-badlands', 'slag-gulch'],
  relationships: [
   { targetFactionId: 'the-risen', type: 'hostile', description: 'The Scoured reject temple worship as ineffective against cosmic ruin.' },
   { targetFactionId: 'the-sunderers', type: 'rival', description: 'The Scoured seek containment through relic assembly, not total nihilism.' },
   { targetFactionId: 'dawn-vigil', type: 'hostile', description: 'The Dawn Vigil pursues the same monolith shards with conflicting holy intent.' }
  ],
  classAffinities: ['pyrofiend', 'berserker'],
  lore: 'Initiates cut their forge markings away to sever mortal allegiances and become living instruments of the seal.',
  secrets: 'The cult maintains an underground smuggling network spanning all seven territories to move sacred shards.',
  quests: []
 },
 {
  id: 'neth',
  name: 'High House Neth',
  type: 'noble_house',
  regionId: 'bryngloom-forest',
  icon: '/assets/icons/factions/neth.png',
  colors: { primary: '#3a2a4a', secondary: '#9a8fb0' },
  publicGoal: 'Uphold the First Contract and administer the Bryngloom through legal covenant',
  publicDescription: 'The ancient patrician house of silver touched pact lords seated at Atropolis, whose legal treaties and contract magic bind the factions of the Great Swamp.',
  leader: { npcId: 'vellan-archivist', title: 'Archon of the High House', description: 'The Archon presides over the Atropolis Great Registry.' },
  members: [
   { npcId: 'vellan-archivist', role: 'Archon of the High House', locationId: 'atropolis' }
  ],
  headquarters: 'atropolis',
  territory: ['atropolis', 'vel-keth-bayou', 'aran-glen', 'black-fen'],
  relationships: [
   { targetFactionId: 'house-morrath', type: 'allied', description: 'High House Neth legitimizes Morrath legal continuity through the registry.' },
   { targetFactionId: 'scribe-cartel', type: 'rival', description: 'The Neth legalists regulate what the Scribes Ink Guild provides.' }
  ],
  classAffinities: ['arcanoneer', 'revenant'],
  lore: 'An ancient dynasty whose words carry literal binding arcane weight under the First Contract.',
  secrets: 'A high chamber within Atropolis contains pre-shattering codices detailing sovereign contracts with lost planar lords.',
  quests: []
 },
 {
  id: 'astril-earthen',
  name: 'Earthen Astril Folk',
  type: 'cultural',
  regionId: 'sundrift-vale',
  icon: '/assets/icons/factions/astril.png',
  colors: { primary: '#c4d4e0', secondary: '#8b9da8' },
  publicGoal: 'Tend the crystalline heritage of Lumia and maintain sacred traditions',
  publicDescription: 'The agrarian and pastoral Astril folk who maintain the Starfall Vale pilgrimage grounds and protect celestial crystal shards.',
  leader: {
  'npcId': 'elder-solas-stonekeeper',
  'title': 'Stone-Father Solas',
  'description': 'Elder Astril geomancer who reads terrestrial vibrations through crystalline skin nodes.'
},
  members: [
  {
    'npcId': 'elder-solas-stonekeeper',
    'role': 'Stone-Father & Elder',
    'locationId': 'starfall-vale'
  },
  {
    'npcId': 'terra-gemcarver',
    'role': 'Resonance Artisan',
    'locationId': 'starfall-vale'
  }
],
  headquarters: 'starfall-vale',
  territory: ['starfall-vale', 'novas-heath'],
  relationships: [],
  classAffinities: ['animist', 'augur'],
  lore: 'Descended from celestial refugees who adapted their stellar heritage into harmonious earth stewardship.',
  secrets: 'The elders know of a slumbering crystal resonance deep below Starfall Vale.',
  quests: []
 },
 {
  id: 'drall-clan-free',
  name: 'Free Drall Clans',
  type: 'tribe',
  regionId: 'cragjaw-peaks',
  icon: '/assets/icons/factions/default.png',
  colors: { primary: '#5c4a3a', secondary: '#8b7355' },
  publicGoal: 'Reclaim ancestral deep delving territories and preserve Drall metallurgy',
  publicDescription: 'Independent clan communities of Drall master smiths and salvagers in the Cragjaw Peaks who reject guild hierarchy.',
  leader: {
  'npcId': 'baron-torvald-ironbreaker',
  'title': 'Forge-Thane Torvald',
  'description': 'A scarred Drall veteran who leads the free smiths with an adamantite warhammer.'
},
  members: [
  {
    'npcId': 'baron-torvald-ironbreaker',
    'role': 'Forge-Thane',
    'locationId': 'gearworks-gulch'
  },
  {
    'npcId': 'brond-the-deep',
    'role': 'Chief Sump-Excavator',
    'locationId': 'sump-galleries'
  }
],
  headquarters: 'gearworks-gulch',
  territory: ['gearworks-gulch', 'sump-galleries'],
  relationships: [
   { targetFactionId: 'vat-breakers-guild', type: 'allied', description: 'The Drall trade reclaimed components with the Groven.' }
  ],
  classAffinities: ['warden', 'berserker'],
  lore: 'Proud mountain folk who preserve ancient subterranean metalworking techniques.',
  secrets: 'The clans have uncovered sealed Drall forge-vaults containing pure pre-freeze adamantite.',
  quests: []
 },
 {
  id: 'solari-forge-clans',
  name: 'Solari Forgemasters Consortium',
  type: 'guild',
  regionId: 'sundale',
  icon: '/assets/icons/factions/default.png',
  colors: { primary: '#8b4513', secondary: '#d2691e' },
  publicGoal: 'Tend the volcanic forges and produce the finest heat resistant armaments',
  publicDescription: 'A guild consortium of Solari master blacksmiths who harness raw volcanic vents to forge legendary weapons and armors.',
  leader: {
  'npcId': 'master-ignis-solvan',
  'title': 'High Pyro-Smith Ignis',
  'description': 'Legendary Solari metallurgist capable of shaping molten volcanic slag barehanded.'
},
  members: [
  {
    'npcId': 'master-ignis-solvan',
    'role': 'High Pyro-Smith',
    'locationId': 'great-forge'
  },
  {
    'npcId': 'vanya-the-bellows',
    'role': 'Magma-Conduit Warden',
    'locationId': 'slag-gulch'
  }
],
  headquarters: 'great-forge',
  territory: ['great-forge', 'slag-gulch'],
  relationships: [
   { targetFactionId: 'house-solvan', type: 'allied', description: 'The Consortium equips House Solvan legions with elite masterwork steel.' }
  ],
  classAffinities: ['pyrofiend', 'spellguard'],
  lore: 'Generations of master smiths who turn geothermal magma into hardened solar alloys.',
  secrets: 'The Forgemasters possess secret metallurgical formulas for absorbing kinetic impacts directly into thermal reserves.',
  quests: []
 },
 {
  id: 'kessen-weavers',
  name: 'Cult of the Kessen Weavers',
  type: 'cult',
  regionId: 'bryngloom-forest',
  icon: '/assets/icons/factions/neth.png',
  colors: { primary: '#4a6b3a', secondary: '#7a9a6a' },
  publicGoal: 'Weave threads of destiny through living wood and root divination',
  publicDescription: 'An esoteric cult of wood-mystics and fate weavers in Aran Glen who shape living boughs and read the shifting probability of the future.',
  leader: {
  'npcId': 'matron-silva-branchweaver',
  'title': 'Fate-Weaver Matron Silva',
  'description': 'Ancient wood-mystic whose fingers are entwined with living briar threads.'
},
  members: [
  {
    'npcId': 'matron-silva-branchweaver',
    'role': 'High Fate-Weaver',
    'locationId': 'aran-glen'
  },
  {
    'npcId': 'koran-thornseer',
    'role': 'Root Astrologer',
    'locationId': 'fangmere-grove'
  }
],
  headquarters: 'aran-glen',
  territory: ['aran-glen', 'fangmere-grove'],
  relationships: [
   { targetFactionId: 'neth', type: 'allied', description: 'The Weavers provide astrological and probability divinations to High House Neth.' }
  ],
  classAffinities: ['arcanoneer', 'augur'],
  lore: 'Practitioners of living wood manipulation whose crafted artifacts grow and adapt over centuries.',
  secrets: 'The High Weaver can forecast major political schisms years before they occur by observing root branchings.',
  quests: []
 },
 {
  id: 'kethrin-guild-bound',
  name: 'Guildbound Kethrin Engineers',
  type: 'guild',
  regionId: 'cragjaw-peaks',
  icon: '/assets/icons/factions/default.png',
  colors: { primary: '#6b5b3a', secondary: '#a08050' },
  publicGoal: 'Advance mechanical engineering through certified innovation and industrial design',
  publicDescription: 'The foremost engineering and machinery guild in the world, operating the massive clockwork infrastructure of Gearworks Gulch.',
  leader: {
  'npcId': 'chief-engineer-varos',
  'title': 'Grand Mechanist Varos',
  'description': 'Master of clockwork thermodynamics and lead architect of the great mountain turbines.'
},
  members: [
  {
    'npcId': 'chief-engineer-varos',
    'role': 'Grand Mechanist',
    'locationId': 'gearworks-gulch'
  },
  {
    'npcId': 'lyra-gearwright',
    'role': 'Chief Turbine Inspector',
    'locationId': 'frostmaw-holdfast'
  }
],
  headquarters: 'gearworks-gulch',
  territory: ['gearworks-gulch', 'frostmaw-holdfast'],
  relationships: [
   { targetFactionId: 'steam-line-cartel', type: 'allied', description: 'The Engineers design the high pressure conduits maintained by the Thermal Syndicate.' }
  ],
  classAffinities: ['chronarch', 'warden'],
  lore: 'Custodians of clockwork apparatuses and geothermal turbines that power the mountain realm.',
  secrets: 'The Guild Patent Board holds classified blueprints for an autonomous subterranean boring automaton.',
  quests: []
 },
 {
  id: 'merryn-traders',
  name: 'Merryn Trading Company',
  type: 'guild',
  regionId: 'iceheart-sea',
  icon: '/assets/icons/factions/default.png',
  colors: { primary: '#2a5a6a', secondary: '#5a8a9a' },
  publicGoal: 'Maintain commerce fleets across the storm routes of the Iceheart Sea',
  publicDescription: 'An expansive mercantile shipping company operating merchant fleets between Merrowport, Sundale, and northern fjords.',
  leader: {
  'npcId': 'commodore-alden-merryn',
  'title': 'High Commodore Alden',
  'description': 'Seasoned sea dog with a silver sextant who commands the merchant galleons of Iceheart Sea.'
},
  members: [
  {
    'npcId': 'commodore-alden-merryn',
    'role': 'High Commodore',
    'locationId': 'merrowport'
  },
  {
    'npcId': 'quartermaster-bryn',
    'role': 'Harbor Factor',
    'locationId': 'spindrift-lagoon'
  }
],
  headquarters: 'merrowport',
  territory: ['merrowport', 'spindrift-lagoon'],
  relationships: [
   { targetFactionId: 'brine-bond-syndicate', type: 'allied', description: 'The Trading Company is the primary fleet operator insured by the Syndicate.' }
  ],
  classAffinities: ['gambit', 'minstrel'],
  lore: 'A venerable trading coalition whose swift caravels brave icy straits to supply essential foodstuffs and coal.',
  secrets: 'The Company secretly maintains concealed warm water anchorages for emergency refuge during severe blizzards.',
  quests: []
 },
 {
  id: 'morren-peat-cutters',
  name: 'Vreken Peat Harvesters Guild',
  type: 'guild',
  regionId: 'bryngloom-forest',
  icon: '/assets/icons/factions/default.png',
  colors: { primary: '#3a2a1a', secondary: '#6a4a2a' },
  publicGoal: 'Harvest and refine Bryngloom peat for fuel, heat, and alchemy',
  publicDescription: 'A guild of hardworking marsh harvesters who extract energy rich fuel peat and alchemical bog substrate from the swamp floor.',
  leader: {
  'npcId': 'bog-marshal-joran',
  'title': 'Bog-Marshal Joran',
  'description': 'Grizzled marsh boss who navigates the sunken peat bogs without a torch.'
},
  members: [
  {
    'npcId': 'bog-marshal-joran',
    'role': 'Bog-Marshal',
    'locationId': 'morrens-bogpost'
  },
  {
    'npcId': 'sari-peat-chemist',
    'role': 'Alchemical Bog-Refiner',
    'locationId': 'peat-bog-sinks'
  }
],
  headquarters: 'morrens-bogpost',
  territory: ['morrens-bogpost', 'peat-bog-sinks'],
  relationships: [
   { targetFactionId: 'neth', type: 'vassal', description: 'The Harvesters supply vital fuel to Atropolis in exchange for settlement protections.' }
  ],
  classAffinities: ['toxicologist', 'plaguebringer'],
  lore: 'Sturdy swamp laborers whose specialized drying kilns provide heating briquettes across the region.',
  secrets: 'Harvesters occasionally unearth petrified pre-historic relics perfectly preserved within deep anaerobic peat layers.',
  quests: []
 },
 {
  id: 'myrathil-shore',
  name: 'Shore Myrathil Clan',
  type: 'cultural',
  regionId: 'iceheart-sea',
  icon: '/assets/icons/factions/default.png',
  colors: { primary: '#2a8a7a', secondary: '#5abaaa' },
  publicGoal: 'Protect coral reefs and harvest bioluminescent maritime treasures',
  publicDescription: 'A coastal cultural clan of reef divers and coral cultivators who tend the bioluminescent marine gardens of Spindrift Lagoon.',
  leader: {
  'npcId': 'tide-matron-coralyn',
  'title': 'Tide-Matron Coralyn',
  'description': 'Reef singer whose coral flute can summon schools of luminescent bioluminescent deep fish.'
},
  members: [
  {
    'npcId': 'tide-matron-coralyn',
    'role': 'Tide-Matron',
    'locationId': 'spindrift-lagoon'
  },
  {
    'npcId': 'kailo-reef-diver',
    'role': 'Abyssal Harvester',
    'locationId': 'deepwell-archipelago'
  }
],
  headquarters: 'spindrift-lagoon',
  territory: ['spindrift-lagoon', 'deepwell-archipelago'],
  relationships: [
   { targetFactionId: 'merryn-traders', type: 'allied', description: 'The Clan trades luminescent pearls and marine remedies with Merryn merchant captains.' }
  ],
  classAffinities: ['minstrel', 'animist'],
  lore: 'Reef guardians who communicate with deep sea schools and cultivate glowing coral kelp.',
  secrets: 'The Clan guards an underwater grotto that emits restorative thermal waters during winter freezes.',
  quests: []
 },
 {
  id: 'ordan-nomads',
  name: 'Ordan Steppe Nomads',
  type: 'tribe',
  regionId: 'sundrift-vale',
  icon: '/assets/icons/factions/default.png',
  colors: { primary: '#7a6a4a', secondary: '#b09a6a' },
  publicGoal: 'Follow seasonal grazing circuits across the vast grasslands',
  publicDescription: 'A free nomadic tribe of steppe herders and horse-masters who traverse the open expanses of the Sundrift Vale with the seasons.',
  leader: {
  'npcId': 'khan-batyr-windrider',
  'title': 'Wind-Khan Batyr',
  'description': 'Chieftain of the steppe riders whose eagle can spot a grazing herd ten miles away.'
},
  members: [
  {
    'npcId': 'khan-batyr-windrider',
    'role': 'Wind-Khan',
    'locationId': 'sundrift-vale'
  },
  {
    'npcId': 'ulaan-steppe-shaman',
    'role': 'Ancestor Chasm Drummer',
    'locationId': 'starfall-vale'
  }
],
  headquarters: 'sundrift-vale',
  territory: ['sundrift-vale', 'starfall-vale'],
  relationships: [
   { targetFactionId: 'house-ordavan', type: 'allied', description: 'The Nomads maintain ancestral pacts with House Ordavan for seasonal pasture rights.' }
  ],
  classAffinities: ['animist', 'apex'],
  lore: 'Masters of the open plains whose oral traditions preserve ancient constellations and navigation markers.',
  secrets: 'The Nomads know the precise seasonal paths where spiritual mirages reveal forgotten ancient ruins.',
  quests: []
 },
 {
  id: 'rime-born',
  name: 'The Rimeborn Cult',
  type: 'cult',
  regionId: 'nordhalla',
  icon: '/assets/icons/factions/default.png',
  colors: { primary: '#8ab4d4', secondary: '#4a7a9a' },
  publicGoal: 'Interpret glacier runes and commune with the eternal freeze',
  publicDescription: 'A mystical ice cult of Skald ascetics who venerate the primeval frost and meditate upon ancient glacier wall inscriptions.',
  leader: {
  'npcId': 'frost-seer-skadi',
  'title': 'High Rime-Seer Skadi',
  'description': 'Ascetic prophetess with frozen white hair who interprets glacier creaks as divine omens.'
},
  members: [
  {
    'npcId': 'frost-seer-skadi',
    'role': 'High Rime-Seer',
    'locationId': 'vargtor'
  },
  {
    'npcId': 'einar-ice-monk',
    'role': 'Glacier Hermit',
    'locationId': 'frozen-archive'
  }
],
  headquarters: 'vargtor',
  territory: ['vargtor', 'frozen-archive'],
  relationships: [
   { targetFactionId: 'house-skalvyr', type: 'allied', description: 'The Cult advises Skalvyr jarls on glacier stability and weather auguries.' }
  ],
  classAffinities: ['harbinger', 'animist'],
  lore: 'Ascetics who coat their skin in rime ice to withstand subzero blizzards without shelter.',
  secrets: 'The Cult has deciphered ancient glacier glyphs foretelling the emergence of a subterranean geothermal surge.',
  quests: []
 },
 {
  id: 'skald-keepers',
  name: 'Skaldic Genealogists Guild',
  type: 'guild',
  regionId: 'nordhalla',
  icon: '/assets/icons/factions/default.png',
  colors: { primary: '#6a4a3a', secondary: '#9a7a5a' },
  publicGoal: 'Preserve lineage records and arbitrate bloodline succession',
  publicDescription: 'A prestigious guild of northern chroniclers and genealogists who maintain the lineage archives and arbitrate clan inheritance disputes.',
  leader: {
  'npcId': 'high-chronicler-snorri',
  'title': 'High Genealogist Snorri',
  'description': 'Elder keeper of the ivory runestones and chief arbitrator of northern clan inheritance.'
},
  members: [
  {
    'npcId': 'high-chronicler-snorri',
    'role': 'High Genealogist',
    'locationId': 'frozen-archive'
  },
  {
    'npcId': 'astrid-vellum-keeper',
    'role': 'Bloodline Archivist',
    'locationId': 'frostholm'
  }
],
  headquarters: 'frozen-archive',
  territory: ['frozen-archive', 'frostholm'],
  relationships: [
   { targetFactionId: 'house-skalvyr', type: 'allied', description: 'The Guild validates royal bloodlines and countersigns jarl investitures.' },
   { targetFactionId: 'icechamber-syndicate', type: 'rival', description: 'The Genealogists demand transparent ledger records while the Syndicate prefers negotiated terms.' }
  ],
  classAffinities: ['minstrel', 'augur'],
  lore: 'Custodians of the Great Lineage Scrolls carved into mammoth tusks and slate tablets.',
  secrets: 'The Guild possesses sealed genealogical records proving a disputed royal claimant in an outlying northern settlement.',
  quests: []
 },
 {
  id: 'icechamber-syndicate',
  name: 'The Icechamber Syndicate',
  type: 'merchant',
  regionId: 'nordhalla',
  icon: '/assets/icons/factions/default.png',
  colors: { primary: '#536879', secondary: '#b8c7d1' },
  publicGoal: 'Supply Nordhalla with coal, grain, and furs through the long freeze',
  publicDescription: 'A powerful commercial syndicate controlling northern coal mines, grain silos, and overland caravan routes, staffing gateway toll points.',
  leader: { npcId: 'icechamber-director', title: 'Syndicate Director', description: 'The Director oversees northern supply depots and fuel rationing.' },
  headquarters: 'frostholm',
  territory: ['frostholm', 'frozen-archive', 'bloodhammer-sump', 'fjord-gate'],
  relationships: [
   { targetFactionId: 'house-skalvyr', type: 'vassal', description: 'The Syndicate collects tariffs and staffs fortress gates under crown license.' },
   { targetFactionId: 'skald-keepers', type: 'rival', description: 'The Syndicate commercial priorities frequently clash with the Genealogists traditional mandates.' }
  ],
  classAffinities: ['gambit', 'warden', 'toxicologist'],
  lore: 'Started as a modest fuel repository before expanding into the largest logistical syndicate of the north.',
  secrets: 'The Syndicate maintains concealed high capacity coal vaults beneath the permafrost to control seasonal fuel pricing.',
  quests: []
 },
 {
  id: 'veiled-mimir',
  name: 'Order of the Veiled Mimir',
  type: 'religious_order',
  regionId: 'frostwood-reach',
  icon: '/assets/icons/factions/default.png',
  colors: { primary: '#4a3a5a', secondary: '#8a6aaa' },
  publicGoal: 'Harvest and preserve memories through Mirror Mere memory glass',
  publicDescription: 'A sacred monastic order of seers and artisans who harvest memory glass from Mirror Mere, carving divination masks, lenses, and memory prisms.',
  leader: {
  'npcId': 'abbot-mimir-valen',
  'title': 'High Abbot Valen',
  'description': 'Blind mirror-carver who discerns memories by touching the resonance of lakebed glass.'
},
  members: [
  {
    'npcId': 'abbot-mimir-valen',
    'role': 'High Abbot',
    'locationId': 'mirror-mere'
  },
  {
    'npcId': 'sister-mira-glass-shaper',
    'role': 'Master Prism Carver',
    'locationId': 'frostwood-reach'
  }
],
  headquarters: 'mirror-mere',
  territory: ['mirror-mere', 'frostwood-reach'],
  relationships: [
   { targetFactionId: 'house-thalreth', type: 'neutral', description: 'The Order trades memory glass divination lenses with Thalreth archivists.' }
  ],
  classAffinities: ['augur', 'animist'],
  lore: 'Keepers of mystical crystalline lakebed glass that permanently captures emotional resonance and visual impressions.',
  secrets: 'The Order maintains the Hall of Echoes, where centuries of preserved historical memories can be re-experienced through master lenses.',
  quests: []
 },
 {
  id: 'velun-pact-lords',
  name: 'Velun Pact Lords',
  type: 'noble_house',
  regionId: 'bryngloom-forest',
  icon: '/assets/icons/factions/neth.png',
  colors: { primary: '#5a4a7a', secondary: '#9a7aaa' },
  publicGoal: 'Ensure the Glen Compact remains consistent with the First Contract',
  publicDescription: 'A distinguished Neth patrician house serving as judicial ambassadors between Aran Glen and Atropolis, overseeing binding legal pacts.',
  leader: {
  'npcId': 'consul-tiberius-velun',
  'title': 'High Chancellor Tiberius',
  'description': 'Elder jurist who authored the supplementary clauses of the First Contract.'
},
  members: [
  {
    'npcId': 'consul-tiberius-velun',
    'role': 'High Chancellor',
    'locationId': 'atropolis'
  },
  {
    'npcId': 'lady-cassandra-velun',
    'role': 'Pact Envoy to the Glens',
    'locationId': 'aran-glen'
  }
],
  headquarters: 'atropolis',
  territory: ['atropolis', 'aran-glen'],
  relationships: [
   { targetFactionId: 'neth', type: 'allied', description: 'The Pact Lords are a foundational branch of High House Neth.' },
   { targetFactionId: 'canopy-ledger', type: 'allied', description: 'The Pact Lords work hand in hand with the Canopy Ledger Guild to enforce contracts.' }
  ],
  classAffinities: ['arcanoneer', 'spellguard'],
  lore: 'Direct descendants of the founding legal scribes who authored the First Contract.',
  secrets: 'The Pact Lords hold secret executive veto clauses capable of temporarily suspending commercial taxes in emergencies.',
  quests: []
 },
 {
  id: 'astril-synod',
  name: 'The Astril Synod Council',
  type: 'governing_council',
  regionId: 'sundrift-vale',
  icon: '/assets/icons/factions/astril.png',
  colors: { primary: '#c4d4e0', secondary: '#8b9da8' },
  publicGoal: 'Govern the Sundrift Vale and preserve Astril heritage and law',
  publicDescription: 'The supreme governing council of Astril elders and scholars in the Sundrift Vale, codifying law, adjudicating disputes, and protecting cultural heritage.',
  leader: { npcId: 'the-first-liar', title: 'Synod Archon', description: 'The Synod is presided over by an elected elder Archon.' },
  members: [
   { npcId: 'the-first-liar', role: 'Synod Archon', locationId: 'synod-hold' }
  ],
  headquarters: 'synod-hold',
  territory: ['synod-hold', 'novas-heath', 'starfall-vale'],
  relationships: [
   { targetFactionId: 'unlit-veil', type: 'puppet', description: 'Veil advisors subtly counsel council members on external steppe security.' },
   { targetFactionId: 'house-ordavan', type: 'neutral', description: 'The Council maintains mutual trade and border respect with House Ordavan.' },
   { targetFactionId: 'scribe-sentinels', type: 'neutral', description: 'The Council engages Scribe Sentinels Guild scholars for archival work.' },
   { targetFactionId: 'congregation-of-the-silence', type: 'hostile', description: 'The Council actively outlaws False Prophet cult activity across the Vale.' }
  ],
  classAffinities: ['augur', 'animist'],
  lore: 'Established in the wake of the Great Freeze to unify scattered Astril communities under a single legal codex.',
  secrets: 'The Synod maintains the Astral Vault containing star charts mapping the original celestial homeworld.',
  quests: []
 }
];


const RELATIONSHIP_TYPES = {

 allied: { label: 'Allied', color: '#2d8552', icon: 'handshake', lineStyle: 'solid' },

 vassal: { label: 'Vassal', color: '#2d8552', icon: 'crown', lineStyle: 'dashed' },

 neutral: { label: 'Neutral', color: '#888888', icon: 'minus', lineStyle: 'dotted' },

 rival: { label: 'Rival', color: '#c48b1e', icon: 'balance-scale', lineStyle: 'dashed' },

 hostile: { label: 'Hostile', color: '#a12323', icon: 'swords', lineStyle: 'solid' },

 secret_ally: { label: 'Secret Ally', color: '#6b2d8b', icon: 'mask', lineStyle: 'dashed' },

 secret_rival: { label: 'Secret Rival', color: '#8b2d6b', icon: 'eye-slash', lineStyle: 'dotted' },

 puppet_master: { label: 'Puppet Master', color: '#d4700a', icon: 'string', lineStyle: 'solid' },

 overlord: { label: 'Overlord', color: '#2d8552', icon: 'crown', lineStyle: 'solid' },

 puppet: { label: 'Puppet', color: '#888888', icon: 'crown', lineStyle: 'dotted' },

 successor: { label: 'Successor', color: '#2d8552', icon: 'handshake', lineStyle: 'dashed' },

 tense_allied: { label: 'Tense Allied', color: '#6b8b2d', icon: 'handshake', lineStyle: 'dashed' }

};



const FACTION_TYPES = {

 noble_house: { label: 'Noble House', icon: 'crown' },

 guild: { label: 'Guild', icon: 'hammer' },

 cult: { label: 'Cult', icon: 'moon' },

 military: { label: 'Military', icon: 'shield-haltered' },

 tribe: { label: 'Tribe', icon: 'paw' },

 religious_order: { label: 'Religious Order', icon: 'church' },

 secret_society: { label: 'Secret Society', icon: 'mask' },

 merchant: { label: 'Merchant League', icon: 'coins' },

 shadow_order: { label: 'Shadow Order', icon: 'skull' },

 tribal: { label: 'Tribal', icon: 'fire' }

};



const triggerFactionAutoSync = () => {
  const currentUid = auth?.currentUser?.uid;
  if (currentUid && currentUid !== 'admin-dev-user' && currentUid !== 'dev-user-123' && !currentUid.startsWith('guest-')) {
    useFactionStore.getState().syncToCloud(currentUid);
  }
};

const useFactionStore = create(
  persist(
    (set, get) => ({
      factions: SEEDED_FACTIONS,
      lastCloudSyncAt: null,

      getFaction: (factionId) => get().factions.find((f) => f.id === factionId) || null,

      getFactionsByRegion: (regionId) => get().factions.filter((f) => f.regionId === regionId),

      getFactionsByType: (type) => get().factions.filter((f) => f.type === type),

      getFactionsByClass: (classId) =>
        get().factions.filter((f) => f.classAffinities && f.classAffinities.includes(classId)),

      getFactionRelationships: (factionId) => {
        const faction = get().getFaction(factionId);
        if (!faction) return [];
        return (faction.relationships || []).map((rel) => ({
          ...rel,
          sourceFactionId: factionId,
          sourceName: faction.name,
          targetName: get().getFaction(rel.targetFactionId)?.name || rel.targetFactionId
        }));
      },

      getFullRelationshipGraph: () => {
        const factions = get().factions;
        const edges = [];
        const seen = new Set();

        factions.forEach((faction) => {
          (faction.relationships || []).forEach((rel) => {
            const key = [faction.id, rel.targetFactionId].sort().join('|');
            if (!seen.has(key)) {
              seen.add(key);
              edges.push({
                source: faction.id,
                target: rel.targetFactionId,
                type: rel.type,
                description: rel.description,
                sourceName: faction.name,
                targetName: factions.find((f) => f.id === rel.targetFactionId)?.name || rel.targetFactionId
              });
            }
          });
        });

        return edges;
      },

      getNpcFactions: (npcId) =>
        get().factions.filter((f) => f.members && f.members.some((m) => m.npcId === npcId)),

      getFactionMembersAtLocation: (locationId) => {
        const result = [];
        get().factions.forEach((faction) => {
          (faction.members || [])
            .filter((m) => m.locationId === locationId)
            .forEach((m) => result.push({ ...m, factionId: faction.id, factionName: faction.name }));
        });
        return result;
      },

      addFaction: (faction) => {
        const newFaction = { ...faction, id: faction.id || `faction-${Date.now()}`, isCustom: true };
        set((state) => ({ factions: [...state.factions, newFaction] }));
        triggerFactionAutoSync();
        return newFaction;
      },

      updateFaction: (factionId, updates) => {
        set((state) => ({
          factions: state.factions.map((f) => (f.id === factionId ? { ...f, ...updates, isCustom: true } : f))
        }));
        triggerFactionAutoSync();
      },

      removeFaction: (factionId) => {
        set((state) => ({
          factions: state.factions.filter((f) => f.id !== factionId)
        }));
        triggerFactionAutoSync();
      },

      getRelationshipTypes: () => RELATIONSHIP_TYPES,

      getFactionTypes: () => FACTION_TYPES,

      // --- Cloud Synchronization & Hydration ---
      syncToCloud: async (userId) => {
        if (!userId || userId === 'admin-dev-user' || userId === 'dev-user-123' || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return false;
        try {
          const docRef = doc(db, 'users', userId, 'worldbuilding', 'factions');
          const customFactions = get().factions.filter(f => f.isCustom || !SEEDED_FACTIONS.some(sf => sf.id === f.id));
          await setDoc(docRef, {
            customFactions,
            updatedAt: new Date().toISOString()
          }, { merge: true });
          set({ lastCloudSyncAt: new Date().toISOString() });
          return true;
        } catch (err) {
          console.debug('Factions cloud sync skipped/failed:', err?.message || err);
          return false;
        }
      },

      hydrateFromCloud: async (userId) => {
        if (!userId || userId === 'admin-dev-user' || userId === 'dev-user-123' || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return false;
        try {
          const docRef = doc(db, 'users', userId, 'worldbuilding', 'factions');
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            if (Array.isArray(data?.customFactions) && data.customFactions.length > 0) {
              const remoteCustomMap = new Map(data.customFactions.map(f => [f.id, f]));
              const merged = SEEDED_FACTIONS.map(sf => remoteCustomMap.has(sf.id) ? remoteCustomMap.get(sf.id) : sf);
              data.customFactions.forEach(cf => {
                if (!merged.some(m => m.id === cf.id)) {
                  merged.push(cf);
                }
              });
              set({ factions: merged });
              return true;
            }
          }
        } catch (err) {
          console.debug('Factions cloud hydration skipped/failed:', err?.message || err);
        }
        return false;
      }
    }),
    createStorageConfig('mythrill_factions', {
      partialize: (state) => ({
        factions: state.factions,
        lastCloudSyncAt: state.lastCloudSyncAt
      })
    })
  )
);

export { RELATIONSHIP_TYPES, FACTION_TYPES, SEEDED_FACTIONS };

export default useFactionStore;
