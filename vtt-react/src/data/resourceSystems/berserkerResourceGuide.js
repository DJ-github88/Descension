/**
 * Berserker — Resource System tab v2 authored guide.
 * Canonical values from classResources.js CLASS_RESOURCE_TYPES['Berserker']
 * (Rage 0–100, six states, overheat at 101).
 */
export const berserkerResourceGuide = {
 version: 2,

 tagline:
  'Every hit you land and every hit you take stokes the kettle — get out before it explodes.',
 archetype: 'Heat Meter (0–100+)',

 vitals: [
  { icon: 'fa-fire', label: 'Generate', value: 'strikes, damage taken, kills' },
  { icon: 'fa-gauge-high', label: 'States', value: '6 bands, Smoldering → Apocalypse' },
  { icon: 'fa-fire-alt', label: 'Payoff', value: '+attack, +damage, cleave' },
  { icon: 'fa-exclamation-triangle', label: 'Risk', value: 'no ally healing above 20' },
 ],

 loop: {
  gain: {
   title: 'Stoke',
   icon: 'fa-fire',
   text: 'Melee abilities add +1d6 Rage, taking damage +1d4, critical hits +2d6, and kills +1d8. You gain fastest while being hit — which is the trap and the plan.',
  },
  hold: {
   title: 'Ride the States',
   icon: 'fa-gauge-high',
   text: 'Rage climbs through Smoldering, Frenzied, Primal, Carnage, Cataclysm, and beyond. Every band adds attack, damage, or cleave — and every band strips defense.',
  },
  spend: {
   title: 'Unleash',
   icon: 'fa-fire-alt',
   text: 'Abilities cost 5–100 Rage; higher states hit harder but recoil into your own flesh. Below 30% HP your executes bypass physical resistances.',
  },
  risk: {
   title: 'Overheat',
   icon: 'fa-exclamation-triangle',
   text: 'Above 20 Rage allies cannot heal you with spells or potions. Cross 101 and Metabolic Burnout deals 2d6 unresistable and resets you to 0 — vent every round or lose the kettle.',
  },
 },

 exampleTurn:
  '**Round 1:** a strike (+1d6) and a goblin arrow (+1d4) put you at 8. **Round 2:** a critical (+2d6) rockets you into Frenzied — fear immunity and +5 ft movement. The cleric reaches for you and cannot; you spend 30 on a cleave that kills two goblins (+1d8) and end the round at 21 with the kettle still rising.',

 weaveIn: [
  {
   text: 'Every ability is priced in Rage, and the expensive ones are designed for the Carnage and Cataclysm bands.',
   tab: 'spells',
   tabLabel: 'browse the spellbook',
  },
  {
   text: 'Savage, The Caldera-Forged, and The Unbound Blood-Chanter each ride a different band of the kettle.',
   tab: 'specializations',
   tabLabel: 'compare the three paths',
  },
  {
   text: 'Battle-Trance at 21 is a one-way door: no outside healing until you drop back below it.',
  },
 ],

 quickStart: {
  title: 'Rage at a Glance',
  headers: ['Action', 'Rage', 'What it does'],
  rows: [
   ['Cast melee ability', '+1d6', 'Baseline generator'],
   ['Take damage', '+1d4', 'Pain is fuel'],
   ['Critical hit', '+2d6', 'Spike'],
   ['Kill an enemy', '+1d8', 'Fight momentum'],
   ['Idle round (no attacks)', '−10', 'The kettle cools'],
   ['Rage 21+', 'Battle-Trance', 'Fear immunity, no ally healing'],
   ['Rage 101+', 'Metabolic Burnout', '2d6 unresistable, reset to 0'],
  ],
  footnote:
   'States run Smoldering → Frenzied → Primal → Carnage → Cataclysm → Obliteration; overdrive masteries push past 100 at your own risk.',
 },
};
