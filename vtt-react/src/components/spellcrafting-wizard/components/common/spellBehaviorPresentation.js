/**
 * Shared behavioral flow presentation model for Review and Library cards.
 *
 * Pure presentation only: consumes existing shared models (`executionCompatibility`,
 * `executionPlan`, `spellTriggerPresentation`, `spellSavePresentation`, `spellTimingPresentation`)
 * without changing canonical definitions, hashes, or execution rules.
 */

import { definitionFromWizard, FLOW_CAPABILITY, PASSIVE_ENTRY_CAPABILITY, PASSIVE_TURN_CAPABILITY, OUTCOME_CAPABILITY, CHANNELED_CAPABILITY } from '../../../../services/authoredAbility';
import { compileOutcomeTable, describeBranchEffect, describeMatcher, CARD_UNSETTLED_REASON, WEIGHTED_COIN_REFUSAL } from '../../../../services/randomOutcome';
import { explainExecution, draftSubject, STATES, reviewClassId } from '../../utils/executionCompatibility';
import { triggerPlanForRecord } from './spellTriggerPresentation';
import { saveDisclosureForRecord } from './spellSavePresentation';
import {
  extractPeriodicTiming,
  formatAuthoredExpiry,
  formatCombatCooldown,
  isSupportedCombatCooldown
} from './spellTimingPresentation';
import { extractFlowAuthoringFromRecord, describeFlowMechanics } from '../../../../services/hunterFlow';
import { getP9MinstrelPairSpec } from '../../../../data/classes/minstrel/p9MinstrelPair';

const SUPPORT_BADGES = {
  [STATES.EXECUTABLE]: {
    status: 'supported',
    label: 'Prism-supported',
    detail: 'Structurally compatible with a Prism route.'
  },
  [STATES.PARTIAL]: {
    status: 'partial',
    label: 'Partially automated',
    detail: 'Prism runs the supported parts; the rest is resolved at the table.'
  },
  [STATES.BLOCKED]: {
    status: 'blocked',
    label: 'Blocked pending decision',
    detail: 'Awaiting a recorded creator decision; played by hand until then.'
  },
  [STATES.UNSUPPORTED]: {
    status: 'manual',
    label: 'Manual / stored only',
    detail: 'Prism cannot run this record as authored; all authored sections are kept.'
  }
};

function formatPriceSummary(draft, def, rootRecord = draft) {
  const rc = def?.resourceCost || draft?.resourceCost;
  const p9Minstrel = getP9MinstrelPairSpec(rootRecord) || getP9MinstrelPairSpec(draft);
  const parts = [];
  if (rc && Number.isFinite(rc.actionPoints)) parts.push(`${rc.actionPoints} AP`);
  const mana = Number.isFinite(rc?.mana) ? rc.mana : Number.isFinite(rc?.resourceValues?.mana) ? rc.resourceValues.mana : null;
  if (mana !== null) parts.push(`${mana} mana`);
  if (p9Minstrel) parts.push(p9Minstrel.classPriceLabel);
  else if (def?.classPayment?.domain) parts.push(`${def.classPayment.domain} class cost`);
  return parts.join(', ');
}

