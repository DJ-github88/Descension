# P10 independent acceptance review

**VERDICT: PASS. No BLOCK findings. Two should-fix text edits; both are one-line changes and can land in the repair cycle.**

Scope: mirror/vtt-react (37 files) against p10.diff, the pre-change uploads, roadmap P10/§18/§21/§30, CORE_LORE_FRAMEWORK §1, and the creator decisions in the brief. Skills and weapons pages are excluded, as the coordinator asked.

## Findings

### BLOCK
None.

### should-fix
1. **rules.json:4950 and :4971 (Item Wizard page). "armor bonus" is still taught as an armor parameter.** The diff edited the row at 4971 ("soak die effect" became "DR die") but kept "Armor bonus". Step 2 at 4950 still reads "For armor: armor bonus, armor type…". This conflicts with the brief's requirement that no Armor score survive in player-facing Laws. Fix: remove "armor bonus"/"Armor bonus" from both places (for example "DR die, armor type").
2. **rules.json:1015 (First Table Reference, "When You Are Hit").** The unresolved items are written as plain prose ("Open questions (the GM rules): …") instead of the `[Open: …]` marker used on every other page. Decision 2A requires unresolved items to be visibly `[Open]`, and the test pins the marker only on attacks-damage and reactions. Fix: wrap that sentence as `*[Open: criticals against shields, … The GM rules until it is decided.]*`.

### note (no action required for this verdict)
- **Lines published as rule that I cannot check against the approved Laws draft** (that draft is not in the material): "an elixir works from the moment you drink it; it never changes something that has already happened" (rules.json:2669); "Several people may react to the same moment"; "A follow-up belongs to the character whose reaction succeeded"; the four named reaction moments; and calling an "eight-second window" "the approved VTT procedure" (rules.json:3440). They fit 2A in spirit. The creator sign-off listed on the checklist should confirm them line by line.
- **Claims not covered by a test and with no owner file available locally:** Branvig "5 AP, Agility 18"; Feather Slash "slicing, one target"; Spellguard "Meltdown … 30 ft radius"; Pyrofiend "cooling and rest do not cancel it"; the "Restore to Maximum / Based on Initiative Roll / Fixed Amount" UI labels; P9 "cooldown starts when the result is recorded"; "refunds that would strand a higher tier are refused". I relied on the implementer's evidence for these.
- **universalCombatSpells.js:261.** Defend's `typeConfig.tags` still says `'reaction'`. No consumer reads it ahead of `spell.tags` (LibraryBrowserModal:281 checks `spell.tags` first), so this is cosmetic.
- **Saved PCs whose saved `actionPoints.max` is 3.** combatStore.js:127 reads `char.actionPoints?.max` before the derived value, so these PCs keep 3 until their sheet recalculates. That matches "no silent migration", but the checklist residuals list only saved spellbook costs. Add one line about this case.
- **Removed exports `getArmorRating`/`getSoakDie`** (creatureTooltipUtils.js). There are no other consumers inside the mirror. Importers elsewhere in the repo cannot be checked here; the passing TokenTooltips/BestiaryDisplay suites are reassuring.
- **The parse-guard test block has not been run.** It needs `@babel/parser` to resolve under CRA. I parsed the same files independently, with the result below.

