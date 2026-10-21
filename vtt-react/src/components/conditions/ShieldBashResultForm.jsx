import React, { useState } from 'react';
import useGameStore from '../../store/gameStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useCreatureStore from '../../store/creatureStore';
import { findActor, refOf, refreshActorSnapshot } from '../../services/actorConsequenceService';
import { canonical, stunnedRecordsFor, expiryLabel } from '../../services/sharedConditionProfile';
import { BOUNDARY, EXPIRY, DEFINITION_ID } from '../../services/shieldBashResult';
import { conditionKey, conditionPrincipal, resolveConditionActor, shieldBashResults, recordShieldBashResult,
  checkShieldBashResult, useSharedConditionStore } from '../../services/sharedConditionService';
import { isPrivateProjectionIsolated } from '../../persistence/bootstrapPrivacyGate';

/** A named result mode of the shared condition editor, not an ability executor. */
export default function ShieldBashResultForm({ renderTargetEditor }) {
  const gm = useGameStore(s => s.isGMMode), roomId = useGameStore(s => s.multiplayerRoom?.id);
  const pcs = useCharacterTokenStore(s => s.characterTokens), creatures = useCreatureStore(s => s.creatureTokens);
  const state = useSharedConditionStore();
  const [draft, setDraft] = useState(null), [selected, setSelected] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState('');
  if (!gm) return <p role="status">Only the current GM records a manually adjudicated Shield Bash result.</p>;
  if (isPrivateProjectionIsolated() || state.principal !== conditionPrincipal()) return <p role="status">Shared condition room/account unavailable. Retained result unchanged.</p>;
  const results = shieldBashResults(), result = results.find(r => r.resultId === selected) || results[0];
  const unknown = results.some(r => !['accepted', 'failed'].includes(r.phase));
  const candidates = [...(pcs || []), ...(creatures || [])].map(token => ({ token, ref: refOf(token) }))
    .filter(({ ref }) => ref?.roomId === roomId && resolveConditionActor({ targetRef: ref }));
  const perform = async fn => { setBusy(true); setError(''); try { await fn(); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  const start = () => {
    setError(''); setDraft({ source: '', target: '', confirmed: false,
      predecessors: Object.fromEntries(Object.entries(state.saved?.entries || {}).map(([key, entry]) => [key, entry.command.commandId])) });
  };
  const exactLabel = ref => `${ref.kind} · ${ref.mapId}/${ref.tokenId} · incarnation ${ref.instanceId}`;
  const actorSelect = (role, label) => <label>{label}<select value={draft[role]} disabled={busy} onChange={e => setDraft({ ...draft, [role]: e.target.value, confirmed: false })}>
    <option value="">Select exact {role} actor</option>{candidates.map(({ token, ref }) => <option key={canonical(ref)} value={JSON.stringify(ref)}>{token.name || token.character?.name || ref.tokenId} · {exactLabel(ref)}</option>)}
  </select></label>;
  const current = result && resolveConditionActor({ targetRef: result.target });
  const activeRecord = current && stunnedRecordsFor(findActor(current)).find(r => r.recordId === result.resultId);
  const active = !!activeRecord;
  return <section className="sc-editor" aria-label="Shield Bash manual result">
    <h3>Record Shield Bash result</h3><p>{BOUNDARY}</p><p>Original authored card: {DEFINITION_ID} ·1 AP handled separately; prior payment is not automatically verified.</p>
    <p className="sc-expiry">{!draft && activeRecord ? expiryLabel(activeRecord, state.combat) : EXPIRY}</p>
    <p>New results are automatically tracked only in the authenticated exact combat roster; otherwise the GM removes them. Existing results are not retroactively scheduled.</p>
    <p>The card's prose ends at the target's next turn end; its structured field says one round. Confirm the prose outcome for this record; any different ruling stays in the general manual condition editor.</p>
    {error && <p role="alert">{error}</p>}
    {results.length > 0 && <><label>Retained Shield Bash result<select value={result?.resultId || ''} disabled={busy || !!draft} onChange={e => setSelected(e.target.value)}>
      {results.map(r => <option key={r.resultId} value={r.resultId}>{r.resultId} · {r.phase} · {r.target.tokenId}</option>)}
    </select></label>
      {!draft && result && <><p>Result / condition / command ID: {result.resultId}</p><p>Source: {exactLabel(result.source)}</p><p>Target: {exactLabel(result.target)}</p>
        <p role="status">Outcome: {result.phase}{!['accepted', 'failed'].includes(result.phase) ? ' — unknown; check this original application. Do not submit a replacement.' : ''}{result.result?.code ? ` (${result.result.code})` : ''}</p>
        <p role="status">{!current ? 'Current target unavailable; original result retained for recovery.' : active ? 'Accepted room instance active.' : 'Current room instance absent. A historical result is not reapplied.'}</p>
        <button type="button" disabled={busy} onClick={() => perform(() => checkShieldBashResult(result.resultId))}>Check original Shield Bash result</button>
        {current && renderTargetEditor(current)}
      </>}
    </>}
    {!draft && <button type="button" disabled={busy || unknown} onClick={start}>{results.length ? 'Prepare separate later Shield Bash result' : 'Prepare Shield Bash result'}</button>}
    {unknown && <p role="status">Resolve the retained unknown result first. This editor will not create a replacement application.</p>}
    {draft && <>
      {actorSelect('source', 'Exact Shield Bash source')}{actorSelect('target', 'Exact Shield Bash target')}
      <label className="sc-confirm"><input type="checkbox" checked={draft.confirmed} disabled={busy} onChange={e => setDraft({ ...draft, confirmed: e.target.checked })} />I confirm the GM has adjudicated that Shield Bash caused Stunned until the end of this target's next turn. Rolls, eligibility and costs were handled separately.</label>
      <button type="button" disabled={busy || unknown || !draft.source || !draft.target || !draft.confirmed} onClick={() => perform(async() => {
        const source = JSON.parse(draft.source), target = JSON.parse(draft.target);
        await recordShieldBashResult(source, target, { stunnedConfirmed: draft.confirmed, previousCommandId: draft.predecessors[conditionKey(target)] || null });
        setDraft(null); setSelected(useSharedConditionStore.getState().saved?.entries?.[conditionKey(target)]?.command.commandId || '');
      })}>{busy ? 'Recording — acceptance pending' : 'Record confirmed Shield Bash Stunned'}</button>
      <button type="button" disabled={busy} onClick={() => setDraft(null)}>Cancel unsent result entry</button>
    </>}
    <button type="button" disabled={busy} onClick={() => perform(async() => { await refreshActorSnapshot(); setDraft(null); })}>Refresh result view — no new application</button>
  </section>;
}
