# Asset Archaeology — Descension / Mythrill

**Date:** 2026-10-03
**Auditors:** Asset Archaeology pass (read-only)
**Status:** Research report. No assets were deleted, moved, renamed, compressed, converted, or re-encoded.

> This document is an inventory and classification of the repository's binary asset surface:
> images, textures, models, audio, video, large binaries, test captures, and generated visual
> output. It follows the project rule: **UNUSED BY APPLICATION != SAFE TO DELETE.**
> Classification `F` (probable disposable candidate) does **not** authorize deletion; it flags
> items for human review.

---

## 1. Executive summary

- The working tree (excluding `node_modules` and `.git`) contains **21,102 files / 4.70 GB**.
  Of those, **11,286 files** are binary assets matched by asset extension.
- Git tracks a large part of this: the repository pack is **1.22 GiB** (34,823 objects).
  History contains **24,667 blobs / ~2.10 GB raw**, versus roughly **1.08 GB** of tracked
  content in the current tree — meaning about **half of all binary history is superseded
  versions of assets**.
- Two ignored local directories dominate disk usage and are **not in Git**:
  `.gemini/` (5,525 files / 1.60 GB) and `.playwright-mcp/` (3,548 files / 1.58 GB).
  Together they are **~68% of all working-tree bytes**.
- The app's runtime tree is `vtt-react/public/` (published by Netlify as `vtt-react/build`).
  Strict filename/path reference scanning found **2,626 files / 583 MB** directly referenced
  by runtime code, plus **~2,984 files / 311.5 MB** resolved by directory convention
  (data-driven icon systems). Directory-level evidence over-credits some folders and must be
  reviewed manually.
- A second, older asset tree exists at the repo root: `public/` (237 files / 101.7 MB,
  fully tracked). It is **not used by dev or deploy** (`package.json` scripts run inside
  `vtt-react/`; `netlify.toml` publishes `vtt-react/build`). It shares **208 basenames** with
  `vtt-react/public/` and forms **198 exact-duplicate groups** with it. This is the clearest
  large deduplication opportunity in the repo.
- Exact duplicate analysis found **859 duplicate groups / 668.1 MB of redundant bytes**
  overall. Near-duplicate filename families (e.g. `equipment-v1..v13`, 68-class thumbnails,
  `*_old` class icons) add another **107 families / 1,587 files / 261.2 MB**.
- **165 `*_old` class icon PNGs (112.5 MB)** and **272 class thumbnails for a 68-class
  legacy roster** sit inside the deployed tree but have no runtime references. They are
  concept/development history (class C), not disposable.
- `assets/backdrops/` is **34 zero-byte placeholder JPGs**; `vtt-react/vtt-react/` is an
  accidental nested copy containing **5 zero-byte JPGs plus a stray JSON**. These are inert.
- Storage recommendation (section 12): keep a small runtime subset in Git, keep generation
  detritus out of Git (already largely ignored), and use a **hybrid of Git + Firebase
  Storage + GitHub Releases for archive bundles**. Do **not** migrate to Git LFS now; the
  evidence does not support a repository-wide LFS migration at this time (section 12.5).

---

## 2. Method and evidence

All statements below are backed by filesystem scans, hashes, and code searches performed on
2026-10-03 against `D:\VTT` (branch `master`).

Measurement approach:

1. Full recursive file enumeration excluding `node_modules`, `.git`, `dist`, `build`,
   `coverage`, `.next`, `.cache` → 21,102 rows (path, name, extension, size, date).
2. Asset filtering by extension: `.png .jpg .jpeg .webp .gif .svg .ico .bmp .avif .glb
   .gltf .mp3 .wav .ogg .mp4 .webm .bin .fbx .obj` → 11,286 files.
3. Reference scan: all text/code files under `vtt-react`, `public`, `docs`, `server`,
   `functions`, `config`, `.github`, `.githooks` plus root config files. Two blobs were
   built — **runtime** (app/server/config/docs excluded) and **docs** — and each was scanned
   for filename literals and directory paths.
4. Duplicate detection: SHA-256 of every same-size candidate group (6,640 files hashed).
5. Image dimensions: header parsing of PNG/JPEG/GIF/WebP (10,902 of 10,942 images parsed).
6. Git metrics: `git count-objects`, `git cat-file --batch-all-objects`,
   `git rev-list --objects --all`, `git log --diff-filter=A/D -- vtt-react/public/assets`.
7. Tracked/untracked determination: `git ls-files` joined against the filesystem scan.

Caveats:

- Reference scanning is literal. Assets resolved through variables, Firestore records, or
  runtime data are invisible to it. Those are covered by a secondary "directory convention"
  signal and by reading the resolver code (section 5.3).
- The `dir-in-code` signal is coarse: if code contains `assets/icons/classes/`, every file in
  that directory is credited. This is why section 8 separates strict evidence from
  convention-level evidence.
- The scan sees the working tree, including ignored files that are local-only. Those never
  affected repository size and are labeled accordingly.
- The working tree currently has uncommitted modifications to many race JPGs and terrain
  GLBs (see `git status`), indicating an in-flight asset update.

---

## 3. Repository-wide inventory

### 3.1 Working tree totals (filesystem, excl. `node_modules` / `.git`)

| Metric | Value |
| --- | --- |
| Files | 21,102 |
| Total size | 4.70 GB |
| Binary asset files (by extension) | 11,286 |
| Tracked files (`git ls-files`) | 10,905 |
| Tracked bytes (current tree) | ~1.08 GB |
| Uncommitted asset modifications | many race JPGs, terrain/wall GLBs (see `git status`) |

### 3.2 Disk by top-level directory

