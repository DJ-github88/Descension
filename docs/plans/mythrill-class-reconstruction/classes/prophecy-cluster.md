# Augur, Oracle and Harbinger — joint differentiation decision

**Status: evidence-backed comparison and proposed directions, not three completed dossiers.**

## Current and historical evidence

- **CONFIRMED local Augur:** Benediction/Malediction, Auspex10/10, Harbinger5/15, Hierophant15/5; unused pools become negative Omen Debt on long rest (`augurResourceContract.js:3–11,34–65`). Its actual planner currently selects one pool per spell; dual-cost authoring cannot be assumed to pay both.
- **AUTHORED current Harbinger:** delayed doom plus chaos/rift/wild-surge content. Local contract is Mayhem0–100, tier markers and potential spend/release, not automatic damage (`harbingerResourceContract.js`). Current specialization passives are largely damage-type boosts; they do not yet establish three radically different prophecy playstyles.
- **HISTORICAL Oracle:** Omen Debt0–10 from spellcasting, threshold penalties3/6/9 and eruption10; Seer/Truthseeker/Fateseer. That is another pressure meter and should not be restored unchanged merely to preserve its name.
- **HISTORICAL Doomsayer:** planted prophecies using two dice to define low/high interval, a separate resolution die, boundary/base, interior/enhanced, outside/backlash, doubles with no interior; Havoc0–15. Recovered definition supports genuine prior design, not a placeholder icon.

## Proposed distinction

| Class | Player's actual verb | Resource topology | Timing | What it must not do |
|---|---|---|---|---|
| Augur | Interpret an observed sign and make an immediate ritual decision | A bounded pair/collection of actual observed omens | Reactive to an original event | Reroll arbitrary outcomes or predict every future |
| Oracle | Commit to a limited possible future and prepare for it | Two finite forecast commitments with explicit scope/expiry | Before the named event | Spawn facts the GM never knew or guarantee unrolled RNG |
| Harbinger | Plant a declared calamity and force its arrival | Two active doom clocks/conditions; resolve or dismantle | Delayed caused effect | Be merely Chaos Weaver's random branch bag |

### Augur direction

Preserve real sign-reading and native material focus. Rebuild trees around **Auspex** (balance and interpret contrasting signs), **Ill Omen** (hostile omen intervention; proposed rename for `harbinger` tree), **Hierophant** (ally rites and communal protection). Pool-cap differences alone do not make them distinct; require different event/target choices. Track original event IDs, per-turn observation limit and expiry; no mining repeated UI dice or counting your own generated reaction as a fresh sign.

Draft three-turn rhythm: observe actual even event→store one Benediction; next turn choose to spend or hold for contrasting odd event; third turn perform a prepared rite from that pair. Final exact counts/amounts and current dual-pool migration remain unresolved.

### Oracle candidate direction

Two **forecast slots**. Each states one eligible event category, exact subject, expiry2 own turns and a predefined preparation benefit. Forecasting costs1 AP and occupies a slot; fulfillment gives the published benefit once, failed/expired forecast releases no reward. It is conditional preparation, not privileged access to hidden enemy plans or future rolls. The GM can offer bounded visions from actual scenario information; a spell cannot claim unknown information was already authored.

Trees: **Seer** prepares personal positioning, **Witness of Peril** protects a named ally from a specified category, **Pathfinder** commits to a route/objective. Illustrative turns: T1 forecast “A faces a melee hit” (slot1/2); T2 protectA when that event occurs (slot0/2); T3 forecast an escape route rather than more damage. Needs a compelling benefit beyond a generic Ready action before the class earns release. Full class design remains unresolved.

### Harbinger direction

Keep Harbinger name, consider Doomsayer the strongest familiar alternate. Resource is a maximum of two **declared calamities**, each with exact target/area, trigger or clock, published effect and disruption method. Setup takes AP; accelerated arrival consumes a specific preparation, not generic probability manipulation. Three trees: **Requiem** single-target doom fulfillment, **Endbringer** displacement/escape denial around a doomed place, **Rift Herald** finite rupture geometry. These are proposals, not wholesale imports of historical tree IDs.

Illustrative turns: T1 plant a two-turn doom onE; T2 choose between protecting its anchor or advancing it by a paid action; T3 resolve once if trigger/expiry is met, otherwise publish disruption/failure. Historical interval-dice mechanic should be separately playtested: it may fit Chaos Weaver better, but do not transfer it automatically or keep it merely because it exists.

## Heritage and engine boundaries

Current Augur has material/ritual traditions, Harbinger actual entropic induction, and the Reckoner is an authored native deity connection. These are not universal prophecy licenses. Oracle's native origins must be independently established after all25-heritage review. No automatic inheritance of every Augur heritage.

All three need authoritative observed events, structured conditions, finite persistence, exact timing and supported effect consumers. Reactions belong to P13B, area membership/consequences to P12C/P14, not an independent class engine. Do not implement scheduled damage from a local setTimeout. Node trees, progression, six structured examples each, full spells and complete native variants are remaining deliverables.
