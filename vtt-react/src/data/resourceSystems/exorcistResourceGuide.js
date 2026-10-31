export const exorcistResourceGuide = {
  version: 2,
  tagline: 'Maintain Purification Sanctity through sacred thresholds, ally protections, and sin-eating; spend on holy litanies and expulsions.',
  archetype: 'Purification Sanctity Economy',
  vitals: [
    { icon: 'fa-cross', label: 'Sanctity', value: '0-10 (Cap 10)' },
    { icon: 'fa-circle-dot', label: 'Inside Threshold', value: '+1 Sanctity / round' },
    { icon: 'fa-shield-halved', label: 'Ally Saves', value: '+2 Sanctity' },
    { icon: 'fa-triangle-exclamation', label: 'Depletion (0)', value: '-2 Will Saves' }
  ],
  loop: {
    gain: {
      title: 'Maintain the Sacred Boundary',
      icon: 'fa-circle-notch',
      text: 'Gain +1 Sanctity per round spent inside a consecrated salt threshold; +2 Sanctity when an ally within 25 ft succeeds on a save against fear, charm, or psychic effects; +3 Sanctity when successfully extracting an entity or cleansing a condition.'
    },
    hold: {
      title: 'Sustain the Sacred Flame',
      icon: 'fa-shield-heart',
      text: 'Sanctity remains stable during combat. Outside combat, resets to 3 Sanctity on a short rest and 5 Sanctity on a completed long rest.'
    },
    spend: {
      title: 'Cleanse and Expel',
      icon: 'fa-hands-holding-circle',
      text: 'Spend Sanctity to empower litanies of purging, absorb debuffs from allies (sin-eating), erect impassable salt perimeters, and banish unholy entities.'
    },
    risk: {
      title: 'Spiritual Exhaustion at Zero',
      icon: 'fa-triangle-exclamation',
      text: 'If Sanctity drops to 0, your spiritual shielding collapses: you suffer -2 to all Will saves against supernatural terror, possession, and psychic attacks until Sanctity is restored.'
    }
  },
  exampleTurn: '**Turn 1:** Consecrate Threshold, 1 AP; draw salt boundary (+1 Sanctity, 4 total). Allies gain +2 vs fear. Enemy fiend attempts charm; ally saves (+2 Sanctity, 6 total). **Turn 2:** Litany of Purging, 1 AP, 1 Sanctity (5 remaining); cleanse fear from front-line ally. Salt Brand, 1 AP, 1 Sanctity; deal 1d8 radiant damage to fiend (4 Sanctity remaining). **Turn 3:** Spend remaining Sanctity on high-circle ward or expulsion strike.',
  weaveIn: [
    { text: 'Two core grants, forty optional records, and three talent trees fuel the sacred ministry.', tab: 'spells', tabLabel: 'browse the spellbook' },
    { text: 'Liturgist, Sin-Eater, and Purger provide distinct paths of sanctuary, transference, and holy force.', tab: 'specializations', tabLabel: 'compare the three paths' },
    { text: 'Exorcist is open to all ancestries. Salt and scourges are tools of devotion and cleansing, not cultural restrictions.', tab: 'overview', tabLabel: 'read class overview' }
  ],
  quickStart: {
    title: 'The Sacred Rite',
    headers: ['Action', 'Price', 'Result'],
    rows: [
      ['Consecrate Threshold', '1 AP', '+1 Sanctity; +2 saves vs fear/possession for allies in 15 ft'],
      ['Litany of Purging', '1 AP + 1 Sanctity', 'Cleanse one fear, charm, or psychic condition from ally'],
      ['Ally succeeds vs fear/charm', 'Witness within 25 ft', '+2 Sanctity'],
      ['Sin-Eater Burden', '1 AP + 1 Sanctity', 'Transfer condition from ally to self; gain +2 Sanctity'],
      ['Salt Brand', '1 AP + 1 Sanctity', '1d8 radiant damage; target takes +2 holy damage for 1 round'],
      ['Salt Perimeter', '2 AP + 2 Sanctity', 'Impassable 20 ft salt line; fiends cannot cross without DC 16 save'],
      ['Short Rest / Long Rest', 'Rest', 'Resets to 3 (short) or 5 (long) Sanctity']
    ],
    footnote: 'Read-only display: no sanctity generation, condition transfer, dispel, damage, or status clearing is applied automatically.'
  },
  trackerHint: 'The Exorcist HUD displays 0 to 10 Sanctity. All sanctity generation, spending, and condition transfers are recorded manually at the tabletop. No automatic damage or condition application occurs.',
  extraSections: [{
    kind: 'prose',
    id: 'exorcistLedger',
    title: 'The Rite of Sanctity',
    icon: 'fa-cross',
    content: 'Track Purification Sanctity openly (0 to 10). Record Sanctity gained from consecrated thresholds and ally saving throws. Spend Sanctity on litanies and expulsions. Never allow Sanctity to drop to 0 during demonic encounters.'
  }],
  rules: {
    charges: 'Purification Sanctity scales from 0 to 10 (Cap 10). Starts at 3; restores to 3 on short rest, 5 on long rest.',
    economy: 'Built through consecrated ground and ally mental saves. Expended to cleanse conditions and expel entities.'
  }
};
