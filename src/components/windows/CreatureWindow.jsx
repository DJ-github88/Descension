import React, { useState, useEffect } from 'react';
import { CreatureLibraryProvider } from '../creature-wizard/context/CreatureLibraryContext';
import { CreatureWizardProvider } from '../creature-wizard/context/CreatureWizardContext';
import CreatureLibrary from '../creature-wizard/components/library/CreatureLibrary';
import CreatureWizardApp from '../creature-wizard/CreatureWizardApp';
import useCreatureStore from '../../store/creatureStore';
import '../creature-wizard/styles/CreatureWindow.css';

export default function CreatureWindow({
  initialCreatureId = null,
  initialView = 'library',
  onClose = null,
  activeView: propActiveView,
  editingCreatureId: propEditingCreatureId,
  onEditCreature: propOnEditCreature,
  onBackToLibrary: propOnBackToLibrary
}) {
  const [activeView, setActiveView] = useState(propActiveView || initialView);
  const [editingCreatureId, setEditingCreatureId] = useState(propEditingCreatureId || initialCreatureId);

  // Update state when props change
  useEffect(() => {
    if (propActiveView !== undefined) {
      setActiveView(propActiveView);
    }
  }, [propActiveView]);

  useEffect(() => {
    if (propEditingCreatureId !== undefined) {
      setEditingCreatureId(propEditingCreatureId);
    }
  }, [propEditingCreatureId]);
  const creatureStore = useCreatureStore();

  // Initialize with sample creatures if empty - using a ref to ensure it only runs once
  const initialized = React.useRef(false);

  // Initialize with sample creatures only once
  useEffect(() => {
    const initializeStore = async () => {
      // We're now handling initialization in creatureStore.js
      // This code is kept for reference but won't run
      if (false && !initialized.current && creatureStore.creatures.length === 0) {
        console.log('CreatureWindow mounted');
        console.log('Initializing creature store with sample goofy goblins...');
        initialized.current = true;

        // Add some goofy goblin creatures with enhanced abilities and loot tables
        const goofyGoblins = [
          {
            name: 'Snicksnack the Prankster',
            description: 'A mischievous goblin known for replacing weapons with rubber chickens. His pranks are legendary among the goblin tribes, and even the most hardened warriors fear becoming the target of his tricks.',
            type: 'humanoid',
            size: 'small',
            tags: ['goblin', 'trickster', 'annoying', 'prankster'],
            tokenIcon: 'inv_misc_head_orc_01',
            tokenBorder: '#4CAF50',
            stats: {
              strength: 8,
              agility: 14,
              constitution: 10,
              intelligence: 12,
              spirit: 8,
              charisma: 13,
              maxHp: 35,
              currentHp: 35,
              maxMana: 20,
              currentMana: 20,
              maxActionPoints: 4,
              currentActionPoints: 4,
              armorClass: 13,
              initiative: 3,
              speed: 30,
              flying: 0,
              swimming: 15,
              sightRange: 60,
              darkvision: 60,
              challengeRating: '1'
            },
            resistances: {
              poison: 25
            },
            vulnerabilities: {
              fire: 25
            },
            abilities: [
              {
                name: 'Dagger Stab',
                description: 'A quick stab with a rusty dagger.',
                type: 'melee',
                icon: 'ability_rogue_daggersofexpertise',
                damage: {
                  diceCount: 1,
                  diceType: 4,
                  bonus: 2,
                  damageType: 'piercing'
                },
                range: 5,
                actionPointCost: 2,
                cooldown: 0,
                effects: [
                  {
                    type: 'DAMAGE',
                    damageType: 'piercing',
                    formula: '1d4+2'
                  }
                ]
              },
              {
                name: 'Rubber Chicken Swap',
                description: 'Snicksnack attempts to replace an enemy\'s weapon with a rubber chicken, temporarily disarming them.',
                type: 'special',
                icon: 'inv_misc_food_chicken_drumstick_01',
                range: 15,
                actionPointCost: 3,
                cooldown: 3,
                effects: [
                  {
                    type: 'SAVE',
                    attribute: 'agility',
                    dc: 13,
                    onFail: {
                      type: 'CONDITION',
                      condition: 'disarmed',
                      duration: 2
                    }
                  }
                ]
              },
              {
                name: 'Smoke Bomb',
                description: 'Throws a smoke bomb that creates a cloud of obscuring smoke, allowing Snicksnack to hide or escape.',
                type: 'special',
                icon: 'spell_shadow_shadowfury',
                range: 20,
                actionPointCost: 3,
                cooldown: 4,
                effects: [
                  {
                    type: 'AREA',
                    shape: 'circle',
                    size: 15
                  },
                  {
                    type: 'CONDITION',
                    condition: 'blinded',
                    duration: 1,
                    save: {
                      attribute: 'constitution',
                      dc: 12
                    }
                  },
                  {
                    type: 'SPECIAL',
                    description: 'Snicksnack can take the Hide action as a free action.'
                  }
                ]
              }
            ],
            lootTable: {
              currency: {
                gold: { min: 1, max: 3 },
                silver: { min: 5, max: 15 },
                copper: { min: 10, max: 30 }
              },
              items: [
                {
                  name: "Rubber Chicken",
                  type: "trinket",
                  quality: "common",
                  dropChance: 90,
                  iconId: "inv_misc_food_chicken_drumstick_01",
                  quantity: { min: 1, max: 3 },
                  description: "A squeaky rubber chicken that makes an annoying noise when squeezed."
                },
                {
                  name: "Prankster's Dagger",
                  type: "weapon",
                  subtype: "dagger",
                  quality: "uncommon",
                  dropChance: 40,
                  iconId: "inv_weapon_shortblade_05",
                  quantity: { min: 1, max: 1 },
                  description: "A well-balanced dagger with a hidden compartment in the hilt that can spray water."
                },
                {
                  name: "Smoke Bomb",
                  type: "consumable",
                  quality: "common",
                  dropChance: 75,
                  iconId: "spell_shadow_shadowfury",
                  quantity: { min: 1, max: 2 },
                  description: "A small clay ball that creates a cloud of smoke when thrown."
                }
              ]
            }
          },
          {
            name: 'Gigglegut the Explosive',
            description: 'A pyromaniac goblin who laughs maniacally when things go boom. His eyebrows are permanently singed, and his clothing is covered in scorch marks from countless "experiments."',
            type: 'humanoid',
            size: 'small',
            tags: ['goblin', 'explosive', 'unstable', 'pyromaniac'],
            tokenIcon: 'inv_misc_bomb_05',
            tokenBorder: '#FF5722',
            stats: {
              strength: 7,
              agility: 15,
              constitution: 9,
              intelligence: 11,
              spirit: 6,
              charisma: 10,
              maxHp: 30,
              currentHp: 30,
              maxMana: 15,
              currentMana: 15,
              maxActionPoints: 5,
              currentActionPoints: 5,
              armorClass: 12,
              initiative: 4,
              speed: 30,
              flying: 0,
              swimming: 15,
              sightRange: 60,
              darkvision: 60,
              challengeRating: '2'
            },
            resistances: {
              fire: 50
            },
            vulnerabilities: {
              frost: 25
            },
            abilities: [
              {
                name: 'Bomb Toss',
                description: 'Gigglegut throws a small explosive device that explodes on impact.',
                type: 'ranged',
                icon: 'inv_misc_bomb_02',
                damage: {
                  diceCount: 2,
                  diceType: 6,
                  bonus: 0,
                  damageType: 'fire'
                },
                range: 30,
                actionPointCost: 3,
                cooldown: 0,
                effects: [
                  {
                    type: 'DAMAGE',
                    damageType: 'fire',
                    formula: '2d6'
                  },
                  {
                    type: 'AREA',
                    shape: 'circle',
                    size: 10
                  },
                  {
                    type: 'SAVE',
                    attribute: 'agility',
                    dc: 13,
                    success: 'half'
                  }
                ]
              },
              {
                name: 'Sticky Bomb',
                description: 'Gigglegut throws a bomb that sticks to the target, exploding after a short delay.',
                type: 'ranged',
                icon: 'inv_misc_bomb_04',
                damage: {
                  diceCount: 3,
                  diceType: 6,
                  bonus: 0,
                  damageType: 'fire'
                },
                range: 20,
                actionPointCost: 4,
                cooldown: 3,
                effects: [
                  {
                    type: 'DAMAGE',
                    damageType: 'fire',
                    formula: '3d6',
                    delay: 1
                  },
                  {
                    type: 'SAVE',
                    attribute: 'agility',
                    dc: 14,
                    onFail: {
                      type: 'CONDITION',
                      condition: 'restrained',
                      duration: 1
                    }
                  }
                ]
              },
              {
                name: 'Maniacal Laughter',
                description: 'Gigglegut breaks into uncontrollable laughter, unnerving nearby enemies.',
                type: 'special',
                icon: 'ability_laughingskull',
                range: 15,
                actionPointCost: 2,
                cooldown: 4,
                effects: [
                  {
                    type: 'SAVE',
                    attribute: 'spirit',
                    dc: 12,
                    onFail: {
                      type: 'CONDITION',
                      condition: 'frightened',
                      duration: 1
                    }
                  },
                  {
                    type: 'AREA',
                    shape: 'circle',
                    size: 15
                  }
                ]
              }
            ],
            lootTable: {
              currency: {
                gold: { min: 2, max: 5 },
                silver: { min: 10, max: 20 },
                copper: { min: 0, max: 0 }
              },
              items: [
                {
                  name: "Unstable Bomb",
                  type: "consumable",
                  quality: "uncommon",
                  dropChance: 80,
                  iconId: "inv_misc_bomb_02",
                  quantity: { min: 1, max: 3 },
                  description: "A volatile explosive that deals 3d6 fire damage in a 10-foot radius. Agility save DC 13 for half damage."
                },
                {
                  name: "Fireproof Gloves",
                  type: "armor",
                  subtype: "hands",
                  quality: "uncommon",
                  dropChance: 45,
                  iconId: "inv_gauntlets_04",
                  quantity: { min: 1, max: 1 },
                  description: "Thick leather gloves that provide resistance to fire damage."
                },
                {
                  name: "Explosive Powder",
                  type: "material",
                  quality: "common",
                  dropChance: 90,
                  iconId: "inv_misc_dust_01",
                  quantity: { min: 2, max: 5 },
                  description: "A volatile powder used in crafting explosives."
                }
              ]
            }
          },
          {
            name: 'Wobblestick the Unbalanced',
            description: 'A goblin shaman who can never quite get his spells right. His staff is crooked, his robes are mismatched, and his spells often have unexpected side effects that surprise both enemies and allies.',
            type: 'humanoid',
            size: 'small',
            tags: ['goblin', 'shaman', 'clumsy', 'spellcaster'],
            tokenIcon: 'inv_staff_13',
            tokenBorder: '#2196F3',
            stats: {
              strength: 6,
              agility: 10,
              constitution: 8,
              intelligence: 14,
              spirit: 12,
              charisma: 9,
              maxHp: 25,
              currentHp: 25,
              maxMana: 40,
              currentMana: 40,
              maxActionPoints: 3,
              currentActionPoints: 3,
              armorClass: 11,
              initiative: 2,
              speed: 25,
              flying: 0,
              swimming: 15,
              sightRange: 60,
              darkvision: 60,
              challengeRating: '2'
            },
            resistances: {
              arcane: 25
            },
            vulnerabilities: {
              physical: 25
            },
            abilities: [
              {
                name: 'Wobbling Bolt',
                description: 'Wobblestick fires an unstable bolt of magical energy that zigzags unpredictably.',
                type: 'spell',
                spellType: 'EVOCATION',
                level: 2,
                icon: 'spell_arcane_arcane01',
                damage: {
                  diceCount: 2,
                  diceType: 8,
                  bonus: 0,
                  damageType: 'arcane'
                },
                range: 60,
                actionPointCost: 2,
                cooldown: 0,
                effects: [
                  {
                    type: 'DAMAGE',
                    damageType: 'arcane',
                    formula: '2d8'
                  },
                  {
                    type: 'SPECIAL',
                    description: 'On a natural 1 attack roll, the bolt hits a random target within 20 feet of the original target.'
                  }
                ]
              },
              {
                name: 'Chaotic Polymorph',
                description: 'Wobblestick attempts to transform the target into a harmless creature, but the spell is unpredictable.',
                type: 'spell',
                spellType: 'TRANSMUTATION',
                level: 3,
                icon: 'spell_nature_polymorph',
                range: 30,
                actionPointCost: 3,
                cooldown: 4,
                effects: [
                  {
                    type: 'SAVE',
                    attribute: 'spirit',
                    dc: 14,
                    onFail: {
                      type: 'CONDITION',
                      condition: 'polymorphed',
                      duration: 2
                    }
                  },
                  {
                    type: 'SPECIAL',
                    description: 'Roll 1d6: 1-3: Target becomes a chicken, 4-5: Target becomes a frog, 6: Target becomes a sheep.'
                  }
                ]
              },
              {
                name: 'Healing Mishap',
                description: 'Wobblestick attempts to heal an ally, but the spell has unpredictable side effects.',
                type: 'spell',
                spellType: 'EVOCATION',
                level: 2,
                icon: 'spell_holy_healingaura',
                range: 30,
                actionPointCost: 2,
                cooldown: 3,
                effects: [
                  {
                    type: 'HEALING',
                    formula: '2d8+2',
                    target: 'ally'
                  },
                  {
                    type: 'SPECIAL',
                    description: 'Roll 1d6: 1: Target also gains 10 temporary HP, 2: Target glows brightly for 1 minute, 3: Target floats 1 foot off the ground for 1 minute, 4: Target\'s voice becomes high-pitched for 1 minute, 5: Target\'s hair changes color, 6: Target hiccups uncontrollably for 1 minute.'
                  }
                ]
              }
            ],
            lootTable: {
              currency: {
                gold: { min: 3, max: 8 },
                silver: { min: 5, max: 15 },
                copper: { min: 0, max: 0 }
              },
              items: [
                {
                  name: "Wobblestick's Staff",
                  type: "weapon",
                  subtype: "staff",
                  quality: "uncommon",
                  dropChance: 60,
                  iconId: "inv_staff_13",
                  quantity: { min: 1, max: 1 },
                  description: "A crooked staff that enhances spellcasting but occasionally causes spells to have minor random effects."
                },
                {
                  name: "Potion of Random Effect",
                  type: "consumable",
                  subtype: "potion",
                  quality: "uncommon",
                  dropChance: 75,
                  iconId: "inv_potion_27",
                  quantity: { min: 1, max: 3 },
                  description: "A swirling potion that produces a different magical effect each time it's consumed."
                },
                {
                  name: "Chaotic Spellbook",
                  type: "quest",
                  quality: "rare",
                  dropChance: 40,
                  iconId: "inv_misc_book_07",
                  quantity: { min: 1, max: 1 },
                  description: "A spellbook filled with hastily scribbled notes and unpredictable magical formulas."
                },
                {
                  name: "Unstable Mana Crystal",
                  type: "material",
                  quality: "uncommon",
                  dropChance: 80,
                  iconId: "inv_misc_gem_sapphire_02",
                  quantity: { min: 1, max: 3 },
                  description: "A crystal that pulses with chaotic magical energy, useful for crafting unpredictable magical items."
                }
              ]
            }
          },
          {
            name: 'Grubfingers the Collector',
            description: 'A goblin who hoards shiny objects and useless trinkets. His pockets are always bulging with random items, and he can often be found sorting through his collection, muttering "my precious" to particularly shiny baubles.',
            type: 'humanoid',
            size: 'small',
            tags: ['goblin', 'hoarder', 'greedy', 'collector'],
            tokenIcon: 'inv_misc_gem_pearl_03',
            tokenBorder: '#FFC107',
            stats: {
              strength: 9,
              agility: 13,
              constitution: 11,
              intelligence: 10,
              spirit: 7,
              charisma: 8,
              maxHp: 40,
              currentHp: 40,
              maxMana: 10,
              currentMana: 10,
              maxActionPoints: 4,
              currentActionPoints: 4,
              armorClass: 14,
              initiative: 2,
              speed: 30,
              flying: 0,
              swimming: 15,
              sightRange: 60,
              darkvision: 60,
              challengeRating: '1'
            },
            resistances: {
              poison: 25
            },
            vulnerabilities: {},
            abilities: [
              {
                name: 'Dagger Slash',
                description: 'Grubfingers slashes with a surprisingly sharp dagger.',
                type: 'melee',
                icon: 'inv_weapon_shortblade_01',
                damage: {
                  diceCount: 1,
                  diceType: 6,
                  bonus: 1,
                  damageType: 'slashing'
                },
                range: 5,
                actionPointCost: 2,
                cooldown: 0,
                effects: [
                  {
                    type: 'DAMAGE',
                    damageType: 'slashing',
                    formula: '1d6+1'
                  }
                ]
              },
              {
                name: 'Pocket Sand',
                description: 'Grubfingers throws sand from his pockets into an enemy\'s eyes.',
                type: 'special',
                icon: 'inv_misc_dust_02',
                range: 10,
                actionPointCost: 2,
                cooldown: 3,
                effects: [
                  {
                    type: 'SAVE',
                    attribute: 'constitution',
                    dc: 12,
                    onFail: {
                      type: 'CONDITION',
                      condition: 'blinded',
                      duration: 1
                    }
                  }
                ]
              },
              {
                name: 'Trinket Toss',
                description: 'Grubfingers throws a random trinket from his collection, causing unpredictable effects.',
                type: 'ranged',
                icon: 'inv_misc_gem_variety_01',
                range: 20,
                actionPointCost: 3,
                cooldown: 4,
                effects: [
                  {
                    type: 'SPECIAL',
                    description: 'Roll 1d6: 1: Deals 2d4 bludgeoning damage, 2: Creates a cloud of smoke in a 10-foot radius, 3: Makes a loud noise, forcing a DC 12 Spirit save or be frightened for 1 round, 4: Releases a foul odor, forcing a DC 12 Constitution save or be poisoned for 1 round, 5: Explodes in a flash of light, forcing a DC 12 Agility save or be blinded for 1 round, 6: Bounces harmlessly off the target.'
                  }
                ]
              },
              {
                name: 'Magpie Instinct',
                description: 'Grubfingers has an uncanny ability to spot valuable items and quickly snatch them.',
                type: 'special',
                icon: 'ability_rogue_pickpocket',
                range: 5,
                actionPointCost: 2,
                cooldown: 5,
                effects: [
                  {
                    type: 'SPECIAL',
                    description: 'Grubfingers attempts to steal a small item from the target. The target must make a DC 14 Perception check to notice.'
                  }
                ]
              }
            ],
            lootTable: {
              currency: {
                gold: { min: 5, max: 15 },
                silver: { min: 20, max: 50 },
                copper: { min: 50, max: 100 }
              },
              items: [
                {
                  name: "Grubfingers' Collection",
                  type: "container",
                  quality: "uncommon",
                  dropChance: 100,
                  iconId: "inv_box_03",
                  quantity: { min: 1, max: 1 },
                  description: "A small sack filled with various trinkets and shiny objects collected by Grubfingers.",
                  containerContents: [
                    {
                      name: "Assorted Gems",
                      type: "material",
                      quality: "uncommon",
                      iconId: "inv_misc_gem_variety_01",
                      quantity: { min: 2, max: 5 },
                      description: "A collection of small, semi-precious gems."
                    },
                    {
                      name: "Silver Locket",
                      type: "accessory",
                      subtype: "necklace",
                      quality: "uncommon",
                      iconId: "inv_jewelry_necklace_07",
                      quantity: { min: 1, max: 1 },
                      description: "A tarnished silver locket containing a small portrait of a human woman."
                    },
                    {
                      name: "Stolen Coins",
                      type: "currency",
                      quality: "common",
                      iconId: "inv_misc_coin_02",
                      value: { gold: 10, silver: 25 },
                      description: "A small pile of coins stolen from unfortunate travelers."
                    }
                  ]
                },
                {
                  name: "Magpie's Dagger",
                  type: "weapon",
                  subtype: "dagger",
                  quality: "uncommon",
                  dropChance: 60,
                  iconId: "inv_weapon_shortblade_02",
                  quantity: { min: 1, max: 1 },
                  description: "A dagger with a hilt decorated with small shiny stones. It seems to guide its wielder toward valuable objects."
                },
                {
                  name: "Shiny Trinket",
                  type: "trinket",
                  quality: "common",
                  dropChance: 90,
                  iconId: "inv_misc_gem_pearl_03",
                  quantity: { min: 2, max: 6 },
                  description: "A random shiny object with no practical value but might be worth something to the right collector."
                }
              ]
            }
          }
        ];

        // Add creatures one by one with a small delay to avoid overwhelming the state updates
        for (const goblin of goofyGoblins) {
          creatureStore.addCreature(goblin);
          // Small delay between additions
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        console.log(`Added ${goofyGoblins.length} goofy goblins to the store.`);
      }
    };

    initializeStore();
  }, []);

  // Handle switching to wizard view for editing a creature
  const handleEditCreature = (creatureId) => {
    console.log('Editing creature:', creatureId);
    if (propOnEditCreature) {
      propOnEditCreature(creatureId);
    } else {
      setEditingCreatureId(creatureId);
      setActiveView('wizard');
    }
  };

  // Handle switching back to library view
  const handleBackToLibrary = () => {
    console.log('Back to library');

    if (propOnBackToLibrary) {
      propOnBackToLibrary();
    } else {
      // If we were opened with initialCreatureId and initialView="wizard",
      // and there's an onClose callback, call it instead of switching to library
      if (initialCreatureId && initialView === 'wizard' && onClose) {
        onClose();
        return;
      }

      setActiveView('library');
      setEditingCreatureId(null);
    }
  };

  // Handle creating a new creature
  const handleCreateNewCreature = () => {
    console.log('Creating new creature');
    setEditingCreatureId(null);
    setActiveView('wizard');
  };

  return (
    <div className="creature-window">
      <CreatureLibraryProvider>
        <CreatureWizardProvider>

          {/* Main content area - conditional rendering since CSS is preloaded */}
          <div className="creature-window-content">
            {activeView === 'library' ? (
              <CreatureLibrary onEdit={handleEditCreature} />
            ) : (
              <CreatureWizardApp
                editMode={!!editingCreatureId}
                creatureId={editingCreatureId}
                onSave={handleBackToLibrary}
                onCancel={handleBackToLibrary}
              />
            )}
          </div>
        </CreatureWizardProvider>
      </CreatureLibraryProvider>
    </div>
  );
}
