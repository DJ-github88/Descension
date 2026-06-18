const ROLLABLE_TABLES = {
  encounters: {
    id: 'encounters',
    name: 'Random Encounters',
    description: 'Generate random combat encounters',
    icon: '⚔️',
    die: 'd20',
    entries: [
      { min: 1, max: 2, result: '2d4 Gref stalk the party through the fog, stealing faces from the dead' },
      { min: 3, max: 4, result: 'A lone Neth contract-enforcer with a ledger of unpaid debts and a cold-iron stylus' },
      { min: 5, max: 6, result: '1d6 Sluagh rise from a fog-choked barrow, hungry for a name to wear' },
      { min: 7, max: 8, result: 'A wounded Augur, forearms carved open, offers a reading in exchange for bandages' },
      { min: 9, max: 10, result: '2d4 Schratling emerge from hollow ironwood, bark-armor and moss-blades' },
      { min: 11, max: 12, result: 'A Scribe-Sentinel patrol (1d4+2), journals chained to their belts, quills ready' },
      { min: 13, max: 14, result: 'An abandoned shrine to a forgotten house — the idol still answers whispered oaths' },
      { min: 15, max: 16, result: '1d4 Grimmstalk drop from the canopy, eyeless and patient' },
      { min: 17, max: 18, result: 'A Marked Vreken trader, lantern-eyes over-lit, will trade anything for raw hush' },
      { min: 19, max: 19, result: 'A Wyrd-bleed opens — fear-stuff given flesh crawls through (roll on magic_effects)' },
      { min: 20, max: 20, result: 'A Sundered Monolith fragment pulses nearby — and something ancient answers the pulse' }
    ]
  },

  treasure: {
    id: 'treasure',
    name: 'Treasure Hoard',
    description: 'Discover what the chest contains',
    icon: '💰',
    die: 'd20',
    entries: [
      { min: 1, max: 3, result: '2d6 × 10 gold marks (Thalren ledger-coin, stamped with a house sigil)' },
      { min: 4, max: 6, result: '1d6 × 10 platinum marks (Neth-mint, accepted at any contract-house)' },
      { min: 7, max: 9, result: 'A cold-iron blade — plain, but it bites the Wyrd and does not lie' },
      { min: 10, max: 12, result: 'A vial of memory-glass (Bryngloom export; inhale to recall a borrowed memory)' },
      { min: 13, max: 14, result: 'A fungal-light lantern (Vreken crypt-light; glows for a century on a single charge)' },
      { min: 15, max: 16, result: 'A chained ledger-tome, half its names still legible — worth a fortune to the right archivist' },
      { min: 17, max: 17, result: 'A Solbrand ember, sealed in obsidian phial — faint warmth, impossibly old' },
      { min: 18, max: 18, result: 'A Neth contract-scroll, unbroken and binding — the terms have not yet been triggered' },
      { min: 19, max: 19, result: 'A Sundered Monolith shard, warm to the touch — campaign-grade relic' },
      { min: 20, max: 20, result: 'A First Contract copy-fragment — powerful enough to Anchor a Neth, dangerous enough to doom them' }
    ]
  },

  weather: {
    id: 'weather',
    name: 'Weather',
    description: 'Determine the day\'s conditions beneath the starless sky',
    icon: '🌫️',
    die: 'd20',
    entries: [
      { min: 1, max: 2, result: 'Still cold — the perpetual dark holds, breath hangs visible, nothing moves' },
      { min: 3, max: 4, result: 'Fog-tide rolls in; visibility cut to 30ft (Frostwood-style)' },
      { min: 5, max: 6, result: 'Light ashfall; the air tastes of sulfur, ranged attacks slightly obscured' },
      { min: 7, max: 8, result: 'A frost-front grinds closer; temperature drops sharply, metal chilled to the touch' },
      { min: 9, max: 10, result: 'Calm overcast; the starless sky presses low and heavy' },
      { min: 11, max: 11, result: 'Damp bog-mist; sounds muffled, trails hard to read' },
      { min: 12, max: 12, result: 'Geothermal inversion; a warm wind rises from the ground itself' },
      { min: 13, max: 13, result: 'Freezing drizzle; ice forms on ironwood, visibility reduced' },
      { min: 14, max: 14, result: 'Heavy ashfall; difficult terrain outdoors, eyes sting (Sundale-drift)' },
      { min: 15, max: 15, result: 'A brief "false dawn" — phosphorescent cloud-banks glow faintly for an hour' },
      { min: 16, max: 16, result: 'Howling wind off the Iceheart Sea; ranged attacks at disadvantage' },
      { min: 17, max: 17, result: 'A hush-fog drifts through; unnatural silence settles, drowsiness creeps in' },
      { min: 18, max: 18, result: 'Blizzard conditions; all travel halved, exposure risk for the unsheltered' },
      { min: 19, max: 19, result: 'A Wyrd-storm crackles overhead; fear-stuff in the air, resolve checks at disadvantage' },
      { min: 20, max: 20, result: 'A Root-Veil aurora — bioluminescent sky-glow, rare and ill-omened; the dead grow restless' }
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
    description: 'Generate the next chamber',
    icon: '🏰',
    die: 'd20',
    entries: [
      { min: 1, max: 2, result: 'Empty chamber — but something is scratched on the walls in a dead script' },
      { min: 3, max: 4, result: 'Creature den (1d4+1 regional Wyrd-beasts)' },
      { min: 5, max: 6, result: 'Trap corridor — pressure plates and cold-iron dart-traps' },
      { min: 7, max: 8, result: 'Riddle-chamber — a ledger-riddle is carved into the sealed door' },
      { min: 9, max: 10, result: 'Vault with a bound guardian (Inquisitor-work, or worse)' },
      { min: 11, max: 12, result: 'Prison cell — 1d4 captives, their memories half-eaten by the fog' },
      { min: 13, max: 14, result: 'Shrine or altar — to Sol, to the Warden, or to something older than either' },
      { min: 15, max: 16, result: 'Natural cavern with a steaming geothermal vent' },
      { min: 17, max: 18, result: 'Archive-room full of crumbling ledger-tomes and chained scribe-desks' },
      { min: 19, max: 19, result: 'Boss chamber — the main threat awaits' },
      { min: 20, max: 20, result: 'A Wyrd-thin vault — reality bleeds at the edges, the seal is cracked' }
    ]
  },

  wilderness: {
    id: 'wilderness',
    name: 'Wilderness Discovery',
    description: 'What the party finds while exploring',
    icon: '🌲',
    die: 'd20',
    entries: [
      { min: 1, max: 2, result: 'Uneventful travel — the cold and the dark hold' },
      { min: 3, max: 4, result: 'Tracks in the frost — a Wyrd-creature passed this way within the hour' },
      { min: 5, max: 6, result: 'A geothermal spring, steaming in the cold' },
      { min: 7, max: 8, result: 'Sunken ruins half-swallowed by peat-bog' },
      { min: 9, max: 10, result: 'A Briaran thorn-grove; the trees watch, and the thorns know your oaths' },
      { min: 11, max: 12, result: 'A hunter\'s blind, recently abandoned — Apex-work, by the spoor-marks' },
      { min: 13, max: 14, result: 'A barrow-mound shrouded in fog; its cairn-symbols match no known house' },
      { min: 15, max: 16, result: 'A road-marker of bog-preserved ironwood, pointing to a holding' },
      { min: 17, max: 18, result: 'A Wyrd-site — fear lingers here, reality dented, the trail reads wrong' },
      { min: 19, max: 19, result: 'A crashed Neth caravan; contract-scrolls and memory-glass scattered' },
      { min: 20, max: 20, result: 'A Sundered Monolith fragment, half-buried and faintly warm' }
    ]
  },

  magic_effects: {
    id: 'magic_effects',
    name: 'Wyrd Surge',
    description: 'Something unpredictable bleeds through',
    icon: '✨',
    die: 'd20',
    entries: [
      { min: 1, max: 1, result: 'All within 30ft flicker — their shadows move wrong for 1 hour' },
      { min: 2, max: 2, result: 'The caster glows with Solbrand-warmth for 1d6 minutes (plainly visible)' },
      { min: 3, max: 3, result: 'The caster\'s next words emerge as a Neth contract-clause — and they bind' },
      { min: 4, max: 4, result: 'Gravity inverts in a 20ft radius for 1 round' },
      { min: 5, max: 5, result: 'The caster may speak only in Vault-Breath whispers for 10 minutes' },
      { min: 6, max: 6, result: 'A target\'s face blurs — they now look like someone the viewer has wronged' },
      { min: 7, max: 7, result: 'Ember-spells heal instead of harm for 1 minute' },
      { min: 8, max: 8, result: 'The caster sees Wyrd-trails for 1 minute (Vreken trail-sight)' },
      { min: 9, max: 9, result: 'A zone of hush-silence (30ft) — no sound for 10 minutes' },
      { min: 10, max: 10, result: 'The caster blinks 1d10×10ft in a random direction' },
      { min: 11, max: 11, result: 'All iron within 30ft runs cold to the touch for 1 round' },
      { min: 12, max: 12, result: 'The caster gains resistance to a random damage type for 1 hour' },
      { min: 13, max: 13, result: 'Time stutters — the caster re-casts the spell as if it had never resolved' },
      { min: 14, max: 14, result: 'A spectral forge-mark brands the caster\'s forearm (Armor +2) for 1 hour' },
      { min: 15, max: 15, result: 'The caster\'s eyes turn lantern-bright (permanent glow; minor social cost)' },
      { min: 16, max: 16, result: 'Everyone in 20ft is gripped by a borrowed ancestral memory (no action, 1 round)' },
      { min: 17, max: 17, result: 'A dead creature within 60ft gasps back with 1 HP' },
      { min: 18, max: 18, result: 'The caster and a target swap bodies for 1 minute' },
      { min: 19, max: 19, result: 'A Wyrd-fear manifests — hostile, 1d6 rounds' },
      { min: 20, max: 20, result: 'The spell resolves as intended, but doubled in effect' }
    ]
  },

  tavern_drink: {
    id: 'tavern_drink',
    name: 'Tavern Specials',
    description: 'What\'s on tap at the local hold',
    icon: '🍺',
    die: 'd12',
    entries: [
      { min: 1, max: 1, result: 'Thrask rotgut — 5 cp, burns going down, warms a border-ranger\'s night' },
      { min: 2, max: 2, result: 'Skald glacier-mead — 1 sp, served near-freezing, bloodline-bitter' },
      { min: 3, max: 3, result: 'Merrowport salt-ale — 3 cp, tastes of the Iceheart, never the same barrel twice' },
      { min: 4, max: 4, result: 'Sundari ash-wine — 2 sp, dark as the caldera, traded by Solvarn caravans' },
      { min: 5, max: 5, result: 'Ordan kumis — 1 sp, sharp and herd-strong, fermented on the drive' },
      { min: 6, max: 6, result: 'Forge-coal stout — 5 cp, thick and warm, an Emberth staple' },
      { min: 7, max: 7, result: 'Hush-reserve fungal tea — 2 sp, glows faintly (Vreken crypt-brew; mildly euphoric)' },
      { min: 8, max: 8, result: 'Bog-peat whiskey — 4 sp, smokes eerily, distilled by the Morren' },
      { min: 9, max: 9, result: 'Memory-glass liqueur — 5 sp, you briefly recall a memory that is not yours' },
      { min: 10, max: 10, result: 'Thorn-blood brandy — 2 gp, warms courage (advantage on next fear save)' },
      { min: 11, max: 11, result: 'The Solbrand Drop — 10 gp, a single sip of stored sun-warmth (restores 1d4 HP)' },
      { min: 12, max: 12, result: 'The House Special — unknown effect (roll d6: 1-2 hush-euphoria, 3-4 memory-loss, 5-6 vitality surge)' }
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
      { min: 3, max: 4, result: 'Tripwire — swinging cold-iron blade (3d6 slashing, DC 14 Dex save)' },
      { min: 5, max: 6, result: 'False floor — 20ft bog-shaft (2d6 bludgeoning, DC 12 Dex save)' },
      { min: 7, max: 8, result: 'Gas vent — hush-spore cloud (DC 14 Con save or drowsy)' },
      { min: 9, max: 10, result: 'Wyrd-glyph of binding — thunder damage (3d8, DC 15 Dex save)' },
      { min: 11, max: 12, result: 'Collapsing ironwood ceiling (4d6 bludgeoning, DC 15 Dex save)' },
      { min: 13, max: 14, result: 'Teleportation circle — sends the victim to a random chamber' },
      { min: 15, max: 16, result: 'Freezing trap — ice encases the feet (DC 14 Str save or restrained)' },
      { min: 17, max: 17, result: 'Rolling basalt boulder — 4d10 bludgeoning or outrun it' },
      { min: 18, max: 18, result: 'Chamber floods with bog-water — 3 rounds to escape or drown' },
      { min: 19, max: 19, result: 'Phantasmal fear — DC 15 Wis save or 4d6 psychic damage' },
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
      { min: 1, max: 1, result: 'A child weeps in the fog — their parent\'s name was eaten, and now no one remembers the parent existed' },
      { min: 2, max: 2, result: 'The Greymark bell tolls at midnight. No one rang it, and the rope is on the other side of a locked door' },
      { min: 3, max: 3, result: 'A Neth pact-weaver begs aid — a contract is broken and the debtor is clawing back out of the bog' },
      { min: 4, max: 4, result: 'A chained ledger surfaces in the Atropolis market — and one of its recorded names is a party member\'s' },
      { min: 5, max: 5, result: 'The Vel-Keth Bayou runs uphill for an hour each dawn, carrying things that should have stayed buried' },
      { min: 6, max: 6, result: 'An old First Contract clause is found sewn into the lining of a purchased cloak' },
      { min: 7, max: 7, result: 'House Thalreth hires the party in secret — Lord Aldren has forgotten where the critical ledger is buried' },
      { min: 8, max: 8, result: 'Mistbarrow is empty at dawn — every cairn excavated overnight, every amber tablet gone' },
      { min: 9, max: 9, result: 'A Marked Vreken swears they remember a life that was never theirs — and the trail leads into the party\'s past' },
      { min: 10, max: 10, result: 'Two Neth contract-houses both produce documents binding the party to opposite oaths' },
      { min: 11, max: 11, result: 'A locked box with no keyhole appears in the party\'s camp — it is warm, and it hums when spoken to' },
      { min: 12, max: 12, result: 'Dreams of a Sundered Monolith no cartographer has recorded plague the party each night' },
      { min: 13, max: 13, result: 'A Minstrel in a border-hall sings a verse, unbidden, that names the party by name' },
      { min: 14, max: 14, result: 'The Solbrand\'s tending-clan has gone silent, and the forge-clans are mobilizing' },
      { min: 15, max: 15, result: 'A Morren caravan arrives at the gate; all are deep in hush-trance and will not wake' },
      { min: 16, max: 16, result: 'Someone is buying all the cold-iron in the region — Inquisitor-quantities, no questions asked' },
      { min: 17, max: 17, result: 'An Astril screams and will not stop — a constellation-spirit died in their blood, and the sky has lost a point of light' },
      { min: 18, max: 18, result: 'A rival expedition is racing for the same Monolith-shard, and their Augur has already read how this ends' },
      { min: 19, max: 19, result: 'The Frozen Archive\'s deepest ice is melting — and Aldren Thalreth the Elder\'s chamber is warming' },
      { min: 20, max: 20, result: 'A Wyrd-bleed tears open — and someone unmistakably familiar steps through, wounded, warning the party to run' }
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
