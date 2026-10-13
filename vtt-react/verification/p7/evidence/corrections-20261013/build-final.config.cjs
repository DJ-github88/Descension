const original = require('D:/VTT/vtt-react/craco.config.js');
module.exports = { ...original, webpack: { ...original.webpack, configure(config, context) {
  config = original.webpack.configure(config, context);
  config.cache = false;
  function visit(rule) {
    if (!rule || typeof rule !== 'object') return;
    if (rule.options && Object.prototype.hasOwnProperty.call(rule.options, 'cacheDirectory')) rule.options.cacheDirectory = false;
    for (const key of ['rules', 'oneOf', 'use']) if (Array.isArray(rule[key])) rule[key].forEach(visit);
  }
  config.module.rules.forEach(visit);
  for (const plugin of config.plugins) if (plugin.constructor.name === 'ESLintWebpackPlugin') {
    plugin.options.cache = false;
    plugin.options.cacheLocation = 'D:/AppData/Temp/opencode/p7-correction-build/eslint-cache';
  }
  return config;
} } };
