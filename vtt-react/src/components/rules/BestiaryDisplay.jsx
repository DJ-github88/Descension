import React, { useState, useMemo, useRef, useEffect, useCallback, memo } from 'react';
import Fuse from 'fuse.js';
import BESTIARY_DATA from '../../data/creatureData.json';
import InlineMarkdown from '../common/InlineMarkdown';
import './BestiaryDisplay.css';

const DANGER_COLORS = {
  Trivial: { bg: '#6c757d', text: '#fff' },
  Low: { bg: '#2d6a4f', text: '#fff' },
  Medium: { bg: '#a85c1a', text: '#fff' },
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
  smashing: { label: 'Smashing', color: '#8B5A2B', icon: 'fa-hammer' },
  stabbing: { label: 'Stabbing', color: '#704214', icon: 'fa-location-arrow' },
  slicing: { label: 'Slicing', color: '#5C3317', icon: 'fa-cut' },
  ember: { label: 'Ember', color: '#D4380D', icon: 'fa-fire' },
  rime: { label: 'Rime', color: '#2C5F7C', icon: 'fa-snowflake' },
  storm: { label: 'Storm', color: '#8B7328', icon: 'fa-bolt' },
  primal: { label: 'Primal', color: '#2D5A1E', icon: 'fa-leaf' },
  arcane: { label: 'Arcane', color: '#5B3A8C', icon: 'fa-magic' },
  blight: { label: 'Blight', color: '#3D1F4E', icon: 'fa-skull' },
  wyrd: { label: 'Wyrd', color: '#7A2040', icon: 'fa-brain' },
  sacred: { label: 'Sacred', color: '#DAA520', icon: 'fa-sun' },
  healing: { label: 'Healing', color: '#2E8B57', icon: 'fa-heart' },
  fire: { label: 'Ember', color: '#D4380D', icon: 'fa-fire' },
  cold: { label: 'Rime', color: '#2C5F7C', icon: 'fa-snowflake' },
  frost: { label: 'Rime', color: '#2C5F7C', icon: 'fa-snowflake' },
  ice: { label: 'Rime', color: '#2C5F7C', icon: 'fa-snowflake' },
  lightning: { label: 'Storm', color: '#8B7328', icon: 'fa-bolt' },
  thunder: { label: 'Storm', color: '#8B7328', icon: 'fa-bolt' },
  necrotic: { label: 'Blight', color: '#3D1F4E', icon: 'fa-skull' },
  poison: { label: 'Blight', color: '#3D1F4E', icon: 'fa-skull' },
  acid: { label: 'Blight', color: '#3D1F4E', icon: 'fa-skull' },
  shadow: { label: 'Blight', color: '#3D1F4E', icon: 'fa-skull' },
  radiant: { label: 'Sacred', color: '#DAA520', icon: 'fa-sun' },
  holy: { label: 'Sacred', color: '#DAA520', icon: 'fa-sun' },
  psychic: { label: 'Wyrd', color: '#7A2040', icon: 'fa-brain' },
  chaos: { label: 'Wyrd', color: '#7A2040', icon: 'fa-brain' },
  force: { label: 'Arcane', color: '#5B3A8C', icon: 'fa-magic' },
  nature: { label: 'Primal', color: '#2D5A1E', icon: 'fa-leaf' },
  physical: { label: 'Physical', color: '#a1887f', icon: 'fa-shield-alt' },
  bludgeoning: { label: 'Smashing', color: '#8B5A2B', icon: 'fa-hammer' },
  piercing: { label: 'Stabbing', color: '#704214', icon: 'fa-location-arrow' },
  slashing: { label: 'Slicing', color: '#5C3317', icon: 'fa-cut' }
};

const ITEMS_PER_PAGE = 18;

// Stable, flattened creature list computed ONCE at module load.
// Object.assign keeps the original creature object identity stable, so
// memoized cards skip re-renders during filtering/search (no object churn).
// The pre-lowercased _haystack turns per-keystroke search into a single
// includes() per creature instead of ~11 toLowerCase+includes calls.
const ALL_CREATURES = BESTIARY_DATA.regions.flatMap(r =>
  (r.creatures || []).map(c => {
    const folk = c.folkloreInspiration || {};
    const haystack = [
      c.name,
      c.role,
      c.origin,
      c.nature,
      c.heritage,
      r.name,
      Array.isArray(folk.traditions) ? folk.traditions.join(' ') : folk.traditions,
      folk.primaryMyth,
      folk.cryptidRoots,
      folk.description,
      folk.settingAdaptation
    ].map(v => (typeof v === 'string' ? v : '')).join(' ').toLowerCase();
    return Object.assign(c, { regionName: r.name, regionId: r.id, _haystack: haystack });
  })
);

