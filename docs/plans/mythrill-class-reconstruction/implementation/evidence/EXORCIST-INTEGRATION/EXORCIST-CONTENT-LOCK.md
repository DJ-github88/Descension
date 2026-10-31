# Exorcist (`exorcist`) Content Lock & Blueprint

**Date:** 2026-10-30  
**Status:** Locked for Production Integration  
**Class ID:** `exorcist`  
**Target Roster Number:** 25th Selectable Canonical Class  
**Standard Contract:** 2 Core Grants, 40 Optional Picks (4/level, levels 1–10, $\ge 2$ non-damage/level), 6 Talent Actives (3 Signatures, 3 Capstones), 48 Passives (16/tree across 3 trees), 54 Nodes (18/tree, 50 pts/tree) = **96 Unique Records**.

---

## 1. Class Identity, Role, & Tabletop Boundaries

### A. Identity & Flavor
- **Title:** The Exorcist
- **Subtitle:** Sacred Expeller, Host Protector, & Sin-Eater
- **Role:** Sacred Support / Host Defender / Anti-Fiend Expeller
- **Damage Types:** Radiant, Physical (Slashing, Bludgeoning), Force
- **Primary Attributes:** Spirit, Constitution, Will
- **Weapons & Armor:** Lead-weighted scourges, sanctified brand-irons, ritual censers, medium armor, salted linen vestments, and consecrated pouches.
- **Narrative Foundation:**
  - Sacred tradesman of purification and host protection.
  - Draws harmful supernatural taints out of vulnerable vessels and absorbs them through ritual sin-eating.
  - Sanctifies ground with coarse rock-salt lines and ringing brass bells to deny entry to malevolent entities.
  - Expels possessing spirits, fiends, and curses without destroying the mortal host.
- **Settled HeadQ Boundaries:**
  - **No Fiend Binding:** Exorcists do **not** bind demons, summon fiends, or maintain a "dominance leash" over evil spirits. Historical demon-binding proposals are explicitly rejected.
  - **Host Salvation:** Exorcists focus on saving the vessel, cleansing corruption, and casting out malevolence.
  - **Sin-Eating:** Sin-eating is an approved specialization where the Exorcist voluntarily takes on an ally's condition or affliction to neutralize it through personal spiritual endurance.

---

## 2. Resource System: Purification Sanctity

- **Scale & Limits:** 0 to 10 Sanctity (Hard Cap 10).
- **Starting Value:** 3 Sanctity (Base Prepared Rites).
- **Generation:**
  - +1 Sanctity per round spent inside a consecrated salt threshold.
  - +2 Sanctity when an ally within 25 ft succeeds on a save against a psychic, fear, charm, or possessing effect.
  - +3 Sanctity when successfully extracting an entity, transferring a debuff, or cleansing a condition.
- **Spending:** Expended to fuel litanies, sin-eating absorptions, and sacred salt boundaries.
- **Depletion Trade-Off:** At 0 Sanctity, spiritual shielding drops and the Exorcist suffers -2 to all Will saves against supernatural influence until Sanctity is regained.
- **Reset & Recovery:** Short rest restores to 3 Sanctity; long rest restores to 5 Sanctity.
- **Tabletop Boundary:** Manual tabletop resolution only. No automated damage consequences, auto-dispelling, or status clearing scripts.

---

## 3. Core Class Features (2 Records — Granted at Level 1)

1. `cr1_exorcist_consecrate_threshold` (Core Action | 1 AP | 0 Mana | Generates +1 Sanctity | 15 ft radius):
   Draw a rapid salt ring or pour consecrated ash along a doorway. Allies within gain +2 to saving throws against possession, fear, and psychic effects; hostile spirits and fiends suffer -10 ft movement upon entering.
2. `cr1_exorcist_litany_of_purging` (Core Action | 1 AP | 1 Sanctity | 30 ft range):
   Recite a focused rite of release toward an afflicted ally. Cleanses one active fear, charm, or psychic debuff, transferring the residual spiritual friction into ambient salt.

---

## 4. Optional Spell Pools (Levels 1–10 | 40 Records | $\ge 2$ Non-Damage / Level)

### Level 1 (4 Options | 2 Non-Damage)
- `exo_salt_brand` (Damage/Debuff | 1 AP | 1 Sanctity | 25 ft): 1d8 radiant damage; target takes +2 damage from all physical and holy attacks for 1 round.
- `exo_scourge_of_submission` (Damage | 1 AP | 0 Sanctity | Melee): 1d8 slashing + 1d4 radiant damage with a lead-weighted consecrated scourge.
- `exo_discern_impurity` (Utility | 1 AP | 0 Sanctity | 30 ft): Detect the presence, tier, and nature of possessing spirits, unseen specters, or psychic grafts.
- `exo_sanctified_barrier` (Buff/Ward | 1 AP | 1 Sanctity | 30 ft): Grant an ally a 5-point radiant ward that absorbs necrotic or psychic damage for 2 rounds.

