/**
 * Pyrofiend — Resource System tab v2 authored guide.
 * Copy drafted from pyrofiendData.js resourceSystem (Veil levels 0–9, zones,
 * level 9 death clock). No classResources entry.
 */
export const pyrofiendResourceGuide = {
 version: 2,

 tagline:
  'Every fire spell stokes the Veil a level higher — at level 9, the Sovereign comes to collect.',
 archetype: 'Escalating Levels (0–9)',

 vitals: [
  { icon: 'fa-fire', label: 'Ascend', value: '+1 to +3 Veil per fire cast' },
  { icon: 'fa-gauge-high', label: 'Zones', value: 'Safe 0–3 · Power 4–6 · Danger 7–9' },
  { icon: 'fa-fire-alt', label: 'Spend', value: 'caldera bursts, lava waves' },
  { icon: 'fa-snowflake', label: 'Risk', value: 'level 9 = 3-turn death clock' },
 ],

 loop: {
  gain: {
   title: 'Burn',
   icon: 'fa-fire',
   text: 'Casting fire and magma spells adds +1 to +3 Veil levels, and each level adds flat bonus ember damage. The fire you throw is the fire building inside.',
  },
  hold: {
   title: 'The Zones',
   icon: 'fa-gauge-high',
   text: 'Levels 0–3 are the Safe Zone, 4–6 the Power Zone, 7–9 the Danger Zone. Levels 5–8 trigger Scathrach\'s whisper checks; higher levels amplify damage and drawbacks together.',
  },
  spend: {
   title: 'Caldera',
   icon: 'fa-fire-alt',
   text: 'Spend Veil levels on caldera eruptions and lava waves — or use Cooling Ember (−2 levels) as a deliberate release valve.',
  },
  risk: {
   title: 'Oblivion',
   icon: 'fa-snowflake',
   text: 'Level 9 is a 3-turn permanent death clock — descend, win, or be consumed in ash. Cold vulnerability rises with the Veil, and rime effects can force a level upward.',
  },
 },

 exampleTurn:
  '**Round 1:** a fireball (+2) puts you in the Power Zone. **Round 2:** another cast (+3) reaches 5 — the whispers start, and your ember damage is already climbing. **Round 3:** at 7 you hold one round in the Danger Zone for the doubled output, then Cooling Ember down to 5 rather than let a rime hit shove you toward 9.',

 weaveIn: [
  {
   text: 'Fire spells are both the throttle and the payload — non-fire tools exist purely to manage the Veil.',
   tab: 'spells',
   tabLabel: 'browse the spellbook',
  },
  {
   text: 'Inferno, Wildfire, and The Apostate\'s Path ride the zones at different risk appetites.',
   tab: 'specializations',
   tabLabel: 'compare the three paths',
  },
  {
   text: 'Cooling Ember is a rotation piece, not a retreat — descending is how you survive to level 8 again.',
  },
 ],

 quickStart: {
  title: 'The Veil at a Glance',
  headers: ['Trigger', 'Veil', 'What it does'],
  rows: [
   ['Fire spell cast', '+1 to +3 levels', 'Throttle'],
   ['Infernal Surge (Lv 5+)', 'Bonus damage', 'Spend window'],
   ['Cooling Ember', '−2 levels', 'Release valve'],
   ['Rest / out of combat', '−1 per minute', 'Cooldown; short rest resets to 0'],
   ['Level 9', '3-turn death clock', 'Descend or be consumed'],
   ['Cold / rime damage', '+50% taken, +1 Veil', 'The weakness no one forgets'],
  ],
  footnote: 'Zones: Safe 0–3, Power 4–6, Danger 7–9; level 9 is surrender to Scathrach.',
 },
};
