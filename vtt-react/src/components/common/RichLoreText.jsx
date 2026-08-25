import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import EntityHovercard from './EntityHovercard';
import universalEntityService from '../../services/universalEntityService';
import useInteractiveMapStore from '../../store/interactiveMapStore';
import useFamilyTreeStore from '../../store/familyTreeStore';
import './RichLoreText.css';

const parseInlineTokens = (rawText, onEntityHover, onEntityLeave, onEntityClick) => {
  if (!rawText || typeof rawText !== 'string') return rawText || '';

  const text = rawText
    .replace(/³(.*?)³/g, '*$1*')
    .replace(/³/g, '*')
    .replace(/Ã¢â‚¬â€\x9D/g, '"')
    .replace(/Ã¢â‚¬â€/g, '—')
    .replace(/Ã¢â‚¬â„¢/g, "'")
    .replace(/Ã¢â‚¬Å“/g, '"')
    .replace(/Ã¢â‚¬Â/g, '"')
    .replace(/â€”/g, '—')
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"');

  const regex = /(\[\[.*?\]\]|@[a-zA-Z0-9_-]+|\*\*.*?\*\*|\*.*?\*|<u>.*?<\/u>|__.*?__|~~.*?~~|==.*?==|`.*?`)/g;
  const elements = [];
  let lastIdx = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      elements.push(text.slice(lastIdx, match.index));
    }

    const token = match[0];

    // [[WikiLink]] or [[WikiLink|Alias]] or [[WikiLink#Section]] or [[WikiLink#Section|Alias]]
    if (token.startsWith('[[') && token.endsWith(']]')) {
      const rawInner = token.slice(2, -2).trim();
      let target = rawInner;
      let alias = null;
      let section = null;

      if (rawInner.includes('|')) {
        const parts = rawInner.split('|');
        target = parts[0].trim();
        alias = parts.slice(1).join('|').trim();
      }

      if (target.includes('#')) {
        const sParts = target.split('#');
        target = sParts[0].trim();
        section = sParts.slice(1).join('#').trim();
      }

      const displayText = alias || rawInner.split('|')[0].trim();
      const isResolved = universalEntityService.hasEntity(target);

      elements.push(
        <span
          key={`wiki-${match.index}`}
          className={`rich-wikilink ${!isResolved ? 'phantom-link' : ''}`}
          data-target={target}
          data-section={section || ''}
          onMouseEnter={(e) => onEntityHover(target, e, isResolved)}
          onMouseLeave={onEntityLeave}
          onClick={(e) => {
            e.stopPropagation();
            onEntityClick(target, isResolved, section);
          }}
          title={isResolved ? `Navigate to ${target}` : `"${target}" (Not yet defined - click to create)`}
        >
          <i className={`fas ${isResolved ? 'fa-bookmark' : 'fa-feather-pointed'} wikilink-icon`}></i>
          {displayText}
          {!isResolved && <span className="phantom-badge">+</span>}
        </span>
      );
    }
    // @Mention
    else if (token.startsWith('@')) {
      const mentionName = token.slice(1);
      elements.push(
        <span key={`mention-${match.index}`} className="rich-mention-chip">
          <i className="fas fa-at"></i>
          {mentionName}
        </span>
      );
    }
    // **Bold**
    else if (token.startsWith('**') && token.endsWith('**')) {
      elements.push(<strong key={`b-${match.index}`} className="rich-bold">{token.slice(2, -2)}</strong>);
    }
    // *Italic*
    else if (token.startsWith('*') && token.endsWith('*')) {
      elements.push(<em key={`i-${match.index}`} className="rich-italic">{token.slice(1, -1)}</em>);
    }
    // ==Highlight==
    else if (token.startsWith('==') && token.endsWith('==')) {
      elements.push(<mark key={`h-${match.index}`} className="rich-highlight">{token.slice(2, -2)}</mark>);
    }
    // <u>Underline</u> or __Underline__
    else if (token.startsWith('<u>') && token.endsWith('</u>')) {
      elements.push(<u key={`u-${match.index}`} className="rich-underline">{token.slice(3, -4)}</u>);
    }
    else if (token.startsWith('__') && token.endsWith('__')) {
      elements.push(<u key={`u2-${match.index}`} className="rich-underline">{token.slice(2, -2)}</u>);
    }
    // ~~Strikethrough~~
    else if (token.startsWith('~~') && token.endsWith('~~')) {
      elements.push(<s key={`s-${match.index}`} className="rich-strike">{token.slice(2, -2)}</s>);
    }
    // `Inline Code`
    else if (token.startsWith('`') && token.endsWith('`')) {
      elements.push(<code key={`c-${match.index}`} className="rich-inline-code">{token.slice(1, -1)}</code>);
    } else {
      elements.push(token);
    }

    lastIdx = match.index + token.length;
  }

  if (lastIdx < text.length) {
    elements.push(text.slice(lastIdx));
  }

  return elements.length > 0 ? elements : text;
};

