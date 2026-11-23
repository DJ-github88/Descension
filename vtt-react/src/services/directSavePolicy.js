/** Creator policy for saves authored on a spell's Direct Damage part (handoff/direct-damage-save/CONTRACT.md).
 *
 * Already approved, used as is (not decided here): the table rolls the save and the GM records "saved" or "failed"; the VTT never
 * rolls, compares or validates it. The GM's final amount carries their mitigation ruling (with a reason when it differs from the
 * roll), and damage then comes off temporary HP first (P7).
 *
 * APPROVED 16 November 2026 for the single-part Direct Damage slice (handoff/direct-damage-save/CREATOR_APPROVAL.md): D-SV1 = rec. 1
 * (the GM's final amount is the pre-save damage; a recorded save halves it exactly once, rounded down, never below 0; then temporary HP,
 * then base HP) and D-SV3 = rec. 3 (the normal price is paid when the save negates all damage). D-SV2 and D-SV4 remain unapproved.
 * Options as presented (decision card 2026-11-16):
 *   - halves:  how a "half damage" save rounds and what is halved. Options presented: 'final-round-down' (halve the GM's final
 *              amount, round down, never below 0; recommended) and 'final-round-up'. Halving the roll before the GM's ruling is a
 *              third option this module does not implement (it changes what the GM enters).
 *   - negates: whether the price is paid when a damage-only spell's save negates all of it. Only option (a), "paid at cast", is
 *              implemented; option (b) would need a different payment route and stays refused whatever is recorded here.
 *
 * If an outcome's `creatorApproval` were null, nothing compiles, admits, approves or applies that outcome (fail closed). There is
 * no flag, environment variable or global; tests substitute this whole module through a disclosed test-only loader.
 * No object/array spread on purpose: this file is bundled as CommonJS by the client build. */
const CONTRACT = 'authored-direct-save:v1';
// Only the approved rule is implemented: any other value (including the presented 'final-round-up') fails closed, so no policy edit can
// silently change an admitted definition's arithmetic; a different rule needs a new reviewed release.
const HALVING_RULES = Object.freeze(['final-round-down']);
const PAYMENT_RULES = Object.freeze(['paid-at-cast']);
const POLICY = Object.freeze({
  contract: CONTRACT,
  outcomes: Object.freeze({
    halves: Object.freeze({ decision: 'D-SV1', rule: 'final-round-down',
      creatorApproval: Object.freeze({ reference: 'handoff/direct-damage-save/CREATOR_APPROVAL.md#creator-approval-16-november-2026', date: '2026-11-16', scope: 'D-SV1=rec-1 single-part Direct Damage' }) }),
    negates: Object.freeze({ decision: 'D-SV3', rule: 'paid-at-cast',
      creatorApproval: Object.freeze({ reference: 'handoff/direct-damage-save/CREATOR_APPROVAL.md#creator-approval-16-november-2026', date: '2026-11-16', scope: 'D-SV3=rec-3 single-part Direct Damage' }) })
  }),
  request: 'handoff/direct-damage-save/DECISION_CARD.md'
});
const UNAPPROVED_REASON = Object.freeze({
  halves: 'A save that halves the Direct Damage part is kept exactly as written and stays manual until the creator decides how half damage rounds (D-SV1).',
  negates: 'A save that negates all of a damage-only spell is kept exactly as written and stays manual until the creator decides whether the price is still paid (D-SV3).'
});
const approvedEntry = entry => !!(entry && entry.creatorApproval && typeof entry.creatorApproval.reference === 'string' && entry.creatorApproval.reference.trim());
/** The approved rule for `outcome`, or null (unanswered, unknown or not implemented: fail closed). */
function ruleFor(outcome) {
  const entry = Object.prototype.hasOwnProperty.call(POLICY.outcomes, outcome) ? POLICY.outcomes[outcome] : null;
  if (!approvedEntry(entry)) return null;
  if (outcome === 'halves') return HALVING_RULES.includes(entry.rule) ? entry.rule : null;
  if (outcome === 'negates') return PAYMENT_RULES.includes(entry.rule) ? entry.rule : null;
  return null;
}
const approved = outcome => ruleFor(outcome) !== null;
module.exports = { CONTRACT, POLICY, HALVING_RULES, PAYMENT_RULES, UNAPPROVED_REASON, ruleFor, approved };
