/**
 * Utility to create placeholder characters for testing
 * Creates characters for guest, dev, and authenticated account types
 */

import { getAvailableStartingItems } from '../data/startingEquipmentData';

// Sample character image URL (you can replace with actual image URLs)
const PLACEHOLDER_IMAGE_URL = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_head_human_01.jpg';

// Available icons for placeholder characters - verified to exist on WoW icon database
const AVAILABLE_ICONS = [
  // Warrior abilities
  'ability_warrior_battleshout', 'ability_warrior_savageblow', 'ability_warrior_charge',
  
  // Class abilities that definitely exist
  'ability_druid_catform', 'ability_rogue_ambush', 'ability_rogue_shadowdance',
  'ability_mage_firestarter', 'ability_priest_shadowfiend', 'ability_paladin_shieldofthetemplar',
  'ability_warlock_demonicempowerment', 'ability_shaman_stormstrike',
  
  // Common spells
  'spell_shadow_raisedead', 'spell_fire_fireball', 'spell_frost_frostbolt',
  'spell_nature_lightning', 'spell_holy_heal', 'spell_arcane_blast',
  'spell_shadow_shadowbolt', 'spell_fire_flameshock', 'spell_frost_iceshock',
  
  // Skull/bone icons
  'inv_misc_bone_skull_01', 'inv_misc_bone_skull_02',
  
  // Character head icons that exist
  'inv_misc_head_human_01', 'inv_misc_head_orc_01', 'inv_misc_head_elf_02',
  'inv_misc_head_dwarf_01', 'inv_misc_head_gnome_01', 'inv_misc_head_tauren_01',
  'inv_misc_head_troll_01', 'inv_misc_head_undead_02',
  
  // Dragon heads
  'inv_misc_head_dragon_01', 'inv_misc_head_dragon_blue', 'inv_misc_head_dragon_bronze',
  'inv_misc_head_dragon_green', 'inv_misc_head_dragon_red', 'inv_misc_head_dragon_black',
  
  // Achievement boss icons that exist
  'achievement_boss_lichking', 'achievement_boss_ragnaros', 'achievement_boss_cthun',
  'achievement_boss_illidan', 'achievement_boss_kiljaedan', 'achievement_boss_archimonde',
  
  // Generic inventory icons
  'inv_weapon_shortblade_05', 'inv_sword_27', 'inv_axe_02', 'inv_hammer_05',
  'inv_staff_13', 'inv_shield_05', 'inv_misc_book_07', 'inv_misc_gem_sapphire_02'
];

/**
 * Get a random icon from available icons
 */
function getRandomIcon() {
  return AVAILABLE_ICONS[Math.floor(Math.random() * AVAILABLE_ICONS.length)];
}

/**
 * Gets proper race display name from race data
 * Note: This is a synchronous version that works at character creation time
 */
