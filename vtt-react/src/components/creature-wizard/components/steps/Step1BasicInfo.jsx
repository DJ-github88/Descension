import React, { useState, useRef } from 'react';
import { useCreatureWizard, useCreatureWizardDispatch, wizardActionCreators, CREATURE_TYPES, CREATURE_SIZES } from '../../context/CreatureWizardContext';
import { getCustomIconUrl } from '../../../../utils/assetManager';
import CreatureIconSelector from '../common/CreatureIconSelector';
import { uploadAsset } from '../../../../services/firebase/uploadService';
import useAuthStore from '../../../../store/authStore';
import '../../styles/WizardSteps.css';

const DANGER_LEVELS = ['Trivial', 'Low', 'Medium', 'High', 'Very High', 'Extreme'];

const KNOWN_REGIONS = [
  'Frostwood Reach',
  'Nordhalla',
  'Sundale',
  'Iceheart Sea',
  'Cragjaw Peaks',
  'Sundrift Vale',
  'Bryngloom Forest',
  'Other / Custom'
];

const LORE_STATUS_OPTIONS = [
  { value: '', label: 'None / Unspecified' },
  { value: 'NATIVE-PROPOSED', label: 'NATIVE-PROPOSED (Native species proposed)' },
  { value: 'NATIVE-REVIEW', label: 'NATIVE-REVIEW (Under editorial review)' },
  { value: 'DATA-CORRECTION', label: 'DATA-CORRECTION (Lore data correction)' },
  { value: 'WYRD-CORRUPTED', label: 'WYRD-CORRUPTED (Wyrd altered)' },
  { value: 'PROVISIONAL', label: 'PROVISIONAL (Provisional canon)' }
];

const ORIGIN_CLASSES = [
  { value: '', label: 'None / Unspecified' },
  { value: 'native-lineage', label: 'Native Lineage (Mortal/Natural)' },
  { value: 'primordial-native', label: 'Primordial Native (Pre-Binding ancient)' },
  { value: 'ancient-cosmic-wyrdkin', label: 'Ancient Cosmic Wyrdkin' },
  { value: 'keth-spawn', label: 'Keth-Amar Spawn' },
  { value: 'binding-altered', label: 'Binding Altered / Winter Shifted' }
];

const LORE_ARCHETYPES = [
  {
    name: 'Memory Merchant',
    role: 'Memory-Merchant Goblin',
    dangerLevel: 'Medium',
    region: 'Frostwood Reach',
    habitat: 'Misty crossroads, twilight trading hubs, and frozen peat bogs',
    origin: 'Descended from ancient mercantile covens that bartered with Archons before the Great Binding, surviving by exchanging rare memories for cold iron.',
    folklore: 'Folk tales warn travelers never to trade away their childhood hearth-tales, lest they forget their way home.',
    function: 'Wanders the borders in creaking ironwood wagons, preserving lost histories and providing sanctuary to road-weary souls.',
    wyrdRelationship: 'Bears an ancestral soul-cipher binding them to the Winter Wyrd, compelling them to hoard memories before the Frost erases them.'
  },
  {
    name: 'Glacial Aberration',
    role: 'Rime-Spire Behemoth',
    dangerLevel: 'Very High',
    region: 'Nordhalla',
    habitat: 'Glacial fissures, perpetual blizzards, and frozen peaks',
    origin: 'Coalesced from primordial glacial rime during the First Sunder, fused with ancient titan bone and mineral ice.',
    folklore: 'Skalds sing of a moving mountain whose breath turns men to crystalline statues before they can draw blade.',
    function: 'Patrols sacred rime-leylines, crushing invaders who seek to harvest dragon-ice or desecrate mountain shrines.',
    wyrdRelationship: 'Radiates a localized cold-distortion that freezes magical leyline pulses, extinguishing mortal spells in its wake.'
  },
  {
    name: 'Ironwood Sentinel',
    role: 'Grove Protector',
    dangerLevel: 'High',
    region: 'Bryngloom Forest',
    habitat: 'Deep ancient canopies, petrified groves, and sacred springroots',
    origin: 'Carved by the First Druidic Archons from petrified ironwood and imbued with the beating heart of ancient loam.',
    folklore: 'Woodcutters leave offerings of springwater and raw silver at the forest rim, knowing sentinels tolerate no axe within the deep canopy.',
    function: 'Maintains balance between predatory beasts and encroachment, healing weeping root scars.',
    wyrdRelationship: 'Connected to the root-mind of the world; senses disturbance in subterranean leyline networks leagues away.'
  },
  {
    name: 'Barrow Wraith',
    role: 'Drowned King Shade',
    dangerLevel: 'Extreme',
    region: 'The Drowned Fens',
    habitat: 'Submerged crypts, black peat marshes, and weeping willow tombs',
    origin: 'The restless spirit of a betrayed high warlord who swore a blood-oath to hold the fenlands beyond death.',
    folklore: 'Commoners speak of ghostly lanterns rising over the black mire, luring the unwary into sunken barrows.',
    function: 'Commands spectral legionnaires to guard ancient submerged armories and unholy crowns.',
    wyrdRelationship: 'Trapped in an eternal echo of the Great Binding, radiating phantom warmth that chills any living flesh nearby.'
  },
  {
    name: 'Cinder Stalker',
    role: 'Ashen Stalker',
    dangerLevel: 'High',
    region: 'Sundale',
    habitat: 'Volcanic vents, basalt crags, and sun-baked canyon passes',
    origin: 'Spawned in the molten fissures beneath the Cragjaw Peaks where draconic blood mingled with subterranean magma.',
    folklore: 'Caravan guards light no night fires in the canyon, as the Cinder-Predator tracks the scent of burning wood from miles away.',
    function: 'Apex predator that purges invasive burrowing beasts and prevents geothermal mana eruptions.',
    wyrdRelationship: 'Internal core is a burning ember from the Second Epoch that reignites if exposed to atmospheric spark.'
  }
];

