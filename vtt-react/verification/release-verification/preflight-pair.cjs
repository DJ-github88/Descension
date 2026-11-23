'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const witnessPreflight = require('../witness-preflight.cjs');

const CAPABILITIES = ['player-journey', 'dice-recast', 'channels', 'passives'];
const WORKSPACE_ROOT = path.resolve(__dirname, '../../..');

class PairPreflightError extends Error {
  constructor(check, detail, cause = undefined, metadata = {}) {
    super(`[preflight:${check}] ${detail}`);
    this.name = 'PairPreflightError';
    this.check = check;
    this.detail = detail;
    this.cause = cause;
    this.category = 'ENVIRONMENT_FAILURE';
    this.code = cause && cause.code ? cause.code : 'PREFLIGHT_FAILED';
    this.exitCode = cause && Number.isInteger(cause.exitCode) ? cause.exitCode : 1;
    this.metadata = metadata;
  }
}

function sha256File(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return null;
  const stat = fs.statSync(filePath);
  if (!stat.isFile()) return null;
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function readTextSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (_) {
    return '';
  }
}

function readJsonSafe(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (_) {
    return null;
  }
}

function parseShaManifest(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^(ABSENT|MISSING|[0-9a-f]{64})\s+\*?(.+)$/i);
      if (!m) {
        throw new PairPreflightError('manifest-format', `Malformed manifest row in ${filePath}: ${line}`);
      }
      return {
        hash: m[1].toUpperCase() === 'MISSING' ? 'ABSENT' : m[1].toLowerCase(),
        rel: m[2].trim().replace(/\\/g, '/')
      };
    });
}

function normalizeCapabilities(input) {
  if (!input || (Array.isArray(input) && input.length === 0)) {
    return ['player-journey'];
  }
  const rawList = (Array.isArray(input) ? input : [input]).flatMap((item) => String(item).split(','));
  const cleaned = rawList
    .map((item) => String(item).trim().toLowerCase())
    .filter(Boolean);

  if (cleaned.length === 0) return ['player-journey'];

  const aliases = {
    '17-step': 'player-journey',
    'player': 'player-journey',
    'journey': 'player-journey',
    'player-journey': 'player-journey',
    'dice': 'dice-recast',
    'recast': 'dice-recast',
    'dice/recast': 'dice-recast',
    'dice-recast': 'dice-recast',
    'channel': 'channels',
    'channels': 'channels',
    'passive': 'passives',
    'passives': 'passives',
    'all': 'all'
  };

  const expanded = [];
  for (const token of cleaned) {
    const mapped = aliases[token];
    if (!mapped) {
      throw new PairPreflightError(
        'capability-selection',
        `Unknown capability "${token}". Supported capabilities: ${CAPABILITIES.join(', ')}, all`
      );
    }
    if (mapped === 'all') {
      for (const cap of CAPABILITIES) {
        if (!expanded.includes(cap)) expanded.push(cap);
      }
    } else if (!expanded.includes(mapped)) {
      expanded.push(mapped);
    }
  }
  return expanded;
}

function resolveAppInput(appInput) {
  if (!appInput || !String(appInput).trim()) {
    throw new PairPreflightError('required-environment', 'Candidate app build directory (--app or APP_BUILD_DIR) is required');
  }
  const raw = String(appInput).trim();
  if (!path.isAbsolute(raw)) {
    throw new PairPreflightError('required-environment', `Candidate app directory must be an absolute path: ${raw}`);
  }
  const resolved = path.resolve(raw);
  if (!fs.existsSync(resolved)) {
    throw new PairPreflightError('build-directory', `Candidate app directory does not exist: ${resolved}`);
  }
  const stat = fs.statSync(resolved);
  if (!stat.isDirectory()) {
    throw new PairPreflightError('build-directory', `Candidate app path is not a directory: ${resolved}`);
  }

  // Convenience for packet folders only when explicit build-out/ exists alongside BUILD_IDENTITY.json/HANDOFF.md.
  if (!fs.existsSync(path.join(resolved, 'asset-manifest.json'))) {
    const isPacketDir =
      fs.existsSync(path.join(resolved, 'BUILD_IDENTITY.json')) ||
      fs.existsSync(path.join(resolved, 'HANDOFF.md'));
    const nestedBuildOut = path.join(resolved, 'build-out');
    if (isPacketDir && fs.existsSync(path.join(nestedBuildOut, 'asset-manifest.json'))) {
      return {
        inputPath: resolved,
        appBuildDir: nestedBuildOut,
        packetDir: resolved
      };
    }
  }

  const parentDir = path.dirname(resolved);
  const packetDir = (
    fs.existsSync(path.join(parentDir, 'BUILD_IDENTITY.json')) ||
    fs.existsSync(path.join(parentDir, 'FINAL.sha256'))
  ) ? parentDir : null;

  return {
    inputPath: resolved,
    appBuildDir: resolved,
    packetDir
  };
}

