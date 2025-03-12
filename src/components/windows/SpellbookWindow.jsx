import React, { lazy, Suspense, useState, useRef } from 'react';
import WowWindow from './WowWindow';
import useSpellbookStore from '../../store/spellbookStore';
import '../spell-wizard/styles/Components/preview-card.css';
import '../spell-wizard/styles/Layout/SpellbookWindow.css';

// Import appropriate icons
import { 
  CopyIcon, 
  SaveIcon, 
  DownloadIcon, 
  InfoCircleIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ExternalLinkIcon,
  XCircleIcon
} from '../spell-wizard/icons';

// Lazy load SpellWizard to avoid circular dependencies
const SpellWizard = lazy(() => import('../spell-wizard/SpellWizard'));

// Example spells for demonstration - using the format from the spell wizard
const EXAMPLE_SPELLS = [
  {
    id: 'fireball-1',
    name: 'Fireball',
    description: 'Hurls a fiery ball that explodes on impact, dealing fire damage to all enemies in the area.',
    icon: 'spell_fire_flamebolt',
    level: 3,
    class: 'Pyrofiend',
    spellType: 'active',
    tags: ['damage', 'fire', 'aoe'],
    effectType: 'damage',
    damageTypes: ['fire'],
    visualTheme: 'fire',
    targetingMode: 'aoe',
    primaryDamage: {
      dice: '8d6',
      flat: 10
    },
    rangeType: 'ranged',
    range: 150,
    aoeShape: 'circle',
    aoeSize: 20,
    castingDescription: 'A small bead of fire forms at your fingertips, growing in intensity before launching toward the target.',
    effectDescription: 'The bead streaks through the air, leaving a trail of sparks and embers.',
    impactDescription: 'Upon impact, the bead explodes in a massive fireball, engulfing the area in roaring flames.'
  },
  {
    id: 'ice-barrier-1',
    name: 'Ice Barrier',
    description: 'Shields the caster with ice, absorbing damage and increasing frost resistance.',
    icon: 'spell_ice_lament',
    level: 2,
    class: 'Stormbringer',
    spellType: 'active',
    tags: ['defensive', 'frost', 'buff'],
    effectType: 'buff',
    damageTypes: ['frost'],
    visualTheme: 'frost',
    targetingMode: 'self',
    primaryStats: ['constitution'],
    secondaryStats: ['ac'],
    durationType: 'rounds',
    durationValue: 5,
    castingDescription: 'Crystalline frost forms around your hands as you weave magical energy into a protective pattern.',
    effectDescription: 'Shards of magical ice orbit around you, forming a translucent barrier that deflects attacks.',
    impactDescription: 'When struck, the barrier flashes with blue light and ice crystals disperse momentarily, absorbing the impact.'
  },
  {
    id: 'shadow-mend-1',
    name: 'Shadow Mend',
    description: 'Mends wounds with shadow energy, healing the target but potentially causing shadow damage over time.',
    icon: 'spell_shadow_shadowmend',
    level: 2,
    class: 'Shadowdancer',
    spellType: 'active',
    tags: ['healing', 'shadow', 'utility'],
    effectType: 'healing',
    visualTheme: 'shadow',
    targetingMode: 'single',
    healing: {
      dice: '4d8',
      flat: 8
    },
    isPersistent: true,
    persistentDuration: 3,
    persistentTick: '1d6',
    rangeType: 'touch',
    castingDescription: 'Your hands are enveloped in swirling shadows as you reach toward the target.',
    effectDescription: 'Tendrils of shadow energy wrap around wounds, knitting flesh together with dark magic.',
    impactDescription: 'The wounds close with a soft hiss, leaving behind faint purple marks that slowly fade away.'
  },
  {
    id: 'nature-growth-1',
    name: "Nature's Growth",
    description: 'Passive ability that increases healing received and health regeneration when in natural environments.',
    icon: 'ability_druid_flourish',
    level: 1,
    class: 'Elementalist',
    spellType: 'passive',
    tags: ['healing', 'nature', 'regeneration'],
    effectType: 'buff',
    visualTheme: 'nature',
    targetingMode: 'self',
    environmentalInteractions: ['enhanced_natural'],
    secondaryStats: ['health_regen', 'healing_received'],
    castingDescription: 'Small shoots and vines occasionally sprout from the ground around you as you move.',
    effectDescription: 'A gentle green aura surrounds you when standing in natural environments.',
    impactDescription: 'When healing energies affect you, they are enhanced by small blooms of magical flowers.'
  },
  {
    id: 'arcane-intellect-1',
    name: 'Arcane Intellect',
    description: 'Increases the intelligence of the target, boosting spell power and mana regeneration.',
    icon: 'spell_holy_magicalsentry',
    level: 1,
    class: 'Fateweaver',
    spellType: 'active',
    tags: ['buff', 'arcane', 'intelligence'],
    effectType: 'buff',
    visualTheme: 'arcane',
    targetingMode: 'single',
    primaryStats: ['intelligence'],
    secondaryStats: ['max_mana', 'mana_regen'],
    spellDamageStats: ['arcane_spell_power'],
    durationType: 'hours',
    durationValue: 1,
    castingDescription: 'Arcane runes circle your hands as you gesture toward the target.',
    effectDescription: 'The runes transfer to the target, orbiting their head in a gentle crown of magical energy.',
    impactDescription: 'The target\'s eyes glow with inner knowledge, and their movements become more precise and deliberate.'
  },
  {
    id: 'divine-intervention-1',
    name: 'Divine Intervention',
    description: 'When a fatal blow would be struck, prevents death and restores a portion of health. Can only occur once per day.',
    icon: 'spell_holy_divineintervention',
    level: 4,
    class: 'Fateweaver',
    spellType: 'reaction',
    tags: ['defensive', 'holy', 'life-saving'],
    effectType: 'utility',
    visualTheme: 'holy',
    targetingMode: 'self',
    conditionalEffects: [{
      id: 'lowHealth',
      description: 'Activates automatically when health falls below 5%'
    }],
    cooldownCategory: 'long_rest',
    castingDescription: 'In the moment of gravest peril, golden light emanates from within you.',
    effectDescription: 'A shimmering barrier of divine energy surrounds you, reversing the flow of time around your wounds.',
    impactDescription: 'The fatal blow is undone, and you are surrounded by a soft golden halo as your wounds partially close.'
  },
  {
    id: 'rolling-thunder-1',
    name: 'Rolling Thunder',
    description: 'Creates an aura of thunder around the caster that damages nearby enemies and has a chance to stun them.',
    icon: 'spell_nature_lightningshield',
    level: 3,
    class: 'Stormbringer',
    spellType: 'aura',
    tags: ['damage', 'lightning', 'aoe', 'stun'],
    effectType: 'damage',
    damageTypes: ['lightning'],
    visualTheme: 'lightning',
    targetingMode: 'aoe',
    primaryDamage: {
      dice: '3d6',
      flat: 5
    },
    aoeShape: 'circle',
    aoeSize: 15,
    durationType: 'rounds',
    durationValue: 3,
    negativeEffects: ['stunned'],
    castingDescription: 'You raise your arms as storm clouds gather around you, crackling with electrical energy.',
    effectDescription: 'Lightning arcs between you and the ground, creating a field of electrical discharge that moves with you.',
    impactDescription: 'Enemies that venture too close are struck by miniature lightning bolts that leap from your aura.'
  },
  {
    id: 'pyroclasm-1',
    name: 'Pyroclasm',
    description: 'Channels the fury of a volcano, dealing massive fire damage to all enemies in a large area over 5 seconds.',
    icon: 'spell_fire_volcano',
    level: 5,
    class: 'Pyrofiend',
    spellType: 'ultimate',
    tags: ['damage', 'fire', 'aoe', 'channel'],
    effectType: 'damage',
    damageTypes: ['fire'],
    visualTheme: 'fire',
    targetingMode: 'aoe',
    actionType: 'channeled',
    channelMaxRounds: 5,
    primaryDamage: {
      dice: '12d6',
      flat: 20
    },
    aoeShape: 'circle',
    aoeSize: 30,
    castingDescription: 'The ground trembles beneath your feet as you channel volcanic energies from deep within the earth.',
    effectDescription: 'The targeted area begins to crack and glow with intense heat, magma seeping through the fissures.',
    impactDescription: 'Massive gouts of flame and molten rock erupt from the ground, engulfing everything in the area in searing heat.'
  },
  {
    id: 'chronoshift-1',
    name: 'Chronoshift',
    description: 'Complex ritual that temporarily reverts an object or area to a previous state in time.',
    icon: 'spell_arcane_portaldalaran',
    level: 4,
    class: 'Fateweaver',
    spellType: 'ritual',
    tags: ['utility', 'time', 'restoration'],
    effectType: 'utility',
    visualTheme: 'arcane',
    targetingMode: 'aoe',
    utilityType: 'transformation',
    utilitySubtypes: ['temporal'],
    durationType: 'minutes',
    durationValue: 10,
    actionType: 'ritual',
    castingComponents: ['verbal', 'somatic', 'material'],
    materialComponents: 'A crushed hourglass and a fragment of amber worth at least 100 gold',
    castingDescription: 'You trace complex temporal runes in the air while reciting incantations of forgotten time magics.',
    effectDescription: 'The target area becomes overlaid with a shimmering blue field, time visibly flowing backward within it.',
    impactDescription: 'Objects and environments revert to a previous state, repairs are undone, and recent changes dissolve away.'
  }
];

