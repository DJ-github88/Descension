import { create } from 'zustand';

const MYTHRILL_CALENDAR = {
  weekLength: 10,
  weeksPerMonth: 3,
  monthsPerYear: 12,
  daysPerMonth: 30,
  months: [
    { id: 1, name: 'First Thaw', season: 'false-spring', description: 'The month when the ice cracks but does not break' },
    { id: 2, name: 'The False Dawn', season: 'false-spring', description: 'A brief lightening of the sky — not warmth, but the memory of warmth' },
    { id: 3, name: 'Day of Binding', season: 'false-spring', description: 'Commemorates the entombment of Sol beneath Sundale' },
    { id: 4, name: 'Ashfall', season: 'embers', description: 'Volcanic ash drifts north from Sundale, coating the snow grey' },
    { id: 5, name: 'Emberspire\'s Breath', season: 'embers', description: 'Geothermal vents surge — the warmest month, though still below freezing' },
    { id: 6, name: 'The Dimming', season: 'embers', description: 'Even the residual volcanic glow begins to fade; the darkest month' },
    { id: 7, name: 'First Frost', season: 'deepening-winter', description: 'The cold intensifies; livestock must be brought underground' },
    { id: 8, name: 'Hunger Moon', season: 'deepening-winter', description: 'Food stores run low; the month when most deaths occur' },
    { id: 9, name: 'The Long Dark', season: 'deepening-winter', description: 'The longest nights; families gather in sump-halls for warmth' },
    { id: 10, name: 'Star-Count', season: 'deepening-winter', description: 'Astril constellation-readers gather to count the remaining visible stars' },
    { id: 11, name: 'Midwinter', season: 'deepening-winter', description: 'The solstice; children born in this month are said to carry the Frostmaiden\'s blessing' },
    { id: 12, name: 'The Creeping Light', season: 'false-dawn', description: 'The first subtle sign that another cycle will begin — or so the priests claim' }
  ],
  eras: [
    { id: 'before-deepening', name: 'Before the Deepening', startYear: null, endYear: 0, description: 'The age when Sol still burned bright and the world was warm' },
    { id: 'deepening', name: 'The Deepening', startYear: 0, endYear: 12, description: 'Sol\'s death-rebirth trance — the twelve years of dying light' },
    { id: 'dimming', name: 'The Age of the Dimming', startYear: 12, endYear: null, description: 'The current age — 800+ years of frozen twilight' }
  ],
  holidays: [
    { id: 'binding-day', name: 'Day of Binding', date: { month: 3, day: 15 }, description: 'Marks the ritual entombment of Sol. Solemn fasts and candle-lighting ceremonies.' },
    { id: 'midwinter', name: 'Midwinter Solstice', date: { month: 11, day: 21 }, description: 'The longest night. Sacrifices are offered to appease the cold. Children born today are believed blessed.' },
    { id: 'first-thaw-vigil', name: 'First Thaw Vigil', date: { month: 1, day: 1 }, description: 'Families stay awake all night watching for the first crack in the ice — an omen for the year ahead.' },
    { id: 'breach-day', name: 'Day of the Breach', date: { month: 6, day: 30 }, description: 'Commemorates Keth-Amar consuming the six sacrificed heirs. A day of mourning and whispered fears.' }
  ]
};