const REGIONS_BY_ID = new Map(BESTIARY_DATA.regions.map(r => [r.id, r]));

// Pre-configured Fuse instance for instant typo-tolerant fuzzy search
const BESTIARY_FUSE = new Fuse(ALL_CREATURES, {
  keys: [
    { name: 'name', weight: 0.5 },
    { name: 'role', weight: 0.2 },
    { name: 'origin', weight: 0.15 },
    { name: 'heritage', weight: 0.15 },
    { name: 'folkloreInspiration.primaryMyth', weight: 0.2 },
    { name: 'folkloreInspiration.cryptidRoots', weight: 0.15 },
    { name: 'folkloreInspiration.traditions', weight: 0.1 },
    { name: '_haystack', weight: 0.1 }
  ],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2
});

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

// Sampled paper tone per illustration (cached): each card adopts its artwork's
// own parchment color so the image and card body read as one seamless plate.
const PAPER_TONE_CACHE = new Map();

const samplePaperTone = (img, src) => {
  const cacheKey = src || (img && (img.currentSrc || img.src));
  if (!cacheKey) return null;
  if (PAPER_TONE_CACHE.has(cacheKey)) return PAPER_TONE_CACHE.get(cacheKey);
  let tone = null;
  try {
    if (img && img.naturalWidth && typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = 40;
      canvas.height = 40;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(img, 0, 0, 40, 40);
        const { data } = ctx.getImageData(0, 0, 40, 40);
        let r = 0, g = 0, b = 0, n = 0;
        for (let i = 0; i < data.length; i += 4) {
          const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
          if (lum >= 190) {
            r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
          }
        }
        if (n > 0) {
          tone = '#' + [r / n, g / n, b / n]
            .map(v => Math.round(v).toString(16).padStart(2, '0'))
            .join('');
        }
      }
    }
  } catch (e) {
    tone = null;
  }
  PAPER_TONE_CACHE.set(cacheKey, tone);
  return tone;
};

