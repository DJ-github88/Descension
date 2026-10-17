# Asymmetric resource architecture — design proposal

**HeadQ R1 precedence:** the seven priority candidates now use [R1 closed-opcode programs](29_PRIORITY_REVIEW_RULES_AND_SERIALIZATION.md) and [lifecycle ownership](implementation/CR-L1-AUTHORITATIVE-LIFECYCLES.md). The earlier generic `operations[]` envelope below is investigation history, not a second active R1 serialization format. Shared domain ownership principles remain applicable; no application architecture has changed.

## CONFIRMED foundation

`classResourceContracts.js` already dispatches to class-owned normalizers and spell planners. `classResourceBanks.js` preserves typed sphere collections and seven note counts. The smallest safe extension is to expose those owners through a typed capability adapter, not replace them with a universal scalar or introduce another combat engine.

Local plans, display models, persisted personal state, revisioned room homes and effect execution are different responsibilities. P9 owns only three authoritative class-payment domains. A full bar and a successful local payment do not prove a spell's effects executed.

## PROPOSED capability descriptor

Each registered domain owns:

| Part | Contract |
|---|---|
| Identity | Stable domain ID + schema version, canonical class IDs, explicitly scoped read aliases |
| State | Strict persisted JSON schema, default factory, migration decoder, semantic invariants, public/private projection |
| Operations | Finite discriminated operations with exact schemas, allowed timing, required evidence, conservation rules and limits |
| Planning | Pure `validate -> plan` from exact prior state, authored operation and recorded event/choice; no dice or store mutation inside preview |
| Result | Valid next state, consumed typed items, generated items, pending/deferred operations, rejection reason, effect dependencies |
| Authoring | Domain-specific editor, draft validation, canonical serializer, reopen adapter and preview presenter |
| Presentation | Derived compact/expanded view model, accessible summary, tooltip sections, SVG renderer key |
| Runtime | Explicit controller/capability and server validator; unsupported is visibly manual, never inferred from arbitrary prose |

Functions/components are registry code, not serialized state. Saved state and spell programs contain only JSON. Unknown versions/operations must be preserved for recovery and refused for execution; do not clamp malformed external inputs into a valid paid action. Local compatibility normalizers can remain permissive at read boundaries, separately from strict command validation.

## PROPOSED spell operation envelope

The candidate schema name is `classResourceProgram`. **It does not exist in the current supported P9 schema.** CR1 must approve its placement and keys before application work.

```json
{
  "version": 1,
  "domain": "fate-links",
  "operations": [
    {
      "op": "link.create",
      "timing": "accepted",
      "from": "target:0",
      "to": "target:1",
      "event": "hp-loss",
      "rule": "share-fixed",
      "amount": 3,
      "uses": 1,
      "durationOwnTurns": 2
    }
  ]
}
```

These are **draft semantic keys**, not an accepted runnable payload. Target slots bind to exact admitted actor refs at approval, not mutable names/token indexes. Every domain validator rejects unsupported operations, invalid counts, stale entity incarnations, duplicate item IDs, illegal timing and out-of-bounds payloads. Limit operation count to the existing P7 ceiling or a separately reviewed tighter domain bound; do not enlarge P7 implicitly.

Timing vocabulary: `accepted` for committed setup/payment; `resolved-event` for an already identified eligible event; `own-turn-boundary` for a server-identified turn; `rest` for an explicit rest command. Declaration/preview is not payment. Future gains cannot finance an earlier cost unless an approved operation explicitly defines that exchange.

## PROPOSED priority resource matrix

| Class | State/interaction | Generator | Commitment/spender | Risk | Reset | Wizard/SVG |
|---|---|---|---|---|---|---|
| Gambler | Finite card hand + declared wager escrow + Fortune | Draw/deal and resolved wagers | Stake Fortune before recorded result; surrender hand | Lose declared stake; debt only for explicit credit wager | Encounter hand reshuffle only after closing wagers; Fortune rest rule to approve | Hand/wager editor; five-card felt engraving |
| Fate Weaver | Bounded directed links with event/uses | Establish link by spending thread tokens; recover tokens when closed | Route one bounded eligible consequence | Transfer a burden; no recursive event creation | Links expire by own-turn counters; rest closes links | Two-endpoint event editor; etched node-and-thread topology |
| Chaos Weaver | Finite outcome tiles and committed branch set | Exchange one tile per own turn | Choose distribution before draw; consume selected tiles | Known downside branch, not a pressure bar | Refill only at encounter/rest boundary | Outcome weights/branches editor; fractured probability wheel |
| Deathcaller | Named deceased-entity roster + command slots | Bind finite remains/witness, summon with capacity | Issue bounded orders; maintain/discharge entities | Lost capacity, interrupted command, actual summon defeat | Orders reset per own turn; roster persists, manifestations do not auto-refresh | Summon/order editor; spirit muster ledger |
| Lichborne | Prepared undeath traits + exposed weaknesses + finite anchor integrity | Ritual preparation; finite replenishment | Commit transformation and choose vulnerabilities | Anchor depletion; no automatic immortal reset | Traits/anchor persist; repair is explicit | Stage/trait/sacrifice editor; broken frost seal |
| Hunter | Exact quarry + three distinct evidence tags | Read a trail, change angle, accepted hit/pack event | Consume a tagged opening for a specific tactic | Target escapes or evidence expires | Target-bound evidence, bounded expiry | Quarry/evidence editor; carved tracking compass |
| Druid (name approved; economy proposed) | Anatomical slots with selected adaptations; transition strain | Prepare/adopt traits through real body interface | Occupy mutually exclusive anatomy; change form | Lost traits during recovery; strain limits repeated switching | Prepared catalogue persistent; active form reset rules explicit | Anatomy/form editor; jointed biological/mineral diagram |
| Inscriptor | Persistent limited glyph objects with sequence | Prepare finite glyphs | Place/arm/trigger ordered clauses | Broken geometry, consumed inscriptions | Rest preparation, world objects explicitly retired | Socket/sequence editor; inscribed tablet |
| Titan | Anchored force vectors with Sacred/Arcane attunement | Brace and charge one declared vector | Release along vector; change footing | Overcommit exposes movement/guard | Encounter commitments expire | Vector/impact editor; monument fulcrum |

Matrix entries beyond the mandatory restored classes remain exploratory until dossiers define all bounds. Do not advertise them as implementation-ready contracts.

## Shared technical invariants

1. Preserve typed content: sphere identity, pitch, card ID, link endpoint, glyph order, form slot and summoned actor identity cannot be collapsed to `current`.
2. Class affinity, heritage modifier and talent modifier are applied by named versioned rules once, with source attribution; preview and runtime share the same resolved authored configuration.
3. Costs and immediately coupled effects commit together through the existing actor-consequence path. A link that damages three actors cannot be implemented as an apparently atomic pair of hidden P7 commands.
4. Use existing private intent custody and same-command retry. A lost ACK cannot redraw cards, choose another outcome, recreate a summon or spend twice.
5. P9-v1's pinned definition/support guards must remain intact. A new supported domain needs its own bounded capability review and integration with the existing P7 authority; widening a UI dropdown does not authorize execution.

## UNRESOLVED architecture gates

Atomic N-actor consequences; entity creation/removal; persistent linked effects; event causality/deduplication; private card visibility; authoritative rest/turn events; condition schedules; ownership handoff; area membership; exact form/trait engine behavior. These need approved engine extensions before the dependent class can claim authoritative completion.
