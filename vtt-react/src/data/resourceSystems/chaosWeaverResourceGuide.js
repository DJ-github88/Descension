/**
 * Chaos Weaver — Resource System tab v2 authored guide.
 * Copy drafted from the CLASS-C1 packet (six tiles, four zones, paid Fold,
 * published uniform faces, one anomaly, one unresolved action). Registered
 * under class id `chaos-weaver`. Manual tabletop only: the tracker preview
 * never executes a rule, and the personal six-tile record starts uninitialized.
 */
export const chaosWeaverResourceGuide = {
  version: 2,

  tagline:
    'Six exact tiles, four zones, one zone each: publish which possibilities may happen, then spend them deliberately.',
  archetype: 'Finite Possibility Tiles (S/M/F)',

  vitals: [
    { icon: 'fa-layer-group', label: 'Zones', value: 'available · committed · bound · spent' },
    { icon: 'fa-dice-d6', label: 'Face', value: 'uniform mapping published first' },
    { icon: 'fa-recycle', label: 'Recover', value: 'Fold: 1 AP, one or two spent' },
    { icon: 'fa-exclamation-triangle', label: 'Risk', value: 'paid recovery, −5ft downsides, no healing' }
  ],

  loop: {
    gain: {
      title: 'Completed Long Rest',
      icon: 'fa-bed',
      text: 'The only automatic-feeling refill is explicit: after one confirmed completed long rest, with every pending action and anomaly settled, all six IDs become available and once-per-rest uses clear. Initiative, level gain, selection, view remount, short rest or reconnect never refill anything.'
    },
    hold: {
      title: 'The Four Zones',
      icon: 'fa-layer-group',
      text: 'Each of the six IDs (S1, S2, M1, M2, F1, F2) sits in exactly one zone. Committed tiles are backing an unresolved action; bound tiles fuel a placed anomaly; spent tiles are gone until paid recovery. A tile never changes symbol.'
    },
    spend: {
      title: 'Publish, Then Face',
      icon: 'fa-dice-d6',
      text: 'Every action names its input symbols and all branches before the face. Two committed IDs map to a d6 as 1–3 / 4–6, three IDs as 1–2 / 3–4 / 5–6. Apply only the published branch, confirm the retained result, and both/all IDs move to spent.'
    },
    risk: {
      title: 'Paid Recovery and Published Downsides',
      icon: 'fa-exclamation-triangle',
      text: 'Fold the Odds costs 1 real AP for one or two spent IDs — never committed or bound. Fracture penalties refresh their expiry but never sum: use the largest feet reduction, to a minimum of 0 remaining movement. Wards stop the stated Wyrd damage once, strongest only. There is no healing of any kind and no hidden reroll.'
    }
  },

  exampleTurn:
    '**Turn 1:** Publish Fraying Bolt with an available F, enter the face, and after confirmation send that F to spent (1d6 Wyrd, caster movement−5ft until next own-turn start). **Turn 2:** Split Possibility: fix one available F and one available S, publish the ordered pair and both branches, roll the d6 mapping, and both tiles go to spent regardless of the result. **Turn 3:** Fold the Odds for 1 AP to recover up to two spent IDs, and keep the remaining movement penalty rule in mind — largest reduction, not a sum.',

  weaveIn: [
    {
      text: 'All 49 active records list their exact AP price, input symbols and zone movement in the reference tables below.',
      tab: 'spells',
      tabLabel: 'browse the spellbook'
    },
    {
      text: 'Probability Sculptor prices more known possibilities, Anomaly Binder places one visible apparatus, and Cascade Weaver retains a single continuation.',
      tab: 'specializations',
      tabLabel: 'compare the three paths'
    },
    {
      text: 'A broken stabilizer blocks active class procedure until repaired; Prepared Exchange consumes one actual prepared spare part at the table.'
    }
  ],

  quickStart: {
    title: 'The Six Tiles at a Glance',
    headers: ['Action', 'Price', 'What it does'],
    rows: [
      ['Read the zones', 'free', 'Check where each of the six IDs currently sits'],
      ['Publish a split', '2 AP + tiles', 'Fix the ordered pair and all branches before the face'],
      ['Fold the Odds', '1 AP', 'Recover one or two spent IDs (never committed/bound)'],
      ['Completed long rest', 'explicit', 'All six available; once-per-rest uses clear'],
      ['Anomaly', 'one at a time', 'Trigger, endT+2 expiry or 1-AP dismissal → both spent'],
      ['Fracture penalty', 'largest only', '−5ft/−10ft refresh, never stack; minimum 0']
    ],
    footnote:
      'Manual tabletop only: no AP, tile, movement or effect is applied automatically. Invalid states are rejected rather than repaired.'
  },

  trackerHint:
    'Interactive preview of the six-tile display. The personal class record starts uninitialized — set zones by hand and validate the whole candidate state before it is used.',

  tableMeta: {
    zoneTable: { title: 'The Four Zones', defaultOpen: true },
    activePricingTable: { title: 'Active Record Prices (49)', defaultOpen: false },
    faceMappingTable: { title: 'Published Face Mapping', defaultOpen: true },
    penaltyTable: { title: 'Penalties and Wards', defaultOpen: false }
  },

  playingInPerson: {
    materials: [
      'Six tokens or cards labelled S1, S2, M1, M2, F1, F2 — one per exact ID',
      'One zone board with four labelled spaces: available, committed, bound, spent',
      'One visible stabilizer prop or note the table can mark broken/working',
      'One d6 for the published selection faces (damage dice are always separate dice)'
    ],
    keepSections: ['tracking', 'rest label']
  }
};
