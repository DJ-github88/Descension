import React, { useEffect, useState, useMemo, useContext } from 'react';
import useClassLoreStore from '../../store/classLoreStore';
import useWorldStore from '../../store/worldStore';
import { getClassFlavorProfile } from '../../data/classes/classFlavorProfiles';
import { CLASS_SPECIALIZATIONS } from '../../data/classSpellCategories';
import ClassIcon from '../common/ClassIcon';
import LoreLink from '../common/LoreLink';
import RichLoreText from '../common/RichLoreText';
import { SpellLibraryStateContext, SpellLibraryDispatchContext } from '../spellcrafting-wizard/context/SpellLibraryContext';

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
      name: 'The Øsling Outlaw Host',
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
      description: 'Dogmatic witch hunters hunting heretical cults of Keth Amar and prosecuting violations of the Sovereign Ledger.',
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
  const { getAllSubclassInfo, loadClasses, loaded } = useClassLoreStore();
  const { getFullContextForClass, getClass } = useWorldStore();
  const [context, setContext] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!loaded) loadClasses();
  }, [loaded, loadClasses]);

  useEffect(() => {
    const ctx = getFullContextForClass(classId);
    setContext(ctx);
  }, [classId, getFullContextForClass]);

  const cls = getClass ? getClass(classId) : useClassLoreStore.getState().getClass(classId);
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
    { key: 'spells', label: 'Spells, Rites & Spellcraft', icon: 'fa-wand-magic-sparkles' },
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
            <span className="world-subtitle">{cls.roleplayIdentity?.title || cls.combatRole?.title || cls.tagline || 'Living Class Codex'}</span>
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

        {activeTab === 'spells' && (
          <SpellsTab cls={cls} />
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

// Subclass/spec tab — was referenced but never defined, so opening any
// subclass tab crashed the codex. Renders the seeded subclass lore fields.
const SubclassTab = ({ subclass }) => {
  if (!subclass) return null;
  const sections = [
    { label: 'Philosophy', icon: 'fa-book-open', body: subclass.philosophy },
    { label: 'Psychological Profile', icon: 'fa-brain', body: subclass.psychologicalProfile },
    { label: 'Role in Society', icon: 'fa-landmark', body: subclass.roleInSociety },
    { label: 'Forbidden Practices', icon: 'fa-ban', body: subclass.forbiddenPractices },
    { label: 'Signature Ritual', icon: 'fa-wand-sparkles', body: subclass.signatureRitual },
    { label: 'Description', icon: 'fa-feather', body: subclass.description }
  ].filter((s) => s.body);

  return (
    <div className="world-section-stack">
      <div className="world-section world-section-highlight class-codex-hero">
        <div className="class-codex-hero-header">
          <div>
            <span className="class-archetype-tag">Specialization</span>
            <h3 style={{ margin: '4px 0 8px 0', borderBottom: 'none' }}>{subclass.name}</h3>
          </div>
        </div>
        {sections.map((s) => (
          <section key={s.label} className="world-section" style={{ marginTop: '10px' }}>
            <h3><i className={`fas ${s.icon}`} style={{ color: '#d4af37', marginRight: '8px' }}></i>{s.label}</h3>
            <div className="world-prose">
              {cleanEmdashes(s.body).split(/\n{2,}/).map((p, idx) => (
                <p key={idx} style={{ margin: '0 0 8px 0' }}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

const OverviewTab = ({ cls, context }) => {  const profile = getClassFlavorProfile(cls.id);
  const traditionName = cls.tradition || profile?.tradition || 'Living Calling';
  const roleName = cls.role || profile?.role || 'Tactical Vanguard';
  const resourceName = cls.resourceName || profile?.resourceName || 'Unique Resource';
  const tagline = cls.tagline || profile?.tagline;
  const keyFeatures = cls.keyFeatures || profile?.keyFeatures || [];
  const playstyle = cls.tacticalPlaystyle || profile?.playstyle || cls.description;

  return (
    <div className="world-section-stack">
      <div className="world-section world-section-highlight class-codex-hero">
        <div className="class-codex-hero-header">
          <div>
            <span className="class-archetype-tag">{traditionName}</span>
            <h3 style={{ margin: '4px 0 8px 0', borderBottom: 'none' }}>{roleName}</h3>
          </div>
          <span className="class-pill class-resource-pill" style={{ fontSize: '12px', padding: '4px 10px' }}>
            <i className={`fas ${profile?.resourceIcon || 'fa-bolt'}`} /> {resourceName}
          </span>
        </div>

        {tagline && (
          <div className="class-tagline-box" style={{ margin: '8px 0 12px 0' }}>
            <p className="class-tagline-text" style={{ fontSize: '13.5px' }}>"{tagline}"</p>
          </div>
        )}

        {keyFeatures.length > 0 && (
          <div className="class-mechanics-pills" style={{ marginBottom: '10px' }}>
            {keyFeatures.map((feat, idx) => (
              <span key={idx} className="class-pill class-feature-pill" style={{ fontSize: '11px', padding: '3px 9px' }}>
                <i className="fas fa-sparkles" /> {feat}
              </span>
            ))}
          </div>
        )}

        {playstyle && (
          <p className="world-prose" style={{ margin: 0, fontSize: '13.5px' }}>
            <strong>Tactical Playstyle:</strong> {playstyle}
          </p>
        )}
      </div>

      {cls.specialRules && (
        <section className="world-section world-section-highlight" style={{ borderLeft: '3px solid #d4af37' }}>
          <h3><i className="fas fa-bolt" style={{ color: '#d4af37', marginRight: '8px' }}></i>Special Tactical Rules &amp; Triggers</h3>
          <div className="world-prose">
            {cleanEmdashes(cls.specialRules).split(/\n{2,}/).map((p, idx) => (
              <p key={idx} style={{ margin: '0 0 8px 0', fontWeight: 500 }}>{p}</p>
            ))}
          </div>
        </section>
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

const SpellsTab = ({ cls }) => {
  const [activeSpecialization, setActiveSpecialization] = useState('all');
  const [spellSearch, setSpellSearch] = useState('');
  const [showQuickCraftModal, setShowQuickCraftModal] = useState(false);
  const [showLibraryPickerModal, setShowLibraryPickerModal] = useState(false);
  const [selectedLibrarySpellId, setSelectedLibrarySpellId] = useState('');

  // Shared spell library context — the same library the Spellcrafting wizard
  // uses. Routing rites through the context (instead of raw localStorage)
  // keeps them cloud-synced via the SpellPersistenceBridge and lets edits made
  // elsewhere show up here reactively. Consumed via the raw contexts because
  // this codex can render outside the provider (tests / embeds); in that case
  // we fall back to reading + writing the shared localStorage library.
  const libraryState = useContext(SpellLibraryStateContext);
  const dispatchSpell = useContext(SpellLibraryDispatchContext);

  const librarySpells = useMemo(
    () => libraryState?.spells || [],
    [libraryState]
  );
  const customSpells = useMemo(() => {
    const normName = cls.name?.toLowerCase();
    const normId = cls.id?.toLowerCase();
    return librarySpells.filter((s) => {
      const sClass = (s.class || s.characterClass || s.associatedClass || '').toLowerCase();
      return sClass === normName || sClass === normId;
    });
  }, [librarySpells, cls.name, cls.id]);

  // Add a rite to the shared library: via the provider when present (gets
  // cloud-synced), otherwise direct to the shared localStorage library.
  const addRiteToLibrary = (spellObj) => {
    if (dispatchSpell) {
      dispatchSpell({ type: 'ADD_SPELL_DIRECT', payload: spellObj });
      return;
    }
    try {
      const stored = localStorage.getItem('spell_library_data');
      let storedLibrary = { spells: [] };
      if (stored) {
        const parsed = JSON.parse(stored);
        storedLibrary = parsed.data || parsed;
        if (!storedLibrary.spells) storedLibrary.spells = [];
      }
      storedLibrary.spells.push(spellObj);
      localStorage.setItem('spell_library_data', JSON.stringify({ version: 1, data: storedLibrary }));
    } catch (err) {
      console.error('Error saving spell to library:', err);
    }
  };

  // Form states for quick crafting
  const [newSpellName, setNewSpellName] = useState('');
  const [newSpellDiscipline, setNewSpellDiscipline] = useState('Arcane Matrix');
  const [newSpellSpecialization, setNewSpellSpecialization] = useState('');
  const [newSpellApCost, setNewSpellApCost] = useState('2 AP');
  const [newSpellManaCost, setNewSpellManaCost] = useState('10 Mana');
  const [newSpellDesc, setNewSpellDesc] = useState('');
  const [newSpellProcRule, setNewSpellProcRule] = useState('');

  // Mythrill class specialization mapping lookup
  const classSpecInfo = CLASS_SPECIALIZATIONS[cls.name] || null;
  const specList = classSpecInfo?.specializations || [];

  const handleLaunchSpellWizard = () => {
    const spellEvent = new CustomEvent('openSpellWizardForClass', {
      detail: { className: cls.name, classId: cls.id }
    });
    window.dispatchEvent(spellEvent);
    setShowQuickCraftModal(true);
  };

  const handleAttachSpellFromLibrary = (e) => {
    e.preventDefault();
    if (!selectedLibrarySpellId) return;
    const targetSpell = librarySpells.find((s) => s.id === selectedLibrarySpellId);
    if (!targetSpell) return;

    const attached = {
      ...targetSpell,
      id: `spell-attached-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      class: cls.name,
      characterClass: cls.name,
      associatedClass: cls.name,
      isCustom: true
    };

    // Route through the shared spell library so the rite is persisted and
    // cloud-synced when the provider is available.
    addRiteToLibrary(attached);

    setShowLibraryPickerModal(false);
    setSelectedLibrarySpellId('');
  };

  const handleSaveSpell = (e) => {
    e.preventDefault();
    if (!newSpellName.trim()) return;

    const newSpellObj = {
      id: `spell-custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: newSpellName.trim(),
      discipline: newSpellDiscipline,
      school: newSpellDiscipline,
      specialization: newSpellSpecialization || (specList[0]?.name || 'Universal Matrix'),
      cost: `${newSpellApCost} | ${newSpellManaCost}`,
      apCost: newSpellApCost,
      manaCost: newSpellManaCost,
      actionType: newSpellApCost,
      description: newSpellDesc.trim(),
      procRule: newSpellProcRule.trim(),
      class: cls.name,
      characterClass: cls.name,
      associatedClass: cls.name,
      isCustom: true,
      dateCreated: new Date().toISOString()
    };

    // Route through the shared spell library so the rite is persisted and
    // cloud-synced when the provider is available.
    addRiteToLibrary(newSpellObj);

    setShowQuickCraftModal(false);
    setNewSpellName('');
    setNewSpellDesc('');
    setNewSpellProcRule('');
  };

  const allDisplaySpells = [
    ...(cls.spells || []),
    ...customSpells
  ];

  const filteredSpells = allDisplaySpells.filter((s) => {
    if (activeSpecialization !== 'all') {
      const spec = (s.specialization || '').toLowerCase();
      if (!spec.includes(activeSpecialization.toLowerCase())) return false;
    }

    if (spellSearch.trim()) {
      const q = spellSearch.toLowerCase();
      const matchName = s.name?.toLowerCase().includes(q);
      const matchDesc = s.description?.toLowerCase().includes(q);
      const matchDisc = (s.discipline || s.school || '')?.toLowerCase().includes(q);
      const matchProc = s.procRule?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchDisc && !matchProc) return false;
    }
    return true;
  });

  return (
    <div className="world-section-stack">
      {classSpecInfo && (
        <div style={{ background: 'rgba(26, 20, 16, 0.7)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '6px', padding: '12px 16px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <i className="fas fa-hat-wizard" style={{ color: '#d4af37' }} />
            <strong style={{ color: '#f5c542', fontSize: '13.5px' }}>{classSpecInfo.path}</strong>
            <span style={{ fontSize: '12px', color: '#999' }}>— {specList.length} Archetypal Matrices</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`world-action-btn ${activeSpecialization === 'all' ? 'primary' : ''}`}
              style={{ fontSize: '11px', padding: '3px 10px' }}
              onClick={() => setActiveSpecialization('all')}
            >
              All Matrices ({allDisplaySpells.length})
            </button>
            {specList.map((spec) => (
              <button
                key={spec.id}
                type="button"
                className={`world-action-btn ${activeSpecialization === spec.id ? 'primary' : ''}`}
                style={{ fontSize: '11px', padding: '3px 10px' }}
                onClick={() => setActiveSpecialization(activeSpecialization === spec.id ? 'all' : spec.id)}
              >
                {spec.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="world-classes-toolbar" style={{ marginTop: 0 }}>
        <div className="classes-search-box">
          <i className="fas fa-search" />
          <input
            type="text"
            placeholder={`Search spells, matrices & rites for ${cls.name}...`}
            value={spellSearch}
            onChange={(e) => setSpellSearch(e.target.value)}
          />
          {spellSearch && (
            <button className="btn-clear-search" onClick={() => setSpellSearch('')} title="Clear search">
              <i className="fas fa-times" />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
          <button
            type="button"
            className="world-action-btn"
            onClick={() => setShowLibraryPickerModal(true)}
            title="Import or link existing spell from Spellcrafting Library"
          >
            <i className="fas fa-book-sparkles"></i> Select from Library
          </button>

          <button
            type="button"
            className="world-action-btn primary"
            onClick={handleLaunchSpellWizard}
            title="Inscribe new spellcard / Launch Spellcrafting Wizard"
          >
            <i className="fas fa-wand-magic-sparkles"></i> Inscribe Custom Rite
          </button>
        </div>
      </div>

      {filteredSpells.length === 0 ? (
        <div className="world-section" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <i className="fas fa-wand-magic-sparkles" style={{ fontSize: '32px', color: '#d4af37', opacity: 0.7, marginBottom: '12px', display: 'block' }} />
          <h3>No Spells or Matrices Inscribed Yet</h3>
          <p className="world-muted" style={{ maxWidth: '520px', margin: '0 auto 16px' }}>
            Inscribe arcane matrices, passive battle procs (e.g. <em>"Every 3rd cast triggers an elemental cascade"</em>), and signature rites for the <strong>{cls.name}</strong> tradition.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button type="button" className="world-action-btn" onClick={() => setShowLibraryPickerModal(true)}>
              <i className="fas fa-book-sparkles"></i> Choose from Library
            </button>
            <button type="button" className="world-action-btn primary" onClick={handleLaunchSpellWizard}>
              <i className="fas fa-plus"></i> Inscribe First Rite
            </button>
          </div>
        </div>
      ) : (
        <div className="world-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {filteredSpells.map((s, idx) => (
            <div key={s.id || idx} className="world-info-card" style={{ background: 'rgba(20, 20, 26, 0.75)', border: '1px solid rgba(212, 175, 55, 0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: '#3a2412', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5c542' }}>
                    <i className="fas fa-sparkles" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px', color: '#fff' }}>{s.name}</h4>
                    <span style={{ fontSize: '11px', color: '#aaa' }}>{s.specialization || s.discipline || s.school || 'Universal Matrix'}</span>
                  </div>
                </div>
                <span className="world-badge" style={{ background: '#2c2214', color: '#e0c068', border: '1px solid #7d6023' }}>
                  {s.discipline || 'Arcane Matrix'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '8px', fontSize: '11.5px', color: '#888' }}>
                <span><i className="fas fa-bolt" /> {s.apCost || s.actionType || '2 AP'}</span>
                <span><i className="fas fa-droplet" /> {s.manaCost || s.cost || '10 Mana'}</span>
              </div>

              <p className="world-prose" style={{ fontSize: '13px', margin: '0 0 10px 0', color: '#ccc' }}>
                {s.description}
              </p>

              {s.procRule && (
                <div style={{ background: 'rgba(212, 175, 55, 0.08)', borderLeft: '3px solid #d4af37', padding: '6px 10px', borderRadius: '3px', fontSize: '12px', color: '#f0e6d2' }}>
                  <strong style={{ color: '#d4af37' }}><i className="fas fa-repeat" /> Special Proc:</strong> {s.procRule}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Select Existing Spell from Library Modal */}
      {showLibraryPickerModal && (
        <div className="world-modal-overlay" onClick={() => setShowLibraryPickerModal(false)}>
          <div className="world-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="world-modal-header">
              <div className="world-modal-title">
                <i className="fas fa-book-sparkles"></i>
                <h3>Select Spell from Library for {cls.name}</h3>
              </div>
              <button className="world-modal-close" onClick={() => setShowLibraryPickerModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleAttachSpellFromLibrary}>
              <div className="world-modal-body">
                {librarySpells.length === 0 ? (
                  <p className="world-muted" style={{ textAlign: 'center', padding: '20px' }}>
                    No spells currently exist in your Spellcrafting Library. Use the <strong>Inscribe Custom Rite</strong> button or the Spell Wizard to forge new spells.
                  </p>
                ) : (
                  <div className="world-form-group">
                    <label>Choose Spell / Matrix</label>
                    <select
                      value={selectedLibrarySpellId}
                      onChange={(e) => setSelectedLibrarySpellId(e.target.value)}
                      required
                    >
                      <option value="">-- Choose a Spell from Library --</option>
                      {librarySpells.map((sp) => (
                        <option key={sp.id} value={sp.id}>
                          {sp.name} ({sp.school || sp.discipline || 'Arcane Matrix'} - {sp.characterClass || 'General'})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="world-modal-actions">
                <button type="button" className="world-action-btn" onClick={() => setShowLibraryPickerModal(false)}>
                  Cancel
                </button>
                {librarySpells.length > 0 && (
                  <button type="submit" className="world-action-btn primary" disabled={!selectedLibrarySpellId}>
                    <i className="fas fa-check"></i> Add to {cls.name}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Spell Inscriber Modal */}
      {showQuickCraftModal && (
        <div className="world-modal-overlay" onClick={() => setShowQuickCraftModal(false)}>
          <div className="world-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="world-modal-header">
              <div className="world-modal-title">
                <i className="fas fa-wand-magic-sparkles"></i>
                <h3>Inscribe Arcane Rite for {cls.name}</h3>
              </div>
              <button className="world-modal-close" onClick={() => setShowQuickCraftModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSaveSpell}>
              <div className="world-modal-body">
                <div className="world-form-group">
                  <label>Spell / Rite Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ray of Cinders, Matrix of Silent Flame, Chrono Stride..."
                    value={newSpellName}
                    onChange={(e) => setNewSpellName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="world-form-row">
                  <div className="world-form-group">
                    <label>Discipline / Sphere</label>
                    <input
                      type="text"
                      placeholder="e.g. Arcane Matrix, Solar Inscription, Void Rite"
                      value={newSpellDiscipline}
                      onChange={(e) => setNewSpellDiscipline(e.target.value)}
                    />
                  </div>
                  <div className="world-form-group">
                    <label>Specialization / Archetype</label>
                    {specList.length > 0 ? (
                      <select
                        value={newSpellSpecialization}
                        onChange={(e) => setNewSpellSpecialization(e.target.value)}
                      >
                        <option value="">-- Select Specialization --</option>
                        {specList.map((s) => (
                          <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="e.g. Vanguard, Inferno, Chronomancy"
                        value={newSpellSpecialization}
                        onChange={(e) => setNewSpellSpecialization(e.target.value)}
                      />
                    )}
                  </div>
                </div>

                <div className="world-form-row">
                  <div className="world-form-group">
                    <label>Action Point Cost</label>
                    <input
                      type="text"
                      placeholder="e.g. 1 AP, 2 AP, Reaction"
                      value={newSpellApCost}
                      onChange={(e) => setNewSpellApCost(e.target.value)}
                    />
                  </div>
                  <div className="world-form-group">
                    <label>Mana / Resource Cost</label>
                    <input
                      type="text"
                      placeholder="e.g. 10 Mana, 25 Mana, 2 Sol Charges"
                      value={newSpellManaCost}
                      onChange={(e) => setNewSpellManaCost(e.target.value)}
                    />
                  </div>
                </div>

                <div className="world-form-group">
                  <label>Spell Effect &amp; Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the spell attack, elemental damage, saving throw, and visual manifestation..."
                    value={newSpellDesc}
                    onChange={(e) => setNewSpellDesc(e.target.value)}
                  />
                </div>

                <div className="world-form-group">
                  <label>Special Tactical Rule / Trigger (e.g. Every 3rd cast, Crit Proc)</label>
                  <input
                    type="text"
                    placeholder="e.g. Every 3rd cast unleashes an automatic radial shockwave dealing 2d6 extra elemental damage."
                    value={newSpellProcRule}
                    onChange={(e) => setNewSpellProcRule(e.target.value)}
                  />
                </div>
              </div>
              <div className="world-modal-actions">
                <button type="button" className="world-action-btn" onClick={() => setShowQuickCraftModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="world-action-btn primary">
                  <i className="fas fa-wand-magic-sparkles"></i> Inscribe Rite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassLoreDetail;
