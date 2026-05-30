import React, { useState, useMemo, useEffect, useRef, Suspense, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSkull, faCrosshairs, faMagic, faAtom, faClock, faDice, faShield,
  faMountain, faGavel, faEye, faShieldAlt, faMoon, faCross, faPaw,
  faWind, faScroll, faBiohazard, faFlask, faMusic, faSun, faFire,
    faDove, faBolt
} from '@fortawesome/free-solid-svg-icons';
import { RULES_CATEGORIES, getRuleContent, searchRulesIndex } from '../../data/rulesData';
import BackgroundSelector from './BackgroundSelector';
import BackgroundsDisplay from './BackgroundsDisplay';
import SkillsDisplay from './SkillsDisplay';
import LanguagesDisplay from './LanguagesDisplay';
import ClassDetailDisplay from './ClassDetailDisplay';
import SpellIconTooltip from './SpellIconTooltip';
import SkillAbilityIconTooltip from './SkillAbilityIconTooltip';
import AdvancedTravelDisplay from './AdvancedTravelDisplay';
import ClassesDisplay from './ClassesDisplay';
import '../spellcrafting-wizard/styles/pathfinder/main.css';
import '../spellcrafting-wizard/styles/pathfinder/components/cards.css';
import './RulesPage.css';
import './components/rules-components.css';
import RulesHeroBanner from './components/RulesHeroBanner';
import RulesSectionCard from './components/RulesSectionCard';
import RulesCollapsible from './components/RulesCollapsible';
import LoreLink from '../common/LoreLink';
import { autoLinkTerminology } from '../../utils/loreAutoLinker';
import RulesSummaryBox from './components/RulesSummaryBox';
import RulesQuickTiles from './components/RulesQuickTiles';

// Lazy load RaceSelector for better performance
const RaceSelector = React.lazy(() => import('./RaceSelector'));
const BestiaryDisplay = React.lazy(() => import('./BestiaryDisplay'));
const TimelineDisplay = React.lazy(() => import('./TimelineDisplay'));
const LexiconDisplay = React.lazy(() => import('./LexiconDisplay'));
const DramatisPersonaeDisplay = React.lazy(() => import('./DramatisPersonaeDisplay'));

// PERFORMANCE OPTIMIZATION: Lazy load class data files on demand instead of importing all at once
// This reduces initial bundle size significantly since class data files are large
const CLASS_DATA_LOADERS = {
  'Pyrofiend': () => import('../../data/classes/pyrofiendData').then(m => m.PYROFIEND_DATA),
  'Minstrel': () => import('../../data/classes/minstrelData').then(m => m.MINSTREL_DATA),
  'Chronarch': () => import('../../data/classes/chronarchData').then(m => m.CHRONARCH_DATA),
  'Martyr': () => import('../../data/classes/martyrData').then(m => m.MARTYR_DATA),
  'False Prophet': () => import('../../data/classes/falseProphetData').then(m => m.FALSE_PROPHET_DATA),
  'Exorcist': () => import('../../data/classes/exorcistData').then(m => m.EXORCIST_DATA),
  'Chaos Weaver': () => import('../../data/classes/chaosWeaverData').then(m => m.CHAOS_WEAVER_DATA),
  'Gambler': () => import('../../data/classes/gamblerData').then(m => m.GAMBLER_DATA),
  'Fate Weaver': () => import('../../data/classes/fateWeaverData').then(m => m.FATE_WEAVER_DATA),
  'Deathcaller': () => import('../../data/classes/deathcallerData').then(m => m.DEATHCALLER_DATA),
  'Plaguebringer': () => import('../../data/classes/plaguebringerData').then(m => m.PLAGUEBRINGER_DATA),
  'Lichborne': () => import('../../data/classes/lichborneData').then(m => m.LICHBORNE_DATA),
  'Spellguard': () => import('../../data/classes/spellguardData').then(m => m.SPELLGUARD_DATA),
  'Inscriptor': () => import('../../data/classes/inscriptorData').then(m => m.INSCRIPTOR_DATA),
  'Arcanoneer': () => import('../../data/classes/arcanoneerData').then(m => m.ARCANONEER_DATA),
  'Witch Doctor': () => import('../../data/classes/witchDoctorData').then(m => m.WITCH_DOCTOR_DATA),
  'Formbender': () => import('../../data/classes/formbenderData').then(m => m.FORMBENDER_DATA),
  'Primalist': () => import('../../data/classes/primalistData').then(m => m.PRIMALIST_DATA),
  'Berserker': () => import('../../data/classes/berserkerData').then(m => m.BERSERKER_DATA),
  'Dreadnaught': () => import('../../data/classes/dreadnaughtData').then(m => m.DREADNAUGHT_DATA),
  'Titan': () => import('../../data/classes/titanData').then(m => m.TITAN_DATA),
  'Bladedancer': () => import('../../data/classes/bladedancerData').then(m => m.BLADEDANCER_DATA),
  'Toxicologist': () => import('../../data/classes/toxicologistData').then(m => m.TOXICOLOGIST_DATA),
  'Covenbane': () => import('../../data/classes/covenbaneData').then(m => m.COVENBANE_DATA),
  'Lunarch': () => import('../../data/classes/lunarchData').then(m => m.LUNARCH_DATA),
  'Huntress': () => import('../../data/classes/huntressData').then(m => m.HUNTRESS_DATA),
  'Warden': () => import('../../data/classes/wardenData').then(m => m.WARDEN_DATA),
  'Oracle': () => import('../../data/classes/oracleData').then(m => m.ORACLE_DATA),
  'Augur': () => import('../../data/classes/augurData').then(m => m.AUGUR_DATA),
  'Doomsayer': () => import('../../data/classes/doomsayerData').then(m => m.DOOMSAYER_DATA),
  // Add other classes as they are created
};

// Cache for loaded class data to avoid re-loading
const classDataCache = new Map();

// Map of class names to their FontAwesome icons
const CLASS_ICON_MAP = {
  'Arcanoneer': faAtom,
  'Berserker': faSkull,
  'Bladedancer': faWind,
  'Chaos Weaver': faDice,
  'Chronarch': faClock,
  'Covenbane': faCrosshairs,
  'Deathcaller': faSkull,
  'Dreadnaught': faShield,
  'Exorcist': faCross,
  'False Prophet': faEye,
  'Fate Weaver': faMagic,
  'Formbender': faPaw,
  'Gambler': faDice,
  'Huntress': faMoon,
  'Inscriptor': faScroll,
  'Lichborne': faSkull,
  'Lunarch': faMoon,
  'Martyr': faCross,
  'Minstrel': faMusic,
  'Oracle': faEye,
  'Plaguebringer': faBiohazard,
  'Primalist': faMountain,
  'Pyrofiend': faFire,
  'Spellguard': faShieldAlt,
  'Titan': faSun,
  'Toxicologist': faFlask,
  'Warden': faGavel,
  'Witch Doctor': faSkull,
  'Augur': faDove,
  'Doomsayer': faBolt,
};

