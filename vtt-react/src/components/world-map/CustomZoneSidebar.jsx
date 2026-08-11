import React, { useMemo, useState, useRef } from 'react';
import './LoreSidebar.css';

const ENTRY_TYPE_CONFIG = {
  continent: { label: 'Continent', icon: 'fa-earth-americas', color: 'rgba(135, 104, 196, 0.9)', badgeClass: 'badge-continent' },
  region: { label: 'Region', icon: 'fa-mountain-sun', color: 'rgba(196, 164, 74, 0.9)', badgeClass: 'badge-region' },
  subregion: { label: 'Subregion', icon: 'fa-map-location-dot', color: 'rgba(83, 151, 190, 0.9)', badgeClass: 'badge-subregion' },
  location: { label: 'Location / POI', icon: 'fa-location-dot', color: 'rgba(235, 190, 85, 0.9)', badgeClass: 'badge-location' }
};

// Inline parser for bold, italic/cursive, underline, strikethrough, and highlight
const parseInline = (text) => {
  if (!text) return '';

  const parts = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|<u>.*?<\/u>|~~.*?~~|==.*?==)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(<strong key={match.index} className="lore-bold">{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('==') && token.endsWith('==')) {
      parts.push(<mark key={match.index} className="lore-highlight">{token.slice(2, -2)}</mark>);
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

// Block type config for :::type fenced blocks
const BLOCK_TYPES = {
  readaloud: { className: 'lore-readaloud', icon: 'fa-book-open-reader', label: 'Read Aloud' },
  statblock: { className: 'lore-statblock', icon: 'fa-shield-halved', label: 'Stat Block' },
  dmnote:    { className: 'lore-dmnote',    icon: 'fa-eye-slash',      label: 'DM Note' },
  quest:     { className: 'lore-quest',     icon: 'fa-scroll',         label: 'Quest Hook' },
  npc:       { className: 'lore-npc',       icon: 'fa-masks-theater',  label: 'NPC' },
  loot:      { className: 'lore-loot',      icon: 'fa-gem',            label: 'Treasure' },
  scroll:    { className: 'lore-scroll',    icon: 'fa-wand-sparkles',  label: 'Scroll' },
};

// ── Specialized renderer: STAT BLOCK as a proper table (Mythrill system) ──
const renderStatBlockBody = (lines, baseKey) => {
  const statRows = [];
  const abilityScores = {};
  const textLines = [];
  // Mythrill's six base abilities: STR, AGI (agility), CON, INT, SPI (spirit), CHA
  const ABILITY_NAMES = ['STR', 'AGI', 'CON', 'INT', 'SPI', 'CHA'];
  // Legacy aliases so older D&D-style stat blocks (DEX/WIS) still render in the grid
  const ABILITY_ALIASES = { DEX: 'AGI', WIS: 'SPI' };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const statMatch = trimmed.match(/^([A-Za-z ]+):\s+(.+)$/);
    if (statMatch) {
      const key = statMatch[1].trim().toUpperCase();
      const canonical = ABILITY_ALIASES[key] || key;
      if (ABILITY_NAMES.includes(canonical)) {
        abilityScores[canonical] = statMatch[2].trim();
      } else {
        statRows.push({ key: statMatch[1].trim(), val: statMatch[2].trim() });
      }
    } else if (trimmed === '---' || trimmed === '***') {
      statRows.push({ divider: true });
    } else {
      textLines.push(trimmed);
    }
  });

  const hasAbilities = Object.keys(abilityScores).length > 0;

  return (
    <>
      {/* Core stat table */}
      {statRows.length > 0 && (
        <table className="statblock-table">
          <tbody>
            {statRows.map((row, i) =>
              row.divider ? (
                <tr key={`${baseKey}-d-${i}`}><td colSpan={2}><hr className="statblock-divider" /></td></tr>
              ) : (
                <tr key={`${baseKey}-r-${i}`} className="statblock-row">
                  <td className="statblock-key">{row.key}</td>
                  <td className="statblock-val">{parseInline(row.val)}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}

      {/* Ability score grid (D&D style 6-column) */}
      {hasAbilities && (
        <div className="statblock-abilities">
          {ABILITY_NAMES.map((ab) => (
            <div key={ab} className="ability-cell">
              <span className="ability-label">{ab}</span>
              <span className="ability-score">{abilityScores[ab] || '—'}</span>
            </div>
          ))}
        </div>
      )}

      {/* Any free text lines */}
      {textLines.map((t, i) => (
        <p key={`${baseKey}-t-${i}`} className="lore-paragraph">{parseInline(t)}</p>
      ))}
    </>
  );
};

// ── Specialized renderer: LOOT as an item inventory ──
const renderLootBody = (lines, baseKey) => {
  const items = [];
  const textLines = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // "- Item Name (details)" or "* Item"
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      items.push(trimmed.slice(2));
    } else {
      const kvMatch = trimmed.match(/^([A-Za-z ]+):\s+(.+)$/);
      if (kvMatch) {
        items.push({ key: kvMatch[1].trim(), val: kvMatch[2].trim() });
      } else {
        textLines.push(trimmed);
      }
    }
  });

  return (
    <>
      {textLines.map((t, i) => (
        <p key={`${baseKey}-t-${i}`} className="lore-paragraph">{parseInline(t)}</p>
      ))}
      {items.length > 0 && (
        <ul className="loot-item-list">
          {items.map((item, i) =>
            typeof item === 'string' ? (
              <li key={`${baseKey}-i-${i}`} className="loot-item">
                <i className="fas fa-coins loot-coin-icon"></i>
                <span>{parseInline(item)}</span>
              </li>
            ) : (
              <li key={`${baseKey}-i-${i}`} className="loot-item loot-kv">
                <span className="loot-item-key">{item.key}</span>
                <span className="loot-item-val">{parseInline(item.val)}</span>
              </li>
            )
          )}
        </ul>
      )}
    </>
  );
};

// ── General inner renderer for other blocks ──
const renderBlockInner = (lines, baseKey) => {
  return lines.map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={`${baseKey}-${i}`} className="lore-spacer" />;

    // Stat-line: "Key: Value"
    const statMatch = trimmed.match(/^([A-Za-z ]+):\s+(.+)$/);
    if (statMatch) {
      return (
        <div key={`${baseKey}-${i}`} className="lore-stat-line">
          <span className="lore-stat-key">{statMatch[1]}</span>
          <span className="lore-stat-val">{parseInline(statMatch[2])}</span>
        </div>
      );
    }
    // Bullet inside block
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return (
        <div key={`${baseKey}-${i}`} className="lore-list-item">
          <span className="lore-bullet">✦</span>
          <span>{parseInline(trimmed.slice(2))}</span>
        </div>
      );
    }
    return <p key={`${baseKey}-${i}`} className="lore-paragraph">{parseInline(line)}</p>;
  });
};

