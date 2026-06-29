import React, { useState, useMemo } from 'react';
import { ALL_CLASSES_DATA } from '../../data/classes';
import LoreLink from '../common/LoreLink';
import { autoLinkTerminology } from '../../utils/loreAutoLinker';
import './ClassDetailDisplay.css'; // Leverage existing parchment and detail styles
import './ClassOriginsDisplay.css'; // Add specialized styles for origins and tabs
// Regions configuration
const REGIONS = [
  {
    id: 'sundale',
    name: 'Sundale Badlands',
    icon: 'fas fa-fire',
    themeColor: '#a04000',
    bgGradient: 'linear-gradient(135deg, rgba(160, 64, 0, 0.08) 0%, rgba(160, 64, 0, 0.02) 100%)',
    borderColor: '#a04000',
    glowColor: 'rgba(160, 64, 0, 0.12)',
    description: 'A volcanic ash-desert of smoldering badlands and obsidian rivers surrounding the Emberspire caldera. Here, the Emberth and Solvarn humans live in constant, desperate proximity to the dying star Solbound. Survival is a transaction paid in heat, and power is a combustion that devours the practitioner.',
    darkBargain: 'House Solvan entombed Solbound beneath the crust to save it from Keth-Amar, trading their firstborn heirs for geothermal heat.',
    classIds: ['pyrofiend', 'berserker', 'spellguard', 'martyr']
  },
  {
    id: 'nordhalla',
    name: 'Nordhalla Tundra',
    icon: 'fas fa-snowflake',
    themeColor: '#1f5f87',
    bgGradient: 'linear-gradient(135deg, rgba(31, 95, 135, 0.08) 0%, rgba(31, 95, 135, 0.02) 100%)',
    borderColor: '#1f5f87',
    glowColor: 'rgba(31, 95, 135, 0.12)',
    description: 'The frozen vigil keeps and fjord-settlements of Nordhalla. In this continent of absolute ice, summer is a myth told to children, and the dead are encased upright in glacier-tombs to stand as silent witnesses. Here, the Skald humans and their frost-touched bloodlines measure worth by endurance.',
    darkBargain: 'House Skalvyr traded summer for survival, halting the glaciers at the cost of eternal winter and the shameful history of the Hunger Winter.',
    classIds: ['augur', 'harbinger', 'animist', 'berserker']
  },
  {
    id: 'frostwood-reach',
    name: 'Frostwood Reach',
    icon: 'fas fa-tree',
    themeColor: '#196f3d',
    bgGradient: 'linear-gradient(135deg, rgba(25, 111, 61, 0.08) 0%, rgba(25, 111, 61, 0.02) 100%)',
    borderColor: '#196f3d',
    glowColor: 'rgba(25, 111, 61, 0.12)',
    description: 'A pine forest of perpetual fog where the mist eats memories and births conceptual Wyrd-horrors from human fear. The Thalren humans keep journals chained to their belts to preserve their pasts, while the mask-bound Mimir and Briaran hide in the mist-shrouded canopies.',
    darkBargain: 'House Viridane refused the Warden\'s sacrifice and fled south, making a counter-bargain with fae entities that left their descendants with physical thorns.',
    classIds: ['apex', 'shaper', 'lunarch', 'inquisitor', 'toxicologist']
  },
  {
    id: 'bryngloom-forest',
    name: 'Bryngloom Forest',
    icon: 'fas fa-leaf',
    themeColor: '#117864',
    bgGradient: 'linear-gradient(135deg, rgba(17, 120, 100, 0.08) 0%, rgba(17, 120, 100, 0.02) 100%)',
    borderColor: '#117864',
    glowColor: 'rgba(17, 120, 100, 0.12)',
    description: 'Sinking, semi-frozen bogs and bioluminescent ironwood groves where the Neth and lantern-eyed Vreken coexist in functional silence. Here, death is a renegotiated contract with the Keeper of the Last Threshold, and the bogs preserve both memories and ancestral debts.',
    darkBargain: 'The Neth negotiated the First Contract with the Keeper: preserve us, and we will be your living archive. The price: Neth cannot lie, and their blood crystallizes into volatile shards.',
    classIds: ['inquisitor', 'revenant', 'animist', 'plaguebringer', 'arcanoneer']
  },
  {
    id: 'cragjaw-peaks',
    name: 'Cragjaw Peaks',
    icon: 'fas fa-mountain',
    themeColor: '#6c3483',
    bgGradient: 'linear-gradient(135deg, rgba(108, 52, 131, 0.08) 0%, rgba(108, 52, 131, 0.02) 100%)',
    borderColor: '#6c3483',
    glowColor: 'rgba(108, 52, 131, 0.12)',
    description: 'A vertical labyrinth of razor-sharp ridges, deep steam-shafts, and ancient holdfasts buried under blizzards. The only passage across the chasms are the Ancestor-Spans — living bridges grown from the calcified bones of the Groven.',
    darkBargain: 'House Tessen keeps have lived in absolute isolation for eight generations, developing Byzantine politics to distract from their frozen imprisonment.',
    classIds: ['chronarch', 'warden', 'shaper', 'gambit', 'martyr']
  },
  {
    id: 'iceheart-sea',
    name: 'Iceheart Sea',
    icon: 'fas fa-dice',
    themeColor: '#2c3e50',
    bgGradient: 'linear-gradient(135deg, rgba(44, 62, 80, 0.08) 0%, rgba(44, 62, 80, 0.02) 100%)',
    borderColor: '#2c3e50',
    glowColor: 'rgba(44, 62, 80, 0.12)',
    description: 'A freezing, storm-lashed ocean dotted with floating ice-keeps and pirate channels. Here, the Merryn humans live as storm-chasers and gamblers, mapping their lives on their tattooed skin, navigating tides that freeze in real-time.',
    darkBargain: 'A maritime pact that grants luck and storm-navigation at the cost of tidal synchronization, forcing practitioners to live in perpetual motion.',
    classIds: ['minstrel', 'gambit']
  },
  {
    id: 'sundrift-vale',
    name: 'Sundrift Vale',
    icon: 'fas fa-star',
    themeColor: '#4a235a',
    bgGradient: 'linear-gradient(135deg, rgba(74, 35, 90, 0.08) 0%, rgba(74, 35, 90, 0.02) 100%)',
    borderColor: '#4a235a',
    glowColor: 'rgba(74, 35, 90, 0.12)',
    description: 'A starless grassland steppe of gravity anomalies and silt-tides. Here, the nomadic Ordan humans migrate along ancient songs under a black sky, while the light-bearing Astril Synod maintains the Luminarchy.',
    darkBargain: 'The Astril carrying constellation-spirits in their skin to hide them from Keth-Amar, trading their physical sight and sanity for inherited light.',
    classIds: ['augur', 'animist', 'harbinger', 'false_prophet', 'minstrel']
  }
];
// Programmatic mapping of class database names to the keys in ALL_CLASSES_DATA
const CLASS_DB_MAP = {
  arcanoneer: 'Arcanoneer',
  berserker: 'Berserker',
  shaper: 'Shaper',
  chaos_weaver: 'Harbinger',
  chronarch: 'Chronarch',
  inquisitor: 'Inquisitor',
  revenant: 'Revenant',
  // 'dreadnaught' removed (absorbed into Martyr as Ironclad specialization)

  false_prophet: 'False Prophet',
  gambit: 'Gambit',
  apex: 'Apex',
  animist: 'Animist',
  // REMOVED: lichborne merged into Revenant as Phase 1.10 consolidation
  // lichborne: 'Lichborne',
  lunarch: 'Lunarch',
  martyr: 'Martyr',
  minstrel: 'Minstrel',
  // oracle removed (absorbed into Augur)
  plaguebringer: 'Plaguebringer',
  pyrofiend: 'Pyrofiend',
  spellguard: 'Spellguard',
  // titan removed (absorbed into Warden as Monolith specialization)
  toxicologist: 'Toxicologist',
  Warden: 'Warden',
  augur: 'Augur',
  doomsayer: 'Harbinger'
};
// Parse the roleplayIdentity content which has sections like:
// **HISTORY: THE GENESIS**
// ... text ...
// **CITIES & CIVIL RECEPTION**
// ... text ...
// **RACES & CULTURAL AFFILIATION**
// ... text ...
const parseRoleplayIdentity = (content) => {
  if (!content) return { history: '', cities: '', races: '', notable: '' };
  const sections = { history: '', cities: '', races: '', notable: '' };
  const lines = content.split('\n');
  let currentSection = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      const header = trimmed.replace(/\*/g, '').toUpperCase();
      if (header.includes('HISTORY') || header.includes('GENESIS')) {
        currentSection = 'history';
        continue;
      } else if (header.includes('CITIES') || header.includes('CIVIL')) {
        currentSection = 'cities';
        continue;
      } else if (header.includes('RACES') || header.includes('CULTURAL')) {
        currentSection = 'races';
        continue;
      } else if (header.includes('NOTABLE') || header.includes('FIGURES') || header.includes('PRACTITIONERS')) {
        currentSection = 'notable';
        continue;
      }
    }
    if (currentSection) {
      sections[currentSection] += (sections[currentSection] ? '\n' : '') + line;
    }
  }
  return sections;
};
// Parse text containing <LoreLink termId="...">label</LoreLink> and **bold** markers
const parseTextWithLoreLinks = (text, skipAutoLink = false) => {
  if (!text || typeof text !== 'string') return null;
  let processedText;
  try {
    processedText = skipAutoLink ? text : autoLinkTerminology(text);
  } catch (e) {
    processedText = text;
  }
  const result = [];
  const regex = /(<LoreLink termId="([^"]+)">([^<]*)<\/LoreLink>|\*\*(.*?)\*\*)/g;
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(processedText)) !== null) {
    if (match.index > lastIndex) {
      result.push(processedText.substring(lastIndex, match.index));
    }
    if (match[2]) {
      const termId = match[2];
      const label = match[3];
      result.push(
        <LoreLink key={`lore-${key++}`} termId={termId}>
          {label}
        </LoreLink>
      );
    } else if (match[4] !== undefined) {
      result.push(
        <strong key={`bold-${key++}`}>
          {match[4]}
        </strong>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < processedText.length) {
    result.push(processedText.substring(lastIndex));
  }
  return result.length > 0 ? result : text;
};
// Render a block of text with paragraph breaks
const renderTextBlock = (text) => {
  if (!text) return null;
  return text.split('\n').filter(line => line.trim()).map((line, idx) => (
    <p key={idx} className="co-text-para">{parseTextWithLoreLinks(line.trim())}</p>
  ));
};
// Parse a list of notable figures
const parseNotableFiguresList = (notableText) => {
  if (!notableText) return [];
  const lines = notableText.split('\n');
  const figures = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('*') || trimmed.startsWith('•') || trimmed.startsWith('-')) {
      const nameMatch = trimmed.match(/^[\*\-•]\s*\*\*(.*?)\*\*\s*:\s*(.*)$/);
      if (nameMatch) {
        figures.push({
          name: nameMatch[1],
          description: nameMatch[2].trim()
        });
      } else {
        const cleanLine = trimmed.replace(/^[\*\-•]\s*/, '');
        if (cleanLine) {
          figures.push({
            name: '',
            description: cleanLine
          });
        }
      }
    }
  }
  return figures;
};
const ClassOriginsDisplay = () => {
  const [activeRegionId, setActiveRegionId] = useState('sundale');
  const [expandedClassId, setExpandedClassId] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('chronicles');
  const activeRegion = useMemo(() => {
    return REGIONS.find(r => r.id === activeRegionId) || REGIONS[0];
  }, [activeRegionId]);
  const classesInRegion = useMemo(() => {
    return activeRegion.classIds.map(classId => {
      const dbName = CLASS_DB_MAP[classId];
      const data = ALL_CLASSES_DATA[dbName];
      if (!data) return null;
      const originStory = data.overview?.originStory || '';
      const roleplayContent = data.overview?.roleplayIdentity?.content || '';
      // Parse origin story paragraphs
      const storyParagraphs = originStory.split('\n\n').filter(p => p.trim());
      // Parse roleplay identity sections
      const { history, cities, races, notable } = parseRoleplayIdentity(roleplayContent);
      return {
        id: classId,
        name: data.name,
        icon: data.icon,
        role: data.role,
        subtitle: data.overview?.subtitle || '',
        storyParagraphs,
        history,
        cities,
        races,
        notable,
        signatureQuote: data.overview?.signatureQuote || null,
        philosophy: data.overview?.philosophy || null,
        currentCrisis: data.overview?.currentCrisis || '',
        meaningfulTradeoffs: data.overview?.meaningfulTradeoffs || '',
        classSpecificLocations: data.overview?.classSpecificLocations || []
      };
    }).filter(Boolean);
  }, [activeRegion]);
  const handleRegionTabClick = (regionId) => {
    setActiveRegionId(regionId);
    setExpandedClassId(null);
    setActiveDetailTab('chronicles');
  };
  const handleClassCardClick = (classId) => {
    if (expandedClassId !== classId) {
      setActiveDetailTab('chronicles');
    }
    setExpandedClassId(expandedClassId === classId ? null : classId);
  };
  return (
    <div className="class-origins-container">
      <style>{`
        /* 100% Bulletproof Inline CSS Overrides for Centering and Legibility */
        div.class-origins-container .region-tabs-navigation {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 10px !important;
          border-bottom: 2px solid rgba(139, 69, 19, 0.18) !important;
          padding-bottom: 14px !important;
          justify-content: center !important; /* Centered tabs */
          margin-bottom: 20px !important;
        }
        div.class-origins-container button.region-tab-btn {
          background: #ebdcb8 !important;
          border: 1px solid rgba(139, 69, 19, 0.4) !important;
          border-radius: 4px !important;
          color: #4a341e !important;
          padding: 10px 16px !important;
          font-family: 'Cinzel', 'Georgia', serif !important;
          font-size: 0.85rem !important;
          font-weight: 700 !important;
          letter-spacing: 0.05em !important;
          text-transform: uppercase !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
          box-shadow: 0 2px 4px rgba(139, 69, 19, 0.08) !important;
        }
        div.class-origins-container button.region-tab-btn:hover {
          background: #fffbf2 !important;
          border-color: var(--tab-accent-color) !important;
          color: var(--tab-accent-color) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 8px rgba(139, 69, 19, 0.15) !important;
        }
        div.class-origins-container button.region-tab-btn.active {
          background: #5a1e12 !important;
          border-color: var(--tab-accent-color) !important;
          color: #fffbf2 !important;
          box-shadow: 0 0 12px var(--tab-glow-color), 0 3px 6px rgba(90, 30, 18, 0.3) !important;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5) !important;
        }
        div.class-origins-container button.region-tab-btn i {
          font-size: 0.95rem !important;
          color: #8b4513 !important;
          transition: transform 0.3s ease !important;
        }
        div.class-origins-container button.region-tab-btn.active i {
          color: #fffbf2 !important;
          transform: scale(1.1) !important;
        }
        div.class-origins-container div.region-header-card {
          padding: 24px !important;
          border-radius: 8px !important;
          box-shadow: 0 6px 20px rgba(139, 69, 19, 0.08) !important;
          border: 1px solid rgba(139, 69, 19, 0.3) !important;
          position: relative !important;
          overflow: hidden !important;
          background-color: #faf6eb !important;
          margin-bottom: 24px !important;
        }
        div.class-origins-container div.region-badge-area {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          margin-bottom: 12px !important;
        }
        div.class-origins-container div.region-badge-area i {
          font-size: 1.5rem !important;
        }
        div.class-origins-container div.region-badge-area h3 {
          font-family: 'Cinzel', 'Georgia', serif !important;
          font-size: 1.4rem !important;
          font-weight: 700 !important;
          letter-spacing: 0.08em !important;
          margin: 0 !important;
        }
        div.class-origins-container p.region-description {
          font-size: 0.98rem !important;
          line-height: 1.65 !important;
          color: #2b1c11 !important;
          margin: 0 0 16px 0 !important;
          font-weight: 500 !important;
        }
        div.class-origins-container div.region-dark-bargain {
          font-size: 0.95rem !important;
          line-height: 1.55 !important;
          color: #801a08 !important;
          background: #fff8eb !important;
          border: 1px dashed rgba(139, 69, 19, 0.35) !important;
          padding: 14px 18px !important;
          border-radius: 6px !important;
          font-style: italic !important;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.02) !important;
        }
        div.class-origins-container .co-depth-grid {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 20px !important;
          margin-top: 16px !important;
        }
        @media (max-width: 768px) {
          div.class-origins-container .co-depth-grid {
            grid-template-columns: 1fr !important;
          }
        }
        div.class-origins-container .co-philosophy-item {
          margin-bottom: 12px !important;
          line-height: 1.6 !important;
        }
        div.class-origins-container .co-philosophy-item:last-child {
          margin-bottom: 0 !important;
        }
        div.class-origins-container .co-philosophy-item strong {
          font-family: 'Cinzel', serif !important;
          font-size: 0.85rem !important;
          letter-spacing: 0.05em !important;
          display: inline-block !important;
          margin-right: 4px !important;
        }
        div.class-origins-container .co-expanded-body {
          display: flex !important;
          flex-direction: column !important;
          gap: 24px !important;
        }
        div.class-origins-container .co-expanded-body blockquote.co-pull-quote {
          font-family: 'Crimson Text', serif !important;
        }
        /* TTRPG Overrides for Notable Figures & Sites (Un-boxing) */
        div.class-origins-container .co-notable-list {
          display: flex !important;
          flex-direction: column !important;
          gap: 24px !important;
        }
        div.class-origins-container .co-notable-item {
          background: transparent !important;
          border: none !important;
          border-left: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
          display: flex !important;
          align-items: flex-start !important;
          gap: 20px !important;
          position: relative !important;
        }
        div.class-origins-container .co-notable-item::after {
          content: '' !important;
          position: absolute !important;
          bottom: -12px !important;
          left: 72px !important;
          right: 0 !important;
          height: 1px !important;
          background: linear-gradient(to right, rgba(139, 69, 19, 0.15) 0%, rgba(139, 69, 19, 0.02) 100%) !important;
        }
        div.class-origins-container .co-notable-item:last-child::after {
          display: none !important;
        }
        /* Wax Seal Medallion Style */
        div.class-origins-container .co-wax-seal {
          width: 52px !important;
          height: 52px !important;
          border-radius: 51% 49% 52% 48% / 49% 51% 50% 50% !important; /* Organic stamp shape */
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: #fffbf2 !important;
          font-family: 'Cinzel', serif !important;
          font-weight: 700 !important;
          font-size: 1.35rem !important;
          flex-shrink: 0 !important;
          box-shadow: 
            1px 2px 5px rgba(0, 0, 0, 0.35), 
            inset 1px 1px 3px rgba(255, 255, 255, 0.35), 
            inset -1px -1px 3px rgba(0, 0, 0, 0.4),
            0 0 0 3px rgba(139, 69, 19, 0.08) !important;
          border: 2px double rgba(255, 255, 255, 0.2) !important;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6) !important;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
          transform: rotate(-3deg) !important;
        }
        div.class-origins-container .co-notable-item:hover .co-wax-seal {
          transform: scale(1.08) rotate(5deg) !important;
          box-shadow: 
            2px 4px 8px rgba(0, 0, 0, 0.45), 
            inset 1px 1px 3px rgba(255, 255, 255, 0.35), 
            inset -1px -1px 3px rgba(0, 0, 0, 0.4),
            0 0 0 5px rgba(139, 69, 19, 0.12) !important;
        }
        /* Notebook Snippet Style for Sacred Sites */
        div.class-origins-container .co-site-entry {
          background: linear-gradient(to right, rgba(235, 220, 184, 0.06) 0%, rgba(253, 250, 242, 0.18) 100%) !important;
          border: none !important;
          border-left: 2.5px dashed var(--co-border) !important;
          border-radius: 0 8px 8px 0 !important;
          box-shadow: none !important;
          padding: 16px 20px !important;
          margin-bottom: 16px !important;
          display: flex !important;
          gap: 16px !important;
        }
        div.class-origins-container .co-site-entry:last-child {
          margin-bottom: 0 !important;
        }
        div.class-origins-container .co-site-icon {
          width: 36px !important;
          height: 36px !important;
          border-radius: 50% !important;
          background: rgba(139, 69, 19, 0.06) !important;
          border: 1px solid rgba(139, 69, 19, 0.18) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: var(--co-border) !important;
          flex-shrink: 0 !important;
        }
        /* Hand-stamped Ink Seal for Status */
        div.class-origins-container .co-ink-stamp {
          border: 1px solid rgba(184, 15, 10, 0.5) !important;
          color: rgba(184, 15, 10, 0.75) !important;
          background: rgba(184, 15, 10, 0.02) !important;
          padding: 3px 8px !important;
          font-family: 'Cinzel', serif !important;
          font-size: 0.7rem !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.12em !important;
          transform: rotate(-1.5deg) !important;
          display: inline-block !important;
          box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.04) !important;
          border-radius: 2px !important;
          margin-top: 8px !important;
          max-width: fit-content !important;
          text-shadow: none !important;
          font-weight: 600 !important;
        }
        /* TTRPG Pathfinder Tabs Styling */
        div.class-origins-container .co-ttrpg-tabs-bar {
          display: flex !important;
          flex-wrap: wrap !important;
          justify-content: center !important;
          gap: 16px !important;
          border-bottom: 2px double rgba(139, 69, 19, 0.25) !important;
          margin-bottom: 12px !important;
          padding-bottom: 10px !important;
          padding-left: 0 !important;
        }
        div.class-origins-container .co-ttrpg-tab-btn {
          background: transparent !important;
          border: none !important;
          border-radius: 0 !important;
          color: #4a341e !important;
          padding: 6px 16px !important;
          font-family: 'Cinzel', 'Georgia', serif !important;
          font-size: 0.9rem !important;
          font-weight: 700 !important;
          letter-spacing: 0.08em !important;
          text-transform: uppercase !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
          transition: all 0.25s ease !important;
          position: relative !important;
          opacity: 0.6 !important;
        }
        div.class-origins-container .co-ttrpg-tab-btn:hover {
          color: var(--co-accent) !important;
          opacity: 1 !important;
        }
        div.class-origins-container .co-ttrpg-tab-btn.active {
          color: var(--co-accent) !important;
          opacity: 1 !important;
          background: transparent !important;
        }
        /* Thematic gold/accent underline aligned with the tab bar's border */
        div.class-origins-container .co-ttrpg-tab-btn.active::after {
          content: '' !important;
          position: absolute !important;
          bottom: -12px !important;
          left: 10px !important;
          right: 10px !important;
          height: 3px !important;
          background-color: var(--co-border) !important;
          border-radius: 2px !important;
          box-shadow: 0 0 6px var(--co-glow) !important;
        }
        div.class-origins-container .co-ttrpg-content-pane {
          background: transparent !important;
          border: none !important;
          border-radius: 0 !important;
          padding: 8px 0 0 0 !important;
          box-shadow: none !important;
          position: relative !important;
          z-index: 1 !important;
          animation: fadeIn 0.3s ease-out !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 20px !important;
        }
        /* Multi-column Rulebook Spreads */
        div.class-origins-container .co-ttrpg-spread {
          display: grid !important;
          grid-template-columns: 1.15fr 0.85fr !important;
          gap: 32px !important;
        }
        @media (max-width: 800px) {
          div.class-origins-container .co-ttrpg-spread {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
        div.class-origins-container .co-ttrpg-section {
          margin-bottom: 12px !important;
        }
        div.class-origins-container .co-ttrpg-section:last-of-type {
          margin-bottom: 0 !important;
        }
        div.class-origins-container .co-ttrpg-heading {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          font-family: 'Cinzel', 'Georgia', serif !important;
          font-size: 1.1rem !important;
          font-weight: 700 !important;
          letter-spacing: 0.08em !important;
          text-transform: uppercase !important;
          margin: 0 0 14px 0 !important;
          padding-bottom: 6px !important;
          border-bottom: 1px solid rgba(139, 69, 19, 0.15) !important;
        }
        div.class-origins-container .co-ttrpg-heading i {
          font-size: 0.95rem !important;
          opacity: 0.95 !important;
        }
        div.class-origins-container .co-ttrpg-divider {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin: 16px 0 !important;
          position: relative !important;
        }
        div.class-origins-container .co-ttrpg-divider::before,
        div.class-origins-container .co-ttrpg-divider::after {
          content: "" !important;
          height: 1px !important;
          flex: 1 !important;
          background: linear-gradient(to right, transparent, var(--co-border) 50%, transparent) !important;
        }
        div.class-origins-container .co-ttrpg-divider-symbol {
          color: var(--co-border) !important;
          font-size: 0.9rem !important;
          margin: 0 10px !important;
          font-family: serif !important;
          opacity: 0.8 !important;
        }
      `}</style>
      {/* Region Selection Navigation */}
      <div className="region-tabs-navigation">
        {REGIONS.map(region => (
          <button
            key={region.id}
            className={`region-tab-btn ${activeRegionId === region.id ? 'active' : ''}`}
            style={{
              '--tab-accent-color': region.themeColor,
              '--tab-glow-color': region.glowColor
            }}
            onClick={() => handleRegionTabClick(region.id)}
          >
            <i className={region.icon}></i>
            <span>{region.name.replace(' Badlands', '').replace(' Tundra', '').replace(' Forest', '').replace(' Peaks', '').replace(' Reach', '').replace(' Sea', '').replace(' Vale', '')}</span>
          </button>
        ))}
      </div>
      <div
        className="region-header-card"
        style={{
          borderLeft: `5px solid ${activeRegion.borderColor}`,
          backgroundColor: '#faf6eb',
          backgroundImage: activeRegion.bgGradient,
          boxShadow: `0 4px 20px ${activeRegion.glowColor}`
        }}
      >
        <div className="region-header-top">
          <div className="region-badge-area" style={{ color: activeRegion.themeColor }}>
            <i className={activeRegion.icon}></i>
            <h3>{activeRegion.name.toUpperCase()}</h3>
          </div>
        </div>
        <p className="region-description">{parseTextWithLoreLinks(activeRegion.description)}</p>
        {activeRegion.darkBargain && (
          <div className="region-dark-bargain" style={{ borderLeft: `3px solid ${activeRegion.borderColor}` }}>
            <strong>The Dark Bargain:</strong> {parseTextWithLoreLinks(activeRegion.darkBargain)}
          </div>
        )}
      </div>
      <div className="class-origins-list">
        {classesInRegion.map(cls => {
          const border = activeRegion.borderColor;
          const accent = activeRegion.themeColor;
          return (
            <div 
              key={cls.id} 
              className={`class-origin-entry ${expandedClassId === cls.id ? 'expanded' : ''}`}
              style={{ 
                '--co-border': border, 
                '--co-glow': activeRegion.glowColor,
                '--co-accent': accent 
              }}
            >
              <div className="co-header-row" onClick={() => handleClassCardClick(cls.id)}>
                <div className="co-header-left">
                  <div className="co-class-icon" style={{ color: accent }}>
                    <i className={cls.icon}></i>
                  </div>
                  <div className="co-class-title">
                    <h4>{cls.name}</h4>
                    {cls.subtitle && <span className="co-subtitle">{cls.subtitle}</span>}
                  </div>
                  <span className="co-role-badge" style={{ color: accent, background: `${accent}0c`, borderColor: `${accent}25` }}>
                    {cls.role}
                  </span>
                </div>
                <div className="co-expand-btn">
                  <i className={`fas ${expandedClassId === cls.id ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </div>
              </div>
              {expandedClassId === cls.id && (
                <div className="co-expanded-body">
                  {/* Tabs navigation bar */}
                  <div className="co-ttrpg-tabs-bar">
                    <button
                      className={`co-ttrpg-tab-btn ${activeDetailTab === 'chronicles' ? 'active' : ''}`}
                      onClick={() => setActiveDetailTab('chronicles')}
                    >
                      <i className="fas fa-book-open"></i>
                      <span>Chronicles</span>
                    </button>
                    <button
                      className={`co-ttrpg-tab-btn ${activeDetailTab === 'society' ? 'active' : ''}`}
                      onClick={() => setActiveDetailTab('society')}
                    >
                      <i className="fas fa-users"></i>
                      <span>Society</span>
                    </button>
                    <button
                      className={`co-ttrpg-tab-btn ${activeDetailTab === 'beliefs' ? 'active' : ''}`}
                      onClick={() => setActiveDetailTab('beliefs')}
                    >
                      <i className="fas fa-gem"></i>
                      <span>Beliefs</span>
                    </button>
                    <button
                      className={`co-ttrpg-tab-btn ${activeDetailTab === 'atlas' ? 'active' : ''}`}
                      onClick={() => setActiveDetailTab('atlas')}
                    >
                      <i className="fas fa-map"></i>
                      <span>Atlas</span>
                    </button>
                  </div>
                  {/* Content Pane */}
                  <div className="co-ttrpg-content-pane">
                    {/* Chronicles Tab */}
                    {activeDetailTab === 'chronicles' && (
                      <>
                        {cls.storyParagraphs && cls.storyParagraphs.length > 0 && (
                          <div className="co-ttrpg-section">
                            <div className="co-ttrpg-heading" style={{ color: accent }}>
                              <i className="fas fa-book-open"></i>
                              <span>Origin Story</span>
                            </div>
                            <div className="co-ttrpg-section-body">
                              <div className="co-origin-body">
                                {cls.signatureQuote && cls.signatureQuote.text && cls.signatureQuote.text.trim().length > 0 && (
                                  <blockquote className="co-pull-quote" style={{ '--co-border': border }}>
                                    <span>{cls.signatureQuote.text}</span>
                                    {cls.signatureQuote.speaker && (
                                      <span style={{ display: 'block', fontSize: '0.85rem', marginTop: '8px', color: '#7a6a55', fontStyle: 'normal' }}>
                                        — <strong>{cls.signatureQuote.speaker}</strong>
                                        {cls.signatureQuote.context && `, ${cls.signatureQuote.context}`}
                                      </span>
                                    )}
                                  </blockquote>
                                )}
                                {cls.storyParagraphs.map((para, idx) => (
                                  <p key={idx} className="co-text-para">{parseTextWithLoreLinks(para)}</p>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        {cls.storyParagraphs && cls.storyParagraphs.length > 0 && cls.history && (
                          <div className="co-ttrpg-divider">
                            <span className="co-ttrpg-divider-symbol">❖</span>
                          </div>
                        )}
                        {cls.history && (
                          <div className="co-ttrpg-section">
                            <div className="co-ttrpg-heading" style={{ color: accent }}>
                              <i className="fas fa-scroll"></i>
                              <span>History & Genesis</span>
                            </div>
                            <div className="co-ttrpg-section-body">
                              {renderTextBlock(cls.history)}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    {/* Society Tab */}
                    {activeDetailTab === 'society' && (
                      <>
                        {cls.cities && (
                          <div className="co-ttrpg-section">
                            <div className="co-ttrpg-heading" style={{ color: accent }}>
                              <i className="fas fa-city"></i>
                              <span>Cities & Civil Reception</span>
                            </div>
                            <div className="co-ttrpg-section-body">
                              {renderTextBlock(cls.cities)}
                            </div>
                          </div>
                        )}
                        {cls.cities && cls.races && (
                          <div className="co-ttrpg-divider">
                            <span className="co-ttrpg-divider-symbol">❖</span>
                          </div>
                        )}
                        {cls.races && (
                          <div className="co-ttrpg-section">
                            <div className="co-ttrpg-heading" style={{ color: accent }}>
                              <i className="fas fa-users"></i>
                              <span>Races & Cultural Affiliation</span>
                            </div>
                            <div className="co-ttrpg-section-body">
                              {renderTextBlock(cls.races)}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    {/* Beliefs Tab */}
                    {activeDetailTab === 'beliefs' && (
                      <>
                        {cls.philosophy && (
                          <div className="co-ttrpg-section">
                            <div className="co-ttrpg-heading" style={{ color: accent }}>
                              <i className="fas fa-gem"></i>
                              <span>Philosophy</span>
                            </div>
                            <div className="co-ttrpg-section-body">
                              {cls.philosophy.coreTenet && (
                                <div className="co-ttrpg-sub-section">
                                  <strong style={{ color: accent, fontFamily: "'Cinzel', serif", fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Core Tenet</strong>
                                  <p className="co-text-para">{parseTextWithLoreLinks(cls.philosophy.coreTenet)}</p>
                                </div>
                              )}
                              {cls.philosophy.relationship && (
                                <div className="co-ttrpg-sub-section" style={{ marginTop: '14px' }}>
                                  <strong style={{ color: accent, fontFamily: "'Cinzel', serif", fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Relationship to Power</strong>
                                  <p className="co-text-para">{parseTextWithLoreLinks(cls.philosophy.relationship)}</p>
                                </div>
                              )}
                              {cls.philosophy.paradox && (
                                <div className="co-ttrpg-sub-section" style={{ marginTop: '14px' }}>
                                  <strong style={{ color: accent, fontFamily: "'Cinzel', serif", fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>The Paradox</strong>
                                  <p className="co-text-para">{parseTextWithLoreLinks(cls.philosophy.paradox)}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {cls.philosophy && (cls.meaningfulTradeoffs || cls.currentCrisis) && (
                          <div className="co-ttrpg-divider">
                            <span className="co-ttrpg-divider-symbol">❖</span>
                          </div>
                        )}
                        {cls.meaningfulTradeoffs && (
                          <div className="co-ttrpg-section">
                            <div className="co-ttrpg-heading" style={{ color: accent }}>
                              <i className="fas fa-scale-balanced"></i>
                              <span>What You Sacrifice</span>
                            </div>
                            <div className="co-ttrpg-section-body">
                              {renderTextBlock(cls.meaningfulTradeoffs)}
                            </div>
                          </div>
                        )}
                        {cls.meaningfulTradeoffs && cls.currentCrisis && (
                          <div className="co-ttrpg-divider">
                            <span className="co-ttrpg-divider-symbol">❖</span>
                          </div>
                        )}
                        {cls.currentCrisis && (
                          <div className="co-ttrpg-section">
                            <div className="co-ttrpg-heading" style={{ color: '#c0392b' }}>
                              <i className="fas fa-exclamation-triangle"></i>
                              <span>Current Crisis</span>
                            </div>
                            <div className="co-ttrpg-section-body">
                              <p className="co-text-para">{parseTextWithLoreLinks(cls.currentCrisis)}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    {/* Atlas Tab */}
                    {activeDetailTab === 'atlas' && (
                      <>
                        {cls.classSpecificLocations && cls.classSpecificLocations.length > 0 && (
                          <div className="co-ttrpg-section">
                            <div className="co-ttrpg-heading" style={{ color: accent }}>
                              <i className="fas fa-map-pin"></i>
                              <span>Sacred Sites</span>
                            </div>
                            <div className="co-ttrpg-section-body">
                              {cls.classSpecificLocations.map((loc, idx) => (
                                <div key={idx} className="co-site-entry" style={{ '--co-border': border }}>
                                  <div className="co-site-icon" style={{ color: accent }}>
                                    <i className="fas fa-map-marker-alt"></i>
                                  </div>
                                  <div className="co-notable-content">
                                    <div className="co-notable-name" style={{ color: accent }}>{loc.name}</div>
                                    <p className="co-text-para">{parseTextWithLoreLinks(loc.description)}</p>
                                    {loc.status && <div className="co-ink-stamp">{loc.status}</div>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {cls.classSpecificLocations && cls.classSpecificLocations.length > 0 && cls.notable && cls.notable.length > 0 && (
                          <div className="co-ttrpg-divider">
                            <span className="co-ttrpg-divider-symbol">❖</span>
                          </div>
                        )}
                        {cls.notable && cls.notable.length > 0 && (
                          <div className="co-ttrpg-section">
                            <div className="co-ttrpg-heading" style={{ color: accent }}>
                              <i className="fas fa-award"></i>
                              <span>Legendary Practitioners</span>
                            </div>
                            <div className="co-ttrpg-section-body">
                              <div className="co-notable-list">
                                {parseNotableFiguresList(cls.notable).map((fig, idx) => (
                                  <div key={idx} className="co-notable-item">
                                    <div className="co-wax-seal" style={{ backgroundColor: accent }}>
                                      {fig.name ? fig.name.trim().charAt(0) : '*'}
                                    </div>
                                    <div className="co-notable-content">
                                      <div className="co-notable-name" style={{ color: accent }}>{fig.name}</div>
                                      <p className="co-text-para">{parseTextWithLoreLinks(fig.description)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ClassOriginsDisplay;