function getRaceDisplayName(race, subrace) {
  try {
    // Import race data synchronously
    const raceDataModule = require('../data/raceData');
    const { getFullRaceData, getRaceData, RACE_DATA } = raceDataModule;
    
    if (race && subrace) {
      // Try getFullRaceData first
      const fullRaceData = getFullRaceData(race, subrace);
      if (fullRaceData && fullRaceData.subrace && fullRaceData.subrace.name && fullRaceData.race && fullRaceData.race.name) {
        // Format as "Subrace (Race)" e.g. "Face Thief (Mimir)"
        return `${fullRaceData.subrace.name} (${fullRaceData.race.name})`;
      }
      
      // Fallback: Look up directly in RACE_DATA
      if (RACE_DATA && RACE_DATA[race] && RACE_DATA[race].subraces) {
        // Try to find subrace by ID in the subraces object
        const raceObj = RACE_DATA[race];
        for (const [key, subraceObj] of Object.entries(raceObj.subraces)) {
          if (subraceObj.id === subrace || key === subrace) {
            if (subraceObj.name && raceObj.name) {
              // Format as "Subrace (Race)"
              return `${subraceObj.name} (${raceObj.name})`;
            }
          }
        }
      }
    }
    
    if (race) {
      const raceData = getRaceData(race);
      if (raceData && raceData.name) {
        return raceData.name; // Fallback to race name
      }
      
      // Fallback: Look up directly in RACE_DATA
      if (RACE_DATA && RACE_DATA[race] && RACE_DATA[race].name) {
        return RACE_DATA[race].name;
      }
    }
    
    return 'Unknown Race';
  } catch (error) {
    console.warn('Failed to get race display name:', error);
    // Return a fallback based on the IDs
    if (subrace && race) {
      // Convert to readable name (e.g., "berserker_nordmark" and "nordmark" -> "Berserker (Nordmark)")
      const subraceReadable = subrace.split('_').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
      const raceReadable = race.charAt(0).toUpperCase() + race.slice(1);
      return `${subraceReadable} (${raceReadable})`;
    }
    if (race) {
      return race.charAt(0).toUpperCase() + race.slice(1);
    }
    return 'Unknown Race';
  }
}

/**
 * Creates a complete placeholder character with all data filled out
 */
