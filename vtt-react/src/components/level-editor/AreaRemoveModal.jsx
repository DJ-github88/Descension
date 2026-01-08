import React from 'react';
import './styles/AreaRemoveModal.css';

const AreaRemoveModal = ({ isOpen, onClose, onRemove, selectedObjects }) => {
    if (!isOpen || !selectedObjects) return null;

    const handleRemove = (removeType) => {
        onRemove(removeType);
        onClose();
    };

    const totalCount = 
        selectedObjects.tokens.length +
        selectedObjects.characterTokens.length +
        selectedObjects.items.length +
        selectedObjects.environmentalObjects.length +
        selectedObjects.walls.length +
        selectedObjects.drawings.length +
        (selectedObjects.terrainTiles?.length || 0);

    return (
        <div className="area-remove-modal-overlay" onClick={onClose}>
            <div className="area-remove-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="area-remove-modal-header">
                    <h3>Area Removal Options</h3>
                    <button className="area-remove-modal-close" onClick={onClose}>×</button>
                </div>
                <div className="area-remove-modal-body">
                    <p className="area-remove-modal-info">
                        Found <strong>{totalCount}</strong> object{totalCount !== 1 ? 's' : ''} in selected area
                    </p>
                    
                    <div className="area-remove-objects-list">
                        {selectedObjects.tokens.length > 0 && (
                            <div className="object-type-group">
                                <div className="object-type-header">
                                    <span className="object-type-name">Creature Tokens</span>
                                    <span className="object-type-count">({selectedObjects.tokens.length})</span>
                                </div>
                                <button 
                                    className="area-remove-option-btn" 
                                    onClick={() => handleRemove('tokens')}
                                >
                                    Remove Creature Tokens
                                </button>
                            </div>
                        )}

                        {selectedObjects.characterTokens.length > 0 && (
                            <div className="object-type-group">
                                <div className="object-type-header">
                                    <span className="object-type-name">Character Tokens</span>
                                    <span className="object-type-count">({selectedObjects.characterTokens.length})</span>
                                </div>
                                <button 
                                    className="area-remove-option-btn" 
                                    onClick={() => handleRemove('characterTokens')}
                                >
                                    Remove Character Tokens
                                </button>
                            </div>
                        )}

                        {selectedObjects.items.length > 0 && (
                            <div className="object-type-group">
                                <div className="object-type-header">
                                    <span className="object-type-name">Items</span>
                                    <span className="object-type-count">({selectedObjects.items.length})</span>
                                </div>
                                <button 
                                    className="area-remove-option-btn" 
                                    onClick={() => handleRemove('items')}
                                >
                                    Remove Items
                                </button>
                            </div>
                        )}

                        {selectedObjects.environmentalObjects.length > 0 && (
                            <div className="object-type-group">
                                <div className="object-type-header">
                                    <span className="object-type-name">Environmental Objects (GM Notes, etc.)</span>
                                    <span className="object-type-count">({selectedObjects.environmentalObjects.length})</span>
                                </div>
                                <button 
                                    className="area-remove-option-btn" 
                                    onClick={() => handleRemove('environmentalObjects')}
                                >
                                    Remove Environmental Objects
                                </button>
                            </div>
                        )}

                        {selectedObjects.walls.length > 0 && (
                            <div className="object-type-group">
                                <div className="object-type-header">
                                    <span className="object-type-name">Walls</span>
                                    <span className="object-type-count">({selectedObjects.walls.length})</span>
                                </div>
                                <button 
                                    className="area-remove-option-btn" 
                                    onClick={() => handleRemove('walls')}
                                >
                                    Remove Walls
                                </button>
                            </div>
                        )}

                        {selectedObjects.drawings.length > 0 && (
                            <div className="object-type-group">
                                <div className="object-type-header">
                                    <span className="object-type-name">Drawings</span>
                                    <span className="object-type-count">({selectedObjects.drawings.length})</span>
                                </div>
                                <button 
                                    className="area-remove-option-btn" 
                                    onClick={() => handleRemove('drawings')}
                                >
                                    Remove Drawings
                                </button>
                            </div>
                        )}

                        {(selectedObjects.terrainTiles?.length || 0) > 0 && (
                            <div className="object-type-group">
                                <div className="object-type-header">
                                    <span className="object-type-name">Terrain Tiles</span>
                                    <span className="object-type-count">({selectedObjects.terrainTiles.length})</span>
                                </div>
                                <button 
                                    className="area-remove-option-btn" 
                                    onClick={() => handleRemove('terrainTiles')}
                                >
                                    Remove Terrain Tiles
                                </button>
                            </div>
                        )}

                        {totalCount === 0 && (
                            <p className="no-objects-message">No objects found in selected area</p>
                        )}
                    </div>

                    {totalCount > 0 && (
                        <div className="area-remove-all-section">
                            <button 
                                className="area-remove-option-btn danger" 
                                onClick={() => handleRemove('all')}
                            >
                                Remove All Objects
                            </button>
                        </div>
                    )}
                </div>
                <div className="area-remove-modal-footer">
                    <button className="area-remove-modal-cancel" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AreaRemoveModal;

