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
    leader: { npcId: 'hark-ash-hammer', title: 'Blood-Priest / Keeper of the First Forge', description: 'The Berserker order, keepers of the Forge of Grum in the Harath-Vault arenas, who countersigned the Skald Council execution order against the Pact-less Unbound.' },
    members: [],
    headquarters: 'harath-vault',
    territory: ['harath-vault'],
    relationships: [],
    classAffinities: ['berserker'],
    lore: 'Founded by Grum Bloodhammer when he first ignited the Blood-Heat. Now fractured along the Unbound schism: the Pact-sworn elders hunt the deep-tunnel settlement of Berserkers who ignite without the ritual.',
    secrets: '',
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
    leader: { npcId: 'sera-three-scars', title: 'Voice of the Ancestral Convergence', description: 'The tri-regional council that fuses the Ordan totemic, Vreken spore, and Skald runic Animist traditions into one art.' },
    members: [],
    headquarters: 'frozen-archive',
    territory: ['frozen-archive'],
    relationships: [],
    classAffinities: ['animist'],
    lore: 'Founded when the three tradition-carriers met at a crossroads and recognized each others scars. The ancestral language is fracturing and only the Convergence-keeper can still hold all three dialects at once.',
    secrets: '',
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
    leader: { npcId: 'vel-otharen', title: 'Senior Signatory of the Canopy-Ledger', description: 'The Arcanoneer signatory body that arbitrates contract-magic from Atropolis Heart-Vault.' },
    members: [],
    headquarters: 'atropolis',
    territory: ['atropolis'],
    relationships: [],
    classAffinities: ['arcanoneer'],
    lore: 'Heir to Valerius who drafted the First Contract with the Keeper. Now the Keeper is rejecting clauses it once accepted and arbitration cannot resolve the Velun Contingency Protocol.',
    secrets: '',
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
    leader: { npcId: 'skadi-glass-eye', title: 'Keeper of the Elk-Rites', description: 'The Augur order, keepers of Cassia elk-rites at the Frozen Archive.' },
    members: [],
    headquarters: 'frozen-archive',
    territory: ['frozen-archive'],
    relationships: [],
    classAffinities: ['augur'],
    lore: 'Founded by Cassia, who read the Deepening in a sacrificed elk. The elk-entrail accuracy has collapsed from 93% to 41% as temporal friction contaminates the readings.',
    secrets: '',
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
    leader: { npcId: 'fex-vestara', title: 'Conclave-Prime / Keeper of the Reconstruction Schematics', description: 'The Chronarch conclave at Frostmaw Holdfast, rebuilding the original time-engine from recorded schematics.' },
    members: [],
    headquarters: 'frostmaw-holdfast',
    territory: ['frostmaw-holdfast'],
    relationships: [],
    classAffinities: ['chronarch'],
    lore: 'Heir to Nesta, who hooked a volcanic-glass time-engine into her chest. Nesta is disappearing from history; if she ceases to exist, temporal friction redistributes to every living Chronarch.',
    secrets: '',
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
    leader: { npcId: 'mor-vereth', title: 'Weaver of the Congregation of the Silence', description: 'The False Prophet cell-network built around Li Weis broken prophecies in the Sundrift Vale.' },
    members: [],
    headquarters: 'starfall-vale',
    territory: ['starfall-vale'],
    relationships: [],
    classAffinities: ['false_prophet'],
    lore: 'Founded by Li Wei, who looked into the void where Sol once shone. The Voice now gives specific instructions, descending toward the Frozen Archives lowest vault something trapped since the Deepening may be using them to free itself.',
    secrets: '',
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
    leader: { npcId: 'merr-cael', title: 'Harbor-Master / Keeper of the Middle Odds', description: 'The Gambit order at Merrowport, splitting along the founding fault-line of luck versus clause.' },
    members: [],
    headquarters: 'merrowport',
    territory: ['merrowport'],
    relationships: [],
    classAffinities: ['gambit'],
    lore: 'Heir to Jax and Lyra. Jax walked into the sea; Lyra radicalized and her Deck-Burners seek to force the universe to choose. The House middleground is shrinking.',
    secrets: '',
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
    leader: { npcId: 'malakor', title: 'Choir-Prime of the Doom-Arithmetic', description: 'The Harbinger order at the Frozen Archive, calculating the doom-arithmetic of realitys tears.' },
    members: [],
    headquarters: 'frozen-archive',
    territory: ['frozen-archive'],
    relationships: [],
    classAffinities: ['harbinger'],
    lore: 'Co-founded by Xyris (who tore reality) and Malakor (who calculated when the tears would consume everything). Each Chaos Pocket bleeds warmth from the buried star, accelerating the end the Choir predicted.',
    secrets: '',
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
    leader: { npcId: 'vrael-forty-seventh', title: 'Last Commander of the Barbed Vow', description: 'The Inquisitor order sworn at the Sunken Spire, baiting Wyrd horrors into living flesh where they can be named and cut.' },
    members: [],
    headquarters: 'sunken-spire',
    territory: ['sunken-spire'],
    relationships: [],
    classAffinities: ['inquisitor'],
    lore: 'Forged from Orvens cold-iron Vreken root and Elias face-baiting Thalren root. Only forty-seven Inquisitors remain and the new deep-grove entities fall outside their entire art.',
    secrets: '',
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
    leader: { npcId: 'bri-vessela', title: 'Keeper of the Phases / Regent of the Lunar Communion', description: 'The Lunarch order in Selenes silence, tending the lunar parasite bound in the Frostwood moonlit groves.' },
    members: [],
    headquarters: 'ironwood-heart',
    territory: ['ironwood-heart'],
    relationships: [],
    classAffinities: ['lunarch'],
    lore: 'Founded by Selene of House Viridane, who bound the dead-moon parasite. The elder parasites are synchronizing every Lunarchs phases toward an unknown convergence the hatching-song of the dead moon.',
    secrets: '',
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
    leader: { npcId: 'bri-vessela', title: 'Voice of the Moonlit Groves', description: 'The hidden Briaran custodians of the Viridane-descended groves where the Lunarch parasite was first bound.' },
    members: [],
    headquarters: 'ironwood-heart',
    territory: ['ironwood-heart'],
    relationships: [],
    classAffinities: ['lunarch'],
    lore: 'The shadow-custodians of House Viridanes refusal, tending the groves the Lunar Communion depends on, and the only living keepers of the Silent Sevenths true name.',
    secrets: '',
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
    leader: { npcId: 'sol-kaessen', title: 'Vigil-Mother / Keeper of the First Scar', description: 'The Martyr order beneath Emberspire, absorbing others suffering into the Devotion Gauge.' },
    members: [],
    headquarters: 'emberspire',
    territory: ['emberspire'],
    relationships: [],
    classAffinities: ['martyr'],
    lore: 'Founded by Sera Solvan, who carved her sacrificed childs name into her arm. Now the houses conscript Martyrs through child-training, and the Devotion Gauge is corrupting into something predatory.',
    secrets: '',
    quests: []
  },
  {
    id: 'tide-choir',
    name: 'The Tide-Choir',
    type: 'guild',
    regionId: 'iceheart-sea',
    icon: '/assets/icons/factions/tide-choir.png',
    colors: { primary: '#555555', secondary: '#888888' },
    publicGoal: 'Decode the recovered lute and decide whether to play the god-shattering note',
    publicDescription: 'The Minstrel order at Merrowport, holding the tide-song as the Iceheart Sea goes silent.',
    leader: { npcId: 'mer-lyrisa', title: 'Tide-Choir Mistress / Keeper of the Silent Frequency', description: 'The Minstrel order at Merrowport, holding the tide-song as the Iceheart Sea goes silent.' },
    members: [],
    headquarters: 'merrowport',
    territory: ['merrowport'],
    relationships: [],
    classAffinities: ['minstrel'],
    lore: 'Founded by Lyris the Tide-Singer, who calmed the gales at the cost of her spoken voice. The sea has fallen silent and the Deep-Born fled the abyss after hearing something sing back.',
    secrets: '',
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
    leader: { npcId: 'vespera', title: 'Blight-Mother / The First Host', description: 'The Plaguebringer Cultivar, disease-hosts of the Bryngloom bog-rot, founded to cure the spore-hush.' },
    members: [],
    headquarters: 'sunken-spire',
    territory: ['sunken-spire'],
    relationships: [],
    classAffinities: ['plaguebringer'],
    lore: 'Founded by Vespera, who injected Sunken Spire decay-moss into her own veins. Her eight-century foundational strain is dying and every Plaguebringer trained from her blood carries a failing inheritance.',
    secrets: '',
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
    publicDescription: 'The Pyrofiend order beneath Emberspire, more basalt than flesh, counting down to Scathrachs collection.',
    leader: { npcId: 'sol-vareths', title: 'Last-Ember / The Most-Converted', description: 'The Pyrofiend order beneath Emberspire, more basalt than flesh, counting down to Scathrachs collection.' },
    members: [],
    headquarters: 'emberspire',
    territory: ['emberspire'],
    relationships: [],
    classAffinities: ['pyrofiend'],
    lore: 'Born when a cabal of Solvarn occultists swallowed Scathrachs burning coals. Scathrach is now calling in all debts simultaneously; no Pyrofiend has ever survived contract collection.',
    secrets: '',
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
    leader: { npcId: 'kor-vasseth', title: 'Threshold-Keeper / Warden of the Waking Graves', description: 'The Revenant order of the Bryngloom peat-bogs, carrying both Koras blood-covenant and Vestpers frost-stasis arts.' },
    members: [],
    headquarters: 'sunken-spire',
    territory: ['sunken-spire'],
    relationships: [],
    classAffinities: ['revenant'],
    lore: 'Forged from two Bryngloom roots. The bog-graves are waking on their own and the dead march toward the Sundered Monoliths; the call routes through the Root-Veil.',
    secrets: '',
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
    leader: { npcId: 'veyra', title: 'Form-Matriarch / Keeper of the Six Forms', description: 'The Shaper order at Frostmaw, keepers of the merged kinetic-and-biological Shaping Forms.' },
    members: [],
    headquarters: 'frostmaw-holdfast',
    territory: ['frostmaw-holdfast'],
    relationships: [],
    classAffinities: ['shaper'],
    lore: 'Founded by Veyra the Mimir chronicler, who merged Sylvanuss momentum dance with Torins body-sculpting art. Young Shapers attempt every transformation at once and burn through their crystalline skin in years.',
    secrets: '',
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
    leader: { npcId: 'thrak-damos', title: 'Bulwark-Captain / Warden of the Void-Scars', description: 'The Spellguard order at the Emberspire forge-keeps, enforcing Damons method of magical defense.' },
    members: [],
    headquarters: 'emberspire',
    territory: ['emberspire'],
    relationships: [],
    classAffinities: ['spellguard'],
    lore: 'Founded by Damon the Emberth smith, who blocked a solar flare with an alchemical tower shield. Ambient magic is rising and Spellguards Void Resonance fills faster than they can purge it.',
    secrets: '',
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
    leader: { npcId: 'varis', title: 'Venom-Master / Keeper of the Slow Cup', description: 'The Toxicologist Distillery in the Frostwood, distilling fog-predator venom into chemical defense.' },
    members: [],
    headquarters: 'the-shallows',
    territory: ['the-shallows'],
    relationships: [],
    classAffinities: ['toxicologist'],
    lore: 'Founded by Varis the Thalren alchemist. The changing fog is spoiling the venoms relied on for generations, degrading in weeks instead of years.',
    secrets: '',
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
    leader: { npcId: 'alaric', title: 'Chain-Lord / The First Bound', description: 'The Warden order at the Chain-Hold in Frostmaw, who tether abominations with chains grafted into their own forearms.' },
    members: [],
    headquarters: 'frostmaw-holdfast',
    territory: ['frostmaw-holdfast'],
    relationships: [],
    classAffinities: ['warden'],
    lore: 'Founded by Alaric the Law-Keeper, who drove an ore-chain through his forearm to hold a specimen for three days. The iron chains are turning brittle in the cold and the Fexric Drall propose chardalyn an alloy that causes madness.',
    secrets: '',
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
    leader: { npcId: 'sylas', title: 'Silent-Master / The First Hunter', description: 'The Apex order of the Frostwood, sensory-trackers who paid with their hearing for absolute focus.' },
    members: [],
    headquarters: 'ironwood-heart',
    territory: ['ironwood-heart'],
    relationships: [],
    classAffinities: ['apex'],
    lore: 'Founded by Sylas, who stalked a conceptual Wyrd-entity for seven days. The mist is learning to hide, deliberately unresponsive, and something large has moved through the Reach for months without trace.',
    secrets: '',
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
