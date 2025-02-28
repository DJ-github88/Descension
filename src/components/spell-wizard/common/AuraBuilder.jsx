import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ColorPicker from './ColorPicker';

// Aura types categorized
const AURA_TYPES = {
  BENEFICIAL: {
    healing: {
      id: 'healing',
      name: 'Healing Aura',
      description: 'Heals allies within the area over time',
      icon: 'spell_holy_divineprovidence',
      color: '#00cc00'
    },
    protection: {
      id: 'protection',
      name: 'Protection Aura',
      description: 'Reduces damage taken by allies within the area',
      icon: 'spell_holy_devotionaura',
      color: '#ffcc00'
    },
    strength: {
      id: 'strength',
      name: 'Strength Aura',
      description: 'Increases physical damage dealt by allies within the area',
      icon: 'spell_holy_auraoflight',
      color: '#ff0000'
    },
    speed: {
      id: 'speed',
      name: 'Speed Aura',
      description: 'Increases movement speed of allies within the area',
      icon: 'spell_nature_invisibility',
      color: '#00ffff'
    }
  },
  HARMFUL: {
    fire: {
      id: 'fire',
      name: 'Fire Aura',
      description: 'Deals fire damage to enemies within the area',
      icon: 'spell_fire_immolation',
      color: '#ff4400'
    },
    frost: {
      id: 'frost',
      name: 'Frost Aura',
      description: 'Slows and damages enemies within the area',
      icon: 'spell_frost_chillingblast',
      color: '#00ccff'
    },
    poison: {
      id: 'poison',
      name: 'Poison Aura',
      description: 'Poisons enemies within the area, dealing damage over time',
      icon: 'spell_nature_poisoncleansingtotem',
      color: '#00ff00'
    },
    shadow: {
      id: 'shadow',
      name: 'Shadow Aura',
      description: 'Weakens enemies within the area, reducing their damage',
      icon: 'spell_shadow_shadowfury',
      color: '#9900cc'
    }
  },
  UTILITY: {
    detection: {
      id: 'detection',
      name: 'Detection Aura',
      description: 'Reveals hidden and invisible enemies within the area',
      icon: 'spell_nature_faeriefire',
      color: '#ff66ff'
    },
    reflection: {
      id: 'reflection',
      name: 'Reflection Aura',
      description: 'Reflects a portion of damage back to attackers',
      icon: 'spell_holy_powerwordshield',
      color: '#ffffff'
    },
    silence: {
      id: 'silence',
      name: 'Silence Aura',
      description: 'Prevents enemies within the area from casting spells',
      icon: 'spell_shadow_impphaseshift',
      color: '#660066'
    },
    mana: {
      id: 'mana',
      name: 'Mana Aura',
      description: 'Regenerates mana for allies within the area',
      icon: 'spell_frost_wizardmark',
      color: '#0000ff'
    }
  }
};

// Shapes for auras
const AURA_SHAPES = {
  CIRCLE: {
    id: 'circle',
    name: 'Circle',
    icon: 'spell_holy_divinestar'
  },
  SQUARE: {
    id: 'square',
    name: 'Square',
    icon: 'spell_frost_glacier'
  },
  CONE: {
    id: 'cone',
    name: 'Cone',
    icon: 'spell_fire_flamebolt'
  }
};

