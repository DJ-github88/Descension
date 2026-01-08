import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/item-wizard.css';
import '../../styles/step-tooltip.css';
import { WOW_ICONS } from './wowIcons';
import { getIconUrl, getCustomIconUrl } from '../../utils/assetManager';
import ItemTooltip from './ItemTooltip';
import ChanceOnBeingHitConfig from './ChanceOnBeingHitConfig';
import StepChanceOnHit from './steps/StepChanceOnHit';
import { SpellLibraryProvider } from '../spellcrafting-wizard/context/SpellLibraryContext';
import { RARITY_COLORS } from '../../constants/itemConstants';
import { CURRENCY_TYPES } from './itemConstants';
import ExternalItemPreview from './ExternalItemPreview';
import {
    createRectangularShape,
    convertLegacyItemToShape
} from '../../utils/itemShapeUtils';
import { getSafePortalTarget } from '../../utils/portalUtils';
import useGameStore from '../../store/gameStore';
import useWindowManagerStore from '../../store/windowManagerStore';
import { CONDITIONS } from '../../data/conditionsData';

// Default image to show when item image fails to load
const DEFAULT_ITEM_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2NiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

const STEPS = {
    ITEM_TYPE: 0,
    BASIC_INFO: 1,
    SLOT_AND_SIZE: 2,
    STATS: 3,
    COMBAT_STATS: 4,
    CHANCE_ON_HIT: 5,
    UTILITY: 6,
    VALUE: 7,
    APPEARANCE: 8
};

const STEP_INFO = {
    [STEPS.ITEM_TYPE]: {
        name: 'Item Type',
        icon: 'Misc/Books/book-open-reddish-brown-pages',
        description: 'Choose the fundamental nature of your item.'
    },
    [STEPS.BASIC_INFO]: {
        name: 'Basic Info',
        icon: 'Misc/Books/book-blank-sheet-paper-shadow',
        description: 'Name your creation and give it a compelling description.'
    },
    [STEPS.SLOT_AND_SIZE]: {
        name: 'Slot & Size',
        icon: 'Armor/Chest/chest-barbarian-leather-tunic',
        description: 'Determine where this item is worn or held.'
    },

    [STEPS.STATS]: {
        // We'll dynamically change this based on item type
        getMiscInfo: () => ({
            name: 'Details',
            icon: 'Misc/Books/book-scroll-parchment-rolled',
            description: 'Define the specific properties of this item.'
        }),
        getRegularInfo: () => ({
            name: 'Stats',
            icon: 'Misc/Books/book-brown-fire-symbol-runes',
            description: 'Enhance the bearer\'s core attributes.'
        })
    },
    [STEPS.COMBAT_STATS]: {
        name: 'Combat',
        icon: 'Weapons/Swords/sword-basic-straight-beige-blade-brown-hilt',
        description: 'Define the item\'s combat capabilities.'
    },
    [STEPS.CHANCE_ON_HIT]: {
        name: 'On Being Hit',
        icon: 'Weapons/Shields/shield-heater-wooden-brown-worn-cracks-beige-boss',
        description: 'Configure effects that trigger when struck in battle.'
    },
    [STEPS.UTILITY]: {
        name: 'Utility',
        icon: 'Misc/Profession Resources/Tools/mortar-pestle-beige-reddish-brown',
        description: 'Add special features and utilities.'
    },
    [STEPS.VALUE]: {
        name: 'Value',
        icon: 'Container/Coins/golden-coin-single-isometric',
        description: 'Set the item\'s worth in gold, silver, and copper.'
    },
    [STEPS.APPEARANCE]: {
        name: 'Appearance',
        icon: 'Container/Bag/brown-backpack-simple',
        description: 'Design the item\'s visual appearance.'
    }
};
const getStepInfo = (step, itemType) => {
    if (step === STEPS.STATS) {
        return itemType === 'miscellaneous'
            ? STEP_INFO[step].getMiscInfo()
            : STEP_INFO[step].getRegularInfo();
    }
    return STEP_INFO[step];
};

const WEAPON_SLOTS = {
    ONE_HANDED: {
        name: 'One-Handed',
        icon: 'Weapons/Swords/sword-basic-straight-beige-blade-brown-hilt',
        description: 'Weapons that can be wielded in either hand'
    },
    TWO_HANDED: {
        name: 'Two-Handed',
        icon: 'Weapons/Swords/sword-fire-glowing-red-blade-golden-guard',
        description: 'Weapons that require both hands to wield'
    },
    RANGED: {
        name: 'Ranged',
        icon: 'Weapons/Bows/bow-simple-brown-tan-grip',
        description: 'Weapons that attack from a distance'
    }
};

const HAND_OPTIONS = {
    MAIN_HAND: {
        name: 'Main Hand',
        icon: 'Weapons/Swords/sword-basic-straight-beige-blade-brown-hilt',
        description: 'Primary weapon hand'
    },
    OFF_HAND: {
        name: 'Off Hand',
        icon: 'Weapons/Throwing Knife/throwing-knife-dagger-beige-blade-brown-handle-wrapped',
        description: 'Secondary weapon hand'
    },
    ONE_HAND: {
        name: 'One Hand',
        icon: 'Weapons/Swords/sword-basic-japanese-golden-guard-pommel',
        description: 'Can be used in either hand'
    }
};

const WEAPON_SUBTYPES = {
    // Ranged Weapons
    BOW: {
        name: 'Bow',
        icon: 'Weapons/Bows/bow-simple-brown-tan-grip',
        slot: 'RANGED',
        description: 'Traditional ranged weapon using arrows'
    },
    CROSSBOW: {
        name: 'Crossbow',
        icon: 'Weapons/Crossbow/crossbow-reddish-brown-loaded',
        slot: 'RANGED',
        description: 'Mechanical ranged weapon with high precision'
    },
    THROWN: {
        name: 'Thrown Weapon',
        icon: 'Weapons/Throwing Axe/throwing-axe-brown-handle-beige-blade-standard',
        slot: 'RANGED',
        description: 'Weapons designed to be thrown at enemies'
    },
    WAND: {
        name: 'Wand',
        icon: 'Weapons/Wand/wand-basic-bow-curved-light-beige-simple',
        slot: 'RANGED',
        description: 'Magic channeling device for spellcasters'
    },
    BLOWGUN: {
        name: 'Blowgun',
        icon: 'Weapons/Blowgun/blowgun-wooden-stick-simple',
        slot: 'RANGED',
        description: 'Tubular weapon that propels darts using breath'
    },
    SLING: {
        name: 'Sling',
        icon: 'Weapons/Sling/sling-ampersand-symbol-fire-orange-red-striped',
        slot: 'RANGED',
        description: 'Simple ranged weapon using centrifugal force'
    },
    BOOMERANG: {
        name: 'Boomerang',
        icon: 'Weapons/Boomerang/boomerang-brown-tapered-tip',
        slot: 'RANGED',
        description: 'Curved throwing weapon that returns to the thrower'
    },
    CHAKRAM: {
        name: 'Chakram',
        icon: 'Weapons/Chakram/chakram-broken-open-spiky',
        slot: 'RANGED',
        description: 'Circular throwing weapon with sharpened edges'
    },
    SHURIKEN: {
        name: 'Shuriken',
        icon: 'Weapons/Shuriken/shuriken-diamond-teal-red-orange-yellow-arrows-four-points',
        slot: 'RANGED',
        description: 'Small concealed throwing weapon'
    },
    DART: {
        name: 'Dart',
        icon: 'Weapons/Dart/dart-broom-orange-yellow-bristles-brown-handle',
        slot: 'RANGED',
        description: 'Small projectile weapon'
    },

    // Main Hand Only Weapons
    RAPIER: {
        name: 'Rapier',
        icon: 'Weapons/Rapier/rapier-curved-blade-rusty-bronze-orange-brown-aged',
        slot: 'MAIN_HAND',
        description: 'Elegant thrusting sword requiring precise main hand control'
    },
    KATANA: {
        name: 'Katana',
        icon: 'Weapons/Swords/sword-basic-japanese-golden-guard-pommel',
        slot: 'MAIN_HAND',
        description: 'Curved blade requiring main hand mastery'
    },
    MAIN_HAND_MACE: {
        name: 'War Mace',
        icon: 'Weapons/Mace/mace-fire-key-red-orange-yellow-flame-head',
        slot: 'MAIN_HAND',
        description: 'Heavy mace designed for main hand wielding'
    },
    SABER: {
        name: 'Saber',
        icon: 'Weapons/Saber/saber-curved-blade-golden-orange-red-edge-enchanted',
        slot: 'MAIN_HAND',
        description: 'Curved single-edged blade for main hand'
    },

    // Off Hand Only Weapons
    PARRYING_DAGGER: {
        name: 'Parrying Dagger',
        icon: 'Weapons/Throwing Knife/throwing-knife-beige-blade-brown-handle-pommel',
        slot: 'OFF_HAND',
        description: 'Defensive blade designed for off-hand parrying'
    },
    BUCKLER: {
        name: 'Buckler',
        icon: 'Weapons/Shields/shield-heater-wooden-brown-worn-cracks-beige-boss',
        slot: 'OFF_HAND',
        description: 'Small shield for off-hand defense'
    },
    OFF_HAND_BLADE: {
        name: 'Off-Hand Blade',
        icon: 'Weapons/Throwing Knife/throwing-knife-dagger-beige-blade-brown-handle-wrapped',
        slot: 'OFF_HAND',
        description: 'Light blade optimized for off-hand combat'
    },

    // One-Handed Weapons
    SWORD: {
        name: 'Sword',
        icon: 'Weapons/Swords/sword-basic-straight-beige-blade-brown-hilt',
        slot: 'ONE_HANDED',
        description: 'Versatile bladed weapon for slashing and thrusting'
    },
    AXE: {
        name: 'Axe',
        icon: 'Weapons/Axe/axe-brown-handle-beige-blade',
        slot: 'ONE_HANDED',
        description: 'Powerful chopping weapon with cleaving edge'
    },
    MACE: {
        name: 'Mace',
        icon: 'Weapons/Mace/mace-spiked-club-brown-tan-bands-metal-spikes',
        slot: 'ONE_HANDED',
        description: 'Blunt weapon effective against armored foes'
    },
    DAGGER: {
        name: 'Dagger',
        icon: 'Weapons/Throwing Knife/throwing-knife-dagger-beige-blade-brown-handle-wrapped',
        slot: 'ONE_HANDED',
        description: 'Quick stabbing weapon for close combat'
    },
    SICKLE: {
        name: 'Sickle',
        icon: 'Weapons/Sickles/sickle-curved-blade-beige-brown-handle-simple',
        slot: 'ONE_HANDED',
        description: 'Curved blade weapon with agricultural origins'
    },
    FLAIL: {
        name: 'Flail',
        icon: 'Weapons/Flail/flail-brown-handle-chain-spiked-balls',
        slot: 'ONE_HANDED',
        description: 'Chain weapon with weighted head'
    },
    FIST_WEAPON: {
        name: 'Fist Weapon',
        icon: 'Weapons/Fist Weapon/fist-weapon-claw-brown-green-red-blades',
        slot: 'ONE_HANDED',
        description: 'Weapon worn on the hand for unarmed combat'
    },

    // Two-Handed Weapons
    GREATSWORD: {
        name: 'Greatsword',
        icon: 'Weapons/Swords/sword-fire-glowing-red-blade-golden-guard',
        slot: 'TWO_HANDED',
        description: 'Massive sword requiring both hands to wield'
    },
    GREATAXE: {
        name: 'Greataxe',
        icon: 'Weapons/Axe/double-bladed-axe-asymmetric-bronze',
        slot: 'TWO_HANDED',
        description: 'Heavy two-handed axe for devastating strikes'
    },
    MAUL: {
        name: 'Maul',
        icon: 'Weapons/Warhammer/warhammer-brown-tan-striking-face-beige-arrow-indicator',
        slot: 'TWO_HANDED',
        description: 'Massive hammer that crushes armor and bone'
    },
    POLEARM: {
        name: 'Polearm',
        icon: 'Weapons/Polearm/polearm-spear-staff-brown-wrapped-light-tip',
        slot: 'TWO_HANDED',
        description: 'Long-reaching weapon with extended range'
    },
    STAFF: {
        name: 'Staff',
        icon: 'Weapons/Staff/staff-wooden-golden-star-green-wrapping-red-pommel',
        slot: 'TWO_HANDED',
        description: 'Versatile weapon favored by spellcasters'
    },
    HALBERD: {
        name: 'Halberd',
        icon: 'Weapons/Halberd/halberd-axe-blade-spike-hammer-rear',
        slot: 'TWO_HANDED',
        description: 'Polearm combining axe blade and spear point'
    },
    SCYTHE: {
        name: 'Scythe',
        icon: 'Weapons/Scythe/scythe-curved-blade-dark-brown-handle-textured',
        slot: 'TWO_HANDED',
        description: 'Long curved blade on a pole, deadly in skilled hands'
    },
    JOUSTING_SPEAR: {
        name: 'Jousting Spear',
        icon: 'Weapons/Jousting Spear/jousting-spear-sword-brown-beige-golden-metallic',
        slot: 'TWO_HANDED',
        description: 'Long lance designed for mounted combat'
    },
    DOUBLE_SIDED_SWORD: {
        name: 'Double-Sided Sword',
        icon: 'Weapons/Double-sided Swords/double-sided-sword-beige-blades-brown-shaft_1',
        slot: 'TWO_HANDED',
        description: 'Sword with blades on both ends'
    },

    // Instruments (can be used as weapons)
    HARP: {
        name: 'Harp',
        icon: 'Instruments/Harp/harp-brown-beige-strings',
        slot: 'TWO_HANDED',
        description: 'Musical instrument that can channel magic'
    },
    LUTE: {
        name: 'Lute',
        icon: 'Instruments/Lute/lute-orange-golden-octagonal',
        slot: 'ONE_HANDED',
        description: 'Stringed instrument favored by bards'
    },
    FLUTE: {
        name: 'Flute',
        icon: 'Instruments/Flute/flute-brown-orange-ends',
        slot: 'ONE_HANDED',
        description: 'Wind instrument that can enhance spells'
    },
    DRUM: {
        name: 'Drum',
        icon: 'Instruments/Drum/drum-banded-stripes',
        slot: 'TWO_HANDED',
        description: 'Percussion instrument that can create rhythmic effects'
    },
    HORN: {
        name: 'Horn',
        icon: 'Instruments/Horn/horn-curved-segmented',
        slot: 'ONE_HANDED',
        description: 'Brass instrument used for signaling and magic'
    },
    VIOLIN: {
        name: 'Violin',
        icon: 'Instruments/Violin/violin-brown-f-holes-bow',
        slot: 'ONE_HANDED',
        description: 'Stringed instrument with a bow'
    },
    GUITAR: {
        name: 'Guitar',
        icon: 'Instruments/Guitar/guitar-ukulele-beige-octagonal',
        slot: 'ONE_HANDED',
        description: 'Stringed instrument popular with bards'
    }
};

const OFF_HAND_TYPES = {
    SHIELD: {
        name: 'Shield',
        icon: 'Weapons/Shields/shield-heater-wooden-brown-worn-cracks-beige-boss',
        description: 'Protective barrier that increases defense'
    },
    SPHERE: {
        name: 'Sphere',
        icon: 'Currency/golden-orb-gem',
        description: 'Magical orb that enhances spellcasting'
    },
    TOME: {
        name: 'Tome',
        icon: 'Misc/Books/book-brown-fire-symbol-runes',
        description: 'Ancient book containing magical knowledge'
    },
    TOTEM: {
        name: 'Totem',
        icon: 'Misc/Books/book-brown-green-rune-bookmark',
        description: 'Spiritual focus for nature magic'
    },
    IDOL: {
        name: 'Idol',
        icon: 'Armor/Neck/fiery-orb-amulet',
        description: 'Sacred object channeling druidic powers'
    }
};

const ARMOR_QUALITIES = {
    CLOTH: {
        name: 'Cloth',
        icon: 'Armor/Chest/chest-belted-brown-robe',
        description: 'Light fabric armor for spellcasters'
    },
    LEATHER: {
        name: 'Leather',
        icon: 'Armor/Chest/chest-barbarian-leather-tunic',
        description: 'Medium armor made from treated hide'
    },
    MAIL: {
        name: 'Mail',
        icon: 'Armor/Chest/chest-bronze-cuirass',
        description: 'Heavy armor of interlocking metal rings'
    },
    PLATE: {
        name: 'Plate',
        icon: 'Armor/Chest/chest-bronze-breastplate',
        description: 'Heaviest armor made of solid metal plates'
    }
};

const EQUIPMENT_SLOTS = {
    // Armor slots
    head: {
        icon: 'Armor/Head/head-teal-knight-great-helm',
        info: 'Head',
        type: 'armor',
        description: 'Protective headgear'
    },
    shoulders: {
        icon: 'Armor/Shoulder/shoulder-pauldron-rustic-leather-brown-tan-jagged-layered',
        info: 'Shoulders',
        type: 'armor',
        description: 'Shoulder armor and pauldrons'
    },
    back: {
        icon: 'Armor/Cloak/cloak-simple-brown-cape',
        info: 'Back',
        type: 'armor',
        description: 'Cloaks and capes'
    },
    chest: {
        icon: 'Armor/Chest/chest-barbarian-leather-tunic',
        info: 'Chest',
        type: 'armor',
        description: 'Body armor and breastplates'
    },
    wrists: {
        icon: 'Armor/Wrist/worn-leather-bracer',
        info: 'Wrists',
        type: 'armor',
        description: 'Bracers and wristguards'
    },
    hands: {
        icon: 'Armor/Hands/hands-beige-armored-gauntlet',
        info: 'Hands',
        type: 'armor',
        description: 'Gloves and gauntlets'
    },
    waist: {
        icon: 'Armor/Waist/brown-leather-belt',
        info: 'Waist',
        type: 'armor',
        description: 'Belts and girdles'
    },
    legs: {
        icon: 'Armor/Leggings/leggings-simple-brown-pants',
        info: 'Legs',
        type: 'armor',
        description: 'Leggings and greaves'
    },
    feet: {
        icon: 'Armor/Feet/feet-brown-laced-boot',
        info: 'Feet',
        type: 'armor',
        description: 'Boots and sabatons'
    },
    off_hand: {
        icon: 'Weapons/Shields/shield-heater-wooden-brown-worn-cracks-beige-boss',
        info: 'Off Hand',
        type: 'armor',
        description: 'Shields and defensive items'
    },

    // Accessory slots
    neck: {
        icon: 'Armor/Neck/archery-pendant',
        info: 'Neck',
        type: 'accessory',
        description: 'Necklaces and amulets'
    },
    ring: {
        icon: 'Armor/Finger/finger-ancient-bronze-ring',
        info: 'Ring',
        type: 'accessory',
        description: 'Magical rings with powerful effects'
    },
    trinket: {
        icon: 'Armor/Neck/butterfly-dragonfly-charm',
        info: 'Trinket',
        type: 'accessory',
        description: 'Unique items with special abilities'
    },

    // Clothing slots
    shirt: {
        icon: 'Armor/Chest/chest-simple-tan-tunic',
        info: 'Shirt',
        type: 'clothing',
        description: 'Cosmetic undershirt'
    },
    tabard: {
        icon: 'Armor/Chest/chest-orange-gold-trimmed-tunic',
        info: 'Tabard',
        type: 'clothing',
        description: 'Decorative guild or faction tabard'
    }
};

