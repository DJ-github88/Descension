/** Common execution representation v1 (handoff/unified-component-trigger-execution-successor/CONTRACT.md).
 * One pure, deterministic description of the STRUCTURE of what an authored ability executes: its parts, the order of
 * its stages, whether it pays and cools down, and which approved follow-up subscription (if any) it carries. It also
 * says which part of a saved Wizard record a trigger governs. It is a compatibility adapter: admitted definitions,
 * their hashes and the Wizard compiler are untouched. A plan never grants authority; matching a predicate is only the
 * `subscribed` rung of AUTHORITY_LADDER, and the room server decides `permitted` on every execution.
 * Coverage (see COVERAGE): a plan does NOT describe effect parameters, save branches or timing. An immediate, a
 * periodic and an expiring part look the same here, so two different admitted definitions may share a planHash.
 * planHash is descriptive only: it is not admission identity and must never be used as an authority or cache key.
 * No object/array spread on purpose: this file is bundled as CommonJS by the client build. */
const { canonical, sha256Hex } = require('./canonicalHash');
const authored = require('./authoredAbility');

const PLAN_VERSION = 'execution-plan:v1';
const SCOPE_WHOLE = 'whole-spell';
const SCOPE_COMPONENT = 'component';
const AUTHORITY_LADDER = Object.freeze(['admitted', 'activated', 'subscribed', 'permitted']);
/** Every state a trigger can be in, lowest first. `stored` (saved in a library) is below the ladder: it is all a
 * static explanation can ever claim, because the higher states need a room, a GM pairing and a live offer. */
const AUTHORITY_STATES = Object.freeze(['stored', 'admitted', 'activated', 'subscribed', 'permitted']);
/** What a plan describes and what it deliberately leaves to the canonical definition and the existing effect routes. */
const COVERAGE = Object.freeze({
  describes: Object.freeze(['components', 'stage-order', 'payment-presence', 'cooldown-presence', 'follow-up-subscription']),
  omits: Object.freeze(['effect-parameters', 'save-branches', 'timing', 'periodic-ticks', 'expiry'])
});
const LIMITS = Object.freeze({ components: 16, stages: 32, subscriptions: 8, authoredTriggers: 64 }); // engineering limits, never game rules
const STAGE_KINDS = Object.freeze(['targeting', 'payment', 'resolution', 'cooldown']);
const EVIDENCE = Object.freeze({
  'immediate-damage': Object.freeze(['committed', 'adjudicatedAmount', 'baseHpLost', 'tempHpAbsorbed']),
  'immediate-healing': Object.freeze(['committed', 'adjudicatedAmount', 'hpRestored'])
});
const KEY = /^[A-Za-z][A-Za-z0-9_-]{0,63}$/;

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) { Object.freeze(value); Object.keys(value).forEach(k => deepFreeze(value[k])); }
  return value;
}
const plain = v => !!v && typeof v === 'object' && !Array.isArray(v);
const exact = (v, names) => plain(v) && Object.keys(v).length === names.length && names.every(n => Object.prototype.hasOwnProperty.call(v, n));
const emptyish = v => v === undefined || v === null || (typeof v === 'object' && Object.keys(v).length === 0);
function PlanError(code, message) { const e = Error(message || code); e.code = code; return e; }
const refuse = (code, message) => { throw PlanError(code, message); };

/** The one creator-approved executable subscription (T1-T6, damage only). Data, not permission. */
const FOLLOWUP_SUBSCRIPTION = deepFreeze({
  subscriptionId: 'follow-up-after-damage',
  contract: authored.FOLLOWUP_TRIGGER,
  scope: { kind: SCOPE_WHOLE },
  on: { occurrence: 'immediate-damage', role: 'source', evidence: 'baseHpLost' },
  minimum: 1,
  sourceKinds: ['character'],
  primarySourceOnly: true,
  targetKinds: ['creature'],
  response: { procedure: 'exact-offer-ordinary-cast', optional: true, price: 'ordinary', cooldown: 'ordinary', targeting: 'own', consent: 'own' },
  lifetime: { per: 'originating-receipt', lapse: 'authenticated-source-next-turn:v1' },
  chain: 'none',
  activation: 'gm-registration',
  authority: { reference: 'handoff/first-playable-trigger/CREATOR_APPROVAL.md#creator-approval-10-november-2026', scope: 'T1-T6' }
});
const TARGET_RULE_OTHER_PRIMARY = 'creature-or-other-primary-character:v1';
/** The second creator-approved executable subscription (H1-H3, healing only; H2 = b). Data, not permission.
 * Selected only by the healing marker: an unmarked ability can never be paired as a healing follow-up. */
