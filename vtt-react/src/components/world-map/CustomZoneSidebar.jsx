import React, { useMemo, useState, useRef } from 'react';
import './LoreSidebar.css';

const ENTRY_TYPE_CONFIG = {
  continent: { label: 'Continent', icon: 'fa-earth-americas', color: 'rgba(135, 104, 196, 0.9)', badgeClass: 'badge-continent' },
  region: { label: 'Region', icon: 'fa-mountain-sun', color: 'rgba(196, 164, 74, 0.9)', badgeClass: 'badge-region' },
  subregion: { label: 'Subregion', icon: 'fa-map-location-dot', color: 'rgba(83, 151, 190, 0.9)', badgeClass: 'badge-subregion' },
  location: { label: 'Location / POI', icon: 'fa-location-dot', color: 'rgba(235, 190, 85, 0.9)', badgeClass: 'badge-location' }
};

// Inline parser for bold, italic/cursive, underline, and strikethrough
const parseInline = (text) => {
  if (!text) return '';

  const parts = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|<u>.*?<\/u>|~~.*?~~)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(<strong key={match.index} className="lore-bold">{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(<em key={match.index} className="lore-italic">{token.slice(1, -1)}</em>);
    } else if (token.startsWith('<u>') && token.endsWith('</u>')) {
      parts.push(<u key={match.index} className="lore-underline">{token.slice(3, -4)}</u>);
    } else if (token.startsWith('~~') && token.endsWith('~~')) {
      parts.push(<s key={match.index} className="lore-strike">{token.slice(2, -2)}</s>);
    } else {
      parts.push(token);
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

// Simple safe markdown renderer for rich lore preview
const renderLoreMarkdown = (text = '') => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      elements.push(<div key={idx} className="lore-spacer" />);
      return;
    }

    // Divider
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      elements.push(<hr key={idx} className="lore-divider" />);
      return;
    }

    // Headings
    if (trimmed.startsWith('# ')) {
      elements.push(<h3 key={idx} className="lore-h1">{parseInline(trimmed.slice(2))}</h3>);
      return;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(<h4 key={idx} className="lore-h2">{parseInline(trimmed.slice(3))}</h4>);
      return;
    }
    if (trimmed.startsWith('### ')) {
      elements.push(<h5 key={idx} className="lore-h3">{parseInline(trimmed.slice(4))}</h5>);
      return;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      elements.push(<blockquote key={idx} className="lore-blockquote">{parseInline(trimmed.slice(2))}</blockquote>);
      return;
    }

    // Bullet list
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <div key={idx} className="lore-list-item">
          <span className="lore-bullet">✦</span>
          <span>{parseInline(trimmed.slice(2))}</span>
        </div>
      );
      return;
    }

    // Paragraph
    elements.push(<p key={idx} className="lore-paragraph">{parseInline(line)}</p>);
  });

  return <div className="lore-formatted-preview">{elements}</div>;
};

