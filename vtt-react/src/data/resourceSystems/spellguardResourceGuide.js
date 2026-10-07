/**
 * Spellguard — Resource System tab v2 authored guide.
 * Canonical values from classResources.js CLASS_RESOURCE_TYPES['Spellguard']
 * (Arcane Energy Points, absorption-only generation, decay).
 * titleOverride replaces the stale legacy "Resonance: The Spell Absorber" title.
 */
export const spellguardResourceGuide = {
 version: 2,

 titleOverride: 'Arcane Energy Points: The Spell Absorber',
 tagline:
  'Let hostile magic break against your shield — then give it back with interest.',
 archetype: 'Absorption Meter (AEP 0–100)',

 vitals: [
  { icon: 'fa-shield-alt', label: 'Generate', value: 'absorb hostile magic only' },
  { icon: 'fa-gauge-high', label: 'Battery', value: '0–100 AEP' },
  { icon: 'fa-bolt', label: 'Spend', value: 'shockwaves, reflections, shields' },
  { icon: 'fa-exclamation-triangle', label: 'Risk', value: '100 = containment breach' },
 ],

 loop: {
  gain: {
   title: 'Absorb',
   icon: 'fa-shield-alt',
    text: 'Report resolved magical intake in AEP-equivalent units: incoming = captured residual + redirected + dissipated. Containment, annulment, defusal, deflection and siphoning all retain positive residual; every receipt counts once. Actual conversion/yield rules are supplied by the resolved ability, not invented by this tracker.',
  },
  hold: {
   title: 'Containment',
   icon: 'fa-gauge-high',
    text: 'AEP is one 0–100 bank. Captured energy beyond capacity is recorded as uncontained overflow. Ordinary short rest does not refill it; long rest grounds it without erasing receipts. Automatic decay and radiation remain separate lifecycle/effect work.',
  },
  spend: {
   title: 'Discharge',
   icon: 'fa-bolt',
   text: 'Discharge stored energy as kinetic shockwaves, anti-magic fields, reflective barriers, or party shields. Purging is often the point — an empty battery cannot melt down.',
  },
  risk: {
   title: 'Meltdown',
   icon: 'fa-exclamation-triangle',
    text: 'At 100 the tracker marks a containment breach due; 91–99 is a warning band, not an already-triggered nova. Radiation, damage and the authored breach/reset consequence require resolution. Venting changes the bank, not the historical accounting of an interception.',
  },
 },

 exampleTurn:
  '**Round 1:** two spells break on your shield (+10, +15) and a hazard field ticks +10 — 35 AEP and the enemy caster is just warming up. **Round 2:** you absorb up to 70, then dump 40 into a shockwave that staggers the enemy line and 20 into a shield for the rogue, ending at 10 and well clear of the breach.',

 weaveIn: [
  {
   text: 'Reflections and purges are powered by absorbed spell energy — bait the casters you want to punish.',
   tab: 'spells',
   tabLabel: 'browse the spellbook',
  },
  {
   text: 'Silence-Scarred Bastion contains, Entropic Eraser refracts, and Leyline Devourer feeds.',
   tab: 'specializations',
   tabLabel: 'compare the three paths',
  },
  {
   text: 'Physical fragility is the tax: +50% vulnerability while charged, so vent before the bruisers close.',
  },
 ],

 quickStart: {
  title: 'AEP at a Glance',
  headers: ['Action', 'AEP', 'What it does'],
  rows: [
   ['Absorb magical damage', '+1 per damage', 'Every point counts'],
   ['Block / intercept a spell', '+10 to +30', 'Spike gain'],
   ['Stand in a hazard field', '+10 / round', 'Passive absorption'],
   ['Melee Silence Siphon', '+15 AEP', 'Close-range top-up'],
   ['Discharge shockwave or shield', 'Spend AEP', 'Vent before 100'],
   ['Out of combat decay', '−5 / minute', 'The battery drains in peacetime'],
   ['100 AEP', 'Containment breach', 'Feedback damage to everyone adjacent'],
  ],
   footnote: 'One 100-AEP pool; Silence Resonance is saturation terminology. Reports account for residual and overflow but do not cancel incoming damage or apply racial/spec yield ratios. Automatic observers, decay and risk effects remain pending.',
 },
};
