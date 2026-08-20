import React, { useState, useMemo } from 'react';
import useTimelineStore, { EVENT_TYPES } from '../../store/timelineStore';
import RichLoreText from '../common/RichLoreText';

const TimelineView = ({ filterLocationId, filterFactionId, filterClassId, compact = false }) => {
  const {
    calendar, events, getEraTimeline, getEventsByType
  } = useTimelineStore();
  const [selectedEra, setSelectedEra] = useState('dimming');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [timelineSearch, setTimelineSearch] = useState('');

  const eraTimeline = useMemo(() => getEraTimeline(), [getEraTimeline]);

  const currentEra = useMemo(
    () => eraTimeline.find((e) => e.id === selectedEra) || eraTimeline[0],
    [eraTimeline, selectedEra]
  );

  const filteredEvents = useMemo(() => {
    let results = currentEra?.events || [];

    if (filterLocationId) {
      results = results.filter((e) => e.locationIds?.includes(filterLocationId));
    }
    if (filterFactionId) {
      results = results.filter((e) => e.factionIds?.includes(filterFactionId));
    }
    if (filterClassId) {
      results = results.filter((e) => e.classIds?.includes(filterClassId));
    }
    if (typeFilter) {
      results = results.filter((e) => e.type === typeFilter);
    }
    if (timelineSearch.trim()) {
      const q = timelineSearch.toLowerCase();
      results = results.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.narrative?.toLowerCase().includes(q)
      );
    }

    return [...results].sort((a, b) => (a.date?.year ?? 0) - (b.date?.year ?? 0));
  }, [currentEra, filterLocationId, filterFactionId, filterClassId, typeFilter, timelineSearch]);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    return events.find((e) => e.id === selectedEventId) || null;
  }, [selectedEventId, events]);

  const selectedCausal = useMemo(() => {
    if (!selectedEvent) return null;
    return useTimelineStore.getState().getCausalChain(selectedEvent.id);
  }, [selectedEvent]);

  const eventTypes = EVENT_TYPES;

  if (compact) {
    return (
      <div className="world-timeline-compact">
        {filteredEvents.slice(0, 8).map((event) => (
          <div key={event.id} className="world-timeline-item">
            <span className="world-timeline-date">
              Y{event.date.year} • {eventTypes[event.type]?.label || event.type}
            </span>
            <strong>{event.title}</strong>
            <p className="world-timeline-desc">{event.description.slice(0, 120)}...</p>
          </div>
        ))}
      </div>
    );
  }

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
              <span className="world-era-count">{era.events.length}</span>
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
          <p className="world-era-desc">{currentEra.description}</p>
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
            All Event Types ({currentEra?.events?.length || 0})
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
          {filteredEvents.length === 0 && (
            <div className="world-timeline-empty">
              <i className="fas fa-scroll"></i>
              <p>No recorded historical events matching your current filters in this era.</p>
            </div>
          )}
          {filteredEvents.map((event) => {
            const isExpanded = selectedEventId === event.id;

            return (
              <div
                key={event.id}
                className={`world-timeline-event ${isExpanded ? 'selected' : ''}`}
                onClick={() => setSelectedEventId(isExpanded ? null : event.id)}
              >
                <div className="world-timeline-marker">
                  <span className={`world-event-dot world-event-${event.type}`} />
                  <span className="world-event-line" />
                </div>
                <div className="world-timeline-card">
                  <div className="world-timeline-card-header">
                    <span className={`world-badge world-badge-${event.type}`}>
                      <i className={`fas fa-${eventTypes[event.type]?.icon || 'bookmark'}`} style={{ marginRight: '4px' }} />
                      {eventTypes[event.type]?.label || event.type}
                    </span>
                    <span className="world-timeline-date">{event.dateDisplay || `Year ${event.date.year}`}</span>
                  </div>

                  <h4>{event.title}</h4>
                  <p className="world-timeline-desc">{event.description}</p>

                  {/* Expanded Deep Narrative & DM Hooks */}
                  {isExpanded && (
                    <div className="world-timeline-expanded" onClick={e => e.stopPropagation()}>
                      {event.narrative && (
                        <div className="timeline-narrative-box">
                          <h5><i className="fas fa-book-journal-whills"></i> Historical Record</h5>
                          <div className="narrative-prose">
                            <RichLoreText text={event.narrative} className="parchment-theme" />
                          </div>
                        </div>
                      )}

                      {event.dmHook && (
                        <div className="timeline-hook-box">
                          <h5><i className="fas fa-key"></i> GM Plot Hook & Secret</h5>
                          <p className="hook-text">{event.dmHook}</p>
                        </div>
                      )}

                      {/* Causal Chains */}
                      {selectedCausal && (selectedCausal.causes.length > 0 || selectedCausal.effects.length > 0) && (
                        <div className="timeline-causal-grid">
                          {selectedCausal.causes.length > 0 && (
                            <div className="world-causal">
                              <strong><i className="fas fa-arrow-left"></i> Catalyzed by:</strong>
                              <div className="causal-links-list">
                                {selectedCausal.causes.map((c) => (
                                  <button
                                    key={c.id}
                                    type="button"
                                    className="world-causal-link"
                                    onClick={() => setSelectedEventId(c.id)}
                                  >
                                    {c.title} ({c.dateDisplay || `Y${c.date.year}`})
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedCausal.effects.length > 0 && (
                            <div className="world-causal">
                              <strong><i className="fas fa-arrow-right"></i> Sparked Consequences:</strong>
                              <div className="causal-links-list">
                                {selectedCausal.effects.map((ef) => (
                                  <button
                                    key={ef.id}
                                    type="button"
                                    className="world-causal-link"
                                    onClick={() => setSelectedEventId(ef.id)}
                                  >
                                    {ef.title} ({ef.dateDisplay || `Y${ef.date.year}`})
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Meta Tags */}
                      <div className="timeline-meta-tags">
                        {event.factionIds && event.factionIds.length > 0 && (
                          <div className="meta-tag-group">
                            <i className="fas fa-shield-halved"></i>
                            <span>Factions: {event.factionIds.join(', ')}</span>
                          </div>
                        )}
                        {event.classIds && event.classIds.length > 0 && (
                          <div className="meta-tag-group">
                            <i className="fas fa-wand-magic-sparkles"></i>
                            <span>Classes: {event.classIds.join(', ')}</span>
                          </div>
                        )}
                        {event.locationIds && event.locationIds.length > 0 && (
                          <div className="meta-tag-group">
                            <i className="fas fa-map-location-dot"></i>
                            <span>Locations: {event.locationIds.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
        <h4><i className="fas fa-star"></i> Sacred Holidays & Observances</h4>
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
