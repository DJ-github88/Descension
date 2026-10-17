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
  'frostwood-reach': '#3a5870',
  'nordhalla': '#48667a',
  'sundale': '#682317',
  'iceheart-sea': '#2c4866',
  'cragjaw-peaks': '#4d365e',
  'sundrift-vale': '#6e5224',
  'bryngloom-forest': '#2d5234'
};

const statusStyle = {
  banned:                   { label: 'Forbidden',              tone: 'hostile' },
  outlawed:                 { label: 'Proscribed',             tone: 'hostile' },
  hunted:                   { label: 'Hunted',                 tone: 'hostile' },
  persecuted:               { label: 'Persecuted',             tone: 'hostile' },
  feared:                   { label: 'Feared',                 tone: 'caution' },
  restricted:               { label: 'Restricted',             tone: 'caution' },
  distrusted:               { label: 'Distrusted',             tone: 'caution' },
  monitored:                { label: 'Monitored',              tone: 'caution' },
  exploited:                { label: 'Exploited',              tone: 'caution' },
  tolerated:                { label: 'Tolerated',              tone: 'neutral' },
  accepted:                 { label: 'Accepted',               tone: 'favored' },
  valued:                   { label: 'Valued',                 tone: 'favored' },
  celebrated:               { label: 'Celebrated',             tone: 'favored' },
  revered:                  { label: 'Revered',                tone: 'favored' },
  venerated:                { label: 'Venerated',              tone: 'favored' },
  'celebrated-and-divided': { label: 'Celebrated & Divided',   tone: 'caution' }
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
      if (e.target.closest('.lore-action-btn') || e.target.closest('.lore-close-btn')) return;
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
  const regionAccent = regionColors[entry.region] || '#682317';
  const displayType = entry.type.replace(/_/g, ' ');
  const isClass = entry.type === 'class';
  const isConcept = entry.type === 'concept';

  const classData = isClass ? Object.values(ALL_CLASSES_DATA).find(c => c.id === entry.id) : null;
  const worldFriction = classData?.worldFriction;
  const secondary = entry.secondaryRegions && entry.secondaryRegions.length ? entry.secondaryRegions : null;
  const transition = isConcept ? entry.transition : null;

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
            <button
              type="button"
              className="lore-close-btn"
              onClick={onClose}
              aria-label="Close codex entry"
              title="Close (Esc)"
            >
              <i className="fas fa-times" />
            </button>
          </div>

          <div className="lore-tooltip-body">
            <div className="lore-summary">
              {entry.summary}
            </div>

            {isClass && secondary && (
              <div className="lore-secondary-regions">
                <i className="fas fa-globe" />
                <span>Also practiced in: <strong>{secondary.map(prettify).join(', ')}</strong></span>
              </div>
            )}

            {isClass && entry.nativeWeaving && (
              <div className="lore-section-block">
                <div className="lore-section-heading">Native Weaving</div>
                <div className="lore-native-weaving">
                  {stripTags(entry.nativeWeaving).split(/\*\*/).map((seg, i) =>
                    i % 2 === 1
                      ? <strong key={i} className="lore-inline-term">{seg}</strong>
                      : <span key={i}>{seg}</span>
                  )}
                </div>
              </div>
            )}

            {isConcept && transition && (
              <div className="lore-section-block">
                <div className="lore-divider" />
                <div className="lore-section-heading">Aftermath of the Merger</div>
                {transition.aftermath && (
                  <div className="lore-transition-text">{stripTags(transition.aftermath)}</div>
                )}
                {transition.legacySite && (
                  <div className="lore-secondary-regions">
                    <i className="fas fa-map-pin" />
                    <span>{stripTags(transition.legacySite)}</span>
                  </div>
                )}
                {transition.survivorNote && (
                  <div className="lore-survivor-note">
                    {stripTags(transition.survivorNote)}
                  </div>
                )}
              </div>
            )}

            {(entry.fullEntry || (isClass && worldFriction && worldFriction.length > 0)) && (
              <div className="lore-divider" />
            )}

            {entry.fullEntry && (
              <div className="lore-expand-group">
                <div className={`lore-full-entry ${isExpanded ? 'expanded' : ''}`}>
                  {entry.fullEntry}
                </div>
                <button
                  type="button"
                  className={`lore-action-btn ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <span>{isExpanded ? 'Fold Chronicle' : 'Read Full Chronicle'}</span>
                  <i className="fas fa-chevron-down" />
                </button>
              </div>
            )}

            {isClass && worldFriction && worldFriction.length > 0 && (
              <div className="lore-reception-group">
                <button
                  type="button"
                  className={`lore-action-btn lore-reception-toggle ${showReception ? 'expanded' : ''}`}
                  onClick={() => setShowReception(!showReception)}
                >
                  <span className="lore-btn-left">
                    <i className="fas fa-scroll" />
                    <span>Reception in the World</span>
                  </span>
                  <i className="fas fa-chevron-down lore-chevron" />
                </button>
                {showReception && (
                  <div className="lore-reception-list">
                    {worldFriction.map((wf, i) => {
                      const rawKey = String(wf.status || '').toLowerCase();
                      const st = statusStyle[rawKey] || { label: prettify(rawKey || 'Noted'), tone: 'neutral' };
                      return (
                        <div key={i} className="lore-reception-item">
                          <div className="lore-reception-header">
                            <span className={`lore-status-stamp tone-${st.tone}`}>{st.label}</span>
                            <span className="lore-reception-region">
                              {prettify(wf.region)}{wf.location ? ` · ${prettify(wf.location)}` : ''}
                            </span>
                          </div>
                          <div className="lore-reception-consequence">{stripTags(wf.consequence)}</div>
                          {wf.workaround && (
                            <div className="lore-reception-workaround">
                              <i className="fas fa-feather-alt" />
                              <span>{stripTags(wf.workaround)}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipPortal>
  );
};

export default LoreTooltip;
