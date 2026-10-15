# Final snapshot provenance addendum — 2026-10-15

**Final bounded verdict: PASS.** The completed frozen frontend build, its source packet, and the final production-App replay are coherently linked. All three previously scoped corrections retain PASS within the established desktop scope.

- **task_id:** `independent-integration-review-20261015-snapshot-final` (local review identifier)
- **Repository:** `D:\VTT`
- **Scope:** final evidence/provenance accounting only; no production edits, re-audit, new browser, build or test-suite run.
- **Fresh check:** `snapshot-final-check.cjs` → `snapshot-final-check.json`, exit **0**.

This records completed evidence. It updates the earlier snapshot-pending observation without modifying either prior report.

## 1. Completed build and source-packet identity

`sol/build-snapshot/command.json` records:

- Command: `C:\Program Files\nodejs\node.exe D:\AppData\Temp\opencode\p8-p9-final-1792092299188\node_modules\@craco\craco\dist\bin\craco.js build`.
- Working directory: `D:\AppData\Temp\opencode\p8-p9-final-1792092299188`.
- Started **2026-10-15T19:25:11.421Z**, ended **19:31:59.841Z**.
- **exit 0**, signal null, **`mirrorDrift: []`**. `exit.json` agrees; the output log reports the snapshot application directory ready.
- Recorded **`concurrentLiveDrift` contains only `vtt-react/src/hooks/useSessionManagement.js`**.

| Artifact | Independently calculated SHA-256 |
|---|---|
| `build-snapshot/command.json` | `5841a2e811ac380354e69241b5af3aeaf36e3f21388f5ab6b17a610a078a0c70` |
| `build-snapshot/source.json.gz` | `e9aed0321e5aa850eec06f3c1de573fe1589788c94e239e66fcbc8d11bc1cbf9` |
| `build-snapshot/output.log` | `fa3f54114d8b3acd1cb352b0bf0b9785d6527d2745d2a7224bb6e0205091a9f5` |
| `build-snapshot/app/asset-manifest.json` | `29c6a64f3a9082d0b113e3f45dfb33eec51480e89087ee049ca35c2cdcc1f00c` |
| `app-replay-final/result.json` | `d56de547c06c3acc08dc67bfdcf90763a095bf7438084d71665cf8560d2389b7` |

Fresh verification confirmed that the gzip's raw SHA-256 equals `command.json.snapshotSha256`; its decoded **10,724-entry hash map equals the command's entire hash map**; and all **2,109 archived byte entries** decode to their recorded hashes. The packet records hashes for copied non-environment frontend inputs and archives selected source/config/data byte entries. The archive is not described as containing every public asset's bytes.

No `.env*` keys appear in either packet map. The previously inspected snapshot script copies those files only to the temporary workspace; this review did not read or archive their contents. The existing installed dependency directory is reused by junction; it is not separately byte-archived by this packet.

The copied configuration/package identities match snapshot, current checkout and temporary mirror:

| File, relative to `vtt-react/` | SHA-256 in all three locations |
|---|---|
| `craco.config.js` | `e22c01c503ecb29c2eb6fbb86188eb13b6da55627281eda6a69130332397017d` |
| `package.json` | `63475810b4b5205fd00e36e65573ecb48aab95d2eb95e3899bc81f2ea5375b7a` |
| `package-lock.json` | `66d4e11e1059e33d4908cdbc82b21dec8d788cf668438b8aa3bca1cf76cdc9d7` |

## 2. All 16 focal identities match

For **each** entry below the prior sealed hash, current checkout bytes, snapshot hash, decoded archived bytes and current temporary-mirror bytes agree. Hashes are raw SHA-256. Paths are relative to `vtt-react/`.

| File | Matching SHA-256 |
|---|---|
| `src/services/featherSlash.js` | `ad2b3134998a8585906bbb82a1ac3878dafecac92070a9ad81f659ed1812669a` |
| `src/services/__tests__/featherSlash.test.js` | `43eaf32fb3a87bf38cda145e9c7afc29bfbfda4f83f53585f376abd1acc2bcb9` |
| `src/components/ui/ActionBar.jsx` | `7a04ec3302561ae91cd495bddce4d5596235bd5b8c5916f58686b767f9000d33` |
| `src/components/ui/__tests__/ActionBarLegacyArcanoneerSpheres.test.jsx` | `98e8afbef304b1359da67d136ae2f38e43fc002846dcee247df500d5466dbb73` |
| `src/components/hud/PartyHUD.jsx` | `c5f2e9381c18fae3e68ec47f3f8bf2c02bca8e3be48ea72a8f6179e9e07db5d9` |
| `src/components/hud/SpellConsequencePanel.css` | `2f936ff2ff5bdc3f610c2c24c49015a1b935bd835a3f8f4e1dfeb2837682a68b` |
| `src/services/featherSlashCustody.js` | `2ace5b077bbd3bccdfeec666148df385927faca1766beb065d51a2e14e5abd39` |
| `src/components/grid/CreatureAbilityQuickUse.jsx` | `f8f5654578981e482751b4a48ebef54b4774bbe0f43db1c7cb6943614e423b09` |
| `src/components/hud/ActorConsequenceControls.jsx` | `50ad8862d02df681cb15303fd0495931a1bc244ce5ea4de838d9e1891ef5f231` |
| `src/components/hud/SpellConsequencePanel.jsx` | `01c16539ab4ef766809dc0880a4dbf73a3eed4964b99da40c182f40477df9bb4` |
| `src/styles/party-hud.css` | `df2fc87256718952a81b9f0f652b04baa143c51fb109830590199bc4708283b6` |
| `src/utils/arcanoneerMigration.js` | `024045a51fb8ec2e11ba14e14fdceb83a02ca492345bad66ed51d76e27b35ad6` |
| `src/data/versions.js` | `d3abf2ffedebc1e6834cd8c41f47f0022b6c4d8be33db0e7de7be80fd96fc651` |
| `public/data/abilities.json` | `07ffc620f0d7a08c188aff8daf4fa0bdf9e82795bcf83ee7c6e864d5d749bb15` |
| `public/data/creatures.json` | `66cf07a04adfd9cd31b62e15053c2e707ec55a519e04bfdb6095b1184077fafd` |
| `src/App.jsx` | `55ba76417fa01c2f2befa818dad5d8e102723607eb6ebda0fff18dfde6ed642c` |

