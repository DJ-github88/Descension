/**
 * Minstrel — Resource System tab v2 authored guide.
 * Copy drafted from minstrelData.js resourceSystem (Notes I–VII, builders,
 * cadence resolution, performance vulnerability). No classResources entry.
 */
export const minstrelResourceGuide = {
 version: 2,

 tagline:
  'Play builder songs to collect Notes I–VII, then resolve them into a Cadence the whole party hears.',
 archetype: 'Note Collection (I–VII)',

 vitals: [
  { icon: 'fa-music', label: 'Collect', value: 'notes I–VII from builder songs' },
  { icon: 'fa-layer-group', label: 'Cap', value: '5 stacks per note' },
  { icon: 'fa-star', label: 'Resolve', value: 'cadence note sequences' },
  { icon: 'fa-exclamation-triangle', label: 'Risk', value: 'no self-healing, interruptions' },
 ],

 loop: {
  gain: {
   title: 'Play Builders',
   icon: 'fa-music',
   text: 'Builder songs each add specific notes to your staff — Tonic I, Subdominant IV, Dominant V, and the rest — up to 5 stacks per note. Notes persist and decay 1 per minute.',
  },
  hold: {
   title: 'The Staff',
   icon: 'fa-layer-group',
   text: 'You are not spending notes as you play; you are assembling an instrument panel that shows which cadences are currently playable. The HUD staff lights up when a sequence is complete.',
  },
  spend: {
   title: 'Resolve a Cadence',
   icon: 'fa-star',
   text: 'Resolving songs consume note sequences — some progressions accept multiple orderings, like I–IV–V or V–IV–I — to grant team buffs, shatter defenses, or soothe debuffs.',
  },
  risk: {
   title: 'Performance Vulnerability',
   icon: 'fa-exclamation-triangle',
   text: 'You cannot heal yourself with your own songs, and taking heavy hits can interrupt your cadence before it resolves. Instruments rewrite what your notes do — the audience matters.',
  },
 },

 exampleTurn:
  '**Round 1:** you open with a builder that adds I and V. **Round 2:** another builder drops IV — the staff now holds I–IV–V and the Cadence button lights up. You resolve Perfect Cadence to guarantee the rogue\'s crit, then start collecting for the next one while the war drum holds the line.',

 weaveIn: [
  {
   text: 'Builder and resolving songs are one system — the Chord Progressions table lists every valid sequence.',
   tab: 'spells',
   tabLabel: 'browse the spellbook',
  },
  {
   text: 'Battlechoir, Soulsinger, and Dissonance bend the same staff toward war, healing, or chaos.',
   tab: 'specializations',
   tabLabel: 'compare the three paths',
  },
  {
   text: 'Instruments (Lute, War Drum, Flute, Horn, Voice) rewrite what each note does — pick the instrument before the fight.',
  },
 ],

 quickStart: {
  title: 'The Staff at a Glance',
  headers: ['Action', 'Notes', 'What it does'],
  rows: [
   ['Builder song', '+1 to +3 notes', 'Adds specific notes (max 5 each)'],
   ['Note decay', '−1 / minute', 'Out of combat only'],
   ['Resolve cadence', 'Consumes sequence', 'Buff, shatter, or soothe'],
   ['Perfect Cadence (I→IV→V→I)', '4 notes', 'Guaranteed-crit support'],
   ['Heavy hit taken', 'Interruption risk', 'The cadence can break'],
   ['Self-heal', 'Not possible', 'Your songs only heal others'],
  ],
  footnote:
   'Seven notes I–VII with five stacks each; the HUD staff highlights playable cadences as you collect.',
 },
};
