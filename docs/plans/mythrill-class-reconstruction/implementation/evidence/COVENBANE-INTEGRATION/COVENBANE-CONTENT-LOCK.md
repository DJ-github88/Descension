# Covenbane (`covenbane`) Content Lock & Blueprint

**Date:** 2026-10-30  
**Status:** Locked for Production Integration  
**Class ID:** `covenbane`  
**Standard Contract:** 2 Core Grants, 40 Optional Picks (4/level, levels 1–10, $\ge 2$ non-damage/level), 6 Talent Actives (3 Signatures, 3 Capstones), 48 Passives (16/tree across 3 trees), 54 Nodes (18/tree, 50 pts/tree) = **96 Unique Records**.

---

## 1. Class Identity, Role, & Tabletop Boundaries

### A. Identity & Flavor
- **Title:** The Covenbane
- **Subtitle:** Martial Occult Hunter & Spellbreaker
- **Role:** Anti-Magic Hunter / Striker / Controller
- **Damage Types:** Physical (Slashing, Piercing), Radiant, Force
- **Primary Attributes:** Agility, Perception, Spirit
- **Weapons & Armor:** Martial weapons (specializing in cold bog-iron blades, spears, and heavy execution irons), medium armor, leather wards, and null-salt pouches.
- **Narrative Foundation:**
  - Independent martial occult hunter and spellbreaker.
  - Investigates dangerous magic, tracks residual magical footprints, and prepares practical countermeasures.
  - Disrupts hostile workings, curses, bindings, and supernatural threats.
  - Practical martial capability supported by occult expertise; remains effective against mundane opponents and out-of-combat.
- **Inclusivity & Freedom:** Bog iron, null salts, and preparation tools support the class motif without imposing unapproved cultural origins, mandatory weapons, or universal spell immunity. Open to all lineages and backgrounds.

### B. Legacy Inquisitor Separation
- **Inquisitor (`inquisitor`):** Retired from new-character creation; strictly legacy-loadable. Uses `Authority` (0–8) and `inq_*` prefixes. Trees: `Witch Hammer`, `Iron Verdict`, `Hollow Saint`.
- **Covenbane (`covenbane`):** Active selectable class (24th class in canonical roster). Uses `Hexbreaker Charges` (0–6) and `cov_*` / `cr1_covenbane_*` prefixes. Trees: `Shadowbane`, `Spellbreaker`, `Demonhunter`.
- **Audit:** 0 namespace collisions. Inquisitor code, data, and characters remain 100% untouched and functional.

---

## 2. Resource System: Hexbreaker Charges

- **Scale & Limits:** 0 to 6 charges (Hard Cap 6).
- **Starting Value:** 0 charges.
- **Generation:**
  - +1 Charge when an enemy within 30 ft casts a spell or activates an innate magical feature.
  - +2 Charges when the Covenbane executes a magical parry or dispels an active effect.
  - +1 Charge when activating `cr1_covenbane_draw_null_salt` or starting a turn in a null-zone.
- **Spending:** Expended to fuel dispels, null-zones, silence mists, and execution strikes.
- **Decay & Recovery:** 1 charge decays every 2 rounds out of combat. Completely resets to 0 upon a long rest.
- **Tabletop Boundary:** Manual tabletop resolution only. No automated damage consequence application, automatic dispels, or automated condition clearing.

---

## 3. Core Class Features (2 Records — Granted at Level 1)

1. `cr1_covenbane_null_strike` (Core Action | 1 AP | 0 Mana | 0 Charges | Melee):
   Strike with cold bog-iron. Deal weapon damage (slashing/bludgeoning). If the target is concentrating on a spell or supernatural effect, they make their concentration check with disadvantage.
2. `cr1_covenbane_draw_null_salt` (Core Action | 1 AP | 0 Mana | Generates +1 Charge | Self):
   Scatter a handful of alchemical null-salts across weapon or boots. Gain +1 Hexbreaker Charge and +2 to saving throws against hexes, curses, and magical hazards until the end of your next turn.

