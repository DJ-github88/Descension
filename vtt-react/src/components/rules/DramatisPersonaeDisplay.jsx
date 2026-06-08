import React, { useState, useRef, useMemo, useCallback } from 'react';
import { RULES_CATEGORIES } from '../../data/rulesData';
import LoreLink from '../common/LoreLink';
import { autoLinkTerminology } from '../../utils/loreAutoLinker';
import './DramatisPersonaeDisplay.css';

const REGION_ACCENTS = {
  'Frostwood Reach':  { color: '#3a6a7a', bg: 'rgba(58,106,122,0.10)',  icon: 'fas fa-tree',        glyph: '\u2744' },
  'Nordhalla':        { color: '#4a5a8a', bg: 'rgba(74,90,138,0.10)',  icon: 'fas fa-mountain',    glyph: '\u26F0' },
  'Sundale':          { color: '#8a1a10', bg: 'rgba(138,26,16,0.10)',  icon: 'fas fa-fire',        glyph: '\u2726' },
  'Iceheart Sea':     { color: '#1a5a7a', bg: 'rgba(26,90,122,0.10)',  icon: 'fas fa-water',       glyph: '\u301C' },
  'Cragjaw Peaks':    { color: '#5a3a7a', bg: 'rgba(90,58,122,0.10)',  icon: 'fas fa-mountain',    glyph: '\u2699' },
  'Sundrift Vale':    { color: '#7a5a10', bg: 'rgba(122,90,16,0.10)',  icon: 'fas fa-wind',        glyph: '\u25C8' },
  'Bryngloom Forest': { color: '#2a5a1a', bg: 'rgba(42,90,26,0.10)',   icon: 'fas fa-leaf',        glyph: '\u25C9' },
};

const DEFAULT_ACCENT = { color: '#8b4513', bg: 'rgba(139,69,19,0.08)', icon: 'fas fa-user-shield', glyph: '\u2726' };

const parseNpcBlock = (rawText) => {
  if (!rawText) return [];
  const bullets = rawText.split(/\n\n/).filter(b => b.trim().startsWith('\u2022'));
  return bullets.map(bullet => {
    const text = bullet.replace(/^\u2022\s*/, '').trim();

    const nameMatch = text.match(/^\*\*(.+?):\*\*/);
    const name = nameMatch ? nameMatch[1].trim() : 'Unknown';

    const remainder = nameMatch ? text.slice(nameMatch[0].length).trim() : text;

    const extractField = (fieldName) => {
      const rx = new RegExp(`\\*\\*${fieldName}:\\*\\*\\s*(.+?)(?=\\*\\*[A-Z][a-zA-Z]+:\\*\\*|$)`, 's');
      const m = remainder.match(rx);
      return m ? m[1].trim().replace(/\s+/g, ' ') : null;
    };

    const descMatch = remainder.match(/^(.+?)(?=\*\*Goal:\*\*|\*\*Secret:\*\*|\*\*Conflict:\*\*|$)/s);
    const description = descMatch ? descMatch[1].trim() : remainder;

    return {
      name,
      description,
      goal:     extractField('Goal'),
      secret:   extractField('Secret'),
      conflict: extractField('Conflict'),
    };
  });
};

const renderLore = (text) => {
  if (!text) return null;
  const processed = autoLinkTerminology(text);
  const regex = /(<LoreLink termId="([^"]+)">([\s\S]*?)<\/LoreLink>)/g;
  const result = [];
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(processed)) !== null) {
    if (match.index > lastIndex) result.push(processed.substring(lastIndex, match.index));
    result.push(<LoreLink key={`ll-${key++}`} termId={match[2]}>{match[3]}</LoreLink>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < processed.length) result.push(processed.substring(lastIndex));
  return result.length ? result : text;
};

