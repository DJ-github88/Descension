# Static Data Extraction & Architecture Cleanup — Master Plan

> **Goal:** Move ~1.7 MB of static game data out of the webpack JS bundle into lazy-loaded JSON files with IndexedDB caching, then clean up the resulting architectural debt.

---

## Current State & Progress

| Phase | Description | Status |
|---|---|---|
| **Phase 1** | Convert Static Data to JSON | **COMPLETED** ✅ |
| **Phase 2** | Create the Data Loading Hook (`useGameData.js`) | **COMPLETED** ✅ |
| **Phase 3** | Rewire All Consumers | **IN PROGRESS** 🔄 (Creature store caching, preloading, and verifiers pending) |
| **Phase 4** | Clean Up Build Config | **PENDING** ⏳ |
| **Phase 5** | Apply Same Pattern to Medium Data Files | **PENDING** ⏳ |
| **Phase 6** | Root Directory Cleanup | **PENDING** ⏳ |
| **Phase 7** | Re-enable ESLint in CI | **PENDING** ⏳ |
| **Phase 8** | Architectural Improvements (Long-term) | **PENDING** ⏳ |

---

## Detailed Task Checklist

### Phase 1: Convert Static Data to JSON (Low Risk, Mechanical)
- [x] **Task 1.1** — Create `public/data/` directory
- [x] **Task 1.2** — Convert `creatureLibraryData.js` → `public/data/creatures.json`
- [x] **Task 1.3** — Convert `creatureAbilitiesAdvanced.js` → `public/data/abilities.json`
- [x] **Task 1.4** — Convert `rulesData.js` → `public/data/rules.json`
- [x] **Task 1.5** — Convert `loreDictionary.js` → `public/data/lore.json`

### Phase 2: Create the Data Loading Hook (`useGameData.js`)
- [x] **Task 2.1** — Create `src/hooks/useGameData.js`
- [x] **Task 2.2** — Create `src/services/dataCache.js` (IndexedDB wrapper)
- [x] **Task 2.3** — Create `src/data/versions.js` (central version file)

### Phase 3: Rewire All Consumers
- [ ] **Task 3.1** — Integrate IndexedDB caching in `utils/initCreatureStore.js`
  - [ ] Import `getCachedData` and `setCachedData` from `../services/dataCache`
  - [ ] Implement cache lookup check before doing network fetches for creatures and abilities
  - [ ] Cache newly fetched JSON data in IndexedDB with versions
- [x] **Task 3.2** — Rewire `utils/migrateCreatureIcons.js` (already imports `DATA_VERSIONS` and runs post-initialization)
- [x] **Task 3.3** — Rewire `utils/loreAutoLinker.js` (already retrieves lore using `getLoadedData('lore')`)
- [x] **Task 3.4** — Rewire `LoreLink.jsx` (already uses `useGameData('lore')`)
- [x] **Task 3.5** — Rewire `MapMakingSection.jsx` (already uses `useGameData('lore')`)
- [x] **Task 3.6** — Rewire rules displays (`RulesPage.jsx`, `ClassDetailDisplay.jsx`, `LexiconDisplay.jsx`, `DramatisPersonaeDisplay.jsx` - all already use `useGameData('rules')`)
- [ ] **Task 3.7** — Implement background preloading at application root
  - [ ] Import `preloadGameData` in `vtt-react/src/App.jsx`
  - [ ] Call `preloadGameData('lore')` and `preloadGameData('rules')` on app mount so lore dictionary and rules categories are eagerly cached and loaded in memory
- [ ] **Task 3.8** — Rewrite verification scripts to verify `public/data/lore.json`
  - [ ] Update `vtt-react/src/data/_verify_lore.mjs` to load and verify JSON directly
  - [ ] Update `vtt-react/src/data/_verify_lore.cjs` to load and verify JSON directly
- [ ] **Task 3.9** — Delete obsolete/dead source files
  - [ ] Delete `vtt-react/src/data/creatureLibraryData.js`
  - [ ] Delete `vtt-react/src/data/creatureAbilitiesAdvanced.js`
  - [ ] Delete `vtt-react/src/data/loreDictionary.js`
  - [ ] Delete `vtt-react/src/utils/ruleLookup.js` (unused, logic resides in `rulesData.js` stub)

### Phase 4: Clean Up Build Config
- [ ] **Task 4.1** — Simplify Webpack SplitChunks in `vtt-react/craco.config.js`
  - [ ] Remove `dataRules` cacheGroup (since `rulesData.js` is only 7 KB)
  - [ ] Remove `creatureLibraryData.js` path from `dataCreatures` regex in `craco.config.js`
- [ ] **Task 4.2** — (Optional) Re-enable `concatenateModules` in development and verify stability
- [ ] **Task 4.3** — Measure JS bundle size improvement (run `npm run build` and compare before/after size)

### Phase 5: Apply Same Pattern to Medium Data Files
- [ ] Convert `creatureData.json` (Bestiary) to a lazily-loaded asset
- [ ] Apply lazy-loading JSON structure to class files under `data/classes/` and talent trees under `data/talentTrees/`

### Phase 6: Root Directory Cleanup
- [ ] **Task 6.1** — Delete temporary files in root directory:
  - [ ] `build-output*.txt` (13 files)
  - [ ] `build-final.txt`, `build-output-final2.txt`, `build-output-final3.txt`
  - [ ] `build-stderr.txt`, `build-stdout.txt`
  - [ ] `eslint-report*.json` (21 files)
  - [ ] `eslint-fix.txt`, `test-output.txt`, `zone_ids.txt`
- [ ] **Task 6.2** — Delete old PNG screenshots in root:
  - [ ] `classes-current-full.png`, `classes-enhanced-v2.png`, `classes-enhanced.png`, `classes-v2-redesign.png`, `classes-v2-round6.png`

### Phase 7: Re-enable ESLint in CI
- [ ] Remove the ESLintWebpackPlugin filter-out block from `craco.config.js`
- [ ] Ensure build lints properly on CI without errors

### Phase 8: Architectural Improvements (Long-term)
- [ ] Break up `Grid.jsx` (4,054 lines)
- [ ] Fix store circular dependencies and remove `storeRegistry.js`
- [ ] TypeScript migration (staged)
