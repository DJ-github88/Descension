import React from 'react';
import './LoreEditorToolbar.css';

/**
 * Universal Formatting & Authoring Toolbar for Textareas
 * Injects markdown formatting, fancy headers, quotes, LoreLinks, and TTRPG callout blocks.
 */
const LoreEditorToolbar = ({ textareaRef, value, onChange, className = '' }) => {
  const insertText = (before, after = '', placeholder = '') => {
    const textarea = textareaRef?.current;
    if (!textarea) {
      if (onChange) {
        onChange((value || '') + before + placeholder + after);
      }
      return;
    }

    const start = textarea.selectionStart ?? (value || '').length;
    const end = textarea.selectionEnd ?? (value || '').length;
    const currentVal = textarea.value ?? value ?? '';
    const selected = currentVal.substring(start, end) || placeholder;

    const updated = currentVal.substring(0, start) + before + selected + after + currentVal.substring(end);

    if (onChange) {
      onChange(updated);
    }

    setTimeout(() => {
      textarea.focus();
      const newCursorStart = start + before.length;
      const newCursorEnd = newCursorStart + selected.length;
      textarea.setSelectionRange(newCursorStart, newCursorEnd);
    }, 10);
  };

  const insertBlock = (blockType, title = 'Chronicle Note', sampleBody = 'Record details here...') => {
    insertText(`\n:::${blockType} ${title}\n`, `\n:::\n`, sampleBody);
  };

  return (
    <div className={`lore-editor-toolbar ${className}`}>
      <div className="lore-toolbar-group">
        <button
          type="button"
          className="lore-tool-btn"
          title="Heading 1 (# )"
          onClick={() => insertText('# ', '', 'Major Epoch / Chronicle Title')}
        >
          <strong>H1</strong>
        </button>
        <button
          type="button"
          className="lore-tool-btn"
          title="Heading 2 (## )"
          onClick={() => insertText('## ', '', 'Section Title')}
        >
          <strong>H2</strong>
        </button>
        <button
          type="button"
          className="lore-tool-btn"
          title="Heading 3 (### )"
          onClick={() => insertText('### ', '', 'Subsection')}
        >
          <strong>H3</strong>
        </button>
      </div>

      <div className="lore-toolbar-divider" />

      <div className="lore-toolbar-group">
        <button
          type="button"
          className="lore-tool-btn"
          title="Bold (**text**)"
          onClick={() => insertText('**', '**', 'bold text')}
        >
          <i className="fas fa-bold"></i>
        </button>
        <button
          type="button"
          className="lore-tool-btn"
          title="Italic (*text*)"
          onClick={() => insertText('*', '*', 'italic text')}
        >
          <i className="fas fa-italic"></i>
        </button>
        <button
          type="button"
          className="lore-tool-btn"
          title="Highlight (==text==)"
          onClick={() => insertText('==', '==', 'highlighted text')}
        >
          <i className="fas fa-highlighter"></i>
        </button>
        <button
          type="button"
          className="lore-tool-btn"
          title="Quote / Epigraph (&quot;quote&quot;)"
          onClick={() => insertText('"', '"', 'In the dying light, we endure.')}
        >
          <i className="fas fa-quote-left"></i>
        </button>
        <button
          type="button"
          className="lore-tool-btn"
          title="Horizontal Rule (---)"
          onClick={() => insertText('\n---\n', '', '')}
        >
          <i className="fas fa-minus"></i>
        </button>
      </div>

      <div className="lore-toolbar-divider" />

      <div className="lore-toolbar-group">
        <button
          type="button"
          className="lore-tool-btn lore-btn-link"
          title="Entity WikiLink ([[Entity Name]])"
          onClick={() => insertText('[[', ']]', 'Entity Name')}
        >
          <i className="fas fa-bookmark"></i>
          <span>WikiLink</span>
        </button>
        <button
          type="button"
          className="lore-tool-btn lore-btn-link"
          title="LoreLink Tag (<LoreLink termId=&quot;id&quot;>Label</LoreLink>)"
          onClick={() => insertText('<LoreLink termId="term_id">', '</LoreLink>', 'Lore Term')}
        >
          <i className="fas fa-link"></i>
          <span>LoreLink</span>
        </button>
      </div>

      <div className="lore-toolbar-divider" />

      {/* TTRPG Callout Blocks */}
      <div className="lore-toolbar-group">
        <button
          type="button"
          className="lore-tool-btn lore-btn-block"
          title="Insert Read Aloud Box"
          onClick={() => insertBlock('readaloud', 'Atmospheric Read Aloud', 'The mist hangs thick over the black iron spires...')}
        >
          <i className="fas fa-book-open-reader"></i>
          <span>Read Aloud</span>
        </button>
        <button
          type="button"
          className="lore-tool-btn lore-btn-block"
          title="Insert GM Secret Note"
          onClick={() => insertBlock('gmnote', 'GM Secret Note', 'Only the archivist knows the True Seal has fractured...')}
        >
          <i className="fas fa-eye-slash"></i>
          <span>GM Secret</span>
        </button>
        <button
          type="button"
          className="lore-tool-btn lore-btn-block"
          title="Insert Quest Hook Box"
          onClick={() => insertBlock('quest', 'Chronicle Quest Hook', 'Objective: Recover the frozen prism\nRewards: 250 Solar Shards\nGiver: Jarl-Archivist Vel-Otharen')}
        >
          <i className="fas fa-scroll"></i>
          <span>Quest</span>
        </button>
        <button
          type="button"
          className="lore-tool-btn lore-btn-block"
          title="Insert Relic / Loot Block"
          onClick={() => insertBlock('relic', 'Artifact & Relic', '- Crown of the Frozen Archive\n- Scriptor Contract Shard')}
        >
          <i className="fas fa-wand-magic-sparkles"></i>
          <span>Relic</span>
        </button>
        <button
          type="button"
          className="lore-tool-btn lore-btn-block"
          title="Insert Statblock Box"
          onClick={() => insertBlock('statblock', 'Living Champion / Monster', 'HP: 180 | Mana: 40 | AP: 3 | DR: 4\nSTR: 18 (+4) | AGI: 14 (+2) | CON: 16 (+3) | INT: 10 (+0)\nAction - Radiant Cleave: Deals 2d8+4 physical and blinds the target.')}
        >
          <i className="fas fa-shield-halved"></i>
          <span>Statblock</span>
        </button>
      </div>
    </div>
  );
};

export default LoreEditorToolbar;