const CONSUMABLE_TYPES = {
    POTION: {
        name: 'Potion',
        icon: 'Misc/Profession Resources/Alchemy/Red/red-potion-angular-flask-base',
        description: 'Quick-acting magical brews with instant effects'
    },
    FLASK: {
        name: 'Flask',
        icon: 'Misc/Profession Resources/Alchemy/Blue/blue-potion-bottle-bulbous-base-neck',
        description: 'Long-lasting elixirs that persist through death'
    },
    ELIXIR: {
        name: 'Elixir',
        icon: 'Misc/Profession Resources/Alchemy/Orange/orange-potion-bottle-bulbous-teardrop-gradient-red-orange-yellow-beige-glass-dark-stopper',
        description: 'Beneficial buffs that enhance attributes'
    },
    SCROLL: {
        name: 'Scroll',
        icon: 'Misc/Books/book-scroll-parchment-rolled',
        description: 'Single-use magical spells in written form'
    },
    FOOD: {
        name: 'Food',
        icon: 'Food/Other/bread-loaf-rustic-artisan-slashes',
        description: 'Nourishing meals that restore health'
    },
    DRINK: {
        name: 'Drink',
        icon: 'Misc/Profession Resources/Alchemy/Blue/blue-potion-bottle-classic-shape-cork',
        description: 'Beverages that restore mana or energy'
    },
    BANDAGE: {
        name: 'Bandage',
        icon: 'Misc/Profession Resources/First Aid/first-aid-bandage-rolled-fabric-beige-tan',
        description: 'First aid items for healing wounds'
    }
};

const MISC_TYPES = {
    QUEST: {
        name: 'Quest Item',
        icon: 'Misc/Books/book-scroll-nr192-red-seal',
        description: 'Items needed for quests and missions',
        progressIcon: 'achievement_quests_completed_08' // New icon for progress bar
    },
    REAGENT: {
        name: 'Reagent',
        icon: 'Misc/Books/book-brown-fire-symbol-runes',
        description: 'Materials used in spellcasting'
    },
    CRAFTING: {
        name: 'Crafting Material',
        icon: 'Misc/Profession Resources/resource-bar-ingot-light-beige-golden',
        description: 'Resources used in professions'
    },
    TRADE_GOODS: {
        name: 'Trade Goods',
        icon: 'Container/Coins/golden-coin-single-isometric',
        description: 'Valuable items for trading and bartering'
    },
    KEY: {
        name: 'Key',
        icon: 'Armor/Neck/ornate-key-pendant',
        description: 'Opens locked doors and containers'
    },
    JUNK: {
        name: 'Junk',
        icon: 'Misc/Bones/bone-animal-skull-quadruped-profile',
        description: 'Items that can be sold to vendors'
    }
};

const ITEM_TYPES = {
    weapon: {
        name: 'Weapon',
        icon: 'Weapons/Swords/sword-basic-straight-beige-blade-brown-hilt',
        description: 'Swords, axes, bows, and other tools of combat'
    },
    armor: {
        name: 'Armor',
        icon: 'Armor/Chest/chest-barbarian-leather-tunic',
        description: 'Protective gear to keep you alive'
    },
    accessory: {
        name: 'Accessory',
        icon: 'Armor/Finger/finger-ancient-bronze-ring',
        description: 'Rings, necklaces, and other magical trinkets'
    },
    clothing: {
        name: 'Clothing',
        icon: 'Armor/Chest/chest-simple-belted-tunic',
        description: 'Non-protective wear like shirts and tabards'
    },
    consumable: {
        name: 'Consumable',
        icon: 'Misc/Profession Resources/Alchemy/Red/red-potion-angular-flask-base',
        description: 'Single-use items like potions and scrolls'
    },
    miscellaneous: {
        name: 'Miscellaneous',
        icon: 'Container/Bag/brown-backpack-simple',
        description: 'Quest items, crafting materials, and other goods'
    }
};

const BASE_STATS = {
    constitution: { name: 'Constitution', icon: getIconUrl('Healing/Heart Shield', 'abilities') },
    strength: { name: 'Strength', icon: getIconUrl('General/Strength', 'abilities') },
    agility: { name: 'Agility', icon: getIconUrl('Piercing/Scatter Shot', 'abilities') },
    intelligence: { name: 'Intelligence', icon: getIconUrl('Psychic/Brain Psionics', 'abilities') },
    spirit: { name: 'Spirit', icon: getIconUrl('Radiant/Radiant Aura', 'abilities') },
    charisma: { name: 'Charisma', icon: getIconUrl('Radiant/Radiant Aura', 'abilities') }
};

const COMBAT_STATS = {
    healthRestore: {
        name: 'Health Restore',
        icon: 'Healing/Golden Heart',
        description: 'Amount of health restored'
    },
    manaRestore: {
        name: 'Mana Restore',
        icon: 'Arcane/Orb Manipulation',
        description: 'Amount of mana restored'
    },
    piercingDamage: {
        name: 'Piercing Damage',
        icon: 'Piercing/Scatter Shot',
        description: 'Additional piercing damage'
    },
    bludgeoningDamage: {
        name: 'Bludgeoning Damage',
        icon: 'Bludgeoning/Hammer',
        description: 'Additional bludgeoning damage'
    },
    slashingDamage: {
        name: 'Slashing Damage',
        icon: 'Slashing/Bloody Meat Cleaver',
        description: 'Additional slashing damage'
    },
    healingReceived: {
        name: 'Healing Received',
        icon: 'Healing/Armored Healing',
        description: 'Increases healing received'
    },
    healingPower: {
        name: 'Healing Power',
        icon: 'Healing/Healing Compass',
        description: 'Increases healing power'
    },
    maxAP: {
        name: 'Max AP',
        icon: 'Arcane/Enchanted Sword 2',
        description: 'Maximum Action Points'
    },
    maxHealth: {
        name: 'Max Health',
        icon: 'Healing/Golden Heart',
        description: 'Maximum Health Points'
    },
    healthRegen: {
        name: 'Health Regen',
        icon: 'Healing/Armored Healing',
        description: 'Health regeneration per round'
    },
    maxMana: {
        name: 'Max Mana',
        icon: 'Arcane/Orb Manipulation',
        description: 'Maximum Mana Points'
    },
    manaRegen: {
        name: 'Mana Regen',
        icon: 'Arcane/Spellcasting Aura',
        description: 'Mana regeneration per round'
    },
    initiative: {
        name: 'Initiative',
        icon: 'Piercing/Scatter Shot',
        description: 'Bonus to initiative rolls'
    },
    armorClass: {
        name: 'Armor',
        icon: 'Utility/Scaled Armor',
        description: 'Bonus to Armor'
    },

};

const DAMAGE_TYPES = {
    fire: {
        name: 'Fire',
        icon: 'Fire/Flame Burst',
        color: '#ff4400'
    },
    frost: {
        name: 'Frost',
        icon: 'Frost/Dripping Ice',
        color: '#3399ff'
    },
    lightning: {
        name: 'Lightning',
        icon: 'Lightning/Lightning Bolt',
        color: '#ffff00'
    },
    arcane: {
        name: 'Arcane',
        icon: 'Arcane/Orb Manipulation',
        color: '#9370DB'
    },
    nature: {
        name: 'Nature',
        icon: 'Nature/Nature Natural',
        color: '#228B22'
    },
    force: {
        name: 'Force',
        icon: 'Force/Force Touch',
        color: '#ff66ff'
    },
    necrotic: {
        name: 'Necrotic',
        icon: 'Necrotic/Necrotic Skull',
        color: '#4B0082'
    },
    radiant: {
        name: 'Radiant',
        icon: 'Radiant/Radiant Sunburst',
        color: '#FFFACD'
    },
    poison: {
        name: 'Poison',
        icon: 'Poison/Poison Venom',
        color: '#008000'
    },
    psychic: {
        name: 'Psychic',
        icon: 'Psychic/Brain Psionics',
        color: '#FF00FF'
    },
    chaos: {
        name: 'Chaos',
        icon: 'Chaos/Chaotic Shuffle',
        color: '#ec4899'
    },
    void: {
        name: 'Void',
        icon: 'Void/Void Portal Mage',
        color: '#1a1a2e'
    }
};

// Enhanced resistance levels based on spell system
const RESISTANCE_LEVELS = [
    // Healing from damage (negative multipliers)
    { value: -200, label: 'Vampiric', description: 'Heals for 2× damage taken', multiplier: -2.0, color: '#ff0080' },
    { value: -100, label: 'Absorbing', description: 'Heals for 1× damage taken', multiplier: -1.0, color: '#ff4080' },
    { value: -50, label: 'Draining', description: 'Heals for 0.5× damage taken', multiplier: -0.5, color: '#ff8080' },
    { value: -25, label: 'Siphoning', description: 'Heals for 0.25× damage taken', multiplier: -0.25, color: '#ffb080' },

    // Standard resistance levels
    { value: 0, label: 'Immune', description: 'Takes no damage', multiplier: 0.0, color: '#4caf50' },
    { value: 50, label: 'Resistant', description: 'Takes 0.5× damage', multiplier: 0.5, color: '#8bc34a' },
    { value: 75, label: 'Guarded', description: 'Takes 0.75× damage', multiplier: 0.75, color: '#cddc39' },
    { value: 100, label: 'Normal', description: 'Takes normal damage', multiplier: 1.0, color: '#9e9e9e' },
    { value: 125, label: 'Susceptible', description: 'Takes 1.25× damage', multiplier: 1.25, color: '#ff9800' },
    { value: 150, label: 'Exposed', description: 'Takes 1.5× damage', multiplier: 1.5, color: '#ff5722' },
    { value: 200, label: 'Vulnerable', description: 'Takes 2× damage', multiplier: 2.0, color: '#f44336' }
];

// Condition modifier options
const CONDITION_MODIFIER_OPTIONS = [
    { value: 'none', label: 'None', description: 'No modifier', color: '#9e9e9e' },
    { value: 'advantage', label: 'Advantage', description: 'Roll twice, take the higher result', color: '#4caf50' },
    { value: 'double_advantage', label: 'Double Advantage', description: 'Roll three times, take the highest result', color: '#2e7d32' },
    { value: 'disadvantage', label: 'Disadvantage', description: 'Roll twice, take the lower result', color: '#f44336' },
    { value: 'double_disadvantage', label: 'Double Disadvantage', description: 'Roll three times, take the lowest result', color: '#c62828' },
    { value: 'immune', label: 'Immune', description: 'Cannot be affected by this condition', color: '#4caf50' }
];

const UTILITY_STATS = {
    movementSpeed: {
        name: 'Movement Speed',
        icon: getIconUrl('Utility/Speed Dash', 'abilities'),
        suffix: '%'
    },
    swimSpeed: {
        name: 'Swim Speed',
        icon: getIconUrl('utility/underwater-bubbles', 'abilities'),
        suffix: '%'
    },
    carryingCapacity: {
        name: 'Carrying Capacity',
        icon: getIconUrl('utility/atlas-burden', 'abilities'),
        suffix: 'slots'
    }
};

const DURATION_TYPES = {
    ROUNDS: {
        name: 'Rounds',
        description: 'Effect lasts for a number of combat rounds'
    },
    MINUTES: {
        name: 'Minutes',
        description: 'Effect lasts for a number of minutes'
    }
};

const DAMAGE_DICE = [
    'd4', 'd6', 'd8', 'd10', 'd12', 'd20'
];

const DAMAGE_AMOUNT = [1, 2, 3, 4, 5, 6, 7, 8];

const PHYSICAL_DAMAGE_TYPES = {
    piercing: {
        name: 'Piercing',
        icon: 'Piercing/Scatter Shot',
        color: '#C0C0C0'
    },
    bludgeoning: {
        name: 'Bludgeoning',
        icon: 'Bludgeoning/Hammer',
        color: '#8B4513'
    },
    slashing: {
        name: 'Slashing',
        icon: 'Slashing/Bloody Meat Cleaver',
        color: '#B22222'
    }
};

const DAMAGE_ICONS = {
    base: 'Arcane/Enchanted Sword',
    bonus: 'Arcane/Enchanted Sword'
};

const damageTypeColors = {
    bludgeoning: '#8B4513',
    chaos: '#ec4899',
    frost: '#87CEEB',
    fire: '#FF4500',
    arcane: '#9370DB',
    nature: '#228B22',
    force: '#ff66ff',
    lightning: '#FFD700',
    necrotic: '#4B0082',
    piercing: '#C0C0C0',
    poison: '#008000',
    psychic: '#FF69B4',
    radiant: '#FFFACD',
    slashing: '#A52A2A',
    void: '#1a1a2e'
};

const QUALITY_TYPES = {
    poor: {
        name: 'Poor',
        icon: 'Misc/Profession Resources/First Aid/first-aid-bandage-rolled-fabric-beige-tan',
        color: '#9d9d9d',
        flavor: 'Battered and worn, these items have seen better days. Often cobbled together from scraps or heavily damaged.'
    },
    common: {
        name: 'Common',
        icon: 'Misc/Books/book-blank-sheet-paper-shadow',
        color: '#ffffff',
        flavor: 'Standard craftsmanship, reliable and functional. The backbone of any adventurer\'s inventory.'
    },
    uncommon: {
        name: 'Uncommon',
        icon: 'Misc/Books/book-brown-green-rune-bookmark',
        color: '#1eff00',
        flavor: 'Superior quality with a touch of enhancement. These items stand out from the ordinary.'
    },
    rare: {
        name: 'Rare',
        icon: 'Misc/Books/book-brown-red-emblem-clasp',
        color: '#0070dd',
        flavor: 'Exceptional pieces imbued with notable power. Sought after by experienced adventurers.'
    },
    epic: {
        name: 'Epic',
        icon: 'Misc/Books/book-brown-fire-symbol-runes',
        color: '#a335ee',
        flavor: 'Legendary artifacts of great power. Each has a storied history and tremendous magical potential.'
    },
    legendary: {
        name: 'Legendary',
        icon: 'Misc/Books/book-brown-alchemy-flask-symbol',
        color: '#ff8000',
        flavor: 'Mythical items of incredible power. Their names echo through history and strike awe in those who hear them.'
    },
    artifact: {
        name: 'Artifact',
        icon: 'Misc/Books/book-banner-v-symbol-wooden-rods',
        color: '#e6cc80',
        flavor: 'Ancient relics of unfathomable power. The very fabric of reality bends around these legendary treasures.'
    }
};

// Quality color mapping
const getQualityColor = (quality) => {
    const qualityLower = quality?.toLowerCase() || 'common';
    return RARITY_COLORS[qualityLower]?.text || RARITY_COLORS.common.text;
};

// Process resistances
const getResistances = (combatStats) => {
    const resistances = [];
    if (combatStats?.resistances) {
        Object.entries(combatStats.resistances).forEach(([type, data]) => {
            if (data.resistant) {
                resistances.push(`• Resistant to ${type} Damage and Effects`);
            } else if (data.immune) {
                resistances.push(`• Immune to ${type} Damage and Effects`);
            }
        });
    }
    return resistances;
};

const getResistanceDescription = (resistance) => resistance;


