export const inscriptorResourceGuide = {
  version: 2,
  tagline: 'Carve enduring runes onto grid surfaces and equipment; build Runic Resonance (0-10) to power lattice detonations and protective zones.',
  archetype: 'Runic Inscription & Zone Architecture',
  vitals: [
    { icon: 'fa-scroll', label: 'Resonance', value: '0-10 (Cap 10)' },
    { icon: 'fa-cube', label: 'Active Runes', value: 'Max 5 (Base)' },
    { icon: 'fa-pen-nib', label: 'Etch Glyph', value: '+1 Resonance' },
    { icon: 'fa-burst', label: 'Discharge', value: 'Remote 40 ft detonation' }
  ],
  loop: {
    gain: {
      title: 'Carve the Living Syntax',
      icon: 'fa-pen-nib',
      text: 'Gain +1 Runic Resonance whenever you etch a rune onto a tile or piece of equipment with your bone stylus; +1 Resonance when an enemy triggers a ground rune trap; +1 Resonance when resting within an active ward.'
    },
    hold: {
      title: 'Sustain the Runic Lattice',
      icon: 'fa-shield-halved',
      text: 'Active runes persist for 1 hour or until discharged/dispelled. You can sustain up to 5 active runes on the field at a time. Resonance persists throughout active combat and resets to 0 upon a long rest.'
    },
    spend: {
      title: 'Discharge the Inscribed Power',
      icon: 'fa-bolt',
      text: 'Spend Runic Resonance on detonating active rune matrices, raising stone monoliths, linking allies in protective lattices, and triggering gravitational pulls.'
    },
    risk: {
      title: 'Resonance Saturation',
      icon: 'fa-triangle-exclamation',
      text: 'Resonance cannot exceed 10. Runes etched while at maximum active capacity require deconstructing an older rune or paying additional AP.'
    }
  },
  exampleTurn: '**Turn 1:** Etch Glyph, 1 AP (place concussive sigil on floor; gain +1 Resonance). Inscribe Focus, 1 AP (gain +1 Resonance, 2 total). **Turn 2:** Enemy steps on tile, triggering sigil (2d6 force damage, +1 Resonance, 3 total). Spend 1 Resonance on Detonating Matrix, 2 AP (blast 2 runes for 2d6 each). **Turn 3:** Spend remaining Resonance on Sigil Matrix or Runic Fortification for party protection.',
  weaveIn: [
    { text: 'Two core grants, forty optional records, and three talent trees anchor tactical battlefield calligraphy.', tab: 'spells', tabLabel: 'browse the spellbook' },
    { text: 'Runebinder, Enchanter, and Glyphweaver offer distinct paths of terrain, armor, and spell syntax.', tab: 'specializations', tabLabel: 'compare the three paths' },
    { text: 'Inscriptor is open to all scholars and runecrafters without ancestry constraints.', tab: 'overview', tabLabel: 'read class overview' }
  ],
  quickStart: {
    title: 'The First Inscription',
    headers: ['Action', 'Price', 'Result'],
    rows: [
      ['Etch Glyph', '1 AP', 'Carve persistent rune on tile; +1 Resonance'],
      ['Discharge Rune', '1 AP', 'Detonate active rune within 40 ft for 1d8 + Int force'],
      ['Enemy triggers rune trap', 'Trigger condition', 'Target takes trap effect; +1 Resonance'],
      ['Warding Script', '1 AP', 'Inscribe ally armor; +2 AC for 3 rounds'],
      ['Sigil Matrix', '1 AP + 2 Resonance', 'Link 2 ground sigils; 2d6 damage + slow to passers'],
      ['Completed long rest', 'Rest', 'Resonance resets to 0']
    ],
    footnote: 'Read-only display: no rune placement, resonance generation, triggering, or damage is applied automatically.'
  },
  trackerHint: 'The Runic Resonance HUD displays 0 to 10 lithic resonance nodes. All rune placement, active counts, and spending are recorded manually at the tabletop.',
  extraSections: [{
    kind: 'prose',
    id: 'inscriptorLedger',
    title: 'The Lithic Slate',
    icon: 'fa-scroll',
    content: 'Track Runic Resonance openly (0 to 10) and note the grid coordinates of your active runes (maximum 5). Mark each rune type (concussive, snare, ward, stasis). Spend Resonance cleanly on detonations and lattice effects.'
  }],
  playingInPerson: {
    materials: ['5 rune tokens or markers for the grid', '10 blue resonance beads or d10 die', 'A dry-erase grid pen for rune locations'],
    keepSections: ['resonance', 'active rune tiles', 'equipment enchantments']
  }
};
