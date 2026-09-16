/**
 * Toxicologist — Resource System tab v2 authored guide.
 * Canonical values from classResources.js CLASS_RESOURCE_TYPES['Toxicologist'].
 */
export const toxicologistResourceGuide = {
 version: 2,

 tagline:
  'Brew the arsenal before the fight — once the belt runs dry, you pay in blood.',
 archetype: 'Prepared Inventory',

 vitals: [
  { icon: 'fa-flask', label: 'Vials', value: 'INT mod + 3 (min 4)' },
  { icon: 'fa-archive', label: 'Parts', value: 'up to 5' },
  { icon: 'fa-skull', label: 'Spend', value: 'poisons, concoctions, traps' },
  { icon: 'fa-exclamation-triangle', label: 'Risk', value: 'running dry mid-fight' },
 ],

 loop: {
  gain: {
   title: 'Brew',
   icon: 'fa-flask',
   text: 'You prepare Vials during rests (1d4 on a short rest, all on a long rest) and can scavenge +2 during combat by bleeding reagents from the field. Contraption Parts refill 1 per short rest.',
  },
  hold: {
   title: 'The Belt',
   icon: 'fa-archive',
   text: 'The belt is a fixed arsenal: Vials up to INT mod + 3 (minimum 4), Contraption Parts up to 5. What you brought is what you have — prep is the class.',
  },
  spend: {
   title: 'Coat and Deploy',
   icon: 'fa-skull',
   text: 'Coat weapons with multi-stage neurotoxins (1–2 vials), throw concoctions (2–3), or deploy contraptions (1–2 parts each). Explosive Concoction is the 3-vial opener.',
  },
  risk: {
   title: 'Dry Belt',
   icon: 'fa-exclamation-triangle',
   text: 'When the belt runs dry mid-combat you can synthesize emergency toxins on the spot — by taking physical self-damage. Running out is a combat action, not just a mood.',
  },
 },

 exampleTurn:
  'Before the doors open you brew to full (INT 16 → 5 vials, 5 parts) and prep a paralytic coat. **Round 1:** Explosive Concoction (3 vials) plus a spring mine (1 part) blunts the charge. **Round 2:** you coat the rogue\'s blade (1 vial), scavenge +2 from the fight, and keep one part in reserve for a smoke escape.',

 weaveIn: [
  {
   text: 'Vial recipes and weapon coatings are all priced in belt charges — read the Recipe table before you commit the belt.',
   tab: 'spells',
   tabLabel: 'browse the spellbook',
  },
  {
   text: 'Venomancer, Gadgeteer, and Saboteur divide the same belt between toxins, tools, and mayhem.',
   tab: 'specializations',
   tabLabel: 'compare the three paths',
  },
  {
   text: 'Rest timing is tactical: a short rest mid-dungeon is worth 1d4 vials and a part.',
  },
 ],

 quickStart: {
  title: 'The Belt at a Glance',
  headers: ['Action', 'Cost / Gain', 'What it does'],
  rows: [
   ['Long rest', 'Full belt', 'All vials and parts restored'],
   ['Short rest', '+1d4 vials, +1 part', 'Mid-dungeon resupply'],
   ['Scavenge in combat', '+2 vials', 'Bleed reagents from the fight'],
   ['Weapon coating', '1–2 vials', 'Multi-stage neurotoxin'],
   ['Explosive Concoction', '3 vials', 'Signature opener'],
   ['Contraption', '1–2 parts', 'Traps, dispensers, launchers'],
   ['Belt empty', 'Self-damage', 'Emergency synthesis has a price'],
  ],
  footnote: 'Vials cap at INT mod + 3 (min 4); Contraption Parts cap at 5.',
 },
};
