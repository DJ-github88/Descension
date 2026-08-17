import React, { useState, useRef, useEffect } from 'react';
import useDiceStore, { DICE_PRESETS } from '../../store/diceStore';
import './DiceThemeSelector.css';

/**
 * DiceThemeSelector
 * Allows selecting the 3D dice appearance / material theme
 */
const DiceThemeSelector = ({ className = '', compact = false }) => {
  const activePreset = useDiceStore(state => state.activePreset) || 'classic';
  const setDicePreset = useDiceStore(state => state.setDicePreset);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const currentPresetData = DICE_PRESETS[activePreset] || DICE_PRESETS.classic;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className={`dice-theme-selector-container ${className}`} ref={containerRef}>
      <button
        type="button"
        className={`dice-theme-trigger-btn ${compact ? 'compact' : ''} ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        title="Select 3D Dice Graphics & Theme"
      >
        <span
          className="dice-theme-swatch-dot"
          style={{
            background: currentPresetData.bodyColor,
            borderColor: currentPresetData.edgeColor,
            boxShadow: `0 0 6px ${currentPresetData.glowColor || currentPresetData.edgeColor}`
          }}
        />
        <i className={`${currentPresetData.icon} dice-theme-icon`} style={{ color: currentPresetData.edgeColor }}></i>
        {!compact && <span className="dice-theme-name">{currentPresetData.name}</span>}
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} dice-theme-chevron`}></i>
      </button>

      {isOpen && (
        <div className="dice-theme-dropdown-menu">
          <div className="dice-theme-dropdown-header">
            <i className="fas fa-palette"></i>
            <span>3D Dice Graphics</span>
          </div>
          <div className="dice-theme-grid">
            {Object.values(DICE_PRESETS).map((preset) => {
              const isSelected = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  className={`dice-theme-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setDicePreset(preset.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="dice-theme-preview-box" style={{ background: preset.bodyColor, borderColor: preset.edgeColor }}>
                    <i className={preset.icon} style={{ color: preset.numberColor || preset.edgeColor }}></i>
                    <span
                      className="dice-theme-glow-aura"
                      style={{ background: `radial-gradient(circle, ${preset.glowColor} 0%, transparent 70%)` }}
                    />
                  </div>
                  <div className="dice-theme-option-info">
                    <span className="dice-theme-option-name">{preset.name}</span>
                    <div className="dice-theme-swatches">
                      <span className="swatch" style={{ background: preset.bodyColor }} title="Body Color" />
                      <span className="swatch" style={{ background: preset.edgeColor }} title="Edge Trim" />
                      <span className="swatch" style={{ background: preset.numberColor }} title="Number Color" />
                    </div>
                  </div>
                  {isSelected && (
                    <i className="fas fa-check dice-theme-check"></i>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiceThemeSelector;
