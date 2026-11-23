# Demo Play Sheet — The Sunken Shrine Skirmish (DEMO CONTENT)

> **Demo Content Notice:** All characters, creatures, relationships, and spells in this encounter are **disposable demo content** (`demo/frost-lantern-encounter/`). They do not alter canonical class or catalogue records.

## Cast & Setup
- **Ilse (Demo)** — Primary PC (`owner: app-owner`), Perception **NOVICE** (eligible for **Heightened Senses**), Agility 14 (`initiativeMod: +2`), `34/40 HP`, `50/60 Mana`, `30/40 AP`.
- **Mira (Demo)** — Second PC (`owner: app-ally`), wounded at `18/30 HP`. **Relationship:** `Ally` of Ilse.
- **Shade Stalker A** — Creature (`40/40 HP`). **Relationship:** `Enemy` of Ilse & Mira.
- **Shade Stalker B** — Creature (`30/30 HP`). **Relationship:** `Enemy` of Ilse & Mira.
- **Wounded Scout C** — Creature (`16/30 HP`). **Relationship:** `Ally` of Ilse & Mira.

### Demo Spells (authored in Spell Wizard, admitted via Spell Library)
1. **Demo Frost Grip** (`1 AP, 2 Mana`, Enemies only): `1d8+3` Direct Damage. Trigger: `Effect-specific` -> `Direct Damage` -> **Follow-up After My Damage**. Registered via Spellbook **Set up component watch** (`effects:direct` -> **Demo Echo Lance**).
2. **Demo Echo Lance** (`1 AP, 2 Mana`, Enemies only): `1d6+1` Direct Damage. Trigger: `Whole-spell` -> `Combat` -> **Follow-up After My Damage**.
3. **Demo Healing Lantern** (`2 AP, 1 Mana`, Allies only): `1d8+1` Immediate Healing.
4. **Demo Healing Echo** (`1 AP, 3 Mana`, Allies only): `1d8+1` Immediate Healing. Trigger: `Whole-spell` -> `Health, Resources & Death` -> **Follow-up After My Healing**.
5. **Demo Searing Frost** (`1 AP, 1 Mana`, Enemies only): `Control` -> `Composed effect` -> `Periodic damage` (`1d4` Arcane, `2` target-turn starts, label `Searing Frost`).

---

## Step-by-Step Play Actions

### 0. Set explicit relationships
- **GM view -> Right-click each creature token (`Shade Stalker A`, `Shade Stalker B`, `Wounded Scout C`) -> `Token Actions` -> `Recruit Companion…`:**
  1. Mark **Shade Stalker A** and **Shade Stalker B** as **Enemy** to both **Ilse (Demo)** and **Mira (Demo)**.
  2. Mark **Wounded Scout C** as **Ally** to both **Ilse (Demo)** and **Mira (Demo)**.
  *(Note: PC-to-PC relationship `Ilse <-> Mira` = `ally` has no rendered UI control and is seeded by `demo-server.cjs`.)*

### 1. GM activates Heightened Senses
- **GM view -> `Passive ability activation` panel:**
  1. Verify status shows `Stored — not active`.
  2. In `Target primary PC`, select **Ilse (Demo)**.
  3. Click **`Activate Heightened Senses (+2 initiative)`**.
  4. **Observe:** Both GM and Ilse panels update to `Active — +2 initiative`.

### 2. Start combat and enable Authenticated turn expiry
- **GM view -> `Combat Initiator`:**
  1. Select **Ilse (Demo)**, **Mira (Demo)**, **Shade Stalker A**, **Shade Stalker B**, and **Wounded Scout C**.
  2. Click **`Begin Combat (5)`**.
  3. **Observe:** Combat starts and the **`Combat tracker`** shows Ilse's initiative roll with `+4` total modifier (`+2` Agility + `+2` Heightened Senses).
  4. Click **`Shared turn expiry`** -> **`Enable authenticated turn expiry`**.

### 3. Open component-watch setup from Spellbook and register it
- **GM view -> `Spellbook` -> `Spell Library` -> `Demo Frost Grip`:**
  1. Click **`Set up component watch`** in the admission panel.
  2. Close Spellbook -> **`Follow-up trigger offers`** opens with `Guided setup: Component watch` preselected for `Demo Frost Grip`.
  3. Select **Ilse (Demo)** in `Watching primary PC` and **Demo Echo Lance** in `Follow-up spell B (offered)`, then click **`Register component watch`**.

