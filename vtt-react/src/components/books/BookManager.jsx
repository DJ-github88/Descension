import React, { useState, useMemo, useEffect } from 'react';
import useBookStore, { normalizeBook } from '../../store/bookStore';
import useAuthStore from '../../store/authStore';
import BookDocumentEditor from './BookDocumentEditor';
import './BookManager.css';

const THEME_LABELS = {
  parchment: 'Parchment',
  royal: 'Royal Archive',
  crimson: 'Crimson Tome',
  grimoire: 'Dark Grimoire',
  wildwood: 'Fey Wildwood'
};

const NewBookForm = ({ onCreate, onCancel }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('');
  const [theme, setTheme] = useState('parchment');
  const [layout, setLayout] = useState('two-column');

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title: title.trim(), subtitle: subtitle.trim(), author: author.trim(), theme, layout });
  };

  return (
    <form className="book-new-form" onSubmit={submit}>
      <h3 className="book-new-form-title"><i className="fas fa-feather-pointed"></i> Bind a New Chronicle</h3>
      <input
        className="book-new-input"
        type="text"
        placeholder="Title — e.g. Bestiary of the Cragjaw Peaks, Realm of Greymark..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        autoFocus
      />
      <input
        className="book-new-input"
        type="text"
        placeholder="Subtitle (e.g. A Canonical Sourcebook for Descension)"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
      />
      <input
        className="book-new-input"
        type="text"
        placeholder="Author or Chronicle Keeper (optional)"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <div className="book-new-theme-row">
        {Object.entries(THEME_LABELS).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`theme-chip theme-${value} ${theme === value ? 'selected' : ''}`}
            onClick={() => setTheme(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="book-new-layout-row" style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
        <button
          type="button"
          className={`toolbar-btn ${layout === 'two-column' || layout === 'book-spread' ? 'active' : ''}`}
          onClick={() => setLayout('two-column')}
        >
          <i className="fas fa-book-open"></i> Two-Page Book Spread
        </button>
        <button
          type="button"
          className={`toolbar-btn ${layout === 'single-column' ? 'active' : ''}`}
          onClick={() => setLayout('single-column')}
        >
          <i className="fas fa-file-lines"></i> Single Column
        </button>
      </div>
      <div className="book-new-actions">
        <button type="button" className="book-new-cancel" onClick={onCancel}>Cancel</button>
        <button type="submit" className="book-new-submit">
          <i className="fas fa-book-bookmark"></i> Create Book
        </button>
      </div>
    </form>
  );
};

const BookManager = ({ isGM = true }) => {
  const books = useBookStore((s) => s.books);
  const activeBookId = useBookStore((s) => s.activeBookId);
  const setActiveBook = useBookStore((s) => s.setActiveBook);
  const createBook = useBookStore((s) => s.createBook);
  const duplicateBook = useBookStore((s) => s.duplicateBook);
  const deleteBook = useBookStore((s) => s.deleteBook);
  const hydrateFromCloud = useBookStore((s) => s.hydrateFromCloud);
  const authUser = useAuthStore((s) => s.user);

  const [query, setQuery] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    const uid = authUser?.uid || authUser?.id || null;
    if (uid) hydrateFromCloud(uid);
  }, [authUser?.uid, authUser?.id, hydrateFromCloud]);

  const normalizedBooks = useMemo(() => {
    return books.map((b) => normalizeBook(b));
  }, [books]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return normalizedBooks;
    return normalizedBooks.filter((b) =>
      `${b.title} ${b.subtitle} ${b.author} ${(b.tags || []).join(' ')}`.toLowerCase().includes(q)
    );
  }, [normalizedBooks, query]);

  const activeBook = normalizedBooks.find((b) => b.id === activeBookId);

  const handleCreate = (meta) => {
    const id = createBook(meta);
    setShowNewForm(false);
    setActiveBook(id);
  };

  const handleDelete = (book) => {
    if (window.confirm(`Delete "${book.title}" permanently? This cannot be undone.`)) {
      deleteBook(book.id);
    }
  };

  if (activeBook) {
    return (
      <BookDocumentEditor
        key={activeBook.id}
        bookId={activeBook.id}
        isGM={isGM}
        onBack={() => setActiveBook(null)}
      />
    );
  }

  return (
    <div className="book-manager">
      <div className="book-manager-header">
        <div className="book-manager-title-block">
          <h2 className="book-manager-title"><i className="fas fa-book-open"></i> Sourcebooks &amp; Chronicles</h2>
          <p className="book-manager-subtitle">
            Craft beautiful D&amp;D / Pathfinder sourcebooks with chapters, pages, creature statblocks, item cards, spell formulas, map embeds, custom glossary tooltips, and interactive tables of contents.
          </p>
        </div>
        <div className="book-manager-actions">
          <div className="book-search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search your library..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="button" className="book-new-btn" onClick={() => setShowNewForm((v) => !v)}>
            <i className="fas fa-plus"></i> New Book
          </button>
        </div>
      </div>

      {showNewForm && <NewBookForm onCreate={handleCreate} onCancel={() => setShowNewForm(false)} />}

      <div className="book-grid">
        {filtered.map((book) => {
          const totalPages = (book.chapters || []).reduce((acc, ch) => acc + (ch.pages?.length || 0), 0);
          const totalTerms = (book.customTerms || []).length;

          return (
            <div key={book.id} className={`book-card cover-${book.theme || 'parchment'}`}>
              <div className="book-card-spine"></div>
              <div
                className="book-card-face"
                onClick={() => setActiveBook(book.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') setActiveBook(book.id); }}
              >
                <div className="book-card-cover">
                  {book.coverImage
                    ? <img src={book.coverImage} alt="" className="book-cover-img" />
                    : <div className="book-cover-ornament"><i className="fas fa-dragon"></i></div>}
                  <div className="book-card-title">{book.title}</div>
                  {book.subtitle && <div className="book-card-subtitle">{book.subtitle}</div>}
                  {book.author && <div className="book-card-author">by {book.author}</div>}
                </div>
                <div className="book-card-meta">
                  <span className="book-meta-item">
                    <i className="fas fa-bookmark"></i> {book.chapters?.length || 1} {book.chapters?.length === 1 ? 'Chapter' : 'Chapters'}
                  </span>
                  <span className="book-meta-item">
                    <i className="fas fa-file-lines"></i> {totalPages || 1} {totalPages === 1 ? 'Page' : 'Pages'}
                  </span>
                  {totalTerms > 0 && (
                    <span className="book-meta-item">
                      <i className="fas fa-sparkles"></i> {totalTerms} Terms
                    </span>
                  )}
                </div>
              </div>
              <div className="book-card-toolbar">
                <button type="button" title="Read / Edit Book" onClick={() => setActiveBook(book.id)}>
                  <i className="fas fa-book-open"></i>
                </button>
                <button type="button" title="Duplicate Book" onClick={() => duplicateBook(book.id)}>
                  <i className="fas fa-copy"></i>
                </button>
                <button type="button" title="Delete Book" className="danger" onClick={() => handleDelete(book)}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && !showNewForm && (
          <div className="book-empty-state">
            <i className="fas fa-feather-pointed"></i>
            <h3>{books.length === 0 ? 'Your shelf awaits its first chronicle' : 'No books match your search'}</h3>
            <p>Bind a new book and start creating rich published-grade tabletop sourcebooks with monsters, items, spells, and live glossary tooltips.</p>
            <button type="button" className="book-new-btn large" onClick={() => setShowNewForm(true)}>
              <i className="fas fa-plus"></i> Create Your First Book
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookManager;

