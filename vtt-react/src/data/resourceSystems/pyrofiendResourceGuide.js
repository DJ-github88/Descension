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
   { icon: 'fa-gauge-high', label: 'Rings', value: '0: 0 · I: 1–3 · II: 4–6 · III: 7–9' },
  { icon: 'fa-fire-alt', label: 'Spend', value: 'caldera bursts, lava waves' },
   { icon: 'fa-snowflake', label: 'Risk', value: 'level 9 latches 3 own turns' },
 ],

 loop: {
  gain: {
   title: 'Burn',
   icon: 'fa-fire',
   text: 'Casting fire and magma spells adds +1 to +3 Veil levels, and each level adds flat bonus ember damage. The fire you throw is the fire building inside.',
  },
  hold: {
    title: 'The Rings',
   icon: 'fa-gauge-high',
    text: 'Ring 0 is Veil 0; Ring I is 1–3, Ring II is 4–6, and Ring III is 7–9. Reaching nine starts the Debt Call once. Reaching nine again does not restart it. Whisper, damage and drawback effects still require separate handling.',
  },
  spend: {
   title: 'Caldera',
   icon: 'fa-fire-alt',
   text: 'Spend Veil levels on caldera eruptions and lava waves — or use Cooling Ember (−2 levels) as a deliberate release valve.',
  },
  risk: {
   title: 'Oblivion',
   icon: 'fa-snowflake',
    text: 'Level nine latches a three-own-turn Debt Call. Cooling and ordinary rest cannot cancel or extend it. Record each next own turn once; at zero the terminal consequence is due. Automatic combat-turn binding, detonation damage and character-death resolution remain pending.',
  },
 },

 exampleTurn:
   '**At Veil 8:** an authored +1 ascension reaches nine and latches three own turns. Cooling Ember then lowers Veil to seven but leaves all three turns on the call. Report your next own turns: 3→2→1→0. Cooling again, resting or returning to nine never refills or clears that countdown.',

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
    text: 'Cooling Ember is a rotation piece before the call: it lowers Veil, but ordinary cooling cannot escape a Debt Call already triggered at nine.',
  },
 ],

 quickStart: {
  title: 'The Veil at a Glance',
  headers: ['Trigger', 'Veil', 'What it does'],
  rows: [
   ['Fire spell cast', '+1 to +3 levels', 'Throttle'],
   ['Infernal Surge (Lv 5+)', 'Bonus damage', 'Spend window'],
   ['Cooling Ember', '−2 levels', 'Release valve'],
    ['Short / long rest', 'Veil to 0', 'A latched call is retained; automatic out-of-combat decay is pending'],
    ['Level 9', 'Latch three own turns', 'Cooling does not cancel; repeated nine does not restart'],
    ['Next own turn', '−1 remaining', 'Report once; enemy turns do not count'],
   ['Cold / rime damage', '+50% taken, +1 Veil', 'The weakness no one forgets'],
  ],
   footnote: 'Rings: 0=0, I=1–3, II=4–6, III=7–9. The countdown persists separately from Veil; terminal damage/death effects are not applied by the tracker.',
 },
};
