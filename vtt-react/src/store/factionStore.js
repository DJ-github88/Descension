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
      'Preserve their bloodline\'s memories before the encroaching fog erases them entirely — the Fog Compact is slowly consuming their descendants\' identities, and the family is racing against its own bargain.',
    hiddenDescription:
      'The fog that protects the Reach does not merely obscure — it erases. Every generation of Thalreth loses more of their ancestral memories. The current Lord can no longer recall his own mother\'s face. The ledger-libraries aren\'t just bureaucracy — they are the family\'s last thread connecting them to who they were.',
    leader: {
      npcId: 'aldren-thalreth',
      title: 'Lord of Greymark',
      description:
        'Lord Aldren Thalreth, aging and increasingly forgetful. He carries a worn leather journal everywhere, re-reading entries about his own life that he no longer remembers writing.'
    },
    members: [
      { npcId: 'aldren-thalreth', role: 'Lord', locationId: 'greymark-keep' },
      { npcId: 'elara-thalreth', role: 'Keeper of the High Hearth', locationId: 'greymark-keep' },
      { npcId: 'caedren-thalreth', role: 'Master Scribe', locationId: 'scribes-tower' }
    ],
    headquarters: 'greymark-keep',
    territory: ['greymark-keep', 'scribes-tower', 'the-shallows'],
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
        targetFactionId: 'unshorn-briaran',
        type: 'hostile',
        description: 'The Briaran reject the Fog Compact entirely, seeing it as spiritual surrender — they raid timber caravans and burn ledger-shrines'
      },
      {
        targetFactionId: 'mist-sentinels',
        type: 'neutral',
        description: 'Tolerated as necessary border guards — the mists they patrol keep the fog contained, which benefits everyone'
      }
    ],
    classAffinities: ['inscriptor', 'warden', 'martyr'],
    lore:
      'House Thalreth was the first of the seven families to bargain during the Deepening. While others sacrificed heirs or territory, Thalreth traded something more insidious: clarity itself. The resulting fog keeps their forests alive but slowly consumes the memories of anyone born under its canopy.',
    secrets:
      'The current Lord has forgotten the location of a critical ledger — the one that records the exact terms of the Fog Compact. Without it, no one knows when the fog\'s price will be paid in full.',
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
      'Some senior archivists have begun selectively editing the ledgers — removing inconvenient truths, altering lineages, and "correcting" history to favor House Thalreth\'s interests.',
    hiddenDescription:
      'The fog doesn\'t just eat memory — it makes memory malleable. A small cadre of elder Sentinels discovered they could rewrite the past by simply changing what the ledgers say. Since no one remembers the original events, no one can contradict them.',
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
    territory: ['scribes-tower', 'ledger-halls'],
    relationships: [
      {
        targetFactionId: 'house-thalreth',
        type: 'vassal',
        description: 'Officially neutral archivists, unofficially House Thalreth\'s most essential servants — their quills literally define Thalreth\'s reality'
      },
      {
        targetFactionId: 'house-ordavan',
        type: 'neutral',
        description: 'Share a mutual respect for record-keeping; exchange maps and genealogies along trade routes'
      }
    ],
    classAffinities: ['inscriptor', 'augur'],
    lore:
      'Founded the same year as the Fog Compact. The first Scribe-Sentinels were Thalreth family members who volunteered to have their memories erased before taking their vows, ensuring their objectivity. This tradition continues — every new Sentinel surrenders their past.',
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
      'House Skalvyr is secretly negotiating with the Cult of Forgotten Shadow to weaponize the Void as a last-resort heat source — a heresy that would shatter their alliance with the Church if discovered.',
    hiddenDescription:
      'The geothermal sumps are failing. Volcanic vents that have burned for centuries are cooling. Skalvyr engineers project total freeze within three generations. Desperate, the house\'s younger generation has made clandestine contact with Shadow priests who claim the Void can generate heat — at a cost the elders refuse to discuss.',
    leader: {
      npcId: 'sigurd-skalvyr',
      title: 'Jarl of Nordhalla',
      description:
        'Jarl Sigurd Skalvyr, a man carved from glacier ice and old oaths. He knows about the Void negotiations. He has not stopped them. He has not endorsed them. He waits.'
    },
    members: [
      { npcId: 'sigurd-skalvyr', role: 'Jarl', locationId: 'frozen-archive' },
      { npcId: 'frigga-skalvyr', role: 'Void Negotiator', locationId: 'fjord-gate' }
    ],
    headquarters: 'frozen-archive',
    territory: ['frozen-archive', 'fjord-gate', 'rimors-hearth'],
    relationships: [
      {
        targetFactionId: 'house-thalreth',
        type: 'rival',
        description: 'Covet the Reach\'s ironwood for construction — the Skalvyr offer nothing in return but cold disdain'
      },
      {
        targetFactionId: 'skald-keepers',
        type: 'allied',
        description: 'The Keepers maintain the glacier-wall genealogies that validate Skalvyr bloodline claims'
      },
      {
        targetFactionId: 'cult-of-forgotten-shadow',
        type: 'secret_ally',
        description: 'Clandestine negotiations for Void-heat technology — a desperate heresy the elders hide from their own people'
      }
    ],
    classAffinities: ['skald', 'doomsayer', 'warden'],
    lore:
      'Skalvyr\'s bargain was the harshest of all seven houses. Where others traded memory or heirs, Skalvyr traded summer itself — condemning their entire region to eternal winter in exchange for survival. Every Skalvyr child is taught this: their comfort is built on the suffering of every living thing in Nordhalla.',
    secrets:
      'The Void negotiations have already produced results. A prototype Void-heat engine exists in a sealed chamber beneath the Frozen Archive. It works. It also whispers to anyone who stands near it.',
    quests: []
  },

  {
    id: 'church-of-the-holy-light',
    name: 'Church of the Holy Light',
    type: 'religious_order',
    regionId: 'frostwood-reach',
    icon: '/assets/icons/factions/church-light.png',
    colors: { primary: '#f5d742', secondary: '#ffffff' },
    publicGoal: 'Spread the faith of the Holy Light, heal the suffering, and preserve spiritual order across the world',
    publicDescription:
      'The oldest organized religion in the known world, founded in the aftermath of Sol\'s entombment. The Church teaches that the Light is a universal force accessible to any who empty themselves of ego and open their hearts to something greater. Its priests, confessors, and healers serve in every major settlement.',
    hiddenAgenda:
      'The senior clergy have discovered something in the oldest sealed texts — a prophecy or a warning — that has driven them to seal entire wings of the Frozen Archive. They are suppressing knowledge, and those who ask too many questions are quietly reassigned to remote parishes or simply disappear.',
    hiddenDescription:
      'The sealed texts speak of "the Light\'s twin" — a force equal and opposite that will awaken when the sun finally dies. The senior clergy believe the Light and the Void are not enemies but a single entity split in two, and that its reunification will end existence. They suppress this knowledge to prevent anyone from seeking reunification.',
    leader: {
      npcId: 'aldren-thalreth',
      title: 'High Confessor (original) / Council of Elders (current)',
      description:
        'The original High Confessor Aldren Thalreth froze himself in meditative stasis. The current leadership is a council of seven anonymous Elders who communicate only through sealed missives.'
    },
    members: [
      { npcId: 'aldren-thalreth', role: 'High Confessor (stasis)', locationId: 'frozen-archive' },
      { npcId: 'valeria-the-grim', role: 'Doomsayer-Priestess', locationId: 'frozen-archive' }
    ],
    headquarters: 'greymark-keep',
    territory: ['greymark-keep', 'frozen-archive', 'atropolis'],
    relationships: [
      {
        targetFactionId: 'house-thalreth',
        type: 'allied',
        description: 'The Church was founded under Thalreth patronage — the two institutions are so intertwined that separating them would collapse both'
      },
      {
        targetFactionId: 'cult-of-forgotten-shadow',
        type: 'hostile',
        description: 'Heresy and apostasy — the Cult\'s embrace of Shadow is everything the Church condemns'
      },
      {
        targetFactionId: 'seers-of-anshe',
        type: 'rival',
        description: 'Theological dispute over the nature of the divine — the Seers worship a god; the Church worships a force'
      }
    ],
    classAffinities: ['martyr', 'exorcist', 'doomsayer', 'inscriptor'],
    lore:
      'The Church was born in the first winter after Sol\'s entombment. The first priests were not theologians — they were desperate parents who discovered that holding a dying child and refusing to accept their death could, sometimes, kindle a warmth that had no physical source. The Church codified this desperate love into doctrine.',
    secrets:
      'The Council of Elders has not met in person for forty years. Some believe the Elders are dead and their missives are forged by the Scribe-Sentinels. The sealed texts in the Frozen Archive may contain the only record of what the Elders actually were.',
    quests: []
  },

  {
    id: 'cult-of-forgotten-shadow',
    name: 'Cult of Forgotten Shadow',
    type: 'shadow_order',
    regionId: 'bryngloom-forest',
    icon: '/assets/icons/factions/cult-shadow.png',
    colors: { primary: '#2d004b', secondary: '#8a6bb0' },
    publicGoal: 'Achieve balance between Light and Shadow — both are necessary, neither is evil',
    publicDescription:
      'Founded by outcast priests who believed the Church\'s rejection of Shadow was not piety but cowardice. The Cult teaches that Light and Shadow are two halves of a single truth, and that to deny either is to embrace ignorance. They practice mind-reading, memory extraction, and emotional manipulation — not as weapons, but as tools of understanding.',
    hiddenAgenda:
      'The Cult\'s inner circle, led by Natalie Seline, has made contact with something in the Void that calls itself "the Silence Between Stars." It claims to be the original source of Shadow magic, and it wants the Cult to open a permanent gateway.',
    hiddenDescription:
      'Natalie Seline did not found the Cult through revelation — she was possessed. For three days and nights in the peat-bogs, something spoke through her, dictating the Cult\'s founding doctrines. She emerged with blank white eyes and knowledge of Void-magic no mortal should possess. The entity still speaks to her. She is no longer certain where its thoughts end and hers begin.',
    leader: {
      npcId: 'natalie-seline',
      title: 'First Shadow, Voice of the Silence',
      description:
        'Natalie Seline, a woman whose eyes show only white. She speaks in two voices — her own, and something deeper that resonates at a frequency just below hearing.'
    },
    members: [
      { npcId: 'natalie-seline', role: 'First Shadow', locationId: 'over-shanty' },
      { npcId: 'korrin-the-shade', role: 'Shadow Confessor', locationId: 'peat-bog-sinks' }
    ],
    headquarters: 'over-shanty',
    territory: ['over-shanty', 'peat-bog-sinks', 'sunken-spire'],
    relationships: [
      {
        targetFactionId: 'church-of-the-holy-light',
        type: 'hostile',
        description: 'Mutual condemnation — the Church calls them heretics; they call the Church cowards who worship half a god'
      },
      {
        targetFactionId: 'house-skalvyr',
        type: 'secret_ally',
        description: 'Providing Void-heat technology in exchange for political protection and access to Nordhalla\'s geothermal archives'
      },
      {
        targetFactionId: 'drun-outcasts',
        type: 'allied',
        description: 'The Drun, already outcast, find kinship with the Cult\'s rejection of surface-world hypocrisy'
      }
    ],
    classAffinities: ['falseProphet', 'lichborne', 'deathcaller'],
    lore:
      'The Cult\'s founding text, "The Shadow Catechism," begins with a question: "If the Light is good, why did it let Sol die?" The text does not answer the question. It simply sits with it, in the dark, and lets the silence do the work.',
    secrets:
      'The Silence Between Stars is not a single entity. It is a chorus of every consciousness that has ever been consumed by the Void. Natalie hears them all. She has learned to pick out individual voices. She has found her dead mother among them.',
    quests: []
  },

  {
    id: 'unshorn-briaran',
    name: 'The Unshorn Briaran',
    type: 'tribal',
    regionId: 'frostwood-reach',
    icon: '/assets/icons/factions/briaran.png',
    colors: { primary: '#2d5a1e', secondary: '#8b4513' },
    publicGoal: 'Live free of the Fog Compact — reject the bargains that traded nature for survival',
    publicDescription:
      'The Briaran are the indigenous people of the Frostwood Reach who refused House Thalreth\'s Fog Compact. They live deep in the untouched ironwood groves, following the old ways — hunting, gathering, and maintaining a spiritual connection to the forest that predates the noble houses. They have no written language, no ledgers, and no memory-loss.',
    hiddenAgenda:
      'The Briaran\'s shamans have discovered a way to reverse the Fog Compact. It requires burning the original contract — which is stored in the Ledger Halls. They are planning a raid.',
    hiddenDescription:
      'The Briaran shamans call the fog "Thalreth\'s Lie." They have spent generations studying its nature and believe it is not a permanent condition — it is a spell sustained by the Compact\'s original text. The text is a living document, and it feeds on the memories the fog consumes. Destroy the text, and the fog starves.',
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
    territory: ['ironwood-heart'],
    relationships: [
      {
        targetFactionId: 'house-thalreth',
        type: 'hostile',
        description: 'The Briaran see Thalreth as spiritual traitors who sold the forest\'s soul for protection from the cold'
      },
      {
        targetFactionId: 'mist-sentinels',
        type: 'hostile',
        description: 'The Sentinels patrol the mists that the Briaran consider sacred — every patrol is an intrusion on hallowed ground'
      }
    ],
    classAffinities: ['primalist', 'huntress', 'warden'],
    lore:
      'Briaran children are not named at birth. They earn their names through a rite called the Thorn-Walk, where they enter the deepest ironwood grove alone and do not return until the forest gives them a name — or until three days pass, whichever comes first. Those who return nameless are cast out.',
    secrets:
      'The Thorn-Speaker knows exactly where the original Fog Compact text is stored. She has memorized the patrol routes of the Scribe-Sentinels. The raid will happen on the next moonless night.',
    quests: []
  },

  {
    id: 'zhentarim-network',
    name: 'The Zhentarim Network',
    type: 'secret_society',
    regionId: 'sundrift-vale',
    icon: '/assets/icons/factions/zhentarim.png',
    colors: { primary: '#1a1a1a', secondary: '#c0a040' },
    publicGoal: 'Facilitate trade, provide mercenary services, and maintain security across the trade routes',
    publicDescription:
      'To most, the Zhentarim are legitimate merchants and reliable mercenaries — expensive but effective. They control the major trade routes through the Sundrift Vale, operate caravanserai at every crossroads, and offer "protection services" to settlements that can afford them.',
    hiddenAgenda:
      'The Zhentarim are building a monopoly on every essential resource in the world — timber, iron, whale oil, grain, and information. Their goal is not conquest but dependency: a world where nothing moves, no deal closes, and no town survives without their consent.',
    hiddenDescription:
      'The Network\'s true power is information. Every Zhentarim merchant is a spy. Every caravanserai is an intelligence hub. Every protection contract includes a clause allowing the Zhentarim to "audit" the client\'s records. They know who is starving, who is hoarding, who is plotting, and who is vulnerable — and they sell this knowledge to the highest bidder, or everyone at once.',
    leader: {
      npcId: 'the-factotum',
      title: 'The Factotum',
      description:
        'No one knows the Factotum\'s real name or species. They communicate through sealed orders delivered by trained ravens. Their handwriting is precise, impersonal, and utterly without mercy.'
    },
    members: [
      { npcId: 'the-factotum', role: 'Leader', locationId: 'synod-hold' }
    ],
    headquarters: 'synod-hold',
    territory: ['synod-hold', 'merrowport', 'ironjaw-port'],
    relationships: [
      {
        targetFactionId: 'house-ordavan',
        type: 'puppet_master',
        description: 'House Ordavan believes they control the steppe trade. Every Ordavan trade minister has a Zhentarim "advisor" who actually writes the policy.'
      },
      {
        targetFactionId: 'house-mereval',
        type: 'neutral',
        description: 'Uneasy maritime truce — the Zhentarim need Mereval\'s ships; Mereval needs Zhentarim cargo. Neither trusts the other.'
      },
      {
        targetFactionId: 'drun-outcasts',
        type: 'rival',
        description: 'The Drun compete for control of the Over-Shanty black market — territory disputes occasionally turn violent'
      }
    ],
    classAffinities: ['gambler', 'toxicologist', 'bladedancer'],
    lore:
      'The Zhentarim were founded by a merchant who realized that selling goods was less profitable than selling the knowledge of who needed those goods. Within a generation, they had stopped transporting cargo entirely and shifted to transporting secrets.',
    secrets:
      'The Factotum is not one person. It is a rotating council of seven, each of whom believes they are the only Factotum. None of them know the others exist. The ravens deliver contradictory orders, and whichever order is fulfilled first becomes "the Factotum\'s true intent."',
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
      'House Ordavan has lost control of their own trade policy to the Zhentarim, who have installed "advisors" at every level of Ordavan governance. The house maintains the appearance of sovereignty while their decisions are increasingly made by the Network.',
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
    territory: ['synod-hold'],
    relationships: [
      {
        targetFactionId: 'zhentarim-network',
        type: 'puppet_master',
        description: 'The Zhentarim control Ordavan trade policy through embedded advisors — the house is a figurehead'
      },
      {
        targetFactionId: 'scribe-sentinels',
        type: 'neutral',
        description: 'Exchange maps and genealogies along trade routes, though the Sentinels increasingly view Ordavan as unreliable'
      }
    ],
    classAffinities: ['oracle', 'falseProphet', 'fateWeaver'],
    lore:
      'Ordavan\'s ancestral mounds are more than monuments — they are acoustic chambers. Each mound was constructed to capture and preserve the voice-print of a single ancestor. On the anniversary of a death, the mound "sings" — a playback of the last words the ancestor spoke. Some families gather at their mounds to hear the same final words, year after year, for generations.',
    secrets:
      'At least three of the ancestral mounds have fallen silent in the past decade. No one knows why. The Steppe-Lord has forbidden investigation, which means he either knows the cause or fears it.',
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