const HEALING_FOLLOWUP_SUBSCRIPTION = deepFreeze({
  subscriptionId: 'follow-up-after-healing',
  contract: authored.FOLLOWUP_HEALING_TRIGGER,
  scope: { kind: SCOPE_WHOLE },
  on: { occurrence: 'immediate-healing', role: 'source', evidence: 'hpRestored' },
  minimum: 1,
  sourceKinds: ['character'],
  primarySourceOnly: true,
  targetKinds: ['creature', 'character'],
  targetRule: TARGET_RULE_OTHER_PRIMARY,
  response: { procedure: 'exact-offer-ordinary-cast', optional: true, price: 'ordinary', cooldown: 'ordinary', targeting: 'own', consent: 'own' },
  lifetime: { per: 'originating-receipt', lapse: 'authenticated-source-next-turn:v1' },
  chain: 'none',
  activation: 'gm-registration',
  authority: { reference: 'handoff/unified-component-trigger-execution-successor/CREATOR_APPROVAL.md#creator-approval-13-november-2026', scope: 'H1-H3' }
});
const SUBSCRIPTIONS = Object.freeze([FOLLOWUP_SUBSCRIPTION, HEALING_FOLLOWUP_SUBSCRIPTION]);
/** D1 contract, option (a) - APPROVED 14 November 2026 (handoff/component-scoped-trigger-execution-successor-20261114/CREATOR_APPROVAL.md#creator-approval-14-november-2026).
 * The definition that carries it is the ORIGINATING cast. Its event is the committed result of ONE named part of that
 * definition (never the whole cast and never another part). The consequence is the existing approved follow-up procedure for
 * a SEPARATE follow-up ability that the GM pairs with the watch. A watch never makes its own definition a follow-up. Data, not
 * permission: the room server checks the creator policy at registration, offer and approval. */
const COMPONENT_WATCH_CONTRACT = deepFreeze({
  watchId: 'watch-part-damage',
  contract: authored.COMPONENT_WATCH,
  scope: { kind: SCOPE_COMPONENT },
  on: { occurrence: 'immediate-damage', role: 'source', evidence: 'baseHpLost' },
  minimum: 1,
  sourceKinds: ['character'],
  primarySourceOnly: true,
  targetKinds: ['creature'],
  consequence: { procedure: 'exact-offer-ordinary-cast', of: 'gm-paired-follow-up', requires: 'follow-up-after-damage' },
  lifetime: { per: 'originating-receipt', lapse: 'authenticated-source-next-turn:v1' },
  chain: 'none',
  activation: 'gm-registration',
  authority: { reference: 'handoff/component-scoped-trigger-execution-successor-20261114/CREATOR_APPROVAL.md#creator-approval-14-november-2026', decision: 'D1', option: 'a' }
});
const approvedById = id => SUBSCRIPTIONS.find(item => item.subscriptionId === id) || null;
/** The approved subscription an authored marker selects, or null. */
const subscriptionForMarker = marker => SUBSCRIPTIONS.find(item => item.contract === marker) || null;
/** The approved subscription that listens for exactly this predicate, or null. */
const subscriptionForPredicate = on => (plain(on) && SUBSCRIPTIONS.find(item => canonical(item.on) === canonical(on))) || null;

const componentRef = (section, key) => ({ kind: SCOPE_COMPONENT, componentId: section + ':' + key });

/** Components of an admitted canonical definition. Identity is the definition's own structural key, never a name or index. */
function componentsOf(definition) {
  if (!plain(definition)) { refuse('plan_definition_invalid'); }
  const out = [];
  if (plain(definition.effect)) { out.push({ componentId: 'effect', kind: String(definition.effect.kind || 'effect') }); }
  if (plain(definition.effects)) {
    Object.keys(definition.effects).sort().forEach(key => {
      if (!KEY.test(key)) { refuse('plan_component_invalid'); }
      const part = definition.effects[key];
      out.push({ componentId: 'effects:' + key, kind: String((plain(part) && part.kind) || key) });
    });
  }
  if (!out.length || out.length > LIMITS.components) { refuse('plan_component_invalid'); }
  return out;
}

/** Canonical plan of one ADMITTED definition. `provenance` records where the subscription came from:
 * 'authored-marker' (the definition carries a Wizard marker, which selects the damage or the healing subscription) or
 * 'gm-registration' (the established GM-only pairing of an admitted ability without a marker, damage only).
 * Neither is permission. */