---

## 4. Optional Spell Pools (Levels 1–10 | 40 Records | $\ge 2$ Non-Damage / Level)

### Level 1 (4 Options | 2 Non-Damage)
- `cov_shadow_hunt` (Utility | 1 AP | 0 Charges | Self): Trace residual magical footprints and heat leaks within 60 ft. Reveals invisible magical trails for 10 minutes.
- `cov_salt_ward` (Buff/Ward | 1 AP | 1 Charge | Self / Ally 15 ft): Sprinkle null-salt barrier. Absorbs 4 points of incoming magical/elemental damage. Lasts 1 round.
- `cov_hex_strike` (Damage | 2 AP | 1 Charge | Melee): 2d8 slashing + 1d6 force damage. If target has active magical buffs, dispel one minor buff.
- `cov_silver_blade` (Damage | 1 AP | 0 Charges | Melee): 1d8 slashing + 1d4 radiant damage. Deals maximum damage against unholy, necrotic, or shapeshifted targets.

### Level 2 (4 Options | 3 Non-Damage)
- `cov_dark_pursuit` (Utility/Move | 1 AP | 0 Charges | Self): Leap up to 25 ft toward a creature that cast a spell since your last turn.
- `cov_bog_iron_parry` (Reaction/Defend | 1 AP | 1 Charge | Self): Deflect incoming spell attack, reducing damage by 1d10 + Agility and gaining +1 Charge.
- `cov_severing_slash` (Damage | 2 AP | 1 Charge | Melee): 2d10 slashing damage; target cannot teleport or use planar movement for 1 round.
- `cov_disruptive_shout` (Control/Debuff | 1 AP | 1 Charge | 20 ft cone): Force all casting enemies to make a Will save or suffer 1 round of Silence.

### Level 3 (4 Options | 2 Non-Damage)
- `cov_null_salts_flask` (Utility/Zone | 1 AP | 2 Charges | 20 ft range): Throw a flask creating a 10 ft radius null-zone. Magic cannot be cast inside for 2 rounds.
- `cov_witch_scent` (Utility | 1 AP | 0 Charges | Self): Discern the exact school and tier of any active enchantment within 100 ft.
- `cov_chain_shatter` (Damage | 2 AP | 2 Charges | Melee): 3d8 slashing damage; shatters physical and magical shields (+2d8 bonus damage to ward pools).
- `cov_cold_iron_gouge` (Damage/Debuff | 2 AP | 1 Charge | Melee): 2d8 piercing damage; target bleeds for 1d6 physical damage per turn whenever they spend mana.

### Level 4 (4 Options | 2 Non-Damage)
- `cov_leaden_veil` (Buff | 1 AP | 1 Charge | Self): Gain advantage on all saves against charm, fear, and psychic influence for 1 minute.
- `cov_grounding_spike` (Utility | 1 AP | 2 Charges | Melee): Drive a cold-iron spike into the terrain. Lightning, fire, and storm spells within 20 ft are redirected to the spike.
- `cov_punishing_counter` (Damage/Reaction | 1 AP | 2 Charges | Melee): Triggered when an enemy casts within 5 ft; make an immediate weapon strike dealing 2d10 damage.
- `cov_abyssal_sever` (Damage | 2 AP | 2 Charges | Melee): 3d10 force/slashing damage; banishes summoned minions with HP $\le 15$ instantly.