const NpcCard = ({ npc, accent }) => {
  const [secretRevealed, setSecretRevealed] = useState(false);

  return (
    <div className="dp-npc-card" style={{ '--accent': accent.color, '--accent-bg': accent.bg }}>
      <div className="dp-npc-card-header">
        <div className="dp-npc-card-icon" style={{ borderColor: accent.color, color: accent.color }}>
          {npc.name.charAt(0)}
        </div>
        <h4 className="dp-npc-card-name">{npc.name}</h4>
      </div>

      {npc.description && (
        <p className="dp-npc-card-desc">{renderLore(npc.description)}</p>
      )}

      <div className="dp-npc-pillars">
        {npc.goal && (
          <div className="dp-npc-pillar dp-npc-pillar--goal">
            <span className="dp-npc-pillar-label">
              <i className="fas fa-bullseye" /> Goal
            </span>
            <p className="dp-npc-pillar-text">{renderLore(npc.goal)}</p>
          </div>
        )}

        {npc.conflict && (
          <div className="dp-npc-pillar dp-npc-pillar--conflict">
            <span className="dp-npc-pillar-label">
              <i className="fas fa-crossed-swords" /> Conflict
            </span>
            <p className="dp-npc-pillar-text">{renderLore(npc.conflict)}</p>
          </div>
        )}

        {npc.secret && (
          <div className="dp-npc-pillar dp-npc-pillar--secret">
            <span className="dp-npc-pillar-label">
              <i className="fas fa-eye-slash" /> Secret
              <button
                className="dp-secret-toggle"
                onClick={() => setSecretRevealed(r => !r)}
                title={secretRevealed ? 'Conceal secret' : 'Reveal secret (GM only)'}
              >
                {secretRevealed ? 'Conceal' : 'Reveal'}
              </button>
            </span>
            <p className={`dp-npc-pillar-text dp-secret-text ${secretRevealed ? 'revealed' : ''}`}>
              {secretRevealed ? renderLore(npc.secret) : '\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const DramatisPersonaeDisplay = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState(null);
  const sectionRefs = useRef({});
  const mainRef = useRef(null);

  const worldLore = RULES_CATEGORIES.find(c => c.id === 'world-lore');
  const sub = worldLore?.subcategories?.find(s => s.id === 'dramatis-personae');
  const sections = sub?.content?.sections || [];

  const regionData = useMemo(() => {
    return sections.map((section, index) => {
      const regionName = section.title.replace(/\s*\(.*?\)/, '').trim();
      const subtitle = (() => { const m = section.title.match(/\((.+?)\)/); return m ? m[1] : null; })();
      const accent = REGION_ACCENTS[regionName] || DEFAULT_ACCENT;
      const npcs = parseNpcBlock(section.content);
      return { regionName, subtitle, accent, npcs, index };
    });
  }, [sections]);

  const filteredRegions = useMemo(() => {
    if (!searchQuery.trim()) return regionData;
    const q = searchQuery.toLowerCase();
    return regionData.map(region => ({
      ...region,
      npcs: region.npcs.filter(npc =>
        npc.name.toLowerCase().includes(q) ||
        (npc.description && npc.description.toLowerCase().includes(q)) ||
        (npc.goal && npc.goal.toLowerCase().includes(q)) ||
        (npc.secret && npc.secret.toLowerCase().includes(q)) ||
        (npc.conflict && npc.conflict.toLowerCase().includes(q))
      ),
    })).filter(region => region.npcs.length > 0);
  }, [regionData, searchQuery]);

  const totalNpcs = useMemo(() =>
    regionData.reduce((sum, r) => sum + r.npcs.length, 0),
    [regionData]
  );

  const scrollToRegion = useCallback((regionName) => {
    setActiveRegion(regionName);
    const el = sectionRefs.current[regionName];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="dp-display">
      <div className="dp-layout">
        <aside className="dp-sidebar">
          <h3 className="dp-sidebar-title">
            Regions <span className="dp-sidebar-count">{totalNpcs}</span>
          </h3>

          <div className="dp-search-wrapper">
            <i className="fas fa-search dp-search-icon" />
            <input
              type="text"
              className="dp-search-input"
              placeholder="Search figures..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <ul className="dp-region-list">
            {regionData.map(region => {
              const isActive = activeRegion === region.regionName;
              const isFiltered = filteredRegions.some(fr => fr.regionName === region.regionName);
              return (
                <li
                  key={region.regionName}
                  className={`dp-region-item ${isActive ? 'active' : ''} ${!isFiltered && searchQuery ? 'dimmed' : ''}`}
                  onClick={() => scrollToRegion(region.regionName)}
                >
                  <span className="dp-region-icon">
                    <i className={region.accent.icon} />
                  </span>
                  <div className="dp-region-info">
                    <span className="dp-region-name">{region.regionName}</span>
                    {region.subtitle && <span className="dp-region-subtitle">{region.subtitle}</span>}
                  </div>
                  <span className="dp-region-count">{region.npcs.length}</span>
                </li>
              );
            })}
          </ul>

          <div className="dp-sidebar-tip">
            <i className="fas fa-eye-slash" />
            <span>Click <strong>Reveal</strong> on any card to unlock GM secrets</span>
          </div>
        </aside>

        <div className="dp-content" ref={mainRef}>
          {filteredRegions.length === 0 && (
            <div className="dp-no-results">
              <i className="fas fa-search" />
              <p>No figures match "{searchQuery}"</p>
            </div>
          )}

          {filteredRegions.map(region => (
            <div
              key={region.regionName}
              ref={el => { sectionRefs.current[region.regionName] = el; }}
              className="dp-region-section"
              id={`region-${region.index}`}
            >
              <div className="dp-region-header" style={{ '--accent': region.accent.color }}>
                <div className="dp-region-header-icon">
                  <i className={region.accent.icon} />
                </div>
                <div className="dp-region-header-text">
                  <h3 className="dp-region-header-name">{region.regionName}</h3>
                  {region.subtitle && <span className="dp-region-header-subtitle">{region.subtitle}</span>}
                </div>
                <span className="dp-region-header-count">{region.npcs.length} Figure{region.npcs.length !== 1 ? 's' : ''}</span>
              </div>

              <div className="dp-card-grid">
                {region.npcs.map((npc, i) => (
                  <NpcCard key={i} npc={npc} accent={region.accent} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DramatisPersonaeDisplay;
