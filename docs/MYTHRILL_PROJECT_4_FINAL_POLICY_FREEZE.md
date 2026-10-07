# PROJECT 4 FINAL POLICY FREEZE

**Project:** 4 — Room and Private-Data Access Boundary  
**Finalized:** 2026-10-05  
**Verdict:** READY FOR IMPLEMENTATION  
**Authority:** Creator's explicit H1/H2/H14 approval and acceptance of the previously supplied Project 4 architecture freeze.

This is the minimal final policy addendum to **PROJECT 4 ARCHITECTURE AND POLICY FREEZE**, supplied in the preceding architecture review. It replaces that review's human-policy BLOCKED verdict, recommendations, unresolved options, and conditional sharing wording with the approved policy below. The accepted engineering contracts, resource matrices, implementation file plan, failure semantics, compatibility, rollout/rollback, and test/rehearsal requirements carry forward. Historical source observations remain observations, not claims that implementation has happened.

Primary project routing remains `docs/MYTHRILL_NEXT_PHASE.md`; P3's checkpoint boundary remains `docs/MYTHRILL_PROJECT_3_ARCHITECTURE_FREEZE.md`. This approval resolves the P4 H1/H2/H14 questions in the roadmap's Human Decision Register. No further source audit was performed.

## H1

**APPROVED — EXPLICIT OPT-IN DISCOVERY + OPEN/PASSWORD ADMISSION + OPTIONAL RECIPIENT-BOUND GM INVITATIONS + DURABLE MEMBERSHIP UNTIL EXPLICIT REVOCATION.**

1. Public discovery requires explicit owner opt-in through `settings.isPrivate === false`. Missing/legacy privacy state is not public by default. The existing frozen active-room listing condition still applies.
2. `isPrivate` controls discovery visibility. It does not mean invitation-only admission.
3. Initial admission supports open rooms, password-protected rooms, and optional recipient-bound GM invitations. Mythrill is not invitation-only; invitations are an additional controlled admission mechanism.
4. Successful legitimate admission to a permanent room establishes durable verified UID membership.
5. Durable membership continues until explicitly revoked. Disconnecting or leaving the active session does not revoke it.
6. GM kick or explicit membership removal revokes entitlement, including the matching device access required by the accepted contract.
7. A removed user may later legitimately rejoin through open/password admission if that room still permits it, unless separately banned according to existing/future policy. Kick is not silently promoted to a permanent ban.

The frozen discovery projection remains exactly: `id`, `name`, `playerCount`, `maxPlayers`, `gm`, `createdAt`, `hasPassword`, `gmOnline`. Discovery does not expose full room state, member UID rosters, private character/inventory data, hashes/passwords, or private artwork URLs.

## H2

**APPROVED — NON-ANONYMOUS SIGNED-IN ACCOUNTS FOR DURABLE MULTIPLAYER + LOCAL GUEST/SANDBOX PLAY PRESERVED.**

1. Permanent/durable cloud rooms require a normal non-anonymous authenticated account.
2. Tokenless guests do not receive durable permanent-room membership.
3. Firebase anonymous identities do not receive durable permanent-room membership in the first supported version.
4. Existing local/offline/sandbox guest workflows remain supported where they already exist. Cloud account requirements do not remove local guest play.
5. A future explicit guest/anonymous durable policy is separate work; this approval creates no additional guest mode or temporary-room product policy.

The approved identity boundary applies to permanent-room admission, durable entitlement, entitled cloud reads, and resume, consistently across direct/password/invitation paths. Verified provider identity is required; payload identifiers and UI checks are not identity proof.

## H14

**APPROVED — OWNER-PRIVATE BY DEFAULT + OPTIONAL EXPLICIT REVOCABLE SESSION-SCOPED GM INVENTORY SHARE + DELIBERATE AUTHENTICATED COMMUNITY ART COPIES + BUILT-IN FALLBACK + NO BEARER-LINK SHARING + NO CLAIM OF ROOM-ONLY REVOCABLE URL PRIVACY.**

