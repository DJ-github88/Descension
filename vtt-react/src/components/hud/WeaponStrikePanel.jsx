import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useGameStore from '../../store/gameStore';
import useAuthStore from '../../store/authStore';
import useCharacterStore from '../../store/characterStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useCreatureStore from '../../store/creatureStore';
import { WEAPON_TYPE_META } from '../../constants/weaponTypeMeta';
import { getWeaponSimpleTable, WEAPON_TYPE_TIERS } from '../../constants/weaponTypeSimpleTables';
import { refOf, selectOwnerAttachment, findActor } from '../../services/actorConsequenceService';
import { supportStrike, digitalRoll, recordFaces, derive, proficiencyChoice, notApplied, nameOf, OPEN_PROFICIENCY, acceptedText } from '../../services/weaponStrike';
import { useWeaponStrikeStore, closeStrikePanel, ownerSource, sendStrikeApproval, checkStrikeApproval, withdrawStrikeApproval,
  reconcileStrike, restoreStrikeCustody, refreshStrikeApprovals, loadStrikeData, strikeDefenses, gmAcceptStrike, gmCheckStrikeCommand, gmDeclineStrike, reconcileGmStrike } from '../../services/weaponStrikeService';
import { unresolvedStrike } from '../../services/weaponStrikeCustody';
import { strikeDraftContext, loadStrikeDraft, loadDiscardedStrikeDrafts, saveStrikeDraft, discardStrikeDraft, reconcilableStrike } from '../../services/weaponStrikeService';
import { describeDraft, sameDraftContext, planarFeet, rangeText } from '../../services/targetPick';
import useTargetingStore from '../../store/targetingStore';
import { getWeaponRange } from '../../utils/weaponIntegration';
import './WeaponStrikePanel.css';

