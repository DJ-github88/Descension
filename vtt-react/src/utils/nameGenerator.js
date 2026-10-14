/**
 * Mythrill VTT - Cultural Name Generator
 *
 * Designed for 1 to 4 punchy, characterful words without hyphenated clutter.
 * Guarantees REAL, BELIEVABLE personal first names partitioned by gender
 * (female, male, none/other) with authentic cultural surnames and occasional
 * fun, quirky adventurer titles (e.g. "Big Iron Fist Jeff", "Sweet Silver Tongue Bess").
 */

// ============================================================================
// 1. QUIRKY & CHARACTERFUL ADVENTURER NAMES & NICKNAMES BY GENDER
// ============================================================================

export const QUIRKY_FIRST_NAMES = {
    male: ['Jeff', 'Ned', 'Barnaby', 'Fritz', 'Gull', 'Muck', 'Jop', 'Tuck', 'Burl', 'Jem', 'Hobb', 'Pug', 'Tad', 'Jack', 'Bram'],
    female: ['Bess', 'Pip', 'Kit', 'Wren', 'Tess', 'Molly', 'Nell', 'Meg', 'Dot', 'Polly', 'Trudy', 'Faye', 'Cora', 'Bea'],
    none: ['Kit', 'Pip', 'Wren', 'Grit', 'Fen', 'Robin', 'Jem', 'Tad', 'Grey', 'Ash', 'Blue', 'Jop']
};

export const QUIRKY_NICKNAMES = [
    'Big', 'Little', 'Old', 'Young', 'Lucky', 'Grim', 'Rusty', 'Slick', 'Sour',
    'Sweet', 'Mad', 'Heavy', 'Stubborn', 'Brave', 'Quiet', 'Loud', 'Wild', 'Crooked',
    'Clean', 'Red', 'Grey', 'Pale', 'Iron Fist', 'Two Coin', 'One Eye',
    'Quick', 'Hard', 'Cold', 'Sharp', 'Grand', 'Fair', 'Good', 'Honest'
];

export const GENDER_TITLES = {
    male: ['Lord', 'Sir', 'Brother', 'Father', 'Captain', 'Master', 'Warden', 'Judge', 'Hunter', 'Smith'],
    female: ['Lady', 'Dame', 'Sister', 'Mother', 'Captain', 'Mistress', 'Warden', 'Judge', 'Hunter', 'Weaver'],
    none: ['Captain', 'Warden', 'Judge', 'Scholar', 'Speaker', 'Watcher', 'Keeper', 'Scout', 'Guide']
};

export const QUIRKY_LEGENDARY_TITLES = {
    male: [
        'Big Iron Fist', 'Old Stone Horn', 'Lucky Two Coin', 'Grim Cold Iron',
        'Rusty Clock Gear', 'Mad Red Flame', 'Big Bear Claw', 'Old White Beard',
        'Slick Fast Hand', 'Hard Iron Head'
    ],
    female: [
        'Sweet Silver Tongue', 'Little Sharp Thorn', 'Fair Sea Wave', 'Swift Wind Foot',
        'Bright Star Eye', 'Golden Needle', 'Wild Rose Thorn', 'Red Fjord Wolf',
        'Old Wise Eye', 'Quick Silver Hand'
    ],
    none: [
        'Iron Fist', 'Two Coin', 'Cold Iron', 'Stone Horn', 'Clock Gear',
        'Silver Tongue', 'Sharp Thorn', 'Sea Wave', 'Fast Hand', 'Star Eye'
    ]
};

// ============================================================================
// 2. CULTURAL FIRST NAMES & SURNAMES (ALL REAL SOUNDING NAMES)
// ============================================================================

