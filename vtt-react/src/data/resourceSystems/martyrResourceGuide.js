/**
 * Martyr — Resource System tab v2 authored guide.
 * Copy drafted from martyrData.js resourceSystem (Devotion tiers, thresholds)
 * and the cumulative damage / available-level contract.
 */
export const martyrResourceGuide = {
 version: 2,

 tagline:
  'Take the blow meant for someone else, then spend the pain on sacred power.',
 archetype: 'Damage Threshold Tiers',

 vitals: [
  { icon: 'fa-heart', label: 'Charge', value: 'damage absorbed for allies' },
  { icon: 'fa-shield-alt', label: 'Tiers', value: '6 (thresholds 10 → 100)' },
  { icon: 'fa-sun', label: 'Spend', value: 'amplify, cleanse, shield' },
  { icon: 'fa-exclamation-triangle', label: 'Risk', value: 'the light draws every eye' },
 ],

 loop: {
  gain: {
   title: 'Intervene',
   icon: 'fa-heart',
    text: 'Eligible damage advances a cumulative ledger. Crossing 10 / 20 / 40 / 60 / 80 / 100 earns levels; explicit spell-level grants are separate from damage progress.',
  },
  hold: {
   title: 'Six Thresholds',
   icon: 'fa-shield-alt',
    text: 'Displayed Devotion is available levels, 0–6. Cumulative damage, earned levels, spent levels and explicit bonus levels are distinct. Spending does not erase damage history or permit the next point of damage to refund a spent tier.',
  },
  spend: {
   title: 'Amplify',
   icon: 'fa-sun',
   text: 'Spend tiers to amplify spells (1–5 levels), fire sacred shockwaves, cleanse party debuffs, or raise team barriers. A minor hit intercepted instead restores 1d4 mana.',
  },
  risk: {
   title: 'The Beacon',
   icon: 'fa-exclamation-triangle',
   text: 'Higher tiers make you radiate brilliant light, and intelligent enemies focus every attack on you. Spending Devotion strips your own auras — the resource is also your armor.',
  },
 },

 exampleTurn:
   'At 62 cumulative eligible damage, four levels have been earned. Spend two: available Devotion becomes 2, while damage stays 62. At 73 damage it remains 2; crossing 80 earns the fifth level, leaving 3 available. An explicit level grant restores available levels without inventing damage.',

 weaveIn: [
  {
   text: 'Amplify spells turn Devotion levels into raw output; self-sacrifice spells convert your own HP into progress.',
   tab: 'spells',
   tabLabel: 'browse the spellbook',
  },
  {
   text: 'Devotion, Zealot, Ascetic, and Ironclad each turn the same wounds into different miracles.',
   tab: 'specializations',
   tabLabel: 'compare the four paths',
  },
  {
   text: 'The Minor Hit loop — soak small hits for mana instead of tiers — is how you stay useful without racing toward tier 5.',
  },
 ],

 quickStart: {
  title: 'Devotion at a Glance',
  headers: ['Action', 'Devotion', 'What it does'],
  rows: [
    ['Eligible damage progress', 'Damage ledger', 'Only a newly crossed threshold earns a level'],
    ['Explicit Devotion gain', '+levels', 'A typed level grant, not damage points'],
   ['Minor hit intercepted', '1d4 mana', 'Stay low on purpose'],
   ['Amplify spell', '−1 to −5 levels', 'Convert Devotion to output'],
   ['Zealot wrath tithe', 'HP cost', 'Trade health for damage'],
   ['Thresholds', '10 / 20 / 40 / 60 / 80 / 100', 'Cumulative damage absorbed'],
  ],
  footnote:
    'Spells spend levels, not HP or damage points. Explicit tier controls establish a fresh ledger at that tier; ordinary spending preserves cumulative damage. Automatic damage-source qualification, decay and passive aura resolution are separate engine work.',
 },
};