const BLOCK_HEADERS = {
  readaloud: { icon: 'fa-book-open-reader', label: 'Read Aloud', className: 'block-readaloud' },
  gmnote: { icon: 'fa-eye-slash', label: 'GM Secret Note', className: 'block-gmnote' },
  dmnote: { icon: 'fa-eye-slash', label: 'GM Secret Note', className: 'block-gmnote' },
  secret: { icon: 'fa-lock', label: 'Campaign Secret', className: 'block-secret' },
  statblock: { icon: 'fa-shield-halved', label: 'Stat Block', className: 'block-statblock' },
  spell: { icon: 'fa-wand-magic-sparkles', label: 'Spell Formula', className: 'block-spell' },
  magic: { icon: 'fa-hat-wizard', label: 'Arcane Rite', className: 'block-spell' },
  ability: { icon: 'fa-hand-sparkles', label: 'Special Ability', className: 'block-statblock' },
  quest: { icon: 'fa-scroll', label: 'Quest Hook', className: 'block-quest' },
  npc: { icon: 'fa-user-ninja', label: 'NPC Profile', className: 'block-npc' },
  settlement: { icon: 'fa-city', label: 'Settlement & Realm', className: 'block-settlement' },
  faction: { icon: 'fa-flag', label: 'Faction & Order', className: 'block-faction' },
  loot: { icon: 'fa-gem', label: 'Loot & Relics', className: 'block-loot' },
  relic: { icon: 'fa-wand-magic-sparkles', label: 'Relic & Artifact', className: 'block-loot' },
  timeline: { icon: 'fa-hourglass-half', label: 'Chronicle Event', className: 'block-timeline' },
  hazard: { icon: 'fa-triangle-exclamation', label: 'Hazard & Trap', className: 'block-hazard' }
};

