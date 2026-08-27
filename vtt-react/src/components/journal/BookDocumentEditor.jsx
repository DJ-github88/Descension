import React, { useState, useMemo, useRef } from 'react';
import RichLoreText from '../common/RichLoreText';
import tagRegistryService from '../../services/tagRegistryService';
import './BookDocumentEditor.css';

const DEFAULT_SAMPLE_DOCUMENT = {
  id: 'doc-sourcebook-sample',
  title: 'Chronicles of the Frostwood Compact',
  subtitle: 'An Exegesis of the Fog-Bound Reach & The Sovereign Ledger',
  author: 'Jarl-Archivist Kaelen Thalreth',
  theme: 'parchment', // 'parchment' | 'grimoire' | 'royal'
  layout: 'two-column', // 'two-column' | 'single-column' | 'book-spread'
  blocks: [
    {
      id: 'b-1',
      type: 'header',
      level: 1,
      text: 'The Shrouded Bargain'
    },
    {
      id: 'b-2',
      type: 'paragraph',
      hasDropCap: true,
      text: 'In the third century following the Shattered Moon, when the killing freeze threatened to extinguish all warmth across Nordhalla, the ancestors of House Thalreth sought refuge not behind stone, but behind the veil of the Ancient Mist. They bartered with the slumbering wyrd of the Frostwood Reach, exchanging spatial clarity for a barrier of insulating thermal fog.'
    },
    {
      id: 'b-3',
      type: 'callout',
      calloutType: 'lore',
      title: 'Historical Note: The Fog Compact',
      icon: 'fa-scroll',
      content: 'The fog that guards Greymark Keep does not merely insulate from cold; it slowly claims the ancestral memories of those who reside within it for more than three generations.'
    },
    {
      id: 'b-4',
      type: 'header',
      level: 2,
      text: 'The Sovereign Ledger'
    },
    {
      id: 'b-5',
      type: 'paragraph',
      hasDropCap: false,
      text: 'To combat the relentless erosion of memory, the Scribe-Sentinels established the Sovereign Ledger. Every birth, marriage, deed of valor, and land-grant is inscribed in treated dragon-parchment and stored within subterranean vault-libraries.'
    },
    {
      id: 'b-6',
      type: 'divider',
      dividerStyle: 'flourish'
    },
    {
      id: 'b-7',
      type: 'entity_embed',
      entityType: 'faction',
      entityId: 'house-thalreth',
      displayMode: 'card'
    },
    {
      id: 'b-8',
      type: 'header',
      level: 2,
      text: 'The Encroaching Chill'
    },
    {
      id: 'b-9',
      type: 'paragraph',
      hasDropCap: false,
      text: 'Despite the rigorous duties of the archivist-guards, rumors persist that certain ledgers have been deliberately rewritten by the current regime, masking ancient treaties that would otherwise disinherit the ruling branches.'
    },
    {
      id: 'b-10',
      type: 'callout',
      calloutType: 'secret',
      title: 'GM Secret: The Lost Census',
      icon: 'fa-mask',
      content: 'The original unrevised census of the First Generation is buried in the sealed crypts beneath the Frozen Archive in Rime-Spire Peaks.'
    }
  ]
};

