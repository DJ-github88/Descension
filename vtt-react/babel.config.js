module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    // Only enable React Refresh in development
    process.env.NODE_ENV === 'development' && 'react-refresh/babel'
  ].filter(Boolean)
};
