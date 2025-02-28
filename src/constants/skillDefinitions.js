export const SKILL_CATEGORIES = {
    COMBAT: { 
        name: 'Combat Skills',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_battleshout.jpg'
    },
    ADVENTURING: { 
        name: 'Adventuring & Exploration',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg'
    },
    CRAFTING: { 
        name: 'Crafting & Professions',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_blacksmithing.jpg'
    },
    SOCIAL: { 
        name: 'Social & Roleplay',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg'
    },
    SPECIAL: { 
        name: 'Special & Unique',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_detectlesserinvisibility.jpg'
    }
};

export const SKILL_DEFINITIONS = {
    // Combat Skills
    slashingWeapons: { 
        name: 'Slashing Weapons', 
        category: SKILL_CATEGORIES.COMBAT.name, 
        stat: 'strength', 
        description: 'Proficiency with swords, axes, and certain polearms',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg'
    },
    piercingWeapons: { 
        name: 'Piercing Weapons', 
        category: SKILL_CATEGORIES.COMBAT.name, 
        stat: 'agility', 
        description: 'Mastery of spears, rapiers, bows, and crossbows',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_spear_06.jpg'
    },
    bludgeoningWeapons: { 
        name: 'Bludgeoning Weapons', 
        category: SKILL_CATEGORIES.COMBAT.name, 
        stat: 'strength', 
        description: 'Skill with hammers, maces, and clubs',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_mace_01.jpg'
    },
    dualWielding: { 
        name: 'Dual Wielding', 
        category: SKILL_CATEGORIES.COMBAT.name, 
        stat: 'agility', 
        description: 'Effectiveness when using two weapons',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_dualwield.jpg'
    },
    shieldMastery: { 
        name: 'Shield Mastery', 
        category: SKILL_CATEGORIES.COMBAT.name, 
        stat: 'strength', 
        description: 'Defense and shield-based tactics',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_shield_04.jpg'
    },
    focusMastery: { 
        name: 'Focus Mastery', 
        category: SKILL_CATEGORIES.COMBAT.name, 
        stat: 'intelligence', 
        description: 'Proficiency with magical focus items',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg'
    },
    archery: { 
        name: 'Archery', 
        category: SKILL_CATEGORIES.COMBAT.name, 
        stat: 'agility', 
        description: 'Ranged combat with bows and crossbows',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_marksmanship.jpg'
    },
    throwing: { 
        name: 'Throwing Weapons', 
        category: SKILL_CATEGORIES.COMBAT.name, 
        stat: 'agility', 
        description: 'Skill with thrown weapons',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_throwingknife_04.jpg'
    },
    unarmedCombat: { 
        name: 'Unarmed Combat', 
        category: SKILL_CATEGORIES.COMBAT.name, 
        stat: 'strength', 
        description: 'Hand-to-hand fighting and martial arts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_bullrush.jpg'
    },
    
    // Magic Skills
    spellcasting: { 
        name: 'Spellcasting', 
        category: SKILL_CATEGORIES.COMBAT.name, 
        stat: 'intelligence', 
        description: 'General magical ability and concentration',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg'
    },
    elementalMagic: { 
        name: 'Elemental Magic', 
        category: SKILL_CATEGORIES.COMBAT.name, 
        stat: 'intelligence', 
        description: 'Control over elemental forces',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_fireball.jpg'
    },
    necromancy: { 
        name: 'Necromancy', 
        category: SKILL_CATEGORIES.COMBAT.name, 
        stat: 'intelligence', 
        description: 'Death magic and undead control',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_deathcoil.jpg'
    },
    holyMagic: { 
        name: 'Holy Magic', 
        category: SKILL_CATEGORIES.COMBAT.name, 
        stat: 'spirit', 
        description: 'Divine healing and radiant power',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_holybolt.jpg'
    },
    bloodMagic: { 
        name: 'Blood Magic', 
        category: SKILL_CATEGORIES.COMBAT.name, 
        stat: 'constitution', 
        description: 'Sacrificial magic using life force',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_lifedrain.jpg'
    },
    
    // Adventuring Skills
    athletics: { 
        name: 'Athletics', 
        category: SKILL_CATEGORIES.ADVENTURING.name, 
        stat: 'strength', 
        description: 'Physical prowess and endurance',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_swiftness.jpg'
    },
    acrobatics: { 
        name: 'Acrobatics', 
        category: SKILL_CATEGORIES.ADVENTURING.name, 
        stat: 'agility', 
        description: 'Balance and gymnastic ability',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_quickrecovery.jpg'
    },
    survival: { 
        name: 'Survival', 
        category: SKILL_CATEGORIES.ADVENTURING.name, 
        stat: 'spirit', 
        description: 'Wilderness survival and tracking',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_protectionformnature.jpg'
    },
    perception: { 
        name: 'Perception', 
        category: SKILL_CATEGORIES.ADVENTURING.name, 
        stat: 'spirit', 
        description: 'Awareness and keen senses',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_sleep.jpg'
    },
    investigation: { 
        name: 'Investigation', 
        category: SKILL_CATEGORIES.ADVENTURING.name, 
        stat: 'intelligence', 
        description: 'Finding clues and solving puzzles',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_dust_02.jpg'
    },
    stealth: { 
        name: 'Stealth', 
        category: SKILL_CATEGORIES.ADVENTURING.name, 
        stat: 'agility', 
        description: 'Moving silently and staying hidden',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg'
    },
    
    // Crafting Skills
    blacksmithing: { 
        name: 'Blacksmithing', 
        category: SKILL_CATEGORIES.CRAFTING.name, 
        stat: 'strength', 
        description: 'Forging weapons and armor',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_blacksmithing.jpg'
    },
    jewelcrafting: { 
        name: 'Jewelcrafting', 
        category: SKILL_CATEGORIES.CRAFTING.name, 
        stat: 'agility', 
        description: 'Creating magical jewelry',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_gem_01.jpg'
    },
    leatherworking: { 
        name: 'Leatherworking', 
        category: SKILL_CATEGORIES.CRAFTING.name, 
        stat: 'agility', 
        description: 'Crafting leather goods',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_leatherworking.jpg'
    },
    alchemy: { 
        name: 'Alchemy', 
        category: SKILL_CATEGORIES.CRAFTING.name, 
        stat: 'intelligence', 
        description: 'Brewing potions and elixirs',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg'
    },
    enchanting: { 
        name: 'Enchanting', 
        category: SKILL_CATEGORIES.CRAFTING.name, 
        stat: 'intelligence', 
        description: 'Imbuing items with magic',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_enchant_disenchant.jpg'
    },
    
    // Social Skills
    persuasion: { 
        name: 'Persuasion', 
        category: SKILL_CATEGORIES.SOCIAL.name, 
        stat: 'charisma', 
        description: 'Convincing others through diplomacy',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg'
    },
    deception: { 
        name: 'Deception', 
        category: SKILL_CATEGORIES.SOCIAL.name, 
        stat: 'charisma', 
        description: 'Lying and misdirection',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg'
    },
    intimidation: { 
        name: 'Intimidation', 
        category: SKILL_CATEGORIES.SOCIAL.name, 
        stat: 'strength', 
        description: 'Frightening or coercing others',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_bullrush.jpg'
    },
    performance: { 
        name: 'Performance', 
        category: SKILL_CATEGORIES.SOCIAL.name, 
        stat: 'charisma', 
        description: 'Entertainment and artistry',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_magic_polymorphchicken.jpg'
    },
    
    // Special Skills
    voidMagic: { 
        name: 'Void Magic', 
        category: SKILL_CATEGORIES.SPECIAL.name, 
        stat: 'intelligence', 
        description: 'Dark cosmic power, corruption effects',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowform.jpg'
    },
    demonology: { 
        name: 'Demonology', 
        category: SKILL_CATEGORIES.SPECIAL.name, 
        stat: 'intelligence', 
        description: 'Summoning and binding demons',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_summonimp.jpg'
    },
    psionics: { 
        name: 'Psionics', 
        category: SKILL_CATEGORIES.SPECIAL.name, 
        stat: 'intelligence', 
        description: 'Mental powers and telepathy',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_mindmastery.jpg'
    }
};

// Skill level definitions with WoW-style progression
export const SKILL_LEVELS = {
    0: { name: 'Untrained', color: '#9d9d9d', maxPoints: 0 },
    1: { name: 'Novice', color: '#ffffff', maxPoints: 75 },
    2: { name: 'Apprentice', color: '#1eff00', maxPoints: 150 },
    3: { name: 'Journeyman', color: '#0070dd', maxPoints: 225 },
    4: { name: 'Expert', color: '#a335ee', maxPoints: 300 },
    5: { name: 'Master', color: '#ff8000', maxPoints: 375 },
    6: { name: 'Grandmaster', color: '#e6cc80', maxPoints: 450 }
};
