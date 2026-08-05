# ULTIMATE WORLD BUILDER — ROADMAP (M0–M9)

> Status: **Draft v1** (2026-08-05)
> Source: codebase analysis of `vtt-react` world-map/world-builder subsystems + prior M0 work.
> M0 completed 2026-08-05 (commit `45e7fe12`, firestore rules deployed to mythrill-ff7c6).

## Vision

Turn the Mythrill world map from a Nordhalla-only showcase into a fully interactive,
account-synced, multiplayer-capable world builder: draw every region, link world-map
locations to playable battlemaps, and let GMs build and share whole worlds.

---

## Milestones

### M0 — Foundation & Quick Fixes ✅ DONE
- Grey NPC/location card backdrop fix (CampaignManager.css)
- World-map deep link from AccountMapManager (App.jsx, WorldMapImmerse.jsx)
- Legacy map toggle + region locks removal (9 files)
- Firestore rules gaps: `user_libraries`, `user_folders`, `users/{uid}/audio`, `users/{uid}/audioPlaylists` — deployed
- beadle account upgraded to Ultimate
- (deferred) 4 duplicate client-side custom maps — browser-local, needs originating browser

### M1 — Canonical Cartography: all 7 regions ✅ DONE
**Gap:** 6/7 regions have empty `points: []` polygons; `LOCATION_COORDINATES = {}`; id conventions split.

- [x] Draw real region polygons for iceheart-sea, frostwood-reach, sundale, cragjaw-peaks, sundrift-vale, bryngloom-forest (from `docs/continents/*` + `docs/GM_WORLD_GUIDE.md`) — restored 8-pt octagons from `fa839c63`; nordhalla keeps refined 62-pt polygon
- [x] Populate builtin `LOCATION_COORDINATES` for all 7 regions (82 pins, 7 ids remapped, 4 dropped)
- [x] Create id-conversion utility (hyphen ↔ underscore ↔ doc file names) and apply consistently — `vtt-react/src/utils/idConversion.js`
- [x] Verify: every region clickable on world map, opens LoreSidebar with region content

> Commits: `2a5176fe` (polygons + pins), `f7d8e55f` (idConversion). See Mind memory `m1-canonical-cartography-complete`.

### M2 — Full subregion coverage
**Gap:** only 1 real subregion image; 2 nordhalla subregions + regional map are placeholders; subregion polygons only exist for nordhalla.

- Real map assets or 8K master crops for all 37 subregions
- Subregion polygons + hasSubregionMap for every region
- Remove `placeholder:true` fallback path entirely

### M3 — Cloud sync for custom maps
**Gap:** custom maps are IndexedDB/localStorage only; 5 GB ULTIMATE storageLimit unused.

- Server-side storage (Storage + Firestore metadata) for custom maps
- Account-scoped maps, cross-device sync
- Migration path from IndexedDB → cloud
- Enforce tier limits (ULTIMATE = upload eligible)

### M4 — Real World Builder mode
**Gap:** `isWorldBuilderMode` is write-only dead weight; world map only exists as landing overlay.

- Builder dashboard in sandbox: manage regions, subregions, pins, maps
- Promote DevEditor features to a non-dev GM workflow
- World map reachable inside `/game` route

### M5 — World map ↔ VTT transitions
**Gap:** world map and grid VTT fully disconnected; marketing copy promises "multi-level dungeon & town transitions".

- Click a pin/subregion → open linked battlemap in level editor
- Wire portal system between world locations and maps
- Transition back from battlemap to world map

### M6 — World map in rooms (multiplayer)
**Gap:** no room-level world map.

- GM opens world map inside a room; players see it
- Region discovery / fog-of-world
- Room-synced annotations

### M7 — Builder tooling
**Gap:** DevEditor exports clipboard code snippets only.

- Polygon editing UI (drag vertices)
- Pin placement UI for non-devs
- Region/subregion/POI CRUD
- JSON import/export

### M8 — Sharing & publishing
**Gap:** no sharing path; `campaignPublishing`/`campaignDownloading` flags unused.

- Share worlds via friend code
- Publish campaigns with maps
- World templates

### M9 — Ultimate polish
- Analytics (ULTIMATE flag)
- Custom world themes
- 8K asset streaming + performance pass
- GM onboarding

---

## Dependencies

- Spine: M1 → M2 → M5 → M6
- Parallel: M3 (independent of cartography)
- M7/M8 build on M4
- M9 = capstone

## Source of truth (current state, 2026-08-05)

- `vtt-react/src/components/world-map/` — viewer (WorldMapImmerse, MapCanvas, RegionOverlay, LocationPins, DevEditor, annotations)
- `vtt-react/src/data/regionPolygons.js` — 7 regions, only nordhalla has points
- `vtt-react/src/data/subregionMaps.js` — 37 subregions; custom maps via IndexedDB `mythrill_maps_db`/`custom_subregion_maps` + localStorage `mythrill_custom_subregion_maps`
- `vtt-react/src/data/zoneData.js` — 587 POIs; `subregions.js` — 37 subregions; `deepLocationData.js` — 20 enriched zones
- `vtt-react/src/store/worldStore.js` — REGION_META; only nordhalla rich
- `vtt-react/src/components/account/AccountMapManager.jsx` — upload UI, client-side only
- `docs/continents/` — worldbuilding canon (not wired to app)
