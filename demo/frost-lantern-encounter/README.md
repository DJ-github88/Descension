# Demo Encounter: The Sunken Shrine Skirmish (DEMO CONTENT)

> **Label:** `DEMO CONTENT` — non-canonical scenario assets for playing and verifying existing released Mythrill VTT mechanics. Canonical class and catalogue records are untouched.

## What This Demonstrates
1. **Heightened Senses passive activation** (`+2` flat initiative on an eligible Perception `NOVICE` character, activated by GM).
2. **Relationship-aware spell targeting** (`Enemies` vs `Allies` target picker filtering & live relationship enforcement).
3. **Component-watch damage spell + paired paid follow-up** (`Demo Frost Grip` watching `Direct Damage` / `effects:direct` -> optional paid `Demo Echo Lance`).
4. **Healing follow-up** (`Demo Healing Lantern` on an eligible wounded ally -> optional paid `Demo Healing Echo` on another ally).
5. **Ongoing periodic effect display** (`Demo Searing Frost` with `2` target-turn ticks -> `1 of 2 target-turn tick remaining` -> `Tick 2 of 2 (last tick; effect ended)`).
6. **Reload/rejoin during encounter** (retaining actor identity, passive, and ongoing effect state).
7. **Combat lifecycle approval cleanup** (ending/restarting combat closes pending spell-consequence approvals).

## Reusable Room Export / Import Availability
Reusable room export/import is **not available** in the App. Therefore, this folder delivers:
- [`scenario-records.json`](file:///d:/VTT/demo/frost-lantern-encounter/scenario-records.json) — the supported actor seeds, explicit ally/enemy relationships, and Spell Wizard authoring recipes.
- [`PLAY_SHEET.md`](file:///d:/VTT/demo/frost-lantern-encounter/PLAY_SHEET.md) — concise player-facing play sheet with exact visible UI actions.
- [`demo-server.cjs`](file:///d:/VTT/demo/frost-lantern-encounter/demo-server.cjs) — disposable local demo-room host (in-memory `productionStackServer` fixtures) for immediate play or Playwright verification.
- [`verify-encounter.cjs`](file:///d:/VTT/demo/frost-lantern-encounter/verify-encounter.cjs) — Playwright verification script exercising the rendered App controls for all 6 play-sheet steps.

## Manual Setup in Any Disposable Room
1. Create a disposable room and place **Ilse** (Perception `NOVICE`, Agility `14`), **Mira** (`18/30 HP`), **Shade Stalker A** (`40/40 HP`), **Shade Stalker B** (`30/30 HP`), and **Wounded Scout C** (`16/30 HP`).
2. Set GM relationships: `Ilse <-> Mira` (`ally`), `Ilse <-> C` (`ally`), `Ilse <-> A/B` (`enemy`).
3. Author the 4 spells from [`scenario-records.json`](file:///d:/VTT/demo/frost-lantern-encounter/scenario-records.json) in the **Spell Wizard** and admit them via **Spell Library**.
4. Register the GM Component watch (`Demo Frost Grip` -> `effects:direct` -> `Demo Echo Lance`) and follow [`PLAY_SHEET.md`](file:///d:/VTT/demo/frost-lantern-encounter/PLAY_SHEET.md).

## Fixture Identity & Cloud Disclosure (Disposable Demo Host)
When running `demo-server.cjs` / `verify-encounter.cjs`:
- **Fixtures:** Identity/provider verification, canonical character ownership (`demo-ilse -> demo-owner`, `demo-mira -> demo-ally`), room lease, and cloud persistence are in-memory `productionStackServer` fixtures on `127.0.0.1`.
- **Not real persistent-room support:** No live Firebase, deployment, or persistent cloud database is used; the disposable room exists only for the lifetime of the local process.