### Level 2 (4 Options | 3 Non-Damage)
- `exo_cinder_leash` (Control/Damage | 2 AP | 1 Sanctity | 20 ft): Latch a glowing consecrated chain onto a foe; deals 2d6 radiant and prevents moving further than 20 ft.
- `exo_iron_barrier` (Buff | 1 AP | 1 Sanctity | Self): Gain +3 AC and +2 DR against fiends, undead, and void entities for 2 rounds.
- `exo_anointing_oil` (Utility/Heal | 1 AP | 1 Sanctity | Touch): Heal 2d6 HP and suppress an active curse for 1 hour.
- `exo_litany_of_courage` (Buff | 1 AP | 0 Sanctity | 20 ft aura): Allies within 20 ft gain advantage and +2 on saving throws against fear and horror for 1 minute.

### Level 3 (4 Options | 2 Non-Damage)
- `exo_purge_the_defiled` (Damage | 2 AP | 2 Sanctity | 30 ft): 3d8 radiant damage; deals +2d8 bonus damage if the target is possessing or controlling another creature.
- `exo_sever_possession` (Utility/Extraction | 2 AP | 2 Sanctity | Touch): Force a possessing entity or mental parasite to detach from its host; host is safely stabilized.
- `exo_salt_perimeter` (Control | 2 AP | 2 Sanctity | 20 ft line): Lay a solid salt line across the ground; fiends and undead cannot cross without making a DC 16 Spirit save.
- `exo_sin_eater_burden` (Buff/Transference | 1 AP | 1 Sanctity | 30 ft): Transfer one debuff from an ally onto yourself; gain +2 Sanctity from the spiritual absorption.

### Level 4 (4 Options | 2 Non-Damage)
- `exo_radiant_censer` (Damage/AoE | 2 AP | 2 Sanctity | 15 ft cloud): Swing a smoking bronze censer dealing 2d6 radiant damage per turn to foes and obscuring vision.
- `exo_lead_reliquary_trap` (Utility | 2 AP | 2 Sanctity | Touch): Trap an expelled spirit or spiritual taint inside a sealed lead reliquary to prevent manifestation.
- `exo_sacred_fasting` (Buff | 1 AP | 0 Sanctity | Self): Gain immunity to ingested poisons, mundane diseases, and nausea for 24 hours.
- `exo_rebuke_intruder` (Damage/Reaction | 1 AP | 2 Sanctity | 20 ft): Retaliate when an ally is targeted by mental domination; deal 2d10 radiant and grant the ally a reroll.

### Level 5 (4 Options | 2 Non-Damage)
- `exo_wrath_of_aethil` (Damage | 3 AP | 3 Sanctity | 30 ft column): 4d10 radiant light column; enemies inside must make a Spirit save or be blinded for 1 round.
- `exo_mass_anointing` (Heal/Buff | 2 AP | 3 Sanctity | 20 ft burst): Heal all allies within 20 ft for 3d6 HP and cleanse one negative condition from each.
- `exo_ward_of_the_immovable` (Control | 2 AP | 2 Sanctity | 15 ft radius): Zone where allies cannot be teleported, banished, or forcibly moved by spells.
- `exo_penitents_mantle` (Buff | 1 AP | 2 Sanctity | Self): Convert 50% of all damage received over the next round into bonus Sanctity (up to max cap).

### Level 6 (4 Options | 2 Non-Damage)
- `exo_chains_of_chastisement` (Damage/Control | 2 AP | 3 Sanctity | 30 ft): 3d10 radiant damage; binds up to 2 targets, pulling them 15 ft toward each other.
- `exo_hallowed_sanctuary` (Utility | 2 AP | 3 Sanctity | 30 ft): Create a 20 ft consecrated zone where undead and fiends cannot enter without taking 3d8 radiant damage per turn.
- `exo_extract_corruption` (Utility/Heal | 2 AP | 3 Sanctity | Touch): Completely remove all necrotic rot, biological corruption, and supernatural infections from a target.
- `exo_sacrificial_aegis` (Buff/Reaction | 1 AP | 3 Sanctity | 30 ft): Intercept a lethal blow aimed at an ally; take the damage yourself reduced by 50%.

### Level 7 (4 Options | 2 Non-Damage)
- `exo_shattering_anathema` (Damage | 3 AP | 4 Sanctity | 30 ft): 5d10 radiant damage; shatters supernatural armor, reducing target DR by 4 for 2 rounds.
- `exo_circle_of_absolute_salt` (Control | 3 AP | 4 Sanctity | 20 ft circle): Impassable consecrated salt barrier lasting 3 rounds; no spells or summoned entities may cross.
- `exo_purify_ground` (Utility | 2 AP | 3 Sanctity | 50 ft): Cleanse all corrupted or despoiled soil in a 50 ft area, restoring it to blessed earth.
- `exo_transfigured_vessel` (Buff | 2 AP | 4 Sanctity | Self): Radiate holy light; gain +10 ft movement speed, +3 AC, and melee attacks deal +2d8 radiant.

