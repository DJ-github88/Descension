# 30-Class Restoration: Production Package Blueprints & Content Locks

**Date:** 2026-10-30  
**Status:** Complete Per-Record and Per-Node Content Locks for Review  
**Classes Covered:** Covenbane, Exorcist, Dreadnaught, Inscriptor, Witch Doctor, Bladedancer, Totemist.  
**Standard Contract:** 2 Core Grants, 40 Optional Picks (levels 1–10, 4/level, ≥2 non-damage/level), 6 Talent Actives (3 Signatures, 3 Capstones), 48 Passives (16/tree across 3 trees), 54 Nodes (18/tree, 50 pts/tree) = **96 Unique Records per Class**.

---

## 1. Covenbane (`covenbane`) Production Package

### A. Resource System Specification
- **Name:** Hexbreaker Charges
- **Range & Capacity:** 0 to 6 charges (Hard Cap 6).
- **Starting Value:** 0 charges.
- **Generation:**
  - +1 Charge when an enemy within 30 ft casts a spell or activates a magical feature.
  - +2 Charges when the Covenbane successfully executes a parry against a magical strike or dispels an active effect.
  - +1 Charge at the start of the Covenbane's turn if standing within an active null-zone.
- **Spending:** Expended to fuel anti-magic strikes, kinetic dispels, and silence bursts.
- **Reset & Decay:** 1 charge decays every 2 rounds out of combat. Restores to 0 on long rest.
- **Tabletop Limits:** Cannot exceed 6 charges under any circumstances; charges cannot be converted to mana or generic action points.

### B. Core Class Features (2 Records)
1. `cr1_covenbane_null_strike` (Core Action | 1 AP | 0 Mana | 0 Charges | Melee): Strike with cold bog-iron. Deal weapon damage (slashing/bludgeoning). If target is concentrating on a spell, they make their concentration check with disadvantage.
2. `cr1_covenbane_draw_null_salt` (Core Action | 1 AP | 0 Mana | Generates +1 Charge | Self): Scatter a handful of alchemical null-salts across weapon or boots. Gain +1 Hexbreaker Charge and +2 to saving throws against hexes until the end of your next turn.

### C. Optional Spell Pools (Levels 1–10 | 40 Records)
- **Level 1 (4 Picks | ≥2 Non-Damage):**
  1. `cov_shadow_hunt` (Utility | 1 AP | 0 Charges | Self): Trace residual magical footprints and heat leaks within 60 ft. Reveals invisible magical trails for 10 minutes.
  2. `cov_salt_ward` (Buff/Ward | 1 AP | 1 Charge | Self / Ally 15 ft): Sprinkle null-salt barrier. Absorbs 4 points of incoming magical/elemental damage. Lasts 1 round.
  3. `cov_hex_strike` (Damage | 2 AP | 1 Charge | Melee): 2d8 slashing + 1d6 force damage. If target has active magical buffs, dispel one minor buff.
  4. `cov_silver_blade` (Damage | 1 AP | 0 Charges | Melee): 1d8 slashing + 1d4 radiant damage. Deals maximum damage against unholy, necrotic, or shapeshifted targets.
- **Level 2 (4 Picks | ≥2 Non-Damage):**
  1. `cov_dark_pursuit` (Utility/Move | 1 AP | 0 Charges | Self): Leap up to 25 ft toward a creature that cast a spell since your last turn.
  2. `cov_bog_iron_parry` (Reaction/Defend | 1 AP | 1 Charge | Self): Deflect incoming spell attack, reducing damage by 1d10 + Agility and gaining +1 Charge.
  3. `cov_severing_slash` (Damage | 2 AP | 1 Charge | Melee): 2d10 slashing damage; target cannot teleport or use planar movement for 1 round.
  4. `cov_disruptive_shout` (Control/Debuff | 1 AP | 1 Charge | 20 ft cone): Force all casting enemies to make a Will save or suffer 1 round of Silence.
- **Level 3 (4 Picks | ≥2 Non-Damage):**
  1. `cov_null_salts_flask` (Utility/Zone | 1 AP | 2 Charges | 20 ft range): Throw a flask creating a 10 ft radius null-zone. Magic cannot be cast inside for 2 rounds.
  2. `cov_witch_scent` (Utility | 1 AP | 0 Charges | Self): Discern the exact school and tier of any active enchantment within 100 ft.
  3. `cov_chain_shatter` (Damage | 2 AP | 2 Charges | Melee): 3d8 slashing damage; shatters physical and magical shields (+2d8 bonus damage to ward pools).
  4. `cov_cold_iron_gouge` (Damage/Debuff | 2 AP | 1 Charge | Melee): 2d8 piercing damage; target bleeds for 1d6 physical damage per turn whenever they spend mana.
