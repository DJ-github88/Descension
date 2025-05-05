import React, { useState, useEffect } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators } from '../../context/spellWizardContext';
import '../../styles/CoinFlipConfig.css';

// Constants for coin flip outcomes
const COIN_SIDES = {
  HEADS: 'heads',
  TAILS: 'tails'
};

const OUTCOME_TEMPLATES = {
  damage: {
    name: 'Damage Outcome',
    outcomes: {
      [COIN_SIDES.HEADS]: {
        effect: 'Deal increased damage',
        multiplier: 1.5,
        icon: 'spell_fire_flamebolt'
      },
      [COIN_SIDES.TAILS]: {
        effect: 'Deal reduced damage',
        multiplier: 0.8,
        icon: 'spell_frost_frostblast'
      }
    }
  },
  utility: {
    name: 'Utility Outcome',
    outcomes: {
      [COIN_SIDES.HEADS]: {
        effect: 'Apply positive effect',
        duration: 10,
        icon: 'spell_holy_divinespirit'
      },
      [COIN_SIDES.TAILS]: {
        effect: 'Apply negative effect',
        duration: 5,
        icon: 'spell_shadow_shadowwordpain'
      }
    }
  },
  mixed: {
    name: 'Mixed Outcome',
    outcomes: {
      [COIN_SIDES.HEADS]: {
        effect: 'Apply beneficial effect',
        duration: 8,
        icon: 'spell_nature_rejuvenation'
      },
      [COIN_SIDES.TAILS]: {
        effect: 'Deal damage instead',
        multiplier: 1.0,
        icon: 'spell_fire_meteorstorm'
      }
    }
  }
};

