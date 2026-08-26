import React, { useState, useMemo, useRef, useEffect, useCallback, memo } from 'react';
import BESTIARY_DATA from '../../data/creatureData.json';
import InlineMarkdown from '../common/InlineMarkdown';
import './BestiaryDisplay.css';

const DANGER_COLORS = {
  Trivial: { bg: '#6c757d', text: '#fff' },
  Low: { bg: '#2d6a4f', text: '#fff' },
  Medium: { bg: '#bc6c25', text: '#fff' },
  High: { bg: '#d90429', text: '#fff' },
  'Very High': { bg: '#9b2226', text: '#fff' },
  Extreme: { bg: '#7b2cb7', text: '#fff' }
};

const DANGER_LEVELS = ['Trivial', 'Low', 'Medium', 'High', 'Very High', 'Extreme'];

const REGION_ICONS = {
  'frostwood-reach': 'fa-tree',
  'nordhalla': 'fa-snowflake',
  'sundale': 'fa-fire',
  'iceheart-sea': 'fa-water',
  'cragjaw-peaks': 'fa-mountain',
  'sundrift-vale': 'fa-wind',
  'bryngloom-forest': 'fa-leaf'
};

const ATTR_LABELS = { 
  strength: { short: 'STR', full: 'Strength', desc: 'Physical power and muscle' }, 
  agility: { short: 'AGI', full: 'Agility', desc: 'Reflexes, speed, and precision' }, 
  constitution: { short: 'CON', full: 'Constitution', desc: 'Health, stamina, and resilience' }, 
  intelligence: { short: 'INT', full: 'Intelligence', desc: 'Reasoning, memory, and study' }, 
  spirit: { short: 'SPI', full: 'Spirit', desc: 'Awareness, willpower, and magical connection' }, 
  charisma: { short: 'CHA', full: 'Charisma', desc: 'Force of personality and presence' } 
};

const ELEMENT_DETAILS = {
  fire: { label: 'Fire', color: '#ff5722', icon: 'fa-fire' },
  cold: { label: 'Cold / Frost', color: '#00bcd4', icon: 'fa-snowflake' },
  frost: { label: 'Cold / Frost', color: '#00bcd4', icon: 'fa-snowflake' },
  necrotic: { label: 'Necrotic', color: '#9c27b0', icon: 'fa-skull' },
  radiant: { label: 'Radiant', color: '#ffb300', icon: 'fa-sun' },
  psychic: { label: 'Psychic', color: '#e91e63', icon: 'fa-brain' },
  poison: { label: 'Poison', color: '#4caf50', icon: 'fa-biohazard' },
  physical: { label: 'Physical', color: '#a1887f', icon: 'fa-shield-alt' },
  acid: { label: 'Acid', color: '#8bc34a', icon: 'fa-tint' },
  lightning: { label: 'Lightning', color: '#2196f3', icon: 'fa-bolt' }
};

const ITEMS_PER_PAGE = 18;

// Core Helper Functions
const calculateModifier = (value) => {
  return Math.floor((value - 10) / 2);
};

const formatModifier = (mod) => {
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

const getCreatureThumb = (illustration) => {
  if (!illustration || typeof illustration !== 'string') return illustration;
  return illustration
    .replace('/creatures/', '/creatures/thumbs/')
    .replace(/\.png$/i, '.jpg');
};

// Dynamic Game-Mechanic Formatter
// Converts raw text descriptions of damage rolls, save DCs, etc., into gorgeous, styled inline RPG badges
const formatCombatMechanicsText = (text) => {
  if (!text) return null;
  
  const regex = /(\b\d+d\d+(?:\+\d+)?\b(?:\s+(?:piercing|bludgeoning|slashing|cold|fire|psychic|necrotic|radiant|poison|lightning|acid|physical))?|\bDC\s+\d+\s+[A-Z]{3,4}\b|\b\d+-ft\s+(?:radius|cone|range|diameter)?\b|\b\d+\s+HP,\s+DR\s+\d+\b)/gi;
  
  const parts = text.split(regex);
  return parts.map((part, i) => {
    if (regex.test(part)) {
      let cls = "bestiary-inline-mechanic";
      let icon = "fa-dice-d20";
      
      const lowerPart = part.toLowerCase();
      if (lowerPart.includes("hp") || lowerPart.includes("dr")) {
        cls += " stats-highlight";
        icon = "fa-heartbeat";
      } else if (lowerPart.includes("dc")) {
        cls += " dc-highlight";
        icon = "fa-gavel";
      } else if (lowerPart.includes("ft")) {
        cls += " range-highlight";
        icon = "fa-arrows-alt";
      } else {
        cls += " roll-highlight";
        icon = "fa-sparkles";
      }
      
      return (
        <span key={i} className={cls}>
          <i className={`fas ${icon} mechanic-icon`}></i>
          {part}
        </span>
      );
    }
    return part;
  });
};

const readLoreText = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).map(String).join(', ');
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const isCosmicWyrdCreature = (classification = {}) => {
  const originClass = readLoreText(classification.originClass).toLowerCase();
  const status = readLoreText(classification.status).toLowerCase();
  return originClass === 'ancient-cosmic-wyrdkin'
    || originClass === 'keth-spawn'
    || status.includes('cosmic-wyrd')
    || status.includes('wyrdspawn');
};