export const SUBRACE_NAME_DATA = {
    // --- HUMAN PEOPLES ---
    thalren_human: {
        id: 'thalren_human',
        canonicalName: 'Tallyn',
        raceId: 'human',
        firstNames: {
            male: ['Alaric', 'Kaelen', 'Dorian', 'Malachi', 'Eamon', 'Corvus', 'Lucian', 'Cassian', 'Silas', 'Thomas', 'Bram', 'Julian'],
            female: ['Thalra', 'Elowen', 'Rowena', 'Morwenna', 'Isolda', 'Elspeth', 'Brenna', 'Evelyn', 'Verity', 'Maeve', 'Lucinda'],
            neutral: ['Robin', 'Winter', 'Grey', 'Rowan', 'Julian', 'Vale', 'Lark', 'Ash', 'Quill', 'Corin']
        },
        surnames: ['Greymark', 'Thalreth', 'Blackwood', 'Penwood', 'Ledger', 'Inksmith', 'Winterson', 'Crowley', 'Ashford'],
        titles: ['Scribe', 'Archivist', 'Clerk', 'Scholar'],
        epithets: ['the Scribe', 'the Quiet', 'the Pale', 'Grey', 'the Wise']
    },

    skald_human: {
        id: 'skald_human',
        canonicalName: 'Skald',
        raceId: 'human',
        firstNames: {
            male: ['Bjorn', 'Ragnar', 'Ivar', 'Gunnar', 'Thorstein', 'Leif', 'Ulf', 'Halden', 'Harald', 'Erik', 'Olaf', 'Brokk', 'Hakon'],
            female: ['Astrid', 'Sigrid', 'Freya', 'Solveig', 'Brynhild', 'Helga', 'Thyra', 'Ragna', 'Skadi', 'Thora', 'Ingrid', 'Ylva'],
            neutral: ['Rune', 'Frost', 'Storm', 'Bryn', 'Kael', 'Winter', 'Valdemar', 'Stian', 'Torin']
        },
        surnames: ['Skalvyr', 'Bloodhammer', 'Frosthald', 'Grimfell', 'Winterson', 'Rimeguard', 'Stormborn', 'Ironfist'],
        titles: ['Jarl', 'Skald', 'Hunter', 'Captain'],
        epithets: ['the Bear', 'the Red', 'the Cold', 'Iron Fist', 'One Eye', 'the Fierce']
    },

    tessen_human: {
        id: 'tessen_human',
        canonicalName: 'Tessic',
        raceId: 'human',
        firstNames: {
            male: ['Cassian', 'Derrick', 'Valerius', 'Marcus', 'Theron', 'Silas', 'Julian', 'Faustus', 'Anton', 'Titus', 'Severus', 'Corbin'],
            female: ['Coraline', 'Helga', 'Valerie', 'Lucilla', 'Octavia', 'Theodora', 'Sabina', 'Aurelia', 'Faustina', 'Flavia', 'Livia'],
            neutral: ['Corin', 'Valen', 'Ferris', 'Adrian', 'Julian', 'Dorian', 'Silvan', 'Hadrian']
        },
        surnames: ['Tesshan', 'Ironbastion', 'Stonewall', 'Gearwright', 'Coldwell', 'Highwall', 'Pillarton', 'Trenchard'],
        titles: ['Mason', 'Builder', 'Captain', 'Warden'],
        epithets: ['the Wall', 'the Builder', 'Iron Heart', 'the Solid', 'the Hard']
    },

    merryn_human: {
        id: 'merryn_human',
        canonicalName: 'Merryn',
        raceId: 'human',
        firstNames: {
            male: ['Finn', 'Maric', 'Corin', 'Bren', 'Silas', 'Kael', 'Ronin', 'Jorgan', 'Bran', 'Caspar', 'Lochlan', 'Torin'],
            female: ['Lyris', 'Tressa', 'Maeve', 'Coral', 'Delia', 'Moira', 'Isla', 'Nerida', 'Breena', 'Morwen', 'Sanna', 'Merryn'],
            neutral: ['Maren', 'Jory', 'Darragh', 'Corin', 'Kael', 'Rowan', 'Caspar', 'Morgan']
        },
        surnames: ['Merrow', 'Saltmarsh', 'Waveborn', 'Tideswell', 'Storm', 'Oakhaven', 'Cove', 'Brine'],
        titles: ['Captain', 'Sailor', 'Helmsman', 'Corsair'],
        epithets: ['the Sailor', 'the Wave', 'Salt Eye', 'Two Coin', 'the Lucky']
    },

    ordan_human: {
        id: 'ordan_human',
        canonicalName: 'Ordu',
        raceId: 'human',
        firstNames: {
            male: ['Bayar', 'Temur', 'Altan', 'Chuluun', 'Naran', 'Bat', 'Tsolmon', 'Yesun', 'Jargal', 'Khulan', 'Arslan', 'Batu'],
            female: ['Bayarmaa', 'Saran', 'Borte', 'Altana', 'Oyuna', 'Solongo', 'Khaliun', 'Odval', 'Enkhmaa', 'Gua', 'Mandukhai'],
            neutral: ['Temur', 'Altan', 'Tsolmon', 'Batu', 'Naran', 'Khasar', 'Chuluun']
        },
        surnames: ['Ordavan', 'Steppeson', 'Windrider', 'Falconer', 'Batu', 'Altan', 'Munkh', 'Khan'],
        titles: ['Khan', 'Rider', 'Falconer', 'Hunter'],
        epithets: ['the Swift', 'Hawk Eye', 'the Singer', 'the Wild', 'the Brave']
    },

    // --- MYRATHIL (TIDEBORN) ---
    deepling_myrathil: {
        id: 'deepling_myrathil',
        canonicalName: 'Nereid Myrathil',
        raceId: 'myrathil',
        firstNames: {
            male: ['Ulvir', 'Abyssus', 'Thalor', 'Bathys', 'Pelagos', 'Nerios', 'Venthis', 'Tethan', 'Gorgon'],
            female: ['Nyxil', 'Saelith', 'Mareth', 'Coral', 'Pearl', 'Tethys', 'Calypso', 'Vespera', 'Liriel'],
            neutral: ['Maren', 'Thalor', 'Kaelen', 'Pelagos', 'Dorian', 'Valen', 'Nerios']
        },
        surnames: ['Deepwell', 'Abyssal', 'Tideborn', 'Blackwater', 'Sunless', 'Coldtide', 'Trenchman'],
        titles: ['Listener', 'Oracle', 'Diver', 'Seer'],
        epithets: ['the Deep', 'the Silent', 'Blind Eye', 'Deep Ear', 'the Trench']
    },

    shoreling_myrathil: {
        id: 'shoreling_myrathil',
        canonicalName: 'Corali Myrathil',
        raceId: 'myrathil',
        firstNames: {
            male: ['Pelagios', 'Saltis', 'Brekka', 'Zale', 'Thalor', 'Caspian', 'Corin', 'Kaelen'],
            female: ['Saelith', 'Coralli', 'Mireen', 'Thalassa', 'Zephira', 'Marise', 'Ondina', 'Thetis'],
            neutral: ['Maren', 'Zale', 'Caspian', 'Corin', 'Shelby', 'Gale', 'Jory']
        },
        surnames: ['Salthinge', 'Coralis', 'Shorelight', 'Tideborn', 'Spindrift', 'Shellsong', 'Whitecrest'],
        titles: ['Trader', 'Singer', 'Weaver', 'Guide'],
        epithets: ['the Pearl', 'the Shell', 'Salt Eye', 'the Bright', 'the Reef']
    },

    riverling_myrathil: {
        id: 'riverling_myrathil',
        canonicalName: 'Ondine Myrathil',
        raceId: 'myrathil',
        firstNames: {
            male: ['Venn', 'Ulvir', 'Karris', 'Fluss', 'Carrow', 'Shannon', 'Avon', 'Ren', 'Calder'],
            female: ['Naida', 'Lyndra', 'Sabrina', 'Clara', 'Linnea', 'Yarra', 'Alba', 'Rilla'],
            neutral: ['Shannon', 'Ren', 'Calder', 'Carrow', 'Avon', 'Maren', 'Jory']
        },
        surnames: ['Saltwalker', 'Riverton', 'Reedman', 'Deltason', 'Clearwater', 'Rapids', 'Mirror'],
        titles: ['Guide', 'Scout', 'Fisher', 'Ranger'],
        epithets: ['the Swift', 'the Walker', 'Clear Water', 'the River', 'Reed Foot']
    },

    // --- MIMIR (VALE MASK-FOLK) ---
    veiled_mimir: {
        id: 'veiled_mimir',
        canonicalName: 'Arch Mimir',
        raceId: 'mimir',
        firstNames: {
            male: ['Vaelith', 'Mimeo', 'Reflex', 'Argent', 'Lucian', 'Seren', 'Vitrius', 'Cassian'],
            female: ['Lumina', 'Protea', 'Chroma', 'Fluidis', 'Versa', 'Mirabilis', 'Lucida', 'Vespera'],
            neutral: ['Valen', 'Miran', 'Seren', 'Lucian', 'Argent', 'Corin', 'Dorian']
        },
        surnames: ['Threadmaker', 'Glassman', 'Clearwater', 'Silverwood', 'Crown', 'Highwood', 'Veil'],
        titles: ['Speaker', 'Scholar', 'Reader', 'Elder'],
        epithets: ['the Glass', 'the Mirror', 'the Clear', 'Silver Face', 'the Bright']
    },

    tethered_mimir: {
        id: 'tethered_mimir',
        canonicalName: 'Broken Mimir',
        raceId: 'mimir',
        firstNames: {
            male: ['Tallen', 'Sylas', 'Flint', 'Grit', 'Talon', 'Karr', 'Torin', 'Bram'],
            female: ['Veyra', 'Mallea', 'Fulgor', 'Scour', 'Mist', 'Bess', 'Kit', 'Rowan'],
            neutral: ['Flint', 'Torin', 'Bryn', 'Kael', 'Jem', 'Joss', 'Robin']
        },
        surnames: ['Glasshand', 'Slagborn', 'Stormlantern', 'Cliffside', 'Bellman', 'Groundwalker'],
        titles: ['Artisan', 'Hunter', 'Watchman', 'Smith'],
        epithets: ['the Unmasked', 'Glass Hand', 'the Scrapped', 'Raw Flesh', 'the Grim']
    },

    // --- FLORAE (TREE-BORN EXILES) ---
    viridian_florae: {
        id: 'viridian_florae',
        canonicalName: 'Briaren Florae',
        raceId: 'florae',
        firstNames: {
            male: ['Karr', 'Thorne', 'Briar', 'Bramble', 'Gorse', 'Caltrop', 'Hawthorn', 'Blackthorn'],
            female: ['Rose', 'Nettle', 'Thistle', 'Barba', 'Spina', 'Acantha', 'Vessela', 'Dahlia'],
            neutral: ['Briar', 'Rowan', 'Thorne', 'Hollis', 'Bram', 'Ash', 'Kellan']
        },
        surnames: ['Thornwood', 'Briarclaw', 'Rosespur', 'Needlewood', 'Sharpbough', 'Redpetal'],
        titles: ['Sniper', 'Scout', 'Sentinel', 'Ranger'],
        epithets: ['the Thorn', 'the Sharp', 'Briar Claw', 'Bitter Gorse', 'the Rose']
    },

    florae_unified: {
        id: 'florae_unified',
        canonicalName: 'Oaken Florae',
        raceId: 'florae',
        firstNames: {
            male: ['Sylvan', 'Silas', 'Rowan', 'Oakley', 'Alder', 'Cedric', 'Linden', 'Bough', 'Bram'],
            female: ['Willow', 'Flora', 'Hazel', 'Aspen', 'Ivy', 'Holly', 'Fern', 'Cypress', 'Blossom'],
            neutral: ['Rowan', 'Cedar', 'Alder', 'Linden', 'Ash', 'Oakley', 'Hollis', 'Bram']
        },
        surnames: ['Barker', 'Ironroot', 'Greenleaf', 'Boughman', 'Mosswood', 'Hollowoak', 'Woodward'],
        titles: ['Warden', 'Weaver', 'Keeper', 'Elder'],
        epithets: ['the Oak', 'the Green', 'Wood Head', 'Moss Back', 'Iron Root']
    },

    // --- GROVEN (CRAGJAW SPAN-FOLK) ---
    morgh_groven: {
        id: 'morgh_groven',
        canonicalName: 'Morgh Groven',
        raceId: 'groven',
        firstNames: {
            male: ['Vorr', 'Geth', 'Morgh', 'Krath', 'Bront', 'Gnar', 'Dhorgum', 'Groth', 'Dur Gath', 'Balor'],
            female: ['Ithra', 'Kratha', 'Thruma', 'Bronta', 'Gnara', 'Morghen', 'Vorr Mor', 'Kuld Mor'],
            neutral: ['Bryn', 'Kael', 'Burl', 'Torin', 'Orin', 'Gethin', 'Theron', 'Rowan']
        },
        surnames: ['Stonehorn', 'Craghorn', 'Ironhoof', 'Vatbreaker', 'Deepstone', 'Cragjaw', 'Blackstone'],
        titles: ['Breaker', 'Tender', 'Warden', 'Chief'],
        epithets: ['the Shattered', 'the Horn', 'Big Horn', 'Old Stone', 'Iron Fist']
    },

    ithran_groven: {
        id: 'ithran_groven',
        canonicalName: 'Amordjin Groven',
        raceId: 'groven',
        firstNames: {
            male: ['Ithran', 'Rowan', 'Sylvane', 'Elidyr', 'Oran', 'Tal', 'Gethin', 'Kael'],
            female: ['Ithra', 'Fawn', 'Mistle', 'Rowana', 'Amordja', 'Sylvana', 'Kaelen'],
            neutral: ['Rowan', 'Elidyr', 'Bryn', 'Tal', 'Orin', 'Kaelen', 'Jory']
        },
        surnames: ['Highspan', 'Bridgeford', 'Tollman', 'Frostmaw', 'Fairspan', 'Dunhoof', 'Cablewright'],
        titles: ['Toll Keeper', 'Diplomat', 'Weaver', 'Scout'],
        epithets: ['the Swift', 'Voice of Spans', 'High Hoof', 'the Bridge', 'the Fair']
    },

    // --- SOLARI (SUNDALE FORGE-FOLK) ---
    korr_solari: {
        id: 'korr_solari',
        canonicalName: 'Korr Solari',
        raceId: 'solari',
        firstNames: {
            male: ['Thaeron', 'Ignis', 'Ash', 'Kaessen', 'Vulcan', 'Torin', 'Corin', 'Kael'],
            female: ['Pyra', 'Ember', 'Flama', 'Vesta', 'Cindra', 'Haratha', 'Ashvara'],
            neutral: ['Rowan', 'Ash', 'Ember', 'Solan', 'Dorian', 'Valen', 'Kael']
        },
        surnames: ['Ashford', 'Blacksmith', 'Harath', 'Obsidian', 'Hearthstone', 'Greatforge', 'Basalt'],
        titles: ['Smith', 'Sun Speaker', 'Priest', 'Keeper'],
        epithets: ['the Flame', 'the Ash', 'Hot Coal', 'Iron Anvil', 'the Silent']
    },

    thrask_solari: {
        id: 'thrask_solari',
        canonicalName: 'Anhur Solari',
        raceId: 'solari',
        firstNames: {
            male: ['Vane', 'Helian', 'Zenith', 'Ignacius', 'Lucan', 'Solaris', 'Phaeton', 'Dorian'],
            female: ['Vaelith', 'Auriel', 'Solana', 'Helia', 'Aurelia', 'Zenitha', 'Dahlia'],
            neutral: ['Zenith', 'Solan', 'Valen', 'Dorian', 'Corin', 'Adrian']
        },
        surnames: ['Dawnknight', 'Sunstrike', 'Sunfire', 'Golden', 'Basaltroad', 'Sunblade'],
        titles: ['Knight', 'Scout', 'Hunter', 'Captain'],
        epithets: ['the Dawn', 'the Sun', 'Gold Eye', 'the Radiant', 'Swift Sun']
    },

    // --- MYCELLAN / VREKEN (BRYNGLOOM CRYPT-FOLK) ---
    clean_vreken: {
        id: 'clean_vreken',
        canonicalName: 'Bedel Mycellan',
        raceId: 'vreken',
        firstNames: {
            male: ['Morven', 'Calmor', 'Vraelen', 'Kora', 'Blighton', 'Orven'],
            female: ['Vespera', 'Mycella', 'Mirvael', 'Selina', 'Kora', 'Morwenna'],
            neutral: ['Morren', 'Vren', 'Corin', 'Kaelen', 'Bryn', 'Jory', 'Robin']
        },
        surnames: ['Sunken', 'Graveman', 'Bogwood', 'Veilkeeper', 'Inverted', 'Deepglow'],
        titles: ['Speaker', 'Scholar', 'Priest', 'Healer'],
        epithets: ['Glow Eye', 'the Grave', 'the Pale', 'Amber Eye', 'the Veil']
    },

    marked_vreken: {
        id: 'marked_vreken',
        canonicalName: 'Cromyx Mycellan',
        raceId: 'vreken',
        firstNames: {
            male: ['Orven', 'Vrael', 'Gnasher', 'Ripper', 'Crom', 'Razor', 'Malic', 'Kael'],
            female: ['Vraela', 'Cromyxa', 'Slasher', 'Nyx', 'Morwenna', 'Vespera'],
            neutral: ['Vren', 'Kael', 'Joss', 'Robin', 'Corin', 'Bryn']
        },
        surnames: ['Barbedvow', 'Ghostlight', 'Kinhunter', 'Razorspine', 'Nullsalt', 'Hushbane'],
        titles: ['Inquisitor', 'Hunter', 'Tracker', 'Stalker'],
        epithets: ['the Barbed', 'Iron Claw', 'Spore Nose', 'the Ghost', 'Razor']
    },

    // --- ATHIEN / NETH (PACT-LORDS OF ATROPOLIS) ---
    velun_neth: {
        id: 'velun_neth',
        canonicalName: 'Nethien Athien',
        raceId: 'neth',
        firstNames: {
            male: ['Lucian', 'Titus', 'Vael', 'Aran', 'Saren', 'Cassian', 'Valerius'],
            female: ['Aurelia', 'Vaelis', 'Solyn', 'Ilyth', 'Luren', 'Cassia', 'Octavia', 'Lavinia'],
            neutral: ['Valen', 'Corin', 'Adrian', 'Julian', 'Marin', 'Dorian', 'Caelen']
        },
        surnames: ['Atropolis', 'Chancery', 'Sovereign', 'Ledger', 'Ghostsilk', 'Silverpact'],
        titles: ['Magistrate', 'Comptroller', 'Judge', 'Auditor'],
        epithets: ['Silver Tongue', 'Still Hand', 'Gold Tooth', 'the Scribe', 'the Law']
    },

    kessen_neth: {
        id: 'kessen_neth',
        canonicalName: 'Weft Athien',
        raceId: 'neth',
        firstNames: {
            male: ['Kessen', 'Toris', 'Adrian', 'Julian', 'Corin', 'Valen'],
            female: ['Miren', 'Tapestra', 'Silka', 'Lavinia', 'Octavia', 'Cassia'],
            neutral: ['Kessen', 'Corin', 'Valen', 'Adrian', 'Julian', 'Marin']
        },
        surnames: ['Weftbound', 'Loommaster', 'Seamkeeper', 'Threadmaker', 'Knotlaw'],
        titles: ['Weaver', 'Clerk', 'Artisan', 'Tailor'],
        epithets: ['the Loom', 'the Weaver', 'Fine Thread', 'Tight Knot', 'the Seam']
    },

    drun_neth: {
        id: 'drun_neth',
        canonicalName: 'Riven Athien',
        raceId: 'neth',
        firstNames: {
            male: ['Mor Vereth', 'Drith', 'Dervan', 'Drun', 'Valen', 'Corin'],
            female: ['Dritha', 'Severa', 'Morwenna', 'Nyx', 'Lavinia'],
            neutral: ['Valen', 'Corin', 'Adrian', 'Dorian', 'Kaelen']
        },
        surnames: ['Fraywalker', 'Severed', 'Unbound', 'Contractbreaker', 'Ashwrit', 'Bonewrit'],
        titles: ['Outcast', 'Rebel', 'Fray Walker', 'Wanderer'],
        epithets: ['the Broken', 'the Severed', 'the Unbound', 'Cold Ash', 'the Grey']
    },

    // --- ASTRIL (STARLIGHT ECHO-REFUGEES) ---
    vashir_astril: {
        id: 'vashir_astril',
        canonicalName: 'Lumian Astril',
        raceId: 'astril',
        firstNames: {
            male: ['Vael', 'Kaelen', 'Sirius', 'Altair', 'Orion', 'Rigel', 'Caelum', 'Castor', 'Zenith'],
            female: ['Nova', 'Stella', 'Therra', 'Lyra', 'Vega', 'Vesta', 'Andromeda', 'Selene', 'Electra'],
            neutral: ['Astra', 'Corin', 'Kaelen', 'Valen', 'Solan', 'Zenith', 'Dorian']
        },
        surnames: ['Highwatch', 'Mooncourt', 'Starcrown', 'Celestial', 'Synod', 'Skyborn'],
        titles: ['Scholar', 'Astronomer', 'Oracle', 'Watcher'],
        epithets: ['the Star', 'Bright Eye', 'the Starlight', 'the Beacon', 'Clear Sky']
    },

    silath_astril: {
        id: 'silath_astril',
        canonicalName: 'Kordak Astril',
        raceId: 'astril',
        firstNames: {
            male: ['Orion', 'Rigel', 'Kordak', 'Corin', 'Kael', 'Castor', 'Torin'],
            female: ['Kordaka', 'Stella', 'Nova', 'Lyra', 'Selunis', 'Astra'],
            neutral: ['Corin', 'Kael', 'Torin', 'Valen', 'Dorian', 'Bryn']
        },
        surnames: ['Craterborn', 'Meteor', 'Darkstar', 'Silvereye', 'Fallenstar', 'Ironcrater'],
        titles: ['Warrior', 'Scout', 'Vanguard', 'Hunter'],
        epithets: ['the Comet', 'Iron Fall', 'the Crater', 'Dark Star', 'the Heavy']
    },

    // --- FEX (CLOCKWORK & SUMP ENGINEERS) ---
    kethrin_fexric: {
        id: 'kethrin_fexric',
        canonicalName: 'Brasskin Fex',
        raceId: 'fexrick',
        firstNames: {
            male: ['Brasskin', 'Karr', 'Silas', 'Fritz', 'Barney', 'Jix', 'Ned', 'Burl', 'Jem'],
            female: ['Geara', 'Spring', 'Filament', 'Brassica', 'Tinkera', 'Bess', 'Pip', 'Kit'],
            neutral: ['Kit', 'Pip', 'Jem', 'Tad', 'Fritz', 'Wren', 'Jop', 'Grit', 'Tuck']
        },
        surnames: ['Gearson', 'Firsttinker', 'Frostmaw', 'Turbine', 'Cogswell', 'Wirebeard', 'Springwright'],
        titles: ['Tinker', 'Engineer', 'Smith', 'Horologist'],
        epithets: ['Rusty Gear', 'the Clock', 'Two Wrench', 'Big Valve', 'Iron Cog']
    },

    drall_fexric: {
        id: 'drall_fexric',
        canonicalName: 'Alchemite Fex',
        raceId: 'fexrick',
        firstNames: {
            male: ['Silas', 'Fritz', 'Barney', 'Jix', 'Ned', 'Burl', 'Jem', 'Karr', 'Tad'],
            female: ['Sparkle', 'Scrappa', 'Tinkera', 'Bess', 'Pip', 'Kit', 'Solder Lass'],
            neutral: ['Kit', 'Pip', 'Jem', 'Tad', 'Fritz', 'Wren', 'Jop', 'Grit', 'Tuck']
        },
        surnames: ['Sumpson', 'Tinker', 'Copperbottom', 'Acidvial', 'Freewrench', 'Scrapheir'],
        titles: ['Scavenger', 'Alchemist', 'Tinker', 'Prospector'],
        epithets: ['Rusty Solder', 'Greasy Sparks', 'Acid Hand', 'Two Wrench', 'the Free']
    }
};

