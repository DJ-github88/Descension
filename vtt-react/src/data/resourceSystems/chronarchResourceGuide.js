/**
 * Chronarch — Resource System tab v2 authored guide.
 * Copy drafted from chronarchData.js resourceSystem (Shards/Strain) since
 * classResources.js has no Chronarch entry.
 */
export const chronarchResourceGuide = {
 version: 2,

 tagline:
  'Bank time as Shards, burn it to rewrite the round — but every paradox leaves Strain behind.',
 archetype: 'Dual Meter (Shards / Strain)',

 vitals: [
  { icon: 'fa-clock', label: 'Generate', value: 'cantrips + temporal anchors' },
  { icon: 'fa-archive', label: 'Bank', value: '10 Time Shards' },
  { icon: 'fa-history', label: 'Spend', value: 'AP, freezes, rewinds' },
  { icon: 'fa-exclamation-triangle', label: 'Risk', value: 'Strain 10 → backlash stun' },
 ],

 loop: {
  gain: {
   title: 'Bank Shards',
   icon: 'fa-clock',
   text: 'Basic spellwork and temporal anchors bank +1 to +2 Time Shards. Shards are stored time — the only currency that spends on Flux effects.',
  },
  hold: {
   title: 'Two Meters',
   icon: 'fa-archive',
   text: 'Shards and Strain share the same 0–10 clock face: every major timeline alteration adds +1 to +2 Strain, while a quiet turn bleeds off −1. The watch only holds so much.',
  },
  spend: {
   title: 'Rewrite the Round',
   icon: 'fa-history',
   text: 'Spend Shards to grant allies extra Action Points, freeze incoming arrows, or rewind fatal wounds. Every rewrite is a withdrawal and a debt.',
  },
  risk: {
   title: 'Temporal Backlash',
   icon: 'fa-exclamation-triangle',
   text: 'At 10 Strain, reality snaps back: an immediate timeline backlash stuns you and exhausts every banked Shard.',
  },
 },

 exampleTurn:
  '**Round 1:** you bank a Shard with a basic cast and keep Strain at 0. **Round 2:** the assassin is about to drop — you rewind the wound (+2 Strain, −2 Shards). **Round 3:** you spend your last Shard to hand the assassin an extra Action Point for the finisher. Strain sits at 2; the watch keeps ticking.',

 weaveIn: [
  {
   text: 'Flux spells both cost Shards and add Strain — each cast is a withdrawal and a debt at the same time.',
   tab: 'spells',
   tabLabel: 'browse the spellbook',
  },
  {
   text: 'Shards, Arc of Displacement, and Arc of Rewinding tune which moments you can afford to touch.',
   tab: 'specializations',
   tabLabel: 'compare the three paths',
  },
  {
   text: 'A quiet turn is a tactical resource: it is the only reliable way to shed Strain before the clock fills.',
  },
 ],

 quickStart: {
  title: 'Shards & Strain at a Glance',
  headers: ['Trigger', 'Change', 'What it means'],
  rows: [
   ['Basic spell (mana only)', '+1 Shard', 'Free bank'],
   ['Flux ability', '−Shard cost, +1 to +8 Strain', 'Every rewrite has a price'],
   ['No Flux cast this turn', '−1 Strain', 'Recovery turns matter'],
   ['Temporal Backlash', 'Reset to 0', 'At 10 Strain: stunned, bank exhausted'],
   ['Long rest', 'Reset both', 'Clean slate'],
  ],
  footnote: 'Neither meter can exceed 10 — the build is about which side of the watch you are on.',
 },
};
