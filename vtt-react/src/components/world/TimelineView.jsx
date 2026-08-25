import React, { useState, useMemo, useRef } from 'react';
import useTimelineStore, {
  EVENT_TYPES,
  WARMTH_PHASES,
  CHRONOLOGY_ERA_DISPLAY
} from '../../store/timelineStore';
import useFactionStore from '../../store/factionStore';
import useWorldStore from '../../store/worldStore';
import RichLoreText from '../common/RichLoreText';
import { sanitizeLoreText, formatDisplayName } from './WorldDashboard';
import './TimelineView.css';

const TimelineView = ({ filterLocationId, filterFactionId, filterClassId, compact = false }) => {
  const { calendar, events, getEraTimeline } = useTimelineStore();
  const { getFaction } = useFactionStore();
  const { getRegion, getLocation } = useWorldStore();

  const [selectedEra, setSelectedEra] = useState('freezing-era');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [timelineSearch, setTimelineSearch] = useState('');
  const [showCalendarDrawer, setShowCalendarDrawer] = useState(false);
  const [scopeAllEras, setScopeAllEras] = useState(false);

  const eventListRef = useRef(null);

  const eraTimeline = useMemo(() => getEraTimeline(), [getEraTimeline]);

  const currentEra = useMemo(
    () => eraTimeline.find((e) => e.id === selectedEra) || eraTimeline[eraTimeline.length - 1] || eraTimeline[0],
    [eraTimeline, selectedEra]
  );

  const faction = filterFactionId ? getFaction(filterFactionId) : null;
  const isScoped = Boolean(filterLocationId || filterFactionId || filterClassId);

  const filteredEvents = useMemo(() => {
    let pool = isScoped || scopeAllEras ? events : (currentEra?.events || events);
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

      if (results.length === 0) {
        results = events.filter((e) =>
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
      if (results.length === 0) {
        results = events.slice(0, 5);
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
    events,
    currentEra,
    filterLocationId,
    filterFactionId,
    filterClassId,
    typeFilter,
    timelineSearch,
    faction
  ]);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    return events.find((e) => e.id === selectedEventId) || null;
  }, [selectedEventId, events]);

  const jumpToEvent = (eventId) => {
    setSelectedEventId(eventId);
    const target = events.find((e) => e.id === eventId);
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
              <h2 className="chronicon-title">The Mythrill Chronicon</h2>
              <span className="chronicon-subtitle">
                An illuminated record of the 150-year freeze, celestial pacts, and the deepening silence
              </span>
            </div>
          </div>
        </div>

        <div className="chronicon-header-actions">
          <button
            type="button"
            className={`btn-chronicon-action ${showCalendarDrawer ? 'active' : ''}`}
            onClick={() => setShowCalendarDrawer(!showCalendarDrawer)}
            title="Open Celestial Calendar, 12 Months & Sacred Observances"
          >
            <i className="fas fa-calendar-days"></i>
            <span>Celestial Calendar</span>
          </button>
        </div>
      </div>

      {/* ── Slideable Calendar Drawer ────────────────────────── */}
      {showCalendarDrawer && (
        <div className="chronicon-calendar-drawer">
          <MiniCalendar onClose={() => setShowCalendarDrawer(false)} />
        </div>
      )}

      {/* ── Era Milestones Track ────────────────────────────── */}
      <div className="chronicon-era-stepper">
        <div className="era-stepper-label">
          <i className="fas fa-landmark"></i>
          <span>Historical Epochs</span>
        </div>
        <div className="era-stepper-track">
          {CHRONOLOGY_ERA_DISPLAY.map((era, index) => {
            const isActive = selectedEra === era.id && !scopeAllEras;
            const eraEvents = events.filter((e) => e.date?.eraId === era.id);

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
          })}

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
            <div className="era-step-range">Pre-0 → Year 475</div>
            <div className="era-step-footer">
              <span className="era-event-count">
                <i className="fas fa-book-atlas"></i> {events.length} records
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* ── Active Era Banner ───────────────────────────────── */}
      {!scopeAllEras && currentEra && (
        <div className="chronicon-era-banner">
          <div className="era-banner-left">
            <span className="era-banner-badge">Active Epoch</span>
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
            const count = (scopeAllEras ? events : (currentEra?.events || events)).filter(
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
                      <span className={`event-category-badge type-${event.type}`}>
                        <i className={`fas fa-${eventTypes[event.type]?.icon || 'circle'}`}></i>
                        {formatDisplayName(eventTypes[event.type]?.label || event.type)}
                      </span>
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
                                    const match = events.find((e) => e.id === cId);
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
                                    const match = events.find((e) => e.id === cId);
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
