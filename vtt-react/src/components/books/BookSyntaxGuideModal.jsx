import React, { useState } from 'react';
import './BookDocumentEditor.css';
import './BookAtmosphere.css';

const SYNTAX_SECTIONS = [
  {
    id: 'headings',
    label: 'Lead-ins & Headings',
    icon: 'fa-heading',
    items: [
      {
        title: 'TTRPG Bold Lead-In Heading',
        badge: 'Standard Run-In',
        syntax: '**Floor Trap.** The flagstone is counter-weighted by ancient lead pulleys...',
        preview: 'Floor Trap. The flagstone is counter-weighted by ancient lead pulleys...',
        previewType: 'bold-lead-in',
        explanation: 'In professional TTRPG adventure writing, bold run-in headings are used inside paragraphs to title room features, traps, hazards, tactical actions, or loot piles without breaking into a giant H1/H2 header.',
        snippet: '**Floor Trap.** A DC 14 Perception check reveals pressure grooves along the stones.'
      },
      {
        title: 'Tactical Creature / NPC Action',
        badge: 'Combat Action',
        syntax: '**Glacial Rend.** *Melee Attack:* +6 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) cold damage.',
        preview: 'Glacial Rend. Melee Attack: +6 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) cold damage.',
        previewType: 'bold-lead-in',
        explanation: 'Used for monster, NPC, or trap action descriptions that combine bold titles with italic attack mechanics.',
        snippet: '**Glacial Rend.** *Melee Attack:* +6 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) cold damage.'
      }
    ]
  },
  {
    id: 'lore',
    label: 'Lore & Wikilinks',
    icon: 'fa-feather-pointed',
    items: [
      {
        title: 'Campaign Lore Wiki-Link',
        badge: 'Interactive Wikilink',
        syntax: 'The altar was consecrated by [[Gref the Memory-Merchant]] using the [[Chromatic Keystone]].',
        preview: 'The altar was consecrated by [[Gref the Memory-Merchant]] using the [[Chromatic Keystone]].',
        previewType: 'wikilink',
        explanation: 'Connecting terms in [[Double Brackets]] links them directly to your Story Bible, Map Pins, NPCs, and Compendium. Hovering opens an instant preview card; clicking opens the dossier or lets you create a draft entity with one click.',
        snippet: '[[Chromatic Keystone]]'
      },
      {
        title: 'Aliased Wiki-Link (Custom Display)',
        badge: 'Piped Link',
        syntax: 'Deep beneath [[Frostwood Reach|the frozen northern woods]], silence reigned.',
        preview: 'Deep beneath the frozen northern woods, silence reigned.',
        previewType: 'aliased-link',
        explanation: 'Use the pipe character (|) to link to an established lore entity while displaying alternate narrative wording in your book text.',
        snippet: '[[Frostwood Reach|the frozen northern woods]]'
      }
    ]
  },
  {
    id: 'emphasis',
    label: 'Emphasis & Spells',
    icon: 'fa-italic',
    items: [
      {
        title: 'Spells & Incantations',
        badge: 'Italics',
        syntax: 'The cultist immediately casts *misty step* followed by a whispered *silence*.',
        preview: 'The cultist immediately casts misty step followed by a whispered silence.',
        previewType: 'italic',
        explanation: 'TTRPG standard notation specifies that spell names, magical rituals, monster sizes, and foreign tongues are written in italics.',
        snippet: '*misty step*'
      },
      {
        title: 'Dice Rolls & Shorthand',
        badge: 'Inline Code',
        syntax: 'Disarming the lock requires a successful `DC 15 Dexterity (Thieves\' Tools)` check.',
        preview: 'Disarming the lock requires a successful DC 15 Dexterity (Thieves\' Tools) check.',
        previewType: 'code',
        explanation: 'Wrap dice expressions, DC thresholds, and rule mechanics in backticks (`) for crisp monospaced presentation.',
        snippet: '`DC 15 Dexterity`'
      },
      {
        title: 'Boxed Flavor Highlight',
        badge: 'Highlight',
        syntax: 'The chest contains ==500 gp and a sapphire ring== wrapped in silk.',
        preview: 'The chest contains 500 gp and a sapphire ring wrapped in silk.',
        previewType: 'highlight',
        explanation: 'Use double equals (==) to draw immediate GM attention to vital loot, clues, or immediate threats.',
        snippet: '==500 gp and a sapphire ring=='
      }
    ]
  },
  {
    id: 'blocks',
    label: 'Narrative & Secrets',
    icon: 'fa-scroll',
    items: [
      {
        title: 'Boxed Read-Aloud Narrative',
        badge: 'Read Aloud Block',
        syntax: ':::readaloud\nThe heavy iron doors grind open, revealing a cavern glittering with hoarfrost.\n:::',
        preview: 'The heavy iron doors grind open, revealing a cavern glittering with hoarfrost.',
        previewType: 'readaloud',
        explanation: 'Enclosing paragraphs in :::readaloud creates shaded, italicized narrative passages meant to be read directly to players upon entering an area.',
        snippet: ':::readaloud\nThe heavy iron doors grind open, revealing a cavern glittering with hoarfrost.\n:::'
      },
      {
        title: 'GM Campaign Secret Note',
        badge: 'GM Eyes Only',
        syntax: ':::secret\nThe merchant is an undercover spy answering directly to the Obsidian Throne.\n:::',
        preview: 'The merchant is an undercover spy answering directly to the Obsidian Throne.',
        previewType: 'secret',
        explanation: 'Blocks marked with :::secret are sealed from player eyes and automatically redacted when exporting or viewing in player compendium mode.',
        snippet: ':::secret\nThe merchant is an undercover spy answering directly to the Obsidian Throne.\n:::'
      }
    ]
  }
];

