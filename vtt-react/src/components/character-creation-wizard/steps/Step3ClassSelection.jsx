/**
 * Step 3: Class Selection
 *
 * Class selection step with layout matching the race selection
 */

import React, { useState } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';

const Step3ClassSelection = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const [selectedClass, setSelectedClass] = useState(state.characterData.class);
    const [hoveredClass, setHoveredClass] = useState(null);

    const { validationErrors } = state;

    // All 27 character classes as flat list (corrected from CharacterCreation.jsx)
    const characterClasses = [
        // Infernal Path
        { name: 'Pyrofiend', icon: 'fas fa-fire', description: 'Demonic fire wielder with ascending corruption stages', theme: 'fire' },
        { name: 'Minstrel', icon: 'fas fa-music', description: 'Musical spellcaster combining notes into powerful chords', theme: 'music' },
        { name: 'Chronarch', icon: 'fas fa-clock', description: 'Time manipulator building temporal energy', theme: 'time' },
        { name: 'Chaos Weaver', icon: 'fas fa-dice', description: 'Reality bender using chaos dice and entropy', theme: 'chaos' },
        { name: 'Gambler', icon: 'fas fa-coins', description: 'Fate manipulator balancing luck and risk', theme: 'luck' },

        // Zealot Path
        { name: 'Martyr', icon: 'fas fa-plus', description: 'Self-sacrificing warrior earning power through pain', theme: 'sacrifice' },
        { name: 'False Prophet', icon: 'fas fa-eye', description: 'Deceptive preacher spreading lies and corruption', theme: 'deception' },
        { name: 'Exorcist', icon: 'fas fa-hand-sparkles', description: 'Holy warrior banishing evil spirits', theme: 'holy' },

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
            'Gambler': 'Utility/Luck',
            'Martyr': 'Tank/Support',
            'False Prophet': 'Control/Deception',
            'Factionist': 'Support/Buff',
            'Plaguebringer': 'Damage/Debuff',
            'Death Caller': 'Necromancy/Control',
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
            'Gambler': 'Luck Tokens',
            'Martyr': 'Sacrifice Points',
            'False Prophet': 'Deception Marks',
            'Factionist': 'Faction Influence',
            'Plaguebringer': 'Plague Stacks',
            'Death Caller': 'Soul Energy',
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

    const getClassFeatures = (className) => {
        const features = {
            'Pyrofiend': [
                { icon: 'fas fa-fire', text: 'Escalating fire damage' },
                { icon: 'fas fa-skull', text: 'Demonic corruption stages' },
                { icon: 'fas fa-chart-line', text: 'Power scaling with corruption' }
            ],
            'Minstrel': [
                { icon: 'fas fa-music', text: 'Musical spell combinations' },
                { icon: 'fas fa-users', text: 'Party buff abilities' },
                { icon: 'fas fa-magic', text: 'Harmonic resonance effects' }
            ],
            'Chronarch': [
                { icon: 'fas fa-clock', text: 'Time manipulation spells' },
                { icon: 'fas fa-undo', text: 'Temporal rewind abilities' },
                { icon: 'fas fa-hourglass', text: 'Haste and slow effects' }
            ],
            'Chaos Weaver': [
                { icon: 'fas fa-dice', text: 'Chaos dice mechanics' },
                { icon: 'fas fa-random', text: 'Unpredictable spell effects' },
                { icon: 'fas fa-bolt', text: 'Entropy-based damage' }
            ],
            'Gambler': [
                { icon: 'fas fa-coins', text: 'Luck manipulation' },
                { icon: 'fas fa-dice-d20', text: 'Risk/reward mechanics' },
                { icon: 'fas fa-star', text: 'Fortune-based abilities' }
            ],
            'Bladedancer': [
                { icon: 'fas fa-wind', text: 'Graceful combat flow' },
                { icon: 'fas fa-sword', text: 'Finesse weapon mastery' },
                { icon: 'fas fa-running', text: 'Stance-based bonuses' }
            ]
        };
        return features[className] || [
            { icon: 'fas fa-magic', text: 'Unique spell specializations' },
            { icon: 'fas fa-fist-raised', text: 'Distinctive combat abilities' },
            { icon: 'fas fa-chart-line', text: 'Progressive power scaling' }
        ];
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

    // Helper function to get starting equipment
    const getStartingEquipment = (className) => {
        const equipment = {
            'Pyrofiend': {
                weapons: ['Flame Dagger', 'Fire Staff'],
                armor: ['Scorched Robes', 'Ember Cloak'],
                tools: ['Sulfur Pouch', 'Ignition Stone'],
                consumables: ['Fire Resistance Potion', 'Burn Salve']
            },
            'Minstrel': {
                weapons: ['Enchanted Lute', 'Silver Rapier'],
                armor: ['Performer\'s Garb', 'Charismatic Cloak'],
                tools: ['Song Book', 'Tuning Fork'],
                consumables: ['Voice Elixir', 'Inspiration Scroll']
            },
            'Chronarch': {
                weapons: ['Temporal Staff', 'Time Crystal'],
                armor: ['Clockwork Robes', 'Chronometer'],
                tools: ['Hourglass', 'Time Anchor'],
                consumables: ['Haste Potion', 'Temporal Stabilizer']
            },
            'Chaos Weaver': {
                weapons: ['Chaos Orb', 'Entropy Blade'],
                armor: ['Shifting Robes', 'Probability Cloak'],
                tools: ['Dice of Fate', 'Reality Anchor'],
                consumables: ['Chaos Potion', 'Stability Elixir']
            },
            'Gambler': {
                weapons: ['Lucky Dice', 'Fortune\'s Blade'],
                armor: ['Gambler\'s Vest', 'Luck Charm'],
                tools: ['Loaded Dice', 'Card Deck'],
                consumables: ['Luck Potion', 'Risk Scroll']
            },
            'Bladedancer': {
                weapons: ['Curved Blade', 'Dancing Sword'],
                armor: ['Light Leather', 'Flowing Cloak'],
                tools: ['Whetstone', 'Balance Weights'],
                consumables: ['Agility Elixir', 'Grace Potion']
            },
            'Berserker': {
                weapons: ['Great Axe', 'War Hammer'],
                armor: ['Fur Armor', 'Rage Totem'],
                tools: ['Sharpening Stone', 'War Paint'],
                consumables: ['Rage Potion', 'Berserker Brew']
            },
            'Warden': {
                weapons: ['Guardian Spear', 'Nature\'s Shield'],
                armor: ['Bark Armor', 'Leaf Cloak'],
                tools: ['Binding Rope', 'Nature\'s Compass'],
                consumables: ['Bark Skin Potion', 'Growth Elixir']
            }
        };
        return equipment[className] || {
            weapons: ['Basic Weapon'],
            armor: ['Starting Armor'],
            tools: ['Basic Tools'],
            consumables: ['Health Potion']
        };
    };

    // Helper function to get spell schools (for caster classes)
    const getSpellSchools = (className) => {
        const schools = {
            'Pyrofiend': ['Evocation', 'Conjuration', 'Transmutation'],
            'Minstrel': ['Enchantment', 'Illusion', 'Divination'],
            'Chronarch': ['Transmutation', 'Divination', 'Abjuration'],
            'Chaos Weaver': ['Transmutation', 'Conjuration', 'Evocation'],
            'Gambler': ['Divination', 'Enchantment', 'Illusion'],
            'Bladedancer': [], // Non-caster
            'Berserker': [], // Non-caster
            'Warden': ['Abjuration', 'Transmutation', 'Conjuration']
        };
        return schools[className] || [];
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
            <div className="step-body">
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
                                        <div className="class-icon">
                                            <i className={classData.icon}></i>
                                        </div>
                                        <div className="class-info">
                                            <h4 className="class-name">{classData.name}</h4>
                                            <p className="class-description">
                                                {classData.description.length > 50 ? classData.description.substring(0, 50) + '...' : classData.description}
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
                            <div className="preview-card">
                                <div className="preview-header">
                                    <div className="preview-icon">
                                        <i className={previewClass.icon}></i>
                                    </div>
                                    <h3 className="preview-title">{previewClass.name}</h3>
                                </div>

                                <div className="preview-content">
                                    <div className="preview-section">
                                        <h4>Description</h4>
                                        <p className="class-full-description">
                                            {previewClass.description}
                                        </p>
                                    </div>

                                    <div className="preview-section">
                                        <h4>Class Details</h4>
                                        <div className="class-details-preview">
                                            <div className="detail-item">
                                                <span className="detail-label">Theme:</span>
                                                <span className="detail-value">{previewClass.theme}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Primary Role:</span>
                                                <span className="detail-value">{getClassRole(previewClass.name)}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Resource Type:</span>
                                                <span className="detail-value">{getClassResource(previewClass.name)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="preview-section">
                                        <h4>Class Features</h4>
                                        <div className="class-features">
                                            {getClassFeatures(previewClass.name).map((feature, index) => (
                                                <div key={index} className="feature-item">
                                                    <i className={feature.icon}></i>
                                                    <span>{feature.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="preview-section">
                                        <h4>Recommended Stats</h4>
                                        <div className="recommended-stats">
                                            {getRecommendedStats(previewClass.name).map((stat, index) => (
                                                <div key={index} className="stat-recommendation">
                                                    <span className="stat-name">{stat.name}</span>
                                                    <div className="stat-priority">
                                                        {Array.from({ length: 3 }, (_, i) => (
                                                            <div
                                                                key={i}
                                                                className={`priority-dot ${i < stat.priority ? 'active' : ''}`}
                                                            ></div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="preview-section">
                                        <h4>Starting Equipment</h4>
                                        <div className="starting-equipment">
                                            {Object.entries(getStartingEquipment(previewClass.name)).map(([category, items]) => (
                                                <div key={category} className="equipment-category">
                                                    <h5>
                                                        <i className={
                                                            category === 'weapons' ? 'fas fa-sword' :
                                                            category === 'armor' ? 'fas fa-shield-alt' :
                                                            category === 'tools' ? 'fas fa-tools' :
                                                            'fas fa-flask'
                                                        }></i>
                                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                                    </h5>
                                                    <ul className="equipment-list">
                                                        {items.map((item, index) => (
                                                            <li key={index} className="equipment-item">{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {getSpellSchools(previewClass.name).length > 0 && (
                                        <div className="preview-section">
                                            <h4>Spell Schools</h4>
                                            <div className="spell-schools">
                                                {getSpellSchools(previewClass.name).map((school, index) => (
                                                    <div key={index} className="spell-school">
                                                        {school}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="preview-section">
                                        <h4>Playstyle Tips</h4>
                                        <div className="playstyle-tips">
                                            <h5>
                                                <i className="fas fa-lightbulb"></i>
                                                Combat Strategy
                                            </h5>
                                            <ul>
                                                {getPlaystyleTips(previewClass.name).map((tip, index) => (
                                                    <li key={index}>{tip}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="preview-section">
                                        <h4>Multiclass Synergy</h4>
                                        <div className="multiclass-synergy">
                                            {getMulticlassSynergy(previewClass.name).map((synergy, index) => (
                                                <div key={index} className="synergy-class">
                                                    <span className="synergy-name">{synergy.name}</span>
                                                    <div className="synergy-rating">
                                                        {Array.from({ length: 5 }, (_, i) => (
                                                            <div
                                                                key={i}
                                                                className={`synergy-star ${i < synergy.rating ? 'filled' : ''}`}
                                                            ></div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="preview-placeholder">
                                <i className="fas fa-sword"></i>
                                <h3>Select a Class</h3>
                                <p>Hover over or select a class to see its details and abilities.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
            </div>
    );
};

export default Step3ClassSelection;
