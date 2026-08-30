import React, { useEffect, useRef, useState } from 'react';
import TooltipPortal from '../tooltips/TooltipPortal';
import { ALL_CLASSES_DATA } from '../../data/classes';
import '../../styles/LoreTooltip.css';

const entryIcons = {
  noble_house: 'fas fa-flag',
  region: 'fas fa-map-marked-alt',
  historical_figure: 'fas fa-user-shield',
  race: 'fas fa-users',
  class: 'fas fa-hat-wizard',
  resource: 'fas fa-fire-alt',
  event: 'fas fa-hourglass-half',
  creature: 'fas fa-spider',
  cultural_practice: 'fas fa-scroll',
  concept: 'fas fa-code-branch',
  location: 'fas fa-map-pin'
};

const regionColors = {
  'frostwood-reach': '#3d6e90',
  'nordhalla': '#5c829e',
  'sundale': '#b23c1e',
  'iceheart-sea': '#1a3a6e',
  'cragjaw-peaks': '#3a1a5e',
  'sundrift-vale': '#9a6e10',
  'bryngloom-forest': '#2b5e1a'
};

const statusStyle = {
  banned:        { label: 'Forbidden',   color: '#a12323' },
  outlawed:      { label: 'Proscribed',  color: '#a12323' },
  persecuted:    { label: 'Persecuted',  color: '#b23c1e' },
  distrusted:    { label: 'Distrusted',  color: '#c48b1e' },
  valued:        { label: 'Valued',      color: '#2d8552' },
  celebrated:    { label: 'Celebrated',  color: '#2d8552' },
  'celebrated-and-divided': { label: 'Celebrated and Divided', color: '#c48b1e' }
};