- **Level 4 (4 Picks | ≥2 Non-Damage):**
  1. `cov_leaden_veil` (Buff | 1 AP | 1 Charge | Self): Gain advantage on all saves against charm, fear, and psychic influence for 1 minute.
  2. `cov_grounding_spike` (Utility | 1 AP | 2 Charges | Melee): Drive a cold-iron spike into the terrain. Lightning, fire, and storm spells within 20 ft are redirected to the spike.
  3. `cov_punishing_counter` (Damage/Reaction | 1 AP | 2 Charges | Melee): Triggered when an enemy casts within 5 ft; make an immediate weapon strike dealing 2d10 damage.
  4. `cov_abyssal_sever` (Damage | 2 AP | 2 Charges | Melee): 3d10 force/slashing damage; banishes summoned minions with HP ≤ 15 instantly.
- **Level 5 (4 Picks | ≥2 Non-Damage):**
  1. `cov_veil_breaker` (Utility/Dispel | 2 AP | 3 Charges | 30 ft): Cleanse all illusion, invisibility, and shapeshifting effects within a 20 ft burst.
  2. `cov_iron_resolve` (Buff | 1 AP | 1 Charge | Self): Remove one mental or magical debuff currently affecting you.
  3. `cov_hex_reversal` (Damage/Reaction | 1 AP | 3 Charges | 30 ft): When targeted by a hostile single-target spell, reflect half the damage back at the caster.
  4. `cov_vow_strike` (Damage | 3 AP | 3 Charges | Melee): 4d10 slashing damage; target is knocked prone and cannot regain hit points for 1 round.
- **Level 6 (4 Picks | ≥2 Non-Damage):**
  1. `cov_stifling_mist` (Control | 2 AP | 2 Charges | 30 ft): Release aerosolized null-salts creating heavy concealment; spells passing through lose 50% range.
  2. `cov_tracker_stride` (Utility | 1 AP | 0 Charges | Self): Ignore difficult terrain caused by magical vines, ice, grease, or mud for 10 minutes.
  3. `cov_coven_cleaver` (Damage | 2 AP | 2 Charges | Melee Cleave): 3d8 damage to up to 3 adjacent targets; dispels shared coven links.
  4. `cov_witch_hammer_blow` (Damage | 3 AP | 3 Charges | Melee): 4d8 bludgeoning + 2d8 force; stuns target for 1 round on failed Fortitude save.
- **Level 7 (4 Picks | ≥2 Non-Damage):**
  1. `cov_barbed_trap` (Utility | 2 AP | 2 Charges | 10 ft range): Lay a hidden bog-iron snare. Triggers when stepped on, dealing 2d6 piercing and immobilizing for 1 round.
  2. `cov_sanctuary_breach` (Utility/Dispel | 2 AP | 3 Charges | Melee): Pierce and collapse an enemy sanctuary, dome, or fortress barrier.
  3. `cov_null_overload` (Damage/AoE | 3 AP | 4 Charges | 15 ft radius around self): Detonate null-salts; all creatures within take 4d8 force damage and lose 10 mana.
  4. `cov_severing_execution` (Damage | 3 AP | 4 Charges | Melee): 5d10 slashing damage against a silenced or concentrating target.
- **Level 8 (4 Picks | ≥2 Non-Damage):**
  1. `cov_iron_mantle` (Buff | 2 AP | 3 Charges | Self): Immune to all spells of level 3 or lower for 2 rounds.
  2. `cov_bloodhound_patience` (Utility | 1 AP | 0 Charges | Self): Cannot be surprised by magical ambush; sense the approach of hostile spellcasters within 300 ft.
  3. `cov_obliterating_thrust` (Damage | 3 AP | 4 Charges | Melee): 5d12 piercing damage; ignores physical armor and magical damage reduction.
  4. `cov_coven_bane_flurry` (Damage | 3 AP | 4 Charges | Melee): 3 strikes dealing 2d8 damage each; each strike strips one active beneficial effect.
- **Level 9 (4 Picks | ≥2 Non-Damage):**
  1. `cov_absolute_null_field` (Utility/Zone | 3 AP | 5 Charges | 20 ft radius): Deploy an absolute dead-magic bubble for 1 round. No spells can be cast into, out of, or within it.
  2. `cov_unyielding_flesh` (Buff | 2 AP | 3 Charges | Self): Gain temporary HP equal to 5 × your Covenbane level for 3 rounds.
  3. `cov_lethal_anathema` (Damage | 3 AP | 5 Charges | Melee): 6d10 radiant/slashing damage; permanently disables the target's highest-tier spell slot for 24 hours.
  4. `cov_rupture_leyline` (Damage/AoE | 3 AP | 5 Charges | 40 ft line): Rupture the ground in a 40 ft furrow; deals 5d8 force damage and knocks all targets prone.