const CoinFlipConfig = ({ effectType, effectId, onConfigUpdate }) => {
  const dispatch = useSpellWizardDispatch();
  const state = useSpellWizardState();
  
  // Get default template based on effect type
  const getDefaultTemplate = () => {
    if (effectType === 'damage' || effectType === 'debuff') {
      return 'damage';
    } else if (effectType === 'utility' || effectType === 'buff') {
      return 'utility';
    } else {
      return 'mixed';
    }
  };
  
  // Initialize with default settings
  const [config, setConfig] = useState({
    template: getDefaultTemplate(),
    numCoins: 1,
    maxCoins: 3,
    outcomes: {
      [COIN_SIDES.HEADS]: {
        effect: '',
        description: '',
        potency: 1.5
      },
      [COIN_SIDES.TAILS]: {
        effect: '',
        description: '',
        potency: 0.8
      }
    },
    customText: {
      [COIN_SIDES.HEADS]: 'Heads',
      [COIN_SIDES.TAILS]: 'Tails'
    }
  });
  
  // Load template on initial render
  useEffect(() => {
    loadTemplate(config.template);
  }, [effectType]);
  
  // Update parent component when config changes
  useEffect(() => {
    if (onConfigUpdate) {
      onConfigUpdate(config);
    }
    
    // Update the context directly
    dispatch(actionCreators.updateEffectResolutionConfig(effectId, {
      ...config
    }));
  }, [config, onConfigUpdate, dispatch, effectId]);
  
  // Load a template
  const loadTemplate = (templateName) => {
    const template = OUTCOME_TEMPLATES[templateName];
    if (!template) return;
    
    setConfig(prevConfig => ({
      ...prevConfig,
      template: templateName,
      outcomes: {
        [COIN_SIDES.HEADS]: {
          effect: template.outcomes[COIN_SIDES.HEADS].effect,
          description: template.outcomes[COIN_SIDES.HEADS].effect,
          potency: template.outcomes[COIN_SIDES.HEADS].multiplier || 
                   template.outcomes[COIN_SIDES.HEADS].duration || 1.5
        },
        [COIN_SIDES.TAILS]: {
          effect: template.outcomes[COIN_SIDES.TAILS].effect,
          description: template.outcomes[COIN_SIDES.TAILS].effect,
          potency: template.outcomes[COIN_SIDES.TAILS].multiplier || 
                   template.outcomes[COIN_SIDES.TAILS].duration || 0.8
        }
      }
    }));
  };
  
  // Handle template change
  const handleTemplateChange = (e) => {
    const templateName = e.target.value;
    loadTemplate(templateName);
  };
  
  // Handle number of coins change
  const handleNumCoinsChange = (e) => {
    const numCoins = parseInt(e.target.value, 10);
    setConfig(prevConfig => ({
      ...prevConfig,
      numCoins: Math.min(Math.max(1, numCoins), prevConfig.maxCoins)
    }));
  };
  
  // Handle max coins change
  const handleMaxCoinsChange = (e) => {
    const maxCoins = parseInt(e.target.value, 10);
    setConfig(prevConfig => ({
      ...prevConfig,
      maxCoins: Math.max(prevConfig.numCoins, maxCoins)
    }));
  };
  
  // Handle outcome changes
  const handleOutcomeChange = (side, field, value) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      outcomes: {
        ...prevConfig.outcomes,
        [side]: {
          ...prevConfig.outcomes[side],
          [field]: value
        }
      }
    }));
  };
  
  // Handle custom text changes
  const handleCustomTextChange = (side, value) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      customText: {
        ...prevConfig.customText,
        [side]: value
      }
    }));
  };
  
  return (
    <div className="coin-flip-config">
      <h4>Coin Flip Resolution</h4>
      <p className="config-description">
        Configure how this effect uses coin flips to determine outcomes.
      </p>
      
      <div className="config-section">
        <label>Outcome Template</label>
        <select 
          value={config.template} 
          onChange={handleTemplateChange}
        >
          <option value="damage">Damage Outcome</option>
          <option value="utility">Utility Outcome</option>
          <option value="mixed">Mixed Outcome</option>
        </select>
      </div>
      
      <div className="config-section">
        <label>Number of Coins</label>
        <input 
          type="number" 
          min="1" 
          max={config.maxCoins} 
          value={config.numCoins}
          onChange={handleNumCoinsChange}
        />
        <p className="input-description">How many coins to flip for this effect</p>
      </div>
      
      <div className="config-section">
        <label>Maximum Coins</label>
        <input 
          type="number" 
          min={config.numCoins} 
          max="10" 
          value={config.maxCoins}
          onChange={handleMaxCoinsChange}
        />
        <p className="input-description">Maximum possible coins for this effect (with upgrades)</p>
      </div>
      
      <div className="outcomes-section">
        <h4>Outcome Configuration</h4>
        
        <div className="outcome-config">
          <div className="outcome-header">Heads Outcome</div>
          <div className="outcome-form">
            <div className="form-group">
              <label>Custom Text</label>
              <input
                type="text"
                value={config.customText[COIN_SIDES.HEADS]}
                onChange={(e) => handleCustomTextChange(COIN_SIDES.HEADS, e.target.value)}
                placeholder="Heads"
              />
            </div>
            <div className="form-group">
              <label>Effect</label>
              <input
                type="text"
                value={config.outcomes[COIN_SIDES.HEADS].effect}
                onChange={(e) => handleOutcomeChange(COIN_SIDES.HEADS, 'effect', e.target.value)}
                placeholder="Effect name"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={config.outcomes[COIN_SIDES.HEADS].description}
                onChange={(e) => handleOutcomeChange(COIN_SIDES.HEADS, 'description', e.target.value)}
                placeholder="Describe the effect"
              />
            </div>
            <div className="form-group">
              <label>Potency (Multiplier)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="5.0"
                value={config.outcomes[COIN_SIDES.HEADS].potency}
                onChange={(e) => handleOutcomeChange(COIN_SIDES.HEADS, 'potency', parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>
        
        <div className="outcome-config">
          <div className="outcome-header">Tails Outcome</div>
          <div className="outcome-form">
            <div className="form-group">
              <label>Custom Text</label>
              <input
                type="text"
                value={config.customText[COIN_SIDES.TAILS]}
                onChange={(e) => handleCustomTextChange(COIN_SIDES.TAILS, e.target.value)}
                placeholder="Tails"
              />
            </div>
            <div className="form-group">
              <label>Effect</label>
              <input
                type="text"
                value={config.outcomes[COIN_SIDES.TAILS].effect}
                onChange={(e) => handleOutcomeChange(COIN_SIDES.TAILS, 'effect', e.target.value)}
                placeholder="Effect name"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={config.outcomes[COIN_SIDES.TAILS].description}
                onChange={(e) => handleOutcomeChange(COIN_SIDES.TAILS, 'description', e.target.value)}
                placeholder="Describe the effect"
              />
            </div>
            <div className="form-group">
              <label>Potency (Multiplier)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="5.0"
                value={config.outcomes[COIN_SIDES.TAILS].potency}
                onChange={(e) => handleOutcomeChange(COIN_SIDES.TAILS, 'potency', parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="probability-section">
        <h4>Probability Overview</h4>
        <div className="probability-info">
          <p>With {config.numCoins} coin{config.numCoins !== 1 ? 's' : ''}:</p>
          <ul>
            <li>All Heads: {(Math.pow(0.5, config.numCoins) * 100).toFixed(1)}%</li>
            <li>All Tails: {(Math.pow(0.5, config.numCoins) * 100).toFixed(1)}%</li>
            <li>Mixed Results: {(100 - 2 * Math.pow(0.5, config.numCoins) * 100).toFixed(1)}%</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CoinFlipConfig;