/**
 * Highly optimized, memoized Bestiary card component.
 * Features asynchronous decoding, skeleton placeholder, and fallback handling.
 */
const BestiaryCreatureCard = memo(({ creature, onSelect, regionIcon }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [thumbSrc, setThumbSrc] = useState(() => getCreatureThumb(creature.illustration));

  const handleImageError = useCallback(() => {
    if (thumbSrc !== creature.illustration) {
      setThumbSrc(creature.illustration);
    } else {
      setImageError(true);
    }
  }, [thumbSrc, creature.illustration]);

  const dangerStyle = DANGER_COLORS[creature.dangerLevel] || DANGER_COLORS.Medium;
  const originSnippet = useMemo(() => {
    if (!creature.origin) return '';
    return creature.origin.split('.')[0] + '.';
  }, [creature.origin]);

  return (
    <div
      className="bestiary-creature-card"
      onClick={() => onSelect(creature.id)}
      style={{ borderTopColor: dangerStyle.bg }}
    >
      <div className="bestiary-card-image">
        {creature.illustration && !imageError ? (
          <>
            {!imageLoaded && <div className="bestiary-card-image-skeleton" />}
            <img
              src={thumbSrc}
              alt={creature.name}
              loading="lazy"
              decoding="async"
              width="290"
              height="160"
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
              style={{ opacity: imageLoaded ? 1 : 0 }}
            />
          </>
        ) : (
          <i className={`fas ${regionIcon || 'fa-globe'} fallback-card-icon`}></i>
        )}
      </div>
      <div className="bestiary-card-body">
        <div className="bestiary-card-header">
          <h3>{creature.name}</h3>
          <span
            className="bestiary-card-badge"
            style={{ 
              backgroundColor: dangerStyle.bg, 
              color: dangerStyle.text 
            }}
          >
            {creature.dangerLevel}
          </span>
        </div>
        <p className="bestiary-card-role">{creature.role}</p>
        <p className="bestiary-card-origin">{originSnippet}</p>
      </div>
    </div>
  );
});