- **Level 10 (4 Picks | ≥2 Non-Damage):**
  1. `cov_orvens_legacy` (Buff/Aura | 3 AP | 6 Charges | 30 ft aura): For 3 rounds, allies within 30 ft gain spell resistance +4 and cannot be charmed or dominated.
  2. `cov_bog_iron_immuration` (Utility | 2 AP | 4 Charges | Self): Encase yourself in impenetrable null-iron for 1 round; immune to all damage, cannot take actions.
  3. `cov_barbed_vow_fulfillment` (Damage | 3 AP | 6 Charges | Melee): 8d10 pure damage against a primary spellcaster boss. Cannot be mitigated or reflected.
  4. `cov_extinguish_spark` (Damage/Control | 3 AP | 6 Charges | Melee): 6d12 force damage; target is permanently silenced until a completed long rest.

### D. Talent Trees (3 Trees | 54 Nodes | 50 Points/Tree)
1. **Tree 1: `COVENBANE_SHADOWBANE` (Anti-Sorcery Tracking & Silence)**
   - *Nodes 1–16 (Passives, 1–3 ranks, 46 pts total):* Null scent, cold-iron grip, silence duration (+1 round), stealth vs truesight, saving throw bonuses vs curses, bog camouflage.
   - *Node 17 (Signature Active | 2 pts):* `cov_sig_null_shroud` (1 AP | 2 Charges | Self): Cloak in cold mist; gain invisibility against magical detection for 3 rounds.
   - *Node 18 (Capstone Active | 2 pts):* `cov_cap_aegis_of_bog_iron` (2 AP | 4 Charges | 20 ft aura): Project an impenetrable dampening field for 2 rounds.
2. **Tree 2: `COVENBANE_SPELLBREAKER` (Kinetic Dispelling & Shield Shatter)**
   - *Nodes 1–16 (Passives, 46 pts):* Ward damage amplification, parry chance (+15%), charge generation on crit, mana burn on strike (+2 per hit), armor penetration.
   - *Node 17 (Signature Active | 2 pts):* `cov_sig_leyline_cleaver` (2 AP | 2 Charges | Melee): 3d10 force; immediately dispels 2 highest-tier enemy buffs.
   - *Node 18 (Capstone Active | 2 pts):* `cov_cap_absolute_severance` (3 AP | 5 Charges | Melee): 6d10 damage; severs all spell connections and drains 20 enemy mana.
3. **Tree 3: `COVENBANE_DEMONHUNTER` (Abyssal Purging & Barbed Execution)**
   - *Nodes 1–16 (Passives, 46 pts):* Radiant strike bonus (+1d4), crit threshold against unholy (-1), fear immunity, bleed duration (+2 rounds), execute threshold.
   - *Node 17 (Signature Active | 2 pts):* `cov_sig_barbed_execution` (2 AP | 3 Charges | Melee): 4d10 damage; deals double damage to targets below 30% HP.
   - *Node 18 (Capstone Active | 2 pts):* `cov_cap_void_strata_judgment` (3 AP | 6 Charges | Melee): 7d10 pure damage; target must make a DC 18 save or be banished to the void.

---

## 2. Exorcist (`exorcist`) Production Package

### A. Resource System Specification
- **Name:** Purification Sanctity
- **Range & Capacity:** 0 to 10 Sanctity.
- **Starting Value:** 3 Sanctity (Base Prepared Rites).
- **Generation:**
  - +1 Sanctity per round spent inside a consecrated salt circle.
  - +2 Sanctity when an ally within 25 ft succeeds on a save against a psychic, fear, or charm effect.
  - +3 Sanctity when successfully extracting an entity or cleansing a condition.
- **Spending:** Expended to fuel litanies, sin-eating absorptions, and sacred salt boundaries.
- **Failure:** At 0 Sanctity, the Exorcist loses spiritual shielding and suffers -2 to all Will saves.
- **Reset:** Resets to 3 Sanctity on short rest; 5 Sanctity on long rest.

### B. Core Class Features (2 Records)
1. `cr1_exorcist_consecrate_threshold` (Core Action | 1 AP | 0 Mana | Generates +1 Sanctity | 15 ft radius): Draw a rapid salt ring on the ground. Allies within gain +2 to saves vs possession; enemies entering suffer -10 ft movement.
2. `cr1_exorcist_litany_of_purging` (Core Action | 1 AP | 1 Sanctity | 30 ft range): Chant a sacred litany at an ally or host; cleanses one fear, charm, or psychic debuff.

### C. Optional Spell Pools (Levels 1–10 | 40 Records)
- **Level 1 (4 Picks | ≥2 Non-Damage):**
  - `exo_salt_brand` (Damage/Debuff | 1 AP | 1 Sanctity | 25 ft): 1d8 radiant damage; target takes +2 damage from all physical and holy attacks for 1 round.
  - `exo_scourge_of_submission` (Damage | 1 AP | 0 Sanctity | Melee): 1d8 slashing + 1d4 radiant damage with a consecrated lead-weighted scourge.
  - `exo_discern_impurity` (Utility | 1 AP | 0 Sanctity | 30 ft): Detect the presence and exact nature of possessed entities or Wyrd parasites within a creature.
  - `exo_sanctified_barrier` (Buff/Ward | 1 AP | 1 Sanctity | 30 ft): Grant an ally a 5-point radiant ward that absorbs necrotic or psychic damage.
