import React, { useState, useMemo } from 'react';
import useQuestStore from '../../store/questStore';
import useNpcStore from '../../store/npcStore';
import useFactionStore from '../../store/factionStore';
import useWorldStore from '../../store/worldStore';
import useCreatureStore from '../../store/creatureStore';
import useItemStore from '../../store/itemStore';
import useShareableStore from '../../store/shareableStore';
import { COMPREHENSIVE_ITEMS } from '../../data/items/index.js';
import BESTIARY_DATA from '../../data/creatureData.json';
import './CampaignCodexSidebar.css';

const ALL_BESTIARY_CREATURES = (BESTIARY_DATA?.regions || []).flatMap(r =>
  (r.creatures || []).map(c => ({
    ...c,
    regionName: r.name,
    category: 'Bestiary'
  }))
);

const CampaignCodexSidebar = ({
  currentMapId = 'map-mythril-world',
  pins = [],
  onClose,
  onStartPlacing,
  onFocusPin
}) => {
  const [activeTab, setActiveTab] = useState('npcs'); // 'quests' | 'npcs' | 'creatures' | 'factions' | 'items' | 'journal'
  const [filterQuery, setFilterQuery] = useState('');
  const [factionSubTab, setFactionSubTab] = useState('factions'); // 'factions' | 'locations'

  // Stores
  const quests = useQuestStore(state => state.quests) || [];
  const npcs = useNpcStore(state => state.npcs) || [];
  const factions = useFactionStore(state => state.factions) || [];
  const regions = useWorldStore(state => state.regions) || [];
  const getLocationsByRegion = useWorldStore(state => state.getLocationsByRegion);
  const customCreatures = useCreatureStore(state => state.customCreatures) || [];
  const storeItems = useItemStore(state => state.items) || [];
  const playerNotes = useShareableStore(state => state.playerNotes) || [];
  const playerKnowledge = useShareableStore(state => state.playerKnowledge) || [];

  // Combined Items
  const allGameItems = useMemo(() => {
    const combined = [...storeItems, ...(COMPREHENSIVE_ITEMS || [])];
    const seen = new Set();
    return combined.filter(i => {
      if (!i.id && !i.name) return false;
      const key = i.id || i.name;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [storeItems]);

  // Combined Creatures
  const allCreatures = useMemo(() => {
    const combined = [...customCreatures, ...ALL_BESTIARY_CREATURES];
    const seen = new Set();
    return combined.filter(c => {
      if (!c.id) return true;
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
  }, [customCreatures]);

  // Combined Locations
  const allWorldLocations = useMemo(() => {
    if (!regions) return [];
    return regions.flatMap(r => (getLocationsByRegion ? getLocationsByRegion(r.id) : []));
  }, [regions, getLocationsByRegion]);

  // Combined Journal
  const allJournalNotes = useMemo(() => {
    const notes = (playerNotes || []).map(n => ({ ...n, sourceType: 'note' }));
    const know = (playerKnowledge || []).map(k => ({ ...k, sourceType: 'knowledge' }));
    return [...notes, ...know];
  }, [playerNotes, playerKnowledge]);

  const qLower = filterQuery.toLowerCase().trim();

  // Filtered lists
  const filteredQuests = useMemo(() => {
    if (!qLower) return quests;
    return quests.filter(q =>
      q.title?.toLowerCase().includes(qLower) ||
      q.description?.toLowerCase().includes(qLower) ||
      q.location?.toLowerCase().includes(qLower)
    );
  }, [quests, qLower]);

  const filteredNpcs = useMemo(() => {
    if (!qLower) return npcs;
    return npcs.filter(n =>
      n.name?.toLowerCase().includes(qLower) ||
      n.title?.toLowerCase().includes(qLower) ||
      n.race?.toLowerCase().includes(qLower) ||
      n.appearance?.toLowerCase().includes(qLower)
    );
  }, [npcs, qLower]);

  const filteredCreatures = useMemo(() => {
    if (!qLower) return allCreatures;
    return allCreatures.filter(c =>
      c.name?.toLowerCase().includes(qLower) ||
      c.type?.toLowerCase().includes(qLower) ||
      c.regionName?.toLowerCase().includes(qLower) ||
      c.description?.toLowerCase().includes(qLower)
    );
  }, [allCreatures, qLower]);

  const filteredFactions = useMemo(() => {
    if (!qLower) return factions;
    return factions.filter(f =>
      f.name?.toLowerCase().includes(qLower) ||
      f.type?.toLowerCase().includes(qLower) ||
      f.publicGoal?.toLowerCase().includes(qLower)
    );
  }, [factions, qLower]);

  const filteredLocations = useMemo(() => {
    if (!qLower) return allWorldLocations;
    return allWorldLocations.filter(loc =>
      loc.name?.toLowerCase().includes(qLower) ||
      loc.type?.toLowerCase().includes(qLower) ||
      loc.description?.toLowerCase().includes(qLower)
    );
  }, [allWorldLocations, qLower]);

  const filteredItems = useMemo(() => {
    if (!qLower) return allGameItems.slice(0, 100);
    return allGameItems.filter(i =>
      i.name?.toLowerCase().includes(qLower) ||
      i.type?.toLowerCase().includes(qLower) ||
      i.rarity?.toLowerCase().includes(qLower) ||
      i.description?.toLowerCase().includes(qLower)
    ).slice(0, 100);
  }, [allGameItems, qLower]);

  const filteredJournal = useMemo(() => {
    if (!qLower) return allJournalNotes;
    return allJournalNotes.filter(j =>
      j.title?.toLowerCase().includes(qLower) ||
      j.content?.toLowerCase().includes(qLower)
    );
  }, [allJournalNotes, qLower]);

  // Place Handlers
  const handlePlaceQuest = (q) => {
    onStartPlacing?.({
      category: 'Quest',
      type: 'poi',
      title: q.title,
      description: q.description || '',
      icon: 'fa-scroll',
      color: '#d4af37',
      layerId: 'poi',
      linkedEntities: {
        npcIds: [],
        creatureIds: [],
        factionIds: [],
        questIds: [q.id],
        itemIds: [],
        locationId: null,
        journalNotes: ''
      }
    });
  };

  const handlePlaceNpc = (npc) => {
    onStartPlacing?.({
      category: 'NPC',
      type: 'poi',
      title: npc.name,
      description: `${npc.title ? `**Title:** ${npc.title}\n\n` : ''}${npc.appearance ? `**Appearance:** ${npc.appearance}\n\n` : ''}${npc.personality ? `**Personality:** ${npc.personality}` : ''}`,
      icon: 'fa-user',
      color: '#3498db',
      layerId: 'poi',
      linkedEntities: {
        npcIds: [npc.id],
        creatureIds: [],
        factionIds: npc.factionIds || [],
        questIds: [],
        itemIds: [],
        locationId: npc.locationIds?.[0] || null,
        journalNotes: ''
      }
    });
  };

  const handlePlaceCreature = (c) => {
    onStartPlacing?.({
      category: 'Creature',
      type: 'poi',
      title: c.name,
      description: `${c.cr !== undefined ? `**CR:** ${c.cr} | **Type:** ${c.type || 'Monster'}\n\n` : ''}${c.description || c.lore || ''}`,
      icon: 'fa-skull-crossbones',
      color: '#c0392b',
      layerId: 'poi',
      linkedEntities: {
        npcIds: [],
        creatureIds: [c.id || c.name],
        factionIds: [],
        questIds: [],
        itemIds: [],
        locationId: null,
        journalNotes: ''
      }
    });
  };

  const handlePlaceFaction = (f) => {
    onStartPlacing?.({
      category: 'Faction',
      type: 'city',
      title: f.name,
      description: f.publicDescription || f.publicGoal || '',
      icon: 'fa-shield-halved',
      color: f.colors?.primary || '#8b5a1a',
      layerId: 'political',
      linkedEntities: {
        npcIds: (f.members || []).map(m => m.npcId).filter(Boolean),
        creatureIds: [],
        factionIds: [f.id],
        questIds: [],
        itemIds: [],
        locationId: f.headquarters || null,
        journalNotes: ''
      }
    });
  };

  const handlePlaceLocation = (loc) => {
    onStartPlacing?.({
      category: 'World Location',
      type: loc.type === 'city' ? 'city' : loc.type === 'dungeon' ? 'dungeon' : 'poi',
      title: loc.name,
      description: loc.description || loc.loreOverview || '',
      icon: loc.icon || 'fa-location-dot',
      color: '#27ae60',
      layerId: 'terrain',
      linkedEntities: {
        npcIds: [],
        creatureIds: [],
        factionIds: loc.primaryFactions || [],
        questIds: [],
        itemIds: [],
        locationId: loc.id,
        journalNotes: ''
      }
    });
  };

  const handlePlaceItem = (item) => {
    onStartPlacing?.({
      category: 'Item',
      type: 'poi',
      title: item.name,
      description: `${item.rarity ? `**Rarity:** ${item.rarity} | **Type:** ${item.type || 'Item'}\n\n` : ''}${item.description || item.lore || ''}`,
      icon: 'fa-gem',
      color: '#e67e22',
      layerId: 'poi',
      linkedEntities: {
        npcIds: [],
        creatureIds: [],
        factionIds: [],
        questIds: [],
        itemIds: [item.id],
        locationId: null,
        journalNotes: ''
      }
    });
  };

  const handlePlaceNote = (note) => {
    onStartPlacing?.({
      category: 'Journal Note',
      type: 'poi',
      title: note.title || 'Field Journal Entry',
      description: note.content || '',
      icon: 'fa-feather-pointed',
      color: '#8e44ad',
      layerId: 'poi',
      linkedEntities: {
        npcIds: [],
        creatureIds: [],
        factionIds: [],
        questIds: [],
        itemIds: [],
        locationId: null,
        journalNotes: note.content || ''
      }
    });
  };

  return (
    <aside className="campaign-codex-drawer" onClick={e => e.stopPropagation()}>
      {/* Header */}
      <div className="codex-drawer-header">
        <div className="codex-title-wrap">
          <i className="fas fa-book-atlas codex-title-icon" />
          <h3 className="codex-title-text">Campaign &amp; Journal Codex</h3>
        </div>
        <button className="btn-codex-close" onClick={onClose} title="Close Codex">
          <i className="fas fa-times" />
        </button>
      </div>

      {/* Tabs */}
      <div className="codex-tab-nav">
        <button
          type="button"
          className={`codex-tab-btn ${activeTab === 'quests' ? 'active' : ''}`}
          onClick={() => setActiveTab('quests')}
        >
          <i className="fas fa-scroll" />
          <span>Quests</span>
          <span className="codex-tab-pill">{quests.length}</span>
        </button>

        <button
          type="button"
          className={`codex-tab-btn ${activeTab === 'npcs' ? 'active' : ''}`}
          onClick={() => setActiveTab('npcs')}
        >
          <i className="fas fa-users" />
          <span>NPCs</span>
          <span className="codex-tab-pill">{npcs.length}</span>
        </button>

        <button
          type="button"
          className={`codex-tab-btn ${activeTab === 'creatures' ? 'active' : ''}`}
          onClick={() => setActiveTab('creatures')}
        >
          <i className="fas fa-skull-crossbones" />
          <span>Bestiary</span>
          <span className="codex-tab-pill">{allCreatures.length}</span>
        </button>

        <button
          type="button"
          className={`codex-tab-btn ${activeTab === 'factions' ? 'active' : ''}`}
          onClick={() => setActiveTab('factions')}
        >
          <i className="fas fa-shield-halved" />
          <span>Factions</span>
          <span className="codex-tab-pill">{factions.length}</span>
        </button>

        <button
          type="button"
          className={`codex-tab-btn ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          <i className="fas fa-gem" />
          <span>Items</span>
          <span className="codex-tab-pill">{storeItems.length}</span>
        </button>

        <button
          type="button"
          className={`codex-tab-btn ${activeTab === 'journal' ? 'active' : ''}`}
          onClick={() => setActiveTab('journal')}
        >
          <i className="fas fa-feather-pointed" />
          <span>Journal</span>
          <span className="codex-tab-pill">{allJournalNotes.length}</span>
        </button>
      </div>

      {/* Search Input Bar (Internal Magnifying Glass) */}
      <div className="codex-search-container">
        <div className="codex-search-input-wrapper">
          <i className="fas fa-search codex-search-icon" />
          <input
            type="text"
            className="codex-search-input"
            placeholder={`Filter ${activeTab}…`}
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
          />
          {filterQuery && (
            <button className="btn-codex-clear-search" onClick={() => setFilterQuery('')} title="Clear filter">
              <i className="fas fa-times" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="codex-sidebar-content">
        {/* Tab: Quests */}
        {activeTab === 'quests' && (
          filteredQuests.length === 0 ? (
            <div className="codex-empty-tab">
              <i className="fas fa-scroll" />
              <span>No quests found.</span>
            </div>
          ) : (
            filteredQuests.map(q => {
              const placedPin = pins.find(p => (p.mapId || 'map-mythril-world') === currentMapId && p.linkedEntities?.questIds?.includes(q.id));
              return (
                <div key={q.id} className="codex-item-card">
                  <div className="codex-card-head">
                    <div className="codex-avatar-badge badge-quest">
                      <i className="fas fa-scroll" />
                    </div>
                    <div className="codex-head-info">
                      <h4 className="codex-card-title">{q.title}</h4>
                      {q.location && <span className="codex-card-subtitle"><i className="fas fa-compass" /> {q.location}</span>}
                    </div>
                    <span className={`codex-status-pill ${q.status === 'completed' ? 'codex-status-completed' : 'codex-status-active'}`}>
                      {q.status || 'Active'}
                    </span>
                  </div>

                  <div className="codex-meta-row">
                    {q.difficulty && <span className="codex-meta-chip"><i className="fas fa-gauge-high" /> {q.difficulty}</span>}
                    {q.level && <span className="codex-meta-chip"><i className="fas fa-shield" /> Lvl {q.level}</span>}
                  </div>

                  {q.description && <p className="codex-excerpt">{q.description}</p>}

                  <div className="codex-card-actions">
                    {placedPin ? (
                      <>
                        <span className="codex-placed-indicator"><i className="fas fa-check-circle" /> On Map</span>
                        <button type="button" className="btn-codex-view" onClick={() => onFocusPin?.(placedPin.id)}>
                          <i className="fas fa-crosshairs" /> View
                        </button>
                      </>
                    ) : (
                      <button type="button" className="btn-codex-place" onClick={() => handlePlaceQuest(q)}>
                        <i className="fas fa-map-pin" /> Place on Map
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )
        )}

        {/* Tab: NPCs */}
        {activeTab === 'npcs' && (
          filteredNpcs.length === 0 ? (
            <div className="codex-empty-tab">
              <i className="fas fa-users" />
              <span>No NPCs match your search.</span>
            </div>
          ) : (
            filteredNpcs.map(npc => {
              const placedPin = pins.find(p => (p.mapId || 'map-mythril-world') === currentMapId && p.linkedEntities?.npcIds?.includes(npc.id));
              const factionNames = (npc.factionIds || []).map(fId => (factions || []).find(f => f.id === fId)?.name).filter(Boolean);
              return (
                <div key={npc.id} className="codex-item-card">
                  <div className="codex-card-head">
                    <div className="codex-avatar-badge badge-npc">
                      <i className="fas fa-user-circle" />
                    </div>
                    <div className="codex-head-info">
                      <h4 className="codex-card-title">{npc.name}</h4>
                      {npc.title && <span className="codex-card-subtitle">{npc.title}</span>}
                    </div>
                    <span className="codex-status-pill codex-status-active">{npc.status || 'Active'}</span>
                  </div>

                  <div className="codex-meta-row">
                    {npc.race && <span className="codex-meta-chip"><strong>Lineage:</strong> {npc.race}</span>}
                    {factionNames.length > 0 && <span className="codex-meta-chip"><strong>Faction:</strong> {factionNames.join(', ')}</span>}
                  </div>

                  {npc.appearance && <p className="codex-excerpt">{npc.appearance}</p>}

                  <div className="codex-card-actions">
                    {placedPin ? (
                      <>
                        <span className="codex-placed-indicator"><i className="fas fa-check-circle" /> On Map</span>
                        <button type="button" className="btn-codex-view" onClick={() => onFocusPin?.(placedPin.id)}>
                          <i className="fas fa-crosshairs" /> View
                        </button>
                      </>
                    ) : (
                      <button type="button" className="btn-codex-place" onClick={() => handlePlaceNpc(npc)}>
                        <i className="fas fa-map-pin" /> Place on Map
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )
        )}

        {/* Tab: Creatures / Bestiary */}
        {activeTab === 'creatures' && (
          filteredCreatures.length === 0 ? (
            <div className="codex-empty-tab">
              <i className="fas fa-skull-crossbones" />
              <span>No bestiary creatures match your search.</span>
            </div>
          ) : (
            filteredCreatures.map(c => {
              const cId = c.id || c.name;
              const placedPin = pins.find(p => (p.mapId || 'map-mythril-world') === currentMapId && p.linkedEntities?.creatureIds?.includes(cId));
              return (
                <div key={cId} className="codex-item-card">
                  <div className="codex-card-head">
                    <div className="codex-avatar-badge badge-creature">
                      <i className="fas fa-dragon" />
                    </div>
                    <div className="codex-head-info">
                      <h4 className="codex-card-title">{c.name}</h4>
                      <span className="codex-card-subtitle">{c.type || 'Beast'} {c.regionName ? `• ${c.regionName}` : ''}</span>
                    </div>
                    {c.cr !== undefined && (
                      <span className="codex-status-pill codex-status-cr">
                        CR {c.cr}
                      </span>
                    )}
                  </div>

                  <div className="codex-meta-row">
                    {c.hp && <span className="codex-meta-chip"><i className="fas fa-heart" /> {c.hp} HP</span>}
                    {c.ac && <span className="codex-meta-chip"><i className="fas fa-shield-halved" /> {c.ac} AC</span>}
                    {c.speed && <span className="codex-meta-chip"><i className="fas fa-person-running" /> {c.speed}</span>}
                  </div>

                  {c.description && <p className="codex-excerpt">{c.description}</p>}

                  <div className="codex-card-actions">
                    {placedPin ? (
                      <>
                        <span className="codex-placed-indicator"><i className="fas fa-check-circle" /> On Map</span>
                        <button type="button" className="btn-codex-view" onClick={() => onFocusPin?.(placedPin.id)}>
                          <i className="fas fa-crosshairs" /> View
                        </button>
                      </>
                    ) : (
                      <button type="button" className="btn-codex-place" onClick={() => handlePlaceCreature(c)}>
                        <i className="fas fa-map-pin" /> Place on Map
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )
        )}

        {/* Tab: Factions & Lore */}
        {activeTab === 'factions' && (
          <div>
            <div className="codex-subnav-row">
              <button
                type="button"
                className={`btn-codex-subnav ${factionSubTab === 'factions' ? 'active' : ''}`}
                onClick={() => setFactionSubTab('factions')}
              >
                Factions ({factions.length})
              </button>
              <button
                type="button"
                className={`btn-codex-subnav ${factionSubTab === 'locations' ? 'active' : ''}`}
                onClick={() => setFactionSubTab('locations')}
              >
                World Locations ({allWorldLocations.length})
              </button>
            </div>

            {factionSubTab === 'factions' ? (
              filteredFactions.length === 0 ? (
                <div className="codex-empty-tab">
                  <i className="fas fa-shield-halved" />
                  <span>No factions found.</span>
                </div>
              ) : (
                filteredFactions.map(f => {
                  const placedPin = pins.find(p => (p.mapId || 'map-mythril-world') === currentMapId && p.linkedEntities?.factionIds?.includes(f.id));
                  return (
                    <div key={f.id} className="codex-item-card" style={f.colors?.primary ? { borderLeft: `3px solid ${f.colors.primary}` } : {}}>
                      <div className="codex-card-head">
                        <div className="codex-avatar-badge badge-faction">
                          <i className="fas fa-shield-halved" />
                        </div>
                        <div className="codex-head-info">
                          <h4 className="codex-card-title">{f.name}</h4>
                          <span className="codex-card-subtitle">{f.type?.replace(/_/g, ' ') || 'Order'}</span>
                        </div>
                        {f.territory && <span className="codex-status-pill codex-status-active">{f.territory.length} Realms</span>}
                      </div>

                      {f.publicGoal && <p className="codex-excerpt">{f.publicGoal}</p>}

                      <div className="codex-card-actions">
                        {placedPin ? (
                          <>
                            <span className="codex-placed-indicator"><i className="fas fa-check-circle" /> On Map</span>
                            <button type="button" className="btn-codex-view" onClick={() => onFocusPin?.(placedPin.id)}>
                              <i className="fas fa-crosshairs" /> View
                            </button>
                          </>
                        ) : (
                          <button type="button" className="btn-codex-place" onClick={() => handlePlaceFaction(f)}>
                            <i className="fas fa-map-pin" /> Place on Map
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              filteredLocations.length === 0 ? (
                <div className="codex-empty-tab">
                  <i className="fas fa-location-dot" />
                  <span>No locations found.</span>
                </div>
              ) : (
                filteredLocations.map(loc => {
                  const placedPin = pins.find(p => (p.mapId || 'map-mythril-world') === currentMapId && p.linkedEntities?.locationId === loc.id);
                  return (
                    <div key={loc.id} className="codex-item-card">
                      <div className="codex-card-head">
                        <div className="codex-avatar-badge">
                          <i className={`fas ${loc.icon || 'fa-landmark'}`} />
                        </div>
                        <div className="codex-head-info">
                          <h4 className="codex-card-title">{loc.name}</h4>
                          <span className="codex-card-subtitle">{loc.type || 'Point of Interest'}</span>
                        </div>
                        {loc.dangerLevel && (
                          <span className={`codex-status-pill ${loc.dangerLevel === 'extreme' ? 'codex-status-danger' : 'codex-status-cr'}`}>
                            {loc.dangerLevel}
                          </span>
                        )}
                      </div>

                      {loc.description && <p className="codex-excerpt">{loc.description}</p>}

                      <div className="codex-card-actions">
                        {placedPin ? (
                          <>
                            <span className="codex-placed-indicator"><i className="fas fa-check-circle" /> On Map</span>
                            <button type="button" className="btn-codex-view" onClick={() => onFocusPin?.(placedPin.id)}>
                              <i className="fas fa-crosshairs" /> View
                            </button>
                          </>
                        ) : (
                          <button type="button" className="btn-codex-place" onClick={() => handlePlaceLocation(loc)}>
                            <i className="fas fa-map-pin" /> Place on Map
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )
            )}
          </div>
        )}

        {/* Tab: Items & Relics */}
        {activeTab === 'items' && (
          filteredItems.length === 0 ? (
            <div className="codex-empty-tab">
              <i className="fas fa-gem" />
              <span>No items found.</span>
            </div>
          ) : (
            filteredItems.map(item => {
              const placedPin = pins.find(p => (p.mapId || 'map-mythril-world') === currentMapId && p.linkedEntities?.itemIds?.includes(item.id));
              return (
                <div key={item.id} className="codex-item-card">
                  <div className="codex-card-head">
                    <div className="codex-avatar-badge badge-item">
                      <i className="fas fa-gem" />
                    </div>
                    <div className="codex-head-info">
                      <h4 className="codex-card-title">{item.name}</h4>
                      <span className="codex-card-subtitle">{item.type || 'Item'} {item.rarity ? `• ${item.rarity}` : ''}</span>
                    </div>
                    {item.rarity && (
                      <span className="codex-status-pill codex-status-active">
                        {item.rarity}
                      </span>
                    )}
                  </div>

                  {item.description && <p className="codex-excerpt">{item.description}</p>}

                  <div className="codex-card-actions">
                    {placedPin ? (
                      <>
                        <span className="codex-placed-indicator"><i className="fas fa-check-circle" /> On Map</span>
                        <button type="button" className="btn-codex-view" onClick={() => onFocusPin?.(placedPin.id)}>
                          <i className="fas fa-crosshairs" /> View
                        </button>
                      </>
                    ) : (
                      <button type="button" className="btn-codex-place" onClick={() => handlePlaceItem(item)}>
                        <i className="fas fa-map-pin" /> Place on Map
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )
        )}

        {/* Tab: Journal & Notes */}
        {activeTab === 'journal' && (
          filteredJournal.length === 0 ? (
            <div className="codex-empty-tab">
              <i className="fas fa-feather-pointed" />
              <span>No journal notes or lore records found.</span>
            </div>
          ) : (
            filteredJournal.map((item, idx) => {
              const placedPin = pins.find(p => (p.mapId || 'map-mythril-world') === currentMapId && p.linkedEntities?.journalNotes === item.content);
              return (
                <div key={item.id || `jn-${idx}`} className="codex-item-card">
                  <div className="codex-card-head">
                    <div className="codex-avatar-badge badge-note">
                      <i className="fas fa-feather-pointed" />
                    </div>
                    <div className="codex-head-info">
                      <h4 className="codex-card-title">{item.title || 'Field Note'}</h4>
                      <span className="codex-card-subtitle">{item.category || item.sourceType || 'Journal'}</span>
                    </div>
                  </div>

                  {item.content && <p className="codex-excerpt">{item.content}</p>}

                  <div className="codex-card-actions">
                    {placedPin ? (
                      <>
                        <span className="codex-placed-indicator"><i className="fas fa-check-circle" /> On Map</span>
                        <button type="button" className="btn-codex-view" onClick={() => onFocusPin?.(placedPin.id)}>
                          <i className="fas fa-crosshairs" /> View
                        </button>
                      </>
                    ) : (
                      <button type="button" className="btn-codex-place" onClick={() => handlePlaceNote(item)}>
                        <i className="fas fa-map-pin" /> Place on Map
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )
        )}
      </div>
    </aside>
  );
};

export default CampaignCodexSidebar;
