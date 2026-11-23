/** Creator policy and shared test-rule contract for placed map abilities (Traps, Inscriptions, Totems).
 *
 * Production stays fail-closed for arming (`creatorApproval: null`, `armedApproved() === false`):
 * GMs can place, inspect, recover across reconnect, and remove unarmed map placements, while
 * armed trigger evaluation remains disabled until PE1-PE4 receive creator approval.
 *
 * No object/array spread on purpose: this file is bundled as CommonJS by the client build
 * and mirrored byte-identically into `server/shared/services/placedEffectPolicy.js`. */
const CONTRACT = 'placed-effect:v1';
const FAMILIES = Object.freeze(['placed', 'trap', 'inscription', 'totem']);
const VISIBILITY_MODES = Object.freeze(['gm-only', 'owner-and-gm', 'public']);
const EXPIRY_MODES = Object.freeze(['manual-only', 'consume-on-first-trigger']);
const PAYMENT_MODES = Object.freeze(['none']);
const RELATIONSHIPS = Object.freeze(['enemy', 'ally', 'any']);
const ACTOR_KINDS = Object.freeze(['creature', 'any']);
const DECISIONS = Object.freeze([
  'PE1_TRIGGER_ELIGIBILITY',
  'PE2_PAYMENT',
  'PE3_VISIBILITY',
  'PE4_EXPIRY'
]);

const UNAPPROVED_ARMING_REASON = 'Trigger eligibility, payment, visibility, and expiry rules for armed placed effects await creator approval; placements remain unarmed GM map records.';

const POLICY = Object.freeze({
  contract: CONTRACT,
  decisions: DECISIONS,
  creatorApproval: null,
  unapprovedRules: Object.freeze({
    armedAllowed: false,
    triggerEligibility: null,
    payment: 'none',
    visibility: 'owner-and-gm',
    expiry: 'manual-only'
  }),
  proposedTrapRules: Object.freeze({
    triggerEligibility: Object.freeze({
      actorKind: 'creature',
      relationship: 'enemy',
      voluntaryMoveOnly: true
    }),
    payment: 'none',
    visibility: 'owner-and-gm',
    expiry: 'consume-on-first-trigger'
  }),
  request: 'docs/PLACED_EFFECT_FOUNDATION.md'
});

function approvedEntry() {
  const approval = POLICY.creatorApproval;
  return !!(approval && typeof approval.reference === 'string' && approval.reference.trim());
}

function armedApproved() {
  return approvedEntry();
}

function activeRules() {
  if (!armedApproved()) {
    return POLICY.unapprovedRules;
  }
  return Object.freeze({
    armedAllowed: true,
    triggerEligibility: POLICY.proposedTrapRules.triggerEligibility,
    payment: POLICY.proposedTrapRules.payment,
    visibility: POLICY.proposedTrapRules.visibility,
    expiry: POLICY.proposedTrapRules.expiry
  });
}

module.exports = {
  CONTRACT: CONTRACT,
  FAMILIES: FAMILIES,
  VISIBILITY_MODES: VISIBILITY_MODES,
  EXPIRY_MODES: EXPIRY_MODES,
  PAYMENT_MODES: PAYMENT_MODES,
  RELATIONSHIPS: RELATIONSHIPS,
  ACTOR_KINDS: ACTOR_KINDS,
  DECISIONS: DECISIONS,
  UNAPPROVED_ARMING_REASON: UNAPPROVED_ARMING_REASON,
  POLICY: POLICY,
  armedApproved: armedApproved,
  activeRules: activeRules
};
