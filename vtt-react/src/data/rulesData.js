// Comprehensive Rules Data Structure
// Organized into 8 main categories with subcategories and detailed content

export const RULES_CATEGORIES = [
  {
    id: 'core-rules',
    name: 'Core Rules',
    icon: 'fas fa-book',
    description: 'Foundation mechanics that govern basic gameplay',
    subcategories: [
      {
        id: 'game-overview',
        name: 'Game Overview',
        icon: 'fas fa-info-circle',
        content: {
          title: 'Game Overview',
          description: 'Core principles, session structure, and collaborative storytelling',
          sections: [
            {
              title: 'Core Principles',
              content: `This game uses a difficulty-dice system rather than flat Difficulty Classes. The GM picks the die size that matches the task (from d4 for very easy to d20 for very difficult), you roll that die, and your skill rank plus situational modifiers determine the outcome. Combat stays fast with weapon dice that handle both the attack and the damage roll.`
            },
            {
              title: 'Session Structure',
              content: `Sessions typically last 2-4 hours and include a mix of combat encounters, social interactions, exploration, and downtime activities. The Game Master (GM) facilitates the game while players control their characters.`
            },
            {
              title: 'Collaborative Storytelling',
              content: `Success in this game comes from working together with your party and GM to create memorable stories. Players are encouraged to develop their characters' personalities, backstories, and motivations.`
            },
            {
              title: 'Modular Rules System',
              content: `This game features a modular rules system designed to accommodate different playstyles and campaign types. Core mechanics provide the foundation every table needs, while optional systems add complexity for specific campaign themes:

• **Settlement Activities** for social and downtime-focused campaigns
• **Supernatural Systems** for high-stakes campaigns with dark themes
• **Travel & Exploration** for journey-heavy adventures
• **Point & Click Framework** for detailed exploration scenarios

GMs can mix and match these systems to create the perfect experience for their table.`
            }
          ]
        }
      },
      {
        id: 'dice-system',
        name: 'Dice System',
        icon: 'fas fa-dice-d20',
        content: {
          title: 'Dice System',
          description: 'Difficulty dice ladder, critical results, advantage/disadvantage',
          sections: [
            {
              title: 'Difficulty Dice Core Mechanic',
              content: `Checks use a selected difficulty die instead of a numeric DC. The GM sets the challenge by choosing the die size: d4 (very easy), d6 (easy), d8 (moderate), d10 (challenging), d12 (difficult), or d20 (very difficult). Roll that die, apply any bonuses from your skill rank, and factor in situational modifiers. Ability scores generally aren’t added directly—if your primary or secondary stat modifier is +5 or higher, you can ask to step the difficulty die down one size (see the Skills rules for details).`
            },
            {
              title: 'Critical Hits & Misses',
              content: `Rolling the highest value on your chosen difficulty die is a critical success; rolling the lowest value is a critical failure with complications. Weapon attacks and other d20-based rolls still treat natural 20s and 1s as extremes, with critical hits triggering weapon-specific effects and exploding dice where applicable.`
            },
            {
              title: 'Advantage & Disadvantage',
              content: `When you have advantage, roll two of the chosen difficulty die and use the higher result. With disadvantage, roll two and use the lower. If you have both, they cancel out.`
            }
          ],
          tables: [
            {
              title: 'Difficulty Dice',
              description: 'The heart of our system: the GM selects a die size that matches the challenge. Roll that die, add your skill rank, and let fate decide.',
              headers: ['Die', 'Difficulty', 'Use When'],
              rows: [
                ['d4', 'Very Easy', 'Trivial or well-prepared tasks'],
                ['d6', 'Easy', 'Routine for trained characters'],
                ['d8', 'Moderate', 'Standard challenge with some risk'],
                ['d10', 'Challenging', 'Requires focus or good positioning'],
                ['d12', 'Difficult', 'Demands expertise or strong leverage'],
                ['d20', 'Very Difficult', 'High stakes, limited margin for error']
              ]
            }
          ]
        }
      },
      {
        id: 'character-statistics',
        name: 'Character Statistics',
        icon: 'fas fa-chart-bar',
        content: {
          title: 'Character Statistics',
          description: 'Six primary attributes, modifiers, and derived stats',
          sections: [
            {
              title: 'The Six Attributes',
              content: `Every character has six core attributes that define their capabilities:`
            }
          ],
          tables: [
            {
              title: 'Primary Attributes',
              description: 'Six pillars of capability that define every character. These attributes shape your strengths, weaknesses, and the paths available to you.',
              headers: ['Attribute', 'Abbreviation', 'Represents', 'Used For'],
              rows: [
                ['Constitution', 'CON', 'Health & Stamina', 'HP, Fortitude saves, Endurance'],
                ['Strength', 'STR', 'Physical Power', 'Melee attacks, Athletics, Carrying capacity'],
                ['Agility', 'AGI', 'Agility & Speed', 'Ranged attacks, Armor, Reflex saves, Stealth'],
                ['Intelligence', 'INT', 'Reasoning & Memory', 'Arcane magic, Investigation, Knowledge'],
                ['Spirit', 'SPI', 'Willpower & Insight', 'Divine magic, Perception, Will saves'],
                ['Charisma', 'CHA', 'Force of Personality', 'Social skills, Leadership, Performance']
              ]
            },
            {
              title: 'Attribute Modifiers',
              description: 'Your attribute scores translate into modifiers that affect rolls and calculations. Higher scores grant greater bonuses to your capabilities.',
              headers: ['Score', 'Modifier', 'Score', 'Modifier'],
              rows: [
                ['1', '-5', '16-17', '+3'],
                ['2-3', '-4', '18-19', '+4'],
                ['4-5', '-3', '20-21', '+5'],
                ['6-7', '-2', '22-23', '+6'],
                ['8-9', '-1', '24-25', '+7'],
                ['10-11', '+0', '26-27', '+8'],
                ['12-13', '+1', '28-29', '+9'],
                ['14-15', '+2', '30', '+10']
              ]
            }
          ]
        }
      },
      {
        id: 'inventory-encumbrance',
        name: 'Inventory & Encumbrance',
        icon: 'fas fa-weight-hanging',
        content: {
          title: 'Inventory & Encumbrance',
          description: 'Grid-based inventory system with strength-based capacity',
          sections: [
            {
              title: 'Grid Inventory System',
              content: `Your inventory uses a Tetris-like grid system. The base grid is 5×15 (75 slots) at 10 Strength. Each 2 points of Strength above 10 adds one row (5 slots).`
            },
            {
              title: 'Encumbrance Zones',
              content: `Your carrying capacity is divided into three zones based on grid columns. Items placed in different zones trigger different encumbrance effects:`
            }
          ],
          tables: [
            {
              title: 'Encumbrance Effects',
              description: 'How you pack your inventory matters. Items in different zones affect your mobility and capabilities—pack wisely, for every choice has weight.',
              headers: ['Zone', 'Grid Columns', 'Effects'],
              rows: [
                ['Normal', 'Columns 0-4', 'No penalties'],
                ['Encumbered', 'Columns 5-9', '-25% movement speed, +5% STR/CON, -5% all other stats'],
                ['Overencumbered', 'Columns 10-14', '-75% movement speed, +15% STR/CON, -15% all other stats']
              ]
            },
            {
              title: 'Strength Bonus Rows',
              description: 'Greater strength means greater capacity. Each two points above 10 adds another row to your inventory grid, allowing you to carry more gear.',
              headers: ['Strength Score', 'Grid Size', 'Total Slots'],
              rows: [
                ['8-9', '4×15', '60'],
                ['10-11', '5×15', '75'],
                ['12-13', '6×15', '90'],
                ['14-15', '7×15', '105'],
                ['16-17', '8×15', '120'],
                ['18-19', '9×15', '135'],
                ['20+', '10×15', '150']
              ]
            }
          ]
        }
      },
      {
        id: 'game-sessions',
        name: 'Game Sessions',
        icon: 'fas fa-calendar-alt',
        content: {
          title: 'Game Sessions',
          description: 'Comprehensive session management, preparation, and gameplay flow',
          tabs: [
            {
              id: 'session-structure',
              name: 'Session Structure',
              sections: [
                {
                  title: 'Session Zero',
                  content: `Before starting a campaign, hold a Session Zero to discuss expectations, character concepts, house rules, and campaign themes. This ensures everyone is on the same page.`
                },
                {
                  title: 'Typical Session Flow',
                  content: `Sessions usually follow this structure: 1) Recap previous session, 2) Resolve downtime activities, 3) Main adventure content (mix of combat, exploration, social), 4) End-of-session wrap-up and XP awards.`
                }
              ],
              tables: [
                {
                  title: 'Session Timeline',
                  headers: ['Phase', 'Duration', 'Activities', 'Purpose'],
                  rows: [
                    ['Opening', '5-10 min', 'Recap, check-ins, housekeeping', 'Get everyone focused'],
                    ['Downtime', '10-15 min', 'Resolve between-session activities', 'Handle character maintenance'],
                    ['Main Content', '2-3 hours', 'Adventure scenes, encounters', 'Core gameplay'],
                    ['Breaks', '10-15 min', 'Rest, snacks, discussion', 'Maintain energy'],
                    ['Closing', '10-15 min', 'Wrap-up, XP, next session planning', 'Provide closure']
                  ]
                }
              ]
            },
            {
              id: 'pacing',
              name: 'Pacing',
              sections: [
                {
                  title: 'Energy Management',
                  content: `Good pacing alternates between high-energy scenes (combat, dramatic moments) and low-energy scenes (exploration, social interaction). Aim for variety within each session.`
                }
              ],
              tables: [
                {
                  title: 'Scene Energy Levels',
                  headers: ['Energy Level', 'Scene Types', 'Duration', 'Purpose'],
                  rows: [
                    ['High', 'Combat, chases, dramatic reveals', '15-45 min', 'Excitement, tension'],
                    ['Medium', 'Social encounters, puzzles', '20-60 min', 'Engagement, problem-solving'],
                    ['Low', 'Exploration, travel, shopping', '10-30 min', 'Breathing room, character moments'],
                    ['Transition', 'Moving between locations', '5-15 min', 'Scene changes, setup']
                  ]
                }
              ]
            },
            {
              id: 'preparation',
              name: 'Preparation',
              sections: [
                {
                  title: 'Session Preparation',
                  content: `Players should know their character abilities and have dice ready. GMs should prepare encounters, NPCs, and maps. Both should be ready to improvise and adapt.`
                }
              ],
              tables: [
                {
                  title: 'GM Preparation Checklist',
                  headers: ['Category', 'Items to Prepare', 'Time Investment'],
                  rows: [
                    ['NPCs', 'Names, motivations, key stats', '15-30 min'],
                    ['Locations', 'Key features, maps, atmosphere', '10-20 min'],
                    ['Encounters', 'Combat stats, environmental hazards', '20-40 min'],
                    ['Plot Hooks', 'Multiple paths forward', '10-15 min'],
                    ['Random Tables', 'Names, events, complications', '5-10 min'],
                    ['Props', 'Handouts, visual aids, music', '15-30 min']
                  ]
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 'character-creation',
    name: 'Character Creation',
    icon: 'fas fa-user-plus',
    description: 'Step-by-step character building process',
    subcategories: [
      {
        id: 'creation-overview',
        name: 'Overview',
        icon: 'fas fa-list-check',
        content: {
          title: 'Character Creation Overview',
          description: 'Introduction to the Mythrill character creation system',
          sections: [
            {
              title: 'Introduction',
              content: `Mythrill features a comprehensive character creation system with 27 unique character classes, 10 races with subraces, and flexible character building that allows for diverse and creative character concepts. The creation process is divided into 11 steps, guiding you through choosing your character's heritage, profession, abilities, and story.`
            },
            {
              title: 'Creation Steps',
              content: `Character creation follows these 11 steps in order:\n\n1. Basic Information - Set your character's name, gender, and appearance\n2. Race & Subrace - Choose your character's heritage and racial traits\n3. Class - Select your character's profession and combat role from 27 unique classes\n4. Starting Spells - Choose your initial spells (if applicable to your class)\n5. Background - Select your character's history and pre-adventuring life\n6. Discipline - Choose your character's philosophical approach and practice (Mystic, Zealot, Trickster, etc.)\n7. Ability Scores - Allocate your base stats using the point-buy system\n8. Skills & Languages - Select your skill proficiencies and known languages\n9. Lore & Details - Fill out your character's backstory, personality, and appearance details\n10. Starting Equipment - Purchase and select your initial gear with starting currency\n11. Character Summary - Review all your choices and finalize your character`
            },
            {
              title: 'Background and Class Independence',
              content: `Backgrounds and classes are independent choices. Your background represents your character's life before becoming an adventurer and provides thematic abilities, skill proficiencies, and social capabilities. Your class determines your mechanical role, combat abilities, and resource system. Any background can pair with any class, allowing for diverse character concepts like a Soldier Wizard or a Noble Barbarian.`
            },
            {
              title: 'Disciplines',
              content: `Disciplines represent your character's chosen philosophical approach and practice. The 9 disciplines (Mystic, Zealot, Trickster, Harrow, Arcanist, Hexer, Reaver, Mercenary, Sentinel) provide stat modifiers, skill proficiencies, starting equipment, special features, and extra point-buy points. Unlike backgrounds (which represent your past) or classes (which determine your role), disciplines represent your character's approach to power, knowledge, and adventure. Each discipline also offers specializations (sub-paths) that further customize your character's capabilities.`
            },
            {
              title: 'System Flexibility',
              content: `The Mythrill character creation system encourages creative character concepts through its flexible combination system. With independent choices for race, class, background, and discipline, you can create unique characters like a Mystic Reaver, Arcanist Sentinel, or Trickster Zealot. All combinations are viable and can lead to interesting roleplaying opportunities.`
            }
          ]
        }
      },
      {
        id: 'character-backgrounds',
        name: 'Backgrounds',
        icon: 'fas fa-book',
        useCustomComponent: true, // Flag to use BackgroundsDisplay component
        content: {
          title: 'Character Backgrounds',
          description: '15 character backgrounds representing your history and origin (Sailor, Merchant, Soldier, etc.)',
          sections: [
            {
              title: 'What are Backgrounds?',
              content: `Backgrounds represent your character's life before becoming an adventurer. They provide skill proficiencies, tool proficiencies, languages, starting equipment, and a unique feature that reflects your past experiences. Unlike paths (which determine your combat abilities), backgrounds shape your character's social interactions and non-combat capabilities.`
            },
            {
              title: 'Background Benefits',
              content: `Each background provides: 2 skill proficiencies, 0-2 tool proficiencies, 0-2 additional languages, starting equipment themed to your background, and a special feature that gives you unique advantages in specific situations.`
            },
            {
              title: 'Roleplaying Your Background',
              content: `Your background is more than just mechanical benefits - it's a core part of your character's identity. Consider how your past experiences shape your personality, goals, and relationships. Use your background feature creatively in social encounters and exploration.`
            }
          ]
        }
      },
      {
        id: 'disciplines',
        name: 'Disciplines',
        icon: 'fas fa-book',
        useCustomComponent: true, // Flag to use BackgroundSelector component (shows disciplines)
        content: {
          title: 'Character Disciplines & Sub-disciplines',
          description: '9 thematic disciplines (Mystic, Zealot, Trickster, etc.) with sub-disciplines, selectable abilities, and deep customization',
          sections: [
            {
              title: 'Discipline System Overview',
              content: `Disciplines represent your character's chosen philosophical approach and practice. Each of the 9 disciplines (Mystic, Zealot, Trickster, Harrow, Arcanist, Hexer, Reaver, Mercenary, Sentinel) provides mechanical benefits, thematic abilities, and sub-discipline options. Unlike backgrounds (Sailor, Soldier, etc.) which represent your past, disciplines represent your chosen approach to power, knowledge, and adventure through systematic practice and training.`
            },
            {
              title: 'Discipline Abilities',
              content: `Each discipline provides a set of unique abilities that reflect its core philosophy and practice. These abilities are formatted like spells with detailed mechanics, targeting information, and usage limitations. Each discipline grants these abilities as part of your character's training and mastery of that discipline.`
            },
            {
              title: 'Ability Formatting',
              content: `Path abilities use the same detailed formatting as spells from the spell crafting wizard, including effect types (damage, healing, buff, debuff, utility, control), targeting information, AP costs, usage limitations, and restrictions. This ensures consistency across all game systems and makes abilities easy to understand and use.`
            }
          ],
          tabs: [
            {
              id: 'mystic',
              name: 'Mystic',
              tables: [
                {
                  title: 'Mystic Abilities',
                  headers: ['Ability', 'Type', 'Usage', 'Description'],
                  rows: [
                    ['Elemental Attunement', 'Passive', '1/Day', 'Attune to an elemental type once per day, gaining resistance and bonus damage.'],
                    ['Mana Surge', 'Active', '1/Long Rest', 'Enter a Mana Surge state for 1 minute, reducing spell costs and casting one spell for free.'],
                    ['Arcane Insight', 'Passive', 'Always Active', 'Identify magical effects and gain advantage on saves against illusions.']
                  ]
                }
              ]
            },
            {
              id: 'arcanist',
              name: 'Arcanist',
              tables: [
                {
                  title: 'Arcanist Abilities',
                  headers: ['Ability', 'Type', 'Usage', 'Description'],
                  rows: [
                    ['Arcane Insight', 'Passive', 'Always Active', 'Cast Detect Magic at will and gain advantage on checks to identify spells and magical effects.'],
                    ['Spell Adaptation', 'Active', '1/Short Rest', 'Modify a spell by changing its damage type, range, targets, or duration.'],
                    ['Arcane Shield', 'Active', '1/Short Rest', 'Create a shield of arcane energy that can cause attacks to miss or reduce damage.']
                  ]
                }
              ]
            },
            {
              id: 'trickster',
              name: 'Trickster',
              tables: [
                {
                  title: 'Trickster Abilities',
                  headers: ['Ability', 'Type', 'Usage', 'Description'],
                  rows: [
                    ['Fortune\'s Favor', 'Active', '3/Long Rest', 'Force a reroll on any d20 roll made by you or an ally within 30 feet.'],
                    ['Chaos Surge', 'Active', '1/Combat', 'Roll on the Chaos Surge table for unpredictable effects on your first attack or ability.'],
                    ['Lucky Break', 'Passive', '1/Long Rest', 'Once per long rest, remain at 1 hit point instead of being reduced to 0.']
                  ]
                }
              ]
            },
            {
              id: 'zealot',
              name: 'Zealot',
              tables: [
                {
                  title: 'Zealot Abilities',
                  headers: ['Ability', 'Type', 'Usage', 'Description'],
                  rows: [
                    ['Divine Favor', 'Passive', '1/Long Rest', 'Gain resistance to radiant damage and advantage on one roll per long rest.'],
                    ['Smite the Unfaithful', 'Active', '1/Short Rest', 'Imbue your weapon with divine energy for bonus radiant damage on your next attack.'],
                    ['Zealous Presence', 'Active', '1/Long Rest', 'Inspire allies within 30 feet with a divine battle cry, granting temporary hit points and advantage.']
                  ]
                }
              ]
            },
            {
              id: 'harrow',
              name: 'Harrow',
              tables: [
                {
                  title: 'Harrow Abilities',
                  headers: ['Ability', 'Type', 'Usage', 'Description'],
                  rows: [
                    ['Touch of Death', 'Passive', 'Always Active', 'Gain temporary hit points when you reduce a creature to 0 hit points.'],
                    ['Spectral Sight', 'Active', 'At Will', 'See invisible creatures and into the Ethereal Plane for 1 minute.'],
                    ['Death\'s Whisper', 'Active', '1/Long Rest', 'Cast Speak with Dead once per long rest, and the target cannot lie to you.']
                  ]
                }
              ]
            },
            {
              id: 'hexer',
              name: 'Hexer',
              tables: [
                {
                  title: 'Hexer Abilities',
                  headers: ['Ability', 'Type', 'Usage', 'Description'],
                  rows: [
                    ['Primal Connection', 'Passive', 'Always Active', 'Communicate with beasts and plants, and gain advantage on Survival checks.'],
                    ['Wild Shape', 'Active', '1/Long Rest', 'Transform part of your body to gain bestial benefits for 10 minutes.'],
                    ['Nature\'s Wrath', 'Active', '1/Short Rest', 'Cause plants to sprout in a 20-foot radius, creating difficult terrain and potentially restraining enemies.']
                  ]
                }
              ]
            },
            {
              id: 'reaver',
              name: 'Reaver',
              tables: [
                {
                  title: 'Reaver Abilities',
                  headers: ['Ability', 'Type', 'Usage', 'Description'],
                  rows: [
                    ['Adrenaline Rush', 'Active', '1/Short Rest', 'Enter an adrenaline-fueled state for 1 minute, gaining temporary hit points and increased speed.'],
                    ['Unstoppable Force', 'Passive', 'Always Active', 'Count as one size larger for carrying capacity and resist being moved against your will.'],
                    ['Devastating Strike', 'Active', '1/Short Rest', 'Add your Strength modifier to damage again and potentially knock the target prone.']
                  ]
                }
              ]
            },
            {
              id: 'mercenary',
              name: 'Mercenary',
              tables: [
                {
                  title: 'Mercenary Abilities',
                  headers: ['Ability', 'Type', 'Usage', 'Description'],
                  rows: [
                    ['Combat Expertise', 'Passive', 'Always Active', 'Gain proficiency with three weapons of your choice or +1 to attack rolls with already proficient weapons.'],
                    ['Tactical Assessment', 'Active', 'At Will', 'Assess a creature to learn its Armor, hit point percentage, and one damage vulnerability, resistance, or immunity.'],
                    ['Dirty Fighting', 'Active', '1/Short Rest', 'Force a target to make a Constitution save or be blinded or immobilized until the end of your next turn.']
                  ]
                }
              ]
            },
            {
              id: 'sentinel',
              name: 'Sentinel',
              tables: [
                {
                  title: 'Sentinel Abilities',
                  headers: ['Ability', 'Type', 'Usage', 'Description'],
                  rows: [
                    ['Protective Aura', 'Passive', 'Always Active', 'Grant allies within 10 feet a +1 bonus to Armor and potentially increase it further as a reaction.'],
                    ['Planar Sense', 'Passive', 'Always Active', 'Sense portals or weak points between planes and resist planar displacement effects.'],
                    ['Ward of Protection', 'Active', '1/Long Rest', 'Create a 15-foot-radius ward that grants allies resistance to one damage type and damages enemies.']
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        id: 'skills',
        name: 'Skills',
        icon: 'fas fa-cogs',
        useCustomComponent: true, // Flag to use SkillsDisplay component
        content: {
          title: 'Skills',
          description: 'Character skills with rank progression and quest-based advancement',
          sections: [
            {
              title: 'How Skills Work',
              content: `Skills represent your character's training and expertise in various areas. Each skill is tied to a primary and secondary ability score. When you make a skill check, your GM determines the difficulty and tells you which die to roll (d4 for very easy tasks up to d20 for very difficult ones). Ability modifiers are not added to the roll - instead, if your primary or secondary stat modifier is +5 or higher, you may request to roll a smaller die for better success chances.

**Understanding Roll Outcome Colors:**
Skill roll outcomes are color-coded to help GMs quickly interpret results. The color scheme is designed to be visible for people with color vision differences:
- **Total Failure** (Dark Red): Catastrophic failure with severe consequences or complications
- **Failure** (Red-Orange): The attempt fails, but without major complications
- **Partial Success** (Amber/Yellow): Mixed results - some success but with drawbacks, or minimal success
- **Success** (Teal/Blue-Green): The attempt succeeds as intended
- **Critical Success** (Bright Blue): Exceptional success with additional benefits or bonuses

These colors use distinct hues and brightness levels, plus visual indicators (⚠ for total failures, ★ for critical successes) to ensure clarity for all players.`
            },
            {
              title: 'Skill Ranks & Progression',
              content: `Skills have seven ranks: Untrained, Novice, Trained, Apprentice, Adept, Expert, and Master. Each rank unlocks better outcomes on rollable tables and adds a bonus to your checks. You advance through ranks by completing skill quests during gameplay—small challenges that demonstrate your growing expertise.`
            },
            {
              title: 'Critical Success & Failure',
              content: `Rolling the maximum value on your die (e.g., 20 on a d20) is a critical success, granting exceptional results. Rolling the minimum value (1) is a critical failure, resulting in complications or setbacks. Check your skill's rollable table to see the full range of possible outcomes.`
            },
            {
              title: 'Skill Quests',
              content: `Each skill has 10 quests that unlock as you progress. Completing quests advances your rank and unlocks new abilities. Quests are small, achievable challenges that occur naturally during gameplay—like "Land your first successful attack" for Weapon Mastery or "Successfully persuade an authority figure" for Persuasion.`
            }
          ]
        }
      },
      {
        id: 'languages',
        name: 'Languages',
        icon: 'fas fa-language',
        useCustomComponent: true, // Flag to use LanguagesDisplay component
        content: {
          title: 'Languages',
          description: 'Standard, exotic, secret, and elemental languages',
          sections: [
            {
              title: 'Language Categories',
              content: `Languages are divided into four categories: Standard (Common, Dwarvish, Elvish, etc.), Exotic (Draconic, Celestial, Abyssal, etc.), Secret (Druidic, Thieves' Cant), and Elemental (Aquan, Auran, Ignan, Terran).`
            },
            {
              title: 'Learning Languages',
              content: `Your race grants you certain languages automatically (usually Common plus one or two racial languages). You can learn additional languages from your background, path, or through downtime training. Secret languages require special training or membership in specific organizations.`
            },
            {
              title: 'Using Languages',
              content: `Knowing a language allows you to speak, read, and write in that language (unless the language has no written form). Languages can be crucial for social encounters, deciphering ancient texts, and communicating with creatures you encounter.`
            }
          ]
        }
      },
      {
        id: 'classes',
        name: 'Classes',
        icon: 'fas fa-hat-wizard',
        hasDetailPages: true, // Flag to indicate this subcategory has detail pages
        content: {
          title: 'Classes',
          description: '27 classes organized by thematic paths with unique resource systems. Click on a class name to view detailed information.',
          sections: [
            {
              title: 'Class System',
              content: `Classes determine your combat role, resource system, and mechanical abilities. There are 27 classes organized into thematic paths.`
            },
            {
              title: 'Resource Systems',
              content: `Each class uses a unique resource system: Mana (casters), Rage (warriors), Focus (rogues), Energy (monks), Runic Power (death knights), and more. These resources fuel your class abilities.`
            }
          ],
          tables: [
            {
              title: 'All Classes',
              description: 'Twenty-seven unique classes, each with distinct roles, resource systems, and playstyles. Choose the path that calls to your character\'s soul.',
              headers: ['Class', 'Role', 'Resource', 'Playstyle'],
              clickableColumn: 0, // Make the first column (Class) clickable
              rows: [
                ['Arcanoneer', 'Damage/Utility', 'Sphere Generation & Combination', 'Master of elemental sphere combination with dynamic spell crafting'],
                ['Berserker', 'Damage', 'Rage Points', 'Fury warrior with momentum-based combat'],
                ['Bladedancer', 'Damage', 'Edge & Flourish', 'Finesse fighter with elegant combat techniques'],
                ['Chaos Weaver', 'Damage', 'Mayhem Modifiers', 'Master of unpredictability with highest damage potential'],
                ['Chronarch', 'Control', 'Temporal Energy', 'Time manipulator building temporal power'],
                ['Covenbane', 'Damage/Support', 'Anti-Magic Seals', 'Witch hunter with magic-disrupting abilities'],
                ['Deathcaller', 'Damage/Support', 'Necrotic Ascension', 'Blood mage sacrificing health for forbidden power'],
                ['Dreadnaught', 'Tank', 'Siege Mode', 'Fortress defender with heavy armor capabilities'],
                ['Exorcist', 'Support/Damage', 'Divine Favor', 'Holy warrior banishing evil spirits'],
                ['False Prophet', 'Control', 'Deception', 'Corrupting preacher spreading lies and manipulation'],
                ['Fate Weaver', 'Support/Control', 'Threads of Destiny', 'Card-based destiny manipulator turning failures into power'],
                ['Formbender', 'Hybrid (Tank/Damage/Support)', 'Wild Instinct', 'Shapeshifter mastering four primal forms with adaptive combat'],
                ['Gambler', 'Damage/Utility', 'Fortune Points', 'Daring risk-taker manipulating luck and probability'],
                ['Huntress', 'Damage', 'Quarry Marks', 'Tracker with precision targeting and pursuit'],
                ['Inscriptor', 'Control/Support', 'Runic Wrapping & Inscriptions', 'Tactical battlefield controller using runes and inscriptions'],
                ['Lichborne', 'Damage/Control', 'Eternal Frost Aura & Phylactery', 'Frost-wielding undead with life-draining aura and resurrection mechanics'],
                ['Lunarch', 'Support/Control', 'Lunar Charge', 'Lunar mage with phase-based energy cycles'],
                ['Martyr', 'Tank/Support', 'Pain Points', 'Self-sacrificing warrior earning power through suffering'],
                ['Minstrel', 'Support', 'Harmonic Notes', 'Musical spellcaster with note combinations'],
                ['Oracle', 'Support/Control', 'Prophetic Vision', 'Seer with foresight and divination'],
                ['Plaguebringer', 'Damage/Control', 'Affliction Cultivation', 'Plague master evolving diseases through strategic spell combinations'],
                ['Primalist', 'Support/Control', 'Totemic Synergy', 'Totem master creating powerful synergies through sacred totems'],
                ['Pyrofiend', 'Damage', 'Inferno Veil', 'Fire-wielding demon with corruption stages'],
                ['Spellguard', 'Tank/Support', 'Ward Layers', 'Protective mage with magical shield systems'],
                ['Titan', 'Tank/Control', 'Strain Overload', 'Gravity manipulator with colossal strength'],
                ['Toxicologist', 'Damage/Control', 'Alchemical Vials', 'Poison crafter with chemical warfare'],
                ['Warden', 'Damage/Control', 'Vengeance Points', 'Relentless hunter with glaive combat and spectral cages'],
                ['Witch Doctor', 'Support/Control', 'Voodoo Essence & Loa Invocation', 'Voodoo practitioner invoking powerful gods through curses, rituals, and totems']
              ]
            }
          ]
        }
      },
      {
        id: 'races',
        name: 'Races',
        icon: 'fas fa-users',
        useCustomComponent: true, // Flag to use RaceSelector component
        content: {
          title: 'Races & Variants',
          description: 'Playable races with meaningful variants, cultural depth, and mechanical trade-offs',
          sections: [
            {
              title: 'Race System Overview',
              content: `Races represent your character's heritage and provide stat modifiers, racial traits, languages, and cultural background. Each race has multiple variants that offer different playstyles and mechanical options. All races are designed with meaningful trade-offs - powerful abilities come with significant drawbacks that create interesting tactical and roleplay decisions.`
            },
            {
              title: 'Choosing a Race',
              content: `When selecting a race, consider both the mechanical benefits and the cultural background. Each variant within a race offers different stat modifiers and abilities, allowing you to customize your character to fit your desired playstyle. Pay attention to the disadvantages as much as the advantages - they define your character as much as the strengths.`
            },
            {
              title: 'Variant Diversity',
              content: `Each race has 2-3 variants that represent different cultural groups, adaptations, or life paths within that race. Variants have distinct stat modifiers, racial traits, and sometimes different movement speeds or languages. Choose the variant that best fits your character concept and desired mechanical role.`
            },
            {
              title: 'Integration with Game Systems',
              content: `Racial traits interact with the Action Point system, background abilities, and class features. Many racial abilities cost AP to activate or provide tactical options during combat. Consider how your race's traits will synergize with your chosen background and class.`
            }
          ],
          tabs: [
            {
              id: 'nordmark',
              name: 'Nordmark',
              sections: [
                {
                  title: 'Overview',
                  content: `**Iron-willed descendants of the frozen northlands where winter never dies**

The Nordmark are the hardy folk of the eternal winter lands, where the sun barely rises and survival depends on strength of arm and will. They are descended from ancient warrior-kings who carved kingdoms from ice and stone.

**Basic Information:**
- **Size:** Medium
- **Speed:** 30 feet
- **Lifespan:** 80-120 years
- **Languages:** Common, Old Nord, Runic
- **Variants:** 3 available (Berserker, Skald, Icewalker)`
                },
                {
                  title: 'Cultural Background',
                  content: `The Nordmark culture revolves around honor, strength, and the belief that a glorious death in battle ensures a place in the halls of their ancestors. They are natural warriors and leaders, though their pride and quick tempers often lead them into conflict with more diplomatic peoples.

Their society values:
- **Honor and Glory:** A warrior's reputation is everything
- **Strength of Will:** Mental fortitude is as important as physical power
- **Ancestral Traditions:** Ancient sagas and customs guide their lives
- **Battle Prowess:** Combat skill determines social standing`
                },
                {
                  title: 'Variant Comparison',
                  content: `**Berserker Nordmark** - Fierce warriors who embrace the fury of battle above all else
- Constitution +2, Strength +2, Agility -1, Intelligence -2, Spirit +1, Charisma -1
- Focus: Aggressive combat, rage mechanics, fearless warrior

**Skald Nordmark** - Warrior-poets who preserve the ancient sagas and inspire others
- Constitution +1, Agility -1, Intelligence +1, Spirit +2, Charisma +1
- Focus: Support, inspiration, knowledge, balanced combat

**Icewalker Nordmark** - Hardy survivors who have adapted to the harshest frozen wastes
- Constitution +3, Intelligence -1, Spirit +1, Charisma -2
- Focus: Extreme durability, cold mastery, environmental adaptation`
                },
                {
                  title: 'Integration with Game Systems',
                  content: `**Action Point System:** Many Nordmark racial traits interact with the AP system, providing unique tactical options during combat and exploration. Berserker rage costs 1 AP, Skald inspiration costs 2 AP.

**Background Synergy:** Consider how your chosen variant's traits complement your background path. Berserkers pair well with Reaver backgrounds, Skalds with Mystic or Sentinel paths, and Icewalkers with survival-focused backgrounds.

**Class Compatibility:** While any variant can pursue any class, Berserkers excel as warriors, Skalds as support casters or bards, and Icewalkers as tanks. Choose your variant based on your intended build.

**Meaningful Trade-offs:** Each variant has both strengths and weaknesses. Berserkers gain incredible combat power but lose tactical flexibility. Skalds provide powerful support but can alert enemies. Icewalkers are nearly invincible in cold but vulnerable to heat.`
                }
              ],
              tables: [
                {
                  title: 'Berserker Nordmark Traits',
                  headers: ['Trait', 'Type', 'Description'],
                  rows: [
                    ['Frostborn', 'Environmental', 'Resistance to cold damage and advantage on saves against exhaustion from harsh weather. Can survive in arctic conditions without shelter, but breath creates visible frost making stealth difficult.'],
                    ['Battle Fury', 'Combat', 'When reduced to half hit points, enter berserker rage (1 AP). Gain +3 damage but take -3 to Armor and cannot cast spells for 1 minute. Once per long rest.'],
                    ['Reckless Courage', 'Combat', 'Immunity to fear effects, but retreating or avoiding a direct challenge requires a Spirit save using a challenging difficulty die (GM sets, usually d10). Bloodlust makes tactical withdrawal nearly impossible.']
                  ]
                },
                {
                  title: 'Skald Nordmark Traits',
                  headers: ['Trait', 'Type', 'Description'],
                  rows: [
                    ['Frostborn', 'Environmental', 'Resistance to cold damage and advantage on saves against exhaustion from harsh weather. Can survive in arctic conditions without shelter, but breath creates visible frost making stealth difficult.'],
                    ['Inspiring Saga', 'Support', 'Recite ancient sagas to inspire allies (2 AP). All allies within 30 feet gain advantage on their next attack or save. Once per short rest, but must speak loudly, potentially alerting enemies.'],
                    ['Ancestral Memory', 'Knowledge', 'Advantage on History checks and can recall ancient lore, but compelled to share stories at length, often at inappropriate times, giving disadvantage on stealth group checks.']
                  ]
                },
                {
                  title: 'Icewalker Nordmark Traits',
                  headers: ['Trait', 'Type', 'Description'],
                  rows: [
                    ['Deep Frost', 'Environmental', 'Immunity to cold damage and exhaustion from harsh weather. Can survive in arctic conditions indefinitely, but take vulnerability to fire damage and disadvantage on saves against heat effects.'],
                    ['Ice Walk', 'Mobility', 'Can walk on ice and snow without slipping and leave no tracks in frozen terrain. However, move at half speed on warm ground and take 1 damage per hour in temperatures above 70°F.'],
                    ['Frozen Heart', 'Mental', 'Advantage on saves against charm and emotion effects, but disadvantage on all Charisma-based social interactions due to cold, distant demeanor.']
                  ]
                }
              ]
            },
            {
              id: 'corvani',
              name: 'Corvani',
              sections: [
                {
                  title: 'Overview',
                  content: `**Raven-marked people from mist-shrouded highlands who walk between worlds**

The Corvani are a mysterious people marked by the raven, dwelling in the mist-shrouded highlands where the veil between worlds grows thin. They possess an uncanny connection to fate and the ethereal realm.

**Basic Information:**
- **Size:** Medium
- **Speed:** 30 feet (Scout: 35 feet)
- **Lifespan:** 90-110 years
- **Languages:** Common, Corvid
- **Variants:** 2 available (Oracle, Scout)`
                },
                {
                  title: 'Cultural Background',
                  content: `The Corvani are born with raven-black markings that shift and change with their moods and destinies. They dwell in the mist-shrouded highlands where reality blurs and the future whispers through the fog. Their culture values prophecy, spirit, and the ability to navigate both the physical and spiritual worlds. They serve as messengers, seers, and guides between realms, though their gifts often come with a heavy price. The Corvani believe that fate is a tapestry they can glimpse but never fully control.`
                },
                {
                  title: 'Variant Comparison',
                  content: `**Oracle Corvani** - Gifted seers who peer deep into fate's threads
- Strength -1, Agility +1, Intelligence +2, Spirit +3, Charisma +1
- Focus: Divination, prophecy, fate manipulation, support

**Scout Corvani** - Swift messengers navigating treacherous highland paths
- Constitution +1, Agility +3, Intelligence +1, Spirit +1
- Focus: Mobility, communication, mist walking, reconnaissance`
                }
              ],
              tables: [
                {
                  title: 'Oracle Corvani Traits',
                  headers: ['Trait', 'Type', 'Description'],
                  rows: [
                    ['Prophetic Vision', 'Divination', 'Once per long rest, glimpse the future to reroll any d20 roll (yours or an ally\'s) within 60 feet.'],
                    ['Raven Sight', 'Perception', 'Can see through illusions and detect hidden creatures within 30 feet, but suffer -2 to Constitution saves against disease.'],
                    ['Fate\'s Warning', 'Protection', 'Allies within 30 feet gain +1 Armor against the first attack each round, but you take 1 psychic damage when they\'re hit.']
                  ]
                },
                {
                  title: 'Scout Corvani Traits',
                  headers: ['Trait', 'Type', 'Description'],
                  rows: [
                    ['Highland Navigation', 'Movement', 'Cannot become lost in natural terrain and can move at full speed through difficult terrain.'],
                    ['Raven Messenger', 'Communication', 'Can send messages via ravens to any location you\'ve visited, but messages can be intercepted by those who speak Corvid.'],
                    ['Mist Walker', 'Defense', 'Can become partially incorporeal for 1 round (resistance to physical damage), but become vulnerable to radiant damage for 1 minute.']
                  ]
                }
              ]
            },
            {
              id: 'grimheart',
              name: 'Grimheart',
              sections: [
                {
                  title: 'Overview',
                  content: `**Stone-souled miners who delved too deep and were forever changed**

The Grimheart are a cursed people who delved too deep into the earth and awakened something ancient. Their bodies have become partially stone, and they hear the whispers of the deep earth calling them ever downward.

**Basic Information:**
- **Size:** Medium
- **Speed:** 25 feet
- **Lifespan:** 180-220 years
- **Languages:** Common, Terran
- **Variants:** Multiple available (Delver, Forgemaster, Stoneward)`
                },
                {
                  title: 'Cultural Background',
                  content: `The Grimheart were once master miners and craftsmen, but their insatiable greed and curiosity led them to dig too deep. They breached ancient chambers and were cursed by what they found. Now their skin is hard as stone, their hearts beat slowly, and they hear constant whispers from the depths. Their culture is one of obsession and compulsion - they cannot stop digging, cannot stop seeking what lies beneath. Some embrace this curse as a gift, while others struggle against it. They are master craftsmen and engineers, but their obsessive nature makes them difficult companions.`
                },
                {
                  title: 'Variant Comparison',
                  content: `**Earthscar Grimheart** - Obsessive miners driven by deep earth whispers
- Constitution +4, Strength +3, Agility -2, Intelligence +1, Spirit -2, Charisma -3
- Focus: Durability, tunneling, mineral detection, obsessive digging

**Forgeborn Grimheart** - Master craftsmen channeling obsession into creation
- Constitution +3, Strength +2, Agility -2, Intelligence +2, Spirit +2, Charisma -1
- Focus: Crafting, smithing, item creation, durability

**Stoneblood Grimheart** - Guardians resisting the whispers to protect others
- Constitution +3, Strength +1, Agility -2, Intelligence +0, Spirit +3, Charisma +1
- Focus: Defense, protection, resistance to compulsion, tanking`
                }
              ],
              tables: [
                {
                  title: 'Earthscar Grimheart Traits',
                  headers: ['Trait', 'Type', 'Description'],
                  rows: [
                    ['Earth Whispers', 'Detection', 'Can sense valuable minerals and hidden passages within 60 feet, but hear constant whispers that impose disadvantage on Spirit saves.'],
                    ['Stone Skin', 'Defense', 'Natural armor provides +2 Armor, but movement speed reduced by 5 feet.'],
                    ['Deep Delving', 'Utility', 'Can tunnel through stone at half movement speed, but become obsessed with digging and must make Wisdom saves to stop.']
                  ]
                },
                {
                  title: 'Forgeborn Grimheart Traits',
                  headers: ['Trait', 'Type', 'Description'],
                  rows: [
                    ['Earth\'s Forge', 'Crafting', 'Can shape metal and stone with bare hands, creating masterwork items with half the normal time and cost. However, you are COMPELLED to craft - must spend at least 4 hours per day creating items or suffer -2 to all rolls from restlessness.'],
                    ['Stone Resilience', 'Defense', 'Resistant to fire and poison damage. Your stone-hardened flesh provides +1 Armor. However, you are vulnerable to acid damage.'],
                    ['Master\'s Touch', 'Crafting', 'Items you craft gain +1 to attack rolls or armor bonus, but you feel their use and destruction. When an item you created is destroyed, you take 1d6 psychic damage.']
                  ]
                },
                {
                  title: 'Stoneblood Grimheart Traits',
                  headers: ['Trait', 'Type', 'Description'],
                  rows: [
                    ['Guardian\'s Resolve', 'Protection', 'Can absorb damage intended for allies within 10 feet, but take +50% of the absorbed damage.'],
                    ['Deep Sight', 'Perception', 'Darkvision 120 feet and can see through magical darkness, but bright light causes disadvantage on attack rolls.'],
                    ['Stone Ward', 'Utility', 'Can create protective stone barriers, but each use drains 1 point of Constitution until long rest.']
                  ]
                }
              ]
            },
            {
              id: 'all-races',
              name: 'All Races',
              tables: [
                {
                  title: 'Complete Race List',
                  headers: ['Race', 'Description', 'Variants', 'Key Themes'],
                  rows: [
                    ['Nordmark', 'Iron-willed descendants of frozen northlands', '3', 'Cold resistance, battle fury, honor'],
                    ['Corvani', 'Raven-marked people from mist-shrouded highlands', '2', 'Prophecy, perception, fate manipulation'],
                    ['Grimheart', 'Stone-souled miners who delved too deep', '3', 'Durability, crafting, earth magic, obsession'],
                    ['Veilborn', 'Pale folk from borderlands where reality grows thin', '2', 'Ethereal sight, spirit communication, planar travel'],
                    ['Mirrorkin', 'Shapeshifters who lost their original forms', '2', 'Shapeshifting, deception, identity crisis'],
                    ['Thornkin', 'Fae-touched beings bound by ancient pacts', '1', 'Fae bargains, nature magic, supernatural rules'],
                    ['Wildkin', 'Antlered forest dwellers bonded with wilderness', '1', 'Nature magic, grove bonds, primal power'],
                    ['Ashmark', 'Fire-touched people from volcanic wastelands', '3', 'Fire immunity, crafting, inner flames'],
                    ['Skinwalker', 'Cursed shamans wearing beast forms', '2', 'Transformation, tracking, beast nature'],
                    ['Graveworn', 'Undead warriors guarding ancient treasures', '2', 'Undead resilience, immortality, obsessive duty']
                  ]
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 'combat-system',
    name: 'Combat System',
    icon: 'fas fa-fist-raised',
    description: 'Tactical combat with AP management and streamlined mechanics',
    subcategories: [
      {
        id: 'combat-basics',
        name: 'Combat Basics',
        icon: 'fas fa-shield-alt',
        content: {
          title: 'Combat Basics',
          description: 'Rounds, turns, initiative, and Action Points',
          sections: [
            {
              title: 'Combat Structure',
              content: `Combat is divided into rounds. Each round, every combatant takes one turn in initiative order. A turn consists of spending Action Points (AP) to perform actions.`
            },
            {
              title: 'Initiative',
              content: `At the start of combat, all combatants roll initiative (1d20 + Agility modifier). Higher results act first. Ties are broken by higher Agility score.`
            },
            {
              title: 'Action Points (AP)',
              content: `Each character has a pool of AP that refreshes at the start of their turn. Most characters have 6 AP per turn. Actions cost varying amounts of AP.`
            }
          ],
          tables: [
            {
              title: 'Combat Actions',
              description: 'The fundamental actions available in combat. Each action costs Action Points—manage your AP wisely to maximize your effectiveness.',
              headers: ['Action', 'Type', 'Description', 'Cost'],
              rows: [
                ['Attack (Unarmed)', 'A', 'Attack with your fists or improvised weapons. Damage and properties depend on your currently equipped weapon. Roll your weapon die - a 1 is a miss (roll again to check for critical miss), maximum value is a critical hit, any other result hits and deals damage equal to the roll plus your attribute modifier.', '2 AP'],
                [{ spellId: 'universal_move' }, 'A', 'Move up to your movement speed (typically 30 feet). This movement can be broken up between other actions.', '1 AP'],
                [{ spellId: 'universal_disengage' }, 'A', 'Move away from enemies without provoking opportunity attacks. You can move up to your full movement speed while maintaining your defensive stance.', '1 AP'],
                [{ spellId: 'universal_use_item' }, 'A', 'Draw, stow, or use an item in your inventory.', '1 AP'],
                [{ spellId: 'universal_hide' }, 'A', 'Make a Stealth check to hide from enemies.', '1 AP'],
                [{ spellId: 'universal_help' }, 'A', 'Assist an ally with a task, giving them advantage on their next check.', '1 AP'],
                [{ spellId: 'universal_ready_action' }, 'A', 'Prepare to take an action in response to a specific trigger.', '1 AP (+ action cost)']
              ]
            }
          ]
        }
      },
      {
        id: 'attacks-damage',
        name: 'Attacks & Damage',
        icon: 'fas fa-crosshairs',
        content: {
          title: 'Attacks & Damage',
          description: 'Unified attack/damage rolls, armor absorption, critical system',
          sections: [
            {
              title: 'Attack Resolution',
              content: `When you make an attack or cast a spell, the process follows these steps:

1. Spend AP: Spend the required Action Points (typically 1-2)
2. Roll Attack: Roll your weapon die (e.g., 1d8 for longsword)
3. Determine Outcome: 1 = miss (roll again to check for critical miss), maximum die value = critical hit, other rolls hit
4. Calculate Damage: For weapon attacks: damage equals weapon die roll plus attribute modifier
5. Apply Armor Reduction: Armor gives passive damage reduction equal to Armor ÷ 10 (rounded down). If the defender used Defend, roll their armor-based soak die and reduce damage by that result.
6. Apply Damage: Remaining damage reduces target's hit points`
            },
            {
              title: 'Armor & Defense',
              content: `Armor now works in two simple layers with no bookkeeping:

Armor Score = Base 10 + armor bonus + enchantment bonus
Passive Damage Reduction: Reduce incoming damage by Armor ÷ 10 (rounded down).
Defend Soak Die: If you take the Defend action, roll a soak die based on your Armor (see table) and reduce damage by the result.`
            }
          ],
          tables: [
            {
              title: 'Passive Damage Reduction Examples',
              description: 'Your armor provides constant protection, automatically reducing incoming damage. Higher armor means better passive defense.',
              headers: ['Armor', 'Passive DR (Armor ÷ 10, floor)'],
              rows: [
                ['7', '0'],
                ['14', '1'],
                ['22', '2'],
                ['38', '3'],
                ['77', '7']
              ]
            },
            {
              title: 'Soak Die Scale (Defend Action)',
              description: 'When you take the Defend action, roll a soak die based on your armor to reduce damage. Better armor means better defensive rolls.',
              headers: ['Armor', 'Soak Die'],
              rows: [
                ['0–4', '—'],
                ['5–9', '1d4'],
                ['10–14', '1d6'],
                ['15–19', '1d8'],
                ['20–24', '1d10'],
                ['25–29', '1d12'],
                ['30–34', '1d12 + 1d4'],
                ['35–39', '1d12 + 1d6'],
                ['40–44', '2d12'],
                ['45–49', '2d12 + 1d4']
              ]
            }
          ]
        }
      },
      {
        id: 'critical-hits',
        name: 'Critical Hits',
        icon: 'fas fa-burst',
        content: {
          title: 'Critical Hits',
          description: 'Weapon-specific effects, exploding dice, and miss consequences',
          sections: [
            {
              title: 'Critical Hit System',
              content: `Our critical hit system is based on the weapon or spell die used:

Critical Hit: Rolling maximum value on weapon die (e.g., 8 on d8): deals maximum damage plus attribute modifier
Exploding Dice: When you roll the maximum value on a die, you can roll again and add the result (useful for parrying larger weapons)
Critical Miss: Rolling a 1 followed by another 1: roll on the Miss Consequences table`
            },
            {
              title: 'Weapon-Specific Critical Effects',
              content: `Different weapon types cause additional effects on critical hits:

Slashing: Bleeding: 1d4 damage for 1d4 rounds
Piercing: Armor Penetration: Reduce target's passive DR by 2 (minimum 0) for 1d4 rounds
Bludgeoning: Stun: Target stunned for 1 round (Con save using a moderate difficulty die—typically d8—negates)
Ranged: Pin: Target's movement reduced by half for 1d4 rounds`
            }
          ],
          tables: [
            {
              title: 'Miss Consequences',
              description: 'When fate turns against you and you roll a critical miss, roll on this table to determine the consequence. Even failure tells a story.',
              headers: ['Roll', 'Consequence'],
              rows: [
                ['1', 'Catastrophic Failure: Weapon breaks/malfunctions (1 AP + quick Agility check with a moderate difficulty die—typically d8—to fix)'],
                ['2', 'Self-Inflicted Wound: Take 1d4 damage + Bleeding for 1d4 rounds'],
                ['3', 'Overextension: Fall prone, end movement for this turn'],
                ['4', 'Tactical Blunder: Next attack against you has advantage'],
                ['5', 'Fumble: Drop weapon at your feet'],
                ['6', 'Distraction: Lose 1 AP from your next turn'],
                ['7', 'Off-Balance: Movement speed halved on next turn'],
                ['8', 'Exposed: Passive DR reduced by 2 until next turn'],
                ['9', 'Demoralized: Disadvantage on next saving throw'],
                ['10', 'Simple Miss: No additional consequence']
              ]
            }
          ]
        }
      },
      {
        id: 'damage-modifiers',
        name: 'Damage Modifiers',
        icon: 'fas fa-fire',
        content: {
          title: 'Damage Modifiers',
          description: 'Standardized tiers for damage increase, reduction, and conversion',
          sections: [
            {
              title: 'Damage Modifier System',
              content: `Our damage modifier system uses standardized tiers to determine how much damage is increased, reduced, or converted. These modifiers stack with other effects and are calculated after all other damage bonuses.

Application Order:
1. Base Damage: Calculate the initial damage (dice + modifiers)
2. Armor Reduction: Subtract passive DR (Armor ÷ 10) and any Defend soak result
3. Damage Modifiers: Apply vulnerability/resistance modifiers
4. Conversion Effects: Apply any leech/absorb/invert effects
5. Final Damage: Apply the final damage to the target`
            }
          ],
          tables: [
            {
              title: 'Damage Increase Tiers',
              description: 'When targets are vulnerable, your attacks strike harder. These modifiers multiply damage, making weaknesses devastating.',
              headers: ['Modifier', 'Effect', 'Calculation', 'Example (10 damage)'],
              rows: [
                ['Susceptible', '25% more damage', '×1.25 (round up)', '13 damage'],
                ['Exposed', '50% more damage', '×1.5 (round up)', '15 damage'],
                ['Vulnerable', '100% more damage', '×2', '20 damage']
              ]
            },
            {
              title: 'Damage Reduction Tiers',
              description: 'Resistance and immunity reduce incoming harm. These modifiers protect you from damage types you\'re prepared to face.',
              headers: ['Modifier', 'Effect', 'Calculation', 'Example (10 damage)'],
              rows: [
                ['Guarded', '25% less damage', '×0.75 (round down)', '7 damage'],
                ['Resistant', '50% less damage', '×0.5 (round down)', '5 damage'],
                ['Immune', 'No damage', '×0', '0 damage']
              ]
            },
            {
              title: 'Damage Conversion Tiers',
              description: 'Some abilities turn harm into healing. These powerful modifiers let you absorb damage and convert it to life force.',
              headers: ['Modifier', 'Effect', 'Calculation', 'Example (10 damage)'],
              rows: [
                ['Leech', '25% heals attacker', '×0.25 (round up)', '3 healing'],
                ['Absorb', '50% heals attacker', '×0.5 (round up)', '5 healing'],
                ['Invert', '100% heals attacker', '×1', '10 healing']
              ]
            }
          ]
        }
      },
      {
        id: 'death-dying',
        name: 'Death & Dying',
        icon: 'fas fa-skull',
        content: {
          title: 'Death & Dying',
          description: 'Dying condition with limited actions and exhaustion accumulation',
          tabs: [
            {
              id: 'dying-rules',
              name: 'Dying Rules',
              sections: [
                {
                  title: 'Dying Condition',
                  content: `When you reach 0 HP, you fall unconscious and begin dying. While dying, you can still take 1 AP worth of actions per turn (crawling, drinking a potion, etc.). You make death saving throws at the start of each turn. When a character reaches 6 levels of exhaustion or is killed outright by massive damage, they die.`
                },
                {
                  title: 'Death Saving Throws',
                  content: `Roll 1d20. On 10+, you succeed. On 9 or less, you fail. Three successes stabilize you. Three failures mean death. Natural 20 restores 1 HP. Natural 1 counts as two failures.`
                },
                {
                  title: 'System Shock',
                  content: `When you take damage equal to or greater than half your maximum hit points from a single source, make a Constitution save using an easy difficulty die (typically d6). On a failure, you suffer system shock and gain one level of exhaustion—your body reels from the trauma.`
                },
                {
                  title: 'Massive Damage',
                  content: `If you take damage equal to or greater than your maximum hit points from a single source, make a Constitution save using a difficult die (usually d12; the GM may step up to d20 for truly devastating blows). On a failure, you die instantly regardless of your current hit points. On a success, you drop to 0 hit points and begin dying normally.`
                }
              ]
            },
            {
              id: 'injuries',
              name: 'Injuries',
              sections: [
                {
                  title: 'Lingering Injuries',
                  content: `When you suffer a critical hit or fail a death saving throw by 5 or more, you may suffer a lingering injury. Roll on the Injury Table to determine the effect. Injuries can be healed through magical means or extended downtime.`
                }
              ],
              tables: [
                {
                  title: 'Injury Table',
                  headers: ['d20', 'Injury', 'Effect'],
                  rows: [
                    ['1', 'Lose an Eye', 'Disadvantage on Perception checks and ranged attacks'],
                    ['2-3', 'Lose an Arm/Hand', 'Can only hold one item, disadvantage on two-handed activities'],
                    ['4-5', 'Lose a Foot/Leg', 'Speed reduced by 5 feet, disadvantage on Athletics checks'],
                    ['6-7', 'Limp', 'Speed reduced by 5 feet'],
                    ['8-10', 'Internal Injury', 'Maximum hit points reduced by 1d4 until healed'],
                    ['11-13', 'Broken Ribs', 'Disadvantage on Constitution saving throws'],
                    ['14-16', 'Horrible Scar', 'Disadvantage on Persuasion checks, advantage on Intimidation'],
                    ['17-18', 'Festering Wound', 'Hit point maximum reduced by 1 each day until healed'],
                    ['19-20', 'Minor Scar', 'No mechanical effect, but a permanent reminder']
                  ]
                }
              ]
            },
            {
              id: 'exhaustion',
              name: 'Exhaustion',
              tables: [
                {
                  title: 'Exhaustion Levels',
                  rowsPerPage: 3,
                  headers: ['Level', 'Effect'],
                  rows: [
                    ['1', 'Disadvantage on ability checks'],
                    ['2', 'Speed halved'],
                    ['3', 'Disadvantage on attack rolls and saving throws'],
                    ['4', 'HP maximum halved'],
                    ['5', 'Speed reduced to 0'],
                    ['6', 'Death']
                  ]
                }
              ]
            },
            {
              id: 'soul-fragments',
              name: 'Soul Fragments & Soulmonger',
              sections: [
                {
                  title: 'When to Use',
                  content: `**High-stakes campaigns with supernatural themes**

The Soulmonger system adds dark supernatural elements and high-stakes choices to death and recovery.`
                },
                {
                  title: 'Soul Fragments',
                  content: `When a character dies, their soul shatters into fragments that can be collected for resurrection. In a world of magic, death need not be permanent, but it requires quick action and careful preparation.`
                }
              ],
              tabs: [
                {
                  id: 'soul-basics',
                  name: 'Soul Fragments',
                  tables: [
                    {
                      title: 'Soul Fragment Mechanics',
                      headers: ['Aspect', 'Details'],
                      rows: [
                        ['Creation', 'Death shatters the soul into 1d6+3 fragments'],
                        ['Collection', 'Must be collected within 1 minute of death'],
                        ['Viability', 'Fragments remain viable for 7 days'],
                        ['Degradation', '5% cumulative daily chance of fragment loss'],
                        ['Requirement', 'Minimum 3 fragments needed for resurrection']
                      ]
                    },
                    {
                      title: 'Soul Anchor Types',
                      headers: ['Type', 'Preservation Duration', 'Resurrection difficulty shift', 'Rarity'],
                      rows: [
                        ['Minor Anchor', '14 days', 'No change', 'Uncommon'],
                        ['Major Anchor', '30 days', '-2', 'Rare'],
                        ['Greater Anchor', 'Indefinite', '-5', 'Very Rare'],
                        ['Soul Phylactery', 'Indefinite', 'Automatic success', 'Legendary']
                      ]
                    }
                  ]
                },
                {
                  id: 'soulmonger-services',
                  name: 'Soulmonger Services',
                  sections: [
                    {
                      title: 'The Soulmonger',
                      content: `In our world, a mysterious force known as the Soulmonger affects what happens to souls after death. Soulmongers offer various services in exchange for souls or Withered Essence.

**Withered Essence:** Souls can be converted into Withered Essence, a currency that can be used to purchase various services. One Soul is equivalent to 1,000 Withered Essence.

**Warning:** The use of souls is irreversible and their consumption carries weighty consequences in the world. Each transaction with a Soulmonger is a pact that shapes the fabric of reality, eternally altering the bearer's destiny.`
                    }
                  ],
                  tables: [
                    {
                      title: 'Soulmonger Services (1 Soul = 1,000 Withered Essence)',
                      headers: ['Service', 'Cost', 'Effect'],
                      rows: [
                        ['Level Up', 'Level × 1 Soul', 'Character gains one level'],
                        ['Minor Healing', 'Level × 150 Essence', 'Remove 1 level of exhaustion (1/day)'],
                        ['Major Healing', 'Level × 500 Essence', 'Remove 3 levels of exhaustion (1/day)'],
                        ['Full Healing', 'Level × 900 Essence', 'Remove 5 levels of exhaustion (1/day)'],
                        ['Enchantment', 'Level × 1 Soul', 'Add magical properties to equipment'],
                        ['Resurrection', 'Level × 10 Souls', 'Resurrect a character who failed normal resurrection']
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: 'resurrection',
              name: 'Resurrection',
              description: `**Resurrection Methods:** Different spells have varying requirements for resurrection. The more powerful the spell, the more soul fragments required and the longer the time window.

**Resurrection Challenges:** Resurrection is not guaranteed and comes with challenges. The ritual requires special components, takes time to perform, and may fail entirely.`,
              tables: [
                {
                  title: 'Spell Requirements',
                  headers: ['Spell', 'Time Limit', 'Fragments Required', 'Special Notes'],
                  rows: [
                    ['Revivify', 'Within 1 minute', '1 fragment', 'Quick resurrection'],
                    ['Raise Dead', 'Within 7 days', '3 fragments', 'Standard resurrection'],
                    ['Resurrection', 'Within 100 years', '5 fragments', 'Powerful restoration'],
                    ['True Resurrection', 'Any time', '7 fragments', 'Perfect restoration'],
                    ['Reincarnation', 'Within 7 days', '3 fragments', 'New body, same soul']
                  ]
                },
                {
                  title: 'Challenge Details',
                  headers: ['Aspect', 'Requirement'],
                  rows: [
                    ['Resurrection Difficulty', 'Base difficulty die is d10; shift the die one size harder for each previous resurrection and for each day since death'],
                    ['Ritual Components', 'Special components worth at least 500 gp'],
                    ['Ritual Duration', 'Takes 1 hour to perform'],
                    ['Failed Resurrection', 'Consumes the soul fragments but fails to restore life'],
                    ['Soul Anchors', 'Special items that can improve resurrection chances']
                  ]
                }
              ]
            },
            {
              id: 'resurrection-consequences',
              name: 'Resurrection Consequences',
              sections: [
                {
                  title: 'Post-Resurrection Effects',
                  content: `Returning from death is traumatic and leaves lasting effects. Every resurrection changes the character in some way, making death a meaningful consequence even when reversed.`
                }
              ],
              tables: [
                {
                  title: 'Standard Resurrection Effects',
                  headers: ['Effect', 'Duration/Permanence'],
                  rows: [
                    ['Exhaustion: Return with 2 levels of exhaustion', 'Until rested'],
                    ['Mental Trauma: Suffer from nightmares or flashbacks for 1d6 days', 'Temporary'],
                    ['Death Memory: Retain fragmented memories of the afterlife', 'Permanent'],
                    ['Weakened Connection: Disadvantage on saves vs necromantic effects for 7 days', 'Temporary'],
                    ['Soul Scar: Each resurrection leaves a permanent mark on the soul', 'Permanent']
                  ]
                }
              ]
            },
            {
              id: 'devils-bargain',
              name: 'The Devil\'s Bargain',
              sections: [
                {
                  title: 'When Resurrection Fails',
                  content: `When traditional resurrection fails or is unavailable, characters may be offered a deal with dark powers. This is always a last resort with significant consequences.`
                }
              ],
              tables: [
                {
                  title: 'Bargain Details',
                  headers: ['Aspect', 'Details'],
                  rows: [
                    ['Offer', 'The character\'s soul is offered a deal for resurrection'],
                    ['Price', 'The price is always significant—a task, sacrifice, or permanent change'],
                    ['Spirit Save', 'Upon resurrection, make a very hard Spirit save (use a difficult die such as d12, up to d20 for severe spiritual resistance)'],
                    ['Failure Consequence', 'On a failed save, roll on the "Resurrection Miracle" table'],
                    ['Soul Debt', 'The character now owes a debt that will come due at a critical moment']
                  ]
                }
              ]
            },
            {
              id: 'miracle-table',
              name: 'Resurrection Miracles',
              sections: [
                {
                  title: 'Resurrection Miracle Table',
                  content: `Roll 1d20 when a character fails their Spirit save after a devil's bargain. These effects are permanent and represent the price of cheating death through dark powers.`
                }
              ],
              tables: [
                {
                  title: 'Resurrection Miracle Effects (d20)',
                  headers: ['Roll', 'Miracle Effect'],
                  rows: [
                    ['1', 'Empty. There is nothing left of you to be consumed. You, whatever that means, is gone now. You are a mindless thing. You must create a new character.'],
                    ['2', 'Decay\'s Caress. Your flesh begins to rot visibly, spreading a stench of death. Lose 3 from your CHA permanently.'],
                    ['3', 'Abyssal Clutch. Dark forces erode your essence, leeching away your vitality. Reduce two attributes of your choice by 3 each.'],
                    ['4', 'Death\'s Blessing. You have returned tougher, hardier. Add an extra +1d6 to your starting Base Position.'],
                    ['5', 'Tortured Bones. Your skeleton painfully reshapes itself, granting you a +2 Armor but reducing your Constitution by 2 due to constant pain.'],
                    ['6', 'Emptiness Within. Devoid of emotions and sensations, you traverse the world as a hollow shell, immune to fear and persuasion.'],
                    ['7', 'Ghastly Whispers. Unseen voices fill your head, distracting and terrifying. Suffer a -1 penalty to Spirit and have disadvantage on concentration checks.'],
                    ['8', 'Withering Strength. Your muscles deteriorate; permanently reduce your Strength by 2.'],
                    ['9', 'Numb Senses. You lose your sharp reflexes; reduce your Agility by 2.'],
                    ['10', 'Mind Erosion. Lose proficiency in one Intelligence-based skill of your choice as your intellect falters.'],
                    ['11', 'Bleak Existence. You find no comfort in food, drink, or rest. All recovery from rest is halved, and you cannot benefit from potions.'],
                    ['12', 'Echoes of the Void. You hear eerie, otherworldly sounds that distract and unsettle you, imposing disadvantage on Spirit checks.'],
                    ['13', 'Absent Minded. Your mind wanders, no longer able to focus on the things that you took joy in. Reduce your starting Intelligence score by -1.'],
                    ['14', 'Lingering Cold. Your body is unnaturally cold, causing pain and stiffness. Reduce your Speed by 10 feet and gain vulnerability to fire damage, but resistance to cold damage.'],
                    ['15', 'Spectral Chains. You feel as if invisible chains bind you, slowing your movements and sapping your strength. Reduce your Speed by 5 feet and your Strength score by 1.'],
                    ['16', 'Forgotten. Some memory, some fragile recollection of your past or current life has gone. Between you and the GM, decide what this memory is and what effect its loss has on you.'],
                    ['17', 'Gruesome Visage. Your appearance becomes horrifying to others, giving you advantage on Intimidation but disadvantage on all other Charisma checks.'],
                    ['18', 'Dulled Senses. You are slower to react to threats as they present themselves. Reduce your Initiative by -1.'],
                    ['19', 'Corrupted Blood. Your blood turns toxic, providing immunity to disease but causing you to take damage from healing spells and effects.'],
                    ['20', 'Miracle of the Grave. Perhaps you are less than you once were, but this time, upon returning to life, you feel alive. Gain +2 to any single attribute.']
                  ]
                }
              ]
            },
            {
              id: 'stabilization',
              name: 'Stabilization',
              sections: [
                {
                  title: 'Becoming Stable',
                  content: `You stabilize when you succeed on three death saves, receive healing, or an ally uses an action to stabilize you (Medicine check with an easy difficulty die—typically d6). Stable creatures remain unconscious at 0 HP but don't make death saves.`
                }
              ]
            }
          ]
        }
      },
      {
        id: 'reactions',
        name: 'Reactions',
        icon: 'fas fa-bolt',
        content: {
          title: 'Reactions',
          description: 'Special actions taken outside your turn in response to triggers',
          sections: [
            {
              title: 'Reaction Rules',
              content: `Reactions are special actions that can be taken outside of your turn in response to specific triggers. They cost Action Points (AP) and represent your character's ability to respond quickly to changing battlefield conditions.`
            }
          ],
          tabs: [
            {
              id: 'defensive-reactions',
              name: 'Defensive Reactions',
              sections: [
                {
                  title: 'Defensive Options',
                  content: `When attacked, you can spend AP for these defensive options:`
                }
              ],
              tables: [
                {
                  title: 'Defensive Reactions',
                  headers: ['Action', 'Type', 'Description', 'Cost'],
                  rows: [
                    [{ spellId: 'universal_dodge' }, 'R', 'Makes it harder for attackers to hit you, increasing their miss chance (making rolls of 1-3 on a d8 miss, for example)', '2 AP'],
                    [{ spellId: 'universal_parry' }, 'R', 'Roll your weapon die vs. attacker\'s roll; if higher, negate the attack. Even smaller weapons can parry larger attacks through exploding dice', '1 AP'],
                    [{ spellId: 'universal_raise_shield' }, 'R', 'Roll a shield die (d8) to reduce additional damage before armor reduction is applied', '1 AP']
                  ]
                }
              ]
            },
            {
              id: 'standard-reactions',
              name: 'Standard Reactions',
              sections: [
                {
                  title: 'Available to All Characters',
                  content: `These reactions are available to all characters regardless of class:`
                }
              ],
              tables: [
                {
                  title: 'Standard Reactions',
                  headers: ['Action', 'Type', 'Description & Roll', 'Cost'],
                  rows: [
                    [{ spellId: 'universal_help' }, 'R', 'Offer advice, gesture, or hint to grant ally 1d8 + to their next action. Applies if reasoning is accepted by the GM.', '1 AP'],
                    [{ spellId: 'universal_evade' }, 'R', 'Evade an attack, by rolling 5 ft. into a dodge. Has to be used when player is prompted by the GM. Performing this agile dodge roll, you also gain a better position (Current Level * 1)', '2 AP'],
                    [{ spellId: 'universal_opportunity_attack' }, 'R', 'React to enemy movement out of melee range with a quick strike. Roll your weapon die as normal, with a miss on 1 and crit on maximum value.', '1 AP'],
                    [{ spellId: 'universal_interpose' }, 'R', 'When an ally within 10 ft. is attacked, push them 5 ft. to safety and take the hit. Make a Strength save using an easy difficulty die (typically d6); on a miss the ally falls prone.', '1 AP (+1 AP for each 10 ft. added)'],
                    [{ spellId: 'universal_parry' }, 'R', 'Turn aside melee and ranged attacks. When attacked, roll your weapon die against the attacker\'s roll; if higher, negate the attack.', '1 AP'],
                    [{ spellId: 'universal_riposte', prefix: '{Parry} → ' }, 'R', 'After a successful parry, immediately counter-attack. Roll your weapon die as normal. This attack ignores the target\'s passive DR and any Defend soak.', '1 AP'],
                    [{ spellId: 'universal_raise_shield' }, 'R', 'Your shield absorbs the impact (roll a d8 to determine damage reduction before armor reduction). The shield\'s durability decreases by 1.', '1 AP'],
                    [{ spellId: 'universal_shield_bash', prefix: '{Raise Shield} → ' }, 'R', 'After successfully raising your shield, turn defense into offense. Make a STR vs. CON Save. If opponent fails, they are stunned until end of their next turn.', '1 AP'],
                    [{ spellId: 'universal_spell_reaction' }, 'R', 'Cast a reactive spell in response to an enemy action. Roll the spell\'s die as normal. Reactive spells often have special effects.', '2 AP']
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        id: 'proficient-abilities',
        name: 'Proficient Abilities',
        icon: 'fas fa-star',
        content: {
          title: 'Proficient Abilities',
          description: 'Special actions available to characters with specific skill proficiencies',
          sections: [
            {
              title: 'Usage Limitations',
              content: `Only one proficient ability can be used per turn, regardless of how many AP you have available. Choose wisely based on the tactical situation.

Proficient abilities are special actions that can be performed by characters who are proficient in specific skills. These powerful techniques represent specialized training and expertise.`
            }
          ],
          tables: [
            {
              title: 'Skill-Based Abilities',
              rowsPerPage: 6,
              headers: ['Skill', 'Unlocks', 'As', 'Note', 'Cost'],
              rows: [
                    ['Acrobatics', 'Charged Squat', 'A', 'Jump up to 10 ft. (Acrobatics vs mod die, fail = prone). Step the die up once to add 5 ft.', '1 AP'],
                    ['Animal Handling', 'Beast Command', 'A', 'Command your pet; start easy d6 and shift die based on pet Int/Spirit vs yours.', '?'],
                    ['Arcana', 'Arcane Counter', 'A', 'Hold a counterspell vs next hostile cast within 30 ft; Arcana vs mod die, step die per spell level.', '1 AP'],
                    ['Athletics', 'Grapple', 'A', 'Athletics vs target STR/AGI; on success they are restrained until your next turn.', '1 AP'],
                    ['Deception', 'Misdirect', 'A', 'Within 10 ft; opposed vs target Int-based die (easy d6 to hard d10). Fail = surprised (no reactions, disadv on attacks).', '1 AP'],
                    ['History', 'Lore Recall', 'A', 'Recall a creature’s tricks within 30 ft; start mod d8, step up for tougher CR.', '1 AP'],
                    ['Insight', 'Flow State', 'A', 'Reduce damage taken by 2 until your next turn; Insight vs mod d8.', '1 AP'],
                    ['Intimidation', 'Taunt', 'R', '15 ft; Intimidation vs Spirit save. Fail = must attack you until they pass.', '1 AP'],
                    ['Investigation', 'Deduct', 'A', 'Read a foe within 15 ft; Investigation vs mod d8, step up for higher CR.', '1 AP'],
                    ['Medicine', 'First Aid', 'A', '5 ft; easy d6. Stabilize to 1 HP (step die per exhaustion). Bandage once: heal 1d4 + Medicine mod.', '1 AP'],
                    ['Nature', 'Terrain Insight', 'A', 'Spot a terrain edge within 10 ft; Nature vs mod d8.', '1 AP'],
                    ['Perception', 'Heightened Senses', 'P', 'Gain +2 initiative.', '-'],
                    ['Performance', 'Mesmer', 'A', '15 ft; Performance vs Spirit save. Fail = lose next turn. Immune: eyeless, multiheaded, undead, celestials, fiends, fey, dragons, constructs. 1/use per combat.', '3 AP'],
                    ['Persuasion', 'Persuade', 'A', 'Persuasion vs Spirit save. Fail = confused (d10 table each turn; one save/turn).', '2 AP'],
                    ['Religion', 'Divine Favor', 'A', '15 ft; Religion vs Spirit/Int save. Roll d4 boon: temp HP, damage reduction, attack bonus, or save advantage. You always gain the boon; allies gain if they fail the save.', '2 AP'],
                    ['Sleight of Hand', 'Disarm', 'R', '5 ft; needs free hand. Sleight vs STR save to disarm and equip the weapon.', '1 AP'],
                    ['Stealth', 'Stealthy Passage', 'A', 'Move through a foe’s space without provoking; Stealth vs easy d6. On success move 15 ft.', '1 AP'],
                    ['Survival', 'Trapping', 'A', 'Set a trap in a 5-ft square within 5 ft; Survival starts d10 (step down with high INT). Pick: Pitfall (4 AP) 1d6/10 ft & restrains; Snare (3 AP) hoists, attacks adv; Tripwire (2 AP) prone, may drop items.', '1 AP']
              ]
            }
          ]
        }
      },
      {
        id: 'combat-conditions',
        name: 'Combat Conditions',
        icon: 'fas fa-exclamation-triangle',
        content: {
          title: 'Combat Conditions',
          description: 'Various states that can affect characters during battle',
          sections: [
            {
              title: 'Condition System',
              content: `Combat conditions represent various states that can affect characters during battle. These conditions can be inflicted by attacks, spells, environmental hazards, or other effects.

Some conditions interact with each other or with the environment to create enhanced effects. For example, targets affected by the Wet condition take additional damage from lightning attacks.`
            }
          ],
          tables: [
            {
              title: 'Common Conditions',
              headers: ['Condition', 'Effect'],
              rows: [
                ['Blinded', 'Cannot see, disadvantage on attacks, opponents have advantage against you'],
                ['Charmed', 'Cannot attack the charmer, charmer has advantage on social checks against you'],
                ['Deafened', 'Cannot hear, automatically fail checks requiring hearing'],
                ['Frightened', 'Disadvantage on ability checks and attacks while source of fear is visible, cannot willingly move closer to source'],
                ['Grappled', 'Speed becomes 0, condition ends if grappler is incapacitated or if target is forcibly moved away'],
                ['Incapacitated', 'Cannot take actions or reactions'],
                ['Invisible', 'Cannot be seen without special senses, advantage on attacks, attacks against you have disadvantage'],
                ['Paralyzed', 'Incapacitated, cannot move or speak, automatically fail STR and AGI saves, attacks against you have advantage and are critical hits if attacker is within 5 feet'],
                ['Petrified', 'Transformed into solid substance, incapacitated, unaware of surroundings, attacks against you have advantage, automatically fail STR and AGI saves, have resistance to all damage'],
                ['Poisoned', 'Disadvantage on attack rolls and ability checks'],
                ['Prone', 'Can only crawl, disadvantage on attack rolls, melee attacks against you have advantage, ranged attacks against you have disadvantage'],
                ['Restrained', 'Speed becomes 0, attacks against you have advantage, your attacks have disadvantage, disadvantage on Agility saves'],
                ['Stunned', 'Incapacitated, cannot move, automatically fail STR and AGI saves, attacks against you have advantage'],
                ['Unconscious', 'Incapacitated, cannot move or speak, unaware of surroundings, drop whatever you\'re holding, fall prone, automatically fail STR and AGI saves, attacks against you have advantage and are critical hits if attacker is within 5 feet']
              ]
            }
          ]
        }
      },
      {
        id: 'resting',
        name: 'Resting',
        icon: 'fas fa-bed',
        content: {
          title: 'Rest & Recovery',
          description: 'Pick the modules you want: start with Core, then layer extras that fit your campaign.',
          sections: [],
          tabs: [
            {
              id: 'core-rest',
              name: 'Core Rest & Recovery',
              sections: [],
              tables: [
                {
                  title: 'Rest at a Glance',
                  description: 'Quick reference for the two core rest types.',
                  headers: ['Rest', 'Duration', 'Recovery', 'Resources', 'Exhaustion / Limit'],
                  rows: [
                    ['Short Rest', '1 hour (light activity)', 'Spend Hit Dice (die + CON) **or** heal 1/4 max HP', 'Some abilities; regain half mana/resources', 'No reduction / Multiple per day'],
                    ['Long Rest', '8 hours (6 sleep, 2 light)', 'Full HP; recover half Hit Dice (min 1)', 'Most abilities recharge', 'Reduce 1 level (needs food/water); 1 per 24h']
                  ]
                },
                {
                  title: 'Rest Risks',
                  description: 'When danger or interruptions apply.',
                  headers: ['Risk', 'Effect'],
                  rows: [
                    ['Interruption', 'If strenuous activity >1 hour (combat, casting, etc.), rest provides no benefit; restart.'],
                    ['Dangerous Areas', 'May require watches, have encounter chances, or be impossible without shelter.']
                  ]
                }
              ]
            },
            {
              id: 'settlement-activities',
              name: 'Settlement Activities',
              sections: [
                {
                  title: 'When to Use',
                  content: `Use these options when the party spends meaningful time in towns and cities. They add downtime flavor without changing the Core rest math.`
                }
              ],
              tables: [
                {
                  title: 'Inn Quality Tiers',
                  description: 'Pick an inn quality, pay the rate, then roll recovery. Low tiers risk complications; lavish stays can grant boons. Use these tables when the group beds down in a settlement.',
                  headers: ['Inn Type', 'Cost', 'Recovery', 'Risk/Benefit'],
                  rows: [
                    ['Poor', '5cp/night', 'd4 recovery roll', 'Roll on Complications table on 1'],
                    ['Modest', '5sp/night', 'd8 recovery roll', 'Roll on Complications table on 1'],
                    ['Comfortable', '1gp/night', 'Reliable recovery', 'No complications'],
                    ['Lavish', '5gp/night', 'Roll on Boons table', 'Best recovery chance']
                  ]
                },
                {
                  title: 'Inn Complications',
                  description: 'If you roll a 1 on recovery at Poor/Modest/Comfortable, roll 2d6 here.',
                  headers: ['Roll', 'Result', 'Effect'],
                  rows: [
                    ['2', 'Major Theft', 'Lose all coins'],
                    ['3', 'Minor Theft', 'Lose half coins'],
                    ['4', 'Disease', 'Gain 1 level exhaustion'],
                    ['5', 'Pests', 'Replace supplies (1d20 gp)'],
                    ['6-8', 'Good Rest', 'No complications'],
                    ['9', 'Poor Sleep', 'No HP recovery'],
                    ['10', 'New Contact', 'Gain valuable contact'],
                    ['11', 'Information', 'Gain useful clue'],
                    ['12', 'Lucky', 'Gain temporary boon']
                  ]
                },
                {
                  title: 'Lavish Inn Boons',
                  description: 'At Lavish inns, after paying for the night, roll 1d6 on this table.',
                  headers: ['Roll', 'Boon', 'Effect'],
                  rows: [
                    ['1', 'Rejuvenation', 'Full HP recovery'],
                    ['2', 'Vitality', 'Temp HP equal to level'],
                    ['3', 'Refreshment', '+1 exhaustion recovery'],
                    ['4', 'Vigor', '+10 ft. movement today'],
                    ['5', 'Inspiration', 'Gain Inspiration'],
                    ['6', 'Restoration', '+2 exhaustion recovery']
                  ]
                }
              ]
            },
            {
              id: 'carousing-wassailing',
              name: 'Carousing & Wassailing',
              sections: [
                {
                  title: 'When to Use',
                  content: `**Social campaigns, downtime activities, seasonal campaigns**

These systems add cultural immersion and social interaction opportunities.`
                },
                {
                  title: 'Carousing',
                  content: `Spend gold at taverns and roll for outcomes. Higher spending increases chances of better results.`
                }
              ],
              tables: [
                {
                  title: 'Carousing Costs',
                  description: 'Pick your spend level; apply its bonus to your d8 outcome roll.',
                  headers: ['Quality', 'Cost', 'Bonus to Roll'],
                  rows: [
                    ['Modest', '5 sp', '+0'],
                    ['Comfortable', '2 gp', '+1'],
                    ['Wealthy', '10 gp', '+2'],
                    ['Extravagant', '50 gp', '+3']
                  ]
                },
                {
                  title: 'Carousing Outcomes (Roll d8 + quality bonus)',
                  description: 'Roll after paying. Apply your quality bonus; higher spend pushes you up the table.',
                  headers: ['Roll', 'Outcome', 'Benefit', 'Complication'],
                  rows: [
                    ['1', 'Bar Fight', '+1 Intimidation for 1d4 days', 'Wake up in jail, pay 3d6 gp fine'],
                    ['2', 'Embarrassing Performance', 'Learn humorous local story', 'Disadvantage on social checks for 1d4 days'],
                    ['3', 'Gambling Loss', 'Make gambling contact', 'Lose additional 2d10 gp'],
                    ['4', 'Hangover', 'Overhear useful rumor', 'Disadvantage until next short rest'],
                    ['5', 'New Friend', 'Gain friendly NPC contact', 'They need 50 gp favor'],
                    ['6', 'Gambling Win', 'Win additional 2d10 gp', 'Sore loser holds grudge'],
                    ['7', 'Useful Information', 'Learn quest secret', 'Someone wants you silent'],
                    ['8-10', 'Memorable Night', 'Advantage on social checks for 1d4 days', 'Minor property damage (1d6 gp)'],
                    ['11+', 'Local Hero', '10% discount for 2d6 days', 'Rival becomes jealous']
                  ]
                },
                {
                  title: 'Wassailing Requirements & Benefits',
                  description: 'Seasonal house-to-house blessing; meet the requirements to gain these benefits.',
                  headers: ['Requirement/Benefit', 'Description'],
                  rows: [
                    ['Group Size', 'At least 3 participants'],
                    ['Preparation', 'Traditional song/blessing (Performance check)'],
                    ['Offering', 'Token gift (minimum 1 sp per location)'],
                    ['Visitations', 'At least 3 locations in one night'],
                    ['Community Favor', 'Advantage on social checks for 1d4 days'],
                    ['Seasonal Blessing', 'Cold resistance for 24 hours'],
                    ['Shared Prosperity', '1d6 sp per location visited'],
                    ['Ritual Magic', 'Increased yields for farms/orchards'],
                    ['Spirit Communion', 'Vision/message on nat 20 Performance']
                  ]
                }
              ]
            },
            {
              id: 'rest-quality',
              name: 'Rest Quality',
              sections: [
                {
                  title: 'Environmental Factors',
                  content: `The quality of your rest depends on your environment, comfort, and safety. Poor conditions can reduce rest benefits or prevent rest entirely.`
                }
              ],
              tables: [
                {
                  title: 'Rest Quality Modifiers',
                  headers: ['Condition', 'Effect on Rest'],
                  rows: [
                    ['Comfortable bed (inn)', '+1d4 temporary HP until next rest'],
                    ['Luxury accommodations', '+1d4 temporary HP, advantage on next saving throw'],
                    ['Bedroll in safe area', 'Normal rest'],
                    ['Sleeping on ground', '-1 to Hit Die healing'],
                    ['Extreme weather', 'Constitution save or gain exhaustion'],
                    ['Dangerous area', 'Interrupted rest on 1-2 on d6'],
                    ['No shelter in storm', 'No long rest benefit, gain exhaustion'],
                    ['Cursed location', 'No rest benefit, possible nightmares']
                  ]
                }
              ]
            },
            {
              id: 'rest-complications',
              name: 'Rest Complications',
              sections: [
                {
                  title: 'Interrupted Rest',
                  content: `If a long rest is interrupted by combat or other strenuous activity lasting more than 1 hour, the rest provides no benefit. You must start over to gain the benefits of a long rest.`
                }
              ],
              tables: [
                {
                  title: 'Rest Complications',
                  headers: ['d12', 'Complication', 'Effect'],
                  rows: [
                    ['1', 'Nightmares', 'No rest benefit, make Spirit save or gain exhaustion'],
                    ['2', 'Equipment stolen', 'Lose 1d4 non-magical items'],
                    ['3', 'Attacked by creatures', 'Combat encounter, rest interrupted'],
                    ['4', 'Bad weather', 'Constitution save or gain exhaustion'],
                    ['5', 'Illness', 'Constitution save or become poisoned for 24 hours'],
                    ['6', 'Disturbing discovery', 'Find something unsettling, Spirit save or be frightened'],
                    ['7', 'Lost', 'Navigation check required to continue journey'],
                    ['8', 'Equipment malfunction', 'One piece of equipment loses 1d4 durability'],
                    ['9', 'Restless sleep', 'Recover only half Hit Dice'],
                    ['10', 'Strange dreams', 'Gain cryptic information about future events'],
                    ['11', 'Peaceful rest', 'Gain inspiration'],
                    ['12', 'Prophetic vision', 'Gain advantage on next important decision']
                  ]
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 'equipment-system',
    name: 'Equipment System',
    icon: 'fas fa-shield',
    description: 'Weapons, armor, and magical items with durability mechanics',
    subcategories: [
      {
        id: 'weapons',
        name: 'Weapons',
        icon: 'fas fa-axe',
        content: {
          title: 'Weapons',
          description: 'Attacks combine your base attack with weapon damage dice and a weapon mastery roll.',
          sections: [
            {
              title: 'Dynamic Weapon State',
              content: `Your active weapon card updates to whatever is equipped. Each weapon shows its base damage die and its type (Sword, Axe, Mace, etc.).`
            },
            {
              title: 'Two Dice, One Attack',
              content: `When you attack you roll:
• Your Weapon Damage die (varies by weapon type; see table).
• Your Weapon Mastery die (default **d8** unless modified by feats/gear). If the weapon die rolls max, it counts as a crit and you add the mastery result to the damage.

Both dice use the weapon type to pick the correct outcome text.`
            },
            {
              title: 'Weapon Mastery Skill',
              content: `Weapon attacks also trigger a Weapon Mastery skill check for the equipped weapon type. Mastery gates special outcomes (disarms, cleaves, rebound mishaps) and can reduce die size with bonuses.`
            },
            {
              title: 'How to Read Results',
              content: `Outcome lines are keyed by weapon type (e.g., "Sword:", "Greataxe:", "Bow:"). The UI filters to the equipped type so you only see relevant text.`
            }
          ],
          tables: [
            {
              title: 'Weapon Types & Dice',
              description: 'All weapon types available in the game, with their typical damage dice. All weapons use a d8 for Weapon Mastery checks.',
              headers: ['Weapon Type', 'Typical Damage Die', 'Notes'],
              rows: [
                // One-Handed Melee
                ['Sword', 'd6', 'Balanced slashes/thrusts, versatile one-handed'],
                ['Axe', 'd8', 'High burst damage, less control'],
                ['Mace', 'd6', 'Crush armor and bone, effective vs. heavy armor'],
                ['Dagger', 'd4', 'Quick crit-fishing stabs, fast attacks'],
                ['Sickle', 'd4', 'Curved blade weapon with agricultural origins'],
                ['Flail', 'd6', 'Chain weapon with weighted head'],
                ['Fist Weapon', 'd4', 'Weapon worn on the hand for unarmed combat'],
                // Main Hand Only
                ['Rapier', 'd6', 'Elegant thrusting sword, main hand only'],
                ['Katana', 'd6', 'Curved blade requiring main hand mastery'],
                ['Saber', 'd6', 'Curved single-edged blade for main hand'],
                ['War Mace', 'd8', 'Heavy mace designed for main hand wielding'],
                // Off-Hand Only
                ['Parrying Dagger', 'd4', 'Defensive blade for off-hand parrying'],
                ['Off-Hand Blade', 'd4', 'Light blade optimized for off-hand combat'],
                ['Buckler', 'd4', 'Small shield for off-hand defense'],
                // Two-Handed Melee
                ['Greatsword', '2d6', 'Two-handed sweeping arcs, high damage'],
                ['Greataxe', 'd12', 'Massive cleaving chops, highest single-die damage'],
                ['Maul', '2d6', 'Shattering two-handed blows, armor crushing'],
                ['Polearm', 'd10', 'Reach, pulls, and trips, extended range'],
                ['Halberd', 'd10', 'Versatile polearm with axe and spear features'],
                ['Scythe', 'd10', 'Curved blade on long pole, sweeping attacks'],
                ['Jousting Spear', 'd10', 'Long lance designed for mounted combat'],
                ['Double-Sided Sword', 'd8', 'Sword with blades on both ends'],
                ['Staff', 'd6', 'Deflective jabs and sweeps, favored by casters'],
                // Ranged Weapons
                ['Bow', 'd8', 'Arced ranged volleys, traditional archery'],
                ['Crossbow', 'd10', 'Precision bolts, requires reload'],
                ['Thrown Weapon', 'd6', 'Axes, knives, or javelins for ranged combat'],
                ['Wand', 'd6', 'Channeled spell strikes, magical focus'],
                ['Blowgun', 'd4', 'Tubular weapon propelling darts with breath'],
                ['Sling', 'd4', 'Simple ranged weapon using centrifugal force'],
                ['Boomerang', 'd6', 'Curved throwing weapon that returns'],
                ['Chakram', 'd6', 'Circular throwing weapon with sharpened edges'],
                ['Shuriken', 'd4', 'Small concealed throwing weapon'],
                ['Dart', 'd4', 'Light throwing projectile'],
                // Instruments
                ['Harp', 'd6', 'Musical instrument that can channel magic, two-handed'],
                ['Lute', 'd6', 'Stringed instrument favored by bards, one-handed'],
                ['Flute', 'd4', 'Wind instrument that can enhance spells, one-handed'],
                ['Drum', 'd6', 'Percussion instrument that can create rhythmic effects, two-handed'],
                ['Horn', 'd4', 'Brass instrument used for signaling and magic, one-handed'],
                ['Violin', 'd6', 'Stringed instrument with a bow, one-handed'],
                ['Guitar', 'd6', 'Stringed instrument popular with bards, one-handed'],
                // Special
                ['Unarmed', 'd4', 'Fists, knees, elbows, natural weapons']
              ]
            }
          ]
        }
      },
      {
        id: 'armor',
        name: 'Armor',
        icon: 'fas fa-vest',
        content: {
          title: 'Armor',
          description: 'Total Armor drives passive DR and the Defend soak die',
          sections: [
            {
              title: 'How Armor Works Now',
              content: `Armor is no longer a separate skill and no longer uses per-piece reduction dice. Your total Armor sets two things:

• Passive Damage Reduction: Reduce every incoming hit by Armor ÷ 10 (rounded down).
• Defend Soak Die: When you take the Defend action, roll the soak die from the table below and reduce damage by the roll.`
            },
            {
              title: 'Read This Page',
              content: `1) Use the Soak Die Scale to find the die you roll when you Defend.
2) Use Armor Benchmarks to quickly see your passive DR (Armor ÷ 10).
3) Armor Types are just a reference for armor bonuses and cost—the bonus feeds your total Armor.`
            },
          ],
          tables: [
            {
              title: 'Soak Die Scale (Defend)',
              layout: 'armor-grid',
              headers: ['Armor', 'Soak Die'],
              rows: [
                ['0–4', '—'],
                ['5–9', '1d4'],
                ['10–14', '1d6'],
                ['15–19', '1d8'],
                ['20–24', '1d10'],
                ['25–29', '1d12'],
                ['30–34', '1d12 + 1d4'],
                ['35–39', '1d12 + 1d6'],
                ['40–44', '2d12'],
                ['45–49', '2d12 + 1d4']
              ]
            },
            {
              title: 'Armor Benchmarks',
              layout: 'armor-grid',
              headers: ['Armor', 'Passive DR (Armor ÷ 10)'],
              rows: [
                ['0–9', '0'],
                ['10–19', '1'],
                ['20–29', '2'],
                ['30–39', '3'],
                ['40–49', '4'],
                ['50–59', '5'],
                ['60–69', '6'],
                ['70–79', '7']
              ]
            },
            {
              title: 'Armor Types (Reference)',
              layout: 'armor-grid',
              headers: ['Armor', 'Armor Bonus', 'Notes', 'Cost'],
              rows: [
                ['Cloth', 'Varies by item', 'Light; best for casters and mobility', 'See item library'],
                ['Leather', 'Varies by item', 'Light/medium; balanced defense and stealth', 'See item library'],
                ['Mail', 'Varies by item', 'Heavy; solid protection, some noise/weight', 'See item library'],
                ['Plate', 'Varies by item', 'Heavy; highest protection, hefty weight', 'See item library']
              ]
            }
          ]
        }
      },
      {
        id: 'magical-items',
        name: 'Magical Items',
        icon: 'fas fa-wand-sparkles',
        content: {
          title: 'Magical Items',
          description: 'Rarity tiers, attunement rules, categories',
          sections: [
            {
              title: 'Rarity Tiers',
              content: `Magical items come in six rarity tiers: Common, Uncommon, Rare, Epic, Legendary, and Artifact. Higher rarity items are more powerful but also more expensive and harder to find.`
            },
            {
              title: 'Attunement',
              content: `Some powerful items require attunement. You can attune to up to 3 items at once. Attunement requires a short rest spent focusing on the item.`
            }
          ]
        }
      }
    ]
  },
  {
    id: 'magic-system',
    name: 'Magic System',
    icon: 'fas fa-wand-magic',
    description: 'Talent-based magic with diverse resource systems',
    subcategories: [
      {
        id: 'magic-overview',
        name: 'System Overview',
        icon: 'fas fa-book-sparkles',
        content: {
          title: 'Magic System Overview',
          description: 'Talent trees instead of spell levels',
          sections: [
            {
              title: 'Talent-Based Magic',
              content: `Unlike traditional spell slot systems, this game uses talent trees. You invest talent points to unlock new spells and abilities. This allows for greater customization and specialization.`
            },
            {
              title: 'Spell Schools',
              content: `Each class has access to specific spell schools based on their theme. For example, Pyromancers focus on fire magic, while Chronomancers manipulate time.`
            },
            {
              title: 'Universal Spells',
              content: `All spellcasters have access to a 'General' tab with universal baseline spells like Detect Magic, Dispel Magic, and Counterspell.`
            }
          ]
        }
      },
      {
        id: 'magic-resources',
        name: 'Resources',
        icon: 'fas fa-droplet',
        content: {
          title: 'Magic Resources',
          description: 'Action economy and class-specific resource systems used across all 28 classes',
          tables: [
            {
              title: 'Core Resources',
              description: 'Universal resources available to all characters, forming the foundation of action economy and survival.',
              layout: 'armor-grid',
              headers: ['Resource', 'Used By', 'Regeneration / Notes'],
              rows: [
                ['Action Points', 'Everyone', 'Refills each turn (core action economy)'],
                ['Mana', 'Most casters', 'Slow in combat; full on long rest'],
                ['Health', 'Everyone', 'Heals via rests, potions, abilities']
              ]
            },
            {
              title: 'Class Resource Systems',
              description: 'Each of the 28 classes uses unique resource mechanics that define their playstyle and tactical options.',
              layout: 'armor-grid',
              headers: ['Resource', 'Used By', 'How It Works'],
              rows: [
                ['Sphere Generation & Combination', 'Arcanoneer', 'Generate elemental spheres; combine for powerful effects'],
                ['Rage Points', 'Berserker', 'Builds on hits/being hit; decays out of combat'],
                ['Edge & Flourish', 'Bladedancer', 'Momentum builds through combat flow; Flourish tokens earned from perfect execution'],
                ['Mayhem Modifiers', 'Chaos Weaver', 'Generate chaos spheres; spend to twist spells unpredictably'],
                ['Temporal Energy', 'Chronarch', 'Time Shards from casting; Temporal Strain from time manipulation (risk of backlash)'],
                ['Anti-Magic Seals', 'Covenbane', 'Place seals to disrupt magic; seals persist and can be detonated'],
                ['Necrotic Ascension', 'Deathcaller', 'Health as spell fuel; Blood Tokens from sacrifice (explode if unused)'],
                ['Siege Mode', 'Dreadnaught', 'Enter defensive mode; build fortification points for powerful abilities'],
                ['Divine Favor', 'Exorcist', 'Earn favor through holy actions; spend on banishing and protective abilities'],
                ['Deception', 'False Prophet', 'Build deception through lies; spend to corrupt and manipulate'],
                ['Threads of Destiny', 'Fate Weaver', 'Generate threads from failures; weave fate to turn luck around'],
                ['Wild Instinct', 'Formbender', 'Generate through form-specific actions; spend to transform or use primal abilities'],
                ['Fortune Points', 'Gambler', 'Earn through risky actions; spend to manipulate probability and luck'],
                ['Quarry Marks', 'Huntress', 'Mark targets; build focus through precision attacks'],
                ['Runic Wrapping & Inscriptions', 'Inscriptor', 'Place runes on battlefield; inscribe equipment for persistent buffs'],
                ['Eternal Frost Aura & Phylactery', 'Lichborne', 'Build frost aura through cold damage; phylactery enables resurrection'],
                ['Lunar Charge', 'Lunarch', 'Build charge through lunar phases; spend on powerful moon-based abilities'],
                ['Pain Points', 'Martyr', 'Earn by taking damage; spend on self-sacrificing powerful abilities'],
                ['Harmonic Notes', 'Minstrel', 'Generate notes through performance; combine notes for musical spell effects'],
                ['Prophetic Vision', 'Oracle', 'Build vision through divination; spend to see future and alter fate'],
                ['Affliction Cultivation', 'Plaguebringer', 'Cultivate diseases on targets; evolve afflictions through spell combinations'],
                ['Totemic Synergy', 'Primalist', 'Place totems; build synergy when multiple totems are active'],
                ['Inferno Veil', 'Pyrofiend', 'Ascend/descend fire stages; higher stages unlock more powerful fire abilities'],
                ['Ward Layers', 'Spellguard', 'Build protective ward layers; spend layers for defensive and offensive abilities'],
                ['Strain Overload', 'Titan', 'Build strain through gravity manipulation; overload for massive area effects'],
                ['Alchemical Vials', 'Toxicologist', 'Toxin Vials for poisons/concoctions; Contraption Parts for battlefield devices'],
                ['Vengeance Points', 'Warden', 'Build vengeance when allies take damage; spend on protective and retaliatory abilities'],
                ['Voodoo Essence & Loa Invocation', 'Witch Doctor', 'Build essence through curses; invoke powerful Loa spirits']
              ]
            }
          ]
        }
      },
      {
        id: 'spellcasting',
        name: 'Spellcasting',
        icon: 'fas fa-hand-sparkles',
        content: {
          title: 'Spellcasting',
          description: 'Casting process, components, and disruption',
          sections: [
            {
              title: 'Casting a Spell',
              content: `To cast a spell: 1) Declare the spell and target, 2) Spend the required AP and resources, 3) Make any required spell attack rolls or have targets make saving throws, 4) Resolve the spell's effects.`
            },
            {
              title: 'Spell Components',
              content: `Spells may require Verbal (speaking), Somatic (gestures), or Material (physical components) components. You must have free hands for somatic components and access to materials for material components.`
            },
            {
              title: 'Concentration',
              content: `Some spells require concentration. You can only concentrate on one spell at a time. When you take damage, make a Constitution save using a challenging die (d10); if the damage is severe, the GM can step the die up (to d12 or d20) to reflect the hit. Succeed to hold the spell; fail and concentration ends.`
            }
          ]
        }
      },
      {
        id: 'talents',
        name: 'Talents',
        icon: 'fas fa-tree',
        content: {
          title: 'Talents',
          description: 'Ability types, synergies, and tier progression',
          sections: [
            {
              title: 'Talent Trees',
              content: `Talent trees are organized into 7 tiers. Higher tiers require more character levels and previous tier investments. Trees show visual dependency chains with connecting lines.`
            },
            {
              title: 'Talent Points',
              content: `You gain 1 talent point per level. Spend these points to unlock new abilities or improve existing ones. Some talents have multiple ranks for increased power.`
            },
            {
              title: 'Synergies',
              content: `Many talents synergize with each other. For example, a talent that increases fire damage will boost all your fire spells. Plan your build carefully!`
            }
          ]
        }
      }
    ]
  },
  {
    id: 'social-mechanics',
    name: 'Social Mechanics',
    icon: 'fas fa-comments',
    description: 'Non-combat interactions and reputation systems',
    subcategories: [
      {
        id: 'social-basics',
        name: 'Social Basics',
        icon: 'fas fa-handshake',
        content: {
          title: 'Social Mechanics Basics',
          description: 'Comprehensive social interaction and influence systems',
          tabs: [
            {
              id: 'social-skills',
              name: 'Social Skills',
              sections: [
                {
                  title: 'Core Social Skills',
                  content: `Social interactions rely on five key skills, each serving different purposes in conversation and negotiation.`
                }
              ],
              tables: [
                {
                  title: 'Social Skills',
                  description: 'Five essential skills for navigating conversations, negotiations, and social encounters. Each skill has its purpose and can be countered by opposing skills.',
                  headers: ['Skill', 'Use', 'Example', 'Opposed By'],
                  rows: [
                    ['Persuasion', 'Convince through logic/emotion', 'Negotiate price, gain favor', 'Insight, Spirit'],
                    ['Deception', 'Mislead or lie', 'Bluff, disguise motives', 'Insight, Investigation'],
                    ['Intimidation', 'Threaten or coerce', 'Extract information, force compliance', 'Courage, Spirit'],
                    ['Insight', 'Read intentions/emotions', 'Detect lies, gauge mood', 'Deception, Performance'],
                    ['Performance', 'Entertain or distract', 'Tell stories, create diversion', 'Insight, Perception']
                  ]
                }
              ]
            },
            {
              id: 'npc-attitudes',
              name: 'NPC Attitudes',
              sections: [
                {
                  title: 'Disposition System',
                  content: `NPCs have attitudes toward characters that affect social interaction difficulty. Attitudes can change based on actions, reputation, and successful social encounters.`
                }
              ],
              tables: [
                {
                  title: 'NPC Attitudes',
                  description: 'How NPCs feel toward the party affects every social interaction. Attitudes shift based on actions, reputation, and the outcomes of social encounters.',
                  headers: ['Attitude', 'Description', 'Difficulty Shift', 'Behavior'],
                  rows: [
                    ['Hostile', 'Actively opposes party', '+2 die steps harder', 'Attacks, refuses aid, spreads rumors'],
                    ['Unfriendly', 'Dislikes party', '+1 die step harder', 'Unhelpful, suspicious, demands payment'],
                    ['Indifferent', 'No strong feelings', 'No change', 'Normal interactions, fair treatment'],
                    ['Friendly', 'Likes party', '-1 die step easier', 'Helpful, gives advice, small favors'],
                    ['Helpful', 'Strongly supports party', '-2 die steps easier', 'Goes out of way to assist, shares secrets']
                  ]
                }
              ]
            },
            {
              id: 'social-encounters',
              name: 'Social Encounters',
              sections: [
                {
                  title: 'Structured Social Encounters',
                  content: `Complex social situations can be run like combat encounters, with initiative, actions, and clear objectives. This is useful for negotiations, debates, or social competitions.`
                }
              ],
              tables: [
                {
                  title: 'Social Actions',
                  description: 'Actions available during structured social encounters. Each action has potential rewards and risks—choose wisely, for words have consequences.',
                  headers: ['Action', 'Skill', 'Effect', 'Risk'],
                  rows: [
                    ['Persuade', 'Persuasion', 'Improve attitude, gain favor', 'May seem pushy if failed'],
                    ['Deceive', 'Deception', 'Mislead target, hide truth', 'Hostile if discovered'],
                    ['Intimidate', 'Intimidation', 'Force compliance, extract info', 'May become enemy'],
                    ['Read Motives', 'Insight', 'Learn NPC goals, detect lies', 'Low risk'],
                    ['Entertain', 'Performance', 'Distract, improve mood', 'Embarrassment if failed'],
                    ['Gather Info', 'Investigation', 'Learn about topic/person', 'May alert targets'],
                    ['Make Impression', 'Charisma', 'Establish reputation', 'First impressions matter'],
                    ['Call in Favor', 'Special', 'Use existing relationship', 'Burns relationship']
                  ]
                }
              ]
            },
            {
              id: 'influence',
              name: 'Influence',
              sections: [
                {
                  title: 'Influence Points',
                  content: `For complex social encounters, track influence points. Characters gain influence through successful social actions. Reaching certain thresholds achieves objectives.`
                }
              ],
              tables: [
                {
                  title: 'Influence Thresholds',
                  description: 'The currency of social power. Build influence through successful interactions to unlock favors, information, and access.',
                  headers: ['Objective', 'Influence Required', 'Example'],
                  rows: [
                    ['Minor Favor', '3 points', 'Get directions, small discount'],
                    ['Moderate Favor', '6 points', 'Borrow equipment, gain introduction'],
                    ['Major Favor', '10 points', 'Significant help, risk reputation'],
                    ['Life-Changing', '15 points', 'Change allegiance, major sacrifice'],
                    ['Information', '2-8 points', 'Varies by sensitivity of information'],
                    ['Access', '4-12 points', 'Entry to restricted areas/groups'],
                    ['Protection', '8-15 points', 'Shelter from enemies/law'],
                    ['Resources', '5-20 points', 'Money, equipment, troops']
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        id: 'reputation',
        name: 'Reputation',
        icon: 'fas fa-star',
        content: {
          title: 'Reputation',
          description: 'Faction standing from -5 (Hated) to +5 (Revered)',
          tables: [
            {
              title: 'Reputation Levels',
              description: 'Your standing with factions shapes how the world treats you. Reputation ranges from hated enemy to revered ally, with tangible effects on services and opportunities.',
              headers: ['Level', 'Standing', 'Effects'],
              rows: [
                ['-5', 'Hated', 'Attacked on sight, no services available'],
                ['-3', 'Hostile', 'Refused service, prices doubled if available'],
                ['-1', 'Unfriendly', 'Poor service, prices increased 25%'],
                ['0', 'Neutral', 'Standard service and prices'],
                ['+1', 'Friendly', 'Good service, 10% discount'],
                ['+3', 'Honored', 'Excellent service, 25% discount, special quests'],
                ['+5', 'Revered', 'Best service, 50% discount, unique rewards']
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 'travel-exploration',
    name: 'Travel & Exploration',
    icon: 'fas fa-map',
    description: 'Journey mechanics and exploration framework',
    subcategories: [
      {
        id: 'travel-basics',
        name: 'Travel Basics',
        icon: 'fas fa-route',
        content: {
          title: 'Travel Basics',
          description: 'Comprehensive travel mechanics, navigation, and journey structure',
          tabs: [
            {
              id: 'travel-pace',
              name: 'Travel Pace',
              sections: [],
              tables: [
                {
                  title: 'Travel Pace',
                  description: 'Pick a pace; it sets distance, stealth, and awareness tradeoffs.',
                  headers: ['Pace', 'Distance/Hour', 'Distance/Day', 'Effect'],
                  rows: [
                    ['Slow', '2 miles', '18 miles', 'Can use Stealth, +5 to Perception'],
                    ['Normal', '3 miles', '24 miles', 'No modifiers'],
                    ['Fast', '4 miles', '30 miles', '-5 to Perception, cannot use Stealth'],
                    ['Forced March', '5 miles', '40 miles', 'Constitution save each hour or gain exhaustion']
                  ]
                },
                {
                  title: 'Terrain Modifiers',
                  description: 'Apply terrain speed modifier and use the listed navigation die.',
                  headers: ['Terrain Type', 'Speed Modifier', 'Navigation Die', 'Special'],
                  rows: [
                    ['Road/Path', 'Normal', 'No check', 'Safe travel'],
                    ['Open Plains', 'Normal', 'Easy die (d6)', 'Easy to get lost without landmarks'],
                    ['Forest', '×0.5', 'Challenging die (d10)', 'Limited visibility, foraging opportunities'],
                    ['Hills', '×0.75', 'Moderate die (d8)', 'Elevated view, moderate difficulty'],
                    ['Mountains', '×0.5', 'Difficult die (d12)', 'Altitude effects, avalanche risk'],
                    ['Swamp', '×0.25', 'Difficult die (d12); step to d20 in storms', 'Disease risk, difficult navigation'],
                    ['Desert', '×0.75', 'Challenging die (d10)', 'Water scarcity, extreme temperatures'],
                    ['Arctic', '×0.5', 'Difficult die (d12)', 'Extreme cold, blizzard risk']
                  ]
                }
              ]
            },
            {
              id: 'navigation',
              name: 'Navigation',
              sections: [],
              tables: [
                {
                  title: 'Lost Consequences',
                  description: 'If navigation checks fail, apply these effects until the party recovers.',
                  headers: ['Severity', 'Effect', 'Recovery Check'],
                  rows: [
                    ['Slightly Lost', 'Travel time increased by 25%', 'Survival vs challenging die (d10)'],
                    ['Lost', 'Travel time increased by 50%, extra encounter', 'Survival vs difficult die (d12)'],
                    ['Hopelessly Lost', 'Travel time doubled, 2 extra encounters', 'Survival vs difficult die (d12); step to d20 in severe terrain or until a landmark is found']
                  ]
                }
              ]
            },
            {
              id: 'encounters',
              name: 'Encounters',
              sections: [
                {
                  title: 'Random Encounters',
                  content: `The GM rolls for encounters based on terrain, time of day, and party activities. Not all encounters are combat—many are opportunities for roleplay, discovery, or resource management.`
                }
              ],
              tables: [
                {
                  title: 'Encounter Frequency',
                  headers: ['Activity', 'Check Frequency', 'Encounter Chance'],
                  rows: [
                    ['Normal Travel', 'Every 4 hours', '1-2 on d6'],
                    ['Slow/Stealthy Travel', 'Every 6 hours', '1 on d6'],
                    ['Fast Travel', 'Every 3 hours', '1-3 on d6'],
                    ['Camping/Resting', 'Once per rest', '1 on d8'],
                    ['Lost', 'Every 2 hours', '1-3 on d6']
                  ]
                }
              ]
            },
            {
              id: 'travel-challenges',
              name: 'Travel Challenges',
              sections: [],
              tables: [
                {
                  title: 'Challenge Severity',
                  description: 'Set successes required and the difficulty die based on severity.',
                  headers: ['Severity', 'Successes Required', 'Difficulty Die'],
                  rows: [
                    ['Effortless', '1', 'd4'],
                    ['Very Easy', '2', 'd4–d6'],
                    ['Easy', '3', 'd6'],
                    ['Medium', '4', 'd8'],
                    ['Hard', '5', 'd10'],
                    ['Very Hard', '6', 'd12'],
                    ['Extreme', '6+', 'd20']
                  ]
                },
                {
                  title: 'Example Travel Challenges (Roll d20)',
                  description: 'Roll to pick a challenge; severity suggests the difficulty die.',
                  headers: ['Roll', 'Challenge', 'Severity', 'Suggested Skills'],
                  rows: [
                    ['1', 'Catastrophic storm', 'Extreme', 'Survival, Athletics, Nature'],
                    ['2-3', 'Hostile faction encounter', 'Very Hard', 'Persuasion, Stealth, Insight'],
                    ['4-5', 'Landslide blocks path', 'Hard', 'Athletics, Perception, Survival'],
                    ['6-8', 'River crossing', 'Medium', 'Athletics, Nature, Survival'],
                    ['9-12', 'Finding shelter', 'Easy', 'Survival, Perception, Nature'],
                    ['13-16', 'Foraging for food', 'Easy', 'Survival, Nature, Medicine'],
                    ['17-19', 'Clear weather day', 'Very Easy', 'Any skill'],
                    ['20', 'Perfect travel conditions', 'Effortless', 'Any skill']
                  ]
                }
              ]
            },
            {
              id: 'survival',
              name: 'Survival',
              sections: [],
              tables: [
                {
                  title: 'Weather Effects',
                  description: 'Apply these impacts; proper gear can mitigate saves or penalties.',
                  headers: ['Weather', 'Effect', 'Protection'],
                  rows: [
                    ['Clear', 'No effect', 'None needed'],
                    ['Light Rain', 'Disadvantage on Perception (sight)', 'None'],
                    ['Heavy Rain', 'Disadvantage on Perception, speed ×0.75', 'Waterproof gear'],
                    ['Snow', 'Speed ×0.5, tracks easily visible', 'Winter clothing'],
                    ['Blizzard', 'Speed ×0.25, Constitution save or exhaustion', 'Shelter required'],
                    ['Extreme Heat', 'Constitution save every hour or exhaustion', 'Shade, extra water'],
                    ['Extreme Cold', 'Constitution save every hour or exhaustion', 'Warm clothing, fire']
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        id: 'exploration',
        name: 'Exploration',
        icon: 'fas fa-compass',
        content: {
          title: 'Exploration',
          description: 'Comprehensive exploration mechanics and discovery systems',
          tabs: [
            {
              id: 'exploration-basics',
              name: 'Exploration Basics',
              sections: [
                {
                  title: 'Exploration Framework',
                  content: `When exploring, the GM describes the scene using the 6-question model: What do you see? What do you hear? What do you smell? What's the atmosphere? What's unusual? What can you interact with?`
                }
              ],
              tables: [
                {
                  title: 'Exploration Pace',
                  description: 'Pick a pace; it sets distance, stealth, and awareness tradeoffs.',
                  headers: ['Pace', 'Distance/Turn', 'Distance/Hour', 'Distance/Day', 'Effect'],
                  rows: [
                    ['Slow', '200 feet', '1,200 feet', '2 miles', 'Can use Stealth, +5 to Perception'],
                    ['Normal', '300 feet', '1,800 feet', '3 miles', 'No modifiers'],
                    ['Fast', '400 feet', '2,400 feet', '4 miles', '-5 to Perception, cannot use Stealth']
                  ]
                },
                {
                  title: 'Exploration Activities',
                  description: 'Players can perform various activities while exploring. Each activity takes time and may require skill checks. Some activities can be performed simultaneously, while others require full attention.',
                  headers: ['Activity', 'Time', 'Skill Check (Difficulty Die)', 'Effect'],
                  rows: [
                    ['Search Area', '10 minutes', 'Investigation vs challenging die (d10)', 'Find hidden objects, secret doors'],
                    ['Listen Carefully', '1 minute', 'Perception vs moderate die (d8)', 'Detect sounds, movement'],
                    ['Examine Object', '1 minute', 'Investigation vs easy die (d6)', 'Learn object properties, history'],
                    ['Track Creatures', '1 minute', 'Survival vs challenging die (d10)', 'Follow creature tracks'],
                    ['Identify Plants/Animals', '1 minute', 'Nature vs moderate die (d8)', 'Determine if safe, useful'],
                    ['Detect Magic', '1 action', 'Arcana vs challenging die (d10)', 'Sense magical auras'],
                    ['Map Area', '10 minutes', 'Cartographer tools vs moderate die (d8)', 'Create accurate map'],
                    ['Forage', '1 hour', 'Survival vs challenging die (d10)', 'Find food, water, materials']
                  ]
                }
              ]
            },
            {
              id: 'discovery',
              name: 'Discovery',
              sections: [
                {
                  title: 'Hidden Elements',
                  content: `The world is full of secrets waiting to be discovered. Hidden doors, treasure caches, ancient ruins, and mysterious phenomena reward thorough exploration.`
                }
              ],
              tables: [
                {
                  title: 'Discovery Types',
                  description: 'Various types of discoveries players can find during exploration, along with detection methods and typical rewards.',
                  headers: ['Discovery', 'Detection Method', 'Typical Difficulty Die', 'Reward'],
                  rows: [
                    ['Secret Door', 'Investigation', 'd10–d12', 'Access to hidden areas'],
                    ['Hidden Treasure', 'Perception/Investigation', 'd8–d12', 'Gold, gems, items'],
                    ['Ancient Runes', 'Arcana/History', 'd10–d20', 'Lore, spell knowledge'],
                    ['Natural Resources', 'Nature/Survival', 'd6–d10', 'Crafting materials'],
                    ['Trap', 'Perception', 'd8–d12 (step to d20 for deadly traps)', 'Avoid danger'],
                    ['Clues', 'Investigation', 'd6–d12', 'Story information'],
                    ['Shortcut', 'Survival', 'd10', 'Faster travel route'],
                    ['Safe Haven', 'Survival', 'd8', 'Secure rest location']
                  ]
                }
              ]
            },
            {
              id: 'hazards',
              name: 'Hazards',
              sections: [
                {
                  title: 'Environmental Dangers',
                  content: `Not all threats come from monsters. Environmental hazards can be just as deadly and often require creative solutions rather than combat prowess.`
                }
              ],
              tables: [
                {
                  title: 'Common Hazards',
                  description: 'Various environmental and constructed hazards that can be encountered during exploration, with detection methods and ways to avoid or disarm them.',
                  headers: ['Hazard', 'Detection Difficulty', 'Effect', 'Disarm/Avoid'],
                  rows: [
                    ['Pit Trap', 'Perception vs challenging die (d10)', '2d6 falling damage', 'Thieves\' tools vs challenging die (d10)'],
                    ['Poison Dart', 'Perception vs difficult die (d12)', '1d4 piercing + poison', 'Thieves\' tools vs difficult die (d12)'],
                    ['Unstable Floor', 'Investigation vs moderate die (d8)', 'Collapse, 3d6 damage', 'Move carefully'],
                    ['Toxic Gas', 'Perception vs challenging die (d10)', 'Constitution save or poisoned', 'Hold breath, ventilate'],
                    ['Magical Ward', 'Arcana vs challenging/difficult die (d10–d12)', 'Spell effect triggers', 'Dispel magic'],
                    ['Quicksand', 'Survival vs moderate/challenging die (d8–d10)', 'Restrained, sinking', 'Rope, careful movement'],
                    ['Rockslide', 'Perception vs challenging die (d10)', '4d6 bludgeoning', 'Agility save vs challenging die (d10) to dodge'],
                    ['Cursed Object', 'Arcana vs difficult die (d12)', 'Curse effect', 'Remove curse spell']
                  ]
                }
              ]
            },
            {
              id: 'point-click-framework',
              name: 'Point & Click Framework',
              sections: [
                {
                  title: 'GM Tool for Scene Design',
                  content: `The Point and Click Model provides a structured approach for Game Masters to create rich, interactive environments for players to explore. Use this checklist when designing exploration areas.`
                },
                {
                  title: 'Implementation Tips',
                  type: 'rotating-tips',
                  tips: [
                    { label: 'Prepare in Advance', description: 'Create a quick checklist for each area using the framework below' },
                    { label: 'Start Broad, Then Narrow', description: 'Begin with general atmosphere, then focus on specific details' },
                    { label: 'Reward Thorough Exploration', description: 'Place meaningful discoveries for players who investigate thoroughly' },
                    { label: 'Adapt to Player Interest', description: 'Expand on areas where players show curiosity' },
                    { label: 'Connect to Story', description: 'Ensure discoveries contribute to the overall narrative' },
                    { label: 'Use All Senses', description: 'Include details beyond just visual descriptions to create immersion' }
                  ]
                }
              ],
              tables: [
                {
                  title: 'Point & Click Scene Framework',
                  description: 'A structured checklist for GMs to design interactive exploration scenes with all necessary elements.',
                  headers: ['Question', 'Purpose', 'Example'],
                  rows: [
                    ['Setting & Atmosphere', 'Initial scene description', '"A gloomy Gothic study, walls lined with ancient books, air thick with mold and dust"'],
                    ['Sensory Details', 'Immersive details beyond sight', '"Old parchment scent, hint of pipe smoke, cold breeze, distant clock ticking"'],
                    ['Dynamic Elements', 'Movement and life in the scene', '"Curtains flutter aggressively, suggesting sudden gusts or something sinister"'],
                    ['Key Features', 'Landmarks players can interact with', '"Open window, cluttered oak desk, glass-panel bookshelf, ornate chandelier"'],
                    ['Hidden Elements', 'Secrets requiring investigation', '"Desk drawer seems stuck but has false bottom hiding ancient key"'],
                    ['Environmental Secrets', 'Clues integrated into setting', '"Dust pattern on bookshelf suggests books are frequently moved"'],
                    ['Triggered Encounters', 'Events based on player actions', '"Correct books open secret door; wrong ones trigger harmless trap"']
                  ]
                },
                {
                  title: 'Quick Scene Examples',
                  description: 'Example environments with key features and hidden elements to inspire scene design.',
                  headers: ['Environment', 'Key Features', 'Hidden Elements'],
                  rows: [
                    ['Ancient Temple', 'Central altar, ceremonial basin, hieroglyphic walls', 'Hidden pressure plates, secret passages'],
                    ['Merchant\'s Shop', 'Display cases, hanging tapestries, artifact collection', 'Secret ledger, disguised magic items'],
                    ['Forest Clearing', 'Stone circle, unusual flowers, animal tracks', 'Druidic symbols, hollow tree treasure'],
                    ['Abandoned Mine', 'Cart tracks, support beams, ore deposits', 'Clearable passages, hidden geode caverns']
                  ]
                }
              ]
            },
            {
              id: 'dungeon-exploration',
              name: 'Dungeon Exploration',
              sections: [
                {
                  title: 'Dungeon Procedures',
                  content: `Dungeons require systematic exploration. Parties should establish marching order, light sources, mapping responsibilities, and communication signals before entering.`
                }
              ],
              tables: [
                {
                  title: 'Dungeon Exploration Checklist',
                  description: 'A systematic approach to dungeon exploration to help parties stay organized and safe.',
                  headers: ['Step', 'Action', 'Considerations'],
                  rows: [
                    ['1', 'Establish marching order', 'Who leads, who guards rear, who carries light'],
                    ['2', 'Check for traps', 'Doors, floors, treasure chests'],
                    ['3', 'Listen at doors', 'Detect creatures or activity beyond'],
                    ['4', 'Map progress', 'Track rooms explored, note important features'],
                    ['5', 'Manage resources', 'Light sources, spell slots, hit points'],
                    ['6', 'Search thoroughly', 'Don\'t rush, check for secrets'],
                    ['7', 'Plan retreat route', 'Know how to escape if needed'],
                    ['8', 'Rest strategically', 'Find secure locations for short rests']
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        id: 'environments',
        name: 'Environments',
        icon: 'fas fa-mountain',
        content: {
          title: 'Environments',
          description: 'Terrain types, hazards, and weather effects',
          tables: [
            {
              title: 'Environmental Hazards',
              headers: ['Hazard', 'Effect'],
              rows: [
                ['Extreme Cold', 'CON save every hour or gain exhaustion'],
                ['Extreme Heat', 'CON save every hour or gain exhaustion'],
                ['Heavy Rain', 'Disadvantage on Perception (sight/hearing), ranged attacks'],
                ['Strong Wind', 'Disadvantage on ranged attacks, flying difficult'],
                ['Darkness', 'Heavily obscured, disadvantage on sight-based checks'],
                ['Difficult Terrain', 'Movement costs double']
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 'professions-advancement',
    name: 'Professions & Advancement',
    icon: 'fas fa-level-up',
    description: 'Character progression and crafting systems',
    subcategories: [
      {
        id: 'professions',
        name: 'Professions',
        icon: 'fas fa-hammer',
        content: {
          title: 'Professions',
          description: 'Crafting and gathering skills with mastery levels',
          sections: [
            {
              title: 'Profession System',
              content: `Professions allow you to craft items, gather resources, or provide services. Each profession has mastery levels from Novice to Grandmaster.`
            },
            {
              title: 'Crafting',
              content: `To craft an item, you need the recipe, materials, tools, and sufficient profession skill. Make a crafting check using a difficulty die set by the item rarity (common d8, uncommon d10, rare d12, very rare d20). Success creates the item; failure wastes some materials.`
            }
          ]
        }
      },
      {
        id: 'experience',
        name: 'Experience',
        icon: 'fas fa-trophy',
        content: {
          title: 'Experience & Leveling',
          description: 'XP sources and leveling requirements',
          sections: [
            {
              title: 'Gaining Experience',
              content: `You gain XP from defeating enemies, completing quests, overcoming challenges, and good roleplay. The GM awards XP at the end of each session.`
            },
            {
              title: 'Leveling Up',
              content: `When you gain enough XP, you level up. Leveling grants: +1 talent point, increased HP (1d8 + CON modifier), and at certain levels, attribute improvements or special features.`
            }
          ],
          tables: [
            {
              title: 'XP Requirements',
              headers: ['Level', 'XP Required', 'Total XP'],
              rows: [
                ['1', '0', '0'],
                ['2', '300', '300'],
                ['3', '600', '900'],
                ['4', '1,800', '2,700'],
                ['5', '3,800', '6,500'],
                ['6', '7,500', '14,000'],
                ['7', '9,000', '23,000'],
                ['8', '11,000', '34,000'],
                ['9', '14,000', '48,000'],
                ['10', '16,000', '64,000']
              ]
            }
          ]
        }
      },
      {
        id: 'attributes-advancement',
        name: 'Attribute Improvements',
        icon: 'fas fa-arrow-up',
        content: {
          title: 'Attribute Improvements',
          description: 'Improvement schedule and strategic choices',
          sections: [
            {
              title: 'Attribute Score Increases',
              content: `At levels 4, 8, 12, 16, and 20, you can increase one attribute by 2 points or two attributes by 1 point each. Alternatively, you can take a feat instead.`
            },
            {
              title: 'Strategic Planning',
              content: `Plan your attribute increases carefully. Reaching even-numbered scores grants better modifiers. Consider your class, playstyle, and multiclassing plans.`
            }
          ]
        }
      },
      {
        id: 'milestones',
        name: 'Milestones',
        icon: 'fas fa-flag-checkered',
        content: {
          title: 'Milestones',
          description: 'Special achievements with unique rewards',
          sections: [
            {
              title: 'Milestone System',
              content: `Milestones are special achievements beyond normal leveling. Examples include: defeating a legendary creature, completing a major story arc, or mastering a profession.`
            },
            {
              title: 'Milestone Rewards',
              content: `Milestone rewards include unique abilities, titles, special items, or permanent bonuses that aren't available through normal advancement.`
            }
          ]
        }
      }
    ]
  }
];

// Helper function to get all subcategories flattened
export const getAllSubcategories = () => {
  return RULES_CATEGORIES.flatMap(category =>
    category.subcategories.map(sub => ({
      ...sub,
      categoryId: category.id,
      categoryName: category.name
    }))
  );
};

// Helper function to find content by IDs
export const getRuleContent = (categoryId, subcategoryId) => {
  const category = RULES_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return null;

  const subcategory = category.subcategories.find(s => s.id === subcategoryId);
  return subcategory?.content || null;
};

