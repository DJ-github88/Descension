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

const NPC_PORTRAITS = {
  'Sentinel-Commander Vaelen Greymark': {
    url: '/assets/images/portraits/vaelen_greymark.png',
    caption: 'Sentinel-Commander Vaelen Greymark in heavy steel plate armor, guarding Greymark Keep.'
  },
  'Sylvain of the Unwoven': {
    url: '/assets/images/portraits/sylvain_unwoven.png',
    caption: 'Sylvain of the Unwoven, a Briaran rebel leader with a prosthetic wooden arm containing a bound soul.'
  },
  'Jarl Eirik Skalvyr': {
    url: '/assets/images/portraits/eirik_skalvyr.png',
    caption: 'Jarl Eirik Skalvyr clad in thick mammoth-furs, holding a carved frost-axe.'
  },
  'High-Oracle Skari': {
    url: '/assets/images/portraits/oracle_skari.png',
    caption: 'High-Oracle Skari, the blind Skald record-keeper with a blindfold over his eyes, wearing fur robes.'
  },
  'Mara of the Badlands': {
    url: '/assets/images/portraits/mara_badlands.png',
    caption: 'Mara of the Badlands, a cynical female ranger with outdoor gear and a leather cloak.'
  },
  'Synod-Broker Lyra': {
    url: '/assets/images/portraits/broker_lyra.png',
    caption: 'Synod-Broker Lyra, the silver-skinned Neth merchant noble with crystalline markings.'
  },
  'Guild-Master Fexric Keth': {
    url: '/assets/images/portraits/fexric_keth.png',
    caption: 'Guild-Master Fexric Keth, a Fexric dwarf engineer with a clockwork eye-graft wearing an alchemical leather vest.'
  },
  'Arch-Sun Speaker Kaelen': {
    url: '/assets/images/portraits/sun_kaelen.png',
    caption: 'Arch-Sun Speaker Kaelen, the dogmatic golden-robed priest of the Sol-Vigil.'
  },
  'Captain Mereval': {
    url: '/assets/images/portraits/captain_mereval.png',
    caption: 'Captain Mereval, his weather-beaten skin covered in shining silver contracts.'
  },
  'Toll-Leader Ithra Groven': {
    url: '/assets/images/portraits/ithra_groven.png',
    caption: 'Toll-Leader Ithra Groven, a smooth pale-scaled Groven diplomat guarding the Ancestor-Spans.'
  },
  'Khan Orda of the Mound-Camps': {
    url: '/assets/images/portraits/khan_orda.png',
    caption: 'Khan Orda, the nomadic chieftain leading the horse-clans through gravity-storms.'
  },
  'Grand Exemplar Vaelen': {
    url: '/assets/images/portraits/exemplar_vaelen.png',
    caption: 'Grand Exemplar Vaelen, the crystalline Astril leader reflecting star-glass light.'
  },
  'Sister Vraka': {
    url: '/assets/images/portraits/sister_vraka.png',
    caption: 'Sister Vraka of the Vreken rebels, her cowl shadowing glowing red eyes.'
  }
};

const parseNpcBlock = (rawText) => {
  if (!rawText) return [];
  const lines = rawText.split('\n');
  const bullets = [];
  let current = null;
  for (const line of lines) {
    if (line.trim().startsWith('- **')) {
      if (current !== null) bullets.push(current);
      current = line.trim().replace(/^-\s*/, '');
    } else if (current !== null && line.trim()) {
      current += ' ' + line.trim();
    }
  }
  if (current !== null) bullets.push(current);

  return bullets.map(text => {
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
  }).filter(npc => npc.goal || npc.secret || npc.conflict);
};

