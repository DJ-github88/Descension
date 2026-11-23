'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { WORKSPACE_ROOT } = require('./preflight-pair.cjs');

const PRELOAD_PATH = path.join(__dirname, 'isolation-preload.cjs');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function readJsonSafe(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (_) {
    return null;
  }
}

function createJunction(target, linkPath) {
  ensureDir(path.dirname(linkPath));
  if (fs.existsSync(linkPath)) {
    const stat = fs.lstatSync(linkPath);
    if (stat.isSymbolicLink()) {
      fs.unlinkSync(linkPath);
    } else {
      return;
    }
  }
  fs.symlinkSync(target, linkPath, 'junction');
}

function prepareVirtualStage(preflight) {
  const { serverInfo, outputDir } = preflight;
  if (serverInfo.layout === 'stage-root') {
    return {
      effectiveStageRoot: serverInfo.stageRoot,
      virtualized: false,
      cleanup: () => {}
    };
  }

  const virtualRoot = path.join(outputDir, 'isolated-tmp', 'virtual-stage');
  ensureDir(virtualRoot);
  ensureDir(path.join(virtualRoot, 'vtt-react'));
  ensureDir(path.join(virtualRoot, 'vtt-react', 'src'));

  const links = [];
  const link = (target, dst) => {
    if (fs.existsSync(target)) {
      createJunction(target, dst);
      links.push(dst);
    }
  };

  link(serverInfo.serverDir, path.join(virtualRoot, 'server'));

  const sharedServices = path.join(serverInfo.serverDir, 'shared', 'services');
  link(sharedServices, path.join(virtualRoot, 'vtt-react', 'src', 'services'));

  const publicCandidate = fs.existsSync(path.join(serverInfo.stageRoot, 'vtt-react', 'public'))
    ? path.join(serverInfo.stageRoot, 'vtt-react', 'public')
    : path.join(WORKSPACE_ROOT, 'vtt-react', 'public');
  link(publicCandidate, path.join(virtualRoot, 'vtt-react', 'public'));

  const nodeModulesCandidate = fs.existsSync(path.join(serverInfo.stageRoot, 'vtt-react', 'node_modules'))
    ? path.join(serverInfo.stageRoot, 'vtt-react', 'node_modules')
    : path.join(WORKSPACE_ROOT, 'vtt-react', 'node_modules');
  link(nodeModulesCandidate, path.join(virtualRoot, 'vtt-react', 'node_modules'));

  const verificationCandidate = fs.existsSync(path.join(serverInfo.stageRoot, 'vtt-react', 'verification'))
    ? path.join(serverInfo.stageRoot, 'vtt-react', 'verification')
    : path.join(WORKSPACE_ROOT, 'vtt-react', 'verification');
  link(verificationCandidate, path.join(virtualRoot, 'vtt-react', 'verification'));

  return {
    effectiveStageRoot: virtualRoot,
    virtualized: true,
    cleanup: () => {
      for (const dst of links.reverse()) {
        try {
          if (fs.existsSync(dst) && fs.lstatSync(dst).isSymbolicLink()) {
            fs.unlinkSync(dst);
          }
        } catch (_) {}
      }
    }
  };
}

function writeBuildIdentityFixture(appInfo, serverInfo, filePath) {
  ensureDir(path.dirname(filePath));
  const payload = {
    stageDir: serverInfo.stageRoot,
    buildDir: appInfo.buildDir,
    indexHtml: appInfo.indexHtmlSha256,
    assetManifest: appInfo.assetManifestSha256,
    mainJs: appInfo.mainJs ? { file: appInfo.mainJs.file, sha256: appInfo.mainJs.sha256 } : null,
    mainCss: appInfo.mainCss ? { file: appInfo.mainCss.file, sha256: appInfo.mainCss.sha256 } : null
  };
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
  return filePath;
}