function resolveServerInput(serverInput) {
  if (!serverInput || !String(serverInput).trim()) {
    throw new PairPreflightError('required-environment', 'Server stage directory (--server or STAGE_ROOT) is required');
  }
  const raw = String(serverInput).trim();
  if (!path.isAbsolute(raw)) {
    throw new PairPreflightError('required-environment', `Server stage path must be an absolute path: ${raw}`);
  }
  const resolved = path.resolve(raw);
  if (!fs.existsSync(resolved)) {
    throw new PairPreflightError('server-directory', `Server stage directory does not exist: ${resolved}`);
  }
  const stat = fs.statSync(resolved);
  if (!stat.isDirectory()) {
    throw new PairPreflightError('server-directory', `Server stage path is not a directory: ${resolved}`);
  }

  if (fs.existsSync(path.join(resolved, 'server', 'services', 'installedAuthoredAbilities.js'))) {
    return {
      inputPath: resolved,
      layout: 'stage-root',
      stageRoot: resolved,
      serverDir: path.join(resolved, 'server'),
      packetDir: (
        fs.existsSync(path.join(path.dirname(resolved), 'FINAL.sha256')) ||
        fs.existsSync(path.join(path.dirname(resolved), 'BUILD_IDENTITY.json'))
      ) ? path.dirname(resolved) : null
    };
  }

  if (fs.existsSync(path.join(resolved, 'services', 'installedAuthoredAbilities.js'))) {
    const parent = path.dirname(resolved);
    return {
      inputPath: resolved,
      layout: 'direct-server-dir',
      stageRoot: parent,
      serverDir: resolved,
      packetDir: (
        fs.existsSync(path.join(parent, 'FINAL.sha256')) ||
        fs.existsSync(path.join(parent, 'BUILD_IDENTITY.json'))
      ) ? parent : null
    };
  }

  const candidateSubdir = path.join(resolved, 'server-candidate');
  if (fs.existsSync(path.join(candidateSubdir, 'services', 'installedAuthoredAbilities.js'))) {
    return {
      inputPath: resolved,
      layout: 'packet-server-candidate',
      stageRoot: resolved,
      serverDir: candidateSubdir,
      packetDir: resolved
    };
  }

  throw new PairPreflightError(
    'server-stage-files',
    `Server stage at ${resolved} is missing server/services/installedAuthoredAbilities.js (or services/installedAuthoredAbilities.js)`
  );
}

