import React from 'react';
import useCombatStore from '../store/combatStore';
import useGameStore from '../store/gameStore';

export default function CombatTracker() {
    const {
        isInCombat,
        round,
        turnOrder,
        currentTurnIndex,
        selectedCreature,
        targetedCreature,
        nextTurn,
        endCombat,
        selectCreature,
        targetCreature
    } = useCombatStore();

    const creatures = useGameStore(state => state.creatures);
    const startCombat = useCombatStore(state => state.startCombat);

    if (!isInCombat) {
        return (
            <div className="combat-tracker">
                <h2>Combat Tracker</h2>
                <button 
                    className="start-combat-button"
                    onClick={() => startCombat(creatures)}
                >
                    Start Combat
                </button>
            </div>
        );
    }

    const currentCreature = turnOrder[currentTurnIndex];

    return (
        <div className="combat-tracker">
            <div className="combat-header">
                <h2>Combat Round {round}</h2>
                <button 
                    className="end-combat-button"
                    onClick={endCombat}
                >
                    End Combat
                </button>
            </div>

            <div className="turn-order">
                {turnOrder.map((creature, index) => (
                    <div 
                        key={creature.id}
                        className={`
                            creature-turn-item
                            ${index === currentTurnIndex ? 'active' : ''}
                            ${creature.id === selectedCreature ? 'selected' : ''}
                            ${creature.id === targetedCreature ? 'targeted' : ''}
                        `}
                        onClick={() => selectCreature(creature.id)}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            targetCreature(creature.id);
                        }}
                    >
                        <div className="creature-initiative">
                            {creature.initiative}
                        </div>
                        <div className="creature-info">
                            <div className="creature-name">
                                {creature.name}
                            </div>
                            <div className="creature-stats">
                                <span>HP: {creature.stats.currentHealth}/{creature.stats.maxHealth}</span>
                                <span>AP: {creature.stats.currentActionPoints}/{creature.stats.maxActionPoints}</span>
                            </div>
                        </div>
                        {index === currentTurnIndex && (
                            <div className="active-marker">→</div>
                        )}
                    </div>
                ))}
            </div>

            {currentCreature && (
                <div className="current-turn">
                    <h3>Current Turn: {currentCreature.name}</h3>
                    <div className="action-points">
                        AP: {currentCreature.stats.currentActionPoints}/{currentCreature.stats.maxActionPoints}
                    </div>
                    <button 
                        className="next-turn-button"
                        onClick={nextTurn}
                    >
                        End Turn
                    </button>
                </div>
            )}
        </div>
    );
}
