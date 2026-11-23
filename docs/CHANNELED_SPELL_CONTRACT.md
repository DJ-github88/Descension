# Channeled Spell Contract (`authored-channeled:v1`)

Stable wire, persistence, and combat execution contract for Wizard-authored channeled spells in Mythrill VTT (Prism runtime). Other Neon jobs and UI consumers should reuse these exact field names, condition keys, socket events, and receipt structures.

---

## 1. Capability Identity & Hash Domain
- **Capability ID:** `authored-channeled:v1`
- **Schema Version:** `10`
- **Compiler Version:** `p14-channeled-1`
- **Canonical Hash Domain:** `mythrill:authored-channeled:v1\n` + `stableStringify(canonicalDefinition)`
- **Condition Origin:** `shared-condition:channeled-tick:v1` (`conditionKey: 'channeled-tick'`, `source: 'authored-effect:channeled'`)

---

## 2. Wizard & Library Record Fields
Saved library records store both top-level presentation fields and `authoredDraft` (+ regenerated `serializedData` JSON) with matching executable sections and preserved `authoredDefinitionId` (UUID):

- **`spellType`:** `'CHANNELED'`
- **`typeConfig`:**
  - `maxChannelDuration`: integer `1..10` (total number of scheduled ticks = channel lifetime in caster turns)
  - `durationUnit`: `'TURNS'`
  - `tickFrequency`: `'START_OF_TURN' | 'END_OF_TURN'`
  - `interruptible`: `true` (default/settled)
  - `movementAllowed`: `false` (default/settled)
  - `breakEffect`: `'none'` (default/settled)
  - `concentrationDC` (optional integer `5..20`) & `dcType` (optional `'CONSTITUTION' | 'STRENGTH' | 'AGILITY' | 'INTELLIGENCE' | 'SPIRIT' | 'CHARISMA'`; both must be present together or both omitted)
  - `school`, `icon`, `tags`, `element` (no `secondaryElement`, non-zero `castTime` disallowed)
- **`channelingConfig`** (optional/when Step 8 visited — must agree with `typeConfig` and carry zero per-tick sustain cost):
  - `type`: `'channeled' | 'sustained' | 'drain'`
  - `maxDuration`: matches `typeConfig.maxChannelDuration`
  - `durationUnit`: `'turns' | 'TURNS'`
  - `tickFrequency`: matches `typeConfig.tickFrequency`
  - `concentrationDC` / `dcType` (if set, must match `typeConfig`)
  - `interruptible`: `true`, `movementAllowed`: `false`, `breakEffect`: `'none'`
  - `costValue`: `0` (or omitted), `costTrigger`: `'none'` (or omitted), empty `perRoundFormulas`
- **`effectTypes`:** strictly `['damage']` OR `['healing']` (`effectsMap` agrees)
  - `damageConfig`: `damageType: 'direct'`, `resolution: 'DICE'`, `formula`: plain `NdM` or `NdM±K`, `elementType` / single `damageTypes` element in `sharedConditionProfile.PERIODIC.damageTypes`, `hasDotEffect: false`, `canCrit: false`, `savingThrow: false`
  - OR `healingConfig`: `healingType: 'direct'`, `resolution: 'DICE'`, `formula`: plain `NdM` or `NdM±K`, `hasHotEffect: false`, `hasShieldEffect: false`, `canCrit: false`, `savingThrow: false`
- **`targetingConfig`:**
  - `targetingType`: `'single'`, `maxTargets`: `1`
  - `rangeType`: `'ranged' | 'melee' | 'touch'`
  - `rangeDistance`: integer `1..300` (feet)
  - `targetRestrictions`: `['enemy'] | ['ally'] | ['any']` (one creature restriction; `'self'` disallowed)
  - `selectionMethod` / `targetSelectionMethod`: `'manual'` (or omitted)
  - `movementBehavior`: `'static'` (or omitted)
- **`resourceCost`:** upfront payment at channel start (`actionPoints`: `0..20`, `mana`: `0..10000`, temp pools count first; no components or formulas).

---

## 3. Compiled Definition Schema (`schemaVersion: 10`)
Produced by `authoredAbility.definitionFromWizard` and admitted by `installedDefinitionRegistry.compileDefinition`:

