import React, { useState, useEffect, useMemo } from 'react';
import universalEntityService from '../../services/universalEntityService';
import useCustomLineageStore from '../../store/customLineageStore';
import useFamilyTreeStore from '../../store/familyTreeStore';
import useBookStore from '../../store/bookStore';
import { CREATURE_PRESETS, SPELL_PRESETS, normalizeDangerLevel, normalizeBookItemData } from './BookTtrpgBlocks';
import './BookDocumentEditor.css';
import './BookAtmosphere.css';

const CHRONICLE_SECTIONS = [
  {
    id: 'world',
    title: 'Realms, Factions & World Lore',
    chapterTitle: 'Chapter I: Realms & Factions of the Realm',
    subtitle: 'Charted Territories, Sovereign Houses & Historical Decrees',
    epigraph: '“Every border is first drawn in blood, then sealed in parchment.”',
    icon: 'fa-landmark',
    description: 'Locations, settlements, factions, and world lore dossiers.'
  },
  {
    id: 'lineage_dynasty',
    title: 'Bloodlines & Noble Dynasties',
    chapterTitle: 'Chapter II: Bloodlines & Sovereign Dynasties',
    subtitle: 'Ancestral Heritages, Scions & Dynastic Ties',
    epigraph: '“To know a house is to trace the roots that feed its crown.”',
    icon: 'fa-dna',
    description: 'Custom lineages from Lineage Studio and family trees.'
  },
  {
    id: 'bestiary',
    title: 'Dramatis Personae & Bestiary',
    chapterTitle: 'Chapter III: Dramatis Personae & Bestiary',
    subtitle: 'Notable Figures, Denizens & Adversaries',
    epigraph: '“Not all monsters lurk in the dark; some wear the livery of courts.”',
    icon: 'fa-dragon',
    description: 'NPC dossiers and Descension creature statblocks.'
  },
  {
    id: 'campaign_plots',
    title: 'Quests, Plot Arcs & Journal Notes',
    chapterTitle: 'Chapter IV: Quests & Unfolding Chronicles',
    subtitle: 'Active Hooks, Campaign Milestones & Field Notes',
    epigraph: '“Destiny is merely a rumor until someone draws steel to answer it.”',
    icon: 'fa-scroll',
    description: 'Campaign quests, plot threads, and journal board entries.'
  },
  {
    id: 'magic',
    title: 'Arcane Formulae & Relics',
    chapterTitle: 'Chapter V: Grimoire & Reliquary',
    subtitle: 'Inscribed Incantations, Artifacts & Armaments',
    epigraph: '“Steel rusts and empires fall, yet the rune remembers its charge.”',
    icon: 'fa-wand-magic-sparkles',
    description: 'Descension spells from your Spellbook and forged items.'
  }
];

const classifyEntitySection = (entity) => {
  const t = String(entity?.type || '').toLowerCase();
  const c = String(entity?.category || '').toLowerCase();
  if (t === 'lineage' || t === 'dynasty' || c.includes('lineage') || c.includes('dynasty')) return 'lineage_dynasty';
  if (t === 'quest' || t === 'plot' || t === 'plot_thread' || t === 'note' || t === 'orb' || c.includes('quest') || c.includes('plot') || c.includes('journal')) {
    return 'campaign_plots';
  }
  if (t === 'creature' || t === 'monster' || t === 'npc' || c.includes('bestiary') || c.includes('npc')) return 'bestiary';
  if (t === 'spell' || t === 'item' || t === 'relic' || c.includes('spell') || c.includes('item')) return 'magic';
  return 'world';
};

