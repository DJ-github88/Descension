# Oracle — independent insight and forecast class

**Creator decision:** Oracle remains an independent class. It is not an Augur alias, does not inherit Augur Benediction/Malediction or Omen Debt, and does not use Fate Weaver consequence threads.

**Status:** RI-5 complete content and implementation package; development status, manual tabletop only. This is not Sol acceptance or a production-power claim.

## Identity and repeated decisions

Oracle commits at most two prepared forecasts. Each forecast names one exact subject, one event category from a closed list, one published benefit and a one-or-two own-turn expiry. When the named category occurs, the benefit applies once; failure or expiry grants nothing. There is no debt track and no die replacement.

Repeated decisions: which subject and category to forecast; whether to prepare a personal certainty, an ally protection or a route; when to release a forecast before it expires; whether the published benefit is worth one of two slots.

Distinctness:

- Not Augur: no Benediction/Malediction pair, no Omen Debt, no debt thresholds or eruption.
- Not Fate Weaver: no links, tokens, consent graph, damage routing or severance.
- Not Doomsayer: no caused calamity, clock or Havoc; Oracle prepares a bounded response to an event, not the event itself.
- No omniscience: reading uses observable evidence or a GM-authored bounded vision; no hidden plans, private intentions or unrolled outcomes.

## Resource state

```json
{
  "version": 1,
  "type": "oracle-forecasts",
  "maxSlots": 2,
  "slots": [
    {
      "id": "stable id",
      "subject": "exact actor, object or place",
      "category": "attack-roll",
      "benefit": "published benefit",
      "expiresInOwnTurns": 1,
      "status": "prepared",
      "createdTurn": 0
    }
  ]
}
```

Categories: `attack-roll`, `save`, `check`, `damage`, `movement`, `forced-movement`, `environmental-hazard`. Statuses: `prepared`, `fulfilled`, `failed`, `expired`. At most two prepared forecasts; expiry one or two own turns; no automatic fulfillment, benefit, expiry or slot change.

## Progression and trees

- Two core grants: `cr1_oracle_commit_forecast`, `cr1_oracle_release_forecast`.
- Forty optional records, four at every level; starting picks 1; one optional pick per level; earlier unchosen picks remain legal.
- Three trees, 18 nodes each and 50 ranks each: **Seer** (personal preparation), **Witness of Peril** (named ally protection), **Pathfinder** (declared route and objective).
- Six talent actives: `cr1_oracle_read_the_next_step`, `cr1_oracle_witness_the_blow`, `cr1_oracle_chart_the_safe_line`, `cr1_oracle_the_clear_moment`, `cr1_oracle_the_watched_thread`, `cr1_oracle_the_certain_road`.
- Signatures: level 3, 10 same-tree points, two fully ranked entry nodes. Capstones: level 10, 45 same-tree points, signature and final passive predecessor.

Full IDs, names, gates, rank values, AP and structured effects are in [the RI-5 content lock](../implementation/evidence/RI-5-doomsayer-oracle/CONTENT-LOCK.md) and `CONTENT-LOCK.json`.

## Heritage and acquisition

Recommendations only; no registry edge:

- `vashir_astril` — Lumian carried charts, observatory records and internal Lumia echoes under a starless sky.
- `ordan_human` — Ordu public pastoral migration, throat-sung route maps and chosen herd protection.

Acquisition records: `observed_omen`, `forecast_discipline`, `expiry_accounting`, `bounded_reading`.

No native pair is marked live. `heritageEffectsImplemented` is false and `nativeAccess` is empty.

## Manual limits

No automatic forecast, slot, benefit, expiry, damage, ward, movement or hidden information. The table records every subject, category, benefit, expiry and outcome. The class does not claim combat execution, balance validation, automatic migration or account/cloud persistence.