// ============================================================================
// 3. CLASS CALLING DATA (PUNCHY SURNAMES, TITLES, COGNOMENS)
// ============================================================================

export const CLASS_NAME_DATA = {
    Animist: {
        titles: ['Shaman', 'Speaker', 'Chanter'],
        surnames: ['Spiritwood', 'Bonechant', 'Windrider', 'Ancestor Eye'],
        epithets: ['the Spirit', 'Bone Chanter', 'Spirit Voice', 'the Shaman']
    },
    Apex: {
        titles: ['Hunter', 'Stalker', 'Tracker'],
        surnames: ['Quietstalker', 'Beastbinder', 'Shadowprowl', 'Silenthunt'],
        epithets: ['the Silent', 'Quiet Stalker', 'Beast Binder', 'the Shadow']
    },
    Arcanoneer: {
        titles: ['Artificer', 'Slinger', 'Smith'],
        surnames: ['Runesmith', 'Sparkslinger', 'Spellwright', 'Canopy'],
        epithets: ['the Spark', 'Rune Smith', 'Spark Slinger', 'the Astrolabe']
    },
    Augur: {
        titles: ['Seer', 'Augur', 'Oracle'],
        surnames: ['Glasseye', 'Fategazer', 'Omenscribe', 'Seer'],
        epithets: ['the Seer', 'Glass Eye', 'Fate Gazer', 'Omen Reader']
    },
    Berserker: {
        titles: ['Berserker', 'Chief', 'Warrior'],
        surnames: ['Bloodhammer', 'Ashhammer', 'Ironsmith', 'Rageforged'],
        epithets: ['Iron Fist', 'the Wild', 'the Fierce', 'Bloodhammer']
    },
    Chronarch: {
        titles: ['Time Keeper', 'Anchor', 'Watcher'],
        surnames: ['Timeweaver', 'Clockmaker', 'Hourglass', 'Frostmaw'],
        epithets: ['the Clock', 'Time Keeper', 'Hour Glass', 'Time Weaver']
    },
    Crusader: {
        titles: ['Knight', 'Crusader', 'Paladin'],
        surnames: ['Dawnknight', 'Sunblade', 'Shieldbearer', 'Solvan'],
        epithets: ['the Shield', 'Dawn Knight', 'Sun Blade', 'the Bold']
    },
    'False Prophet': {
        titles: ['Prophet', 'Voice', 'Herald'],
        surnames: ['Silvervoice', 'Truthbane', 'Heresy', 'Silence'],
        epithets: ['the Whisperer', 'Silver Voice', 'the Prophet', 'the False']
    },
    Gambit: {
        titles: ['Gambler', 'Dealer', 'Rogue'],
        surnames: ['Coinflipper', 'Fatedealer', 'Diceroller', 'Wager'],
        epithets: ['the Lucky', 'Two Coin', 'Dice Roller', 'the Sly']
    },
    Harbinger: {
        titles: ['Harbinger', 'Caller', 'Mage'],
        surnames: ['Doomwalker', 'Riftborn', 'Voidgazer', 'Calamity'],
        epithets: ['the Doom', 'Doom Walker', 'the Rift', 'Void Gazer']
    },
    Inquisitor: {
        titles: ['Inquisitor', 'Judge', 'Bailiff'],
        surnames: ['Coldiron', 'Barbedvow', 'Nullsalt', 'Ledgerhunter'],
        epithets: ['the Barbed', 'Iron Hand', 'Cold Iron', 'the Judge']
    },
    Lunarch: {
        titles: ['Lunarch', 'Warden', 'Regent'],
        surnames: ['Moonhost', 'Crescentward', 'Silverwood', 'Grovehost'],
        epithets: ['the Moon', 'Moon Host', 'Silver Crescent', 'the Pale']
    },
    Martyr: {
        titles: ['Witness', 'Martyr', 'Shield'],
        surnames: ['Scarborn', 'Witness', 'Memorial', 'Furnace'],
        epithets: ['the Scarred', 'the Witness', 'the Shield', 'the Enduring']
    },
    Minstrel: {
        titles: ['Minstrel', 'Chanter', 'Bard'],
        surnames: ['Silvertongue', 'Songsmith', 'Tidechoir', 'Cadence'],
        epithets: ['the Voice', 'Silver Tongue', 'Song Smith', 'the Sweet']
    },
    Plaguebringer: {
        titles: ['Cultivar', 'Healer', 'Doctor'],
        surnames: ['Blightmother', 'Sporetouch', 'Rotbearer', 'Cultivar'],
        epithets: ['the Blight', 'Spore Touch', 'Rot Bearer', 'the Leech']
    },
    Pyrofiend: {
        titles: ['Cabalist', 'Fiend', 'Pyre'],
        surnames: ['Firebrand', 'Crucible', 'Ashenflame', 'Breachfire'],
        epithets: ['the Fire', 'Fire Brand', 'Crucible Born', 'the Hot']
    },
    Revenant: {
        titles: ['Revenant', 'Walker', 'Ghost'],
        surnames: ['Twiceborn', 'Deathless', 'Gravewalker', 'Froststasis'],
        epithets: ['the Twice Born', 'the Deathless', 'Grave Walker', 'the Cold']
    },
    Shaper: {
        titles: ['Shaper', 'Sculptor', 'Carver'],
        surnames: ['Fleshcarver', 'Chromabraid', 'Mender', 'Sculptor'],
        epithets: ['the Shaper', 'Flesh Carver', 'the Mender', 'Chroma Hand']
    },
    Spellguard: {
        titles: ['Guard', 'Shield', 'Warden'],
        surnames: ['Shieldbearer', 'Nullwall', 'Aegis', 'Spellbreaker'],
        epithets: ['the Shield', 'Shield Bearer', 'the Ward', 'Null Wall']
    },
    Toxicologist: {
        titles: ['Apothecary', 'Distiller', 'Brewer'],
        surnames: ['Nightshade', 'Bitterroot', 'Distiller', 'Venomtongue'],
        epithets: ['the Poisoner', 'Bitter Root', 'Nightshade', 'the Sour']
    },
    Warden: {
        titles: ['Warden', 'Bastion', 'Guard'],
        surnames: ['Ironhide', 'Vatbreaker', 'Bastion', 'Graftborn'],
        epithets: ['the Wall', 'Iron Hide', 'Vat Breaker', 'the Heavy']
    }
};