function formatTargetSummary(draft, def) {
  const t = def?.targeting;
  if (t?.kind === 'self_centered_radius') {
    return `Self-centered ${t.radiusFeet} ft radius (${t.restriction} moves in)`;
  }
  if (t?.kind === 'area') {
    return t.aoeShape === 'line'
      ? `${t.lengthFeet}×${t.widthFeet} ft line from the caster`
      : `Placed ${t.radiusFeet} ft circle, ${t.rangeFeet} ft range`;
  }
  if (t) {
    const scope = t.restriction === 'self'
      ? 'Self'
      : t.selectionMethod === 'lowest_health'
        ? `1 creature (lowest HP, ${t.restriction || 'any'})`
        : `1 creature (${t.restriction || 'any'})`;
    return t.rangeFeet ? `${scope}, ${t.rangeFeet} ft` : scope;
  }
  const dt = draft?.targetingConfig;
  if (!dt) return '';
  if (dt.targetingType === 'self') return 'Self';
  const dist = dt.rangeDistance ? `${dt.rangeDistance} ft` : '';
  const areaLabel = dt.aoeShape === 'line'
    ? (dt.aoeParameters?.length && dt.aoeParameters?.width ? `Line ${dt.aoeParameters.length}×${dt.aoeParameters.width} ft` : 'Line area')
    : 'Area';
  const restriction = Array.isArray(dt.targetRestrictions) && dt.targetRestrictions.length === 1 ? dt.targetRestrictions[0] : dt.targetRestriction;
  const baseLabel = (dt.selectionMethod === 'lowest_health' || dt.targetSelectionMethod === 'lowest_health') ? 'Lowest HP target' : 'Single target';
  const singleLabel = (restriction === 'enemy' || restriction === 'ally') ? `${baseLabel} (${restriction})` : baseLabel;
  return [dt.targetingType === 'area' ? areaLabel : singleLabel, dist].filter(Boolean).join(', ');
}

function formatImmediateSummary(draft, def) {
  const direct = def?.effects?.direct || (def?.effect && def.effect.kind !== 'periodic' ? def.effect : null);
  if (direct) {
    const kind = direct.kind === 'healing' ? 'Restore' : 'Deal';
    const type = direct.kind === 'damage' && direct.damageTypes?.length ? ` ${direct.damageTypes[0]}` : '';
    const suffix = direct.kind === 'healing' ? ' HP' : ' damage';
    return `${kind} ${direct.formula}${type}${suffix}`;
  }
  const types = Array.isArray(draft?.effectTypes) ? draft.effectTypes : [];
  const items = [];
  if (types.includes('damage') && draft?.damageConfig?.formula) {
    items.push(`Deal ${draft.damageConfig.formula}${draft.damageConfig.elementType ? ` ${draft.damageConfig.elementType}` : ''} damage`);
  }
  if (types.includes('healing') && draft?.healingConfig?.formula) {
    items.push(`Restore ${draft.healingConfig.formula} HP`);
  }
  return items.join('; ');
}

function formatRiderSummary(authored, cond) {
  const effectKind = authored?.effect || cond?.kind;
  const label = authored?.label || cond?.label;
  if (effectKind === 'stunned') {
    return 'Canonical Stunned: target cannot act or move';
  }
  if (effectKind === 'movement') {
    const feet = authored?.movementFeet ?? cond?.feet ?? 0;
    const signed = `${feet > 0 ? '+' : '−'}${Math.abs(feet)} ft`;
    return `${label || 'Movement'}: Movement ${signed}`;
  }
  if (effectKind === 'attribute') {
    const attr = authored?.attribute || cond?.attribute || 'Attribute';
    const amt = authored?.attributeAmount ?? cond?.amount ?? 0;
    const signed = `${amt > 0 ? '+' : '−'}${Math.abs(amt)}`;
    return `${label || attr}: ${attr} ${signed}`;
  }
  if (effectKind === 'damageReduction') {
    const amt = authored?.drAmount ?? authored?.damageReduction ?? cond?.amount ?? 0;
    return `${label || 'Damage reduction'}: +${Math.abs(amt)} DR`;
  }
  return '';
}