function buildWitnessPlan(preflight, options = {}) {
  const { capabilities, appInfo, serverInfo, outputDir } = preflight;
  const { effectiveStageRoot } = options.virtualStage;
  const label = options.label || 'release-verify';
  const tasks = [];

  for (const cap of capabilities) {
    if (cap === 'player-journey') {
      const evidenceDir = path.join(outputDir, 'evidence', 'player-journey');
      tasks.push({
        id: 'player-journey-17step',
        capability: 'player-journey',
        title: '17-step Player Wizard + Private GM Review Acceptance Journey',
        scriptPath: path.join(WORKSPACE_ROOT, 'vtt-react/verification/player-wizard-gm-review/accept-journey.cjs'),
        evidenceDir,
        resultPath: path.join(evidenceDir, 'result.json'),
        progressPath: path.join(evidenceDir, 'progress.json'),
        redirectWorkspaceSrc: false,
        redirectEvidenceFrom: null,
        env: {
          STAGE_ROOT: effectiveStageRoot,
          APP_BUILD_DIR: appInfo.buildDir,
          EVIDENCE_DIR: evidenceDir,
          VERDICT_LABEL: `${label}-player-journey`
        }
      });
    } else if (cap === 'dice-recast') {
      const diceSubcheck = String(options.diceSubcheck || 'parity').toLowerCase();
      const parityEvidence = path.join(outputDir, 'evidence', 'dice-recast');
      tasks.push({
        id: 'dice-recast-parity',
        capability: 'dice-recast',
        title: 'Physical/Digital Dice Parity & Installed Recast Journey',
        scriptPath: path.join(WORKSPACE_ROOT, 'handoff/dice-coin-playtest-candidate-20261122/journey/physical-dice-recast-journey.cjs'),
        evidenceDir: parityEvidence,
        resultPath: path.join(parityEvidence, 'result.json'),
        progressPath: null,
        redirectWorkspaceSrc: false,
        redirectEvidenceFrom: path.join(WORKSPACE_ROOT, 'handoff/dice-coin-playtest-candidate-20261122/evidence'),
        env: {
          ISOLATED_STAGE_ROOT: effectiveStageRoot,
          STAGE_ROOT: effectiveStageRoot,
          APP_BUILD_DIR: appInfo.buildDir
        }
      });

      if (diceSubcheck === 'all' || diceSubcheck === 'd100-coin') {
        const subEvidence = path.join(outputDir, 'evidence', 'dice-recast-d100-coin');
        tasks.push({
          id: 'dice-recast-d100-coin',
          capability: 'dice-recast',
          title: 'd100 Threshold & Fair Coin Flip Recast Journey',
          scriptPath: path.join(WORKSPACE_ROOT, 'handoff/dice-coin-playtest-candidate-20261122/journey/d100-boundary-and-coin-recast-journey.cjs'),
          evidenceDir: subEvidence,
          resultPath: path.join(subEvidence, 'result.json'),
          progressPath: null,
          redirectWorkspaceSrc: false,
          redirectEvidenceFrom: path.join(WORKSPACE_ROOT, 'handoff/dice-coin-playtest-candidate-20261122/evidence/random-outcome'),
          env: {
            ISOLATED_STAGE_ROOT: effectiveStageRoot,
            STAGE_ROOT: effectiveStageRoot,
            APP_BUILD_DIR: appInfo.buildDir
          }
        });
      }

      if (diceSubcheck === 'all' || diceSubcheck === 'wound-surge') {
        const subEvidence = path.join(outputDir, 'evidence', 'dice-recast-wound-surge');
        tasks.push({
          id: 'dice-recast-wound-surge',
          capability: 'dice-recast',
          title: 'Formula Stale Reapproval & Cross-Spell Non-Bypass Journey',
          scriptPath: path.join(WORKSPACE_ROOT, 'handoff/dice-coin-playtest-candidate-20261122/journey/wound-surge-reapproval-and-nonbypass-journey.cjs'),
          evidenceDir: subEvidence,
          resultPath: path.join(subEvidence, 'result.json'),
          progressPath: null,
          redirectWorkspaceSrc: false,
          redirectEvidenceFrom: path.join(WORKSPACE_ROOT, 'handoff/dice-coin-playtest-candidate-20261122/evidence/wound-surge'),
          env: {
            ISOLATED_STAGE_ROOT: effectiveStageRoot,
            STAGE_ROOT: effectiveStageRoot,
            APP_BUILD_DIR: appInfo.buildDir
          }
        });
      }
    } else if (cap === 'channels') {
      const channelSubcheck = String(options.channelSubcheck || 'ally-healing').toLowerCase();
      const identityFile = writeBuildIdentityFixture(
        appInfo,
        serverInfo,
        path.join(outputDir, 'isolated-tmp', 'channels-build-identity.json')
      );
      const evidenceDir = path.join(outputDir, 'evidence', 'channels');
      tasks.push({
        id: 'channels-ally-healing',
        capability: 'channels',
        title: 'Channeled Ally Healing, Tick Resolution & Range Interruption Journey',
        scriptPath: path.join(WORKSPACE_ROOT, 'handoff/channeled-ally-healing-isolated-20261122/journey/prove-channeled-ally-healing.cjs'),
        evidenceDir,
        resultPath: path.join(evidenceDir, 'result.json'),
        progressPath: null,
        redirectWorkspaceSrc: false,
        redirectEvidenceFrom: null,
        env: {
          ISOLATED_STAGE_ROOT: effectiveStageRoot,
          STAGE_ROOT: effectiveStageRoot,
          APP_BUILD_DIR: appInfo.buildDir,
          EVIDENCE_DIR: evidenceDir,
          BUILD_IDENTITY_PATH: identityFile
        }
      });

      if (channelSubcheck === 'all' || channelSubcheck === 'arcane-beam-recast') {
        const subEvidence = path.join(outputDir, 'evidence', 'channels-arcane-beam-recast');
        tasks.push({
          id: 'channels-arcane-beam-recast',
          capability: 'channels',
          title: 'Arcane Beam Completion & Same-Page Recast Control',
          scriptPath: path.join(WORKSPACE_ROOT, 'handoff/channeled-ally-healing-isolated-20261122/journey/prove-arcane-beam-recast.cjs'),
          evidenceDir: subEvidence,
          resultPath: path.join(subEvidence, 'result.json'),
          progressPath: null,
          redirectWorkspaceSrc: false,
          redirectEvidenceFrom: null,
          env: {
            ISOLATED_STAGE_ROOT: effectiveStageRoot,
            STAGE_ROOT: effectiveStageRoot,
            APP_BUILD_DIR: appInfo.buildDir,
            EVIDENCE_DIR: subEvidence
          }
        });
      }

      if (channelSubcheck === 'all' || channelSubcheck === 'arcane-beam-interruption') {
        const subEvidence = path.join(outputDir, 'evidence', 'channels-arcane-beam-interruption');
        tasks.push({
          id: 'channels-arcane-beam-interruption',
          capability: 'channels',
          title: 'Arcane Beam Out-of-Range Interruption Control',
          scriptPath: path.join(WORKSPACE_ROOT, 'handoff/channeled-ally-healing-isolated-20261122/journey/prove-arcane-beam-interruption.cjs'),
          evidenceDir: subEvidence,
          resultPath: path.join(subEvidence, 'result.json'),
          progressPath: null,
          redirectWorkspaceSrc: false,
          redirectEvidenceFrom: null,
          env: {
            ARCANE_BEAM_STAGE_ROOT: effectiveStageRoot,
            ARCANE_BEAM_BUILD_DIR: appInfo.buildDir,
            EVIDENCE_DIR: subEvidence,
            BUILD_IDENTITY_PATH: identityFile
          }
        });
      }
    } else if (cap === 'passives') {
      const stageTurn = path.join(effectiveStageRoot, 'vtt-react/verification/passive-turn-boundary/verify-browser.cjs');
      const stageEntry = path.join(effectiveStageRoot, 'vtt-react/verification/passive-movement-entry/verify-browser.cjs');
      const turnScript = fs.existsSync(stageTurn)
        ? stageTurn
        : path.join(WORKSPACE_ROOT, 'vtt-react/verification/passive-turn-boundary/verify-browser.cjs');
      const entryScript = fs.existsSync(stageEntry)
        ? stageEntry
        : path.join(WORKSPACE_ROOT, 'vtt-react/verification/passive-movement-entry/verify-browser.cjs');

      const turnOut = path.join(outputDir, 'evidence', 'passives-turn-boundary');
      tasks.push({
        id: 'passives-turn-boundary',
        capability: 'passives',
        title: 'Passive Own-Turn Boundary Witness (authored-passive-turn:v1)',
        scriptPath: turnScript,
        evidenceDir: turnOut,
        resultPath: path.join(turnOut, 'result.json'),
        progressPath: path.join(turnOut, 'progress.json'),
        redirectWorkspaceSrc: true,
        redirectEvidenceFrom: null,
        env: {
          PASSIVE_TURN_OUTPUT: turnOut,
          APP_BUILD_DIR: appInfo.buildDir
        }
      });

      const entryOut = path.join(outputDir, 'evidence', 'passives-movement-entry');
      tasks.push({
        id: 'passives-movement-entry',
        capability: 'passives',
        title: 'Passive Movement-Entry Radius Witness (authored-passive-entry:v1)',
        scriptPath: entryScript,
        evidenceDir: entryOut,
        resultPath: path.join(entryOut, 'result.json'),
        progressPath: path.join(entryOut, 'progress.json'),
        redirectWorkspaceSrc: true,
        redirectEvidenceFrom: null,
        env: {
          PASSIVE_ENTRY_OUTPUT: entryOut,
          APP_BUILD_DIR: appInfo.buildDir
        }
      });
    }
  }

  return tasks;
}

