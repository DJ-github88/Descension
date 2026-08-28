import React, { useEffect } from 'react';

/**
 * Custom Pathfinder/Parchment confirmation modal for book deletion and trash management.
 * Modes:
 * - 'trash': Soft delete (move to 7-day retention trash can)
 * - 'permanent': Hard delete single book
 * - 'empty-trash': Hard delete all trashed books
 */
const BookDeleteModal = ({
  isOpen,
  mode = 'trash', // 'trash' | 'permanent' | 'empty-trash'
  book = null,
  itemCount = 0,
  onConfirm,
  onCancel
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const totalPages = book
    ? (book.chapters || []).reduce((acc, ch) => acc + (ch.pages?.length || 0), 0)
    : 0;
  const totalChapters = book?.chapters?.length || 0;

  return (
    <div className="book-modal-backdrop" onClick={onCancel}>
      <div
        className="book-delete-modal parchment-frame"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-delete-title"
      >
        <div className="book-delete-modal-header">
          <div className="book-delete-icon-wrap">
            {mode === 'trash' ? (
              <i className="fas fa-trash-arrow-up book-delete-icon-trash"></i>
            ) : mode === 'empty-trash' ? (
              <i className="fas fa-fire-flame-curved book-delete-icon-perm"></i>
            ) : (
              <i className="fas fa-skull-crossbones book-delete-icon-perm"></i>
            )}
          </div>
          <h3 id="book-delete-title" className="book-delete-modal-title">
            {mode === 'trash' && 'Discard Chronicle to Trash Can?'}
            {mode === 'permanent' && 'Permanently Destroy Chronicle?'}
            {mode === 'empty-trash' && 'Empty Entire Trash Can?'}
          </h3>
        </div>

        <div className="book-delete-modal-body">
          {mode === 'trash' && book && (
            <>
              <div className="book-delete-card-preview">
                <div className="book-delete-preview-cover">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt="" className="book-delete-thumb" />
                  ) : (
                    <i className="fas fa-book-bookmark"></i>
                  )}
                </div>
                <div className="book-delete-preview-details">
                  <h4 className="book-delete-preview-title">{book.title || 'Untitled Chronicle'}</h4>
                  {book.subtitle && <p className="book-delete-preview-sub">{book.subtitle}</p>}
                  <div className="book-delete-preview-stats">
                    <span><i className="fas fa-bookmark"></i> {totalChapters} {totalChapters === 1 ? 'Chapter' : 'Chapters'}</span>
                    <span><i className="fas fa-file-lines"></i> {totalPages} {totalPages === 1 ? 'Page' : 'Pages'}</span>
                    {book.author && <span><i className="fas fa-feather"></i> {book.author}</span>}
                  </div>
                </div>
              </div>

              <div className="book-delete-info-banner">
                <div className="book-delete-info-icon">
                  <i className="fas fa-shield-halved"></i>
                </div>
                <div className="book-delete-info-text">
                  <strong>7-Day Safety Retention:</strong> This chronicle will be moved to the <strong>Trash Can</strong> and safely preserved for <strong>7 days</strong> before being permanently erased. You can restore it with all its lore, statblocks, and chapters intact at any time.
                </div>
              </div>
            </>
          )}

          {mode === 'permanent' && book && (
            <>
              <div className="book-delete-warning-banner">
                <i className="fas fa-triangle-exclamation"></i>
                <div className="book-delete-warning-text">
                  <strong>Irreversible Action:</strong> You are about to permanently erase <strong>"{book.title}"</strong>. All chapters, creature statblocks, spell formulae, item cards, and revision snapshots will be lost forever.
                </div>
              </div>
              <p className="book-delete-confirm-prompt">
                Are you sure you wish to permanently obliterate this chronicle?
              </p>
            </>
          )}

          {mode === 'empty-trash' && (
            <>
              <div className="book-delete-warning-banner">
                <i className="fas fa-triangle-exclamation"></i>
                <div className="book-delete-warning-text">
                  <strong>Permanent Obliteration:</strong> This will permanently incinerate all <strong>{itemCount}</strong> discarded {itemCount === 1 ? 'chronicle' : 'chronicles'} currently in the trash can.
                </div>
              </div>
              <p className="book-delete-confirm-prompt">
                This action cannot be undone. Do you wish to proceed?
              </p>
            </>
          )}
        </div>

        <div className="book-delete-modal-footer">
          <button
            type="button"
            className="book-delete-btn book-delete-btn-cancel"
            onClick={onCancel}
            autoFocus
          >
            <i className="fas fa-xmark"></i> {mode === 'trash' ? 'Keep Chronicle' : 'Cancel'}
          </button>
          <button
            type="button"
            className={`book-delete-btn ${mode === 'trash' ? 'book-delete-btn-trash' : 'book-delete-btn-danger'}`}
            onClick={onConfirm}
          >
            {mode === 'trash' && (
              <>
                <i className="fas fa-trash-can"></i> Move to Trash Can
              </>
            )}
            {mode === 'permanent' && (
              <>
                <i className="fas fa-skull-crossbones"></i> Destroy Forever
              </>
            )}
            {mode === 'empty-trash' && (
              <>
                <i className="fas fa-fire"></i> Empty Trash Forever
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDeleteModal;
