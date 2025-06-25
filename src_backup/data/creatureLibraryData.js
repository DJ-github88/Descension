// Creature Library Data
// This file contains sample data for the creature library

import { CREATURE_SIZES, CREATURE_TYPES } from '../store/creatureStore';

export const LIBRARY_CREATURES = [
  {
    id: 'goblin-warrior',
    name: 'Goblin Warrior',
    description: 'A small, nimble goblin armed with crude weapons and a mischievous grin.',
    type: CREATURE_TYPES.HUMANOID,
    size: CREATURE_SIZES.SMALL,
    tags: ['goblin', 'warrior', 'evil'],
    tokenIcon: 'inv_misc_head_orc_01',
    tokenBorder: '#4CAF50',
    stats: {
      strength: 8,
      agility: 14,
      constitution: 10,
      intelligence: 8,
      spirit: 8,
      charisma: 8,
      maxHp: 35,
      currentHp: 35,
      maxMana: 10,
      currentMana: 10,
      maxActionPoints: 4,
      currentActionPoints: 4,
      armorClass: 13,
      initiative: 2,
      speed: 30,
      flying: 0,
      swimming: 15,
      sightRange: 60,
      darkvision: 60
    },
    resistances: {
      poison: 50
    },
    vulnerabilities: {
      fire: 50
    },
    abilities: [
      {
        id: 'goblin-stab',
        name: 'Stab',
        description: 'A quick stab with a rusty dagger.',
        damage: '1d6+2',
        damageType: 'piercing',
        apCost: 2
      },
      {
        id: 'goblin-flee',
        name: 'Nimble Escape',
        description: 'The goblin can take the Disengage or Hide action as a bonus action on each of its turns.',
        apCost: 1
      }
    ],
    lootTable: {
      currency: {
        gold: { min: 0, max: 2 },
        silver: { min: 0, max: 10 },
        copper: { min: 5, max: 20 }
      },
      items: [
        {
          itemId: 'rusty-dagger',
          dropChance: 75,
          quantity: { min: 1, max: 1 }
        },
        {
          itemId: 'goblin-ear',
          dropChance: 90,
          quantity: { min: 1, max: 2 }
        }
      ]
    }
  },
  {
    id: 'dire-wolf',
    name: 'Dire Wolf',
    description: 'A massive wolf with matted fur and glowing eyes. It stands nearly as tall as a human.',
    type: CREATURE_TYPES.BEAST,
    size: CREATURE_SIZES.LARGE,
    tags: ['wolf', 'predator'],
    tokenIcon: 'ability_mount_whitetiger',
    tokenBorder: '#795548',
    stats: {
      strength: 17,
      agility: 15,
      constitution: 15,
      intelligence: 3,
      spirit: 12,
      charisma: 7,
      maxHp: 75,
      currentHp: 75,
      maxMana: 0,
      currentMana: 0,
      maxActionPoints: 5,
      currentActionPoints: 5,
      armorClass: 14,
      initiative: 2,
      speed: 50,
      flying: 0,
      swimming: 20,
      sightRange: 60,
      darkvision: 30
    },
    resistances: {
      cold: 25
    },
    vulnerabilities: {},
    abilities: [
      {
        id: 'wolf-bite',
        name: 'Bite',
        description: 'A powerful bite that can knock enemies prone.',
        damage: '2d6+3',
        damageType: 'piercing',
        apCost: 3,
        effects: [
          {
            type: 'save',
            attribute: 'strength',
            dc: 13,
            onFail: {
              type: 'condition',
              condition: 'prone',
              duration: 1
            }
          }
        ]
      },
      {
        id: 'wolf-howl',
        name: 'Terrifying Howl',
        description: 'A bone-chilling howl that strikes fear into nearby enemies.',
        apCost: 4,
        cooldown: 3,
        effects: [
          {
            type: 'save',
            attribute: 'spirit',
            dc: 12,
            onFail: {
              type: 'condition',
              condition: 'frightened',
              duration: 2
            }
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        gold: { min: 0, max: 0 },
        silver: { min: 0, max: 0 },
        copper: { min: 0, max: 0 }
      },
      items: [
        {
          itemId: 'wolf-pelt',
          dropChance: 100,
          quantity: { min: 1, max: 1 }
        },
        {
          itemId: 'wolf-fang',
          dropChance: 75,
          quantity: { min: 1, max: 4 }
        }
      ]
    }
  },
  {
    id: 'fire-elemental',
    name: 'Fire Elemental',
    description: 'A swirling vortex of flame and smoke in a vaguely humanoid shape.',
    type: CREATURE_TYPES.ELEMENTAL,
    size: CREATURE_SIZES.LARGE,
    tags: ['fire', 'elemental'],
    tokenIcon: 'spell_fire_fire',
    tokenBorder: '#FF5722',
    stats: {
      strength: 10,
      agility: 17,
      constitution: 16,
      intelligence: 6,
      spirit: 10,
      charisma: 7,
      maxHp: 120,
      currentHp: 120,
      maxMana: 50,
      currentMana: 50,
      maxActionPoints: 6,
      currentActionPoints: 6,
      armorClass: 15,
      initiative: 3,
      speed: 50,
      flying: 0,
      swimming: 0,
      sightRange: 60,
      darkvision: 60
    },
    resistances: {
      fire: 100, // Immune
      physical: 50
    },
    vulnerabilities: {
      water: 100,
      frost: 50
    },
    abilities: [
      {
        id: 'fire-touch',
        name: 'Touch of Flame',
        description: 'A burning touch that ignites flammable objects.',
        damage: '2d8+3',
        damageType: 'fire',
        apCost: 3,
        effects: [
          {
            type: 'condition',
            condition: 'burning',
            duration: 2,
            damage: '1d6'
          }
        ]
      },
      {
        id: 'fire-nova',
        name: 'Fire Nova',
        description: 'An explosion of flame that damages all nearby creatures.',
        damage: '4d6',
        damageType: 'fire',
        apCost: 5,
        cooldown: 3,
        areaOfEffect: {
          type: 'circle',
          radius: 15
        }
      }
    ],
    lootTable: {
      currency: {
        gold: { min: 5, max: 15 },
        silver: { min: 10, max: 30 },
        copper: { min: 20, max: 50 }
      },
      items: [
        {
          itemId: 'essence-of-fire',
          dropChance: 100,
          quantity: { min: 1, max: 3 }
        },
        {
          itemId: 'fire-crystal',
          dropChance: 25,
          quantity: { min: 1, max: 1 }
        }
      ]
    }
  }
];

// Function to get a creature by ID
export const getCreatureById = (id) => {
  return LIBRARY_CREATURES.find(creature => creature.id === id);
};

// Function to search creatures by name or tags
export const searchCreatures = (query) => {
  const lowerQuery = query.toLowerCase();
  return LIBRARY_CREATURES.filter(creature => 
    creature.name.toLowerCase().includes(lowerQuery) || 
    creature.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// Function to filter creatures by type
export const filterCreaturesByType = (type) => {
  return LIBRARY_CREATURES.filter(creature => creature.type === type);
};

// Function to filter creatures by size
export const filterCreaturesBySize = (size) => {
  return LIBRARY_CREATURES.filter(creature => creature.size === size);
};
