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

  frostwood_reach: {
    id: 'frostwood_reach',
    name: 'Frostwood Reach Exploration',
    region: 'frostwood-reach',
    description: 'The dense, petrified ironwood canopy is wrapped in a thick, memory-erasing grey fog. Survival depends on maintaining written journals, burning moss-wax candles, and following established silt-roads.',
    rules: [
      {
        id: 'silt_road_travel',
        name: 'Silt-Road Travel',
        type: 'travel',
        description: 'Travelers must navigate the shifting silt-roads marked by rusted lantern-posts.',
        resolution: {
          requirement: 'Requires a Thalren tracker guide OR successful Survival check (DC 12) to stay on path.',
          success: 'On course. Normal travel time.',
          failure: '+1d4 hours added to travel segment AND party wanders into a High Density Fog Pocket (triggers immediate Memory Toll check).'
        }
      },
      {
        id: 'memory_fog_exposure',
        name: 'Memory Fog Exposure',
        type: 'environmental',
        description: 'The creeping protective fog of the Reach slowly erases personal memories.',
        trigger: 'Every 24 hours spent traveling in the wilderness.',
        immuneRaces: ['mimir'],
        resolution: {
          protection: 'Burning a Moss-Wax Candle (lasts 8 hours, costs 5 copper) or wearing a carved Mimir mask grants immunity.',
          save: 'Spirit',
          dc: '12 + days exposed in wilderness',
          success: 'No effect.',
          failure: 'The GM removes one piece of personal identity information from the character (their name, a family face, an active contract, or a critical memory).',
          recovery: 'Visit Mirror Mere to gaze into your reflection, or pay a 10 silver registration update fee to Scribes\' Tower to recover lost records.'
        }
      },
      {
        id: 'palisade_checkpoints',
        name: 'Palisade Checkposts',
        type: 'faction',
        description: 'Mist-Sentinels along the petrified Ironwood Palisade enforce Jarl Kaelen's Sovereign Ledger.',
        trigger: 'Entering or leaving any major settlement zone.',
        resolution: {
          requirement: 'Produce a valid, stamped page from the Sovereign Ledger.',
          options: [
            { path: 'Comply', result: 'Show documents. Access granted.' },
            { path: 'Bribe', skill: 'Persuasion (DC 14)', success: 'Allowed to pass for a 5 silver tax.', failure: 'Turned back; repeat attempts trigger hostiles.' },
            { path: 'Sneak', skill: 'Stealth (DC 15)', success: 'Slipped past the checkpoint.', failure: 'Busted. Mist-Sentinels pursue; characters are marked as "Forgotten Outlaws" in the district.' }
          ]
        }
      }
    ]
  },

  nordhalla: {
    id: 'nordhalla',
    name: 'Nordhalla Exploration',
    region: 'nordhalla',
    description: 'A brutal glacier cathedral where the advance of ice was halted at the price of eternal winter. Ruled by King-Jarl Halvar Skalvyr.',
    rules: [
      {
        id: 'glacier_pathing',
        name: 'Glacier Pathing',
        type: 'travel',
        description: 'Trekking through active crevasse fields and shifting ice walls.',
        resolution: {
          skill: 'Athletics or Survival',
          dc: 13,
          success: 'Safe navigation over ice bridges.',
          failure: 'Crevasse fall (1d6 falling damage + 1d6 cold damage) or party delayed by +1d4 hours due to sudden ice collapse.'
        }
      },
      {
        id: 'rime_bite',
        name: 'The Rime-Bite',
        type: 'environmental',
        description: 'The freezing climate saps the strength of the unprepared.',
        trigger: 'Every 12 hours traveling in sub-zero wilderness.',
        resolution: {
          protection: 'Wearing rime-resistant heavy furs or consuming rime-resistant spirits grants advantage.',
          save: 'Constitution',
          dc: 12,
          success: 'No effect.',
          failure: 'Suffer 1 level of exhaustion. At 3+ exhaustion levels, the character's speed is halved and they cannot gain the benefits of a short rest.'
        }
      },
      {
        id: 'sunder_wall_check',
        name: 'Sunder-Wall Gateways',
        type: 'faction',
        description: 'The Icechamber Syndicate polices trade and migration along Halvar's massive Sunder-Wall.',
        trigger: 'Crossing clan boundaries or entering Syndicate ports.',
        resolution: {
          requirement: 'Present a clan charter or pay the Syndicate toll.',
          options: [
            { path: 'Tax', effect: 'Pay 10% of carried goods or 5 silver.' },
            { path: 'Fredløse Passage', skill: 'Deception (DC 13) or Stealth (DC 16)', success: 'Passed through hidden gaps.', failure: 'Conscription into glacial mining labor for 48 hours or open combat.' }
          ]
        }
      }
    ]
  },

  sundale: {
    id: 'sundale',
    name: 'Sundale Exploration',
    region: 'sundale',
    description: 'A volcanic wasteland surrounding the tomb of Sol, governed under Hierophant Aethelgard's Dawn Vigil theocracy.',
    rules: [
      {
        id: 'ash_storm_navigation',
        name: 'Ash Storm Navigation',
        type: 'travel',
        description: 'Volcanic vents erupt, filling the sky with blinding black ash.',
        resolution: {
          skill: 'Perception (hearing/smell)',
          dc: 14,
          success: 'Party finds shelter or navigates through.',
          failure: 'Party is blinded for 1d4 hours, adding +2d4 hours to travel, and encounters a pyrofiend or ash-wyrm.'
        }
      },
      {
        id: 'sulfur_fumes',
        name: 'Sulfur Fumes & Heat Strain',
        type: 'environmental',
        description: 'Toxic caldera fumes and blistering heat stress the body.',
        trigger: 'Every 24 hours spent in the volcanic plains.',
        resolution: {
          protection: 'Wearing a wet cloth or a sulfur-filter mask grants immunity to the fumes.',
          save: 'Constitution',
          dc: '11 + hours traveled',
          success: 'No effect.',
          failure: 'Poisoned condition for 24 hours (disadvantage on attack rolls and ability checks).'
        }
      },
      {
        id: 'labor_levies',
        name: 'Dawn Vigil Levies',
        type: 'faction',
        description: 'Dawn Vigil inquisitors press-gang youth and outlanders into sulfur mine Martyr Brigades.',
        trigger: 'Encountered at volcanic crossroads or sulfur springs.',
        resolution: {
          options: [
            { path: 'Produce Exemption', skill: 'Deception or Persuasion (DC 13)', success: 'Vigil patrol lets you pass.', failure: 'Patrol demands immediate inspection.' },
            { path: 'Resist', effect: 'Initiates combat with Dawn Vigil Spellguards.' }
          ]
        }
      }
    ]
  },

  iceheart_sea: {
    id: 'iceheart_sea',
    name: 'Iceheart Sea Navigation',
    region: 'iceheart-sea',
    description: 'Navigating city-sized glaciers and permanent storm-lanes under Grand Admiral Mereval's Sea-Charter.',
    rules: [
      {
        id: 'storm_lane_steering',
        name: 'Storm-Lane Steering',
        type: 'travel',
        description: 'Steering a vessel through churning, ice-choked ocean currents.',
        resolution: {
          skill: 'Vehicles (water) or Survival',
          dc: 14,
          success: 'Vessel sails safely.',
          failure: 'Vessel hull takes 2d10 structural damage AND travel segment takes double time.'
        }
      },
      {
        id: 'luck_ledger',
        name: 'The Luck-Ledger Sacrifice',
        type: 'environmental',
        description: 'Tide-Speak spirits demand a toll to keep the ship's rigging from freezing.',
        trigger: 'Entering a freezing gale or dense iceberg field.',
        resolution: {
          sacrifice: 'Throw 1 silver coin per crew member into the ocean.',
          outcome: {
            paid: 'Navigation checks made with advantage for 24 hours.',
            refused: 'Rigging freezes. All Dexterity and ship navigation checks are made with disadvantage until the ship docks.'
          }
        }
      },
      {
        id: 'mereval_press_warrants',
        name: 'Board of Trade Press-Warrants',
        type: 'faction',
        description: 'Mereval Board of Trade ironclads patrol the lanes, pressing unregistered sailors into service.',
        trigger: 'Spotted by Syndicate ironclads.',
        resolution: {
          requirement: 'Show valid Board of Trade Registry.',
          options: [
            { path: 'Registry', effect: 'Present papers. Safe to pass.' },
            { path: 'Evade', skill: 'Sail / Steering (DC 15)', success: 'Outmaneuvered the ironclad in the fog.', failure: 'Vessel boarded. Crew must pay a 10 gold fine or fight.' }
          ]
        }
      }
    ]
  },

  cragjaw_peaks: {
    id: 'cragjaw_peaks',
    name: 'Cragjaw Peaks Exploration',
    region: 'cragjaw-peaks',
    description: 'A vertical maze of howling blizzards and bottomless chasms, governed by Tesshan's Knotted Decree.',
    rules: [
      {
        id: 'khipu_navigation',
        name: 'Khipu-Knot Navigation',
        type: 'travel',
        description: 'Navigating paths marked by knotted khipu strings rather than written signage.',
        resolution: {
          skill: 'Investigation or History',
          dc: 12,
          success: 'Correctly interpret the knots. Travel proceeds normally.',
          failure: 'Misread the path, adding +1d4 hours to travel and leading the party to a unstable rope-bridge crossing.'
        }
      },
      {
        id: 'blizzard_ascent',
        name: 'Blizzard Ascent',
        type: 'travel',
        description: 'Scaling vertical ice walls while battered by heavy snow-veils.',
        resolution: {
          skill: 'Athletics',
          dc: 14,
          success: 'Secure climb.',
          failure: 'Slip. Character falls 2d10 feet (caught by climbing rope if anchored, otherwise falling into the chasm; takes cold and bludgeoning damage).'
        }
      },
      {
        id: 'mita_labor_exhaustion',
        name: 'The Mit'a Strain',
        type: 'environmental',
        description: 'Low oxygen levels and heavy steam-drafts from geothermal vents exhaust travelers.',
        trigger: 'Every 24 hours spent above the chasm floors.',
        resolution: {
          save: 'Constitution',
          dc: '13 + altitude level (1-3)',
          success: 'No effect.',
          failure: 'Gain 1 level of exhaustion.'
        }
      }
    ]
  },

  bryngloom_forest: {
    id: 'bryngloom_forest',
    name: 'Bryngloom Forest Exploration',
    region: 'bryngloom-forest',
    description: 'A twilight ironwood canopy and peat-bog governed by legalistic debt-covenants.',
    rules: [
      {
        id: 'peat_bog_sinks',
        name: 'Peat-Bog Sinks',
        type: 'travel',
        description: 'Hidden peat-quagmires that swallow travelers who stray from the roots.',
        resolution: {
          requirement: 'Requires a Morren guide OR active Survival check (DC 13) to spot sink-pools.',
          success: 'On course.',
          failure: 'One random party member sinks into the peat-mud. Requires an Athletics check (DC 14) from an ally to pull them out, or the sinking character takes 1 level of exhaustion and loses one random piece of gear.'
        }
      },
      {
        id: 'debt_covenant_audit',
        name: 'Debt-Covenant Audit',
        type: 'environmental',
        description: 'The Keeper of the Last Threshold enforces the legal terms of all active covenants.',
        trigger: 'Violating a local contract, telling a direct lie, or failing to pay a toll.',
        resolution: {
          save: 'Spirit',
          dc: 15,
          success: 'Audit resolved with minor spiritual strain.',
          failure: 'Marked by the Great Registry. The character takes the "Audit-Cursed" status (cannot benefit from healing spells until they perform a restitution ritual at the Scriptorium).'
        }
      },
      {
        id: 'toll_dike_inspection',
        name: 'Toll-Dike Gateways',
        type: 'faction',
        description: 'Morrath inspectors check Registry logs at the living-ironwood Toll-Dikes.',
        trigger: 'Crossing major waterways or entering Atropolis territory.',
        resolution: {
          requirement: 'Pay the peat-debt bond (2 silver) or present an exemption registry.',
          options: [
            { path: 'Pay Toll', effect: 'Pay 2 silver. Gate opens.' },
            { path: 'Contract Loophole', skill: 'History or Persuasion (DC 14)', success: 'Argued a legal exemption under the First Contract.', failure: 'Toll doubled; failure to pay results in the gate summoning a Debt-Revenant warden.' }
          ]
        }
      }
    ]
  },

  lost_brood: {
    id: 'lost_brood',
    name: 'The Lost Brood',
    region: 'cragjaw-peaks',
    type: 'campaign_arc',
    description: 'A multi-phase campaign arc centered on the Groven broodlings left behind in the Deep Alchemists\' vats during the Vat-Breakers\' revolt ~760 years ago.',
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

export const getExplorationRules = (regionId) => {
  if (!regionId) return null;
  const normalizedId = regionId.toLowerCase().replace(/-/g, '_');
  return EXPLORATION_RULES[normalizedId] || null;
};

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
