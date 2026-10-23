/**
 * Plaguebringer resource guide.
 *
 * Virulence is a manual tabletop meter (0-100). The shared combat engine does
 * not apply seeds, stage advances, decay, ember purges, or resource gains.
 * Players use spell text and the resource bar controls to record the result.
 */
export const plaguebringerResourceGuide = {
 version: 3,

 tagline:
  'Seed infections, cultivate stages, and harvest what grows - track every point by hand.',

 archetype: 'Manual culture meter (0-100)',

 vitals: [
  { icon: 'fa-seedling', label: 'Grow', value: 'seeds and cultivation' },
  { icon: 'fa-skull', label: 'Thresholds', value: '25 Sprouting / 50 Blooming / 75 Peak Harvest' },
  { icon: 'fa-biohazard', label: 'Spend', value: 'harvest and advanced rites' },
  { icon: 'fa-hand-paper', label: 'Authority', value: 'manual only; no automatic application' },
 ],

 loop: {
  gain: {
   title: 'Record the Spell',
   icon: 'fa-seedling',
   text: 'When a spell says it seeds, cultivates, or grants Virulence, apply its listed classResource value by hand. Gains in the authored data are 10, 15, 20, or 25 depending on the spell.',
  },
  hold: {
   title: 'Track the Thresholds',
   icon: 'fa-skull',
   text: 'Keep the meter visible. At 25 Virulence you are Sprouting, at 50 Blooming, and at 75 or more Peak Harvest. Treat the listed bonus as table guidance, not an automatic engine effect.',
  },
  spend: {
   title: 'Pay the Cost',
   icon: 'fa-biohazard',
   text: 'Spells with a Virulence cost deduct that amount when the table resolves the cast. If the cost cannot be paid, the cast is not legal and should not be recorded.',
  },
  risk: {
   title: 'No Hidden Ticks',
   icon: 'fa-hand-paper',
   text: 'The engine does not automatically decay Virulence, purge it on ember damage, spread infections, or apply stage ticks. If your table uses those hazards, adjudicate and record them manually.',
  },
 },

 exampleTurn:
  '**Round 1:** resolve Wasting Curse, mark its listed Virulence gain, and note the Seed. **Round 2:** resolve Whisper of Decay against the seeded target, mark its gain, and advance the stage only if the table confirms the condition. **Round 3:** check the meter before spending on an advanced rite; record the deduction and any table-adjudicated result. No step is applied automatically by shared combat.',

 weaveIn: [
  {
   text: 'Spell cards state their Virulence gain or cost; the resource bar records the manual result.',
   tab: 'spells',
   tabLabel: 'browse the spellbook',
  },
  {
   text: 'Virulent Spreader plays wide, Torment Weaver plays connected, Decay Harbinger plays deep.',
   tab: 'specializations',
   tabLabel: 'compare the three paths',
  },
  {
   text: 'Thresholds are guidance for the table: 25 / 50 / 75 change what your existing infections can attempt.',
  },
 ],

 quickStart: {
  title: 'Virulence at a Glance',
  headers: ['Action', 'Virulence', 'What it does'],
  rows: [
   ['Apply a seed', 'listed gain', 'Record the spell value by hand'],
   ['Cultivate a stage', 'listed gain', 'Advance only when the table confirms'],
   ['Pay a harvest or rite', 'listed cost', 'Deduct before resolving'],
   ['25 / 50 / 75+', 'Sprouting / Blooming / Peak Harvest', 'Threshold guidance'],
   ['Automatic changes', 'none', 'Shared combat applies nothing'],
  ],
  footnote:
   'Virulence runs 0-100. All seeding, spreading, decay, ember hazards, and spends are manual tabletop decisions.',
 },
};
