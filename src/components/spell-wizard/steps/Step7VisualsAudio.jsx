import React, { useState, useEffect, useRef } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import '../styles/Pages/wizard-steps.css';
import '../styles/Layout/wizard-layout.css';
import '../styles/Components/preview-card.css';
import '../styles/Pages/Visuals.css';
import ColorPicker from '../common/ColorPicker';
import {SpellPreview } from '../common';

// Enhanced visual themes for spells with expanded options
const VISUAL_THEMES = [
  {
    id: 'fire',
    name: 'Fire',
    description: 'Flames, embers, and heat distortions',
    icon: 'spell_fire_flamebolt',
    color: '#FF4400',
    particleColor: '#FF8800',
    glowColor: 'rgba(255, 68, 0, 0.6)',
    animationStyle: 'flicker'
  },
  {
    id: 'frost',
    name: 'Frost',
    description: 'Ice crystals, snowflakes, and mist',
    icon: 'spell_frost_frostbolt02',
    color: '#00CCFF',
    particleColor: '#88DDFF',
    glowColor: 'rgba(0, 204, 255, 0.6)',
    animationStyle: 'sparkle'
  },
  {
    id: 'arcane',
    name: 'Arcane',
    description: 'Glowing runes, energy swirls, and arcane symbols',
    icon: 'spell_arcane_blast',
    color: '#CC44FF',
    particleColor: '#AA55FF',
    glowColor: 'rgba(204, 68, 255, 0.6)',
    animationStyle: 'pulse'
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Leaves, vines, and natural energy',
    icon: 'spell_nature_naturetouchgrow',
    color: '#44DD44',
    particleColor: '#66FF66',
    glowColor: 'rgba(68, 221, 68, 0.6)',
    animationStyle: 'grow'
  },
  {
    id: 'shadow',
    name: 'Shadow',
    description: 'Darkness, void tendrils, and shadow mist',
    icon: 'spell_shadow_shadowbolt',
    color: '#8800AA',
    particleColor: '#AA33DD',
    glowColor: 'rgba(136, 0, 170, 0.6)',
    animationStyle: 'swirl'
  },
  {
    id: 'holy',
    name: 'Holy',
    description: 'Divine light, golden radiance, and holy symbols',
    icon: 'spell_holy_holybolt',
    color: '#FFDD00',
    particleColor: '#FFEE88',
    glowColor: 'rgba(255, 221, 0, 0.6)',
    animationStyle: 'radiate'
  },
  {
    id: 'lightning',
    name: 'Lightning',
    description: 'Electric arcs, sparks, and thunderbolts',
    icon: 'spell_lightning_lightningbolt01',
    color: '#55CCFF',
    particleColor: '#AADDFF',
    glowColor: 'rgba(85, 204, 255, 0.6)',
    animationStyle: 'flicker'
  },
  {
    id: 'water',
    name: 'Water',
    description: 'Flowing water, bubbles, and liquid motions',
    icon: 'ability_mage_waterjet',
    color: '#0088CC',
    particleColor: '#44AADD',
    glowColor: 'rgba(0, 136, 204, 0.6)',
    animationStyle: 'pulse'
  }
];

// Enhanced visual effects for spells with expanded options
const VISUAL_EFFECTS = [
  {
    id: 'projectile',
    name: 'Projectile',
    description: 'A missile or bolt that travels in a straight line',
    examples: ['Magic Missile', 'Firebolt', 'Ray of Frost'],
    icon: 'spell_fire_flamebolt',
    animationKey: 'projectile-animation'
  },
  {
    id: 'beam',
    name: 'Beam',
    description: 'A concentrated stream of energy',
    examples: ['Disintegrate', 'Sunbeam', 'Lightning Bolt'],
    icon: 'spell_arcane_starfire',
    animationKey: 'beam-animation'
  },
  {
    id: 'nova',
    name: 'Nova',
    description: 'Energy radiating outward from a central point',
    examples: ['Fireball', 'Frost Nova', 'Thunder Wave'],
    icon: 'spell_fire_selfdestruct',
    animationKey: 'nova-animation'
  },
  {
    id: 'aura',
    name: 'Aura',
    description: 'A persistent effect that surrounds the caster',
    examples: ['Shield', 'Armor of Agathys', 'Blade Ward'],
    icon: 'spell_holy_powerwordshield',
    animationKey: 'aura-animation'
  },
  {
    id: 'vortex',
    name: 'Vortex',
    description: 'A swirling spiral of energy that pulls targets in',
    examples: ['Black Hole', 'Maelstrom', 'Gravitational Pull'],
    icon: 'spell_arcane_prismaticcloak',
    animationKey: 'vortex-animation'
  },
  {
    id: 'rain',
    name: 'Rain',
    description: 'Elements or energy falling from above',
    examples: ['Meteor Swarm', 'Call Lightning', 'Ice Storm'],
    icon: 'spell_fire_meteor',
    animationKey: 'rain-animation'
  },
  {
    id: 'burst',
    name: 'Burst',
    description: 'A sudden explosion of energy',
    examples: ['Thunderclap', 'Shockwave', 'Mind Blast'],
    icon: 'spell_nature_wispsplode',
    animationKey: 'burst-animation'
  },
  {
    id: 'wave',
    name: 'Wave',
    description: 'A rippling wave that travels along the ground',
    examples: ['Tsunami', 'Earthquake', 'Sonic Wave'],
    icon: 'spell_holy_seismicslam',
    animationKey: 'wave-animation'
  }
];