**Focal drift: `[]`.** This supports carrying forward the earlier source/test review conclusions without another code audit.

## 3. Completed final production-App replay

`app-replay-final/result.json` records the existing `node .../verification/p9/integration/app-browser.cjs` witness, started **2026-10-15T19:34:37.808Z**, ended **19:35:31.896Z**, **`passed: true`**, no `failure`, and **`build: "build-snapshot"`**. Its `buildAssetManifestSha256` exactly matches the snapshot build's actual manifest above. The browser/server witness source hashes still match those inspected for run 8.

Independent checks of the result and retained prepared/accepted accessibility snapshots confirm:

- **P8:** receipt command **`a1fd70a3-75c5-458c-8868-51a4f0bb1026`**; original capability `feather-slash:v1/abilities:1.4.0`; source AP **1**, target HP **24** + **0 temp** following the actual fan/adjudication path.
- **P9:** receipt command **`279dee0e-6b81-4fb2-9e45-c1ebc098d159`**, approval **`929f0122-aa81-41c7-8c46-847f2f06ad6e`**, authorization **`owner-approval-gm`**. Physical face **6** + constant **4** records **10**; GM final **7**, reason **GM mitigation**.
- Both installed server token data and the receipt agree on **mana 9 + 0 temp, AP 2 + 0 temp, spheres `["ember"]`, target HP 17**. GM and owner accessibility snapshots show accepted live-only results.
- Actual GM acceptance button **`elementFromPoint` hit true**, rectangle **x1026/y528, 184.75×27**, corroborating the existing normal-pointer-click path. No new browser was launched by this reviewer.
- Post-acceptance desktop layouts remain wholly inside the viewport: **1440×1000 → x1004/y84, 420×176**; **1024×768 → x588/y84, 420×200**. As before, the active acceptance click is at 1440×1000; the 1024 record is a bounds observation after acceptance.
- Exactly **two `Failed to fetch` page errors**, one per principal, remain recorded alongside **22 deliberate Firebase installation/Firestore refusals**. This is not a zero-page-errors claim.
- Both accepted receipts have **`checkpointRevision: null`**: live-only temporary-room outcomes. Identity/provider/ownership/lease/cloud seams and the prior environment limits remain explicit; no live Firebase/rules, second-device, cloud-durability or deployment acceptance is inferred.

## 4. Remaining concurrent-live-drift limit

The build's recorded sole concurrent live change is **`vtt-react/src/hooks/useSessionManagement.js`**, outside the focal 16. The frozen hook bytes and the current temporary mirror match; the live hook differs at the independent check:

| Location | Raw SHA-256 |
|---|---|
| Snapshot archive and build mirror | `94a7a11d2252b8894857d503aa0f3a5fddf812b5ef4a582d5e7b901161e81a91` |
| Live checkout at review check | `8ef6fe27a74ec53995191091979bdc8ce6daef7d20b03b1cc8cf41cc3f0abb46` |

The successful build/replay verdict therefore attaches to the **identified frozen frontend**, with unchanged focal correction bytes. It does not attest that the later live hook edit was compiled or exercised. The recorded `mirrorDrift: []` covers the build interval; independent rehashing additionally confirms the focal/config/mirror identities above. This addendum does not expand into reviewing the external hook edit or claiming a fresh whole-live-tree drift inventory.

The earlier responsive/layout limits remain unchanged: narrow-width frame overlap, the 50px short-height scroll strip, empty offline wrapper footprint, and possible user-dragged frame overlap. The bounded desktop PASS does not claim those are fixed.

## 5. Preservation and actual review command

Preserved prior reports:

- `review.md`: **`73041ec53cc44f8dc0acbe6ac8e9ea6143bc1c48e67db6c24597b393a3dccd71`**.
- `final-review.md`: **`dee835ace68c54dc023902f2dc761ae02287af6a57627d15faad683009e6eb91`**.

Their sealed supporting artifact hashes also still match. Failed attempts, accepted historical evidence, production source and supplied final-build/replay evidence were not rewritten.

Executed from `D:\VTT`:

```powershell
if (Test-Path -LiteralPath "D:\VTT\vtt-react\verification\p9\evidence\integration-20261015\sol\independent-review") {
  node "vtt-react/verification/p9/evidence/integration-20261015/sol/independent-review/snapshot-final-check.cjs"
} else { throw 'Review output directory missing' }
```

**Exit 0**; packet/hash-map/archived-entry, focal/config/mirror, final manifest/result/receipt/layout/error-count and prior-report checks passed. New `snapshot-final-check.json` contains the detailed identities and final replay file hashes. Final report hashing and a further unchanged-focal/prior-report/final-evidence check are recorded by `node vtt-react/verification/p9/evidence/integration-20261015/sol/independent-review/snapshot-final-seal.cjs` from `D:\VTT`, producing new `snapshot-final-seal.json`. Reviewer writes are new report/check artifacts in `independent-review/` only. No reset, commit, push, deployment or future-intent acceptance is involved.

**Final disposition:** completed frozen-build provenance and final App replay **PASS**; the original three corrections retain their established bounded desktop **PASS** verdicts, with the explicit later-live-hook and environment/layout limits above.
