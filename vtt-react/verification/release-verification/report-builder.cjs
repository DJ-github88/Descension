'use strict';

const fs = require('node:fs');
const path = require('node:path');

function collectEvidenceFiles(dir, maxFiles = 60) {
  if (!dir || !fs.existsSync(dir)) return [];
  const results = [];
  const walk = (current) => {
    if (results.length >= maxFiles) return;
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch (_) {
      return;
    }
    for (const entry of entries) {
      if (results.length >= maxFiles) return;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else {
        results.push(full);
      }
    }
  };
  walk(dir);
  return results;
}

function summarizeSimulatedServices(witnessResults = []) {
  const observedOrigins = new Set();
  for (const w of witnessResults) {
    for (const ref of w.networkRefusals || []) {
      if (ref && ref.origin) observedOrigins.add(`${ref.origin} (${ref.fixture || 'stub'})`);
    }
  }
  return [
    {
      service: 'Socket.IO + Server Handlers (productionStackServer)',
      mode: 'real-in-process-production-stack',
      detail: 'Real sanitization -> validation -> rate-limit -> auth middleware and real socket/actor/consequence handlers on isolated ephemeral localhost port.'
    },
    {
      service: 'Firebase Auth Token Verification',
      mode: 'simulated-in-memory',
      detail: 'Seeded local auth tokens via productionStackServer.registerAuthToken + client authStore.setUser fixtures (no live Firebase Auth).'
    },
    {
      service: 'Firestore / Realtime Cloud Persistence',
      mode: 'simulated-in-memory',
      detail: 'In-memory room state and no-op FirebaseBatchWriter persistence (no live Firestore or cloud deployment).'
    },
    {
      service: 'Google Fonts / External Google & Firebase HTTP Endpoints',
      mode: 'intercepted-local-stub',
      detail: observedOrigins.size
        ? `Intercepted via Playwright page.route: ${Array.from(observedOrigins).join(', ')}`
        : 'Intercepted via Playwright page.route (fonts fulfilled empty CSS, Firebase/Google APIs stubbed 200).'
    },
    {
      service: 'Physical Dice Input & Character Sheet Seeding',
      mode: 'deterministic-test-fixture',
      detail: 'Deterministic roll faces entered into UI dialog; test PCs & creature tokens seeded per room fixture.'
    }
  ];
}

