/**
 * Level-Up Choice Modal
 *
 * Displays when a character levels up with a point-spending system:
 * - 2 points to spend
 * - Each choice costs 1 point:
 *   - +1 to any attribute (can pick same attribute multiple times)
 *   - +15 Maximum Health
 *   - +10 Maximum Mana
 * - Arcanoneer, Pyrofiend, Minstrel, Chronarch & Martyr: Also learn 1 spell from available options (free, doesn't cost points)
 */

import React, { useState, useMemo } from 'react';
import { ARCANONEER_DATA } from '../../data/classes/arcanoneerData';
import { PYROFIEND_DATA } from '../../data/classes/pyrofiendData';
import { MINSTREL_DATA } from '../../data/classes/minstrelData';
import { CHRONARCH_DATA } from '../../data/classes/chronarchData';
import { MARTYR_DATA } from '../../data/classes/martyrData';
import { CHAOS_WEAVER_DATA } from '../../data/classes/chaosWeaverData';
import { FATE_WEAVER_DATA } from '../../data/classes/fateWeaverData';
import UnifiedSpellCard from '../spellcrafting-wizard/components/common/UnifiedSpellCard';
import './LevelUpChoiceModal.css';

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
        // Only these classes get spell selection on level-up
        if (characterClass !== 'Arcanoneer' && characterClass !== 'Pyrofiend' && characterClass !== 'Minstrel' && characterClass !== 'Chronarch' && characterClass !== 'Martyr' && characterClass !== 'Chaos Weaver' && characterClass !== 'Fate Weaver') {
            return [];
        }

        // Get the appropriate class data
        let classData = null;
        if (characterClass === 'Arcanoneer') {
            classData = ARCANONEER_DATA;
        } else if (characterClass === 'Pyrofiend') {
            classData = PYROFIEND_DATA;
        } else if (characterClass === 'Minstrel') {
            classData = MINSTREL_DATA;
        } else if (characterClass === 'Chronarch') {
            classData = CHRONARCH_DATA;
        } else if (characterClass === 'Martyr') {
            classData = MARTYR_DATA;
        } else if (characterClass === 'Chaos Weaver') {
            classData = CHAOS_WEAVER_DATA;
        } else if (characterClass === 'Fate Weaver') {
            classData = FATE_WEAVER_DATA;
        }

        if (!classData) {
            return [];
        }

        // When leveling up to level N, show spells from level N's pool
        // First try to get spells for the exact level being reached
        let eligibleLevel = currentLevel;
        
        // If there's no pool for the exact level, find the highest level pool that is <= currentLevel
        if (!classData.spellPools[currentLevel]) {
            const poolLevels = Object.keys(classData.spellPools || {}).map(Number).sort((a, b) => b - a);
            eligibleLevel = poolLevels.find(level => level <= currentLevel);
        }

        console.log('🔍 Level-up spell selection:', {
            currentLevel,
            eligibleLevel,
            availablePools: Object.keys(classData.spellPools || {}),
            poolForCurrentLevel: classData.spellPools[currentLevel],
            knownSpells,
            characterClass
        });

        if (!eligibleLevel || !classData.spellPools[eligibleLevel]) {
            console.warn('⚠️ No spell pool found for level', eligibleLevel, 'or level', currentLevel);
            return [];
        }

        const spellIds = classData.spellPools[eligibleLevel] || [];
        // Support both 'spells' (new format) and 'exampleSpells' (legacy format)
        const allSpells = classData.spells || classData.exampleSpells || [];

        // Filter out already known spells
        const unknownSpells = allSpells.filter(spell =>
            spellIds.includes(spell.id) && !knownSpells.includes(spell.id)
        );

        // For Pyrofiend, flatten Inferno Level mechanics for spell card display
        if (characterClass === 'Pyrofiend') {
            return unknownSpells.map(spell => ({
                ...spell,
                infernoRequired: spell.specialMechanics?.infernoLevel?.required,
                infernoAscend: spell.specialMechanics?.infernoLevel?.ascendBy,
                infernoDescend: spell.specialMechanics?.infernoLevel?.descendBy
            }));
        }

        // For Minstrel, include musical combo mechanics
        if (characterClass === 'Minstrel') {
            return unknownSpells.map(spell => ({
                ...spell,
                musicalCombo: spell.specialMechanics?.musicalCombo
            }));
        }

        // For Chronarch, flatten Temporal mechanics for spell card display
        if (characterClass === 'Chronarch') {
            return unknownSpells.map(spell => ({
                ...spell,
                timeShardGenerate: spell.specialMechanics?.timeShards?.generated,
                timeShardCost: spell.specialMechanics?.temporalFlux?.shardCost,
                temporalStrainGain: spell.specialMechanics?.temporalFlux?.strainGained,
                temporalStrainReduce: spell.specialMechanics?.temporalFlux?.strainReduced
            }));
        }

        // For Martyr, flatten Devotion Level mechanics for spell card display
        if (characterClass === 'Martyr') {
            return unknownSpells.map(spell => ({
                ...spell,
                devotionRequired: spell.specialMechanics?.devotionLevel?.required,
                devotionCost: spell.specialMechanics?.devotionLevel?.cost || spell.specialMechanics?.devotionLevel?.amplifiedCost,
                devotionGain: spell.specialMechanics?.devotionLevel?.gain
            }));
        }

        // For level 2, present only 3 random options
        if (currentLevel === 2 && unknownSpells.length > 3) {
            const shuffled = [...unknownSpells].sort(() => Math.random() - 0.5);
            return shuffled.slice(0, 3);
        }

        // Return all unknown spells from the pool
        return unknownSpells;
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

        // Add spell choice if spell-casting class and spell selected
        if ((characterClass === 'Arcanoneer' || characterClass === 'Pyrofiend' || characterClass === 'Minstrel' || characterClass === 'Chronarch' || characterClass === 'Martyr') && selectedSpell) {
            result.spellId = selectedSpell;
        }

        onChoiceSelected(result);
        onClose();
    };

    const canConfirm = () => {
        // Must spend all 2 points
        if (pointsSpent !== TOTAL_POINTS) return false;

        // If spell-casting class with available spells, must select a spell
        const isSpellCaster = characterClass === 'Arcanoneer' || characterClass === 'Pyrofiend' || characterClass === 'Minstrel' || characterClass === 'Chronarch' || characterClass === 'Martyr';
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

                {/* Spell Selection (Arcanoneer, Pyrofiend, Minstrel, Chronarch & Martyr) - Like racial traits */}
                {(characterClass === 'Arcanoneer' || characterClass === 'Pyrofiend' || characterClass === 'Minstrel' || characterClass === 'Chronarch' || characterClass === 'Martyr' || characterClass === 'Chaos Weaver') && availableSpellPool.length > 0 && (
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
                                            src={`https://wow.zamimg.com/images/wow/icons/large/${spell.icon}.jpg`}
                                            alt={spell.name}
                                            className="spell-icon"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
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

