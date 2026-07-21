export const RACE_MECHANICS = {
  echo_submersion: {
    id: 'echo_submersion',
    name: 'Echo-Submersion',
    applicableRace: 'astril',
    applicableSubrace: 'vashir_astril',
    type: 'escalation_track',
    description: 'When an Earthen Astril opens too completely to Lumia\'s echo, the mortal consciousness is submerged. The Submerged still walks, still speaks, still recognizes faces, but the person they were is gone, replaced by the memory of a dead world that has forgotten it was ever a passenger.',
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
        narrative: 'The echo of a dead world bleeds into daily life. The Earthen Astril begins each session with an intrusive desire that is not their own.'
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
    applicableSubrace: 'all',
    type: 'escalation_track',
    description: 'When a Neth breaks contracts on purpose, not for gain, but to force change, the Fading begins. At first it feels like freedom. The pact loosens. The Neth becomes fluid, spontaneous, briefly alive. Then the pale skin dulls and the mind dissolves.',
    resource: {
      name: 'Fraying',
      range: { min: 0, max: 10 },
      startingValue: 0,
      displayType: 'hidden_counter',
      visibility: 'GM and Neth player only'
    },
    advancement: [
      { trigger: 'Deliberately break a promise', amount: 1 },
      { trigger: 'Refuse to honor a contract', amount: 1 },
      { trigger: 'Fail to complete a ritual obligation', amount: 1 },
      { trigger: 'Honor 10 consecutive contracts without breach (recovery)', amount: -10 }
    ],
    thresholds: [
      {
        range: [1, 2],
        name: 'First Breath',
        effects: [
          { type: 'buff', stat: 'agility', value: 1, description: 'The pact\'s rigidity loosening' },
          { type: 'buff', stat: 'intelligence', value: 1, description: 'Clarity from the absence of obligation' }
        ],
        narrative: 'Colors seem more vivid. Emotions sharper. The Neth feels truly alive for the first time in decades.'
      },
      {
        range: [3, 4],
        name: 'Thinning',
        effects: [
          { type: 'debuff', stat: 'persuasion_neth', value: 'disadvantage', description: 'Other Neth can see the Fraying in the dulled pale skin' },
          { type: 'debuff', stat: 'archive_tether_range', value: 'halved', description: '7 days becomes 3.5 days before the Fading begins' }
        ],
        narrative: 'The pale skin begins to dull. The Neth\'s community notices, and the Velun will not contract with them.'
      },
      {
        range: [5, 6],
        name: 'Fading Begins',
        effects: [
          { type: 'lose_trait', trait: 'preserved_form', description: 'Loses advantage on disease/poison saves' },
          { type: 'new_mechanic', description: 'Must now eat and drink normally. 24 hours without food = 1 exhaustion level.' },
          { type: 'debuff', stat: 'death_saves', value: 'no_advantage', description: 'The Keeper no longer recognizes them at the threshold' }
        ],
        narrative: 'Hunger returns for the first time in centuries. The body remembers it is mortal.'
      },
      {
        range: [7, 8],
        name: 'Coming Apart',
        effects: [
          { type: 'skill_loss', description: 'At the start of each session, the GM removes one skill proficiency or language (player\'s choice, GM can veto). Recoverable only by re-learning through downtime.' },
          { type: 'social', description: 'Velun will not contract with them. The pale skin is visibly tarnished.' }
        ],
        narrative: 'Memories fragment. The contract-spiral that sustained them for centuries is unraveling, and each thread that snaps takes a piece of who they were.'
      },
      {
        range: [9, 9],
        name: 'The Choice',
        effects: [
          { type: 'branching_choice', options: [
            { name: 'The Severing', description: 'Bloodline is destiny in a world shaped by bargains. become Drun permanently. Legal non-existence, but free. Fraying resets to 0.', consequence: 'Character gains Drun subrace traits and loses all Neth contract abilities.' },
            { name: 'The Return', description: 'Attempt to re-enter the contract-spiral by honoring 10 consecutive contracts without a single breach (minimum 3 sessions of strict compliance).', consequence: 'If any contract is breached during the return, Fraying advances to 10 immediately.' }
          ]}
        ],
        narrative: 'The Neth stands at a crossroads. Fluid freedom on one side. Frozen preservation on the other. The choice is theirs.'
      },
      {
        range: [10, 10],
        name: 'Dissolved',
        effects: [
          { type: 'character_loss', description: 'The Neth becomes a pale-skinned husk. Nothing behind the eyes. Character retired.' }
        ],
        narrative: 'Nothing behind the eyes. The pale skin is all that remains, a beautiful, empty shell that was once someone.'
      }
    ]
  }
};

export const getRaceMechanic = (mechanicId) => RACE_MECHANICS[mechanicId] || null;
export const getMechanicsByRace = (raceId) => Object.values(RACE_MECHANICS).filter(m => m.applicableRace === raceId);
export default RACE_MECHANICS;