// Example collections for demonstration
const EXAMPLE_COLLECTIONS = [
  {
    id: 'pyromancer-build',
    name: 'Pyromancer Build',
    description: 'A collection of fire-based spells for maximum damage output',
    icon: 'spell_fire_firebolt02',
    spells: ['fireball-1', 'pyroclasm-1'],
    color: '#FF4400'
  },
  {
    id: 'support-healer',
    name: 'Support Healer',
    description: 'Healing and buffing spells for a support role',
    icon: 'spell_holy_flashheal',
    spells: ['shadow-mend-1', 'arcane-intellect-1', 'nature-growth-1'],
    color: '#44DD44'
  },
  {
    id: 'defensive-toolkit',
    name: 'Defensive Toolkit',
    description: 'Spells focused on survival and damage mitigation',
    icon: 'spell_holy_powerwordshield',
    spells: ['ice-barrier-1', 'divine-intervention-1'],
    color: '#00CCFF'
  },
  {
    id: 'stormbringer-set',
    name: 'Stormbringer Set',
    description: 'The core spells for a lightning-based build',
    icon: 'spell_nature_lightning',
    spells: ['rolling-thunder-1'],
    color: '#FFDD00'
  }
];

// Enhanced Spell Card Component with improved visuals
const SpellCard = ({ spell, onClick }) => {
  // Get icon for the effect type
  const getEffectTypeIcon = (effectType) => {
    switch (effectType) {
      case 'damage': return <InfoCircleIcon className="effect-type-icon" />;
      case 'healing': return <CheckCircleIcon className="effect-type-icon" />;
      case 'buff': return <AlertTriangleIcon className="effect-type-icon" />;
      case 'debuff': return <XCircleIcon className="effect-type-icon" />;
      case 'utility': return <ExternalLinkIcon className="effect-type-icon" />;
      default: return null;
    }
  };

  // Get color for the visual theme
  const getThemeColor = (theme) => {
    switch (theme) {
      case 'fire': return '#FF4400';
      case 'frost': return '#00CCFF';
      case 'arcane': return '#CC44FF';
      case 'nature': return '#44DD44';
      case 'shadow': return '#8800AA';
      case 'holy': return '#FFDD00';
      case 'lightning': return '#55CCFF';
      case 'water': return '#0088CC';
      default: return '#FFFFFF';
    }
  };

  // Format damage or healing values
  const formatDamageOrHealing = (data) => {
    if (!data) return 'N/A';
    return `${data.dice || ''}${data.flat > 0 ? ` + ${data.flat}` : ''}`;
  };

  return (
    <div 
      className="spell-card" 
      onClick={() => onClick(spell.id)}
      style={{
        '--theme-color': getThemeColor(spell.visualTheme),
        '--theme-color-transparent': `${getThemeColor(spell.visualTheme)}40`,
        '--theme-glow': `${getThemeColor(spell.visualTheme)}80`,
      }}
    >
      <div className="spell-card-header">
        <div className="spell-icon-container">
          <img 
            src={`https://wow.zamimg.com/images/wow/icons/medium/${spell.icon || 'inv_misc_questionmark'}.jpg`} 
            alt={spell.name}
            className="spell-icon"
          />
          <div className="spell-level">{spell.level}</div>
        </div>
        <div className="spell-card-title">
          <h3>{spell.name}</h3>
          <div className="spell-subtitle">
            {spell.class && <span className="spell-class">{spell.class}</span>}
            <span className="spell-type">{spell.spellType}</span>
          </div>
        </div>
      </div>
      <p className="spell-description">{spell.description}</p>
      
      <div className="spell-details">
        {spell.effectType && (
          <div className="spell-detail">
            <span className="detail-label">Effect:</span>
            <span className="detail-value effect-type">
              {getEffectTypeIcon(spell.effectType)}
              {spell.effectType}
            </span>
          </div>
        )}
        
        {spell.targetingMode && (
          <div className="spell-detail">
            <span className="detail-label">Targeting:</span>
            <span className="detail-value">
              {spell.targetingMode}
              {spell.targetingMode === 'aoe' && spell.aoeShape && ` (${spell.aoeShape})`}
            </span>
          </div>
        )}
        
        {spell.effectType === 'damage' && spell.primaryDamage && (
          <div className="spell-detail">
            <span className="detail-label">Damage:</span>
            <span className="detail-value damage">
              {formatDamageOrHealing(spell.primaryDamage)}
              {spell.damageTypes && spell.damageTypes.length > 0 && 
                <span className="damage-type"> {spell.damageTypes[0]}</span>
              }
            </span>
          </div>
        )}
        
        {spell.effectType === 'healing' && spell.healing && (
          <div className="spell-detail">
            <span className="detail-label">Healing:</span>
            <span className="detail-value healing">
              {formatDamageOrHealing(spell.healing)}
            </span>
          </div>
        )}
        
        {spell.durationType && spell.durationType !== 'instant' && (
          <div className="spell-detail">
            <span className="detail-label">Duration:</span>
            <span className="detail-value">
              {spell.durationValue} {spell.durationType}
            </span>
          </div>
        )}
      </div>
      
      <div className="spell-tags">
        {spell.tags && spell.tags.map((tag, index) => (
          <span key={index} className="spell-tag">
            <InfoCircleIcon className="tag-icon" />
            {tag}
          </span>
        ))}
      </div>
      
      <div className="spell-type-indicator">
        <span className={`spell-type ${spell.spellType}`}>
          {spell.spellType && spell.spellType.charAt(0).toUpperCase() + spell.spellType.slice(1)}
        </span>
        {spell.effectType && (
          <span className={`spell-effect-type ${spell.effectType}`}>
            {spell.effectType.charAt(0).toUpperCase() + spell.effectType.slice(1)}
          </span>
        )}
      </div>
    </div>
  );
};

