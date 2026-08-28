import React, { useState, useMemo, useEffect } from 'react';
import useBookStore, { normalizeBook, TRASH_RETENTION_MS, TRASH_RETENTION_DAYS } from '../../store/bookStore';
import useAuthStore from '../../store/authStore';
import BookDocumentEditor from './BookDocumentEditor';
import BookDeleteModal from './BookDeleteModal';
import './BookManager.css';

const THEME_LABELS = {
  parchment: 'Parchment',
  royal: 'Royal Archive',
  crimson: 'Crimson Tome',
  grimoire: 'Dark Grimoire',
  wildwood: 'Fey Wildwood'
};

const formatRemainingTime = (trashedAt) => {
  if (!trashedAt) return { label: '7 days left', isExpiringSoon: false };
  const trashedTime = new Date(trashedAt).getTime();
  const expiresAt = trashedTime + TRASH_RETENTION_MS;
  const diffMs = expiresAt - Date.now();

  if (diffMs <= 0) return { label: 'Expiring soon', isExpiringSoon: true };

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (days > 0) {
    return {
      label: `${days}d ${remainingHours}h remaining`,
      isExpiringSoon: days <= 1
    };
  }
  return {
    label: `${Math.max(1, hours)}h remaining`,
    isExpiringSoon: true
  };
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
  const trashedBooks = useBookStore((s) => s.trashedBooks || []);
  const activeBookId = useBookStore((s) => s.activeBookId);
  const setActiveBook = useBookStore((s) => s.setActiveBook);
  const createBook = useBookStore((s) => s.createBook);
  const duplicateBook = useBookStore((s) => s.duplicateBook);
  const moveToTrash = useBookStore((s) => s.moveToTrash);
  const restoreBook = useBookStore((s) => s.restoreBook);
  const permanentlyDeleteBook = useBookStore((s) => s.permanentlyDeleteBook);
  const emptyTrash = useBookStore((s) => s.emptyTrash);
  const purgeExpiredTrash = useBookStore((s) => s.purgeExpiredTrash);
  const hydrateFromCloud = useBookStore((s) => s.hydrateFromCloud);
  const authUser = useAuthStore((s) => s.user);

  const [currentTab, setCurrentTab] = useState('active'); // 'active' | 'trash'
  const [query, setQuery] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Modal State
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'trash', // 'trash' | 'permanent' | 'empty-trash'
    book: null
  });

  useEffect(() => {
    purgeExpiredTrash();
  }, [purgeExpiredTrash]);

  useEffect(() => {
    const uid = authUser?.uid || authUser?.id || null;
    if (uid) hydrateFromCloud(uid);
  }, [authUser?.uid, authUser?.id, hydrateFromCloud]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  const normalizedBooks = useMemo(() => {
    return books.map((b) => normalizeBook(b));
  }, [books]);

  const normalizedTrashedBooks = useMemo(() => {
    return trashedBooks.map((b) => normalizeBook(b));
  }, [trashedBooks]);

  const displayedList = currentTab === 'active' ? normalizedBooks : normalizedTrashedBooks;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return displayedList;
    return displayedList.filter((b) =>
      `${b.title} ${b.subtitle} ${b.author} ${(b.tags || []).join(' ')}`.toLowerCase().includes(q)
    );
  }, [displayedList, query]);

  const activeBook = normalizedBooks.find((b) => b.id === activeBookId);

  const handleCreate = (meta) => {
    const id = createBook(meta);
    setShowNewForm(false);
    setActiveBook(id);
    showToast(`Created "${meta.title || 'Untitled Chronicle'}"`);
  };

  const handlePromptTrash = (book) => {
    setModalState({
      isOpen: true,
      mode: 'trash',
      book
    });
  };

  const handlePromptPermanent = (book) => {
    setModalState({
      isOpen: true,
      mode: 'permanent',
      book
    });
  };

  const handlePromptEmptyTrash = () => {
    if (trashedBooks.length === 0) return;
    setModalState({
      isOpen: true,
      mode: 'empty-trash',
      book: null
    });
  };

  const handleConfirmModal = () => {
    const { mode, book } = modalState;
    if (mode === 'trash' && book) {
      moveToTrash(book.id);
      showToast(`Moved "${book.title}" to Trash Can (${TRASH_RETENTION_DAYS} days retention).`);
    } else if (mode === 'permanent' && book) {
      permanentlyDeleteBook(book.id);
      showToast(`Permanently deleted "${book.title}".`);
    } else if (mode === 'empty-trash') {
      emptyTrash();
      showToast('Trash Can emptied.');
    }
    setModalState({ isOpen: false, mode: 'trash', book: null });
  };

  const handleRestore = (book) => {
    restoreBook(book.id);
    showToast(`Restored "${book.title}" to Active Chronicles.`);
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
      {toastMessage && (
        <div className="book-toast">
          <i className="fas fa-circle-check"></i>
          <span>{toastMessage}</span>
          <button type="button" className="book-toast-close" onClick={() => setToastMessage(null)}>
            <i className="fas fa-xmark"></i>
          </button>
        </div>
      )}

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
              placeholder={currentTab === 'active' ? 'Search your library...' : 'Search trash can...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {currentTab === 'active' ? (
            <button type="button" className="book-new-btn" onClick={() => setShowNewForm((v) => !v)}>
              <i className="fas fa-plus"></i> New Book
            </button>
          ) : (
            trashedBooks.length > 0 && (
              <button
                type="button"
                className="book-empty-trash-btn"
                onClick={handlePromptEmptyTrash}
              >
                <i className="fas fa-fire"></i> Empty Trash ({trashedBooks.length})
              </button>
            )
          )}
        </div>
      </div>

      {/* Library Tabs: Active vs. Trash Can */}
      <div className="book-manager-tabs-bar">
        <div className="book-tabs-left">
          <button
            type="button"
            className={`book-nav-tab ${currentTab === 'active' ? 'active' : ''}`}
            onClick={() => { setCurrentTab('active'); setShowNewForm(false); }}
          >
            <i className="fas fa-books"></i> Active Chronicles
            <span className="book-tab-badge">{normalizedBooks.length}</span>
          </button>
          <button
            type="button"
            className={`book-nav-tab ${currentTab === 'trash' ? 'active' : ''}`}
            onClick={() => { setCurrentTab('trash'); setShowNewForm(false); }}
          >
            <i className="fas fa-trash-can"></i> Trash Can
            {trashedBooks.length > 0 ? (
              <span className="book-tab-badge trash-active">{trashedBooks.length}</span>
            ) : (
              <span className="book-tab-badge">0</span>
            )}
          </button>
        </div>

        {currentTab === 'trash' && (
          <div className="trash-retention-notice">
            <i className="fas fa-clock-rotate-left"></i>
            <span>Items in Trash are preserved for <strong>7 days</strong> before permanent deletion.</span>
          </div>
        )}
      </div>

      {showNewForm && currentTab === 'active' && (
        <NewBookForm onCreate={handleCreate} onCancel={() => setShowNewForm(false)} />
      )}

      {/* Grid of Books */}
      <div className={`book-grid ${currentTab === 'trash' ? 'trash-grid-mode' : ''}`}>
        {filtered.map((book) => {
          const totalPages = (book.chapters || []).reduce((acc, ch) => acc + (ch.pages?.length || 0), 0);
          const totalTerms = (book.customTerms || []).length;
          const isTrashed = currentTab === 'trash';
          const timeInfo = isTrashed ? formatRemainingTime(book.trashedAt) : null;

          return (
            <div
              key={book.id}
              className={`book-card cover-${book.theme || 'parchment'} ${isTrashed ? 'trashed-card' : ''}`}
            >
              <div className="book-card-spine"></div>
              <div
                className="book-card-face"
                onClick={() => {
                  if (!isTrashed) setActiveBook(book.id);
                }}
                role={!isTrashed ? 'button' : undefined}
                tabIndex={!isTrashed ? 0 : undefined}
                onKeyDown={(e) => {
                  if (!isTrashed && e.key === 'Enter') setActiveBook(book.id);
                }}
              >
                <div className="book-card-cover">
                  {book.coverImage
                    ? <img src={book.coverImage} alt="" className="book-cover-img" />
                    : <div className="book-cover-ornament"><i className={isTrashed ? 'fas fa-book-skull' : 'fas fa-dragon'}></i></div>}
                  <div className="book-card-title">{book.title}</div>
                  {book.subtitle && <div className="book-card-subtitle">{book.subtitle}</div>}
                  {book.author && <div className="book-card-author">by {book.author}</div>}
                </div>

                {isTrashed && timeInfo && (
                  <div className={`trash-countdown-pill ${timeInfo.isExpiringSoon ? 'expiring-soon' : ''}`}>
                    <i className="fas fa-hourglass-half"></i> {timeInfo.label}
                  </div>
                )}

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

              {/* Action Toolbar */}
              <div className="book-card-toolbar">
                {!isTrashed ? (
                  <>
                    <button type="button" title="Read / Edit Book" onClick={() => setActiveBook(book.id)}>
                      <i className="fas fa-book-open"></i>
                    </button>
                    <button type="button" title="Duplicate Book" onClick={() => duplicateBook(book.id)}>
                      <i className="fas fa-copy"></i>
                    </button>
                    <button
                      type="button"
                      title="Move to Trash Can"
                      className="danger"
                      onClick={() => handlePromptTrash(book)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="restore-btn"
                      title="Restore Chronicle to Library"
                      onClick={() => handleRestore(book)}
                    >
                      <i className="fas fa-rotate-left"></i> Restore
                    </button>
                    <button
                      type="button"
                      className="danger permanent-btn"
                      title="Delete Permanently Forever"
                      onClick={() => handlePromptPermanent(book)}
                    >
                      <i className="fas fa-skull-crossbones"></i>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && !showNewForm && (
          <div className="book-empty-state">
            {currentTab === 'active' ? (
              <>
                <i className="fas fa-feather-pointed"></i>
                <h3>{books.length === 0 ? 'Your shelf awaits its first chronicle' : 'No books match your search'}</h3>
                <p>Bind a new book and start creating rich published-grade tabletop sourcebooks with monsters, items, spells, and live glossary tooltips.</p>
                <button type="button" className="book-new-btn large" onClick={() => setShowNewForm(true)}>
                  <i className="fas fa-plus"></i> Create Your First Book
                </button>
              </>
            ) : (
              <>
                <i className="fas fa-trash-can-arrow-up"></i>
                <h3>{trashedBooks.length === 0 ? 'The Trash Can is Empty' : 'No trashed books match your search'}</h3>
                <p>
                  Any sourcebooks you remove will be kept safely in this Trash Can for 7 days before permanent removal. You can restore them back to your shelf at any time.
                </p>
                <button
                  type="button"
                  className="book-new-btn"
                  onClick={() => setCurrentTab('active')}
                >
                  <i className="fas fa-books"></i> Return to Library
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Custom Pathfinder Delete Confirmation Modal */}
      <BookDeleteModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        book={modalState.book}
        itemCount={trashedBooks.length}
        onConfirm={handleConfirmModal}
        onCancel={() => setModalState({ isOpen: false, mode: 'trash', book: null })}
      />
    </div>
  );
};

export default BookManager;
