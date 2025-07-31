module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Disable CSS minimization entirely to avoid issues
      if (env === 'production') {
        // Remove all CSS minimizers
        webpackConfig.optimization.minimizer = webpackConfig.optimization.minimizer.filter(
          plugin => !plugin.constructor.name.includes('Css') && !plugin.constructor.name.includes('CSS')
        );

        // Also disable CSS optimization
        if (webpackConfig.optimization.splitChunks) {
          webpackConfig.optimization.splitChunks.cacheGroups = {
            ...webpackConfig.optimization.splitChunks.cacheGroups,
            styles: {
              name: 'styles',
              type: 'css/mini-extract',
              chunks: 'all',
              enforce: true,
              minSize: 0,
            },
          };
        }
      }

      return webpackConfig;
    },
  },
};
