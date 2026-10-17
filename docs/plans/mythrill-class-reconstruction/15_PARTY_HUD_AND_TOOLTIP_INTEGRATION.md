# Party HUD, sheet, menus and tooltip integration

## Current data flow — CONFIRMED source

Personal `classResource` is restored/normalized in coreSlice or initialized on class change. resourceSlice applies domain updates, autosave and full-resource multiplayer sync. PartyHUD subscribes/projects the entire resource, passes it to ClassResourceBar, and supplies ownership/update callbacks. ClassResourceBar selects config/visual type and delegates class components; ResourceTooltip and per-class components split presentation responsibility. P9 accepted receipts update the owner class state/home through spellConsequenceService; this is separate from legacy manual socket resource updates.

`PartyHUD.jsx` is currently4,525 lines, `ClassResourceBar.jsx`1,982 and `ResourceTooltip.jsx`956 at inspected source. Extending their class-specific local state/prop matrices for a large roster would compound existing maintenance problems. Their historical demo local values are evidence of legacy controls, not a target resource source of truth.

## Proposed integration seam

1. One class/domain adapter derives `available`, `committed`, `secondary`, `activeEntities`, `warnings`, `summary`, `capabilities` and public/private presentation from canonical state. Fields are view semantics, not a new universal resource schema.
2. Existing ClassResourceBar hosts a small keyed renderer adapter. Each class owns SVG and domain menu. Retained class components can be wrapped incrementally; no sweeping rewrite of the current dispatch is required before prototypes.
3. Owner and authorized GM controls issue explicit typed intents through existing resource/authority owners. Observers receive read-only public projection. GM inspection permission is not permission for an unreviewed local write into another player's canonical home.
4. Pending intent overlays canonical state without replacing it. Resource loss/gain feedback follows accepted mutation only; unknown outcome stays checkable and locked.
5. Sheet and HUD use the same view-model/tooltip builders. Compact art differs from expanded layout, not from the underlying rules.

## Information allocation

| Surface | Must show |
|---|---|
| Compact HUD | Available/committed state, important secondary cost, current form/quarry/anchor, urgent invalidity, details button |
| Expanded resource menu | Full typed contents, linked entities, expiry, legal operations, pending command, manual-control provenance |
| Character sheet | Preparation/rest choices, persistent roster/forms/anchors, heritage and talent modifications, class method |
| Spell card | Exact resource requirements/cost/gain timing and effect support/manual diagnostic |
| Tooltip/details | What it is; how generated/spent; current benefits/costs; thresholds; risk; rest; active links/entities; talent/heritage changes |

Every class dossier must fill this allocation with actual fields. Current priority drafts do; remaining candidate apparatus/menus are incomplete.

## Ownership/privacy/recovery acceptance

- Another party member's view cannot spend, reset, draw, expose a private hand or issue a summon order.
- GM public summary has only authorized detail; private witness knowledge/cards aren't leaked in accessible names, CSS data attributes, logs or socket payloads.
- Two rapid operations against the same before revision cannot both spend one card/token/order. One accepts; the other revalidates with the same recorded outcome where applicable.
- Reconnect/hydration restores canonical state without rerunning animations, draws or gains. A retired class can still open its legacy menu and tooltip.
- Nested writes cannot overwrite normalization with a stale object. Remove the parallel nested direct-set path only under a scoped contract with Chronarch/Shaper regressions.
- Tooltip opens by keyboard/focus and touch; Escape/focus return work; the resource state is understandable without hover or color.

## Legacy compatibility scope

Do not delete old resource components merely because their class is retired. A resource alias resolves only inside its owning class/schema version; `souls` in Revenant currently means finite phylactery reserve, not Deathcaller command units. Keep retired compatibility data and visuals available until save/room migrations pass.
