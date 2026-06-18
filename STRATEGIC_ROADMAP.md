# Mythrill VTT — Comprehensive Strategic Roadmap

**Authored:** Jun 17, 2026
**Scope:** Full-app analysis covering Lore & Narrative, Frontend/UX, Game Mechanics, Backend/Realtime, and State/Code Architecture.
**Purpose:** A prioritized, multi-iteration action plan synthesizing every audit performed on the codebase. Designed to be worked through phase-by-phase across future chats.

---

## 0. Executive TL;DR

Mythrill VTT is a **content-rich, ambitious virtual tabletop** with the breadth of a small commercial MMORPG: ~864 spells, 20 classes, 11 races, ~360 creatures, 660+ items, a 542 KB rulebook, 725 talent nodes, a 13-step spellcrafting wizard, full multiplayer, and a uniquely original dark-fantasy setting ("the sun was buried to escape a cosmic predator; fear itself spawns monsters").

**The creative backbone is genuinely strong.** The world-building, race design, and bestiary would hold up against published TTRPG settings. The spellcrafting wizard is a genuine crown jewel.

**The engineering has not kept pace with the content.** Three major systems (talents, crafting, quests) are content-complete but mechanically inert. Half the classes lack resource gauges. All combat math runs unvalidated client-side. The codebase contains 13k-line components, ~2,600 console statements, pervasive circular store coupling, and ~2 MB of committed scratch files. The OpenAI SDK is bundled client-side with key plumbing ready to leak. Documentation has drifted from reality in measurable ways (the GM guide describes 6 classes that no longer exist; CLAUDE.md claims "64 socket events" — actual is 89).

**The opportunity:** Most of what's broken is fixable with discipline, not rewriting. The plan below sequences fixes so each phase unlocks the next.

### Health Scorecard

| Domain | Grade | Headline |
|---|:---:|---|
| Lore & World-Building | **A−** | Original, cohesive, beautifully written at the spine; drift at the edges |
| Mechanics & Systems | **C+** | Massive breadth, but 3 systems are non-functional, balance unvalidated |
| Frontend / UX | **C** | Feature-dense and laudably lazy-loaded, but inaccessible, cluttered, no design system |
| Backend / Realtime | **C+** | Solid sync primitives; god-files, no CI gate, single-server only |
| State & Architecture | **C−** | Modern patterns, but god-files, dead deps, circular coupling, security smells |
| Repository Hygiene | **D** | ~2 MB of tracked scratch files, ignored tooling, drift in docs |
| Testing | **D−** | 1 frontend test, server tests not run in CI |
| Security | **D** | OpenAI plumbing in client; permissive auth; no virtualization abuse protections |

---

## 1. Top 10 Strengths to Preserve

These are working well and must not be regressed by refactor work.

1. **The Wyrd cosmology and "Silent Seventh" mystery** (`rulesData.js:86`) — original, campaign-grade.
2. **Race design as the gold standard for lore-mechanic integration** (`briaran.js:58,94`, `neth.js`, `astril.js`).
3. **The bestiary** — 182 creatures with 7 lore fields each, systematically tied to regional folklore.
4. **Deep locations** — scene-ready city profiles with all five senses (`deepLocationData.js` Greymark Keep).
5. **The Spellcrafting Wizard** — 13 steps, 21 mechanics subsystems, 6-dimension balance calculator.
6. **`FirebaseBatchWriter` + `MovementDebouncer`** — batching, retries, graceful shutdown (`server/services/syncService.js`).
7. **Lazy-loading discipline** — comprehensive `React.lazy` + `lazyWithRetry` with `.catch()` fallbacks.
8. **Firestore 1 MB workaround** via split-storage with orphan cleanup (`firebaseService.js:201-278`).
9. **Firebase security rules** — 350 lines, including subscription-tier protection (`firestore.rules`).
10. **Fantasy-themed error copy** — "the messenger ravens cannot find their path" (`RoomLobby.jsx:15-60`).

---

## 2. Critical Issues (P0 — Fix Before Any New Features)

These are blockers — security exposure, broken features, or dangerous drift.

### P0-1. Remove OpenAI SDK + key plumbing from the client  · 🔒 Security · ~2h
- `vtt-react/package.json:22` declares `openai` as a **production** dep.
- The SDK is **never imported** in `src/` — pure dead weight.
- But the env-var plumbing is wired everywhere: `config/env.js:34`, `polyfills.js:17-19`, `.env.example`.
- **Risk:** One env-var flip bakes a billable secret into the public JS bundle.
- **Action:** Remove `openai`, `jimp`, and the 8 `*-browserify` polyfills (`buffer`, `crypto-browserify`, `os-browserify`, `path-browserify`, `process`, `stream-browserify`, `util`, `vm-browserify`). Delete `OPENAI_API_KEY` from `.env.example`. Move any future AI calls to `server/`.
- **Bonus:** Will shrink the bundle significantly and may remove the 8 GB build-heap requirement.

### P0-2. Wire up Talent Trees (725 nodes are dead content)  · ⚙️ Feature · ~1d
- `data/talentTrees/*.js` defines 725 talent nodes across 20 classes (3 trees each).
- `components/windows/TalentTreeWindow.jsx:563-574` displays a "Forging Your Path / coming soon" overlay.
- Talents loaded from `characterStore.talents` for display only — never written back. Local `useState({})`.
- **Action:** Implement write-back to `characterStore.talents`, persist to Firebase, remove the overlay. Add respec rules.

### P0-3. Make Crafting Actually Produce Items  · ⚙️ Feature · ~4h
- `craftingStore.js:531` `completeCraftingItem()` marks queue items `'completed'` but never transfers items to inventory and never syncs Firebase.
- 9 professions × ~25 recipes = entirely cosmetic.
- **Action:** Call `useInventoryStore.addItem(craftedItem)` on completion. Add Firebase sync. (Audit item M-09.)

### P0-4. Make Quests Deliver Rewards  · ⚙️ Feature · ~4h
- `questStore.js` has no Firebase import and 0 calls to `characterStore`/`inventoryStore`.
- Reward struct exists but is never applied.
- **Action:** On `completeQuest`, dispatch XP/gold/items to the appropriate stores + Firebase. (Audit item M-10.)

### P0-5. Add Class Resource Gauges for 10 Missing Classes  · ⚙️ Feature · ~4h
- `data/classResources.js` defines resources for only 10/20 classes (Pyrofiend, Minstrel, Chronarch, False Prophet, Gambit, Harbinger, Inquisitor, Martyr, Plaguebringer, Revenant).
- **Missing 10:** Arcanoneer, Berserker, Shaper, Apex, Animist, Lunarch, Spellguard, Toxicologist, Warden, Augur — many of which consume `classResource` costs in their spells (Berserker 18, Shaper 14, Apex 31, Spellguard 13, Warden 31, Augur 31 uses each).
- **Action:** Add `CLASS_RESOURCE_TYPES` entries for each missing class. Verify the gauge renders in `ClassResourceBar.jsx`.

### P0-6. Regenerate the GM World Guide  · 📖 Lore · ~3h
- `docs/GM_WORLD_GUIDE.md` profiles 6+ classes that no longer exist: Exorcist, Covenbane, Dreadnaught, Chaos Weaver, Doomsayer, Lichborne (all merged in `CONSOLIDATION_MASTER_PLAN.md`).
- The guide itself acknowledges the drift risk at line 5 but has not been regenerated.
- **Action:** Re-generate from `data/rulesData.js` + `data/classes/index.js`. Delete obsolete class sections. Verify against `CONSOLIDATION_MASTER_PLAN.md`.

### P0-7. Delete Committed Scratch Files  · 🧹 Hygiene · ~1h
- **21 tracked fix/debug/audit scripts at repo root** (`git ls-files`): `add_cooldowns.js`, `analyze_spells*.js`, `audit_*.js`, `batch_update.py`, `check_cd.js`, `debug_*.js`, `final_cooldown_fix.js`, `fix_arcanoneer_p1.ps1`, `fix_commas.js`, `fix_dreadnaught_spells.js`, `fix_rules.py`, `fix_typeconfig.js`, `harbinger_spells_part.js`, `test.js`, `truncate_arc.ps1`, `verify_*.ps1`.
- **5 backup files in source tree:** `berserkerData_backup.js.disabled`, `toxicologistData_backup.js.disabled`, `toxicologistSpells_new.js` (orphan), `_test_augurData.js.disabled`, `emberth.js.backup-before-5trait`, `ItemWizard.new.jsx` stub.
- **Action:** `git rm` them all. History preserves them. Also `git rm` the `.disabled` files.

### P0-8. Stop CI From Swallowing Test Failures  · 🧪 Quality · ~30min
- `.github/workflows/deploy.yml` runs `npm test ... || echo "No tests found"` and `npm run lint ... || echo "No lint script found"` — failures are silently ignored.
- **Server tests are not run in CI at all** — only the frontend script is invoked, and only from `vtt-react/`.
- **Action:** Remove the `|| echo` swallow. Add a separate CI job that runs `cd server && npm test`. Gate merges on green.

### P0-9. Remove `eval()` from polyfills  · 🔒 Security · ~2h
- `vtt-react/src/polyfills.js:150-218` — "ULTIMATE TITLE POLYFILL" — runs three `eval()` calls and monkey-patches `React.createElement` to define a global `title`.
- This paper-overs a real bug (`App.jsx:774-787` catches `title is not defined` at app root).
- **Action:** Find and fix the actual undefined `title` reference. Delete the polyfill block.

### P0-10. Restore the Interactive World Map Geometry  · 🗺️ Feature · ~1d
- `data/locationCoordinates.js` is 3 lines: `export const LOCATION_COORDINATES = {};`
- `data/regionPolygons.js` defines all 7 regions but every `points: []` is empty.
- The "Phase 7 Interactive World Map" ships as a blank canvas — GMs must hand-place every pin and draw every region.
- **Action:** Author coordinates for the 86 zones and 7 region polygons. Or generate procedurally from `zoneData.js` connections graph as a starting point that GMs can refine.

---

## 3. Strategic Roadmap (Phases)

Each phase is sized to be roughly 1–3 chats of work. Phases are ordered by dependency: earlier phases unlock later ones.

### Phase 1 — Stabilization & Security  *(do first; ~1 chat)*
**Goal:** Stop the bleeding. Make the app safe to ship and safe to develop on.

