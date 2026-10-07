# Mythrill Project 4 — C5 Room-Authority First Cutover Runbook

Status: checked-in operator guidance. No deployment is performed by this
document. No credentials, tokens or secret values belong in this file.

Scope: first rollout of the lease-aware server build (C5 bounded Firestore
room-authority model B) plus its rules, and the rollback policy. The frozen
architecture is the single-replica, bounded-lease design described in
`docs/MYTHRILL_PROJECT_3_ARCHITECTURE_FREEZE.md` and the Project 4 final policy
freeze. Do not reorder these steps.

## Preconditions

- `config/railway.toml` declares `numReplicas = 1` and `drainingSeconds = 15`.
  Verify the ACTUALLY SELECTED Railway configuration (not just the file):
  replica count, drain window, start command, and the config file path that the
  service really uses.
- `firestore.rules` includes `roomAuthorities/{roomId}` deny-all for clients
  and the rules deploy artifact is the reviewed revision.
- The lease-aware build is the only build that can be deployed with C5 safety.
  A pre-lease binary that ignores `roomAuthorities` MUST NOT run concurrently
  with a lease-aware binary.

## First cutover

1. Prevent new traffic: put the current server into maintenance/disabled entry
   (stop accepting new connections and new room admissions).
2. Quiesce the existing pre-lease server: let in-flight saves finish; confirm
   no active writer remains. A pre-lease process has no lease to release, so it
   must be fully stopped, not merely drained.
3. Verify old writers terminated: no pre-lease process is running and no
   process can still write room roots or fragments.
4. Deploy the lease-aware server and rules in the frozen ordering: deploy rules
   first (server-only authority collection), then the server build.
5. Verify the actual Railway selected configuration:
   - one replica,
   - drain window as declared,
   - the expected start command and config path,
   - deployed rules/Functions versions match the reviewed revisions.
6. Verify one replica + drain configuration is effective (no autoscaling above
   one instance for the room-authority phase).
7. Verify no pre-lease binary remains (rollout completed; old revision fully
   replaced).
8. Smoke authority acquisition:
   - start a room; confirm `roomAuthorities/{roomId}` is created with a fresh
     `authorityInstanceId`, positive `authorityGeneration`, `state: held` and a
     backend `expiresAt`;
   - confirm a durable save succeeds and the authority record advances
     `fencedAt` in the same batch;
   - confirm a second process cannot acquire while the lease is live.
9. Only then restore user traffic.

## Rollback

- Normal rollback: deploy the previous LEASE-AWARE build. Authority records
  remain valid; no special outage is required.
- Returning to a pre-lease/unfenced build requires a FULL quiescent cutover:
  stop all traffic, terminate every lease-aware writer, wait for lease expiry
  (or confirm release), and accept that C5 safety is withdrawn until a
  lease-aware build is restored. A pre-lease build must never overlap a
  lease-aware build.

## Evidence to record (no secrets)

- Selected Railway configuration and revision IDs for server, rules and
  Functions.
- Lease acquisition/validation smoke results (room IDs, generations, states;
  never tokens or credentials).
- Confirmation that no pre-lease process was running during the overlap window.