// ============================================================================
// 4. BACKGROUND VOCATIONAL DATA (SIMPLE, GROUNDED VOCATIONS)
// ============================================================================

export const BACKGROUND_NAME_DATA = {
    emberspirePilgrim: { title: 'Pilgrim', surname: 'Ashman', epithet: 'Pilgrim' },
    shyrRunner: { title: 'Runner', surname: 'Shyrman', epithet: 'Courier' },
    ledgerKeeper: { title: 'Auditor', surname: 'Ledger', epithet: 'Book Keeper' },
    bloodlineHeir: { title: 'Heir', surname: 'Highborn', epithet: 'the Heir' },
    synodAcademic: { title: 'Scholar', surname: 'Synod', epithet: 'Star Scribe' },
    sumpsVeteran: { title: 'Veteran', surname: 'Sumpson', epithet: 'Solder Scarred' },
    debtNegotiator: { title: 'Broker', surname: 'Broker', epithet: 'Coin Weigher' },
    frostChanter: { title: 'Chanter', surname: 'Frost', epithet: 'Ice Singer' },
    forgeWright: { title: 'Smith', surname: 'Smith', epithet: 'Anvil Hand' },
    hushSurvivor: { title: 'Survivor', surname: 'Gloom', epithet: 'Gloom Walker' },
    peakTracker: { title: 'Tracker', surname: 'Climber', epithet: 'Cliff Stalker' },
    merrowSailor: { title: 'Sailor', surname: 'Sailor', epithet: 'Salt Stained' },
    gloomwayTrader: { title: 'Trader', surname: 'Bogman', epithet: 'Peat Peddler' },
    shantyRat: { title: 'Scavenger', surname: 'Scraps', epithet: 'Shadow Rat' },
    monolithHunter: { title: 'Hunter', surname: 'Stoneman', epithet: 'Seal Hunter' },
    groveWarden: { title: 'Warden', surname: 'Grove', epithet: 'Root Warden' },
    maskWarden: { title: 'Warden', surname: 'Masker', epithet: 'Dream Tender' },
    vaultScholar: { title: 'Scholar', surname: 'Vault', epithet: 'Flame Reader' },
    herdGuardian: { title: 'Guardian', surname: 'Herder', epithet: 'Mare Warden' },
    starboundScholar: { title: 'Astronomer', surname: 'Starwatcher', epithet: 'Beacon Eye' },
    deepCurrentGuide: { title: 'Guide', surname: 'Pilot', epithet: 'Trench Pilot' },
    fogReader: { title: 'Reader', surname: 'Fogg', epithet: 'Mist Tracker' },
    chasmDelver: { title: 'Delver', surname: 'Chaseman', epithet: 'Abyss Climber' },
    brineTrader: { title: 'Trader', surname: 'Brineman', epithet: 'Shell Trader' },
    keepWarden: { title: 'Warden', surname: 'Keeper', epithet: 'Gate Shield' },
    spanBuilder: { title: 'Builder', surname: 'Bridgeman', epithet: 'Span Builder' },
    contractClerk: { title: 'Clerk', surname: 'Clerk', epithet: 'Seal Checker' },
    obligationBroker: { title: 'Broker', surname: 'Pactman', epithet: 'Debt Weigher' },
    greymarkArchivist: { title: 'Archivist', surname: 'Greymark', epithet: 'Tapestry Scribe' },
    privateer: { title: 'Captain', surname: 'Corsair', epithet: 'the Corsair' },
    nameless: { title: 'Ghost', surname: 'No Name', epithet: 'the Nameless' },
    cryptKeeper: { title: 'Keeper', surname: 'Cryptman', epithet: 'Lantern Bearer' },
    zenithCartographer: { title: 'Cartographer', surname: 'Charter', epithet: 'Sky Mapper' },
    craterVanguard: { title: 'Vanguard', surname: 'Craterman', epithet: 'Meteor Watcher' },
    clockworkHorologist: { title: 'Horologist', surname: 'Clockwright', epithet: 'Cog Turner' },
    vitriolProspector: { title: 'Prospector', surname: 'Prospector', epithet: 'Sump Digger' },
    peatTender: { title: 'Digger', surname: 'Peatman', epithet: 'Bog Digger' },
    petrifiedMason: { title: 'Mason', surname: 'Mason', epithet: 'Stone Cutter' },
    scriptureHerald: { title: 'Herald', surname: 'Herald', epithet: 'Tablet Bearer' },
    quietTraded: { title: 'Hunter', surname: 'Stalker', epithet: 'Still Hunter' },
    trenchListener: { title: 'Listener', surname: 'Deepwell', epithet: 'Deep Ear' },
    saltHingeEnvoy: { title: 'Envoy', surname: 'Hingeman', epithet: 'Port Speaker' },
    cataractScout: { title: 'Scout', surname: 'Scout', epithet: 'Rapids Rider' },
    vaultTender: { title: 'Tender', surname: 'Vaultman', epithet: 'Hearth Watcher' },
    ashDuneSkimmer: { title: 'Skimmer', surname: 'Dunerunner', epithet: 'Vent Runner' },
    sanctuarySeneschal: { title: 'Seneschal', surname: 'Hearthman', epithet: 'Vigil Keeper' },
    nullSaltHunter: { title: 'Hunter', surname: 'Nullman', epithet: 'Iron Taster' },
    steppeSinger: { title: 'Singer', surname: 'Steppeman', epithet: 'Horse Singer' },
    glacierHarpooner: { title: 'Harpooner', surname: 'Harpooner', epithet: 'Whale Hunter' },
    canopyWeaver: { title: 'Weaver', surname: 'Weaver', epithet: 'Branch Tier' },
    briarSentinel: { title: 'Sentinel', surname: 'Sentinel', epithet: 'Thorn Guard' },
    arbitrator: { title: 'Judge', surname: 'Lawman', epithet: 'the Law' }
};

