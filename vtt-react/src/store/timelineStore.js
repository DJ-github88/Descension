import { create } from 'zustand';

const CHRONOLOGY_ERA_DISPLAY = [
  {
    id: 'before-deepening',
    name: 'Before the Deepening',
    yearRange: 'Prehistory',
    description: 'The age when Sol still burned bright and the world was warm. Archaeological record only: no living memory remains.'
  },
  {
    id: 'deepening',
    name: 'The Deepening',
    yearRange: 'Year 0-12',
    description: 'Sol\'s death-rebirth trance: the twelve years of dying light. The era of the Binding, the Bargains, and the Breach.'
  },
  {
    id: 'dimming',
    name: 'The Age of the Dimming',
    yearRange: 'Year 12-Present',
    description: '~800 years of frozen twilight. Sixty-five failed rebirth cycles. Keth-Amar feeds. The Monoliths are waking.'
  }
];

const MYTHRILL_CALENDAR = {
  weekLength: 10,
  weeksPerMonth: 3,
  monthsPerYear: 12,
  daysPerMonth: 30,
  months: [
    { id: 1, name: 'First Thaw', season: 'false-spring',
      description: 'The month when the ice cracks but does not break: historically, the first sign of the rebirth window opening' },
    { id: 2, name: 'The False Dawn', season: 'false-spring',
      description: 'A brief lightening of the sky: the Rebirth Window. Sol attempts to rekindle. For 65 cycles it has failed. The Augurs track the output.' },
    { id: 3, name: 'Day of Binding', season: 'false-spring',
      description: 'Commemorates the entombment of Sol beneath Sundale. Solemn fasts. The scaffold-month of every dark bargain.' },
    { id: 4, name: 'Ashfall', season: 'embers',
      description: 'Volcanic ash drifts north from Sundale, coating the snow grey. The Emberth read ash-patterns as prophecy.' },
    { id: 5, name: 'Emberspire\'s Breath', season: 'embers',
      description: 'Geothermal vents surge: the warmest month, though still below freezing. Forge Wrights work double shifts.' },
    { id: 6, name: 'The Dimming', season: 'embers',
      description: 'Even the residual volcanic glow begins to fade; the darkest month. The Day of the Breach falls here: when Keth-Amar consumed the heirs.' },
    { id: 7, name: 'First Frost', season: 'deepening-winter',
      description: 'The cold intensifies; livestock must be brought underground. The Freeze-Front advances measurably.' },
    { id: 8, name: 'Hunger Moon', season: 'deepening-winter',
      description: 'Food stores run low; the month when most deaths occur. Cultural memory of the Hunger Winter that birthed the Berserkers.' },
    { id: 9, name: 'The Long Dark', season: 'deepening-winter',
      description: 'The longest nights; families gather in sump-halls for warmth. The Vreken claim the death-trails burn brightest in this month.' },
    { id: 10, name: 'Star-Count', season: 'deepening-winter',
      description: 'Astril constellation-readers gather to count the remaining visible stars: a census of what Keth-Amar has not yet consumed.' },
    { id: 11, name: 'Midwinter', season: 'deepening-winter',
      description: 'The solstice; children born in this month are said to carry the Frostmaiden\'s blessing. The Frost-Tithe is traditionally paid.' },
    { id: 12, name: 'The Creeping Light', season: 'false-dawn',
      description: 'The first subtle sign that another cycle will begin: or so the priests claim. For 65 cycles, the priests have been wrong.' }
  ],
  eras: [
    { id: 'before-deepening', name: 'Before the Deepening', startYear: null, endYear: 0,
      description: 'The age when Sol still burned bright and the world was warm. Archaeological record only: no living memory remains.' },
    { id: 'deepening', name: 'The Deepening', startYear: 0, endYear: 12,
      description: 'Sol\'s death-rebirth trance: the twelve years of dying light. The era of the Binding, the Bargains, and the Breach.' },
    { id: 'dimming', name: 'The Age of the Dimming', startYear: 12, endYear: null,
      description: 'The current age: ~800 years of frozen twilight. Sixty-five failed rebirth cycles. Keth-Amar feeds. The Monoliths are waking.' }
  ],
  holidays: [
    { id: 'binding-day', name: 'Day of Binding', date: { month: 3, day: 15 },
      description: 'Marks the ritual entombment of Sol. Solemn fasts and candle-lighting ceremonies. The Augurs take their annual rebirth readings.' },
    { id: 'midwinter', name: 'Midwinter Solstice', date: { month: 11, day: 21 },
      description: 'The longest night. Sacrifices are offered to appease the cold. Children born today are believed blessed: and the Frost-Tithe claims twice as many.' },
    { id: 'first-thaw-vigil', name: 'First Thaw Vigil', date: { month: 1, day: 1 },
      description: 'Families stay awake all night watching for the first crack in the ice: an omen for the year ahead and a cultural echo of watching for the rebirth that never came.' },
    { id: 'breach-day', name: 'Day of the Breach', date: { month: 6, day: 30 },
      description: 'Commemorates Keth-Amar consuming the six sacrificed heirs. A day of mourning and whispered fears. In Sundale, parents lock their children indoors.' }
  ]
};

const REBIRTH_CYCLES = [
  { cycle: 1, year: 12, outputPercent: 40, significance: 'The first attempt. Sol struggles. Augurs measure 40% of expected rebirth output. The "False Dawn" month is named. Optimism begins to fray.' },
  { cycle: 5, year: 60, outputPercent: 28, significance: 'The decline becomes undeniable. Cassia\'s successors begin systematic output-logging of every window. The first marginal settlements fail.' },
  { cycle: 10, year: 120, outputPercent: 22, significance: 'The "False Dawn" month barely lightens. A faction of Solvan Martyrs begins secretly tracking the decline: precursor to the Dawn Vigil.' },
  { cycle: 20, year: 240, outputPercent: 15, significance: 'Barely perceptible warming. The conclusion is irrefutable: Sol is not coming back. The Dawn Vigil formalizes.' },
  { cycle: 30, year: 360, outputPercent: 10, significance: 'Erratic output. Some readings contradictory. First evidence of temporal friction contaminating the Augurs\' instruments.' },
  { cycle: 40, year: 480, outputPercent: 8, significance: 'Detectable only by Augur instruments. The common person no longer sees any warming during the False Dawn. The myth of Sol\'s return dies in the general population. The False Dawn Riots erupt.' },
  { cycle: 50, year: 600, outputPercent: 3, significance: 'Barely a flicker. The remaining detection requires precision instruments and elk-blood at the Frozen Archive. The Solbrand\'s tending-clan has been concealing the decline for decades.' },
  { cycle: 55, year: 660, outputPercent: 0, significance: 'The last detectable rebirth attempt. Sol is too weak to even try. The Augurs record: "The star has stopped fighting." No cycle since has produced measurable output.' }
];

const WARMTH_PHASES = [
  { id: 'false-spring', name: 'The False Spring', years: '0-50', warmth: 'Volcanic abundance. Emberspire\'s eruption provides strong geothermal output. Vents are hot. Surface is bitterly cold but survivable near geothermal zones.',
    intrusion: 'Keth-Amar is weak, just starting to feed. Influence is ambient: Wyrd bleeding through the Breach cracks, the Frost-Tithe on Rime-Born births, subtle whispers in deep vents.',
    society: 'False optimism: "Sol will rebirth. This is temporary." The seven bargains are struck. Classes form from immediate survival needs. Subraces begin differentiating along regional lines.' },
  { id: 'first-ebbing', name: 'The First Ebbing', years: '50-200', warmth: 'Declining. Secondary geothermal vents weaken. The first marginal settlements fail. Rebirth windows producing declining output. The Freeze-Front advances slowly.',
    intrusion: 'Growing. Wyrd activity increases in the Frostwood and Bryngloom. The first sustained Wyrd incursions. Whispers reach deeper into the surface. The Keeper of the Last Threshold remains watchful.',
    society: 'Adaptation begins. Institutions form around information preservation (Sovereign Ledger, Scribe-Cartel, Synod). Trade routes establish. First regional conflicts over thermal resources. Classes emerge from adaptation needs.' },
  { id: 'contraction', name: 'The Contraction', years: '200-450', warmth: 'Significant decline. Major geothermal systems failing. The Freeze-Front advances. Rebirth windows below 15%. Habitable zones visibly contract.',
    intrusion: 'Targeted. Keth-Amar can corrupt specific individuals. Wyrd epidemic in multiple regions. The first "owned" agents appear. The Mimir Purge happens. The Vreken Over-Lit epidemic begins. The Keeper becomes noticeably distracted.',
    society: 'Survival infrastructure solidifies. The Sovereign Ledger becomes a weapon of social control. Wars break out over thermal resources. Subraces split into castes (Mimir Rupture, Sylen/Muren schism). Classes form from organized responses to Wyrd and scarcity.' },
  { id: 'squeeze', name: 'The Squeeze', years: '450-650', warmth: 'Accelerating decline. Major geothermal systems failing across all regions. The Solbrand\'s output measurably diminishes (concealed by the Korr for three generations). Rebirth windows below 8%.',
    intrusion: 'Coordinated. The Cult of Forgotten Shadow makes two-way contact with the deep dark. Keth-Amar can whisper to specific people across vast distances and corrupt institutions. The Voice begins speaking. The dead stir.',
    society: 'Institutions fracture under pressure. The Great Revision rewrites history. The False Dawn Riots shatter the myth of Sol\'s return. The Over-Shanty becomes a permanent shadow-state. Classes form from desperation and the need to weaponize the Wyrd itself.' },
  { id: 'intrusion', name: 'The Intrusion', years: '650-800', warmth: 'Terminal decline. The Solbrand visibly failing. The last detectable rebirth window produces nothing. Emberspire\'s vents cooling. The Frost-Tithe worsening.',
    intrusion: 'Active assault. The Monoliths wake. The Voice issues specific instructions. Keth-Amar can blind Augurs, silence the sea, animate the dead, and corrupt arch-priests directly. The boundary between life and death weakens. Coordinated assault on the seal.',
    society: 'The present crisis. Civil war in Sundale. The Marching Dead in Bryngloom. The Silent Sea. Temporal contamination. Every bargain is coming due at once. The campaign begins here.' }
];

