/**
 * Class Flavor Profiles for Mythrill Living World & Lore Engine
 * Provides concise, engaging, em-dash-free flavor excerpts, key mechanics, and identity hooks.
 */

export const CLASS_FLAVOR_PROFILES = {
  animist: {
    id: 'animist',
    name: 'Animist',
    role: 'Spirit Summoner & Shifter',
    roleIcon: 'fa-feather',
    tradition: 'Primal Calling',
    resourceName: 'Resonance',
    resourceIcon: 'fa-wind',
    tagline: 'Host ancestral spirits within living flesh, erupting bone totems and burning sigils at the risk of gradual spirit erosion.',
    keyFeatures: ['Bone Totem Eruptions', 'Ancestral Spirit Fusion', 'Overtone & Spore Invocations'],
    loreSnippet: 'Born on the starless steppes when the skies went dark, the animist communes with the dead through song, runic scars, or inhaled spores to guide the living.',
    playstyle: 'Summon ancestral totems, channel spirit forms into your own body for devastating buffs, and balance potent spellcraft against progressive self-erosion.'
  },

  apex: {
    id: 'apex',
    name: 'Apex',
    role: 'Predator & Fog Duelist',
    roleIcon: 'fa-paw',
    tradition: 'Martial Order',
    resourceName: 'Marks',
    resourceIcon: 'fa-crosshairs',
    tagline: 'Trade a mortal sense to the Frostwood fog in exchange for predatory instinct and unmatched ambush precision.',
    keyFeatures: ['Silent Prowling', 'Quarry Marking', 'Lethal Fog Ambushes'],
    loreSnippet: 'Apex hunters navigate whiteout mists through acoustic and vibrational mastery, stalking prey for miles before striking from complete silence.',
    playstyle: 'Designate priority targets with Marks, maneuver undetected through line-of-sight breaking smoke or fog, and deliver devastating single-target executions.'
  },

  arcanoneer: {
    id: 'arcanoneer',
    name: 'Arcanoneer',
    role: 'Elemental Combinator',
    roleIcon: 'fa-atom',
    tradition: 'Arcane Academy',
    resourceName: 'Spheres',
    resourceIcon: 'fa-circle-nodes',
    tagline: 'Structure incantations as strict arcane contracts, combining raw elemental spheres into devastating compound matrices.',
    keyFeatures: ['Sphere Fusion Matrix', 'Arcane Contract Syntax', 'Multi-Elemental Repertoire'],
    loreSnippet: 'Founded by Athien archivists to tame wild magic, the arcanoneer blends fire, frost, storm, and void into measured, stable weaves.',
    playstyle: 'Generate raw elemental spheres each round and combine them on the fly into customized spells tailored to enemy vulnerabilities.'
  },

  augur: {
    id: 'augur',
    name: 'Augur',
    role: 'Cosmic Prophet & Fate Weaver',
    roleIcon: 'fa-eye',
    tradition: 'Eldritch Faith',
    resourceName: 'Omens',
    resourceIcon: 'fa-dice-d20',
    tagline: 'Read split-second fate in fresh bloodshed and dice rolls, bending fortune to bless allies or curse doomed foes.',
    keyFeatures: ['Die Roll Manipulation', 'Fate Reading Omens', 'Benediction & Malediction'],
    loreSnippet: 'Augurs read the exact trajectory of oncoming blades in splintered bone and fresh entrails, paying for immediate tactical foresight with mental stamina.',
    playstyle: 'Manipulate die rolls across the board, storing even results to empower allies and odd results to penalize enemy attacks.'
  },

  berserker: {
    id: 'berserker',
    name: 'Berserker',
    role: 'Striker & Juggernaut',
    roleIcon: 'fa-skull',
    tradition: 'Martial Order',
    resourceName: 'Rage',
    resourceIcon: 'fa-fire-flame-curved',
    tagline: 'Awaken the inherited memory of the Hunger Winter to boil your blood, shrug off mortal injuries, and cleave with unstoppable fury.',
    keyFeatures: ['Rage Scaling', 'Hunger Surge Tenacity', 'Unstoppable Cleaves'],
    loreSnippet: 'Passed down through Skald bloodlines, the Hunger Pact transforms the physiological trauma of surviving the Great Freeze into pure martial momentum.',
    playstyle: 'Generate Rage by dealing and taking damage, converting pain into raw movement speed, damage resistance, and durability-shattering strikes.'
  },

  chronarch: {
    id: 'chronarch',
    name: 'Chronarch',
    role: 'Time Controller & Engineer',
    roleIcon: 'fa-hourglass',
    tradition: 'Arcane Academy',
    resourceName: 'Shards',
    resourceIcon: 'fa-clock',
    tagline: 'Treat time as clockwork engineering, dilating velocity, freezing incoming strikes, and rewinding grievous wounds.',
    keyFeatures: ['Time Dilation Auras', 'Temporal Rewind', 'Stasis Field Traps'],
    loreSnippet: 'Pioneered by Fex engineers beneath Frostmaw Crag, chronarchs graft brass temporal escapements into their chests to command the flow of seconds.',
    playstyle: 'Spend Time Shards to grant extra actions, slow approaching enemies, and rewind recent damage at the risk of mounting temporal strain.'
  },

  crusader: {
    id: 'crusader',
    name: 'Crusader',
    role: 'Vanguard & Starlight Bulwark',
    roleIcon: 'fa-shield',
    tradition: 'Martial Order',
    resourceName: 'Fervor',
    resourceIcon: 'fa-sun',
    tagline: 'An ironclad furnace of celestial starlight, daring darkness to break against consecrated steel and holy judgment.',
    keyFeatures: ['Radiant Judgments', 'Consecrated Bastions', 'Starlight Cleanses'],
    loreSnippet: 'Encased in heavy iron and consecrated glass, crusaders stand as unyielding bastions against cosmic horrors and abyss spawn.',
    playstyle: 'Lead the frontline charge, generating Fervor through stalwart defense to unleash solar smites and party-wide damage shielding.'
  },

  false_prophet: {
    id: 'false_prophet',
    name: 'False Prophet',
    role: 'Deception Controller',
    roleIcon: 'fa-masks-theater',
    tradition: 'Eldritch Faith',
    resourceName: 'Madness & Conviction',
    resourceIcon: 'fa-brain',
    tagline: 'Manufacture fervent conviction out of thin air, weaponizing mass delirium, false miracles, and psychological manipulation.',
    keyFeatures: ['Delirium Invocations', 'Fabricated Miracles', 'Psychological Domination'],
    loreSnippet: 'Neither priests nor mystics, false prophets know that desperate souls will follow any voice that sounds certain, turning fabricated doctrine into tangible power.',
    playstyle: 'Seed madness in enemy ranks to turn foes against one another while granting desperate, volatile bonuses to trusting allies.'
  },

  gambit: {
    id: 'gambit',
    name: 'Gambit',
    role: 'Critical Gambler & Luck Thief',
    roleIcon: 'fa-dice',
    tradition: 'Shadow Syndicate',
    resourceName: 'Fortune',
    resourceIcon: 'fa-coins',
    tagline: 'Audit the strings of probability like an underworld luck broker, betting fate on high-risk rolls and claiming stolen payouts.',
    keyFeatures: ['Probability Auditing', 'Jackpot Criticals', 'Risk & Fortune Wagers'],
    loreSnippet: 'Trained by the merchant syndicates of Merrowport, gambits split their attention across alternate timelines to wager on the single thread where they survive.',
    playstyle: 'Wager Fortune on high-stakes attacks to trigger cascading critical effects, stealing luck tokens directly from enemy reserves.'
  },

  harbinger: {
    id: 'harbinger',
    name: 'Harbinger',
    role: 'Doom Bringer & Entropy Caster',
    roleIcon: 'fa-crow',
    tradition: 'Eldritch Faith',
    resourceName: 'Mayhem',
    resourceIcon: 'fa-meteor',
    tagline: 'Calculate the mathematical doom of the realm, channeling entropic friction into cataclysmic wild surges and planar rifts.',
    keyFeatures: ['Mayhem Gauge', 'Entropic Wild Surges', 'Cataclysmic Rifts'],
    loreSnippet: 'Harbingers read the cold arithmetic of dying stars, directing unavoidable cosmic heat loss into explosive battlefield phenomena.',
    playstyle: 'Build Mayhem by unleashing entropic spells, deliberately risking chaotic surge thresholds to trigger massive area of effect devastation.'
  },

  inquisitor: {
    id: 'inquisitor',
    name: 'Inquisitor',
    role: 'Witch Hunter & Occult Arbiter',
    roleIcon: 'fa-cross',
    tradition: 'Shadow Syndicate',
    resourceName: 'Authority',
    resourceIcon: 'fa-gavel',
    tagline: 'Swear the Barbed Vow to hunt supernatural horrors with cold iron, rejecting all magic to remain immune to corruption.',
    keyFeatures: ['Barbed Vows', 'Cold Iron Inquisitions', 'Magic Nullification'],
    loreSnippet: 'Bound by oaths sworn in blood at the Sunken Spire, inquisitors enforce physical law against eldritch contracts and face-stealing entities.',
    playstyle: 'Shut down enemy spellcasters with spell-breaking strikes, sever supernatural pacts, and execute aberrant horrors with unyielding authority.'
  },

  lunarch: {
    id: 'lunarch',
    name: 'Lunarch',
    role: 'Moon Ritualist & Gravity Shifter',
    roleIcon: 'fa-moon',
    tradition: 'Eldritch Faith',
    resourceName: 'Phases',
    resourceIcon: 'fa-circle-half-stroke',
    tagline: 'Host a dormant celestial star fragment within your skeleton, shifting lunar phases to command gravity and cold silver light.',
    keyFeatures: ['Lunar Phase Cycling', 'Gravitational Wells', 'Cryogenic Starlight'],
    loreSnippet: 'Originating from House Viridane, lunarchs bond with symbiotic stellar fragments that synchronize with cosmic cycles to bend physical forces.',
    playstyle: 'Cycle through New, Waxing, Full, and Waning moon phases to alternate between heavy crowd control, gravitational pulls, and silver radiant blasts.'
  },

  martyr: {
    id: 'martyr',
    name: 'Martyr',
    role: 'Sacrificial Tank & Pain Alchemist',
    roleIcon: 'fa-heart-crack',
    tradition: 'Martial Order',
    resourceName: 'Devotion',
    resourceIcon: 'fa-hand-holding-heart',
    tagline: 'Absorb lethal damage meant for allies into glowing stigmata, converting physical suffering into radiant shielding and solar shockwaves.',
    keyFeatures: ['Sympathetic Damage Redirection', 'Devotion Stigmata', 'Translucent Transcendence'],
    loreSnippet: 'Preserving the sacrificial vows of the Solari, martyrs bear carved runic brands that drink in the wounds of companions to fuel celestial protection.',
    playstyle: 'Redirect incoming damage away from vulnerable allies into your own health pool, powering high-tier Devotion bursts that cleanse and retaliate.'
  },

  minstrel: {
    id: 'minstrel',
    name: 'Minstrel',
    role: 'Bardic Commander & Tide Singer',
    roleIcon: 'fa-music',
    tradition: 'Shadow Syndicate',
    resourceName: 'Notes',
    resourceIcon: 'fa-volume-high',
    tagline: 'Channel the harmonic acoustics of ocean tides and monolith resonances, shattering enemy defenses and steadying allies through song.',
    keyFeatures: ['Tidal Cadences', 'Acoustic Durability Disruption', 'Party Rhythm Buffs'],
    loreSnippet: 'Trained in the maritime traditions of Merrowport, minstrels manipulate acoustic vibration to cut through storm winds and disrupt magical frequencies.',
    playstyle: 'Build harmonic chord sequences across consecutive rounds to grant party-wide mobility, shatter heavy plating and Durability with sound, and interrupt enemy casts.'
  },

  plaguebringer: {
    id: 'plaguebringer',
    name: 'Plaguebringer',
    role: 'Miasma Striker & Spore Host',
    roleIcon: 'fa-biohazard',
    tradition: 'Primal Calling',
    resourceName: 'Virulence',
    resourceIcon: 'fa-bacterium',
    tagline: 'Serve as a living laboratory of balanced fungal and biological plagues, cultivating contagious rot across enemies while remaining unharmed.',
    keyFeatures: ['Virulence Stacks', 'Contagion Spreading', 'Necrotic Harvest Blasts'],
    loreSnippet: 'Harvesting the unique fungal ecology of the Bryngloom bogs, plaguebringers incubate medicinal and necrotic cultures inside their own tissues.',
    playstyle: 'Infect enemies with escalating disease stages, spreading contagions through crowd clusters and detonating mature infections for massive necrotic bursts.'
  },

  pyrofiend: {
    id: 'pyrofiend',
    name: 'Pyrofiend',
    role: 'Chaos Blaster & Fire Conduit',
    roleIcon: 'fa-fire',
    tradition: 'Arcane Academy',
    resourceName: 'Veil',
    resourceIcon: 'fa-fire-burner',
    tagline: 'Swallow volcanic caldera coals to become an explosive living combustion engine, unleashing wild thermal conflagrations.',
    keyFeatures: ['Inferno Overheating', 'Basalt Body Hardening', 'Molten Conflagrations'],
    loreSnippet: 'Formed through deep caldera pacts beneath Emberspire, pyrofiends trade physical stability for raw volcanic heat capable of melting Durability.',
    playstyle: 'Manage your internal heat gauge to boost spell damage, balancing maximum destructive power against the risk of self-immolation.'
  },

  revenant: {
    id: 'revenant',
    name: 'Revenant',
    role: 'Deathbound Undead & Harvester',
    roleIcon: 'fa-skull',
    tradition: 'Shadow Syndicate',
    resourceName: 'Toll',
    resourceIcon: 'fa-urn',
    tagline: 'Walk the boundary between life and grave with unfulfilled obligations, storing harvested souls within phylacteries to defy death.',
    keyFeatures: ['Soul Harvesting', 'Phylactery Self-Resurrection', 'Necrotic Debt Strikes'],
    loreSnippet: 'Revenants carry ancient funerary covenants, using spectral resonance to command the fallen and ensure their final tasks reach completion.',
    playstyle: 'Harvest soul fragments from fallen foes to power deadly dark strikes, storing reserves in your personal phylactery to rise again if struck down.'
  },

  shaper: {
    id: 'shaper',
    name: 'Shaper',
    role: 'Matter Manipulator & Morph Master',
    roleIcon: 'fa-cube',
    tradition: 'Arcane Academy',
    resourceName: 'Flux',
    resourceIcon: 'fa-shapes',
    tagline: 'Mold muscle, mineral bone lattices, and kinetic momentum across six fluid stances to adapt to any combat encounter in real time.',
    keyFeatures: ['The Six Shaping Forms', 'Mineral Bone Weaving', 'Kinetic Momentum Transfers'],
    loreSnippet: 'Developed by Mimir chroniclers and Groven stoneworkers, shapers reinforce living physiology with crystalline structures to absorb impact and strike with immense force.',
    playstyle: 'Fluidly transition between kinetic offense, crystalline defense, and elongated reach forms to counter any opponent tactics.'
  },

  spellguard: {
    id: 'spellguard',
    name: 'Spellguard',
    role: 'Anti-Magic Defender & Bulwark',
    roleIcon: 'fa-shield-halved',
    tradition: 'Martial Order',
    resourceName: 'Resonance',
    resourceIcon: 'fa-shield-virus',
    tagline: 'Wield heavy runic fortress shields to catch and absorb incoming spellfire, discharging stored arcane energy back as kinetic shockwaves.',
    keyFeatures: ['Spell Absorption Wards', 'Prismatic Fortress Shields', 'Kinetic Arcane Discharge'],
    loreSnippet: 'Forged in the southern mountain passes during solar storms, spellguards serve as impenetrable front line barriers against destructive magical bombardments.',
    playstyle: 'Intercept magical attacks aimed at your team, absorb the incoming spell power into your shield, and release it as durability-crushing kinetic shockwaves.'
  },

  toxicologist: {
    id: 'toxicologist',
    name: 'Toxicologist',
    role: 'DoT Striker & Master Apothecary',
    roleIcon: 'fa-flask',
    tradition: 'Primal Calling',
    resourceName: 'Vials',
    resourceIcon: 'fa-vial',
    tagline: 'Distill lethal wilderness secretions and mist flora into aerosol canisters, chemical traps, and customized debilitating venoms.',
    keyFeatures: ['Custom Venom Brewing', 'Aerosol Chemical Traps', 'Layered Neurotoxins'],
    loreSnippet: 'Operating from Frostwood distillation labs, toxicologists refine predatory toxins into aerosol defenses and specialized neutralizing remedies.',
    playstyle: 'Deploy chemical ground traps before combat, coat weapons in customized multi-turn toxins, and throw neutralizing gas grenades to control the field.'
  },

  warden: {
    id: 'warden',
    name: 'Warden',
    role: 'Territory Controller & Jailer',
    roleIcon: 'fa-tree',
    tradition: 'Primal Calling',
    resourceName: 'Tension',
    resourceIcon: 'fa-link',
    tagline: 'Graft heavy cold-iron chains directly through bone and plating, physically tethering monstrous foes into inescapable single combats.',
    keyFeatures: ['Grafted Chain Tethers', 'Forced Single Duels', 'Area Lockdown'],
    loreSnippet: 'Originating from the subterranean bastions of Frostmaw Holdfast, wardens lock down colossal beasts and hold the line with unbreakable chain tactics.',
    playstyle: 'Harpoon and tether dangerous enemies to yourself, forcing them into a locked duel while generating Tension whenever they strike you.'
  },

  doomsayer: {
    id: 'doomsayer',
    name: 'Doomsayer',
    role: 'Doom Caster & Forewarner',
    roleIcon: 'fa-bolt',
    tradition: 'Doom Discipline',
    resourceName: 'Calamities & Havoc',
    resourceIcon: 'fa-hourglass-half',
    tagline: 'Declare a finite public ending with an exact trigger, clock and disruption method, then collect Havoc only when the doom actually arrives.',
    keyFeatures: ['Two Public Calamities', 'Havoc 0-15', 'Forewarning Wards'],
    loreSnippet: 'The Doomsayer inherits the Frozen Archive doom-arithmetic, Anhur vent-readings and Tessic rehearsal traditions without restoring the old Mayhem pressure engine.',
    playstyle: 'Plant one or two visible calamities, let the table see the clock, resolve each once and spend Havoc on bounded finishers or ally warnings.'
  },

  oracle: {
    id: 'oracle',
    name: 'Oracle',
    role: 'Insight Support & Forecaster',
    roleIcon: 'fa-eye',
    tradition: 'Reading Discipline',
    resourceName: 'Forecasts',
    resourceIcon: 'fa-eye',
    tagline: 'Commit two exact forecasts with a named subject, event category, published benefit and one-or-two own-turn expiry, without debt or die replacement.',
    keyFeatures: ['Two Forecast Slots', 'No Omen Debt', 'Bounded Readings'],
    loreSnippet: 'The Oracle reads observable signs and bounded visions from the star-watching and route-reading traditions, never claiming hidden omniscience.',
    playstyle: 'Prepare a personal certainty or an ally protection before the named event, apply each benefit once and record failure or expiry honestly.'
  },

  chaos_weaver: {
    id: 'chaos_weaver',
    name: 'Chaos Weaver',
    role: 'Variance Caster & Anomaly Controller',
    roleIcon: 'fa-dice-d20',
    tradition: 'Variance Discipline',
    resourceName: 'Possibility Tiles',
    resourceIcon: 'fa-dice-d20',
    tagline: 'Maintain six fixed Possibility Tiles across four zones, resolving one bounded draw and one placed anomaly at a time through manual tabletop accounting.',
    keyFeatures: ['Six Fixed Tile IDs', 'Four Tile Zones', 'Bounded Anomaly Control'],
    loreSnippet: 'Trained in the Alchemite Sump workshops and Variance Circle, Chaos Weavers stabilize real anomaly exposure with finite stabilizing interfaces.',
    playstyle: 'Commit available tiles to bounded draws or place one visible anomaly, then recover spent tiles through paid Fold or completed long rest.'
  },

  gambler: {
    id: 'gambler',
    name: 'Gambler',
    role: 'Risk Dealer & Wager Tactician',
    roleIcon: 'fa-dice',
    tradition: 'Wager Discipline',
    resourceName: 'Hand & Fortune',
    resourceIcon: 'fa-dice',
    tagline: 'Play from a twenty-card personal deck with a five-card hand, a 0-7 Fortune ledger, and one public wager at a time without fabricated draws.',
    keyFeatures: ['Twenty-Card Personal Deck', 'Fortune 0-7 Ledger', 'Single Public Wager'],
    loreSnippet: 'Grounded in Merrowport House settlement discipline and Alchemite wagering apprenticeships, Gamblers back every play with an actual stake.',
    playstyle: 'Declare one visible wager, commit real cards from hand, and settle wins or losses honestly through manual tabletop tracking.'
  },

  fate_weaver: {
    id: 'fate_weaver',
    name: 'Fate Weaver',
    role: 'Link Binder & Obligation Support',
    roleIcon: 'fa-scroll',
    tradition: 'Thread Discipline',
    resourceName: 'Fate Links',
    resourceIcon: 'fa-link',
    tagline: 'Bind up to three consented links backed by three thread tokens across free, reserved, and recovering states with explicit public obligations.',
    keyFeatures: ['Three Thread Tokens', 'Consented Fate Links', 'Own-Turn Link Recovery'],
    loreSnippet: 'Reconstructed as a bounded link-binding discipline, Fate Weavers maintain explicit obligations between linked subjects without divination banks.',
    playstyle: 'Reserve thread tokens to open consented links, share or redirect bounded burdens, and recover closed threads at your next own turn.'
  },

  deathcaller: {
    id: 'deathcaller',
    name: 'Deathcaller',
    role: 'Remnant Commander & Vitality Broker',
    roleIcon: 'fa-skull',
    tradition: 'Grave-Order Discipline',
    resourceName: 'Dead Muster & Vitality',
    resourceIcon: 'fa-skull',
    tagline: 'Command at most two raised remnants backed by a 0-10 Vitality ledger, distinct from Revenant soul anchors and Plaguebringer symbiosis.',
    keyFeatures: ['Two-Remnant Muster Cap', 'Vitality 0-10 Ledger', 'Paid Grave Orders'],
    loreSnippet: 'Separating remnant command from threshold transition, Deathcallers direct finite grave-order manifestations through strict vitality accounting.',
    playstyle: 'Raise up to two remnants, issue bounded grave orders on your turn, and track Vitality expenditure and rest recovery manually.'
  },

  lichborne: {
    id: 'lichborne',
    name: 'Lichborne',
    role: 'Frost-Anchor Caster & Ward Controller',
    roleIcon: 'fa-skull',
    tradition: 'Phylactery Discipline',
    resourceName: 'Anchor Integrity & Frost Stage',
    resourceIcon: 'fa-snowflake',
    tagline: 'Channel cold-warded spellwork through an externalized phylactery vessel with 0-12 Anchor Integrity and four voluntary frost-preservation stages.',
    keyFeatures: ['Anchor Integrity 0-12', 'Four Frost Stages', 'Externalized Vessel'],
    loreSnippet: 'Distinct from Revenant threshold rites, Lichborne bind their endurance to a physical vessel and regulate frost-stage preservation deliberately.',
    playstyle: 'Manage Anchor Integrity and frost stages across encounters, spending vessel stability on cold wards and recovering only through rest discipline.'
  },

  druid: {
    id: 'druid',
    name: 'Druid',
    role: 'Ecological Form-Holder & Habitat Shaper',
    roleIcon: 'fa-seedling',
    tradition: 'Ecological Discipline',
    resourceName: 'Active Body, Traits & Transitions',
    resourceIcon: 'fa-leaf',
    tagline: 'Hold one active ecological body with two trait slots and a three-transition budget, distinct from Shaper kinetic stance-flow.',
    keyFeatures: ['One Active Body', 'Two Trait Slots', 'Three-Transition Budget'],
    loreSnippet: 'Drawing on Verdant Circle and Florae ecological traditions, Druids adapt to living habitats while preserving continuous self-reference.',
    playstyle: 'Assume an ecological form, slot two bounded traits, and pace your three form transitions across the session.'
  },

  hunter: {
    id: 'hunter',
    name: 'Hunter',
    role: 'Quarry Tracker & Field Tactician',
    roleIcon: 'fa-crosshairs',
    tradition: 'Field Discipline',
    resourceName: 'Quarry Ledger, Evidence & Tools',
    resourceIcon: 'fa-paw',
    tagline: 'Maintain one active Quarry Ledger with three observed Evidence marks, one Companion Role, and two prepared Field Tools.',
    keyFeatures: ['Single Quarry Ledger', 'Three Evidence Marks', 'Companion Role & Field Tools'],
    loreSnippet: 'Rooted in frontier ranging lodges and Silent Hunt field craft, Hunters read trail, habit, and opening without magical omniscience.',
    playstyle: 'Log observed Evidence on one named quarry, coordinate your companion role, and deploy two prepared field tools.'
  
  }
};

export const getClassFlavorProfile = (classId) => {
  if (!classId) return null;
  const normalized = classId.toLowerCase().replace(/[-\s]+/g, '_');
  return CLASS_FLAVOR_PROFILES[normalized] || null;
};

export default CLASS_FLAVOR_PROFILES;