// ============================================================================
// 5. LEGACY EXPORTS (FOR BACKWARD COMPATIBILITY)
// ============================================================================

export const RACE_NAMES = {
    generic: ['Jeff', 'Alaric', 'Elara', 'Kaelen', 'Lyra', 'Thorne', 'Myra', 'Valerius', 'Seraphina', 'Finn', 'Bjorn', 'Astrid', 'Venn', 'Silas', 'Ned', 'Bess'],
    human: ['Alaric', 'Thalra', 'Bjorn', 'Astrid', 'Cassian', 'Coraline', 'Finn', 'Lyris', 'Bayar', 'Bayarmaa', 'Jeff', 'Ned', 'Thomas', 'Bess'],
    skald: ['Bjorn', 'Astrid', 'Erik', 'Sigrid', 'Olaf', 'Ingrid', 'Thorstein', 'Gudrun', 'Harald', 'Svea', 'Ragnar', 'Freya', 'Leif', 'Gunnar'],
    corvani: ['Corvus', 'Malakor', 'Nocturne', 'Vespera', 'Draven', 'Morwenna', 'Kaelum', 'Nyxia', 'Berylla', 'Thalric', 'Valerius'],
    myrathil: ['Luneth', 'Brekka', 'Saelith', 'Ulvir', 'Venn', 'Coralli', 'Thalael', 'Myrith', 'Riveth', 'Saltis', 'Zale', 'Torrent'],
    rime_born: ['Hrym', 'Frost', 'Winter', 'Svala', 'Thora', 'Bryn', 'Kael', 'Halden', 'Skadi'],
    mimir: ['Mimeo', 'Protea', 'Reflex', 'Lumina', 'Echo', 'Sync', 'Chroma', 'Versa', 'Tallen', 'Sylas'],
    florae: ['Thorne', 'Briar', 'Sylvan', 'Silas', 'Flora', 'Bramble', 'Rose', 'Karr', 'Rowan', 'Willow', 'Hazel'],
    groven: ['Rowan', 'Vorr', 'Ithran', 'Krath', 'Bront', 'Gnar', 'Geth', 'Elidyr', 'Silas', 'Fawn'],
    solari: ['Ignis', 'Ash', 'Pyra', 'Cinder', 'Vulcan', 'Thaeron', 'Vane', 'Helian', 'Zenith', 'Lucan'],
    vreken: ['Orven', 'Vrael', 'Vespera', 'Mycella', 'Morven', 'Calmor', 'Kael', 'Malic'],
    neth: ['Saren', 'Lyra', 'Vaelis', 'Kaelen', 'Miren', 'Dervan', 'Solyn', 'Ilyth', 'Toris', 'Lucian', 'Titus', 'Aurelia'],
    astril: ['Nova', 'Vesta', 'Lyra', 'Altair', 'Vega', 'Stella', 'Orion', 'Sirius', 'Astra', 'Therra', 'Selene'],
    fexrick: ['Karr', 'Silas', 'Fritz', 'Barney', 'Jix', 'Ned', 'Brasskin', 'Bess', 'Pip', 'Kit']
};