export const BookDocumentEditor = ({
  initialDoc = DEFAULT_SAMPLE_DOCUMENT,
  isGM = true,
  onSave,
  onClose
}) => {
  const [doc, setDoc] = useState(initialDoc);
  const [activeMode, setActiveMode] = useState('reader'); // 'edit' | 'reader'
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [showAddBlockMenu, setShowAddBlockMenu] = useState(false);
  const [addInsertIndex, setAddInsertIndex] = useState(null);

  // Entities for embed picker
  const availableEntities = useMemo(() => {
    return tagRegistryService.getAllEntities();
  }, []);

  // Update doc meta
  const updateMeta = (field, value) => {
    setDoc((prev) => ({ ...prev, [field]: value }));
  };

  // Block management
  const addBlock = (type, index = null) => {
    let newBlock = {
      id: `b-${Date.now()}`,
      type
    };

    switch (type) {
      case 'header':
        newBlock.level = 2;
        newBlock.text = 'New Section Title';
        break;
      case 'paragraph':
        newBlock.text = 'Enter rich story content, world lore, or descriptive prose here...';
        newBlock.hasDropCap = false;
        break;
      case 'callout':
        newBlock.calloutType = 'lore';
        newBlock.title = 'Important Lore';
        newBlock.icon = 'fa-feather';
        newBlock.content = 'Callout box text content...';
        break;
      case 'entity_embed':
        newBlock.entityType = availableEntities[0]?.type || 'faction';
        newBlock.entityId = availableEntities[0]?.id || 'house-thalreth';
        newBlock.displayMode = 'card';
        break;
      case 'divider':
        newBlock.dividerStyle = 'flourish';
        break;
      case 'image':
        newBlock.url = '/assets/images/backgrounds/nordhalla.jpeg';
        newBlock.caption = 'Illustration caption';
        newBlock.alignment = 'full';
        break;
      default:
        break;
    }

    setDoc((prev) => {
      const blocks = [...prev.blocks];
      if (index !== null && index >= 0) {
        blocks.splice(index, 0, newBlock);
      } else {
        blocks.push(newBlock);
      }
      return { ...prev, blocks };
    });

    setEditingBlockId(newBlock.id);
    setShowAddBlockMenu(false);
  };

  const updateBlock = (id, updates) => {
    setDoc((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === id ? { ...b, ...updates } : b))
    }));
  };

  const moveBlock = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= doc.blocks.length) return;

    setDoc((prev) => {
      const blocks = [...prev.blocks];
      const temp = blocks[index];
      blocks[index] = blocks[targetIdx];
      blocks[targetIdx] = temp;
      return { ...prev, blocks };
    });
  };

  const deleteBlock = (id) => {
    setDoc((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((b) => b.id !== id)
    }));
    if (editingBlockId === id) setEditingBlockId(null);
  };

  // Render individual block in publication view
  const renderPublicationBlock = (block) => {
    switch (block.type) {
      case 'header':
        if (block.level === 1) return <h1 key={block.id} className="book-h1">{block.text}</h1>;
        if (block.level === 2) return <h2 key={block.id} className="book-h2">{block.text}</h2>;
        return <h3 key={block.id} className="book-h3">{block.text}</h3>;

      case 'paragraph':
        return (
          <p
            key={block.id}
            className={`book-paragraph ${block.hasDropCap ? 'drop-cap' : ''}`}
          >
            <RichLoreText text={block.text} />
          </p>
        );

      case 'callout':
        return (
          <aside key={block.id} className={`book-callout ${block.calloutType}`}>
            <div className="callout-header">
              <i className={`fas ${block.icon || 'fa-scroll'}`}></i>
              <span>{block.title}</span>
            </div>
            <div className="callout-content">
              <RichLoreText text={block.content} />
            </div>
          </aside>
        );

      case 'entity_embed':
        const ent = availableEntities.find(
          (e) => e.type === block.entityType && e.id === block.entityId
        );
        if (!ent) return null;
        return (
          <div key={block.id} className="book-entity-embed">
            <div className="embed-icon">
              <i className={`fas ${ent.icon}`}></i>
            </div>
            <div className="embed-details">
              <div className="embed-type">{ent.type.toUpperCase()}</div>
              <div className="embed-name">{ent.name}</div>
              <div className="embed-summary">{ent.summary}</div>
            </div>
          </div>
        );

      case 'divider':
        return (
          <div key={block.id} className={`book-divider ${block.dividerStyle}`}>
            <div className="divider-line"></div>
            <div className="divider-flourish">
              <i className="fas fa-feather-pointed"></i>
            </div>
            <div className="divider-line"></div>
          </div>
        );

      case 'image':
        return (
          <figure key={block.id} className={`book-image-wrapper ${block.alignment || 'full'}`}>
            <img src={block.url} alt={block.caption || 'Illustration'} className="book-image" />
            {block.caption && <figcaption className="book-image-caption">{block.caption}</figcaption>}
          </figure>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`book-document-editor theme-${doc.theme}`}>
      {/* Top Action Bar */}
      <div className="book-editor-toolbar">
        <div className="toolbar-left">
          <button
            type="button"
            className={`mode-btn ${activeMode === 'reader' ? 'active' : ''}`}
            onClick={() => setActiveMode('reader')}
          >
            <i className="fas fa-book-open"></i> Publication View
          </button>
          <button
            type="button"
            className={`mode-btn ${activeMode === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveMode('edit')}
          >
            <i className="fas fa-pen-nib"></i> Block Editor
          </button>
        </div>

        <div className="toolbar-center">
          <div className="theme-selector">
            <label>Theme:</label>
            <select
              value={doc.theme}
              onChange={(e) => updateMeta('theme', e.target.value)}
              className="theme-select"
            >
              <option value="parchment">Parchment (Classic D&D)</option>
              <option value="grimoire">Dark Grimoire</option>
              <option value="royal">Royal Archive</option>
            </select>
          </div>

          <div className="layout-selector">
            <label>Layout:</label>
            <select
              value={doc.layout}
              onChange={(e) => updateMeta('layout', e.target.value)}
              className="theme-select"
            >
              <option value="two-column">Two-Column D&D</option>
              <option value="single-column">Single Column</option>
            </select>
          </div>
        </div>

        <div className="toolbar-right">
          {onSave && (
            <button
              type="button"
              className="save-doc-btn"
              onClick={() => onSave(doc)}
            >
              <i className="fas fa-floppy-disk"></i> Save Chapter
            </button>
          )}
          {onClose && (
            <button type="button" className="close-doc-btn" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>

      {/* Main Document Content Container */}
      <div className="book-document-viewport">
        {activeMode === 'reader' ? (
          /* Reader / Publication View */
          <div className={`book-page-sheet ${doc.layout}`}>
            <header className="book-page-header">
              <h1 className="book-doc-title">{doc.title}</h1>
              {doc.subtitle && <p className="book-doc-subtitle">{doc.subtitle}</p>}
              {doc.author && <p className="book-doc-author">By {doc.author}</p>}
              <div className="book-header-rule"></div>
            </header>

            <main className="book-page-body">
              {doc.blocks.map((block) => renderPublicationBlock(block))}
            </main>
          </div>
        ) : (
          /* Block Builder / Edit Mode */
          <div className="book-builder-container">
            <div className="book-builder-meta">
              <input
                type="text"
                value={doc.title}
                onChange={(e) => updateMeta('title', e.target.value)}
                placeholder="Document Title..."
                className="builder-title-input"
              />
              <input
                type="text"
                value={doc.subtitle}
                onChange={(e) => updateMeta('subtitle', e.target.value)}
                placeholder="Document Subtitle..."
                className="builder-subtitle-input"
              />
            </div>

            <div className="builder-blocks-list">
              {doc.blocks.map((block, idx) => {
                const isEditing = editingBlockId === block.id;

                return (
                  <div
                    key={block.id}
                    className={`builder-block-card ${isEditing ? 'editing' : ''}`}
                  >
                    <div className="block-card-header">
                      <div className="block-type-tag">
                        <i className="fas fa-grip-vertical block-grip"></i>
                        <span>{block.type.toUpperCase()}</span>
                      </div>

                      <div className="block-controls">
                        <button
                          type="button"
                          onClick={() => moveBlock(idx, -1)}
                          disabled={idx === 0}
                          title="Move Up"
                        >
                          <i className="fas fa-arrow-up"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => moveBlock(idx, 1)}
                          disabled={idx === doc.blocks.length - 1}
                          title="Move Down"
                        >
                          <i className="fas fa-arrow-down"></i>
                        </button>
                        <button
                          type="button"
                          className="delete-block-btn"
                          onClick={() => deleteBlock(block.id)}
                          title="Delete Block"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>

                    <div className="block-card-body">
                      {block.type === 'header' && (
                        <div className="block-editor-row">
                          <select
                            value={block.level}
                            onChange={(e) =>
                              updateBlock(block.id, { level: Number(e.target.value) })
                            }
                            className="level-select"
                          >
                            <option value={1}>H1 (Major Section)</option>
                            <option value={2}>H2 (Subsection)</option>
                            <option value={3}>H3 (Topic)</option>
                          </select>
                          <input
                            type="text"
                            value={block.text}
                            onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                            className="block-text-input"
                          />
                        </div>
                      )}

                      {block.type === 'paragraph' && (
                        <div className="block-editor-col">
                          <div className="block-options-bar">
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={block.hasDropCap || false}
                                onChange={(e) =>
                                  updateBlock(block.id, { hasDropCap: e.target.checked })
                                }
                              />
                              <span>Drop Cap (Illuminated First Letter)</span>
                            </label>
                          </div>
                          <textarea
                            value={block.text}
                            onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                            rows={4}
                            className="block-textarea"
                            placeholder="Enter narrative text with @mentions and #tags..."
                          />
                        </div>
                      )}

                      {block.type === 'callout' && (
                        <div className="block-editor-col">
                          <div className="block-options-bar">
                            <select
                              value={block.calloutType}
                              onChange={(e) =>
                                updateBlock(block.id, { calloutType: e.target.value })
                              }
                              className="callout-type-select"
                            >
                              <option value="lore">Lore Callout</option>
                              <option value="secret">Secret / GM Insight</option>
                              <option value="warning">Warning / Hazard</option>
                              <option value="quote">In-World Quote</option>
                            </select>
                            <input
                              type="text"
                              value={block.title}
                              onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                              placeholder="Callout Title..."
                              className="block-text-input"
                            />
                          </div>
                          <textarea
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                            rows={3}
                            className="block-textarea"
                          />
                        </div>
                      )}

                      {block.type === 'entity_embed' && (
                        <div className="block-editor-row">
                          <label>Linked World Entity:</label>
                          <select
                            value={`${block.entityType}:${block.entityId}`}
                            onChange={(e) => {
                              const [entityType, entityId] = e.target.value.split(':');
                              updateBlock(block.id, { entityType, entityId });
                            }}
                            className="entity-embed-select"
                          >
                            {availableEntities.map((ent) => (
                              <option
                                key={`${ent.type}:${ent.id}`}
                                value={`${ent.type}:${ent.id}`}
                              >
                                [{ent.type.toUpperCase()}] {ent.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {block.type === 'divider' && (
                        <div className="block-divider-preview">
                          <span>Decorative Flourish Divider</span>
                        </div>
                      )}

                      {block.type === 'image' && (
                        <div className="block-editor-col">
                          <input
                            type="text"
                            value={block.url}
                            onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                            placeholder="Image URL..."
                            className="block-text-input"
                          />
                          <input
                            type="text"
                            value={block.caption}
                            onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                            placeholder="Image Caption..."
                            className="block-text-input"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Block Button / Palette */}
            <div className="add-block-palette">
              <button
                type="button"
                className="palette-btn"
                onClick={() => addBlock('header')}
              >
                <i className="fas fa-heading"></i> + Heading
              </button>
              <button
                type="button"
                className="palette-btn"
                onClick={() => addBlock('paragraph')}
              >
                <i className="fas fa-paragraph"></i> + Paragraph
              </button>
              <button
                type="button"
                className="palette-btn"
                onClick={() => addBlock('callout')}
              >
                <i className="fas fa-scroll"></i> + Callout Box
              </button>
              <button
                type="button"
                className="palette-btn"
                onClick={() => addBlock('entity_embed')}
              >
                <i className="fas fa-network-wired"></i> + Entity Embed
              </button>
              <button
                type="button"
                className="palette-btn"
                onClick={() => addBlock('divider')}
              >
                <i className="fas fa-ellipsis"></i> + Divider
              </button>
              <button
                type="button"
                className="palette-btn"
                onClick={() => addBlock('image')}
              >
                <i className="fas fa-image"></i> + Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDocumentEditor;