const SEEDED_EVENTS = [
  {
    id: 'event-sol-deepening',
    date: { year: 0, eraId: 'deepening' },
    title: 'Sol Enters the Deepening',
    type: 'cosmic',
    description:
      'The sun-god Sol entered its ancient death-rebirth cycle called the Deepening. Its light began to dim. The Augurs of the seven noble houses were the first to read the signs in the cooling light.',
    locationIds: ['sundale'],
    factionIds: ['house-thalreth', 'house-skalvyr', 'house-solvan', 'house-ordavan'],
    classIds: ['augur', 'doomsayer', 'oracle'],
    causes: [],
    effects: ['event-entombment', 'event-fog-compact']
  },
  {
    id: 'event-entombment',
    date: { year: 3, eraId: 'deepening' },
    title: 'The Entombment of Sol',
    type: 'ritual',
    description:
      'The seven noble families pooled their bloodlines to entomb the dying sun beneath Sundale. They used the hide of Aex — Sol\'s firstborn, a living entity of pure solar fire — to weave the binding seal. The ritual exhausted the families and the world began to freeze.',
    locationIds: ['sundale', 'emberspire'],
    factionIds: ['house-thalreth', 'house-skalvyr', 'house-solvan', 'house-mereval', 'house-ordavan', 'house-tesshan', 'house-viridane'],
    classIds: ['inscriptor', 'titan', 'warden', 'spellguard'],
    causes: ['event-sol-deepening'],
    effects: ['event-fog-compact', 'event-glacier-bargain', 'event-steppe-migration', 'event-iceheart-storm']
  },
  {
    id: 'event-fog-compact',
    date: { year: 5, eraId: 'deepening' },
    title: 'The Fog Compact',
    type: 'pact',
    description:
      'House Thalreth sealed the Fog Compact, trading the Frostwood Reach\'s spatial clarity for an insulating fog that would prevent the ironwood forests and their native beasts from freezing into glass. The first Scribe-Sentinels were founded to maintain the ledgers.',
    locationIds: ['greymark-keep', 'scribes-tower'],
    factionIds: ['house-thalreth', 'scribe-sentinels'],
    classIds: ['inscriptor'],
    causes: ['event-entombment'],
    effects: ['event-ledger-collapse']
  },
  {
    id: 'event-glacier-bargain',
    date: { year: 7, eraId: 'deepening' },
    title: 'The Skalvyr Glacier Bargain',
    type: 'pact',
    description:
      'As titanic glaciers advanced to grind Nordhalla\'s mountain keeps into dust, House Skalvyr bargained with the Cosmic Warden to freeze the ice sheets in place. The Warden capitulated but decreed that summer would never return to the north.',
    locationIds: ['frozen-archive', 'fjord-gate'],
    factionIds: ['house-skalvyr'],
    classIds: ['skald', 'doomsayer'],
    causes: ['event-entombment'],
    effects: ['event-nordhalla-freeze']
  },
  {
    id: 'event-keth-amar-breach',
    date: { year: 11, eraId: 'deepening' },
    title: 'Keth-Amar Consumes the Heirs',
    type: 'catastrophe',
    description:
      'The cosmic predator Keth-Amar, denied its prey, whispered to the starving nobles of warmth in exchange for their firstborn heirs. Six desperate families capitulated. Keth-Amar consumed the children as vessel-keys, shattering the seal into seven Sundered Monoliths. The Wyrd bled through the cracks.',
    locationIds: ['emberspire', 'sundrift-vale'],
    factionIds: ['house-solvan', 'house-ordavan', 'house-mereval', 'house-tesshan'],
    classIds: ['martyr', 'exorcist', 'huntress', 'deathcaller', 'covenbane'],
    causes: ['event-entombment'],
    effects: ['event-wyrd-emergence', 'event-church-founding']
  },
  {
    id: 'event-church-founding',
    date: { year: 13, eraId: 'dimming' },
    title: 'Founding of the Church of the Holy Light',
    type: 'founding',
    description:
      'In the first year after Sol\'s entombment, the Church of the Holy Light was formally established at Greymark Keep. The first priests were not theologians — they were parents who discovered that holding a dying child and refusing to accept their death could kindle a warmth with no physical source.',
    locationIds: ['greymark-keep'],
    factionIds: ['church-of-the-holy-light', 'house-thalreth'],
    classIds: ['martyr'],
    causes: ['event-entombment', 'event-wyrd-emergence'],
    effects: ['event-northern-schism']
  },
  {
    id: 'event-ledger-collapse',
    date: { year: 203, eraId: 'dimming' },
    title: 'The Ledger Halls Collapse',
    type: 'disaster',
    description:
      'A catastrophic structural failure buried the original Ledger Halls beneath petrified roots. Hundreds of irreplaceable records were lost. The Scribe-Sentinels\' authority was permanently weakened, and the first gaps in the Reach\'s collective memory appeared.',
    locationIds: ['ledger-halls', 'scribes-tower'],
    factionIds: ['house-thalreth', 'scribe-sentinels'],
    classIds: ['inscriptor'],
    causes: ['event-fog-compact'],
    effects: ['event-memory-editing']
  },
  {
    id: 'event-northern-schism',
    date: { year: 89, eraId: 'dimming' },
    title: 'Aldren Thalreth\'s Self-Entombment',
    type: 'political',
    description:
      'High Confessor Aldren Thalreth, the Church\'s founding leader, sealed himself in meditative stasis within the Frozen Archive. His stated purpose was to preserve himself until the sun returned. His true motive — discovered centuries later in hidden correspondence — was to escape the knowledge that the Light and the Void are a single entity split in two.',
    locationIds: ['frozen-archive'],
    factionIds: ['church-of-the-holy-light', 'house-thalreth'],
    classIds: ['martyr'],
    causes: ['event-church-founding'],
    effects: ['event-council-elders']
  },
  {
    id: 'event-cult-founding',
    date: { year: 412, eraId: 'dimming' },
    title: 'Founding of the Cult of Forgotten Shadow',
    type: 'founding',
    description:
      'Natalie Seline, a priestess who had been excommunicated for studying forbidden Void texts, wandered into the peat-bogs of Bryngloom and returned three days later with blank white eyes and knowledge of Shadow magic no mortal should possess. She dictated the Shadow Catechism and founded the Cult in the Over-Shanty.',
    locationIds: ['over-shanty', 'peat-bog-sinks'],
    factionIds: ['cult-of-forgotten-shadow', 'church-of-the-holy-light'],
    classIds: ['falseProphet', 'lichborne'],
    causes: ['event-church-founding', 'event-wyrd-emergence'],
    effects: ['event-void-contact']
  },
  {
    id: 'event-memory-editing',
    date: { year: 500, eraId: 'dimming' },
    title: 'The Great Revision',
    type: 'conspiracy',
    description:
      'Senior Scribe-Sentinels, having discovered that the fog makes memory malleable, began systematically editing the ledger-libraries. Entire family lines were erased. Noble houses that once existed were written out. The "Great Revision" continues to this day, with each generation of Sentinels believing they are the first to discover the power.',
    locationIds: ['scribes-tower', 'ledger-halls'],
    factionIds: ['scribe-sentinels', 'house-thalreth'],
    classIds: ['inscriptor'],
    causes: ['event-ledger-collapse'],
    effects: []
  },
  {
    id: 'event-preservation-pact',
    date: { year: 17, eraId: 'dimming' },
    title: 'The Preservation Compact',
    type: 'pact',
    description:
      'The remaining noble houses formalized the system of dark bargains that would define the Age of the Dimming. Each house carved its sacrifice into a memory-glass tablet and sealed it in the Council Chamber. The tablets are still there. Three of them have been altered.',
    locationIds: ['greymark-keep'],
    factionIds: ['house-thalreth', 'house-skalvyr', 'house-solvan', 'house-mereval', 'house-ordavan', 'house-tesshan', 'house-viridane'],
    classIds: ['inscriptor'],
    causes: ['event-keth-amar-breach'],
    effects: []
  },
  {
    id: 'event-void-contact',
    date: { year: 598, eraId: 'dimming' },
    title: 'The Silence Between Stars Speaks',
    type: 'discovery',
    description:
      'Natalie Seline\'s inner circle made contact with the entity calling itself "the Silence Between Stars" — a chorus of every consciousness consumed by the Void. The Cult began developing Void-heat technology, offering warmth without the Light.',
    locationIds: ['over-shanty'],
    factionIds: ['cult-of-forgotten-shadow'],
    classIds: ['falseProphet', 'lichborne'],
    causes: ['event-cult-founding'],
    effects: ['event-skalyvr-void']
  },
  {
    id: 'event-skalyvr-void',
    date: { year: 720, eraId: 'dimming' },
    title: 'Skalvyr\'s Desperate Bargain',
    type: 'conspiracy',
    description:
      'With Nordhalla\'s geothermal sumps failing, House Skalvyr\'s younger generation made clandestine contact with the Cult of Forgotten Shadow. Construction began on the first Void-heat engine, sealed beneath the Frozen Archive.',
    locationIds: ['frozen-archive'],
    factionIds: ['house-skalvyr', 'cult-of-forgotten-shadow'],
    classIds: ['martyr', 'doomsayer'],
    causes: ['event-void-contact'],
    effects: []
  },
  {
    id: 'event-briaran-uprising',
    date: { year: 350, eraId: 'dimming' },
    title: 'The Briaran Uprising',
    type: 'conflict',
    description:
      'The Unshorn Briaran, rejecting the Fog Compact, launched a series of raids against timber caravans and ledger-shrines. House Thalreth responded with a brutal suppression campaign that drove the Briaran deep into the Ironwood Heart. The conflict has smoldered for generations.',
    locationIds: ['ironwood-heart', 'the-shallows'],
    factionIds: ['unshorn-briaran', 'house-thalreth', 'mist-sentinels'],
    classIds: ['primalist', 'huntress'],
    causes: ['event-fog-compact'],
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
  conflict: { label: 'Conflict', icon: 'swords' }
};

const useTimelineStore = create((set, get) => ({
  calendar: MYTHRILL_CALENDAR,
  events: SEEDED_EVENTS,

  getEvent: (eventId) => get().events.find((e) => e.id === eventId) || null,

  getEventsByEra: (eraId) => get().events.filter((e) => e.date.eraId === eraId),

  getEventsByYear: (year) => get().events.filter((e) => e.date.year === year),

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

  getEraTimeline: () => {
    const eras = get().calendar.eras;
    return eras.map((era) => ({
      ...era,
      events: get()
        .events.filter((e) => e.date.eraId === era.id)
        .sort((a, b) => a.date.year - b.date.year)
    }));
  },

  getMonth: (monthId) => get().calendar.months.find((m) => m.id === monthId) || null,

  getHoliday: (holidayId) => get().calendar.holidays.find((h) => h.id === holidayId) || null,

  getEventTypes: () => EVENT_TYPES,

  addEvent: (event) =>
    set((state) => ({ events: [...state.events, { ...event, id: event.id || `event-${Date.now()}` }] })),

  updateEvent: (eventId, updates) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === eventId ? { ...e, ...updates } : e))
    })),

  removeEvent: (eventId) =>
    set((state) => ({ events: state.events.filter((e) => e.id !== eventId) }))
}));

export { MYTHRILL_CALENDAR, EVENT_TYPES, SEEDED_EVENTS };
export default useTimelineStore;
