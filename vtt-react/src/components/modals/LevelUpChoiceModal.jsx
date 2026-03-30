/**
 * Level-Up Choice Modal
 *
 * Displays when a character levels up with a point-spending system:
 * - 2 points to spend
 * - Each choice costs 1 point:
 *   - +1 to any attribute (can pick same attribute multiple times)
 *   - +15 Maximum Health
 *   - +10 Maximum Mana
 * - All classes: Also learn 1 spell from available options (free, doesn't cost points)
 */

import React, { useState, useMemo } from 'react';
// Import all class data
import { ARCANONEER_DATA } from '../../data/classes/arcanoneerData';
import { BERSERKER_DATA } from '../../data/classes/berserkerData';
import { BLADEDANCER_DATA } from '../../data/classes/bladedancerData';
import { CHAOS_WEAVER_DATA } from '../../data/classes/chaosWeaverData';
import { CHRONARCH_DATA } from '../../data/classes/chronarchData';
import { COVENBANE_DATA } from '../../data/classes/covenbaneData';
import { DEATHCALLER_DATA } from '../../data/classes/deathcallerData';
import { DREADNAUGHT_DATA } from '../../data/classes/dreadnaughtData';
import { EXORCIST_DATA } from '../../data/classes/exorcistData';
import { FALSE_PROPHET_DATA } from '../../data/classes/falseProphetData';
import { FATE_WEAVER_DATA } from '../../data/classes/fateWeaverData';
import { FORMBENDER_DATA } from '../../data/classes/formbenderData';
import { GAMBLER_DATA } from '../../data/classes/gamblerData';
import { HUNTRESS_DATA } from '../../data/classes/huntressData';
import { INSCRIPTOR_DATA } from '../../data/classes/inscriptorData';
import { LICHBORNE_DATA } from '../../data/classes/lichborneData';
import { LUNARCH_DATA } from '../../data/classes/lunarchData';
import { MARTYR_DATA } from '../../data/classes/martyrData';
import { MINSTREL_DATA } from '../../data/classes/minstrelData';
import { ORACLE_DATA } from '../../data/classes/oracleData';
import { PLAGUEBRINGER_DATA } from '../../data/classes/plaguebringerData';
import { PRIMALIST_DATA } from '../../data/classes/primalistData';
import { PYROFIEND_DATA } from '../../data/classes/pyrofiendData';
import { SPELLGUARD_DATA } from '../../data/classes/spellguardData';
import { TITAN_DATA } from '../../data/classes/titanData';
import { TOXICOLOGIST_DATA } from '../../data/classes/toxicologistData';
import { WARDEN_DATA } from '../../data/classes/wardenData';
import { WITCH_DOCTOR_DATA } from '../../data/classes/witchDoctorData';
import UnifiedSpellCard from '../spellcrafting-wizard/components/common/UnifiedSpellCard';
import { getIconUrl } from '../../utils/assetManager';
import './LevelUpChoiceModal.css';

// Map of class names to their data
const CLASS_DATA_MAP = {
    'Arcanoneer': ARCANONEER_DATA,
    'Berserker': BERSERKER_DATA,
    'Bladedancer': BLADEDANCER_DATA,
    'Chaos Weaver': CHAOS_WEAVER_DATA,
    'Chronarch': CHRONARCH_DATA,
    'Covenbane': COVENBANE_DATA,
    'Deathcaller': DEATHCALLER_DATA,
    'Dreadnaught': DREADNAUGHT_DATA,
    'Exorcist': EXORCIST_DATA,
    'False Prophet': FALSE_PROPHET_DATA,
    'Fate Weaver': FATE_WEAVER_DATA,
    'Formbender': FORMBENDER_DATA,
    'Gambler': GAMBLER_DATA,
    'Huntress': HUNTRESS_DATA,
    'Inscriptor': INSCRIPTOR_DATA,
    'Lichborne': LICHBORNE_DATA,
    'Lunarch': LUNARCH_DATA,
    'Martyr': MARTYR_DATA,
    'Minstrel': MINSTREL_DATA,
    'Oracle': ORACLE_DATA,
    'Plaguebringer': PLAGUEBRINGER_DATA,
    'Primalist': PRIMALIST_DATA,
    'Pyrofiend': PYROFIEND_DATA,
    'Spellguard': SPELLGUARD_DATA,
    'Titan': TITAN_DATA,
    'Toxicologist': TOXICOLOGIST_DATA,
    'Warden': WARDEN_DATA,
    'Witch Doctor': WITCH_DOCTOR_DATA
};

