import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useGameStore from '../../store/gameStore';
import useCharacterStore from '../../store/characterStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useCreatureStore from '../../store/creatureStore';
import useSpellAoEStore from '../../store/spellAoEStore';
import { refOf, selectOwnerAttachment } from '../../services/actorConsequenceService';
import { supportSpell, digitalRoll, recordRoll, affordable, sourcePools, describeClassPublic, classRiderPlan, spellReceipt } from '../../services/spellConsequence';
import { branches as classBranches, branchLines as classBranchLines } from '../../services/classEffect';
import { sameExactRef } from '../../services/featherSlash';
import { useSpellConsequenceStore, closeOwnerPanel, ownerSource, sendSpellApproval, checkSpellApproval, withdrawSpellApproval, reapproveSpell,
  restoreOwnerStatus, refreshSpellApprovals, gmAcceptSpell, gmDeclineSpell, gmCheckSpellCommand, markSpellReconciled, readTargetRelationship } from '../../services/spellConsequenceService';
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
import TriggerOfferPanel from './TriggerOfferPanel';
import PassiveActivationPanel from './PassiveActivationPanel';
import PlacedEffectPanel from './PlacedEffectPanel';
import { actionId, readFormula as readAuthoredFormula, definitionSummary, FORMULA_CAPABILITY, isFormula, isFormulaBundle, isArea, MAX_AREA_TARGETS, tokenFootprintForArea, evaluateLowestHealthCandidates } from '../../services/authoredAbility';
import { describe as describeEffect, conditionLabel, policyText, conditionPlan, combinationText, pcConsent, consentText, saveOf, critGateOf, isCriticalRoll, branchLines as effectBranchLines, branchesFor as effectBranches } from '../../services/authoredEffect';
import { manualText as saveManualText } from '../../services/saveBranch';
import { describe as describeDirectSave, branchLines as directSaveLines, appliedAmount as directSaveApplied, policyRefusal as directSavePolicyRefusal, BRANCHES as DIRECT_SAVE_BRANCHES } from '../../services/directSave';
import { resolveQuickDrawOutcome, validateFlowCheckRoll, FLOW_MIN, FLOW_MAX } from '../../services/hunterFlow';
import { movementSpeedBreakdown, movementBreakdownText, movementBaseSpeed } from '../../utils/conditionUtils';
import { refreshAuthoredAbilities, changeAuthoredAdmission, routeSpellCast } from '../../services/spellConsequenceService';
import { creatureAttempt, saveCreatureRoll, prepareCreatureAbility, cancelCreatureAbility, revalidateCreatureContext } from '../../services/spellConsequenceService';
import { saveCreatureResolution } from '../../services/spellConsequenceService';
import { STUNNED, ATTRIBUTE, DAMAGE_REDUCTION, tickScheduleText, isStunned, isMovementModifier, isAttributeModifier, attributeModifierOf, attributeModifierTotals, attributeName, isDamageReductionModifier, damageReductionModifierOf, damageReductionTotal, expiryLabel } from '../../services/sharedConditionProfile';
import { designateVoluntaryCondition, respondToVoluntaryCondition, retainedTargetResponses } from '../../services/spellConsequenceService';
import { gmConditionResolution, saveGmConditionResolution } from '../../services/spellConsequenceService';
import { gmCheckOffer, useBlockingStore, gmCheckBlockCommand } from '../../services/blockingService';
import { HEALTH_CAPABILITY, DETERMINISTIC_CAPABILITY, OUTCOME_CAPABILITY, CHANNELED_CAPABILITY, isDeterministic, isOutcome } from '../../services/authoredAbility';
import { describe as describeChanneled } from '../../services/authoredChanneled';
import { rollOutcomeDie, flipOutcomeCoins, rollBranchEffect } from '../../services/randomOutcomeSource';
import { resolveBranch, readBranchFormula, describeMatcher, describeBranchEffect } from '../../services/randomOutcome';
// Effect cooldowns: the cooldown controls reuse only; the applied effect keeps its own lifetime (copy only, no rule).
export const cooldownSeparation = condition => condition?.kind === 'periodic'
  ? ' Separate from the periodic effect: its ticks keep their own count, and removing the effect or resolving its last tick does not release the cooldown.'
  : condition ? ` Separate from the ${condition.kind === 'stunned' ? 'Stunned' : condition.label} effect: it keeps its own duration; removing or expiring it does not release the cooldown, and the cooldown's release does not remove it.` : '';

const nameOf = token => token?.character?.name || token?.state?.customName || token?.name || token?.id || 'Unknown';
const ref = value => value ? `${value.kind}:${value.mapId}:${value.tokenId}` : '';
// Owner selection retains the incarnation and canonical ownership, not just the map slot.
const ownerTargetKey = value => value ? JSON.stringify(value) : '';
const hasValidPrice = price => !!price && Number.isSafeInteger(price.ap) && price.ap >= 0 && Number.isSafeInteger(price.mana) && price.mana >= 0;
const hasValidClassPayment = payment => {
  if (!payment) return true;
  if (!payment.domain || !payment.price) return false;
  if (payment.domain === 'musicalNotes' || payment.domain === 'elementalSpheres') {
    return Array.isArray(payment.price.costs) && Array.isArray(payment.price.gains);
  }
  if (payment.domain === 'devotionGauge') {
    return [payment.price.cost, payment.price.gain, payment.price.required].every(v => Number.isSafeInteger(v) && v >= 0);
  }
  if (payment.domain === 'hunterFlow') {
    return payment.price?.kind === 'flow-check';
  }
  return false;
};
const classPriceNote = payment => {
  if (!hasValidClassPayment(payment) || !payment) return '';
  if (payment.domain === 'musicalNotes') {
    return ` · ${payment.price.costs.length} Musical Notes spent (${payment.price.costs.join(', ') || 'none'}); ${payment.price.gains.length} gained (${payment.price.gains.join(', ') || 'none'})`;
  }
  if (payment.domain === 'elementalSpheres') {
    return ` · ${payment.price.costs.length} Elemental Sphere${payment.price.costs.length === 1 ? '' : 's'} spent (${payment.price.costs.join(', ') || 'none'}); ${payment.price.gains.length} gained (${payment.price.gains.join(', ') || 'none'})`;
  }
  if (payment.domain === 'devotionGauge') {
    return ` · Devotion cost ${payment.price.cost} (requires ${payment.price.required}), gain ${payment.price.gain}`;
  }
  if (payment.domain === 'hunterFlow') {
    const before = payment.before?.flow ?? payment.beforePublic?.current;
    const after = payment.after?.flow ?? payment.afterPublic?.current;
    return ` · 2d6 Flow check (Flow ${before ?? '?'} → ${after ?? '?'})`;
  }
  return '';
};
function poolInsufficiencyReasons(pools, price) {
  if (!hasValidPrice(price)) return [];
  if (!pools) return ['Caster AP and mana pools are unavailable.'];
  const reasons = [];
  if (price.ap > 0 && (!Number.isFinite(pools.ap?.current) || pools.ap.current + (pools.ap.temp || 0) < price.ap)) {
    reasons.push(`Insufficient AP: requires ${price.ap} AP (you have ${Number.isFinite(pools.ap?.current) ? `${pools.ap.current}+${pools.ap.temp || 0} temp` : 'unavailable'}).`);
  }
  if (price.mana > 0 && (!Number.isFinite(pools.mana?.current) || pools.mana.current + (pools.mana.temp || 0) < price.mana)) {
    reasons.push(`Insufficient mana: requires ${price.mana} mana (you have ${Number.isFinite(pools.mana?.current) ? `${pools.mana.current}+${pools.mana.temp || 0} temp` : 'unavailable'}).`);
  }
  return reasons;
}
function ownerPaymentState(status) {
  const phase = status?.phase;
  if (phase === 'prepared' || phase === 'syncing' || phase === 'awaiting') {
    return {
      stateLabel: 'Awaiting consent / adjudication — not yet paid',
      nextAction: phase === 'prepared'
        ? 'Check this same approval to confirm whether the server received it.'
        : 'Wait for GM adjudication (and target consent if required), or withdraw before acceptance.'
    };
  }
  if (phase === 'accepted') {
    const view = status.latest?.result ? spellReceipt(status.latest.result) : null;
    if (view) {
      return {
        stateLabel: 'Accepted and paid',
        receiptId: view.receipt.commandId,
        durability: view.status,
        nextAction: 'No further action required.'
      };
    }
    return {
      stateLabel: 'Authoritative receipt unavailable',
      nextAction: 'Refresh room state or reconcile with the GM; no payment total is invented.'
    };
  }
  if (phase === 'unknown') {
    return {
      stateLabel: 'Outcome unknown — payment not yet established',
      nextAction: 'Check this same approval; it will not reroll or pay twice.'
    };
  }
  if (phase === 'unresolved') {
    return {
      stateLabel: 'Outcome unresolved — payment may have been recorded',
      nextAction: 'Reconcile with the GM, then clear this approval.'
    };
  }
  if (phase === 'reapproval') {
    return {
      stateLabel: 'Refused / closed — no payment was recorded',
      nextAction: 'Review the changed terms and approve again with your retained dice.'
    };
  }
  if (phase === 'reconciled') {
    return {
      stateLabel: 'Closed — reconciled with GM',
      nextAction: 'The old approval is retained as history and will not be re-sent.'
    };
  }
  return {
    stateLabel: 'Refused / closed — no payment was recorded',
    nextAction: 'Review the response above and address any blocker before approving again (your recorded roll, if any, is preserved).'
  };
}
function gmPaymentState(state, targetProposal) {
  const phase = state?.phase;
  if (phase === 'unknown') return { stateLabel: 'Outcome unknown — payment not yet established', detail: 'Check this same command; it will not be rebuilt or paid twice.' };
  if (phase === 'unresolved') return { stateLabel: 'Outcome unresolved — payment may have been applied', detail: 'Reconcile with the table before acting again.' };
  if (phase === 'accepted') return { stateLabel: 'Accepted and paid', detail: state.message };
  if (['declined', 'refused', 'reapproval'].includes(phase)) return { stateLabel: 'Refused / closed — no payment was recorded', detail: state.message };
  if (targetProposal?.withdrawn) return { stateLabel: 'Target acceptance withdrawn — not paid', detail: 'Decline/close this attempt; no payment was recorded.' };
  if (targetProposal && !targetProposal.accepted) return { stateLabel: 'Awaiting target & GM consent — not yet paid', detail: 'Nothing is spent until target acceptance and GM confirmation.' };
  return { stateLabel: 'Awaiting GM consent — not yet paid', detail: 'Nothing is spent until GM confirmation.' };
}
function gmCardBadge(state, targetProposal) {
  const phase = state?.phase;
  if (phase === 'unknown') return { kind: 'action', text: 'Outcome unknown — check command' };
  if (phase === 'unresolved') return { kind: 'action', text: 'Unresolved — manual reconciliation' };
  if (targetProposal?.withdrawn) return { kind: 'action', text: 'Target withdrew — close attempt' };
  if (targetProposal && !targetProposal.accepted) return { kind: 'info', text: 'Awaiting target acceptance' };
  return { kind: 'action', text: 'Needs GM action' };
}
function GmPaymentSummary({ approval, state, targetProposal, label }) {
  const priceOk = hasValidPrice(approval?.price) && hasValidClassPayment(approval?.classPayment);
  const gmState = gmPaymentState(state, targetProposal);
  return (
    <div className="p9-payment-summary">
      <p>
        {priceOk
          ? <>{label}: {approval.price.ap} AP · {approval.price.mana} mana (temporary first){classPriceNote(approval.classPayment)}{approval.classPayment ? ` · class ${describeClassPublic(approval.classPayment.beforePublic)} → ${describeClassPublic(approval.classPayment.afterPublic)}` : ''}</>
          : <span className="p9-diagnostic">Authoritative payment terms unavailable; no total is invented.</span>}
      </p>
      <p><strong>Payment status:</strong> {gmState.stateLabel}</p>
      {approval?.triggerOfferId && <p>Triggered follow-up: normal cost still applies.</p>}
    </div>
  );
}
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

const RESTRICTION_LABELS = {
  ally: 'Allies only',
  enemy: 'Enemies only',
  self: 'Self only',
  any: 'Any target (unrestricted)'
};

function relationshipReason(restriction, relEntry) {
  if (!['ally', 'enemy'].includes(restriction)) return null;
  if (!relEntry || relEntry.status === 'loading') {
    return { eligible: false, kind: 'loading', text: 'Checking authoritative target relationship…' };
  }
  if (relEntry.status === 'error') {
    return { eligible: false, kind: 'error', text: 'Could not verify target relationship with the room server. Retry before approving.' };
  }
  if (relEntry.value === restriction) {
    return { eligible: true, kind: 'ok', text: restriction === 'ally' ? 'Target is an ally of the caster.' : 'Target is an enemy of the caster.' };
  }
  const req = restriction === 'ally' ? 'This spell requires an ally.' : 'This spell requires an enemy.';
  const rel = relEntry.value === 'neutral'
    ? 'This target is neutral to the caster.'
    : relEntry.value === 'ally'
      ? 'This target is an ally of the caster.'
      : 'This target is an enemy of the caster.';
  return { eligible: false, kind: 'ineligible', text: `${req} ${rel}` };
}

function relationshipOptionSuffix(restriction, relEntry) {
  if (!['ally', 'enemy'].includes(restriction) || !relEntry) return '';
  if (relEntry.status === 'loading') return ' · checking…';
  if (relEntry.status === 'error') return ' · could not verify';
  if (relEntry.value === restriction) return ` · ${relEntry.value}`;
  return ` · ${relEntry.value} (requires ${restriction})`;
}

