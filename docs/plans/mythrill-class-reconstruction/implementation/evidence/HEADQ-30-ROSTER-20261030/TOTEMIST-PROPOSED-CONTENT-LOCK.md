# Proposed Content Lock: Totemist Class Direction

> [!IMPORTANT]
> **STATUS: PROPOSED DESIGN — PENDING CREATOR APPROVAL**  
> This document establishes a formal proposed identity, resource model, talent framework, and progression structure for the **Totemist** class.  
> As established by Settled HeadQ Decisions, repository history contains **zero authored historical code or data modules** for Totemist. This proposal is newly authored and marked strictly as a proposal. It is NOT creator-approved canon and must NOT be wired into the live character creation selectors until approved by HeadQ.

---

## 1. Core Identity & Demarcation from Animist

A central constraint established by HeadQ is the absolute demarcation between **Animist** and **Totemist**:

| Feature / Dimension | Animist (Established Canon) | Totemist (Proposed Direction) |
|---|---|---|
| **Identity & Theme** | Spirit Summoner & Ancestral Voice; opens channels between the living and ancestral courts. | Territorial Architect & Conduit Sculptor; anchors primal elemental and terrestrial energies into physical carved effigies. |
| **Medium / Vector** | Internal communion, bone terraforming, spectral beasts, overtone chants, progressive spirit erosion (15+ Resonance). | Ground-anchored physical conduit pylons/effigies deployed onto the grid; resonance matrices between linked pillars. |
| **Battlefield Role** | Controller / Summoner (Bone Walls, Spirit Beasts, Ghost Curses). | Area Denial / Zone Engineer / Bulwark (Pylon Auras, Conductive Geometries, Conduit Harvest). |
| **Damage Types** | `primal`, `blight`, `storm` | `smashing`, `storm`, `primal` |
| **Resource** | **Resonance (0–20)** with Spirit Erosion thresholds. | **Totemic Attunement (0–10)** & **Conduit Slots (Max 3 Active)**. |
| **Cultural Roots** | Vreken and Deep-Ancestor communion; peat-bogs, ossuaries, ghost-mycelium bloodlines. | Crag-carvers, lithic runecrafters, standing-stone architects of the exposed highlands and storm-peaks. |

---

## 2. Resource System Proposal: Totemic Attunement & Conduit Pylons

### A. Mechanics Overview
- **Active Totems / Conduit Slots (Max 3):**
  The Totemist carries physical carved conduits (carved granite, storm-iron, petrified peat). Deploying a totem places a physical token/entity onto the grid with its own Durability (equal to 3× Level + Attunement).
- **Totemic Attunement (Scale 0–10):**
  Attunement measures the vibrational harmony between the Totemist and their active conduits:
  - Generates +1 Attunement whenever a creature enters or starts its turn within an active totem's aura.
  - Generates +2 Attunement when an active totem absorbs a qualifying impact or channels a spell.
  - Decays by 1 per turn if no conduits are active or engaged.
- **Harmonic Discharge:**
  Spending Attunement detonates, overcharges, or transposes active totems, triggering resonance waves across the geometric area between multiple totems.

---

## 3. Proposed Talent Tree Architecture (3 Trees × 50 Points)

### Tree 1: `TOTEMIST_HEARTHKEEPER` (Preservation & Restorative Conduits)
- **Role:** Defensive anchor, ally warding, vitality dispersion.
- **Key Concepts:**
  - *Tier 0 (Foundation):* **Sovereign Hearth** — Active totems emit a calming ward (allies within 15 ft gain temporary DR).
  - *Tier 1 (Harmonic Pulse):* **Soothing Cedar** — Conduits pulse restorative energy at turn start; Attunement can be spent to cleanse conditions.
  - *Tier 3 (Specialisation):* **Sympathetic Pylon** — Redirect a portion of damage suffered by nearby allies into the totem's durability pool.
  - *Tier 5 (Power):* **Sanctuary Resonator** — Link two totems to create a defensive threshold line that enemies cannot cross without paying 2 AP.
  - *Tier 7 (Capstone):* **The Eternal Hearthstone** — Once per encounter, anchoring this great conduit prevents ally death within its aura for 1 round.

