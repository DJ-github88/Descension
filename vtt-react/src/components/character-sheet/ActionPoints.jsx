import React from 'react';
import useCharacterStore from '../../store/characterStore';

const ACTION_COSTS = {
    movement: { name: 'Movement', cost: 1, description: 'Move up to your movement speed' },
    attack: { name: 'Attack', cost: 2, description: 'Make a weapon attack' },
    cast: { name: 'Cast Spell', cost: 2, description: 'Cast a spell' },
    item: { name: 'Use Item', cost: 1, description: 'Use an item from your inventory' },
    dash: { name: 'Dash', cost: 2, description: 'Double your movement speed' },
    dodge: { name: 'Dodge', cost: 2, description: 'Take defensive stance, attacks have disadvantage' },
    hide: { name: 'Hide', cost: 2, description: 'Attempt to hide from enemies' },
    disengage: { name: 'Disengage', cost: 2, description: 'Move away without provoking attacks' },
    help: { name: 'Help', cost: 2, description: 'Aid an ally, giving them advantage' },
    ready: { name: 'Ready', cost: 2, description: 'Prepare an action for a trigger' }
};

export default function ActionPoints() {
    const { derivedStats } = useCharacterStore();
    const maxAP = derivedStats.maxActionPoints || 6;
    const currentAP = derivedStats.currentActionPoints || maxAP;

    return (
        <div className="action-points-container">
            <div className="ap-header">
                <h3>Action Points (AP)</h3>
                <div className="ap-counter">
                    <div className="ap-orbs">
                        {[...Array(maxAP)].map((_, i) => (
                            <div 
                                key={i}
                                className={`ap-orb ${i < currentAP ? 'filled' : 'empty'}`}
                            />
                        ))}
                    </div>
                    <div className="ap-text">
                        {currentAP} / {maxAP} AP
                    </div>
                </div>
            </div>

            <div className="action-list">
                <h3>Available Actions</h3>
                <div className="actions-grid">
                    {Object.entries(ACTION_COSTS).map(([key, action]) => (
                        <div key={key} className="action-item">
                            <div className="action-header">
                                <span className="action-name">{action.name}</span>
                                <span className="action-cost">{action.cost} AP</span>
                            </div>
                            <div className="action-description">
                                {action.description}
                            </div>
                            <button 
                                className="use-action-btn"
                                disabled={currentAP < action.cost}
                            >
                                Use Action
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="ap-info">
                <h3>Action Point Rules</h3>
                <ul>
                    <li>You start each turn with {maxAP} Action Points</li>
                    <li>Unused AP is lost at the end of your turn</li>
                    <li>Some effects may grant bonus AP or reduce AP costs</li>
                    <li>You can split your movement across multiple actions</li>
                    <li>Some actions may have additional requirements</li>
                </ul>
            </div>
        </div>
    );
}
