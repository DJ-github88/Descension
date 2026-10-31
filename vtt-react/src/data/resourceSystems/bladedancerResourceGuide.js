export const bladedancerResourceGuide = {
  version: 2,
  tagline: 'Build Kinetic Momentum from rapid strikes and parries; spend on fluid repositioning, whirlwind flourishes, and lethal finishers.',
  archetype: 'Kinetic Momentum & Combo Economy',
  vitals: [
    { icon: 'fa-bolt', label: 'Momentum', value: '0-10 (Tiers: Adagio to Presto)' },
    { icon: 'fa-shield-halved', label: 'Parry / Riposte', value: '+1 to +2 Momentum' },
    { icon: 'fa-running', label: 'Lunge / Flourish', value: '-1 to -6 Momentum' },
    { icon: 'fa-hourglass-half', label: 'Decay', value: '1 / round out of combat' }
  ],
  loop: {
    gain: {
      title: 'Strike and Parry in Rhythm',
      icon: 'fa-bolt',
      text: 'Gain +1 Momentum on successful melee weapon hits; +2 Momentum when landing a critical strike or successfully parrying an incoming melee attack; +1 Momentum when moving at least 15 ft before striking.'
    },
    hold: {
      title: 'Maintain Combat Velocity',
      icon: 'fa-shield-halved',
      text: 'Momentum persists while engaged in active combat. Tiers: Adagio (0-2), Andante (3-5), Allegro (6-8), and Presto (9-10). When combat ceases, momentum decays by 1 point per round until resting at 0.'
    },
    spend: {
      title: 'Discharge in Devastating Flourishes',
      icon: 'fa-crosshairs',
      text: 'Spend momentum on high-velocity maneuvers: Cyclone Pivot, Severing Thrust, Phantom Step, and grand finishers like Grand Crescendo. Abilities list explicit momentum costs.'
    },
    risk: {
      title: 'Momentum Ceiling & Exhaustion',
      icon: 'fa-triangle-exclamation',
      text: 'Momentum caps at 10. Any point generated beyond 10 is lost. Momentum cannot be converted to mana or generic action points.'
    }
  },
  exampleTurn: '**Turn 1:** Fluid Pivot, 1 AP (gain +2 AC); Kinetic Strike, 1 AP, hit foe (+1 Momentum, Adagio). Enemy attacks; Whirling Parry reaction (+1 Momentum, 2 total). **Turn 2:** Kinetic Strike, 1 AP, crit (+2 Momentum, 4 total, Andante). Spend 2 Momentum on Cyclone Pivot, 1 AP; deal 2d8 slashing to adjacent foes and reposition 10 ft. **Turn 3:** Advance to Allegro (6+ Momentum) and prepare high-tier finishers.',
  weaveIn: [
    { text: 'Two core grants, forty optional records, and three talent trees power the flow state.', tab: 'spells', tabLabel: 'browse the spellbook' },
    { text: 'Flow Master, Duelist, and Shadow Dancer offer specialized kinetic combat paths.', tab: 'specializations', tabLabel: 'compare the three paths' },
    { text: 'Bladedancer welcomes all lineages. Twin finesse weapons and kinetic flow are discplines of the body, not ancestry locks.', tab: 'overview', tabLabel: 'read class overview' }
  ],
  quickStart: {
    title: 'The First Dance',
    headers: ['Action', 'Price', 'Result'],
    rows: [
      ['Successful melee hit', 'Standard attack', '+1 Kinetic Momentum'],
      ['Critical strike or parry', 'Authored check', '+2 Kinetic Momentum'],
      ['Kinetic Strike', '1 AP', '1d8 + Agi damage; +1 Momentum'],
      ['Fluid Pivot', '1 AP', '10 ft reposition without opportunity attacks; +2 AC'],
      ['Whirling Parry', 'Reaction', 'Deflect 1d10 + Agi damage; +1 Momentum'],
      ['Cyclone Pivot', '1 AP + 2 Momentum', '2d8 damage in 5 ft radius + 10 ft shift'],
      ['Out of combat decay', '1 round of stillness', '-1 Kinetic Momentum']
    ],
    footnote: 'Read-only display: no momentum generation, tempo shift, parry deflection, or damage is applied automatically.'
  },
  trackerHint: 'The Kinetic Momentum HUD displays 0 to 10 momentum points across 4 tempos (Adagio, Andante, Allegro, Presto). All generation and spending are recorded manually at the tabletop.',
  extraSections: [{
    kind: 'prose',
    id: 'bladedancerLedger',
    title: 'The Tempo Cadence',
    icon: 'fa-bolt',
    content: 'Track Kinetic Momentum openly (0 to 10). Advance through combat tempos as momentum rises: Adagio (0-2), Andante (3-5), Allegro (6-8), and Presto (9-10). Spend momentum decisively on flourishes and finishers.'
  }],
  playingInPerson: {
    materials: ['10 momentum tokens or d10 counter', '2 miniature finesse blade markers', 'A 15 ft movement ruler'],
    keepSections: ['momentum', 'current tempo', 'parry reactions']
  }
};