export function createPlaceholderCharacter(name, options = {}) {
  const {
    race = 'nordmark',
    subrace = 'berserker_nordmark',
    class: characterClass = 'Berserker',
    level = 3,
    background = 'reaver',
    path = 'reaver',
    stats = {
      strength: 16,
      agility: 14,
      constitution: 15,
      intelligence: 12,
      spirit: 13,
      charisma: 11
    }
  } = options;

  // Calculate health based on constitution
  const baseHealth = stats.constitution * 5;
  const levelHealth = (level - 1) * 5; // +5 HP per level
  const maxHealth = baseHealth + levelHealth;
  
  // Calculate mana based on intelligence
  const baseMana = stats.intelligence * 3;
  const levelMana = (level - 1) * 3; // +3 mana per level
  const maxMana = baseMana + levelMana;

  const characterId = `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Get proper race display name from race data
  const raceDisplayName = getRaceDisplayName(race, subrace);
  
  // Get available starting equipment for this character
  const availableItems = getAvailableStartingItems({
    class: characterClass,
    race: race,
    subrace: subrace,
    background: background,
    path: path
  });
  
  // Select some starter items (weapons, armor, and a few accessories)
  const starterInventory = [];
  
  // Add a weapon (first available for the class)
  const weapons = availableItems.filter(item => item.type === 'weapon');
  if (weapons.length > 0) {
    starterInventory.push({ ...weapons[0], quantity: 1, equipped: false });
  }
  
  // Add armor (first available for the class)
  const armors = availableItems.filter(item => item.type === 'armor');
  if (armors.length > 0) {
    starterInventory.push({ ...armors[0], quantity: 1, equipped: false });
  }
  
  // Add some consumables
  const consumables = availableItems.filter(item => item.type === 'consumable');
  if (consumables.length > 0) {
    // Add 2-3 different consumables
    consumables.slice(0, 3).forEach(item => {
      starterInventory.push({ ...item, quantity: Math.floor(Math.random() * 3) + 2, equipped: false });
    });
  }
  
  // Add some tools
  const tools = availableItems.filter(item => item.type === 'tool');
  if (tools.length > 0) {
    starterInventory.push({ ...tools[0], quantity: 1, equipped: false });
  }
  
  // Generate a random character icon
  const randomIcon = getRandomIcon();

  return {
    id: characterId,
    name: name,
    baseName: name,
    roomName: '',
    race: race,
    subrace: subrace,
    raceDisplayName: raceDisplayName,
    class: characterClass,
    level: level,
    experience: 0,
    alignment: 'Neutral Good',
    exhaustionLevel: 0,
    background: background,
    path: path,
    
    // Character icon at root level for display
    characterIcon: randomIcon,
    
    // Stats
    stats: stats,
    
    // Health, Mana, Action Points
    health: {
      current: maxHealth,
      max: maxHealth
    },
    mana: {
      current: maxMana,
      max: maxMana
    },
    actionPoints: {
      current: 3,
      max: 3
    },
    classResource: {
      current: 0,
      max: 0
    },
    
    // Lore with character image and icon
    lore: {
      background: 'A seasoned adventurer',
      personalityTraits: 'Brave and determined',
      ideals: 'Protect the innocent',
      bonds: 'Loyal to companions',
      flaws: 'Too trusting',
      appearance: 'Well-built and battle-scarred',
      backstory: 'Has seen many battles',
      goals: 'To become a legendary warrior',
      fears: 'Losing loved ones',
      allies: 'The party',
      enemies: 'Evil forces',
      organizations: 'Adventurers Guild',
      notes: 'Placeholder character for testing',
      characterImage: null, // No custom image by default
      imageTransformations: {
        scale: 1.0,
        positionX: 0,
        positionY: 0,
        rotation: 0
      },
      characterIcon: randomIcon // Store in lore as well for consistency
    },
    
    // Token settings
    tokenSettings: {
      customIcon: null,
      size: 40,
      borderColor: '#4a90e2'
    },
    
    // Equipment
    equipment: {
      weapon: null,
      armor: null,
      shield: null,
      accessories: []
    },
    
    // Inventory with starter equipment
    inventory: {
      items: starterInventory,
      currency: {
        platinum: 0,
        gold: 50,
        silver: 0,
        copper: 0
      },
      encumbranceState: 'normal'
    },
    
    // Spells and abilities
    spells: [],
    abilities: [],
    class_spells: {
      known_spells: []
    },
    
    // Racial traits
    racialTraits: [],
    racialLanguages: [],
    racialSpeed: 30,
    
    // Level up history
    levelUpHistory: {},
    
    // Timestamps
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Creates placeholder characters for guest account
 */
export function createGuestPlaceholderCharacters() {
  const characters = [
    createPlaceholderCharacter('Guest Berserker', {
      race: 'nordmark',
      subrace: 'berserker_nordmark',
      class: 'Berserker',
      level: 3,
      background: 'reaver',
      path: 'reaver'
    }),
    createPlaceholderCharacter('Guest Arcanoneer', {
      race: 'mimir',
      subrace: 'doppel_mimir',
      class: 'Arcanoneer',
      level: 2,
      background: 'arcanist',
      path: 'arcanist',
      stats: {
        strength: 10,
        agility: 12,
        constitution: 13,
        intelligence: 16,
        spirit: 14,
        charisma: 11
      }
    })
  ];
  
  // Save to localStorage
  try {
    localStorage.setItem('mythrill-guest-characters', JSON.stringify(characters));
    return characters;
  } catch (error) {
    console.error('❌ Failed to create guest placeholder characters:', error);
    return [];
  }
}

/**
 * Creates placeholder characters for dev account
 */
export function createDevPlaceholderCharacters() {
  const characters = [
    createPlaceholderCharacter('Dev Berserker', {
      race: 'nordmark',
      subrace: 'berserker_nordmark',
      class: 'Berserker',
      level: 5,
      background: 'reaver',
      path: 'reaver'
    }),
    createPlaceholderCharacter('Dev Arcanoneer', {
      race: 'mimir',
      subrace: 'doppel_mimir',
      class: 'Arcanoneer',
      level: 4,
      background: 'arcanist',
      path: 'arcanist',
      stats: {
        strength: 10,
        agility: 12,
        constitution: 13,
        intelligence: 18,
        spirit: 15,
        charisma: 12
      }
    }),
    createPlaceholderCharacter('Dev Bladedancer', {
      race: 'groven',
      subrace: 'guardian_groven',
      class: 'Bladedancer',
      level: 3,
      stats: {
        strength: 12,
        agility: 18,
        constitution: 13,
        intelligence: 14,
        spirit: 12,
        charisma: 13
      }
    })
  ];
  
  // Save to localStorage
  try {
    localStorage.setItem('mythrill-characters', JSON.stringify(characters));
    return characters;
  } catch (error) {
    console.error('❌ Failed to create dev placeholder characters:', error);
    return [];
  }
}

/**
 * Creates placeholder characters for authenticated account (Firebase)
 * Note: This requires Firebase to be configured and user to be authenticated
 */
export async function createAuthenticatedPlaceholderCharacters(userId) {
  if (!userId) {
    console.warn('⚠️ No userId provided for authenticated placeholder characters');
    return [];
  }
  
  try {
    const { default: characterPersistenceService } = await import('../services/firebase/characterPersistenceService');
    
    const characters = [
      createPlaceholderCharacter('Test Berserker', {
        race: 'nordmark',
        subrace: 'berserker_nordmark',
        class: 'Berserker',
        level: 5,
        background: 'reaver',
        path: 'reaver'
      }),
      createPlaceholderCharacter('Test Arcanoneer', {
        race: 'mimir',
        subrace: 'doppel_mimir',
        class: 'Arcanoneer',
        level: 4,
        background: 'arcanist',
        path: 'arcanist',
        stats: {
          strength: 10,
          agility: 12,
          constitution: 13,
          intelligence: 18,
          spirit: 15,
          charisma: 12
        }
      })
    ];
    
    // Save each character to Firebase
    const savedCharacters = [];
    for (const character of characters) {
      try {
        const characterId = await characterPersistenceService.createCharacter(character, userId);
        savedCharacters.push({ ...character, id: characterId });
      } catch (error) {
        console.error(`❌ Failed to create character ${character.name}:`, error);
      }
    }
    
    return savedCharacters;
  } catch (error) {
    console.error('❌ Failed to create authenticated placeholder characters:', error);
    return [];
  }
}

/**
 * Initialize placeholder characters for current account type
 */
export async function initializePlaceholderCharacters() {
  // Check current account type
  const authStore = await import('../store/authStore').then(m => m.default);
  const authState = authStore.getState();
  const user = authState.user;
  
  if (!user) {
    return createGuestPlaceholderCharacters();
  }
  
  if (user.isGuest) {
    return createGuestPlaceholderCharacters();
  }
  
  if (user.uid === 'dev-user-123' || user.uid?.startsWith('dev-user-')) {
    return createDevPlaceholderCharacters();
  }
  
  // Authenticated user
  return await createAuthenticatedPlaceholderCharacters(user.uid);
}

/**
 * Check if placeholder characters exist, create if they don't
 */
export async function ensurePlaceholderCharacters() {
  const authStore = await import('../store/authStore').then(m => m.default);
  const authState = authStore.getState();
  const user = authState.user;
  
  let characters = [];
  
  if (!user || user.isGuest) {
    // Check guest characters
    const guestChars = localStorage.getItem('mythrill-guest-characters');
    if (!guestChars || JSON.parse(guestChars).length === 0) {
      characters = createGuestPlaceholderCharacters();
    } else {
    }
  } else if (user.uid === 'dev-user-123' || user.uid?.startsWith('dev-user-')) {
    // Check dev characters
    const devChars = localStorage.getItem('mythrill-characters');
    if (!devChars || JSON.parse(devChars).length === 0) {
      characters = createDevPlaceholderCharacters();
    } else {
    }
  } else {
    // For authenticated users, check Firebase
    try {
      const { default: characterPersistenceService } = await import('../services/firebase/characterPersistenceService');
      const existingChars = await characterPersistenceService.getUserCharacters(user.uid);
      if (!existingChars || existingChars.length === 0) {
        characters = await createAuthenticatedPlaceholderCharacters(user.uid);
      } else {
      }
    } catch (error) {
      console.warn('⚠️ Could not check authenticated characters:', error);
    }
  }
  
  return characters;
}