const ENV_FAILURE_PATTERNS = [
  /Cannot find module/i,
  /ERR_MODULE_NOT_FOUND/,
  /MODULE_NOT_FOUND/,
  /EADDRINUSE/,
  /EACCES/,
  /ENOENT/,
  /browserType\.launch/i,
  /Executable doesn't exist/i,
  /Isolated stage missing/i,
  /Stage root missing/i,
  /App build missing/i,
  /Missing required module/i,
  /SHA-256 mismatch/i,
  /Failed to resolve/i
];

function extractWitnessOutcome(task, execResult) {
  const resultJson = readJsonSafe(task.resultPath);
  const progressJson = task.progressPath ? readJsonSafe(task.progressPath) : null;
  const payload = resultJson || progressJson;
  const stderr = execResult.stderr || '';
  const stdout = execResult.stdout || '';
  const combinedLogs = `${stderr}\n${stdout}`;

  const passed = Boolean(execResult.exitCode === 0 && payload && payload.passed === true);

  let checks = [];
  if (payload) {
    if (Array.isArray(payload.steps)) {
      checks = payload.steps.map((step, idx) => ({
        id: step.id || `step_${idx + 1}`,
        index: step.index ?? idx + 1,
        actor: step.actor || null,
        description: step.description || step.step || step.id || `Step ${idx + 1}`,
        passed: 'passed' in step ? Boolean(step.passed) : Boolean(payload.passed),
        error: step.error || null
      }));
    } else if (payload.steps && typeof payload.steps === 'object' && !Array.isArray(payload.steps)) {
      checks = Object.entries(payload.steps).map(([id, val], idx) => ({
        id,
        index: idx + 1,
        actor: null,
        description: id,
        passed: val && typeof val === 'object' && 'passed' in val ? Boolean(val.passed) : Boolean(payload.passed),
        error: val && val.error ? val.error : null
      }));
    } else if (payload.checks && typeof payload.checks === 'object' && !Array.isArray(payload.checks)) {
      checks = Object.entries(payload.checks).map(([id, val], idx) => ({
        id,
        index: idx + 1,
        actor: null,
        description: id,
        passed: val && typeof val === 'object' && 'passed' in val ? Boolean(val.passed) : Boolean(payload.passed),
        error: val && val.error ? val.error : null
      }));
    }
  }

  if (passed) {
    return {
      id: task.id,
      capability: task.capability,
      title: task.title,
      scriptPath: task.scriptPath,
      passed: true,
      failureCategory: 'NONE',
      exitCode: execResult.exitCode,
      durationMs: execResult.durationMs,
      checks,
      firstPlayerVisibleFailure: null,
      environmentError: null,
      evidenceDir: task.evidenceDir,
      resultPath: fs.existsSync(task.resultPath) ? task.resultPath : null,
      stdoutLogPath: execResult.stdoutLogPath,
      stderrLogPath: execResult.stderrLogPath,
      networkRefusals: payload?.networkRefusals || []
    };
  }

  // Classify environment failure vs gameplay failure cleanly.
  const firstBroken = payload?.firstBrokenStep || null;
  const failedCheck = checks.find((c) => c.passed === false) || null;
  const completedCount = checks.filter((c) => c.passed).length;
  const timeoutMsg = execResult.timedOut
    ? `Witness timed out after ${execResult.timeoutMs || 25 * 60 * 1000}ms (${completedCount}/${checks.length} checks/steps completed before timeout)`
    : null;
  const rawErrMsg =
    timeoutMsg ||
    firstBroken?.error ||
    failedCheck?.error ||
    (typeof payload?.error === 'string' ? payload.error : payload?.error?.message) ||
    (typeof payload?.failure === 'string' ? payload.failure.split(/\r?\n/)[0] : null) ||
    stderr.trim().split(/\r?\n/).find((l) => l.trim()) ||
    `Process exited with code ${execResult.exitCode}`;

  const startedGameplay = Boolean(
    firstBroken ||
    failedCheck ||
    (Array.isArray(payload?.steps) && payload.steps.length > 0) ||
    (payload?.steps && !Array.isArray(payload.steps) && Object.keys(payload.steps).length > 0) ||
    (payload?.checks && Object.keys(payload.checks).length > 0) ||
    payload?.failureSnapshot
  );

  const matchesEnvPattern = ENV_FAILURE_PATTERNS.some((re) => re.test(rawErrMsg) || re.test(combinedLogs));
  const isEnvFailure = execResult.timedOut || !payload || (!startedGameplay && matchesEnvPattern) || (!startedGameplay && !firstBroken);

  const failureCategory = isEnvFailure ? 'ENVIRONMENT_FAILURE' : 'GAMEPLAY_FAILURE';
  const firstPlayerVisibleFailure = !isEnvFailure
    ? {
        witnessId: task.id,
        capability: task.capability,
        stepId: firstBroken?.id || failedCheck?.id || null,
        stepIndex: firstBroken?.index ?? failedCheck?.index ?? null,
        actor: firstBroken?.actor || failedCheck?.actor || null,
        description: firstBroken?.description || failedCheck?.description || task.title,
        message: rawErrMsg,
        before: firstBroken?.before || null,
        after: firstBroken?.after || null
      }
    : null;

  return {
    id: task.id,
    capability: task.capability,
    title: task.title,
    scriptPath: task.scriptPath,
    passed: false,
    failureCategory,
    exitCode: execResult.exitCode,
    timedOut: execResult.timedOut,
    durationMs: execResult.durationMs,
    checks,
    firstPlayerVisibleFailure,
    environmentError: isEnvFailure ? rawErrMsg : null,
    evidenceDir: task.evidenceDir,
    resultPath: fs.existsSync(task.resultPath) ? task.resultPath : (task.progressPath && fs.existsSync(task.progressPath) ? task.progressPath : null),
    stdoutLogPath: execResult.stdoutLogPath,
    stderrLogPath: execResult.stderrLogPath,
    networkRefusals: payload?.networkRefusals || []
  };
}

