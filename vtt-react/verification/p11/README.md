# P11 verification

Contract: `docs/MYTHRILL_PROJECT_11_CONTRACT.md`.

## Jest (production components and stores, jsdom)

From `vtt-react/`, in bounded runs:

```text
npx react-scripts test --watchAll=false --runInBand --runTestsByPath \
  src/utils/__tests__/weaponProficiency.test.js \
  src/components/character-creation-wizard/context/__tests__/p11SkillBudgetValidation.test.js \
  src/store/__tests__/p11WeaponRanks.test.js \
  src/components/character-creation-wizard/steps/__tests__/Step7P11SkillBudget.test.jsx \
  src/components/character-sheet/__tests__/SkillsP11WeaponRanks.test.jsx
```

## Real browser

1. `node verification/p11/build-harness.cjs <outDir>` compiles `harness.jsx` (the real
   creation Skills step inside the real wizard provider, and the real sheet Skills panel
   with the real character/settings stores) into `<outDir>/harness.js`. The default
   output is `D:/AppData/Temp/opencode/p11-browser` — outside Git.
2. `node verification/p11/browser.cjs <outDir> <evidenceDir>` serves that bundle on
   loopback and drives it in Chromium (set `PLAYWRIGHT_MODULE` / `CHROMIUM_PATH` if
   Playwright or the browser is not on the default path).

Reload persistence in the harness goes through the real `assembleCharacterWorkingData`
→ `loadCharacter` path with a localStorage roster. It is not live Firebase, a second
device or the full App router; those remain environment gates.
