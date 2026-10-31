export const dreadnaughtResourceGuide = {
  version: 2,
  tagline: 'Stoke the spinal firebox, build Furnace Pressure from physical impacts and kinetic locomotion, and vent superheated steam to demolish foes.',
  archetype: 'Furnace Pressure & Steam Heat Economy',
  vitals: [
    { icon: 'fa-tachometer-alt', label: 'Furnace Pressure', value: '0-100 PSI (Cap 100)' },
    { icon: 'fa-fire-flame-curved', label: 'Working (31-60 PSI)', value: '+2 Physical DR' },
    { icon: 'fa-bolt', label: 'Supercharged (61-90 PSI)', value: '+10 ft Speed, +1d6 Fire Melee' },
    { icon: 'fa-triangle-exclamation', label: 'Overheat (91-100 PSI)', value: 'Danger: 2d6 Self Burn if unvented' }
  ],
  loop: {
    gain: {
      title: 'Combustion & Kinetic Friction',
      icon: 'fa-fire-burner',
      text: 'Gain +10 PSI when struck by an incoming physical attack; +15 PSI when activating hydraulic steam servos or moving ≥20 ft; +20 PSI by activating Stoke Furnace (1 AP); +5 PSI at the start of your turn while in combat.'
    },
    hold: {
      title: 'Maintain Boiler Equilibrium',
      icon: 'fa-gauge-high',
      text: 'Furnace Pressure remains stable while combat continues. Outside combat, pressure drops to 10 PSI on a short rest as valves settle, and 0 PSI on a completed long rest as the firebox cools.'
    },
    spend: {
      title: 'Vent Steam and Hydraulic Slams',
      icon: 'fa-smog',
      text: 'Spend Furnace Pressure to unleash concussive steam releases (Vent Steam), hydraulic piston slams, seismic ground shockwaves, and high-velocity trampling charges.'
    },
    risk: {
      title: 'Boiler Overheat at 91+ PSI',
      icon: 'fa-triangle-exclamation',
      text: 'If Furnace Pressure reaches 91–100 PSI, the boiler enters Overheat: you must vent steam within 1 round or suffer 2d6 internal fire damage as valves blow. However, while in Overheat, melee damage dice are maximized.'
    }
  },
  exampleTurn: '**Turn 1:** Stoke Furnace, 1 AP (+20 PSI, 40 total). Suffer enemy physical strike (+10 PSI, 50 total — Working tier active, +2 DR). **Turn 2:** Iron Trample, 2 AP, 15 PSI (35 remaining); charge 20 ft through two foes for 2d8 bludgeoning. Enemy strikes you (+10 PSI, 45 total). **Turn 3:** Vent Steam, 0 AP, 30 PSI (15 remaining); create 10 ft scalding cloud dealing 2d6 fire damage and obscuring enemy vision.',
  weaveIn: [
    { text: 'Two core grants, forty optional records, and three talent trees fuel the heavy boiler engine.', tab: 'spells', tabLabel: 'browse the spellbook' },
    { text: 'Siege Bastion, Furnace Engine, and Juggernaut Momentum provide distinct paths of fortified defense, thermal venting, and kinetic impact.', tab: 'specializations', tabLabel: 'compare the three paths' },
    { text: 'Dreadnaught is open to all ancestries. Boiler plate and hydraulic pistons are engineering marvels of the Groven peaks, not restricted heritage traits.', tab: 'overview', tabLabel: 'read class overview' }
  ],
  quickStart: {
    title: 'Boiler Operation Table',
    headers: ['Action', 'Price', 'Result'],
    rows: [
      ['Stoke Furnace', '1 AP', '+20 PSI; gain 5 temporary HP'],
      ['Vent Steam', '0 AP + 30 PSI', '10 ft scalding burst; 2d6 fire damage + vision obscurement'],
      ['Struck by physical attack', 'Passive Reaction', '+10 PSI'],
      ['Working Tier (31-60 PSI)', 'Automatic Threshold', '+2 Damage Reduction against physical attacks'],
      ['Supercharged Tier (61-90 PSI)', 'Automatic Threshold', '+10 ft movement speed; melee strikes deal +1d6 fire damage'],
      ['Overheat Tier (91-100 PSI)', 'Hazard Warning', 'Must vent within 1 round or suffer 2d6 fire damage; melee damage maximized'],
      ['Short Rest / Long Rest', 'Rest', 'Drops to 10 PSI (short rest) or 0 PSI (long rest)']
    ],
    proTip: 'Keep your boiler hovering in the Supercharged tier (61–90 PSI) for maximum speed and fire damage, but keep Vent Steam (0 AP) ready in case incoming hits threaten to push you into catastrophic Overheat.'
  }
};

export default dreadnaughtResourceGuide;