## What I verified
- **JS/JSX validity:** all 14 edited plain JS files pass `node --check` as ES modules. All 17 edited JSX files parse with no diagnostics (TypeScript parser, JSX mode). That includes CreatureToken.jsx: the description strings at 2909/2929 are double-quoted and contain an apostrophe, which is valid. rules.json and lore.json parse as JSON.
- **Inventory:** `calculateCarryingCapacity`/`getInventoryGridDimensions` give 15 columns, with rows of 5 at STR 10–11 and ±1 per 2 STR, minimum 1. The 8-9…20-21 rows and slot counts match, and the extra-capacity remark holds. Encumbrance multipliers match characterUtils:380-406: STR/CON ×1.05/1.15 floored, the other four ×0.95/0.85 floored, speed ×0.75/×0.25. "Outermost zone any item reaches" matches inventoryStore:288-340. This documents current behavior as H7 asks.
- **Talents:** the published numbers match TALENT_SYSTEM: 5 per level, 50 total, cap 10, 3 trees, 7 tiers, Tier 7 at 30, ranks 1/2/3/5, tree capacity 50.
- **XP:** the per-level column is internally consistent with the totals. The totals are tested against `getXPForLevel`.
- **AP baseline:** firstTableRules.js defines 4/2/1/0 and default `'max'`. raceData resolves every heritage to 4, and the authored heritage values stay in the data. CharacterStats and characterUtils fall back to the constant.
- **Combat tracker:** startCombat and nextTurn now share `restoredActionPoints`. Initiative is rerolled only in `'initiative'` mode; otherwise `initiative`/`d20Roll` are carried forward. The shared-room path is unchanged: it still sets `pendingResourceResult`, keeps `temp` AP and `awaiting_authorization`, and skips the local sync. silentRoomHydration changes only the default for snapshots without a config, so saved configs are not reset.
- **combatStore test:** deterministic, because Math.random is mocked. It would fail if restore-to-max regressed (AP would end at 1) or if initiative were rerolled.
- **Strike and Defend costs:** the universal Attack and the weapon-integration strike cost 2 AP; Defend is a 1 AP ACTION. The authored Spell Reaction (2 AP) and Parry/Riposte (1 AP) costs are unchanged.
- **Armor/AC removals are display-only:**
  - No saved field is deleted or converted.
  - The homebrew DR input no longer writes `ac` and no longer reads `monster.ac` as a fallback.
  - The Defending marker's `effects` is now `{}`.
  - TargetHUD and UnifiedSpellCard label legacy armor as unresolved.
  - PartyHUD is untouched.
  - Codex chips now show `damageReduction`/`resistances`.
- **Laws vs 2A:**
  - Favored piece and backups; wear by face (armor on 1-2, shields on 1); doubled totals not read for wear; Defend 1 AP on your turn, doubling with no wear.
  - Criticals go around armor; Riposte ignores flat DR and the Defend doubling; the piercing critical lowers flat DR only.
  - Evasion: natural 1 misses, +1 adds a missing face. Elixirs cost 0 AP.
  - The creature line has no AC, never wears, and creature Defend is `[Open]` for amount/cost/duration.
  - The single `[Proposed]` item is labelled. No live "Armor Score − 10", soak die or Passive DR mechanic remains; the remaining mentions are negations.
  - The worked examples (goblin/Ilsa, Branvig 9+5−3=11) are arithmetically correct.
- **Support matrix:** it names exactly P8 Feather Slash and the four P9 spells, with everything else manual. The test derives the set from `supportSpell`.
- **Canon:**
  - the_deepening, the_breach and viridian match framework §1.3-1.7: Years of Whispers, the summit as rhetoric, the Unwritten seal, six genuine shards plus the Keth-made Counterfeit, no hidden seventh Monolith or cleansing key, the Long Cold dating from the Star-Fall.
  - IDs are preserved and every relatedTerm resolves; the two new terms exist.
  - Arcanoneer: Vaelis's First Contract predates the Star-Fall, and Valerius formalized the Nomenclature.
  - Shaper: Veyra is living and leads; Torin and Sylvanus are placed as the blueprint says, consistent with existing currentLeader:133 and :213-214.
  - Minstrel headline: living resonance, the Listener imitating the signals, seven pitches with five per pitch.
  - The quick-start "eighth house" line matches existing rules.json:299.
- **Cache versions:** rules and lore are bumped to 2.3.0.
- **Docs:** short and router-sized. CURRENT_PRIORITIES calls P10 "implemented", not accepted. The checklist marks every operational gate NOT PERFORMED/OPEN, records H13 as the open owner decision, and states "not release-ready". No container-nesting claims appear (H6).
