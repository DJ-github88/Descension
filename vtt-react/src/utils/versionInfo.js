/**
 * Version Information and Deployment Tracking
 * Helps identify which version is running in different environments
 */

// Get build-time environment variables
const getBuildInfo = () => {
  return {
    // Injected at build time by GitHub Actions or Netlify
    commitSha: process.env.REACT_APP_COMMIT_SHA || 'unknown',
    buildTime: process.env.REACT_APP_BUILD_TIME || 'unknown',
    branch: process.env.REACT_APP_BRANCH || 'unknown',
    buildMode: process.env.REACT_APP_BUILD_MODE || 'development',
    environment: process.env.REACT_APP_ENV || process.env.NODE_ENV || 'development',
    
    // Runtime information
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
  };
};

// Get version from package.json
const getPackageVersion = () => {
  try {
    // This will be replaced at build time
    return process.env.REACT_APP_VERSION || '0.1.3';
  } catch {
    return 'unknown';
  }
};

// Determine deployment environment
export const getDeploymentEnvironment = () => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return 'development';
  } else if (hostname.includes('netlify.app') || hostname.includes('netlify.com')) {
    return 'netlify-production';
  } else if (hostname.includes('railway.app')) {
    return 'railway-production';
  } else if (hostname.includes('vercel.app')) {
    return 'vercel-production';
  } else {
    return 'production';
  }
};

// Main version info object
export const versionInfo = {
  ...getBuildInfo(),
  packageVersion: getPackageVersion(),
  deploymentEnvironment: getDeploymentEnvironment(),
  
  // Helper methods
  isProduction: () => getDeploymentEnvironment() !== 'development',
  isDevelopment: () => getDeploymentEnvironment() === 'development',
  isNetlify: () => getDeploymentEnvironment() === 'netlify-production',
  
  // Get short commit hash
  getShortCommit: () => {
    const sha = getBuildInfo().commitSha;
    return sha && sha !== 'unknown' ? sha.substring(0, 7) : 'unknown';
  },
  
  // Get formatted version string
  getVersionString: () => {
    const info = getBuildInfo();
    const shortCommit = info.commitSha && info.commitSha !== 'unknown' 
      ? info.commitSha.substring(0, 7) 
      : 'dev';
    return `v${getPackageVersion()}-${shortCommit}`;
  },
  
  // Get full deployment info
  getDeploymentInfo: () => {
    const info = getBuildInfo();
    return {
      version: getPackageVersion(),
      commit: info.commitSha,
      shortCommit: info.commitSha && info.commitSha !== 'unknown' 
        ? info.commitSha.substring(0, 7) 
        : 'dev',
      branch: info.branch,
      buildTime: info.buildTime,
      environment: getDeploymentEnvironment(),
      buildMode: info.buildMode,
      timestamp: info.timestamp
    };
  }
};

// Console logging for debugging
export const logVersionInfo = () => {
  const info = versionInfo.getDeploymentInfo();
  
  console.group('🔍 Version Information');
  console.log('📦 Version:', info.version);
  console.log('🔗 Commit:', info.commit);
  console.log('🌿 Branch:', info.branch);
  console.log('🏗️ Build Time:', info.buildTime);
  console.log('🌍 Environment:', info.environment);
  console.log('⚙️ Build Mode:', info.buildMode);
  console.log('🕐 Runtime:', info.timestamp);
  console.groupEnd();
  
  // Add to window for debugging
  if (typeof window !== 'undefined') {
    window.versionInfo = info;
  }
};

// Auto-log in development
if (versionInfo.isDevelopment()) {
  logVersionInfo();
}

// Deployment sync system - fully operational with new Netlify site
// Last updated: 2025-08-30 - Clean deployment pipeline established

export default versionInfo;