export const SURNAMES = [
    'Greymark', 'Bloodhammer', 'Ironwood', 'Blackwood', 'Frosthald', 'Stormborn', 'Winterson',
    'Oakheart', 'Stonefist', 'Goldleaf', 'Silverton', 'Thornwood', 'Crowley', 'Swift', 'Nightfall',
    'Proudfoot', 'Highborn', 'Wildheart', 'Firebrand', 'Icebreaker', 'Earthshaker'
];

export const ROOM_NAMES = [
    "The Forsaken Keep", "Dragon's Rest", 'Whispering Woods', "Shadow's Edge", 'The Crimson Citadel',
    'Echoes of Eternity', 'The Misting Isles', "Raven's Watch", 'The Iron Bastion', 'Secrets of the Vale',
    'Sunken Temple', 'Celestial Spire', 'The Gilded Hall', 'Frozen Tundra', 'Emerald Sanctuary',
    'The Obsidian Throne', 'Wailing Caverns', 'Crystal Peaks', 'Thunder Ridge', 'The Silver Grove'
];

// ============================================================================
// 6. NORMALIZATION HELPERS
// ============================================================================

const SUBRACE_ALIAS_MAP = {
    thalren: 'thalren_human', tallyn: 'thalren_human', thalren_human: 'thalren_human',
    skald: 'skald_human', skald_human: 'skald_human',
    tessen: 'tessen_human', tessic: 'tessen_human', tessen_human: 'tessen_human',
    merryn: 'merryn_human', merryn_human: 'merryn_human',
    ordan: 'ordan_human', ordu: 'ordan_human', ordan_human: 'ordan_human',
    deepling: 'deepling_myrathil', nereid: 'deepling_myrathil', deepling_myrathil: 'deepling_myrathil',
    shoreling: 'shoreling_myrathil', corali: 'shoreling_myrathil', shoreling_myrathil: 'shoreling_myrathil',
    riverling: 'riverling_myrathil', ondine: 'riverling_myrathil', riverling_myrathil: 'riverling_myrathil',
    veiled: 'veiled_mimir', arch: 'veiled_mimir', 'arch mimir': 'veiled_mimir', veiled_mimir: 'veiled_mimir',
    tethered: 'tethered_mimir', broken: 'tethered_mimir', 'broken mimir': 'tethered_mimir', tethered_mimir: 'tethered_mimir',
    viridian: 'viridian_florae', briaren: 'viridian_florae', 'briaren florae': 'viridian_florae', viridian_florae: 'viridian_florae',
    oken: 'florae_unified', oaken: 'florae_unified', 'oaken florae': 'florae_unified', oken_florae: 'florae_unified', florae_unified: 'florae_unified',
    morgh: 'morgh_groven', morgh_groven: 'morgh_groven',
    ithran: 'ithran_groven', amordjin: 'ithran_groven', ithran_groven: 'ithran_groven',
    korr: 'korr_solari', korr_solari: 'korr_solari',
    thrask: 'thrask_solari', anhur: 'thrask_solari', thrask_solari: 'thrask_solari',
    clean: 'clean_vreken', bedel: 'clean_vreken', clean_vreken: 'clean_vreken',
    marked: 'marked_vreken', cromyx: 'marked_vreken', marked_vreken: 'marked_vreken',
    velun: 'velun_neth', nethien: 'velun_neth', velun_neth: 'velun_neth',
    kessen: 'kessen_neth', weft: 'kessen_neth', kessen_neth: 'kessen_neth',
    drun: 'drun_neth', riven: 'drun_neth', drun_neth: 'drun_neth',
    vashir: 'vashir_astril', lumian: 'vashir_astril', stargazer: 'vashir_astril', vashir_astril: 'vashir_astril',
    silath: 'silath_astril', kordak: 'silath_astril', silath_astril: 'silath_astril',
    kethrin: 'kethrin_fexric', brasskin: 'kethrin_fexric', clockwork: 'kethrin_fexric', kethrin_fexric: 'kethrin_fexric',
    drall: 'drall_fexric', alchemite: 'drall_fexric', caustic: 'drall_fexric', drall_fexric: 'drall_fexric'
};

