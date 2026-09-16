/**
 * Warden — Resource System tab v2 authored guide.
 * Canonical values from classResources.js CLASS_RESOURCE_TYPES['Warden'].
 */
export const wardenResourceGuide = {
 version: 2,

 tagline:
  'Every hunted thing drags the chain tighter — build Tension, then reel your quarry in.',
 archetype: 'Tension Chain (0–10 VP)',

 vitals: [
  { icon: 'fa-crosshairs', label: 'Generate', value: 'strikes, marks, evasions' },
  { icon: 'fa-lock', label: 'Cap', value: '10 Tension' },
  { icon: 'fa-bolt', label: 'Spend', value: '2–10 on retribution' },
  { icon: 'fa-exclamation-triangle', label: 'Risk', value: 'a broken tether stuns' },
 ],

 loop: {
  gain: {
   title: 'Mark and Strike',
   icon: 'fa-crosshairs',
   text: 'Successful melee attacks add +1 Tension, attacks against your marked target +2, a successful evasion +1, and a critical hit +2. The duel itself feeds you.',
  },
  hold: {
   title: 'Pursuit',
   icon: 'fa-lock',
   text: 'Each banked Tension adds +5 ft speed toward your marked target, up to +50 ft. The Warden does not teleport — the chain simply never lets go.',
  },
  spend: {
   title: 'Reel Them In',
   icon: 'fa-bolt',
   text: 'Spend 2–10 Tension on retributive abilities: +2d6 strike riders (2), Whirling Glaive cones (3), healing resolve (4), Cage of Vengeance (6), or Avatar of Vengeance (10).',
  },
  risk: {
   title: 'Broken Chain',
   icon: 'fa-exclamation-triangle',
   text: 'If the tethered target breaks the chain through extreme distance or force, the recoil stuns you for 1 turn. Keep the 15 ft forced duel intact.',
  },
 },

 exampleTurn:
  '**Round 1:** you mark the ogre and land a hit (+2 Tension) — Vengeful Strike is already online. **Round 2:** it tries to run; your pursuit speed (+10 ft) keeps you glued, and a crit (+2) takes you to 5. You spend 4 on Hunter\'s Resolve to shrug off its parting swing, bank the rest, and keep the chain taut.',

 weaveIn: [
  {
   text: 'Every retributive ability is priced in Tension — 2 for a strike rider up to 10 for Avatar of Vengeance.',
   tab: 'spells',
   tabLabel: 'browse the spellbook',
  },
  {
   text: 'Iron Stalker, Iron Jailer, Relentless Tormentor, and Monolith each answer a different question: stealth, cages, drags, or immovability.',
   tab: 'specializations',
   tabLabel: 'compare the four paths',
  },
  {
   text: 'The mark is the engine: no marked target, no +2 gains. Pick your quarry before you pick your fight.',
  },
 ],

 quickStart: {
  title: 'Tension at a Glance',
  headers: ['Action', 'Tension', 'What it does'],
  rows: [
   ['Successful melee attack', '+1', 'Baseline gain'],
   ['Attack on marked target', '+2', 'Keep the duel alive'],
   ['Successful evasion', '+1', 'Defense feeds the chain'],
   ['Critical hit', '+2', 'Spike gain'],
   ['Vengeful Strike', '−2', '+2d6 damage on your next attack'],
   ['Whirling Glaive', '−3', '15 ft cone, 2d6 + slow'],
   ['Cage of Vengeance', '−6', 'Trap the quarry for 3 rounds'],
   ['Avatar of Vengeance', '−10', 'Ultimate transformation for 4 rounds'],
  ],
  footnote:
   'Tension caps at 10; pursuit movement is +5 ft per point toward your marked target (max +50 ft).',
 },
};