const Step1BasicInfo = () => {
  const user = useAuthStore((state) => state.user);
  const wizardState = useCreatureWizard();
  const dispatch = useCreatureWizardDispatch();

  const [showIconSelector, setShowIconSelector] = useState(false);
  const [loreSectionTab, setLoreSectionTab] = useState('core'); // 'core' | 'advanced' | 'folklore'
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

  // Generic lore field update helper
  const handleLoreChange = (field, value) => {
    dispatch(wizardActionCreators.setBasicInfo({
      [field]: value
    }));
  };

  // Lore Classification helper
  const handleClassificationChange = (field, value) => {
    dispatch(wizardActionCreators.setBasicInfo({
      loreClassification: {
        ...(wizardState.loreClassification || {}),
        [field]: value
      }
    }));
  };

  // Lore Canon helper
  const handleLoreCanonChange = (field, value) => {
    dispatch(wizardActionCreators.setBasicInfo({
      loreCanon: {
        ...(wizardState.loreCanon || {}),
        [field]: value
      }
    }));
  };

  // Folklore Inspiration helper
  const handleFolkloreInspirationChange = (field, value) => {
    dispatch(wizardActionCreators.setBasicInfo({
      folkloreInspiration: {
        ...(wizardState.folkloreInspiration || {}),
        [field]: value
      }
    }));
  };

  // 1-Click Lore Archetype Applier
  const handleApplyArchetype = (archetype) => {
    dispatch(wizardActionCreators.setBasicInfo({
      role: archetype.role,
      dangerLevel: archetype.dangerLevel,
      region: archetype.region,
      habitat: archetype.habitat,
      origin: archetype.origin,
      heritage: archetype.folklore,
      nature: archetype.function,
      depth: archetype.wyrdRelationship,
      loreCanon: {
        ...(wizardState.loreCanon || {}),
        trueOrigin: archetype.origin,
        folklore: archetype.folklore,
        function: archetype.function,
        wyrdRelationship: archetype.wyrdRelationship
      }
    }));
  };

  // Clear all lore fields
  const handleClearLore = () => {
    if (window.confirm('Clear all lore, worldbuilding, and codex fields for this creature?')) {
      dispatch(wizardActionCreators.setBasicInfo({
        role: '',
        region: '',
        habitat: '',
        origin: '',
        heritage: '',
        nature: '',
        depth: '',
        loreNote: '',
        loreClassification: { status: '', originClass: '' },
        loreCanon: {
          trueOrigin: '',
          folklore: '',
          function: '',
          wyrdRelationship: '',
          values: '',
          bindingEffect: ''
        },
        folkloreInspiration: null
      }));
    }
  };

  // Tab completion indicators
  const corePillarsCount = [
    wizardState.origin || wizardState.loreCanon?.trueOrigin,
    wizardState.heritage || wizardState.loreCanon?.folklore,
    wizardState.nature || wizardState.loreCanon?.function,
    wizardState.depth || wizardState.loreCanon?.wyrdRelationship
  ].filter(Boolean).length;

  const advancedLoreFilled = Boolean(
    wizardState.loreClassification?.status ||
    wizardState.loreClassification?.originClass ||
    wizardState.loreNote ||
    wizardState.loreCanon?.values ||
    wizardState.loreCanon?.bindingEffect
  );

  const folkloreFilled = Boolean(
    wizardState.folkloreInspiration?.region ||
    wizardState.folkloreInspiration?.creatureName ||
    wizardState.illustration
  );

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
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      try {
        const currentUserId = user?.uid || (user?.isGuest ? 'guest' : null);
        const result = await uploadAsset(currentUserId, file, 'tokens', { profile: 'TOKEN' });
        if (result.success && result.url) {
          dispatch(wizardActionCreators.setBasicInfo({
            customTokenImage: result.url,
            imageTransformations: {
              scale: 1,
              rotation: 0,
              positionX: 0,
              positionY: 0
            }
          }));
        }
      } catch (err) {
        console.error('Failed to process creature token:', err);
      }
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

  // Format type name for display
  const formatTypeName = (type) => {
    return type ? type.charAt(0).toUpperCase() + type.slice(1) : '';
  };

  // Format size name for display
  const formatSizeName = (size) => {
    return size ? size.charAt(0).toUpperCase() + size.slice(1) : '';
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
      {/* Main content in improved layout */}
      <div className="form-section">
        <div className="basic-info-layout">
          {/* Left Section - Core Information */}
          <div className="core-info-section">
            <h3 className="section-title">
              <i className="fas fa-id-card"></i> Essential Details
            </h3>

            <div className="form-group">
              <label htmlFor="creature-name" className="required-label">
                Creature Name
                <span className="required-asterisk">*</span>
              </label>
              <input
                id="creature-name"
                type="text"
                value={wizardState.name || ''}
                onChange={handleNameChange}
                placeholder="Enter creature name (e.g. Frostwood Wisp, Siltmire Serpent)"
                className={wizardState.validationErrors.name ? 'error' : ''}
                maxLength={50}
              />
              <div className="input-helper">
                <span className="character-count">{(wizardState.name || '').length}/50</span>
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
                  value={wizardState.type || CREATURE_TYPES.HUMANOID}
                  onChange={handleTypeChange}
                  className="enhanced-select"
                >
                  {Object.values(CREATURE_TYPES || {}).map(type => (
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
                  value={wizardState.size || CREATURE_SIZES.MEDIUM}
                  onChange={handleSizeChange}
                  className="enhanced-select"
                >
                  {Object.values(CREATURE_SIZES || {}).map(size => (
                    <option key={size} value={size}>
                      {formatSizeName(size)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="creature-description">
                Lead Overview & Summary
                <span className="optional-label">(Displayed at top of Codex & Sheet)</span>
              </label>
              <textarea
                id="creature-description"
                value={wizardState.description || ''}
                onChange={handleDescriptionChange}
                placeholder="A concise summary of the creature's appearance, behavior, and nature..."
                rows={3}
                maxLength={1000}
              />
              <div className="input-helper">
                <span className="character-count">{(wizardState.description || '').length}/1000</span>
              </div>
            </div>
          </div>

          {/* Right Section - Token Appearance */}
          <div className="token-appearance-section">
            <h3 className="section-title">
              <i className="fas fa-chess-knight"></i> Token Appearance
            </h3>

            <div className="token-preview-enhanced">
              <div
                className="token-icon-large"
                onMouseDown={wizardState.customTokenImage ? handleMouseDown : undefined}
                style={{
                  backgroundImage: wizardState.customTokenImage
                    ? `url(${wizardState.customTokenImage})`
                    : wizardState.tokenIcon
                    ? `url(${getCustomIconUrl(wizardState.tokenIcon, 'creatures')})`
                    : 'none',
                  borderColor: wizardState.tokenBorder || '#ffffff',
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

      {/* Lore, Worldbuilding & Codex Records Section */}
      <div className="form-section cw-lore-section">
        <div className="cw-lore-header-bar">
          <div className="cw-lore-title-area">
            <h3 className="section-title">
              <i className="fas fa-book-sparkles"></i> Lore, Worldbuilding & Codex Records
            </h3>
            <p className="cw-lore-section-subtitle">
              Configure the mythic provenance, folklore, ecology, and canon records shown on the creature sheet.
            </p>
          </div>

          <div className="cw-lore-tab-pill-group">
            <button
              type="button"
              className={`cw-lore-pill-btn ${loreSectionTab === 'core' ? 'active' : ''}`}
              onClick={() => setLoreSectionTab('core')}
            >
              <i className="fas fa-scroll"></i> Core Codex Lore
              <span className={`cw-tab-count-badge ${corePillarsCount === 4 ? 'complete' : ''}`}>
                {corePillarsCount}/4
              </span>
            </button>
            <button
              type="button"
              className={`cw-lore-pill-btn ${loreSectionTab === 'advanced' ? 'active' : ''}`}
              onClick={() => setLoreSectionTab('advanced')}
            >
              <i className="fas fa-layer-group"></i> Canon & Ecology
              {advancedLoreFilled && <span className="cw-tab-dot-badge"></span>}
            </button>
            <button
              type="button"
              className={`cw-lore-pill-btn ${loreSectionTab === 'folklore' ? 'active' : ''}`}
              onClick={() => setLoreSectionTab('folklore')}
            >
              <i className="fas fa-feather-pointed"></i> Folklore & Artwork
              {folkloreFilled && <span className="cw-tab-dot-badge"></span>}
            </button>
          </div>
        </div>

        {/* Quick Lore Archetype Presets Strip */}
        <div className="cw-lore-archetype-strip">
          <div className="cw-archetype-label">
            <i className="fas fa-wand-magic-sparkles"></i>
            <span>Quick Lore Starters:</span>
          </div>
          <div className="cw-archetype-chips">
            {LORE_ARCHETYPES.map((arch, idx) => (
              <button
                key={idx}
                type="button"
                className="cw-archetype-chip-btn"
                onClick={() => handleApplyArchetype(arch)}
                title={`Autofill lore with ${arch.name} archetype (${arch.region})`}
              >
                {arch.name}
              </button>
            ))}
            <button
              type="button"
              className="cw-archetype-clear-btn"
              onClick={handleClearLore}
              title="Clear all lore fields"
            >
              <i className="fas fa-eraser"></i> Clear
            </button>
          </div>
        </div>

        {/* Ecology Metadata Bar (Always visible in all tabs) */}
        <div className="cw-lore-meta-row">
          <div className="form-group quarter-width">
            <label htmlFor="creature-role">
              <i className="fas fa-shield-halved"></i> Role / Title
            </label>
            <input
              id="creature-role"
              type="text"
              value={wizardState.role || ''}
              onChange={(e) => handleLoreChange('role', e.target.value)}
              placeholder="e.g. The memory-merchant goblin"
              maxLength={80}
            />
          </div>

          <div className="form-group quarter-width">
            <label htmlFor="creature-danger-level">
              <i className="fas fa-skull"></i> Danger Level
            </label>
            <select
              id="creature-danger-level"
              value={wizardState.dangerLevel || 'Medium'}
              onChange={(e) => handleLoreChange('dangerLevel', e.target.value)}
              className="enhanced-select"
            >
              {DANGER_LEVELS.map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          <div className="form-group quarter-width">
            <label htmlFor="creature-region">
              <i className="fas fa-map-location-dot"></i> Region / Territory
            </label>
            <input
              id="creature-region"
              type="text"
              list="known-regions-list"
              value={wizardState.region || ''}
              onChange={(e) => handleLoreChange('region', e.target.value)}
              placeholder="e.g. Frostwood Reach"
              maxLength={60}
            />
            <datalist id="known-regions-list">
              {KNOWN_REGIONS.map(reg => (
                <option key={reg} value={reg} />
              ))}
            </datalist>
          </div>

          <div className="form-group quarter-width">
            <label htmlFor="creature-habitat">
              <i className="fas fa-compass"></i> Habitat & Roaming
            </label>
            <input
              id="creature-habitat"
              type="text"
              value={wizardState.habitat || ''}
              onChange={(e) => handleLoreChange('habitat', e.target.value)}
              placeholder="e.g. Misty crossroads, twilight fog..."
              maxLength={100}
            />
          </div>
        </div>

        {/* Tab 1: Core 4 Lore Pillars */}
        {loreSectionTab === 'core' && (
          <div className="cw-lore-pillars-grid">
            <div className="cw-lore-pillar-card">
              <div className="cw-lore-pillar-header">
                <div className="cw-pillar-icon-box origin-box">
                  <i className="fas fa-feather-pointed"></i>
                </div>
                <div className="cw-pillar-title-wrap">
                  <h4>Mythic Provenance</h4>
                  <span>True origin and pre-Binding lineage</span>
                </div>
              </div>
              <textarea
                value={wizardState.origin || wizardState.loreCanon?.trueOrigin || ''}
                onChange={(e) => {
                  handleLoreChange('origin', e.target.value);
                  handleLoreCanonChange('trueOrigin', e.target.value);
                }}
                placeholder="Where does this creature truly originate? Detail its ancient history before the Great Binding and how it came into being..."
                rows={4}
                maxLength={2000}
              />
              <div className="input-helper">
                <span className="character-count">{(wizardState.origin || wizardState.loreCanon?.trueOrigin || '').length}/2000</span>
              </div>
            </div>

            <div className="cw-lore-pillar-card">
              <div className="cw-lore-pillar-header">
                <div className="cw-pillar-icon-box folklore-box">
                  <i className="fas fa-book-open"></i>
                </div>
                <div className="cw-pillar-title-wrap">
                  <h4>Folklore Record</h4>
                  <span>Myths, superstitions & mortal tales</span>
                </div>
              </div>
              <textarea
                value={wizardState.heritage || wizardState.loreCanon?.folklore || ''}
                onChange={(e) => {
                  handleLoreChange('heritage', e.target.value);
                  handleLoreCanonChange('folklore', e.target.value);
                }}
                placeholder="What do local folk, bards, and commoners believe about this creature? What tales are told at hearths vs the reality?"
                rows={4}
                maxLength={2000}
              />
              <div className="input-helper">
                <span className="character-count">{(wizardState.heritage || wizardState.loreCanon?.folklore || '').length}/2000</span>
              </div>
            </div>

            <div className="cw-lore-pillar-card">
              <div className="cw-lore-pillar-header">
                <div className="cw-pillar-icon-box nature-box">
                  <i className="fas fa-dragon"></i>
                </div>
                <div className="cw-pillar-title-wrap">
                  <h4>Nature & World Function</h4>
                  <span>Ecosystem role, habits & guardianship</span>
                </div>
              </div>
              <textarea
                value={wizardState.nature || wizardState.loreCanon?.function || ''}
                onChange={(e) => {
                  handleLoreChange('nature', e.target.value);
                  handleLoreCanonChange('function', e.target.value);
                }}
                placeholder="How does it behave in the living world? Describe its diet, instincts, environmental impact, or trade..."
                rows={4}
                maxLength={2000}
              />
              <div className="input-helper">
                <span className="character-count">{(wizardState.nature || wizardState.loreCanon?.function || '').length}/2000</span>
              </div>
            </div>

            <div className="cw-lore-pillar-card">
              <div className="cw-lore-pillar-header">
                <div className="cw-pillar-icon-box depth-box">
                  <i className="fas fa-mask-cat"></i>
                </div>
                <div className="cw-pillar-title-wrap">
                  <h4>The Truth Beneath / Wyrd Ecology</h4>
                  <span>Secret depths, tragic truth, or cosmic tie</span>
                </div>
              </div>
              <textarea
                value={wizardState.depth || wizardState.loreCanon?.wyrdRelationship || ''}
                onChange={(e) => {
                  handleLoreChange('depth', e.target.value);
                  handleLoreCanonChange('wyrdRelationship', e.target.value);
                }}
                placeholder="What hidden tragedy, mystery, or relationship with the Wyrd defines this creature beneath the surface?"
                rows={4}
                maxLength={2000}
              />
              <div className="input-helper">
                <span className="character-count">{(wizardState.depth || wizardState.loreCanon?.wyrdRelationship || '').length}/2000</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Advanced Canon & Classification */}
        {loreSectionTab === 'advanced' && (
          <div className="cw-advanced-lore-grid">
            <div className="form-group full-width">
              <h4 className="cw-subsection-title">
                <i className="fas fa-layer-group"></i> Mythrill Classification Layer
              </h4>
              <div className="classification-row">
                <div className="form-group half-width">
                  <label htmlFor="classification-status">Layer Status</label>
                  <select
                    id="classification-status"
                    value={wizardState.loreClassification?.status || ''}
                    onChange={(e) => handleClassificationChange('status', e.target.value)}
                    className="enhanced-select"
                  >
                    {LORE_STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group half-width">
                  <label htmlFor="classification-origin">Origin Class</label>
                  <select
                    id="classification-origin"
                    value={wizardState.loreClassification?.originClass || ''}
                    onChange={(e) => handleClassificationChange('originClass', e.target.value)}
                    className="enhanced-select"
                  >
                    {ORIGIN_CLASSES.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="lore-note">
                <i className="fas fa-note-sticky"></i> Canon Editorial Note / Layer Note
              </label>
              <textarea
                id="lore-note"
                value={wizardState.loreNote || ''}
                onChange={(e) => handleLoreChange('loreNote', e.target.value)}
                placeholder="e.g. Folklore records this creature rather than creates it: pre-Binding baseline remains independent of the Wyrd."
                rows={2}
                maxLength={500}
              />
              <div className="input-helper">
                <span className="character-count">{(wizardState.loreNote || '').length}/500</span>
              </div>
            </div>

            <div className="cw-lore-two-col">
              <div className="form-group">
                <label htmlFor="lore-values">
                  <i className="fas fa-shield-heart"></i> Values & Guardianship
                </label>
                <textarea
                  id="lore-values"
                  value={wizardState.loreCanon?.values || ''}
                  onChange={(e) => handleLoreCanonChange('values', e.target.value)}
                  placeholder="What does this creature value, protect, or uphold? (e.g. safe passage, memory retention, sacred springs)"
                  rows={3}
                  maxLength={1000}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lore-binding-effect">
                  <i className="fas fa-temperature-half"></i> Great Binding & Warmth History
                </label>
                <textarea
                  id="lore-binding-effect"
                  value={wizardState.loreCanon?.bindingEffect || ''}
                  onChange={(e) => handleLoreCanonChange('bindingEffect', e.target.value)}
                  placeholder="How did the Great Binding, the failing of warmth, or winter fog reshape this creature's behavior or form?"
                  rows={3}
                  maxLength={1000}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Folklore Inspiration & Masthead Artwork */}
        {loreSectionTab === 'folklore' && (
          <div className="cw-folklore-roots-grid">
            <h4 className="cw-subsection-title">
              <i className="fas fa-book-journal-whills"></i> Real-World Folklore & Cryptid Roots
            </h4>
            
            <div className="cw-lore-two-col">
              <div className="form-group">
                <label htmlFor="folklore-primary-myth">Primary Mythological / Cryptid Root</label>
                <input
                  id="folklore-primary-myth"
                  type="text"
                  value={wizardState.folkloreInspiration?.primaryMyth || ''}
                  onChange={(e) => handleFolkloreInspirationChange('primaryMyth', e.target.value)}
                  placeholder="e.g. Abada (Central African/Congo cryptid) & Monoceros"
                />
              </div>

              <div className="form-group">
                <label htmlFor="folklore-cryptid-roots">Archetype / Cryptid Roots</label>
                <input
                  id="folklore-cryptid-roots"
                  type="text"
                  value={wizardState.folkloreInspiration?.cryptidRoots || ''}
                  onChange={(e) => handleFolkloreInspirationChange('cryptidRoots', e.target.value)}
                  placeholder="e.g. The shy horned water-cleanser"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="folklore-adaptation">Setting Adaptation (Mythrill Translation)</label>
              <textarea
                id="folklore-adaptation"
                value={wizardState.folkloreInspiration?.settingAdaptation || ''}
                onChange={(e) => handleFolkloreInspirationChange('settingAdaptation', e.target.value)}
                placeholder="Explain how real-world folklore or cryptid myths were translated and adapted into the world of Mythrill..."
                rows={3}
                maxLength={1000}
              />
            </div>

            <h4 className="cw-subsection-title" style={{ marginTop: '16px' }}>
              <i className="fas fa-portrait"></i> Codex Masthead Portrait Artwork
            </h4>
            <div className="cw-lore-two-col">
              <div className="form-group">
                <label htmlFor="codex-illustration">Codex Illustration Image URL</label>
                <input
                  id="codex-illustration"
                  type="text"
                  value={wizardState.illustration || ''}
                  onChange={(e) => handleLoreChange('illustration', e.target.value)}
                  placeholder="e.g. /assets/images/creatures/custom_beast.png or web URL"
                />
              </div>

              <div className="form-group">
                <label htmlFor="codex-caption">Illustration Caption</label>
                <input
                  id="codex-caption"
                  type="text"
                  value={wizardState.illustrationCaption || ''}
                  onChange={(e) => handleLoreChange('illustrationCaption', e.target.value)}
                  placeholder="e.g. Emerging from the twilight fog along the frost paths"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tags Section - More compact */}
      <div className="form-section">
        <h3 className="section-title">
          <i className="fas fa-tags"></i> Tags & Organization
        </h3>

        <div className="form-group">
          <label htmlFor="creature-tags">
            Descriptive Tags
            <span className="optional-label">(Press Enter to add tags)</span>
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

