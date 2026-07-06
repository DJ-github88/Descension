# Mythrill VTT — Remaining Open Items

> Carved out of the completed Sync & Integration Audit (2026-07-03).
> All sync, persistence, rules, and community-download bugs have been fixed.
> What remains is: one large refactor and four feature-wiring tasks.
> (The storage-enforcement gap in §3 was resolved 2026-07-04.)

---

## 1. C4 — Shared `campaignStore` (large refactor, deferred)

Both campaign UIs (`components/account/CampaignManager.jsx` ~2222 lines,
`components/windows/CampaignManagerWindow.jsx` ~2830 lines) keep independent
`useState` snapshots seeded from the same localStorage `campaignService`
singleton. They can drift within a single session.

**Options:**
- Introduce a Zustand `campaignStore` as the single in-memory source of truth
  (both UIs read/write it).
- Accept localStorage-as-truth + re-sync on focus.

Full rewrite risk — defer until product priorities align. This is the **only**
bug-level item left open; everything below is feature work or enhancement.

---

## 2. Community features — built but not wired to UI

Each of these has correct Firestore rules + functional services + ready-to-use
hooks/components. They just need a render call or a button.

### P4-1 — Community Campaign Browser
- **What exists:** `sharedCampaignService.js` (`getSharedCampaigns`,
  `getSharedCampaign`, `downloadCampaign`, `getUserSharedCampaigns`).
  Publish works (`ShareCampaignModal`, ULTIMATE-gated). Rules OK.
- **What's missing:** a "Community Campaigns" browse/download tab.
- **Effort:** moderate (new tab + card grid + download flow).

### P4-2 — Community Map Sharing
- **What exists:** `communityMapService.js` + `userMapsService.shareMapToCommunity`.
  Rules added (`community_maps` / `map_categories` / `map_ratings`).
- **What's missing:** share button in `MapLibraryWindow` + a community tab.
- **Effort:** moderate (share dialog + community tab).

### P4-3 — Pack Browser
- **What exists:** a **complete** feature ecosystem — `packService.js` +
  `useCommunityPacks.js` hook + `PackCard.jsx` + `PackDetailsModal.jsx` +
  `PackBrowser.jsx`. `community_packs` rules exist.
- **What's missing:** mounting `PackBrowser` in a community hub (one render call).
- **Effort:** trivial (add `<PackBrowser />` to a tab/route).

### P4-4 — Folders (all content types)
- **What exists:** folder CRUD services for items, creatures, spells, maps.
  Rules in place (`userItemFolders` / `userCreatureFolders` / `user_folders`).
- **What's missing:** folder tree UI (create, rename, drag-drop, navigate).
- **Effort:** large (full tree-view component per content type).

---

## 3. Storage enforcement gap ✅ RESOLVED (2026-07-04)

**Previous state:** Storage was **tracked**
(`storageLimitService.getStorageUsage` counts documents in `userItems` /
`user_spells` / `userCreatures` / etc.) and **displayed** in the account
dashboard / `StorageUsageWidget`, but only `audioStore.js` enforced it.

**What was done:**
- Added a `canStoreData` guard at the top of `saveUserItem` /
  `saveUserSpell` / `saveUserCreature` (before `setDoc`). When the user is
  over their tier's total byte limit, the write is rejected with
  `{ success: false, reason: 'storage_full', localOnly: false }`.
- Added per-tier **document COUNT caps** (`maxItems` / `maxSpells` /
  `maxCreatures` in `STORAGE_LIMITS`) enforced via a new
  `storageLimitService.canStoreDocument()` (counts the user's docs in the
  collection vs. the tier limit). Limits: FREE 100/100/50, PRO 500/500/250,
  DEV_PREVIEW & ULTIMATE unlimited (-1). These use distinct keys from the
  byte-tracking categories to avoid the category/count collision.
- Both guards run **only for new documents** (`getDoc(ref).exists()` check).
  Edits/updates replace an existing doc in place and are never blocked, so a
  user is never stranded out of their own content.
- Added byte tracking via `updateStorageUsage('items'|'spells'|'creatures')`
  on save (delta = newSize − oldSize) and a matching decrement in
  `deleteUserItem` / `deleteUserSpell` / `deleteUserCreature`, mirroring the
  existing `audioStore` pattern. This makes the dashboard total accurate and
  ensures the guard can actually fire.
- Surfaced `storage_full` results in every entry point: spell/creature/item
  wizards, community spell download, `itemStore.saveItemToFirebase`, and the
  three background persistence hooks (single throttled warning per 60s so the
  10s sync loop can't spam notifications). Count-limit rejections include the
  usage in the message (e.g. "Item limit reached (100/100)").
- The dashboard now shows **Items / Spells / Creatures** count rows (`used /
  limit`) in `StorageUsageWidget` (both the cloud popover and the full card).
  `getStorageSummary` fetches each count via a server-side count aggregation
  (`getCountFromServer`, with a `getDocs().size` fallback).

**Tracking is best-effort:** a `updateStorageUsage` failure is logged but
never rolls back a write that already succeeded, so a Firestore transient
error can't corrupt the user's content.

---

## 4. P4-7 — Community sharing tier policy (verified, no change needed)

`subscriptionService.communitySharing = { FREE: true, PRO: true, ULTIMATE: true }`.
Community sharing is intentionally free for all registered users. Only
`campaignPublishing` is ULTIMATE-gated. **No action required** unless product
wants to change this policy.
