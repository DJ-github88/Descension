/**
 * Shaper — Resource System tab v2 authored guide.
 * Canonical values from classResources.js CLASS_RESOURCE_TYPES['Shaper']
 * (Flux 0–20, Body Toll 0–10, six stances, transition costs).
 */
export const shaperResourceGuide = {
 version: 2,

 tagline:
  'Flow between six forms — but every transformation leaves Body Toll in the flesh.',
 archetype: 'Momentum + Body Toll',

 vitals: [
  { icon: 'fa-bolt', label: 'Flux', value: '0–20 combat rhythm' },
  { icon: 'fa-water', label: 'Forms', value: 'six stances, one network' },
  { icon: 'fa-shield-alt', label: 'Spend', value: '2–4 shifts · 3–6 abilities' },
  { icon: 'fa-heart-crack', label: 'Risk', value: 'Body Toll strains the frame' },
 ],

 loop: {
  gain: {
   title: 'Flow',
   icon: 'fa-bolt',
   text: 'Successful attacks add +1 Flux, critical hits +2, dodges and parries +1, and form-specific actions +2. Misses, taking damage, or idling cost −1, and being rooted drops Flux to 0.',
  },
  hold: {
   title: 'Stance Network',
   icon: 'fa-water',
   text: 'Flux (0–20) is your upkeep pool; Body Toll (0–10) is the transformation debt. Signature moves earn a Toll point, and every shift taxes the frame.',
  },
  spend: {
   title: 'Shift and Strike',
   icon: 'fa-shield-alt',
   text: 'Form transitions cost 2–4 Flux and abilities 3–6. Shaping Forms carry up to +3 Body Toll per shift, pushing toward identity collapse.',
  },
  risk: {
   title: 'Body Toll',
   icon: 'fa-heart-crack',
   text: 'Shifting stances too rapidly in one round compounds Body Toll and temporary structural fragility. The form is the weapon — the frame pays for it.',
  },
 },

 exampleTurn:
  '**Round 1:** you open in Ataxic Flow, dodge (+1), then strike in rhythm (+1) — 2 Flux. **Round 2:** shift to Arterial Strike (−2 Flux, +1 Toll) for the precision hit (+2 Flux). **Round 3:** you hold the form rather than chain a third shift, keeping Toll at 1 while Flux rebuilds toward a 3–6 point signature ability.',

 weaveIn: [
  {
   text: 'Form-specific abilities are priced 3–6 Flux; the Shaping Form Network table lists every legal transition and cost.',
   tab: 'spells',
   tabLabel: 'browse the spellbook',
  },
  {
   text: 'Flow Master, Iron Dancer, and Primal Shadow each emphasize different nodes of the stance web.',
   tab: 'specializations',
   tabLabel: 'compare the three paths',
  },
  {
   text: 'Body Toll is the limiter: at 10 the frame gives out, so plan shifts two forms ahead.',
  },
 ],

 quickStart: {
  title: 'Flux at a Glance',
  headers: ['Action', 'Flux', 'What it does'],
  rows: [
   ['Successful attack', '+1', 'Baseline rhythm'],
   ['Critical hit', '+2', 'Spike'],
   ['Dodge or parry', '+1', 'Defense flows'],
   ['Miss / take damage / idle', '−1', 'Keep moving'],
   ['Form shift', '−2 to −4, +1 Toll', 'Transformation tax'],
   ['Signature move', '−3 to −6', 'The payoff'],
   ['Rooted or immobilized', 'Flux drops to 0', 'The flow stops'],
  ],
  footnote: 'Flux caps at 20 and Body Toll at 10; the Form Network lists every legal transition.',
 },
};
