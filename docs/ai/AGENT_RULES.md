# Agent rules (router)

Root [`AGENTS.md`](../../AGENTS.md) stays the entry instruction (Mind/Context7/Playwright, build rules). This page routes you to the one contract you need. Audits are background evidence, not instructions.

## Before you touch code

1. Read [CURRENT_PRIORITIES.md](CURRENT_PRIORITIES.md): which project is active, which gates are open, who owns what right now.
2. Read the active project's contract in `docs/` (for example `MYTHRILL_PROJECT_9_CONTRACT.md`). The roadmap is [`MYTHRILL_NEXT_PHASE.md`](../MYTHRILL_NEXT_PHASE.md) §26; its project text is the original scope. Later design inputs (rev3, Laws drafts) inform a project; they never silently replace it.
3. Find the owning file and its tests in [ARCHITECTURE_MAP.md](ARCHITECTURE_MAP.md). Change the owner, not a copy.
4. Follow [IMPLEMENTATION_PROTOCOL.md](IMPLEMENTATION_PROTOCOL.md) for compatibility, migration, rollback and verification.

## Hard limits

- One bounded project at a time. No general rules engine, rules DSL or recursive triggers; unsupported effects stay manual with a diagnostic.
- Accepted phases stay accepted. A later project may change an accepted file only for its own authorized behavior, and must re-run that file's focused checks.
- Creator decisions are not engineering choices. Approved rules stay approved; proposed defaults stay labelled `[Proposed]`; unresolved items stay labelled `[Open]` in player text.
- Never pre-spend. One P7 command per consequence group (two actors at most). Never say "nothing was spent" after any group was submitted.
- No commit, push or deployment unless the creator asks. Preserve concurrent worktree changes; another agent may own a file right now (see CURRENT_PRIORITIES).
- Implementer evidence is not acceptance. A separate reviewer gives the bounded verdict.

## Stop and ask when

- A rule or canon question is genuinely undecided and blocks the edit: ask for the smallest decision, with an example and a recommendation, and keep doing independent work.
- Work starts turning into balance redesign, archive reconciliation, a broad audit or a claim of readiness without live evidence.
