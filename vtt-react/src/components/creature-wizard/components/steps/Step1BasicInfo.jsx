import React, { useState, useRef } from 'react';
import { useCreatureWizard, useCreatureWizardDispatch, wizardActionCreators, CREATURE_TYPES, CREATURE_SIZES } from '../../context/CreatureWizardContext';
import CreatureIconSelector from '../common/CreatureIconSelector';
import '../../styles/WizardSteps.css';

const Step1BasicInfo = () => {
  const wizardState = useCreatureWizard();
  const dispatch = useCreatureWizardDispatch();

  const [showIconSelector, setShowIconSelector] = useState(false);
  const [showImageControls, setShowImageControls] = useState(false);
  const fileInputRef = useRef(null);



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

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file must be smaller than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target.result;

        // Set the custom image and default transformations
        dispatch(wizardActionCreators.setBasicInfo({
          customTokenImage: imageData,
          imageTransformations: {
            scale: 1,
            rotation: 0,
            positionX: 0,
            positionY: 0
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image URL input
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    if (url) {
      dispatch(wizardActionCreators.setBasicInfo({
        customTokenImage: url,
        imageTransformations: {
          scale: 1,
          rotation: 0,
          positionX: 0,
          positionY: 0
        }
      }));
    }
  };

  // Remove custom image
  const handleRemoveCustomImage = () => {
    dispatch(wizardActionCreators.setBasicInfo({
      customTokenImage: null,
      imageTransformations: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle image transformation changes
  const handleTransformationChange = (property, value) => {
    const currentTransforms = wizardState.imageTransformations || {};
    const newTransforms = {
      ...currentTransforms,
      [property]: value
    };
    dispatch(wizardActionCreators.setBasicInfo({
      imageTransformations: newTransforms
    }));
  };

  // Reset image transformations
  const handleResetTransformations = () => {
    dispatch(wizardActionCreators.setBasicInfo({
      imageTransformations: {
        scale: 1,
        rotation: 0,
        positionX: 0,
        positionY: 0
      }
    }));
  };

  // Center image
  const handleCenterImage = () => {
    const currentTransforms = wizardState.imageTransformations || {};
    dispatch(wizardActionCreators.setBasicInfo({
      imageTransformations: {
        ...currentTransforms,
        positionX: 0,
        positionY: 0
      }
    }));
  };

  // Get image style with transformations
  const getImageStyle = () => {
    const transforms = wizardState.imageTransformations;
    if (!transforms) return {};

    return {
      transform: `scale(${transforms.scale || 1}) rotate(${transforms.rotation || 0}deg) translate(${transforms.positionX || 0}px, ${transforms.positionY || 0}px)`
    };
  };

  // Format type name for display
  const formatTypeName = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Format size name for display
  const formatSizeName = (size) => {
    return size.charAt(0).toUpperCase() + size.slice(1);
  };

  // Mouse drag handling for image positioning
  const handleMouseDown = (e) => {
    if (!wizardState.customTokenImage) return;

    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const currentTransforms = wizardState.imageTransformations || {};
    const startPosX = currentTransforms.positionX || 0;
    const startPosY = currentTransforms.positionY || 0;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      dispatch(wizardActionCreators.setBasicInfo({
        imageTransformations: {
          ...currentTransforms,
          positionX: startPosX + deltaX,
          positionY: startPosY - deltaY // Invert Y for intuitive dragging
        }
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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
                onMouseDown={wizardState.customTokenImage ? handleMouseDown : undefined}
                style={{
                  backgroundImage: wizardState.customTokenImage
                    ? `url(${wizardState.customTokenImage})`
                    : `url(https://wow.zamimg.com/images/wow/icons/large/${wizardState.tokenIcon}.jpg)`,
                  borderColor: wizardState.tokenBorder,
                  backgroundSize: wizardState.customTokenImage && wizardState.imageTransformations
                    ? `${(wizardState.imageTransformations.scale || 1) * 100}%`
                    : 'cover',
                  backgroundPosition: wizardState.customTokenImage && wizardState.imageTransformations
                    ? `${50 + (wizardState.imageTransformations.positionX || 0) / 2}% ${50 - (wizardState.imageTransformations.positionY || 0) / 2}%`
                    : 'center center',
                  transform: wizardState.customTokenImage && wizardState.imageTransformations
                    ? `rotate(${wizardState.imageTransformations.rotation || 0}deg)`
                    : 'none',
                  cursor: wizardState.customTokenImage ? 'move' : 'default'
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
                {wizardState.customTokenImage && (
                  <button
                    className="remove-custom-image-btn"
                    onClick={handleRemoveCustomImage}
                    title="Remove custom image"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>

              <div className="token-info-enhanced">
                <h4 className="token-name-large">{wizardState.name || 'Unnamed Creature'}</h4>
                <p className="token-details-large">{formatSizeName(wizardState.size)} {formatTypeName(wizardState.type)}</p>
              </div>
            </div>

            {/* Image Manipulation Controls - Show when custom image is present */}
            {wizardState.customTokenImage && (
              <div className="image-controls-main">
                <div className="control-group">
                  <label className="control-label">Scale</label>
                  <div className="control-row">
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={wizardState.imageTransformations?.scale || 1}
                      onChange={(e) => handleTransformationChange('scale', parseFloat(e.target.value))}
                      className="control-slider"
                    />
                    <span className="control-value">
                      {((wizardState.imageTransformations?.scale || 1) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="control-group">
                  <label className="control-label">Rotation</label>
                  <div className="control-row">
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="5"
                      value={wizardState.imageTransformations?.rotation || 0}
                      onChange={(e) => handleTransformationChange('rotation', parseInt(e.target.value))}
                      className="control-slider"
                    />
                    <span className="control-value">
                      {wizardState.imageTransformations?.rotation || 0}°
                    </span>
                  </div>
                </div>

                <div className="control-group">
                  <label className="control-label">Position</label>
                  <div className="center-control">
                    <button
                      type="button"
                      className="center-btn"
                      onClick={handleCenterImage}
                      title="Center Image"
                    >
                      <i className="fas fa-crosshairs"></i>
                      Center Image
                    </button>
                  </div>
                </div>

                <div className="control-actions">
                  <button
                    type="button"
                    className="reset-btn"
                    onClick={handleResetTransformations}
                    title="Reset All Transformations"
                  >
                    <i className="fas fa-undo"></i>
                    Reset
                  </button>
                </div>
              </div>
            )}

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

            {/* Custom Token Image Upload - Only show when no custom image */}
            {!wizardState.customTokenImage && (
              <div className="form-group">
                <label className="color-picker-label">Custom Token Image</label>
                <div className="custom-image-section">
                  <div className="image-upload-options">
                    <div className="upload-option">
                      <label htmlFor="creature-image-upload" className="upload-btn">
                        <i className="fas fa-upload"></i>
                        Upload Image
                      </label>
                      <input
                        id="creature-image-upload"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                    </div>
                    <div className="upload-divider">or</div>
                    <div className="url-option">
                      <input
                        type="text"
                        placeholder="Paste image URL..."
                        onBlur={handleImageUrlChange}
                        className="image-url-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
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