const TRADE_ROUTES = [
  { id: 'trade-velling-pass', name: 'Velling Pass', origin: 'greymark-keep', destination: 'basalt-shyr',
    via: ['the-shallows', 'cinder-strait'], cargo: 'Frostwood timber, memory-ink, ironwood → Sundale sulfur, volcanic coal, forged arms',
    established: 'Year ~40 (Dimming)', status: 'active',
    history: 'The oldest overland route. Established by Greymark Keep to trade for Sundale\'s volcanic warmth. The Scribe-Cartel taxes ink shipments. Briaran raiders target timber caravans during the Uprising (Year 350). Contested during the Memory Wars.' },
  { id: 'trade-cinder-strait', name: 'Cinder Strait', origin: 'basalt-shyr', destination: 'merrowport',
    via: ['ember-lagoon'], cargo: 'Sundale sulfur, volcanic coal, forged arms, obsidian → Iceheart fish, whale-blubber, storm-glass',
    established: 'Year ~80 (Dimming)', status: 'active',
    history: 'The volcanic sea-lane connecting Sundale to the Iceheart Sea. Merryn sailors navigate at tremendous risk: boiling water and Cinder-Fiends. The Brine-Bond Syndicate controls Merrowport docking rights. The Basalt Shyr outpost was built specifically to service this route.' },
  { id: 'trade-ancestor-spans', name: 'The Ancestor-Spans', origin: 'frostmaw-holdfast', destination: 'ironjaw-port',
    via: ['deepchasm-keep', 'gearworks-gulch'], cargo: 'Cragjaw minerals, clockwork, alchemical compounds → all regions\' raw metals and Fexric goods',
    established: 'Year ~50 (Dimming)', status: 'active (contested)',
    history: 'The only reliable crossing through the Cragjaw Peaks: built from the calcified bodies of willing Groven dead. Groven toll-keepers charge passage fees. The Toll Wars (Year ~280-340) established Groven sovereign toll-rights. The Steam-Line Cartel taxes geothermal pipeline access along the spans.' },
  { id: 'trade-iceheart-lanes', name: 'The Iceheart Storm-Lanes', origin: 'merrowport', destination: 'fjord-gate',
    via: ['spindrift-lagoon', 'kelpies-cove'], cargo: 'Iceheart fish, whale-blubber, storm-glass, deep-sea curios → Nordhalla mammoth-furs, glacier-crystals, runic artifacts',
    established: 'Year ~120 (Dimming)', status: 'active (perilous)',
    history: 'The storm-churned trade lanes connecting the Iceheart Sea to Nordhalla. House Mereval\'s Sea-Charter guarantees navigable (but never calm) waters. The Luck-Ledger tracks and taxes Merryn sailors\' storm-luck. The Brine-Bond Syndicate controls docking rights at Merrowport.' },
  { id: 'trade-bog-route', name: 'The Bryngloom Bog-Route', origin: 'atropolis', destination: 'morrens-bogpost',
    via: ['over-shanty', 'aran-glen', 'vel-keth-bayou'], cargo: 'Peat-oil, memory-glass, fungal-light exports, ironwood crafts → Sundrift steppe-wool, Astril crystal-lattice fragments',
    established: 'Year ~60 (Dimming)', status: 'active (smuggler-heavy)',
    history: 'The winding bog-route connecting settled Bryngloom to the Sundrift Vale\'s border. The Neth Great Registry taxes legitimate trade; the Over-Shanty (founded Year 412) routes black-market goods. Drun outcasts control the peat-harvesting bypass channels.' },
  { id: 'trade-north-south', name: 'The Hunger Road', origin: 'fjord-gate', destination: 'emberspire',
    via: ['ymirhold', 'frostmaw-holdfast', 'basalt-shyr'], cargo: 'Nordhalla mammoth-furs, runic artifacts → Sundale volcanic coal, forged arms',
    established: 'Year ~50 (Dimming)', status: 'contested',
    history: 'The path the Bloodhammer clans marched south during the Hunger Winter migration. Now a contested refugee and trade route. The Sunder-Wall divides settled Nordhalla from the Fredløse outlaws. The Steam-Line Cartel controls key geothermal resupply points along the route.' },
  { id: 'trade-steppe-circuit', name: 'The Steppe Migration Circuit', origin: 'synod-hold', destination: 'morrens-bogpost',
    via: ['starfall-vale', 'ancestor-wolds'], cargo: 'Steppe-wool, shag-ox herds, Astril crystal-lattice → Bryngloom peat-oil, fungal goods',
    established: 'Year ~25 (Dimming)', status: 'seasonal',
    history: 'Not a fixed road but the Ordan migration circuit: following the grass-line south before frost claims it and north before the thaw rots it. The Astril Synod taxes constellation-spirit passage. The Herd-Tithe is exacted by House Ordavan. Every Mound-Camp along the route is a seasonal trading post.' }
];

