import React, { useEffect, useState } from 'react';
import useClassLoreStore from '../../store/classLoreStore';
import useWorldStore from '../../store/worldStore';
import LoreLink from '../common/LoreLink';

const ClassLoreDetail = ({ classId, onClose }) => {
  const { getClass, getAllSubclassInfo, loadClasses, loaded } = useClassLoreStore();
  const { getFullContextForClass } = useWorldStore();
  const [context, setContext] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!loaded) loadClasses();
  }, [loaded, loadClasses]);

  useEffect(() => {
    const ctx = getFullContextForClass(classId);
    setContext(ctx);
  }, [classId, getFullContextForClass]);

  const cls = getClass(classId);
  if (!cls) {
    return (
      <div className="world-panel">
        <div className="world-panel-header">
          <button className="world-back-btn" onClick={onClose}>← Back</button>
          <h3>Class not found</h3>
        </div>
      </div>
    );
  }

  const subclassInfo = getAllSubclassInfo(classId);

  const tabs = [
    { key: 'overview', label: 'Overview' },
    ...(subclassInfo && Object.keys(subclassInfo).length > 0
      ? Object.entries(subclassInfo).map(([key, sub]) => ({ key, label: sub.name || key }))
      : []),
    { key: 'organizations', label: 'Organizations' },
    { key: 'history', label: 'History & Lore' }
  ];

  return (
    <div className="world-panel">
      <div className="world-panel-header">
        <button className="world-back-btn" onClick={onClose}>← Back</button>
        <div>
          <h2>{cls.name}</h2>
          <span className="world-subtitle">{cls.roleplayIdentity?.title || 'Class Lore'}</span>
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
          <OverviewTab cls={cls} context={context} />
        )}

        {activeTab === 'organizations' && (
          <OrganizationsTab cls={cls} context={context} />
        )}

        {activeTab === 'history' && (
          <HistoryTab cls={cls} context={context} />
        )}

        {subclassInfo && subclassInfo[activeTab] && (
          <SubclassTab subclass={subclassInfo[activeTab]} />
        )}
      </div>
    </div>
  );
};

const OverviewTab = ({ cls, context }) => (
  <div className="world-section-stack">
    {cls.signatureQuote && (
      <blockquote className="world-quote">
        <p>"{cls.signatureQuote.text}"</p>
        <cite>— {cls.signatureQuote.speaker}{cls.signatureQuote.context ? `, ${cls.signatureQuote.context}` : ''}</cite>
      </blockquote>
    )}

    <section className="world-section">
      <h3>Origin Story</h3>
      <p className="world-prose">{cls.originStory}</p>
    </section>

    {cls.philosophy && (
      <section className="world-section">
        <h3>Philosophy</h3>
        <div className="world-philosophy-grid">
          <div className="world-philosophy-card">
            <h4>Core Tenet</h4>
            <p>{cls.philosophy.coreTenet}</p>
          </div>
          <div className="world-philosophy-card">
            <h4>Relationship to Power</h4>
            <p>{cls.philosophy.relationship}</p>
          </div>
          <div className="world-philosophy-card">
            <h4>The Paradox</h4>
            <p>{cls.philosophy.paradox}</p>
          </div>
        </div>
      </section>
    )}

    {cls.meaningfulTradeoffs && (
      <section className="world-section">
        <h3>What You Sacrifice</h3>
        <p className="world-prose">{cls.meaningfulTradeoffs}</p>
      </section>
    )}

    {cls.currentCrisis && (
      <section className="world-section world-section-highlight">
        <h3>Current Crisis</h3>
        <p className="world-prose">{cls.currentCrisis}</p>
      </section>
    )}

    {cls.classSpecificLocations && cls.classSpecificLocations.length > 0 && (
      <section className="world-section">
        <h3>Sacred Sites</h3>
        <div className="world-card-grid">
          {cls.classSpecificLocations.map((loc) => (
            <div key={loc.locationId} className="world-info-card">
              <h4><LoreLink termId={loc.locationId}>{loc.name}</LoreLink></h4>
              <span className="world-badge">{loc.status}</span>
              <p>{loc.description}</p>
              <p className="world-card-meta">Purpose: {loc.purpose}</p>
            </div>
          ))}
        </div>
      </section>
    )}

    {context && context.factions && context.factions.length > 0 && (
      <section className="world-section">
        <h3>Associated Factions</h3>
        <div className="world-list">
          {context.factions.map((f) => (
            <div key={f.id} className="world-list-item">
              <div className="world-faction-colors" style={{ background: f.colors?.primary || '#888' }} />
              <strong>{f.name}</strong>
              <span className="world-muted"> — {f.publicGoal?.slice(0, 80)}...</span>
            </div>
          ))}
        </div>
      </section>
    )}

    {context && context.timeline && context.timeline.length > 0 && (
      <section className="world-section">
        <h3>Timeline</h3>
        <div className="world-timeline-mini">
          {context.timeline.slice(0, 5).map((event) => (
            <div key={event.id} className="world-timeline-item">
              <span className="world-timeline-date">Year {event.date.year}, {event.date.eraId}</span>
              <strong>{event.title}</strong>
            </div>
          ))}
        </div>
      </section>
    )}
  </div>
);