function planFromDefinition(definition, options) {
  const components = componentsOf(definition);
  const followUp = definition.followUp;
  const watch = definition.componentWatch;
  if (watch !== undefined && (followUp !== undefined || !plain(watch) || watch.contract !== COMPONENT_WATCH_CONTRACT.contract ||
      !components.some(c => c.componentId === watch.componentId && c.kind === 'damage'))) { refuse('plan_watch_invalid'); }
  const approved = followUp === undefined ? FOLLOWUP_SUBSCRIPTION : subscriptionForMarker(followUp);
  if (!approved) { refuse('plan_subscription_unsupported'); }
  const stages = [{ stageId: 'targeting', kind: 'targeting', dependsOn: [] }];
  const paid = plain(definition.resourceCost) || definition.classPayment !== undefined;
  if (paid) { stages.push({ stageId: 'payment', kind: 'payment', dependsOn: ['targeting'] }); }
  stages.push({ stageId: 'resolution', kind: 'resolution', dependsOn: [paid ? 'payment' : 'targeting'], components: components.map(c => c.componentId) });
  if (Object.prototype.hasOwnProperty.call(definition, 'cooldown')) { stages.push({ stageId: 'cooldown', kind: 'cooldown', dependsOn: ['resolution'] }); }
  // A definition that carries a watch is the originating cast of that watch: it is never itself paired as a follow-up.
  const wantPairing = !!(options && options.pairing) && watch === undefined;
  const subscriptions = followUp !== undefined || wantPairing
    ? [Object.assign({}, JSON.parse(JSON.stringify(approved)), { provenance: followUp !== undefined ? 'authored-marker' : 'gm-registration', after: 'resolution' })]
    : [];
  const plan = { version: PLAN_VERSION, components: components, stages: stages, subscriptions: subscriptions };
  if (watch !== undefined) {
    plan.watches = [Object.assign({}, JSON.parse(JSON.stringify(COMPONENT_WATCH_CONTRACT)), { componentId: watch.componentId, wizardKey: watch.wizardKey, after: 'resolution' })];
  }
  validatePlan(plan);
  return deepFreeze(plan);
}

/** Whole-or-nothing structural validation. Unknown keys, unknown kinds, dangling or cyclic dependencies and any
 * executable subscription that is not exactly one of the approved whole-spell contracts refuse the entire plan. */
function validatePlan(plan) {
  const watched = plain(plan) && Object.prototype.hasOwnProperty.call(plan, 'watches');
  if (!exact(plan, watched ? ['version', 'components', 'stages', 'subscriptions', 'watches'] : ['version', 'components', 'stages', 'subscriptions']) || plan.version !== PLAN_VERSION ||
      !Array.isArray(plan.components) || !Array.isArray(plan.stages) || !Array.isArray(plan.subscriptions) ||
      !plan.components.length || plan.components.length > LIMITS.components || !plan.stages.length || plan.stages.length > LIMITS.stages ||
      plan.subscriptions.length > LIMITS.subscriptions) { refuse('plan_invalid'); }
  const componentIds = new Set();
  plan.components.forEach(c => {
    if (!exact(c, ['componentId', 'kind']) || typeof c.componentId !== 'string' || !/^(effect|effects:[A-Za-z][A-Za-z0-9_-]{0,63})$/.test(c.componentId) ||
        typeof c.kind !== 'string' || !c.kind || componentIds.has(c.componentId)) { refuse('plan_component_invalid'); }
    componentIds.add(c.componentId);
  });
  const stageIds = new Map();
  plan.stages.forEach(s => {
    const names = s && s.kind === 'resolution' ? ['stageId', 'kind', 'dependsOn', 'components'] : ['stageId', 'kind', 'dependsOn'];
    if (!exact(s, names) || typeof s.stageId !== 'string' || !KEY.test(s.stageId) || !STAGE_KINDS.includes(s.kind) || !Array.isArray(s.dependsOn) ||
        stageIds.has(s.stageId) || new Set(s.dependsOn).size !== s.dependsOn.length) { refuse('plan_stage_invalid'); }
    if (s.kind === 'resolution' && (!Array.isArray(s.components) || !s.components.length || s.components.some(id => !componentIds.has(id)))) { refuse('plan_stage_invalid'); }
    stageIds.set(s.stageId, s);
  });
  plan.stages.forEach(s => s.dependsOn.forEach(id => { if (!stageIds.has(id)) { refuse('plan_dependency_unknown'); } }));
  // Iterative three-colour walk: bounded by LIMITS.stages, refuses any cycle (including a self-dependency) whole.
  const colour = new Map();
  plan.stages.forEach(root => {
    if (colour.get(root.stageId)) { return; }
    const stack = [[root.stageId, 0]];
    colour.set(root.stageId, 1);
    while (stack.length) {
      const top = stack[stack.length - 1], deps = stageIds.get(top[0]).dependsOn;
      if (top[1] >= deps.length) { colour.set(top[0], 2); stack.pop(); continue; }
      const next = deps[top[1]++];
      if (colour.get(next) === 1) { refuse('plan_dependency_cycle'); }
      if (!colour.get(next)) { colour.set(next, 1); stack.push([next, 0]); }
    }
  });
  const seen = new Set();
  plan.subscriptions.forEach(sub => {
    const approved = plain(sub) ? approvedById(sub.subscriptionId) : null;
    if (!approved) { refuse('plan_subscription_unsupported'); }
    const contractKeys = Object.keys(approved), names = contractKeys.concat(['provenance', 'after']);
    // An unmarked GM pairing exists only for the damage subscription; healing is selected by its marker alone.
    if (!exact(sub, names) || seen.has(sub.subscriptionId) || !['authored-marker', 'gm-registration'].includes(sub.provenance) ||
        (sub.provenance === 'gm-registration' && approved !== FOLLOWUP_SUBSCRIPTION) ||
        !stageIds.has(sub.after) || stageIds.get(sub.after).kind !== 'resolution') { refuse('plan_subscription_unsupported'); }
    seen.add(sub.subscriptionId);
    if (!plain(sub.scope) || sub.scope.kind !== SCOPE_WHOLE) { refuse('plan_scope_unapproved'); }
    const contract = {};
    contractKeys.forEach(k => { contract[k] = sub[k]; });
    if (canonical(contract) !== canonical(approved)) { refuse('plan_subscription_unsupported'); }
  });
  if (watched) {
    // One watch, on one damage part this plan resolves, exactly the engineering contract; never next to a follow-up subscription.
    if (!Array.isArray(plan.watches) || plan.watches.length !== 1 || plan.subscriptions.length) { refuse('plan_watch_invalid'); }
    const w = plan.watches[0], names = Object.keys(COMPONENT_WATCH_CONTRACT).concat(['componentId', 'wizardKey', 'after']);
    if (!exact(w, names) || !stageIds.has(w.after) || stageIds.get(w.after).kind !== 'resolution' ||
        !stageIds.get(w.after).components.includes(w.componentId) ||
        !plan.components.some(c => c.componentId === w.componentId && c.kind === 'damage') ||
        !Object.prototype.hasOwnProperty.call(authored.COMPONENT_WATCH_PARTS, w.wizardKey) || authored.COMPONENT_WATCH_PARTS[w.wizardKey].componentId !== w.componentId) { refuse('plan_watch_invalid'); }
    const contract = {};
    Object.keys(COMPONENT_WATCH_CONTRACT).forEach(k => { contract[k] = w[k]; });
    if (canonical(contract) !== canonical(COMPONENT_WATCH_CONTRACT)) { refuse('plan_watch_invalid'); }
  }
  return true;
}