export default function ItemWizard({ onClose, onComplete, onCancel, initialData = {}, isEditing = false }) {

    const handleClose = (item = null) => {
        if (item) {
            const formattedItem = {
                id: itemData.id || crypto.randomUUID(),
                name: itemData.name || 'Unnamed Item',
                quality: itemData.quality || 'common',
                description: itemData.description || '',
                type: itemData.type,
                subtype: itemData.subtype,
                offHandType: itemData.offHandType,
                hand: itemData.hand,
                requiredLevel: itemData.requiredLevel || 0,

                    // For weapons
                    ...(itemData.type === 'weapon' && {
                        weaponSlot: itemData.weaponSlot,
                        hand: itemData.hand,
                        weaponStats: itemData.weaponStats
                    }),

                    // Armor class directly at top level for display
                    armorClass: itemData.combatStats?.armorClass?.value || 0,

                    // Slots (important for display)
                    slots: itemData.type === 'weapon' ?
                          [itemData.weaponSlot] :
                          itemData.slots || [],

                    // Base stats - preserve structure with values and isPercentage
                    baseStats: itemData.baseStats || {},

                    // Combat stats - preserve structure
                    combatStats: itemData.combatStats || {},

                    // Utility stats - preserve structure
                    utilityStats: itemData.utilityStats || {},

                    // Value - preserve format
                    value: itemData.value || { gold: 0, silver: 0, copper: 0 },

                    // Appearance
                    iconId: itemData.iconId,
                    imageUrl: itemData.imageUrl || (itemData.iconId ? `getIconUrl('${itemData.iconId}', 'items')` : null),

                    // Set stackable property based on item type
                    stackable: (itemData.type === 'consumable' || itemData.type === 'miscellaneous'),
                    maxStackSize: (itemData.type === 'consumable' || itemData.type === 'miscellaneous') ? 5 : undefined,

                    // Preserve dimensions and shape if they were provided in initialData
                    width: initialData.width || itemData.width || 1,
                    height: initialData.height || itemData.height || 1,
                    shape: initialData.shape || itemData.shape,

// Currency item properties
...(itemData.type === 'currency' && {
    subtype: itemData.subtype,
    currencyType: itemData.currencyType || 'gold',
    currencyValue: itemData.currencyValue || 1,
    isCurrency: true
}),

// Miscellaneous item properties
...(itemData.type === 'miscellaneous' && {
    // Common properties
    subtype: itemData.subtype,

    // Quest items
    ...(itemData.subtype === 'QUEST' && {
        questGiver: itemData.questGiver || '',
        requiredLevel: itemData.requiredLevel || 0,
        questObjectives: itemData.questObjectives || '',
        questChain: itemData.questChain || '',
        timeLimit: itemData.timeLimit || 0
    }),

    // Reagents
    ...(itemData.subtype === 'REAGENT' && {
        reagentType: itemData.reagentType || '',
        magicType: itemData.magicType || '',
        reagentState: itemData.reagentState || '',
        requiredFor: itemData.requiredFor || '',
        quantityPerUse: itemData.quantityPerUse || 1,
        magicalProperties: itemData.magicalProperties || '',
        source: itemData.source || '',
        preservationMethod: itemData.preservationMethod || ''
    }),



    // Crafting materials
    ...(itemData.subtype === 'CRAFTING' && {
        materialType: itemData.materialType || '',
        professions: itemData.professions || [],
        gatheringMethod: itemData.gatheringMethod || '',
        sourceLocations: itemData.sourceLocations || '',
        specialProperties: itemData.specialProperties || '',
        recipes: itemData.recipes || ''
    }),

    // Trade goods
    ...(itemData.subtype === 'TRADE_GOODS' && {
        tradeCategory: itemData.tradeCategory || '',
        origin: itemData.origin || '',
        demandLevel: itemData.demandLevel || '',
        qualityGrade: itemData.qualityGrade || '',
        merchantNotes: itemData.merchantNotes || ''
    }),

    // Keys
    ...(itemData.subtype === 'KEY' && {
        keyType: itemData.keyType || '',
        unlocks: itemData.unlocks || '',
        location: itemData.location || '',
        securityLevel: itemData.securityLevel || '',
        oneTimeUse: itemData.oneTimeUse || false,
        specialInstructions: itemData.specialInstructions || ''
    }),
        // Junk
        ...(itemData.subtype === 'JUNK' && {
            junkType: itemData.junkType || '',
            condition: itemData.condition || '',
            origin: itemData.origin || '',
            estimatedValue: itemData.estimatedValue || '',
            description: itemData.description || ''
        })

}),
                };

                if (onComplete) {
                    onComplete(formattedItem);
                } else if (onClose) {
                    onClose(formattedItem);
                }
            } else if (!item && onCancel) {
                onCancel();
            } else if (onClose) {
                onClose(null);
            }
        };

    // Helper functions for consistent display formatting
    function getDamageTypeColor(type) {
        if (!type) return '#ffffff';

        const colors = {
            slashing: '#A52A2A',
            piercing: '#C0C0C0',
            bludgeoning: '#8B4513',
            fire: '#FF4500',
            cold: '#87CEEB',
            lightning: '#FFD700',
            acid: '#32CD32',
            force: '#ff66ff',
            necrotic: '#4B0082',
            radiant: '#FFFACD',
            poison: '#008000',
            psychic: '#FF69B4',
            thunder: '#0066ff'
        };

        return colors[type.toLowerCase()] || '#ffffff';
    }

    function getWeaponSlotDisplay(slot, hand) {
        if (!slot) return '';

        if (slot === 'MAIN_HAND') return 'Main Hand';
        if (slot === 'OFF_HAND') return 'Off Hand';
        if (slot === 'ONE_HANDED') {
            if (hand === 'MAIN_HAND') return 'Main Hand';
            if (hand === 'OFF_HAND') return 'Off Hand';
            if (hand === 'ONE_HAND') return 'One Hand';
            return 'One-Handed';
        }

        if (slot === 'TWO_HANDED') return 'Two-Handed';
        if (slot === 'RANGED') return 'Ranged';

        return slot.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }

    function getWeaponSubtypeDisplay(subtype) {
        if (!subtype) return '';

        // Map of subtypes to display names
        const subtypeMap = {
            SWORD: 'Sword',
            AXE: 'Axe',
            MACE: 'Mace',
            DAGGER: 'Dagger',
            GREATSWORD: 'Greatsword',
            GREATAXE: 'Greataxe',
            MAUL: 'Maul',
            POLEARM: 'Polearm',
            STAFF: 'Staff',
            BOW: 'Bow',
            CROSSBOW: 'Crossbow',
            THROWN: 'Thrown',
            WAND: 'Wand'
        };

        return subtypeMap[subtype] || subtype.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }

    function getArmorSlotDisplay(slot) {
        if (!slot) return '';

        // Map common slots to display names
        const slotMap = {
            head: 'Head',
            shoulders: 'Shoulders',
            chest: 'Chest',
            wrists: 'Wrists',
            hands: 'Hands',
            waist: 'Waist',
            legs: 'Legs',
            feet: 'Feet',
            off_hand: 'Off Hand',
            back: 'Back'
        };

        return slotMap[slot] || slot.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }

    function getArmorSubtypeDisplay(slot, offHandType, subtype) {
        if (slot === 'off_hand' && offHandType) {
            // Map off-hand types
            const offHandMap = {
                SHIELD: 'Shield',
                SPHERE: 'Sphere',
                TOME: 'Tome',
                TOTEM: 'Totem',
                IDOL: 'Idol'
            };
            return offHandMap[offHandType] || offHandType.charAt(0).toUpperCase() +
                   offHandType.slice(1).toLowerCase();
        }

        if (subtype) {
            // Map armor types
            const armorMap = {
                CLOTH: 'Cloth',
                LEATHER: 'Leather',
                MAIL: 'Mail',
                PLATE: 'Plate'
            };
            return armorMap[subtype] || subtype.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' ');
        }

        return '';
    }

    function getAccessorySlotDisplay(slot) {
        if (!slot) return '';

        const slotMap = {
            neck: 'Neck',
            ring: 'Ring',
            ring1: 'Ring',
            ring2: 'Ring',
            trinket: 'Trinket',
            trinket1: 'Trinket',
            trinket2: 'Trinket'
        };

        return slotMap[slot] || slot.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }

    const [currentStep, setCurrentStep] = useState(STEPS.ITEM_TYPE);
    const [itemData, setItemData] = useState(() => {
        const defaultData = {
            type: '',
            subtype: '',
            name: '',
            description: '',
            quality: 'common',
            requiredLevel: 0,
            baseStats: {
                constitution: { value: 0, isPercentage: false },
                strength: { value: 0, isPercentage: false },
                agility: { value: 0, isPercentage: false },
                intelligence: { value: 0, isPercentage: false },
                spirit: { value: 0, isPercentage: false },
                charisma: { value: 0, isPercentage: false }
            },
            combatStats: {
                healthRestore: { value: 0, isPercentage: false },
                manaRestore: { value: 0, isPercentage: false },
                piercingDamage: { value: 0, isPercentage: false },
                bludgeoningDamage: { value: 0, isPercentage: false },
                slashingDamage: { value: 0, isPercentage: false },
                healingReceived: { value: 0, isPercentage: false },
                healingPower: { value: 0, isPercentage: false },
                maxAP: { value: 0, isPercentage: false },
                maxHealth: { value: 0, isPercentage: false },
                healthRegen: { value: 0, isPercentage: false },
                maxMana: { value: 0, isPercentage: false },
                manaRegen: { value: 0, isPercentage: false },
                initiative: { value: 0, isPercentage: false },
                armorClass: { value: 0, isPercentage: false },

                spellDamage: {
                    types: {}
                },
                resistances: {},
                conditionModifiers: {},
                onHitEffects: {
                    enabled: false,
                    procType: 'dice',
                    procChance: 15,
                    diceThreshold: 18,
                    cardProcRule: 'face_cards',
                    coinProcRule: 'all_heads',
                    coinCount: 3,
                    procSuit: 'hearts',
                    spellEffect: null,
                    customEffects: [],
                    useRollableTable: false
                }
            },
            utilityStats: {
                movementSpeed: { value: 0, isPercentage: false },
                swimSpeed: { value: 0, isPercentage: true },
                carryingCapacity: { enabled: false, slots: 1 },
                duration: {
                    type: 'ROUNDS',
                    value: 1
                }
            },
            effects: {
                damage: 0,
                healing: 0,
                duration: 0,
                initiative: 0,
                resistances: Object.keys(DAMAGE_TYPES).reduce((acc, type) => {
                    acc[type] = 0;
                    return acc;
                }, {}),
                conditions: [],
                special: ''
            },
            value: {
                platinum: 0,
                gold: 0,
                silver: 0,
                copper: 0
            },
            image: null,
            slots: [],
            // Shape data will be set by ItemGeneration component
            weaponCategory: '',
            weaponStats: {
                baseDamage: {
                    diceCount: 1,
                    diceType: 'd6',
                    damageType: 'slashing',
                    bonusDamage: 0,
                    bonusDamageType: ''
                }
            }
        };

        if (initialData) {
            // Deep merge to ensure nested objects like 'value' are properly initialized
            return {
                ...defaultData,
                ...initialData,
                value: {
                    ...defaultData.value,
                    ...(initialData.value || {})
                },
                baseStats: {
                    ...defaultData.baseStats,
                    ...(initialData.baseStats || {})
                },
                combatStats: {
                    ...defaultData.combatStats,
                    ...(initialData.combatStats || {})
                },
                utilityStats: {
                    ...defaultData.utilityStats,
                    ...(initialData.utilityStats || {})
                }
            };
        }

        return defaultData;
    });

    const [availableSlots, setAvailableSlots] = useState([]);
    const [openCategories, setOpenCategories] = useState(new Set()); // Track which icon categories are open

    useEffect(() => {
        // Update available slots based on item type
        switch (itemData.type) {
            case 'weapon':
                setAvailableSlots(['mainHand', 'offHand']);
                break;
            case 'armor':
                setAvailableSlots(['head', 'shoulders', 'chest', 'wrists', 'hands', 'waist', 'legs', 'feet']);
                break;
            case 'accessory':
                setAvailableSlots(['neck', 'back', 'ring1', 'ring2', 'trinket1', 'trinket2']);
                break;
            case 'clothing':
                setAvailableSlots(['shirt', 'tabard']);
                break;
            default:
                setAvailableSlots([]);
        }
    }, [itemData.type]);

    const updateItemData = (newData) => {
        setItemData(prevData => {
            // Create a new object with the updates
            const updatedData = { ...prevData, ...newData };

            // Don't reset quality when changing equipment slot
            if (newData.slots && !newData.quality) {
                updatedData.quality = prevData.quality;
            }

            // Don't reset quality when changing armor type
            if (newData.subtype && !newData.quality) {
                updatedData.quality = prevData.quality;
            }

            // Ensure baseStats always exists and has proper structure
            if (!updatedData.baseStats) {
                updatedData.baseStats = {
                    constitution: { value: 0, isPercentage: false },
                    strength: { value: 0, isPercentage: false },
                    agility: { value: 0, isPercentage: false },
                    intelligence: { value: 0, isPercentage: false },
                    spirit: { value: 0, isPercentage: false },
                    charisma: { value: 0, isPercentage: false }
                };
            }

            // Ensure combatStats always exists and has proper structure
            if (!updatedData.combatStats) {
                updatedData.combatStats = {
                    healthRestore: { value: 0, isPercentage: false },
                    manaRestore: { value: 0, isPercentage: false },
                    piercingDamage: { value: 0, isPercentage: false },
                    bludgeoningDamage: { value: 0, isPercentage: false },
                    slashingDamage: { value: 0, isPercentage: false },
                    healingReceived: { value: 0, isPercentage: false },
                    healingPower: { value: 0, isPercentage: false },
                    maxAP: { value: 0, isPercentage: false },
                    maxHealth: { value: 0, isPercentage: false },
                    healthRegen: { value: 0, isPercentage: false },
                    maxMana: { value: 0, isPercentage: false },
                    manaRegen: { value: 0, isPercentage: false },
                    initiative: { value: 0, isPercentage: false },
                    armorClass: { value: 0, isPercentage: false },
                    spellDamage: { types: {} },
                    resistances: {},
                    conditionModifiers: {},
                    onHitEffects: {
                        enabled: false,
                        procType: 'dice',
                        procChance: 15,
                        diceThreshold: 18,
                        cardProcRule: 'face_cards',
                        coinProcRule: 'all_heads',
                        coinCount: 3,
                        procSuit: 'hearts',
                        spellEffect: null,
                        customEffects: [],
                        useRollableTable: false
                    }
                };
            }

            // Ensure utilityStats always exists and has proper structure
            if (!updatedData.utilityStats) {
                updatedData.utilityStats = {
                    movementSpeed: { value: 0, isPercentage: false },
                    swimSpeed: { value: 0, isPercentage: true },
                    carryingCapacity: { enabled: false, slots: 1 },
                    duration: {
                        type: 'ROUNDS',
                        value: 1
                    }
                };
            }

            // Ensure effects always exists and has proper structure
            if (!updatedData.effects) {
                updatedData.effects = {
                    damage: 0,
                    healing: 0,
                    duration: 0,
                    initiative: 0,
                    resistances: Object.keys(DAMAGE_TYPES).reduce((acc, type) => {
                        acc[type] = 0;
                        return acc;
                    }, {}),
                    conditions: [],
                    special: ''
                };
            }

            return updatedData;
        });
    };

    const renderStepNavigation = () => {
        const isLastStep = currentStep === Object.keys(STEPS).length - 1;
        return (
            <div className="wizard-step-navigation">
                <button
                    className="wizard-nav-btn"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                >
                    Previous
                </button>
                {isLastStep ? (
                    <button
                        className="wizard-nav-btn wizard-nav-create"
                        onClick={() => handleClose(itemData)}
                    >
                        {isEditing ? 'Update Item' : 'Create Item'}
                    </button>
                ) : (
                    <button
                        className="wizard-nav-btn"
                        onClick={nextStep}
                    >
                        Next
                    </button>
                )}
            </div>
        );
    };

    const renderStep = () => {
        switch (currentStep) {
            case STEPS.ITEM_TYPE:
                return (
                    <>
                        <h3 className="wow-heading quality-text">Choose Item Type</h3>
                        <div className="item-type-grid">
                            {Object.keys(ITEM_TYPES).map(type => (
                                <button
                                    key={type}
                                    className={`type-button ${itemData.type === type ? 'selected' : ''}`}
                                    onClick={() => updateItemData({
                                        type,
                                        subtype: type === 'consumable' ? 'potion' : '',
                                        slots: [],
                                        consumableType: type === 'consumable' ? 'POTION' : undefined,
                                        // Clear combat/stats when switching to miscellaneous since they don't apply
                                        ...(type === 'miscellaneous' && {
                                            weaponStats: undefined,
                                            combatStats: {
                                                healthRestore: { value: 0, isPercentage: false },
                                                manaRestore: { value: 0, isPercentage: false },
                                                piercingDamage: { value: 0, isPercentage: false },
                                                bludgeoningDamage: { value: 0, isPercentage: false },
                                                slashingDamage: { value: 0, isPercentage: false },
                                                healingReceived: { value: 0, isPercentage: false },
                                                healingPower: { value: 0, isPercentage: false },
                                                maxAP: { value: 0, isPercentage: false },
                                                maxHealth: { value: 0, isPercentage: false },
                                                healthRegen: { value: 0, isPercentage: false },
                                                maxMana: { value: 0, isPercentage: false },
                                                manaRegen: { value: 0, isPercentage: false },
                                                initiative: { value: 0, isPercentage: false },
                                                armorClass: { value: 0, isPercentage: false },
                                                spellDamage: { types: {} },
                                                resistances: {},
                                                onHitEffects: {
                                                    enabled: false,
                                                    procType: 'dice',
                                                    procChance: 15,
                                                    diceThreshold: 18,
                                                    cardProcRule: 'face_cards',
                                                    coinProcRule: 'all_heads',
                                                    coinCount: 3,
                                                    procSuit: 'hearts',
                                                    spellEffect: null,
                                                    customEffects: [],
                                                    useRollableTable: false
                                                }
                                            },
                                            utilityStats: undefined,
                                            effects: undefined,
                                            baseStats: {
                                                constitution: { value: 0, isPercentage: false },
                                                strength: { value: 0, isPercentage: false },
                                                agility: { value: 0, isPercentage: false },
                                                intelligence: { value: 0, isPercentage: false },
                                                spirit: { value: 0, isPercentage: false },
                                                charisma: { value: 0, isPercentage: false }
                                            }
                                        })
                                    })}
                                >
                                    <img src={getIconUrl(ITEM_TYPES[type].icon, 'items')} alt={ITEM_TYPES[type].name} />
                                    <span className="wow-text">{ITEM_TYPES[type].name}</span>
                                </button>
                            ))}
                        </div>
                    </>
                );

                case STEPS.BASIC_INFO:
                    return (
                        <>
                            <h3 className="wow-heading quality-text">Basic Information</h3>
                            <div className="form-group">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    value={itemData.name}
                                    onChange={(e) => updateItemData({ name: e.target.value })}
                                    placeholder="Enter item name..."
                                    className={`item-name-input quality-text`}
                                    style={{ color: QUALITY_TYPES[itemData.quality]?.color }}
                                />
                            </div>

                            <div className="form-group">
                                <label>Quality:</label>
                                <div className="quality-grid">
                                    {Object.entries(QUALITY_TYPES).map(([quality, data]) => (
                                        <button
                                            key={quality}
                                            className={`quality-button ${itemData.quality === quality ? 'selected' : ''}`}
                                            data-quality={quality}
                                            onClick={() => updateItemData({ quality })}
                                            style={{ '--wow-accent-color': data.color }}
                                        >
                                            <img
                                                src={getIconUrl(data.icon, 'items')}
                                                alt={data.name}
                                            />
                                            <span>{data.name}</span>
                                            <div className="flavor-text" style={{ color: data.color }}>
                                                {data.flavor}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Level Requirement:</label>
                                <div className="level-requirement-input">
                                    <div className="level-input-group">
                                        <img
                                            src={getIconUrl('Misc/Books/book-golden-star-red-bookmark', 'items')}
                                            alt="Level Requirement"
                                            className="level-icon"
                                        />
                                        <button
                                            className="level-button"
                                            onClick={() => {
                                                const newLevel = Math.max(0, (itemData.requiredLevel || 0) - 1);
                                                updateItemData({ requiredLevel: newLevel });
                                            }}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={itemData.requiredLevel || 0}
                                            onChange={(e) => updateItemData({ requiredLevel: Math.max(0, parseInt(e.target.value) || 0) })}
                                            className="wow-input"
                                            min="0"
                                        />
                                        <button
                                            className="level-button"
                                            onClick={() => {
                                                const newLevel = (itemData.requiredLevel || 0) + 1;
                                                updateItemData({ requiredLevel: newLevel });
                                            }}
                                        >
                                            +
                                        </button>
                                        <span className="level-label">Required Level</span>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description:</label>
                                <textarea
                                    value={itemData.description || ''}
                                    onChange={(e) => updateItemData({ description: e.target.value })}
                                    placeholder="Enter item description..."
                                    className="item-description"
                                    rows={4}
                                />
                            </div>
                        </>
                    );

            case STEPS.SLOT_AND_SIZE:
                return (
                    <>
                        <h3>Equipment Slot</h3>

                        {itemData.type === 'weapon' && (
                            <>
                                <div className="slot-selection">
                                    <h4>Weapon Type</h4>
                                    <div className="slot-options">
                                        {Object.entries(WEAPON_SLOTS).map(([slot, data]) => (
                                            <div
                                                key={slot}
                                                className={`slot-option ${itemData.weaponSlot === slot ? 'selected' : ''}`}
                                                onClick={() => updateItemData({
                                                    weaponSlot: slot,
                                                    hand: null,
                                                    subtype: null
                                                })}
                                            >
                                                <img
                                                    src={getIconUrl(data.icon, 'items')}
                                                    alt={data.name}
                                                    onError={(e) => {
                                                        e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                                                    }}
                                                />
                                                <span>{data.name}</span>
                                                <p className="slot-description">{data.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {itemData.weaponSlot === 'ONE_HANDED' && (
                                    <div className="hand-selection">
                                        <h4>Hand Selection</h4>
                                        <div className="hand-options">
                                            {Object.entries(HAND_OPTIONS).map(([hand, data]) => (
                                                <div
                                                    key={hand}
                                                    className={`hand-option ${itemData.hand === hand ? 'selected' : ''}`}
                                                    onClick={() => updateItemData({ hand })}
                                                >
                                                    <img
                                                        src={getIconUrl(data.icon, 'items')}
                                                        alt={data.name}
                                                        onError={(e) => {
                                                            e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                                                        }}
                                                    />
                                                    <span>{data.name}</span>
                                                    <p className="hand-description">{data.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {itemData.weaponSlot && (itemData.weaponSlot === 'MAIN_HAND' || itemData.weaponSlot === 'OFF_HAND' || itemData.weaponSlot === 'TWO_HANDED' || itemData.weaponSlot === 'RANGED' || (itemData.weaponSlot === 'ONE_HANDED' && itemData.hand)) && (
                                    <div className="subtype-selection">
                                        <h4>Weapon Subtype</h4>
                                        <div className="subtype-options">
                                            {Object.entries(WEAPON_SUBTYPES)
                                                .filter(([_, data]) => data.slot === itemData.weaponSlot)
                                                .map(([type, data]) => (
                                                    <div
                                                        key={type}
                                                        className={`subtype-option ${itemData.subtype === type ? 'selected' : ''}`}
                                                        onClick={() => updateItemData({ subtype: type })}
                                                    >
                                                        <img
                                                            src={getIconUrl(data.icon, 'items')}
                                                            alt={data.name}
                                                            onError={(e) => {
                                                                e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                                                            }}
                                                        />
                                                        <span>{data.name}</span>
                                                        <p className="subtype-description">{data.description}</p>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Other item types slot selection */}
                        {itemData.type !== 'weapon' && (
                            <>
                                <div className="slot-selection">
                                    <div className="slot-options">
                                        {Object.entries(EQUIPMENT_SLOTS)
                                            .filter(([_, data]) => {
                                                switch (itemData.type) {
                                                    case 'armor':
                                                        return data.type === 'armor';
                                                    case 'accessory':
                                                        return data.type === 'accessory';
                                                    case 'clothing':
                                                        return data.type === 'clothing';
                                                    default:
                                                        return false;
                                                }
                                            })
                                            .map(([slot, data]) => (
                                                <div
                                                    key={slot}
                                                    className={`slot-option ${itemData.slots?.includes(slot) ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        const quality = itemData.quality;
                                                        const updates = {
                                                            slots: [slot],
                                                            quality
                                                        };

                                                        // Set default off-hand type if selecting off_hand slot
                                                        if (slot === 'off_hand') {
                                                            updates.offHandType = 'SHIELD';
                                                        }

                                                        updateItemData(updates);
                                                    }}
                                                >
                                                    <img
                                                        src={getIconUrl(data.icon, 'items')}
                                                        alt={data.info}
                                                        onError={(e) => {
                                                            e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                                                        }}
                                                    />
                                                    <span>{data.info}</span>
                                                    <p className="slot-description">{data.description}</p>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {itemData.type === 'armor' && itemData.slots && itemData.slots.length > 0 && !itemData.slots.includes('off_hand') && (
                                    <div className="quality-selection">
                                        <h4>Armor Type</h4>
                                        <div className="quality-options">
                                            {Object.entries(ARMOR_QUALITIES).map(([quality, data]) => (
                                                <div
                                                    key={quality}
                                                    className={`quality-option ${itemData.subtype === quality ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        updateItemData({
                                                            subtype: quality
                                                        });
                                                    }}
                                                >
                                                    <img
                                                        src={getIconUrl(data.icon, 'items')}
                                                        alt={data.name}
                                                        onError={(e) => {
                                                            e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                                                        }}
                                                    />
                                                    <span>{data.name}</span>
                                                    <p className="quality-description">{data.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {itemData.type === 'armor' && itemData.slots && itemData.slots.includes('off_hand') && (
                                    <div className="quality-selection">
                                        <h4>Off-hand Type</h4>
                                        <div className="quality-options">
                                            {Object.entries(OFF_HAND_TYPES).map(([type, data]) => (
                                                <div
                                                    key={type}
                                                    className={`quality-option ${itemData.offHandType === type ? 'selected' : ''}`}
                                                    onClick={() => updateItemData({ offHandType: type })}
                                                >
                                                    <img
                                                        src={getIconUrl(data.icon, 'items')}
                                                        alt={data.name}
                                                        onError={(e) => {
                                                            e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                                                        }}
                                                    />
                                                    <span>{data.name}</span>
                                                    <p className="quality-description">{data.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {itemData.type === 'consumable' && (
                                    <div className="quality-selection">
                                        <h4>Consumable Type</h4>
                                        <div className="quality-options">
                                            {Object.entries(CONSUMABLE_TYPES).map(([type, data]) => (
                                                <div
                                                    key={type}
                                                    className={`quality-option ${itemData.consumableType === type ? 'selected' : ''}`}
                                                    onClick={() => updateItemData({
                                                        consumableType: type,
                                                        subtype: data.name.toLowerCase()
                                                    })}
                                                >
                                                    <img
                                                        src={getIconUrl(data.icon, 'items')}
                                                        alt={data.name}
                                                        onError={(e) => {
                                                            e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                                                        }}
                                                    />
                                                    <span>{data.name}</span>
                                                    <p className="quality-description">{data.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {itemData.type === 'miscellaneous' && (
                                    <div className="quality-selection">
                                        <h4>Item Category</h4>
                                        <div className="quality-options">
                                            {Object.entries(MISC_TYPES).map(([type, data]) => (
                                                <div
                                                    key={type}
                                                    className={`quality-option ${itemData.subtype === type ? 'selected' : ''}`}
                                                    onClick={() => updateItemData({ subtype: type })}
                                                >
                                                    <img
                                                        src={getIconUrl(data.icon, 'items')}
                                                        alt={data.name}
                                                        onError={(e) => {
                                                            e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                                                        }}
                                                    />
                                                    <span>{data.name}</span>
                                                    <p className="quality-description">{data.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {itemData.type === 'currency' && (
                                    <div className="quality-selection">
                                        <h4>Currency Type</h4>
                                        <div className="quality-options">
                                            {Object.entries(CURRENCY_TYPES).map(([type, data]) => (
                                                <div
                                                    key={type}
                                                    className={`quality-option ${itemData.subtype === type ? 'selected' : ''}`}
                                                    onClick={() => updateItemData({
                                                        subtype: type,
                                                        name: data.name,
                                                        description: data.description,
                                                        iconId: data.icon,
                                                        currencyType: data.type,
                                                        currencyValue: data.value
                                                    })}
                                                >
                                                    <img
                                                        src={getIconUrl(data.icon, 'items')}
                                                        alt={data.name}
                                                        onError={(e) => {
                                                            e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                                                        }}
                                                    />
                                                    <span>{data.name}</span>
                                                    <p className="quality-description">{data.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                );


            case STEPS.STATS:
                if (itemData.type === 'currency') {
                    return (
                        <>
                            <h3 className="wow-heading quality-text">Currency Amount</h3>
                            <div className="currency-amount-section">
                                <div className="currency-amount-display">
                                    <img
                                        src={getIconUrl(itemData.iconId || 'Container/Coins/golden-coin-single-isometric', 'items')}
                                        alt={itemData.name}
                                        className="currency-icon-large"
                                    />
                                    <div className="currency-info">
                                        <h4>{itemData.name || 'Currency'}</h4>
                                        <p>{itemData.description || 'A currency item'}</p>
                                    </div>
                                </div>

                                <div className="currency-amount-config">
                                    <div className="currency-value-control">
                                        <label>Amount:</label>
                                        <div className="stat-input-group">
                                            <button
                                                className="stat-button"
                                                onClick={() => updateItemData({
                                                    currencyValue: Math.max(1, (itemData.currencyValue || 1) - 1)
                                                })}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={itemData.currencyValue || 1}
                                                onChange={(e) => updateItemData({
                                                    currencyValue: Math.max(1, parseInt(e.target.value) || 1)
                                                })}
                                                className="stat-input wow-input"
                                            />
                                            <button
                                                className="stat-button"
                                                onClick={() => updateItemData({
                                                    currencyValue: (itemData.currencyValue || 1) + 1
                                                })}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="currency-type-display">
                                        <p>When looted, this will add {itemData.currencyValue || 1} {itemData.currencyType || 'gold'} to the player's currency.</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    );
                } else if (itemData.type === 'miscellaneous' && itemData.subtype === 'QUEST') {
                    return (
                        <>
                            <h3 className="wow-heading">Quest Properties</h3>
    <div className="misc-properties quest-properties">
        {/* Quest Giver Section */}
        <div className="property-section">
            <div className="property-header">
                <img
                    src={getIconUrl('Armor/Chest/chest-bone-plated-vest', 'items')}
                    alt="Quest Giver"
                    className="property-icon"
                />
                <label className="wow-text">Quest Giver</label>
            </div>
            <input
                type="text"
                value={itemData.questGiver || ''}
                onChange={(e) => updateItemData({ questGiver: e.target.value })}
                className="wow-input"
                placeholder="Who gave this quest item?"
            />
        </div>

        {/* Required Level Section */}
        <div className="property-section">
            <div className="property-header">
                <img
                    src={getIconUrl('Misc/Books/book-golden-star-red-bookmark', 'items')}
                    alt="Required Level"
                    className="property-icon"
                />
                <label className="wow-text">Required Level</label>
            </div>
            <div className="level-input-group">
                <button
                    className="level-button"
                    onClick={() => {
                        const newLevel = Math.max(0, (itemData.requiredLevel || 0) - 1);
                        updateItemData({ requiredLevel: newLevel });
                    }}
                >
                    -
                </button>
                <input
                    type="number"
                    value={itemData.requiredLevel || 0}
                    onChange={(e) => updateItemData({ requiredLevel: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="wow-input"
                    min="0"
                />
                <button
                    className="level-button"
                    onClick={() => {
                        const newLevel = (itemData.requiredLevel || 0) + 1;
                        updateItemData({ requiredLevel: newLevel });
                    }}
                >
                    +
                </button>
            </div>
        </div>

        {/* Quest Objectives Section */}
        <div className="property-section">
            <div className="property-header">
                <img
                    src={getIconUrl('utility/parchment-scroll', 'abilities')}
                    alt="Quest Objectives"
                    className="property-icon"
                />
                <label className="wow-text">Quest Objectives</label>
            </div>
            <textarea
                value={itemData.questObjectives || ''}
                onChange={(e) => updateItemData({ questObjectives: e.target.value })}
                className="wow-input objectives-input"
                placeholder="What needs to be done with this item?"
                rows={3}
            />
        </div>

        {/* Quest Chain Section */}
        <div className="property-section">
            <div className="property-header">
                <img
                    src={getIconUrl('utility/interlocking-chains', 'abilities')}
                    alt="Quest Chain"
                    className="property-icon"
                />
                <label className="wow-text">Quest Chain</label>
            </div>
            <input
                type="text"
                value={itemData.questChain || ''}
                onChange={(e) => updateItemData({ questChain: e.target.value })}
                className="wow-input"
                placeholder="Part of which quest chain?"
            />
        </div>

        {/* Time Limit Section */}
        <div className="property-section">
            <div className="property-header">
                <img
                    src={getIconUrl('utility/hourglass', 'abilities')}
                    alt="Time Limit"
                    className="property-icon"
                />
                <label className="wow-text">Time Limit</label>
            </div>
            <div className="time-limit-group">
                <div className="time-input-wrapper">
                    <button
                        className="time-button"
                        onClick={() => {
                            const newTime = Math.max(0, (itemData.timeLimit || 0) - 5);
                            updateItemData({ timeLimit: newTime });
                        }}
                    >
                        -
                    </button>
                    <input
                        type="number"
                        value={itemData.timeLimit || 0}
                        onChange={(e) => updateItemData({ timeLimit: Math.max(0, parseInt(e.target.value) || 0) })}
                        className="wow-input"
                        min="0"
                    />
                    <button
                        className="time-button"
                        onClick={() => {
                            const newTime = (itemData.timeLimit || 0) + 5;
                            updateItemData({ timeLimit: newTime });
                        }}
                    >
                        +
                    </button>
                </div>
                <span className="time-unit">minutes (0 for no limit)</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    );
                } else if (itemData.type === 'miscellaneous' && itemData.subtype === 'REAGENT') {
                    // Define the magic types within the scope
                    const MAGIC_TYPES = {
                        fire: {
                            name: 'Fire Magic',
                            icon: 'Fire/Flame Burst',
                            description: 'Magic of flame and heat',
                            color: '#ff4400'
                        },
                        cold: {
                            name: 'Frost Magic',
                            icon: 'Frost/Dripping Ice',
                            description: 'Magic of ice and cold',
                            color: '#3399ff'
                        },
                        lightning: {
                            name: 'Lightning Magic',
                            icon: 'Lightning/Lightning Bolt',
                            description: 'Magic of storms and electricity',
                            color: '#ffff00'
                        },
                        acid: {
                            name: 'Acid Magic',
                            icon: 'Poison/Poison Venom',
                            description: 'Magic of corrosion and dissolution',
                            color: '#00ff00'
                        },
                        force: {
                            name: 'Force Magic',
                            icon: 'Force/Force Touch',
                            description: 'Pure magical energy',
                            color: '#ff66ff'
                        },
                        necrotic: {
                            name: 'Death Magic',
                            icon: 'Necrotic/Necrotic Skull',
                            description: 'Magic of death and decay',
                            color: '#4B0082'
                        },
                        radiant: {
                            name: 'Radiant Magic',
                            icon: 'Radiant/Radiant Sunburst',
                            description: 'Magic of light and divine energy',
                            color: '#FFFACD'
                        },
                        poison: {
                            name: 'Poison Magic',
                            icon: 'Poison/Poison Venom',
                            description: 'Magic of toxins and venom',
                            color: '#008000'
                        },
                        psychic: {
                            name: 'Mind Magic',
                            icon: 'Psychic/Brain Psionics',
                            description: 'Magic of thoughts and consciousness',
                            color: '#FF00FF'
                        },
                        thunder: {
                            name: 'Thunder Magic',
                            icon: 'Lightning/Lightning Storm',
                            description: 'Magic of sound and concussive force',
                            color: '#0066ff'
                        }
                    };

                    const PRESERVATION_METHODS = {
                        dried: {
                            name: 'Dried',
                            icon: 'utility/maple-leaf',
                            description: 'Preserved through careful drying process'
                        },
                        fresh: {
                            name: 'Fresh',
                            icon: 'utility/single-leaf',
                            description: 'Must be used while fresh'
                        },
                        powdered: {
                            name: 'Powdered',
                            icon: 'utility/mortar-pestle',
                            description: 'Ground into a fine powder'
                        },
                        distilled: {
                            name: 'Distilled',
                            icon: 'utility/potion-flask',
                            description: 'Refined through distillation'
                        },
                        crystallized: {
                            name: 'Crystallized',
                            icon: 'Frost/Ice Shards',
                            description: 'Formed into magical crystals'
                        },
                        preserved: {
                            name: 'Magically Preserved',
                            icon: 'Arcane/Magical Cross Emblem 2',
                            description: 'Kept fresh through magical means'
                        }
                    };

                    return (
                        <>
                            <h3 className="wow-heading">Reagent Properties</h3>
                            <div className="misc-properties">
                                {/* Magic Type Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Radiant/Holy Cross', 'abilities')}
                                            alt="Magic Type"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Magic Type</label>
                                    </div>
                                    <div className="magic-type-grid">
                                        {Object.entries(MAGIC_TYPES).map(([type, info]) => (
                                            <button
                                                key={type}
                                                className={`magic-type-button ${itemData.magicType === type ? 'selected' : ''}`}
                                                onClick={() => updateItemData({ magicType: type })}
                                                style={{
                                                    '--magic-color': info.color
                                                }}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')}
                                                    alt={info.name}
                                                    className="magic-icon"
                                                />
                                                <div className="magic-info">
                                                    <span className="magic-name">{info.name}</span>
                                                    <span className="magic-description">{info.description}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Required For Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Radiant/Holy Cross', 'abilities')}
                                            alt="Required For"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Required For</label>
                                    </div>
                                    <textarea
                                        value={itemData.requiredFor || ''}
                                        onChange={(e) => updateItemData({ requiredFor: e.target.value })}
                                        className="wow-input"
                                        placeholder="What spells require this reagent?"
                                        rows={3}
                                    />
                                </div>

                                {/* Quantity Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Container/Bag/brown-backpack-sleeping-bag', 'items')}
                                            alt="Quantity"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Quantity Per Cast</label>
                                    </div>
                                    <div className="quantity-input-group">
                                        <button
                                            className="quantity-button"
                                            onClick={() => updateItemData({
                                                quantityPerUse: Math.max(1, (itemData.quantityPerUse || 1) - 1)
                                            })}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={itemData.quantityPerUse || 1}
                                            onChange={(e) => updateItemData({
                                                quantityPerUse: Math.max(1, parseInt(e.target.value) || 1)
                                            })}
                                            className="wow-input"
                                            min="1"
                                        />
                                        <button
                                            className="quantity-button"
                                            onClick={() => updateItemData({
                                                quantityPerUse: (itemData.quantityPerUse || 1) + 1
                                            })}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Magical Properties Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Radiant/Holy Cross', 'abilities')}
                                            alt="Magical Properties"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Magical Properties</label>
                                    </div>
                                    <textarea
                                        value={itemData.magicalProperties || ''}
                                        onChange={(e) => updateItemData({ magicalProperties: e.target.value })}
                                        className="wow-input"
                                        placeholder="Describe the magical properties of this reagent..."
                                        rows={3}
                                    />
                                </div>

                                {/* Source Location Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('utility/stylized-map', 'abilities')}
                                            alt="Source"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Source Location</label>
                                    </div>
                                    <textarea
                                        value={itemData.source || ''}
                                        onChange={(e) => updateItemData({ source: e.target.value })}
                                        className="wow-input"
                                        placeholder="Where can this reagent be found?"
                                        rows={3}
                                    />
                                </div>

                                {/* Preservation Method Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('utility/parchment-scroll', 'abilities')}
                                            alt="Preservation"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Preservation Method</label>
                                    </div>
                                    <div className="preservation-grid">
                                        {Object.entries(PRESERVATION_METHODS).map(([method, info]) => (
                                            <button
                                                key={method}
                                                className={`preservation-button ${itemData.preservationMethod === method ? 'selected' : ''}`}
                                                onClick={() => updateItemData({ preservationMethod: method })}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')}
                                                    alt={info.name}
                                                    className="preservation-icon"
                                                />
                                                <div className="preservation-info">
                                                    <span className="preservation-name">{info.name}</span>
                                                    <span className="preservation-description">{info.description}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    );

                } else if (itemData.type === 'miscellaneous' && itemData.subtype === 'CRAFTING') {
                    // Define material types with icons and descriptions
                    const MATERIAL_TYPES = {
                        metal: {
                            name: 'Metal',
                            icon: 'utility/cracked-ore',
                            description: 'Raw metals and ore for smithing'
                        },
                        wood: {
                            name: 'Wood',
                            icon: 'utility/wooden-plank',
                            description: 'Timber and wooden materials'
                        },
                        cloth: {
                            name: 'Cloth',
                            icon: 'utility/robed-tunic',
                            description: 'Fabrics and textile materials'
                        },
                        leather: {
                            name: 'Leather',
                            icon: 'utility/saddle-with-rope',
                            description: 'Treated animal hides and skins'
                        },
                        stone: {
                            name: 'Stone',
                            icon: 'utility/stone-tile',
                            description: 'Raw stone and minerals'
                        },
                        gem: {
                            name: 'Gem',
                            icon: 'utility/faceted-diamond',
                            description: 'Precious and semi-precious stones'
                        },
                        bone: {
                            name: 'Bone',
                            icon: 'utility/bone-fragment',
                            description: 'Creature bones and ivory'
                        },
                        hide: {
                            name: 'Hide',
                            icon: 'utility/animal-track',
                            description: 'Untreated animal pelts'
                        },
                        herb: {
                            name: 'Herb',
                            icon: 'utility/single-leaf',
                            description: 'Medicinal and magical plants'
                        }
                    };

                    // Define professions with icons
                    const PROFESSIONS = {
                        Alchemy: {
                            icon: 'utility/potion-flask',
                            description: 'Create potions and elixirs'
                        },
                        Blacksmithing: {
                            icon: 'utility/blacksmith-anvil',
                            description: 'Forge weapons and armor'
                        },
                        Leatherworking: {
                            icon: 'utility/saddle-with-rope',
                            description: 'Craft leather goods and armor'
                        },
                        Tailoring: {
                            icon: 'utility/robed-tunic',
                            description: 'Create cloth items and garments'
                        },
                        Engineering: {
                            icon: 'utility/utility_interlocking-gears',
                            description: 'Build mechanical devices'
                        },
                        Enchanting: {
                            icon: 'Arcane/Magical Staff',
                            description: 'Enhance items with magic'
                        },
                        Jewelcrafting: {
                            icon: 'utility/faceted-diamond',
                            description: 'Cut and socket precious gems'
                        },
                        Inscription: {
                            icon: 'utility/parchment-scroll',
                            description: 'Create magical scrolls and glyphs'
                        },
                        Woodworking: {
                            icon: 'utility/stylized-tree',
                            description: 'Craft wooden items and tools'
                        }
                    };

                    // Define gathering methods with icons
                    const GATHERING_METHODS = {
                        mining: {
                            name: 'Mining',
                            icon: 'utility/mining-pickaxe',
                            description: 'Extracted from mineral deposits'
                        },
                        herbalism: {
                            name: 'Herbalism',
                            icon: 'utility/single-leaf',
                            description: 'Gathered from wild plants'
                        },
                        skinning: {
                            name: 'Skinning',
                            icon: 'utility/animal-track',
                            description: 'Harvested from creatures'
                        },
                        logging: {
                            name: 'Logging',
                            icon: 'utility/stylized-tree',
                            description: 'Cut from trees and plants'
                        },
                        scavenging: {
                            name: 'Scavenging',
                            icon: 'utility/treasure-cave',
                            description: 'Found in the wilderness'
                        },
                        fishing: {
                            name: 'Fishing',
                            icon: 'utility/underwater-bubbles',
                            description: 'Caught in waters'
                        },
                        quarrying: {
                            name: 'Quarrying',
                            icon: 'utility/stone-tile',
                            description: 'Extracted from stone deposits'
                        }
                    };

                    return (
                        <>
                            <h3 className="wow-heading">Crafting Material Properties</h3>
                            <div className="misc-properties">
                                {/* Material Type Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Container/Bag/brown-backpack-sleeping-bag', 'items')}
                                            alt="Material Type"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Material Type</label>
                                    </div>
                                    <div className="magic-type-grid">
                                        {Object.entries(MATERIAL_TYPES).map(([type, info]) => (
                                            <button
                                                key={type}
                                                className={`magic-type-button ${itemData.materialType === type ? 'selected' : ''}`}
                                                onClick={() => updateItemData({ materialType: type })}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')}
                                                    alt={info.name}
                                                    className="magic-icon"
                                                />
                                                <div className="magic-info">
                                                    <span className="magic-name">{info.name}</span>
                                                    <span className="magic-description">{info.description}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Professions Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('utility/utility_interlocking-gears', 'abilities')}
                                            alt="Required Professions"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Required Professions</label>
                                    </div>
                                    <div className="magic-type-grid">
                                        {Object.entries(PROFESSIONS).map(([profession, info]) => (
                                            <button
                                                key={profession}
                                                className={`magic-type-button ${itemData.professions?.includes(profession) ? 'selected' : ''}`}
                                                onClick={() => {
                                                    const professions = itemData.professions || [];
                                                    if (professions.includes(profession)) {
                                                        updateItemData({
                                                            professions: professions.filter(p => p !== profession)
                                                        });
                                                    } else {
                                                        updateItemData({
                                                            professions: [...professions, profession]
                                                        });
                                                    }
                                                }}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')}
                                                    alt={profession}
                                                    className="magic-icon"
                                                />
                                                <div className="magic-info">
                                                    <span className="magic-name">{profession}</span>
                                                    <span className="magic-description">{info.description}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Gathering Method Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('utility/mining-pickaxe', 'abilities')}
                                            alt="Gathering Method"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Gathering Method</label>
                                    </div>
                                    <div className="magic-type-grid">
                                        {Object.entries(GATHERING_METHODS).map(([method, info]) => (
                                            <button
                                                key={method}
                                                className={`magic-type-button ${itemData.gatheringMethod === method ? 'selected' : ''}`}
                                                onClick={() => updateItemData({ gatheringMethod: method })}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')}
                                                    alt={info.name}
                                                    className="magic-icon"
                                                />
                                                <div className="magic-info">
                                                    <span className="magic-name">{info.name}</span>
                                                    <span className="magic-description">{info.description}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Recipes Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('utility/parchment-scroll', 'abilities')}
                                            alt="Recipes"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Used in Recipes</label>
                                    </div>
                                    <textarea
                                        value={itemData.recipes || ''}
                                        onChange={(e) => updateItemData({ recipes: e.target.value })}
                                        className="wow-input"
                                        placeholder="List the items that can be crafted with this material..."
                                        rows={3}
                                    />
                                </div>

                                {/* Source Locations Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('utility/stylized-map', 'abilities')}
                                            alt="Source Locations"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Source Locations</label>
                                    </div>
                                    <textarea
                                        value={itemData.sourceLocations || ''}
                                        onChange={(e) => updateItemData({ sourceLocations: e.target.value })}
                                        className="wow-input"
                                        placeholder="Where can this material be found?"
                                        rows={3}
                                    />
                                </div>

                                {/* Special Properties Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('magic/magical-cross-emblem', 'abilities')}
                                            alt="Special Properties"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Special Properties</label>
                                    </div>
                                    <textarea
                                        value={itemData.specialProperties || ''}
                                        onChange={(e) => updateItemData({ specialProperties: e.target.value })}
                                        className="wow-input"
                                        placeholder="Any unique properties or characteristics of this material..."
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </>
                    );
                } else if (itemData.type === 'miscellaneous' && itemData.subtype === 'TRADE_GOODS') {
                    const TRADE_CATEGORIES = {
                        textiles: {
                            name: 'Textiles',
                            icon: 'utility/robed-tunic',
                            description: 'Fine cloths and fabrics'
                        },
                        spices: {
                            name: 'Spices',
                            icon: 'utility/mortar-pestle',
                            description: 'Rare seasonings and flavors'
                        },
                        metals: {
                            name: 'Precious Metals',
                            icon: 'utility/gold-nuggets',
                            description: 'Valuable metals and alloys'
                        },
                        gems: {
                            name: 'Gemstones',
                            icon: 'utility/faceted-diamond',
                            description: 'Precious and semi-precious stones'
                        },
                        food: {
                            name: 'Food & Beverages',
                            icon: 'utility/hot-food',
                            description: 'Exotic foods and drinks'
                        },
                        art: {
                            name: 'Art & Artifacts',
                            icon: 'utility/ornate-vase',
                            description: 'Cultural treasures and artwork'
                        },
                        exotic: {
                            name: 'Exotic Goods',
                            icon: 'utility/woven-basket-pattern',
                            description: 'Rare and unusual items'
                        },
                        luxury: {
                            name: 'Luxury Items',
                            icon: 'utility/golden-ring',
                            description: 'High-end merchandise'
                        }
                    };

                    const DEMAND_LEVELS = {
                        low: {
                            name: 'Low Demand',
                            icon: 'utility/ancient-coin',
                            description: 'Limited market interest'
                        },
                        moderate: {
                            name: 'Moderate Demand',
                            icon: 'utility/gold-nuggets',
                            description: 'Steady market interest'
                        },
                        high: {
                            name: 'High Demand',
                            icon: 'utility/gold-bar',
                            description: 'Strong market interest'
                        },
                        very_high: {
                            name: 'Very High Demand',
                            icon: 'utility/golden-trophy',
                            description: 'Exceptional market demand'
                        },
                        extreme: {
                            name: 'Extreme Demand',
                            icon: 'utility/golden-bell',
                            description: 'Overwhelming market demand'
                        }
                    };

                    const QUALITY_GRADES = {
                        poor: {
                            name: 'Poor',
                            icon: 'utility/broken-gear',
                            description: 'Below market standard'
                        },
                        standard: {
                            name: 'Standard',
                            icon: 'utility/faceted-crystal',
                            description: 'Meets market expectations'
                        },
                        fine: {
                            name: 'Fine',
                            icon: 'utility/cave-crystal',
                            description: 'Above average quality'
                        },
                        superior: {
                            name: 'Superior',
                            icon: 'utility/faceted-diamond',
                            description: 'Exceptional quality'
                        },
                        masterwork: {
                            name: 'Masterwork',
                            icon: 'Frost/Ice Shards',
                            description: 'Finest possible quality'
                        }
                    };

                    return (
                        <>
                            <h3 className="wow-heading">Trade Goods Properties</h3>
                            <div className="misc-properties">
                                {/* Trade Category Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('utility/gold-bar', 'abilities')}
                                            alt="Trade Category"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Trade Category</label>
                                    </div>
                                    <div className="magic-type-grid">
                                        {Object.entries(TRADE_CATEGORIES).map(([category, info]) => (
                                            <button
                                                key={category}
                                                className={`magic-type-button ${itemData.tradeCategory === category ? 'selected' : ''}`}
                                                onClick={() => updateItemData({ tradeCategory: category })}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')}
                                                    alt={info.name}
                                                    className="magic-icon"
                                                />
                                                <div className="magic-info">
                                                    <span className="magic-name">{info.name}</span>
                                                    <span className="magic-description">{info.description}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>



                                {/* Origin Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('utility/stylized-map', 'abilities')}
                                            alt="Origin"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Origin</label>
                                    </div>
                                    <textarea
                                        value={itemData.origin || ''}
                                        onChange={(e) => updateItemData({ origin: e.target.value })}
                                        className="wow-input"
                                        placeholder="Where does this trade good come from?"
                                        rows={2}
                                    />
                                </div>

                                {/* Demand Level Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('utility/gold-nuggets', 'abilities')}
                                            alt="Demand Level"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Demand Level</label>
                                    </div>
                                    <div className="magic-type-grid">
                                        {Object.entries(DEMAND_LEVELS).map(([level, info]) => (
                                            <button
                                                key={level}
                                                className={`magic-type-button ${itemData.demandLevel === level ? 'selected' : ''}`}
                                                onClick={() => updateItemData({ demandLevel: level })}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')}
                                                    alt={info.name}
                                                    className="magic-icon"
                                                />
                                                <div className="magic-info">
                                                    <span className="magic-name">{info.name}</span>
                                                    <span className="magic-description">{info.description}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quality Grade Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('utility/faceted-diamond', 'abilities')}
                                            alt="Quality Grade"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Quality Grade</label>
                                    </div>
                                    <div className="magic-type-grid">
                                        {Object.entries(QUALITY_GRADES).map(([grade, info]) => (
                                            <button
                                                key={grade}
                                                className={`magic-type-button ${itemData.qualityGrade === grade ? 'selected' : ''}`}
                                                onClick={() => updateItemData({ qualityGrade: grade })}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')}
                                                    alt={info.name}
                                                    className="magic-icon"
                                                />
                                                <div className="magic-info">
                                                    <span className="magic-name">{info.name}</span>
                                                    <span className="magic-description">{info.description}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Merchant Notes Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('utility/parchment-scroll', 'abilities')}
                                            alt="Merchant Notes"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Merchant Notes</label>
                                    </div>
                                    <textarea
                                        value={itemData.merchantNotes || ''}
                                        onChange={(e) => updateItemData({ merchantNotes: e.target.value })}
                                        className="wow-input"
                                        placeholder="Special trading information, preferred merchants, market conditions..."
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </>
                    );
                } else if (itemData.type === 'miscellaneous' && itemData.subtype === 'KEY') {
                    const KEY_TYPES = {
                        door: {
                            name: 'Door Key',
                            icon: 'utility/stylized-key',
                            description: 'Opens locked doors and passages'
                        },
                        chest: {
                            name: 'Chest Key',
                            icon: 'utility/skeleton-key',
                            description: 'Unlocks treasure chests and containers'
                        },
                        gate: {
                            name: 'Gate Key',
                            icon: 'utility/stylized-key_1',
                            description: 'Opens large gates and barriers'
                        },
                        magical: {
                            name: 'Magical Key',
                            icon: 'Arcane/Magical Staff',
                            description: 'Opens magically sealed entrances'
                        },
                        puzzle: {
                            name: 'Puzzle Key',
                            icon: 'Utility/Utility Gear',
                            description: 'Solves mechanical puzzles and mechanisms'
                        },
                        portal: {
                            name: 'Portal Key',
                            icon: 'Arcane/Open Portal',
                            description: 'Activates magical portals and gateways'
                        }
                    };

                    const SECURITY_LEVELS = {
                        basic: {
                            name: 'Basic Security',
                            icon: 'utility/stylized-key',
                            description: 'Simple mechanical lock'
                        },
                        advanced: {
                            name: 'Advanced Security',
                            icon: 'utility/interlocking-chains',
                            description: 'Complex locking mechanism'
                        },
                        master: {
                            name: 'Master Security',
                            icon: 'utility/utility_interlocking-gears',
                            description: 'Highly sophisticated security'
                        },
                        magical: {
                            name: 'Magical Security',
                            icon: 'Arcane/Magical Cross Emblem 2',
                            description: 'Protected by magical wards'
                        },
                        artifact: {
                            name: 'Artifact Security',
                            icon: 'Arcane/Ornate Staff',
                            description: 'Ancient and powerful protection'
                        }
                    };

                    return (
                        <>
                            <h3 className="wow-heading">Key Properties</h3>
                            <div className="misc-properties">
                                {/* Key Type Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('utility/stylized-key', 'abilities')}
                                            alt="Key Type"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Key Type</label>
                                    </div>
                                    <div className="magic-type-grid">
                                        {Object.entries(KEY_TYPES).map(([type, info]) => (
                                            <button
                                                key={type}
                                                className={`magic-type-button ${itemData.keyType === type ? 'selected' : ''}`}
                                                onClick={() => updateItemData({ keyType: type })}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')}
                                                    alt={info.name}
                                                    className="magic-icon"
                                                />
                                                <div className="magic-info">
                                                    <span className="magic-name">{info.name}</span>
                                                    <span className="magic-description">{info.description}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Unlocks Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('utility/skeleton-key', 'abilities')}
                                            alt="Unlocks"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Unlocks</label>
                                    </div>
                                    <textarea
                                        value={itemData.unlocks || ''}
                                        onChange={(e) => updateItemData({ unlocks: e.target.value })}
                                        className="wow-input"
                                        placeholder="What does this key unlock?"
                                        rows={2}
                                    />
                                </div>

                                {/* Location Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('utility/stylized-map', 'abilities')}
                                            alt="Location"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Location</label>
                                    </div>
                                    <textarea
                                        value={itemData.location || ''}
                                        onChange={(e) => updateItemData({ location: e.target.value })}
                                        className="wow-input"
                                        placeholder="Where is this key used?"
                                        rows={2}
                                    />
                                </div>

                                {/* Security Level Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('utility/utility_interlocking-gears', 'abilities')}
                                            alt="Security Level"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Security Level</label>
                                    </div>
                                    <div className="magic-type-grid">
                                        {Object.entries(SECURITY_LEVELS).map(([level, info]) => (
                                            <button
                                                key={level}
                                                className={`magic-type-button ${itemData.securityLevel === level ? 'selected' : ''}`}
                                                onClick={() => updateItemData({ securityLevel: level })}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')}
                                                    alt={info.name}
                                                    className="magic-icon"
                                                />
                                                <div className="magic-info">
                                                    <span className="magic-name">{info.name}</span>
                                                    <span className="magic-description">{info.description}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Key Usage Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('utility/stylized-key', 'abilities')}
                                            alt="Key Usage"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Key Usage</label>
                                    </div>
                                    <div className="key-usage-options">
                                        <div className="usage-option">
                                            <div className="checkbox-group wow-checkbox-container">
                                                <input
                                                    type="checkbox"
                                                    id="oneTimeUse"
                                                    checked={itemData.oneTimeUse || false}
                                                    onChange={(e) => updateItemData({ oneTimeUse: e.target.checked })}
                                                    className="wow-checkbox"
                                                />
                                                <label htmlFor="oneTimeUse" className="usage-label">
                                                    <span className="usage-title">Single Use Only</span>
                                                    <span className="usage-description">Key breaks or becomes unusable after one use</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="usage-note">
                                            <span className="note-text">
                                                {itemData.oneTimeUse
                                                    ? "This key will be destroyed after use"
                                                    : "This key can be used multiple times"
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Special Instructions Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('utility/parchment-scroll', 'abilities')}
                                            alt="Special Instructions"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Special Instructions</label>
                                    </div>
                                    <textarea
                                        value={itemData.specialInstructions || ''}
                                        onChange={(e) => updateItemData({ specialInstructions: e.target.value })}
                                        className="wow-input"
                                        placeholder="Any special instructions or notes about using this key..."
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </>
                    );
                } else if (itemData.type === 'miscellaneous' && itemData.subtype === 'JUNK') {
                    const JUNK_TYPES = {
                        bones: {
                            name: 'Creature Bones',
                            icon: 'utility/bone-fragment',
                            description: 'Skeletal remains and fragments',
                            examples: 'Large Bone, Cracked Skull, Ribcage'
                        },
                        parts: {
                            name: 'Creature Parts',
                            icon: 'utility/human-eye',
                            description: 'Various creature organs and parts',
                            examples: 'Murloc Eye, Wolf Heart, Spider Fang'
                        },
                        scraps: {
                            name: 'Metal Scraps',
                            icon: 'utility/broken-gear',
                            description: 'Broken metal pieces and fragments',
                            examples: 'Scrap Metal, Bent Sprocket, Rusty Gear'
                        },
                        cloth: {
                            name: 'Tattered Cloth',
                            icon: 'utility/robed-tunic',
                            description: 'Worn fabric and rags',
                            examples: 'Torn Cloth, Frayed Robe, Old Belt'
                        },
                        scales: {
                            name: 'Scales & Shells',
                            icon: 'utility/cracked-surface',
                            description: 'Creature scales and shell pieces',
                            examples: 'Cracked Shell, Small Scale, Carapace Fragment'
                        },
                        trinkets: {
                            name: 'Broken Trinkets',
                            icon: 'utility/golden-ring',
                            description: 'Damaged ornaments and baubles',
                            examples: 'Cracked Pendant, Bent Ring, Tarnished Locket'
                        },
                        remains: {
                            name: 'Creature Remains',
                            icon: 'utility/bone-arm',
                            description: 'Miscellaneous creature bits',
                            examples: 'Slime Sample, Zombie Dust, Bat Wing'
                        },
                        minerals: {
                            name: 'Poor Minerals',
                            icon: 'utility/cracked-ore',
                            description: 'Low-quality stone and minerals',
                            examples: 'Flawed Stone, Rock Shard, Mineral Fragment'
                        }
                    };

                    const CONDITIONS = {
                        intact: {
                            name: 'Intact',
                            icon: 'utility/faceted-crystal',
                            description: 'Whole but worthless'
                        },
                        damaged: {
                            name: 'Damaged',
                            icon: 'utility/broken-gear',
                            description: 'Cracked or broken'
                        },
                        partial: {
                            name: 'Partial',
                            icon: 'utility/bone-fragment',
                            description: 'Only a piece remains'
                        },
                        decaying: {
                            name: 'Decaying',
                            icon: 'Necrotic/Necrotic Skull',
                            description: 'Rotting or decomposing'
                        }
                    };

                    return (
                        <>
                            <h3 className="wow-heading">Junk Properties</h3>
                            <div className="misc-properties">
                                {/* Junk Type Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('utility/bone-fragment', 'abilities')}
                                            alt="Junk Type"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Junk Type</label>
                                    </div>
                                    <div className="magic-type-grid">
                                        {Object.entries(JUNK_TYPES).map(([type, info]) => (
                                            <button
                                                key={type}
                                                className={`magic-type-button ${itemData.junkType === type ? 'selected' : ''}`}
                                                onClick={() => updateItemData({ junkType: type })}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')}
                                                    alt={info.name}
                                                    className="magic-icon"
                                                />
                                                <div className="magic-info">
                                                    <span className="magic-name">{info.name}</span>
                                                    <span className="magic-description">{info.description}</span>
                                                    <span className="magic-description" style={{ fontStyle: 'italic', fontSize: '0.8em' }}>
                                                        Examples: {info.examples}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Condition Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('utility/broken-gear', 'abilities')}
                                            alt="Condition"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Condition</label>
                                    </div>
                                    <div className="magic-type-grid">
                                        {Object.entries(CONDITIONS).map(([condition, info]) => (
                                            <button
                                                key={condition}
                                                className={`magic-type-button ${itemData.condition === condition ? 'selected' : ''}`}
                                                onClick={() => updateItemData({ condition: condition })}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')}
                                                    alt={info.name}
                                                    className="magic-icon"
                                                />
                                                <div className="magic-info">
                                                    <span className="magic-name">{info.name}</span>
                                                    <span className="magic-description">{info.description}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    );
                }
                // Don't show base stats for miscellaneous items
                if (itemData.type === 'miscellaneous') {
                    return (
                        <>
                            <h3 className="wow-heading quality-text">Miscellaneous Details</h3>
                            <div className="spell-wizard-step-content" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                minHeight: '200px',
                                padding: '2rem'
                            }}>
                                <p className="wow-text" style={{
                                    fontSize: '1.2em',
                                    lineHeight: '1.6',
                                    color: '#d4af37',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                                    fontStyle: 'italic'
                                }}>
                                    Ah, a curious trinket of unknown origin and mysterious purpose. Choose a category above to imbue it with specific qualities, or proceed to determine its worth and visual splendor.
                                </p>
                            </div>
                        </>
                    );
                }
                return (
                    <>
                        <h3 className="wow-heading quality-text">Base Stats</h3>
                        <div className="stats-grid">
                            {Object.entries(BASE_STATS).map(([stat, info]) => (
                                <div key={stat} className="stat-item">
                                    <div className="stat-header">
                                        <img src={info.icon} alt={info.name} className="stat-icon" />
                                        <label className="stat-label wow-text">{info.name}</label>
                                    </div>
                                    <div className="stat-input-group">
                                        <button
                                            className="stat-button"
                                            onClick={() => {
                                                const newStats = { ...itemData.baseStats };
                                                newStats[stat] = {
                                                    ...newStats[stat],
                                                    value: newStats[stat].value - 1
                                                };
                                                updateItemData({ baseStats: newStats });
                                            }}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={itemData.baseStats[stat].value}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                const newStats = { ...itemData.baseStats };
                                                newStats[stat] = {
                                                    ...newStats[stat],
                                                    value: val
                                                };
                                                updateItemData({ baseStats: newStats });
                                            }}
                                            className="stat-input wow-input"
                                        />
                                        <button
                                            className="stat-button"
                                            onClick={() => {
                                                const newStats = { ...itemData.baseStats };
                                                newStats[stat] = {
                                                    ...newStats[stat],
                                                    value: newStats[stat].value + 1
                                                };
                                                updateItemData({ baseStats: newStats });
                                            }}
                                        >
                                            +
                                        </button>
                                        <button
                                            className={`type-toggle ${itemData.baseStats[stat].isPercentage ? 'active' : ''}`}
                                            onClick={() => {
                                                const newStats = { ...itemData.baseStats };
                                                newStats[stat] = {
                                                    ...newStats[stat],
                                                    isPercentage: !newStats[stat].isPercentage
                                                };
                                                updateItemData({ baseStats: newStats });
                                            }}
                                        >
                                            {itemData.baseStats[stat].isPercentage ? '%' : '#'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                );

            case STEPS.COMBAT_STATS:
                return (
                    <>
                        <h3 className="wow-heading quality-text">Combat Stats</h3>
                        <div className="combat-stats-grid">

{Object.entries(COMBAT_STATS)
    .filter(([stat, _]) => {
        // Only show health and mana restore for consumables
        if ((stat === 'healthRestore' || stat === 'manaRestore') && itemData.type !== 'consumable') {
            return false;
        }
        return true;
    })
    .map(([stat, info]) => (
        <div key={stat} className="stat-item">
            <div className="stat-header">
                <img
                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')}
                    alt={info.name}
                    className="stat-icon"
                />
                <label className="stat-label wow-text">{info.name}</label>
            </div>
            <div className="stat-input-group">
                <button
                    className="stat-button"
                    onClick={() => {
                        const newStats = { ...itemData.combatStats };
                        newStats[stat] = {
                            ...newStats[stat],
                            value: newStats[stat].value - 1
                        };
                        updateItemData({ combatStats: newStats });
                    }}
                >
                    -
                </button>
                <input
                    type="number"
                    value={itemData.combatStats[stat].value}
                    onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        const newStats = { ...itemData.combatStats };
                        newStats[stat] = {
                            ...newStats[stat],
                            value: val
                        };
                        updateItemData({ combatStats: newStats });
                    }}
                    className="stat-input wow-input"
                />
                <button
                    className="stat-button"
                    onClick={() => {
                        const newStats = { ...itemData.combatStats };
                        newStats[stat] = {
                            ...newStats[stat],
                            value: newStats[stat].value + 1
                        };
                        updateItemData({ combatStats: newStats });
                    }}
                >
                    +
                </button>
                <button
                    className={`type-toggle ${itemData.combatStats[stat].isPercentage ? 'active' : ''}`}
                    onClick={() => {
                        const newStats = { ...itemData.combatStats };
                        newStats[stat] = {
                            ...newStats[stat],
                            isPercentage: !newStats[stat].isPercentage
                        };
                        updateItemData({ combatStats: newStats });
                    }}
                >
                    {itemData.combatStats[stat].isPercentage ? '%' : '#'}
                </button>
            </div>
        </div>
    ))}
                            <div className="spell-damage-section">
                                <h4>Spell Damage</h4>
                                <div className="damage-type-grid">
                                    {Object.entries(DAMAGE_TYPES).map(([type, info]) => {
                                        const damageValue = itemData.combatStats.spellDamage.types[type] || { value: 0, isPercentage: false };
                                        return (
                                            <div key={type} className="damage-type-item">
                                                <div className="damage-type-header">
                                                    <img src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')} alt={info.name} className="damage-type-icon" />
                                                    <label className="damage-type-label wow-text">{info.name}</label>
                                                </div>
                                                <div className="stat-input-group">
                                                    <button
                                                        className="stat-button"
                                                        onClick={() => {
                                                            const newTypes = { ...itemData.combatStats.spellDamage.types };
                                                            newTypes[type] = {
                                                                ...newTypes[type],
                                                                value: (newTypes[type]?.value || 0) - 1
                                                            };
                                                            updateItemData({
                                                                combatStats: {
                                                                    ...itemData.combatStats,
                                                                    spellDamage: {
                                                                        ...itemData.combatStats.spellDamage,
                                                                        types: newTypes
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={damageValue.value}
                                                        onChange={(e) => {
                                                            const val = parseInt(e.target.value) || 0;
                                                            const newTypes = { ...itemData.combatStats.spellDamage.types };
                                                            newTypes[type] = {
                                                                ...newTypes[type],
                                                                value: val
                                                            };
                                                            updateItemData({
                                                                combatStats: {
                                                                    ...itemData.combatStats,
                                                                    spellDamage: {
                                                                        ...itemData.combatStats.spellDamage,
                                                                        types: newTypes
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                        className="stat-input wow-input"
                                                    />
                                                    <button
                                                        className="stat-button"
                                                        onClick={() => {
                                                            const newTypes = { ...itemData.combatStats.spellDamage.types };
                                                            newTypes[type] = {
                                                                ...newTypes[type],
                                                                value: (newTypes[type]?.value || 0) + 1
                                                            };
                                                            updateItemData({
                                                                combatStats: {
                                                                    ...itemData.combatStats,
                                                                    spellDamage: {
                                                                        ...itemData.combatStats.spellDamage,
                                                                        types: newTypes
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        +
                                                    </button>
                                                    <button
                                                        className={`type-toggle ${damageValue.isPercentage ? 'active' : ''}`}
                                                        onClick={() => {
                                                            const newTypes = { ...itemData.combatStats.spellDamage.types };
                                                            newTypes[type] = {
                                                                ...newTypes[type],
                                                                isPercentage: !(newTypes[type]?.isPercentage || false)
                                                            };
                                                            updateItemData({
                                                                combatStats: {
                                                                    ...itemData.combatStats,
                                                                    spellDamage: {
                                                                        ...itemData.combatStats.spellDamage,
                                                                        types: newTypes
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        {damageValue.isPercentage ? '%' : '#'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="resistance-section">
                                <h4>Resistances</h4>
                                <div className="resistance-grid">
                                    {Object.entries(DAMAGE_TYPES).map(([type, info]) => (
                                        <div key={type} className="resistance-item">
                                            <div className="resistance-header">
                                                <img src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')} alt={info.name} className="resistance-icon" />
                                                <label className="resistance-label wow-text">{info.name}</label>
                                            </div>
                                            <div className="resistance-controls">
                                                <select
                                                    value={itemData.combatStats.resistances[type]?.level || 100}
                                                    onChange={(e) => {
                                                        const level = parseInt(e.target.value);
                                                        const selectedLevel = RESISTANCE_LEVELS.find(r => r.value === level);
                                                        const newResistances = { ...itemData.combatStats.resistances };

                                                        if (level === 100) {
                                                            // Normal resistance - remove entry
                                                            delete newResistances[type];
                                                        } else {
                                                            newResistances[type] = {
                                                                level: level,
                                                                label: selectedLevel?.label || 'Normal',
                                                                description: selectedLevel?.description || 'Takes normal damage',
                                                                multiplier: selectedLevel?.multiplier || 1.0,
                                                                color: selectedLevel?.color || '#9e9e9e'
                                                            };
                                                        }

                                                        updateItemData({
                                                            combatStats: {
                                                                ...itemData.combatStats,
                                                                resistances: newResistances
                                                            }
                                                        });
                                                    }}
                                                    className="resistance-select"
                                                    style={{
                                                        color: itemData.combatStats.resistances[type]?.color || '#9e9e9e',
                                                        borderColor: info.color
                                                    }}
                                                >
                                                    {RESISTANCE_LEVELS.map(level => (
                                                        <option
                                                            key={level.value}
                                                            value={level.value}
                                                            style={{ color: level.color }}
                                                        >
                                                            {level.label} ({level.multiplier === 1.0 ? 'Normal' : level.multiplier < 0 ? `Heals ${Math.abs(level.multiplier)}×` : `${level.multiplier}×`})
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="resistance-description">
                                                    {itemData.combatStats.resistances[type]?.description || 'Takes normal damage'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="resistance-section">
                                <h4>Condition Modifiers</h4>
                                <div className="resistance-grid">
                                    {Object.entries(CONDITIONS).map(([conditionId, condition]) => (
                                        <div key={conditionId} className="resistance-item">
                                            <div className="resistance-header">
                                                <img 
                                                    src={condition.icon || getCustomIconUrl('Status/mental/spiral-dizzy', 'abilities')} 
                                                    alt={condition.name} 
                                                    className="resistance-icon" 
                                                />
                                                <label className="resistance-label wow-text">{condition.name}</label>
                                            </div>
                                            <div className="resistance-controls">
                                                <select
                                                    value={itemData.combatStats.conditionModifiers?.[conditionId]?.modifier || 'none'}
                                                    onChange={(e) => {
                                                        const modifier = e.target.value;
                                                        const selectedModifier = CONDITION_MODIFIER_OPTIONS.find(m => m.value === modifier);
                                                        const newConditionModifiers = { ...(itemData.combatStats.conditionModifiers || {}) };

                                                        if (modifier === 'none') {
                                                            // No modifier - remove entry
                                                            delete newConditionModifiers[conditionId];
                                                        } else {
                                                            newConditionModifiers[conditionId] = {
                                                                modifier: modifier,
                                                                label: selectedModifier?.label || 'None',
                                                                description: selectedModifier?.description || 'No modifier',
                                                                color: selectedModifier?.color || '#9e9e9e'
                                                            };
                                                        }

                                                        updateItemData({
                                                            combatStats: {
                                                                ...itemData.combatStats,
                                                                conditionModifiers: newConditionModifiers
                                                            }
                                                        });
                                                    }}
                                                    className="resistance-select"
                                                    style={{
                                                        color: itemData.combatStats.conditionModifiers?.[conditionId]?.color || '#9e9e9e',
                                                        borderColor: condition.color || '#9e9e9e'
                                                    }}
                                                >
                                                    {CONDITION_MODIFIER_OPTIONS.map(option => (
                                                        <option
                                                            key={option.value}
                                                            value={option.value}
                                                            style={{ color: option.color }}
                                                        >
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="resistance-description">
                                                    {itemData.combatStats.conditionModifiers?.[conditionId]?.description || 'No modifier'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                );

            case STEPS.CHANCE_ON_HIT:
                return (
                    <>
                        <StepChanceOnHit itemData={itemData} updateItemData={updateItemData} />
                    </>
                );

            case STEPS.UTILITY:
                return (
                    <>
                        <h3 className="wow-heading quality-text">Utility Stats</h3>
                        {itemData.type === 'weapon' && itemData.weaponStats && itemData.weaponStats.baseDamage && (
                            <>
                                <h4 className="wow-heading">Damage Properties</h4>
                                <div className="damage-grid">
                                    {/* Base Damage Controls Row */}
                                    <div className="damage-controls-row">
                                        <div className="damage-section">
                                            <div className="section-header">
                                                <img src={getIconUrl(DAMAGE_ICONS.base, 'abilities')} alt="Base Damage" className="section-icon" />
                                                <h5 className="wow-heading">Base Damage</h5>
                                            </div>
                                            <div className="damage-content">
                                                <div className="damage-dice-section">
                                                    <div className="dice-input-group">
                                                        <select
                                                            value={itemData.weaponStats?.baseDamage?.diceCount || 1}
                                                            onChange={(e) => {
                                                                const newWeaponStats = { ...itemData.weaponStats };
                                                                if (!newWeaponStats.baseDamage) {
                                                                    newWeaponStats.baseDamage = {};
                                                                }
                                                                newWeaponStats.baseDamage.diceCount = parseInt(e.target.value);
                                                                updateItemData({ weaponStats: newWeaponStats });
                                                            }}
                                                            className="wow-select"
                                                            style={{
                                                                color: itemData.weaponStats?.baseDamage?.damageType ?
                                                                    (PHYSICAL_DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.damageType]?.color ||
                                                                     DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.damageType]?.color) : 'inherit',
                                                                textShadow: itemData.weaponStats?.baseDamage?.damageType ?
                                                                    `0 0 8px ${PHYSICAL_DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.damageType]?.color ||
                                                                              DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.damageType]?.color}` : 'none'
                                                            }}
                                                        >
                                                            {DAMAGE_AMOUNT.map(amount => (
                                                                <option key={amount} value={amount}>{amount}</option>
                                                            ))}
                                                        </select>
                                                        <select
                                                            value={itemData.weaponStats?.baseDamage?.diceType || 'd6'}
                                                            onChange={(e) => {
                                                                const newWeaponStats = { ...itemData.weaponStats };
                                                                if (!newWeaponStats.baseDamage) {
                                                                    newWeaponStats.baseDamage = {};
                                                                }
                                                                newWeaponStats.baseDamage.diceType = e.target.value;
                                                                updateItemData({ weaponStats: newWeaponStats });
                                                            }}
                                                            className="wow-select"
                                                            style={{
                                                                color: itemData.weaponStats?.baseDamage?.damageType ?
                                                                    (PHYSICAL_DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.damageType]?.color ||
                                                                     DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.damageType]?.color) : 'inherit',
                                                                textShadow: itemData.weaponStats?.baseDamage?.damageType ?
                                                                    `0 0 8px ${PHYSICAL_DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.damageType]?.color ||
                                                                              DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.damageType]?.color}` : 'none'
                                                            }}
                                                        >
                                                            {DAMAGE_DICE.map(dice => (
                                                                <option key={dice} value={dice}>{dice}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Full Width Damage Type Selection */}
                                    <div className="damage-type-selection-section">
                                        <div className="section-header">
                                            <h5 className="wow-heading">Select Damage Type</h5>
                                        </div>
                                        <div className="damage-type-section item-editor">
                                            <div className="damage-type-grid">
                                                {/* Physical Damage Types First */}
                                                {Object.entries(PHYSICAL_DAMAGE_TYPES).map(([type, info]) => {
                                                    const descriptions = {
                                                        piercing: "Sharp points that penetrate armor and flesh",
                                                        slashing: "Cutting edges that cleave through defenses",
                                                        bludgeoning: "Crushing force that shatters bone and stone"
                                                    };
                                                    // Convert hex to RGB for glow effects
                                                    const hexToRgb = (hex) => {
                                                        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                                                        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
                                                    };
                                                    return (
                                                    <button
                                                        key={type}
                                                        className={`damage-type-button ${itemData.weaponStats?.baseDamage?.damageType === type ? 'selected' : ''}`}
                                                        onClick={() => {
                                                            const newWeaponStats = { ...itemData.weaponStats };
                                                            if (!newWeaponStats.baseDamage) {
                                                                newWeaponStats.baseDamage = {};
                                                            }
                                                            newWeaponStats.baseDamage.damageType = type;
                                                            updateItemData({ weaponStats: newWeaponStats });
                                                        }}
                                                        style={{
                                                            '--type-color': info.color,
                                                            '--type-color-rgb': hexToRgb(info.color)
                                                        }}
                                                    >
                                                        <img src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')} alt={info.name} className="damage-type-icon" />
                                                        <div className="damage-type-tooltip">
                                                            <span className="damage-type-name">{info.name}</span>
                                                            <span className="damage-type-description">{descriptions[type] || info.description || `${info.name.toLowerCase()} damage`}</span>
                                                        </div>
                                                    </button>
                                                )})}
                                                {/* Magical Damage Types Second */}
                                                {Object.entries(DAMAGE_TYPES).map(([type, info]) => {
                                                    const descriptions = {
                                                        fire: "Searing flames that burn and incinerate",
                                                        cold: "Freezing energy that chills to the bone",
                                                        lightning: "Electric bolts that shock and stun",
                                                        acid: "Corrosive energy that melts and dissolves",
                                                        force: "Pure magical energy that warps reality",
                                                        necrotic: "Death energy that withers and decays",
                                                        radiant: "Divine light that sears and purifies",
                                                        poison: "Toxic essence that corrupts and weakens",
                                                        psychic: "Mental energy that shatters the mind",
                                                        thunder: "Concussive force that deafens and destroys"
                                                    };
                                                    // Convert hex to RGB for glow effects
                                                    const hexToRgb = (hex) => {
                                                        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                                                        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
                                                    };
                                                    return (
                                                    <button
                                                        key={type}
                                                        className={`damage-type-button ${itemData.weaponStats?.baseDamage?.damageType === type ? 'selected' : ''}`}
                                                        onClick={() => {
                                                            const newWeaponStats = { ...itemData.weaponStats };
                                                            if (!newWeaponStats.baseDamage) {
                                                                newWeaponStats.baseDamage = {};
                                                            }
                                                            newWeaponStats.baseDamage.damageType = type;
                                                            updateItemData({ weaponStats: newWeaponStats });
                                                        }}
                                                        style={{
                                                            '--type-color': info.color,
                                                            '--type-color-rgb': hexToRgb(info.color)
                                                        }}
                                                    >
                                                        <img src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')} alt={info.name} className="damage-type-icon" />
                                                        <div className="damage-type-tooltip">
                                                            <span className="damage-type-name">{info.name}</span>
                                                            <span className="damage-type-description">{descriptions[type] || info.description || `${info.name.toLowerCase()} damage`}</span>
                                                        </div>
                                                    </button>
                                                )})}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bonus Damage and Critical Hit Row */}
                                    <div className="damage-controls-row">
                                        <div className="damage-section">
                                            <div className="section-header">
                                                <img src={getIconUrl(DAMAGE_ICONS.bonus, 'abilities')} alt="Bonus Damage" className="section-icon" />
                                                <h5 className="wow-heading">Bonus Damage</h5>
                                            </div>
                                            <div className="damage-content">
                                                <div className="bonus-damage-section">
                                                    <div className="bonus-input-group">
                                                        <button
                                                            className="stat-button"
                                                            onClick={() => {
                                                                const newWeaponStats = { ...itemData.weaponStats };
                                                                if (!newWeaponStats.baseDamage) {
                                                                    newWeaponStats.baseDamage = {};
                                                                }
                                                                newWeaponStats.baseDamage.bonusDamage = Math.max(0, (newWeaponStats.baseDamage.bonusDamage || 0) - 1);
                                                                updateItemData({ weaponStats: newWeaponStats });
                                                            }}
                                                        >
                                                            -
                                                        </button>
                                                        <input
                                                            type="number"
                                                            value={itemData.weaponStats?.baseDamage?.bonusDamage || 0}
                                                            onChange={(e) => {
                                                                const newWeaponStats = { ...itemData.weaponStats };
                                                                if (!newWeaponStats.baseDamage) {
                                                                    newWeaponStats.baseDamage = {};
                                                                }
                                                                const value = e.target.value === '' ? 0 : Math.max(-20, Math.min(20, parseInt(e.target.value) || 0));
                                                                newWeaponStats.baseDamage.bonusDamage = value;
                                                                updateItemData({ weaponStats: newWeaponStats });
                                                            }}
                                                            className="stat-input wow-input"
                                                            style={{
                                                                color: itemData.weaponStats?.baseDamage?.bonusDamageType ?
                                                                    (PHYSICAL_DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.bonusDamageType]?.color ||
                                                                     DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.bonusDamageType]?.color) : 'inherit',
                                                                textShadow: itemData.weaponStats?.baseDamage?.bonusDamageType ?
                                                                    `0 0 8px ${PHYSICAL_DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.bonusDamageType]?.color ||
                                                                              DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.bonusDamageType]?.color}` : 'none'
                                                            }}
                                                        />
                                                        <button
                                                            className="stat-button"
                                                            onClick={() => {
                                                                const newWeaponStats = { ...itemData.weaponStats };
                                                                if (!newWeaponStats.baseDamage) {
                                                                    newWeaponStats.baseDamage = {};
                                                                }
                                                                newWeaponStats.baseDamage.bonusDamage = (newWeaponStats.baseDamage.bonusDamage || 0) + 1;
                                                                updateItemData({ weaponStats: newWeaponStats });
                                                            }}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="damage-type-section item-editor">
                                                    <div className="damage-type-grid">
                                                        {/* Physical Damage Types First */}
                                                        {Object.entries(PHYSICAL_DAMAGE_TYPES).map(([type, info]) => {
                                                            const descriptions = {
                                                                piercing: "Sharp points that penetrate armor and flesh",
                                                                slashing: "Cutting edges that cleave through defenses",
                                                                bludgeoning: "Crushing force that shatters bone and stone"
                                                            };
                                                            // Convert hex to RGB for glow effects
                                                            const hexToRgb = (hex) => {
                                                                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                                                                return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
                                                            };
                                                            return (
                                                            <button
                                                                key={type}
                                                                className={`damage-type-button ${itemData.weaponStats?.baseDamage?.bonusDamageType === type ? 'selected' : ''}`}
                                                                onClick={() => {
                                                                    const newWeaponStats = { ...itemData.weaponStats };
                                                                    newWeaponStats.baseDamage.bonusDamageType = type;
                                                                    updateItemData({ weaponStats: newWeaponStats });
                                                                }}
                                                                style={{
                                                                    '--type-color': info.color,
                                                                    '--type-color-rgb': hexToRgb(info.color)
                                                                }}
                                                            >
                                                                <img src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')} alt={info.name} className="damage-type-icon" />
                                                                <div className="damage-type-tooltip">
                                                                    <span className="damage-type-name">{info.name}</span>
                                                                    <span className="damage-type-description">{descriptions[type] || info.description || `${info.name.toLowerCase()} damage`}</span>
                                                                </div>
                                                            </button>
                                                        )})}
                                                        {/* Magical Damage Types Second */}
                                                        {Object.entries(DAMAGE_TYPES).map(([type, info]) => {
                                                            const descriptions = {
                                                                fire: "Searing flames that burn and incinerate",
                                                                cold: "Freezing energy that chills to the bone",
                                                                lightning: "Electric bolts that shock and stun",
                                                                acid: "Corrosive energy that melts and dissolves",
                                                                force: "Pure magical energy that warps reality",
                                                                necrotic: "Death energy that withers and decays",
                                                                radiant: "Divine light that sears and purifies",
                                                                poison: "Toxic essence that corrupts and weakens",
                                                                psychic: "Mental energy that shatters the mind",
                                                                thunder: "Concussive force that deafens and destroys"
                                                            };
                                                            // Convert hex to RGB for glow effects
                                                            const hexToRgb = (hex) => {
                                                                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                                                                return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
                                                            };
                                                            return (
                                                            <button
                                                                key={type}
                                                                className={`damage-type-button ${itemData.weaponStats?.baseDamage?.bonusDamageType === type ? 'selected' : ''}`}
                                                                onClick={() => {
                                                                    const newWeaponStats = { ...itemData.weaponStats };
                                                                    newWeaponStats.baseDamage.bonusDamageType = type;
                                                                    updateItemData({ weaponStats: newWeaponStats });
                                                                }}
                                                                style={{
                                                                    '--type-color': info.color,
                                                                    '--type-color-rgb': hexToRgb(info.color)
                                                                }}
                                                            >
                                                                <img src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')} alt={info.name} className="damage-type-icon" />
                                                                <div className="damage-type-tooltip">
                                                                    <span className="damage-type-name">{info.name}</span>
                                                                    <span className="damage-type-description">{descriptions[type] || info.description || `${info.name.toLowerCase()} damage`}</span>
                                                                </div>
                                                            </button>
                                                        )})}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="utility-section">
                            <h5 className="wow-heading">Utility Stats</h5>
                            <div className="utility-stats-grid">
                            <div className="stat-item">
                                <div className="stat-header">
                                    <img src={UTILITY_STATS.movementSpeed.icon} alt="Movement Speed" className="stat-icon" />
                                    <label className="stat-label wow-text">Movement Speed</label>
                                </div>
                                <div className="stat-input-group">
                                    <button
                                        className="stat-button"
                                        onClick={() => {
                                            const newStats = { ...itemData.utilityStats };
                                            newStats.movementSpeed = {
                                                ...newStats.movementSpeed,
                                                value: newStats.movementSpeed.value - 1
                                            };
                                            updateItemData({ utilityStats: newStats });
                                        }}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={itemData.utilityStats.movementSpeed.value}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value) || 0;
                                            const newStats = { ...itemData.utilityStats };
                                            newStats.movementSpeed = {
                                                ...newStats.movementSpeed,
                                                value: val
                                            };
                                            updateItemData({ utilityStats: newStats });
                                        }}
                                        className="stat-input wow-input"
                                    />
                                    <button
                                        className="stat-button"
                                        onClick={() => {
                                            const newStats = { ...itemData.utilityStats };
                                            newStats.movementSpeed = {
                                                ...newStats.movementSpeed,
                                                value: newStats.movementSpeed.value + 1
                                            };
                                            updateItemData({ utilityStats: newStats });
                                        }}
                                    >
                                        +
                                    </button>
                                    <button
                                        className={`type-toggle ${itemData.utilityStats.movementSpeed.isPercentage ? 'active' : ''}`}
                                        onClick={() => {
                                            const newStats = { ...itemData.utilityStats };
                                            newStats.movementSpeed = {
                                                ...newStats.movementSpeed,
                                                isPercentage: !newStats.movementSpeed.isPercentage
                                            };
                                            updateItemData({ utilityStats: newStats });
                                        }}
                                    >
                                        {itemData.utilityStats.movementSpeed.isPercentage ? '%' : '#'}
                                    </button>
                                </div>
                            </div>
                            <div className="stat-item">
    <div className="stat-header">
        <img src={UTILITY_STATS.swimSpeed.icon} alt="Swim Speed" className="stat-icon" />
        <label className="stat-label wow-text">Swim Speed</label>
    </div>
    <div className="stat-input-group">
        <button
            className="stat-button"
            onClick={() => {
                const newStats = { ...itemData.utilityStats };
                newStats.swimSpeed = {
                    ...newStats.swimSpeed,
                    value: newStats.swimSpeed.value - 1
                };
                updateItemData({ utilityStats: newStats });
            }}
        >
            -
        </button>
        <input
            type="number"
            value={itemData.utilityStats.swimSpeed.value}
            onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                const newStats = { ...itemData.utilityStats };
                newStats.swimSpeed = {
                    ...newStats.swimSpeed,
                    value: val
                };
                updateItemData({ utilityStats: newStats });
            }}
            className="stat-input wow-input"
        />
        <button
            className="stat-button"
            onClick={() => {
                const newStats = { ...itemData.utilityStats };
                newStats.swimSpeed = {
                    ...newStats.swimSpeed,
                    value: newStats.swimSpeed.value + 1
                };
                updateItemData({ utilityStats: newStats });
            }}
        >
            +
        </button>
        <button
            className={`type-toggle ${itemData.utilityStats.swimSpeed.isPercentage ? 'active' : ''}`}
            onClick={() => {
                const newStats = { ...itemData.utilityStats };
                newStats.swimSpeed = {
                    ...newStats.swimSpeed,
                    isPercentage: !newStats.swimSpeed.isPercentage
                };
                updateItemData({ utilityStats: newStats });
            }}
        >
            {itemData.utilityStats.swimSpeed.isPercentage ? '%' : '#'}
        </button>
    </div>
</div>
                            {/* Duration Type for Consumables */}
                            {itemData.type === 'consumable' && (
                                <div className="stat-item">
                                    <div className="stat-header">
                                        <img
                                            src={getIconUrl('holy-cross', 'spells')}
                                            alt="Duration Type"
                                            className="stat-icon"
                                        />
                                        <label className="stat-label wow-text">Duration Type</label>
                                    </div>
                                    <div className="stat-input-group">
                                        <select
                                            value={itemData.utilityStats?.duration?.type || 'ROUNDS'}
                                            onChange={(e) => {
                                                updateItemData({
                                                    utilityStats: {
                                                        ...itemData.utilityStats,
                                                        duration: {
                                                            ...itemData.utilityStats?.duration,
                                                            type: e.target.value
                                                        }
                                                    }
                                                });
                                            }}
                                            className="stat-input wow-input"
                                        >
                                            {Object.entries(DURATION_TYPES).map(([key, value]) => (
                                                <option key={key} value={key}>{value.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Duration Value for Consumables */}
                            {itemData.type === 'consumable' && (
                                <div className="stat-item">
                                    <div className="stat-header">
                                        <img
                                            src={getIconUrl('inv_misc_pocketwatch_01', 'items')}
                                            alt="Duration Value"
                                            className="stat-icon"
                                        />
                                        <label className="stat-label wow-text">Duration Value</label>
                                    </div>
                                    <div className="stat-input-group">
                                        <button
                                            className="stat-button"
                                            onClick={() => {
                                                const currentValue = itemData.utilityStats?.duration?.value || 1;
                                                if (currentValue > 1) {
                                                    updateItemData({
                                                        utilityStats: {
                                                            ...itemData.utilityStats,
                                                            duration: {
                                                                ...itemData.utilityStats?.duration,
                                                                value: currentValue - 1
                                                            }
                                                        }
                                                    });
                                                }
                                            }}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={itemData.utilityStats?.duration?.value || 1}
                                            onChange={(e) => {
                                                const val = Math.max(1, parseInt(e.target.value) || 1);
                                                updateItemData({
                                                    utilityStats: {
                                                        ...itemData.utilityStats,
                                                        duration: {
                                                            ...itemData.utilityStats?.duration,
                                                            value: val
                                                        }
                                                    }
                                                });
                                            }}
                                            className="stat-input wow-input"
                                        />
                                        <button
                                            className="stat-button"
                                            onClick={() => {
                                                const currentValue = itemData.utilityStats?.duration?.value || 1;
                                                updateItemData({
                                                    utilityStats: {
                                                        ...itemData.utilityStats,
                                                        duration: {
                                                            ...itemData.utilityStats?.duration,
                                                            value: currentValue + 1
                                                        }
                                                    }
                                                });
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="stat-item">
                                <div className="stat-header">
                                    <img src={UTILITY_STATS.carryingCapacity.icon} alt="Carrying Capacity" className="stat-icon" />
                                    <label className="stat-label wow-text">Carrying Capacity</label>
                                </div>
                                <div className="carrying-capacity-section">
                                    <label className="capacity-toggle">
                                        <div className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                id="carrying-capacity-toggle"
                                                checked={itemData.utilityStats.carryingCapacity.enabled}
                                                onChange={(e) => {
                                                    const newUtilityStats = { ...itemData.utilityStats };
                                                    newUtilityStats.carryingCapacity.enabled = e.target.checked;
                                                    updateItemData({ utilityStats: newUtilityStats });
                                                }}
                                            />
                                            <span className="slider"></span>
                                        </div>
                                        <span>Additional Inventory Space</span>
                                    </label>

                                    {itemData.utilityStats.carryingCapacity.enabled && (
                                        <div className="slots-input">
                                            <label>Additional Slots:</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="25"
                                                value={itemData.utilityStats.carryingCapacity.slots === 0 ? '' : itemData.utilityStats.carryingCapacity.slots}
                                                onChange={(e) => {
                                                    const slots = e.target.value === '' ? 0 : Math.max(0, Math.min(25, parseInt(e.target.value) || 0));
                                                    const newUtilityStats = { ...itemData.utilityStats };
                                                    newUtilityStats.carryingCapacity = {
                                                        ...newUtilityStats.carryingCapacity,
                                                        slots
                                                    };
                                                    updateItemData({ utilityStats: newUtilityStats });
                                                }}
                                                className="wow-input"
                                            />
                                        </div>
                                    )}
                                    {itemData.utilityStats.carryingCapacity.enabled && (
                                        <div className="capacity-preview">
                                            <div className="preview-label">Additional Inventory Space:</div>
                                            <div className="additional-slots-grid">
                                                {Array(itemData.utilityStats.carryingCapacity.slots || 1)
                                                    .fill(null)
                                                    .map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className="additional-slot"
                                                            // Removed title to prevent browser tooltip conflict
                                                        >
                                                            <div className="slot-plus">+</div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        </div>
                    </>
                );

            case STEPS.VALUE:
                return (
                    <>
                        <h3 className="wow-heading quality-text">Item Value</h3>
                        <div className="currency-grid">
                                <div className="currency-item">
                                    <div className="currency-header">
                                        <img
                                            src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
                                            alt="Platinum"
                                            className="currency-icon coin-platinum"
                                        />
                                        <label className="currency-label wow-text">Platinum</label>
                                    </div>
                                    <div className="stat-input-group">
                                        <button
                                            className="stat-button"
                                            onClick={() => updateItemData({
                                                value: { ...itemData.value, platinum: Math.max(0, (itemData.value.platinum || 0) - 1) }
                                            })}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            min="0"
                                            value={itemData.value.platinum || 0}
                                            onChange={(e) => updateItemData({
                                                value: { ...itemData.value, platinum: Math.max(0, parseInt(e.target.value) || 0) }
                                            })}
                                            className="stat-input wow-input"
                                            placeholder="0"
                                        />
                                        <button
                                            className="stat-button"
                                            onClick={() => updateItemData({
                                                value: { ...itemData.value, platinum: (itemData.value.platinum || 0) + 1 }
                                            })}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        className="randomize-button"
                                        onClick={() => updateItemData({
                                            value: { ...itemData.value, platinum: Math.floor(Math.random() * 99) + 1 }
                                        })}
                                        title="Randomize Platinum (1-99)"
                                    >
                                        🎲
                                    </button>
                                </div>

                                <div className="currency-item">
                                    <div className="currency-header">
                                        <img
                                            src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
                                            alt="Gold"
                                            className="currency-icon coin-gold"
                                        />
                                        <label className="currency-label wow-text">Gold</label>
                                    </div>
                                    <div className="stat-input-group">
                                        <button
                                            className="stat-button"
                                            onClick={() => updateItemData({
                                                value: { ...itemData.value, gold: Math.max(0, (itemData.value.gold || 0) - 1) }
                                            })}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            min="0"
                                            value={itemData.value.gold || 0}
                                            onChange={(e) => updateItemData({
                                                value: { ...itemData.value, gold: Math.max(0, parseInt(e.target.value) || 0) }
                                            })}
                                            className="stat-input wow-input"
                                            placeholder="0"
                                        />
                                        <button
                                            className="stat-button"
                                            onClick={() => updateItemData({
                                                value: { ...itemData.value, gold: (itemData.value.gold || 0) + 1 }
                                            })}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        className="randomize-button"
                                        onClick={() => updateItemData({
                                            value: { ...itemData.value, gold: Math.floor(Math.random() * 99) + 1 }
                                        })}
                                        title="Randomize Gold (1-99)"
                                    >
                                        🎲
                                    </button>
                                </div>

                                <div className="currency-item">
                                    <div className="currency-header">
                                        <img
                                            src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
                                            alt="Silver"
                                            className="currency-icon coin-silver"
                                        />
                                        <label className="currency-label wow-text">Silver</label>
                                    </div>
                                    <div className="stat-input-group">
                                        <button
                                            className="stat-button"
                                            onClick={() => updateItemData({
                                                value: { ...itemData.value, silver: Math.max(0, Math.min(99, (itemData.value.silver || 0) - 1)) }
                                            })}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            min="0"
                                            max="99"
                                            value={itemData.value.silver || 0}
                                            onChange={(e) => updateItemData({
                                                value: { ...itemData.value, silver: Math.max(0, Math.min(99, parseInt(e.target.value) || 0)) }
                                            })}
                                            className="stat-input wow-input"
                                            placeholder="0"
                                        />
                                        <button
                                            className="stat-button"
                                            onClick={() => updateItemData({
                                                value: { ...itemData.value, silver: Math.min(99, (itemData.value.silver || 0) + 1) }
                                            })}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        className="randomize-button"
                                        onClick={() => updateItemData({
                                            value: { ...itemData.value, silver: Math.floor(Math.random() * 99) + 1 }
                                        })}
                                        title="Randomize Silver (1-99)"
                                    >
                                        🎲
                                    </button>
                                </div>

                                <div className="currency-item">
                                    <div className="currency-header">
                                        <img
                                            src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
                                            alt="Copper"
                                            className="currency-icon coin-copper"
                                        />
                                        <label className="currency-label wow-text">Copper</label>
                                    </div>
                                    <div className="stat-input-group">
                                        <button
                                            className="stat-button"
                                            onClick={() => updateItemData({
                                                value: { ...itemData.value, copper: Math.max(0, Math.min(99, (itemData.value.copper || 0) - 1)) }
                                            })}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            min="0"
                                            max="99"
                                            value={itemData.value.copper || 0}
                                            onChange={(e) => updateItemData({
                                                value: { ...itemData.value, copper: Math.max(0, Math.min(99, parseInt(e.target.value) || 0)) }
                                            })}
                                            className="stat-input wow-input"
                                            placeholder="0"
                                        />
                                        <button
                                            className="stat-button"
                                            onClick={() => updateItemData({
                                                value: { ...itemData.value, copper: Math.min(99, (itemData.value.copper || 0) + 1) }
                                            })}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        className="randomize-button"
                                        onClick={() => updateItemData({
                                            value: { ...itemData.value, copper: Math.floor(Math.random() * 99) + 1 }
                                        })}
                                        title="Randomize Copper (1-99)"
                                    >
                                        🎲
                                    </button>
                                </div>
                            </div>
                            <div className="value-total">
                                <button
                                    className="randomize-all-button"
                                    onClick={() => updateItemData({
                                        value: {
                                            ...itemData.value,
                                            platinum: Math.floor(Math.random() * 99) + 1,
                                            gold: Math.floor(Math.random() * 99) + 1,
                                            silver: Math.floor(Math.random() * 99) + 1,
                                            copper: Math.floor(Math.random() * 99) + 1
                                        }
                                    })}
                                    title="Randomize All Currencies (1-99 each)"
                                >
                                    🎲 RANDOMIZE ALL
                                </button>
                                <div className="total-content">
                                    <span className="total-label">Total Value:</span>
                                    <span className="currency-display">
                                        {(itemData.value.platinum || 0) > 0 && (
                                            <>
                                                <span className="platinum-amount">{itemData.value.platinum}</span>
                                                <span className="platinum-symbol">p</span>
                                            </>
                                        )}
                                        <span className="gold-amount">{itemData.value.gold || 0}</span>
                                        <span className="gold-symbol">g</span>
                                        <span className="silver-amount">{itemData.value.silver || 0}</span>
                                        <span className="silver-symbol">s</span>
                                        <span className="copper-amount">{itemData.value.copper || 0}</span>
                                        <span className="copper-symbol">c</span>
                                    </span>
                                </div>
                            </div>
                    </>
                );

                case STEPS.APPEARANCE: {
                    return (
                        <>
                            <h3 className="wow-heading quality-text">Item Appearance</h3>
                            {Object.entries(WOW_ICONS).map(([category, items]) => {
                                    const isOpen = openCategories.has(category);
                                    return (
                                        <div key={category} className="wow-icon-category">
                                            <h4
                                                className="wow-category-title"
                                                onClick={() => {
                                                    const newOpenCategories = new Set(openCategories);
                                                    if (isOpen) {
                                                        newOpenCategories.delete(category);
                                                    } else {
                                                        newOpenCategories.add(category);
                                                    }
                                                    setOpenCategories(newOpenCategories);
                                                }}
                                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                            >
                                                {category.charAt(0).toUpperCase() + category.slice(1)}
                                                <span className="category-toggle">{isOpen ? ' ▲' : ' ▼'}</span>
                                            </h4>
                                            {isOpen && (
                                                <div className="wow-icon-grid">
                                            {(() => {
                                                // Flatten all items into a single array regardless of structure
                                                const allItems = Array.isArray(items)
                                                    ? items
                                                    : Object.values(items).flat();
                                                
                                                // Remove duplicates based on item.id
                                                const uniqueItems = allItems.filter((item, index, self) =>
                                                    index === self.findIndex(i => i.id === item.id)
                                                );
                                                
                                                return uniqueItems.map(item => (
                                                    <button
                                                        key={item.id}
                                                        className={`wow-icon-button ${itemData.iconId === item.id ? 'selected' : ''}`}
                                                        onClick={() => updateItemData({
                                                            iconId: item.id,
                                                            imageUrl: getIconUrl(item.id, 'items')
                                                        })}
                                                    >
                                                        <img
                                                            src={getIconUrl(item.id, 'items')}
                                                            alt={item.name}
                                                            className="wow-item-icon"
                                                        />
                                                        <span className="wow-icon-name">{item.name}</span>
                                                    </button>
                                                ));
                                            })()}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                <div className="wow-custom-url-section">
                                    <h4 className="wow-section-title">Custom Image URL</h4>
                                    <input
                                        type="text"
                                        value={itemData.imageUrl || ''}
                                        onChange={(e) => updateItemData({ imageUrl: e.target.value })}
                                        placeholder="Enter custom image URL..."
                                        className="wow-input"
                                    />
                                </div>
                                <div className="wow-preview-section">
                                    <h4 className="wow-section-title">Preview</h4>
                                    <div className="wow-item-preview">
                                        <img
                                            src={itemData.imageUrl || (itemData.iconId ? getIconUrl(itemData.iconId, 'items') : DEFAULT_ITEM_IMAGE)}
                                            alt="Item Preview"
                                            className="wow-preview-image"
                                            onError={(e) => {
                                                e.target.src = DEFAULT_ITEM_IMAGE;
                                            }}
                                        />
                                    </div>
                                </div>
                        </>
                    );
                }

            default:
                return null;
        }
    };



    // Get window scale from game store
    const windowScale = useGameStore(state => state.windowScale);

    // Generate unique window ID
    const windowId = useRef(`item-wizard-${Date.now()}-${Math.random()}`).current;
    const [overlayZIndex, setOverlayZIndex] = useState(2000);
    const [modalZIndex, setModalZIndex] = useState(2001);

    // Window manager store actions
    const registerWindow = useWindowManagerStore(state => state.registerWindow);
    const unregisterWindow = useWindowManagerStore(state => state.unregisterWindow);

    // Register modal with window manager on mount
    useEffect(() => {
        const baseZIndex = registerWindow(windowId, 'modal');
        setOverlayZIndex(baseZIndex);
        setModalZIndex(baseZIndex + 1);

        return () => {
            unregisterWindow(windowId);
        };
    }, [windowId, registerWindow, unregisterWindow]);

    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState(() => ({
        x: Math.max(50, (window.innerWidth - 800) / 2),
        y: Math.max(50, (window.innerHeight - 600) / 2)
    }));
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const modalRef = useRef(null);

    // Window position and size for external preview
    const [windowPosition, setWindowPosition] = useState(() => ({
        x: Math.max(50, (window.innerWidth - 800) / 2),
        y: Math.max(50, (window.innerHeight - 600) / 2)
    }));
    const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
    const [tooltipPosition, setTooltipPosition] = useState({ visible: false, x: 0, y: 0, stepName: '' });

    const handleMouseDown = (e) => {
        // Allow dragging from anywhere on the window, but not from interactive elements
        if (!e.target.closest('button, input, select, textarea, .wizard-nav-controls, .close-button')) {
            setIsDragging(true);
            const rect = modalRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };

    // Listen for window scale changes
    useEffect(() => {
        const handleWindowScaleChange = (event) => {
            // Force a re-render to apply the new scale
            setPosition(prev => ({ ...prev }));
        };

        window.addEventListener('windowScaleChanged', handleWindowScaleChange);
        return () => window.removeEventListener('windowScaleChanged', handleWindowScaleChange);
    }, [windowScale]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging && modalRef.current) {
                const newX = e.clientX - dragOffset.x;
                const newY = e.clientY - dragOffset.y;
                const newPosition = { x: newX, y: newY };
                setPosition(newPosition);
                setWindowPosition(newPosition);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    const prevStep = () => {
        let newStep = currentStep - 1;
        if (itemData.type === 'miscellaneous' || itemData.type === 'currency') {
            // Skip combat, chance-on-hit, and utility steps
            if (newStep === STEPS.UTILITY || newStep === STEPS.CHANCE_ON_HIT || newStep === STEPS.COMBAT_STATS) {
                newStep = STEPS.STATS;
            }
        }
        setCurrentStep(newStep);
    };

    const nextStep = () => {
        let newStep = currentStep + 1;
        if (itemData.type === 'miscellaneous' || itemData.type === 'currency') {
            // Skip combat, chance-on-hit, and utility steps
            if (newStep === STEPS.COMBAT_STATS || newStep === STEPS.CHANCE_ON_HIT || newStep === STEPS.UTILITY) {
                newStep = STEPS.VALUE;
            }
        }
        setCurrentStep(newStep);
    };

    const handleStepMouseEnter = (e, stepName, stepInfo) => {
        const rect = e.currentTarget.getBoundingClientRect();
        // Account for window scaling - getBoundingClientRect already accounts for transforms
        const tooltipX = rect.left + rect.width / 2; // Center horizontally
        const tooltipY = rect.top - 12; // Position above the button (12px gap)
        setTooltipPosition({
            visible: true,
            x: tooltipX,
            y: tooltipY,
            stepName,
            stepInfo
        });
    };

    const handleStepMouseLeave = () => {
        setTooltipPosition({ visible: false, x: 0, y: 0, stepName: '' });
    };

    const renderProgressBar = () => {
        // Filter out combat, chance-on-hit, and utility steps for miscellaneous and currency items
        const relevantSteps = Object.entries(STEPS).filter(([_, stepIndex]) => {
            if (itemData.type === 'miscellaneous' || itemData.type === 'currency') {
                return ![STEPS.COMBAT_STATS, STEPS.CHANCE_ON_HIT, STEPS.UTILITY].includes(stepIndex);
            }
            return true;
        });

        const totalSteps = relevantSteps.length;
        const currentProgress = ((currentStep + 1) / totalSteps) * 100;

        return (
            <div className="wow-progress-bar">
                <div
                    className="wow-progress-fill"
                    style={{ width: `${currentProgress}%` }}
                />
                <div className="wow-progress-segments">
                    {relevantSteps.map(([stepName, stepIndex]) => {
                        const stepInfo = getStepInfo(stepIndex, itemData.type);
                        return (
                            <div
                                key={stepName}
                                className={`wow-progress-segment ${
                                    stepIndex < currentStep ? 'completed' : ''
                                } ${stepIndex === currentStep ? 'active' : ''}`}
                                onClick={() => setCurrentStep(stepIndex)}
                                onMouseEnter={(e) => handleStepMouseEnter(e, stepName, stepInfo)}
                                onMouseLeave={handleStepMouseLeave}
                            >
                                <img
                                    src={getIconUrl(stepInfo.icon, 'items')}
                                    alt={stepInfo.name}
                                    className="step-icon"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };


    // Get safe portal target
    const portalTarget = getSafePortalTarget();

    // Safety check - don't render if no portal target available
    if (!portalTarget) {
        console.error('ItemWizard: No portal target available, cannot render');
        return null;
    }

    return createPortal(
        <SpellLibraryProvider>
            {/* Overlay - rendered as sibling to modal */}
            <div
                className="modal-backdrop"
                style={{ zIndex: overlayZIndex }}
            />

            {/* Modal - rendered as sibling to overlay */}
            <div
                ref={modalRef}
                className="item-wizard-modal spellbook-wizard-layout"
                data-quality={itemData.quality || 'common'}
                style={{
                    position: 'fixed',
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    width: '800px',
                    height: '700px',
                    cursor: isDragging ? 'grabbing' : 'default',
                    transformOrigin: 'top left',
                    transform: `scale(${windowScale})`,
                    willChange: 'transform',
                    zIndex: modalZIndex // Use managed z-index
                }}
                onMouseDown={handleMouseDown}
            >
                <div className="item-wizard-content spellbook-wizard-layout">
                    <div className="wizard-header">
                        <button
                            className="wizard-nav-btn wizard-nav-previous"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                        >
                            Previous
                        </button>
                        <div className="wizard-progress-container">
                            {renderProgressBar()}
                        </div>
                        {currentStep === Object.keys(STEPS).length - 1 ? (
                            <button
                                className="wizard-nav-btn wizard-nav-create"
                                onClick={() => handleClose(itemData)}
                            >
                                Create Item
                            </button>
                        ) : (
                            <button
                                className="wizard-nav-btn wizard-nav-next"
                                onClick={nextStep}
                            >
                                Next
                            </button>
                        )}
                        <button className="close-button" onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleClose();
                        }}>×</button>
                    </div>
                    {/* Single column layout - Preview is now external */}
                    <div className="wizard-main-content">
                        <div className="spell-wizard-step-content">
                            {renderStep()}
                        </div>
                    </div>
                </div>
            </div>

            {/* External Item Preview */}
            <ExternalItemPreview
                itemData={itemData}
                windowPosition={windowPosition}
                windowSize={windowSize}
                isOpen={true}
            />

            {/* Progress Bar Tooltip - Rendered outside modal to escape clipping */}
            {tooltipPosition.visible && tooltipPosition.stepInfo && (
                <div
                    className="step-tooltip-fixed"
                    style={{
                        position: 'fixed',
                        left: `${tooltipPosition.x}px`,
                        top: `${tooltipPosition.y}px`,
                        transform: 'translateX(-50%) translateY(-100%)',
                        zIndex: 99999,
                        pointerEvents: 'none'
                    }}
                >
                    <div className="tooltip-header">
                        <img
                            src={getIconUrl(tooltipPosition.stepInfo.icon, 'items')}
                            alt={tooltipPosition.stepInfo.name}
                            className="tooltip-icon"
                        />
                        <span className="tooltip-title">{tooltipPosition.stepInfo.name}</span>
                    </div>
                    <div className="tooltip-description">
                        {tooltipPosition.stepInfo.description}
                    </div>
                </div>
            )}
        </SpellLibraryProvider>,
        portalTarget
    );
}