// Render Statblock with structured TTRPG components
const renderStatblockContent = (lines, handleEntityHover, handleEntityLeave, onEntityClick) => {
  const elements = [];
  let i = 0;

  const ATTR_REGEX = /^(STR|AGI|CON|INT|SPI|CHA|WIS|DEX|WIL|PER|MIG|RES):\s*([^\n\r]+)$/i;
  const VITALS_REGEX = /^(HP|Mana|AP|Speed|DR|Ward|Defenses|Defense|Armor):\s*(.+)$/i;
  const ACTION_REGEX = /^(Passive|Action|Reaction|Bonus Action|Legendary Action|Free Action|Spell|Magic|Feature|Trait)\s*(\([^)]+\))?\s*[-–—:]\s*(.+?):\s*(.+)$/i;

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      elements.push(<div key={`sb-sp-${i}`} className="rich-spacer-sm" />);
      i++;
      continue;
    }

    // Divider
    if (line === '---' || line === '***' || line === '___') {
      elements.push(
        <div key={`sb-div-${i}`} className="statblock-divider">
          <span className="statblock-divider-diamond">♦</span>
        </div>
      );
      i++;
      continue;
    }

    // Classification / Subtitle
    if (/^classification:\s*(.+)$/i.test(line)) {
      const match = line.match(/^classification:\s*(.+)$/i);
      elements.push(
        <div key={`sb-cls-${i}`} className="statblock-classification">
          {parseInlineTokens(match[1].trim(), handleEntityHover, handleEntityLeave, onEntityClick)}
        </div>
      );
      i++;
      continue;
    }

    // Group Attributes (STR, AGI, CON, INT, SPI, CHA, etc.)
    if (ATTR_REGEX.test(line)) {
      const attrGroup = [];
      while (i < lines.length && ATTR_REGEX.test(lines[i].trim())) {
        const match = lines[i].trim().match(ATTR_REGEX);
        if (match) {
          const name = match[1].toUpperCase();
          const fullVal = match[2].trim();
          // Extract score and mod like "16 (+3)" or just "16"
          const valMatch = fullVal.match(/^(\d+)\s*(\([+-]?\d+\))?$/);
          const score = valMatch ? valMatch[1] : fullVal;
          const mod = valMatch && valMatch[2] ? valMatch[2] : '';
          attrGroup.push({ name, score, mod, fullVal });
        }
        i++;
      }
      elements.push(
        <div key={`sb-attrs-${i}`} className="statblock-attributes-grid">
          {attrGroup.map((attr, aIdx) => (
            <div key={aIdx} className="statblock-attr-card">
              <span className="attr-name">{attr.name}</span>
              <span className="attr-score">{attr.score}</span>
              {attr.mod && <span className="attr-mod">{attr.mod}</span>}
            </div>
          ))}
        </div>
      );
      continue;
    }

    // Group Core Vitals (HP, Mana, AP, Speed, DR, Ward, etc.)
    if (VITALS_REGEX.test(line)) {
      const vitalsGroup = [];
      while (i < lines.length && VITALS_REGEX.test(lines[i].trim())) {
        const match = lines[i].trim().match(VITALS_REGEX);
        if (match) {
          vitalsGroup.push({ key: match[1], val: match[2].trim() });
        }
        i++;
      }
      elements.push(
        <div key={`sb-vitals-${i}`} className="statblock-vitals-row">
          {vitalsGroup.map((v, vIdx) => {
            const kLower = v.key.toLowerCase();
            const iconClass =
              kLower === 'hp' ? 'fa-heart' :
              kLower === 'mana' ? 'fa-droplet' :
              kLower === 'ap' ? 'fa-bolt' :
              (kLower === 'dr' || kLower === 'armor' || kLower === 'defense') ? 'fa-shield-halved' :
              kLower === 'ward' ? 'fa-shield-virus' :
              'fa-person-running';
            return (
              <div key={vIdx} className={`statblock-vital vital-${kLower}`}>
                <i className={`fas ${iconClass}`}></i>
                <span className="vital-label">{v.key}:</span>
                <strong className="vital-value">{v.val}</strong>
              </div>
            );
          })}
        </div>
      );
      continue;
    }

    // Abilities & Actions (e.g. "Passive - Rime-Bond: ...", "Action (2 AP) - Cleave: ...", "Spell (3 AP, 15 Mana) - Glacial Lance: ...")
    if (ACTION_REGEX.test(line)) {
      const actionMatch = line.match(ACTION_REGEX);
      const actionType = actionMatch[1];
      const actionCost = actionMatch[2] ? actionMatch[2].trim() : '';
      const actionName = actionMatch[3].trim();
      const actionDesc = actionMatch[4].trim();
      const badgeType = actionType.toLowerCase().replace(/\s+/g, '-');

      const actionIcon =
        badgeType === 'spell' || badgeType === 'magic' ? 'fa-wand-magic-sparkles' :
        badgeType === 'reaction' ? 'fa-bolt-lightning' :
        badgeType === 'passive' || badgeType === 'trait' ? 'fa-shield-heart' :
        badgeType === 'bonus-action' ? 'fa-plus' :
        badgeType === 'free-action' ? 'fa-feather' :
        badgeType === 'legendary-action' ? 'fa-crown' :
        'fa-hand-sparkles';

      elements.push(
        <div key={`sb-act-${i}`} className={`statblock-ability-card card-${badgeType}`}>
          <div className="ability-card-header">
            <span className={`ability-type-badge badge-${badgeType}`}>
              <i className={`fas ${actionIcon}`}></i>
              <span>{actionType.toUpperCase()}{actionCost ? ` • ${actionCost.replace(/[()]/g, '')}` : ''}</span>
            </span>
            <span className="ability-card-title">{actionName}</span>
          </div>
          <div className="ability-card-desc">
            {parseInlineTokens(actionDesc, handleEntityHover, handleEntityLeave, onEntityClick)}
          </div>
        </div>
      );
      i++;
      continue;
    }

    // General Key-Value lines (Threat:, Resist:, Weakness:, etc.)
    const kvMatch = line.match(/^([A-Za-z0-9\s]+):\s*(.+)$/);
    if (kvMatch) {
      const k = kvMatch[1].trim();
      const v = kvMatch[2].trim();
      elements.push(
        <div key={`sb-kv-${i}`} className="statblock-kv-row">
          <strong className="statblock-kv-label">{k}:</strong>
          <span className="statblock-kv-val">
            {parseInlineTokens(v, handleEntityHover, handleEntityLeave, onEntityClick)}
          </span>
        </div>
      );
      i++;
      continue;
    }

    // Default line
    elements.push(
      <p key={`sb-p-${i}`} className="statblock-paragraph">
        {parseInlineTokens(line, handleEntityHover, handleEntityLeave, onEntityClick)}
      </p>
    );
    i++;
  }

  return elements;
};

