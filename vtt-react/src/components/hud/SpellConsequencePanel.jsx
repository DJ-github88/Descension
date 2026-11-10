import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import useGameStore from '../../store/gameStore';
import useCharacterStore from '../../store/characterStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useCreatureStore, { getCreatureSizeMapping } from '../../store/creatureStore';
import useSpellAoEStore from '../../store/spellAoEStore';
import { refOf, selectOwnerAttachment } from '../../services/actorConsequenceService';
import { supportSpell, digitalRoll, recordRoll, affordable, sourcePools, describeClassPublic, classRiderPlan } from '../../services/spellConsequence';
import { branches as classBranches, branchLines as classBranchLines } from '../../services/classEffect';
import { sameExactRef } from '../../services/featherSlash';
import { useSpellConsequenceStore, closeOwnerPanel, ownerSource, sendSpellApproval, checkSpellApproval, withdrawSpellApproval, reapproveSpell,
  restoreOwnerStatus, refreshSpellApprovals, gmAcceptSpell, gmDeclineSpell, gmCheckSpellCommand, markSpellReconciled } from '../../services/spellConsequenceService';
import { loadLatestSpell, unresolvedSpell } from '../../services/spellConsequenceCustody';
import { spellDraftContext, loadSpellDraft, loadDiscardedSpellDrafts, saveSpellDraft, discardSpellDraft } from '../../services/spellConsequenceService';
import { describeDraft, sameDraftContext, planarFeet, formatFeet, pickKey } from '../../services/targetPick';
import { radiantPreviewProfile, classifyAreaTokens } from '../../services/areaPreview';
import { useCombatFeedStore, actorKey } from '../../services/acceptedResultFeed';
import { captureActorDelivery } from '../../services/actorProjectionOrder';
import useTargetingStore from '../../store/targetingStore';
import { useSharedConditionStore } from '../../services/sharedConditionService';
import { TYPE as COOLDOWN_TYPE, status as cooldownStatus, procedure as cooldownProcedure } from '../../services/authoredCooldown';
import './SpellConsequencePanel.css';
import { actionId, readFormula as readAuthoredFormula, definitionSummary, FORMULA_CAPABILITY, isFormula, isFormulaBundle, isArea, MAX_AREA_TARGETS } from '../../services/authoredAbility';
import { describe as describeEffect, conditionLabel, policyText, conditionPlan, combinationText, pcConsent, consentText, saveOf, branchLines as effectBranchLines, branchesFor as effectBranches } from '../../services/authoredEffect';
import { manualText as saveManualText } from '../../services/saveBranch';
import { movementSpeedBreakdown, movementBreakdownText, movementBaseSpeed } from '../../utils/conditionUtils';
import { refreshAuthoredAbilities, changeAuthoredAdmission, routeSpellCast } from '../../services/spellConsequenceService';
import { creatureAttempt, saveCreatureRoll, prepareCreatureAbility, cancelCreatureAbility, revalidateCreatureContext } from '../../services/spellConsequenceService';
import { saveCreatureResolution } from '../../services/spellConsequenceService';
import { STUNNED, ATTRIBUTE, DAMAGE_REDUCTION, tickScheduleText, isStunned, isMovementModifier, isAttributeModifier, attributeModifierOf, attributeModifierTotals, attributeName, isDamageReductionModifier, damageReductionModifierOf, damageReductionTotal, expiryLabel } from '../../services/sharedConditionProfile';
import { designateVoluntaryCondition, respondToVoluntaryCondition, retainedTargetResponses } from '../../services/spellConsequenceService';
import { gmConditionResolution, saveGmConditionResolution } from '../../services/spellConsequenceService';
import { gmCheckOffer, useBlockingStore, gmCheckBlockCommand } from '../../services/blockingService';
import { HEALTH_CAPABILITY, DETERMINISTIC_CAPABILITY, isDeterministic } from '../../services/authoredAbility';
// Effect cooldowns: the cooldown controls reuse only; the applied effect keeps its own lifetime (copy only, no rule).
export const cooldownSeparation = condition => condition?.kind === 'periodic'
  ? ' Separate from the periodic effect: its ticks keep their own count, and removing the effect or resolving its last tick does not release the cooldown.'
  : condition ? ` Separate from the ${condition.kind === 'stunned' ? 'Stunned' : condition.label} effect: it keeps its own duration; removing or expiring it does not release the cooldown, and the cooldown's release does not remove it.` : '';

const nameOf = token => token?.character?.name || token?.state?.customName || token?.name || token?.id || 'Unknown';
const ref = value => value ? `${value.kind}:${value.mapId}:${value.tokenId}` : '';
// Owner selection retains the incarnation and canonical ownership, not just the map slot.
const ownerTargetKey = value => value ? JSON.stringify(value) : '';
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
// M5: a periodic bundle's schedule records due ticks (never HP); each tick is resolved separately by the GM.
const PERIODIC_TIMING = { 'target-next-start': 'authored-target-next-start', 'target-next-end': 'authored-target-next-end', 'target-start-count': 'authored-target-start-count', 'target-end-count': 'authored-target-end-count' };
const automationText = (timing, condition, direct = null) => condition?.kind === 'periodic'
  ? `${direct ? `The immediate ${direct.kind === 'damage' ? 'damage' : 'healing'} is rolled now and applied at cast, together with the payment and the periodic effect; it never decides the ticks. ` : ''}Automatic tick recording: ${tickScheduleText(PERIODIC_TIMING[timing.expiryPolicy], timing.occurrences)}. Each tick is recorded at the GM-confirmed authenticated turn boundary and changes HP only when the GM resolves it with its own roll; the effect ends with its last tick. The price is paid once now, never per tick. Requires active turn tracking with the target in the exact roster; otherwise nothing is applied or charged.`
  : timing.expiryPolicy === 'gm-manual' ? 'Manual: the GM removes this exact instance.'
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

/** Attribute family: what confirming would do to the target's authored attribute changes, from the same shared plan the
 * binder and P7 stage derive. Shows the change only (the score itself is the owner's own sheet composition). */
