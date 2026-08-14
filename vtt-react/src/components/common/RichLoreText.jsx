import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import EntityHovercard from './EntityHovercard';
import './RichLoreText.css';

const parseInlineTokens = (text, onEntityHover, onEntityLeave, onEntityClick) => {
  if (!text || typeof text !== 'string') return text || '';

  const regex = /(\[\[.*?\]\]|@[a-zA-Z0-9_-]+|\*\*.*?\*\*|\*.*?\*|<u>.*?<\/u>|~~.*?~~|==.*?==)/g;
  const elements = [];
  let lastIdx = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      elements.push(text.slice(lastIdx, match.index));
    }

    const token = match[0];

    // [[WikiLink]]
    if (token.startsWith('[[') && token.endsWith(']]')) {
      const inner = token.slice(2, -2).trim();
      elements.push(
        <span
          key={`wiki-${match.index}`}
          className="rich-wikilink"
          onMouseEnter={(e) => onEntityHover(inner, e)}
          onMouseLeave={onEntityLeave}
          onClick={(e) => {
            e.stopPropagation();
            onEntityClick(inner);
          }}
        >
          <i className="fas fa-bookmark wikilink-icon"></i>
          {inner}
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
    // <u>Underline</u>
    else if (token.startsWith('<u>') && token.endsWith('</u>')) {
      elements.push(<u key={`u-${match.index}`} className="rich-underline">{token.slice(3, -4)}</u>);
    }
    // ~~Strikethrough~~
    else if (token.startsWith('~~') && token.endsWith('~~')) {
      elements.push(<s key={`s-${match.index}`} className="rich-strike">{token.slice(2, -2)}</s>);
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
  statblock: { icon: 'fa-shield-halved', label: 'Stat Block', className: 'block-statblock' },
  quest: { icon: 'fa-scroll', label: 'Quest Hook', className: 'block-quest' },
  npc: { icon: 'fa-user-ninja', label: 'NPC Profile', className: 'block-npc' },
  loot: { icon: 'fa-gem', label: 'Loot & Relics', className: 'block-loot' },
  hazard: { icon: 'fa-triangle-exclamation', label: 'Hazard & Trap', className: 'block-hazard' }
};

const RichLoreText = ({ 
  text, 
  stripGMNotes = false, 
  className = '', 
  onEntityClick = () => {} 
}) => {
  const [hoverState, setHoverState] = useState({ active: false, name: '', pos: { x: 0, y: 0 } });
  const hoverTimerRef = useRef(null);

  const handleEntityHover = (name, e) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverState({
      active: true,
      name,
      pos: { x: rect.left, y: rect.bottom }
    });
  };

  const handleEntityLeave = () => {
    hoverTimerRef.current = setTimeout(() => {
      setHoverState({ active: false, name: '', pos: { x: 0, y: 0 } });
    }, 250);
  };

  if (!text || typeof text !== 'string') {
    return <div className={`rich-lore-container ${className}`}>{text || ''}</div>;
  }

  // Parse fenced :::block blocks
  const lines = text.split('\n');
  const renderedElements = [];
  let inBlock = false;
  let currentBlockType = '';
  let currentBlockLines = [];

  const flushBlock = (idx) => {
    if (!currentBlockType || currentBlockLines.length === 0) return;

    if (stripGMNotes && (currentBlockType === 'gmnote' || currentBlockType === 'dmnote')) {
      // Omit secret GM notes for player views
      currentBlockLines = [];
      currentBlockType = '';
      return;
    }

    const config = BLOCK_HEADERS[currentBlockType] || {
      icon: 'fa-bookmark',
      label: currentBlockType.toUpperCase(),
      className: 'block-generic'
    };

    renderedElements.push(
      <div key={`block-${idx}`} className={`rich-block ${config.className}`}>
        <div className="rich-block-header">
          <i className={`fas ${config.icon}`}></i>
          <span>{config.label}</span>
        </div>
        <div className="rich-block-body">
          {currentBlockLines.map((line, lIdx) => (
            <p key={lIdx}>
              {parseInlineTokens(line, handleEntityHover, handleEntityLeave, onEntityClick)}
            </p>
          ))}
        </div>
      </div>
    );

    currentBlockLines = [];
    currentBlockType = '';
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed.startsWith(':::')) {
      if (inBlock) {
        flushBlock(idx);
        inBlock = false;
      } else {
        inBlock = true;
        currentBlockType = trimmed.slice(3).toLowerCase().trim() || 'readaloud';
      }
      return;
    }

    if (inBlock) {
      currentBlockLines.push(line);
      return;
    }

    // Markdown Headings
    if (trimmed.startsWith('# ')) {
      renderedElements.push(<h2 key={idx} className="rich-h1">{parseInlineTokens(trimmed.slice(2), handleEntityHover, handleEntityLeave, onEntityClick)}</h2>);
    } else if (trimmed.startsWith('## ')) {
      renderedElements.push(<h3 key={idx} className="rich-h2">{parseInlineTokens(trimmed.slice(3), handleEntityHover, handleEntityLeave, onEntityClick)}</h3>);
    } else if (trimmed.startsWith('### ')) {
      renderedElements.push(<h4 key={idx} className="rich-h3">{parseInlineTokens(trimmed.slice(4), handleEntityHover, handleEntityLeave, onEntityClick)}</h4>);
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      renderedElements.push(
        <li key={idx} className="rich-list-item">
          {parseInlineTokens(trimmed.slice(2), handleEntityHover, handleEntityLeave, onEntityClick)}
        </li>
      );
    } else if (trimmed === '') {
      renderedElements.push(<div key={idx} className="rich-spacer" />);
    } else {
      renderedElements.push(
        <p key={idx} className="rich-paragraph">
          {parseInlineTokens(line, handleEntityHover, handleEntityLeave, onEntityClick)}
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
          onClose={() => setHoverState({ active: false, name: '', pos: { x: 0, y: 0 } })}
        />,
        document.body
      )}
    </div>
  );
};

export default RichLoreText;
