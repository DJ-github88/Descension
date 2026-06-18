import { STEPS } from './wizardSteps';
import { getIconUrl } from '../../utils/assetManager';
import { RARITY_COLORS } from '../../constants/itemConstants';
export const DEFAULT_ITEM_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2NiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

export const STEP_INFO = {
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
    [STEPS.DURABILITY]: {
        name: 'Durability',
        icon: 'Armor/Chest/chest-bronze-breastplate',
        description: 'Set how much punishment this item can withstand before breaking.'
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
export const getStepInfo = (step, itemType) => {
    if (step === STEPS.STATS) {
        return itemType === 'miscellaneous'
            ? STEP_INFO[step].getMiscInfo()
            : STEP_INFO[step].getRegularInfo();
    }
    return STEP_INFO[step];
};

export const WEAPON_SLOTS = {
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

export const HAND_OPTIONS = {
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

export const WEAPON_SUBTYPES = {
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

export const OFF_HAND_TYPES = {
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

export const ARMOR_QUALITIES = {
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

export const EQUIPMENT_SLOTS = {
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

export const CONSUMABLE_TYPES = {
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

export const MISC_TYPES = {
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

export const ITEM_TYPES = {
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

export const BASE_STATS = {
    constitution: { name: 'Constitution', icon: getIconUrl('Healing/Heart Shield', 'abilities') },
    strength: { name: 'Strength', icon: getIconUrl('General/Strength', 'abilities') },
    agility: { name: 'Agility', icon: getIconUrl('Piercing/Scatter Shot', 'abilities') },
    intelligence: { name: 'Intelligence', icon: getIconUrl('Psychic/Brain Psionics', 'abilities') },
    spirit: { name: 'Spirit', icon: getIconUrl('Radiant/Radiant Aura', 'abilities') },
    charisma: { name: 'Charisma', icon: getIconUrl('Radiant/Radiant Aura', 'abilities') }
};

export const COMBAT_STATS = {
    healthRestore: {
        name: 'Health Restore',
        icon: 'Healing/Golden Heart',
        description: 'Amount of health restored (negative = drain)'
    },
    manaRestore: {
        name: 'Mana Restore',
        icon: 'Arcane/Orb Manipulation',
        description: 'Amount of mana restored (negative = drain)'
    },
    apRestore: {
        name: 'AP Restore',
        icon: 'Arcane/Enchanted Sword 2',
        description: 'Amount of action points restored (negative = drain)'
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
};

export const DAMAGE_TYPES = {
    physical: {
        name: 'Physical',
        icon: 'Bludgeoning/Hammer Crush',
        color: '#6B4226'
    },
    ember: {
        name: 'Ember',
        icon: 'Fire/Volcanic Corruption',
        color: '#D4380D'
    },
    rime: {
        name: 'Rime',
        icon: 'Frost/Frostbite Variant 2',
        color: '#2C5F7C'
    },
    storm: {
        name: 'Storm',
        icon: 'Lightning/Thunderstorm',
        color: '#8B7328'
    },
    arcane: {
        name: 'Arcane',
        icon: 'Arcane/Ebon Blaze',
        color: '#5B3A8C'
    },
    primal: {
        name: 'Primal',
        icon: 'Nature/Nature Natural 11',
        color: '#2D5A1E'
    },
    blight: {
        name: 'Blight',
        icon: 'Necrotic/Necrotic Wither',
        color: '#3D1F4E'
    },
    wyrd: {
        name: 'Wyrd',
        icon: 'Psychic/Psychic Telepathy',
        color: '#7A2040'
    },
    divine: {
        name: 'Divine',
        icon: 'Radiant/Radiant Divinity',
        color: '#DAA520'
    }
};

// Enhanced resistance levels based on spell system
export const RESISTANCE_LEVELS = [
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
export const CONDITION_MODIFIER_OPTIONS = [
    { value: 'none', label: 'None', description: 'No modifier', color: '#9e9e9e' },
    { value: 'advantage', label: 'Advantage', description: 'Roll twice, take the higher result', color: '#4caf50' },
    { value: 'double_advantage', label: 'Double Advantage', description: 'Roll three times, take the highest result', color: '#2e7d32' },
    { value: 'disadvantage', label: 'Disadvantage', description: 'Roll twice, take the lower result', color: '#f44336' },
    { value: 'double_disadvantage', label: 'Double Disadvantage', description: 'Roll three times, take the lowest result', color: '#c62828' },
    { value: 'immune', label: 'Immune', description: 'Cannot be affected by this condition', color: '#4caf50' }
];

export const UTILITY_STATS = {
    movementSpeed: {
        name: 'Movement Speed',
        icon: getIconUrl('Utility/Speed Dash', 'abilities'),
        suffix: '%'
    },
    swimSpeed: {
        name: 'Swim Speed',
        icon: getIconUrl('Utility/Swirling Current', 'abilities'),
        suffix: '%'
    },
    carryingCapacity: {
        name: 'Carrying Capacity',
        icon: getIconUrl('Utility/Scaled Armor General', 'abilities'),
        suffix: 'slots'
    }
};

export const DURATION_TYPES = {
    ROUNDS: {
        name: 'Rounds',
        description: 'Effect lasts for a number of combat rounds'
    },
    MINUTES: {
        name: 'Minutes',
        description: 'Effect lasts for a number of minutes'
    }
};

export const DAMAGE_DICE = [
    'd4', 'd6', 'd8', 'd10', 'd12', 'd20'
];

export const DAMAGE_AMOUNT = [1, 2, 3, 4, 5, 6, 7, 8];

export const PHYSICAL_DAMAGE_TYPES = {
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

export const DAMAGE_ICONS = {
    base: 'Arcane/Enchanted Sword',
    bonus: 'Arcane/Enchanted Sword'
};

export const damageTypeColors = {
    physical: '#6B4226',
    ember: '#D4380D',
    rime: '#2C5F7C',
    storm: '#8B7328',
    arcane: '#5B3A8C',
    primal: '#2D5A1E',
    blight: '#3D1F4E',
    wyrd: '#7A2040',
    bludgeoning: '#8B4513',
    piercing: '#C0C0C0',
    slashing: '#A52A2A'
};

export const QUALITY_TYPES = {
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
export const getQualityColor = (quality) => {
    const qualityLower = quality?.toLowerCase() || 'common';
    return RARITY_COLORS[qualityLower]?.text || RARITY_COLORS.common.text;
};

// Process resistances
export const getResistances = (combatStats) => {
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

export const getResistanceDescription = (resistance) => resistance;
