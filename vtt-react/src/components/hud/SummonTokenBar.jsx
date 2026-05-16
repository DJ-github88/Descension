import React, { useState, useMemo, useCallback } from 'react';
import WowWindow from '../windows/WowWindow';
import SummonTokenCard from './SummonTokenCard';
import { getTokensForCharacter, resolveClassId } from '../../data/summonableTokens';
import { summonTokenFromTemplate, templateToCreatureData } from '../../services/tokenSummonService';
import { getCreatureTokenIconUrl, getIconUrl } from '../../utils/assetManager';
import useGameStore from '../../store/gameStore';
import useCreatureStore from '../../store/creatureStore';

const CLASS_COLORS = {
  primalist: '#4ade80', exorcist: '#a855f7', formbender: '#f59e0b',
  witchdoctor: '#06b6d4', toxicologist: '#84cc16', falseprophet: '#8b5cf6',
  oracle: '#3b82f6', chaosweaver: '#ec4899', chronarch: '#6366f1',
  minstrel: '#f472b6', lichborne: '#60a5fa', inscriptor: '#fbbf24',
  deathcaller: '#6b7280', huntress: '#22c55e', pyrofiend: '#ef4444',
  warden: '#14b8a6', race: '#f97316',
};

const SummonTokenBar = ({ isOpen, onClose, character }) => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const all = useMemo(() => {
    return getTokensForCharacter(character);
  }, [character?.characterClass, character?.race, character?.subrace, character?.level]);

  const classId = resolveClassId(character?.characterClass);
  const accentColor = CLASS_COLORS[classId] || '#7a3b2e';
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

  const handleCardClick = useCallback((template) => {
    const gameStore = useGameStore.getState();
    const position = {
      x: gameStore.cameraX || 0,
      y: gameStore.cameraY || 0,
    };

    summonTokenFromTemplate(template.id, position, character);
  }, [character]);

  const handleCustomize = useCallback((template, focusField) => {
    const gameStore = useGameStore.getState();
    const creatureStore = useCreatureStore.getState();
    const position = {
      x: gameStore.cameraX || 0,
      y: gameStore.cameraY || 0,
    };

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

    creatureStore.addCreatureToken(creatureData, position, true, null, false, null);
  }, [character]);

  const handleDragStart = useCallback((template) => {}, []);
  const handleDragEnd = useCallback(() => {}, []);

  if (!isOpen) return null;

  const windowTitle = `${character?.characterClass || character?.name || 'Class'} Summons`;

  return (
    <WowWindow
      title={windowTitle}
      isOpen={true}
      onClose={onClose}
      defaultSize={{ width: 440, height: 600 }}
      defaultPosition={{ x: window.innerWidth - 470, y: 80 }}
    >
      <div style={{
        display: 'flex', flexDirection: 'column', height: '100%',
        fontFamily: "'Bookman Old Style', 'Garamond', serif",
        color: '#3a3a3a',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '6px 8px',
          borderBottom: '1px solid rgba(160, 140, 112, 0.5)',
          background: '#e6dcc6',
        }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center',
            background: '#f0e6d2', border: '1px solid #a08c70',
            borderRadius: '4px', padding: '2px 6px',
          }}>
            <i className="fas fa-search" style={{ color: '#a08c70', fontSize: '10px', marginRight: '4px' }}></i>
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none', background: 'transparent', outline: 'none',
                fontSize: '10px', width: '100%', color: '#3a3a3a',
                fontFamily: "'Bookman Old Style', serif",
              }}
            />
          </div>
          <span style={{
            fontSize: '9px', color: '#7a3b2e', fontWeight: 'bold',
            whiteSpace: 'nowrap',
          }}>
            {unlockedDisplay.length} <i className="fas fa-paw" style={{ fontSize: '8px' }}></i>
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
                  flex: 1, padding: '3px 6px', fontSize: '9px',
                  background: filter === f.key ? '#7a3b2e' : 'rgba(240, 230, 210, 0.6)',
                  border: `1px solid ${filter === f.key ? '#5e2e23' : 'rgba(160, 140, 112, 0.5)'}`,
                  borderRadius: '3px',
                  color: filter === f.key ? '#f0e6d2' : '#3a3a3a',
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
          fontSize: '8px', color: '#a08c70', textAlign: 'center',
          padding: '3px', fontStyle: 'italic',
          borderBottom: '1px solid rgba(160, 140, 112, 0.3)',
        }}>
          Drag to grid to place &bull; Right-click to customize
        </div>

        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 6px' }}>
          {unlockedDisplay.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {unlockedDisplay.map(template => (
                <SummonTokenCard
                  key={template.id}
                  template={template}
                  character={character}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onClick={handleCardClick}
                  onCustomize={handleCustomize}
                />
              ))}
            </div>
          )}

          {lockedDisplay.length > 0 && (
            <>
              <div style={{
                fontSize: '9px', color: '#a08c70', marginTop: '8px', marginBottom: '4px',
                borderTop: '1px solid rgba(160, 140, 112, 0.3)', paddingTop: '6px',
                fontFamily: "'Bookman Old Style', serif",
              }}>
                <i className="fas fa-lock" style={{ fontSize: '8px', marginRight: '3px' }}></i>
                Locked ({lockedDisplay.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
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
              textAlign: 'center', color: '#a08c70', fontSize: '11px',
              padding: '30px 10px', fontFamily: "'Bookman Old Style', serif",
            }}>
              <i className="fas fa-ghost" style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}></i>
              No summon tokens available.
            </div>
          )}
        </div>

        <div style={{
          marginTop: 'auto', padding: '4px 8px',
          borderTop: '1px solid rgba(160, 140, 112, 0.5)',
          background: '#e6dcc6',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: '9px', color: '#5a5a5a',
        }}>
          <span>{character?.name || character?.characterName || 'Unknown'}</span>
          <span>Level {character?.level || 1}</span>
        </div>
      </div>
    </WowWindow>
  );
};

export default SummonTokenBar;
