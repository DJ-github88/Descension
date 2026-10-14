# P7 ambiguous personal condition recovery witness

Implementation evidence, **not independent acceptance**. Frozen F4/F5/F6 and the
P5/P6 owner/account-generation/edit fences remain governing.

`conditionRecovery` is a separate owner + character lane in the existing
`character.saveDraft` family. The selected draft export carries it separately
from `canonical` and `runtime`. Its explicit read API is
`getPersonalConditionRecovery(characterId, context?)`; importing a matching
recovery file unions raw sources, never installs them as executable conditions.
Observation scope does not prove ownership of a condition's target.

## Browser reproduction (PowerShell, cwd `D:/VTT/vtt-react`)

Choose a fresh, existing external parent directory for each output:

```powershell
$env:P7_RECOVERY_OUTPUT='D:/AppData/Temp/opencode/p7-final-20261013/recovery/reviewer-recovery.json'
node verification/p7/condition-recovery-browser.cjs --require-collection
```

The required collection mode additionally tests projection without a mounted
hook and absence of the former global raw cache. The coordinated production
collector now uses the owner-scoped `preservePersonalConditionRecovery` boundary.
`owner-condition-browser.cjs` adds actual matched-owner full/repeated/map/section
hydration and accepted-receipt preservation of personal round2/round0 records.

Without `--require-collection`, the mounted hook path and old-cache migration
run independently of that integration. `--red` asserts the original defective
observation; it is for before-fix source, not an expected pass on final source.
Before-fix execution and subsequent required-behavior failure were retained
externally before production edits, with full loaded-source manifests.

The browser uses the existing P6 module/SDK fixture builder. Production provider,
hook, projection, owner-scoped storage, import/export and actual Chrome reload,
Storage refusal, download and local round decrement execute. Auth/Firestore
documents/transport are fixtures. The unmatched-room flag is a fixture; no room
server, full-App route, live Firebase/device durability or deployed restart claim.

## Focused production tests

```text
node node_modules/react-scripts/bin/react-scripts.js test --watchAll=false --runInBand --silent --no-cache --runTestsByPath src/persistence/__tests__/p7ConditionRecovery.production.test.jsx src/persistence/__tests__/p6CharacterSave.production.test.jsx src/persistence/__tests__/characterHandoffPreservation.test.js src/persistence/__tests__/characterProjectionIsolation.test.js src/persistence/__tests__/registry.test.js
```

The new suite covers immutable exact raw retention, separated cloud payloads,
recovery-only import union, nested owner/character spoof refusal, account-generation
fences, selective device refusal/healed retry, late cloud ACK versus newly failed
recovery, capacity and serialization refusal. A simulated module reset complements
the browser's actual reload; it is not substituted for it.

Device/storage/serialization refusal is memory-only, visibly prevents runtime
confirmation and preserves the previous device bytes. Recovery sources are bounded
to eight retained candidate groups per owner/character; overflow remains in memory
for explicit export and is not represented as reload-safe. Raw recovery is not a
cloud confirmation or executable-condition ownership claim. Existing P5 readiness
gates and independent P7 review remain outstanding.
