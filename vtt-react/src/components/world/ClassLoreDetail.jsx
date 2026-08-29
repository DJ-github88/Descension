import React, { useEffect, useState, useMemo } from 'react';
import useClassLoreStore from '../../store/classLoreStore';
import useWorldStore from '../../store/worldStore';
import { getClassFlavorProfile } from '../../data/classes/classFlavorProfiles';
import ClassIcon from '../common/ClassIcon';
import LoreLink from '../common/LoreLink';
import RichLoreText from '../common/RichLoreText';

// Helper to sanitize em-dashes and AI punctuation artifacts
const cleanEmdashes = (text) => {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/\s*—\s*/g, ', ')
    .replace(/\s*--\s*/g, ', ')
    .replace(/\s*–\s*/g, ', ');
};

// Helper to parse roleplayIdentity content whether string or object
const parseClassRoleplaySections = (content) => {
  if (!content) return [];
  if (typeof content === 'object') {
    return Object.entries(content).map(([title, body]) => ({
      title: cleanEmdashes(title.replace(/\*\*/g, '').trim()),
      content: cleanEmdashes(body)
    }));
  }

  const sections = [];
  const paragraphs = content.split(/\n{2,}/);
  let currentSection = null;

  paragraphs.forEach(para => {
    const trimmed = cleanEmdashes(para.trim());
    if (!trimmed) return;

    const headerMatch = trimmed.match(/^\*\*(.*?)\*\*\s*\n*([\s\S]*)/);
    if (headerMatch) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: headerMatch[1].trim(),
        content: headerMatch[2] ? headerMatch[2].trim() : ''
      };
    } else if (currentSection) {
      currentSection.content += (currentSection.content ? '\n\n' : '') + trimmed;
    } else {
      currentSection = {
        title: 'Background & Origins',
        content: trimmed
      };
    }
  });

  if (currentSection) {
    sections.push(currentSection);
  }
  return sections;
};

