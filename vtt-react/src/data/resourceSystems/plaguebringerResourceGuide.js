/**
 * Plaguebringer — Resource System tab v2 authored guide.
 * Copy drafted from plaguebringerData.js resourceSystem (Virulence 0–100,
 * stage thresholds, ember sensitivity). No classResources entry.
 */
export const plaguebringerResourceGuide = {
 version: 2,

 tagline:
  'Seed infections, cultivate stages, and harvest what grows — mind the fire.',
 archetype: 'Culture Meter (0–100)',

 vitals: [
  { icon: 'fa-seedling', label: 'Grow', value: 'seeds and cultivation' },
  { icon: 'fa-skull', label: 'Thresholds', value: '25 Sprouting · 50 Blooming · 75+ Peak' },
  { icon: 'fa-biohazard', label: 'Harvest', value: 'Stage 3 detonations' },
  { icon: 'fa-fire', label: 'Risk', value: 'ember burns cultures' },
 ],

 loop: {
  gain: {
   title: 'Seed and Cultivate',
   icon: 'fa-seedling',
   text: 'Planting a base seed adds +10 Virulence, sowing contagion +5, cultivating a stage +15, and bursting a corpse +20. The culture decays −2 per round without care.',
  },
  hold: {
   title: 'The Growth Curve',
   icon: 'fa-skull',
   text: 'Outbreaks pass 25 (Sprouting) and 50 (Blooming) on the way to Peak Harvest at 75+, where dispels start failing. Keep multiple Stage 1 infections spreading for compounding ticks.',
  },
  spend: {
   title: 'Harvest',
   icon: 'fa-biohazard',
   text: 'Harvest mature Stage-3 infections for necrotic explosions that spread spores to everyone nearby. The garden pays out all at once.',
  },
  risk: {
   title: 'Fire and Decay',
   icon: 'fa-fire',
   text: 'Ember damage burns your cultures: −1 stage and −25 Virulence. Kill fire casters first or lose the harvest.',
  },
 },

 exampleTurn:
  '**Round 1:** you seed two cultists (+10 each) and let the first Stage 1 tick. **Round 3:** a cultivate (+15) pushes you past Blooming at 50 while both targets suffer. **Round 5:** Peak Harvest at 78 — the mage\'s dispel fails, you trigger the corpse burst (+20) and harvest a Stage 3 for the detonation that finishes the room, all before the ember caster acts again.',

 weaveIn: [
  {
   text: 'Affliction spells advance stages; harvest abilities cash Stage 3 infections for the payoff.',
   tab: 'spells',
   tabLabel: 'browse the spellbook',
  },
  {
   text: 'Virulent Spreader plays wide, Torment Weaver plays connected, Decay Harbinger plays deep.',
   tab: 'specializations',
   tabLabel: 'compare the three paths',
  },
  {
   text: 'Thresholds are your real spend meter: 25 / 50 / 75 change what your existing infections do.',
  },
 ],

 quickStart: {
  title: 'Virulence at a Glance',
  headers: ['Action', 'Virulence', 'What it does'],
  rows: [
   ['Apply base seed', '+10', 'Main growth'],
   ['Sow contagion', '+5', 'Spread the culture'],
   ['Cultivate a stage', '+15', 'Accelerate a target'],
   ['Corpse burst', '+20', 'Death feeds the garden'],
   ['Round decay', '−2', 'Cultures cool without care'],
   ['25 / 50 / 75+', 'Sprouting / Blooming / Peak', 'Escalating payoff thresholds'],
   ['Ember damage', '−1 stage, −25 Virulence', 'Fire is the hard counter'],
  ],
  footnote:
   'Virulence runs 0–100; harvest is only possible from mature Stage-3 infections.',
 },
};
