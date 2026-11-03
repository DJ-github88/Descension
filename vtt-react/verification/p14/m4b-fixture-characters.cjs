// M4B normal-App witness fixture characters (witness-only; no product code).
// Each page hydrates one complete explicit record through production
// characterStore.loadCharacter after boot initialization settles, so no field of the
// boot placeholder (random heritage/equipment) can survive into the cast.
//
// Expected owner score, by the existing attributeProfile rules (explicit model
// base+earned@1: effective = stats + heritage + origin; equipment then added by
// getTotalStatsWithEffects):
//   stats.spirit 17 (= baseStats 17 + no earned gains at level 1)
//   + heritage human/thalren_human spirit +1
//   + origin none (background '')
//   + equipment none (all slots explicitly empty)
//   = effective Spirit 18, matching the room token's attested spirit 18.
const STATS_MODEL = 'base+earned@1';
// Canonical slot names from src/utils/equipmentUtils.js createEmptyEquipment().
const slots = ['head', 'neck', 'shoulders', 'back', 'chest', 'shirt', 'tabard', 'wrists', 'gloves', 'waist', 'legs', 'feet', 'ring1', 'ring2', 'trinket1', 'trinket2', 'mainHand', 'offHand', 'ranged'];
const noEquipment = () => Object.fromEntries(slots.map(slot => [slot, null]));
const attrs = (o = {}) => ({ strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 10, charisma: 10, ...o });
const record = ({ id, name, cls, level, race, subrace, stats, extra = {} }) => ({
  id, name, class: cls, level, race, subrace, background: '', backgroundDisplayName: '', ancestry: null,
  statsModel: STATS_MODEL, baseStats: { ...stats }, stats: { ...stats }, levelUpHistory: {},
  equipment: noEquipment(), inventory: { items: [], currency: { platinum: 0, gold: 0, silver: 0, copper: 0 }, encumbranceState: 'normal' },
  ...extra
});
const known = { class_spells: { known_spells: ['martyr_restorative_prayer'] } };
const devotion = { classResource: { type: 'devotion', current: 0, max: 6, damage: 0, earnedLevels: 0, spentLevels: 0, bonusLevels: 0 } };

exports.EXPECTED_OWNER_EFFECTIVE_SPIRIT = 18;
exports.characters = {
  'app-gm': record({ id: 'gm', name: 'GM', cls: 'Martyr', level: 1, race: 'human', subrace: 'skald_human', stats: attrs({ spirit: 18 }), extra: { ...devotion, ...known } }),
  'app-owner': record({ id: 'ilse', name: 'Ilse', cls: 'Martyr', level: 1, race: 'human', subrace: 'thalren_human', stats: attrs({ spirit: 17 }),
    extra: { health: { current: 20, max: 40 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 }, ...devotion, ...known } }),
  'app-target': record({ id: 'ally', name: 'Ally', cls: 'Arcanoneer', level: 3, race: 'human', subrace: 'skald_human', stats: attrs({ intelligence: 16 }),
    extra: { health: { current: 20, max: 30 }, tempHealth: 3, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 } } })
};