```json
{
  "schemaVersion": 10,
  "capability": "authored-channeled:v1",
  "scope": { "roomId": "<roomId>" },
  "definitionId": "<uuid>",
  "definitionVersion": 1,
  "name": "<spell name>",
  "description": "<description>",
  "binding": { "rulesetId": "prism", "rulesetVersion": "cr-a1a-pilot-1", "classId": "<classId>" },
  "spellType": "CHANNELED",
  "targeting": { "kind": "single", "maxTargets": 1, "rangeFeet": 30, "restriction": "enemy" },
  "resourceCost": { "actionPoints": 2, "mana": 10 },
  "tickEffect": { "kind": "damage", "formula": "1d6", "damageTypes": ["arcane"] },
  "channel": {
    "maxChannelDuration": 3,
    "durationUnit": "TURNS",
    "tickFrequency": "START_OF_TURN",
    "timing": "authored-caster-start-count",
    "occurrences": 3,
    "rangeFeet": 30,
    "interruptible": true,
    "movementAllowed": false,
    "breakEffect": "none",
    "concentrationDC": 12,
    "dcType": "CONSTITUTION"
  },
  "timing": {
    "expiryPolicy": "authored-caster-start-count",
    "occurrences": 3,
    "durationText": "Channel up to 3 caster turns (30 ft)",
    "gmNote": "GM resolves each due tick with its roll and records manual interruption if concentration breaks."
  }
}
```
- `occurrences` is included iff `maxChannelDuration >= 2`. Single-tick (`1`) uses `authored-caster-next-start` / `authored-caster-next-end`.
- `concentrationDC` and `dcType` are omitted if not configured in the Wizard.

---

## 4. Authoritative Condition Record & C4 Caster-Anchored Schedule
Installed on the target creature (`approval.target.kind === 'creature'`):
- **`effectOrigin`:** `'shared-condition:channeled-tick:v1'`
- **`conditionKey`:** `'channeled-tick'`
- **`sourceEntityId`:** `'authored-effect:' + approvalId`
- **`sourceActor`:** exact bound `ActorRef` of caster
- **`target`:** exact bound `ActorRef` of creature target
- **`clockBoundary`:** `'authored-caster-next-start' | 'authored-caster-next-end' | 'authored-caster-start-count' | 'authored-caster-end-count'`
- **`clockOccurrences`:** integer `2..10` when counted (`undefined` when 1)
- **Channeled-only metadata (`CHANNELED_CONDITION_FIELDS`):**
  - `channelRangeFeet` (`1..300`)
  - `channelInterruptible` (`true`)
  - `channelMovementAllowed` (`false`)
  - `channelBreakEffect` (`'none'`)
  - Optional `concentrationDC` (`5..20`) and `dcType`
- **C4 Schedule Entry (`combat.effectLifecycle.schedules[instanceKey(target, recordId)]`):**
  - Anchored to **caster**: `anchorRef` = `sourceActor`, `ref` = `target`, `channeled: true`.
  - Ticks fall on strictly upcoming **caster** turn boundaries (a caster turn already in progress is not counted for `END_OF_TURN`).

---

## 5. Combat Socket Events & Receipt Structures
1. **`actor_authored_admit`:** Admits compiled `schemaVersion: 10` definition (supports both PC class-bound spells and creature `authoredAbility`).
2. **`actor_spell_approve` / `actor_spell_prepare_creature`:**
   - Payload carries `spell: { ..., kind: 'channeled', damageTypes }`, `roll: null`, `classPayment: null`, `channelTerms: { tickEffect, channel, timing }`.
   - Enforces creature-only distinct target, source-relative relationship (`enemy`/`ally`/`any`), active-channel exclusivity across targets (`caster_already_channeling`), and initial range (`target_out_of_range`).
3. **`actor_consequence` (Channel Start Commit):**
   - Pays AP/mana upfront (temp first).
   - Installs target condition (`op: 'add'`, or `[op: 'remove', op: 'add']` when replacing same caster + same target) and installs C4 caster-anchored schedule atomically.
   - `adjudication.chosenResult` JSON carries `{ capability: 'authored-channeled:v1', kind: 'channeled', conditionInstanceId, tickEffect, channel, resolution, combination }`.
4. **`token_moved` (through `MovementDebouncer`):**
   - Updates authoritative `token.position` (`x, y`) on room map state.