const AuraBuilder = ({
  value = {},
  onChange = () => {},
  showPreview = true
}) => {
  const [auraType, setAuraType] = useState(value.type || '');
  const [auraShape, setAuraShape] = useState(value.shape || 'circle');
  const [auraSize, setAuraSize] = useState(value.size || 10);
  const [auraColor, setAuraColor] = useState(value.color || '#FFFFFF');
  const [auraOpacity, setAuraOpacity] = useState(value.opacity || 0.5);
  const [auraPulse, setAuraPulse] = useState(value.pulse || false);
  const [auraRotate, setAuraRotate] = useState(value.rotate || false);

  // Update parent component with changes
  useEffect(() => {
    onChange({
      type: auraType,
      shape: auraShape,
      size: auraSize,
      color: auraColor,
      opacity: auraOpacity,
      pulse: auraPulse,
      rotate: auraRotate
    });
  }, [auraType, auraShape, auraSize, auraColor, auraOpacity, auraPulse, auraRotate, onChange]);

  // Get aura details by ID
  const getAuraById = (auraId) => {
    for (const category in AURA_TYPES) {
      for (const id in AURA_TYPES[category]) {
        if (id === auraId) {
          return AURA_TYPES[category][id];
        }
      }
    }
    return null;
  };

  // Render the aura type selector section
  const renderAuraTypeSelector = () => (
    <div className="aura-type-selector">
      <h4>Aura Type</h4>
      <div className="type-grid">
        {Object.entries(AURA_TYPES).map(([category, auras]) => (
          <div key={category} className="aura-category">
            <h5>{category.charAt(0) + category.slice(1).toLowerCase()} Auras</h5>
            <div className="aura-options">
              {Object.values(auras).map((aura) => (
                <button
                  key={aura.id}
                  className={`aura-type-button ${auraType === aura.id ? 'selected' : ''}`}
                  onClick={() => setAuraType(aura.id)}
                  type="button"
                >
                  <img 
                    src={`https://wow.zamimg.com/images/wow/icons/large/${aura.icon || 'inv_misc_questionmark'}.jpg`}
                    alt={aura.name}
                    onError={(e) => {
                      e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                    }}
                  />
                  <div className="aura-info">
                    <span className="aura-name">{aura.name}</span>
                    <span className="aura-description">{aura.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render shape selector section
  const renderShapeSelector = () => (
    <div className="aura-shape-selector">
      <h4>Shape</h4>
      <div className="shape-buttons">
        {Object.values(AURA_SHAPES).map(shape => (
          <button
            key={shape.id}
            className={`shape-button ${auraShape === shape.id ? 'selected' : ''}`}
            onClick={() => setAuraShape(shape.id)}
            type="button"
          >
            <img 
              src={`https://wow.zamimg.com/images/wow/icons/large/${shape.icon || 'inv_misc_questionmark'}.jpg`}
              alt={shape.name}
              onError={(e) => {
                e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
              }}
            />
            <span>{shape.name}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Render size controls section
  const renderSizeControls = () => (
    <div className="aura-size-controls">
      <h4>Size</h4>
      <div className="size-slider">
        <input
          type="range"
          min="5"
          max="60"
          value={auraSize}
          onChange={(e) => setAuraSize(parseInt(e.target.value))}
        />
        <span className="size-value">{auraSize} feet</span>
      </div>
    </div>
  );

  // Render visual controls section
  const renderVisualControls = () => (
    <div className="aura-visual-controls">
      <h4>Visual Effects</h4>
      <div className="visual-options">
        <div className="color-picker-container">
          <label>Color</label>
          <ColorPicker
            color={auraColor}
            onChange={setAuraColor}
            showPresets={true}
          />
        </div>
        <div className="opacity-slider">
          <label>Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={auraOpacity}
            onChange={(e) => setAuraOpacity(parseFloat(e.target.value))}
          />
          <span>{(auraOpacity * 100).toFixed(0)}%</span>
        </div>
        <div className="effect-toggles">
          <label>
            <input
              type="checkbox"
              checked={auraPulse}
              onChange={(e) => setAuraPulse(e.target.checked)}
            />
            Pulsing Effect
          </label>
          <label>
            <input
              type="checkbox"
              checked={auraRotate}
              onChange={(e) => setAuraRotate(e.target.checked)}
            />
            Rotation Effect
          </label>
        </div>
      </div>
    </div>
  );

  // Render preview section
  const renderPreview = () => {
    if (!showPreview || !auraType) return null;

    const aura = getAuraById(auraType);
    if (!aura) return null;

    const shape = Object.values(AURA_SHAPES).find(s => s.id === auraShape) || AURA_SHAPES.CIRCLE;

    return (
      <div className="aura-preview">
        <h4>Preview</h4>
        <div 
          className={`preview-container ${auraShape} ${auraPulse ? 'pulse' : ''} ${auraRotate ? 'rotate' : ''}`}
          style={{
            '--aura-color': auraColor || aura.color,
            '--aura-opacity': auraOpacity,
            '--aura-size': `${auraSize * 3}px`
          }}
        >
          <div className="aura-effect">
            <img 
              src={`https://wow.zamimg.com/images/wow/icons/large/${aura.icon || 'inv_misc_questionmark'}.jpg`}
              alt={aura.name}
              onError={(e) => {
                e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
              }}
            />
          </div>
        </div>
        <div className="preview-info">
          <span className="preview-name">{aura.name}</span>
          <span className="preview-size">{auraSize} ft. {shape.name}</span>
        </div>
      </div>
    );
  };

  // Render empty preview if no aura selected
  const renderEmptyPreview = () => {
    if (!showPreview || auraType) return null;
    
    return (
      <div className="empty-preview">
        <p>Select an aura type to see a preview</p>
      </div>
    );
  };

  return (
    <div className="aura-builder">
      {renderAuraTypeSelector()}
      
      {auraType && (
        <>
          {renderShapeSelector()}
          {renderSizeControls()}
          {renderVisualControls()}
        </>
      )}
      
      {renderPreview()}
      {renderEmptyPreview()}
    </div>
  );
};

AuraBuilder.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
  showPreview: PropTypes.bool
};

export default AuraBuilder;