// Enhanced sound categories for spells with expanded options
const SOUND_CATEGORIES = [
  {
    id: 'elemental',
    name: 'Elemental',
    description: 'Natural forces like fire, water, wind',
    variants: ['crackling', 'flowing', 'whooshing', 'rumbling', 'sizzling'],
    icon: 'spell_fire_fire'
  },
  {
    id: 'arcane',
    name: 'Arcane',
    description: 'Magical energies and mystical forces',
    variants: ['sparkle', 'hum', 'pulse', 'shimmer', 'warp'],
    icon: 'spell_arcane_blast'
  },
  {
    id: 'divine',
    name: 'Divine',
    description: 'Holy and spiritual manifestations',
    variants: ['chant', 'choir', 'bell', 'hymn', 'glow'],
    icon: 'spell_holy_holybolt'
  },
  {
    id: 'vocal',
    name: 'Vocal',
    description: 'Voice-based sounds and utterances',
    variants: ['whisper', 'shout', 'chant', 'murmur', 'roar'],
    icon: 'ability_warrior_battleshout'
  },
  {
    id: 'impact',
    name: 'Impact',
    description: 'Forceful collisions and explosions',
    variants: ['boom', 'crash', 'thud', 'blast', 'shatter'],
    icon: 'spell_fire_selfdestruct'
  },
  {
    id: 'mechanical',
    name: 'Mechanical',
    description: 'Machinery, clockwork, and construct sounds',
    variants: ['grinding', 'ticking', 'whirring', 'clicking', 'steam'],
    icon: 'spell_engineering_advancedrobot'
  },
  {
    id: 'natural',
    name: 'Natural',
    description: 'Organic and environmental sounds',
    variants: ['rustling', 'growling', 'chirping', 'howling', 'buzzing'],
    icon: 'spell_nature_naturetouchgrow'
  },
  {
    id: 'ethereal',
    name: 'Ethereal',
    description: 'Otherworldly and transcendent sounds',
    variants: ['echoing', 'resonating', 'haunting', 'cosmic', 'void'],
    icon: 'spell_arcane_mindmastery'
  }
];

// Enhanced animation timing options
const ANIMATION_TIMING = [
  {
    id: 'instant',
    name: 'Instant',
    description: 'Quick and immediate effect',
    castingStyle: 'Best for quick spells and cantrips',
    icon: 'spell_nature_wispsplode',
    animationDuration: '0.5s',
    behavior: 'Quick burst with minimal delay'
  },
  {
    id: 'buildup',
    name: 'Build-up',
    description: 'Gradually increasing in intensity',
    castingStyle: 'Emphasizes the power gathering before release',
    icon: 'spell_arcane_arcane04',
    animationDuration: '1.5s',
    behavior: 'Starts slow, accelerates to full power'
  },
  {
    id: 'pulsing',
    name: 'Pulsing',
    description: 'Rhythmic pulses of energy',
    castingStyle: 'Good for area effects and auras',
    icon: 'spell_arcane_prismaticcloak',
    animationDuration: '2s',
    behavior: 'Multiple pulses with distinct beats'
  },
  {
    id: 'phased',
    name: 'Phased',
    description: 'Multiple distinct stages of animation',
    castingStyle: 'Ideal for complex spells with multiple effects',
    icon: 'spell_arcane_portalofshiningsun',
    animationDuration: '2.5s',
    behavior: 'Distinct phases with step transitions'
  },
  {
    id: 'sustained',
    name: 'Sustained',
    description: 'Continuous effect that persists',
    castingStyle: 'Perfect for channeled spells and auras',
    icon: 'spell_holy_divineillumination',
    animationDuration: '3s',
    behavior: 'Long middle plateau with gentle start/end'
  },
  {
    id: 'delayed',
    name: 'Delayed',
    description: 'Brief pause before main effect triggers',
    castingStyle: 'Creates suspense and anticipation',
    icon: 'spell_nature_timestop',
    animationDuration: '1.8s',
    behavior: 'Pause followed by dramatic release'
  },
  {
    id: 'sequential',
    name: 'Sequential',
    description: 'Series of effects in a specific order',
    castingStyle: 'Good for combo spells or multi-hit abilities',
    icon: 'ability_rogue_shadowstep',
    animationDuration: '2.2s',
    behavior: 'Multiple iterations with alternating patterns'
  },
  {
    id: 'chaotic',
    name: 'Chaotic',
    description: 'Unpredictable and erratic animation pattern',
    castingStyle: 'Suits wild magic and unstable spells',
    icon: 'spell_shadow_unstableaffliction_3',
    animationDuration: '1.7s',
    behavior: 'Unpredictable with sudden changes'
  }
];

