import React, { useState, useRef, useMemo, useEffect } from 'react';
import UnifiedSpellCard from '../spellcrafting-wizard/components/common/UnifiedSpellCard';
import { getSpellRollableTable } from '../spellcrafting-wizard/core/utils/spellCardTransformer';
import ClassResourceBar from '../hud/ClassResourceBar';
import { getIconUrl, getCustomIconUrl } from '../../utils/assetManager';
import { getClassResourceConfig } from '../../data/classResources';
import SphereComboFinder from './SphereComboFinder';
import './ClassDetailDisplay.css';
import ClassIcon from '../common/ClassIcon';
import './SphereComboFinder.css';
import LoreLink from '../common/LoreLink';
import { autoLinkTerminology } from '../../utils/loreAutoLinker';
import { RULES_CATEGORIES } from '../../data/rulesData';


/**
 * Build a sensible demo classResource prop for the rules page preview.
 * Reads directly from classResources.js so every class automatically works.
 */
const buildDemoClassResource = (className) => {
  const cfg = getClassResourceConfig(className);
  if (!cfg) return { current: 0, max: 10, spheres: [] };

  const m = cfg.mechanics;

  // Bladedancer: momentum + flourish + stance
  if (cfg.type === 'dual-resource' && m.momentum && m.flourish) {
    return {
      current: 8,
      max: m.momentum.max || 20,
      momentum: 8,
      flourish: 3,
      stance: m.stance?.current || 'Flowing Water',
      spheres: []
    };
  }

  // Chronarch: timeShards + temporalStrain
  if (m.timeShards && m.temporalStrain) {
    return {
      current: 3,
      max: m.timeShards.max || 10,
      timeShards: { current: 3, max: m.timeShards.max || 10 },
      temporalStrain: { current: 2, max: m.temporalStrain.max || 10 },
      spheres: []
    };
  }

  // Toxicologist: toxinVials + contraptionParts
  if (m.toxinVials && m.contraptionParts) {
    return {
      current: 3,
      max: 6, // INT mod + 3 demo value
      spheres: []
    };
  }

  // Minstrel: musical notes
  if (m.maxPerNote && m.totalNotes) {
    return {
      current: 3,
      max: m.totalNotes || 7,
      notes: [3, 1, 2, 0, 2, 1, 0],
      maxPerNote: m.maxPerNote,
      totalNotes: m.totalNotes,
      spheres: []
    };
  }

  // Inscriptor: runes + inscriptions
  if (m.runes && m.inscriptions) {
    return {
      current: 3,
      max: m.runes.max || 8,
      current2: 1,
      max2: m.inscriptions.max || 3,
      spheres: []
    };
  }

  // Arcanoneer: elemental spheres (uses max = 4 to avoid 0 block)
  if (cfg.visual?.type === 'elemental-spheres') {
    return {
      current: 4,
      max: 4,
      spheres: ['fire', 'frost', 'arcane', 'nature']
    };
  }

  // Plaguebringer: virulence uses maxVirulence
  if (m.maxVirulence !== undefined) {
    return { current: 65, max: m.maxVirulence || 100, spheres: [] };
  }

  // Gambler: varies by spec - use 21 (High Roller) as demo
  if (cfg.id === 'fortunePoints') {
    return { current: 5, max: 21, spheres: [] };
  }

  // Lichborne: phylactery HP
  if (m.phylactery) {
    return { current: 25, max: m.phylactery.max || 50, spheres: [] };
  }

  // Standard current/max
  const max = (typeof m.max === 'number' && m.max > 0) ? m.max : 10;
  const current = Math.round(max * 0.45); // ~45% filled for a nice demo look
  return { current, max, spheres: [] };
};

// Programmatic mapping of classes to their native world regions for premium TTRPG color accents
const CLASS_REGIONS = {
  arcanoneer: {
    regionId: 'bryngloom-forest',
    regionName: 'Bryngloom Forest',
    accentColor: '#16a085', // swamp-teal
    bgGradient: 'linear-gradient(135deg, rgba(22, 160, 133, 0.06) 0%, rgba(26, 188, 156, 0.02) 100%)',
    borderColor: '#16a085',
    glowColor: 'rgba(22, 160, 133, 0.15)',
    icon: 'fas fa-tree'
  },
  deathcaller: {
    regionId: 'bryngloom-forest',
    regionName: 'Bryngloom Forest',
    accentColor: '#16a085',
    bgGradient: 'linear-gradient(135deg, rgba(22, 160, 133, 0.06) 0%, rgba(26, 188, 156, 0.02) 100%)',
    borderColor: '#16a085',
    glowColor: 'rgba(22, 160, 133, 0.15)',
    icon: 'fas fa-ghost'
  },
  covenbane: {
    regionId: 'bryngloom-forest',
    regionName: 'Bryngloom Forest',
    accentColor: '#16a085',
    bgGradient: 'linear-gradient(135deg, rgba(22, 160, 133, 0.06) 0%, rgba(26, 188, 156, 0.02) 100%)',
    borderColor: '#16a085',
    glowColor: 'rgba(22, 160, 133, 0.15)',
    icon: 'fas fa-crosshairs'
  },
  witch_doctor: {
    regionId: 'bryngloom-forest',
    regionName: 'Bryngloom Forest',
    accentColor: '#16a085',
    bgGradient: 'linear-gradient(135deg, rgba(22, 160, 133, 0.06) 0%, rgba(26, 188, 156, 0.02) 100%)',
    borderColor: '#16a085',
    glowColor: 'rgba(22, 160, 133, 0.15)',
    icon: 'fas fa-mortar-pestle'
  },
  plaguebringer: {
    regionId: 'bryngloom-forest',
    regionName: 'Bryngloom Forest',
    accentColor: '#16a085',
    bgGradient: 'linear-gradient(135deg, rgba(22, 160, 133, 0.06) 0%, rgba(26, 188, 156, 0.02) 100%)',
    borderColor: '#16a085',
    glowColor: 'rgba(22, 160, 133, 0.15)',
    icon: 'fas fa-vial'
  },
  lichborne: {
    regionId: 'bryngloom-forest',
    regionName: 'Bryngloom Forest',
    accentColor: '#16a085',
    bgGradient: 'linear-gradient(135deg, rgba(22, 160, 133, 0.06) 0%, rgba(26, 188, 156, 0.02) 100%)',
    borderColor: '#16a085',
    glowColor: 'rgba(22, 160, 133, 0.15)',
    icon: 'fas fa-skull'
  },
  pyrofiend: {
    regionId: 'sundale',
    regionName: 'Sundale Badlands',
    accentColor: '#d35400', // fire-amber
    bgGradient: 'linear-gradient(135deg, rgba(211, 84, 0, 0.06) 0%, rgba(230, 126, 34, 0.02) 100%)',
    borderColor: '#d35400',
    glowColor: 'rgba(211, 84, 0, 0.15)',
    icon: 'fas fa-fire'
  },
  berserker: {
    regionId: 'sundale',
    regionName: 'Sundale Badlands',
    accentColor: '#d35400',
    bgGradient: 'linear-gradient(135deg, rgba(211, 84, 0, 0.06) 0%, rgba(230, 126, 34, 0.02) 100%)',
    borderColor: '#d35400',
    glowColor: 'rgba(211, 84, 0, 0.15)',
    icon: 'fas fa-gavel'
  },
  titan: {
    regionId: 'sundale',
    regionName: 'Sundale Badlands',
    accentColor: '#d35400',
    bgGradient: 'linear-gradient(135deg, rgba(211, 84, 0, 0.06) 0%, rgba(230, 126, 34, 0.02) 100%)',
    borderColor: '#d35400',
    glowColor: 'rgba(211, 84, 0, 0.15)',
    icon: 'fas fa-mountain'
  },
  spellguard: {
    regionId: 'sundale',
    regionName: 'Sundale Badlands',
    accentColor: '#d35400',
    bgGradient: 'linear-gradient(135deg, rgba(211, 84, 0, 0.06) 0%, rgba(230, 126, 34, 0.02) 100%)',
    borderColor: '#d35400',
    glowColor: 'rgba(211, 84, 0, 0.15)',
    icon: 'fas fa-shield-alt'
  },
  martyr: {
    regionId: 'sundale',
    regionName: 'Sundale Badlands',
    accentColor: '#d35400',
    bgGradient: 'linear-gradient(135deg, rgba(211, 84, 0, 0.06) 0%, rgba(230, 126, 34, 0.02) 100%)',
    borderColor: '#d35400',
    glowColor: 'rgba(211, 84, 0, 0.15)',
    icon: 'fas fa-heart'
  },
  augur: {
    regionId: 'nordhalla',
    regionName: 'Nordhalla Tundra',
    accentColor: '#2980b9', // frosty blue
    bgGradient: 'linear-gradient(135deg, rgba(41, 128, 185, 0.06) 0%, rgba(52, 152, 219, 0.02) 100%)',
    borderColor: '#2980b9',
    glowColor: 'rgba(41, 128, 185, 0.15)',
    icon: 'fas fa-eye'
  },
  doomsayer: {
    regionId: 'nordhalla',
    regionName: 'Nordhalla Tundra',
    accentColor: '#2980b9',
    bgGradient: 'linear-gradient(135deg, rgba(41, 128, 185, 0.06) 0%, rgba(52, 152, 219, 0.02) 100%)',
    borderColor: '#2980b9',
    glowColor: 'rgba(41, 128, 185, 0.15)',
    icon: 'fas fa-hourglass-end'
  },
  inscriptor: {
    regionId: 'nordhalla',
    regionName: 'Nordhalla Tundra',
    accentColor: '#2980b9',
    bgGradient: 'linear-gradient(135deg, rgba(41, 128, 185, 0.06) 0%, rgba(52, 152, 219, 0.02) 100%)',
    borderColor: '#2980b9',
    glowColor: 'rgba(41, 128, 185, 0.15)',
    icon: 'fas fa-pen-fancy'
  },
  warden: {
    regionId: 'nordhalla',
    regionName: 'Nordhalla Tundra',
    accentColor: '#2980b9',
    bgGradient: 'linear-gradient(135deg, rgba(41, 128, 185, 0.06) 0%, rgba(52, 152, 219, 0.02) 100%)',
    borderColor: '#2980b9',
    glowColor: 'rgba(41, 128, 185, 0.15)',
    icon: 'fas fa-compass'
  },
  huntress: {
    regionId: 'frostwood-reach',
    regionName: 'Frostwood Reach',
    accentColor: '#27ae60', // ancient pine
    bgGradient: 'linear-gradient(135deg, rgba(39, 174, 96, 0.06) 0%, rgba(46, 204, 113, 0.02) 100%)',
    borderColor: '#27ae60',
    glowColor: 'rgba(39, 174, 96, 0.15)',
    icon: 'fas fa-leaf'
  },
  bladedancer: {
    regionId: 'frostwood-reach',
    regionName: 'Frostwood Reach',
    accentColor: '#27ae60',
    bgGradient: 'linear-gradient(135deg, rgba(39, 174, 96, 0.06) 0%, rgba(46, 204, 113, 0.02) 100%)',
    borderColor: '#27ae60',
    glowColor: 'rgba(39, 174, 96, 0.15)',
    icon: 'fas fa-wind'
  },
  lunarch: {
    regionId: 'frostwood-reach',
    regionName: 'Frostwood Reach',
    accentColor: '#27ae60',
    bgGradient: 'linear-gradient(135deg, rgba(39, 174, 96, 0.06) 0%, rgba(46, 204, 113, 0.02) 100%)',
    borderColor: '#27ae60',
    glowColor: 'rgba(39, 174, 96, 0.15)',
    icon: 'fas fa-moon'
  },
  exorcist: {
    regionId: 'frostwood-reach',
    regionName: 'Frostwood Reach',
    accentColor: '#27ae60',
    bgGradient: 'linear-gradient(135deg, rgba(39, 174, 96, 0.06) 0%, rgba(46, 204, 113, 0.02) 100%)',
    borderColor: '#27ae60',
    glowColor: 'rgba(39, 174, 96, 0.15)',
    icon: 'fas fa-bell'
  },
  toxicologist: {
    regionId: 'frostwood-reach',
    regionName: 'Frostwood Reach',
    accentColor: '#27ae60',
    bgGradient: 'linear-gradient(135deg, rgba(39, 174, 96, 0.06) 0%, rgba(46, 204, 113, 0.02) 100%)',
    borderColor: '#27ae60',
    glowColor: 'rgba(39, 174, 96, 0.15)',
    icon: 'fas fa-skull-crossbones'
  },
  formbender: {
    regionId: 'cragjaw-peaks',
    regionName: 'Cragjaw Peaks',
    accentColor: '#8e44ad', // slate purple
    bgGradient: 'linear-gradient(135deg, rgba(142, 68, 173, 0.06) 0%, rgba(155, 89, 182, 0.02) 100%)',
    borderColor: '#8e44ad',
    glowColor: 'rgba(142, 68, 173, 0.15)',
    icon: 'fas fa-hammer'
  },
  dreadnaught: {
    regionId: 'cragjaw-peaks',
    regionName: 'Cragjaw Peaks',
    accentColor: '#8e44ad',
    bgGradient: 'linear-gradient(135deg, rgba(142, 68, 173, 0.06) 0%, rgba(155, 89, 182, 0.02) 100%)',
    borderColor: '#8e44ad',
    glowColor: 'rgba(142, 68, 173, 0.15)',
    icon: 'fas fa-shield-alt'
  },
  fate_weaver: {
    regionId: 'cragjaw-peaks',
    regionName: 'Cragjaw Peaks',
    accentColor: '#8e44ad',
    bgGradient: 'linear-gradient(135deg, rgba(142, 68, 173, 0.06) 0%, rgba(155, 89, 182, 0.02) 100%)',
    borderColor: '#8e44ad',
    glowColor: 'rgba(142, 68, 173, 0.15)',
    icon: 'fas fa-project-diagram'
  },
  chronarch: {
    regionId: 'cragjaw-peaks',
    regionName: 'Cragjaw Peaks',
    accentColor: '#8e44ad',
    bgGradient: 'linear-gradient(135deg, rgba(142, 68, 173, 0.06) 0%, rgba(155, 89, 182, 0.02) 100%)',
    borderColor: '#8e44ad',
    glowColor: 'rgba(142, 68, 173, 0.15)',
    icon: 'fas fa-history'
  },
  gambler: {
    regionId: 'iceheart-sea',
    regionName: 'Iceheart Sea',
    accentColor: '#2c3e50', // deep indigo
    bgGradient: 'linear-gradient(135deg, rgba(44, 62, 80, 0.06) 0%, rgba(52, 73, 94, 0.02) 100%)',
    borderColor: '#2c3e50',
    glowColor: 'rgba(44, 62, 80, 0.15)',
    icon: 'fas fa-dice'
  },
  minstrel: {
    regionId: 'iceheart-sea',
    regionName: 'Iceheart Sea',
    accentColor: '#2c3e50',
    bgGradient: 'linear-gradient(135deg, rgba(44, 62, 80, 0.06) 0%, rgba(52, 73, 94, 0.02) 100%)',
    borderColor: '#2c3e50',
    glowColor: 'rgba(44, 62, 80, 0.15)',
    icon: 'fas fa-music'
  },
  oracle: {
    regionId: 'sundrift-vale',
    regionName: 'Sundrift Vale',
    accentColor: '#6c5ce7', // twilight purple
    bgGradient: 'linear-gradient(135deg, rgba(108, 92, 231, 0.06) 0%, rgba(162, 155, 254, 0.02) 100%)',
    borderColor: '#6c5ce7',
    glowColor: 'rgba(108, 92, 231, 0.15)',
    icon: 'fas fa-star'
  },
  primalist: {
    regionId: 'sundrift-vale',
    regionName: 'Sundrift Vale',
    accentColor: '#6c5ce7',
    bgGradient: 'linear-gradient(135deg, rgba(108, 92, 231, 0.06) 0%, rgba(162, 155, 254, 0.02) 100%)',
    borderColor: '#6c5ce7',
    glowColor: 'rgba(108, 92, 231, 0.15)',
    icon: 'fas fa-paw'
  },
  chaos_weaver: {
    regionId: 'sundrift-vale',
    regionName: 'Sundrift Vale',
    accentColor: '#6c5ce7',
    bgGradient: 'linear-gradient(135deg, rgba(108, 92, 231, 0.06) 0%, rgba(162, 155, 254, 0.02) 100%)',
    borderColor: '#6c5ce7',
    glowColor: 'rgba(108, 92, 231, 0.15)',
    icon: 'fas fa-atom'
  },
  false_prophet: {
    regionId: 'sundrift-vale',
    regionName: 'Sundrift Vale',
    accentColor: '#6c5ce7',
    bgGradient: 'linear-gradient(135deg, rgba(108, 92, 231, 0.06) 0%, rgba(162, 155, 254, 0.02) 100%)',
    borderColor: '#6c5ce7',
    glowColor: 'rgba(108, 92, 231, 0.15)',
    icon: 'fas fa-exclamation-triangle'
  }
};

