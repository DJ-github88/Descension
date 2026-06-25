const frostTexture = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;
const sandTexture = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0.1'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`;
const leafTexture = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0.2'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;
const mossTexture = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0.15'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E")`;
const waveTexture = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02 0.15' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0.1'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;
const caveTexture = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='6' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`;

export const BIOMES = [
  {
    id: 'arctic',
    name: 'Arctic',
    icon: 'fa-snowflake',
    localIcon: 'assets/icons/abilities/Frost/Snowflake.png',
    regionFlavor: {
      regionName: 'Nordhalla',
      curseName: 'Glacier Freeze',
      description: 'The freezing tundra of Nordhalla is locked in eternal glacial stasis under an unmoving, pale sky. The temperature is so low that the cold becomes a physical obstacle, ensuring a severity 1 minimum weather effect at all times.',
      rules: [
        'Perpetual severity 1 minimum weather condition.',
        'Standard exposed torches are extinguished instantly by sub-zero winds.',
        'Taking a short or long rest outside of geothermal volcanic vent areas or insulated shelter requires a Constitution save against a moderate die (d8) or the character suffers 1 level of Exhaustion.'
      ]
    },
    cssVars: {
      '--travel-primary': '#3d6e90',
      '--travel-primary-bright': '#4d8eb5',
      '--travel-primary-dim': 'rgba(61,110,144,0.10)',
      '--travel-accent': '#7a1212',
      '--travel-accent-bright': '#991515',
      '--travel-accent-dim': 'rgba(122,18,18,0.08)',
      '--travel-gold': '#9a6e10',
      '--travel-gold-bright': '#c08a14',
      '--travel-gold-dim': 'rgba(154,110,16,0.10)',
      '--travel-green': '#2b5e1a',
      '--travel-green-bright': '#3a7a24',
      '--travel-green-dim': 'rgba(43,94,26,0.09)',
      '--travel-warn': '#7a4c00',
      '--travel-warn-dim': 'rgba(122,76,0,0.09)',
      '--travel-danger': '#8b1414',
      '--travel-danger-dim': 'rgba(139,20,20,0.08)',
      '--travel-bg': '#faf4e2',
      '--travel-bg-dark': '#ece0c0',
      '--travel-bg-darker': '#e2d4ac',
      '--travel-text': '#1a0f02',
      '--travel-text-faded': '#7a6040',
      '--travel-text-muted': '#a09070',
      '--travel-border': '#b8945a',
      '--travel-border-light': 'rgba(160,120,60,0.25)',
      '--travel-shadow': 'rgba(50,30,10,0.08)',
      '--travel-bg-image': frostTexture,
      '--travel-tab-bg': '#e8dcd0',
      '--travel-tab-active': '#3d6e90',
      '--travel-tab-active-text': '#f0e6d2',
      '--travel-border-pattern': 'repeating-linear-gradient(90deg, rgba(61,110,144,0.08) 0px, rgba(61,110,144,0.08) 8px, transparent 8px, transparent 16px)',
      '--travel-header-font': "'Cinzel', serif",
      '--travel-weather-effect': 'snow'
    },
    theme: {
      borderStyle: 'frost-crystals',
      particleType: 'snow',
      mapLineColor: 'rgba(61,110,144,0.4)',
      mapDotColor: '#3d6e90',
      mapBackground: 'linear-gradient(135deg, #f0f4f8 0%, #e8ecf0 50%, #f0f4f8 100%)'
    },
    weatherTable: [
      { range: [1, 4], name: 'Clear & Cold', severity: 0, navDie: 'd6', envDie: 'd4', gearEffect: 'auto-pass', desc: 'Unlimited visibility. Normal travel.' },
      { range: [5, 9], name: 'Overcast & Windy', severity: 1, navDie: 'd8', envDie: 'd4', gearEffect: 'auto-pass', desc: 'Gusts extinguish torches.' },
      { range: [10, 14], name: 'Light Blizzard', severity: 2, navDie: 'd10', envDie: 'd4', gearEffect: 'advantage', desc: 'Visibility 60 ft. Difficult terrain.' },
      { range: [15, 17], name: 'Heavy Blizzard', severity: 3, navDie: 'd12', envDie: 'd8', gearEffect: 'advantage', desc: 'Visibility 30 ft. Speed halved.' },
      { range: [18, 19], name: 'Whiteout', severity: 4, navDie: 'd20', envDie: 'd10', gearEffect: 'advantage', desc: 'Visibility 10 ft. Shelter or risk exposure.' },
      { range: [20, 20], name: 'Killing Cold', severity: 4, navDie: 'd20', envDie: 'd12', gearEffect: 'advantage', desc: 'Whiteout + exhaustion risk every hour.' }
    ],
    terrainTypes: [
      { id: 'tundra', name: 'Frozen Tundra', speedMod: 1.0, navDie: 'd12', desc: 'Flat, open. Wind exposure.' },
      { id: 'deep-snow', name: 'Deep Snow', speedMod: 0.5, navDie: 'd20', desc: 'Snowshoes negate penalty.' },
      { id: 'ice-sheet', name: 'Ice Sheet', speedMod: 0.75, navDie: 'd10', desc: 'Agility vs easy die (d6) or prone.' }
    ],
    transportModes: [
      { id: 'foot', name: 'On Foot', speed: 1, restEvery: null, restDur: null, desc: 'Standard pace.' },
      { id: 'snowshoe', name: 'Snowshoes', speed: 1, restEvery: null, restDur: null, desc: 'Negates deep snow penalty.' },
      { id: 'dogsled', name: 'Dog Sled', speed: 2, restEvery: 4, restDur: 1, desc: 'Dogs must rest. Cannot cross steep terrain.' },
      { id: 'horse', name: 'Horse', speed: 4, restEvery: 2, restDur: 0.5, desc: 'Leg injury risk on ice.' }
    ],
    encounterTable: [
      { range: [1, 6], type: 'none', label: 'No Encounter', note: 'Uneventful travel. Describe the frozen landscape.' },
      { range: [7, 7], type: 'discovery', label: 'Tracks in Snow', note: 'Survival vs moderate die (d8) to identify.' },
      { range: [8, 8], type: 'combat', label: 'Stel (Glacier Memory)', note: 'Replays death-screams of the frozen. Perception vs moderate die (d8) to resist lure.' },
      { range: [9, 9], type: 'social', label: 'Skald Patrol', note: 'Disposition varies. Persuasion vs challenging die (d10).' },
      { range: [10, 10], type: 'social', label: 'Stranded Traveller', note: 'Exhaustion 2-4. Medicine vs moderate die (d8) to stabilise.' },
      { range: [11, 11], type: 'combat', label: 'Skreika', note: 'Regeneration stopped by fire. Hunts by smell.' },
      { range: [12, 12], type: 'combat', label: 'Rime-Born Frostbound', note: 'Chilling Gaze: Constitution vs moderate die (d8) or paralysed.' },
      { range: [13, 13], type: 'hazard', label: 'Crevasse Field', note: 'Perception vs challenging die (d10) or nearest character falls.' },
      { range: [14, 14], type: 'hazard', label: 'Avalanche', note: 'Agility vs challenging die (d10) or buried.' },
      { range: [15, 15], type: 'combat', label: 'Glacier Wyrm', note: 'Cold breath. Persuasion vs challenging die (d10) + offering to bribe.' },
      { range: [16, 16], type: 'combat', label: 'Prime Stel', note: 'Area chilling ability. Cold immunity.' },
      { range: [17, 17], type: 'discovery', label: 'Frozen Ancestor (Corvid)', note: 'Perception vs challenging die (d10) to spot.' },
      { range: [18, 18], type: 'social', label: 'Bloodhammer Forge-Clan', note: 'Disposition varies.' },
      { range: [19, 19], type: 'combat', label: 'Glacier Wyrm Pack', note: 'Cold breath, pack tactics. Hunts silently in blizzards.' },
      { range: [20, 20], type: 'combat', label: 'Frozen Debt-Revenant', note: 'Buried under ice. Perception vs difficult die (d12) or surprised.' }
    ],
    atmospheres: {
      0: {
        0: ['The tundra is a flat black mirror. Stars burn with unusual clarity at this altitude.', 'A half-moon drags pale shadows across the snowfield. The cold has a texture to it at this hour.', 'Torchlight makes a small warm claim against the dark and loses.'],
        1: ['The sun makes its shallow arc without conviction.', 'Dawn on the tundra is a slow negotiation through stages of grey.', 'At dusk the temperature drops before the light goes.'],
        2: ['The sky is a hard, dry blue. The tundra extends in every direction without feature.', 'Wind off the tundra is steady and purposeful. It simply finds every gap in clothing.', 'The snowfield is blinding in direct light.']
      },
      2: {
        0: ['Snow drives sideways through the torchlight. Visibility has collapsed to perhaps twenty feet.', 'The blizzard has erased the stars and the horizon together.'],
        1: ['Dawn is an approximation. The blizzard diffuses everything into a sourceless grey glow.', 'Whatever light remains at dusk is swallowed within minutes.'],
        2: ['Visibility holds at sixty feet on average, less in gusts.', 'The wind is now a physical presence the party walks through.', 'The light blizzard has been building and shows no sign of peaking.']
      },
      3: {
        0: ['Torchlight dies at ten feet. Visibility beyond arm\'s length is effectively zero.', 'The party moves in a chain. To lose contact is to lose the group in seconds.'],
        1: ['The blizzard makes no distinction between day and night.'],
        2: ['Thirty feet. That is the perimeter of the world.', 'The cold is a presence with intention now.', 'Frostbite is a genuine threat at this level of exposure.']
      },
      4: {
        0: ['There is no visibility. The party exists inside a sphere of noise and cold and absolute white.'],
        1: ['Dawn and dusk do not exist today.'],
        2: ['The world is white noise at volume. Frostbite onset for exposed skin is measured in minutes.', 'Killing Cold. The temperature is below the threshold where clothing provides adequate insulation.']
      }
    }
  },
  {
    id: 'desert',
    name: 'Desert',
    icon: 'fa-sun',
    localIcon: 'assets/icons/abilities/Fire/Sun Symbol.png',
    regionFlavor: {
      regionName: 'Sundale',
      curseName: 'Caldera Ashfall',
      description: 'The scorched badlands of Sundale are choked in thick basalt soot and volcanic debris venting from Emberspire. The air is warm but highly toxic, and fire hazards completely replace standard sandstorms.',
      rules: [
        'All standard navigation and perception checks suffer disadvantage unless wearing alchemical leather respirators.',
        'Sandstorm weather conditions are replaced by Caldera Ashfall, dealing 1d4 fire damage per hour of active travel without protective cloaks.',
        'Water skins evaporate at twice the standard rate; characters must consume double water rations or suffer a level of Exhaustion every 4 hours.'
      ]
    },
    cssVars: {
      '--travel-primary': '#9a6e10',
      '--travel-primary-bright': '#c08a14',
      '--travel-primary-dim': 'rgba(154,110,16,0.10)',
      '--travel-accent': '#7a4c00',
      '--travel-accent-bright': '#a06820',
      '--travel-accent-dim': 'rgba(122,76,0,0.08)',
      '--travel-gold': '#d4a030',
      '--travel-gold-bright': '#e8b840',
      '--travel-gold-dim': 'rgba(212,160,48,0.10)',
      '--travel-green': '#5a7a2a',
      '--travel-green-bright': '#6a9a34',
      '--travel-green-dim': 'rgba(90,122,42,0.09)',
      '--travel-warn': '#8b4000',
      '--travel-warn-dim': 'rgba(139,64,0,0.09)',
      '--travel-danger': '#8b1414',
      '--travel-danger-dim': 'rgba(139,20,20,0.08)',
      '--travel-bg': '#f8f0d8',
      '--travel-bg-dark': '#e8dab8',
      '--travel-bg-darker': '#d8c8a0',
      '--travel-text': '#2a1a02',
      '--travel-text-faded': '#7a6040',
      '--travel-text-muted': '#a09070',
      '--travel-border': '#b8985a',
      '--travel-border-light': 'rgba(160,120,60,0.25)',
      '--travel-shadow': 'rgba(50,30,10,0.08)',
      '--travel-bg-image': sandTexture,
      '--travel-tab-bg': '#f0e4c8',
      '--travel-tab-active': '#9a6e10',
      '--travel-tab-active-text': '#f0e6d2',
      '--travel-border-pattern': 'repeating-linear-gradient(90deg, rgba(154,110,16,0.06) 0px, rgba(154,110,16,0.06) 12px, transparent 12px, transparent 24px)',
      '--travel-header-font': "'Cinzel', serif",
      '--travel-weather-effect': 'sand'
    },
    theme: {
      borderStyle: 'dunes',
      particleType: 'sand',
      mapLineColor: 'rgba(154,110,16,0.4)',
      mapDotColor: '#9a6e10',
      mapBackground: 'linear-gradient(135deg, #f8f0d8 0%, #f0e4c0 50%, #f8f0d8 100%)'
    },
    weatherTable: [
      { range: [1, 4], name: 'Clear & Hot', severity: 0, navDie: 'd4', envDie: 'd6', gearEffect: 'auto-pass', desc: 'Bright sun, easy navigation.' },
      { range: [5, 9], name: 'Hazy & Windy', severity: 1, navDie: 'd8', envDie: 'd6', gearEffect: 'auto-pass', desc: 'Dust in the air, reduced landmarks.' },
      { range: [10, 14], name: 'Sandstorm (Light)', severity: 2, navDie: 'd10', envDie: 'd8', gearEffect: 'advantage', desc: 'Visibility 60 ft, stinging sand.' },
      { range: [15, 17], name: 'Sandstorm (Heavy)', severity: 3, navDie: 'd12', envDie: 'd10', gearEffect: 'advantage', desc: 'Visibility 30 ft, speed halved.' },
      { range: [18, 19], name: 'Haboon (Blackout)', severity: 4, navDie: 'd20', envDie: 'd12', gearEffect: 'advantage', desc: 'Visibility 0, burying sand.' },
      { range: [20, 20], name: 'Killing Heat', severity: 4, navDie: 'd20', envDie: 'd20', gearEffect: 'advantage', desc: 'Metal burns to touch, water doubled.' }
    ],
    terrainTypes: [
      { id: 'hardpack', name: 'Hardpack / Dunes', speedMod: 1.0, navDie: 'd10', desc: 'Firm sand, easy walking.' },
      { id: 'soft-sand', name: 'Soft Sand', speedMod: 0.5, navDie: 'd20', desc: 'Exhausting. Every step sinks.' },
      { id: 'badlands', name: 'Rocky Badlands', speedMod: 0.75, navDie: 'd10', desc: 'Scrambling, canyon navigation.' }
    ],
    transportModes: [
      { id: 'foot', name: 'On Foot', speed: 1, restEvery: null, restDur: null, desc: 'Standard pace. Shade essential.' },
      { id: 'horse', name: 'Horse', speed: 4, restEvery: 2, restDur: 0.5, desc: 'Requires extra water.' },
      { id: 'camel', name: 'Camel', speed: 3, restEvery: 4, restDur: 1, desc: 'Water storage. Endures heat better.' }
    ],
    encounterTable: [
      { range: [1, 6], type: 'none', label: 'No Encounter', note: 'Endless basalt plains, shimmering heat, distant ash-devils.' },
      { range: [7, 7], type: 'discovery', label: 'Ancient Tracks', note: 'Survival vs moderate die (d8) to identify.' },
      { range: [8, 8], type: 'combat', label: 'Cinder-Beast Hatchlings', note: 'Ember damage. Fire or area effects disperse.' },
      { range: [9, 9], type: 'social', label: 'Emberth Thrask Rangers', note: 'Will trade volcanic goods for water and obsidian.' },
      { range: [10, 10], type: 'social', label: 'Solvarn Pilgrims', note: 'Dehydrated, desperate. Medicine vs moderate die (d8) to help.' },
      { range: [11, 11], type: 'combat', label: 'Sun-Husk', note: 'Tremorsense. Survival vs challenging die (d10) to detect.' },
      { range: [12, 12], type: 'combat', label: 'Debt-Revenant', note: 'Rises from ash. Fire and radiant vulnerability.' },
      { range: [13, 13], type: 'hazard', label: 'Basalt Collapse', note: 'Survival vs challenging die (d10) to detect.' },
      { range: [14, 14], type: 'hazard', label: 'Ash-Vent Eruption', note: 'Perception vs challenging die (d10) to hear coming.' },
      { range: [15, 15], type: 'combat', label: 'Cinder-Fiend', note: 'Persuasion vs difficult die (d12) to bargain.' },
      { range: [16, 16], type: 'combat', label: 'Ash-Vent Drake', note: 'Ember breath, ash camouflage.' },
      { range: [17, 17], type: 'discovery', label: 'Buried Monolith Fragment', note: 'Perception vs challenging die (d10) to spot.' },
      { range: [18, 18], type: 'social', label: 'Thrask Badland Rangers', note: 'Water dispute.' },
      { range: [19, 19], type: 'combat', label: 'Scrab Swarm', note: 'Armoured carapace, venomous pincers.' },
      { range: [20, 20], type: 'combat', label: 'Husque', note: 'Legendary volcanic predator. Controls ember flow itself.' }
    ],
    atmospheres: {
      0: {
        0: ['The night desert is cold and silent. Stars blaze overhead with intensity that makes the sky feel close.'],
        1: ['Dawn comes fast in the desert. The temperature begins its violent climb immediately.'],
        2: ['The heat is a physical weight. The sun is relentless, pressing down with geological patience.']
      },
      2: {
        0: ['The sandstorm arrives without warning. One moment calm, the next a wall of stinging particles.'],
        1: ['Dawn through a sandstorm is just a slight brightening of the grey-brown haze.'],
        2: ['Visibility drops to arm\'s length. Every exposed inch of skin feels sandblasted.']
      },
      3: { 0: ['The heavy sandstorm has reduced the world to chaos.'], 1: ['No distinction between day and night remains.'], 2: ['Movement is nearly impossible. The sand is a living thing.'] },
      4: { 0: ['A haboon has swallowed the world in sand and darkness.'], 1: ['The sun does not exist today. Only sand.'], 2: ['Killing heat. The ground burns through boot leather.'] }
    }
  },
  {
    id: 'forest',
    name: 'Forest',
    icon: 'fa-tree',
    localIcon: 'assets/icons/abilities/Nature/Stylized Tree.png',
    regionFlavor: {
      regionName: 'Frostwood Reach',
      curseName: 'Memory Decay Mists',
      description: 'The dense, petrified ironwood forests of the Reach are blanketed in a permanent, thick mist. This fog is not weather but a protective curse that insulates the wood from freezing, at the price of slowly eating the memories of all who dwell within.',
      rules: [
        'Every 4 hours of travel, the navigator must succeed on a Wisdom save against a moderate die (d8) or lose their bearings, adding 1d4 hours to the current travel segment.',
        'Characters cannot naturally recover spell slots or high-tier resource points during a short rest in the open woods; the fog diffuses mental focus.',
        'When writing or consulting records, characters gain advantage on History checks to counteract the mist\'s memory decay.'
      ]
    },
    cssVars: {
      '--travel-primary': '#2b5e1a',
      '--travel-primary-bright': '#3a7a24',
      '--travel-primary-dim': 'rgba(43,94,26,0.10)',
      '--travel-accent': '#4a3a10',
      '--travel-accent-bright': '#6a5420',
      '--travel-accent-dim': 'rgba(74,58,16,0.08)',
      '--travel-gold': '#8a7020',
      '--travel-gold-bright': '#a89030',
      '--travel-gold-dim': 'rgba(138,112,32,0.10)',
      '--travel-green': '#2b5e1a',
      '--travel-green-bright': '#3a7a24',
      '--travel-green-dim': 'rgba(43,94,26,0.09)',
      '--travel-warn': '#5a4a00',
      '--travel-warn-dim': 'rgba(90,74,0,0.09)',
      '--travel-danger': '#6b1414',
      '--travel-danger-dim': 'rgba(107,20,20,0.08)',
      '--travel-bg': '#f0f2e4',
      '--travel-bg-dark': '#dce0c8',
      '--travel-bg-darker': '#c8d0b0',
      '--travel-text': '#1a1f02',
      '--travel-text-faded': '#5a6040',
      '--travel-text-muted': '#809070',
      '--travel-border': '#7a8a5a',
      '--travel-border-light': 'rgba(100,120,70,0.25)',
      '--travel-shadow': 'rgba(30,40,10,0.08)',
      '--travel-bg-image': leafTexture,
      '--travel-tab-bg': '#dce0c8',
      '--travel-tab-active': '#2b5e1a',
      '--travel-tab-active-text': '#f0e6d2',
      '--travel-border-pattern': 'repeating-linear-gradient(90deg, rgba(43,94,26,0.06) 0px, rgba(43,94,26,0.06) 10px, transparent 10px, transparent 20px)',
      '--travel-header-font': "'Cinzel', serif",
      '--travel-weather-effect': 'leaves'
    },
    theme: {
      borderStyle: 'vines',
      particleType: 'leaves',
      mapLineColor: 'rgba(43,94,26,0.4)',
      mapDotColor: '#2b5e1a',
      mapBackground: 'linear-gradient(135deg, #e8f0e4 0%, #d8e4d0 50%, #e8f0e4 100%)'
    },
    weatherTable: [
      { range: [1, 4], name: 'Clear Canopy', severity: 0, navDie: 'd4', envDie: 'd4', gearEffect: 'auto-pass', desc: 'Dappled light, birdsong.' },
      { range: [5, 9], name: 'Overcast & Damp', severity: 1, navDie: 'd8', envDie: 'd4', gearEffect: 'auto-pass', desc: 'Mist between trees, muddy ground.' },
      { range: [10, 14], name: 'Heavy Rain / Fog', severity: 2, navDie: 'd10', envDie: 'd8', gearEffect: 'advantage', desc: 'Visibility 60 ft, trails wash out.' },
      { range: [15, 17], name: 'Thunderstorm', severity: 3, navDie: 'd12', envDie: 'd10', gearEffect: 'advantage', desc: 'Visibility 30 ft, lightning risk.' },
      { range: [18, 19], name: 'Dense Fog / Mist', severity: 4, navDie: 'd20', envDie: 'd8', gearEffect: 'advantage', desc: 'Visibility 10 ft, sounds muffled.' },
      { range: [20, 20], name: 'Ancient Storm', severity: 4, navDie: 'd20', envDie: 'd12', gearEffect: 'advantage', desc: 'Trees fall, flash flooding.' }
    ],
    terrainTypes: [
      { id: 'open-woodland', name: 'Open Woodland', speedMod: 1.0, navDie: 'd8', desc: 'Spaced trees, clear trails.' },
      { id: 'dense-undergrowth', name: 'Dense Undergrowth', speedMod: 0.5, navDie: 'd12', desc: 'Bushwhacking, thorns.' },
      { id: 'rainforest', name: 'Rainforest Floor', speedMod: 0.75, navDie: 'd10', desc: 'Roots, mud, canopy blocks light.' }
    ],
    transportModes: [
      { id: 'foot', name: 'On Foot', speed: 1, restEvery: null, restDur: null, desc: 'Standard pace.' },
      { id: 'horse', name: 'Horse', speed: 4, restEvery: 2, restDur: 0.5, desc: 'Limited by undergrowth density.' }
    ],
    encounterTable: [
      { range: [1, 6], type: 'none', label: 'No Encounter', note: 'Birdsong, dappled light, the creak of ancient ironwood.' },
      { range: [7, 7], type: 'discovery', label: 'Animal Tracks', note: 'Survival vs easy die (d6) to identify.' },
      { range: [8, 8], type: 'combat', label: 'Gref (Face-Stealer)', note: 'Territorial. Shifts appearance; Insight vs challenging die (d10) to detect.' },
      { range: [9, 9], type: 'social', label: 'Mimir Sentinel', note: 'Knows the local canopy. May share trail info.' },
      { range: [10, 10], type: 'social', label: 'Lost Ledger Keeper', note: 'Disoriented, grateful. May know a shortcut.' },
      { range: [11, 11], type: 'combat', label: 'Gambrel (Oath-Hunter)', note: 'Drawn to broken promises. Stealth vs challenging die (d10) to detect.' },
      { range: [12, 12], type: 'combat', label: 'Ironwood Animated Grove', note: 'Guardians of old growth. Fire effective.' },
      { range: [13, 13], type: 'hazard', label: 'Fog Pocket / Thorn Thicket', note: 'Perception vs moderate die (d8) to avoid.' },
      { range: [14, 14], type: 'hazard', label: 'Root Trip / Sinkhole', note: 'Perception vs moderate die (d8) or fall.' },
      { range: [15, 15], type: 'combat', label: 'Unshorn Briaran Raid', note: 'Stealth vs challenging die (d10). Demands fog-repudiation.' },
      { range: [16, 16], type: 'combat', label: 'Fog Stalker', note: 'Web traps in mist, venom.' },
      { range: [17, 17], type: 'discovery', label: 'Wyrd-Nexus / Briaran Shrine', note: 'Arcana vs moderate die (d8) to understand.' },
      { range: [18, 18], type: 'social', label: 'Mimir Canopy Seneschal', note: 'Neutral unless provoked.' },
      { range: [19, 19], type: 'combat', label: 'Gref Pack', note: 'Diseased or Wyrd-warped.' },
      { range: [20, 20], type: 'combat', label: 'Ancient Ironwood Guardian', note: 'Legendary protector of the deep woods. Wyrd-touched.' }
    ],
    atmospheres: {
      0: {
        0: ['The forest at night is a cathedral of sound — owls, insects, the creak of branches.'],
        1: ['Morning light filters through the canopy in long golden shafts. Dew hangs from every leaf.'],
        2: ['The forest floor is dappled with shifting light. The canopy overhead is a ceiling of green and gold.']
      },
      2: {
        0: ['Rain drums on the canopy above. The forest interior smells of wet earth and decaying leaves.'],
        1: ['Dawn through fog reveals trees one by one, then they vanish as the fog reclaims them.'],
        2: ['The trail has become a stream. Mud pulls at boots with every step.']
      },
      3: { 0: ['Lightning splits the sky. Every trunk, branch, and shadow revealed in stark white.'], 1: ['The thunderstorm turns the forest into percussion.'], 2: ['Lightning strikes nearby. The air smells of ozone and scorched wood.'] },
      4: { 0: ['The fog is so thick trees appear as grey ghosts ten feet away.'], 1: ['No light penetrates the mist. Direction is meaningless.'], 2: ['The ancient storm tears branches from trees.'] }
    }
  },
  {
    id: 'swamp',
    name: 'Swamp',
    icon: 'fa-water',
    localIcon: 'assets/icons/abilities/Nature/River Through Forest.png',
    regionFlavor: {
      regionName: 'Bryngloom Forest',
      curseName: 'Bog Preserves',
      description: 'The sinking peat-bogs of the Bryngloom are quiet, damp tombs where the laws of life and death are governed by Neth contract-houses. The acidic water preserves everything, and contract-breaches trigger immediate vegetative backlashes from the peat itself.',
      rules: [
        'Entering deep peat-bogs requires a Strength (Athletics) check against a moderate die (d8) or the traveler is restrained and begins sinking.',
        'Any spoken lie or contract violation in the swamp triggers an immediate bog-tremor, attracting Wyrd-creatures like Debt-Revenants.',
        'Traveling through the swamp without wading-gear requires a Constitution save against a moderate die (d8) every 8 hours or the character contracts Swamp Rot, reducing maximum HP by 1d6 until cured.'
      ]
    },
    cssVars: {
      '--travel-primary': '#3a5a40',
      '--travel-primary-bright': '#4a7a50',
      '--travel-primary-dim': 'rgba(58,90,64,0.10)',
      '--travel-accent': '#5a5820',
      '--travel-accent-bright': '#7a7830',
      '--travel-accent-dim': 'rgba(90,88,32,0.08)',
      '--travel-gold': '#8a8820',
      '--travel-gold-bright': '#a8a430',
      '--travel-gold-dim': 'rgba(138,136,32,0.10)',
      '--travel-green': '#3a6a30',
      '--travel-green-bright': '#4a8a40',
      '--travel-green-dim': 'rgba(58,106,48,0.09)',
      '--travel-warn': '#5a4a00',
      '--travel-warn-dim': 'rgba(90,74,0,0.09)',
      '--travel-danger': '#6b2020',
      '--travel-danger-dim': 'rgba(107,32,32,0.08)',
      '--travel-bg': '#e8ece0',
      '--travel-bg-dark': '#d0d8c0',
      '--travel-bg-darker': '#b8c4a0',
      '--travel-text': '#1a2010',
      '--travel-text-faded': '#5a6048',
      '--travel-text-muted': '#808870',
      '--travel-border': '#6a7a5a',
      '--travel-border-light': 'rgba(90,110,70,0.25)',
      '--travel-shadow': 'rgba(20,30,10,0.08)',
      '--travel-bg-image': mossTexture,
      '--travel-tab-bg': '#d0d8c0',
      '--travel-tab-active': '#3a5a40',
      '--travel-tab-active-text': '#f0e6d2',
      '--travel-border-pattern': 'repeating-linear-gradient(90deg, rgba(58,90,64,0.06) 0px, rgba(58,90,64,0.06) 6px, transparent 6px, transparent 14px)',
      '--travel-header-font': "'Cinzel', serif",
      '--travel-weather-effect': 'mist'
    },
    theme: {
      borderStyle: 'roots',
      particleType: 'mist',
      mapLineColor: 'rgba(58,90,64,0.4)',
      mapDotColor: '#3a5a40',
      mapBackground: 'linear-gradient(135deg, #e0e8d8 0%, #d0dac8 50%, #e0e8d8 100%)'
    },
    weatherTable: [
      { range: [1, 4], name: 'Still & Humid', severity: 0, navDie: 'd6', envDie: 'd4', gearEffect: 'auto-pass', desc: 'Oppressive heat, buzzing insects.' },
      { range: [5, 9], name: 'Drizzle & Mist', severity: 1, navDie: 'd8', envDie: 'd6', gearEffect: 'auto-pass', desc: 'Ground softens, visibility reduced.' },
      { range: [10, 14], name: 'Heavy Rain', severity: 2, navDie: 'd10', envDie: 'd8', gearEffect: 'advantage', desc: 'Water rises, paths flood.' },
      { range: [15, 17], name: 'Monsoon', severity: 3, navDie: 'd12', envDie: 'd10', gearEffect: 'advantage', desc: 'Standing water knee-deep, speed halved.' },
      { range: [18, 19], name: 'Toxic Miasma', severity: 4, navDie: 'd20', envDie: 'd12', gearEffect: 'advantage', desc: 'Poisonous gas, disease save each hour.' },
      { range: [20, 20], name: 'Will-o-Wisp Night', severity: 4, navDie: 'd20', envDie: 'd10', gearEffect: 'advantage', desc: 'Deceptive lights, false paths.' }
    ],
    terrainTypes: [
      { id: 'firm-ground', name: 'Firm Ground', speedMod: 1.0, navDie: 'd8', desc: 'Raised hummocks, boardwalks.' },
      { id: 'shallow-water', name: 'Shallow Water', speedMod: 0.5, navDie: 'd12', desc: 'Wading knee-to-waist deep.' },
      { id: 'deep-bog', name: 'Deep Bog', speedMod: 0.25, navDie: 'd20', desc: 'Swimming or boat required.' }
    ],
    transportModes: [
      { id: 'foot', name: 'On Foot', speed: 1, restEvery: null, restDur: null, desc: 'Standard pace. Watch for sinkholes.' },
      { id: 'horse', name: 'Horse', speed: 4, restEvery: 2, restDur: 0.5, desc: 'Limited on boggy ground.' }
    ],
    encounterTable: [
      { range: [1, 6], type: 'none', label: 'No Encounter', note: 'Standing water, bioluminescent fungi, the drone of peat-bog insects.' },
      { range: [7, 7], type: 'discovery', label: 'Bubbling Mud Pot', note: 'Nature vs moderate die (d8) — hot spring or fungal vent.' },
      { range: [8, 8], type: 'combat', label: 'Spore Swarm', note: 'Toxic spores. Fire or area effects scatter them.' },
      { range: [9, 9], type: 'social', label: 'Vreken Crypt-Speaker', note: 'Lives alone. Knowledgeable but unsettling.' },
      { range: [10, 10], type: 'social', label: 'Drun Outcasts', note: 'Fleeing Neth contract-enforcement. May warn of hazard.' },
      { range: [11, 11], type: 'combat', label: 'Debt-Revenant', note: 'Rises from muck. Hunting a specific broken contract.' },
      { range: [12, 12], type: 'combat', label: 'Cycle-Eater', note: 'Wyrd ambush predator. Perception vs difficult die (d12).' },
      { range: [13, 13], type: 'hazard', label: 'Quicksand / Bog Hole', note: 'Survival vs challenging die (d10) to spot.' },
      { range: [14, 14], type: 'hazard', label: 'Fungal Spore Cloud', note: 'Constitution vs challenging die (d10) or disease.' },
      { range: [15, 15], type: 'combat', label: 'Vreken Over-Lit Triad', note: 'Hush-consumed. Insight vs challenging die (d10).' },
      { range: [16, 16], type: 'combat', label: 'Bog Drake', note: 'Acid spit, amphibious.' },
      { range: [17, 17], type: 'discovery', label: 'Sunken Neth Archive', note: 'Perception vs challenging die (d10) to spot.' },
      { range: [18, 18], type: 'social', label: 'Neth Contract-Enforcer', note: 'Cautious. Intimidation vs challenging die (d10).' },
      { range: [19, 19], type: 'combat', label: 'Hungry Child', note: 'Wyrd-manifestation. Leads party into hazards.' },
      { range: [20, 20], type: 'combat', label: 'Ancient Neth Debt-Walker', note: 'Primordial Neth whose contract was broken. Controls vines and bog.' }
    ],
    atmospheres: {
      0: {
        0: ['The swamp at night is alive with sound — frogs, insects, the splash of something large in water.'],
        1: ['Dawn brings grey light. Mist rises from the water in slow columns.'],
        2: ['The humidity is oppressive. Every surface is damp. Moss hangs from trees in curtains.']
      },
      2: {
        0: ['Rain adds to the standing water. The distinction between ground and water is academic.'],
        1: ['Dawn through swamp fog is an exercise in faith — the path exists but cannot be seen.'],
        2: ['The rain has turned every trail into a stream. Water rises past the ankles.']
      },
      3: { 0: ['Monsoon rain is so heavy it hurts. The swamp is becoming a lake.'], 1: ['Dawn and dusk are both just different shades of grey water.'], 2: ['Knee-deep water with no visible bottom.'] },
      4: { 0: ['The miasma stings the eyes and burns the throat.'], 1: ['Will-o-wisps drift through the trees like wandering stars.'], 2: ['Toxic fog fills every hollow. Something moves in the gas.'] }
    }
  },
  {
    id: 'ocean',
    name: 'Ocean',
    icon: 'fa-anchor',
    localIcon: 'assets/icons/abilities/Nature/Swirling Vortex.png',
    regionFlavor: {
      regionName: 'Iceheart Sea',
      curseName: 'Storm-Cycle Navigation',
      description: 'A violent, freezing sea where the waves never rest. House Mereval bargained for open, unfreezing sea lanes, leaving the ocean in a state of perpetual, churning motion and severe storm-cycles.',
      rules: [
        'Navigators must perform a severe navigation check (Agility vs challenging die, d10) every 4 hours to maintain course through drifting icebergs.',
        'Any character who falls into the freezing water must succeed on a Constitution save against a difficult die (d12) at the start of their turn or be paralyzed by the extreme cold.',
        'Ship repairs take twice as long due to the shifting, violent motion of the waves.'
      ]
    },
    cssVars: {
      '--travel-primary': '#1a3a6e',
      '--travel-primary-bright': '#2a5a9e',
      '--travel-primary-dim': 'rgba(26,58,110,0.10)',
      '--travel-accent': '#0a4a6e',
      '--travel-accent-bright': '#1a6a9e',
      '--travel-accent-dim': 'rgba(10,74,110,0.08)',
      '--travel-gold': '#4a7aa0',
      '--travel-gold-bright': '#6a9ac0',
      '--travel-gold-dim': 'rgba(74,122,160,0.10)',
      '--travel-green': '#2a5a3a',
      '--travel-green-bright': '#3a7a4a',
      '--travel-green-dim': 'rgba(42,90,58,0.09)',
      '--travel-warn': '#5a3a00',
      '--travel-warn-dim': 'rgba(90,58,0,0.09)',
      '--travel-danger': '#6b1414',
      '--travel-danger-dim': 'rgba(107,20,20,0.08)',
      '--travel-bg': '#e8eef4',
      '--travel-bg-dark': '#d0dce8',
      '--travel-bg-darker': '#b8cad8',
      '--travel-text': '#0a1020',
      '--travel-text-faded': '#4a5a70',
      '--travel-text-muted': '#708090',
      '--travel-border': '#5a7a9a',
      '--travel-border-light': 'rgba(70,110,140,0.25)',
      '--travel-shadow': 'rgba(10,20,40,0.08)',
      '--travel-bg-image': waveTexture,
      '--travel-tab-bg': '#d0dce8',
      '--travel-tab-active': '#1a3a6e',
      '--travel-tab-active-text': '#f0e6d2',
      '--travel-border-pattern': 'repeating-linear-gradient(90deg, rgba(26,58,110,0.06) 0px, rgba(26,58,110,0.06) 14px, transparent 14px, transparent 28px)',
      '--travel-header-font': "'Cinzel', serif",
      '--travel-weather-effect': 'rain'
    },
    theme: {
      borderStyle: 'waves',
      particleType: 'rain',
      mapLineColor: 'rgba(26,58,110,0.4)',
      mapDotColor: '#1a3a6e',
      mapBackground: 'linear-gradient(135deg, #d8e4f0 0%, #c8d8e8 50%, #d8e4f0 100%)'
    },
    weatherTable: [
      { range: [1, 4], name: 'Calm Seas', severity: 0, navDie: 'd4', envDie: 'd4', gearEffect: 'auto-pass', desc: 'Following winds, clear horizons.' },
      { range: [5, 9], name: 'Choppy & Breezy', severity: 1, navDie: 'd8', envDie: 'd6', gearEffect: 'auto-pass', desc: 'Rolling waves, spray on deck.' },
      { range: [10, 14], name: 'Rough Seas', severity: 2, navDie: 'd10', envDie: 'd8', gearEffect: 'advantage', desc: 'Large swells, hard to hold course.' },
      { range: [15, 17], name: 'Gale', severity: 3, navDie: 'd12', envDie: 'd10', gearEffect: 'advantage', desc: 'Ship pitches, speed halved.' },
      { range: [18, 19], name: 'Tempest', severity: 4, navDie: 'd20', envDie: 'd12', gearEffect: 'advantage', desc: 'Mountainous waves, damage risk.' },
      { range: [20, 20], name: 'Maelstrom', severity: 4, navDie: 'd20', envDie: 'd20', gearEffect: 'advantage', desc: 'Whirlpool or hurricane.' }
    ],
    terrainTypes: [
      { id: 'open-water', name: 'Open Water', speedMod: 1.0, navDie: 'd6', desc: 'Full sail speed.' },
      { id: 'coastal', name: 'Coastal / Reef', speedMod: 0.5, navDie: 'd10', desc: 'Navigation required. Grounding risk.' },
      { id: 'storm-tossed', name: 'Storm-tossed', speedMod: 0.25, navDie: 'd20', desc: 'Bare steerage way.' }
    ],
    transportModes: [
      { id: 'sailing-ship', name: 'Sailing Ship', speed: 3, restEvery: null, restDur: null, desc: 'Wind-dependent. Halved in calm.' },
      { id: 'galley', name: 'Galley / Warship', speed: 2, restEvery: null, restDur: null, desc: 'Oar-powered. Independent of wind.' },
      { id: 'canoe', name: 'Canoe / Kayak', speed: 2, restEvery: 4, restDur: 1, desc: 'Coastal only.' }
    ],
    encounterTable: [
      { range: [1, 6], type: 'none', label: 'No Encounter', note: 'Rolling waves, salt spray, distant icebergs.' },
      { range: [7, 7], type: 'discovery', label: 'Flotsam / Wreckage', note: 'Perception vs moderate die (d8). May contain survivors or clues.' },
      { range: [8, 8], type: 'combat', label: 'Drowned Spume Raiders', note: 'Board from below. Ember and lightning effective.' },
      { range: [9, 9], type: 'social', label: 'Merchant Vessel', note: 'Will trade supplies.' },
      { range: [10, 10], type: 'social', label: 'Castaway on Driftwood', note: 'Exhaustion 3+. Medicine vs moderate die (d8).' },
      { range: [11, 11], type: 'combat', label: 'Abyssal Leviathan (Fragment)', note: 'Constricting coils, crushing bite. A piece of something larger.' },
      { range: [12, 12], type: 'combat', label: 'Treakous Rift Tendrils', note: 'Whirlpool attack. Flees if dispelled.' },
      { range: [13, 13], type: 'hazard', label: 'Iceberg Drift', note: 'Survival vs challenging die (d10) to navigate.' },
      { range: [14, 14], type: 'hazard', label: 'Reef / Shallows', note: 'Perception vs challenging die (d10) to spot.' },
      { range: [15, 15], type: 'combat', label: 'Merryn Pirate Cutter', note: 'Grappling hooks, boarding action.' },
      { range: [16, 16], type: 'combat', label: 'Myrathil Deep-Born War Party', note: 'Territorial. Nature vs moderate die (d8) to parley.' },
      { range: [17, 17], type: 'discovery', label: 'Uncharted Island', note: 'Nature vs moderate die (d8) to assess.' },
      { range: [18, 18], type: 'social', label: 'Myrathil Breakers-Born Delegation', note: 'Evasive. Intimidation vs challenging die (d10).' },
      { range: [19, 19], type: 'combat', label: 'Abyssal Leviathan (Juvenile)', note: 'Grapple and drag. Athletics vs difficult die (d12).' },
      { range: [20, 20], type: 'combat', label: 'Abyssal Leviathan (Adult)', note: 'Legendary sea creature. Controls currents.' }
    ],
    atmospheres: {
      0: {
        0: ['The night ocean is vast and indifferent. Bioluminescence trails in the wake.'],
        1: ['Dawn paints the horizon in rose and gold. The air smells of salt and freedom.'],
        2: ['Open water in all directions. The horizon is a clean circle.']
      },
      2: {
        0: ['The ship rides swells that grow larger as the hours pass.'],
        1: ['Grey dawn on grey water. The horizon has dissolved into mist.'],
        2: ['The swells are large enough that the deck pitches noticeably.']
      },
      3: { 0: ['The gale screams through the rigging. Waves break over the deck.'], 1: ['Dawn is irrelevant. There is only wind and water.'], 2: ['The ship pitches violently. The crew clings to whatever is bolted down.'] },
      4: { 0: ['The tempest erases the distinction between sea and sky.'], 1: ['There is no up or down, only the struggle to hold on.'], 2: ['The maelstrom pulls at the ship with a force that defies sail and oar.'] }
    }
  },
  {
    id: 'underdark',
    name: 'Underdark',
    icon: 'fa-dungeon',
    localIcon: 'assets/icons/abilities/Nature/Cave Run.png',
    regionFlavor: {
      regionName: 'Cragjaw Peaks',
      curseName: 'Chasm Bridge Hazards',
      description: 'A vertical network of lightless, toxic tunnels and sheer bone bridges spanning bottomless chasms. Miners and travelers must navigate thin arches while breathing sulfurous gases and battling rapid altitude sickness.',
      rules: [
        'Crossing bone spans or rock ledges in high wind requires an Agility save against a moderate die (d8) or the traveler falls, hanging from the edge.',
        'Squeezing through tight basalt cracks requires an Agility or Strength check against a moderate die (d8) or the character becomes stuck and Restrained.',
        'The lack of clean air and rapid altitude changes requires a Constitution save against a moderate die (d8) every 6 hours or the character suffers a -2 penalty to all physical saving throws due to hypoxia.'
      ]
    },
    cssVars: {
      '--travel-primary': '#3a1a5e',
      '--travel-primary-bright': '#5a2a8e',
      '--travel-primary-dim': 'rgba(58,26,94,0.10)',
      '--travel-accent': '#5a1a3e',
      '--travel-accent-bright': '#8a2a5e',
      '--travel-accent-dim': 'rgba(90,26,62,0.08)',
      '--travel-gold': '#6a4a8a',
      '--travel-gold-bright': '#8868a8',
      '--travel-gold-dim': 'rgba(106,74,138,0.10)',
      '--travel-green': '#2a5a4a',
      '--travel-green-bright': '#3a7a6a',
      '--travel-green-dim': 'rgba(42,90,74,0.09)',
      '--travel-warn': '#6a3a00',
      '--travel-warn-dim': 'rgba(106,58,0,0.09)',
      '--travel-danger': '#6b0a2a',
      '--travel-danger-dim': 'rgba(107,10,42,0.08)',
      '--travel-bg': '#e0dce8',
      '--travel-bg-dark': '#c8c0d8',
      '--travel-bg-darker': '#b0a4c4',
      '--travel-text': '#10101a',
      '--travel-text-faded': '#5a5068',
      '--travel-text-muted': '#807890',
      '--travel-border': '#7a6a9a',
      '--travel-border-light': 'rgba(110,90,140,0.25)',
      '--travel-shadow': 'rgba(20,10,40,0.08)',
      '--travel-bg-image': caveTexture,
      '--travel-tab-bg': '#c8c0d8',
      '--travel-tab-active': '#3a1a5e',
      '--travel-tab-active-text': '#f0e6d2',
      '--travel-border-pattern': 'repeating-linear-gradient(90deg, rgba(58,26,94,0.06) 0px, rgba(58,26,94,0.06) 7px, transparent 7px, transparent 15px)',
      '--travel-header-font': "'Cinzel', serif",
      '--travel-weather-effect': 'spores'
    },
    theme: {
      borderStyle: 'runes',
      particleType: 'spores',
      mapLineColor: 'rgba(58,26,94,0.4)',
      mapDotColor: '#3a1a5e',
      mapBackground: 'linear-gradient(135deg, #d8d0e0 0%, #c8c0d0 50%, #d8d0e0 100%)'
    },
    weatherTable: [
      { range: [1, 4], name: 'Stable Cavern', severity: 0, navDie: 'd4', envDie: 'd4', gearEffect: 'auto-pass', desc: 'Even temperature, mapped passages.' },
      { range: [5, 9], name: 'Dripping & Drafty', severity: 1, navDie: 'd8', envDie: 'd6', gearEffect: 'auto-pass', desc: 'Water seepage, distant rumbling.' },
      { range: [10, 14], name: 'Spore Cloud', severity: 2, navDie: 'd10', envDie: 'd8', gearEffect: 'advantage', desc: 'Fungal haze, visibility 60 ft.' },
      { range: [15, 17], name: 'Cave Tremor', severity: 3, navDie: 'd12', envDie: 'd10', gearEffect: 'advantage', desc: 'Falling debris, speed halved.' },
      { range: [18, 19], name: 'Gas Pocket', severity: 4, navDie: 'd20', envDie: 'd12', gearEffect: 'advantage', desc: 'Toxic atmosphere, no breathable air.' },
      { range: [20, 20], name: 'Underdark Collapse', severity: 4, navDie: 'd20', envDie: 'd20', gearEffect: 'advantage', desc: 'Cave-in, lava seep, or far realm incursion.' }
    ],
    terrainTypes: [
      { id: 'carved-tunnel', name: 'Carved Tunnel', speedMod: 1.0, navDie: 'd4', desc: 'Stable, mapped passage.' },
      { id: 'rough-cavern', name: 'Rough Cavern', speedMod: 0.75, navDie: 'd10', desc: 'Uneven floor, stalactites.' },
      { id: 'squeeze', name: 'Squeeze / Crevice', speedMod: 0.25, navDie: 'd20', desc: 'Single file. No large weapons.' }
    ],
    transportModes: [
      { id: 'foot', name: 'On Foot', speed: 1, restEvery: null, restDur: null, desc: 'Standard pace. Light sources essential.' },
      { id: 'mine-cart', name: 'Mine Cart', speed: 3, restEvery: null, restDur: null, desc: 'Fixed routes only. Derailment hazard.' },
      { id: 'cave-beast', name: 'Cave Beast (Ridden)', speed: 2, restEvery: 4, restDur: 1, desc: 'Climbs walls. Animal Handling vs moderate die (d8).' }
    ],
    encounterTable: [
      { range: [1, 6], type: 'none', label: 'No Encounter', note: 'Echoing drip of water, bioluminescent fungi.' },
      { range: [7, 7], type: 'discovery', label: 'Crystal Formation', note: 'Arcana vs moderate die (d8). May have magical properties.' },
      { range: [8, 8], type: 'combat', label: 'Scrab Swarm', note: 'Multi-legged horrors. Fire and area effects disperse.' },
      { range: [9, 9], type: 'social', label: 'Fexric Sump-Miner Patrol', note: 'Suspicious. Persuasion vs challenging die (d10).' },
      { range: [10, 10], type: 'social', label: 'Fugitive (Escaped Alchemy Subject)', note: 'Escaped from Deep Alchemist vats. May bargain knowledge for protection.' },
      { range: [11, 11], type: 'combat', label: 'Crag-Stalker', note: 'Echolocation. Thunder damage disrupts tracking.' },
      { range: [12, 12], type: 'combat', label: 'Fexric Deep Alchemist Patrol', note: 'Chemical weapons. Intelligence vs challenging die (d10).' },
      { range: [13, 13], type: 'hazard', label: 'Toxic Spore Cloud', note: 'Constitution vs challenging die (d10) or hallucinating.' },
      { range: [14, 14], type: 'hazard', label: 'Unstable Ceiling / Chasm Edge', note: 'Perception vs challenging die (d10) to hear cracking.' },
      { range: [15, 15], type: 'combat', label: 'Drall Free-Clan Raid', note: 'Alchemical weapons, dark magic. May take prisoners.' },
      { range: [16, 16], type: 'combat', label: 'Deep-Sump Wyrm', note: 'Burrows through stone. Survival vs difficult die (d12) to detect.' },
      { range: [17, 17], type: 'discovery', label: 'Abandoned Fexric Vat-Chamber', note: 'Investigation vs moderate die (d8). Alchemical residues.' },
      { range: [18, 18], type: 'social', label: 'Thrumm Brood-Circle', note: 'Pacifistic unless threatened. Seismic communication.' },
      { range: [19, 19], type: 'combat', label: 'Debt-Revenant Thralls', note: 'Dominated husks. Will vs difficult die (d12) to resist.' },
      { range: [20, 20], type: 'combat', label: 'Groven Ancestor-Bridge Guardian', note: 'Ancient Groven fused to a calcified span. Its bones control the tunnel around it.' }
    ],
    atmospheres: {
      0: {
        0: ['The Underdark has no true night. Bioluminescent fungi provide a dim blue-green glow. Water drips somewhere with geological patience.'],
        1: ['The concept of dawn has no meaning here. The party wakes by shared watch schedule, not sunlight.'],
        2: ['The tunnel stretches ahead, lit only by the party\'s light sources. Footsteps echo strangely, multiplied and distorted by the stone.']
      },
      2: {
        0: ['Spores drift through the air like slow snow. The smell is organic and faintly sweet.'],
        1: ['The spore cloud thickens. Navigation markers become indistinct.'],
        2: ['The fungal haze is so thick that the party can only see a few feet ahead.']
      },
      3: { 0: ['The tremor sends loose stones rattling down the slopes. The walls groan.'], 1: ['The cave-in may have opened new passages — or sealed old ones.'], 2: ['Falling debris forces the party to press against the walls.'] },
      4: { 0: ['The gas is colourless and odourless at first, then the dizziness begins.'], 1: ['In the gas-filled darkness, shapes seem to move at the edge of vision.'], 2: ['The tunnel is collapsing. Lava seeps through cracks in the floor.'] }
    }
  },
  {
    id: 'steppe',
    name: 'Steppe',
    icon: 'fa-wind',
    localIcon: 'assets/icons/abilities/Nature/Stylized Tree.png',
    regionFlavor: {
      regionName: 'Sundrift Vale',
      curseName: 'Starless Navigation',
      description: 'The wind-swept steppe of Sundrift Vale stretches beneath a permanently dark, starless sky. House Ordavan traded fertile soil for the endless migration, ensuring the steppe\'s grass always returns — but nothing deeper than grass can take root. Travelers navigate by the hum of ancestral burial mounds and the distant glow of Astril crystal-skin.',
      rules: [
        'Navigation checks suffer disadvantage under the starless sky; the ancestral mound-hum provides the only directional reference.',
        'Every 8 hours of travel, the navigator must succeed on a Survival check against a moderate die (d8) or lose the herd-trails, adding 1d3 hours to the travel segment.',
        'Powerful windstorms can strip exposed skin — Constitution save vs moderate die (d8) or suffer 1 level of Exhaustion from wind-chill.'
      ]
    },
    cssVars: {
      '--travel-primary': '#7a6a3a',
      '--travel-primary-bright': '#9a8a5a',
      '--travel-primary-dim': 'rgba(122,106,58,0.10)',
      '--travel-accent': '#5a4a20',
      '--travel-accent-bright': '#7a6a30',
      '--travel-accent-dim': 'rgba(90,74,32,0.08)',
      '--travel-gold': '#b8a060',
      '--travel-gold-bright': '#d4b870',
      '--travel-gold-dim': 'rgba(184,160,96,0.10)',
      '--travel-green': '#506e30',
      '--travel-green-bright': '#6a9a4a',
      '--travel-green-dim': 'rgba(90,122,58,0.09)',
      '--travel-warn': '#8a6a00',
      '--travel-warn-dim': 'rgba(138,106,0,0.09)',
      '--travel-danger': '#8b2020',
      '--travel-danger-dim': 'rgba(139,32,32,0.08)',
      '--travel-bg': '#f0ecd8',
      '--travel-bg-dark': '#e0d8b8',
      '--travel-bg-darker': '#d0c8a0',
      '--travel-text': '#1a1202',
      '--travel-text-faded': '#7a6a40',
      '--travel-text-muted': '#a09070',
      '--travel-border': '#b8a060',
      '--travel-border-light': 'rgba(160,130,70,0.25)',
      '--travel-shadow': 'rgba(40,30,10,0.08)',
      '--travel-bg-image': sandTexture,
      '--travel-tab-bg': '#e0d8b8',
      '--travel-tab-active': '#7a6a3a',
      '--travel-tab-active-text': '#f0e6d2',
      '--travel-border-pattern': 'repeating-linear-gradient(90deg, rgba(122,106,58,0.06) 0px, rgba(122,106,58,0.06) 10px, transparent 10px, transparent 20px)',
      '--travel-header-font': "'Cinzel', serif",
      '--travel-weather-effect': 'wind'
    },
    theme: {
      borderStyle: 'grass',
      particleType: 'wind',
      mapLineColor: 'rgba(122,106,58,0.4)',
      mapDotColor: '#7a6a3a',
      mapBackground: 'linear-gradient(135deg, #e8e4d0 0%, #d8d4c0 50%, #e8e4d0 100%)'
    },
    weatherTable: [
      { range: [1, 4], name: 'Clear & Windy', severity: 0, navDie: 'd6', envDie: 'd4', gearEffect: 'auto-pass', desc: 'Steady gusts, starless sky. Herd-trails visible.' },
      { range: [5, 9], name: 'Overcast & Gusty', severity: 1, navDie: 'd8', envDie: 'd6', gearEffect: 'auto-pass', desc: 'Wind whips grass flat, muffling mound-hum.' },
      { range: [10, 14], name: 'Windstorm', severity: 2, navDie: 'd10', envDie: 'd8', gearEffect: 'advantage', desc: 'Visibility 60 ft. Difficult terrain on open grassland.' },
      { range: [15, 17], name: 'Howling Steppe-Gale', severity: 3, navDie: 'd12', envDie: 'd10', gearEffect: 'advantage', desc: 'Visibility 30 ft. Speech impossible. Speed halved.' },
      { range: [18, 19], name: 'Blackout Gale', severity: 4, navDie: 'd20', envDie: 'd12', gearEffect: 'advantage', desc: 'Visibility 10 ft. Mound-hum silenced. Shelter or exposure risk.' },
      { range: [20, 20], name: 'Wyrd-Wind Night', severity: 4, navDie: 'd20', envDie: 'd20', gearEffect: 'advantage', desc: 'Gale + Hungry Child active hunting. Mounds fall silent.' }
    ],
    terrainTypes: [
      { id: 'open-grassland', name: 'Open Grassland', speedMod: 1.0, navDie: 'd8', desc: 'Flat, open. Wind exposure.' },
      { id: 'tall-grass', name: 'Tall Grass / Lien-Stalks', speedMod: 0.5, navDie: 'd12', desc: 'Vision obscured. Hungry Child territory.' },
      { id: 'mound-terrain', name: 'Mound Terrain', speedMod: 0.75, navDie: 'd10', desc: 'Ancestor mounds. Acoustic navigation bonus.' }
    ],
    transportModes: [
      { id: 'foot', name: 'On Foot', speed: 1, restEvery: null, restDur: null, desc: 'Standard pace.' },
      { id: 'horse', name: 'Horse', speed: 4, restEvery: 2, restDur: 0.5, desc: 'Wind-resistant breeds. Standard steppe mount.' },
      { id: 'herd-beast', name: 'Woolly Herd-Beast', speed: 2, restEvery: 6, restDur: 1, desc: 'Slower but carries cargo. Follows herd-trails.' }
    ],
    encounterTable: [
      { range: [1, 6], type: 'none', label: 'No Encounter', note: 'Endless grey-green grass, the distant hum of ancestor mounds, cold wind.' },
      { range: [7, 7], type: 'discovery', label: 'Herd Tracks', note: 'Survival vs moderate die (d8) to identify.' },
      { range: [8, 8], type: 'combat', label: 'Hungry Child', note: 'Wyrd-shadow predator. Perception vs challenging die (d10) to detect before ambush.' },
      { range: [9, 9], type: 'social', label: 'Ordan Nomad Clan', note: 'Will trade wool and dried meat for tools and salt.' },
      { range: [10, 10], type: 'social', label: 'Lost Pilgrim', note: 'Disoriented without stars. Medicine vs moderate die (d8) to help.' },
      { range: [11, 11], type: 'combat', label: 'Lien', note: 'Crystal-lattice predator. Tremorsense. Survival vs challenging die (d10) to detect.' },
      { range: [12, 12], type: 'combat', label: 'Mound-Awakened Ancestor', note: 'Rises from barrow. Resist slashing.' },
      { range: [13, 13], type: 'hazard', label: 'Collapsing Mound', note: 'Perception vs challenging die (d10) to spot unstable ground.' },
      { range: [14, 14], type: 'hazard', label: 'Lien-Stalk Razorgrass Field', note: 'Agility vs challenging die (d10) or 1d4 slashing per 10 feet.' },
      { range: [15, 15], type: 'combat', label: 'Astril Muren Agent', note: 'Constellation-spirit combat. Persuasion vs difficult die (d12) to bargain.' },
      { range: [16, 16], type: 'combat', label: 'Wyrd-Touched Herd-Beast', note: 'Stampede risk. Animal Handling vs challenging die (d10).' },
      { range: [17, 17], type: 'discovery', label: 'Buried Synod Archive', note: 'Perception vs challenging die (d10) to spot crystal-lattice.' },
      { range: [18, 18], type: 'social', label: 'Unlit Veil Courier', note: 'Evasive. Deception vs challenging die (d10).' },
      { range: [19, 19], type: 'combat', label: 'Hungry Child Pack', note: 'Pack tactics. Hunts only under starless sky.' },
      { range: [20, 20], type: 'combat', label: 'Ancient Mound-Eater', note: 'Legendary steppe predator. Wyrd manifestation that consumes ancestor-hum.' }
    ],
    atmospheres: {
      0: {
        0: ['The steppe at night is utterly dark — no stars, no moon. Only the cold hum of distant burial mounds provides reference.'],
        1: ['Dawn is a slow grey brightening without a sun. The grass seems to lean toward it, then away.'],
        2: ['The sky is a pale, source-less grey. Wind is constant, pushing the tall grass in waves.']
      },
      2: {
        0: ['The windstorm makes the grass roar. The mound-hum is barely perceptible beneath it.'],
        1: ['Grey dawn through wind-driven grass. The herd-trails fill with debris.'],
        2: ['Visibility drops to arm\'s length in the tall grass areas. Sound is reduced to wind-roar.']
      },
      3: { 0: ['The gale howls like something alive. The mound-hum is completely silenced.'], 1: ['Dawn and dusk are indistinguishable behind the wind.'], 2: ['Movement against the wind is exhausting. The steppe is fighting back.'] },
      4: { 0: ['The blackout gale has swallowed the world. Ancestor mounds are silent as graves.'], 1: ['No light penetrates. The Hungry Child hunts openly.'], 2: ['Wyrd-wind carries whispers in dead languages. Something is very, very close.'] }
    }
  }
];

export const getBiome = (biomeId) => BIOMES.find(b => b.id === biomeId);

export const getBiomeWeather = (biomeId, d20Roll) => {
  const biome = getBiome(biomeId);
  if (!biome) return null;
  return biome.weatherTable.find(w => d20Roll >= w.range[0] && d20Roll <= w.range[1]);
};

export const getBiomeEncounter = (biomeId, d20Roll) => {
  const biome = getBiome(biomeId);
  if (!biome) return null;
  return biome.encounterTable.find(e => d20Roll >= e.range[0] && d20Roll <= e.range[1]);
};

export const getAtmosphere = (biomeId, severity, timeOfDay) => {
  const biome = getBiome(biomeId);
  if (!biome) return 'The journey continues.';
  const sevKey = Math.min(severity, 4);
  const band = timeOfDay === 'night' ? 0 : timeOfDay === 'dawn' || timeOfDay === 'dusk' ? 1 : 2;
  const pool = (biome.atmospheres[sevKey] || biome.atmospheres[0])[band] || biome.atmospheres[0][2];
  return pool[Math.floor(Math.random() * pool.length)];
};

export const getEncounterTable = (biomeId) => {
  const biome = getBiome(biomeId);
  return biome ? biome.encounterTable : [];
};

export const updateEncounterRow = (biomeId, index, updates) => {
  const biome = getBiome(biomeId);
  if (!biome || !biome.encounterTable[index]) return false;
  Object.assign(biome.encounterTable[index], updates);
  return true;
};

export const addEncounterRow = (biomeId, row) => {
  const biome = getBiome(biomeId);
  if (!biome) return false;
  biome.encounterTable.push(row);
  return true;
};

export const removeEncounterRow = (biomeId, index) => {
  const biome = getBiome(biomeId);
  if (!biome || index < 0 || index >= biome.encounterTable.length) return false;
  biome.encounterTable.splice(index, 1);
  return true;
};
