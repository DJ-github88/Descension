import React, { useState, useMemo, useRef } from 'react';
import useTimelineStore, {
  EVENT_TYPES,
  WARMTH_PHASES,
  CHRONOLOGY_ERA_DISPLAY
} from '../../store/timelineStore';
import useFactionStore from '../../store/factionStore';
import useWorldStore from '../../store/worldStore';
import RichLoreText from '../common/RichLoreText';
import LoreEditorToolbar from '../common/LoreEditorToolbar';
import { sanitizeLoreText, formatDisplayName } from './WorldDashboard';
import './TimelineView.css';

const TimelineView = ({ filterLocationId, filterFactionId, filterClassId, compact = false }) => {
  const { calendar, getEraTimeline, getAllEvents, getChronology, addEvent, updateEvent, removeEvent, customEvents } = useTimelineStore();
  const { getFaction } = useFactionStore();
  const { getRegion, getLocation, activeWorldId, getActiveWorld, addCustomTimeline, updateCustomTimeline, deleteCustomTimeline } = useWorldStore();

  const activeWorld = getActiveWorld();
  const isCanonWorld = activeWorldId === 'mythrill';
  const chronology = useMemo(() => getChronology(activeWorldId), [getChronology, activeWorldId, activeWorld]);
  const worldEvents = useMemo(() => getAllEvents(activeWorldId), [getAllEvents, activeWorldId, customEvents]);

  const [selectedEra, setSelectedEra] = useState(chronology[0]?.id || 'freezing-era');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [timelineSearch, setTimelineSearch] = useState('');
  const [showCalendarDrawer, setShowCalendarDrawer] = useState(false);
  const [scopeAllEras, setScopeAllEras] = useState(false);

  // Authoring & Editing Modal States
  const [showAddEraModal, setShowAddEraModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingEra, setEditingEra] = useState(null);

  // Form State - Epoch
  const [newEraName, setNewEraName] = useState('');
  const [newEraRange, setNewEraRange] = useState('');
  const [newEraDesc, setNewEraDesc] = useState('');

  // Form State - Event
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventYear, setNewEventYear] = useState(0);
  const [newEventEraId, setNewEventEraId] = useState('');
  const [newEventType, setNewEventType] = useState('founding');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventNarrative, setNewEventNarrative] = useState('');
  const [newEventHook, setNewEventHook] = useState('');

  const eventListRef = useRef(null);
  const narrativeTextareaRef = useRef(null);
  const editNarrativeTextareaRef = useRef(null);

  const eraTimeline = useMemo(() => getEraTimeline(activeWorldId), [getEraTimeline, activeWorldId]);

  const currentEra = useMemo(
    () => eraTimeline.find((e) => e.id === selectedEra) || eraTimeline[0] || null,
    [eraTimeline, selectedEra]
  );

  const faction = filterFactionId ? getFaction(filterFactionId) : null;
  const isScoped = Boolean(filterLocationId || filterFactionId || filterClassId);

  const filteredEvents = useMemo(() => {
    let pool = isScoped || scopeAllEras ? worldEvents : (currentEra?.events || worldEvents);
    let results = pool;

    if (filterLocationId) {
      results = results.filter((e) =>
        e.locationIds?.includes(filterLocationId) ||
        e.description?.toLowerCase().includes(filterLocationId.toLowerCase())
      );
    }

    if (filterFactionId) {
      const targetFac = faction;
      const relatedLocations = targetFac
        ? [targetFac.headquarters, ...(targetFac.territory || []), targetFac.regionId].filter(Boolean)
        : [];

      results = results.filter((e) => {
        if (e.factionIds?.includes(filterFactionId)) return true;
        if (relatedLocations.some((loc) => e.locationIds?.includes(loc))) return true;
        return false;
      });

      if (results.length === 0 && isCanonWorld) {
        results = worldEvents.filter((e) =>
          e.id === 'event-entombment' ||
          e.id === 'event-shattering-aex' ||
          e.id === 'event-freeze-front' ||
          e.id === 'event-thirteenth-silence' ||
          e.id === 'event-sol-deepening' ||
          e.type === 'cosmic' ||
          e.type === 'cataclysm'
        );
      }
    }

    if (filterClassId) {
      results = results.filter((e) => e.classIds?.includes(filterClassId));
      if (results.length === 0 && isCanonWorld) {
        results = worldEvents.slice(0, 5);
      }
    }

    if (typeFilter) {
      results = results.filter((e) => e.type === typeFilter);
    }

    if (timelineSearch.trim()) {
      const q = timelineSearch.toLowerCase();
      results = results.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.narrative?.toLowerCase().includes(q) ||
          (e.dateDisplay && e.dateDisplay.toLowerCase().includes(q))
      );
    }

    return [...results].sort((a, b) => (a.date?.year ?? 0) - (b.date?.year ?? 0));
  }, [
    isScoped,
    scopeAllEras,
    worldEvents,
    currentEra,
    filterLocationId,
    filterFactionId,
    filterClassId,
    typeFilter,
    timelineSearch,
    faction,
    isCanonWorld
  ]);

  const handleCreateEraSubmit = (e) => {
    e.preventDefault();
    if (!newEraName.trim()) return;
    const eraId = addCustomTimeline(activeWorldId, {
      name: newEraName.trim(),
      yearRange: newEraRange.trim() || 'Years 0–100',
      description: newEraDesc.trim()
    });
    setSelectedEra(eraId);
    setShowAddEraModal(false);
    setNewEraName('');
    setNewEraRange('');
    setNewEraDesc('');
  };

  const handleCreateEventSubmit = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    const targetEra = newEventEraId || currentEra?.id || chronology[0]?.id || 'custom-era';
    addEvent({
      title: newEventTitle.trim(),
      type: newEventType,
      worldId: activeWorldId,
      date: {
        eraId: targetEra,
        year: parseInt(newEventYear, 10) || 0
      },
      dateDisplay: `Year ${newEventYear}`,
      description: newEventDesc.trim(),
      narrative: newEventNarrative.trim(),
      dmHook: newEventHook.trim()
    });
    setShowAddEventModal(false);
    setNewEventTitle('');
    setNewEventDesc('');
    setNewEventNarrative('');
    setNewEventHook('');
  };

  const handleUpdateEraSubmit = (e) => {
    e.preventDefault();
    if (!editingEra || !editingEra.name.trim()) return;
    updateCustomTimeline(activeWorldId, editingEra.id, {
      name: editingEra.name.trim(),
      yearRange: editingEra.yearRange?.trim() || 'Years 0–100',
      description: editingEra.description?.trim() || ''
    });
    setEditingEra(null);
  };

  const handleDeleteEra = (eraId) => {
    deleteCustomTimeline(activeWorldId, eraId);
    if (selectedEra === eraId) {
      setSelectedEra(chronology.find((c) => c.id !== eraId)?.id || 'freezing-era');
    }
    setEditingEra(null);
  };

  const handleUpdateEventSubmit = (e) => {
    e.preventDefault();
    if (!editingEvent || !editingEvent.title.trim()) return;
    updateEvent(editingEvent.id, {
      title: editingEvent.title.trim(),
      type: editingEvent.type,
      date: {
        eraId: editingEvent.date?.eraId || currentEra?.id || 'custom-era',
        year: parseInt(editingEvent.date?.year, 10) || 0
      },
      dateDisplay: `Year ${editingEvent.date?.year ?? 0}`,
      description: editingEvent.description?.trim() || '',
      narrative: editingEvent.narrative?.trim() || '',
      dmHook: editingEvent.dmHook?.trim() || ''
    });
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    removeEvent(eventId);
    if (selectedEventId === eventId) setSelectedEventId(null);
    setEditingEvent(null);
  };

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    return worldEvents.find((e) => e.id === selectedEventId) || null;
  }, [selectedEventId, worldEvents]);

  const jumpToEvent = (eventId) => {
    setSelectedEventId(eventId);
    const target = worldEvents.find((e) => e.id === eventId);
    if (target?.date?.eraId && target.date.eraId !== selectedEra) {
      setSelectedEra(target.date.eraId);
    }
    setTimeout(() => {
      const el = document.getElementById(`chronicle-event-${eventId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const eventTypes = EVENT_TYPES;

  // COMPACT VIEW (Embedded inside Faction Detail or Location Detail)
  if (compact) {
    return (
      <div className="world-timeline-compact-stream">
        <div className="compact-stream-header">
          <div className="compact-stream-header-inner">
            <h3 className="compact-stream-title">
              <i className="fas fa-hourglass-half"></i> Historical Milestones &amp; Canon Epochs ({filteredEvents.length})
            </h3>
            {filterFactionId && faction && (
              <p className="compact-stream-sub">
                Canonical events connecting {sanitizeLoreText(faction.name)} to the 150-Year Freeze
              </p>
            )}
          </div>
        </div>

        <div className="compact-timeline-list">
          {filteredEvents.map((event) => {
            const isExpanded = selectedEventId === event.id;

            return (
              <div
                key={event.id}
                id={`compact-event-${event.id}`}
                className={`compact-timeline-card ${isExpanded ? 'expanded' : ''}`}
                onClick={() => setSelectedEventId(isExpanded ? null : event.id)}
              >
                <div className="compact-card-meta-bar">
                  <span className="compact-year-badge">
                    <i className="fas fa-calendar-alt" style={{ marginRight: '5px' }}></i>
                    Year {event.date?.year ?? 0}
                  </span>
                  <span className={`compact-type-badge ${event.type}`}>
                    <i
                      className={`fas fa-${eventTypes[event.type]?.icon || 'circle'}`}
                      style={{ marginRight: '4px' }}
                    ></i>
                    {formatDisplayName(eventTypes[event.type]?.label || event.type)}
                  </span>
                  {event.dateDisplay && <span className="compact-era-tag">{event.dateDisplay}</span>}
                </div>

                <h4 className="compact-event-title">{sanitizeLoreText(event.title)}</h4>
                <p className="compact-event-desc">{sanitizeLoreText(event.description)}</p>

                {isExpanded && event.narrative && (
                  <div className="compact-expanded-narrative">
                    <p className="compact-narrative-text">
                      <strong>Chronicle Detail:</strong> {sanitizeLoreText(event.narrative)}
                    </p>
                    {event.dmHook && (
                      <div className="compact-dm-hook">
                        <i className="fas fa-key"></i>
                        <strong>GM Secret:</strong> {sanitizeLoreText(event.dmHook)}
                      </div>
                    )}
                  </div>
                )}

                <div className="compact-card-footer">
                  <span className="compact-expand-prompt">
                    {isExpanded ? '▲ Collapse Narrative' : '▼ Read Full Chronicle Entry'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // FULL ILLUMINATED CHRONICLE VIEW
  return (
    <div className="world-panel-timeline" ref={eventListRef}>
      {/* ── Chronicon Master Header ───────────────────────── */}
      <div className="chronicon-master-header">
        <div className="chronicon-header-info">
          <div className="chronicon-title-row">
            <i className="fas fa-scroll chronicon-header-icon"></i>
            <div>
              <h2 className="chronicon-title">{isCanonWorld ? 'The Mythrill Chronicon' : `${activeWorld.name} Historical Chronicon`}</h2>
              <span className="chronicon-subtitle">
                {isCanonWorld
                  ? 'An illuminated record of the 150-year freeze, celestial pacts, and the deepening silence'
                  : `Living annals, historic epochs, and sovereign chronicle records of ${activeWorld.name}`}
              </span>
            </div>
          </div>
        </div>

        <div className="chronicon-header-actions">
          <button
            type="button"
            className="btn-chronicon-action"
            onClick={() => setShowAddEraModal(true)}
            title="Forge a new historical epoch"
          >
            <i className="fas fa-landmark"></i>
            <span>+ Forge Epoch</span>
          </button>

          <button
            type="button"
            className="btn-chronicon-action primary"
            onClick={() => setShowAddEventModal(true)}
            title="Record a new chronicle event"
          >
            <i className="fas fa-feather-pointed"></i>
            <span>+ Record Event</span>
          </button>

          {isCanonWorld && (
            <button
              type="button"
              className={`btn-chronicon-action ${showCalendarDrawer ? 'active' : ''}`}
              onClick={() => setShowCalendarDrawer(!showCalendarDrawer)}
              title="Open Celestial Calendar, 12 Months & Sacred Observances"
            >
              <i className="fas fa-calendar-days"></i>
              <span>Celestial Calendar</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Slideable Calendar Drawer ────────────────────────── */}
      {showCalendarDrawer && isCanonWorld && (
        <div className="chronicon-calendar-drawer">
          <MiniCalendar onClose={() => setShowCalendarDrawer(false)} />
        </div>
      )}

      {/* ── Era Milestones Track ────────────────────────────── */}
      <div className="chronicon-era-stepper">
        <div className="era-stepper-label">
          <i className="fas fa-landmark"></i>
          <span>Historical Epochs ({chronology.length})</span>
        </div>
        <div className="era-stepper-track">
          {chronology.length === 0 ? (
            <div className="era-step-card-empty" onClick={() => setShowAddEraModal(true)}>
              <i className="fas fa-plus-circle"></i>
              <span>Found First Epoch</span>
            </div>
          ) : (
            chronology.map((era, index) => {
              const isActive = selectedEra === era.id && !scopeAllEras;
              const eraEvents = worldEvents.filter((e) => e.date?.eraId === era.id);

              return (
                <button
                  key={era.id}
                  type="button"
                  className={`era-step-card ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setScopeAllEras(false);
                    setSelectedEra(era.id);
                    setSelectedEventId(null);
                  }}
                >
                  <div className="era-step-num">Epoch {index + 1}</div>
                  <div className="era-step-title">{era.name}</div>
                  <div className="era-step-range">{era.yearRange}</div>
                  <div className="era-step-footer">
                    <span className="era-event-count">
                      <i className="fas fa-feather-pointed"></i> {eraEvents.length} records
                    </span>
                  </div>
                </button>
              );
            })
          )}

          {chronology.length > 0 && (
            <button
              type="button"
              className={`era-step-card all-eras-step ${scopeAllEras ? 'active' : ''}`}
              onClick={() => {
                setScopeAllEras(true);
                setSelectedEventId(null);
              }}
            >
              <div className="era-step-num">Complete History</div>
              <div className="era-step-title">All Eras</div>
              <div className="era-step-range">Sovereign Timeline</div>
              <div className="era-step-footer">
                <span className="era-event-count">
                  <i className="fas fa-book-atlas"></i> {worldEvents.length} records
                </span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* ── Active Era Banner ───────────────────────────────── */}
      {!scopeAllEras && currentEra && (
        <div className="chronicon-era-banner">
          <div className="era-banner-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="era-banner-badge">Active Epoch</span>
              <button
                type="button"
                className="btn-event-edit-action"
                style={{ background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.3)', color: '#d4af37', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                title="Edit Epoch Details"
                onClick={() => setEditingEra({ ...currentEra })}
              >
                <i className="fas fa-pen-to-square"></i> Edit Epoch
              </button>
            </div>
            <h3 className="era-banner-heading">{currentEra.name}</h3>
            <span className="era-banner-dates">{currentEra.yearRange}</span>
          </div>
          <div className="era-banner-right">
            <p className="era-banner-prose">&ldquo;{sanitizeLoreText(currentEra.description)}&rdquo;</p>
          </div>
        </div>
      )}

      {/* ── Toolbar & Event Type Filters ─────────────────────── */}
      <div className="chronicon-toolbar">
        <div className="chronicon-search-box">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search chronicle entries, prophecies, wars, and decrees..."
            value={timelineSearch}
            onChange={(e) => setTimelineSearch(e.target.value)}
          />
          {timelineSearch && (
            <button className="btn-clear-search" onClick={() => setTimelineSearch('')}>
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        <div className="chronicon-type-filters">
          <button
            type="button"
            className={`type-filter-pill ${!typeFilter ? 'active' : ''}`}
            onClick={() => setTypeFilter(null)}
          >
            All Event Types ({filteredEvents.length})
          </button>
          {Object.entries(eventTypes).map(([key, val]) => {
            const count = (scopeAllEras ? worldEvents : (currentEra?.events || worldEvents)).filter(
              (e) => e.type === key
            ).length;
            if (count === 0) return null;

            return (
              <button
                key={key}
                type="button"
                className={`type-filter-pill ${typeFilter === key ? 'active' : ''} type-${key}`}
                onClick={() => setTypeFilter(typeFilter === key ? null : key)}
              >
                <i className={`fas fa-${val.icon || 'circle'}`}></i>
                <span>{val.label}</span>
                <span className="pill-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Chronicle Event Stream ──────────────────────────── */}
      <div className="chronicon-stream-container">
        {filteredEvents.length === 0 ? (
          <div className="chronicon-empty-state">
            <div className="chronicon-empty-icon-wrap">
              <i className="fas fa-feather-pointed"></i>
            </div>
            <h3>No Chronicle Records Found</h3>
            <p>No historical events match your search query or active filter settings.</p>
            <button
              type="button"
              className="btn-chronicon-reset"
              onClick={() => {
                setTimelineSearch('');
                setTypeFilter(null);
                setScopeAllEras(false);
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="chronicon-event-list">
            {filteredEvents.map((event) => {
              const isSelected = selectedEventId === event.id;
              const hasCausal =
                (event.causedBy && event.causedBy.length > 0) ||
                (event.causes && event.causes.length > 0);

              return (
                <article
                  key={event.id}
                  id={`chronicle-event-${event.id}`}
                  className={`chronicon-event-card ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => setSelectedEventId(isSelected ? null : event.id)}
                >
                  <div className="event-gutter">
                    <div className={`event-node-orb type-${event.type}`}>
                      <i className={`fas fa-${eventTypes[event.type]?.icon || 'feather'}`}></i>
                    </div>
                    <div className="event-node-line"></div>
                  </div>

                  <div className="event-card-body">
                    {/* Card Top Meta */}
                    <div className="event-card-header">
                      <div className="event-year-tag">
                        <i className="fas fa-calendar"></i>
                        <span>{event.dateDisplay || `Year ${event.date?.year ?? 0}`}</span>
                      </div>
                      <div className="event-header-right">
                        <span className={`event-category-badge type-${event.type}`}>
                          <i className={`fas fa-${eventTypes[event.type]?.icon || 'circle'}`}></i>
                          {formatDisplayName(eventTypes[event.type]?.label || event.type)}
                        </span>
                        <button
                          type="button"
                          className="btn-event-edit-action"
                          title="Edit Chronicle Event"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingEvent({
                              ...event,
                              date: {
                                year: event.date?.year ?? 0,
                                eraId: event.date?.eraId || selectedEra
                              }
                            });
                          }}
                        >
                          <i className="fas fa-pen-to-square"></i>
                        </button>
                      </div>
                    </div>

                    {/* Event Title */}
                    <h3 className="event-title">{sanitizeLoreText(event.title)}</h3>

                    {/* Event Summary Prose */}
                    <p className="event-description">{sanitizeLoreText(event.description)}</p>

                    {/* Expanded Historical Chronicle Narrative */}
                    {isSelected && (
                      <div className="event-expanded-drawer" onClick={(e) => e.stopPropagation()}>
                        {event.narrative && (
                          <div className="event-narrative-prose">
                            <div className="narrative-section-title">
                              <i className="fas fa-book-open"></i> Full Historical Entry
                            </div>
                            <RichLoreText text={sanitizeLoreText(event.narrative)} />
                          </div>
                        )}

                        {/* Causal Linkages */}
                        {hasCausal && (
                          <div className="event-causal-links-block">
                            {event.causedBy && event.causedBy.length > 0 && (
                              <div className="causal-row">
                                <span className="causal-label">
                                  <i className="fas fa-arrow-left"></i> Direct Cause:
                                </span>
                                <div className="causal-chips">
                                  {event.causedBy.map((cId) => {
                                    const match = worldEvents.find((e) => e.id === cId);
                                    return (
                                      <button
                                        key={cId}
                                        type="button"
                                        className="btn-causal-jump"
                                        onClick={() => jumpToEvent(cId)}
                                        title={`Jump to "${match?.title || cId}"`}
                                      >
                                        <i className="fas fa-bolt"></i>
                                        <span>{match?.title || cId}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {event.causes && event.causes.length > 0 && (
                              <div className="causal-row">
                                <span className="causal-label">
                                  <i className="fas fa-arrow-right"></i> Triggered Effect:
                                </span>
                                <div className="causal-chips">
                                  {event.causes.map((cId) => {
                                    const match = worldEvents.find((e) => e.id === cId);
                                    return (
                                      <button
                                        key={cId}
                                        type="button"
                                        className="btn-causal-jump"
                                        onClick={() => jumpToEvent(cId)}
                                        title={`Jump to "${match?.title || cId}"`}
                                      >
                                        <i className="fas fa-share-nodes"></i>
                                        <span>{match?.title || cId}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* DM Hook & Secret Wax Seal Drawer */}
                        {event.dmHook && (
                          <div className="event-dm-hook-seal">
                            <div className="dm-seal-header">
                              <i className="fas fa-key"></i>
                              <strong>Dungeon Master Chronicle Hook &amp; Secret</strong>
                            </div>
                            <p className="dm-seal-body">{sanitizeLoreText(event.dmHook)}</p>
                          </div>
                        )}

                        <div className="event-drawer-quick-actions">
                          <button
                            type="button"
                            className="btn-event-drawer-edit"
                            onClick={() => {
                              setEditingEvent({
                                ...event,
                                date: {
                                  year: event.date?.year ?? 0,
                                  eraId: event.date?.eraId || selectedEra
                                }
                              });
                            }}
                          >
                            <i className="fas fa-feather-pointed"></i> Edit Entry &amp; Illuminated Text
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Card Footer Prompt */}
                    <div className="event-card-footer">
                      <span className="event-expand-link">
                        {isSelected ? (
                          <>
                            <i className="fas fa-chevron-up"></i> Collapse Chronicle
                          </>
                        ) : (
                          <>
                            <i className="fas fa-chevron-down"></i> Read Illuminated Narrative &amp; Causes
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Forge Epoch Modal ── */}
      {showAddEraModal && (
        <div className="world-modal-overlay" onClick={() => setShowAddEraModal(false)}>
          <div className="world-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="world-modal-header">
              <div className="world-modal-title">
                <i className="fas fa-landmark"></i>
                <h3>Forge Historical Epoch in {activeWorld.name}</h3>
              </div>
              <button className="world-modal-close" onClick={() => setShowAddEraModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleCreateEraSubmit}>
              <div className="world-modal-body">
                <div className="world-form-group">
                  <label>Epoch / Age Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Age of Ether, Dawn of Iron..."
                    value={newEraName}
                    onChange={(e) => setNewEraName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="world-form-group">
                  <label>Year Range</label>
                  <input
                    type="text"
                    placeholder="e.g. Years 0–300, Pre-Sundering..."
                    value={newEraRange}
                    onChange={(e) => setNewEraRange(e.target.value)}
                  />
                </div>
                <div className="world-form-group">
                  <label>Epoch Overview &amp; Lore</label>
                  <textarea
                    rows={4}
                    placeholder="Describe the cosmological status, major treaties, celestial alignments, or technological state of this era..."
                    value={newEraDesc}
                    onChange={(e) => setNewEraDesc(e.target.value)}
                  />
                </div>
              </div>
              <div className="world-modal-actions">
                <button type="button" className="world-action-btn" onClick={() => setShowAddEraModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="world-action-btn primary">
                  <i className="fas fa-feather-pointed"></i> Inscribe Epoch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Epoch Modal ── */}
      {editingEra && (
        <div className="world-modal-overlay" onClick={() => setEditingEra(null)}>
          <div className="world-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="world-modal-header">
              <div className="world-modal-title">
                <i className="fas fa-landmark"></i>
                <h3>Edit Historical Epoch: {editingEra.name}</h3>
              </div>
              <button className="world-modal-close" onClick={() => setEditingEra(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleUpdateEraSubmit}>
              <div className="world-modal-body">
                <div className="world-form-group">
                  <label>Epoch / Age Name *</label>
                  <input
                    type="text"
                    required
                    value={editingEra.name}
                    onChange={(e) => setEditingEra({ ...editingEra, name: e.target.value })}
                    autoFocus
                  />
                </div>
                <div className="world-form-group">
                  <label>Year Range</label>
                  <input
                    type="text"
                    value={editingEra.yearRange || ''}
                    onChange={(e) => setEditingEra({ ...editingEra, yearRange: e.target.value })}
                  />
                </div>
                <div className="world-form-group">
                  <label>Epoch Overview &amp; Lore</label>
                  <textarea
                    rows={4}
                    value={editingEra.description || ''}
                    onChange={(e) => setEditingEra({ ...editingEra, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="world-modal-actions">
                {editingEra.isCustom && (
                  <button
                    type="button"
                    className="world-action-btn danger"
                    onClick={() => handleDeleteEra(editingEra.id)}
                    style={{ marginRight: 'auto' }}
                  >
                    <i className="fas fa-trash"></i> Delete Epoch
                  </button>
                )}
                <button type="button" className="world-action-btn" onClick={() => setEditingEra(null)}>
                  Cancel
                </button>
                <button type="submit" className="world-action-btn primary">
                  <i className="fas fa-check"></i> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Record Chronicle Event Modal ── */}
      {showAddEventModal && (
        <div className="world-modal-overlay" onClick={() => setShowAddEventModal(false)}>
          <div className="world-modal-card world-modal-card-lg" onClick={(e) => e.stopPropagation()}>
            <div className="world-modal-header">
              <div className="world-modal-title">
                <i className="fas fa-feather-pointed"></i>
                <h3>Record Chronicle Event in {activeWorld.name}</h3>
              </div>
              <button className="world-modal-close" onClick={() => setShowAddEventModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleCreateEventSubmit}>
              <div className="world-modal-body">
                <div className="world-form-group">
                  <label>Chronicle Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Siege of the Sunken Spire, The Treaty of Rime..."
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="world-form-row">
                  <div className="world-form-group">
                    <label>Year</label>
                    <input
                      type="number"
                      placeholder="e.g. 150"
                      value={newEventYear}
                      onChange={(e) => setNewEventYear(e.target.value)}
                    />
                  </div>
                  <div className="world-form-group">
                    <label>Assigned Epoch</label>
                    <select value={newEventEraId} onChange={(e) => setNewEventEraId(e.target.value)}>
                      {chronology.map((era) => (
                        <option key={era.id} value={era.id}>
                          {era.name} ({era.yearRange})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="world-form-group">
                  <label>Event Category</label>
                  <select value={newEventType} onChange={(e) => setNewEventType(e.target.value)}>
                    {Object.entries(eventTypes).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="world-form-group">
                  <label>Summary Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief public summary of what transpired..."
                    value={newEventDesc}
                    onChange={(e) => setNewEventDesc(e.target.value)}
                  />
                </div>
                <div className="world-form-group">
                  <label>Illuminated Narrative / Extended History (Article Codex)</label>
                  <LoreEditorToolbar
                    textareaRef={narrativeTextareaRef}
                    value={newEventNarrative}
                    onChange={(val) => setNewEventNarrative(val)}
                  />
                  <textarea
                    ref={narrativeTextareaRef}
                    rows={6}
                    placeholder="Full historical record, quotes from chroniclers, tactical details, :::readaloud, :::statblock..."
                    value={newEventNarrative}
                    onChange={(e) => setNewEventNarrative(e.target.value)}
                    style={{ borderRadius: '0 0 6px 6px', borderTop: 'none' }}
                  />
                </div>
                <div className="world-form-group">
                  <label>GM Secret &amp; Adventure Hook</label>
                  <input
                    type="text"
                    placeholder="Hidden truth, undiscovered relic, or campaign hook..."
                    value={newEventHook}
                    onChange={(e) => setNewEventHook(e.target.value)}
                  />
                </div>
              </div>
              <div className="world-modal-actions">
                <button type="button" className="world-action-btn" onClick={() => setShowAddEventModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="world-action-btn primary">
                  <i className="fas fa-scroll"></i> Record in Chronicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Chronicle Event Modal ── */}
      {editingEvent && (
        <div className="world-modal-overlay" onClick={() => setEditingEvent(null)}>
          <div className="world-modal-card world-modal-card-lg" onClick={(e) => e.stopPropagation()}>
            <div className="world-modal-header">
              <div className="world-modal-title">
                <i className="fas fa-pen-to-square"></i>
                <h3>Edit Chronicle Event: {editingEvent.title}</h3>
              </div>
              <button className="world-modal-close" onClick={() => setEditingEvent(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleUpdateEventSubmit}>
              <div className="world-modal-body">
                <div className="world-form-group">
                  <label>Chronicle Event Title *</label>
                  <input
                    type="text"
                    required
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    autoFocus
                  />
                </div>
                <div className="world-form-row">
                  <div className="world-form-group">
                    <label>Year</label>
                    <input
                      type="number"
                      value={editingEvent.date?.year ?? 0}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          date: { ...editingEvent.date, year: e.target.value }
                        })
                      }
                    />
                  </div>
                  <div className="world-form-group">
                    <label>Assigned Epoch</label>
                    <select
                      value={editingEvent.date?.eraId || selectedEra}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          date: { ...editingEvent.date, eraId: e.target.value }
                        })
                      }
                    >
                      {chronology.map((era) => (
                        <option key={era.id} value={era.id}>
                          {era.name} ({era.yearRange})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="world-form-group">
                  <label>Event Category</label>
                  <select
                    value={editingEvent.type}
                    onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value })}
                  >
                    {Object.entries(eventTypes).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="world-form-group">
                  <label>Summary Description</label>
                  <textarea
                    rows={2}
                    value={editingEvent.description || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  />
                </div>
                <div className="world-form-group">
                  <label>Illuminated Narrative / Extended History (Article Codex)</label>
                  <LoreEditorToolbar
                    textareaRef={editNarrativeTextareaRef}
                    value={editingEvent.narrative || ''}
                    onChange={(val) => setEditingEvent({ ...editingEvent, narrative: val })}
                  />
                  <textarea
                    ref={editNarrativeTextareaRef}
                    rows={7}
                    placeholder="Full historical record, quotes from chroniclers, tactical details, :::readaloud, :::statblock..."
                    value={editingEvent.narrative || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, narrative: e.target.value })}
                    style={{ borderRadius: '0 0 6px 6px', borderTop: 'none' }}
                  />
                </div>
                <div className="world-form-group">
                  <label>GM Secret &amp; Adventure Hook</label>
                  <input
                    type="text"
                    placeholder="Hidden truth, undiscovered relic, or campaign hook..."
                    value={editingEvent.dmHook || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, dmHook: e.target.value })}
                  />
                </div>
              </div>
              <div className="world-modal-actions">
                <button
                  type="button"
                  className="world-action-btn danger"
                  onClick={() => handleDeleteEvent(editingEvent.id)}
                  style={{ marginRight: 'auto' }}
                >
                  <i className="fas fa-trash"></i> Delete Event
                </button>
                <button type="button" className="world-action-btn" onClick={() => setEditingEvent(null)}>
                  Cancel
                </button>
                <button type="submit" className="world-action-btn primary">
                  <i className="fas fa-check"></i> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Integrated Celestial Calendar Component ──────────────────
const MiniCalendar = ({ onClose }) => {
  const { calendar } = useTimelineStore();
  const seasonLabels = {
    'false-spring': 'False Spring (Thaw & Augury)',
    embers: 'Embers (Geothermal Surge)',
    'deepening-winter': 'Hard Winter (Freeze-Front Advance)',
    'false-dawn': 'False Dawn (Creeping Light)'
  };

  return (
    <div className="world-mini-calendar-full">
      <div className="calendar-panel-header">
        <div>
          <h4>
            <i className="fas fa-calendar-days"></i> The Mythrill Celestial Calendar
          </h4>
          <p className="calendar-subtext">
            12 Months • 3 Ten-Day Weeks per Month • 360-Day Solar Cycle
          </p>
        </div>
        {onClose && (
          <button type="button" className="btn-close-calendar" onClick={onClose} title="Close Calendar">
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      <div className="world-month-grid">
        {calendar.months.map((m) => (
          <div key={m.id} className="world-month-card" title={m.description}>
            <div className="month-top-bar">
              <span className="world-month-num">Month {m.id}</span>
              <span className={`world-month-season-badge season-${m.season}`}>
                {seasonLabels[m.season] || m.season?.replace(/-/g, ' ')}
              </span>
            </div>
            <h5 className="world-month-name">{m.name}</h5>
            <p className="world-month-lore">{m.description}</p>
          </div>
        ))}
      </div>

      <div className="world-holidays-section">
        <h4 className="holidays-heading">
          <i className="fas fa-star"></i> Sacred Holidays &amp; Celestial Observances
        </h4>
        <div className="holidays-grid">
          {calendar.holidays.map((h) => (
            <div key={h.id} className="world-holiday-card">
              <div className="holiday-header">
                <strong>{h.name}</strong>
                <span className="holiday-date-badge">
                  Month {h.date.month}, Day {h.date.day}
                </span>
              </div>
              <p className="holiday-description">{h.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { TimelineView, MiniCalendar };
export default TimelineView;