- **Level 2 (4 Picks | ≥2 Non-Damage):**
  - `exo_cinder_leash` (Control/Damage | 2 AP | 1 Sanctity | 20 ft): Tether a target with glowing chain; deals 2d6 radiant and prevents moving further than 20 ft.
  - `exo_iron_barrier` (Buff | 1 AP | 1 Sanctity | Self): Gain +3 AC against fiends, undead, and void entities for 2 rounds.
  - `exo_anointing_oil` (Utility/Heal | 1 AP | 1 Sanctity | Touch): Heal 2d6 HP and suppress a curse for 1 hour.
  - `exo_litany_of_courage` (Buff | 1 AP | 0 Sanctity | 20 ft aura): Allies within 20 ft become immune to fear for 1 minute.
- **Level 3 (4 Picks | ≥2 Non-Damage):**
  - `exo_purge_the_defiled` (Damage | 2 AP | 2 Sanctity | 30 ft): 3d8 radiant damage; deals +2d8 bonus damage if the target is possessing another creature.
  - `exo_sever_leash` (Utility/Extraction | 2 AP | 2 Sanctity | Touch): Force a possessing entity or parasitic graft to detach from its host; host is knocked unconscious safely.
  - `exo_salt_perimeter` (Control | 2 AP | 2 Sanctity | 20 ft line): Lay a solid salt line across the ground; fiends and Wyrdkin cannot cross without making a DC 16 Will save.
  - `exo_sin_eater_burden` (Buff/Transference | 1 AP | 1 Sanctity | 30 ft): Transfer one debuff from an ally onto yourself; gain +2 Sanctity as compensation.
- **Level 4 (4 Picks | ≥2 Non-Damage):**
  - `exo_radiant_censer` (Damage/AoE | 2 AP | 2 Sanctity | 15 ft cloud): Heavy holy smoke dealing 2d6 radiant damage per turn to foes and blinding them.
  - `exo_lead_reliquary_trap` (Utility | 2 AP | 2 Sanctity | Touch): Trap an extracted spirit or parasite in an authored lead reliquary; permanently contains it.
  - `exo_sacred_fasting` (Buff | 1 AP | 0 Sanctity | Self): Immune to ingested poisons and disease for 24 hours.
  - `exo_rebuke_intruder` (Damage/Reaction | 1 AP | 2 Sanctity | 20 ft): Retaliate when an ally is targeted by an enchantment; deal 2d10 radiant and cancel the spell.
- **Level 5 (4 Picks | ≥2 Non-Damage):**
  - `exo_wrath_of_aethil` (Damage | 3 AP | 3 Sanctity | 30 ft column): 4d10 radiant column; all enemies inside must save or be blinded for 1 round.
  - `exo_mass_anointing` (Heal/Buff | 2 AP | 3 Sanctity | 20 ft burst): Heal all allies for 3d6 HP and cleanse one condition from each.
  - `exo_ward_of_the_immovable` (Control | 2 AP | 2 Sanctity | 15 ft radius): Zone where creatures cannot be teleported, banished, or forcibly moved.
  - `exo_penitents_mantle` (Buff | 1 AP | 2 Sanctity | Self): Convert 50% of all damage received over the next round into bonus Sanctity.
- **Level 6 (4 Picks | ≥2 Non-Damage):**
  - `exo_chains_of_chastisement` (Damage/Control | 2 AP | 3 Sanctity | 30 ft): 3d10 radiant damage; binds up to 2 targets, pulling them together.
  - `exo_hallowed_sanctuary` (Utility | 2 AP | 3 Sanctity | 30 ft): Create a 20 ft consecrated zone where undead and fiends cannot enter.
  - `exo_extract_corruption` (Utility/Heal | 2 AP | 3 Sanctity | Touch): Completely remove all rot, corruption, and necrotic infections from a target.
  - `exo_sacrificial_aegis` (Buff/Reaction | 1 AP | 3 Sanctity | 30 ft): Absorb 100% of a lethal blow aimed at an ally; take the damage yourself reduced by 50%.
- **Level 7 (4 Picks | ≥2 Non-Damage):**
  - `exo_shattering_anathema` (Damage | 3 AP | 4 Sanctity | 30 ft): 5d10 radiant damage; shatters demonic armor and reduces AC by 4 for 2 rounds.
  - `exo_circle_of_absolute_salt` (Control | 3 AP | 4 Sanctity | 20 ft circle): Impassable salt barrier lasting 3 rounds; no dark spells or creatures may cross.
  - `exo_purify_leyline` (Utility | 2 AP | 3 Sanctity | 50 ft): Cleanse all corrupted ground in a 50 ft area, restoring it to natural soil.
  - `exo_transfigured_vessel` (Buff | 2 AP | 4 Sanctity | Self): Radiate blinding light; gain +10 ft move, +3 AC, and melee attacks deal +2d8 radiant.