// Known Class Orders & Organizations Synthesizer
const DEFAULT_CLASS_ORGANIZATIONS = {
  arcanoneer: [
    {
      name: 'The Canopy Ledger Scriptorium',
      leader: 'Jarl-Archivist Vel-Otharen',
      headquarters: 'Atropolis (Bryngloom Forest)',
      status: 'Active (Contested)',
      description: 'The supreme judicial and academic authority for elemental contract law. Masters draft and audit incantation clauses for Morvane.',
      notableMembers: ['Valerius the Scriptor', 'Kaelen the Unbroken'],
      rivalOrganizations: ['Caustic Scrap-Weavers Syndicate']
    },
    {
      name: 'Cragjaw Gear Weaver Guild',
      leader: 'Guildmaster Fex-Krohn',
      headquarters: 'Cragjaw Peaks',
      status: 'Active',
      description: 'Clockwork Fexric guild mapping elemental combination matrices with precision engineering and certified tolerances.'
    }
  ],
  berserker: [
    {
      name: 'The Bloodhammer War Council',
      leader: 'Warlord Grum Bloodhammer',
      headquarters: 'Skalvyrhold (Nordhalla)',
      status: 'Active',
      description: 'The ancestral warrior lodge carrying the Hunger Pact, training warriors in Rage discipline and mammoth hide armor crafting.',
      notableMembers: ['Torvald Frost-Biter', 'Sigrid Red-Axe']
    },
    {
      name: 'The Fredlose Outlaw Host',
      leader: 'Jarl Ulfgar the Exiled',
      headquarters: 'The Sunder Wall Glaciers',
      status: 'Hostile',
      description: 'Disavowed Berserkers who refuse clan oaths, raiding southern supply lines and living beyond the wall.'
    }
  ],
  martyr: [
    {
      name: 'The Order of the Iron Martyr',
      leader: 'High Prelate Theresa Solvan',
      headquarters: 'Sundale Cathedral',
      status: 'Active',
      description: 'Knights bound by blood oaths who absorb lethal damage intended for allies, channeling divine sacrifice into solar shockwaves.',
      notableMembers: ['Brother Kenneth the Shield-Bearer', 'Sister Vanya']
    }
  ],
  inquisitor: [
    {
      name: 'The Silver Brand Inquisitorial Synod',
      leader: 'Grand Inquisitor Morren Scribe',
      headquarters: 'Synod Hold (Sundrift Vale)',
      status: 'Active',
      description: 'Dogmatic witch hunters hunting heretical cults of Keth-Amar and prosecuting violations of the Sovereign Ledger.',
      notableMembers: ['Inquisitor Daniel the Stern']
    }
  ],
  augur: [
    {
      name: 'The Frozen Archive Observers',
      leader: 'Elder Cassandra',
      headquarters: 'The Frozen Archive (Nordhalla)',
      status: 'Active (Fading)',
      description: 'Star-readers and pulse-measurers tracking the remaining output of Sol and the terrifying silence of Aex.',
      notableMembers: ['Cassia Star-Watcher']
    }
  ],
  chronarch: [
    {
      name: 'The Timewatch Convent',
      leader: 'Chronarch Aethelgard',
      headquarters: 'Basalt Shyr Outpost',
      status: 'Secret',
      description: 'Guardians of temporal integrity who measure temporal friction and counter anomalies caused by the shattering of the First Seal.'
    }
  ],
  lunarch: [
    {
      name: 'The Moon Covenant Circle',
      leader: 'Elder Lyra Viridane',
      headquarters: 'The Moonlit Groves (Frostwood Reach)',
      status: 'Hidden',
      description: 'Descendants of House Viridane who commune with lunar entities, wielding wildwood thorns and silver light.'
    }
  ]
};

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
    { key: 'overview', label: 'Tradition & Philosophy', icon: 'fa-book-open' },
    { key: 'history', label: 'Origins & Canon Lore', icon: 'fa-scroll' },
    { key: 'organizations', label: 'Aligned Orders & Guilds', icon: 'fa-shield-halved' },
    ...(subclassInfo && Object.keys(subclassInfo).length > 0
      ? Object.entries(subclassInfo).map(([key, sub]) => ({ key, label: sub.name || key, icon: 'fa-feather' }))
      : [])
  ];

  return (
    <div className="world-panel class-lore-panel">
      <div className="world-panel-header">
        <button className="world-back-btn" onClick={onClose}>← Dashboard</button>
        <div className="world-header-identity">
          <div className="world-class-header-avatar-wrap">
            <ClassIcon
              src={`/assets/icons/classes/${cls.id?.toLowerCase()?.replace(/\s+/g, '_')?.replace(/-/g, '_')}.png`}
              alt={cls.name}
              size="medium"
              className="world-class-header-avatar-img"
              dataClass={cls.name}
            />
          </div>
          <div>
            <h2>{cls.name}</h2>
            <span className="world-subtitle">{cls.roleplayIdentity?.title || cls.combatRole?.title || 'Living Class Codex'}</span>
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
            {tab.icon && <i className={`fas ${tab.icon}`} style={{ marginRight: '6px' }} />}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="world-tab-content">
        {activeTab === 'overview' && (
          <OverviewTab cls={cls} context={context} />
        )}

        {activeTab === 'history' && (
          <HistoryTab cls={cls} context={context} />
        )}

        {activeTab === 'organizations' && (
          <OrganizationsTab cls={cls} context={context} classId={classId} />
        )}

        {subclassInfo && subclassInfo[activeTab] && (
          <SubclassTab subclass={subclassInfo[activeTab]} />
        )}
      </div>
    </div>
  );
};

