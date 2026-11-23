#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const {
  CAPABILITIES,
  PairPreflightError,
  verifyPairPreflight
} = require('./preflight-pair.cjs');
const { runWitnessPlan } = require('./witness-launcher.cjs');
const { buildReport, writeReportFiles } = require('./report-builder.cjs');

function printUsage() {
  process.stdout.write([
    'Usage: node verify-release.cjs --app <build-dir> --server <stage-root-or-server-dir> [options]',
    '',
    'Options:',
    '  --app <path>              Candidate app build directory (or env APP_BUILD_DIR)',
    '  --server <path>           Matching server stage root or server directory (or env STAGE_ROOT)',
    `  --capability <list>       Comma-separated capabilities (default: player-journey). Options: ${CAPABILITIES.join(', ')}, all`,
    '  --check <list>            Alias for --capability',
    '  --output <path>           Output directory for reports, logs, and isolated artifacts',
    '  --label <name>            Run label for report header',
    '  --identity <path>         Optional BUILD_IDENTITY.json override path',
    '  --dice-subcheck <mode>    parity (default), d100-coin, wound-surge, or all',
    '  --channel-subcheck <mode> ally-healing (default), arcane-beam-recast, arcane-beam-interruption, or all',
    '  --preflight-only          Run identity & pair preflight without launching browser witnesses',
    '  --keep-going              Run remaining selected capabilities even if an earlier one fails',
    '  --stream                  Mirror child witness stdout/stderr live',
    '  --help                    Show this help message',
    ''
  ].join('\n'));
}

function parseArgs(argv) {
  const opts = {
    app: process.env.APP_BUILD_DIR || null,
    server: process.env.STAGE_ROOT || process.env.ISOLATED_STAGE_ROOT || null,
    capabilities: [],
    output: process.env.VERIFY_OUTPUT_DIR || null,
    label: process.env.VERDICT_LABEL || 'release-verification',
    identityPath: process.env.BUILD_IDENTITY_PATH || null,
    diceSubcheck: 'parity',
    channelSubcheck: 'ally-healing',
    preflightOnly: false,
    stopOnFirstFailure: true,
    streamLogs: false,
    help: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const nextVal = () => {
      if (i + 1 >= argv.length) throw new PairPreflightError('cli-arguments', `Missing value for ${arg}`);
      i += 1;
      return argv[i];
    };

    if (arg === '--help' || arg === '-h') opts.help = true;
    else if (arg === '--app') opts.app = nextVal();
    else if (arg === '--server') opts.server = nextVal();
    else if (arg === '--capability' || arg === '--check') opts.capabilities.push(nextVal());
    else if (arg === '--output') opts.output = nextVal();
    else if (arg === '--label') opts.label = nextVal();
    else if (arg === '--identity') opts.identityPath = nextVal();
    else if (arg === '--dice-subcheck') opts.diceSubcheck = nextVal();
    else if (arg === '--channel-subcheck') opts.channelSubcheck = nextVal();
    else if (arg === '--preflight-only') opts.preflightOnly = true;
    else if (arg === '--keep-going') opts.stopOnFirstFailure = false;
    else if (arg === '--stream') opts.streamLogs = true;
    else if (arg.startsWith('--')) throw new PairPreflightError('cli-arguments', `Unknown flag: ${arg}`);
    else throw new PairPreflightError('cli-arguments', `Unexpected positional argument: ${arg}`);
  }

  return opts;
}

function defaultOutputDir(label) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const safeLabel = String(label || 'run').replace(/[^a-zA-Z0-9._-]+/g, '-');
  return path.join(__dirname, 'runs', `${stamp}-${safeLabel}`);
}

async function main(argv = process.argv.slice(2)) {
  const startedAt = new Date().toISOString();
  let opts;
  try {
    opts = parseArgs(argv);
  } catch (err) {
    process.stderr.write(`${err.message}\n`);
    return 2;
  }

  if (opts.help) {
    printUsage();
    return 0;
  }

  const outputDir = path.resolve(opts.output || defaultOutputDir(opts.label));
  const logsDir = path.join(outputDir, 'logs');
  const preflightLogPath = path.join(logsDir, 'preflight.log');

  let preflight = null;
  let preflightError = null;
  let witnessResults = [];
  let canWriteOutput = false;

  try {
    fs.mkdirSync(logsDir, { recursive: true });
    canWriteOutput = true;
  } catch (err) {
    preflightError = new PairPreflightError(
      'output-writable',
      `Output directory cannot be created: ${outputDir}`,
      err
    );
    preflightError.metadata = {
      app: opts.app,
      server: opts.server,
      capabilities: opts.capabilities
    };
  }

  if (!preflightError) {
    try {
      preflight = await verifyPairPreflight({
        app: opts.app,
        server: opts.server,
        output: outputDir,
        capabilities: opts.capabilities,
        identityPath: opts.identityPath
      });
      fs.writeFileSync(
        preflightLogPath,
        [
          `PREFLIGHT PASS (${startedAt})`,
          `app: ${preflight.appInfo.buildDir}`,
          `server: ${preflight.serverInfo.serverDir} (${preflight.serverInfo.layout})`,
          `capabilities: ${preflight.capabilities.join(', ')}`,
          ...preflight.checks.map((c) => `  [PASS] ${c.id}: ${c.detail}`)
        ].join('\n') + '\n'
      );
    } catch (err) {
      preflightError = err instanceof PairPreflightError
        ? err
        : new PairPreflightError('preflight-unexpected', err.message, err);
      preflightError.metadata = {
        ...(preflightError.metadata || {}),
        app: opts.app,
        server: opts.server,
        capabilities: opts.capabilities
      };
      if (canWriteOutput) {
        fs.writeFileSync(
          preflightLogPath,
          [
            `PREFLIGHT FAIL (${startedAt})`,
            `check: ${preflightError.check}`,
            `category: ${preflightError.category}`,
            `detail: ${preflightError.detail}`,
            preflightError.cause ? `cause: ${preflightError.cause.stack || preflightError.cause.message}` : ''
          ].filter(Boolean).join('\n') + '\n'
        );
      }
    }
  }

  if (preflight && !opts.preflightOnly) {
    const execOutcome = await runWitnessPlan(preflight, {
      label: opts.label,
      diceSubcheck: opts.diceSubcheck,
      channelSubcheck: opts.channelSubcheck,
      stopOnFirstFailure: opts.stopOnFirstFailure,
      streamLogs: opts.streamLogs
    });
    witnessResults = execOutcome.results;
  }

  const endedAt = new Date().toISOString();
  const report = buildReport({
    label: opts.label,
    startedAt,
    endedAt,
    outputDir,
    preflight,
    preflightError,
    witnessResults,
    preflightLogPath: canWriteOutput ? preflightLogPath : null,
    preflightOnly: opts.preflightOnly
  });

  if (canWriteOutput) {
    const written = writeReportFiles(report);
    process.stdout.write(written.markdown + '\n');
  } else {
    const { formatMarkdownReport } = require('./report-builder.cjs');
    process.stdout.write(formatMarkdownReport(report) + '\n');
  }

  return report.verdict === 'PASS' ? 0 : (preflightError ? preflightError.exitCode : 1);
}

if (require.main === module) {
  main().then(
    (code) => process.exit(code),
    (err) => {
      process.stderr.write(`${err && err.stack ? err.stack : err}\n`);
      process.exit(1);
    }
  );
}

module.exports = { parseArgs, main };
