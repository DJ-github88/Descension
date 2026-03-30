/**
 * Containers - All container items
 * 
 * This file contains all container items (bags, pouches, chests, etc.)
 */

export const CONTAINERS = [
  {
    id: 'satchel',
    name: 'Satchel',
    type: 'container',
    subtype: 'BAG',
    quality: 'common',
    description: 'A simple cloth satchel for carrying gathered materials.',
    iconId: 'Container/Pouch/brown-backpack-satchel',
    value: { gold: 0, silver: 1, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    containerProperties: {
      gridSize: { rows: 3, cols: 4 },
      items: [],
      isLocked: false,
      lockType: 'none',
      lockDC: 0,
      lockCode: '',
      flavorText: 'A simple cloth satchel with basic storage capacity.',
      maxAttempts: 3,
      failureAction: 'none',
      failureActionDetails: {
        removeItems: false,
        removePercentage: 50,
        destroyContainer: false,
        triggerTrap: false,
        trapDetails: '',
        transformIntoCreature: false,
        creatureType: ''
      }
    }
  },
  {
    id: 'reinforced-crate',
    name: 'Reinforced Crate',
    type: 'container',
    subtype: 'CHEST',
    quality: 'uncommon',
    description: 'A sturdy wooden crate reinforced with metal. Holds more and protects contents better.',
    iconId: 'Container/Crate/crate-wooden-isometric-orange-glow',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    containerProperties: {
      gridSize: { rows: 5, cols: 6 },
      items: [],
      isLocked: false,
      lockType: 'none',
      lockDC: 0,
      lockCode: '',
      flavorText: 'A heavy wooden crate reinforced with metal bands. Much sturdier than a simple satchel.',
      maxAttempts: 3,
      failureAction: 'none',
      failureActionDetails: {
        removeItems: false,
        removePercentage: 50,
        destroyContainer: false,
        triggerTrap: false,
        trapDetails: '',
        transformIntoCreature: false,
        creatureType: ''
      }
    }
  },
  {
    id: 'alchemy-case',
    name: 'Alchemy Case',
    type: 'container',
    subtype: 'BOX',
    quality: 'uncommon',
    description: 'A specialized case with compartments for alchemical ingredients and tools.',
    iconId: 'Container/Bag/brown-satchel-scrolls-three',
    value: { gold: 0, silver: 10, copper: 0 },
    stackable: false,
    width: 2,
    height: 1,
    rotation: 0,
    containerProperties: {
      gridSize: { rows: 4, cols: 5 },
      items: [],
      isLocked: false,
      lockType: 'none',
      lockDC: 0,
      lockCode: '',
      flavorText: 'A well-organized case designed specifically for alchemical work, with compartments for vials and ingredients.',
      maxAttempts: 3,
      failureAction: 'none',
      failureActionDetails: {
        removeItems: false,
        removePercentage: 50,
        destroyContainer: false,
        triggerTrap: false,
        trapDetails: '',
        transformIntoCreature: false,
        creatureType: ''
      }
    }
  },
  {
    id: 'tool-kit',
    name: 'Tool Kit',
    type: 'container',
    subtype: 'BOX',
    quality: 'common',
    description: 'A basic toolkit containing essential tools for various crafting tasks.',
    iconId: 'Container/Bag/brown-backpack-pockets-straps',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 2,
    height: 1,
    rotation: 0,
    containerProperties: {
      gridSize: { rows: 3, cols: 4 },
      items: [],
      isLocked: false,
      lockType: 'none',
      lockDC: 0,
      lockCode: '',
      flavorText: 'A leather toolkit with compartments for various crafting tools.',
      maxAttempts: 3,
      failureAction: 'none',
      failureActionDetails: {
        removeItems: false,
        removePercentage: 50,
        destroyContainer: false,
        triggerTrap: false,
        trapDetails: '',
        transformIntoCreature: false,
        creatureType: ''
      }
    }
  },
  {
    id: 'leather-pouch',
    name: 'Leather Pouch',
    type: 'container',
    subtype: 'POUCH',
    quality: 'poor',
    description: 'A small worn leather pouch, barely holding together. Better than nothing, but not by much.',
    iconId: 'Container/Pouch/brown-tied-pouch',
    value: { gold: 0, silver: 0, copper: 50 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    containerProperties: {
      gridSize: { rows: 2, cols: 3 },
      items: [],
      isLocked: false,
      lockType: 'none',
      lockDC: 0,
      lockCode: '',
      flavorText: 'A tattered leather pouch with minimal storage capacity.',
      maxAttempts: 3,
      failureAction: 'none',
      failureActionDetails: {
        removeItems: false,
        removePercentage: 50,
        destroyContainer: false,
        triggerTrap: false,
        trapDetails: '',
        transformIntoCreature: false,
        creatureType: ''
      }
    }
  },
  {
    id: 'travelers-bag',
    name: 'Traveler\'s Bag',
    type: 'container',
    subtype: 'BAG',
    quality: 'common',
    description: 'A well-worn backpack that has traveled many roads. Its straps remember countless journeys.',
    iconId: 'Container/Bag/brown-backpack-simple',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    containerProperties: {
      gridSize: { rows: 4, cols: 5 },
      items: [],
      isLocked: false,
      lockType: 'none',
      lockDC: 0,
      lockCode: '',
      flavorText: 'A sturdy backpack designed for long journeys, with multiple compartments.',
      maxAttempts: 3,
      failureAction: 'none',
      failureActionDetails: {
        removeItems: false,
        removePercentage: 50,
        destroyContainer: false,
        triggerTrap: false,
        trapDetails: '',
        transformIntoCreature: false,
        creatureType: ''
      }
    }
  },
  {
    id: 'adventurers-pack',
    name: 'Adventurer\'s Pack',
    type: 'container',
    subtype: 'BAG',
    quality: 'common',
    description: 'A practical pack designed for adventurers. Well-organized with multiple pockets and compartments.',
    iconId: 'Container/Bag/brown-backpack-pockets-straps',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    containerProperties: {
      gridSize: { rows: 4, cols: 5 },
      items: [],
      isLocked: false,
      lockType: 'none',
      lockDC: 0,
      lockCode: '',
      flavorText: 'A well-designed pack with multiple compartments for organizing gear.',
      maxAttempts: 3,
      failureAction: 'none',
      failureActionDetails: {
        removeItems: false,
        removePercentage: 50,
        destroyContainer: false,
        triggerTrap: false,
        trapDetails: '',
        transformIntoCreature: false,
        creatureType: ''
      }
    }
  },
  {
    id: 'coin-purse',
    name: 'Coin Purse',
    type: 'container',
    subtype: 'POUCH',
    quality: 'common',
    description: 'A small leather purse designed specifically for coins. Simple but functional.',
    iconId: 'Container/Pouch/beige-tied-pouch',
    value: { gold: 0, silver: 1, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    containerProperties: {
      gridSize: { rows: 2, cols: 3 },
      items: [],
      isLocked: false,
      lockType: 'none',
      lockDC: 0,
      lockCode: '',
      flavorText: 'A small purse perfect for carrying coins and small valuables.',
      maxAttempts: 3,
      failureAction: 'none',
      failureActionDetails: {
        removeItems: false,
        removePercentage: 50,
        destroyContainer: false,
        triggerTrap: false,
        trapDetails: '',
        transformIntoCreature: false,
        creatureType: ''
      }
    }
  },
  {
    id: 'reinforced-satchel',
    name: 'Reinforced Satchel',
    type: 'container',
    subtype: 'BAG',
    quality: 'uncommon',
    description: 'A satchel reinforced with leather and metal. More durable and spacious than a basic bag.',
    iconId: 'Container/Bag/brown-satchel-scrolls-three',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    containerProperties: {
      gridSize: { rows: 5, cols: 6 },
      items: [],
      isLocked: false,
      lockType: 'none',
      lockDC: 0,
      lockCode: '',
      flavorText: 'A reinforced satchel with better protection for its contents.',
      maxAttempts: 3,
      failureAction: 'none',
      failureActionDetails: {
        removeItems: false,
        removePercentage: 50,
        destroyContainer: false,
        triggerTrap: false,
        trapDetails: '',
        transformIntoCreature: false,
        creatureType: ''
      }
    }
  }
];
