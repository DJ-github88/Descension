/**
 * Martyr — Resource System tab v2 authored guide.
 * Copy drafted from martyrData.js resourceSystem (Devotion tiers, thresholds)
 * since classResources.js has no Martyr entry.
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
   text: 'Intercepting an attack aimed at an ally adds +1 to +2 Devotion tiers, and absorbing a major hit (10+ damage) converts the excess into bonus progress. Damage you soak is the currency.',
  },
  hold: {
   title: 'Six Thresholds',
   icon: 'fa-shield-alt',
   text: 'Devotion advances through cumulative thresholds of 10 / 20 / 40 / 60 / 80 / 100. Every tier grows your passive auras and radiant presence — and the horror of the transfiguration.',
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
  '**Round 1:** the archer\'s shot at your wizard is intercepted (+1 tier) and a 14-damage crit adds +4 more progress — you are already climbing fast. **Round 2:** at tier 3 your DR aura protects the back line. You spend a tier to amplify the wizard\'s next spell rather than rush the dangerous bands, and soak a minor hit for 1d4 mana.',

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
   ['Intervene (major hit, 10+ dmg)', '+1 tier + excess', 'Biggest single gain'],
   ['Absorb a hit on your bastion', '+1 tier', 'Soak for progress'],
   ['Minor hit intercepted', '1d4 mana', 'Stay low on purpose'],
   ['Amplify spell', '−1 to −5 levels', 'Convert Devotion to output'],
   ['Zealot wrath tithe', 'HP cost', 'Trade health for damage'],
   ['Thresholds', '10 / 20 / 40 / 60 / 80 / 100', 'Cumulative damage absorbed'],
  ],
  footnote:
   'Devotion persists until a rest or until you are healed above 80% max HP; higher tiers force enemies to focus you.',
 },
};
