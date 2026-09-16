/**
 * Augur — Resource System tab v2 authored guide.
 * Canonical values from classResources.js CLASS_RESOURCE_TYPES['Augur']
 * (Benediction/Malediction, spec pools, Omen Debt).
 */
export const augurResourceGuide = {
 version: 2,

 tagline:
  'Every roll at the table is a sign — even dice feed Benediction, odd dice feed Malediction.',
 archetype: 'Dual Omen Pools (0–10 each)',

 vitals: [
  { icon: 'fa-dice-d20', label: 'Generate', value: 'every visible d20 within 60 ft' },
  { icon: 'fa-balance-scale', label: 'Pools', value: '10 Benediction / 10 Malediction' },
  { icon: 'fa-eye', label: 'Spend', value: 'boons, curses, terrain' },
  { icon: 'fa-exclamation-triangle', label: 'Risk', value: 'Omen Debt at long rest' },
 ],

 loop: {
  gain: {
   title: 'Read the Roll',
   icon: 'fa-dice-d20',
   text: 'Every even d20 result you can see within 60 ft adds +1 Benediction; every odd result adds +1 Malediction. Natural 20s and 1s give +2, and both dice of advantage/disadvantage count.',
  },
  hold: {
   title: 'Two Pools',
   icon: 'fa-balance-scale',
   text: 'Benediction and Malediction are separate pools that both cap at 10 — your specialization swings the split to 15/5. Overflow is simply lost, so spend before the cap.',
  },
  spend: {
   title: 'Signs and Curses',
   icon: 'fa-eye',
   text: 'Benediction buys blessings, sacred terrain, and Domains; Malediction buys curses, hazard zones, and Grand Maledictions. Reaction rites turn a near-miss into a crit or force a boss to fail.',
  },
  risk: {
   title: 'Omen Debt',
   icon: 'fa-exclamation-triangle',
   text: 'Unused points at a **long rest** become Omen Debt (−1 per point to all your rolls next day, cap −10). An empty pool in combat forces a Blood Price to seed the ledger.',
  },
 },

 exampleTurn:
  'Combat opens with the 1d4 pool trickle, then the table does the work: the rogue rolls a natural 20 (+2 Benediction) and the ogre\'s attacks come up odd twice (+2 Malediction). You spend 2 Benediction on a minor blessing for the rogue and bank the Malediction — at the boss\'s next swing you burn 3 on a Minor Curse to force the miss that ends the fight.',

 weaveIn: [
  {
   text: 'Your rites and hexes are paid for in signs — reaction timing lets you spend pools the moment a die lands.',
   tab: 'spells',
   tabLabel: 'browse the spellbook',
  },
  {
   text: 'Auspex keeps the pools balanced at 10/10, Harbinger feeds on Malediction (15), and Hierophant on Benediction (15).',
   tab: 'specializations',
   tabLabel: 'compare the three paths',
  },
  {
   text: 'The 60 ft visibility rule is the real constraint: keep the fight close enough to read, or the ledger stops filling.',
  },
 ],

 quickStart: {
  title: 'Reading the Omens',
  headers: ['Sign', 'Pool', 'What it does'],
  rows: [
   ['Even d20 (visible, 60 ft)', '+1 Benediction', 'Any ally or enemy roll feeds you'],
   ['Odd d20 (visible, 60 ft)', '+1 Malediction', 'Odd results are still value'],
   ['Natural 20', '+2 Benediction', 'Jackpot'],
   ['Natural 1', '+2 Malediction', 'Curses love a fumble'],
   ['Minor Blessing / Curse', '−2 to −3', '+2 defense, or −2 enemy defense'],
   ['Sacred / Cursed Terrain', '−4 to −5', 'Zone that heals or harms'],
   ['Long rest', 'Omen Debt', '−1 per unused point to all rolls (cap −10)'],
  ],
  footnote:
   'Pools cap at 10 each; specialization variants: Auspex 10/10, Harbinger 5/15, Hierophant 15/5.',
 },
};
