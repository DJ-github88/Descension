export const RACE_MECHANICS = {
  echo_submersion: {
    id: 'echo_submersion',
    name: 'Echo-Submersion',
    applicableRace: 'astril',
    applicableSubrace: 'vashir_astril',
    type: 'escalation_track',
    description: 'When a Lumian opens too completely to Lumia\'s echo, the mortal consciousness is submerged. The Submerged still walks, still speaks, still recognizes faces, but the person they were is gone, replaced by the memory of a dead world that has forgotten it was ever a passenger.',
    resource: {
      name: 'Echo Depth',
      range: { min: 0, max: 10 },
      startingValue: 0,
      displayType: 'counter'
    },
    advancement: [
      { trigger: 'Use "Open the Vessel" ability', amount: 1 },
      { trigger: 'Use "Lumian Fury" ability', amount: 1 },
      { trigger: 'Roll natural 1 on Spirit save while Lumia\'s echo is active', amount: 1 },
      { trigger: 'Long rest with throat-singer present', amount: -1 },
      { trigger: 'Long rest in spirit-dormitory', amount: -2 }
    ],
    thresholds: [
      {
        range: [1, 3],
        name: 'Whispering',
        effects: [],
        narrative: 'Lumia\'s memory speaks louder after combat. Crystalline patterns flicker at the edge of vision.'
      },
      {
        range: [4, 6],
        name: 'Surging',
        effects: [
          { type: 'debuff', stat: 'stealth', value: 'disadvantage', description: 'Markings glow even in bright light' },
          { type: 'narrative', description: 'GM delivers one "echo impulse" per session, Lumia\'s memory wants something. Spirit save DC 12 to resist; success costs 1 Depth, failure advances 1 Depth.' }
        ],
        narrative: 'The echo of a dead world bleeds into daily life. The Lumian begins each session with an intrusive desire that is not their own.'
      },
      {
        range: [7, 9],
        name: 'Flooding',
        effects: [
          { type: 'buff', stat: 'spirit', value: 2 },
          { type: 'buff', stat: 'attackDamage', value: '1d4 ember' },
          { type: 'special', description: 'On natural 1 on any d20 roll, the echo takes control for 1 round. DC 16 Constitution save to resist.' }
        ],
        narrative: 'The mortal shell is a contested vessel. Power flows, but autonomy ebbs.'
      },
      {
        range: [10, 10],
        name: 'Submerged',
        effects: [
          { type: 'character_loss', description: 'Character becomes NPC under GM control. The mortal consciousness is submerged.' }
        ],
        recovery: {
          method: 'Throat-singing ritual',
          requirements: '3 successful Spirit checks (DC 15) by allies over 3 consecutive in-game days',
          success: 'Character returns at Echo Depth 5',
          failure: 'Character remains Submerged permanently',
          specialCase: 'Player may continue as the echo-entity itself, a genuinely different personality, until recovery succeeds or fails.'
        },
        narrative: 'Lumia\'s memory has forgotten it was ever a passenger. The person who bore it is a fading echo in the starless dark.'
      }
    ]
  },

  the_unraveling: {
    id: 'the_unraveling',
    name: 'The Unraveling',
    applicableRace: 'neth',
    applicableSubraces: ['velun_neth', 'kessen_neth'],
    type: 'escalation_track',
    description: 'The single ten-step Fraying track for pact-bound Athien and Weft. Deliberate breaches loosen preservation, then erode body and memory. Riven have severed the pact and do not use this track. Archive-distance failure is a separate cause, not a second set of breach penalties.',
    resource: {
      name: 'Fraying',
      range: { min: 0, max: 10 },
      startingValue: 0,
      displayType: 'hidden_counter',
      visibility: 'GM and Athien player only'
    },
    advancement: [
      { trigger: 'Deliberately break a promise', amount: 1 },
      { trigger: 'Refuse to honor a contract', amount: 1 },
      { trigger: 'Fail to complete a ritual obligation', amount: 1 },
      { trigger: 'Fulfill 10 substantive, verifiable obligations consecutively without breach; trivial receipts manufactured for recovery do not count', amount: -10 }
    ],
    thresholds: [
      {
        range: [0, 0],
        name: 'Preservation Stable',
        effects: [],
        narrative: 'The pact remains stable; any archive-distance failure is tracked as a separate cause.'
      },
      {
        range: [1, 2],
        name: 'First Breath',
        effects: [
          { type: 'buff', stat: 'agility', value: 1, description: 'The pact\'s rigidity loosening' },
          { type: 'buff', stat: 'intelligence', value: 1, description: 'Clarity from the absence of obligation' }
        ],
        narrative: 'Colors seem more vivid. Emotions sharper. The Athien feels truly alive for the first time in decades.'
      },
      {
        range: [3, 4],
        name: 'Thinning',
        effects: [
          { type: 'debuff', stat: 'persuasion_neth', value: 'disadvantage', description: 'Other Athien can see the Fraying in the dulled pale skin' },
          { type: 'debuff', stat: 'archive_tether_range', value: 'halved', description: 'The ordinary travel-distance boundary is halved; the separate 3/7/14-day exposure thresholds do not change' }
        ],
        narrative: 'The pale skin begins to dull. The Athien\'s community notices, and the Athien will not contract with them.'
      },
      {
        range: [5, 6],
        name: 'Fading Begins',
        effects: [
          { type: 'lose_trait', trait: 'preserved_body', description: 'Loses the preserved-body advantage on disease/poison saves' },
          { type: 'lose_trait', trait: 'stillness_trance', description: 'Pact trance no longer replaces ordinary sleep' },
          { type: 'new_mechanic', description: 'Must now eat, drink, and sleep normally. 24 hours without food = 1 exhaustion level.' },
          { type: 'debuff', stat: 'death_saves', value: 'no_advantage', description: 'The Keeper no longer recognizes them at the threshold' }
        ],
        narrative: 'Hunger returns for the first time in centuries. The body remembers it is mortal.'
      },
      {
        range: [7, 8],
        name: 'Coming Apart',
        effects: [
          { type: 'skill_loss', description: 'At the start of each session, the GM removes one skill proficiency or language (player\'s choice, GM can veto). Recoverable only by re-learning through downtime.' },
          { type: 'social', description: 'Athien will not contract with them. The pale skin is visibly tarnished.' }
        ],
        narrative: 'Memories fragment. The contract-spiral that sustained them for centuries is unraveling, and each thread that snaps takes a piece of who they were.'
      },
      {
        range: [9, 9],
        name: 'The Choice',
        effects: [
          { type: 'branching_choice', options: [
             { name: 'The Severing', description: 'Deliberately become Riven, losing pact preservation and First Contract standing. Fraying no longer applies.', consequence: 'Character gains Riven subrace traits and loses all Athien contract abilities.' },
             { name: 'The Return', description: 'Fulfill 10 substantive, verifiable obligations without breach over at least 3 sessions of sustained compliance. Trivial receipts do not count.', consequence: 'If any contract is breached during the return, Fraying advances to 10 immediately.' }
          ]}
        ],
        narrative: 'The Athien stands at a crossroads. Fluid freedom on one side. Frozen preservation on the other. The choice is theirs.'
      },
      {
        range: [10, 10],
        name: 'Dissolved',
        effects: [
          { type: 'character_loss', description: 'The Athien becomes a pale-skinned husk. Nothing behind the eyes. Character retired.' }
        ],
        narrative: 'Nothing behind the eyes. The pale skin is all that remains, a beautiful, empty shell that was once someone.'
      }
    ],
    archiveDistanceFailure: {
      effectId: 'archive_tether',
      ordinaryTravelWeeks: 1,
      exposureThresholdDays: [3, 7, 14],
      recoveryTranceHours: 24,
      recoveryClearsFraying: false,
      stackSharedSymptoms: false
    }
  }
};

export const getRaceMechanic = (mechanicId) => RACE_MECHANICS[mechanicId] || null;
// Omit subraceId for an overview; character grants pass the resolved heritage ID.
export const getMechanicsByRace = (raceId, subraceId = null) => Object.values(RACE_MECHANICS).filter(m =>
  m.applicableRace === raceId && (
    !subraceId || (Array.isArray(m.applicableSubraces)
      ? m.applicableSubraces.includes(subraceId)
      : !m.applicableSubrace || m.applicableSubrace === 'all' || m.applicableSubrace === subraceId)
  )
);
export default RACE_MECHANICS;