// Parse Street-Level Contacts block
const parseContactsBlock = (rawText) => {
  if (!rawText) return [];
  const groups = [];
  let currentGroup = null;

  const lines = rawText.split('\n');
  for (const line of lines) {
    const regionMatch = line.match(/^\*\*(.+?):\*\*\s*$/);
    if (regionMatch) {
      if (currentGroup) groups.push(currentGroup);
      currentGroup = { region: regionMatch[1].trim(), contacts: [] };
      continue;
    }
    if (line.trim().startsWith('- **') && currentGroup) {
      const text = line.trim().replace(/^-\s*/, '');
      const nameMatch = text.match(/^\*\*(.+?):\*\*/);
      if (nameMatch) {
        const name = nameMatch[1].trim();
        const desc = text.slice(nameMatch[0].length).trim();
        currentGroup.contacts.push({ name, desc });
      }
    }
  }
  if (currentGroup) groups.push(currentGroup);
  return groups;
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

const StreetContactsSection = ({ content, regionName }) => {
  const groups = useMemo(() => parseContactsBlock(content), [content]);
  const activeGroup = useMemo(() => {
    return groups.find(g => g.region.toLowerCase().includes(regionName.toLowerCase()));
  }, [groups, regionName]);

  if (!activeGroup || !activeGroup.contacts.length) return null;

  return (
    <div className="dp-contacts-section">
      <div className="dp-contacts-header">
        <i className="fas fa-handshake" />
        <h3>Local Figures & Contacts</h3>
        <span className="dp-contacts-badge">Street-Level</span>
      </div>
      <p className="dp-contacts-intro">
        These are the local tavern keepers, minor archive clerks, and merchants who provide day-to-day services, rumors, or low-level work in this region.
      </p>
      <div className="dp-contacts-list">
        {activeGroup.contacts.map((c, i) => (
          <div key={i} className="dp-contact-item">
            <span className="dp-contact-name">{c.name}</span>
            <span className="dp-contact-desc">{renderLore(c.desc)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DramatisPersonaeDisplay = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegionName, setActiveRegionName] = useState('Frostwood Reach');
  const [selectedNpc, setSelectedNpc] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'secret' | 'clash'
  const [secretRevealed, setSecretRevealed] = useState(false);

  const worldLore = RULES_CATEGORIES.find(c => c.id === 'world-lore');
  const sub = worldLore?.subcategories?.find(s => s.id === 'dramatis-personae');
  const allSections = sub?.content?.sections || [];

  const contactsSection = allSections.find(s => s.title === 'Street-Level Contacts');
  const npcSections = allSections.filter(s => s.title !== 'Street-Level Contacts');

  const regionData = useMemo(() => {
    return npcSections.map((section, index) => {
      const regionName = section.title.replace(/\s*\(.*?\)/, '').trim();
      const subtitle = (() => { const m = section.title.match(/\((.+?)\)/); return m ? m[1] : null; })();
      const accent = REGION_ACCENTS[regionName] || DEFAULT_ACCENT;
      const npcs = parseNpcBlock(section.content);
      return { regionName, subtitle, accent, npcs, index };
    });
  }, [npcSections]);

  const currentRegion = useMemo(() => {
    return regionData.find(r => r.regionName === activeRegionName) || regionData[0];
  }, [regionData, activeRegionName]);

  const totalNpcs = useMemo(() =>
    regionData.reduce((sum, r) => sum + r.npcs.length, 0),
    [regionData]
  );

  const filteredNpcs = useMemo(() => {
    const list = currentRegion?.npcs || [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(npc =>
      npc.name.toLowerCase().includes(q) ||
      (npc.description && npc.description.toLowerCase().includes(q)) ||
      (npc.goal && npc.goal.toLowerCase().includes(q)) ||
      (npc.secret && npc.secret.toLowerCase().includes(q)) ||
      (npc.conflict && npc.conflict.toLowerCase().includes(q))
    );
  }, [currentRegion, searchQuery]);

  const handleSelectNpc = (npc) => {
    setSelectedNpc(npc);
    setActiveTab('overview');
    setSecretRevealed(false);
  };

  const handleBack = () => {
    setSelectedNpc(null);
  };

  return (
    <div className="dp-display">
      <div className="dp-layout">
        {/* Left Sidebar for Regions */}
        <aside className="dp-sidebar">
          <h3 className="dp-sidebar-title">
            <i className="fas fa-scroll"></i>
            Regions <span className="dp-sidebar-count">{totalNpcs}</span>
          </h3>

          <div className="dp-search-wrapper">
            <i className="fas fa-search dp-search-icon" />
            <input
              type="text"
              className="dp-search-input"
              placeholder="Search in region..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <ul className="dp-region-list">
            {regionData.map(region => {
              const isActive = activeRegionName === region.regionName;
              return (
                <li
                  key={region.regionName}
                  className={`dp-region-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setActiveRegionName(region.regionName);
                    setSelectedNpc(null);
                  }}
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
        </aside>

        {/* Content Area */}
        <div className="dp-content">
          {selectedNpc ? (
            /* DETAILED VIEW - JOURNAL PAGE */
            <div className="dp-detail fade-in">
              <button className="dp-back-btn" onClick={handleBack}>
                <i className="fas fa-arrow-left"></i> Back to {currentRegion.regionName}
              </button>

              <div className="dp-detail-header" style={{ '--accent': currentRegion.accent.color }}>
                <div className="dp-detail-title-group">
                  <h2 className="dp-detail-name">{selectedNpc.name}</h2>
                  <span className="dp-detail-region-badge" style={{ backgroundColor: currentRegion.accent.color }}>
                    <i className={currentRegion.accent.icon}></i> {currentRegion.regionName}
                  </span>
                </div>
                <p className="dp-detail-subtitle">
                  {currentRegion.subtitle || 'Notable Figure'}
                </p>
              </div>

              <div className="dp-detail-body">
                {/* Column 1: Portrait and Profile */}
                <div className="dp-portrait-col">
                  {NPC_PORTRAITS[selectedNpc.name] ? (
                    <div className="dp-detail-illustration">
                      <div className="dp-portrait-frame">
                        <img
                          src={NPC_PORTRAITS[selectedNpc.name].url}
                          alt={selectedNpc.name}
                        />
                      </div>
                      <div className="dp-detail-caption">
                        <i className="fas fa-feather-alt"></i> {NPC_PORTRAITS[selectedNpc.name].caption}
                      </div>
                    </div>
                  ) : (
                    <div className="dp-detail-illustration fallback-avatar">
                      <div className="dp-portrait-frame empty" style={{ borderColor: currentRegion.accent.color }}>
                        <div className="dp-portrait-letter" style={{ backgroundColor: currentRegion.accent.bg, color: currentRegion.accent.color }}>
                          {selectedNpc.name.charAt(0)}
                        </div>
                        <span>No sketch available</span>
                      </div>
                    </div>
                  )}

                  <div className="dp-quick-profile">
                    <h4 className="dp-profile-title">
                      <i className="fas fa-id-card"></i> Figure Profile
                    </h4>
                    <div className="dp-profile-row">
                      <span className="dp-profile-label">Faction:</span>
                      <span className="dp-profile-value">{currentRegion.subtitle || 'Independent'}</span>
                    </div>
                    <div className="dp-profile-row">
                      <span className="dp-profile-label">Domain:</span>
                      <span className="dp-profile-value">{currentRegion.regionName}</span>
                    </div>
                    <div className="dp-profile-row">
                      <span className="dp-profile-label">Status:</span>
                      <span className="dp-profile-value status-active">Active Threat</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Biography Tabs */}
                <div className="dp-tabs-col">
                  <div className="dp-tabs">
                    <button
                      className={`dp-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('overview')}
                      style={{ '--accent': currentRegion.accent.color }}
                    >
                      <i className="fas fa-book-open"></i> Overview & Goal
                    </button>
                    <button
                      className={`dp-tab-btn ${activeTab === 'clash' ? 'active' : ''}`}
                      onClick={() => setActiveTab('clash')}
                      style={{ '--accent': currentRegion.accent.color }}
                    >
                      <i className="fas fa-bolt"></i> Political Conflict
                    </button>
                    <button
                      className={`dp-tab-btn ${activeTab === 'secret' ? 'active' : ''}`}
                      onClick={() => setActiveTab('secret')}
                      style={{ '--accent': currentRegion.accent.color }}
                    >
                      <i className="fas fa-eye-slash"></i> GM Secrets
                    </button>
                  </div>

                  <div className="dp-tab-content">
                    {activeTab === 'overview' && (
                      <div className="dp-tab-pane fade-in">
                        <div className="dp-section">
                          <h4 className="dp-section-title">Description</h4>
                          <p className="dp-description-text">{renderLore(selectedNpc.description)}</p>
                        </div>
                        {selectedNpc.goal && (
                          <div className="dp-section dp-highlight-box goal-box" style={{ borderColor: currentRegion.accent.color, background: currentRegion.accent.bg }}>
                            <h4 className="dp-section-title" style={{ color: currentRegion.accent.color }}>
                              <i className="fas fa-bullseye"></i> Primary Goal
                            </h4>
                            <p className="dp-highlight-text">{renderLore(selectedNpc.goal)}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'clash' && (
                      <div className="dp-tab-pane fade-in">
                        <div className="dp-section">
                          <h4 className="dp-section-title">Immediate Conflict</h4>
                          <p className="dp-description-text">{renderLore(selectedNpc.conflict)}</p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'secret' && (
                      <div className="dp-tab-pane fade-in">
                        <div className="dp-gm-warning">
                          <i className="fas fa-exclamation-triangle"></i>
                          <span><strong>GM WARNING:</strong> The information below contains major campaign secrets and should not be shown to players before they uncover them in-game.</span>
                        </div>
                        <div className="dp-section dp-secret-box">
                          <div className="dp-secret-header">
                            <span className="dp-secret-title">
                              <i className="fas fa-key"></i> Redacted Campaign Truth
                            </span>
                            <button
                              className="dp-secret-toggle-btn"
                              onClick={() => setSecretRevealed(r => !r)}
                            >
                              {secretRevealed ? 'Conceal Secret' : 'Reveal Secret'}
                            </button>
                          </div>
                          <p className={`dp-secret-text ${secretRevealed ? 'revealed' : ''}`}>
                            {secretRevealed ? renderLore(selectedNpc.secret) : '\u2588'.repeat(120) + ' ' + '\u2588'.repeat(80)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* LIST VIEW - REGION DIRECTORY */
            <div className="dp-region-view fade-in">
              <div className="dp-region-banner" style={{ '--accent-bg': currentRegion.accent.bg, '--accent': currentRegion.accent.color }}>
                <div className="dp-region-banner-icon" style={{ color: currentRegion.accent.color }}>
                  <i className={currentRegion.accent.icon}></i>
                </div>
                <div className="dp-region-banner-text">
                  <h2>{currentRegion.regionName}</h2>
                  <p>{currentRegion.subtitle || 'Sovereign territory of the noble houses'}</p>
                </div>
              </div>

              {filteredNpcs.length === 0 ? (
                <div className="dp-no-results">
                  <i className="fas fa-search" />
                  <p>No figures match your query in this region</p>
                </div>
              ) : (
                <div className="dp-card-grid">
                  {filteredNpcs.map((npc, i) => {
                    const hasPortrait = !!NPC_PORTRAITS[npc.name];
                    return (
                      <div
                        key={i}
                        className="dp-npc-card"
                        onClick={() => handleSelectNpc(npc)}
                        style={{ '--accent': currentRegion.accent.color }}
                      >
                        <div className="dp-npc-card-avatar">
                          {hasPortrait ? (
                            <img src={NPC_PORTRAITS[npc.name].url} alt={npc.name} className="dp-avatar-img" />
                          ) : (
                            <div className="dp-avatar-letter" style={{ backgroundColor: currentRegion.accent.bg, color: currentRegion.accent.color }}>
                              {npc.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="dp-npc-card-info">
                          <h4 className="dp-npc-card-name">{npc.name}</h4>
                          <p className="dp-npc-card-excerpt">
                            {npc.description ? (npc.description.length > 95 ? npc.description.substring(0, 95) + '...' : npc.description) : 'No description.'}
                          </p>
                          <span className="dp-read-more">
                            Consult Journal <i className="fas fa-chevron-right"></i>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Local figures (street-level contacts) */}
              {contactsSection && !searchQuery && (
                <StreetContactsSection content={contactsSection.content} regionName={currentRegion.regionName} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DramatisPersonaeDisplay;
