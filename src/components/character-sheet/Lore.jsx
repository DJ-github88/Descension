import React from 'react';

export default function Lore() {
    return (
        <div className="lore-container">
            <div className="lore-section">
                <h3>Character Background</h3>
                <textarea 
                    className="lore-textarea"
                    placeholder="Write your character's background story..."
                />
            </div>
            <div className="lore-section">
                <h3>Notes</h3>
                <textarea 
                    className="lore-textarea"
                    placeholder="Add important notes about your character..."
                />
            </div>
        </div>
    );
}