// Simple markdown processor for basic formatting with internal link support
const processMarkdown = (text) => {
  if (!text) return text;

  // Process **bold** text
  let processed = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Process *italic* text
  processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Process [Link Text](category/subcategory) or [Link Text](url)
  processed = processed.replace(/\[(.*?)\]\((.*?)\)/g, (match, linkText, url) => {
    if (url.includes('/')) {
      const [cat, sub] = url.split('/');
      return `<a href="#${sub}" class="rules-link" data-category="${cat}" data-subcategory="${sub}">${linkText}</a>`;
    }
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="rules-external-link">${linkText}</a>`;
  });

  // Process bullet points (• at start of line)
  processed = processed.replace(/^• (.+)$/gm, '<li>$1</li>');

  // Wrap consecutive list items in <ul> and strip inter-item newlines to prevent invalid <br> injections
  processed = processed.replace(/(<li>(?:(?!<\/li>)[\s\S])*<\/li>(?:\s*<li>(?:(?!<\/li>)[\s\S])*<\/li>)*)/g, (match) => {
    return `<ul>${match.trim().replace(/\n/g, '')}</ul>`;
  });

  // Process line breaks
  processed = processed.replace(/\n\n/g, '</p><p>');
  processed = processed.replace(/\n/g, '<br>');

  // Wrap in paragraph if not already wrapped
  if (!processed.startsWith('<') && !processed.startsWith('<ul>')) {
    processed = `<p>${processed}</p>`;
  }

  // Auto-link all recognised LORE_DICTIONARY terms after all markdown is processed
  processed = autoLinkTerminology(processed);

  return processed;
};

// High-performance parser that converts static HTML strings with embedded <LoreLink> or <a> tags into active React components
const InteractiveRulesContent = ({ contentHtml, handleClassClick, handleSubcategoryClick }) => {
  const parsedElements = useMemo(() => {
    if (!contentHtml) return null;

    try {
      const parser = new DOMParser();
      // Wrap contentHtml in a wrapper div to ensure it parses as a single DOM fragment
      const doc = parser.parseFromString(`<div>${contentHtml}</div>`, 'text/html');
      const rootDiv = doc.body.firstChild;

      const renderDomNode = (node, keyVal) => {
        if (node.nodeType === 3) { // Node.TEXT_NODE
          return node.nodeValue;
        }

        if (node.nodeType === 1) { // Node.ELEMENT_NODE
          const tagName = node.tagName.toLowerCase();

          // Check if it's our custom LoreLink tag
          if (tagName === 'lorelink') {
            const termId = node.getAttribute('termid');
            const children = Array.from(node.childNodes).map((child, index) =>
              renderDomNode(child, `lore-child-${index}`)
            );
            return (
              <LoreLink key={keyVal} termId={termId}>
                {children}
              </LoreLink>
            );
          }

          // Check if it's our custom internal rules-link
          if (tagName === 'a' && node.className.includes('rules-link')) {
            const cat = node.getAttribute('data-category');
            const sub = node.getAttribute('data-subcategory');
            const children = Array.from(node.childNodes).map((child, index) =>
              renderDomNode(child, `link-child-${index}`)
            );
            return (
              <span
                key={keyVal}
                className="rules-link clickable-link"
                style={{ cursor: 'pointer', color: '#d4af37', fontWeight: '600' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (cat === 'classes') {
                    handleClassClick(node.textContent);
                  } else {
                    handleSubcategoryClick(cat, sub);
                  }
                }}
              >
                {children}
              </span>
            );
          }

          // For standard HTML tags, map them to React elements
          const attribs = {};
          for (const attr of node.attributes) {
            let name = attr.name;
            if (name === 'class') name = 'className';
            // convert style string to react style object if present
            if (name === 'style') {
              const styleObj = {};
              attr.value.split(';').forEach(style => {
                const parts = style.split(':');
                if (parts.length >= 2) {
                  const k = parts[0].trim();
                  const v = parts.slice(1).join(':').trim();
                  const camelKey = k.replace(/-./g, x => x[1].toUpperCase());
                  styleObj[camelKey] = v;
                }
              });
              attribs.style = styleObj;
              continue;
            }
            attribs[name] = attr.value;
          }
          attribs.key = keyVal;

          const children = Array.from(node.childNodes).map((child, index) =>
            renderDomNode(child, `${tagName}-child-${index}`)
          );

          return React.createElement(tagName, attribs, ...children);
        }

        return null;
      };

      // Return the children of our root wrapper div
      return Array.from(rootDiv.childNodes).map((child, index) =>
        renderDomNode(child, `root-${index}`)
      );
    } catch (error) {
      console.error("DOMParser rendering error:", error);
      // Fallback in case of parse failures
      return <div dangerouslySetInnerHTML={{ __html: contentHtml }} />;
    }
  }, [contentHtml, handleClassClick, handleSubcategoryClick]);

  if (!contentHtml) return null;

  return <div className="rules-content-interactive">{parsedElements}</div>;
};

const getThemeColor = (theme) => {
  const colors = {
    mechanic: '#d4af37', combat: '#dc143c', narrative: '#8b4513',
    danger: '#c0392b', nature: '#228b22', arcane: '#9b59b6',
    undead: '#7d3c98', trade: '#c9a227', social: '#e67e22'
  };
  return colors[theme] || colors.narrative;
};

// Rotating Tips Component
const RotatingTips = React.memo(({ tips }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!tips || tips.length === 0) return;

    const showDuration = 4000; // Show each tip for 4 seconds
    const fadeDuration = 500; // Fade transition takes 0.5 seconds

    const cycle = () => {
      // Fade out
      setIsVisible(false);
      
      setTimeout(() => {
        // Change tip
        setCurrentIndex((prev) => (prev + 1) % tips.length);
        // Fade in
        setIsVisible(true);
      }, fadeDuration);
    };

    const interval = setInterval(cycle, showDuration + fadeDuration);

    return () => clearInterval(interval);
  }, [tips]);

  if (!tips || tips.length === 0) return null;

  const currentTip = tips[currentIndex];

  return (
    <div className="rotating-tips-container">
      <div className={`rotating-tip ${isVisible ? 'visible' : 'hidden'}`}>
        <span className="rotating-tip-label">{currentTip.label}</span>
        <span className="rotating-tip-description">{currentTip.description}</span>
      </div>
      <div className="rotating-tips-indicator">
        {tips.map((_, idx) => (
          <span
            key={idx}
            className={`tip-dot ${idx === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
});

// Rules Section Item Component
const RulesSectionItem = React.memo(({ section, idx, theme, selectedSubcategory, isLast, handleClassClick, handleSubcategoryClick }) => {
  const contentHtml = useMemo(() => {
    if (!section.content) return null;
    let processed = processMarkdown(section.content);

    // Inject transparent hand-drawn watercolor illustrations inline
    let illustrationHtml = '';
    const publicUrl = process.env.PUBLIC_URL || '';

    if (selectedSubcategory === 'game-overview' && section.title && section.title.startsWith('Core Principles')) {
      illustrationHtml = `
        <div class="rules-inline-art-container">
          <img 
            src="${publicUrl}/assets/images/watercolor_dragon.png" 
            alt="Ancient Dragon Sketch" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.1: The Wyrm of Mythrill</span>
        </div>
      `;
    } else if (selectedSubcategory === 'dice-system' && section.title === 'The Ladder of Trials (Difficulty Dice)') {
      illustrationHtml = `
        <div class="rules-inline-art-container left">
          <img 
            src="${publicUrl}/assets/images/watercolor_tome.png" 
            alt="Ancient Arcane Tome" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.2: The Codex of Trials</span>
        </div>
      `;
    } else if (selectedSubcategory === 'character-statistics' && section.title === 'The Six Pillars of Mortality') {
      illustrationHtml = `
        <div class="rules-inline-art-container left">
          <img 
            src="${publicUrl}/assets/images/watercolor_hourglass.png" 
            alt="Mystical Hourglass" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.3: The Sands of Capability</span>
        </div>
      `;
    } else if (selectedSubcategory === 'inventory-encumbrance' && section.title === 'The Spatial Grid') {
      illustrationHtml = `
        <div class="rules-inline-art-container">
          <img 
            src="${publicUrl}/assets/images/watercolor_backpack.png" 
            alt="Explorer's Pack" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.4: The Spatial Explorer's Ledger</span>
        </div>
      `;
    } else if (selectedSubcategory === 'durability-repair' && section.title === 'Mortal Wear') {
      illustrationHtml = `
        <div class="rules-inline-art-container">
          <img 
            src="${publicUrl}/assets/images/watercolor_shield.png" 
            alt="Shattered Shield" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.5: A Fraying Vanguard</span>
        </div>
      `;
    } else if (selectedSubcategory === 'durability-repair' && section.title === 'The Art of Repair (Resting)') {
      illustrationHtml = `
        <div class="rules-inline-art-container left">
          <img 
            src="${publicUrl}/assets/images/watercolor_anvil.png" 
            alt="Repairing on Anvil" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.6: The Reclamation of Iron</span>
        </div>
      `;
    } else if (selectedSubcategory === 'combat-basics' && section.title === 'Combat Structure') {
      illustrationHtml = `
        <div class="rules-inline-art-container left">
          <img 
            src="${publicUrl}/assets/images/watercolor_swords.png" 
            alt="Crossed Runeswords" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.7: The Clash of Steel</span>
        </div>
      `;
    } else if (selectedSubcategory === 'game-sessions' && section.title === 'Session Zero: The Accord of Beginnings') {
      illustrationHtml = `
        <div class="rules-inline-art-container">
          <img 
            src="${publicUrl}/assets/images/watercolor_scroll.png" 
            alt="Covenant Scroll" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.8: The Covenant of Adventuring</span>
        </div>
      `;
    } else if (selectedSubcategory === 'game-sessions' && section.title === 'The Ebb and Flow of Drama (Energy Management)') {
      illustrationHtml = `
        <div class="rules-inline-art-container left">
          <img 
            src="${publicUrl}/assets/images/watercolor_compass.png" 
            alt="Pacing Compass" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.9: The Celestial Pathfinder</span>
        </div>
      `;
    } else if (selectedSubcategory === 'spellcrafting-wizard' && section.title === 'The Magic of Creation (Custom Spellcrafting)') {
      illustrationHtml = `
        <div class="rules-inline-art-container">
          <img 
            src="${publicUrl}/assets/images/watercolor_crystal.png" 
            alt="Magical Spell Crystal" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.10: The Resonance of Creation</span>
        </div>
      `;
    } else if (selectedSubcategory === 'death-dying' && section.title === 'Dying Condition') {
      illustrationHtml = `
        <div class="rules-inline-art-container left">
          <img 
            src="${publicUrl}/assets/images/watercolor_skull.png" 
            alt="Fading Soul Skull" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.11: The Crucible of Mortality</span>
        </div>
      `;
    } else if (selectedSubcategory === 'resting' && section.title === 'The Solace of Rest') {
      illustrationHtml = `
        <div class="rules-inline-art-container">
          <img 
            src="${publicUrl}/assets/images/watercolor_campfire.png" 
            alt="Rest Campfire" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.12: The Embers of Solace</span>
        </div>
      `;
    } else if (selectedSubcategory === 'weapons' && section.title === 'Dynamic Weapon State') {
      illustrationHtml = `
        <div class="rules-inline-art-container left">
          <img 
            src="${publicUrl}/assets/images/watercolor_axe.png" 
            alt="Runic Battleaxe" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.13: The Cleaver of Runes</span>
        </div>
      `;
    } else if (selectedSubcategory === 'armor' && section.title === 'How Armor Works Now') {
      illustrationHtml = `
        <div class="rules-inline-art-container">
          <img 
            src="${publicUrl}/assets/images/watercolor_breastplate.png" 
            alt="Knight Breastplate" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.14: The Aegis of Iron</span>
        </div>
      `;
    } else if (selectedSubcategory === 'magical-items' && section.title === 'Rarity Tiers') {
      illustrationHtml = `
        <div class="rules-inline-art-container left">
          <img 
            src="${publicUrl}/assets/images/watercolor_staff.png" 
            alt="Mystical Wizard Staff" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.15: The Rod of Leylines</span>
        </div>
      `;
    } else if (selectedSubcategory === 'talents' && section.title === 'Talent Trees') {
      illustrationHtml = `
        <div class="rules-inline-art-container">
          <img 
            src="${publicUrl}/assets/images/watercolor_tree.png" 
            alt="Mystical Talent Tree" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.16: The Canopy of Ascendancy</span>
        </div>
      `;
    } else if (selectedSubcategory === 'travel-basics' && section.title === 'The Open Road') {
      illustrationHtml = `
        <div class="rules-inline-art-container left">
          <img 
            src="${publicUrl}/assets/images/watercolor_map.png" 
            alt="Explorer World Map" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.17: The Cartographer's Ledger</span>
        </div>
      `;
    } else if (selectedSubcategory === 'social-basics' && section.title === 'Core Social Skills') {
      illustrationHtml = `
        <div class="rules-inline-art-container">
          <img 
            src="${publicUrl}/assets/images/watercolor_seal.png" 
            alt="Noble Wax Seal" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.18: The Faction's Decree</span>
        </div>
      `;
    } else if (selectedSubcategory === 'creation-overview' && section.title && section.title.startsWith('Introduction')) {
      illustrationHtml = `
        <div class="rules-inline-art-container">
          <img 
            src="${publicUrl}/assets/images/watercolor_sigil.png" 
            alt="Mystical Sigil" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.19: The Glyph of Identity</span>
        </div>
      `;
    } else if (selectedSubcategory === 'races' && section.title === 'Race System Overview') {
      illustrationHtml = `
        <div class="rules-inline-art-container left">
          <img 
            src="${publicUrl}/assets/images/watercolor_crown.png" 
            alt="Ancestral Crown" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.20: The Crown of Heritage</span>
        </div>
      `;
    } else if (selectedSubcategory === 'magic-overview' && section.title === "The Void's Shadow (Arcane Corruption)") {
      illustrationHtml = `
        <div class="rules-inline-art-container left">
          <img 
            src="${publicUrl}/assets/images/watercolor_void.png" 
            alt="Arcane Void Swirl" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.21: The Corruption's Embrace</span>
        </div>
      `;
    } else if (selectedSubcategory === 'welcome' && section.title === 'What Is Mythrill?') {
      illustrationHtml = `
        <div class="rules-inline-art-container left">
          <img 
            src="${publicUrl}/assets/images/watercolor_map.png" 
            alt="Explorer World Map" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.22: The Cartographer's Ledger</span>
        </div>
      `;
    } else if (selectedSubcategory === 'professions' && section.title === 'Blacksmithing (Forge Interface)') {
      illustrationHtml = `
        <div class="rules-inline-art-container left">
          <img 
            src="${publicUrl}/assets/images/watercolor_anvil.png" 
            alt="Repairing on Anvil" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.23: The Reclamation of Iron</span>
        </div>
      `;
    } else if (selectedSubcategory === 'professions' && section.title === 'Alchemy (Alchemist Interface)') {
      illustrationHtml = `
        <div class="rules-inline-art-container">
          <img 
            src="${publicUrl}/assets/images/watercolor_flask.png" 
            alt="Alchemical Flask" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.24: The Alchemist's Crucible</span>
        </div>
      `;
    } else if (selectedSubcategory === 'dice-rolling-basics' && section.title === 'How Rolls Work on the VTT') {
      illustrationHtml = `
        <div class="rules-inline-art-container left">
          <img 
            src="${publicUrl}/assets/images/watercolor_d20.png" 
            alt="Magical d20 Polyhedral Die" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.25: The Die of Destiny</span>
        </div>
      `;
    } else if (selectedSubcategory === 'your-first-character' && section.title === 'Opening the Character Creation Wizard') {
      illustrationHtml = `
        <div class="rules-inline-art-container">
          <img 
            src="${publicUrl}/assets/images/watercolor_quill.png" 
            alt="Quill and Inkwell" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.26: The Scribe's Ascent</span>
        </div>
      `;
    } else if (selectedSubcategory === 'token-movement' && section.title === 'Tactical Movement on the Grid') {
      illustrationHtml = `
        <div class="rules-inline-art-container left">
          <img 
            src="${publicUrl}/assets/images/watercolor_boots.png" 
            alt="Medieval Travel Boots" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.27: The Stride of Battle</span>
        </div>
      `;
    } else if (selectedSubcategory === 'interface-overview' && section.title === 'The Main Play Area (The Grid)') {
      illustrationHtml = `
        <div class="rules-inline-art-container">
          <img 
            src="${publicUrl}/assets/images/watercolor_candle.png" 
            alt="Burning Wax Candle" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.28: The Hearth of the Table</span>
        </div>
      `;
    } else if (selectedSubcategory === 'combat-conditions' && section.title === 'Condition System') {
      illustrationHtml = `
        <div class="rules-inline-art-container left">
          <img 
            src="${publicUrl}/assets/images/watercolor_shackles.png" 
            alt="Rusted Shackles" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.29: The Bonds of Battle</span>
        </div>
      `;
    } else if (selectedSubcategory === 'dnd-comparison' && section.title === 'The Great Mindset Shift') {
      illustrationHtml = `
        <div class="rules-inline-art-container">
          <img 
            src="${publicUrl}/assets/images/watercolor_scales.png" 
            alt="The Scales of Destiny" 
            class="rules-inline-art"
          />
          <span class="rules-inline-art-caption">Fig 1.30: The Scales of Destiny</span>
        </div>
      `;
    }

    if (illustrationHtml) {
      processed = illustrationHtml + processed;
    }

    return processed;
  }, [section.content, section.title, selectedSubcategory]);

  if (section.type === 'rotating-tips') {
    return (
      <>
        <div className="rules-section">
          {section.title && <h4 className="rules-section-title">{section.title}</h4>}
          <RotatingTips tips={section.tips} />
        </div>
        {!isLast && (
          <div className="rules-divider">
            <span className="rules-divider-icon">✥</span>
          </div>
        )}
      </>
    );
  }

  if (!contentHtml) return null;

  const renderedElement = (
    <RulesSectionCard title={section.title} theme={theme} short={false}>
      <InteractiveRulesContent 
        contentHtml={contentHtml} 
        handleClassClick={handleClassClick} 
        handleSubcategoryClick={handleSubcategoryClick} 
      />
    </RulesSectionCard>
  );

  return (
    <div id={`section-${idx}`} className="rules-section-wrapper" style={{ scrollMarginTop: '16px' }}>
      {renderedElement}
      {!isLast && (
        <div className="rules-divider">
          <span className="rules-divider-icon">✥</span>
        </div>
      )}
    </div>
  );
});

// Rules Table Component
const RulesTable = React.memo(({ table, tableIdx, sectionTheme, selectedSubcategory, handleClassClick, currentPage, onPageChange }) => {
  // Check if this is the Skill-Based Abilities table
  const isSkillAbilitiesTable = table.title === 'Skill-Based Abilities' || 
                                (table.headers && table.headers.length > 0 && 
                                 table.headers[0] === 'Skill' && 
                                 table.headers.includes('Unlocks'));
  
  // Custom card layout for compact armor displays
  if (table.layout === 'armor-grid') {
    return (
      <div className="rules-table-container" key={table.title}>
        {table.title && <h5 className="rules-table-title">{table.title}</h5>}
        <div className="armor-grid">
          {table.rows.map((row, idx) => (
            <div className="armor-card" key={idx}>
              <h4>{row[0]}</h4>
              {row[1] && table.headers[1] && <p><strong>{table.headers[1]}:</strong> {row[1]}</p>}
              {row[2] && table.headers[2] && <p><strong>{table.headers[2]}:</strong> {row[2]}</p>}
              {row[3] && table.headers[3] && <p><strong>{table.headers[3]}:</strong> {row[3]}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const rows = table?.rows || [];
  const clickableColumn = table.clickableColumn !== undefined ? table.clickableColumn : -1;
  
  // Pagination: Show rows per page (split between left and right)
  // Default rows per page across the full spread; tables can override via rowsPerPage
  const defaultRowsPerSide = 5;
  const requestedRowsPerPage = table.rowsPerPage || defaultRowsPerSide * 2;
  const rowsPerSide = Math.ceil(requestedRowsPerPage / 2);
  const rowsPerPage = rowsPerSide * 2; // normalize to even count for left/right split
  const totalPages = Math.max(Math.ceil(rows.length / rowsPerPage), 1);
  const maxPageIndex = Math.max(totalPages - 1, 0);
  const tablePage = Math.min(currentPage || 0, maxPageIndex);
  
  // Get rows for current page
  const startIdx = tablePage * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const pageRows = rows.slice(startIdx, endIdx);
  
  // Only split into two pages when the right side would be at least 75% full.
  // We force this to false to ensure a clean, high-readability single-page table layout
  const shouldSplit = false;

  const leftPageRows = pageRows;
  const rightPageRows = [];
  const hasRightPage = false;

  const renderTablePage = (rows, startRowIndex) => (
    <table className="rules-table">
      <thead>
        <tr>
          {table.headers.map((header, idx) => (
            <th key={idx}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIdx) => (
          <tr key={rowIdx + startRowIndex}>
            {row.map((cell, cellIdx) => {
              // Check if this is a clickable cell (for class names)
              const isClickable = cellIdx === clickableColumn && selectedSubcategory === 'classes';
              
              // Check if cell is a spell object
              const isSpellObject = cell && typeof cell === 'object' && cell.spellId;
              
              // Get class icon for class names
              const icon = !isSpellObject && CLASS_ICON_MAP[cell];
              
              return (
                <td
                  key={cellIdx}
                  className={isClickable ? 'clickable-cell' : ''}
                  onClick={isClickable ? () => handleClassClick(cell) : undefined}
                  style={isClickable ? { cursor: 'pointer', color: '#d4af37', fontWeight: '600' } : {}}
                >
                  {isSpellObject ? (
                    <>
                      {cell.prefix && <span style={{ marginRight: '4px', whiteSpace: 'nowrap' }}>{cell.prefix}</span>}
                      <SpellIconTooltip spellId={cell.spellId} />
                    </>
                  ) : (
                    <>
                      {isSkillAbilitiesTable && cellIdx === 0 && typeof cell === 'string' ? (
                        <>
                          <SkillAbilityIconTooltip skillName={cell} />
                          <span>{cell}</span>
                        </>
                      ) : (
                        <>
                          {icon && (
                            <FontAwesomeIcon icon={icon} className="class-cell-icon" aria-hidden="true" />
                          )}
                          {cell}
                        </>
                      )}
                    </>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const changeTablePage = (nextPage) => {
    const clamped = Math.min(Math.max(nextPage, 0), maxPageIndex);
    onPageChange(clamped);
  };

  const themeColor = getThemeColor(sectionTheme);
  // has-two-pages enables the book-spine ::before pseudo-element only when genuinely split
  const wrapperClass = `rules-table-wrapper ${!hasRightPage ? 'single-page' : 'has-two-pages'}`;

  return (
    <div className="rules-table-container rules-table-themed" key={table.title} style={{ '--table-theme-color': themeColor }}>
      {table.title && <h5 className="rules-table-title">{table.title}</h5>}
      {table.description && <p className="rules-table-description">{table.description}</p>}
      <div className={wrapperClass}>
        {/* Left Page */}
        <div className="rules-table-page-left">
          {renderTablePage(leftPageRows, startIdx)}
        </div>

        {/* Right Page */}
        {hasRightPage && (
          <div className="rules-table-page-right">
            {renderTablePage(rightPageRows, startIdx + rowsPerSide)}
          </div>
        )}
      </div>

      {/* Page Navigation */}
      {totalPages > 1 && (
        <div className="rules-table-pagination">
          <button
            className="rules-table-page-button"
            onClick={() => changeTablePage(tablePage - 1)}
            disabled={tablePage === 0}
            aria-label="Previous page"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="rules-table-page-indicator">
            Page {tablePage + 1} / {totalPages}
          </span>
          <button
            className="rules-table-page-button"
            onClick={() => changeTablePage(tablePage + 1)}
            disabled={tablePage >= totalPages - 1}
            aria-label="Next page"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
});

const GET_THEME_COLOR = (theme) => {
  const colors = {
    mechanic: '#8a1a10',
    combat: '#9c281a',
    narrative: '#6d4021',
    danger: '#a62424',
    nature: '#2a5c2d',
    arcane: '#5b2c80',
    undead: '#3d1c47',
    trade: '#997400',
    social: '#b25900'
  };
  return colors[theme] || '#6d4021';
};

const RulesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('core-rules');
  const [selectedSubcategory, setSelectedSubcategory] = useState('game-overview');
  const [selectedClassDetail, setSelectedClassDetail] = useState(null); // For class detail pages
  const [activeTab, setActiveTab] = useState(null);
  const [popoutCategory, setPopoutCategory] = useState(null);
  const [popoutPosition, setPopoutPosition] = useState({ top: 0, left: 0 });
  const [tablePages, setTablePages] = useState({});
  const [loadedClassData, setLoadedClassData] = useState(null);
  const [isLoadingClassData, setIsLoadingClassData] = useState(false);
  const buttonRefs = useRef({});
  const [activeSectionTab, setActiveSectionTab] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);
  const searchModalRef = useRef(null);

  // Lazy load class data when a class is selected
  useEffect(() => {
    if (!selectedClassDetail) {
      setLoadedClassData(null);
      return;
    }

    // Check cache first
    if (classDataCache.has(selectedClassDetail)) {
      setLoadedClassData(classDataCache.get(selectedClassDetail));
      return;
    }

    // Load class data
    const loader = CLASS_DATA_LOADERS[selectedClassDetail];
    if (!loader) {
      setLoadedClassData(null);
      return;
    }

    setIsLoadingClassData(true);
    loader()
      .then(data => {
        classDataCache.set(selectedClassDetail, data);
        setLoadedClassData(data);
      })
      .catch(error => {
        console.error(`Failed to load class data for ${selectedClassDetail}:`, error);
        setLoadedClassData(null);
      })
      .finally(() => {
        setIsLoadingClassData(false);
      });
  }, [selectedClassDetail]);

  // Handle subcategory selection
  const handleSubcategoryClick = (categoryId, subcategoryId, sectionIndex = null, tabId = null) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategoryId);
    setSelectedClassDetail(null); // Clear class detail when changing subcategory
    setActiveTab(tabId); // Reset tab, or activate specific tab for search results
    setActiveSectionTab(sectionIndex !== null && sectionIndex >= 0 ? sectionIndex : 0);
    setShowSearch(false);

    // Scroll to section if specified, otherwise scroll content to top
    if (sectionIndex !== null && sectionIndex >= 0) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const contentArea = document.querySelector('.rules-content-area');
          const sectionEl = document.getElementById(`section-${sectionIndex}`);
          if (contentArea && sectionEl) {
            const top = sectionEl.offsetTop - 24;
            contentArea.scrollTo({ top, behavior: 'smooth' });
          }
        }, 180);
      });
    } else {
      const mainEl = document.querySelector('.rules-main');
      if (mainEl) mainEl.scrollTop = 0;
    }
  };

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (breadcrumbType) => {
    if (breadcrumbType === 'rules') {
      // Navigate to main rules overview
      handleSubcategoryClick('core-rules', 'game-overview');
    } else if (breadcrumbType === 'character-creation') {
      // Navigate to character creation overview
      handleSubcategoryClick('character-creation', 'creation-overview');
    }
  };

  // Handle class detail selection
  const handleClassClick = (className) => {
    setSelectedClassDetail(className);
  };

  // Handle back to classes list
  const handleBackToClasses = () => {
    setSelectedClassDetail(null);
  };

  // Search functionality
  const openSearch = useCallback(() => {
    setShowSearch(true);
    setSearchQuery('');
    setSearchResults([]);
    // Focus input after modal opens
    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  }, []);

  const closeSearch = useCallback(() => {
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  const handleSearchChange = useCallback((e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      setSearchResults(searchRulesIndex(val));
    } else {
      setSearchResults([]);
    }
  }, []);

  const handleSearchKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      closeSearch();
    } else if (e.key === 'Enter' && searchResults.length > 0) {
      const first = searchResults[0];
      handleSubcategoryClick(first.categoryId, first.subcategoryId, first.sectionIndex, first.tabId);
    }
  }, [searchResults, closeSearch]);

  const handleSearchResultClick = useCallback((result) => {
    handleSubcategoryClick(result.categoryId, result.subcategoryId, result.sectionIndex, result.tabId);
  }, []);

  // Close search modal on outside click or Escape
  useEffect(() => {
    if (!showSearch) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') closeSearch();
    };
    const handleClickOutside = (e) => {
      if (searchModalRef.current && !searchModalRef.current.contains(e.target)) {
        closeSearch();
      }
    };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearch, closeSearch]);

  // Handle internal rules link clicks for interactive navigation
  const handleContentClick = useCallback((e) => {
    const link = e.target.closest('.rules-link');
    if (link) {
      e.preventDefault();
      const category = link.getAttribute('data-category');
      const subcategory = link.getAttribute('data-subcategory');
      if (category && subcategory) {
        handleSubcategoryClick(category, subcategory);
        const mainEl = document.querySelector('.rules-main');
        if (mainEl) {
          mainEl.scrollTop = 0;
        }
      }
    }
  }, []);

  // Get current content
  const currentContent = useMemo(() => {
    return getRuleContent(selectedCategory, selectedSubcategory);
  }, [selectedCategory, selectedSubcategory]);

  // Get breadcrumbs
  const breadcrumbs = useMemo(() => {
    const category = RULES_CATEGORIES.find(c => c.id === selectedCategory);
    const subcategory = category?.subcategories.find(s => s.id === selectedSubcategory);
    return {
      category: category?.name || '',
      subcategory: subcategory?.name || ''
    };
  }, [selectedCategory, selectedSubcategory]);

  // Filter rules based on search
  const filteredCategories = useMemo(() => {
    // For now, just return all categories since search is not implemented in UI
    return RULES_CATEGORIES;
  }, []);

  // Reset table pagination when the viewed content changes
  useEffect(() => {
    setTablePages({});
  }, [currentContent]);

  // Render a table
  const renderTable = (table, tableIdx, sectionTheme = 'narrative') => {
    const tableKey = table.id || table.title || `table-${tableIdx}`;
    const currentPage = tablePages[tableKey] || 0;
    
    return (
      <RulesTable
        key={tableKey}
        table={table}
        tableIdx={tableIdx}
        sectionTheme={sectionTheme}
        selectedSubcategory={selectedSubcategory}
        handleClassClick={handleClassClick}
        currentPage={currentPage}
        onPageChange={(nextPage) => {
          setTablePages(prev => ({
            ...prev,
            [tableKey]: nextPage
          }));
        }}
      />
    );
  };

  // Render content sections
  const renderSections = (sections, sectionTheme) => {
    if (!sections) return null;
    const theme = sectionTheme || 'narrative';

    // Filter out sections that are just rotating tips or have no content
    const validSections = sections.filter(s => s.type !== 'rotating-tips' && (s.content || s.title));
    const tipsSections = sections.filter(s => s.type === 'rotating-tips');

    // Render active tabbed section
    let renderedSections = null;
    if (validSections.length <= 1) {
      renderedSections = validSections.map((section, idx) => (
        <RulesSectionItem
          key={idx}
          section={section}
          idx={idx}
          theme={theme}
          selectedSubcategory={selectedSubcategory}
          isLast={idx === validSections.length - 1}
          handleClassClick={handleClassClick}
          handleSubcategoryClick={handleSubcategoryClick}
        />
      ));
    } else {
      const activeIdx = activeSectionTab < validSections.length ? activeSectionTab : 0;
      const activeSection = validSections[activeIdx];
      renderedSections = (
        <div className="page-fade-in" key={activeIdx}>
          <RulesSectionItem
            section={activeSection}
            idx={activeIdx}
            theme={theme}
            selectedSubcategory={selectedSubcategory}
            isLast={true}
            handleClassClick={handleClassClick}
            handleSubcategoryClick={handleSubcategoryClick}
          />
        </div>
      );
    }

    // Render rotating tips at the bottom if present
    return (
      <>
        {renderedSections}
        {tipsSections.map((section, idx) => (
          <RulesSectionItem
            key={`tip-${idx}`}
            section={section}
            idx={idx}
            theme={theme}
            selectedSubcategory={selectedSubcategory}
            isLast={idx === tipsSections.length - 1}
            handleClassClick={handleClassClick}
            handleSubcategoryClick={handleSubcategoryClick}
          />
        ))}
      </>
    );
  };

  // Render tabbed content
  const renderTabbedContent = (tabs, sectionTheme) => {
    const currentTab = activeTab || tabs[0].id;
    const currentTabData = tabs.find(t => t.id === currentTab);

    return (
      <div className="rules-tabs-container">
        <div className="rules-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`rules-tab ${currentTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>
        <div className="rules-tab-content">
          {currentTabData?.sections && renderSections(currentTabData.sections, sectionTheme)}
          {currentTabData?.tables && currentTabData.tables.map((t, i) => renderTable(t, i, sectionTheme))}
        </div>
      </div>
    );
  };

  // Render main content
  const renderContent = () => {
    if (!currentContent) {
      return (
        <div className="rules-no-content">
          <i className="fas fa-book-open"></i>
          <p>Select a topic from the sidebar to view rules</p>
        </div>
      );
    }

    // Check if this subcategory should use a custom component
    const currentSubcategory = RULES_CATEGORIES
      .find(cat => cat.id === selectedCategory)
      ?.subcategories?.find(sub => sub.id === selectedSubcategory);

    // If viewing a class detail page
    if (selectedClassDetail && selectedSubcategory === 'classes') {
      return (
        <div className="rules-content-area class-detail-view">
          {isLoadingClassData ? (
            <div className="rules-loading">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading tradition data...</p>
            </div>
          ) : loadedClassData ? (
            <ClassDetailDisplay classData={loadedClassData} onBack={handleBackToClasses} />
          ) : (
            <div className="rules-no-content">
              <i className="fas fa-exclamation-triangle"></i>
              <p>Tradition data for {selectedClassDetail} is not yet available.</p>
              <p>This tradition will be added in a future update.</p>
            </div>
          )}
        </div>
      );
    }

    // Determine if using custom component
    const isUsingCustomComponent = currentSubcategory?.useCustomComponent;
    const sectionTheme = currentSubcategory?.theme || 'narrative';

    return (
      <div className={`rules-content-area ${isUsingCustomComponent ? 'custom-component-view' : ''}`}>
        <RulesHeroBanner
          title={currentContent.title}
          subtitle={currentContent.description}
          badge={breadcrumbs.category?.toUpperCase()}
          badgeIcon="fas fa-book-open"
          theme={sectionTheme}
          quickTiles={currentSubcategory?.quickFacts}
        />

        {/* Antique Scribe's Index Tabs Bar */}
        {!isUsingCustomComponent && currentContent.sections && currentContent.sections.length > 1 && (() => {
          const validSections = currentContent.sections.filter(s => s.title && s.type !== 'rotating-tips' && (s.content || s.title));
          if (validSections.length <= 1) return null;
          return (
            <div className="rpg-tabs-bar">
              {validSections.map((section, idx) => {
                const displayTitle = section.title.split(':')[0].split('(')[0].replace(/this rulebook/i, '').trim();
                return (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="rpg-tab-divider">✦</span>}
                    <button
                      className={`rpg-custom-tab ${activeSectionTab === idx ? 'active' : ''}`}
                      onClick={() => setActiveSectionTab(idx)}
                      title={section.title}
                    >
                      <span className="rpg-tab-label">{displayTitle}</span>
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          );
        })()}


        {/* Quick reference tiles */}
        {!isUsingCustomComponent && currentSubcategory?.quickFacts && (
          <RulesQuickTiles tiles={currentSubcategory.quickFacts} />
        )}

        {/* Summary box */}
        {!isUsingCustomComponent && currentSubcategory?.summary && (
          <RulesSummaryBox items={currentSubcategory.summary} />
        )}

        {/* Render sections */}
        {!isUsingCustomComponent && currentContent.sections && renderSections(currentContent.sections, sectionTheme)}

        {/* Custom component: Classes grid replaces the old table */}
        {currentSubcategory?.useCustomComponent && selectedSubcategory === 'classes' && !selectedClassDetail && (
          <ClassesDisplay onSelectClass={handleClassClick} />
        )}
        {currentSubcategory?.useCustomComponent && selectedSubcategory === 'races' && (
          <Suspense fallback={
            <div className="rules-loading">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading race selector...</p>
            </div>
          }>
            <RaceSelector />
          </Suspense>
        )}
        {currentSubcategory?.useCustomComponent && selectedSubcategory === 'character-backgrounds' && (
          <BackgroundsDisplay />
        )}
        {currentSubcategory?.useCustomComponent && selectedSubcategory === 'disciplines' && (
          <BackgroundSelector />
        )}
        {currentSubcategory?.useCustomComponent && selectedSubcategory === 'skills' && (
          <SkillsDisplay />
        )}
        {currentSubcategory?.useCustomComponent && selectedSubcategory === 'languages' && (
          <LanguagesDisplay />
        )}
        {currentSubcategory?.useCustomComponent && selectedSubcategory === 'advanced-travel' && (
          <AdvancedTravelDisplay />
        )}
        {currentSubcategory?.useCustomComponent && selectedSubcategory === 'timeline' && (
          <Suspense fallback={
            <div className="rules-loading">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading timeline...</p>
            </div>
          }>
            <TimelineDisplay />
          </Suspense>
        )}
        {currentSubcategory?.useCustomComponent && selectedSubcategory === 'bestiary' && (
          <Suspense fallback={
            <div className="rules-loading">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading bestiary...</p>
            </div>
          }>
            <BestiaryDisplay />
          </Suspense>
        )}
        {currentSubcategory?.useCustomComponent && selectedSubcategory === 'lexicon' && (
          <Suspense fallback={
            <div className="rules-loading">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading lexicon...</p>
            </div>
          }>
            <LexiconDisplay />
          </Suspense>
        )}
        {currentSubcategory?.useCustomComponent && selectedSubcategory === 'dramatis-personae' && (
          <Suspense fallback={
            <div className="rules-loading">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading notable figures...</p>
            </div>
          }>
            <DramatisPersonaeDisplay />
          </Suspense>
        )}

        {/* Render tables */}
        {!isUsingCustomComponent && currentContent.tables && currentContent.tables.map((table, idx) => renderTable(table, idx, sectionTheme))}

        {/* Render tabs if present (only if not using custom component) */}
        {!currentSubcategory?.useCustomComponent && currentContent.tabs && renderTabbedContent(currentContent.tabs, sectionTheme)}
      </div>
    );
  };

  // Close popout when clicking outside and recalculate position on scroll/resize
  useEffect(() => {
    if (!popoutCategory) return;

    const handleClickOutside = (event) => {
      // Don't close if clicking on the button that opened it or the popout itself
      if (event.target.closest('.rules-nav-popout') || event.target.closest('.rules-nav-category-btn')) {
        return;
      }
      setPopoutCategory(null);
    };

    const handleResize = () => {
      // Recalculate position on resize to keep popout visible
      const categoryId = popoutCategory;
      const button = buttonRefs.current[categoryId];
      if (button) {
        const rect = button.getBoundingClientRect();
        const category = filteredCategories.find(c => c.id === categoryId);
        const subCount = category ? category.subcategories.length : 8;
        const popoutWidth = 300;
        const popoutHeight = Math.min(window.innerHeight - 120, 60 + subCount * 44);
        const gap = 12;
        const padding = 10;
        const headerHeight = 70; // Height of the header

        let left = rect.right + gap;
        let top = rect.top + rect.height / 2;

        if (left + popoutWidth > window.innerWidth - padding) {
          left = rect.left - popoutWidth - gap;
        }
        if (left < padding) {
          left = padding;
        }
        if (left + popoutWidth > window.innerWidth - padding) {
          left = window.innerWidth - popoutWidth - padding;
        }

        const halfHeight = popoutHeight / 2;
        // Ensure popout doesn't go under the header
        if (top - halfHeight < headerHeight + padding) {
          top = halfHeight + headerHeight + padding;
        } else if (top + halfHeight > window.innerHeight - padding) {
          top = window.innerHeight - halfHeight - padding;
        }

        setPopoutPosition({ top, left });
      }
    };

    // Delay to avoid immediate closure when opening
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize, true);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [popoutCategory]);


  return (
    <div className="rules-page">
      {/* Sidebar Navigation - Always Collapsed */}
      <aside className="rules-sidebar collapsed">
        {/* Navigation Tree */}
        <nav className="rules-nav collapsed">
          {/* Search Trigger Button */}
          <div className="rules-sidebar-search-trigger">
            <button
              className="rules-search-trigger-btn"
              onClick={openSearch}
              title="Search the Codex"
              aria-label="Search the Codex"
            >
              <i className="fas fa-search"></i>
            </button>
          </div>
          {filteredCategories.map(category => (
            <div key={category.id} className="rules-nav-category">
              <div style={{ position: 'relative' }}>
                <button
                  ref={(el) => (buttonRefs.current[category.id] = el)}
                  className={`rules-nav-category-btn ${selectedCategory === category.id ? 'active-category' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const button = e.currentTarget;
                    const rect = button.getBoundingClientRect();
                    const isMobile = window.innerWidth <= 768;
                    
                    if (isMobile) {
                      // On mobile, always show from bottom
                      setPopoutPosition({
                        top: window.innerHeight,
                        left: 0
                      });
                    } else {
                      // Desktop positioning logic
                      // Popout dimensions (dynamic & accurate)
                      const popoutWidth = 300; // max-width from CSS (240-300px)
                      const subCount = category.subcategories ? category.subcategories.length : 8;
                      const popoutHeight = Math.min(window.innerHeight - 120, 60 + subCount * 44);
                      const gap = 12;
                      const padding = 10; // minimum padding from screen edges
                      const headerHeight = 70; // Height of the header
                      
                      // Calculate desired position (to the right of button)
                      let left = rect.right + gap;
                      let top = rect.top + rect.height / 2;
                      
                      // Check if popout would go off right edge
                      if (left + popoutWidth > window.innerWidth) {
                        // If it would go off-screen, position it to the left of the button instead
                        left = rect.left - popoutWidth - gap;
                      }
                      
                      // Ensure it doesn't go off left edge either
                      if (left < padding) {
                        left = padding;
                      }
                      
                      // Ensure it doesn't go off right edge
                      if (left + popoutWidth > window.innerWidth - padding) {
                        left = window.innerWidth - popoutWidth - padding;
                      }
                      
                      // Check vertical bounds - keep popout centered on button but within viewport
                      // Ensure popout doesn't go under the header
                      const halfHeight = popoutHeight / 2;
                      if (top - halfHeight < headerHeight + padding) {
                        // Too close to top (or would go under header), adjust down
                        top = halfHeight + headerHeight + padding;
                      } else if (top + halfHeight > window.innerHeight - padding) {
                        // Too close to bottom, adjust up
                        top = window.innerHeight - halfHeight - padding;
                      }
                      
                      // Calculate position relative to viewport
                      setPopoutPosition({
                        top: top,
                        left: left
                      });
                    }
                    // Always show popout menu
                    setPopoutCategory(popoutCategory === category.id ? null : category.id);
                  }}
                  title={category.name}
                  data-active={selectedCategory === category.id ? 'true' : 'false'}
                >
                  <i className={`${category.icon || 'fas fa-circle'} rules-nav-icon`}></i>
                </button>

                {/* Popout orb menu */}
                {popoutCategory === category.id && (
                  <div 
                    className="rules-nav-popout"
                    style={{
                      top: `${popoutPosition.top}px`,
                      left: `${popoutPosition.left}px`
                    }}
                  >
                    <div className="rules-nav-popout-header">
                      <i className={category.icon}></i>
                      <span>{category.name}</span>
                    </div>
                    <div className="rules-nav-popout-body">
                      {category.subcategories.map(sub => (
                        <button
                          key={sub.id}
                          className={`rules-nav-popout-item ${
                            selectedCategory === category.id && selectedSubcategory === sub.id && !selectedClassDetail
                              ? 'active'
                              : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubcategoryClick(category.id, sub.id);
                            setPopoutCategory(null);
                          }}
                        >
                          <i className={sub.icon}></i>
                          <span>{sub.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="rules-main" onClick={handleContentClick}>
        {/* Breadcrumbs */}
        <div className="rules-breadcrumbs">
          <button
            className="rules-breadcrumb rules-breadcrumb-link"
            onClick={() => handleBreadcrumbClick('rules')}
            aria-label="Navigate to Rules overview"
          >
            Rules
          </button>
          <i className="fas fa-chevron-right"></i>
          {breadcrumbs.category === 'Character Creation' ? (
            <button
              className="rules-breadcrumb rules-breadcrumb-link"
              onClick={() => handleBreadcrumbClick('character-creation')}
              aria-label="Navigate to Character Creation overview"
            >
              {breadcrumbs.category}
            </button>
          ) : (
            <span className="rules-breadcrumb">{breadcrumbs.category}</span>
          )}
          <i className="fas fa-chevron-right"></i>
          {selectedClassDetail && selectedSubcategory === 'classes' ? (
            <button
              className="rules-breadcrumb rules-breadcrumb-link"
              onClick={handleBackToClasses}
              aria-label="Navigate to Traditions of Power list"
            >
              {breadcrumbs.subcategory}
            </button>
          ) : (
            <span className="rules-breadcrumb active">{breadcrumbs.subcategory}</span>
          )}
          {selectedClassDetail && selectedSubcategory === 'classes' && (
            <>
              <i className="fas fa-chevron-right"></i>
              <span className="rules-breadcrumb active">{selectedClassDetail}</span>
            </>
          )}
        </div>

        {/* Content */}
        {renderContent()}
      </main>

      {/* Search Modal Overlay */}
      {showSearch && (
        <div className="rules-search-overlay">
          <div className="rules-search-modal" ref={searchModalRef}>
            <div className="rules-search-header">
              <h3 className="rules-search-title">
                <i className="fas fa-book-open"></i>
                Search the Codex
              </h3>
              <button className="rules-search-close" onClick={closeSearch} aria-label="Close search">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="rules-search-body">
              <div className="rules-search-input-wrapper">
                <span className="rules-search-input-icon">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  ref={searchInputRef}
                  type="text"
                  className="rules-search-input"
                  placeholder="Search rules, sections, topics..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                />
                {searchQuery && (
                  <button className="rules-search-input-clear" onClick={() => { setSearchQuery(''); setSearchResults([]); searchInputRef.current?.focus(); }} aria-label="Clear search">
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>

              <div className="rules-search-results">
                {searchQuery.trim().length < 2 ? (
                  <div className="rules-search-hint">
                    <i className="fas fa-search"></i>
                    <p>Type at least 2 characters to search the Codex</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="rules-search-empty">
                    <i className="fas fa-scroll"></i>
                    <p>No results found for "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="rules-search-results-list">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        className="rules-search-result-item"
                        onClick={() => handleSearchResultClick(result)}
                      >
                        <div className="rules-search-result-breadcrumb">
                          {result.categoryName}
                          {result.subcategoryName && (
                            <>
                              <i className="fas fa-chevron-right"></i>
                              {result.subcategoryName}
                            </>
                          )}
                          {result.tabName && (
                            <>
                              <i className="fas fa-chevron-right"></i>
                              <span className="rules-search-result-section">{result.tabName}</span>
                            </>
                          )}
                          {result.sectionTitle && result.sectionIndex >= 0 && !result.tabName && (
                            <>
                              <i className="fas fa-chevron-right"></i>
                              <span className="rules-search-result-section">{result.sectionTitle}</span>
                            </>
                          )}
                        </div>
                        <div className="rules-search-result-title">
                          {result.displayTitle}
                        </div>
                        {result.preview && (
                          <div className="rules-search-result-preview">
                            {result.preview}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {searchResults.length > 0 && (
              <div className="rules-search-footer">
                <span>{searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</span>
                <span className="rules-search-footer-hint">Press <kbd>Enter</kbd> to open top result</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RulesPage;

