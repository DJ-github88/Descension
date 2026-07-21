import React, { useState, useMemo, useCallback, useEffect } from 'react';
import MythrillWindow from '../windows/MythrillWindow';
import SummonTokenCard from './SummonTokenCard';
import CraftCustomSummonModal from './craftCustomSummonModal';
import CreatureIconSelector from '../creature-wizard/components/common/CreatureIconSelector';
import { getTokensForCharacter, resolveClassId, registerCustomSummonTemplates } from '../../data/summonableTokens';
import { summonTokenFromTemplate } from '../../services/tokenSummonService';
import useGameStore from '../../store/gameStore';
import useCreatureStore from '../../store/creatureStore';
import useCustomSummonStore from '../../store/customSummonStore';

const CLASS_COLORS = {
  primalist: '#4ade80', exorcist: '#a855f7', formbender: '#f59e0b',
  witchdoctor: '#06b6d4', toxicologist: '#84cc16', falseprophet: '#8b5cf6',
    harbinger: '#ec4899', chronarch: '#6366f1',
  minstrel: '#f472b6', revenant: '#2D1B69', inquisitor: '#fbbf24',
  apex: '#22c55e', pyrofiend: '#ef4444',
  warden: '#14b8a6', race: '#f97316',
};

const CATEGORY_ORDER = ['totem', 'trap', 'companion', 'beast', 'fiend', 'undead', 'elemental', 'construct'];
const CATEGORY_LABELS = {
  totem: 'Totems', trap: 'Traps', companion: 'Companions',
  beast: 'Beasts', fiend: 'Fiends', undead: 'Undead',
  elemental: 'Elementals', construct: 'Constructs',
  other: 'Other Summons',
};

const getCategoryKey = (template) => {
  const cat = template.category;
  if (cat && CATEGORY_LABELS[cat]) return cat;
  // Infer from creature type
  const type = (template.creature?.type || '').toLowerCase();
  if (type === 'undead') return 'undead';
  if (type === 'fiend') return 'fiend';
  if (type === 'elemental') return 'elemental';
  if (type === 'construct' && (template.creature?.stats?.speed || 0) === 0) return 'totem';
  if (type === 'construct') return 'construct';
  if (type === 'beast') return 'beast';
  return 'other';
};

