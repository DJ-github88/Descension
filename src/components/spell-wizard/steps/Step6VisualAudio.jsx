import React, { useState, useEffect } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import { ColorPicker, IconSelector, AuraBuilder, StepNavigation } from '../common';
import '../styles/spell-wizard.css';

// Element colors and thematic elements for visual style (from original Step8Visuals)
const ELEMENT_THEMES = [
  { 
    id: 'fire', 
    name: 'Fire', 
    description: 'Flames, heat, and destruction',
    primaryColor: '#ff4500',
    secondaryColor: '#ffcc00',
    tertiaryColor: '#cc3300',
    keywords: ['blazing', 'burning', 'scorching', 'cinder', 'flame', 'inferno', 'ember']
  },
  { 
    id: 'frost', 
    name: 'Frost', 
    description: 'Ice, cold, and winter',
    primaryColor: '#00bfff',
    secondaryColor: '#f0f8ff',
    tertiaryColor: '#4169e1',
    keywords: ['freezing', 'icy', 'glacial', 'chilling', 'blizzard', 'winter', 'frozen']
  },
  { 
    id: 'arcane', 
    name: 'Arcane', 
    description: 'Magic, intellect, and cosmic energy',
    primaryColor: '#9932cc',
    secondaryColor: '#e0b0ff',
    tertiaryColor: '#4b0082',
    keywords: ['mystic', 'ethereal', 'astral', 'eldritch', 'spectral', 'enchanted', 'magical']
  },
  // Other element themes would continue here...
];

// Visual effect types for animation styles (from original Step8Visuals)
const VISUAL_EFFECTS = [
  { 
    id: 'projectile', 
    name: 'Projectile', 
    description: 'Object traveling from caster to target',
    examples: ['Arrow of fire', 'Ice spike', 'Magic missile']
  },
  { 
    id: 'beam', 
    name: 'Beam/Ray', 
    description: 'Continuous stream connecting caster and target',
    examples: ['Lightning bolt', 'Arcane beam', 'Death ray'] 
  },
  { 
    id: 'nova', 
    name: 'Nova/Explosion', 
    description: 'Outward burst from a central point',
    examples: ['Frost nova', 'Fire blast', 'Holy explosion'] 
  },
  // Other visual effect types would continue here...
];

// Sound effect categories (from original Step8Visuals)
const SOUND_CATEGORIES = [
  { id: 'whoosh', name: 'Whoosh/Movement', examples: ['Spell projectile', 'Teleport', 'Wind effect'] },
  { id: 'explosion', name: 'Explosion/Impact', examples: ['Fireball impact', 'Thunder clap', 'Ground slam'] },
  { id: 'zap', name: 'Zap/Electric', examples: ['Lightning bolt', 'Shock spell', 'Energy discharge'] },
  // Other sound categories would continue here...
];

// Animation timings (from original Step8Visuals)
const ANIMATION_TIMINGS = [
  { id: 'instant', name: 'Instant', description: 'Immediate effect (0-0.3s)', examples: ['Quick strike', 'Instant heal'] },
  { id: 'fast', name: 'Fast', description: 'Quick but visible (0.3-0.7s)', examples: ['Fireball', 'Magic missile'] },
  { id: 'medium', name: 'Medium', description: 'Standard duration (0.7-1.5s)', examples: ['Summon spell', 'Transform'] },
  { id: 'slow', name: 'Slow/Deliberate', description: 'Extended animation (1.5-3s)', examples: ['Ritual cast', 'Major summon'] }
];

