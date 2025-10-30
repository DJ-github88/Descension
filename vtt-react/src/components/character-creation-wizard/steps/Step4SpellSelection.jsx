/**
 * Step 4: Spell Selection (Arcanoneer, Pyrofiend, Minstrel & Chronarch)
 *
 * Allows spell-casting classes to select 3 starting spells from Level 1 pool
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import UnifiedSpellCard from '../../spellcrafting-wizard/components/common/UnifiedSpellCard';
import { ARCANONEER_DATA } from '../../../data/classes/arcanoneerData';
import { PYROFIEND_DATA } from '../../../data/classes/pyrofiendData';
import { MINSTREL_DATA } from '../../../data/classes/minstrelData';
import { CHRONARCH_DATA } from '../../../data/classes/chronarchData';
import '../../spellcrafting-wizard/styles/pathfinder/main.css';
import '../../spellcrafting-wizard/styles/pathfinder/components/wow-spellbook.css';
import './Step4SpellSelection.css';

const Step4SpellSelection = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const [selectedSpells, setSelectedSpells] = useState([]);
    const [viewingSpell, setViewingSpell] = useState(null);

    // Get character class
    const characterClass = state.characterData.class;

    // Classes that require spell selection
    const SPELL_CLASSES = ['Arcanoneer', 'Pyrofiend', 'Minstrel', 'Chronarch'];

    // Get Level 1 spell pool based on class
    const level1SpellPool = useMemo(() => {
        if (!SPELL_CLASSES.includes(characterClass)) return [];

        let classData = null;
        if (characterClass === 'Arcanoneer') {
            classData = ARCANONEER_DATA;
        } else if (characterClass === 'Pyrofiend') {
            classData = PYROFIEND_DATA;
        } else if (characterClass === 'Minstrel') {
            classData = MINSTREL_DATA;
        } else if (characterClass === 'Chronarch') {
            classData = CHRONARCH_DATA;
        }

        if (!classData) return [];

        const level1SpellIds = classData.spellPools?.[1] || [];
        const allSpells = classData.exampleSpells || [];

        // Filter spells that are in the level 1 pool and map class-specific mechanics
        return allSpells
            .filter(spell => level1SpellIds.includes(spell.id))
            .map(spell => ({
                ...spell,
                // Flatten Inferno Level mechanics for Pyrofiend spell cards
                infernoRequired: spell.specialMechanics?.infernoLevel?.required,
                infernoAscend: spell.specialMechanics?.infernoLevel?.ascendBy,
                infernoDescend: spell.specialMechanics?.infernoLevel?.descendBy,
                // Musical combo mechanics are already in the correct format for Minstrel
                musicalCombo: spell.specialMechanics?.musicalCombo,
                // Temporal mechanics for Chronarch spell cards (both generation and consumption)
                timeShardGenerate: spell.specialMechanics?.timeShards?.generated,
                timeShardCost: spell.specialMechanics?.temporalFlux?.shardCost,
                temporalStrainGain: spell.specialMechanics?.temporalFlux?.strainGained,
                temporalStrainReduce: spell.specialMechanics?.temporalFlux?.strainReduced
            }));
    }, [characterClass]);

    // Load existing spell selection if available
    useEffect(() => {
        if (SPELL_CLASSES.includes(characterClass)) {
            // Check if spells are already selected
            const existingSpells = state.characterData.class_spells?.known_spells || [];

            if (existingSpells.length > 0) {
                // Load existing selection
                setSelectedSpells(existingSpells);
            }
        }
    }, [characterClass, state.characterData.class_spells]);

    // If not a spell-casting class, skip this step
    if (!SPELL_CLASSES.includes(characterClass)) {
        return (
            <div className="wizard-step spell-selection-step">
                <div className="step-header">
                    <h2>Starting Spells</h2>
                    <p className="step-description">
                        This step is only for spell-casting classes (Arcanoneer, Pyrofiend, Minstrel). You can proceed to the next step.
                    </p>
                </div>
            </div>
        );
    }

    // Fallback spell pool if data not found
    const displaySpellPool = level1SpellPool.length > 0 ? level1SpellPool : [
        {
            id: 'arc_minor_arcane_bolt',
            name: 'Minor Arcane Bolt',
            description: 'A basic arcane projectile',
            icon: 'spell_arcane_blast',
            spellType: 'ACTION',
            school: 'Evocation',
            level: 1,
            sphereCost: ['Arcane'],
            typeConfig: { castTime: 1, castTimeType: 'ACTION' },
            targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 60 },
            durationConfig: { durationType: 'instant' },
            resourceCost: { mana: 3, spheres: ['Arcane'] },
            resolution: 'ATTACK',
            damageConfig: { formula: '1d6', damageType: 'force' },
            tags: ['1-sphere', 'arcane', 'force', 'single-target']
        },
        {
            id: 'arc_flame_spark',
            name: 'Flame Spark',
            description: 'A small burst of fire',
            icon: 'spell_fire_flamebolt',
            spellType: 'ACTION',
            school: 'Evocation',
            level: 1,
            sphereCost: ['Fire'],
            typeConfig: { castTime: 1, castTimeType: 'ACTION' },
            targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30 },
            durationConfig: { durationType: 'instant' },
            resourceCost: { mana: 3, spheres: ['Fire'] },
            resolution: 'SAVE',
            saveConfig: { saveType: 'dexterity', saveDC: 12, onSaveEffect: 'half' },
            damageConfig: { formula: '1d8', damageType: 'fire' },
            tags: ['1-sphere', 'fire', 'single-target']
        },
        {
            id: 'arc_frost_touch',
            name: 'Frost Touch',
            description: 'A chilling touch that slows enemies',
            icon: 'spell_frost_frostbolt02',
            spellType: 'ACTION',
            school: 'Evocation',
            level: 1,
            sphereCost: ['Ice'],
            typeConfig: { castTime: 1, castTimeType: 'ACTION' },
            targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5 },
            durationConfig: { durationType: 'rounds', durationAmount: 2 },
            resourceCost: { mana: 3, spheres: ['Ice'] },
            resolution: 'ATTACK',
            damageConfig: { formula: '1d4', damageType: 'cold' },
            effects: {
                debuff: {
                    type: 'speed_reduction',
                    value: -10,
                    duration: 2
                }
            },
            tags: ['1-sphere', 'ice', 'cold', 'debuff']
        },
        {
            id: 'arc_healing_light',
            name: 'Healing Light',
            description: 'A gentle healing glow',
            icon: 'spell_holy_flashheal',
            spellType: 'ACTION',
            school: 'Restoration',
            level: 1,
            sphereCost: ['Healing'],
            typeConfig: { castTime: 1, castTimeType: 'ACTION' },
            targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5 },
            durationConfig: { durationType: 'instant' },
            resourceCost: { mana: 4, spheres: ['Healing'] },
            resolution: 'AUTO',
            healingConfig: { formula: '1d6+2', healingType: 'direct' },
            tags: ['1-sphere', 'healing', 'support']
        },
        {
            id: 'arc_nature_growth',
            name: 'Nature\'s Growth',
            description: 'Summon minor plant growth',
            icon: 'spell_nature_naturetouchgrow',
            spellType: 'ACTION',
            school: 'Conjuration',
            level: 1,
            sphereCost: ['Nature'],
            typeConfig: { castTime: 1, castTimeType: 'ACTION' },
            targetingConfig: { targetingType: 'ground', rangeType: 'ranged', rangeDistance: 30, aoeType: 'circle', aoeSize: 10 },
            durationConfig: { durationType: 'minutes', durationAmount: 10 },
            resourceCost: { mana: 3, spheres: ['Nature'] },
            resolution: 'AUTO',
            effects: {
                terrain: {
                    type: 'difficult_terrain',
                    duration: 10
                }
            },
            tags: ['1-sphere', 'nature', 'terrain', 'control']
        },
        {
            id: 'arc_shadow_veil',
            name: 'Shadow Veil',
            description: 'Cloak yourself in shadows',
            icon: 'spell_shadow_charm',
            spellType: 'ACTION',
            school: 'Illusion',
            level: 1,
            sphereCost: ['Shadow'],
            typeConfig: { castTime: 1, castTimeType: 'ACTION' },
            targetingConfig: { targetingType: 'self', rangeType: 'self' },
            durationConfig: { durationType: 'minutes', durationAmount: 5 },
            resourceCost: { mana: 4, spheres: ['Shadow'] },
            resolution: 'AUTO',
            effects: {
                buff: {
                    type: 'stealth_bonus',
                    value: 5,
                    duration: 5
                }
            },
            tags: ['1-sphere', 'shadow', 'stealth', 'utility']
        }
    ];

    const handleSpellToggle = (spellId) => {
        setSelectedSpells(prev => {
            let newSelection;
            if (prev.includes(spellId)) {
                // Deselect
                newSelection = prev.filter(id => id !== spellId);
            } else {
                // Select (max 3)
                if (prev.length >= 3) {
                    return prev; // Don't allow more than 3
                }
                newSelection = [...prev, spellId];
            }
            
            // Update wizard state
            dispatch(wizardActionCreators.setStartingSpells(newSelection));
            return newSelection;
        });
    };

    const handleSpellView = (spellId) => {
        setViewingSpell(spellId);
    };

    const currentSpell = viewingSpell ? displaySpellPool.find(s => s.id === viewingSpell) : null;

    // Get class-specific description
    const getClassDescription = () => {
        if (characterClass === 'Arcanoneer') {
            return 'Select 3 spells from the Level 1 spell pool to begin your journey as an Arcanoneer. These spells will form the foundation of your sphere-combining arsenal.';
        } else if (characterClass === 'Pyrofiend') {
            return 'Select 3 spells from the Level 1 spell pool to begin your journey as a Pyrofiend. These spells will help you master the Inferno Veil and demonic fire.';
        } else if (characterClass === 'Minstrel') {
            return 'Select 3 spells from the Level 1 spell pool to begin your journey as a Minstrel. These spells will help you build musical notes and perform powerful cadences.';
        } else if (characterClass === 'Chronarch') {
            return 'Select 3 spells from the Level 1 spell pool to begin your journey as a Chronarch. These spells will help you generate Time Shards and manage Temporal Strain.';
        }
        return 'Select 3 starting spells for your character.';
    };

    return (
        <div className="wizard-step spell-selection-step">
            <div className="step-header">
                <h2>Choose Your Starting Spells</h2>
                <p className="step-description">
                    {getClassDescription()}
                </p>
                <div className="selection-counter">
                    <span className={selectedSpells.length === 3 ? 'complete' : 'incomplete'}>
                        {selectedSpells.length} / 3 spells selected
                    </span>
                </div>
            </div>

            <div className="spell-selection-layout">
                {/* Left: Spell Icon Grid */}
                <div className="spell-icons-column">
                    <h4 className="spell-category-title">
                        <i className="fas fa-magic"></i> Level 1 Spells
                    </h4>
                    <div className="spell-icon-grid">
                        {displaySpellPool.map(spell => {
                            const isSelected = selectedSpells.includes(spell.id);
                            const isViewing = viewingSpell === spell.id;

                            return (
                                <div
                                    key={spell.id}
                                    className={`spell-icon-card ${isSelected ? 'selected' : ''} ${isViewing ? 'viewing' : ''}`}
                                    onClick={() => handleSpellView(spell.id)}
                                    title={spell.name}
                                >
                                    <div className="spell-icon-image">
                                        <img
                                            src={`https://wow.zamimg.com/images/wow/icons/large/${spell.icon}.jpg`}
                                            alt={spell.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                                            }}
                                        />
                                        {isSelected && (
                                            <div className="selection-checkmark">
                                                <i className="fas fa-check-circle"></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className="spell-icon-name">{spell.name}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Spell Detail Card */}
                <div className="spell-detail-column">
                    {currentSpell ? (
                        <>
                            <UnifiedSpellCard
                                spell={currentSpell}
                                variant="rules"
                                showActions={false}
                            />
                            <div className="spell-action-buttons">
                                <button
                                    className={`spell-select-btn ${selectedSpells.includes(currentSpell.id) ? 'selected' : ''}`}
                                    onClick={() => handleSpellToggle(currentSpell.id)}
                                    disabled={!selectedSpells.includes(currentSpell.id) && selectedSpells.length >= 3}
                                >
                                    {selectedSpells.includes(currentSpell.id) ? (
                                        <>
                                            <i className="fas fa-check-circle"></i> Selected
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-plus-circle"></i> Select Spell
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="no-spell-selected">
                            <i className="fas fa-hand-pointer"></i>
                            <p>Click a spell icon to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Step4SpellSelection;

