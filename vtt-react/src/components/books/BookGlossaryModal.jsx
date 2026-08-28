import React, { useState } from 'react';
import RichLoreText from '../common/RichLoreText';
import './BookDocumentEditor.css';

const CATEGORIES = [
  { id: 'Concept', label: 'Concept & Philosophy', icon: 'fa-brain', color: '#9b59b6' },
  { id: 'Phenomenon', label: 'Magical Phenomenon', icon: 'fa-wand-magic-sparkles', color: '#3498db' },
  { id: 'Relic', label: 'Relic & Artifact', icon: 'fa-gem', color: '#e67e22' },
  { id: 'Faction', label: 'Order & Faction', icon: 'fa-shield-halved', color: '#e74c3c' },
  { id: 'Location', label: 'Realm & Location', icon: 'fa-landmark', color: '#2ecc71' },
  { id: 'NPC', label: 'Historical Figure', icon: 'fa-user-ninja', color: '#d4af37' }
];

export const BookGlossaryModal = ({
  isOpen,
  onClose,
  terms = [],
  onAddTerm,
  onUpdateTerm,
  onDeleteTerm
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingTerm, setEditingTerm] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [alias, setAlias] = useState('');
  const [category, setCategory] = useState('Concept');
  const [definition, setDefinition] = useState('');
  const [icon, setIcon] = useState('fa-bookmark');

  if (!isOpen) return null;

  const startCreate = () => {
    setName('');
    setAlias('');
    setCategory('Concept');
    setDefinition('');
    setIcon('fa-bookmark');
    setEditingTerm(null);
    setIsCreating(true);
  };

  const startEdit = (term) => {
    setName(term.name || '');
    setAlias(term.alias || '');
    setCategory(term.category || 'Concept');
    setDefinition(term.definition || '');
    setIcon(term.icon || 'fa-bookmark');
    setEditingTerm(term);
    setIsCreating(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const catObj = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];

    if (editingTerm) {
      onUpdateTerm(editingTerm.id, {
        name: name.trim(),
        alias: alias.trim(),
        category,
        definition: definition.trim(),
        icon: icon || catObj.icon,
        color: catObj.color
      });
      setEditingTerm(null);
    } else {
      onAddTerm({
        name: name.trim(),
        alias: alias.trim(),
        category,
        definition: definition.trim(),
        icon: icon || catObj.icon,
        color: catObj.color
      });
      setIsCreating(false);
    }
  };

  const filteredTerms = (terms || []).filter((t) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || `${t.name} ${t.alias} ${t.category} ${t.definition}`.toLowerCase().includes(q);
    const matchesCat = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="book-modal-backdrop" onClick={onClose}>
      <div className="book-glossary-modal" onClick={(e) => e.stopPropagation()}>
        <div className="book-glossary-head">
          <div className="head-title">
            <i className="fas fa-book-bookmark"></i>
            <div>
              <h3>Glossary &amp; Custom Lore Terms</h3>
              <p>Define terms to enable live illuminated hover tooltips throughout your book.</p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="book-glossary-content-grid">
          {/* Left Column: Terms List */}
          <div className="glossary-list-pane">
            <div className="glossary-toolbar">
              <div className="glossary-search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search terms & aliases..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button type="button" className="new-term-btn" onClick={startCreate}>
                <i className="fas fa-plus"></i> New Term
              </button>
            </div>

            <div className="glossary-filter-chips">
              <button
                type="button"
                className={`filter-chip ${categoryFilter === 'all' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('all')}
              >
                All ({terms.length})
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`filter-chip ${categoryFilter === cat.id ? 'active' : ''}`}
                  onClick={() => setCategoryFilter(cat.id)}
                >
                  <i className={`fas ${cat.icon}`}></i> {cat.label.split(' ')[0]}
                </button>
              ))}
            </div>

            <div className="glossary-cards-scroll">
              {filteredTerms.map((term) => (
                <div
                  key={term.id}
                  className={`glossary-item-card ${(editingTerm?.id === term.id) ? 'selected' : ''}`}
                  onClick={() => startEdit(term)}
                >
                  <div className="card-top-row">
                    <div className="term-name-group">
                      <i className={`fas ${term.icon || 'fa-bookmark'}`} style={{ color: term.color || '#d4af37' }}></i>
                      <strong className="term-main-name">{term.name}</strong>
                      {term.alias && <span className="term-alias-pill">aka {term.alias}</span>}
                    </div>
                    <span className="term-cat-tag">{term.category}</span>
                  </div>
                  <p className="term-snippet">{term.definition || 'No definition set.'}</p>
                  <div className="term-hover-hint">
                    <i className="fas fa-sparkles"></i> Type <code>[[{term.name}]]</code> to link
                  </div>
                </div>
              ))}

              {filteredTerms.length === 0 && (
                <div className="glossary-empty">
                  <i className="fas fa-feather-pointed"></i>
                  <p>No terms found. Click <strong>+ New Term</strong> to create your first glossary entry.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Editor & Preview */}
          <div className="glossary-editor-pane">
            {(isCreating || editingTerm) ? (
              <form className="term-editor-form" onSubmit={handleSave}>
                <h4 className="editor-heading">
                  <i className={`fas ${isCreating ? 'fa-plus' : 'fa-pen-to-square'}`}></i>
                  {isCreating ? 'Define New Glossary Term' : `Edit "${editingTerm.name}"`}
                </h4>

                <div className="form-row">
                  <div className="form-group flex-2">
                    <label>Term Name (Unique Key):</label>
                    <input
                      type="text"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ancient Mist, Frost Wyrd, Greymark Keep"
                      required
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label>Category:</label>
                    <select
                      className="form-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group flex-2">
                    <label>In-Text Alias (Optional):</label>
                    <input
                      type="text"
                      className="form-input"
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                      placeholder="Alternative label for linking (e.g. The Fog)"
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label>FontAwesome Icon:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      placeholder="e.g. fa-smog, fa-gem, fa-crown"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Illuminated Definition &amp; Lore Flavor:</label>
                  <textarea
                    className="form-textarea"
                    rows={5}
                    value={definition}
                    onChange={(e) => setDefinition(e.target.value)}
                    placeholder="Enter the complete lore summary or mechanical explanation that will display when players or GMs hover over this term..."
                    required
                  />
                </div>

                {/* Live Tooltip Hover Preview */}
                <div className="tooltip-live-preview-box">
                  <span className="preview-label">Live Hovercard Preview:</span>
                  <div className="preview-card-inner">
                    <div className="preview-card-head">
                      <i className={`fas ${icon || 'fa-bookmark'}`} style={{ color: '#d4af37' }}></i>
                      <div>
                        <strong className="p-name">{name || 'Term Name'}</strong>
                        <span className="p-cat">{category} {alias ? `• aka ${alias}` : ''}</span>
                      </div>
                    </div>
                    <div className="preview-card-body">
                      <RichLoreText text={definition || 'Definition preview will render here with rich markdown...'} />
                    </div>
                  </div>
                </div>

                <div className="form-actions-row">
                  {editingTerm && (
                    <button
                      type="button"
                      className="term-delete-btn"
                      onClick={() => {
                        if (window.confirm(`Delete term "${editingTerm.name}"?`)) {
                          onDeleteTerm(editingTerm.id);
                          setEditingTerm(null);
                        }
                      }}
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  )}
                  <div className="right-actions">
                    <button
                      type="button"
                      className="term-cancel-btn"
                      onClick={() => { setEditingTerm(null); setIsCreating(false); }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="term-save-btn">
                      <i className="fas fa-check"></i> Save Term
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="editor-prompt-blank">
                <i className="fas fa-hand-pointer"></i>
                <h4>Select a Term or Create a New One</h4>
                <p>Glossary terms are automatically indexed across all pages in this book. Whenever you or a reader hovers over an in-text term (or types <code>[[TermName]]</code>), this interactive tooltip appears seamlessly.</p>
                <button type="button" className="new-term-btn large" onClick={startCreate}>
                  <i className="fas fa-plus"></i> Create New Term
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookGlossaryModal;
