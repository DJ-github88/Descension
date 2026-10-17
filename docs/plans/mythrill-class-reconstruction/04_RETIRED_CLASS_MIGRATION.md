# Retired identities — replacement and compatibility plan

**DESIGN INTENT:** Gambit, Revenant and Shaper are retired target identities. **PROPOSED:** the migration below. No source deletion or save conversion is authorized.

## Preserve these identities exactly

| Legacy | Keep | Candidate destinations | Non-equivalence |
|---|---|---|---|
| `gambit` / `Gambit` | 65 spell IDs, three trees, Fortune 0–7, Debt 0–13, cards, acquisition and art | Gambler, Fate Weaver, Chaos Weaver | A merged character is not automatically any single successor |
| `revenant` / `Revenant` | 44 spell IDs, three trees, Toll/finite phylactery, Death Shroud and lore | Deathcaller, Lichborne | Soul-anchor reserve is not command capacity or a stockpile of summoned souls |
| `shaper` / `Shaper` | 56 spell IDs, six forms, Flux/Body Toll, three trees, Groven/Mimir variants | Druid: player-facing name approved only | No ID/resource/save migration is approved; proposed anatomy/load state is not numerically equivalent to Flux |
| `apex` / `Apex` | 54 spell IDs, companion link, generation receipts/caps, aliases | Provisional Hunter | A public-name change and a companion-independent redesign are separate migrations |

Counts: current census. Runtime shapes: `classResourceContracts.js`, `revenantResourceContract.js`, `shaperResourceContract.js`, `apexResourceContract.js`. Check each spell's semantics before transferring its ID.

## Versioned migration procedure

1. **Inventory:** capture canonical personal save, runtime overlay, campaign actor bindings, resource home, talent allocations, acquisition map, icon overrides and action slots. Preserve unknown/custom keys. Give the user a readable conversion preview.
2. **Register compatibility:** old IDs/names remain resolvable. Hide retired identities from *new release-approved creation* only after successors meet release gates. Saved characters and campaign actors still open through compatibility routes.
3. **Explicit choice:** the owner chooses a successor or retains the compatibility class. Never infer consent from a specialization, native heritage or art filename. GM campaign permission remains distinct from personal conversion.
4. **Draft a successor:** new stable class ID and schema version; copy shared biography/gear without overwriting the old class-specific state. Use a migration record identifying source version/hash and destination version, retained original payload, explicit spell/talent mappings and unresolved selections.
5. **Rebuild loadout:** one old spell may map to an unchanged destination spell, a materially changed replacement requiring reselection, or an archived legacy entry. One-to-many mappings are choice prompts, not free extra abilities. Record point refunds/reallocations in the preview; preserve the original allocation snapshot.
6. **Requalify access:** retain `classAcquisition[legacyName]`; add successor evidence only when its own requirements are met. Never propagate Gambit's three native heritages to all probability classes. A current body incompatibility remains binding.
7. **Room transition:** refuse conversion with an unresolved approval, active wager/link/summon or unknown submitted command. Resolve or explicitly reconcile first. End old actor attachment using established binding/incarnation rules; do not overwrite a revisioned resource home from a stale sheet.
8. **Commit once:** personal persistence success and room replacement are separately acknowledged. Do not describe cross-service writes as one transaction. If personal save succeeds but room attachment fails, retain a recoverable pending-room stage.
9. **Rollback:** restore the preserved personal source into a separately identified recovery record, reconcile current campaign effects with the GM, and attach a fresh actor incarnation. Never rewind already accepted damage, resurrect a destroyed summon or refund an executed action automatically.

## Required mapping artifact

Each record: legacy class/version, legacy spell or talent ID, original payload hash, destination class/version/ID, action (`retain`, `replace-with-choice`, `archive`, `unchanged-transfer`), reason, point/unlock consequence, heritage impact, action-slot impact, regression witness. This artifact is still incomplete. Existing exact-ID survivors are archaeology, not an approved transfer table.

## Acceptance

Legacy save reload is byte-preserving outside explicit codec normalization; conversion cancel has no effect; interrupted save offers exact recovery; two devices cannot race-convert the same revision; aliases do not create duplicate base classes; custom spell copies are preserved; declined conversion remains playable; a rollback cannot replay an accepted command. Test each legacy class with a native character, qualified outsider, legacy unqualified character and custom unknown fields.
