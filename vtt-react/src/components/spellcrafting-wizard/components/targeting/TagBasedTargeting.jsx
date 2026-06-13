import React, { useState, useEffect } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators } from '../../context/spellWizardContext';
import { getCustomIconUrl } from '../../../../utils/assetManager';


const DEFAULT_TAGS = [
  { id: 'damage', name: 'Damage', icon: 'Fire/Flame Burst', defaultTarget: 'target' },
  { id: 'healing', name: 'Healing', icon: 'Healing/Golden Heart', defaultTarget: 'self' },
  { id: 'buff', name: 'Buff', icon: 'Radiant/Radiant Aura', defaultTarget: 'self' },
  { id: 'debuff', name: 'Debuff', icon: 'Necrotic/Necrotic Skull', defaultTarget: 'target' },
  { id: 'control', name: 'Control', icon: 'Frost/Dripping Ice', defaultTarget: 'target' },
  { id: 'utility', name: 'Utility', icon: 'Nature/Nature Natural', defaultTarget: 'target' }
];

const TARGET_OPTIONS = [
  { id: 'target', name: 'Target', icon: 'Utility/Target Crosshair', description: 'Apply to the spell\'s target' },
  { id: 'self', name: 'Self', icon: 'Radiant/Radiant Aura', description: 'Apply to the caster' },
  { id: 'both', name: 'Both', icon: 'Healing/Golden Heart', description: 'Apply to both the target and caster' }
];

const TagBasedTargeting = () => {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();

  const { targetingMode, targetingTags, effectTypes, targetingConfig } = state;

  // Initialize tags when effect types change
  useEffect(() => {
    // Get all relevant tags based on effect types
    const relevantTags = DEFAULT_TAGS.filter(tag =>
      effectTypes.includes(tag.id)
    );

    // Initialize targeting tags if they don't exist yet
    const newTargetingTags = {};

    relevantTags.forEach(tag => {
      if (!targetingTags[tag.id]) {
        newTargetingTags[tag.id] = {
          targetOption: tag.defaultTarget
        };
      }
    });

    if (Object.keys(newTargetingTags).length > 0) {
      dispatch(actionCreators.updateTargetingTags(newTargetingTags));
    }
  }, [effectTypes, dispatch, targetingTags]);

  // Handle targeting mode change
  const handleTargetingModeChange = (mode) => {
    dispatch(actionCreators.setTargetingMode(mode));
  };

  // Handle target option change for a tag
  const handleTargetOptionChange = (tagId, targetOption) => {
    dispatch(actionCreators.updateTargetingTags({
      [tagId]: {
        ...targetingTags[tagId],
        targetOption
      }
    }));
  };

  return (
    <div className="tag-based-targeting">
      <div className="targeting-mode-selector">
        <h3>Targeting Mode</h3>
        <div className="targeting-mode-options">
          <div
            className={`targeting-mode-option ${targetingMode === 'unified' ? 'selected' : ''}`}
            onClick={() => handleTargetingModeChange('unified')}
          >
            <div className="targeting-mode-icon">
              <img
                src={getCustomIconUrl('Utility/Utility', 'abilities')}
                alt="Unified Targeting"
              />
            </div>
            <div className="targeting-mode-content">
              <h4>Unified Targeting</h4>
              <p>All effects use the same targeting configuration</p>
            </div>
          </div>

          <div
            className={`targeting-mode-option ${targetingMode === 'tagged' ? 'selected' : ''}`}
            onClick={() => handleTargetingModeChange('tagged')}
          >
            <div className="targeting-mode-icon">
              <img
                src={getCustomIconUrl('Utility/Target Crosshair', 'abilities')}
                alt="Tagged Targeting"
              />
            </div>
            <div className="targeting-mode-content">
              <h4>Split Targeting</h4>
              <p>Configure different targets for each effect type</p>
            </div>
          </div>
        </div>
      </div>

      {targetingMode === 'tagged' && (
        <div className="tag-targeting-configuration">
          <h3>Configure Effect Targets</h3>
          <p className="section-description">
            Choose where each effect will be applied. For example, you can create a spell that damages the target but heals yourself.
          </p>

          <div className="tag-grid">
            {DEFAULT_TAGS.filter(tag => effectTypes.includes(tag.id)).map(tag => (
              <div key={tag.id} className="tag-card">
                <div className="tag-header">
                  <div className="tag-icon">
                    <img
                      src={getCustomIconUrl(tag.icon, 'abilities')}
                      alt={tag.name}
                    />
                  </div>
                  <h4>{tag.name} Effects</h4>
                </div>

                <div className="tag-target-options">
                  <h5>Apply To</h5>
                  <div className="target-options-grid">
                    {TARGET_OPTIONS.map(option => (
                      <div
                        key={option.id}
                        className={`target-option ${targetingTags[tag.id]?.targetOption === option.id ? 'selected' : ''}`}
                        onClick={() => handleTargetOptionChange(tag.id, option.id)}
                      >
                        <div className="target-option-icon">
                          <img
                            src={getCustomIconUrl(option.icon, 'abilities')}
                            alt={option.name}
                          />
                        </div>
                        <div className="target-option-name">{option.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagBasedTargeting;
