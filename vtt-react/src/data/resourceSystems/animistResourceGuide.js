/**
 * Animist — Resource System tab v2 authored guide.
 * Canonical values from classResources.js CLASS_RESOURCE_TYPES['Animist']
 * (Resonance 0–20, Spirit Erosion stages).
 */
export const animistResourceGuide = {
 version: 2,

 tagline:
  'Totems, runes, and curses ring the ancestral courts — just never let Resonance reach the Triple Toll.',
 archetype: 'Resonance Meter (0–20)',

 vitals: [
  { icon: 'fa-seedling', label: 'Generate', value: 'totems, curses, runes, stillness' },
  { icon: 'fa-tree', label: 'Sweet Spot', value: '10–14 Apex Harmonic' },
  { icon: 'fa-bolt', label: 'Spend', value: 'invoke, detonate, empower' },
  { icon: 'fa-exclamation-triangle', label: 'Risk', value: '15+ Spirit Erosion' },
 ],

 loop: {
  gain: {
   title: 'Channel the Spirits',
   icon: 'fa-seedling',
   text: 'Summoning or upgrading a totem adds +3 Resonance, carving a rune or cursing a foe +1 to +2, and simply holding your ground +1 per round. You are always charging something.',
  },
  hold: {
   title: 'Climb the Stages',
   icon: 'fa-tree',
   text: 'Resonance climbs through Dormant (0–4), Harmonized (5–9), and Apex Harmonic (10–14) — each stage sharpens your totems, runes, and curses.',
  },
  spend: {
   title: 'Invoke and Detonate',
   icon: 'fa-bolt',
   text: 'Detonating runic kill-boxes, invoking spirits (5–10), or firing a runic network (3–8) vents Resonance back down. The spirits reward cycles, not hoarding.',
  },
  risk: {
   title: 'Spirit Erosion',
   icon: 'fa-exclamation-triangle',
   text: 'At 15+ the Triple Toll activates: no party healing, forced movement shatters networks, and the spirits take their cut each turn until you vent.',
  },
 },

 exampleTurn:
  '**Round 1:** you plant a bone totem (+3) and your team holds the line beside it (+1). **Round 2:** a curse (+1) and a rune (+1) push you into Apex Harmonic at 10 — every node now runs at peak. **Round 3:** you detonate the kill-box (spend 8) to end the encounter before Erosion starts billing you.',

 weaveIn: [
  {
   text: 'Builder curses and totem summons are your generators; detonations and spirit invocations are your vents.',
   tab: 'spells',
   tabLabel: 'browse the spellbook',
  },
  {
   text: 'Thornwarden cages with bone, Spirit Binder calls the dead, and Stormscribe heals through storm totems.',
   tab: 'specializations',
   tabLabel: 'compare the three paths',
  },
  {
   text: 'The 10–14 band is the real resource — play the stage, not the number.',
  },
 ],

 quickStart: {
  title: 'Resonance at a Glance',
  headers: ['Action', 'Resonance', 'What it does'],
  rows: [
   ['Summon / upgrade totem', '+3', 'Main generator'],
   ['Cast builder curse', '+1', 'Cheap charge'],
   ['Carve rune (Lv 1–2 / Lv 3+)', '+1 / +2', 'Slower but persistent'],
   ['Hold position (turn start)', '+1', 'Stillness is a ritual'],
   ['Invoke spirit', '−5 to −10', 'Big spirit play'],
   ['Detonate kill-box / network', '−3 to −8', 'Vent before Erosion'],
   ['Reaching 15+', 'Spirit Erosion', 'Triple Toll until vented'],
  ],
  footnote:
   'Resonance caps at 20. Apex Harmonic (10–14) is the sweet spot; 15+ starts costing you.',
 },
};
