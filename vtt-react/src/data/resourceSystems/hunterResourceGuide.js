export const hunterResourceGuide = {
  version: 2,
  tagline: 'One quarry, three distinct openings and a real companion.',
  archetype: 'Finite Quarry Evidence',
  vitals: [
    { icon: 'fa-crosshairs', label: 'Quarry', value: 'max 1 exact' },
    { icon: 'fa-eye', label: 'Evidence', value: 'Read / Angle / Pressure' },
    { icon: 'fa-bolt', label: 'Generation', value: '1 new tag per own turn' },
    { icon: 'fa-paw', label: 'Companion', value: 'optional, one action' }
  ],
  loop: {
    gain: { title: 'Mark the Quarry', icon: 'fa-crosshairs', text: 'Name one exact quarry within 60 ft. If the own-turn budget is unused, Mark grants Read. Changing quarry clears all old evidence.' },
    hold: { title: 'Collect Distinct Openings', icon: 'fa-eye', text: 'Take an Angle after 10 ft of legal movement; Press the Quarry and record Pressure only on an accepted non-miss hit. At most one new tag per own turn.' },
    spend: { title: 'Cash the Opening', icon: 'fa-bolt', text: 'Spend exactly the tags listed by the tactic. Read + Angle powers Patient Ambush; Read + Pressure plus a companion action powers Cross the Scent; Angle + Pressure commits Returning Path.' },
    risk: { title: 'Do Not Farm the Miss', icon: 'fa-triangle-exclamation', text: 'A miss pays AP but grants nothing. Duplicate tags do nothing. Evidence expires after two own turns without contact, and changing quarry destroys all of it.' }
  },
  exampleTurn: '**Turn 1:** Mark Quarry, 1 AP; record Read. Press the Quarry, 2 AP; because Read already used the own-turn budget, an accepted hit grants no Pressure. **Turn 2:** Take an Angle, 1 AP and 10 ft; record Angle. Patient Ambush, 2 AP; consume Read + Angle for 2d8 slicing. **Turn 3:** Press, 2 AP; accepted hit now grants Pressure. Keep it or change quarry deliberately. No companion is required.',
  weaveIn: [
    { text: 'Three core grants, forty optional records and one new tag per own turn keep the opening finite.', tab: 'spells', tabLabel: 'browse the spellbook' },
    { text: 'Stalker, Beastmaster and Trailblade each have a signature and capstone with same-tree gates.', tab: 'specializations', tabLabel: 'compare the three paths' },
    { text: 'Hunter has no registered native heritage edge. The field and Quiet methods are recommendations only; the four acquisition requirements must be recorded.' }
  ],
  quickStart: {
    title: 'The First Quarry',
    headers: ['Action', 'Price', 'Result'],
    rows: [
      ['Mark Quarry', '1 AP', 'One exact quarry; Read if the budget is unused'],
      ['Take an Angle', '1 AP + 10 ft movement', 'Angle if the budget is unused'],
      ['Press the Quarry', '2 AP', '1d8+2 stabbing; Pressure only on an accepted non-miss hit'],
      ['Patient Ambush', '2 AP + Read + Angle', 'One 2d8 slicing strike; no new tags'],
      ['Cross the Scent', '2 AP + Read + Pressure + companion action', 'Companion strikes for 1d8 primal'],
      ['Returning Path', '2 AP + Angle + Pressure', 'A named glaive triggers once on the quarry crossing'],
      ['Two own turns without contact', 'No action', 'All evidence expires; quarry remains'],
      ['Changing quarry', '1 AP', 'All old evidence is destroyed']
    ],
    footnote: 'Read-only display: no quarry, evidence, tag, companion action, path or damage is applied automatically.'
  },
  trackerHint: 'The integrated tracker starts uninitialized. It never invents a quarry, evidence tag, source event, companion or committed path. Observers see public counts only.',
  extraSections: [{
    kind: 'prose', id: 'hunterQuarryLedger', title: 'The Quarry Ledger', icon: 'fa-crosshairs',
    content: 'Write the exact quarry once. Read, Angle and Pressure are distinct tags with real source events. Only one new tag is generated per own turn. Spend a tag exactly once, renew contact explicitly, and clear all evidence when the quarry changes or two own turns pass without contact.'
  }],
  playingInPerson: {
    materials: ['One quarry card', 'Three differently shaped evidence tokens', 'A companion card if Beastmaster', 'One route marker for Returning Path'],
    keepSections: ['tracking', 'evidence', 'companion label']
  }
};
