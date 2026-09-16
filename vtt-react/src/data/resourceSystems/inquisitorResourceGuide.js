/**
 * Inquisitor — Resource System tab v2 authored guide.
 * Copy drafted from inquisitorData.js resourceSystem (Authority 0–8, generation
 * triggers, Vow of Severance) since classResources.js has no Inquisitor entry.
 */
export const inquisitorResourceGuide = {
 version: 2,

 tagline:
  'Cold iron answers magic — build Authority by denying the supernatural, then pass sentence.',
 archetype: 'Authority Gauge (0–8)',

 vitals: [
  { icon: 'fa-gavel', label: 'Generate', value: 'counters, dispels, occult contact' },
  { icon: 'fa-lock', label: 'Cap', value: '8 Authority' },
  { icon: 'fa-cross', label: 'Spend', value: 'executions, silences, storms' },
  { icon: 'fa-exclamation-triangle', label: 'Risk', value: 'Vow of Severance' },
 ],

 loop: {
  gain: {
   title: 'Judge',
   icon: 'fa-gavel',
   text: 'Every supernatural act feeds Authority: a spell targeting you or an ally +1, a counterspell or dispel +2, striking a supernatural target +1, defeating one +2, and purging a curse +1.',
  },
  hold: {
   title: 'Keep Contact',
   icon: 'fa-lock',
   text: 'The gavel only stays heavy while the occult keeps knocking — a round with no supernatural contact bleeds −1, and mundane foes generate nothing but Righteous Zeal at half rate.',
  },
  spend: {
   title: 'Execute',
   icon: 'fa-cross',
   text: 'Spend 5–8 Authority on Execution effects, Anti-Magic Storms, or Apex Transformations; smaller spends strip buffs, silence casters, and purge conditions.',
  },
  risk: {
   title: 'Zero and Severance',
   icon: 'fa-exclamation-triangle',
   text: 'At 0 Authority you are powerless — your bound horror starts testing its chains. The Vow of Severance also blocks continuous magical enchantments and foreign buffs while your cold-iron aura is active.',
  },
 },

 exampleTurn:
  '**Round 1:** the cultist hexes your rogue (+1 Authority) and you counter the follow-up (+2) — that is 3. **Round 2:** you strike the possessed brute (+1) and purge the curse off the rogue (+1). At 5 you could already execute, but you hold at 6 and bank toward the Anti-Magic Storm when the second caster reveals himself.',

 weaveIn: [
  {
   text: 'Punitive spells are priced in Authority — 5–8 buys the executions that end encounters.',
   tab: 'spells',
   tabLabel: 'browse the spellbook',
  },
  {
   text: 'Witch Hammer hunts, Iron Verdict locks down, and Hollow Saint lets the bound thing out.',
   tab: 'specializations',
   tabLabel: 'compare the three paths',
  },
  {
   text: 'No supernatural contact, no Authority: against mundane armies you are running on fumes.',
  },
 ],

 quickStart: {
  title: 'Authority at a Glance',
  headers: ['Trigger', 'Authority', 'What it does'],
  rows: [
   ['Enemy casts at you / ally within 30 ft', '+1', 'Any target counts'],
   ['Dispel or counterspell', '+2', 'The signature gain'],
   ['Strike a supernatural target', '+1', 'Cold iron adjudicates'],
   ['Defeat a supernatural enemy', '+2', 'Sentence carried out'],
   ['Purge curse / CC from an ally', '+1', 'Pastoral duty'],
   ['Quiet round (no supernatural)', '−1', 'The gavel goes cold'],
   ['Authority 0', 'Rebellion risk', 'Your bound horror tests the chains'],
  ],
  footnote:
   'Authority caps at 8; the Vow of Severance blocks continuous enchantments and foreign buffs while the aura is active.',
 },
};
