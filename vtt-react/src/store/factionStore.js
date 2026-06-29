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

        targetFactionId: 'unshorn-briaran',

        type: 'hostile',

        description: 'The Briaran reject the Fog Compact entirely, seeing it as spiritual surrender â€” they raid timber caravans and burn ledger-shrines'

      },

      {

        targetFactionId: 'scribe-sentinels',

        type: 'neutral',

        description: 'Tolerated as necessary border guards â€” the mists they patrol keep the fog contained, which benefits everyone'

      }

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

        type: 'vassal',

        description: 'Officially neutral archivists, unofficially House Thalreth\'s most essential servants â€” their quills literally define Thalreth\'s reality'

      },

      {

        targetFactionId: 'house-ordavan',

        type: 'neutral',

        description: 'Share a mutual respect for record-keeping; exchange maps and genealogies along trade routes'

      }

    ],

    classAffinities: ['animist', 'augur'],

    lore:

      'Founded the same year as the Fog Compact. The first Scribe-Sentinels were Thalreth family members who volunteered to have their memories erased before taking their vows, ensuring their objectivity. This tradition continues â€” every new Sentinel surrenders their past.',

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

      'The unyielding northern lords of Nordhalla. When titanic glaciers advanced to grind their mountain keeps into dust, House Skalvyr bargained with the Cosmic Warden to freeze the ice sheets in place permanently. Summer never returned to the north, and the Skalvyr have ruled the frozen fjords ever since, valuing cold-resistance and bloodline purity above all.',

    hiddenAgenda:

      'House Skalvyr is secretly negotiating with renegade Emberth pyrofiends to weaponize geothermal heat as a last-resort power source â€” a dangerous alliance that could draw Keth-Amar\'s attention if the volatile energy signatures are detected.',

    hiddenDescription:

      'The geothermal sumps are failing. Volcanic vents that have burned for centuries are cooling. Skalvyr engineers project total freeze within three generations. Desperate, the house\'s younger generation has made clandestine contact with outcast pyrofiends who claim volcanic fury can be harnessed at a cost the elders refuse to discuss.',

    leader: {

      npcId: 'halvar-skalvyr',

      title: 'High King-Jarl of Nordhalla',

      description:

        'High King-Jarl Halvar Skalvyr ("Járn-Tand" or Iron-Tooth), who consolidated his rule by force, constructed the Sunder-Wall to tax nomads, and governs Nordhalla with an iron grip.'

    },

    members: [

      { npcId: 'halvar-skalvyr', role: 'High King-Jarl', locationId: 'fjord-gate' },

      { npcId: 'sigurd-skalvyr', role: 'Jarl of the Archive (Custodian)', locationId: 'frozen-archive' },

      { npcId: 'frigga-skalvyr', role: 'Geothermal Negotiator', locationId: 'fjord-gate' }

    ],

    headquarters: 'frozen-archive',

    territory: ['frozen-archive', 'fjord-gate', 'rimors-hearth', 'vargtor', 'ymirs-col', 'the-black-firth', 'bloodhammer-sump', 'vesperas-perch'],

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

      }

    ],

    classAffinities: ['minstrel', 'harbinger', 'warden'],

    lore:

      'Skalvyr\'s bargain was the harshest of all seven houses. Where others traded memory or heirs, Skalvyr traded summer itself â€” condemning their entire region to eternal winter in exchange for survival. Every Skalvyr child is taught this: their comfort is built on the suffering of every living thing in Nordhalla.',

    secrets:

      'The geothermal negotiations have already produced results. A prototype heat-engine powered by volatile Emberspire obsidian exists in a sealed chamber beneath the Frozen Archive. It works. It also hums with a resonance that disturbs the glacier-preserved dead whenever it runs.',

    quests: []

  },





  {

    id: 'unshorn-briaran',

    name: 'The Unshorn Briaran',

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

      'The Unlit Veil are the only Astril who can lie â€” and they have built a continent-spanning intelligence network on that singular advantage. Their goal is not conquest but indispensability: a world where no deal closes, no secret stays buried, and no ruler makes a decision without their whispered counsel. Behind this, they work to dismantle the Luminarchy\'s caste system from within, erasing the distinction between Lit and Unlit.',

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

    territory: ['synod-hold', 'merrowport', 'ironjaw-port', 'the-unlit-knoll', 'starfall-vale', 'nova-heath', 'root-veil-scriptorium', 'the-sunken-spire'],

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

        description: 'The Veil\'s intelligence network periodically uncovers Morrath debts the Neth would rather keep buried — a leverage game that cuts both ways'

      }

    ],

    classAffinities: ['gambit', 'toxicologist', 'shaper'],

    lore:

      'The Unlit Veil was founded by an Unlit Astril who realized that being born without star-glow was not a curse but a weapon. The Lit Astril cannot lie â€” their skin blazes with every falsehood. The Unlit have no such glow to betray them. Within a generation, the Veil had stopped trading in goods entirely and shifted to trading in secrets.',

    secrets:

      'The First Liar is not one Unlit. It is a rotating council of seven, each of whom believes they are the only First Liar. None of them know the others exist. The memory-crystals deliver contradictory orders, and whichever order is fulfilled first becomes "the First Liar\'s true intent."',

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

      npcId: 'loras-ordavan',

      title: 'Steppe-Lord',

      description: 'Loras Ordavan, a man who inherited a puppet\'s throne and hasn\'t yet realized it.'

    },

    members: [

      { npcId: 'loras-ordavan', role: 'Steppe-Lord', locationId: 'synod-hold' }

    ],

    headquarters: 'synod-hold',

    territory: ['synod-hold', 'kumis-downs', 'ancestor-wold', 'the-long-steppe', 'mound-camps'],

    relationships: [

      {

        targetFactionId: 'unlit-veil',

        type: 'puppet_master',

        description: 'The Unlit Veil control Ordavan trade policy through embedded advisors â€” the house is a figurehead'

      },

      {

        targetFactionId: 'scribe-sentinels',

        type: 'neutral',

        description: 'Exchange maps and genealogies along trade routes, though the Sentinels increasingly view Ordavan as unreliable'

      }

    ],

    classAffinities: ['augur', 'falseProphet', 'gambit'],

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
      'The Dawn Vigil is the most militant of the Solvarn restoration factions — a fighting order that believes the Sundered Monoliths can be reassembled to restart Sol. Their expeditionary companies — small bands of Solvarn Martyrs, Pyrofiends, and Augurs — operate across all seven regions, recovering Monolith fragments by any means necessary.',
    hiddenAgenda:
      'The Vigil\'s inner council has calculated that reassembling the Monoliths will not restart Sol — it will summon Keth-Amar back to finish the meal. They continue the expeditions not for restoration, but to ensure no one else assembles them first.',
    leader: {
      npcId: 'dawn-vigil-commander',
      title: 'First Dawn',
      description: 'The identity of the First Dawn is a Vigil secret. Commands arrive as sealed basalt tablets delivered by Martyrs who have taken vows of silence.'
    },
    members: [],
    headquarters: 'emberspire-caldera',
    territory: ['emberspire-caldera', 'basalt-shyr', 'cinder-badlands', 'sols-anvil-mesa', 'ember-lagoon', 'cinderhoodoo'],
    relationships: [
      { targetFactionId: 'house-solvan', type: 'allied', description: 'The Vigil is the Solvan house\'s sword-arm — officially deniable, unofficially essential' },
      { targetFactionId: 'deep-alchemists', type: 'rival', description: 'The Alchemists\' Wyrd-experimentation threatens to wake what the Vigil is trying to keep asleep' }
    ],
    classAffinities: ['martyr', 'pyrofiend', 'augur'],
    lore: 'The Vigil was founded in Year 340 of the Dimming by a Martyr who had absorbed so much suffering that she could feel every Monolith fragment\'s location across the continent. She followed the pain like a compass.',
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
      'The Deep Alchemists are the most dangerous sub-faction of the Fexrick — a guild of cold, methodical experimenters who treat living creatures as raw material. Operating from sealed vat-laboratories beneath Frostmaw Crag, they continue the work that created the Groven eight hundred years ago.',
    hiddenAgenda:
      'The Alchemists believe the Wyrd itself can be refined — distilled, purified, and injected — to create a new form of life that transcends both organic and Wyrd biology.',
    leader: {
      npcId: 'deep-alchemist-prime',
      title: 'Prime Alchemist',
      description: 'The current Prime Alchemist has replaced so much of their body with alchemical grafts that no one remembers their original race or gender.'
    },
    members: [],
    headquarters: 'lost-brood-vats',
    territory: ['lost-brood-vats', 'sump-galleries', 'sump-rift', 'gearworks-gulch'],
    relationships: [
      { targetFactionId: 'vat-breakers-guild', type: 'hostile', description: 'The Groven were their creation. The Groven shattered their vats. Neither has forgiven the other.' },
      { targetFactionId: 'vat-breakers-guild', type: 'hostile', description: 'The Vat-Breakers are the direct descendants of the revolt — the Alchemists consider them stolen property' }
    ],
    classAffinities: ['toxicologist', 'plaguebringer', 'shaper'],
    lore: 'The Deep Alchemists pre-date the Dark Bargains. They were refining living matter in the deep tunnels before humans discovered fire. Some of their oldest formulae are written in a language that predates the Wyrd itself.',
    secrets: 'Recent Groven expeditions have returned with evidence of fresh alchemical residue — suggesting the Lost Brood, the broodlings left behind during the Vat-Breakers\' revolt, are still alive.',
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
      'The Vat-Breakers\' Guild is the governing body of the Groven — founded by the first generation who shattered their containment vats and rose against the Deep Alchemists. They maintain the Ancestor-Spans, adjudicate Groven law, and patrol the lower tunnels for signs of renewed Fexric experimentation.',
    hiddenAgenda:
      'The Guild maintains a secret archive of Fexric alchemical formulae — stolen during the revolt — that they study in case they ever need to create more Groven.',
    leader: {
      npcId: 'vat-breaker-foreman',
      title: 'First Foreman',
      description: 'The First Foreman is elected by the Council of Spans and serves until their calcification advances too far — typically 20-30 years.'
    },
    members: [],
    headquarters: 'frostmaw-holdfast',
    territory: ['frostmaw-holdfast', 'the-spans', 'ancestor-gaps', 'the-great-gorge', 'stags-rest-moraine', 'deepchasm-keep'],
    relationships: [
      { targetFactionId: 'deep-alchemists', type: 'hostile', description: 'Eight hundred years of war, temporarily paused. The Alchemists stay in their deep tunnels. The Groven patrol the surface.' },
      { targetFactionId: 'house-tesshan', type: 'allied', description: 'The Tesshan depend on the Ancestor-Spans for all travel above the blizzard-line — a dependency the Groven are increasingly willing to leverage' }
    ],
    classAffinities: ['warden', 'shaper', 'berserker'],
    lore: 'The first foreman of the Guild was the Groven who shattered the first vat. Her calcified skeleton still stands in the Guild hall in Frostmaw Holdfast, her outstretched hand forming the keystone of the main Ancestor-Span.',
    secrets: 'One of the Guild\'s alchemical formulae — stolen from the Deep Alchemists during the revolt — describes a process for reversing calcification. If it works, it could cure the Groven\'s most terrifying condition. If it fails, it could restart the war.',
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
      'House Solvan is the most narratively significant of the seven houses — it was Solvan who wielded the knife that flayed Aex to weave the binding seal. Their heirs were marched north and devoured by Keth-Amar. Their descendants remain in the scorched, soot-choked badlands, refusing to leave because leaving would mean admitting the sacrifice was meaningless.',
    hiddenAgenda:
      'The current Steward of Emberspire believes one of the original Solvarn heirs survived — that Keth-Amar was tricked or placated with a substitute. She is funding expeditions to find the lost heir\'s bloodline.',
    leader: {
      npcId: 'solvan-steward',
      title: 'Steward of Emberspire',
      description: 'The Steward of Emberspire — the Solvan refuse to call anyone "Lord" until the sun returns.'
    },
    members: [],
    headquarters: 'great-forge',
    territory: ['great-forge', 'basalt-shyr', 'cinder-badlands', 'the-ashen-escarpment', 'vulkars-karst', 'slag-gulch', 'harath-vault'],
    relationships: [
      { targetFactionId: 'dawn-vigil', type: 'allied', description: 'The Vigil is Solvan\'s sword-arm, pursuing Monolith fragments that the house cannot officially seek' },
      { targetFactionId: 'house-tesshan', type: 'neutral', description: 'Tesshan coal-iron feeds Solvan forges — a trade relationship neither house can afford to jeopardize despite mutual distrust' }
    ],
    classAffinities: ['martyr', 'pyrofiend', 'spellguard'],
    lore: 'Sera Solvan carved her child\'s name into her flesh with volcanic obsidian. The wound glowed rather than healed. She became the first Martyr, and the Solvan bloodline has been stained by sacrifice ever since.',
    secrets: 'The Steward has found records suggesting the "lost heir" fled to the Sundrift Vale and intermarried with the Ordavan. If true, the Solvan bloodline survives in a house that does not know its own inheritance.',
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
      'House Mereval governs the violent, churning expanse of the Iceheart Sea from Merrowport — a floating city anchored to a warm submarine volcano. Their bargain traded calm waters for navigable sea-lanes that never freeze, dooming the ocean to perpetual storm-cycles.',
    hiddenAgenda:
      'House Mereval has been secretly mapping the deep-ocean trenches beneath the Iceheart, cataloguing what the Myrathil call the Sea Mother — an entity they believe can be bargained with for a second compact.',
    leader: {
      npcId: 'mereval-admiral',
      title: 'High Admiral of Merrowport',
      description: 'The High Admiral rules from the prow of the Wave-Kept, a ship that has not docked in forty years.'
    },
    members: [],
    headquarters: 'merrowport',
    territory: ['merrowport', 'gale-storm-shallows', 'first-shore', 'spindrift-lagoon', 'deepwell-archipelago', 'wraithsound', 'the-saltmaw-estuary', 'kelpies-cove', 'skalds-longport'],
    relationships: [
      { targetFactionId: 'unlit-veil', type: 'neutral', description: 'Uneasy maritime truce — the Veil needs Mereval\'s ships; Mereval needs Veil intelligence' },
      { targetFactionId: 'deep-alchemists', type: 'rival', description: 'Mereval\'s deep-ocean mapping expeditions keep trespassing into the Alchemists\' submerged tunnel-networks — both sides claim the deeps' }
    ],
    classAffinities: ['minstrel', 'gambit', 'warden'],
    lore: 'The Mereval were the first humans to cross the Iceheart Sea, landing at the First Shore eight centuries ago. Their skeletal archers still stand guard there, frozen in eternal watch.',
    secrets: 'The current High Admiral has been dead for three years. The Wave-Kept is being captained by her first mate, who impersonates her voice through a Merryn throat-singing technique. The crew knows. No one has said anything.',
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
      'House Tesshan governs the vertical labyrinth of the Cragjaw Peaks from Frostmaw Holdfast. Their bargain traded visibility for a perpetual blizzard — a snow-veil that hides their fortress-keeps from starving lowland raiders but buries all natural landmarks.',
    hiddenAgenda:
      'The Tessen high council has been secretly negotiating with a faction of Groven separatists who want to break from the Vat-Breakers\' Guild and establish their own Ancestor-Span authority — directly under Tesshan control.',
    leader: {
      npcId: 'tesshan-lord',
      title: 'High-Lord of the Peaks',
      description: 'The High-Lord of Tesshan rules from the uppermost gallery of Frostmaw Holdfast, where the blizzard wind is loudest and the altitude sickness keeps visitors brief.'
    },
    members: [],
    headquarters: 'frostmaw-holdfast',
    territory: ['frostmaw-holdfast', 'sump-galleries', 'iron-ravine', 'frostmaw-massif', 'gearworks-gulch'],
    relationships: [
      { targetFactionId: 'house-skalvyr', type: 'rival', description: 'Disputed territory along the Cragjaw-Nordhalla border. Both houses claim the geothermal vents.' },
      { targetFactionId: 'vat-breakers-guild', type: 'allied', description: 'The Tesshan depend on Groven Ancestor-Spans — the Guild is simultaneously indispensable and increasingly independent' }
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
    publicGoal: 'Govern the Bryngloom Forest in absentia — their authority is mediated entirely through Neth contract-law',
    publicDescription:
      'House Morrath is the ghost among houses — the seventh noble family of the Binding Compact, yet the one with the least surviving record. Unique among the seven: they had nothing left to trade that Keth-Amar would accept, so they borrowed their survival from the Neth rather than striking their own Dark Bargain.',
    hiddenAgenda:
      'House Morrath has been functionally extinct for three centuries. The Velun Pact-Lords of Atropolis continue to issue decrees in Morrath\'s name because a void in the seventh seat would legally invalidate the Binding Compact.',
    leader: {
      npcId: 'morrath-steward',
      title: 'Steward of the Seventh Seat (Velun Appointee)',
      description: 'The current Steward is a Velun Neth who has been "acting" in Morrath\'s name for 317 years. No Morrath descendant has presented themselves to claim the seat in living memory.'
    },
    members: [],
    headquarters: 'atropolis',
    territory: ['atropolis', 'peat-bog-sinks', 'over-shanty', 'morrens-bogpost', 'thalrens-ledger-post', 'vel-keth-bayou', 'aran-glen', 'fangmere-grove', 'widows-quagmire', 'black-fen', 'drowned-dingle', 'hunters-gully', 'merryns-drift'],
    relationships: [
      { targetFactionId: 'scribe-sentinels', type: 'vassal', description: 'The Sentinels maintain the legal archives that prove the Morrath line exists — without their records, the seventh seat would be declared vacant' },
      { targetFactionId: 'unlit-veil', type: 'neutral', description: 'Morrath descendants still exist among the Drun — unrecognized, unnamed, uncounted' }
    ],
    classAffinities: ['arcanoneer', 'falseProphet', 'plaguebringer'],
    lore: 'The Morrath are mentioned in exactly one clause of the First Contract — a rider specifying that their debt to the Neth is "perpetual until a living Morrath heir presents themselves to renegotiate." No heir has ever come.',
    secrets: 'A Morrath descendant IS alive — a Drun woman who burned her name from the First Contract two centuries ago. She does not know her bloodline. The Velun have been searching for her for eighty years.',
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

  puppet_master: { label: 'Puppet Master', color: '#d4700a', icon: 'string', lineStyle: 'solid' }

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
