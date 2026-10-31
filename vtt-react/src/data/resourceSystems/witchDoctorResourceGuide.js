export const witchDoctorResourceGuide = {
  version: 2,
  tagline: 'Render Bog Tallow (0-100%) in peat cauldrons; sculpt sympathetic wax effigies and brew suffocating miasmas to wither hostile forces.',
  archetype: 'Bog Tallow & Sympathetic Effigy Binding',
  vitals: [
    { icon: 'fa-skull', label: 'Bog Tallow', value: '0-100% (Starts at 50%)' },
    { icon: 'fa-bone', label: 'Bone Needles', value: 'Pierce effigies at range' },
    { icon: 'fa-fire-burner', label: 'Crucible Render', value: '+20% Tallow / 1 AP' },
    { icon: 'fa-smog', label: 'Miasma Vapors', value: 'Choking area denial' }
  ],
  loop: {
    gain: {
      title: 'Harvest Mire Tallow',
      icon: 'fa-fire-burner',
      text: 'Recover +20% Bog Tallow with Render Tallow (1 AP); harvest +10% Tallow whenever an enemy afflicted by your hexes or curses suffers damage; recover +15% Tallow on killing a hexed foe.'
    },
    hold: {
      title: 'Store Wax in Peat Crucibles',
      icon: 'fa-flask',
      text: 'Bog Tallow starts at 50% capacity at the beginning of an encounter. It does not decay naturally during combat, but represents the physical volume of rendering wax available for poppets and cauldrons.'
    },
    spend: {
      title: 'Sculpt Sympathetic Effigies',
      icon: 'fa-crosshairs',
      text: 'Spend tallow on sculpting sympathetic wax poppets (typically 20%), piercing effigies with bone needles to deal direct internal damage, deploying boiling vapor cauldrons, or raising protective bone fetishes.'
    },
    risk: {
      title: 'Crucible Depletion',
      icon: 'fa-triangle-exclamation',
      text: 'If Bog Tallow drops to 0%, sympathetic poppets lose cohesion and melt, ending active effigy bonds until fresh tallow is rendered.'
    }
  },
  exampleTurn: '**Turn 1:** Bog Hex, 1 AP (mark enemy and give disadvantage on next check); Render Tallow, 1 AP (+20% Tallow, 70% total). **Turn 2:** Spend 20% Tallow on Sympathetic Poppet, 1 AP (link poppet to hexed target). Needle Prick, 1 AP, 10% Tallow (deal 1d8 piercing to linked foe regardless of range). **Turn 3:** Deploy Cauldron of Vapors (2 AP, 20% Tallow) to blind adjacent foes and secure the perimeter.',
  weaveIn: [
    { text: 'Two core grants, forty optional records, and three talent trees distill the deep marsh witchcraft.', tab: 'spells', tabLabel: 'browse the spellbook' },
    { text: 'Hexbinder, Miasmist, and Fetish Crafter explore sympathetic curses, choking cloud hazards, and bone effigies.', tab: 'specializations', tabLabel: 'compare the three paths' },
    { text: 'Witch Doctor is rooted in the Bryngloom mire traditions, completely separate from Animist communion or Druid shape-shifting.', tab: 'overview', tabLabel: 'read class overview' }
  ],
  quickStart: {
    title: 'The First Poppet',
    headers: ['Action', 'Price', 'Result'],
    rows: [
      ['Bog Hex', '1 AP', 'Disadvantage on next check; mark for sympathetic effigy'],
      ['Render Tallow', '1 AP', 'Boil peat and herbs; recover +20% Bog Tallow'],
      ['Sympathetic Poppet', '1 AP + 20% Tallow', 'Sculpt wax effigy; linked damage reflection'],
      ['Needle Prick', '1 AP + 10% Tallow', '1d8 piercing to linked target + disadvantage on attack'],
      ['Cauldron of Vapors', '2 AP + 20% Tallow', '15 ft vapor cloud dealing 2d6 blight and blind'],
      ['Completed long rest', 'Rest', 'Bog Tallow resets to 50% baseline']
    ],
    footnote: 'Read-only display: no tallow spending, poppet binding, or damage is applied automatically.'
  },
  trackerHint: 'The Bog Tallow HUD displays 0 to 100% tallow capacity. All wax rendering, poppet binding, and spending are recorded manually at the tabletop.',
  extraSections: [{
    kind: 'prose',
    id: 'witchDoctorLedger',
    title: 'The Peat Crucible',
    icon: 'fa-skull',
    content: 'Track Bog Tallow openly (0 to 100%). Mark which creatures are currently bound to active wax poppets (maximum 1 base, expandable via talents). Pierce poppets cleanly with bone needles to bypass cover and distance.'
  }],
  playingInPerson: {
    materials: ['A tallow percentage dial or d100 percentile dice', 'Small wax poppet markers or cloth dolls', 'Bone needle tokens'],
    keepSections: ['bog tallow %', 'bound poppets', 'active vapor clouds']
  }
};
