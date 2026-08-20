# Thematic Audit — Mythrill VTT: Race & Class Framework

**Audit Date:** 2026-07-10
**Scope:** All 10 race files, 20 class data files, lore dictionary, background data, restriction logic
**Reviewer:** AI-assisted systematic cross-reference

---

## 1. RESTRICTION LOGIC BUGS (hardBlock overrides allowedSubrace)

The restriction validator (`characterUtils.js:860-870`) checks `hardBlocks` **before** `allowedSubraces`. This means hardBlock entries that match a character's `raceId` will prevent any subrace of that race from being selected, **even if the specific subrace is explicitly in `allowedSubraces`**.

### Bug 1 — Toxicologist: `"human"` blocks `thalren_human` and `morren_human`

**File:** `toxicologistData.js:17-21`
```
hardBlocks: ["human", "emberth", "fexrick"]         // "human" blocks ALL humans
allowedSubraces: ["thalren_human", "morren_human", ...]  // but allows these two
```
- A human character has `raceId = "human"` → `hardBlocks.includes("human")` → blocked
- **Fix:** Remove `"human"` from hardBlocks. The `allowedSubraces` already correctly filters to only Thalren and Morren.

### Bug 2 — Martyr: `"neth"` blocks `velun_neth`

**File:** `martyrData.js:10-17`
```
hardBlocks: ["tessen_human", "merryn_human", "ordan_human", "neth", "mimir"]
allowedSubraces: ["solvarn_human", "korr_emberth", "velun_neth", "skald_human"]
```
- A Velun Neth character has `raceId = "neth"` → `hardBlocks.includes("neth")` → blocked
- **Fix:** Remove `"neth"` from hardBlocks (redundant; `kessen_neth` and `drun_neth` are already excluded by `allowedSubraces`)

### Root Cause Pattern

Both bugs share the same pattern: a base race key (`"human"`, `"neth"`) in `hardBlocks` conflicts with specific subrace keys in `allowedSubraces`. The validator checks hardBlocks first, so the subrace restriction is never reached.

*Note: Chronarch was initially flagged during audit but verified clean — its hardBlocks use specific human subrace names (`"thalren_human"`, `"skald_human"`, etc.) rather than the base `"human"`, so `"tessen_human"` in allowedSubraces is not blocked.*

**Classes checked and found clean** (no hardBlock conflict with their allowedSubraces):
Berserker, Apex, Harbinger, Inquisitor, Lunarch, Warden, Shaper, Arcanoneer, Revenant, Gambit, Animist, False Prophet, Spellguard, Pyrofiend, Minstrel, Augur, Plaguebringer

---

## 2. NAMING CONVENTION: `fexrick` vs `fexric`

Documented in `races/fexrick.js:4`:
> "The race file is `fexrick.js`, the id is `fexrick`, and the adjective form is `Fexric`."

**Subrace IDs (adjective form, no 'k'):** `drall_fexric`, `kethrin_fexric`

**HardBlocks (race key, with 'k'):** `"fexrick"` in Arcanoneer, Animist, Inquisitor, Lunarch, Minstrel, Plaguebringer, Revenant, Toxicologist, Shaper

**Allowed (adjective form, no 'k'):** `"kethrin_fexric"` in Chronarch; `"drall_fexric"`, `"kethrin_fexric"` in Warden

✓ **No naming inconsistency found.** The convention is intentional and consistently applied.

---

## 3. SUBRACE CLASS COVERAGE

Every subrace from the race files appears in at least one class's `allowedSubraces`. All 27 subraces have viable class options. ✓

