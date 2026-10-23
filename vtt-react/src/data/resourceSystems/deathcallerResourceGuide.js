export const deathcallerResourceGuide = {
  version: 2,
  tagline: 'Every retainer is prepared before it is called, and every order is counted.',
  archetype: 'Bounded Prepared Muster',
  vitals: [
    { icon: 'fa-scroll', label: 'Prepared', value: 'max 3 patterns' },
    { icon: 'fa-users', label: 'Manifested', value: 'max 2 active' },
    { icon: 'fa-bullhorn', label: 'Orders', value: '2 per own turn' },
    { icon: 'fa-heart-pulse', label: 'Vitality', value: '0-10 per pattern' }
  ],
  loop: {
    gain: { title: 'Prepare the Pattern', icon: 'fa-scroll', text: 'Before a manifestation exists, record one of up to three named patterns. Preparation is a manual table record and does not create a creature.' },
    hold: { title: 'Respect Capacity', icon: 'fa-users', text: 'At most two manifestations may be active at once. Each keeps its own pattern vitality from 0-10 and its exact position and condition.' },
    spend: { title: 'Issue a Bounded Order', icon: 'fa-bullhorn', text: 'Spend no more than two orders on your own turn. A manifestation may take one actor action per caster own turn; it never receives a free turn or hidden action.' },
    risk: { title: 'Exhaustion Is Recorded', icon: 'fa-hourglass-half', text: 'Exhausted patterns recover only at a completed rest or through an authored effect. No reconnect, initiative or class-change refill, and no automatic summon, movement, healing or expiry.' }
  },
  exampleTurn: '**Before combat:** record up to three prepared patterns and their exact templates. **Turn 1:** manifest one pattern in a legal space and issue one order; mark the order. **Turn 2:** issue a second order to the same or another manifestation, never exceeding two orders total. At the end of the turn, record vitality and condition by hand; nothing is applied automatically.',
  weaveIn: [
    { text: 'Two core grants and forty optional records keep preparation, manifestation and orders finite and public.', tab: 'spells', tabLabel: 'browse the spellbook' },
    { text: 'Grave Marshal, Soul Shepherd and Ossuary Architect each have a signature and capstone with tree gates.', tab: 'specializations', tabLabel: 'compare the three paths' },
    { text: 'Deathcaller has no registered native heritage edge. Clean Vreken and Velun Neth are recommendations only; the four acquisition requirements must be recorded.' }
  ],
  quickStart: {
    title: 'The First Muster',
    headers: ['Action', 'Price', 'Result'],
    rows: [
      ['Prepare a pattern', 'Record one of three slots', 'A named pattern and exact template exist on paper'],
      ['Manifest a pattern', 'Use one prepared pattern', 'At most two active manifestations'],
      ['Issue an order', '1 of 2 orders this own turn', 'One bounded actor action; no extra turn'],
      ['Pattern takes vitality damage', 'Record 0-10', 'No automatic healing or expiry'],
      ['Completed rest or authored effect', 'Recorded recovery', 'An exhausted pattern may return; nothing refills on reconnect'],
      ['Class change or initiative', 'No recovery', 'The manual record stays exactly as written']
    ],
    footnote: 'Read-only display: no pattern, manifestation, order, vitality, movement or recovery is applied automatically.'
  },
  trackerHint: 'The integrated tracker starts uninitialized. It never invents a prepared pattern, active manifestation, order, vitality value or rest recovery. Observer projections contain counts only.',
  extraSections: [{
    kind: 'prose', id: 'deathcallerMusterLedger', title: 'The Muster Ledger', icon: 'fa-scroll',
    content: 'Record each prepared pattern once, then each active manifestation with its source pattern, exact position, vitality and current order. Three prepared patterns and two active manifestations are hard caps. Two orders per own turn and one actor action per manifestation per caster own turn are also hard caps. A manifestation never acts without an order, and nothing is created, moved, healed or expired automatically.'
  }],
  playingInPerson: {
    materials: ['Three prepared-pattern cards', 'Two manifestation markers', 'A two-order turn tracker', 'A pattern-vitality record from 0-10'],
    keepSections: ['tracking', 'orders', 'recovery label']
  }
};