- **Level 8 (4 Picks | ≥2 Non-Damage):**
  - `exo_pillars_of_consecration` (Damage/AoE | 3 AP | 5 Sanctity | 40 ft): Summon 3 pillars of divine light dealing 4d10 radiant each in 10 ft bursts.
  - `exo_cleanse_the_bloodline` (Utility | 3 AP | 4 Sanctity | Touch): Purge deep-seated genetic or blood-borne curses from an entire family lineage.
  - `exo_immaculate_presence` (Buff | 2 AP | 4 Sanctity | Self): Immune to all necrotic, void, and psychic damage for 2 rounds.
  - `exo_smite_the_unclean` (Damage | 3 AP | 5 Sanctity | Melee): 6d10 radiant strike; banishes extraplanar targets with HP ≤ 40 instantly.
- **Level 9 (4 Picks | ≥2 Non-Damage):**
  - `exo_cataclysmic_exorcism` (Damage/Extraction | 3 AP | 6 Sanctity | 30 ft): 7d10 pure radiant damage to a possessed target; extracts entity into lead trap.
  - `exo_resurrection_of_the_cleansed` (Utility | 3 AP | 6 Sanctity | Touch): Revive a creature that died within 1 round of being possessed; restores to 50% HP.
  - `exo_aethils_celestial_shield` (Buff | 3 AP | 5 Sanctity | 30 ft aura): Allies within aura gain 30 temporary HP and complete condition immunity for 2 rounds.
  - `exo_scourge_of_judgment` (Damage | 3 AP | 5 Sanctity | 20 ft cone): 6d8 radiant damage in a wide cone; knocks all foes prone.
- **Level 10 (4 Picks | ≥2 Non-Damage):**
  - `exo_absolute_exile` (Damage/Banish | 3 AP | 8 Sanctity | 30 ft): 8d10 pure radiant damage; banishes any entity back to its home plane with no save.
  - `exo_the_great_cleansing` (Heal/AoE | 3 AP | 8 Sanctity | 50 ft radius): Fully heals all allies to maximum HP and cleanses every negative condition.
  - `exo_monument_of_salt` (Control/Instant Death | 3 AP | 8 Sanctity | 30 ft): Turns a corrupted target into a permanent statue of solid salt (Fortitude DC 20 negates).
  - `exo_sins_of_the_world` (Buff/Capstone | 3 AP | 10 Sanctity | Self): Become an avatar of purification for 3 rounds; deal maximum radiant damage on all actions.

### D. Talent Trees (3 Trees | 54 Nodes | 50 Points/Tree)
1. **Tree 1: `EXORCIST_LITURGIST` (Salt Circles & Area Sanctuary)**
   - *Nodes 1–16 (Passives, 46 pts):* Salt circle radius (+5 ft), ward capacity (+3), ally save bonus (+2), litany range (+10 ft), damage reflection.
   - *Node 17 (Signature Active | 2 pts):* `exo_sig_salt_sanctuary` (2 AP | 2 Sanctity | 15 ft radius): Consecrates ground; allies gain +4 DR and regenerate 5 HP/round.
   - *Node 18 (Capstone Active | 2 pts):* `exo_cap_aethils_immovable_bastion` (3 AP | 5 Sanctity | 20 ft dome): Impenetrable dome of radiant light for 2 rounds.
2. **Tree 2: `EXORCIST_SINEATER` (Host Protection & Transference)**
   - *Nodes 1–16 (Passives, 46 pts):* Condition absorption bonus (+2 Sanctity), damage mitigation when wounded, psychic resistance, self-healing on cleanse.
   - *Node 17 (Signature Active | 2 pts):* `exo_sig_sympathetic_transference` (1 AP | 2 Sanctity | 30 ft): Absorb all debuffs from 2 allies; heal allies for 3d8 HP.
   - *Node 18 (Capstone Active | 2 pts):* `exo_cap_vessel_of_pure_cleansing` (2 AP | 4 Sanctity | Self): Release absorbed sins in a 30 ft radiant nova dealing 6d10 damage.
3. **Tree 3: `EXORCIST_INQUISITORIAL_PURGER` (Entity Banishment & Scourge Combat)**
   - *Nodes 1–16 (Passives, 46 pts):* Scourge damage (+1d6), crit multiplier vs possessed (3x), lead seal speed, Will save DC (+2), radiant penetration.
   - *Node 17 (Signature Active | 2 pts):* `exo_sig_lead_seal_rite` (2 AP | 3 Sanctity | 20 ft): Trap an enemy's active spells inside a lead seal, preventing casting for 2 rounds.
   - *Node 18 (Capstone Active | 2 pts):* `exo_cap_total_anathema` (3 AP | 6 Sanctity | Melee): 7d10 radiant strike that severs all supernatural bonds on the target.

---

## 3. Dreadnaught (`dreadnaught`) Production Package

