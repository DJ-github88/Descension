# Doomsayer — approved Harbinger successor

**Creator decision:** Doomsayer is the approved player-facing replacement name for Harbinger. Existing `harbinger` IDs, Mayhem, spells, trees, variants and saves remain legacy-resolvable. No automatic class change, resource reinitialization or duplicate record is authorized.

**Status:** RI-5 complete content and implementation package; development status, manual tabletop only. This is not Sol acceptance or a production-power claim.

## Identity and repeated decisions

Doomsayer declares finite, public calamities: an exact subject or visible area, one trigger, a one-to-three own-turn clock, one published effect and one visible disruption method. At most two active records exist. A trigger resolution grants 3 Havoc, expiry grants 1 and dismantle grants 0. Havoc runs 0–15, persists between encounters and resets only on a completed long rest.

Repeated decisions: which subject or area to doom; which trigger and clock to publish; whether to advance, dismantle or let the record expire; when to spend Havoc on an authored finisher; which ally to warn.

Distinctness:

- Not Fate Weaver: no consent links, thread tokens, damage routing or re-anchoring.
- Not Oracle: no forecast reading of a future event; Doomsayer causes a declared ending.
- Not Harbinger: no Mayhem pressure gauge, Wild Surge or d100 probability rewrite. Legacy Harbinger keeps those exact mechanics.
- Not Chaos Weaver: no randomized branch distribution, six-tile inventory or anomaly sample.

## Resource state

```json
{
  "version": 1,
  "type": "doom-calamities",
  "havoc": 0,
  "maxCalamities": 2,
  "calamities": [
    {
      "id": "stable id",
      "subject": "exact visible subject or area",
      "trigger": "one declared trigger",
      "clock": 2,
      "effect": "published effect",
      "disruption": "public disruption method",
      "status": "active",
      "createdAtTurn": 0,
      "expiresAtTurn": 2
    }
  ]
}
```

Rules: at most two `active` records; clock 1–3; statuses `active`, `resolved`, `dismantled`, `expired`; resolution once; no automatic clock, timer, reconnect, initiative or rest advance; no hidden information; no dice reuse; Havoc above 15 is lost.

## Progression and trees

- Two core grants: `cr1_doomsayer_plant_calamity`, `cr1_doomsayer_dismantle_calamity`.
- Forty optional records, four at every level; starting picks 1; one optional pick per level; earlier unchosen picks remain legal.
- Three trees, 18 nodes each and 50 ranks each: **Requiem** (single-target finish), **Endbringer** (heavier/wider/later calamity), **Forewarner** (publish and protect).
- Six talent actives: `cr1_doomsayer_quiet_requiem`, `cr1_doomsayer_lengthen_the_hour`, `cr1_doomsayer_sound_the_warning`, `cr1_doomsayer_absolute_requiem`, `cr1_doomsayer_the_last_hour`, `cr1_doomsayer_the_published_doom`.
- Signatures: level 3, 10 same-tree points, two fully ranked entry nodes. Capstones: level 10, 45 same-tree points, signature and final passive predecessor.

Full IDs, names, gates, rank values, AP and structured effects are in [the RI-5 content lock](../implementation/evidence/RI-5-doomsayer-oracle/CONTENT-LOCK.md) and `CONTENT-LOCK.json`.

## Heritage and acquisition

Recommendations only; no registry edge:

- `skald_human` — Frozen Archive star-arithmetic and Malakor's doom-arithmetic.
- `thrask_solari` — Anhur vent-readings, cooling forges and published dying-light arithmetic.
- `tessen_human` — four centuries of rehearsed extinction and keep-collapse discipline.

Acquisition records: `witnessed_calamity`, `doom_arithmetic`, `disruption_method`, `forewarning_accounting`.

No native pair is marked live. `heritageEffectsImplemented` is false and `nativeAccess` is empty.

## Manual limits

No automatic calamity creation, clock advance, resolution, Havoc gain/spend, damage, ward, movement or expiry. The table records every declaration, advance and outcome. The class does not claim combat execution, balance validation, automatic migration or account/cloud persistence.