const OrganizationsTab = ({ cls, context }) => {
  const orgs = context?.classInfo?.organizations || [];

  if (orgs.length === 0) {
    return (
      <div className="world-section">
        <p className="world-muted">No organizations recorded for this class. Guilds, temples, and orders will appear here when added.</p>
      </div>
    );
  }

  return (
    <div className="world-section-stack">
      {orgs.map((org, i) => (
        <section key={i} className="world-section">
          <h3>{org.name}</h3>
          <div className="world-meta-row">
            <span><strong>Leader:</strong> {org.leader}</span>
            <span><strong>HQ:</strong> <LoreLink termId={org.headquarters}>{org.headquarters}</LoreLink></span>
            <span className={`world-badge world-badge-${org.status}`}>{org.status}</span>
          </div>
          <p className="world-prose">{org.description}</p>
          {org.notableMembers && org.notableMembers.length > 0 && (
            <p className="world-card-meta">Notable members: {org.notableMembers.join(', ')}</p>
          )}
          {org.rivalOrganizations && org.rivalOrganizations.length > 0 && (
            <p className="world-card-meta">Rivals: {org.rivalOrganizations.join(', ')}</p>
          )}
        </section>
      ))}
    </div>
  );
};

const HistoryTab = ({ cls, context }) => {
  if (!cls.roleplayIdentity || !cls.roleplayIdentity.content) {
    return <p className="world-muted">No historical data available.</p>;
  }

  const rp = cls.roleplayIdentity.content;
  const sections = [];

  if (rp['HISTORY: THE GENESIS']) sections.push({ title: 'History: The Genesis', content: rp['HISTORY: THE GENESIS'] });
  if (rp['HISTORY: THE SCHISMS']) sections.push({ title: 'History: The Schisms', content: rp['HISTORY: THE SCHISMS'] });
  if (rp['HISTORY: THE REDISCOVERY']) sections.push({ title: 'History: The Rediscovery', content: rp['HISTORY: THE REDISCOVERY'] });
  if (rp['CITIES & CIVIL RECEPTION']) sections.push({ title: 'Cities & Civil Reception', content: rp['CITIES & CIVIL RECEPTION'] });
  if (rp['RACES & CULTURAL AFFILIATION']) sections.push({ title: 'Races & Cultural Affiliation', content: rp['RACES & CULTURAL AFFILIATION'] });
  if (rp['INITIATION & TRAINING']) sections.push({ title: 'Initiation & Training', content: rp['INITIATION & TRAINING'] });
  if (rp['IN THE WORLD']) sections.push({ title: 'In the World', content: rp['IN THE WORLD'] });

  return (
    <div className="world-section-stack">
      {sections.map((sec, i) => (
        <section key={i} className="world-section">
          <h3>{sec.title}</h3>
          <div className="world-prose" dangerouslySetInnerHTML={{ __html: sec.content.replace(/\n\n/g, '<br/><br/>') }} />
        </section>
      ))}

      {cls.notableFigures && cls.notableFigures.length > 0 && (
        <section className="world-section">
          <h3>Notable Figures</h3>
          <div className="world-card-grid">
            {cls.notableFigures.map((fig, i) => (
              <div key={i} className="world-info-card">
                <h4>{fig.name}</h4>
                {fig.title && <span className="world-card-meta">{fig.title}</span>}
                {fig.affiliation && <span className="world-card-meta">{fig.affiliation}</span>}
                {fig.status && <span className={`world-badge world-badge-${fig.status?.toLowerCase().includes('deceased') ? 'warning' : 'success'}`}>{fig.status}</span>}
                {fig.description && <p>{fig.description}</p>}
                {fig.backstory && <p className="world-prose">{fig.backstory}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const SubclassTab = ({ subclass }) => {
  if (!subclass) return <p className="world-muted">No subclass data available.</p>;

  return (
    <div className="world-section-stack">
      <section className="world-section">
        <h2>{subclass.name}</h2>
        {subclass.description && <p className="world-prose">{subclass.description}</p>}
      </section>

      {subclass.philosophy && (
        <section className="world-section">
          <h3>Philosophy</h3>
          <p className="world-prose">{subclass.philosophy}</p>
        </section>
      )}

      {subclass.psychologicalProfile && (
        <section className="world-section">
          <h3>Psychological Profile</h3>
          <p className="world-prose">{subclass.psychologicalProfile}</p>
        </section>
      )}

      {subclass.roleInSociety && (
        <section className="world-section">
          <h3>Role in Society</h3>
          <p className="world-prose">{subclass.roleInSociety}</p>
        </section>
      )}

      {subclass.signatureRitual && (
        <section className="world-section">
          <h3>Signature Ritual</h3>
          <p className="world-prose">{subclass.signatureRitual}</p>
        </section>
      )}

      {subclass.forbiddenPractices && (
        <section className="world-section world-section-highlight">
          <h3>Forbidden Practices</h3>
          <p className="world-prose">{subclass.forbiddenPractices}</p>
        </section>
      )}
    </div>
  );
};

export default ClassLoreDetail;
