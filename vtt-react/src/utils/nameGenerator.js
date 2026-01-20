/**
 * Utility for generating random names for characters and rooms
 */

export const RACE_NAMES = {
    generic: [
        'Alaric', 'Elara', 'Kaelen', 'Lyra', 'Thorne', 'Zephyr', 'Myra', 'Valerius', 'Seraphina', 'Galahad',
        'Isobel', 'Caspian', 'Rowena', 'Eamon', 'Sylas', 'Aria', 'Dorian', 'Faelan', 'Gweneth', 'Malachi',
        'Basile', 'Caelum', 'Daenerys', 'Elowen', 'Freyja', 'Gavriel', 'Hestia', 'Icarus', 'Jezebel', 'Kael'
    ],
    nordmark: [
        'Bjorn', 'Astrid', 'Erik', 'Sigrid', 'Olaf', 'Ingrid', 'Thorstein', 'Gudrun', 'Harald', 'Svea',
        'Ragnar', 'Freya', 'Leif', 'Brynhild', 'Gunnar', 'Helga', 'Ivar', 'Solveig', 'Ulf', 'Thyra'
    ],
    corvani: [
        'Corvus', 'Malakor', 'Nocturne', 'Vespera', 'Draven', 'Morwenna', 'Kaelum', 'Nyxia', 'Berylla', 'Thalric',
        'Valerius', 'Silvanus', 'Lysithea', 'Tartarus', 'Erebus', 'Nyx', 'Moros', 'Nemesis', 'Thanatos', 'Acheron'
    ],
    grimheart: [
        'Bram', 'Grita', 'Thorgar', 'Hilda', 'Durnin', 'Marnie', 'Durak', 'Vola', 'Borin', 'Krag',
        'Gloin', 'Dwalin', 'Bofur', 'Bombur', 'Dori', 'Nori', 'Ori', 'Thrain', 'Thror', 'Dain'
    ],
    vheil: [
        'Valerius', 'Aetheris', 'Pharis', 'Lyris', 'Kaelis', 'Vheila', 'Zeryn', 'Elowen', 'Xylo', 'Venya',
        'Aethelred', 'Iolanthe', 'Vhelios', 'Border', 'Thin', 'Veil', 'Misty', 'Ghost', 'Pale', 'Etherea'
    ],
    mimir: [
        'Mimeo', 'Protea', 'Reflex', 'Lumina', 'Echo', 'Sync', 'Fluidis', 'Mallea', 'Chroma', 'Versa',
        'Flux', 'Aether', 'Morph', 'Shifter', 'Facet', 'Prism', 'Glass', 'Mercury', 'Liquid', 'Draft'
    ],
    briaran: [
        'Thorne', 'Briar', 'Fern', 'Moss', 'Leaf', 'Willow', 'Sylvan', 'Flora', 'Bramble', 'Nettle',
        'Rose', 'Thistle', 'Bloom', 'Bark', 'Root', 'Sprout', 'Ivy', 'Holly', 'Oakley', 'Petal'
    ],
    groven: [
        'Rowan', 'Alder', 'Oak', 'Hazel', 'Cedar', 'Taiga', 'Silas', 'Fauna', 'Buck', 'Antler',
        'Forrest', 'Barkley', 'Grove', 'Timber', 'Deep', 'Wild', 'Hunter', 'Stag', 'Doe', 'Fawn'
    ],
    emberth: [
        'Ignis', 'Ash', 'Pyra', 'Cinder', 'Slag', 'Flare', 'Coal', 'Scorch', 'Blaze', 'Ember',
        'Magma', 'Vulcan', 'Burn', 'Soot', 'Heat', 'Inferno', 'Smolder', 'Char', 'Glow', 'Slagworth'
    ],
    vreken: [
        'Fang', 'Claw', 'Talon', 'Swift', 'Hunter', 'Slink', 'Prowl', 'Gnasher', 'Skitter', 'Vrek',
        'Ripper', 'Slasher', 'Snarl', 'Bite', 'Shadow', 'Stalker', 'Leap', 'Grip', 'Maul', 'Vicious'
    ],
    morthel: [
        'Mortis', 'Lazarus', 'Grave', 'Relic', 'Blight', 'Crypta', 'Cadaver', 'Ossein', 'Wraith', 'Skell',
        'Necros', 'Thanatos', 'Bone', 'Dust', 'Pale', 'Hollow', 'Grim', 'Spirit', 'Ghost', 'Remnant'
    ],
    volketh: [
        'Volt', 'Spark', 'Jolt', 'Surge', 'Static', 'Lightning', 'Thunder', 'Blitz', 'Arc', 'Shock',
        'Tesla', 'Galvan', 'Bolt', 'Zap', 'Storm', 'Thunderbolt', 'Energi', 'Flash', 'Strike', 'Current'
    ],
    drennar: [
        'Abyss', 'Crush', 'Heavy', 'Depths', 'Trench', 'Pressure', 'Gorge', 'Sink', 'Weight', 'Benthic',
        'Anchor', 'Deep', 'Crushing', 'Bent', 'Warped', 'Stone', 'Core', 'Tension', 'Force', 'Abyssal'
    ],
    astren: [
        'Nova', 'Cosmos', 'Vesta', 'Rigel', 'Lyra', 'Altair', 'Vega', 'Eclipser', 'Stella', 'Nebula',
        'Orion', 'Sirius', 'Star', 'Space', 'Void', 'Galaxy', 'Astral', 'Starlight', 'Celestial', 'Infinite'
    ]
};

