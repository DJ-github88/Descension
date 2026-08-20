import React, { useState, useEffect } from 'react';
import './TimelineDisplay.css';
import useTimelineStore from '../../store/timelineStore';

const EVENT_ART_MAP = {};

const getEventArt = (title) => {
 const matchedKey = Object.keys(EVENT_ART_MAP).find(k => title.toLowerCase().includes(k.toLowerCase()));
 return matchedKey ? EVENT_ART_MAP[matchedKey] : null;
};

const TimelineDisplay = () => {
 const E = useTimelineStore(state => state.getEraTimeline());
 const [showDMNotes, setShowDMNotes] = useState(false);
 const [expandedEras, setExpandedEras] = useState(E.map(() => true));

 useEffect(() => {
  setExpandedEras(E.map(() => true));
 }, [E]);

 const toggleEra = (idx) => {
  const next = [...expandedEras];
  next[idx] = !next[idx];
  setExpandedEras(next);
 };

 const runicDiamond = '\u25C6';
 const publicUrl = process.env.PUBLIC_URL || '';

 return (
    <div className="timeline-container">
      {/* -- Header -- */}
      <div className="timeline-header">
        <div className="timeline-header-line top" />
        <h2 className="timeline-title">
          The Chronicle of the Sundering
        </h2>
        <div className="timeline-subtitle">
          <span className="timeline-diamonds">{runicDiamond}{runicDiamond}{runicDiamond}</span>
          <span className="timeline-subtitle-text">
            From the First Stars to the Freezing Era
          </span>
          <span className="timeline-diamonds">{runicDiamond}{runicDiamond}{runicDiamond}</span>
        </div>
        <div className="timeline-header-line bottom" />
      </div>

      {/* -- DM Toggle -- */}
      <div className="timeline-gm-toggle-container">
        <span className="timeline-gm-toggle-status">
          {showDMNotes ? 'GM Insights Revealed' : 'GM Insights Hidden'}
        </span>
        <button
          onClick={() => setShowDMNotes(!showDMNotes)}
          className={`timeline-gm-toggle-btn ${showDMNotes ? 'active' : ''}`}
        >
          <i className={showDMNotes ? 'fas fa-eye' : 'fas fa-eye-slash'} style={{ marginRight: '6px' }} />
          {showDMNotes ? 'HIDE GM NOTES' : 'SHOW GM NOTES'}
        </button>
      </div>

      {/* -- Timeline -- */}
      <div className="timeline-spine-wrapper">
        {/* Elegant Gold-and-Iron Spine */}
        <div className="timeline-spine" />

        {E.map((era, ei) => {
          const expanded = expandedEras[ei];
          const isLast = ei === E.length - 1;

          return (
            <div key={ei} className={`timeline-era-block ${isLast ? 'last' : ''}`}>
              {/* Era plaque header */}
              <div
                onClick={() => toggleEra(ei)}
                className="timeline-era-header"
              >
                {/* Custom Wax-Sealed Node */}
                <div className={`timeline-era-node ${expanded ? 'expanded' : ''}`}>
                  <span className="timeline-era-node-icon">
                    {expanded ? runicDiamond : '\u25B8'}
                  </span>
                </div>

                <div className="timeline-era-title-container">
                  <h3 className="timeline-era-title">
                    {era.name}
                    {era.span && (
                      <span className="timeline-era-span">
                        : {era.span}
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              {/* Collapsible era content */}
              {expanded && (
                <div className="timeline-era-content">
                  {/* Era narrative quote */}
                  {era.quote && era.quote.trim() !== '' && (
                    <div className="timeline-era-quote">
                      <p>&ldquo;{era.quote}&rdquo;</p>
                    </div>
                  )}

                  {/* GM Overview */}
                  {showDMNotes && era.dmOverview && (
                    <div className="timeline-gm-overview">
                      <span className="timeline-gm-overview-label">
                        GM ARCHIVAL INSIGHT
                      </span>
                      <p className="timeline-gm-overview-text">
                        {era.dmOverview}
                      </p>
                    </div>
                  )}

                  {/* Event cards list */}
                  <div className="timeline-events-list">
                    {era.events.map((ev, ei2) => {
                      const artImage = getEventArt(ev.title);
                      const dateStr = ev.dateDisplay || (ev.date && typeof ev.date === 'object' ? `Year ${ev.date.year}` : ev.date) || '';
                      const narrativeText = ev.narrative || ev.description || '';

                      return (
                        <div key={ei2} className="timeline-card">
                          <div className="timeline-card-header">
                            <h4 className="timeline-card-title">{ev.title}</h4>
                            {dateStr && <span className="timeline-card-date">{dateStr}</span>}
                          </div>
                          <div className="timeline-card-body">
                            {artImage && (
                              <div className="timeline-art-container">
                                <img 
                                  src={`${publicUrl}/assets/images/${artImage}`} 
                                  alt={ev.title} 
                                  className="timeline-art" 
                                />
                              </div>
                            )}
                            <p className="timeline-card-text" dangerouslySetInnerHTML={{
                              __html: narrativeText.replace(
                                /\*\*(.*?)\*\*/g,
                                '<strong>$1</strong>'
                              )
                            }} />
                          </div>

                          {/* GM Hook */}
                          {showDMNotes && ev.dmHook && (
                            <div className="timeline-gm-hook">
                              <span className="timeline-gm-hook-label">
                                CAMPAIGN HOOK
                              </span>
                              <p className="timeline-gm-hook-text">
                                {ev.dmHook}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* -- Footer Quote -- */}
      <div className="timeline-footer-quote">
        <p>
          &ldquo;Sol cannot wake. Sol cannot die. Sol is being eaten from within.&rdquo;
          <br />
          <span className="timeline-footer-author">
            : Elder Thaeron, Sun-Speaker of the Harath-Vault
          </span>
        </p>
      </div>
    </div>
 );
};
export default TimelineDisplay;
