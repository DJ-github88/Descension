import React from 'react';
import useGameStore from '../store/gameStore';
import useCombatStore from '../store/combatStore';

export default function CreatureControls({ creatureId }) {
    const creature = useGameStore(state => 
        state.creatures.find(c => c.id === creatureId)
    );
    
    const {
        isInCombat,
        targetedCreature,
        isCreatureTurn
    } = useCombatStore();

    const modifyHealth = useGameStore(state => state.modifyHealth);

    if (!creature) return null;

    const isCurrentTurn = isCreatureTurn(creatureId);
    const hasTarget = targetedCreature !== null;

    const handleUseAbility = (ability) => {
        if (!hasTarget || !isCurrentTurn) return;

        try {
            creature.useAbility(ability, targetedCreature);
        } catch (error) {
            console.error('Failed to use ability:', error);
        }
    };

    return (
        <div className="creature-controls">
            <div className="creature-status">
                <h3>{creature.name}</h3>
                <div className="status-bars">
                    <div className="health-bar">
                        <div 
                            className="bar-fill health"
                            style={{ 
                                width: `${(creature.stats.currentHealth / creature.stats.maxHealth) * 100}%`
                            }}
                        />
                        <span className="bar-text">
                            {creature.stats.currentHealth}/{creature.stats.maxHealth} HP
                        </span>
                    </div>
                    <div className="mana-bar">
                        <div 
                            className="bar-fill mana"
                            style={{ 
                                width: `${(creature.stats.currentMana / creature.stats.maxMana) * 100}%`
                            }}
                        />
                        <span className="bar-text">
                            {creature.stats.currentMana}/{creature.stats.maxMana} MP
                        </span>
                    </div>
                    {isInCombat && (
                        <div className="ap-bar">
                            <div 
                                className="bar-fill ap"
                                style={{ 
                                    width: `${(creature.stats.currentActionPoints / creature.stats.maxActionPoints) * 100}%`
                                }}
                            />
                            <span className="bar-text">
                                {creature.stats.currentActionPoints}/{creature.stats.maxActionPoints} AP
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {isInCombat && isCurrentTurn && (
                <div className="combat-controls">
                    <h4>Abilities</h4>
                    <div className="ability-list">
                        {creature.abilities.map(ability => (
                            <button
                                key={ability.id}
                                className={`ability-button ${ability.canUse(creature) ? '' : 'disabled'}`}
                                onClick={() => handleUseAbility(ability)}
                                disabled={!ability.canUse(creature) || !hasTarget}
                            >
                                <div className="ability-name">{ability.name}</div>
                                <div className="ability-cost">AP: {ability.apCost}</div>
                                {ability.damage > 0 && (
                                    <div className="ability-damage">DMG: {ability.damage}</div>
                                )}
                                {ability.healing > 0 && (
                                    <div className="ability-healing">HEAL: {ability.healing}</div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="quick-actions">
                <button 
                    onClick={() => modifyHealth(creature.id, -10)}
                    className="damage-button"
                >
                    Take 10 Damage
                </button>
                <button 
                    onClick={() => modifyHealth(creature.id, 10)}
                    className="heal-button"
                >
                    Heal 10 HP
                </button>
            </div>
        </div>
    );
}