export const SURNAMES = [
    'Stormborn', 'Ironwill', 'Shadowstep', 'Brighthelm', 'Oakheart', 'Stonefist', 'Ravenwing', 'Goldleaf', 'Silverton', 'Deepdell',
    'Thornbush', 'Mistwalker', 'Frostbeard', 'Darkwood', 'Swiftfoot', 'Lightbringer', 'Blackwood', 'Ironfoot', 'Fireheart', 'Earthmender',
    'Nightfall', 'Dawnstar', 'Proudfoot', 'Strongarm', 'Hilltopper', 'Underhill', 'Oakenhollow', 'Goldsmith', 'Riversnake', 'Mountainpeak',
    'Greybeard', 'Skywatcher', 'Rockslider', 'Cloudstrider', 'Waterford', 'Greengrass', 'Stonecutter', 'Moonbeam', 'Sunstrike', 'Starshine',
    'Bloodfist', 'Steelgrip', 'Broadbeam', 'Fairchild', 'Highborn', 'Lowman', 'Wildheart', 'Firebrand', 'Icebreaker', 'Earthshaker'
];

export const ROOM_NAMES = [
    'The Forsaken Keep', 'Dragon\'s Rest', 'Whispering Woods', 'Shadow\'s Edge', 'The Crimson Citadel',
    'Echoes of Eternity', 'The Misting Isles', 'Raven\'s Watch', 'The Iron Bastion', 'Secrets of the Vale',
    'Sunken Temple', 'Celestial Spire', 'The Gilded Hall', 'Frozen Tundra', 'Emerald Sanctuary',
    'The Obsidian Throne', 'Wailing Caverns', 'Crystal Peaks', 'Thunder Ridge', 'The Silver Grove',
    'Ancient Ruins', 'Hidden Sanctum', 'The Burning Desert', 'Stormy Bluffs', 'Golden Valley',
    'The Forsaken Chronicles', 'King\'s Landing', 'The Shattered Realm', 'Mystic Meadows', 'Forgotten Hollow',
    'The Last Bastion', 'Eternal Silence', 'Dread Lord\'s Manor', 'The Glistening Cave', 'Sunlight Pass',
    'Whispering Woods: Raven\'s Watch', 'The Obsidian Throne: Ember\'s Glow', 'Dragon\'s Rest: The Final Hour',
    'The Crimson Citadel: Blood Moon', 'Celestial Spire: Astral Gate', 'The Iron Bastion: Steel Walls'
];

/**
 * Returns a random name from the character names array, optionally based on race
 * @param {string} race - The race ID to get names for
 * @returns {string} A full name (First Last)
 */
export const getRandomCharacterName = (race = 'generic') => {
    const raceId = race?.toLowerCase() || 'generic';
    const firstNames = RACE_NAMES[raceId] || RACE_NAMES.generic;
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
    return `${firstName} ${lastName}`;
};

/**
 * Returns a random name from the room names array
 * @returns {string} A room name
 */
export const getRandomRoomName = () => {
    return ROOM_NAMES[Math.floor(Math.random() * ROOM_NAMES.length)];
};
