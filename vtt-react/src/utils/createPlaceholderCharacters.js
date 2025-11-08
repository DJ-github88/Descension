/**
 * Utility to create placeholder characters for testing
 * Creates characters for guest, dev, and authenticated account types
 */

// Sample character image URL (you can replace with actual image URLs)
const PLACEHOLDER_IMAGE_URL = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_head_human_01.jpg';

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
      if (fullRaceData && fullRaceData.subrace && fullRaceData.subrace.name) {
        return fullRaceData.subrace.name; // Use subrace name (e.g., "Bloodhammer")
      }
      
      // Fallback: Look up directly in RACE_DATA
      if (RACE_DATA && RACE_DATA[race] && RACE_DATA[race].subraces) {
        // Try to find subrace by ID in the subraces object
        const raceObj = RACE_DATA[race];
        for (const [key, subraceObj] of Object.entries(raceObj.subraces)) {
          if (subraceObj.id === subrace || key === subrace) {
            if (subraceObj.name) {
              return subraceObj.name;
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
    if (subrace) {
      // Convert subrace ID to readable name (e.g., "berserker_nordmark" -> "Berserker Nordmark")
      const parts = subrace.split('_');
      return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
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
    
    // Lore with character image
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
      characterImage: PLACEHOLDER_IMAGE_URL,
      imageTransformations: {
        scale: 1.0,
        positionX: 0,
        positionY: 0,
        rotation: 0
      }
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
    
    // Inventory
    inventory: {
      items: [],
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
      level: 3
    }),
    createPlaceholderCharacter('Guest Arcanoneer', {
      race: 'mimir',
      subrace: 'doppel_mimir',
      class: 'Arcanoneer',
      level: 2,
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
    console.log('✅ Created guest placeholder characters:', characters.map(c => c.name));
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
      level: 5
    }),
    createPlaceholderCharacter('Dev Arcanoneer', {
      race: 'mimir',
      subrace: 'doppel_mimir',
      class: 'Arcanoneer',
      level: 4,
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
    console.log('✅ Created dev placeholder characters:', characters.map(c => c.name));
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
        level: 5
      }),
      createPlaceholderCharacter('Test Arcanoneer', {
        race: 'mimir',
        subrace: 'doppel_mimir',
        class: 'Arcanoneer',
        level: 4,
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
        console.log(`✅ Created authenticated placeholder character: ${character.name} (${characterId})`);
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
    console.log('ℹ️ No user logged in, creating guest placeholder characters');
    return createGuestPlaceholderCharacters();
  }
  
  if (user.isGuest) {
    console.log('ℹ️ Guest user detected, creating guest placeholder characters');
    return createGuestPlaceholderCharacters();
  }
  
  if (user.uid === 'dev-user-123' || user.uid?.startsWith('dev-user-')) {
    console.log('ℹ️ Dev user detected, creating dev placeholder characters');
    return createDevPlaceholderCharacters();
  }
  
  // Authenticated user
  console.log('ℹ️ Authenticated user detected, creating authenticated placeholder characters');
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
      console.log('ℹ️ Guest placeholder characters already exist');
    }
  } else if (user.uid === 'dev-user-123' || user.uid?.startsWith('dev-user-')) {
    // Check dev characters
    const devChars = localStorage.getItem('mythrill-characters');
    if (!devChars || JSON.parse(devChars).length === 0) {
      characters = createDevPlaceholderCharacters();
    } else {
      console.log('ℹ️ Dev placeholder characters already exist');
    }
  } else {
    // For authenticated users, check Firebase
    try {
      const { default: characterPersistenceService } = await import('../services/firebase/characterPersistenceService');
      const existingChars = await characterPersistenceService.getUserCharacters(user.uid);
      if (!existingChars || existingChars.length === 0) {
        characters = await createAuthenticatedPlaceholderCharacters(user.uid);
      } else {
        console.log('ℹ️ Authenticated placeholder characters already exist');
      }
    } catch (error) {
      console.warn('⚠️ Could not check authenticated characters:', error);
    }
  }
  
  return characters;
}