### Inventory

1. Inventory is owner-private by default. GM status alone grants no visibility.
2. P4 supports an optional explicit session-scoped GM inventory share. Supporting this flow is required; granting a share is the owner's choice.
3. The owner deliberately grants a read-only share bound to the exact room/session, exact character, and exact current GM UID.
4. The owner can revoke it. It terminates when the membership/session/GM conditions required by the accepted contract end.
5. Consent does not silently return after restart/rejoin and grants no inventory mutation authority.
6. Without active consent, the GM receives no private inventory projection.

Verified owner-device targeting, echo-safe application, duplicate protection, and privacy projection across join/presence/character/token/recovery envelopes remain mandatory. Client filtering after packet receipt is not privacy enforcement.

### Uploaded art

1. User uploads are owner-private by default.
2. Deliberate publication copies an asset into the existing authenticated community/shared publication domain, including the frozen `shared/{uid}/{category}/{file}` convention.
3. A failed publication/copy must not expose the original private URL as a fallback.
4. A viewer without legitimate private-art access receives the supported built-in/default fallback.
5. P4 does not implement bearer-link publication or implement/promise revocable room-only access through the existing Firebase download-URL mechanism. URL possession is not an authorization grant.
6. Existing deliberately published community copies retain their defined authenticated audience.

Owner-bound cleanup, no-delete on unknown ownership/bucket/path or unproven exclusive deletion scope, and shared/system asset protection remain as previously frozen. No room-only artwork namespace or reference-counted garbage collector is introduced.

## POLICY CONSISTENCY CHECK

**PASS — the accepted engineering architecture is consistent with all three approvals.**

| Frozen section | Authoritative resulting contract |
|---|---|
| Discovery | Explicit owner opt-in with `settings.isPrivate === false`; missing/legacy state unlisted; existing shallow server projection and active-room condition retained. |
| Room reads | Raw initialized roots/checkpoint fragments remain server-only SDK resources. Verified GM/entitled members receive server-authorized privacy projections. Public discovery never grants state entitlement. |
| Admission | Open/password entry and optional recipient-bound GM invitations share the accepted authentication/ownership/role/capacity gate before side effects. Permanent rooms enforce approved H2. |
| Durable membership | Verified UID grant precedes successful permanent-room admission. Entitlement lasts until explicit revocation; session departure preserves it; kick/removal revokes it; later lawful re-admission remains possible absent a ban. |
| Invitations | Additional admission mechanism only. Accepted typed, recipient-bound, expiring, one-time GM invitation contract retained; ambiguous old invitations require visible reissue. |
| Inventory | Owner-device delivery only, plus the required optional read-only owner-consented GM flow. Exact room/session/character/current-GM binding, revocation, termination and no silent restoration are mandatory. |
| Uploaded art/publication | Owner-private uploads, deliberate authenticated community copies, failure without private-original exposure, built-in fallback. Bearer-link publication and room-only revocable URL claims are excluded. |
| Firestore rule matrix | Existing raw server-only room/checkpoint boundary, safe owner-draft exception, and owner-private personal persistence retained. Permanent-room permissions use non-anonymous account policy. Client membership/checkpoint bypasses remain denied. Consent grants a server-delivered inventory projection, not direct GM access to private user/character documents. |
| Storage rule matrix | Existing owner-private user/legacy paths, authenticated deliberate shared copies, protected system assets, and default deny retained. No room-wide grant over private user paths; no URL-based entitlement. Cleanup authority still needs its separate owner-bound proof. |
| Server/rule consistency matrix | Server identity, durable entitlement, resource permissions, outbound audience, and client expectations use the same approved policy. UI visibility is never authorization. |
| Required tests | The prior 40 baseline cases and narrowly necessary additions remain required. H1/H2/H14 alternatives and “if approved” clauses now use the approved mandatory expectations below. |
| Manual rehearsal | The prior two-real-staged-account/copy-legacy-room rehearsal remains required, including actual consent grant/revoke/termination and publication-failure/fallback proof. No production destructive migration. |