const planHash = plan => sha256Hex(canonical(plan));
/** Deterministic dependency order (ties broken by stageId). Throws on an invalid plan. */
function orderedStages(plan) {
  validatePlan(plan);
  const done = new Set(), out = [];
  const pending = plan.stages.map(s => s.stageId).sort();
  while (out.length < pending.length) {
    const id = pending.find(candidate => !done.has(candidate) && plan.stages.find(s => s.stageId === candidate).dependsOn.every(dep => done.has(dep)));
    done.add(id); out.push(id);
  }
  return out;
}

/** Predicate only. True means "this typed occurrence is what the subscription listens for" - never "may execute". */
function matches(subscription, occurrence) {
  if (!plain(subscription) || !plain(occurrence) || !plain(subscription.on) || !plain(occurrence.evidence)) { return false; }
  const on = subscription.on;
  if (!EVIDENCE[on.occurrence] || !EVIDENCE[on.occurrence].includes(on.evidence) || occurrence.kind !== on.occurrence) { return false; }
  if (on.evidence === 'committed') { return true; }
  const value = occurrence.evidence[on.evidence];
  return Number.isSafeInteger(value) && value >= subscription.minimum;
}
const subscriptionOf = plan => (plan && plan.subscriptions && plan.subscriptions[0]) || null;
const watchOf = plan => (plan && plan.watches && plan.watches[0]) || null;
/** Target rule only. `facts.targetPrimary` is the room server's own finding that a character target is a primary
 * player character; this module never looks a token up. True means "this recipient is one the subscription counts". */
function targetQualifies(subscription, occurrence, facts) {
  if (!plain(subscription) || !plain(occurrence) || !plain(occurrence.target) || !Array.isArray(subscription.targetKinds)) { return false; }
  const target = occurrence.target;
  if (!subscription.targetKinds.includes(target.kind)) { return false; }
  if (subscription.targetRule === undefined) { return true; }
  if (subscription.targetRule !== TARGET_RULE_OTHER_PRIMARY) { return false; }
  if (target.kind === 'creature') { return true; }
  // Another primary player character: never the source itself, never a secondary attachment.
  return target.kind === 'character' && !!facts && facts.targetPrimary === true && plain(occurrence.source) &&
    canonical(target) !== canonical(occurrence.source);
}

// ---- Authored (Wizard) scope: preservation, explicit scope, honest refusal. Nothing here admits or executes. ----

