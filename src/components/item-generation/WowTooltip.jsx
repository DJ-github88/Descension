import React from 'react';
import '../../styles/wow-tooltip.css';

export default function WowTooltip({ item, onSave, onClose, position }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedItem = {
            ...item,
            name: formData.get('name'),
            quality: formData.get('quality'),
            stats: {
                strength: { value: parseInt(formData.get('strength')) || 0, isPercentage: false },
                dexterity: { value: parseInt(formData.get('dexterity')) || 0, isPercentage: false },
                constitution: { value: parseInt(formData.get('constitution')) || 0, isPercentage: false },
                intelligence: { value: parseInt(formData.get('intelligence')) || 0, isPercentage: false },
                wisdom: { value: parseInt(formData.get('wisdom')) || 0, isPercentage: false },
                charisma: { value: parseInt(formData.get('charisma')) || 0, isPercentage: false }
            },
            description: formData.get('description')
        };
        onSave(updatedItem);
    };

    return (
        <div 
            className="wow-tooltip-editor"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(20px, -50%)'
            }}
        >
            <form onSubmit={handleSubmit}>
                <div className="tooltip-header">
                    <select 
                        name="quality" 
                        defaultValue={item.quality || 'common'}
                        className={item.quality || 'common'}
                    >
                        <option value="poor">Poor</option>
                        <option value="common">Common</option>
                        <option value="uncommon">Uncommon</option>
                        <option value="rare">Rare</option>
                        <option value="epic">Epic</option>
                        <option value="legendary">Legendary</option>
                    </select>
                    <input 
                        type="text" 
                        name="name" 
                        defaultValue={item.name}
                        placeholder="Item Name"
                        className={item.quality || 'common'}
                        autoFocus
                    />
                </div>

                <div className="tooltip-stats">
                    <div className="stat-group">
                        <label>
                            <span className="stat-name">Strength</span>
                            <input 
                                type="number" 
                                name="strength"
                                defaultValue={item.stats?.strength?.value || 0}
                            />
                        </label>
                        <label>
                            <span className="stat-name">Dexterity</span>
                            <input 
                                type="number" 
                                name="dexterity"
                                defaultValue={item.stats?.dexterity?.value || 0}
                            />
                        </label>
                        <label>
                            <span className="stat-name">Constitution</span>
                            <input 
                                type="number" 
                                name="constitution"
                                defaultValue={item.stats?.constitution?.value || 0}
                            />
                        </label>
                        <label>
                            <span className="stat-name">Intelligence</span>
                            <input 
                                type="number" 
                                name="intelligence"
                                defaultValue={item.stats?.intelligence?.value || 0}
                            />
                        </label>
                        <label>
                            <span className="stat-name">Wisdom</span>
                            <input 
                                type="number" 
                                name="wisdom"
                                defaultValue={item.stats?.wisdom?.value || 0}
                            />
                        </label>
                        <label>
                            <span className="stat-name">Charisma</span>
                            <input 
                                type="number" 
                                name="charisma"
                                defaultValue={item.stats?.charisma?.value || 0}
                            />
                        </label>
                    </div>
                </div>

                <div className="tooltip-description">
                    <textarea
                        name="description"
                        defaultValue={item.description}
                        placeholder="Item description..."
                        rows={4}
                    />
                </div>

                <div className="tooltip-footer">
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
