export const covenbaneResourceGuide = {
  version: 2,
  tagline: 'Build Hexbreaker Charges from spell disruption, parries, and null-salts; spend on anti-magic counters and executions.',
  archetype: 'Hexbreaker Anti-Magic Economy',
  vitals: [
    { icon: 'fa-crosshairs', label: 'Charges', value: '0-6 (Cap 6)' },
    { icon: 'fa-shield-halved', label: 'Parry / Dispel', value: '+2 Charges' },
    { icon: 'fa-flask', label: 'Draw Null-Salt', value: '+1 Charge' },
    { icon: 'fa-hourglass-half', label: 'Decay', value: '1 / 2 rounds out of combat' }
  ],
  loop: {
    gain: {
      title: 'Witness and Intercept Magic',
      icon: 'fa-bolt',
      text: 'Gain +1 Charge when an enemy within 30 ft casts a spell; +2 Charges when you parry a spell or dispel an active effect; +1 Charge from Draw Null-Salt or starting your turn in a null-zone.'
    },
    hold: {
      title: 'Carry Cold Bog-Iron',
      icon: 'fa-shield-halved',
      text: 'Charges remain volatile. They persist during active combat, but decay by 1 charge every 2 rounds once the field falls silent. Resets to 0 on a completed long rest.'
    },
    spend: {
      title: 'Shatter Hostile Workings',
      icon: 'fa-crosshairs',
      text: 'Spend charges on kinetic dispels, silence fields, null-zones, and execution strikes. Each ability specifies an exact charge cost.'
    },
    risk: {
      title: 'Never Exceed the Cap',
      icon: 'fa-triangle-exclamation',
      text: 'Charges are capped at 6. Any charge generated beyond 6 is lost. Charges cannot be converted to mana or generic action points.'
    }
  },
  exampleTurn: '**Turn 1:** Draw Null Salt, 1 AP; gain +1 Charge (+2 saves vs hexes). Enemy mage casts within 30 ft; gain +1 Charge (2 total). **Turn 2:** Bog-Iron Parry, 1 AP, 1 Charge; deflect incoming spell and gain +2 Charges (3 total). Hex Strike, 2 AP, 1 Charge; deal 2d8 slashing + 1d6 force and dispel a minor buff (2 Charges remain). **Turn 3:** Spend remaining charges on null-zone or high-tier execution.',
  weaveIn: [
    { text: 'Two core grants, forty optional records, and three talent trees fuel the occult hunt.', tab: 'spells', tabLabel: 'browse the spellbook' },
    { text: 'Shadowbane, Spellbreaker, and Demonhunter provide specialized anti-magic paths.', tab: 'specializations', tabLabel: 'compare the three paths' },
    { text: 'Covenbane is open to all ancestries. Bog-iron and null-salts are tools of the craft, not cultural restrictions.', tab: 'overview', tabLabel: 'read class overview' }
  ],
  quickStart: {
    title: 'The First Hunt',
    headers: ['Action', 'Price', 'Result'],
    rows: [
      ['Enemy casts within 30 ft', 'Reaction / Witness', '+1 Hexbreaker Charge'],
      ['Parry or dispel spell', 'Authored reaction/action', '+2 Hexbreaker Charges'],
      ['Draw Null Salt', '1 AP', '+1 Charge; +2 saves vs hexes'],
      ['Hex Strike', '2 AP + 1 Charge', '2d8 slashing + 1d6 force; dispels minor buff'],
      ['Null-Salts Flask', '1 AP + 2 Charges', '10 ft radius null-zone for 2 rounds'],
      ['Out of combat decay', '2 rounds of silence', '-1 Hexbreaker Charge'],
      ['Completed long rest', 'Rest', 'Charges reset to 0']
    ],
    footnote: 'Read-only display: no charge generation, dispel, ward break, damage, or condition is applied automatically.'
  },
  trackerHint: 'The Hexbreaker HUD displays 0 to 6 charges. All charge generation and spending are recorded manually at the tabletop. No automatic damage or condition application occurs.',
  extraSections: [{
    kind: 'prose',
    id: 'covenbaneLedger',
    title: 'The Cold Iron Ledger',
    icon: 'fa-crosshairs',
    content: 'Track Hexbreaker Charges openly (0 to 6). Record charge generation when hostile magic is cast, parried, or dispelled. Spend charges cleanly on countermeasures. Charges never exceed 6 and decay outside combat.'
  }],
  playingInPerson: {
    materials: ['6 cold-iron tokens or charge markers', 'A null-zone template (10-20 ft)', 'A 30 ft range indicator'],
    keepSections: ['charges', 'dispels', 'null-zone timers']
  }
};