### A. Resource System Specification
- **Name:** Furnace Pressure
- **Range & Capacity:** 0 to 100 PSI (with 4 distinct tiers: 0–30 Idle, 31–60 Working, 61–90 Supercharged, 91–100 Overheat).
- **Starting Value:** 20 PSI.
- **Generation:**
  - +10 PSI when struck by an incoming physical attack.
  - +15 PSI when activating hydraulic steam servos.
  - +5 PSI at the start of your turn while in combat.
- **Threshold Effects:**
  - *31–60 PSI (Working):* +2 Damage Reduction against physical attacks.
  - *61–90 PSI (Supercharged):* +10 ft movement speed; melee strikes deal +1d6 fire/steam damage.
  - *91–100 PSI (Overheat):* Must vent within 1 round or suffer 2d6 internal fire damage.
- **Spending & Venting:** Spent to unleash explosive steam releases (`dread_steam_vent`), ground slams, and high-velocity piston charges.
- **Reset:** Drops to 10 PSI on short rest; 0 PSI on completed long rest (boiler extinguished).

### B. Core Class Features (2 Records)
1. `cr1_dreadnaught_stoke_furnace` (Core Action | 1 AP | Generates +20 PSI | Self): Shovel coal/fuel into the core firebox; generate 20 PSI and gain 5 temporary HP.
2. `cr1_dreadnaught_vent_steam` (Core Action/Reaction | 0 AP | Spends 30 PSI | 10 ft radius): Open boiler escape valves. Vent 30 PSI, creating a 10 ft scalding cloud that obscures vision and deals 2d6 fire damage to adjacent foes.

### C. Optional Spell Pools (Levels 1–10 | 40 Records)
- **Level 1:** `dread_iron_trample` (Damage/Charge | 2 AP | 15 PSI | 20 ft line | 2d8 bludgeoning), `dread_bedrock_cleats` (Buff | 1 AP | 0 PSI | Self | Immune to push/prone), `dread_steam_vent` (Damage/AoE | 1 AP | 25 PSI | 10 ft burst | 1d8 fire + blind), `dread_brace_impact` (Defend | 1 AP | 10 PSI | Self | +4 DR vs next attack).
- **Level 2:** `dread_hydraulic_slam` (Damage | 2 AP | 20 PSI | Melee | 2d10 crushing), `dread_pressure_surge` (Buff | 1 AP | 25 PSI | Self | +15 ft move), `dread_firebox_roar` (Debuff | 1 AP | 15 PSI | 15 ft cone | Demoralize foes), `dread_riveted_bulkhead` (Buff | 1 AP | 20 PSI | Self | +2 AC for 2 rounds).
- **Level 3:** `dread_piston_punch` (Damage | 2 AP | 25 PSI | Melee | 3d8 bludgeoning + 10 ft knockback), `dread_steam_shroud` (Utility/Concealment | 1 AP | 20 PSI | 15 ft radius), `dread_heavy_fortress_stance` (Stance | 1 AP | 0 PSI | Self | Cannot be moved, +6 DR), `dread_crushing_cleave` (Damage | 2 AP | 30 PSI | Melee 3 targets | 2d8 damage each).
- **Level 4:** `dread_boiler_eruption` (Damage/AoE | 3 AP | 40 PSI | 20 ft burst | 3d10 fire/bludgeoning), `dread_overdrive_pistons` (Buff | 1 AP | 30 PSI | Self | +1 extra attack), `dread_groven_shockwave` (Control | 2 AP | 25 PSI | 15 ft cone | Knock all targets prone), `dread_armor_recalibration` (Utility/Heal | 1 AP | 20 PSI | Self | Repair 2d8 armor HP).
- **Level 5:** `dread_cataclysmic_charge` (Damage | 3 AP | 50 PSI | 40 ft line | 4d10 crushing), `dread_steam_jet_burst` (Utility/Move | 1 AP | 35 PSI | 30 ft leap), `dread_molten_vent` (Damage | 2 AP | 40 PSI | 15 ft cone | 4d8 fire + ongoing burn), `dread_iron_citadel_brace` (Buff | 2 AP | 30 PSI | Self | Intercept all adjacent ally attacks).
- **Level 6:** `dread_seismic_pile_driver` (Damage | 3 AP | 45 PSI | Melee | 5d8 crushing + micro-quake), `dread_exhaust_hiss` (Control | 1 AP | 30 PSI | 20 ft radius | Silence audio/spells), `dread_boiler_overclock` (Buff | 2 AP | 50 PSI | Self | Maximize melee damage dice for 1 round), `dread_slag_spray` (Damage | 2 AP | 35 PSI | 20 ft cone | 3d8 fire + armor break -2 AC).
- **Level 7:** `dread_hydraulic_crush` (Damage | 3 AP | 50 PSI | Melee | 5d10 crushing; destroys nonmagical shields), `dread_impenetrable_plating` (Buff | 2 AP | 40 PSI | Self | Immune to critical hits for 3 rounds), `dread_steam_cyclone` (Damage/AoE | 3 AP | 55 PSI | 15 ft radius | 4d10 fire + pull foes), `dread_superheated_exhaust` (Reaction | 1 AP | 30 PSI | 10 ft | Retaliate against melee attacker).
- **Level 8:** `dread_titan_drop` (Damage/Leap | 3 AP | 60 PSI | 30 ft range | 6d10 crushing impact in 15 ft radius), `dread_volcanic_core_surge` (Buff | 2 AP | 50 PSI | Self | All attacks ignite targets for 2d8 fire), `dread_unyielding_monolith` (Buff | 2 AP | 40 PSI | Self | Cannot drop below 1 HP for 1 round), `dread_siege_breaker_hammer` (Damage | 3 AP | 60 PSI | Melee | 7d8 bludgeoning to structures/bosses).
- **Level 9:** `dread_supercritical_vent` (Damage/AoE | 3 AP | 80 PSI | 30 ft burst | 7d10 scalding fire/steam), `dread_juggernaut_apex` (Buff | 2 AP | 60 PSI | Self | Double movement, unstoppable trample), `dread_iron_fortress_shield` (Buff | 3 AP | 50 PSI | 30 ft wall | Wall of solid iron deployable for 3 rounds), `dread_pulverizing_strike` (Damage | 3 AP | 70 PSI | Melee | 8d10 crushing damage).
- **Level 10:** `dread_grand_engine_overload` (Damage/Capstone | 3 AP | 100 PSI | 40 ft explosion | 10d10 fire/concussion; resets PSI to 0), `dread_the_mountain_that_walks` (Buff | 3 AP | 80 PSI | Self | Size becomes Huge; +10 DR, +20 ft reach for 3 rounds), `dread_hydraulic_execution` (Damage | 3 AP | 90 PSI | Melee | 9d12 crushing damage; obliterates targets below 50 HP), `dread_perpetual_furnace` (Buff | 3 AP | 75 PSI | Self | Boiler generates +20 PSI per round automatically for 5 rounds).

