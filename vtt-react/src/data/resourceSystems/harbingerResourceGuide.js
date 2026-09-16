/**
 * Harbinger — Resource System tab v2 authored guide.
 * Copy drafted from harbingerData.js resourceSystem (Mayhem zones, generation
 * by spell level, Wild Surge at 100). No classResources entry.
 */
export const harbingerResourceGuide = {
 version: 2,

 tagline:
  'Every spell you cast raises the pressure — ride the redline, but vent before the gauge bursts.',
 archetype: 'Pressure Meter (0–100)',

 vitals: [
  { icon: 'fa-bolt', label: 'Generate', value: 'spell level = throttle' },
  { icon: 'fa-gauge-high', label: 'Zones', value: 'Safe · Escalating · Volatile · Maximum' },
  { icon: 'fa-bomb', label: 'Spend', value: 'detonate prophecies early' },
  { icon: 'fa-exclamation-triangle', label: 'Risk', value: '100 → Wild Surge' },
 ],

 loop: {
  gain: {
   title: 'Pressure',
   icon: 'fa-bolt',
   text: 'Spell level sets the heat: +2 Mayhem for level 1, +4 for 2–3, +6 for 4–6, +8 for 7–9, +10 for level 10, plus +1 to +6 from prophecy ticks and detonations.',
  },
  hold: {
   title: 'The Zones',
   icon: 'fa-gauge-high',
   text: 'Four zones tune your power: Safe (0–40), Escalating (41–60), Volatile (61–80), and Maximum (81–99). Higher zones widen prophecy ranges and damage multipliers.',
  },
  spend: {
   title: 'Detonate',
   icon: 'fa-bomb',
   text: 'Detonate active prophecies before their countdown ends for burst damage — misfires bypass all Durability, DR, and resistances.',
  },
  risk: {
   title: 'The Gauge Bursts',
   icon: 'fa-exclamation-triangle',
   text: 'At 100 Mayhem the valve ruptures: a d100 Wild Surge and Anomalous Dissociation, then reset to 0. While active prophecies exist, you cannot receive healing.',
  },
 },

 exampleTurn:
  '**Round 1:** a level 3 curse puts you at 4 and a Prophecy lands on the enemy captain. **Round 2:** two delayed ticks (+2) and a level 6 blast (+6) take you into Volatile — the captain\'s countdown is now one round. **Round 3:** you detonate early (+3 Mayhem) for lethal damage and stay well under the redline while the team cleans up.',

 weaveIn: [
  {
   text: 'Spell level is literally the throttle — the higher the cast, the faster the gauge climbs.',
   tab: 'spells',
   tabLabel: 'browse the spellbook',
  },
  {
   text: 'Mayhem, Death\'s Seer, and Fate Rift read the same pressure toward different catastrophe.',
   tab: 'specializations',
   tabLabel: 'compare the three paths',
  },
  {
   text: 'The 81–99 band is the class fantasy — just remember healing is locked out while prophecies tick.',
  },
 ],

 quickStart: {
  title: 'Mayhem at a Glance',
  headers: ['Trigger', 'Mayhem', 'What it does'],
  rows: [
   ['Level 1 spell', '+2', 'Throttle'],
   ['Level 2–3 spell', '+4', 'Mid heat'],
   ['Level 4–6 spell', '+6', 'Fast climb'],
   ['Level 7–9 spell', '+8', 'Redline approach'],
   ['Level 10 spell', '+10', 'Maximum heat'],
   ['Delayed prophecy tick / detonation', '+1 / +3 to +6', 'Banked doom'],
   ['Mayhem 100', 'Wild Surge', 'd100 surge, dissociation, reset to 0'],
  ],
  footnote: 'Four zones: Safe 0–40, Escalating 41–60, Volatile 61–80, Maximum 81–99.',
 },
};