const SEEDED_EVENTS = [
  // ============================================================
  // PHASE 1: THE FALSE SPRING (Years 0-50)
  // Warmth: Volcanic abundance. Intrusion: Ambient.
  // ============================================================

  {
    id: 'event-sol-deepening',
    date: { year: 0, eraId: 'deepening' },
    title: 'Sol Enters the Deepening',
    type: 'cosmic',
    phase: 'false-spring',
    description:
      'The star Sol entered its ancient death-rebirth cycle called the Deepening. Its light began to dim. The Augurs of the binding houses were the first to read the signs in the cooling light. For three years, the families debated while the world froze.',
    locationIds: ['sundale'],
    factionIds: ['house-thalreth', 'house-skalvyr', 'house-solvan', 'house-ordavan'],
    classIds: ['augur', 'harbinger'],
    causes: [],
    effects: ['event-entombment']
  },
  {
    id: 'event-entombment',
    date: { year: 3, eraId: 'deepening' },
    title: 'The Entombment of Sol',
    type: 'ritual',
    phase: 'false-spring',
      description:
        'The seven noble families pooled their bloodlines to entomb the dying sun beneath Sundale. They used the hide of Aex (Sol\'s own firstborn, a living entity of pure solar fire who had protected the star through every previous Deepening) flayed alive to weave the binding seal. House Solvan wielded the knife. The ritual exhausted the families and the world began to freeze. The families told the world Sol would sleep and rise again. It was the first lie.',
      locationIds: ['sundale', 'emberspire-caldera'],
    factionIds: ['house-thalreth', 'house-skalvyr', 'house-solvan', 'house-mereval', 'house-ordavan', 'house-tesshan', 'house-viridane'],
    classIds: ['spellguard', 'augur'],
    causes: ['event-sol-deepening'],
    effects: ['event-fog-compact', 'event-glacier-bargain', 'event-keth-amar-corruption']
  },
  {
    id: 'event-keth-amar-corruption',
    date: { year: 3, eraId: 'deepening', endYear: 11 },
    title: 'Keth-Amar Weaves the Corruption',
    type: 'cosmic',
    phase: 'false-spring',
    description:
      'Denied its prey by the Binding, Keth-Amar did not rage, it waited. For eight years, as the winter deepened and children froze and crops failed and whole villages went silent, the Sun-Eater whispered. Not into the grand halls of the noble houses. Into the kitchens, the nurseries, the night-watches. It whispered into the dreams of fathers who had signed the Binding. It showed mothers the faces of their starving children. It offered a simple trade: warmth for blood. The whispers did not compel. they corroded. By Year 11, six noble houses had heard the same offer so many times it no longer sounded like a choice.',
    locationIds: ['sundale', 'frostwood-reach', 'nordhalla', 'cragjaw-peaks', 'sundrift-vale', 'iceheart-sea', 'bryngloom-forest'],
    factionIds: ['house-solvan', 'house-ordavan', 'house-mereval', 'house-tesshan', 'house-thalreth', 'house-skalvyr'],
    classIds: ['pyrofiend', 'martyr', 'harbinger'],
    causes: ['event-entombment'],
    effects: ['event-keth-amar-breach']
  },
  {
    id: 'event-keth-amar-breach',
    date: { year: 11, eraId: 'deepening' },
    title: 'Keth-Amar Consumes the Heirs',
    type: 'catastrophe',
    phase: 'false-spring',
    description:
      'Six of the seven noble families (their resolve worn hollow by eight years of whispered corruption) marched their firstborn heirs into the dark. Keth-Amar consumed the children not as mere sacrifice but as vessel-keys: the heirs\' bloodlines were the original signatures on the binding seal, and by devouring them, Keth-Amar cracked the vault from within. The seal shattered into seven Sundered Monoliths, each screaming with the echo of a stolen life. House Viridane (the seventh house) refused. They fled south through the Frostwood Reach, struck their name from every record, and made a counter-bargain with fae entities in the moonlit groves. Their descendants are the Briaran.',
      locationIds: ['emberspire-caldera', 'frostwood-reach', 'sundrift-vale'],
    factionIds: ['house-solvan', 'house-ordavan', 'house-mereval', 'house-tesshan', 'house-viridane'],
    classIds: ['martyr', 'inquisitor', 'apex', 'revenant', 'lunarch'],
    causes: ['event-keth-amar-corruption'],
    effects: ['event-emberspire-eruption', 'event-church-founding', 'event-preservation-pact', 'event-viridane-flight']
  },
  {
    id: 'event-emberspire-eruption',
    date: { year: 11, eraId: 'deepening' },
    title: 'Emberspire Erupts: The False Spring Begins',
    type: 'catastrophe',
    phase: 'false-spring',
    description:
      'Through the wound torn by Keth-Amar\'s consumption of the heirs, the world-heart volcano Emberspire erupted with a violence that reshaped the sky. Volcanic warmth flooded the frozen surface. The Myrathil spawned from the storm-foam where fire met glacial sea. The Emberth, who had sheltered in the thermal caverns since before the Binding, emerged into the ash-choked light. For the first time since Sol died, the surface was warm: not warm like summer, but warm enough that a person could stand outside and not die within the hour. The False Spring had begun.',
      locationIds: ['sundale', 'emberspire-caldera', 'iceheart-sea'],
    factionIds: ['house-solvan'],
    classIds: ['pyrofiend', 'berserker'],
    causes: ['event-keth-amar-breach'],
    effects: ['event-first-rebirth', 'event-myrathil-spawning']
  },
  {
    id: 'event-myrathil-spawning',
    date: { year: 11, eraId: 'deepening' },
    title: 'The Myrathil Spawn',
    type: 'cosmic',
    phase: 'false-spring',
    description:
      'When Emberspire erupted and bled volcanic fury into the frozen oceans, the violent clash of fire and ice churned the seas into living foam. The sea mother (the ocean\'s attempt at personhood) gave that foam the will to stand and walk. The Breakers-Born emerged first: shore-spawned from the collision of wave and rock. They would become the ambassadors, the most numerous Myrathil. The Deep-Born and River-Fed would emerge centuries later as the oceans reached equilibrium and inland exploration began.',
    locationIds: ['iceheart-sea'],
    factionIds: [],
    classIds: ['minstrel'],
    causes: ['event-emberspire-eruption'],
    effects: ['event-deep-born-emerge', 'event-river-fed-emerge']
  },
  {
    id: 'event-viridane-flight',
    date: { year: 11, eraId: 'deepening' },
    title: 'The Refusal of House Viridane',
    type: 'political',
    phase: 'false-spring',
    description:
      'When the other six houses marched their children north, House Viridane did not. Something had reached them before the Sun-Eater\'s whispers could take hold, a presence in the mist, watching from the moonlit groves, older than Keth-Amar\'s hunger and more patient. They fled south through the Frostwood Reach while sacrifice fires still burned, carrying children hidden beneath cloaks woven from the hair of their own dead. The six houses, unable to complete the binding ritual with only six signatures, elevated House Morrath as a substitute seventh and began the centuries-long project of erasing every trace of Viridane. For fourteen years between their elevation and the First Contract, House Morrath administered basic survival. resource distribution, defense, and refugee settlement: while the Neth scribe-clan negotiated the pact that would define the region.',
    locationIds: ['frostwood-reach', 'ironwood-heart'],
    factionIds: ['house-viridane'],
    classIds: ['lunarch'],
    causes: ['event-keth-amar-breach'],
    effects: ['event-briaran-smooth-skinned']
  },
  {
    id: 'event-first-rebirth',
    date: { year: 12, eraId: 'dimming' },
    title: 'The First Failed Rebirth: 40%',
    type: 'cosmic',
    phase: 'false-spring',
    description:
      'Twelve years after Sol entered the Deepening, the first rebirth window arrived. Sol attempted to rekindle. For three days, the sky lightened, the False Dawn, the month named for this event. Then Keth-Amar, newly inside the vault through the Breach wound, consumed the rekindling energy. The warming stopped. The sky darkened. The Augurs at the Frozen Archive measured: 40% of expected output. The first quantifiable data point in what would become a 65-cycle record of decline. The calendar month "The False Dawn" and the "First Thaw Vigil" holiday are cultural echoes of this moment. people still watch for a rebirth that has never come.',
    locationIds: ['frozen-archive', 'sundale'],
    factionIds: [],
    classIds: ['augur'],
    causes: ['event-emberspire-eruption'],
    effects: ['event-augur-readings']
  },
  {
    id: 'event-fog-compact',
    date: { year: 5, eraId: 'deepening' },
    title: 'The Fog Compact',
    type: 'pact',
    phase: 'false-spring',
    description:
      'House Thalreth sealed the Fog Compact, trading the Frostwood Reach\'s spatial clarity for an insulating fog that would prevent the ironwood forests and their native beasts from freezing into glass. The fog devours memory over generations: a slow erasure that the Thalren combat with chained journals and the Scribe-Sentinels\' ledgers. The first Scribe-Sentinels were founded within the year.',
    locationIds: ['greymark-keep', 'scribes-tower', 'frostwood-reach'],
    factionIds: ['house-thalreth', 'scribe-sentinels'],
    classIds: ['apex', 'toxicologist'],
    causes: ['event-entombment'],
    effects: ['event-sovereign-ledger', 'event-ledger-collapse']
  },
  {
    id: 'event-glacier-bargain',
    date: { year: 7, eraId: 'deepening' },
    title: 'The Skalvyr Glacier Bargain',
    type: 'pact',
    phase: 'false-spring',
    description:
      'As titanic glaciers advanced to grind Nordhalla\'s mountain keeps into dust, House Skalvyr bargained with the Warden to freeze the ice sheets in place. The Warden accepted but decreed that summer would never return to the north. Keth-Amar set the Frost-Tithe on Rime-Born births (the bargain\'s interest, a supernatural birth-curse where every frost-touched child draws the mother\'s warmth to survive. The Hunger Winter that followed was so absolute that Skald ancestors consumed their own dead) the first seed of the Hunger Pact that would later ignite the Berserker rage.',
      locationIds: ['frozen-archive', 'fjord-gate', 'ymirs-col'],
    factionIds: ['house-skalvyr'],
    classIds: ['berserker', 'harbinger', 'augur'],
    causes: ['event-entombment'],
    effects: ['event-hunger-winter']
  },
  {
    id: 'event-hunger-winter',
    date: { year: 7, eraId: 'deepening', endYear: 10 },
    title: 'The Hunger Winter',
    type: 'disaster',
    phase: 'false-spring',
    description:
      'The first winter after the Glacier Bargain was so absolute that Nordhalla\'s Skald ancestors consumed their own dead to survive: a three-year blizzard that burned the practice into cultural memory and genetic inheritance. This act became the Hunger Pact: the cellular residue of ancestral cannibalism that, generations later, would ignite as the Blood-Heat in Grum Bloodhammer\'s veins. The Rime-Born began evolving from the refugees who survived, carrying the Frost-Tithe curse in their blood.',
    locationIds: ['nordhalla', 'fjord-gate'],
    factionIds: ['house-skalvyr'],
    classIds: ['berserker'],
    causes: ['event-glacier-bargain'],
    effects: ['event-bloodhammer-migration']
  },
  {
    id: 'event-remaining-bargains',
    date: { year: 12, eraId: 'dimming', endYear: 50 },
    title: 'The Remaining Bargains Struck',
    type: 'pact',
    phase: 'false-spring',
    description:
      'House Ordavan traded the Sundrift Vale\'s fertile soil for endless migration and grass that always returned. The sky went dark (the constellation-spirits fled the slaughter and the Astril ancestors volunteered as living vessels. House Mereval traded the Iceheart\'s calm for navigable) and perpetually storm-lashed, sea lanes. House Tesshan traded the Cragjaw\'s visibility for an eternal blizzard-veil. In the Bryngloom, the Neth ancestors. not a noble house, but a dying scribe-clan: negotiated the First Contract with the Keeper of the Last Threshold, trading death\'s finality for silver-skinned survival and an absolute prohibition on falsehood.',
    locationIds: ['sundrift-vale', 'iceheart-sea', 'cragjaw-peaks', 'bryngloom-forest', 'atropolis'],
    factionIds: ['house-ordavan', 'house-mereval', 'house-tesshan'],
    classIds: ['animist', 'gambit', 'shaper'],
    causes: ['event-emberspire-eruption'],
    effects: ['event-astril-first-vessels', 'event-first-contract']
  },
  {
    id: 'event-astril-first-vessels',
    date: { year: 15, eraId: 'dimming' },
    title: 'The Astril First Vessels',
    type: 'cultural',
    phase: 'false-spring',
    description:
      'When Sol was bound, the constellation-spirits of the sun\'s celestial court fled the slaughter, Horse, Wolf, Dragon, Serpent, Tiger, Stag. They found the Sundrift Vale, where the Ordan had been singing the stars\' names for a thousand years. The Astril ancestors opened themselves: they became living vessels for the last fragments of Sol\'s court. Every Astril child is born with a constellation-spirit woven into their blood. Faith is visible. patterns brighten with conviction, dim with doubt. This created the assassination economy: kill an Astril, and their spirit may choose you.',
    locationIds: ['sundrift-vale', 'starfall-vale'],
    factionIds: ['house-ordavan'],
    classIds: ['augur', 'harbinger'],
    causes: ['event-remaining-bargains'],
    effects: ['event-synod-founded', 'event-astril-schism']
  },
  {
    id: 'event-first-contract',
    date: { year: 25, eraId: 'dimming' },
    title: 'The First Contract',
    type: 'pact',
    phase: 'false-spring',
    description:
      'The Neth (a dying scribe-clan of the Bryngloom) gathered every contract they had ever written and walked into the deep wood. They found the Keeper of the Last Threshold and did not pray, they presented a legal case: "You are the record-keeper of the forest. The Neth are the record-keepers of civilization. If we die, the record dies." The Keeper accepted. They rose from the bog with silver skin, stilled breath, and the First Contract written in their blood. The Neth cannot lie. Their blood crystallizes into volatile shards. The Velun bloodline. born of the original signatories: still run Atropolis.',
    locationIds: ['bryngloom-forest', 'atropolis'],
    factionIds: [],
    classIds: ['arcanoneer'],
    causes: ['event-remaining-bargains'],
    effects: ['event-arcanoneer-founding']
  },
  {
    id: 'event-vat-breakers-revolt',
    date: { year: 40, eraId: 'dimming' },
    title: 'The Vat-Breakers\' Revolt',
    type: 'conflict',
    phase: 'false-spring',
    description:
      'The Fexric Deep Alchemists\' vat-grown servitors (the Groven, shaped from captured Thrumm broodlings) shattered their containment vats at Frostmaw Holdfast and rose. Led by Subject Len-7, the first generation of Groven slaughtered their captors and fled into the upper crags. In the chaos, dozens of broodlings (the Lost Brood) were left behind in deeper vats. The deep alchemists tightened security and moved operations into tunnels the Groven could never find. The debt has never been repaid. Over subsequent generations, the Groven developed the Still-Claiming: the calcification of their dead into permanent stone, which they used to build the Ancestor-Spans: the only bridges across the Cragjaw\'s chasms.',
    locationIds: ['cragjaw-peaks', 'frostmaw-holdfast'],
    factionIds: ['deep-alchemists', 'vat-breakers-guild'],
    classIds: ['warden'],
    causes: ['event-remaining-bargains'],
    effects: []
  },
  {
    id: 'event-church-founding',
    date: { year: 13, eraId: 'dimming' },
    title: 'Founding of the Solbrand Order',
    type: 'founding',
    phase: 'false-spring',
    description:
      'In the first year after Sol\'s entombment, the surviving noble houses formally reorganized their territories and obligations at Greymark Keep. The first Scribe-Sentinels were appointed: Thalreth family members who volunteered to have their memories erased before taking their vows, ensuring objective record-keeping against the fog. The Church would later splinter as the Solbrand dimmed and the myth of Sol\'s return became unsustainable.',
    locationIds: ['greymark-keep'],
    factionIds: ['house-thalreth', 'scribe-sentinels'],
    classIds: ['martyr'],
    causes: ['event-entombment', 'event-keth-amar-breach'],
    effects: ['event-northern-schism']
  },
  {
    id: 'event-preservation-pact',
    date: { year: 17, eraId: 'dimming' },
    title: 'The Preservation Compact',
    type: 'pact',
    phase: 'false-spring',
    description:
      'The remaining noble houses formalized the system of dark bargains that would define the Age of the Dimming. Each house carved its sacrifice into a memory-glass tablet and sealed it in the Council Chamber at Greymark Keep. The tablets are still there. Three of them have been altered.',
    locationIds: ['greymark-keep'],
    factionIds: ['house-thalreth', 'house-skalvyr', 'house-solvan', 'house-mereval', 'house-ordavan', 'house-tesshan', 'house-viridane'],
    classIds: ['martyr'],
    causes: ['event-keth-amar-breach'],
    effects: []
  },
  {
    id: 'event-false-spring-traditions',
    date: { year: 2, eraId: 'deepening', endYear: 50 },
    title: 'The False Spring Traditions: Immediate Survival',
    type: 'founding',
    phase: 'false-spring',
    description:
      'Five combat traditions were born from the Binding, the Breach, and the first decade of desperate survival:\n\n' +
      '• Augur (Year ~2): Cassia, a Skald star-watcher at the Frozen Archive, read the Deepening\'s hour in the steaming entrails of a sacrificed glacier-elk the moment Sol first darkened. The temporal-feedback burn incinerated her past to make space for cosmic-doom coordinate chains.\n' +
      '• Spellguard (Year ~3): Damon, an Emberth blacksmith, blocked a solar flare with an alchemical tower shield during Sol\'s entombment. His hands are preserved frozen in the shielding posture at the Shield-Forge Keeps beneath Emberspire.\n' +
      '• Martyr (Year ~5) (Sera Solvan, a mother of House Solvan, carved her sacrificed child\'s name into her forearm with volcanic obsidian when the heirs were marched north. The wound healed into a glowing solar scar) the first Vow.\n' +
      '• Pyrofiend (Year ~12): When the first rebirth window failed, seven Solvarn occultists gathered in an obsidian cavern beneath Emberspire, drew a summoning circle in their own blood, and swallowed Wyrd-touched coals of Scathrach, the Ashen Sovereign.\n' +
      '• Apex (Year ~10-30): Sylas, a Mimir tracker, formalized the Silent Hunt for Wyrd-creatures emerging through the Breach cracks. He traded his hearing for vibration-sense in the deep Ironwood Heart.',
      locationIds: ['frozen-archive', 'sundale', 'emberspire-caldera', 'ironwood-heart'],
    factionIds: ['house-solvan', 'house-skalvyr'],
    classIds: ['augur', 'spellguard', 'martyr', 'pyrofiend', 'apex'],
    causes: ['event-sol-deepening', 'event-entombment', 'event-keth-amar-breach'],
    effects: []
  },

  // ============================================================
  // PHASE 2: THE FIRST EBBING (Years 50-200)
  // Warmth: Declining. Intrusion: Growing.
  // ============================================================

  {
    id: 'event-first-vent-failure',
    date: { year: 60, eraId: 'dimming' },
    title: 'The First Vent Failure',
    type: 'disaster',
    phase: 'first-ebbing',
    description:
      'The first recorded failure of a secondary geothermal vent occurred in the Cragjaw border tunnels. A Fexric holdfast went cold within a month. The inhabitants (those who survived) became the first thermal refugees, migrating toward Emberspire and the surviving Frostmaw Holdfast vents. This was the beginning of a pattern that would define the next seven centuries: as vents cooled, populations moved, and the displaced clashed with the entrenched.',
    locationIds: ['cragjaw-peaks', 'frostmaw-holdfast'],
    factionIds: [],
    classIds: [],
    causes: ['event-emberspire-eruption'],
    effects: ['event-first-thermal-war']
  },
  {
    id: 'event-fifth-rebirth',
    date: { year: 60, eraId: 'dimming' },
    title: 'The Fifth Rebirth Window: 28%',
    type: 'cosmic',
    phase: 'first-ebbing',
    description:
      'The fifth rebirth cycle. Sol attempted to rekindle. Keth-Amar consumed the energy. Augurs measured: 28% of expected output. The decline was now undeniable. Cassia\'s successors at the Frozen Archive began systematically logging every rebirth window\'s output: a data set they still maintain, now showing the descent from 40% to 0% across sixty-five cycles.',
    locationIds: ['frozen-archive'],
    factionIds: [],
    classIds: ['augur'],
    causes: ['event-first-rebirth'],
    effects: []
  },
  {
    id: 'event-bloodhammer-migration',
    date: { year: 80, eraId: 'dimming' },
    title: 'The Bloodhammer Migration South',
    type: 'migration',
    phase: 'first-ebbing',
    description:
      'With Nordhalla\'s geothermal sumps failing and the Hunger Pact festering in Skald blood for three generations, the Bloodhammer clans (led by Torra Bloodhammer) marched south toward Emberspire\'s caldera. The journey took decades, following the Hunger Road through the Ancestor-Spans (paying Groven tolls in blood and salvage) and into Sundale\'s volcanic warmth. Grum the Iron-Smith, Torra\'s descendant, would ultimately ignite the first Blood-Heat in the caldera: transforming the Hunger Pact from a cultural wound into a weapon.',
    locationIds: ['nordhalla', 'cragjaw-peaks', 'sundale'],
    factionIds: ['house-skalvyr'],
    classIds: ['berserker'],
    causes: ['event-hunger-winter', 'event-first-vent-failure'],
    effects: ['event-berserker-founding']
  },
  {
    id: 'event-berserker-founding',
    date: { year: 100, eraId: 'dimming' },
    title: 'Grum Ignites the Blood-Heat',
    type: 'founding',
    phase: 'first-ebbing',
      description:
        'At the end of the Bloodhammer migration, Grum the Iron-Smith (a Skald smith whose ancestors had consumed their own dead during the Hunger Winter) surrendered to forge-heat in Emberspire\'s caldera. The Hunger Pact that lived in his blood ignited: the Blood-Heat, a self-destructive adrenal meltdown where muscles tear from bone to swing harder. He shattered a glacier-wyrm barehanded. The Berserker tradition was born. The Forge of Grum, beneath Emberspire, still burns: tended by a mute elder who has never spoken Grum\'s actual name.',
      locationIds: ['sundale', 'emberspire-caldera'],
    factionIds: ['house-solvan'],
    classIds: ['berserker'],
    causes: ['event-bloodhammer-migration'],
    effects: []
  },
  {
    id: 'event-briaran-smooth-skinned',
    date: { year: 75, eraId: 'dimming' },
    title: 'The Smooth-Skinned Emerge',
    type: 'cultural',
    phase: 'first-ebbing',
    description:
      'Three generations after House Viridane\'s flight, Aurel Shorn-First walked out of the moonlit groves and built a life under a human name. He was the first Briaran to systematically shave his thorns and pass as human. The Smooth-Skinned subrace was born: the pragmatists, choosing invisibility over defiance. They carry a single piece of ghost-metal hidden against the skin. The Unshorn who remained in the groves considered them deserters.',
    locationIds: ['frostwood-reach', 'ironwood-heart'],
    factionIds: ['unshorn-briaran'],
    classIds: [],
    causes: ['event-viridane-flight'],
    effects: []
  },
  {
    id: 'event-northern-schism',
    date: { year: 89, eraId: 'dimming' },
    title: 'The Ledger Purge',
    type: 'political',
    phase: 'first-ebbing',
    description:
      'Lord Aldren Thalreth, overwhelmed by the fog\'s erosion of House Thalreth\'s collective memory, ordered the consolidation of all family ledgers into a single sealed vault beneath Greymark Keep. He chose to entrust the location to no one: not even his own heirs. This created a dangerous dependency on his continued survival and set the precedent for the Sovereign Ledger\'s power: whoever controls the records controls reality.',
    locationIds: ['greymark-keep'],
    factionIds: ['house-thalreth'],
    classIds: [],
    causes: ['event-church-founding'],
    effects: ['event-sovereign-ledger']
  },
  {
    id: 'event-sovereign-ledger',
    date: { year: 100, eraId: 'dimming' },
    title: 'The Sovereign Ledger Established',
    type: 'founding',
    phase: 'first-ebbing',
    description:
      'The Sovereign Ledger was formally established at Greymark Keep: a system where only those with registered lineages hold legal rights. The Ledgered (documented citizens) and the Forgotten (outlawed undocumented) became two classes of humanity. The Scribe-Cartel formed simultaneously, monopolizing the Soot-Resin Ink and Peat-Parchment that resist the fog\'s memory-erosion. Information became currency. Identity became a bureaucratic privilege.',
    locationIds: ['greymark-keep'],
    factionIds: ['house-thalreth', 'scribe-sentinels', 'scribe-cartel'],
    classIds: [],
    causes: ['event-northern-schism'],
    effects: ['event-fogwood-schism', 'event-ledger-collapse']
  },
  {
    id: 'event-deep-born-emerge',
    date: { year: 100, eraId: 'dimming' },
    title: 'The Deep-Born Myrathil Emerge',
    type: 'cultural',
    phase: 'first-ebbing',
    description:
      'As the Iceheart Sea reached thermal equilibrium after Emberspire\'s eruption, Myrathil began spawning from open-ocean foam rather than just shoreline spindrift. The Deep-Born emerged: abyss-adapted mystics who hum into the Treakous Rift and find the surface world unbearably loud. The Listeners established a submerged chamber, recording the Rift\'s background hum. Centuries later, they would be the first to notice that the hum was changing: that the Sundered Monolith in the Rift was waking.',
    locationIds: ['iceheart-sea'],
    factionIds: [],
    classIds: ['minstrel'],
    causes: ['event-myrathil-spawning'],
    effects: []
  },
  {
    id: 'event-first-thermal-war',
    date: { year: 100, eraId: 'dimming', endYear: 120 },
    title: 'The First Thermal War',
    type: 'conflict',
    phase: 'first-ebbing',
    description:
      'As geothermal vents failed in the Cragjaw border tunnels, three factions clashed over the remaining heat sources: the Fexric holdfasts defending their ancestral infrastructure, Nordhalla refugees pressing south along the Hunger Road, and Groven toll-keepers raising passage rates at the Ancestor-Spans. The war was fought in the vertical darkness of the Cragjaw: on rope-bridges, in steam-filled tunnels, at the Rope-Garrison and Deepchasm Keep. The Steam-Line Cartel emerged from the war\'s wreckage, consolidating control of surviving geothermal pipes. The Groven established formal toll-treaties at Ironjaw Port, cementing their role as gatekeepers of every pass.',
    locationIds: ['cragjaw-peaks', 'deepchasm-keep', 'ironjaw-port'],
    factionIds: ['steam-line-cartel', 'vat-breakers-guild'],
    classIds: ['warden', 'shaper'],
    causes: ['event-first-vent-failure', 'event-vat-breakers-revolt'],
    effects: ['event-toll-wars']
  },
  {
    id: 'event-fogwood-schism',
    date: { year: 150, eraId: 'dimming' },
    title: 'The Fogwood Schism',
    type: 'schism',
    phase: 'first-ebbing',
    description:
      'The Thalren archivists of the Frostwood Reach split into two factions: the Preservationists, who fought to maintain the old records against the fog\'s erosion, and the Adaptationists, who argued the fog was a force to be worked with, not against. The Forgotten (Thalren whose ledgers were lost or never recorded) emerged as a permanent underclass. The Ironwood Palisade checkpoint system was built to control movement between the documented and undocumented zones.',
    locationIds: ['frostwood-reach', 'greymark-keep', 'the-shallows'],
    factionIds: ['house-thalreth', 'scribe-cartel'],
    classIds: ['toxicologist', 'inquisitor'],
    causes: ['event-sovereign-ledger'],
    effects: ['event-memory-wars']
  },
  {
    id: 'event-river-fed-emerge',
    date: { year: 150, eraId: 'dimming' },
    title: 'The River-Fed Myrathil Emerge',
    type: 'cultural',
    phase: 'first-ebbing',
    description:
      'Venn the Salt-Walker, a Myrathil explorer, followed a seasonal stream inland through the Sundrift Vale and discovered a vast freshwater lake: the Mother\'s Mirror. She proved Myrathil could survive away from salt water. The River-Fed emerged: estuary-born wanderers who follow rivers inland, the only Myrathil to have seen the mountains and the inland Monoliths.',
    locationIds: ['sundrift-vale', 'iceheart-sea'],
    factionIds: [],
    classIds: ['gambit'],
    causes: ['event-myrathil-spawning'],
    effects: []
  },
  {
    id: 'event-synod-founded',
    date: { year: 150, eraId: 'dimming' },
    title: 'The Synod Organizes',
    type: 'founding',
    phase: 'first-ebbing',
    description:
      'The Astril Luminarchy formally organized into the Synod, a ruling council of the oldest constellation-bloodlines governing from the crystal-lattice cathedral of Synod-Hold. The assassination economy was openly condemned and privately practiced. The first Over-Sung case was recorded within the year: a Sylen who opened too wide and was consumed, the spirit claiming the vessel entirely. The Unlit. Astril born without a constellation: were conscripted as Synod spies, their patternless skin making them perfectly unreadable.',
    locationIds: ['sundrift-vale', 'synod-hold'],
    factionIds: [],
    classIds: ['augur', 'harbinger'],
    causes: ['event-astril-first-vessels'],
    effects: ['event-astril-schism']
  },
  {
    id: 'event-first-ebbing-traditions',
    date: { year: 60, eraId: 'dimming', endYear: 200 },
    title: 'The First Ebbing Traditions: Early Adaptation',
    type: 'founding',
    phase: 'first-ebbing',
    description:
      'Five traditions emerged as the warmth declined and civilizations adapted to permanent survival:\n\n' +
      '• Arcanoneer (Year ~60) (Valerius, a Velun Neth archivist, drafted the First Contract with the Keeper of the Last Threshold, structuring raw Bryngloom magic as strict legal clauses. His blood crystallizes into volatile shards) the cost of weaponizing the pact.\n' +
      '• Warden (Year ~70): Alaric the Law-Keeper, a Groven mine-guard at Frostmaw Holdfast, drove an ore-hauling chain through his own forearm into a colossal Deep Alchemist specimen during the Vat-Breakers\' revolt. He held for three days. The chain rusted into his bone.\n' +
      '• Lunarch (Year ~80) (Selene, sister of House Viridane, bargained with wildwood fae in the moonlit groves to capture the dead moon\'s light. She bound a lunar parasite to her bones) an ancient celestial predator feeding on memory, sensation, and sanity.\n' +
      '• Minstrel (Year ~100) (Lyris the Tide-Singer, a Merryn sailor, sang a sea-symphony to calm the Iceheart gales at Merrowport. The ocean mother accepted but stole her spoken voice) attempting to speak causes her throat to bleed.\n' +
      '• Animist (Year ~120-200): Three independent ancestral-communion discoveries (Kael the Ordan totemic, Nyssa the Vreken spore-Wyrd, Theron the Skald runic) developed in parallel. They would merge centuries later when the founders\' successors recognized each other\'s scars.',
    locationIds: ['bryngloom-forest', 'cragjaw-peaks', 'frostwood-reach', 'iceheart-sea', 'sundrift-vale', 'nordhalla'],
    factionIds: [],
    classIds: ['arcanoneer', 'warden', 'lunarch', 'minstrel', 'animist'],
    causes: ['event-first-contract', 'event-vat-breakers-revolt', 'event-viridane-flight'],
    effects: []
  },

  // ============================================================
  // PHASE 3: THE CONTRACTION (Years 200-450)
  // Warmth: Significant decline. Intrusion: Targeted.
  // ============================================================

  {
    id: 'event-ledger-collapse',
    date: { year: 203, eraId: 'dimming' },
    title: 'The Ledger Halls Collapse',
    type: 'disaster',
    phase: 'contraction',
    description:
      'A catastrophic structural failure buried the original Ledger Halls beneath petrified roots. Hundreds of irreplaceable records were lost: lineages, bargains, founding charters. The Scribe-Sentinels\' authority was permanently weakened. The Great Forgetting began: the fog\'s memory-erosion accelerated because the backup records were gone. The gaps in the Reach\'s collective memory that appeared long ago have never been fully closed.',
    locationIds: ['ledger-halls', 'scribes-tower', 'frostwood-reach'],
    factionIds: ['house-thalreth', 'scribe-sentinels'],
    classIds: ['animist'],
    causes: ['event-fog-compact', 'event-sovereign-ledger'],
    effects: ['event-memory-editing']
  },
  {
    id: 'event-mimir-purge',
    date: { year: 220, eraId: 'dimming' },
    title: 'The Mimir Purge: The Mask-Mothers Die',
    type: 'catastrophe',
    phase: 'contraction',
    description:
      'A Wyrd incursion (a widening of a seal-crack near the deep Ironwood Heart) destroyed the Mimir birthing chambers. The last Mask-Mothers were killed. The art of making new masks (the Rite of Masks passed from mother to child for centuries) was lost forever in a single night. Every Mimir mask in existence became a relic. The population became finite, bounded by the number of surviving masks. This is the catastrophe from which the Mimir have never recovered.',
    locationIds: ['frostwood-reach', 'ironwood-heart'],
    factionIds: [],
    classIds: ['apex'],
    causes: ['event-ledger-collapse'],
    effects: ['event-mimir-rupture']
  },
  {
    id: 'event-mimir-rupture',
    date: { year: 240, eraId: 'dimming' },
    title: 'The Mimir Rupture: The Three Castes',
    type: 'schism',
    phase: 'contraction',
    description:
      'With no new masks being made, the Mask-Borne elders (the aristocratic inheritors of heartwood masks bearing eleven generations of carved lineage) decreed that only first-born children may receive their mother\'s mask. Siblings were cast to the forest floor with no inheritance. Within a generation, Mimir society had shattered into three castes:\n' +
      '• Mask-Borne: the shrinking aristocracy, presiding over a majority they refuse to acknowledge.\n' +
      '• Mist-Woven: the sentinels who took to the rope-bridges, forging storm-glass masks from fulgurite.\n' +
      '• The Unwoven: the floor-dwelling outcasts, wearing composite masks of salvaged fragments: two hundred years later, the Eyeless One\'s mask holds over a hundred borrowed fragments.',
    locationIds: ['frostwood-reach', 'ironwood-heart'],
    factionIds: [],
    classIds: ['apex', 'shaper', 'toxicologist'],
    causes: ['event-mimir-purge'],
    effects: []
  },
  {
    id: 'event-twentieth-rebirth',
    date: { year: 240, eraId: 'dimming' },
    title: 'The Twentieth Rebirth Window: 15%',
    type: 'cosmic',
    phase: 'contraction',
    description:
      'The twentieth rebirth cycle. Sol attempted to rekindle. Keth-Amar consumed the energy. Augurs measured: 15% of expected output: barely perceptible warming. After 240 years of tracking, the conclusion was irrefutable: Sol was not coming back. The myth of the rebirth, maintained for twenty generations, died in the learned classes. The common people would hold out another 240 years before the False Dawn Riots.',
    locationIds: ['frozen-archive'],
    factionIds: [],
    classIds: ['augur'],
    causes: ['event-fifth-rebirth'],
    effects: ['event-dawn-vigil-founded']
  },
  {
    id: 'event-astril-schism',
    date: { year: 250, eraId: 'dimming', endYear: 300 },
    title: 'The Sylen-Muren Schism',
    type: 'schism',
    phase: 'contraction',
    description:
      'The Astril fractured. The Harmonists (future Sylen) argued that the constellation-spirit must be embraced fully: suppression was a betrayal of the sanctuary their ancestors had promised. The Silencers (future Muren) argued that unchecked embrace led to the Over-Sung and that suppression through scarification, fasting, and binding-chants was survival. Tharun Muren, the first Silencer, was assassinated by his own Sylen sister who believed his suppression was starving the Wolf. The Wolf chose her. She lost herself to the Over-Sung within the year. The schism has never healed.',
    locationIds: ['sundrift-vale', 'synod-hold'],
    factionIds: [],
    classIds: ['augur', 'harbinger', 'falseProphet'],
    causes: ['event-synod-founded'],
    effects: []
  },
  {
    id: 'event-drun-severing',
    date: { year: 380, eraId: 'dimming' },
    title: 'The Drun Severing: Saren-Vel Burns Her Name',
    type: 'cultural',
    phase: 'contraction',
    description:
      'Saren-Vel, the most powerful Velun Neth mage of her generation, walked into the deepest Bryngloom bog with a flame that consumed only ink, not paper, not flesh. She burned her name from every active copy of the First Contract. The Drun subrace was born: legally nonexistent, magic-immune, invisible to the Keeper\'s enforcement. They are also legally non-entitled. no property, no marriage, no testimony in a Neth court. Her act was a response to the Keeper\'s growing distraction: as the pact weakened, its cage became unbearable to those who could feel it tightening.',
    locationIds: ['bryngloom-forest', 'atropolis'],
    factionIds: [],
    classIds: ['revenant', 'gambit'],
    causes: ['event-contraction-traditions'],
    effects: []
  },
  {
    id: 'event-dawn-vigil-founded',
    date: { year: 340, eraId: 'dimming' },
    title: 'The Dawn Vigil Founded',
    type: 'founding',
    phase: 'contraction',
      description:
        'Originally founded as a quietist monastic order of Martyrs who tracked Monolith locations in secret. After twenty-eight failed rebirth cycles, the Vigil\'s founding premise was that Sol would not return on its own: only the reassembly of the Sundered Monoliths could restart the star. The Vigil\'s deepest secret, held by its inner circle: reassembly would summon Keth-Amar, not Sol. In recent decades, under Hierophant Aethelgard, the Vigil has militarized into Sundale\'s dominant theocracy.',
      locationIds: ['sundale', 'emberspire-caldera'],
    factionIds: ['dawn-vigil', 'house-solvan'],
    classIds: ['martyr'],
    causes: ['event-twentieth-rebirth'],
    effects: []
  },
  {
    id: 'event-war-thousand-screams',
    date: { year: 300, eraId: 'dimming', endYear: 320 },
    title: 'The War of Thousand Screams',
    type: 'conflict',
    phase: 'contraction',
    description:
      'The largest conflict of the mid-era. Deep Alchemist experiments overran the lower tunnels of Frostmaw Holdfast at the same moment that resource scarcity from failing geothermal systems drove surface factions to desperation. Groven, Fexric, Tessen, and Deep Alchemist forces clashed in the vertical labyrinth. Nesta, a Kethrin Fexric engineer, built a time-dilation engine of volcanic glass and alchemical gears to halt a collapsing glacier: hooking the temporal loop into her own chest and incinerating her past. The Chronarch tradition was born in this war. The conflict reshaped Cragjaw society: the Steam-Line Cartel consolidated its geothermal monopoly, the Deep Alchemists sealed themselves into the lowest tunnels, and the Groven fortified the Ancestor-Spans as permanent military checkpoints.',
    locationIds: ['cragjaw-peaks', 'frostmaw-holdfast', 'gearworks-gulch'],
    factionIds: ['vat-breakers-guild', 'steam-line-cartel', 'deep-alchemists'],
    classIds: ['chronarch', 'warden'],
    causes: ['event-first-thermal-war'],
    effects: []
  },
  {
    id: 'event-toll-wars',
    date: { year: 280, eraId: 'dimming', endYear: 340 },
    title: 'The Toll Wars',
    type: 'conflict',
    phase: 'contraction',
    description:
      'As thermal refugees increased along the Hunger Road, Groven toll-keepers raised passage rates at the Ancestor-Spans. Nordhalla Skald caravans and Sundale Solvarn trade delegations clashed with Groven bridge-tenders and each other over transit rights. The Ithran diplomat Ithra-Mal negotiated the Ironjaw Port Toll-Treaties: the first formal recognition of Groven sovereign bridge-rights by the noble houses. The Morgh/Ithran Ladder of Purity solidified during this period: Ithran diplomats negotiated the treaties the Morgh bridge-builders died to enforce.',
    locationIds: ['cragjaw-peaks', 'ironjaw-port', 'deepchasm-keep'],
    factionIds: ['vat-breakers-guild', 'house-skalvyr', 'house-solvan'],
    classIds: ['warden', 'shaper'],
    causes: ['event-first-thermal-war'],
    effects: []
  },
  {
    id: 'event-memory-wars',
    date: { year: 250, eraId: 'dimming', endYear: 350 },
    title: 'The Memory Wars',
    type: 'conflict',
    phase: 'contraction',
    description:
      'The Scribe-Cartel\'s monopoly on fog-resistant ink and parchment made literacy a privilege, and the Sovereign Ledger made documentation the boundary between citizen and outlaw. The Forgotten (Thalren whose ledgers were lost, never recorded, or deliberately erased) raided archive-towers and ledger-shrines to prove their own existence. The Cartel responded with sanctions, ink-embargoes, and the Mist-Sentinels: a border guard patrolling the Ironwood Palisade. The Briaran, whose oral history is immune to fog-erasure, watched from the groves and occasionally sheltered Forgotten fugitives.',
    locationIds: ['frostwood-reach', 'greymark-keep', 'ironwood-heart'],
    factionIds: ['scribe-cartel', 'house-thalreth', 'mist-sentinels'],
    classIds: ['toxicologist', 'inquisitor'],
    causes: ['event-fogwood-schism'],
    effects: ['event-briaran-uprising']
  },
  {
    id: 'event-briaran-uprising',
    date: { year: 350, eraId: 'dimming' },
    title: 'The Briaran Uprising',
    type: 'conflict',
    phase: 'contraction',
    description:
      'The Unshorn Briaran, rejecting the Fog Compact and the Sovereign Ledger\'s authority, launched a series of raids against timber caravans and ledger-shrines in the Frostwood Reach. House Thalreth responded with a brutal suppression campaign that drove the Briaran deep into the Ironwood Heart. The conflict has smoldered for generations: the Briaran never fully suppressed, the Thalreth never fully secure. The Briaran call it the Righteous Refusal. The Thalreth call it the Thorn Insurgency.',
    locationIds: ['ironwood-heart', 'the-shallows', 'frostwood-reach'],
    factionIds: ['unshorn-briaran', 'house-thalreth', 'mist-sentinels'],
    classIds: ['apex', 'lunarch'],
    causes: ['event-memory-wars'],
    effects: []
  },
  {
    id: 'event-vreken-overlit-epidemic',
    date: { year: 400, eraId: 'dimming', endYear: 450 },
    title: 'The Over-Lit Epidemic',
    type: 'disaster',
    phase: 'contraction',
    description:
      'With the Neth\'s expanding trade networks making Vreken fungal exports into valuable currency across all seven regions, harvest of Ghost-Mycelium intensified dramatically. Exposure intensified correspondingly. Aedris, a Marked Veil-Speaker at the Sunken Spire, became the first recorded Over-Lit case, pressing raw Ghost-Mycelium pulp to her eyes during a prolonged crypt-vigil and found three days later still glowing, still singing, but no longer able to recognize her own reflection. The epidemic exposed the fatal weakness in Marked biology: the light that makes them extraordinary is the same light that consumes them. The Clean. immune to the hush: began their quiet drift toward the leadership positions the Marked were deemed too volatile to hold.',
      locationIds: ['bryngloom-forest', 'the-sunken-spire'],
    factionIds: [],
    classIds: ['inquisitor', 'plaguebringer'],
    // No single event caused this: the epidemic was the cumulative result of Neth trade expansion
    // creating demand for Vreken fungal exports, which intensified ghost-mycelium harvesting
    causes: ['event-brine-bond-syndicate'],
    effects: ['event-inquisitor-merge']
  },
  {
    id: 'event-inquisitor-merge',
    date: { year: 380, eraId: 'dimming' },
    title: 'The Inquisitor Traditions Merge: The Barbed Vow',
    type: 'founding',
    phase: 'contraction',
    description:
      'Two parallel Wyrd-hunting traditions merged into the Inquisition. In the Bryngloom, Orven the Still-Handed (a Marked Vreken whose twin sister had gone over-lit) forged the first cold-iron blade and swore the Barbed Vow to hunt his own corrupted kinsmen. In the Frostwood Reach, Elias the Salt-Scarred (a Thalren healer) opened his own veins to draw Wyrd face-stealing horrors into living flesh. When the Sundered Monoliths cracked wider and Wyrd incursions tripled, the two orders merged. The Inquisition established chapters at Greymark Keep (Frostwood) and the Covenbane Stronghold / Sunken Spire (Bryngloom).',
      locationIds: ['bryngloom-forest', 'frostwood-reach', 'greymark-keep', 'the-sunken-spire'],
    factionIds: [],
    classIds: ['inquisitor'],
    causes: ['event-vreken-overlit-epidemic', 'event-memory-wars'],
    effects: []
  },
  {
    id: 'event-brine-bond-syndicate',
    date: { year: 300, eraId: 'dimming' },
    title: 'The Brine-Bond Syndicate Founded',
    type: 'founding',
    phase: 'contraction',
    description:
      'The Mereval Board of Trade, facing escalating storm-violence as the Iceheart Monolith\'s influence grew, formalized the Brine-Bond Syndicate at Merrowport. The Luck-Ledger was established: a system quantifying, tracking, and taxing Merryn sailors\' storm-luck. Luck became a tradeable, inheritable commodity: and the Syndicate became the gatekeeper of who could sail the storm-lanes and who would be pressed into service as Bilge-Dwellers.',
    locationIds: ['iceheart-sea', 'merrowport'],
    factionIds: ['house-mereval', 'brine-bond-syndicate'],
    classIds: ['gambit', 'minstrel'],
    causes: ['event-first-ebbing-traditions'],
    effects: []
  },
  {
    id: 'event-contraction-traditions',
    date: { year: 280, eraId: 'dimming', endYear: 400 },
    title: 'The Contraction Traditions: Mid-Era Response',
    type: 'founding',
    phase: 'contraction',
    description:
      'Six traditions emerged as the Contraction forced organized responses to Wyrd, scarcity, and the undeniable permanent decline:\n\n' +
      '• Chronarch (Year ~310): During the War of Thousand Screams, Nesta hooked a time-dilation engine into her chest at Frostmaw Holdfast.\n' +
      '• Gambit (Year ~350): Jax (Merryn pirate, wagered his lifeline against a storm-spirit at Merrowport) and Lyra (Kessen Neth probability-weaver, plucked the single surviving timeline) merged their arts.\n' +
      '• Shaper (Year ~350): Sylvanus (Frostwood kinetic dance) and Torin (Cragjaw biological body-sculpting) merged by the Mimir chronicler Veyra the Merged.\n' +
      '• Inquisitor (Year ~380): Orven the Still-Handed and Elias the Salt-Scarred merged their Wyrd-hunting traditions at the Barbed Vow.\n' +
      '• Harbinger (Year ~380): Xyris (Astril, tore the first permanent Chaos Pocket in the Sundrift Vale) and Malakor (Skald, calculated Sol\'s extinction) merged their traditions.\n' +
      '• Toxicologist (Year ~380): Varis the Trembling systematized venom extraction from the evolving fog-predators of the Frostwood Reach.',
    locationIds: ['cragjaw-peaks', 'iceheart-sea', 'frostwood-reach', 'bryngloom-forest', 'sundrift-vale', 'nordhalla'],
    factionIds: [],
    classIds: ['chronarch', 'gambit', 'shaper', 'inquisitor', 'harbinger', 'toxicologist'],
    causes: ['event-war-thousand-screams', 'event-toll-wars', 'event-memory-wars'],
    effects: []
  },

  // ============================================================
  // PHASE 4: THE SQUEEZE (Years 450-650)
  // Warmth: Accelerating decline. Intrusion: Coordinated.
  // ============================================================

  {
    id: 'event-cult-founding',
    date: { year: 412, eraId: 'dimming' },
    title: 'The Over-Shanty Established: The Cult of Forgotten Shadow',
    type: 'founding',
    phase: 'squeeze',
    description:
      'At the edge of the Bryngloom\'s peat-bogs, a permanent black market settlement coalesced beneath Atropolis\'s high canopy: the Over-Shanty. Drun outcasts, Morren defaulters, Marked Vreken refugees, and desperate merchants from every region built a lawless trading post where Neth contracts held no authority and the only currency was what you could carry and defend. In the peat-crypts beneath the Over-Shanty, a group of desperate survivors (the first cultists of what would become the Cult of Forgotten Shadow) began to experiment with something they had found in the deepest bog: a silence that spoke back.',
    locationIds: ['over-shanty', 'bryngloom-forest', 'atropolis'],
    factionIds: ['drun-outcasts', 'cult-of-forgotten-shadow'],
    classIds: ['falseProphet', 'revenant'],
    causes: ['event-drun-severing', 'event-vreken-overlit-epidemic'],
    effects: ['event-silence-between-stars']
  },
  {
    id: 'event-fortieth-rebirth',
    date: { year: 480, eraId: 'dimming' },
    title: 'The Fortieth Rebirth Window: 8%',
    type: 'cosmic',
    phase: 'squeeze',
    description:
      'The fortieth rebirth cycle. Output measured at 8%: detectable only by Augur instruments. The common people saw no warming at all during the False Dawn month. The myth of Sol\'s return, maintained for 480 years by priests and augurs, died in the streets.',
    locationIds: ['frozen-archive', 'sundale'],
    factionIds: ['house-solvan'],
    classIds: ['augur'],
    causes: ['event-twentieth-rebirth'],
    effects: ['event-false-dawn-riots']
  },
  {
    id: 'event-false-dawn-riots',
    date: { year: 480, eraId: 'dimming' },
    title: 'The False Dawn Riots',
    type: 'conflict',
    phase: 'squeeze',
    description:
      'When the fortieth Rebirth Window produced no visible warming, populations across Sundale, Nordhalla, and the Sundrift Vale erupted. The myth of Sol\'s return (the theological foundation of every regional bargain) broke. Temples were burned. Augurs were attacked in the streets. The Frozen Archive sealed its outer gates for the first time. House Solvan\'s Imperium, already hollowed by centuries of declining legitimacy, collapsed into a regency of Stewards who still refuse the title "Lord" until the sun returns. The Dawn Vigil militarized to fill the power vacuum.',
    locationIds: ['sundale', 'nordhalla', 'sundrift-vale', 'frozen-archive'],
    factionIds: ['house-solvan', 'dawn-vigil'],
    classIds: ['martyr', 'harbinger', 'falseProphet'],
    causes: ['event-fortieth-rebirth'],
    effects: ['event-solbrand-concealment']
  },
  {
    id: 'event-solbrand-concealment',
    date: { year: 480, eraId: 'dimming' },
    title: 'The Solbrand Concealment Begins',
    type: 'conspiracy',
    phase: 'squeeze',
      description:
        'In the chaos of the False Dawn Riots, the Korr tending-clan beneath Emberspire made a decision that would shape Sundale for three centuries: they concealed the Solbrand\'s measurable dimming from the outside world. The sacred flame (the primary thermal radiator of the entire Emberth vault capital) had been fading for decades. Public knowledge would have destroyed what remained of Sundale\'s theocratic legitimacy. The concealment lasted generations, passed from tending-clan matriarch to matriarch, until the Solbrand could no longer be hidden. By Year 780, three factions had formed around the truth: the Risen, the Sunderer, and the Scoured.',
      locationIds: ['sundale', 'emberspire-caldera', 'harath-vault'],
    factionIds: ['house-solvan', 'dawn-vigil'],
    classIds: ['martyr', 'pyrofiend'],
    causes: ['event-false-dawn-riots'],
    effects: []
  },
  {
    id: 'event-memory-editing',
    date: { year: 500, eraId: 'dimming' },
    title: 'The Great Revision',
    type: 'conspiracy',
    phase: 'squeeze',
    description:
      'Senior Scribe-Sentinels, having discovered that the fog makes memory malleable, began systematically editing the ledger-libraries. Entire family lines were erased. Noble houses that once existed were written out of history. The "Great Revision" continues to this day, with each generation of Sentinels believing they are the first to discover the power: never realizing their predecessors made the same discovery, edited the same records, and erased the same truths. The erased House Viridane became the Revision\'s template: if one house could be unmade, any could.',
    locationIds: ['scribes-tower', 'ledger-halls', 'greymark-keep'],
    factionIds: ['scribe-sentinels', 'house-thalreth', 'scribe-cartel'],
    classIds: ['animist'],
    causes: ['event-ledger-collapse'],
    effects: []
  },
  {
    id: 'event-silence-between-stars',
    date: { year: 598, eraId: 'dimming' },
    title: 'The Silence Between Stars: Contact Made',
    type: 'discovery',
    phase: 'squeeze',
    description:
      'The Cult of Forgotten Shadow, founded long ago in the peat-crypts beneath the Over-Shanty, made the first intentional two-way contact with the deep dark since the Breach. Something answered. Not an echo. Not a Wyrd-echo. Something that knew the cultists\' names. Something that had been waiting. This was Keth-Amar\'s first direct communication with the surface in nearly six centuries: and it signaled the shift from passive consumption to active intrusion. The Voice had begun to speak. The False Prophet tradition was born within months: Li Wei, an Ordan herd-watcher in the Sundrift Vale, witnessed the contact in a vision and looked directly into the void where Sol once shone.',
    locationIds: ['bryngloom-forest', 'over-shanty', 'sundrift-vale'],
    factionIds: ['cult-of-forgotten-shadow'],
    classIds: ['falseProphet', 'revenant', 'harbinger'],
    causes: ['event-cult-founding'],
    effects: ['event-skalyvr-void']
  },
  {
    id: 'event-squeeze-traditions',
    date: { year: 480, eraId: 'dimming', endYear: 600 },
    title: 'The Squeeze Traditions: Late-Era Crisis',
    type: 'founding',
    phase: 'squeeze',
    description:
      'Three traditions emerged from desperation and the weaponization of the Wyrd:\n\n' +
      '• Plaguebringer (Year ~500): Vespera, a Vreken alchemist, bonded with bog-rot to cure the spore-hush ravaging her family\'s cave-keeps. She injected decaying Sunken Spire moss directly into her veins. The cure worked. She became a permanent host for active decay.\n' +
      '• Revenant (Year ~550) (When bog-graves began waking on their own) the dead marching toward the Sundered Monoliths without permission: Kora the Veil-Speaker (Vreken blood-covenant) and Vesper the Scribe (Neth frost-stasis phylactery) merged their death-magic traditions at the Cold Hearth.\n' +
      '• False Prophet (Year ~598): Li Wei followed a meteor into a Sundered Monolith crater in the Sundrift Vale following the Silence Between Stars. He returned with blank white eyes, a shattered mind, and a hypnotic madness that drains listeners\' stamina.',
    locationIds: ['bryngloom-forest', 'sundrift-vale'],
    factionIds: ['cult-of-forgotten-shadow'],
    classIds: ['plaguebringer', 'revenant', 'falseProphet'],
    causes: ['event-silence-between-stars', 'event-vreken-overlit-epidemic'],
    effects: []
  },

  // ============================================================
  // PHASE 5: THE INTRUSION (Years 650-800)
  // Warmth: Terminal decline. Intrusion: Active Assault.
  // ============================================================

  {
    id: 'event-last-rebirth',
    date: { year: 660, eraId: 'dimming' },
    title: 'The Last Rebirth Window: 0%',
    type: 'cosmic',
    phase: 'intrusion',
    description:
      'The fifty-fifth rebirth cycle. For the first time in history, no output was detected. Sol was too weak to even attempt rekindling. The Augurs at the Frozen Archive recorded: "The star has stopped fighting." No cycle since has produced measurable output. The remaining Augurs (those whose accuracy had not yet collapsed) quietly removed the rebirth measurements from public record. The Frozen Archive sealed the lower chambers where the sixty-five-cycle data set is held.',
    locationIds: ['frozen-archive', 'sundale'],
    factionIds: [],
    classIds: ['augur'],
    causes: ['event-fortieth-rebirth'],
    effects: ['event-skalyvr-void']
  },
  {
    id: 'event-skalyvr-void',
    date: { year: 720, eraId: 'dimming' },
    title: 'The Void-Heat Heresy',
    type: 'conspiracy',
    phase: 'intrusion',
    description:
      'With Nordhalla\'s geothermal sumps failing and the Frozen Archive\'s heating systems degrading, Frigga Skalvyr of House Skalvyr\'s younger generation made clandestine contact with outcast Emberth pyrofiends. Construction began on a volatile heat-engine powered by Emberspire obsidian, sealed beneath the Frozen Archive\'s deepest levels. The Void-Heat engine traded the Glacier Bargain\'s slow stability for a faster, dirtier warmth: warmth stolen from the deep and from Scathrach\'s Wyrd-touched fire. The glacier-preserved dead stirred. Temporal friction began contaminating the Augurs\' readings. The engine still runs.',
    locationIds: ['frozen-archive', 'nordhalla'],
    factionIds: ['house-skalvyr'],
    classIds: ['pyrofiend', 'augur'],
    causes: ['event-last-rebirth', 'event-silence-between-stars'],
    effects: ['event-augur-collapse']
  },
  {
    id: 'event-nethering',
    date: { year: 740, eraId: 'dimming' },
    title: 'The Nethering',
    type: 'disaster',
    phase: 'intrusion',
    description:
      'The Keeper of the Last Threshold (the death-boundary entity that had enforced the Neth\'s First Contract for seven centuries) became so distracted by whatever force Keth-Amar had unleashed that the pact began to fray. The Unraveling accelerated: Neth who broke contracts on purpose to force change began experiencing the Fading, a slow dissipation into nothingness. The First Contract itself began to reject previously accepted clauses: the Arcanoneer crisis. Drun numbers swelled as Neth voluntarily severed their names from the Contract. The Keeper had been the metaphysical glue holding one of the world\'s foundational bargains together, and it was coming undone.',
    locationIds: ['bryngloom-forest', 'atropolis'],
    factionIds: [],
    classIds: ['arcanoneer', 'revenant', 'falseProphet'],
    causes: ['event-silence-between-stars'],
    effects: ['event-augur-collapse']
  },
  {
    id: 'event-augur-collapse',
    date: { year: 760, eraId: 'dimming' },
    title: 'The Augur Collapse: Accuracy Plummets',
    type: 'disaster',
    phase: 'intrusion',
    description:
      'Augur accuracy collapsed from 93% to 41% in three months. The star-arithmetic returned contradictory futures. The entrails of every sacrificed elk showed different deaths. Cause: temporal friction from the Void-Heat engine disturbing the glacier-dead, combined with Keth-Amar\'s consumption reaching a threshold that destabilized linear time itself. The world\'s early-warning system (the Augurs who had tracked every rebirth window for 760 years) was blinded at the worst possible moment. The remaining Augur elders at the Frozen Archive disagree on whether the blindness is temporary or permanent. Cassia\'s body, preserved upright in glacier-ice, has begun to weep frozen tears.',
    locationIds: ['frozen-archive', 'nordhalla'],
    factionIds: ['house-skalvyr'],
    classIds: ['augur', 'chronarch'],
    causes: ['event-skalyvr-void', 'event-nethering'],
    effects: []
  },
  {
    id: 'event-solbrand-failing',
    date: { year: 780, eraId: 'dimming' },
    title: 'The Solbrand Fails: The Dimming Becomes Visible',
    type: 'disaster',
    phase: 'intrusion',
      description:
        'The Solbrand (the sacred flame the Korr Emberth have tended in the deep vaults beneath Emberspire for nearly 800 years) visibly began to fail. The tending-clan could no longer conceal the decline. Emberspire\'s vents cooled measurably. The Thrask caldera weakened. The Frost-Tithe (Keth-Amar\'s birth-debt on Rime-Born mothers) worsened, claiming twice as many infants. Three factions crystallized around the dying Solbrand: the Risen (old faith, "Sol will return"), the Sunderer (heretics who believe the Solbrand is Keth-Amar\'s feeding-line and must be destroyed), and the Scoured (who deface their forge-marks and scour the world for Monolith Shards).',
      locationIds: ['sundale', 'emberspire-caldera', 'harath-vault'],
    factionIds: ['house-solvan', 'dawn-vigil'],
    classIds: ['martyr', 'pyrofiend', 'spellguard'],
    causes: ['event-solbrand-concealment'],
    effects: ['event-sundale-civil-war']
  },
  {
    id: 'event-sundale-civil-war',
    date: { year: 780, eraId: 'dimming' },
    title: 'The Sundale Civil War',
    type: 'conflict',
    phase: 'intrusion',
    description:
      'As the Solbrand failed, Sundale tore itself apart. The Risen, the Sunderer, and the Scoured (three incompatible interpretations of the same dying light) turned Emberspire\'s slopes into a battlefield. The Dawn Vigil split between those who believed reassembling the Monoliths would restart Sol (despite the Vigil\'s secret knowledge that it would summon Keth-Amar instead) and those who would rather let the star die than serve the Sun-Eater. Hierophant Aethelgard seized control of Korr\'s theocratic apparatus and began conscripting Martyrs as strategic resources. The Harath-Vault (home to the Berserker arenas and the Forge of Grum) became contested ground.',
      locationIds: ['sundale', 'emberspire-caldera', 'harath-vault', 'basalt-shyr'],
    factionIds: ['house-solvan', 'dawn-vigil', 'the-risen', 'the-sunderers'],
    classIds: ['martyr', 'berserker', 'pyrofiend', 'spellguard'],
    causes: ['event-solbrand-failing'],
    effects: ['event-monoliths-waking']
  },
  {
    id: 'event-geothermal-collapse',
    date: { year: 790, eraId: 'dimming' },
    title: 'The Frostmaw Geothermal Collapse',
    type: 'disaster',
    phase: 'intrusion',
    description:
      'The geothermal terraces at Frostmaw Holdfast (the primary food-growing infrastructure for the entire Cragjaw Peaks) began cooling. Hydrothermal crops failed. The Steam-Line Cartel throttled its surviving pipelines, prioritizing military and guild users. The Cragjaw\'s population faced the first mass famine in six centuries. Reports from the lower sumps claimed the Deep Alchemists had reopened their laboratories and were, once again, experimenting on something with more than two limbs.',
    locationIds: ['cragjaw-peaks', 'frostmaw-holdfast', 'gearworks-gulch'],
    factionIds: ['steam-line-cartel', 'deep-alchemists'],
    classIds: ['chronarch', 'warden', 'shaper'],
    causes: ['event-solbrand-failing'],
    effects: ['event-monoliths-waking']
  },
  {
    id: 'event-silent-sea',
    date: { year: 795, eraId: 'dimming' },
    title: 'The Silent Sea',
    type: 'catastrophe',
    phase: 'intrusion',
    description:
      'The Iceheart Sea fell silent. The tidesong (the subsonic pressure-pulse that Merryn sailors and Myrathil deep-born had navigated by for centuries) stopped. Lyris the Tide-Singer, founder of the Minstrel tradition, vanished the same night. The Treakous Rift Sundered Monolith was no longer a background hum; it was a command frequency. Myrathil Deep-Born reported hearing instructions in the silence. Ships disappeared in increasing numbers: not sunk, not wrecked, just gone. Silence has been spreading up the rivers inland. The River-Fed Myrathil are the first to encounter it in freshwater for the first time.',
    locationIds: ['iceheart-sea', 'merrowport', 'spindrift-lagoon'],
    factionIds: ['brine-bond-syndicate', 'house-mereval'],
    classIds: ['minstrel', 'gambit'],
    causes: ['event-monoliths-waking'],
    effects: []
  },
  {
    id: 'event-monoliths-waking',
    date: { year: 795, eraId: 'dimming' },
    title: 'The Waking of the Monoliths',
    type: 'catastrophe',
    phase: 'intrusion',
    description:
      'All seven Sundered Monoliths began to hum simultaneously, a frequency that could be felt in the bones as much as heard. The Shard-Window storm-vortex above the Iceheart Sea\'s Monolith intensified, pulling ships into its eye. The Berg of the Frozen Flame in the Northern Ice-Flows melted its own cradle. The Cragjaw Subterranean Vault warmed for the first time since the Binding. Emberspire\'s throat Monolith pulsed in rhythm with the Solbrand\'s failing light. The Treakous Oceanic Rift Monolith began broadcasting what the Deep-Born Myrathil call "instructions." Chaos Pockets stabilized into permanence across the Sundrift Vale. The bog-graves of Bryngloom rose and began marching. not randomly, but TOWARD the Monoliths. Every bargain struck in the past 800 years was coming due at once.',
    locationIds: ['sundale', 'iceheart-sea', 'nordhalla', 'cragjaw-peaks', 'frostwood-reach', 'bryngloom-forest', 'sundrift-vale'],
    factionIds: ['dawn-vigil', 'cult-of-forgotten-shadow'],
    classIds: ['all'],
    causes: ['event-sundale-civil-war', 'event-geothermal-collapse'],
    effects: []
  },
  {
    id: 'event-bog-dead-march',
    date: { year: 795, eraId: 'dimming' },
    title: 'The Marching Dead',
    type: 'catastrophe',
    phase: 'intrusion',
    description:
      'The dead of Bryngloom\'s peat-graves rose and began marching (not randomly animated, but MOVING in a single direction: toward the nearest Sundered Monolith. The Revenants discovered that the dead were being collected, not animated) whatever was calling them was gathering resources, not creating chaos. Twelve Revenants were found drained of blood with no wounds. The Inquisition, reduced to only forty-seven active members, could not even slow the march. The Root-Veil (the Vreken\'s continent-spanning mycelial network) began actively rejecting the Marked.',
      locationIds: ['bryngloom-forest', 'the-sunken-spire', 'over-shanty'],
    factionIds: [],
    classIds: ['revenant', 'inquisitor', 'plaguebringer'],
    causes: ['event-monoliths-waking'],
    effects: []
  }
];

