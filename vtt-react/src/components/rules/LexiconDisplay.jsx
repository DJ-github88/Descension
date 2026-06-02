import React, { useState, useMemo, useRef, useCallback } from 'react';
import { RULES_CATEGORIES } from '../../data/rulesData';
import LoreLink from '../common/LoreLink';
import { autoLinkTerminology } from '../../utils/loreAutoLinker';
import './LexiconDisplay.css';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const parseTerm = (section) => {
  const title = section.title || '';
  const pronunciationMatch = title.match(/\[Pronunciation:\s*(.+?)\]/);
  const pronunciation = pronunciationMatch ? pronunciationMatch[1] : null;
  const name = title.replace(/\s*\[Pronunciation:\s*.+?\]/, '').trim();
  return { name, pronunciation, content: section.content };
};

// Robust scanner/tokenizer that converts markdown and LoreLink markup into clickable React nodes
const parseTextWithLoreLinks = (text) => {
  if (!text || typeof text !== 'string') return null;

  // Auto-link all recognised dictionary terminology first
  const processedText = autoLinkTerminology(text);

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
          {parseTextWithLoreLinks(label)}
        </LoreLink>
      );
    } else if (match[4] !== undefined) {
      // Bold match: match[4] is the bold content
      const boldText = match[4];
      result.push(
        <strong key={`bold-${key++}`}>
          {parseTextWithLoreLinks(boldText)}
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

const LexiconDisplay = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTerms, setExpandedTerms] = useState(new Set());
  const [activeLetter, setActiveLetter] = useState(null);
  const letterRefs = useRef({});
  const mainRef = useRef(null);

  const allTerms = useMemo(() => {
    const lexiconSub = RULES_CATEGORIES
      .find(c => c.id === 'world-lore')
      ?.subcategories?.find(s => s.id === 'lexicon');
    const sections = lexiconSub?.content?.sections || [];
    return sections.map(parseTerm);
  }, []);

  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) return allTerms;
    const q = searchQuery.toLowerCase();
    return allTerms.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.content.toLowerCase().includes(q)
    );
  }, [allTerms, searchQuery]);

  const groupedTerms = useMemo(() => {
    const groups = {};
    filteredTerms.forEach(term => {
      const firstLetter = /^[A-Z]/i.test(term.name)
        ? term.name.charAt(0).toUpperCase()
        : '#';
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const availableLetters = useMemo(() => {
    if (!searchQuery.trim()) {
      const letters = new Set();
      allTerms.forEach(t => {
        if (/^[A-Z]/i.test(t.name)) letters.add(t.name.charAt(0).toUpperCase());
      });
      return ALPHABET.filter(l => letters.has(l));
    }
    return ALPHABET.filter(l => groupedTerms[l]);
  }, [allTerms, searchQuery, groupedTerms]);

  const toggleTerm = useCallback((termName) => {
    setExpandedTerms(prev => {
      const next = new Set(prev);
      if (next.has(termName)) {
        next.delete(termName);
      } else {
        next.add(termName);
      }
      return next;
    });
  }, []);

  const scrollToLetter = useCallback((letter) => {
    setActiveLetter(letter);
    const el = letterRefs.current[letter];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="lexicon-display">
      <div className="lexicon-hero">
        <div className="lexicon-hero-content">
          <h2 className="lexicon-title">The Mythrill Lexicon</h2>
          <p className="lexicon-subtitle">Pronunciation Guide &amp; Comprehensive Terminology</p>
          <div className="lexicon-search-wrapper">
            <span className="lexicon-search-icon"><i className="fas fa-search"></i></span>
            <input
              type="text"
              className="lexicon-search-input"
              placeholder="Search terms, races, phenomena..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="lexicon-search-clear"
                onClick={handleClearSearch}
                title="Clear search"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          {searchQuery && (
            <span className="lexicon-result-count">
              {filteredTerms.length} term{filteredTerms.length !== 1 ? 's' : ''} found
            </span>
          )}
        </div>
      </div>

      <div className="lexicon-layout">
        <nav className="lexicon-sidebar">
          <h4 className="lexicon-sidebar-title">Quick Jump</h4>
          <div className="lexicon-alphabet">
            {ALPHABET.map(letter => {
              const hasTerms = availableLetters.includes(letter);
              return (
                <button
                  key={letter}
                  className={`lexicon-letter-btn ${!hasTerms ? 'empty' : ''} ${activeLetter === letter ? 'active' : ''}`}
                  disabled={!hasTerms}
                  onClick={() => scrollToLetter(letter)}
                  title={hasTerms ? `Jump to ${letter}` : ''}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="lexicon-main" ref={mainRef}>
          {filteredTerms.length === 0 ? (
            <div className="lexicon-empty">
              <i className="fas fa-search lexicon-empty-icon"></i>
              <p>No terms match "{searchQuery}"</p>
              <button className="lexicon-empty-btn" onClick={handleClearSearch}>
                Clear Search
              </button>
            </div>
          ) : (
            ALPHABET.filter(l => groupedTerms[l]).map(letter => (
              <div
                key={letter}
                className="lexicon-letter-group"
                ref={el => { letterRefs.current[letter] = el; }}
              >
                <h3 className="lexicon-letter-header">{letter}</h3>
                <div className="lexicon-term-grid">
                  {groupedTerms[letter].map(term => {
                    const isExpanded = expandedTerms.has(term.name);
                    return (
                      <div
                        key={term.name}
                        className={`lexicon-term-card ${isExpanded ? 'expanded' : ''}`}
                      >
                        <div
                          className="lexicon-term-header"
                          onClick={() => toggleTerm(term.name)}
                        >
                          <div className="lexicon-term-name-row">
                            <span className="lexicon-term-name">{term.name}</span>
                            {term.pronunciation && (
                              <span className="lexicon-term-pronunciation">
                                {term.pronunciation}
                              </span>
                            )}
                          </div>
                          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} lexicon-term-chevron`}></i>
                        </div>
                        {isExpanded && (
                          <div className="lexicon-term-content">
                            <div className="lexicon-term-definition">
                              {term.content.split('\n\n').map((para, pIdx) => (
                                <p key={pIdx} style={{ margin: pIdx > 0 ? '1em 0 0 0' : 0 }}>
                                  {parseTextWithLoreLinks(para)}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LexiconDisplay;
