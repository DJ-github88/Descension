/** Creator policy for component-attached trigger execution (D1). APPROVED: D1 = (a), creator approval 14 November 2026
 * (handoff/component-scoped-trigger-execution-successor-20261114/CREATOR_APPROVAL.md#creator-approval-14-november-2026).
 * Approved meaning: the Direct Damage part that carries the card is the watched ORIGIN; only that part's actual base HP loss
 * qualifies, other parts never do; the GM pairs a SEPARATE existing follow-up B; T2-T6 unchanged; no partial casting and no
 * implicit whole-spell reinterpretation. One pairing per source is a temporary first-slice limit, not a game rule.
 * If `creatorApproval` were null, nothing would compile, admit, register or offer a component watch (the fail-closed
 * boundary). Nothing else changes this: there is no flag, environment variable or global. Tests may substitute this whole
 * module through a disclosed test-only loader to exercise that boundary.
 * No object/array spread on purpose: this file is bundled as CommonJS by the client build. */
const CONTRACT = 'authored-component-watch-trigger:v1';
const POLICY = Object.freeze({
  contract: CONTRACT,
  decision: 'D1',
  option: 'a',
  creatorApproval: Object.freeze({ reference: 'handoff/component-scoped-trigger-execution-successor-20261114/CREATOR_APPROVAL.md#creator-approval-14-november-2026', date: '2026-11-14', scope: 'D1=a' }),
  firstSliceLimits: Object.freeze(['one-pairing-per-source']),
  request: 'handoff/component-scoped-trigger-execution/CREATOR_DECISION.md'
});
const UNAPPROVED_REASON = 'Prism does not run a trigger attached to a single part of a spell while its creator approval is absent. It is kept exactly as written and is never treated as a whole-spell trigger.';
function approved() {
  const approval = POLICY.creatorApproval;
  return !!(approval && typeof approval.reference === 'string' && approval.reference.trim());
}
module.exports = { CONTRACT, POLICY, UNAPPROVED_REASON, approved };
