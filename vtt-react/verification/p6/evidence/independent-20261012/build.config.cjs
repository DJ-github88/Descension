const original = require('D:/VTT/vtt-react/craco.config.js');
module.exports = { ...original, webpack: { ...original.webpack, configure(config, context) {
  config = original.webpack.configure(config, context);
  config.cache = false;
  function visit(rule) {
    if (rule.options && Object.prototype.hasOwnProperty.call(rule.options,'cacheDirectory')) rule.options.cacheDirectory = false;
    for (const nested of ['rules','oneOf','use']) if (Array.isArray(rule[nested])) rule[nested].forEach(visit);
  }
  config.module.rules.forEach(visit);
  return config;
} } };
