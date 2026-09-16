/**
 * Apex — Resource System tab v2 authored guide.
 * Canonical values from classResources.js CLASS_RESOURCE_TYPES['Apex']
 * (Quarry Marks, companion synergy generation, spending tiers, turn cap).
 */
export const apexResourceGuide = {
 version: 2,

 tagline:
  'Your companion makes the kill; you make the opening — Marks are the pack\'s shared heartbeat.',
 archetype: 'Mark Stacks (0–5)',

 vitals: [
  { icon: 'fa-crosshairs', label: 'Generate', value: 'companion synergy only' },
  { icon: 'fa-archive', label: 'Cap', value: '5 Marks' },
  { icon: 'fa-bolt', label: 'Spend', value: '1 / 2 / 3 / 5 tiers' },
  { icon: 'fa-exclamation-triangle', label: 'Risk', value: 'companion down = zero gain' },
 ],

 loop: {
  gain: {
   title: 'Hunt as One',
   icon: 'fa-crosshairs',
   text: 'A coordinated strike with your companion +2 Marks, the companion landing a hit +1, taking damage +1, a companion crit +2, and marking quarry +1. Solo glaive hits generate nothing.',
  },
  hold: {
   title: 'Pack Tactics',
   icon: 'fa-archive',
   text: 'Marks cap at 5 with a generation cap of +3 per turn (+4 for Beastmaster). Overflow is lost, and outside combat marks decay 1 per minute after a grace period.',
  },
  spend: {
   title: 'Mark the Prey',
   icon: 'fa-bolt',
   text: 'Spend 1 to empower the companion, 2 to extend the tactical chain, 3 for a companion special, or 5 for the ultimate.',
  },
  risk: {
   title: 'Pack Dependency',
   icon: 'fa-exclamation-triangle',
   text: 'If your bonded beast is dead you generate zero Marks until it is revived — and if it drops below 25% HP while you hold 3+, it enters Primal Outrage. The pack is the meter.',
  },
 },

 exampleTurn:
  '**Round 1:** you flank with the beast — coordinated strike +2, companion hit +1, and it takes a hit +1: 4 Marks in a single round. **Round 2:** you mark the quarry (+1, capped at 5), but the beast is at 20% HP, so you spend 3 on a companion special to end the fight before Primal Outrage triggers.',

 weaveIn: [
  {
   text: 'Companion commands cost 1 AP each — Marks are what turn those commands into lethality.',
   tab: 'spells',
   tabLabel: 'browse the spellbook',
  },
  {
   text: 'Bladestorm, Beastmaster (turn cap 4), and Shadowblade split the marks between glaive, pack, and stealth.',
   tab: 'specializations',
   tabLabel: 'compare the three paths',
  },
  {
   text: 'Solo hits generate nothing: the class literally does not work when you leave the beast at home.',
  },
 ],

 quickStart: {
  title: 'Marks at a Glance',
  headers: ['Action', 'Marks', 'What it does'],
  rows: [
   ['Coordinated strike (you + companion)', '+2', 'Best single source'],
   ['Companion lands a hit', '+1', 'Passive trickle'],
   ['Companion takes damage', '+1', 'Protect the investment'],
   ['Companion critical hit', '+2', 'Spike'],
   ['Mark Quarry ability', '+1', 'Target designation'],
   ['Solo glaive hit', '+0', 'The pack is the engine'],
   ['Per-turn generation cap', '+3 (+4 Beastmaster)', 'Overflow is lost'],
  ],
  footnote:
   'Marks cap at 5 and persist between combats; they decay 1 per minute outside combat after a grace period.',
 },
};
