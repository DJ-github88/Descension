export const oracleResourceGuide = {
  version: 2,
  tagline: 'Two prepared possibilities, exact terms and no debt.',
  archetype: 'Finite Prepared Forecasts',
  vitals: [
    { icon: 'fa-eye', label: 'Forecasts', value: 'max 2 prepared' },
    { icon: 'fa-clock', label: 'Expiry', value: '1-2 own turns' },
    { icon: 'fa-list-check', label: 'Category', value: 'one closed category' },
    { icon: 'fa-ban', label: 'Debt', value: 'none' }
  ],
  loop: {
    gain: { title: 'Commit a Forecast', icon: 'fa-eye', text: 'Name one exact subject, one event category from the closed list, one published benefit and a one-or-two own-turn expiry. It occupies one of two slots.' },
    hold: { title: 'Publish the Terms', icon: 'fa-scroll', text: 'The table can see the subject, category, benefit and expiry. A forecast never reveals hidden plans, private intentions or unrolled outcomes.' },
    spend: { title: 'Apply the Benefit Once', icon: 'fa-check', text: 'When the named category occurs, apply the published benefit once and mark the forecast fulfilled. A failed or expired forecast grants nothing.' },
    risk: { title: 'No Debt, No Dice', icon: 'fa-ban', text: 'Oracle has no Omen Debt and never replaces, rerolls or banks a die. A third prepared forecast is rejected without changing the existing two slots.' }
  },
  exampleTurn: '**Before combat:** record no forecast yet; the tracker starts uninitialized. **Turn 1:** Commit a Forecast naming one ally and attack-roll events for a one-own-turn expiry, 1 AP. **Turn 2:** The table confirms the named attack; apply the published 5-point reduction once, mark fulfilled and free the slot. **Turn 3:** Commit a route forecast or a personal preparation. Never invent an event, a benefit or an expiry.',
  weaveIn: [
    { text: 'Two core grants and forty optional records keep forecasts exact, public and finite.', tab: 'spells', tabLabel: 'browse the spellbook' },
    { text: 'Seer, Witness of Peril and Pathfinder each have a signature and capstone with same-tree gates.', tab: 'specializations', tabLabel: 'compare the three paths' },
    { text: 'Oracle has no registered native heritage edge. Lumian and Ordu are recommendations only; the four acquisition requirements must be recorded.' }
  ],
  quickStart: {
    title: 'The First Forecast',
    headers: ['Action', 'Price', 'Result'],
    rows: [
      ['Commit a Forecast', '1 AP; occupy 1 of 2 slots', 'A public subject, category, benefit and expiry exist'],
      ['Named event occurs', 'Close the record', 'Apply the published benefit once; free the slot'],
      ['Named event fails', 'Close the record', 'No benefit; free the slot'],
      ['Expiry reached', 'Close the record', 'No benefit; free the slot'],
      ['Release the Forecast', '1 AP; free the slot', 'No benefit and no reversal of an accepted event'],
      ['Completed long rest', 'No automatic refill', 'Prepared forecasts still expire by their own terms'],
      ['Reconnect or initiative', 'No change', 'No benefit, expiry or slot change']
    ],
    footnote: 'Read-only display: no forecast, slot, benefit, expiry, damage, ward, movement or hidden information is applied automatically.'
  },
  trackerHint: 'The integrated tracker starts uninitialized. It never invents a forecast, subject, category, benefit or expiry. Observer projections show public counts and published terms only.',
  extraSections: [{
    kind: 'prose', id: 'oracleForecastLedger', title: 'The Forecast Ledger', icon: 'fa-eye',
    content: 'Record each forecast once, with its exact subject, closed event category, published benefit and one-or-two own-turn expiry. Two prepared forecasts are the hard cap. On fulfillment, apply the benefit once and free the slot; on failure or expiry, grant nothing and free the slot. Oracle has no debt track, no die replacement and no hidden information.'
  }],
  playingInPerson: {
    materials: ['Two forecast cards', 'An own-turn expiry marker', 'A public benefit note', 'No debt tokens'],
    keepSections: ['tracking', 'expiry', 'information boundary']
  }
};
