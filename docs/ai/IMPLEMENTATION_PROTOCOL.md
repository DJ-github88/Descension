# Implementation protocol

## One project

1. Identify the project and its original contract text. Note any later design inputs and what they may add.
2. Check who else is working in the tree (CURRENT_PRIORITIES, recent ledger entries). Do not write files another agent is freezing or building.
3. Record the starting identity: HEAD and the exact files you will change. Verify each starting text before editing; abort on drift instead of merging blind.
4. Make the bounded change in the owning file. Preserve each file's line endings (several are CRLF or mixed).
5. Write or update focused tests that read the owning value. Do not assert a duplicated literal everywhere.
6. Run the focused suites for every file you touched, including accepted-phase files.
7. Write a short handoff: what changed, why, tests run with results, known limits, open gates.
8. A separate reviewer gives the bounded verdict. One repair cycle for demonstrated failures; re-check only affected behavior.

## Compatibility and migration

- Never change saved character, class, heritage or token IDs. Preserve links and aliases.
- No silent migration of player data. Raising a maximum must not reset current values; temporary pools are kept.
- Static content: bump `DATA_VERSIONS` and confirm the new text actually renders.
- Canon edits preserve IDs, `relatedTerms`, cultural traditions and custom-world overrides.

## Rollback

Each project names its rollback boundary. Content: restore the previous JSON and version. Behavior: revert the bounded code change; keep tests that document the intended contract with the decision record.

## Verification routing

- Pure logic and data-to-summary: Jest (`npx react-scripts test --watchAll=false <paths>`), split into bounded runs on the device.
- Server contracts: `server/` Mocha suites named in the contract.
- UI and rendered text: real browser (Playwright/Chrome). Prefer DOM assertions over screenshots.
- Production build: detached process only (see root AGENTS.md); never in the foreground shell.
- Keep bulky build copies and generated evidence outside Git; retain reusable tests, concise reports and necessary manifests.