| Directory | Files | Size | Git status |
| --- | ---: | ---: | --- |
| `.gemini/` | 5,525 | 1.60 GB | ignored, local-only |
| `.playwright-mcp/` | 3,548 | 1.58 GB | mostly ignored; 58 yml snapshots tracked historically |
| `vtt-react/` | 10,386 | 987 MB | tracked (10,182 files / ~938 MB) |
| `public/` (repo root) | 237 | 101.7 MB | fully tracked, legacy tree |
| `docs/` | 212 | 61.2 MB | 105 tracked / 107 untracked |
| `.lore-audit-work/` | 200 | 17.9 MB | 69 tracked (despite ignore rule), 131 untracked |
| Repo-root loose files | 367 | 122.2 MB | 60 tracked; 304 root PNGs are ignored |
| `Images/` | 3 | 10.6 MB | tracked |
| `mobile-audit-2026-09-11/` | 51 | 7.9 MB | tracked |
| `.agents/` | 339 | 5.8 MB | untracked (agent tooling) |
| `server/` | 91 | 1.9 MB | tracked |
| `mobile-test-screenshots/` | 22 | 1.4 MB | tracked |
| `scripts/` | 91 | 0.9 MB | mostly untracked (ignored) |
| `scratch/` | 8 | <0.1 MB | ignored |

### 3.3 Git history size and asset churn

| Metric | Value |
| --- | --- |
| Pack size | 1.22 GiB across 6 packs |
| Loose objects | 1,434 / 83.18 MiB |
| Total objects | 34,823 |
| Blobs in history | 24,667 / ~2.10 GB raw |
| Trees / commits | 10,653 / 937 |
| Git LFS usage | **none** (`git lfs ls-files` empty; no `.gitattributes`) |
| Unique asset paths ever committed | 8,473 |
| Asset paths added across history | 8,436 |
| Asset paths deleted across history | 202 |
| Asset paths in history no longer on disk | 184 |
| Commits touching `vtt-react/public/assets` | 77 |
| Files modified most (icon churn) | `formbender.png`, `chaos_weaver.png`, `lichborne.png` (7 revisions each) |

The 184 history-only asset paths are recoverable franchise material. Examples:
`vtt-react/public/assets/images/classes/{augur_illustration_2, gambit_illustration,
lichborne_illustration, huntress_illustration, doomsayer_illustration, covenantbane…}.png` and
`vtt-react/public/assets/icons/races/{bloodhammer, frostbound, grimheart, hrym,
rune_keeper}.png`. This is an archive concern, not a cleanup target (section 8, ARCHIVE).

### 3.4 Assets by extension (working tree)

| Extension | Count | Size | Notes |
| --- | ---: | ---: | --- |
| `.png` | 10,302 | 2,288.3 MB | includes ~1.45 GB generated/local |
| `.jpg` / `.jpeg` | 608 + 25 | 267.4 + 57.8 MB | race/class art, maps |
| `.webp` | 7 | 65 MB | all generated/local |
| `.glb` | 302 | 12.1 MB | runtime 3D models |
| `.gltf` + `.bin` | 19 + 19 | 0.4 MB | split models (crypt/nature/props) |
| `.mp3` | 1 | 3.35 MB | sole audio asset |
| `.svg` | 1 | <1 KB | `assets/objects/lantern.svg` (tiny vector object; a build copy also exists) |
| video | 0 | — | none present |
| fonts (`.woff/.ttf/...`) | 0 | — | Google Fonts via CSP |
| `.yml` snapshots | 2,500 | 19.7 MB | incl. ~2,300 `.gemini` + `.playwright-mcp` snapshots |
| backup-suffixed files | ~60 | ~15 MB | `.bak-*`, `.dim*-backup*` lore backups |

### 3.5 Assets by directory (`vtt-react/public`)

| Directory | Files | Size |
| --- | ---: | ---: |
| `assets/images/creatures` | 404 | 171.3 MB |
| `assets/icons/classes` (incl. thumbs) | 355 | 164.3 MB |
| `assets/images/races` | 264 | 163.9 MB |
| `assets/icons/creatures` (incl. sprite sets) | 1,058 | 111.3 MB |
| `assets/images/backgrounds` | 10 | 72.3 MB |
| `assets/images/classes` | 47 | 32.5 MB |
| `assets/textures/walls` | 33 | 24.8 MB |
| `assets/images/portraits` | 13 | 12.9 MB |
| `assets/icons/races` | 12 | 10.8 MB |
| `assets/ui/classes` | 114 | 6.9 MB |
| `assets/icons/items` | 3,135 | 6.9 MB |
| `assets/models/dungeon` | 117 | 5.3 MB |
| `assets/icons/abilities` | 1,786 | 3.0 MB |
| `assets/audio` | 1 | 3.3 MB |
| remaining dirs (`tiles`, `walls`, `objects`, `models/*`, `ui`, `Backgrounds`) | ~900 | ~40 MB |

---

## 4. Asset family findings

### 4.1 Images and dimensions

10,942 image files; 10,902 parsed successfully (40 skipped: odd WebP variants/truncated).

| Max dimension bucket | Files | Size |
| --- | ---: | ---: |
| ≤128 px | 6,552 | 16 MB |
| 129–256 px | 114 | 12.3 MB |
| 257–512 px | 645 | 178.5 MB |
| 513–1024 px | 3,420 | **2,280.6 MB** |
| 1025–2048 px | 145 | 87.2 MB |
| 2049–4096 px | 23 | 19.1 MB |
| >4096 px | 3 | 84.7 MB |

The single heaviest distribution is 513–1024 px at 2.28 GB — this is where most generated
`.gemini` art and full-size race/creature illustrations live. Notable oversized runtime files:

| File | Dimensions | Size |
| --- | --- | ---: |
| `vtt-react/public/assets/images/backgrounds/Mythril.jpeg` | 8192 × 6016 | **54.8 MB** |
| `Rime-Spire Peaks.jpg` (root) and `vtt-react/public/assets/images/backgrounds/rime-spire-peaks.jpg` | 8192 × 6144 | 14.97 MB each |
| `vtt-react/public/sand_debug.png` | 2752 × 1536 | 7.63 MB |
| `Images/Editor/Tiles/Sand TIles.png` (exact duplicate of `sand_debug.png`) | 2752 × 1536 | 7.63 MB |
| `assets/Backgrounds/*.png` (24 files) | 2304 × 1296 | 0.02–0.1 MB each (highly compressed) |