const stripTags = (s = '') => String(s).replace(/<[^>]+>/g, '');
const prettify = (id = '') => id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const LoreTooltip = ({ entry, position, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReception, setShowReception] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (e.target.closest('.lore-action-btn')) return;
      onClose();
    };
    const timer = setTimeout(() => {
      document.addEventListener('click', handleGlobalClick);
    }, 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [onClose]);

  if (!entry) return null;

  const iconClass = entryIcons[entry.type] || 'fas fa-book';
  const regionAccent = regionColors[entry.region] || '#8f6f35';
  const displayType = entry.type.replace('_', ' ');
  const isClass = entry.type === 'class';
  const isConcept = entry.type === 'concept';

  const classData = isClass ? Object.values(ALL_CLASSES_DATA).find(c => c.id === entry.id) : null;
  const worldFriction = classData?.worldFriction;
  const secondary = entry.secondaryRegions && entry.secondaryRegions.length ? entry.secondaryRegions : null;
  const transition = isConcept ? entry.transition : null;

  const badgeStyle = {
    display: 'inline-block', padding: '1px 7px', borderRadius: '10px',
    fontSize: '0.72rem', fontWeight: 700, color: '#fff', marginRight: '6px', textTransform: 'capitalize'
  };
  const sectionLabel = {
    fontFamily: "'Cinzel', serif",
    fontSize: '0.68rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#8f6f35',
    marginTop: '12px',
    marginBottom: '4px',
    fontWeight: 700
  };

  return (
    <TooltipPortal>
      <div className="lore-tooltip-overlay" onClick={onClose} />
      <div
        ref={tooltipRef}
        className="lore-tooltip-wrapper center-modal"
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2147483647
        }}
      >
        <div
          className="lore-parchment"
          style={{ '--region-accent': regionAccent }}
        >
          <div className="lore-tooltip-header">
            <div className="lore-type-icon">
              <i className={iconClass} />
            </div>
            <div className="lore-title-section">
              <div className="lore-title">{entry.term}</div>
              <div className="lore-subtitle">{displayType}</div>
            </div>
          </div>

          <div className="lore-tooltip-body">
            <div className="lore-summary">
              {entry.summary}
            </div>

            {isClass && secondary && (
              <div style={{ fontSize: '0.8rem', marginTop: '8px', color: '#5d4037' }}>
                <i className="fas fa-globe" style={{ marginRight: '5px', color: regionAccent }} />
                Also practiced in: {secondary.map(prettify).join(', ')}
              </div>
            )}

            {isClass && entry.nativeWeaving && (
              <>
                <div style={sectionLabel}>Native Weaving</div>
                <div style={{ fontSize: '0.8rem', lineHeight: 1.5, color: '#3d2a17', fontFamily: "'Crimson Text', serif" }}>
                  {stripTags(entry.nativeWeaving).split(/\*\*/).map((seg, i) =>
                    i % 2 === 1
                      ? <strong key={i} style={{ color: regionAccent }}>{seg}</strong>
                      : <span key={i}>{seg}</span>
                  )}
                </div>
              </>
            )}

            {isConcept && transition && (
              <>
                <div className="lore-divider" />
                <div style={sectionLabel}>Aftermath of the Merger</div>
                {transition.aftermath && <div style={{ fontSize: '0.84rem', color: '#3d2a17', marginBottom: '6px', lineHeight: 1.5 }}>{stripTags(transition.aftermath)}</div>}
                {transition.legacySite && (
                  <div style={{ fontSize: '0.8rem', color: '#5d4037', marginBottom: '6px' }}>
                    <i className="fas fa-map-pin" style={{ marginRight: '5px', color: regionAccent }} />
                    {stripTags(transition.legacySite)}
                  </div>
                )}
                {transition.survivorNote && (
                  <div style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#6d4c41', lineHeight: 1.5 }}>
                    {stripTags(transition.survivorNote)}
                  </div>
                )}
              </>
            )}

            {entry.fullEntry && (
              <>
                <div className="lore-divider" />
                <div className={`lore-full-entry ${isExpanded ? 'expanded' : ''}`}>
                  {entry.fullEntry}
                </div>
                <button
                  className={`lore-action-btn ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? 'Show Less' : 'Read More'}
                  <i className="fas fa-chevron-down" />
                </button>
              </>
            )}

            {isClass && worldFriction && worldFriction.length > 0 && (
              <>
                <div className="lore-divider" />
                <button
                  className="lore-action-btn"
                  onClick={() => setShowReception(!showReception)}
                  style={{ width: '100%', textAlign: 'left' }}
                >
                  <i className="fas fa-bullhorn" style={{ marginRight: '6px' }} />
                  Reception in the World
                  <i className="fas fa-chevron-down" style={{ marginLeft: '6px', transition: 'transform .2s', transform: showReception ? 'rotate(180deg)' : 'none' }} />
                </button>
                {showReception && (
                  <div style={{ marginTop: '8px' }}>
                    {worldFriction.map((wf, i) => {
                      const st = statusStyle[wf.status] || { label: wf.status, color: '#888888' };
                      return (
                        <div key={i} style={{ marginBottom: '8px', fontSize: '0.82rem', lineHeight: 1.45 }}>
                          <span style={{ ...badgeStyle, backgroundColor: st.color }}>{st.label}</span>
                          <span style={{ color: '#6d4c41', fontFamily: "'Cinzel', serif", fontSize: '0.74rem', fontWeight: 600 }}>{prettify(wf.region)}{wf.location ? ` · ${prettify(wf.location)}` : ''}</span>
                          <div style={{ color: '#3d2a17', marginTop: '3px', fontFamily: "'Crimson Text', serif" }}>{stripTags(wf.consequence)}</div>
                          {wf.workaround && (
                            <div style={{ color: '#6d4c41', fontStyle: 'italic', marginTop: '3px', fontSize: '0.8rem' }}>
                              <i className="fas fa-user-secret" style={{ marginRight: '4px', color: regionAccent }} />{stripTags(wf.workaround)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </TooltipPortal>
  );
};

export default LoreTooltip;