### Level 5 (4 Options | 2 Non-Damage)
- `cov_veil_breaker` (Utility/Dispel | 2 AP | 3 Charges | 30 ft): Cleanse all illusion, invisibility, and shapeshift effects within a 20 ft radius.
- `cov_shackles_of_bog_iron` (Control | 2 AP | 2 Charges | 25 ft): Cold-iron chains erupt; target speed reduced to 0 and cannot cast spells requiring somatic components for 2 rounds.
- `cov_hexbreaker_execution` (Damage | 2 AP | 3 Charges | Melee): 4d8 slashing damage; deals +2d8 bonus damage if target has cast a spell this encounter.
- `cov_radiant_purge` (Damage/AoE | 2 AP | 3 Charges | 15 ft radius): 3d8 radiant damage to all nearby foes; destroys all magical traps/hazards in the radius.

### Level 6 (4 Options | 2 Non-Damage)
- `cov_ward_inversion` (Utility/Dispel | 1 AP | 3 Charges | 30 ft): Target enemy magical ward inverts, dealing its remaining shield capacity as pure damage to its bearer.
- `cov_occult_dampener` (Buff/Aura | 2 AP | 3 Charges | Self 15 ft aura): All allies within 15 ft gain +3 to saves against arcane and necrotic spells for 3 rounds.
- `cov_bog_iron_whirlwind` (Damage/AoE | 2 AP | 3 Charges | Melee 10 ft): Spin with iron blade; 3d10 slashing to all surrounding enemies and push them back 5 ft.
- `cov_mind_flint_strike` (Damage/Debuff | 2 AP | 2 Charges | Melee): 2d10 psychic/slashing damage; burns 5 points of enemy mana or removes 1 resource charge.

### Level 7 (4 Options | 2 Non-Damage)
- `cov_leyline_anchor` (Utility/Zone | 2 AP | 4 Charges | 30 ft): Plants a heavy anchor that suppresses all teleportation, planar travel, and summoning within 40 ft for 1 minute.
- `cov_null_salts_barrage` (Debuff/Zone | 2 AP | 3 Charges | 30 ft cone): Cone of dense null-salts; all spells passing through the cone suffer a 50% miscast chance for 2 rounds.
- `cov_hexbreaker_storm` (Damage/AoE | 3 AP | 4 Charges | 20 ft radius): 4d10 force damage to all spellcasters in range; interrupts all active concentration immediately.
- `cov_apex_predator` (Damage/Stance | 2 AP | 3 Charges | Self): For 3 rounds, your weapon strikes deal +2d8 radiant damage against creatures with innate spellcasting.

### Level 8 (4 Options | 2 Non-Damage)
- `cov_silence_shroud` (Utility/Stealth | 2 AP | 4 Charges | Self): Wrap in total sonic and magical silence; immune to detection by magical scrying, tremorsense, or truesight for 10 minutes.
- `cov_sanctuary_of_iron` (Buff/Ward | 2 AP | 4 Charges | 15 ft radius): Create a dome of cold-iron runes; completely blocks incoming ranged spell projectiles for 2 rounds.
- `cov_judgment_day` (Damage | 3 AP | 5 Charges | Melee): 5d10 radiant/slashing damage; if target has cast a spell of tier 4+, target is stunned for 1 round.
- `cov_anti_magic_storm` (Damage/AoE | 3 AP | 5 Charges | 30 ft radius): 5d8 force damage and cleanses all magical effects (friendly and hostile) from all targets in the area.

### Level 9 (4 Options | 2 Non-Damage)
- `cov_sever_ley_threads` (Utility/Dispel | 2 AP | 5 Charges | 40 ft): Completely severs target creature's connection to magical leylines for 2 rounds; target cannot cast spells.
- `cov_null_salts_apotheosis` (Buff | 2 AP | 3 Charges | Self): Gain temporary HP equal to 5 $\times$ your Covenbane level for 3 rounds.
- `cov_lethal_anathema` (Damage | 3 AP | 5 Charges | Melee): 6d10 radiant/slashing damage; permanently disables the target's highest-tier spell slot for 24 hours.
- `cov_rupture_leyline` (Damage/AoE | 3 AP | 5 Charges | 40 ft line): Rupture the ground in a 40 ft furrow; deals 5d8 force damage and knocks all targets prone.

