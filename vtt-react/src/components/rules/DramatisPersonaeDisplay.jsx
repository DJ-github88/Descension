import React, { useState } from 'react';
import { RULES_CATEGORIES } from '../../data/rulesData';
import LoreLink from '../common/LoreLink';
import { autoLinkTerminology } from '../../utils/loreAutoLinker';
import './DramatisPersonaeDisplay.css';

// Region accent colours — parchment-theme compatible warm tones
const REGION_ACCENTS = {
  'Frostwood Reach':  { color: '#3a6a7a', bg: 'rgba(58,106,122,0.10)',  icon: 'fas fa-tree',        glyph: '❄' },
  'Nordhalla':        { color: '#4a5a8a', bg: 'rgba(74,90,138,0.10)',  icon: 'fas fa-mountain',    glyph: '⛰' },
  'Sundale':          { color: '#8a1a10', bg: 'rgba(138,26,16,0.10)',  icon: 'fas fa-fire',        glyph: '✦' },
  'Iceheart Sea':     { color: '#1a5a7a', bg: 'rgba(26,90,122,0.10)',  icon: 'fas fa-water',       glyph: '〜' },
  'Cragjaw Peaks':    { color: '#5a3a7a', bg: 'rgba(90,58,122,0.10)',  icon: 'fas fa-mountain',    glyph: '⚙' },
  'Sundrift Vale':    { color: '#7a5a10', bg: 'rgba(122,90,16,0.10)',  icon: 'fas fa-wind',        glyph: '◈' },
  'Bryngloom Forest': { color: '#2a5a1a', bg: 'rgba(42,90,26,0.10)',   icon: 'fas fa-leaf',        glyph: '◉' },
};

const DEFAULT_ACCENT = { color: '#8b4513', bg: 'rgba(139,69,19,0.08)', icon: 'fas fa-user-shield', glyph: '✦' };

// Parse bullet text "• **Name:** description. **Goal:** ..." into structured NPC objects
const parseNpcBlock = (rawText) => {
  if (!rawText) return [];
  // Split on double-newline bullet separators
  const bullets = rawText.split(/\n\n/).filter(b => b.trim().startsWith('•'));
  return bullets.map(bullet => {
    const text = bullet.replace(/^•\s*/, '').trim();

    // Extract name (first **bold** up to the first colon)
    const nameMatch = text.match(/^\*\*(.+?):\*\*/);
    const name = nameMatch ? nameMatch[1].trim() : 'Unknown';

    // Strip name from remainder
    const remainder = nameMatch ? text.slice(nameMatch[0].length).trim() : text;

    // Extract tagged fields
    const extractField = (fieldName) => {
      const rx = new RegExp(`\\*\\*${fieldName}:\\*\\*\\s*(.+?)(?=\\*\\*[A-Z][a-zA-Z]+:\\*\\*|$)`, 's');
      const m = remainder.match(rx);
      return m ? m[1].trim().replace(/\s+/g, ' ') : null;
    };

    // Description is everything before the first **Goal:**
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

// Render a string with LoreLink markup
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

// Single NPC card
const NpcCard = ({ npc, accent }) => {
  const [secretRevealed, setSecretRevealed] = useState(false);

  return (
    <div className="npc-card" style={{ '--accent': accent.color, '--accent-bg': accent.bg }}>
      {/* Portrait area */}
      <div className="npc-portrait">
        <div className="npc-portrait-circle">
          <i className="fas fa-user-secret" />
        </div>
        <div className="npc-sigil">{accent.glyph}</div>
      </div>

      {/* Main body */}
      <div className="npc-body">
        <h4 className="npc-name">{npc.name}</h4>
        {npc.description && (
          <p className="npc-description">{renderLore(npc.description)}</p>
        )}

        <div className="npc-pillars">
          {npc.goal && (
            <div className="npc-pillar npc-pillar--goal">
              <span className="npc-pillar-label">
                <i className="fas fa-bullseye" /> Goal
              </span>
              <p className="npc-pillar-text">{renderLore(npc.goal)}</p>
            </div>
          )}

          {npc.conflict && (
            <div className="npc-pillar npc-pillar--conflict">
              <span className="npc-pillar-label">
                <i className="fas fa-swords" /> Conflict
              </span>
              <p className="npc-pillar-text">{renderLore(npc.conflict)}</p>
            </div>
          )}

          {npc.secret && (
            <div className="npc-pillar npc-pillar--secret">
              <span className="npc-pillar-label">
                <i className="fas fa-eye-slash" /> Secret
                <button
                  className="npc-secret-toggle"
                  onClick={() => setSecretRevealed(r => !r)}
                  title={secretRevealed ? 'Conceal secret' : 'Reveal secret (GM only)'}
                >
                  {secretRevealed ? 'Conceal' : 'Reveal'}
                </button>
              </span>
              <p className={`npc-pillar-text npc-secret-text ${secretRevealed ? 'revealed' : ''}`}>
                {secretRevealed ? renderLore(npc.secret) : '████████████████████████████'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Region group — header bar + NPC cards
const RegionGroup = ({ section }) => {
  // Derive region name from section title like "Frostwood Reach (Greymark Keep)"
  const regionName = section.title.replace(/\s*\(.*?\)/, '').trim();
  const subtitle = (() => { const m = section.title.match(/\((.+?)\)/); return m ? m[1] : null; })();
  const accent = REGION_ACCENTS[regionName] || DEFAULT_ACCENT;
  const npcs = parseNpcBlock(section.content);

  return (
    <div className="npc-region-group" style={{ '--accent': accent.color, '--accent-bg': accent.bg }}>
      <div className="npc-region-header">
        <div className="npc-region-icon">
          <i className={accent.icon} />
        </div>
        <div className="npc-region-title-block">
          <h3 className="npc-region-title">{regionName}</h3>
          {subtitle && <span className="npc-region-subtitle">{subtitle}</span>}
        </div>
        <div className="npc-region-count">{npcs.length} Figure{npcs.length !== 1 ? 's' : ''}</div>
      </div>

      <div className="npc-card-grid">
        {npcs.map((npc, i) => (
          <NpcCard key={i} npc={npc} accent={accent} />
        ))}
      </div>
    </div>
  );
};

const DramatisPersonaeDisplay = () => {
  const worldLore = RULES_CATEGORIES.find(c => c.id === 'world-lore');
  const sub = worldLore?.subcategories?.find(s => s.id === 'dramatis-personae');
  const sections = sub?.content?.sections || [];

  return (
    <div className="dramatis-personae-display">
      {/* Hero */}
      <div className="dp-hero">
        <div className="dp-hero-ornament">✦</div>
        <h2 className="dp-hero-title">Dramatis Personae</h2>
        <p className="dp-hero-subtitle">
          The living agents of Mythrill's sunless world — those who scheme, survive, and drive the fate of nations.
        </p>
        <div className="dp-hero-tip">
          <i className="fas fa-eye-slash" /> Click <strong>Reveal</strong> on any NPC card to unlock their hidden secret (GM only)
        </div>
      </div>

      {/* Region groups */}
      <div className="dp-regions">
        {sections.map((section, i) => (
          <RegionGroup key={i} section={section} />
        ))}
      </div>
    </div>
  );
};

export default DramatisPersonaeDisplay;
