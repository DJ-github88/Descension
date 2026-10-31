export const totemistResourceGuide = {
  version: 2,
  tagline: 'Deploy physical standing conduit pylons (max 3); build Conduit Attunement (0-10) to channel elemental storm lines and seismic shockwaves.',
  archetype: 'Conduit Matrices & Territorial Bulwark',
  vitals: [
    { icon: 'fa-monument', label: 'Attunement', value: '0-10 (Cap 10)' },
    { icon: 'fa-cubes', label: 'Conduit Slots', value: 'Max 3 Active' },
    { icon: 'fa-shield-halved', label: 'Durability', value: '3x Level + Attunement' },
    { icon: 'fa-bolt', label: 'Overcharge', value: 'Spend Attunement on bursts' }
  ],
  loop: {
    gain: {
      title: 'Ground Primal Currents',
      icon: 'fa-bolt',
      text: 'Gain +1 Conduit Attunement whenever a creature enters or begins its turn within an active conduit aura; +2 Attunement when an active conduit absorbs an attack or channels lightning; +1 Attunement on reclaiming a conduit.'
    },
    hold: {
      title: 'Maintain the Vector Grid',
      icon: 'fa-monument',
      text: 'Up to 3 conduits can remain active simultaneously. Conduits possess discrete durability and provide defensive half-cover to adjacent allies. Attunement decays by 1 point per turn if no conduits are active.'
    },
    spend: {
      title: 'Discharge Harmonic Waves',
      icon: 'fa-crosshairs',
      text: 'Spend Conduit Attunement to crack the earth along faultlines connecting pylons, electrify triangular Faraday cages, pulse healing warmth from hearthstones, or shatter conduits in emergency blasts.'
    },
    risk: {
      title: 'Conduit Vulnerability',
      icon: 'fa-triangle-exclamation',
      text: 'Conduits are physical tokens with discrete hit points. If an enemy destroys a conduit through damage, its stored attunement is lost and the slot requires 1 AP to redeploy.'
    }
  },
  exampleTurn: '**Turn 1:** Place Conduit, 1 AP (deploy hearth conduit within 20 ft). Hearth Ember, 1 AP (grant 5 temp HP to allies in 15 ft). Enemy enters aura (+1 Attunement). **Turn 2:** Place second conduit (2 active, +1 Attunement, 2 total). Faultline Strike, 2 AP, 1 Attunement; crack earth between conduits dealing 2d8 smashing. **Turn 3:** Spend remaining Attunement on Arcing Needle or Sovereign Hearth aura.',
  weaveIn: [
    { text: 'Two core grants, forty optional records, and three talent trees construct the lithic grid.', tab: 'spells', tabLabel: 'browse the spellbook' },
    { text: 'Hearthkeeper, Earthshaper, and Skybinder specialize in protection, crushing seismic lines, and lightning conduction.', tab: 'specializations', tabLabel: 'compare the three paths' },
    { text: 'Totemist is completely demarcated from Animist: Totemists build physical lithic conduits, not spirit summons.', tab: 'overview', tabLabel: 'read class overview' }
  ],
  quickStart: {
    title: 'The First Pylon',
    headers: ['Action', 'Price', 'Result'],
    rows: [
      ['Place Conduit', '1 AP', 'Deploy physical stone totem pylon within 20 ft'],
      ['Reclaim Conduit', '1 AP', 'Break down active totem; +1 Attunement, free slot'],
      ['Enemy enters pylon aura', 'Aura trigger', '+1 Conduit Attunement'],
      ['Pylon absorbs damage', 'Damage check', '+2 Conduit Attunement'],
      ['Faultline Conduit', '1 AP + 2 Attunement', '2d8 smashing + slow along inter-pylon line'],
      ['Sovereign Hearth', '1 AP + 2 Attunement', '+2 AC and DR 3/- to allies within 15 ft'],
      ['Completed long rest', 'Rest', 'Conduits deconstruct, Attunement resets to 0']
    ],
    footnote: 'Read-only display: no totem placement, attunement generation, or damage is applied automatically.'
  },
  trackerHint: 'The Conduit Attunement HUD displays 0 to 10 attunement alongside 3 active pylon socket indicators. All placement and spending are recorded manually at the tabletop.',
  extraSections: [{
    kind: 'prose',
    id: 'totemistLedger',
    title: 'The Standing Stones',
    icon: 'fa-monument',
    content: 'Track Conduit Attunement openly (0 to 10) and mark the grid positions and remaining Durability of your deployed pylons (maximum 3). Connect active pylons visually to measure aura and faultline ranges.'
  }],
  playingInPerson: {
    materials: ['3 physical stone or pillar tokens for the grid', '10 amber attunement beads or d10 die', 'A ruler to verify inter-pylon connection vectors'],
    keepSections: ['attunement', 'active pylons', 'pylon durability']
  }
};
