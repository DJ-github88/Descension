/**
 * Lunarch — Resource System tab v2 authored guide.
 * Copy drafted from lunarchData.js resourceSystem + classResources.js
 * CLASS_RESOURCE_TYPES['Lunarch'] (phase cycle, 3-round duration, 8 mana shift).
 */
export const lunarchResourceGuide = {
 version: 2,

 tagline:
  'The moon turns regardless — align your biggest spells with the phase, or pay the transition toll.',
 archetype: 'Rotating Phase Dial',

 vitals: [
  { icon: 'fa-moon', label: 'Cycle', value: 'New → Waxing → Full → Waning' },
  { icon: 'fa-redo', label: 'Duration', value: '3 rounds per phase' },
  { icon: 'fa-star', label: 'Shift', value: '8 mana to move early' },
  { icon: 'fa-exclamation-triangle', label: 'Risk', value: 'Transition Shock each shift' },
 ],

 loop: {
  gain: {
   title: 'Ride the Clock',
   icon: 'fa-moon',
   text: 'The dial advances automatically every 3 combat rounds — the resource generates whether or not you act, and phase-aligned spells earn bonus momentum.',
  },
  hold: {
   title: 'Plan the Alignment',
   icon: 'fa-redo',
   text: 'Each phase rewrites your body: New Moon grants +3 DR and charm/fear immunity; Waxing adds +1d6 damage and speed; Full adds +2d8 sacred; Waning cuts mana costs and adds vampirism.',
  },
  spend: {
   title: 'Phase-Aligned Casting',
   icon: 'fa-star',
   text: 'Spend phases on alignment: your biggest spells hit twice as hard in the right phase, and Waning\'s vampiric drain is your only reliable self-heal.',
  },
  risk: {
   title: 'Transition Shock',
   icon: 'fa-exclamation-triangle',
   text: 'Every shift — natural or manual — strains the starlight seams: Transition Shock can disorient you, and Full Moon\'s Delirium can force a roll against attacking an ally.',
  },
 },

 exampleTurn:
  'The fight opens in New Moon (+3 DR, safe). **Round 3:** the dial turns to Waxing (+1d6, no healing) — you reposition the tank and bank damage for a round. **Round 6:** Full Moon lands; you spend 15 mana on Total Eclipse and dump +2d8 sacred into the boss, accepting the Delirium roll and the max-HP bleed for the kill window.',

 weaveIn: [
  {
   text: 'Phase-aligned spells are your fine control — 8 mana shifts the dial early when a target reveals itself.',
   tab: 'spells',
   tabLabel: 'browse the spellbook',
  },
  {
   text: 'Hollow Sentinel, Silence-Speaker, and Sanguine Warden each prioritize a different phase of the clock.',
   tab: 'specializations',
   tabLabel: 'compare the three paths',
  },
  {
   text: 'Manual shifts cost 8 mana + 1d8+2 blight — budget the transition or wait for the natural tick.',
  },
 ],

 quickStart: {
  title: 'The Moon at a Glance',
  headers: ['Trigger', 'Cost', 'What it does'],
  rows: [
   ['Natural cycle', 'Free', 'Advances every 3 rounds, automatically'],
   ['Manual phase shift', '8 mana + 1d8+2 blight', 'Move the moon yourself'],
   ['Total Eclipse (Lv 6)', '15 mana + 3d6 blight', 'Capstone shift'],
   ['Any phase shift', 'Transition Shock', 'd6 table check on the flesh'],
   ['Full Moon', '+2d8 sacred, Delirium risk', 'The nuke window'],
   ['Waning Moon', '25% vampirism', 'Only reliable self-heal'],
  ],
  footnote: 'Four phases rotate New → Waxing → Full → Waning, three rounds each.',
 },
};