### Required test wording finalized

The existing test contract now unconditionally requires:

- Explicitly public active rooms are discoverable; private, missing and legacy privacy state is not. The discovery payload contains only the frozen eight fields.
- Open, password and recipient-bound GM invitation admission work with the same role/capacity/identity checks. `isPrivate` does not disable legitimate admission by silently becoming invitation-only.
- Successful permanent-room admission establishes durable UID entitlement. Disconnect/session leave retain it; kick/removal revoke it; later legitimate open/password re-admission works unless separately banned.
- Tokenless and Firebase anonymous identities cannot gain durable permanent-room membership or bypass entitled durable reads/resume. Normal non-anonymous account flows work; existing local guest play remains supported.
- No-consent GM inventory delivery is absent. Explicit read-only consent delivers only to the bound current GM; revocation and required membership/session/GM termination stop delivery. Restart/rejoin does not restore consent, and GM inventory mutation is denied.
- Inventory privacy holds for all frozen alternate envelopes and is proved by non-delivery, not client ignoring.
- Deliberate art-copy publication uses the authenticated shared domain. Failed copy never publishes the private original; unauthorized private-art viewers use built-in/default fallback. No bearer-link publication flow or room-only revocable URL privacy claim is introduced.
- Existing authenticated community-copy access and built-in assets remain compatible.

Firestore/Storage emulator matrices, real-path socket fixtures, and deployed-version reporting remain required implementation/rollout evidence. No test result is asserted by this policy update.

### Manual rehearsal wording finalized

Account A remains GM of Room A; Account B exercises member and foreign/revoked scenarios. The accepted rehearsal now includes the supported explicit inventory consent flow rather than a conditional choice:

- prove no B-private inventory delivery to A without consent;
- grant B's read-only share for the exact room/session/character/current A UID;
- prove delivery to the authorized GM only;
- revoke and exercise the frozen termination/restart/rejoin cases, proving no restored share or mutation permission;
- exercise deliberate authenticated art publication and a failed copy with built-in fallback, capturing proof that the private original URL is not disclosed.

All other accepted lobby, join/rejoin, invitation, room-read, token, public-profile, cross-room, owner-device, network/event capture and copied legacy-recovery scenarios remain required.

## ARCHITECTURE CHANGES REQUIRED

**None beyond recommendation → approved-policy wording and finalizing the already offered options.**

The creator accepted the engineering architecture. This addendum removes the policy blocker and makes the approved discovery/admission/identity/sharing audiences mandatory in its sections, matrices, tests and rehearsal. The earlier invitation-only and bearer-link alternatives are not selected P4 features.

No new architecture, product choices, source audit, implementation, data migration, rule deployment, or Function activation is authorized by this document update.

## HUMAN DECISIONS STILL REQUIRED

**None blocking P4 implementation. H1, H2 and H14 are approved.**

Existing evidence-based implementation stop conditions, selected-room recovery requirements and deployed-infrastructure verification gates remain applicable when encountered. They are not unresolved human-policy blockers and do not reopen these approvals.

## PROJECT 4 IMPLEMENTATION STATUS

**READY FOR IMPLEMENTATION — ARCHITECTURE AND POLICY FROZEN.**

- Project 1: LOCKED.
- Project 2: LOCKED.
- Project 3: CODE LOCKED; existing pre-deployment gates retained.
- Project 4: accepted engineering architecture plus authoritative H1/H2/H14 policy; implementation may begin in a separate task. No P4 implementation was performed in this update.
- Code completion, emulator verification, manual rehearsal, deployed Firestore/Storage rules, and cleanup Function deployment/enablement remain separate statuses and are not established by policy approval.
- This task changes only this policy document and durable decision/readiness records. Production runtime source is untouched; P5 was not begun; no commit, push or deployment occurred.

PROJECT 4 ARCHITECTURE IS FROZEN; DEEPSEEK IMPLEMENTATION MAY BEGIN.
