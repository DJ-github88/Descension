import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import useWorldStore, { CANONICAL_REGIONS_META } from '../../store/worldStore';
import useFactionStore from '../../store/factionStore';
import useClassLoreStore from '../../store/classLoreStore';
import useCustomLineageStore from '../../store/customLineageStore';
import { getClassFlavorProfile } from '../../data/classes/classFlavorProfiles';
import FactionWebGraph from './FactionWebGraph';
import FactionDetail from './FactionDetail';
import LocationDetail from './LocationDetail';
import RegionDetail from './RegionDetail';
import ClassLoreDetail from './ClassLoreDetail';
import CustomLineageWizard from './CustomLineageWizard';
import ClassIcon from '../common/ClassIcon';
import LoreEditorToolbar from '../common/LoreEditorToolbar';
import { TimelineView } from './TimelineView';
import AccountMapManager from '../account/AccountMapManager';
import UniversalEntityGraph from './UniversalEntityGraph';
import FamilyTreeStudio from './FamilyTreeStudio';
import { showPrompt, showConfirm, showAlert } from '../../utils/dialogService';
import './WorldDashboard.css';

const VIEWS = {
  DASHBOARD: 'dashboard',
  REGION: 'region',
  LOCATION: 'location',
  FACTION: 'faction',
  FACTION_GRAPH: 'faction_graph',
  CLASS: 'class',
  LINEAGE: 'lineage',
  TIMELINE: 'timeline',
  ENTITY_GRAPH: 'entity_graph',
  FAMILY_TREE: 'family_tree'
};

const CLASS_ARCHETYPES = [
  {
    id: 'all',
    label: 'All Traditions (21)',
    shortLabel: 'All',
    count: 21,
    icon: 'fa-scroll',
    classIds: []
  },
  {
    id: 'martial',
    label: 'Martial Orders & Vanguard',
    shortLabel: 'Martial',
    count: 5,
    icon: 'fa-shield-halved',
    classIds: ['berserker', 'crusader', 'martyr', 'apex', 'spellguard']
  },
  {
    id: 'arcane',
    label: 'Arcane Academies & Weavers',
    shortLabel: 'Arcane',
    count: 4,
    icon: 'fa-wand-magic-sparkles',
    classIds: ['arcanoneer', 'chronarch', 'shaper', 'pyrofiend']
  },
  {
    id: 'primal',
    label: 'Primal Callings & Wardens',
    shortLabel: 'Primal',
    count: 4,
    icon: 'fa-tree',
    classIds: ['animist', 'warden', 'toxicologist', 'plaguebringer']
  },
  {
    id: 'shadow',
    label: 'Inquisitions & Shadow Syndicates',
    shortLabel: 'Shadow',
    count: 4,
    icon: 'fa-mask',
    classIds: ['inquisitor', 'gambit', 'revenant', 'minstrel']
  },
  {
    id: 'divine',
    label: 'Faiths, Oracles & Eldritch Pacts',
    shortLabel: 'Divine',
    count: 4,
    icon: 'fa-sun',
    classIds: ['augur', 'lunarch', 'false_prophet', 'harbinger']
  }
];

const CLASS_ROLE_TAGS = {
  berserker: { role: 'Striker / Juggernaut', icon: 'fa-axe' },
  crusader: { role: 'Vanguard / Defender', icon: 'fa-shield' },
  martyr: { role: 'Sacrificial Tank', icon: 'fa-heart-crack' },
  apex: { role: 'Predator / Duelist', icon: 'fa-paw' },
  spellguard: { role: 'Anti-Magic Defender', icon: 'fa-shield-halved' },
  arcanoneer: { role: 'Elemental Combinator', icon: 'fa-atom' },
  chronarch: { role: 'Time Controller', icon: 'fa-hourglass' },
  shaper: { role: 'Matter Manipulator', icon: 'fa-cube' },
  pyrofiend: { role: 'Chaos / Burn Blaster', icon: 'fa-fire' },
  animist: { role: 'Spirit Summoner', icon: 'fa-feather' },
  warden: { role: 'Territory Controller', icon: 'fa-tree' },
  toxicologist: { role: 'DoT / Alchemist', icon: 'fa-flask' },
  plaguebringer: { role: 'Miasma Striker', icon: 'fa-biohazard' },
  inquisitor: { role: 'Witch Hunter / Disrupter', icon: 'fa-cross' },
  gambit: { role: 'Critical Gambler', icon: 'fa-dice' },
  revenant: { role: 'Deathbound Undead', icon: 'fa-skull' },
  minstrel: { role: 'Bardic Commander', icon: 'fa-music' },
  augur: { role: 'Cosmic Prophet', icon: 'fa-eye' },
  lunarch: { role: 'Moon Ritualist', icon: 'fa-moon' },
  false_prophet: { role: 'Deception Controller', icon: 'fa-masks-theater' },
  harbinger: { role: 'Doom Bringer', icon: 'fa-crow' }
};

const FACTION_CATEGORIES = [
  { id: 'all', label: 'All Orders', icon: 'fa-shield-halved', types: [] },
  { id: 'noble_house', label: 'Noble Houses', icon: 'fa-crown', types: ['noble_house'] },
  { id: 'tribal', label: 'Indigenous & Clans', icon: 'fa-leaf', types: ['tribal', 'tribe', 'cultural'] },
  { id: 'guild', label: 'Guilds & Cartels', icon: 'fa-coins', types: ['guild', 'merchant'] },
  { id: 'shadow', label: 'Syndicates & Cults', icon: 'fa-mask', types: ['secret_society', 'cult', 'puppet_master', 'entity'] },
  { id: 'faith_military', label: 'Faiths & Military', icon: 'fa-sun', types: ['religious_order', 'military', 'governing_council'] }
];

export const getFactionTypeIcon = (type) => {
  switch (type) {
    case 'noble_house': return 'fa-crown';
    case 'tribe':
    case 'tribal': return 'fa-leaf';
    case 'guild': return 'fa-coins';
    case 'merchant': return 'fa-scale-balanced';
    case 'secret_society':
    case 'cult': return 'fa-eye';
    case 'religious_order': return 'fa-sun';
    case 'military': return 'fa-shield';
    case 'governing_council': return 'fa-landmark';
    case 'academic': return 'fa-book';
    default: return 'fa-shield-halved';
  }
};

export const getFactionIcon = (faction) => {
  if (faction?.icon && faction.icon.startsWith('fa-')) return faction.icon;
  if (faction?.type === 'noble_house') return 'fa-crown';
  if (faction?.type === 'tribal' || faction?.type === 'tribe') return 'fa-leaf';
  if (faction?.type === 'guild') return 'fa-coins';
  if (faction?.type === 'secret_society' || faction?.type === 'cult') return 'fa-eye';
  if (faction?.type === 'religious_order') return 'fa-sun';
  if (faction?.type === 'military') return 'fa-shield';
  return 'fa-shield-halved';
};

export const sanitizeLoreText = (text) => {
  if (!text || typeof text !== 'string') return text || '';
  return text
    .replace(/Ã¢â‚¬â€\x9D/g, '"')
    .replace(/Ã¢â‚¬â€/g, '—')
    .replace(/Ã¢â‚¬â„¢/g, "'")
    .replace(/Ã¢â‚¬Å“/g, '"')
    .replace(/Ã¢â‚¬Â/g, '"')
    .replace(/â€”/g, '—')
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"');
};