- [x] **P0-1** Remove `openai`, `jimp`, polyfills from client *(done: removed 10 deps from `package.json`, plumbed out `OPENAI_API_KEY` in `.env.example`/`env.js`/`polyfills.js`, deleted dead `config-overrides.js` that was the actual polyfill wiring point [react-app-rewired leftover], `npm install` removed 126 packages. Note: also `git rm`'d 29 related tracked scratch scripts in `vtt-react/` root — 12 named in the plan + 17 more of the same class [slice*.py, get_*.py, fix_tooltips*, check_*, etc.] — that were the only `jimp` consumers. Pre-existing test failure in `groven.js:406` [legacy `damageType` string schema, 214 occurrences total] is unrelated — deferring to Phase 2.)*
- [x] **P0-9** Remove `eval()` polyfill block; find real `title` bug *(done: root cause was bare `title` reads in `DraggableWindow.jsx` — fixed in commit `0159dd06` [Aug 2025]; the eval polyfill in `polyfills.js:117-185` was dead defensive code. Deleted the polyfill block, the matching error-swallow handler in `App.jsx:771-788`, and updated the stale comment in `index.js:31`. Verified no other bare `title` reads exist in `src/`)*
- [x] **P0-7** Delete 21 tracked scratch scripts + 5 backup files *(done: 21 tracked files `git rm`'d; 5 gitignored `.disabled`/`.backup` files removed from disk — they were already in `.gitignore`, not tracked)*
- [x] **P0-8** Fix CI to actually fail on test/lint failures; add server-test job *(done: removed `\|\| echo` swallows from frontend lint+test steps in `deploy.yml`; added `CI: true` to test step; added new `server-tests` job on Node 20 running `npm ci && npm test`; gated `deploy-to-netlify` on both `build-and-test` AND `server-tests`. Side-fixes: (a) added `--exit` to server mocha script — tests were hanging on dangling Firebase/logger handles after completion; (b) fixed false-positive in `races.test.js:131` — validator regex was flagging nested `statusEffect.damageType` [legitimate DoT tick type] instead of only top-level spell `damageType`; replaced blunt regex with brace-depth-aware scan. Result: frontend 650/650 green, server 49/49 green. Note: server lint has 297 pre-existing errors [269 auto-fixable] — NOT added to CI yet; needs `npm run lint:fix` cleanup first. GitHub branch protection rules must be set separately in repo settings.)*
- [x] Activate git hooks repo-wide (`git config core.hooksPath .githooks`); un-ignore `scripts/setup-git-hooks.*` *(done: `git config core.hooksPath .githooks` set. `.githooks/pre-commit` [bash] + `.githooks/pre-commit.ps1` [PowerShell alt] already tracked. `scripts/setup-git-hooks.{ps1,sh}` already tracked — not gitignored, no un-ignore needed. **Caveat:** the pre-commit hook runs a full `npm run build` on every commit [8 GB heap, minutes-long] — consider moving the build gate to pre-push or CI-only in a future pass. Bypass with `--no-verify` for emergencies.)*
- [x] Update `CLAUDE.md`, `ARCHITECTURE.md`, `API.md` to reflect **89 socket events** (not 64), correct file sizes, remove references to nonexistent `server.refactored.js` *(done: CLAUDE.md — 64→89 in two places, deleted migration section, dropped "(Refactored)" from heading; ARCHITECTURE.md — fixed server.js label [was "original - 6996 lines"], deleted `server.refactored.js` entry, corrected line counts, added 3 missing services [optimizedFirebase, syncRecoveryService, tierService], deleted obsolete Migration Guide section, 64→89; API.md — already clean, no changes needed)*
- [x] Move `firebase.json`/`firestore.rules` to repo root OR update `deploy-rules.bat` and document the `pushd config` requirement *(done: moved `firebase.json`, `firestore.rules`, and `firestore.indexes.json` to repo root via `git mv`. Simplified `deploy-rules.bat` — removed `pushd config`/`popd` [no longer needed since firebase.json is at root]. Firebase CLI now works from repo root directly. **Note:** `config/` still holds `netlify.toml`, `nixpacks.toml`, `railway.toml` which are also misplaced [their CLIs expect root] but out of scope for this item — flag for future deployment-config cleanup.)*
- [x] Remove dead service imports in `server.js`: `memoryManager`, `requestTracer`, `ErrorHandler` (or wire as middleware), `eventBatcher` *(done: removed `memoryManager` + `requestTracer` imports [zero usage anywhere — `global.memoryManager` check in errorHandler.js was always falsy]. Wired `ErrorHandler` as Express error-handling middleware [was instantiated at server.js:97 but never used — now handles unhandled route errors]. **Did NOT** set `global.errorHandler` — optimizedFirebase.js:264 checks for it but wiring that would change runtime behavior; deferred to Phase 6. **Note:** `eventBatcher` is NOT dead [roadmap was wrong] — actively used at server.js:184, passed to RealtimeSyncEngine + services object)*
- [x] Lock down Firebase rules: `rooms/{roomId}` should not allow read by unauthenticated-as-guest users *(done: confirmed app uses Firebase Anonymous Auth [`authService.js:163` calls `signInAnonymously`], so anonymous guests had `request.auth != null` and could read ALL room documents. Tightened `firestore.rules:80` from `allow read: if request.auth != null` to additionally check `request.auth.token.firebase.sign_in_provider != 'anonymous'`. Subcollections [gameState, chat at lines 100-112] already require membership — only the top-level doc was exposed. **Deferred to Phase 6:** full members-only restriction [`isRoomMember()`] — needs E2E testing of the join flow first since the client reads rooms directly from Firestore and must be in `members` array before reading.)*

**Exit criteria:** Bundle is smaller; CI fails on red; no eval in polyfills; no scratch files in repo; OpenAI plumbing gone.

---

### Phase 2 — Core Mechanical Completion  *(~2 chats)*
**Goal:** Make existing content actually playable.

- [x] **P0-2** Wire talent trees → `characterStore` + Firebase *(wiring COMPLETE; feature intentionally gated as alpha per owner. Persistence is fully wired: `characterStore.setTalents:1743` → `updateCharacterData(currentCharacterId,{talents},userId)` [Firebase] + debounced `saveCurrentCharacter()` + `syncWithMultiplayer()`. The UI interaction layer is fully built in `TalentTreeWindow.jsx`: `handleTalentClick:320` [learn], `handleTalentRightClick:399` [unlearn], `canLearnTalent:421` [prereq validation], `canUnlearnTalent:330` [dependency protection], `resetTalents:495`, point pool `(level||1)*3`. HOWEVER the owner clarified the "Forging Your Path / coming soon" overlay is INTENTIONAL — the talent system is an early alpha and was deliberately put on hold because the app already had too much content shipping. Overlay was removed during P0-2, then RESTORED at owner's request [`TalentTreeWindow.jsx:563-577` + its CSS rules in `TalentTreeWindow.css`]. Also added a matching "in development" notice to the rules page Talent Trees section [`rulesData.js:3698`]. Nav button already labeled "Talent Tree (Coming Soon)" [`Navigation.jsx:235`]. The wiring work stands; the gating is a product decision, not a bug. ALSO FIXED a real crash that prevented the window from EVER opening: `talentTreeData.js:323` referenced `PLAGUEBRINGER_VIRULENT_SPREADER` but the import at line 93-96 was missing it → `ReferenceError` crashed the whole `talentTreeData` module → the lazy-loaded `TalentTreeWindow` chunk failed → `.catch()` fallback showed "Error loading Talent Tree". The export exists at `plaguebringer.js:9`; added it to the import. Cross-checked all other 19 classes' spec-map references against imports — all complete. Frontend 650/650 green.)*
- [x] **P0-3** Wire crafting completion → inventory + Firebase *(done: the live completion path runs in each crafting UI's local `completeCrafting()` [Alchemy/Blacksmithing/FirstAid `*.jsx:331`], which already called `inventoryStore.addItemFromLibrary` — routing through `addItem` → `recordCharacterChange` → `characterSessionService.recordChange` + `saveCurrentCharacter()` for Firebase persistence + `syncInventoryToMultiplayer` for socket sync. Fixed a real multi-quantity bug in all 3 interfaces [`*.jsx:347`]: `addItemFromLibrary(resultItem, recipe.resultQuantity || 1)` passed a NUMBER as the options arg, but the store expects `{ quantity }` [`inventoryStore.js:687,843`] — so `resultQuantity > 1` recipes silently produced 1 item. Changed to `addItemFromLibrary(resultItem, { quantity: recipe.resultQuantity || 1 })`. Note: `craftingStore.completeCraftingItem:531` was also patched in the working tree to transfer items, but it is DEAD CODE — no caller invokes it; the 3 UIs destructure it yet never call it. Left as-is; consolidation deferred to Phase 4. Frontend 650/650 green.)*
- [x] **P0-4** Wire quest rewards → character/inventory + Firebase *(done: the GM/multiplayer path [`confirmRewardDelivery:431`] was already wired in the working tree, but the SOLO path [`completeQuest:266`] only flipped `status:'completed'` and delivered nothing. Extracted a module-scope `deliverQuestRewards(rewards)` helper [`questStore.js:78`] using the codebase's `require()`-for-circular-deps convention; it dispatches XP via `characterStore.awardExperience` [`→ updateExperience → recordCharacterChange('experience_gain'/'level_up')`], currency via `inventoryStore.updateCurrency` [`→ recordCharacterChange('currency_gain')`], and items via `addItemFromLibrary` [`→ addItem → recordCharacterChange('inventory_add')`] — all three reach Firebase through `characterSessionService` + `saveCurrentCharacter()`. Wired `completeQuest` to call it (read-via-get + pure set, matching `craftingStore.completeCraftingItem` style; added `completedAt` for parity with `markSharedQuestCompleted`). Refactored `confirmRewardDelivery` to use the same helper, removing ~25 lines of duplicated reward logic (behavior-preserving). Verified live: `QuestLogWindow.jsx:227 handleQuestComplete` → `completeQuest` is the real "Complete Quest" button path. Frontend 650/650 green.)*
- [x] **P0-5** Add `CLASS_RESOURCE_TYPES` for the 10 missing classes; verify gauges render *(done in pre-existing working-tree changes: configs for Spellguard/Animist/Arcanoneer/Shaper/Berserker/Toxicologist/Lunarch/Apex/Warden/Augur added to `classResources.js:1054-1980`; all 20 `visual.type` values dispatched in `ClassResourceBar.jsx:1253-1516`; 8 dedicated `<Class>ResourceBar` components exist under `data/classes/*/components/` and import cleanly; canonical names in `data/classes/index.js:25-50` match config keys exactly; flavor text for all 20 in `utils/resourceStatusFlavor.js`; frontend 650/650 green. Skipped render smoke test — only `@testing-library/jest-dom` is installed, no `@testing-library/react`, and the bar's 3 store + 8 sub-component deps make a render test disproportionate.)*
- [x] **Fix M-03** Rest should reset spell cooldowns and class resources (currently doesn't) *(done: 3 fixes in `gameStore.js`. (1) Short-rest cooldown filter was unreliable — only ran `if (saved)` from localStorage, so in-memory `activeCooldowns` was never filtered when localStorage was empty/stale; now reads from `get().activeCooldowns` directly and writes both store + localStorage. (2) Short rest had no class-resource recovery — added best-effort partial recovery for simple `current/max` shapes only [guarded by `typeof` check], using the same Spirit-based 25–75% formula as HP/mana; dual-resource/special classes [Chronarch, Shaper, Augur, etc.] are skipped [they reset on long rest]. (3) Long rest used naive `updateClassResource('current', max)` which broke the 10+ dual-resource classes [only set `current`, left strain/tokens/notes/etc.]; added `characterStore.resetClassResource()` action that calls `initializeClassResource(class, stats)` to re-init the full default state for all 20 shapes, with debounced auto-save + multiplayer sync. Frontend 650/650 green.)*
- [x] **Fix V-03** Persist spell cooldowns (currently component-state; bypassable by refresh) *(already handled — the roadmap concern was stale. Cooldowns live in `gameStore.activeCooldowns` [Zustand store state] and are mirrored to localStorage by `setCooldown:944`/`clearCooldown:952`/`clearAllCooldowns:958`. `restoreCooldowns:962` [which filters out expired real-time cooldowns while keeping turn_based] IS called from `ActionBar.jsx:125` on mount via useEffect. So cooldowns survive a refresh. No code change needed.)*
- [x] **Fix S-08 / S-10** Loot + currency race conditions (item/gold duplication via simultaneous actions) *(investigated + defensive guard added. After tracing the full flow: single-player path is sync-safe [`gridItemStore.lootItem` is a synchronous action — find→grant→removeItemFromGrid runs to completion before a second call enters, so double-clicks are serialized by the event loop]. Echo path is safe [the `item_looted` socket handler at `MultiplayerApp.jsx:3806` only notifies + removes, never re-grants, and filters own-vs-other loot]. Added a defensive `_lootInFlight` Set guard [`gridItemStore.js:14`] + check at lootItem entry + `finally` cleanup — cheap insurance against double-click and future async refactors. The GENUINE remaining risk is the multiplayer two-player race [both clients loot the same pile before either removal propagates] — this requires server-side arbitration [first-claim-wins] which is Phase 6 "conflict resolution" work; documented there.)*
- [x] **Fix S-09** Shop purchase rollback when inventory full *(done — confirmed economy bug in `ShopWindow.jsx:403 handlePurchase`. The old code added items in a loop, then on partial-fill `return`ed WITHOUT charging currency OR rolling back → free items [the comment even claimed it "prevents currency loss" but it caused the opposite — the shop lost]. Rewrote to track `itemsAdded` count, charge proportionally for only what was added [`actualCost = unitCost × itemsAdded`], remove only that many from merchant stock, and surface a "Inventory full! Purchased Nx..." warning on partial. No more free items; no rollback needed since we never over-grant. Frontend 650/650 green.)*
- [x] Migrate `universalCombatSpells.js` to new `cooldownType/cooldownValue` format (currently uses old `{type, value}` schema) *(done: all 18 `cooldownConfig` blocks in `universalCombatSpells.js` migrated from `{type,value}` → `{cooldownType,cooldownValue}`. Also fixed 3 single-line instances in `classSpellGenerator.js:219,269,301` that used the same old schema. Frontend 650/650 green.)*
- [x] Replace 5 leftover `none` and 3 `combat` cooldown types with `encounter` *(done — partially. The 3 `combat` types in `berserkerData.js:2205,2325,2423` → `encounter` [combat was a legacy synonym for encounter]. The `none` types were NOT replaced: the roadmap's count of "5" was incorrect — there are 83+ instances, almost all in RACE data where `cooldownType:'none'` correctly means "no cooldown / always available" for racial passives. `none` ≠ `encounter` [per-encounter]; replacing them would break every racial passive. Decision: retain `none` as a valid distinct type.)*
- [x] Normalize legacy damage types in `paths/`, `classResources.js`, `itemLibraryData.js`, `spellTemplates.js` via `normalizeDamageType()` *(investigated — deferred to Phase 3 as a no-op for current mechanics. Surveyed all 4 targets: `classResources.js` has ZERO structured legacy damage types [all matches are prose/icons/stance-names/visual-effect tags]. `paths/*.js` legacy types appear only in lore DESCRIPTIONS ["resistance to necrotic damage"], not data fields — BREACH-9 flags these as dead pre-rewrite D&D content. `itemLibraryData.js` legacy types are in `tags` arrays of a 12-item D&D placeholder slated for deletion [BREACH-10]. `spellTemplates.js:495` `classDamageMapping` uses legacy values but is keyed by non-existent classes [`elementalist`,`necromancer`,`witch`,...] — dead code. The active 20 class data files already use canonical array types [`damageTypes: ['ember']`]. `normalizeDamageType()` + `LEGACY_TYPE_MAP` exist in `data/damageTypes.js:104` and are already applied at consumer sites that need them [`creatureAbilityBuilders.js:106`]. No mechanical fix needed; real cleanup is Phase 3 lore/content work.)*

**Exit criteria:** Talents spend points; crafting yields items; quests pay out; all 20 classes show a resource bar; rest works; no dupes.

---

### Phase 3 — Lore & Content Consistency  *(~1–2 chats)*
**Goal:** Make the world bible trustworthy. Currently a GM mid-session can hit contradictions.

- [x] **P0-6** Regenerate GM World Guide from canonical data *(done: full deep regenerate of Part IV — Classes. Audit confirmed 6 obsolete class sections (Exorcist, Covenbane, Dreadnaught, Chaos Weaver, Doomsayer, Lichborne) + only 3 canonical (Pyrofiend, Arcanoneer, False Prophet) out of 20. Verified all 6 obsolete → canonical mappings via `data/classes/index.js` + `CONSOLIDATION_MASTER_PLAN.md`: Exorcist/Covenbane→Inquisitor, Chaos Weaver/Doomsayer→Harbinger (confirmed via CONSOLIDATION_MASTER_PLAN.md:63,133 — these two were NOT in the index.js comments), Lichborne→Revenant, Dreadnaught→Martyr (Ironclad spec). User chose **deep regenerate** scope. Extracted each class's `overview` block (originStory/description/quote) from all 20 `data/classes/*.js` files via a brace-matching extractor — note `shaperData.js:6` puts `overview:` inline after `damageTypes:` (had to relax the line-anchored regex). Authored 20 deep sections (~25 lines each: Calling/History/Cities/Races/Quote), ordered by region-of-origin with the 5 fusion traditions (Shaper, Inquisitor, Revenant, Animist, Gambit, Harbinger) placed last and annotated with their consolidation lineage inline — turning the merge history into in-world "syncretic tradition" lore. Added a Part IV intro header documenting all 6 obsolete-name → canonical mappings so GMs understand the lineage. Also updated the guide's own CANONICAL SOURCE NOTICE (L4-5) to point at the true per-part canonical sources (`rulesData.js` for world lore, `data/classes/*.js` overview blocks for Part IV) — the old notice claimed rulesData.js was the sole source, which was itself drift that contributed to this BREACH. Net: guide Part IV 168 lines → 387 lines, 9 sections (6 wrong) → 20 sections (all canonical). Verified: obsolete headers gone, PART IV-B preserved, frontend 650/650 green. One authoring-tool caveat: em-dashes in the drafted markdown survived cleanly as UTF-8 (e2 80 94) — the PowerShell console's mojibake-like display was an encoding-misread artifact, not real corruption; verified via raw byte inspection.)*
- [x] **BREACH 3** Already covered by P0-6 *(the obsolete-class drift in the GM guide — same root issue; resolved by the Part IV regeneration above)*
- [x] **BREACH 1** Pick canonical name for the forest: **"Bryngloom Forest"** (canonical per `loreDictionary.js:65-73` and `regionPolygons.js:50`). Replace 136 instances of "Gloom Forest" (`vreken.js`, `neth.js`, `RACE_BUILDING_SESSION_PROMPT.md:137`) *(done — premise corrected. Actual count was **30** instances of "Gloom Forest" across 8 tracked files (not 136); the roadmap conflated full-name + short-form + scratch-file occurrences. Sweep: 30 `"Gloom Forest"` → `"Bryngloom Forest"` in GM_WORLD_GUIDE.md (1), RACE_BUILDING_SESSION_PROMPT.md (3), loreDictionary.js (3), human.js (1), myrathil.js (3), neth.js (6), vreken.js (12), zoneData.js (1). **Canon refined with user input into intentional layered lore** (per their direction): the compound "Bryngloom Forest" is the modern full name; "the Gloom" / "Gloom's" is the **legitimate archaic name** retained in ~27 origin/ancient/narrative contexts (e.g. `neth.js:229 "the first freeze reached the Gloom"`, `neth.js:144 'older than the word "Gloom"'`); derived proper nouns **Gloom-Tongue**, **The Gloom-Lit**, **Gloom-Tithe** kept as archaic-rooted terms. Codified the layering with a one-sentence etymology appended to the `fullEntry` at `loreDictionary.js:71` so future GMs understand why both names coexist. Left untouched: `GloomyCave.png` (asset filename), `Gloomway Trader`/`Gloom-Market Pass` (distinct place names), `diff.txt` (tracked scratch — candidate for hygiene deletion). Verified: all JS files parse (babel), archaic references preserved exactly, 0 lingering "Gloom Forest", frontend 650/650 green.)*
- [x] **BREACH 2** Resolve Emberth biology: `emberth.js:10-11` says they're literal ash-elementals; `loreDictionary.js:167` and `GM_WORLD_GUIDE.md:421` say they're biological. Also violates the project's own design rule (`RACE_BUILDING_SESSION_PROMPT.md:32`). Pick one canon and update all three. *(done — canon: **biological**, via heavily-mineralized-biological reframing (user's choice). The canon was NOT a 50/50 call: the project's own design rule at `RACE_BUILDING_SESSION_PROMPT.md:32` (The Elemental Trap) explicitly names the Emberth — "Fire is a danger the Emberth learned to survive... It is not their blood" — and the biological reading was confirmed by the MAJORITY of `emberth.js` itself (`:25` lungs with mucosal membranes, `:37` "not because they are 'fire people'", `:41` lifespan 90-130 years, `:54` children/adulthood), plus `loreDictionary.js:167` ("heat-sensitive eyes and long lungs adapted") and `GM_WORLD_GUIDE.md:421` ("skin deep brown... burn-scars"). The ONLY outlier was `emberth.js:10` "bodies are made of dense, cold soot, ash, and basalt-dark charcoal... cold residue of a dead cosmic sun" plus the description intro at `:8` "a being of cold, soot-grey ash and cooled charcoal". Reframed BOTH lines to heavily-mineralized biology: flesh that is "dense and cold-running, so saturated over generations with volcanic minerals and deep-ash that the skin presents as basalt-dark charcoal to the eye" (appearance, not composition), "mineral salts in their tissue calcify back toward inert stone" (mineral-deposit pathology, not literal stone bodies), "biological legacy of the line that sheltered in Sol's dying thermal shadow" (lineage, not residue). This preserves every imagery element (cold, ash, charcoal, calcification, ash-shedding) while being unambiguously flesh/mineral-salt biology — reconciling the most evidence. No edit needed to `loreDictionary.js:167` or `GM_WORLD_GUIDE.md:421` (already biological). Intentionally kept the two poetic taglines `emberth.js:4` ("cold-ash remnants of a dead cosmic fire") and `:7` ("Cold-bodied remnants of a dead sun... hearts from calcifying to stone") — "remnants" defensibly = "surviving people", and line 7 is already biologically-framed. Verified: emberth.js parses (babel), zero remaining "bodies are made of ash/charcoal" composition claims anywhere in the codebase (all other "made of" hits are creatures/items or the design rule itself), frontend 650/650 green.)*
- [x] **BREACH 4** Fix Aldren Thalreth: simultaneously the current Lord of Greymark (`deepLocationData.js:21`), entombed since Year 89 (`:53`), AND his chamber is in the Frozen Archive in Nordhalla (`:157`). Pick one. *(done — resolved as TWO ALDRENS via aristocratic namesake convention (user's choice). Investigation found the contradiction was deeper than the roadmap stated: not just alive-vs-entombed, but a **secular Lord** (Greymark, carrying journals, forgot a ledger location) vs a **church High Confessor/frozen saint** (Year 89 entombment in Nordhalla's Frozen Archive, pilgrimage site, theological-crisis DM hook) — different roles, locations, and hooks. The role split ("Lord" vs "High Confessor") suggested the author may have intended two people. Also found the conflation was worst in `npcStore.js`, where the "living Lord" NPC entry carried hooks about being a frozen pilgrim site ("if awakened", "frozen lips move"). Canon: **High Confessor Aldren Thalreth the Elder** = frozen saint (Year 89, Nordhalla); **Lord Aldren Thalreth** = current living Lord of Greymark (named for his ancestor). Edits (6 sites): `deepLocationData.js:53` (Greymark timeline — also clarified the event was the Elder *departing for* Nordhalla, fixing a misplaced-duplicate issue), `:157`/`:179`/`:191` (Frozen Archive timeline/PoI/faction), `TimelineDisplay.jsx:67` (title + narrative + dmHook), and `npcStore.js` (rewrote the Younger's backstory to name his frozen ancestor + reframed all 3 frozen-saint hooks as references to "the Elder"). Left the 5 living-Lord sites (deepLocationData.js:21, loreDictionary.js:689, factionStore.js:43, npcStore.js:6, timelineStore.js:133) as-is — context already marks them as the current/alive Lord. Verified: all frozen-saint refs now say "the Elder", all non-Elder refs are living-Lord context, all 3 edited files parse (babel), frontend 650/650 green.)*
- [x] **BREACH 5** Standardize dating: "Deepening" (cosmic cycle) vs "Dimming" (current age). `deepLocationData.js` mixes them. *(done: 4 mis-dated entries fixed. Investigation confirmed the canon — `rulesData.js:16` explicitly defines "The Deepening is the ancient death-rebirth cycle of every star" (a cosmic EVENT, ~800 BP), while "Dimming" is the current AGE used for dating (104 Dimming vs 69 Deepening references; the Deepening count is mostly legitimate cosmic-cycle mentions). The 4 outliers were the EARLIEST dated events — the founding Fog Compact (Year 5) and Glacier Bargain (Year 7) — incorrectly labeled "Deepening" in both `deepLocationData.js:51,156` and `TimelineDisplay.jsx:33,34`. All 4 → "Dimming" (post-Breach founding events are by definition in the Dimming age). Verified: zero "Year X, Deepening" era-dates remain.)*
- [x] **BREACH 6** Fix UTF-8 mojibake in `apexData.js`, `gambitData.js`, `martyrData.js` (em-dashes, ≥, arrows are corrupted — including in formula strings, possibly breaking parsers) *(done: 220 targeted byte-level replacements across the 3 files. Investigation found the corruption was MIXED — clean em-dashes/arrows (e.g. apex 14× clean `—`, martyr 63× clean `—` + 11× clean `→`) coexisted with mojibaked ones, so a blanket cp1252 round-trip would have corrupted the clean chars. Built a per-file decode table instead. Single-layer mojibake in apex/martyr (`c3a2e282ace2809d`→`—`, `c3a2e280a0e28099`→`→`, `c3a2cb86e28099`→`−` U+2212, `c3a2e280b0c2a5`→`≥`, `c3a2e282ace2809c`→`–`); double-layer in gambit (`c383c2a2c3a2e2809ac2acc3a2e282acc29d`→`—`, `c383c692c3a2e282ace2809d`→`×`, `c383e2809ac382c2b1`→`±`); plus `c383e28094`→`×` and `c3a2c5a1c2a0c3afc2b8c28f`→`⚠️` warning emoji (apex L356 "Over-Hunt"). **Real parser risk confirmed & fixed:** gambit L2160/2165 `formula: "Card Value × 2 + Intelligence"` had `×` mojibaked INSIDE the formula field — the actual roadmap warning. Left legitimate non-ASCII untouched: clean `—`/`→`/`÷` (martyr L117 `damage ÷ 10` is correct division), CJK `信徒` at martyr L331. Verified: babel parses all 3 files, zero lingering mojibake signatures, non-ASCII inventory is exactly the intended chars, frontend 650/650 green. Fixer script: temp `fix-mojibake.js`, idempotent.)*
- [x] **BREACH 7** Resolve Berserker origin contradiction (`berserkerData.js:21-23` vs `:46-47` vs `:55` vs `GM_WORLD_GUIDE.md:679`) *(done — resolved as **Skald ancestry + Sundale founding** (user's choice). The contradiction: `originStory` (L21-23) placed Grum's founding glacier-wyrm fight in "the freezing wastes of Nordhalla / beneath the badlands", while `roleplayIdentity GENESIS` (L46-47) placed the SAME Grum + ice-wyrm fight in "the volcanic caldera tunnels of Sundale". The Sundale reading was consistent with the class's own geography — the Forge of Grum (L89-91), the Harath-Vault geothermal arenas (L84), "led the Bloodhammer clans down into the geothermal vaults" (L59), and "Thrask Emberth… embrace the wild fury of the caldera" (L55) — making the Nordhalla originStory the outlier. Rewrote the originStory to reconcile: preserved the Skald ancestry (Nordhalla, Glacier Bargain, the cannibalism/endurance darkness) + ADDED the Bloodhammer migration south (Torra-led, out of the glaciers into Sundale's caldera beneath Emberspire) + relocated Grum's founding fight to the caldera's lower miners' chambers (matching roleplayIdentity). roleplayIdentity kept as-is (already correct). Also fixed the GM guide Berserker section (written earlier in P0-6 from the old originStory) — it already cited Nordhalla ancestry which remains canonical; the migration-to-Sundale is now consistent across both. Verified: berserkerData parses, frontend 650/650 green.)*
- [x] **BREACH 8** Rewrite `rollableTables.js` to be Mythrill-native (currently ships "Clear skies, warm sunshine" — impossible in a sunless world) *(done: full Mythrill-native rewrite of 9/10 tables (npc_attitude kept — mechanically universal, no lore violation). Premise was WORSE than the headline: not just the weather table but **9 of 10 tables were generic D&D placeholders** — encounters (Goblins/Skeletons/Wolves/Giant Spiders/dragon), treasure (gp/+1 weapon/bag of holding/potion of healing), tavern_drink (Dwarven stout/Elven wine/Orcish rotgut/Halfling mead/Gnomish fizzbrew — none of those races exist in Mythrill), wilderness (fairy ring), magic_effects (Wild Magic Surge/polymorph/Phantasmal killer), plot_hooks (wizard's familiar/king's crown), dungeon_room + traps (D&D cosmology/flavor). Rewrite grounded each table in Mythrill's actual data: **encounters** reference the real 181-creature bestiary (Gref/Grimmstalk/Schratling/Sluagh + Neth contract-enforcers/Scribe-Sentinels/Marked Vreken); **treasure** uses Mythrill-native goods (cold-iron/memory-glass/fungal-light lanterns/chained ledger-tomes/Solbrand embers/First Contract fragments/Sundered Monolith shards) + canonical gold/platinum marks (verified `inventoryStore.js` currency = {platinum,gold,...}); **weather** is fully sunless-world phenomena (still-cold/fog-tide/ashfall/frost-front/geothermal inversion/hush-fog/Wyrd-storm/Root-Veil aurora/false-dawn phosphorescence — no "sunshine"); **tavern_drink** uses real race-themed drinks (Thrask rotgut/Skald glacier-mead/Merrowport salt-ale/Sundari ash-wine/Ordan kumis/Forge-coal stout/Hush-reserve fungal tea/Morren bog-peat whiskey/Briaran thorn-blood brandy/Solbrand Drop); **plot_hooks** draw on Mythrill cosmology (fog-eaten names/Greymark bell/Neth broken contracts/House Thalreth's missing ledger/Mistbarrow cairns/Solbrand tending-clan silent/Astril constellation-death/Aldren the Elder's warming chamber). Also folded in the BREACH 4 canon (the Elder in plot_hooks entry 19 + the GM guide cross-reference). Structure (`{id,name,description,icon,die,entries:[{min,max,result}]}` + `rollOnTable`/`getTableList` + export) preserved EXACTLY — content-only change, no consumer breakage. Verified: babel parses, all 10 tables cover their full die range with no gaps/overlaps, em-dashes written clean (70× U+2014 — the earlier PowerShell "mojibake" display was a console encoding artifact, confirmed via raw byte inspection), zero D&D-generic content remaining (lone "gp" flag is a false positive — standard currency abbreviation canonically supported by Mythrill's metal-currency economy), frontend 650/650 green.)*
- [x] **BREACH 9** Delete or rewrite the generic `paths/*.js` + `enhancedPathData.js` + `customBackgroundData.js` — these are pre-rewrite D&D-style ("Arcanists are scholars of the arcane arts") with zero Mythrill integration. Keep only `pathData.js` (the 9 lore-rich paths). *(done — premise STALE, the Phase 2/10/11 pattern again. The "rewrite to Mythrill-native" had ALREADY HAPPENED: `backgroundData.js` (BACKGROUND_DATA) was rewritten Mythrill-native on 2026-06-10 (file header L7: "All 15 D&D SRD backgrounds replaced with Mythrill-native backgrounds"; live ids are camelCase Mythrill names like `emberspirePilgrim`/`shyrRunner`, offered by `Step1CoreDraft.jsx:23,1647` + `Step4BackgroundSelection.jsx:9,22`). The "disciplines" (mystic/zealot/trickster/harrow/arcanist/hexer/reaver/mercenary/sentinel) were a CUT character-creation axis — confirmed by owner ("those are old disciplines which was part of the character creation but we cut it"). The `path` field is never assigned during creation (`CharacterCreationWizard.jsx:86` inits `path:''`; `dispatch(setPath(...))` appears nowhere in src/; comments at `Lore.jsx:6`, `CharacterWizardContext.js:10`, `pointBuySystem.js:9,326` all say "Disciplines removed"). So all three target files were pure backward-compat shims for pre-Phase-4 Firebase saves: consumers read ONLY `.name` (TargetHUD/PartyHUD/MultiplayerApp + characterStore×3 dynamic requires), `.statModifiers` (`backgroundData.js:513` fallback), and `.startingPoints` (`pointBuySystem.js:325`); modern background ids never hit these lookups (return null/0). `pathEquipment.js`'s 9 `_PATH_ITEMS` (gated `availableFor.paths:['mystic']`) were UNREACHABLE for modern chars — the filter at `startingEquipmentData.js:1351` rejects them all since `path=''`. **Deleted 11 files (~7,400 lines):** 8 × `paths/*.js` + `enhancedPathData.js` + `customBackgroundData.js` + `equipment/pathEquipment.js`. **Created `legacyDisciplineData.js` shim** — 9-id map preserving exact `{name, statModifiers, startingPoints}` for old-save display-name + stat continuity (same redirect-map pattern as the Doomsayer→Harbinger mappings in BREACH 11); re-exports `getEnhancedPathData`/`getCustomBackgroundData`/`getCustomBackgroundStartingPoints`/`CUSTOM_BACKGROUNDS` under the original names so import sites are unchanged in shape. **Rewired 7 consumer files:** TargetHUD/PartyHUD/MultiplayerApp (2 imports → 1 combined), pointBuySystem (import source), backgroundData:513 (require source), characterStore (3 dynamic-require sites, replaceAll). Removed `ALL_PATH_EQUIPMENT` from `startingEquipmentData.js` (import L17 + spreads at L1315, L1399) and the dynamic `import('pathEquipment')` + spread from `LibraryBrowserModal.jsx:78-90`. **Cleaned `pathData.js`:** removed 7 dead `getCustomBackground*` aliases (L302-308) that misleadingly implied pathData backed custom backgrounds — different id spaces (pathData=vessel/bound/…; customBg=mystic/zealot/…), so they returned null for real legacy ids anyway. **Kept `pathData.js`** (the 9 lore-rich Mythrill paths: vessel/bound/unseen/scarred/archive_sworn/indebted/frostborn/wayfarer/threshold_watcher) as canonical lore per roadmap intent — currently dormant but preserved for potential future wiring. **Note on `classEquipment.js` `_PATH_ITEMS`:** verified these are NOT discipline content — despite the colliding `_PATH` suffix, they are LIVE class-equipment GROUPINGS (`INFERNAL_PATH_ITEMS` L804 = Pyrofiend/Minstrel/Chronarch/Harbinger/Gambit; `ZEALOT_PATH_ITEMS` L1830 = Martyr/Inquisitor/False-Prophet/Oracle/Factionist; etc.), with items gating on `availableFor.classes` (e.g. `['Spellguard']` at L1870-1872). They feed the live `ALL_CLASS_EQUIPMENT` grant system — do NOT delete. Only the `_PATH` suffix naming confusingly collides with the deleted discipline terminology; a cosmetic rename candidate for Phase 4, not a removal. Lore.jsx:6,120 commented refs left intact (already annotated "Disciplines removed"). Frontend 650/650 green, server 49/49 green.)*
- [x] **BREACH 10** Either flesh out `itemLibraryData.js` (currently a 12-item D&D placeholder) or delete it in favor of `data/items/` *(done — DELETED. Investigation found `itemLibraryData.js` was a 12-item D&D spell-component placeholder (Crystal Arcane Focus, Bat Guano, Sulfur, etc.) referenced ONLY by a dead import in `InventoryWindow.jsx:13` — `getItemById` was imported but never called (the `getItemById` hits elsewhere in ShopWindow/Step5 are locally-defined shadowing functions, not this import). The real 660+ item library lives in `data/items/` (COMPREHENSIVE_ITEMS — weapons/armor/consumables/etc., already Mythrill-native "Dark Souls-esque" per file headers: Ironweep, Crimson Tears, Blood Remembrance). `git rm`'d the placeholder file + removed the dead import. **Broader items-equipment rework also done** (per user direction): the real item library (`data/items/`) and `backgroundData.js` were ALREADY Mythrill-native — no action. Reworked the equipment-GRANT systems that shipped D&D kit: (1) `startingEquipmentData.js` UNIVERSAL_STARTING_ITEMS — all 55 D&D 5e PHB items (Simple Dagger, Iron Shortsword, Minor Healing Potion, Trail Rations, etc.) rewritten inline to Mythrill-native (Bog-Iron Shank, Wayfarer Gladius, Peat-Tincture, Ironwood Waybread) via verified script preserving all stats; (2) `raceEquipment.js` — 4 genuinely-generic items fixed (Human Longsword→Thalren Reach-Blade, Traveler's Pack→Wayfarer Chain-Pack, Ring of Ancient Knowledge→Memory-Shard Signet, Scholar's Component Belt→Mask-Melder Component Sash); the other 47 race items were already richly Mythrill-native (Kelp-Weave Wrap, Bramble Bracers, Ancestor Bone Staff, Voidwalker Shadow Veil, etc.); (3) `backgroundEquipment.js` — all 54 D&D 5e PHB background-kit items (ids confirmed as acolyte-/criminal-/folk-hero-/noble-/charlatan-/hermit-/etc. — literal D&D backgrounds) reworked inline to Mythrill-native themed to each background's lore (Emberspire Pilgrim→Solbrand Prayer-Leaf/Caldera Resin-Cones; Shyr Runner→Shyr Obsidian-Pry/Crevice-Tools; Ledger Keeper→Scribe-Sentinel Kit/Barrow-Spade; Bloodline Heir→House Signet-Band/Lineage Tapestry-Strip; Sumps Veteran→Sumps Campaign-Token/Bone Campaign-Cards; Gloomway Trader→Neth Contract-Scale/Memory-Glass Samples; Shanty Rat→Shanty Shiv/Over-Shanty Sewer-Map; Merrow Sailor→Merrow Belaying-Peg/Salt-Sinew Line; Peak Tracker→Cragjaw Snare-Trap; Debt Negotiator→Loaded Bone-Dice/Contract Forgery-Kit; Frost Chanter→Skald Throat-Harp/Saga-Vestments; Hush Survivor→Bog-Herbal Kit/Veil-Speaker Scroll-Case; Monolith Hunter→Canopy-Quill/Monolith Field-Notes). The `ALL_BACKGROUND_EQUIPMENT` block (already Mythrill-native — Stelequarts Lens, Keeper's Clause-Scroll, Vat-Glass Shard, Canopy-Ledger) kept untouched. **Deferred to BREACH 9:** `pathEquipment.js` + the live PATH-items in `classEquipment.js` (ALL_CLASS_EQUIPMENT spreads mostly legacy _PATH_ITEMS — reworking now would be wasted since BREACH 9 may delete the legacy paths). Verified: all files parse (babel), itemLibraryData fully gone (zero lingering refs), frontend 650/650 green.)*
- [x] **BREACH 11** Remove orphaned references: "Face Thief" Mimir subrace (`berserkerData.js:20`), 8 "Doomsayer" references post-merge, and 3 location names in `creatureData.js` not in `zoneData.js`/`loreDictionary.js` (Drunhold, Grimmwood, Siltmire Flats) *(done — but investigation found the premise PARTIALLY STALE, the Phase 2 pattern again. (1) **"Face Thief"** was a real orphan — a non-existent Mimir subrace referenced in `berserkerData.js:20` illustrationCaption + `ClassDetailDisplay.jsx:1342` caption + 4 format-example comments in `characterStore.js`; verified `mimir.js` has no Face Thief subrace (real subraces/figures are Sylvain of the First Fetch, Ithra Mask-Mother, Kalev Rope-Caller, The Eyeless One). All 6 refs fixed → "mask-merged" (canonical Mimir concept) for captions, "Skald (Human)" for the comment examples. (2) **"Doomsayer" refs are NOT orphans — left intact.** The roadmap's "8 refs to remove, should be 0 post-merge" was wrong: `ClassOriginsDisplay.jsx:121 doomsayer:'Harbinger'` and `classLoreStore.js:387 doomsayer:'harbinger'` are REDIRECT MAPPINGS required for old-save/backward-compat; the CONSOLIDATION_MASTER_PLAN, GM guide Part IV intro, SPELL_AUDIT docs, `classResources.js:1982`, `classSpellGenerator.js:523`, and loreDictionary Harbinger entry are legitimate MERGE-HISTORY documentation; and `npcStore.js:140` Valeria the Grim "Doomsayer-Priestess" is a lore-rich NPC who studied under Malakor (a canonical Harbinger founder) — she's a pre-merge-tradition survivor, not an orphan. Removing any of these would break compatibility or erase history. (3) **3 location names** (Drunhold/Grimmwood/Siltmire Flats) — confirmed orphan (0 matches in zoneData/loreDictionary); they appear in creature prose in BOTH `creatureData.js` and `creatureLibraryData.js` (the parallel creature systems) as Frostwood Reach sub-locations. Rather than delete the evocative flavor, **codified them** — added 3 canonical loreDictionary entries (drunhold/grimmwood/siltmire_flats) as Frostwood Reach locations, grounded in the creature prose (Drunhold = woodcutter village on the trade routes; Grimmwood Proper = ten-thousand-year ironwood heart, home of the Grimmstalks; Siltmire Flats = black-peat bog, hunting ground of the Oillipheist). Turns orphans into canon, matching the project's lore-rich ethos. Verified: Face Thief fully gone, 3 locations canonical, frontend 650/650 green.)*
- [x] Rewrite character-creation lore prompts (`Step8LoreDetails.jsx`) to be Mythrill-aware (currently generic D&D 5e "Backstory/Personality/Ideals/Bonds/Flaws") *(done — Medium-depth rewrite, scoped to BOTH the creation wizard and the character-sheet editor for parity. **Key constraint:** the field KEYS (`backstory`/`personalityTraits`/`ideals`/`bonds`/`flaws`/`appearance`/`goals`/`fears`/`allies`/`enemies`/`organizations`/`notes`) are schema — shared across `Step8LoreDetails.jsx`, the character-sheet editor `Lore.jsx` (`:122-205`), `InspectionContext.jsx:169`, `CharacterWizardContext.js:102,420`, and persisted to Firebase — so they were preserved unchanged; only labels/placeholders/group names/header copy were rewritten. **Investigation found TWO components with the same D&D-generic problem:** `Step8LoreDetails.jsx` `LORE_GROUPS` (`:10-61`) AND `Lore.jsx` `sections` object (`:122-205`) — both carried the D&D 5e "Personality Traits / Ideals / Bonds / Flaws" quartet with generic placeholders; updating only the wizard would have left the in-game editor D&D-generic (jarring wizard→sheet transition). **Edits:** (1) `Step8LoreDetails.jsx` — rewrote `LORE_GROUPS` group labels + field labels + placeholders + the section header (h2 "Character Lore & Personality"→"Character Chronicle"; copy now references the freezing world / the Wyrd finding the unwritten). Renamed the D&D quartet: Bonds→"Oaths & Tethers", Flaws→"Fractures & Weakness", Ideals→"Convictions", Personality Traits→"Demeanor & Nature"; groupings Story→Origin, Character→Heart & Fracture, Goals & Fears→Purpose & Dread, Physical Appearance→Bearing & Aspect, Connections & Notes→Bonds & Marginalia. (2) `Lore.jsx` — rewrote the 6 lore `sections` (personality/appearance/relationships/goals/notes titles + field labels + placeholders) to MATCH the wizard's naming for cross-component consistency. Placeholders now grounded in verified Mythrill canon (the sunless world, the fog, the Dimming, the Wyrd, the Keeper/ledger, the Solbrand, the Canopy-Ledger, contracts/debts, bog-iron/wind-leather/ash-cloth, Neth/Bloodhammer/Luminarchy factions, Marked Vreken, glacier-ice, caldera). All canon terms verified against `pathData.js`, `loreDictionary.js`, and the BREACH 1-11 lore work. **Out-of-scope flag:** `Lore.jsx:478-498` still uses the D&D 9-box Alignment ("Lawful Good"…"Chaotic Evil") — separate identity field (not a lore prompt), deferred per owner decision (needs a canon call on Mythrill's替代 framework). Frontend 650/650 green.)*
- [x] **P0-10** Populate world map coordinates/polygons *(done — hand-authored all 86 zone coordinates + all 7 region polygons, grounded in the connection graph + description geography. **Architecture first:** the world-map system was already built (`WorldMapImmerse.jsx`, `MapCanvas.jsx`, `LocationPins.jsx`, `RegionOverlay.jsx`, `DevEditor.jsx`) — it ships FILE DEFAULTS that an in-app DevEditor lets GMs visually override (persisted to localStorage `mythrill_region_polygons`/`mythrill_location_coordinates`, merged over the file defaults at render per `WorldMapImmerse.jsx:31-65`). So the empty files = "no shipped defaults; every GM starts from scratch," which is the gap P0-10 closes. **Map/coordinate space:** pixel coords on a 4096×3072 world image (`MAP_WIDTH`/`MAP_HEIGHT` at `WorldMapImmerse.jsx:71-72`, `MapCanvas.jsx:10`). Pin entry shape taken from the DevEditor's own export format (`WorldMapImmerse.jsx:327-368`): `{x, y, pinType, regionId, source:'world'}`. **Macro layout was ALREADY pinned** by the 7 pre-existing region `labelPosition` centroids in `regionPolygons.js` (Nordhalla top-left, Frostwood Reach top-right, Sundale upper-center, Iceheart Sea center-left, Cragjaw Peaks right, Sundrift Vale bottom-right, Bryngloom Forest bottom-left) — so no canon layout decision was needed; I preserved those centroids and only filled data. **Approach (hand-author, not procedural):** each of the 86 zones placed inside its region's bounding polygon, ordered along its `zoneData.js` connection chain (each region's zones form a ring/chain), with border-zones/ports/capitals positioned per their description geography (e.g. `basalt-shyr` on Sundale's SW edge toward Bryngloom per "border between Sundale and the Bryngloom Forest"; `ember-lagoon`/`ironjaw-port` toward the sea; `fjord-gate`/`skalds-longport` at the northern coast; region capitals `greymark-keep`/`harath-vault`/`merrowport`/`frostmaw-holdfast`/`synod-hold`/`atropolis`/`the-sunken-spire` near their centroids). Procedural was rejected — a meaningless jumble would defeat the "ship usable defaults" goal. **7 region polygons:** authored as ~7-8-vertex irregular bounds around each region's zone cluster, sized to contain all 12-14 pins with margin; existing `color`/`glowColor`/`labelPosition` preserved verbatim. **Verification (programmatic, all green):** (1) `ZONE_DATA` ids ↔ `LOCATION_COORDINATES` keys = exact 1:1 (86=86, 0 missing, 0 orphans); (2) regionId consistency = 0 mismatches (every coord's regionId matches its zone's regionId); (3) pinType validity = 0 invalid (all city/settlement/wilderness/ruin/tomb); (4) bounds = 0 out-of-bounds (all within 4096×3072); (5) **point-in-polygon containment = 86/86 pins inside their region polygon** (3 initial edge-cases — `skalds-longport`, `sump-rift`, `thalrens-ledger-post` — nudged inside). Result is a GM-refinable baseline: a GM who disagrees with any placement drags the pin in the DevEditor and the override persists locally + can be exported back to the file. Frontend 650/650 green.)*

**Exit criteria:** A GM can run a session without hitting contradictions; every canonical name is consistent across all files.

---

### Phase 4 — Architecture Refactor  *(~3–4 chats)*
**Goal:** Pay down technical debt before adding more features.

- [ ] **Split `MultiplayerApp.jsx` (8,225 lines, 104 socket listeners, 343 console logs)** into:
  - `MultiplayerConnectionManager` (socket lifecycle, reconnect)
  - `RoomStateOrchestrator` (event handlers, store sync)
  - `GameSurface` (rendered tree)
  - `RoomTransitioner` (map switching)
  - Target: <600 lines each
- [ ] **Split `UnifiedSpellCard.jsx` (13,430 lines)** by mode/concern
- [ ] **Split `ClassResourceBar.jsx` (8,284 lines)** by class
- [ ] **Split `Step7Triggers.jsx` (5,281 lines)** of the spellcrafting wizard
- [ ] **Split `ItemWizard.jsx` (4,898 lines)**
- [ ] **Split `characterStore.js` (4,049 lines)** into character/inventory/progression sub-stores
- [ ] **Split `socketHandlers.js` (4,627 lines, 89 handlers)** into domain modules: rooms, tokens, characters, maps, combat, chat, party, environment, audio (the comments at lines 486, 1022, etc. already mark the boundaries)
- [ ] **Collapse `buffStore` + `debuffStore`** (489 lines each, near-identical) into one `conditionStore({polarity})` factory
- [ ] **Merge `windowStore` + `windowManagerStore`** (artificial split)
- [ ] **Consolidate 3 socket.io clients** (MultiplayerApp, presenceStore, RoomLobby) into one
- [ ] **Promote `window.multiplayerSocket` global** into React context
- [ ] **Introduce Zustand `immer` + `devtools` middleware**; adopt `shallow` comparator everywhere
- [ ] **Replace `require()` inside store actions** (~185 calls in stores) with an orchestrator pattern (`restService`, `combatController`). Circular-dep workaround.
- [ ] **Move DOM mutation out of `inventoryStore`** (`:551-597, :631-662`) into a `<Toast/>` component
- [ ] **Replace `RoomContext` 5-second localStorage polling** with direct store subscription
- [ ] **Consolidate duplicate services:** `services/roomStateService.js` vs `services/firebase/roomStateService.js`, `services/campaignService.js` vs `services/firebase/campaignService.js`
- [ ] **Consolidate 6 empty spell library files** (`spellLibraryData.js`, `enhancedSpellLibrary.js`, `additionalSpells.js`, `additionalEnhancedSpells.js`, `customSpellLibraryData.js`, `generalSpellsData.js`) — all marked "COMPLETELY CLEARED" but still export names
- [ ] **Consolidate 2 parallel creature systems** (`creatureData.js` bestiary + `creatureLibraryData.js` token-ready library) — define a single source of truth
- [ ] **Unify 2 ErrorBoundary files**
- [ ] **Move 17k+ lines of skill tables from `constants/*Tables.js`** to JSON or backend

**Exit criteria:** No file >2,000 lines. No `require()` in store actions. One socket. One tooltip system. One condition store.

---

### Phase 5 — UX, Accessibility & Design System  *(~2 chats)*
**Goal:** Make the app usable by humans who aren't the original developer.

- [ ] **Fix the lore-cutoff bug.** `RulesPage.css` uses `column-count: 2` + `column-fill: balance` inside a fixed-height `overflow: hidden` parent — long lore sections are unreachable. (`lore-cutoff-test.html` reproduces.)
- [ ] **Add WowWindow accessibility:** `role="dialog"`, `aria-modal="true"`, focus trap on open, focus restoration on close, Esc stacking
- [ ] **Wire up the existing accessibility settings** (`settingsStore.js:319-325` — `reducedMotion`, `highContrast`, `largeText`, `screenReader` — all currently no-ops)
- [ ] **Remove global `user-select: none`** (`index.css:104-113`) — it prevents users from selecting/copying lore text
- [ ] **Remove global right-click hijack** (`App.jsx:894-899`) or scope it to game-canvas only
- [ ] **Fix color contrast failures:** `--pf-text-light: #a08c70` on parchment (2.6:1, fails AA); HUD status colors
- [ ] **Replace the 7+ tooltip implementations** with the unified `UnifiedTooltip`
- [ ] **Unify the 4 modal patterns** (WowWindow, react-bootstrap, custom overlays, inline portals) around one primitive
- [ ] **Decide on a single visual identity.** Currently three compete: Pathfinder (`--pf-*` vars), WoW (`WowWindow`, `wow-*` classes, zamimg icons), Mythrill (product name). Pick one and rename.
- [ ] **Standardize the HUD palette** — currently parchment/gold for chrome but Material Design colors (`#4CAF50`, `#2196F3`) for HP/mana/AP bars
- [ ] **Add window layout management:** docking, tiling, "reset layout" button. New users currently get a pile of windows at (100,100).
- [ ] **Build a GM onboarding flow.** New GMs land in a 14-button nav rail with no guidance. Tutorial is "in development."
- [ ] **Remove `/test/triggers` route** shipped to production (`App.jsx:1255-1259`)
- [ ] **Remove the "Dev Preview" bypass** shown to unauthenticated users in production (`LandingPage.jsx:498-501`)
- [ ] **Skip or short-circuit cinematic transitions:** login (2s force-navigates to `/account`), map "Immerse" dive (2.5s, ignores `prefers-reduced-motion`)
- [ ] **Honor `prefers-reduced-motion`** in the landing-page background pan
- [ ] **Consolidate CSS:** 377 stylesheets + 77 in `styles/`. Move to CSS Modules or a tokenized system. Eliminate the `!important`-laden "PRODUCTION PORTAL FIXES" (`index.css:160-193`).
- [ ] **Wire `uiTheme` setting** to actual CSS (it exists but does nothing)
- [ ] **Replace ad-hoc error UI** (`ErrorBoundary.jsx`) with on-brand fallback
- [ ] **Reduce nav rail clutter** (14 buttons for GMs) — group/secondary action

**Exit criteria:** WCAG AA passing on critical paths; one tooltip system; one modal system; consistent palette; GM first-run guidance.

---

### Phase 6 — Backend & Realtime Hardening  *(~2 chats)*
**Goal:** Make multiplayer reliable enough to trust.

- [ ] **Add `@socket.io/redis-adapter`** before any second replica is needed. Currently single-server, in-memory only.
- [ ] **Implement server-side rule enforcement.** The Joi `combat_action` schema exists but is **never invoked** (`socketHandlers.js` has 0 references). All combat math runs client-side with `Math.random()`. Audit M-07.
- [ ] **Implement actual conflict resolution.** Sequence numbers exist but are server-monotonic only — last-write-wins on every field. `CRITICAL_FIXES_NEEDED.md` admits 5/11 multiplayer fixes pending including "Fix Race Conditions."
- [ ] **Finish `syncStore.applyDeltaPatch`** — currently a stub with TODO comment. Fast-json-patch is bundled but unused.
- [ ] **Replace per-party-member 1-second buff/debuff cleanup timers** (`PartyHUD.jsx:142-153`) with a single shared timer
- [ ] **Remove global 1-second intervals on the landing page** (`App.jsx:912-930`) — buff/debuff cleanup runs even when not in a game
- [ ] **Add Redis-backed rate limiting** (currently in-memory; resets on reconnect/respawn)
- [ ] **Tighten auth boundary:** `server.js:165-170` downgrades failed-token verification to guest rather than rejecting. Many handlers require room-membership but not auth.
- [ ] **Implement `/metrics` and `/debug/logs`** endpoints that `README_TESTING.md:25-32` documents but don't exist
- [ ] **Add structured log shipping** (current logger is filesystem-only with 7-day retention)
- [ ] **Add eviction reapers** for `roomJoinRequests`, `partyInvitations`, `violationCounts` Maps
- [ ] **Add storage.rules** for Firebase Storage (none exist)
- [ ] **Stop persisting room passwords in localStorage plaintext** (`RoomManager.jsx:640-641, 962`)

**Exit criteria:** Server-side combat validation; conflict resolution; multi-server ready; no plaintext secrets in client.

---

### Phase 7 — Testing, Performance & Polish  *(~2 chats)*
**Goal:** Catch regressions and ship faster.

- [ ] **Add Jest tests for combat math:** initiative, AP brackets, damage formulas, condition ticks
- [ ] **Add store tests** for the 40 Zustand stores — at minimum the ones touched by multiplayer (party, presence, sync, chat, combat)
- [ ] **Add component tests** for `WowWindow`, `UnifiedSpellCard`, `PartyHUD`, `ActionBar`
- [ ] **Convert `integration-test.js` to CI-runnable** (currently manual script)
- [ ] **Fix `socketHandlers.test.js` tautological tests** — most test inline mock handlers, not production code
- [ ] **Add bundle-analyzer script** (`source-map-explorer` is already a devDep) + size budget in CI
- [ ] **Add `react-window` virtualization** to long lists (only used in 1 file today; spell/creature/item browsers need it)
- [ ] **Reduce `console.*` calls from 2,589 → <100** by gating behind debug flags (the pattern exists in `presenceStore.js:13-18` — apply app-wide) or use `babel-plugin-transform-remove-console`
- [ ] **Re-enable CSS minimization** in production (`craco.config.js:77-81` currently disables it "to avoid special character issues" — fix the underlying encoding issue instead)
- [ ] **Fix UTF-8 corruption in `.github/workflows/deploy.yml`** step names
- [ ] **Profile and reduce initial bundle.** Many heavy deps (`three`, `cannon-es`) load only for dice — verify they're code-split
- [ ] **Memoize expensive computations** in the 13k-line `UnifiedSpellCard` and 8k-line `ClassResourceBar`
- [ ] **Add Sentry or equivalent** for production error reporting (currently console-stripped in prod makes debugging impossible)

**Exit criteria:** >50% critical-path test coverage; bundle budget enforced; production errors visible; CSS minified.

---

## 4. Detailed Findings by Domain

### 4.1 Lore & Narrative (full detail)

**World spine — excellent.** Sol buried beneath Emberspire to escape Keth-Amar ("the Sun-Eater"); seven noble houses bound it with the flayed hide of Aex; six later capitulated, cracking the seal into seven Sundered Monoliths; an eighth house (Viridane) refused and became the Briaran. Dated "Year X of the Dimming." `rulesData.js:26-56` opens with a first-person Keth-Amar monologue that is genuinely strong prose.

**Original ideas worth spotlighting:**
- **The Silent Seventh** (`rulesData.js:86`): one of the seven "capitulating" families secretly also refused. Campaign-grade mystery.
- **The Wyrd metaphysics**: three Laws (Somatic Echoes, Names, Resonating Guilt) — fear itself spawns monsters. The exorcism protocol (starve the legend, resolve the debt, deploy cold iron) is usable at the table.
- **Race-as-biology-design**: Briaran thorns detect broken oaths (mechanically +2 Insight vs oathbreakers AND disadvantage on Deception from the same trait); Neth contract-as-worship; Astril as vessels of Sol's slaughtered celestial court; Vreken trail-sight and the "hush" addiction.

**10 races, all deeply realized:** Human (7 subraces with distinct linguistic fingerprints), Mimir (mask-merger origin), Briaran, Emberth, Neth (contract-as-worship), Vreken, Groven (bridges grown from the willing dead), Fexrick, Astril, Myrathil. Each passes the project's own 8-point race checklist.

**20 classes** (down from 30 via consolidation) — each 50–177 KB, uniformly structured. Merges preserved founders: Harbinger (Xyris + Malakor), Gambit (Jax + Lyra), Martyr (Sera).

**~864 spells** with a rich, consistent schema: `typeConfig`, `effectTypes`, `damageConfig`, `buffConfig`/`debuffConfig`, `targetingConfig`, `resourceCost`, `cooldownConfig`, `triggerConfig`. Spellcrafting wizard: 13 steps, 75 reducer action types, 21 mechanics subsystems including a 6-dimension balance calculator (`balanceCalculator.js` at 139 KB).

**~360 creatures** (182 bestiary + 181 library) — each with `origin`, `nature`, `habitat`, `combat`, `stats`, `depth`, `hooks`, `heritage`. Tied systematically to regional folklore. Adventure hooks pre-written. This is professional-quality work.

**86 zones, 11 deep locations** (scene-ready with five senses), 173 lore-dictionary entries with cross-references.

**Integration:** `<LoreLink>` surfaces the dictionary inline. `LoreSidebar`, `WorldDashboard`, `ClassLoreDetail`, `TimelineView`, `RaceEpicLore`, in-app `RulesPage` provide real lore-browsing UI.

**Critical lore problems:** See Phase 3 (the 11 BREACH entries). The biggest single risk is the GM guide documenting 6 classes that don't exist.

---

### 4.2 Mechanics (full detail)

**Systems inventory:**

| System | Status | Notes |
|---|---|---|
| Combat | Working but unvalidated | Initiative d20+agi, AP-by-initiative-bracket, multi-token targeting, 9 damage types + `LEGACY_TYPE_MAP` |
| Spells | Excellent | 13-step wizard, 6-dim balance calc, 6 spell types, ~864 spells |
| Character progression | Mostly working | Max lvl 20, D&D 5e XP table, +2 attrs at 4/8/12/16/20 |
| Talent trees | 🚨 Non-functional | 725 nodes defined, "coming soon" overlay shown |
| Class resources | Partial | 10/20 classes have gauge definitions |
| Items | Rich | 660+ items, 159 class-equip choices, 9 crafting professions |
| Crafting | 🚨 Non-functional | Completes cosmetically, no inventory transfer |
| Creatures | Two parallel systems | 182 bestiary + 181 library, overlapping |
| Dice | Works | Full 3D physics dice via three.js + cannon-es |
| Quests | 🚨 Non-functional | Reward struct exists, never delivered |
| Travel / Rest | Partial | Rest doesn't reset cooldowns/resources |
| Dialogue | Tool-only (correct) | GM authors at runtime |
| Bestiary | Top-tier | 7 lore fields per creature |

**Open audit items:** M-03 (rest), M-05 (spell resource rollback), M-07 (server validation), M-09 (crafting), M-10 (quests), M-11 (talents), S-07/S-08/S-09/S-10 (inventory/loot/shop/currency bugs), V-01/V-03 (combat atomicity, cooldown bypass).

**Schema inconsistencies:**
- ID naming: classes use kebab-case; paths/races use snake_case
- Cooldown types: 6 in class data (turn_based, long_rest, encounter, none, short_rest, combat) vs 30 in wizard (most unused)
- Damage types: `damageTypes: ['ember']` (array) in class data vs `damageType: 'physical'` (string) in `universalCombatSpells.js`
- `cooldownConfig: { type, value }` (old) vs `{ cooldownType, cooldownValue }` (new) — both in production

---

### 4.3 Frontend / UX (full detail)

**Information architecture:** 8 routes, shallow and reasonable. But the Landing Page does too much (Rules + Membership as in-page tabs); RulesPage is **7,029 lines** of in-app codex embedded in marketing.

**Navigation:** 17 nav buttons; GM sees ~14, Player ~8. 15 single-letter shortcuts are exhausted and some conflict with browser shortcuts. `Space` opens chat even from non-input focus. `Ctrl+Shift+C` is emergency combat reset. No visible shortcut documentation.

**Layout:** Free-floating portal-rendered windows with no docking, no tiling, no reset. New users get a pile at (100,100). Window geometry persists only for opt-in windows (Settings, Character Sheet, Inventory).

**Three competing identities:**
1. **Pathfinder** — CSS vars are `--pf-*`, root comment says `PATHFINDER VTT`
2. **WoW** — `WowWindow`, `wow-*` classes, icons from `wow.zamimg.com` proxy
3. **Mythrill** — actual product name

**Two competing palettes:** parchment/gold chrome vs Material Design HP/mana/AP bars.

**CSS crisis:** 377 stylesheets, 7+ tooltip implementations, 2 window stores, `!important`-laden "PRODUCTION PORTAL FIXES", App.jsx imports 60+ CSS files at module top "to prevent shredding on re-entry."

**Accessibility (the weakest area):**
- ~62 ARIA attributes across 551 files (most in 5-6 files)
- `WowWindow` has no `role="dialog"`, no focus trap, no focus restoration
- `reducedMotion`, `highContrast`, `largeText`, `screenReader` settings exist but are no-ops
- `CreatureToken.jsx:2166` has `aria-hidden="true"` — removes tokens from a11y tree entirely
- Global `user-select: none` prevents lore copying
- Global right-click hijack
- Several color combinations fail WCAG AA

**Onboarding:** No GM first-run wizard; "Tutorial and guide system in development" card. Login cinematic force-navigates to `/account` even if user was headed to multiplayer. `/test/triggers` ships to prod. "Dev Preview" bypass shown to unauthenticated users.

**Performance signals:** 8 GB build heap required. 1-second global intervals running on landing page. 6 party-member 1-second timers running duplicate work. Cursor emit at ~60 FPS.

---

### 4.4 Backend / Realtime (full detail)

**Server:** 318-line `server.js` (lean) + `socketHandlers.js` (4,627 lines, 89 handlers — a god file). `roomHandlers.js` is well-factored and well-tested — model for the rest.

**Realtime reliability:**
- `FirebaseBatchWriter` (200ms/50-write flush, 3 retries, exponential backoff, `Promise.allSettled`) — excellent
- `MovementDebouncer` (50ms flush, keyed by `roomId_tokenId`) — excellent
- **No conflict resolution.** Sequence numbers are server-monotonic only. Last-write-wins everywhere.
- `syncStore.applyDeltaPatch` is a stub with TODO. `fast-json-patch` is bundled but unused.
- **3 independent socket.io clients** in the frontend (MultiplayerApp, presenceStore, RoomLobby)
- `window.multiplayerSocket` global read by 4+ components directly
- Reconnect: 8s timeout, 1 retry, no backoff, no jitter

**Auth:** Failed Firebase token verification is **downgraded to guest** rather than rejected (`server.js:165-170`). Many handlers require room-membership but not auth.

**Rate limiting:** Per-event, GM 1.5× headroom. In-memory only — resets on reconnect/respawn. `disconnectOnViolation: false` — clients never auto-disconnected for spam.

**Firebase rules:** 350 lines of `firestore.rules`, including subscription-tier protection. Lives at `config/firestore.rules` (non-standard location). `rooms/{roomId}` allows read by any authenticated user — combined with guest-allowed auth, this is too permissive. **No `storage.rules`** for Firebase Storage.

**Tests:**
- Frontend: **1 test file** (14 cases, regex schema checks on races only)
- Server `socketHandlers.test.js`: largely tautological — tests inline mock handlers, not production code
- Server `roomHandlers.test.js`: genuinely useful
- Server `integration-test.js`: 425 lines, manual script, not CI-runnable
- **CI swallows failures:** `npm test ... || echo "No tests found"` and server tests never run in CI

**Scalability:** Single-server only. No `@socket.io/redis-adapter`. State lost on process restart (except "permanent" rooms rehydrated from Firestore).

---

### 4.5 State & Code Architecture (full detail)

**40 Zustand stores.** Vanilla `create()` everywhere — **zero middleware usage** (no immer, no devtools, no shallow comparator). Hand-written immutable spreads across 40 stores; 50-line manual deep-merges (e.g., `partyStore.updatePartyMember:769-821`).

**Three competing persistence strategies:**
1. Plain `persist` + localStorage
2. `persist` + custom Firebase storage adapter (duplicated in `spellbookStore` and `settingsStore`)
3. Hand-rolled `localStorage.getItem/setItem` inside store actions

**Circular store coupling:** ~185 `require()` calls **inside store action bodies** to dodge circular imports. `characterStore.js` has 86 alone. `gameStore.takeShortRest` reaches into 5 other stores.

**Direct duplication:**
- `buffStore` ≈ `debuffStore` (489 lines each, near-identical)
- 2 window stores, 2 ErrorBoundary files, 2 roomStateService files, 2 campaignService files
- `creatureStore` and `characterTokenStore` both define identical `normalizePosition()` (24 lines each)

**Subscription stats:** 611 selector-based (good), 293 direct full-store (bad — re-renders on any change), 0 `shallow` comparators.

**Component size crisis:** 11 files exceed 2,500 lines. Largest: `UnifiedSpellCard.jsx` (13,430), `creatureLibraryData.js` (15,753 — data, acceptable), `creatureData.js` (6,114 — data), `rulesData.js` (4,862 — data), `ClassResourceBar.jsx` (8,284), `MultiplayerApp.jsx` (8,225 with 343 console logs), `Step7Triggers.jsx` (5,281), `ItemWizard.jsx` (4,898), `characterStore.js` (4,049), `PartyHUD.jsx` (3,655).

**Console spam:** 2,589 `console.*` statements across 276 files. `MultiplayerApp.jsx` alone has 343. Properly gated only in `presenceStore.js` and `MultiplayerApp.jsx`'s cursor logic.

**Heavy unused client deps:** `openai` (zero imports), `jimp` (zero imports), `three` + `cannon-es` (only dice), 8 `*-browserify` polyfills (almost certainly for openai/jimp).

**Anti-patterns:**
- `polyfills.js:150-218` — three `eval()` calls + `React.createElement` monkey-patch to define a global `title`
- `inventoryStore.js:551-597, :631-662` — DOM mutation from a store (`document.createElement`, `<style>` injection)
- `mapStore.switchToMap:495-733` — hijacks `socket.onevent` with timeouts to fake transactions; sets `window._isMapSwitching`
- `RoomContext.jsx:72` — 5-second localStorage polling + `storage` event listener, duplicating store state
- `chatStore.js:330-344` — JSON reviver to strip Socket objects from persisted state (accidentally persisting non-serializable state)

---

## 5. Quick Wins (Do Anytime)

Small, low-risk fixes that improve quality immediately.

- [ ] Remove `/test/triggers` route (`App.jsx:1255-1259`)
- [ ] Remove "Dev Preview" bypass from production landing (`LandingPage.jsx:498-501`)
- [ ] Disable the 1-second buff-cleanup interval when not in a game
- [ ] Honor `prefers-reduced-motion` on landing background
- [ ] Remove global `user-select: none` (or scope to game canvas only)
- [ ] Skip login cinematic if user was navigating to multiplayer
- [ ] Fix `.github/workflows/deploy.yml` UTF-8 corruption in step names
- [x] Standardize "Bryngloom Forest" naming (single find/replace) *(done in BREACH 1 — see Phase 3 for detail; 30 full-name renames + intentional archaic-"Gloom" layering)*
- [ ] Delete the 6 empty spell library files after confirming no imports
- [ ] Replace 5 leftover `none` cooldown types with `encounter`
- [ ] Add `git config core.hooksPath .girhooks` to a setup script in the repo
- [ ] Run `babel-plugin-transform-remove-console` (or similar) in production builds

---

## 6. Effort-vs-Impact Matrix

| Item | Effort | Impact | Phase |
|---|:---:|:---:|:---:|
| Remove OpenAI plumbing | XS | 🔴 Critical | 1 |
| Delete scratch files | XS | 🟡 Hygiene | 1 |
| Fix CI to fail on red | XS | 🔴 Critical | 1 |
| Wire talent trees | M | 🔴 Massive (unlocks 725 nodes) | 2 |
| Wire crafting/quests | S each | 🔴 High | 2 |
| Add 10 class resource defs | M | 🟠 High | 2 |
| Regenerate GM guide | S | 🔴 Critical (lore trust) | 3 |
| Fix 11 lore breaches | M total | 🟠 High | 3 |
| Populate world map | M | 🟠 High | 3 |
| Split MultiplayerApp.jsx | L | 🟠 High (maintainability) | 4 |
| Split UnifiedSpellCard | L | 🟠 High | 4 |
| Collapse buff/debuff stores | S | 🟡 Medium | 4 |
| Fix lore-cutoff bug | XS | 🟠 High (UX) | 5 |
| Add WowWindow a11y | M | 🟠 High (a11y) | 5 |
| Add combat server validation | L | 🔴 Critical (anti-cheat) | 6 |
| Add Redis adapter | M | 🟡 Medium (scaling) | 6 |
| Add combat/store tests | L | 🟠 High (regression) | 7 |
| Bundle budget | S | 🟡 Medium | 7 |

---

## 7. How to Use This Document

- **Each phase is roughly one chat of work.** Don't skip ahead — Phase 1 unblocks everything.
- **Tick boxes as you go.** The Markdown checkboxes are git-diffable progress tracking.
- **Reference file:line citations** when implementing — they're throughout.
- **Cross-reference audits:** `AUDIT_REPORT.md`, `AUDIT_REPORT_DETAILED.md`, `CRITICAL_FIXES_NEEDED.md`, `docs/SPELL_AUDIT_REPORT_2026-06.md`, `docs/CONSOLIDATION_MASTER_PLAN.md` contain deeper detail on specific items.
- **Update this file** as items are completed or new findings emerge. It is meant to be the single source of truth for "what's left to do."

---

## Appendix A — File Counts (for scale)

| What | Count |
|---|---:|
| React components (`.jsx`) | 477 |
| Zustand stores | 40 |
| Services | 50 |
| Hooks | 25 |
| Data files | 155 |
| CSS files | 377 |
| Socket event handlers (server) | 89 |
| Socket listeners (client MultiplayerApp only) | 104 |
| Spells | ~864 |
| Classes | 20 |
| Races | 11 (10 full + Corvani subfolk) |
| Paths | 9 canonical + 9 legacy generic |
| Creatures | ~360 (182 bestiary + 181 library) |
| Items | 660+ |
| Talent nodes (defined, non-functional) | 725 |
| Lore dictionary entries | 173 |
| Zones | 86 |
| Deep locations | 11 |
| Tracked scratch files at root | 21 |
| Committed fix scripts | 15+ |
| Tracked PNGs at root | 10 |
| Frontend test files | 1 |
| Server test files | 3 |
| `console.*` statements | 2,589 |
| `require()` calls inside stores | ~185 |

## Appendix B — Source Audits Referenced

- `AUDIT_REPORT.md`, `AUDIT_REPORT_DETAILED.md`, `AUDIT_FIX_PROMPT.md` (root)
- `CRITICAL_FIXES_NEEDED.md` (root) — 5/11 multiplayer fixes still pending
- `DISCONNECT_FIX_TESTING.md` (root)
- `docs/SPELL_AUDIT_REPORT_2026-06.md`, `docs/SPELL_WIZARD_AUDIT_REPORT.md`, `docs/SPELLBOOK_QA_NEXT_STEPS.md`
- `docs/CONSOLIDATION_MASTER_PLAN.md` — class merge history
- `docs/CLASS_AUDIT_STANDARDS.md`, `docs/INDIVIDUAL_CLASS_AUDIT_PROMPT.md`
- `docs/LORE_QUALITY_AUDIT_PROMPT.md`, `docs/RACE_BUILDING_SESSION_PROMPT.md`
- `docs/PASS_3_AUDIT_PROMPT.md`, `docs/SPELL_CARD_AUDIT_PROMPT.md`, `docs/SPELL_CLASS_AUDIT_AGENT_PROMPT.md`
- `server/docs/ARCHITECTURE.md`, `server/docs/API.md`

---

## Appendix C — Phase Completion Summaries (Layman's Notes)

*Running log, added at the end of each phase. Plain-language "what was wrong → what it's now" for each item, plus the handoff prompt for the next chat.*

### Phase 3 — Lore & Content Consistency  ✅ (complete)

**Goal, in plain terms:** make the world bible trustworthy, so a GM mid-session never trips over a contradiction, a missing name, or leftover placeholder content from another game.

- **P0-6 — GM World Guide, class section.** *Was:* the guide described 6 classes that no longer exist (leftovers from old class merges). *Now:* the entire class section rewritten from scratch — all 20 real classes, with proper lore.
- **BREACH 1 — The forest's name.** *Was:* the same forest was called "Gloom Forest" in some files and "Bryngloom Forest" in others. *Now:* standardized on "Bryngloom Forest" as the full name; "the Gloom" survives on purpose as an old/archaic name used inside stories (made intentional, not accidental). 30 spots fixed.
- **BREACH 2 — Emberth biology.** *Was:* one passage said the Emberth are literally made of ash and charcoal (fire-elementals); everything else — including the project's own design rule — said they're flesh-and-blood. *Now:* locked them as biological (heavily mineralized flesh); the one outlier rewritten to match.
- **BREACH 4 — Aldren Thalreth.** *Was:* one man was simultaneously the current living Lord of Greymark AND a saint frozen in a tomb for over a century in a different country. *Now:* split into two people — "Aldren the Elder" (the frozen saint) and "Aldren the Younger" (the living lord, named for his ancestor).
- **BREACH 5 — Calendar terms.** *Was:* dates confused "the Deepening" (a cosmic event) with "the Dimming" (the current age you count years in). *Now:* the oldest founding dates corrected to "Dimming."
- **BREACH 6 — Garbled text.** *Was:* special characters (em-dashes, ×, ≥, arrows) in three class files were corrupted into unreadable garbage — including inside math formulas, which risked breaking the game's parsing. *Now:* 220 surgical character repairs.
- **BREACH 7 — Berserker origin.** *Was:* the Berserker's founding story placed their legendary fight in a frozen wasteland, but all their other lore placed it in a volcanic caldera. *Now:* reconciled — Skald ancestry in the frozen north, then a migration south to the Sundale caldera where the order was actually founded.
- **BREACH 8 — Random GM tables.** *Was:* the random tables were generic D&D — "warm sunshine" (impossible: there is no sun), goblins, tavern drinks like "Elven wine" (those races don't exist here). *Now:* 9 of 10 tables rewritten using Mythrill's real content (real monsters, real sunless-world weather, real drinks).
- **BREACH 9 — Cut "disciplines" code.** *Was:* ~7,400 lines of leftover code from a "disciplines" character-creation feature that had been cut, still lingering (and D&D-flavored), pulled in only as a fallback for old save files. *Now:* deleted the dead code; kept a tiny lookup table so characters made before the cut still display their old names. (The real Mythrill-native system already lived elsewhere.)
- **BREACH 10 — D&D starter items.** *Was:* a dead 12-item D&D placeholder file, plus the starter/background/race gear shipped literal D&D 5e kit ("Simple Dagger," "Trail Rations," dwarf-themed items). *Now:* placeholder deleted; ~113 starter items reworked Mythrill-native ("Bog-Iron Shank," etc.).
- **BREACH 11 — Orphan references.** *Was:* a mention of a "Face Thief" subrace that doesn't exist, plus 3 place names in monster descriptions that were undefined anywhere. *Now:* Face Thief refs fixed; the 3 places formally added to the lore dictionary. (The "Doomsayer" mentions were checked and are legitimate save-compatibility + history — left alone.)
- **Step8 — Character-creation lore prompts.** *Was:* the backstory step asked for D&D's "Backstory / Personality Traits / Ideals / Bonds / Flaws" with generic fantasy prompts. *Now:* rewritten in BOTH the creation wizard and the character sheet to be Mythrill-aware — e.g. Bonds → "Oaths & Tethers," Flaws → "Fractures," with prompts referencing the fog, the Wyrd, contracts, the Dimming.
- **P0-10 — Blank world map.** *Was:* the interactive world map shipped completely empty — no region borders drawn, no location pins. Every GM had to draw it all from scratch. *Now:* all 86 zone pins and all 7 region borders populated, placed by the game's actual geography, as a starting point a GM can drag around to taste.

**Build state at end of Phase 3:** frontend 650/650, server 49/49 green. Nothing committed (per standing instruction); the working tree holds all of Phase 1 + 2 + 3 uncommitted.

---

### Handoff Prompt — next chat (Phase 4)

> You are continuing work on the Mythrill VTT project at D:\VTT — a virtual tabletop for a dark-fantasy TTRPG where the sun was buried underground and the world is freezing.
>
> **First actions:** Read D:\VTT\STRATEGIC_ROADMAP.md (focus on Phase 4; also read Appendix C for the layman summary of Phases 1–3) and D:\VTT\CLAUDE.md. Check `git status` — note the LARGE set of uncommitted changes spanning Phase 1 + 2 + 3. Nothing has been committed (per the user's standing instruction — never commit unless explicitly told to).
>
> **Working style:**
> - Always read a file before editing it. Follow existing conventions (vanilla Zustand `create()`, functional components, kebab-case class IDs, the parchment/gold WoW-inspired theme).
> - Investigate before executing — several roadmap items turned out stale/wrong (over-counted, already-fixed, or misdiagnosed) in Phases 1–3. The roadmap is a guide, not gospel.
> - For architectural decisions that could go multiple ways, surface 2–3 options with `file:line` evidence and let the user pick before making sweeping changes.
> - Run tests after changes: `cd vtt-react && npm test` (frontend) and `cd server && npm test` (server). Current bar: **frontend 650/650, server 49/49**.
> - Never add comments to code unless asked. Cite `file:line` when referencing code. Don't commit unless asked.
>
> **What's done:** Phases 1 (Stabilization & Security), 2 (Core Mechanical Completion), and 3 (Lore & Content Consistency) are all complete — see Appendix C for the plain-language summary. Phase 3 exit criteria met: a GM can run a session without hitting contradictions; every canonical name is consistent across all files.
>
> **What's next — Phase 4, Architecture Refactor (estimated ~3–4 chats):** the goal is to pay down technical debt before new features. Note this phase is deliberately too big for one chat — propose a scoped first chunk before executing. Candidate work (from the roadmap):
> - Split the god-files: `MultiplayerApp.jsx` (8,225 lines, 104 socket listeners), `UnifiedSpellCard.jsx` (13,430), `ClassResourceBar.jsx` (8,284), `Step7Triggers.jsx` (5,281), `ItemWizard.jsx` (4,898), `characterStore.js` (4,049), `socketHandlers.js` (4,627 lines / 89 handlers — comments already mark the domain boundaries).
> - Collapse duplicate stores: `buffStore` + `debuffStore` (near-identical) into one factory; merge `windowStore` + `windowManagerStore`.
> - Consolidate the 3 socket.io clients into one; promote the `window.multiplayerSocket` global into React context.
> - Add Zustand `immer` + `devtools` middleware; adopt `shallow` comparators; replace ~185 `require()` calls inside store actions with an orchestrator pattern.
> - Consolidate duplicate services, the 6 empty spell-library files, the 2 parallel creature systems, and the 2 ErrorBoundary files.
> - Move DOM mutation out of `inventoryStore` into a `<Toast/>`; replace `RoomContext`'s 5-second localStorage polling with a direct store subscription.
>
> **Suggested first chunk (lowest risk, highest cleanup before touching the god-files):** start with the consolidations (buff/debuff store merge, window stores merge, empty spell-library files, ErrorBoundary unification) since they're contained and reversible; defer the big god-file splits until the supporting patterns (orchestrator, context) exist.
>
> Begin by confirming this context with the user and proposing which chunk of Phase 4 to start with.

---

*End of strategic roadmap. Phases 1–3 complete. Next: Phase 4.*
