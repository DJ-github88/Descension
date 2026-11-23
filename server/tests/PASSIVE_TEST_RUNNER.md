# Passive Test Runner Instructions (`server/`)

## Execution Modes

1. **Ordinary server test mode (`npm test` / `npm run test:passive`)**
   - Runs without any test-only module loader (`--require tests/helpers/passiveActivationTestLoader.cjs` is **not** preloaded).
   - Executes all production-policy-enabled passive tests (`firstPlayablePassive.production.test.js`, `heightenedSenses.acceptance.test.js` for `one-copy-additive`, and live `heightenedSenses.control.test.js` controls) directly against the shipped `server/shared/services/passiveActivationPolicy.js`.
   - The 4 policy-swap engineering/control rows that genuinely require `passiveActivationTestLoader.cjs` detect its absence via `isPolicySwapLoaderActive()` and are marked **pending** with an explicit reason.
   - Optional `PASSIVE_PLAN_MODULE` and non-default `PASSIVE_STACKING` (`exclusive`, `both-copies`) rows remain **pending** unless their respective environment/loader setup is supplied.

2. **Required passive acceptance mode (`npm run test:passive:acceptance`)**
   - Runs `node tests/helpers/runPassiveAcceptance.cjs`, which preloads `--require tests/helpers/passiveActivationTestLoader.cjs` with `PASSIVE_APPROVED=1` and `PASSIVE_REQUIRE_TEST_LOADER=1`.
   - Executes every production-policy-enabled row, every `one-copy-additive` acceptance row, and all 4 loader-dependent policy-swap rows.
   - Fails with a nonzero exit code if the test-only loader is missing or if any required row fails or is skipped.

3. **Runner self-check (`npm run test:passive:verify-runner`)**
   - Runs `node tests/helpers/checkPassiveRunner.cjs` to prove:
     - ordinary mode has 0 setup-caused failures;
     - required mode executes all expected rows;
     - missing required setup exits nonzero;
     - a real assertion failure still exits nonzero.