`Mythril.jpeg` is loaded at runtime (`AccountJournalManager.jsx:22`, "Mythril / World Master
Map") and is served to every user who opens the journal manager. `rime-spire-peaks.jpg` is
referenced from the same list (`AccountJournalManager.jsx:24`). Together these two files are
~70 MB of runtime imagery; conversion/downscaling would be a targeted optimization, not a
cleanup decision, and must be verified against Netlify cache behavior first.

Most of the 30 files in `assets/Backgrounds/` are 2304×1296, yet the whole folder totals only
2.7 MB — evidence that high-efficiency encoding is already used in some families.

### 4.2 Textures and backgrounds

- `assets/textures/walls/` (33 files / 24.8 MB) — runtime recolorable wall textures; loaded by
  `CanvasWallSystem.jsx:24-28` via `` `/assets/textures/walls/${type}.png` ``.
- `assets/Backgrounds/` (30 files / 2.7 MB) — runtime setting backdrops, referenced from
  `AccountDashboard.jsx:1039` and `AccountJournalManager.jsx:138-179` (dynamic).
- `assets/backdrops/` (34 files / 0 bytes) — **all zero-byte placeholders**, no code
  references. See section 7.4.
- `assets/walls/` and `assets/tiles/` PNGs are partially exact duplicates of
  `assets/textures/walls/` content (4 confirmed groups, e.g. `brick_wall.png`,
  `gothic_stone.png`, `wooden_wall.png`, `hedge.png`; ~3.5 MB redundant).

### 4.3 Models (GLB / glTF / BIN)

- 302 `.glb` (12.1 MB) — 3D tiles, terrain, walls, dungeon props. Nearly all have runtime
  references (`ThreeDPropManager.js`, `ThreeDTerrainManager.js`, `levelEditorStore.js`;
  309 literal `/assets/models/` references found).
- 19 `.gltf` + 19 `.bin` (~0.4 MB) — split crypt/nature/props models; every `.gltf` has a
  sibling `.bin`.
- 57 GLB files under the legacy root `public/tiles/`; **55 share a basename with
  `vtt-react/public/assets/models/`** and are covered by cross-tree duplicates. Only
  `lava_tile.glb` and `wall_tile.glb` are root-only prototypes with no current counterpart.
- Uncommitted workspace changes currently modify ~40 terrain/wall GLBs — an in-flight rework
  that this audit did not touch.

### 4.4 Audio

Exactly one audio asset exists: `vtt-react/public/assets/audio/Steel_Against_Wood.mp3`
(3.35 MB), referenced by `builtInAudio.js:6`. No sound-effect library, music bed, or voice
assets are present in this repository.

### 4.5 Video

None. No `.mp4`, `.webm`, `.mov`, `.avi`, or `.mkv` files exist in the tracked tree or the
ignored working directories.

### 4.6 Fonts

No font binaries are stored locally. Typography is loaded from Google Fonts
(`fonts.googleapis.com` / `fonts.gstatic.com` are explicitly allowed in the Netlify CSP).

### 4.7 Screenshots and test captures

| Location | Files | Size | Tracked | Notes |
| --- | ---: | ---: | --- | --- |
| Repo-root `*.png` | 304 | 106.0 MB | No (`/*.png` ignored) | ~300 manual verification screenshots, heavily versioned families |
| `.playwright-mcp/` | 3,548 | 1.58 GB | 58 yml | console logs, page snapshots, generated by tooling |
| `mobile-audit-2026-09-11/` | 51 | 7.9 MB | Yes | mobile UI audit captures |
| `mobile-test-screenshots/` | 22 | 1.4 MB | Yes | older mobile QA captures |
| `.lore-audit-work/` | 200 | 17.9 MB | 69 | lore backup files (`.bak-*`, `.dim*`), not visual assets |
| `vtt-react/.playwright-mcp/` | 21 | 1.4 MB | No | nested tooling captures |

The repo-root screenshots include near-duplicate families such as
`equipment-*` (13 variants), `terrain-rework-v3..v8`, `dice-*`, `hex-*`, `quest-log-*`,
`landing-*` (15+ variants), `creature-select-*` (8 variants). They are QA evidence, not
franchise content. Because `.gitignore` has `/*.png`, none of them are in Git — they exist
only in this working copy.

### 4.8 Generated visual output

`.gemini/brain/**` contains 5,525 files / 1.60 GB of AI-assistant session output:
`.tempmediaStorage` media, `artifacts` renders, `click_feedback` captures, and
`.system_generated` transcripts (several `transcript_full.jsonl` files of 4–10 MB). It is
entirely ignored by Git. 143 exact-duplicate groups exist **inside** this tree (128.5 MB),
and many of its files duplicate canonical runtime assets (see section 6.1). This directory is
a workspace cache; the only durable content within it would need to be promoted deliberately
into a franchise archive.

---

## 5. Reference analysis

### 5.1 Method

Two text corpora were built:

- **Runtime corpus** (52.0 MB of text): `vtt-react/**` (code, CSS, HTML, data JSON, tests),
  `server/`, `functions/`, `config/`, `.github/`, `.githooks/`, plus root config files.
- **Docs corpus** (4.4 MB): `docs/**` and all root-level Markdown.

Each corpus was scanned for filename literals (e.g. `kessen_illustration.png`) and
directory-path literals (e.g. `assets/icons/items/`).

### 5.2 Results (all trees, 11,286 assets)

| Evidence level | Files | Size |
| --- | ---: | ---: |
| Direct runtime reference (filename/path literal) | 2,830 | 675 MB |
| Directory-convention runtime evidence only (no literal) | 3,118 | 392 MB |
| Docs-reference only | 57 | 2.9 MB |
| No reference evidence at all | 7,337 | — (majority generated/local) |

Restricted to the deployed tree `vtt-react/public` + `vtt-react/src/assets`:

| Evidence level | Files | Size |
| --- | ---: | ---: |
| Direct runtime reference | 2,626 | 583.0 MB |
| Directory-convention only (needs review) | 2,984 | 311.5 MB |
| No evidence | 2,783 | 43.3 MB |

The legacy root `public/` tree matched 107 direct and 127 convention references **by
basename** — those references actually resolve to the `vtt-react/public/` copies, because
root `public/` is never served. Treat root `public/` as legacy (section 7.1).

### 5.3 Dynamic resolution patterns (why literal scans undercount)

| Pattern | Evidence | Consequence |
| --- | --- | --- |
| Class icons by convention | `Step1CoreDraft.jsx:1875` `` `/assets/icons/classes/${name}.png` ``; `classDisplayData` `imageIcon` | 21 current class icons resolve dynamically |
| Item icons directory prefix | `assetManager.js:14` `items: '/assets/icons/items/'` + item records (Firestore) | ~3,135 item icons are data-driven, not literal |
| Ability icons by folder/name | `EnhancedCreatureInspectView.jsx:204` constructs `/assets/icons/abilities/<Name>.png`; 264 literal hits | damage-type folders are runtime families |
| Creature sprite sheets | `CreatureIconSelector.jsx:165`, `CharacterAppearanceModal.jsx:158`, `CharacterIconSelector.jsx` fetch `/assets/icons/creatures/manifest.json`, else directory scan | sprite files `icon1..icon8.png` × folder are runtime by convention |
| Status icons | `assets/icons/Status/*/manifest.json` committed (17 manifests); generated by `scripts/generate-status-icons-manifest.js` | runtime manifests exist |
| Terrain/walls/props | direct paths in `ThreeDTerrainManager.js`, `levelEditorStore.js`, `ThreeDPropManager.js` | mostly literal, verified |
| Race/heritage art | literal paths in `BookImagePickerModal.jsx` (44 entries) and data files | 682 literal `/assets/images/` hits |

**Dangling reference found:** three components fetch
`/assets/icons/creatures/manifest.json`, but that file **does not exist** on disk. If the
fetch fails, the components fall back to directory scanning, so this is not fatal — but the
manifest is a gap worth fixing. Likewise `scripts/generate-ability-icons-manifest.js` writes
a manifest that is **not committed**, and its hardcoded subfolder list
(`combat, defensive, magic, movement, social, utility`) no longer matches the actual
`assets/icons/abilities` layout (damage-type folders such as `Fire`, `Frost`, `Necrotic`),
so running it today would produce a partial manifest.

### 5.4 Assets with no evidence inside the app tree (2,783 files / 43.3 MB)

Largest no-evidence app groups (excluding generated/local trees):

| Group | Files | Size | Interpretation |
| --- | ---: | ---: | --- |
| `assets/icons/classes/thumbs/*` | 272 | ~24 MB | 68-class legacy thumbnail roster (runtime has 21 classes) |
| `assets/icons/items/Misc/Profession Resources/**` | ~1,900 | ~4 MB | profession/gathering icons not yet wired to item data |
| `assets/icons/abilities/{Force,Necrotic,Frost,...}` | ~1,000 | ~2 MB | additional damage families pending data wiring |
| `assets/ui/classes/gambit/_raw_greenscreen` | 22 | 4.6 MB | source greenscreen frames for Gambit UI |
| `assets/ui/classes/pyrofiend/_raw_greenscreen` | 19 | 0.4 MB | source greenscreen frames for Pyrofiend UI |
| `assets/ui/card-frame` | 6 | 0.7 MB | unused card frame art |
| `assets/icons/races` (e.g. `earth_warden`, `spirit_talker`, `raven_seer`) | 8 | 7.3 MB | race icons with no literal/data reference found |
| `vtt-react/src/assets/ui` duplicates | 4 | 0.9 MB | same files already served from `public/assets/ui` |

"Pending" is a hypothesis, not a verdict: item/ability icons are Firestore/data-driven, so a
file with no literal reference may still be reachable when the corresponding data record
exists at runtime. These are human-review items, not deletion candidates.

---

## 6. Duplicate analysis

### 6.1 Exact duplicates

6,640 same-size candidates were hashed; **859 groups are byte-identical duplicates**,
representing **668.1 MB of redundant bytes**.

| Bucket | Groups | Redundant MB |
| --- | ---: | ---: |
| Mixed `.gemini` ↔ app/legacy copies | 374 | 358.6 |
| Cross: `vtt-react/**` ↔ root `public/**` | **198** | **111.2** |
| `.gemini` internal | 143 | 128.5 |
| `docs/subrace_lore_compendium/assets` ↔ app art | 90 | 56.6 |
| `vtt-react` internal | 47 | 11.2 |
| `.playwright-mcp` internal | 7 | 2.0 |

Notable exact duplicates:

| Hash group | Size each | Paths |
| --- | ---: | --- |
| Rime-Spire Peaks | 14.97 MB | `Rime-Spire Peaks.jpg` ↔ `vtt-react/public/assets/images/backgrounds/rime-spire-peaks.jpg` |
| sand_debug | 7.63 MB | `vtt-react/public/sand_debug.png` ↔ `Images/Editor/Tiles/Sand TIles.png` |
| Spellcard | 3.70 MB | `vtt-react/public/Spellcard.png` ↔ `public/Spellcard.png` |
| Tethered Mimir | 2.0–2.2 MB | root `public/` ↔ `vtt-react/public/assets/images/races/` |
| Fexric illustration | 1.04 MB | app ↔ root `public/` ↔ 2 `.gemini` renders |
| brick_wall | 1.33 MB | `assets/walls/` ↔ `assets/textures/walls/` |
| gothic_stone | 1.21 MB | `assets/walls/` ↔ `assets/textures/walls/` |
| hedge family | 0.94 MB | 5 copies across `walls/`, `tiles/`, `textures/walls/` |
| AP/HP/mana fill textures | 0.17–0.70 MB | `vtt-react/src/assets/ui/` ↔ `vtt-react/public/assets/ui/` |

The `docs/subrace_lore_compendium/assets` copies (90 groups / 56.6 MB) are intentional
documentation copies of race art. They are not runtime assets, but they duplicate 56.6 MB of
tracked content — a candidate for a manifest/link strategy rather than physical copies.

### 6.2 Near-duplicate filename families

After normalizing version suffixes (`v1`, `final`, `old`, `fixed`, numbers), **107 families
contain ≥4 files: 1,587 files / 261.2 MB**. Largest families:

| Family pattern | Files | Where | Nature |
| --- | ---: | --- | --- |
| `iconN.png` creature sprite sheets | 741 | `assets/icons/creatures/<race>` | runtime sprite sheets (legitimate) |
| `*_old`, `*_v*_old` class icons | 165 | `assets/icons/classes` | 112.5 MB of class concept iterations |
| `fate_weaver*` | 13 | classes/icons | renamed class history |
| `equipment-*` | 13 | repo root | manual QA screenshots |
| `huntress*`, `dreadnaught*`, `false_prophet*` etc. | 10–12 each | classes/icons | 68-class legacy roster |
| `shadow shade/gloom/darkness` | 49 | `.gemini` | generated variants |

Not every family is waste: sprite sheets and `dice-*` UI iteration sequences are legitimate
version chains. `*_old` icon families are intentional-looking archives of class redesigns.

### 6.3 Cross-tree duplication (root `public/` vs `vtt-react/public/`)

- Root `public/` has 233 binary assets / 101.7 MB, all tracked.
- 208 basenames exist in both trees; **198 exact-duplicate groups**.
- 25 root-only files: CRA shell files (`favicon*`, `logo192/512`, `apple-touch-icon`),
  `Spellcard.png`, `emberth_illustration.png`, prototype models (`lava_tile.glb`,
  `wall_tile.glb`), tile variants (`Cobble2-4`, `Dirt2-4`, `Grass2-4`, `Sand3-4`), and test
  captures (`test_large_perfect.png`, `test_small_perfect.png`,
  `hud_composite_test.png`, `hud_large_composite_test.png`).
- Root `public/index.html` is an older CRA shell (`<title>VTT Game</title>`, same as the
  current one). Nothing in `vtt-react/src` loads the root tree; Netlify publishes only
  `vtt-react/build`.

**Conclusion:** root `public/` is a legacy pre-`vtt-react/` asset tree. Its unique files are
archive material (tile prototypes, old CRA shell, one retired illustration); its shared files
are redundant copies of deployed assets. Consolidation is a strong future candidate, but any
move must preserve the unique files and the historical value of the originals.

### 6.4 Nested accidental tree

`vtt-react/vtt-react/` contains 6 tracked files: 5 zero-byte JPGs (including one path nested
three levels deep, `backdrops/vtt-react/vtt-react/public/assets/backdrops/oracle-destinyweaver.jpg`)
plus `depcheck-results.json`. This is an accidental recursive copy of
`vtt-react/public/assets/backdrops` structure. It has no runtime role.

---

## 7. Legacy and dormant inventory

### 7.1 Root `public/` (LEGACY)

- 237 files / 101.7 MB tracked; not used by dev (`npm start` runs in `vtt-react/`) or deploy
  (`netlify.toml` → base `vtt-react`, publish `build`).
- Contains the only copies of `emberth_illustration.png`, `lava_tile.glb`, `wall_tile.glb`,
  tile-variant PNGs, CRA shell files, and committed HUD test captures.
- **Keep. Do not delete.** Candidate for archive consolidation after a manifest exists.

### 7.2 `Images/Editor/` (SOURCE / ARCHIVE)

- `Lantern.png` — exact duplicate of `vtt-react/public/assets/objects/lantern.png`.
- `Tiles/Sand TIles.png` — exact duplicate of `vtt-react/public/sand_debug.png`
  (note the filename typo "TIles").
- `Tiles/WaterTiles.png` — 1.66 MB; no exact duplicate found; likely a source master for
  water tiles.

These read as working source files kept at repo root. Archive-level material.

### 7.3 `assets/backdrops/` zero-byte placeholders (DORMANT)

34 JPG files, all 0 bytes, covering class concepts (martyr, oracle, gambler, lichborne,
witch-doctor, exorcist, formbender, plaguebringer, falseprophet, deathcaller,
arcanoneer…). No code references. They cannot render; they are placeholders for
planned/abandoned class backdrop art. `vtt-react/vtt-react/backdrops/` repeats the pattern.

### 7.4 68-class legacy roster

- `assets/icons/classes/thumbs/{large,medium,small,tiny}` each contain exactly **68 files**;
  the current app imports **21 class data modules** (`vtt-react/src/data/classes/index.js`).
- `assets/icons/classes/` also contains 165 `*_old*` PNGs (112.5 MB) for classes including
  `covenbane`, `bladedancer`, `chaos_weaver`, `deathcaller`, `huntress`, `lichborne`,
  `oracle`, `exorcist`, `formbender`, `dreadnaught`, `gambler`, `titan`, `inscriptor`.
- These are design history for a larger earlier roster (68 class concepts). Classification:
  **C — concept/development history**. No deletion recommended; archival policy needed.

### 7.5 History-only assets (ARCHIVE)

184 asset paths were deleted from the working tree over the repo's life but remain in Git
history (section 3.3). They are the strongest candidates for a formal franchise archive
export (GitHub Release bundle or object-storage archive) because they are invisible to
normal browsing yet represent creative work.

### 7.6 Unreferenced race icons

`assets/icons/races/` holds 12 files / 10.8 MB. Eight (`earth_warden.png`,
`spirit_talker.png`, `raven_seer.png`, `mist_runner.png`, `dusk_walker.png`,
`deep_delver.png`, `stone_smith.png`, `thornscar.png`) have no literal or directory
evidence. These may be heritage icons or retired race concepts — human review required.

---

## 8. Classification (A–F)

Definitions per the audit brief; counts are asset-extension files.

### A — RUNTIME (actively used by current application)

- **Strict literal evidence:** 2,626 files / 583 MB under `vtt-react/`.
  Includes race/creature art, class icons, backgrounds, terrain/wall/dungeon GLBs, wall
  textures, tile atlases, the single MP3, and `assets/Backgrounds`.
- **Directory-convention evidence:** ~2,984 files / 311.5 MB resolved through data-driven
  conventions (items, abilities, creature sprite sheets, status icons). This bucket is
  over-inclusive at directory level: it also contains 75 `*_old` icons and other
  review-needed variants.
- Runtime-critical oversized outliers: `Mythril.jpeg` (54.8 MB), `rime-spire-peaks.jpg`
  (15 MB), `sand_debug.png` (7.6 MB, dubiously shipped).
- Key files: `vtt-react/public/assets/**`, `vtt-react/src/assets/**`.
- Evidence: literal paths in `src/**`; manifests; `assetManager.js`; Netlify publish config.

### B — CANONICAL IP (approved franchise material, not necessarily loaded)

- `docs/subrace_lore_compendium/assets/` (93 files / 58.6 MB) — documentation copies of
  race/subrace art.
- Race/creature/class illustrations inside `vtt-react/public/assets/images/**` double as
  canonical art plates.
- `Images/Editor/WaterTiles.png` and root `public/` race artwork (early approved art era).
- History-only class illustrations (e.g. `*_illustration.png` variants) are canonical-era
  artifacts requiring archive treatment.

### C — CONCEPT / DEVELOPMENT HISTORY

- 165 `*_old*` class icon PNGs (112.5 MB).
- 272 class thumbnails for the 68-class roster.
- `assets/backdrops` placeholder set (planned class backdrop art).
- `_raw_greenscreen` folders for Gambit and Pyrofiend (41 files / ~5 MB).
- Retired tile variants and prototypes at root `public/tiles` (`Cobble2-4`, `Dirt2-4`,
  `Grass2-4`, `Sand3-4`, `lava_tile.glb`, `wall_tile.glb`).
- `emberth_illustration.png` (root-only) and other root-only artwork.
- `vtt-react/vtt-react/` nested duplicate (accidental, but contains path history).

### D — GENERATED / TEST

- `.gemini/` 5,525 files / 1.60 GB (session media, artifacts, click feedback, transcripts).
- `.playwright-mcp/` 3,548 files / 1.58 GB (console logs, page snapshots); 58 yml snapshots
  are historically tracked.
- Repo-root screenshots: 304 PNG / 106 MB (ignored by Git).
- `mobile-audit-2026-09-11/` (51 / 7.9 MB) and `mobile-test-screenshots/` (22 / 1.4 MB) —
  tracked QA captures.
- `.lore-audit-work/` (200 / 17.9 MB; 69 tracked) — audit scratch/backups.
- `sand_debug.png`, `test_*_perfect.png`, `hud_*_test.png` — debug/test images that are
  shipped or tracked.

### E — UNKNOWN

- `assets/icons/races/*` from section 7.6 (heritage vs retired).
- `assets/ui/card-frame/` (6 files) — no consumer found.
- `vtt-react/public/assets/icons/items/**` files not matched to any item record: data lives
  in Firestore, so reachability cannot be proven from this repo alone.
- `.agents/` and `.vibemole/` (agent tooling artifacts; untracked, out of project scope).

### F — PROBABLE DISPOSABLE CANDIDATE (flagged only; not deleted)

- 17 `.playwright-mcp/console-*.log` files ≥10 MB each (~1.4 GB of ~1.5 GB across 900 console
  logs) — regenerable tool logs.
- Exact duplicate copies where a canonical copy is unambiguous (e.g. the root `public/`
  twin of `Spellcard.png`, `.gemini` twins of app art).
- Zero-byte placeholders (34 + 5 files) — no content to lose, but confirm intent first.
- `sand_debug.png` in the deployed tree — debug capture that also exists as a source file.
- Legacy root tree's CRA shell duplicates (`favicon*`, `logo192/512`).
- Superseded `.lore-audit-work` backup generations (`*.bak-*`), subject to lore-owner review.

**No F item may be deleted without an explicit human decision and a manifest record.**

---

## 9. Consolidated statistics

### By classification (assets only, approximate)

| Class | Files | Size | Notes |
| --- | ---: | ---: | --- |
| A runtime | ~5,600 (strict+convention) | ~895 MB | 2,626 strict / 2,984 convention |
| B canonical IP | ~100 docs assets (+ shared art) | ~59 MB | plus app art doubling as B |
| C concept history | ~500+ | ~130 MB | `_old`, thumbs, placeholders, prototypes |
| D generated/test | ~9,300 | ~3.3 GB | dominated by `.gemini` + `.playwright-mcp` |
| E unknown | ~3,300 | ~50 MB | data-driven or unreferenced |
| F probable disposable | ~40 identified | ~1.4 GB+ | all regenerable/zero-byte |

### By source of bytes (working tree)

| Source | Size | Share |
| --- | ---: | ---: |
| `.gemini/` | 1.60 GB | 34% |
| `.playwright-mcp/` | 1.58 GB | 34% |
| `vtt-react/` (incl. untracked) | 987 MB | 21% |
| Root loose files | 122 MB | 2.6% |
| `public/` (legacy) | 102 MB | 2.2% |
| `docs/` | 61 MB | 1.3% |
| Everything else | ~190 MB | 4% |

### Exact duplicate waste

| Scope | Redundant bytes |
| --- | ---: |
| Total | 668.1 MB |
| Cross legacy↔app | 111.2 MB |
| Docs copies | 56.6 MB |
| App-internal | 11.2 MB |
| Generated `.gemini` | 128.5 MB (+358.6 MB mixed) |

---

## 10. Should the repository distinguish asset classes?

Yes — but not necessarily with those exact folder names. The current repository mixes five
concerns that need different lifecycles:

1. **Runtime assets** — must ship with the app; changes are code-reviewable; small and
   optimized; versioned together with the UI that consumes them.
2. **Canonical franchise assets** — approved lore art; changes are IP decisions; need
   versioning, provenance, and a human owner.
3. **Concept archive** — iterations, alternates, retired designs (the `_old` icons, 68-class
   roster, history-only illustrations). Rarely changes; valuable historically.
4. **Development references** — source masters, greenscreens, references
   (`Images/Editor`, `_raw_greenscreen`). Work-in-progress; not shipped.
5. **Generated/test output** — screenshots, logs, captures. Regenerable; never tracked.

Practical implications:

- Separating literally into five top-level folders would break current Webpack/Netlify paths
  and is not proposed. What matters is the **taxonomy and manifest** (section 11), plus
  build-time filtering of class 4/5 content so it never ships. Example evidence that this
  matters: the entire `vtt-react/public/` directory is copied into the Netlify build,
  including 165 `*_old` icons and 272 legacy thumbnails that no code loads.
- Git-ignoring rules should cover classes 4 and 5 wholesale (some already do:
  `/*.png`, `scratch/`, `.playwright-mcp/`, `.gemini/`), with the explicit exception of
  tracked QA captures that the project intentionally keeps (`mobile-audit-*`,
  `mobile-test-screenshots`).

---

## 11. Proposed ASSET MANIFEST concept (not implemented)

A single versioned `asset-manifest.json` (or per-domain manifests merged in CI) describing
every curated asset. Fields:

| Field | Purpose | Example |
| --- | --- | --- |
| `assetId` | Stable unique key (never reused) | `astril-stargazer-vael-figure-v1` |
| `canonicalName` | Human/discoverable name | `Vael, Stargazer Figure` |
| `entityType` | Domain entity kind | `race`, `subrace`, `class`, `creature`, `location`, `item`, `ui`, `map` |
| `entityId` | Domain id used by game data | `astril_stargazer` |
| `assetRole` | What the asset is for | `figure`, `icon`, `token`, `background`, `texture`, `model`, `music` |
| `canonicalStatus` | Approval state | `approved`, `concept`, `deprecated`, `placeholder` |
| `era` | Design/production era | `2025-race-rework`, `class-pass-2` |
| `version` | Semver or integer lineage | `3` |
| `runtimeUsage` | Evidence of consumption | `direct`, `data-driven`, `docs-only`, `unused` |
| `source` | Origin | `hand-drawn`, `ai-assisted`, `commissioned`, `generated`, `test` |
| `tags` | Free-form categorisation | `["race","astril","heritage"]` |
| `notes` | Provenance, QC, replacement links | `superseded by v4 (assetId ...)` |
| `runtimePath` | Served path when applicable | `/assets/images/races/astril_stargazer_figure_vael.jpg` |
| `archivePath` | Cold-storage/release reference | `releases/ip-archive-2026-01.zip#...` |
| `hash` | sha256 for dedupe/integrity | `9f2c…` |
| `dimensions`, `bytes` | Technical hygiene | `1024x1024`, `987654` |

Example record (illustrative only):

```json
{
  "assetId": "myrathil-shoreling-figure-talia-v1",
  "canonicalName": "Talia, Shoreling Figure",
  "entityType": "subrace",
  "entityId": "myrathil_shoreling",
  "assetRole": "figure",
  "canonicalStatus": "approved",
  "era": "subrace-lore-pass",
  "version": 1,
  "runtimeUsage": "direct",
  "source": "ai-assisted",
  "tags": ["race", "myrathil", "portrait"],
  "notes": "Referenced by BookImagePickerModal.jsx",
  "runtimePath": "/assets/images/races/myrathil_shoreling_figure_talia.jpg",
  "archivePath": null,
  "hash": "<sha256>",
  "dimensions": "1024x1024",
  "bytes": 1048576
}
```

Manifests should be **generated where possible** (scan + reference check + hash) and
**hand-annotated where necessary** (canonicalStatus, entityType, era). The existing
`assets/icons/Status/*/manifest.json` files are a small working precedent.

---

## 12. Storage strategy analysis

### 12.1 Constraints and evidence

| Factor | Observed reality |
| --- | --- |
| Deployment | Netlify builds `vtt-react` → `vtt-react/build`; all of `vtt-react/public/` ships, including unreferenced art |
| CI | `.github/workflows/deploy.yml` exists; Netlify build env fixed to Node 20, 8 GB heap |
| Clone size | 1.22 GiB pack; every clone downloads full binary history |
| Asset churn | 77 commits touched app assets; 8,436 added vs 202 deleted; icons revised up to 7× |
| History bloat | 24,667 blobs / ~2.10 GB raw; ~184 asset paths absent from the current tree |
| Existing remote storage | Firebase Storage already integrated (`uploadService.js`, `storage.rules`; CSP allows `firebasestorage.googleapis.com`) |
| Runtime bandwidth | `Mythril.jpeg` alone is 54.8 MB per fetch; `rime-spire-peaks.jpg` 15 MB |
| Cost sensitivity | Single-developer project; GitHub LFS free tier is 1 GiB storage / 1 GiB monthly bandwidth |
| Franchise future | Concept archive, art plates for books/merch, and historical rosters must survive independently of the app |

### 12.2 Git LFS

- Pros: keeps paths stable for the app; transparent to CRA/Webpack; good for frequently
  revised medium-size binaries that must stay in-tree.
- Cons: GitHub LFS quotas are far below current content (1 GiB free, then metered); migrating
  existing history requires a rewrite that invalidates clone/default-branch tooling; and it
  does nothing for the ~3.2 GB of `.gemini`/`.playwright-mcp` local caches (already outside
  Git). It also does not reduce Netlify build size.
- Verdict: **not justified today.** The repository's bloat comes mostly from one-time art
  adds and duplicated trees, not continuous large-file churn. Adopt only if a specific
  workflow (e.g. layered source files, audio) enters the repo and stays in the 5–50 MB range.

### 12.3 External object storage (Firebase Storage, already in stack)

- Pros: zero Git cost; CDN delivery; integrates with existing auth/rules; ideal for
  oversized runtime assets (maps, rotating art), user-generated content, and future
  franchise media; Netlify build stays small.
- Cons: requires a runtime fetch strategy and offline/caching consideration; asset identity
  moves out of repo history; must manage rules/backup.
- Evidence for fit: the app already reads/writes Firebase Storage and already hosts
  user-uploaded maps and community content there; CSP permits it.

### 12.4 GitHub Releases / archive bundles

- Pros: effectively free, immutable, downloadable; perfect for **archive-class** material
  (concept history, removed assets, source masters, `_old` icon sets); decouples franchise
  archive from day-to-day repo growth.
- Cons: not suitable for runtime-scale delivery (no CDN contract, download semantics).

### 12.5 Recommendation (proposal, subject to owner approval)

**Hybrid: Git (small runtime subset) + Firebase Storage (oversized runtime assets) + GitHub
Releases (archive bundles). No LFS migration now.**

Staged path, each stage verifiable and reversible:

1. **Stop future bloat first (no deletions):** confirm ignore coverage for all generated
   classes (`.gemini/`, `.playwright-mcp/`, root screenshots already covered; add rules for
   any new capture locations); set a retention expectation for `.lore-audit-work`.
2. **Measure and manifest (this document + section 11):** hash + reference status for every
   asset; mark canonicalStatus.
3. **Optimize the worst runtime offenders:** evaluate downscaled/re-encoded delivery for
   `Mythril.jpeg` (54.8 MB) and `rime-spire-peaks.jpg` (15 MB); verify visual fidelity with
   the lore art owner. This is the largest user-facing win and touches two files.
4. **Consolidate the legacy tree (human decision):** root `public/` duplicates 198 groups —
   but 25 files are unique archive material. Move unique files to an archive release first,
   then decide the fate of duplicates with a manifest diff. Do not mass-delete.
5. **Archive the concept/history layer:** export `*_old` sets, 68-class thumbs, and
   history-only assets (184 paths) into a dated GitHub Release (`ip-archive-YYYY-MM`), keep
   working copies in place, and record `archivePath` in the manifest.
6. **Offload only if needed:** if large runtime assets multiply, host new/oversized art in
   Firebase Storage and reference it from the manifest; validate offline behavior first.

Decision triggers to revisit LFS: sustained monthly in-repo binary churn >100 MB for 2+
months, or introduction of layered/master source files that must live beside code.

---

## 13. Required inventories

### RUNTIME ASSETS

- All of `vtt-react/public/assets/**` reachable via literal or data-driven resolution:
  - `images/races` (406 files / 250 MB), `images/creatures` (404 / 171 MB),
    `icons/classes` current 21 icons (+ thumbs pending review), `icons/creatures` sprite
    families, `icons/status`, `icons/abilities`, `icons/items` (data-driven),
    `images/backgrounds` (incl. `Mythril.jpeg`, `rime-spire-peaks.jpg`),
    `images/classes`, `images/portraits`, `textures/walls`, `Backgrounds`,
    `tiles`, `walls`, `models/{terrain,walls,dungeon,nature,water,crypt,props}`,
    `objects`, `ui`, `audio/Steel_Against_Wood.mp3`.
- `vtt-react/src/assets/ui/**` (bundled imports).
- `vtt-react/public/index.html`, PWA `manifest.json`, favicons at `vtt-react/public/`.
- Evidence: 2,626 literal references + resolver code in section 5.3.

### CANONICAL IP ASSETS

- `docs/subrace_lore_compendium/assets/**` (93 / 58.6 MB).
- Race/subrace/creature/class illustration plates in `vtt-react/public/assets/images/**`
  (dual runtime/canonical role).
- `Images/Editor/WaterTiles.png`; root `public/assets/images/races/**` early approved art.
- History-only class/race illustrations (184 paths; archive).
- Lore documents that describe them: `docs/**`, `LORE_*` reports.

### ARCHIVE CANDIDATES

- 165 `*_old` class icons + `*_v*_old` variants (112.5 MB).
- 272 thumbnails for the 68-class legacy roster.
- Root `public/` unique files: `emberth_illustration.png`, `lava_tile.glb`,
  `wall_tile.glb`, old tile variants, early CRA shell.
- `assets/backdrops` placeholder set (document the plan or retire the names).
- History-only assets (section 3.3) — recoverable via Git.
- `_raw_greenscreen` source frames (Gambit, Pyrofiend).
- `Images/Editor` source masters.
- `.lore-audit-work` backup generations (lore owner decides).

### GENERATED / REPRODUCIBLE

- `.gemini/**` (1.60 GB), `.playwright-mcp/**` (1.58 GB), repo-root screenshots (106 MB),
  `vtt-react/.playwright-mcp` (1.4 MB), `sand_debug.png` and test composites,
  `.lore-audit-work` backup churn, `scratch/`, agent tooling output.

### PROBABLE CLEANUP CANDIDATES (flagged, nothing deleted)

1. `.playwright-mcp/console-*.log` — 17 files ≥10 MB totaling ~1.4 GB.
2. Zero-byte placeholder files (34 + 5).
3. Root-legacy exact duplicates where the `vtt-react/public/` copy is canonical
   (198 groups / 111.2 MB) — after archiving unique files.
4. `.gemini` copies of canonical app art (e.g. renders matching `plaguebringer_old.png`,
   `minstrel_old.png`, `hut_ling.png`, `gref.png`).
5. `sand_debug.png` and CRA shell duplicates in root `public/`.
6. Superseded `.lore-audit-work` backups (only with lore-owner sign-off).

### HUMAN REVIEW REQUIRED

- All `F` items before any action.
- `assets/icons/races` unreferenced icons (heritage vs retired).
- `assets/icons/items` and `icons/abilities` families not tied to data records.
- `assets/ui/card-frame`, `assets/ui/classes/*/_raw_greenscreen`.
- 68-class thumbnail roster and `_old` icon set (archive vs remove-from-served-tree).
- Root `public/` consolidation plan.
- `Mythril.jpeg` / `rime-spire-peaks.jpg` optimization (art fidelity).
- `.lore-audit-work` retention.
- Whether tracked QA captures (`mobile-audit-*`, `mobile-test-screenshots`, 58 `.playwright`
  yml snapshots, HUD test composites) are still wanted in Git.
- Missing manifests (`icons/creatures/manifest.json`, abilities manifest) and the stale
  generator script folder list.

### RECOMMENDED FUTURE ASSET STRATEGY

Adopt the hybrid described in section 12.5 with the manifest in section 11:
runtime assets stay in Git (small and optimized), oversized or new runtime art can move to
Firebase Storage, and concept/history material is exported to dated GitHub Release archives.
Classify before moving; manifest before cleanup; never delete without owner approval.
Revisit Git LFS only if sustained in-repo binary churn justifies it.

---

## 14. Reproducibility notes

Every number in this report can be regenerated read-only:

- Filesystem census: recurse all files excluding `node_modules`, `.git`, build outputs.
- Duplicates: group by byte size, then SHA-256 each candidate
  (`System.Security.Cryptography.SHA256`).
- Reference scan: concatenate text/code files per corpus, regex
  `[\w\-\./\\@%\+\$]*\.(png|jpe?g|webp|gif|svg|ico|bmp|avif|glb|gltf|mp3|wav|ogg|mp4|webm|bin)`,
  normalize to basenames, plus directory-path literal checks.
- Dimensions: read PNG/JPEG/GIF/WebP headers directly (no re-encode).
- Git metrics: `git count-objects -vH`, `git cat-file --batch-all-objects --batch-check`,
  `git rev-list --objects --all`, `git log --diff-filter=A/D -- vtt-react/public/assets`.

Known measurement caveats: basename-based matching cannot distinguish which tree a reference
resolves to (root `public/` vs `vtt-react/public/`); directory-convention evidence is
upper-bound; 40 images failed header parsing; duplicate candidates were limited to
same-size groups (different-size copies of the same artwork are covered by the
near-duplicate family analysis instead).

**Nothing in this report authorizes deletion. Every disposal decision requires explicit
human approval, and archive-class material should be exported before any cleanup.**
