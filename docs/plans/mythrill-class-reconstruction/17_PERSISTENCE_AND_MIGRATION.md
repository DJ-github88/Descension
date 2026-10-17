# Persistence, availability and versioned migration architecture

## CONFIRMED paths

- `characterHelpers.js:190–215` snapshots acquisition, talent allocation, primary spec and full classResource.
- `coreSlice.js:918–925` restores talents/spec and normalizes saved resource or initializes missing state.
- `infoSlice.js:224+` initializes on class change; this is not a lossless migration facility.
- `characterPersistenceService.js:106–245` explicitly carries class/acquisition/body states and preserves unmapped fields through preservedFields and the existing shape codec.
- Room class-payment home is separately versioned and revisioned; original P9 supports spheres/notes/Devotion only. Personal storage timestamps cannot override accepted room state.

These paths require extension/testing, not a second storage system. Preserve P5/P6 private scoping, owner identity, unknown fields, source acceptance and environment limits.

## PROPOSED availability axis

`historical-archive` → `development-candidate` → `playable-prototype` → `playtest-ready` → `release-approved`. `retired-compatibility` is a separate stable state, not an error. Creative rejection can return a candidate to archive without deleting its data or users' prototypes.

Availability gates new creation/pickers; lookup compatibility gates saved data resolution. A class can be resolvable but not selectable for new release characters. Runtime support is another axis (`manual`, `local-bookkeeping`, `bounded-authoritative`, `complete-for-declared-scope`). Do not conflate “prototype selectable” with “all spells executed.”

## PROPOSED version boundaries

Keep class ID, display name, ruleset version, resource-domain schema version, content version and migration version distinct. **Druid is approved as the transformation class's player-facing name only**; no technical-ID/resource/save conversion is approved. Legacy Shaper remains addressable with existing IDs and compatibility. Retain R1 draft technical handles until a separately approved identity/version/migration strategy exists; they are not player-facing labels. Hunter public naming and pursuit redesign also need separately documented compatibility choices.

Decode old resource aliases only with known owner/version. Retain raw original payload when decoding is lossy or ambiguous. Refuse unsupported future versions for execution while preserving them for export/recovery. Normalize a display copy rather than overwriting unknown original bytes at load.

## Boundary table

| Record | Must migrate/preserve | Failure/recovery |
|---|---|---|
| Personal character | Class, acquisition, bodyStates, known spells, talents, spec, resource, icon override | Original backup + explicit destination draft, no destructive auto-save |
| Personal library/action slots | Original/custom IDs and exact payloads, talent-spell stable IDs | Orphan entries remain viewable/reselectable, not silently deleted |
| Runtime overlay | Prepared form/hand/roster and unresolved intents | Exact intent retained; no restart-generated refill |
| Campaign/room actor | Binding/incarnation, class home, active effects/entities | Close or reconcile pending commands, then fresh binding; no stale-home overwrite |
| Multiplayer projection | Public fields and authoritative revision | Snapshot/catch-up without replaying costs or RNG |
| Rules/lore/assets | Legacy alias references and old path compatibility | Forward mapping plus preserved archive; no mass filename replacement |

## Reversibility limits

Reversible identity migration does not mean reversible combat history. Preserve original personal saves and explicit mapping choices. Accepted consequences, expended items and defeated summons remain accepted. A rollback creates a reconciled current state/fresh binding, not a time-travel refund. Test interruption at each personal-save and room-transition boundary; do not promise an atomic transaction across local storage, Firebase and room transport.

Final schema keys, migration-journal storage classification and per-ID transfer tables are still incomplete and must be frozen under CR1/CR5 before implementation.