// Simple safe markdown renderer for rich lore preview — with TTRPG blocks
const renderLoreMarkdown = (text = '') => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // ─── Fenced TTRPG Block (:::type … :::) ───
    const blockOpenMatch = trimmed.match(/^:::(\w+)(?:\s+(.*))?$/);
    if (blockOpenMatch) {
      const blockType = blockOpenMatch[1].toLowerCase();
      const blockTitle = blockOpenMatch[2] || '';
      const config = BLOCK_TYPES[blockType];
      if (config) {
        const innerLines = [];
        i++;
        while (i < lines.length && lines[i].trim() !== ':::') {
          innerLines.push(lines[i]);
          i++;
        }
        i++; // skip closing :::

        // Choose specialized renderer based on block type
        let bodyContent;
        if (blockType === 'statblock') {
          bodyContent = renderStatBlockBody(innerLines, `blk-${i}`);
        } else if (blockType === 'loot') {
          bodyContent = renderLootBody(innerLines, `blk-${i}`);
        } else {
          bodyContent = renderBlockInner(innerLines, `blk-${i}`);
        }

        elements.push(
          <div key={`block-${i}`} className={`lore-block ${config.className}`}>
            <div className="lore-block-header">
              <i className={`fas ${config.icon}`}></i>
              <span>{blockTitle || config.label}</span>
            </div>
            <div className="lore-block-body">
              {bodyContent}
            </div>
          </div>
        );
        continue;
      }
    }

    // ─── Empty line ───
    if (!trimmed) {
      elements.push(<div key={i} className="lore-spacer" />);
      i++;
      continue;
    }

    // ─── Divider ───
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      elements.push(<hr key={i} className="lore-divider" />);
      i++;
      continue;
    }

    // ─── Headings ───
    if (trimmed.startsWith('# ')) {
      elements.push(<h3 key={i} className="lore-h1">{parseInline(trimmed.slice(2))}</h3>);
      i++; continue;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(<h4 key={i} className="lore-h2">{parseInline(trimmed.slice(3))}</h4>);
      i++; continue;
    }
    if (trimmed.startsWith('### ')) {
      elements.push(<h5 key={i} className="lore-h3">{parseInline(trimmed.slice(4))}</h5>);
      i++; continue;
    }

    // ─── Blockquote ───
    if (trimmed.startsWith('> ')) {
      elements.push(<blockquote key={i} className="lore-blockquote">{parseInline(trimmed.slice(2))}</blockquote>);
      i++; continue;
    }

    // ─── Numbered list ───
    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numMatch) {
      elements.push(
        <div key={i} className="lore-list-item lore-numbered-item">
          <span className="lore-num-badge">{numMatch[1]}</span>
          <span>{parseInline(numMatch[2])}</span>
        </div>
      );
      i++; continue;
    }

    // ─── Bullet list ───
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <div key={i} className="lore-list-item">
          <span className="lore-bullet">✦</span>
          <span>{parseInline(trimmed.slice(2))}</span>
        </div>
      );
      i++; continue;
    }

    // ─── Paragraph (fallback) ───
    elements.push(<p key={i} className="lore-paragraph">{parseInline(line)}</p>);
    i++;
  }

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
  const [sidebarWidth, setSidebarWidth] = useState(null); // custom drag-resized width (px)
  const sidebarRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const dragResize = useRef(null);

  // Drag the left-edge handle to resize the sidebar (320px - 700px)
  const startSidebarResize = (e) => {
    e.preventDefault();
    const aside = sidebarRef.current;
    if (!aside) return;
    dragResize.current = { startX: e.clientX, startWidth: aside.offsetWidth };
    const onMove = (ev) => {
      if (!dragResize.current) return;
      const dx = ev.clientX - dragResize.current.startX;
      const w = Math.min(700, Math.max(320, dragResize.current.startWidth - dx));
      setSidebarWidth(w);
    };
    const onUp = () => {
      dragResize.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

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

  // Insert a full pre-built template block at cursor
  const insertTemplate = (templateText) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const currentVal = zone.lore || '';
    // Add newline before if cursor isn't at line start
    const needsNewline = start > 0 && currentVal[start - 1] !== '\n';
    const insert = (needsNewline ? '\n' : '') + templateText + '\n';
    const nextVal = currentVal.substring(0, start) + insert + currentVal.substring(start);

    if (onUpdateZone) {
      onUpdateZone(zone.id, { lore: nextVal });
    }

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + insert.length, start + insert.length);
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
    <aside
      ref={sidebarRef}
      className="custom-zone-sidebar open animate-fade-in"
      aria-label="Custom zone details"
      style={sidebarWidth ? { width: sidebarWidth } : undefined}
    >
      <div
        className="custom-zone-resize-handle"
        onMouseDown={startSidebarResize}
        title="Drag to resize (320 - 700 px)"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
      >
        <i className="fas fa-grip-vertical"></i>
      </div>
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
              {/* ── Row 1: Inline Formatting ── */}
              <div className="format-toolbar-row">
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
                <button
                  type="button"
                  className="format-btn"
                  onClick={() => insertFormatting('==', '==')}
                  title="Highlight (==text==)"
                >
                  <i className="fas fa-highlighter"></i>
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
                  onClick={() => insertFormatting('1. ')}
                  title="Numbered list (1. Item)"
                >
                  <i className="fas fa-list-ol"></i>
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

              {/* ── Row 2: TTRPG Blocks ── */}
              <div className="format-toolbar-row ttrpg-blocks-row">
                <button
                  type="button"
                  className="format-btn ttrpg-block-btn"
                  onClick={() => insertTemplate(
`:::readaloud
The air grows heavy as you step through the ancient doorway. Torchlight flickers across walls covered in faded murals, and somewhere in the darkness ahead, you hear the slow drip of water echoing through stone corridors.
:::`
                  )}
                  title="Read Aloud — Boxed text the GM reads to players"
                >
                  <i className="fas fa-book-open-reader"></i>
                  <span className="ttrpg-btn-label">Read Aloud</span>
                </button>
                <button
                  type="button"
                  className="format-btn ttrpg-block-btn"
                  onClick={() => insertTemplate(
`:::statblock Creature Name
Type: Medium humanoid, neutral evil
HP: 27
Mana: 15
AP: 3
Speed: 30 ft.
---
STR: 10
AGI: 14
CON: 12
INT: 10
SPI: 8
CHA: 8
---
Skills: Stealth +6, Perception +2
Senses: Darkvision 60 ft.
Languages: Common, Goblin
Resist: cold 50
:::`
                  )}
                  title="Stat Block — Creature or NPC stat summary"
                >
                  <i className="fas fa-shield-halved"></i>
                  <span className="ttrpg-btn-label">Stats</span>
                </button>
                <button
                  type="button"
                  className="format-btn ttrpg-block-btn"
                  onClick={() => insertTemplate(
`:::dmnote
The merchant is secretly a cultist of the Void Serpent. If the players succeed on a DC 15 Insight check, they notice his ring bears the cult's sigil. He will attempt to flee if confronted.
:::`
                  )}
                  title="DM Secret — Hidden note only the DM sees"
                >
                  <i className="fas fa-eye-slash"></i>
                  <span className="ttrpg-btn-label">DM Note</span>
                </button>
                <button
                  type="button"
                  className="format-btn ttrpg-block-btn"
                  onClick={() => insertTemplate(
`:::quest The Missing Caravan
Objective: Investigate the disappearance of merchant caravans along the northern trade road
Difficulty: Medium (Party Level 3-5)
Reward: 200 gp per party member, favor with the Merchant Guild
Patron: Guildmaster Aldric Thorne
- Speak with the last surviving driver at the Broken Wheel Inn
- Track the bandits to their hideout in the Thornwood
- Recover the stolen goods and rescue any survivors
:::`
                  )}
                  title="Quest Hook — Adventure hook or objective"
                >
                  <i className="fas fa-scroll"></i>
                  <span className="ttrpg-btn-label">Quest</span>
                </button>
                <button
                  type="button"
                  className="format-btn ttrpg-block-btn"
                  onClick={() => insertTemplate(
`:::npc Innkeeper Marta
Race: Human
Class: Commoner
Alignment: Neutral Good
Personality: Warm and talkative, always wiping down the bar
Voice: Gravelly alto, laughs loudly
Secret: Hides a fugitive mage in the cellar
- "Welcome to the Gilded Flagon! Sit down, you look half-dead."
- "Strange folk been comin' through lately. Armed to the teeth, they were."
:::`
                  )}
                  title="NPC — Character dialogue or profile"
                >
                  <i className="fas fa-masks-theater"></i>
                  <span className="ttrpg-btn-label">NPC</span>
                </button>
                <button
                  type="button"
                  className="format-btn ttrpg-block-btn"
                  onClick={() => insertTemplate(
`:::loot Dragon's Hoard
- Flame Tongue Longsword (+1, deals extra 2d6 fire)
- Potion of Greater Healing (4d4+4 HP)
- 350 gold pieces
- Scroll of Fireball (3rd level)
- Amulet of Proof Against Detection
Rarity: Rare
Source: Ancient Red Dragon's Lair
:::`
                  )}
                  title="Loot / Treasure — Items, rewards, treasure hoard"
                >
                  <i className="fas fa-gem"></i>
                  <span className="ttrpg-btn-label">Loot</span>
                </button>
                <button
                  type="button"
                  className="format-btn ttrpg-block-btn"
                  onClick={() => insertTemplate(
`:::scroll Arcane Ward of Binding
School: Abjuration
Level: 5th
This ancient ward seals the passage to the lower crypts. It can only be broken by speaking the true name of the lich who placed it, or by casting Dispel Magic at 7th level or higher.
:::`
                  )}
                  title="Scroll Callout — Magical or arcane callout"
                >
                  <i className="fas fa-wand-sparkles"></i>
                  <span className="ttrpg-btn-label">Scroll</span>
                </button>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              className="custom-zone-lore-textarea"
              value={zone.lore || ''}
              placeholder={"Write your lore here using markdown...\n\nExamples:\n# Chapter Title\n## Section Name\n**Bold text** and *italic text*\n- Bullet items\n1. Numbered steps\n> Chronicle quote\n==Highlighted text==\n\nTTRPG Blocks:\n:::readaloud\nThe cavern opens before you...\n:::\n\n:::statblock Goblin Shaman\nHP: 27\nMana: 15\nAP: 3\nSpeed: 30 ft.\nSTR: 8\nAGI: 14\nCON: 12\nINT: 10\nSPI: 15\nCHA: 8\n:::"}
              rows={10}
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
