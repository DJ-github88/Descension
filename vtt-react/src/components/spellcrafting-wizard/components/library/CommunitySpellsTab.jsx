/**
 * Community Spells Tab - Overhauled & Polished Edition
 * 
 * Features:
 * - Scoped class names (.csp-*) to prevent CSS collisions with global styles
 * - Deduplicated Browse flow (no duplicate cards across Featured & Catalog)
 * - Padded toolbar preventing collision with window close button
 * - Fixed search input padding (no clipping/overlapping icons)
 * - Compact, elegant two-tier filter strip (Role & Magic School)
 * - Rich, highly legible Pathfinder spell cards & compact list rows
 * - Interactive spell detail inspection modal (with full formulas & action economy)
 * - Live In-Library status detection & smooth in-tab toast notifications
 * - 100% emoji-free typography with FontAwesome iconography
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useCommunitySpells } from '../../../../hooks/useCommunitySpells';
import { useSpellLibrary, useSpellLibraryDispatch, libraryActionCreators } from '../../context/SpellLibraryContext';
import useAuthStore from '../../../../store/authStore';
import { getCustomIconUrl } from '../../../../utils/assetManager';
import { mapSpellIcon } from '../common/spellFormatterUtils';
import SpellTooltip from '../common/SpellTooltip';
import SpellContextMenu from './SpellContextMenu';
import UnifiedSpellCard from '../common/UnifiedSpellCard';
import MythrillWindow from '../../../windows/MythrillWindow';
import './CommunitySpellsTab.css';

const CATEGORIES = [
  { id: 'all', name: 'All Roles', icon: 'fa-layer-group' },
  { id: 'damage', name: 'Damage', icon: 'fa-fire' },
  { id: 'healing', name: 'Healing', icon: 'fa-heart' },
  { id: 'control', name: 'Control', icon: 'fa-hand-sparkles' },
  { id: 'utility', name: 'Utility', icon: 'fa-tools' },
  { id: 'summoning', name: 'Summoning', icon: 'fa-paw' }
];

const SCHOOLS = [
  { id: 'all', name: 'All Schools' },
  { id: 'ember', name: 'Ember', icon: 'fa-fire', color: '#e25822' },
  { id: 'rime', name: 'Rime', icon: 'fa-snowflake', color: '#5b9bd5' },
  { id: 'storm', name: 'Storm', icon: 'fa-bolt', color: '#d4af37' },
  { id: 'arcane', name: 'Arcane', icon: 'fa-hat-wizard', color: '#9b59b6' },
  { id: 'primal', name: 'Primal', icon: 'fa-leaf', color: '#27ae60' },
  { id: 'blight', name: 'Blight', icon: 'fa-skull', color: '#6c3483' },
  { id: 'sacred', name: 'Sacred', icon: 'fa-sun', color: '#f1c40f' },
  { id: 'wyrd', name: 'Wyrd', icon: 'fa-eye', color: '#8e44ad' }
];

// Helper to resolve icon URL
const resolveSpellIcon = (spell) => {
  const iconId = spell?.typeConfig?.icon || spell?.icon || spell?.damageConfig?.icon || spell?.healingConfig?.icon || null;
  if (!iconId) {
    return getCustomIconUrl('Utility/Utility', 'abilities');
  }
  if (typeof iconId === 'string' && iconId.startsWith('/assets/')) {
    return iconId;
  }
  if (iconId.includes('/') && !iconId.startsWith('http')) {
    return getCustomIconUrl(iconId, 'abilities');
  }
  if (iconId.startsWith('inv_') || iconId.startsWith('spell_') || iconId.startsWith('ability_')) {
    const mapped = mapSpellIcon(iconId);
    return mapped ? getCustomIconUrl(mapped, 'abilities') : getCustomIconUrl('Utility/Utility', 'abilities');
  }
  return getCustomIconUrl(iconId, 'abilities');
};

// Helper for school classification
const getSchoolInfo = (spell) => {
  const rawSchool = (
    spell?.typeConfig?.school ||
    spell?.school ||
    spell?.damageConfig?.elementType ||
    spell?.elementType ||
    spell?.damageTypes?.[0] ||
    ''
  ).toLowerCase();

  const schoolMap = {
    ember: { className: 'csp-school-ember', label: 'Ember' },
    fire: { className: 'csp-school-ember', label: 'Ember' },
    rime: { className: 'csp-school-rime', label: 'Rime' },
    frost: { className: 'csp-school-rime', label: 'Rime' },
    cold: { className: 'csp-school-rime', label: 'Rime' },
    ice: { className: 'csp-school-rime', label: 'Rime' },
    storm: { className: 'csp-school-storm', label: 'Storm' },
    lightning: { className: 'csp-school-storm', label: 'Storm' },
    thunder: { className: 'csp-school-storm', label: 'Storm' },
    arcane: { className: 'csp-school-arcane', label: 'Arcane' },
    primal: { className: 'csp-school-primal', label: 'Primal' },
    nature: { className: 'csp-school-primal', label: 'Primal' },
    blight: { className: 'csp-school-blight', label: 'Blight' },
    shadow: { className: 'csp-school-blight', label: 'Blight' },
    necrotic: { className: 'csp-school-blight', label: 'Blight' },
    wyrd: { className: 'csp-school-wyrd', label: 'Wyrd' },
    psychic: { className: 'csp-school-wyrd', label: 'Wyrd' },
    chaos: { className: 'csp-school-wyrd', label: 'Wyrd' },
    sacred: { className: 'csp-school-sacred', label: 'Sacred' },
    divine: { className: 'csp-school-sacred', label: 'Sacred' },
    holy: { className: 'csp-school-sacred', label: 'Sacred' }
  };

  return schoolMap[rawSchool] || { className: 'csp-school-arcane', label: rawSchool ? rawSchool.charAt(0).toUpperCase() + rawSchool.slice(1) : 'Spell' };
};

const CommunitySpellsTab = () => {
  const { user } = useAuthStore();
  const library = useSpellLibrary();
  const libraryDispatch = useSpellLibraryDispatch();

  const {
    spells,
    featuredSpells,
    mySpells,
    favoriteSpells,
    loading,
    error,
    searchTerm,
    sortBy,
    hasMore,
    userVotes,
    userFavorites,
    search,
    clearSelection,
    changeSortBy,
    loadMoreSpells,
    downloadCommunitySpell,
    voteCommunitySpell,
    favoriteCommunitySpell,
    loadMySpells,
    loadUserVotes,
    loadUserFavorites,
    loadFavoriteStatuses
  } = useCommunitySpells();

  const [activeSection, setActiveSection] = useState('browse'); // 'browse', 'favorites', 'mySpells'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchInput, setSearchInput] = useState('');
  const [downloadingSpells, setDownloadingSpells] = useState(new Set());
  const [votingSpells, setVotingSpells] = useState(new Set());
  const [favoritingSpells, setFavoritingSpells] = useState(new Set());
  const [contextMenu, setContextMenu] = useState(null);
  const [inspectingSpell, setInspectingSpell] = useState(null);
  const [toast, setToast] = useState(null); // { message, type }

  // Toast notification helper
  const showToast = useCallback((message, type = 'success', duration = 3200) => {
    setToast({ message, type });
    const timer = setTimeout(() => setToast(null), duration);
    return () => clearTimeout(timer);
  }, []);

  // Check if spell exists in local library
  const isInLibrary = useCallback((spell) => {
    if (!library?.spells || !spell) return false;
    return library.spells.some(s =>
      s.originalId === spell.id ||
      s.id === spell.id ||
      (s.name && spell.name && s.name.trim().toLowerCase() === spell.name.trim().toLowerCase())
    );
  }, [library?.spells]);

  // Load user data on mount
  useEffect(() => {
    if (user?.uid) {
      loadMySpells(user.uid);
      loadUserFavorites(user.uid);
    }
  }, [user?.uid, loadMySpells, loadUserFavorites]);

  // Memoize spell IDs key to prevent redundant fetch cycles
  const allSpellIdsKey = useMemo(() => {
    return [...spells, ...featuredSpells, ...mySpells, ...favoriteSpells]
      .map(s => s.id)
      .filter(Boolean)
      .sort()
      .join(',');
  }, [spells, featuredSpells, mySpells, favoriteSpells]);

  // Load vote & favorite statuses for visible spells
  useEffect(() => {
    if (user?.uid && allSpellIdsKey) {
      const allIds = allSpellIdsKey.split(',').filter(Boolean);
      if (allIds.length > 0) {
        loadUserVotes(allIds, user.uid);
        loadFavoriteStatuses(allIds, user.uid);
      }
    }
  }, [user?.uid, allSpellIdsKey, loadUserVotes, loadFavoriteStatuses]);

  // Tooltip state
  const [hoveredSpell, setHoveredSpell] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      search(searchInput.trim());
    }
  };

  const handleMouseEnter = (spell, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.right + 10,
      y: rect.top
    });
    setHoveredSpell(spell);
  };

  const handleMouseMove = (e) => {
    if (hoveredSpell) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.right + 10,
        y: rect.top
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredSpell(null);
  };

  // Download spell to local library
  const handleDownloadSpell = async (spell, e) => {
    if (e) e.stopPropagation();
    try {
      setDownloadingSpells(prev => new Set([...prev, spell.id]));
      
      const downloadedSpell = await downloadCommunitySpell(spell.id);
      
      const localSpell = {
        ...downloadedSpell,
        id: `community-${downloadedSpell.id}-${Date.now()}`,
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        source: 'community',
        originalId: downloadedSpell.id
      };
      
      libraryDispatch(libraryActionCreators.addSpell(localSpell));
      showToast(`Added "${spell.name}" to your spell library!`, 'success');
    } catch (err) {
      showToast(`Failed to download: ${err.message}`, 'error');
    } finally {
      setDownloadingSpells(prev => {
        const next = new Set(prev);
        next.delete(spell.id);
        return next;
      });
    }
  };

  // Add spell to collection
  const handleAddToCollection = async (spellId, collectionId) => {
    let spell = library.spells.find(s => s.id === spellId || s.originalId === spellId);
    
    if (!spell) {
      try {
        setDownloadingSpells(prev => new Set([...prev, spellId]));
        const downloadedSpell = await downloadCommunitySpell(spellId);
        
        const localSpell = {
          ...downloadedSpell,
          id: `community-${downloadedSpell.id}-${Date.now()}`,
          dateCreated: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          source: 'community',
          originalId: downloadedSpell.id
        };
        
        libraryDispatch(libraryActionCreators.addSpell(localSpell));
        spell = localSpell;
      } catch (err) {
        showToast(`Download error: ${err.message}`, 'error');
        return;
      } finally {
        setDownloadingSpells(prev => {
          const next = new Set(prev);
          next.delete(spellId);
          return next;
        });
      }
    }
    
    libraryDispatch(libraryActionCreators.addSpellToCollection(spell.id, collectionId));
    showToast(`Added "${spell.name}" to collection!`, 'success');
  };

  // Context Menu
  const handleSpellContextMenu = (e, spell) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      spellId: spell.id,
      spell: spell
    });
  };

  // Vote handler
  const handleVote = async (spell, voteType, e) => {
    if (e) e.stopPropagation();
    if (!user?.uid) {
      showToast('Please log in to vote on spells.', 'info');
      return;
    }

    try {
      setVotingSpells(prev => new Set([...prev, spell.id]));
      await voteCommunitySpell(spell.id, user.uid, voteType);
      showToast(voteType === 'upvote' ? 'Upvoted spell' : 'Downvoted spell', 'info', 1800);
    } catch (err) {
      showToast(`Vote failed: ${err.message}`, 'error');
    } finally {
      setVotingSpells(prev => {
        const next = new Set(prev);
        next.delete(spell.id);
        return next;
      });
    }
  };

  // Favorite handler
  const handleFavorite = async (spell, isFavorite, e) => {
    if (e) e.stopPropagation();
    if (!user?.uid) {
      showToast('Please log in to save favorites.', 'info');
      return;
    }

    try {
      setFavoritingSpells(prev => new Set([...prev, spell.id]));
      await favoriteCommunitySpell(spell.id, user.uid, isFavorite);
      showToast(isFavorite ? `Saved "${spell.name}" to favorites` : 'Removed from favorites', 'success', 2200);
    } catch (err) {
      showToast(`Favorite failed: ${err.message}`, 'error');
    } finally {
      setFavoritingSpells(prev => {
        const next = new Set(prev);
        next.delete(spell.id);
        return next;
      });
    }
  };

  const getUserVoteForSpell = (spellId) => userVotes[spellId] || null;
  const isSpellFavoritedByUser = (spellId) => userFavorites.has(spellId);

  // Multi-criteria filter function
  const matchSpellFilters = useCallback((spell) => {
    if (!spell) return false;

    // Role / Category filter
    if (selectedCategory !== 'all') {
      const spellCat = (spell.categoryId || spell.spellType || spell.actionType || '').toLowerCase();
      const spellTags = (spell.tags || []).map(t => t.toLowerCase());
      const hasDamage = !!spell.damageConfig || !!spell.damage;
      const hasHealing = !!spell.healingConfig || !!spell.healing;
      const isSummon = spellCat.includes('summon') || spellTags.includes('summon') || spellTags.includes('minion');
      const isControl = spellCat.includes('control') || spellTags.includes('control') || spellTags.includes('stun') || spellTags.includes('slow');
      const isUtility = spellCat.includes('utility') || spellTags.includes('utility') || spellTags.includes('buff');

      if (selectedCategory === 'damage' && !(spellCat === 'damage' || hasDamage || spellTags.includes('damage'))) return false;
      if (selectedCategory === 'healing' && !(spellCat === 'healing' || hasHealing || spellTags.includes('healing'))) return false;
      if (selectedCategory === 'control' && !(spellCat === 'control' || isControl)) return false;
      if (selectedCategory === 'utility' && !(spellCat === 'utility' || isUtility)) return false;
      if (selectedCategory === 'summoning' && !(spellCat === 'summoning' || isSummon)) return false;
    }

    // Magic School filter
    if (selectedSchool !== 'all') {
      const rawSchool = (
        spell.typeConfig?.school ||
        spell.school ||
        spell.damageConfig?.elementType ||
        spell.elementType ||
        spell.damageTypes?.[0] ||
        ''
      ).toLowerCase();

      const schoolAliases = {
        ember: ['ember', 'fire'],
        rime: ['rime', 'frost', 'cold', 'ice'],
        storm: ['storm', 'lightning', 'thunder', 'air', 'wind'],
        arcane: ['arcane', 'force', 'energy'],
        primal: ['primal', 'nature', 'earth', 'water', 'physical', 'smashing'],
        blight: ['blight', 'shadow', 'necrotic', 'poison', 'acid'],
        sacred: ['sacred', 'holy', 'divine', 'radiant', 'light'],
        wyrd: ['wyrd', 'psychic', 'chaos', 'astral', 'time', 'space']
      };

      const allowed = schoolAliases[selectedSchool] || [selectedSchool];
      if (!allowed.some(alias => rawSchool.includes(alias))) {
        return false;
      }
    }

    return true;
  }, [selectedCategory, selectedSchool]);

  // Deduplicate array of spells by ID and normalized name
  const deduplicateList = useCallback((list = []) => {
    const seenIds = new Set();
    const seenNames = new Set();
    return list.filter(spell => {
      if (!spell) return false;
      const id = spell.id || spell._id;
      const name = (spell.name || '').trim().toLowerCase();
      if (id && seenIds.has(id)) return false;
      if (name && seenNames.has(name)) return false;
      if (id) seenIds.add(id);
      if (name) seenNames.add(name);
      return true;
    });
  }, []);

  // Filtered & deduplicated lists
  const filteredFeaturedSpells = useMemo(() => {
    return deduplicateList(featuredSpells.filter(matchSpellFilters));
  }, [featuredSpells, matchSpellFilters, deduplicateList]);

  // Catalog spells: in Browse mode without search, filter out spells already shown in Featured!
  const filteredCatalogSpells = useMemo(() => {
    const allFiltered = deduplicateList(spells.filter(matchSpellFilters));
    if (!searchTerm && filteredFeaturedSpells.length > 0) {
      const featuredIdSet = new Set(filteredFeaturedSpells.map(s => s.id));
      const featuredNameSet = new Set(filteredFeaturedSpells.map(s => (s.name || '').trim().toLowerCase()));
      return allFiltered.filter(s => !featuredIdSet.has(s.id) && !featuredNameSet.has((s.name || '').trim().toLowerCase()));
    }
    return allFiltered;
  }, [spells, matchSpellFilters, deduplicateList, searchTerm, filteredFeaturedSpells]);

  const filteredFavoriteSpells = useMemo(() => {
    return deduplicateList(favoriteSpells.filter(matchSpellFilters));
  }, [favoriteSpells, matchSpellFilters, deduplicateList]);

  const filteredMySpells = useMemo(() => {
    return deduplicateList(mySpells.filter(matchSpellFilters));
  }, [mySpells, matchSpellFilters, deduplicateList]);

  // Active filters count
  const activeFiltersCount = (selectedCategory !== 'all' ? 1 : 0) + (selectedSchool !== 'all' ? 1 : 0) + (searchTerm ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSchool('all');
    setSearchInput('');
    clearSelection();
  };

  // Render Spell Card (Supports Grid Card or Compact Row)
  const renderSpellCard = (spell) => {
    const completeSpell = {
      ...spell,
      downloadCount: spell.downloadCount || 0,
      rating: spell.rating || 0,
      ratingCount: spell.ratingCount || 0,
      source: 'community'
    };

    const iconUrl = resolveSpellIcon(spell);
    const { className: schoolClass, label: schoolLabel } = getSchoolInfo(spell);
    const spellType = (spell.spellType || spell.actionType || 'Action').toUpperCase();
    const tags = spell.tags || [];
    const inLib = isInLibrary(spell);
    const isDownloading = downloadingSpells.has(spell.id);
    const isVoting = votingSpells.has(spell.id);
    const isFavoriting = favoritingSpells.has(spell.id);
    const userVote = getUserVoteForSpell(spell.id);
    const isFav = isSpellFavoritedByUser(spell.id);

    if (viewMode === 'grid') {
      return (
        <div
          key={spell.id}
          className={`csp-card ${schoolClass}`}
          onClick={() => setInspectingSpell(completeSpell)}
          onMouseEnter={(e) => handleMouseEnter(completeSpell, e)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onContextMenu={(e) => handleSpellContextMenu(e, spell)}
        >
          {/* Card Top Banner: School Badge, In-Library Badge, Type Badge */}
          <div className="csp-card-topbar">
            <span className={`csp-school-badge ${schoolClass}`}>
              {schoolLabel}
            </span>
            <div className="csp-card-topbar-badges">
              {inLib && (
                <span className="csp-in-lib-badge" title="Already inscribed in your spellbook">
                  <i className="fas fa-check"></i> In Library
                </span>
              )}
              <span className="csp-type-badge">{spellType}</span>
            </div>
          </div>

          {/* Card Body: Icon + Title + Meta */}
          <div className="csp-card-header">
            <div className="csp-card-icon-frame">
              <img
                src={iconUrl}
                alt={spell.name}
                className="csp-card-icon"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                }}
              />
            </div>
            <div className="csp-card-header-info">
              <h4 className="csp-card-title" title={spell.name}>{spell.name}</h4>
              <div className="csp-card-meta">
                {spell.level !== undefined && <span>Level {spell.level}</span>}
                {spell.castingTime && <span>{spell.castingTime}</span>}
                {spell.range && <span>{spell.range}</span>}
              </div>
            </div>
          </div>

          {/* Description */}
          {spell.description && (
            <p className="csp-card-description">{spell.description}</p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="csp-card-tags">
              {tags.slice(0, 4).map((tag, i) => (
                <span key={i} className="csp-card-tag">{tag}</span>
              ))}
              {tags.length > 4 && <span className="csp-card-tag-more">+{tags.length - 4}</span>}
            </div>
          )}

          {/* Card Footer: Rating, Votes, Download */}
          <div className="csp-card-footer" onClick={(e) => e.stopPropagation()}>
            <div className="csp-card-stats">
              <span className="csp-stat-rating" title={`Rating: ${spell.rating?.toFixed(1) || '0.0'} (${spell.ratingCount || 0} votes)`}>
                <i className="fas fa-star"></i> {spell.rating?.toFixed(1) || '0.0'}
              </span>
              <span className="csp-stat-downloads" title={`${spell.downloadCount || 0} downloads`}>
                <i className="fas fa-download"></i> {spell.downloadCount || 0}
              </span>
            </div>

            <div className="csp-card-actions">
              {user?.uid && (
                <div className="csp-vote-group">
                  <button
                    className={`csp-icon-btn upvote ${userVote === 1 ? 'active' : ''}`}
                    onClick={(e) => handleVote(spell, 'upvote', e)}
                    disabled={isVoting}
                    title="Upvote"
                  >
                    <i className="fas fa-thumbs-up"></i>
                  </button>
                  <button
                    className={`csp-icon-btn downvote ${userVote === -1 ? 'active' : ''}`}
                    onClick={(e) => handleVote(spell, 'downvote', e)}
                    disabled={isVoting}
                    title="Downvote"
                  >
                    <i className="fas fa-thumbs-down"></i>
                  </button>
                </div>
              )}

              {user?.uid && (
                <button
                  className={`csp-icon-btn favorite ${isFav ? 'active' : ''}`}
                  onClick={(e) => handleFavorite(spell, !isFav, e)}
                  disabled={isFavoriting}
                  title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <i className={isFav ? 'fas fa-star' : 'far fa-star'}></i>
                </button>
              )}

              <button
                className={`csp-download-btn ${inLib ? 'in-library' : ''}`}
                onClick={(e) => handleDownloadSpell(spell, e)}
                disabled={isDownloading}
                title={inLib ? 'Click to re-download latest copy' : 'Download to local spell library'}
              >
                {isDownloading ? (
                  <><i className="fas fa-spinner fa-spin"></i> Downloading</>
                ) : inLib ? (
                  <><i className="fas fa-check"></i> In Library</>
                ) : (
                  <><i className="fas fa-download"></i> Download</>
                )}
              </button>
            </div>
          </div>
        </div>
      );
    }

    // List Row View
    return (
      <div
        key={spell.id}
        className={`csp-row ${schoolClass}`}
        onClick={() => setInspectingSpell(completeSpell)}
        onMouseEnter={(e) => handleMouseEnter(completeSpell, e)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onContextMenu={(e) => handleSpellContextMenu(e, spell)}
      >
        <div className="csp-row-main">
          <div className="csp-row-icon-frame">
            <img
              src={iconUrl}
              alt={spell.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
              }}
            />
          </div>
          <div className="csp-row-details">
            <div className="csp-row-title-line">
              <span className="csp-row-title">{spell.name}</span>
              <span className={`csp-school-badge small ${schoolClass}`}>{schoolLabel}</span>
              <span className="csp-type-badge small">{spellType}</span>
              {inLib && (
                <span className="csp-in-lib-badge small" title="In Library">
                  <i className="fas fa-check"></i>
                </span>
              )}
            </div>
            <div className="csp-row-meta">
              {spell.level !== undefined && <span>Level {spell.level}</span>}
              {spell.castingTime && <span>{spell.castingTime}</span>}
              {spell.range && <span>{spell.range}</span>}
            </div>
            {spell.description && (
              <p className="csp-row-desc">{spell.description}</p>
            )}
          </div>
        </div>

        <div className="csp-row-controls" onClick={(e) => e.stopPropagation()}>
          <div className="csp-row-stats">
            <span className="csp-stat-rating">
              <i className="fas fa-star"></i> {spell.rating?.toFixed(1) || '0.0'}
            </span>
            <span className="csp-stat-downloads">
              <i className="fas fa-download"></i> {spell.downloadCount || 0}
            </span>
          </div>

          {user?.uid && (
            <div className="csp-row-user-actions">
              <button
                className={`csp-icon-btn upvote ${userVote === 1 ? 'active' : ''}`}
                onClick={(e) => handleVote(spell, 'upvote', e)}
                disabled={isVoting}
                title="Upvote"
              >
                <i className="fas fa-thumbs-up"></i>
              </button>
              <button
                className={`csp-icon-btn downvote ${userVote === -1 ? 'active' : ''}`}
                onClick={(e) => handleVote(spell, 'downvote', e)}
                disabled={isVoting}
                title="Downvote"
              >
                <i className="fas fa-thumbs-down"></i>
              </button>
              <button
                className={`csp-icon-btn favorite ${isFav ? 'active' : ''}`}
                onClick={(e) => handleFavorite(spell, !isFav, e)}
                disabled={isFavoriting}
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <i className={isFav ? 'fas fa-star' : 'far fa-star'}></i>
              </button>
            </div>
          )}

          <button
            className={`csp-download-btn ${inLib ? 'in-library' : ''}`}
            onClick={(e) => handleDownloadSpell(spell, e)}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <><i className="fas fa-spinner fa-spin"></i> ...</>
            ) : inLib ? (
              <><i className="fas fa-check"></i> In Library</>
            ) : (
              <><i className="fas fa-download"></i> Download</>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="community-spells-tab csp-root">
      {/* Toast Notification Banner */}
      {toast && (
        <div className={`csp-toast ${toast.type}`}>
          <i className={toast.type === 'success' ? 'fas fa-check-circle' : toast.type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-info-circle'}></i>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Grimoire Toolbar (With right padding to avoid window close button) */}
      <div className="csp-toolbar">
        {/* Left: View Tabs */}
        <div className="csp-toolbar-nav">
          <button
            type="button"
            className={`csp-nav-tab ${activeSection === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveSection('browse')}
          >
            <i className="fas fa-compass"></i>
            <span>Browse</span>
            <span className="csp-nav-badge">{spells.length}</span>
          </button>
          <button
            type="button"
            className={`csp-nav-tab ${activeSection === 'favorites' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('favorites');
              if (user?.uid) loadUserFavorites(user.uid);
            }}
          >
            <i className="fas fa-star"></i>
            <span>Favorites</span>
            {user?.uid && <span className="csp-nav-badge">{favoriteSpells.length}</span>}
          </button>
          <button
            type="button"
            className={`csp-nav-tab ${activeSection === 'mySpells' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('mySpells');
              if (user?.uid) loadMySpells(user.uid);
            }}
          >
            <i className="fas fa-scroll"></i>
            <span>My Spells</span>
            {user?.uid && <span className="csp-nav-badge">{mySpells.length}</span>}
          </button>
        </div>

        {/* Center: Search Bar (Unified single container) */}
        <form onSubmit={handleSearch} className="csp-search-bar">
          <i className="fas fa-search csp-search-icon"></i>
          <input
            type="text"
            placeholder="Search spells by name, tag, damage..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="csp-search-input"
          />
          {searchInput && (
            <button
              type="button"
              className="csp-search-clear"
              onClick={() => { setSearchInput(''); search(''); }}
              title="Clear search"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </form>

        {/* Right: Sort & View Toggle Controls */}
        <div className="csp-toolbar-controls">
          <div className="csp-sort-box">
            <span className="csp-control-label">SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => changeSortBy(e.target.value)}
              className="csp-sort-select"
              disabled={!!searchTerm}
            >
              <option value="rating">Highest Rated</option>
              <option value="downloads">Most Downloads</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          <div className="csp-view-toggle">
            <button
              type="button"
              className={`csp-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <i className="fas fa-th-large"></i>
            </button>
            <button
              type="button"
              className={`csp-view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <i className="fas fa-list"></i>
            </button>
          </div>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="csp-reset-btn"
              title="Reset all filters"
            >
              <i className="fas fa-times-circle"></i> Clear ({activeFiltersCount})
            </button>
          )}
        </div>
      </div>

      {/* Two-Tier Filter Strip (Role + School) */}
      <div className="csp-filter-bar">
        {/* Role Row */}
        <div className="csp-filter-row">
          <span className="csp-filter-heading">ROLE:</span>
          <div className="csp-chips-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`csp-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* School Row */}
        <div className="csp-filter-row">
          <span className="csp-filter-heading">SCHOOL:</span>
          <div className="csp-chips-wrap">
            {SCHOOLS.map(sch => (
              <button
                key={sch.id}
                type="button"
                className={`csp-chip csp-chip-school ${sch.id !== 'all' ? `school-${sch.id}` : ''} ${selectedSchool === sch.id ? 'active' : ''}`}
                onClick={() => setSelectedSchool(sch.id)}
              >
                {sch.id !== 'all' && (
                  <span
                    className="csp-school-dot"
                    style={{
                      backgroundColor:
                        sch.id === 'ember' ? '#e25822' :
                        sch.id === 'rime' ? '#4a90e2' :
                        sch.id === 'storm' ? '#f5a623' :
                        sch.id === 'arcane' ? '#9b59b6' :
                        sch.id === 'primal' ? '#27ae60' :
                        sch.id === 'blight' ? '#8e44ad' :
                        sch.id === 'sacred' ? '#e6b800' : '#9b59b6'
                    }}
                  />
                )}
                <span>{sch.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="csp-content-scroll">
        {/* Error State */}
        {error && (
          <div className="csp-state-box error">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Database Connection Error</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="csp-action-btn">
              <i className="fas fa-redo"></i> Reconnect
            </button>
          </div>
        )}

        {/* Browse Section */}
        {activeSection === 'browse' && (
          <div className="csp-browse-flow">
            {/* If searching or filtering, display single unified results section */}
            {(searchTerm || selectedCategory !== 'all' || selectedSchool !== 'all') ? (
              <div className="csp-section">
                <div className="csp-section-header">
                  <div className="csp-section-title-wrap">
                    <i className="fas fa-search"></i>
                    <h3 className="csp-section-title">
                      {searchTerm ? `Search Results for "${searchTerm}"` : 'Filtered Community Spells'}
                    </h3>
                    <span className="csp-section-badge">{filteredCatalogSpells.length} spells</span>
                  </div>
                  <button onClick={clearAllFilters} className="csp-text-btn">
                    <i className="fas fa-times"></i> Clear Filters
                  </button>
                </div>

                {loading && filteredCatalogSpells.length === 0 ? (
                  <div className="csp-state-box loading">
                    <div className="csp-arcane-spinner"></div>
                    <p>Inscribing community spells from the archives...</p>
                  </div>
                ) : filteredCatalogSpells.length === 0 ? (
                  <div className="csp-state-box empty">
                    <i className="fas fa-scroll"></i>
                    <h4>No Matching Spells</h4>
                    <p>No community spells match your active filter and search terms.</p>
                    <button onClick={clearAllFilters} className="csp-action-btn">
                      <i className="fas fa-times"></i> Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className={viewMode === 'grid' ? 'csp-grid' : 'csp-list'}>
                    {filteredCatalogSpells
                      .sort((a, b) => {
                        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
                        if (sortBy === 'downloads') return (b.downloadCount || 0) - (a.downloadCount || 0);
                        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                      })
                      .map(renderSpellCard)}
                  </div>
                )}
              </div>
            ) : (
              /* Default Browse flow: Featured Spells followed by non-duplicate Catalog Spells */
              <>
                {filteredFeaturedSpells.length > 0 && (
                  <div className="csp-section featured">
                    <div className="csp-section-header">
                      <div className="csp-section-title-wrap">
                        <i className="fas fa-star gold-glow"></i>
                        <h3 className="csp-section-title">Featured Curations</h3>
                        <span className="csp-section-badge">{filteredFeaturedSpells.length} spells</span>
                      </div>
                      <span className="csp-section-note">Curated high-tier community creations</span>
                    </div>

                    <div className={viewMode === 'grid' ? 'csp-grid' : 'csp-list'}>
                      {filteredFeaturedSpells
                        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                        .map(renderSpellCard)}
                    </div>
                  </div>
                )}

                <div className="csp-section catalog">
                  <div className="csp-section-header">
                    <div className="csp-section-title-wrap">
                      <i className="fas fa-book-open"></i>
                      <h3 className="csp-section-title">Guild Spell Archives</h3>
                      <span className="csp-section-badge">{filteredCatalogSpells.length} spells</span>
                    </div>
                  </div>

                  {loading && filteredCatalogSpells.length === 0 ? (
                    <div className="csp-state-box loading">
                      <div className="csp-arcane-spinner"></div>
                      <p>Loading community spells...</p>
                    </div>
                  ) : filteredCatalogSpells.length === 0 ? (
                    <div className="csp-state-box empty">
                      <i className="fas fa-feather-alt"></i>
                      <h4>Archive Catalog Empty</h4>
                      <p>All current featured spells are shown above. Create and share your custom spells to expand the archives!</p>
                    </div>
                  ) : (
                    <>
                      <div className={viewMode === 'grid' ? 'csp-grid' : 'csp-list'}>
                        {filteredCatalogSpells
                          .sort((a, b) => {
                            if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
                            if (sortBy === 'downloads') return (b.downloadCount || 0) - (a.downloadCount || 0);
                            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                          })
                          .map(renderSpellCard)}
                      </div>

                      {hasMore && (
                        <div className="csp-load-more-box">
                          <button
                            type="button"
                            onClick={loadMoreSpells}
                            disabled={loading}
                            className="csp-load-more-btn"
                          >
                            {loading ? (
                              <><i className="fas fa-spinner fa-spin"></i> Loading more spells...</>
                            ) : (
                              <><i className="fas fa-chevron-down"></i> Load More Archives</>
                            )}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Favorites Section */}
        {activeSection === 'favorites' && (
          !user?.uid ? (
            <div className="csp-state-box auth">
              <i className="fas fa-star gold-glow"></i>
              <h3>Sign In Required</h3>
              <p>Sign in to your account to save your favorite community spells and access them across sessions.</p>
            </div>
          ) : (
            <div className="csp-section">
              <div className="csp-section-header">
                <div className="csp-section-title-wrap">
                  <i className="fas fa-star gold-glow"></i>
                  <h3 className="csp-section-title">My Bookmarked Favorites</h3>
                  <span className="csp-section-badge">{filteredFavoriteSpells.length} spells</span>
                </div>
              </div>

              {loading && filteredFavoriteSpells.length === 0 ? (
                <div className="csp-state-box loading">
                  <div className="csp-arcane-spinner"></div>
                  <p>Retrieving your favorite spells...</p>
                </div>
              ) : filteredFavoriteSpells.length === 0 ? (
                <div className="csp-state-box empty">
                  <i className="far fa-star"></i>
                  <h4>No Favorites Saved</h4>
                  <p>Click the star icon on any community spell to save it here for quick access.</p>
                  <button onClick={() => setActiveSection('browse')} className="csp-action-btn">
                    <i className="fas fa-compass"></i> Browse Spells
                  </button>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'csp-grid' : 'csp-list'}>
                  {filteredFavoriteSpells
                    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                    .map(renderSpellCard)}
                </div>
              )}
            </div>
          )
        )}

        {/* My Spells Section */}
        {activeSection === 'mySpells' && (
          !user?.uid ? (
            <div className="csp-state-box auth">
              <i className="fas fa-quill-pen"></i>
              <h3>Sign In Required</h3>
              <p>Sign in to publish and manage spells you have shared with the community.</p>
            </div>
          ) : (
            <div className="csp-section">
              <div className="csp-section-header">
                <div className="csp-section-title-wrap">
                  <i className="fas fa-scroll"></i>
                  <h3 className="csp-section-title">My Published Spells</h3>
                  <span className="csp-section-badge">{filteredMySpells.length} published</span>
                </div>
              </div>

              {loading && filteredMySpells.length === 0 ? (
                <div className="csp-state-box loading">
                  <div className="csp-arcane-spinner"></div>
                  <p>Loading your published spells...</p>
                </div>
              ) : filteredMySpells.length === 0 ? (
                <div className="csp-state-box empty">
                  <i className="fas fa-feather-alt"></i>
                  <h4>No Spells Published</h4>
                  <p>To publish a spell, right-click any custom spell in your Spell Library and select "Share with Community".</p>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'csp-grid' : 'csp-list'}>
                  {filteredMySpells
                    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                    .map(renderSpellCard)}
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* Spell Details Inspection Modal */}
      {inspectingSpell && (
        <MythrillWindow
          isOpen={true}
          onClose={() => setInspectingSpell(null)}
          title={`Spell Details: ${inspectingSpell.name}`}
          modal={true}
          centered={true}
          defaultSize={{ width: 540, height: 700 }}
        >
          <div className="csp-inspect-modal">
            <div className="csp-inspect-card-wrap">
              <UnifiedSpellCard
                spell={inspectingSpell}
                variant="wizard"
                showActions={false}
                showDescription={true}
                showStats={true}
                showTags={true}
              />
            </div>
            <div className="csp-inspect-footer">
              <button
                type="button"
                className="csp-modal-close-btn"
                onClick={() => setInspectingSpell(null)}
              >
                Close
              </button>
              <button
                type="button"
                className={`csp-modal-download-btn ${isInLibrary(inspectingSpell) ? 'in-library' : ''}`}
                onClick={() => handleDownloadSpell(inspectingSpell)}
                disabled={downloadingSpells.has(inspectingSpell.id)}
              >
                {downloadingSpells.has(inspectingSpell.id) ? (
                  <><i className="fas fa-spinner fa-spin"></i> Downloading...</>
                ) : isInLibrary(inspectingSpell) ? (
                  <><i className="fas fa-check"></i> In Library (Re-download)</>
                ) : (
                  <><i className="fas fa-download"></i> Download to Spellbook</>
                )}
              </button>
            </div>
          </div>
        </MythrillWindow>
      )}

      {/* Hover Tooltip Portal */}
      {hoveredSpell && !inspectingSpell && ReactDOM.createPortal(
        <SpellTooltip
          spell={hoveredSpell}
          position={tooltipPosition}
          onMouseEnter={() => setHoveredSpell(hoveredSpell)}
          onMouseLeave={() => setHoveredSpell(null)}
        />,
        document.body
      )}

      {/* Context Menu Portal */}
      {contextMenu && ReactDOM.createPortal(
        <SpellContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          spell={contextMenu.spell || { id: contextMenu.spellId, name: 'Unknown Spell' }}
          onClose={() => setContextMenu(null)}
          collections={library.categories || []}
          inCollection={false}
          isCustomSpell={false}
          onAddToCollection={(spellId, collectionId) => {
            handleAddToCollection(contextMenu.spellId, collectionId);
            setContextMenu(null);
          }}
          onDownload={contextMenu.spell ? () => {
            handleDownloadSpell(contextMenu.spell);
            setContextMenu(null);
          } : null}
        />,
        document.body
      )}
    </div>
  );
};

export default CommunitySpellsTab;