function inspectAppBuild(appBuildDir) {
  const indexPath = path.join(appBuildDir, 'index.html');
  const manifestPath = path.join(appBuildDir, 'asset-manifest.json');
  const manifest = readJsonSafe(manifestPath);
  if (!manifest || !manifest.files || typeof manifest.files !== 'object') {
    throw new PairPreflightError('build-manifest', `Invalid asset-manifest.json in ${appBuildDir}`);
  }

  const relFromManifest = (key) => {
    const raw = manifest.files[key];
    return typeof raw === 'string' && raw ? raw.replace(/^\//, '') : null;
  };
  const mainJsRel = relFromManifest('main.js');
  const mainCssRel = relFromManifest('main.css');
  const servicesJsRel = relFromManifest('services.js');

  const mainJsPath = mainJsRel ? path.join(appBuildDir, mainJsRel) : null;
  const mainCssPath = mainCssRel ? path.join(appBuildDir, mainCssRel) : null;
  const servicesJsPath = servicesJsRel ? path.join(appBuildDir, servicesJsRel) : null;

  const jsFiles = [];
  for (const [entry, val] of Object.entries(manifest.files)) {
    if (typeof val !== 'string' || !val.endsWith('.js')) continue;
    const abs = path.resolve(appBuildDir, '.' + (val.startsWith('/') ? val : `/${val}`));
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
      jsFiles.push({ entry, rel: val.replace(/^\//, ''), path: abs });
    }
  }

  const markers = {
    hasPlayerReviewClient: false,
    hasReviewQueueUi: false,
    hasDiceRecastClient: false,
    hasStartNewCastMarker: false,
    hasLastCoinFlipMarker: false,
    hasChanneledFeedClient: false,
    hasPeriodicTickFeed: false,
    hasPassivePanelClient: false,
    hasPassiveListRpc: false,
    hasSameTurnPassiveClient: false
  };

  for (const fileInfo of jsFiles) {
    const text = readTextSafe(fileInfo.path);
    if (!text) continue;
    if (text.includes('authored_review_submit')) markers.hasPlayerReviewClient = true;
    if (text.includes('GM review requests') && text.includes('GM review for ')) markers.hasReviewQueueUi = true;
    if (text.includes('Approve displayed scores again (retained faces)')) markers.hasDiceRecastClient = true;
    if (text.includes('Start new cast')) markers.hasStartNewCastMarker = true;
    if (text.includes('lastCoinFlip')) markers.hasLastCoinFlipMarker = true;
    if (text.includes('all scheduled ticks completed')) markers.hasChanneledFeedClient = true;
    if (text.includes('shared-periodic-tick:v1')) markers.hasPeriodicTickFeed = true;
    if (text.includes('data-passive-activation-panel')) markers.hasPassivePanelClient = true;
    if (text.includes('actor_passive_list')) markers.hasPassiveListRpc = true;
    if (text.includes('authored-target-current-end') && text.includes('expires at the end of that same turn')) {
      markers.hasSameTurnPassiveClient = true;
    }
  }

  return {
    buildDir: appBuildDir,
    assetCount: Object.keys(manifest.files).length,
    jsAssetCount: jsFiles.length,
    indexHtmlSha256: sha256File(indexPath),
    assetManifestSha256: sha256File(manifestPath),
    mainJs: mainJsRel ? { file: path.basename(mainJsRel), rel: mainJsRel, sha256: sha256File(mainJsPath) } : null,
    mainCss: mainCssRel ? { file: path.basename(mainCssRel), rel: mainCssRel, sha256: sha256File(mainCssPath) } : null,
    servicesJs: servicesJsRel ? { file: path.basename(servicesJsRel), rel: servicesJsRel, sha256: sha256File(servicesJsPath) } : null,
    markers
  };
}

function inspectServerStage(resolvedServer) {
  const { serverDir, stageRoot, layout } = resolvedServer;
  const requiredFiles = [
    'services/installedAuthoredAbilities.js',
    'services/actorConsequences.js',
    'services/actorRelationships.js',
    'services/spellPayments.js',
    'services/roomCheckpoint.js',
    'services/actorProjection.js',
    'services/installedDefinitionRegistry.js',
    'services/passiveActivation.js',
    'services/passiveTurnTrigger.js',
    'services/passiveMovementTrigger.js',
    'services/sharedEffectLifecycle.js',
    'handlers/actorConsequenceHandlers.js',
    'tests/helpers/productionStackServer.js',
    'shared/services/authoredAbility.js',
    'shared/services/authoredEffect.js',
    'shared/services/sharedEffectTiming.js',
    'shared/services/sharedConditionProfile.js'
  ];

  for (const rel of requiredFiles) {
    const abs = path.join(serverDir, rel);
    if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) {
      throw new PairPreflightError(
        'server-stage-files',
        `Required server stage file is missing: ${abs}`
      );
    }
  }

  const trackedServerFiles = [
    'handlers/actorConsequenceHandlers.js',
    'services/authoredReviewRequests.js',
    'services/installedAuthoredAbilities.js',
    'services/actorConsequences.js',
    'services/passiveActivation.js',
    'services/passiveTurnTrigger.js',
    'services/passiveMovementTrigger.js',
    'services/sharedEffectLifecycle.js',
    'services/installedDefinitionRegistry.js',
    'shared/services/authoredAbility.js',
    'shared/services/authoredEffect.js',
    'shared/services/sharedEffectTiming.js',
    'shared/services/sharedConditionProfile.js'
  ];

  const filesSha256 = {};
  for (const rel of trackedServerFiles) {
    filesSha256[`server/${rel}`] = sha256File(path.join(serverDir, rel));
  }

  const handlersText = readTextSafe(path.join(serverDir, 'handlers/actorConsequenceHandlers.js'));
  const lifecycleText = readTextSafe(path.join(serverDir, 'services/sharedEffectLifecycle.js'));
  const registryText = readTextSafe(path.join(serverDir, 'services/installedDefinitionRegistry.js'));
  const hasReviewService = fs.existsSync(path.join(serverDir, 'services/authoredReviewRequests.js'));
  const hasReviewHandlers = handlersText.includes('authored_review_submit') && handlersText.includes('authored_review_decide');

  const markers = {
    hasPlayerReviewServer: hasReviewService && hasReviewHandlers,
    hasReviewServiceFile: hasReviewService,
    hasReviewHandlers,
    hasChanneledServer: registryText.includes('authored-channeled:v1') && lifecycleText.includes('authored-caster-start-count'),
    hasChanneledCompletedReason: lifecycleText.includes("'completed'") || lifecycleText.includes('"completed"'),
    hasPassiveServer: true,
    hasPassiveRevokeNotify: handlersText.includes('actor_passive_changed'),
    hasSameTurnPassiveServer: lifecycleText.includes('authored-target-current-end')
  };

  // Optional shared-sync check when the stage root contains both server/shared and vtt-react/src.
  const srcRoot = path.join(stageRoot, 'vtt-react', 'src');
  const sharedRoot = path.join(serverDir, 'shared');
  const syncDrift = [];
  let sharedSyncChecked = false;
  if (layout === 'stage-root' && fs.existsSync(srcRoot) && fs.existsSync(sharedRoot)) {
    const syncFiles = [
      'services/authoredAbility.js',
      'services/randomOutcome.js',
      'services/executionPlan.js',
      'services/componentScopePolicy.js',
      'services/passiveActivationPolicy.js',
      'services/authoredCooldown.js',
      'services/catalogueAbility.cjs',
      'services/canonicalHash.js',
      'services/authoredCondition.js',
      'services/authoredEffect.js',
      'services/authoredChanneled.js',
      'services/classEffect.js',
      'services/saveBranch.js',
      'services/directSave.js',
      'services/hunterFlow.js',
      'services/directSavePolicy.js',
      'services/sharedConditionProfile.js',
      'services/sharedEffectTiming.js',
      'services/shieldBashResult.js',
      'data/sharedConditionProfiles.json',
      'data/classEffectProfiles.json',
      'data/catalogueAbilityProfiles.json'
    ];
    sharedSyncChecked = true;
    for (const rel of syncFiles) {
      const fromSrc = path.join(srcRoot, rel);
      const fromShared = path.join(sharedRoot, rel);
      if (fs.existsSync(fromSrc) && fs.existsSync(fromShared)) {
        if (!fs.readFileSync(fromSrc).equals(fs.readFileSync(fromShared))) {
          syncDrift.push(rel);
        }
      }
    }
  }

  return {
    layout,
    stageRoot,
    serverDir,
    hasStageClientSource: layout === 'stage-root' && fs.existsSync(srcRoot),
    sharedSyncChecked,
    sharedSyncDrift: syncDrift,
    filesSha256,
    markers
  };
}

function verifyManifestAlignment({ appInfo, serverInfo, appResolved, serverResolved, explicitIdentityPath }) {
  const identityCandidates = [];
  if (explicitIdentityPath) identityCandidates.push(path.resolve(explicitIdentityPath));
  if (appResolved.packetDir) identityCandidates.push(path.join(appResolved.packetDir, 'BUILD_IDENTITY.json'));
  if (serverResolved.packetDir && serverResolved.packetDir !== appResolved.packetDir) {
    identityCandidates.push(path.join(serverResolved.packetDir, 'BUILD_IDENTITY.json'));
  }

  const verifiedIdentityFiles = [];
  for (const idPath of identityCandidates) {
    if (!fs.existsSync(idPath)) continue;
    const doc = readJsonSafe(idPath);
    if (!doc) {
      throw new PairPreflightError('build-identity-manifest', `BUILD_IDENTITY.json is not valid JSON: ${idPath}`);
    }
    const isAppPacketIdentity = appResolved.packetDir && path.dirname(idPath) === appResolved.packetDir;
    if (explicitIdentityPath || isAppPacketIdentity) {
      const expectedIndex = doc.indexHtml || doc.indexHtmlSha256 || doc.files?.['index.html']?.sha256;
      const expectedManifest = doc.assetManifest || doc.assetManifestSha256 || doc.files?.['asset-manifest.json']?.sha256;
      const expectedMainJs = doc.mainJs?.sha256 || doc.files?.mainJs?.sha256;
      const expectedMainCss = doc.mainCss?.sha256 || doc.files?.mainCss?.sha256;

      if (expectedIndex && expectedIndex !== appInfo.indexHtmlSha256) {
        throw new PairPreflightError(
          'build-identity-mismatch',
          `App index.html SHA-256 (${appInfo.indexHtmlSha256}) does not match ${idPath} (${expectedIndex})`
        );
      }
      if (expectedManifest && expectedManifest !== appInfo.assetManifestSha256) {
        throw new PairPreflightError(
          'build-identity-mismatch',
          `App asset-manifest.json SHA-256 (${appInfo.assetManifestSha256}) does not match ${idPath} (${expectedManifest})`
        );
      }
      if (expectedMainJs && appInfo.mainJs && expectedMainJs !== appInfo.mainJs.sha256) {
        throw new PairPreflightError(
          'build-identity-mismatch',
          `App main.js SHA-256 (${appInfo.mainJs.sha256}) does not match ${idPath} (${expectedMainJs})`
        );
      }
      if (expectedMainCss && appInfo.mainCss && expectedMainCss !== appInfo.mainCss.sha256) {
        throw new PairPreflightError(
          'build-identity-mismatch',
          `App main.css SHA-256 (${appInfo.mainCss.sha256}) does not match ${idPath} (${expectedMainCss})`
        );
      }
    }
    verifiedIdentityFiles.push(idPath);
  }

  // If the app packet has FINAL.sha256, verify server files in that manifest match the supplied server stage.
  const finalManifestErrors = [];
  if (appResolved.packetDir) {
    const appFinalPath = path.join(appResolved.packetDir, 'FINAL.sha256');
    if (fs.existsSync(appFinalPath)) {
      const rows = parseShaManifest(appFinalPath);
      for (const row of rows) {
        if (!row.rel.startsWith('server/')) continue;
        const serverRel = row.rel.slice('server/'.length);
        const actualPath = path.join(serverInfo.serverDir, serverRel);
        const actualHash = fs.existsSync(actualPath) ? sha256File(actualPath) : 'ABSENT';
        if (actualHash !== row.hash) {
          finalManifestErrors.push({
            rel: row.rel,
            expected: row.hash,
            actual: actualHash,
            manifest: appFinalPath
          });
        }
      }
    }
  }
  if (finalManifestErrors.length > 0) {
    const sample = finalManifestErrors[0];
    throw new PairPreflightError(
      'pair-identity-mismatch',
      `Server stage does not match app packet ${appResolved.packetDir} FINAL.sha256 (${finalManifestErrors.length} file mismatch(es), first: ${sample.rel} expected ${sample.expected}, got ${sample.actual})`,
      undefined,
      { mismatches: finalManifestErrors }
    );
  }

  return { verifiedIdentityFiles };
}

function checkPairConsistency(appInfo, serverInfo) {
  if (serverInfo.sharedSyncChecked && serverInfo.sharedSyncDrift.length > 0) {
    throw new PairPreflightError(
      'shared-modules-sync',
      `Server stage shared modules are out of sync with vtt-react/src: ${serverInfo.sharedSyncDrift.join(', ')}`
    );
  }

  // 1. Player review protocol must agree across compiled app and server stage.
  if (appInfo.markers.hasPlayerReviewClient !== serverInfo.markers.hasPlayerReviewServer) {
    throw new PairPreflightError(
      'pair-identity-mismatch',
      `App/server player-review protocol mismatch: app compiled authored_review_submit=${appInfo.markers.hasPlayerReviewClient}, server authoredReviewRequests/handlers=${serverInfo.markers.hasPlayerReviewServer}`
    );
  }

  // 2. Same-turn passive clock protocol must agree across compiled app and server stage.
  if (appInfo.markers.hasSameTurnPassiveClient !== serverInfo.markers.hasSameTurnPassiveServer) {
    throw new PairPreflightError(
      'pair-identity-mismatch',
      `App/server passive clock protocol mismatch: app has authored-target-current-end=${appInfo.markers.hasSameTurnPassiveClient}, server sharedEffectLifecycle has authored-target-current-end=${serverInfo.markers.hasSameTurnPassiveServer}`
    );
  }

  // 3. When the stage includes vtt-react/src, verify compiled bundle markers align with the stage's client source.
  if (serverInfo.hasStageClientSource) {
    const srcRoot = path.join(serverInfo.stageRoot, 'vtt-react', 'src');
    const stageHasReviewSrc = fs.existsSync(path.join(srcRoot, 'services/authoredReviewService.js'));
    if (stageHasReviewSrc !== appInfo.markers.hasPlayerReviewClient) {
      throw new PairPreflightError(
        'pair-identity-mismatch',
        `App build does not match server stage client source: stage authoredReviewService.js=${stageHasReviewSrc}, app authored_review_submit=${appInfo.markers.hasPlayerReviewClient}`
      );
    }

    const feedSrc = readTextSafe(path.join(srcRoot, 'services/acceptedResultFeed.js'));
    const stageHasChanneledFeed = feedSrc.includes('all scheduled ticks completed');
    if (stageHasChanneledFeed !== appInfo.markers.hasChanneledFeedClient) {
      throw new PairPreflightError(
        'pair-identity-mismatch',
        `App build does not match server stage client source: stage acceptedResultFeed.js completed-channel marker=${stageHasChanneledFeed}, app bundle marker=${appInfo.markers.hasChanneledFeedClient}`
      );
    }

    const timingSrc = readTextSafe(path.join(srcRoot, 'services/sharedEffectTiming.js'));
    const stageHasSameTurnTiming = timingSrc.includes('authored-target-current-end');
    if (stageHasSameTurnTiming !== appInfo.markers.hasSameTurnPassiveClient) {
      throw new PairPreflightError(
        'pair-identity-mismatch',
        `App build does not match server stage client source: stage sharedEffectTiming.js authored-target-current-end=${stageHasSameTurnTiming}, app bundle marker=${appInfo.markers.hasSameTurnPassiveClient}`
      );
    }

    const panelSrc = readTextSafe(path.join(srcRoot, 'components/hud/SpellConsequencePanel.jsx'));
    const stageHasReapprove = panelSrc.includes('Approve displayed scores again (retained faces)');
    if (stageHasReapprove !== appInfo.markers.hasDiceRecastClient) {
      throw new PairPreflightError(
        'pair-identity-mismatch',
        `App build does not match server stage client source: stage SpellConsequencePanel.jsx retained-faces marker=${stageHasReapprove}, app bundle marker=${appInfo.markers.hasDiceRecastClient}`
      );
    }
  }
}

function checkRuntimeDependencies(appResolved, serverResolved, capabilities) {
  const creaturesPath = [
    path.join(serverResolved.stageRoot, 'vtt-react/public/data/creatures.json'),
    path.join(appResolved.appBuildDir, 'data/creatures.json'),
    path.join(WORKSPACE_ROOT, 'vtt-react/public/data/creatures.json')
  ].find((p) => fs.existsSync(p));
  if (!creaturesPath) {
    throw new PairPreflightError('environment-paths', 'Missing creature seed data (creatures.json)');
  }

  const socketIoPath = [
    path.join(serverResolved.stageRoot, 'vtt-react/node_modules/socket.io-client/dist/socket.io.js'),
    path.join(WORKSPACE_ROOT, 'vtt-react/node_modules/socket.io-client/dist/socket.io.js')
  ].find((p) => fs.existsSync(p));
  if (!socketIoPath) {
    throw new PairPreflightError('environment-paths', 'Missing socket.io-client browser bundle (socket.io.js)');
  }

  const playwrightSearch = [
    path.join(serverResolved.stageRoot, 'vtt-react/node_modules'),
    path.join(WORKSPACE_ROOT, 'vtt-react/node_modules')
  ].filter((p) => fs.existsSync(p));
  try {
    require.resolve('playwright', { paths: playwrightSearch });
  } catch (err) {
    throw new PairPreflightError('modules', 'Required Playwright module is not resolvable', err);
  }

  const preloadPath = [
    path.join(serverResolved.stageRoot, 'vtt-react/verification/p7/preload.cjs'),
    path.join(WORKSPACE_ROOT, 'vtt-react/verification/p7/preload.cjs')
  ].find((p) => fs.existsSync(p));
  if (!preloadPath) {
    throw new PairPreflightError('environment-paths', 'Missing offline font preload helper (vtt-react/verification/p7/preload.cjs)');
  }

  // Verify witness scripts exist on disk for each requested capability.
  const requiredWitnesses = [];
  for (const cap of capabilities) {
    if (cap === 'player-journey') {
      requiredWitnesses.push(path.join(WORKSPACE_ROOT, 'vtt-react/verification/player-wizard-gm-review/accept-journey.cjs'));
    } else if (cap === 'dice-recast') {
      requiredWitnesses.push(path.join(WORKSPACE_ROOT, 'handoff/dice-coin-playtest-candidate-20261122/journey/physical-dice-recast-journey.cjs'));
    } else if (cap === 'channels') {
      requiredWitnesses.push(path.join(WORKSPACE_ROOT, 'handoff/channeled-ally-healing-isolated-20261122/journey/prove-channeled-ally-healing.cjs'));
    } else if (cap === 'passives') {
      requiredWitnesses.push(
        path.join(WORKSPACE_ROOT, 'vtt-react/verification/passive-turn-boundary/verify-browser.cjs'),
        path.join(WORKSPACE_ROOT, 'vtt-react/verification/passive-movement-entry/verify-browser.cjs')
      );
    }
  }
  for (const w of requiredWitnesses) {
    if (!fs.existsSync(w)) {
      throw new PairPreflightError('witness-scripts', `Required existing witness script is missing: ${w}`);
    }
  }

  return { creaturesPath, socketIoPath, preloadPath };
}

async function verifyPairPreflight({
  app,
  server,
  output,
  capabilities,
  identityPath = null
}) {
  const checks = [];
  const selectedCapabilities = normalizeCapabilities(capabilities);
  checks.push({ id: 'capability-selection', ok: true, detail: `capabilities: ${selectedCapabilities.join(', ')}` });

  const appResolved = resolveAppInput(app);
  const serverResolved = resolveServerInput(server);

  if (!output || !path.isAbsolute(path.resolve(output))) {
    throw new PairPreflightError('required-environment', 'Output directory must be provided');
  }
  const outputDir = path.resolve(output);

  let basePreflight;
  try {
    basePreflight = await witnessPreflight.run({
      witness: 'release-verification',
      build: appResolved.appBuildDir,
      output: outputDir,
      requireAbsolutePaths: true,
      buildFiles: ['index.html', 'asset-manifest.json'],
      requiredManifestEntries: ['main.js'],
      modules: []
    });
  } catch (error) {
    if (error instanceof witnessPreflight.PreflightError) {
      throw new PairPreflightError(error.check, error.detail, error.cause || error);
    }
    throw error;
  }
  for (const c of basePreflight.checks) {
    if (['build-index', 'build-manifest', 'build-assets', 'output-writable'].includes(c.id)) {
      checks.push(c);
    }
  }

  const appInfo = inspectAppBuild(appResolved.appBuildDir);
  const serverInfo = inspectServerStage(serverResolved);
  checks.push({
    id: 'server-stage-files',
    ok: true,
    detail: `${serverInfo.layout} verified at ${serverInfo.serverDir}`
  });

  const manifestAlignment = verifyManifestAlignment({
    appInfo,
    serverInfo,
    appResolved,
    serverResolved,
    explicitIdentityPath: identityPath
  });
  checks.push({
    id: 'build-identity-manifest',
    ok: true,
    detail: manifestAlignment.verifiedIdentityFiles.length
      ? `verified against ${manifestAlignment.verifiedIdentityFiles.join(', ')}`
      : 'no external BUILD_IDENTITY.json override; inspected live build & stage directly'
  });

  checkPairConsistency(appInfo, serverInfo);
  checks.push({
    id: 'pair-identity-match',
    ok: true,
    detail: 'app build and server stage protocol markers and source parity match'
  });

  const fixtures = checkRuntimeDependencies(appResolved, serverResolved, selectedCapabilities);
  checks.push({
    id: 'runtime-dependencies',
    ok: true,
    detail: 'Playwright, Socket.IO browser client, preload, creature fixtures, and existing witness scripts resolved'
  });

  return {
    ok: true,
    capabilities: selectedCapabilities,
    outputDir,
    appResolved,
    serverResolved,
    appInfo,
    serverInfo,
    fixtures,
    verifiedIdentityFiles: manifestAlignment.verifiedIdentityFiles,
    checks
  };
}

module.exports = {
  CAPABILITIES,
  WORKSPACE_ROOT,
  PairPreflightError,
  sha256File,
  normalizeCapabilities,
  resolveAppInput,
  resolveServerInput,
  inspectAppBuild,
  inspectServerStage,
  verifyPairPreflight
};
