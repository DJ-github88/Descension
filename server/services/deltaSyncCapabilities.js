const ENV_FLAGS = {
  tokens: 'ENABLE_TOKENS_DELTA'
};

function getDeltaSyncCapabilities() {
  const caps = {};
  for (const [category, envFlag] of Object.entries(ENV_FLAGS)) {
    caps[category] = process.env[envFlag] === 'true';
  }
  return caps;
}

function isDeltaSyncEnabled(category) {
  return getDeltaSyncCapabilities()[category] === true;
}

module.exports = {
  getDeltaSyncCapabilities,
  isDeltaSyncEnabled,
  DELTA_SYNC_CATEGORIES: Object.keys(ENV_FLAGS)
};
