import React, { lazy, Suspense, useState, useRef, useEffect } from 'react';
import WowWindow from './WowWindow';
import useSpellbookStore from '../../store/spellbookStore';
import '../spellcrafting-wizard/styles/SpellWizard.css';
import '../spellcrafting-wizard/styles/SpellPreview.css';

// Import spell library data
import { LIBRARY_SPELLS, LIBRARY_COLLECTIONS } from '../../data/spellLibraryData';

// Import appropriate icons
import {
  FaSearch as SearchIcon,
  FaFilter as FilterIcon,
  FaBook as BookIcon,
  FaMagic as MagicIcon,
  FaTimesCircle as XCircleIcon,
  FaInfoCircle as InfoCircleIcon
} from 'react-icons/fa';

// Import WoW Classic styles
import '../../styles/wow-classic.css';

// Lazy load SpellWizard to avoid circular dependencies
const SpellWizard = lazy(() => import('../spellcrafting-wizard/SpellWizardWrapper'));

// Enhanced Spell Card Component with WoW Classic styling
const SpellCard = ({ spell, onClick }) => {
  // Format damage or healing values
  const formatDamageOrHealing = (data) => {
    if (!data) return 'N/A';
    return `${data.dice || ''}${data.flat > 0 ? ` + ${data.flat}` : ''}`;
  };

  // Get rarity class for border coloring based on spell complexity
  const getRarityClass = () => {
    // Instead of level, use the number of effects or complexity
    const effectCount = [
      spell.primaryDamage ? 1 : 0,
      spell.healing ? 1 : 0,
      spell.debuffConfig ? 1 : 0,
      spell.buffConfig ? 1 : 0,
      spell.negativeEffects?.length > 0 ? 1 : 0,
      spell.mechanicsConfig?.procs ? 1 : 0,
      spell.mechanicsConfig?.forms ? 1 : 0,
      spell.mechanicsConfig?.combos ? 1 : 0
    ].reduce((a, b) => a + b, 0);

    if (effectCount >= 4) return 'legendary';
    if (effectCount >= 3) return 'epic';
    if (effectCount >= 2) return 'rare';
    if (effectCount >= 1) return 'uncommon';
    return 'common';
  };

  // Get spell school color
  const getSpellSchoolColor = () => {
    const theme = spell.visualTheme;
    switch (theme) {
      case 'fire': return 'spell-fire';
      case 'frost': return 'spell-frost';
      case 'arcane': return 'spell-arcane';
      case 'nature': return 'spell-nature';
      case 'shadow': return 'spell-shadow';
      case 'holy': return 'spell-holy';
      case 'lightning': return 'spell-lightning';
      case 'physical': return 'spell-physical';
      default: return '';
    }
  };

  // Format casting time
  const formatCastingTime = () => {
    if (spell.actionType === 'channeled') return 'Channeled';
    if (spell.spellType === 'reaction') return 'Reaction';
    if (spell.spellType === 'ritual') return 'Ritual';
    if (spell.spellType === 'passive') return 'Passive';
    return 'Instant';
  };

  // Format range
  const formatRange = () => {
    if (spell.targetingMode === 'self') return 'Self';
    if (spell.targetingMode === 'aoe') {
      return `${spell.aoeShape || 'Area'} (${spell.aoeSize || 20} ft)`;
    }
    if (spell.range) return `${spell.range} ft`;
    return 'Touch';
  };

  // Format duration
  const formatDuration = () => {
    if (spell.durationType === 'instant') return 'Instant';
    if (spell.durationType && spell.durationValue) {
      return `${spell.durationValue} ${spell.durationType}`;
    }
    if (spell.actionType === 'channeled') {
      return `Up to ${spell.channelMaxRounds || 5} rounds`;
    }
    return 'Instant';
  };

  return (
    <div
      className={`wow-spell-card ${getRarityClass()} ${getSpellSchoolColor()}`}
      onClick={() => onClick(spell.id)}
    >
      <div className="spell-card-gloss"></div>
      <div className="spell-card-content">
        <div className="spell-card-header">
          <div className="spell-icon-wrapper">
            <div className="spell-icon-border">
              <img
                src={`https://wow.zamimg.com/images/wow/icons/large/${spell.icon || 'inv_misc_questionmark'}.jpg`}
                alt={spell.name}
                className="spell-icon"
              />
            </div>
            <div className="spell-rank">{spell.spellType}</div>
          </div>
          <div className="spell-info">
            <h3 className="spell-name">{spell.name}</h3>
            <div className="spell-meta">
              <span className="spell-cast-time">{formatCastingTime()}</span>
              <span className="spell-range">{formatRange()}</span>
            </div>
          </div>
        </div>

        <div className="spell-divider"></div>

        <div className="spell-body">
          <p className="spell-description">{spell.description}</p>

          <div className="spell-stats">
            {/* Damage display */}
            {(spell.effectType === 'damage' || spell.primaryDamage) && (
              <div className="spell-stat">
                <span className="spell-stat-name">Damage:</span>
                <span className="spell-stat-value damage">
                  {formatDamageOrHealing(spell.primaryDamage)}
                  {spell.damageTypes && spell.damageTypes.length > 0 &&
                    <span className="damage-type"> {spell.damageTypes[0]}</span>
                  }
                </span>
              </div>
            )}

            {/* Healing display */}
            {(spell.effectType === 'healing' || spell.healing) && (
              <div className="spell-stat">
                <span className="spell-stat-name">Healing:</span>
                <span className="spell-stat-value healing">
                  {formatDamageOrHealing(spell.healing)}
                </span>
              </div>
            )}

            {/* Status effects display */}
            {spell.negativeEffects && spell.negativeEffects.length > 0 && (
              <div className="spell-stat">
                <span className="spell-stat-name">Effects:</span>
                <span className="spell-stat-value effect">
                  {spell.negativeEffects.join(', ')}
                </span>
              </div>
            )}

            {/* Buff effects display */}
            {spell.buffConfig && spell.buffConfig.statPenalties && (
              <div className="spell-stat">
                <span className="spell-stat-name">Buffs:</span>
                <span className="spell-stat-value buff">
                  {spell.buffConfig.statPenalties.map(p =>
                    `${p.stat} ${p.value > 0 ? '+' : ''}${p.value}${p.isPercentage ? '%' : ''}`
                  ).join(', ')}
                </span>
              </div>
            )}

            {/* Debuff effects display */}
            {spell.debuffConfig && spell.debuffConfig.statPenalties && (
              <div className="spell-stat">
                <span className="spell-stat-name">Debuffs:</span>
                <span className="spell-stat-value debuff">
                  {spell.debuffConfig.statPenalties.map(p =>
                    `${p.stat} ${p.value > 0 ? '+' : ''}${p.value}${p.isPercentage ? '%' : ''}`
                  ).join(', ')}
                </span>
              </div>
            )}

            {/* Duration display */}
            {spell.durationType && spell.durationType !== 'instant' && (
              <div className="spell-stat">
                <span className="spell-stat-name">Duration:</span>
                <span className="spell-stat-value">
                  {formatDuration()}
                </span>
              </div>
            )}

            {/* Cooldown display */}
            {spell.cooldown && (
              <div className="spell-stat">
                <span className="spell-stat-name">Cooldown:</span>
                <span className="spell-stat-value cooldown">
                  {spell.cooldown}
                </span>
              </div>
            )}

            {/* Area of effect display */}
            {spell.aoeShape && (
              <div className="spell-stat">
                <span className="spell-stat-name">Area:</span>
                <span className="spell-stat-value">
                  {spell.aoeShape} ({spell.aoeSize} ft)
                </span>
              </div>
            )}

            {/* School display */}
            {spell.class && (
              <div className="spell-stat">
                <span className="spell-stat-name">School:</span>
                <span className="spell-stat-value school">
                  {spell.class}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="spell-footer">
          <div className="spell-tags">
            {spell.tags && spell.tags.map((tag, index) => (
              <span key={`tag-${index}`} className={`spell-tag ${tag}`}>{tag}</span>
            ))}
          </div>
          <div className={`spell-type-badge ${spell.spellType}`}>
            {spell.spellType}
          </div>
        </div>
      </div>
    </div>
  );
};

const SpellWizardTab = () => {
  // No local state, just render the wizard
  return (
    <Suspense fallback={<div className="loading-wizard">Loading Spell Wizard...</div>}>
      <div style={{ width: '100%', height: '100%', padding: 0, overflow: 'auto' }}>
        <SpellWizard hideHeader={true} />
      </div>
    </Suspense>
  );
};

const SpellbookWindow = ({ isOpen = true, onClose = () => {} }) => {
  const { activeTab, setActiveTab } = useSpellbookStore();
  const [isLoaded, setIsLoaded] = useState(false);

  // Set isLoaded to true after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500); // Small delay for smoother transition

    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    if (!isLoaded) {
      return (
        <div className="loading-wrapper">
          <div className="loading-text">Loading spellbook...</div>
        </div>
      );
    }

    switch (activeTab) {
      case 'wizard':
        return <SpellWizardTab />;
      case 'library':
        return <SpellLibraryTab />;
      case 'collections':
        return <SpellCollectionTab />;
      default:
        return <SpellWizardTab />;
    }
  };

  // Spell Library Tab Component
  const SpellLibraryTab = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [schoolFilter, setSchoolFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    // Filter spells based on search and filters
    const filteredSpells = LIBRARY_SPELLS.filter(spell => {
      // Search filter
      if (searchQuery && !spell.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !spell.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // School filter
      if (schoolFilter !== 'all' && spell.class !== schoolFilter) {
        return false;
      }

      // Type filter
      if (typeFilter !== 'all' && spell.spellType !== typeFilter) {
        return false;
      }

      return true;
    });

    return (
      <div style={{ width: '100%', height: '100%', padding: '20px', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#fff', margin: 0 }}>Spell Library</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <SearchIcon style={{ position: 'absolute', left: '8px', top: '7px', color: '#aaa', fontSize: '12px' }} />
              <input
                type="text"
                placeholder="Search spells..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid #444',
                  borderRadius: '3px',
                  color: '#fff',
                  padding: '5px 10px 5px 28px',
                  fontSize: '12px'
                }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <BookIcon style={{ position: 'absolute', left: '8px', top: '7px', color: '#aaa', fontSize: '12px' }} />
              <select
                value={schoolFilter}
                onChange={(e) => setSchoolFilter(e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid #444',
                  borderRadius: '3px',
                  color: '#fff',
                  padding: '5px 10px 5px 28px',
                  fontSize: '12px'
                }}
              >
                <option value="all">All Spell Types</option>
                <option value="damage">Damage</option>
                <option value="healing">Healing</option>
                <option value="dot">Damage Over Time</option>
                <option value="hot">Healing Over Time</option>
                <option value="buff">Buff</option>
                <option value="debuff">Debuff</option>
                <option value="utility">Utility</option>
                <option value="control">Control</option>
                <option value="summoning">Summoning</option>
                <option value="transformation">Transformation</option>
              </select>
            </div>
            <div style={{ position: 'relative' }}>
              <FilterIcon style={{ position: 'absolute', left: '8px', top: '7px', color: '#aaa', fontSize: '12px' }} />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid #444',
                  borderRadius: '3px',
                  color: '#fff',
                  padding: '5px 10px 5px 28px',
                  fontSize: '12px'
                }}
              >
                <option value="all">All Cast Types</option>
                <option value="action">Action</option>
                <option value="reaction">Reaction</option>
                <option value="passive">Passive</option>
                <option value="channeled">Channeled</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredSpells.length > 0 ? (
            filteredSpells.map(spell => (
              <SpellCard key={spell.id} spell={spell} onClick={() => {}} />
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#aaa' }}>
              <p>No spells match your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Spell Collection Tab Component
  const SpellCollectionTab = () => {
    // Sample collections that would normally come from a context or store
    const sampleCollections = [
      {
        id: 'col1',
        name: 'Arcane Spells',
        description: 'A collection of arcane magic spells',
        color: '#7E57C2',
        spellCount: 5,
        icon: 'inv_misc_book_17',
        spells: []
      },
      {
        id: 'col2',
        name: 'Fire Magic',
        description: 'Destructive fire spells for combat',
        color: '#E53935',
        spellCount: 3,
        icon: 'inv_misc_book_15',
        spells: []
      },
      {
        id: 'col3',
        name: 'Frost Abilities',
        description: 'Spells that slow and freeze enemies',
        color: '#29B6F6',
        spellCount: 4,
        icon: 'inv_misc_book_06',
        spells: []
      },
      {
        id: 'col4',
        name: 'Utility Spells',
        description: 'Helpful spells for various situations',
        color: '#66BB6A',
        spellCount: 7,
        icon: 'inv_misc_book_11',
        spells: []
      }
    ];

    return (
      <div style={{ width: '100%', height: '100%', padding: '20px', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#fff', margin: 0 }}>Spell Collections</h2>
          <button style={{
            background: 'rgba(0,120,215,0.3)',
            border: '1px solid #0078d4',
            borderRadius: '3px',
            color: '#fff',
            padding: '5px 12px',
            fontSize: '12px',
            cursor: 'pointer'
          }}>
            Create Collection
          </button>
        </div>

        <div>
          {sampleCollections.map(collection => (
            <div
              key={collection.id}
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: `1px solid ${collection.color || '#444'}`,
                borderRadius: '5px',
                padding: '15px',
                marginBottom: '15px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <img
                  src={`https://wow.zamimg.com/images/wow/icons/large/${collection.icon}.jpg`}
                  alt={collection.name}
                  style={{ width: '36px', height: '36px', marginRight: '10px', border: '1px solid #666', borderRadius: '3px' }}
                />
                <div>
                  <h3 style={{ color: collection.color || '#fff', margin: '0 0 3px 0', fontSize: '16px' }}>{collection.name}</h3>
                  <div style={{ color: '#aaa', fontSize: '11px' }}>{collection.spellCount} spells</div>
                </div>
              </div>
              <p style={{ color: '#ccc', fontSize: '12px', margin: '0 0 10px 0' }}>{collection.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <WowWindow
      isOpen={isOpen}
      onClose={onClose}
      defaultSize={{ width: 800, height: 600 }}
      title="Spellbook"
    >
      <div className="spellbook-layout" style={{ width: '100%', height: '100%', padding: 0, overflow: 'auto' }}>
        <div className="spellbook-header" style={{
          display: 'flex',
          background: 'rgba(0,0,0,0.5)',
          borderBottom: '1px solid #444',
          padding: '10px 15px'
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setActiveTab('wizard')}
              style={{
                background: activeTab === 'wizard' ? 'rgba(0,0,0,0.3)' : 'transparent',
                border: '1px solid #444',
                borderRadius: '3px',
                color: '#fff',
                padding: '5px 10px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <MagicIcon style={{ marginRight: '5px' }} />
              Spell Wizard
            </button>
            <button
              onClick={() => setActiveTab('library')}
              style={{
                background: activeTab === 'library' ? 'rgba(0,0,0,0.3)' : 'transparent',
                border: '1px solid #444',
                borderRadius: '3px',
                color: '#fff',
                padding: '5px 10px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <BookIcon style={{ marginRight: '5px' }} />
              Spell Library
            </button>
            <button
              onClick={() => setActiveTab('collections')}
              style={{
                background: activeTab === 'collections' ? 'rgba(0,0,0,0.3)' : 'transparent',
                border: '1px solid #444',
                borderRadius: '3px',
                color: '#fff',
                padding: '5px 10px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <FilterIcon style={{ marginRight: '5px' }} />
              Collections
            </button>
          </div>
        </div>

        <div className="spellbook-main-content" style={{ width: '100%', height: 'calc(100% - 45px)', padding: 0, overflow: 'auto' }}>
          {renderContent()}
        </div>
      </div>
    </WowWindow>
  );
};

export default SpellbookWindow;