const Step6VisualAudio = () => {
  const { 
    spellData, 
    updateSpellData, 
    setStepValidation,
    nextStep,
    prevStep
  } = useSpellWizardStore();
  
  // Local state
  const [selectedTheme, setSelectedTheme] = useState(spellData.visualTheme || 'arcane');
  const [selectedEffect, setSelectedEffect] = useState(spellData.visualEffect || 'projectile');
  const [selectedSound, setSelectedSound] = useState(spellData.soundCategory || 'magical');
  const [selectedTiming, setSelectedTiming] = useState(spellData.animationTiming || 'medium');
  const [customColors, setCustomColors] = useState({
    primary: spellData.customColors?.primary || '#9932cc',
    secondary: spellData.customColors?.secondary || '#e0b0ff',
    tertiary: spellData.customColors?.tertiary || '#4b0082'
  });
  const [useCustomColors, setUseCustomColors] = useState(spellData.useCustomColors || false);
  const [effectDescription, setEffectDescription] = useState(spellData.effectDescription || '');
  const [soundDescription, setSoundDescription] = useState(spellData.soundDescription || '');
  const [animationDescription, setAnimationDescription] = useState(spellData.animationDescription || '');
  const [isValid, setIsValid] = useState(true);
  
  // Get theme by ID
  const getThemeById = (themeId) => {
    return ELEMENT_THEMES.find(theme => theme.id === themeId) || ELEMENT_THEMES[2]; // Default to arcane
  };
  
  // Get theme colors
  const getThemeColors = () => {
    if (useCustomColors) {
      return customColors;
    }
    
    const theme = getThemeById(selectedTheme);
    return {
      primary: theme.primaryColor,
      secondary: theme.secondaryColor,
      tertiary: theme.tertiaryColor
    };
  };
  
  // Suggest theme based on damage types and thematic elements
  const getSuggestedTheme = () => {
    // Check if the spell has damage types that map to themes
    if (spellData.damageTypes && spellData.damageTypes.length > 0) {
      // Direct mapping of damage types to themes
      const damageTypeToTheme = {
        'fire': 'fire',
        'frost': 'frost',
        'arcane': 'arcane',
        'nature': 'nature',
        'shadow': 'shadow',
        'holy': 'holy',
        'lightning': 'lightning',
        'poison': 'poison',
        'necrotic': 'blood'
      };
      
      for (const damageType of spellData.damageTypes) {
        if (damageTypeToTheme[damageType]) {
          return damageTypeToTheme[damageType];
        }
      }
    }
    
    // Check thematic elements from Step 1
    if (spellData.thematicElements && spellData.thematicElements.length > 0) {
      for (const theme of ELEMENT_THEMES) {
        for (const keyword of theme.keywords) {
          if (spellData.thematicElements.includes(keyword)) {
            return theme.id;
          }
        }
      }
    }
    
    // Default based on class or spell category
    if (spellData.class) {
      // Suggest theme based on class
      const classToTheme = {
        'pyrofiend': 'fire',
        'elementalist': 'arcane',
        'shadowdancer': 'shadow',
        'celestial': 'holy',
        'stormbringer': 'lightning',
        'necromancer': 'blood',
        'druid': 'nature'
        // Add more class to theme mappings as needed
      };
      
      if (classToTheme[spellData.class]) {
        return classToTheme[spellData.class];
      }
    }
    
    // Based on spell category
    if (spellData.category) {
      const categoryToTheme = {
        'damage': 'fire',
        'healing': 'holy',
        'buff': 'arcane',
        'debuff': 'shadow',
        'utility': 'nature'
      };
      
      if (categoryToTheme[spellData.category]) {
        return categoryToTheme[spellData.category];
      }
    }
    
    // Default fallback
    return 'arcane';
  };
  
  // Suggest visual effect based on spell properties
  const getSuggestedEffect = () => {
    if (spellData.targetingMode === 'aoe') {
      // Suggest based on AOE shape
      const shapeToEffect = {
        'circle': 'nova',
        'cone': 'cone',
        'line': 'beam',
        'custom': 'vortex'
      };
      
      if (shapeToEffect[spellData.aoeShape]) {
        return shapeToEffect[spellData.aoeShape];
      }
      
      return 'nova'; // Default for AOE
    }
    
    if (spellData.rangeType === 'melee') {
      return 'transform'; // Melee range often affects self or adjacent
    }
    
    if (spellData.rangeType === 'ranged') {
      return 'projectile'; // Default for ranged spells
    }
    
    if (spellData.rangeType === 'self') {
      return 'aura'; // Self spells often create auras
    }
    
    if (spellData.spellType === 'aura') {
      return 'aura'; // Explicit aura spell type
    }
    
    if (spellData.spellType === 'passive') {
      return 'transform'; // Passives often transform properties
    }
    
    // Based on categories
    if (spellData.category === 'damage' && spellData.subtype === 'dot') {
      return 'chain'; // DoTs often chain between targets
    }
    
    return 'projectile'; // Safe default
  };
  
  // Suggest animation timing based on spell properties
  const getSuggestedTiming = () => {
    if (spellData.castTimeType === 'instant') {
      return 'instant';
    }
    
    if (spellData.castTimeType === 'short') {
      return 'fast';
    }
    
    if (spellData.castTimeType === 'medium' || spellData.castTimeType === 'channeled') {
      return 'medium';
    }
    
    if (spellData.castTimeType === 'long' || spellData.castTimeType === 'charged') {
      return 'slow';
    }
    
    return 'medium'; // Default
  };
  
  // Initialize with suggested values
  useEffect(() => {
    // Only set default values if they haven't been set already
    if (!spellData.visualTheme) {
      const suggestedTheme = getSuggestedTheme();
      setSelectedTheme(suggestedTheme);
    }
    
    if (!spellData.visualEffect) {
      const suggestedEffect = getSuggestedEffect();
      setSelectedEffect(suggestedEffect);
    }
    
    if (!spellData.animationTiming) {
      const suggestedTiming = getSuggestedTiming();
      setSelectedTiming(suggestedTiming);
    }
  }, [spellData]);
  
  // Validation
  useEffect(() => {
    // This step is always valid since visuals/audio are optional
    setStepValidation(5, true);
    setIsValid(true);
  }, [setStepValidation]);
  
  // Update spell data with current values
  useEffect(() => {
    updateSpellData({
      visualTheme: selectedTheme,
      visualEffect: selectedEffect,
      soundCategory: selectedSound,
      animationTiming: selectedTiming,
      useCustomColors,
      customColors,
      effectDescription,
      soundDescription,
      animationDescription
    });
  }, [
    selectedTheme,
    selectedEffect,
    selectedSound,
    selectedTiming,
    useCustomColors,
    customColors,
    effectDescription,
    soundDescription,
    animationDescription,
    updateSpellData
  ]);
  
  // Handle theme selection
  const handleThemeSelect = (themeId) => {
    setSelectedTheme(themeId);
  };
  
  // Handle visual effect selection
  const handleEffectSelect = (effectId) => {
    setSelectedEffect(effectId);
  };
  
  // Handle sound category selection
  const handleSoundSelect = (soundId) => {
    setSelectedSound(soundId);
  };
  
  // Handle animation timing selection
  const handleTimingSelect = (timingId) => {
    setSelectedTiming(timingId);
  };
  
  // Handle custom color toggle
  const handleCustomColorToggle = () => {
    setUseCustomColors(prev => !prev);
    
    // If turning on custom colors, initialize with current theme colors
    if (!useCustomColors) {
      const themeColors = getThemeById(selectedTheme);
      setCustomColors({
        primary: themeColors.primaryColor,
        secondary: themeColors.secondaryColor,
        tertiary: themeColors.tertiaryColor
      });
    }
  };
  
  // Handle custom color change
  const handleColorChange = (colorType, value) => {
    setCustomColors(prev => ({
      ...prev,
      [colorType]: value
    }));
  };
  
  // Generate description suggestions
  const generateDescriptionSuggestion = () => {
    const theme = getThemeById(selectedTheme);
    const effect = VISUAL_EFFECTS.find(e => e.id === selectedEffect) || VISUAL_EFFECTS[0];
    
    const keywords = theme.keywords;
    const randomKeyword1 = keywords[Math.floor(Math.random() * keywords.length)];
    const randomKeyword2 = keywords[Math.floor(Math.random() * keywords.length)];
    
    let suggestion = '';
    
    switch (effect.id) {
      case 'projectile':
        suggestion = `A ${randomKeyword1} projectile of ${theme.name.toLowerCase()} energy that streaks toward the target, leaving a trail of ${randomKeyword2} energy.`;
        break;
      case 'beam':
        suggestion = `A sustained ${randomKeyword1} beam of ${theme.name.toLowerCase()} energy connects the caster to the target, pulsing with ${randomKeyword2} power.`;
        break;
      case 'nova':
        suggestion = `A ${randomKeyword1} burst of ${theme.name.toLowerCase()} energy explodes outward from the caster, washing over all nearby creatures with ${randomKeyword2} force.`;
        break;
      // Other effect suggestions would be handled similarly
      default:
        suggestion = `${randomKeyword1.charAt(0).toUpperCase() + randomKeyword1.slice(1)} energy of ${theme.name.toLowerCase()} manifests, creating a ${randomKeyword2} visual effect.`;
    }
    
    return suggestion;
  };
  
  // Generate sound description suggestions
  const generateSoundSuggestion = () => {
    const theme = getThemeById(selectedTheme);
    const sound = SOUND_CATEGORIES.find(s => s.id === selectedSound) || SOUND_CATEGORIES[3];
    
    const keywords = theme.keywords;
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    
    let suggestion = '';
    
    switch (sound.id) {
      case 'whoosh':
        suggestion = `A ${randomKeyword} whooshing sound as the ${theme.name.toLowerCase()} energy moves through the air.`;
        break;
      case 'explosion':
        suggestion = `A ${randomKeyword} explosion of sound as the ${theme.name.toLowerCase()} energy releases its power.`;
        break;
      // Other sound suggestions would be handled similarly
      default:
        suggestion = `${randomKeyword.charAt(0).toUpperCase() + randomKeyword.slice(1)} sounds infused with ${theme.name.toLowerCase()} energy.`;
    }
    
    return suggestion;
  };
  
  // Handle description suggestion
  const handleSuggestDescription = () => {
    setEffectDescription(generateDescriptionSuggestion());
  };
  
  // Handle sound suggestion
  const handleSuggestSound = () => {
    setSoundDescription(generateSoundSuggestion());
  };
  
  // Handle animation suggestion
  const handleSuggestAnimation = () => {
    const theme = getThemeById(selectedTheme);
    const timing = ANIMATION_TIMINGS.find(t => t.id === selectedTiming) || ANIMATION_TIMINGS[2];
    
    const keywords = theme.keywords;
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    
    let suggestion = '';
    
    switch (timing.id) {
      case 'instant':
        suggestion = `The effect appears instantly with a ${randomKeyword} flash of ${theme.name.toLowerCase()} energy.`;
        break;
      case 'fast':
        suggestion = `A quick, ${randomKeyword} animation that takes less than a second to complete.`;
        break;
      case 'medium':
        suggestion = `A ${randomKeyword} sequence that builds up over about a second before releasing its ${theme.name.toLowerCase()} energy.`;
        break;
      case 'slow':
        suggestion = `A deliberate, ${randomKeyword} buildup of ${theme.name.toLowerCase()} energy that creates anticipation before the effect is fully realized.`;
        break;
      default:
        suggestion = `A ${randomKeyword} animation sequence that showcases the ${theme.name.toLowerCase()} energy of the spell.`;
    }
    
    setAnimationDescription(suggestion);
  };
  
  // Colors for preview
  const colors = getThemeColors();
  
  return (
    <div className="visual-audio-step">
      <div className="section">
        <h4 className="section-title">Visual Theme</h4>
        <p className="section-description">
          Choose the primary elemental or magical theme for your spell's appearance.
        </p>
        
        {/* Recommendations banner */}
        <div className="recommendations-banner">
          <div className="recommendation-header">
            <span className="recommendation-icon">💡</span>
            <span>Recommended Theme: </span>
            <span className="recommendation-value">{getThemeById(getSuggestedTheme()).name}</span>
          </div>
          <p className="recommendation-reason">
            Based on your spell's 
            {spellData.damageTypes && spellData.damageTypes.length > 0 
              ? ` damage type (${spellData.damageTypes.join(', ')})` 
              : spellData.thematicElements && spellData.thematicElements.length > 0
                ? ` thematic elements (${spellData.thematicElements.join(', ')})`
                : ` category (${spellData.category || 'General'})`}
          </p>
        </div>
        
        <div className="theme-grid">
          {ELEMENT_THEMES.map(theme => (
            <div 
              key={theme.id}
              className={`theme-option ${selectedTheme === theme.id ? 'selected' : ''}`}
              onClick={() => handleThemeSelect(theme.id)}
              style={{
                '--primary-color': theme.primaryColor,
                '--secondary-color': theme.secondaryColor,
                '--tertiary-color': theme.tertiaryColor,
                borderColor: selectedTheme === theme.id ? theme.primaryColor : 'transparent'
              }}
            >
              <div 
                className="theme-color-preview"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                }}
              ></div>
              <div className="theme-info">
                <div className="theme-name" style={{ color: theme.primaryColor }}>{theme.name}</div>
                <div className="theme-description">{theme.description}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="custom-colors-section">
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="custom-colors"
              checked={useCustomColors}
              onChange={handleCustomColorToggle}
            />
            <label htmlFor="custom-colors">Use Custom Colors</label>
          </div>
          
          {useCustomColors && (
            <div className="color-pickers">
              <div className="color-picker-group">
                <label>Primary Color:</label>
                <ColorPicker
                  color={customColors.primary}
                  onChange={(color) => handleColorChange('primary', color)}
                  showPresets={true}
                  showGradient={true}
                />
              </div>
              <div className="color-picker-group">
                <label>Secondary Color:</label>
                <ColorPicker
                  color={customColors.secondary}
                  onChange={(color) => handleColorChange('secondary', color)}
                  showPresets={true}
                  showGradient={true}
                />
              </div>
              <div className="color-picker-group">
                <label>Tertiary Color:</label>
                <ColorPicker
                  color={customColors.tertiary}
                  onChange={(color) => handleColorChange('tertiary', color)}
                  showPresets={true}
                  showGradient={true}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="section two-columns">
        <div className="column">
          <h4 className="section-title">Visual Effect Type</h4>
          <p className="section-description">
            Select how your spell's visual effect appears in the game world.
          </p>
          
          {/* Recommendations for effect type */}
          <div className="mini-recommendation">
            Suggested: <strong>{VISUAL_EFFECTS.find(e => e.id === getSuggestedEffect())?.name || 'Projectile'}</strong> based on your spell's targeting mode and range.
          </div>
          
          <div className="effect-options">
            {VISUAL_EFFECTS.map(effect => (
              <div 
                key={effect.id}
                className={`effect-option ${selectedEffect === effect.id ? 'selected' : ''}`}
                onClick={() => handleEffectSelect(effect.id)}
                style={{
                  borderColor: selectedEffect === effect.id ? colors.primary : 'transparent'
                }}
              >
                <div className="effect-name" style={{ color: colors.primary }}>{effect.name}</div>
                <div className="effect-description">{effect.description}</div>
                <div className="effect-examples">
                  <span>Examples: </span>
                  {effect.examples.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="column">
          <h4 className="section-title">Sound Effects</h4>
          <p className="section-description">
            Choose the primary sound category for your spell.
          </p>
          
          <div className="sound-options">
            {SOUND_CATEGORIES.map(sound => (
              <div 
                key={sound.id}
                className={`sound-option ${selectedSound === sound.id ? 'selected' : ''}`}
                onClick={() => handleSoundSelect(sound.id)}
                style={{
                  borderColor: selectedSound === sound.id ? colors.primary : 'transparent'
                }}
              >
                <div className="sound-name" style={{ color: colors.primary }}>{sound.name}</div>
                <div className="sound-examples">
                  <span>Examples: </span>
                  {sound.examples.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="section">
        <h4 className="section-title">Animation Timing</h4>
        <p className="section-description">
          Select how quickly your spell's animation plays out.
        </p>
        
        {/* Recommendations for timing */}
        <div className="mini-recommendation">
          Suggested: <strong>{ANIMATION_TIMINGS.find(t => t.id === getSuggestedTiming())?.name || 'Medium'}</strong> based on your spell's cast time ({spellData.castTimeType || 'default'}).
        </div>
        
        <div className="timing-options">
          {ANIMATION_TIMINGS.map(timing => (
            <div 
              key={timing.id}
              className={`timing-option ${selectedTiming === timing.id ? 'selected' : ''}`}
              onClick={() => handleTimingSelect(timing.id)}
              style={{
                borderColor: selectedTiming === timing.id ? colors.primary : 'transparent'
              }}
            >
              <div className="timing-name" style={{ color: colors.primary }}>{timing.name}</div>
              <div className="timing-description">{timing.description}</div>
              <div className="timing-examples">
                <span>Examples: </span>
                {timing.examples.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="section">
        <h4 className="section-title">Visual Descriptions</h4>
        <p className="section-description">
          Describe the visual, sound, and animation details of your spell. These will be used by the game to create your spell's appearance.
        </p>
        
        <div className="description-container">
          <label>Visual Effect Description:</label>
          <div className="textarea-with-button">
            <textarea
              value={effectDescription}
              onChange={(e) => setEffectDescription(e.target.value)}
              placeholder="Describe what your spell looks like when cast..."
              className="effect-description"
              rows={3}
            />
            <button 
              className="suggest-btn"
              onClick={handleSuggestDescription}
              style={{ backgroundColor: colors.primary }}
            >
              Suggest
            </button>
          </div>
          
          <label>Sound Effect Description:</label>
          <div className="textarea-with-button">
            <textarea
              value={soundDescription}
              onChange={(e) => setSoundDescription(e.target.value)}
              placeholder="Describe what your spell sounds like..."
              className="sound-description"
              rows={2}
            />
            <button 
              className="suggest-btn"
              onClick={handleSuggestSound}
              style={{ backgroundColor: colors.primary }}
            >
              Suggest
            </button>
          </div>
          
          <label>Animation Description:</label>
          <div className="textarea-with-button">
            <textarea
              value={animationDescription}
              onChange={(e) => setAnimationDescription(e.target.value)}
              placeholder="Describe how your spell animates over time..."
              className="animation-description"
              rows={2}
            />
            <button 
              className="suggest-btn"
              onClick={handleSuggestAnimation}
              style={{ backgroundColor: colors.primary }}
            >
              Suggest
            </button>
          </div>
        </div>
        
        <div className="visual-preview">
          <h5>Theme Preview</h5>
          <div 
            className="preview-box"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}33, ${colors.secondary}33)`,
              border: `2px solid ${colors.primary}`
            }}
          >
            <div 
              className="preview-inner"
              style={{
                background: `radial-gradient(circle, ${colors.secondary}66, ${colors.primary}66)`,
                boxShadow: `0 0 15px ${colors.primary}`
              }}
            >
              <div className="preview-effect">
                <div 
                  className={`preview-${selectedEffect}`}
                  style={{
                    backgroundColor: `${colors.tertiary}99`,
                    border: `1px solid ${colors.secondary}`
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div className="preview-legend">
            <div className="legend-item">
              <div className="color-swatch" style={{ backgroundColor: colors.primary }}></div>
              <span>Primary</span>
            </div>
            <div className="legend-item">
              <div className="color-swatch" style={{ backgroundColor: colors.secondary }}></div>
              <span>Secondary</span>
            </div>
            <div className="legend-item">
              <div className="color-swatch" style={{ backgroundColor: colors.tertiary }}></div>
              <span>Tertiary</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Integration with spell properties */}
      <div className="section">
        <h4 className="section-title">Effects Integration</h4>
        <p className="section-description">
          How your visual effects integrate with your spell's mechanics.
        </p>
        
        <div className="integration-cards">
          {/* Damage Type Integration */}
          {spellData.damageTypes && spellData.damageTypes.length > 0 && (
            <div className="integration-card">
              <h5>Damage Type Integration</h5>
              <p>
                Your {spellData.damageTypes.join('/')} damage will be represented visually with {getThemeById(selectedTheme).name.toLowerCase()} effects,
                making the source of damage clear to players.
              </p>
            </div>
          )}
          
          {/* AOE Visual Integration */}
          {spellData.targetingMode === 'aoe' && (
            <div className="integration-card">
              <h5>Area Effect Visualization</h5>
              <p>
                The {spellData.aoeShape || 'area'} shape will be displayed using {getThemeById(selectedTheme).name.toLowerCase()} 
                energy, with a radius of {spellData.aoeSize || '?'} feet.
              </p>
            </div>
          )}
          
          {/* Cast Time Integration */}
          {spellData.castTimeType && spellData.castTimeType !== 'instant' && (
            <div className="integration-card">
              <h5>Cast Animation</h5>
              <p>
                During the {spellData.castTimeValue || '?'}-second cast time, the caster will channel
                {getThemeById(selectedTheme).name.toLowerCase()} energy that intensifies until release.
              </p>
            </div>
          )}
          
          {/* Special Effects Integration */}
          {selectedEffect === 'transform' && (
            <div className="integration-card">
              <h5>Transformation Effects</h5>
              <p>
                Targets affected by this spell will be visibly transformed with {getThemeById(selectedTheme).name.toLowerCase()}
                energy effects for the duration.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <StepNavigation 
        currentStep={5} 
        totalSteps={8} 
        onNext={nextStep} 
        onPrev={prevStep} 
        isNextEnabled={true}
      />
    </div>
  );
};

export default Step6VisualAudio;