// Unified renderer for other TTRPG blocks (spell, quest, npc, loot, hazard, readaloud, gmnote)
const renderStructuredBlockContent = (blockType, lines, handleEntityHover, handleEntityLeave, onEntityClick) => {
  if (blockType === 'statblock') {
    return renderStatblockContent(lines, handleEntityHover, handleEntityLeave, onEntityClick);
  }

  const elements = [];
  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();
    if (!line) {
      elements.push(<div key={`sp-${idx}`} className="rich-spacer-sm" />);
      return;
    }

    if (line === '---' || line === '***' || line === '___') {
      elements.push(
        <div key={`div-${idx}`} className="statblock-divider">
          <span className="statblock-divider-diamond">♦</span>
        </div>
      );
      return;
    }

    // Spell & Arcane Rite blocks
    if (blockType === 'spell' || blockType === 'magic') {
      // Pipe separated metrics (e.g. "School: Cryomancy | Tier: 2" or "Cast: 2 AP | Cost: 15 Mana | Range: 45 ft.")
      if (line.includes('|')) {
        const segments = line.split('|').map(s => s.trim()).filter(s => s);
        elements.push(
          <div key={`sp-met-${idx}`} className="spell-metrics-row">
            {segments.map((seg, sIdx) => {
              const segKv = seg.match(/^([^:]+):\s*(.+)$/);
              if (segKv) {
                const segKey = segKv[1].trim();
                const segVal = segKv[2].trim();
                const skLower = segKey.toLowerCase();
                const segIcon =
                  skLower === 'school' ? 'fa-hat-wizard' :
                  skLower === 'tier' ? 'fa-layer-group' :
                  skLower === 'cast' || skLower === 'action' ? 'fa-bolt' :
                  skLower === 'cost' || skLower === 'mana' ? 'fa-droplet' :
                  skLower === 'range' ? 'fa-location-crosshairs' :
                  skLower === 'target' ? 'fa-bullseye' :
                  skLower === 'duration' ? 'fa-hourglass' :
                  'fa-star';
                return (
                  <div key={sIdx} className={`spell-metric-chip chip-${skLower}`}>
                    <i className={`fas ${segIcon}`}></i>
                    <span className="metric-label">{segKey}:</span>
                    <strong className="metric-val">{segVal}</strong>
                  </div>
                );
              }
              return (
                <div key={sIdx} className="spell-metric-chip">
                  <span>{seg}</span>
                </div>
              );
            })}
          </div>
        );
        return;
      }

      // Empower / Upcast
      const empMatch = line.match(/^(Empower|Upcast|Overcharge)\s*(\([^)]+\))?:\s*(.+)$/i);
      if (empMatch) {
        const empType = empMatch[1];
        const empCost = empMatch[2] ? ` ${empMatch[2]}` : '';
        const empText = empMatch[3];
        elements.push(
          <div key={`sp-emp-${idx}`} className="spell-empower-box">
            <span className="spell-empower-badge">
              <i className="fas fa-wand-magic-sparkles"></i>
              {empType.toUpperCase()}{empCost}:
            </span>
            <span className="spell-empower-text">
              {parseInlineTokens(empText, handleEntityHover, handleEntityLeave, onEntityClick)}
            </span>
          </div>
        );
        return;
      }

      // Effect row
      if (/^effect:\s*(.+)$/i.test(line)) {
        const effText = line.slice(7).trim();
        elements.push(
          <div key={`sp-eff-${idx}`} className="spell-effect-box">
            <span className="spell-effect-badge">
              <i className="fas fa-sparkles"></i> EFFECT:
            </span>
            <span className="spell-effect-text">
              {parseInlineTokens(effText, handleEntityHover, handleEntityLeave, onEntityClick)}
            </span>
          </div>
        );
        return;
      }
    }

    // Quest block key-value lines
    if (blockType === 'quest') {
      const qMatch = line.match(/^(Objective|Reward|Rewards|Giver|Location|Prerequisite|Prerequisites|Penalty):\s*(.+)$/i);
      if (qMatch) {
        const key = qMatch[1];
        const val = qMatch[2];
        const isReward = /^rewards?$/i.test(key);
        const isObj = /^objective$/i.test(key);
        elements.push(
          <div key={`q-${idx}`} className={`block-entry-row quest-row ${isReward ? 'is-reward' : ''}`}>
            <span className={`entry-badge ${isReward ? 'badge-reward' : isObj ? 'badge-objective' : 'badge-quest'}`}>
              <i className={`fas ${isReward ? 'fa-coins' : isObj ? 'fa-crosshairs' : 'fa-scroll'}`}></i>
              {key.toUpperCase()}:
            </span>
            <span className="entry-content">
              {parseInlineTokens(val, handleEntityHover, handleEntityLeave, onEntityClick)}
            </span>
          </div>
        );
        return;
      }
    }

    // NPC Profile block lines
    if (blockType === 'npc') {
      const nMatch = line.match(/^(Origin|Disposition|Quote|Role|Faction|Voice|Goal|Secret):\s*(.+)$/i);
      if (nMatch) {
        const key = nMatch[1];
        const val = nMatch[2];
        const isQuote = /^quote$/i.test(key);
        if (isQuote) {
          elements.push(
            <blockquote key={`npc-${idx}`} className="npc-quote-block">
              <i className="fas fa-quote-left npc-quote-icon"></i>
              <span>{parseInlineTokens(val.replace(/^["']|["']$/g, ''), handleEntityHover, handleEntityLeave, onEntityClick)}</span>
            </blockquote>
          );
          return;
        }
        elements.push(
          <div key={`npc-${idx}`} className="block-entry-row npc-row">
            <span className="entry-badge badge-npc">{key}:</span>
            <span className="entry-content">
              {parseInlineTokens(val, handleEntityHover, handleEntityLeave, onEntityClick)}
            </span>
          </div>
        );
        return;
      }
    }

    // Hazard block lines
    if (blockType === 'hazard') {
      const hMatch = line.match(/^(Trigger|Effect|Countermeasure|DC|Damage|Save|Disarm):\s*(.+)$/i);
      if (hMatch) {
        const key = hMatch[1];
        const val = hMatch[2];
        elements.push(
          <div key={`haz-${idx}`} className="block-entry-row hazard-row">
            <span className="entry-badge badge-hazard">{key}:</span>
            <span className="entry-content">
              {parseInlineTokens(val, handleEntityHover, handleEntityLeave, onEntityClick)}
            </span>
          </div>
        );
        return;
      }
    }

    // Loot bullet lines
    if (blockType === 'loot' || blockType === 'relic') {
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const itemText = line.slice(2).trim();
        elements.push(
          <div key={`loot-${idx}`} className="loot-item-row">
            <i className="fas fa-gem loot-gem-icon"></i>
            <span className="loot-text">
              {parseInlineTokens(itemText, handleEntityHover, handleEntityLeave, onEntityClick)}
            </span>
          </div>
        );
        return;
      }
    }

    // Readaloud narrative
    if (blockType === 'readaloud') {
      elements.push(
        <div key={`ra-${idx}`} className="readaloud-paragraph">
          {parseInlineTokens(line, handleEntityHover, handleEntityLeave, onEntityClick)}
        </div>
      );
      return;
    }

    // Default general line with Key: Value detection
    const kvMatch = line.match(/^([A-Za-z0-9\s]+):\s*(.+)$/);
    if (kvMatch) {
      elements.push(
        <div key={`gen-${idx}`} className="block-entry-row">
          <strong className="entry-label">{kvMatch[1].trim()}:</strong>
          <span className="entry-content">
            {parseInlineTokens(kvMatch[2].trim(), handleEntityHover, handleEntityLeave, onEntityClick)}
          </span>
        </div>
      );
      return;
    }

    elements.push(
      <p key={`p-${idx}`}>
        {parseInlineTokens(line, handleEntityHover, handleEntityLeave, onEntityClick)}
      </p>
    );
  });

  return elements;
};