export const BookSyntaxGuideModal = ({
  isOpen,
  onClose,
  onInsertSnippet
}) => {
  const [activeTab, setActiveTab] = useState('headings');
  const [copiedSnippet, setCopiedSnippet] = useState(null);

  if (!isOpen) return null;

  const currentSection = SYNTAX_SECTIONS.find((s) => s.id === activeTab) || SYNTAX_SECTIONS[0];

  const handleCopyOrInsert = (snippet) => {
    if (onInsertSnippet) {
      onInsertSnippet(snippet);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(snippet);
    }
    setCopiedSnippet(snippet);
    setTimeout(() => setCopiedSnippet(null), 1800);
  };

  return (
    <div className="book-modal-backdrop" onClick={onClose}>
      <div
        className="book-modal-dialog book-syntax-guide-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="syntax-guide-title"
      >
        {/* Header */}
        <div className="book-modal-header syntax-guide-header">
          <div className="modal-title-group">
            <span className="modal-icon-badge">
              <i className="fas fa-feather-pointed"></i>
            </span>
            <div className="modal-title-text">
              <h3 id="syntax-guide-title" className="modal-title">TTRPG Manuscript Typography & Syntax</h3>
              <p className="modal-subtitle">Intuitive rules for bold lead-ins, entity wikilinks, and adventure notation</p>
            </div>
          </div>
          <button
            type="button"
            className="book-modal-close"
            onClick={onClose}
            aria-label="Close Syntax Guide"
            title="Close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Tab Selector */}
        <div className="syntax-guide-tabs">
          {SYNTAX_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              className={`syntax-tab-btn ${activeTab === sec.id ? 'active' : ''}`}
              onClick={() => setActiveTab(sec.id)}
            >
              <i className={`fas ${sec.icon}`}></i>
              <span>{sec.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="syntax-guide-body">
          <div className="syntax-items-grid">
            {currentSection.items.map((item, idx) => (
              <div key={idx} className="syntax-guide-card">
                <div className="card-top-row">
                  <div className="card-title-group">
                    <span className="card-badge">{item.badge}</span>
                    <h4 className="card-title">{item.title}</h4>
                  </div>
                  <button
                    type="button"
                    className="syntax-insert-btn"
                    onClick={() => handleCopyOrInsert(item.snippet)}
                    title={onInsertSnippet ? "Insert this snippet into active block" : "Copy syntax snippet"}
                  >
                    <i className={`fas ${copiedSnippet === item.snippet ? 'fa-check' : (onInsertSnippet ? 'fa-plus' : 'fa-copy')}`}></i>
                    <span>{copiedSnippet === item.snippet ? 'Inserted!' : (onInsertSnippet ? 'Insert' : 'Copy')}</span>
                  </button>
                </div>

                <p className="card-explanation">{item.explanation}</p>

                {/* Raw Markdown Box */}
                <div className="syntax-code-box">
                  <div className="syntax-code-label">How to write:</div>
                  <code>{item.syntax}</code>
                </div>

                {/* Rendered Preview Box */}
                <div className="syntax-preview-box">
                  <div className="syntax-preview-label">How it renders in your book:</div>
                  <div className="syntax-preview-content">
                    {item.previewType === 'bold-lead-in' && (
                      <p className="preview-prose">
                        <strong className="preview-bold-leadin">{item.preview.split('.')[0]}.</strong>
                        {item.preview.slice(item.preview.indexOf('.') + 1)}
                      </p>
                    )}
                    {item.previewType === 'wikilink' && (
                      <p className="preview-prose">
                        The altar was consecrated by <span className="preview-wikilink"><i className="fas fa-bookmark"></i> Gref the Memory-Merchant</span> using the <span className="preview-wikilink phantom"><i className="fas fa-feather-pointed"></i> Chromatic Keystone <span className="phantom-plus">+</span></span>.
                      </p>
                    )}
                    {item.previewType === 'aliased-link' && (
                      <p className="preview-prose">
                        Deep beneath <span className="preview-wikilink"><i className="fas fa-bookmark"></i> the frozen northern woods</span>, silence reigned.
                      </p>
                    )}
                    {item.previewType === 'italic' && (
                      <p className="preview-prose">
                        The cultist immediately casts <em className="preview-italic">misty step</em> followed by a whispered <em className="preview-italic">silence</em>.
                      </p>
                    )}
                    {item.previewType === 'code' && (
                      <p className="preview-prose">
                        Disarming the lock requires a successful <code className="preview-code">DC 15 Dexterity (Thieves' Tools)</code> check.
                      </p>
                    )}
                    {item.previewType === 'highlight' && (
                      <p className="preview-prose">
                        The chest contains <mark className="preview-highlight">500 gp and a sapphire ring</mark> wrapped in silk.
                      </p>
                    )}
                    {item.previewType === 'readaloud' && (
                      <div className="preview-readaloud">
                        <i className="fas fa-book-open-reader preview-readaloud-icon"></i>
                        <em>The heavy iron doors grind open, revealing a cavern glittering with hoarfrost.</em>
                      </div>
                    )}
                    {item.previewType === 'secret' && (
                      <div className="preview-secret">
                        <i className="fas fa-lock preview-secret-icon"></i>
                        <span>The merchant is an undercover spy answering directly to the Obsidian Throne.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="book-modal-footer syntax-guide-footer">
          <span className="syntax-guide-hint">
            <i className="fas fa-lightbulb"></i> Tip: You can also highlight any text in your book to see the one-click formatting bubble!
          </span>
          <button type="button" className="btn-book-primary syntax-done-btn" onClick={onClose}>
            <i className="fas fa-check"></i> Got It
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookSyntaxGuideModal;
