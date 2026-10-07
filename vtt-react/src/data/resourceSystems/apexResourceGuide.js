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
    text: 'Report resolved outcomes in the Pack Codex: both hunter and companion hit the same quarry +2, companion hit or damage taken +1, companion critical hit +2, or a pack quarry designation +1. Solo glaive hits and casting alone grant nothing. Each receipt counts once.',
  },
  hold: {
   title: 'Pack Tactics',
   icon: 'fa-archive',
    text: 'Marks cap at 5; generation caps at +3 per own-turn window (+4 for Beastmaster). Spending does not refund this budget and overflow is lost. Begin the next own turn in the Codex; automatic turn detection and out-of-combat decay remain pending.',
  },
  spend: {
   title: 'Mark the Prey',
   icon: 'fa-bolt',
   text: 'Spend 1 to empower the companion, 2 to extend the tactical chain, 3 for a companion special, or 5 for the ultimate.',
  },
  risk: {
   title: 'Pack Dependency',
   icon: 'fa-exclamation-triangle',
    text: 'An unavailable companion grants no Marks. Link its canvas token to read live vitality, or report companion availability when tracking manually; the old HUD HP cache is not authoritative. Primal Outrage, Bond Sickness and passive effects still require separate handling.',
  },
 },

 exampleTurn:
   '**Own turn 1 (standard cap 3):** both hit the same quarry for +2; a distinct companion hit adds +1. Further generation is lost, even after you spend Marks. **Own turn 2:** advance the Codex window; a companion critical adds +2, bringing an unspent bank to five. Enemy turns and round boundaries do not refill the current window.',

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
    'Marks cap at 5. The Codex tracks reported outcomes and manual own-turn windows; automatic outcome/turn detection, decay, and passive effects are pending. Talons and stepper buttons are manual corrections, not generation events.',
 },
};