function runWitnessTask(task, preflight, options = {}) {
  const { outputDir } = preflight;
  const logsDir = ensureDir(path.join(outputDir, 'logs'));
  ensureDir(task.evidenceDir);
  const isolatedTmp = ensureDir(path.join(outputDir, 'isolated-tmp', task.id));

  const stdoutLogPath = path.join(logsDir, `${task.id}.stdout.log`);
  const stderrLogPath = path.join(logsDir, `${task.id}.stderr.log`);
  const stdoutStream = fs.createWriteStream(stdoutLogPath, { flags: 'w' });
  const stderrStream = fs.createWriteStream(stderrLogPath, { flags: 'w' });

  const timeoutMs = Number(options.timeoutMs) > 0
    ? Number(options.timeoutMs)
    : (Number(process.env.RELEASE_VERIFY_TIMEOUT_MS) > 0 ? Number(process.env.RELEASE_VERIFY_TIMEOUT_MS) : 25 * 60 * 1000);
  const childEnv = {
    ...process.env,
    ...task.env,
    RELEASE_VERIFY_STAGE_ROOT: options.virtualStage.effectiveStageRoot,
    RELEASE_VERIFY_SERVER_DIR: preflight.serverInfo.serverDir,
    RELEASE_VERIFY_ISOLATED_TMP: isolatedTmp,
    RELEASE_VERIFY_EVIDENCE_DIR: task.evidenceDir,
    RELEASE_VERIFY_FORCE_EPHEMERAL_PORTS: '1',
    RELEASE_VERIFY_REDIRECT_WORKSPACE_SRC: task.redirectWorkspaceSrc ? '1' : '0'
  };
  if (task.redirectEvidenceFrom) {
    childEnv.RELEASE_VERIFY_REDIRECT_EVIDENCE_FROM = task.redirectEvidenceFrom;
  } else {
    delete childEnv.RELEASE_VERIFY_REDIRECT_EVIDENCE_FROM;
  }

  return new Promise((resolve) => {
    const startedAt = Date.now();
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const child = spawn(process.execPath, ['--require', PRELOAD_PATH, task.scriptPath], {
      cwd: path.dirname(task.scriptPath),
      env: childEnv,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
      setTimeout(() => {
        if (!child.killed) child.kill('SIGKILL');
      }, 3000).unref();
    }, timeoutMs);
    timer.unref();

    child.stdout.on('data', (chunk) => {
      const text = chunk.toString('utf8');
      stdout += text;
      stdoutStream.write(chunk);
      if (options.streamLogs) process.stdout.write(`[${task.id}] ${text}`);
    });

    child.stderr.on('data', (chunk) => {
      const text = chunk.toString('utf8');
      stderr += text;
      stderrStream.write(chunk);
      if (options.streamLogs) process.stderr.write(`[${task.id}:err] ${text}`);
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      stderr += `\n${err.stack || err.message}`;
      stderrStream.write(`\n${err.stack || err.message}\n`);
      stdoutStream.end();
      stderrStream.end();
      resolve(extractWitnessOutcome(task, {
        exitCode: 1,
        timedOut: false,
        timeoutMs,
        durationMs: Date.now() - startedAt,
        stdout,
        stderr,
        stdoutLogPath,
        stderrLogPath
      }));
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      stdoutStream.end();
      stderrStream.end();
      resolve(extractWitnessOutcome(task, {
        exitCode: code === null ? 1 : code,
        timedOut,
        timeoutMs,
        durationMs: Date.now() - startedAt,
        stdout,
        stderr,
        stdoutLogPath,
        stderrLogPath
      }));
    });
  });
}

async function runWitnessPlan(preflight, options = {}) {
  const virtualStage = prepareVirtualStage(preflight);
  try {
    const tasks = buildWitnessPlan(preflight, { ...options, virtualStage });
    const results = [];
    for (const task of tasks) {
      const outcome = await runWitnessTask(task, preflight, { ...options, virtualStage });
      results.push(outcome);
      if (!outcome.passed && options.stopOnFirstFailure !== false) {
        break;
      }
    }
    return { tasks, results, virtualStage };
  } finally {
    virtualStage.cleanup();
  }
}

module.exports = {
  prepareVirtualStage,
  buildWitnessPlan,
  extractWitnessOutcome,
  runWitnessPlan
};