const SummonTokenBar = ({ isOpen, onClose, character }) => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCraftModal, setShowCraftModal] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null);
  const [iconPickerFor, setIconPickerFor] = useState(null);

  const customTemplates = useCustomSummonStore((s) => s.customTemplates);
  const updateCustomTemplate = useCustomSummonStore((s) => s.updateTemplate);

  const classId = resolveClassId(character?.characterClass);

  // Register custom templates so summonableTokens lookups include them
  useEffect(() => {
    const scoped = customTemplates.filter((t) => {
      if (t.characterId && t.characterId !== (character?.id || character?.characterId)) return false;
      if (t.classId && t.classId !== classId) return false;
      return true;
    });
    registerCustomSummonTemplates(scoped);
  }, [customTemplates, classId, character?.id, character?.characterId]);

  const all = useMemo(() => {
    return getTokensForCharacter(character);
  }, [character?.characterClass, character?.race, character?.subrace, character?.level, customTemplates]);

    const hasRaceTokens = all.some(t => t.race);

  const classTokens = all.filter(t => !t.race);
  const raceTokens = all.filter(t => t.race);

  const baseTokens = filter === 'race' ? raceTokens
    : filter === 'class' ? classTokens
    : all;

  const displayTokens = searchQuery
    ? baseTokens.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || (t.description || '').toLowerCase().includes(searchQuery.toLowerCase()))
    : baseTokens;

  const unlockedDisplay = displayTokens.filter(t => t.level <= (character?.level || 1));
  const lockedDisplay = displayTokens.filter(t => t.level > (character?.level || 1));

  // Group unlocked tokens by category
  const grouped = useMemo(() => {
    const groups = {};
    for (const t of unlockedDisplay) {
      const key = getCategoryKey(t);
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    }
    return groups;
  }, [unlockedDisplay]);

  const sortedCategoryKeys = useMemo(() => {
    const keys = Object.keys(grouped);
    keys.sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a);
      const bi = CATEGORY_ORDER.indexOf(b);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
    return keys;
  }, [grouped]);

  const handleCardClick = useCallback((template) => {
    const gameStore = useGameStore.getState();
    const position = {
      x: gameStore.cameraX || 0,
      y: gameStore.cameraY || 0,
    };

    summonTokenFromTemplate(template.id, position, character);
  }, [character]);

  const handleCustomize = useCallback((template, focusField) => {
    // Icon change — open the icon picker
    if (focusField === 'icon') {
      setIconPickerFor(template);
      return;
    }

    // Abilities edit — for custom templates, open craft modal in edit mode
    if (focusField === 'abilities') {
      if (template.isCustom) {
        setEditTemplate(template);
        setShowCraftModal(true);
      }
      // For built-in templates, no inline ability editor — use Craft to make a custom copy
      return;
    }

    // Name/stats customize-and-place flow
    const gameStore = useGameStore.getState();
    const creatureStore = useCreatureStore.getState();
    const position = {
      x: gameStore.cameraX || 0,
      y: gameStore.cameraY || 0,
    };

    const { templateToCreatureData } = require('../../services/tokenSummonService');
    const creatureData = templateToCreatureData(template, character);

    if (focusField === 'name') {
      const newName = prompt('Token name:', template.creature.name);
      if (newName) creatureData.name = newName;
    }

    if (focusField === 'stats') {
      const hpStr = prompt('Max HP:', template.creature.stats?.maxHp || 10);
      if (hpStr) {
        const hp = parseInt(hpStr) || 10;
        creatureData.stats.maxHp = hp;
        creatureData.stats.currentHp = hp;
      }
    }

    // Place the customized token
    creatureStore.addCreatureToken(creatureData, position, true, null, false, null);
  }, [character]);

  const handleIconPicked = useCallback((iconId) => {
    if (!iconPickerFor) return;

    if (iconPickerFor.isCustom) {
      // Update the custom template's icon
      updateCustomTemplate(iconPickerFor.id, {
        creature: {
          ...iconPickerFor.creature,
          tokenIcon: iconId,
        },
      });
    } else {
      // For built-in templates, create a custom copy with the new icon
      const newTemplate = {
        ...iconPickerFor,
        id: `custom_${Date.now()}`,
        isCustom: true,
        classId,
        characterId: character?.id || character?.characterId,
        name: `${iconPickerFor.name} (Custom Icon)`,
        creature: {
          ...iconPickerFor.creature,
          tokenIcon: iconId,
        },
      };
      useCustomSummonStore.getState().createTemplate(newTemplate);
    }

    setIconPickerFor(null);
  }, [iconPickerFor, updateCustomTemplate, classId, character]);

  const handleDeleteCustom = useCallback((templateId) => {
    if (window.confirm('Delete this custom summon?')) {
      useCustomSummonStore.getState().deleteTemplate(templateId);
    }
  }, []);

  if (!isOpen) return null;

  const windowTitle = `${character?.characterClass || character?.name || 'Class'} Summons`;

  return (
    <>
      <MythrillWindow
        title={windowTitle}
        isOpen={true}
        onClose={onClose}
        defaultSize={{ width: 440, height: 600 }}
        defaultPosition={{ x: window.innerWidth - 470, y: 80 }}
      >
        <div style={{
          display: 'flex', flexDirection: 'column', height: '100%',
          fontFamily: "'Bookman Old Style', 'Garamond', serif",
          color: '#2a1a0a',
          fontSize: '14px',
        }}>
          {/* Search + Craft button */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 8px',
            borderBottom: '1px solid rgba(160, 140, 112, 0.5)',
            background: '#e6dcc6',
          }}>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center',
              background: '#f0e6d2', border: '1px solid #a08c70',
              borderRadius: '4px', padding: '2px 6px',
            }}>
              <i className="fas fa-search" style={{ color: '#a08c70', fontSize: '11px', marginRight: '4px' }}></i>
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none', background: 'transparent', outline: 'none',
                  fontSize: '12px', width: '100%', color: '#2a1a0a',
                  fontFamily: "'Bookman Old Style', serif",
                }}
              />
            </div>
            <button
              onClick={() => setShowCraftModal(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '3px 8px', fontSize: '11px', fontWeight: '600',
                background: 'linear-gradient(135deg, #7a3b2e, #5e2e23)',
                border: '1px solid #4a2010', borderRadius: '4px',
                color: '#f0e6d2', cursor: 'pointer',
                fontFamily: "'Bookman Old Style', serif",
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
              title="Craft a custom summon from your creature library"
            >
              <i className="fas fa-hammer" style={{ fontSize: '10px' }}></i>
              Craft
            </button>
            <span style={{
              fontSize: '11px', color: '#4a2010', fontWeight: 'bold',
              whiteSpace: 'nowrap',
            }}>
              {unlockedDisplay.length} <i className="fas fa-paw" style={{ fontSize: '9px' }}></i>
            </span>
          </div>

          {hasRaceTokens && (
            <div style={{
              display: 'flex', gap: '2px', padding: '4px 8px',
              background: '#e6dcc6', borderBottom: '1px solid rgba(160, 140, 112, 0.5)',
            }}>
              {[
                { key: 'all', label: 'All' },
                { key: 'class', label: character?.characterClass || 'Class' },
                { key: 'race', label: 'Racial' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  style={{
                    flex: 1, padding: '3px 6px', fontSize: '11px',
                    background: filter === f.key ? '#7a3b2e' : 'rgba(240, 230, 210, 0.6)',
                    border: `1px solid ${filter === f.key ? '#5e2e23' : 'rgba(160, 140, 112, 0.5)'}`,
                    borderRadius: '3px',
                    color: filter === f.key ? '#f0e6d2' : '#2a1a0a',
                    cursor: 'pointer',
                    fontFamily: "'Bookman Old Style', serif",
                    transition: 'background 0.15s ease',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          <div style={{
            fontSize: '11px', color: '#5a3a20', textAlign: 'center',
            padding: '3px', fontStyle: 'italic',
            borderBottom: '1px solid rgba(160, 140, 112, 0.3)',
          }}>
            Drag to grid to place &bull; Right-click to customize
          </div>

          {/* Token list grouped by category */}
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '6px' }}>
            {sortedCategoryKeys.map((catKey) => {
              const tokens = grouped[catKey];
              const builtin = tokens.filter(t => !t.isCustom);
              const custom = tokens.filter(t => t.isCustom);

              return (
                <div key={catKey} style={{ marginBottom: '8px' }}>
                  {/* Category header */}
                  <div style={{
                    fontSize: '11px', fontWeight: '700', color: '#4a2010',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                    padding: '4px 4px', borderBottom: '2px solid rgba(122, 59, 46, 0.3)',
                    marginBottom: '4px',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    {CATEGORY_LABELS[catKey] || catKey}
                    <span style={{ fontSize: '10px', color: '#a08c70', fontWeight: '400' }}>
                      ({tokens.length})
                    </span>
                  </div>

                  {/* Built-in tokens */}
                  {builtin.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {builtin.map(template => (
                        <SummonTokenCard
                          key={template.id}
                          template={template}
                          character={character}
                          onClick={handleCardClick}
                          onCustomize={handleCustomize}
                        />
                      ))}
                    </div>
                  )}

                  {/* Custom tokens subsection */}
                  {custom.length > 0 && (
                    <div style={{ marginLeft: '8px', marginTop: '4px' }}>
                      <div style={{
                        fontSize: '10px', color: '#7a3b2e', fontStyle: 'italic',
                        marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px',
                      }}>
                        <i className="fas fa-hammer" style={{ fontSize: '8px' }}></i>
                        Custom
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {custom.map(template => (
                          <div key={template.id} style={{ position: 'relative' }}>
                            <SummonTokenCard
                              template={template}
                              character={character}
                              onClick={handleCardClick}
                              onCustomize={handleCustomize}
                            />
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteCustom(template.id); }}
                              style={{
                                position: 'absolute', top: '4px', right: '4px',
                                width: '18px', height: '18px',
                                background: 'rgba(178, 34, 34, 0.15)', border: '1px solid #b22222',
                                borderRadius: '3px', color: '#b22222', cursor: 'pointer',
                                fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                zIndex: 1,
                              }}
                              title="Delete custom summon"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {lockedDisplay.length > 0 && (
              <>
                <div style={{
                  fontSize: '11px', color: '#a08c70', marginTop: '8px', marginBottom: '4px',
                  borderTop: '1px solid rgba(160, 140, 112, 0.3)', paddingTop: '6px',
                  fontFamily: "'Bookman Old Style', serif",
                }}>
                  <i className="fas fa-lock" style={{ fontSize: '9px', marginRight: '3px' }}></i>
                  Locked ({lockedDisplay.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {lockedDisplay.map(template => (
                    <SummonTokenCard
                      key={template.id}
                      template={template}
                      character={character}
                    />
                  ))}
                </div>
              </>
            )}

            {displayTokens.length === 0 && (
              <div style={{
                textAlign: 'center', color: '#5a3a20', fontSize: '14px',
                padding: '30px 10px', fontFamily: "'Bookman Old Style', serif",
              }}>
                <i className="fas fa-ghost" style={{ fontSize: '28px', display: 'block', marginBottom: '8px' }}></i>
                No summon tokens available.
                <br />
                <button
                  onClick={() => setShowCraftModal(true)}
                  style={{
                    marginTop: '10px', padding: '5px 12px', fontSize: '12px',
                    background: 'linear-gradient(135deg, #7a3b2e, #5e2e23)',
                    border: '1px solid #4a2010', borderRadius: '4px',
                    color: '#f0e6d2', cursor: 'pointer',
                    fontFamily: "'Bookman Old Style', serif",
                  }}
                >
                  <i className="fas fa-hammer" style={{ marginRight: '4px' }}></i>
                  Craft Your First Summon
                </button>
              </div>
            )}
          </div>

          <div style={{
            marginTop: 'auto', padding: '4px 8px',
            borderTop: '1px solid rgba(160, 140, 112, 0.5)',
            background: '#e6dcc6',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontSize: '11px', color: '#3a2a1a',
          }}>
            <span>{character?.name || character?.characterName || 'Unknown'}</span>
            <span>Level {character?.level || 1}</span>
          </div>
        </div>
      </MythrillWindow>

      {/* Craft Custom Summon Modal */}
      <CraftCustomSummonModal
        isOpen={showCraftModal}
        onClose={() => { setShowCraftModal(false); setEditTemplate(null); }}
        character={character}
        editTemplate={editTemplate}
      />

      {/* Icon Picker for "Change Icon" */}
      {iconPickerFor && (
        <CreatureIconSelector
          isOpen={true}
          onClose={() => setIconPickerFor(null)}
          currentIcon={iconPickerFor.creature?.tokenIcon}
          onSelect={handleIconPicked}
        />
      )}
    </>
  );
};

export default SummonTokenBar;
