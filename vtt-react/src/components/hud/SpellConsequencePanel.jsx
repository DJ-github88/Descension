import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import useGameStore from '../../store/gameStore';
import useCharacterStore from '../../store/characterStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useCreatureStore from '../../store/creatureStore';
import { refOf, selectOwnerAttachment } from '../../services/actorConsequenceService';
import { supportSpell, digitalRoll, recordRoll, affordable, sourcePools, describeClassPublic } from '../../services/spellConsequence';
import { sameExactRef } from '../../services/featherSlash';
import { useSpellConsequenceStore, closeOwnerPanel, ownerSource, sendSpellApproval, checkSpellApproval, withdrawSpellApproval, reapproveSpell,
  restoreOwnerStatus, refreshSpellApprovals, gmAcceptSpell, gmDeclineSpell, gmCheckSpellCommand, markSpellReconciled } from '../../services/spellConsequenceService';
import { loadLatestSpell, unresolvedSpell } from '../../services/spellConsequenceCustody';
import './SpellConsequencePanel.css';

const nameOf = token => token?.character?.name || token?.state?.customName || token?.name || token?.id || 'Unknown';
const ref = value => value ? `${value.kind}:${value.mapId}:${value.tokenId}` : '';
function advisoryRange(source, target, game, authored) {
  const a = source?.position, b = target?.position;
  if (![a?.x, a?.y, b?.x, b?.y, game.gridSize, game.feetPerTile].every(Number.isFinite) || game.gridSize <= 0) return `Authored range ${authored}. Geometry unavailable — GM adjudication required.`;
  const feet = Math.hypot(a.x - b.x, a.y - b.y) / game.gridSize * game.feetPerTile;
  return `Advisory planar distance ${feet.toFixed(1)} ft; authored ${authored}. Line of effect and reach are GM rulings.`;
}
function resistanceText(target) {
  const values = target?.character?.resistances || target?.stats?.resistances || target?.state?.resistances;
  if (!values || typeof values !== 'object') return 'No declared resistances on this projection.';
  return `Declared resistances (advisory; mitigation is the GM's final amount): ${JSON.stringify(values).slice(0, 160)}`;
}