const getAnimationName = (effectId, timingId) => {
  if (!effectId || !timingId) return '';
  
  // Check if we have a specialized animation for this combination
  const specialAnimationName = `${effectId}-${timingId}`;
  
  // These combinations have specialized animations
  const specialAnimations = [
    'projectile-instant', 'projectile-buildup', 'projectile-pulsing', 'projectile-phased', 'projectile-chaotic',
    'beam-instant', 'beam-buildup', 'beam-pulsing', 'beam-phased', 'beam-chaotic',
    'nova-instant', 'nova-buildup', 'nova-pulsing', 'nova-phased', 'nova-chaotic',
    'aura-instant', 'aura-buildup', 'aura-pulsing', 'aura-phased', 'aura-chaotic',
    'rain-instant', 'rain-buildup', 'rain-pulsing', 'rain-phased', 'rain-chaotic',
    'vortex-instant', 'vortex-buildup', 'vortex-pulsing', 'vortex-phased', 'vortex-chaotic',
    'wave-instant', 'wave-buildup', 'wave-pulsing', 'wave-phased', 'wave-chaotic',
    'burst-instant', 'burst-buildup', 'burst-pulsing', 'burst-phased', 'burst-chaotic'
  ];
  
  if (specialAnimations.includes(specialAnimationName)) {
    return specialAnimationName;
  }
  
  // Fall back to default animation
  return `${effectId}-animation`;
};

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

  // Refs for particle effects
  const themeCardsRef = useRef(null);
  const previewRef = useRef(null);

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
  
  // Create theme particles effect - removed to prevent unwanted particles
  const createParticles = () => {
    // Disabled to prevent unwanted particles
  };

  // Helper functions to get theme properties
  const getThemeColor = () => {
    const theme = VISUAL_THEMES.find(t => t.id === selectedTheme);
    return theme ? theme.color : '#FF4400';
  };

  const getThemeGlowColor = () => {
    const theme = VISUAL_THEMES.find(t => t.id === selectedTheme);
    return theme ? theme.glowColor : 'rgba(255, 68, 0, 0.6)';
  };

  const getThemeParticleColor = () => {
    const theme = VISUAL_THEMES.find(t => t.id === selectedTheme);
    return theme ? theme.particleColor : '#FF8800';
  };

  const getThemeAnimationStyle = () => {
    const theme = VISUAL_THEMES.find(t => t.id === selectedTheme);
    return theme ? theme.animationStyle : 'flicker';
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

  // Get spell type name for display
  const getSpellTypeName = (typeId) => {
    const typeMap = {
      'active': 'Active Ability',
      'passive': 'Passive Ability',
      'aura': 'Aura',
      'ultimate': 'Ultimate Ability',
      'reaction': 'Reaction',
      'ritual': 'Ritual'
    };
    
    return typeMap[typeId] || typeId;
  };

  // Get animation timing duration - improved to ensure this affects all animations
  const getAnimationDuration = () => {
    const timing = ANIMATION_TIMING.find(t => t.id === selectedTiming);
    return timing ? timing.animationDuration : '1s';
  };
  
  return (
    <div className="wizard-layout">
      <div className="wizard-main-content" ref={themeCardsRef}>
        <div className="visuals-audio-step">
          <div className="section">
            <h4 className="section-title">
              <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_enchant_essencemagiclarge.jpg" alt="" className="section-icon" />
              Visual Theme
            </h4>
            <p className="section-description">
              Choose the primary visual theme for your spell's appearance.
            </p>
            
            <div className="visual-theme-grid">
              {VISUAL_THEMES.map((theme) => (
                <div
                  key={theme.id}
                  className={`theme-card ${selectedTheme === theme.id ? 'selected' : ''}`}
                  style={{
                    background: `linear-gradient(145deg, ${theme.color}33, #1f2233)`,
                    border: selectedTheme === theme.id 
                      ? `2px solid ${theme.color}` 
                      : '1px solid rgba(78, 84, 117, 0.4)',
                    boxShadow: selectedTheme === theme.id 
                      ? `0 0 20px ${theme.color}66, 0 8px 20px rgba(0, 0, 0, 0.3)` 
                      : '0 2px 8px rgba(0, 0, 0, 0.2)'
                  }}
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 2
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      marginBottom: '16px',
                      border: `2px solid ${selectedTheme === theme.id ? theme.color : 'rgba(255, 255, 255, 0.1)'}`,
                      boxShadow: selectedTheme === theme.id ? `0 0 15px ${theme.color}66` : '0 4px 10px rgba(0, 0, 0, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}>
                      <img 
                        src={`https://wow.zamimg.com/images/wow/icons/large/${theme.icon}.jpg`}
                        alt={theme.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          filter: selectedTheme === theme.id ? 'brightness(1.2) saturate(1.2)' : 'none',
                          transition: 'filter 0.3s ease'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                        }}
                      />
                    </div>
                    <h5 style={{
                      fontSize: '18px',
                      color: selectedTheme === theme.id ? theme.color : 'var(--text-primary)',
                      margin: '0 0 8px 0',
                      fontWeight: '600',
                      transition: 'color 0.3s ease'
                    }}>
                      {theme.name}
                    </h5>
                    <p style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      margin: 0,
                      lineHeight: 1.5
                    }}>
                      {theme.description}
                    </p>
                  </div>
                  
                  {selectedTheme === theme.id && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: theme.color,
                      boxShadow: `0 0 10px ${theme.color}`,
                      animation: 'pulse 2s infinite'
                    }}></div>
                  )}
                  
                  {/* Theme preview effect */}
                  {selectedTheme === theme.id && (
                    <div style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      height: '4px',
                      background: `linear-gradient(to right, ${theme.color}, transparent)`,
                      zIndex: 1
                    }}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="section">
            <h4 className="section-title">
              <img src="https://wow.zamimg.com/images/wow/icons/medium/spell_nature_starfall.jpg" alt="" className="section-icon" />
              Visual Effect
            </h4>
            <p className="section-description">
              Select how your spell manifests visually when cast.
            </p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: '20px', 
              margin: '20px 0' 
            }}>
              {VISUAL_EFFECTS.map((effect) => (
                <div
                  key={effect.id}
                  className={`effect-card ${selectedEffect === effect.id ? 'selected' : ''}`}
                  style={{
                    background: `linear-gradient(145deg, rgba(31, 34, 51, 0.9), rgba(21, 24, 36, 0.9))`,
                    border: selectedEffect === effect.id 
                      ? `2px solid ${useCustomColors ? primaryColor : getThemeColor()}` 
                      : '1px solid rgba(78, 84, 117, 0.4)',
                    boxShadow: selectedEffect === effect.id 
                      ? `0 0 20px ${useCustomColors ? primaryColor : getThemeColor()}66, 0 8px 20px rgba(0, 0, 0, 0.3)` 
                      : '0 2px 8px rgba(0, 0, 0, 0.2)',
                  }}
                  onClick={() => setSelectedEffect(effect.id)}
                >
                  {/* Effect preview */}
                  <div className="effect-preview">
                    <div className="animation-effect" style={{
                      '--theme-color': useCustomColors ? primaryColor : getThemeColor(),
                      '--theme-glow': useCustomColors ? `${primaryColor}99` : getThemeGlowColor(),
                      '--animation-duration': getAnimationDuration()
                    }}>
                      {selectedTheme && (
                        <>
                          {effect.id === 'projectile' && (
                            <div className="projectile-effect" style={{
                              background: `radial-gradient(circle, ${useCustomColors ? primaryColor : getThemeColor()}, ${useCustomColors ? secondaryColor : getThemeParticleColor()}cc)`,
                              boxShadow: `0 0 15px ${useCustomColors ? primaryColor : getThemeGlowColor()}`,
                              animation: selectedTiming 
                                ? `${getAnimationName('projectile', selectedTiming)} ${getAnimationDuration()} infinite` 
                                : 'projectile-animation 1.5s infinite linear'
                            }}></div>
                          )}
                          
                          {effect.id === 'beam' && (
                            <div className="beam-effect" style={{
                              background: `linear-gradient(to right, ${useCustomColors ? primaryColor : getThemeColor()}, ${useCustomColors ? secondaryColor : getThemeParticleColor()}cc)`,
                              boxShadow: `0 0 15px ${useCustomColors ? primaryColor : getThemeGlowColor()}`,
                              animation: selectedTiming 
                                ? `${getAnimationName('beam', selectedTiming)} ${getAnimationDuration()} infinite` 
                                : 'beam-animation 1.5s infinite linear'
                            }}></div>
                          )}
                          
                          {effect.id === 'nova' && (
                            <div className="nova-effect" style={{
                              border: `2px solid ${useCustomColors ? primaryColor : getThemeColor()}`,
                              background: `radial-gradient(circle, ${useCustomColors ? primaryColor : getThemeColor()}66, transparent)`,
                              boxShadow: `0 0 15px ${useCustomColors ? primaryColor : getThemeGlowColor()}`,
                              animation: selectedTiming 
                                ? `${getAnimationName('nova', selectedTiming)} ${getAnimationDuration()} infinite` 
                                : 'nova-animation 1.5s infinite linear'
                            }}></div>
                          )}
                          
                          {effect.id === 'aura' && (
                            <div className="aura-effect" style={{
                              border: `2px solid ${useCustomColors ? primaryColor : getThemeColor()}`,
                              background: `radial-gradient(circle, ${useCustomColors ? primaryColor : getThemeColor()}33, transparent)`,
                              boxShadow: `0 0 15px ${useCustomColors ? primaryColor : getThemeGlowColor()}`,
                              animation: selectedTiming 
                                ? `${getAnimationName('aura', selectedTiming)} ${getAnimationDuration()} infinite` 
                                : 'aura-animation 1.5s infinite ease-in-out'
                            }}></div>
                          )}
                          
                          {effect.id === 'vortex' && (
                            <div className="vortex-effect" style={{
                              '--theme-color': useCustomColors ? primaryColor : getThemeColor(),
                              boxShadow: `0 0 15px ${useCustomColors ? primaryColor : getThemeGlowColor()}`,
                              background: `conic-gradient(${useCustomColors ? primaryColor : getThemeColor()} 0%, transparent 30%, transparent 60%, ${useCustomColors ? primaryColor : getThemeColor()} 100%)`,
                              animation: selectedTiming 
                                ? `${getAnimationName('vortex', selectedTiming)} ${getAnimationDuration()} infinite` 
                                : 'vortex-animation 1.5s infinite linear'
                            }}></div>
                          )}

                          {effect.id === 'rain' && (
                            <div className="rain-effect" style={{
                              position: 'absolute',
                              top: '0',
                              left: '0',
                              width: '100%',
                              height: '100%',
                              background: `linear-gradient(to bottom, ${useCustomColors ? primaryColor : getThemeColor()}33, transparent)`,
                              boxShadow: `0 0 15px ${useCustomColors ? primaryColor : getThemeGlowColor()}`,
                              overflow: 'hidden'
                            }}>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} style={{
                                  position: 'absolute',
                                  width: '4px',
                                  height: '20px',
                                  background: useCustomColors ? primaryColor : getThemeColor(),
                                  borderRadius: '50%',
                                  left: `${Math.random() * 100}%`,
                                  top: `-20px`,
                                  animation: `rainfall ${Math.random() * 1 + 0.5}s linear ${Math.random() * 2}s infinite`,
                                  opacity: 0.7,
                                  animationDuration: getAnimationDuration() // Applied timing here
                                }}></div>
                              ))}
                            </div>
                          )}

                          {effect.id === 'burst' && (
                            <div className="burst-effect" style={{
                              position: 'absolute',
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: `radial-gradient(circle, ${useCustomColors ? primaryColor : getThemeColor()}cc, transparent)`,
                              boxShadow: `0 0 15px ${useCustomColors ? primaryColor : getThemeGlowColor()}`,
                              animation: selectedTiming 
                                ? `${getAnimationName('burst', selectedTiming)} ${getAnimationDuration()} infinite` 
                                : 'burst-animation 1.5s infinite ease-out'
                            }}></div>
                          )}

                          {effect.id === 'wave' && (
                            <div className="wave-effect" style={{
                              position: 'absolute',
                              bottom: '10px',
                              left: '0',
                              width: '100%',
                              height: '30px',
                              background: `linear-gradient(to bottom, ${useCustomColors ? primaryColor : getThemeColor()}aa, transparent)`,
                              boxShadow: `0 0 15px ${useCustomColors ? primaryColor : getThemeGlowColor()}`,
                              animation: selectedTiming 
                                ? `${getAnimationName('wave', selectedTiming)} ${getAnimationDuration()} infinite` 
                                : 'wave-animation 2s ease-in-out infinite',
                              transformOrigin: 'center bottom'
                            }}></div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  
                  <h5 style={{
                    fontSize: '18px',
                    color: selectedEffect === effect.id 
                      ? (useCustomColors ? primaryColor : getThemeColor()) 
                      : 'var(--text-primary)',
                    marginTop: '10px',
                    marginBottom: '8px',
                    fontWeight: '600',
                    transition: 'color 0.3s ease'
                  }}>
                    {effect.name}
                  </h5>
                  
                  <p style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    margin: '0 0 10px 0',
                    lineHeight: 1.5
                  }}>
                    {effect.description}
                  </p>
                  
                  <div style={{
                    fontSize: '13px',
                    color: 'var(--text-tertiary)',
                    fontStyle: 'italic'
                  }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Examples: </span>
                    {effect.examples.join(', ')}
                  </div>
                  
                  {selectedEffect === effect.id && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: useCustomColors ? primaryColor : getThemeColor(),
                      boxShadow: `0 0 10px ${useCustomColors ? primaryColor : getThemeColor()}`,
                      animation: 'pulse 2s infinite'
                    }}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="section">
            <h4 className="section-title">
              <img src="https://wow.zamimg.com/images/wow/icons/medium/ability_bard_songofharmony.jpg" alt="" className="section-icon" />
              Sound Design
            </h4>
            <p className="section-description">
              Choose the primary sound category and specific variants for your spell.
            </p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
              gap: '16px',
              margin: '20px 0' 
            }}>
              {SOUND_CATEGORIES.map((category) => (
                <div
                  key={category.id}
                  className={`sound-category ${selectedSoundCategory === category.id ? 'selected' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    background: selectedSoundCategory === category.id
                      ? `linear-gradient(145deg, rgba(61, 184, 255, 0.1), rgba(0, 109, 173, 0.05))`
                      : `linear-gradient(145deg, var(--neutral-800), var(--neutral-900))`,
                    border: selectedSoundCategory === category.id
                      ? '1px solid var(--primary-500)'
                      : '1px solid rgba(78, 84, 117, 0.4)',
                    boxShadow: selectedSoundCategory === category.id
                      ? '0 0 20px rgba(61, 184, 255, 0.2), 0 8px 20px rgba(0, 0, 0, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.2)',
                  }}
                  onClick={() => setSelectedSoundCategory(category.id)}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    flexShrink: 0,
                    position: 'relative',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    border: selectedSoundCategory === category.id
                      ? '2px solid var(--primary-300)'
                      : '2px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <img 
                      src={`https://wow.zamimg.com/images/wow/icons/large/${category.icon}.jpg`}
                      alt={category.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        transition: 'filter 0.3s ease',
                        filter: selectedSoundCategory === category.id
                          ? 'brightness(1.2) saturate(1.2)'
                          : 'none'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: selectedSoundCategory === category.id
                        ? 'var(--primary-300)'
                        : 'var(--text-primary)',
                      marginBottom: '6px',
                      transition: 'color 0.3s ease'
                    }}>
                      {category.name}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: '12px'
                    }}>
                      {category.description}
                    </div>
                    
                    {selectedSoundCategory === category.id && (
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        marginTop: '12px'
                      }}>
                        {category.variants.map(variant => (
                          <div
                            key={variant}
                            className={`common-tag ${selectedSoundVariant === variant ? 'selected' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSoundVariant(variant);
                            }}
                          >
                            <img 
                              src={`https://wow.zamimg.com/images/wow/icons/small/${
                                variant === 'crackling' ? 'spell_fire_fire' : 
                                variant === 'flowing' ? 'spell_frost_frostbolt02' : 
                                variant === 'whooshing' ? 'spell_nature_cyclone' : 
                                variant === 'sparkle' ? 'spell_holy_powerwordshield' : 
                                variant === 'hum' ? 'spell_arcane_arcane01' : 
                                variant === 'pulse' ? 'spell_holy_powerwordshield' : 
                                variant === 'chant' ? 'spell_holy_holyword' : 
                                variant === 'whisper' ? 'ability_priest_silence' : 
                                variant === 'shout' ? 'ability_warrior_battleshout' : 
                                variant === 'boom' ? 'spell_fire_selfdestruct' : 
                                variant === 'crash' ? 'ability_warrior_shieldbreak' : 
                                'spell_nature_thunderclap'
                              }.jpg`}
                              alt={variant}
                              style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '3px',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
                              }}
                              onError={(e) => {
                                e.target.src = 'https://wow.zamimg.com/images/wow/icons/small/inv_misc_questionmark.jpg';
                              }}
                            />
                            <span>{variant}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {selectedSoundCategory === category.id && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-400)',
                      boxShadow: '0 0 10px var(--primary-glow)',
                      animation: 'pulse 2s infinite'
                    }}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="section">
            <h4 className="section-title">
              <img src="https://wow.zamimg.com/images/wow/icons/medium/spell_nature_timestop.jpg" alt="" className="section-icon" />
              Animation Timing
            </h4>
            <p className="section-description">
              Set how your spell's visual effects are timed and sequenced.
            </p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
              gap: '16px',
              margin: '20px 0' 
            }}>
              {ANIMATION_TIMING.map((timing) => (
                <div
                  key={timing.id}
                  className={`timing-option ${selectedTiming === timing.id ? 'selected' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    background: selectedTiming === timing.id
                      ? `linear-gradient(145deg, rgba(61, 184, 255, 0.1), rgba(0, 109, 173, 0.05))`
                      : `linear-gradient(145deg, var(--neutral-800), var(--neutral-900))`,
                    border: selectedTiming === timing.id
                      ? '1px solid var(--primary-500)'
                      : '1px solid rgba(78, 84, 117, 0.4)',
                    boxShadow: selectedTiming === timing.id
                      ? '0 0 20px rgba(61, 184, 255, 0.2), 0 8px 20px rgba(0, 0, 0, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.2)',
                  }}
                  onClick={() => setSelectedTiming(timing.id)}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    flexShrink: 0,
                    position: 'relative',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    border: selectedTiming === timing.id
                      ? '2px solid var(--primary-300)'
                      : '2px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <img 
                      src={`https://wow.zamimg.com/images/wow/icons/large/${timing.icon}.jpg`}
                      alt={timing.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        transition: 'filter 0.3s ease',
                        filter: selectedTiming === timing.id
                          ? 'brightness(1.2) saturate(1.2)'
                          : 'none'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: selectedTiming === timing.id
                        ? 'var(--primary-300)'
                        : 'var(--text-primary)',
                      marginBottom: '6px',
                      transition: 'color 0.3s ease'
                    }}>
                      {timing.name}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5
                    }}>
                      {timing.description}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      marginTop: '6px'
                    }}>
                      <span style={{
                        fontWeight: '500',
                        color: selectedTiming === timing.id
                          ? 'var(--primary-300)'
                          : 'var(--text-primary)'
                      }}>Style: </span>
                      {timing.castingStyle}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      marginTop: '6px'
                    }}>
                      <span style={{
                        fontWeight: '500',
                        color: selectedTiming === timing.id
                          ? 'var(--primary-300)'
                          : 'var(--text-primary)'
                      }}>Duration: </span>
                      {timing.animationDuration}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      marginTop: '6px'
                    }}>
                      <span style={{
                        fontWeight: '500',
                        color: selectedTiming === timing.id
                          ? 'var(--primary-300)'
                          : 'var(--text-primary)'
                      }}>Behavior: </span>
                      {timing.behavior}
                    </div>
                  </div>
                  
                  {selectedTiming === timing.id && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-400)',
                      boxShadow: '0 0 10px var(--primary-glow)',
                      animation: 'pulse 2s infinite'
                    }}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="section">
            <h4 className="section-title">
              <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_gem_01.jpg" alt="" className="section-icon" />
              Color Customization
            </h4>
            <div className="color-customization">
              <div className="custom-colors-toggle" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(145deg, var(--neutral-800), var(--neutral-900))',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '20px',
                border: '1px solid rgba(78, 84, 117, 0.4)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}>
                <label className="toggle-container">
                  <input
                    type="checkbox"
                    checked={useCustomColors}
                    onChange={(e) => setUseCustomColors(e.target.checked)}
                  />
                  <span className="toggle-switch"></span>
                  <span className="toggle-label">Use Custom Colors</span>
                </label>
                <div className="toggle-hint" style={{
                  fontSize: '13px',
                  color: 'var(--text-tertiary)',
                  fontStyle: 'italic'
                }}>
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
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--text-tertiary)',
                        marginTop: '8px'
                      }}>Main spell effect color</div>
                    </div>
                    
                    <div className="color-picker-wrapper">
                      <label>Secondary Color</label>
                      <ColorPicker
                        color={secondaryColor}
                        onChange={setSecondaryColor}
                      />
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--text-tertiary)',
                        marginTop: '8px'
                      }}>Supporting effects color</div>
                    </div>
                    
                    <div className="color-picker-wrapper">
                      <label>Accent Color</label>
                      <ColorPicker
                        color={accentColor}
                        onChange={setAccentColor}
                      />
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--text-tertiary)',
                        marginTop: '8px'
                      }}>Highlights and details</div>
                    </div>
                  </div>
                  
                  <div className="color-preview">
                    <h5 style={{
                      fontSize: '16px',
                      color: 'var(--text-bright)',
                      marginBottom: '12px',
                      textAlign: 'center'
                    }}>Color Preview</h5>
                    <div 
                      className="spell-color-preview"
                      style={{
                        background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
                        border: `2px solid ${accentColor}`,
                        boxShadow: `0 0 20px ${primaryColor}80`,
                      }}
                    >
                      {/* Simplified central effect instead of multiple floating particles */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${primaryColor}, ${secondaryColor})`,
                        transform: 'translate(-50%, -50%)',
                        boxShadow: `0 0 15px ${primaryColor}`,
                        animation: 'pulse 2s infinite'
                      }}></div>
                    </div>
                    <div style={{
                      textAlign: 'center',
                      fontSize: '13px',
                      color: 'var(--text-secondary)'
                    }}>
                      Colors will be applied to your spell's visual effects
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="section">
            <h4 className="section-title">
              <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_inscription_minorglyph01.jpg" alt="" className="section-icon" />
              Visual Descriptions
            </h4>
            <div className="descriptions-container">
              <div className="description-field">
                <label style={{
                  display: 'block',
                  marginBottom: '10px',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: 'var(--text-primary)'
                }}>Casting Description</label>
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: '10px'
                }}>
                  <button
                    className="suggest-btn primary"
                    onClick={() => setCastingDescription(generateSuggestion('casting'))}
                    disabled={!selectedTheme || !selectedEffect}
                  >
                    Suggest Description
                  </button>
                </div>
                <textarea
                  className="spell-description-input"
                  value={castingDescription}
                  onChange={(e) => setCastingDescription(e.target.value)}
                  placeholder="Describe how the spell looks when being cast..."
                />
              </div>
              
              <div className="description-field">
                <label style={{
                  display: 'block',
                  marginBottom: '10px',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: 'var(--text-primary)'
                }}>Effect Description</label>
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: '10px'
                }}>
                  <button
                    className="suggest-btn primary"
                    onClick={() => setEffectDescription(generateSuggestion('effect'))}
                    disabled={!selectedTheme || !selectedEffect}
                  >
                    Suggest Description
                  </button>
                </div>
                <textarea
                  className="spell-description-input"
                  value={effectDescription}
                  onChange={(e) => setEffectDescription(e.target.value)}
                  placeholder="Describe how the spell's effect appears..."
                />
              </div>
              
              <div className="description-field">
                <label style={{
                  display: 'block',
                  marginBottom: '10px',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: 'var(--text-primary)'
                }}>Impact Description</label>
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: '10px'
                }}>
                  <button
                    className="suggest-btn primary"
                    onClick={() => setImpactDescription(generateSuggestion('impact'))}
                    disabled={!selectedTheme || !selectedEffect}
                  >
                    Suggest Description
                  </button>
                </div>
                <textarea
                  className="spell-description-input"
                  value={impactDescription}
                  onChange={(e) => setImpactDescription(e.target.value)}
                  placeholder="Describe what happens when the spell hits..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      

        
        <div className="wizard-side-panel">
        <h4 className="preview-title"></h4>
        <SpellPreview spellData={spellData} />
      </div>
      
    </div>
  );
};

export default Step7VisualsAudio;