function buildReport({
  label,
  startedAt,
  endedAt,
  outputDir,
  preflight = null,
  preflightError = null,
  witnessResults = [],
  preflightLogPath = null,
  preflightOnly = false
}) {
  let verdict = 'PASS';
  let failureCategory = 'NONE';
  let firstPlayerVisibleFailure = null;
  let environmentFailure = null;

  if (preflightError) {
    verdict = 'FAIL';
    failureCategory = 'ENVIRONMENT_FAILURE';
    environmentFailure = {
      phase: 'preflight',
      check: preflightError.check || 'preflight',
      code: preflightError.code || 'PREFLIGHT_FAILED',
      message: preflightError.detail || preflightError.message,
      originalError: preflightError.cause ? `${preflightError.cause.code ? `${preflightError.cause.code}: ` : ''}${preflightError.cause.message}` : null
    };
  } else {
    const failedWitness = witnessResults.find((w) => !w.passed);
    if (failedWitness) {
      verdict = 'FAIL';
      failureCategory = failedWitness.failureCategory;
      if (failedWitness.failureCategory === 'GAMEPLAY_FAILURE') {
        firstPlayerVisibleFailure = failedWitness.firstPlayerVisibleFailure;
      } else {
        environmentFailure = {
          phase: 'witness-runtime',
          witnessId: failedWitness.id,
          capability: failedWitness.capability,
          exitCode: failedWitness.exitCode,
          timedOut: Boolean(failedWitness.timedOut),
          message: failedWitness.environmentError || 'Witness failed in environment/runtime setup'
        };
      }
    }
  }

  const pairedBuildIdentity = preflight
    ? {
        matched: true,
        appBuildDir: preflight.appInfo.buildDir,
        serverStageRoot: preflight.serverInfo.stageRoot,
        serverDir: preflight.serverInfo.serverDir,
        serverLayout: preflight.serverInfo.layout,
        indexHtmlSha256: preflight.appInfo.indexHtmlSha256,
        assetManifestSha256: preflight.appInfo.assetManifestSha256,
        mainJs: preflight.appInfo.mainJs,
        mainCss: preflight.appInfo.mainCss,
        servicesJs: preflight.appInfo.servicesJs,
        appMarkers: preflight.appInfo.markers,
        serverMarkers: preflight.serverInfo.markers,
        trackedServerFilesSha256: preflight.serverInfo.filesSha256,
        verifiedIdentityFiles: preflight.verifiedIdentityFiles
      }
    : {
        matched: false,
        appInput: preflightError?.metadata?.app || null,
        serverInput: preflightError?.metadata?.server || null,
        mismatchReason: environmentFailure?.message || null
      };

  const checksRan = {
    preflightOnly,
    preflightChecks: preflight ? preflight.checks : [],
    capabilitiesRequested: preflight
      ? preflight.capabilities
      : (preflightError?.metadata?.capabilities || []),
    witnesses: witnessResults.map((w) => ({
      id: w.id,
      capability: w.capability,
      title: w.title,
      passed: w.passed,
      failureCategory: w.failureCategory,
      exitCode: w.exitCode,
      durationMs: w.durationMs,
      totalChecks: w.checks.length,
      passedChecks: w.checks.filter((c) => c.passed).length,
      checks: w.checks
    }))
  };

  const evidencePaths = {
    outputDir,
    reportJson: path.join(outputDir, 'report.json'),
    reportMd: path.join(outputDir, 'REPORT.md'),
    preflightLog: preflightLogPath,
    witnessLogs: witnessResults.map((w) => ({
      id: w.id,
      stdout: w.stdoutLogPath,
      stderr: w.stderrLogPath,
      resultJson: w.resultPath,
      evidenceDir: w.evidenceDir,
      artifacts: collectEvidenceFiles(w.evidenceDir)
    }))
  };

  const simulatedServices = summarizeSimulatedServices(witnessResults);

  return {
    label,
    verdict,
    failureCategory,
    startedAt,
    endedAt,
    pairedBuildIdentity,
    checksRan,
    firstPlayerVisibleFailure,
    environmentFailure,
    evidencePaths,
    simulatedServices
  };
}