5. **`actor_turn_boundary` (`mode: 'advance'`):**
   - Evaluates channel continuity **before** `occurrenceAt` / tick recording:
     - Checks caster presence (`caster_unavailable`), caster `Stunned` (`caster_stunned`), caster `hp.current <= 0` (`caster_down`), and live planar range `hypot(dx, dy) / gridSize * feetPerTile <= channelRangeFeet + 1e-6` (`target_out_of_range`).
     - Broken channels remove the target condition (and C4 schedule), emit `{ recordId, ref, sourceActor, reason, sequence, distanceFeet?, rangeFeet? }` in `receipt.adjudication.chosenResult.endedChannels`, and record **0 ticks** on that boundary and all later turns.
   - Continuing channels reaching a scheduled caster boundary record one entry in `combat.effectLifecycle.dueTicks[tickId]` (`{ tickId, combatId, sequence, occurrence, of, final, ref, recordId, recordHash, effectDefinition, label, tick, rollPolicy: 'each-tick', channeled: true, sourceActor }`).
   - Final tick removes condition + C4 schedule and emits `endedChannels` with `reason: 'completed'`. Subsequent turn advances record **0 extra ticks**.
6. **`actor_periodic_resolve` (`mode: 'apply' | 'dismiss'`):**
   - Resolves or dismisses one `dueTicks` obligation (`channeled: true`).
   - Any earlier open tick of a channel that was interrupted or broken early (`endedChannels` reason other than `'completed'`, or GM condition removal via `actor_consequence`) fails `apply` with `periodic_tick_stale` and must be dismissed manually.
7. **`actor_consequence` Damage to Channeling Caster -> `receipt.concentrationChecks`:**
   - Whenever any actor loses HP (`(beforeHp.current + beforeHp.temp) - (afterHp.current + afterHp.temp) > 0`) while holding `sourceActor` of one or more active channels in `next.maps`, the accepted receipt (and public receipt projection) attaches read-only:
     ```json
     "concentrationChecks": [
       {
         "caster": { "...ActorRef" },
         "target": { "...ActorRef" },
         "recordId": "<conditionId>",
         "spellName": "<spellName>",
         "damageTaken": 5,
         "concentrationDC": 12,
         "dcType": "CONSTITUTION",
         "resolution": "gm_manual"
       }
     ]
     ```
   - GM interrupts manually by submitting `actor_consequence` removing `recordId` from the target.

---

## 6. Refusal & Error Codes
- `target_out_of_range` — target exceeds `channelRangeFeet` at approval or commit
- `caster_already_channeling` — caster already holds an active channel on a different target
- `channeled_target_unsupported` / `invalid_spell_approval` — target is not a distinct creature (e.g., PC or self: `invalid_spell_approval` at `actor_spell_approve` shape validation, `channeled_target_unsupported` in `conditionPlan`, `installedAuthoredAbilities`, and `actorConsequences`)
- `channeled_combination_unresolved` — target already holds a channel from a different caster
- `effect_schedule_unavailable` — no active authenticated combat clock or caster missing from turn roster
- `periodic_tick_stale` — open tick's channel was interrupted or broken before resolution (dismiss only)
- `unsupported_wizard_record` — Wizard draft hits an undecided/unsupported channeling rule

---

## 7. Explicitly Undecided Channel Rules (Fail-Closed / Manual)
1. **Mid-turn drag break vs turn-boundary check** (settled here: continuity range checked at start + each `actor_turn_boundary`, not mid-move rollback).
2. **Permanent break vs pause/skip out-of-range** (settled here: permanent removal on out-of-range break).
3. **Automated concentration roll & DC scaling formula** (settled here: read-only `receipt.concentrationChecks` hint; GM records interruption manually).
4. **Cast-turn end tick vs strictly-next caster turn** (settled here: strictly-upcoming caster turns; turn already in progress is skipped for `END_OF_TURN`).
5. **Per-tick sustain resource cost** (`costTrigger !== 'none'` or `costValue > 0` refused by compiler).
6. **Automatic break on caster movement** (`movementAllowed: true` refused by compiler; manual GM enforcement for standing still).
7. **Uninterruptible channels, non-`none` `breakEffect`, `ROUNDS`/`MINUTES`/`CONTINUOUS` cadence, per-round escalating formulas, AoE/multi-target/PC-target channels** (all refused by compiler).
8. **Single-command cross-target switch** (must interrupt/end active channel before channeling a different target).
