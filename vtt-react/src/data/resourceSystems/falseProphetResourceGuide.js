/**
 * False Prophet — Resource System tab v2 authored guide.
 * Copy drafted from falseProphetData.js resourceSystem (Madness 0–20,
 * builders, vents, convulsion at 20). No classResources entry.
 */
export const falseProphetResourceGuide = {
 version: 2,

 tagline:
  'The choir grows louder with every wound — surf Madness to 19, but never let it reach 20.',
 archetype: 'Escalating Madness (0–20)',

 vitals: [
  { icon: 'fa-eye', label: 'Generate', value: 'preaching and shared suffering' },
  { icon: 'fa-gauge-high', label: 'Band', value: '15–19 damage window' },
  { icon: 'fa-skull', label: 'Payoff', value: '+1 damage per Madness' },
  { icon: 'fa-exclamation-triangle', label: 'Risk', value: '20 = convulsions' },
 ],

 loop: {
  gain: {
   title: 'Preach',
   icon: 'fa-eye',
   text: 'Builder sermons and curses add +1 to +2 Madness, Stitch of Suffering +2, and higher-tier builders roll +1d4 to +1d8. Your damage scales with every point.',
  },
  hold: {
   title: 'Surf the Band',
   icon: 'fa-gauge-high',
   text: 'You are weakest at the start and a monster at the end: hover in the 15–19 band where each point adds +1 damage per spell, then vent with Siphon Sanity (−1d6) or Dark Meditation (−2d6).',
  },
  spend: {
   title: 'Unleash',
   icon: 'fa-skull',
   text: 'Spend on ultimates and empowered curses — at 19 Madness your spells carry +19 damage before dice.',
  },
  risk: {
   title: 'Convulsion',
   icon: 'fa-exclamation-triangle',
   text: 'Reaching 20 triggers violent mental convulsions (a save or check depending on the table). Staying isolated beyond 30 ft from allies or enemies also raises your mana costs.',
  },
 },

 exampleTurn:
  '**Round 1:** a Stitch of Suffering (+2) and a profane bolt (+1d6) open you at 6. **Round 3:** the band sits at 17 — your bolts already add +17 damage — but the boss survives. You spend Dark Meditation (−2d6) back to 9 rather than gamble on 20, and let the next sermon rebuild in two rounds.',

 weaveIn: [
  {
   text: 'Every spell\'s output is your current Madness, so the meter is both resource and damage stat.',
   tab: 'spells',
   tabLabel: 'browse the spellbook',
  },
  {
   text: 'Silence-Speaker, Deceiver, and Cultist push the choir toward different sermons.',
   tab: 'specializations',
   tabLabel: 'compare the three paths',
  },
  {
   text: 'The band matters: 15–19 is the damage window, 20 is the cliff.',
  },
 ],

 quickStart: {
  title: 'Madness at a Glance',
  headers: ['Trigger', 'Madness', 'What it does'],
  rows: [
   ['Stitch of Suffering', '+1', 'Cheap builder'],
   ['Sermon of the Silence', '+1d4', 'Rolling builder'],
   ['Profane Bolt', '+1d6', 'Damage + growth'],
   ['Preacher\'s Grasp', '+1d8', 'Top-tier builder'],
   ['Siphon Sanity', '−1d6', 'Controlled vent'],
   ['Dark Meditation', '−2d6', 'Deep vent'],
   ['Madness 19 / 20', '+19 damage / Convulsion', 'The window and the cliff'],
  ],
  footnote:
   'Madness caps at 20; isolation beyond 30 ft from the choir increases your mana costs.',
 },
};