export function buildSpellBehaviorModel(record, context = {}) {
  if (!record || typeof record !== 'object') return null;
  const hasStructuredFields = Boolean(
    record.authoredDraft ||
    record.spellType === 'PASSIVE' ||
    record.spellType === 'CHANNELED' ||
    (Array.isArray(record.effectTypes) && record.effectTypes.length > 0) ||
    record.damageConfig ||
    record.healingConfig ||
    record.controlConfig ||
    record.triggerConfig ||
    record.mechanicsConfig?.hunterFlow?.enabled ||
    record.specialMechanics?.hunterFlow?.enabled ||
    record.rollableTable?.enabled ||
    record.mechanicsConfig?.rollableTable?.enabled
  );
  if (!hasStructuredFields) return null;

  const subject = record.authoredDraft ? record : draftSubject(record);
  if (!subject) return null;
  const draft = subject.authoredDraft || subject;

  const compat = explainExecution(subject, context);
  const compiled = definitionFromWizard(subject, {
    roomId: context.roomId,
    classId: reviewClassId(subject, context),
    definitionVersion: context.definitionVersion || 1
  });
  const def = compiled.ok ? compiled.definition : null;
  const triggerPlan = triggerPlanForRecord(subject, compiled);
  const saveInfo = saveDisclosureForRecord(subject);
  const periodicInfo = extractPeriodicTiming(subject);

  const supportBadge = SUPPORT_BADGES[compat.state] || SUPPORT_BADGES[STATES.UNSUPPORTED];
  const isNonExecutable = compat.state === STATES.UNSUPPORTED || compat.state === STATES.BLOCKED;
  const isRecordManual = !def && isNonExecutable;
  const liveState = context.liveState || {
    label: 'Static rule summary',
    detail: 'Live room admission, GM pairing, and current resources are checked at cast time.'
  };

  const steps = [];

  const isChanneledSpell = Boolean(def?.capability === CHANNELED_CAPABILITY || draft.spellType === 'CHANNELED');
  // 1. Activation / Stored / Channel Start
  if (isChanneledSpell) {
    const ch = def?.channel || draft.typeConfig || {};
    const price = formatPriceSummary(draft, def, subject);
    const target = formatTargetSummary(draft, def);
    const rangeFeet = def?.targeting?.rangeFeet ?? draft.targetingConfig?.rangeDistance ?? 0;
    const maxDur = ch.maxChannelDuration ?? draft.channelingConfig?.maxDuration ?? 3;
    const freq = ch.tickFrequency || draft.channelingConfig?.tickFrequency || 'END_OF_TURN';
    const unit = freq === 'START_OF_TURN' ? 'start' : 'end';
    const concDc = ch.concentrationDC ?? draft.channelingConfig?.concentrationDC;
    const dcType = ch.dcType ?? draft.channelingConfig?.dcType;
    const te = def?.tickEffect;
    const rawTickKind = te?.kind || (Array.isArray(draft.effectTypes) && draft.effectTypes[0]);
    const tickFormula = te?.formula || (rawTickKind === 'damage' ? draft.damageConfig?.formula : draft.healingConfig?.formula) || '';
    const tickElem = te?.damageTypes?.[0] || draft.damageConfig?.elementType || draft.typeConfig?.school || '';
    const tickEffectText = rawTickKind === 'healing'
      ? `Restore ${tickFormula} HP per tick`
      : `Deal ${tickFormula}${tickElem ? ` ${tickElem}` : ''} damage per tick`;

    steps.push({
      id: 'channel-start',
      label: 'CHANNEL START',
      summary: [price, target].filter(Boolean).join(' · ') || 'Channel start',
      details: [
        rangeFeet ? `Range checked at start and each turn boundary: up to ${rangeFeet} ft.` : null,
        'Upfront AP and mana cost paid once at channel start.'
      ].filter(Boolean)
    });
    steps.push({
      id: 'channel-ticks',
      label: 'TICKS',
      summary: `${tickEffectText}: ${maxDur} tick${maxDur === 1 ? '' : 's'} at the ${unit} of the caster's turn${maxDur === 1 ? '' : 's'}.`,
      details: [
        'Each tick falls on a strictly upcoming caster turn (a turn already in progress is skipped for end-of-turn).',
        'Each due tick waits for GM roll resolution; no HP changes automatically.'
      ]
    });
    steps.push({
      id: 'channel-end',
      label: 'CHANNEL END',
      summary: `Ends after tick ${maxDur}, if target moves beyond ${rangeFeet || '?'} ft, if caster becomes Stunned or reaches 0 HP, or if GM interrupts.`,
      details: [
        'No extra ticks fire after the channel ends.',
        concDc && dcType ? `Concentration check hint on caster damage: ${dcType} DC ${concDc} (GM interrupts manually).` : null
      ].filter(Boolean)
    });
  } else if (def?.capability === PASSIVE_ENTRY_CAPABILITY) {
    steps.push({
      id: 'activation',
      label: 'WHILE ACTIVE',
      summary: `Self-centered ${def.targeting.radiusFeet} ft radius (${def.targeting.restriction} moves in) — stays stored until GM admits and activates.`,
      details: ['Teleport, forced movement, and re-entry remain unsettled/open.']
    });
  } else if (def?.capability === PASSIVE_TURN_CAPABILITY) {
    const boundaryText = def.trigger.kind === 'turn_start' ? 'turn start' : 'turn end';
    steps.push({
      id: 'activation',
      label: 'WHILE ACTIVE',
      summary: `Self-targeted passive (${def.trigger.whoseTurn} ${boundaryText}) — stays stored until GM admits and activates.`,
      details: ['Applies automatically on matching authenticated turn advance with no 8-second reaction window and no duplicate stacking while active.']
    });
  } else if (draft.spellType === 'TRAP') {
    steps.push({
      id: 'activation',
      label: 'STORED',
      summary: 'TRAP spell type — whole spell type is GM-managed and not auto-activated by Prism (Prism does not place, arm, or trigger traps; saved intact as written).',
      details: []
    });
  } else if (draft.spellType && draft.spellType !== 'ACTION') {
    steps.push({
      id: 'activation',
      label: 'STORED',
      summary: `${draft.spellType} ability — not auto-activated by Prism (saved as written).`,
      details: []
    });
  } else {
    const price = formatPriceSummary(draft, def, subject);
    const target = formatTargetSummary(draft, def);
    steps.push({
      id: 'activation',
      label: 'ACTIVATE',
      summary: [price, target].filter(Boolean).join(' · ') || 'Immediate action',
      details: isRecordManual
        ? ['Manual play: in a shared room Prism posts a manual notice only and spends no AP or mana automatically; pay and track costs at the table.']
        : []
    });
  }

  // 2. Immediate effects
  const immediateSummary = isChanneledSpell ? '' : formatImmediateSummary(draft, def);
  if (immediateSummary) {
    const details = [];
    // Direct-damage save (handoff/direct-damage-save/CONTRACT.md): the save changes this damage part itself, so it is not "both outcomes".
    if (saveInfo?.executable && saveInfo.component !== 'direct-damage') {
      details.push('Applies on both save outcomes.');
    }
    steps.push({
      id: 'immediate',
      label: 'DO',
      summary: immediateSummary,
      details
    });
  }

  // 3. Save branch (only when authored save exists)
  if (saveInfo) {
    const authored = draft.controlConfig?.authoredCondition;
    const riderName = authored?.effect === 'stunned'
      ? 'Canonical Stunned'
      : (authored?.label || authored?.effect || 'the rider');
    if (saveInfo.executable && saveInfo.component === 'direct-damage') {
      const halves = saveInfo.save?.outcome === 'halves';
      steps.push({
        id: 'save',
        label: 'SAVE',
        summary: `Table rolls ${saveInfo.label}; GM records outcome. It changes only the Direct Damage part.`,
        branches: [
          { outcome: 'On fail', text: "Direct Damage: the GM's final amount." },
          { outcome: 'On save', text: halves ? "Direct Damage: half the GM's final amount, rounded down." : 'Direct Damage: none.' }
        ],
        details: ['The price is paid on either outcome.']
      });
    } else if (saveInfo.executable) {
      const directKindLabel = def?.effects?.direct?.kind === 'healing' ? 'Direct healing' : 'Direct damage';
      steps.push({
        id: 'save',
        label: 'SAVE',
        summary: `Table rolls ${saveInfo.label}; GM records outcome.`,
        branches: [
          { outcome: 'On fail', text: `Applies ${riderName}.` },
          { outcome: 'On save', text: `${directKindLabel} still applies; only ${riderName} is negated.` }
        ],
        details: ['The VTT never rolls or validates the save; cast AP and mana price is paid once at cast on either outcome.']
      });
    } else {
      steps.push({
        id: 'save',
        label: 'SAVE (MANUAL)',
        summary: saveInfo.text,
        details: []
      });
    }
  }

  // 3b. Hunter Flow (Vault checkpoint 25 base vs. 2d6 Flow bonus explanation)
  const flowAuthoring = extractFlowAuthoringFromRecord(subject);
  if (flowAuthoring) {
    const flowStep = describeFlowMechanics(flowAuthoring, {
      preRollFlow: context.preRollFlow ?? context.hunterFlowState?.flow,
      flowResult: context.flowResult,
      executableQuickDraw: Boolean(def?.capability === FLOW_CAPABILITY)
    });
    if (flowStep) {
      steps.push({
        id: 'hunter-flow',
        label: flowStep.label,
        summary: flowStep.summary,
        branches: flowStep.branches,
        details: flowStep.details
      });
    }
  }

  // 3c. Outcome-branched Rollable Table (Dice / Fair Coins / Card Manual)
  const outcomeTableRecord = draft.rollableTable?.enabled
    ? draft.rollableTable
    : (record.rollableTable?.enabled ? record.rollableTable : record.mechanicsConfig?.rollableTable?.enabled ? record.mechanicsConfig.rollableTable : null);
  if (outcomeTableRecord && Array.isArray(outcomeTableRecord.entries) && outcomeTableRecord.entries.length > 0) {
    const compiledOutcome = def?.capability === OUTCOME_CAPABILITY
      ? { ok: true, outcomeTable: def.outcomeTable }
      : compileOutcomeTable(outcomeTableRecord);
    const resType = outcomeTableRecord.resolutionType || 'DICE';
    const resCfg = outcomeTableRecord.resolutionConfig || {};
    const mechanicSummary = resType === 'CARDS'
      ? `Draw ${resCfg.cardCount || 1} ${resCfg.deckType === 'tarot' ? 'Tarot' : 'Standard'} card${(resCfg.cardCount || 1) === 1 ? '' : 's'} — ${outcomeTableRecord.name || 'Random Effects'}`
      : resType === 'COINS'
        ? `Flip ${resCfg.coinCount || 1} ${resCfg.coinType === 'weighted' ? 'weighted' : 'fair standard'} coin${(resCfg.coinCount || 1) === 1 ? '' : 's'} — ${outcomeTableRecord.name || 'Random Effects'}`
        : `Roll 1${resCfg.diceType || 'd6'} — ${outcomeTableRecord.name || 'Random Effects'}`;
    const branchList = compiledOutcome.ok
      ? compiledOutcome.outcomeTable.branches.map((branch) => ({
          outcome: `${describeMatcher(branch.matcher, compiledOutcome.outcomeTable.mechanic, compiledOutcome.outcomeTable.spec.count)} (${branch.label})`,
          text: describeBranchEffect(branch.effect)
        }))
      : outcomeTableRecord.entries.map((entry, idx) => {
          const matcherLabel = resType === 'CARDS'
            ? (entry.cardPattern || `Card ${idx + 1}`)
            : resType === 'COINS'
              ? (entry.coinPattern || `Coin ${idx + 1}`)
              : entry.range
                ? (entry.range.min === entry.range.max ? `Roll ${entry.range.min}` : `Roll ${entry.range.min}–${entry.range.max}`)
                : `Branch ${idx + 1}`;
          const cfg = entry.effectConfig || {};
          const effSummary = entry.effectType === 'damage'
            ? `${cfg.damageFormula || '1d6'} ${cfg.damageType || 'ember'} damage`
            : entry.effectType === 'healing'
              ? `${cfg.healingFormula || '1d6'} healing`
              : entry.description || entry.effectType || 'Custom effect';
          return {
            outcome: `${matcherLabel} (${entry.name || `Branch ${idx + 1}`})`,
            text: effSummary
          };
        });
    const details = def?.capability === OUTCOME_CAPABILITY
      ? ['Resolved outcome selects one branch effect; cast AP and mana price is paid once per cast.']
      : resType === 'CARDS'
        ? [CARD_UNSETTLED_REASON]
        : (resType === 'COINS' && resCfg.coinType === 'weighted')
          ? [WEIGHTED_COIN_REFUSAL]
          : compiledOutcome.reason ? [compiledOutcome.reason] : [];
    steps.push({
      id: 'outcome-table',
      label: def?.capability === OUTCOME_CAPABILITY ? 'OUTCOME' : 'OUTCOME (MANUAL)',
      summary: mechanicSummary,
      branches: branchList,
      details
    });
  }

  // 4. Persistent / Periodic / Rider effects
  const authoredCond = draft.controlConfig?.authoredCondition;
  const compiledCond = def?.effects?.condition;
  if (periodicInfo) {
    const boundaryText = periodicInfo.boundary === 'start' ? 'target turn start' : 'target turn end';
    steps.push({
      id: 'persistent',
      label: 'WHILE',
      summary: `${periodicInfo.label}: ${periodicInfo.formula}${periodicInfo.damageType ? ` ${periodicInfo.damageType}` : ''} ${periodicInfo.kind} per tick (${periodicInfo.ticks} tick${periodicInfo.ticks === 1 ? '' : 's'} at ${boundaryText}).`,
      details: [
        'Each tick is scheduled automatically; the GM resolves each tick with its separate roll.',
        'Cast cost is paid once at activation; scheduled ticks have no extra cost.'
      ]
    });
  } else if (authoredCond || compiledCond) {
    const riderSummary = formatRiderSummary(authoredCond, compiledCond);
    if (riderSummary) {
      steps.push({
        id: 'persistent',
        label: def?.effects?.critGate ? 'ON CRIT' : 'WHILE',
        summary: riderSummary,
        details: def?.effects?.critGate
          ? ['Applies only when this spell\'s direct damage die rolls its maximum face value (critical hit); normal hits deal damage only.']
          : []
      });
    }
  }

  // 5. Expiry / Duration
  if (periodicInfo) {
    const expiry = formatAuthoredExpiry(periodicInfo.expiryPolicy, periodicInfo.ticks);
    steps.push({
      id: 'expiry',
      label: 'UNTIL',
      summary: expiry || (periodicInfo.durationText || 'GM removes effect'),
      details: periodicInfo.durationText && expiry ? [`Authored duration: ${periodicInfo.durationText}`] : []
    });
  } else if (authoredCond || compiledCond) {
    const policy = authoredCond?.expiryPolicy ?? def?.timing?.expiryPolicy;
    const occ = authoredCond?.occurrences ?? def?.timing?.occurrences;
    const expiry = formatAuthoredExpiry(policy, occ);
    const durText = authoredCond?.durationText || def?.timing?.durationText || '';
    steps.push({
      id: 'expiry',
      label: isRecordManual ? 'UNTIL (MANUAL)' : 'UNTIL',
      summary: isRecordManual
        ? (expiry ? `${expiry} (not auto-tracked while whole ability is manual; GM tracks and removes at the table)` : 'GM removes effect')
        : (expiry || 'GM removes effect'),
      details: durText ? [`Authored duration: ${durText}`] : []
    });
  }

  // 6. Optional follow-up / Component watch (ONLY when a real execution dependency exists)
  // Whole-spell follow-up B: another qualifying cast -> B is offered -> pay and execute B (placed BEFORE ACTIVATE).
  // Component watch A: execute A -> its watched component qualifies -> separate B is offered (placed AFTER execution).
  if (triggerPlan?.runs) {
    const isWatch = triggerPlan.heading === 'Watched part trigger';
    if (isWatch) {
      steps.push({
        id: 'followup',
        label: 'WATCH → OFFER',
        scopeKind: 'component-watch',
        scopeBadge: 'Watches 1 exact part of this admitted version → offers a separate spell',
        summary: 'After this spell executes, if its direct damage part removes ≥ 1 base HP after temp HP → a separate GM-paired follow-up spell is offered.',
        details: [
          def?.save
            ? 'Qualification: only the direct damage part counts (its save changes how much damage this part deals; only base HP actually removed after the recorded save and temp HP counts, and GM corrections never trigger it).'
            : 'Qualification: only the direct damage part counts (other parts, saves, temp HP absorbed, and GM corrections never trigger it).',
          'Exact part & version: binds only to this exact admitted version\'s Direct Damage part, never the whole spell or another part. Saving or admitting alone never activates the watch — the GM pairs this exact admitted version with one primary character and one separate follow-up spell; other or edited versions are not watched unless admitted and registered separately.',
          'Consequence & later turn: one offer per cast, lapsing at the caster\'s next authenticated turn start. The separate follow-up is optional at its own full ordinary price and cooldown; this spell is never offered as its own follow-up and never partially casts, chains, or auto-recasts.'
        ]
      });
    } else {
      const isHealingFollowUp = def?.followUp === 'follow-up-after-healing' ||
        triggerPlan.lines?.some((line) => line.kind === 'event' && line.text.includes('immediate healing'));
      const qualificationText = isHealingFollowUp
        ? 'Another qualifying cast\'s immediate healing restores ≥ 1 actual HP (after max-HP cap) to a creature or another primary PC (not yourself) → this spell is offered.'
        : 'Another qualifying cast\'s immediate damage removes ≥ 1 base HP from a creature → this spell is offered.';
      steps.unshift({
        id: 'followup',
        label: 'OFFERED WHEN',
        scopeKind: 'whole-spell',
        scopeBadge: 'Whole-spell follow-up · another qualifying cast offers this spell',
        summary: qualificationText,
        details: [
          'If accepted, pay and execute this spell below at its own full ordinary price and normal cooldown (declining costs nothing).',
          'Requires GM pairing with one primary character first; never self-offers, partially casts, chains, or auto-recasts.'
        ]
      });
    }
  }

  // 7. Cooldown
  if (isSupportedCombatCooldown(draft.cooldownConfig)) {
    const val = draft.cooldownConfig.cooldownValue ?? draft.cooldownConfig.value;
    const n = Number.isSafeInteger(val) ? val : 1;
    steps.push({
      id: 'cooldown',
      label: isRecordManual ? 'COOLDOWN (MANUAL)' : 'COOLDOWN',
      summary: isRecordManual
        ? `Reuse after ${n} strictly upcoming caster-turn start${n === 1 ? '' : 's'} — tracked manually at the table while whole ability is manual.`
        : `Reuse after ${n} strictly upcoming caster-turn start${n === 1 ? '' : 's'}`,
      details: []
    });
  } else if (draft.cooldownConfig?.cooldownType && draft.cooldownConfig.cooldownType !== 'none') {
    steps.push({
      id: 'cooldown',
      label: 'COOLDOWN (MANUAL)',
      summary: 'Cooldown preserved as written; tracked manually at the table.',
      details: []
    });
  }

  // Manual / unsupported sections disclosure
  const manualSections = [];
  if (compat.reasons.length > 0) {
    compat.reasons.forEach((r) => {
      manualSections.push({ label: r.label, text: r.text });
    });
  }
  if (triggerPlan && !triggerPlan.runs) {
    triggerPlan.lines.forEach((line) => {
      manualSections.push({ label: 'Stored trigger / rule', text: line.text });
    });
  }
  if (isNonExecutable && Array.isArray(compat.manual) && compat.manual.length > 0) {
    compat.manual.forEach((text) => {
      manualSections.push({ label: 'GM / table play', text });
    });
  }

  const preservedLabels = compat.preserved.map((item) => item.label);
  const disclaimer = isNonExecutable && preservedLabels.length > 0
    ? 'All authored sections are preserved as written. Having a supported component does not make the whole record executable.'
    : '';

  return {
    supportBadge,
    liveState,
    steps,
    manualSections,
    preservedLabels,
    disclaimer
  };
}