### Level 10 (4 Options | 2 Non-Damage)
- `cov_orvens_legacy` (Buff/Aura | 3 AP | 6 Charges | 30 ft aura): For 3 rounds, allies within 30 ft gain spell resistance +4 and cannot be charmed or dominated.
- `cov_bog_iron_immuration` (Utility | 2 AP | 4 Charges | Self): Encase yourself in impenetrable null-iron for 1 round; immune to all damage, cannot take actions.
- `cov_barbed_vow_fulfillment` (Damage | 3 AP | 6 Charges | Melee): 8d10 pure damage against a primary spellcaster boss. Cannot be mitigated or reflected.
- `cov_extinguish_spark` (Damage/Control | 3 AP | 6 Charges | Melee): 6d12 force damage; target is permanently silenced until a completed long rest.

---

## 5. Talent Trees & Node Architectures (3 Trees | 54 Nodes | 50 Pts/Tree)

### Tree 1: `COVENBANE_SHADOWBANE` (Anti-Sorcery Tracking & Infiltration)
- **Tagline:** Track residual occult spoor, stalk unseen through leylines, and strike from absolute silence.
- **Signature Node (17):** `cr1_covenbane_shadowbane_signature` $\rightarrow$ Grants `cov_sig_null_shroud` (1 AP | 2 Charges | Self): Shroud in cold mist; invisible to magical detection for 3 rounds.
- **Capstone Node (18):** `cr1_covenbane_shadowbane_capstone` $\rightarrow$ Grants `cov_cap_aegis_of_bog_iron` (2 AP | 4 Charges | 20 ft aura): Project an impenetrable dampening field for 2 rounds.
- **16 Passives (3 Ranks Each):**
  1. `p01` (`sb_hex_focus`): Hex Focus — Hexbreaker Charges build faster against hostile casters (+1 charge on 1st spell observed / combat).
  2. `p02` (`sb_quiet_tread`): Quiet Tread — Add [5, 10, 15] ft to Stealth movement while stalking a creature with magical abilities.
  3. `p03` (`sb_residual_trail`): Residual Trail — Add [1, 2, 3] to Survival/Tracking checks against magical trails.
  4. `p04` (`sb_shadow_strike`): Shadow Strike — Weapon attacks from stealth deal +[1d6, 2d6, 3d6] extra physical damage.
  5. `p05` (`sb_mist_veil`): Mist Veil — Gain +[1, 2, 3] to Stealth checks in fog, rain, or low-light terrain.
  6. `p06` (`sb_curse_resistance`): Curse Resistance — Add +[1, 2, 3] to saving throws against curses, hexes, and necromancy.
  7. `p07` (`sb_silent_pursuit`): Silent Pursuit — Moving within 30 ft of a concentrating enemy costs -[1, 2, 3] less movement.
  8. `p08` (`sb_cold_patience`): Cold Patience — Add +[1, 2, 3] to Initiative when an enemy spellcaster is detected.
  9. `p09` (`sb_iron_cowl`): Iron Cowl — Reduce psychic and illusion damage taken by [2, 4, 6].
  10. `p10` (`sb_barbed_snares`): Barbed Snares — When setting physical traps, increase DC by +[1, 2, 3].
  11. `p11` (`sb_whispering_salt`): Whispering Salt — Salt wards reveal hidden creatures within [5, 10, 15] ft of the boundary.
  12. `p12` (`sb_ambush_precision`): Ambush Precision — Weapon attacks from stealth reduce target armor by [1, 2, 3] for 1 round.
  13. `p13` (`sb_unseen_step`): Unseen Step — Add +[1, 2, 3] to Agility saves while unseen or in concealment.
  14. `p14` (`sb_dampened_stride`): Dampened Stride — Gain resistance to thunder and sonic damage; footsteps make [33%, 66%, 100%] less noise.
  15. `p15` (`sb_shadow_execution`): Shadow Execution — Attacks against unaware enemies have critical threshold reduced by [1, 2, 3].
  16. `p16` (`sb_shadowbane_mastery`): Shadowbane Mastery — Gain +[1, 2, 3] to all Stealth and tracking checks, and +1 max charge capacity.

