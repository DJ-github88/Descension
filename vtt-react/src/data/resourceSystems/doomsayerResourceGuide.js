export const doomsayerResourceGuide = {
  version: 2,
  tagline: 'Declare the ending once, publish its terms and collect only what actually arrives.',
  archetype: 'Finite Public Calamities',
  vitals: [
    { icon: 'fa-hourglass-half', label: 'Calamities', value: 'max 2 active' },
    { icon: 'fa-skull', label: 'Havoc', value: '0-15' },
    { icon: 'fa-clock', label: 'Clock', value: '1-3 own turns' },
    { icon: 'fa-scroll', label: 'Disruption', value: 'public method' }
  ],
  loop: {
    gain: { title: 'Plant a Public Calamity', icon: 'fa-scroll', text: 'Name the exact subject or visible area, the trigger, the one-to-three own-turn clock, the published effect and the visible disruption method. It occupies one of two slots.' },
    hold: { title: 'Keep the Terms Visible', icon: 'fa-eye', text: 'Never hide the clock or the effect. A calamity advances only through an authored paid action or an explicitly recorded table event; no initiative, reconnect, rest or scene change advances it.' },
    spend: { title: 'Resolve Exactly Once', icon: 'fa-hourglass-half', text: 'A trigger resolution grants 3 Havoc, expiry grants 1 and a dismantle grants 0. Close the record and free its slot after the table records the outcome.' },
    risk: { title: 'Havoc Is Finite', icon: 'fa-fire', text: 'Havoc runs 0-15 and resets only on a completed long rest. Overflow is lost. A third active declaration is rejected without altering the existing two records.' }
  },
  exampleTurn: '**Before combat:** record no calamity yet; the tracker starts uninitialized. **Turn 1:** Plant the Calamity on one visible enemy, 1 AP; write the trigger, two-own-turn clock, effect and disruption method. **Turn 2:** The table confirms the trigger and resolves the published effect once; gain 3 Havoc, close the record and free the slot. **Turn 3:** Plant a new calamity or spend Havoc on an authored finisher. Never invent a tick, a resolution or a Havoc gain.',
  weaveIn: [
    { text: 'Two core grants and forty optional records keep declarations public, clocked and finite.', tab: 'spells', tabLabel: 'browse the spellbook' },
    { text: 'Requiem, Endbringer and Forewarner each have a signature and capstone with same-tree gates.', tab: 'specializations', tabLabel: 'compare the three paths' },
    { text: 'Doomsayer has no registered native heritage edge. Skald, Anhur and Tessic are recommendations only; the four acquisition requirements must be recorded.' }
  ],
  quickStart: {
    title: 'The First Calamity',
    headers: ['Action', 'Price', 'Result'],
    rows: [
      ['Plant the Calamity', '1 AP; occupy 1 of 2 slots', 'A public subject, trigger, clock, effect and disruption method exist'],
      ['Advance a clock', 'Authored paid action or recorded event', 'The clock moves one step; no automatic timer'],
      ['Resolve by trigger', 'Close the record', 'Published effect once; +3 Havoc'],
      ['Resolve at expiry', 'Close the record', 'Published effect once; +1 Havoc'],
      ['Dismantle the Sign', '1 AP; free the slot', 'No Havoc and no reversal of an accepted consequence'],
      ['Completed long rest', 'Recorded recovery', 'Havoc resets to 0; active records still follow their authored terms'],
      ['Reconnect or initiative', 'No change', 'No clock advance, refill or resolution']
    ],
    footnote: 'Read-only display: no calamity, clock, Havoc, damage, ward, movement or expiry is applied automatically.'
  },
  trackerHint: 'The integrated tracker starts uninitialized. It never invents a calamity, a trigger, a clock, a Havoc value or a resolution. Observer projections show public counts and published terms only.',
  extraSections: [{
    kind: 'prose', id: 'doomsayerCalamityLedger', title: 'The Calamity Ledger', icon: 'fa-scroll',
    content: 'Record each calamity once, then its exact trigger and one-to-three own-turn clock. Two active records are the hard cap. A trigger resolution grants 3 Havoc, expiry grants 1, and dismantle grants 0. Havoc runs 0-15 and resets only on a completed long rest. A public declaration never becomes a hidden clock, and no record is reopened after it closes.'
  }],
  playingInPerson: {
    materials: ['Two calamity cards', 'A fifteen-token Havoc bowl', 'One own-turn clock marker', 'A public disruption note'],
    keepSections: ['tracking', 'clock', 'recovery label']
  }
};