const RACE_SUBRACE_DEFAULTS = {
    human: ['thalren_human', 'skald_human', 'tessen_human', 'merryn_human', 'ordan_human'],
    myrathil: ['shoreling_myrathil', 'deepling_myrathil', 'riverling_myrathil'],
    mimir: ['veiled_mimir', 'tethered_mimir'],
    florae: ['florae_unified', 'viridian_florae'],
    groven: ['morgh_groven', 'ithran_groven'],
    solari: ['korr_solari', 'thrask_solari'],
    vreken: ['clean_vreken', 'marked_vreken'],
    mycellan: ['clean_vreken', 'marked_vreken'],
    neth: ['velun_neth', 'kessen_neth', 'drun_neth'],
    athien: ['velun_neth', 'kessen_neth', 'drun_neth'],
    astril: ['vashir_astril', 'silath_astril'],
    fexrick: ['kethrin_fexric', 'drall_fexric'],
    fexric: ['kethrin_fexric', 'drall_fexric'],
    fex: ['kethrin_fexric', 'drall_fexric'],
    skald: ['skald_human'],
    corvani: ['thalren_human'],
    rime_born: ['skald_human']
};

const pickRandom = (arr) => {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
};

const resolveSubraceKey = (race, subrace) => {
    if (subrace) {
        const normSub = String(subrace).toLowerCase().trim().replace(/[\s-]+/g, '_');
        if (SUBRACE_ALIAS_MAP[normSub]) return SUBRACE_ALIAS_MAP[normSub];
        if (SUBRACE_NAME_DATA[normSub]) return normSub;
    }

    if (race) {
        const normRace = String(race).toLowerCase().trim().replace(/[\s-]+/g, '_');
        if (SUBRACE_ALIAS_MAP[normRace]) return SUBRACE_ALIAS_MAP[normRace];
        const subs = RACE_SUBRACE_DEFAULTS[normRace];
        if (subs && subs.length > 0) return pickRandom(subs);
    }

    const allKeys = Object.keys(SUBRACE_NAME_DATA);
    return pickRandom(allKeys);
};