### Tree 2: `COVENBANE_SPELLBREAKER` (Kinetic Dispelling & Shield Shatter)
- **Tagline:** Parrying magical forces, shattering wards into pure shrapnel, and draining leyline reserves.
- **Signature Node (17):** `cr1_covenbane_spellbreaker_signature` $\rightarrow$ Grants `cov_sig_leyline_cleaver` (2 AP | 2 Charges | Melee): 3d10 force; immediately dispels 2 highest-tier enemy buffs.
- **Capstone Node (18):** `cr1_covenbane_spellbreaker_capstone` $\rightarrow$ Grants `cov_cap_absolute_severance` (3 AP | 5 Charges | Melee): 6d10 damage; severs all spell connections and drains 20 enemy mana.
- **16 Passives (3 Ranks Each):**
  1. `p01` (`sp_ward_breaker`): Ward Breaker — Deal +[1d8, 2d8, 3d8] bonus damage against magical shields and ward pools.
  2. `p02` (`sp_iron_parry`): Iron Parry — Deflecting a spell attack reduces damage by an additional +[2, 4, 6].
  3. `p03` (`sp_kinetic_feedback`): Kinetic Feedback — When you disrupt a spell, the caster takes [2, 4, 6] force damage.
  4. `p04` (`sp_spell_attrition`): Spell Attrition — Your weapon attacks burn [1, 2, 3] mana from enemies on hit.
  5. `p05` (`sp_dense_iron`): Dense Iron — Weapons crafted with cold iron ignore [10%, 20%, 30%] of magical damage resistances.
  6. `p06` (`sp_counter_poise`): Counter Poise — Gain +[1, 2, 3] to Will saves against enchantment and domination.
  7. `p07` (`sp_rupture_ward`): Rupture Ward — Dispelling an active effect creates a 5 ft burst dealing [1d6, 2d6, 3d6] force damage to enemies.
  8. `p08` (`sp_disruption_tempo`): Disruption Tempo — Gain +[1, 2, 3] to weapon attack rolls against enemies that cast a spell this round.
  9. `p09` (`sp_grounding_frame`): Grounding Frame — Reduce incoming lightning, storm, and force damage by [2, 4, 6].
  10. `p10` (`sp_shatter_thrust`): Shatter Thrust — Critical hits on spellcasters force an immediate concentration check with -[2, 4, 6] penalty.
  11. `p11` (`sp_resonant_parry`): Resonant Parry — Successfully parrying a magical strike generates +[1, 2, 2] Hexbreaker Charge (once per round).
  12. `p12` (`sp_arcane_fracture`): Arcane Fracture — Enemies whose spells you parry suffer -[1, 2, 3] to spell attack rolls until end of their turn.
  13. `p13` (`sp_firm_footing`): Firm Footing — Add +[1, 2, 3] to checks against forced movement or knockback caused by spells.
  14. `p14` (`sp_severing_momentum`): Severing Momentum — Killing an enemy or breaking a ward refunds [1, 2, 3] AP once per encounter.
  15. `p15` (`sp_null_barrier`): Null Barrier — Standing inside a null-zone grants +[1, 2, 3] AC against ranged attacks.
  16. `p16` (`sp_spellbreaker_mastery`): Spellbreaker Mastery — Ward Breaker bonus increases by +[1d8, 2d8, 3d8] and dispels remove 1 additional minor buff.

