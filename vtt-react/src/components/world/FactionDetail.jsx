import React, { useState } from 'react';
import useFactionStore from '../../store/factionStore';
import useWorldStore from '../../store/worldStore';
import LoreLink from '../common/LoreLink';
import { TimelineView } from './TimelineView';
import { sanitizeLoreText, formatDisplayName, getFactionIcon, getFactionTypeIcon } from './WorldDashboard';

const FactionDetail = ({ factionId, onBack, onNavigateFaction }) => {
  const { getFaction, getFactionRelationships } = useFactionStore();
  const { getFullContextForFaction } = useWorldStore();
  const [activeTab, setActiveTab] = useState('overview');

  const faction = getFaction(factionId);
  const context = getFullContextForFaction(factionId);
  const relationships = getFactionRelationships(factionId);

  if (!faction) {
    return (
      <div className="world-panel">
        <div className="world-panel-header">
          <button className="world-back-btn" onClick={onBack}>← Back</button>
          <h3>Faction not found</h3>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Chronicle', icon: 'fa-book-open' },
    { key: 'members', label: `Hierarchy & Roster (${(faction.members || []).length || (faction.leader ? 1 : 0)})`, icon: 'fa-users-viewfinder' },
    { key: 'relations', label: `Diplomacy & Web (${relationships.length})`, icon: 'fa-diagram-project' },
    { key: 'history', label: 'Timeline & History', icon: 'fa-hourglass-half' }
  ];

  return (
    <div className="world-panel faction-detail-panel">
      {/* Royal Heraldic Banner Header */}
      <div
        className="faction-hero-header"
        style={{
          '--fac-primary': faction.colors?.primary || '#8b5a1a',
          '--fac-secondary': faction.colors?.secondary || '#2b1408'
        }}
      >
        <div className="faction-hero-top-nav">
          <button className="world-back-btn" onClick={onBack}>
            <i className="fas fa-arrow-left"></i> Back to World
          </button>
          <div className="faction-breadcrumbs">
            <span>World</span> <i className="fas fa-chevron-right"></i>
            <span>Factions</span> <i className="fas fa-chevron-right"></i>
            <span className="current">{sanitizeLoreText(faction.name)}</span>
          </div>
          <div className="faction-hero-actions">
            <button
              className="btn-faction-hero-web"
              onClick={() => {
                onBack();
                // trigger relationship web navigation
                window.dispatchEvent(new CustomEvent('mythrill_open_faction_web', { detail: { factionId } }));
              }}
              title="Inspect in Relationship Web"
            >
              <i className="fas fa-project-diagram"></i> Relationship Web
            </button>
          </div>
        </div>

        <div className="faction-hero-main-card">
          <div
            className="faction-hero-crest-shield"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${faction.colors?.primary || '#8b5a1a'} 0%, #1a0f05 100%)`,
              borderColor: faction.colors?.secondary || '#d4af37'
            }}
          >
            <i className={`fas ${getFactionIcon(faction)}`}></i>
          </div>

          <div className="faction-hero-text-block">
            <div className="faction-hero-badges-row">
              <span className="faction-hero-type-badge">
                <i className={`fas ${getFactionTypeIcon(faction.type)}`}></i>
                {formatDisplayName(faction.type)}
              </span>
              {context?.region && (
                <span className="faction-hero-region-badge">
                  <i className="fas fa-map-pin"></i> Seat in {context.region.name}
                </span>
              )}
              {faction.headquarters && (
                <span className="faction-hero-hq-badge">
                  <i className="fas fa-chess-rook"></i> Capital: {formatDisplayName(sanitizeLoreText(faction.headquarters))}
                </span>
              )}
            </div>

            <h1 className="faction-hero-title">{sanitizeLoreText(faction.name)}</h1>

            {faction.leader?.title && (
              <div className="faction-hero-authority-strip">
                <i className="fas fa-crown"></i>
                <span><strong>Authority:</strong> {sanitizeLoreText(faction.leader.title)}</span>
              </div>
            )}
          </div>

          <div className="faction-hero-stats-col">
            <div className="faction-hero-stat-card" title="Fortified Holdings">
              <span className="stat-value">{faction.territory?.length || 1}</span>
              <span className="stat-label">Holdings</span>
            </div>
            <div className="faction-hero-stat-card" title="Allied Orders">
              <span className="stat-value ally">{relationships.filter(r => r.type === 'allied' || r.type === 'vassal' || r.type === 'secret_ally').length}</span>
              <span className="stat-label">Allies</span>
            </div>
            <div className="faction-hero-stat-card" title="Rival Orders">
              <span className="stat-value rival">{relationships.filter(r => r.type === 'rival' || r.type === 'hostile' || r.type === 'secret_rival').length}</span>
              <span className="stat-label">Rivals</span>
            </div>
          </div>
        </div>

        <div className="faction-hero-ribbon" />
      </div>

      <div className="world-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`world-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="world-tab-content">
        {activeTab === 'overview' && (
          <div className="world-section-stack">
            <section className="world-section">
              <h3>Public Identity &amp; Mandate</h3>
              <p className="world-prose">{sanitizeLoreText(faction.publicDescription || faction.publicGoal)}</p>
              {faction.publicGoal && (
                <div className="world-quote" style={{ marginTop: '12px' }}>
                  <p>&ldquo;{sanitizeLoreText(faction.publicGoal)}&rdquo;</p>
                  <cite>— Official Mandate of {sanitizeLoreText(faction.name)}</cite>
                </div>
              )}
            </section>

            {faction.hiddenAgenda && (
              <section className="world-section world-section-dark">
                <h3>Hidden Agenda &amp; Dark Bargains</h3>
                <p className="world-prose">{sanitizeLoreText(faction.hiddenDescription || faction.hiddenAgenda)}</p>
              </section>
            )}

            {faction.lore && (
              <section className="world-section">
                <h3>Historical Origins &amp; Canon Lore</h3>
                <p className="world-prose">{sanitizeLoreText(faction.lore)}</p>
              </section>
            )}

            {faction.territory && faction.territory.length > 0 && (
              <section className="world-section">
                <h3>Holdings &amp; Controlled Strongholds ({faction.territory.length})</h3>
                <div className="world-card-grid">
                  {faction.territory.map((terrId) => (
                    <div key={terrId} className="world-info-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-chess-rook" style={{ color: '#8b5a1a' }}></i>
                        <h4>{formatDisplayName(terrId)}</h4>
                      </div>
                      <p className="world-card-meta">
                        Fortified Holding of {sanitizeLoreText(faction.name)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {faction.secrets && (
              <section className="world-section world-section-highlight">
                <h3>Forbidden Secrets &amp; Exploits</h3>
                <p className="world-prose">{sanitizeLoreText(faction.secrets)}</p>
              </section>
            )}

            {faction.classAffinities && faction.classAffinities.length > 0 && (
              <section className="world-section">
                <h3>Aligned Class Traditions</h3>
                <div className="world-tag-list" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {faction.classAffinities.map((cId) => (
                    <span key={cId} className="world-tag" style={{ background: '#f4ecdc', border: '1px solid #cdb592', padding: '4px 10px', borderRadius: '4px' }}>
                      <LoreLink termId={cId}><strong>{formatDisplayName(cId)}</strong></LoreLink>
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="world-section-stack">
            {faction.leader && (
              <section className="world-section">
                <h3>Supreme Authority</h3>
                <div className="world-info-card" style={{ borderLeft: '4px solid #8b5a1a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="world-heraldry" style={{ background: faction.colors?.primary || '#8b5a1a' }}>
                      <i className="fas fa-crown"></i>
                    </div>
                    <div>
                      <h4>{sanitizeLoreText(faction.leader.title || formatDisplayName(faction.leader.npcId))}</h4>
                      <span className="world-badge">{formatDisplayName(faction.leader.title || 'Grand Leader')}</span>
                    </div>
                  </div>
                  {faction.leader.description && (
                    <p style={{ marginTop: '10px' }}>{sanitizeLoreText(faction.leader.description)}</p>
                  )}
                </div>
              </section>
            )}

            <section className="world-section">
              <h3>Order Hierarchy &amp; Notable Members</h3>
              {(faction.members || []).length > 0 ? (
                <div className="world-card-grid">
                  {faction.members.map((m, i) => (
                    <div key={i} className="world-info-card world-member-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-user-shield" style={{ color: '#8b5a1a' }}></i>
                        <h4>{formatDisplayName(m.npcId)}</h4>
                      </div>
                      <span className="world-badge">{formatDisplayName(m.role || 'Member')}</span>
                      {m.locationId && (
                        <p className="world-card-meta">
                          Stationed: <LoreLink termId={m.locationId}>{formatDisplayName(m.locationId)}</LoreLink>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="world-muted">Retainers, scouts, and sworn champions answer directly to the leadership council.</p>
              )}
            </section>
          </div>
        )}

        {activeTab === 'relations' && (
          <div className="world-section-stack">
            <section className="world-section">
              <h3>Diplomatic Stances &amp; Alliances</h3>
              <div className="world-relation-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {relationships.length === 0 && (
                  <p className="world-muted">No external relations formally recorded in sovereign ledgers.</p>
                )}
                {relationships.map((rel, i) => (
                  <div key={i} className="world-relation-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', background: '#ffffff', borderRadius: '8px', border: '1px solid #cdb592' }}>
                    <div
                      style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: RELATIONSHIP_TYPES[rel.type]?.color || '#888',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0
                      }}
                    >
                      <i className={`fas ${rel.type === 'allied' ? 'fa-handshake' : rel.type === 'hostile' ? 'fa-skull-crossbones' : rel.type === 'rival' ? 'fa-swords' : 'fa-shield-halved'}`}></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong>{sanitizeLoreText(faction.name)}</strong>
                        <span className={`world-badge world-badge-sm`} style={{ background: RELATIONSHIP_TYPES[rel.type]?.color ? `${RELATIONSHIP_TYPES[rel.type].color}22` : '#eee', color: RELATIONSHIP_TYPES[rel.type]?.color || '#333' }}>
                          {formatDisplayName(RELATIONSHIP_TYPES[rel.type]?.label || rel.type)}
                        </span>
                        <strong>{sanitizeLoreText(rel.targetName)}</strong>
                      </div>
                      {rel.description && (
                        <p className="world-card-meta" style={{ marginTop: '4px' }}>{sanitizeLoreText(rel.description)}</p>
                      )}
                    </div>
                    {onNavigateFaction && rel.targetFactionId && (
                      <button
                        className="world-action-btn"
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                        onClick={() => onNavigateFaction(rel.targetFactionId)}
                      >
                        Inspect →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'history' && (
          <TimelineView filterFactionId={factionId} compact />
        )}
      </div>
    </div>
  );
};

const RELATIONSHIP_TYPES = {
  allied: { label: 'Allied', color: '#2d8552' },
  vassal: { label: 'Vassal', color: '#2d8552' },
  neutral: { label: 'Neutral', color: '#888888' },
  rival: { label: 'Rival', color: '#c48b1e' },
  hostile: { label: 'Hostile', color: '#a12323' },
  secret_ally: { label: 'Secret Ally', color: '#6b2d8b' },
  secret_rival: { label: 'Secret Rival', color: '#8b2d6b' },
  puppet_master: { label: 'Puppet Master', color: '#d4700a' }
};

export default FactionDetail;
