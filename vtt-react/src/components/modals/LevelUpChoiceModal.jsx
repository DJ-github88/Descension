/**
 * Level-Up Choice Modal
 *
 * Displays when a character levels up with a point-spending system:
 * - 2 points to spend
 * - Each choice costs 1 point:
 *   - +1 to any attribute (can pick same attribute multiple times)
 *   - +15 Maximum Health
 *   - +10 Maximum Mana
 * - Arcanoneer: Also learn 1 spell from 3 random options (free, doesn't cost points)
 */

import React, { useState, useMemo } from 'react';
import { ARCANONEER_DATA } from '../../data/classes/arcanoneerData';
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
        if (characterClass !== 'Arcanoneer') {
            return [];
        }

        // Find the highest level pool that is <= currentLevel
        const poolLevels = [1, 2, 4, 6, 8, 10, 12, 15, 18, 20];
        const eligibleLevel = [...poolLevels].reverse().find(level => level <= currentLevel);

        console.log('🔍 Level-up spell selection:', {
            currentLevel,
            eligibleLevel,
            poolLevels,
            knownSpells
        });

        if (!eligibleLevel) {
            return [];
        }

        const spellIds = ARCANONEER_DATA.spellPools[eligibleLevel] || [];
        const allSpells = ARCANONEER_DATA.exampleSpells || [];

        // Filter out already known spells
        const unknownSpells = allSpells.filter(spell =>
            spellIds.includes(spell.id) && !knownSpells.includes(spell.id)
        );

        // Return all unknown spells from the pool (no random selection)
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

        // Add spell choice if Arcanoneer and spell selected
        if (characterClass === 'Arcanoneer' && selectedSpell) {
            result.spellId = selectedSpell;
        }

        onChoiceSelected(result);
        onClose();
    };

    const canConfirm = () => {
        // Must spend all 2 points
        if (pointsSpent !== TOTAL_POINTS) return false;

        // If Arcanoneer with available spells, must select a spell
        if (characterClass === 'Arcanoneer' && availableSpellPool.length > 0 && !selectedSpell) return false;

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

                {/* Spell Selection (Arcanoneer only) - Like racial traits */}
                {characterClass === 'Arcanoneer' && availableSpellPool.length > 0 && (
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
                    <h3><i className="fas fa-coins"></i> Spend Your Points ({pointsSpent}/{TOTAL_POINTS})</h3>
                    <p className="section-description">Each choice costs 1 point. Choose wisely!</p>

                    {/* Current Choices Display */}
                    {choices.length > 0 && (
                        <div className="current-choices">
                            <h4>Current Selections:</h4>
                            <div className="choices-list">
                                {choices.map((choice, index) => (
                                    <div key={index} className="choice-item">
                                        <span>
                                            {choice.type === 'health' && '❤️ +15 Maximum Health'}
                                            {choice.type === 'mana' && '💙 +10 Maximum Mana'}
                                            {choice.type === 'attribute' && `📊 +1 ${choice.value.charAt(0).toUpperCase() + choice.value.slice(1)}`}
                                        </span>
                                        <button
                                            className="remove-choice-btn"
                                            onClick={() => removeChoice(index)}
                                            title="Remove this choice"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Available Choices */}
                    {pointsRemaining > 0 && (
                        <div className="available-choices">
                            <h4>Available Choices (1 point each):</h4>

                            {/* Resource Choices */}
                            <div className="choice-category">
                                <h5>Resources:</h5>
                                <div className="choice-buttons">
                                    <button
                                        className="choice-btn health"
                                        onClick={() => addChoice('health')}
                                    >
                                        <i className="fas fa-heart"></i>
                                        <span>+15 Max Health</span>
                                    </button>
                                    <button
                                        className="choice-btn mana"
                                        onClick={() => addChoice('mana')}
                                    >
                                        <i className="fas fa-flask"></i>
                                        <span>+10 Max Mana</span>
                                    </button>
                                </div>
                            </div>

                            {/* Attribute Choices */}
                            <div className="choice-category">
                                <h5>Attributes:</h5>
                                <div className="choice-buttons attributes">
                                    {['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma'].map(attr => (
                                        <button
                                            key={attr}
                                            className="choice-btn attribute"
                                            onClick={() => addChoice('attribute', attr)}
                                        >
                                            <i className={`fas fa-${
                                                attr === 'strength' ? 'dumbbell' :
                                                attr === 'agility' ? 'running' :
                                                attr === 'constitution' ? 'shield-alt' :
                                                attr === 'intelligence' ? 'brain' :
                                                attr === 'spirit' ? 'dove' : 'star'
                                            }`}></i>
                                            <span>+1 {attr.charAt(0).toUpperCase() + attr.slice(1)}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
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

