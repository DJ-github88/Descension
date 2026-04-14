# Mythrill VTT — Start Fixing Audit Issues

Read the following two files carefully before touching any code:

1. `D:\VTT\AUDIT_REPORT_DETAILED.md` — the full audit report with every issue, affected files, fix guidance, and cautions
2. `D:\VTT\AUDIT_FIX_PROMPT.md` — the rules, work order, and safety constraints you MUST follow

## What You Must Do

Start with Phase 1 (Bug Fixes) from the work order in `AUDIT_FIX_PROMPT.md`. These are the safest, highest-impact fixes:

1. **H2** — Fix infinite re-render bugs in 3 persistence hooks (`useUserMapsPersistence.js:198`, `useUserItemsPersistence.js:197`, `useUserCreaturesPersistence.js:197`). Read each hook fully first to understand the auto-save intent. The fix is that functions are being INVOKED inside dependency arrays instead of referenced. Fix the dependency arrays so the effect triggers on actual state changes, not on every render.

2. **H3** — Fix Rules of Hooks violation in `useJournalPersistence.js:189-201`. Move all `useShareableStore()` calls out of the useEffect dependency array and to the top level of the hook. Use the returned values in the dep array instead.

3. **H7** — Remove duplicate ping handler in `server/handlers/socketHandlers.js:478-484`. Search the frontend first (`grep -r "ping" vtt-react/src/`) to see which response pattern the client expects. Keep only that one.

4. **H9** — Remove duplicate `eventSequenceNumber` from `server/services/syncService.js:260-264`. Keep the one in `socketHandlers.js:26-30` since that's what handlers actually use. Search for any imports of the syncService version before removing.

5. **H10** — Deduplicate `STORAGE_LIMITS`. Keep it in `vtt-react/src/services/firebase/storageLimitService.js:17-37`. Import it in `vtt-react/src/services/firebase/persistenceService.js:20-40` and remove the duplicate definition. Watch for circular dependencies.

6. **M15** — Fix typo `forcSync` → `forceSync` in `vtt-react/src/services/firebase/characterSyncService.js:302`. Search for all callers and update them too.

7. **M13** — Remove dead/no-op useEffect blocks in `vtt-react/src/hooks/useClassSpellLibrary.js:29-31` and `:251-258`.

## Non-Negotiable Rules

- **Read every file fully before changing it.** Do not change code you don't understand.
- **Verify each fix doesn't break anything.** After each fix, run `npm start` from root and confirm the app loads.
- **Check callers.** Before renaming a function or changing its behavior, search for every file that imports or calls it.
- **Not everything in the audit is actually a bug.** The audit report flags patterns that LOOK wrong but may be intentional (presenceStore having its own socket, silent handler rejections for security, synchronous handlers, both localStorage and Firebase versions of services). If something seems intentional, skip it and note why.
- **Firebase writes are sacred.** Never change how data is written to Firestore without verifying the read path still works. The app syncs room state through: client → Zustand store → socket emit → server → broadcast → Firebase batch write.
- **One issue at a time.** Fix it, verify it, then move on.

## How to Report

After each fix, report in this format:

```
### [Issue ID] — [one line description]
- **Changed**: `file:lines` — what you did
- **Verified**: how you tested it
- **Skip flag**: (if you skipped something, explain why)
```

When all Phase 1 fixes are done, stop and wait for further instructions. Do NOT proceed to Phase 2 or beyond without being asked.
