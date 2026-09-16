/**
 * Arcanoneer — Resource System tab v2 authored guide.
 *
 * The layout copy lives here so the structure (Essentials / Deep Dive / Reference)
 * and the beginner-facing explanation can be reviewed and rewritten independently
 * of the large legacy `resourceSystem` payload in arcanoneerData.js.
 *
 * Canonical references used while writing this copy:
 * - classResources.js CLASS_RESOURCE_TYPES['Arcanoneer'] (8 spheres, bank cap 12, 4d8)
 * - SphereComboFinder (firing profiles, formulation damage, Wyrd naming)
 */
export const arcanoneerResourceGuide = {
 version: 2,

 tagline:
  'Roll raw elements every turn, bank what you cannot use, and weave them into 36 battlefield formulations.',
 archetype: 'Rolling Dice Pool',

 vitals: [
  { icon: 'fa-dice-d20', label: 'Generate', value: '4d8 every turn' },
  { icon: 'fa-archive', label: 'Bank', value: 'up to 12 spheres' },
  { icon: 'fa-atom', label: 'Spend', value: '36 formulations + recipes' },
  { icon: 'fa-exclamation-triangle', label: 'Risk', value: 'Backlash pins movement' },
 ],

 loop: {
  gain: {
   title: 'Generate',
   icon: 'fa-dice-d20',
   text: 'At the start of each turn, roll 4d8. Every die becomes one Elemental Sphere in your hand — there is no fixed list to pick from, so what you roll decides what you can cast.',
  },
  hold: {
   title: 'Bank',
   icon: 'fa-archive',
   text: 'Unspent spheres stay banked between turns, up to 12. A turn spent banking is not wasted — it is the setup for a 3- or 4-sphere recipe.',
  },
  spend: {
   title: 'Weave',
   icon: 'fa-atom',
   text: 'Choose a firing profile (Attack, Defend, Buff, Area, or Trap) and combine spheres into a formulation. Learned recipes upgrade a combination into its true spell — but every cast also costs mana.',
  },
  risk: {
   title: 'Backlash',
   icon: 'fa-exclamation-triangle',
   text: 'Hostile formulations pin your movement to 0 for the turn and cost 1d4–1d6 recoil HP; Defend is backlash-free. Wyrd combinations can fizzle, ricochet, or explode — power with a price.',
  },
 },

 exampleTurn:
  '**Turn 1:** you roll Ember, Ember, Rime, Primal. No recipe matches yet, so you bank all four. **Turn 2:** you roll Ember and Rime — your bank now holds three Ember, two Rime, and a Primal. You cast **Steam** (Ember + Rime) as a 20 ft cone that catches both archers, and keep the rest banked toward a 3-sphere recipe.',

 weaveIn: [
  {
   text: 'Spheres are literally your spell list: every Arcanoneer spell is an exact sphere formula, so banking is choosing your next cast.',
   tab: 'spells',
   tabLabel: 'browse the spellbook',
  },
  {
   text: 'Each specialization rewrites the pool — Prism Mage rerolls spheres for 1 mana and boosts pure pairs, Entropy Weaver rolls 5d8 and doubles Wyrd, Sphere Architect banks 15 and discounts 3-sphere recipes.',
   tab: 'specializations',
   tabLabel: 'compare the three paths',
  },
  {
   text: 'Recipes are the long game: a two-sphere formulation is a cantrip, while learned recipes add cones, damage-over-time, grafts, and battlefield shaping at higher levels.',
  },
 ],

 quickStart: {
  title: 'Your First Turn',
  headers: ['Action', 'Spheres', 'Mana'],
  rows: [
   ['Attack formulation', '2', '5'],
   ['Defend formulation', '2', '6'],
   ['Buff formulation', '2', '4'],
   ['Area formulation', '2', '7'],
   ['Trap formulation', '2', '6'],
   ['Fling (desperation attack)', '1', '2'],
   ['Siphon (recover mana)', '1', '+2 mana'],
   ['Weave Reset (reroll the pool)', '0', '3 + 1d4 HP'],
  ],
  footnote:
   'Base formulations cost 1 Action Point. Bank cap is 12 spheres, and all spheres are lost when combat ends.',
 },

 /** Authored sections injected into Deep Dive in this order. */
 extraSections: [
  {
   kind: 'callout',
   id: 'baseFormulations',
   tone: 'info',
   icon: 'fa-book-open',
   title: 'Base Formulations vs Recipes',
   content:
    'Any two spheres produce a **base formulation**: 1d6 + INT/4, single-round effects, usable with every firing profile. A learned **recipe** replaces that formula with a real spell — bigger dice, cones, lingering effects, grafts, and control. The base matrix is always available, even on a bad roll; recipes are where your level budget goes.',
  },
 ],

 excludeLegacy: ['baseVsRecipes', 'strategicConsiderations'],

 sectionOverrides: {
  practicalExample: {
   title: 'Practical Decision-Making Example',
   content: `**Scenario**: You are fighting a fire elemental (resistant to Ember, weak to Rime) and two goblin archers.

**Turn 1 roll**: Ember, Ember, Rime, Primal.

**The rookie mistake**: "Ember + Ember — biggest damage I can roll!" The elemental resists the type, and your base formulation only deals 1d6 + INT/4 into that resistance.

**The smart play**: "Rime + Primal — **Rime-Frozen Graft** on our tank for +3 Durability, then bank the two Embers for the goblins." The tank gets a protective graft, and your Embers wait for a target that fears them.

**Turn 2 roll**: Arcane, Blight, Primal, Wyrd. **Bank**: Ember, Ember.

**Decision point** — six spheres available, three good lines:
- **Option A**: Ember + Ember at the goblins. Cheap (5 mana), reliable, spends the bank.
- **Option B**: bank everything and aim for a 3-sphere recipe next turn.
- **Option C**: Arcane + Blight **Silence Bolt** on the elemental — bypasses its resistance entirely.

**The right call**: Option A now (the archers are the immediate threat), then Option C if you still have the AP and mana — two formulations, one turn.

**The lesson**: Do not cast the biggest thing you can. Cast the right thing for the target — exploit weaknesses, spend what the moment needs, and bank the rest.`,
  },
  chaosEffectsTable: {
   title: 'Wyrd Effects Table (d20)',
   subtitle:
    'The default resolution for wyrd combinations. If a specific wyrd formulation has its own table (marked ★ in the Combination Matrix), use that instead; otherwise roll here.',
   headers: ['d20', 'Effect'],
   rows: [
    ['1', 'Fizzle — the formulation fails. Spheres are spent and nothing happens.'],
    ['2-3', 'Minor Backlash — you take 1d4 wyrd damage. The formulation still resolves.'],
    ['4-5', 'Redirect — it strikes a random target within range (ally or enemy).'],
    ['6-7', 'Elemental Surge — +1d4 damage of a random sphere type.'],
    ['8-9', 'Lingering — any minor effect lasts 1 extra round.'],
    ['10-11', 'Normal — resolves exactly as written.'],
    ['12-13', 'Double Effect — the minor effect triggers twice.'],
    ['14-15', 'Mana Feedback — recover 1d4 mana after resolving.'],
    ['16-17', 'Bouncing — Attack bounces to 1 extra target for half; Area gains +5 ft radius.'],
    ['18-19', 'Empowered — damage dice explode (reroll max-value dice and add them).'],
    ['20', 'Wyrd Perfection — choose any effect from this table.'],
   ],
  },
 },

 playingInPerson: {
  materials: [
   '4d8 dice',
   'Colored tokens or glass beads — one color per sphere',
   'The d8 → sphere chart (below)',
   'The Combination Matrix finder (above) for all 36 formulations',
  ],
  generateChart: true,
  generateColors: true,
  keepSections: ['Turn-by-Turn Process', 'Budget-Friendly Alternatives', 'Pro Tip for Physical Play'],
 },
};
