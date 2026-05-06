const ROLLABLE_TABLES = {
  encounters: {
    id: 'encounters',
    name: 'Random Encounters',
    description: 'Generate random combat encounters',
    icon: '⚔️',
    die: 'd20',
    entries: [
      { min: 1, max: 2, result: '2d4 Goblins ambush from the trees' },
      { min: 3, max: 4, result: 'A lone wandering merchant with a cart' },
      { min: 5, max: 6, result: '1d6 Skeletons rise from shallow graves' },
      { min: 7, max: 8, result: 'A wounded adventurer asks for help' },
      { min: 9, max: 10, result: '2d6 Wolves circle the camp at dusk' },
      { min: 11, max: 12, result: 'A bandit patrol (1d4+2 bandits)' },
      { min: 13, max: 14, result: 'An abandoned shrine with a cursed idol' },
      { min: 15, max: 16, result: '1d4 Giant Spiders in a web-choked clearing' },
      { min: 17, max: 18, result: 'A friendly traveling bard seeking companionship' },
      { min: 19, max: 19, result: 'An elemental rift — 1d3 elementals emerge' },
      { min: 20, max: 20, result: 'A young dragon surveys from a rocky perch' }
    ]
  },

  treasure: {
    id: 'treasure',
    name: 'Treasure Hoard',
    description: 'Discover what the chest contains',
    icon: '💰',
    die: 'd20',
    entries: [
      { min: 1, max: 3, result: '2d6 × 10 copper pieces' },
      { min: 4, max: 6, result: '2d6 × 10 silver pieces' },
      { min: 7, max: 9, result: '1d6 × 10 gold pieces' },
      { min: 10, max: 12, result: 'A small gemstone worth 50gp' },
      { min: 13, max: 14, result: 'A potion of healing' },
      { min: 15, max: 16, result: 'A scroll with a random spell' },
      { min: 17, max: 17, result: 'A +1 weapon (DM chooses type)' },
      { min: 18, max: 18, result: 'A bag of holding' },
      { min: 19, max: 19, result: 'A rare magic item (DM choice)' },
      { min: 20, max: 20, result: 'A legendary artifact fragment' }
    ]
  },

  weather: {
    id: 'weather',
    name: 'Weather',
    description: 'Determine the day\'s weather',
    icon: '🌤️',
    die: 'd20',
    entries: [
      { min: 1, max: 3, result: 'Clear skies, warm sunshine' },
      { min: 4, max: 5, result: 'Light breeze, scattered clouds' },
      { min: 6, max: 7, result: 'Overcast but dry' },
      { min: 8, max: 9, result: 'Light rain, visibility slightly reduced' },
      { min: 10, max: 11, result: 'Heavy rain, difficult terrain outdoors' },
      { min: 12, max: 13, result: 'Thunderstorm — lightning risk in open areas' },
      { min: 14, max: 15, result: 'Dense fog, visibility 30ft' },
      { min: 16, max: 16, result: 'Snow flurries' },
      { min: 17, max: 17, result: 'Blizzard, all travel halved' },
      { min: 18, max: 18, result: 'High winds, ranged attacks at disadvantage' },
      { min: 19, max: 19, result: 'Hailstorm, 1d3 bludgeoning damage per hour exposed' },
      { min: 20, max: 20, result: 'Magical storm — arcane surges, wild magic checks' }
    ]
  },

  npc_attitude: {
    id: 'npc_attitude',
    name: 'NPC Attitude',
    description: 'Determine an NPC\'s initial disposition',
    icon: '🎭',
    die: 'd20',
    entries: [
      { min: 1, max: 2, result: 'Hostile — immediate aggression' },
      { min: 3, max: 5, result: 'Unfriendly — rude, unhelpful, suspicious' },
      { min: 6, max: 9, result: 'Indifferent — neither friendly nor hostile' },
      { min: 10, max: 13, result: 'Neutral — will hear the party out' },
      { min: 14, max: 17, result: 'Friendly — helpful and warm' },
      { min: 18, max: 19, result: 'Very friendly — offers aid or discounts' },
      { min: 20, max: 20, result: 'Devoted — treats party as old friends' }
    ]
  },

  dungeon_room: {
    id: 'dungeon_room',
    name: 'Dungeon Room',
    description: 'Generate the next dungeon room',
    icon: '🏰',
    die: 'd20',
    entries: [
      { min: 1, max: 2, result: 'Empty room — but something is scratched on the walls' },
      { min: 3, max: 4, result: 'Monster den (1d4+1 creatures of appropriate CR)' },
      { min: 5, max: 6, result: 'Trap corridor — pressure plates and dart traps' },
      { min: 7, max: 8, result: 'Puzzle room — inscribed riddle on the door' },
      { min: 9, max: 10, result: 'Treasure vault with a guardian' },
      { min: 11, max: 12, result: 'Prison cell — 1d4 captives inside' },
      { min: 13, max: 14, result: 'Shrine or altar — divine or profane' },
      { min: 15, max: 16, result: 'Natural cavern with underground stream' },
      { min: 17, max: 18, result: 'Storage room with ancient supplies' },
      { min: 19, max: 19, result: 'Boss chamber — the main threat awaits' },
      { min: 20, max: 20, result: 'Portal room — leads to another plane' }
    ]
  },

  wilderness: {
    id: 'wilderness',
    name: 'Wilderness Discovery',
    description: 'What the party finds while exploring',
    icon: '🌲',
    die: 'd20',
    entries: [
      { min: 1, max: 2, result: 'Nothing of note — uneventful travel' },
      { min: 3, max: 4, result: 'Animal tracks leading to a den' },
      { min: 5, max: 6, result: 'A clear freshwater spring' },
      { min: 7, max: 8, result: 'Ancient ruins overgrown with vines' },
      { min: 9, max: 10, result: 'A fairy ring — stepping inside feels strange' },
      { min: 11, max: 12, result: 'A hunter\'s camp, recently abandoned' },
      { min: 13, max: 14, result: 'A natural cave entrance' },
      { min: 15, max: 16, result: 'A road marker pointing to a nearby settlement' },
      { min: 17, max: 18, result: 'Strange standing stones humming faintly' },
      { min: 19, max: 19, result: 'A crashed caravan — cargo scattered about' },
      { min: 20, max: 20, result: 'A hidden grove with a magical creature' }
    ]
  },

  magic_effects: {
    id: 'magic_effects',
    name: 'Wild Magic Surge',
    description: 'Something unpredictable happens',
    icon: '✨',
    die: 'd20',
    entries: [
      { min: 1, max: 1, result: 'All creatures within 30ft turn blue for 1 hour' },
      { min: 2, max: 2, result: 'The caster glows like a torch for 1d6 minutes' },
      { min: 3, max: 3, result: 'Butterflies pour from the caster\'s sleeves' },
      { min: 4, max: 4, result: 'Gravity reverses in a 20ft radius for 1 round' },
      { min: 5, max: 5, result: 'The caster speaks only in rhymes for 10 minutes' },
      { min: 6, max: 6, result: 'A random creature is polymorphed into a sheep' },
      { min: 7, max: 7, result: 'Fire spells deal cold damage for 1 minute' },
      { min: 8, max: 8, result: 'The caster can see invisible creatures for 1 minute' },
      { min: 9, max: 9, result: 'A zone of silence (30ft) appears for 10 minutes' },
      { min: 10, max: 10, result: 'The caster teleports 1d10×10ft in a random direction' },
      { min: 11, max: 11, result: 'All weapons in 30ft turn into flowers for 1 round' },
      { min: 12, max: 12, result: 'The caster gains resistance to a random damage type' },
      { min: 13, max: 13, result: 'Time rewinds 6 seconds — caster re-casts the spell' },
      { min: 14, max: 14, result: 'A spectral shield appears around the caster (Armor +2)' },
      { min: 15, max: 15, result: 'The caster\'s hair turns white permanently' },
      { min: 16, max: 16, result: 'Everyone in 20ft must dance (no action) for 1 round' },
      { min: 17, max: 17, result: 'A dead creature within 60ft revives with 1 HP' },
      { min: 18, max: 18, result: 'The caster switches bodies with a target for 1 minute' },
      { min: 19, max: 19, result: 'A powerful demon is summoned (hostile) for 1d6 rounds' },
      { min: 20, max: 20, result: 'The spell works as intended, but doubled in effect' }
    ]
  },

  tavern_drink: {
    id: 'tavern_drink',
    name: 'Tavern Specials',
    description: 'What\'s on tap at the local inn',
    icon: '🍺',
    die: 'd12',
    entries: [
      { min: 1, max: 1, result: 'Watered-down ale — 1 cp, tastes like regret' },
      { min: 2, max: 2, result: 'Dwarven stout — 5 cp, thick and hearty' },
      { min: 3, max: 3, result: 'Elven wine — 2 sp, delicate and aromatic' },
      { min: 4, max: 4, result: 'Orcish rotgut — 3 cp, burns on the way down' },
      { min: 5, max: 5, result: 'Halfling honey mead — 1 sp, sweet and golden' },
      { min: 6, max: 6, result: 'Gnomish fizzbrew — 2 sp, tickles the nose' },
      { min: 7, max: 7, result: 'Dragon\'s Breath Whiskey — 5 sp, smoke rises from the glass' },
      { min: 8, max: 8, result: 'Moonlit Lagoon cocktail — 3 sp, glows faintly' },
      { min: 9, max: 9, result: 'Healing herbal tea — 1 gp, restores 1d4 HP' },
      { min: 10, max: 10, result: 'Potion of Courage — 2 gp, advantage on next fear save' },
      { min: 11, max: 11, result: 'Bottomless Goblet — 10 gp, refills once' },
      { min: 12, max: 12, result: 'The House Special — unknown effect (DM rolls d6: 1-2 poison, 3-4 hallucinogen, 5-6 vitality boost)' }
    ]
  },

  traps: {
    id: 'traps',
    name: 'Random Traps',
    description: 'What danger lurks in the corridor',
    icon: '🪤',
    die: 'd20',
    entries: [
      { min: 1, max: 2, result: 'Pressure plate — poisoned darts (2d6 poison, DC 13 Dex save)' },
      { min: 3, max: 4, result: 'Tripwire — swinging blade (3d6 slashing, DC 14 Dex save)' },
      { min: 5, max: 6, result: 'False floor — 20ft pit (2d6 bludgeoning, DC 12 Dex save)' },
      { min: 7, max: 8, result: 'Gas vent — poison cloud (DC 14 Con save or poisoned)' },
      { min: 9, max: 10, result: 'Glyph of warding — thunder damage (3d8 thunder, DC 15 Dex save)' },
      { min: 11, max: 12, result: 'Collapsing ceiling — rocks fall (4d6 bludgeoning, DC 15 Dex save)' },
      { min: 13, max: 14, result: 'Teleportation circle — sends victim to a random room' },
      { min: 15, max: 16, result: 'Freezing trap — ice encases feet (DC 14 Str save or restrained)' },
      { min: 17, max: 17, result: 'Rolling boulder — must outrun or take 4d10 bludgeoning' },
      { min: 18, max: 18, result: 'Room fills with water — 3 rounds to escape or drown' },
      { min: 19, max: 19, result: 'Phantasmal killer — DC 15 Wis save or 4d6 psychic damage' },
      { min: 20, max: 20, result: 'Disintegration trap — DC 17 Dex save or 10d6+40 force damage' }
    ]
  },

  plot_hooks: {
    id: 'plot_hooks',
    name: 'Plot Hooks',
    description: 'Inspire your next adventure',
    icon: '📜',
    die: 'd20',
    entries: [
      { min: 1, max: 1, result: 'A child approaches weeping — their parent was taken by shadows' },
      { min: 2, max: 2, result: 'The town bell rings at midnight, but no one rang it' },
      { min: 3, max: 3, result: 'A wizard\'s familiar begs for help — its master is trapped' },
      { min: 4, max: 4, result: 'A wanted poster bears the face of a party member' },
      { min: 5, max: 5, result: 'The river flows backwards for one hour each dawn' },
      { min: 6, max: 6, result: 'An old map is found sewn into a purchased cloak' },
      { min: 7, max: 7, result: 'A noble hires the party to retrieve a stolen heirloom' },
      { min: 8, max: 8, result: 'The graveyard is empty — every grave has been excavated' },
      { min: 9, max: 9, result: 'A talking animal claims to be a cursed prince' },
      { min: 10, max: 10, result: 'Two factions both claim the party as allies' },
      { min: 11, max: 11, result: 'A locked box with no keyhole surfaces in a market stall' },
      { min: 12, max: 12, result: 'Dreams of a tower that doesn\'t yet exist plague the party' },
      { min: 13, max: 13, result: 'A bard sings a prophecy that names the party' },
      { min: 14, max: 14, result: 'The local temple\'s god has gone silent' },
      { min: 15, max: 15, result: 'A merchant caravan arrives with everyone asleep and won\'t wake' },
      { min: 16, max: 16, result: 'Someone is buying all the silver in town' },
      { min: 17, max: 17, result: 'Stars begin falling — and each impact leaves a crater' },
      { min: 18, max: 18, result: 'A rival adventuring party is after the same goal' },
      { min: 19, max: 19, result: 'The king\'s crown has been replaced with a fake' },
      { min: 20, max: 20, result: 'A portal opens — your future selves step through, wounded' }
    ]
  }
};

function rollOnTable(tableId) {
  const table = ROLLABLE_TABLES[tableId];
  if (!table) return null;

  const dieSize = parseInt(table.die.replace('d', ''), 10);
  const roll = Math.floor(Math.random() * dieSize) + 1;

  const entry = table.entries.find(e => roll >= e.min && roll <= e.max);
  if (!entry) return null;

  return {
    tableId: table.id,
    tableName: table.name,
    roll,
    result: entry.result,
    die: table.die
  };
}

function getTableList() {
  return Object.values(ROLLABLE_TABLES).map(t => ({
    id: t.id,
    name: t.name,
    description: t.description,
    icon: t.icon,
    die: t.die,
    entryCount: t.entries.length
  }));
}

export { ROLLABLE_TABLES, rollOnTable, getTableList };