export const formatDisplayName = (str) => {
  if (!str || typeof str !== 'string') return str || '';
  return str
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const WorldDashboard = () => {
  const {
    activeWorldId,
    getActiveWorld,
    getAllWorlds,
    switchWorld,
    createWorld,
    deleteWorld,
    addCustomRegion,
    getRegions,
    getWorldOverview,
    getAllLineages,
    getLineage,
    getAllClasses: getWorldClasses,
    addCustomClass,
    toggleClassStatus
  } = useWorldStore();
  const { factions, getAllFactions, addFaction } = useFactionStore();
  const { loadClasses, loaded } = useClassLoreStore();
  const { openWizard: openLineageWizard, lineages: customLineages } = useCustomLineageStore();

  const [view, setView] = useState(VIEWS.DASHBOARD);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectedFactionId, setSelectedFactionId] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedLineageId, setSelectedLineageId] = useState(null);
  const [activeTab, setActiveTab] = useState('regions');
  const [selectedFactionCategory, setSelectedFactionCategory] = useState('all');
  const [selectedFactionRegion, setSelectedFactionRegion] = useState('all');
  const [factionSearchFilter, setFactionSearchFilter] = useState('');
  const [factionViewMode, setFactionViewMode] = useState('chronicle'); // 'chronicle' | 'banner' | 'ledger'
  const [factionSortBy, setFactionSortBy] = useState('name'); // 'name' | 'region' | 'holdings' | 'allies' | 'rivals'
  const [searchFilter, setSearchFilter] = useState('');
  const [lineageCategoryFilter, setLineageCategoryFilter] = useState('all'); // 'all' | 'canon' | 'custom'
  const [selectedClassArchetype, setSelectedClassArchetype] = useState('all');
  const [classSearchFilter, setClassSearchFilter] = useState('');

  // Custom Class Authoring state
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassTradition, setNewClassTradition] = useState('Martial Orders & Vanguard');
  const [newClassRole, setNewClassRole] = useState('Defender / Vanguard');
  const [newClassTagline, setNewClassTagline] = useState('');
  const [newClassResourceName, setNewClassResourceName] = useState('Mana / Focus');
  const [newClassOrigin, setNewClassOrigin] = useState('');
  const [newClassFeatures, setNewClassFeatures] = useState('');
  const [newClassSpecialRules, setNewClassSpecialRules] = useState('');
  const [newClassTradeoffs, setNewClassTradeoffs] = useState('');
  const [newClassCrisis, setNewClassCrisis] = useState('');
  const [newClassQuote, setNewClassQuote] = useState('');
  const [newClassSpeaker, setNewClassSpeaker] = useState('');

  // World Switcher & Creator state
  const [showWorldModal, setShowWorldModal] = useState(false);
  const [showCreateWorldModal, setShowCreateWorldModal] = useState(false);
  const [newWorldName, setNewWorldName] = useState('');
  const [newWorldSubtitle, setNewWorldSubtitle] = useState('');
  const [newWorldTheme, setNewWorldTheme] = useState('dark-fantasy');
  const [newWorldDesc, setNewWorldDesc] = useState('');

  // Custom Region Creator state
  const [showAddRegionModal, setShowAddRegionModal] = useState(false);
  const [newRegionName, setNewRegionName] = useState('');
  const [newRegionDanger, setNewRegionDanger] = useState('medium');
  const [newRegionClimate, setNewRegionClimate] = useState('');
  const [newRegionTerrain, setNewRegionTerrain] = useState('');
  const [newRegionDesc, setNewRegionDesc] = useState('');

  // Custom Faction Creator state
  const [showAddFactionModal, setShowAddFactionModal] = useState(false);
  const [newFactionName, setNewFactionName] = useState('');
  const [newFactionType, setNewFactionType] = useState('noble_house');
  const [newFactionRegionId, setNewFactionRegionId] = useState('');
  const [newFactionMandate, setNewFactionMandate] = useState('');
  const [newFactionOrigins, setNewFactionOrigins] = useState('');
  const [newFactionHoldings, setNewFactionHoldings] = useState('');
  const [newFactionSecrets, setNewFactionSecrets] = useState('');
  const [newFactionLeaderTitle, setNewFactionLeaderTitle] = useState('');
  const [newFactionColorPrimary, setNewFactionColorPrimary] = useState('#8b5a1a');
  const [newFactionColorSecondary, setNewFactionColorSecondary] = useState('#2b1408');

  useEffect(() => {
    if (!loaded) loadClasses();
  }, [loaded, loadClasses]);

  useEffect(() => {
    const handleOpenFactionWeb = (e) => {
      if (e.detail?.factionId) {
        setSelectedFactionId(e.detail.factionId);
      }
      setView(VIEWS.FACTION_GRAPH);
    };

    window.addEventListener('mythrill_open_faction_web', handleOpenFactionWeb);
    return () => {
      window.removeEventListener('mythrill_open_faction_web', handleOpenFactionWeb);
    };
  }, []);

  const activeWorld = getActiveWorld();
  const allWorlds = getAllWorlds();
  const regions = getRegions();
  const overview = getWorldOverview();
  const classes = useMemo(() => (getWorldClasses ? getWorldClasses(activeWorldId) : []), [getWorldClasses, activeWorldId, activeWorld]);
  const allLineages = getAllLineages();
  const worldFactions = useMemo(() => (getAllFactions ? getAllFactions(activeWorldId) : factions), [getAllFactions, factions, activeWorldId]);

  const navigateToLocation = (locId) => {
    setSelectedLocationId(locId);
    setView(VIEWS.LOCATION);
  };

  const navigateToFaction = (facId) => {
    setSelectedFactionId(facId);
    setView(VIEWS.FACTION);
  };

  const navigateToClass = (classId) => {
    setSelectedClassId(classId);
    setView(VIEWS.CLASS);
  };

  const navigateToLineage = (lineageId) => {
    setSelectedLineageId(lineageId);
    setView(VIEWS.LINEAGE);
  };

  const navigateToRegion = (regionId) => {
    setSelectedRegionId(regionId);
    setView(VIEWS.REGION);
  };

  const navigateToGraph = () => setView(VIEWS.FACTION_GRAPH);
  const navigateToTimeline = () => setView(VIEWS.TIMELINE);
  const navigateToDashboard = () => {
    setView(VIEWS.DASHBOARD);
    setSelectedRegionId(null);
    setSelectedLocationId(null);
    setSelectedFactionId(null);
    setSelectedClassId(null);
    setSelectedLineageId(null);
  };

  const handleFlyToMap = (e, entityData) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('mythrill_navigate_map', { detail: entityData }));
  };

  const handleCreateWorldSubmit = (e) => {
    e.preventDefault();
    if (!newWorldName.trim()) return;
    const wid = createWorld({
      name: newWorldName.trim(),
      subtitle: newWorldSubtitle.trim() || 'A Sovereign World Setting',
      theme: newWorldTheme,
      description: newWorldDesc.trim()
    });
    setShowCreateWorldModal(false);
    setShowWorldModal(false);
    setNewWorldName('');
    setNewWorldSubtitle('');
    setNewWorldDesc('');
    navigateToDashboard();
  };

  const handleAddCustomRegionSubmit = (e) => {
    e.preventDefault();
    if (!newRegionName.trim()) return;
    const rid = addCustomRegion(activeWorldId, {
      name: newRegionName.trim(),
      dangerLevel: newRegionDanger,
      climate: newRegionClimate.trim() || 'Temperate',
      dominantTerrain: newRegionTerrain.trim() || 'Wilderness & Valleys',
      description: newRegionDesc.trim()
    });
    setShowAddRegionModal(false);
    setNewRegionName('');
    setNewRegionClimate('');
    setNewRegionTerrain('');
    setNewRegionDesc('');
    navigateToRegion(rid);
  };

  const handleAddFaction = () => {
    setShowAddFactionModal(true);
  };

  const handleCreateFactionSubmit = (e) => {
    e.preventDefault();
    if (!newFactionName.trim()) return;
    const facId = `fac-custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const holdingsList = newFactionHoldings
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean);

    addFaction({
      id: facId,
      name: newFactionName.trim(),
      type: newFactionType,
      worldId: activeWorldId,
      regionId: newFactionRegionId || (regions[0]?.id || null),
      publicGoal: newFactionMandate.trim() || `An influential order in ${activeWorld.name}.`,
      publicDescription: newFactionMandate.trim() || `A sovereign faction operating in ${activeWorld.name}.`,
      lore: newFactionOrigins.trim(),
      hiddenAgenda: newFactionSecrets.trim(),
      hiddenDescription: newFactionSecrets.trim(),
      territory: holdingsList,
      leader: newFactionLeaderTitle.trim() ? {
        title: newFactionLeaderTitle.trim(),
        description: `Supreme authority of ${newFactionName.trim()}`
      } : null,
      colors: {
        primary: newFactionColorPrimary || '#8b5a1a',
        secondary: newFactionColorSecondary || '#2b1408'
      },
      relationships: []
    });

    setShowAddFactionModal(false);
    setNewFactionName('');
    setNewFactionMandate('');
    setNewFactionOrigins('');
    setNewFactionHoldings('');
    setNewFactionSecrets('');
    setNewFactionLeaderTitle('');
    navigateToFaction(facId);
  };

  const handleCreateClassSubmit = (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    const cid = addCustomClass(activeWorldId, {
      name: newClassName.trim(),
      tradition: newClassTradition,
      role: newClassRole.trim() || 'Heroic Archetype',
      tagline: newClassTagline.trim(),
      resourceName: newClassResourceName.trim() || 'Mana / Focus',
      description: newClassOrigin.trim() || `A heroic calling practiced in ${activeWorld.name}.`,
      originStory: newClassOrigin.trim(),
      keyFeatures: newClassFeatures.split(',').map((f) => f.trim()).filter(Boolean),
      specialRules: newClassSpecialRules.trim(),
      meaningfulTradeoffs: newClassTradeoffs.trim(),
      currentCrisis: newClassCrisis.trim(),
      signatureQuote: newClassQuote.trim() ? {
        text: newClassQuote.trim(),
        speaker: newClassSpeaker.trim() || `${newClassName.trim()} Doctrine`,
        context: `Inscribed into the chronicle archives of ${activeWorld.name}`
      } : null
    });
    setShowAddClassModal(false);
    setNewClassName('');
    setNewClassTagline('');
    setNewClassResourceName('');
    setNewClassOrigin('');
    setNewClassFeatures('');
    setNewClassSpecialRules('');
    setNewClassTradeoffs('');
    setNewClassCrisis('');
    setNewClassQuote('');
    setNewClassSpeaker('');
    navigateToClass(cid);
  };

  // Filtered Factions
  const filteredFactions = worldFactions.filter(f => {
    if (selectedFactionCategory !== 'all') {

      const cat = FACTION_CATEGORIES.find(c => c.id === selectedFactionCategory);
      if (cat && cat.types.length > 0 && !cat.types.includes(f.type)) return false;
    }
    if (selectedFactionRegion !== 'all' && f.regionId !== selectedFactionRegion) {
      return false;
    }
    if (factionSearchFilter.trim()) {
      const q = factionSearchFilter.toLowerCase();
      const matchName = f.name?.toLowerCase().includes(q);
      const matchGoal = f.publicGoal?.toLowerCase().includes(q);
      const matchDesc = f.publicDescription?.toLowerCase().includes(q);
      const matchLeader = f.leader?.title?.toLowerCase().includes(q) || f.leader?.npcId?.toLowerCase().includes(q);
      const matchTerritory = f.territory?.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchGoal && !matchDesc && !matchLeader && !matchTerritory) return false;
    }
    return true;
  });

  // Sorted and Filtered Factions
  const sortedAndFilteredFactions = useMemo(() => {
    const list = [...filteredFactions];
    if (factionSortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (factionSortBy === 'region') {
      list.sort((a, b) => (a.regionId || '').localeCompare(b.regionId || ''));
    } else if (factionSortBy === 'holdings') {
      list.sort((a, b) => (b.territory?.length || 0) - (a.territory?.length || 0));
    } else if (factionSortBy === 'allies') {
      const countAllies = f => f.relationships?.filter(r => ['allied', 'tense_allied', 'secret_ally'].includes(r.type)).length || 0;
      list.sort((a, b) => countAllies(b) - countAllies(a));
    } else if (factionSortBy === 'rivals') {
      const countRivals = f => f.relationships?.filter(r => ['hostile', 'rival', 'secret_rival'].includes(r.type)).length || 0;
      list.sort((a, b) => countRivals(b) - countRivals(a));
    }
    return list;
  }, [filteredFactions, factionSortBy]);

  // Filtered Lineages
  const filteredLineages = useMemo(() => {
    return allLineages.filter(l => {
      if (lineageCategoryFilter === 'canon' && l.isCustom) return false;
      if (lineageCategoryFilter === 'custom' && !l.isCustom) return false;
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchName = l.name?.toLowerCase().includes(q);
        const matchEssence = l.essence?.toLowerCase().includes(q);
        const matchDesc = (l.description || l.overview || l.cardFlavor)?.toLowerCase().includes(q);
        const subracesList = l.subraces ? (Array.isArray(l.subraces) ? l.subraces : Object.values(l.subraces)) : [];
        const matchSub = subracesList.some(s => s.name?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q));
        if (!matchName && !matchEssence && !matchDesc && !matchSub) return false;
      }
      return true;
    });
  }, [allLineages, lineageCategoryFilter, searchFilter]);

  // --- Detail Views ---
  if (view === VIEWS.REGION && selectedRegionId) {
    return (
      <RegionDetail
        regionId={selectedRegionId}
        onBack={navigateToDashboard}
        onLocationClick={navigateToLocation}
        onFactionClick={navigateToFaction}
      />
    );
  }

  if (view === VIEWS.LOCATION && selectedLocationId) {
    return (
      <LocationDetail
        locationId={selectedLocationId}
        onBack={navigateToDashboard}
        onClassClick={navigateToClass}
        onFactionClick={navigateToFaction}
      />
    );
  }

  if (view === VIEWS.FACTION && selectedFactionId) {
    return <FactionDetail factionId={selectedFactionId} onBack={navigateToDashboard} onNavigateFaction={navigateToFaction} />;
  }

  if (view === VIEWS.CLASS && selectedClassId) {
    return <ClassLoreDetail classId={selectedClassId} onClose={navigateToDashboard} />;
  }

  if (view === VIEWS.LINEAGE && selectedLineageId) {
    const lineage = getLineage(selectedLineageId);
    if (!lineage) {
      return (
        <div className="world-panel animate-fade-in">
          <div className="world-panel-header">
            <button className="world-back-btn" onClick={navigateToDashboard}>← Dashboard</button>
            <h2>Lineage Not Found</h2>
          </div>
        </div>
      );
    }

    const baseTraits = lineage.baseTraits || {};
    const subraces = lineage.subraces 
      ? (Array.isArray(lineage.subraces) ? lineage.subraces : Object.values(lineage.subraces))
      : [];
    const notableFigures = lineage.notableFigures || [];

    return (
      <div className="world-panel animate-fade-in">
        <div className="world-panel-header lineage-detail-hero">
          <button className="world-back-btn" onClick={navigateToDashboard}>← Lineages &amp; Peoples</button>
          <div className="lineage-detail-hero-title">
            <div className="lineage-title-row">
              <i className={`fas ${lineage.icon || 'fa-dna'} lineage-hero-icon`}></i>
              <div>
                <h2>
                  {lineage.name} {lineage.isCustom ? <span className="world-badge world-badge-custom">Custom Species</span> : <span className="world-badge">Canon Lineage</span>}
                </h2>
                <span className="world-subtitle">{lineage.essence || 'Ancestral Lineage of Mythrill'}</span>
              </div>
            </div>
          </div>
          {lineage.isCustom && (
            <button 
              className="world-action-btn primary"
              style={{ marginLeft: 'auto' }}
              onClick={() => openLineageWizard(lineage)}
            >
              <i className="fas fa-edit"></i> Edit Custom Lineage
            </button>
          )}
        </div>

        <div className="world-tab-content lineage-detail-content">
          {/* Vital Stats Strip */}
          <div className="lineage-vital-strip">
            <div className="vital-item">
              <i className="fas fa-hourglass-half"></i>
              <div>
                <span className="vital-label">Lifespan</span>
                <span className="vital-val">{baseTraits.lifespan || '70-100 years'}</span>
              </div>
            </div>
            <div className="vital-item">
              <i className="fas fa-person-running"></i>
              <div>
                <span className="vital-label">Base Speed</span>
                <span className="vital-val">{baseTraits.baseSpeed || 30} ft {baseTraits.swimSpeed ? `(Swim ${baseTraits.swimSpeed}ft)` : ''}</span>
              </div>
            </div>
            <div className="vital-item">
              <i className="fas fa-ruler-vertical"></i>
              <div>
                <span className="vital-label">Size &amp; Build</span>
                <span className="vital-val">{baseTraits.size || 'Medium'} • {baseTraits.build || 'Standard'}</span>
              </div>
            </div>
            <div className="vital-item">
              <i className="fas fa-language"></i>
              <div>
                <span className="vital-label">Languages</span>
                <span className="vital-val">{(baseTraits.languages || ['Common']).join(', ')}</span>
              </div>
            </div>
          </div>

          <div className="world-section-stack">
            {/* Visual Description & Physiology */}
            {lineage.visualDescription && (
              <div className="world-section lineage-physio-box">
                <h3><i className="fas fa-eye"></i> Physical Appearance &amp; Physiology</h3>
                <p className="world-prose">{lineage.visualDescription}</p>
              </div>
            )}

            {/* Overview & Essence */}
            <div className="world-section">
              <h3><i className="fas fa-feather-pointed"></i> Essence &amp; Overview</h3>
              <p className="world-prose">{lineage.overview || lineage.description || lineage.cardFlavor}</p>
            </div>

            {/* Cultural Background & Living Traditions */}
            {lineage.culturalBackground && (
              <div className="world-section">
                <h3><i className="fas fa-landmark"></i> Cultural Background &amp; Traditions</h3>
                <p className="world-prose">{lineage.culturalBackground}</p>
              </div>
            )}

            {/* Meaningful Tradeoffs / Mortal Flaw */}
            {lineage.meaningfulTradeoffs && (
              <div className="world-section world-section-highlight">
                <h3><i className="fas fa-triangle-exclamation"></i> Meaningful Tradeoff &amp; Mortal Flaw</h3>
                <p className="world-prose">{lineage.meaningfulTradeoffs}</p>
              </div>
            )}

            {/* Regional Bloodlines & Subraces */}
            {subraces.length > 0 && (
              <div className="world-section">
                <h3><i className="fas fa-code-branch"></i> Regional Bloodlines &amp; Subraces ({subraces.length})</h3>
                <div className="world-card-grid subraces-card-grid">
                  {subraces.map((sub, i) => (
                    <div key={i} className="world-info-card subrace-card">
                      <div className="subrace-card-head">
                        <i className="fas fa-dna subrace-icon"></i>
                        <h4>{sub.name}</h4>
                      </div>
                      <p className="world-card-meta">{sub.description}</p>
                      {sub.perks && sub.perks.length > 0 && (
                        <div className="subrace-perks-list">
                          {sub.perks.map((p, pIdx) => (
                            <span key={pIdx} className="subrace-perk-tag">{p}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Epic Ancestral History */}
            {lineage.epicHistory && (
              <div className="world-section">
                <h3><i className="fas fa-book-atlas"></i> Epic Ancestral History &amp; Mythos</h3>
                <div className="world-prose historical-prose">
                  {lineage.epicHistory.split('\n\n').filter(Boolean).map((para, idx) => (
                    <p key={idx}>{para.trim()}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Notable Historical Figures */}
            {notableFigures.length > 0 && (
              <div className="world-section">
                <h3><i className="fas fa-crown"></i> Legends of the Bloodline ({notableFigures.length})</h3>
                <div className="world-card-grid notable-figures-grid">
                  {notableFigures.map((fig, idx) => (
                    <div key={idx} className="world-info-card figure-card">
                      <div className="figure-card-head">
                        <i className="fas fa-user-shield figure-icon"></i>
                        <div>
                          <h4>{fig.name}</h4>
                          <span className="figure-title">{fig.title}</span>
                        </div>
                      </div>
                      <p className="world-card-meta figure-backstory">{fig.backstory?.trim()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <CustomLineageWizard />
      </div>
    );
  }

  if (view === VIEWS.TIMELINE) {
    return (
      <div className="world-panel">
        <div className="world-panel-header">
          <button className="world-back-btn" onClick={navigateToDashboard}>← Dashboard</button>
          <h2>World Timeline</h2>
        </div>
        <TimelineView />
      </div>
    );
  }

  if (view === VIEWS.FACTION_GRAPH) {
    return (
      <div className="world-panel">
        <div className="world-panel-header">
          <button className="world-back-btn" onClick={navigateToDashboard}>← Dashboard</button>
          <h2>Faction Relationship Web</h2>
        </div>
        <FactionWebGraph
          onFactionClick={navigateToFaction}
          selectedFactionId={selectedFactionId}
        />
      </div>
    );
  }

  if (view === VIEWS.ENTITY_GRAPH) {
    return (
      <div className="world-panel">
        <div className="world-panel-header">
          <button className="world-back-btn" onClick={navigateToDashboard}>← Dashboard</button>
          <h2>Universal Relationship Web</h2>
        </div>
        <UniversalEntityGraph
          onEntityDoubleClick={(ent) => {
            if (ent.type === 'faction') navigateToFaction(ent.rawId);
            else if (ent.type === 'location') navigateToLocation(ent.rawId);
            else if (ent.type === 'lineage') navigateToLineage(ent.rawId);
            else if (ent.type === 'family_node') setView(VIEWS.FAMILY_TREE);
          }}
        />
      </div>
    );
  }

  if (view === VIEWS.FAMILY_TREE) {
    return (
      <div className="world-panel">
        <div className="world-panel-header">
          <button className="world-back-btn" onClick={navigateToDashboard}>← Dashboard</button>
          <h2>Dynasty & Family Trees</h2>
        </div>
        <FamilyTreeStudio inline={true} />
      </div>
    );
  }

  // --- Dashboard View ---
  return (
    <div className="world-panel world-dashboard">
      <div className="world-panel-header">
        <div className="world-header-title-block">
          <div className="world-title-main-row">
            <h1 className="world-master-title">{activeWorld.name}</h1>
            <button
              type="button"
              className="world-switcher-trigger-btn"
              onClick={() => setShowWorldModal(true)}
              title="Switch Realm Setting or Forge New World"
              aria-label={`Worlds (${allWorlds.length})`}
            >
              <div className="world-switcher-btn-content">
                <i className="fas fa-globe-americas world-switcher-globe-icon"></i>
                <span className="world-switcher-label">Worlds</span>
                <span className="world-switcher-count-badge">({allWorlds.length})</span>
                <i className="fas fa-chevron-down world-switcher-chevron"></i>
              </div>
            </button>
          </div>
          <span className="world-subtitle">{activeWorld.subtitle || 'Living World-Building & Lore Engine'}</span>
        </div>
        <div className="world-header-icon-strip">
          <button
            type="button"
            className={`world-header-icon-btn ${activeTab === 'regions' ? 'active' : ''}`}
            onClick={() => setActiveTab('regions')}
            title={`Realms (${regions.length})`}
            aria-label="Quick Realms"
          >
            <i className="fas fa-earth-americas"></i>
          </button>
          <button
            type="button"
            className={`world-header-icon-btn ${activeTab === 'factions' ? 'active' : ''}`}
            onClick={() => setActiveTab('factions')}
            title={`Factions (${worldFactions.length})`}
            aria-label="Quick Orders"
          >
            <i className="fas fa-shield-halved"></i>
          </button>
          <button
            type="button"
            className={`world-header-icon-btn ${activeTab === 'lineages' ? 'active' : ''}`}
            onClick={() => setActiveTab('lineages')}
            title={`Lineages (${allLineages.length})`}
            aria-label="Quick Lineages"
          >
            <i className="fas fa-dna"></i>
          </button>
          <button
            type="button"
            className={`world-header-icon-btn ${activeTab === 'classes' ? 'active' : ''}`}
            onClick={() => setActiveTab('classes')}
            title={`Traditions (${classes.length})`}
            aria-label="Quick Traditions"
          >
            <i className="fas fa-wand-magic-sparkles"></i>
          </button>
          <button
            type="button"
            className={`world-header-icon-btn ${activeTab === 'entity_graph' ? 'active' : ''}`}
            onClick={() => setActiveTab('entity_graph')}
            title="Relationship Web"
            aria-label="Quick Entity Web"
          >
            <i className="fas fa-network-wired"></i>
          </button>
          <button
            type="button"
            className={`world-header-icon-btn ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
            title="World Timeline & Epochs"
            aria-label="Quick Epochs"
          >
            <i className="fas fa-hourglass-half"></i>
          </button>
          <button
            type="button"
            className={`world-header-icon-btn ${activeTab === 'family_trees' ? 'active' : ''}`}
            onClick={() => setActiveTab('family_trees')}
            title="Dynasty Trees"
            aria-label="Quick Dynasties"
          >
            <i className="fas fa-users"></i>
          </button>
          <button
            type="button"
            className={`world-header-icon-btn ${activeTab === 'atlas' ? 'active' : ''}`}
            onClick={() => setActiveTab('atlas')}
            title="World Atlas & Maps"
            aria-label="Quick Atlas"
          >
            <i className="fas fa-map"></i>
          </button>
        </div>
      </div>

      <div className="world-tabs">
        {[
          { key: 'regions', label: `Realms (${regions.length})`, icon: 'fa-earth-americas' },
          { key: 'timeline', label: 'Timeline & Epochs', icon: 'fa-hourglass-half' },
          { key: 'factions', label: `Factions & Orders (${worldFactions.length})`, icon: 'fa-shield-halved' },
          { key: 'entity_graph', label: 'Relationship Web', icon: 'fa-network-wired' },
          { key: 'family_trees', label: 'Dynasty Trees', icon: 'fa-users' },
          { key: 'lineages', label: `Lineages & Peoples (${allLineages.length})`, icon: 'fa-dna' },
          { key: 'classes', label: `Traditions & Classes (${classes.length})`, icon: 'fa-wand-magic-sparkles' },
          { key: 'atlas', label: 'World Atlas & Maps', icon: 'fa-map' }
        ].map((tab) => (
          <button
            key={tab.key}
            className={`world-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <i className={`fas ${tab.icon}`} style={{ marginRight: '7px' }}></i>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="world-tab-content">
        {activeTab === 'regions' && (
          <div className="world-regions-wrapper">
            <div className="world-regions-toolbar">
              <div className="world-regions-title-summary">
                <span className="world-realm-badge"><i className="fas fa-earth-americas"></i> {activeWorld.name}</span>
                <span className="world-muted-summary">{regions.length} Active Realms &amp; Continents</span>
              </div>
              <button
                type="button"
                className="world-add-realm-btn"
                onClick={() => setShowAddRegionModal(true)}
              >
                <i className="fas fa-plus"></i> Add Realm / Region
              </button>
            </div>
            <div className="world-region-grid">
              {overview.length === 0 ? (
                <div className="world-regions-empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px', background: 'rgba(255,255,255,0.7)', borderRadius: '10px', border: '1px dashed #d4af37' }}>
                  <i className="fas fa-mountain-sun" style={{ fontSize: '32px', color: '#8b5a1a', marginBottom: '12px' }}></i>
                  <h4 style={{ fontFamily: 'Cinzel, serif', color: '#2b1408', margin: '0 0 6px 0' }}>No Realms Established in {activeWorld.name}</h4>
                  <p style={{ fontFamily: 'Spectral, Georgia, serif', color: '#6b4c2b', margin: '0 0 16px 0' }}>{activeWorld.name} has no recorded realms yet. Found your first realm or continent to begin charting this world.</p>
                  <button
                    type="button"
                    className="world-action-btn primary"
                    onClick={() => setShowAddRegionModal(true)}
                  >
                    <i className="fas fa-plus"></i> Found First Realm
                  </button>
                </div>
              ) : (
                overview.map((region) => (
                  <div
                    key={region.id}
                    className="world-region-card"
                    onClick={() => navigateToRegion(region.id)}
                  >
                  <div className="world-region-card-header">
                    <h3>{region.name}</h3>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button
                        className="world-mini-map-btn"
                        onClick={(e) => handleFlyToMap(e, { regionId: region.id, name: region.name })}
                        title="Fly to on World Map"
                      >
                        <i className="fas fa-map-location-dot"></i>
                      </button>
                    </div>
                  </div>
                  <p className="world-region-desc">{region.description}</p>
                  <div className="world-region-stats">
                    <span>{region.locationCount} locations</span>
                    <span>{region.factionCount} factions</span>
                  </div>
                  {region.locations.length > 0 && (
                    <div className="world-region-locations">
                      {region.locations.map((loc) => (
                        <button
                          key={loc.id}
                          className="world-location-chip"
                          onClick={(e) => { e.stopPropagation(); navigateToLocation(loc.id); }}
                        >
                          <span className={`world-loc-type-dot world-loc-${loc.type}`} />
                          {loc.name}
                        </button>
                      ))}
                      {region.locationCount > 3 && (
                        <span className="world-muted">+{region.locationCount - 3} more...</span>
                      )}
                    </div>
                  )}
                </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="world-timeline-tab-container">
            <TimelineView />
          </div>
        )}

        {activeTab === 'factions' && (
          <div className="world-factions-container">
            {/* Factions Interactive Toolbar */}
            <div className="world-factions-toolbar">
              <div className="factions-search-and-select">
                <div className="factions-search-wrapper">
                  <i className="fas fa-search factions-search-icon"></i>
                  <input
                    type="text"
                    className="factions-search-input"
                    placeholder="Search factions by name, leader, mandate, territory..."
                    value={factionSearchFilter}
                    onChange={(e) => setFactionSearchFilter(e.target.value)}
                  />
                  {factionSearchFilter && (
                    <button className="factions-clear-search-btn" onClick={() => setFactionSearchFilter('')}>
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>

                <div className="factions-region-filter">
                  <select
                    value={selectedFactionRegion}
                    onChange={(e) => setSelectedFactionRegion(e.target.value)}
                    className="factions-region-select"
                  >
                    <option value="all">All Realms &amp; Regions</option>
                    {regions.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div className="factions-sort-filter">
                  <select
                    value={factionSortBy}
                    onChange={(e) => setFactionSortBy(e.target.value)}
                    className="factions-sort-select"
                  >
                    <option value="name">Sort: Name (A-Z)</option>
                    <option value="region">Sort: Realm Seat</option>
                    <option value="holdings">Sort: Most Holdings</option>
                    <option value="allies">Sort: Most Alliances</option>
                    <option value="rivals">Sort: Most Rivals</option>
                  </select>
                </div>
              </div>

              <div className="factions-action-buttons">
                {/* View Mode Switcher */}
                <div className="factions-view-mode-group">
                  <button
                    className={`btn-view-mode ${factionViewMode === 'chronicle' ? 'active' : ''}`}
                    onClick={() => setFactionViewMode('chronicle')}
                    title="Order Chronicles View"
                  >
                    <i className="fas fa-book-journal-whills"></i> Chronicles
                  </button>
                  <button
                    className={`btn-view-mode ${factionViewMode === 'banner' ? 'active' : ''}`}
                    onClick={() => setFactionViewMode('banner')}
                    title="Heraldic Banners View"
                  >
                    <i className="fas fa-flag"></i> Banners
                  </button>
                  <button
                    className={`btn-view-mode ${factionViewMode === 'ledger' ? 'active' : ''}`}
                    onClick={() => setFactionViewMode('ledger')}
                    title="Diplomatic Ledger Table"
                  >
                    <i className="fas fa-scroll"></i> Ledger
                  </button>
                  <button
                    className={`btn-view-mode ${factionViewMode === 'graph' ? 'active' : ''}`}
                    onClick={() => setFactionViewMode('graph')}
                    title="Interactive Faction Relationship Web"
                  >
                    <i className="fas fa-project-diagram"></i> Relationship Web
                  </button>
                </div>

                <button className="world-action-btn primary" onClick={handleAddFaction}>
                  <i className="fas fa-plus" /> Forge Faction
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="factions-category-pills">
              {FACTION_CATEGORIES.map(cat => {
                const count = worldFactions.filter(f => {
                  if (cat.id === 'all') return true;
                  return cat.types.includes(f.type);
                }).length;

                return (
                  <button
                    key={cat.id}
                    className={`faction-category-pill ${selectedFactionCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedFactionCategory(cat.id)}
                  >
                    <i className={`fas ${cat.icon}`}></i>
                    <span>{cat.label}</span>
                    <span className="cat-count">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Empty State */}
            {sortedAndFilteredFactions.length === 0 ? (
              <div className="factions-empty-state">
                <i className="fas fa-shield-slash empty-icon"></i>
                <h4>No Factions Found</h4>
                <p>No factions match your current filter and search criteria.</p>
                <button
                  className="world-action-btn"
                  onClick={() => { setSelectedFactionCategory('all'); setSelectedFactionRegion('all'); setFactionSearchFilter(''); }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : factionViewMode === 'chronicle' ? (
              /* --- 1. CHRONICLES VIEW --- */
              <div className="world-factions-dossier-grid world-factions-chronicle-grid">
                {sortedAndFilteredFactions.map((faction) => {
                  const factionRegion = regions.find(r => r.id === faction.regionId);
                  const alliesCount = faction.relationships?.filter(r => r.type === 'allied' || r.type === 'tense_allied' || r.type === 'secret_ally')?.length || 0;
                  const rivalsCount = faction.relationships?.filter(r => r.type === 'hostile' || r.type === 'rival')?.length || 0;

                  return (
                    <div
                      key={faction.id}
                      className="world-faction-dossier-card world-faction-chronicle-card"
                      onClick={() => navigateToFaction(faction.id)}
                    >
                      {/* Top Heraldic Banner */}
                      <div
                        className="dossier-banner"
                        style={{
                          background: `linear-gradient(135deg, ${faction.colors?.primary || '#5a3d1c'} 0%, ${faction.colors?.secondary || '#2b1a0a'} 100%)`
                        }}
                      >
                        <span className="dossier-type-badge">
                          <i className={`fas ${getFactionTypeIcon(faction.type)}`}></i>
                          {formatDisplayName(faction.type)}
                        </span>
                        {factionRegion && (
                          <span
                            className="dossier-region-chip"
                            onClick={(e) => { e.stopPropagation(); navigateToRegion(factionRegion.id); }}
                            title={`Seat in ${factionRegion.name}`}
                          >
                            <i className="fas fa-map-pin"></i> {factionRegion.name}
                          </span>
                        )}
                      </div>

                      <div className="dossier-body">
                        {/* Title & Crest Row */}
                        <div className="dossier-header-row">
                          <div
                            className="dossier-crest"
                            style={{
                              background: `radial-gradient(circle at 35% 35%, ${faction.colors?.primary || '#8b5a1a'} 0%, #1a0f05 100%)`,
                              borderColor: faction.colors?.secondary || '#d4af37'
                            }}
                          >
                            <i className={`fas ${getFactionIcon(faction)}`}></i>
                          </div>
                          <div className="dossier-title-area">
                            <h4>{sanitizeLoreText(faction.name)}</h4>
                            {faction.leader?.title && (
                              <span className="dossier-leader-tag">
                                <i className="fas fa-user-shield"></i> {sanitizeLoreText(faction.leader.title)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Public Mandate / Motto */}
                        {faction.publicGoal && (
                          <p className="dossier-goal-quote">
                            &ldquo;{sanitizeLoreText(faction.publicGoal)}&rdquo;
                          </p>
                        )}

                        {/* Description Preview */}
                        {faction.publicDescription && (
                          <p className="dossier-desc">
                            {sanitizeLoreText(faction.publicDescription).slice(0, 130)}{faction.publicDescription.length > 130 ? '…' : ''}
                          </p>
                        )}

                        {/* Intel / Holdings Row */}
                        <div className="dossier-intel-row">
                          {faction.headquarters && (
                            <span className="dossier-intel-pill">
                              <i className="fas fa-chess-rook"></i> HQ: {formatDisplayName(sanitizeLoreText(faction.headquarters))}
                            </span>
                          )}
                          {faction.territory?.length > 0 && (
                            <span className="dossier-intel-pill holdings">
                              <i className="fas fa-mountain-sun"></i> {faction.territory.length} Holdings
                            </span>
                          )}
                        </div>

                        {/* Diplomatic Standing */}
                        {faction.relationships?.length > 0 && (
                          <div className="dossier-diplomacy-row">
                            {alliesCount > 0 && (
                              <span className="diplomacy-pill ally" title={`${alliesCount} Allied Factions`}>
                                <i className="fas fa-handshake"></i> {alliesCount} {alliesCount === 1 ? 'Ally' : 'Allies'}
                              </span>
                            )}
                            {rivalsCount > 0 && (
                              <span className="diplomacy-pill rival" title={`${rivalsCount} Hostile / Rival Factions`}>
                                <i className="fas fa-skull-crossbones"></i> {rivalsCount} {rivalsCount === 1 ? 'Rival' : 'Rivals'}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Aligned Class Traditions */}
                        {faction.classAffinities?.length > 0 && (
                          <div className="dossier-classes-row">
                            <span className="dossier-classes-label">Traditions:</span>
                            <div className="dossier-class-chips">
                              {faction.classAffinities.slice(0, 3).map(cls => (
                                <span
                                  key={cls}
                                  className="dossier-class-chip"
                                  onClick={(e) => { e.stopPropagation(); navigateToClass(cls); }}
                                  title={`Explore ${formatDisplayName(cls)} lore`}
                                >
                                  {formatDisplayName(cls)}
                                </span>
                              ))}
                              {faction.classAffinities.length > 3 && (
                                <span className="dossier-class-chip more">+{faction.classAffinities.length - 3}</span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action Footer */}
                        <div className="dossier-actions-row">
                          <button
                            type="button"
                            className="btn-dossier-inspect"
                            onClick={(e) => { e.stopPropagation(); navigateToFaction(faction.id); }}
                          >
                            <i className="fas fa-book-open"></i> Read Chronicle
                          </button>
                          <button
                            type="button"
                            className="btn-dossier-web"
                            onClick={(e) => { e.stopPropagation(); setSelectedFactionId(faction.id); navigateToGraph(); }}
                            title="View in Relationship Web"
                          >
                            <i className="fas fa-project-diagram"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : factionViewMode === 'banner' ? (
              /* --- 2. HERALDIC BANNERS VIEW --- */
              <div className="world-factions-banners-grid">
                {sortedAndFilteredFactions.map((faction) => {
                  const factionRegion = regions.find(r => r.id === faction.regionId);
                  const alliesCount = faction.relationships?.filter(r => r.type === 'allied' || r.type === 'tense_allied' || r.type === 'secret_ally')?.length || 0;
                  const rivalsCount = faction.relationships?.filter(r => r.type === 'hostile' || r.type === 'rival')?.length || 0;

                  return (
                    <div
                      key={faction.id}
                      className="faction-heraldic-banner-card"
                      onClick={() => navigateToFaction(faction.id)}
                      style={{
                        '--primary-color': faction.colors?.primary || '#8b5a1a',
                        '--secondary-color': faction.colors?.secondary || '#2b1408'
                      }}
                    >
                      <div className="banner-ribbon-stripe"></div>
                      <div className="banner-card-inner">
                        <div className="banner-crest-shield">
                          <i className={`fas ${getFactionIcon(faction)}`}></i>
                        </div>
                        <div className="banner-main-content">
                          <div className="banner-top-badges">
                            <span className="banner-type-badge">{faction.type?.replace(/_/g, ' ')}</span>
                            {factionRegion && (
                              <span className="banner-realm-badge">
                                <i className="fas fa-map-pin"></i> {factionRegion.name}
                              </span>
                            )}
                          </div>
                          <h3 className="banner-faction-name">{sanitizeLoreText(faction.name)}</h3>
                          {faction.leader?.title && (
                            <span className="banner-leader-title">
                              <i className="fas fa-crown"></i> {sanitizeLoreText(faction.leader.title)}
                            </span>
                          )}
                          {faction.publicGoal && (
                            <p className="banner-motto-quote">
                              &ldquo;{sanitizeLoreText(faction.publicGoal)}&rdquo;
                            </p>
                          )}
                          <div className="banner-meta-footer">
                            <div className="banner-diplomacy-pills">
                              {alliesCount > 0 && <span className="b-pill ally"><i className="fas fa-handshake"></i> {alliesCount}</span>}
                              {rivalsCount > 0 && <span className="b-pill rival"><i className="fas fa-swords"></i> {rivalsCount}</span>}
                              {faction.territory?.length > 0 && (
                                <span className="b-pill territory"><i className="fas fa-chess-rook"></i> {faction.territory.length}</span>
                              )}
                            </div>
                            <button
                              className="banner-inspect-link"
                              onClick={(e) => { e.stopPropagation(); navigateToFaction(faction.id); }}
                            >
                              Inspect Lore →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : factionViewMode === 'ledger' ? (
              /* --- 3. DIPLOMATIC LEDGER VIEW --- */
              <div className="world-factions-ledger-table-wrapper">
                <table className="world-factions-ledger-table">
                  <thead>
                    <tr>
                      <th>Order &amp; Heraldry</th>
                      <th>Classification</th>
                      <th>Realm Seat</th>
                      <th>Leader &amp; Authority</th>
                      <th>Holdings</th>
                      <th>Diplomatic Stances</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAndFilteredFactions.map((faction) => {
                      const factionRegion = regions.find(r => r.id === faction.regionId);
                      const allies = faction.relationships?.filter(r => r.type === 'allied' || r.type === 'tense_allied' || r.type === 'secret_ally') || [];
                      const rivals = faction.relationships?.filter(r => r.type === 'hostile' || r.type === 'rival') || [];

                      return (
                        <tr key={faction.id} onClick={() => navigateToFaction(faction.id)} className="ledger-row-clickable">
                          <td className="ledger-cell-name">
                            <div className="ledger-faction-identity">
                              <div
                                className="ledger-mini-crest"
                                style={{ background: faction.colors?.primary || '#8b5a1a', borderColor: faction.colors?.secondary || '#ffd700' }}
                              >
                                <i className={`fas ${getFactionIcon(faction)}`}></i>
                              </div>
                              <div>
                                <span className="ledger-faction-title">{sanitizeLoreText(faction.name)}</span>
                                {faction.publicGoal && (
                                  <span className="ledger-faction-motto">{sanitizeLoreText(faction.publicGoal).slice(0, 75)}...</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="world-badge">{faction.type?.replace(/_/g, ' ')}</span>
                          </td>
                          <td>
                            {factionRegion ? (
                              <span className="ledger-region-tag">
                                <i className="fas fa-map-pin"></i> {factionRegion.name}
                              </span>
                            ) : (
                              <span className="world-muted">Unknown</span>
                            )}
                          </td>
                          <td>
                            <span className="ledger-leader-text">
                              {faction.leader?.title ? sanitizeLoreText(faction.leader.title) : '—'}
                            </span>
                          </td>
                          <td>
                            <span className="ledger-holdings-pill">
                              <i className="fas fa-chess-rook"></i> {faction.territory?.length || 1}
                            </span>
                          </td>
                          <td>
                            <div className="ledger-diplomacy-chips">
                              {allies.length > 0 && (
                                <span className="diplomacy-pill ally" title={`${allies.length} Allies`}>
                                  <i className="fas fa-handshake"></i> {allies.length}
                                </span>
                              )}
                              {rivals.length > 0 && (
                                <span className="diplomacy-pill rival" title={`${rivals.length} Rivals`}>
                                  <i className="fas fa-swords"></i> {rivals.length}
                                </span>
                              )}
                              {allies.length === 0 && rivals.length === 0 && (
                                <span className="world-muted">Isolated</span>
                              )}
                            </div>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="ledger-actions-cell" onClick={(e) => e.stopPropagation()}>
                              <button
                                className="btn-ledger-action"
                                onClick={() => navigateToFaction(faction.id)}
                                title="Open Full Faction Dossier"
                              >
                                <i className="fas fa-book-open"></i>
                              </button>
                              <button
                                className="btn-ledger-action"
                                onClick={() => { setSelectedFactionId(faction.id); setFactionViewMode('graph'); }}
                                title="View in Relationship Web"
                              >
                                <i className="fas fa-project-diagram"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* --- 4. RELATIONSHIP WEB VIEW --- */
              <div className="world-factions-inline-graph">
                <FactionWebGraph onFactionClick={navigateToFaction} selectedFactionId={selectedFactionId} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'lineages' && (
          <div className="world-lineages-tab">
            <div className="world-section-actions lineages-toolbar-actions">
              <div className="lineages-search-and-filter">
                <div className="lineages-search-wrapper">
                  <i className="fas fa-search lineages-search-icon"></i>
                  <input
                    type="text"
                    className="world-search-input lineages-search-input"
                    placeholder="Search lineages, traits, and bloodlines..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                  />
                  {searchFilter && (
                    <button className="lineages-clear-search-btn" onClick={() => setSearchFilter('')} title="Clear search">
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>

                {/* Category Filter Pills */}
                <div className="world-category-pills lineages-category-pills">
                  {[
                    { id: 'all', label: 'All Lineages', count: allLineages.length, icon: 'fa-dna' },
                    { id: 'canon', label: 'Canon Bloodlines', count: allLineages.filter(l => !l.isCustom).length, icon: 'fa-landmark' },
                    { id: 'custom', label: 'Custom Species', count: allLineages.filter(l => l.isCustom).length, icon: 'fa-hat-wizard' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`world-archetype-pill ${lineageCategoryFilter === cat.id ? 'active' : ''}`}
                      onClick={() => setLineageCategoryFilter(cat.id)}
                    >
                      <i className={`fas ${cat.icon}`}></i>
                      <span>{cat.label}</span>
                      <span className="pill-count">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button className="world-action-btn primary" onClick={() => openLineageWizard()}>
                <i className="fas fa-dna" /> + Forge Custom Lineage
              </button>
            </div>

            <div className="world-card-grid">
              {filteredLineages.map((lineage) => {
                const baseTraits = lineage.baseTraits || {};
                const subraces = lineage.subraces 
                  ? (Array.isArray(lineage.subraces) ? lineage.subraces : Object.values(lineage.subraces))
                  : [];

                return (
                  <div
                    key={lineage.id}
                    className="lineage-rich-card world-clickable"
                    onClick={() => navigateToLineage(lineage.id)}
                  >
                    <div className="lineage-card-header">
                      <div>
                        <h4>{lineage.name}</h4>
                        <span className="lineage-card-essence">{lineage.essence || 'Ancestral Bloodline'}</span>
                      </div>
                      {lineage.isCustom ? (
                        <span className="world-badge world-badge-custom">Custom</span>
                      ) : (
                        <span className="world-badge">Canon</span>
                      )}
                    </div>
                    
                    <p className="world-card-meta" style={{ margin: '4px 0', fontSize: '12.5px', color: '#4a2810', lineHeight: 1.5 }}>
                      {lineage.cardFlavor || (lineage.description ? lineage.description.slice(0, 120) + '...' : 'An ancient lineage of Mythrill.')}
                    </p>

                    <div className="lineage-card-stats-strip">
                      {baseTraits.lifespan && (
                        <span className="lineage-card-stat-pill">
                          <i className="fas fa-hourglass-half"></i> {baseTraits.lifespan}
                        </span>
                      )}
                      {baseTraits.baseSpeed && (
                        <span className="lineage-card-stat-pill">
                          <i className="fas fa-person-running"></i> {baseTraits.baseSpeed}ft
                        </span>
                      )}
                      {subraces.length > 0 && (
                        <span className="lineage-card-stat-pill" style={{ background: '#f0e6d6', color: '#8b5a1a' }}>
                          <i className="fas fa-code-branch"></i> {subraces.length} Bloodlines
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="world-classes-tab">
            {/* Archetype & Search Toolbar */}
            <div className="world-classes-toolbar">
              <div className="classes-search-box">
                <i className="fas fa-search" />
                <input
                  type="text"
                  placeholder="Search 21 classes, origins, roles..."
                  value={classSearchFilter}
                  onChange={(e) => setClassSearchFilter(e.target.value)}
                />
                {classSearchFilter && (
                  <button className="btn-clear-search" onClick={() => setClassSearchFilter('')} title="Clear search">
                    <i className="fas fa-times" />
                  </button>
                )}
              </div>

              <div className="world-archetype-pills-scroll-wrapper">
                <div className="world-archetype-pills">
                  {CLASS_ARCHETYPES.map((arch) => (
                    <button
                      key={arch.id}
                      type="button"
                      className={`world-archetype-pill ${selectedClassArchetype === arch.id ? 'active' : ''}`}
                      onClick={() => setSelectedClassArchetype(arch.id)}
                    >
                      <i className={`fas ${arch.icon}`} />
                      <span className="pill-full-label">{arch.label}</span>
                      <span className="pill-short-label">{arch.shortLabel}</span>
                      <span className="pill-count-badge">{arch.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="world-action-btn primary"
                onClick={() => setShowAddClassModal(true)}
                title="Forge a custom calling or tradition in this world"
                style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}
              >
                <i className="fas fa-plus"></i> Forge Custom Tradition
              </button>
            </div>

            {/* Classes Grid */}
            <div className="world-card-grid world-classes-grid">
              {classes
                .filter((cls) => {
                  const normalizedId = cls.id?.toLowerCase()?.replace(/\s+/g, '_');
                  const profile = getClassFlavorProfile(cls.id);
                  if (selectedClassArchetype !== 'all') {
                    const arch = CLASS_ARCHETYPES.find((a) => a.id === selectedClassArchetype);
                    if (arch && !arch.classIds.includes(normalizedId) && !arch.classIds.includes(cls.id?.toLowerCase())) {
                      return false;
                    }
                  }
                  if (classSearchFilter.trim()) {
                    const term = classSearchFilter.toLowerCase();
                    const matchName = cls.name?.toLowerCase().includes(term);
                    const matchOrigin = cls.originStory?.toLowerCase().includes(term);
                    const matchDesc = cls.description?.toLowerCase().includes(term);
                    const roleData = CLASS_ROLE_TAGS[normalizedId] || {};
                    const matchRole = roleData.role?.toLowerCase().includes(term);
                    const matchTagline = profile?.tagline?.toLowerCase().includes(term);
                    const matchResource = profile?.resourceName?.toLowerCase().includes(term);
                    const matchTradition = profile?.tradition?.toLowerCase().includes(term);
                    const matchFeature = profile?.keyFeatures?.some((f) => f.toLowerCase().includes(term));
                    return matchName || matchOrigin || matchDesc || matchRole || matchTagline || matchResource || matchTradition || matchFeature;
                  }
                  return true;
                })
                .map((cls) => {
                  const normalizedId = cls.id?.toLowerCase()?.replace(/\s+/g, '_')?.replace(/-/g, '_');
                  const profile = getClassFlavorProfile(cls.id);
                  const roleData = CLASS_ROLE_TAGS[normalizedId] || { role: profile?.role || 'Heroic Calling', icon: profile?.roleIcon || 'fa-star' };
                  const arch = CLASS_ARCHETYPES.find((a) => a.id !== 'all' && (a.classIds.includes(normalizedId) || a.classIds.includes(cls.id?.toLowerCase())));
                  const iconSrc = `/assets/icons/classes/${normalizedId}.png`;

                  return (
                    <div
                      key={cls.id}
                      className={`world-info-card world-clickable world-class-card ${cls.isExtinct ? 'class-card-extinct' : ''}`}
                      onClick={() => navigateToClass(cls.id)}
                      style={cls.isExtinct ? { opacity: 0.55, filter: 'grayscale(85%)', border: '1px dashed #888' } : {}}
                    >
                      <div className="class-card-header">
                        <div className="class-card-identity">
                          <div className="class-card-avatar-wrap">
                            <ClassIcon
                              src={iconSrc}
                              alt={cls.name}
                              size="small"
                              className="class-card-avatar-img"
                              dataClass={cls.name}
                            />
                            <div className="class-card-corner-icon" title={profile?.role || roleData.role}>
                              <i className={`fas ${profile?.roleIcon || roleData.icon || 'fa-scroll'}`} />
                            </div>
                          </div>
                          <div className="class-title-block">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <h4>{cls.name}</h4>
                              {cls.isCustom && <span className="world-badge world-badge-custom" style={{ fontSize: '9px', padding: '1px 5px' }}>Custom</span>}
                              {cls.isExtinct && <span className="world-badge" style={{ background: '#78281f', color: '#fff', fontSize: '9px', padding: '1px 5px' }}>Extinct / Inactive</span>}
                            </div>
                            <span className="class-archetype-tag">{cls.tradition || profile?.tradition || arch?.label?.split('&')[0] || 'Calling'}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            className="world-mini-map-btn"
                            title={cls.isExtinct ? "Restore calling to active in this world" : "Mark calling as extinct / lost in this world"}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleClassStatus(cls.id, activeWorldId);
                            }}
                            style={{ width: '26px', height: '26px', fontSize: '11px', color: cls.isExtinct ? '#27ae60' : '#c0392b' }}
                          >
                            <i className={`fas ${cls.isExtinct ? 'fa-rotate-left' : 'fa-ban'}`}></i>
                          </button>
                          <span className="class-role-pill">
                            {cls.role || profile?.role || roleData.role}
                          </span>
                        </div>
                      </div>

                      {(cls.tagline || profile?.tagline) && (
                        <div className="class-tagline-box">
                          <p className="class-tagline-text">"{cls.tagline || profile.tagline}"</p>
                        </div>
                      )}

                      <div className="class-mechanics-pills">
                        <span className="class-pill class-resource-pill" title="Unique Resource">
                          <i className={`fas ${profile?.resourceIcon || 'fa-bolt'}`} /> {cls.resourceName || profile?.resourceName || 'Unique Resource'}
                        </span>
                        {(cls.keyFeatures || profile?.keyFeatures || []).slice(0, 2).map((feat, idx) => (
                          <span key={idx} className="class-pill class-feature-pill">
                            <i className="fas fa-sparkles" /> {feat}
                          </span>
                        ))}
                      </div>

                      <p className="class-origin-snippet">
                        {profile?.loreSnippet || cls.description?.slice(0, 140) + '...'}
                      </p>

                      <div className="class-card-footer">
                        <span className="class-sites-badge">
                          <i className="fas fa-landmark" /> {cls.classSpecificLocations?.length || 1} Sacred Sites
                        </span>
                        <span className="class-view-link">
                          Dossier & History →
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {activeTab === 'atlas' && (
          <div className="world-atlas-tab-container">
            <AccountMapManager />
          </div>
        )}

        {activeTab === 'entity_graph' && (
          <div className="world-entity-graph-tab-container" style={{ height: '700px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
            <UniversalEntityGraph
              onEntityDoubleClick={(ent) => {
                if (ent.type === 'faction') navigateToFaction(ent.rawId);
                else if (ent.type === 'location') navigateToLocation(ent.rawId);
                else if (ent.type === 'lineage') navigateToLineage(ent.rawId);
                else if (ent.type === 'family_node') setActiveTab('family_trees');
              }}
            />
          </div>
        )}

        {activeTab === 'family_trees' && (
          <div className="world-family-trees-tab-container" style={{ minHeight: '650px', width: '100%' }}>
            <FamilyTreeStudio inline={true} />
          </div>
        )}
      </div>

      <CustomLineageWizard />

      {/* World Switcher & Management Modal */}
      {showWorldModal && (
        <div className="world-modal-overlay" onClick={() => setShowWorldModal(false)}>
          <div className="world-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="world-modal-header">
              <div className="world-modal-title">
                <i className="fas fa-globe"></i>
                <h3>World Settings &amp; Universes</h3>
              </div>
              <button className="world-modal-close" onClick={() => setShowWorldModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="world-modal-body">
              <p className="world-modal-subtitle">
                Switch active campaign setting or craft a brand-new sovereign world with custom realms, factions, and lineages.
              </p>
              <div className="world-switcher-grid">
                {allWorlds.map((w) => {
                  const isSelected = w.id === activeWorldId;
                  return (
                    <div
                      key={w.id}
                      className={`world-select-card ${isSelected ? 'active' : ''}`}
                      onClick={() => {
                        switchWorld(w.id);
                        setShowWorldModal(false);
                      }}
                    >
                      <div className="world-select-card-head">
                        <h4>{w.name}</h4>
                        {w.isCanonical ? (
                          <span className="world-badge-canon">Canonical Setting</span>
                        ) : (
                          <span className="world-badge-custom">Custom World</span>
                        )}
                      </div>
                      <p className="world-select-card-desc">{w.subtitle || w.description || 'Custom world setting'}</p>
                      <div className="world-select-card-footer">
                        <span className="world-select-regions-count">
                          <i className="fas fa-earth-americas"></i> {w.id === 'mythrill' ? Object.keys(CANONICAL_REGIONS_META).length + (w.customRegions?.length || 0) : (w.customRegions?.length || 0)} Realms
                        </span>
                        {!w.isCanonical && (
                          <button
                            type="button"
                            className="world-select-del-btn"
                            title="Delete World"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteWorld(w.id);
                            }}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="world-modal-actions">
              <button
                type="button"
                className="world-action-btn primary"
                onClick={() => {
                  setShowWorldModal(false);
                  setShowCreateWorldModal(true);
                }}
              >
                <i className="fas fa-plus"></i> Create New World
              </button>
              <button type="button" className="world-action-btn" onClick={() => setShowWorldModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New World Modal */}
      {showCreateWorldModal && (
        <div className="world-modal-overlay" onClick={() => setShowCreateWorldModal(false)}>
          <div className="world-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="world-modal-header">
              <div className="world-modal-title">
                <i className="fas fa-feather-pointed"></i>
                <h3>Forge a New Sovereign World</h3>
              </div>
              <button className="world-modal-close" onClick={() => setShowCreateWorldModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleCreateWorldSubmit}>
              <div className="world-modal-body">
                <div className="world-form-group">
                  <label>World / Universe Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aethelgard, Neon Spire, Eldoria..."
                    value={newWorldName}
                    onChange={(e) => setNewWorldName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="world-form-group">
                  <label>Tagline / Epoch Subtitle</label>
                  <input
                    type="text"
                    placeholder="e.g. The Age of Clockwork & Ether"
                    value={newWorldSubtitle}
                    onChange={(e) => setNewWorldSubtitle(e.target.value)}
                  />
                </div>
                <div className="world-form-group">
                  <label>Cosmology Theme &amp; Genre</label>
                  <select value={newWorldTheme} onChange={(e) => setNewWorldTheme(e.target.value)}>
                    <option value="dark-fantasy">Dark Fantasy &amp; Eldritch Horror</option>
                    <option value="high-fantasy">High Fantasy &amp; Arcane Empires</option>
                    <option value="steampunk">Gothic Steampunk &amp; Airships</option>
                    <option value="sci-fi">Cosmic Sci-Fi &amp; Void Frontiers</option>
                    <option value="post-apoc">Post-Cataclysm &amp; Ashen Wastes</option>
                  </select>
                </div>
                <div className="world-form-group">
                  <label>Cosmological Lore &amp; Overview</label>
                  <textarea
                    rows={4}
                    placeholder="Describe how your world was formed, celestial events, magic laws, or societal tenets..."
                    value={newWorldDesc}
                    onChange={(e) => setNewWorldDesc(e.target.value)}
                  />
                </div>
              </div>
              <div className="world-modal-actions">
                <button type="button" className="world-action-btn" onClick={() => setShowCreateWorldModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="world-action-btn primary">
                  <i className="fas fa-wand-magic-sparkles"></i> Forge World
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Region / Realm Modal */}
      {showAddRegionModal && (
        <div className="world-modal-overlay" onClick={() => setShowAddRegionModal(false)}>
          <div className="world-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="world-modal-header">
              <div className="world-modal-title">
                <i className="fas fa-mountain-sun"></i>
                <h3>Found a New Realm in {activeWorld.name}</h3>
              </div>
              <button className="world-modal-close" onClick={() => setShowAddRegionModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleAddCustomRegionSubmit}>
              <div className="world-modal-body">
                <div className="world-form-group">
                  <label>Realm / Region Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunspire Highlands, Whispering Wastes..."
                    value={newRegionName}
                    onChange={(e) => setNewRegionName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="world-form-row">
                  <div className="world-form-group">
                    <label>Danger Level</label>
                    <select value={newRegionDanger} onChange={(e) => setNewRegionDanger(e.target.value)}>
                      <option value="low">Low (Civilized Sanctuary)</option>
                      <option value="medium">Medium (Frontier Wilds)</option>
                      <option value="high">High (Monster Domain)</option>
                      <option value="extreme">Extreme (Cataclysmic / Deadly)</option>
                    </select>
                  </div>
                  <div className="world-form-group">
                    <label>Climate</label>
                    <input
                      type="text"
                      placeholder="e.g. Sub-zero blizzards, ashfall..."
                      value={newRegionClimate}
                      onChange={(e) => setNewRegionClimate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="world-form-group">
                  <label>Dominant Terrain</label>
                  <input
                    type="text"
                    placeholder="e.g. Basalt fjords, ancient ironwood canopy..."
                    value={newRegionTerrain}
                    onChange={(e) => setNewRegionTerrain(e.target.value)}
                  />
                </div>
                <div className="world-form-group">
                  <label>Geographic Overview &amp; Lore</label>
                  <textarea
                    rows={4}
                    placeholder="Describe the atmosphere, hazards, historical significance, and natural wonders of this realm..."
                    value={newRegionDesc}
                    onChange={(e) => setNewRegionDesc(e.target.value)}
                  />
                </div>
              </div>
              <div className="world-modal-actions">
                <button type="button" className="world-action-btn" onClick={() => setShowAddRegionModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="world-action-btn primary">
                  <i className="fas fa-map-location-dot"></i> Establish Realm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Forge Faction Modal */}
      {showAddFactionModal && (
        <div className="world-modal-overlay" onClick={() => setShowAddFactionModal(false)}>
          <div className="world-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="world-modal-header">
              <div className="world-modal-title">
                <i className="fas fa-shield-halved"></i>
                <h3>Forge Faction / Order in {activeWorld.name}</h3>
              </div>
              <button className="world-modal-close" onClick={() => setShowAddFactionModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleCreateFactionSubmit}>
              <div className="world-modal-body">
                <div className="world-form-group">
                  <label>Faction / Order Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brine Bond Syndicate, Obsidian Order..."
                    value={newFactionName}
                    onChange={(e) => setNewFactionName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="world-form-row">
                  <div className="world-form-group">
                    <label>Order Type</label>
                    <select value={newFactionType} onChange={(e) => setNewFactionType(e.target.value)}>
                      <option value="noble_house">Noble House</option>
                      <option value="guild">Guild / Syndicate</option>
                      <option value="cult">Cult / Shadow Order</option>
                      <option value="order">Holy Order / Chivalric</option>
                      <option value="clan">Clan / Tribe</option>
                      <option value="military">Military Faction</option>
                      <option value="academy">Arcane Academy</option>
                    </select>
                  </div>
                  <div className="world-form-group">
                    <label>Primary Seat / Realm</label>
                    <select value={newFactionRegionId} onChange={(e) => setNewFactionRegionId(e.target.value)}>
                      <option value="">Select Realm (Optional)</option>
                      {regions.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="world-form-row">
                  <div className="world-form-group">
                    <label>Heraldic Primary Color</label>
                    <input
                      type="color"
                      value={newFactionColorPrimary}
                      onChange={(e) => setNewFactionColorPrimary(e.target.value)}
                    />
                  </div>
                  <div className="world-form-group">
                    <label>Heraldic Secondary Color</label>
                    <input
                      type="color"
                      value={newFactionColorSecondary}
                      onChange={(e) => setNewFactionColorSecondary(e.target.value)}
                    />
                  </div>
                </div>

                <div className="world-form-group">
                  <label>Supreme Leader / Authority Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Syndicate Chancellor, High Archivist, Grand Inquisitor..."
                    value={newFactionLeaderTitle}
                    onChange={(e) => setNewFactionLeaderTitle(e.target.value)}
                  />
                </div>

                <div className="world-form-group">
                  <label>Public Mandate &amp; Official Charter</label>
                  <textarea
                    rows={2}
                    placeholder="The public doctrine, official motto, and recognized civic role..."
                    value={newFactionMandate}
                    onChange={(e) => setNewFactionMandate(e.target.value)}
                  />
                </div>

                <div className="world-form-group">
                  <label>Historical Origins &amp; Canon Lore</label>
                  <textarea
                    rows={3}
                    placeholder="How this order was founded, ancient battles, founding pacts..."
                    value={newFactionOrigins}
                    onChange={(e) => setNewFactionOrigins(e.target.value)}
                  />
                </div>

                <div className="world-form-group">
                  <label>Controlled Holdings &amp; Strongholds (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Merrowport, Brinehorse Cove, Spindrift Lagoon"
                    value={newFactionHoldings}
                    onChange={(e) => setNewFactionHoldings(e.target.value)}
                  />
                </div>

                <div className="world-form-group">
                  <label>Forbidden Secrets &amp; Exploits (GM Only)</label>
                  <textarea
                    rows={2}
                    placeholder="Secret fleets, dark bargains, covert assassination pacts..."
                    value={newFactionSecrets}
                    onChange={(e) => setNewFactionSecrets(e.target.value)}
                  />
                </div>
              </div>
              <div className="world-modal-actions">
                <button type="button" className="world-action-btn" onClick={() => setShowAddFactionModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="world-action-btn primary">
                  <i className="fas fa-shield-halved"></i> Forge Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Forge Custom Class Modal */}
      {showAddClassModal && (
        <div className="world-modal-overlay" onClick={() => setShowAddClassModal(false)}>
          <div className="world-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="world-modal-header">
              <div className="world-modal-title">
                <i className="fas fa-wand-magic-sparkles"></i>
                <h3>Forge Custom Tradition / Class in {activeWorld.name}</h3>
              </div>
              <button className="world-modal-close" onClick={() => setShowAddClassModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleCreateClassSubmit}>
              <div className="world-modal-body">
                <div className="world-form-group">
                  <label>Class / Calling Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Solar Templar, Void Chronomancer, Blood Cleric..."
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="world-form-row">
                  <div className="world-form-group">
                    <label>Tradition Archetype</label>
                    <select value={newClassTradition} onChange={(e) => setNewClassTradition(e.target.value)}>
                      <option value="Martial Orders & Vanguard">Martial Orders &amp; Vanguard</option>
                      <option value="Arcane Academies & Weavers">Arcane Academies &amp; Weavers</option>
                      <option value="Primal Callings & Wardens">Primal Callings &amp; Wardens</option>
                      <option value="Faiths, Inquisitors & Zealots">Faiths, Inquisitors &amp; Zealots</option>
                      <option value="Shadow Conspiracies & Stalkers">Shadow Conspiracies &amp; Stalkers</option>
                      <option value="Forbidden / Lost Traditions">Forbidden / Lost Traditions</option>
                    </select>
                  </div>
                  <div className="world-form-group">
                    <label>Tactical Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Holy Healer / Radiant Striker"
                      value={newClassRole}
                      onChange={(e) => setNewClassRole(e.target.value)}
                    />
                  </div>
                </div>

                <div className="world-form-row">
                  <div className="world-form-group">
                    <label>Primary Resource Mechanic</label>
                    <input
                      type="text"
                      placeholder="e.g. Divine Favor, Void Shards, Rage, Spell Slots..."
                      value={newClassResourceName}
                      onChange={(e) => setNewClassResourceName(e.target.value)}
                    />
                  </div>
                  <div className="world-form-group">
                    <label>Signature Quote / Tagline</label>
                    <input
                      type="text"
                      placeholder="e.g. In the dying light, we are the forge."
                      value={newClassTagline}
                      onChange={(e) => setNewClassTagline(e.target.value)}
                    />
                  </div>
                </div>

                <div className="world-form-group">
                  <label>Origin Lore &amp; Philosophy (Illuminated Article)</label>
                  <LoreEditorToolbar
                    value={newClassOrigin}
                    onChange={(val) => setNewClassOrigin(val)}
                  />
                  <textarea
                    rows={4}
                    placeholder="Describe how this class originated, founding pacts, training doctrines, and cultural presence in this world..."
                    value={newClassOrigin}
                    onChange={(e) => setNewClassOrigin(e.target.value)}
                    style={{ borderRadius: '0 0 6px 6px', borderTop: 'none' }}
                  />
                </div>

                <div className="world-form-group">
                  <label>Special Tactical Rules &amp; Triggers (Gamified Mechanics)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Every 3rd offensive cast triggers a Solar Burst dealing +2d8 Radiant. Critical hits refund 1 Focus."
                    value={newClassSpecialRules}
                    onChange={(e) => setNewClassSpecialRules(e.target.value)}
                  />
                </div>

                <div className="world-form-row">
                  <div className="world-form-group">
                    <label>Meaningful Sacrifices &amp; Tradeoffs</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Must channel light continuously; cannot utilize shadow rites or stealth."
                      value={newClassTradeoffs}
                      onChange={(e) => setNewClassTradeoffs(e.target.value)}
                    />
                  </div>
                  <div className="world-form-group">
                    <label>Current Era Crisis &amp; Threat</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Solar wells are running cold, forcing templars to sacrifice lifeblood for radiant power."
                      value={newClassCrisis}
                      onChange={(e) => setNewClassCrisis(e.target.value)}
                    />
                  </div>
                </div>

                <div className="world-form-row">
                  <div className="world-form-group">
                    <label>Inscribed Doctrine Quote</label>
                    <input
                      type="text"
                      placeholder="e.g. The elements do not ask if you are willing. They ask if you are precise."
                      value={newClassQuote}
                      onChange={(e) => setNewClassQuote(e.target.value)}
                    />
                  </div>
                  <div className="world-form-group">
                    <label>Speaker / Scriptor</label>
                    <input
                      type="text"
                      placeholder="e.g. Valerius the Scriptor, Canopy-Ledger"
                      value={newClassSpeaker}
                      onChange={(e) => setNewClassSpeaker(e.target.value)}
                    />
                  </div>
                </div>

                <div className="world-form-group">
                  <label>Key Features &amp; Passives (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Radiant Channeling, Heavy Armor Mastery, Smite of the Starless"
                    value={newClassFeatures}
                    onChange={(e) => setNewClassFeatures(e.target.value)}
                  />
                </div>
              </div>
              <div className="world-modal-actions">
                <button type="button" className="world-action-btn" onClick={() => setShowAddClassModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="world-action-btn primary">
                  <i className="fas fa-wand-magic-sparkles"></i> Inscribe Calling
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldDashboard;