// Enhanced Collection Card Component
const CollectionCard = ({ collection, onClick, isSelected }) => {
  // Calculate how many spells to show in the preview
  const maxPreviewSpells = 3;
  const displaySpells = collection.spells.slice(0, maxPreviewSpells);
  const remainingSpells = collection.spells.length > maxPreviewSpells ? 
    collection.spells.length - maxPreviewSpells : 0;

  return (
    <div 
      className={`collection-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(collection.id)}
      style={{
        '--collection-color': collection.color || 'var(--primary-500)',
        '--collection-glow': `${collection.color || 'var(--primary-500)'}80`,
      }}
    >
      <div className="collection-header">
        <img 
          src={`https://wow.zamimg.com/images/wow/icons/medium/${collection.icon || 'inv_misc_book_09'}.jpg`} 
          alt={collection.name}
          className="collection-icon"
        />
        <h3>{collection.name}</h3>
      </div>
      <p className="collection-description">{collection.description}</p>
      
      <div className="collection-spells-preview">
        {displaySpells.map((spellId, index) => (
          <div key={spellId} className="collection-spell-icon" style={{ zIndex: 10 - index }}>
            <img 
              src={`https://wow.zamimg.com/images/wow/icons/small/${
                EXAMPLE_SPELLS.find(s => s.id === spellId)?.icon || 'inv_misc_questionmark'
              }.jpg`} 
              alt="Spell"
              title={EXAMPLE_SPELLS.find(s => s.id === spellId)?.name || 'Unknown Spell'}
            />
          </div>
        ))}
        {remainingSpells > 0 && (
          <div className="collection-spell-more">+{remainingSpells}</div>
        )}
      </div>
      
      <div className="collection-stats">
        <span>{collection.spells.length} spell{collection.spells.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
};

const SpellbookTab = () => {
  const { spells: storeSpells, collections, selectSpell } = useSpellbookStore();
  const [spellTypeFilter, setSpellTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [effectTypeFilter, setEffectTypeFilter] = useState('all');
  const searchInputRef = useRef(null);

  // Combine store spells with example spells
  const allSpells = [...(storeSpells || []), ...EXAMPLE_SPELLS];
  
  // Filter spells based on selected collection, spell type, effect type, and search query
  const filteredSpells = allSpells.filter(spell => {
    // Filter by collection if selected
    if (collections && collections.length > 0) {
      const collection = collections.find(c => c.id === spell.collectionId);
      if (collection) {
        return collection.spells.includes(spell.id);
      }
    }
    
    // Filter by spell type
    if (spellTypeFilter !== 'all') {
      return spell.spellType === spellTypeFilter;
    }
    
    // Filter by effect type
    if (effectTypeFilter !== 'all') {
      return spell.effectType === effectTypeFilter;
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return spell.name.toLowerCase().includes(query) || 
        spell.description.toLowerCase().includes(query) ||
        (spell.tags && spell.tags.some(tag => tag.toLowerCase().includes(query)));
    }
    
    return true;
  });

  const handleSearchFocus = () => {
    if (searchInputRef.current) {
      searchInputRef.current.classList.add('focused');
    }
  };

  const handleSearchBlur = () => {
    if (searchInputRef.current) {
      searchInputRef.current.classList.remove('focused');
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSpellTypeFilter('all');
    setEffectTypeFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="spellbook-content">
      <div className="spellbook-header">
        <h2>
          <InfoCircleIcon className="header-icon" />
          Your Spellbook
        </h2>
        
        <div className="spellbook-actions">
          <div className="search-container" ref={searchInputRef}>
            <InfoCircleIcon className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by name, description, or tag..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>
          
          <button className="filter-button">
            <AlertTriangleIcon className="filter-icon" />
            <span>Filter</span>
          </button>
        </div>
      </div>
      
      {/* Filter tabs */}
      <div className="filter-tabs-container">
        {/* Spell type tabs */}
        <div className="spellbook-tabs type-tabs">
          <button 
            className={`tab-button ${spellTypeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSpellTypeFilter('all')}
          >
            All Types
          </button>
          <button 
            className={`tab-button ${spellTypeFilter === 'active' ? 'active' : ''}`}
            onClick={() => setSpellTypeFilter('active')}
          >
            Active
          </button>
          <button 
            className={`tab-button ${spellTypeFilter === 'passive' ? 'active' : ''}`}
            onClick={() => setSpellTypeFilter('passive')}
          >
            Passive
          </button>
          <button 
            className={`tab-button ${spellTypeFilter === 'aura' ? 'active' : ''}`}
            onClick={() => setSpellTypeFilter('aura')}
          >
            Aura
          </button>
          <button 
            className={`tab-button ${spellTypeFilter === 'ultimate' ? 'active' : ''}`}
            onClick={() => setSpellTypeFilter('ultimate')}
          >
            Ultimate
          </button>
          <button 
            className={`tab-button ${spellTypeFilter === 'reaction' ? 'active' : ''}`}
            onClick={() => setSpellTypeFilter('reaction')}
          >
            Reaction
          </button>
          <button 
            className={`tab-button ${spellTypeFilter === 'ritual' ? 'active' : ''}`}
            onClick={() => setSpellTypeFilter('ritual')}
          >
            Ritual
          </button>
        </div>
        
        {/* Effect type tabs */}
        <div className="spellbook-tabs effect-tabs">
          <button 
            className={`tab-button ${effectTypeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setEffectTypeFilter('all')}
          >
            All Effects
          </button>
          <button 
            className={`tab-button damage ${effectTypeFilter === 'damage' ? 'active' : ''}`}
            onClick={() => setEffectTypeFilter('damage')}
          >
            Damage
          </button>
          <button 
            className={`tab-button healing ${effectTypeFilter === 'healing' ? 'active' : ''}`}
            onClick={() => setEffectTypeFilter('healing')}
          >
            Healing
          </button>
          <button 
            className={`tab-button buff ${effectTypeFilter === 'buff' ? 'active' : ''}`}
            onClick={() => setEffectTypeFilter('buff')}
          >
            Buff
          </button>
          <button 
            className={`tab-button debuff ${effectTypeFilter === 'debuff' ? 'active' : ''}`}
            onClick={() => setEffectTypeFilter('debuff')}
          >
            Debuff
          </button>
          <button 
            className={`tab-button utility ${effectTypeFilter === 'utility' ? 'active' : ''}`}
            onClick={() => setEffectTypeFilter('utility')}
          >
            Utility
          </button>
        </div>
      </div>
      
      {/* Filter indicators */}
      {(spellTypeFilter !== 'all' || effectTypeFilter !== 'all' || searchQuery) && (
        <div className="active-filters">
          <span>Active filters:</span>
          {spellTypeFilter !== 'all' && (
            <div className="filter-tag">
              <span>Type: {spellTypeFilter}</span>
              <button onClick={() => setSpellTypeFilter('all')}>×</button>
            </div>
          )}
          {effectTypeFilter !== 'all' && (
            <div className="filter-tag">
              <span>Effect: {effectTypeFilter}</span>
              <button onClick={() => setEffectTypeFilter('all')}>×</button>
            </div>
          )}
          {searchQuery && (
            <div className="filter-tag">
              <span>Search: {searchQuery}</span>
              <button onClick={() => setSearchQuery('')}>×</button>
            </div>
          )}
          <button className="clear-all-filters" onClick={clearFilters}>
            Clear all filters
          </button>
        </div>
      )}
      
      {/* Spells grid */}
      {filteredSpells.length > 0 ? (
        <div className="spells-grid">
          {filteredSpells.map(spell => (
            <SpellCard key={spell.id} spell={spell} onClick={selectSpell} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No spells found</h3>
          <p>Try adjusting your filters or create a new spell using the Spell Wizard tab.</p>
          <button className="create-spell-btn" onClick={() => useSpellbookStore.getState().setActiveTab('wizard')}>
            <ExternalLinkIcon />
            Create New Spell
          </button>
        </div>
      )}
    </div>
  );
};

// SpellCollectionTab component to display collections
const SpellCollectionTab = () => {
  const { collections: storeCollections, selectCollection } = useSpellbookStore();
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');
  const [newCollectionColor, setNewCollectionColor] = useState('#3DB8FF');
  
  // Combine store collections with example collections
  const allCollections = [...(storeCollections || []), ...EXAMPLE_COLLECTIONS];

  const createNewCollection = () => {
    // In a real app, this would actually create a new collection
    alert(`Creating a new collection named: ${newCollectionName}`);
    setIsCreatingCollection(false);
    setNewCollectionName('');
    setNewCollectionDesc('');
  };

  return (
    <div className="collection-content">
      <div className="collection-header">
        <h2>
          <InfoCircleIcon className="header-icon" />
          Spell Collections
        </h2>
        
        <button 
          className="create-collection-btn"
          onClick={() => setIsCreatingCollection(true)}
        >
          <ExternalLinkIcon className="btn-icon" />
          New Collection
        </button>
      </div>
      
      {isCreatingCollection && (
        <div className="create-collection-form">
          <h3>Create New Collection</h3>
          <div className="form-group">
            <label>Collection Name</label>
            <input 
              type="text" 
              value={newCollectionName}
              onChange={e => setNewCollectionName(e.target.value)}
              placeholder="Enter collection name..."
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={newCollectionDesc}
              onChange={e => setNewCollectionDesc(e.target.value)}
              placeholder="Describe this collection..."
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>Collection Color</label>
            <div className="color-picker-container">
              {['#FF4400', '#44DD44', '#00CCFF', '#CC44FF', '#FFDD00', '#8800AA'].map(color => (
                <div 
                  key={color}
                  className={`color-option ${newCollectionColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewCollectionColor(color)}
                />
              ))}
            </div>
          </div>
          <div className="form-actions">
            <button 
              className="cancel-btn"
              onClick={() => setIsCreatingCollection(false)}
            >
              Cancel
            </button>
            <button 
              className="create-btn primary"
              onClick={createNewCollection}
              disabled={!newCollectionName.trim()}
            >
              Create Collection
            </button>
          </div>
        </div>
      )}
      
      <div className="collections-grid">
        {allCollections.map(collection => (
          <CollectionCard 
            key={collection.id} 
            collection={collection} 
            onClick={selectCollection}
          />
        ))}
      </div>
      
      {allCollections.length === 0 && (
        <div className="empty-state">
          <h3>No Collections</h3>
          <p>Create a new collection to organize your spells.</p>
          <button className="create-collection-btn" onClick={() => setIsCreatingCollection(true)}>
            <ExternalLinkIcon />
            Create New Collection
          </button>
        </div>
      )}
    </div>
  );
};

const SpellWizardTab = () => {
  // No local state, just render the wizard
  return (
    <Suspense fallback={<div className="loading-wizard">Loading Spell Wizard...</div>}>
      <SpellWizard />
    </Suspense>
  );
};

const SpellbookWindow = ({ isOpen = true, onClose = () => {} }) => {
  const [activeTab, setActiveTab] = useState('spells');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'spells':
        return <SpellbookTab />;
      case 'collections':
        return <SpellCollectionTab />;
      case 'wizard':
        return <SpellWizardTab />;
      default:
        return null;
    }
  };

  return (
    <WowWindow
      title="Spellbook"
      isOpen={isOpen}
      onClose={onClose}
      defaultSize={{ width: 800, height: 600 }}
    >
      <div className="spellbook-container">
        <div className="spellbook-tabs">
          <button
            className={`tab-button ${activeTab === 'spells' ? 'active' : ''}`}
            onClick={() => setActiveTab('spells')}
          >
            Spells
          </button>
          <button
            className={`tab-button ${activeTab === 'collections' ? 'active' : ''}`}
            onClick={() => setActiveTab('collections')}
          >
            Collections
          </button>
          <button
            className={`tab-button ${activeTab === 'wizard' ? 'active' : ''}`}
            onClick={() => setActiveTab('wizard')}
          >
            Create Spell
          </button>
        </div>
        <div className="spellbook-content">
          {renderTabContent()}
        </div>
      </div>
    </WowWindow>
  );
};

export default SpellbookWindow;