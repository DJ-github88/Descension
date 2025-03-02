import React, { useState, useEffect } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import { StepNavigation } from '../common';
import ColorPicker from '../common/ColorPicker';
import '../styles/spell-wizard.css';

// Visual themes for spells
const VISUAL_THEMES = [
  {
    id: 'fire',
    name: 'Fire',
    description: 'Flames, embers, and heat distortions',
    icon: 'spell_fire_flamebolt',
    color: '#FF4400'
  },
  {
    id: 'frost',
    name: 'Frost',
    description: 'Ice crystals, snow, and freezing effects',
    icon: 'spell_frost_frostbolt02',
    color: '#00CCFF'
  },
  {
    id: 'arcane',
    name: 'Arcane',
    description: 'Magical runes, sparkles, and energy swirls',
    icon: 'spell_holy_magicalsentry',
    color: '#FF00FF'
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Leaves, vines, and natural growth',
    icon: 'spell_nature_naturetouchgrow',
    color: '#44FF44'
  },
  {
    id: 'shadow',
    name: 'Shadow',
    description: 'Dark wisps, void energy, and darkness',
    icon: 'spell_shadow_shadowbolt',
    color: '#660066'
  },
  {
    id: 'holy',
    name: 'Holy',
    description: 'Divine light, halos, and sacred symbols',
    icon: 'spell_holy_holybolt',
    color: '#FFFF00'
  }
];

// Visual effects for spells
const VISUAL_EFFECTS = [
  {
    id: 'projectile',
    name: 'Projectile',
    description: 'A missile or bolt that travels in a straight line',
    examples: ['Magic Missile', 'Firebolt', 'Ray of Frost']
  },
  {
    id: 'beam',
    name: 'Beam',
    description: 'A continuous stream of energy',
    examples: ['Disintegrate', 'Sunbeam', 'Lightning Bolt']
  },
  {
    id: 'nova',
    name: 'Nova',
    description: 'An explosion or burst radiating outward',
    examples: ['Fireball', 'Thunderwave', 'Shatter']
  },
  {
    id: 'aura',
    name: 'Aura',
    description: 'A persistent field of energy around a target',
    examples: ['Shield', 'Protection from Evil', 'Antimagic Field']
  },
  {
    id: 'vortex',
    name: 'Vortex',
    description: 'A swirling pattern that pulls or pushes',
    examples: ['Black Hole', 'Whirlwind', 'Maelstrom']
  }
];

// Sound categories for spells
const SOUND_CATEGORIES = [
  {
    id: 'elemental',
    name: 'Elemental',
    description: 'Natural forces like fire, water, wind',
    variants: ['crackling', 'flowing', 'whooshing']
  },
  {
    id: 'magical',
    name: 'Magical',
    description: 'Arcane and mystical sounds',
    variants: ['sparkle', 'hum', 'pulse']
  },
  {
    id: 'vocal',
    name: 'Vocal',
    description: 'Voice-based sounds and chants',
    variants: ['chant', 'whisper', 'shout']
  },
  {
    id: 'impact',
    name: 'Impact',
    description: 'Collision and explosion sounds',
    variants: ['boom', 'crash', 'blast']
  }
];

// Animation timing options
const ANIMATION_TIMING = [
  {
    id: 'instant',
    name: 'Instant',
    description: 'Quick and immediate effect',
    castingStyle: 'Best for quick spells and cantrips'
  },
  {
    id: 'buildup',
    name: 'Build-up',
    description: 'Gradually intensifying effect',
    castingStyle: 'Suits charging or concentration spells'
  },
  {
    id: 'pulsing',
    name: 'Pulsing',
    description: 'Rhythmic repeating effect',
    castingStyle: 'Good for sustained or channeled spells'
  },
  {
    id: 'phased',
    name: 'Phased',
    description: 'Multiple distinct stages',
    castingStyle: 'Works well for complex ritual spells'
  }
];