### Tree 3: `COVENBANE_DEMONHUNTER` (Abyssal Purging & Barbed Execution)
- **Tagline:** Relentless execution of abominations, bleeding tainted veins, and purging planar corruption.
- **Signature Node (17):** `cr1_covenbane_demonhunter_signature` $\rightarrow$ Grants `cov_sig_barbed_execution` (2 AP | 3 Charges | Melee): 4d10 damage; deals double damage to targets below 30% HP.
- **Capstone Node (18):** `cr1_covenbane_demonhunter_capstone` $\rightarrow$ Grants `cov_cap_void_strata_judgment` (3 AP | 6 Charges | Melee): 7d10 pure damage; target must make a DC 18 save or be banished to the void.
- **16 Passives (3 Ranks Each):**
  1. `p01` (`dh_unholy_scourge`): Unholy Scourge — Weapon attacks deal +[1d4, 2d4, 3d4] radiant damage against aberrations, fiends, and undead.
  2. `dh_blood_scent` (`dh_blood_scent`): Blood Scent — Gain +[1, 2, 3] to attack rolls against wounded magical targets (below 50% HP).
  3. `p03` (`dh_barbed_vow`): Barbed Vow — Critical hit threshold against unholy and corrupted creatures reduced by [1, 2, 3].
  4. `p04` (`dh_fearless_gaze`): Fearless Gaze — Gain +[2, 4, 6] to saves against fear and horror; immune to supernatural terror at rank 3.
  5. `p05` (`dh_rending_strike`): Rending Strike — Weapon hits cause bleeding for [1d4, 1d6, 1d8] physical damage per turn for 2 turns.
  6. `p06` (`dh_corpse_burn`): Corpse Burn — Slain foes cannot be reanimated by necromancy; gain [2, 4, 6] temp HP on slaying an unholy foe.
  7. `p07` (`dh_vow_of_silence`): Vow of Silence — Gain advantage on saving throws against verbal spells and command words (+[1, 2, 3] save bonus).
  8. `p08` (`dh_barbed_chains`): Barbed Chains — Enemies you slow or root suffer [1d6, 2d6, 3d6] piercing damage when attempting to move.
  9. `p09` (`dh_silver_marrow`): Silver Marrow — Weapon strikes ignore necrotic and unholy damage reduction by [25%, 50%, 75%].
  10. `p10` (`dh_ruthless_execution`): Ruthless Execution — When target is below 25% HP, weapon attacks deal +[2d6, 4d6, 6d6] bonus damage.
  11. `p11` (`dh_vital_severance`): Vital Severance — Bleeding enemies take +[1, 2, 3] additional damage from your Hexbreaker abilities.
  12. `p12` (`dh_relentless_hunt`): Relentless Hunt — If quarry flees, movement speed increases by +[5, 10, 15] ft toward them.
  13. `p13` (`dh_iron_constitution`): Iron Constitution — Add +[1, 2, 3] to Constitution saves against poison and supernatural diseases.
  14. `p14` (`dh_purifying_burst`): Purifying Burst — Slaying an enemy with Hexbreaker charges active deals [2d6, 3d6, 4d6] radiant damage to adjacent foes.
  15. `p15` (`dh_apex_vow`): Apex Vow — Against boss/elite casters, weapon damage rolls treat 1s and 2s as [3, 4, 5].
  16. `p16` (`dh_demonhunter_mastery`): Demonhunter Mastery — All radiant and execution damage dealt by Covenbane abilities increases by +[10%, 20%, 30%].

---

## 6. Progression & Selection Policy

- **Starting Pick:** Exactly 1 spell chosen from Level 1 pool (4 options available).
- **Core Grants:** `cr1_covenbane_null_strike` and `cr1_covenbane_draw_null_salt` granted automatically at level 1 outside the spell pick quota.
- **Level-Up Picks:** Exactly 1 spell per level-up (levels 2–10). Earlier unchosen spells remain eligible.
- **Talent Pruning:** Controlled via standard `pruneCr1Talents` algorithm in `progressionSlice.js`. Pruning resets ranks exceeding level budget or failing prerequisite gates without affecting legacy Inquisitor or Chaos Weaver custom engines.