const normalizeGender = (g) => {
    const s = String(g || 'none').toLowerCase().trim();
    if (s === 'male' || s === 'm' || s === 'man' || s === 'boy') return 'male';
    if (s === 'female' || s === 'f' || s === 'woman' || s === 'girl') return 'female';
    return 'none'; // 'none', 'other', 'neutral', 'genderless'
};

// ============================================================================
// 7. CORE GENERATION ENGINE (1-4 WORDS, GENDER-AWARE, NO HYPHENS)
// ============================================================================

/**
 * Returns a punchy, characterful name (1-4 words) with no hyphenated clutter.
 * Strictly respects gender selection:
 *   - 'male' -> male personal first names & masculine/neutral titles
 *   - 'female' -> female personal first names & feminine/neutral titles
 *   - 'none'/'other' -> strictly gender-neutral unisex first names & neutral titles
 *
 * @param {string|object} raceOrOptions - Race string or options object
 * @param {object} [maybeOptions] - Options if first argument was string
 * @returns {string} Clean, unhyphenated character name (1-4 words, <= 45 chars)
 */
export const getRandomCharacterName = (raceOrOptions = 'generic', maybeOptions = {}) => {
    let options = {};
    if (typeof raceOrOptions === 'object' && raceOrOptions !== null) {
        options = { ...raceOrOptions };
    } else {
        options = {
            race: raceOrOptions,
            ...maybeOptions
        };
    }

    const {
        race = 'generic',
        subrace = null,
        characterClass = null,
        background = null,
        gender = 'none'
    } = options;

    const normGender = normalizeGender(gender);
    const subraceKey = resolveSubraceKey(race, subrace);
    const subraceData = SUBRACE_NAME_DATA[subraceKey] || SUBRACE_NAME_DATA.thalren_human;

    // ~12% chance to throw in a quirky adventurer first name matching gender
    const isQuirkyFirstName = Math.random() < 0.12;

    let firstName = '';
    if (isQuirkyFirstName) {
        const quirkyPool = QUIRKY_FIRST_NAMES[normGender] || QUIRKY_FIRST_NAMES.none;
        firstName = pickRandom(quirkyPool);
    } else {
        let pool = [];

        if (normGender === 'male') {
            pool = subraceData.firstNames.male || [];
        } else if (normGender === 'female') {
            pool = subraceData.firstNames.female || [];
        } else {
            // 'none' or 'other' -> strictly unisex / neutral names
            pool = subraceData.firstNames.neutral || [];
        }

        if (pool.length === 0) {
            pool = RACE_NAMES[race?.toLowerCase()] || RACE_NAMES.generic;
        }

        firstName = pickRandom(pool) || (normGender === 'female' ? 'Astrid' : normGender === 'male' ? 'Jeff' : 'Rowan');
    }

    // Pull cultural, class, and background elements (all clean single/double words, no hyphens)
    const culturalSurname = pickRandom(subraceData.surnames) || 'Greymark';
    const culturalEpithet = pickRandom(subraceData.epithets) || 'the Bold';
    const culturalTitle = pickRandom(GENDER_TITLES[normGender]) || pickRandom(subraceData.titles) || 'Hunter';

    let classData = null;
    if (characterClass) {
        const cleanClass = String(characterClass).trim();
        classData = CLASS_NAME_DATA[cleanClass] ||
            Object.entries(CLASS_NAME_DATA).find(([k]) => k.toLowerCase() === cleanClass.toLowerCase())?.[1];
    }

    const bgData = background ? BACKGROUND_NAME_DATA[background] : null;

    const nickname = pickRandom(QUIRKY_NICKNAMES); // e.g. "Big", "Iron Fist", "Lucky", "Old"

    // Candidate generators ensuring strictly 1 to 4 words with a real first name:
    const candidateGenerators = [
        // 1. Cultural Standard: 2 words (e.g. "Jeff Greymark", "Astrid Skalvyr", "Rowan Highspan")
        () => `${firstName} ${culturalSurname}`,

        // 2. Nickname + First: 2 words (e.g. "Big Jeff", "Lucky Astrid", "Old Rowan")
        () => `${nickname} ${firstName}`,

        // 3. Nickname + First + Last: 3 words (e.g. "Big Jeff Greymark", "Lucky Astrid Skalvyr", "Old Rowan Highspan")
        () => `${nickname} ${firstName} ${culturalSurname}`,

        // 4. First the Epithet: 3 words (e.g. "Jeff the Clock", "Astrid the Fair", "Rowan the Swift")
        () => {
            const ep = classData ? pickRandom(classData.epithets) : culturalEpithet;
            return `${firstName} ${ep}`;
        },

        // 5. Title + First + Last: 3 words (e.g. "Lord Jeff Greymark", "Lady Astrid Skalvyr", "Warden Rowan Highspan")
        () => {
            const title = culturalTitle;
            return `${title} ${firstName} ${culturalSurname}`;
        },

        // 6. Class/Background Infused: 2 or 3 words (e.g. "Ithran Timeweaver", "Astrid Bloodhammer", "Rowan Clockmaker")
        () => {
            if (classData && Math.random() < 0.5) {
                return `${firstName} ${pickRandom(classData.surnames)}`;
            }
            if (bgData) {
                return `${firstName} ${bgData.surname}`;
            }
            return `${firstName} ${culturalSurname}`;
        },

        // 7. Quirky Legendary: 3 or 4 words (e.g. "Big Iron Fist Jeff", "Sweet Silver Tongue Bess", "Iron Fist Rowan")
        () => {
            const legendaryTitlePool = QUIRKY_LEGENDARY_TITLES[normGender] || QUIRKY_LEGENDARY_TITLES.none;
            const quirkyTitle = pickRandom(legendaryTitlePool);
            return `${quirkyTitle} ${firstName}`;
        }
    ];

    // Try a few times to get a clean result matching criteria
    for (let attempt = 0; attempt < 10; attempt++) {
        const gen = pickRandom(candidateGenerators);
        let candidate = gen();

        // Sanitize: remove any stray dashes or double spaces
        candidate = candidate.replace(/-/g, ' ').replace(/\s+/g, ' ').trim();

        const words = candidate.split(' ');
        if (words.length >= 1 && words.length <= 4 && candidate.length <= 45) {
            return candidate;
        }
    }

    // Reliable fallback: 2 words, clean personal name + surname
    return `${firstName} ${culturalSurname}`.replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
};

/**
 * Returns multiple unique, clean name suggestions (1-4 words each) for a given combination.
 *
 * @param {object} options - Character combination options
 * @param {number} [count=5] - Number of suggestions to generate
 * @returns {string[]} Array of distinct character names
 */
export const generateThematicNames = (options = {}, count = 5) => {
    const results = new Set();
    let attempts = 0;
    const maxAttempts = count * 8;

    while (results.size < count && attempts < maxAttempts) {
        attempts++;
        const name = getRandomCharacterName(options);
        if (name && name.length <= 45) {
            results.add(name);
        }
    }

    return Array.from(results);
};

/**
 * Returns a random name from the room names array
 * @returns {string} A room name
 */
export const getRandomRoomName = () => {
    return ROOM_NAMES[Math.floor(Math.random() * ROOM_NAMES.length)];
};
