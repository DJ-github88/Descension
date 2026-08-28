import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import useNpcStore from '../../store/npcStore';
import useCreatureStore from '../../store/creatureStore';
import useQuestStore from '../../store/questStore';
import useFactionStore from '../../store/factionStore';
import useInventoryStore from '../../store/inventoryStore';
import useItemStore from '../../store/itemStore';
import useCharacterStore from '../../store/characterStore';
import usePartyStore from '../../store/partyStore';
import useMapStore from '../../store/mapStore';
import universalEntityService from '../../services/universalEntityService';
import RichLoreText from '../common/RichLoreText';
import ItemTooltip from '../item-generation/ItemTooltip';
import { COMPREHENSIVE_ITEMS } from '../../data/items/index.js';
import BESTIARY_DATA from '../../data/creatureData.json';

const ALL_BESTIARY_CREATURES = (BESTIARY_DATA?.regions || []).flatMap(r =>
  (r.creatures || []).map(c => ({
    ...c,
    regionName: r.name
  }))
);

const formatItemPrice = (val) => {
  if (!val) return '';
  if (typeof val === 'string' || typeof val === 'number') return `${val}`;
  if (typeof val === 'object') {
    const parts = [];
    if (val.platinum) parts.push(`${val.platinum}p`);
    if (val.gold) parts.push(`${val.gold}g`);
    if (val.silver) parts.push(`${val.silver}s`);
    if (val.copper) parts.push(`${val.copper}c`);
    return parts.join(' ') || '0c';
  }
  return '';
};

const resolveItem = (iId, storeItems = []) => {
  const inStore = storeItems.find(i => i.id === iId);
  if (inStore) return inStore;
  const inComp = (COMPREHENSIVE_ITEMS || []).find(i => i.id === iId || i.name?.toLowerCase() === iId?.toLowerCase());
  if (inComp) return inComp;
  return universalEntityService.getEntity(iId)?.raw || universalEntityService.getEntity(iId) || null;
};

const resolveCreature = (cId, storeCreatures = []) => {
  const inStore = storeCreatures.find(c => c.id === cId);
  if (inStore) return inStore;
  const inBestiary = ALL_BESTIARY_CREATURES.find(c => c.id === cId || c.name?.toLowerCase() === cId?.toLowerCase());
  if (inBestiary) return inBestiary;
  return universalEntityService.getEntity(cId)?.raw || universalEntityService.getEntity(cId) || null;
};

