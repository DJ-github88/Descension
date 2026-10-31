# Mythrill Class HeadQ — Dreadnaught Content-Lock Contract

**Date:** 2026-10-30  
**Status:** CREATOR-ALIGNED CONTENT LOCK  
**Class ID:** `dreadnaught`  
**Class Name:** Dreadnaught  
**Roster Position:** 26th Selectable Canonical Class (Restoration Cohort B)  
**Primary Attributes:** Strength, Constitution, Intelligence  
**Damage Types:** Fire, Bludgeoning, Physical  
**Resource System:** Furnace Pressure (0–100 PSI, default starting 20 PSI)  

---

## 1. Class Identity & Settled Boundary Constraints

1. **Independent Heavy Tank Fantasy:**
   - Groven troll-kin engineering, spinal boiler firebox, hydraulic servo pistons, steam venting, and bedrock grounding cleats.
   - Converts kinetic impacts and hydraulic motion into Furnace Pressure (0–100 PSI).
   - High pressure enhances damage reduction and melee kinetic punch; exceeding 90 PSI enters Overheat.
2. **Strict Demarcation from Martyr (`martyr`):**
   - HeadQ Settled Decision CD11 strictly isolates Dreadnaught from Martyr's fourth tree (`MARTYR_IRONCLAD`, IDs `icl_t1_*`–`icl_t7_*`).
   - Dreadnaught uses native `dread_*` and `cr1_dreadnaught_*` IDs.
   - Martyr remains 100% untouched.
3. **Manual Tabletop Boundary:**
   - All records marked `manualOnly: true`, `executionEnabled: false`, `developmentStatus: 'development'`.
   - Zero automated damage reduction application, automatic PSI buildup, or heat meltdown scripting.
   - Display guides and character sheet integration provide clear tabletop prompts for GMs and players.

---

## 2. 96-Record Inventory Contract

| Category | Count | Specifications |
|---|---|---|
| **Core Grants** | 2 | `cr1_dreadnaught_stoke_furnace` (1 AP, +20 PSI, 5 temp HP), `cr1_dreadnaught_vent_steam` (0 AP, -30 PSI, 10 ft scalding cloud) |
| **Optional Picks** | 40 | Levels 1–10, exactly 4 per tier, $\ge 2$ non-damage options per tier |
| **Talent Actives** | 6 | 3 Signatures (Tier 3 | 10 pts gate) + 3 Capstones (Tier 7 | 45 pts gate) |
| **Talent Passives** | 48 | 16 passives per tree across 3 trees (54 nodes total, 150 points rank capacity) |
| **Total Records** | **96** | All discrete, validated, manual-tabletop records |

---

## 3. Talent Trees Architecture

1. **Tree 1: Siege Bastion (`siegebastion` / `sb`)**
   - Focus: Wall defense, bedrock cleats, stance locking, ally protection, structural reinforcement.
   - Signature: `dread_sig_bedrock_lock` (1 AP, 15 PSI, stance, +4 DR, immune to push/prone).
   - Capstone: `dread_cap_unbreakable_colossus` (3 AP, 50 PSI, +10 DR, creates impenetrable fortress perimeter).
2. **Tree 2: Furnace Engine (`furnaceengine` / `fe`)**
   - Focus: Boiler combustion, steam venting, superheated exhausts, thermal burst damage.
   - Signature: `dread_sig_boiler_burst` (2 AP, 30 PSI, 15 ft scald burst, blind foes).
   - Capstone: `dread_cap_superheated_engine` (3 AP, 60 PSI, thermal overdrive, maximum damage scaling).
3. **Tree 3: Juggernaut Momentum (`juggernaut` / `jg`)**
   - Focus: Hydraulic piston charges, concussive slams, knockdowns, terrain demolition.
   - Signature: `dread_sig_piston_trample` (2 AP, 25 PSI, 20 ft charge line, knock foes prone).
   - Capstone: `dread_cap_avalanche_of_iron` (3 AP, 70 PSI, unstoppable multi-target crushing charge).

---

## 4. Resource Mechanics (Furnace Pressure)

- **Scale:** 0 to 100 PSI (starts at 20 PSI).
- **Tiers:**
  - `0–30 PSI (Idle)`: Standard baseline.
  - `31–60 PSI (Working)`: +2 Damage Reduction against physical attacks.
  - `61–90 PSI (Supercharged)`: +10 ft movement speed; melee strikes deal +1d6 fire/steam damage.
  - `91–100 PSI (Overheat)`: Overheat warning; must vent within 1 round or suffer 2d6 self fire damage.
- **Short Rest:** Drops to 10 PSI.
- **Long Rest:** Drops to 0 PSI (boiler extinguished).
