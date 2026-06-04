import React, { useState, useMemo } from 'react';
import useTimelineStore, { EVENT_TYPES } from '../../store/timelineStore';

const TimelineView = ({ filterLocationId, filterFactionId, filterClassId, compact = false }) => {
  const {
    calendar, events, getEraTimeline, getEventsByType
  } = useTimelineStore();
  const [selectedEra, setSelectedEra] = useState('dimming');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);

  const eraTimeline = useMemo(() => getEraTimeline(), [getEraTimeline]);

  const currentEra = useMemo(
    () => eraTimeline.find((e) => e.id === selectedEra),
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

    return results.sort((a, b) => a.date.year - b.date.year);
  }, [currentEra, filterLocationId, filterFactionId, filterClassId, typeFilter]);

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
              Y{event.date.year}
            </span>
            <strong>{event.title}</strong>
            <p className="world-timeline-desc">{event.description.slice(0, 120)}...</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="world-panel">
      <div className="world-panel-header">
        <h2>Timeline</h2>
        <div className="world-era-tabs">
          {eraTimeline.map((era) => (
            <button
              key={era.id}
              className={`world-era-tab ${selectedEra === era.id ? 'active' : ''}`}
              onClick={() => { setSelectedEra(era.id); setSelectedEvent(null); }}
            >
              {era.name}
              <span className="world-era-count">{era.events.length}</span>
            </button>
          ))}
        </div>
      </div>

      {currentEra && (
        <p className="world-era-desc">{currentEra.description}</p>
      )}

      <div className="world-type-filters">
        <button
          className={`world-type-btn ${!typeFilter ? 'active' : ''}`}
          onClick={() => setTypeFilter(null)}
        >
          All
        </button>
        {Object.entries(eventTypes).map(([key, val]) => (
          <button
            key={key}
            className={`world-type-btn ${typeFilter === key ? 'active' : ''}`}
            onClick={() => setTypeFilter(typeFilter === key ? null : key)}
            title={val.label}
          >
            <i className={`fas fa-${val.icon}`} /> {val.label}
          </button>
        ))}
      </div>

      <div className="world-timeline-layout">
        <div className="world-timeline-list">
          {filteredEvents.length === 0 && (
            <p className="world-muted">No events in this era matching the current filters.</p>
          )}
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`world-timeline-event ${selectedEvent?.id === event.id ? 'selected' : ''}`}
              onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
            >
              <div className="world-timeline-marker">
                <span className={`world-event-dot world-event-${event.type}`} />
                <span className="world-event-line" />
              </div>
              <div className="world-timeline-card">
                <div className="world-timeline-card-header">
                  <span className={`world-badge world-badge-${event.type}`}>
                    {eventTypes[event.type]?.label || event.type}
                  </span>
                  <span className="world-timeline-date">Year {event.date.year}</span>
                </div>
                <h4>{event.title}</h4>
                {selectedEvent?.id === event.id && (
                  <div className="world-timeline-expanded">
                    <p className="world-prose">{event.description}</p>

                    {selectedCausal && selectedCausal.causes.length > 0 && (
                      <div className="world-causal">
                        <strong>Caused by:</strong>
                        {selectedCausal.causes.map((e) => (
                          <span key={e.id} className="world-causal-link">{e.title}</span>
                        ))}
                      </div>
                    )}
                    {selectedCausal && selectedCausal.effects.length > 0 && (
                      <div className="world-causal">
                        <strong>Led to:</strong>
                        {selectedCausal.effects.map((e) => (
                          <span key={e.id} className="world-causal-link">{e.title}</span>
                        ))}
                      </div>
                    )}

                    {event.locationIds && event.locationIds.length > 0 && (
                      <p className="world-card-meta">Locations: {event.locationIds.join(', ')}</p>
                    )}
                    {event.factionIds && event.factionIds.length > 0 && (
                      <p className="world-card-meta">Factions: {event.factionIds.join(', ')}</p>
                    )}
                    {event.classIds && event.classIds.length > 0 && (
                      <p className="world-card-meta">Classes: {event.classIds.join(', ')}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MiniCalendar = () => {
  const { calendar } = useTimelineStore();

  return (
    <div className="world-mini-calendar">
      <h4>Calendar</h4>
      <div className="world-month-grid">
        {calendar.months.map((m) => (
          <div key={m.id} className="world-month-card" title={m.description}>
            <span className="world-month-num">{m.id}</span>
            <span className="world-month-name">{m.name}</span>
          </div>
        ))}
      </div>
      <div className="world-holidays">
        <h4>Holidays</h4>
        {calendar.holidays.map((h) => (
          <div key={h.id} className="world-holiday">
            <strong>{h.name}</strong>
            <span>Month {h.date.month}, Day {h.date.day}</span>
            <p>{h.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export { TimelineView, MiniCalendar };
export default TimelineView;