const LocationPinDetailModal = ({
  pin,
  isGM,
  maps = [],
  onClose,
  onEnterSubMap,
  onEditPin,
  onToggleSecret,
  onDeletePin
}) => {
  const [activeTab, setActiveTab] = useState(() => {
    if (pin?.linkedEntities?.itemIds?.length > 0 && !pin?.linkedEntities?.npcIds?.length && !pin?.linkedEntities?.questIds?.length && !pin?.linkedEntities?.creatureIds?.length) {
      return 'items';
    }
    return 'overview';
  });
  const [selectedCharId, setSelectedCharId] = useState('');
  const [transferSuccess, setTransferSuccess] = useState('');
  const [localIsItemHidden, setLocalIsItemHidden] = useState(pin?.isItemHidden || false);

  const { getNpc } = useNpcStore();
  const { creatures } = useCreatureStore();
  const { factions } = useFactionStore();
  const { quests } = useQuestStore();
  const { items } = useInventoryStore();

  const characterStore = useCharacterStore();
  const partyStore = usePartyStore();

  const allAvailableCharacters = React.useMemo(() => {
    const list = [];
    if (characterStore?.name) {
      list.push({ id: characterStore.id || 'active', name: `${characterStore.name} (You)` });
    }
    (characterStore?.characters || []).forEach(c => {
      if (!list.some(item => item.id === c.id)) {
        list.push({ id: c.id, name: c.name || c.characterName || 'Character' });
      }
    });
    (partyStore?.partyMembers || []).forEach(p => {
      if (!list.some(item => item.id === p.id || item.name === p.name)) {
        list.push({ id: p.id, name: p.name || 'Party Member' });
      }
    });
    return list;
  }, [characterStore, partyStore]);

  const handleGiveItemToPlayer = (itemToGive, targetName) => {
    if (!itemToGive) return;
    try {
      useInventoryStore.getState().addItemFromLibrary(itemToGive);
      setTransferSuccess(`✔ Added "${itemToGive.name || 'Item'}" to ${targetName || 'inventory'}!`);
      setTimeout(() => setTransferSuccess(''), 4500);
    } catch (err) {
      console.error('Error adding item to player inventory:', err);
    }
  };

  if (!pin) return null;

  const linked = pin.linkedEntities || {};
  const hasNpcs = (linked.npcIds?.length || 0) > 0;
  const hasCreatures = (linked.creatureIds?.length || 0) > 0;
  const hasQuests = (linked.questIds?.length || 0) > 0;
  const hasItems = (linked.itemIds?.length || 0) > 0;
  const tacticalMaps = useMapStore(state => state.maps) || [];
  const targetExplorationMap = pin.targetMapId ? maps.find(m => m.id === pin.targetMapId) : null;
  const targetTacticalMap = pin.targetMapId ? tacticalMaps.find(m => m.id === pin.targetMapId) : null;
  const targetSubMap = targetExplorationMap || targetTacticalMap;
  const isTacticalSubMap = !targetExplorationMap && Boolean(targetTacticalMap);

  return ReactDOM.createPortal(
    <div className="location-pin-modal-backdrop" onClick={onClose}>
      <div className="location-pin-modal" style={{ maxWidth: '600px', minWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="location-pin-modal-header">
          <div className="modal-header-identity">
            <div
              className="modal-pin-icon-box"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${pin.color || '#d4af37'} 0%, #201306 100%)`,
                borderColor: pin.color || '#d4af37'
              }}
            >
              <i className={`fas ${pin.icon || 'fa-location-dot'}`}></i>
            </div>
            <div className="modal-pin-titles">
              <span className="modal-pin-type-tag">{(pin.type || 'poi').toUpperCase()}</span>
              <h3>{pin.title}</h3>
            </div>
          </div>
          <button className="modal-btn-close" onClick={onClose} title="Close">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Tab Headers - Only shown when multiple tabs exist */}
        {hasMultipleTabs && (
          <div className="location-pin-modal-tabs">
            <button
              type="button"
              className={`pin-modal-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="fas fa-scroll"></i> Overview
            </button>

            {hasNpcs && (
              <button
                type="button"
                className={`pin-modal-tab ${activeTab === 'cast' ? 'active' : ''}`}
                onClick={() => setActiveTab('cast')}
              >
                <i className="fas fa-users"></i> Cast <span className="pin-tab-badge">{linked.npcIds.length}</span>
              </button>
            )}

            {hasCreatures && (
              <button
                type="button"
                className={`pin-modal-tab ${activeTab === 'creatures' ? 'active' : ''}`}
                onClick={() => setActiveTab('creatures')}
              >
                <i className="fas fa-dragon"></i> Bestiary <span className="pin-tab-badge">{linked.creatureIds.length}</span>
              </button>
            )}

            {hasQuests && (
              <button
                type="button"
                className={`pin-modal-tab ${activeTab === 'quests' ? 'active' : ''}`}
                onClick={() => setActiveTab('quests')}
              >
                <i className="fas fa-scroll"></i> Quests <span className="pin-tab-badge">{linked.questIds.length}</span>
              </button>
            )}

            {hasItems && (
              <button
                type="button"
                className={`pin-modal-tab ${activeTab === 'items' ? 'active' : ''}`}
                onClick={() => setActiveTab('items')}
              >
                <i className="fas fa-gem"></i> Items <span className="pin-tab-badge">{linked.itemIds.length}</span>
              </button>
            )}

            {hasLore && (
              <button
                type="button"
                className={`pin-modal-tab ${activeTab === 'lore' ? 'active' : ''}`}
                onClick={() => setActiveTab('lore')}
              >
                <i className="fas fa-book"></i> Lore
              </button>
            )}

            {hasNotes && isGM && (
              <button
                type="button"
                className={`pin-modal-tab ${activeTab === 'notes' ? 'active' : ''}`}
                onClick={() => setActiveTab('notes')}
              >
                <i className="fas fa-feather-pointed"></i> GM Notes
              </button>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="location-pin-modal-body">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-pane-overview">
              {/* Point-and-Click Connected Area Portal */}
              {pin.targetMapId && targetSubMap && (
                <div
                  style={{
                    marginBottom: '14px',
                    padding: '12px 16px',
                    background: 'linear-gradient(180deg, #f0f7f2 0%, #d8eee0 100%)',
                    border: '2px solid #27ae60',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    boxShadow: '0 4px 12px rgba(39, 174, 96, 0.15)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 800, color: isTacticalSubMap ? '#8c3838' : '#196f3d', letterSpacing: '0.5px' }}>
                      <i className={`fas ${isTacticalSubMap ? 'fa-chess-board' : 'fa-door-open'}`} /> {isTacticalSubMap ? 'Tactical Battle Realm' : 'Connected Scene / Area'}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: isTacticalSubMap ? '#641e16' : '#145a32', fontFamily: 'Cinzel, Georgia, serif' }}>
                      {targetSubMap.name}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onEnterSubMap(pin.targetMapId);
                      onClose();
                    }}
                    style={{
                      background: isTacticalSubMap 
                        ? 'linear-gradient(180deg, #c0392b 0%, #962d22 100%)' 
                        : 'linear-gradient(180deg, #27ae60 0%, #1e824c 100%)',
                      color: '#fff',
                      border: isTacticalSubMap ? '1.5px solid #78281f' : '1.5px solid #145a32',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <i className={`fas ${isTacticalSubMap ? 'fa-swords' : 'fa-door-open'}`} /> {isTacticalSubMap ? 'Enter Battle Grid ↗' : 'Enter & Explore ↗'}
                  </button>
                </div>
              )}

              {pin.description ? (
                <div style={{ color: '#2b1810', fontSize: '14px', lineHeight: '1.6' }}>
                  <RichLoreText text={pin.description} className="parchment-theme" />
                </div>
              ) : (
                <p style={{ fontStyle: 'italic', color: '#7a6a53', margin: 0 }}>No lore description has been recorded for this landmark yet.</p>
              )}
            </div>
          )}

          {/* Cast Tab */}
          {activeTab === 'cast' && (
            <div className="tab-pane-cast" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {linked.npcIds.map((npcId) => {
                const storeNpc = getNpc(npcId);
                const universalNpc = !storeNpc ? universalEntityService.getEntity(npcId) : null;
                const rawNpc = storeNpc || universalNpc?.raw || {};
                const name = storeNpc?.name || universalNpc?.title || universalNpc?.name || npcId;
                const role = storeNpc?.title || storeNpc?.role || universalNpc?.subtitle || 'Inhabitant';
                const attitude = rawNpc.attitude || rawNpc.alignment || 'Neutral';
                const desc = rawNpc.description || rawNpc.notes || rawNpc.appearance || universalNpc?.summary || '';
                const personality = rawNpc.personality || rawNpc.traits || '';
                const factionIds = storeNpc?.factionIds || rawNpc.factionIds || [];
                const factionNames = factionIds.map(fId => (factions || []).find(f => f.id === fId)?.name).filter(Boolean);

                return (
                  <div
                    key={npcId}
                    style={{
                      background: '#fdfbf5',
                      border: '1.5px solid #8c6738',
                      borderRadius: '8px',
                      padding: '14px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: '#8a1f11',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          border: '2px solid #5a1208',
                          flexShrink: 0
                        }}
                      >
                        <i className="fas fa-user-ninja" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '15px', fontWeight: 800, color: '#2b1810', fontFamily: 'Cinzel, serif' }}>
                            {name}
                          </span>
                          <span style={{ fontSize: '11px', background: '#ede3d1', color: '#5c3e21', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            {role}
                          </span>
                          <span style={{ fontSize: '11px', background: '#f5edd9', color: '#6d4c28', padding: '2px 8px', borderRadius: '4px', fontStyle: 'italic' }}>
                            {attitude}
                          </span>
                        </div>
                        {factionNames.length > 0 && (
                          <div style={{ fontSize: '11.5px', color: '#8a5a2b', marginTop: '3px', fontWeight: 600 }}>
                            <i className="fas fa-shield-halved" style={{ color: '#d4af37' }} /> Faction: {factionNames.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* NPC Description & Lore */}
                    {desc && (
                      <div style={{ fontSize: '13px', color: '#2b1810', lineHeight: '1.5', marginTop: '6px' }}>
                        <RichLoreText text={desc} className="parchment-theme" />
                      </div>
                    )}

                    {/* Personality & Quirks */}
                    {personality && (
                      <div style={{ fontSize: '12px', color: '#6d4c28', fontStyle: 'italic', marginTop: '6px', borderTop: '1px dashed #d8ccb4', paddingTop: '6px' }}>
                        <strong>Mannerisms / Personality:</strong> {personality}
                      </div>
                    )}

                    {/* GM Secret Notes */}
                    {isGM && rawNpc.secrets && (
                      <div style={{ fontSize: '12px', color: '#8a1f11', marginTop: '6px', background: '#fdf2f2', padding: '6px 10px', borderRadius: '4px', border: '1px solid #e0a0a0' }}>
                        <i className="fas fa-eye-slash" /> <strong>GM Secret:</strong> {rawNpc.secrets}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Bestiary Tab */}
          {activeTab === 'creatures' && (
            <div className="tab-pane-creatures" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {linked.creatureIds.map((cId) => {
                const creature = resolveCreature(cId, creatures) || {};
                const name = creature.name || creature.title || cId;
                const role = creature.role || creature.type || creature.creatureType || 'Mythril Creature';
                const danger = creature.dangerLevel || creature.tier || 'Moderate';
                const hpVal = creature.stats?.maxHp || creature.stats?.hp || creature.maxHealth || creature.hp || creature.hitPoints || (creature.combat && creature.combat.match(/(\d+)\s*HP/i)?.[1]) || '75';
                const speed = creature.stats?.speed || creature.movementSpeed ? `${creature.stats?.speed || creature.movementSpeed} ft` : '30 ft';
                const combatProfile = creature.combat || '';
                const desc = creature.description || creature.origin || creature.depth || creature.nature || creature.summary || '';

                return (
                  <div
                    key={cId}
                    style={{
                      background: '#fdfbf5',
                      border: '1.5px solid #c0392b',
                      borderRadius: '8px',
                      padding: '14px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: '#c0392b',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          border: '2px solid #78281f',
                          flexShrink: 0
                        }}
                      >
                        <i className="fas fa-dragon" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '15px', fontWeight: 800, color: '#2b1810', fontFamily: 'Cinzel, serif' }}>
                            {name}
                          </span>
                          <span style={{ fontSize: '11px', background: '#fbeee6', color: '#922b21', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            {role}
                          </span>
                          <span style={{ fontSize: '11px', background: '#fdf2e9', color: '#b9770e', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            Danger: {danger}
                          </span>
                          <span style={{ fontSize: '11px', background: '#eafaf1', color: '#196f3d', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            {hpVal} HP
                          </span>
                          <span style={{ fontSize: '11px', background: '#ebf5fb', color: '#2471a3', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            Speed: {speed}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Combat Profile */}
                    {combatProfile && (
                      <div style={{ fontSize: '12px', color: '#78281f', background: '#fdf2f2', padding: '6px 10px', borderRadius: '4px', border: '1px solid #f5b7b1', margin: '6px 0' }}>
                        <strong>Combat &amp; Tactics:</strong> {combatProfile}
                      </div>
                    )}

                    {/* Lore & Ecology */}
                    {desc && (
                      <div style={{ fontSize: '13px', color: '#2b1810', lineHeight: '1.5', marginTop: '6px' }}>
                        <RichLoreText text={desc} className="parchment-theme" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Items & Loot Tab */}
          {activeTab === 'items' && (
            <div className="tab-pane-items" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {transferSuccess && (
                <div style={{ padding: '8px 14px', background: '#eafaf1', border: '1.5px solid #27ae60', borderRadius: '6px', color: '#145a32', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-check-circle" /> {transferSuccess}
                </div>
              )}

              {/* GM Item Veiling Status */}
              {isGM && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: localIsItemHidden ? '#fdf4f4' : '#f0faf5', border: `1px solid ${localIsItemHidden ? '#c0392b' : '#27ae60'}`, borderRadius: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: localIsItemHidden ? '#96281b' : '#1e8449' }}>
                    <i className={`fas ${localIsItemHidden ? 'fa-eye-slash' : 'fa-eye'}`} /> {localIsItemHidden ? 'Item Tooltip Veiled from Players (Unidentified / Requires Attunement)' : 'Item Tooltip Visible to Players'}
                  </span>
                  <button
                    type="button"
                    className="btn-gm-action"
                    style={{ fontSize: '11px', padding: '3px 8px' }}
                    onClick={() => {
                      const next = !localIsItemHidden;
                      setLocalIsItemHidden(next);
                      if (onEditPin) {
                        onEditPin({ ...pin, isItemHidden: next });
                      }
                    }}
                  >
                    {localIsItemHidden ? '👁️ Reveal to Players' : '🔒 Veil from Players'}
                  </button>
                </div>
              )}

              {/* Player View of Veiled Item */}
              {!isGM && localIsItemHidden ? (
                <div
                  style={{
                    background: '#fdfbf5',
                    border: '1.5px solid #8e44ad',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: '#f4ecf7',
                      border: '2px solid #8e44ad',
                      color: '#8e44ad',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      margin: '0 auto 10px auto'
                    }}
                  >
                    <i className="fas fa-question" />
                  </div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#4a235a', fontFamily: 'Cinzel, serif', fontSize: '16px', fontWeight: 800 }}>
                    {pin.unidentifiedName || 'Enigmatic Veiled Relic'}
                  </h4>
                  <span style={{ display: 'inline-block', fontSize: '11px', background: '#f4ecf7', color: '#6c3483', border: '1px solid #d2b4de', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, marginBottom: '10px' }}>
                    🔒 Veiled Properties • Requires Attunement or Arcana Deciphering
                  </span>
                  <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#5b2c6f', fontStyle: 'italic', lineHeight: '1.5' }}>
                    {pin.unidentifiedDescription || 'The esoteric runes and true powers of this item remain obscured. A successful appraisal, lore deciphering, or attunement ritual is required to reveal its enchantments.'}
                  </p>

                  <button
                    type="button"
                    className="btn-gm-action active"
                    style={{ fontSize: '12px', padding: '7px 16px', fontWeight: 800, margin: '0 auto' }}
                    onClick={() => {
                      const rawItem = resolveItem(linked.itemIds[0], items);
                      handleGiveItemToPlayer(rawItem, 'your inventory');
                    }}
                  >
                    <i className="fas fa-hand-sparkles" /> Take Veiled Item / Add to My Inventory
                  </button>
                </div>
              ) : (
                linked.itemIds.map((iId) => {
                  const rawItem = resolveItem(iId, items);
                  if (!rawItem) return null;

                  return (
                    <div key={iId} className="pin-modal-item-embed">
                      {/* Full Embedded Item Tooltip */}
                      <ItemTooltip item={rawItem} />

                      {/* Footer Actions & Merchant Price */}
                      <div className="pin-modal-item-footer">
                        {/* Merchant / Shop Stand Price */}
                        {(pin.shopPrice || rawItem.value) && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fef9e7', border: '1px solid #f9e79f', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', color: '#7d6608', fontWeight: 700 }}>
                            <i className="fas fa-coins" style={{ color: '#d4af37' }} />
                            <span>Shop / Stand Price: <strong>{pin.shopPrice || formatItemPrice(rawItem.value)}</strong></span>
                          </div>
                        )}

                        {/* Transfer to Character Inventory Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          {allAvailableCharacters.length > 0 && isGM ? (
                            <>
                              <span style={{ fontSize: '12px', fontWeight: 700, color: '#5c3e21' }}>
                                <i className="fas fa-gift" style={{ color: '#8b5a1a' }} /> Give to:
                              </span>
                              <select
                                value={selectedCharId || allAvailableCharacters[0]?.id || ''}
                                onChange={(e) => setSelectedCharId(e.target.value)}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  border: '1.5px solid #8c6738',
                                  background: '#ffffff',
                                  fontSize: '12px',
                                  color: '#2b1810',
                                  fontWeight: 600,
                                  flex: 1,
                                  minWidth: '130px'
                                }}
                              >
                                {allAvailableCharacters.map(char => (
                                  <option key={char.id} value={char.id}>{char.name}</option>
                                ))}
                              </select>
                              <button
                                type="button"
                                className="btn-gm-action active"
                                style={{ fontSize: '11px', padding: '6px 14px', fontWeight: 800 }}
                                onClick={() => {
                                  const targetChar = allAvailableCharacters.find(c => c.id === (selectedCharId || allAvailableCharacters[0]?.id));
                                  handleGiveItemToPlayer(rawItem, targetChar?.name);
                                }}
                              >
                                <i className="fas fa-hand-holding-hand" /> Transfer
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              className="btn-gm-action active"
                              style={{ fontSize: '13px', padding: '8px 16px', fontWeight: 800, width: '100%', justifyContent: 'center' }}
                              onClick={() => handleGiveItemToPlayer(rawItem, 'your inventory')}
                            >
                              <i className="fas fa-hand-sparkles" /> Take Item / Add to My Inventory
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Quests Tab */}
          {activeTab === 'quests' && (
            <div className="tab-pane-quests" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {linked.questIds.map((qId) => {
                const storeQuest = (quests || []).find(quest => quest.id === qId);
                const universalQuest = !storeQuest ? universalEntityService.getEntity(qId) : null;
                const rawQ = storeQuest || universalQuest?.raw || {};
                const qTitle = storeQuest?.title || universalQuest?.title || qId;
                const qStatus = rawQ.status || 'Active';
                const qDesc = rawQ.description || universalQuest?.summary || '';
                const objectives = rawQ.objectives || [];

                return (
                  <div
                    key={qId}
                    style={{
                      background: '#fdfbf5',
                      border: '1.5px solid #d35400',
                      borderRadius: '8px',
                      padding: '14px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-scroll" style={{ color: '#d35400', fontSize: '15px' }} />
                        <span style={{ fontSize: '15px', fontWeight: 800, color: '#2b1810', fontFamily: 'Cinzel, serif' }}>
                          {qTitle}
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', background: '#fbeee6', color: '#d35400', border: '1px solid #d35400', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase' }}>
                        {qStatus}
                      </span>
                    </div>

                    {qDesc && (
                      <div style={{ fontSize: '13px', color: '#2b1810', lineHeight: '1.5', marginBottom: '8px' }}>
                        <RichLoreText text={qDesc} className="parchment-theme" />
                      </div>
                    )}

                    {/* Objectives Checklist */}
                    {objectives.length > 0 && (
                      <div style={{ borderTop: '1px dashed #e8dcbe', paddingTop: '8px', marginTop: '6px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#5c3e21', marginBottom: '4px' }}>
                          Quest Objectives:
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {objectives.map((obj, oIdx) => {
                            const isDone = obj.completed || (obj.progress !== undefined && obj.progress >= obj.count);
                            return (
                              <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: isDone ? '#27ae60' : '#4a3525' }}>
                                <i className={`fas ${isDone ? 'fa-check-circle' : 'fa-circle-notch'}`} style={{ fontSize: '11px', color: isDone ? '#27ae60' : '#8c6738' }} />
                                <span style={{ textDecoration: isDone ? 'line-through' : 'none' }}>
                                  {obj.text || obj.description || obj.name || `Objective ${oIdx + 1}`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Lore Tab */}
          {activeTab === 'lore' && (
            <div className="tab-pane-lore">
              {linked.locationId && (
                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ margin: '0 0 6px 0', color: '#5c3e21', fontSize: '14px', fontWeight: 700 }}>Location Codex Reference</h4>
                  <p style={{ margin: 0, color: '#2b1810' }}><i className="fas fa-landmark" style={{ color: '#8c6738' }}></i> {linked.locationId}</p>
                </div>
              )}
              {(linked.factionIds?.length || 0) > 0 && (
                <div>
                  <h4 style={{ margin: '0 0 6px 0', color: '#5c3e21', fontSize: '14px', fontWeight: 700 }}>Faction Influence</h4>
                  {linked.factionIds.map(fId => {
                    const f = (factions || []).find(fac => fac.id === fId);
                    if (!f) return null;
                    return (
                      <div key={fId} style={{ padding: '8px 12px', background: '#fcf8eb', borderRadius: '6px', marginBottom: '6px', borderLeft: '3px solid #8c6738', border: '1px solid #e8dcbe' }}>
                        <strong style={{ color: '#2b1810' }}>{f.name}</strong> — <span style={{ color: '#6d4c28' }}>{f.type || 'Order'}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* GM Notes Tab */}
          {activeTab === 'notes' && isGM && (
            <div className="tab-pane-notes">
              <div style={{ padding: '12px 14px', background: '#fdf4f4', borderRadius: '8px', border: '1.5px solid #a83232' }}>
                <h4 style={{ margin: '0 0 6px 0', color: '#8a1f11', fontSize: '13px', fontWeight: 700 }}><i className="fas fa-eye-slash"></i> GM Field Secrets</h4>
                <p style={{ margin: 0, color: '#4a1515', fontStyle: 'italic' }}>{linked.journalNotes || 'No GM notes recorded.'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="location-pin-modal-footer">
          <div>
            {isGM && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-gm-action"
                  onClick={() => onToggleSecret(pin.id)}
                  title={pin.isSecretGM ? "Reveal to Players" : "Hide from Players"}
                >
                  <i className={`fas ${pin.isSecretGM ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                  {pin.isSecretGM ? 'Reveal to Players' : 'Hide from Players'}
                </button>
                <button
                  type="button"
                  className="btn-gm-action"
                  onClick={() => onEditPin(pin)}
                >
                  <i className="fas fa-pen"></i> Edit
                </button>
                <button
                  type="button"
                  className="btn-gm-action"
                  style={{ color: '#ff6b6b', borderColor: '#ff6b6b' }}
                  onClick={() => onDeletePin(pin.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            )}
          </div>

          <div>
            {pin.targetMapId && targetSubMap && (
              <button
                type="button"
                className="btn-enter-submap"
                onClick={() => onEnterSubMap(pin.targetMapId)}
              >
                <i className={`fas ${isTacticalSubMap ? 'fa-chess-board' : 'fa-magnifying-glass-plus'}`}></i> {isTacticalSubMap ? `Enter Battle Grid: ${targetSubMap.name} ↗` : `Enter Sub-Map: ${targetSubMap.name} ↗`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LocationPinDetailModal;