const TRIGGER_SECTIONS = ['global', 'effectTriggers', 'conditionalEffects', 'buffDebuffTriggers', 'requiredConditions', 'triggerRole'];
const FOLLOWUP_TRIGGER_IDS = [authored.FOLLOWUP_TRIGGER_ID, authored.FOLLOWUP_HEALING_TRIGGER_ID];
/** Plain-language reasons shown on Review and card surfaces. Product words only: no code names, no file names. */
const REASONS = Object.freeze({
  component_scope_unapproved: 'Prism does not yet run a trigger attached to a single part of a spell. It is kept exactly as written and is never treated as a whole-spell trigger.',
  unsupported_trigger_predicate: 'Prism does not run this trigger event yet. It is kept exactly as written and resolved by hand at the table.',
  trigger_combination_unsupported: 'Prism runs this trigger only when it is the spell\'s single whole-spell trigger with no extra settings. It is kept exactly as written and resolved by hand.',
  conditional_effects_unsupported: 'Prism does not run conditional effect formulas yet. They are kept exactly as written and resolved by hand.',
  effect_attached_triggers_unsupported: 'Prism does not run triggers attached to an effect this spell creates. They are kept exactly as written and resolved by hand.',
  required_conditions_unsupported: 'Prism does not check required casting conditions yet. They are kept exactly as written and checked by hand.',
  trigger_role_unsupported: 'Prism does not cast a spell automatically or by force. This setting is kept exactly as written.',
  passive_activation_unapproved: 'Prism does not run passives yet: there is no rule for switching one on, what it costs or how passives stack. Saving it runs nothing; it is kept exactly as written.',
  spell_type_unsupported: 'Prism runs immediate actions only. This spell type is kept exactly as written and resolved by hand.',
  unknown_trigger_section: 'Prism does not recognise this trigger data. It is kept exactly as written and never run.',
  cyclic_component_dependency: 'These parts trigger each other in a loop, so the whole spell is resolved by hand.',
  malformed_trigger_data: 'This trigger data is not in a form Prism can read. It is kept exactly as written and never run.',
  too_many_triggers: 'This spell stores more triggers than Prism reads, so the whole spell is resolved by hand.',
  whole_definition_refused: 'Prism can run this trigger, but it does not run this spell as a whole, so the trigger is not run either.'
});

function triggerList(group) {
  if (!plain(group) || !Array.isArray(group.compoundTriggers)) { return null; }
  return group.compoundTriggers;
}
function triggerEntry(scope, section, trigger, index, list) {
  const ok = plain(trigger) && typeof trigger.id === 'string' && trigger.id;
  return { scope: scope, section: section, triggerId: ok ? trigger.id : null, name: ok && typeof trigger.name === 'string' ? trigger.name : null,
    // Order is authored data; two identical triggers under one scope stay distinct by their ordinal among equals.
    ordinal: ok ? list.slice(0, index).filter(t => plain(t) && canonical(t) === canonical(trigger)).length : index,
    contentHash: sha256Hex(canonical(trigger === undefined ? null : trigger)) };
}
/** The marker the installed compiler predicate gives this whole-spell trigger section on its own (every other section
 * at its inert default), or null. Asking the predicate itself means this module and the compiler can never disagree
 * about trigger syntax, and an unrelated refusal elsewhere in the record cannot mislabel an accepted trigger. */
function globalMarker(globalSection) {
  try {
    return authored.followUpTriggerFor({ global: globalSection, effectTriggers: {}, conditionalEffects: {}, buffDebuffTriggers: {},
      requiredConditions: { enabled: false, logicType: 'AND', conditions: [] }, triggerRole: { mode: 'CONDITIONAL' } });
  } catch (_) { return null; }
}

/** Explicit scope inventory of one saved Wizard record. Every authored relationship appears exactly once with its
 * own scope; nothing is dropped, merged or promoted. `status` is 'supported-shape' only for a single whole-spell
 * trigger whose own syntax the compiler accepts; that says nothing about the rest of the record, so it is never an
 * executable claim. Everything else is 'preserved-refused' with a reason code. */
