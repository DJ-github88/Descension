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
   { icon: 'fa-water', label: 'Forms', value: 'six authored Form adoptions' },
   { icon: 'fa-shield-alt', label: 'Spend', value: '2–4 Flux to adopt a Form' },
   { icon: 'fa-heart-crack', label: 'Risk', value: 'Body Toll 0–10, not reward' },
 ],

 loop: {
  gain: {
   title: 'Flow',
   icon: 'fa-bolt',
    text: 'Authored spell costs and explicit Flux gains use the same 0–20 pool. Hit/crit/dodge/idle/rooted observers remain separate work; the tracker does not infer those results from spell prose.',
  },
  hold: {
   title: 'Stance Network',
   icon: 'fa-water',
    text: 'Flux is spendable; Body Toll is accumulated transformation strain. Positive Body Toll costs add risk rather than spending a reserve. Legacy Momentum and Flourish fields mirror these pools; Flourish is not a reward currency.',
  },
  spend: {
   title: 'Shift and Strike',
   icon: 'fa-shield-alt',
    text: 'Form adoption uses the authored Form spell price: 2–4 Flux and +1 Toll, with Fluid Apex adding +2. Abilities retain their authored costs, ALL-Flux finishers and explicit strain fields. Directed-network transitions, opening-free shifts and spec modifiers are pending.',
  },
  risk: {
   title: 'Body Toll',
   icon: 'fa-heart-crack',
    text: 'Toll marks joint-lock, identity/speech erosion, feral and control/handoff risk at 3/5/7/10. These are not passive reward tiers; penalties and control transfer still require effect resolution. Short rest recovers three Toll; long rest resets both pools.',
  },
 },

 exampleTurn:
  '**Round 1:** you open in Ataxic Flow, dodge (+1), then strike in rhythm (+1) — 2 Flux. **Round 2:** shift to Arterial Strike (−2 Flux, +1 Toll) for the precision hit (+2 Flux). **Round 3:** you hold the form rather than chain a third shift, keeping Toll at 1 while Flux rebuilds toward a 3–6 point signature ability.',

 weaveIn: [
  {
    text: 'Form-specific abilities check the active Form and use their authored Flux/strain costs. The network table is a design reference; directed transition enforcement is not implemented by these adoption controls.',
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
   footnote: 'Flux caps at 20, Body Toll at 10. Adoptions share the Form spell prices; network/opening/spec modifiers and automatic risk effects remain pending.',
 },
};
