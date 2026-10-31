import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import useGameStore from '../../store/gameStore';
import useCharacterStore from '../../store/characterStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useCreatureStore from '../../store/creatureStore';
import { refOf, selectOwnerAttachment } from '../../services/actorConsequenceService';
import { supportSpell, digitalRoll, recordRoll, affordable, sourcePools, describeClassPublic, classRiderPlan } from '../../services/spellConsequence';
import { branches as classBranches, branchLines as classBranchLines } from '../../services/classEffect';
import { sameExactRef } from '../../services/featherSlash';
import { useSpellConsequenceStore, closeOwnerPanel, ownerSource, sendSpellApproval, checkSpellApproval, withdrawSpellApproval, reapproveSpell,
  restoreOwnerStatus, refreshSpellApprovals, gmAcceptSpell, gmDeclineSpell, gmCheckSpellCommand, markSpellReconciled } from '../../services/spellConsequenceService';
import { loadLatestSpell, unresolvedSpell } from '../../services/spellConsequenceCustody';
import { spellDraftContext, loadSpellDraft, loadDiscardedSpellDrafts, saveSpellDraft, discardSpellDraft } from '../../services/spellConsequenceService';
import { describeDraft, sameDraftContext } from '../../services/targetPick';
import useTargetingStore from '../../store/targetingStore';
import './SpellConsequencePanel.css';
import { actionId, readFormula as readAuthoredFormula, definitionSummary } from '../../services/authoredAbility';
import { describe as describeEffect, conditionLabel, policyText, conditionPlan, combinationText } from '../../services/authoredEffect';
import { movementSpeedBreakdown, movementBreakdownText, movementBaseSpeed } from '../../utils/conditionUtils';
import { refreshAuthoredAbilities, changeAuthoredAdmission, routeSpellCast } from '../../services/spellConsequenceService';
import { creatureAttempt, saveCreatureRoll, prepareCreatureAbility, cancelCreatureAbility, revalidateCreatureContext } from '../../services/spellConsequenceService';
import { saveCreatureResolution } from '../../services/spellConsequenceService';
import { STUNNED, stunnedRecordsFor } from '../../services/sharedConditionProfile';
import { designateVoluntaryCondition, respondToVoluntaryCondition, retainedTargetResponses } from '../../services/spellConsequenceService';
import { gmConditionResolution, saveGmConditionResolution } from '../../services/spellConsequenceService';
import { gmCheckOffer, useBlockingStore, gmCheckBlockCommand } from '../../services/blockingService';

const nameOf = token => token?.character?.name || token?.state?.customName || token?.name || token?.id || 'Unknown';
const ref = value => value ? `${value.kind}:${value.mapId}:${value.tokenId}` : '';
const notePrice = payment => payment?.domain === 'musicalNotes'
  ? ` · ${payment.price.costs.length} Musical Notes spent (${payment.price.costs.join(', ') || 'none'}); ${payment.price.gains.length} gained (${payment.price.gains.join(', ') || 'none'})`
  : '';
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

/** A10: actual automation status of an authored bundle's duration, stated before anything is approved. */
const automationText = timing => timing.expiryPolicy === 'gm-manual' ? 'Manual: the GM removes this exact instance.'
  : `Automatic: ${policyText(timing.expiryPolicy, timing.occurrences)}, at the GM-confirmed authenticated turn boundary${timing.occurrences ? ` (each confirmed advance is counted once; ${timing.occurrences} in all)` : ''}. Requires active turn tracking with the target in the exact roster; otherwise nothing is applied or charged.`;
const bundleNote = 'The GM resolves eligibility, range, saves and success manually; only a confirmed success is automated, and payment, any HP change and the effect install together or not at all. Movement changes: different named effects add together; the same effect again from the same source refreshes its duration instead of stacking; speed never goes below 0 ft. Other combinations are refused for the GM to resolve.';
const PREVIEW_ID = '00000000-0000-4000-8000-000000000000';
/** A11: what confirming would do to the target's movement effects, from the same plan the server derives. */
function MovementOutcome({ terms, definitionId, sourceRef, targetToken, approvalId }) {
  const library = useCreatureStore(state => state.creatures);
  const targetRef = targetToken && refOf(targetToken);
  if (terms?.condition?.kind !== 'movement' || !targetRef || !sourceRef) return null;
  const conditions = targetToken.state?.conditions || [], base = movementBaseSpeed(targetToken, library);
  let plan;
  try { plan = conditionPlan({ approvalId: approvalId || PREVIEW_ID, source: sourceRef, target: targetRef, spell: { definitionId }, effectTerms: terms }, conditions); }
  catch (e) { return <p className="p9-diagnostic">Movement outcome unavailable: {e.message}</p>; }
  const now = movementBreakdownText(movementSpeedBreakdown(base, conditions));
  if (plan.refused) return <div className="p9-diagnostic" role="alert"><p>Movement combination refused: {plan.refused.message}</p><p>Speed now: {now}</p></div>;
  const after = conditions.filter(record => !plan.ops.some(op => op.op === 'remove' && op.recordId === record.recordId)).concat(plan.ops.filter(op => op.op === 'add').map(op => op.record));
  return <div className="p9-combination" role="status"><p>{plan.combination.outcome === 'refreshed'
    ? `Refreshes ${terms.condition.label} (replaces instance ${plan.combination.replacesInstanceId}): its duration restarts; the value is not stacked.`
    : `Adds ${terms.condition.label}: different named movement effects add together.`}</p>
    <p>Speed now: {now}</p><p>After confirmation: {movementBreakdownText(movementSpeedBreakdown(base, after))}</p></div>;
}

