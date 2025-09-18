import React, { useState } from 'react';
import { useCreatureWizard, useCreatureWizardDispatch, wizardActionCreators, CREATURE_TYPES, CREATURE_SIZES } from '../../context/CreatureWizardContext';
import CreatureIconSelector from '../common/CreatureIconSelector';
import '../../styles/WizardSteps.css';

const Step1BasicInfo = () => {
  const wizardState = useCreatureWizard();
  const dispatch = useCreatureWizardDispatch();

  const [showIconSelector, setShowIconSelector] = useState(false);



  // Sample colors for the border color picker
  const sampleColors = [
    '#ffffff', // White
    '#ff0000', // Red
    '#00ff00', // Green
    '#0000ff', // Blue
    '#ffff00', // Yellow
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
    '#ff9900', // Orange
    '#9900ff', // Purple
    '#00cc00', // Dark Green
    '#cc0000', // Dark Red
    '#0066cc', // Dark Blue
    '#663300', // Brown
    '#999999', // Gray
    '#000000'  // Black
  ];

  // Handle name change
  const handleNameChange = (e) => {
    dispatch(wizardActionCreators.setBasicInfo({
      name: e.target.value
    }));
  };

  // Handle description change
  const handleDescriptionChange = (e) => {
    dispatch(wizardActionCreators.setBasicInfo({
      description: e.target.value
    }));
  };

  // Handle type change
  const handleTypeChange = (e) => {
    dispatch(wizardActionCreators.setBasicInfo({
      type: e.target.value
    }));
  };

  // Handle size change
  const handleSizeChange = (e) => {
    dispatch(wizardActionCreators.setBasicInfo({
      size: e.target.value
    }));
  };

  // Handle tag input
  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const newTag = e.target.value.trim().toLowerCase();

      // Check if tag already exists
      if (!wizardState.tags.includes(newTag)) {
        dispatch(wizardActionCreators.setBasicInfo({
          tags: [...wizardState.tags, newTag]
        }));
      }

      // Clear the input
      e.target.value = '';
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove) => {
    dispatch(wizardActionCreators.setBasicInfo({
      tags: wizardState.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle icon selection
  const handleIconSelect = (icon) => {
    dispatch(wizardActionCreators.setBasicInfo({
      tokenIcon: icon
    }));
    setShowIconSelector(false);
  };

  // Handle border color selection
  const handleBorderColorSelect = (color) => {
    dispatch(wizardActionCreators.setBasicInfo({
      tokenBorder: color
    }));
  };

  // Format type name for display
  const formatTypeName = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Format size name for display
  const formatSizeName = (size) => {
    return size.charAt(0).toUpperCase() + size.slice(1);
  };

  return (
    <div className="wizard-step">
      <div className="step-header">
        <h2>Basic Information</h2>
        <p className="step-description">
          Define your creature's core identity, appearance, and classification.
        </p>
      </div>

      {/* Main content in improved layout */}
      <div className="form-section">
        <div className="basic-info-layout">
          {/* Left Section - Core Information */}
          <div className="core-info-section">
            <h3 className="section-title">Essential Details</h3>

            <div className="form-group">
              <label htmlFor="creature-name" className="required-label">
                Creature Name
                <span className="required-asterisk">*</span>
              </label>
              <input
                id="creature-name"
                type="text"
                value={wizardState.name}
                onChange={handleNameChange}
                placeholder="Enter creature name"
                className={wizardState.validationErrors.name ? 'error' : ''}
                maxLength={50}
              />
              <div className="input-helper">
                <span className="character-count">{wizardState.name.length}/50</span>
                {wizardState.validationErrors.name && (
                  <div className="error-message">{wizardState.validationErrors.name}</div>
                )}
              </div>
            </div>

            <div className="classification-row">
              <div className="form-group half-width">
                <label htmlFor="creature-type" className="required-label">
                  Type
                  <span className="required-asterisk">*</span>
                </label>
                <select
                  id="creature-type"
                  value={wizardState.type}
                  onChange={handleTypeChange}
                  className="enhanced-select"
                >
                  {Object.values(CREATURE_TYPES).map(type => (
                    <option key={type} value={type}>
                      {formatTypeName(type)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group half-width">
                <label htmlFor="creature-size" className="required-label">
                  Size
                  <span className="required-asterisk">*</span>
                </label>
                <select
                  id="creature-size"
                  value={wizardState.size}
                  onChange={handleSizeChange}
                  className="enhanced-select"
                >
                  {Object.values(CREATURE_SIZES).map(size => (
                    <option key={size} value={size}>
                      {formatSizeName(size)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="creature-description">
                Description & Lore
                <span className="optional-label">(Optional)</span>
              </label>
              <textarea
                id="creature-description"
                value={wizardState.description}
                onChange={handleDescriptionChange}
                placeholder="Describe appearance, behavior, habitat, and lore..."
                rows={4}
                maxLength={1000}
              />
              <div className="input-helper">
                <span className="character-count">{wizardState.description.length}/1000</span>
              </div>
            </div>
          </div>

          {/* Right Section - Token Appearance */}
          <div className="token-appearance-section">
            <h3 className="section-title">Token Appearance</h3>

            <div className="token-preview-enhanced">
              <div
                className="token-icon-large"
                style={{
                  backgroundImage: `url(https://wow.zamimg.com/images/wow/icons/large/${wizardState.tokenIcon}.jpg)`,
                  borderColor: wizardState.tokenBorder
                }}
              >
                <div className="token-overlay-large">
                  <button
                    className="change-icon-btn"
                    onClick={() => setShowIconSelector(true)}
                    title="Click to change icon"
                  >
                    <span className="icon-text">📷</span>
                    <span className="change-text">Change Icon</span>
                  </button>
                </div>
              </div>

              <div className="token-info-enhanced">
                <h4 className="token-name-large">{wizardState.name || 'Unnamed Creature'}</h4>
                <p className="token-details-large">{formatSizeName(wizardState.size)} {formatTypeName(wizardState.type)}</p>
              </div>
            </div>

            <div className="form-group">
              <label className="color-picker-label">Border Color</label>
              <div className="color-options-enhanced">
                {sampleColors.map(color => (
                  <div
                    key={color}
                    className={`color-option-large ${wizardState.tokenBorder === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleBorderColorSelect(color)}
                    title={`Select ${color} border`}
                  >
                    {wizardState.tokenBorder === color && <span className="checkmark">✓</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tags Section - More compact */}
      <div className="form-section">
        <h3 className="section-title">Tags & Organization</h3>

        <div className="form-group">
          <label htmlFor="creature-tags">
            Descriptive Tags
            <span className="optional-label">(Optional)</span>
          </label>
          <div className="tags-input-container">
            <input
              id="creature-tags"
              type="text"
              placeholder="Type a tag and press Enter (e.g., undead, fire, boss, aquatic, flying)"
              onKeyDown={handleTagInput}
              className="tags-input"
            />
            <div className="tags-container">
              {wizardState.tags.map(tag => (
                <div key={tag} className="tag">
                  <span className="tag-text">{tag}</span>
                  <button
                    type="button"
                    className="remove-tag"
                    onClick={() => handleRemoveTag(tag)}
                    title={`Remove ${tag} tag`}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Icon Selector Modal */}
      <CreatureIconSelector
        isOpen={showIconSelector}
        onClose={() => setShowIconSelector(false)}
        onSelect={handleIconSelect}
        currentIcon={wizardState.tokenIcon}
      />
    </div>
  );
};

export default Step1BasicInfo;