/** Owner: explicit target, one recorded roll, approved price. Nothing is spent here. */
function OwnerPanel() {
  const owner = useSpellConsequenceStore(value => value.owner);
  const status = useSpellConsequenceStore(value => value.ownerStatus);
  const roomId = useGameStore(value => value.multiplayerRoom?.id);
  const roomGameState = useGameStore(value => value.multiplayerRoom?.gameState);
  const relationshipRevision = useSpellConsequenceStore(value => (roomId && value.relationshipRevisions && Object.prototype.hasOwnProperty.call(value.relationshipRevisions, roomId)) ? value.relationshipRevisions[roomId] : (value.relationshipRevision || 0));
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
  const [areaTarget, setAreaTarget] = useState(null);
  const [physical, setPhysical] = useState({});
  const [flowDice, setFlowDice] = useState({ mode: 'physical', die1: '', die2: '' });
  const [outcomePhysical, setOutcomePhysical] = useState({ face: '', flips: [] });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [relState, setRelState] = useState({ scopeKey: '', entries: {} });
  const [relRetry, setRelRetry] = useState(0);
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
    setAreaTarget(match && draft.areaTarget ? draft.areaTarget : null);
    setPhysical({}); setOutcomePhysical({ face: '', flips: [] }); setFlowDice({ mode: 'physical', die1: '', die2: '' }); setError('');
  }, [owner]);
  useEffect(() => {
    if (!owner) return undefined;
    const launcher = document.activeElement;
    document.querySelector('.p9-panel button[aria-label="Close"]')?.focus();
    return () => { if (launcher?.isConnected) launcher.focus(); };
  }, [owner]);
  useSpellConsequenceStore(s => s.registryRevision);
  const support = owner ? supportSpell({ id: owner.spellId }, character) : null;
  const source = owner ? ownerSource() : { token: null, ref: null, mapId: null, error: null };
  const all = [...characters, ...creatures];
  const area = support?.isArea === true;
  const isOutcomeSpell = support?.isOutcome === true;
  const condition = support?.kind === 'condition', composed = support?.kind === 'class-effect', bundle = support?.kind === 'effect', channeled = support?.isChanneled === true || support?.kind === 'channeled', needsRoll = channeled ? false : bundle ? !!(support.effectTerms && support.effectTerms.direct) : !condition;
  const deterministic = support?.definitionHash?.startsWith(`${DETERMINISTIC_CAPABILITY}/`) === true;
  const formula = deterministic || support?.definitionHash?.startsWith(`${FORMULA_CAPABILITY}/`) || support?.definitionHash?.startsWith(`${HEALTH_CAPABILITY}/`) || ((area || bundle) && support?.rollAttributes && Object.keys(support.rollAttributes).length > 0);
  const pcHealing = !area && formula && support?.targetRoute === 'primary-pc-healing';
  const selfHealing = !area && support?.selfHealing === true;
  const authoredImmediate = !area && !condition && !bundle && !composed && String(support?.definitionId || '').startsWith('authored:');
  // Effect cooldowns (review F1): the caster-start cooldown route is one placed creature only; the server refuses a PC target.
  const cooldownRoute = support?.cooldown?.type === COOLDOWN_TYPE;
  const isHiddenFromOwner = token => Boolean(token?.state?.hiddenFromPlayers || token?.hiddenFromPlayers || token?.state?.isHidden || token?.isHidden);
  const candidates = owner && support?.supported && source.token ? all.filter(token => refOf(token) && token.mapId === source.mapId && !isHiddenFromOwner(token) &&
    (selfHealing ? sameExactRef(refOf(token), source.ref) && refOf(token).kind === 'character' && token.state?.actorContract?.primary
      : (!(condition || bundle || composed || pcHealing || area || authoredImmediate || channeled) || !sameExactRef(refOf(token), source.ref)) &&
        (pcHealing ? refOf(token).kind === 'character' && token.state.actorContract.primary
          : composed || formula || area || isOutcomeSpell || channeled || support?.saveTerms || support?.isHunterFlow ? refOf(token).kind === 'creature'
            : bundle ? refOf(token).kind === 'creature' || (!cooldownRoute && !support.classPaymentSpec && token.state.actorContract.primary && pcConsent(support.effectTerms, 'character').ok)
              : refOf(token).kind === 'creature' || token.state.actorContract.primary))) : [];
  // M6A: visibility filter before any preview/candidate classification; GM visibility never authorizes owner disclosure.
  const visibleForOwner = (r, token) =>
    !isHiddenFromOwner(token) &&
    (useCombatFeedStore.getState().rendered[actorKey(r)] || 0) > 0;
  const isLineArea = area && support?.areaTerms?.aoeShape === 'line';
  const areaEntries = owner && support?.supported && area && source.token ? all.map(token => {
    const r = refOf(token);
    const catalog = area && token?.state?.actorContract && !token.size && !token.footprint && !token.stats?.size && roomGameState
      ? (roomGameState.maps?.[r?.mapId || source.mapId]?.creatures || roomGameState.combat?.creatures || roomGameState.creatures)
      : creatureDefs;
    return {
      token,
      name: () => nameOf(token),
      footprint: () => r?.kind === 'character' ? { width: 1, height: 1 } : tokenFootprintForArea(token, catalog)
    };
  }) : [];
  // Creator rule (2026-11-19): a Line starts at the caster's current position; no stale preview or saved origin is reused.
  const activeOrigin = isLineArea && source.token?.position ? source.token.position
    : owner && aoeSession?.action?.id === owner.spellId && aoeSession?.origin ? aoeSession.origin : areaOrigin;
  const activeTarget = owner && aoeSession?.action?.id === owner.spellId && aoeSession?.target ? aoeSession.target : areaTarget;
  const radiusWorld = area && !isLineArea && Number.isFinite(gridSize) && Number.isFinite(feetPerTile) && feetPerTile > 0
    ? support.areaTerms.radiusFeet / feetPerTile * gridSize : 0;
  const lengthWorld = isLineArea && Number.isFinite(gridSize) && Number.isFinite(feetPerTile) && feetPerTile > 0
    ? support.areaTerms.lengthFeet / feetPerTile * gridSize : 0;
  const widthWorld = isLineArea && Number.isFinite(gridSize) && Number.isFinite(feetPerTile) && feetPerTile > 0
    ? support.areaTerms.widthFeet / feetPerTile * gridSize : 0;
  const classifiedArea = owner && support?.supported && area && source.ref ? classifyAreaTokens(areaEntries, {
    visible: visibleForOwner,
    aoeShape: isLineArea ? 'line' : 'circle',
    origin: activeOrigin,
    target: activeTarget,
    radius: radiusWorld,
    length: lengthWorld,
    width: widthWorld,
    gridSize,
    offsetX: gridOffsetX,
    offsetY: gridOffsetY,
    mapId: source.mapId,
    sourceRef: source.ref
  }) : [];
  const areaCreatureCandidates = classifiedArea.filter(item => item.eligibleCreature);
  const restriction = support?.targetingRestriction || support?.areaTerms?.restriction || null;
  const needsRelationshipCheck = typeof readTargetRelationship === 'function' && (restriction === 'ally' || restriction === 'enemy');
  const rawRefsToQuery = owner && support?.supported && needsRelationshipCheck && roomId && source.ref && !source.error
    ? (area ? areaCreatureCandidates.map(item => item.ref) : candidates.map(token => refOf(token)))
      .filter(r => r && !sameExactRef(r, source.ref))
    : [];
  const refsToQuery = [];
  const seenQueryKeys = new Set();
  for (const r of rawRefsToQuery) {
    const k = ownerTargetKey(r);
    if (!seenQueryKeys.has(k)) { seenQueryKeys.add(k); refsToQuery.push(r); }
  }
  const queryRefsKey = refsToQuery.map(ownerTargetKey).join(',');
  const scopeKey = `${roomId || ''}|${owner?.spellId || ''}|${support?.definitionHash || ''}|${source.ref ? ownerTargetKey(source.ref) : ''}|${restriction || ''}|${relationshipRevision}|${relRetry}`;
  useEffect(() => {
    if (!owner || !support?.supported || !needsRelationshipCheck || !roomId || !source.ref || source.error) {
      return undefined;
    }
    if (!refsToQuery.length) {
      setRelState({ scopeKey, entries: {} });
      return undefined;
    }
    let cancelled = false;
    setRelState({
      scopeKey,
      entries: Object.fromEntries(refsToQuery.map(r => [ownerTargetKey(r), { status: 'loading' }]))
    });
    Promise.all(
      refsToQuery.map(async ref => {
        const key = ownerTargetKey(ref);
        try {
          const res = await readTargetRelationship(roomId, source.ref, ref);
          if (cancelled) return;
          const entry = res?.success && ['ally', 'enemy', 'neutral'].includes(res.value)
            ? { status: 'ready', value: res.value, revision: res.revision }
            : { status: 'error', error: res?.code || 'query_failed' };
          setRelState(prev => (prev.scopeKey !== scopeKey
            ? prev
            : { scopeKey, entries: { ...prev.entries, [key]: entry } }));
        } catch (err) {
          if (cancelled) return;
          setRelState(prev => (prev.scopeKey !== scopeKey
            ? prev
            : { scopeKey, entries: { ...prev.entries, [key]: { status: 'error', error: err?.message || 'query_failed' } } }));
        }
      })
    );
    return () => { cancelled = true; };
    // scopeKey and queryRefsKey capture all primitive dependencies for this query batch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeKey, queryRefsKey]);
  const ctx = owner && source.ref ? spellDraftContext({ characterId: character.currentCharacterId, sourceRef: source.ref, spellId: owner.spellId }) : null;
  const relEntriesForSync = relState.scopeKey === scopeKey ? relState.entries : {};
  const lineAimEps = Number.isFinite(gridSize) && gridSize > 0 ? gridSize * 1e-8 : 1e-6;
  const autoLineCandidates = isLineArea && activeOrigin && activeTarget &&
    Math.hypot(activeTarget.x - activeOrigin.x, activeTarget.y - activeOrigin.y) > lineAimEps &&
    (!needsRelationshipCheck || !areaCreatureCandidates.some(item => item.status === 'candidate' && relEntriesForSync[ownerTargetKey(item.ref)]?.status === 'loading'))
    ? areaCreatureCandidates.filter(item =>
      item.status === 'candidate' &&
      (!needsRelationshipCheck || relEntriesForSync[ownerTargetKey(item.ref)]?.value === restriction)
    ).map(item => pickKey(item.ref))
    : null;
  const autoLineKeysSig = autoLineCandidates ? JSON.stringify(autoLineCandidates) : '';
  useEffect(() => {
    if (!owner || !isLineArea || !autoLineCandidates) return;
    if (unresolvedSpell(loadLatestSpell())) return;
    if (JSON.stringify(targetKeys) !== autoLineKeysSig) {
      setTargetKeys(autoLineCandidates);
      const latestDraft = loadSpellDraft();
      const matchDraft = latestDraft && ctx && sameDraftContext(latestDraft.context, ctx) ? latestDraft : null;
      if (matchDraft) {
        try {
          saveSpellDraft({ context: ctx, label: matchDraft.label, roll: matchDraft.roll, targetKey: '', targetKeys: autoLineCandidates, areaOrigin: activeOrigin, areaTarget: activeTarget });
        } catch (_) { /* ignore draft sync error */ }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner, isLineArea, autoLineKeysSig]);
  const isLowestHpTarget = !area && support?.targetingSelectionMethod === 'lowest_health' && Number.isFinite(support?.targetingRangeFeet) && support.targetingRangeFeet > 0;
  const lowestHpCreatures = isLowestHpTarget ? candidates.filter(token => refOf(token)?.kind === 'creature') : [];
  const lowestHpRelLoading = isLowestHpTarget && needsRelationshipCheck && lowestHpCreatures.some(token => !sameExactRef(refOf(token), source.ref) && relEntriesForSync[ownerTargetKey(refOf(token))]?.status === 'loading');
  const lowestHpRelError = isLowestHpTarget && needsRelationshipCheck && lowestHpCreatures.some(token => !sameExactRef(refOf(token), source.ref) && relEntriesForSync[ownerTargetKey(refOf(token))]?.status === 'error');
  const lowestHpEval = owner && isLowestHpTarget && source.token && !lowestHpRelLoading && !lowestHpRelError
    ? evaluateLowestHealthCandidates({
        sourcePos: source.token.position,
        rangeFeet: support.targetingRangeFeet,
        restriction,
        gridSize,
        feetPerTile,
        candidates: lowestHpCreatures.map(token => ({
          key: ownerTargetKey(refOf(token)),
          kind: 'creature',
          position: token.position,
          currentHp: token.state?.currentHp,
          hidden: isHiddenFromOwner(token),
          relationship: relEntriesForSync[ownerTargetKey(refOf(token))]?.value || 'neutral'
        }))
      })
    : null;
  const lowestHpAllowedKeys = lowestHpEval?.ok ? lowestHpEval.lowest.map(item => item.key) : [];
  const lowestHpAllowedSig = JSON.stringify(lowestHpAllowedKeys);
  useEffect(() => {
    if (!owner || !isLowestHpTarget || lowestHpRelLoading || lowestHpRelError || !lowestHpEval) return;
    if (unresolvedSpell(loadLatestSpell())) return;
    const syncLowestHpTarget = nextKey => {
      setTargetKey(nextKey);
      const latestDraft = loadSpellDraft();
      const matchDraft = latestDraft && ctx && sameDraftContext(latestDraft.context, ctx) ? latestDraft : null;
      if (matchDraft) {
        try {
          saveSpellDraft({ context: ctx, label: matchDraft.label, roll: matchDraft.roll, targetKey: nextKey });
        } catch (_) { /* ignore draft sync error */ }
      }
    };
    if (!lowestHpEval.ok) {
      if (targetKey !== '') syncLowestHpTarget('');
    } else if (lowestHpAllowedKeys.length === 1) {
      if (targetKey !== lowestHpAllowedKeys[0]) syncLowestHpTarget(lowestHpAllowedKeys[0]);
    } else if (targetKey && !lowestHpAllowedKeys.includes(targetKey)) {
      syncLowestHpTarget('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner, isLowestHpTarget, lowestHpRelLoading, lowestHpRelError, lowestHpEval?.ok, lowestHpAllowedSig]);
  if (!owner) return null;
  const relEntries = relState.scopeKey === scopeKey ? relState.entries : {};
  const cooldownState = support?.cooldown?.type === COOLDOWN_TYPE && source.ref
    ? cooldownStatus(source.token, combat, source.ref, support.cooldown.definitionId) : null;
   const target = candidates.find(token => ownerTargetKey(refOf(token)) === targetKey);
  const targetRel = target && needsRelationshipCheck && !sameExactRef(refOf(target), source.ref)
    ? relationshipReason(restriction, relEntries[ownerTargetKey(refOf(target))])
    : null;
  const targetRelationshipBlocked = Boolean(targetRel && !targetRel.eligible);
  const invalidAreaSelections = area && needsRelationshipCheck
    ? areaCreatureCandidates.filter(item =>
      targetKeys.includes(pickKey(item.ref)) &&
      !sameExactRef(item.ref, source.ref) &&
      relEntries[ownerTargetKey(item.ref)]?.status === 'ready' &&
      relEntries[ownerTargetKey(item.ref)]?.value !== restriction)
    : [];
  const unverifiedAreaSelections = area && needsRelationshipCheck
    ? areaCreatureCandidates.filter(item =>
      targetKeys.includes(pickKey(item.ref)) &&
      !sameExactRef(item.ref, source.ref) &&
      relEntries[ownerTargetKey(item.ref)]?.status !== 'ready')
    : [];
  const hasAreaRelError = area && needsRelationshipCheck &&
    areaCreatureCandidates.some(item => !sameExactRef(item.ref, source.ref) && relEntries[ownerTargetKey(item.ref)]?.status === 'error');
  const latest = loadLatestSpell();
  const pending = unresolvedSpell(latest);
  const acceptedCandidate = (status?.phase === 'accepted' && status?.latest?.approval?.spell?.definitionId === owner?.spellId) ? status.latest.approval : (!status && latest?.phase === 'accepted' && latest?.approval?.spell?.definitionId === owner?.spellId ? latest.approval : null);
  const acceptedApproval = acceptedCandidate && acceptedCandidate.approvalId !== owner?.priorAcceptedApprovalId ? acceptedCandidate : null;
  const acceptedCurrent = Boolean(acceptedApproval);
  const perform = async action => { setBusy(true); setError(''); try { await action(); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  // P12C-B1 §2: the recorded roll lives in a draft bound to this owner, character, attachment and spell.
  const draft = loadSpellDraft(), draftHere = draft && ctx && sameDraftContext(draft.context, ctx) ? draft : null;
  const draftElsewhere = draft && !draftHere ? draft : null;
  const statusApprovalForDraft = status?.latest?.approval && status.latest.approval.spell?.definitionId === owner?.spellId && status.latest.approval.approvalId !== owner?.priorAcceptedApprovalId ? status.latest.approval : null;
  const draftOutcome = draftHere?.outcome || (acceptedApproval && isOutcome(acceptedApproval) ? acceptedApproval.outcome : statusApprovalForDraft && isOutcome(statusApprovalForDraft) ? statusApprovalForDraft.outcome : null);
  const draftBranch = draftHere?.chosenBranch || (acceptedApproval && isOutcome(acceptedApproval) ? acceptedApproval.chosenBranch : statusApprovalForDraft && isOutcome(statusApprovalForDraft) ? statusApprovalForDraft.chosenBranch : null);
  const branchReading = isOutcomeSpell && draftBranch ? readBranchFormula(draftBranch.effect.formula) : null;
  const branchDeterministic = Boolean(isOutcomeSpell && branchReading && branchReading.dice.length === 0);
  const activeReading = isOutcomeSpell ? branchReading : support?.reading;
  const roll = acceptedCurrent ? acceptedApproval.roll : deterministic && support?.supported ? recordRoll('deterministic', support.reading, []) : branchDeterministic && draftBranch ? rollBranchEffect(draftBranch, { mode: 'digital' }) : draftHere?.roll || null;
  const selectCandidates = isLowestHpTarget ? (lowestHpEval?.ok ? candidates.filter(token => lowestHpAllowedKeys.includes(ownerTargetKey(refOf(token)))) : []) : candidates;
  const ownerCritGate = bundle ? critGateOf(support.effectTerms) : null;
  const ownerCritMet = Boolean(ownerCritGate && roll && isCriticalRoll(roll));
  const resolveOutcome = mode => {
    try {
      const table = support.outcomeTable;
      let resolvedOutcome;
      if (table.mechanic === 'dice') {
        resolvedOutcome = rollOutcomeDie(table.spec.sides, { mode, face: outcomePhysical.face });
      } else {
        const coinCount = table.spec.count;
        const flips = Array.from({ length: coinCount }, (_, idx) => outcomePhysical.flips[idx] || 'heads');
        resolvedOutcome = flipOutcomeCoins(coinCount, { mode, flips });
      }
      const matched = resolveBranch(table, resolvedOutcome);
      if (!matched.ok) throw Error(matched.reason);
      const branchFormulaReading = readBranchFormula(matched.branch.effect.formula);
      const autoRoll = branchFormulaReading.dice.length === 0 ? rollBranchEffect(matched.branch, { mode: 'digital' }) : null;
      saveSpellDraft({ context: ctx, label: support.name, outcome: matched.outcome, chosenBranch: matched.branch, roll: autoRoll, targetKey, targetKeys, areaOrigin, areaTarget });
      setError('');
    } catch (e) { setError(e.message); }
  };
  const record = mode => {
    try {
      if (!activeReading) throw Error(isOutcomeSpell ? 'Resolve the outcome roll or coin flip first.' : 'Formula reading unavailable.');
      const value = mode === 'digital' ? digitalRoll(activeReading) : recordRoll('physical', activeReading, activeReading.dice.map((group, i) => Array.from({ length: group.count }, (_, j) => Number(physical[`${i}:${j}`]))));
      saveSpellDraft({ context: ctx, label: support.name, roll: value, outcome: draftHere?.outcome, chosenBranch: draftHere?.chosenBranch, targetKey, targetKeys, areaOrigin, areaTarget }); setError('');
    } catch (e) { setError(e.message); }
  };
  const chooseTarget = value => { setTargetKey(value); if (draftHere) { try { saveSpellDraft({ context: ctx, label: draftHere.label, roll: draftHere.roll, outcome: draftHere.outcome, chosenBranch: draftHere.chosenBranch, targetKey: value }); } catch (e) { setError(e.message); } } };
  const overlappingCreatures = areaCreatureCandidates.filter(item =>
    item.status === 'candidate' &&
    (!needsRelationshipCheck || sameExactRef(item.ref, source.ref) ||
      relEntries[ownerTargetKey(item.ref)]?.status !== 'ready' ||
      relEntries[ownerTargetKey(item.ref)]?.value === restriction)
  );
  const maxAreaCap = area ? Math.min(MAX_AREA_TARGETS, support.areaTerms?.maxTargets || MAX_AREA_TARGETS) : MAX_AREA_TARGETS;
  const selectedAreaRefs = area ? targetKeys.map(k => areaCreatureCandidates.find(item => pickKey(item.ref) === k)?.ref).filter(Boolean) : [];
  const unavailableAreaTargets = area && selectedAreaRefs.length !== targetKeys.length;
  const capacityExceeded = area && (targetKeys.length > maxAreaCap || overlappingCreatures.length > maxAreaCap);
  const lineHasAim = !isLineArea || (!!activeOrigin && !!activeTarget && Math.hypot(activeTarget.x - activeOrigin.x, activeTarget.y - activeOrigin.y) > lineAimEps);
  const circleHasOrigin = isLineArea || (!!activeOrigin && Number.isFinite(activeOrigin.x) && Number.isFinite(activeOrigin.y));
  const syncAreaDraft = (nextKeys, nextOrigin, nextTarget) => {
    setTargetKeys(nextKeys);
    if (nextOrigin !== undefined) setAreaOrigin(nextOrigin);
    if (nextTarget !== undefined) setAreaTarget(nextTarget);
    if (draftHere) {
      try {
        saveSpellDraft({
          context: ctx,
          label: draftHere.label,
          roll: draftHere.roll,
          targetKey: '',
          targetKeys: nextKeys,
          areaOrigin: nextOrigin !== undefined ? nextOrigin : activeOrigin,
          areaTarget: nextTarget !== undefined ? nextTarget : activeTarget
        });
      } catch (e) { setError(e.message); }
    }
  };
  const toggleAreaTarget = keyStr => {
    if (isLineArea) return;
    const next = targetKeys.includes(keyStr) ? targetKeys.filter(k => k !== keyStr) : [...targetKeys, keyStr];
    syncAreaDraft(next);
  };
  const applyPlacedOrigin = (nextOrigin, nextTarget) => {
    const effOrigin = nextOrigin || activeOrigin;
    const effTarget = nextTarget !== undefined ? nextTarget : activeTarget;
    if (!effOrigin || !Number.isFinite(effOrigin.x) || !Number.isFinite(effOrigin.y)) return;
    const nextClassified = classifyAreaTokens(areaEntries, {
      visible: visibleForOwner,
      aoeShape: isLineArea ? 'line' : 'circle',
      origin: effOrigin,
      target: effTarget,
      radius: radiusWorld,
      length: lengthWorld,
      width: widthWorld,
      gridSize,
      offsetX: gridOffsetX,
      offsetY: gridOffsetY,
      mapId: source.mapId,
      sourceRef: source.ref
    });
    const autoKeys = nextClassified
      .filter(item => item.eligibleCreature && item.status === 'candidate' &&
        (!needsRelationshipCheck || relEntries[ownerTargetKey(item.ref)]?.status !== 'ready' || relEntries[ownerTargetKey(item.ref)]?.value === restriction))
      .map(item => pickKey(item.ref));
    syncAreaDraft(
      autoKeys,
      { x: effOrigin.x, y: effOrigin.y },
      effTarget && Number.isFinite(effTarget.x) && Number.isFinite(effTarget.y) ? { x: effTarget.x, y: effTarget.y } : undefined
    );
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
      initialOrigin: isLineArea ? { x: source.token.position.x, y: source.token.position.y } : activeOrigin || { x: source.token.position.x, y: source.token.position.y },
      initialTarget: activeTarget || null,
      origin: activeOrigin || { x: source.token.position.x, y: source.token.position.y },
      placing: true,
      confirmed: false,
      context: captureActorDelivery(),
      onConfirmArea: ({ origin, target }) => applyPlacedOrigin(origin, target)
    });
  };
  const rangeFeet = area ? Number(support?.areaTerms?.rangeFeet) : Number(support?.raw?.targetingConfig?.rangeDistance);
  const rangeLabel = Number.isFinite(rangeFeet) && rangeFeet > 0
    ? (isLineArea ? `area line ${support.areaTerms.lengthFeet}×${support.areaTerms.widthFeet} ft · starts at the caster`
      : area ? `area circle ${support.areaTerms.radiusFeet}-ft radius · ${rangeFeet}-ft placement range`
      : `card range ${rangeFeet} ft (${support.raw?.targetingConfig?.rangeType || 'authored'})`)
    : '';
  const pick = () => startTargetPick({ id: 'p9-spell', label: support.name, sourceRef: source.ref, candidates: selectCandidates.map(token => refOf(token)), rangeFeet, rangeLabel,
     reasonFor: ref => {
       if (needsRelationshipCheck && ref && !sameExactRef(ref, source.ref)) {
         const rel = relationshipReason(restriction, relEntries[ownerTargetKey(ref)]);
         if (rel && !rel.eligible) return rel.text;
       }
       if (isLowestHpTarget && !lowestHpAllowedKeys.includes(ownerTargetKey(ref))) return 'Not among the lowest base HP eligible targets in range.';
       return 'Not an exact bound target for this spell (creatures and primary characters on your map).';
     }, onPick: value => chooseTarget(ownerTargetKey(value)), onCancel: () => {} });
  const discarded = loadDiscardedSpellDrafts();
  if (picking || (area && aoeSession?.placing && aoeSession?.action?.id === owner.spellId)) return null; // the panel steps aside while picking/placing on the map; its state is kept
  const ownerCandidates = all.filter(token => token.state?.actorContract?.primary && token.ownerUserId && refOf(token)?.characterId === character.currentCharacterId);
  const pools = source.token ? sourcePools(source.token) : null;
  const expectedClassDomain = support?.payment?.domain && support.payment.domain !== 'none';
  const classTermsOk = !expectedClassDomain || !support?.payment?.affordable || (!!support.payment.classPayment && hasValidClassPayment(support.payment.classPayment));
  const authoritativeTermsOk = !!support?.supported && hasValidPrice(support.price) && !!support.payment && classTermsOk;
  const blockers = [];
  if (support?.supported && !pending) {
    if (!authoritativeTermsOk) blockers.push('Authoritative payment terms are unavailable; no total is invented.');
    if (source.error) blockers.push(source.error);
    if (draftElsewhere) blockers.push('An unsent recorded roll is retained for another spell; cast it from that spell or discard it explicitly.');
    if (cooldownState?.blocked) blockers.push(cooldownState.label);
    if (!support.payment?.affordable) blockers.push(support.payment?.reason || 'Insufficient class resource.');
    blockers.push(...poolInsufficiencyReasons(pools, support.price));
    if (area) {
      if (isLineArea && !lineHasAim) blockers.push('Aim the line direction on the map first (it starts at the caster).');
      if (!isLineArea && !circleHasOrigin) blockers.push('Place the circle on the map first.');
      if (unavailableAreaTargets) blockers.push('A selected area target is unavailable or replaced.');
      if (selectedAreaRefs.length < 1) blockers.push('Place the area and select at least 1 creature target.');
      if (capacityExceeded) blockers.push(`Area target capacity exceeded (maximum ${maxAreaCap} creature targets).`);
      if (invalidAreaSelections.length > 0) blockers.push(`${restriction === 'ally' ? 'This spell requires an ally.' : 'This spell requires an enemy.'} Deselect ineligible target(s): ${invalidAreaSelections.map(item => item.name).join(', ')}.`);
      if (unverifiedAreaSelections.length > 0) blockers.push(`Target relationship verification is pending or failed for: ${unverifiedAreaSelections.map(item => item.name).join(', ')}.`);
    } else if (!source.error) {
      if (isLowestHpTarget && lowestHpRelLoading) blockers.push('Checking authoritative target relationships before lowest-HP ranking.');
      else if (isLowestHpTarget && lowestHpRelError) blockers.push('Could not verify target relationships for lowest-HP ranking.');
      else if (isLowestHpTarget && lowestHpEval && !lowestHpEval.ok) blockers.push(lowestHpEval.code === 'manual_targeting_geometry_required' ? 'Caster and target tokens need valid grid positions to verify lowest-HP range.' : `No eligible creature target within ${support.targetingRangeFeet} ft range.`);
      else if (!target) blockers.push(targetKey ? 'Selected target is missing, replaced, or no longer eligible.' : 'Select an exact bound target.');
      else if (targetRelationshipBlocked) blockers.push(targetRel.text);
    }
    if (isOutcomeSpell && !draftOutcome) blockers.push(`Resolve the ${support.outcomeTable.mechanic === 'coin' ? 'fair coin flip' : `1d${support.outcomeTable.spec.sides} roll`} outcome before approving.`);
    else if (isOutcomeSpell && draftBranch && !branchDeterministic && !roll) blockers.push(`Record a roll for "${draftBranch.label}" (${branchReading?.reading || draftBranch.effect.formula}) before approving.`);
    else if (!isOutcomeSpell && needsRoll && !deterministic && !roll) blockers.push('Record a digital or physical roll before approving.');
    if (formula && roll && roll.reading !== support.reading.reading) blockers.push('Caster scores changed; review with retained faces before approving.');
  }
  const statusSummary = status ? ownerPaymentState(status) : null;
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
      {owner.triggerOfferId && <p className="p9-note" role="status">Using follow-up offer {owner.triggerOfferId.slice(0, 8)}…: this cast is optional, pays its own listed price and cooldown, and uses its own target. If the offer lapses or is revoked, nothing is cast and nothing is paid.</p>}
      {owner.origin?.producer?.startsWith('item: ') && <p>From {owner.origin.producer}. Item requirements remain GM-managed.</p>}
      {status && <div className="p9-status" role="status">
        <div className="p9-payment-summary" aria-label="Approval payment status">
          <p>
            <span className={['unknown', 'unresolved', 'reapproval'].includes(status.phase) ? 'p9-action-badge' : 'p9-info-badge'}>
              {status.phase === 'unknown' ? 'Outcome unknown — check approval' : status.phase === 'unresolved' ? 'Unresolved — reconcile with GM' : status.phase === 'reapproval' ? 'Needs your action' : ['awaiting', 'prepared', 'syncing'].includes(status.phase) ? 'Awaiting GM' : 'Status'}
            </span>
            {' '}<strong>Payment status:</strong> {statusSummary.stateLabel}
          </p>
          {status.latest?.approval && (
            hasValidPrice(status.latest.approval.price) && hasValidClassPayment(status.latest.approval.classPayment)
              ? <p>Approved cost: {status.latest.approval.price.ap} AP · {status.latest.approval.price.mana} mana{classPriceNote(status.latest.approval.classPayment)}</p>
              : <p className="p9-diagnostic">Authoritative payment terms unavailable; no total is invented.</p>
          )}
          {status.latest?.approval?.triggerOfferId && <p>Triggered follow-up: normal cost still applies.</p>}
          {statusSummary.receiptId && <p>Authoritative receipt: {statusSummary.receiptId} ({statusSummary.durability})</p>}
        </div>
        <p>{status.message}</p>
        <p className="p9-meta">Next action: {statusSummary.nextAction}</p>
        {(status.latest?.approval || status.latest?.approval?.effectTerms || status.latest?.approval?.conditionTerms || status.latest?.approval?.channelTerms) && (
          <details className="p9-tech-disclosure">
            <summary>Approval &amp; custody details</summary>
            {status.latest?.approval && <p className="p9-meta">Approval {status.latest.approval.approvalId} · {status.latest.custody}</p>}
            {status.latest?.approval?.effectTerms && <p>Retained owner-approved terms: {status.latest.approval.spell.name} · source {status.latest.approval.source.tokenId}/{status.latest.approval.source.instanceId} → target {status.latest.approval.target.tokenId}/{status.latest.approval.target.instanceId} · {hasValidPrice(status.latest.approval.price) ? `${status.latest.approval.price.ap} AP / ${status.latest.approval.price.mana} mana` : 'authoritative price unavailable'} · {describeEffect(status.latest.approval.effectTerms)}.</p>}
            {status.latest?.approval?.conditionTerms && <p>Retained owner-approved terms: {status.latest.approval.spell.name} · source {status.latest.approval.source.tokenId}/{status.latest.approval.source.instanceId} → target {status.latest.approval.target.tokenId}/{status.latest.approval.target.instanceId} · {hasValidPrice(status.latest.approval.price) ? `${status.latest.approval.price.ap} AP / ${status.latest.approval.price.mana} mana` : 'authoritative price unavailable'} · canonical Stunned · {status.latest.approval.conditionTerms.timing.durationText} — GM removes.</p>}
            {status.latest?.approval?.channelTerms && <p>Retained owner-approved terms: {status.latest.approval.spell.name} · source {status.latest.approval.source.tokenId}/{status.latest.approval.source.instanceId} → target {status.latest.approval.target.tokenId}/{status.latest.approval.target.instanceId} · {hasValidPrice(status.latest.approval.price) ? `${status.latest.approval.price.ap} AP / ${status.latest.approval.price.mana} mana` : 'authoritative price unavailable'} · {describeChanneled(status.latest.approval.channelTerms)}.</p>}
          </details>
        )}
        {['awaiting', 'unknown', 'prepared'].includes(status.phase) && <button type="button" disabled={busy} onClick={() => perform(checkSpellApproval)}>Check this same approval</button>}
        {['awaiting', 'unknown'].includes(status.phase) && <button type="button" disabled={busy} onClick={() => perform(withdrawSpellApproval)}>Withdraw before acceptance</button>}
         {status.phase === 'reapproval' && <button type="button" disabled={busy} onClick={() => perform(reapproveSpell)}>{condition || bundle || channeled ? 'Review changed terms before fresh approval' : formula ? 'Approve displayed scores again (retained faces)' : 'Review and approve again (same roll)'}</button>}
        {status.phase === 'unresolved' && <button type="button" disabled={busy} onClick={() => markSpellReconciled()}>Reconciled with the GM — clear this approval</button>}
      </div>}
      {!support?.supported ? <p className="p9-diagnostic">{support?.reason}</p> : <>
        <details className="p9-tech-disclosure">
          <summary>Technical &amp; attestation details</summary>
          <p className="p9-note">Supported room ability: nothing is spent until the GM accepts. {area ? 'M6A bounded area execution: one source payment, one shared roll (GM adjudicates each creature target’s final amount), and one atomic multi-actor result.' : composed ? 'Partially automated: one approved price, target and roll; the GM records one of the outcomes listed below.' : channeled ? 'One approved upfront price, target, range and caster-turn schedule; each due tick waits for separate GM resolution.' : bundle ? 'One approved price, target, effect bundle and duration; one GM-confirmed result.' : condition ? 'One approved price and duration, one successful canonical condition.' : 'One roll, one payment, one result.'}</p>
          {formula && <p className="p9-note">Caster effective scores are owner-attested: {Object.entries(support.rollAttributes).map(([name, value]) => `${name} ${value}`).join(', ') || 'no attributes'}. The server verifies the calculation, not the sheet-derived scores. Caster changes require approval again{deterministic ? ' with a recalculated proposal' : ' with these same faces'}; the GM adjudicates range, saves and mitigation.</p>}
          {support.rollHealth && <p className="p9-note">Authoritative caster base HP {support.rollHealth.current}/{support.rollHealth.max} · missing {Math.max(0, support.rollHealth.max - support.rollHealth.current)}. Temporary HP excluded. Bound to {source.ref?.tokenId}/{source.ref?.instanceId}, revision {source.token?.state?.actorContract?.revision}; changed caster state requires fresh approval with retained faces.</p>}
        </details>
        <dl className="p9-facts">
          <dt>{composed || isOutcomeSpell || (bundle && saveOf(support.effectTerms)) ? 'Outcomes' : 'Effect'}</dt><dd>{isOutcomeSpell ? <ul className="p9-branches">{support.outcomeTable.branches.map(b => <li key={b.branchId}><strong>{describeMatcher(b.matcher, support.outcomeTable.mechanic, support.outcomeTable.spec.count)}</strong> ({b.label}): {describeBranchEffect(b.effect)}</li>)}</ul> : composed ? <ul className="p9-branches">{support.branchLines.map(line => <li key={line.branch}>{line.text}</li>)}</ul> : bundle && saveOf(support.effectTerms) ? <ul className="p9-branches">{effectBranchLines(support.effectTerms).map(line => <li key={line.branch}>{line.text}</li>)}</ul> : channeled ? describeChanneled(support.channelTerms) : bundle ? describeEffect(support.effectTerms) : condition ? `Canonical Stunned — ${STUNNED.description}` : `${support.kind === 'damage' ? `${support.damageTypes.join('/')} damage` : 'direct healing'} · ${support.reading.reading}`}</dd>
          {area && <><dt>Area</dt><dd>{isLineArea
            ? `Line ${support.areaTerms.lengthFeet}×${support.areaTerms.widthFeet} ft · starts at the caster · ${support.areaTerms.restriction} creatures · technical limit up to ${maxAreaCap} creature targets (9 actors max including caster)`
            : `Circle ${support.areaTerms.radiusFeet}-ft radius · ${support.areaTerms.rangeFeet}-ft placement range · ${support.areaTerms.restriction} creatures · technical limit up to ${maxAreaCap} creature targets (9 actors max including caster)`}</dd></>}
          {restriction && <><dt>Targeting</dt><dd>{RESTRICTION_LABELS[restriction] || restriction}</dd></>}
          {condition && <><dt>Timing</dt><dd>{support.timing.durationText} — GM removes. {support.timing.gmNote}</dd></>}{channeled && <><dt>Timing</dt><dd>{support.timing.durationText}. {support.timing.gmNote}</dd></>}
          {bundle && <><dt>Duration</dt><dd>{support.timing.durationText}. {automationText(support.timing, support.effectTerms?.condition, support.effectTerms?.direct)} {support.timing.gmNote}</dd></>}
          {bundle && saveOf(support.effectTerms) && <><dt>Save</dt><dd>{saveManualText(saveOf(support.effectTerms))} You approve both outcomes now; the GM records one of them and cannot substitute other terms. One creature target only.</dd></>}
          {support.saveTerms && <><dt>Outcomes</dt><dd><ul className="p9-branches">{directSaveLines(support.saveTerms, `${support.damageTypes.join('/')} damage ${support.reading.reading}`).map(line => <li key={line.branch}>{line.text}</li>)}</ul></dd>
            <dt>Save</dt><dd>{describeDirectSave(support.saveTerms)} You approve both outcomes now; the GM records one of them and cannot substitute other terms. One other creature target only.</dd></>}
          {composed && <><dt>Duration</dt><dd>“{support.effectTerms.timing.durationText}” — as authored. Not mapped to a turn boundary; the GM removes the exact instance.</dd>
            <dt>Formula</dt><dd>{support.reading.reading}</dd></>}
          <dt>Price</dt><dd>{authoritativeTermsOk ? <>{support.price.ap} AP · {support.price.mana} mana{classPriceNote(support.payment.classPayment)}{pools ? ` (temporary first; you have AP ${pools.ap.current}+${pools.ap.temp} temp, mana ${pools.mana.current}+${pools.mana.temp} temp)` : ''}</> : <span className="p9-diagnostic">Authoritative payment terms unavailable; no total is invented.</span>}</dd>
          {support.payment?.classPayment && hasValidClassPayment(support.payment.classPayment) && <><dt>Class</dt><dd>{describeClassPublic(support.payment.classPayment.before)} → {describeClassPublic(support.payment.classPayment.after)}</dd></>}
          {support.cooldown.value > 0 && <><dt>Cooldown</dt><dd>{support.cooldown.type === COOLDOWN_TYPE ? <>{cooldownProcedure(support.cooldown.value)}{bundle ? cooldownSeparation(support.effectTerms?.condition) : ''} <strong role="status">{cooldownState?.label || 'Select the exact owner attachment to view availability.'}</strong></> : `${support.cooldown.value} (${support.cooldown.type}) — starts when the GM accepts`}</dd></>}
        </dl>
        {composed && <ClassDisclosure disclosure={support.disclosure} />}
        {!support.payment?.affordable && <p className="p9-diagnostic">{support.payment?.reason}</p>}
        {!pending && (
          <section className="p9-payment-summary" aria-label="Proposed payment summary">
            <p><strong>Payment status:</strong> Proposed cost — not yet paid.</p>
            {owner.triggerOfferId && <p>Triggered follow-up: normal cost still applies.</p>}
            {blockers.length > 0 && (
              <div className="p9-diagnostic" role="status">
                <p><strong>Why this cast cannot proceed:</strong></p>
                <ul>{blockers.map((reason, idx) => <li key={idx}>{reason}</li>)}</ul>
              </div>
            )}
          </section>
        )}
        {source.error ? <div className="p9-diagnostic"><p>{source.error}</p>
           {ownerCandidates.length === 1 && <button type="button" onClick={() => selectOwnerAttachment(refOf(ownerCandidates[0]))}>Use this owner attachment</button>}</div> : <>
          {(condition || bundle || owner.origin?.producer?.startsWith('item: ')) && <p>Source: {nameOf(source.token)} · selected primary owner PC · {source.ref.tokenId} / {source.ref.instanceId}</p>}
          {draftElsewhere && <div className="p9-diagnostic p12c-draft" role="alert"><p>An unsent recorded roll is retained for <strong>{describeDraft(draftElsewhere)}</strong>. A recorded roll never moves to another spell: cast it from that spell, or discard it explicitly.</p>
            <button type="button" disabled={busy} onClick={() => perform(async() => discardSpellDraft())}>Discard recorded roll</button></div>}
          {area ? <div className="m6a-area-section" aria-label="Area placement and creature target selection">
            <div className="p12c-pick">
              <button type="button" disabled={pending || busy || !source.ref} onClick={startAreaPlacement}>{isLineArea ? 'Aim line on map' : 'Place area on map'}</button>
              {source.token?.position && !isLineArea && <button type="button" disabled={pending || busy} onClick={() => applyPlacedOrigin(source.token.position, activeTarget)}>Center at caster</button>}
              <span className="p9-meta">{rangeLabel} — {isLineArea ? 'geometry is client preview only; eligibility, range and line of effect remain GM-adjudicated' : 'server verifies placed circle origin, range and targets; walls, line of effect and elevation remain GM-adjudicated'}</span>
            </div>
            {activeOrigin && source.token?.position && Number.isFinite(gridSize) && Number.isFinite(feetPerTile) && (
              <p className="p9-advisory" role="status">
                {isLineArea
                  ? <>Line starts at the caster ({Math.round(activeOrigin.x)}, {Math.round(activeOrigin.y)}){lineHasAim ? ` → aim (${Math.round(activeTarget.x)}, ${Math.round(activeTarget.y)})` : ' · aim direction needed'}.</>
                  : <>Placed circle origin ({Math.round(activeOrigin.x)}, {Math.round(activeOrigin.y)}) · planar distance {formatFeet(planarFeet(source.token.position, activeOrigin, gridSize, feetPerTile))} ft (authored {support.areaTerms.rangeFeet} ft).</>}
              </p>
            )}
            <p className="p9-note">
              Approved first-profile roll procedure: one shared roll proposes {roll ? <strong>{roll.total}</strong> : 'the base amount'} per selected creature target; the GM adjudicates each target’s final amount and adjustment reason before committing.
            </p>
            {isLineArea && (
              <p className="p9-note">
                Line targets are derived automatically from the aimed line geometry, range, visibility and targeting rules; re-aim the line on the map or click &ldquo;Aim line here&rdquo; to retarget.
              </p>
            )}
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
                    const geoBadge = (!activeOrigin || (isLineArea && !lineHasAim)) ? (isLineArea ? 'Aim line to evaluate overlap' : 'Place area to evaluate overlap')
                      : item.status === 'candidate' ? 'Geometric overlap (candidate)'
                      : item.status === 'edge' ? 'Edge/contact only — not geometrically included (GM decides)'
                      : item.status === 'manual' ? 'Unknown/off-grid footprint — GM decides'
                      : isLineArea ? 'Outside placed line' : 'Outside placed circle';
                    const itemRel = needsRelationshipCheck && item.eligibleCreature && !sameExactRef(item.ref, source.ref)
                      ? relationshipReason(restriction, relEntries[ownerTargetKey(item.ref)])
                      : null;
                    return (
                      <li key={keyStr}>
                        <label>
                          <input
                            type="checkbox"
                            disabled={!item.eligibleCreature || isLineArea}
                            checked={checked}
                            onChange={() => toggleAreaTarget(keyStr)}
                          />
                          {' '}<strong>{item.name}</strong> · {item.ref.kind} · {item.ref.tokenId} · <em>{geoBadge}</em>
                          {itemRel ? ` · ${itemRel.text}` : ''}
                          {item.excludedReason ? ` — ${item.excludedReason}` : ''}
                        </label>
                        {item.eligibleCreature && item.position && (
                          isLineArea
                            ? <button type="button" disabled={pending || busy} onClick={() => applyPlacedOrigin(activeOrigin || source.token.position, item.position)}>
                                Aim line here
                              </button>
                            : <button type="button" disabled={pending || busy} onClick={() => applyPlacedOrigin(item.position)}>
                                Place circle here
                              </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </fieldset>
            {selectedAreaRefs.length > 0 && (invalidAreaSelections.length > 0 || unverifiedAreaSelections.length > 0) && (
              <div className="p9-diagnostic" role="alert">
                {invalidAreaSelections.length > 0 && (
                  <p>{restriction === 'ally' ? 'This spell requires an ally.' : 'This spell requires an enemy.'} Selected ineligible target(s): {invalidAreaSelections.map(item => item.name).join(', ')}. Deselect them manually to continue; recorded dice and selections are preserved.</p>
                )}
                {unverifiedAreaSelections.length > 0 && (
                  <p>{hasAreaRelError ? 'Could not verify target relationship for selected target(s)' : 'Checking authoritative target relationship for selected target(s)'}: {unverifiedAreaSelections.map(item => item.name).join(', ')}.</p>
                )}
                {(hasAreaRelError || unverifiedAreaSelections.some(item => relEntries[ownerTargetKey(item.ref)]?.status === 'error')) && (
                  <button type="button" disabled={busy} onClick={() => setRelRetry(n => n + 1)}>Retry relationship check</button>
                )}
              </div>
            )}
            {unavailableAreaTargets && <div className="p9-diagnostic" role="alert">
              <p>A selected area target is unavailable or replaced. Review the target set before approving; recorded dice are retained.</p>
              <button type="button" disabled={pending || busy} onClick={() => syncAreaDraft(selectedAreaRefs.map(pickKey))}>Remove unavailable selections</button>
            </div>}
          </div> : <>
            <div className="p12c-pick"><button type="button" disabled={pending || busy || !source.ref || (isLowestHpTarget && !selectCandidates.length)} onClick={pick}>Pick on map</button><span className="p9-meta">{rangeLabel ? `${rangeLabel} — advisory` : 'No card range — GM adjudicates'}</span></div>
            {isLowestHpTarget && lowestHpRelLoading && <p className="p9-note" role="status">Checking authoritative target relationships before lowest-HP ranking…</p>}
            {isLowestHpTarget && !lowestHpRelLoading && lowestHpRelError && (
              <div className="p9-diagnostic" role="alert">
                <p>Could not verify target relationships for lowest-HP ranking.</p>
                <button type="button" disabled={busy} onClick={() => setRelRetry(n => n + 1)}>Retry relationship check</button>
              </div>
            )}
            {isLowestHpTarget && !lowestHpRelLoading && !lowestHpRelError && lowestHpEval && !lowestHpEval.ok && (
              <p className="p9-diagnostic" role="alert">{lowestHpEval.code === 'manual_targeting_geometry_required' ? 'Caster and target tokens need valid grid positions to verify lowest-HP range.' : `No eligible ${restriction === 'enemy' ? 'enemy ' : restriction === 'ally' ? 'ally ' : ''}creature in ${support.targetingRangeFeet} ft range.`}</p>
            )}
            {isLowestHpTarget && !lowestHpRelLoading && !lowestHpRelError && lowestHpEval?.ok && lowestHpEval.tied && (
              <p className="p9-note" role="status">Lowest base HP in range ({lowestHpEval.minHp} HP) is tied among {lowestHpEval.lowest.length} eligible targets — select one tied target below (tie-breaking is undecided).</p>
            )}
            {isLowestHpTarget && !lowestHpRelLoading && !lowestHpRelError && lowestHpEval?.ok && !lowestHpEval.tied && (
              <p className="p9-note" role="status">Auto-selected lowest base HP eligible target in {support.targetingRangeFeet} ft range ({lowestHpEval.minHp} HP; range, visibility and relationship filters applied before ranking).</p>
            )}
            <label>Target <select value={targetKey} disabled={pending || busy} onChange={event => chooseTarget(event.target.value)}>
              <option value="">Select an exact bound target</option>
              {selectCandidates.map(token => <option key={ownerTargetKey(refOf(token))} value={ownerTargetKey(refOf(token))}>{nameOf(token)} · {refOf(token).kind} · {token.id}{sameExactRef(refOf(token), source.ref) ? ' (you)' : relationshipOptionSuffix(restriction, relEntries[ownerTargetKey(refOf(token))])}</option>)}
             </select></label>
            {targetRel && (
              <div className={targetRel.eligible ? 'p9-note' : 'p9-diagnostic'} role={targetRel.eligible ? 'status' : 'alert'}>
                <p>{targetRel.text}</p>
                {targetRel.kind === 'error' && (
                  <button type="button" disabled={busy} onClick={() => setRelRetry(n => n + 1)}>Retry relationship check</button>
                )}
              </div>
            )}
            {targetKey && !target && <p className="p9-diagnostic" role="alert">The selected target is missing, replaced or no longer eligible. Select its exact current attachment and review again; nothing submitted.</p>}
            {bundle && (cooldownRoute || formula || !pcConsent(support.effectTerms, 'character').ok) && <p className="p9-diagnostic" role="alert">PC targets unavailable: {support.effectTerms?.condition?.kind === 'periodic' ? 'a periodic effect applies to one creature only; a player character target stays manual.' : cooldownRoute ? 'an ability with a caster-start cooldown applies to one placed creature only; a player character target stays manual.' : formula ? 'an attribute-scaled immediate part with an effect applies to one placed creature only; a player character target stays manual.' : pcConsent(support.effectTerms, 'character').message}</p>}
          </>}
          {target && <p className="p9-advisory">{advisoryRange(source.token, target, game, `${support.raw?.targetingConfig?.rangeType || ''} ${support.raw?.targetingConfig?.rangeDistance ?? '?'} ft`)} {resistanceText(target)}</p>}
          {target && pcHealing && <p className="p9-consent">Player character target. You approve your source price and this formula roll; the target's owner must separately accept the exact healing amount before the GM can install it.</p>}
           {target && condition && <p>Target: {nameOf(target)} · {refOf(target).tokenId} / {refOf(target).instanceId}. You approve the action and spending, not the target’s consent. Stunned is hostile by default: the GM can install successful Stunned without target acknowledgement, including offline. Voluntary applications require separate GM designation and target acceptance. The GM resolves eligibility, range, saves, immunity and success manually. Changed terms require fresh approval. Failed/unexecuted attempt costs remain manual.</p>}
          {target && bundle && refOf(target).kind === 'character' && <p className="p9-consent">Player character target. {consentText(pcConsent(support.effectTerms, 'character'))}</p>}
          {target && bundle && <p>Target: {nameOf(target)} · {refOf(target).tokenId} / {refOf(target).instanceId}. You approve the action, price, exact target, effect bundle and duration; changed terms need fresh approval. {bundleNote}</p>}
          {target && bundle && ownerCritGate && (
            <p className="p9-note" role="status">
              {!roll
                ? `Crit-gated follow-up (${conditionLabel(support.effectTerms.condition)}): triggers only if the recorded die rolls its maximum face value.`
                : ownerCritMet
                  ? `Critical hit (max die face): ${conditionLabel(support.effectTerms.condition)} will apply with this hit.`
                  : `Normal hit (not max die face): damage only — ${conditionLabel(support.effectTerms.condition)} will not apply.`}
            </p>
          )}
          {target && bundle && (!ownerCritGate || ownerCritMet) && <MovementOutcome terms={support.effectTerms} definitionId={owner.spellId} sourceRef={source.ref} targetToken={target} />}
          {target && bundle && (!ownerCritGate || ownerCritMet) && <AttributeOutcome terms={support.effectTerms} definitionId={owner.spellId} sourceRef={source.ref} targetToken={target} />}
          {target && bundle && (!ownerCritGate || ownerCritMet) && <DamageReductionOutcome terms={support.effectTerms} definitionId={owner.spellId} sourceRef={source.ref} targetToken={target} />}
          {target && composed && <p>Target: {nameOf(target)} · {refOf(target).tokenId} / {refOf(target).instanceId}. You approve the price, exact target, roll and every listed outcome, including what is not automated. Changed terms need fresh approval.</p>}
          {target && composed && <ClassRiderOutcome approval={PREVIEW_APPROVAL(support, source.ref, refOf(target))} targetToken={target} />}
          {isOutcomeSpell && !!target && !draftOutcome && !pending && !acceptedCurrent && !draftElsewhere && (
            <div className="p9-roll" aria-label="Outcome resolution">
              {support.outcomeTable.mechanic === 'dice' ? (
                <>
                  <button type="button" disabled={busy} onClick={() => resolveOutcome('digital')}>Roll 1d{support.outcomeTable.spec.sides} outcome</button>
                  <span>or physical 1d{support.outcomeTable.spec.sides}:</span>
                  <input aria-label="Outcome die face" type="number" min="1" max={support.outcomeTable.spec.sides} value={outcomePhysical.face} onChange={e => setOutcomePhysical({ ...outcomePhysical, face: e.target.value })} />
                  <button type="button" disabled={busy} onClick={() => resolveOutcome('physical')}>Record physical outcome die</button>
                </>
              ) : (
                <>
                  <button type="button" disabled={busy} onClick={() => resolveOutcome('digital')}>Flip {support.outcomeTable.spec.count} fair coin{support.outcomeTable.spec.count === 1 ? '' : 's'}</button>
                  <span>or physical:</span>
                  {Array.from({ length: support.outcomeTable.spec.count }, (_, idx) => (
                    <select key={idx} aria-label={`Physical coin ${idx + 1}`} value={outcomePhysical.flips[idx] || 'heads'} onChange={e => {
                      const nextFlips = Array.from({ length: support.outcomeTable.spec.count }, (_, j) => outcomePhysical.flips[j] || 'heads');
                      nextFlips[idx] = e.target.value;
                      setOutcomePhysical({ ...outcomePhysical, flips: nextFlips });
                    }}>
                      <option value="heads">Heads</option>
                      <option value="tails">Tails</option>
                    </select>
                  ))}
                  <button type="button" disabled={busy} onClick={() => resolveOutcome('physical')}>Record physical coin flip</button>
                </>
              )}
            </div>
          )}
          {isOutcomeSpell && draftOutcome && draftBranch && (
            <p className="p9-roll-result" role="status">
              Resolved outcome: <strong>{draftOutcome.summary}</strong> → Branch: <strong>{draftBranch.label}</strong> ({describeBranchEffect(draftBranch.effect)}). Kept on this device through target changes and reloads; will not reroll or flip again.
            </p>
          )}
           {(area ? selectedAreaRefs.length > 0 : !!target) && needsRoll && activeReading && activeReading.dice.length > 0 && !deterministic && !branchDeterministic && !roll && !pending && !acceptedCurrent && !draftElsewhere && (!isOutcomeSpell || Boolean(draftBranch)) && <div className="p9-roll">
            <button type="button" disabled={busy} onClick={() => record('digital')}>Roll {activeReading.dice.map(g => `${g.count}d${g.sides}`).join(' + ')} once</button>
            <span>or physical faces:</span>
            {activeReading.dice.flatMap((group, i) => Array.from({ length: group.count }, (_, j) => <input key={`${i}:${j}`} aria-label={`d${group.sides} face ${j + 1}`} type="number" min="1" max={group.sides}
              value={physical[`${i}:${j}`] || ''} onChange={event => setPhysical({ ...physical, [`${i}:${j}`]: event.target.value })} />))}
            <button type="button" disabled={busy} onClick={() => record('physical')}>Record physical roll</button>
          </div>}
            {deterministic || branchDeterministic ? <p className="p9-roll-result">Calculated proposal: <strong>{roll?.total}</strong>. No dice or random roll. Review the bound inputs and exact payment, then approve; the GM must confirm the final amount.</p> : roll && <p className="p9-roll-result">Recorded {roll.mode} roll: [{roll.dice.map(group => group.faces.join(', ')).join(' | ')}] {roll.constant >= 0 ? '+' : '-'} {Math.abs(roll.constant)} = <strong>{roll.total}</strong>. {area ? 'Proposed base amount for each selected creature target; the GM adjudicates each target’s final amount.' : 'The GM confirms the final amount.'} Kept on this device for this spell through target changes and reloads.</p>}
           {formula && roll && !pending && roll.reading !== support.reading.reading && <button type="button" disabled={busy} onClick={() => perform(() => saveSpellDraft({ context: ctx, label: support.name,
             roll: recordRoll(roll.mode, support.reading, roll.dice.map(group => group.faces)), targetKey, targetKeys, areaOrigin: activeOrigin, areaTarget: activeTarget }))}>Review changed scores with retained faces</button>}
          {support?.isHunterFlow && !!target && !pending && !draftElsewhere && (() => {
            const preRollFlow = source.token?.committedHunterFlow;
            if (!Number.isSafeInteger(preRollFlow) || preRollFlow < FLOW_MIN || preRollFlow > FLOW_MAX) return <p>Hunter Flow is not confirmed for this actor.</p>;
            const candidateFlow = { mode: flowDice.mode === 'digital' ? 'digital' : 'physical', dice: [{ sides: 6, faces: [Number(flowDice.die1), Number(flowDice.die2)] }] };
            let flowValid = false;
            try { validateFlowCheckRoll(candidateFlow); flowValid = true; } catch (_) { flowValid = false; }
            const flowPreview = flowValid ? resolveQuickDrawOutcome({ preRollFlow, flowDice: [Number(flowDice.die1), Number(flowDice.die2)], hit: true, baseRollTotal: roll?.total ?? 0 }) : null;
            return (
              <div className="p9-roll" aria-label="Hunter Flow 2d6 check">
                <p className="p9-note"><strong>Hunter Flow check (pre-roll Flow {preRollFlow}/4):</strong> Roll 2d6 once for Quick Draw. Natural doubles or |d1 − d2| ≤ {preRollFlow} adds +2 stabbing damage on a hit (never makes a miss deal damage).</p>
                <button type="button" disabled={busy} onClick={() => setFlowDice({ mode: 'digital', die1: String(Math.floor(Math.random() * 6) + 1), die2: String(Math.floor(Math.random() * 6) + 1) })}>Roll 2d6 Flow check</button>
                <span>or physical 2d6:</span>
                <input aria-label="Flow check d6 die 1" type="number" min="1" max="6" value={flowDice.die1} onChange={event => setFlowDice({ mode: 'physical', die1: event.target.value, die2: flowDice.die2 })} />
                <input aria-label="Flow check d6 die 2" type="number" min="1" max="6" value={flowDice.die2} onChange={event => setFlowDice({ mode: 'physical', die1: flowDice.die1, die2: event.target.value })} />
                {flowPreview && (
                  <p className="p9-roll-result" role="status">
                    Flow check [{flowDice.die1}, {flowDice.die2}] (diff {flowPreview.flowResult.difference}): {flowPreview.flowResult.flowBonusActivated ? '+2 stabbing damage on a hit' : 'ordinary 1d6 stabbing only'} · shared Flow {flowPreview.flowResult.preRollFlow} → {flowPreview.flowResult.postRollFlow}/4.
                  </p>
                )}
              </div>
            );
          })()}
          {!pending && !acceptedCurrent && (() => {
            let hunterFlowMissing = false;
            const flowRollObj = support?.isHunterFlow ? { mode: flowDice.mode === 'digital' ? 'digital' : 'physical', dice: [{ sides: 6, faces: [Number(flowDice.die1), Number(flowDice.die2)] }] } : undefined;
            if (support?.isHunterFlow) {
              const preRollFlow = source.token?.committedHunterFlow;
              if (!Number.isSafeInteger(preRollFlow) || preRollFlow < FLOW_MIN || preRollFlow > FLOW_MAX) hunterFlowMissing = true;
              else try { validateFlowCheckRoll(flowRollObj); } catch (_) { hunterFlowMissing = true; }
            }
            const outcomeIncomplete = isOutcomeSpell && (!draftOutcome || !draftBranch || !roll);
            return <button type="button" className="p9-primary" disabled={busy || !authoritativeTermsOk || (area ? unavailableAreaTargets || selectedAreaRefs.length < 1 || targetKeys.length > maxAreaCap || invalidAreaSelections.length > 0 || unverifiedAreaSelections.length > 0 || (isLineArea && !lineHasAim) || (!isLineArea && !circleHasOrigin) : !target || targetRelationshipBlocked || (isLowestHpTarget && (lowestHpRelLoading || lowestHpRelError || !lowestHpEval?.ok || !lowestHpAllowedKeys.includes(targetKey)))) || (needsRoll && !roll) || outcomeIncomplete || hunterFlowMissing || !support.payment?.affordable || !affordable(pools, support.price)}
              onClick={() => perform(() => sendSpellApproval({ spellId: owner.spellId, targetRef: area ? undefined : refOf(target), targetRefs: area ? selectedAreaRefs : undefined, areaOrigin: area ? activeOrigin : undefined, areaTarget: isLineArea ? activeTarget : undefined, roll: needsRoll ? roll : null, ...(isOutcomeSpell ? { outcome: draftOutcome, chosenBranch: draftBranch } : {}), flowCheck: flowRollObj, origin: owner.origin }))}>{area ? `Approve one source payment and ${selectedAreaRefs.length} creature target${selectedAreaRefs.length === 1 ? '' : 's'}` : isOutcomeSpell ? 'Approve price, target and resolved outcome' : composed ? 'Approve price, target, roll and listed outcomes' : bundle ? 'Approve exact price, target, effects and duration' : condition ? 'Approve exact price, target and Stunned duration' : 'Approve price and send to GM'}</button>;
          })()}
        </>}
      </>}
      {!!discarded.length && <details className="p12c-discarded"><summary>Discarded unsent rolls on this device ({discarded.length})</summary><ul>{discarded.map((d, i) => <li key={i}>{describeDraft(d)}</li>)}</ul></details>}
      {error && <p className="p9-diagnostic">{error}</p>}
    </div>
  </div>, document.body);
}

/** GM: explicit adjudication and one consequence; observers never execute. */
export function GmPanel() {
  const isGM = useGameStore(value => value.isGMMode);
  const roomId = useGameStore(value => value.multiplayerRoom?.id);
  const roomGameState = useGameStore(value => value.multiplayerRoom?.gameState);
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
    {entries.map(({ approval, targetProposal }) => {
      const draft = drafts[approval.approvalId] || {}, update = values => setDrafts({ ...drafts, [approval.approvalId]: { ...draft, ...values } });
      const source = find(approval.source), target = find(approval.target), state = status[approval.approvalId];
      if (isArea(approval)) return <AreaSpellCard key={approval.approvalId} approval={approval} source={source} find={find} state={state} targetProposal={targetProposal} draft={draft} update={update} busy={busy} perform={perform} game={game} />;
      if (approval.spell.kind === 'class-effect') return <ClassEffectCard key={approval.approvalId} approval={approval} source={source} target={target} state={state} targetProposal={targetProposal} draft={draft} update={update} busy={busy} perform={perform} game={game} />;
      const condition = approval.spell.kind === 'condition', bundle = approval.spell.kind === 'effect', channeled = approval.spell.kind === 'channeled', direct = bundle && !!approval.effectTerms.direct;
      const gmCritGate = bundle ? critGateOf(approval.effectTerms) : null;
      const gmCritMet = Boolean(gmCritGate && isCriticalRoll(approval.roll));
      // Shared GM-recorded save branch: the GM records which owner-approved outcome happened at the table.
      const save = bundle ? saveOf(approval.effectTerms) : null, branch = save ? draft.branch : undefined;
      // Direct-damage save: the GM records the table's outcome; the save changes only the Direct Damage part.
      const directSaveTerms = !bundle && !condition && !channeled ? approval.saveTerms || null : null;
      const formula = isFormula(approval);
      const resolved = condition || bundle || channeled, timingTerms = channeled ? approval.channelTerms.timing : bundle ? approval.effectTerms.timing : approval.conditionTerms?.timing;
      const resolution = resolved ? gmConditionResolution(approval.approvalId) || { gmConfirmed: false, timing: timingTerms, timingNote: '', evidence: '' } : null;
      const updateResolution = values => { try { saveGmConditionResolution(approval.approvalId, { ...resolution, ...values }); } catch (e) { update({ error: e.message }); } };
      const badge = gmCardBadge(state, targetProposal);
      return <article key={approval.approvalId} className="p9-gm-card">
        <div className="p9-gm-card-head">
          <h4>{nameOf(source)} → {nameOf(target)}: {approval.spell.name}</h4>
          <span className={badge.kind === 'action' ? 'p9-action-badge' : 'p9-info-badge'}>{badge.text}</span>
        </div>
        {bundle && <><p>{describeEffect(approval.effectTerms)}</p>
          {gmCritGate && (
            <p className="p9-note" role="status">
              {gmCritMet
                ? `Critical hit (max die face): ${conditionLabel(approval.effectTerms.condition)} applies on confirmation.`
                : `Normal hit (not max die face): direct damage only — ${conditionLabel(approval.effectTerms.condition)} does not apply.`}
            </p>
          )}
          {(!gmCritGate || gmCritMet) && <MovementOutcome terms={approval.effectTerms} definitionId={approval.spell.definitionId} sourceRef={approval.source} targetToken={target} approvalId={approval.approvalId} />}
          {(!gmCritGate || gmCritMet) && <AttributeOutcome terms={approval.effectTerms} definitionId={approval.spell.definitionId} sourceRef={approval.source} targetToken={target} approvalId={approval.approvalId} />}
          {(!gmCritGate || gmCritMet) && <DamageReductionOutcome terms={approval.effectTerms} definitionId={approval.spell.definitionId} sourceRef={approval.source} targetToken={target} approvalId={approval.approvalId} />}
          {direct && <><p>{approval.roll.mode} [{approval.roll.dice.map(group => group.faces.join(', ')).join(' | ')}] {approval.roll.constant >= 0 ? '+' : '-'} {Math.abs(approval.roll.constant)} = <strong>{approval.roll.total}</strong></p><p className="p9-meta">{approval.roll.reading}</p></>}</>}
        {bundle ? null : channeled ? <><p>{describeChanneled(approval.channelTerms)}</p><p>{approval.channelTerms.timing.durationText} — {approval.channelTerms.timing.gmNote}</p></> : condition ? <><p>Canonical Stunned · {STUNNED.description}</p><p>{approval.conditionTerms.timing.durationText} — GM removes. {approval.conditionTerms.timing.gmNote}</p></> : isOutcome(approval) ? <><p>Outcome: <strong>{approval.outcome.summary}</strong> → <strong>{approval.chosenBranch.label}</strong> ({describeBranchEffect(approval.chosenBranch.effect)}) · {approval.roll.mode} [{approval.roll.dice.map(group => group.faces.join(', ')).join(' | ')}] {approval.roll.constant >= 0 ? '+' : '-'} {Math.abs(approval.roll.constant)} = <strong>{approval.roll.total}</strong></p>
          <p className="p9-meta">{approval.roll.reading}</p></> : <><p>{approval.spell.kind === 'damage' ? `${approval.spell.damageTypes.join('/')} damage` : 'direct healing'} · {approval.roll.mode} [{approval.roll.dice.map(group => group.faces.join(', ')).join(' | ')}] {approval.roll.constant >= 0 ? '+' : '-'} {Math.abs(approval.roll.constant)} = <strong>{approval.roll.total}</strong></p>
          <p className="p9-meta">{approval.roll.reading}</p></>}
        <GmPaymentSummary approval={approval} state={state} targetProposal={targetProposal} label="Owner-approved price" />
        <details className="p9-tech-disclosure">
          <summary>Technical, range &amp; attestation details</summary>
          {bundle && <><p>{automationText(approval.effectTerms.timing, approval.effectTerms.condition, approval.effectTerms.direct)} {approval.effectTerms.timing.gmNote}</p>
            <p>Exact source {approval.source.tokenId}/{approval.source.instanceId} → target {approval.target.tokenId}/{approval.target.instanceId}. Duration and effects are owner-approved; changed terms require fresh approval.</p>
            {save && <p className="p9-note">{saveManualText(save)}{approval.effectTerms.timing.expiryPolicy !== 'gm-manual' ? ' This expiry is automatic: either recorded outcome needs active authenticated turn tracking with the target in the roster, or it is refused with nothing charged.' : ''}</p>}</>}
          {channeled && <p>Exact source {approval.source.tokenId}/{approval.source.instanceId} → target {approval.target.tokenId}/{approval.target.instanceId}. Range ({approval.channelTerms.channel.rangeFeet} ft) and caster-turn schedule are owner-approved and verified at start and every turn advance.</p>}{!bundle && !channeled && condition && <p>Exact source {approval.source.tokenId}/{approval.source.instanceId} → target {approval.target.tokenId}/{approval.target.instanceId}. Duration is owner-approved; a clarification cannot replace it. Changed terms require a newly admitted version and fresh approval.</p>}
          {!bundle && !channeled && !condition && isDeterministic(approval) && <p>Calculated proposal, no dice or random roll. Owner approval does not commit; your confirmation applies the final amount and exact price together.</p>}
          {(isFormula(approval) || isFormulaBundle(approval)) && <p className="p9-note">Owner-attested caster scores: {Object.entries(approval.rollAttributes).map(([name, value]) => `${name} ${value}`).join(', ') || 'none'}. Calculation verified against these inputs; sheet derivation is not server-authoritative. Changed caster state needs fresh owner consent with retained faces.</p>}
          {approval.rollHealth && <p className="p9-note">Bound caster base HP {approval.rollHealth.current}/{approval.rollHealth.max} · missing {Math.max(0, approval.rollHealth.max - approval.rollHealth.current)}; temporary HP excluded, divisor rounded down. Source {approval.source.tokenId}/{approval.source.instanceId}, revision {approval.formulaSourceRevision}. Server revalidates these HP inputs before committing.</p>}
          <p className="p9-advisory">{advisoryRange(source, target, game, 'authored range')} {resistanceText(target)}</p>
        </details>
         {resolved ? <fieldset disabled={busy || ['preparing', 'submitting', 'unknown', 'accepted', 'unresolved'].includes(state?.phase)}><legend>Private GM resolution</legend>
          <label>GM timing clarification (required)<input maxLength={300} value={resolution.timingNote} onChange={e => updateResolution({ timingNote: e.target.value, gmConfirmed: false })} /></label>
          <label>Private manual resolution evidence<textarea maxLength={2000} value={resolution.evidence} onChange={e => updateResolution({ evidence: e.target.value, gmConfirmed: false })} /></label>
          {save && <div role="radiogroup" aria-label="Recorded save outcome">{effectBranchLines(approval.effectTerms).map(line => <label key={line.branch} className="p9-branch"><input type="radio" name={`branch-${approval.approvalId}`} checked={branch === line.branch} onChange={() => update({ branch: line.branch })} /> {line.text}</label>)}</div>}
           <label><input type="checkbox" checked={resolution.gmConfirmed === true} onChange={e => updateResolution({ gmConfirmed: e.target.checked })} /> {save ? 'I resolved eligibility, range and immunity, and recorded the table’s save result above' : <>I resolved eligibility/range/saves/immunity and confirm that this {channeled ? 'channel start' : bundle ? 'whole effect' : 'Stunned'} outcome succeeded</>}</label>
          {direct && <><label>Final {approval.effectTerms.direct.kind === 'damage' ? 'damage' : 'healing'} <input type="number" min="0" value={draft.final ?? ''} onChange={event => update({ final: event.target.value })} /></label>
            <label>Reason (required if different from {approval.roll.total}) <input type="text" value={draft.reason || ''} onChange={event => update({ reason: event.target.value })} /></label></>}
          <p>{save ? 'Payment and the direct part apply on both recorded outcomes; the effect installs only if the target fails. Attempts that are not executed stay GM-managed.' : 'Only successful application is automated. Failed/unexecuted attempt costs remain GM-managed.'}</p>
        </fieldset> : <><label><input type="checkbox" checked={draft.adjudicated === true} onChange={event => update({ adjudicated: event.target.checked })} /> I adjudicated legality, range, defense and mitigation</label>
        <label>Final {isOutcome(approval) ? approval.chosenBranch.effect.kind : approval.spell.kind === 'damage' ? 'damage' : 'healing'}{directSaveTerms ? ' before the save' : ''} <input type="number" min="0" value={draft.final ?? ''} onChange={event => update({ final: event.target.value })} /></label>
        <label>Reason (required if different from {approval.roll.total}) <input type="text" value={draft.reason || ''} onChange={event => update({ reason: event.target.value })} /></label>
        {directSaveTerms && <DirectSaveOutcome approval={approval} draft={draft} update={update} />}</>}
         {draft.error && <p role="alert">{draft.error}</p>}
         {(condition || bundle) && approval.target.kind === 'character' && <TargetPolicy approvalId={approval.approvalId} bundle={bundle ? approval.effectTerms : null} disabled={busy || ['preparing', 'submitting', 'unknown', 'accepted', 'unresolved'].includes(state?.phase)} />}
         {formula && approval.target.kind === 'character' && !sameExactRef(approval.source, approval.target) && <TargetPolicy approvalId={approval.approvalId} formula disabled={busy || ['preparing', 'submitting', 'unknown', 'accepted', 'unresolved'].includes(state?.phase)} />}
         {formula && approval.target.kind === 'character' && !sameExactRef(approval.source, approval.target) && <p className="p9-note">A different final healing amount needs a fresh owner approval and target acceptance; the accepted proposal is {approval.roll.total}.</p>}
        {(() => {
          const isQuickDrawFlow = Boolean(approval.flowCheck);
          const flowDie1 = approval.flowCheck?.dice?.[0]?.faces?.[0];
          const flowDie2 = approval.flowCheck?.dice?.[0]?.faces?.[1];
          const flowPreview = isQuickDrawFlow ? resolveQuickDrawOutcome({
            preRollFlow: approval.classPayment?.before?.flow ?? approval.classPayment?.beforePublic?.current ?? FLOW_MIN,
            flowDice: [flowDie1, flowDie2],
            hit: draft.hit === true,
            baseRollTotal: approval.roll?.total ?? 0
          }) : null;
          return (
            <>
              {isQuickDrawFlow && (
                <div className="p9-direct-save">
                  <p className="p9-note">
                    <strong>Quick Draw Flow check [{flowDie1}, {flowDie2}]:</strong>{' '}
                    {flowPreview.flowResult.flowBonusActivated ? 'Qualifies (+2 stabbing damage on a hit)' : 'Does not qualify (ordinary 1d6 only)'} · shared Flow {flowPreview.flowResult.preRollFlow} → {flowPreview.flowResult.postRollFlow}/4 (commits on hit or miss).
                  </p>
                  <div role="radiogroup" aria-label="Quick Draw hit or miss">
                    <label className="p9-branch"><input type="radio" name={`hit-${approval.approvalId}`} checked={draft.hit === true} onChange={() => update({ hit: true })} /> Hit {flowPreview.flowResult.flowBonusActivated ? `(base ${approval.roll?.total ?? '?'} + 2 Flow bonus)` : `(base ${approval.roll?.total ?? '?'})`}</label>
                    <label className="p9-branch"><input type="radio" name={`hit-${approval.approvalId}`} checked={draft.hit === false} onChange={() => update({ hit: false, final: '0' })} /> Miss (0 damage; Flow {flowPreview.flowResult.preRollFlow} → {flowPreview.flowResult.postRollFlow} still commits)</label>
                  </div>
                </div>
              )}
              <div className="p9-actions">
                <button type="button" className="p9-primary" disabled={busy || !hasValidPrice(approval.price) || !hasValidClassPayment(approval.classPayment) || ['preparing', 'submitting', 'unknown', 'accepted', 'unresolved'].includes(state?.phase) || (resolved && (!resolution.gmConfirmed || !resolution.timingNote.trim())) || (direct && (draft.final === '' || draft.final === undefined)) || (save && !effectBranches(approval.effectTerms).includes(branch)) || (directSaveTerms && (!DIRECT_SAVE_BRANCHES.includes(draft.branch) || !!directSavePolicyRefusal(directSaveTerms))) || (isQuickDrawFlow && typeof draft.hit !== 'boolean')} onClick={() => perform(() => gmAcceptSpell(approval.approvalId, { finalAmount: resolved && !direct ? 0 : draft.final === '' || draft.final === undefined ? NaN : Number(draft.final), reason: resolved && !direct ? '' : draft.reason || '', adjudicated: resolved ? resolution.gmConfirmed : draft.adjudicated === true, ...(save ? { branch } : {}), ...(directSaveTerms ? { branch: draft.branch } : {}), ...(isQuickDrawFlow ? { hit: draft.hit } : {}) }))}>{save || directSaveTerms ? 'Confirm recorded outcome' : channeled ? 'Confirm upfront payment and start channel' : bundle ? 'Confirm payment, result and effect together' : condition ? 'Confirm PC payment and Stunned together' : 'Accept one consequence'}</button>
                <button type="button" disabled={busy || ['submitting', 'unknown'].includes(state?.phase)} onClick={() => perform(() => gmDeclineSpell(approval.approvalId))}>Decline</button>
                {state?.phase === 'unknown' && <button type="button" disabled={busy} onClick={() => perform(() => gmCheckSpellCommand(approval.approvalId))}>Check same command</button>}
              </div>
            </>
          );
        })()}
        {state?.message && <p role="status">{state.message}</p>}
      </article>;
    })}
    {extra.map(([id, value]) => {
      const gmState = gmPaymentState(value, null);
      return <p key={id} role="status" className="p9-meta">Spell {id.slice(0, 8)}: <strong>{gmState.stateLabel}</strong> — {value.message}
        {value.phase === 'unknown' && <button type="button" disabled={busy} onClick={() => perform(() => gmCheckSpellCommand(id))}>Check same command</button>}</p>;
    })}
  </section>;
}

/** Direct-damage save (handoff/direct-damage-save/CONTRACT.md): the GM records the table's save outcome for the Direct Damage part and
 * sees exactly the amount the shared rule will apply; the server derives the same number and refuses any other. */
function DirectSaveOutcome({ approval, draft, update }) {
  const terms = approval.saveTerms, unanswered = directSavePolicyRefusal(terms);
  const final = draft.final === '' || draft.final === undefined ? null : Number(draft.final);
  let preview = null;
  if (!unanswered && DIRECT_SAVE_BRANCHES.includes(draft.branch) && Number.isSafeInteger(final) && final >= 0) {
    try { preview = directSaveApplied(terms, draft.branch, final); } catch (_) { preview = null; }
  }
  return <div className="p9-direct-save">
    <p className="p9-note">{describeDirectSave(terms)} {saveManualText(terms)}</p>
    {unanswered && <p className="p9-diagnostic" role="status">{unanswered} Nothing can be confirmed for this outcome yet; decline it or resolve it by hand.</p>}
    <div role="radiogroup" aria-label="Recorded save outcome">{directSaveLines(terms, `${approval.spell.damageTypes.join('/')} damage ${approval.roll.reading}`).map(line =>
      <label key={line.branch} className="p9-branch"><input type="radio" name={`branch-${approval.approvalId}`} checked={draft.branch === line.branch} onChange={() => update({ branch: line.branch })} /> {line.text}</label>)}</div>
    {preview !== null && <p role="status">Direct Damage applied: <strong>{preview}</strong> (temporary HP first){preview !== final ? `, from your final amount ${final}` : ''}.</p>}
  </div>;
}
/** M1 GM card: record the table's outcome (one of the owner-approved branches), the final amount, and confirm once. */
function ClassEffectCard({ approval, source, target, state, targetProposal, draft, update, busy, perform, game }) {
  const terms = approval.effectTerms, options = classBranches(terms), lines = classBranchLines(terms);
  const locked = ['preparing', 'submitting', 'unknown', 'accepted', 'unresolved'].includes(state?.phase);
  const branch = options.length === 1 ? options[0] : draft.branch;
  const badge = gmCardBadge(state, targetProposal);
  return <article className="p9-gm-card">
    <div className="p9-gm-card-head">
      <h4>{nameOf(source)} → {nameOf(target)}: {approval.spell.name}</h4>
      <span className={badge.kind === 'action' ? 'p9-action-badge' : 'p9-info-badge'}>{badge.text}</span>
    </div>
    <p>{approval.roll.mode} [{approval.roll.dice.map(group => group.faces.join(', ')).join(' | ')}] {approval.roll.constant >= 0 ? '+' : '-'} {Math.abs(approval.roll.constant)} = <strong>{approval.roll.total}</strong></p>
    <p className="p9-meta">{approval.roll.reading}</p>
    <GmPaymentSummary approval={approval} state={state} targetProposal={targetProposal} label="Owner-approved price" />
    <ClassRiderOutcome approval={approval} targetToken={target} />
    <details className="p9-tech-disclosure">
      <summary>Technical, range &amp; class details</summary>
      <p>Exact source {approval.source.tokenId}/{approval.source.instanceId} → target {approval.target.tokenId}/{approval.target.instanceId}. Duration: “{terms.timing.durationText}” as authored — you remove the exact instance.</p>
      <p className="p9-advisory">{advisoryRange(source, target, game, 'authored range')} {resistanceText(target)}</p>
      <ClassDisclosure disclosure={approval.disclosure} />
    </details>
    <fieldset disabled={busy || locked}><legend>{terms.save ? 'Recorded outcome' : 'Outcome'}</legend>
      {lines.map(line => <label key={line.branch} className="p9-branch"><input type="radio" name={`branch-${approval.approvalId}`} checked={branch === line.branch} onChange={() => update({ branch: line.branch })} /> {line.text}</label>)}
      <label><input type="checkbox" checked={draft.adjudicated === true} onChange={event => update({ adjudicated: event.target.checked })} /> I adjudicated legality, range and mitigation{terms.save ? ', and recorded the table’s save result above' : ''}</label>
      <label>Final {terms.direct.kind === 'damage' ? 'damage' : 'healing'} <input type="number" min="0" value={draft.final ?? ''} onChange={event => update({ final: event.target.value })} /></label>
      <label>Reason (required if different from {approval.roll.total}) <input type="text" value={draft.reason || ''} onChange={event => update({ reason: event.target.value })} /></label>
    </fieldset>
    {draft.error && <p role="alert">{draft.error}</p>}
    <div className="p9-actions">
      <button type="button" className="p9-primary" disabled={busy || locked || !hasValidPrice(approval.price) || !hasValidClassPayment(approval.classPayment) || !branch || draft.adjudicated !== true || draft.final === '' || draft.final === undefined}
        onClick={() => perform(() => gmAcceptSpell(approval.approvalId, { finalAmount: Number(draft.final), reason: draft.reason || '', adjudicated: draft.adjudicated === true, branch }))}>Confirm recorded outcome</button>
      <button type="button" disabled={busy || ['submitting', 'unknown'].includes(state?.phase)} onClick={() => perform(() => gmDeclineSpell(approval.approvalId))}>Decline</button>
      {state?.phase === 'unknown' && <button type="button" disabled={busy} onClick={() => perform(() => gmCheckSpellCommand(approval.approvalId))}>Check same command</button>}
    </div>
    {state?.message && <p role="status">{state.message}</p>}
  </article>;
}

/** M6A GM card: inspect exact area terms, single source payment, and adjudicate each creature target's final amount. */
function AreaSpellCard({ approval, source, find, state, targetProposal, draft, update, busy, perform, game }) {
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
  const badge = gmCardBadge(state, targetProposal);
  return <article className="p9-gm-card" aria-label={`Area adjudication for ${approval.spell.name}`}>
    <div className="p9-gm-card-head">
      <h4>{nameOf(source)} → [{approval.targets.map(t => nameOf(find(t))).join(', ')}]: {approval.spell.name}</h4>
      <span className={badge.kind === 'action' ? 'p9-action-badge' : 'p9-info-badge'}>{badge.text}</span>
    </div>
    <p>
      {approval.areaTerms?.aoeShape === 'line'
        ? `Area line ${approval.areaTerms?.lengthFeet}×${approval.areaTerms?.widthFeet} ft · starts at the caster · ${approval.targets.length} creature target${approval.targets.length === 1 ? '' : 's'}`
        : `Area circle ${approval.areaTerms?.radiusFeet}-ft radius · ${approval.areaTerms?.rangeFeet}-ft placement range · ${approval.targets.length} creature target${approval.targets.length === 1 ? '' : 's'}`}
      {approval.areaOrigin ? (approval.areaTerms?.aoeShape === 'line' ? ` · from the caster (${Math.round(approval.areaOrigin.x)}, ${Math.round(approval.areaOrigin.y)})` : ` · placed origin (${Math.round(approval.areaOrigin.x)}, ${Math.round(approval.areaOrigin.y)})`) : ''}
      {approval.areaTarget ? ` · aim (${Math.round(approval.areaTarget.x)}, ${Math.round(approval.areaTarget.y)})` : ''}
    </p>
    <p>
      {approval.spell.kind === 'damage' ? `${approval.spell.damageTypes.join('/')} damage` : 'direct healing'} · {approval.roll.mode} [{approval.roll.dice.map(group => group.faces.join(', ')).join(' | ')}] {approval.roll.constant >= 0 ? '+' : '-'} {Math.abs(approval.roll.constant)} = <strong>{approval.roll.total}</strong> (proposed per target)
    </p>
    <GmPaymentSummary approval={approval} state={state} targetProposal={targetProposal} label="Single source payment" />
    {(approval.roll.reading || (approval.rollAttributes && Object.keys(approval.rollAttributes).length > 0)) && (
      <details className="p9-tech-disclosure">
        <summary>Technical, formula &amp; attestation details</summary>
        <p className="p9-meta">{approval.roll.reading} · Roll procedure: {approval.areaRollProcedure}</p>
        {approval.rollAttributes && Object.keys(approval.rollAttributes).length > 0 && (
          <p className="p9-note">Owner-attested caster scores: {Object.entries(approval.rollAttributes).map(([name, value]) => `${name} ${value}`).join(', ')}. Calculation verified against these inputs.</p>
        )}
      </details>
    )}
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
        disabled={busy || locked || !hasValidPrice(approval.price) || !hasValidClassPayment(approval.classPayment) || draft.adjudicated !== true || !allAmountsEntered}
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
      <p>{hasValidPrice(c.entry.descriptor.price) ? `Exact price: ${c.entry.descriptor.price.ap} AP / ${c.entry.descriptor.price.mana} mana · temporary first. Nothing spent before confirmation.` : 'Authoritative payment terms unavailable; no total is invented.'}</p>
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
       {latest.result?.receipt && !bundle && (condition ? <p>Payment and canonical Stunned installed together. Exact instance {c.attemptId} · source {c.source.tokenId} / {c.source.instanceId}. {resolution.timing.durationText} — GM removes.</p> : <p>Payment and HP installed together. {(latest.result.receipt.actors || []).map(a => `${a.ref.tokenId}: AP ${a.finalResources?.ap?.current ?? 'unavailable'}+${a.finalResources?.ap?.temp ?? 0} temp, mana ${a.finalResources?.mana?.current ?? 'unavailable'}+${a.finalResources?.mana?.temp ?? 0} temp, HP ${a.finalResources?.hp?.current ?? 'unavailable'}+${a.finalResources?.hp?.temp ?? 0} temp`).join(' · ')}</p>)}
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
    {entries.map(e => <div key={actionId(e.definitionRef)} className="p9-admitted-row">{e.descriptor?.capabilityId === 'authored-passive-entry:v1' ? <><strong>{e.canonicalDefinition.name}</strong> · version {e.definitionRef.definitionVersion} · Passive · {e.descriptor.targeting.radiusFeet} ft {e.descriptor.targeting.restriction} radius · {definitionSummary(e.canonicalDefinition)}</> : e.descriptor?.capabilityId === 'authored-passive-turn:v1' ? <><strong>{e.canonicalDefinition.name}</strong> · version {e.definitionRef.definitionVersion} · {definitionSummary(e.canonicalDefinition)}</> : <><strong>{e.canonicalDefinition.name}</strong> · version {e.definitionRef.definitionVersion} · {e.descriptor.price.ap} AP / {e.descriptor.price.mana} mana · {definitionSummary(e.canonicalDefinition)} · {e.descriptor.targeting.rangeFeet} ft</>}
      <span>{e.revoked ? ' — Revoked (history retained)' : e.descriptor?.capabilityId === 'authored-passive-entry:v1' ? ' — Admitted passive aura; activate in Passive ability activation' : e.descriptor?.capabilityId === 'authored-passive-turn:v1' ? ' — Admitted passive turn-boundary trigger; activate in Passive ability activation' : e.creatureOnly ? ' — Exact creature-source admission; use placed Inspect' : e.canonicalDefinition.outcomeTable ? ' — PC→distinct creature outcome-branched spell' : e.canonicalDefinition.effects ? ` — PC→distinct creature${pcConsent(e.canonicalDefinition.effects, 'character').ok ? ' or primary PC' : ''} composed effect` : e.canonicalDefinition.effect?.kind === 'condition' ? ` — PC→distinct creature or primary PC canonical Stunned · ${e.canonicalDefinition.timing.durationText} — GM removes` : ' — Admitted for immediate damage/healing'}</span>
      {!e.revoked && !e.creatureOnly && !['authored-passive-entry:v1', 'authored-passive-turn:v1'].includes(e.descriptor?.capabilityId) && <button type="button" disabled={busy} onClick={() => { if (!routeSpellCast({ id: actionId(e.definitionRef) }, { producer: 'admitted-library' })) setMessage('This installed binding is unavailable to your current character.'); }}>Use admitted ability</button>}
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
  const ownProposals = proposals.filter(p => p.target.characterId === characterId);
  const hasActionable = ownProposals.some(p => !p.withdrawn && !p.accepted) || retained.length > 0;
  const [open, setOpen] = useState(hasActionable);
  const prevActionableRef = useRef(hasActionable);
  useEffect(() => {
    if (hasActionable && !prevActionableRef.current) setOpen(true);
    prevActionableRef.current = hasActionable;
  }, [hasActionable]);
  // Reading/acknowledging/reporting never emits an action or changes a condition.
  if (!records.length && !proposals.length && !retained.length) return null;
  const respond = async(p, accept) => { setBusy(true); setError(''); try { await respondToVoluntaryCondition(p, accept); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  return <details className="p9-admitted" open={open} onToggle={e => setOpen(e.currentTarget.open)}><summary>Stunned notices and voluntary proposals ({records.length + proposals.length}) <span className={hasActionable ? 'p9-action-badge' : 'p9-info-badge'}>{hasActionable ? 'Needs your action' : 'Informational'}</span></summary>
    <section aria-label="Target Stunned notices">
      {retained.map(e => <p key={e.command.commandId} role="status">Original target response {e.command.proposalId}: outcome unavailable. No replacement consent is created. <button type="button" disabled={busy} onClick={() => respond(e.proposal || e.command, e.command.accept)}>Check original target response</button></p>)}
      {ownProposals.map(p => <div key={p.proposalId}><h4>{p.healing ? 'Direct healing proposal' : p.bundle ? 'Voluntary effect bundle' : 'GM-designated voluntary Stunned'}</h4>{p.healing && <p className="p9-bundle">Direct healing {p.healing.formula} — proposed amount {p.healing.proposedAmount}. A different amount needs your fresh acceptance. Your affirmative acceptance is required before the GM can install it.</p>}{p.bundle && <p className="p9-bundle">{p.bundle.direct ? `${p.bundle.direct.kind === 'damage' ? `${(p.bundle.direct.damageTypes || []).join('/')} damage` : 'Direct healing'} ${p.bundle.direct.formula} (the GM finalizes the amount${p.bundle.direct.kind === 'healing' ? '; a different amount needs your fresh acceptance' : ''}) + ` : ''}{conditionLabel(p.bundle.condition)} · {p.bundle.timing.durationText} — {policyText(p.bundle.timing.expiryPolicy, p.bundle.timing.occurrences)}. {p.bundle.condition.kind === 'movement' ? `Your movement speed changes by ${p.bundle.condition.feet > 0 ? '+' : '−'}${Math.abs(p.bundle.condition.feet)} ft per movement AP, combined with other effects and never below 0 ft.`
          : p.bundle.condition.kind === 'attribute' ? `Your ${attributeName(p.bundle.condition.attribute)} score changes by ${signed(p.bundle.condition.amount)} while it lasts: added once to your sheet score, used by supported spell formulas that name this attribute; a basic strike changes only when its weapon uses this attribute. Base attributes are not edited. ${ATTRIBUTE.notAutomated}`
          : p.bundle.condition.kind === 'damageReduction' ? `Your flat Damage Reduction (DR) increases by +${p.bundle.condition.amount} while it lasts: added once to your sheet Damage Reduction (DR) and shown to the GM in combat adjudication (never automatically subtracted before or after equipment blocking). Base stats and equipment are not edited. ${DAMAGE_REDUCTION.notAutomated}` : STUNNED.description}</p>}<p>{p.source} (exact opaque source handle {p.sourceHandle}) → exact target {p.target.tokenId}/{p.target.instanceId}. {p.healing ? 'The exact proposed healing amount is bound to this acceptance.' : p.bundle ? '' : `Canonical Stunned: ${STUNNED.description} ${p.durationText} — GM removes.`} {hasValidPrice(p.price) && hasValidClassPayment(p.classPayment) ? `Source price ${p.price.ap} AP / ${p.price.mana} mana${classPriceNote(p.classPayment)}.` : 'Authoritative source payment terms unavailable; no total is invented.'} Admitted definition {p.definitionId} · version/hash {p.definitionVersionOrHash}. Exact proposal {p.proposalId} · server-bound terms handle {p.termsHash}. No source resources are authorized by your acceptance.</p>
        <p><strong>Payment status:</strong> {p.withdrawn ? 'Closed / withdrawn — no payment was recorded.' : 'Awaiting target & GM consent — not yet paid.'}</p>
        <p>{p.withdrawn ? 'Withdrawn. A fresh proposal is required.' : p.accepted ? 'Your exact acceptance is recorded; installation still requires the GM.' : 'Waiting for your affirmative acceptance. Silence, timeout and disconnection never accept.'}</p>
        {!p.withdrawn && <><button type="button" disabled={busy || p.accepted} onClick={() => respond(p, true)}>{p.healing ? 'Accept this exact healing proposal' : p.bundle ? 'Accept this exact effect bundle' : 'Accept this exact voluntary Stunned'}</button><button type="button" disabled={busy} onClick={() => respond(p, false)}>Withdraw target acceptance before installation</button></>}
      </div>)}
      {records.map(r => <p key={r.id} role="status">{isStunned(r) ? 'Accepted canonical Stunned' : isAttributeModifier(r) ? `Active ${r.name} (${attributeName(attributeModifierOf(r).attribute)} ${signed(attributeModifierOf(r).amount)}; added once to your sheet score — supported spell formulas that name this attribute use the changed score; a basic strike changes only when its weapon uses this attribute. Your base attributes are not edited)` : isDamageReductionModifier(r) ? `Active ${r.name} (Flat DR +${damageReductionModifierOf(r).amount}; added once to your sheet Damage Reduction (DR) and shown to the GM in combat adjudication; never automatically subtracted before or after equipment blocking. Your base stats and equipment are not edited)` : `Active ${r.label || 'movement effect'} (${(r.effects?.movementSpeed || 0) > 0 ? '+' : '−'}${Math.abs(r.effects?.movementSpeed || 0)} ft per movement AP; added to other movement effects, never below 0 ft — your sheet and movement validation use the combined speed)`} · instance {r.id} · {expiryLabel(r)}. Source identity is withheld on this notice. View the same instance on your sheet/token.</p>)}
      <details className="p9-tech-disclosure">
        <summary>Hostile effect &amp; correction rules</summary>
        <p>An accepted hostile effect (Stunned, a movement penalty or an attribute penalty) does not require your permission or acknowledgement. To request correction, message the GM with the exact instance below; the GM uses shared condition controls to correct/remove that instance. Reporting does not undo, duplicate or refund it.</p>
      </details>
      <button type="button" disabled={busy} onClick={() => refreshSpellApprovals()}>Refresh original target proposals</button>
      {error && <p role="alert">{error}</p>}
    </section></details>;
}

export default function SpellConsequenceHost() {
  const shared = useGameStore(value => value.isInMultiplayer);
  useEffect(() => { if (shared) restoreOwnerStatus(); }, [shared]);
  if (!shared) return null;
  return <><GmPanel /><OwnerChip /><TargetConditions /><TriggerOfferPanel /><PassiveActivationPanel /><PlacedEffectPanel /><AdmittedAbilities /><OwnerPanel /><CreaturePanel /></>;
}
