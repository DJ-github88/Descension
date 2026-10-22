# RI-2 Phase 2B — seven-ledger reconciliation

**Scope:** explicit provenance reconciliation requested by the Phase 2B BLOCK re-review. This file does not change any ledger file and does not infer authorship.

## Method

For each path, the current Git blob was compared with the named commit blob, and the current bytes were hashed with SHA-256. The seven paths have no uncommitted changes in this worktree.

## Reconciliation

| Path | Commit context | Current Git blob | Current SHA-256 | Reconciliation |
|---|---|---|---|---|
| `vtt-react/src/components/rules/ClassDetailDisplay.jsx` | `c751ed6a` | `6ef58c7cee82189a2285a9f30957fc2cbe07ca7a` | `250fe99ada0d857fd9ad1430ce60e6cfb886c933cb18d01bec1ba8d47228a6ce` | Current blob equals `c751ed6a`; class-inspection presentation change. Unrelated to Fate mechanics. |
| `vtt-react/src/components/rules/ClassDetailDisplay.css` | `c751ed6a` | `c084716d2725be2651c3224dadf487aaf71f7680` | `ff129ef149e8c00cc14a00a60f74fab329d88c7943d14d21787b1671fe52e04c` | Current blob equals `c751ed6a`; class-inspection presentation change. |
| `vtt-react/src/data/__tests__/classHeritageRegistry.test.js` | `c751ed6a` | `4e9eb0a0bcb704ab033fe3aa7afa7bf71b555a60` | `afdcaeca40261e03917c9e9acb4b1daa81c3478193acd0c6177d2e8a9f4caba1` | Current blob equals `c751ed6a`; punctuation/assertion-text correction. |
| `vtt-react/src/components/rules/__tests__/ClassDetailDisplaySpells.test.jsx` | `c751ed6a` | `9bcd080b840600fd47e99054ea5a0632d60da579` | `7ccb3d4f38edaa32b3dca3bea7084e53775b9f5214f4208c7da7a295a4062a15` | Current blob equals `c751ed6a`; mojibake assertion-text correction. |
| `vtt-react/src/components/grid/CharacterToken.jsx` | `c751ed6a` | `6221e5f54d19cefe904f78be6a4f66a78de12441` | `c4d2fe5dd9066ce3b1fb844848c4ee8a7c375dc17cb925bd24da6021a9fb8c08` | Current blob equals `c751ed6a`; token tooltip/geometry change. |
| `vtt-react/src/components/grid/CreatureToken.jsx` | `c751ed6a` | `763200223d27675ca264f4181baeb881a230b9bb` | `4406de0e717c6dc02715ba104e00c8dfa8a0d916cd6656f631837e8c53a38c72` | Current blob equals `c751ed6a`; token tooltip/geometry change. |
| `vtt-react/verification/p7/evidence/server-results.json` | `2acd8e52` referenced by review; current blob from `40293fcf` | `ca4d08e0affea6ebe53a0cabae4799a90f9d638d` | `454d8722fc967ff71116e6b276fbd17dddbf5e715e4b189e6afb23002556b7e6` | `2acd8e52` blob is `bae376707a73adb25cf73e8b19d6460a3953ba71`; `40293fcf` changed it to the current blob. Generated P7 ledger refresh. |

## Byte-history limitation

The re-review named exact hash bridges for `ClassDetailDisplay.css`, `ClassDetailDisplaySpells.test.jsx`, and `server-results.json`; those current bytes are confirmed above. The other four paths have no independently captured pre-change working-tree byte snapshot in the available evidence, only commit blobs.

This means the four intermediate-original byte histories are not fully reconstructible from available evidence. No hashes, chronology, or authorship are invented for them. The commit blobs above are provenance anchors, not a claim about who produced the intermediate bytes.
