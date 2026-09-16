/**
 * Gambit — Resource System tab v2 authored guide.
 * Copy drafted from gambitData.js resourceSystem (Fortune/Debt, Fate Reserve,
 * Wyrd Collapse at Debt 13). No classResources entry.
 */
export const gambitResourceGuide = {
 version: 2,

 tagline:
  'Wager Fortune on the dice, but the ledger always collects — Debt 13 is the house.',
 archetype: 'Dual Currency (Fortune / Debt)',

 vitals: [
  { icon: 'fa-dice', label: 'Fortune', value: '0–15 base (spec-scaled)' },
  { icon: 'fa-balance-scale', label: 'Debt', value: '0–13 gauge' },
  { icon: 'fa-dice-d20', label: 'Spend', value: '±1 per Fortune on any d20' },
  { icon: 'fa-exclamation-triangle', label: 'Risk', value: 'Wyrd Collapse' },
 ],

 loop: {
  gain: {
   title: 'Wager',
   icon: 'fa-dice',
   text: 'Fortune arrives from lucky strikes, ally natural 20s, and enemy fumbles (+1 to +3 each), plus your pre-drawn Fate Reserve hand — generating Fortune carries no physical toll.',
  },
  hold: {
   title: 'The Ledger',
   icon: 'fa-balance-scale',
   text: 'Two gauges run in opposite directions: Fortune buys outcomes, Debt tracks borrowed probability. Spending Fortune costs 1d4 wyrd per point, and Debt stacks do not go away quietly.',
  },
  spend: {
   title: 'Nudge the Dice',
   icon: 'fa-dice-d20',
   text: 'Modify any d20 after seeing the roll — +1/−1 per Fortune point — or spend Fate Reserve cards to hard-replace a roll. Some overrides add Debt.',
  },
  risk: {
   title: 'Collapse',
   icon: 'fa-exclamation-triangle',
   text: 'Debt 13 or Fortune 0 triggers a Wyrd Collapse: Fortune empties, Debt resets, and 6d10 wyrd lands on the table. Calculated Risk cannot be reduced, prevented, or mitigated.',
  },
 },

 exampleTurn:
  '**Round 2:** the paladin\'s smite misses by 1 — you spend 1 Fortune, take 1d4 wyrd, and the crit lands. Debt does not move. **Round 5:** the boss\'s save succeeds by 2; you spend 2 more Fortune and a Fate Reserve card to force the exact failure, pushing Debt to 11. **Round 6:** you stop nudging, take the loss, and let Debt cool instead of riding to 13.',

 weaveIn: [
  {
   text: 'Lucky Strike, Lucky Toss, and the rest of the spell list both generate Fortune and add Debt.',
   tab: 'spells',
   tabLabel: 'browse the spellbook',
  },
  {
   text: 'Probability Savant, High Roller, and Karmic Weaver set different Fortune caps and stakes.',
   tab: 'specializations',
   tabLabel: 'compare the three paths',
  },
  {
   text: 'Fate Reserve cards are a second hand: banked outcomes you spend without touching Fortune\'s 1d4 tax.',
  },
 ],

 quickStart: {
  title: 'The Ledger at a Glance',
  headers: ['Trigger', 'Change', 'What it does'],
  rows: [
   ['Lucky Strike / Toss', '+1 to +3 Fortune', 'Combat generation'],
   ['Enemy fumble / ally nat 20', '+1 to +3 Fortune', 'Table luck feeds you'],
   ['Spend 1 Fortune on a d20', '1d4 wyrd to you', 'After the roll, before the outcome'],
   ['Fate Reserve card', 'Hard override', 'No Fortune cost; some add Debt'],
   ['Fate Reserve / Arcane Dirge', '+2 to +4 Debt', 'Borrowed probability'],
   ['Fortune 0 / Debt 13', 'Wyrd Collapse', '6d10 wyrd, both gauges reset'],
  ],
  footnote: 'Fortune caps at 15 base and scales with specialization; Debt collapses at 13.',
 },
};