### Level 8 (4 Options | 2 Non-Damage)
- `exo_pillars_of_consecration` (Damage/AoE | 3 AP | 5 Sanctity | 40 ft): Summon 3 pillars of divine light dealing 4d10 radiant each in 10 ft bursts.
- `exo_cleanse_the_bloodline` (Utility | 3 AP | 4 Sanctity | Touch): Purge deep-seated genetic, ancestral, or blood-borne curses from an afflicted creature.
- `exo_immaculate_presence` (Buff | 2 AP | 4 Sanctity | Self): Gain immunity to all necrotic, void, and psychic damage for 2 rounds.
- `exo_smite_the_unclean` (Damage | 3 AP | 5 Sanctity | Melee): 6d10 radiant strike; banishes extraplanar targets with HP $\le 40$ immediately.

### Level 9 (4 Options | 2 Non-Damage)
- `exo_cataclysmic_exorcism` (Damage/Extraction | 3 AP | 6 Sanctity | 30 ft): 7d10 pure radiant damage to a possessed target; safely extracts the entity into a lead seal.
- `exo_resurrection_of_the_cleansed` (Utility | 3 AP | 6 Sanctity | Touch): Revive a creature that died within 1 round of being possessed; restores to 50% HP.
- `exo_celestial_shield` (Buff | 3 AP | 5 Sanctity | 30 ft aura): Allies within aura gain 30 temporary HP and complete condition immunity for 2 rounds.
- `exo_scourge_of_judgment` (Damage | 3 AP | 5 Sanctity | 20 ft cone): 6d8 radiant damage in a wide cone; knocks all foes prone.

### Level 10 (4 Options | 2 Non-Damage)
- `exo_absolute_exile` (Damage/Banish | 3 AP | 8 Sanctity | 30 ft): 8d10 pure radiant damage; banishes any entity back to its home plane with no save.
- `exo_the_great_cleansing` (Heal/AoE | 3 AP | 8 Sanctity | 50 ft radius): Fully heals all allies to maximum HP and cleanses every negative condition.
- `exo_monument_of_salt` (Control/Petrify | 3 AP | 8 Sanctity | 30 ft): Turns a corrupted target into a permanent statue of solid salt (Fortitude DC 20 negates).
- `exo_sins_of_the_world` (Buff/Avatar | 3 AP | 10 Sanctity | Self): Become an avatar of purification for 3 rounds; deal maximum radiant damage on all actions.

---

## 5. Talent Trees (3 Trees | 54 Nodes | 50 Points/Tree)

1. **Tree 1: Liturgist (`liturgist`) — Salt Circles & Area Sanctuary**
   - Focus: Expanding consecrated ground, boosting ward capacity, increasing litany ranges, and area denial.
   - *Signature (Level 3):* `exo_sig_salt_sanctuary` (2 AP | 2 Sanctity | 15 ft radius): Consecrates ground; allies gain +4 DR and regenerate 5 HP/round for 3 rounds.
   - *Capstone (Level 10):* `exo_cap_immovable_bastion` (3 AP | 5 Sanctity | 20 ft dome): Impenetrable dome of radiant light for 2 rounds; 1 long rest cooldown.
2. **Tree 2: Sin-Eater (`sineater`) — Host Protection & Transference**
   - Focus: Absorbing conditions from allies, damage mitigation through spiritual endurance, and cleansing backlash.
   - *Signature (Level 3):* `exo_sig_sympathetic_transference` (1 AP | 2 Sanctity | 30 ft): Absorb all debuffs from up to 2 allies; heal allies for 3d8 HP.
   - *Capstone (Level 10):* `exo_cap_vessel_of_pure_cleansing` (2 AP | 4 Sanctity | Self): Release absorbed sins in a 30 ft radiant nova dealing 6d10 damage; 1 long rest cooldown.
3. **Tree 3: Purger (`purger`) — Entity Banishment & Scourge Combat**
   - Focus: Scourge damage, lead seal placement, radiant penetration, and lethal banishment.
   - *Signature (Level 3):* `exo_sig_lead_seal_rite` (2 AP | 3 Sanctity | 20 ft): Place a lead seal on an enemy, preventing casting and supernatural actions for 2 rounds.
   - *Capstone (Level 10):* `exo_cap_total_anathema` (3 AP | 6 Sanctity | Melee): 7d10 radiant strike that severs all supernatural bonds on the target; 1 long rest cooldown.

---

## 6. Tabletop Quality & Boundaries
- All 96 records use `manualOnly: true`, `executionEnabled: false`, and `developmentStatus: 'development'`.
- Zero automated combat scripts, automated dispels, or consequence deductions.
