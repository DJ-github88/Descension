import React, { useState, useRef } from 'react';
import RichLoreText from './RichLoreText';
import './CodexLoreEditor.css';

const CODEX_TEMPLATES = {
  readaloud: `:::readaloud
Frost clings to the ironwood beams as the heavy gates groan inward. Beyond the threshold, the warmth of an ancient thermal vent battles the biting mountain gale, mist swirling around stone monoliths etched with slumbering runes.
:::`,
  statblock: `:::statblock Frost-Warden of Nordhalla
Classification: Humanoid Elite (Glacial Guard)
Threat: Tier 2 (Dangerous)
HP: 75
Mana: 25
AP: 4
Speed: 30 ft.
Armor: 15 (Rime-Forged Plate)
Resist: Rime 50%, Cold 100%
Weakness: Ember
---
STR: 16 (+3)
AGI: 12 (+1)
CON: 15 (+2)
INT: 10 (+0)
SPI: 14 (+2)
CHA: 10 (+0)
---
Passive - Rime-Bond: Cannot be knocked prone on ice.
Action (2 AP) - Glacial Cleave: 2d8 + 3 Physical plus 1d6 Rime damage.
Reaction (1 AP) - Shield of Frost: Gain +3 Armor against the triggering attack.
:::`,
  gmnote: `:::gmnote
Secret Lore for GM Only:
The high priest secretly struck a bargain with House Skalvyr. If the party examines the altar with DC 14 Investigation, they uncover the concealed emblem of the Raven-Pact.
:::`,
  quest: `:::quest The Sunless Vigil
Objective: Recover the uncorrupted Ember-Core from the Sunken Foundry before the Frost-Corvani scavengers collapse the shaft.
Reward: 250 Gold, Sigil of the Forge-Guild, +1 Reputation with Sundale.
:::`,
  npc: `:::npc Skald Eirika
Origin: Nordhalla High Peaks
Disposition: Guarded but honorable
Quote: "The ice remembers every blood oath we broke when Sol closed his eyes."
:::`,
  loot: `:::loot
- 1x Glacial Core Fragment (Crafting Material)
- 45x Ancient Thalreth Silver Florins
- 1x Potion of Warm-Blood (Immunity to Hypothermia for 4 hours)
:::`,
  hazard: `:::hazard Whiteout Gale
Trigger: Entering the open ridge without guide lines.
Effect: Vision reduced to 5 ft. Every 10 minutes, characters must succeed on a CON 12 check or suffer 1 level of Frost-Strain.
:::`
};