// All classes that have spells
const SPELL_CLASSES = Object.keys(CLASS_DATA_MAP);

// Helper function to get level spell IDs from class data for a specific level
const getLevelSpellIds = (classData, level) => {
    if (!classData) return [];
    
    // First try spellPools for the specific level
    if (classData.spellPools && classData.spellPools[level]) {
        return classData.spellPools[level];
    }
    
    // For levels without specific pools, check if there's a pool for a lower level
    if (classData.spellPools) {
        const poolLevels = Object.keys(classData.spellPools).map(Number).sort((a, b) => b - a);
        const eligibleLevel = poolLevels.find(l => l <= level);
        if (eligibleLevel) {
            return classData.spellPools[eligibleLevel];
        }
    }
    
    // Fallback: filter spells/exampleSpells array for spells of this level
    const spellsArray = classData.spells || classData.exampleSpells || [];
    if (Array.isArray(spellsArray) && spellsArray.length > 0) {
        return spellsArray
            .filter(spell => {
                const spellLevel = spell.level || 1;
                return spellLevel === level;
            })
            .map(spell => spell.id)
            .filter(id => id); // Remove any undefined/null IDs
    }
    
    return [];
};

const LevelUpChoiceModal = ({
    isOpen,
    onClose,
    characterClass,
    currentLevel,
    knownSpells = [],
    onChoiceSelected
}) => {
    // Point-spending system: 2 points total
    const [choices, setChoices] = useState([]); // Array of choice objects: { type: 'attribute'|'health'|'mana', value: 'strength'|null }
    const [selectedSpell, setSelectedSpell] = useState(null);
    const [viewingSpell, setViewingSpell] = useState(null);

    const TOTAL_POINTS = 2;
    const pointsSpent = choices.length;
    const pointsRemaining = TOTAL_POINTS - pointsSpent;

    // Determine which spell pool to use based on level
    const availableSpellPool = useMemo(() => {
        // Check if class is in our spell classes list
        if (!SPELL_CLASSES.includes(characterClass)) {
            return [];
        }

        // Try to get spells from ALL_CLASS_SPELLS first (to ensure IDs match)
        let availableSpells = [];
        try {
            const { ALL_CLASS_SPELLS } = require('../../data/classSpellGenerator');
            availableSpells = ALL_CLASS_SPELLS[characterClass] || [];
            
            console.log('🔍 [Level-Up] Using ALL_CLASS_SPELLS:', {
                characterClass,
                currentLevel,
                totalSpells: availableSpells.length,
                sampleSpellIds: availableSpells.map(s => s.id).slice(0, 10)
            });
        } catch (e) {
            console.warn('Could not load ALL_CLASS_SPELLS, using classData:', e);
        }

        // Get the appropriate class data for fallback
        const classData = CLASS_DATA_MAP[characterClass];
        if (!classData && availableSpells.length === 0) {
            return [];
        }

        // When leveling up to level N, show spells from level N
        // Filter to spells of the current level
        let levelSpells = [];
        if (availableSpells.length > 0) {
            // Use ALL_CLASS_SPELLS
            levelSpells = availableSpells.filter(spell => {
                const spellLevel = spell.level || 1;
                return spellLevel === currentLevel;
            });
        } else {
            // Fallback to classData
            const spellIds = getLevelSpellIds(classData, currentLevel);
            const allSpells = classData.spells || classData.exampleSpells || [];
            levelSpells = allSpells.filter(spell =>
                spellIds.includes(spell.id)
            );
        }
        
        console.log('🔍 [Level-Up] Level spells found:', {
            currentLevel,
            characterClass,
            levelSpellsCount: levelSpells.length,
            levelSpellIds: levelSpells.map(s => s.id),
            knownSpellsCount: knownSpells.length
        });

        if (levelSpells.length === 0) {
            console.warn('⚠️ No spells found for level', currentLevel, 'for class', characterClass);
            return [];
        }

        // Filter out already known spells
        const unknownSpells = levelSpells.filter(spell =>
            !knownSpells.includes(spell.id)
        );
        
        console.log('🔍 [Level-Up] Unknown spells:', {
            unknownCount: unknownSpells.length,
            unknownSpellIds: unknownSpells.map(s => s.id)
        });

        // Process spells for special class mechanics
        let processedSpells = unknownSpells;
        
        // For Pyrofiend, flatten Inferno Level mechanics for spell card display
        if (characterClass === 'Pyrofiend') {
            processedSpells = unknownSpells.map(spell => ({
                ...spell,
                infernoRequired: spell.specialMechanics?.infernoLevel?.required,
                infernoAscend: spell.specialMechanics?.infernoLevel?.ascendBy,
                infernoDescend: spell.specialMechanics?.infernoLevel?.descendBy
            }));
        }
        // For Minstrel, include musical combo mechanics
        else if (characterClass === 'Minstrel') {
            processedSpells = unknownSpells.map(spell => ({
                ...spell,
                musicalCombo: spell.specialMechanics?.musicalCombo
            }));
        }
        // For Chronarch, flatten Temporal mechanics for spell card display
        else if (characterClass === 'Chronarch') {
            processedSpells = unknownSpells.map(spell => ({
                ...spell,
                timeShardGenerate: spell.specialMechanics?.timeShards?.generated,
                timeShardCost: spell.specialMechanics?.temporalFlux?.shardCost,
                temporalStrainGain: spell.specialMechanics?.temporalFlux?.strainGained,
                temporalStrainReduce: spell.specialMechanics?.temporalFlux?.strainReduced
            }));
        }
        // For Martyr, flatten Devotion Level mechanics for spell card display
        else if (characterClass === 'Martyr') {
            processedSpells = unknownSpells.map(spell => ({
                ...spell,
                devotionRequired: spell.specialMechanics?.devotionLevel?.required,
                devotionCost: spell.specialMechanics?.devotionLevel?.cost || spell.specialMechanics?.devotionLevel?.amplifiedCost,
                devotionGain: spell.specialMechanics?.devotionLevel?.gain
            }));
        }

        // For level 2, present only 3 random options
        if (currentLevel === 2 && processedSpells.length > 3) {
            const shuffled = [...processedSpells].sort(() => Math.random() - 0.5);
            return shuffled.slice(0, 3);
        }

        // Return all unknown spells from the pool
        return processedSpells;
    }, [characterClass, currentLevel, knownSpells]);

    // Helper functions for point spending
    const addChoice = (type, value = null) => {
        if (pointsRemaining > 0) {
            setChoices([...choices, { type, value }]);
        }
    };

    const removeChoice = (index) => {
        setChoices(choices.filter((_, i) => i !== index));
    };

    const handleConfirm = () => {
        // Count up the choices
        const healthCount = choices.filter(c => c.type === 'health').length;
        const manaCount = choices.filter(c => c.type === 'mana').length;
        const attributeChoices = choices.filter(c => c.type === 'attribute').map(c => c.value);

        const result = {
            healthIncrease: healthCount * 15, // Each health choice = +15 max HP
            manaIncrease: manaCount * 10,     // Each mana choice = +10 max Mana
            attributes: attributeChoices       // Array of attribute names
        };

        // Add spell choice if class has spells and spell selected
        if (SPELL_CLASSES.includes(characterClass) && selectedSpell) {
            result.spellId = selectedSpell;
        }

        onChoiceSelected(result);
        onClose();
    };

    const canConfirm = () => {
        // Must spend all 2 points
        if (pointsSpent !== TOTAL_POINTS) return false;

        // If class has available spells, must select a spell
        const isSpellCaster = SPELL_CLASSES.includes(characterClass);
        if (isSpellCaster && availableSpellPool.length > 0 && !selectedSpell) return false;

        return true;
    };

    if (!isOpen) return null;

    const currentSpell = viewingSpell ? availableSpellPool.find(s => s.id === viewingSpell) : null;

    console.log('🎉 Level-Up Modal Opened:', {
        currentLevel,
        characterClass,
        availableSpellPoolCount: availableSpellPool.length,
        knownSpellsCount: knownSpells.length
    });

    return (
        <div className="level-up-modal-overlay">
            <div className="level-up-modal">
                <div className="level-up-header">
                    <h2>🎉 Level Up! You reached Level {currentLevel}</h2>
                    <p>You have <strong>{pointsRemaining}</strong> point{pointsRemaining !== 1 ? 's' : ''} remaining to spend</p>
                </div>

                {/* Spell Selection (All Classes) - Like racial traits */}
                {SPELL_CLASSES.includes(characterClass) && availableSpellPool.length > 0 && (
                    <div className="spell-selection-section">
                        <h3><i className="fas fa-magic"></i> Learn a New Spell</h3>
                        <p className="section-description">Click a spell icon to view details, then select one to learn:</p>
                        <div className="spell-options-layout">
                            <div className="spell-icons-row">
                                {availableSpellPool.map(spell => (
                                    <div
                                        key={spell.id}
                                        className={`spell-icon-wrapper ${selectedSpell === spell.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedSpell(spell.id)}
                                    >
                                        <img
                                            src={getIconUrl(spell.icon, 'abilities')}
                                            alt={spell.name}
                                            className="spell-icon"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = getIconUrl('Utility/Utility', 'abilities');
                                            }}
                                            onMouseEnter={() => setViewingSpell(spell.id)}
                                        />
                                        {selectedSpell === spell.id && (
                                            <div className="selection-check">
                                                <i className="fas fa-check-circle"></i>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {viewingSpell && availableSpellPool.find(s => s.id === viewingSpell) && (
                                <div className="spell-card-preview">
                                    <UnifiedSpellCard
                                        spell={availableSpellPool.find(s => s.id === viewingSpell)}
                                        variant="library"
                                        showActions={false}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Point Spending Section */}
                <div className="point-spending-section">
                    <h3>Spend Your Points ({pointsSpent}/{TOTAL_POINTS})</h3>
                    <p className="section-description">Each choice costs 1 point. Choose wisely.</p>

                    {/* Compact current selections (chips) for quick review and adjustment */}
                    {choices.length > 0 && (
                        <div className="current-choices compact" style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            marginBottom: '10px'
                        }}>
                            {choices.map((choice, index) => (
                                <div
                                    key={index}
                                    className="choice-chip"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '4px 8px',
                                        background: 'var(--pf-parchment-light)',
                                        border: '1px solid var(--pf-brown-medium)',
                                        borderRadius: '14px',
                                        fontSize: '12px'
                                    }}
                                >
                                    <span>
                                        {choice.type === 'health' && '+15 Max Health'}
                                        {choice.type === 'mana' && '+10 Max Mana'}
                                        {choice.type === 'attribute' && `+1 ${choice.value.charAt(0).toUpperCase() + choice.value.slice(1)}`}
                                    </span>
                                    <button
                                        className="remove-choice-btn"
                                        onClick={() => removeChoice(index)}
                                        title="Remove this choice"
                                        style={{
                                            border: 'none',
                                            background: 'transparent',
                                            cursor: 'pointer',
                                            color: 'var(--pf-brown-dark)'
                                        }}
                                        aria-label="Remove selection"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Available Choices */}
                    {/* Always show choices; disable buttons when no points remain */}
                    <div className="available-choices">
                            <h4>Available Choices (1 point each):</h4>

                            {/* Resource Choices */}
                            <div className="choice-category">
                                <h5>Resources:</h5>
                                <div className="choice-buttons">
                                    {(() => {
                                        const healthSelectedCount = choices.filter(c => c.type === 'health').length;
                                        const manaSelectedCount = choices.filter(c => c.type === 'mana').length;
                                        const triangleOverlay = (count) => count > 0 && (
                                            <>
                                                {/* Corner triangle */}
                                                <span
                                                    aria-hidden="true"
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 0,
                                                        width: 0,
                                                        height: 0,
                                                        borderTop: '18px solid var(--pf-green)',
                                                        borderLeft: '18px solid transparent'
                                                    }}
                                                />
                                                {/* Check symbol on triangle */}
                                                <span
                                                    aria-hidden="true"
                                                    style={{
                                                        position: 'absolute',
                                                        top: 1,
                                                        right: 2,
                                                        color: '#fff',
                                                        fontSize: '12px',
                                                        fontWeight: 700
                                                    }}
                                                >
                                                    ✓{count > 1 ? `x${count}` : ''}
                                                </span>
                                            </>
                                        );
                                        return (
                                            <>
                                                <button
                                                    className={`choice-btn health ${healthSelectedCount > 0 ? 'selected' : ''}`}
                                                    onClick={() => addChoice('health')}
                                                    style={{ position: 'relative' }}
                                                    disabled={pointsRemaining === 0}
                                                >
                                                    <span>+15 Max Health</span>
                                                    {triangleOverlay(healthSelectedCount)}
                                                </button>
                                                <button
                                                    className={`choice-btn mana ${manaSelectedCount > 0 ? 'selected' : ''}`}
                                                    onClick={() => addChoice('mana')}
                                                    style={{ position: 'relative' }}
                                                    disabled={pointsRemaining === 0}
                                                >
                                                    <span>+10 Max Mana</span>
                                                    {triangleOverlay(manaSelectedCount)}
                                                </button>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>

                            {/* Attribute Choices */}
                            <div className="choice-category">
                                <h5>Attributes:</h5>
                                <div className="choice-buttons attributes">
                                    {['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma'].map(attr => {
                                        const count = choices.filter(c => c.type === 'attribute' && c.value === attr).length;
                                        return (
                                            <button
                                                key={attr}
                                                className={`choice-btn attribute ${count > 0 ? 'selected' : ''}`}
                                                onClick={() => addChoice('attribute', attr)}
                                                style={{ position: 'relative' }}
                                                disabled={pointsRemaining === 0}
                                            >
                                                <span>+1 {attr.charAt(0).toUpperCase() + attr.slice(1)}</span>
                                                {count > 0 && (
                                                    <>
                                                        <span
                                                            aria-hidden="true"
                                                            style={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                right: 0,
                                                                width: 0,
                                                                height: 0,
                                                                borderTop: '18px solid var(--pf-green)',
                                                                borderLeft: '18px solid transparent'
                                                            }}
                                                        />
                                                        <span
                                                            aria-hidden="true"
                                                            style={{
                                                                position: 'absolute',
                                                                top: 1,
                                                                right: 2,
                                                                color: '#fff',
                                                                fontSize: '12px',
                                                                fontWeight: 700
                                                            }}
                                                        >
                                                            ✓{count > 1 ? `x${count}` : ''}
                                                        </span>
                                                    </>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                </div>

                {/* Action Buttons */}
                <div className="level-up-actions">
                    <button
                        className="confirm-btn"
                        onClick={handleConfirm}
                        disabled={!canConfirm()}
                    >
                        <i className="fas fa-check"></i> Confirm Choice
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LevelUpChoiceModal;

