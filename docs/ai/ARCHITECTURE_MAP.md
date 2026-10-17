# Architecture map (owners and tests)

Paths are under `vtt-react/src/` unless they start with `server/`. "Contract" is the doc that freezes the behavior; change the owner and run its tests.

| Concern | Owner | Contract | Tests / witnesses |
|---|---|---|---|
| Socket envelopes, acks, routing | `server/handlers/*`, `server/services/validationService.js` | P1 (roadmap §26); server tests run with `npm test` (Mocha) in `server/` | `server/tests/productionSocketContract.test.js`, `integration.test.js` |
| Room saves, checkpoints, resume | `server/services/roomCheckpoint.js`, `server/services/roomCheckpointExport.js`, `server/handlers/roomHandlers.js` | P2/P3 | `server/tests/roomSave*.test.js`, `roomCheckpoint*.test.js` |
| Room and private-data access | `server/services/roomAccessService.js`, `firestore.rules`, `storage.rules` | P4 | `server/tests/roomAccess*.test.js`, `campaignRules.emulator.cjs` |
| Account-bound drafts, campaign no-clobber | `persistence/`, campaign hooks | P5 | `verification/p5-01/*` |
| Character save outcome, shape codec | `utils/characterShapeCodec.js`, `persistence/characterSaveOutcome.js` | P6 | `verification/p6/*` |
| Actor consequences, conditions, receipts | `server/services/actorConsequences.js`, `server/handlers/actorConsequenceHandlers.js`, `services/actorConsequenceService.js`, `services/silentRoomHydration.js` | [P7](../MYTHRILL_PROJECT_7_CONTRACT.md) F1–F6 | `server/tests/p7*.production.test.js`, `verification/p7/*` |
| Creature action (Feather Slash) | `services/featherSlash.js` and its fan/controller | [P8](../MYTHRILL_PROJECT_8_CONTRACT.md) | `services/__tests__/featherSlash.test.js`, `verification/p8/*` |
| Supported spell consequences | `services/spellConsequence*.js`, `server/services/spellPayments.js`, `components/hud/SpellConsequencePanel.jsx` | [P9](../MYTHRILL_PROJECT_9_CONTRACT.md) | `services/__tests__/spellConsequence.test.js`, `server/tests/p9SpellConsequences.production.test.js`, `verification/p9/*` |
| Combat tracker: order, AP refill, initiative | `store/combatStore.js` (+ `data/firstTableRules.js`) | P7 seam + P10 baseline | `store/__tests__/combatStore.test.js` |
| PC derived stats, AP, encumbrance, pack grid | `utils/characterUtils.js`, `data/raceData.js`, `store/inventoryStore.js` | P10 Laws | `data/__tests__/firstTableLaws.test.js` |
| Talents / level-up / XP | `data/talentTrees/talentSystem.mjs`, `components/talent-tree/TalentTreeContent.jsx`, `components/modals/LevelUpChoiceModal.jsx`, `utils/experienceUtils.js` | P10 Laws | `firstTableLaws.test.js`, `components/talent-tree/__tests__/` |
| Class resources | `data/classResourceContracts.js` and `data/*ResourceContract.js` | roadmap §17 | `data/__tests__/` class suites |
| Universal actions and weapon strikes | `data/universalCombatSpells.js`, `data/weaponActionSpells.js`, `utils/weaponIntegration.js` | P10 baseline | `firstTableLaws.test.js` |
| Laws and lexicon content | `public/data/rules.json`, `public/data/lore.json`, loader `hooks/useGameData.js` + `data/versions.js` | P10 | `firstTableLaws.test.js`; bump `DATA_VERSIONS` on any content change |

## Rules of the road

- Client state merges one level; server `token_updated` merges at the token root. New nested state is not replicated "for free".
- Shared rooms never run local over-time, expiry or round decrement; those stay manual (P7 F4).
- A new consequence goes through one P7 command with an expected revision; never a legacy flat token/character write.
- Static data changes need a version bump in `data/versions.js` or clients keep the cached copy.