const EVENT_TYPES = {
  cosmic: { label: 'Cosmic', icon: 'star' },
  ritual: { label: 'Ritual', icon: 'fire' },
  pact: { label: 'Pact', icon: 'scroll' },
  catastrophe: { label: 'Catastrophe', icon: 'bolt' },
  founding: { label: 'Founding', icon: 'flag' },
  political: { label: 'Political', icon: 'crown' },
  discovery: { label: 'Discovery', icon: 'magnifying-glass' },
  conspiracy: { label: 'Conspiracy', icon: 'mask' },
  disaster: { label: 'Disaster', icon: 'house-damage' },
  conflict: { label: 'Conflict', icon: 'swords' },
  migration: { label: 'Migration', icon: 'footprints' },
  schism: { label: 'Schism', icon: 'split' },
  cultural: { label: 'Cultural', icon: 'masks' }
};

const useTimelineStore = create((set, get) => ({
  calendar: MYTHRILL_CALENDAR,
  events: SEEDED_EVENTS,
  rebirthCycles: REBIRTH_CYCLES,
  warmthPhases: WARMTH_PHASES,
  tradeRoutes: TRADE_ROUTES,

  getEvent: (eventId) => get().events.find((e) => e.id === eventId) || null,

  getEventsByEra: (eraId) => get().events.filter((e) => e.date.eraId === eraId),

  getEventsByYear: (year) => get().events.filter((e) => e.date.year === year),

  getEventsByPhase: (phaseId) => get().events.filter((e) => e.phase === phaseId),

  getEventsByLocation: (locationId) =>
    get().events.filter((e) => e.locationIds && e.locationIds.includes(locationId)),

  getEventsByFaction: (factionId) =>
    get().events.filter((e) => e.factionIds && e.factionIds.includes(factionId)),

  getEventsByClass: (classId) =>
    get().events.filter((e) => e.classIds && e.classIds.includes(classId)),

  getEventsByType: (type) => get().events.filter((e) => e.type === type),

  getTimelineFor: ({ locationIds, factionIds, classIds }) => {
    const filters = [];
    if (locationIds) filters.push((e) => e.locationIds && locationIds.some((id) => e.locationIds.includes(id)));
    if (factionIds) filters.push((e) => e.factionIds && factionIds.some((id) => e.factionIds.includes(id)));
    if (classIds) filters.push((e) => e.classIds && classIds.some((id) => e.classIds.includes(id)));

    if (filters.length === 0) return get().events;

    return get().events.filter((e) => filters.some((fn) => fn(e)));
  },

  getCausalChain: (eventId) => {
    const event = get().getEvent(eventId);
    if (!event) return { causes: [], effects: [] };
    return {
      causes: (event.causes || []).map((id) => get().getEvent(id)).filter(Boolean),
      effects: (event.effects || []).map((id) => get().getEvent(id)).filter(Boolean)
    };
  },

  getChronology: () => CHRONOLOGY_ERA_DISPLAY,

  getEraTimeline: () => {
    const eras = get().calendar.eras;
    return eras.map((era) => ({
      ...era,
      events: get()
        .events.filter((e) => e.date.eraId === era.id)
        .sort((a, b) => a.date.year - b.date.year)
    }));
  },

  getPhaseTimeline: () => {
    return get().warmthPhases.map((phase) => ({
      ...phase,
      events: get()
        .events.filter((e) => e.phase === phase.id)
        .sort((a, b) => a.date.year - b.date.year)
    }));
  },

  getMonth: (monthId) => get().calendar.months.find((m) => m.id === monthId) || null,

  getHoliday: (holidayId) => get().calendar.holidays.find((h) => h.id === holidayId) || null,

  getEventTypes: () => EVENT_TYPES,

  getRebirthCycle: (cycleNumber) => get().rebirthCycles.find((c) => c.cycle === cycleNumber) || null,

  getWarmthPhase: (phaseId) => get().warmthPhases.find((p) => p.id === phaseId) || null,

  getWarmthPhaseForYear: (year) => {
    const phases = get().warmthPhases;
    for (const phase of phases) {
      const [start, end] = phase.years.split('-').map(Number);
      if (year >= start && year <= end) return phase;
    }
    return phases[phases.length - 1];
  },

  getTradeRoute: (routeId) => get().tradeRoutes.find((r) => r.id === routeId) || null,

  getTradeRoutesByLocation: (locationId) =>
    get().tradeRoutes.filter((r) =>
      r.origin === locationId || r.destination === locationId ||
      (r.via && r.via.includes(locationId))
    ),

  addEvent: (event) =>
    set((state) => ({ events: [...state.events, { ...event, id: event.id || `event-${Date.now()}` }] })),

  updateEvent: (eventId, updates) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === eventId ? { ...e, ...updates } : e))
    })),

  removeEvent: (eventId) =>
    set((state) => ({ events: state.events.filter((e) => e.id !== eventId) }))
}));

export { CHRONOLOGY_ERA_DISPLAY, MYTHRILL_CALENDAR, EVENT_TYPES, SEEDED_EVENTS, REBIRTH_CYCLES, WARMTH_PHASES, TRADE_ROUTES };
export default useTimelineStore;
