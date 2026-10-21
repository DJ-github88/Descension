export const gamblerResourceGuide = {
  version: 2,
  tagline: 'Put an actual card and a real stake on the table before the result.',
  archetype: 'Finite Hand & Committed Wager',
  vitals: [
    { icon: 'fa-layer-group', label: 'Cards', value: '20 actual · hand max 5' },
    { icon: 'fa-coins', label: 'Bank', value: 'Fortune + escrow ≤7' },
    { icon: 'fa-lock', label: 'Wager', value: 'one unresolved parent' },
    { icon: 'fa-hand-paper', label: 'Mode', value: 'manual tabletop only' }
  ],
  loop: {
    gain: { title: 'Real Wins, Explicit Rest', icon: 'fa-bed', text: 'Completed long rest alone resets Fortune to 3 and shuffles/deals five of the actual twenty cards. Ordinary wagers return twice stake on 2d6 ≥8; overflow is discarded. Initiative, reconnect and short rest never reset state.' },
    hold: { title: 'Preserve the Hand', icon: 'fa-layer-group', text: 'Every card belongs to deck, hand, discard or pending-wager exactly once. Own-turn start draws up to two into empty sockets only if the deck has cards. Holding a pair or five-card pattern costs opportunity, not a second bank.' },
    spend: { title: 'Commit Before the Result', icon: 'fa-lock', text: 'Reserve exact cards and Fortune before rolling. One unresolved parent blocks a new wager and Recut. Underwrite’s ally original single-d8 face 5–8 returns twice stake and adds two raw damage; expiry/cancellation loses stake. House Compact is one parent with exactly two fixed legs, never two general slots.' },
    risk: { title: 'A Loss Is a Loss', icon: 'fa-exclamation-triangle', text: 'No post-commitment refund, foreign reroll, HP-to-Fortune loop or bankruptcy damage. Recut costs 1 AP: discard 0–2 actual cards, shuffle discard only when deck empty, draw up to two empty sockets. Recover one Fortune only when starting broke and actually discarding a card.' }
  },
  exampleTurn: '**Turn 1:** From Fortune3, stake2 on Wager Strike (2 AP, one actual card); a recorded 9 returns4, leaving Fortune5 and no escrow. **Turn 2:** Spend an actual matching pair for Marked Pair (1 AP, ward4), or retain it. **Turn 3:** Recut (1 AP), discard two actual cards and draw into at most two empty sockets; Fortune stays5. No signature from an unlearned tree or native mechanical edge is borrowed.',
  weaveIn: [
    { text: 'Forty optional choices, two core records and six talent actives; prices and both wager branches remain visible.', tab: 'spells', tabLabel: 'browse the spellbook' },
    { text: 'High Roller stakes a bank, Card Sharp preserves real patterns, Odds Broker commits to ally events.', tab: 'specializations', tabLabel: 'compare the three paths' },
    { text: 'Merryn and Alchemite native trained traditions require the four documented acquisition requirements. Mechanical heritage benefits remain pending.' }
  ],
  quickStart: {
    title: 'The First Stake', headers: ['Action', 'Price', 'Result'], rows: [
      ['Wager Strike', '2 AP +1 card +1–2 Fortune escrow', '8+ returns twice stake; loss keeps base damage, no return'],
      ['Recut', '1 AP, discard 0–2', 'Paid bounded draw; conditional broke recovery only'],
      ['Marked Pair', '1 AP + exact pair; learned signature', 'Ward4 once until next own-turn start'],
      ['Underwrite', '1 AP +1 card +1–2 Fortune escrow; learned signature', 'Original d8 face5–8 pays twice stake and +2 raw'],
      ['Completed long rest', 'Explicit settled event', 'Fortune3, hand5, deck15; never reconnect'],
      ['House Compact', '2 AP +2 cards +2 Fortune; learned capstone', 'One parent, two fixed one-stake legs, +4 raw per winning leg']
    ], footnote: 'Read-only display: no card, resource, AP, HP, movement or settlement is automatically applied.'
  },
  trackerHint: 'The integrated tracker starts uninitialized. It never invents a deck, hand, result or refill. Observer projections contain counts only, not private cards, order, target choices or pending results.',
  tableMeta: { activePricingTable: { title: 'All 48 Active Prices', defaultOpen: false } },
  playingInPerson: { materials: ['Twenty cards: C/D/H/S, ranks1–5', 'Four zone spaces and a separate Fortune/escrow tally', 'Two d6 and damage dice', 'A retained action/rest record'], keepSections: ['tracking', 'rest label'] }
};