// Robust scanner/tokenizer that converts markdown and LoreLink markup into clickable React nodes
const parseTextWithLoreLinks = (text, skipAutoLink = false) => {
  if (!text || typeof text !== 'string') return null;

  // Dynamically auto-link all dictionary terminology first
  const processedText = skipAutoLink ? text : autoLinkTerminology(text);

  const result = [];
  const regex = /(<LoreLink termId="([^"]+)">([\s\S]*?)<\/LoreLink>|\*\*(.*?)\*\*)/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(processedText)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      result.push(processedText.substring(lastIndex, match.index));
    }

    if (match[2]) {
      // LoreLink match: match[2] is termId, match[3] is label
      const termId = match[2];
      const label = match[3];
      result.push(
        <LoreLink key={`lore-${key++}`} termId={termId}>
          {parseTextWithLoreLinks(label, true)}
        </LoreLink>
      );
    } else if (match[4] !== undefined) {
      // Bold match: match[4] is the bold content
      const boldText = match[4];
      result.push(
        <strong key={`bold-${key++}`}>
          {parseTextWithLoreLinks(boldText, skipAutoLink)}
        </strong>
      );
    }

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < processedText.length) {
    result.push(processedText.substring(lastIndex));
  }

  return result.length > 0 ? result : processedText;
};

// Helper function to dynamically parse the class's Genesis lore origin and physical toll paragraphs
const parseResourceOrigin = (content) => {
  if (!content) return null;
  const paragraphs = content.split(/\n\s*\n/);
  let genesisText = '';
  let priceText = '';
  
  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i].trim();
    if (p.startsWith('**HISTORY: THE GENESIS**') || p.includes('HISTORY: THE GENESIS')) {
      // Extract the narrative (remove the header)
      genesisText = p.replace(/\*\*HISTORY: THE GENESIS\*\*\s*\n*/i, '').trim();
      // The next paragraph is the physical price
      if (i + 1 < paragraphs.length) {
        const nextP = paragraphs[i+1].trim();
        if (!nextP.startsWith('**')) {
          priceText = nextP;
        }
      }
      break;
    }
  }
  
  if (!genesisText) return null;
  return { genesis: genesisText, price: priceText };
};

// Helper function to extract notable figures for a specific class within a region section
const getNotableFiguresForClass = (regionSection, className) => {
  if (!regionSection || !regionSection.content || !className) return [];
  const content = regionSection.content;
  
  // Locate the class's card block inside the region content HTML
  const nameQueryEscaped = `class-lore-name\\">${className}`;
  const nameQueryRaw = `class-lore-name">${className}`;
  let classIndex = content.indexOf(nameQueryEscaped);
  if (classIndex === -1) {
    classIndex = content.indexOf(nameQueryRaw);
  }
  if (classIndex === -1) return [];

  // Search backwards for the start of the class card
  let cardStartIdx = content.lastIndexOf('<div class="class-lore-card"', classIndex);
  if (cardStartIdx === -1) {
    cardStartIdx = content.lastIndexOf('<div class=\\"class-lore-card\\"', classIndex);
  }
  if (cardStartIdx === -1) return [];

  // Search forwards for the start of the next card or the end of content
  let cardEndIdx = content.indexOf('<div class="class-lore-card"', classIndex + 20);
  if (cardEndIdx === -1) {
    cardEndIdx = content.indexOf('<div class=\\"class-lore-card\\"', classIndex + 20);
  }
  if (cardEndIdx === -1 || cardEndIdx < cardStartIdx) {
    cardEndIdx = content.length;
  }

  const cardContent = content.substring(cardStartIdx, cardEndIdx);
  const parts = cardContent.split(/\*\*Notable Figures\*\*/i);
  if (parts.length < 2) return [];
  
  // Extract bullet points
  const lines = parts[1].split('\n');
  const figures = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('*') || trimmed.startsWith('•') || trimmed.startsWith('-')) {
      // Format: * **Name**: description
      const nameMatch = trimmed.match(/^[\*\-•]\s*\*\*(.*?)\*\*\s*:\s*(.*)$/);
      if (nameMatch) {
        // Strip trailing HTML tags like </div> or </p> from the description, while keeping LoreLink
        const rawDesc = nameMatch[2].trim();
        const cleanDesc = rawDesc.replace(/<(?!LoreLink\b|\/LoreLink\b)\/?[a-zA-Z0-9]+[^>]*>/g, '').trim();
        figures.push({
          name: nameMatch[1],
          description: cleanDesc
        });
      } else {
        const cleanLine = trimmed.replace(/^[\*\-•]\s*/, '');
        if (cleanLine) {
          const cleanDesc = cleanLine.replace(/<(?!LoreLink\b|\/LoreLink\b)\/?[a-zA-Z0-9]+[^>]*>/g, '').trim();
          figures.push({
            name: '',
            description: cleanDesc
          });
        }
      }
    }
  }
  return figures;
};


/**
 * ClassDetailDisplay Component
 *
 * Displays detailed information about a specific class including:
 * - Overview (RP identity, combat role, playstyle)
 * - Resource System (unique mechanic explanation)
 * - Specializations (talent trees/specs)
 * - Example Spells (showcasing the class's capabilities)
 */
