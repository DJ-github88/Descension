import React, { useState, useCallback, useEffect } from 'react';
import { ROLLABLE_TABLES, rollOnTable, getTableList } from '../../data/rollableTables';
import useFeatureFlag from '../../hooks/useFeatureFlag';
import { saveCustomTable, getUserCustomTables, deleteCustomTable } from '../../services/firebase/customRollableTablesService';
import './RollableTable.css';

const EMPTY_CUSTOM = { name: '', die: 'd20', icon: '🎲', entries: [{ min: 1, max: 1, result: '' }] };

const RollableTable = ({ onResult, embedded = false, userId }) => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [rollHistory, setRollHistory] = useState([]);
  const [customTables, setCustomTables] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editDraft, setEditDraft] = useState({ ...EMPTY_CUSTOM });
  const [saving, setSaving] = useState(false);
  const { allowed: customTablesAllowed } = useFeatureFlag('customRollableTables');

  const presetTables = getTableList();

  useEffect(() => {
    if (userId && customTablesAllowed) {
      getUserCustomTables(userId).then(setCustomTables);
    }
  }, [userId, customTablesAllowed]);

  const allTables = [...presetTables, ...customTables.map(t => ({
    id: t.id,
    name: t.name,
    description: t.description || '',
    icon: t.icon || '🎲',
    die: t.die || 'd20',
    entryCount: (t.entries || []).length
  }))];

  const handleRoll = useCallback(() => {
    if (!selectedTable) return;
    setIsRolling(true);

    setTimeout(() => {
      const preset = ROLLABLE_TABLES[selectedTable];
      if (preset) {
        const result = rollOnTable(selectedTable);
        if (result) {
          setLastResult(result);
          setRollHistory(prev => [result, ...prev].slice(0, 20));
          if (onResult) onResult(result);
        }
      } else {
        const custom = customTables.find(t => t.id === selectedTable);
        if (custom && custom.entries?.length) {
          const dieSize = parseInt((custom.die || 'd20').replace('d', ''), 10);
          const roll = Math.floor(Math.random() * dieSize) + 1;
          const entry = custom.entries.find(e => roll >= e.min && roll <= e.max);
          if (entry) {
            const result = { tableId: custom.id, tableName: custom.name, roll, result: entry.result, die: custom.die || 'd20' };
            setLastResult(result);
            setRollHistory(prev => [result, ...prev].slice(0, 20));
            if (onResult) onResult(result);
          }
        }
      }
      setIsRolling(false);
    }, 300 + Math.random() * 400);
  }, [selectedTable, onResult, customTables]);

  const currentTable = ROLLABLE_TABLES[selectedTable] || customTables.find(t => t.id === selectedTable);

  const handleSaveCustom = async () => {
    if (!userId || !editDraft.name.trim() || !editDraft.entries.length) return;
    setSaving(true);
    const result = await saveCustomTable(userId, { ...editDraft });
    if (result.success) {
      const updated = await getUserCustomTables(userId);
      setCustomTables(updated);
      setShowEditor(false);
      setEditDraft({ ...EMPTY_CUSTOM });
    }
    setSaving(false);
  };

  const handleDeleteCustom = async (tableId) => {
    if (!userId) return;
    await deleteCustomTable(userId, tableId);
    const updated = await getUserCustomTables(userId);
    setCustomTables(updated);
    if (selectedTable === tableId) {
      setSelectedTable(null);
      setLastResult(null);
    }
  };

  const addEntry = () => {
    const entries = [...editDraft.entries];
    const lastMax = entries.length > 0 ? entries[entries.length - 1].max : 0;
    entries.push({ min: lastMax + 1, max: lastMax + 1, result: '' });
    setEditDraft({ ...editDraft, entries });
  };

  const updateEntry = (index, field, value) => {
    const entries = [...editDraft.entries];
    entries[index] = { ...entries[index], [field]: field === 'result' ? value : Number(value) };
    setEditDraft({ ...editDraft, entries });
  };

  const removeEntry = (index) => {
    const entries = editDraft.entries.filter((_, i) => i !== index);
    setEditDraft({ ...editDraft, entries });
  };

  return (
    <div className={`rollable-table-container ${embedded ? 'rollable-table-embedded' : ''}`}>
      <div className="rollable-table-header">
        <h3>Rollable Tables</h3>
        <select
          className="rollable-table-select"
          value={selectedTable || ''}
          onChange={(e) => {
            setSelectedTable(e.target.value);
            setLastResult(null);
          }}
        >
          <option value="">Select a table...</option>
          <optgroup label="Preset Tables">
            {presetTables.map(t => (
              <option key={t.id} value={t.id}>
                {t.icon} {t.name} ({t.die})
              </option>
            ))}
          </optgroup>
          {customTables.length > 0 && (
            <optgroup label="My Custom Tables">
              {customTables.map(t => (
                <option key={t.id} value={t.id}>
                  {t.icon || '🎲'} {t.name} ({t.die || 'd20'})
                </option>
              ))}
            </optgroup>
          )}
        </select>
      </div>

      {currentTable && (
        <div className="rollable-table-entries">
          <div className="rollable-table-info">
            <span className="rollable-table-icon">{currentTable.icon || '🎲'}</span>
            <span className="rollable-table-name">{currentTable.name}</span>
            <span className="rollable-table-die">{currentTable.die || 'd20'}</span>
            {!ROLLABLE_TABLES[selectedTable] && customTablesAllowed && (
              <button className="rollable-table-delete-btn" onClick={() => handleDeleteCustom(selectedTable)} title="Delete this table">
                ✕
              </button>
            )}
          </div>

          <div className="rollable-table-list">
            {(currentTable.entries || []).map((entry, i) => (
              <div
                key={i}
                className={`rollable-table-entry ${
                  lastResult && lastResult.roll >= entry.min && lastResult.roll <= entry.max
                    ? 'rollable-table-entry-highlighted'
                    : ''
                }`}
              >
                <span className="rollable-table-range">{entry.min}-{entry.max}</span>
                <span className="rollable-table-result">{entry.result}</span>
              </div>
            ))}
          </div>

          <button
            className={`rollable-table-roll-btn ${isRolling ? 'rolling' : ''}`}
            onClick={handleRoll}
            disabled={!selectedTable || isRolling}
          >
            {isRolling ? 'Rolling...' : `Roll ${currentTable.die || 'd20'}`}
          </button>

          {lastResult && (
            <div className="rollable-table-result-display">
              <div className="rollable-table-result-header">
                <span className="rollable-table-result-label">Result</span>
                <span className="rollable-table-result-die">
                  {lastResult.die}: <strong>{lastResult.roll}</strong>
                </span>
              </div>
              <div className="rollable-table-result-text">{lastResult.result}</div>
            </div>
          )}
        </div>
      )}

      {customTablesAllowed ? (
        <div className="rollable-table-custom-section">
          {!showEditor ? (
            <button className="rollable-table-create-btn" onClick={() => setShowEditor(true)}>
              + Create Custom Table
            </button>
          ) : (
            <div className="rollable-table-editor">
              <div className="rollable-table-editor-header">
                <h4>Create Custom Table</h4>
                <button className="rollable-table-cancel-btn" onClick={() => { setShowEditor(false); setEditDraft({ ...EMPTY_CUSTOM }); }}>Cancel</button>
              </div>
              <div className="rollable-table-editor-field">
                <label>Name</label>
                <input
                  type="text"
                  value={editDraft.name}
                  onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                  placeholder="Table name..."
                />
              </div>
              <div className="rollable-table-editor-field">
                <label>Die</label>
                <select value={editDraft.die} onChange={(e) => setEditDraft({ ...editDraft, die: e.target.value })}>
                  {['d4','d6','d8','d10','d12','d20','d100'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="rollable-table-editor-entries">
                <label>Entries</label>
                {editDraft.entries.map((entry, i) => (
                  <div key={i} className="rollable-table-editor-entry">
                    <input type="number" value={entry.min} onChange={(e) => updateEntry(i, 'min', e.target.value)} min={1} style={{ width: 40 }} />
                    <span>-</span>
                    <input type="number" value={entry.max} onChange={(e) => updateEntry(i, 'max', e.target.value)} min={1} style={{ width: 40 }} />
                    <input type="text" value={entry.result} onChange={(e) => updateEntry(i, 'result', e.target.value)} placeholder="Result..." style={{ flex: 1 }} />
                    <button onClick={() => removeEntry(i)}>✕</button>
                  </div>
                ))}
                <button className="rollable-table-add-entry-btn" onClick={addEntry}>+ Add Entry</button>
              </div>
              <button className="rollable-table-save-btn" onClick={handleSaveCustom} disabled={saving || !editDraft.name.trim()}>
                {saving ? 'Saving...' : 'Save Table'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="rollable-table-upsell">
          Want to create custom tables? Upgrade to <strong>Dungeon Master</strong> or <strong>Archmage</strong>.
        </div>
      )}

      {rollHistory.length > 0 && (
        <div className="rollable-table-history">
          <div className="rollable-table-history-header">
            <span>Recent Rolls</span>
            <button className="rollable-table-clear-btn" onClick={() => setRollHistory([])}>Clear</button>
          </div>
          {rollHistory.map((r, i) => (
            <div key={i} className="rollable-table-history-entry">
              <span className="rollable-table-history-table">{r.tableName}</span>
              <span className="rollable-table-history-roll">{r.die}: {r.roll}</span>
              <span className="rollable-table-history-result">{r.result}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RollableTable;
