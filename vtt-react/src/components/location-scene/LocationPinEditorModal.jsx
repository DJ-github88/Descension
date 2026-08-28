import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import useNpcStore from '../../store/npcStore';
import useCreatureStore from '../../store/creatureStore';
import useQuestStore from '../../store/questStore';
import useFactionStore from '../../store/factionStore';
import useInventoryStore from '../../store/inventoryStore';
import useInteractiveMapStore from '../../store/interactiveMapStore';
import useMapStore from '../../store/mapStore';
import universalEntityService from '../../services/universalEntityService';
import BESTIARY_DATA from '../../data/creatureData.json';

const ALL_BESTIARY_CREATURES = (BESTIARY_DATA?.regions || []).flatMap(r =>
  (r.creatures || []).map(c => ({
    ...c,
    regionName: r.name,
    category: 'Bestiary'
  }))
);

const PIN_ICONS = [
  { id: 'fa-location-dot', label: 'Landmark', icon: 'fa-location-dot' },
  { id: 'fa-city', label: 'Capital / City', icon: 'fa-city' },
  { id: 'fa-house', label: 'Settlement', icon: 'fa-house' },
  { id: 'fa-chess-rook', label: 'Keep / Castle', icon: 'fa-chess-rook' },
  { id: 'fa-mountain-sun', label: 'Mountain Realm', icon: 'fa-mountain-sun' },
  { id: 'fa-dungeon', label: 'Dungeon / Crypt', icon: 'fa-dungeon' },
  { id: 'fa-beer-mug-empty', label: 'Tavern / Inn', icon: 'fa-beer-mug-empty' },
  { id: 'fa-skull-crossbones', label: 'Boss / Hazard', icon: 'fa-skull-crossbones' },
  { id: 'fa-dragon', label: 'Monster Lair', icon: 'fa-dragon' },
  { id: 'fa-landmark', label: 'Ruins / Relic', icon: 'fa-landmark' },
  { id: 'fa-tree', label: 'Forest / Grove', icon: 'fa-tree' },
  { id: 'fa-water', label: 'Port / Water', icon: 'fa-water' },
  { id: 'fa-gem', label: 'Treasure / Vault', icon: 'fa-gem' },
  { id: 'fa-eye-slash', label: 'Secret Trap', icon: 'fa-eye-slash' }
];

const PIN_COLORS = [
  '#8c6738', // Antique Bronze
  '#a83232', // Crimson Wax
  '#2a52be', // Royal Blue
  '#27ae60', // Forest Emerald
  '#8e44ad', // Arcane Purple
  '#d35400', // Amber Terracotta
  '#16a085', // Sea Teal
  '#3d2b1f'  // Dark Walnut Leather
];