const keyOf = ref => ref ? `${ref.kind}:${ref.mapId}:${ref.tokenId}` : '';
function ExactRef({ value, revision }) {
  return <small className="p12-meta">{value ? `${value.roomId} / ${value.mapId} / ${value.tokenId} · incarnation ${value.instanceId}${revision === undefined ? '' : ` · revision ${revision}`}` : 'No exact attachment'}</small>;
}
function OutcomeTable({ weaponType }) {
  const table = getWeaponSimpleTable(weaponType);
  return <details className="p12-table"><summary>Authored {weaponType} outcome table (manual)</summary>
    {Object.entries(table).map(([face, text]) => <details key={face}><summary>Face {face} · {WEAPON_TYPE_TIERS[face].name} ({WEAPON_TYPE_TIERS[face].delta}){ /\bAC\b|Armor Class|to.hit/i.test(text) ? ' [Open: obsolete wording]' : ''}</summary><p>{text}</p></details>)}
  </details>;
}
function RollInput({ label, die, proficiency = false, value, onChange }) {
  const [faces, setFaces] = useState(''), [error, setError] = useState('');
  const record = digital => { try { onChange(digital ? digitalRoll(die, proficiency) : recordFaces('physical', die, faces.trim().split(/[\s,]+/).map(Number), proficiency)); setError(''); } catch (e) { setError(e.message); } };
  return <fieldset><legend>{label} · d{die}</legend>
    {value ? <p>Recorded {value.mode}: [{value.faces.join(', ')}]</p> : <>
      <button type="button" onClick={() => record(true)}>Roll {label.toLowerCase()} digitally</button>
      <label>Physical {label.toLowerCase()} faces <input value={faces} onChange={e => setFaces(e.target.value)} placeholder={proficiency ? 'Raw faces, up to 4 if GM rules explosion' : 'e.g. 8, 8, 3'} /></label>
      <button type="button" onClick={() => record(false)}>Record {label.toLowerCase()} faces</button>
    </>}{error && <p role="alert">{error}</p>}
  </fieldset>;
}
function OwnerPanel() {
  const owner = useWeaponStrikeStore(s => s.owner), status = useWeaponStrikeStore(s => s.ownerStatus);
  const sheet = useCharacterStore(s => s), characters = useCharacterTokenStore(s => s.characterTokens), creatures = useCreatureStore(s => s.creatureTokens);
  const uid = useAuthStore(s => s.user?.uid);
  const [type, setType] = useState(''), [targetKey, setTarget] = useState('');
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  useWeaponStrikeStore(s => s.draftVersion);
  const picking = useTargetingStore(s => s.pickSession?.id === 'p12a-strike');
  const startTargetPick = useTargetingStore(s => s.startTargetPick);
  const dialog = useRef(null);
  // A closed panel ends its own pick session (contract §1: the overlay never writes into a closed panel).
  useEffect(() => { if (!owner) useTargetingStore.getState().cancelTargetPickFor('p12a-strike'); }, [owner]);
  useEffect(() => {
    if (!owner) return;
    // P12C-B1 §2: a retained draft for this same action restores its weapon type, target and rolls.
    const draft = loadStrikeDraft(), mine = draft && draft.context.actionId === owner.action.id;
    setType(mine ? draft.context.weaponType || '' : ''); setTarget(mine ? draft.targetKey || '' : ''); setError(''); dialog.current?.showModal();
  }, [owner]);
  useEffect(() => {
    // While picking on the map the modal steps aside; its state is kept.
    if (!owner || !dialog.current) return;
    if (picking && dialog.current.open) dialog.current.close();
    else if (!picking && !dialog.current.open) dialog.current.showModal();
  }, [picking, owner]);
  if (!owner) return null;
  const source = ownerSource(), support = supportStrike(owner.action, sheet, type), pending = unresolvedStrike(status);
  const candidates = creatures.filter(t => refOf(t)?.kind === 'creature' && refOf(t).mapId === source.ref?.mapId && refOf(t).roomId === source.ref?.roomId);
  const target = candidates.find(t => keyOf(refOf(t)) === targetKey);
  const ownerTokens = characters.filter(t => t.state?.actorContract?.primary && t.ownerUserId === uid && t.character?.id === sheet.currentCharacterId);
  const perform = async action => { setBusy(true); setError(''); try { await action(); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  // P12C-B1 §2: recorded rolls live in a draft bound to this exact action context.
  const ctx = strikeDraftContext({ characterId: sheet.currentCharacterId, sourceRef: source.ref, actionId: owner.action.id, support });
  const draft = loadStrikeDraft(), draftHere = draft && ctx && sameDraftContext(draft.context, ctx) ? draft : null;
  const draftElsewhere = draft && !draftHere && !(draft.context.actionId === owner.action.id && !ctx) ? draft : null;
  const roll = draftHere?.roll || null, proficiencyRoll = draftHere?.proficiencyRoll || null;
  const keep = patch => perform(async() => saveStrikeDraft({ context: ctx, label: support.weapon?.name, roll, proficiencyRoll, targetKey, ...patch }));
  const setRoll = value => keep({ roll: value }), setProficiencyRoll = value => keep({ proficiencyRoll: value });
  const chooseTarget = value => { setTarget(value); if (draftHere) keep({ targetKey: value }); };
  const rangeFeet = support.supported ? getWeaponRange(sheet.equipment?.[support.weapon.slot] || null) : null;
  const rangeLabel = rangeFeet ? `card range ${rangeFeet} ft (weapon default)` : '';
  const discarded = loadDiscardedStrikeDrafts();
  const pick = () => startTargetPick({ id: 'p12a-strike', label: `${support.weapon.name} strike`, sourceRef: source.ref, candidates: candidates.map(refOf), rangeFeet, rangeLabel,
    reasonFor: ref => ref.kind !== 'creature' ? 'A basic strike targets one bound creature.' : 'Not a bound creature on your map.',
    onPick: ref => chooseTarget(keyOf(ref)), onCancel: () => {} });
  const gameState = useGameStore.getState();
  const distance = target && source.token ? planarFeet(source.token.position, target.position, gameState.gridSize, gameState.feetPerTile) : null;
  return createPortal(<dialog ref={dialog} className="p12-panel" aria-label="Basic weapon strike" onCancel={closeStrikePanel}>
    <header><h3>Basic weapon strike</h3><button type="button" onClick={closeStrikePanel} aria-label="Close strike">Close</button></header>
    <p>2 AP · temporary AP first. Approval spends nothing; the GM commits one AP/HP consequence.</p>
    {pending ? <><p>Retained {status.approval.weapon.name} → {status.approval.target.tokenId} · {status.approval.weapon.damageType}</p>
      <ExactRef value={status.approval.source} /><ExactRef value={status.approval.target} />
      <p>Weapon {status.approval.roll.mode} [{status.approval.roll.faces.join(', ')}] · proficiency {status.approval.proficiency.rank} d{status.approval.proficiency.die} {status.approval.proficiency.roll.mode} [{status.approval.proficiency.roll.faces.join(', ')}]</p></> : <>
      {source.error ? <><p role="alert">{source.error}</p>{ownerTokens.length === 1 && <button type="button" onClick={() => selectOwnerAttachment(refOf(ownerTokens[0]))}>Use this owner attachment</button>}</> : <>
        <p><strong>{nameOf(source.token)}</strong> · AP {source.token.character.actionPoints.current} + {source.token.character.tempActionPoints || 0} temp</p>
        <ExactRef value={source.ref} revision={source.token.state.actorContract.revision} />
      </>}
      {!support.supported ? <p role="alert">{support.reason}</p> : <>
        <p><strong>{support.weapon.name}</strong> · {support.weapon.slot} · d{support.weapon.die} {support.weapon.damageType} · {support.weapon.attribute} {support.weapon.score} ({support.weapon.modifier >= 0 ? '+' : ''}{support.weapon.modifier})</p>
        {draftElsewhere && <section className="p12c-draft" role="alert"><p>An unsent recorded roll is retained for <strong>{describeDraft(draftElsewhere)}</strong>. A recorded roll never moves to another action or weapon: send it from that action, or discard it explicitly.</p>
          <button type="button" disabled={busy} onClick={() => perform(async() => discardStrikeDraft())}>Discard recorded roll</button></section>}
        {support.needsType && <label>Actual weapon type <select value={type} onChange={e => { setType(e.target.value); }}><option value="">Choose explicitly (item is unmapped)</option>{Object.entries(WEAPON_TYPE_META).map(([key, meta]) => <option key={key} value={key}>{meta.label}</option>)}</select></label>}
        <div className="p12c-pick"><button type="button" disabled={busy || !source.ref} onClick={pick}>Pick on map</button><span className="p12-meta">{rangeLabel ? `${rangeLabel} — advisory` : ''}</span></div>
        <label>Strike target <select value={targetKey} onChange={e => chooseTarget(e.target.value)} disabled={busy}><option value="">Select one exact bound creature</option>{candidates.map(t => <option key={keyOf(refOf(t))} value={keyOf(refOf(t))}>{nameOf(t)} · {t.id}</option>)}</select></label>
        {target && <ExactRef value={refOf(target)} revision={target.state.actorContract.revision} />}
        {target && <p className="p12-meta">{rangeText(distance, rangeFeet, rangeLabel)}</p>}
        {target && !support.needsType && !draftElsewhere && <>
          <RollInput key={`weapon:${type}`} label="Weapon" die={support.weapon.die} value={roll} onChange={setRoll} />
          {roll && <p>{derive(support.weapon, roll).rollOutcome} · proposed {derive(support.weapon, roll).proposed}{derive(support.weapon, roll).rollOutcome === 'critical' ? ' (attribute modifier on critical is [Open])' : ''}</p>}
          <h4>Proficiency — manual ruling</h4>
          <p>{support.proficiency.weaponType} · {support.proficiency.rank} ({support.proficiency.rankSource}) · d{support.proficiency.die} · archetype {support.proficiency.table}</p>
          <p className="p12-meta">{OPEN_PROFICIENCY}</p><OutcomeTable weaponType={support.proficiency.weaponType} />
          <RollInput key={`proficiency:${type}`} label="Proficiency" proficiency die={support.proficiency.die} value={proficiencyRoll} onChange={setProficiencyRoll} />
          {(roll || proficiencyRoll) && <p className="p12-meta">Recorded rolls are kept on this device for this action, through target changes and reloads.</p>}
          <button type="button" disabled={busy || !roll || !proficiencyRoll || source.error} onClick={() => perform(() => sendStrikeApproval({ action: owner.action, ownerType: type, targetRef: refOf(target), roll, proficiencyRoll }))}>Approve 2 AP and send to GM</button>
        </>}
      </>}
    </>}
    {!!discarded.length && <details className="p12c-discarded"><summary>Discarded unsent rolls on this device ({discarded.length})</summary><ul>{discarded.map((d, i) => <li key={i}>{describeDraft(d)}</li>)}</ul></details>}
    {status && <section role="status"><p>{status.message}</p>{status.approval && <small>Approval {status.approval.approvalId} · Device retained</small>}
      {pending && <div className="p12-actions"><button type="button" disabled={busy} onClick={() => perform(checkStrikeApproval)}>Check this same strike</button><button type="button" disabled={busy} onClick={() => perform(withdrawStrikeApproval)}>Withdraw before acceptance</button>{reconcilableStrike(status) && <button type="button" disabled={busy} onClick={reconcileStrike}>Reconciled with GM — clear strike</button>}</div>}
    </section>}{error && <p role="alert">{error}</p>}
  </dialog>, document.body);
}
function GmCard({ entry }) {
  const { approval } = entry, id = approval.approvalId;
  const status = useWeaponStrikeStore(s => s.gmStatus[id]);
  useWeaponStrikeStore(s => s.data);
  useCreatureStore(s => s.creatureTokens); useCharacterTokenStore(s => s.characterTokens); useCreatureStore(s => s.creatures);
  const [draft, setDraft] = useState({ choice: '', noneReason: '', verdict: '', note: '', reason: '' }), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const update = values => setDraft(d => ({ ...d, ...values }));
  let defense, defenseError, choice;
  try { defense = strikeDefenses(approval); } catch (e) { defenseError = e.message; }
  try { choice = proficiencyChoice(approval.weapon.weaponType, draft.choice, draft.noneReason); } catch (_) { /* explicit choice remains unselected */ }
  const derived = derive(approval.weapon, approval.roll), finalAmount = draft.final === undefined ? defense?.afterDefense : Number(draft.final);
  const locked = ['submitting', 'unknown'].includes(status?.phase);
  const perform = async action => { setBusy(true); setError(''); try { await action(); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  return <article className="p12-gm-card">
    <h4>{nameOf(findActor(approval.source))} → {nameOf(findActor(approval.target))}: {approval.weapon.name}</h4>
    <ExactRef value={approval.source} /><ExactRef value={approval.target} />
    <p>Owner-reported: {approval.weapon.slot} · d{approval.weapon.die} {approval.weapon.damageType} · {approval.weapon.attribute} {approval.weapon.score} ({approval.weapon.modifier >= 0 ? '+' : ''}{approval.weapon.modifier})</p>
    <p>{approval.roll.mode} [{approval.roll.faces.join(', ')}] → <strong>{derived.rollOutcome}, proposed {derived.proposed}</strong> · 2 AP (temporary first)</p>
    <fieldset disabled={busy || locked}><legend>Proficiency — manual ruling</legend>
      <p>Owner-reported {approval.proficiency.weaponType} · {approval.proficiency.rank} ({approval.proficiency.rankSource}) d{approval.proficiency.die} · {approval.proficiency.roll.mode} [{approval.proficiency.roll.faces.join(', ')}] · archetype {approval.proficiency.table}</p>
      <p className="p12-meta">{OPEN_PROFICIENCY}</p><OutcomeTable weaponType={approval.weapon.weaponType} />
      <label>Proficiency outcome <select value={draft.choice} onChange={e => update({ choice: e.target.value })}><option value="">GM chooses — nothing inferred</option>{Array.from({ length: 20 }, (_, i) => <option key={i + 1} value={String(i + 1)}>Face {i + 1} · {WEAPON_TYPE_TIERS[i + 1].name} ({WEAPON_TYPE_TIERS[i + 1].delta})</option>)}<option value="none">No proficiency outcome</option><option value="deferred">Deferred — resolve at table</option></select></label>
      {draft.choice === 'none' && <label>No-outcome reason <input maxLength={300} value={draft.noneReason} onChange={e => update({ noneReason: e.target.value })} /></label>}
      {choice?.kind === 'face' && <p>{choice.tier}: {choice.text} {/\bAC\b|Armor Class|to.hit/i.test(choice.text) && <strong>[Open: obsolete wording]</strong>} <strong>Not applied by the VTT; no table damage is added automatically.</strong></p>}
    </fieldset>
    {defenseError ? <p role="alert">{defenseError}</p> : <>
      <h4>Relevant defenses · GM private</h4>
      <p>{defense.automated ? `${defense.automated.kind === 'flatDr' ? `Flat DR ${defense.automated.amount}` : `${defense.automated.kind} ${defense.automated.percent}%`}: ${derived.proposed} → ${defense.afterDefense} (Laws rounding)` : `No automated defense step: ${derived.proposed} → ${defense.afterDefense}`}</p>
      {defense.manual.map((item, i) => <details key={i}><summary>{item.name} · GM ruling</summary><p>{item.text}</p></details>)}
      {defense.obsolete.map((text, i) => <p className="p12-meta" key={i}>{text}</p>)}
      <fieldset disabled={busy || locked}>
        {defense.manual.length > 0 && <><label>Listed defense verdict <select value={draft.verdict} onChange={e => update({ verdict: e.target.value })}><option value="">Choose one verdict</option><option value="not-applicable">No listed defense applies</option><option value="applied-in-final">Applied in the final amount</option></select></label><label>Verdict note (visible to everyone) <input maxLength={300} value={draft.note} onChange={e => update({ note: e.target.value })} /></label></>}
        <label>Final HP damage <input type="number" min="0" max="100000" value={draft.final ?? defense.afterDefense} onChange={e => update({ final: e.target.value })} /></label>
        <label>Adjustment reason (public; required if different from {defense.afterDefense}) <input maxLength={2000} value={draft.reason} onChange={e => update({ reason: e.target.value })} /></label>
      </fieldset>
      <p className="p12-meta">{(() => { const a = findActor(approval.source), b = findActor(approval.target), g = useGameStore.getState(); return rangeText(a && b ? planarFeet(a.position, b.position, g.gridSize, g.feetPerTile) : null, null, ''); })()} Range is advisory; you adjudicate.</p>
      <p><strong>Commit preview:</strong> attacker AP −2 and this creature HP damage {finalAmount} (temporary pools first). {derived.rollOutcome === 'miss' ? 'Miss — HP unchanged.' : ''} Adjudicate legality, reach and line of effect here.</p>
      <p><strong>Not applied by the VTT:</strong> {choice ? notApplied(approval, choice).map(e => e.source === 'proficiency-face' ? `${e.text}: ${choice.text}` : e.text).join('; ') || 'No additional recorded effects.' : 'Choose the manual proficiency outcome.'} No stun, wear, free attack, movement or other manual effect is committed.</p>
      <button type="button" disabled={busy || locked || !choice || (defense.manual.length > 0 && !draft.verdict)} onClick={() => perform(() => gmAcceptStrike(id, { defense, choice, verdict: draft.verdict, note: draft.note, finalAmount, reason: draft.reason }))}>Confirm and apply</button>
    </>}
    <button type="button" disabled={busy || locked} onClick={() => perform(() => gmDeclineStrike(id))}>Decline strike</button>
    {status?.command && <button type="button" disabled={busy} onClick={() => perform(() => gmCheckStrikeCommand(id))}>Check same command</button>}
    {locked && <button type="button" disabled={busy} onClick={() => reconcileGmStrike(id)}>Reconciled at table — retain history</button>}
    {status?.message && <p role="status">{status.message}</p>}{error && <p role="alert">{error}</p>}
  </article>;
}
export default function WeaponStrikeHost() {
  const shared = useGameStore(s => s.isInMultiplayer), roomId = useGameStore(s => s.multiplayerRoom?.id), socket = useGameStore(s => s.multiplayerSocket), isGM = useGameStore(s => s.isGMMode);
  const uid = useAuthStore(s => s.user?.uid);
  const owner = useWeaponStrikeStore(s => s.owner), status = useWeaponStrikeStore(s => s.ownerStatus), pending = useWeaponStrikeStore(s => s.gmPending), gmStatus = useWeaponStrikeStore(s => s.gmStatus), dataError = useWeaponStrikeStore(s => s.dataError);
  useEffect(() => {
    useWeaponStrikeStore.setState({ owner: null, ownerStatus: null, gmPending: {}, gmStatus: {} });
    if (shared && uid && roomId) { restoreStrikeCustody(); refreshStrikeApprovals(); loadStrikeData(); }
  }, [shared, uid, roomId, socket]);
  if (!shared) return null;
  return <><OwnerPanel />
    {!owner && unresolvedStrike(status) && <div className="p12-chip" role="status">{status.message}<button type="button" onClick={() => useWeaponStrikeStore.setState({ owner: { action: { id: status.approval.weapon.slot === 'ranged' ? 'ranged_standard_attack' : 'mh_standard_attack' } } })}>Open retained strike</button></div>}
    {isGM && <section className="p12-gm" aria-label="Weapon strike adjudication">
      {dataError && <p role="alert">{dataError} <button type="button" onClick={loadStrikeData}>Reload defense reference</button></p>}
      {Object.values(pending).map(entry => <GmCard key={entry.approval.approvalId} entry={entry} />)}
      {Object.entries(gmStatus).filter(([id]) => !pending[id]).map(([id, state]) => <article key={id} className="p12-gm-card" role="status"><p>{state.result?.receipt ? acceptedText(state.result) : state.message || 'Prepared strike command retained; explicitly check it.'}</p>{['unknown', 'submitting'].includes(state.phase) && <><button type="button" onClick={() => gmCheckStrikeCommand(id)}>Check same command</button><button type="button" onClick={() => reconcileGmStrike(id)}>Reconciled at table — retain history</button></>}</article>)}
    </section>}
  </>;
}