function authoredScopes(record) {
  const draft = plain(record) && plain(record.authoredDraft) ? record.authoredDraft : record;
  const config = plain(draft) ? draft.triggerConfig : undefined;
  const entries = [], refusals = [], edges = [];
  const spellType = plain(draft) ? draft.spellType : undefined;
  if (spellType === 'PASSIVE') { refusals.push({ scope: { kind: SCOPE_WHOLE }, section: 'spellType', code: 'passive_activation_unapproved' }); }
  else if (spellType !== undefined && spellType !== 'ACTION') { refusals.push({ scope: { kind: SCOPE_WHOLE }, section: 'spellType', code: 'spell_type_unsupported' }); }
  if (emptyish(config)) { return finishScopes(entries, refusals, edges); }
  if (!plain(config)) { refusals.push({ scope: { kind: SCOPE_WHOLE }, section: 'triggerConfig', code: 'malformed_trigger_data' }); return finishScopes(entries, refusals, edges); }
  Object.keys(config).sort().forEach(section => {
    if (!TRIGGER_SECTIONS.includes(section)) { refusals.push({ scope: { kind: SCOPE_WHOLE }, section: section, code: 'unknown_trigger_section', contentHash: sha256Hex(canonical(config[section] === undefined ? null : config[section])) }); }
  });
  const global = triggerList(config.global);
  if (config.global !== undefined && !global) { refusals.push({ scope: { kind: SCOPE_WHOLE }, section: 'global', code: 'malformed_trigger_data' }); }
  const marker = global ? globalMarker(config.global) : null, approved = marker ? subscriptionForMarker(marker) : null;
  (global || []).forEach((trigger, index, list) => {
    const entry = triggerEntry({ kind: SCOPE_WHOLE }, 'global', trigger, index, list);
    if (approved && list.length === 1) { entry.status = 'supported-shape'; entry.subscriptionId = approved.subscriptionId; }
    else { entry.status = 'preserved-refused'; entry.code = FOLLOWUP_TRIGGER_IDS.includes(entry.triggerId) ? 'trigger_combination_unsupported' : 'unsupported_trigger_predicate'; }
    entries.push(entry);
  });
  if (plain(config.effectTriggers)) {
    Object.keys(config.effectTriggers).sort().forEach(key => {
      const scope = componentRef('effectTriggers', key), list = triggerList(config.effectTriggers[key]);
      if (!KEY.test(key) || !list) { refusals.push({ scope: scope, section: 'effectTriggers', code: 'malformed_trigger_data' }); return; }
      list.forEach((trigger, index, all) => {
        const entry = triggerEntry(scope, 'effectTriggers', trigger, index, all);
        entry.status = 'preserved-refused';
        entry.code = FOLLOWUP_TRIGGER_IDS.includes(entry.triggerId) ? 'component_scope_unapproved' : 'unsupported_trigger_predicate';
        entries.push(entry);
      });
      const override = config.effectTriggers[key].targetingOverride;
      if (override !== undefined && override !== null) { refusals.push({ scope: scope, section: 'effectTriggers.targetingOverride', code: 'unsupported_trigger_predicate' }); }
    });
  } else if (!emptyish(config.effectTriggers)) { refusals.push({ scope: { kind: SCOPE_WHOLE }, section: 'effectTriggers', code: 'malformed_trigger_data' }); }
  if (plain(config.conditionalEffects)) {
    Object.keys(config.conditionalEffects).sort().forEach(key => refusals.push({ scope: componentRef('conditionalEffects', key), section: 'conditionalEffects', code: 'conditional_effects_unsupported',
      contentHash: sha256Hex(canonical(config.conditionalEffects[key])) }));
  } else if (!emptyish(config.conditionalEffects)) { refusals.push({ scope: { kind: SCOPE_WHOLE }, section: 'conditionalEffects', code: 'malformed_trigger_data' }); }
  if (plain(config.buffDebuffTriggers)) {
    Object.keys(config.buffDebuffTriggers).sort().forEach(key => {
      const value = config.buffDebuffTriggers[key];
      refusals.push({ scope: componentRef('buffDebuffTriggers', key), section: 'buffDebuffTriggers', code: 'effect_attached_triggers_unsupported', contentHash: sha256Hex(canonical(value)) });
      if (plain(value) && typeof value.triggersEffect === 'string' && value.triggersEffect) { edges.push([key, value.triggersEffect]); }
    });
  } else if (!emptyish(config.buffDebuffTriggers)) { refusals.push({ scope: { kind: SCOPE_WHOLE }, section: 'buffDebuffTriggers', code: 'malformed_trigger_data' }); }
  if (plain(config.requiredConditions) ? (config.requiredConditions.enabled === true || (Array.isArray(config.requiredConditions.conditions) && config.requiredConditions.conditions.length > 0)) : !emptyish(config.requiredConditions)) {
    refusals.push({ scope: { kind: SCOPE_WHOLE }, section: 'requiredConditions', code: 'required_conditions_unsupported', contentHash: sha256Hex(canonical(config.requiredConditions)) });
  }
  if (!emptyish(config.triggerRole) && canonical(config.triggerRole) !== canonical({ mode: 'CONDITIONAL' })) {
    refusals.push({ scope: { kind: SCOPE_WHOLE }, section: 'triggerRole', code: 'trigger_role_unsupported', contentHash: sha256Hex(canonical(config.triggerRole)) });
  }
  return finishScopes(entries, refusals, edges);
}
function finishScopes(entries, refusals, edges) {
  if (entries.length > LIMITS.authoredTriggers) { refusals.push({ scope: { kind: SCOPE_WHOLE }, section: 'triggerConfig', code: 'too_many_triggers' }); entries.forEach(e => { e.status = 'preserved-refused'; if (!e.code) { e.code = 'too_many_triggers'; } delete e.subscriptionId; }); }
  // Authored component -> component edges (an effect that triggers another effect). A loop refuses the whole record.
  const graph = new Map();
  edges.forEach(edge => { if (!graph.has(edge[0])) { graph.set(edge[0], []); } graph.get(edge[0]).push(edge[1]); });
  let cyclic = false;
  graph.forEach((_targets, start) => {
    const seen = new Set(), stack = [start];
    while (stack.length && !cyclic) {
      const node = stack.pop();
      (graph.get(node) || []).forEach(next => { if (next === start) { cyclic = true; } else if (!seen.has(next)) { seen.add(next); stack.push(next); } });
    }
  });
  if (cyclic) { refusals.push({ scope: { kind: SCOPE_WHOLE }, section: 'buffDebuffTriggers', code: 'cyclic_component_dependency' }); }
  // Trigger-scope identity. An entry id is built only from where the trigger sits, what it says and its ordinal among
  // identical siblings, so an unrelated edit never changes it, reordering never retargets it and two identical siblings
  // stay distinct. It identifies authored trigger scope. It is NOT record identity and NOT admission identity.
  entries.forEach(e => { e.entryId = sha256Hex(canonical(['authored-trigger:v1', e.scope, e.section, e.contentHash, e.ordinal])); });
  refusals.forEach(r => { r.entryId = sha256Hex(canonical(['authored-refusal:v1', r.scope, r.section, r.code, r.contentHash || null])); });
  const scopes = { version: PLAN_VERSION, entries: entries, refusals: refusals };
  // The aggregate covers trigger data only: the spell-type refusal is about the record, not about a trigger.
  scopes.identity = sha256Hex(canonical({ entries: entries.map(e => e.entryId).sort(), refusals: refusals.filter(r => r.section !== 'spellType').map(r => r.entryId).sort() }));
  return deepFreeze(scopes);
}

