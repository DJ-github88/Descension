/**
 * Step 3: Class Selection
 *
 * Class selection step with layout matching the race selection
 */

import React, { useState, useRef, useEffect } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { getEquipmentPreview, STARTING_EQUIPMENT_LIBRARY } from '../../../data/startingEquipmentData';
import { getIconUrl } from '../../../utils/assetManager';
import ItemTooltip from '../../item-generation/ItemTooltip';

const Step3ClassSelection = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const [selectedClass, setSelectedClass] = useState(state.characterData.class);
    const [hoveredClass, setHoveredClass] = useState(null);
    const [tooltip, setTooltip] = useState({ show: false, item: null, x: 0, y: 0 });
    const tooltipRef = useRef(null);

    const { validationErrors } = state;

    // All 27 character classes as flat list (corrected from CharacterCreation.jsx)
    const characterClasses = [
        // Infernal Path
        { name: 'Pyrofiend', icon: 'fas fa-fire', description: 'Demonic fire wielder with ascending corruption stages', theme: 'fire' },
        { name: 'Minstrel', icon: 'fas fa-music', description: 'Musical spellcaster combining notes into powerful chords', theme: 'music' },
        { name: 'Chronarch', icon: 'fas fa-clock', description: 'Time manipulator building temporal energy', theme: 'time' },
        { name: 'Chaos Weaver', icon: 'fas fa-dice', description: 'Reality bender using chaos dice and entropy', theme: 'chaos' },
        { name: 'Fate Weaver', icon: 'fas fa-cards', description: 'Destiny manipulator using cards and threads of fate', theme: 'fate' },
        { name: 'Gambler', icon: 'fas fa-coins', description: 'Fate manipulator balancing luck and risk', theme: 'luck' },

        // Zealot Path
        { name: 'Martyr', icon: 'fas fa-plus', description: 'Self-sacrificing warrior earning power through pain', theme: 'sacrifice' },
        { name: 'False Prophet', icon: 'fas fa-eye-slash', description: 'Deceptive preacher spreading lies and corruption', theme: 'deception' },
        { name: 'Exorcist', icon: 'fas fa-hand-sparkles', description: 'Holy warrior banishing evil spirits', theme: 'holy' },
        { name: 'Oracle', icon: 'fas fa-eye', description: 'Seer with prophetic visions and fate manipulation', theme: 'divination' },

        // Harrow Path
        { name: 'Plaguebringer', icon: 'fas fa-skull', description: 'Disease spreader with contagious plague stacks', theme: 'disease' },
        { name: 'Lichborne', icon: 'fas fa-skull-crossbones', description: 'Undead spellcaster with phylactery power', theme: 'undead' },
        { name: 'Deathcaller', icon: 'fas fa-ghost', description: 'Necromancer harvesting souls for dark magic', theme: 'necromancy' },

        // Arcanist Path
        { name: 'Spellguard', icon: 'fas fa-shield-alt', description: 'Protective mage with magical ward layers', theme: 'protection' },
        { name: 'Inscriptor', icon: 'fas fa-scroll', description: 'Runic scholar creating magical glyph circuits', theme: 'runes' },
        { name: 'Arcanoneer', icon: 'fas fa-wand-magic-sparkles', description: 'Elemental cannon wielder with volatility risk', theme: 'elemental' },

        // Hexer Path
        { name: 'Witch Doctor', icon: 'fas fa-hat-wizard', description: 'Spiritual invoker channeling loa spirits', theme: 'spiritual' },
        { name: 'Formbender', icon: 'fas fa-paw', description: 'Shapeshifter with primal instinct energy', theme: 'primal' },
        { name: 'Primalist', icon: 'fas fa-tree', description: 'Totem master resonating with elemental forces', theme: 'nature' },

        // Reaver Path
        { name: 'Berserker', icon: 'fas fa-hammer', description: 'Fury warrior with momentum thresholds', theme: 'rage' },
        { name: 'Dreadnaught', icon: 'fas fa-shield', description: 'Fortress defender with siege capabilities', theme: 'fortress' },
        { name: 'Titan', icon: 'fas fa-mountain', description: 'Gravity manipulator with strain overload', theme: 'gravity' },

        // Mercenary Path
        { name: 'Toxicologist', icon: 'fas fa-flask', description: 'Poison crafter with alchemical vials', theme: 'alchemy' },
        { name: 'Covenbane', icon: 'fas fa-ban', description: 'Witch hunter with anti-magic seals', theme: 'anti-magic' },
        { name: 'Bladedancer', icon: 'fas fa-wind', description: 'Finesse fighter with edge and flourish', theme: 'finesse' },

        // Sentinel Path
        { name: 'Lunarch', icon: 'fas fa-moon', description: 'Lunar mage with phase-based energy', theme: 'lunar' },
        { name: 'Huntress', icon: 'fas fa-crosshairs', description: 'Tracker with quarry marks and precision', theme: 'hunter' },
        { name: 'Warden', icon: 'fas fa-shield', description: 'Barrier guardian with protective bulwarks', theme: 'guardian' }
    ];

    // Handle class selection
    const handleClassSelect = (className) => {
        setSelectedClass(className);
        dispatch(wizardActionCreators.setClass(className));
    };

    // Get preview data (hovered or selected)
    const getPreviewClassData = () => {
        const previewName = hoveredClass || selectedClass;
        return previewName ? characterClasses.find(cls => cls.name === previewName) : null;
    };

    const previewClass = getPreviewClassData();

    // Helper functions for extended class preview
    const getClassRole = (className) => {
        const roles = {
            'Pyrofiend': 'Damage Dealer',
            'Minstrel': 'Support/Control',
            'Chronarch': 'Control/Utility',
            'Chaos Weaver': 'Damage/Chaos',
            'Fate Weaver': 'Support/Control',
            'Gambler': 'Utility/Luck',
            'Martyr': 'Tank/Support',
            'False Prophet': 'Control/Deception',
            'Exorcist': 'Support/Banishment',
            'Oracle': 'Support/Divination',
            'Factionist': 'Support/Buff',
            'Plaguebringer': 'Damage/Debuff',
            'Deathcaller': 'Necromancy/Control',
            'Lichborne': 'Caster/Undead',
            'Spellguard': 'Anti-Magic/Defense',
            'Inscriptor': 'Utility/Enchantment',
            'Arcanophage': 'Magic Absorption',
            'Witch Doctor': 'Healing/Curse',
            'Formbender': 'Shapeshifter/Utility',
            'Primalist': 'Elemental/Damage',
            'Berserker': 'Melee Damage',
            'Dreadnaught': 'Tank/Fortress',
            'Titan': 'Control/Gravity',
            'Toxicologist': 'Damage/Poison',
            'Covenbane': 'Anti-Magic/Hunter',
            'Bladedancer': 'Melee/Finesse',
            'Lunarch': 'Caster/Lunar',
            'Huntress': 'Ranged/Tracker',
            'Warden': 'Tank/Guardian'
        };
        return roles[className] || 'Versatile';
    };

    const getClassResource = (className) => {
        const resources = {
            'Pyrofiend': 'Corruption Stages',
            'Minstrel': 'Musical Notes',
            'Chronarch': 'Temporal Energy',
            'Chaos Weaver': 'Entropy Points',
            'Fate Weaver': 'Threads of Destiny',
            'Gambler': 'Luck Tokens',
            'Martyr': 'Sacrifice Points',
            'False Prophet': 'Deception Marks',
            'Exorcist': 'Dominance Die',
            'Oracle': 'Prophetic Visions',
            'Factionist': 'Faction Influence',
            'Plaguebringer': 'Plague Stacks',
            'Deathcaller': 'Necrotic Ascension',
            'Lichborne': 'Phylactery Power',
            'Spellguard': 'Ward Charges',
            'Inscriptor': 'Runic Power',
            'Arcanophage': 'Absorbed Magic',
            'Witch Doctor': 'Spirit Totems',
            'Formbender': 'Form Energy',
            'Primalist': 'Elemental Force',
            'Berserker': 'Rage Points',
            'Dreadnaught': 'Fortress Points',
            'Titan': 'Gravity Wells',
            'Toxicologist': 'Vial Charges',
            'Covenbane': 'Seal Energy',
            'Bladedancer': 'Edge & Flourish',
            'Lunarch': 'Lunar Phases',
            'Huntress': 'Quarry Marks',
            'Warden': 'Barrier Strength'
        };
        return resources[className] || 'Class Energy';
    };

    // Helper function to get full item objects from item names
    const getFullItemObjects = (itemNames) => {
        return itemNames.map(itemName => {
            return STARTING_EQUIPMENT_LIBRARY.find(item =>
                item.name.toLowerCase() === itemName.toLowerCase()
            );
        }).filter(item => item); // Remove undefined items
    };

    // Equipment hover handlers (same as equipment selection)
    const handleItemMouseEnter = (e, item) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Use more conservative estimates and add buffer
        const tooltipWidth = 280; // Increased estimate with buffer
        const tooltipHeight = 250; // Increased estimate with buffer
        const margin = 15; // Increased margin

        // Preferred position: right of item, aligned to top
        let x = rect.right + margin;
        let y = rect.top;

        // Check if preferred position fits
        const fitsRight = (x + tooltipWidth) <= viewportWidth;
        const fitsBelow = (y + tooltipHeight) <= viewportHeight;

        if (!fitsRight) {
            // Try left side
            x = rect.left - tooltipWidth - margin;
            if (x < margin) {
                // Doesn't fit left either, center horizontally
                x = (viewportWidth - tooltipWidth) / 2;
            }
        }

        // Handle vertical positioning
        if (!fitsBelow) {
            // Try above the item
            y = rect.top - tooltipHeight - margin;
            if (y < margin) {
                // Doesn't fit above, position below but clamp to viewport
                y = Math.max(margin, viewportHeight - tooltipHeight - margin);
            }
        }

        // Final clamping to ensure tooltip stays within viewport
        x = Math.max(margin, Math.min(x, viewportWidth - tooltipWidth - margin));
        y = Math.max(margin, Math.min(y, viewportHeight - tooltipHeight - margin));

        setTooltip({
            show: true,
            item: item,
            x: x,
            y: y
        });
    };

    const handleItemMouseMove = (e) => {
        if (tooltip.show) {
            const rect = e.currentTarget.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Use more conservative estimates and add buffer
            const tooltipWidth = 280; // Increased estimate with buffer
            const tooltipHeight = 250; // Increased estimate with buffer
            const margin = 15; // Increased margin

            // Preferred position: right of item, aligned to top
            let x = rect.right + margin;
            let y = rect.top;

            // Check if preferred position fits
            const fitsRight = (x + tooltipWidth) <= viewportWidth;
            const fitsBelow = (y + tooltipHeight) <= viewportHeight;

            if (!fitsRight) {
                // Try left side
                x = rect.left - tooltipWidth - margin;
                if (x < margin) {
                    // Doesn't fit left either, center horizontally
                    x = (viewportWidth - tooltipWidth) / 2;
                }
            }

            // Handle vertical positioning
            if (!fitsBelow) {
                // Try above the item
                y = rect.top - tooltipHeight - margin;
                if (y < margin) {
                    // Doesn't fit above, position below but clamp to viewport
                    y = Math.max(margin, viewportHeight - tooltipHeight - margin);
                }
            }

            // Final clamping to ensure tooltip stays within viewport
            x = Math.max(margin, Math.min(x, viewportWidth - tooltipWidth - margin));
            y = Math.max(margin, Math.min(y, viewportHeight - tooltipHeight - margin));

            setTooltip(prev => ({
                ...prev,
                x: x,
                y: y
            }));
        }
    };

    const handleItemMouseLeave = () => {
        setTooltip({ show: false, item: null, x: 0, y: 0 });
    };

    // Debug tooltip dimensions
    useEffect(() => {
        if (tooltip.show && tooltipRef.current) {
            const rect = tooltipRef.current.getBoundingClientRect();
            console.log('Tooltip dimensions:', {
                width: rect.width,
                height: rect.height,
                x: rect.x,
                y: rect.y,
                right: rect.right,
                bottom: rect.bottom,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            });
        }
    }, [tooltip.show]);

    const getClassFeatures = (className) => {
        const features = {
            'Pyrofiend': [
                'Manage Inferno Levels (0-9): Each fire spell ascends you, gaining +1 fire damage per level but adding deadly sin drawbacks',
                'Low levels (0-3) are safe but weak; mid levels (4-6) offer strong damage with manageable drawbacks; high levels (7-9) deal devastating damage but crippling penalties',
                'Use Cooling Ember to descend -3 levels when drawbacks become dangerous; expect to be a glass cannon needing tank/healer support'
            ],
            'Minstrel': [
                'Combine musical notes into powerful chord spells that scale with harmony complexity',
                'Position yourself to affect multiple allies with buffs and enemies with debuffs through AoE performances',
                'Maintain concentration on key songs while weaving offensive and supportive melodies for maximum impact'
            ],
            'Chronarch': [
                'Build temporal energy through time manipulation spells; spend it on powerful rewinds and accelerations',
                'Master timing to maximize spell effectiveness—rewind mistakes, accelerate allies, slow enemies at critical moments',
                'Coordinate with party for time-based combos; balance offensive time damage with utility temporal control'
            ],
            'Chaos Weaver': [
                'Roll chaos dice to determine spell effects—embrace unpredictability as your core mechanic',
                'Higher entropy grants stronger effects but increases risk; manage entropy levels carefully',
                'Adapt quickly to random outcomes; chaos manipulation can turn battles but requires flexible strategy'
            ],
            'Gambler': [
                'Build fortune tokens through risk-taking; spend them to manipulate probability and dice rolls',
                'Know when to take calculated risks versus when to fold; going all-in can win or lose encounters',
                'Fortune tokens stack for powerful effects but are lost on failed gambles; manage risk vs reward carefully'
            ],
            'Martyr': [
                'Transform damage taken into Sacrifice Points; spend points for powerful holy abilities',
                'Balance staying alive with taking damage for power; requires careful HP management',
                'Synergizes with healers who can offset your self-damage; rewards aggressive play but punishes poor positioning'
            ],
            'False Prophet': [
                'Generate Madness Points through shadow spells; each point adds +1 shadow damage but risks insanity at 20',
                'Use Temptation abilities unlocked at thresholds (6, 9, 12 Madness) but they add more Madness',
                'Manage Madness carefully—high Madness deals massive damage but triggers Insanity Convulsion at 20, resetting to 0'
            ],
            'Exorcist': [
                'Build Dominance Die through banishing evil creatures; larger die grants stronger banishment effects',
                'Focus on undead, demons, and evil spirits for maximum effectiveness; less effective against non-evil foes',
                'Use holy wards and purification spells to protect allies while banishing threats; requires positioning near allies'
            ],
            'Oracle': [
                'Generate Prophetic Visions through divination spells; use visions to predict enemy actions and reveal weaknesses',
                'Visions grant advantage on saves/attacks and reveal hidden information; coordinate with party for tactical advantage',
                'Balance offensive divination damage with utility foresight; optimal when party can act on revealed information'
            ],
            'Plaguebringer': [
                'Spread plague stacks to enemies through disease spells; stacks spread to nearby enemies and deal DoT',
                'Focus on grouping enemies for maximum plague spread; higher stacks deal exponentially more damage',
                'Requires enemies to cluster; less effective against spread-out foes; excels in crowded encounters'
            ],
            'Lichborne': [
                'Power comes from your Phylactery; phylactery charges grant immortality and powerful necromantic abilities',
                'Must protect phylactery—if destroyed, you die permanently; can place it strategically but it\'s vulnerable',
                'Phylactery charges regenerate slowly; spend wisely on powerful undead summoning and life-draining spells'
            ],
            'Deathcaller': [
                'Harvest soul fragments from dead enemies; fragments power necromantic spells and undead creation',
                'More powerful enemies grant more fragments; focus on eliminating targets quickly to build soul pool',
                'Spend fragments to raise undead minions or cast powerful necromancy; requires managing minion count and fragment economy'
            ],
            'Spellguard': [
                'Build Ward Charges by blocking spells; charges power defensive abilities and counterspells',
                'Position to intercept enemy spells targeting allies; each blocked spell builds charges',
                'Spend charges on powerful wards, spell reflection, and counterspells; requires anticipating enemy spellcasters'
            ],
            'Inscriptor': [
                'Carve runic glyphs into equipment and terrain; glyphs create magical circuits that enhance spells',
                'Pre-combat preparation is key—inscribe party equipment and battlefield areas before encounters',
                'Glyph circuits amplify spell effects; more complex circuits = stronger bonuses but require setup time'
            ],
            'Arcanoneer': [
                'Fire elemental cannons that deal massive damage but have volatility risk—high rolls deal massive damage, low rolls can backfire',
                'Manage volatility through stabilizing techniques; higher volatility = more damage but greater risk',
                'Requires positioning for optimal cannon shots; excels at long-range bombardment but vulnerable when repositioning'
            ],
            'Witch Doctor': [
                'Channel loa spirits through totems; different loa grant different abilities (healing, curses, combat)',
                'Place totems strategically for area effects; totems can be destroyed, requiring repositioning',
                'Switch between loa spirits for different situations; some excel at healing, others at damage or control'
            ],
            'Formbender': [
                'Shift between animal forms using Form Energy; each form has unique abilities and playstyles',
                'Forms grant different combat roles—predator forms for damage, guardian forms for tanking, utility forms for exploration',
                'Managing Form Energy is crucial—some forms drain energy quickly; transform strategically based on encounter needs'
            ],
            'Primalist': [
                'Channel elemental forces through totems; totems resonate with fire, storm, earth, and frost elements',
                'Place totems to create elemental zones; enemies in zones take damage, allies gain bonuses',
                'Totem combinations create powerful synergies; multiple totems amplify effects but require setup and mana investment'
            ],
            'Berserker': [
                'Build Rage Points through combat; rage fuels powerful abilities and increases damage',
                'Higher rage grants massive damage bonuses but reduces control; manage rage levels to avoid berserker penalties',
                'Synergizes with taking damage; requires tanking hits to build rage but needs healer support to survive'
            ],
            'Dreadnaught': [
                'Build Fortress Points by defending and taking hits; points power defensive abilities and counterattacks',
                'Stand as immovable tank—enemies break against you while you build points for devastating counterattacks',
                'Requires positioning to protect allies; excels at chokepoints and defensive formations'
            ],
            'Titan': [
                'Manipulate gravity through Gravity Wells; wells crush enemies and control battlefield positioning',
                'Higher strain = more powerful effects but risks overload; manage strain to avoid self-damage',
                'Requires careful positioning—gravity effects affect both enemies and allies; coordinate with party'
            ],
            'Toxicologist': [
                'Craft poisons using alchemical vials; different poisons have different effects (DoT, debuffs, burst damage)',
                'Manage vial charges—crafting consumes charges; more powerful poisons require more charges',
                'Apply poisons to weapons or throw vials; excels at sustained damage but requires preparation and resource management'
            ],
            'Covenbane': [
                'Build Hexbreaker Charges by attacking evil magic users and being targeted by spells; charges power anti-magic abilities',
                'Higher charges grant massive passive bonuses (+5d6 damage, +30ft speed at 6 charges) or can be spent on powerful abilities',
                'Every third attack vs evil magic users deals bonus true damage; focus spellcasters to build charges rapidly'
            ],
            'Bladedancer': [
                'Build Edge and Flourish through elegant combat; Edge powers defensive abilities, Flourish powers offensive combos',
                'Maintain fluid movement and positioning; each strike builds resources for powerful finishing moves',
                'Requires agility and positioning; excels at hit-and-run tactics and dancing between enemies'
            ],
            'Lunarch': [
                'Power scales with lunar phases; waxing moon increases offensive power, waning moon increases defensive abilities',
                'Track moon phases for optimal ability timing; full moon grants maximum power but has drawbacks',
                'Lunar energy regenerates based on phase; plan encounters around lunar cycles for best effectiveness'
            ],
            'Huntress': [
                'Mark Quarry targets for bonus damage and tracking; marked targets take increased damage and cannot hide',
                'Quarry marks stack for increased bonuses; focus fire on marked targets for maximum damage',
                'Excels at ranged combat and tracking; requires line of sight and positioning for optimal shots'
            ],
            'Warden': [
                'Build Barrier Strength by protecting allies; barriers block damage and can be strengthened through combat',
                'Place barriers strategically to protect allies and control enemy movement; barriers can be destroyed',
                'Bond with allies to share protection; requires positioning near allies and managing barrier placement'
            ]
        };
        return features[className] || [
            'Master unique abilities that define your path',
            'Specialize in techniques others cannot match',
            'Grow in power through dedicated training'
        ];
    };

    const getClassFlavor = (className) => {
        const flavors = {
            'Pyrofiend': 'High-risk damage dealer who ascends through Inferno Levels (0-9) with each fire spell, gaining massive damage but deadly sin drawbacks.',
            'Minstrel': 'Musical spellcaster who combines notes into powerful chord spells, supporting allies while disrupting enemies through performance magic.',
            'Chronarch': 'Time manipulator who builds temporal energy to rewind mistakes, accelerate allies, and control battle tempo through temporal magic.',
            'Chaos Weaver': 'Reality bender who rolls chaos dice for unpredictable spell effects, embracing entropy and randomness as core mechanics.',
            'Gambler': 'Fate manipulator who builds fortune tokens through risk-taking, spending them to manipulate probability and dice rolls.',
            'Martyr': 'Sacrifice-based warrior who transforms damage taken into power, trading HP for devastating holy abilities.',
            'False Prophet': 'Shadow caster who generates Madness Points for massive damage bonuses, balancing power against insanity at high thresholds.',
            'Exorcist': 'Holy warrior who builds Dominance Die by banishing evil creatures, using banishment magic to protect allies.',
            'Oracle': 'Diviner who generates Prophetic Visions to predict enemy actions, reveal weaknesses, and grant tactical advantages.',
            'Plaguebringer': 'Disease spreader who infects enemies with plague stacks that spread and deal exponential damage over time.',
            'Lichborne': 'Immortal necromancer powered by a phylactery that grants undead abilities and resurrection, but must be protected.',
            'Deathcaller': 'Necromancer who harvests soul fragments from dead enemies to power spells and raise undead minions.',
            'Spellguard': 'Anti-magic specialist who builds Ward Charges by blocking spells, spending them on defensive abilities and counterspells.',
            'Inscriptor': 'Runic scholar who carves glyphs into equipment and terrain, creating magical circuits that amplify spell effects.',
            'Arcanoneer': 'Elemental gunslinger who fires volatile cannons dealing massive damage, with high-risk backfire potential.',
            'Witch Doctor': 'Spirit channeler who calls upon loa through totems, switching between healing, curses, and combat abilities.',
            'Formbender': 'Shapeshifter who transforms between animal forms using Form Energy, adapting combat role to encounter needs.',
            'Primalist': 'Elemental totem master who places totems creating elemental zones, combining fire, storm, earth, and frost effects.',
            'Berserker': 'Rage-fueled warrior who builds Rage Points through combat, trading control for massive damage bonuses.',
            'Dreadnaught': 'Fortress tank who builds Fortress Points by defending, spending them on defensive abilities and counterattacks.',
            'Titan': 'Gravity manipulator who creates Gravity Wells to crush enemies and control positioning, managing strain to avoid overload.',
            'Toxicologist': 'Poison crafter who uses alchemical vials to create poisons with various effects, requiring preparation and resource management.',
            'Covenbane': 'Witch hunter who builds Hexbreaker Charges by fighting magic users, gaining massive passive bonuses or spending on anti-magic abilities.',
            'Bladedancer': 'Finesse fighter who builds Edge and Flourish through elegant combat, combining graceful movement with deadly precision.',
            'Lunarch': 'Lunar mage whose power scales with moon phases, timing abilities around waxing and waning cycles for maximum effectiveness.',
            'Huntress': 'Ranged tracker who marks Quarry targets for bonus damage, excelling at focus fire and tracking fleeing enemies.',
            'Warden': 'Barrier guardian who builds Barrier Strength by protecting allies, placing defensive barriers and sharing protection.'
        };
        return flavors[className] || 'A unique path of power and destiny awaits those who walk this road.';
    };

    const getRecommendedStats = (className) => {
        const statRecommendations = {
            'Pyrofiend': [
                { name: 'Intelligence', priority: 3 },
                { name: 'Constitution', priority: 2 },
                { name: 'Charisma', priority: 1 }
            ],
            'Minstrel': [
                { name: 'Charisma', priority: 3 },
                { name: 'Intelligence', priority: 2 },
                { name: 'Agility', priority: 1 }
            ],
            'Chronarch': [
                { name: 'Intelligence', priority: 3 },
                { name: 'Spirit', priority: 2 },
                { name: 'Constitution', priority: 1 }
            ],
            'Chaos Weaver': [
                { name: 'Intelligence', priority: 3 },
                { name: 'Charisma', priority: 2 },
                { name: 'Spirit', priority: 1 }
            ],
            'Gambler': [
                { name: 'Charisma', priority: 3 },
                { name: 'Agility', priority: 2 },
                { name: 'Intelligence', priority: 1 }
            ],
            'Bladedancer': [
                { name: 'Agility', priority: 3 },
                { name: 'Strength', priority: 2 },
                { name: 'Constitution', priority: 1 }
            ],
            'Berserker': [
                { name: 'Strength', priority: 3 },
                { name: 'Constitution', priority: 2 },
                { name: 'Agility', priority: 1 }
            ],
            'Warden': [
                { name: 'Constitution', priority: 3 },
                { name: 'Strength', priority: 2 },
                { name: 'Spirit', priority: 1 }
            ]
        };
        return statRecommendations[className] || [
            { name: 'Intelligence', priority: 2 },
            { name: 'Constitution', priority: 2 },
            { name: 'Agility', priority: 1 }
        ];
    };

    // Helper function to get starting equipment that class adds to pool
    const getStartingEquipment = (className) => {
        const equipment = {
            'Pyrofiend': {
                weapons: ['Smoldering Staff', 'Ember Dagger'],
                armor: ['Ash-Stained Robes'],
                tools: ['Infernal Grimoire', 'Sulfur Pouch'],
                accessories: ['Flame Amulet']
            },
            'Minstrel': {
                weapons: ['Traveler\'s Lute', 'Silver Rapier'],
                armor: ['Performer\'s Outfit'],
                tools: ['Book of Ballads'],
                accessories: ['Enchanted Tuning Fork']
            },
            'Chronarch': {
                weapons: ['Temporal Staff'],
                armor: ['Temporal Robes'],
                tools: ['Pocket Watch of Chronos'],
                accessories: ['Hourglass Pendant', 'Time Crystal']
            },
            'Chaos Weaver': {
                weapons: ['Wand of Entropy'],
                armor: ['Shifting Robes'],
                tools: ['Chaos Dice Set', 'Reality Anchor'],
                accessories: ['Orb of Entropy']
            },
            'Fate Weaver': {
                weapons: ['Thread-Bound Staff', 'Destiny Blade'],
                armor: ['Weaver\'s Robes'],
                tools: ['Deck of Fate', 'Thread Spool'],
                accessories: ['Thread of Destiny', 'Fate Pendant']
            },
            'Gambler': {
                weapons: ['Duelist\'s Rapier'],
                armor: ['Gambler\'s Vest'],
                tools: ['Fate Deck', 'Loaded Dice'],
                accessories: ['Lucky Coin']
            },
            'Martyr': {
                weapons: ['Sacred Mace', 'Sacrificial Blade'],
                armor: ['Scarred Plate'],
                tools: ['Tome of Suffering'],
                accessories: ['Martyr\'s Holy Symbol']
            },
            'False Prophet': {
                weapons: ['Charlatan\'s Staff', 'Whisper Blade'],
                armor: ['Deception Robes'],
                tools: ['Tome of Corruption'],
                accessories: ['Counterfeit Relic', 'Shadow Amulet']
            },
            'Exorcist': {
                weapons: ['Banishment Staff'],
                armor: ['Purification Robes'],
                tools: ['Vial of Holy Water'],
                accessories: ['Exorcist\'s Holy Symbol', 'Warding Rings']
            },
            'Oracle': {
                weapons: ['Oracle\'s Divination Staff'],
                armor: ['Prophetic Robes'],
                tools: ['Oracle\'s Tarot Deck'],
                accessories: ['Scrying Orb', 'Necklace of Fate']
            },
            'Plaguebringer': {
                weapons: ['Plague Staff'],
                armor: ['Contaminated Robes'],
                tools: ['Plague Vial', 'Tome of Rot'],
                accessories: ['Pestilence Mask']
            },
            'Lichborne': {
                weapons: ['Frost Staff'],
                armor: ['Undead Robes'],
                tools: ['Necromantic Tome'],
                accessories: ['Phylactery', 'Soul Gem']
            },
            'Deathcaller': {
                weapons: ['Bone Wand'],
                armor: ['Necromancer\'s Robes'],
                tools: ['Soul Catcher'],
                accessories: ['Soul Gem', 'Skull Amulet']
            },
            'Spellguard': {
                weapons: ['Warding Staff'],
                armor: ['Protective Robes'],
                tools: ['Tome of Protection'],
                accessories: ['Warding Amulet', 'Ward Stone']
            },
            'Inscriptor': {
                weapons: ['Runic Chisel'],
                armor: ['Runic Robes'],
                tools: ['Rune Stone Set', 'Rune Pouch'],
                accessories: ['Glyph Amulet']
            },
            'Arcanoneer': {
                weapons: ['Arcane Pistol'],
                armor: ['Magical Leathers'],
                tools: ['Arcane Ammo Pouch', 'Gunslinger\'s Manual'],
                accessories: ['Precision Sight']
            },
            'Witch Doctor': {
                weapons: ['Totem Staff'],
                armor: ['Tribal Robes'],
                tools: ['Voodoo Doll', 'Herb Pouch'],
                accessories: ['Spirit Mask']
            },
            'Formbender': {
                weapons: ['Primal Staff', 'Beast Claw'],
                armor: ['Primal Leathers'],
                tools: ['Shape Totem'],
                accessories: ['Beast Fang Necklace']
            },
            'Primalist': {
                weapons: ['Elemental Staff'],
                armor: ['Nature\'s Robes'],
                tools: ['Totem Pouch', 'Totem Stone'],
                accessories: ['Elemental Crystal']
            },
            'Berserker': {
                weapons: ['Berserker\'s Greataxe', 'Battle Axe'],
                armor: ['Berserker Hide'],
                tools: ['War Paint'],
                accessories: ['Rage Totem']
            },
            'Dreadnaught': {
                weapons: ['Heavy Warhammer', 'Siege Ram'],
                armor: ['Tower Shield', 'Fortress Plate', 'Bastion Helmet']
            },
            'Titan': {
                weapons: ['Gravity Maul'],
                armor: ['Gravity Plate'],
                tools: ['Tome of Gravity'],
                accessories: ['Gravity Core', 'Strain Brace']
            },
            'Toxicologist': {
                weapons: ['Envenomed Dagger'],
                armor: ['Poison-Resistant Robes'],
                tools: ['Poison Vial Set', 'Alchemy Tome'],
                accessories: ['Alchemist\'s Bandolier', 'Toxic Ring']
            },
            'Covenbane': {
                weapons: ['Nullifying Blade'],
                armor: ['Anti-Magic Armor'],
                tools: ['Witch Hunter\'s Tome'],
                accessories: ['Hexbreaker Seal', 'Null Amulet']
            },
            'Bladedancer': {
                weapons: ['Twin Dancing Blades'],
                armor: ['Dancer\'s Leathers', 'Flourish Cloak'],
                tools: ['Dance Manual'],
                accessories: ['Ring of Grace']
            },
            'Lunarch': {
                weapons: ['Lunar Bow'],
                armor: ['Lunar Robes'],
                tools: ['Lunar Tome'],
                accessories: ['Moonstone Amulet', 'Phase Crystal']
            },
            'Huntress': {
                weapons: ['Shadow Glaive'],
                armor: ['Tracker\'s Gear'],
                tools: ['Tracking Kit', 'Ranger\'s Manual'],
                accessories: ['Prey Mark']
            },
            'Warden': {
                weapons: ['Guardian Spear'],
                armor: ['Warden\'s Chainmail', 'Guardian Shield'],
                accessories: ['Protection Amulet', 'Barrier Stone']
            },
            'Justicar': {
                weapons: ['Justicar\'s Blade'],
                armor: ['Shield of Faith', 'Holy Plate'],
                tools: ['Tome of Justice'],
                accessories: ['Righteous Amulet']
            },
            'Oathkeeper': {
                weapons: ['Oathbound Blade'],
                armor: ['Vow Plate'],
                tools: ['Tome of Vows'],
                accessories: ['Oath Ring', 'Oath Seal']
            },
            'Factionist': {
                weapons: ['Faction Longsword'],
                armor: ['Faction Uniform'],
                tools: ['Faction Banner'],
                accessories: ['Faction Seal Ring', 'Faction Medallion']
            },
            'Arcanophage': {
                weapons: ['Absorption Orb', 'Magic Absorption Staff'],
                armor: ['Void Robes'],
                tools: ['Tome of Absorption'],
                accessories: ['Absorption Ring']
            }
        };
        const classEq = equipment[className] || {};
        // Return empty object structure if no equipment
        return {
            weapons: classEq.weapons || [],
            armor: classEq.armor || [],
            tools: classEq.tools || [],
            accessories: classEq.accessories || [],
            consumables: classEq.consumables || []
        };
    };

    // Helper function to get damage types (for all classes)
    const getDamageTypes = (className) => {
        const damageTypes = {
            'Pyrofiend': ['Fire', 'Chaos'],
            'Minstrel': ['Thunder', 'Psychic'],
            'Chronarch': ['Force', 'Necrotic'],
            'Chaos Weaver': ['Chaos', 'Force', 'Fire'],
            'Gambler': ['Psychic', 'Lightning', 'Poison'],
            'Martyr': ['Radiant', 'Necrotic'],
            'False Prophet': ['Psychic', 'Poison', 'Necrotic'],
            'Exorcist': ['Radiant', 'Force'],
            'Oracle': ['Radiant', 'Psychic', 'Lightning'],
            'Plaguebringer': ['Poison', 'Necrotic', 'Acid'],
            'Lichborne': ['Necrotic', 'Cold', 'Poison'],
            'Deathcaller': ['Necrotic', 'Poison'],
            'Spellguard': ['Force', 'Radiant'],
            'Inscriptor': ['Force', 'Fire', 'Lightning'],
            'Arcanoneer': ['Fire', 'Lightning', 'Acid', 'Cold', 'Force'],
            'Witch Doctor': ['Poison', 'Necrotic', 'Psychic'],
            'Formbender': ['Slashing', 'Piercing'],
            'Primalist': ['Lightning', 'Cold', 'Fire', 'Acid'],
            'Berserker': ['Slashing', 'Bludgeoning'],
            'Dreadnaught': ['Bludgeoning', 'Slashing'],
            'Titan': ['Bludgeoning', 'Force'],
            'Toxicologist': ['Poison', 'Acid'],
            'Covenbane': ['Radiant', 'Fire'],
            'Bladedancer': ['Slashing', 'Piercing'],
            'Lunarch': ['Radiant', 'Cold', 'Psychic'],
            'Huntress': ['Piercing', 'Slashing'],
            'Warden': ['Bludgeoning', 'Piercing', 'Slashing']
        };
        return damageTypes[className] || ['Physical', 'Magical'];
    };

    // Helper function to get playstyle tips
    const getPlaystyleTips = (className) => {
        const tips = {
            'Pyrofiend': [
                'Focus on building corruption stacks for maximum damage',
                'Use fire resistance to survive your own flames',
                'Combine fire spells for devastating combos',
                'Manage corruption carefully to avoid self-destruction'
            ],
            'Minstrel': [
                'Use songs to control the battlefield',
                'Combine offensive spells with inspiring melodies',
                'Position carefully to affect multiple allies',
                'Maintain concentration on key performances'
            ],
            'Chronarch': [
                'Master timing for maximum spell effectiveness',
                'Use temporal abilities to control encounter flow',
                'Coordinate with allies for time-based combos',
                'Balance offensive and utility time magic'
            ],
            'Chaos Weaver': [
                'Embrace unpredictability in your strategy',
                'Use chaos dice to turn the tide of battle',
                'Adapt quickly to random spell effects',
                'Risk management is key to survival'
            ],
            'Gambler': [
                'Take calculated risks for maximum reward',
                'Use luck manipulation strategically',
                'Know when to fold and when to go all-in',
                'Build fortune before making big plays'
            ],
            'Bladedancer': [
                'Maintain fluid movement in combat',
                'Use stance changes to adapt to situations',
                'Focus on positioning and timing',
                'Combine grace with deadly precision'
            ],
            'Berserker': [
                'Build rage through combat engagement',
                'Use momentum to chain devastating attacks',
                'Balance fury with tactical awareness',
                'Channel anger into focused destruction'
            ],
            'Warden': [
                'Use terrain and positioning to your advantage',
                'Focus on protecting allies with barriers',
                'Combine nature magic with defensive tactics',
                'Control the battlefield with binding spells'
            ]
        };
        return tips[className] || [
            'Adapt your strategy to the situation',
            'Work with your team for best results',
            'Practice your core abilities regularly',
            'Learn from each encounter'
        ];
    };

    // Helper function to get multiclass synergy
    const getMulticlassSynergy = (className) => {
        const synergy = {
            'Pyrofiend': [
                { name: 'Chaos Weaver', rating: 5 },
                { name: 'Berserker', rating: 4 },
                { name: 'Gambler', rating: 3 },
                { name: 'Warden', rating: 1 }
            ],
            'Minstrel': [
                { name: 'Gambler', rating: 5 },
                { name: 'Chronarch', rating: 4 },
                { name: 'Chaos Weaver', rating: 3 },
                { name: 'Berserker', rating: 2 }
            ],
            'Chronarch': [
                { name: 'Minstrel', rating: 5 },
                { name: 'Chaos Weaver', rating: 4 },
                { name: 'Pyrofiend', rating: 3 },
                { name: 'Berserker', rating: 2 }
            ],
            'Chaos Weaver': [
                { name: 'Pyrofiend', rating: 5 },
                { name: 'Gambler', rating: 4 },
                { name: 'Chronarch', rating: 4 },
                { name: 'Warden', rating: 2 }
            ],
            'Gambler': [
                { name: 'Minstrel', rating: 5 },
                { name: 'Chaos Weaver', rating: 4 },
                { name: 'Bladedancer', rating: 3 },
                { name: 'Berserker', rating: 2 }
            ],
            'Bladedancer': [
                { name: 'Berserker', rating: 4 },
                { name: 'Gambler', rating: 3 },
                { name: 'Warden', rating: 3 },
                { name: 'Pyrofiend', rating: 2 }
            ],
            'Berserker': [
                { name: 'Pyrofiend', rating: 4 },
                { name: 'Bladedancer', rating: 4 },
                { name: 'Warden', rating: 3 },
                { name: 'Minstrel', rating: 2 }
            ],
            'Warden': [
                { name: 'Chronarch', rating: 4 },
                { name: 'Berserker', rating: 3 },
                { name: 'Bladedancer', rating: 3 },
                { name: 'Pyrofiend', rating: 1 }
            ]
        };
        return synergy[className] || [
            { name: 'Versatile', rating: 3 },
            { name: 'Adaptable', rating: 3 },
            { name: 'Balanced', rating: 3 }
        ];
    };

    return (
        <div className="wizard-step-content">
            <div className="class-selection-layout">
                    {/* Left side - Class selection */}
                    <div className="class-selection-panel">
                        <div className="class-section">
                            <h3 className="section-title">
                                <i className="fas fa-sword"></i>
                                Choose Class
                            </h3>
                            <div className="class-grid">
                                {characterClasses.map((classData) => (
                                    <div
                                        key={classData.name}
                                        className={`class-card ${selectedClass === classData.name ? 'selected' : ''}`}
                                        onClick={() => handleClassSelect(classData.name)}
                                        onMouseEnter={() => setHoveredClass(classData.name)}
                                        onMouseLeave={() => setHoveredClass(null)}
                                    >
                                        <div className="class-info">
                                            <h4 className="class-name">{classData.name}</h4>
                                            <p className="class-description">
                                                {classData.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {validationErrors.class && (
                            <div className="error-message">
                                <i className="fas fa-exclamation-triangle"></i>
                                {validationErrors.class}
                            </div>
                        )}

                    </div>

                    {/* Right side - Class preview */}
                    <div className="class-preview-container">
                        {previewClass ? (
                            <div className="subrace-info-section">
                                    <h2 className="class-preview-title">{previewClass.name}</h2>

                                    <p className="class-flavor-text">
                                        {getClassFlavor(previewClass.name)}
                                    </p>

                                    <div className="class-meta-row">
                                        <span className="meta-badge"><span className="meta-label">Theme</span>{previewClass.theme}</span>
                                        <span className="meta-badge"><span className="meta-label">Role</span>{getClassRole(previewClass.name)}</span>
                                        <span className="meta-badge"><span className="meta-label">Resource</span>{getClassResource(previewClass.name)}</span>
                                    </div>

                                    <div className="class-features-list">
                                        {getClassFeatures(previewClass.name).map((feature, index) => (
                                            <div key={index} className="feature-bullet">{feature}</div>
                                        ))}
                                    </div>

                                    {(() => {
                                        const eq = getStartingEquipment(previewClass.name);
                                        const hasEquipment = (eq.weapons && eq.weapons.length > 0) ||
                                                           (eq.armor && eq.armor.length > 0) ||
                                                           (eq.tools && eq.tools.length > 0) ||
                                                           (eq.accessories && eq.accessories.length > 0) ||
                                                           (eq.consumables && eq.consumables.length > 0);
                                        return hasEquipment ? (
                                            <div className="starting-equipment-section">
                                                <h4 className="equipment-section-title">
                                                    <i className="fas fa-shopping-bag"></i> Starting Equipment Pool
                                                </h4>
                                                <div 
                                                    className="equipment-preview-grid"
                                                    style={{
                                                        minHeight: (() => {
                                                            const allItemNames = [
                                                                ...(eq.weapons || []),
                                                                ...(eq.armor || []),
                                                                ...(eq.tools || []),
                                                                ...(eq.accessories || []),
                                                                ...(eq.consumables || [])
                                                            ];
                                                            const fullItems = getFullItemObjects(allItemNames);
                                                            if (fullItems.length === 0) return '120px';
                                                            
                                                            const estimatedRows = Math.max(2, Math.ceil(fullItems.length / 3) + 1);
                                                            const cellSize = 40;
                                                            const rowGap = 2;
                                                            const gridPadding = 8;
                                                            const gridHeight = (gridPadding * 2) + (estimatedRows * cellSize) + ((estimatedRows - 1) * rowGap);
                                                            return `${gridHeight}px`;
                                                        })()
                                                    }}
                                                >
                                                    {(() => {
                                                        // Get all item names and convert to full objects
                                                        const allItemNames = [
                                                            ...(eq.weapons || []),
                                                            ...(eq.armor || []),
                                                            ...(eq.tools || []),
                                                            ...(eq.accessories || []),
                                                            ...(eq.consumables || [])
                                                        ];

                                                        const fullItems = getFullItemObjects(allItemNames);

                                                        // Equipment shop grid logic
                                                        const COLS = 6; // Smaller grid for class preview
                                                        const occupiedCells = new Map(); // Track occupied cells by "row,col" key
                                                        const gridRows = [];
                                                        const itemWrappers = [];
                                                        let totalRows = 0;

                                                        // Calculate grid constants
                                                        const cellSize = 40;
                                                        const cellGap = 1;
                                                        const rowGap = 2;
                                                        const gridPadding = 8;

                                                        // Place items in grid with proper dimensions
                                                        fullItems.forEach((item, index) => {
                                                            if (!item) return;

                                                            const width = item.width || 1;
                                                            const height = item.height || 1;

                                                            // Find a spot for this item - dynamically expand grid if needed
                                                            let placed = false;
                                                            let maxRowToCheck = Math.max(6, totalRows + height + 2); // Limit to 6 rows max
                                                            
                                                            for (let row = 0; row < maxRowToCheck && !placed; row++) {
                                                                for (let col = 0; col < COLS && !placed; col++) {
                                                                    // Check if this position and area is free
                                                                    let canPlace = true;
                                                                    for (let dy = 0; dy < height && canPlace; dy++) {
                                                                        for (let dx = 0; dx < width && canPlace; dx++) {
                                                                            if (col + dx >= COLS || occupiedCells.has(`${row + dy},${col + dx}`)) {
                                                                                canPlace = false;
                                                                            }
                                                                        }
                                                                    }

                                                                    if (canPlace) {
                                                                        // Mark cells as occupied
                                                                        for (let dy = 0; dy < height; dy++) {
                                                                            for (let dx = 0; dx < width; dx++) {
                                                                                occupiedCells.set(`${row + dy},${col + dx}`, true);
                                                                            }
                                                                        }

                                                                        // Calculate position relative to grid container (accounting for 8px padding)
                                                                        const itemLeft = gridPadding + col * (cellSize + cellGap);
                                                                        const itemTop = gridPadding + row * (cellSize + rowGap);
                                                                        const itemWidth = width * cellSize + (width - 1) * cellGap;
                                                                        const itemHeight = height * cellSize + (height - 1) * rowGap;
                                                                        
                                                                        // Mark the first cell as occupied for rendering
                                                                        if (!gridRows[row]) gridRows[row] = [];
                                                                        gridRows[row][col] = true;
                                                                        
                                                                        // Create item wrapper as separate element
                                                                        itemWrappers.push(
                                                                            <div
                                                                                key={`item-${index}`}
                                                                                className="equipment-preview-item-wrapper"
                                                                                style={{
                                                                                    width: `${itemWidth}px`,
                                                                                    height: `${itemHeight}px`,
                                                                                    left: `${itemLeft}px`,
                                                                                    top: `${itemTop}px`
                                                                                }}
                                                                                onMouseEnter={(e) => handleItemMouseEnter(e, item)}
                                                                                onMouseMove={handleItemMouseMove}
                                                                                onMouseLeave={handleItemMouseLeave}
                                                                            >
                                                                                <div
                                                                                    className="equipment-item-icon"
                                                                                    style={{
                                                                                        backgroundImage: `url(${getIconUrl(item.iconId, 'items')})`,
                                                                                        backgroundColor: 'transparent',
                                                                                        width: '100%',
                                                                                        height: '100%',
                                                                                        backgroundSize: 'contain',
                                                                                        backgroundPosition: 'center',
                                                                                        backgroundRepeat: 'no-repeat',
                                                                                        position: 'absolute',
                                                                                        top: 0,
                                                                                        left: 0
                                                                                    }}
                                                                                    title={item.name}
                                                                                />
                                                                            </div>
                                                                        );
                                                                        placed = true;
                                                                        totalRows = Math.max(totalRows, row + height);
                                                                    }
                                                                }
                                                            }
                                                        });

                                                        // Ensure we have enough rows for all placed items
                                                        const minRows = Math.max(2, totalRows + 1);
                                                        while (gridRows.length < minRows) {
                                                            gridRows.push(new Array(COLS).fill(null));
                                                        }
                                                        
                                                        // Calculate grid height: padding (top + bottom) + rows * (cell height + row gap) - last row gap
                                                        const gridHeight = (gridPadding * 2) + (gridRows.length * cellSize) + ((gridRows.length - 1) * rowGap);

                                                        // Render grid rows and item wrappers
                                                        return (
                                                            <>
                                                                {/* Grid cells */}
                                                                {gridRows.map((rowCells, rowIndex) => (
                                                                    <div key={`row-${rowIndex}`} className="equipment-preview-row">
                                                                        {Array.from({ length: COLS }, (_, colIndex) => {
                                                                            const isOccupied = occupiedCells.has(`${rowIndex},${colIndex}`);
                                                                            return (
                                                                                <div 
                                                                                    key={`cell-${rowIndex}-${colIndex}`} 
                                                                                    className={`equipment-preview-cell ${isOccupied ? 'occupied' : 'empty'}`}
                                                                                ></div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                ))}
                                                                {/* Item wrappers positioned absolutely */}
                                                                {itemWrappers}
                                                                {/* Spacer to ensure grid container expands to fit all rows */}
                                                                <div style={{ 
                                                                    height: `${gridHeight}px`, 
                                                                    width: '1px', 
                                                                    position: 'absolute',
                                                                    pointerEvents: 'none',
                                                                    visibility: 'hidden',
                                                                    top: 0,
                                                                    left: 0
                                                                }}></div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>

                                                <div className="equipment-pool-note">
                                                    <div className="note-content">
                                                        <i className="fas fa-info-circle"></i>
                                                        <span>These items are added to your starting equipment pool. You can purchase additional items like these in Step 10 among other equipment choices. Equipping happens during actual gameplay.</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null;
                                    })()}
                                </div>
                        ) : (
                            <div className="preview-placeholder">
                                <i className="fas fa-sword"></i>
                                <h3>Select a Class</h3>
                                <p>Hover over or select a class to see its details and abilities.</p>
                            </div>
                        )}
                    </div>

                    {/* Item Tooltip */}
                    {tooltip.show && tooltip.item && (
                        <div
                            ref={tooltipRef}
                            style={{
                                position: 'fixed',
                                left: tooltip.x,
                                top: tooltip.y,
                                zIndex: 1000,
                                pointerEvents: 'none'
                            }}
                        >
                            <ItemTooltip item={tooltip.item} />
                        </div>
                    )}
                </div>
        </div>
    );
};

export default Step3ClassSelection;