const Step7VisualsAudio = () => {
  const { spellData, updateSpellData } = useSpellWizardStore();
  
  // Local state for visual and audio selections
  const [selectedTheme, setSelectedTheme] = useState(spellData.visualTheme || '');
  const [selectedEffect, setSelectedEffect] = useState(spellData.visualEffect || '');
  const [selectedSoundCategory, setSelectedSoundCategory] = useState(spellData.soundCategory || '');
  const [selectedSoundVariant, setSelectedSoundVariant] = useState(spellData.soundVariant || '');
  const [selectedTiming, setSelectedTiming] = useState(spellData.animationTiming || '');
  const [useCustomColors, setUseCustomColors] = useState(spellData.useCustomColors || false);
  const [primaryColor, setPrimaryColor] = useState(spellData.primaryColor || '#FF4400');
  const [secondaryColor, setSecondaryColor] = useState(spellData.secondaryColor || '#FF8800');
  const [accentColor, setAccentColor] = useState(spellData.accentColor || '#FFCC00');
  
  // Visual descriptions
  const [castingDescription, setCastingDescription] = useState(spellData.castingDescription || '');
  const [effectDescription, setEffectDescription] = useState(spellData.effectDescription || '');
  const [impactDescription, setImpactDescription] = useState(spellData.impactDescription || '');
  
  // Update spell data when selections change
  useEffect(() => {
    updateSpellData({
      visualTheme: selectedTheme,
      visualEffect: selectedEffect,
      soundCategory: selectedSoundCategory,
      soundVariant: selectedSoundVariant,
      animationTiming: selectedTiming,
      useCustomColors: useCustomColors,
      primaryColor,
      secondaryColor,
      accentColor,
      castingDescription,
      effectDescription,
      impactDescription
    });
  }, [
    selectedTheme,
    selectedEffect,
    selectedSoundCategory,
    selectedSoundVariant,
    selectedTiming,
    useCustomColors,
    primaryColor,
    secondaryColor,
    accentColor,
    castingDescription,
    effectDescription,
    impactDescription,
    updateSpellData
  ]);
  
  // Get the current theme's color if one is selected
  const getThemeColor = () => {
    const theme = VISUAL_THEMES.find(t => t.id === selectedTheme);
    return theme ? theme.color : '#FF4400';
  };
  
  // Generate description suggestions based on current selections
  const generateSuggestion = (type) => {
    const theme = VISUAL_THEMES.find(t => t.id === selectedTheme);
    const effect = VISUAL_EFFECTS.find(e => e.id === selectedEffect);
    
    if (!theme || !effect) return '';
    
    switch (type) {
      case 'casting':
        return `As you cast the spell, ${theme.name.toLowerCase()} energy begins to gather around your hands, forming a ${effect.name.toLowerCase()}-like pattern.`;
      case 'effect':
        return `The ${theme.name.toLowerCase()} energy ${effect.id === 'projectile' ? 'launches' : 'manifests'} as a ${effect.name.toLowerCase()}, ${theme.description.toLowerCase()}.`;
      case 'impact':
        return `Upon impact, the spell ${effect.id === 'nova' ? 'explodes' : 'releases'} in a burst of ${theme.name.toLowerCase()} energy, ${theme.description.toLowerCase()}.`;
      default:
        return '';
    }
  };
  
  return (
    <div className="visuals-audio-step">
      <div className="section">
        <h3>Visual Theme</h3>
        <p className="section-description">
          Choose the primary visual theme for your spell's appearance.
        </p>
        
        <div className="visual-theme-grid">
          {VISUAL_THEMES.map(theme => (
            <div
              key={theme.id}
              className={`visual-theme-option ${selectedTheme === theme.id ? 'selected' : ''}`}
              onClick={() => setSelectedTheme(theme.id)}
            >
              <div className="theme-icon">
                <img 
                  src={`https://wow.zamimg.com/images/wow/icons/large/${theme.icon}.jpg`}
                  alt={theme.name}
                  onError={(e) => {
                    e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                  }}
                />
              </div>
              <div className="theme-info">
                <div className="theme-name">{theme.name}</div>
                <div className="theme-description">{theme.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="section">
        <h3>Visual Effect</h3>
        <p className="section-description">
          Select how your spell manifests visually when cast.
        </p>
        
        <div className="visual-effect-grid">
          {VISUAL_EFFECTS.map(effect => (
            <div
              key={effect.id}
              className={`visual-effect-option ${selectedEffect === effect.id ? 'selected' : ''}`}
              onClick={() => setSelectedEffect(effect.id)}
            >
              <div className="effect-name">{effect.name}</div>
              <div className="effect-description">{effect.description}</div>
              <div className="effect-examples">
                <span className="examples-label">Examples: </span>
                {effect.examples.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="section">
        <h3>Sound Design</h3>
        <p className="section-description">
          Choose the primary sound category and specific variants for your spell.
        </p>
        
        <div className="sound-category-grid">
          {SOUND_CATEGORIES.map(category => (
            <div
              key={category.id}
              className={`sound-category-option ${selectedSoundCategory === category.id ? 'selected' : ''}`}
              onClick={() => setSelectedSoundCategory(category.id)}
            >
              <div className="category-name">{category.name}</div>
              <div className="category-description">{category.description}</div>
            </div>
          ))}
        </div>
        
        {selectedSoundCategory && (
          <div className="sound-variants-container">
            <div className="variants-title">Sound Variants</div>
            <div className="sound-variants-grid">
              {SOUND_CATEGORIES.find(c => c.id === selectedSoundCategory)?.variants.map(variant => (
                <div
                  key={variant}
                  className={`sound-variant-option ${selectedSoundVariant === variant ? 'selected' : ''}`}
                  onClick={() => setSelectedSoundVariant(variant)}
                >
                  {variant}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="section">
        <h3>Animation Timing</h3>
        <p className="section-description">
          Set how your spell's visual effects are timed and sequenced.
        </p>
        
        <div className="animation-timing-grid">
          {ANIMATION_TIMING.map(timing => (
            <div
              key={timing.id}
              className={`animation-timing-option ${selectedTiming === timing.id ? 'selected' : ''}`}
              onClick={() => setSelectedTiming(timing.id)}
            >
              <div className="timing-name">{timing.name}</div>
              <div className="timing-description">{timing.description}</div>
              <div className="casting-style">
                <span className="style-label">Style: </span>
                {timing.castingStyle}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="section">
        <h3>Color Customization</h3>
        <div className="color-customization">
          <div className="custom-colors-toggle">
            <label className="toggle-container">
              <input
                type="checkbox"
                checked={useCustomColors}
                onChange={(e) => setUseCustomColors(e.target.checked)}
              />
              <span className="toggle-label">Use Custom Colors</span>
            </label>
            <div className="toggle-hint">
              Override the default theme colors with your own color scheme
            </div>
          </div>
          
          {useCustomColors && (
            <div className="color-pickers-container">
              <div className="color-picker-row">
                <div className="color-picker-wrapper">
                  <label>Primary Color</label>
                  <ColorPicker
                    color={primaryColor}
                    onChange={setPrimaryColor}
                  />
                  <div className="color-hint">Main spell effect color</div>
                </div>
                
                <div className="color-picker-wrapper">
                  <label>Secondary Color</label>
                  <ColorPicker
                    color={secondaryColor}
                    onChange={setSecondaryColor}
                  />
                  <div className="color-hint">Supporting effects color</div>
                </div>
                
                <div className="color-picker-wrapper">
                  <label>Accent Color</label>
                  <ColorPicker
                    color={accentColor}
                    onChange={setAccentColor}
                  />
                  <div className="color-hint">Highlights and details</div>
                </div>
              </div>
              
              <div className="color-preview">
                <h5>Color Preview</h5>
                <div 
                  className="spell-color-preview"
                  style={{
                    background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
                    border: `2px solid ${accentColor}`
                  }}
                />
                <div className="preview-note">
                  Colors will be applied to your spell's visual effects
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="section">
        <h3>Visual Descriptions</h3>
        <div className="descriptions-container">
          <div className="description-field">
            <label>Casting Description</label>
            <div className="suggestion-container">
              <button
                className="suggest-btn"
                onClick={() => setCastingDescription(generateSuggestion('casting'))}
                disabled={!selectedTheme || !selectedEffect}
              >
                Suggest Description
              </button>
            </div>
            <textarea
              className="description-input"
              value={castingDescription}
              onChange={(e) => setCastingDescription(e.target.value)}
              placeholder="Describe how the spell looks when being cast..."
            />
          </div>
          
          <div className="description-field">
            <label>Effect Description</label>
            <div className="suggestion-container">
              <button
                className="suggest-btn"
                onClick={() => setEffectDescription(generateSuggestion('effect'))}
                disabled={!selectedTheme || !selectedEffect}
              >
                Suggest Description
              </button>
            </div>
            <textarea
              className="description-input"
              value={effectDescription}
              onChange={(e) => setEffectDescription(e.target.value)}
              placeholder="Describe how the spell's effect appears..."
            />
          </div>
          
          <div className="description-field">
            <label>Impact Description</label>
            <div className="suggestion-container">
              <button
                className="suggest-btn"
                onClick={() => setImpactDescription(generateSuggestion('impact'))}
                disabled={!selectedTheme || !selectedEffect}
              >
                Suggest Description
              </button>
            </div>
            <textarea
              className="description-input"
              value={impactDescription}
              onChange={(e) => setImpactDescription(e.target.value)}
              placeholder="Describe what happens when the spell hits..."
            />
          </div>
        </div>
      </div>
      
      <div className="section">
        <h3>Visual Preview</h3>
        <div className="visual-preview-container">
          {selectedTheme && selectedEffect ? (
            <div className="visual-preview">
              <div className={`spell-preview-animation ${selectedTiming}`}>
                <div className={`animation-effect ${selectedEffect}`}>
                  <div 
                    className={`effect-theme ${selectedTheme}`}
                    style={useCustomColors ? {
                      backgroundColor: primaryColor,
                      boxShadow: `0 0 15px ${primaryColor}, 0 0 30px ${secondaryColor}`,
                      borderColor: accentColor
                    } : {}}
                  />
                </div>
              </div>
              
              <div className="spell-visualization-description">
                <h5>Visual Summary</h5>
                <p>
                  {castingDescription && `${castingDescription} `}
                  {effectDescription && `${effectDescription} `}
                  {impactDescription && impactDescription}
                </p>
              </div>
            </div>
          ) : (
            <div className="empty-preview">
              Select a theme and effect type to see a preview
            </div>
          )}
        </div>
      </div>
      
      <StepNavigation />
    </div>
  );
};

export default Step7VisualsAudio;