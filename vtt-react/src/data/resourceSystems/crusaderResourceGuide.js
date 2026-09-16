/**
 * Crusader — Resource System tab v2 authored guide.
 *
 * Copy is drafted from the canonical classResources.js
 * CLASS_RESOURCE_TYPES['Crusader'] generation/spending lists and the class
 * specializations, so the meter's thresholds read the same everywhere.
 */
export const crusaderResourceGuide = {
 version: 2,

 tagline:
  'Strike, block, and hold holy ground to build Fervor — then vent it as starlight judgment.',
 archetype: 'Charge Meter (0–100)',

 vitals: [
  { icon: 'fa-cross', label: 'Generate', value: 'strikes, blocks, holy ground' },
  { icon: 'fa-gauge-high', label: 'Thresholds', value: '50 stance · 100 judgment' },
  { icon: 'fa-bolt', label: 'Spend', value: 'smites, shields, judgments' },
  { icon: 'fa-exclamation-triangle', label: 'Risk', value: 'overload above 80' },
 ],

 loop: {
  gain: {
   title: 'Charge',
   icon: 'fa-cross',
   text: 'Melee strikes add +10 to +15 Fervor, blocking a hit with your greatshield adds +10, and each round on Consecrated Ground adds +5. Your own frontline combat is the battery.',
  },
  hold: {
   title: 'Harmonic Stance',
   icon: 'fa-gauge-high',
   text: 'At 50+ Fervor you enter Aex\u2019s Harmonic Stance: your greatsword glows white-hot and every strike adds +1d6 sacred damage. The meter doubles as a buff window.',
  },
  spend: {
   title: 'Solar Judgment',
   icon: 'fa-bolt',
   text: 'Fervor buys holy flurries, party shields, and area judgments; at 100 you unleash Solvan Judgment — a 3 AP, 20 ft smite that shatters Passive DR and sanctifies the ground.',
  },
  risk: {
   title: 'Radiant Overload',
   icon: 'fa-exclamation-triangle',
   text: 'Storing 80+ unspent Fervor burns your own skin with radiant overload, imposing visual glare penalties until vented. Spend before the battery turns on you.',
  },
 },

 exampleTurn:
  '**Round 1:** a Starlight Cleave (+15 Fervor) and a greatshield block (+10) leave you at 25. **Round 2:** another cleave and a round on Consecrated Ground push you to 45 — then a hit you actively soak (+10) tips you to 55 and **Harmonic Stance** ignites. Every swing now carries +1d6 sacred while the meter climbs; when it crosses 80, you vent 20 into a party shield rather than let the overload burn you.',

 weaveIn: [
  {
   text: 'Fervor is the engine every path tunes differently: Solar Justiciar cashes it into durability-shattering smites, Dawn Bastion converts soaked damage into party shields, and Harmonic Inquisitor refunds reaction costs with it.',
   tab: 'specializations',
   tabLabel: 'compare the three paths',
  },
  {
   text: 'The design lives between two thresholds — 50 for Harmonic Stance and 100 for Solvan Judgment — with an 80+ danger band that punishes hoarding.',
  },
  {
   text: 'Spells and talents set the meter\u2019s exchange rate: generators, spenders, and reaction counter-attacks all price themselves in Fervor.',
   tab: 'spells',
   tabLabel: 'browse the spellbook',
  },
 ],

 quickStart: {
  title: 'Fervor at a Glance',
  headers: ['Action', 'Fervor', 'What it does'],
  rows: [
   ['Melee weapon attack', '+10 to +15', 'Kindles Fervor while dealing damage'],
   ['Block or soak a hit', '+10', 'Defense feeds the meter'],
   ['Stand on Consecrated Ground', '+5 / round', 'Holy ambient recharge'],
   ['Aegis of the Martyred Sun', '−25', 'Barrier absorbs 40 damage and retaliates for 2d8 sacred'],
   ['Harmonic Stance', '−50', 'Enter the stance: +1d6 sacred on all strikes'],
   ['Solvan Judgment', '−100', '3 AP, 20 ft catastrophic AoE smite; sanctifies the ground'],
   ['Radiant overload', '80+ held', 'You take glare penalties until the excess is vented'],
  ],
  footnote: 'Fervor banks freely between turns — only the 80+ overload band punishes hoarding.',
 },

 cardsTitle: 'The Two Thresholds',
 generationTableTitle: 'How Fervor Changes',
};