const LocationPinEditorModal = ({
  initialPin,
  mapId,
  maps = [],
  onSave,
  onClose
}) => {
  const tacticalMaps = useMapStore(state => state.maps) || [];
  const [title, setTitle] = useState(initialPin?.title || '');
  const [type, setType] = useState(initialPin?.type || 'poi');
  const [icon, setIcon] = useState(initialPin?.icon || 'fa-location-dot');
  const [color, setColor] = useState(initialPin?.color || '#8c6738');
  const [scale, setScale] = useState(
    initialPin?.scale !== undefined 
      ? initialPin.scale 
      : (initialPin?.size === 'small' ? 0.75 : initialPin?.size === 'large' ? 1.4 : initialPin?.size === 'epic' ? 2.0 : 1.0)
  );
  const [size, setSize] = useState(initialPin?.size || 'medium');
  const [description, setDescription] = useState(initialPin?.description || '');
  const [isSecretGM, setIsSecretGM] = useState(initialPin?.isSecretGM || false);
  const [targetMapId, setTargetMapId] = useState(initialPin?.targetMapId || '');
  const [journalNotes, setJournalNotes] = useState(initialPin?.linkedEntities?.journalNotes || '');

  // Item & Shop configuration (Inspectable shops, unidentified items, attunement)
  const [isItemHidden, setIsItemHidden] = useState(initialPin?.isItemHidden || false);
  const [unidentifiedName, setUnidentifiedName] = useState(initialPin?.unidentifiedName || '');
  const [unidentifiedDescription, setUnidentifiedDescription] = useState(initialPin?.unidentifiedDescription || '');
  const [shopPrice, setShopPrice] = useState(initialPin?.shopPrice || '');

  // Linked entity selections
  const [selectedNpcIds, setSelectedNpcIds] = useState(initialPin?.linkedEntities?.npcIds || []);
  const [selectedCreatureIds, setSelectedCreatureIds] = useState(initialPin?.linkedEntities?.creatureIds || []);
  const [selectedQuestIds, setSelectedQuestIds] = useState(initialPin?.linkedEntities?.questIds || []);
  const [selectedFactionIds, setSelectedFactionIds] = useState(initialPin?.linkedEntities?.factionIds || []);
  const [selectedItemIds, setSelectedItemIds] = useState(initialPin?.linkedEntities?.itemIds || []);
  const [selectedLocationId, setSelectedLocationId] = useState(initialPin?.linkedEntities?.locationId || null);

  // Category filter tab for entity search
  const [entityFilterCategory, setEntityFilterCategory] = useState('all'); // 'all' | 'npc' | 'creature' | 'quest' | 'faction' | 'item' | 'lore'

  // Universal Entity Autocomplete Search
  const [entitySearchQuery, setEntitySearchQuery] = useState('');
  const [isSearchingEntities, setIsSearchingEntities] = useState(false);

  const { npcs } = useNpcStore();
  const { creatures } = useCreatureStore();
  const { quests } = useQuestStore();
  const { factions } = useFactionStore();
  const { items } = useInventoryStore();
  const { createMap } = useInteractiveMapStore();

  const [isCreatingNewSubMap, setIsCreatingNewSubMap] = useState(false);
  const [newSubMapName, setNewSubMapName] = useState('');
  const [newSubMapImage, setNewSubMapImage] = useState('');

  // Live entity autocomplete results across all stores and compendiums
  const searchResults = useMemo(() => {
    const q = entitySearchQuery.trim().toLowerCase();
    const cat = entityFilterCategory;
    const list = [];

    // Helper to check category filter
    const allow = (type) => cat === 'all' || cat === type;

    // 1. NPCs from npcStore
    if (allow('npc')) {
      (npcs || []).forEach(n => {
        const name = n.name || 'Unnamed NPC';
        const role = n.role || n.title || 'NPC';
        if (!q || name.toLowerCase().includes(q) || role.toLowerCase().includes(q)) {
          list.push({
            id: n.id,
            type: 'npc',
            category: 'NPC',
            title: name,
            subtitle: `${role} • ${n.location || 'Settlement'}`,
            icon: 'fa-user-ninja',
            color: '#a83232',
            summary: n.description || n.notes || ''
          });
        }
      });
    }

    // 2. Bestiary Creatures from BESTIARY_DATA & creatureStore
    if (allow('creature')) {
      const allCreatures = [
        ...ALL_BESTIARY_CREATURES,
        ...(creatures || []).filter(c => !ALL_BESTIARY_CREATURES.some(bc => bc.id === c.id))
      ];

      allCreatures.forEach(c => {
        const cName = c.name || 'Creature';
        const cRole = c.role || c.nature?.slice(0, 45) || c.type || c.creatureType || 'Mythril Beast';
        const danger = c.dangerLevel || c.tier || 'Moderate';
        const hpVal = c.stats?.maxHp || c.stats?.hp || c.maxHealth || c.hp || c.hitPoints || (c.combat && c.combat.match(/(\d+)\s*HP/i)?.[1]) || '75';

        if (!q || cName.toLowerCase().includes(q) || cRole.toLowerCase().includes(q) || danger.toLowerCase().includes(q)) {
          list.push({
            id: c.id,
            type: 'creature',
            category: 'Bestiary',
            title: cName,
            subtitle: `${cRole} • Danger: ${danger} • ${hpVal} HP`,
            icon: 'fa-dragon',
            color: '#c0392b',
            summary: c.description || c.origin || c.depth || c.combat || ''
          });
        }
      });
    }

    // 3. Quests from questStore
    if (allow('quest')) {
      (quests || []).forEach(qItem => {
        const qTitle = qItem.title || 'Untitled Quest';
        const qCat = qItem.category || 'Quest';
        if (!q || qTitle.toLowerCase().includes(q) || qCat.toLowerCase().includes(q)) {
          list.push({
            id: qItem.id,
            type: 'quest',
            category: 'Quest',
            title: qTitle,
            subtitle: `${qItem.status || 'Active'} • ${qCat}`,
            icon: 'fa-scroll',
            color: '#d35400',
            summary: qItem.description || ''
          });
        }
      });
    }

    // 4. Factions from factionStore
    if (allow('faction')) {
      (factions || []).forEach(f => {
        const fName = f.name || 'Unnamed Faction';
        const fType = f.type || 'Faction';
        if (!q || fName.toLowerCase().includes(q) || fType.toLowerCase().includes(q)) {
          list.push({
            id: f.id,
            type: 'faction',
            category: 'Faction',
            title: fName,
            subtitle: `${fType} • Influence: ${f.influence || 'Normal'}`,
            icon: 'fa-shield-halved',
            color: '#8e44ad',
            summary: f.description || ''
          });
        }
      });
    }

    // 5. Items & Relics from inventoryStore
    if (allow('item')) {
      (items || []).forEach(item => {
        const iName = item.name || item.title || 'Relic / Item';
        const iRarity = item.rarity || 'Common';
        const iType = item.type || item.category || 'Gear';
        if (!q || iName.toLowerCase().includes(q) || iType.toLowerCase().includes(q) || iRarity.toLowerCase().includes(q)) {
          list.push({
            id: item.id,
            type: 'item',
            category: 'Item & Relic',
            title: iName,
            subtitle: `${iRarity} • ${iType}`,
            icon: 'fa-gem',
            color: '#16a085',
            summary: item.description || ''
          });
        }
      });
    }

    // 6. Universal Graph Search (World Lore, Codex Notes, Places)
    if (allow('lore') || cat === 'all') {
      try {
        if (universalEntityService?.searchAll) {
          const uResults = universalEntityService.searchAll(q, { limit: 25 });
          uResults.forEach(res => {
            if (!list.some(item => item.id === res.id)) {
              if (allow(res.type === 'campaign_location' || res.type === 'note' ? 'lore' : res.type)) {
                list.push(res);
              }
            }
          });
        }
      } catch (e) {
        console.warn('Universal search error:', e);
      }
    }

    return list.slice(0, 35);
  }, [entitySearchQuery, entityFilterCategory, npcs, creatures, quests, factions, items]);

  const handleSelectEntity = (entity) => {
    if (!entity) return;

    if (entity.type === 'npc') {
      if (!selectedNpcIds.includes(entity.id)) {
        setSelectedNpcIds(prev => [...prev, entity.id]);
      }
    } else if (entity.type === 'creature') {
      if (!selectedCreatureIds.includes(entity.id)) {
        setSelectedCreatureIds(prev => [...prev, entity.id]);
      }
    } else if (entity.type === 'quest') {
      if (!selectedQuestIds.includes(entity.id)) {
        setSelectedQuestIds(prev => [...prev, entity.id]);
      }
    } else if (entity.type === 'faction') {
      if (!selectedFactionIds.includes(entity.id)) {
        setSelectedFactionIds(prev => [...prev, entity.id]);
      }
    } else if (entity.type === 'item') {
      if (!selectedItemIds.includes(entity.id)) {
        setSelectedItemIds(prev => [...prev, entity.id]);
      }
    } else if (entity.type === 'campaign_location' || entity.type === 'world_lore' || entity.type === 'location' || entity.type === 'lore' || entity.type === 'note') {
      setSelectedLocationId(entity.id);
    }

    // Smart autofill if title is default
    if (!title.trim() || title === 'New Landmark') {
      setTitle(entity.title || entity.name || 'New Landmark');
      if (entity.summary && !description.trim()) {
        setDescription(entity.summary);
      }
    }

    setEntitySearchQuery('');
    setIsSearchingEntities(false);
  };

  const handleRemoveEntity = (entityType, entityId) => {
    if (entityType === 'npc') {
      setSelectedNpcIds(prev => prev.filter(id => id !== entityId));
    } else if (entityType === 'creature') {
      setSelectedCreatureIds(prev => prev.filter(id => id !== entityId));
    } else if (entityType === 'quest') {
      setSelectedQuestIds(prev => prev.filter(id => id !== entityId));
    } else if (entityType === 'faction') {
      setSelectedFactionIds(prev => prev.filter(id => id !== entityId));
    } else if (entityType === 'item') {
      setSelectedItemIds(prev => prev.filter(id => id !== entityId));
    } else if (entityType === 'location') {
      setSelectedLocationId(null);
    }
  };

  const handleCreateSubMapInline = () => {
    if (!newSubMapName.trim()) return;
    const newMap = createMap({
      name: newSubMapName.trim(),
      imageUrl: newSubMapImage.trim() || `${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/Mythril.jpeg`,
      parentMapId: mapId,
      type: 'subregion'
    });
    setTargetMapId(newMap.id);
    setIsCreatingNewSubMap(false);
    setNewSubMapName('');
    setNewSubMapImage('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const pinPayload = {
      ...(initialPin || {}),
      title: title.trim(),
      type,
      icon,
      color,
      size: scale < 0.8 ? 'small' : scale > 1.6 ? 'epic' : scale > 1.2 ? 'large' : 'medium',
      scale,
      description: description.trim(),
      isSecretGM: Boolean(isSecretGM),
      targetMapId: targetMapId || null,
      isItemHidden: Boolean(isItemHidden),
      unidentifiedName: unidentifiedName.trim(),
      unidentifiedDescription: unidentifiedDescription.trim(),
      shopPrice: shopPrice.trim(),
      linkedEntities: {
        ...(initialPin?.linkedEntities || {}),
        npcIds: selectedNpcIds,
        creatureIds: selectedCreatureIds,
        questIds: selectedQuestIds,
        factionIds: selectedFactionIds,
        itemIds: selectedItemIds,
        locationId: selectedLocationId,
        journalNotes: journalNotes.trim()
      }
    };

    onSave(pinPayload);
  };

  return ReactDOM.createPortal(
    <div className="location-pin-modal-backdrop" onClick={onClose}>
      <div className="location-pin-modal" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleFormSubmit}>
          {/* Header */}
          <div className="location-pin-modal-header">
            <div className="modal-header-identity">
              <div
                className="modal-pin-icon-box"
                style={{
                  background: `radial-gradient(circle at 35% 35%, ${color} 0%, #201306 100%)`,
                  borderColor: color
                }}
              >
                <i className={`fas ${icon}`}></i>
              </div>
              <div className="modal-pin-titles">
                <span className="modal-pin-type-tag">PATHFINDER ATLAS PIN EDITOR</span>
                <h3>{initialPin ? 'Edit Landmark Pin' : 'Place New Landmark Pin'}</h3>
              </div>
            </div>
            <button type="button" className="modal-btn-close" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Form Content */}
          <div className="location-pin-modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
            {/* Title & Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#3d2614', marginBottom: '4px', fontWeight: 700 }}>
                  Landmark Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Ironjaw Port..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#fdfaf0',
                    border: '1.5px solid #8c6738',
                    borderRadius: '6px',
                    color: '#2b1810',
                    fontSize: '14px',
                    fontFamily: 'Cinzel, Georgia, serif',
                    fontWeight: 700
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#3d2614', marginBottom: '4px', fontWeight: 700 }}>
                  Category
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#fdfaf0',
                    border: '1.5px solid #8c6738',
                    borderRadius: '6px',
                    color: '#2b1810',
                    fontSize: '13px',
                    fontWeight: 600
                  }}
                >
                  <option value="poi">Point of Interest</option>
                  <option value="label">Map Text Label / Region</option>
                  <option value="settlement">City / Settlement</option>
                  <option value="dungeon">Dungeon / Cavern</option>
                  <option value="shop">Tavern / Market</option>
                  <option value="npc">NPC Residence</option>
                  <option value="quest">Quest Site</option>
                  <option value="lore">Historical Relic</option>
                </select>
              </div>
            </div>

            {/* Icon & Color Pickers */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#3d2614', marginBottom: '6px', fontWeight: 700 }}>
                Icon Glyph &amp; Heraldic Color
              </label>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {PIN_ICONS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setIcon(p.id)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '6px',
                      background: icon === p.id ? 'linear-gradient(180deg, #d4af37 0%, #aa8022 100%)' : '#f4ecd8',
                      border: icon === p.id ? '2px solid #5c3e21' : '1.5px solid #c4a373',
                      color: icon === p.id ? '#1a0f05' : '#5c3e21',
                      cursor: 'pointer',
                      fontSize: '16px',
                      boxShadow: icon === p.id ? '0 2px 8px rgba(0,0,0,0.3)' : 'none'
                    }}
                    title={p.label}
                  >
                    <i className={`fas ${p.icon}`}></i>
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {PIN_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: c,
                      border: color === c ? '2.5px solid #2b1810' : '1px solid rgba(0,0,0,0.4)',
                      cursor: 'pointer',
                      boxShadow: color === c ? '0 0 8px rgba(0,0,0,0.5)' : 'none'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Element Scale & Size Slider */}
            <div style={{ marginBottom: '14px', padding: '10px 14px', background: '#f8f3e6', borderRadius: '8px', border: '1.5px solid #8c6738' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '12px', color: '#3d2614', margin: 0, fontWeight: 700 }}>
                  <i className="fas fa-up-right-and-down-left-from-center" style={{ color: '#8c6738', marginRight: '6px' }} />
                  {type === 'label' ? 'Label Text Scale:' : 'Pin Crest Scale:'} <strong>{scale.toFixed(2)}x</strong>
                </label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[
                    { label: '0.5x', val: 0.5 },
                    { label: '0.75x', val: 0.75 },
                    { label: '1.0x', val: 1.0 },
                    { label: '1.4x', val: 1.4 },
                    { label: '1.8x', val: 1.8 },
                    { label: '2.5x', val: 2.5 }
                  ].map(p => (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() => setScale(p.val)}
                      style={{
                        padding: '2px 7px',
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '11px', color: '#6d4c28', fontWeight: 600 }}>Tiny</span>
                <input
                  type="range"
                  min="0.4"
                  max="3.0"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  style={{ flex: 1, accentColor: '#8c6738', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '11px', color: '#6d4c28', fontWeight: 600 }}>Colossal</span>
              </div>
            </div>

            {/* Lore Description */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#3d2614', margin: 0, fontWeight: 700 }}>
                  Lore Summary &amp; Description (Rich Formatting &amp; Images)
                </label>
                <div style={{ display: 'flex', gap: '3px' }}>
                  <button
                    type="button"
                    className="btn-gm-action"
                    style={{ padding: '2px 6px', fontSize: '10px' }}
                    onClick={() => {
                      const ta = document.getElementById('pin-lore-desc-input');
                      if (!ta) return;
                      const s = ta.selectionStart, e = ta.selectionEnd;
                      const sel = description.substring(s, e);
                      setDescription(description.substring(0, s) + `**${sel || 'bold text'}**` + description.substring(e));
                    }}
                    title="Bold (**text**)"
                  >
                    <b>B</b>
                  </button>
                  <button
                    type="button"
                    className="btn-gm-action"
                    style={{ padding: '2px 6px', fontSize: '10px' }}
                    onClick={() => {
                      const ta = document.getElementById('pin-lore-desc-input');
                      if (!ta) return;
                      const s = ta.selectionStart, e = ta.selectionEnd;
                      const sel = description.substring(s, e);
                      setDescription(description.substring(0, s) + `*${sel || 'italic text'}*` + description.substring(e));
                    }}
                    title="Italic (*text*)"
                  >
                    <i>I</i>
                  </button>
                  <button
                    type="button"
                    className="btn-gm-action"
                    style={{ padding: '2px 6px', fontSize: '10px' }}
                    onClick={() => {
                      const ta = document.getElementById('pin-lore-desc-input');
                      if (!ta) return;
                      const s = ta.selectionStart, e = ta.selectionEnd;
                      const sel = description.substring(s, e);
                      setDescription(description.substring(0, s) + `<u>${sel || 'underlined text'}</u>` + description.substring(e));
                    }}
                    title="Underline (<u>text</u>)"
                  >
                    <u>U</u>
                  </button>
                  <button
                    type="button"
                    className="btn-gm-action"
                    style={{ padding: '2px 6px', fontSize: '10px' }}
                    onClick={() => {
                      const ta = document.getElementById('pin-lore-desc-input');
                      if (!ta) return;
                      const s = ta.selectionStart, e = ta.selectionEnd;
                      const sel = description.substring(s, e);
                      setDescription(description.substring(0, s) + `~~${sel || 'struck text'}~~` + description.substring(e));
                    }}
                    title="Strikethrough (~~text~~)"
                  >
                    <s>S</s>
                  </button>
                  <button
                    type="button"
                    className="btn-gm-action"
                    style={{ padding: '2px 6px', fontSize: '10px' }}
                    onClick={() => {
                      const ta = document.getElementById('pin-lore-desc-input');
                      if (!ta) return;
                      const s = ta.selectionStart, e = ta.selectionEnd;
                      setDescription(description.substring(0, s) + `\n# Header\n` + description.substring(e));
                    }}
                    title="Heading 1"
                  >
                    H1
                  </button>
                  <button
                    type="button"
                    className="btn-gm-action"
                    style={{ padding: '2px 6px', fontSize: '10px' }}
                    onClick={() => {
                      const ta = document.getElementById('pin-lore-desc-input');
                      if (!ta) return;
                      const s = ta.selectionStart, e = ta.selectionEnd;
                      setDescription(description.substring(0, s) + `\n## Section\n` + description.substring(e));
                    }}
                    title="Heading 2"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    className="btn-gm-action"
                    style={{ padding: '2px 6px', fontSize: '10px' }}
                    onClick={() => {
                      const ta = document.getElementById('pin-lore-desc-input');
                      if (!ta) return;
                      const s = ta.selectionStart, e = ta.selectionEnd;
                      setDescription(description.substring(0, s) + `\n- Item 1\n- Item 2\n` + description.substring(e));
                    }}
                    title="Bullet List"
                  >
                    • List
                  </button>
                  <button
                    type="button"
                    className="btn-gm-action"
                    style={{ padding: '2px 6px', fontSize: '10px' }}
                    onClick={() => {
                      const ta = document.getElementById('pin-lore-desc-input');
                      if (!ta) return;
                      const s = ta.selectionStart, e = ta.selectionEnd;
                      const sel = description.substring(s, e);
                      setDescription(description.substring(0, s) + `\n> ${sel || 'Quoted passage...'}\n` + description.substring(e));
                    }}
                    title="Blockquote"
                  >
                    “ Quote
                  </button>
                  <button
                    type="button"
                    className="btn-gm-action"
                    style={{ padding: '2px 6px', fontSize: '10px' }}
                    onClick={() => {
                      const url = window.prompt('Enter image URL:');
                      if (url) {
                        const ta = document.getElementById('pin-lore-desc-input');
                        const s = ta ? ta.selectionStart : description.length;
                        setDescription(description.substring(0, s) + `\n![Landmark Artwork](${url})\n` + description.substring(s));
                      }
                    }}
                    title="Embed Image Artwork"
                  >
                    🖼 Image
                  </button>
                </div>
              </div>
              <textarea
                id="pin-lore-desc-input"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A bustling coastal haven of weathered wooden docks and salt-crusted taverns... (Supports **bold**, *italic*, <u>underline</u>, ~~strike~~, # headers, and images!)"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#fdfaf0',
                  border: '1.5px solid #8c6738',
                  borderRadius: '6px',
                  color: '#2b1810',
                  fontSize: '13px',
                  fontFamily: 'Bookman Old Style, Georgia, serif',
                  lineHeight: '1.5'
                }}
              />
            </div>

            {/* Universal Entity Autocomplete & Linker */}
            <div style={{ padding: '14px', background: '#f5edd9', borderRadius: '8px', border: '1.5px solid #8c6738', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#3d2614', margin: 0 }}>
                  <i className="fas fa-link"></i> Link Inhabitants, Quests, Factions, Relics &amp; Bestiary
                </label>
                <span style={{ fontSize: '11px', color: '#6d4c28' }}>Universal graph linker</span>
              </div>

              {/* Category Filter Selector Tabs */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: 'All', icon: 'fa-globe' },
                  { id: 'npc', label: 'NPCs', icon: 'fa-user-ninja' },
                  { id: 'creature', label: 'Bestiary', icon: 'fa-dragon' },
                  { id: 'quest', label: 'Quests', icon: 'fa-scroll' },
                  { id: 'faction', label: 'Factions', icon: 'fa-shield-halved' },
                  { id: 'item', label: 'Items & Relics', icon: 'fa-gem' },
                  { id: 'lore', label: 'World Lore', icon: 'fa-book' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`btn-gm-action ${entityFilterCategory === cat.id ? 'active' : ''}`}
                    style={{
                      padding: '3px 8px',
                      fontSize: '11px',
                      fontWeight: entityFilterCategory === cat.id ? 800 : 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      borderRadius: '4px',
                      background: entityFilterCategory === cat.id ? '#8c6738' : '#fdfaf0',
                      color: entityFilterCategory === cat.id ? '#fff' : '#4a3018',
                      borderColor: '#8c6738',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setEntityFilterCategory(cat.id);
                      setIsSearchingEntities(true);
                    }}
                  >
                    <i className={`fas ${cat.icon}`} /> {cat.label}
                  </button>
                ))}
              </div>

              {/* Autocomplete Input */}
              <div style={{ position: 'relative', marginBottom: '10px' }}>
                <input
                  type="text"
                  value={entitySearchQuery}
                  onChange={(e) => {
                    setEntitySearchQuery(e.target.value);
                    setIsSearchingEntities(true);
                  }}
                  onFocus={() => setIsSearchingEntities(true)}
                  placeholder={`Search ${entityFilterCategory === 'all' ? 'NPCs, Creatures, Quests, Factions, Items, Lore' : entityFilterCategory + 's'}...`}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#fdfaf0',
                    border: '1.5px solid #8c6738',
                    borderRadius: '6px',
                    color: '#2b1810',
                    fontSize: '13px'
                  }}
                />

                {/* Autocomplete Dropdown */}
                {(isSearchingEntities || Boolean(entitySearchQuery.trim())) && searchResults.length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: '#fcf8eb',
                      border: '2px solid #8c6738',
                      borderRadius: '6px',
                      marginTop: '4px',
                      maxHeight: '240px',
                      overflowY: 'auto',
                      zIndex: 200,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px', background: '#ede3d1', borderBottom: '1px solid #8c6738', fontSize: '11px', color: '#5c3e21', fontWeight: 800 }}>
                      <span>SELECT AN ENTITY TO LINK ({searchResults.length} AVAILABLE)</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsSearchingEntities(false);
                        }}
                        style={{ background: 'none', border: 'none', color: '#8a1f11', cursor: 'pointer', fontWeight: 800, fontSize: '11px' }}
                      >
                        ✕ Close
                      </button>
                    </div>
                    {searchResults.map((res) => (
                      <div
                        key={`${res.type}-${res.id}`}
                        onClick={() => handleSelectEntity(res)}
                        style={{
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #e8dcbe',
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#ede2c4'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <i className={`fas ${res.icon || 'fa-tag'}`} style={{ color: '#8c6738', width: '16px' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#2b1810' }}>{res.title}</div>
                          <div style={{ fontSize: '11px', color: '#6d4c28' }}>{res.category} • {res.subtitle}</div>
                        </div>
                        <button
                          type="button"
                          className="btn-gm-action"
                          style={{ padding: '2px 8px', fontSize: '11px' }}
                        >
                          + Link
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Entity Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {/* Linked NPCs */}
                {selectedNpcIds.map(npcId => {
                  const npc = (npcs || []).find(n => n.id === npcId) || universalEntityService.getEntity(npcId);
                  const name = npc?.name || npc?.title || npcId;
                  return (
                    <span
                      key={`npc-${npcId}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        background: '#f8e6e4',
                        border: '1.5px solid #a83232',
                        borderRadius: '16px',
                        fontSize: '12px',
                        color: '#7a1a1a',
                        fontWeight: 700
                      }}
                    >
                      <i className="fas fa-user-ninja"></i> {name}
                      <button
                        type="button"
                        onClick={() => handleRemoveEntity('npc', npcId)}
                        style={{ background: 'none', border: 'none', color: '#a83232', cursor: 'pointer', padding: 0, fontSize: '12px', fontWeight: 800 }}
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}

                {/* Linked Quests */}
                {selectedQuestIds.map(qId => {
                  const quest = (quests || []).find(q => q.id === qId) || universalEntityService.getEntity(qId);
                  const qTitle = quest?.title || qId;
                  return (
                    <span
                      key={`quest-${qId}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        background: '#fcf0d8',
                        border: '1.5px solid #d35400',
                        borderRadius: '16px',
                        fontSize: '12px',
                        color: '#8a3b00',
                        fontWeight: 700
                      }}
                    >
                      <i className="fas fa-scroll"></i> {qTitle}
                      <button
                        type="button"
                        onClick={() => handleRemoveEntity('quest', qId)}
                        style={{ background: 'none', border: 'none', color: '#d35400', cursor: 'pointer', padding: 0, fontSize: '12px', fontWeight: 800 }}
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}

                {/* Linked Factions */}
                {selectedFactionIds.map(fId => {
                  const fac = (factions || []).find(f => f.id === fId);
                  const name = fac?.name || fId;
                  return (
                    <span
                      key={`fac-${fId}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        background: '#f8edd9',
                        border: '1.5px solid #8c6738',
                        borderRadius: '16px',
                        fontSize: '12px',
                        color: '#4a3018',
                        fontWeight: 700
                      }}
                    >
                      <i className="fas fa-shield-halved"></i> {name}
                      <button
                        type="button"
                        onClick={() => handleRemoveEntity('faction', fId)}
                        style={{ background: 'none', border: 'none', color: '#8c6738', cursor: 'pointer', padding: 0, fontSize: '12px', fontWeight: 800 }}
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}

                {/* Linked Bestiary Creatures */}
                {selectedCreatureIds.map(cId => {
                  const creature = (creatures || []).find(c => c.id === cId) || ALL_BESTIARY_CREATURES.find(c => c.id === cId || c.name?.toLowerCase() === cId?.toLowerCase()) || universalEntityService.getEntity(cId);
                  const name = creature?.name || creature?.title || cId;
                  return (
                    <span
                      key={`creature-${cId}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        background: '#fbeee6',
                        border: '1.5px solid #c0392b',
                        borderRadius: '16px',
                        fontSize: '12px',
                        color: '#922b21',
                        fontWeight: 700
                      }}
                    >
                      <i className="fas fa-dragon"></i> {name}
                      <button
                        type="button"
                        onClick={() => handleRemoveEntity('creature', cId)}
                        style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', padding: 0, fontSize: '12px', fontWeight: 800 }}
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}

                {/* Linked Items & Relics */}
                {selectedItemIds.map(iId => {
                  const item = (items || []).find(i => i.id === iId) || universalEntityService.getEntity(iId);
                  const name = item?.name || item?.title || iId;
                  return (
                    <span
                      key={`item-${iId}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        background: '#e8f8f5',
                        border: '1.5px solid #16a085',
                        borderRadius: '16px',
                        fontSize: '12px',
                        color: '#0e6251',
                        fontWeight: 700
                      }}
                    >
                      <i className="fas fa-gem"></i> {name}
                      <button
                        type="button"
                        onClick={() => handleRemoveEntity('item', iId)}
                        style={{ background: 'none', border: 'none', color: '#16a085', cursor: 'pointer', padding: 0, fontSize: '12px', fontWeight: 800 }}
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}

                {/* Linked Location / Codex */}
                {selectedLocationId && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      background: '#e4f4ea',
                      border: '1.5px solid #27ae60',
                      borderRadius: '16px',
                      fontSize: '12px',
                      color: '#145a32',
                      fontWeight: 700
                    }}
                  >
                    <i className="fas fa-mountain-sun"></i> {selectedLocationId}
                    <button
                      type="button"
                      onClick={() => handleRemoveEntity('location', selectedLocationId)}
                      style={{ background: 'none', border: 'none', color: '#27ae60', cursor: 'pointer', padding: 0, fontSize: '12px', fontWeight: 800 }}
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>
            </div>

            {/* Sub-Map Drilldown Linking */}
            <div style={{ padding: '12px', background: '#eaf4ee', borderRadius: '8px', border: '1.5px solid #27ae60', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#145a32' }}>
                  <i className="fas fa-magnifying-glass-plus"></i> Nested Sub-Map Drilldown
                </span>
                {!isCreatingNewSubMap && (
                  <button
                    type="button"
                    onClick={() => setIsCreatingNewSubMap(true)}
                    style={{ background: 'none', border: 'none', color: '#1e824c', fontSize: '12px', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    + Create New Sub-Map
                  </button>
                )}
              </div>

              {!isCreatingNewSubMap ? (
                <select
                  value={targetMapId}
                  onChange={(e) => setTargetMapId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#fdfaf0',
                    border: '1.5px solid #27ae60',
                    borderRadius: '6px',
                    color: '#145a32',
                    fontSize: '13px',
                    fontWeight: 600
                  }}
                >
                  <option value="">(No Connection / Sub-Map Attached — Lore Card Only)</option>
                  <optgroup label="Exploration Scenes & Sub-Maps">
                    {maps.filter(m => m.id !== mapId).map(m => (
                      <option key={`exp-${m.id}`} value={m.id}>
                        🗺️ {m.name} ({m.type || 'Sub-Map'})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Tactical Battle Maps (Grid)">
                    {tacticalMaps.map(tm => (
                      <option key={`tac-${tm.id}`} value={tm.id}>
                        ⚔️ {tm.name} (Tactical Battle Map)
                      </option>
                    ))}
                  </optgroup>
                </select>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="text"
                    value={newSubMapName}
                    onChange={(e) => setNewSubMapName(e.target.value)}
                    placeholder="New Sub-Map Name (e.g. Tavern Floor 1)..."
                    style={{
                      padding: '6px 10px',
                      background: '#fdfaf0',
                      border: '1.5px solid #27ae60',
                      borderRadius: '4px',
                      color: '#145a32',
                      fontSize: '13px',
                      fontWeight: 600
                    }}
                  />
                  <input
                    type="text"
                    value={newSubMapImage}
                    onChange={(e) => setNewSubMapImage(e.target.value)}
                    placeholder="Artwork URL (optional)..."
                    style={{
                      padding: '6px 10px',
                      background: '#fdfaf0',
                      border: '1.5px solid rgba(39, 174, 96, 0.5)',
                      borderRadius: '4px',
                      color: '#145a32',
                      fontSize: '13px'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn-enter-submap"
                      onClick={handleCreateSubMapInline}
                    >
                      Save Sub-Map
                    </button>
                    <button
                      type="button"
                      className="btn-gm-action"
                      onClick={() => setIsCreatingNewSubMap(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* GM Secrets & Settings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px', background: '#fcf8ee', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d9c7a7' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#8a1f11', fontSize: '13px', fontWeight: 700 }}>
                <input
                  type="checkbox"
                  checked={isSecretGM}
                  onChange={(e) => setIsSecretGM(e.target.checked)}
                />
                <i className="fas fa-eye-slash"></i> GM Only Pin (Marker completely hidden from Players until revealed)
              </label>

              {/* Item Veiling / Unidentified Attunement Controls */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#8e44ad', fontSize: '13px', fontWeight: 700 }}>
                <input
                  type="checkbox"
                  checked={isItemHidden}
                  onChange={(e) => setIsItemHidden(e.target.checked)}
                />
                <i className="fas fa-mask"></i> Veil Item Tooltip (Unidentified to Players / Requires Attunement or Arcana Appraisal)
              </label>

              {isItemHidden && (
                <div style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#5c3e21', marginBottom: '2px' }}>
                      Disguised / Mystery Item Name (Visible to players)
                    </label>
                    <input
                      type="text"
                      value={unidentifiedName}
                      onChange={(e) => setUnidentifiedName(e.target.value)}
                      placeholder="e.g. Enigmatic Obsidian Blade, Tarnished Ring..."
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        background: '#ffffff',
                        border: '1.5px solid #8e44ad',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: '#2b1810'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#5c3e21', marginBottom: '2px' }}>
                      Disguised Clue / Mystery Lore (Visible to players)
                    </label>
                    <textarea
                      rows={2}
                      value={unidentifiedDescription}
                      onChange={(e) => setUnidentifiedDescription(e.target.value)}
                      placeholder="e.g. Faint runes pulse along the guard. An Arcana DC 14 check or attunement ritual is needed to reveal its enchantments."
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        background: '#ffffff',
                        border: '1.5px solid #8e44ad',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: '#2b1810'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Shop / Merchant Stand Pricing */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#5c3e21', marginBottom: '2px' }}>
                  <i className="fas fa-coins" style={{ color: '#d4af37' }}></i> Shop / Merchant Price (Optional for Shop Stands)
                </label>
                <input
                  type="text"
                  value={shopPrice}
                  onChange={(e) => setShopPrice(e.target.value)}
                  placeholder="e.g. 45 gp, 120 silver, 2 Rubies..."
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    background: '#ffffff',
                    border: '1.5px solid #c4a373',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#2b1810'
                  }}
                />
              </div>
            </div>

            {/* GM Field Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#5c3e21', marginBottom: '4px', fontWeight: 700 }}>
                GM Field Secrets & Trap Triggers (Never visible to players)
              </label>
              <textarea
                rows={2}
                value={journalNotes}
                onChange={(e) => setJournalNotes(e.target.value)}
                placeholder="Secret DC 15 Perception check reveals hidden trapdoor..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#fdfbf4',
                  border: '1.5px solid #c4a373',
                  borderRadius: '6px',
                  color: '#2b1810',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="location-pin-modal-footer">
            <button type="button" className="btn-gm-action" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-gm-action active" style={{ fontWeight: 800 }}>
              <i className="fas fa-check"></i> Save Landmark Pin
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default LocationPinEditorModal;