### D. Talent Trees (3 Trees | 54 Nodes | 50 Points/Tree)
1. `DREADNAUGHT_SIEGE_BASTION` (Wall Defense & Hydraulic Cleats) — Signature: `dread_sig_bedrock_lock`; Capstone: `dread_cap_unbreakable_colossus`.
2. `DREADNAUGHT_FURNACE_ENGINE` (Steam Venting & Heat Dispersion) — Signature: `dread_sig_boiler_burst`; Capstone: `dread_cap_superheated_engine`.
3. `DREADNAUGHT_JUGGERNAUT_MOMENTUM` (Kinetic Trample & Heavy Impacts) — Signature: `dread_sig_piston_trample`; Capstone: `dread_cap_avalanche_of_iron`.

---

## 4. Inscriptor (`inscriptor`) Production Package

### A. Resource System Specification
- **Name:** Runic Resonance
- **Range & Capacity:** 0 to 10 Resonance.
- **Starting Value:** 0 Resonance.
- **Generation:** +1 Resonance when placing a rune; +2 Resonance when an etched rune triggers; +1 per turn while standing within an active runic triangle.
- **Spending:** Expended to activate latent glyphs, amplify detonation radius, and link multiple runes into geometric shock lattices.
- **Decay:** Drops by 1 point per 3 rounds without active rune placement.

### B. Core Features & Spells (Levels 1–10 Pools)
- **Core Grants:** `cr1_inscriptor_etch_rune` (1 AP | Carve an active rune on floor/wall within 15 ft), `cr1_inscriptor_detonate_runes` (1 AP | Detonate all marked runes within 40 ft).
- **Sample Progression Highlights:**
  - L1: `inscriptor_glyph_of_force` (Damage | 2d8), `inscriptor_warding_mark` (Buff | 5 HP shield), `inscriptor_read_slate` (Utility), `inscriptor_chalk_line` (Control).
  - L5: `inscriptor_runic_lattice` (Control | Triangulates 3 runes into an impassable shock perimeter), `inscriptor_arcane_inscription` (Buff | Weapons deal +1d8 force).
  - L10: `inscriptor_grand_syntactic_matrix` (Capstone AoE | 8d10 force explosion across all connected grid tiles).
- **Trees (54 nodes, 50 pts each):** `INSCRIPTOR_RUNEBINDER` (Surface Inscriptions), `INSCRIPTOR_ENCHANTER` (Gear Glyphs), `INSCRIPTOR_GLYPHWEAVER` (Floating Matrices).

---

## 5. Witch Doctor (`witchDoctor`) Production Package

### A. Resource System Specification
- **Name:** Bog Tallow (Reconciled from Voodoo Essence)
- **Range & Capacity:** 0 to 100 Tallow.
- **Starting Value:** 50 Tallow.
- **Generation:** +10 Tallow when drawing a blood/vitality sample; +15 Tallow per rest near a cauldron; +5 Tallow/turn while a target suffers from your poppets.
- **Spending:** Spent on molding wax poppets (20 Tallow), boiling herbs, and bone needle strikes.

