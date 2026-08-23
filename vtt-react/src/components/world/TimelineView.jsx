import React, { useState, useMemo } from 'react';
import useTimelineStore, { EVENT_TYPES } from '../../store/timelineStore';
import useFactionStore from '../../store/factionStore';
import useWorldStore from '../../store/worldStore';
import RichLoreText from '../common/RichLoreText';
import { sanitizeLoreText, formatDisplayName } from './WorldDashboard';
import './TimelineView.css';

const TimelineView = ({ filterLocationId, filterFactionId, filterClassId, compact = false }) => {
  const { calendar, events, getEraTimeline, getEventsByType } = useTimelineStore();
  const { getFaction } = useFactionStore();
  const { getRegion, getLocation } = useWorldStore();

  const [selectedEra, setSelectedEra] = useState('freezing-era');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [timelineSearch, setTimelineSearch] = useState('');

  const eraTimeline = useMemo(() => getEraTimeline(), [getEraTimeline]);

  const currentEra = useMemo(
    () => eraTimeline.find((e) => e.id === selectedEra) || eraTimeline[eraTimeline.length - 1] || eraTimeline[0],
    [eraTimeline, selectedEra]
  );

  const faction = filterFactionId ? getFaction(filterFactionId) : null;
  const isScoped = Boolean(filterLocationId || filterFactionId || filterClassId);

  const filteredEvents = useMemo(() => {
    // When scoped to a faction, location, or class, search across ALL eras of events!
    let pool = isScoped ? events : (currentEra?.events || events);

    let results = pool;

    if (filterLocationId) {
      results = results.filter((e) => 
        e.locationIds?.includes(filterLocationId) || 
        e.description?.toLowerCase().includes(filterLocationId.toLowerCase())
      );
    }
    
    if (filterFactionId) {
      const targetFac = faction;
      const relatedLocations = targetFac ? [targetFac.headquarters, ...(targetFac.territory || []), targetFac.regionId].filter(Boolean) : [];

      results = results.filter((e) => {
        if (e.factionIds?.includes(filterFactionId)) return true;
        if (relatedLocations.some(loc => e.locationIds?.includes(loc))) return true;
        return false;
      });

      // If no direct matches, provide the landmark continental epoch events connecting this order to the world
      if (results.length === 0) {
        results = events.filter(e => 
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
          e.narrative?.toLowerCase().includes(q)
      );
    }

    return [...results].sort((a, b) => (a.date?.year ?? 0) - (b.date?.year ?? 0));
  }, [isScoped, events, currentEra, filterLocationId, filterFactionId, filterClassId, typeFilter, timelineSearch, faction]);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    return events.find((e) => e.id === selectedEventId) || null;
  }, [selectedEventId, events]);

  const selectedCausal = useMemo(() => {
    if (!selectedEvent) return null;
    return useTimelineStore.getState().getCausalChain(selectedEvent.id);
  }, [selectedEvent]);

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
                className={`compact-timeline-card ${isExpanded ? 'expanded' : ''}`}
                onClick={() => setSelectedEventId(isExpanded ? null : event.id)}
              >
                <div className="compact-card-meta-bar">
                  <span className="compact-year-badge">
                    <i className="fas fa-calendar-alt" style={{ marginRight: '5px' }}></i>
                    Year {event.date?.year ?? 0}
                  </span>
                  <span className={`compact-type-badge ${event.type}`}>
                    <i className={`fas fa-${eventTypes[event.type]?.icon || 'circle'}`} style={{ marginRight: '4px' }}></i>
                    {formatDisplayName(eventTypes[event.type]?.label || event.type)}
                  </span>
                  {event.dateDisplay && (
                    <span className="compact-era-tag">{event.dateDisplay}</span>
                  )}
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
                        <i className="fas fa-key" style={{ marginRight: '6px', color: '#8b5a1a' }}></i>
                        <strong>GM Secret &amp; Hook:</strong> {sanitizeLoreText(event.dmHook)}
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

  // FULL TIMELINE VIEW (From World Dashboard)
  return (
    <div className="world-panel-timeline">
      {/* Era Navigation Tabs */}
      <div className="world-era-tabs-container">
        <div className="world-era-tabs">
          {eraTimeline.map((era) => (
            <button
              key={era.id}
              className={`world-era-tab ${selectedEra === era.id ? 'active' : ''}`}
              onClick={() => { setSelectedEra(era.id); setSelectedEventId(null); }}
            >
              <span className="era-name">{era.name}</span>
              <span className="world-era-count">{era.events?.length || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {currentEra && (
        <div className="world-era-banner">
          <div className="era-banner-header">
            <h3>{currentEra.name}</h3>
            {currentEra.yearRange && <span className="era-range-pill">{currentEra.yearRange}</span>}
          </div>
          <p className="world-era-desc">{sanitizeLoreText(currentEra.description)}</p>
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <div className="world-timeline-toolbar">
        <div className="timeline-search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search epochal events, battles & prophecies..."
            value={timelineSearch}
            onChange={(e) => setTimelineSearch(e.target.value)}
          />
          {timelineSearch && (
            <button className="btn-clear-search" onClick={() => setTimelineSearch('')}>
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        <div className="world-type-filters">
          <button
            className={`world-type-btn ${!typeFilter ? 'active' : ''}`}
            onClick={() => setTypeFilter(null)}
          >
            All Event Types ({currentEra?.events?.length || filteredEvents.length})
          </button>
          {Object.entries(eventTypes).map(([key, val]) => (
            <button
              key={key}
              className={`world-type-btn ${typeFilter === key ? 'active' : ''}`}
              onClick={() => setTypeFilter(typeFilter === key ? null : key)}
              title={val.label}
            >
              <i className={`fas fa-${val.icon || 'circle'}`} /> {val.label}
            </button>
          ))}
        </div>
      </div>

      {/* Event Stream */}
      <div className="world-timeline-layout">
        <div className="world-timeline-list">
          {filteredEvents.length === 0 ? (
            <div className="world-timeline-empty">
              <i className="fas fa-scroll"></i>
              <p>No recorded historical events matching your current filters in this era.</p>
            </div>
          ) : (
            filteredEvents.map((event) => {
              const isExpanded = selectedEventId === event.id;

              return (
                <div
                  key={event.id}
                  className={`world-timeline-event ${isExpanded ? 'selected' : ''}`}
                  onClick={() => setSelectedEventId(isExpanded ? null : event.id)}
                >
                  <div className="world-timeline-marker">
                    <div className={`world-marker-dot ${event.type}`}>
                      <i className={`fas fa-${eventTypes[event.type]?.icon || 'circle'}`} />
                    </div>
                  </div>

                  <div className="world-timeline-content">
                    <div className="world-timeline-header">
                      <div>
                        <h4>{sanitizeLoreText(event.title)}</h4>
                        <span className="world-timeline-date">
                          {event.dateDisplay || `Year ${event.date?.year ?? 0}`}
                        </span>
                      </div>
                      <span className={`world-badge world-badge-${event.type}`}>
                        {formatDisplayName(eventTypes[event.type]?.label || event.type)}
                      </span>
                    </div>

                    <p className="world-timeline-desc">{sanitizeLoreText(event.description)}</p>

                    {isExpanded && event.narrative && (
                      <div className="world-timeline-narrative">
                        <RichLoreText text={sanitizeLoreText(event.narrative)} />
                        {event.dmHook && (
                          <div className="world-timeline-dm-hook" style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(212, 175, 55, 0.1)', borderLeft: '3px solid #8b5a1a', borderRadius: '4px' }}>
                            <i className="fas fa-key" style={{ color: '#8b5a1a', marginRight: '6px' }}></i>
                            <strong>GM Secret &amp; Hook:</strong> {sanitizeLoreText(event.dmHook)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

const MiniCalendar = () => {
  const { calendar } = useTimelineStore();
  const seasonLabels = {
    'false-spring': 'false spring',
    embers: 'embers',
    'deepening-winter': 'hard winter',
    'false-dawn': 'false dawn'
  };

  return (
    <div className="world-mini-calendar">
      <h4><i className="fas fa-calendar-days"></i> Mythrill Celestial Calendar</h4>
      <div className="world-month-grid">
        {calendar.months.map((m) => (
          <div key={m.id} className="world-month-card" title={m.description}>
            <span className="world-month-num">Month {m.id}</span>
            <span className="world-month-name">{m.name}</span>
            <span className="world-month-season">{seasonLabels[m.season] || m.season?.replace(/-/g, ' ')}</span>
          </div>
        ))}
      </div>
      <div className="world-holidays">
        <h4><i className="fas fa-star"></i> Sacred Holidays &amp; Observances</h4>
        {calendar.holidays.map((h) => (
          <div key={h.id} className="world-holiday">
            <div className="holiday-header">
              <strong>{h.name}</strong>
              <span className="holiday-date">Month {h.date.month}, Day {h.date.day}</span>
            </div>
            <p>{h.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export { TimelineView, MiniCalendar };
export default TimelineView;