const CodexLoreEditor = ({
  article,
  onUpdate,
  onDelete,
  className = ''
}) => {
  const [editorMode, setEditorMode] = useState('split'); // 'write' | 'split' | 'preview'
  const [showSensoryProfile, setShowSensoryProfile] = useState(false);
  const textareaRef = useRef(null);

  const insertFormatting = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = article.content || '';
    const selectedText = currentText.substring(start, end);

    let replacement = '';
    if (prefix.endsWith('\n') || prefix.startsWith('\n')) {
      replacement = `${prefix}${selectedText || 'text'}${suffix}`;
    } else {
      replacement = `${prefix}${selectedText || 'text'}${suffix}`;
    }

    const newContent = currentText.substring(0, start) + replacement + currentText.substring(end);
    onUpdate({ content: newContent });

    setTimeout(() => {
      textarea.focus();
      const newCursor = start + prefix.length + (selectedText ? selectedText.length : 4);
      textarea.setSelectionRange(newCursor, newCursor);
    }, 10);
  };

  const insertTemplate = (templateStr) => {
    const textarea = textareaRef.current;
    const currentText = article.content || '';
    const start = textarea ? textarea.selectionStart : currentText.length;
    const before = currentText.substring(0, start);
    const after = currentText.substring(start);
    const separator = before.endsWith('\n\n') || before === '' ? '' : '\n\n';

    const newContent = `${before}${separator}${templateStr}\n\n${after}`;
    onUpdate({ content: newContent });

    if (textarea) {
      setTimeout(() => {
        textarea.focus();
      }, 10);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onUpdate({ image: ev.target.result });
    reader.readAsDataURL(file);
  };

  const updateSensory = (sense, val) => {
    const sensory = { ...(article.sensory || {}), [sense]: val };
    onUpdate({ sensory });
  };

  return (
    <div className={`codex-lore-editor ${className}`}>
      {/* Top Banner Artwork */}
      <div className="codex-banner-container">
        {article.image ? (
          <div className="codex-banner-preview">
            <img src={article.image} alt={article.title} />
            <div className="codex-banner-overlay">
              <label className="codex-banner-btn" title="Change artwork">
                <i className="fas fa-camera"></i> Change Artwork
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
              </label>
              <button
                type="button"
                className="codex-banner-clear-btn"
                onClick={() => onUpdate({ image: null })}
                title="Remove artwork"
              >
                <i className="fas fa-trash-alt"></i> Remove
              </button>
            </div>
          </div>
        ) : (
          <label className="codex-banner-placeholder">
            <i className="fas fa-book-bookmark"></i>
            <span>Upload Lore Banner / Chronicle Artwork</span>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
          </label>
        )}
      </div>

      {/* Article Header & Metadata */}
      <div className="codex-meta-header">
        <div className="codex-title-row">
          <input
            type="text"
            value={article.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Article Title (e.g. The Siege of Ironspire, Blood-Pacts of Keth-Amar)..."
            className="codex-title-input"
          />
          {onDelete && (
            <button type="button" className="codex-delete-btn" onClick={onDelete} title="Delete Article">
              <i className="fas fa-trash-alt"></i>
            </button>
          )}
        </div>

        <div className="codex-meta-row">
          <div className="codex-meta-item">
            <label><i className="fas fa-layer-group"></i> Category:</label>
            <select
              value={article.category || 'history'}
              onChange={(e) => onUpdate({ category: e.target.value })}
              className="codex-select"
            >
              <option value="history">History & Chronicles</option>
              <option value="faction">Factions & Noble Houses</option>
              <option value="lineage">Lineages & Peoples</option>
              <option value="religion">Cosmology & Deities</option>
              <option value="location">Geography & Landmarks</option>
              <option value="magic">Magic & Arcane Artefacts</option>
              <option value="legend">Myths & Folktales</option>
            </select>
          </div>

          <div className="codex-meta-item">
            <label><i className="fas fa-tags"></i> Tags:</label>
            <input
              type="text"
              value={Array.isArray(article.tags) ? article.tags.join(', ') : (article.tags || '')}
              onChange={(e) => onUpdate({
                tags: e.target.value ? e.target.value.split(',').map(t => t.trim()).filter(t => t) : []
              })}
              placeholder="e.g. nordhalla, ancient, frost giants, war..."
              className="codex-tags-input"
            />
          </div>

          <div className="codex-meta-item">
            <label className="codex-secret-toggle" title="Hide content from player journals and handouts">
              <input
                type="checkbox"
                checked={article.isSecret || false}
                onChange={(e) => onUpdate({ isSecret: e.target.checked })}
              />
              <i className={`fas ${article.isSecret ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              <span>{article.isSecret ? 'GM Secret' : 'Public Lore'}</span>
            </label>
          </div>

          <button
            type="button"
            className={`codex-sensory-toggle-btn ${showSensoryProfile ? 'active' : ''}`}
            onClick={() => setShowSensoryProfile(!showSensoryProfile)}
            title="Configure 5-Sense Immersion Profile"
          >
            <i className="fas fa-wind"></i> 5-Sense Profile {showSensoryProfile ? '▲' : '▼'}
          </button>
        </div>

        {/* 5-Sense Profile Drawer */}
        {showSensoryProfile && (
          <div className="codex-sensory-drawer">
            <div className="sensory-grid">
              <div className="sensory-item">
                <label><i className="fas fa-eye"></i> Sight & Light:</label>
                <input
                  type="text"
                  value={article.sensory?.sight || ''}
                  onChange={(e) => updateSensory('sight', e.target.value)}
                  placeholder="e.g. Dim blue phosphorescence, drifting rime crystals..."
                />
              </div>
              <div className="sensory-item">
                <label><i className="fas fa-volume-high"></i> Sound & Echoes:</label>
                <input
                  type="text"
                  value={article.sensory?.sound || ''}
                  onChange={(e) => updateSensory('sound', e.target.value)}
                  placeholder="e.g. Low howling blizzards, groan of settling glaciers..."
                />
              </div>
              <div className="sensory-item">
                <label><i className="fas fa-wind"></i> Smell & Atmosphere:</label>
                <input
                  type="text"
                  value={article.sensory?.smell || ''}
                  onChange={(e) => updateSensory('smell', e.target.value)}
                  placeholder="e.g. Ozone, sulfur steam, pine needle smoke..."
                />
              </div>
              <div className="sensory-item">
                <label><i className="fas fa-temperature-low"></i> Temperature & Touch:</label>
                <input
                  type="text"
                  value={article.sensory?.feel || ''}
                  onChange={(e) => updateSensory('feel', e.target.value)}
                  placeholder="e.g. Sub-zero gale, searing steam vents, slick frost..."
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Editor View Switcher Tabs */}
      <div className="codex-editor-bar">
        <div className="codex-mode-tabs">
          <button
            type="button"
            className={`codex-tab-btn ${editorMode === 'write' ? 'active' : ''}`}
            onClick={() => setEditorMode('write')}
          >
            <i className="fas fa-pen-nib"></i> Write Only
          </button>
          <button
            type="button"
            className={`codex-tab-btn ${editorMode === 'split' ? 'active' : ''}`}
            onClick={() => setEditorMode('split')}
          >
            <i className="fas fa-columns"></i> Split Codex View
          </button>
          <button
            type="button"
            className={`codex-tab-btn ${editorMode === 'preview' ? 'active' : ''}`}
            onClick={() => setEditorMode('preview')}
          >
            <i className="fas fa-book-open"></i> Full Codex Reading
          </button>
        </div>
      </div>

      {/* Markdown & TTRPG Toolbar (in Write and Split modes) */}
      {editorMode !== 'preview' && (
        <div className="codex-toolbar">
          <div className="codex-toolbar-row">
            <button type="button" className="tool-btn" onClick={() => insertFormatting('**', '**')} title="Bold (**text**)">
              <i className="fas fa-bold"></i>
            </button>
            <button type="button" className="tool-btn" onClick={() => insertFormatting('*', '*')} title="Italic (*text*)">
              <i className="fas fa-italic"></i>
            </button>
            <button type="button" className="tool-btn" onClick={() => insertFormatting('<u>', '</u>')} title="Underline (<u>text</u>)">
              <i className="fas fa-underline"></i>
            </button>
            <button type="button" className="tool-btn" onClick={() => insertFormatting('~~', '~~')} title="Strikethrough (~~text~~)">
              <i className="fas fa-strikethrough"></i>
            </button>
            <button type="button" className="tool-btn" onClick={() => insertFormatting('==', '==')} title="Highlight (==text==)">
              <i className="fas fa-highlighter"></i>
            </button>
            <span className="tool-sep" />
            <button type="button" className="tool-btn" onClick={() => insertFormatting('[[', ']]')} title="Wiki Link ([[Entity Name]])">
              <i className="fas fa-link"></i> WikiLink
            </button>
            <button type="button" className="tool-btn" onClick={() => insertFormatting('@')} title="Mention / Tag (@Character)">
              <i className="fas fa-at"></i>
            </button>
            <span className="tool-sep" />
            <button type="button" className="tool-btn font-cinzel" onClick={() => insertFormatting('# ')} title="Heading 1">H1</button>
            <button type="button" className="tool-btn font-cinzel" onClick={() => insertFormatting('## ')} title="Heading 2">H2</button>
            <button type="button" className="tool-btn font-cinzel" onClick={() => insertFormatting('### ')} title="Heading 3">H3</button>
            <span className="tool-sep" />
            <button type="button" className="tool-btn" onClick={() => insertFormatting('- ')} title="Bullet list">
              <i className="fas fa-list-ul"></i>
            </button>
            <button type="button" className="tool-btn" onClick={() => insertFormatting('1. ')} title="Numbered list">
              <i className="fas fa-list-ol"></i>
            </button>
            <button type="button" className="tool-btn" onClick={() => insertFormatting('> ')} title="Quote Block">
              <i className="fas fa-quote-left"></i>
            </button>
            <button type="button" className="tool-btn" onClick={() => insertFormatting('\n---\n')} title="Horizontal Rule">
              <i className="fas fa-minus"></i>
            </button>
          </div>

          <div className="codex-toolbar-row codex-blocks-row">
            <span className="blocks-row-label">TTRPG Blocks:</span>
            <button type="button" className="tool-block-btn readaloud" onClick={() => insertTemplate(CODEX_TEMPLATES.readaloud)}>
              <i className="fas fa-book-open-reader"></i> Read Aloud
            </button>
            <button type="button" className="tool-block-btn statblock" onClick={() => insertTemplate(CODEX_TEMPLATES.statblock)}>
              <i className="fas fa-shield-halved"></i> Statblock
            </button>
            <button type="button" className="tool-block-btn gmnote" onClick={() => insertTemplate(CODEX_TEMPLATES.gmnote)}>
              <i className="fas fa-eye-slash"></i> GM Note
            </button>
            <button type="button" className="tool-block-btn quest" onClick={() => insertTemplate(CODEX_TEMPLATES.quest)}>
              <i className="fas fa-scroll"></i> Quest
            </button>
            <button type="button" className="tool-block-btn npc" onClick={() => insertTemplate(CODEX_TEMPLATES.npc)}>
              <i className="fas fa-user"></i> NPC
            </button>
            <button type="button" className="tool-block-btn loot" onClick={() => insertTemplate(CODEX_TEMPLATES.loot)}>
              <i className="fas fa-gem"></i> Loot
            </button>
            <button type="button" className="tool-block-btn hazard" onClick={() => insertTemplate(CODEX_TEMPLATES.hazard)}>
              <i className="fas fa-triangle-exclamation"></i> Hazard
            </button>
          </div>
        </div>
      )}

      {/* Editor & Preview Split Container */}
      <div className={`codex-panes-wrapper mode-${editorMode}`}>
        {/* Write Pane */}
        {editorMode !== 'preview' && (
          <div className="codex-write-pane">
            <textarea
              ref={textareaRef}
              value={article.content || ''}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="Chronicle the history, mythology, scriptures, or background lore here...
• Use [[Entity Name]] to create interactive wiki-links to regions, houses, or people.
• Use @Mentions for character tags.
• Insert TTRPG blocks using the toolbar buttons above."
              className="codex-textarea"
              rows={14}
            />
          </div>
        )}

        {/* Formatted Preview Pane */}
        {editorMode !== 'write' && (
          <div className="codex-preview-pane">
            {article.sensory && Object.values(article.sensory).some(v => v) && (
              <div className="codex-preview-sensory-bar">
                {article.sensory.sight && <div><strong><i className="fas fa-eye"></i> Sight:</strong> {article.sensory.sight}</div>}
                {article.sensory.sound && <div><strong><i className="fas fa-volume-high"></i> Sound:</strong> {article.sensory.sound}</div>}
                {article.sensory.smell && <div><strong><i className="fas fa-wind"></i> Smell:</strong> {article.sensory.smell}</div>}
                {article.sensory.feel && <div><strong><i className="fas fa-temperature-low"></i> Feel:</strong> {article.sensory.feel}</div>}
              </div>
            )}
            <div className="codex-preview-body">
              <RichLoreText text={article.content || '*No content written yet. Use the editor to begin chronicle.*'} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodexLoreEditor;
