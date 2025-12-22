#!/usr/bin/env node
/**
 * Environment Variable Validation Script
 * Validates all required environment variables are set before server startup
 */

const requiredEnvVars = {
  production: [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_SERVICE_ACCOUNT_KEY',
    'DEBUG_TOKEN' // Must be set and not default value
  ],
  development: [
    'FIREBASE_PROJECT_ID'
  ]
};

const optionalEnvVars = {
  all: [
    'NODE_ENV',
    'PORT',
    'RAILWAY_ENVIRONMENT',
    'ALLOWED_ORIGINS',
    'DEBUG_TOKEN'
  ]
};

function validateEnvironment() {
  const env = process.env.NODE_ENV || 'development';
  const isProduction = env === 'production' || process.env.RAILWAY_ENVIRONMENT;
  
  console.log(`🔍 Validating environment variables for ${env} mode...`);
  
  const required = isProduction ? requiredEnvVars.production : requiredEnvVars.development;
  const missing = [];
  const warnings = [];
  
  // Check required variables
  for (const varName of required) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }
  
  // Check for weak DEBUG_TOKEN in production
  if (isProduction && process.env.DEBUG_TOKEN) {
    if (process.env.DEBUG_TOKEN === 'dev-debug-token-change-in-production') {
      warnings.push('DEBUG_TOKEN is using default value - this is insecure in production');
    }
    if (process.env.DEBUG_TOKEN.length < 32) {
      warnings.push('DEBUG_TOKEN is too short (minimum 32 characters recommended)');
    }
  }
  
  // Check for placeholder CORS origins
  if (process.env.ALLOWED_ORIGINS && process.env.ALLOWED_ORIGINS.includes('your-custom-domain.com')) {
    warnings.push('ALLOWED_ORIGINS contains placeholder domain - replace with actual domain');
  }
  
  // Report results
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease set these variables before starting the server.');
    process.exit(1);
  }
  
  if (warnings.length > 0) {
    console.warn('⚠️  Environment variable warnings:');
    warnings.forEach(warning => {
      console.warn(`   - ${warning}`);
    });
    if (isProduction) {
      console.warn('\n⚠️  These warnings should be addressed before production deployment.');
    }
  }
  
  if (missing.length === 0 && warnings.length === 0) {
    console.log('✅ All environment variables validated successfully');
  }
  
  // Display current configuration (without sensitive values)
  console.log('\n📋 Current configuration:');
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   PORT: ${process.env.PORT || '3001'}`);
  console.log(`   FIREBASE_PROJECT_ID: ${process.env.FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}`);
  console.log(`   FIREBASE_SERVICE_ACCOUNT_KEY: ${process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   DEBUG_TOKEN: ${process.env.DEBUG_TOKEN ? (process.env.DEBUG_TOKEN.length > 20 ? '✅ Set (strong)' : '⚠️  Set (weak)') : '❌ Missing'}`);
  console.log(`   ALLOWED_ORIGINS: ${process.env.ALLOWED_ORIGINS ? '✅ Set' : 'Using defaults'}`);
  
  return missing.length === 0;
}

// Run validation if script is executed directly
if (require.main === module) {
  validateEnvironment();
}

module.exports = { validateEnvironment };