// ---- One explanation for Review / card surfaces. ----

const PART_KINDS = ['damage', 'healing', 'buff', 'debuff', 'control', 'utility', 'summoning', 'transformation', 'purification', 'restoration'];
/** "damage_direct" -> "direct damage", "healing" -> "healing". Words only; the stored key is never changed. */
function partName(key) {
  const words = String(key).split('_').filter(Boolean);
  if (words.length === 2 && PART_KINDS.includes(words[0])) { return words[1] + ' ' + words[0]; }
  return words.join(' ');
}
function scopeLabel(scope) {
  if (scope.kind === SCOPE_WHOLE) { return 'the whole spell'; }
  return 'the ' + partName(scope.componentId.slice(scope.componentId.indexOf(':') + 1)) + ' part only';
}
const COST_WORDS = { actionPoints: 'AP' };
function priceText(definition) {
  if (!definition || !plain(definition.resourceCost)) { return ''; }
  const parts = Object.keys(definition.resourceCost).sort().filter(k => Number.isFinite(definition.resourceCost[k]))
    .map(k => definition.resourceCost[k] + ' ' + (COST_WORDS[k] || k));
  return parts.length ? ' (' + parts.join(', ') + ')' : '';
}
const EVENT_TEXT = {
  'follow-up-after-damage': 'When my primary character\'s immediate damage removes at least 1 base HP from a creature, this spell can be offered to me as a follow-up.',
  'follow-up-after-healing': 'When my primary character\'s immediate healing actually restores at least 1 HP, after the maximum-HP cap, to a creature or to another primary player character (actual HP restored), not yourself, this spell can be offered to me as a follow-up. Healing myself does not count, and neither does healing that restores nothing.'
};
/** `compiled` is the WHOLE-record result of the installed compiler ({ ok, definition } or { ok:false, reason }).
 * A supported trigger shape is reported executable only when the whole record compiled and carries its marker.
 * The result is a static reading of a saved record, so its `authority` is always 'stored': it can say what Prism
 * would run once the GM pairs it, never that anything is admitted, paired, subscribed or permitted in a room. */
