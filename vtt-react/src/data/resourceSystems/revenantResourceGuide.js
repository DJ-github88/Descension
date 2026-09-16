/**
 * Revenant — Resource System tab v2 authored guide.
 * Copy drafted from revenantData.js resourceSystem (Toll, Death Shroud,
 * phylactery, Death Marks). No classResources entry.
 */
export const revenantResourceGuide = {
 version: 2,

 tagline:
  'You never had mana — you have a phylactery, a shroud, and your own blood.',
 archetype: 'Health as Currency',

 vitals: [
  { icon: 'fa-heart', label: 'Pay', value: '1 HP = 1 Toll' },
  { icon: 'fa-archive', label: 'Toll', value: '0–20, decays 1 / round' },
  { icon: 'fa-tint', label: 'Shroud', value: '+1d6 damage, HP casting' },
  { icon: 'fa-skull', label: 'Death', value: 'phylactery revival nova' },
 ],

 loop: {
  gain: {
   title: 'Bleed for Power',
   icon: 'fa-heart',
   text: 'Each point of HP spent to cast becomes 1 Toll, kills add +1d6, and casting in Death Shroud adds +1 per spell — while Toll decays 1 every round.',
  },
  hold: {
   title: 'Toll Economy',
   icon: 'fa-archive',
   text: 'You have no mana. HP is the wallet, the phylactery (0–50) is the safety net, and Death Shroud toggles between sustainable and explosive casting.',
  },
  spend: {
   title: 'Empower the Dark',
   icon: 'fa-tint',
   text: 'Spend Toll to add +1d6 blight per point to any spell. At 16+ Toll your magic is apocalyptic — but a death there takes the party with you.',
  },
  risk: {
   title: 'The Descent',
   icon: 'fa-skull',
   text: 'There is no overheat — there is the Sequential Descent through five permanent Death Marks. At 0 HP your charged phylactery triggers a resurrection stasis nova: nearby foes freeze while you reform.',
  },
 },

 exampleTurn:
  '**Round 1:** you pay 4 HP for a blight bolt (4 Toll) and the kill adds +1d6. **Round 2:** shroud on — the next spell adds +1 Toll and +1d6 damage, taking you to 12. **Round 3:** you push to 16 for the apocalyptic rider and drop the boss, then let decay pull you back toward safety before the party\'s healer sees your HP bar.',

 weaveIn: [
  {
   text: 'Every spell is dual-priced in HP and Toll; Death Shroud changes the exchange rate.',
   tab: 'spells',
   tabLabel: 'browse the spellbook',
  },
  {
   text: 'Toll, Frost Sovereign, and Phylactery Anchor split between drain, freeze, and resurrection.',
   tab: 'specializations',
   tabLabel: 'compare the three paths',
  },
  {
   text: 'The phylactery is your real health bar — charge it with kills and treat 0 HP as a rotation, not a failure.',
  },
 ],

 quickStart: {
  title: 'Toll at a Glance',
  headers: ['Trigger', 'Toll', 'What it does'],
  rows: [
   ['Spend HP to cast', '+1 per HP', 'The wallet opens'],
   ['Kill an enemy', '+1d6', 'Combat feeds the toll'],
   ['Cast in Death Shroud', '+1 per spell', 'Toggle for burst windows'],
   ['Spend Toll on a spell', '+1d6 blight per Toll', 'Apocalyptic at 16+'],
   ['Toll decay', '−1 / round', 'Self-cleaning meter'],
   ['Fill the phylactery', '+1d6 HP per kill (max 50)', 'Life insurance'],
   ['Hit 0 HP', 'Stasis nova + revive', 'Frozen foes, you reform'],
  ],
  footnote:
   'Toll runs 0–20 and decays 1 per round; the phylactery stores up to 50 HP of resurrection.',
 },
};
