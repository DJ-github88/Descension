import React, { useState, useEffect } from 'react';
import useLevelEditorStore from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';
import { VISION_RANGES, VISION_TYPES, feetToTiles } from '../../utils/VisibilityCalculations';
import './styles/TokenVisionDialog.css';

/**
 * TokenVisionDialog - Configure vision settings for individual tokens
 * Allows setting vision range, type, and other visibility properties
 */
const TokenVisionDialog = ({ token, creature, isOpen, onClose }) => {
    const [visionRange, setVisionRange] = useState(60); // feet
    const [visionType, setVisionType] = useState('normal');
    const [customRange, setCustomRange] = useState('');
    const [useCustomRange, setUseCustomRange] = useState(false);

    // Stores
    const { setTokenVision, removeTokenVision, tokenVisionRanges } = useLevelEditorStore();
    const { feetPerTile } = useGameStore();

    // Initialize values when dialog opens
    useEffect(() => {
        if (isOpen && token) {
            const existingVision = tokenVisionRanges[token.creatureId];
            
            if (existingVision) {
                // Convert tiles back to feet for display
                const rangeInFeet = existingVision.range * feetPerTile;
                setVisionRange(rangeInFeet);
                setVisionType(existingVision.type);
                
                // Check if it's a custom range
                const isStandardRange = Object.values(VISION_RANGES).includes(rangeInFeet);
                if (!isStandardRange) {
                    setUseCustomRange(true);
                    setCustomRange(rangeInFeet.toString());
                }
            } else if (creature) {
                // Initialize from creature data
                if (creature.senses?.darkvision) {
                    setVisionRange(creature.senses.darkvision);
                    setVisionType('darkvision');
                } else if (creature.senses?.blindsight) {
                    setVisionRange(creature.senses.blindsight);
                    setVisionType('blindsight');
                } else {
                    setVisionRange(VISION_RANGES.NORMAL);
                    setVisionType('normal');
                }
            }
        }
    }, [isOpen, token, creature, tokenVisionRanges, feetPerTile]);

    const handleSave = () => {
        if (!token) return;

        const finalRange = useCustomRange ? 
            parseInt(customRange) || 60 : 
            visionRange;

        // Convert feet to tiles
        const rangeInTiles = feetToTiles(finalRange, feetPerTile);

        setTokenVision(token.creatureId, rangeInTiles, visionType);
        onClose();
    };

    const handleRemoveVision = () => {
        if (!token) return;
        
        removeTokenVision(token.creatureId);
        onClose();
    };

    const handleRangeChange = (range) => {
        setVisionRange(range);
        setUseCustomRange(false);
        setCustomRange('');
    };

    const handleCustomRangeToggle = (enabled) => {
        setUseCustomRange(enabled);
        if (enabled) {
            setCustomRange(visionRange.toString());
        } else {
            setCustomRange('');
        }
    };

    if (!isOpen) return null;

    const creatureName = creature?.name || token?.name || 'Unknown';
    const currentVisionInTiles = useCustomRange ? 
        feetToTiles(parseInt(customRange) || 60, feetPerTile) :
        feetToTiles(visionRange, feetPerTile);

    return (
        <div className="token-vision-dialog-overlay">
            <div className="token-vision-dialog">
                <div className="dialog-header">
                    <h3 className="dialog-title">Configure Vision: {creatureName}</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="dialog-content">
                    {/* Vision Type Selection */}
                    <div className="vision-section">
                        <h4 className="section-title">Vision Type</h4>
                        <div className="vision-type-grid">
                            {Object.entries(VISION_TYPES).map(([type, info]) => (
                                <button
                                    key={type}
                                    className={`vision-type-btn ${visionType === type ? 'active' : ''}`}
                                    onClick={() => setVisionType(type)}
                                    title={info.description}
                                >
                                    <div className="type-name">{info.name}</div>
                                    <div className="type-description">{info.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Vision Range Selection */}
                    <div className="vision-section">
                        <h4 className="section-title">Vision Range</h4>
                        
                        {/* Standard Ranges */}
                        <div className="range-presets">
                            {Object.entries(VISION_RANGES).map(([key, range]) => (
                                <button
                                    key={key}
                                    className={`range-btn ${!useCustomRange && visionRange === range ? 'active' : ''}`}
                                    onClick={() => handleRangeChange(range)}
                                >
                                    {range}ft
                                </button>
                            ))}
                        </div>

                        {/* Custom Range */}
                        <div className="custom-range-section">
                            <label className="custom-range-label">
                                <input
                                    type="checkbox"
                                    checked={useCustomRange}
                                    onChange={(e) => handleCustomRangeToggle(e.target.checked)}
                                />
                                Custom Range
                            </label>
                            
                            {useCustomRange && (
                                <div className="custom-range-input">
                                    <input
                                        type="number"
                                        value={customRange}
                                        onChange={(e) => setCustomRange(e.target.value)}
                                        placeholder="Enter range in feet"
                                        min="0"
                                        max="1000"
                                    />
                                    <span>feet</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Vision Summary */}
                    <div className="vision-section">
                        <h4 className="section-title">Vision Summary</h4>
                        <div className="vision-summary">
                            <div className="summary-item">
                                <span className="summary-label">Type:</span>
                                <span className="summary-value">{VISION_TYPES[visionType]?.name}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Range:</span>
                                <span className="summary-value">
                                    {useCustomRange ? customRange : visionRange} feet 
                                    ({currentVisionInTiles} tiles)
                                </span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Ignores Walls:</span>
                                <span className="summary-value">
                                    {VISION_TYPES[visionType]?.ignoresWalls ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Ignores Lighting:</span>
                                <span className="summary-value">
                                    {VISION_TYPES[visionType]?.ignoresLighting ? 'Yes' : 'No'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dialog-footer">
                    <button className="dialog-btn primary" onClick={handleSave}>
                        Save Vision Settings
                    </button>
                    <button className="dialog-btn secondary" onClick={handleRemoveVision}>
                        Remove Custom Vision
                    </button>
                    <button className="dialog-btn" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TokenVisionDialog;