const ClassDetailDisplay = ({ classData, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [combatExampleOpen, setCombatExampleOpen] = useState(false);
  const contentContainerRef = useRef(null);

  // Handle click for spell details - show popup
  const handleSpellClick = (spell) => {
    setSelectedSpell(spell);
  };

  // Handle closing the spell popup
  const handleCloseSpellPopup = () => {
    setSelectedSpell(null);
  };

  if (!classData) {
    return (
      <div className="class-detail-error">
        <i className="fas fa-exclamation-triangle"></i>
        <p>Tradition data not found</p>
      </div>
    );
  }

  const renderContent = (content) => {
    if (!content) return null;
    if (typeof content !== 'string') return null;
    return content.split('\n\n').map((paragraph, i) => (
      <p key={i}>
        {parseTextWithLoreLinks(paragraph)}
      </p>
    ));
  };

  const renderStructuredContent = (content) => {
    if (!content) return null;
    if (typeof content !== 'string') return null;

    const lines = content.split('\n');
    const blocks = [];
    let currentItems = [];
    let currentHeader = null;
    let currentHeaderText = null;

    const flushItems = () => {
      if (currentItems.length > 0) {
        blocks.push({ type: 'list', items: [...currentItems], header: currentHeaderText });
        currentItems = [];
        currentHeaderText = null;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        flushItems();
        continue;
      }

      const isBullet = line.startsWith('- ') || line.startsWith('• ');
      const isNumbered = /^\d+\.\s/.test(line);
      const boldOnlyMatch = line.match(/^\*\*(.*?)\*\*$/);
      const boldColonMatch = line.match(/^\*\*(.*?)\*\*:\s*(.*)/);

      if (isBullet) {
        const text = line.replace(/^[-•]\s*/, '');
        currentItems.push({ text, style: 'bullet' });
      } else if (isNumbered) {
        const numMatch = line.match(/^(\d+)\.\s*(.*)/);
        currentItems.push({ text: numMatch[2], num: numMatch[1], style: 'numbered' });
      } else if (boldOnlyMatch) {
        flushItems();
        currentHeaderText = boldOnlyMatch[1];
      } else if (boldColonMatch) {
        flushItems();
        blocks.push({
          type: 'kv',
          key: boldColonMatch[1],
          value: boldColonMatch[2]
        });
      } else {
        flushItems();
        blocks.push({ type: 'text', content: line });
      }
    }
    flushItems();

    return (
      <div className="mech-blocks">
        {blocks.map((block, idx) => {
          if (block.type === 'kv') {
            return (
              <div className="mech-kv" key={idx}>
                <span className="mech-kv-key" dangerouslySetInnerHTML={{ __html: block.key }} />
                <span className="mech-kv-val" dangerouslySetInnerHTML={{
                  __html: block.value.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }} />
              </div>
            );
          }

          if (block.type === 'list') {
            return (
              <div className="mech-list-block" key={idx}>
                {block.header && (
                  <div className="mech-list-title" dangerouslySetInnerHTML={{
                    __html: block.header.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }} />
                )}
                <ul className={`mech-list ${block.items.some(it => it.style === 'numbered') ? 'mech-list-numbered' : ''}`}>
                  {block.items.map((item, j) => (
                    <li key={j}>
                      {item.style === 'numbered' && <span className="mech-num">{item.num}.</span>}
                      <span dangerouslySetInnerHTML={{
                        __html: item.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      }} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          }

          return (
            <p className="mech-text" key={idx} dangerouslySetInnerHTML={{
              __html: block.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            }} />
          );
        })}
      </div>
    );
  };

  // Parsers to extract structured fields from markdown strings for the dashboard dossier
  const parseCombatRole = (content) => {
    if (!content) return {};
    const lines = content.split('\n');
    const result = {
      primaryRole: '',
      whyBringMe: '',
      howYouFight: [],
      strengths: [],
      weaknesses: []
    };

    let currentKey = '';
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Match markdown section headings
      const primaryRoleMatch = trimmed.match(/^\*\*Primary Role\*\*:\s*(.*)/i);
      const whyBringMeMatch = trimmed.match(/^\*\*Why Bring Me\??(?:\s*\([^)]+\))?\*\*:\s*(.*)/i);
      const howYouFightMatch = trimmed.match(/^\*\*How You Fight\*\*:\s*(.*)/i);
      const strengthsMatch = trimmed.match(/^\*\*Strengths\*\*:\s*(.*)/i);
      const weaknessesMatch = trimmed.match(/^\*\*Weaknesses\*\*:\s*(.*)/i);

      if (primaryRoleMatch) {
        result.primaryRole = primaryRoleMatch[1];
        currentKey = 'primaryRole';
      } else if (whyBringMeMatch) {
        result.whyBringMe = whyBringMeMatch[1];
        currentKey = 'whyBringMe';
      } else if (howYouFightMatch) {
        result.howYouFight = [];
        if (howYouFightMatch[1]) result.howYouFight.push(howYouFightMatch[1]);
        currentKey = 'howYouFight';
      } else if (strengthsMatch) {
        result.strengths = [];
        if (strengthsMatch[1]) result.strengths.push(strengthsMatch[1]);
        currentKey = 'strengths';
      } else if (weaknessesMatch) {
        result.weaknesses = [];
        if (weaknessesMatch[1]) result.weaknesses.push(weaknessesMatch[1]);
        currentKey = 'weaknesses';
      } else {
        // Append bullet/numbered points or append to string
        if (currentKey === 'howYouFight') {
          const itemMatch = trimmed.match(/^\d+\.\s*(.*)/);
          if (itemMatch) {
            result.howYouFight.push(itemMatch[1]);
          } else {
            result.howYouFight.push(trimmed);
          }
        } else if (currentKey === 'strengths') {
          const bulletMatch = trimmed.match(/^[-•*]\s*(.*)/);
          if (bulletMatch) {
            result.strengths.push(bulletMatch[1]);
          } else {
            result.strengths.push(trimmed);
          }
        } else if (currentKey === 'weaknesses') {
          const bulletMatch = trimmed.match(/^[-•*]\s*(.*)/);
          if (bulletMatch) {
            result.weaknesses.push(bulletMatch[1]);
          } else {
            result.weaknesses.push(trimmed);
          }
        } else if (currentKey === 'whyBringMe') {
          result.whyBringMe += (result.whyBringMe ? ' ' : '') + trimmed;
        } else if (currentKey === 'primaryRole') {
          result.primaryRole += (result.primaryRole ? ' ' : '') + trimmed;
        }
      }
    });

    return result;
  };

  const parseRoleplayIdentity = (content) => {
    if (!content) return [];
    const sections = [];
    const paragraphs = content.split('\n\n');
    let currentSection = null;

    paragraphs.forEach(para => {
      const trimmed = para.trim();
      if (!trimmed) return;

      const headerMatch = trimmed.match(/^\*\*(.*?)\*\*\s*\n*(.*)/s);
      if (headerMatch) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: headerMatch[1],
          content: headerMatch[2] || ''
        };
      } else if (currentSection) {
        currentSection.content += '\n\n' + trimmed;
      } else {
        currentSection = {
          title: '',
          content: trimmed
        };
      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }
    return sections;
  };

  // Immersive parsed Actual Play logger for class combat examples
  const renderCombatExampleContent = (content) => {
    if (!content) return null;
    if (typeof content !== 'string') return null;

    const paragraphs = content.split('\n\n');
    return (
      <div className="combat-example-parsed">
        {paragraphs.map((p, idx) => {
          const trimmed = p.trim();
          if (!trimmed) return null;

          // 1. The Scenario Setup Card
          const setupMatch = trimmed.match(/^\*\*The Setup\*\*:\s*(.*)/i);
          if (setupMatch) {
            return (
              <div className="combat-setup-card" key={idx}>
                <div className="card-tag"><i className="fas fa-scroll"></i> THE SCENARIO SETUP</div>
                <p dangerouslySetInnerHTML={{ __html: setupMatch[1].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </div>
            );
          }

          // 2. Character spec status bar
          const charSpecMatch = trimmed.match(/^\*\*You are a Level (\d+) ([^*:\n]+)\*\*(.*)/i);
          if (charSpecMatch) {
            return (
              <div className="combat-char-status-bar" key={idx}>
                <div className="status-header">
                  <span className="char-badge"><i className="fas fa-user-shield"></i> LEVEL {charSpecMatch[1]} {charSpecMatch[2].toUpperCase()}</span>
                  <span className="combat-label"><i className="fas fa-crosshairs"></i> STATUS STATUS EFFECT</span>
                </div>
                <div className="status-body">
                  <p dangerouslySetInnerHTML={{ __html: charSpecMatch[3].trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
              </div>
            );
          }

          // 3. Turn divider
          const turnMatch = trimmed.match(/^\*\*Turn (\d+)\s*—\s*([^*:\n]+)\*\*(.*)/i);
          if (turnMatch) {
            return (
              <div className="combat-turn-header" key={idx}>
                <div className="turn-number-tag">TURN {turnMatch[1]}</div>
                <div className="turn-title">{turnMatch[2]}</div>
                {turnMatch[3] && <div className="turn-meta" dangerouslySetInnerHTML={{ __html: turnMatch[3].trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />}
              </div>
            );
          }

          // 4. Interactive 3D Dice Tray
          const rollMatch = trimmed.match(/^\*\*Roll (\d+d\d+)\*\*:\s*\[(.*?)\]\s*(?:→|->)\s*(.*)/i);
          if (rollMatch) {
            const diceValues = rollMatch[2].split(',').map(d => d.trim());
            return (
              <div className="combat-dice-roll-card" key={idx}>
                <div className="dice-roll-header">
                  <span className="dice-label"><i className="fas fa-dice-d20"></i> DADO DICE ROLL: {rollMatch[1]}</span>
                  <span className="dice-outcome">{rollMatch[3]}</span>
                </div>
                <div className="dice-tray">
                  {diceValues.map((val, i) => (
                    <div className="dice-block d8-die" key={i}>
                      <span className="die-bg"><i className="fas fa-cube"></i></span>
                      <span className="die-val">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // Roll fallback in case brackets are different
          if (trimmed.startsWith('**Roll ') && !rollMatch) {
            return (
              <div className="combat-simple-roll" key={idx}>
                <div className="simple-roll-header">
                  <i className="fas fa-dice-d20"></i> ACTIVE ROLL RECORD
                </div>
                <p dangerouslySetInnerHTML={{ __html: trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </div>
            );
          }

          // 5. In-character narrative actions (starts and ends with asterisk)
          if (trimmed.startsWith('*') && trimmed.endsWith('*')) {
            const narrativeText = trimmed.slice(1, -1);
            return (
              <div className="combat-narrative-action" key={idx}>
                <i className="fas fa-quote-left narrative-quote-icon"></i>
                <p dangerouslySetInnerHTML={{ __html: narrativeText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </div>
            );
          }

          // 6. Tactical resolutions
          const resultMatch = trimmed.match(/^\*\*Result\*\*:\s*(.*)/i);
          const costMatch = trimmed.match(/^\*\*Cost\*\*:\s*(.*)/i);
          const mindRacesMatch = trimmed.match(/^\*\*Your Mind Races\*\*:\s*(.*)/i);

          if (resultMatch) {
            return (
              <div className="combat-tactical-result" key={idx}>
                <div className="result-header"><i className="fas fa-clipboard-check"></i> ACTION RESOLUTION OUTCOME</div>
                <p dangerouslySetInnerHTML={{ __html: resultMatch[1].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </div>
            );
          }

          if (mindRacesMatch) {
            return (
              <div className="combat-tactical-strategy" key={idx}>
                <div className="strategy-header"><i className="fas fa-brain"></i> TACTICAL DECISION LOG</div>
                <p dangerouslySetInnerHTML={{ __html: mindRacesMatch[1].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </div>
            );
          }

          // Fallback to standard render content
          return (
            <div className="combat-default-block" key={idx}>
              {renderContent(trimmed)}
            </div>
          );
        })}
      </div>
    );
  };

  const renderTradition = () => {
    const { overview } = classData;
    const originStoryText = overview?.originStory || '';
    const classId = (classData.id || classData.name || '').toLowerCase().replace(/\s+/g, '_');
    
    const regionInfo = CLASS_REGIONS[classId] || {
      regionId: 'unknown',
      regionName: 'Unknown Lands',
      accentColor: '#8b4513',
      bgGradient: 'linear-gradient(135deg, rgba(139, 69, 19, 0.08) 0%, rgba(139, 69, 19, 0.03) 100%)',
      borderColor: '#8b4513',
      glowColor: 'rgba(139, 69, 19, 0.1)',
      icon: 'fas fa-scroll'
    };

    if (!originStoryText) {
      return (
        <div className="class-detail-section parchment-content">
          <div className="lore-covenant-card" style={{ borderLeft: '4px solid #8b4513' }}>
            <div className="covenant-card-header" style={{ color: '#8b4513' }}>
              <span className="covenant-badge" style={{ backgroundColor: '#8b4513' }}>
                <i className="fas fa-scroll"></i> Lore Unknown
              </span>
              <h4>The Unrecorded Tradition</h4>
            </div>
            <div className="covenant-card-body">
              <p>The mythic histories and oral traditions of this calling have not yet been fully transcribed from the regional archives. Scholars are currently scouring the keeps for forgotten journals and covenant clauses.</p>
            </div>
          </div>
        </div>
      );
    }

    const paragraphs = originStoryText.split('\n\n').filter(p => p.trim());
    
    let callToAction = null;
    let mainParagraphs = [...paragraphs];
    if (paragraphs.length > 1) {
      const lastPara = paragraphs[paragraphs.length - 1].trim();
      if (lastPara.toLowerCase().startsWith('as a ') || 
          lastPara.toLowerCase().startsWith('you are ') || 
          lastPara.toLowerCase().startsWith('the fire in ') ||
          lastPara.toLowerCase().startsWith('you carry ')) {
        callToAction = lastPara;
        mainParagraphs.pop();
      }
    }

    const classOriginsSub = RULES_CATEGORIES
      .find(cat => cat.id === 'world-lore')
      ?.subcategories?.find(sub => sub.id === 'class-origins');

    const regionSection = classOriginsSub?.content?.sections?.find(sec => {
      if (!regionInfo.regionId) return false;
      return sec.title.toLowerCase().includes(regionInfo.regionId.toLowerCase()) ||
             sec.title.toLowerCase().includes(regionInfo.regionName.split(' ')[0].toLowerCase());
    });

    const notableFigures = getNotableFiguresForClass(regionSection, classData.name);

    return (
      <div className="class-detail-section parchment-content">
        <div 
          className="lore-covenant-card" 
          style={{ 
            borderLeft: `4px solid ${regionInfo.borderColor}`,
            background: regionInfo.bgGradient,
            boxShadow: `0 4px 15px ${regionInfo.glowColor}, inset 0 0 20px rgba(139, 69, 19, 0.02)`
          }}
        >
          <div className="covenant-card-header" style={{ color: regionInfo.accentColor }}>
            <span className="covenant-badge" style={{ backgroundColor: regionInfo.accentColor }}>
              <i className={regionInfo.icon}></i> {regionInfo.regionName.toUpperCase()} TRADITION
            </span>
            <h4>{classData.name} Origin & Heritage</h4>
          </div>
          
          <div className="covenant-card-body" style={{ fontStyle: 'normal' }}>
            <div className="lore-text">
              {mainParagraphs.map((para, idx) => (
                <p key={idx}>{parseTextWithLoreLinks(para)}</p>
              ))}
            </div>

            {callToAction && (
              <div className="tradition-call-to-action" style={{ borderLeft: `3px solid ${regionInfo.borderColor}` }}>
                <p>{parseTextWithLoreLinks(callToAction)}</p>
              </div>
            )}
          </div>
        </div>

        {notableFigures.length > 0 && (
          <div className="chronicle-card full-width-card" style={{ marginTop: '20px' }}>
            <div className="chronicle-card-header bronze-header">
              <i className="fas fa-users"></i> LEGENDARY PRACTITIONERS
            </div>
            <div className="notable-practitioners-list">
              {notableFigures.map((fig, idx) => {
                const initial = fig.name ? fig.name.trim().charAt(0) : 'P';
                return (
                  <div 
                    key={idx} 
                    className="practitioner-card" 
                    style={{ borderLeft: `4px solid ${regionInfo.borderColor}` }}
                  >
                    <div className="practitioner-avatar" style={{ backgroundColor: regionInfo.accentColor }}>
                      {initial}
                    </div>
                    <div className="practitioner-content">
                      <h5 style={{ color: regionInfo.accentColor }}>{fig.name}</h5>
                      <p>{parseTextWithLoreLinks(fig.description)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderOverview = () => {
    const { overview } = classData;

    // Fallback watercolor image assets map based on class ID for an authentic guidebook feel
    const classFallbacks = {
      arcanoneer: { url: '/assets/images/classes/arcanoneer_illustration.png', caption: 'A Neth Vault Keeper Arcanoneer.' },
      berserker: { url: '/assets/images/classes/berserker_illustration.png', caption: 'A Mimir Face Thief Berserker.' },
      false_prophet: { url: '/assets/images/classes/false_prophet_illustration.png', caption: 'A Vreken Starved False Prophet.' },
      bladedancer: { url: '/assets/images/classes/bladedancer_illustration.png', caption: 'An Emberth Ash-Born Bladedancer wielding dual curved swords trailing kinetic sparks.' },
      dreadnaught: { url: '/assets/images/classes/dreadnaught_illustration.png', caption: 'A Groven Dreadnaught stone-troll sentinel with a massive stone shield.' },
      deathcaller: { url: '/assets/images/classes/deathcaller_illustration.png', caption: 'A Briaran Deathcaller commanding the natural cycle of decay with delicate leaves in their hair.' },
      lichborne: { url: '/assets/images/classes/lichborne_illustration.png', caption: 'A Fexrick Lichborne deep-gnome tinkerer with alchemical clockwork grafts.' },
      inscriptor: { url: '/assets/images/classes/inscriptor_illustration.png', caption: 'A Mask-Borne Mimir Inscriptor sitting stationary and carving a bleeding rune into the stone.' },
      primalist: { url: '/assets/images/classes/primalist_illustration.png', caption: 'A Groven Primalist, a stone-troll channeling blue crackling lightning.' },
      pyrofiend: { url: '/assets/images/classes/pyrofiend_illustration.png', caption: 'An Emberth Pyrofiend, a Damned Conduit manifesting molten charcoal skin and burning demon embers.' },
      titan: { url: '/assets/images/classes/titan_illustration.png', caption: 'A Groven Titan, a slender stone-troll with rough slate plates fused to their joints.' },
      oracle: { url: '/assets/images/classes/oracle_illustration.png', caption: 'An Astril Oracle, a starlight-aligned cosmic conduit of starry revelations.' },
      martyr: { url: '/assets/images/classes/martyr_illustration.png', caption: 'A Vreken Martyr flagellant in tattered rags radiating divine light.' },
      toxicologist: { url: '/assets/images/classes/toxicologist_illustration.png', caption: 'A Mimir Toxicologist, a mysterious alchemist wearing a flat reflective silver mask and a tattered bark-hide cloak.' },
      plaguebringer: { url: '/assets/images/classes/plaguebringer_illustration.png', caption: 'An Unwoven Mimir Plaguebringer holding a bubbling vial of toxic green corruption.' },
      witchdoctor: { url: '/assets/images/classes/witchdoctor_illustration.png', caption: 'A Briaran Witch Doctor mixing marrow-blood in a cracked bone flask.' },
      minstrel: { url: '/assets/images/classes/minstrel_illustration.png', caption: 'A Myrathil Minstrel channeling living melody with a delicate lute.' },
      covenbane: { url: '/assets/images/classes/covenbane_illustration.png', caption: 'An Emberth Covenbane in dark steel plate wielding a hex-cleaving battleaxe.' },
      huntress: { url: '/assets/images/classes/huntress_illustration.png', caption: 'A Mist-Woven Mimir Huntress pulling back a recurve bow with thorny arrows.' },
      warden: { url: '/assets/images/classes/warden_illustration.png', caption: 'A Briaran Warden forest scout tracing boundary paths with a brass compass.' },
      gambler: { url: '/assets/images/classes/gambler_illustration.png', caption: 'A Neth Gambler dancing on the scales of blind fortune, flipping a glowing coin.' },
      chronarch: { url: '/assets/images/classes/chronarch_illustration.png', caption: 'An Astril Chronarch using starlight sand to stabilize a bleeding timeline.' },
      spellguard: { url: '/assets/images/classes/spellguard_illustration.png', caption: 'A Fexrick Spellguard deep-gnome shield-master carrying a glowing magical tower shield.' },
      augur: { url: '/assets/images/classes/augur_illustration.png', caption: 'An Astril Augur nebula seer holding a glowing crystal ball tracing stargate alignments.' },
      doomsayer: { url: '/assets/images/classes/doomsayer_illustration.png', caption: 'A Skald Doomsayer clutching an ancient, decaying scroll shouting warnings of decay.' },
      fate_weaver: { url: '/assets/images/classes/fate_weaver_illustration.png', caption: 'An Astril Fate Weaver spinning starlight destiny from golden threads.' },
      chaos_weaver: { url: '/assets/images/classes/chaos_weaver_illustration.png', caption: 'A Vreken Chaos Weaver casting erratic fragmented purple void circles.' },
      formbender: { url: '/assets/images/classes/formbender_illustration.png', caption: 'A Briaran Formbender shapeshifting with erupting wooden bone frames.' },
      exorcist: { url: '/assets/images/classes/exorcist_illustration.png', caption: 'A Vreken Exorcist zealot warding off shadows with bronze bells and sigils.' },
      lunarch: { url: '/assets/images/classes/lunarch_illustration.png', caption: 'A Mask-Borne Mimir Lunarch, a vessel of the lunar parasite with cold starlight veins.' }
    };

const classId = (classData.id || classData.name || '').toLowerCase().replace(/\s+/g, '_');
    const illustrationData = overview.illustration 
      ? { url: overview.illustration, caption: overview.illustrationCaption } 
      : classFallbacks[classId];

    const rawCombatRoleData = parseCombatRole(overview.combatRole?.content);
    const roleplaySections = parseRoleplayIdentity(overview.roleplayIdentity?.content);

    // Deep Tactical Dossier Fallbacks to guarantee content is never empty
    const combatRoleData = useMemo(() => {
      const data = { ...rawCombatRoleData };

      // 1. Fallback for primaryRole
      if (!data.primaryRole && classData.role) {
        data.primaryRole = classData.role;
      }

      // 2. Fallback for whyBringMe (Promise)
      if (!data.whyBringMe) {
        if (overview.quickOverview?.content) {
          // Extract What You Need to Know section or first sentences
          const tlDrMatch = overview.quickOverview.content.match(/\*\*What You Need to Know\*\*:\s*([^\n]+)/i) || 
                            overview.quickOverview.content.match(/\*\*TL;DR\*\*:\s*([^\n]+)/i);
          if (tlDrMatch && tlDrMatch[1]) {
            data.whyBringMe = tlDrMatch[1].replace(/\*\*/g, '').trim();
          }
        }
        if (!data.whyBringMe && overview.combatRole?.content) {
          // Use first paragraph of combatRole content
          const paragraphs = overview.combatRole.content.split('\n\n');
          if (paragraphs[0]) {
            data.whyBringMe = paragraphs[0].replace(/\*\*/g, '').trim();
          }
        }
        if (!data.whyBringMe && overview.description) {
          data.whyBringMe = overview.description.replace(/\*\*/g, '').trim();
        }
        if (!data.whyBringMe) {
          data.whyBringMe = `Play as the ${classData.name} and master their unique tactical mechanics to dominate the battlefield.`;
        }
      }

      // 3. Fallback for strengths: aggregate from specs if empty
      if (!data.strengths || data.strengths.length === 0) {
        const specStrengths = [];
        if (classData.specializations?.specs) {
          classData.specializations.specs.forEach(spec => {
            if (spec.strengths && Array.isArray(spec.strengths)) {
              spec.strengths.forEach(str => {
                const cleaned = str.replace(/\*\*/g, '').trim();
                if (!specStrengths.includes(cleaned)) specStrengths.push(cleaned);
              });
            }
          });
        }
        if (specStrengths.length > 0) {
          data.strengths = specStrengths.slice(0, 4); // Take top 4
        } else {
          data.strengths = [
            "High tactical adaptability to shifting threats",
            "Strong team synergy and support capabilities",
            "Specialized resource economy for high-impact turns"
          ];
        }
      }

      // 4. Fallback for weaknesses: aggregate from specs if empty
      if (!data.weaknesses || data.weaknesses.length === 0) {
        const specWeaknesses = [];
        if (classData.specializations?.specs) {
          classData.specializations.specs.forEach(spec => {
            if (spec.weaknesses && Array.isArray(spec.weaknesses)) {
              spec.weaknesses.forEach(weak => {
                const cleaned = weak.replace(/\*\*/g, '').trim();
                if (!specWeaknesses.includes(cleaned)) specWeaknesses.push(cleaned);
              });
            }
          });
        }
        if (specWeaknesses.length > 0) {
          data.weaknesses = specWeaknesses.slice(0, 4); // Take top 4
        } else {
          data.weaknesses = [
            "Vulnerable to heavy crowd control or mobility locks",
            "Demands careful resource planning to avoid stalling",
            "Requires precise positioning to maximize spell effectiveness"
          ];
        }
      }

      // 5. Fallback for howYouFight: generate clean general steps if empty
      if (!data.howYouFight || data.howYouFight.length === 0) {
        if (overview.quickOverview?.content) {
          const coreLoopMatch = overview.quickOverview.content.match(/\*\*Core Loop\*\*:\s*([^\n]+)/i) ||
                                overview.quickOverview.content.match(/\*\*Core Mechanic\*\*:\s*([^\n]+)/i);
          if (coreLoopMatch && coreLoopMatch[1]) {
            const steps = coreLoopMatch[1].split('→').map(s => s.trim().replace(/\*\*/g, ''));
            if (steps.length > 1) {
              data.howYouFight = steps;
            }
          }
        }
        if (!data.howYouFight || data.howYouFight.length === 0) {
          data.howYouFight = [
            "Generate your unique class resources through targeted attacks and setups.",
            "Monitor cooldowns and align precursor conditions before invoking massive powers.",
            "Trigger devastating high-tier finishers while staying safely behind your frontliners."
          ];
        }
      }

      return data;
    }, [rawCombatRoleData, classData, overview]);


    return (
      <div className="class-detail-section parchment-content">
        <div className="guide-badge-header">
          <span className="guide-badge">
            <i className="fas fa-book-open"></i> TRADITION OVERVIEW
          </span>
          <h3>{overview.title}</h3>
          {overview.subtitle && (
            <div className="guide-subtitle">“{overview.subtitle}”</div>
          )}
        </div>

        {/* Top Concept Quote Section */}
        {overview.description && (
          <div className="overview-concept-quote">
            <i className="fas fa-quote-left quote-icon-bg"></i>
            <div className="quote-text">
              {renderContent(overview.description)}
            </div>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="overview-dashboard-grid">
          
          {/* Left Column: Dossier specs and tactical pros/cons */}
          <div className="overview-dossier-column">
            
            <div className="dossier-card spec-card">
              {illustrationData && (
                <div className="guide-illustration-wrapper-centered">
                  <div className="guide-illustration-frame">
                    <img
                      src={illustrationData.url}
                      alt={illustrationData.caption}
                      className="guide-illustration-image"
                    />
                    <div className="guide-illustration-caption">
                      {illustrationData.caption}
                    </div>
                  </div>
                </div>
              )}

              <div className="dossier-specs-list">
                <div className="dossier-spec-row">
                  <span className="spec-label"><i className="fas fa-shield-alt"></i> ROLE</span>
                  <span className="spec-value">{classData.role}</span>
                </div>
                {classData.resourceSystem && (
                  <div className="dossier-spec-row">
                    <span className="spec-label"><i className="fas fa-bolt"></i> RESOURCE</span>
                    <span className="spec-value">{classData.resourceSystem.title}</span>
                  </div>
                )}
                {classData.damageTypes && classData.damageTypes.length > 0 && (
                  <div className="dossier-spec-row damage-spec-row">
                    <span className="spec-label"><i className="fas fa-fire"></i> DAMAGE</span>
                    <span className="spec-value damage-types-container">
                      {classData.damageTypes.map((d, i) => (
                        <span key={i} className={`damage-type-tag dmg-${d.toLowerCase()}`}>
                          {d.charAt(0).toUpperCase() + d.slice(1)}
                        </span>
                      ))}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {overview.combatRole && (
              <div className="dossier-card tactical-card">
                <div className="dossier-card-header crimson-header">
                  <i className="fas fa-swords"></i> TACTICAL DOSSIER
                </div>
                
                {combatRoleData.primaryRole && (
                  <div className="dossier-sub-section">
                    <span className="sub-label">Combat Archetype</span>
                    <p className="sub-text">{combatRoleData.primaryRole}</p>
                  </div>
                )}

                {combatRoleData.whyBringMe && (
                  <div className="dossier-sub-section">
                    <span className="sub-label">Why Bring This Tradition?</span>
                    <p className="sub-text italic-promise">“{combatRoleData.whyBringMe}”</p>
                  </div>
                )}

                <div className="tactical-pros-cons-grid">
                  {combatRoleData.strengths && combatRoleData.strengths.length > 0 && (
                    <div className="tactical-list-section pros">
                      <div className="list-title"><i className="fas fa-check-circle"></i> KEY STRENGTHS</div>
                      <ul>
                        {combatRoleData.strengths.map((str, idx) => (
                          <li key={idx} dangerouslySetInnerHTML={{
                            __html: str.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          }} />
                        ))}
                      </ul>
                    </div>
                  )}

                  {combatRoleData.weaknesses && combatRoleData.weaknesses.length > 0 && (
                    <div className="tactical-list-section cons">
                      <div className="list-title"><i className="fas fa-exclamation-triangle"></i> VULNERABILITIES</div>
                      <ul>
                        {combatRoleData.weaknesses.map((weak, idx) => (
                          <li key={idx} dangerouslySetInnerHTML={{
                            __html: weak.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          }} />
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Deep strategy logs & loops */}
          <div className="overview-chronicles-column">
            
            {combatRoleData.howYouFight && combatRoleData.howYouFight.length > 0 && (
              <div className="chronicle-card flow-card">
                <div className="chronicle-card-header gold-header">
                  <i className="fas fa-spinner"></i> COMBAT LOOP: HOW YOU FIGHT
                </div>
                <div className="flow-steps-container">
                  {combatRoleData.howYouFight.map((step, idx) => (
                    <div className="flow-step-item" key={idx}>
                      <div className="flow-step-number">{idx + 1}</div>
                      <div className="flow-step-body" dangerouslySetInnerHTML={{
                        __html: step.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {overview.playstyle && (
              <div className="chronicle-card playstyle-card">
                <div className="chronicle-card-header dark-gold-header">
                  <i className="fas fa-crown"></i> MASTER GUIDE: EXPERT TACTICS
                </div>
                <div className="playstyle-body">
                  {renderContent(overview.playstyle.content)}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Full-Width Lore Card positioned underneath the grid */}
        {roleplaySections.length > 0 && (
          <div className="chronicle-card lore-card full-width-card">
            <div className="chronicle-card-header bronze-header">
              <i className="fas fa-theater-masks"></i> ROLEPLAY NARRATIVE & ORIGINS
            </div>
            <div className="chronicle-scroll-content lore-grid-layout">
              {roleplaySections.map((sec, idx) => (
                <div className="lore-sub-section" key={idx}>
                  {sec.title && <h5>{sec.title}</h5>}
                  <div className="lore-text">
                    {renderContent(sec.content)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collapsible Combat Example at the Bottom (Full-Width) */}
        {overview.immersiveCombatExample && (
          <div className={`guide-flavor-box collapsible bottom-flavor-box full-width-card ${combatExampleOpen ? 'open' : 'closed'}`}>
            <div className="flavor-box-header" onClick={() => setCombatExampleOpen(!combatExampleOpen)}>
              <div className="flavor-box-tag">
                <i className="fas fa-book"></i> NARRATIVE CHRONICLE: {overview.immersiveCombatExample.title || 'COMBAT EXAMPLE'}
              </div>
              <button className="flavor-box-toggle" aria-label={combatExampleOpen ? 'Collapse' : 'Expand'}>
                <i className={`fas fa-chevron-${combatExampleOpen ? 'up' : 'down'}`}></i>
              </button>
            </div>
            {combatExampleOpen && (
              <div className="flavor-box-content">
                {renderCombatExampleContent(overview.immersiveCombatExample.content || overview.immersiveCombatExample)}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Helper function to render a resource table
  const renderResourceTable = (tableData, tableKey) => {
    if (!tableData) return null;

    return (
      <div className="guide-table-container" key={tableKey}>
        <div className="guide-table-title">
          <i className="fas fa-scroll"></i> {tableData.title}
        </div>
        <div className="guide-table-wrapper">
          <table className="guide-table class-resource-table">
            <thead>
              <tr>
                {tableData.headers.map((header, idx) => (
                  <th key={idx}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, rowIdx) => (
                <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'row-even' : 'row-odd'}>
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Helper function to parse and render Playing in Person content
  const renderPlayingInPersonContent = (content) => {
    if (!content) return null;

    // Extract materials and parse reference card into structured data
    const lines = content.split('\n');
    let materials = [];
    let inMaterials = false;
    let inCodeBlock = false;
    let codeBlockLines = [];

    lines.forEach((line) => {
      // Check for materials section start
      if (line.includes('**What You Need**') || line.includes('**Required Materials**')) {
        inMaterials = true;
        return;
      }

      // Check for code block delimiters
      if (line.trim() === '```') {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlockLines = [];
        } else {
          inCodeBlock = false;
        }
        return;
      }

      // Collect materials (bullet points starting with -)
      if (inMaterials && line.trim().startsWith('-')) {
        const material = line.trim().substring(1).trim().replace(/\*\*/g, '');
        materials.push(material);
        return;
      }

      // Collect code block content
      if (inCodeBlock) {
        codeBlockLines.push(line);
        return;
      }

      // Stop collecting materials when we hit another section
      if (inMaterials && line.trim().startsWith('**') && !line.includes('**What You Need**') && !line.includes('**Required Materials**')) {
        inMaterials = false;
      }
    });

    // Parse the reference card to extract key info
    const parseReferenceCard = (lines) => {
      const data = {
        resourceName: '',
        maxValue: '',
        generation: [],
        abilities: [],
        mechanics: []
      };

      let currentSection = '';

      lines.forEach(line => {
        const trimmed = line.trim();

        // Detect resource name and max value - look for pattern like "CHARGES: [___] / 6"
        if (trimmed.match(/[A-Z\s]+:\s*\[.*?\]\s*\/\s*\d+/)) {
          const match = trimmed.match(/([A-Z\s]+):\s*\[.*?\]\s*\/\s*(\d+)/);
          if (match) {
            data.resourceName = match[1].trim();
            data.maxValue = match[2];
          }
        }

        // Detect sections by keywords
        if (trimmed.includes('GENERATION:') || trimmed.includes('GAIN:') || trimmed.includes('BUILD:')) {
          currentSection = 'generation';
        } else if (trimmed.includes('ABILITIES:') || trimmed.includes('COSTS:') || trimmed.includes('ABILITY COSTS:')) {
          currentSection = 'abilities';
        } else if (trimmed.includes('PRECISION:') || trimmed.includes('MECHANIC:') || trimmed.includes('SPECIAL:')) {
          currentSection = 'mechanics';
        }

        // Extract bullet points (• or -)
        if (trimmed.startsWith('•') || (trimmed.startsWith('-') && !trimmed.match(/^-+$/))) {
          const text = trimmed.substring(1).trim();
          if (currentSection === 'generation') {
            data.generation.push(text);
          } else if (currentSection === 'abilities') {
            data.abilities.push(text);
          } else if (currentSection === 'mechanics') {
            data.mechanics.push(text);
          }
        }
      });

      return data;
    };

    const refData = parseReferenceCard(codeBlockLines);

    return (
      <div className="pip-visual">
        {/* Materials as icon cards */}
        {materials.length > 0 && (
          <div className="pip-materials-visual">
            <h5><i className="fas fa-dice-d20"></i> What You Need</h5>
            <div className="pip-materials-grid">
              {materials.map((item, idx) => {
                // Extract icon based on material type
                let icon = 'fa-circle';
                if (item.toLowerCase().includes('token') || item.toLowerCase().includes('coin')) icon = 'fa-coins';
                else if (item.toLowerCase().includes('dice') || item.toLowerCase().includes('die')) icon = 'fa-dice-d6';
                else if (item.toLowerCase().includes('card')) icon = 'fa-id-card';
                else if (item.toLowerCase().includes('chart') || item.toLowerCase().includes('table')) icon = 'fa-table';
                else if (item.toLowerCase().includes('tracker') || item.toLowerCase().includes('counter')) icon = 'fa-tally';
                else if (item.toLowerCase().includes('marker')) icon = 'fa-map-marker-alt';

                return (
                  <div key={idx} className="pip-material-card">
                    <i className={`fas ${icon}`}></i>
                    <span>{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Visual resource tracker */}
        {refData.resourceName && (
          <div className="pip-tracker-visual">
            <h5><i className="fas fa-gauge-high"></i> Resource Tracker</h5>

            <div className="pip-resource-display">
              <div className="pip-resource-header">
                <span className="pip-resource-name">{refData.resourceName}</span>
                <span className="pip-resource-max">Max: {refData.maxValue}</span>
              </div>

              {/* Visual tracker bar */}
              <div className="pip-tracker-bar">
                {Array.from({ length: parseInt(refData.maxValue) || 6 }).map((_, idx) => (
                  <div key={idx} className="pip-tracker-segment">
                    {idx + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* How to gain */}
            {refData.generation.length > 0 && (
              <div className="pip-info-box pip-gain">
                <h6><i className="fas fa-arrow-up"></i> How to Gain</h6>
                <ul>
                  {refData.generation.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Abilities */}
            {refData.abilities.length > 0 && (
              <div className="pip-info-box pip-abilities">
                <h6><i className="fas fa-bolt"></i> Abilities</h6>
                <ul>
                  {refData.abilities.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Special mechanics */}
            {refData.mechanics.length > 0 && (
              <div className="pip-info-box pip-mechanics">
                <h6><i className="fas fa-cog"></i> Special Mechanics</h6>
                <ul>
                  {refData.mechanics.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render resource system tab
  const renderResourceSystem = () => {
    const { resourceSystem, overview } = classData;

    if (!resourceSystem) {
      return (
        <div className="class-detail-section parchment-content">
          <p className="guide-empty-text">Resource system information not available for this tradition.</p>
        </div>
      );
    }

    const classId = (classData.id || classData.name || '').toLowerCase().replace(/\s+/g, '_');
    const regionInfo = CLASS_REGIONS[classId] || {
      regionName: 'Unknown Lands',
      accentColor: '#8b4513',
      bgGradient: 'linear-gradient(135deg, rgba(139, 69, 19, 0.08) 0%, rgba(139, 69, 19, 0.03) 100%)',
      borderColor: '#8b4513',
      glowColor: 'rgba(139, 69, 19, 0.1)',
      icon: 'fas fa-scroll'
    };

    const genesisData = parseResourceOrigin(overview?.roleplayIdentity?.content);

    return (
      <div className="class-detail-section parchment-content">
        
        {/* PREMIUM LORE-MECHANIC COVENANT CARD */}
        {genesisData && (
          <div 
            className="lore-covenant-card" 
            style={{ 
              borderLeft: `4px solid ${regionInfo.borderColor}`,
              background: regionInfo.bgGradient,
              boxShadow: `0 4px 15px ${regionInfo.glowColor}, inset 0 0 20px rgba(139, 69, 19, 0.02)`
            }}
          >
            <div className="covenant-card-header" style={{ color: regionInfo.accentColor }}>
              <span className="covenant-badge" style={{ backgroundColor: regionInfo.accentColor }}>
                <i className={regionInfo.icon}></i> {regionInfo.regionName.toUpperCase()} ORIGIN
              </span>
              <h4>The Covenant Genesis</h4>
            </div>
            
            <div className="covenant-card-body">
              <div className="covenant-narrative">
                <i className="fas fa-quote-left quote-icon-left" style={{ color: regionInfo.borderColor }}></i>
                <span>{parseTextWithLoreLinks(genesisData.genesis)}</span>
              </div>
              
              {genesisData.price && (
                <div className="covenant-price-box" style={{ borderTop: `1px dashed rgba(139, 69, 19, 0.15)` }}>
                  <div className="price-title">
                    <i className="fas fa-balance-scale"></i> The Physical Toll
                  </div>
                  <p className="price-content">
                    {parseTextWithLoreLinks(genesisData.price)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="guide-section main-resource">
          <div className="guide-badge-header">
            <span className="guide-badge">
              <i className="fas fa-bolt"></i> CORE RESOURCE
            </span>
            <h3>{resourceSystem.title}</h3>
          </div>

          {resourceSystem.subtitle && (
            <div className="guide-subtitle">{resourceSystem.subtitle}</div>
          )}

          {/* Interactive Resource Bar Showcase */}
          <div className="resource-bar-showcase">
            <h4>Interactive {resourceSystem.title} Tracker</h4>
            <div className="rules-resource-bar-container">
                <ClassResourceBar
                  characterClass={classData.name}
                  classResource={buildDemoClassResource(classData.name)}
                  size="large"
                  context="hud"
                  isGMMode={false}
                  isOwner={true}
                />
            </div>
            <div className="resource-bar-hint">
              <i className="fas fa-info-circle"></i> This is an interactive preview of the {classData.name} resource bar. Click or interact with elements to see how it functions in combat.
            </div>
          </div>

          <div className="guide-description">
            {renderContent(resourceSystem.description)}
          </div>

          {/* Resource stat cards (e.g. Momentum + Flourish) */}
          {resourceSystem.cards && resourceSystem.cards.length > 0 && (
            <div className="resource-stat-cards">
              {resourceSystem.cards.map((card, i) => (
                <div key={i} className="resource-stat-card">
                  <div className="resource-stat-card-title">{card.title}</div>
                  <div className="resource-stat-card-stat">{card.stats}</div>
                  <div className="resource-stat-card-details">{card.details}</div>
                </div>
              ))}
            </div>
          )}

          {/* Generation / change table */}
          {resourceSystem.generationTable && (
            <div className="guide-table-container">
              <div className="guide-table-title">
                <i className="fas fa-exchange-alt"></i> Resource Changes at a Glance
              </div>
              <div className="guide-table-wrapper">
                <table className="guide-table class-resource-table">
                  <thead>
                    <tr>
                      {resourceSystem.generationTable.headers.map((h, i) => <th key={i}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {resourceSystem.generationTable.rows.map((row, ri) => (
                      <tr key={ri} className={ri % 2 === 0 ? 'row-even' : 'row-odd'}>
                        {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Usage summary */}
          {resourceSystem.usage && (
            <div className="resource-usage-summary">
              {resourceSystem.usage.momentum && (
                <div className="resource-usage-item">
                  <span className="resource-usage-label"><i className="fas fa-bolt"></i> Momentum:</span>
                  <span className="resource-usage-text">{resourceSystem.usage.momentum}</span>
                </div>
              )}
              {resourceSystem.usage.flourish && (
                <div className="resource-usage-item">
                  <span className="resource-usage-label"><i className="fas fa-star"></i> Flourish:</span>
                  <span className="resource-usage-text">{resourceSystem.usage.flourish}</span>
                </div>
              )}
            </div>
          )}

          {resourceSystem.mechanics && (
            <div className="guide-subsection mechanics-box">
              <h4><i className="fas fa-cogs"></i> {resourceSystem.mechanics.title || 'Mechanics'}</h4>
              {resourceSystem.mechanics.content && renderStructuredContent(resourceSystem.mechanics.content)}
              {classData.combinationMatrix && <SphereComboFinder combinationMatrix={classData.combinationMatrix} />}
              {resourceSystem.mechanics.sections && (
                <div className="mech-steps">
                  {resourceSystem.mechanics.sections.map((section, i) => (
                    <div key={i} className="mech-step-card">
                      <div className="mech-step-number">{section.stepNumber}</div>
                      <div className="mech-step-body">
                        <div className="mech-step-title">{section.title}</div>
                        {section.subtitle && <div className="mech-step-subtitle">{section.subtitle}</div>}
                        <div className="mech-step-content" dangerouslySetInnerHTML={{
                          __html: section.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {resourceSystem.mechanics.actionTable && (() => {
                const at = resourceSystem.mechanics.actionTable;
                return (
                  <div className="mech-action-table-section">
                    <div className="mech-action-title">{at.title}</div>
                    {at.subtitle && <div className="mech-action-subtitle">{at.subtitle}</div>}
                    {at.rule && <div className="mech-action-rule">{at.rule}</div>}
                    <div className="mech-action-grid">
                      {at.actions.map((action, i) => (
                        <div key={i} className="mech-action-card">
                          <div className="mech-action-card-header">
                            <i className={`fas fa-${action.icon}`}></i>
                            <span>{action.name}</span>
                          </div>
                          <div className="mech-action-card-stats">
                            <div className="mech-action-stat"><span className="mech-action-label">Cost</span><span className="mech-action-val">{action.spheres} spheres + {action.mana} mana</span></div>
                            <div className="mech-action-stat"><span className="mech-action-label">Range</span><span className="mech-action-val">{action.range}</span></div>
                            <div className="mech-action-stat"><span className="mech-action-label">Target</span><span className="mech-action-val">{action.target}</span></div>
                            <div className="mech-action-stat"><span className="mech-action-label">Effect</span><span className="mech-action-val">{action.damage}</span></div>
                          </div>
                          <div className="mech-action-card-note">{action.note}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              {resourceSystem.mechanics.chaosEffectsTable && renderResourceTable(resourceSystem.mechanics.chaosEffectsTable, 'chaosEffectsTable')}
              {resourceSystem.mechanics.singleSphereFallbacks && (() => {
                const ssf = resourceSystem.mechanics.singleSphereFallbacks;
                return (
                  <div className="mech-non-recipe-section">
                    <div className="mech-non-recipe-header">
                      <div className="mech-non-recipe-title">{ssf.title}</div>
                      {ssf.subtitle && <div className="mech-non-recipe-subtitle">{ssf.subtitle}</div>}
                    </div>
                    <div className="mech-ability-grid">
                      {ssf.abilities.map((ability, i) => (
                        <div key={i} className="mech-ability-card">
                          <div className="mech-ability-header">
                            <span className="mech-ability-name">{ability.name}</span>
                            <span className="mech-ability-type">{ability.type}</span>
                          </div>
                          <div className="mech-ability-cost">{ability.cost}</div>
                          <div className="mech-ability-desc">{ability.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              {resourceSystem.mechanics.baseVsRecipes && (() => {
                const bvr = resourceSystem.mechanics.baseVsRecipes;
                return (
                  <div className="mech-base-vs-recipes">
                    <div className="mech-bvr-header">
                      <div className="mech-bvr-title">{bvr.title}</div>
                      {bvr.subtitle && <div className="mech-bvr-subtitle">{bvr.subtitle}</div>}
                    </div>
                    <div className="mech-bvr-columns">
                      <div className="mech-bvr-col mech-bvr-can">
                        <div className="mech-bvr-col-title"><i className="fas fa-check"></i> Base CAN</div>
                        <ul className="mech-bvr-list">
                          {bvr.baselineCan.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                      <div className="mech-bvr-col mech-bvr-cannot">
                        <div className="mech-bvr-col-title"><i className="fas fa-times"></i> Base CANNOT</div>
                        <ul className="mech-bvr-list">
                          {bvr.baselineCannot.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    </div>
                    {bvr.recipeExamples && (
                      <div className="mech-bvr-recipes-preview">
                        <div className="mech-bvr-recipes-title"><i className="fas fa-star"></i> What Recipes Unlock</div>
                        <div className="mech-bvr-recipes-list">
                          {bvr.recipeExamples.map((ex, i) => (
                            <div key={i} className="mech-bvr-recipe-row">
                              <span className="mech-bvr-recipe-level">{ex.level}</span>
                              <span className="mech-bvr-recipe-name">{ex.name}</span>
                              <span className="mech-bvr-recipe-upgrade">{ex.upgrade}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {bvr.recipesUnlock && (
                      <div className="mech-bvr-unlock">
                        <div className="mech-bvr-unlock-title"><i className="fas fa-star"></i> What Recipes Unlock</div>
                        <div className="mech-bvr-unlock-subtitle">Effects impossible with raw sphere combinations</div>
                        <ul className="mech-bvr-list mech-bvr-unlock-list">
                          {bvr.recipesUnlock.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    )}
                    {bvr.comparison && (() => {
                      const comp = bvr.comparison;
                      return (
                        <div className="mech-bvr-comparison">
                          <div className="mech-bvr-comp-title">{comp.title}</div>
                          {comp.examples.map((ex, i) => (
                            <div key={i} className="mech-bvr-comp-example">
                              <div className="mech-bvr-comp-combo">{ex.combo}</div>
                              <div className="mech-bvr-comp-pair">
                                <div className="mech-bvr-comp-base">
                                  <div className="mech-bvr-comp-label">Base</div>
                                  <div className="mech-bvr-comp-effect">{ex.baseEffect}</div>
                                </div>
                                <div className="mech-bvr-comp-arrow"><i className="fas fa-arrow-right"></i></div>
                                <div className="mech-bvr-comp-recipe">
                                  <div className="mech-bvr-comp-label">{ex.recipeName}</div>
                                  <div className="mech-bvr-comp-effect">{ex.recipeEffect}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                );
              })()}
              {resourceSystem.mechanics.comboTiers && (() => {
                const ct = resourceSystem.mechanics.comboTiers;
                return (
                  <div className="mech-combo-tiers">
                    <div className="mech-combo-tiers-title">{ct.title}</div>
                    {ct.subtitle && <div className="mech-combo-tiers-subtitle">{ct.subtitle}</div>}
                    <div className="mech-tier-cards">
                      {ct.tiers.map((tier, i) => (
                        <div key={i} className={`mech-tier-card ${tier.highlight ? 'mech-tier-highlight' : ''}`}>
                          <div className="mech-tier-header">
                            <span className="mech-tier-name">{tier.name}</span>
                          </div>
                          <div className="mech-tier-meta">
                            <span className="mech-tier-cost"><i className="fas fa-circle"></i> {tier.sphereCost}</span>
                            <span className="mech-tier-mana"><i className="fas fa-tint"></i> {tier.manaCost}</span>
                            <span className="mech-tier-available"><i className="fas fa-unlock"></i> {tier.available}</span>
                          </div>
                          <div className="mech-tier-desc">{tier.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              {resourceSystem.mechanics.manaWarning && (
                <div className="mech-warning" dangerouslySetInnerHTML={{
                  __html: resourceSystem.mechanics.manaWarning.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }} />
              )}
            </div>
          )}
        </div>

        {resourceSystem.keyAbilities && (
          <div className="guide-subsection abilities-box">
            <h4><i className="fas fa-bolt"></i> {resourceSystem.keyAbilities.title || 'Key Abilities'}</h4>
            <div className="key-abilities-list">
              {(Array.isArray(resourceSystem.keyAbilities) ? resourceSystem.keyAbilities : resourceSystem.keyAbilities.abilities || []).map((ability, i) => (
                <div key={i} className="key-ability-card">
                  {typeof ability === 'string' ? (
                    <span>{ability}</span>
                  ) : (
                    <>
                      <strong>{ability.name}</strong>
                      {ability.type && <span className="ability-type"> ({ability.type})</span>}
                      {ability.cost && <span className="ability-cost"> - {ability.cost}</span>}
                      {ability.description && <span className="ability-desc">: {ability.description}</span>}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {resourceSystem.infernoLevelsTable && renderResourceTable(resourceSystem.infernoLevelsTable, 'infernoLevelsTable')}
        {resourceSystem.rageStatesTable && renderResourceTable(resourceSystem.rageStatesTable, 'rageStatesTable')}
        {resourceSystem.drpAbilitiesTable && renderResourceTable(resourceSystem.drpAbilitiesTable, 'drpAbilitiesTable')}
        {resourceSystem.passiveEffectsTable && renderResourceTable(resourceSystem.passiveEffectsTable, 'passiveEffectsTable')}
        {resourceSystem.celestialDevotionsTable && renderResourceTable(resourceSystem.celestialDevotionsTable, 'celestialDevotionsTable')}
        {resourceSystem.timeShardTable && renderResourceTable(resourceSystem.timeShardTable, 'timeShardTable')}
        {resourceSystem.temporalStrainTable && renderResourceTable(resourceSystem.temporalStrainTable, 'temporalStrainTable')}
        {resourceSystem.temporalFluxTable && renderResourceTable(resourceSystem.temporalFluxTable, 'temporalFluxTable')}
        {resourceSystem.chordProgressionTable && renderResourceTable(resourceSystem.chordProgressionTable, 'chordProgressionTable')}
        {resourceSystem.musicalNotesTable && renderResourceTable(resourceSystem.musicalNotesTable, 'musicalNotesTable')}
        {resourceSystem.runicWrappingTable && renderResourceTable(resourceSystem.runicWrappingTable, 'runicWrappingTable')}
        {resourceSystem.inscriptionPlacementTable && renderResourceTable(resourceSystem.inscriptionPlacementTable, 'inscriptionPlacementTable')}
        {resourceSystem.sphereGenerationTable && renderResourceTable(resourceSystem.sphereGenerationTable, 'sphereGenerationTable')}
        {resourceSystem.essenceGenerationTable && renderResourceTable(resourceSystem.essenceGenerationTable, 'essenceGenerationTable')}
        {resourceSystem.loaInvocationTable && renderResourceTable(resourceSystem.loaInvocationTable, 'loaInvocationTable')}
        {resourceSystem.wildInstinctGenerationTable && renderResourceTable(resourceSystem.wildInstinctGenerationTable, 'wildInstinctGenerationTable')}
        {resourceSystem.formAbilitiesTable && renderResourceTable(resourceSystem.formAbilitiesTable, 'formAbilitiesTable')}
        {resourceSystem.totemTypesTable && renderResourceTable(resourceSystem.totemTypesTable, 'totemTypesTable')}
        {resourceSystem.synergyEffectsTable && renderResourceTable(resourceSystem.synergyEffectsTable, 'synergyEffectsTable')}
        {resourceSystem.stanceNetworkTable && renderResourceTable(resourceSystem.stanceNetworkTable, 'stanceNetworkTable')}
        {resourceSystem.stanceAbilitiesTable && renderResourceTable(resourceSystem.stanceAbilitiesTable, 'stanceAbilitiesTable')}
        {resourceSystem.flourishAbilitiesTable && renderResourceTable(resourceSystem.flourishAbilitiesTable, 'flourishAbilitiesTable')}
        {resourceSystem.toxinVialRecipesTable && renderResourceTable(resourceSystem.toxinVialRecipesTable, 'toxinVialRecipesTable')}
        {resourceSystem.contraptionTypesTable && renderResourceTable(resourceSystem.contraptionTypesTable, 'contraptionTypesTable')}
        {resourceSystem.poisonWeaponEffectsTable && renderResourceTable(resourceSystem.poisonWeaponEffectsTable, 'poisonWeaponEffectsTable')}
        {resourceSystem.hexbreakerChargesTable && renderResourceTable(resourceSystem.hexbreakerChargesTable, 'hexbreakerChargesTable')}
        {resourceSystem.hexbreakerAbilitiesTable && renderResourceTable(resourceSystem.hexbreakerAbilitiesTable, 'hexbreakerAbilitiesTable')}
        {resourceSystem.detectionTrackingTable && renderResourceTable(resourceSystem.detectionTrackingTable, 'detectionTrackingTable')}
        {resourceSystem.manaCostTable && renderResourceTable(resourceSystem.manaCostTable, 'manaCostTable')}

        {resourceSystem.overheatRules && (
          <div className="guide-subsection overheat-rules-box">
            <h4><i className="fas fa-fire-alt"></i> {resourceSystem.overheatRules.title || 'Overheat'}</h4>
            {renderStructuredContent(resourceSystem.overheatRules.content)}
          </div>
        )}

        {resourceSystem.strategicConsiderations && (
          <div className="guide-subsection strategy-box">
            <h4><i className="fas fa-lightbulb"></i> {resourceSystem.strategicConsiderations.title || 'Strategic Considerations'}</h4>
            {renderStructuredContent(resourceSystem.strategicConsiderations.content)}
          </div>
        )}

        {resourceSystem.playingInPerson && (
          <div className="guide-subsection playing-in-person-box">
            <div className="pip-section-header">
              <span className="pip-section-badge">
                <i className="fas fa-dice-d20"></i> PLAYING IN PERSON
              </span>
              <h4>{resourceSystem.playingInPerson.title}</h4>
            </div>
            {renderPlayingInPersonContent(resourceSystem.playingInPerson.content)}
          </div>
        )}
      </div>
    );
  };

  // Render specializations tab
  const renderSpecializations = () => {
    const { specializations } = classData;

    if (!specializations || !specializations.specs) {
      return (
        <div className="class-detail-section parchment-content">
          <p className="guide-empty-text">No specialization data available for this tradition.</p>
        </div>
      );
    }

    return (
      <div className="class-detail-section parchment-content">
        <div className="guide-badge-header">
          <span className="guide-badge">
            <i className="fas fa-medal"></i> SPECIALIZATIONS
          </span>
          <h3>{specializations.title}</h3>
        </div>

        {specializations.subtitle && (
          <div className="guide-subtitle">{specializations.subtitle}</div>
        )}

        <div className="guide-description">
          {renderContent(specializations.description)}
        </div>

        {specializations.passiveAbility && (
          <div className="shared-passive-card">
            <div className="shared-passive-badge">
              <i className="fas fa-star"></i> SHARED PASSIVE
            </div>
            <div className="shared-passive-content">
              <strong>{specializations.passiveAbility.name}</strong>
              <p>{specializations.passiveAbility.description}</p>
            </div>
          </div>
        )}

        <div className="specializations-grid premium-grid">
          {specializations.specs.map((spec, idx) => (
            <div key={spec.id} className="specialization-card premium-card" style={{ '--spec-color': spec.color }}>
              <div className="spec-header premium-header" style={{ backgroundColor: spec.color }}>
                <div className="spec-icon">
                  <img
                    src={getIconUrl(spec.icon, 'abilities')}
                    alt={spec.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getIconUrl('Utility/Utility', 'abilities');
                    }}
                  />
                </div>
                <div className="spec-title">
                  <h4>{spec.name}</h4>
                  <p className="spec-theme">{spec.theme}</p>
                </div>
              </div>

              <div className="spec-body premium-body">
                <p className="spec-description">{spec.description}</p>

                <div className="spec-playstyle">
                  <strong>Playstyle:</strong> {spec.playstyle}
                </div>

                {spec.strengths && spec.strengths.length > 0 && (
                  <div className="spec-strengths">
                    <h5><i className="fas fa-plus-circle"></i> Strengths</h5>
                    <ul>
                      {spec.strengths.map((strength, i) => (
                        <li key={i}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {spec.weaknesses && spec.weaknesses.length > 0 && (
                  <div className="spec-weaknesses">
                    <h5><i className="fas fa-minus-circle"></i> Weaknesses</h5>
                    <ul>
                      {spec.weaknesses.map((weakness, i) => (
                        <li key={i}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {spec.keyAbilities && (
                  <div className="spec-key-abilities">
                    <h5><i className="fas fa-bolt"></i> Key Abilities</h5>
                    <ul>
                      {spec.keyAbilities.map((ability, i) => (
                        <li key={i}>
                          {typeof ability === 'string' ? ability : (
                            <>
                              <strong>{ability.name}</strong>
                              {ability.type && <span> ({ability.type})</span>}
                              {ability.cost && <span> - {ability.cost}</span>}
                              {ability.description && <span>: {ability.description}</span>}
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(spec.passiveAbilities || spec.passiveAbility || spec.specPassive) && (
                  <div className="spec-passives">
                    <h5><i className="fas fa-star"></i> Passive Abilities</h5>

                    {spec.passiveAbilities && spec.passiveAbilities.map((passive, i) => (
                      <div key={i} className={`passive-ability ${passive.tier === 'Path Passive' ? 'shared' : 'unique'}`}>
                        <div className="passive-header">
                          <strong>{passive.name}</strong>
                          <span className="passive-tier">{passive.tier}</span>
                        </div>
                        <p className="passive-description">{passive.description}</p>
                        {passive.sharedBy && (
                          <p className="passive-note"><em>Shared by: {passive.sharedBy}</em></p>
                        )}
                        {passive.uniqueTo && (
                          <p className="passive-note"><em>Unique to: {passive.uniqueTo}</em></p>
                        )}
                      </div>
                    ))}

                    {spec.passiveAbility && (
                      <div className="passive-ability shared">
                        <div className="passive-header">
                          <strong>{spec.passiveAbility.name}</strong>
                          <span className="passive-tier">Path Passive</span>
                        </div>
                        <p className="passive-description">{spec.passiveAbility.description}</p>
                      </div>
                    )}

                    {spec.specPassive && (
                      <div className="passive-ability unique">
                        <div className="passive-header">
                          <strong>{spec.specPassive.name}</strong>
                          <span className="passive-tier">Specialization Passive</span>
                        </div>
                        <p className="passive-description">{spec.specPassive.description}</p>
                      </div>
                    )}
                  </div>
                )}

                {spec.recommendedFor && (
                  <div className="spec-recommendation">
                    <i className="fas fa-thumbs-up"></i> <strong>Recommended for:</strong> {spec.recommendedFor}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Get and filter spells at component level
  const processedSpells = useMemo(() => {
    let spells = classData?.spells || classData?.exampleSpells || [];
    
    if (!spells || spells.length === 0) {
      return [];
    }

    // Filter out buff effects that are part of other spells
    const buffEffectIds = new Set();
    spells.forEach(spell => {
      if (spell.buffConfig?.effects) {
        spell.buffConfig.effects.forEach(effect => {
          if (effect.id) {
            buffEffectIds.add(effect.id);
          }
        });
      }
      if (spell.debuffConfig?.effects) {
        spell.debuffConfig.effects.forEach(effect => {
          if (effect.id) {
            buffEffectIds.add(effect.id);
          }
        });
      }
    });

    return spells.filter(spell => !buffEffectIds.has(spell.id));
  }, [classData]);

  const selectedSpellIndex = selectedSpell
    ? processedSpells.findIndex(s => s.id === selectedSpell.id)
    : -1;

  const navigateSpell = (direction) => {
    if (processedSpells.length === 0) return;
    const newIndex = selectedSpellIndex + direction;
    if (newIndex >= 0 && newIndex < processedSpells.length) {
      setSelectedSpell(processedSpells[newIndex]);
    }
  };

  useEffect(() => {
    if (!selectedSpell) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateSpell(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateSpell(1);
      } else if (e.key === 'Escape') {
        handleCloseSpellPopup();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSpell, selectedSpellIndex, processedSpells]);

  // Map WoW icon IDs to local ability icons (matching UnifiedSpellCard)
  const mapSpellIcon = (wowIconId) => {
    const iconMapping = {
      // Combat/Attack icons
      'ability_meleedamage': 'General/Combat Downward Strike',
      'ability_warrior_savageblow': 'General/Combat Downward Strike',
      'ability_warrior_charge': 'General/Combat Downward Strike',
      'ability_warrior_revenge': 'General/Combat Downward Strike',
      'ability_warrior_cleave': 'General/Combat Downward Strike',
      'ability_warrior_riposte': 'Utility/Parry',
      'ability_warrior_shieldbash': 'Utility/Shield',
      'ability_rogue_evasion': 'Utility/Speed Dash',
      'ability_rogue_feint': 'Utility/Parry',
      'ability_rogue_sprint': 'Utility/Speed Dash',
      'ability_rogue_tricksofthetrade': 'Utility/Speed Dash',
      'ability_stealth': 'Utility/Hide',
      'ability_hunter_snipershot': 'Utility/Target Crosshair',
      'ability_hunter_markedshot': 'Utility/Target Crosshair',
      'ability_hunter_markedfordeath': 'Utility/Target Crosshair',
      
      // Defensive icons
      'inv_shield_05': 'Utility/Shield',
      'inv_shield_04': 'Utility/Shield',
      'ability_warrior_defensivestance': 'Utility/Shield',
      'spell_holy_powerwordshield': 'Utility/Shield',
      'spell_holy_devotionaura': 'Radiant/Divine Blessing',
      
      // Healing/Support icons
      'spell_holy_greaterheal': 'Healing/Golden Heart',
      'spell_holy_heal02': 'Healing/Golden Heart',
      'spell_holy_flashheal': 'Healing/Golden Heart',
      'spell_holy_renew': 'Healing/Renewal',
      
      // Utility icons
      'spell_arcane_portaldalaran': 'Utility/Utility',
      'spell_arcane_teleportundercity': 'Utility/Utility',
      'spell_arcane_arcanetorrent': 'Arcane/Arcane Blast',
      'inv_misc_questionmark': 'Utility/Utility',
      'inv_misc_book_07': 'Utility/Utility',
      'inv_misc_bag_08': 'Utility/Utility',
      
      // Magic/Damage icons
      'spell_fire_fireball02': 'Fire/Swirling Fireball',
      'spell_fire_flamebolt': 'Fire/Flame Burst',
      'spell_frost_frostbolt02': 'Frost/Frozen in Ice',
      'spell_arcane_blast': 'Arcane/Magical Sword',
      'spell_shadow_shadowbolt': 'Shadow/Shadow Darkness',
      'spell_holy_holysmite': 'Radiant/Divine Blessing',
      'spell_nature_lightning': 'Lightning/Lightning Bolt',
      
      // Control icons
      'spell_frost_chainsofice': 'Frost/Frozen in Ice',
      'spell_shadow_curseofsargeras': 'Necrotic/Necrotic Skull',
      
      // Buff icons
      'spell_holy_divineillumination': 'Radiant/Divine Blessing',
      'spell_holy_blessingofprotection': 'Radiant/Divine Blessing',
      
      // Summoning icons
      'spell_shadow_summonvoidwalker': 'Utility/Summon Minion',
      'spell_shadow_summoninfernal': 'Utility/Summon Minion',
      
      // Transformation icons
      'ability_druid_catform': 'Utility/Utility',
      
      // Trap icons
      'spell_fire_selfdestruct': 'Utility/Explosive Detonation',
      
      // Wild magic icons
      'spell_arcane_arcane04': 'Arcane/Magical Sword'
    };
    
    return iconMapping[wowIconId] || null;
  };

  // Helper function to get spell icon URL (matching UnifiedSpellCard logic exactly)
  const getSpellIconUrl = (spell) => {
    const iconId = spell?.icon || spell?.typeConfig?.icon;
    
    // If no icon is set, use default
    if (!iconId) {
      return getCustomIconUrl('Utility/Utility', 'abilities');
    }
    
    // If it's already a full URL (ability icon), return as-is
    if (typeof iconId === 'string' && iconId.startsWith('/assets/')) {
      return iconId;
    }
    
    // If it's already an ability icon path (e.g., "Fire/Flame Burst"), use it directly
    if (iconId.includes('/') && !iconId.startsWith('http')) {
      // Check if it's using the new folder structure (e.g., "Fire/Flame Burst")
      if (iconId.match(/^[A-Z][a-zA-Z]+\/[A-Z]/)) {
        return getCustomIconUrl(iconId, 'abilities');
      }
      // Otherwise try to use it as-is
      return getCustomIconUrl(iconId, 'abilities');
    }
    
    // If it's a WoW icon ID, try to map it to a local ability icon
    if (iconId.startsWith('inv_') || iconId.startsWith('spell_') || iconId.startsWith('ability_') || iconId.startsWith('achievement_')) {
      const mappedIcon = mapSpellIcon(iconId);
      if (mappedIcon) {
        return getCustomIconUrl(mappedIcon, 'abilities');
      }
      // If no mapping found, use default instead of getAbilityIconUrl (which adds creature- prefix)
      return getCustomIconUrl('Utility/Utility', 'abilities');
    }
    
    // Default fallback
    return getCustomIconUrl('Utility/Utility', 'abilities');
  };

  // Memoize icon URLs to prevent flickering
  const spellIconUrls = useMemo(() => {
    const urlMap = new Map();
    processedSpells.forEach(spell => {
      const url = getSpellIconUrl(spell);
      urlMap.set(spell.id, url);
    });
    return urlMap;
  }, [processedSpells]);

  // Preload images for current page spells
  useEffect(() => {
    if (activeTab !== 'spells' || processedSpells.length === 0) {
      return;
    }

    // Calculate page categories
    const spellsByCategory = {
      'Level 1': processedSpells.filter(s => s.level === 1),
      'Level 2': processedSpells.filter(s => s.level === 2),
      'Level 3': processedSpells.filter(s => s.level === 3),
      'Level 4': processedSpells.filter(s => s.level === 4),
      'Level 5': processedSpells.filter(s => s.level === 5),
      'Level 6': processedSpells.filter(s => s.level === 6),
      'Level 7': processedSpells.filter(s => s.level === 7),
      'Level 8': processedSpells.filter(s => s.level === 8),
      'Level 9': processedSpells.filter(s => s.level === 9),
      'Level 10': processedSpells.filter(s => s.level === 10)
    };

    const categoryEntries = Object.entries(spellsByCategory).filter(([_, spells]) => spells.length > 0);
    const categoriesPerPage = 2;
    const startIdx = currentPage * categoriesPerPage;
    const endIdx = startIdx + categoriesPerPage;
    const pageCategories = categoryEntries.slice(startIdx, endIdx);

    const preloadImages = () => {
      const pageSpells = pageCategories.flatMap(([_, categorySpells]) => categorySpells || []);
      pageSpells.forEach(spell => {
        const url = spellIconUrls.get(spell.id);
        if (url && !loadedImages.has(url)) {
          const img = new Image();
          img.onload = () => {
            setLoadedImages(prev => new Set([...prev, url]));
          };
            img.onerror = () => {
              const fallbackUrl = getCustomIconUrl('Utility/Utility', 'abilities');
              if (!loadedImages.has(fallbackUrl)) {
                const fallbackImg = new Image();
                fallbackImg.onload = () => {
                  setLoadedImages(prev => new Set([...prev, fallbackUrl]));
                };
                fallbackImg.src = fallbackUrl;
              }
            };
          img.src = url;
        }
      });
    };

    preloadImages();
  }, [spellIconUrls, currentPage, activeTab, processedSpells, loadedImages]);

  // Render spells tab
  const renderSpells = () => {
    const spells = processedSpells;

    if (!spells || spells.length === 0) {
      return (
        <div className="class-detail-section">
          <p>No spells available for this tradition yet.</p>
        </div>
      );
    }

    // Get class-specific icon
    const classIcons = {
      'pyrofiend': 'fas fa-fire',
      'minstrel': 'fas fa-music',
      'gambler': 'fas fa-dice',
      'chaos-weaver': 'fas fa-dice',
      'martyr': 'fas fa-heart',
      'chronarch': 'fas fa-clock',
      'fate-weaver': 'fas fa-cards',
      'lichborne': 'fas fa-snowflake',
      'inscriptor': 'fas fa-scroll',
      'covenbane': 'fas fa-cross',
      'arcanoneer': 'fas fa-atom',
      'witch-doctor': 'fas fa-skull',
      'deathcaller': 'fas fa-skull',
      'spellguard': 'fas fa-shield-alt',
      'exorcist': 'fas fa-cross',
      'false-prophet': 'fas fa-eye',
      'false_prophet': 'fas fa-eye',
      'plaguebringer': 'fas fa-biohazard',
      'formbender': 'fas fa-paw',
      'primalist': 'fas fa-mountain',
      'berserker': 'fas fa-axe-battle',
      'bladedancer': 'fas fa-wind',
      'dreadnaught': 'fas fa-shield',
      'titan': 'fas fa-sun',
      'toxicologist': 'fas fa-flask',
      'lunarch': 'fas fa-moon',
      'huntress': 'fas fa-crosshairs',
      'warden': 'fas fa-gavel',
      'oracle': 'fas fa-eye'
    };
    
    let categoryIcon = classIcons[classData.id] || 'fas fa-magic';
    
    // Universal level-based grouping for ALL classes (Level 1-10)
    let spellsByCategory = {
      'Level 1': spells.filter(s => s.level === 1),
      'Level 2': spells.filter(s => s.level === 2),
      'Level 3': spells.filter(s => s.level === 3),
      'Level 4': spells.filter(s => s.level === 4),
      'Level 5': spells.filter(s => s.level === 5),
      'Level 6': spells.filter(s => s.level === 6),
      'Level 7': spells.filter(s => s.level === 7),
      'Level 8': spells.filter(s => s.level === 8),
      'Level 9': spells.filter(s => s.level === 9),
      'Level 10': spells.filter(s => s.level === 10)
    };

    // Split categories into pages (2 categories per page, one on each side)
    const categoryEntries = Object.entries(spellsByCategory).filter(([_, spells]) => spells.length > 0);
    const categoriesPerPage = 2; // One category per side (left and right)
    const totalPages = Math.ceil(categoryEntries.length / categoriesPerPage);
    
    // Get categories for current page
    const startIdx = currentPage * categoriesPerPage;
    const endIdx = startIdx + categoriesPerPage;
    const pageCategories = categoryEntries.slice(startIdx, endIdx);
    
    // Split into left and right page
    const leftPageCategory = pageCategories[0] || null;
    const rightPageCategory = pageCategories[1] || null;
    
    // Calculate grid size to fit all spells without scrolling
    // Each page side should fit about 24 spells (4 rows x 6 columns)
    const spellsPerRow = 6;
    const rowsPerSide = 4;
    const maxSpellsPerSide = spellsPerRow * rowsPerSide; // 24 spells per side

    const renderSpellCategory = (categoryEntry, sideMaxSpells) => {
      if (!categoryEntry) {
        // Render empty slots for empty side
        return (
          <div className="spellbook-category">
            <div className="spellbook-spell-grid">
              {Array.from({ length: sideMaxSpells }).map((_, index) => (
                <div key={`empty-${index}`} className="spellbook-spell-icon spellbook-spell-icon-empty">
                  <div className="spellbook-spell-icon-image">
                    <div className="spellbook-empty-icon"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      
      const [categoryName, categorySpells] = categoryEntry;
      const emptySlots = Math.max(0, sideMaxSpells - categorySpells.length);
      const fallbackUrl = getCustomIconUrl('Utility/Utility', 'abilities');
      
      return (
        <div className="spellbook-category">
          <h4 className="spellbook-category-title">
            <i className={categoryIcon}></i> {categoryName}
          </h4>
          <div className="spellbook-spell-grid">
            {/* Render actual spells */}
            {categorySpells.map(spell => {
              const iconUrl = spellIconUrls.get(spell.id) || fallbackUrl;
              
              return (
                <div
                  key={spell.id}
                  className="spellbook-spell-icon"
                  onClick={() => handleSpellClick(spell)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="spellbook-spell-icon-image">
                    <img
                      src={iconUrl}
                      alt={spell.name}
                      loading="lazy"
                      onLoad={(e) => {
                        setLoadedImages(prev => new Set([...prev, iconUrl]));
                      }}
                      onError={(e) => {
                        const target = e.target;
                        if (target.src !== fallbackUrl) {
                          target.src = fallbackUrl;
                          target.onerror = null; // Prevent infinite loop
                        }
                      }}
                    />
                  </div>
                  <div className="spellbook-spell-icon-name">{spell.name}</div>
                  {spell.specialMechanics?.infernoLevel && (
                    <div className="spellbook-spell-icon-level">
                      Inferno {spell.specialMechanics.infernoLevel.required}
                    </div>
                  )}
                  {spell.specialMechanics?.musicalCombo && (
                    <div className="spellbook-spell-icon-level">
                      {spell.specialMechanics.musicalCombo.type === 'builder' ? 'Builder' : 'Cadence'}
                    </div>
                  )}
                </div>
              );
            })}
            {/* Render empty placeholder squares */}
            {Array.from({ length: emptySlots }).map((_, index) => (
              <div key={`empty-${index}`} className="spellbook-spell-icon spellbook-spell-icon-empty">
                <div className="spellbook-spell-icon-image">
                  <div className="spellbook-empty-icon"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="class-detail-section spellbook-section" ref={contentContainerRef}>
        <div className="spellbook-container">
          {/* Book Spine/Bookmark */}
          <div className="spellbook-spine"></div>
          
          {/* Page Number Indicator in Center */}
          <div className="spellbook-page-indicator">
            Page {currentPage + 1} / {totalPages}
          </div>
          
          {/* Left Page */}
          <div className="spellbook-page spellbook-page-left">
            {renderSpellCategory(leftPageCategory, maxSpellsPerSide)}
            {/* Previous Button at Bottom Left */}
            <div className="spellbook-pagination-left">
              <button
                className="spellbook-page-button"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                aria-label="Previous page"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
            </div>
          </div>

          {/* Right Page */}
          <div className="spellbook-page spellbook-page-right">
            {renderSpellCategory(rightPageCategory, maxSpellsPerSide)}
            {/* Next Button at Bottom Right */}
            <div className="spellbook-pagination-right">
              <button
                className="spellbook-page-button"
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1}
                aria-label="Next page"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Spell Popup Modal */}
        {selectedSpell && (
          <div
            className="spellbook-popup-overlay"
            onClick={handleCloseSpellPopup}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at center, rgba(100, 100, 150, 0.4) 0%, rgba(0, 0, 0, 0.8) 100%)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000,
              cursor: 'pointer'
            }}
          >
            <button
              className="spellbook-popup-nav spellbook-popup-nav-prev"
              onClick={(e) => { e.stopPropagation(); navigateSpell(-1); }}
              disabled={selectedSpellIndex <= 0}
              aria-label="Previous spell"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <div
              className="spellbook-popup-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                padding: '20px',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflow: 'auto',
                cursor: 'default'
              }}
            >
              {selectedSpell.level && (
                <div className="spellbook-popup-level-badge">
                  <i className="fas fa-star"></i>
                  <span>Available at Level {selectedSpell.level}</span>
                </div>
              )}
              <UnifiedSpellCard
                spell={{
                  ...selectedSpell,
                  infernoRequired: selectedSpell.specialMechanics?.infernoLevel?.required ||
                                 selectedSpell.resourceCost?.resourceValues?.inferno_required,
                  infernoAscend: selectedSpell.specialMechanics?.infernoLevel?.ascendBy ||
                               selectedSpell.resourceCost?.resourceValues?.inferno_ascend,
                  infernoDescend: selectedSpell.specialMechanics?.infernoLevel?.descendBy ||
                                selectedSpell.resourceCost?.resourceValues?.inferno_descend,
                  ...(selectedSpell.specialMechanics?.musicalCombo && {
                    musicalCombo: selectedSpell.specialMechanics.musicalCombo
                  })
                }}
                variant="wizard"
                showActions={false}
                showDescription={true}
                showStats={true}
                showTags={true}
                rollableTableData={getSpellRollableTable(selectedSpell)}
              />
            </div>
            <button
              className="spellbook-popup-nav spellbook-popup-nav-next"
              onClick={(e) => { e.stopPropagation(); navigateSpell(1); }}
              disabled={selectedSpellIndex >= processedSpells.length - 1}
              aria-label="Next spell"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
            {processedSpells.length > 1 && (
              <div className="spellbook-popup-counter">
                {selectedSpellIndex + 1} / {processedSpells.length}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="class-detail-display premium-theme">
      <div className="class-detail-header premium-header">
        <div className="class-header-left">
          <div className="class-header-icon-container">
            <ClassIcon 
              src={`/assets/icons/classes/${classData.name.toLowerCase().replace(/ /g, '_')}.png`} 
              alt={classData.name} 
              size="large"
              className="header-pixel-icon" 
              dataClass={classData.name}
            />
            <i className={classData.icon} style={{ display: 'none' }}></i>
          </div>
          <div className="class-header-info">
            <h2>{classData.name}</h2>
            <div className="class-header-meta">
              <span className="class-role-badge">
                <i className="fas fa-shield-alt"></i> {classData.role}
              </span>
              {classData.damageTypes && classData.damageTypes.length > 0 && (
                <span className="class-damage-badge">
                  <i className="fas fa-fire"></i> {classData.damageTypes.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="class-header-right"></div>
      </div>

      <div className="class-detail-tabs premium-tabs">
        <button
          className={`class-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => { setActiveTab('overview'); setCurrentPage(0); }}
        >
          <i className="fas fa-book-open"></i> Overview
        </button>
        <button
          className={`class-tab ${activeTab === 'tradition' ? 'active' : ''}`}
          onClick={() => { setActiveTab('tradition'); setCurrentPage(0); }}
        >
          <i className="fas fa-history"></i> Tradition
        </button>
        <button
          className={`class-tab ${activeTab === 'resource' ? 'active' : ''}`}
          onClick={() => { setActiveTab('resource'); setCurrentPage(0); }}
        >
          <i className="fas fa-bolt"></i> Resource System
        </button>
        <button
          className={`class-tab ${activeTab === 'specializations' ? 'active' : ''}`}
          onClick={() => { setActiveTab('specializations'); setCurrentPage(0); }}
        >
          <i className="fas fa-sitemap"></i> Specializations
        </button>
        <button
          className={`class-tab ${activeTab === 'spells' ? 'active' : ''}`}
          onClick={() => { setActiveTab('spells'); setCurrentPage(0); }}
        >
          <i className="fas fa-magic"></i> Spells
        </button>
      </div>

      <div className="class-detail-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'tradition' && renderTradition()}
        {activeTab === 'resource' && renderResourceSystem()}
        {activeTab === 'specializations' && renderSpecializations()}
        {activeTab === 'spells' && renderSpells()}
      </div>
    </div>
  );
};

export default ClassDetailDisplay;