function explain(record, compiled) {
  const scopes = authoredScopes(record);
  const wholeOk = !!(compiled && compiled.ok === true && plain(compiled.definition));
  let plan = null;
  if (wholeOk) { try { plan = planFromDefinition(compiled.definition); } catch (_) { plan = null; } }
  const subscription = subscriptionOf(plan), watch = watchOf(plan);
  const d = wholeOk ? compiled.definition : null;
  const watches = entry => !!watch && entry.scope.kind === SCOPE_COMPONENT && entry.triggerId === authored.FOLLOWUP_TRIGGER_ID &&
    entry.scope.componentId === 'effectTriggers:' + watch.wizardKey;
  const triggers = scopes.entries.map(entry => {
    const executable = watches(entry) || (entry.status === 'supported-shape' && !!subscription && subscription.provenance === 'authored-marker' &&
      subscription.subscriptionId === entry.subscriptionId);
    const code = executable ? null : entry.status === 'supported-shape' ? 'whole_definition_refused' : entry.code;
    return { entryId: entry.entryId, name: entry.name || entry.triggerId || 'Unnamed trigger', governs: scopeLabel(entry.scope), scope: entry.scope, executable: executable,
      optional: executable ? (watches(entry) ? true : subscription.response.optional) : null, code: code, reason: code ? REASONS[code] : null };
  });
  const manual = scopes.refusals.map(r => ({ entryId: r.entryId, governs: scopeLabel(r.scope), scope: r.scope, section: r.section, code: r.code, reason: REASONS[r.code] }));
  const watchRuns = !!watch && triggers.some(t => t.executable && t.scope.kind === SCOPE_COMPONENT);
  const runs = watchRuns || (!!subscription && triggers.some(t => t.executable));
  const lines = [];
  if (watchRuns) {
    const part = partName(watch.wizardKey), condition = d.effects && d.effects.condition;
    const other = condition ? (condition.kind === 'stunned' ? 'Stunned' : condition.label || 'the other part') : 'the other part';
    lines.push({ kind: 'event', text: 'When this spell\'s ' + part + ' part removes at least 1 base HP from a creature, a follow-up spell that the GM pairs with this watch can be offered to me.' });
    lines.push({ kind: 'scope', text: 'Only the ' + part + ' part is watched. ' + other + (d.effects && d.effects.save ? ', its saving throw' : '') + ' and any other part never count, and this is never treated as a whole-spell trigger.' });
    lines.push({ kind: 'qualifies', text: 'What counts is the base HP that part actually removed after temporary HP. A proposed or adjusted amount, damage absorbed by temporary HP and GM corrections do not count.' });
    lines.push({ kind: 'pairing', text: 'Saving or admitting this spell does not switch the watch on. The GM pairs it with one character and one follow-up spell first; this spell is never offered as its own follow-up.' });
    lines.push({ kind: 'optional', text: 'Using the follow-up is optional; declining costs nothing.' });
    lines.push({ kind: 'cost', text: 'The follow-up pays its own full ordinary price and starts its own normal cooldown.' });
    lines.push({ kind: 'cast', text: 'It uses its own targeting, range, rolls, saves and consent, and the GM confirms it like any cast.' });
    lines.push({ kind: 'lapse', text: 'One offer per cast of this spell. The offer lapses at the next authenticated turn start of the source.' });
    lines.push({ kind: 'chain', text: 'It cannot chain: a follow-up never sets off another follow-up.' });
    lines.push({ kind: 'unsupported', text: 'Not supported: watching a healing, movement or condition part, a watch on a one-part or area spell, and casting only part of a spell.' });
  } else if (runs) {
    lines.push({ kind: 'event', text: EVENT_TEXT[subscription.subscriptionId] });
    lines.push({ kind: 'scope', text: 'The trigger belongs to the whole spell.' });
    lines.push({ kind: 'pairing', text: 'Saving or admitting this spell does not switch the trigger on. The GM pairs it with one character first.' });
    lines.push({ kind: 'optional', text: subscription.subscriptionId === 'follow-up-after-healing'
      ? 'Using the follow-up is optional at its ordinary price; declining costs nothing.'
      : 'Using the follow-up is optional; declining costs nothing.' });
    lines.push({ kind: 'cost', text: (subscription.subscriptionId === 'follow-up-after-healing' ? 'It pays its full ordinary price' : 'It pays its full normal price') + priceText(d) + (plan.stages.some(s => s.kind === 'cooldown') ? ' and starts its normal cooldown.' : '.') });
    lines.push({ kind: 'cast', text: 'It uses its own targeting, range, rolls, saves and consent, and the GM confirms it like any cast.' });
    lines.push({ kind: 'lapse', text: 'One offer per originating cast. The offer lapses at the next authenticated turn start of the source.' });
    lines.push({ kind: 'chain', text: 'It cannot chain: a follow-up never sets off another follow-up.' });
  } else {
    triggers.forEach(t => { lines.push({ kind: 'stored-trigger', text: '"' + t.name + '" on ' + t.governs + ': ' + t.reason }); });
    manual.forEach(m => { lines.push({ kind: 'stored-section', text: (m.scope.kind === SCOPE_WHOLE ? '' : 'On ' + m.governs + ': ') + m.reason }); });
  }
  const flow = runs ? lines.map(line => line.text) : [];
  return deepFreeze({ version: PLAN_VERSION, authority: AUTHORITY_STATES[0], wholeExecutable: wholeOk, wholeRefusal: wholeOk ? null : String((compiled && compiled.reason) || 'This spell is resolved manually.'),
    planHash: plan ? planHash(plan) : null, scopeIdentity: scopes.identity, order: plan ? orderedStages(plan) : [], triggers: triggers, manual: manual, flow: flow,
    heading: watchRuns ? 'Watched part trigger' : runs ? 'Follow-up trigger' : lines.length ? 'Stored, not run by Prism' : null, lines: lines,
    executableClaim: runs });
}

module.exports = { COMPONENT_WATCH_CONTRACT, watchOf, PLAN_VERSION, SCOPE_WHOLE, SCOPE_COMPONENT, AUTHORITY_LADDER, AUTHORITY_STATES, COVERAGE, LIMITS, EVIDENCE, FOLLOWUP_SUBSCRIPTION, HEALING_FOLLOWUP_SUBSCRIPTION,
  SUBSCRIPTIONS, TARGET_RULE_OTHER_PRIMARY, REASONS, planFromDefinition, validatePlan, planHash, orderedStages, matches, targetQualifies, subscriptionOf, subscriptionForMarker,
  subscriptionForPredicate, authoredScopes, explain };