// Dynamic Game-Mechanic Formatter
// Converts raw text descriptions of damage rolls, save DCs, etc., into gorgeous, styled inline RPG badges
const formatCombatMechanicsText = (text) => {
  if (!text) return null;
  
  const regex = /(\b\d+d\d+(?:\+\d+)?\b(?:\s+(?:smashing|stabbing|slicing|ember|rime|storm|primal|arcane|blight|wyrd|sacred|healing|piercing|bludgeoning|slashing|cold|frost|ice|fire|psychic|necrotic|radiant|poison|lightning|thunder|acid|force|nature|physical))?|\bDC\s+\d+\s+[A-Z]{3,4}\b|\b\d+-ft\s+(?:radius|cone|range|diameter)?\b|\b\d+\s+HP,\s+DR\s+\d+\b)/gi;
  const testRegex = new RegExp(regex.source, 'i');
  
  const parts = text.split(regex);
  return parts.map((part, i) => {
    if (testRegex.test(part)) {
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

const formatLoreLabel = (value) => readLoreText(value)
  .replace(/[-_]+/g, ' ')
  .toLowerCase()
  .replace(/\bwyrd\b/g, 'Wyrd')
  .replace(/^./, letter => letter.toUpperCase());

const BestiaryIllustration = ({ creature, regionIcon }) => {
  const [imageError, setImageError] = useState(false);
  const [paperTone, setPaperTone] = useState(() => PAPER_TONE_CACHE.get(creature.illustration));

  return (
    <figure className="bestiary-detail-illustration" style={{ '--paper-tone': paperTone || undefined }}>
      <div className="bestiary-card-image bestiary-portrait-frame">
        {creature.illustration && !imageError ? (
          <img
            src={creature.illustration}
            alt={creature.illustrationCaption || creature.name}
            width="640"
            height="640"
            decoding="async"
            onLoad={event => setPaperTone(samplePaperTone(event.currentTarget, creature.illustration))}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="bestiary-portrait-empty">
            <i className={`fas ${regionIcon || 'fa-globe'}`} aria-hidden="true"></i>
            <span>Illustration unavailable</span>
          </div>
        )}
      </div>
      {creature.illustrationCaption && (
        <figcaption className="bestiary-detail-caption">
          <InlineMarkdown text={creature.illustrationCaption} />
        </figcaption>
      )}
    </figure>
  );
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
  const [paperTone, setPaperTone] = useState(
    () => PAPER_TONE_CACHE.get(getCreatureThumb(creature.illustration)) || null
  );

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
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(creature.id);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open ${creature.name} folio`}
      title={`${creature.dangerLevel} danger`}
      data-creature-id={creature.id}
      style={{ '--danger-color': dangerStyle.bg, '--paper-tone': paperTone || undefined }}
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
              height="163"
              draggable={false}
              onLoad={(e) => {
                setImageLoaded(true);
                const tone = samplePaperTone(e.currentTarget, thumbSrc);
                if (tone) setPaperTone(tone);
              }}
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
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [selectedCreature, setSelectedCreature] = useState(null);
  const entryRef = useRef(null);

  useEffect(() => {
    if (!selectedCreature) return;
    entryRef.current?.scrollIntoView?.({ block: 'start' });
    entryRef.current?.querySelector('h2')?.focus({ preventScroll: true });
  }, [selectedCreature]);

  const sentinelRef = useRef(null);

  // Debounce search so typing does not filter 190+ creatures on every keystroke
  useEffect(() => {
    if (!searchQuery) {
      setDebouncedSearchQuery('');
      return;
    }
    const t = setTimeout(() => setDebouncedSearchQuery(searchQuery), 180);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Total creatures count across all regions
  const totalCreaturesCount = useMemo(() => {
    return BESTIARY_DATA.regions.reduce((acc, r) => acc + (r.creatures?.length || 0), 0);
  }, []);

  // Pre-filter creatures based on selected continent, danger, and search query.
  // Filters operate on the stable module-level ALL_CREATURES list — items keep
  // their identity so memoized cards do not re-render unless actually new.
  const filteredCreatures = useMemo(() => {
    const q = debouncedSearchQuery.trim();

    let base = selectedRegion === 'all'
      ? ALL_CREATURES
      : (REGIONS_BY_ID.get(selectedRegion)?.creatures || []);

    if (selectedDanger !== 'all') {
      base = base.filter(c => c.dangerLevel === selectedDanger);
    }

    if (!q) {
      return base;
    }

    // Execute Fuse fuzzy search across all creatures
    const fuseResults = BESTIARY_FUSE.search(q);
    const qLower = q.toLowerCase();
    const exactMatches = base.filter(c => c._haystack && c._haystack.includes(qLower));

    // Filter by active region & danger level while preserving Fuse relevance order
    const filteredResults = [];
    const addedIds = new Set();

    for (let i = 0; i < fuseResults.length; i++) {
      const item = fuseResults[i].item;
      if (
        (selectedRegion === 'all' || item.regionId === selectedRegion) &&
        (selectedDanger === 'all' || item.dangerLevel === selectedDanger)
      ) {
        filteredResults.push(item);
        addedIds.add(item.id || item.name);
      }
    }

    // Append any exact matches not already in the list to ensure 100% backward compatibility
    exactMatches.forEach(item => {
      const key = item.id || item.name;
      if (!addedIds.has(key)) {
        filteredResults.push(item);
        addedIds.add(key);
      }
    });

    return filteredResults;
  }, [selectedRegion, selectedDanger, debouncedSearchQuery]);

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
    setDebouncedSearchQuery('');
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
  
  const loreClassificationRows = [
    ['Record status', loreClassification.status],
    ['Lineage', loreClassification.originClass],
    ['Wyrd affinity', loreClassification.wyrdRelationship]
  ]
    .map(([label, value]) => [label, formatLoreLabel(value)])
    .filter(([, value]) => value);

  const loreNote = readLoreText(currentCreature?.loreNote);
  const loreOrigin = readLoreText(loreCanon.trueOrigin) || readLoreText(currentCreature?.origin);
  const loreFolklore = readLoreText(loreCanon.folklore) || readLoreText(currentCreature?.heritage);
  const loreFunction = readLoreText(loreCanon.function) || readLoreText(currentCreature?.nature);
  const loreValues = readLoreText(loreCanon.values);
  const loreBindingEffect = readLoreText(loreCanon.bindingEffect);
  const cosmicWyrd = isCosmicWyrdCreature(loreClassification);
  const loreWyrdRelationship = readLoreText(loreCanon.wyrdRelationship)
    || readLoreText(currentCreature?.depth)
    || formatLoreLabel(loreClassification.wyrdRelationship);

  const cosmicLoreRows = cosmicWyrd ? [
      ['Cosmic provenance', loreCanon.cosmicProvenance],
      ['Wyrd function', loreCanon.wyrdFunction],
      ['Mythrill anchor', loreCanon.anchor],
      ['Keth Amar relationship', loreCanon.kethRelationship],
      ['Current independence', loreCanon.independence],
      ['Countermeasure', loreCanon.countermeasure]
    ]
      .map(([label, value]) => [label, readLoreText(value)])
      .filter(([, value]) => value) : [];

  const hasLayerMetadata = loreClassificationRows.length > 0 || Boolean(loreNote);
  const hasTruthBeneath = Boolean(loreWyrdRelationship) || cosmicLoreRows.length > 0;

  // Memoized formatted combat text
  const formattedCombatMechanics = useMemo(() => {
    return formatCombatMechanicsText(currentCreature?.combat);
  }, [currentCreature?.combat]);

  const handleBack = useCallback(() => {
    setSelectedCreature(null);
    requestAnimationFrame(() => document.querySelector(`[data-creature-id="${selectedCreature}"]`)?.focus());
  }, [selectedCreature]);

  const handleSelectCreature = useCallback((creatureId) => {
    setSelectedCreature(creatureId);
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
          <h3 className="bestiary-intro-title">The Native Bestiary &amp; Cosmic Wyrd</h3>
          <p className="bestiary-intro-text">
            Beasts, spirits, mythic peoples, constructs, and living lands called Mythrill home long before the Great Binding.
            Folklore remembers their encounters; it does not bring them into being.
          </p>
          <details className="bestiary-intro-notes">
            <summary>Reading the Wyrd</summary>
            <p>Ancient Cosmic Wyrdkin come from beyond Mythrill. Keth-spawn and Wyrdspawn are direct local manifestations;
              Wyrd-touched natives are individuals or branches changed by exposure. The Wyrd is a distinct cosmic medium
              and ecology, not the origin of every creature. Some entities remain anchored here after Keth Amar retreats.
              Learn a creature's origin and anchor before choosing how to confront it.</p>
          </details>
        </div>
      )}

      <div className="bestiary-layout">
        {/* Left Continent Sidebar */}
        <nav className="bestiary-sidebar" aria-label="Bestiary continents">
          <h4 className="bestiary-sidebar-title">Continents</h4>
          <ul className="bestiary-region-list">
            <li><button
              type="button"
              className={`bestiary-region-item ${selectedRegion === 'all' ? 'active' : ''}`}
              aria-pressed={selectedRegion === 'all'}
              onClick={() => handleRegionSelect('all')}
            >
              <i className="fas fa-globe bestiary-region-icon" aria-hidden="true"></i>
              <div className="bestiary-region-info">
                <span className="bestiary-region-name">All Regions</span>
                <span className="bestiary-region-folklore">Entire World</span>
              </div>
              <span className="bestiary-region-count">{totalCreaturesCount}</span>
            </button></li>
            {BESTIARY_DATA.regions.map(region => (
              <li key={region.id}><button
                type="button"
                className={`bestiary-region-item ${selectedRegion === region.id ? 'active' : ''}`}
                aria-pressed={selectedRegion === region.id}
                onClick={() => handleRegionSelect(region.id)}
              >
                <i className={`fas ${REGION_ICONS[region.id] || 'fa-globe'} bestiary-region-icon`} aria-hidden="true"></i>
                <div className="bestiary-region-info">
                  <span className="bestiary-region-name">{region.name}</span>
                  <span className="bestiary-region-folklore">{region.folklore}</span>
                </div>
                <span className="bestiary-region-count">{region.creatures?.length || 0}</span>
              </button></li>
            ))}
          </ul>
        </nav>

        {/* Main Content Area */}
        <div className="bestiary-main">
          {currentCreature ? (
            <article className="bestiary-detail" aria-labelledby="bestiary-creature-name" ref={entryRef}>
              <div className="bestiary-folio-toolbar">
                <button className="bestiary-back-btn" onClick={handleBack}>
                  <i className="fas fa-arrow-left" aria-hidden="true"></i> Back to {selectedRegion === 'all' ? 'All Regions' : currentRegion.name}
                </button>
                <nav className="bestiary-chapter-nav" aria-label="Creature entry sections">
                  <a href="#bestiary-lore">Lore &amp; legends</a>
                  <a href="#bestiary-combat">Stat block</a>
                  <a href="#bestiary-tactics">Encounters</a>
                </nav>
              </div>

              {/* Double Column Journal Page */}
              <div className="bestiary-detail-body">
                {/* Column 1: Portrait & Quick Stats */}
                <div className="bestiary-portrait-col">
                  <BestiaryIllustration key={currentCreature.id} creature={currentCreature} regionIcon={REGION_ICONS[currentRegion.id]} />

                  {/* Quick Stats Panel */}
                  {currentCreature.stats && (
                    <div className="bestiary-quick-stats-card">
                      <h4 className="bestiary-quick-stats-title">
                        <i className="fas fa-heart-pulse" aria-hidden="true"></i> At a glance
                      </h4>
                      <div className="bestiary-quick-stats-grid">
                        <div className="bestiary-quick-stat-item hp">
                          <span className="label">Hit points</span>
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
                            <span className="value">—</span>
                          </div>
                        )}
                        <div className="bestiary-quick-stat-item ap">
                          <span className="label">Action points</span>
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

                <div className="bestiary-lore-col">
                  <header className="bestiary-detail-header">
                    <div className="bestiary-detail-title-group">
                      <h2 className="bestiary-detail-name" id="bestiary-creature-name" tabIndex={-1}>{currentCreature.name}</h2>
                      <span className="bestiary-detail-badge" style={{ '--danger-color': (DANGER_COLORS[currentCreature.dangerLevel] || DANGER_COLORS.Medium).bg }}>
                        {currentCreature.dangerLevel} danger
                      </span>
                    </div>
                    <p className="bestiary-detail-role">{readLoreText(currentCreature.role).replace(/\s*\/\s*/g, ' / ')}</p>
                    {currentCreature.description && (
                      <p className="bestiary-detail-summary"><InlineMarkdown text={currentCreature.description} /></p>
                    )}
                  </header>

                  <section className="bestiary-folio-chapter bestiary-lore-chapter" id="bestiary-lore" tabIndex={-1} aria-label="Lore and legends">
                      {loreOrigin && (
                        <div className="bestiary-lore-section">
                          <h4>Origins</h4>
                          <p><InlineMarkdown text={loreOrigin} /></p>
                        </div>
                      )}

                      {loreFolklore && (
                        <div className="bestiary-lore-section">
                          <h4>Lore &amp; legends</h4>
                          <p><InlineMarkdown text={loreFolklore} /></p>
                        </div>
                      )}

                      {loreFunction && (
                        <div className="bestiary-lore-section">
                          <h4>Nature &amp; purpose</h4>
                          <p><InlineMarkdown text={loreFunction} /></p>
                        </div>
                      )}

                      {currentCreature.habitat && (
                        <div className="bestiary-lore-section">
                          <h4>Habitat</h4>
                          <p><InlineMarkdown text={currentCreature.habitat} /></p>
                        </div>
                      )}

                      {loreValues && (
                        <div className="bestiary-lore-section">
                          <h4>Values &amp; guardianship</h4>
                          <p><InlineMarkdown text={loreValues} /></p>
                        </div>
                      )}

                      {loreBindingEffect && (
                        <div className="bestiary-lore-section">
                          <h4>After the Binding</h4>
                          <p><InlineMarkdown text={loreBindingEffect} /></p>
                        </div>
                      )}

                      {hasTruthBeneath && (
                        <div className="bestiary-lore-section bestiary-depth">
                          <h4>{cosmicWyrd ? 'Wyrd ecology' : 'Relationship with the Wyrd'}</h4>
                          {loreWyrdRelationship && <p><InlineMarkdown text={loreWyrdRelationship} /></p>}
                          {cosmicLoreRows.length > 0 && (
                            <div className="bestiary-wyrd-ecology-details">
                              {cosmicLoreRows.map(([label, value]) => (
                                <p key={label}>
                                  <strong>{label}:</strong> <InlineMarkdown text={value} />
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {hasLayerMetadata && (
                        <details className="bestiary-source-notes">
                          <summary>Archivist's notes</summary>
                          <dl className="bestiary-classification">
                            {loreClassificationRows.map(([label, value]) => (
                              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                            ))}
                          </dl>
                          {loreNote && <p><InlineMarkdown text={loreNote} /></p>}
                        </details>
                      )}

                      {currentCreature.folkloreInspiration && (
                        <details className="bestiary-source-notes bestiary-folklore-card">
                          <summary>Folklore &amp; inspirations</summary>
                          <div className="bestiary-folklore-header">
                            {currentCreature.folkloreInspiration.cryptidRoots && (
                              <p className="bestiary-folklore-archetype-badge">{currentCreature.folkloreInspiration.cryptidRoots}</p>
                            )}
                          </div>

                          {currentCreature.folkloreInspiration.primaryMyth && (
                            <div className="bestiary-folklore-primary-myth">
                              <span className="bestiary-folklore-label-tag">Mythic roots:</span>
                              <span className="bestiary-folklore-myth-name">{currentCreature.folkloreInspiration.primaryMyth}</span>
                            </div>
                          )}

                          {currentCreature.folkloreInspiration.traditions && currentCreature.folkloreInspiration.traditions.length > 0 && (
                            <div className="bestiary-folklore-traditions-row">
                              {currentCreature.folkloreInspiration.traditions.map((t, idx) => (
                                <span key={idx} className="bestiary-folklore-tradition-pill">
                                  {t}
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
                                In Mythrill
                              </h5>
                              <p><InlineMarkdown text={currentCreature.folkloreInspiration.settingAdaptation} /></p>
                            </div>
                          )}
                        </details>
                      )}
                  </section>
                </div>
              </div>

                  <section className="bestiary-folio-chapter bestiary-combat-chapter" id="bestiary-combat" tabIndex={-1} aria-labelledby="bestiary-stat-title">
                    <h3 className="bestiary-chapter-title" id="bestiary-stat-title">Stat block</h3>
                      {currentCreature.stats ? (
                        <>
                          {/* Attributes Shield Grid */}
                          <div className="bestiary-attributes-section">
                            <h4 className="bestiary-section-subtitle">
                               Core attributes
                            </h4>
                            <div className="bestiary-attr-shield-grid">
                              {Object.entries(ATTR_LABELS).map(([key, attr]) => {
                                const score = currentCreature.stats[key] ?? 10;
                                const mod = calculateModifier(score);
                                return (
                                  <div key={key} className="bestiary-attr-shield" title={attr.desc}>
                                    <div className="bestiary-attr-title">{attr.short}</div>
                                    <div className="bestiary-attr-score">{score}</div>
                                     <div className="bestiary-attr-mod-badge">{formatModifier(mod)} modifier</div>
                                    <div className="bestiary-attr-fullname">{attr.full}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Senses and Sights */}
                          <div className="bestiary-senses-section">
                            <h4 className="bestiary-section-subtitle">
                               Senses
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
                               Resistances &amp; weaknesses
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
                           No stat block is recorded for this creature yet.
                        </div>
                      )}
                  </section>

                  <section className="bestiary-folio-chapter bestiary-encounter-chapter" id="bestiary-tactics" tabIndex={-1} aria-labelledby="bestiary-encounter-title">
                    <h3 className="bestiary-chapter-title" id="bestiary-encounter-title">Encounters</h3>
                      {currentCreature.combat && (
                        <div className="bestiary-tactics-section">
                          <h4 className="bestiary-section-subtitle">
                             Tactics &amp; abilities
                          </h4>
                          <div className="bestiary-narrative-mechanics-card">
                            <p>{formattedCombatMechanics}</p>
                          </div>
                        </div>
                      )}

                      {currentCreature.hooks && currentCreature.hooks.length > 0 && (
                        <div className="bestiary-tactics-section">
                          <h4 className="bestiary-section-subtitle">
                             Adventure hooks
                          </h4>
                          <ul className="bestiary-adventure-hooks">
                            {currentCreature.hooks.map((hook, i) => (
                              <li key={i} className="bestiary-hook-card">
                                <div className="bestiary-hook-number">Hook {i + 1}</div>
                                 <div className="bestiary-hook-content"><InlineMarkdown text={hook} /></div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    {!currentCreature.combat && !currentCreature.hooks?.length && (
                      <p className="bestiary-no-stats">No encounter notes are recorded for this creature yet.</p>
                    )}
                  </section>
            </article>
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
                      aria-label="Search the bestiary"
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