const convertEntityToBlock = (entity, idx, syncMode = 'live') => {
  const raw = entity.raw || entity;
  const t = String(entity.type || '').toLowerCase();
  const col = idx % 2 === 0 ? 'left' : 'right';
  const baseMeta = {
    id: `compiled-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
    linkedEntityId: entity.id || raw.id || null,
    syncMode,
    column: col
  };

  if (t === 'lineage') {
    return {
      ...baseMeta,
      type: 'lineage_showcase',
      name: raw.name || entity.name,
      essence: raw.essence || raw.cardFlavor || 'Ancestral Bloodline',
      description: raw.description || entity.summary || '',
      abilityModifiers: raw.abilityModifiers || { STR: 1, AGI: 0, CON: 1, INT: 0, SPI: 1, CHA: 0 },
      baseTraits: raw.baseTraits || { size: 'Medium', baseSpeed: 30, baseHp: 28, baseMana: 20 },
      racialPassives: raw.racialPassives || [],
      racialAbilities: raw.racialAbilities || []
    };
  }

  if (t === 'dynasty') {
    return {
      ...baseMeta,
      type: 'dynasty_tree',
      name: raw.name || entity.name,
      description: raw.description || entity.summary || '',
      nodes: Array.isArray(raw.nodes) && raw.nodes.length > 0
        ? raw.nodes
        : [{ id: 'n-1', name: raw.founder || entity.name, title: ' Sovereign Founder', role: 'Patriarch / Matriarch' }],
      relationships: Array.isArray(raw.relationships) ? raw.relationships : []
    };
  }

  if (t === 'creature' || t === 'monster') {
    return {
      ...baseMeta,
      type: 'creature_statblock',
      name: raw.name || entity.name,
      creatureType: raw.creatureType || raw.type || 'Medium Denizen',
      dangerLevel: normalizeDangerLevel(raw.dangerLevel, raw.cr),
      hp: typeof raw.hp === 'object' ? (raw.hp.max || 75) : (raw.hp || 75),
      mana: typeof raw.mana === 'object' ? (raw.mana.max || 20) : (raw.mana || 20),
      ap: raw.ap || 3,
      speed: raw.speed || '30 ft.',
      stats: raw.stats || { strength: 14, agility: 14, constitution: 14, intelligence: 10, spirit: 12, charisma: 10 },
      resistances: raw.resistances || '',
      traits: Array.isArray(raw.traits) && raw.traits.length > 0
        ? raw.traits
        : [{ name: 'Realm Instinct', desc: entity.summary || 'Adapted to the harsh terrain of the realm.' }],
      actions: Array.isArray(raw.actions) && raw.actions.length > 0
        ? raw.actions
        : [{ name: 'Signature Strike (1 AP)', desc: 'Melee Strike: +6 to hit, deals 2d8+3 Physical damage.' }]
    };
  }

  if (t === 'npc') {
    return {
      ...baseMeta,
      type: 'npc_dossier',
      name: raw.name || entity.name,
      role: raw.role || raw.title || entity.category || 'Notable Figure',
      disposition: raw.disposition || 'Neutral',
      faction: raw.faction || '',
      personality: raw.personality || '',
      description: raw.description || entity.summary || '',
      quote: raw.quote || ''
    };
  }

  if (t === 'quest') {
    return {
      ...baseMeta,
      type: 'quest_hook',
      title: raw.title || raw.name || entity.name,
      level: raw.level || 3,
      difficulty: raw.difficulty || 'Medium',
      status: raw.status || 'Active',
      giver: raw.giver || 'Realm Chronicle',
      description: raw.description || entity.summary || '',
      objectives: Array.isArray(raw.objectives) && raw.objectives.length > 0
        ? raw.objectives
        : [{ text: `Investigate rumors surrounding ${entity.name}`, completed: false }],
      rewards: raw.rewards || { experience: 350, currency: { gold: 25 } }
    };
  }

  if (t === 'plot' || t === 'plot_thread') {
    return {
      ...baseMeta,
      type: 'plot_thread',
      title: raw.title || raw.name || entity.name,
      status: raw.status || 'Active',
      act: raw.act || 1,
      summary: raw.summary || raw.coreConflict || entity.summary || '',
      beats: Array.isArray(raw.beats) && raw.beats.length > 0
        ? raw.beats
        : [{ title: 'Inciting Omen', description: entity.summary || '', completed: false }]
    };
  }

  if (t === 'spell') {
    return {
      ...baseMeta,
      type: 'spell_formula',
      name: raw.name || entity.name,
      category: raw.category || 'damage',
      damageType: raw.damageType || 'wyrd',
      damageTypes: raw.damageTypes || ['wyrd'],
      tier: raw.tier || 2,
      ap: raw.ap || 2,
      manaCost: raw.manaCost || 15,
      range: raw.range || '45 ft.',
      duration: raw.duration || 'Instantaneous',
      effect: raw.effect || raw.description || entity.summary || ''
    };
  }

  if (t === 'item' || t === 'relic') {
    return {
      ...normalizeBookItemData(raw),
      ...baseMeta,
      type: 'item_card',
      name: raw.name || entity.name,
      description: raw.description || entity.summary || ''
    };
  }

  if (t === 'location' || t === 'region' || t === 'settlement') {
    return {
      ...baseMeta,
      type: 'location_showcase',
      name: raw.name || entity.name,
      locationType: raw.locationType || entity.category || 'Landmark',
      region: raw.region || 'Charted Realm',
      dangerRating: raw.dangerRating || raw.dangerLevel || 'Moderate',
      description: raw.description || entity.summary || '',
      secrets: raw.secrets || ''
    };
  }

  return {
    ...baseMeta,
    type: 'callout',
    calloutType: 'info',
    title: entity.name || 'Archive Entry',
    content: entity.summary || raw.description || 'Recorded in the realm archives.'
  };
};

const BookCampaignImporterModal = ({
  isOpen,
  onClose,
  currentBookId = null,
  onCompiled
}) => {
  const compileCampaignChronicle = useBookStore((s) => s.compileCampaignChronicle);
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [targetMode, setTargetMode] = useState(currentBookId ? 'append' : 'new'); // 'new' | 'append'
  const [bookTitle, setBookTitle] = useState('Grand Campaign Compendium');
  const [bookSubtitle, setBookSubtitle] = useState('A Living Sourcebook of Realms, Bloodlines, Dramatis Personae & Relics');
  const [syncMode, setSyncMode] = useState('live');
  const [selectedSections, setSelectedSections] = useState({
    world: true,
    lineage_dynasty: true,
    bestiary: true,
    campaign_plots: true,
    magic: true
  });
  const [maxPerSection, setMaxPerSection] = useState(6);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    Promise.all([
      universalEntityService.getAllBookEmbeddables({ limit: 400 }),
      Promise.resolve(useCustomLineageStore.getState().lineages || []),
      Promise.resolve(useFamilyTreeStore.getState().trees || [])
    ])
      .then(([items, customLineages, familyTrees]) => {
        const enriched = [...(items || [])];
        customLineages.forEach((lin) => {
          if (lin && !enriched.some((e) => e.type === 'lineage' && e.name === lin.name)) {
            enriched.push({
              id: lin.id || `lineage:${lin.name}`,
              type: 'lineage',
              name: lin.name,
              category: 'Custom Lineage',
              summary: lin.cardFlavor || lin.description || 'Custom bloodline.',
              raw: lin
            });
          }
        });
        familyTrees.forEach((tree) => {
          if (tree && !enriched.some((e) => e.type === 'dynasty' && e.name === tree.name)) {
            enriched.push({
              id: tree.id || `dynasty:${tree.name}`,
              type: 'dynasty',
              name: tree.name,
              category: 'Dynasty & Family Tree',
              summary: tree.description || `${tree.nodes?.length || 0} Dynastic Members`,
              raw: tree
            });
          }
        });
        if (!enriched.some((e) => e.type === 'creature')) {
          CREATURE_PRESETS.forEach((c) => {
            enriched.push({
              id: `preset-creature-${c.name}`,
              type: 'creature',
              name: c.name,
              category: 'Bestiary',
              summary: c.creatureType,
              raw: c
            });
          });
        }
        if (!enriched.some((e) => e.type === 'spell')) {
          SPELL_PRESETS.forEach((s) => {
            enriched.push({
              id: `preset-spell-${s.name}`,
              type: 'spell',
              name: s.name,
              category: 'Spell Formula',
              summary: s.effect,
              raw: s
            });
          });
        }
        setEntities(enriched);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isOpen]);

  const groupedCounts = useMemo(() => {
    const counts = { world: 0, lineage_dynasty: 0, bestiary: 0, campaign_plots: 0, magic: 0 };
    entities.forEach((e) => {
      const sec = classifyEntitySection(e);
      counts[sec] = (counts[sec] || 0) + 1;
    });
    return counts;
  }, [entities]);

  if (!isOpen) return null;

  const toggleSection = (secId) => {
    setSelectedSections((prev) => ({ ...prev, [secId]: !prev[secId] }));
  };

  const handleCompile = () => {
    const activeSections = CHRONICLE_SECTIONS.filter((s) => selectedSections[s.id]);
    if (activeSections.length === 0) return;

    const compiledChapters = [];
    const compiledTerms = [];

    activeSections.forEach((sec, secIdx) => {
      const sectionEntities = entities
        .filter((e) => classifyEntitySection(e) === sec.id)
        .slice(0, maxPerSection);

      sectionEntities.forEach((ent) => {
        if (ent.name) {
          compiledTerms.push({
            id: `term-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            name: ent.name,
            alias: ent.category || sec.title,
            category: ent.category || 'Compiled Lore',
            definition: ent.summary || `Compiled from ${sec.title}.`,
            icon: sec.icon,
            color: '#663c32'
          });
        }
      });

      const allBlocks = [
        {
          id: `ch-head-${sec.id}-${Date.now()}`,
          type: 'header',
          level: 1,
          text: sec.title,
          variant: secIdx % 2 === 0 ? 'banner-dark' : 'banner-crimson',
          column: 'left'
        },
        {
          id: `ch-intro-${sec.id}-${Date.now()}`,
          type: 'paragraph',
          hasDropCap: true,
          text: `Recorded herein are the canonical entries of ${sec.title.toLowerCase()}, bound in ${
            syncMode === 'live' ? 'live synchronization with the campaign archives' : 'an immutable archival snapshot'
          }. Cross-references such as ${
            sectionEntities.slice(0, 2).map((e) => `[[${e.name}]]`).join(' and ') || '[[Ancient Mist]]'
          } link directly across this tome.`,
          column: 'left'
        },
        ...sectionEntities.map((ent, idx) => convertEntityToBlock(ent, idx, syncMode))
      ];

      // Paginate into clean 4-block pages so spreads stay balanced
      const pages = [];
      const chunkSize = 4;
      for (let i = 0; i < allBlocks.length; i += chunkSize) {
        const pageBlocks = allBlocks.slice(i, i + chunkSize).map((b, bIdx) => ({
          ...b,
          column: bIdx < Math.ceil(chunkSize / 2) ? 'left' : 'right'
        }));
        pages.push({
          id: `pg-comp-${sec.id}-${i}-${Date.now()}`,
          pageNumber: pages.length + 1,
          headerTitle: sec.title,
          layout: 'two-column',
          blocks: pageBlocks
        });
      }

      compiledChapters.push({
        id: `ch-comp-${sec.id}-${Date.now()}`,
        title: sec.chapterTitle,
        subtitle: sec.subtitle,
        epigraph: sec.epigraph,
        pages
      });
    });

    const resultingBookId = compileCampaignChronicle({
      targetBookId: targetMode === 'append' && currentBookId ? currentBookId : null,
      title: bookTitle,
      subtitle: bookSubtitle,
      layout: 'book-spread',
      chapters: compiledChapters,
      customTerms: compiledTerms
    });

    if (onCompiled) onCompiled(resultingBookId);
    onClose();
  };

  return (
    <div className="book-modal-backdrop" onClick={onClose}>
      <div
        className="book-creature-picker-modal book-campaign-importer-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Compile Campaign & World Chronicle"
        style={{ maxWidth: '860px' }}
      >
        <div className="picker-modal-header">
          <div className="picker-header-title-group">
            <i className="fas fa-book-journal-whills"></i>
            <div>
              <h3>Campaign &amp; World Auto-Chronicle Compiler</h3>
              <p>Weave your World Lore, Lineages, Dynasties, Bestiary, Quests, and Relics into a formatted TTRPG Sourcebook</p>
            </div>
          </div>
          <button type="button" className="modal-close-x" onClick={onClose} aria-label="Close Compiler">
            &times;
          </button>
        </div>

        <div className="campaign-importer-body" style={{ padding: '20px 24px', overflowY: 'auto', maxHeight: '72vh' }}>
          <div className="importer-top-options" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
            {currentBookId && (
              <div className="author-field" style={{ gridColumn: '1 / -1' }}>
                <label>Compilation Destination</label>
                <div className="book-sync-mode-pill-group">
                  <button
                    type="button"
                    className={`sync-pill-btn ${targetMode === 'append' ? 'active' : ''}`}
                    onClick={() => setTargetMode('append')}
                  >
                    <i className="fas fa-file-circle-plus"></i> Append Chapters to Current Tome
                  </button>
                  <button
                    type="button"
                    className={`sync-pill-btn ${targetMode === 'new' ? 'active' : ''}`}
                    onClick={() => setTargetMode('new')}
                  >
                    <i className="fas fa-book-medical"></i> Forge New Standalone Sourcebook
                  </button>
                </div>
              </div>
            )}

            {targetMode === 'new' && (
              <>
                <div className="author-field">
                  <label>Sourcebook Title</label>
                  <input
                    type="text"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                  />
                </div>
                <div className="author-field">
                  <label>Subtitle</label>
                  <input
                    type="text"
                    value={bookSubtitle}
                    onChange={(e) => setBookSubtitle(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="author-field">
              <label>Store Connection Mode</label>
              <div className="book-sync-mode-pill-group">
                <button
                  type="button"
                  className={`sync-pill-btn ${syncMode === 'live' ? 'active' : ''}`}
                  onClick={() => setSyncMode('live')}
                >
                  <i className="fas fa-link"></i> Live Sync with App Stores
                </button>
                <button
                  type="button"
                  className={`sync-pill-btn ${syncMode === 'snapshot' ? 'active' : ''}`}
                  onClick={() => setSyncMode('snapshot')}
                >
                  <i className="fas fa-thumbtack"></i> Pinned Snapshot
                </button>
              </div>
            </div>

            <div className="author-field">
              <label>Max Entries per Chapter ({maxPerSection})</label>
              <input
                type="range"
                min={2}
                max={16}
                step={2}
                value={maxPerSection}
                onChange={(e) => setMaxPerSection(parseInt(e.target.value, 10) || 6)}
              />
            </div>
          </div>

          <div className="importer-sections-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {CHRONICLE_SECTIONS.map((sec) => {
              const isChecked = !!selectedSections[sec.id];
              const available = groupedCounts[sec.id] || 0;
              return (
                <div
                  key={sec.id}
                  onClick={() => toggleSection(sec.id)}
                  className={`picker-catalog-row ${isChecked ? 'selected' : ''}`}
                  style={{ cursor: 'pointer', padding: '12px 16px' }}
                >
                  <div className="creature-fallback-badge">
                    <i className={`fas ${sec.icon}`}></i>
                  </div>
                  <div className="catalog-row-info" style={{ flex: 1 }}>
                    <div className="catalog-row-name">{sec.chapterTitle}</div>
                    <div className="catalog-row-sub">{sec.description}</div>
                  </div>
                  <span className="catalog-danger-pill">
                    {loading ? '...' : `${Math.min(available, maxPerSection)} / ${available} entries`}
                  </span>
                  <i
                    className={`fas ${isChecked ? 'fa-square-check' : 'fa-regular fa-square'}`}
                    style={{ fontSize: '1.15rem', color: isChecked ? '#663c32' : '#9b8a72', marginLeft: '8px' }}
                  ></i>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.88rem', fontStyle: 'italic', color: '#5c4632' }}>
              <i className="fas fa-feather-pointed"></i> Automatically links [[WikiLinks]] and balances two-column facing folios.
            </span>
            <button
              type="button"
              className="confirm-select-creature-btn"
              onClick={handleCompile}
            >
              <i className="fas fa-wand-magic-sparkles"></i> Compile Campaign Chronicle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCampaignImporterModal;
