import { getAbilityIconUrl } from '../utils/assetManager';

export const GUIDE_CHARACTER = {
    name: 'The Lamplighter',
    characterImage: getAbilityIconUrl('Utility/Glowing Shard')
};

export const WINDOW_INTROS = {
    leveleditor: {
        title: 'Level Editor',
        text: 'This is the Level Editor — your table. Paint terrain, raise walls, scatter props, and shape the map your party will explore.'
    },
    campaign: {
        title: 'Campaign Manager',
        text: 'The Campaign Manager holds your party. Invite players, add their characters, and see who is at the table.'
    },
    library: {
        title: 'Library',
        text: 'The Library is your well of content — creatures, spells, and items. Search, filter, then drag what you need onto the field.'
    },
    combat: {
        title: 'Combat Initiator',
        text: 'The Combat Initiator starts an encounter. Select tokens on the map, roll initiative, and the turn order takes over.'
    },
    spellbook: {
        title: 'Spellbook',
        text: 'The Spellbook holds every spell. Browse the catalogue, or open the Spellcrafting Wizard to weave new ones from scratch.'
    },
    inventory: {
        title: 'Inventory',
        text: 'The Inventory tracks items and loot. Drag objects onto the map, hand them to players, or stash them away.'
    },
    character: {
        title: 'Character Sheet',
        text: 'The Character Sheet shows gear, stats, skills, and lore — the full picture of who a character is.'
    },
    quests: {
        title: 'Quest Log',
        text: 'The Quest Log tracks the party\'s objectives and the story threads you weave between sessions.'
    },
    crafting: {
        title: 'Crafting',
        text: 'Crafting turns raw materials into arms, brews, and remedies through the professions your party has learned.'
    },
    journal: {
        title: 'Player Journal',
        text: 'The Player Journal — a private record for notes, discoveries, and the margins of the adventure.'
    }
};
