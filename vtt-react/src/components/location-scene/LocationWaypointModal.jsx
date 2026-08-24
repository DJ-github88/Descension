import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import RichLoreText from '../common/RichLoreText';

const LocationWaypointModal = ({
  waypoint,
  waypointIndex = 0,
  isGM,
  onSave,
  onDelete,
  onClose
}) => {
  const [title, setTitle] = useState(waypoint?.title || `Day ${waypointIndex + 1} Encampment`);
  const [day, setDay] = useState(waypoint?.day || waypointIndex + 1);
  const [notes, setNotes] = useState(waypoint?.notes || '');
  const [isSecretGM, setIsSecretGM] = useState(waypoint?.isSecretGM || false);
  const [isEditing, setIsEditing] = useState(isGM && !waypoint?.notes);

  const insertFormatting = (prefix, suffix = '') => {
    const textarea = document.getElementById('waypoint-notes-input');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = notes.substring(start, end);
    const before = notes.substring(0, start);
    const after = notes.substring(end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;
    const newContent = `${before}${replacement}${after}`;
    setNotes(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 10);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...(waypoint || {}),
        title: title.trim() || `Day ${day} Encampment`,
        day: Number(day) || (waypointIndex + 1),
        notes: notes.trim(),
        isSecretGM: Boolean(isSecretGM)
      });
    }
    setIsEditing(false);
  };

  return ReactDOM.createPortal(
    <div className="location-pin-modal-backdrop" onClick={onClose}>
      <div className="location-pin-modal" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="location-pin-modal-header">
          <div className="modal-header-identity">
            <div className="modal-pin-icon-box" style={{ background: 'radial-gradient(circle at 35% 35%, #d4af37 0%, #3a220a 100%)', borderColor: '#d4af37' }}>
              <span style={{ fontSize: '15px', fontWeight: 900, color: '#1a0802' }}>{day}</span>
            </div>
            <div className="modal-pin-titles">
              <span className="modal-pin-type-tag">EXPEDITION ROUTE WAYPOINT</span>
              <h3>{title}</h3>
            </div>
          </div>
          <button className="modal-btn-close" onClick={onClose} title="Close">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Body */}
        <div className="location-pin-modal-body">
          {isEditing && isGM ? (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#5c3e21', marginBottom: '4px' }}>
                    Waypoint Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Day 3 — Sunken Ruins Crossing"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#fdfaf0',
                      border: '1.5px solid #8c6738',
                      borderRadius: '6px',
                      color: '#2b1810',
                      fontFamily: 'Cinzel, serif',
                      fontWeight: 700
                    }}
                  />
                </div>
                <div style={{ width: '90px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#5c3e21', marginBottom: '4px' }}>
                    Day #
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#fdfaf0',
                      border: '1.5px solid #8c6738',
                      borderRadius: '6px',
                      color: '#2b1810',
                      fontWeight: 800
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#5c3e21' }}>
                    Camp Chronicle &amp; Encampment Notes
                  </label>
                  {/* Rich Text Format Bar */}
                  <div style={{ display: 'flex', gap: '3px' }}>
                    <button type="button" className="btn-gm-action" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={() => insertFormatting('**', '**')} title="Bold"><b>B</b></button>
                    <button type="button" className="btn-gm-action" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={() => insertFormatting('*', '*')} title="Italic"><i>I</i></button>
                    <button type="button" className="btn-gm-action" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={() => insertFormatting('<u>', '</u>')} title="Underline"><u>U</u></button>
                    <button type="button" className="btn-gm-action" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={() => insertFormatting('~~', '~~')} title="Strikethrough"><s>S</s></button>
                    <button type="button" className="btn-gm-action" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={() => insertFormatting('# ')} title="Heading 1">H1</button>
                    <button type="button" className="btn-gm-action" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={() => insertFormatting('- ')} title="Bullet List">• List</button>
                    <button type="button" className="btn-gm-action" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={() => insertFormatting('> ')} title="Quote">“ Quote</button>
                    <button type="button" className="btn-gm-action" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={() => insertFormatting('![Illustration](', ')')} title="Image">🖼 Img</button>
                  </div>
                </div>

                <textarea
                  id="waypoint-notes-input"
                  rows={5}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record terrain obstacles, wilderness random encounters, weather events, foraging successes..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#fdfaf0',
                    border: '1.5px solid #8c6738',
                    borderRadius: '6px',
                    color: '#2b1810',
                    fontSize: '13px',
                    lineHeight: '1.5'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#8a1f11', fontSize: '12px', fontWeight: 700 }}>
                  <input
                    type="checkbox"
                    checked={isSecretGM}
                    onChange={(e) => setIsSecretGM(e.target.checked)}
                  />
                  <i className="fas fa-eye-slash"></i> Secret Waypoint (Hidden from players)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button type="button" className="btn-gm-action" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-gm-action active" style={{ fontWeight: 800 }}>
                  <i className="fas fa-check"></i> Save Waypoint Notes
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: '#6d4c28', fontStyle: 'italic' }}>
                  <i className="fas fa-campground" style={{ color: '#d4af37' }}></i> Day {day} Journey Stop
                </span>
                {isGM && (
                  <button type="button" className="btn-gm-action" onClick={() => setIsEditing(true)} style={{ fontSize: '11px', padding: '4px 10px' }}>
                    <i className="fas fa-pen"></i> Edit Waypoint
                  </button>
                )}
              </div>

              {notes ? (
                <div style={{ background: '#fdfbf5', padding: '14px', borderRadius: '8px', border: '1px solid #e8dcbe' }}>
                  <RichLoreText text={notes} className="parchment-theme" />
                </div>
              ) : (
                <p style={{ color: '#7a6a53', fontStyle: 'italic', margin: 0 }}>
                  No wilderness travel notes recorded for this encampment yet.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="location-pin-modal-footer">
          {isGM && onDelete && (
            <button
              type="button"
              className="btn-gm-action btn-delete-pin"
              onClick={() => {
                if (window.confirm('Delete this route waypoint?')) {
                  onDelete(waypoint.id);
                  onClose();
                }
              }}
            >
              <i className="fas fa-trash"></i> Delete Waypoint
            </button>
          )}
          <button type="button" className="btn-gm-action" onClick={onClose} style={{ marginLeft: 'auto' }}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LocationWaypointModal;
