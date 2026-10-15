# Isolated combat narration preview

## Open

From `D:\VTT\vtt-react`:

```powershell
node src/components/combat-narration-preview/preview.cjs
```

Open **http://127.0.0.1:4318**. Stop with Ctrl+C. Override the port with
`$env:NARRATION_PORT = '4319'` if needed. The launcher uses the installed
Webpack, Babel and React, compiles only this directory, and writes its tiny
bundle beneath `D:\AppData\Temp\opencode`. Restart it after source edits.
No production app or backend needs to run.

Choose one of the five scenarios. **Next fixture step** supplies the next authored
event; **Next banner** advances only presentation. **Send remaining fixtures**
demonstrates overflow. Use **Priority only** in history to find outcomes and
opportunities after a burst. Auto-advance is opt-in, at least 6.5 seconds per
banner (longer for long text); hover, keyboard focus, open details and a hidden
browser tab pause it. All supplied text stays in session history until restart,
scenario change or reload. Nothing is persisted.

The reaction area is a fixture-only stand-in. Buttons only update a local
selection sentence. The supplied countdown is editable display text: it does
not tick, disable controls or resolve a window, including at `0 s`.

## Reusable pieces / later adapter

`NarrationPresenter.jsx` exports the controlled presenter, `useNarration()` and
`PublicDetails`. `narration.css` is scoped to narration classes and reuses
`--adventure-*` theme tokens with local fallback values. The preview shell has
its own scoped stylesheet. Georgia is the offline fallback for the existing
Cinzel / Crimson Text font stacks; no external font request is made.

This **local input sketch is not a frozen server contract**:

```js
publish([{
  id: 'public-event-42',
  phase: 'outcome', // declaration | opportunity | response | unresolved | outcome
  accepted: true, // required for outcome; absent/false outcomes are discarded
  text: 'Ilsa’s riposte deals 4 slicing.',
  arithmetic: '5 rolled − 1 mitigation = 4 slicing.', // optional public text
  source: 'Publicly accepted result',                // optional public text
  important: true                                   // optional for declarations/responses
}]);
```

For `unresolved`, explicitly supply `certainty: 'pending'` or `'unknown'` and
neutral public text. No implicit pending-to-accepted transition exists. An
outcome with contradictory pending/unknown certainty is discarded even if
`accepted: true` is also supplied.
Outcome, opportunity and unresolved entries always have priority. IDs deduplicate
within this local session. Only whitelisted string display fields are copied;
actor payloads and sealed declarations are neither accepted nor inspected.
React renders strings as text, including arithmetic/source (no HTML/Markdown).

A later adapter can filter already accepted/publicly releasable events, choose
the phase and public prose, then call `publish`. It must supply confirmation
explicitly, preserve a new ID for a later confirmed result, and own authorization,
public-data selection, event correlation, reaction-window state and countdown
updates. The presenter cannot establish whether upstream prose is truly public
or semantically truthful. Never pass hidden data or optimistic success prose.

The banner uses normal document flow: reserve a narration slot above/beside the
real reaction area. It neither portals nor captures a full-screen pointer layer.
The preview demonstrates this separation at desktop and narrow widths. Countdown
values belong to the host reaction surface, not the narration queue. Advancing,
dismissing or pausing a banner has no gameplay callback.

### Queue policy

One current banner plus **at most four waiting banners**. Routine overflow is
counted into one concise summary after the queued banners. Priority arrivals
replace queued routine entries first. When all four waiting entries are priority,
additional priority events go directly to history with an explicit visible count.
Every supplied announcement remains in history, including grouped routine text.
This is bounded presentation, not a reliable delivery or persistence mechanism.

## Focused checks

From `D:\VTT\vtt-react`:

```powershell
$env:CI = 'true'
npm test -- --watchAll=false --runInBand --runTestsByPath src/components/combat-narration-preview/narration.test.jsx
```

For repeatable browser checks, keep the preview running and execute:

```powershell
node src/components/combat-narration-preview/verify-preview.cjs
```

Requires the project's existing Playwright package and an installed Google
Chrome. Optional `NARRATION_URL` points the check at a different preview port.

## Verification — 2026-10-15

- Isolated Webpack compilation succeeded; no application entry imported.
- Focused Jest: **1 suite / 5 tests passed** (queue saturation, important history,
  unknown/invalid/contradictory result refusal, public-field isolation, deduplication,
  literal text rendering, polite announcements and pause/cleanup behavior).
- Scoped ESLint: **0 errors / 0 warnings**. UI mechanical detector: **no findings**.
- Real Chrome 155: **all five scenarios passed; zero page errors**.
- Desktop **1440×1000**; mobile **390×844** and **320×740**: no horizontal overflow.
  Riposte's mobile button was hit-tested and clicked; narration does not cover it.
- Reduced-motion banner animation was verified off. A supplied `0 s` stayed
  unchanged and kept preview controls clickable. No result appeared before its
  explicitly confirmed fixture arrived.
- The 30-announcement burst retained all entries, including all five priority
  events; four waited, 24 routine entries grouped, one priority entry went
  directly to history. The grouped summary was checked after queue drainage.
- Browser network contained only the local page and bundle; local/session storage
  remained empty. Six screenshots were opened and visually inspected.
- Existing paper/ink/rule colors and serif stacks were compared against
  `item-notification.css`, `LootTab.jsx`, `adventurer-windows.css` and
  `calm-shared.css`; the preview extends that styling locally.

Evidence: [`evidence/verification.json`](evidence/verification.json) and
[`evidence/browser-snapshot.yml`](evidence/browser-snapshot.yml).

| Example | Screenshot |
| --- | --- |
| Routine accepted hit + arithmetic | [Desktop](evidence/desktop-routine.png) |
| Counterspell / interception response | [Desktop](evidence/desktop-response.png) |
| New Riposte opportunity + reachable controls | [Mobile](evidence/mobile-riposte.png) |
| Explicitly unknown outcome | [Desktop](evidence/desktop-unknown.png) |
| Bounded burst + full history | [Desktop](evidence/desktop-burst.png) |
| Long names and narrow layout | [Mobile](evidence/mobile-long-text.png) |

This is a component preview review, not P9 source acceptance or live combat
integration evidence. Screen-reader announcement markup was checked in DOM and
accessibility snapshots; spoken output was not manually tested with a screen reader.