function formatMarkdownReport(report) {
  const lines = [];
  lines.push(`# Release Verification Report — ${report.label}`);
  lines.push('');
  lines.push(`- **Verdict:** **${report.verdict}** (${report.failureCategory === 'NONE' ? 'all checks passed' : report.failureCategory})`);
  lines.push(`- **Started / Ended:** \`${report.startedAt}\` -> \`${report.endedAt}\``);
  lines.push(`- **Capabilities Requested:** \`${(report.checksRan.capabilitiesRequested || []).join(', ') || '(unknown)'}\``);
  lines.push('');

  lines.push('## 1. Paired Build Identity');
  const id = report.pairedBuildIdentity;
  if (id.matched) {
    lines.push(`- **Status:** MATCHED (${id.serverLayout})`);
    lines.push(`- **App Build Dir:** \`${id.appBuildDir}\``);
    lines.push(`- **Server Stage Root:** \`${id.serverStageRoot}\` (server: \`${id.serverDir}\`)`);
    lines.push(`- **index.html SHA-256:** \`${id.indexHtmlSha256}\``);
    lines.push(`- **asset-manifest.json SHA-256:** \`${id.assetManifestSha256}\``);
    if (id.mainJs) lines.push(`- **main.js:** \`${id.mainJs.file}\` (\`${id.mainJs.sha256}\`)`);
    if (id.mainCss) lines.push(`- **main.css:** \`${id.mainCss.file}\` (\`${id.mainCss.sha256}\`)`);
    if (id.servicesJs) lines.push(`- **services.js:** \`${id.servicesJs.file}\` (\`${id.servicesJs.sha256}\`)`);
  } else {
    lines.push(`- **Status:** UNMATCHED / STOPPED BEFORE TESTING`);
    if (id.appInput) lines.push(`- **App Input:** \`${id.appInput}\``);
    if (id.serverInput) lines.push(`- **Server Input:** \`${id.serverInput}\``);
    if (id.mismatchReason) lines.push(`- **Reason:** ${id.mismatchReason}`);
  }
  lines.push('');

  lines.push('## 2. Checks That Ran');
  if (report.checksRan.preflightChecks.length) {
    lines.push(`- **Preflight Checks (${report.checksRan.preflightChecks.length}):** ${report.checksRan.preflightChecks.map((c) => `\`${c.id}\``).join(', ')}`);
  }
  if (report.checksRan.witnesses.length === 0) {
    lines.push('- **Witness Runs:** None (stopped before witness execution)');
  } else {
    for (const w of report.checksRan.witnesses) {
      lines.push(`- **${w.id}** (\`${w.capability}\`): **${w.passed ? 'PASS' : `FAIL (${w.failureCategory})`}** — ${w.passedChecks}/${w.totalChecks} checks/steps in ${(w.durationMs / 1000).toFixed(1)}s`);
    }
  }
  lines.push('');

  lines.push('## 3. Failure Diagnosis');
  if (report.failureCategory === 'NONE') {
    lines.push('- **First Player-Visible Failure:** None');
    lines.push('- **Environment / Preflight Failure:** None');
  } else if (report.failureCategory === 'ENVIRONMENT_FAILURE') {
    const ef = report.environmentFailure;
    lines.push(`- **Environment / Preflight Failure (\`${ef.phase}\`):** ${ef.message}`);
    if (ef.check) lines.push(`- **Failed Prerequisite:** \`${ef.check}\``);
    if (ef.originalError) lines.push(`- **Original Cause:** \`${ef.originalError}\``);
    lines.push('- **First Player-Visible Failure:** None (stopped before/outside gameplay assertions)');
  } else {
    const gf = report.firstPlayerVisibleFailure;
    lines.push(`- **First Player-Visible Failure (\`${gf.witnessId}\`):**`);
    if (gf.stepId) lines.push(`  - **Step / Check:** \`${gf.stepId}\`${gf.actor ? ` (Actor: ${gf.actor})` : ''}`);
    if (gf.description) lines.push(`  - **Workflow Action:** ${gf.description}`);
    lines.push(`  - **Failure:** ${gf.message}`);
    lines.push('- **Environment / Preflight Failure:** None');
  }
  lines.push('');

  lines.push('## 4. Evidence Paths (Logs Preserved)');
  lines.push(`- **Report JSON:** \`${report.evidencePaths.reportJson}\``);
  lines.push(`- **Report Markdown:** \`${report.evidencePaths.reportMd}\``);
  if (report.evidencePaths.preflightLog) {
    lines.push(`- **Preflight Log:** \`${report.evidencePaths.preflightLog}\``);
  }
  for (const wl of report.evidencePaths.witnessLogs) {
    lines.push(`- **Witness \`${wl.id}\`:**`);
    lines.push(`  - stdout: \`${wl.stdout}\``);
    lines.push(`  - stderr: \`${wl.stderr}\``);
    if (wl.resultJson) lines.push(`  - result.json: \`${wl.resultJson}\``);
    lines.push(`  - evidenceDir: \`${wl.evidenceDir}\` (${wl.artifacts.length} file(s))`);
  }
  lines.push('');

  lines.push('## 5. Simulated Services & Fixture Disclosures');
  for (const s of report.simulatedServices) {
    lines.push(`- **${s.service}** (\`${s.mode}\`): ${s.detail}`);
  }
  lines.push('');
  return lines.join('\n');
}

function writeReportFiles(report) {
  fs.mkdirSync(report.evidencePaths.outputDir, { recursive: true });
  fs.writeFileSync(report.evidencePaths.reportJson, JSON.stringify(report, null, 2));
  const markdown = formatMarkdownReport(report);
  fs.writeFileSync(report.evidencePaths.reportMd, markdown);
  return { reportJson: report.evidencePaths.reportJson, reportMd: report.evidencePaths.reportMd, markdown };
}

module.exports = {
  buildReport,
  formatMarkdownReport,
  writeReportFiles
};