const CustomZoneSidebar = ({
  zone,
  allZones = [],
  isOpen,
  onClose,
  onUpdateZone,
  onDeleteZone,
  onFocusZone,
  onAddLocationToRegion,
  onSelectZone
}) => {
  const [loreMode, setLoreMode] = useState('write'); // 'write' | 'preview'
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const typeConfig = ENTRY_TYPE_CONFIG[zone?.kind] || ENTRY_TYPE_CONFIG.region;
  const isPolygon = zone?.kind !== 'location' && zone?.geometry !== 'point';

  // Find parent zone if applicable
  const parentZone = zone?.parentId ? allZones.find((z) => z.id === zone.parentId) : null;

  // Find child locations that belong to this region or subregion
  const childLocations = useMemo(() => {
    if (!zone) return [];
    return (allZones || []).filter((z) => {
      if (z.id === zone.id) return false;
      return z.parentId === zone.id;
    });
  }, [allZones, zone?.id]);

  if (!isOpen || !zone) return null;

  const pointCount = zone.points?.length || 0;
  const zoneImage = zone.image || zone.imageUrl || null;

  // Insert markdown tag at textarea selection
  const insertFormatting = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = zone.lore || '';
    const selectedText = currentVal.substring(start, end) || 'text';
    const replacement = `${prefix}${selectedText}${suffix}`;
    const nextVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);

    if (onUpdateZone) {
      onUpdateZone(zone.id, { lore: nextVal });
    }

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 10);
  };

  // Image Upload Handler
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      if (onUpdateZone) {
        onUpdateZone(zone.id, { image: dataUrl, imageUrl: dataUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyImageUrl = (e) => {
    e.preventDefault();
    if (tempImageUrl.trim() && onUpdateZone) {
      onUpdateZone(zone.id, { image: tempImageUrl.trim(), imageUrl: tempImageUrl.trim() });
      setTempImageUrl('');
      setShowImageUrlInput(false);
    }
  };

  const handleRemoveImage = () => {
    if (onUpdateZone) {
      onUpdateZone(zone.id, { image: null, imageUrl: null });
    }
  };

  return (
    <aside className="custom-zone-sidebar open animate-fade-in" aria-label="Custom zone details">
      <div className="custom-zone-sidebar-accent" style={{ background: zone.color || typeConfig.color }} />

      <div className="custom-zone-sidebar-header">
        <div className="custom-zone-header-top">
          <span className={`custom-zone-type-badge ${typeConfig.badgeClass}`}>
            <i className={`fas ${typeConfig.icon}`}></i> {typeConfig.label}
          </span>
          <button
            type="button"
            className="custom-zone-close-btn"
            onClick={onClose}
            title="Close sidebar popup"
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {parentZone && (
          <div className="custom-zone-breadcrumbs">
            <button
              type="button"
              className="breadcrumb-link"
              onClick={() => onSelectZone && onSelectZone(parentZone.id)}
            >
              <i className="fas fa-chevron-left"></i> {parentZone.name || 'Parent Region'}
            </button>
          </div>
        )}

        <div className="custom-zone-title-wrap">
          <input
            type="text"
            className="custom-zone-name-input"
            value={zone.name || ''}
            placeholder={`Name this ${typeConfig.label.toLowerCase()}...`}
            onChange={(e) => onUpdateZone && onUpdateZone(zone.id, { name: e.target.value })}
            aria-label="Zone name"
          />
        </div>
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="custom-zone-action-bar">
        {onFocusZone && (
          <button
            type="button"
            className="zone-action-btn focus-btn"
            onClick={() => onFocusZone(zone)}
            title="Smoothly zoom and center map on this realm"
          >
            <i className="fas fa-compass"></i>
            <span>Go There / Focus</span>
          </button>
        )}

        {isPolygon && onAddLocationToRegion && (
          <button
            type="button"
            className="zone-action-btn add-loc-btn"
            onClick={() => onAddLocationToRegion(zone.id)}
            title="Add a point of interest or location inside this region"
          >
            <i className="fas fa-location-dot"></i>
            <span>+ Add Location</span>
          </button>
        )}

        {onDeleteZone && (
          <button
            type="button"
            className="zone-action-btn delete-btn"
            onClick={() => {
              if (window.confirm(`Delete "${zone.name || 'this entry'}" from custom map?`)) {
                onDeleteZone(zone.id);
                onClose();
              }
            }}
            title="Remove this zone from world"
          >
            <i className="fas fa-trash"></i>
          </button>
        )}
      </div>

      {/* Overview Stats Pill */}
      <div className="custom-zone-meta-strip">
        <div className="zone-meta-item">
          <span className="meta-val">{isPolygon ? `${pointCount} pts` : 'Coordinate Pin'}</span>
          <span className="meta-lbl">Geometry</span>
        </div>
        {isPolygon && (
          <>
            <div className="zone-meta-divider" />
            <div className="zone-meta-item">
              <span className="meta-val">{childLocations.length}</span>
              <span className="meta-lbl">Locations</span>
            </div>
          </>
        )}
        <div className="zone-meta-divider" />
        <div className="zone-meta-item">
          <span className="meta-val">{zone.lore ? 'Documented' : 'Draft'}</span>
          <span className="meta-lbl">Lore Status</span>
        </div>
      </div>

      {/* Artwork & Heraldry Banner Section */}
      <div className="custom-zone-section artwork-section">
        <div className="custom-zone-section-header">
          <div className="section-title-wrap">
            <i className="fas fa-image"></i>
            <h4>Realm Artwork & Heraldry</h4>
          </div>
          {zoneImage && (
            <button
              type="button"
              className="zone-remove-img-btn"
              onClick={handleRemoveImage}
              title="Remove attached artwork"
            >
              <i className="fas fa-trash-can"></i>
            </button>
          )}
        </div>

        {zoneImage ? (
          <div className="zone-artwork-banner animate-fade-in">
            <img src={zoneImage} alt={zone.name || 'Realm artwork'} className="zone-artwork-img" />
            <div className="zone-artwork-overlay">
              <button
                type="button"
                className="zone-change-img-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <i className="fas fa-camera"></i> Change Image
              </button>
            </div>
          </div>
        ) : (
          <div className="zone-artwork-empty">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <button
              type="button"
              className="zone-upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <i className="fas fa-upload"></i> Upload Image File
            </button>
            <button
              type="button"
              className="zone-url-toggle-btn"
              onClick={() => setShowImageUrlInput(!showImageUrlInput)}
            >
              <i className="fas fa-link"></i> {showImageUrlInput ? 'Cancel URL' : 'Attach via Image URL'}
            </button>

            {showImageUrlInput && (
              <form onSubmit={handleApplyImageUrl} className="zone-img-url-form animate-fade-in">
                <input
                  type="url"
                  className="zone-img-url-input"
                  placeholder="https://.../map-artwork.png"
                  value={tempImageUrl}
                  onChange={(e) => setTempImageUrl(e.target.value)}
                />
                <button type="submit" className="zone-img-url-submit">
                  <i className="fas fa-check"></i>
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Child Locations inside this Region */}
      {isPolygon && (
        <div className="custom-zone-section child-locations-section">
          <div className="custom-zone-section-header">
            <div className="section-title-wrap">
              <i className="fas fa-landmark"></i>
              <h4>Locations in this Realm</h4>
            </div>
            {onAddLocationToRegion && (
              <button
                type="button"
                className="section-add-btn"
                onClick={() => onAddLocationToRegion(zone.id)}
                title="Place location on map inside this realm"
              >
                <i className="fas fa-plus"></i> Add
              </button>
            )}
          </div>

          {childLocations.length > 0 ? (
            <div className="child-locations-list">
              {childLocations.map((loc) => (
                <div key={loc.id} className="child-location-card">
                  <div
                    className="child-location-info"
                    onClick={() => {
                      if (onFocusZone) onFocusZone(loc);
                      if (onSelectZone) onSelectZone(loc.id);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <i className="fas fa-location-dot loc-marker-icon"></i>
                    <div className="child-location-text">
                      <strong>{loc.name || 'Unnamed Location'}</strong>
                      {loc.lore && <p className="child-lore-preview">{loc.lore}</p>}
                    </div>
                  </div>
                  <div className="child-location-actions">
                    <button
                      type="button"
                      className="child-jump-btn"
                      onClick={() => onFocusZone && onFocusZone(loc)}
                      title="Jump camera to location"
                    >
                      <i className="fas fa-crosshairs"></i>
                    </button>
                    <button
                      type="button"
                      className="child-delete-btn"
                      onClick={() => onDeleteZone && onDeleteZone(loc.id)}
                      title="Delete location"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="child-locations-empty">
              <i className="fas fa-map-pin"></i>
              <p>No locations added to this realm yet.</p>
              {onAddLocationToRegion && (
                <button
                  type="button"
                  className="empty-add-location-btn"
                  onClick={() => onAddLocationToRegion(zone.id)}
                >
                  <i className="fas fa-plus"></i> Place First Location Here
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Lore and World Notes Editor with Rich Formatting */}
      <div className="custom-zone-section lore-editor-section">
        <div className="custom-zone-section-header">
          <div className="section-title-wrap">
            <i className="fas fa-book-open"></i>
            <h4>Lore & Notes</h4>
          </div>
          <div className="lore-mode-toggle">
            <button
              type="button"
              className={`lore-tab-btn ${loreMode === 'write' ? 'active' : ''}`}
              onClick={() => setLoreMode('write')}
            >
              <i className="fas fa-pen-nib"></i> Write
            </button>
            <button
              type="button"
              className={`lore-tab-btn ${loreMode === 'preview' ? 'active' : ''}`}
              onClick={() => setLoreMode('preview')}
            >
              <i className="fas fa-scroll"></i> Codex View
            </button>
          </div>
        </div>

        {loreMode === 'write' ? (
          <>
            {/* Rich Markdown Formatting Toolbar */}
            <div className="lore-format-toolbar">
              <button
                type="button"
                className="format-btn"
                onClick={() => insertFormatting('**', '**')}
                title="Bold (**text**)"
              >
                <i className="fas fa-bold"></i>
              </button>
              <button
                type="button"
                className="format-btn"
                onClick={() => insertFormatting('*', '*')}
                title="Cursive / Italic (*text*)"
              >
                <i className="fas fa-italic"></i>
              </button>
              <button
                type="button"
                className="format-btn"
                onClick={() => insertFormatting('<u>', '</u>')}
                title="Underline (<u>text</u>)"
              >
                <i className="fas fa-underline"></i>
              </button>
              <button
                type="button"
                className="format-btn"
                onClick={() => insertFormatting('~~', '~~')}
                title="Strikethrough (~~text~~)"
              >
                <i className="fas fa-strikethrough"></i>
              </button>
              <span className="format-divider" />
              <button
                type="button"
                className="format-btn font-cinzel"
                onClick={() => insertFormatting('# ')}
                title="Header 1 (# Title)"
              >
                H1
              </button>
              <button
                type="button"
                className="format-btn font-cinzel"
                onClick={() => insertFormatting('## ')}
                title="Header 2 (## Subtitle)"
              >
                H2
              </button>
              <button
                type="button"
                className="format-btn font-cinzel"
                onClick={() => insertFormatting('### ')}
                title="Header 3 (### Section)"
              >
                H3
              </button>
              <span className="format-divider" />
              <button
                type="button"
                className="format-btn"
                onClick={() => insertFormatting('- ')}
                title="Bullet list (- Item)"
              >
                <i className="fas fa-list-ul"></i>
              </button>
              <button
                type="button"
                className="format-btn"
                onClick={() => insertFormatting('> ')}
                title="Chronicle / Quote (> Quote)"
              >
                <i className="fas fa-quote-left"></i>
              </button>
              <button
                type="button"
                className="format-btn"
                onClick={() => insertFormatting('\n---\n')}
                title="Divider (---)"
              >
                <i className="fas fa-minus"></i>
              </button>
            </div>

            <textarea
              ref={textareaRef}
              className="custom-zone-lore-textarea"
              value={zone.lore || ''}
              placeholder="Record ancient lore, noble houses, natural hazards, ancient ruins, tavern gossip, or factions governing this realm..."
              rows={6}
              onChange={(e) => onUpdateZone && onUpdateZone(zone.id, { lore: e.target.value })}
              aria-label="Zone lore notes"
            />
          </>
        ) : (
          <div className="lore-preview-container">
            {zone.lore?.trim() ? (
              renderLoreMarkdown(zone.lore)
            ) : (
              <p className="lore-preview-empty">No lore documented yet. Switch to Write mode to craft chronicles.</p>
            )}
          </div>
        )}
      </div>

      {/* Color Customization */}
      <div className="custom-zone-section color-section">
        <div className="custom-zone-section-header">
          <div className="section-title-wrap">
            <i className="fas fa-palette"></i>
            <h4>Boundary Tone</h4>
          </div>
        </div>
        <div className="custom-zone-color-presets">
          {[
            { color: 'rgba(196, 164, 74, 0.28)', stroke: '#f1d48a', label: 'Gold' },
            { color: 'rgba(135, 104, 196, 0.28)', stroke: '#b39ddb', label: 'Purple' },
            { color: 'rgba(83, 151, 190, 0.28)', stroke: '#81d4fa', label: 'Sky' },
            { color: 'rgba(76, 175, 80, 0.28)', stroke: '#a5d6a7', label: 'Emerald' },
            { color: 'rgba(244, 67, 54, 0.28)', stroke: '#ef9a9a', label: 'Crimson' },
            { color: 'rgba(255, 152, 0, 0.28)', stroke: '#ffcc80', label: 'Amber' }
          ].map((preset, i) => (
            <button
              key={i}
              type="button"
              className="color-preset-pill"
              style={{ background: preset.stroke }}
              onClick={() => onUpdateZone && onUpdateZone(zone.id, { color: preset.color, stroke: preset.stroke })}
              title={preset.label}
              aria-label={preset.label}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default CustomZoneSidebar;