const OverviewTab = ({ cls, context }) => {
  const profile = getClassFlavorProfile(cls.id);

  return (
    <div className="world-section-stack">
      {profile && (
        <div className="world-section world-section-highlight class-codex-hero">
          <div className="class-codex-hero-header">
            <div>
              <span className="class-archetype-tag">{profile.tradition}</span>
              <h3 style={{ margin: '4px 0 8px 0', borderBottom: 'none' }}>{profile.role}</h3>
            </div>
            <span className="class-pill class-resource-pill" style={{ fontSize: '12px', padding: '4px 10px' }}>
              <i className={`fas ${profile.resourceIcon}`} /> {profile.resourceName}
            </span>
          </div>

          <div className="class-tagline-box" style={{ margin: '8px 0 12px 0' }}>
            <p className="class-tagline-text" style={{ fontSize: '13.5px' }}>"{profile.tagline}"</p>
          </div>

          <div className="class-mechanics-pills" style={{ marginBottom: '10px' }}>
            {profile.keyFeatures.map((feat, idx) => (
              <span key={idx} className="class-pill class-feature-pill" style={{ fontSize: '11px', padding: '3px 9px' }}>
                <i className="fas fa-sparkles" /> {feat}
              </span>
            ))}
          </div>

          <p className="world-prose" style={{ margin: 0, fontSize: '13.5px' }}>
            <strong>Tactical Playstyle:</strong> {profile.playstyle}
          </p>
        </div>
      )}

      {cls.signatureQuote && (
        <blockquote className="world-quote">
          <p>"{cleanEmdashes(cls.signatureQuote.text)}"</p>
          <cite>- {cls.signatureQuote.speaker}{cls.signatureQuote.context ? `, ${cleanEmdashes(cls.signatureQuote.context)}` : ''}</cite>
        </blockquote>
      )}

      {cls.description && (
        <section className="world-section">
          <h3>Essence & Core Identity</h3>
          <div className="world-prose">
            {cleanEmdashes(cls.description).split(/\n{2,}/).map((p, idx) => (
              <p key={idx} style={{ margin: '0 0 10px 0' }}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {cls.originStory && (
        <section className="world-section">
          <h3>Origin Story & World Roots</h3>
          <div className="world-prose">
            {cleanEmdashes(cls.originStory).split(/\n{2,}/).map((p, idx) => (
              <p key={idx} style={{ margin: '0 0 10px 0' }}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {cls.philosophy && (
        <section className="world-section">
          <h3>Philosophy & Paradox</h3>
          <div className="world-philosophy-grid">
            <div className="world-philosophy-card">
              <h4>Core Tenet</h4>
              <p>{cleanEmdashes(cls.philosophy.coreTenet)}</p>
            </div>
            <div className="world-philosophy-card">
              <h4>Relationship to Power</h4>
              <p>{cleanEmdashes(cls.philosophy.relationship)}</p>
            </div>
            <div className="world-philosophy-card">
              <h4>The Paradox</h4>
              <p>{cleanEmdashes(cls.philosophy.paradox)}</p>
            </div>
          </div>
        </section>
      )}

      {cls.meaningfulTradeoffs && (
        <section className="world-section world-section-highlight">
          <h3>What You Sacrifice</h3>
          <div className="world-prose">
            {cleanEmdashes(cls.meaningfulTradeoffs).split(/\n{2,}/).map((p, idx) => (
              <p key={idx} style={{ margin: '0 0 8px 0' }}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {cls.currentCrisis && (
        <section className="world-section world-section-dark">
          <h3>Current Era Crisis</h3>
          <div className="world-prose">
            {cleanEmdashes(cls.currentCrisis).split(/\n{2,}/).map((p, idx) => (
              <p key={idx} style={{ margin: '0 0 8px 0' }}>{p}</p>
            ))}
          </div>
        </section>
      )}

    {cls.classSpecificLocations && cls.classSpecificLocations.length > 0 && (
      <section className="world-section">
        <h3>Sacred Sites & Citadels</h3>
        <div className="world-card-grid">
          {cls.classSpecificLocations.map((loc, i) => (
            <div key={i} className="world-info-card">
              <h4><LoreLink termId={loc.locationId || loc.name}>{loc.name}</LoreLink></h4>
              {loc.status && <span className="world-badge">{loc.status}</span>}
              <p className="world-card-meta">{loc.description}</p>
              {loc.purpose && <p className="world-card-purpose"><strong>Purpose:</strong> {loc.purpose}</p>}
            </div>
          ))}
        </div>
      </section>
    )}

    {context && context.factions && context.factions.length > 0 && (
      <section className="world-section">
        <h3>Allied & Affiliated Factions</h3>
        <div className="world-list">
          {context.factions.map((f) => (
            <div key={f.id} className="world-list-item">
              <div className="world-faction-colors" style={{ background: f.colors?.primary || '#888' }} />
              <strong>{f.name}</strong>
              <span className="world-muted">: {f.publicGoal || f.publicDescription?.slice(0, 100)}...</span>
            </div>
          ))}
        </div>
      </section>
    )}
  </div>
  );
};

const HistoryTab = ({ cls, context }) => {
  const rawContent = cls.roleplayIdentity?.content || cls.roleplayIdentity || '';
  const parsedSections = useMemo(() => {
    return parseClassRoleplaySections(rawContent);
  }, [rawContent]);

  if (parsedSections.length === 0 && (!cls.notableFigures || cls.notableFigures.length === 0)) {
    return (
      <div className="world-section">
        <h3>Historical Annals</h3>
        <p className="world-muted">Historical records for {cls.name} are being transcribed from ancient temple archives.</p>
      </div>
    );
  }

  return (
    <div className="world-section-stack">
      {parsedSections.map((sec, i) => (
        <section key={i} className="world-section">
          <h3>{sec.title}</h3>
          <div className="world-prose">
            <RichLoreText text={sec.content} className="parchment-theme" />
          </div>
        </section>
      ))}

      {cls.notableFigures && cls.notableFigures.length > 0 && (
        <section className="world-section">
          <h3>Notable Historical Figures & Heroes</h3>
          <div className="world-card-grid">
            {cls.notableFigures.map((fig, i) => (
              <div key={i} className="world-info-card">
                <h4>{fig.name}</h4>
                {fig.title && <span className="world-card-meta">{fig.title}</span>}
                {fig.affiliation && <span className="world-card-meta">{fig.affiliation}</span>}
                {fig.status && (
                  <span className={`world-badge world-badge-${fig.status?.toLowerCase().includes('deceased') ? 'danger' : 'success'}`}>
                    {fig.status}
                  </span>
                )}
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

const OrganizationsTab = ({ cls, context, classId }) => {
  // Aggregate organizations from context, cls, and built-in synthesizer
  const orgs = useMemo(() => {
    const list = [];
    if (context?.classInfo?.organizations && context.classInfo.organizations.length > 0) {
      list.push(...context.classInfo.organizations);
    }
    if (cls.organizations && Array.isArray(cls.organizations)) {
      list.push(...cls.organizations);
    }
    const defaultOrgs = DEFAULT_CLASS_ORGANIZATIONS[classId?.toLowerCase()] || [];
    defaultOrgs.forEach(d => {
      if (!list.some(o => o.name === d.name)) {
        list.push(d);
      }
    });

    // Synthesize from sacred locations if still empty
    if (list.length === 0 && cls.classSpecificLocations) {
      cls.classSpecificLocations.forEach(loc => {
        list.push({
          name: `The Order of ${loc.name}`,
          headquarters: loc.name,
          leader: 'Presiding Elder',
          status: loc.status || 'Active',
          description: loc.description || `Sanctuary and training enclave dedicated to the mastery of ${cls.name} traditions.`
        });
      });
    }

    return list;
  }, [context, cls, classId]);

  if (orgs.length === 0) {
    return (
      <div className="world-section">
        <h3>Holy Orders, Guilds & Enclaves</h3>
        <p className="world-muted">No formalized organizations recorded. Practitioners of this calling operate as solitary wanderers or unbound agents.</p>
      </div>
    );
  }

  return (
    <div className="world-section-stack">
      {orgs.map((org, i) => (
        <section key={i} className="world-section">
          <h3>{org.name}</h3>
          <div className="world-meta-row" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {org.leader && <span><strong>Leader:</strong> {org.leader}</span>}
            {org.headquarters && <span><strong>Headquarters:</strong> <LoreLink termId={org.headquarters}>{org.headquarters}</LoreLink></span>}
            {org.status && <span className={`world-badge world-badge-${org.status.toLowerCase().includes('active') ? 'success' : 'warning'}`}>{org.status}</span>}
          </div>
          <p className="world-prose">{org.description}</p>
          {org.notableMembers && org.notableMembers.length > 0 && (
            <p className="world-card-meta"><strong>Notable members:</strong> {org.notableMembers.join(', ')}</p>
          )}
          {org.rivalOrganizations && org.rivalOrganizations.length > 0 && (
            <p className="world-card-meta"><strong>Rivals:</strong> {org.rivalOrganizations.join(', ')}</p>
          )}
        </section>
      ))}
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
          <h3>Subclass Philosophy</h3>
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
