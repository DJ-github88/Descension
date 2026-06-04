import React, { useState } from 'react';
import useFactionStore from '../../store/factionStore';
import useWorldStore from '../../store/worldStore';
import LoreLink from '../common/LoreLink';
import { MiniCalendar, TimelineView } from './TimelineView';

const FactionDetail = ({ factionId, onBack }) => {
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
    { key: 'overview', label: 'Overview' },
    { key: 'members', label: 'Members' },
    { key: 'relations', label: 'Relations' },
    { key: 'history', label: 'History' }
  ];

  return (
    <div className="world-panel">
      <div className="world-panel-header">
        <button className="world-back-btn" onClick={onBack}>← Back</button>
        <div className="world-header-identity">
          <div
            className="world-faction-color-bar"
            style={{ background: `linear-gradient(135deg, ${faction.colors?.primary || '#555'}, ${faction.colors?.secondary || '#888'})` }}
          />
          <div>
            <h2>{faction.name}</h2>
            <span className="world-badge">{faction.type?.replace(/_/g, ' ')}</span>
            {context?.region && (
              <span className="world-muted"> · {context.region.name}</span>
            )}
          </div>
        </div>
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
              <h3>Public Identity</h3>
              <p className="world-prose">{faction.publicDescription || faction.publicGoal}</p>
              {faction.publicGoal && (
                <p className="world-card-meta"><strong>Goal:</strong> {faction.publicGoal}</p>
              )}
            </section>

            {faction.hiddenAgenda && (
              <section className="world-section world-section-dark">
                <h3>Hidden Agenda</h3>
                <p className="world-prose">{faction.hiddenDescription || faction.hiddenAgenda}</p>
              </section>
            )}

            {faction.lore && (
              <section className="world-section">
                <h3>Lore</h3>
                <p className="world-prose">{faction.lore}</p>
              </section>
            )}

            {faction.secrets && (
              <section className="world-section world-section-highlight">
                <h3>Secrets</h3>
                <p className="world-prose">{faction.secrets}</p>
              </section>
            )}

            {faction.classAffinities && faction.classAffinities.length > 0 && (
              <section className="world-section">
                <h3>Class Affinities</h3>
                <div className="world-tag-list">
                  {faction.classAffinities.map((cId) => (
                    <span key={cId} className="world-tag">
                      <LoreLink termId={cId}>{cId}</LoreLink>
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
                <h3>Leadership</h3>
                <div className="world-info-card">
                  <h4>{faction.leader.npcId}</h4>
                  <span className="world-card-meta">{faction.leader.title}</span>
                  <p>{faction.leader.description}</p>
                </div>
              </section>
            )}

            {(faction.members || []).length > 0 && (
              <section className="world-section">
                <h3>Members</h3>
                <div className="world-card-grid">
                  {faction.members.map((m, i) => (
                    <div key={i} className="world-info-card world-member-card">
                      <h4>{m.npcId}</h4>
                      <span className="world-badge">{m.role}</span>
                      {m.locationId && (
                        <p className="world-card-meta">
                          Location: <LoreLink termId={m.locationId}>{m.locationId}</LoreLink>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {activeTab === 'relations' && (
          <div className="world-section-stack">
            <section className="world-section">
              <h3>Relationships</h3>
              <div className="world-relation-list">
                {relationships.length === 0 && (
                  <p className="world-muted">No relationships recorded.</p>
                )}
                {relationships.map((rel, i) => (
                  <div key={i} className="world-relation-card">
                    <svg width="30" height="30">
                      <line x1="0" y1="15" x2="30" y2="15"
                        stroke={RELATIONSHIP_TYPES[rel.type]?.color || '#888'}
                        strokeWidth="3"
                        strokeDasharray={RELATIONSHIP_TYPES[rel.type]?.lineStyle === 'dashed' ? '5,3' : 'none'}
                      />
                    </svg>
                    <div>
                      <strong>{faction.name}</strong>
                      <span className={`world-badge world-badge-sm`}>
                        {RELATIONSHIP_TYPES[rel.type]?.label || rel.type}
                      </span>
                      <strong> {rel.targetName}</strong>
                      {rel.description && <p className="world-card-meta">{rel.description}</p>}
                    </div>
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