const signed = n => `${n > 0 ? '+' : '−'}${Math.abs(n)}`;
const totalsText = conditions => Object.entries(attributeModifierTotals(conditions)).map(([id, n]) => `${attributeName(id)} ${signed(n)}`).join(', ') || 'no authored attribute change';
function AttributeOutcome({ terms, definitionId, sourceRef, targetToken, approvalId }) {
  const targetRef = targetToken && refOf(targetToken);
  if (terms?.condition?.kind !== 'attribute' || !targetRef || !sourceRef) return null;
  const conditions = targetToken.state?.conditions || [];
  let plan;
  try { plan = conditionPlan({ approvalId: approvalId || PREVIEW_ID, source: sourceRef, target: targetRef, spell: { definitionId }, effectTerms: terms }, conditions); }
  catch (e) { return <p className="p9-diagnostic">Attribute outcome unavailable: {e.message}</p>; }
  const now = totalsText(conditions);
  if (plan.refused) return <div className="p9-diagnostic" role="alert"><p>Attribute change refused: {plan.refused.message}</p><p>Now on this target: {now}</p></div>;
  const after = conditions.concat(plan.ops.filter(op => op.op === 'add').map(op => op.record));
  return <div className="p9-combination" role="status"><p>Adds {terms.condition.label}: {attributeName(terms.condition.attribute)} {signed(terms.condition.amount)}, added once on top of the target's own sheet score. Base, level-up, heritage, origin and equipment values are not edited.</p>
    <p>Now on this target: {now}</p><p>After confirmation: {totalsText(after)}</p><p className="p9-meta">{ATTRIBUTE.notAutomated}</p></div>;
}
const drTotalText = conditions => {
  const n = damageReductionTotal(conditions);
  return n ? `Flat DR +${n}` : 'no authored flat DR change';
};
function DamageReductionOutcome({ terms, definitionId, sourceRef, targetToken, approvalId }) {
  const targetRef = targetToken && refOf(targetToken);
  if (terms?.condition?.kind !== 'damageReduction' || !targetRef || !sourceRef) return null;
  const conditions = targetToken.state?.conditions || [];
  let plan;
  try { plan = conditionPlan({ approvalId: approvalId || PREVIEW_ID, source: sourceRef, target: targetRef, spell: { definitionId }, effectTerms: terms }, conditions); }
  catch (e) { return <p className="p9-diagnostic">Flat DR outcome unavailable: {e.message}</p>; }
  const now = drTotalText(conditions);
  if (plan.refused) return <div className="p9-diagnostic" role="alert"><p>Flat DR change refused: {plan.refused.message}</p><p>Now on this target: {now}</p></div>;
  const after = conditions.concat(plan.ops.filter(op => op.op === 'add').map(op => op.record));
  return <div className="p9-combination" role="status"><p>Adds {terms.condition.label}: Flat DR +{terms.condition.amount}, added once to effective flat DR. Base stats, equipment durability and armor dice are not edited.</p>
    <p>Now on this target: {now}</p><p>After confirmation: {drTotalText(after)}</p><p className="p9-meta">{DAMAGE_REDUCTION.notAutomated}</p></div>;
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
  const combat = useSharedConditionStore(value => value.combat);
  const creatures = useCreatureStore(value => value.creatureTokens);
  const creatureDefs = useCreatureStore(value => value.creatures);
  const gridSize = useGameStore(value => value.gridSize), feetPerTile = useGameStore(value => value.feetPerTile);
  const gridOffsetX = useGameStore(value => value.gridOffsetX) || 0, gridOffsetY = useGameStore(value => value.gridOffsetY) || 0;
  const game = { gridSize, feetPerTile };
  const [targetKey, setTargetKey] = useState('');
  const [targetKeys, setTargetKeys] = useState([]);
  const [areaOrigin, setAreaOrigin] = useState(null);
  const [physical, setPhysical] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useSpellConsequenceStore(value => value.draftVersion);
  useCombatFeedStore(value => value.rendered);
  const picking = useTargetingStore(value => value.pickSession?.id === 'p9-spell');
  const aoeSession = useSpellAoEStore(value => value.actionPreview);
  const startTargetPick = useTargetingStore(value => value.startTargetPick);
  // A closed panel ends its own pick session (contract §1).
  useEffect(() => { if (!owner) useTargetingStore.getState().cancelTargetPickFor('p9-spell'); }, [owner]);
  useEffect(() => {
    if (owner) restoreOwnerStatus();
    // P12C-B1 §2: a retained draft for this same spell restores its target and roll.
    const draft = loadSpellDraft();
    const match = owner && draft?.context?.spellId === owner.spellId;
    setTargetKey(match ? draft.targetKey || '' : '');
    setTargetKeys(match && Array.isArray(draft.targetKeys) ? draft.targetKeys : []);
    setAreaOrigin(match && draft.areaOrigin ? draft.areaOrigin : null);
    setPhysical({}); setError('');
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
  const cooldownState = support?.cooldown?.type === COOLDOWN_TYPE && source.ref
    ? cooldownStatus(source.token, combat, source.ref, support.cooldown.definitionId) : null;
  const all = [...characters, ...creatures];
  const area = support?.isArea === true;
  const condition = support?.kind === 'condition', composed = support?.kind === 'class-effect', bundle = support?.kind === 'effect', needsRoll = bundle ? !!support.effectTerms.direct : !condition;
  const deterministic = support?.definitionHash?.startsWith(`${DETERMINISTIC_CAPABILITY}/`) === true;
  const formula = deterministic || support?.definitionHash?.startsWith(`${FORMULA_CAPABILITY}/`) || support?.definitionHash?.startsWith(`${HEALTH_CAPABILITY}/`) || ((area || bundle) && support?.rollAttributes && Object.keys(support.rollAttributes).length > 0);
  const pcHealing = !area && formula && support?.targetRoute === 'primary-pc-healing';
  const selfHealing = !area && support?.selfHealing === true;
  const authoredImmediate = !area && !condition && !bundle && !composed && String(support?.definitionId || '').startsWith('authored:');
  // Effect cooldowns (review F1): the caster-start cooldown route is one placed creature only; the server refuses a PC target.
  const cooldownRoute = support?.cooldown?.type === COOLDOWN_TYPE;
  const candidates = source.token ? all.filter(token => refOf(token) && token.mapId === source.mapId &&
    (selfHealing ? sameExactRef(refOf(token), source.ref) && refOf(token).kind === 'character' && token.state?.actorContract?.primary
      : (!(condition || bundle || composed || pcHealing || area || authoredImmediate) || !sameExactRef(refOf(token), source.ref)) &&
        (pcHealing ? refOf(token).kind === 'character' && token.state.actorContract.primary
          : composed || formula || area ? refOf(token).kind === 'creature'
            : bundle ? refOf(token).kind === 'creature' || (!cooldownRoute && token.state.actorContract.primary && pcConsent(support.effectTerms, 'character').ok)
              : refOf(token).kind === 'creature' || token.state.actorContract.primary))) : [];
   const target = candidates.find(token => ownerTargetKey(refOf(token)) === targetKey);
  const latest = loadLatestSpell();
  const pending = unresolvedSpell(latest);
  const perform = async action => { setBusy(true); setError(''); try { await action(); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  // P12C-B1 §2: the recorded roll lives in a draft bound to this owner, character, attachment and spell.
  const ctx = spellDraftContext({ characterId: character.currentCharacterId, sourceRef: source.ref, spellId: owner.spellId });
  const draft = loadSpellDraft(), draftHere = draft && ctx && sameDraftContext(draft.context, ctx) ? draft : null;
  const draftElsewhere = draft && !draftHere ? draft : null;
  const roll = deterministic && support?.supported ? recordRoll('deterministic', support.reading, []) : draftHere?.roll || null;
  const record = mode => {
    try {
      const value = mode === 'digital' ? digitalRoll(support.reading) : recordRoll('physical', support.reading, support.reading.dice.map((group, i) => Array.from({ length: group.count }, (_, j) => Number(physical[`${i}:${j}`]))));
      saveSpellDraft({ context: ctx, label: support.name, roll: value, targetKey, targetKeys, areaOrigin }); setError('');
    } catch (e) { setError(e.message); }
  };
  const chooseTarget = value => { setTargetKey(value); if (draftHere) { try { saveSpellDraft({ context: ctx, label: draftHere.label, roll: draftHere.roll, targetKey: value }); } catch (e) { setError(e.message); } } };
  // M6A: visibility filter before any preview/candidate classification; GM visibility never authorizes owner disclosure.
  const visibleForOwner = (r, token) =>
    !token?.state?.hiddenFromPlayers && !token?.hiddenFromPlayers &&
    (useCombatFeedStore.getState().rendered[actorKey(r)] || 0) > 0;
  const areaEntries = area && source.token ? all.map(token => {
    const r = refOf(token);
    const cDef = creatureDefs.find(c => c.id === token.creatureId);
    const size = cDef?.size;
    return {
      token,
      name: () => nameOf(token),
      footprint: () => r?.kind === 'character' ? { width: 1, height: 1 } :
        typeof size === 'string' && ['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan', 'colossal'].includes(size.toLowerCase())
          ? getCreatureSizeMapping(size) : { width: 1, height: 1 }
    };
  }) : [];
  const activeOrigin = aoeSession?.action?.id === owner.spellId && aoeSession?.origin ? aoeSession.origin : areaOrigin;
  const radiusWorld = area && Number.isFinite(gridSize) && Number.isFinite(feetPerTile) && feetPerTile > 0
    ? support.areaTerms.radiusFeet / feetPerTile * gridSize : 0;
  const classifiedArea = area && source.ref ? classifyAreaTokens(areaEntries, {
    visible: visibleForOwner,
    origin: activeOrigin,
    radius: radiusWorld,
    gridSize,
    offsetX: gridOffsetX,
    offsetY: gridOffsetY,
    mapId: source.mapId,
    sourceRef: source.ref
  }) : [];
  const areaCreatureCandidates = classifiedArea.filter(item => item.eligibleCreature);
  const overlappingCreatures = areaCreatureCandidates.filter(item => item.status === 'candidate');
  const maxAreaCap = area ? Math.min(MAX_AREA_TARGETS, support.areaTerms?.maxTargets || MAX_AREA_TARGETS) : MAX_AREA_TARGETS;
  const selectedAreaRefs = area ? targetKeys.map(k => areaCreatureCandidates.find(item => pickKey(item.ref) === k)?.ref).filter(Boolean) : [];
  const unavailableAreaTargets = area && selectedAreaRefs.length !== targetKeys.length;
  const capacityExceeded = area && (targetKeys.length > maxAreaCap || overlappingCreatures.length > maxAreaCap);
  const syncAreaDraft = (nextKeys, nextOrigin) => {
    setTargetKeys(nextKeys);
    if (nextOrigin !== undefined) setAreaOrigin(nextOrigin);
    if (draftHere) {
      try { saveSpellDraft({ context: ctx, label: draftHere.label, roll: draftHere.roll, targetKey: '', targetKeys: nextKeys, areaOrigin: nextOrigin !== undefined ? nextOrigin : activeOrigin }); } catch (e) { setError(e.message); }
    }
  };
  const toggleAreaTarget = keyStr => {
    const next = targetKeys.includes(keyStr) ? targetKeys.filter(k => k !== keyStr) : [...targetKeys, keyStr];
    syncAreaDraft(next);
  };
  const applyPlacedOrigin = nextOrigin => {
    if (!nextOrigin || !Number.isFinite(nextOrigin.x) || !Number.isFinite(nextOrigin.y)) return;
    const nextClassified = classifyAreaTokens(areaEntries, {
      visible: visibleForOwner,
      origin: nextOrigin,
      radius: radiusWorld,
      gridSize,
      offsetX: gridOffsetX,
      offsetY: gridOffsetY,
      mapId: source.mapId,
      sourceRef: source.ref
    });
    const autoKeys = nextClassified.filter(item => item.eligibleCreature && item.status === 'candidate').map(item => pickKey(item.ref));
    syncAreaDraft(autoKeys, { x: nextOrigin.x, y: nextOrigin.y });
  };
  const startAreaPlacement = () => {
    if (!area || !source.ref || !source.token?.position) return;
    const previewAction = { id: owner.spellId, name: support.name, capability: 'authored-area:v1', kind: support.kind, areaTerms: support.areaTerms, definitionHash: support.definitionHash };
    const profile = radiantPreviewProfile(previewAction, support.kind);
    if (profile.error) { setError(profile.error); return; }
    useSpellAoEStore.getState().startActionPreview({
      action: previewAction,
      profile,
      sourceRef: source.ref,
      origin: activeOrigin || { x: source.token.position.x, y: source.token.position.y },
      placing: true,
      confirmed: false,
      context: captureActorDelivery(),
      onConfirmArea: ({ origin }) => applyPlacedOrigin(origin)
    });
  };
  const rangeFeet = area ? Number(support?.areaTerms?.rangeFeet) : Number(support?.raw?.targetingConfig?.rangeDistance);
  const rangeLabel = Number.isFinite(rangeFeet) && rangeFeet > 0 ? (area ? `area circle ${support.areaTerms.radiusFeet}-ft radius · ${rangeFeet}-ft placement range` : `card range ${rangeFeet} ft (${support.raw?.targetingConfig?.rangeType || 'authored'})`) : '';
  const pick = () => startTargetPick({ id: 'p9-spell', label: support.name, sourceRef: source.ref, candidates: candidates.map(token => refOf(token)), rangeFeet, rangeLabel,
     reasonFor: () => 'Not an exact bound target for this spell (creatures and primary characters on your map).', onPick: value => chooseTarget(ownerTargetKey(value)), onCancel: () => {} });
  const discarded = loadDiscardedSpellDrafts();
  if (picking || (area && aoeSession?.placing && aoeSession?.action?.id === owner.spellId)) return null; // the panel steps aside while picking/placing on the map; its state is kept
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
        <p className="p9-note">Supported room ability: nothing is spent until the GM accepts. {area ? 'M6A bounded area execution: one source payment, one shared roll (GM adjudicates each creature target’s final amount), and one atomic multi-actor result.' : composed ? 'Partially automated: one approved price, target and roll; the GM records one of the outcomes listed below.' : bundle ? 'One approved price, target, effect bundle and duration; one GM-confirmed result.' : condition ? 'One approved price and duration, one successful canonical condition.' : 'One roll, one payment, one result.'}</p>
        <dl className="p9-facts">
          <dt>{composed || (bundle && saveOf(support.effectTerms)) ? 'Outcomes' : 'Effect'}</dt><dd>{composed ? <ul className="p9-branches">{support.branchLines.map(line => <li key={line.branch}>{line.text}</li>)}</ul> : bundle && saveOf(support.effectTerms) ? <ul className="p9-branches">{effectBranchLines(support.effectTerms).map(line => <li key={line.branch}>{line.text}</li>)}</ul> : bundle ? describeEffect(support.effectTerms) : condition ? `Canonical Stunned — ${STUNNED.description}` : `${support.kind === 'damage' ? `${support.damageTypes.join('/')} damage` : 'direct healing'} · ${support.reading.reading}`}</dd>
          {area && <><dt>Area</dt><dd>Circle {support.areaTerms.radiusFeet}-ft radius · {support.areaTerms.rangeFeet}-ft placement range · {support.areaTerms.restriction} creatures · technical limit up to {maxAreaCap} creature targets (9 actors max including caster)</dd></>}
          {condition && <><dt>Timing</dt><dd>{support.timing.durationText} — GM removes. {support.timing.gmNote}</dd></>}
          {bundle && <><dt>Duration</dt><dd>{support.timing.durationText}. {automationText(support.timing, support.effectTerms?.condition, support.effectTerms?.direct)} {support.timing.gmNote}</dd></>}
          {bundle && saveOf(support.effectTerms) && <><dt>Save</dt><dd>{saveManualText(saveOf(support.effectTerms))} You approve both outcomes now; the GM records one of them and cannot substitute other terms. One creature target only.</dd></>}
          {composed && <><dt>Duration</dt><dd>“{support.effectTerms.timing.durationText}” — as authored. Not mapped to a turn boundary; the GM removes the exact instance.</dd>
            <dt>Formula</dt><dd>{support.reading.reading}</dd></>}
          <dt>Price</dt><dd>{support.price.ap} AP · {support.price.mana} mana{notePrice(support.payment.classPayment)}{pools ? ` (temporary first; you have AP ${pools.ap.current}+${pools.ap.temp} temp, mana ${pools.mana.current}+${pools.mana.temp} temp)` : ''}</dd>
          {support.payment.classPayment && <><dt>Class</dt><dd>{describeClassPublic(support.payment.classPayment.before)} → {describeClassPublic(support.payment.classPayment.after)}</dd></>}
          {support.cooldown.value > 0 && <><dt>Cooldown</dt><dd>{support.cooldown.type === COOLDOWN_TYPE ? <>{cooldownProcedure(support.cooldown.value)}{bundle ? cooldownSeparation(support.effectTerms?.condition) : ''} <strong role="status">{cooldownState?.label || 'Select the exact owner attachment to view availability.'}</strong></> : `${support.cooldown.value} (${support.cooldown.type}) — starts when the GM accepts`}</dd></>}
        </dl>
        {composed && <ClassDisclosure disclosure={support.disclosure} />}
        {formula && <p className="p9-note">Caster effective scores are owner-attested: {Object.entries(support.rollAttributes).map(([name, value]) => `${name} ${value}`).join(', ') || 'no attributes'}. The server verifies the calculation, not the sheet-derived scores. Caster changes require approval again{deterministic ? ' with a recalculated proposal' : ' with these same faces'}; the GM adjudicates range, saves and mitigation.</p>}
        {support.rollHealth && <p className="p9-note">Authoritative caster base HP {support.rollHealth.current}/{support.rollHealth.max} · missing {Math.max(0, support.rollHealth.max - support.rollHealth.current)}. Temporary HP excluded. Bound to {source.ref?.tokenId}/{source.ref?.instanceId}, revision {source.token?.state?.actorContract?.revision}; changed caster state requires fresh approval with retained faces.</p>}
        {!support.payment.affordable && <p className="p9-diagnostic">{support.payment.reason}</p>}
        {source.error ? <div className="p9-diagnostic"><p>{source.error}</p>
           {ownerCandidates.length === 1 && <button type="button" onClick={() => selectOwnerAttachment(refOf(ownerCandidates[0]))}>Use this owner attachment</button>}</div> : <>
          {(condition || bundle || owner.origin?.producer?.startsWith('item: ')) && <p>Source: {nameOf(source.token)} · selected primary owner PC · {source.ref.tokenId} / {source.ref.instanceId}</p>}
          {draftElsewhere && <div className="p9-diagnostic p12c-draft" role="alert"><p>An unsent recorded roll is retained for <strong>{describeDraft(draftElsewhere)}</strong>. A recorded roll never moves to another spell: cast it from that spell, or discard it explicitly.</p>
            <button type="button" disabled={busy} onClick={() => perform(async() => discardSpellDraft())}>Discard recorded roll</button></div>}
          {area ? <div className="m6a-area-section" aria-label="Area placement and creature target selection">
            <div className="p12c-pick">
              <button type="button" disabled={pending || busy || !source.ref} onClick={startAreaPlacement}>Place area on map</button>
              {source.token?.position && <button type="button" disabled={pending || busy} onClick={() => applyPlacedOrigin(source.token.position)}>Center at caster</button>}
              <span className="p9-meta">{rangeLabel} — geometry is client preview only; eligibility, range and line of effect remain GM-adjudicated</span>
            </div>
            {activeOrigin && source.token?.position && Number.isFinite(gridSize) && Number.isFinite(feetPerTile) && (
              <p className="p9-advisory" role="status">
                Placed circle origin ({Math.round(activeOrigin.x)}, {Math.round(activeOrigin.y)}) · planar distance {formatFeet(planarFeet(source.token.position, activeOrigin, gridSize, feetPerTile))} ft (authored {support.areaTerms.rangeFeet} ft).
              </p>
            )}
            <p className="p9-note">
              Approved first-profile roll procedure: one shared roll proposes {roll ? <strong>{roll.total}</strong> : 'the base amount'} per selected creature target; the GM adjudicates each target’s final amount and adjustment reason before committing.
            </p>
            {capacityExceeded && (
              <p className="p9-diagnostic" role="alert">
                area_target_capacity_exceeded: Technical limit of {maxAreaCap} creature targets (up to 9 actors including source) exceeded ({Math.max(targetKeys.length, overlappingCreatures.length)} creatures in selection/overlap). Targets are never silently truncated — deselect targets to {maxAreaCap} or fewer before approving.
              </p>
            )}
            <fieldset className="m6a-target-list" disabled={pending || busy}>
              <legend>Visible tokens on map ({selectedAreaRefs.length} / {maxAreaCap} creature targets selected)</legend>
              {classifiedArea.length === 0 ? <p className="p9-meta">No other visible tokens on your current map.</p> : (
                <ul>
                  {classifiedArea.map(item => {
                    const keyStr = pickKey(item.ref);
                    const checked = targetKeys.includes(keyStr);
                    const geoBadge = !activeOrigin ? 'Place area to evaluate overlap'
                      : item.status === 'candidate' ? 'Geometric overlap (candidate)'
                      : item.status === 'edge' ? 'Edge/contact only — not geometrically included (GM decides)'
                      : item.status === 'manual' ? 'Unknown/off-grid footprint — GM decides'
                      : 'Outside placed circle';
                    return (
                      <li key={keyStr}>
                        <label>
                          <input
                            type="checkbox"
                            disabled={!item.eligibleCreature}
                            checked={checked}
                            onChange={() => toggleAreaTarget(keyStr)}
                          />
                          {' '}<strong>{item.name}</strong> · {item.ref.kind} · {item.ref.tokenId} · <em>{geoBadge}</em>
                          {item.excludedReason ? ` — ${item.excludedReason}` : ''}
                        </label>
                        {item.eligibleCreature && item.position && (
                          <button type="button" disabled={pending || busy} onClick={() => applyPlacedOrigin(item.position)}>
                            Place circle here
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </fieldset>
            {unavailableAreaTargets && <div className="p9-diagnostic" role="alert">
              <p>A selected area target is unavailable or replaced. Review the target set before approving; recorded dice are retained.</p>
              <button type="button" disabled={pending || busy} onClick={() => syncAreaDraft(selectedAreaRefs.map(pickKey))}>Remove unavailable selections</button>
            </div>}
          </div> : <>
            <div className="p12c-pick"><button type="button" disabled={pending || busy || !source.ref} onClick={pick}>Pick on map</button><span className="p9-meta">{rangeLabel ? `${rangeLabel} — advisory` : 'No card range — GM adjudicates'}</span></div>
            <label>Target <select value={targetKey} disabled={pending || busy} onChange={event => chooseTarget(event.target.value)}>
              <option value="">Select an exact bound target</option>
              {candidates.map(token => <option key={ownerTargetKey(refOf(token))} value={ownerTargetKey(refOf(token))}>{nameOf(token)} · {refOf(token).kind} · {token.id}{sameExactRef(refOf(token), source.ref) ? ' (you)' : ''}</option>)}
             </select></label>
            {targetKey && !target && <p className="p9-diagnostic" role="alert">The selected target is missing, replaced or no longer eligible. Select its exact current attachment and review again; nothing submitted.</p>}
            {bundle && (cooldownRoute || formula || !pcConsent(support.effectTerms, 'character').ok) && <p className="p9-diagnostic" role="alert">PC targets unavailable: {support.effectTerms?.condition?.kind === 'periodic' ? 'a periodic effect applies to one creature only; a player character target stays manual.' : cooldownRoute ? 'an ability with a caster-start cooldown applies to one placed creature only; a player character target stays manual.' : formula ? 'an attribute-scaled immediate part with an effect applies to one placed creature only; a player character target stays manual.' : pcConsent(support.effectTerms, 'character').message}</p>}
          </>}
          {target && <p className="p9-advisory">{advisoryRange(source.token, target, game, `${support.raw?.targetingConfig?.rangeType || ''} ${support.raw?.targetingConfig?.rangeDistance ?? '?'} ft`)} {resistanceText(target)}</p>}
          {target && pcHealing && <p className="p9-consent">Player character target. You approve your source price and this formula roll; the target's owner must separately accept the exact healing amount before the GM can install it.</p>}
           {target && condition && <p>Target: {nameOf(target)} · {refOf(target).tokenId} / {refOf(target).instanceId}. You approve the action and spending, not the target’s consent. Stunned is hostile by default: the GM can install successful Stunned without target acknowledgement, including offline. Voluntary applications require separate GM designation and target acceptance. The GM resolves eligibility, range, saves, immunity and success manually. Changed terms require fresh approval. Failed/unexecuted attempt costs remain manual.</p>}
          {target && bundle && refOf(target).kind === 'character' && <p className="p9-consent">Player character target. {consentText(pcConsent(support.effectTerms, 'character'))}</p>}
          {target && bundle && <p>Target: {nameOf(target)} · {refOf(target).tokenId} / {refOf(target).instanceId}. You approve the action, price, exact target, effect bundle and duration; changed terms need fresh approval. {bundleNote}</p>}
          {target && bundle && <MovementOutcome terms={support.effectTerms} definitionId={owner.spellId} sourceRef={source.ref} targetToken={target} />}
          {target && bundle && <AttributeOutcome terms={support.effectTerms} definitionId={owner.spellId} sourceRef={source.ref} targetToken={target} />}
          {target && bundle && <DamageReductionOutcome terms={support.effectTerms} definitionId={owner.spellId} sourceRef={source.ref} targetToken={target} />}
          {target && composed && <p>Target: {nameOf(target)} · {refOf(target).tokenId} / {refOf(target).instanceId}. You approve the price, exact target, roll and every listed outcome, including what is not automated. Changed terms need fresh approval.</p>}
          {target && composed && <ClassRiderOutcome approval={PREVIEW_APPROVAL(support, source.ref, refOf(target))} targetToken={target} />}
           {(area ? selectedAreaRefs.length > 0 : !!target) && needsRoll && !deterministic && !roll && !pending && !draftElsewhere && <div className="p9-roll">
            <button type="button" disabled={busy} onClick={() => record('digital')}>Roll {support.reading.dice.map(g => `${g.count}d${g.sides}`).join(' + ')} once</button>
            <span>or physical faces:</span>
            {support.reading.dice.flatMap((group, i) => Array.from({ length: group.count }, (_, j) => <input key={`${i}:${j}`} aria-label={`d${group.sides} face ${j + 1}`} type="number" min="1" max={group.sides}
              value={physical[`${i}:${j}`] || ''} onChange={event => setPhysical({ ...physical, [`${i}:${j}`]: event.target.value })} />))}
            <button type="button" disabled={busy} onClick={() => record('physical')}>Record physical roll</button>
          </div>}
            {deterministic ? <p className="p9-roll-result">Calculated proposal: <strong>{roll?.total}</strong>. No dice or random roll. Review the bound inputs and exact payment, then approve; the GM must confirm the final amount.</p> : roll && <p className="p9-roll-result">Recorded {roll.mode} roll: [{roll.dice.map(group => group.faces.join(', ')).join(' | ')}] {roll.constant >= 0 ? '+' : '-'} {Math.abs(roll.constant)} = <strong>{roll.total}</strong>. {area ? 'Proposed base amount for each selected creature target; the GM adjudicates each target’s final amount.' : 'The GM confirms the final amount.'} Kept on this device for this spell through target changes and reloads.</p>}
           {formula && roll && !pending && roll.reading !== support.reading.reading && <button type="button" disabled={busy} onClick={() => perform(() => saveSpellDraft({ context: ctx, label: support.name,
             roll: recordRoll(roll.mode, support.reading, roll.dice.map(group => group.faces)), targetKey, targetKeys, areaOrigin: activeOrigin }))}>Review changed scores with retained faces</button>}
          {!pending && <button type="button" className="p9-primary" disabled={busy || (area ? unavailableAreaTargets || selectedAreaRefs.length < 1 || targetKeys.length > maxAreaCap : !target) || (needsRoll && !roll) || !support.payment.affordable || !affordable(pools, support.price)}
            onClick={() => perform(() => sendSpellApproval({ spellId: owner.spellId, targetRef: area ? undefined : refOf(target), targetRefs: area ? selectedAreaRefs : undefined, areaOrigin: area ? activeOrigin : undefined, roll: needsRoll ? roll : null, origin: owner.origin }))}>{area ? `Approve one source payment and ${selectedAreaRefs.length} creature target${selectedAreaRefs.length === 1 ? '' : 's'}` : composed ? 'Approve price, target, roll and listed outcomes' : bundle ? 'Approve exact price, target, effects and duration' : condition ? 'Approve exact price, target and Stunned duration' : 'Approve price and send to GM'}</button>}
        </>}
      </>}
      {!!discarded.length && <details className="p12c-discarded"><summary>Discarded unsent rolls on this device ({discarded.length})</summary><ul>{discarded.map((d, i) => <li key={i}>{describeDraft(d)}</li>)}</ul></details>}
      {status && <div className="p9-status" role="status"><p>{status.message}</p>
        {status.latest?.approval && <p className="p9-meta">Approval {status.latest.approval.approvalId} · {status.latest.custody}</p>}
        {status.latest?.approval?.effectTerms && <p>Retained owner-approved terms: {status.latest.approval.spell.name} · source {status.latest.approval.source.tokenId}/{status.latest.approval.source.instanceId} → target {status.latest.approval.target.tokenId}/{status.latest.approval.target.instanceId} · {status.latest.approval.price.ap} AP / {status.latest.approval.price.mana} mana · {describeEffect(status.latest.approval.effectTerms)}.</p>}
        {status.latest?.approval?.conditionTerms && <p>Retained owner-approved terms: {status.latest.approval.spell.name} · source {status.latest.approval.source.tokenId}/{status.latest.approval.source.instanceId} → target {status.latest.approval.target.tokenId}/{status.latest.approval.target.instanceId} · {status.latest.approval.price.ap} AP / {status.latest.approval.price.mana} mana · canonical Stunned · {status.latest.approval.conditionTerms.timing.durationText} — GM removes.</p>}
        {['awaiting', 'unknown', 'prepared'].includes(status.phase) && <button type="button" disabled={busy} onClick={() => perform(checkSpellApproval)}>Check this same approval</button>}
        {['awaiting', 'unknown'].includes(status.phase) && <button type="button" disabled={busy} onClick={() => perform(withdrawSpellApproval)}>Withdraw before acceptance</button>}
         {status.phase === 'reapproval' && <button type="button" disabled={busy} onClick={() => perform(reapproveSpell)}>{condition || bundle ? 'Review changed terms before fresh approval' : formula ? 'Approve displayed scores again (retained faces)' : 'Review and approve again (same roll)'}</button>}
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
      if (isArea(approval)) return <AreaSpellCard key={approval.approvalId} approval={approval} source={source} find={find} state={state} draft={draft} update={update} busy={busy} perform={perform} game={game} />;
      if (approval.spell.kind === 'class-effect') return <ClassEffectCard key={approval.approvalId} approval={approval} source={source} target={target} state={state} draft={draft} update={update} busy={busy} perform={perform} game={game} />;
      const condition = approval.spell.kind === 'condition', bundle = approval.spell.kind === 'effect', direct = bundle && !!approval.effectTerms.direct;
      // Shared GM-recorded save branch: the GM records which owner-approved outcome happened at the table.
      const save = bundle ? saveOf(approval.effectTerms) : null, branch = save ? draft.branch : undefined;
      const formula = isFormula(approval);
      const resolved = condition || bundle, timingTerms = bundle ? approval.effectTerms.timing : approval.conditionTerms?.timing;
      const resolution = resolved ? gmConditionResolution(approval.approvalId) || { gmConfirmed: false, timing: timingTerms, timingNote: '', evidence: '' } : null;
      const updateResolution = values => { try { saveGmConditionResolution(approval.approvalId, { ...resolution, ...values }); } catch (e) { update({ error: e.message }); } };
      return <article key={approval.approvalId} className="p9-gm-card">
        <h4>{nameOf(source)} → {nameOf(target)}: {approval.spell.name}</h4>
        {bundle && <><p>{describeEffect(approval.effectTerms)}</p><p>{automationText(approval.effectTerms.timing, approval.effectTerms.condition, approval.effectTerms.direct)} {approval.effectTerms.timing.gmNote}</p>
          <p>Exact source {approval.source.tokenId}/{approval.source.instanceId} → target {approval.target.tokenId}/{approval.target.instanceId}. Duration and effects are owner-approved; changed terms require fresh approval.</p>
          {save && <p className="p9-note">{saveManualText(save)}{approval.effectTerms.timing.expiryPolicy !== 'gm-manual' ? ' This expiry is automatic: either recorded outcome needs active authenticated turn tracking with the target in the roster, or it is refused with nothing charged.' : ''}</p>}
          <MovementOutcome terms={approval.effectTerms} definitionId={approval.spell.definitionId} sourceRef={approval.source} targetToken={target} approvalId={approval.approvalId} />
          <AttributeOutcome terms={approval.effectTerms} definitionId={approval.spell.definitionId} sourceRef={approval.source} targetToken={target} approvalId={approval.approvalId} />
          <DamageReductionOutcome terms={approval.effectTerms} definitionId={approval.spell.definitionId} sourceRef={approval.source} targetToken={target} approvalId={approval.approvalId} />
          {direct && <><p>{approval.roll.mode} [{approval.roll.dice.map(group => group.faces.join(', ')).join(' | ')}] {approval.roll.constant >= 0 ? '+' : '-'} {Math.abs(approval.roll.constant)} = <strong>{approval.roll.total}</strong></p><p className="p9-meta">{approval.roll.reading}</p></>}</>}
        {bundle ? null : condition ? <><p>Canonical Stunned · {STUNNED.description}</p><p>{approval.conditionTerms.timing.durationText} — GM removes. {approval.conditionTerms.timing.gmNote}</p>
          <p>Exact source {approval.source.tokenId}/{approval.source.instanceId} → target {approval.target.tokenId}/{approval.target.instanceId}. Duration is owner-approved; a clarification cannot replace it. Changed terms require a newly admitted version and fresh approval.</p></> : <><p>{approval.spell.kind === 'damage' ? `${approval.spell.damageTypes.join('/')} damage` : 'direct healing'} · {approval.roll.mode} [{approval.roll.dice.map(group => group.faces.join(', ')).join(' | ')}] {approval.roll.constant >= 0 ? '+' : '-'} {Math.abs(approval.roll.constant)} = <strong>{approval.roll.total}</strong></p>
          <p className="p9-meta">{approval.roll.reading}</p>{isDeterministic(approval) && <p>Calculated proposal, no dice or random roll. Owner approval does not commit; your confirmation applies the final amount and exact price together.</p>}</>}
        {(isFormula(approval) || isFormulaBundle(approval)) && <p className="p9-note">Owner-attested caster scores: {Object.entries(approval.rollAttributes).map(([name, value]) => `${name} ${value}`).join(', ') || 'none'}. Calculation verified against these inputs; sheet derivation is not server-authoritative. Changed caster state needs fresh owner consent with retained faces.</p>}
        {approval.rollHealth && <p className="p9-note">Bound caster base HP {approval.rollHealth.current}/{approval.rollHealth.max} · missing {Math.max(0, approval.rollHealth.max - approval.rollHealth.current)}; temporary HP excluded, divisor rounded down. Source {approval.source.tokenId}/{approval.source.instanceId}, revision {approval.formulaSourceRevision}. Server revalidates these HP inputs before committing.</p>}
        <p>Owner-approved price: {approval.price.ap} AP · {approval.price.mana} mana (temporary first){notePrice(approval.classPayment)}{approval.classPayment ? ` · class ${describeClassPublic(approval.classPayment.beforePublic)} → ${describeClassPublic(approval.classPayment.afterPublic)}` : ''}</p>
        <p className="p9-advisory">{advisoryRange(source, target, game, 'authored range')} {resistanceText(target)}</p>
         {resolved ? <fieldset disabled={busy || ['preparing', 'submitting', 'unknown', 'accepted', 'unresolved'].includes(state?.phase)}><legend>Private GM resolution</legend>
          <label>GM timing clarification (required)<input maxLength={300} value={resolution.timingNote} onChange={e => updateResolution({ timingNote: e.target.value, gmConfirmed: false })} /></label>
          <label>Private manual resolution evidence<textarea maxLength={2000} value={resolution.evidence} onChange={e => updateResolution({ evidence: e.target.value, gmConfirmed: false })} /></label>
          {save && <div role="radiogroup" aria-label="Recorded save outcome">{effectBranchLines(approval.effectTerms).map(line => <label key={line.branch} className="p9-branch"><input type="radio" name={`branch-${approval.approvalId}`} checked={branch === line.branch} onChange={() => update({ branch: line.branch })} /> {line.text}</label>)}</div>}
           <label><input type="checkbox" checked={resolution.gmConfirmed === true} onChange={e => updateResolution({ gmConfirmed: e.target.checked })} /> {save ? 'I resolved eligibility, range and immunity, and recorded the table’s save result above' : <>I resolved eligibility/range/saves/immunity and confirm that this {bundle ? 'whole effect' : 'Stunned'} outcome succeeded</>}</label>
          {direct && <><label>Final {approval.effectTerms.direct.kind === 'damage' ? 'damage' : 'healing'} <input type="number" min="0" value={draft.final ?? ''} onChange={event => update({ final: event.target.value })} /></label>
            <label>Reason (required if different from {approval.roll.total}) <input type="text" value={draft.reason || ''} onChange={event => update({ reason: event.target.value })} /></label></>}
          <p>{save ? 'Payment and the direct part apply on both recorded outcomes; the effect installs only if the target fails. Attempts that are not executed stay GM-managed.' : 'Only successful application is automated. Failed/unexecuted attempt costs remain GM-managed.'}</p>
        </fieldset> : <><label><input type="checkbox" checked={draft.adjudicated === true} onChange={event => update({ adjudicated: event.target.checked })} /> I adjudicated legality, range, defense and mitigation</label>
        <label>Final {approval.spell.kind === 'damage' ? 'damage' : 'healing'} <input type="number" min="0" value={draft.final ?? ''} onChange={event => update({ final: event.target.value })} /></label>
        <label>Reason (required if different from {approval.roll.total}) <input type="text" value={draft.reason || ''} onChange={event => update({ reason: event.target.value })} /></label></>}
         {draft.error && <p role="alert">{draft.error}</p>}
         {(condition || bundle) && approval.target.kind === 'character' && <TargetPolicy approvalId={approval.approvalId} bundle={bundle ? approval.effectTerms : null} disabled={busy || ['preparing', 'submitting', 'unknown', 'accepted', 'unresolved'].includes(state?.phase)} />}
         {formula && approval.target.kind === 'character' && !sameExactRef(approval.source, approval.target) && <TargetPolicy approvalId={approval.approvalId} formula disabled={busy || ['preparing', 'submitting', 'unknown', 'accepted', 'unresolved'].includes(state?.phase)} />}
         {formula && approval.target.kind === 'character' && !sameExactRef(approval.source, approval.target) && <p className="p9-note">A different final healing amount needs a fresh owner approval and target acceptance; the accepted proposal is {approval.roll.total}.</p>}
        <div className="p9-actions">
          <button type="button" className="p9-primary" disabled={busy || ['preparing', 'submitting', 'unknown', 'accepted', 'unresolved'].includes(state?.phase) || (resolved && (!resolution.gmConfirmed || !resolution.timingNote.trim())) || (direct && (draft.final === '' || draft.final === undefined)) || (save && !effectBranches(approval.effectTerms).includes(branch))} onClick={() => perform(() => gmAcceptSpell(approval.approvalId, { finalAmount: resolved && !direct ? 0 : draft.final === '' || draft.final === undefined ? NaN : Number(draft.final), reason: resolved && !direct ? '' : draft.reason || '', adjudicated: resolved ? resolution.gmConfirmed : draft.adjudicated === true, ...(save ? { branch } : {}) }))}>{save ? 'Confirm recorded outcome' : bundle ? 'Confirm payment, result and effect together' : condition ? 'Confirm PC payment and Stunned together' : 'Accept one consequence'}</button>
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

/** M6A GM card: inspect exact area terms, single source payment, and adjudicate each creature target's final amount. */
function AreaSpellCard({ approval, source, find, state, draft, update, busy, perform, game }) {
  const locked = ['preparing', 'submitting', 'unknown', 'accepted', 'unresolved'].includes(state?.phase);
  const perTarget = draft.targets || {};
  const setTargetDraft = (idx, values) => update({ targets: { ...perTarget, [idx]: { ...(perTarget[idx] || {}), ...values } } });
  const fillProposedTotals = () => {
    const next = {};
    approval.targets.forEach((_, idx) => { next[idx] = { ...(perTarget[idx] || {}), final: String(approval.roll.total) }; });
    update({ targets: next });
  };
  const allAmountsEntered = approval.targets.every((_, idx) => {
    const val = perTarget[idx]?.final;
    return val !== undefined && val !== '' && Number.isSafeInteger(Number(val)) && Number(val) >= 0;
  });
  return <article className="p9-gm-card" aria-label={`Area adjudication for ${approval.spell.name}`}>
    <h4>{nameOf(source)} → [{approval.targets.map(t => nameOf(find(t))).join(', ')}]: {approval.spell.name}</h4>
    <p>
      Area circle {approval.areaTerms?.radiusFeet}-ft radius · {approval.areaTerms?.rangeFeet}-ft placement range · {approval.targets.length} creature target{approval.targets.length === 1 ? '' : 's'}
      {approval.areaOrigin ? ` · placed origin (${Math.round(approval.areaOrigin.x)}, ${Math.round(approval.areaOrigin.y)})` : ''}
    </p>
    <p>
      {approval.spell.kind === 'damage' ? `${approval.spell.damageTypes.join('/')} damage` : 'direct healing'} · {approval.roll.mode} [{approval.roll.dice.map(group => group.faces.join(', ')).join(' | ')}] {approval.roll.constant >= 0 ? '+' : '-'} {Math.abs(approval.roll.constant)} = <strong>{approval.roll.total}</strong> (proposed per target)
    </p>
    <p className="p9-meta">{approval.roll.reading} · Roll procedure: {approval.areaRollProcedure}</p>
    {approval.rollAttributes && Object.keys(approval.rollAttributes).length > 0 && (
      <p className="p9-note">Owner-attested caster scores: {Object.entries(approval.rollAttributes).map(([name, value]) => `${name} ${value}`).join(', ')}. Calculation verified against these inputs.</p>
    )}
    <p>Single source payment: {approval.price.ap} AP · {approval.price.mana} mana (temporary first){notePrice(approval.classPayment)}{approval.classPayment ? ` · class ${describeClassPublic(approval.classPayment.beforePublic)} → ${describeClassPublic(approval.classPayment.afterPublic)}` : ''}</p>
    <fieldset disabled={busy || locked}>
      <legend>Per-target GM adjudication ({approval.targets.length} creatures)</legend>
      <button type="button" onClick={fillProposedTotals}>Use proposed roll ({approval.roll.total}) for all targets</button>
      {approval.targets.map((tRef, idx) => {
        const targetToken = find(tRef);
        const row = perTarget[idx] || {};
        const hp = targetToken ? { current: targetToken.state?.currentHp, temp: targetToken.state?.tempHealth || 0, max: targetToken.state?.maxHp ?? targetToken.stats?.maxHp } : null;
        return (
          <div key={ref(tRef)} className="m6a-gm-target-row">
            <p>
              <strong>Target {idx + 1}: {nameOf(targetToken)}</strong> ({tRef.tokenId} / {tRef.instanceId})
              {hp ? ` · HP ${hp.current}/${hp.max}${hp.temp ? ` (+${hp.temp} temp)` : ''}` : ''}
            </p>
            <p className="p9-advisory">{advisoryRange(source, targetToken, game, `${approval.areaTerms?.rangeFeet ?? '?'} ft area`)} {resistanceText(targetToken)}</p>
            <label>
              Final {approval.spell.kind === 'damage' ? 'damage' : 'healing'} for {nameOf(targetToken)}{' '}
              <input aria-label={`Final ${approval.spell.kind} for ${nameOf(targetToken)}`} type="number" min="0" value={row.final ?? ''} onChange={e => setTargetDraft(idx, { final: e.target.value })} />
            </label>
            <label>
              Reason for {nameOf(targetToken)} (required if different from {approval.roll.total}){' '}
              <input aria-label={`Adjustment reason for ${nameOf(targetToken)}`} type="text" value={row.reason || ''} onChange={e => setTargetDraft(idx, { reason: e.target.value })} />
            </label>
          </div>
        );
      })}
      <label>
        <input type="checkbox" checked={draft.adjudicated === true} onChange={e => update({ adjudicated: e.target.checked })} />
        {' '}I adjudicated area placement, range, line of effect, target eligibility and each creature’s mitigation
      </label>
    </fieldset>
    {draft.error && <p role="alert">{draft.error}</p>}
    <div className="p9-actions">
      <button
        type="button"
        className="p9-primary"
        disabled={busy || locked || draft.adjudicated !== true || !allAmountsEntered}
        onClick={() => perform(() => gmAcceptSpell(approval.approvalId, {
          adjudicated: draft.adjudicated === true,
          targetOutcomes: approval.targets.map((tRef, idx) => ({
            ref: tRef,
            finalAmount: Number(perTarget[idx]?.final),
            adjustmentReason: perTarget[idx]?.reason || ''
          }))
        }))}
      >
        Accept one area consequence
      </button>
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
      (sameExactRef(refOf(t), c.source) ? c.selfAllowed && !bundle : d.targeting.rangeFeet > 0 && d.targeting.restriction !== 'self' && (refOf(t).kind === 'creature' || (t.state.actorContract.primary && (!bundle || pcConsent(d.effects, 'creature').ok)))));
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
        <p>Authored range {d.targeting.rangeFeet} ft · one {d.targeting.restriction} target. {bundle ? `One distinct placed creature or primary PC. ${bundleNote}` : condition ? 'One distinct bound creature or primary PC. The GM resolves eligibility, range, saves, immunity and success. Hostile Stunned needs no target acknowledgement; disconnected targets do not veto installation.' : c.selfAllowed ? 'Self healing uses this exact creature; no owner offer or equipment.' : 'Self is unavailable for this targeting/effect profile. Primary PCs require the exact owner’s acceptance.'}</p>
      {bundle && (target || c.target)?.kind !== 'creature' && (target || selected) && refOf(target || selected)?.kind === 'character' && <p className="p9-consent">Player character target. {d.effects.condition.kind === 'periodic' ? 'A periodic effect can be applied by this route to one creature only; a player character target stays manual.' : consentText(pcConsent(d.effects, 'creature'))}</p>}
      {resolved && <>{bundle ? <><p>{d.effects.condition.kind === 'stunned' ? STUNNED.description : d.effects.condition.kind === 'periodic' ? `${conditionLabel(d.effects.condition)}. One creature target; a second periodic effect on it is refused for the GM to resolve.` : d.effects.condition.kind === 'attribute' ? `${conditionLabel(d.effects.condition)}: flat change to one attribute score, added once on top of the target's sheet score. ${ATTRIBUTE.combinationPolicy}` : d.effects.condition.kind === 'damageReduction' ? `${conditionLabel(d.effects.condition)}: positive flat damage reduction, added once to effective flat DR. ${DAMAGE_REDUCTION.combinationPolicy}` : `${conditionLabel(d.effects.condition)}: flat change to movement speed (feet per movement AP), applied after other speed conditions; never below 0 ft.`}</p>
        <p>{d.timing.durationText}. {automationText(d.timing, d.effects.condition, d.effects.direct)} {d.timing.gmNote}</p>
        {latest.phase !== 'accepted' && <MovementOutcome terms={{ direct: d.effects.direct, condition: d.effects.condition, timing: d.timing }} definitionId={actionId(c.entry.definitionRef)} sourceRef={c.source}
          targetToken={[...creatures, ...characters].find(t => sameExactRef(refOf(t), c.target || (target && refOf(target))))} approvalId={latest.approval?.approvalId} />}
        {latest.phase !== 'accepted' && <AttributeOutcome terms={{ direct: d.effects.direct, condition: d.effects.condition, timing: d.timing }} definitionId={actionId(c.entry.definitionRef)} sourceRef={c.source}
          targetToken={[...creatures, ...characters].find(t => sameExactRef(refOf(t), c.target || (target && refOf(target))))} approvalId={latest.approval?.approvalId} />}
        {latest.phase !== 'accepted' && <DamageReductionOutcome terms={{ direct: d.effects.direct, condition: d.effects.condition, timing: d.timing }} definitionId={actionId(c.entry.definitionRef)} sourceRef={c.source}
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
       {roll && (!bundle || (c.target?.kind === 'character' && pcConsent(d.effects, 'creature').a5)) && c.target?.kind === 'character' && !latest.approval && <fieldset disabled={busy}><legend>Exact owner proposal</legend>
         <label>Proposed {directPart.kind === 'healing' ? 'healing' : 'damage before equipment block'}<input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} /></label>
         {directPart.kind === 'damage' && <label><input type="checkbox" checked={blockApplicable} onChange={e => setBlockApplicable(e.target.checked)} /> I rule that equipment blocking applies to this ability</label>}
         <label>Targeting and {directPart.kind === 'healing' ? 'healing' : 'blocking applicability'} ruling (required)<input maxLength={300} value={reason} onChange={e => setReason(e.target.value)} /></label>
         <p>Healing requires explicit owner acceptance of this amount, with no equipment. Changing it requires a new acceptance with these retained source faces.</p>
       </fieldset>}
        {((needsRoll ? !!roll : true) && (!resolved || (resolution.gmConfirmed && resolution.timingNote.trim()))) && !['accepted', 'reconciled', 'unresolved'].includes(latest.phase) && !latest.pcOffer && <button type="button" disabled={busy || ['preparing', 'submitting', 'unknown', 'unresolved'].includes(status?.phase)} onClick={() => perform(() => prepareCreatureAbility({ proposedAmount: amount === '' ? NaN : Number(amount), blockApplicable, ruling: reason }))}>{bundle ? latest.approval ? 'Revalidate original effect attempt' : c.target?.kind === 'character' && pcConsent(d.effects, 'creature').a5 ? 'Offer exact proposal to PC owner' : 'Validate successful effect application' : condition ? latest.approval ? 'Revalidate original condition attempt' : 'Validate successful condition application' : latest.approval ? 'Revalidate original attempt (same roll)' : c.target?.kind === 'character' ? 'Offer exact proposal to PC owner' : 'Validate source, target and retained roll'}</button>}
       {latest.pcOffer && <p role="status">Continue in block/consent adjudication below. {blockStatuses[c.attemptId]?.message || 'Original owner offer retained.'}
         <button type="button" disabled={busy} onClick={() => perform(() => blockStatuses[c.attemptId]?.command ? gmCheckBlockCommand(c.attemptId) : gmCheckOffer(c.attemptId))}>Check original PC offer or command</button></p>}
      {(roll || resolved) && latest.approval && !['accepted', 'reconciled', 'unknown', 'unresolved'].includes(latest.phase) && !['preparing', 'submitting', 'unknown', 'unresolved'].includes(status?.phase) && <button type="button" disabled={busy} onClick={() => perform(revalidateCreatureContext)}>{needsRoll ? 'Refresh admission or change target (keep faces)' : 'Refresh admission or change target (keep evidence)'}</button>}
        {canAccept && !latest.pcOffer && <>
         {(condition || bundle) && c.target?.kind === 'character' && <TargetPolicy approvalId={id} bundle={bundle ? d.effects : null} disabled={busy} />}
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
      <span>{e.revoked ? ' — Revoked (history retained)' : e.creatureOnly ? ' — Exact creature-source admission; use placed Inspect' : e.canonicalDefinition.effects ? ` — PC→distinct creature${pcConsent(e.canonicalDefinition.effects, 'character').ok ? ' or primary PC' : ''} composed effect` : e.canonicalDefinition.effect.kind === 'condition' ? ` — PC→distinct creature or primary PC canonical Stunned · ${e.canonicalDefinition.timing.durationText} — GM removes` : ' — Admitted for immediate damage/healing'}</span>
      {!e.revoked && !e.creatureOnly && <button type="button" disabled={busy} onClick={() => { if (!routeSpellCast({ id: actionId(e.definitionRef) }, { producer: 'admitted-library' })) setMessage('This installed binding is unavailable to your current character.'); }}>Use admitted ability</button>}
      {gm && !e.revoked && <button type="button" disabled={busy} onClick={() => perform(() => changeAuthoredAdmission('revoke', e.definitionRef))}>Revoke this version</button>}
    </div>)}
  </section></details>;
}

function TargetPolicy({ approvalId, disabled, bundle = null, formula = false }) {
  const proposal = useSpellConsequenceStore(s => s.gmPending[approvalId]?.targetProposal);
  const [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const what = bundle ? 'effect bundle' : formula ? 'healing' : 'Stunned', consent = bundle ? pcConsent(bundle, 'character') : null;
  return <div className="p9-note">{bundle && consent?.ok && <p>{consentText(consent)}</p>}
    {formula && <p>Direct formula healing: the target's owner must explicitly accept the exact proposed amount. Source payment consent is separate.</p>}
    <p>{proposal ? `Voluntary ${what} - ${proposal.withdrawn ? 'target acceptance withdrawn; close this attempt' : proposal.accepted ? 'exact target accepted' : 'waiting for explicit target acceptance; silence never accepts'}. Source payment consent remains separate.` : `Hostile ${what} - current GM success authority. Target notification is informational, not permission.`}</p>
    {!proposal && !formula && <button type="button" disabled={disabled || busy} onClick={async() => { setBusy(true); setError(''); try { await designateVoluntaryCondition(approvalId); } catch (e) { setError(e.message); } finally { setBusy(false); } }}>GM: designate voluntary application</button>}
    {error && <p role="alert">{error}</p>}</div>;
}

function TargetConditions() {
  useCharacterTokenStore(s => s.characterTokens);
  useSpellConsequenceStore(s => s.draftVersion);
  const characterId = useCharacterStore(s => s.currentCharacterId);
  const proposals = useSpellConsequenceStore(s => s.targetProposals) || [];
  const [error, setError] = useState(''), [busy, setBusy] = useState(false);
  useEffect(() => { refreshSpellApprovals(); }, [characterId]);
  const source = ownerSource(), records = source.token ? (source.token.state?.conditions || []).filter(r => (isStunned(r) || isMovementModifier(r) || isAttributeModifier(r) || isDamageReductionModifier(r)) && /^authored-(condition|effect):/.test(String(r.sourceEntityId || ''))) : [];
  const retained = retainedTargetResponses();
  // Reading/acknowledging/reporting never emits an action or changes a condition.
  if (!records.length && !proposals.length && !retained.length) return null;
  const respond = async(p, accept) => { setBusy(true); setError(''); try { await respondToVoluntaryCondition(p, accept); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  return <details className="p9-admitted"><summary>Stunned notices and voluntary proposals ({records.length + proposals.length})</summary>
    <section aria-label="Target Stunned notices"><button type="button" disabled={busy} onClick={() => refreshSpellApprovals()}>Refresh original target proposals</button>
      <p>An accepted hostile effect (Stunned, a movement penalty or an attribute penalty) does not require your permission or acknowledgement. To request correction, message the GM with the exact instance below; the GM uses shared condition controls to correct/remove that instance. Reporting does not undo, duplicate or refund it.</p>
      {records.map(r => <p key={r.id} role="status">{isStunned(r) ? 'Accepted canonical Stunned' : isAttributeModifier(r) ? `Active ${r.name} (${attributeName(attributeModifierOf(r).attribute)} ${signed(attributeModifierOf(r).amount)}; added once to your sheet score — supported spell formulas that name this attribute use the changed score; a basic strike changes only when its weapon uses this attribute. Your base attributes are not edited)` : isDamageReductionModifier(r) ? `Active ${r.name} (Flat DR +${damageReductionModifierOf(r).amount}; added once to your sheet Damage Reduction (DR) and shown to the GM in combat adjudication; never automatically subtracted before or after equipment blocking. Your base stats and equipment are not edited)` : `Active ${r.label || 'movement effect'} (${(r.effects?.movementSpeed || 0) > 0 ? '+' : '−'}${Math.abs(r.effects?.movementSpeed || 0)} ft per movement AP; added to other movement effects, never below 0 ft — your sheet and movement validation use the combined speed)`} · instance {r.id} · {expiryLabel(r)}. Source identity is withheld on this notice. View the same instance on your sheet/token.</p>)}
      {retained.map(e => <p key={e.command.commandId} role="status">Original target response {e.command.proposalId}: outcome unavailable. No replacement consent is created. <button type="button" disabled={busy} onClick={() => respond(e.proposal || e.command, e.command.accept)}>Check original target response</button></p>)}
      {proposals.filter(p => p.target.characterId === characterId).map(p => <div key={p.proposalId}><h4>{p.healing ? 'Direct healing proposal' : p.bundle ? 'Voluntary effect bundle' : 'GM-designated voluntary Stunned'}</h4>{p.healing && <p className="p9-bundle">Direct healing {p.healing.formula} — proposed amount {p.healing.proposedAmount}. A different amount needs your fresh acceptance. Your affirmative acceptance is required before the GM can install it.</p>}{p.bundle && <p className="p9-bundle">{p.bundle.direct ? `${p.bundle.direct.kind === 'damage' ? `${(p.bundle.direct.damageTypes || []).join('/')} damage` : 'Direct healing'} ${p.bundle.direct.formula} (the GM finalizes the amount${p.bundle.direct.kind === 'healing' ? '; a different amount needs your fresh acceptance' : ''}) + ` : ''}{conditionLabel(p.bundle.condition)} · {p.bundle.timing.durationText} — {policyText(p.bundle.timing.expiryPolicy, p.bundle.timing.occurrences)}. {p.bundle.condition.kind === 'movement' ? `Your movement speed changes by ${p.bundle.condition.feet > 0 ? '+' : '−'}${Math.abs(p.bundle.condition.feet)} ft per movement AP, combined with other effects and never below 0 ft.`
          : p.bundle.condition.kind === 'attribute' ? `Your ${attributeName(p.bundle.condition.attribute)} score changes by ${signed(p.bundle.condition.amount)} while it lasts: added once to your sheet score, used by supported spell formulas that name this attribute; a basic strike changes only when its weapon uses this attribute. Base attributes are not edited. ${ATTRIBUTE.notAutomated}`
          : p.bundle.condition.kind === 'damageReduction' ? `Your flat Damage Reduction (DR) increases by +${p.bundle.condition.amount} while it lasts: added once to your sheet Damage Reduction (DR) and shown to the GM in combat adjudication (never automatically subtracted before or after equipment blocking). Base stats and equipment are not edited. ${DAMAGE_REDUCTION.notAutomated}` : STUNNED.description}</p>}<p>{p.source} (exact opaque source handle {p.sourceHandle}) → exact target {p.target.tokenId}/{p.target.instanceId}. {p.healing ? 'The exact proposed healing amount is bound to this acceptance.' : p.bundle ? '' : `Canonical Stunned: ${STUNNED.description} ${p.durationText} — GM removes.`} Source price {p.price.ap} AP / {p.price.mana} mana. Admitted definition {p.definitionId} · version/hash {p.definitionVersionOrHash}. Exact proposal {p.proposalId} · server-bound terms handle {p.termsHash}. No source resources are authorized by your acceptance.</p>
        <p>{p.withdrawn ? 'Withdrawn. A fresh proposal is required.' : p.accepted ? 'Your exact acceptance is recorded; installation still requires the GM.' : 'Waiting for your affirmative acceptance. Silence, timeout and disconnection never accept.'}</p>
        {!p.withdrawn && <><button type="button" disabled={busy || p.accepted} onClick={() => respond(p, true)}>{p.healing ? 'Accept this exact healing proposal' : p.bundle ? 'Accept this exact effect bundle' : 'Accept this exact voluntary Stunned'}</button><button type="button" disabled={busy} onClick={() => respond(p, false)}>Withdraw target acceptance before installation</button></>}
      </div>)}{error && <p role="alert">{error}</p>}
    </section></details>;
}

export default function SpellConsequenceHost() {
  const shared = useGameStore(value => value.isInMultiplayer);
  useEffect(() => { if (shared) restoreOwnerStatus(); }, [shared]);
  if (!shared) return null;
  return <><AdmittedAbilities /><TargetConditions /><OwnerPanel /><OwnerChip /><GmPanel /><CreaturePanel /></>;
}