### 4. Cast the component-watch spell at an eligible enemy and accept the paid follow-up
- **Ilse's view -> `Admitted abilities` -> `Use admitted ability` on `Demo Frost Grip` (`1 AP, 2 Mana`):**
  1. In the target picker, notice **Wounded Scout C** (`Ally`) is marked `ally (requires enemy)`; select **Shade Stalker A** (`Enemy`).
  2. Record physical roll and click **`Approve price and send to GM`**.
- **GM view -> Spell Consequence Confirmation:**
  1. Check adjudication, fill `Final damage`, and click **`Confirm`** / **`Accept`**.
  2. **Observe:** **Shade Stalker A** takes `1d8+3` direct damage, Ilse pays `1 AP, 2 Mana` once, and **`Follow-up trigger offers`** displays **Demo Echo Lance** for Ilse.
- **Ilse's view -> `Follow-up trigger offers` -> `Use this offer` on `Demo Echo Lance`:**
  1. Select **Shade Stalker B** (`Enemy`), record roll, click **`Approve`**, and GM confirms.
  2. **Observe:** **Shade Stalker B** takes `1d6+1` direct damage, Ilse pays `1 AP, 2 Mana` **once**, and the offer is consumed (no executable chain).

### 5. Heal an eligible ally and exercise the healing follow-up
- **GM view:** Revoke the component watch (`Revoke pairing`), open `Spell Library` -> `Demo Healing Echo` -> **`Set up follow-up`**, select **Ilse (Demo)**, and click **`Register follow-up pairing`**.
- **Ilse's view -> Cast `Demo Healing Lantern` (`2 AP, 1 Mana`) at `Wounded Scout C` (`16/30 HP`, `Ally`):**
  1. Enemies **A** and **B** are marked `enemy (requires ally)`.
  2. Approve and GM confirms -> **Wounded Scout C** heals `1d8+1` HP, and **Demo Healing Echo** offer appears.
- **Ilse's view -> `Use this offer` on `Demo Healing Echo` (`1 AP, 3 Mana`) at `Mira (Demo)` (`18/30 HP`, `Ally`):**
  1. Approve (Mira consents if prompted), GM confirms -> **Mira** heals `1d8+1` HP, Ilse pays `1 AP, 3 Mana` once, offer consumed.

### 6. Apply a supported ongoing effect and observe its tick/expiry display
- **Ilse's view -> Cast `Demo Searing Frost` (`1 AP, 1 Mana`) at `Shade Stalker A`:**
  1. Approve (no cast-time roll; ticks roll at resolution), GM enters `GM timing clarification`, checks confirmation, and confirms.
  2. GM advances turns via **`Shared turn expiry`** -> **`Advance authenticated turn`** until Tick 1 of 2.
  3. **Observe:** Both GM and Ilse **`Combat tracker`** -> **`Ongoing effects and cooldowns`** show `Searing Frost` with `1 of 2 target-turn tick remaining` and `Tick 1 of 2`.

### 7. Reload/rejoin during the encounter and continue
- Reload Ilse's browser page and rejoin the room.
- **Observe:** Ilse retains `Heightened Senses` (`Active`) and `Ongoing effects and cooldowns` (`1 of 2 target-turn tick remaining`).
- GM advances turns to the 2nd boundary -> both GM and Ilse observe `Tick 2 of 2 (last tick; effect ended)`.

### 8. End/restart combat with an approval pending
- **Ilse's view:** If opening an ability after reload prompts **`Use this owner attachment`**, click it to re-bind the tab's owner attachment. Start a cast of **Demo Frost Grip** at **Shade Stalker A** and click **`Approve`**, leaving it **pending GM confirmation**.
- **GM view -> `Combat tracker`:** Click **`End Combat`** without confirming -> pending approval is automatically closed/cleaned up without spending resources. Re-open **`Combat Initiator`** and click **`Begin Combat (5)`** to restart cleanly with zero leftover approvals.