const RichLoreText = ({ 
  text, 
  stripGMNotes = false, 
  className = '', 
  onEntityClick = null 
}) => {
  const [hoverState, setHoverState] = useState({ active: false, name: '', pos: null });
  const hoverTimerRef = useRef(null);

  const handleSmartEntityClick = (entityName, isResolved = true, section = null) => {
    if (onEntityClick) {
      onEntityClick(entityName, isResolved, section);
      return;
    }

    const resolved = universalEntityService.getEntity(entityName);
    if (!resolved) {
      window.dispatchEvent(new CustomEvent('mythrill_quick_peek', { detail: { name: entityName, isPhantom: true, section } }));
      window.dispatchEvent(new CustomEvent('mythrill_open_world_dossier', { detail: { name: entityName, isPhantom: true } }));
      return;
    }

    window.dispatchEvent(new CustomEvent('mythrill_quick_peek', { detail: { ...resolved, section } }));

    if (resolved.type === 'map' || resolved.type === 'map_pin') {
      useInteractiveMapStore.getState().openStudio(resolved.mapId || resolved.id, resolved.type === 'map_pin' ? resolved.id : null);
    } else if (resolved.type === 'dynasty') {
      useFamilyTreeStore.getState().openStudio(resolved.id);
    } else if (resolved.type === 'note' || resolved.type === 'orb') {
      window.dispatchEvent(new CustomEvent('mythrill_navigate_journal', { detail: { noteId: resolved.raw?.id || resolved.id } }));
    } else if (resolved.type === 'npc' || resolved.type === 'quest' || resolved.type === 'campaign_location' || resolved.type === 'plot') {
      window.dispatchEvent(new CustomEvent('mythrill_navigate_campaign', { detail: { entityType: resolved.type, entityId: resolved.id } }));
    } else if (resolved.type === 'location' || resolved.type === 'region') {
      window.dispatchEvent(new CustomEvent('mythrill_navigate_map', { detail: resolved }));
    } else {
      window.dispatchEvent(new CustomEvent('mythrill_open_world_dossier', { detail: resolved }));
    }
  };

  const handleEntityHover = (name, e) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverState({
      active: true,
      name,
      pos: {
        x: rect.left,
        y: rect.bottom,
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        width: rect.width,
        height: rect.height
      }
    });
  };

  const handleEntityLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setHoverState({ active: false, name: '', pos: null });
    }, 280);
  };

  const handleCardMouseEnter = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  };

  const handleCardMouseLeave = () => {
    handleEntityLeave();
  };

  if (!text || typeof text !== 'string') {
    return <div className={`rich-lore-container ${className}`}>{text || ''}</div>;
  }

  // Parse fenced :::block blocks
  const lines = text.split('\n');
  const renderedElements = [];
  let inBlock = false;
  let currentBlockType = '';
  let currentBlockTitle = '';
  let currentBlockLines = [];

  const flushBlock = (idx) => {
    if (!currentBlockType || currentBlockLines.length === 0) return;

    if (stripGMNotes && (currentBlockType === 'gmnote' || currentBlockType === 'dmnote' || currentBlockType === 'secret')) {
      // Omit secret GM notes for player views
      currentBlockLines = [];
      currentBlockType = '';
      currentBlockTitle = '';
      return;
    }

    const config = BLOCK_HEADERS[currentBlockType] || {
      icon: 'fa-bookmark',
      label: currentBlockType.toUpperCase(),
      className: 'block-generic'
    };

    const isStatblock = currentBlockType === 'statblock';

    renderedElements.push(
      <div key={`block-${idx}`} className={`rich-block ${config.className}`}>
        <div className="rich-block-header">
          <div className="rich-block-header-left">
            <i className={`fas ${config.icon}`}></i>
            <span className="rich-block-badge">{config.label}</span>
            {currentBlockTitle && (
              <span className="rich-block-title">{currentBlockTitle}</span>
            )}
          </div>
        </div>
        <div className="rich-block-body">
          {renderStructuredBlockContent(currentBlockType, currentBlockLines, handleEntityHover, handleEntityLeave, onEntityClick)}
        </div>
      </div>
    );

    currentBlockLines = [];
    currentBlockType = '';
    currentBlockTitle = '';
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed.startsWith(':::')) {
      if (inBlock) {
        flushBlock(idx);
        inBlock = false;
      } else {
        inBlock = true;
        const blockContent = trimmed.slice(3).trim();
        const firstSpaceIdx = blockContent.indexOf(' ');
        if (firstSpaceIdx === -1) {
          currentBlockType = blockContent.toLowerCase() || 'readaloud';
          currentBlockTitle = '';
        } else {
          currentBlockType = blockContent.slice(0, firstSpaceIdx).toLowerCase();
          currentBlockTitle = blockContent.slice(firstSpaceIdx + 1).trim();
        }
      }
      return;
    }

    if (inBlock) {
      currentBlockLines.push(line);
      return;
    }

    // Markdown Horizontal Rule (---, ***, ___)
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      renderedElements.push(
        <div key={idx} className="rich-divider">
          <span className="rich-divider-line" />
          <span className="rich-divider-diamond">♦</span>
          <span className="rich-divider-line" />
        </div>
      );
      return;
    }

    // Markdown Headings
    if (trimmed.startsWith('# ')) {
      renderedElements.push(<h2 key={idx} className="rich-h1">{parseInlineTokens(trimmed.slice(2), handleEntityHover, handleEntityLeave, handleSmartEntityClick)}</h2>);
    } else if (trimmed.startsWith('## ')) {
      renderedElements.push(<h3 key={idx} className="rich-h2">{parseInlineTokens(trimmed.slice(3), handleEntityHover, handleEntityLeave, handleSmartEntityClick)}</h3>);
    } else if (trimmed.startsWith('### ')) {
      renderedElements.push(<h4 key={idx} className="rich-h3">{parseInlineTokens(trimmed.slice(4), handleEntityHover, handleEntityLeave, handleSmartEntityClick)}</h4>);
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      renderedElements.push(
        <li key={idx} className="rich-list-item">
          {parseInlineTokens(trimmed.slice(2), handleEntityHover, handleEntityLeave, handleSmartEntityClick)}
        </li>
      );
    } else if (trimmed === '') {
      renderedElements.push(<div key={idx} className="rich-spacer" />);
    } else {
      renderedElements.push(
        <p key={idx} className="rich-paragraph">
          {parseInlineTokens(line, handleEntityHover, handleEntityLeave, handleSmartEntityClick)}
        </p>
      );
    }
  });

  if (inBlock) {
    flushBlock(lines.length);
  }

  return (
    <div className={`rich-lore-container ${className}`}>
      {renderedElements}
      
      {hoverState.active && ReactDOM.createPortal(
        <EntityHovercard
          entityName={hoverState.name}
          position={hoverState.pos}
          onClose={() => setHoverState({ active: false, name: '', pos: null })}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
        />,
        document.body
      )}
    </div>
  );
};

export default RichLoreText;
