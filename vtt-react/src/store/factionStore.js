import { create } from 'zustand';



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

   'Preserve their bloodline\'s memories before the encroaching fog erases them entirely â€” the Fog Compact is slowly consuming their descendants\' identities, and the family is racing against its own bargain.',

  hiddenDescription:

   'The fog that protects the Reach does not merely obscure â€” it erases. Every generation of Thalreth loses more of their ancestral memories. The current Lord can no longer recall his own mother\'s face. The ledger-libraries aren\'t just bureaucracy â€” they are the family\'s last thread connecting them to who they were.',

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

    description: 'The Sentinels serve as Thalreth\'s archivists â€” their quills keep the ledgers that preserve the House\'s thinning memory'

   },

   {

    targetFactionId: 'house-skalvyr',

    type: 'rival',

    description: 'Northern trade disputes over timber routes; Skalvyr covets the Reach\'s ironwood for their fjord-keeps'

   },

   {

    targetFactionId: 'trueborn-briaran',

    type: 'hostile',

    description: 'The Briaran reject the Fog Compact entirely, seeing it as spiritual surrender â€” they raid timber caravans and burn ledger-shrines'

   },

  ],

  classAffinities: ['animist', 'warden', 'martyr'],

  lore:

   'House Thalreth was the first of the seven families to bargain during the Deepening. While others sacrificed heirs or territory, Thalreth traded something more insidious: clarity itself. The resulting fog keeps their forests alive but slowly consumes the memories of anyone born under its canopy.',

  secrets:

   'The current Lord has forgotten the location of a critical ledger â€” the one that records the exact terms of the Fog Compact. Without it, no one knows when the fog\'s price will be paid in full.',

  quests: []

 },



 {

  id: 'scribe-sentinels',

  name: 'Scribe-Sentinels',

  type: 'guild',

  regionId: 'frostwood-reach',

  icon: '/assets/icons/factions/scribe-sentinels.png',

  colors: { primary: '#2d2d2d', secondary: '#d4af37' },

  publicGoal: 'Maintain the archives, maps, and genealogies that preserve knowledge against the fog',

  publicDescription:

   'An ancient order of archivists, cartographers, and memory-keepers. Scribe-Sentinels spend their lives in silent shifts, copying records onto heavy calfskin vellum. They are the immune system of the Reach\'s collective memory.',

  hiddenAgenda:

   'Some senior archivists have begun selectively editing the ledgers â€” removing inconvenient truths, altering lineages, and "correcting" history to favor House Thalreth\'s interests.',

  hiddenDescription:

   'The fog doesn\'t just eat memory â€” it makes memory malleable. A small cadre of elder Sentinels discovered they could rewrite the past by simply changing what the ledgers say. Since no one remembers the original events, no one can contradict them.',

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

    description: 'Officially neutral archivists, unofficially House Thalreth\'s most essential servants â€” their quills literally define Thalreth\'s reality'

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

    targetFactionId: 'trueborn-briaran',

    type: 'hostile',

    description: 'The Briaran reject the Sentinels\' ledger-keeping entirely: every Sentinel patrol is an intrusion on hallowed ground'

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

   'House Skalvyr is secretly negotiating with renegade Solari pyrofiends to weaponize geothermal heat as a last-resort power source â€” a dangerous alliance that could draw Keth-Amar\'s attention if the volatile energy signatures are detected.',

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

    description: 'Covet the Reach\'s ironwood for construction â€” the Skalvyr offer nothing in return but cold disdain'

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

   'Skalvyr\'s bargain was the harshest of all seven houses. Where others traded memory or heirs, Skalvyr traded summer itself, condemning their entire region to eternal winter in exchange for survival. Every Skalvyr child is taught this: their comfort is built on the suffering of every living thing in Nordhalla. House Skalvyr struck the Glacier Bargain generations ago, trading summer forever to halt the grinding ice. The Hunger Winter (in the years leading to the Breach). when ancestors consumed their dead: seeded the Hunger Pact in Skald blood. The house has ruled Nordhalla\'s frozen fjords for nearly eight centuries.',

  secrets:

   'The geothermal negotiations have already produced results. A prototype heat-engine powered by volatile Emberspire obsidian exists in a sealed chamber beneath the Frozen Archive. It works. It also hums with a resonance that disturbs the glacier-preserved dead whenever it runs.',

  quests: []

 },





 {

  id: 'trueborn-briaran',

  name: 'The Trueborn Briaran',

  type: 'tribal',

  regionId: 'frostwood-reach',

  icon: '/assets/icons/factions/briaran.png',

  colors: { primary: '#2d5a1e', secondary: '#8b4513' },

  publicGoal: 'Live free of the Fog Compact â€” reject the bargains that traded nature for survival',

  publicDescription:

   'The Briaran are the indigenous people of the Frostwood Reach who refused House Thalreth\'s Fog Compact. They live deep in the untouched ironwood groves, following the old ways â€” hunting, gathering, and maintaining a spiritual connection to the forest that predates the noble houses. They have no written language, no ledgers, and no memory-loss.',

  hiddenAgenda:

   'The Briaran\'s shamans have discovered a way to reverse the Fog Compact. It requires burning the original contract â€” which is stored in the Ledger Halls. They are planning a raid.',

  hiddenDescription:

   'The Briaran shamans call the fog "Thalreth\'s Lie." They have spent generations studying its nature and believe it is not a permanent condition â€” it is a spell sustained by the Compact\'s original text. The text is a living document, and it feeds on the memories the fog consumes. Destroy the text, and the fog starves.',

  leader: {

   npcId: 'thorn-speaker',

   title: 'Thorn-Speaker',

   description:

    'The current Thorn-Speaker, whose birth name was surrendered to the forest. She speaks for the ironwoods, and the ironwoods speak through her â€” literally. Her voice carries the creak of ancient timber.'

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

    description: 'The Briaran see Thalreth as spiritual traitors who sold the forest\'s soul for protection from the cold'

   },

   {

    targetFactionId: 'scribe-sentinels',

    type: 'hostile',

    description: 'The Sentinels patrol the mists that the Briaran consider sacred â€” every patrol is an intrusion on hallowed ground'

   }

  ],

  classAffinities: ['animist', 'apex', 'warden'],

  lore:

   'Briaran children are not named at birth. They earn their names through a rite called the Thorn-Walk, where they enter the deepest ironwood grove alone and do not return until the forest gives them a name â€” or until three days pass, whichever comes first. Those who return nameless are cast out.',

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

   'To most, the Unlit Veil are reliable information brokers and steppe guides â€” expensive but worth it. They control the message-routes through the Sundrift Vale, operate listening posts at every mound-camp, and offer "memory consultation" to settlements that can afford it.',

  hiddenAgenda:

   'The Unlit Veil are Astril who have learned to smother their Lumian glow until their skin runs dark, and they have built a continent-spanning intelligence network on that singular advantage. Their goal is not conquest but indispensability: a world where no deal closes, no secret stays buried, and no ruler makes a decision without their whispered counsel. Behind this, they work to dismantle the Synod\'s authority from within, erasing the distinction between Earthen Astril and Stellar Astril by making both irrelevant.',

  hiddenDescription:

   'The Veil\'s true power is the lie. Every Unlit broker is a trained observer. Every listening post is an intelligence hub. Every consultation contract includes a clause allowing the Veil to "review" the client\'s records. They know who is starving, who is hoarding, who is plotting, and who is vulnerable â€” and they sell this knowledge to the highest bidder, or withhold it from the lowest, as strategy demands.',

  leader: {

   npcId: 'the-first-liar',

   title: 'The First Liar',

   description:

    'No one knows the First Liar\'s real name or whether they are one Unlit or many sharing a title. Their orders arrive as memory-crystal fragments delivered by Unlit couriers who genuinely do not know what message they carry. The instructions are precise, impersonal, and structured in perfect iambic meter â€” a signature no forger has ever replicated.'

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

    description: 'Uneasy maritime truce â€” the Veil needs Mereval\'s ships; Mereval needs Veil intelligence. Neither trusts the other.'

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

   'House Ordavan traded fertile soil for the endless migration, ensuring the steppe\'s grass always returns to feed the great woolly herds â€” but nothing deeper than grass can take root. Their nomadic clans follow the herds along routes mapped by ancestral burial mounds that hum with the last recorded songs of the dead.',

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

    description: 'The Unlit Veil control Ordavan trade policy through embedded advisors â€” the house is a figurehead'

   },

   {

    targetFactionId: 'scribe-sentinels',

    type: 'neutral',

    description: 'Exchange maps and genealogies along trade routes, though the Sentinels increasingly view Ordavan as unreliable'

   }

  ],

  classAffinities: ['augur', 'false_prophet', 'gambit'],

  lore:

   'Ordavan\'s ancestral mounds are more than monuments â€” they are acoustic chambers. Each mound was constructed to capture and preserve the voice-print of a single ancestor. On the anniversary of a death, the mound "sings" â€” a playback of the last words the ancestor spoke. Some families gather at their mounds to hear the same final words, year after year, for generations.',

  secrets:

   'At least three of the ancestral mounds have fallen silent in the past decade. No one knows why. The Steppe-Lord has forbidden investigation, which means he either knows the cause or fears it.',

  quests: []

 },

 {
  id: 'dawn-vigil',
  name: 'Dawn Vigil',
  type: 'religious_order',
  regionId: 'sundale',
  icon: '/assets/icons/factions/dawn-vigil.png',
  colors: { primary: '#d4a030', secondary: '#1a1a2e' },
  publicGoal: 'Expeditionary companies range into every region seeking Monolith fragments. Their sigil is a rising sun pierced by obsidian.',
  publicDescription:
   'The Dawn Vigil is the most militant of the Solvarn restoration factions (a fighting order that believes the Sundered Monoliths can be reassembled to restart Sol. Their expeditionary companies) small bands of Solvarn Martyrs, Pyrofiends, and Augurs: operate across all seven regions, recovering Monolith fragments by any means necessary.',
  hiddenAgenda:
       'The Vigil\'s inner council has calculated that reassembling the Monoliths will not restart Sol: it will summon Keth-Amar back to finish the meal. They continue the expeditions in full knowledge of this, for the inner council means to draw the Sun-Eater down deliberately and bind the predator as Aex once bound Sol — caging it with another sacrifice rather than letting the seal fail on its own terms.',
   leader: {
    npcId: 'dawn-vigil-commander',
    title: 'First Dawn',
    description: 'The identity of the First Dawn is a Vigil secret. In truth, the First Dawn has been dead for eighty years; the basalt tablets are being sent by an Augur who glimpsed the First Dawn\'s final orders in a death-vision and has been executing them ever since.'
   },
   members: [
    { npcId: 'dawn-vigil-commander', role: 'First Dawn (Commander)', locationId: 'emberspire-caldera' },
    { npcId: 'sol-kaessen', role: 'High Priestess of the Risen (Vigil Liaison)', locationId: 'harath-vault' }
   ],
   headquarters: 'emberspire-caldera',
   territory: ['emberspire-caldera', 'basalt-shyr', 'cinder-badlands', 'sols-anvil-mesa', 'ember-lagoon'],
   relationships: [
    { targetFactionId: 'house-solvan', type: 'allied', description: 'The Vigil is the Solvan house\'s sword-arm: officially deniable, unofficially essential' },
    { targetFactionId: 'deep-alchemists', type: 'rival', description: 'The Alchemists\' Wyrd-experimentation threatens to wake what the Vigil is trying to keep asleep' }
   ],
   classAffinities: ['martyr', 'pyrofiend', 'augur'],
  lore: 'The Vigil was founded generations ago by a Martyr who had absorbed so much suffering that she could feel every Monolith fragment\'s location across the continent. She followed the pain like a compass. Originally a quietist monastic order of Martyrs, the Vigil was militarized under Hierophant Aethelgard in the decades following the False Dawn Riots. The Vigil\'s deepest secret: reassembling the Seven Sundered Monoliths would summon Keth-Amar, not Sol.',
  secrets: 'The First Dawn has been dead for eighty years. The basalt tablets are being sent by an Augur who glimpsed the First Dawn\'s final orders in a death-vision and has been executing them ever since.',
  quests: []
 },

 {
  id: 'deep-alchemists',
  name: 'Deep Alchemists',
  type: 'guild',
  regionId: 'cragjaw-peaks',
  icon: '/assets/icons/factions/deep-alchemists.png',
  colors: { primary: '#2d4a1e', secondary: '#8b6914' },
  publicGoal: 'Advance the science of alchemical transformation through any means necessary',
  publicDescription:
   'The Deep Alchemists are the most dangerous sub-faction of the Fexric: a guild of cold, methodical experimenters who treat living creatures as raw material. Operating from sealed vat-laboratories beneath Frostmaw Crag, they continue the work that created the Groven eight hundred years ago.',
  hiddenAgenda:
   'The Alchemists believe the Wyrd itself can be refined (distilled, purified, and injected) to create a new form of life that transcends both organic and Wyrd biology.',
  leader: {
   npcId: 'deep-alchemist-prime',
   title: 'Prime Alchemist',
   description: 'The current Prime Alchemist has replaced so much of their body with alchemical grafts that no one remembers their original race or gender.'
  },
   members: [
    { npcId: 'deep-alchemist-prime', role: 'Prime Alchemist', locationId: 'lost-brood-vats' }
   ],
   headquarters: 'lost-brood-vats',
   territory: ['lost-brood-vats', 'sump-galleries', 'gearworks-gulch'],
   relationships: [
    { targetFactionId: 'vat-breakers-guild', type: 'hostile', description: 'The Groven were their creation. The Groven shattered their vats. Neither has forgiven the other.' },
   { targetFactionId: 'dawn-vigil', type: 'rival', description: 'The Vigil\'s Wyrd-suppression conflicts with the Alchemists\' Wyrd-refinement: two approaches to the same cosmic material' },
   { targetFactionId: 'house-mereval', type: 'rival', description: 'Mereval\'s deep-ocean mapping expeditions keep trespassing into the Alchemists\' submerged tunnel-networks: both sides claim the deeps' }
  ],
  classAffinities: ['toxicologist', 'plaguebringer', 'shaper'],
  lore: 'The Deep Alchemists pre-date the Dark Bargains. They were refining living matter in the deep tunnels before humans discovered fire. Some of their oldest formulae are written in a language that predates the Wyrd itself. Emerged as a distinct guild roughly two thousand years before the Dimming. Created the Groven from captured Thrumm broodlings: and lost control. Sealed themselves into the deepest tunnels after the Vat-Breakers\' Revolt and the War of Thousand Screams.',
  secrets: 'Recent Groven expeditions have returned with evidence of fresh alchemical residue: suggesting the Lost Brood, the broodlings left behind during the Vat-Breakers\' revolt, are still alive.',
  quests: []
 },

 {
  id: 'vat-breakers-guild',
  name: 'Vat-Breakers\' Guild',
  type: 'guild',
  regionId: 'cragjaw-peaks',
  icon: '/assets/icons/factions/vat-breakers.png',
  colors: { primary: '#5a3a1e', secondary: '#8b6b4a' },
  publicGoal: 'Protect Groven sovereignty, maintain the Ancestor-Spans, and prevent any resumption of Fexric alchemical experimentation on living subjects',
  publicDescription:
   'The Vat-Breakers\' Guild is the governing body of the Groven: founded by the first generation who shattered their containment vats and rose against the Deep Alchemists. They maintain the Ancestor-Spans, adjudicate Groven law, and patrol the lower tunnels for signs of renewed Fexric experimentation.',
  hiddenAgenda:
   'The Guild maintains a secret archive of Fexric alchemical formulae (stolen during the revolt) that they study in case they ever need to create more Groven.',
  leader: {
   npcId: 'vat-breaker-foreman',
   title: 'First Foreman',
   description: 'The First Foreman is elected by the Council of Spans and serves until their calcification advances too far: 20-30 years.'
  },
   members: [
    { npcId: 'vat-breaker-foreman', role: 'First Foreman', locationId: 'frostmaw-holdfast' },
    { npcId: 'alaric', role: 'The Bound (Guild Consultant)', locationId: 'frostmaw-holdfast' }
   ],
   headquarters: 'frostmaw-holdfast',
   territory: ['frostmaw-holdfast', 'the-spans', 'ancestor-gaps', 'the-great-gorge', 'stags-rest-moraine', 'deepchasm-keep'],
   relationships: [
    { targetFactionId: 'deep-alchemists', type: 'hostile', description: 'Eight hundred years of war, temporarily paused. The Alchemists stay in their deep tunnels. The Groven patrol the surface.' },
   { targetFactionId: 'house-tesshan', type: 'allied', description: 'The Tesshan depend on the Ancestor-Spans for all travel above the blizzard-line: a dependency the Groven are increasingly willing to exploit' }
  ],
  classAffinities: ['warden', 'shaper', 'berserker'],
  lore: 'The first foreman of the Guild was the Groven who shattered the first vat. Her calcified skeleton still stands in the Guild hall in Frostmaw Holdfast, her outstretched hand forming the keystone of the main Ancestor-Span. Founded during the Vat-Breakers\' Revolt when the first generation of Groven shattered their containment vats at Frostmaw Holdfast. The Guild represents Groven sovereignty and the Ancestor-Span bridge-rights.',
  secrets: 'One of the Guild\'s alchemical formulae (stolen from the Deep Alchemists during the revolt) describes a process for reversing calcification. If it works, it could cure the Groven\'s most terrifying condition. If it fails, it could restart the war.',
  quests: []
 },

 {
  id: 'house-solvan',
  name: 'House Solvan',
  type: 'noble_house',
  regionId: 'sundale',
  icon: '/assets/icons/factions/solvan.png',
  colors: { primary: '#d4700a', secondary: '#1a1a1a' },
  publicGoal: 'Rule Sundale\'s badlands and refuse to abandon the tomb of their star',
  publicDescription:
   'House Solvan is the most narratively significant of the seven houses: it was Solvan who wielded the knife that flayed Aex to weave the binding seal. Their heirs were marched north and devoured by Keth-Amar. Their descendants remain in the scorched, soot-choked badlands, refusing to leave because leaving would mean admitting the sacrifice was meaningless.',
  hiddenAgenda:
   'The current Steward of Emberspire believes one of the original Solvarn heirs survived: that Keth-Amar was tricked or placated with a substitute. She is funding expeditions to find the lost heir\'s bloodline.',
  leader: {
   npcId: 'solvan-steward',
   title: 'Steward of Emberspire',
   description: 'The Steward of Emberspire: the Solvan refuse to call anyone "Lord" until the sun returns.'
  },
   members: [
    { npcId: 'solvan-steward', role: 'Steward of Emberspire (Acting Head)', locationId: 'great-forge' }
   ],
   headquarters: 'great-forge',
   territory: ['great-forge', 'basalt-shyr', 'cinder-badlands', 'the-ashen-escarpment', 'vulkars-karst', 'slag-gulch', 'harath-vault'],
   relationships: [
    { targetFactionId: 'dawn-vigil', type: 'allied', description: 'The Vigil is Solvan\'s sword-arm, pursuing Monolith fragments that the house cannot officially seek' },
   { targetFactionId: 'house-tesshan', type: 'neutral', description: 'Tesshan coal-iron feeds Solvan forges: a trade relationship neither house can afford to jeopardize despite mutual distrust' }
  ],
  classAffinities: ['martyr', 'pyrofiend', 'spellguard'],
  lore: 'Sera Solvan carved her child\'s name into her flesh with volcanic obsidian. The wound glowed rather than healed. She became the first Martyr, and the Solvan bloodline has been stained by sacrifice ever since.',
  secrets: 'The Steward has found records suggesting the "lost heir" fled to the Sundrift Vale and intermarried with the Ordavan. If true, the Solvan bloodline survives in a house that does not know its own inheritance.',
quests: []
  },

  {
  id: 'order-of-solbrand',
  name: 'The Order of Solbrand',
  type: 'military_order',
  regionId: 'sundale',
  icon: '/assets/icons/factions/solbrand.png',
  colors: { primary: '#e8c440', secondary: '#1a0a00' },
  publicGoal: 'Guard Emberspire, the Harath Vault, and the approaches to Sundale; hold the line against Wyrd incursions and Monolith-seekers alike',
  publicDescription:
   'The Order of Solbrand is the ancient military order of Sundale: sun-knights who have held the line at Emberspire since the first century of the Dimming. They are not theologians, not missionaries, not zealots — they are the wall between the vault of Aex and the Wyrd that presses against it. Their oath: "The star sleeps; we wake for it." They recruit from the ash-dwelling commoners of the badlands and the Solvan bloodlines, forging them into heavy infantry who fight in silence, their helms sealed against the ash-choked wind. Their sigil is a white sun on black basalt, the colors of the Binding seal.',
  hiddenAgenda:
   'The Order\'s inner circle knows the Dawn Vigil intends to reassemble the Monoliths — which will summon Keth-Amar, not Sol. The Solbrand intends to be the wall that stops the Sun-Eater when it comes, buying the world time at the cost of their own annihilation. They have quietly fortified the Ashen Escarpment into a kill-zone of overlapping fields of fire, trap-canyons, and pre-positioned Monolith-shards as Wyrd-bait.',
  leader: {
    npcId: 'grandmaster-solbrand',
    title: 'Grandmaster of the Sun',
    description: 'The Grandmaster of the Sun is elected by the Chapter of Ten for a seven-year term, or until death. The current Grandmaster, a Solvan noble who carved his own sun-sword from a fragment of Emberspire\'s caldera glass, has held the post for seventeen years — longer than any predecessor since the Dimming began.'
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
    { targetFactionId: 'house-solvan', type: 'allied', description: 'The Order guards the house\'s ancestral duty: the vault and the seal. The Steward funds the Order; the Order defends the house\'s claim to legitimacy.' },
    { targetFactionId: 'dawn-vigil', type: 'tense_allied', description: 'The Vigil is the Order\'s most capable ally against the Wyrd — but the Order knows the Vigil\'s true purpose is to draw Keth-Amar down. They cooperate on Monolith-shard recovery but never share intelligence on the seal.' },
    { targetFactionId: 'covenant-of-the-scar', type: 'allied', description: 'The Martyrs of the Scar are the Order\'s most reliable battlefield companions; their ability to absorb punishment complements the Order\'s hold-the-line doctrine.' },
    { targetFactionId: 'cult-of-forgotten-shadow', type: 'hostile', description: 'The Cult seeks to wake Keth-Amar; the Order exists to keep it asleep. Kill on sight.' }
  ],
  classAffinities: ['martyr', 'spellguard', 'warden'],
  lore: 'The Order was founded in Year 47 of the Dimming by a Solvan captain who watched his entire company burn holding the Emberspire approaches while the first Monolith cracked. He swore the Order would never again let the seal be challenged without a shield in front of it. Eight centuries later, the Order still holds the Ashen Escarpment — the only stretch of the Sundale frontier where the Wyrd has never breached the first line.',
  secrets: 'The Order has quietly acquired three Sundered Monolith fragments (from the Ashen Escarpment, the Harath Vault, and a failed Vigil expedition). They do not seek to reassemble the Monoliths; they study the fragments to understand Keth-Amar\'s resonance, preparing a targeted counter-ritual to shatter the predator\'s connection to the seal when it comes.',
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
  lore: 'The Mereval were the first humans to cross the Iceheart Sea, landing at the First Shore eight centuries ago. Their skeletal archers still stand guard there, frozen in eternal watch.',
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
   'House Morrath is the ghost among houses: the replacement seventh house elevated after Viridane fled the Blooding, yet the one with the least surviving record. Unlike the original six: they had nothing left to trade that Keth-Amar would accept, so they borrowed their survival from the Neth rather than striking their own Dark Bargain. The official records list them as the seventh house of the Binding, but the truth is subtler — they were installed to fill the gap Viridane left.',
  hiddenAgenda:
   'House Morrath has been functionally extinct for three centuries. The Velun Pact-Lords of Atropolis continue to issue decrees in Morrath\'s name because a void in the seventh seat would legally invalidate the Binding Compact.',
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
   'The forgotten seventh house: struck from every record by the six houses who sealed Keth-Amar\'s bargain. When the other houses marched their firstborn to the northern peaks as sacrifice, Viridane refused and fled south through the Frostwood Reach, making a counter-bargain with fae entities in the moonlit groves. Their descendants are the Briaran.',
  hiddenAgenda:
   'House Viridane does not seek restoration. The original bloodline made peace with being forgotten eight centuries ago. What they seek is the final truth: what spoke to them in the moonlit groves before Keth-Amar\'s whispers could reach them, and whether that presence has a price that is still due.',
  leader: {
   npcId: 'thorn-speaker',
   title: 'Voice of the Ironwood',
   description: 'The Thorn-Speaker is the closest thing Viridane has to a leader: a Briaran elder who remembers the oral history of the flight south and speaks for the Trueborn in the deep groves.'
  },
   members: [
    { npcId: 'thorn-speaker', role: 'Voice of the Ironwood (De Facto Leader)', locationId: 'ironwood-heart' }
   ],
   headquarters: 'ironwood-heart',
   territory: ['ironwood-heart', 'frostwood-reach'],
   relationships: [
    { targetFactionId: 'trueborn-briaran', type: 'successor', description: 'The Trueborn Briaran are the direct descendants of House Viridane: they carry the original fae contract in their blood and thorns' },
    { targetFactionId: 'house-thalreth', type: 'rival', description: 'The Thalreth participated in the erasure of Viridane from every record and still enforce the Sovereign Ledger\'s silence on the original seventh house, now remembered by the folk as the "eighth house" — the wound in human history' }
  ],
  classAffinities: ['lunarch', 'apex'],
  lore: 'House Viridane made a counter-bargain with ancient fae entities in the Frostwood\'s moonlit groves during their flight south generations ago. The Briaran still carry this contract in their flesh: their thorns migrate toward unfulfilled promises. The seven houses spent three centuries erasing every trace of Viridane\'s existence. The Briaran have been hiding ever since.',
  secrets: 'The original fae contract still exists: a living document grown from thorn-vine and moonlight, buried beneath the oldest Briaran grove. It can be read only by a Briaran Lunarch during a lunar eclipse. The contract contains a clause that the Briaran have never invoked: the fae entities owe House Viridane a debt that has never been collected.',
  quests: []
 },

 {
  id: 'bloodhammer-line',
  name: 'The Bloodhammer Line',
  type: 'military',
  regionId: 'sundale',
  icon: '/assets/icons/factions/bloodhammer-line.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Keep the Forge of Grum lit and police who may carry the Hunger Pact',
  publicDescription: 'The Berserker order, keepers of the Forge of Grum in the Harath-Vault arenas, who countersigned the Skald Council execution order against the Pact-less Unbound.',
  leader: { npcId: 'hark-ash-hammer', title: 'Blood-Priest / Keeper of the First Forge', description: 'Hark Ash-Hammer is a scarred, furnace-eyed elder whose hands are permanently blackened from tending the First Forge. He carries the weight of knowing three of his own bloodline ignite without the rite, a secret that gnaws at his conviction in the Pact he swore to enforce.' },
   members: [
    { npcId: 'hark-ash-hammer', role: 'Blood-Priest / Keeper of the First Forge', locationId: 'harath-vault' }
   ],
   headquarters: 'harath-vault',
   territory: ['harath-vault'],
    relationships: [
     { targetFactionId: 'house-skalvyr', type: 'rival', description: 'The Bloodhammer line blames Skalvyr hunger-wars for the exile that drove their ancestors south to Emberspire.' },
    { targetFactionId: 'house-solvan', type: 'allied', description: 'Both forge-cults honor Grum; the line keeps the Solvan-forged forges lit beneath Emberspire.' }
   ],
   classAffinities: ['berserker'],
   lore: 'Founded by Grum Bloodhammer when he first ignited the Blood-Heat. Now fractured along the Unbound schism: the Pact-sworn elders hunt the deep-tunnel settlement of Berserkers who ignite without the ritual.',
   secrets: 'The Pact-sworn elders know the location of the deep-tunnel Unbound settlement and have twice declined to burn it, because three of their own bloodline ignite without the rite.',
  quests: []
 },
 {
  id: 'ancestral-convergence',
  name: 'The Ancestral Convergence',
  type: 'guild',
  regionId: 'nordhalla',
  icon: '/assets/icons/factions/ancestral-convergence.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Hold the three Animist dialects together as they fracture',
  publicDescription: 'The tri-regional council that fuses the Ordan totemic, Vreken spore, and Skald runic Animist traditions into one art.',
  leader: { npcId: 'sera-three-scars', title: 'Voice of the Ancestral Convergence', description: 'Sera Three-Scars earned her name and her authority by surviving the three initiation rites of Ordan, Vreken, and Skald Animism, each one leaving a permanent mark on her spirit. She is the last living speaker capable of holding all three ancestral dialects at once, and lately she has begun hearing a fourth that no ancestor should be speaking.' },
   members: [
    { npcId: 'sera-three-scars', role: 'Voice of the Ancestral Convergence', locationId: 'frozen-archive' }
   ],
   headquarters: 'frozen-archive',
   territory: ['frozen-archive'],
    relationships: [
     { targetFactionId: 'house-ordavan', type: 'allied', description: 'The Ordan totemic root is one of the three the Convergence binds together.' },
    { targetFactionId: 'cult-of-forgotten-shadow', type: 'hostile', description: 'The cult speaks for the silence the Animists say is devouring the ancestors.' }
   ],
   classAffinities: ['animist'],
   lore: 'Founded when the three tradition-carriers met at a crossroads and recognized each others scars. The ancestral language is fracturing and only the Convergence-keeper can still hold all three dialects at once.',
   secrets: 'The Convergence-keeper has begun hearing a fourth dialect in the silence between the other three, one no ancestor should still be speaking.',
  quests: []
 },
 {
  id: 'canopy-ledger',
  name: 'The Canopy-Ledger',
  type: 'guild',
  regionId: 'bryngloom-forest',
  icon: '/assets/icons/factions/canopy-ledger.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Arbitrate the First Contract and keep the Heart-Vault clauses valid',
  publicDescription: 'The Arcanoneer signatory body that arbitrates contract-magic from Atropolis Heart-Vault.',
  leader: { npcId: 'vel-otharen', title: 'Senior Signatory of the Canopy-Ledger', description: 'Vel Otharen is a meticulous, parchment-pale Arcanoneer who inherited Valerius\'s seat at the Heart-Vault and the moral burden of the Velun Contingency Protocol along with it. He has personally buried the clause that would void all Morrath debts, fearing what its revelation would unleash on Atropolis.' },
   members: [
    { npcId: 'vel-otharen', role: 'Senior Signatory of the Canopy-Ledger', locationId: 'atropolis' }
   ],
   headquarters: 'atropolis',
   territory: ['atropolis'],
    relationships: [
     { targetFactionId: 'house-morrath', type: 'allied', description: 'The Canopy-Ledger arbitrates the Neth contract-magic that holds Morrath in being.' },
    { targetFactionId: 'unlit-veil', type: 'rival', description: 'The Veil trades in secrets the Arcanoneers are sworn to file and seal.' }
   ],
   classAffinities: ['arcanoneer'],
   lore: 'Heir to Valerius who drafted the First Contract with Morvane. Now Morvane is rejecting clauses it once accepted and arbitration cannot resolve the Velun Contingency Protocol.',
   secrets: 'The Velun Contingency Protocol contains a clause that would void every Morrath debt at once if a living heir were ever proven, and the Canopy-Ledger has buried it on purpose.',
  quests: []
 },
 {
  id: 'frozen-order-of-the-elk',
  name: 'The Frozen Order of the Elk',
  type: 'religious_order',
  regionId: 'nordhalla',
  icon: '/assets/icons/factions/frozen-order-of-the-elk.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Maintain the elk-entrail auguries and the ritual calendar',
  publicDescription: 'The Augur order, keepers of Cassia elk-rites at the Frozen Archive.',
  leader: { npcId: 'skadi-glass-eye', title: 'Keeper of the Elk-Rites', description: 'Skadi Glass-Eye replaced her left eye with a frozen elk-stone during her initiation, and she claims it lets her see the omens that the living elk no longer provide. She has hidden three weepings from Cassia\'s preserved body since the silence began, dreading what they foretell.' },
   members: [
    { npcId: 'skadi-glass-eye', role: 'Keeper of the Elk-Rites', locationId: 'frozen-archive' }
   ],
   headquarters: 'frozen-archive',
   territory: ['frozen-archive'],
    relationships: [
     { targetFactionId: 'scribe-sentinels', type: 'allied', description: 'The Augurs depend on Sentinels to preserve the elk-rites against the fog.' },
    { targetFactionId: 'cult-of-forgotten-shadow', type: 'hostile', description: 'The cult readings threaten to replace the elk-auguries with the silence.' }
   ],
   classAffinities: ['augur'],
   lore: 'Founded by Cassia, who read the Deepening in a sacrificed elk. The elk-entrail accuracy has collapsed from 93% to 41% as temporal friction contaminates the readings.',
   secrets: 'Cassias preserved body weeps frozen tears only when a pulse should have come; the Order has hidden three such weepings since the silence began.',
  quests: []
 },
 {
  id: 'frostmaw-conclave',
  name: 'The Frostmaw Conclave',
  type: 'guild',
  regionId: 'cragjaw-peaks',
  icon: '/assets/icons/factions/frostmaw-conclave.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Rebuild Nestas time-dilation engine before its inventor disappears',
  publicDescription: 'The Chronarch conclave at Frostmaw Holdfast, rebuilding the original time-engine from recorded schematics.',
  leader: { npcId: 'fex-vestara', title: 'Conclave-Prime / Keeper of the Reconstruction Schematics', description: 'Fex Vestara is a precise, restless Chronarch whose hands tremble with temporal friction from studying Nesta\'s vanishing too closely. She guards a partial recording of Nesta\'s voice that rewinds the listener by several heartbeats, and fears that rebuilding the time-engine will hasten Nesta\'s erasure from history.' },
   members: [
    { npcId: 'fex-vestara', role: 'Conclave-Prime / Keeper of the Reconstruction Schematics', locationId: 'frostmaw-holdfast' }
   ],
   headquarters: 'frostmaw-holdfast',
   territory: ['frostmaw-holdfast'],
    relationships: [
     { targetFactionId: 'vat-breakers-guild', type: 'allied', description: 'The Chronarchs rebuild Nestas engine with Groven calcified stone and spans.' },
    { targetFactionId: 'deep-alchemists', type: 'hostile', description: 'The Alchemists would seize the time-engine to refine the Wyrd.' }
   ],
   classAffinities: ['chronarch'],
   lore: 'Heir to Nesta, who hooked a volcanic-glass time-engine into her chest. Nesta is disappearing from history; if she ceases to exist, temporal friction redistributes to every living Chronarch.',
   secrets: 'The Conclave has a partial recording of Nestas voice from before she vanished, and playing it rewinds whoever listens by several heartbeats.',
  quests: []
 },
 {
  id: 'congregation-of-the-silence',
  name: 'The Congregation of the Silence',
  type: 'cult',
  regionId: 'sundrift-vale',
  icon: '/assets/icons/factions/congregation-of-the-silence.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Decode and obey the Voice of the Silence',
  publicDescription: 'The False Prophet cell-network built around Li Weis broken prophecies in the Sundrift Vale.',
  leader: { npcId: 'mor-vereth', title: 'Weaver of the Congregation of the Silence', description: 'Mor Vereth is a gaunt, hollow-voiced False Prophet who channels the Voice of the Silence to a network of devoted cells across Sundrift Vale. He has received instructions to open the Frozen Archive\'s lowest vault, and he believes obeying will free something that has been trapped since the Deepening.' },
   members: [
    { npcId: 'mor-vereth', role: 'Weaver of the Congregation of the Silence', locationId: 'starfall-vale' }
   ],
   headquarters: 'starfall-vale',
   territory: ['starfall-vale'],
    relationships: [
     { targetFactionId: 'cult-of-forgotten-shadow', type: 'allied', description: 'The Congregation receives the same silence the cult opened.' },
    { targetFactionId: 'dawn-vigil', type: 'rival', description: 'The Vigil calls the False Prophet heresy and hunts the cell-network.' }
   ],
   classAffinities: ['false_prophet'],
   lore: 'Founded by Li Wei, who looked into the Silence where Sol once shone. The Voice now gives specific instructions, descending toward the Frozen Archives lowest vault something trapped since the Deepening may be using them to free itself.',
   secrets: 'Mor Vereth has received instructions to open the Frozen Archives lowest vault, where something trapped since the Deepening is waiting to be freed.',
  quests: []
 },
 {
  id: 'merrowport-house',
  name: 'The Merrowport House',
  type: 'guild',
  regionId: 'iceheart-sea',
  icon: '/assets/icons/factions/merrowport-house.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Keep the Gambit order solvent between its two vanished founders camps',
  publicDescription: 'The Gambit order at Merrowport, splitting along the founding fault-line of luck versus clause.',
  leader: { npcId: 'merr-cael', title: 'Harbor-Master / Keeper of the Middle Odds', description: 'Merr Cael is a silver-tongued Gambit elder who walks the narrowing line between Jax\'s luck-faith and Lyra\'s radical clause-burning. He profits from the Luck-Ledger\'s doomed voyages in silence, knowing the alternative is losing Merrowport dock access to the Brine-Bond Syndicate.' },
   members: [
    { npcId: 'merr-cael', role: 'Harbor-Master / Keeper of the Middle Odds', locationId: 'merrowport' }
   ],
   headquarters: 'merrowport',
   territory: ['merrowport'],
    relationships: [
     { targetFactionId: 'house-mereval', type: 'allied', description: 'The gambling-house runs inside Mereval sea-charter waters.' },
     { targetFactionId: 'brine-bond-syndicate', type: 'neutral', description: 'The Syndicate taxes the luck the House wagers against, but the House pays without protest — the alternative is losing Merrowport dock access.' }
   ],
   classAffinities: ['gambit'],
   lore: 'Heir to Jax and Lyra. Jax walked into the sea; Lyra radicalized and her Deck-Burners seek to force the universe to choose. The House middleground is shrinking.',
   secrets: 'The House sits on a deck of marked cards: it knows which Merrowport voyages the Luck-Ledger has quietly doomed, and profits from the silence.',
  quests: []
 },
 {
  id: 'doom-choir',
  name: 'The Doom-Choir',
  type: 'religious_order',
  regionId: 'nordhalla',
  icon: '/assets/icons/factions/doom-choir.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Compute and proclaim the exact arithmetic of the worlds end',
  publicDescription: 'The Harbinger order at the Frozen Archive, calculating the doom-arithmetic of realitys tears.',
  leader: { npcId: 'malakor', title: 'Choir-Prime of the Doom-Arithmetic', description: 'Malakor is a cold, luminous Harbinger who co-founded the Doom-Choir after Xyris tore reality and he calculated the timeline of its collapse. He alone has computed a second date, later than the first, when the tears will not consume everything — and he has told no one.' },
   members: [
    { npcId: 'malakor', role: 'Choir-Prime of the Doom-Arithmetic', locationId: 'frozen-archive' },
    { npcId: 'valeria-the-grim', role: 'Doom-Chanter', locationId: 'frozen-archive' }
   ],
   headquarters: 'frozen-archive',
   territory: ['frozen-archive'],
    relationships: [
     { targetFactionId: 'house-skalvyr', type: 'allied', description: 'The Choir computes the doom-arithmetic from the Frozen Archive under Skalvyr.' },
    { targetFactionId: 'cult-of-forgotten-shadow', type: 'hostile', description: 'The cult would hasten the end the Choir only predicts.' }
   ],
   classAffinities: ['harbinger'],
   lore: 'Co-founded by Xyris (who tore reality) and Malakor (who calculated when the tears would consume everything). Each Chaos Pocket bleeds warmth from the buried star, accelerating the end the Choir predicted.',
   secrets: 'Malakor has computed a second date, later than the first, when the tears will not consume everything, and he has told no one.',
  quests: []
 },
 {
  id: 'barbed-vow',
  name: 'The Barbed Vow',
  type: 'military',
  regionId: 'bryngloom-forest',
  icon: '/assets/icons/factions/barbed-vow.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Hunt the Wyrd-corrupted; sever every face-stealing contract',
  publicDescription: 'The Inquisitor order sworn at the Sunken Spire, baiting Wyrd horrors into living flesh where they can be named and cut.',
  leader: { npcId: 'vrael-forty-seventh', title: 'Last Commander of the Barbed Vow', description: 'Vrael Forty-Seventh earned his number by being the forty-seventh Inquisitor to survive the deep-grove trials, and he suspects he may be the last. He has catalogued forty-seven face-stealing contracts that the old art was never built to sever, and each one wears a face he once knew.' },
   members: [
    { npcId: 'vrael-forty-seventh', role: 'Last Commander of the Barbed Vow', locationId: 'the-sunken-spire' }
   ],
   headquarters: 'the-sunken-spire',
   territory: ['the-sunken-spire'],
    relationships: [
     { targetFactionId: 'scribe-sentinels', type: 'allied', description: 'The Inquisitors share the Sentinels ledger-keep of the groves.' },
    { targetFactionId: 'cult-of-forgotten-shadow', type: 'hostile', description: 'The cult is the deep-grove corruption the Barbed Vow was sworn to cut.' }
   ],
   classAffinities: ['inquisitor'],
   lore: 'Forged from Orvens cold-iron Vreken root and Elias face-baiting Thalren root. Only forty-seven Inquisitors remain and the new deep-grove entities fall outside their entire art.',
   secrets: 'The Inquisitors have catalogued forty-seven face-stealing contracts in the deep groves, none of which their old art was built to sever.',
  quests: []
 },
 {
  id: 'lunar-communion',
  name: 'The Lunar Communion',
  type: 'religious_order',
  regionId: 'frostwood-reach',
  icon: '/assets/icons/factions/lunar-communion.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Transcribe Selenes whispers and hold the caste-factions from civil war',
  publicDescription: 'The Lunarch order in Selenes silence, tending the lunar parasite bound in the Frostwood moonlit groves.',
  leader: { npcId: 'bri-vessela', title: 'Keeper of the Phases / Regent of the Lunar Communion', description: 'Bri Vessela is a serene, moonlit Lunarch whose bones carry a fragment of Selene\'s stellar binding, pulsing in time with the elder parasites\' synchronization. She has decoded part of the hatching-song and fears it names her as the Briaran Lunarch who must be sacrificed to complete the convergence.' },
   members: [
    { npcId: 'bri-vessela', role: 'Keeper of the Phases / Regent of the Lunar Communion', locationId: 'ironwood-heart' }
   ],
   headquarters: 'ironwood-heart',
   territory: ['ironwood-heart'],
    relationships: [
     { targetFactionId: 'trueborn-briaran', type: 'allied', description: 'The Communion tends the lunar parasite bound in the groves the Trueborn guard.' },
    { targetFactionId: 'congregation-of-the-silence', type: 'rival', description: 'The False Prophets preach a silence the Lunarchs say is devouring the fallen star from the inside.' }
   ],
   classAffinities: ['lunarch'],
   lore: 'Founded by Selene of House Viridane, who bound a fragment of a dormant fallen star to her bones. The elder parasites — brood of the same stellar fragment — are synchronizing every Lunarch\'s phases toward an unknown convergence scholars call the hatching-song of the fallen star.',
   secrets: 'The Communion has decoded part of the hatching-song and believes it names a Briaran Lunarch who must be sacrificed to complete the convergence.',
  quests: []
 },
 {
  id: 'briaran-groves',
  name: 'The Briaran Groves',
  type: 'tribal',
  regionId: 'frostwood-reach',
  icon: '/assets/icons/factions/briaran-groves.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Guard the deepest moonlit groves where the fae old-law holds',
  publicDescription: 'The hidden Briaran custodians of the Viridane-descended groves where the Lunarch parasite was first bound.',
  leader: { npcId: 'bri-vessela', title: 'Voice of the Moonlit Groves', description: 'As Voice of the Moonlit Groves, Bri Vessela speaks the old fae law in the groves the seven houses tried to erase. She alone among the Briaran still holds the Silent Seventh\'s true name, spoken only when a Viridane descendant is initiated into the deepest covenants.' },
   members: [
    { npcId: 'bri-vessela', role: 'Voice of the Moonlit Groves', locationId: 'ironwood-heart' }
   ],
   headquarters: 'ironwood-heart',
   territory: ['ironwood-heart'],
    relationships: [
     { targetFactionId: 'trueborn-briaran', type: 'allied', description: 'The Groves are the Trueborn custodians of the same moonlit groves.' },
    { targetFactionId: 'house-thalreth', type: 'hostile', description: 'Thalreth erases the groves memory from every ledger it controls.' }
   ],
   classAffinities: ['lunarch'],
   lore: 'The shadow-custodians of House Viridanes refusal, tending the groves the Lunar Communion depends on, and the only living keepers of the Silent Sevenths true name.',
   secrets: 'The Groves alone still hold the Silent Sevenths true name, spoken only when a Viridane descendant is initiated into the old law.',
  quests: []
 },
 {
  id: 'covenant-of-the-scar',
  name: 'The Covenant of the Scar',
  type: 'religious_order',
  regionId: 'sundale',
  icon: '/assets/icons/factions/covenant-of-the-scar.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Tend Sera Solvans original scar and the willing-suffering Vow',
  publicDescription: 'The Martyr order beneath Emberspire, absorbing others suffering into the Devotion Gauge.',
  leader: { npcId: 'sol-kaessen', title: 'Vigil-Mother / Keeper of the First Scar', description: 'Sol-Kaessen is a weathered Martyr whose arms bear the carved names of the suffering she has absorbed into the Devotion Gauge beneath Emberspire. She suspects the Gauge can be inverted to drain pain into a single vessel, and she fears the houses already conscript Martyrs for exactly that purpose.' },
   members: [
    { npcId: 'sol-kaessen', role: 'Vigil-Mother / Keeper of the First Scar', locationId: 'emberspire-caldera' }
   ],
   headquarters: 'emberspire-caldera',
   territory: ['emberspire-caldera'],
    relationships: [
     { targetFactionId: 'dawn-vigil', type: 'allied', description: 'The Covenant is the Vigils martyr-heart beneath Emberspire.' },
     { targetFactionId: 'the-sunderers', type: 'hostile', description: 'The Sunderer would extinguish Sol\'s Breath the Scar-Martyr tends.' }
   ],
   classAffinities: ['martyr'],
   lore: 'Founded by Sera Solvan, who carved her sacrificed childs name into her arm. Now the houses conscript Martyrs through child-training, and the Devotion Gauge is corrupting into something predatory.',
   secrets: 'Sol-Kaessen suspects the Devotion Gauge can be inverted to drain others suffering into a single chosen Martyr, and the houses already conscript for it.',
  quests: []
 },
 {
  id: 'tide-choir',
  name: 'The Tide-Choir',
  type: 'guild',
  regionId: 'iceheart-sea',
  icon: '/assets/icons/factions/tide-choir.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Decode the recovered lute and decide whether to play the star-shattering note',
  publicDescription: 'The Minstrel order at Merrowport, holding the tide-song as the Iceheart Sea goes silent.',
  leader: { npcId: 'mer-lyrisa', title: 'Tide-Choir Mistress / Keeper of the Silent Frequency', description: 'Mer-Lyrisa is a soft-spoken Minstrel who lost her own voice to the tide-song long ago, communicating only through harmonic resonance. She recovered a lute from the silent sea that could shatter the nearest Monolith if played correctly, and she has told no one — not the Vigil, not her own choir.' },
   members: [
    { npcId: 'mer-lyrisa', role: 'Tide-Choir Mistress / Keeper of the Silent Frequency', locationId: 'merrowport' }
   ],
   headquarters: 'merrowport',
   territory: ['merrowport'],
    relationships: [
     { targetFactionId: 'house-mereval', type: 'allied', description: 'The Choir sings under Mereval charter from Merrowport.' },
    { targetFactionId: 'cult-of-forgotten-shadow', type: 'hostile', description: 'The cult stilled the sea the Minstrels once calmed.' }
   ],
   classAffinities: ['minstrel'],
   lore: 'Founded by Lyris the Tide-Singer, who calmed the gales at the cost of her spoken voice. The sea has fallen silent and the Deep fled the abyss after hearing something sing back.',
   secrets: 'Mer-Lyrisa recovered a lute from the silent sea that, played correctly, would shatter the nearest Monolith, and she has not told the Vigil.',
  quests: []
 },
 {
  id: 'cultivar',
  name: 'The Cultivar',
  type: 'guild',
  regionId: 'bryngloom-forest',
  icon: '/assets/icons/factions/cultivar.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Engineer a successor disease-strain before Vesperas foundational strain dies',
  publicDescription: 'The Plaguebringer Cultivar, disease-hosts of the Bryngloom bog-rot, founded to cure the spore-hush.',
  leader: { npcId: 'vespera', title: 'Blight-Mother / The First Host', description: 'Vespera is a centuries-old Plaguebringer whose veins run with the Sunken Spire\'s original decay-moss, the foundational bog-rot strain now slowly dying within her. She races to engineer a successor strain before her failing inheritance claims every Plaguebringer she trained from her own blood.' },
   members: [
    { npcId: 'vespera', role: 'Blight-Mother / The First Host', locationId: 'the-sunken-spire' }
   ],
   headquarters: 'the-sunken-spire',
   territory: ['the-sunken-spire'],
    relationships: [
     { targetFactionId: 'twice-born', type: 'allied', description: 'The Cultivar and the Revenants share the bog-dead the plague feeds on.' },
    { targetFactionId: 'house-morrath', type: 'rival', description: 'Morrath registry taxes the disease-hosts the Cultivar will not register.' }
   ],
   classAffinities: ['plaguebringer'],
    lore: 'Founded by Vespera, who injected Sunken Spire decay-moss into her own veins. Her three-century foundational strain is dying and every Plaguebringer trained from her blood carries a failing inheritance.',
   secrets: 'Vesperas foundational strain is dying because the bog-rot has learned to fear something in the waking graves, and is abandoning its hosts.',
  quests: []
 },
 {
  id: 'ashen-communion',
  name: 'The Ashen Communion',
  type: 'cult',
  regionId: 'sundale',
  icon: '/assets/icons/factions/ashen-communion.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Organize the Pyrofiends into the Apostates Path before Scathrach collects every debt',
  publicDescription: 'The Pyrofiend order beneath Emberspire, more basalt than flesh, counting down to Scathrach\'s collection.',
  leader: { npcId: 'sol-vareths', title: 'Last-Ember / The Most-Converted', description: 'Sol-Vareths is a Pyrofiend whose flesh is more basalt than skin, transformed further than any other in the Communion by Scathrach\'s burning coals. He has calculated the exact moment Scathrach will collect every debt and is secretly preparing his order to greet the collection rather than flee it.' },
   members: [
    { npcId: 'sol-vareths', role: 'Last-Ember / The Most-Converted', locationId: 'emberspire-caldera' }
   ],
   headquarters: 'emberspire-caldera',
   territory: ['emberspire-caldera'],
    relationships: [
     { targetFactionId: 'house-solvan', type: 'allied', description: 'The Communion serves Solvan forge-cults beneath Emberspire.' },
     { targetFactionId: 'the-risen', type: 'hostile', description: 'The Risen tend Sol\'s Breath the Ashen Communion says is already claimed.' }
   ],
   classAffinities: ['pyrofiend'],
   lore: 'Born when a cabal of Solvarn occultists swallowed Scathrach\'s burning coals. Scathrach is now calling in all debts simultaneously; no Pyrofiend has ever survived contract collection.',
   secrets: 'Sol-Vareths has calculated the exact moment Scathrach will collect every debt, and has prepared the Communion to greet it rather than flee.',
  quests: []
 },
 {
  id: 'twice-born',
  name: 'The Twice-Born',
  type: 'religious_order',
  regionId: 'bryngloom-forest',
  icon: '/assets/icons/factions/twice-born.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Investigate the twelve drained Revenants and stop the dead marching on the Monoliths',
  publicDescription: 'The Revenant order of the Bryngloom peat-bogs, carrying both Koras blood-covenant and Vestpers frost-stasis arts.',
  leader: { npcId: 'kor-vasseth', title: 'Threshold-Keeper / Warden of the Waking Graves', description: 'Kor-Vasseth is a revenant who walks the Bryngloom peat-bogs bearing both Kora\'s blood-covenant and Vestper\'s frost-stasis arts in his undying flesh. He has found twelve drained Revenants with no wounds and believes whatever is calling the dead is harvesting them, not marching them.' },
   members: [
    { npcId: 'kor-vasseth', role: 'Threshold-Keeper / Warden of the Waking Graves', locationId: 'the-sunken-spire' }
   ],
   headquarters: 'the-sunken-spire',
   territory: ['the-sunken-spire'],
    relationships: [
     { targetFactionId: 'canopy-ledger', type: 'allied', description: 'The Revenants file their death-contracts through the Canopy-Ledger.' },
    { targetFactionId: 'cult-of-forgotten-shadow', type: 'hostile', description: 'The cult wakes the graves the Revenants are sworn to settle.' }
   ],
   classAffinities: ['revenant'],
   lore: 'Forged from two Bryngloom roots. The bog-graves are waking on their own and the dead march toward the Sundered Monoliths; the call routes through the Root-Veil.',
   secrets: 'Kor-Vasseth found twelve Revenants drained of blood with no wounds, and believes whatever calls the dead is harvesting them, not marching them.',
  quests: []
 },
 {
  id: 'form-convergence',
  name: 'The Form-Convergence',
  type: 'guild',
  regionId: 'cragjaw-peaks',
  icon: '/assets/icons/factions/form-convergence.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Teach the six Shaping Forms safely while young convergers burn out',
  publicDescription: 'The Shaper order at Frostmaw, keepers of the merged kinetic-and-biological Shaping Forms.',
  leader: { npcId: 'veyra', title: 'Form-Matriarch / Keeper of the Six Forms', description: 'Veyra is an ancient Mimir chronicler who merged Sylvanus\'s momentum dance with Torin\'s body-sculpting art into the six Shaping Forms. She now secretly teaches the forms without their kinetic half to bone-purists, quietly rebuilding the old Formbender art that the merger was meant to erase.' },
   members: [
    { npcId: 'veyra', role: 'Form-Matriarch / Keeper of the Six Forms', locationId: 'frostmaw-holdfast' }
   ],
   headquarters: 'frostmaw-holdfast',
   territory: ['frostmaw-holdfast'],
    relationships: [
     { targetFactionId: 'vat-breakers-guild', type: 'allied', description: 'The Shapers train on Groven calcified stone at Frostmaw.' },
    { targetFactionId: 'deep-alchemists', type: 'hostile', description: 'The Alchemists would claim the Shaping Forms as body-experiment.' }
   ],
   classAffinities: ['shaper'],
   lore: 'Founded by Veyra the Mimir chronicler, who merged Sylvanuss momentum dance with Torins body-sculpting art. Young Shapers attempt every transformation at once and burn through their crystalline skin in years.',
   secrets: 'Veyra has begun teaching the six forms without the kinetic half to bone-purists, rebuilding the old Formbender art the merger was meant to erase.',
  quests: []
 },
 {
  id: 'aegis',
  name: 'The Aegis',
  type: 'military',
  regionId: 'sundale',
  icon: '/assets/icons/factions/aegis.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Dismantle or absorb the rising ambient magic before it bursts',
  publicDescription: 'The Spellguard order at the Emberspire forge-keeps, enforcing Damons method of magical defense.',
  leader: { npcId: 'thrak-damos', title: 'Bulwark-Captain / Warden of the Silence-Scars', description: 'Thrak-Damos is a grim, iron-willed Spellguard who enforces Damon\'s method of magical defense as ambient magic rises faster than his order can purge it. He has found a Silence Scar that would purge Sol\'s Breath itself if left to fill, and he is quietly containing it against orders.' },
   members: [
    { npcId: 'thrak-damos', role: 'Bulwark-Captain / Warden of the Silence-Scars', locationId: 'emberspire-caldera' }
   ],
   headquarters: 'emberspire-caldera',
   territory: ['emberspire-caldera'],
    relationships: [
     { targetFactionId: 'dawn-vigil', type: 'allied', description: 'The Aegis shields the Vigils forge-keeps at Emberspire.' },
    { targetFactionId: 'cult-of-forgotten-shadow', type: 'hostile', description: 'The cult silence would unmake the Spellguard wards.' }
   ],
   classAffinities: ['spellguard'],
   lore: 'Founded by Damon the Solari smith, who blocked a solar flare with an alchemical tower shield. Ambient magic is rising and Spellguards Silence Resonance fills faster than they can purge it.',
    secrets: 'Thrak-Damos has found a Silence Scar that, if left to fill, would purge Sol\'s Breath itself, and he has been quietly containing it against orders.',
  quests: []
 },
 {
  id: 'distillery',
  name: 'The Distillery',
  type: 'guild',
  regionId: 'frostwood-reach',
  icon: '/assets/icons/factions/distillery.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Distill a replacement for the fog-predator venoms that are spoiling',
  publicDescription: 'The Toxicologist Distillery in the Frostwood, distilling fog-predator venom into chemical defense.',
  leader: { npcId: 'varis', title: 'Venom-Master / Keeper of the Slow Cup', description: 'Varis is a patient, methodical Toxicologist whose hands are stained from decades of distilling fog-predator venom in the Frostwood shallows. He has synthesized a replacement venom from the mist itself, but it requires a drop of Mimir mask-resin to stabilize — a compound the Briaran refuse to share.' },
   members: [
    { npcId: 'varis', role: 'Venom-Master / Keeper of the Slow Cup', locationId: 'the-shallows' }
   ],
   headquarters: 'the-shallows',
   territory: ['the-shallows'],
    relationships: [
     { targetFactionId: 'house-thalreth', type: 'allied', description: 'The Distillery supplies Thalreth with fog-venom defense.' },
    { targetFactionId: 'trueborn-briaran', type: 'hostile', description: 'The Briaran withhold the mask-resin the Distillery needs.' }
   ],
   classAffinities: ['toxicologist'],
   lore: 'Founded by Varis the Thalren alchemist. The changing fog is spoiling the venoms relied on for generations, degrading in weeks instead of years.',
   secrets: 'Varis has distilled a replacement venom from the mist itself, one that the fog cannot spoil, but it requires a drop of Mimir mask-resin to stabilize.',
  quests: []
 },
 {
  id: 'the-bound',
  name: 'The Bound',
  type: 'military',
  regionId: 'cragjaw-peaks',
  icon: '/assets/icons/factions/the-bound.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Hold the chain-graft iron tradition against the chardalyn replacement',
  publicDescription: 'The Warden order at the Chain-Hold in Frostmaw, who tether abominations with chains grafted into their own forearms.',
  leader: { npcId: 'alaric', title: 'Chain-Lord / The First Bound', description: 'Alaric is the original Law-Keeper who drove an ore-chain through his own forearm to hold a chained specimen for three days, founding the Warden tradition by flesh and iron. That same specimen still lives in the Chain-Hold, and it answers whenever the iron is struck.' },
   members: [
    { npcId: 'alaric', role: 'Chain-Lord / The First Bound', locationId: 'frostmaw-holdfast' }
   ],
   headquarters: 'frostmaw-holdfast',
   territory: ['frostmaw-holdfast'],
    relationships: [
     { targetFactionId: 'vat-breakers-guild', type: 'allied', description: 'The Wardens tether what the Groven will not let walk free.' },
    { targetFactionId: 'deep-alchemists', type: 'hostile', description: 'The Alchemists breed the abominations the Bound chain.' }
   ],
   classAffinities: ['warden'],
   lore: 'Founded by Alaric the Law-Keeper, who drove an ore-chain through his forearm to hold a specimen for three days. The iron chains are turning brittle in the cold and the Fexric Caustic Fexric propose chardalyn an alloy that causes madness.',
   secrets: 'Alaric kept the specimen he chained for three days alive in the Chain-Hold, and it still answers when the iron is struck.',
  quests: []
 },
 {
  id: 'silent-hunt',
  name: 'The Silent Hunt',
  type: 'guild',
  regionId: 'frostwood-reach',
  icon: '/assets/icons/factions/silent-hunt.png',
  colors: { primary: '#555555', secondary: '#888888' },
  publicGoal: 'Find what has moved through the Reach for months without leaving a trace',
  publicDescription: 'The Apex order of the Frostwood, sensory-trackers who paid with their hearing for absolute focus.',
  leader: { npcId: 'sylas', title: 'Silent-Master / The First Hunter', description: 'Sylas is a deaf, unnervingly still Apex tracker who paid with his hearing for absolute sensory focus, stalking a conceptual Wyrd-entity for seven days to found his order. He tracked the shapeless thing that moved through the Reach for months and concluded it wears the form of a Scribe-Sentinel dead for a century.' },
   members: [
    { npcId: 'sylas', role: 'Silent-Master / The First Hunter', locationId: 'ironwood-heart' }
   ],
   headquarters: 'ironwood-heart',
   territory: ['ironwood-heart'],
     relationships: [
     { targetFactionId: 'trueborn-briaran', type: 'allied', description: 'The Silent Hunt shares the groves with the Trueborn trackers.' },
    { targetFactionId: 'mist-sentinels', type: 'hostile', description: 'The Sentinels patrol the Reach the Apex say is already hunted.' }
   ],
    classAffinities: ['apex'],
   lore: 'Founded by Sylas, who stalked a conceptual Wyrd-entity for seven days. The mist is learning to hide, deliberately unresponsive, and something large has moved through the Reach for months without trace.',
   secrets: 'Sylas tracked the thing moving through the Reach for months and concluded it wears the shape of a Scribe-Sentinel who has been dead for a century.',
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
    publicDescription: 'The impartial cosmic boundary entity between life, death, memory, and oblivion. Known as Morvane in the Bryngloom; the Root-Veil is Morvane\'s mycelial nervous system by which the Vreken venerate it. Older than Keth-Amar\'s interest in this system.',
   leader: null,
    members: [
     { npcId: 'the-first-liar', role: 'Manifestation of the Boundary (Unbound Agent)', locationId: 'frostwood-reach' }
    ],
    headquarters: null,
    territory: ['ironwood-heart', 'atropolis', 'the-sunken-spire'],
     relationships: [
      { targetFactionId: 'house-viridane', type: 'secret_ally', description: 'Reached Viridane before Keth-Amar could claim them during the Breach. Offered sanctuary in the mist.' },
     { targetFactionId: 'cult-of-forgotten-shadow', type: 'hostile', description: 'Keth-Amar\'s pressure (channeled through the Cult of Forgotten Shadow) is fracturing the Watcher. If the boundary collapses, death and memory cease to exist as categories.' }
    ],
   classAffinities: ['lunarch', 'augur', 'inquisitor', 'arcanoneer'],
   lore: 'The Watcher is the world\'s conscience and memory. It does not serve Aethil. It is not answerable to Keth-Amar. It reached House Viridane at the last possible moment during the Breach, hid the false Monolith in a pocket of forgotten memory, and now cannot find it either — the erasure worked too well. It is fracturing under Keth-Amar\'s pressure, and if it breaks, the boundary between life and death collapses entirely.',
    secrets: 'The Watcher did not outmaneuver Keth-Amar — it gambled at the last moment and does not know if it will hold. The false Monolith is lost inside the Watcher\'s own territory, a splinter it cannot extract without unmaking itself. The timeline fracture is the Watcher\'s fracture bleeding into reality.',
    quests: []
   },

  {
   id: 'scribe-cartel',
   name: 'Scribe-Cartel',
   type: 'guild',
   regionId: 'frostwood-reach',
   icon: '/assets/icons/factions/scribe-cartel.png',
   colors: { primary: '#3a2d1a', secondary: '#d4af37' },
   publicGoal: 'Monopolize the Soot-Resin Ink and Peat-Parchment that resist the fog\'s memory-erosion',
   publicDescription: 'The Frostwood royal monopoly on fog-resistant ink and parchment, without which no record survives the memory-fog. The Cartel taxes every shipment leaving Greymark Keep and licenses who may write.',
   leader: { npcId: 'caedren-thalreth', title: 'Cartel-Master of the Quill', description: 'The Scribe-Cartel\'s licensing authority is held by a Thalreth Master Scribe who controls the ink-wells of the Reach.' },
   members: [
    { npcId: 'caedren-thalreth', role: 'Cartel-Master of the Quill', locationId: 'scribes-tower' }
   ],
   headquarters: 'scribes-tower',
   territory: ['scribes-tower', 'greymark-keep'],
   relationships: [
    { targetFactionId: 'scribe-sentinels', type: 'rival', description: 'The Sentinels copy records for free; the Cartel sells the ink that makes copying possible and resents their independence.' },
    { targetFactionId: 'house-thalreth', type: 'allied', description: 'The Cartel is the enforcement-arm of Thalreth\'s Sovereign Ledger, taxing every written word in the Reach.' }
   ],
   classAffinities: ['toxicologist', 'augur'],
   lore: 'Born the same year as the Fog Compact, the Scribe-Cartel arose to monopolize Soot-Resin Ink and Peat-Parchment, the only materials the memory-fog cannot eat. It turned literacy into a licensed privilege and made the Reach\'s archives dependent on its wells.',
   secrets: 'The Cartel quietly dilutes its ink for outlying settlements, knowing the fog will erase their records faster, which keeps them petitioning Greymark for re-registration, and paying.',
   quests: []
  },
  {
   id: 'steam-line-cartel',
   name: 'Steam-Line Cartel',
   type: 'guild',
   regionId: 'cragjaw-peaks',
   icon: '/assets/icons/factions/steam-line-cartel.png',
   colors: { primary: '#3a2a1a', secondary: '#c08040' },
   publicGoal: 'Control the geothermal pipeline network that keeps the Cragjaw Peaks from freezing',
   publicDescription: 'The Cragjaw geothermal guild that consolidated from the wreckage of the First Thermal War, taxing every vent and pipeline that carries warmth through the vertical labyrinth.',
   leader: { npcId: 'tesshan-lord', title: 'Pipe-Lord of the Sump', description: 'The Steam-Line Cartel\'s flow-charters are countersigned by House Tesshan, who depend on its pipes for survival.' },
   members: [
    { npcId: 'tesshan-steward', role: 'Pipe-Lord of the Sump (Steward Proxy)', locationId: 'frostmaw-holdfast' }
   ],
   headquarters: 'frostmaw-holdfast',
   territory: ['frostmaw-holdfast', 'gearworks-gulch'],
   relationships: [
    { targetFactionId: 'vat-breakers-guild', type: 'rival', description: 'The Groven built the spans the pipes run across; the Cartel charges them transit tolls on their own stone.' },
    { targetFactionId: 'house-tesshan', type: 'allied', description: 'The Tesshan high council licenses the Cartel\'s pipeline monopoly in exchange for guaranteed warmth.' }
   ],
   classAffinities: ['chronarch', 'warden'],
   lore: 'The Steam-Line Cartel emerged from the First Thermal War\'s wreckage, consolidating control of the surviving geothermal pipes. Where the vents fail, the Cartel throttles what remains, and the Cragjaw\'s population learns which settlements matter.',
   secrets: 'The Cartel has been quietly rerouting heat away from Groven lower-sumps toward Tesshan keeps for a generation, and the famine it caused is blamed on Emberspire.',
   quests: []
  },
  {
   id: 'mist-sentinels',
   name: 'Mist-Sentinels',
   type: 'military',
   regionId: 'frostwood-reach',
   icon: '/assets/icons/factions/mist-sentinels.png',
   colors: { primary: '#2d3a4a', secondary: '#6b8fa0' },
   publicGoal: 'Patrol the Ironwood Palisade and police movement between the Ledgered and the Forgotten',
   publicDescription: 'The Frostwood memory-wardens, a border guard raised during the Memory Wars to hold the Ironwood Palisade against Forgotten fugitives and Briaran raids.',
   leader: { npcId: 'caedren-thalreth', title: 'Warden-Captain of the Palisade', description: 'The Mist-Sentinels report to the Scribe-Cartel\'s licensing authority, who fund their patrols.' },
   members: [
    { npcId: 'caedren-thalreth', role: 'Warden-Captain of the Palisade', locationId: 'the-shallows' }
   ],
   headquarters: 'the-shallows',
   territory: ['the-shallows', 'ironwood-heart', 'greythorn-copse'],
   relationships: [
    { targetFactionId: 'trueborn-briaran', type: 'hostile', description: 'The Briaran raid the palisade checkpoints and shelter Forgotten fugitives the Sentinels are sworn to return.' },
    { targetFactionId: 'house-thalreth', type: 'allied', description: 'The Sentinels are the armed fist of Thalreth\'s Sovereign Ledger along the timber border.' }
   ],
   classAffinities: ['inquisitor', 'apex'],
   lore: 'Raised during the Memory Wars when the Scribe-Cartel\'s ink-monopoly turned literacy into a privilege, the Mist-Sentinels police the Ironwood Palisade. They are memory-wardens first and border-guards second, and they answer to Greymark.',
   secrets: 'A cadre of Sentinels has been quietly selling passage permits to the Forgotten they are sworn to catch, pocketing the fees in unrecorded coin.',
   quests: []
  },
  {
   id: 'brine-bond-syndicate',
   name: 'Brine-Bond Syndicate',
   type: 'merchant',
   regionId: 'iceheart-sea',
   icon: '/assets/icons/factions/brine-bond-syndicate.png',
   colors: { primary: '#1a3a4e', secondary: '#5a9aae' },
   publicGoal: 'Control Merrowport docking rights and tax the storm-luck of every Merryn sailor',
   publicDescription: 'The Iceheart sea-cartel formalized at Merrowport to quantify and tax storm-luck through the Luck-Ledger, gatekeeping who may sail the storm-lanes.',
   leader: { npcId: 'mereval-steward', title: 'Bond-Holder of the Luck-Ledger', description: 'The Syndicate\'s charters are issued under House Mereval\'s Sea-Charter, and the Steward holds the master ledger on behalf of the absent Grand Admiral.' },
   members: [
    { npcId: 'mereval-steward', role: 'Bond-Holder of the Luck-Ledger (Steward Proxy)', locationId: 'merrowport' }
   ],
   headquarters: 'merrowport',
   territory: ['merrowport', 'brinehorse-cove', 'spindrift-lagoon'],
   relationships: [
    { targetFactionId: 'house-mereval', type: 'rival', description: 'The Syndicate was meant to serve Mereval\'s Board of Trade but now rivals it for control of the sea-lanes.' },
    { targetFactionId: 'merrowport-house', type: 'neutral', description: 'The Merrowport gambling-house operates inside Syndicate waters and pays its luck-tolls without complaint.' }
   ],
   classAffinities: ['gambit', 'minstrel'],
   lore: 'Formalized at Merrowport as the Iceheart Monolith\'s influence worsened the storms, the Brine-Bond Syndicate turned storm-luck into an inheritable, tradeable commodity. Whoever holds the Luck-Ledger holds the sea.',
   secrets: 'The Syndicate has been quietly selling doomed voyages to debtors it wants gone, marking their luck before they sail and collecting the insurance either way.',
   quests: []
  },
  {
   id: 'drun-outcasts',
   name: 'The Drun Outcasts',
   type: 'tribe',
   regionId: 'bryngloom-forest',
   icon: '/assets/icons/factions/drun-outcasts.png',
   colors: { primary: '#3a3a3a', secondary: '#7a7a7a' },
   publicGoal: 'Survive outside the First Contract and the Great Registry',
    publicDescription: 'Neth who severed their names from the First Contract, legally nonexistent, magic-immune, and invisible to Morvane\'s enforcement. They dwell in the Over-Shanty and the deep bog.',
   leader: { npcId: 'saren-vel', title: 'The Nameless Flame', description: 'The Drun have no single leader; the closest is the memory of Saren-Vel, who burned her name first.' },
   members: [
    { npcId: 'saren-vel', role: 'The Nameless Flame (Founder)', locationId: 'over-shanty' }
   ],
   headquarters: 'over-shanty',
   territory: ['over-shanty', 'black-fen', 'vel-keth-bayou'],
   relationships: [
    { targetFactionId: 'scribe-sentinels', type: 'hostile', description: 'The Sentinels hunt Drun as walking gaps in the ledger; the Drun answer with forged voids no quill can fill.' },
    { targetFactionId: 'house-morrath', type: 'allied', description: 'Morrath descendants hide among the Drun; the two share the condition of being unwritten by the seventh seat.' }
   ],
   classAffinities: ['plaguebringer', 'revenant'],
       lore: 'Born when Saren-Vel burned her name from the First Contract, the Drun are Neth who chose legal nonexistence over Morvane\'s tightening cage. They exist outside the contract system — their words carry no pact-weight, their actions cast no legal shadow, and they cannot be bound because they no longer exist.',
   secrets: 'A Drun woman among them is a living Morrath heir who burned her name two centuries ago and does not know her bloodline, the same one the Velun have hunted for eighty years.',
   quests: []
  },
  {
   id: 'cult-of-forgotten-shadow',
   name: 'Cult of Forgotten Shadow',
   type: 'cult',
   regionId: 'bryngloom-forest',
   icon: '/assets/icons/factions/cult-of-forgotten-shadow.png',
   colors: { primary: '#1a1a2e', secondary: '#4a2d6b' },
   publicGoal: 'Make two-way contact with the deep dark and hasten Keth-Amar\'s intrusion',
   publicDescription: 'The organized merger of the Over-Shanty bog-cult and disillusioned Dawn Vigil defectors who learned that Monolith reassembly summons Keth-Amar, not Sol. They serve as a channel for the Sun-Eater\'s whispers through the cracks.',
   leader: { npcId: 'mor-vereth', title: 'Weaver of the Forgotten', description: 'The Congregation\'s Mor Vereth and the cult\'s bog-priests share the same silence; the cult speaks through both.' },
   members: [
    { npcId: 'mor-vereth', role: 'Weaver of the Forgotten (Cult Leader)', locationId: 'the-sunken-spire' }
   ],
   headquarters: 'the-sunken-spire',
   territory: ['the-sunken-spire', 'over-shanty', 'atropolis'],
   relationships: [
    { targetFactionId: 'dawn-vigil', type: 'rival', description: 'The Vigil hunts the cult as apostate; the cult believes the Vigil\'s secret knowledge proves them right.' },
    { targetFactionId: 'watcher-in-the-mist', type: 'hostile', description: 'The cult\'s contact strains the Watcher\'s boundary; if the Watcher fractures, the silence they speak into becomes absolute.' }
   ],
   classAffinities: ['false_prophet', 'revenant'],
   lore: 'The Cult of Forgotten Shadow is the organized union of the Over-Shanty bog-cult and Dawn Vigil defectors who learned the truth: reassembling the Monoliths summons Keth-Amar, not Sol. It acts as a channel for the Sun-Eater\'s direct whispers through the cracks, for there is no independent Voice.',
   secrets: 'The cult has made the first intentional two-way contact with Keth-Amar since the Breach, and something answered that now knows the cultists\' names.',
   quests: []
  },
  {
   id: 'the-risen',
   name: 'The Risen',
   type: 'religious_order',
   regionId: 'sundale',
   icon: '/assets/icons/factions/the-risen.png',
   colors: { primary: '#d4a030', secondary: '#1a1a2e' },
    publicGoal: 'Tend Sol\'s Breath and keep the faith that Sol will return',
    publicDescription: 'The old Solari faithful of Sundale who hold the Harath-Vault and tend Sol\'s Breath, believing Sol will rise when the seal is whole again, not when the Vigil forces it.',
    leader: { npcId: 'sol-kaessen', title: 'Vigil-Mother of the Risen', description: 'The Risen gather around the Covenant of the Scar\'s Sol-Kaessen, who still calls Sol\'s Breath Sol\'s warmth.' },
    members: [
     { npcId: 'sol-kaessen', role: 'High Priestess of the Risen' }
    ],
   headquarters: 'harath-vault',
   territory: ['harath-vault', 'emberspire-caldera'],
   relationships: [
    { targetFactionId: 'house-solvan', type: 'allied', description: 'The Risen are the living heart of Solvan faith; the house protects the vault they tend.' },
      { targetFactionId: 'the-sunderers', type: 'hostile', description: 'The Sunderer call Sol\'s Breath Keth-Amar\'s feeding-line and would put it out; the Risen call them heretics and mean it.' },
     { targetFactionId: 'the-scoured', type: 'hostile', description: 'The Scoured deface their forge-marks and seek to seal the Breach entirely, refusing to tend Sol\'s Breath.' }
   ],
   classAffinities: ['martyr', 'pyrofiend'],
    lore: 'The Risen hold to the original Solari theology: keep Sol\'s Breath at any cost, hide the Monolith shards, and Sol will rise the day the seal is whole. They are the largest of the three Sol\'s Breath factions and the slowest to raise a hand against a brother.',
    secrets: 'The Risen\'s Hollow-Solari tenders have measured Sol\'s Breath\'s failure for decades and concealed it, just as the Vigil once did, because the faith cannot survive the truth.',
   quests: []
  },
  {
   id: 'the-sunderers',
   name: 'The Sunderer',
   type: 'cult',
   regionId: 'sundale',
   icon: '/assets/icons/factions/the-sunderers.png',
   colors: { primary: '#a12323', secondary: '#1a1a1a' },
    publicGoal: 'Tear out Sol\'s Breath and starve Keth-Amar rather than feed the dying star',
    publicDescription: 'The heretical schism within the Scoured who believe Sol\'s Breath is Keth-Amar\'s tether, draining Sol\'s last warmth one swallow at a time. Their answer is to put the flame out and let Sol go.',
   leader: { npcId: 'sol-vareths', title: 'Last-Ember of the Sunderer', description: 'The Ashen Communion\'s Sol-Vareths preaches the Sunderer gospel among the younger Waste-Solari and Vigil defectors.' },
    members: [
     { npcId: 'sol-vareths', role: 'Last-Ember / Firebrand Preacher', locationId: 'emberspire-caldera' }
    ],
   headquarters: 'emberspire-caldera',
   territory: ['emberspire-caldera', 'basalt-shyr'],
   relationships: [
    { targetFactionId: 'the-risen', type: 'hostile', description: 'The Risen tend what the Sunderer call a mouth; the two fight over every ember of the failing flame.' },
     { targetFactionId: 'dawn-vigil', type: 'rival', description: 'The Vigil has named the Sunderer anathema for preaching that Sol\'s Breath must be extinguished.' },
    { targetFactionId: 'the-scoured', type: 'rival', description: 'Both factions oppose the Risen, but the Sunderer seek to put the fire out while the Scoured seek to rebuild the original seal.' }
   ],
   classAffinities: ['pyrofiend', 'martyr'],
    lore: 'The Sunderer began as a radical wing of the Scoured who read Sol\'s Breath not as Sol\'s warmth but as Keth-Amar\'s tether, the line through which the Sun-Eater drinks the dying star. They gather among younger Waste-Solari, Vigil defectors, and Ash-Dweller conscripts who have never felt Sol\'s warmth.',
    secrets: 'The Sunderer have identified the precise vent where Sol\'s Breath connects to the partial seal, and a cell is already preparing to collapse it.',
   quests: []
  },
  {
   id: 'the-scoured',
   name: 'The Scoured',
   type: 'cult',
   regionId: 'sundale',
   icon: '/assets/icons/factions/the-scoured.png',
   colors: { primary: '#bfa37a', secondary: '#4a3728' },
   publicGoal: 'Reassemble the Monolith Shards into the original seal to close the Breach',
   publicDescription: 'The shard-hunting faction of the Sundale Civil War, whose members cut the forge-marks from their skin to dedicate themselves to sealing the Breach and letting the sun die in peace.',
   leader: { npcId: 'none', title: 'Decentralized Cell Network', description: 'The Scoured have no single leader, operating in small, independent cells across all seven regions.' },
   members: [
    { npcId: 'sol-vareths', role: 'Cell Coordinator (Sundale Region)', locationId: 'basalt-shyr' }
   ],
   headquarters: 'none',
   territory: ['basalt-shyr', 'cinder-badlands', 'slag-gulch'],
   relationships: [
     { targetFactionId: 'the-risen', type: 'hostile', description: 'The Scoured believe tending Sol\'s Breath is a fool\'s errand that keeps the door open for Keth-Amar.' },
    { targetFactionId: 'the-sunderers', type: 'rival', description: 'The Sunderer seek to extinguish the flame, but the Scoured believe only sealing the Breach with the shards will prevent total consumption.' },
    { targetFactionId: 'dawn-vigil', type: 'hostile', description: 'The Dawn Vigil hunts the Scoured as dangerous heretics who disrupt the reassembly of the Monoliths.' }
   ],
   classAffinities: ['pyrofiend', 'berserker'],
   lore: 'The Scoured deface their forge-marks to sever their ties to Hollow-Solari and Waste-Solari alike. They believe reassembling the Monoliths will summon Keth-Amar back, so they hunt the scattered shards to build the original seal, choosing a clean death for their sun over its consumption.',
   secrets: 'The Scoured have discovered a safe house network that spans all seven regions, allowing them to smuggle Monolith shards under the noses of the noble houses.',
   quests: []
  },
  {
   id: 'neth',
   name: 'The Neth',
   type: 'noble_house',
   regionId: 'bryngloom-forest',
   icon: '/assets/icons/factions/neth.png',
   colors: { primary: '#3a2a4a', secondary: '#9a8fb0' },
   publicGoal: 'Keep the First Contract and govern the Bryngloom through the Great Registry',
        publicDescription: 'The Silver-Touched Pact-Lords, an ancient canopy-dwelling people split by Morvane\'s judgment at the Well of Youth. They divide into the Velun pact-lords, the Kessen weavers of probability, and the Drun outcasts severed from the First Contract.',
   leader: { npcId: 'vellan-archivist', title: 'Regent of the Neth', description: 'The Neth are administered from Atropolis, where the Senior Archivist signs in the Neth\'s name under the First Contract.' },
    members: [
     { npcId: 'vellan-archivist', role: 'Regent of the Neth', locationId: 'atropolis' }
    ],
   headquarters: 'atropolis',
   territory: ['atropolis', 'vel-keth-bayou', 'aran-glen', 'black-fen'],
   relationships: [
    { targetFactionId: 'house-morrath', type: 'allied', description: 'The Neth administer Morrath\'s authority through the Great Registry; the seventh seat exists only because the Neth say it does.' },
    { targetFactionId: 'scribe-cartel', type: 'rival', description: 'The Neth write everything down, while the Scribe-Cartel sells the ink that decides what gets written at all.' }
   ],
   classAffinities: ['arcanoneer', 'revenant'],
        lore: 'The Neth were an ancient canopy-dwelling civilization facing extinction from fertility decline. Their Augurs communed with Morvane and received the Font Vessel for the Well of Youth. Three factions betrayed the quest, and Morvane\'s judgment split the Neth into High Neth (loyalists), Pale Neth (conspirators), and Hallowed Neth (profane drinkers of raw Well-magic). They now govern Atropolis under the First Contract.',
   secrets: 'The Neth blood-crystallizes into volatile shards when a lie is attempted, but a hidden circle has learned to write truths so narrow they deceive without breaking the prohibition, and they rule from it.',
   quests: []
   },
  {
   id: 'astril-earthen',
   name: 'Earthen Astril',
   type: 'cultural',
   regionId: 'sundrift-vale',
   icon: '/assets/icons/factions/astril.png',
   colors: { primary: '#c4d4e0', secondary: '#8b9da8' },
   publicGoal: 'Tend the crystalline heritage of Lumia and maintain the Selunis-ritual',
   publicDescription: 'The Earthen Astril are farmers, hunters, and guardians of the physical Astril communities, responsible for maintaining the Starfall Vale pilgrimage site and protecting the crystalline shards of Lumia.'
  },
  {
   id: 'drall-clan-free',
   name: 'Free Drall Clans',
   type: 'tribe',
   regionId: 'cragjaw-peaks',
   icon: '/assets/icons/factions/default.png',
   colors: { primary: '#5c4a3a', secondary: '#8b7355' },
   publicGoal: 'Reclaim ancestral deep-delving territories and preserve Drall craftsmanship',
   publicDescription: 'The Free Drall Clans are independent Drall communities that rejected guild hierarchy. They operate as scrap-metal recyclers and salvagers in the Cragjaw Peaks, trading reclaimed components with the guild-bound Fexric.'
  },
  {
   id: 'emberth-forge-clans',
   name: 'Solari Forge Clans',
   type: 'guild',
   regionId: 'sundale',
   icon: '/assets/icons/factions/default.png',
   colors: { primary: '#8b4513', secondary: '#d2691e' },
   publicGoal: 'Tend the Sol\'s Breath and maintain the forge-clan traditions across Sundale',
   publicDescription: 'The Solari forge-clans are the collective bloodlines of the Solari people, organized around volcanic calderas. They control Sundale\'s docks, diving rights, and thermal vent access, producing the finest volcanic forge-work in Mythrill.'
  },
  {
   id: 'kessen-weavers',
   name: 'Kessen Weavers of Probability',
   type: 'cult',
   regionId: 'bryngloom-forest',
   icon: '/assets/icons/factions/neth.png',
   colors: { primary: '#4a6b3a', secondary: '#7a9a6a' },
   publicGoal: 'Weave the strands of fate through living-wood craftsmanship and root-reading',
   publicDescription: 'The Kessen are a Neth subfaction who weave probability itself into their living-wood creations. They maintain the Glen Compact at Aran-Glen, creating furniture that continues to grow and bioluminescent moss lamps that predict weather patterns.'
  },
  {
   id: 'kethrin-guild-bound',
   name: 'Guild-Bound Kethrin Fexric',
   type: 'guild',
   regionId: 'cragjaw-peaks',
   icon: '/assets/icons/factions/default.png',
   colors: { primary: '#6b5b3a', secondary: '#a08050' },
   publicGoal: 'Advance Fexric engineering through guild-certified innovation and industrial infrastructure',
   publicDescription: 'The Guild-Bound Kethrin Fexric are the engineering heart of the known world, operating the industrial infrastructure of Gearworks Gulch. They register every invention on the Patent Board and maintain the geothermal pressure-forges that produce unique alloys.'
  },
  {
   id: 'merryn-traders',
   name: 'Merryn Trading Diaspora',
   type: 'guild',
   regionId: 'iceheart-sea',
   icon: '/assets/icons/factions/default.png',
   colors: { primary: '#2a5a6a', secondary: '#5a8a9a' },
   publicGoal: 'Maintain unrestricted trade routes across the Iceheart Sea and Sundale',
   publicDescription: 'The Merryn trading diaspora operate the shipping lanes of Mythrill, transporting goods between Sundale, Merrowport, and every port in between. They control import-export pricing through their extensive maritime network.'
  },
  {
   id: 'morren-peat-cutters',
   name: 'Morren Peat Cutters',
   type: 'guild',
   regionId: 'bryngloom-forest',
   icon: '/assets/icons/factions/default.png',
   colors: { primary: '#3a2a1a', secondary: '#6a4a2a' },
   publicGoal: 'Harvest and distribute Bryngloom peat for fuel and alchemical use',
   publicDescription: 'The Morren peat cutters provide essential labor and root-system maintenance in Aran-Glen in exchange for settlement rights. They have learned Kessen root-reading to identify medicinal compounds in the bog-growth.'
  },
  {
   id: 'myrathil-shore',
   name: 'Shore Myrathil',
   type: 'cultural',
   regionId: 'iceheart-sea',
   icon: '/assets/icons/factions/default.png',
   colors: { primary: '#2a8a7a', secondary: '#5abaaa' },
   publicGoal: 'Custody of the Myrathil coral reefs and marine bioluminescence',
   publicDescription: 'The Shore Myrathil are custodians of the coral reefs around the Spindrift Lagoon, the primary producers of bioluminescent goods. They maintain the underwater tunnels and reef-gardens that sustain Myrathil civilization.'
  },
  {
   id: 'ordan-nomads',
   name: 'Ordan Nomadic Herders',
   type: 'tribe',
   regionId: 'sundrift-vale',
   icon: '/assets/icons/factions/default.png',
   colors: { primary: '#7a6a4a', secondary: '#b09a6a' },
   publicGoal: 'Maintain the seasonal migration circuits across the Sundrift Vale steppe',
   publicDescription: 'The Ordan nomadic herders follow the grass-line south before frost and north before the thaw, maintaining the ancient migration circuits. They provision the Astril pilgrimage route and pay the Herd-Tithe to House Ordavan.'
  },
  {
   id: 'rime-born',
   name: 'Rime-Born',
   type: 'cult',
   regionId: 'nordhalla',
   icon: '/assets/icons/factions/default.png',
   colors: { primary: '#8ab4d4', secondary: '#4a7a9a' },
   publicGoal: 'Preserve and interpret the Deep Carvings of the Glacier Bargain',
   publicDescription: 'The Rime-Born are a Skald subfaction who maintain the ancient runic carvings at the tor garrison. They believe the carvings record the Glacier Bargain itself and provide magical support to the Skalvyr garrison in exchange for access to the carvings.'
  },
  {
   id: 'skald-keepers',
   name: 'Skald Keepers of the Ancestral Memory',
   type: 'guild',
   regionId: 'nordhalla',
   icon: '/assets/icons/factions/default.png',
   colors: { primary: '#6a4a3a', secondary: '#9a7a5a' },
   publicGoal: 'Maintain the genealogical records and guard the ancestral vaults of the Skald',
   publicDescription: 'The Skald Keepers maintain the genealogies of every Skald bloodline and guard the vaults of the Frozen Archive. They operate the Correction Ledger where disputes over lineage are debated and ruled upon.'
  },
  {
   id: 'veiled-mimir',
   name: 'Veiled Mimir',
   type: 'religious',
   regionId: 'frostwood-reach',
   icon: '/assets/icons/factions/default.png',
   colors: { primary: '#4a3a5a', secondary: '#8a6aaa' },
   publicGoal: 'Harvest and preserve memories through Mirror Mere memory-glass',
   publicDescription: 'The Veiled Mimir are founders and custodians of the Mirror Mere, harvesting memory-glass from the lakebed and carving it into masks, lenses, and divination tools. They guard the secrets of their craft and the mere\'s unique alchemy.'
  },
  {
   id: 'velun-pact-lords',
   name: 'Velun Pact Lords',
   type: 'noble_house',
   regionId: 'bryngloom-forest',
   icon: '/assets/icons/factions/neth.png',
   colors: { primary: '#5a4a7a', secondary: '#9a7aaa' },
   publicGoal: 'Ensure the Glen Compact remains consistent with the First Contract',
   publicDescription: 'The Velun Pact Lords are a Neth subfaction who serve as legal liaisons between Aran-Glen and Atropolis. They trace their bloodline to the original scribes who presented the First Contract to Morvane and maintain the binding agreements that govern Neth society.'
   },
   {
    id: 'astril-synod',
    name: 'The Astril Synod',
    type: 'governing_council',
    regionId: 'sundrift-vale',
    icon: '/assets/icons/factions/astril.png',
    colors: { primary: '#c4d4e0', secondary: '#8b9da8' },
    publicGoal: 'Govern the Sundrift Vale and preserve Astril heritage through the Echo-Submersion tradition',
    publicDescription: 'A ruling council of the oldest Astril heritage-bloodlines, established in the decades after the Breach to organize the refugee Astril communities of the Sundrift Vale. The Synod codifies law, adjudicates Echo-Submersion cases, and maintains the cultural institutions that preserve Lumia heritage across Earthen and Stellar traditions.',
    hiddenAgenda: 'The Synod\'s inner circle has been quietly suppressing research into the Selunis resonance, fearing that full understanding of the Lumia heritage would reveal the true cost of the Astril escape from their dying world.',
    hiddenDescription: 'The Synod was originally an advisory body of Astril elders. Over eight centuries of institutional inertia, it has become a governing apparatus whose primary function is self-preservation. The council seats are hereditary, and several bloodlines have held theirs since the founding.',
    leader: { npcId: 'the-first-liar', title: 'Synod Archon (Nominal)', description: 'The Synod is chaired by a rotating Archon drawn from the eldest heritage-bloodlines. In practice, the Unlit Veil\'s embedded advisors influence most decisions.' },
    members: [
      { npcId: 'the-first-liar', role: 'Synod Archon (Nominal)', locationId: 'synod-hold' }
    ],
    headquarters: 'synod-hold',
    territory: ['synod-hold', 'novas-heath', 'starfall-vale'],
    relationships: [
      { targetFactionId: 'unlit-veil', type: 'puppet', description: 'The Unlit Veil has embedded advisors throughout the Synod hierarchy — the council believes it governs independently, but policy direction originates from the Shallows.' },
      { targetFactionId: 'house-ordavan', type: 'neutral', description: 'The Ordavan steppe-lords respect Synod authority over the Vale but chafe at trade restrictions.' },
      { targetFactionId: 'scribe-sentinels', type: 'neutral', description: 'The Synod contracts Scribe-Sentinels for record-preservation, though it does not trust their fog-touched ledgers.' },
      { targetFactionId: 'congregation-of-the-silence', type: 'hostile', description: 'The Synod hunts False Prophets as heretics who manufacture revelation to exploit Astril cultural vulnerability.' }
    ],
    classAffinities: ['augur', 'animist'],
    lore: 'Founded in the first century after the Breach when the scattered Astril communities realized that without a central authority, the Lumia heritage would fragment beyond recovery. The Synod established Echo-Submersion as a legal proceeding, codified the distinction between Earthen and Stellar traditions, and built Synod Hold as the administrative heart of the Vale.',
    secrets: 'Three Synod Archons over the past two centuries have been Unlit Veil agents. The current Archon is genuinely Astril but relies on a Veil advisor whose counsel has subtly steered Synod policy for forty years.',
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



const useFactionStore = create((set, get) => ({

 factions: SEEDED_FACTIONS,



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



 addFaction: (faction) =>

  set((state) => ({ factions: [...state.factions, { ...faction, id: faction.id || `faction-${Date.now()}` }] })),



 updateFaction: (factionId, updates) =>

  set((state) => ({

   factions: state.factions.map((f) => (f.id === factionId ? { ...f, ...updates } : f))

  })),



 removeFaction: (factionId) =>

  set((state) => ({

   factions: state.factions.filter((f) => f.id !== factionId)

  })),



 getRelationshipTypes: () => RELATIONSHIP_TYPES,



 getFactionTypes: () => FACTION_TYPES

}));



export { RELATIONSHIP_TYPES, FACTION_TYPES, SEEDED_FACTIONS };

export default useFactionStore;
