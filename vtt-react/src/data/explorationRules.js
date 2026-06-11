export const EXPLORATION_RULES = {
  sundrift_vale: {
    id: 'sundrift_vale',
    name: 'Sundrift Vale Exploration',
    region: 'sundrift-vale',
    description: 'The starless steppe demands unique navigation and survival mechanics. The ancestral mound-hum provides the only directional reference in a landscape where the sky is permanently dark and no celestial navigation is possible.',
    rules: [
      {
        id: 'acoustic_navigation',
        name: 'Acoustic Navigation',
        type: 'travel',
        description: 'Navigation in Sundrift Vale uses a three-state system based on the audibility of the ancestral mound-hum.',
        states: [
          {
            name: 'Mound-Audible',
            condition: 'Default state. No extreme weather.',
            resolution: {
              skill: 'Survival',
              success: 'On course. Normal travel time.',
              failure: '+1d3 hours added to travel segment.'
            }
          },
          {
            name: 'Mound-Muffled',
            condition: 'Windstorms, weather severity 2+.',
            resolution: {
              skill: 'Perception (hearing)',
              dcModifier: '+2 per severity level above 1',
              success: 'On course.',
              failure: '+2d4 hours AND party wanders into hazard terrain (Lien-Stalk Razorgrass or Hungry Child territory).'
            }
          },
          {
            name: 'Mound-Silent',
            condition: 'Blackout Gale, Wyrd-Wind Night, or Mound-Eater encounter. Mounds produce no hum.',
            resolution: {
              skill: 'None',
              outcome: 'Navigation is impossible. Party must either shelter in place (1d6 hours, random encounters on d12 every 2 hours) or follow an Astril character whose suppressed constellation patterns glow as the only visible reference. If no Astril is present, the party cannot navigate.'
            }
          }
        ]
      },
      {
        id: 'memory_toll',
        name: 'The Memory Toll',
        type: 'environmental',
        description: 'The steppe takes something from those who do not belong to it.',
        trigger: 'Every 24 hours traveling without reaching a settlement or mound-camp.',
        immuneRaces: ['astril'],
        immuneSubraces: ['ordan'],
        resolution: {
          save: 'Spirit',
          dc: '10 + hours beyond 24',
          success: 'No effect.',
          failure: 'The GM removes one piece of information the character knew — a name, a direction, a promise, a face. Not amnesia: the steppe took it.',
          recovery: 'Visit an Ancestor Mound and spend 1 hour in the hum. The mound "sings the memory back."'
        }
      },
      {
        id: 'mound_resonance',
        name: 'Mound-Resonance Encounter',
        type: 'rest',
        description: 'Resting within 1 mile of an Ancestor Mound triggers a resonance check.',
        trigger: 'Party rests within 1 mile of an Ancestor Mound.',
        resolution: {
          roll: 'd20',
          outcomes: [
            { range: [1, 5], result: 'Peaceful Hum', effect: 'Characters recover 1 additional exhaustion level.', type: 'beneficial' },
            { range: [6, 10], result: 'Ancestral Vision', effect: 'One character receives a cryptic vision relevant to the campaign. The dead are trying to communicate.', type: 'narrative' },
            { range: [11, 15], result: 'Hungry Child Pack', effect: 'Combat encounter during the rest. Hunts only under starless sky.', type: 'combat' },
            { range: [16, 19], result: 'Mound-Awakened Ancestor', effect: 'Social encounter — the ancestor has information but demands a toll (a memory, a song, a promise).', type: 'social' },
            { range: [20, 20], result: 'Ancient Mound-Eater', effect: 'Catastrophic combat encounter. If the party flees, the mound goes permanently silent — a navigation landmark is lost forever.', type: 'catastrophic' }
          ]
        }
      },
      {
        id: 'herd_trail_riding',
        name: 'Ordan Herd-Trail Riding',
        type: 'travel',
        description: 'Following the woolly herds provides reliable navigation through the starless steppe.',
        requirements: 'Ordan guide present OR successful Survival check (DC 12) to track a herd via trail signs.',
        benefit: 'Navigation checks made with advantage as long as the herd is in sight.',
        complication: {
          trigger: 'Wyrd-Touched Herd-Beast present in herd (GM discretion or encounter table result)',
          resolution: {
            save: 'Animal Handling',
            dc: 12,
            success: 'Herd remains calm.',
            failure: 'Stampede. Party scattered (1d4 hours lost, 1d6 physical damage from hooves).'
          }
        }
      }
    ]
  },

  lost_brood: {
    id: 'lost_brood',
    name: 'The Lost Brood',
    region: 'cragjaw-peaks',
    type: 'campaign_arc',
    description: 'A multi-phase campaign arc centered on the Groven broodlings left behind in the Deep Alchemists\' vats during the Vat-Breakers\' revolt 800 years ago.',
    phases: [
      {
        tier: [1, 3],
        name: 'The Evidence',
        hook: 'A Morgh patrol returns from the Sump Galleries carrying a stone-scale fragment — too fine for Thrumm, too recent to be ancient. Vorr-Geth (last living Vat-Breaker) confirms it is Groven and breaks a decades-long silence to address the Stone-Moot.',
        delivery: 'The party is hired by Thessa Ire (Ithran diplomat) through back-channels to escort a tunnel-scout team into the Sump Galleries.',
        twist: 'House Tesshan has been trading geothermal heat to the Deep Alchemists in exchange for alchemical products — funding the continued experimentation. Exposing this breaks the Groven-Tesshan alliance.',
        keyLocations: ['sump-galleries'],
        keyNPCs: ['vorr-geth', 'thessa-ire'],
        keyFactions: ['vat-breakers-guild', 'house-tesshan', 'deep-alchemists']
      },
      {
        tier: [4, 7],
        name: 'The Descent',
        hook: 'Using intelligence from the Sump Galleries, the party maps a route to the Lost Brood Vats through the Ancestor-Gaps.',
        complication: 'The Restorers (fanatical Groven rescue faction, unregistered in factionStore) offer to accompany the party. They will not accept retreat. If the party flees, the Restorers stay and die.',
        keyEncounters: [
          { location: 'ancestor-gaps', type: 'social', description: 'Must obtain Groven permission and a Morgh guide.' },
          { location: 'lost-brood-vats', type: 'dungeon', description: 'Contains 800-year-old alchemical chambers, active Deep Alchemist operations, and the Lost Brood.' },
          { location: 'lost-brood-vats-deep', type: 'social', description: 'Saren-Vel (First Drun) is found in the deepest chamber, watching the Alchemists. She communicates only by writing in the dust: a single word "LIEN" and a diagram of the vat-layout.' }
        ],
        keyLocations: ['ancestor-gaps', 'lost-brood-vats'],
        keyNPCs: ['saren-vel'],
        keyFactions: ['vat-breakers-guild', 'deep-alchemists']
      },
      {
        tier: [8, 10],
        name: 'The Choice',
        description: 'The party reaches the Lost Brood and discovers a three-way split:',
        factions: [
          {
            name: 'The Feral Brood',
            description: 'Thrumm injected for 700 years. No longer truly Thrumm — hyper-intelligent but entirely alien. They do not want rescue. They want to understand what they have become.',
            stance: 'Will defend the vats against anyone who tries to "free" them.'
          },
          {
            name: 'The New Brood',
            description: 'Fresh Thrumm captured recently. Still cognizant, still afraid, still rescuable.',
            stance: 'Saving them is straightforward but triggers open war with the Deep Alchemists.'
          },
          {
            name: 'The Third Thing',
            description: 'The Deep Alchemists\' current project — not Thrumm, not Groven, but a deliberate 700-year synthesis. It is alive. It is aware.',
            stance: 'Unknown. The reason the Alchemists have never stopped.'
          }
        ],
        outcomes: [
          {
            choice: 'Rescue the New Brood only',
            consequence: 'Morgh Restorers gain allies. Deep Alchemists contained but hostile. Feral Brood remain, studying themselves.'
          },
          {
            choice: 'Rescue all Brood by force',
            consequence: 'Open war. Sump Galleries become combat zone. Tesshan involvement exposed. Ancestor-Spans lose geothermal heating.'
          },
          {
            choice: 'Destroy the vats entirely',
            consequence: 'All Brood die. Deep Alchemists ended. Calcification-reversal formula lost. Vorr-Geth considers this the final betrayal.'
          },
          {
            choice: 'Negotiate with the Feral Brood',
            consequence: 'Gain powerful but unpredictable allies — 700-year-old hyper-intelligent tunnel-dwellers who understand Fexric alchemy better than the Fexric. But the Groven must accept their "rescue" narrative was wrong.'
          }
        ],
        keyReward: {
          name: 'Calcification-Reversal Formula',
          description: 'Found in the Alchemists\' archives. The complete original, with an additional chapter: "Reversal of the Still-Claiming" — could not only cure calcification but reverse the Ancestor-Spans. The dead could be restored. But the Spans would be destroyed — the only navigation system in the Cragjaw Peaks.',
          location: 'deep-alchemists-archive'
        }
      }
    ]
  }
};

export const getExplorationRules = (regionId) => EXPLORATION_RULES[regionId] || null;
export const getExplorationRule = (ruleId) => {
  for (const region of Object.values(EXPLORATION_RULES)) {
    if (region.rules) {
      const rule = region.rules.find(r => r.id === ruleId);
      if (rule) return rule;
    }
  }
  return null;
};
export default EXPLORATION_RULES;