### Tree 2: `TOTEMIST_EARTHSHAPER` (Lithic Disruption & Seismic Spikes)
- **Role:** Battlefield control, terrain deformation, physical crushing.
- **Key Concepts:**
  - *Tier 0 (Foundation):* **Granite Weight** — Placing a totem causes a micro-tremor, slowing adjacent enemies.
  - *Tier 1 (Seismic Line):* **Faultline Conduit** — Establish a seismic resonance between two totems; enemies crossing the vector take crushing damage.
  - *Tier 3 (Specialisation):* **Tectonic Anchor** — Totem locks surrounding terrain, making tiles difficult terrain for enemies while granting earth-anchored stability to allies.
  - *Tier 5 (Power):* **Spire Eruption** — Shatter an active totem to project a spray of jagged stone shrapnel in a 20 ft cone.
  - *Tier 7 (Capstone):* **Pillar of the World-Root** — Summon a massive monolithic pillar that erupts beneath targets, knocking them prone and pinning them to the earth.

### Tree 3: `TOTEMIST_SKYBINDER` (Storm Conduction & Gale Vortices)
- **Role:** Storm burst, lightning redirection, kinetic displacement.
- **Key Concepts:**
  - *Tier 0 (Foundation):* **Lightning Rod** — Storm-carved totem attracts lightning damage, neutralizing it or storing it as Attunement.
  - *Tier 1 (Static Arc):* **Arcing Needle** — When Totemist casts a storm spell, active totems duplicate a minor electric discharge to the nearest foe.
  - *Tier 3 (Specialisation):* **Gale Funnel** — Totem draws in local winds, pushing enemies away or pulling them toward the apex.
  - *Tier 5 (Power):* **Faraday Cage** — Triangulate 3 totems to electrify the enclosed triangular zone, dealing continuous storm damage.
  - *Tier 7 (Capstone):* **Tempest Beacon** — Call down a persistent storm pillar into the totem, turning it into a devastating orbital lightning turret for 3 rounds.

---

## 4. Spell Progression & Pool Proposal (Levels 1–10)

### Starting Grants & Level 1 Pool Proposal
- **Core Grants (Automatic, 0 Pick Cost):**
  1. `totemist_place_conduit` — 1 AP. Deploy an authored totem pylon within 20 ft (costs 1 Conduit Slot, maximum 3 active).
  2. `totemist_reclaim_conduit` — 1 AP. Break down an active totem within 30 ft, recovering 1 Attunement and freeing the slot.
- **Level 1 Optional Picks (Pick 1 of 4):**
  1. `totemist_hearth_ember` (Utility/Restorative): Conduit pulses gentle warmth, granting minor temporary HP.
  2. `totemist_stone_spike` (Damage/Smashing): Erupt sharp stone spikes from the base of a totem.
  3. `totemist_storm_attunement` (Damage/Storm): Charge a totem with static, shocking enemies that approach within 10 ft.
  4. `totemist_lodestone_pull` (Control/Utility): Magnetically drag an enemy 10 ft closer to an active totem.

### Progression Blueprint (Levels 2–10)
- Each subsequent level introduces 4 thematic options balancing defensive pylons, seismic manipulation, and lightning conduction.
- Fully adheres to the rule of **1 chosen optional per level** + core grants, with no random or automatic starter assignments.

---

## 5. Review & Approval Gate

- **Next Step:** Deliver this proposed content lock to Creator / HeadQ for mechanical and world-lore alignment.
- **Implementation Constraint:** No code files (`totemistData.js`, `talentTrees/totemist.js`) will be added to the live repository until this proposed content lock is formally approved by HeadQ.
