import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import RichLoreText from '../common/RichLoreText';

const LocationPartyModal = ({
  partyMarker,
  isGM,
  onSave,
  onClose
}) => {
  const [name, setName] = useState(partyMarker?.name || 'The Party');
  const [status, setStatus] = useState(partyMarker?.status || 'Active Expedition');
  const [scale, setScale] = useState(partyMarker?.scale !== undefined ? partyMarker.scale : 1.0);
  const [notes, setNotes] = useState(partyMarker?.notes || '');
  const [isEditing, setIsEditing] = useState(isGM && (!partyMarker?.notes && !partyMarker?.name));

  const insertFormatting = (prefix, suffix = '') => {
    const textarea = document.getElementById('party-notes-input');
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
        ...(partyMarker || {}),
        name: name.trim() || 'The Party',
        status: status.trim() || 'Active Expedition',
        scale,
        notes: notes.trim()
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
            <div className="modal-pin-icon-box" style={{ background: 'radial-gradient(circle at 35% 35%, #ffd700 0%, #3a220a 100%)', borderColor: '#ffd700' }}>
              <i className="fas fa-shield-halved"></i>
            </div>
            <div className="modal-pin-titles">
              <span className="modal-pin-type-tag">PARTY EXPEDITION BEACON</span>
              <h3>{name}</h3>
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
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#5c3e21', marginBottom: '4px' }}>
                  Party / Fellowship Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. The Silver Blades, Heroes of Sundale"
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

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#5c3e21', marginBottom: '4px' }}>
                  Expedition Status
                </label>
                <input
                  type="text"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder="e.g. En route to Emberspire, Long Rest at Tavern"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#fdfaf0',
                    border: '1.5px solid #8c6738',
                    borderRadius: '6px',
                    color: '#2b1810'
                  }}
                />
              </div>

              {/* Beacon Size Scale */}
              <div style={{ padding: '10px 12px', background: '#f8f3e6', borderRadius: '8px', border: '1.5px solid #8c6738' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#5c3e21', margin: 0 }}>
                    <i className="fas fa-shield-halved" style={{ color: '#d4af37', marginRight: '6px' }} />
                    Beacon Marker Scale: <strong>{scale.toFixed(2)}x</strong>
                  </label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[
                      { label: '0.6x', val: 0.6 },
                      { label: '0.85x', val: 0.85 },
                      { label: '1.0x', val: 1.0 },
                      { label: '1.35x', val: 1.35 },
                      { label: '1.75x', val: 1.75 }
                    ].map(p => (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => setScale(p.val)}
                        style={{
                          padding: '2px 6px',
                          fontSize: '10px',
                          fontWeight: 700,
                          borderRadius: '4px',
                          background: Math.abs(scale - p.val) < 0.05 ? '#d4af37' : '#fdfaf0',
                          color: Math.abs(scale - p.val) < 0.05 ? '#1a0f05' : '#5c3e21',
                          border: '1px solid #8c6738',
                          cursor: 'pointer'
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '10px', color: '#6d4c28', fontWeight: 700 }}>Compact</span>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.05"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    style={{ flex: 1, accentColor: '#8c6738', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '10px', color: '#6d4c28', fontWeight: 700 }}>Heroic</span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#5c3e21' }}>
                    Party Camp Log &amp; Travel Notes
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
                    <button type="button" className="btn-gm-action" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={() => insertFormatting('![Map Artwork](', ')')} title="Image">🖼 Img</button>
                  </div>
                </div>

                <textarea
                  id="party-notes-input"
                  rows={5}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record travel progress, rations count, marching order, camp watches..."
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button type="button" className="btn-gm-action" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-gm-action active" style={{ fontWeight: 800 }}>
                  <i className="fas fa-check"></i> Save Party Details
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: '#6d4c28', fontStyle: 'italic' }}>
                  <i className="fas fa-compass" style={{ color: '#d4af37' }}></i> Status: <strong>{status}</strong>
                </span>
                {isGM && (
                  <button type="button" className="btn-gm-action" onClick={() => setIsEditing(true)} style={{ fontSize: '11px', padding: '4px 10px' }}>
                    <i className="fas fa-pen"></i> Edit Party Notes
                  </button>
                )}
              </div>

              {notes ? (
                <div style={{ background: '#fdfbf5', padding: '14px', borderRadius: '8px', border: '1px solid #e8dcbe' }}>
                  <RichLoreText text={notes} className="parchment-theme" />
                </div>
              ) : (
                <p style={{ color: '#7a6a53', fontStyle: 'italic', margin: 0 }}>
                  No expedition notes or marching orders recorded yet.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="location-pin-modal-footer">
          <div style={{ fontSize: '11px', color: '#5c3e21' }}>
            <i className="fas fa-location-crosshairs"></i> Drag beacon anywhere to relocate party
          </div>
          <button type="button" className="btn-gm-action" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LocationPartyModal;