/** M1: exactly what this class-effect profile automates, leaves to the GM and does not automate. Shown to owner and GM before consent/confirmation. */
function ClassDisclosure({ disclosure }) {
  if (!disclosure) return null;
  return <div className="p9-disclosure" role="note" aria-label="Partial automation">
    <p className="p9-disclosure-status">{disclosure.status}: only the items under “Automated” are applied by the VTT.</p>
    <dl>
      <dt>Automated</dt><dd><ul>{disclosure.automated.map(line => <li key={line}>{line}</li>)}</ul></dd>
      <dt>GM-managed</dt><dd><ul>{disclosure.gmManaged.map(line => <li key={line}>{line}</li>)}</ul></dd>
      <dt>Not automated</dt><dd><ul>{disclosure.notAutomated.map(line => <li key={line}>{line}</li>)}</ul></dd>
    </dl>
    <details><summary>Preserved authored fields ({disclosure.preserved.length}), shown but not executed</summary>
      <ul>{disclosure.preserved.map(item => <li key={item.path}><code>{item.path}</code> — {item.note}</li>)}</ul></details>
  </div>;
}
/** M1: what a rider-applying branch would do to the target's movement, from the same A11 plan the server derives. */
function ClassRiderOutcome({ approval, targetToken }) {
  const library = useCreatureStore(state => state.creatures);
  if (!approval || !targetToken) return null;
  const conditions = targetToken.state?.conditions || [], base = movementBaseSpeed(targetToken, library);
  let plan;
  try { plan = classRiderPlan(approval, conditions); } catch (e) { return <p className="p9-diagnostic">Movement outcome unavailable: {e.message}</p>; }
  const now = movementBreakdownText(movementSpeedBreakdown(base, conditions)), rider = approval.effectTerms.rider.label;
  const when = approval.effectTerms.save ? 'If the target fails' : 'On confirmation';
  if (plan.refused) return <div className="p9-diagnostic" role="alert"><p>{when}: movement combination refused — {plan.refused.message}</p><p>Speed now: {now}</p></div>;
  const after = conditions.filter(record => !plan.ops.some(op => op.op === 'remove' && op.recordId === record.recordId)).concat(plan.ops.filter(op => op.op === 'add').map(op => op.record));
  return <div className="p9-combination" role="status"><p>{when}: {plan.combination.outcome === 'refreshed'
    ? `refreshes ${rider} (replaces instance ${plan.combination.replacesInstanceId}); the value is not stacked.` : `adds ${rider}; different named movement effects add together.`}</p>
    <p>Speed now: {now}</p><p>After that outcome: {movementBreakdownText(movementSpeedBreakdown(base, after))}</p>
    {approval.effectTerms.save && <p>If the target saves: no new {rider}; existing effects are untouched.</p>}</div>;
}
const PREVIEW_APPROVAL = (support, sourceRef, targetRef) => support && sourceRef && targetRef ? { approvalId: PREVIEW_ID, source: sourceRef, target: targetRef, effectTerms: support.effectTerms,
  spell: { definitionHash: support.definitionHash } } : null;

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
  const [physical, setPhysical] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useSpellConsequenceStore(value => value.draftVersion);
  const picking = useTargetingStore(value => value.pickSession?.id === 'p9-spell');
  const startTargetPick = useTargetingStore(value => value.startTargetPick);
  // A closed panel ends its own pick session (contract §1).
  useEffect(() => { if (!owner) useTargetingStore.getState().cancelTargetPickFor('p9-spell'); }, [owner]);
  useEffect(() => {
    if (owner) restoreOwnerStatus();
    // P12C-B1 §2: a retained draft for this same spell restores its target and roll.
    const draft = loadSpellDraft();
    setTargetKey(owner && draft?.context?.spellId === owner.spellId ? draft.targetKey || '' : ''); setPhysical({}); setError('');
  }, [owner]);
  useEffect(() => {
    if (!owner) return undefined;
    const launcher = document.activeElement;
    document.querySelector('.p9-panel button[aria-label="Close"]')?.focus();
    return () => { if (launcher?.isConnected) launcher.focus(); };
  }, [owner]);
  useSpellConsequenceStore(s => s.registryRevision);
  const support = owner ? supportSpell({ id: owner.spellId }, character) : null;
  if (!owner) return null;
  const source = ownerSource();
  const all = [...characters, ...creatures];
  const condition = support?.kind === 'condition', composed = support?.kind === 'class-effect', bundle = support?.kind === 'effect', needsRoll = bundle ? !!support.effectTerms.direct : !condition;
  const candidates = source.token ? all.filter(token => refOf(token) && token.mapId === source.mapId && (!(condition || bundle || composed) || !sameExactRef(refOf(token), source.ref)) && (bundle || composed ? refOf(token).kind === 'creature' : refOf(token).kind === 'creature' || token.state.actorContract.primary)) : [];
  const target = candidates.find(token => ref(refOf(token)) === targetKey);
  const latest = loadLatestSpell();
  const pending = unresolvedSpell(latest);
  const perform = async action => { setBusy(true); setError(''); try { await action(); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  // P12C-B1 §2: the recorded roll lives in a draft bound to this owner, character, attachment and spell.
  const ctx = spellDraftContext({ characterId: character.currentCharacterId, sourceRef: source.ref, spellId: owner.spellId });
  const draft = loadSpellDraft(), draftHere = draft && ctx && sameDraftContext(draft.context, ctx) ? draft : null;
  const draftElsewhere = draft && !draftHere ? draft : null;
  const roll = draftHere?.roll || null;
  const record = mode => {
    try {
      const value = mode === 'digital' ? digitalRoll(support.reading) : recordRoll('physical', support.reading, support.reading.dice.map((group, i) => Array.from({ length: group.count }, (_, j) => Number(physical[`${i}:${j}`]))));
      saveSpellDraft({ context: ctx, label: support.name, roll: value, targetKey }); setError('');
    } catch (e) { setError(e.message); }
  };
  const chooseTarget = value => { setTargetKey(value); if (draftHere) { try { saveSpellDraft({ context: ctx, label: draftHere.label, roll: draftHere.roll, targetKey: value }); } catch (e) { setError(e.message); } } };
  const rangeFeet = Number(support?.raw?.targetingConfig?.rangeDistance);
  const rangeLabel = Number.isFinite(rangeFeet) && rangeFeet > 0 ? `card range ${rangeFeet} ft (${support.raw.targetingConfig.rangeType || 'authored'})` : '';
  const pick = () => startTargetPick({ id: 'p9-spell', label: support.name, sourceRef: source.ref, candidates: candidates.map(token => refOf(token)), rangeFeet, rangeLabel,
    reasonFor: () => 'Not an exact bound target for this spell (creatures and primary characters on your map).', onPick: value => chooseTarget(ref(value)), onCancel: () => {} });
  const discarded = loadDiscardedSpellDrafts();
  if (picking) return null; // the panel steps aside while picking on the map; its state is kept
  const ownerCandidates = all.filter(token => token.state?.actorContract?.primary && token.ownerUserId && refOf(token)?.characterId === character.currentCharacterId);
  const pools = source.token ? sourcePools(source.token) : null;
  return createPortal(<div className="p9-overlay" role="dialog" aria-modal="true" aria-label="Supported spell cast"
    onKeyDown={e => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeOwnerPanel(); }
      if (e.key === 'Tab') {
        const controls = [...e.currentTarget.querySelectorAll('button, input, select, textarea, [tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length);
        const first = controls[0], last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    }}>
    <div className="p9-panel">
      <header><h3>{support?.name || owner.spellId}</h3><button type="button" onClick={closeOwnerPanel} aria-label="Close">×</button></header>
      {owner.origin?.producer?.startsWith('item: ') && <p>From {owner.origin.producer}. Item requirements remain GM-managed.</p>}
      {!support?.supported ? <p className="p9-diagnostic">{support?.reason}</p> : <>
        <p className="p9-note">Supported room ability: nothing is spent until the GM accepts. {composed ? 'Partially automated: one approved price, target and roll; the GM records one of the outcomes listed below.' : bundle ? 'One approved price, target, effect bundle and duration; one GM-confirmed result.' : condition ? 'One approved price and duration, one successful canonical condition.' : 'One roll, one payment, one result.'}</p>
        <dl className="p9-facts">
          <dt>{composed ? 'Outcomes' : 'Effect'}</dt><dd>{composed ? <ul className="p9-branches">{support.branchLines.map(line => <li key={line.branch}>{line.text}</li>)}</ul> : bundle ? describeEffect(support.effectTerms) : condition ? `Canonical Stunned — ${STUNNED.description}` : `${support.kind === 'damage' ? `${support.damageTypes.join('/')} damage` : 'direct healing'} · ${support.reading.reading}`}</dd>
          {condition && <><dt>Timing</dt><dd>{support.timing.durationText} — GM removes. {support.timing.gmNote}</dd></>}
          {bundle && <><dt>Duration</dt><dd>{support.timing.durationText}. {automationText(support.timing)} {support.timing.gmNote}</dd></>}
          {composed && <><dt>Duration</dt><dd>“{support.effectTerms.timing.durationText}” — as authored. Not mapped to a turn boundary; the GM removes the exact instance.</dd>
            <dt>Formula</dt><dd>{support.reading.reading}</dd></>}
          <dt>Price</dt><dd>{support.price.ap} AP · {support.price.mana} mana{notePrice(support.payment.classPayment)}{pools ? ` (temporary first; you have AP ${pools.ap.current}+${pools.ap.temp} temp, mana ${pools.mana.current}+${pools.mana.temp} temp)` : ''}</dd>
          {support.payment.classPayment && <><dt>Class</dt><dd>{describeClassPublic(support.payment.classPayment.before)} → {describeClassPublic(support.payment.classPayment.after)}</dd></>}
          {support.cooldown.value > 0 && <><dt>Cooldown</dt><dd>{support.cooldown.value} ({support.cooldown.type}) — starts when the GM accepts</dd></>}
        </dl>
        {composed && <ClassDisclosure disclosure={support.disclosure} />}
        {!support.payment.affordable && <p className="p9-diagnostic">{support.payment.reason}</p>}
        {source.error ? <div className="p9-diagnostic"><p>{source.error}</p>
           {ownerCandidates.length === 1 && <button type="button" onClick={() => selectOwnerAttachment(refOf(ownerCandidates[0]))}>Use this owner attachment</button>}</div> : <>
          {(condition || bundle || owner.origin?.producer?.startsWith('item: ')) && <p>Source: {nameOf(source.token)} · selected primary owner PC · {source.ref.tokenId} / {source.ref.instanceId}</p>}
          {draftElsewhere && <div className="p9-diagnostic p12c-draft" role="alert"><p>An unsent recorded roll is retained for <strong>{describeDraft(draftElsewhere)}</strong>. A recorded roll never moves to another spell: cast it from that spell, or discard it explicitly.</p>
            <button type="button" disabled={busy} onClick={() => perform(async() => discardSpellDraft())}>Discard recorded roll</button></div>}
          <div className="p12c-pick"><button type="button" disabled={pending || busy || !source.ref} onClick={pick}>Pick on map</button><span className="p9-meta">{rangeLabel ? `${rangeLabel} — advisory` : 'No card range — GM adjudicates'}</span></div>
          <label>Target <select value={targetKey} disabled={pending || busy} onChange={event => chooseTarget(event.target.value)}>
            <option value="">Select an exact bound target</option>
            {candidates.map(token => <option key={ref(refOf(token))} value={ref(refOf(token))}>{nameOf(token)} · {refOf(token).kind} · {token.id}{sameExactRef(refOf(token), source.ref) ? ' (you)' : ''}</option>)}
          </select></label>
          {target && <p className="p9-advisory">{advisoryRange(source.token, target, game, `${support.raw.targetingConfig?.rangeType || ''} ${support.raw.targetingConfig?.rangeDistance ?? '?'} ft`)} {resistanceText(target)}</p>}
           {target && condition && <p>Target: {nameOf(target)} · {refOf(target).tokenId} / {refOf(target).instanceId}. You approve the action and spending, not the target’s consent. Stunned is hostile by default: the GM can install successful Stunned without target acknowledgement, including offline. Voluntary applications require separate GM designation and target acceptance. The GM resolves eligibility, range, saves, immunity and success manually. Changed terms require fresh approval. Failed/unexecuted attempt costs remain manual.</p>}
          {target && bundle && <p>Target: {nameOf(target)} · {refOf(target).tokenId} / {refOf(target).instanceId}. You approve the action, price, exact target, effect bundle and duration; changed terms need fresh approval. {bundleNote}</p>}
          {target && bundle && <MovementOutcome terms={support.effectTerms} definitionId={owner.spellId} sourceRef={source.ref} targetToken={target} />}
          {target && composed && <p>Target: {nameOf(target)} · {refOf(target).tokenId} / {refOf(target).instanceId}. You approve the price, exact target, roll and every listed outcome, including what is not automated. Changed terms need fresh approval.</p>}
          {target && composed && <ClassRiderOutcome approval={PREVIEW_APPROVAL(support, source.ref, refOf(target))} targetToken={target} />}
          {target && needsRoll && !roll && !pending && !draftElsewhere && <div className="p9-roll">
            <button type="button" disabled={busy} onClick={() => record('digital')}>Roll {support.reading.dice.map(g => `${g.count}d${g.sides}`).join(' + ')} once</button>
            <span>or physical faces:</span>
            {support.reading.dice.flatMap((group, i) => Array.from({ length: group.count }, (_, j) => <input key={`${i}:${j}`} aria-label={`d${group.sides} face ${j + 1}`} type="number" min="1" max={group.sides}
              value={physical[`${i}:${j}`] || ''} onChange={event => setPhysical({ ...physical, [`${i}:${j}`]: event.target.value })} />))}
            <button type="button" disabled={busy} onClick={() => record('physical')}>Record physical roll</button>
          </div>}
          {roll && <p className="p9-roll-result">Recorded {roll.mode} roll: [{roll.dice.map(group => group.faces.join(', ')).join(' | ')}] {roll.constant >= 0 ? '+' : '-'} {Math.abs(roll.constant)} = <strong>{roll.total}</strong>. The GM confirms the final amount. Kept on this device for this spell through target changes and reloads.</p>}
          {!pending && <button type="button" className="p9-primary" disabled={busy || !target || (needsRoll && !roll) || !support.payment.affordable || !affordable(pools, support.price)}
            onClick={() => perform(() => sendSpellApproval({ spellId: owner.spellId, targetRef: refOf(target), roll: needsRoll ? roll : null, origin: owner.origin }))}>{composed ? 'Approve price, target, roll and listed outcomes' : bundle ? 'Approve exact price, target, effects and duration' : condition ? 'Approve exact price, target and Stunned duration' : 'Approve price and send to GM'}</button>}
        </>}
      </>}
      {!!discarded.length && <details className="p12c-discarded"><summary>Discarded unsent rolls on this device ({discarded.length})</summary><ul>{discarded.map((d, i) => <li key={i}>{describeDraft(d)}</li>)}</ul></details>}
      {status && <div className="p9-status" role="status"><p>{status.message}</p>
        {status.latest?.approval && <p className="p9-meta">Approval {status.latest.approval.approvalId} · {status.latest.custody}</p>}
        {status.latest?.approval?.effectTerms && <p>Retained owner-approved terms: {status.latest.approval.spell.name} · source {status.latest.approval.source.tokenId}/{status.latest.approval.source.instanceId} → target {status.latest.approval.target.tokenId}/{status.latest.approval.target.instanceId} · {status.latest.approval.price.ap} AP / {status.latest.approval.price.mana} mana · {describeEffect(status.latest.approval.effectTerms)}.</p>}
        {status.latest?.approval?.conditionTerms && <p>Retained owner-approved terms: {status.latest.approval.spell.name} · source {status.latest.approval.source.tokenId}/{status.latest.approval.source.instanceId} → target {status.latest.approval.target.tokenId}/{status.latest.approval.target.instanceId} · {status.latest.approval.price.ap} AP / {status.latest.approval.price.mana} mana · canonical Stunned · {status.latest.approval.conditionTerms.timing.durationText} — GM removes.</p>}
        {['awaiting', 'unknown', 'prepared'].includes(status.phase) && <button type="button" disabled={busy} onClick={() => perform(checkSpellApproval)}>Check this same approval</button>}
        {['awaiting', 'unknown'].includes(status.phase) && <button type="button" disabled={busy} onClick={() => perform(withdrawSpellApproval)}>Withdraw before acceptance</button>}
        {status.phase === 'reapproval' && <button type="button" disabled={busy} onClick={() => perform(reapproveSpell)}>{condition || bundle ? 'Review changed terms before fresh approval' : 'Review and approve again (same roll)'}</button>}
        {status.phase === 'unresolved' && <button type="button" disabled={busy} onClick={() => markSpellReconciled()}>Reconciled with the GM — clear this approval</button>}
      </div>}
      {error && <p className="p9-diagnostic">{error}</p>}
    </div>
  </div>, document.body);
}

/** GM: explicit adjudication and one consequence; observers never execute. */
export function GmPanel() {
  const isGM = useGameStore(value => value.isGMMode);
  const roomId = useGameStore(value => value.multiplayerRoom?.id);
  const pending = useSpellConsequenceStore(value => value.gmPending);
  const status = useSpellConsequenceStore(value => value.gmStatus);
  const characters = useCharacterTokenStore(value => value.characterTokens);
  const creatures = useCreatureStore(value => value.creatureTokens);
  const gridSize = useGameStore(value => value.gridSize), feetPerTile = useGameStore(value => value.feetPerTile);
  const game = { gridSize, feetPerTile };
  const [drafts, setDrafts] = useState({});
  const [busy, setBusy] = useState(false);
  useSpellConsequenceStore(s => s.draftVersion);
  useEffect(() => { if (isGM) refreshSpellApprovals(); }, [isGM]);
   const entries = Object.values(pending).filter(e => e.approval.roomId === roomId && e.approval.source.kind !== 'creature');
  const extra = Object.entries(status).filter(([id, value]) => !pending[id] && ['unknown', 'unresolved', 'reapproval', 'accepted', 'declined', 'refused', 'retry'].includes(value.phase));
  if (!isGM || (!entries.length && !extra.length)) return null;
  const all = [...characters, ...creatures];
  const find = value => all.find(token => sameExactRef(refOf(token), value));
  const perform = async action => { setBusy(true); try { await action(); } finally { setBusy(false); } };
  return <section className="p9-gm" aria-label="Spell adjudication">
    {entries.map(({ approval }) => {
      const draft = drafts[approval.approvalId] || {}, update = values => setDrafts({ ...drafts, [approval.approvalId]: { ...draft, ...values } });
      const source = find(approval.source), target = find(approval.target), state = status[approval.approvalId];
      if (approval.spell.kind === 'class-effect') return <ClassEffectCard key={approval.approvalId} approval={approval} source={source} target={target} state={state} draft={draft} update={update} busy={busy} perform={perform} game={game} />;
      const condition = approval.spell.kind === 'condition', bundle = approval.spell.kind === 'effect', direct = bundle && !!approval.effectTerms.direct;
      const resolved = condition || bundle, timingTerms = bundle ? approval.effectTerms.timing : approval.conditionTerms?.timing;
      const resolution = resolved ? gmConditionResolution(approval.approvalId) || { gmConfirmed: false, timing: timingTerms, timingNote: '', evidence: '' } : null;
      const updateResolution = values => { try { saveGmConditionResolution(approval.approvalId, { ...resolution, ...values }); } catch (e) { update({ error: e.message }); } };
      return <article key={approval.approvalId} className="p9-gm-card">
        <h4>{nameOf(source)} → {nameOf(target)}: {approval.spell.name}</h4>
        {bundle && <><p>{describeEffect(approval.effectTerms)}</p><p>{automationText(approval.effectTerms.timing)} {approval.effectTerms.timing.gmNote}</p>
          <p>Exact source {approval.source.tokenId}/{approval.source.instanceId} → target {approval.target.tokenId}/{approval.target.instanceId}. Duration and effects are owner-approved; changed terms require fresh approval.</p>
          <MovementOutcome terms={approval.effectTerms} definitionId={approval.spell.definitionId} sourceRef={approval.source} targetToken={target} approvalId={approval.approvalId} />
          {direct && <><p>{approval.roll.mode} [{approval.roll.dice.map(group => group.faces.join(', ')).join(' | ')}] {approval.roll.constant >= 0 ? '+' : '-'} {Math.abs(approval.roll.constant)} = <strong>{approval.roll.total}</strong></p><p className="p9-meta">{approval.roll.reading}</p></>}</>}
        {bundle ? null : condition ? <><p>Canonical Stunned · {STUNNED.description}</p><p>{approval.conditionTerms.timing.durationText} — GM removes. {approval.conditionTerms.timing.gmNote}</p>
          <p>Exact source {approval.source.tokenId}/{approval.source.instanceId} → target {approval.target.tokenId}/{approval.target.instanceId}. Duration is owner-approved; a clarification cannot replace it. Changed terms require a newly admitted version and fresh approval.</p></> : <><p>{approval.spell.kind === 'damage' ? `${approval.spell.damageTypes.join('/')} damage` : 'direct healing'} · {approval.roll.mode} [{approval.roll.dice.map(group => group.faces.join(', ')).join(' | ')}] {approval.roll.constant >= 0 ? '+' : '-'} {Math.abs(approval.roll.constant)} = <strong>{approval.roll.total}</strong></p>
        <p className="p9-meta">{approval.roll.reading}</p></>}
        <p>Owner-approved price: {approval.price.ap} AP · {approval.price.mana} mana (temporary first){notePrice(approval.classPayment)}{approval.classPayment ? ` · class ${describeClassPublic(approval.classPayment.beforePublic)} → ${describeClassPublic(approval.classPayment.afterPublic)}` : ''}</p>
        <p className="p9-advisory">{advisoryRange(source, target, game, 'authored range')} {resistanceText(target)}</p>
         {resolved ? <fieldset disabled={busy || ['preparing', 'submitting', 'unknown', 'accepted', 'unresolved'].includes(state?.phase)}><legend>Private GM resolution</legend>
          <label>GM timing clarification (required)<input maxLength={300} value={resolution.timingNote} onChange={e => updateResolution({ timingNote: e.target.value, gmConfirmed: false })} /></label>
          <label>Private manual resolution evidence<textarea maxLength={2000} value={resolution.evidence} onChange={e => updateResolution({ evidence: e.target.value, gmConfirmed: false })} /></label>
           <label><input type="checkbox" checked={resolution.gmConfirmed === true} onChange={e => updateResolution({ gmConfirmed: e.target.checked })} /> I resolved eligibility/range/saves/immunity and confirm that this {bundle ? 'whole effect' : 'Stunned'} outcome succeeded</label>
          {direct && <><label>Final {approval.effectTerms.direct.kind === 'damage' ? 'damage' : 'healing'} <input type="number" min="0" value={draft.final ?? ''} onChange={event => update({ final: event.target.value })} /></label>
            <label>Reason (required if different from {approval.roll.total}) <input type="text" value={draft.reason || ''} onChange={event => update({ reason: event.target.value })} /></label></>}
          <p>Only successful application is automated. Failed/unexecuted attempt costs remain GM-managed.</p>
        </fieldset> : <><label><input type="checkbox" checked={draft.adjudicated === true} onChange={event => update({ adjudicated: event.target.checked })} /> I adjudicated legality, range, defense and mitigation</label>
        <label>Final {approval.spell.kind === 'damage' ? 'damage' : 'healing'} <input type="number" min="0" value={draft.final ?? ''} onChange={event => update({ final: event.target.value })} /></label>
        <label>Reason (required if different from {approval.roll.total}) <input type="text" value={draft.reason || ''} onChange={event => update({ reason: event.target.value })} /></label></>}
         {draft.error && <p role="alert">{draft.error}</p>}
         {condition && approval.target.kind === 'character' && <TargetPolicy approvalId={approval.approvalId} disabled={busy || ['preparing', 'submitting', 'unknown', 'accepted', 'unresolved'].includes(state?.phase)} />}
        <div className="p9-actions">
          <button type="button" className="p9-primary" disabled={busy || ['preparing', 'submitting', 'unknown', 'accepted', 'unresolved'].includes(state?.phase) || (resolved && (!resolution.gmConfirmed || !resolution.timingNote.trim())) || (direct && (draft.final === '' || draft.final === undefined))} onClick={() => perform(() => gmAcceptSpell(approval.approvalId, { finalAmount: resolved && !direct ? 0 : draft.final === '' || draft.final === undefined ? NaN : Number(draft.final), reason: resolved && !direct ? '' : draft.reason || '', adjudicated: resolved ? resolution.gmConfirmed : draft.adjudicated === true }))}>{bundle ? 'Confirm payment, result and effect together' : condition ? 'Confirm PC payment and Stunned together' : 'Accept one consequence'}</button>
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

/** M1 GM card: record the table's outcome (one of the owner-approved branches), the final amount, and confirm once. */
function ClassEffectCard({ approval, source, target, state, draft, update, busy, perform, game }) {
  const terms = approval.effectTerms, options = classBranches(terms), lines = classBranchLines(terms);
  const locked = ['preparing', 'submitting', 'unknown', 'accepted', 'unresolved'].includes(state?.phase);
  const branch = options.length === 1 ? options[0] : draft.branch;
  return <article className="p9-gm-card">
    <h4>{nameOf(source)} → {nameOf(target)}: {approval.spell.name}</h4>
    <p>{approval.roll.mode} [{approval.roll.dice.map(group => group.faces.join(', ')).join(' | ')}] {approval.roll.constant >= 0 ? '+' : '-'} {Math.abs(approval.roll.constant)} = <strong>{approval.roll.total}</strong></p>
    <p className="p9-meta">{approval.roll.reading}</p>
    <p>Owner-approved price: {approval.price.ap} AP · {approval.price.mana} mana (temporary first){approval.classPayment ? ` · class ${describeClassPublic(approval.classPayment.beforePublic)} → ${describeClassPublic(approval.classPayment.afterPublic)}` : ''}</p>
    <p>Exact source {approval.source.tokenId}/{approval.source.instanceId} → target {approval.target.tokenId}/{approval.target.instanceId}. Duration: “{terms.timing.durationText}” as authored — you remove the exact instance.</p>
    <p className="p9-advisory">{advisoryRange(source, target, game, 'authored range')} {resistanceText(target)}</p>
    <ClassDisclosure disclosure={approval.disclosure} />
    <ClassRiderOutcome approval={approval} targetToken={target} />
    <fieldset disabled={busy || locked}><legend>{terms.save ? 'Recorded outcome' : 'Outcome'}</legend>
      {lines.map(line => <label key={line.branch} className="p9-branch"><input type="radio" name={`branch-${approval.approvalId}`} checked={branch === line.branch} onChange={() => update({ branch: line.branch })} /> {line.text}</label>)}
      <label><input type="checkbox" checked={draft.adjudicated === true} onChange={event => update({ adjudicated: event.target.checked })} /> I adjudicated legality, range and mitigation{terms.save ? ', and recorded the table’s save result above' : ''}</label>
      <label>Final {terms.direct.kind === 'damage' ? 'damage' : 'healing'} <input type="number" min="0" value={draft.final ?? ''} onChange={event => update({ final: event.target.value })} /></label>
      <label>Reason (required if different from {approval.roll.total}) <input type="text" value={draft.reason || ''} onChange={event => update({ reason: event.target.value })} /></label>
    </fieldset>
    {draft.error && <p role="alert">{draft.error}</p>}
    <div className="p9-actions">
      <button type="button" className="p9-primary" disabled={busy || locked || !branch || draft.adjudicated !== true || draft.final === '' || draft.final === undefined}
        onClick={() => perform(() => gmAcceptSpell(approval.approvalId, { finalAmount: Number(draft.final), reason: draft.reason || '', adjudicated: draft.adjudicated === true, branch }))}>Confirm recorded outcome</button>
      <button type="button" disabled={busy || ['submitting', 'unknown'].includes(state?.phase)} onClick={() => perform(() => gmDeclineSpell(approval.approvalId))}>Decline</button>
      {state?.phase === 'unknown' && <button type="button" disabled={busy} onClick={() => perform(() => gmCheckSpellCommand(approval.approvalId))}>Check same command</button>}
    </div>
    {state?.message && <p role="status">{state.message}</p>}
  </article>;
}

/** Same authored action workflow, with the current GM as the explicit creature authority. */
function CreaturePanel() {
  const open = useSpellConsequenceStore(s => s.creatureOpen), gm = useGameStore(s => s.isGMMode);
  useSpellConsequenceStore(s => s.draftVersion);
  const gmStatus = useSpellConsequenceStore(s => s.gmStatus), pending = useSpellConsequenceStore(s => s.gmPending);
  const message = useSpellConsequenceStore(s => s.creatureMessage);
  const sourceDetails = useSpellConsequenceStore(s => s.creatureSources) || [];
  const creatures = useCreatureStore(s => s.creatureTokens);
  const characters = useCharacterTokenStore(s => s.characterTokens);
  const blockStatuses = useBlockingStore(s => s.gmStatus);
  const [physical, setPhysical] = useState({}), [targetKey, setTargetKey] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [amount, setAmount] = useState(''), [reason, setReason] = useState(''), [adjudicated, setAdjudicated] = useState(false);
  const [blockApplicable, setBlockApplicable] = useState(false);
  const picking = useTargetingStore(s => s.pickSession?.id === 'p14-creature');
  const latest = creatureAttempt(), c = latest?.creature;
  useEffect(() => {
    if (!open) useTargetingStore.getState().cancelTargetPickFor('p14-creature');
    if (!open) return undefined;
    const launcher = document.activeElement;
    document.querySelector('[aria-label="Creature ability action"] button')?.focus();
    return () => { if (launcher?.isConnected) launcher.focus(); };
  }, [open]);
  const initialTarget = c?.target ? ref(c.target) : '';
  useEffect(() => { setTargetKey(initialTarget); setPhysical({}); setAmount(''); setReason(''); setAdjudicated(false); setError(''); }, [c?.attemptId, initialTarget]);
  if (!gm || !c) return null;
  if (!open) return <p className="p9-chip" role="status">{c.entry.canonicalDefinition.name} · retained {latest.phase}
    <button type="button" onClick={() => { useSpellConsequenceStore.setState({ creatureOpen: true }); refreshSpellApprovals(); }}>Open retained creature action</button></p>;
  const close = () => useSpellConsequenceStore.setState({ creatureOpen: false });
  const perform = async action => { setBusy(true); setError(''); try { await action(); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  const source = creatures.find(t => sameExactRef(refOf(t), c.source)), d = c.entry.canonicalDefinition, bundle = !!d.effects, condition = !bundle && d.effect.kind === 'condition';
  // A10: a bundle may carry one direct part (rolled) next to its GM-resolved canonical effect.
  const directPart = bundle ? d.effects.direct : condition ? null : d.effect, needsRoll = !!directPart, resolved = condition || bundle;
  const reading = needsRoll ? readAuthoredFormula(directPart.formula) : null;
   const candidates = [...creatures, ...characters].filter(t => refOf(t) && refOf(t).mapId === c.source.mapId &&
      (sameExactRef(refOf(t), c.source) ? c.selfAllowed && !bundle : d.targeting.rangeFeet > 0 && d.targeting.restriction !== 'self' && (refOf(t).kind === 'creature' || (!bundle && t.state.actorContract.primary))));
   const target = candidates.find(t => ref(refOf(t)) === targetKey), roll = c.roll, id = latest.approval?.approvalId, status = gmStatus[id];
   const selected = [...creatures, ...characters].find(t => sameExactRef(refOf(t), c.target)) || target;
   const hp = selected && (refOf(selected)?.kind === 'creature' ? { current: selected.state?.currentHp, max: selected.state?.maxHp ?? selected.stats?.maxHp } : selected.character?.health);
   const capped = hp && amount !== '' && Number.isSafeInteger(Number(amount)) && Number(amount) >= 0 ? Math.max(0, Math.min(Number(amount), hp.max - hp.current)) : null;
  const defenses = sourceDetails.find(e => sameExactRef(e.source, c.target || refOf(target)))?.defenses;
   const resolution = c.resolution || { gmConfirmed: false, timing: d.timing, timingNote: '', evidence: '' };
   const choose = value => { setTargetKey(ref(value)); if (resolved) saveCreatureResolution({ ...resolution, gmConfirmed: false }, value); if (needsRoll && roll) saveCreatureRoll(roll, value); setAdjudicated(false); };
  const record = mode => perform(async () => saveCreatureRoll(mode === 'digital' ? digitalRoll(reading) : recordRoll('physical', reading, reading.dice.map((g, i) => Array.from({ length: g.count }, (_, j) => Number(physical[`${i}:${j}`])))), refOf(target)));
  const canAccept = latest.phase === 'awaiting' && pending[id] && !['preparing', 'submitting', 'unknown', 'accepted', 'unresolved'].includes(status?.phase);
  if (picking) return null;
  return createPortal(<div className="p9-overlay" role="dialog" aria-modal="true" aria-label="Creature ability action" onKeyDown={e => { if (e.key === 'Escape') close(); }}>
    <div className="p9-panel">
      <header><h3>{d.name}</h3><button type="button" aria-label="Close creature action" onClick={close}>×</button></header>
      <p>Source: {nameOf(source)} · {c.source.mapId} / {c.source.tokenId} · incarnation {c.source.instanceId}</p>
      <p>Admitted version {c.entry.definitionRef.definitionVersion} · {bundle ? describeEffect({ direct: d.effects.direct, condition: d.effects.condition, timing: d.timing }) : condition ? 'canonical Stunned' : `${d.effect.kind} · ${d.effect.formula} · ${d.effect.damageTypes?.join('/') || 'healing'}`}</p>
      <p>Exact price: {c.entry.descriptor.price.ap} AP / {c.entry.descriptor.price.mana} mana · temporary first. Nothing spent before confirmation.</p>
        <p>Authored range {d.targeting.rangeFeet} ft · one {d.targeting.restriction} target. {bundle ? `One distinct placed creature. ${bundleNote}` : condition ? 'One distinct bound creature or primary PC. The GM resolves eligibility, range, saves, immunity and success. Hostile Stunned needs no target acknowledgement; disconnected targets do not veto installation.' : c.selfAllowed ? 'Self healing uses this exact creature; no owner offer or equipment.' : 'Self is unavailable for this targeting/effect profile. Primary PCs require the exact owner’s acceptance.'}</p>
      {resolved && <>{bundle ? <><p>{d.effects.condition.kind === 'stunned' ? STUNNED.description : `${conditionLabel(d.effects.condition)}: flat change to movement speed (feet per movement AP), applied after other speed conditions; never below 0 ft.`}</p>
        <p>{d.timing.durationText}. {automationText(d.timing)} {d.timing.gmNote}</p>
        {latest.phase !== 'accepted' && <MovementOutcome terms={{ direct: d.effects.direct, condition: d.effects.condition, timing: d.timing }} definitionId={actionId(c.entry.definitionRef)} sourceRef={c.source}
          targetToken={[...creatures, ...characters].find(t => sameExactRef(refOf(t), c.target || (target && refOf(target))))} approvalId={latest.approval?.approvalId} />}</> : <><p>{STUNNED.description}</p><p>{d.timing.durationText} — GM removes. {d.timing.gmNote}</p></>}
        <details><summary>Preserved duration metadata (no automatic interpretation)</summary><pre>{JSON.stringify(d.timing.authoredDuration, null, 2)}</pre></details>
        <p>Any ambiguous timing needs an explicit GM ruling below. STR/AGI save failure and the table’s advantage procedure remain manually recorded/applied. Preparing or cancelling spends nothing. Recording no application does not make a tabletop attempt free; unsuccessful attempts and their costs are manual.</p>
        {!latest.approval && <fieldset disabled={busy || !target}><legend>GM-resolved successful application</legend>
          <label>GM timing note (required)<input maxLength={300} value={resolution.timingNote} onChange={e => saveCreatureResolution({ ...resolution, timing: d.timing, timingNote: e.target.value, gmConfirmed: false }, refOf(target))} /></label>
          <label>Manual resolution evidence (optional)<textarea maxLength={2000} value={resolution.evidence} onChange={e => saveCreatureResolution({ ...resolution, timing: d.timing, evidence: e.target.value, gmConfirmed: false }, refOf(target))} /></label>
          <label><input type="checkbox" checked={resolution.gmConfirmed === true} onChange={e => saveCreatureResolution({ ...resolution, timing: d.timing, gmConfirmed: e.target.checked }, refOf(target))} /> I resolved eligibility/range/saves/immunity and confirm that this {bundle ? 'whole effect' : 'Stunned'} outcome succeeded</label>
        </fieldset>}
        {latest.approval && <p>Retained successful outcome: {resolution.timingNote}. Manual evidence: {resolution.evidence || 'none recorded; software did not roll or verify a save'}.</p>}
      </>}
      {!latest.approval && <>
          <button type="button" disabled={busy} onClick={() => useTargetingStore.getState().startTargetPick({ id: 'p14-creature', label: d.name, sourceRef: c.source, candidates: candidates.map(refOf), rangeFeet: d.targeting.rangeFeet, rangeLabel: `Authored ${d.targeting.rangeFeet} ft — advisory`, reasonFor: () => 'Choose an eligible exact bound target on this map; Self requires compatible direct healing.', onPick: choose, onCancel: () => {} })}>Pick creature on map</button>
         <label>Creature or primary PC target<select value={targetKey} disabled={busy} onChange={e => choose(refOf(candidates.find(t => ref(refOf(t)) === e.target.value)))}>
           <option value="">Select an exact placed creature</option>{candidates.map(t => <option key={ref(refOf(t))} value={ref(refOf(t))}>{sameExactRef(refOf(t), c.source) ? `Self — ${nameOf(t)}` : nameOf(t)} · {t.id}</option>)}
        </select></label>
        {target && needsRoll && !roll && <div className="p9-roll"><button type="button" disabled={busy} onClick={() => record('digital')}>Roll {directPart.formula} once</button>
          {reading.dice.flatMap((g, i) => Array.from({ length: g.count }, (_, j) => <label key={`${i}:${j}`}>d{g.sides} face {j + 1}<input type="number" min="1" max={g.sides} value={physical[`${i}:${j}`] ?? ''} onChange={e => setPhysical({ ...physical, [`${i}:${j}`]: e.target.value })} /></label>))}
          <button type="button" disabled={busy} onClick={() => record('physical')}>Record physical roll</button></div>}
      </>}
      {roll && <p className="p9-roll-result">Retained {roll.mode} faces [{roll.dice.map(g => g.faces.join(', ')).join(' | ')}] · {roll.reading} = {roll.total}. Closing/reloading retains this attempt and its faces.</p>}
        {c.target && <p>Target: {nameOf([...creatures, ...characters].find(t => sameExactRef(refOf(t), c.target)))} · {c.target.mapId} / {c.target.tokenId} · incarnation {c.target.instanceId}</p>}
       {hp && needsRoll && <p>Current HP: {hp.current} / {hp.max}{directPart.kind === 'healing' && capped !== null && latest.phase !== 'accepted' ? ` · Proposed healing ${amount} · Actual HP to restore after cap: ${capped}` : ''}</p>}
      {defenses && <details><summary>Target's authored defenses and abilities (GM adjudication)</summary><p>Flat DR: {defenses.flatDR ?? 'not declared'}. Resistances/vulnerabilities and specific defensive effects remain manual.</p><pre className="creature-ability-json">{JSON.stringify(defenses, null, 2)}</pre></details>}
       {roll && !bundle && c.target?.kind === 'character' && !latest.approval && <fieldset disabled={busy}><legend>Exact owner proposal</legend>
         <label>Proposed {d.effect.kind === 'healing' ? 'healing' : 'damage before equipment block'}<input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} /></label>
         {d.effect.kind === 'damage' && <label><input type="checkbox" checked={blockApplicable} onChange={e => setBlockApplicable(e.target.checked)} /> I rule that equipment blocking applies to this ability</label>}
         <label>Targeting and {d.effect.kind === 'healing' ? 'healing' : 'blocking applicability'} ruling (required)<input maxLength={300} value={reason} onChange={e => setReason(e.target.value)} /></label>
         <p>Healing requires explicit owner acceptance of this amount, with no equipment. Changing it requires a new acceptance with these retained source faces.</p>
       </fieldset>}
        {((needsRoll ? !!roll : true) && (!resolved || (resolution.gmConfirmed && resolution.timingNote.trim()))) && !['accepted', 'reconciled', 'unresolved'].includes(latest.phase) && !latest.pcOffer && <button type="button" disabled={busy || ['preparing', 'submitting', 'unknown', 'unresolved'].includes(status?.phase)} onClick={() => perform(() => prepareCreatureAbility({ proposedAmount: amount === '' ? NaN : Number(amount), blockApplicable, ruling: reason }))}>{bundle ? latest.approval ? 'Revalidate original effect attempt' : 'Validate successful effect application' : condition ? latest.approval ? 'Revalidate original condition attempt' : 'Validate successful condition application' : latest.approval ? 'Revalidate original attempt (same roll)' : c.target?.kind === 'character' ? 'Offer exact proposal to PC owner' : 'Validate source, target and retained roll'}</button>}
       {latest.pcOffer && <p role="status">Continue in block/consent adjudication below. {blockStatuses[c.attemptId]?.message || 'Original owner offer retained.'}
         <button type="button" disabled={busy} onClick={() => perform(() => blockStatuses[c.attemptId]?.command ? gmCheckBlockCommand(c.attemptId) : gmCheckOffer(c.attemptId))}>Check original PC offer or command</button></p>}
      {(roll || resolved) && latest.approval && !['accepted', 'reconciled', 'unknown', 'unresolved'].includes(latest.phase) && !['preparing', 'submitting', 'unknown', 'unresolved'].includes(status?.phase) && <button type="button" disabled={busy} onClick={() => perform(revalidateCreatureContext)}>{needsRoll ? 'Refresh admission or change target (keep faces)' : 'Refresh admission or change target (keep evidence)'}</button>}
        {canAccept && !latest.pcOffer && <>
         {condition && c.target?.kind === 'character' && <TargetPolicy approvalId={id} disabled={busy} />}
        <label><input type="checkbox" checked={adjudicated} onChange={e => setAdjudicated(e.target.checked)} /> {bundle ? 'I reviewed the retained successful outcome, timing, effects, exact price and (if any) mitigation' : condition ? 'I reviewed the retained successful outcome, timing and exact authored price' : 'I adjudicated legality, range, target restrictions, defense and mitigation'}</label>
        {needsRoll && <>
        <label>Final {directPart.kind === 'damage' ? 'damage' : 'healing'}<input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} /></label>
        <label>Reason (required if different from {roll.total})<input type="text" value={reason} onChange={e => setReason(e.target.value)} /></label>
        </>}
        <button type="button" className="p9-primary" disabled={busy || !adjudicated || (needsRoll && amount === '')} onClick={() => perform(() => gmAcceptSpell(id, { finalAmount: needsRoll ? amount === '' ? NaN : Number(amount) : 0, reason: needsRoll ? reason : '', adjudicated }))}>{bundle ? 'Confirm payment, result and effect together' : condition ? 'Confirm payment and Stunned together' : 'Confirm one creature consequence'}</button>
      </>}
      {status?.phase === 'unknown' && <button type="button" disabled={busy} onClick={() => perform(() => gmCheckSpellCommand(id))}>Check same command</button>}
      {(status?.phase === 'unresolved' || latest.phase === 'unresolved') && <p role="alert">Exact recovery unavailable. Manual reconciliation required; no new attempt is created.</p>}
      <p role="status">{latest.phase === 'accepted' ? `Accepted · ${latest.result?.status || 'accepted live'} · receipt ${latest.result?.receipt?.commandId}` : status?.message || message || `Retained ${latest.phase}.`}</p>
       {latest.result?.receipt && bundle && <p>Payment{needsRoll ? ', HP' : ''} and {conditionLabel(d.effects.condition)} installed together in one accepted receipt{(() => { try { const text = combinationText(JSON.parse(latest.result.receipt.adjudication.chosenResult).combination, d.effects.condition); return text ? ` — ${text}` : ''; } catch (_) { return ''; } })()}. Exact instance {c.attemptId} · source {c.source.tokenId} / {c.source.instanceId}. {d.timing.durationText}. {automationText(d.timing)}</p>}
       {latest.result?.receipt && !bundle && (condition ? <p>Payment and canonical Stunned installed together. Exact instance {c.attemptId} · source {c.source.tokenId} / {c.source.instanceId}. {resolution.timing.durationText} — GM removes.</p> : <p>Payment and HP installed together. {latest.result.receipt.actors.map(a => `${a.ref.tokenId}: AP ${a.finalResources.ap.current ?? 'unavailable'}+${a.finalResources.ap.temp} temp, mana ${a.finalResources.mana.current ?? 'unavailable'}+${a.finalResources.mana.temp} temp, HP ${a.finalResources.hp.current}+${a.finalResources.hp.temp} temp`).join(' · ')}</p>)}
       {latest.result?.receipt && !bundle && d.effect.kind === 'healing' && <p>GM-approved healing: {latest.result.receipt.adjudication.finalAmount}. Actual HP restored: {JSON.parse(latest.result.receipt.adjudication.chosenResult).actualHealing ?? 'see accepted HP result'}.</p>}
      {!['unknown', 'unresolved'].includes(status?.phase) && <button type="button" disabled={busy} onClick={() => perform(cancelCreatureAbility)}>Finish or explicitly cancel (keep evidence)</button>}
      {error && <p className="p9-diagnostic" role="alert">{error}</p>}
    </div>
  </div>, document.body);
}

function OwnerChip() {
  const owner = useSpellConsequenceStore(value => value.owner);
  const status = useSpellConsequenceStore(value => value.ownerStatus);
  if (owner || !status?.latest?.approval || !['awaiting', 'unknown', 'reapproval', 'prepared', 'unresolved'].includes(status.phase)) return null;
  return <p className="p9-chip" role="status">{status.latest.approval.spell.name}: {status.message}
    <button type="button" onClick={() => useSpellConsequenceStore.setState({ owner: { spellId: status.latest.approval.spell.definitionId, origin: status.latest.origin } })}>Open</button></p>;
}

function AdmittedAbilities() {
  const roomId = useGameStore(s => s.multiplayerRoom?.id), gm = useGameStore(s => s.isGMMode);
  const entries = useSpellConsequenceStore(s => s.authoredRoomId === roomId ? s.authoredEntries : null) || [];
  const [busy, setBusy] = useState(false), [message, setMessage] = useState('Refresh to check current room admission.');
  const perform = async action => { setBusy(true); try { const r = await action(); setMessage(r?.success ? 'Room admission refreshed. Range, defense and final amount remain GM-adjudicated.' : `Unavailable (${r?.code || 'unknown'}).`); } catch (e) { setMessage(e.message); } finally { setBusy(false); } };
  return <details className="p9-admitted"><summary>Admitted abilities</summary><section aria-label="Admitted abilities">
    <p>Wizard abilities execute only after the GM admits an exact version, you approve its exact terms, and the GM confirms its result. Canonical Stunned uses manual success/timing, without damage dice.</p>
    <button type="button" disabled={busy} onClick={() => perform(refreshAuthoredAbilities)}>Refresh admitted abilities</button>
    <p role="status">{message}</p>
    {!entries.length && <p>No admitted ability has been loaded for this room.</p>}
    {entries.map(e => <div key={actionId(e.definitionRef)} className="p9-admitted-row"><strong>{e.canonicalDefinition.name}</strong> · version {e.definitionRef.definitionVersion} · {e.descriptor.price.ap} AP / {e.descriptor.price.mana} mana · {definitionSummary(e.canonicalDefinition)} · {e.descriptor.targeting.rangeFeet} ft
      <span>{e.revoked ? ' — Revoked (history retained)' : e.creatureOnly ? ' — Exact creature-source admission; use placed Inspect' : e.canonicalDefinition.effects ? ' — PC→distinct creature composed effect' : e.canonicalDefinition.effect.kind === 'condition' ? ` — PC→distinct creature or primary PC canonical Stunned · ${e.canonicalDefinition.timing.durationText} — GM removes` : ' — Admitted for immediate damage/healing'}</span>
      {!e.revoked && !e.creatureOnly && <button type="button" disabled={busy} onClick={() => { if (!routeSpellCast({ id: actionId(e.definitionRef) }, { producer: 'admitted-library' })) setMessage('This installed binding is unavailable to your current character.'); }}>Use admitted ability</button>}
      {gm && !e.revoked && <button type="button" disabled={busy} onClick={() => perform(() => changeAuthoredAdmission('revoke', e.definitionRef))}>Revoke this version</button>}
    </div>)}
  </section></details>;
}

function TargetPolicy({ approvalId, disabled }) {
  const proposal = useSpellConsequenceStore(s => s.gmPending[approvalId]?.targetProposal);
  const [error, setError] = useState(''), [busy, setBusy] = useState(false);
  return <div className="p9-note"><p>{proposal ? `Voluntary Stunned — ${proposal.withdrawn ? 'target acceptance withdrawn; close this attempt' : proposal.accepted ? 'exact target accepted' : 'waiting for explicit target acceptance; silence never accepts'}. Source payment consent remains separate.` : 'Hostile Stunned — current GM success authority. Target notification is informational, not permission. No target acknowledgement is required.'}</p>
    {!proposal && <button type="button" disabled={disabled || busy} onClick={async() => { setBusy(true); setError(''); try { await designateVoluntaryCondition(approvalId); } catch (e) { setError(e.message); } finally { setBusy(false); } }}>GM: designate voluntary application</button>}
    {error && <p role="alert">{error}</p>}</div>;
}

function TargetConditions() {
  useCharacterTokenStore(s => s.characterTokens);
  useSpellConsequenceStore(s => s.draftVersion);
  const characterId = useCharacterStore(s => s.currentCharacterId);
  const proposals = useSpellConsequenceStore(s => s.targetProposals) || [];
  const [error, setError] = useState(''), [busy, setBusy] = useState(false);
  useEffect(() => { refreshSpellApprovals(); }, [characterId]);
  const source = ownerSource(), records = source.token ? stunnedRecordsFor(source.token).filter(r => r.sourceEntityId.startsWith('authored-condition:')) : [];
  const retained = retainedTargetResponses();
  // Reading/acknowledging/reporting never emits an action or changes a condition.
  if (!records.length && !proposals.length && !retained.length) return null;
  const respond = async(p, accept) => { setBusy(true); setError(''); try { await respondToVoluntaryCondition(p, accept); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  return <details className="p9-admitted"><summary>Stunned notices and voluntary proposals ({records.length + proposals.length})</summary>
    <section aria-label="Target Stunned notices"><button type="button" disabled={busy} onClick={() => refreshSpellApprovals()}>Refresh original target proposals</button>
      <p>Accepted hostile Stunned does not require your permission or acknowledgement. To request correction, message the GM with the exact instance below; the GM uses shared condition controls to correct/remove that instance. Reporting does not undo, duplicate or refund it.</p>
      {records.map(r => <p key={r.id} role="status">Accepted canonical Stunned · instance {r.id} · {r.authoredDuration} — GM removes. Source identity is withheld on this notice. View the same instance on your sheet/token.</p>)}
      {retained.map(e => <p key={e.command.commandId} role="status">Original target response {e.command.proposalId}: outcome unavailable. No replacement consent is created. <button type="button" disabled={busy} onClick={() => respond(e.proposal || e.command, e.command.accept)}>Check original target response</button></p>)}
      {proposals.filter(p => p.target.characterId === characterId).map(p => <div key={p.proposalId}><h4>GM-designated voluntary Stunned</h4><p>{p.source} (exact opaque source handle {p.sourceHandle}) → exact target {p.target.tokenId}/{p.target.instanceId}. Canonical Stunned: {STUNNED.description} {p.durationText} — GM removes. Source price {p.price.ap} AP / {p.price.mana} mana. Admitted definition {p.definitionId} · version/hash {p.definitionVersionOrHash}. Exact proposal {p.proposalId} · server-bound terms handle {p.termsHash}. No source resources are authorized by your acceptance.</p>
        <p>{p.withdrawn ? 'Withdrawn. A fresh proposal is required.' : p.accepted ? 'Your exact acceptance is recorded; installation still requires the GM.' : 'Waiting for your affirmative acceptance. Silence, timeout and disconnection never accept.'}</p>
        {!p.withdrawn && <><button type="button" disabled={busy || p.accepted} onClick={() => respond(p, true)}>Accept this exact voluntary Stunned</button><button type="button" disabled={busy} onClick={() => respond(p, false)}>Withdraw target acceptance before installation</button></>}
      </div>)}{error && <p role="alert">{error}</p>}
    </section></details>;
}

export default function SpellConsequenceHost() {
  const shared = useGameStore(value => value.isInMultiplayer);
  useEffect(() => { if (shared) restoreOwnerStatus(); }, [shared]);
  if (!shared) return null;
  return <><AdmittedAbilities /><TargetConditions /><OwnerPanel /><OwnerChip /><GmPanel /><CreaturePanel /></>;
}