const BestiaryDisplay = () => {
  const [selectedRegion, setSelectedRegion] = useState(BESTIARY_DATA.regions[0].id);
  const [selectedDanger, setSelectedDanger] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [selectedCreature, setSelectedCreature] = useState(null);
  const [activeTab, setActiveTab] = useState('lore'); // 'lore' | 'combat' | 'tactics'

  const sentinelRef = useRef(null);

  // Total creatures count across all regions
  const totalCreaturesCount = useMemo(() => {
    return BESTIARY_DATA.regions.reduce((acc, r) => acc + (r.creatures?.length || 0), 0);
  }, []);

  // Pre-filter creatures based on selected continent, danger, and search query
  const filteredCreatures = useMemo(() => {
    let list = [];
    if (selectedRegion === 'all') {
      list = BESTIARY_DATA.regions.flatMap(r => 
        (r.creatures || []).map(c => ({ ...c, regionName: r.name, regionId: r.id }))
      );
    } else {
      const reg = BESTIARY_DATA.regions.find(r => r.id === selectedRegion);
      list = (reg?.creatures || []).map(c => ({ ...c, regionName: reg.name, regionId: reg.id }));
    }

    if (selectedDanger !== 'all') {
      list = list.filter(c => c.dangerLevel === selectedDanger);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(c => {
        const folk = c.folkloreInspiration || {};
        const folkTrad = Array.isArray(folk.traditions) ? folk.traditions.join(' ').toLowerCase() : '';
        const folkMyth = (folk.primaryMyth || '').toLowerCase();
        const folkCryptid = (folk.cryptidRoots || '').toLowerCase();
        const folkDesc = (folk.description || '').toLowerCase();
        const folkAdapt = (folk.settingAdaptation || '').toLowerCase();

        return (
          (c.name && c.name.toLowerCase().includes(q)) ||
          (c.role && c.role.toLowerCase().includes(q)) ||
          (c.origin && c.origin.toLowerCase().includes(q)) ||
          (c.nature && c.nature.toLowerCase().includes(q)) ||
          (c.heritage && c.heritage.toLowerCase().includes(q)) ||
          (c.regionName && c.regionName.toLowerCase().includes(q)) ||
          folkTrad.includes(q) ||
          folkMyth.includes(q) ||
          folkCryptid.includes(q) ||
          folkDesc.includes(q) ||
          folkAdapt.includes(q)
        );
      });
    }

    return list;
  }, [selectedRegion, selectedDanger, searchQuery]);

  // Progressive slice for low-overhead rendering
  const displayedCreatures = useMemo(() => {
    return filteredCreatures.slice(0, visibleCount);
  }, [filteredCreatures, visibleCount]);

  const hasMore = visibleCount < filteredCreatures.length;

  // Infinite scroll intersection observer
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredCreatures.length));
      }
    }, { rootMargin: '250px', threshold: 0.1 });

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, filteredCreatures.length]);

  // Reset pagination when filter conditions change
  const handleRegionSelect = useCallback((regionId) => {
    setSelectedRegion(regionId);
    setSelectedCreature(null);
    setVisibleCount(ITEMS_PER_PAGE);
  }, []);

  const handleDangerSelect = useCallback((danger) => {
    setSelectedDanger(prev => prev === danger ? 'all' : danger);
    setVisibleCount(ITEMS_PER_PAGE);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    setVisibleCount(ITEMS_PER_PAGE);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedDanger('all');
    setVisibleCount(ITEMS_PER_PAGE);
  }, []);

  // Determine current region and creature for detail view
  const currentRegion = useMemo(() => {
    if (selectedRegion === 'all') {
      if (selectedCreature) {
        const found = BESTIARY_DATA.regions.find(r => r.creatures?.some(c => c.id === selectedCreature));
        if (found) return found;
      }
      return { id: 'all', name: 'All Continents', folklore: 'Pan-Mythrill Compendium' };
    }
    return BESTIARY_DATA.regions.find(r => r.id === selectedRegion) || BESTIARY_DATA.regions[0];
  }, [selectedRegion, selectedCreature]);

  const currentCreature = useMemo(() => {
    if (!selectedCreature) return null;
    for (const region of BESTIARY_DATA.regions) {
      const found = region.creatures?.find(c => c.id === selectedCreature);
      if (found) return found;
    }
    return null;
  }, [selectedCreature]);

  const loreClassification = currentCreature?.loreClassification || {};
  const loreCanon = currentCreature?.loreCanon || {};
  
  const loreClassificationRows = useMemo(() => [
    ['Status', loreClassification.status],
    ['Origin class', loreClassification.originClass],
    ['Wyrd relationship', loreClassification.wyrdRelationship]
  ]
    .map(([label, value]) => [label, readLoreText(value)])
    .filter(([, value]) => value), [loreClassification]);

  const loreNote = readLoreText(currentCreature?.loreNote);
  const loreOrigin = readLoreText(loreCanon.trueOrigin) || readLoreText(currentCreature?.origin);
  const loreFolklore = readLoreText(loreCanon.folklore) || readLoreText(currentCreature?.heritage);
  const loreFunction = readLoreText(loreCanon.function) || readLoreText(currentCreature?.nature);
  const loreValues = readLoreText(loreCanon.values);
  const loreBindingEffect = readLoreText(loreCanon.bindingEffect);
  const cosmicWyrd = isCosmicWyrdCreature(loreClassification);
  const loreWyrdRelationship = readLoreText(loreCanon.wyrdRelationship)
    || readLoreText(loreClassification.wyrdRelationship)
    || readLoreText(currentCreature?.depth);

  const cosmicLoreRows = useMemo(() => {
    if (!cosmicWyrd) return [];
    return [
      ['Cosmic provenance', loreCanon.cosmicProvenance],
      ['Wyrd function', loreCanon.wyrdFunction],
      ['Mythrill anchor', loreCanon.anchor],
      ['Keth-Amar relationship', loreCanon.kethRelationship],
      ['Current independence', loreCanon.independence],
      ['Countermeasure', loreCanon.countermeasure]
    ]
      .map(([label, value]) => [label, readLoreText(value)])
      .filter(([, value]) => value);
  }, [cosmicWyrd, loreCanon]);

  const hasLayerMetadata = loreClassificationRows.length > 0 || Boolean(loreNote);
  const hasTruthBeneath = Boolean(loreWyrdRelationship) || cosmicLoreRows.length > 0;

  // Memoized formatted combat text
  const formattedCombatMechanics = useMemo(() => {
    return formatCombatMechanicsText(currentCreature?.combat);
  }, [currentCreature?.combat]);

  const handleBack = useCallback(() => {
    setSelectedCreature(null);
    setActiveTab('lore');
  }, []);

  const handleSelectCreature = useCallback((creatureId) => {
    setSelectedCreature(creatureId);
    setActiveTab('lore');
  }, []);

  const renderResistanceBadge = useCallback((type, value, isVuln = false) => {
    const details = ELEMENT_DETAILS[type.toLowerCase()] || { label: type, color: '#888', icon: 'fa-shield-alt' };
    const style = {
      border: `1.5px solid ${details.color}`,
      background: `${details.color}10`,
      color: '#3a3020'
    };
    const valString = typeof value === 'number' ? `${value}%` : (value === true || value === '100' ? 'Immune' : value);
    return (
      <div key={type} className={`bestiary-res-badge ${isVuln ? 'vuln' : 'resist'}`} style={style}>
        <span className="bestiary-res-pill" style={{ backgroundColor: details.color }}>
          <i className={`fas ${details.icon} bestiary-res-icon`}></i>
          {details.label}
        </span>
        <span className="bestiary-res-value-text" style={{ color: isVuln ? '#9b2226' : '#2d6a4f' }}>
          {isVuln ? `Vulnerable (+${valString})` : `Resist (${valString})`}
        </span>
      </div>
    );
  }, []);

  return (
    <div className="bestiary-display">
      {!currentCreature && (
        <div className="bestiary-intro">
          <h3 className="bestiary-intro-title">📜 The Native Bestiary &amp; Cosmic Wyrd</h3>
          <p className="bestiary-intro-text">
            Mythrill's bestiary begins with native beasts, spirits, mythic peoples, constructs, and land beings that inhabited these regions before the Great Binding.
            The Wyrd is a distinct cosmic medium and ecology: Ancient Cosmic Wyrdkin come from beyond Mythrill, Keth-spawn/Wyrdspawn are narrower direct local
            manifestations, and Wyrd-touched natives are individuals or branches changed by exposure. Folklore records, translates, or camouflages what is there;
            it does not create the native bestiary or ancient Wyrdkin. Some Wyrd entities remain anchored in Mythrill after Keth-Amar retreats, so identify the
            creature's layer and anchor before choosing its weakness.
          </p>
        </div>
      )}

      <div className="bestiary-layout">
        {/* Left Continent Sidebar */}
        <div className="bestiary-sidebar">
          <h4 className="bestiary-sidebar-title">Continents</h4>
          <ul className="bestiary-region-list">
            <li
              className={`bestiary-region-item ${selectedRegion === 'all' ? 'active' : ''}`}
              onClick={() => handleRegionSelect('all')}
            >
              <i className="fas fa-globe bestiary-region-icon"></i>
              <div className="bestiary-region-info">
                <span className="bestiary-region-name">All Regions</span>
                <span className="bestiary-region-folklore">Entire World</span>
              </div>
              <span className="bestiary-region-count">{totalCreaturesCount}</span>
            </li>
            {BESTIARY_DATA.regions.map(region => (
              <li
                key={region.id}
                className={`bestiary-region-item ${selectedRegion === region.id ? 'active' : ''}`}
                onClick={() => handleRegionSelect(region.id)}
              >
                <i className={`fas ${REGION_ICONS[region.id] || 'fa-globe'} bestiary-region-icon`}></i>
                <div className="bestiary-region-info">
                  <span className="bestiary-region-name">{region.name}</span>
                  <span className="bestiary-region-folklore">{region.folklore}</span>
                </div>
                <span className="bestiary-region-count">{region.creatures?.length || 0}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="bestiary-main">
          {currentCreature ? (
            <div className="bestiary-detail fade-in">
              <button className="bestiary-back-btn" onClick={handleBack}>
                <i className="fas fa-arrow-left"></i> Back to {currentRegion.name}
              </button>

              {/* Creature Banner Header */}
              <div className="bestiary-detail-header">
                <div className="bestiary-detail-title-group">
                  <h2 className="bestiary-detail-name">{currentCreature.name}</h2>
                  <span
                    className="bestiary-detail-badge"
                    style={{ 
                      backgroundColor: (DANGER_COLORS[currentCreature.dangerLevel] || DANGER_COLORS.Medium).bg, 
                      color: (DANGER_COLORS[currentCreature.dangerLevel] || DANGER_COLORS.Medium).text 
                    }}
                  >
                    {currentCreature.dangerLevel} Danger
                  </span>
                </div>
                <p className="bestiary-detail-role">
                  <i className="fas fa-shield-halved bestiary-header-shield-icon"></i> {currentCreature.role}
                </p>
              </div>

              {/* Double Column Journal Page */}
              <div className="bestiary-detail-body">
                {/* Column 1: Portrait & Quick Stats */}
                <div className="bestiary-portrait-col">
                  {currentCreature.illustration ? (
                    <div className="bestiary-detail-illustration">
                      <div className="bestiary-portrait-frame">
                        <img
                          src={currentCreature.illustration}
                          alt={currentCreature.illustrationCaption || currentCreature.name}
                          decoding="async"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                      {currentCreature.illustrationCaption && (
                        <div className="bestiary-detail-caption">
                          <i className="fas fa-camera-retro"></i> {currentCreature.illustrationCaption}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bestiary-detail-illustration fallback-avatar">
                      <div className="bestiary-portrait-frame empty">
                        <i className={`fas ${REGION_ICONS[currentRegion.id] || 'fa-globe'} fallback-icon`}></i>
                        <span>No sketch available</span>
                      </div>
                    </div>
                  )}

                  {/* Quick Stats Panel */}
                  {currentCreature.stats && (
                    <div className="bestiary-quick-stats-card">
                      <h4 className="bestiary-quick-stats-title">
                        <i className="fas fa-heart-pulse"></i> Vital Statistics
                      </h4>
                      <div className="bestiary-quick-stats-grid">
                        <div className="bestiary-quick-stat-item hp">
                          <span className="label">HP</span>
                          <span className="value">{currentCreature.stats.maxHp}</span>
                        </div>
                        {currentCreature.stats.maxMana > 0 ? (
                          <div className="bestiary-quick-stat-item mana">
                            <span className="label">Mana</span>
                            <span className="value">{currentCreature.stats.maxMana}</span>
                          </div>
                        ) : (
                          <div className="bestiary-quick-stat-item mana disabled">
                            <span className="label">Mana</span>
                            <span className="value">-</span>
                          </div>
                        )}
                        <div className="bestiary-quick-stat-item ap">
                          <span className="label">AP Limit</span>
                          <span className="value">{currentCreature.stats.maxActionPoints}</span>
                        </div>
                        <div className="bestiary-quick-stat-item speed">
                          <span className="label">Speed</span>
                          <span className="value">{currentCreature.stats.speed} ft</span>
                        </div>
                        <div className="bestiary-quick-stat-item initiative">
                          <span className="label">Initiative</span>
                          <span className="value">
                            {formatModifier(calculateModifier(currentCreature.stats.agility || 10))}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Column 2: Tabbed Details */}
                <div className="bestiary-tabs-col">
                  {/* Tab Buttons */}
                  <div className="bestiary-tabs-navigation">
                    <button 
                      className={`bestiary-tab-btn ${activeTab === 'lore' ? 'active' : ''}`}
                      onClick={() => setActiveTab('lore')}
                    >
                      <i className="fas fa-scroll"></i> Lore &amp; Legends
                    </button>
                    <button 
                      className={`bestiary-tab-btn ${activeTab === 'combat' ? 'active' : ''}`}
                      onClick={() => setActiveTab('combat')}
                    >
                      <i className="fas fa-swords"></i> Combat Statistics
                    </button>
                    <button 
                      className={`bestiary-tab-btn ${activeTab === 'tactics' ? 'active' : ''}`}
                      onClick={() => setActiveTab('tactics')}
                    >
                      <i className="fas fa-chess-knight"></i> Tactics &amp; Actions
                    </button>
                  </div>

                  {/* Tab 1 Content: Lore & Legends */}
                  {activeTab === 'lore' && (
                    <div className="bestiary-tab-content fade-in">
                      {loreOrigin && (
                        <div className="bestiary-lore-section scroll-bg">
                          <h4><i className="fas fa-feather-pointed"></i> Mythic Provenance</h4>
                          <p>{loreOrigin}</p>
                        </div>
                      )}

                      {hasLayerMetadata && (
                        <div className="bestiary-lore-section bestiary-heritage-section">
                          <h4><i className="fas fa-layer-group"></i> Mythrill Layer</h4>
                          {loreClassificationRows.map(([label, value]) => (
                            <p key={label} className="bestiary-heritage-text">
                              <strong>{label}:</strong> {value}
                            </p>
                          ))}
                          {loreNote && (
                            <p className="bestiary-heritage-text">
                              <strong>Canon note:</strong> {loreNote}
                            </p>
                          )}
                        </div>
                      )}

                      {loreFolklore && (
                        <div className="bestiary-lore-section">
                          <h4><i className="fas fa-book-open"></i> Folklore Record</h4>
                          <p>{loreFolklore}</p>
                        </div>
                      )}

                      {loreFunction && (
                        <div className="bestiary-lore-section">
                          <h4><i className="fas fa-dragon"></i> Nature &amp; World Function</h4>
                          <p>{loreFunction}</p>
                        </div>
                      )}

                      {currentCreature.habitat && (
                        <div className="bestiary-lore-section">
                          <h4><i className="fas fa-map-location-dot"></i> Habitat</h4>
                          <p>{currentCreature.habitat}</p>
                        </div>
                      )}

                      {loreValues && (
                        <div className="bestiary-lore-section">
                          <h4><i className="fas fa-shield-heart"></i> Values &amp; Guardianship</h4>
                          <p>{loreValues}</p>
                        </div>
                      )}

                      {loreBindingEffect && (
                        <div className="bestiary-lore-section">
                          <h4><i className="fas fa-temperature-half"></i> Binding &amp; Warmth History</h4>
                          <p>{loreBindingEffect}</p>
                        </div>
                      )}

                      {hasTruthBeneath && (
                        <div className="bestiary-lore-section bestiary-depth">
                          <h4>
                            <i className={`fas ${cosmicWyrd ? 'fa-sparkles' : 'fa-mask-cat'}`}></i>
                            {cosmicWyrd ? ' Wyrd Ecology' : ' The Truth Beneath'}
                          </h4>
                          {loreWyrdRelationship && <p>{loreWyrdRelationship}</p>}
                          {cosmicLoreRows.length > 0 && (
                            <div className="bestiary-wyrd-ecology-details">
                              {cosmicLoreRows.map(([label, value]) => (
                                <p key={label}>
                                  <strong>{label}:</strong> {value}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Real-World Folklore & Cryptid Inspiration Section */}
                      {currentCreature.folkloreInspiration && (
                        <div className="bestiary-lore-section bestiary-folklore-card">
                          <div className="bestiary-folklore-header">
                            <h4>
                              <i className="fas fa-book-journal-whills"></i> Real-World Folklore &amp; Cryptid Roots
                            </h4>
                            {currentCreature.folkloreInspiration.cryptidRoots && (
                              <span className="bestiary-folklore-archetype-badge">
                                <i className="fas fa-paw"></i> {currentCreature.folkloreInspiration.cryptidRoots}
                              </span>
                            )}
                          </div>

                          {currentCreature.folkloreInspiration.primaryMyth && (
                            <div className="bestiary-folklore-primary-myth">
                              <span className="bestiary-folklore-label-tag">Mythological Root:</span>
                              <span className="bestiary-folklore-myth-name">{currentCreature.folkloreInspiration.primaryMyth}</span>
                            </div>
                          )}

                          {currentCreature.folkloreInspiration.traditions && currentCreature.folkloreInspiration.traditions.length > 0 && (
                            <div className="bestiary-folklore-traditions-row">
                              {currentCreature.folkloreInspiration.traditions.map((t, idx) => (
                                <span key={idx} className="bestiary-folklore-tradition-pill">
                                  <i className="fas fa-globe-americas"></i> {t}
                                </span>
                              ))}
                            </div>
                          )}

                          {currentCreature.folkloreInspiration.description && (
                            <div className="bestiary-folklore-narrative">
                              <p><InlineMarkdown text={currentCreature.folkloreInspiration.description} /></p>
                            </div>
                          )}

                          {currentCreature.folkloreInspiration.settingAdaptation && (
                            <div className="bestiary-folklore-adaptation-box">
                              <h5>
                                <i className="fas fa-feather-pointed"></i> Mythrill Adaptation &amp; Subversion
                              </h5>
                              <p><InlineMarkdown text={currentCreature.folkloreInspiration.settingAdaptation} /></p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 2 Content: Combat Statistics */}
                  {activeTab === 'combat' && (
                    <div className="bestiary-tab-content fade-in">
                      {currentCreature.stats ? (
                        <>
                          {/* Attributes Shield Grid */}
                          <div className="bestiary-attributes-section">
                            <h4 className="bestiary-section-subtitle">
                              <i className="fas fa-shield"></i> Core Attributes
                            </h4>
                            <div className="bestiary-attr-shield-grid">
                              {Object.entries(ATTR_LABELS).map(([key, attr]) => {
                                const score = currentCreature.stats[key] ?? 10;
                                const mod = calculateModifier(score);
                                return (
                                  <div key={key} className="bestiary-attr-shield" title={attr.desc}>
                                    <div className="bestiary-attr-title">{attr.short}</div>
                                    <div className="bestiary-attr-score">{score}</div>
                                    <div className="bestiary-attr-mod-badge">{formatModifier(mod)}</div>
                                    <div className="bestiary-attr-fullname">{attr.full}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Senses and Sights */}
                          <div className="bestiary-senses-section">
                            <h4 className="bestiary-section-subtitle">
                              <i className="fas fa-eye"></i> Senses & Sights
                            </h4>
                            <div className="bestiary-senses-grid">
                              <div className="bestiary-sense-item">
                                <i className="fas fa-person-circle-exclamation"></i>
                                <span className="label">Passive Perception:</span>
                                <span className="value">
                                  {10 + calculateModifier(currentCreature.stats.spirit || 10)}
                                </span>
                              </div>
                              <div className="bestiary-sense-item">
                                <i className="fas fa-moon"></i>
                                <span className="label">Sight:</span>
                                <span className="value">
                                  {currentRegion.id === 'bryngloom-forest' || currentRegion.id === 'nordhalla' 
                                    ? 'Darkvision 60 ft' 
                                    : 'Normal vision'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Colored Resistances and Vulnerabilities */}
                          <div className="bestiary-resistances-section">
                            <h4 className="bestiary-section-subtitle">
                              <i className="fas fa-shield-heart"></i> Resistances &amp; Weaknesses
                            </h4>
                            <div className="bestiary-res-container">
                              {/* Resistances */}
                              {currentCreature.stats.resistances && Object.keys(currentCreature.stats.resistances).length > 0 ? (
                                <div className="bestiary-res-group">
                                  {Object.entries(currentCreature.stats.resistances).map(([type, val]) =>
                                    renderResistanceBadge(type, val, false)
                                  )}
                                </div>
                              ) : null}

                              {/* Vulnerabilities */}
                              {currentCreature.stats.vulnerabilities && Object.keys(currentCreature.stats.vulnerabilities).length > 0 ? (
                                <div className="bestiary-res-group">
                                  {Object.entries(currentCreature.stats.vulnerabilities).map(([type, val]) =>
                                    renderResistanceBadge(type, val, true)
                                  )}
                                </div>
                              ) : null}

                              {(!currentCreature.stats.resistances || Object.keys(currentCreature.stats.resistances).length === 0) &&
                               (!currentCreature.stats.vulnerabilities || Object.keys(currentCreature.stats.vulnerabilities).length === 0) && (
                                <p className="bestiary-no-res">No specific elemental resistances or vulnerabilities noted.</p>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="bestiary-no-stats">
                          <i className="fas fa-triangle-exclamation"></i> No mechanical statistics have been configured for this entity.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 3 Content: Tactics & Actions */}
                  {activeTab === 'tactics' && (
                    <div className="bestiary-tab-content fade-in">
                      {currentCreature.combat && (
                        <div className="bestiary-tactics-section">
                          <h4 className="bestiary-section-subtitle">
                            <i className="fas fa-chess-board"></i> Combat Behavior &amp; Abilities
                          </h4>
                          <div className="bestiary-narrative-mechanics-card">
                            <p>{formattedCombatMechanics}</p>
                          </div>
                        </div>
                      )}

                      {currentCreature.hooks && currentCreature.hooks.length > 0 && (
                        <div className="bestiary-tactics-section">
                          <h4 className="bestiary-section-subtitle">
                            <i className="fas fa-compass-drafting"></i> GM Adventure Hooks
                          </h4>
                          <ul className="bestiary-adventure-hooks">
                            {currentCreature.hooks.map((hook, i) => (
                              <li key={i} className="bestiary-hook-card">
                                <div className="bestiary-hook-number">Hook {i + 1}</div>
                                <div className="bestiary-hook-content">{hook}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Continent Overview Title & Active Search Info */}
              <div className="bestiary-region-header">
                <div className="bestiary-region-title-wrap">
                  <h2>{currentRegion?.name}</h2>
                  <span className="bestiary-results-count">
                    Showing {displayedCreatures.length} of {filteredCreatures.length} creatures
                  </span>
                </div>
                <p className="bestiary-folklore-label">
                  <i className="fas fa-book-open"></i> Folklore Blueprint: {currentRegion?.folklore}
                </p>
              </div>

              {/* Controls Toolbar: Instant Search & Danger Level Filter Pills */}
              <div className="bestiary-controls-bar">
                <div className="bestiary-search-row">
                  <div className="bestiary-search-box">
                    <i className="fas fa-search"></i>
                    <input
                      type="text"
                      className="bestiary-search-input"
                      placeholder="Search creatures by name, role, folklore, or keywords..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    {(searchQuery || selectedDanger !== 'all') && (
                      <button
                        type="button"
                        className="bestiary-search-clear"
                        onClick={handleClearFilters}
                        title="Clear filters"
                      >
                        <i className="fas fa-times"></i> Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="bestiary-filters-row">
                  <span className="bestiary-filter-label">
                    <i className="fas fa-skull"></i> Danger Level:
                  </span>
                  <button
                    type="button"
                    className={`bestiary-filter-pill ${selectedDanger === 'all' ? 'active' : ''}`}
                    onClick={() => handleDangerSelect('all')}
                  >
                    All
                  </button>
                  {DANGER_LEVELS.map(level => {
                    const color = DANGER_COLORS[level];
                    const isCurrent = selectedDanger === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        className={`bestiary-filter-pill ${isCurrent ? 'active' : ''}`}
                        onClick={() => handleDangerSelect(level)}
                      >
                        <span 
                          className="bestiary-filter-pill-dot" 
                          style={{ backgroundColor: color.bg }} 
                        />
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Creatures Grid */}
              {displayedCreatures.length === 0 ? (
                <div className="bestiary-empty-results">
                  <i className="fas fa-shield-virus"></i>
                  <h3>No Creatures Found</h3>
                  <p>No creatures matched your search query or danger level filters.</p>
                  <button className="bestiary-empty-reset-btn" onClick={handleClearFilters}>
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="bestiary-creature-grid">
                  {displayedCreatures.map(creature => (
                    <BestiaryCreatureCard
                      key={creature.id}
                      creature={creature}
                      onSelect={handleSelectCreature}
                      regionIcon={REGION_ICONS[creature.regionId || currentRegion?.id]}
                    />
                  ))}
                </div>
              )}

              {/* Progressive loading sentinel and manual fallback button */}
              {hasMore && (
                <>
                  <div ref={sentinelRef} className="bestiary-sentinel" style={{ height: '20px', margin: '10px 0' }} />
                  <button
                    type="button"
                    className="bestiary-load-more-btn"
                    onClick={() => setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredCreatures.length))}
                  >
                    <i className="fas fa-chevron-down"></i> Load More Creatures ({filteredCreatures.length - displayedCreatures.length} remaining)
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestiaryDisplay;