### B. Core Features & Spells (Levels 1–10 Pools)
- **Core Grants:** `cr1_witch_doctor_mold_poppet` (1 AP | 20 Tallow | Bind an effigy to target within 40 ft), `cr1_witch_doctor_boil_herbs` (1 AP | Brew an antivenom/vital draught).
- **Sample Progression Highlights:**
  - L1: `witch_doctor_needle_prick` (1 AP | Melee/Poppet | 1d6 piercing + 1d6 poison), `witch_doctor_bog_poultice` (Heal | 2d6 HP), `witch_doctor_mask_stare` (Control), `witch_doctor_smoke_screen` (Utility).
  - L5: `witch_doctor_sympathetic_agony` (Reaction | Whenever Witch Doctor takes damage, bound target takes 100% of the damage), `witch_doctor_miasma_cloud` (AoE).
  - L10: `witch_doctor_curse_of_the_split_vessel` (Damage | Target takes double damage from all sources; 8d10 blight strike).
- **Trees (54 nodes, 50 pts each):** `WITCH_DOCTOR_HEXWEAVER` (Poppet Sympathy), `WITCH_DOCTOR_APOTHECARY` (Marsh Medicine), `WITCH_DOCTOR_MIASMA` (Toxic Cloud & Bane).

---

## 6. Bladedancer (`bladedancer`) Production Package

### A. Resource System Specification
- **Name:** Kinetic Momentum
- **Range & Capacity:** 0 to 10 Momentum (4 Tiers: Adagio 0–2, Andante 3–5, Allegro 6–8, Presto 9–10).
- **Starting Value:** 0 Momentum.
- **Generation:** +2 on melee hit; +2 on successful parry/dodge; +1 when moving ≥15 ft.
- **Decay:** -2 Momentum if stationary or no attack made on a turn.
- **Spending:** Expended on multi-strike flourishes and momentum-fueled evasion.

### B. Core Features & Spells (Levels 1–10 Pools)
- **Core Grants:** `cr1_bladedancer_flowing_step` (1 AP | Move 20 ft through enemy squares without provoking reactions), `cr1_bladedancer_twin_slash` (1 AP | Dual strike dealing 1d6 + 1d6 slashing).
- **Sample Progression Highlights:**
  - L1: `bladedancer_kinetic_dissection` (Damage | 2d8 slashing), `bladedancer_parry_riposte` (Reaction), `bladedancer_feint_step` (Utility), `bladedancer_blade_twirl` (Buff).
  - L5: `bladedancer_cyclone_flourish` (Damage AoE | Strike all adjacent foes for 3d8 slashing; gain +3 Momentum).
  - L10: `bladedancer_apex_of_perpetual_steel` (Flurry | 5 strikes dealing 2d10 each; momentum does not decay for 3 rounds).
- **Trees (54 nodes, 50 pts each):** `BLADEDANCER_FLOW_MASTER` (Tempo & Chaining), `BLADEDANCER_DUELIST` (Single-Combat Riposte), `BLADEDANCER_SHADOW_DANCER` (Acrobatic Flanking).

---

## 7. Totemist (`totemist`) Production Package

### A. Resource System Specification
- **Name:** Conduit Attunement (0–10) & Pylon Slots (Max 3 Active).
- **Starting Value:** 0 Attunement; 0/3 Active Pylons.
- **Generation:** +1 Attunement when an entity enters a pylon's 15 ft aura; +2 Attunement when a pylon absorbs an impact.
- **Spending:** Spent on elemental discharges and triangular resonance fields.

### B. Core Features & Spells (Levels 1–10 Pools)
- **Core Grants:** `cr1_totemist_place_conduit` (1 AP | Deploy a pylon token onto a grid tile within 20 ft; Durability = 3 × Level + Attunement), `cr1_totemist_reclaim_conduit` (1 AP | Break down a pylon, refunding 1 Attunement).
- **Sample Progression Highlights:**
  - L1: `totemist_stone_spike` (Damage | 1d8 smashing from pylon base), `totemist_hearth_ember` (Buff | 4 temp HP aura), `totemist_grounding_rod` (Utility), `totemist_lodestone_pull` (Control).
  - L5: `totemist_resonant_conduction` (Area Control | Electric vector between 2 pylons dealing 3d8 storm to anyone crossing).
  - L10: `totemist_pillar_of_the_world_root` (Capstone | Massive monolith erupting for 8d10 crushing damage and pinning targets).
- **Trees (54 nodes, 50 pts each):** `TOTEMIST_HEARTHKEEPER` (Restorative Pylons), `TOTEMIST_EARTHSHAPER` (Lithic Monoliths), `TOTEMIST_SKYBINDER` (Lightning Rod Conduction).
