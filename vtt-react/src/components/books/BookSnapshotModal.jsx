import React, { useState } from 'react';
import './BookDocumentEditor.css';

const SNAPSHOT_TAGS = [
  { id: 'Draft', label: 'Draft', icon: 'fa-pencil', color: '#3498db' },
  { id: 'Campaign Handout', label: 'Campaign Handout', icon: 'fa-scroll', color: '#2ecc71' },
  { id: 'Boss / Encounter', label: 'Boss / Encounter', icon: 'fa-dragon', color: '#e74c3c' },
  { id: 'World Lore', label: 'World Lore', icon: 'fa-landmark', color: '#9b59b6' },
  { id: 'Session Notes', label: 'Session Notes', icon: 'fa-dice-d20', color: '#f39c12' },
  { id: 'Major Milestone', label: 'Major Milestone', icon: 'fa-crown', color: '#d4af37' }
];

export const BookSnapshotModal = ({
  isOpen,
  onClose,
  book,
  onCreateSnapshot,
  onRestoreSnapshot,
  onDeleteSnapshot
}) => {
  const [summary, setSummary] = useState('');
  const [note, setNote] = useState('');
  const [selectedTag, setSelectedTag] = useState('Draft');
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('all');
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);

  if (!isOpen || !book) return null;

  const revisions = Array.isArray(book.revisions) ? book.revisions : [];
  const currentChapterCount = (book.chapters || []).length;
  const currentPageCount = (book.chapters || []).reduce((acc, ch) => acc + (ch.pages?.length || 0), 0);
  const currentBlockCount = (book.chapters || []).reduce(
    (acc, ch) => acc + (ch.pages || []).reduce((bAcc, pg) => bAcc + (pg.blocks?.length || 0), 0),
    0
  );

  const handleCapture = (e) => {
    e.preventDefault();
    const finalSummary = summary.trim() || `Manual Checkpoint (${new Date().toLocaleTimeString()})`;
    onCreateSnapshot(book.id, finalSummary, {
      tag: selectedTag,
      note: note.trim()
    });
    setSummary('');
    setNote('');
    setSelectedTag('Draft');
  };

  const handleRestore = (rev) => {
    if (
      window.confirm(
        `Are you sure you want to restore the snapshot "${rev.summary}"?\n\nThis will replace the current draft with this version.`
      )
    ) {
      onRestoreSnapshot(book.id, rev.id);
      onClose();
    }
  };

  const handleDelete = (revId) => {
    if (window.confirm('Delete this revision snapshot from history?')) {
      onDeleteSnapshot(book.id, revId);
      if (selectedSnapshot?.id === revId) {
        setSelectedSnapshot(null);
      }
    }
  };

  const filteredRevisions = revisions.filter((rev) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      `${rev.summary} ${rev.note || ''} ${rev.tag || ''}`.toLowerCase().includes(q);
    const matchesTag = tagFilter === 'all' || rev.tag === tagFilter;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="book-modal-backdrop" onClick={onClose}>
      <div className="book-snapshot-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="book-snapshot-head">
          <div className="head-title">
            <i className="fas fa-clock-rotate-left"></i>
            <div>
              <h3>Revision Snapshots &amp; Checkpoints</h3>
              <p>Capture custom milestone versions, browse previous drafts, or rollback to a prior state.</p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* 2-Column Content Grid */}
        <div className="book-snapshot-content-grid">
          {/* Left Column: Capture New Snapshot */}
          <div className="snapshot-capture-pane">
            <form className="snapshot-capture-form" onSubmit={handleCapture}>
              <h4 className="pane-section-title">
                <i className="fas fa-camera"></i> Capture New Checkpoint
              </h4>

              {/* Current Book Metrics Strip */}
              <div className="current-state-strip">
                <div className="metric-pill">
                  <i className="fas fa-book"></i>
                  <span>{currentChapterCount} Chapters</span>
                </div>
                <div className="metric-pill">
                  <i className="fas fa-file-lines"></i>
                  <span>{currentPageCount} Pages</span>
                </div>
                <div className="metric-pill">
                  <i className="fas fa-cubes"></i>
                  <span>{currentBlockCount} Blocks</span>
                </div>
              </div>

              <div className="form-group">
                <label>Snapshot Label / Name:</label>
                <input
                  type="text"
                  className="form-input"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="e.g. Pre-Session 12 Handout, Act II Draft, Final Boss Lore..."
                />
              </div>

              <div className="form-group">
                <label>Category Tag:</label>
                <div className="snapshot-tags-strip">
                  {SNAPSHOT_TAGS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`snapshot-tag-chip ${selectedTag === t.id ? 'active' : ''}`}
                      onClick={() => setSelectedTag(t.id)}
                    >
                      <i className={`fas ${t.icon}`} style={{ color: t.color }}></i>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Author Notes (Optional):</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Notes about what changed, balance notes, encounter tweaks..."
                />
              </div>

              <button type="submit" className="btn-capture-snapshot">
                <i className="fas fa-floppy-disk"></i> Capture Checkpoint Snapshot
              </button>
            </form>
          </div>

          {/* Right Column: Snapshot History List */}
          <div className="snapshot-history-pane">
            <div className="history-toolbar">
              <div className="history-search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search snapshots by label or note..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Tag Filter Strip */}
            <div className="history-filter-strip">
              <button
                type="button"
                className={`filter-pill ${tagFilter === 'all' ? 'active' : ''}`}
                onClick={() => setTagFilter('all')}
              >
                All ({revisions.length})
              </button>
              {SNAPSHOT_TAGS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`filter-pill ${tagFilter === t.id ? 'active' : ''}`}
                  onClick={() => setTagFilter(t.id)}
                >
                  <i className={`fas ${t.icon}`} style={{ color: t.color }}></i>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Cards Scroll List */}
            <div className="snapshot-cards-scroll">
              {filteredRevisions.map((rev) => {
                const tagObj = SNAPSHOT_TAGS.find((t) => t.id === rev.tag) || SNAPSHOT_TAGS[0];
                const dateStr = rev.timestamp ? new Date(rev.timestamp).toLocaleString() : 'Unknown date';
                const chCount = rev.chapterCount || rev.snapshot?.chapters?.length || 1;
                const pgCount = rev.pageCount || (rev.snapshot?.chapters || []).reduce((a, c) => a + (c.pages?.length || 0), 0) || 1;

                return (
                  <div
                    key={rev.id}
                    className={`snapshot-history-card ${selectedSnapshot?.id === rev.id ? 'selected' : ''}`}
                    onClick={() => setSelectedSnapshot(rev)}
                  >
                    <div className="card-top">
                      <div className="snapshot-title-group">
                        <span className="snapshot-tag-badge" style={{ borderColor: tagObj.color, color: tagObj.color }}>
                          <i className={`fas ${tagObj.icon}`}></i> {rev.tag || 'Draft'}
                        </span>
                        <strong className="snapshot-summary-title">{rev.summary}</strong>
                      </div>
                      <span className="snapshot-date">{dateStr}</span>
                    </div>

                    {rev.note && <p className="snapshot-note-text">"{rev.note}"</p>}

                    <div className="card-bottom">
                      <div className="snapshot-metrics">
                        <span><i className="fas fa-book"></i> {chCount} Ch</span>
                        <span><i className="fas fa-file-lines"></i> {pgCount} Pg</span>
                        {rev.termCount !== undefined && <span><i className="fas fa-bookmark"></i> {rev.termCount} Terms</span>}
                      </div>

                      <div className="snapshot-card-actions">
                        <button
                          type="button"
                          className="btn-restore-snapshot"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestore(rev);
                          }}
                          title="Restore and Rollback to this Version"
                        >
                          <i className="fas fa-rotate-left"></i> Restore
                        </button>
                        <button
                          type="button"
                          className="btn-delete-snapshot"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(rev.id);
                          }}
                          title="Delete Snapshot"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredRevisions.length === 0 && (
                <div className="snapshot-empty-state">
                  <i className="fas fa-clock-rotate-left"></i>
                  <h4>No Snapshots Found</h4>
                  <p>Capture your first milestone checkpoint using the form on the left to preserve custom revisions.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSnapshotModal;