/** Owner: explicit target, one recorded roll, approved price. Nothing is spent here. */
function OwnerPanel() {
  const owner = useSpellConsequenceStore(value => value.owner);
  const status = useSpellConsequenceStore(value => value.ownerStatus);
  const character = useCharacterStore(value => value);
  const characters = useCharacterTokenStore(value => value.characterTokens);
  const creatures = useCreatureStore(value => value.creatureTokens);
  const gridSize = useGameStore(value => value.gridSize), feetPerTile = useGameStore(value => value.feetPerTile);
  const game = { gridSize, feetPerTile };
  const [targetKey, setTargetKey] = useState('');
  const [roll, setRoll] = useState(null);
  const [physical, setPhysical] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { if (owner) restoreOwnerStatus(); setTargetKey(''); setRoll(null); setPhysical({}); setError(''); }, [owner]);
  const support = useMemo(() => owner ? supportSpell({ id: owner.spellId }, character) : null, [owner, character]);
  if (!owner) return null;
  const source = ownerSource();
  const all = [...characters, ...creatures];
  const candidates = source.token ? all.filter(token => refOf(token) && token.mapId === source.mapId && (refOf(token).kind === 'creature' || token.state.actorContract.primary)) : [];
  const target = candidates.find(token => ref(refOf(token)) === targetKey);
  const latest = loadLatestSpell();
  const pending = unresolvedSpell(latest);
  const perform = async action => { setBusy(true); setError(''); try { await action(); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  const record = mode => {
    try { setRoll(mode === 'digital' ? digitalRoll(support.reading) : recordRoll('physical', support.reading, support.reading.dice.map((group, i) => Array.from({ length: group.count }, (_, j) => Number(physical[`${i}:${j}`])))));
      setError(''); } catch (e) { setError(e.message); }
  };
  const ownerCandidates = all.filter(token => token.state?.actorContract?.primary && token.ownerUserId && refOf(token)?.characterId === character.currentCharacterId);
  const pools = source.token ? sourcePools(source.token) : null;
  return createPortal(<div className="p9-overlay" role="dialog" aria-label="Supported spell cast">
    <div className="p9-panel">
      <header><h3>{support?.name || owner.spellId}</h3><button type="button" onClick={closeOwnerPanel} aria-label="Close">×</button></header>
      {!support?.supported ? <p className="p9-diagnostic">{support?.reason}</p> : <>
        <p className="p9-note">Room spell (P9): nothing is spent until the GM accepts. One roll, one payment, one result.</p>
        <dl className="p9-facts">
          <dt>Effect</dt><dd>{support.kind === 'damage' ? `${support.damageTypes.join('/')} damage` : 'direct healing'} · {support.reading.reading}</dd>
          <dt>Price</dt><dd>{support.price.ap} AP · {support.price.mana} mana{pools ? ` (temporary first; you have AP ${pools.ap.current}+${pools.ap.temp} temp, mana ${pools.mana.current}+${pools.mana.temp} temp)` : ''}</dd>
          {support.payment.classPayment && <><dt>Class</dt><dd>{describeClassPublic(support.payment.classPayment.before)} → {describeClassPublic(support.payment.classPayment.after)}</dd></>}
          {support.cooldown.value > 0 && <><dt>Cooldown</dt><dd>{support.cooldown.value} ({support.cooldown.type}) — starts when the GM accepts</dd></>}
        </dl>
        {!support.payment.affordable && <p className="p9-diagnostic">{support.payment.reason}</p>}
        {source.error ? <div className="p9-diagnostic"><p>{source.error}</p>
          {ownerCandidates.length === 1 && <button type="button" onClick={() => selectOwnerAttachment(refOf(ownerCandidates[0]))}>Use this owner attachment</button>}</div> : <>
          <label>Target <select value={targetKey} disabled={pending || busy} onChange={event => { setTargetKey(event.target.value); setRoll(null); }}>
            <option value="">Select an exact bound target</option>
            {candidates.map(token => <option key={ref(refOf(token))} value={ref(refOf(token))}>{nameOf(token)} · {refOf(token).kind} · {token.id}{sameExactRef(refOf(token), source.ref) ? ' (you)' : ''}</option>)}
          </select></label>
          {target && <p className="p9-advisory">{advisoryRange(source.token, target, game, `${support.raw.targetingConfig?.rangeType || ''} ${support.raw.targetingConfig?.rangeDistance ?? '?'} ft`)} {resistanceText(target)}</p>}
          {target && !roll && !pending && <div className="p9-roll">
            <button type="button" disabled={busy} onClick={() => record('digital')}>Roll {support.reading.dice.map(g => `${g.count}d${g.sides}`).join(' + ')} once</button>
            <span>or physical faces:</span>
            {support.reading.dice.flatMap((group, i) => Array.from({ length: group.count }, (_, j) => <input key={`${i}:${j}`} aria-label={`d${group.sides} face ${j + 1}`} type="number" min="1" max={group.sides}
              value={physical[`${i}:${j}`] || ''} onChange={event => setPhysical({ ...physical, [`${i}:${j}`]: event.target.value })} />))}
            <button type="button" disabled={busy} onClick={() => record('physical')}>Record physical roll</button>
          </div>}
          {roll && <p className="p9-roll-result">Recorded {roll.mode} roll: [{roll.dice.map(group => group.faces.join(', ')).join(' | ')}] {roll.constant >= 0 ? '+' : '-'} {Math.abs(roll.constant)} = <strong>{roll.total}</strong>. The GM confirms the final amount.</p>}
          {!pending && <button type="button" className="p9-primary" disabled={busy || !target || !roll || !support.payment.affordable || !affordable(pools, support.price)}
            onClick={() => perform(() => sendSpellApproval({ spellId: owner.spellId, targetRef: refOf(target), roll, origin: owner.origin }))}>Approve price and send to GM</button>}
        </>}
      </>}
      {status && <div className="p9-status" role="status"><p>{status.message}</p>
        {status.latest?.approval && <p className="p9-meta">Approval {status.latest.approval.approvalId} · {status.latest.custody}</p>}
        {['awaiting', 'unknown', 'prepared'].includes(status.phase) && <button type="button" disabled={busy} onClick={() => perform(checkSpellApproval)}>Check this same approval</button>}
        {['awaiting', 'unknown'].includes(status.phase) && <button type="button" disabled={busy} onClick={() => perform(withdrawSpellApproval)}>Withdraw before acceptance</button>}
        {status.phase === 'reapproval' && <button type="button" disabled={busy} onClick={() => perform(reapproveSpell)}>Review and approve again (same roll)</button>}
        {status.phase === 'unresolved' && <button type="button" disabled={busy} onClick={() => markSpellReconciled()}>Reconciled with the GM — clear this approval</button>}
      </div>}
      {error && <p className="p9-diagnostic">{error}</p>}
    </div>
  </div>, document.body);
}

/** GM: explicit adjudication and one consequence; observers never execute. */
function GmPanel() {
  const isGM = useGameStore(value => value.isGMMode);
  const pending = useSpellConsequenceStore(value => value.gmPending);
  const status = useSpellConsequenceStore(value => value.gmStatus);
  const characters = useCharacterTokenStore(value => value.characterTokens);
  const creatures = useCreatureStore(value => value.creatureTokens);
  const gridSize = useGameStore(value => value.gridSize), feetPerTile = useGameStore(value => value.feetPerTile);
  const game = { gridSize, feetPerTile };
  const [drafts, setDrafts] = useState({});
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (isGM) refreshSpellApprovals(); }, [isGM]);
  const entries = Object.values(pending);
  const extra = Object.entries(status).filter(([id, value]) => !pending[id] && ['unknown', 'unresolved', 'reapproval', 'accepted', 'declined', 'refused', 'retry'].includes(value.phase));
  if (!entries.length && !extra.length) return null;
  const all = [...characters, ...creatures];
  const find = value => all.find(token => sameExactRef(refOf(token), value));
  const perform = async action => { setBusy(true); try { await action(); } finally { setBusy(false); } };
  return <section className="p9-gm" aria-label="Spell adjudication">
    {entries.map(({ approval }) => {
      const draft = drafts[approval.approvalId] || {}, update = values => setDrafts({ ...drafts, [approval.approvalId]: { ...draft, ...values } });
      const source = find(approval.source), target = find(approval.target), state = status[approval.approvalId];
      return <article key={approval.approvalId} className="p9-gm-card">
        <h4>{nameOf(source)} → {nameOf(target)}: {approval.spell.name}</h4>
        <p>{approval.spell.kind === 'damage' ? `${approval.spell.damageTypes.join('/')} damage` : 'direct healing'} · {approval.roll.mode} [{approval.roll.dice.map(group => group.faces.join(', ')).join(' | ')}] {approval.roll.constant >= 0 ? '+' : '-'} {Math.abs(approval.roll.constant)} = <strong>{approval.roll.total}</strong></p>
        <p className="p9-meta">{approval.roll.reading}</p>
        <p>Owner-approved price: {approval.price.ap} AP · {approval.price.mana} mana (temporary first){approval.classPayment ? ` · class ${describeClassPublic(approval.classPayment.beforePublic)} → ${describeClassPublic(approval.classPayment.afterPublic)}` : ''}</p>
        <p className="p9-advisory">{advisoryRange(source, target, game, 'authored range')} {resistanceText(target)}</p>
        <label><input type="checkbox" checked={draft.adjudicated === true} onChange={event => update({ adjudicated: event.target.checked })} /> I adjudicated legality, range, defense and mitigation</label>
        <label>Final {approval.spell.kind === 'damage' ? 'damage' : 'healing'} <input type="number" min="0" value={draft.final ?? ''} onChange={event => update({ final: event.target.value })} /></label>
        <label>Reason (required if different from {approval.roll.total}) <input type="text" value={draft.reason || ''} onChange={event => update({ reason: event.target.value })} /></label>
        <div className="p9-actions">
          <button type="button" className="p9-primary" disabled={busy || ['submitting', 'unknown'].includes(state?.phase)} onClick={() => perform(() => gmAcceptSpell(approval.approvalId, { finalAmount: draft.final === '' || draft.final === undefined ? NaN : Number(draft.final), reason: draft.reason || '', adjudicated: draft.adjudicated === true }))}>Accept one consequence</button>
          <button type="button" disabled={busy || ['submitting', 'unknown'].includes(state?.phase)} onClick={() => perform(() => gmDeclineSpell(approval.approvalId))}>Decline</button>
          {state?.phase === 'unknown' && <button type="button" disabled={busy} onClick={() => perform(() => gmCheckSpellCommand(approval.approvalId))}>Check same command</button>}
        </div>
        {state?.message && <p role="status">{state.message}</p>}
      </article>;
    })}
    {extra.map(([id, value]) => <p key={id} role="status" className="p9-meta">Spell {id.slice(0, 8)}: {value.message}
      {value.phase === 'unknown' && <button type="button" disabled={busy} onClick={() => perform(() => gmCheckSpellCommand(id))}>Check same command</button>}</p>)}
  </section>;
}

function OwnerChip() {
  const owner = useSpellConsequenceStore(value => value.owner);
  const status = useSpellConsequenceStore(value => value.ownerStatus);
  if (owner || !status?.latest?.approval || !['awaiting', 'unknown', 'reapproval', 'prepared', 'unresolved'].includes(status.phase)) return null;
  return <p className="p9-chip" role="status">{status.latest.approval.spell.name}: {status.message}
    <button type="button" onClick={() => useSpellConsequenceStore.setState({ owner: { spellId: status.latest.approval.spell.definitionId, origin: status.latest.origin } })}>Open</button></p>;
}

export default function SpellConsequenceHost() {
  const shared = useGameStore(value => value.isInMultiplayer);
  useEffect(() => { if (shared) restoreOwnerStatus(); }, [shared]);
  if (!shared) return null;
  return <><OwnerPanel /><OwnerChip /><GmPanel /></>;
}
