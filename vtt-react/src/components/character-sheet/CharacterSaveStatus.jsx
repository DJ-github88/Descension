import React, { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import useCharacterStore from '../../store/characterStore';
import usePersistenceStatusStore from '../../store/persistenceStatusStore';
import { captureConsumerContext } from '../../persistence/scopedConsumer';
import { subscribeBootstrapGate, getBootstrapGateState } from '../../persistence/bootstrapPrivacyGate';
import { characterContextCurrent, characterStatusKey, getCharacterCandidate, exportCharacterDraft } from '../../persistence/characterSaveOutcome';
import './character-save-status.css';

export default function CharacterSaveStatus({ retryRuntime, importSelectedDraft }) {
  const id = useCharacterStore(state => state.currentCharacterId);
  const gate = useSyncExternalStore(subscribeBootstrapGate, getBootstrapGateState, getBootstrapGateState);
  const statuses = usePersistenceStatusStore(state => state.statuses);
  const [error, setError] = useState(null);
  const context = useMemo(() => gate.phase === 'active' ? captureConsumerContext().context : null, [gate]);
  const eligible = !!id && characterContextCurrent(context);
  const retry = async (lane) => {
    setError(null);
    try {
      if (!characterContextCurrent(context) || useCharacterStore.getState().currentCharacterId !== id) return;
      if (lane === 'runtime') { if (retryRuntime) await retryRuntime(); return; }
      const entry = getCharacterCandidate(id, lane, context);
      await useCharacterStore.getState().updateCharacter(id, entry?.payload || {}, { originContext: context });
    } catch (failure) { setError(failure.message); }
  };
  useEffect(() => {
    const online = () => {
      if (!characterContextCurrent(context) || useCharacterStore.getState().currentCharacterId !== id) return;
      const entry = getCharacterCandidate(id, 'canonical', context);
      if (entry && entry.status !== 'saved' && entry.status !== 'idle') {
        useCharacterStore.getState().updateCharacter(id, entry.payload, { originContext: context }).catch(() => {});
      }
    };
    window.addEventListener('online', online);
    return () => window.removeEventListener('online', online);
  }, [id, gate, context]);
  if (!eligible) return null;
  const download = () => {
    try {
      const blob = new Blob([exportCharacterDraft(id)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url; anchor.download = `mythrill-character-${id}.json`; anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch (failure) { setError(`Download failed: ${failure.message}. The draft remains retained.`); }
  };
  return <section className="character-save-status" aria-label="Selected character save status">
    <div role="status" aria-live="polite">
      {['canonical', 'runtime'].map(lane => {
        const outcome = statuses[characterStatusKey(context, id, lane)];
        const labels = { saved: 'Cloud saved', saving: 'Saving to cloud', pending: 'Cloud save pending', error: 'Save failed', idle: 'Not confirmed' };
        return <div key={lane}>
          <strong>{lane === 'canonical' ? 'Canonical character' : 'Personal runtime'}:</strong>{' '}
          {labels[outcome?.status] || 'Not confirmed'}
          {outcome?.retention && ` · ${outcome.retention === 'device' ? 'Device draft retained' : 'Memory only — keep this page open'}`}
          {outcome?.message && <span className="character-save-message">{outcome.message}</span>}
          {outcome && outcome.status !== 'saved' && <button type="button" disabled={outcome.status === 'saving' || (lane === 'runtime' && !retryRuntime)} onClick={() => retry(lane)}>Retry {lane === 'canonical' ? 'character' : 'runtime'} save</button>}
        </div>;
      })}
    </div>
    <div className="character-save-actions">
      <button type="button" onClick={download}>Download selected draft</button>
      <label>Import selected draft <input type="file" accept="application/json,.json" onChange={async event => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
          const raw = await file.text();
          if (!characterContextCurrent(context) || useCharacterStore.getState().currentCharacterId !== id) return;
           if (!importSelectedDraft) throw new Error('Runtime import is unavailable. The file remains unchanged.');
           importSelectedDraft(raw);
           setError(null);
        } catch (failure) { setError(`Import failed: ${failure.message}`); }
      }} /></label>
    </div>
    {error && <p role="alert">{error}</p>}
  </section>;
}
