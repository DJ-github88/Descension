import { uploadAsset } from '../../services/firebase/uploadService';
import useAuthStore from '../../store/authStore';
import React, { useMemo, useState, useRef } from 'react';
import RichLoreText from '../common/RichLoreText';
import './LoreSidebar.css';
import './WorldMapImmerse.css';
import { showConfirm } from '../../utils/dialogService';

const ENTRY_TYPE_CONFIG = {
  continent: { label: 'Continent', icon: 'fa-earth-americas', color: 'rgba(135, 104, 196, 0.9)', badgeClass: 'badge-continent' },
  region: { label: 'Region', icon: 'fa-mountain-sun', color: 'rgba(196, 164, 74, 0.9)', badgeClass: 'badge-region' },
  subregion: { label: 'Subregion', icon: 'fa-map-location-dot', color: 'rgba(83, 151, 190, 0.9)', badgeClass: 'badge-subregion' },
  location: { label: 'Location / POI', icon: 'fa-location-dot', color: 'rgba(235, 190, 85, 0.9)', badgeClass: 'badge-location' }
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
  onSelectZone,
  currentCampaign = null,
  readOnly = false,
  onExitReadOnly = null
}) => {
  const [loreMode, setLoreMode] = useState(readOnly ? 'preview' : 'write'); // 'write' | 'preview'
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(null); // custom drag-resized width (px)
  const [showCampaignPicker, setShowCampaignPicker] = useState(false);
  const [campaignTab, setCampaignTab] = useState('npcs'); // 'npcs' | 'locations' | 'plots' | 'lore'
  const [campaignSearch, setCampaignSearch] = useState('');
  React.useEffect(() => {
    if (readOnly) setLoreMode('preview');
  }, [readOnly]);
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

  const parentZone = zone?.parentId ? allZones.find((z) => z.id === zone.parentId) : null;

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

  const insertTemplate = (templateText) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const currentVal = zone.lore || '';
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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const user = useAuthStore.getState().user;
      const currentUserId = user?.uid || (user?.isGuest ? 'guest' : null);
      const result = await uploadAsset(currentUserId, file, 'custom-maps', { profile: 'DEFAULT' });
      if (result.success && result.url && onUpdateZone) {
        onUpdateZone(zone.id, { image: result.url, imageUrl: result.url });
      }
    } catch (err) {
      console.error('Failed to upload zone image:', err);
    }
  };

  const campaignData = currentCampaign?.campaignData || currentCampaign || {};
  const campaignNPCs = campaignData.npcs || [];
  const campaignLocations = campaignData.locations || [];
  const campaignPlots = campaignData.plotThreads || [];
  const campaignLore = campaignData.homebrew?.lore || campaignData.lore || [];

  const handleImportCampaignItem = (type, item) => {
    if (!item || !onUpdateZone) return;
    let newLore = zone.lore || '';
    let newName = zone.name || '';
    let newImage = zone.image || null;
    let newKind = zone.kind;

    if (type === 'npc') {
      newName = item.name || newName;
      newImage = item.image || newImage;
      const snippet = `:::npc ${item.name}
Description: ${item.description || 'N/A'}
Location: ${item.location || 'N/A'}
Relationship: ${item.relationship || 'neutral'}
Plot Relevance: ${item.plotRelevance || 'moderate'}
Notes: ${item.notes || 'N/A'}
:::`;
      newLore = newLore.trim() ? `${newLore}\n\n${snippet}` : snippet;
    } else if (type === 'location') {
      newName = item.name || newName;
      newImage = item.image || newImage;
      newKind = item.type === 'dungeon' ? 'dungeon' : (item.type === 'city' || item.type === 'town' || item.type === 'village') ? 'settlement' : 'location';
      const snippet = `:::readaloud
${item.name}
:::

**Classification:** ${item.type || 'Location'}
**Parent Region:** ${item.region || 'Unknown'}

**Description:**
${item.description || 'No description recorded.'}

**Notable Features:**
${item.notableFeatures || 'None documented.'}

**Notes & Secrets:**
${item.notes || 'None.'}`;
      newLore = newLore.trim() ? `${newLore}\n\n${snippet}` : snippet;
    } else if (type === 'plot') {
      newName = item.title || newName;
      newImage = item.image || newImage;
      const snippet = `:::quest ${item.title}
Status: ${item.status || 'Active'}
Priority: ${item.priority || 'Medium'}
Description: ${item.description || 'N/A'}
Notes: ${item.notes || 'N/A'}
:::`;
      newLore = newLore.trim() ? `${newLore}\n\n${snippet}` : snippet;
    } else if (type === 'lore') {
      newName = item.title || newName;
      newImage = item.image || newImage;
      const snippet = `## ${item.title}
*Category: ${item.category || 'Chronicle'}*

${item.description || ''}

${item.notes ? `**Notes:**\n${item.notes}` : ''}`;
      newLore = newLore.trim() ? `${newLore}\n\n${snippet}` : snippet;
    }

    onUpdateZone(zone.id, {
      name: newName,
      lore: newLore,
      image: newImage,
      imageUrl: newImage,
      kind: newKind
    });
    setShowCampaignPicker(false);
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

  const handleCoordinateChange = (axis, value) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return;
    const currentPos = zone.position || zone.points?.[0] || [0, 0];
    const newPos = axis === 'x' ? [num, currentPos[1]] : [currentPos[0], num];
    if (onUpdateZone) {
      onUpdateZone(zone.id, {
        position: newPos,
        points: [newPos]
      });
    }
  };

  return (
    <aside
      ref={sidebarRef}
      className={`custom-zone-sidebar ${zoneImage ? 'has-custom-img' : ''} ${loreMode === 'split' ? 'sidebar-split-mode' : ''} animate-fade-in`}
      style={sidebarWidth ? { width: sidebarWidth } : undefined}
      aria-label="Custom zone properties drawer"
    >
      {/* Resizable drag handle on left border */}
      <div
        className="custom-zone-resize-handle"
        onMouseDown={startSidebarResize}
        title="Drag to resize sidebar width"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
      >
        <i className="fas fa-grip-lines-vertical"></i>
      </div>

      <div className="custom-zone-sidebar-accent" style={{ background: zone.color || typeConfig.color }} />

      {/* Header bar */}
      <div className="custom-zone-header-top">
        <div className="custom-zone-type-badge">
          <i className={`fas ${typeConfig.icon}`}></i>
          <span>{typeConfig.label}</span>
        </div>
        <button
          type="button"
          className="custom-zone-close-btn"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Parent Hierarchy Breadcrumb */}
      {parentZone && (
        <div className="custom-zone-breadcrumbs">
          <i className="fas fa-arrow-turn-up"></i>
          <span>Part of </span>
          <button
            type="button"
            className="breadcrumb-link"
            onClick={() => onFocusZone && onFocusZone(parentZone)}
          >
            {parentZone.name || 'Parent Region'}
          </button>
        </div>
      )}

      {readOnly && (
        <div className="custom-zone-readonly-banner">
          <i className="fas fa-eye"></i>
          <span>Immersive reading — edits hidden</span>
          {onExitReadOnly && (
            <button type="button" className="readonly-exit-btn" onClick={onExitReadOnly}>
              <i className="fas fa-pen"></i> Edit
            </button>
          )}
        </div>
      )}

      {/* Title & Kind */}
      <div className="custom-zone-title-block">
        <input
          type="text"
          className="custom-zone-name-input"
          value={zone.name || ''}
          placeholder="Name this landmark or region..."
          onChange={(e) => !readOnly && onUpdateZone && onUpdateZone(zone.id, { name: e.target.value })}
          aria-label="Zone name"
          readOnly={readOnly}
          disabled={readOnly}
        />

        {!readOnly && (
        <div className="custom-zone-kind-pills">
          {(['region', 'settlement', 'landmark', 'dungeon', 'poi', 'location']).map((k) => (
            <button
              key={k}
              type="button"
              className={`kind-pill ${zone.kind === k ? 'active' : ''}`}
              onClick={() => onUpdateZone && onUpdateZone(zone.id, { kind: k })}
            >
              <i className={`fas ${ENTRY_TYPE_CONFIG[k]?.icon || 'fa-map-pin'}`}></i>
              <span>{ENTRY_TYPE_CONFIG[k]?.label || k}</span>
            </button>
          ))}
        </div>
        )}
      </div>

      {/* Action Toolbar */}
      <div className="custom-zone-action-bar">
        {onFocusZone && (
          <button
            type="button"
            className="zone-action-btn focus-btn"
            onClick={() => onFocusZone(zone)}
            title="Focus and zoom map view to this zone"
          >
            <i className="fas fa-crosshairs"></i>
            <span>Focus</span>
          </button>
        )}

        {!readOnly && !isPolygon && (
          <button
            type="button"
            className={`zone-action-btn lock-btn ${zone.isLocked ? 'is-locked' : 'is-unlocked'}`}
            onClick={() => onUpdateZone && onUpdateZone(zone.id, { isLocked: !zone.isLocked })}
            title={zone.isLocked ? "Unlock to drag position on canvas" : "Lock position to prevent accidental moves"}
          >
            <i className={`fas ${zone.isLocked ? 'fa-lock' : 'fa-lock-open'}`}></i>
            <span>{zone.isLocked ? 'Locked' : 'Unlocked'}</span>
          </button>
        )}

        {!readOnly && (
        <button
          type="button"
          className="zone-action-btn campaign-link-btn"
          onClick={() => setShowCampaignPicker(true)}
          title="Import information and art from your Campaign NPCs, Locations, Quests, or Lore"
        >
          <i className="fas fa-scroll"></i>
          <span>Import Campaign</span>
        </button>
        )}

        {!readOnly && isPolygon && onAddLocationToRegion && (
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

        {!readOnly && onDeleteZone && (
          <button
            type="button"
            className="zone-action-btn delete-btn"
            onClick={async () => {
              const confirmed = await showConfirm({
                title: 'Delete Custom Zone',
                message: `Delete "${zone.name || 'this entry'}" from custom map?`,
                confirmText: 'Delete Zone',
                isDestructive: true
              });
              if (confirmed) {
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
        {!isPolygon && (
          <>
            <div className="zone-meta-divider" />
            <div className="zone-meta-item coords-item">
              <div className="coords-inputs">
                <label>X: <input type="number" value={Math.round(zone.position?.[0] || zone.points?.[0]?.[0] || 0)} onChange={(e) => !readOnly && handleCoordinateChange('x', e.target.value)} disabled={readOnly} readOnly={readOnly} /></label>
                <label>Y: <input type="number" value={Math.round(zone.position?.[1] || zone.points?.[0]?.[1] || 0)} onChange={(e) => !readOnly && handleCoordinateChange('y', e.target.value)} disabled={readOnly} readOnly={readOnly} /></label>
              </div>
              <span className="meta-lbl">Coordinates</span>
            </div>
          </>
        )}
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

      {/* Lore and World Notes Editor */}
      <div className="custom-zone-section lore-editor-section">
        <div className="custom-zone-section-header">
          <div className="section-title-wrap">
            <i className="fas fa-book-open"></i>
            <h4>Lore & Notes</h4>
          </div>
          {!readOnly && (
          <div className="lore-mode-toggle">
            <button
              type="button"
              className={`lore-tab-btn ${loreMode === 'write' ? 'active' : ''}`}
              onClick={() => setLoreMode('write')}
              title="Editor View Only"
            >
              <i className="fas fa-pen-nib"></i> Write
            </button>
            <button
              type="button"
              className={`lore-tab-btn ${loreMode === 'split' ? 'active' : ''}`}
              onClick={() => setLoreMode('split')}
              title="Side-by-side Editor and Live Codex View"
            >
              <i className="fas fa-table-columns"></i> Split
            </button>
            <button
              type="button"
              className={`lore-tab-btn ${loreMode === 'preview' ? 'active' : ''}`}
              onClick={() => setLoreMode('preview')}
              title="Codex View Only"
            >
              <i className="fas fa-scroll"></i> Codex View
            </button>
          </div>
          )}
          {readOnly && (
            <div className="lore-mode-toggle lore-readonly-badge">
              <span className="readonly-lore-label"><i className="fas fa-book-open"></i> Codex View</span>
            </div>
          )}
        </div>

        {/* Markdown Toolbar (rendered in Write and Split modes) */}
        {!readOnly && loreMode !== 'preview' && (
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
                title="Chronicle Quote (> Quote)"
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

            {/* ── Row 2: Mythrill Codex Blocks ── */}
            <div className="format-toolbar-row ttrpg-blocks-row">
              <button
                type="button"
                className="format-btn ttrpg-block-btn"
                onClick={() => insertTemplate(
`:::readaloud
Frost clings to the ironwood beams as the heavy gates groan inward. Beyond the threshold, the warmth of an ancient thermal vent battles the biting mountain gale, mist swirling around stone monoliths etched with slumbering runes.
:::`
                )}
                title="Read Aloud — Narrative text read to players"
              >
                <i className="fas fa-book-open-reader"></i>
                <span className="ttrpg-btn-label">Read Aloud</span>
              </button>

              <button
                type="button"
                className="format-btn ttrpg-block-btn"
                onClick={() => insertTemplate(
`:::statblock Jutul Ice-Stalker
Classification: Primordial Beast (Tundra Predator)
Threat: Elite (Tier 2)
HP: 85
Mana: 30
AP: 4
Speed: 40 ft.
DR: 3 (Glacial Hide)
Resist: Rime 75%, Physical 20%
Weakness: Ember
---
STR: 16 (+3)
AGI: 14 (+2)
CON: 15 (+2)
INT: 6 (-2)
SPI: 12 (+1)
CHA: 5 (-3)
---
Skills: Athletics +6, Stealth +4 (Snow)
Senses: Tremorsense 30 ft.
---
Passive - Frost-Camouflage: Advantage on Agility (Stealth) in blizzards and deep snow.
Action (2 AP) - Rime-Claw Sweep: 2d8 + 3 Physical damage plus 1d6 Rime damage. Target must succeed on CON 13 or suffer Frost-Strain.
Reaction (1 AP) - Glacial Roar: When struck in melee, unleash a chilling blast dealing 1d6 Rime damage and knocking adjacent foes back 10 ft.
:::`
                )}
                title="Stat Block — Mythrill creature or NPC stats"
              >
                <i className="fas fa-shield-halved"></i>
                <span className="ttrpg-btn-label">Stats</span>
              </button>

              <button
                type="button"
                className="format-btn ttrpg-block-btn"
                onClick={() => insertTemplate(
`:::gmnote
The caravan master is secretly an agent of the 7th House, bearing the Watcher's Spark beneath their hood. A Spirit (Perception) contest against their Charisma (Deception 14) reveals the counterfeit monolith key sewn into their cloak hem.
:::`
                )}
                title="GM Note — Hidden notes only the GM sees"
              >
                <i className="fas fa-eye-slash"></i>
                <span className="ttrpg-btn-label">GM Note</span>
              </button>

              <button
                type="button"
                className="format-btn ttrpg-block-btn"
                onClick={() => insertTemplate(
`:::quest Recovery at Blizzard's End
Patron: High Thane Thorvald of Nordhalla
Objective: Retrieve three dormant Runed Crystals from the frost-shattered ridge before the storm converges.
Difficulty: High (Party Level 4-6)
Reward: 350 Gold, 2 Healing Tonics, Thane's Favor
- Survey the shattered ice ravine for glowing thermal fissures
- Slay or bypass the roosting Glacier Wyrms
- Secure the Runed Crystals in cold-iron containment cases
:::`
                )}
                title="Quest Hook — Objectives and rewards"
              >
                <i className="fas fa-scroll"></i>
                <span className="ttrpg-btn-label">Quest</span>
              </button>

              <button
                type="button"
                className="format-btn ttrpg-block-btn"
                onClick={() => insertTemplate(
`:::npc Vespera, Frostwood Wayfinder
Ancestry: Thalren Human
Affiliation: Frostwood Watchers
Disposition: Cautious, fiercely protective of thermal bogs
Voice: Low and measured, pauses to listen between sentences
Secret: Knows the hidden cavern route bypassing the Imperial blockade.
- "Keep your lanterns hooded. The fog remembers what you say, but the cold takes what you carry."
- "If the ice begins to glow amber, don't run. That means the shell is venting below us."
:::`
                )}
                title="NPC — Character profile, dialogue, and secrets"
              >
                <i className="fas fa-user"></i>
                <span className="ttrpg-btn-label">NPC</span>
              </button>

              <button
                type="button"
                className="format-btn ttrpg-block-btn"
                onClick={() => insertTemplate(
`:::loot Vault of the Sun-Seekers
- Hearth-Forged Greatsword (+1d6 Ember damage, sheds thermal warmth in 10 ft. radius)
- 3x Flawless Sun-Gems (Valued at 150 Gold each)
- Draught of Vitality (Restores 25 Mana and clears Frost-Strain)
- Inscribed Cold-Iron Shield (Rime Resistance 25%)
Origin: Pre-Shattering Solari Cache
Guarded By: Vaettir Earth-Guardian
:::`
                )}
                title="Loot — Treasures, items, and artifacts"
              >
                <i className="fas fa-gem"></i>
                <span className="ttrpg-btn-label">Loot</span>
              </button>

              <button
                type="button"
                className="format-btn ttrpg-block-btn"
                onClick={() => insertTemplate(
`:::spell Cinderward of the Solari
School: Ember | Tier: 2
Cast: 2 AP | Cost: 15 Mana | Range: 30 ft.
Target: Single Ally or Self | Duration: 3 Rounds
Effect: Wraps the target in a shimmering mantle of solar heat. The target gains 20 Temporary HP and deals 1d8 Ember damage to any attacker who strikes them in melee.
Empower (+1 AP): Target gains an additional 10 Temporary HP.
:::`
                )}
                title="Spell — Mythrill spell or scroll"
              >
                <i className="fas fa-wand-magic-sparkles"></i>
                <span className="ttrpg-btn-label">Spell</span>
              </button>

              <button
                type="button"
                className="format-btn ttrpg-block-btn"
                onClick={() => insertTemplate(
`:::hazard Glacial Rime-Vents
Severity: Deadly
Trigger: Stepping within 15 ft. of the steaming fissure or triggering a rockslide
Save: CON 14 vs Frost-Strain
Damage: 3d6 Rime damage on failure, half on success
Effect: Failed targets suffer 1 stack of Frost-Strain, reducing movement speed by 10 ft. until rested near a thermal source.
:::`
                )}
                title="Hazard — Environmental hazards and terrain effects"
              >
                <i className="fas fa-triangle-exclamation"></i>
                <span className="ttrpg-btn-label">Hazard</span>
              </button>
            </div>
          </div>
        )}

        {/* ── View Modes: Write, Split, Codex View ── */}
        {loreMode === 'write' && (
          <textarea
            ref={textareaRef}
            className="custom-zone-lore-textarea"
            value={zone.lore || ''}
            placeholder={"Write your lore here using markdown...\n\nExamples:\n# Chapter Title\n## Section Name\n**Bold text** and *italic text*\n- Bullet items\n1. Numbered steps\n> Chronicle quote\n==Highlighted text==\n\nMythrill Codex Blocks:\n:::readaloud\nThe heavy ironwood gate creaks open...\n:::\n\n:::statblock Jutul Ice-Stalker\nClassification: Primordial Beast\nHP: 85\nMana: 30\nAP: 4\nSpeed: 40 ft.\nDR: 3 (Glacial Hide)\nResist: Rime 75%, Physical 20%\nSTR: 16 (+3)\nAGI: 14 (+2)\nCON: 15 (+2)\nINT: 6 (-2)\nSPI: 12 (+1)\nCHA: 5 (-3)\n:::\n\n:::quest Recovery at Blizzard's End\nPatron: High Thane Thorvald\nObjective: Recover the dormant Aex Shards\nReward: 350 Gold, 2 Healing Tonics\n- Survey the ice ravine\n- Bypass Glacier Wyrms\n:::"}
            rows={12}
            onChange={(e) => onUpdateZone && onUpdateZone(zone.id, { lore: e.target.value })}
            aria-label="Zone lore notes"
          />
        )}

        {loreMode === 'split' && (
          <div className="lore-split-container">
            <div className="lore-split-pane lore-split-write">
              <textarea
                ref={textareaRef}
                className="custom-zone-lore-textarea lore-split-textarea"
                value={zone.lore || ''}
                placeholder="Type your markdown and codex blocks here..."
                rows={12}
                onChange={(e) => onUpdateZone && onUpdateZone(zone.id, { lore: e.target.value })}
                aria-label="Zone lore editor (split mode)"
              />
            </div>
            <div className="lore-split-pane lore-split-preview">
              <div className="lore-preview-container lore-split-preview-inner">
                {zone.lore?.trim() ? (
                  <RichLoreText text={zone.lore} />
                ) : (
                  <p className="lore-preview-empty">Type in the editor to see real-time Codex formatting.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {loreMode === 'preview' && (
          <div className="lore-preview-container">
            {zone.lore?.trim() ? (
              <RichLoreText text={zone.lore} />
            ) : (
              <p className="lore-preview-empty">No lore documented yet. Switch to Write or Split mode to craft chronicles.</p>
            )}
          </div>
        )}
      </div>

      {/* Color Customization */}
      {!readOnly && (
      <div className="custom-zone-section color-section">
        <div className="custom-zone-section-header">
          <div className="section-title-wrap">
            <i className="fas fa-palette"></i>
            <h4>Boundary & Pin Tone</h4>
          </div>
        </div>
        <div className="custom-zone-color-presets">
          {[
            { color: 'rgba(196, 164, 74, 0.28)', stroke: '#f1d48a', pinFill: '#f1d48a', label: 'Gold' },
            { color: 'rgba(135, 104, 196, 0.28)', stroke: '#b39ddb', pinFill: '#b39ddb', label: 'Purple' },
            { color: 'rgba(83, 151, 190, 0.28)', stroke: '#81d4fa', pinFill: '#81d4fa', label: 'Sky' },
            { color: 'rgba(76, 175, 80, 0.28)', stroke: '#a5d6a7', pinFill: '#a5d6a7', label: 'Emerald' },
            { color: 'rgba(244, 67, 54, 0.28)', stroke: '#ef9a9a', pinFill: '#ef9a9a', label: 'Crimson' },
            { color: 'rgba(255, 152, 0, 0.28)', stroke: '#ffcc80', pinFill: '#ffcc80', label: 'Amber' }
          ].map((preset, i) => {
            const isCurrent = zone.stroke === preset.stroke || zone.color === preset.color || zone.color === preset.stroke || zone.color === preset.pinFill;
            const isPoint = zone.kind === 'location' || zone.geometry === 'point';
            return (
              <button
                key={i}
                type="button"
                className={`color-preset-pill ${isCurrent ? 'active' : ''}`}
                style={{
                  background: preset.stroke,
                  transform: isCurrent ? 'scale(1.2)' : 'scale(1)',
                  boxShadow: isCurrent ? `0 0 0 2px #2b1408, 0 0 0 4.5px ${preset.stroke}` : 'none',
                  transition: 'all 0.18s ease'
                }}
                onClick={() => onUpdateZone && onUpdateZone(zone.id, {
                  color: isPoint ? preset.pinFill : preset.color,
                  stroke: preset.stroke
                })}
                title={preset.label}
                aria-label={preset.label}
              />
            );
          })}
        </div>
      </div>
      )}

      {/* Campaign Asset Picker Modal */}
      {showCampaignPicker && (
        <div className="modal-overlay campaign-picker-modal-overlay" onClick={() => setShowCampaignPicker(false)}>
          <div className="campaign-picker-modal" onClick={(e) => e.stopPropagation()}>
            <div className="campaign-picker-header">
              <div className="header-title">
                <i className="fas fa-scroll"></i>
                <h3>Import from Campaign: {currentCampaign?.name || 'Active Campaign'}</h3>
              </div>
              <button type="button" className="picker-close-btn" onClick={() => setShowCampaignPicker(false)} aria-label="Close campaign import modal">
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Tab navigation */}
            <div className="campaign-picker-tabs">
              <button
                type="button"
                className={`picker-tab ${campaignTab === 'npcs' ? 'active' : ''}`}
                onClick={() => setCampaignTab('npcs')}
              >
                <i className="fas fa-users"></i> NPCs ({campaignNPCs.length})
              </button>
              <button
                type="button"
                className={`picker-tab ${campaignTab === 'locations' ? 'active' : ''}`}
                onClick={() => setCampaignTab('locations')}
              >
                <i className="fas fa-mountain-sun"></i> Locations ({campaignLocations.length})
              </button>
              <button
                type="button"
                className={`picker-tab ${campaignTab === 'plots' ? 'active' : ''}`}
                onClick={() => setCampaignTab('plots')}
              >
                <i className="fas fa-scroll"></i> Quests & Plots ({campaignPlots.length})
              </button>
              <button
                type="button"
                className={`picker-tab ${campaignTab === 'lore' ? 'active' : ''}`}
                onClick={() => setCampaignTab('lore')}
              >
                <i className="fas fa-book"></i> Lore ({campaignLore.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="campaign-picker-search">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder={`Search ${campaignTab}...`}
                value={campaignSearch}
                onChange={(e) => setCampaignSearch(e.target.value)}
                autoFocus
              />
            </div>

            {/* Items list */}
            <div className="campaign-picker-list">
              {/* NPC Tab */}
              {campaignTab === 'npcs' && (
                campaignNPCs.filter(n => !campaignSearch || n.name?.toLowerCase().includes(campaignSearch.toLowerCase()) || n.description?.toLowerCase().includes(campaignSearch.toLowerCase())).length > 0 ? (
                  campaignNPCs
                    .filter(n => !campaignSearch || n.name?.toLowerCase().includes(campaignSearch.toLowerCase()) || n.description?.toLowerCase().includes(campaignSearch.toLowerCase()))
                    .map(npc => (
                      <div key={npc.id} className="campaign-item-card" onClick={() => handleImportCampaignItem('npc', npc)}>
                        <div className="item-thumb">
                          {npc.image ? <img src={npc.image} alt={npc.name} /> : <i className="fas fa-user"></i>}
                        </div>
                        <div className="item-info">
                          <h4>{npc.name}</h4>
                          <div className="item-badges">
                            <span className="item-badge">{npc.relationship || 'Neutral'}</span>
                            <span className="item-badge">{npc.location || 'Roaming'}</span>
                          </div>
                          <p className="item-desc">{npc.description || npc.notes || 'No description recorded.'}</p>
                        </div>
                        <button type="button" className="btn-import-select">
                          <i className="fas fa-plus"></i> Import
                        </button>
                      </div>
                    ))
                ) : (
                  <div className="picker-empty-state">
                    <i className="fas fa-user-slash"></i>
                    <p>No NPCs found in campaign.</p>
                  </div>
                )
              )}

              {/* Locations Tab */}
              {campaignTab === 'locations' && (
                campaignLocations.filter(l => !campaignSearch || l.name?.toLowerCase().includes(campaignSearch.toLowerCase()) || l.description?.toLowerCase().includes(campaignSearch.toLowerCase())).length > 0 ? (
                  campaignLocations
                    .filter(l => !campaignSearch || l.name?.toLowerCase().includes(campaignSearch.toLowerCase()) || l.description?.toLowerCase().includes(campaignSearch.toLowerCase()))
                    .map(loc => (
                      <div key={loc.id} className="campaign-item-card" onClick={() => handleImportCampaignItem('location', loc)}>
                        <div className="item-thumb">
                          {loc.image ? <img src={loc.image} alt={loc.name} /> : <i className="fas fa-map-marker-alt"></i>}
                        </div>
                        <div className="item-info">
                          <h4>{loc.name}</h4>
                          <div className="item-badges">
                            <span className="item-badge">{loc.type || 'Location'}</span>
                            <span className="item-badge">{loc.region || 'Unknown Realm'}</span>
                          </div>
                          <p className="item-desc">{loc.description || loc.notableFeatures || 'No description.'}</p>
                        </div>
                        <button type="button" className="btn-import-select">
                          <i className="fas fa-plus"></i> Import
                        </button>
                      </div>
                    ))
                ) : (
                  <div className="picker-empty-state">
                    <i className="fas fa-map-pin"></i>
                    <p>No campaign locations found.</p>
                  </div>
                )
              )}

              {/* Plots / Quests Tab */}
              {campaignTab === 'plots' && (
                campaignPlots.filter(p => !campaignSearch || p.title?.toLowerCase().includes(campaignSearch.toLowerCase()) || p.description?.toLowerCase().includes(campaignSearch.toLowerCase())).length > 0 ? (
                  campaignPlots
                    .filter(p => !campaignSearch || p.title?.toLowerCase().includes(campaignSearch.toLowerCase()) || p.description?.toLowerCase().includes(campaignSearch.toLowerCase()))
                    .map(plot => (
                      <div key={plot.id} className="campaign-item-card" onClick={() => handleImportCampaignItem('plot', plot)}>
                        <div className="item-thumb">
                          {plot.image ? <img src={plot.image} alt={plot.title} /> : <i className="fas fa-scroll"></i>}
                        </div>
                        <div className="item-info">
                          <h4>{plot.title}</h4>
                          <div className="item-badges">
                            <span className="item-badge">{plot.status || 'Active'}</span>
                            <span className="item-badge">{plot.priority || 'Medium'}</span>
                          </div>
                          <p className="item-desc">{plot.description || plot.notes || 'No notes.'}</p>
                        </div>
                        <button type="button" className="btn-import-select">
                          <i className="fas fa-plus"></i> Import
                        </button>
                      </div>
                    ))
                ) : (
                  <div className="picker-empty-state">
                    <i className="fas fa-scroll"></i>
                    <p>No quests or plot threads found.</p>
                  </div>
                )
              )}

              {/* Lore Tab */}
              {campaignTab === 'lore' && (
                campaignLore.filter(l => !campaignSearch || l.title?.toLowerCase().includes(campaignSearch.toLowerCase()) || l.description?.toLowerCase().includes(campaignSearch.toLowerCase())).length > 0 ? (
                  campaignLore
                    .filter(l => !campaignSearch || l.title?.toLowerCase().includes(campaignSearch.toLowerCase()) || l.description?.toLowerCase().includes(campaignSearch.toLowerCase()))
                    .map(loreItem => (
                      <div key={loreItem.id} className="campaign-item-card" onClick={() => handleImportCampaignItem('lore', loreItem)}>
                        <div className="item-thumb">
                          {loreItem.image ? <img src={loreItem.image} alt={loreItem.title} /> : <i className="fas fa-book"></i>}
                        </div>
                        <div className="item-info">
                          <h4>{loreItem.title}</h4>
                          <div className="item-badges">
                            <span className="item-badge">{loreItem.category || 'Chronicle'}</span>
                          </div>
                          <p className="item-desc">{loreItem.description || loreItem.notes || 'No description.'}</p>
                        </div>
                        <button type="button" className="btn-import-select">
                          <i className="fas fa-plus"></i> Import
                        </button>
                      </div>
                    ))
                ) : (
                  <div className="picker-empty-state">
                    <i className="fas fa-book-open"></i>
                    <p>No homebrew lore entries found.</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default CustomZoneSidebar;