| Subrace | Classes Available |
|---|---|
| sylen_astril | Harbinger, False Prophet, Animist, Augur |
| muren_astril | Harbinger, False Prophet, Augur |
| viridian_florae | Lunarch, Toxicologist, Apex, Animist, Shaper, Warden |
| florae_unified (oken_florae) | Lunarch, Toxicologist, Apex, Animist, Shaper, Warden |
| korr_emberth | Martyr, Spellguard |
| thrask_emberth | Berserker, Spellguard, Pyrofiend |
| drall_fexric | Warden |
| kethrin_fexric | Chronarch, Warden |
| morgh_groven | Berserker, Shaper, Warden |
| ithran_groven | Chronarch, Gambit, Shaper, Warden |
| skald_human | Berserker, Apex, Animist, Augur, Chronarch, Pyrofiend, Warden |
| thalren_human | Inquisitor, Lunarch, Spellguard, Toxicologist |
| solvarn_human | Harbinger, Martyr, Pyrofiend, Spellguard |
| ordan_human | Animist, Apex |
| merryn_human | Gambit, Minstrel |
| morren_human | Animist, False Prophet, Inquisitor, Plaguebringer, Revenant, Toxicologist |
| tessen_human | Augur, Chronarch, Harbinger, Revenant |
| veiled_mimir | Apex, Lunarch, Shaper |
| tethered_mimir | Apex, Lunarch, Shaper, Toxicologist |
| breaker_myrathil | Gambit, Minstrel |
| river_myrathil | Minstrel |
| deep_myrathil | Minstrel |
| velun_neth | Animist, Arcanoneer, Spellguard |
| kessen_neth | Arcanoneer, Gambit |
| drun_neth | Arcanoneer, Plaguebringer, Revenant |
| clean_vreken | Animist, Apex, Augur, Inquisitor, Plaguebringer, Revenant, Warden |
| marked_vreken | Apex, Augur, Inquisitor, Plaguebringer, Revenant, Warden |

---

## 4. THEMATIC COHESION

### 4.1 World Lore Consistency

- All 10 races tied to a specific region and noble house.
- All 8 regions have detailed lore entries covering bargains, governance, economy, social stratification.
- Cosmic lore (Sol, Aex, Keth-Amar, the Warden, the Watcher, the Breach, the Deepening) is consistent across all files.
- Class founder stories (Valerius, Grum, Sera, Cassia, Veyra, Damon, Nesta, etc.) are consistent with their race and region origins.

### 4.2 Native Weaving

Every class has a `nativeWeaving` field explaining:
- **Ecological** — why the class emerged in its environment
- **Cultural** — the social practices that shaped it
- **Founder** — the historical figure who founded it
- **Subrace-native** — which subraces can biologically/culturally practice it

One of the strongest pieces of worldbuilding in the project.

### 4.3 Background Integration

- Backgrounds thematically tied to specific regions and subraces.
- Each has `classHooks` (classes it naturally leads to) and `tensionPairings` (conflicting philosophies).
- Examples: Emberspire Pilgrim → Martyr/Pyrofiend/Spellguard; Merrow Sailor → Gambit/Minstrel.

### 4.4 Crisis Angles

Each class's subrace variants include a `currentCrisisAngle` tying the class to unfolding world events:
- Thrask Berserkers feel Sol's prison cooling
- Astril Harbingers watch their constellation-spirits fade
- Vreken Inquisitors hunt Wyrd-corruption from the Breach

---

## 5. MERGED CLASS DOCUMENTATION

The class index (`classes/index.js`) documents 8 merged concepts:

| Original | Merged Into | Phase |
|---|---|---|
| Bladedancer | Shaper | 1.8 |
| Formbender | Shaper | 1.8 |
| Covenbane | Inquisitor | 1.9 |
| Exorcist | Inquisitor | 1.9 |
| Deathcaller | Revenant | 1.10 |
| Lichborne | Revenant | 1.10 |
| Dreadnaught | Martyr (Ironclad spec) | — |
| Titan | Warden (Monolith spec) | — |

The lore dictionary retains entries for merged concepts with `type: "concept"` and a `transition` field describing their fate. ✓

---

## 6. RECOMMENDATIONS

### Applied Fixes:
1. **Toxicologist** (`toxicologistData.js:17`) — removed `"human"` from hardBlocks
2. **Martyr** (`martyrData.js:16`) — removed `"neth"` from hardBlocks

### Suggestions:
2. **Validate all backgrounds** — Only `merrowSailor` uses `hardBlocks` (correctly). Ensure no similar conflicts in new backgrounds.
3. **Document precedence** — Add a comment in `characterUtils.js:860` that hardBlocks are checked first and override allowedSubraces.
4. **Unit test** — Add a test verifying no class has a hardBlock base race key conflicting with its allowed subraces (catches regressions automatically).
