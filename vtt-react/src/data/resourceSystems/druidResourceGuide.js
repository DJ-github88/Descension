export const druidResourceGuide = {
  version: 2,
  tagline: 'Prepare three bodies, occupy two slots and pay for every change.',
  archetype: 'Finite Anatomical Loadouts',
  vitals: [
    { icon: 'fa-paw', label: 'Active slots', value: 'max 2 of 4' },
    { icon: 'fa-arrows-rotate', label: 'Transitions', value: '0-3' },
    { icon: 'fa-shield-halved', label: 'Plating', value: 'prevent 2' },
    { icon: 'fa-hourglass-half', label: 'Recovery', value: '1 trait until next turn' }
  ],
  loop: {
    gain: { title: 'Adopt a Prepared Body', icon: 'fa-paw', text: 'Name one of the three prepared loadouts and its two occupied slots. Pay 1 AP and add one unrecovered transition.' },
    hold: { title: 'Use Only That Anatomy', icon: 'fa-eye', text: 'A trait in an inactive or suspended slot grants nothing. Plating prevents 2 from the first eligible event each own-turn window; Living Brace prevents 4 once.' },
    spend: { title: 'Recover by Giving Something Up', icon: 'fa-arrows-rotate', text: 'Pay 1 AP, suspend one active unsuspended trait until your next own turn and reduce transitions by one. The suspended trait cannot satisfy a prerequisite.' },
    risk: { title: 'Three Transitions Is the Limit', icon: 'fa-triangle-exclamation', text: 'At three unrecovered transitions adoption is refused and the prior anatomy stays unchanged. A completed long rest returns the default body and clears the track; reconnect or initiative does not.' }
  },
  exampleTurn: '**Before combat:** prepare Predator, Bastion and Mimic at a completed long rest; the tracker starts uninitialized. **Turn 1:** Adopt Predator, 1 AP; record locomotion + offense and 1 transition; strike with the natural weapon. **Turn 2:** Adopt Bastion, 1 AP; record defense + senses and 2 transitions; Living Brace 1 AP prevents 4 once. **Turn 3:** Recover the Self, 1 AP; suspend vibration senses until next turn and reduce transitions to 1. Never claim a trait you gave up.',
  weaveIn: [
    { text: 'Two core grants, forty optional records and three prepared bodies keep anatomy finite.', tab: 'spells', tabLabel: 'browse the spellbook' },
    { text: 'Predator, Adaptive Bastion and Mimic each have a signature and capstone with same-tree gates.', tab: 'specializations', tabLabel: 'compare the three paths' },
    { text: 'Druid has no registered native heritage edge. Morgh, Amordjin, Arch Mimir and Broken Mimir are recommendations only; the four acquisition requirements must be recorded.' }
  ],
  quickStart: {
    title: 'The First Change',
    headers: ['Action', 'Price', 'Result'],
    rows: [
      ['Adopt Loadout', '1 AP; +1 transition', 'Two real slots are active; the prior anatomy is replaced'],
      ['Use a natural weapon', 'Authored action cost', 'Only the active offense anatomy can strike'],
      ['Layered plating', 'Own-turn window', 'Prevent 2 from the first eligible event'],
      ['Living Brace', '1 AP; active defense slot', 'Prevent 4 instead of 2 once; movement 0'],
      ['Recover the Self', '1 AP; suspend a trait', 'Transitions -1; the trait grants nothing until next turn'],
      ['Rejected adoption at 3', 'No change', 'Prior anatomy, AP and traits remain'],
      ['Completed long rest', 'Recorded recovery', 'Default body; transitions 0; suspensions cleared']
    ],
    footnote: 'Read-only display: no transformation, recovery, prevention, movement or expiry is applied automatically.'
  },
  trackerHint: 'The integrated tracker starts uninitialized. It never invents a loadout, slot, transition, suspension, brace or duration. Observers see public anatomy only.',
  extraSections: [{
    kind: 'prose', id: 'druidBodyLedger', title: 'The Body Ledger', icon: 'fa-paw',
    content: 'Record four slots, at most two active traits and a three-stitch transition track. Each adoption moves one stitch; each recovery removes one and suspends a real trait. A completed long rest returns the default body. The Druid changes anatomy, never the player character identity.'
  }],
  playingInPerson: {
    materials: ['Four slot cards', 'At most two trait chips', 'A three-stitch transition track', 'Three prepared-loadout cards'],
    keepSections: ['tracking', 'slots', 'recovery label']
  }
};
