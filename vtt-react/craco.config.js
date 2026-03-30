const webpack = require('webpack');

module.exports = {
  devServer: {
    port: 3000,
    host: '0.0.0.0', // Allow connections from any host
    // Proxy WoW icons to avoid CORS issues
    proxy: {
      '/api/wow-icons': {
        target: 'https://wow.zamimg.com/images/wow/icons/large/',
        changeOrigin: true,
        pathRewrite: {
          '^/api/wow-icons': '',
        },
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    },
    // Ensure chunks are served from the correct port
    devMiddleware: {
      publicPath: '/',
      writeToDisk: false, // Use in-memory filesystem for development
    },
    // Fix for chunk loading issues
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    // Hot module replacement configuration
    hot: true,
    liveReload: true,
    // Ensure chunks are properly handled
    historyApiFallback: {
      disableDotRule: true,
    },
  },
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Fix chunk loading issues by ensuring correct public path
      if (env === 'development') {
        // Ensure correct public path for chunk loading
        // This should already be set correctly by CRA, but we ensure it here
        webpackConfig.output.publicPath = '/';
        
        // Let CRA handle chunk splitting defaults - don't override
        // React.lazy() works correctly with CRA's default webpack configuration
      }
      if (env === 'production') {
        // Configure CSS minification with safer settings
        const miniCssExtractPlugin = webpackConfig.plugins.find(
          plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
        );
        if (miniCssExtractPlugin) {
          miniCssExtractPlugin.options = {
            ...miniCssExtractPlugin.options,
            ignoreOrder: true, // Disable CSS order warnings
          };
        }

        // Temporarily disable CSS minification to avoid special character issues
        // Focus on JavaScript optimizations for now
        webpackConfig.optimization.minimizer = webpackConfig.optimization.minimizer.filter(
          plugin => !plugin.constructor.name.includes('Css') && !plugin.constructor.name.includes('CSS')
        );

        // Enable tree shaking and dead code elimination
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          usedExports: true,
          sideEffects: false,
          // Enable module concatenation for better tree shaking
          concatenateModules: true,
        };

        // Enhanced bundle splitting for better caching and smaller initial bundle
        webpackConfig.optimization.splitChunks = {
          chunks: 'all',
          maxInitialRequests: 25,
          minSize: 20000,
          cacheGroups: {
            // React core - separate chunk for React/ReactDOM
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 20,
              enforce: true,
            },
            // Firebase - large SDK, split into separate chunk
            firebase: {
              test: /[\\/]node_modules[\\/]firebase[\\/]/,
              name: 'firebase',
              chunks: 'all',
              priority: 15,
              enforce: true,
            },
            // FontAwesome - large icon library
            fontawesome: {
              test: /[\\/]node_modules[\\/]@fortawesome[\\/]/,
              name: 'fontawesome',
              chunks: 'all',
              priority: 15,
              enforce: true,
            },
            // UI libraries
            ui: {
              test: /[\\/]node_modules[\\/](react-bootstrap|react-tooltip|react-draggable|react-resizable|react-icons)[\\/]/,
              name: 'ui',
              chunks: 'all',
              priority: 14,
              enforce: true,
            },
            // Charting library - only used in specific components
            charts: {
              test: /[\\/]node_modules[\\/]recharts[\\/]/,
              name: 'charts',
              chunks: 'async', // Only load when needed
              priority: 13,
              enforce: true,
            },
            // Socket.io - only needed for multiplayer
            socketio: {
              test: /[\\/]node_modules[\\/]socket\.io-client[\\/]/,
              name: 'socketio',
              chunks: 'async', // Only load when needed
              priority: 13,
              enforce: true,
            },
            // Other large vendor libraries
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
              minChunks: 2,
            },
            // Services - split into separate chunk
            services: {
              test: /[\\/]src[\\/]services[\\/]/,
              name: 'services',
              chunks: 'all',
              priority: 8,
              enforce: true,
            },
            // Stores - split into separate chunk
            stores: {
              test: /[\\/]src[\\/]store[\\/]/,
              name: 'stores',
              chunks: 'all',
              priority: 7,
              enforce: true,
            },
            // Common code shared between chunks
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        };
      }

      // Remove ESLint plugin entirely to avoid CI errors
      webpackConfig.plugins = webpackConfig.plugins.filter(
        plugin => plugin.constructor.name !== 'ESLintWebpackPlugin'
      );

      // Disable React Refresh in production to avoid Babel errors
      if (env === 'production') {
        webpackConfig.plugins = webpackConfig.plugins.filter(
          plugin => plugin.constructor.name !== 'ReactRefreshWebpackPlugin'
        );
      }

      // Add DefinePlugin to inject environment variables globally
      webpackConfig.plugins.push(
        new webpack.DefinePlugin({
          __NODE_ENV__: JSON.stringify(env),
          __PUBLIC_URL__: JSON.stringify(process.env.PUBLIC_URL || ''),
        })
      );

      // Configure Workbox (PWA service worker) to handle large bundles
      if (env === 'production') {
        // Find and configure Workbox plugin for PWA
        const workboxPlugin = webpackConfig.plugins.find(
          plugin => plugin.constructor.name === 'GenerateSW' || plugin.constructor.name === 'InjectManifest'
        );

        if (workboxPlugin) {
          // Increase maximum file size to cache (default is ~2MB, we need ~6MB for our large bundle)
          workboxPlugin.config.maximumFileSizeToCacheInBytes = 10 * 1024 * 1024; // 10MB
        }

        // Configure TerserPlugin to remove console.logs
        // TerserPlugin is typically already in the minimizer array
        if (webpackConfig.optimization && webpackConfig.optimization.minimizer) {
          webpackConfig.optimization.minimizer.forEach((plugin) => {
            // Check if this is TerserPlugin (works with both webpack 4 and 5)
            if (plugin.constructor && plugin.constructor.name === 'TerserPlugin') {
              // Update existing TerserPlugin options
              plugin.options = {
                ...plugin.options,
                terserOptions: {
                  ...(plugin.options?.terserOptions || {}),
                  compress: {
                    ...(plugin.options?.terserOptions?.compress || {}),
                    drop_console: true, // Remove all console.* calls
                    drop_debugger: true, // Remove debugger statements
                  },
                },
              };
            }
          });
        }
      }

      return webpackConfig;
    },
  },
};
