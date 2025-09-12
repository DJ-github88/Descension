// Weapon types and subtypes for the item wizard
export const WEAPON_TYPES = {
    MELEE: ['Greatsword', 'Greataxe', 'Maul', 'Polearm', 'Staff', 'Sword', 'Axe', 'Mace', 'Dagger'],
    RANGED: ['Bow', 'Crossbow', 'Thrown', 'Wand']
};

export const WEAPON_SLOTS = {
    MAIN_HAND: {
        name: 'Main Hand',
        icon: 'ability_warrior_savageblow',
        description: 'Weapons that can only be wielded in the main hand'
    },
    OFF_HAND: {
        name: 'Off Hand',
        icon: 'ability_warrior_challange',
        description: 'Weapons that can only be wielded in the off hand'
    },
    ONE_HANDED: {
        name: 'One-Handed',
        icon: 'inv_sword_04',
        description: 'Weapons that can be wielded in either hand'
    },
    TWO_HANDED: {
        name: 'Two-Handed',
        icon: 'inv_sword_25',
        description: 'Weapons that require both hands to wield'
    },
    RANGED: {
        name: 'Ranged',
        icon: 'inv_weapon_bow_07',
        description: 'Weapons that attack from a distance'
    }
};

export const HAND_OPTIONS = {
    MAIN_HAND: {
        name: 'Main Hand',
        icon: 'ability_warrior_savageblow',
        description: 'Primary weapon hand'
    },
    OFF_HAND: {
        name: 'Off Hand',
        icon: 'ability_warrior_challange',
        description: 'Secondary weapon hand'
    },
    ONE_HAND: {
        name: 'One Hand',
        icon: 'inv_sword_04',
        description: 'Can be used in either hand'
    }
};

export const WEAPON_SUBTYPES = {
    // Ranged Weapons
    BOW: { 
        name: 'Bow', 
        icon: 'ability_hunter_aimedshot', 
        slot: 'RANGED',
        description: 'Traditional ranged weapon using arrows'
    },
    CROSSBOW: { 
        name: 'Crossbow', 
        icon: 'inv_weapon_crossbow_02', 
        slot: 'RANGED',
        description: 'Mechanical ranged weapon with high precision'
    },
    THROWN: { 
        name: 'Thrown Weapon', 
        icon: 'inv_throwingaxe_03', 
        slot: 'RANGED',
        description: 'Weapons designed to be thrown at enemies'
    },
    WAND: {
        name: 'Wand',
        icon: 'inv_wand_11',
        slot: 'RANGED',
        description: 'Magic channeling device for spellcasters'
    },

    // Main Hand Only Weapons
    RAPIER: {
        name: 'Rapier',
        icon: 'inv_sword_30',
        slot: 'MAIN_HAND',
        description: 'Elegant thrusting sword requiring precise main hand control'
    },
    KATANA: {
        name: 'Katana',
        icon: 'inv_sword_62',
        slot: 'MAIN_HAND',
        description: 'Curved blade requiring main hand mastery'
    },
    MAIN_HAND_MACE: {
        name: 'War Mace',
        icon: 'inv_mace_21',
        slot: 'MAIN_HAND',
        description: 'Heavy mace designed for main hand wielding'
    },

    // Off Hand Only Weapons
    PARRYING_DAGGER: {
        name: 'Parrying Dagger',
        icon: 'inv_weapon_shortblade_16',
        slot: 'OFF_HAND',
        description: 'Defensive blade designed for off-hand parrying'
    },
    BUCKLER: {
        name: 'Buckler',
        icon: 'inv_shield_04',
        slot: 'OFF_HAND',
        description: 'Small shield for off-hand defense'
    },
    OFF_HAND_BLADE: {
        name: 'Off-Hand Blade',
        icon: 'inv_weapon_shortblade_25',
        slot: 'OFF_HAND',
        description: 'Light blade optimized for off-hand combat'
    },

    // One-Handed Weapons
    SWORD: { 
        name: 'Sword', 
        icon: 'inv_sword_20', 
        slot: 'ONE_HANDED',
        description: 'Versatile bladed weapon for slashing and thrusting'
    },
    AXE: { 
        name: 'Axe', 
        icon: 'inv_axe_17', 
        slot: 'ONE_HANDED',
        description: 'Powerful chopping weapon with cleaving edge'
    },
    MACE: { 
        name: 'Mace', 
        icon: 'inv_mace_20', 
        slot: 'ONE_HANDED',
        description: 'Blunt weapon effective against armored foes'
    },
    DAGGER: { 
        name: 'Dagger', 
        icon: 'inv_weapon_shortblade_15', 
        slot: 'ONE_HANDED',
        description: 'Quick stabbing weapon for close combat'
    },
    
    // Two-Handed Weapons
    GREATSWORD: { 
        name: 'Greatsword', 
        icon: 'inv_sword_34', 
        slot: 'TWO_HANDED',
        description: 'Massive sword requiring both hands to wield'
    },
    GREATAXE: { 
        name: 'Greataxe', 
        icon: 'inv_axe_09', 
        slot: 'TWO_HANDED',
        description: 'Heavy two-handed axe for devastating strikes'
    },
    MAUL: { 
        name: 'Maul', 
        icon: 'inv_hammer_16', 
        slot: 'TWO_HANDED',
        description: 'Massive hammer that crushes armor and bone'
    },
    POLEARM: { 
        name: 'Polearm', 
        icon: 'inv_spear_05', 
        slot: 'TWO_HANDED',
        description: 'Long-reaching weapon with extended range'
    },
    STAFF: { 
        name: 'Staff', 
        icon: 'inv_staff_20', 
        slot: 'TWO_HANDED',
        description: 'Versatile weapon favored by spellcasters'
    }
};
