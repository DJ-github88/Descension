// Firebase Setup Verification Script
// Run this with: node firebase-setup-check.js

console.log('🔥 Firebase Setup Verification\n');

// Check environment variables
console.log('📋 Environment Variables Check:');
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID'
];

// Load environment variables from .env file
require('dotenv').config();

let envVarsOk = true;
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    envVarsOk = false;
  }
});

console.log('\n📝 Firebase Project Setup Checklist:');
console.log('Please verify the following in your Firebase Console:');
console.log('');
console.log('1. 🔐 Authentication Setup:');
console.log('   - Go to Firebase Console > Authentication');
console.log('   - Click "Get started" if not already done');
console.log('   - Go to "Sign-in method" tab');
console.log('   - Enable "Email/Password" provider');
console.log('   - Enable "Google" provider');
console.log('   - Add your domain (localhost:3000) to authorized domains');
console.log('');
console.log('2. 🗄️ Firestore Database Setup:');
console.log('   - Go to Firebase Console > Firestore Database');
console.log('   - Click "Create database"');
console.log('   - Choose "Start in test mode"');
console.log('   - Select a location');
console.log('');
console.log('3. 🌐 Web App Configuration:');
console.log('   - Go to Firebase Console > Project Settings');
console.log('   - Scroll to "Your apps" section');
console.log('   - Ensure you have a web app registered');
console.log('   - Copy the config values to your .env file');
console.log('');
console.log('4. 🔒 Security Rules (for production):');
console.log('   - Update Firestore security rules');
console.log('   - Configure Authentication rules');
console.log('');

if (envVarsOk) {
  console.log('✅ Environment variables are configured correctly!');
} else {
  console.log('❌ Some environment variables are missing.');
  console.log('Please check your .env file in the vtt-react folder.');
}

console.log('\n🚀 Next Steps:');
console.log('1. Ensure all Firebase services are enabled in your project');
console.log('2. Check browser console for detailed error messages');
console.log('3. Test authentication by trying to sign in');
console.log('4. If issues persist, check Firebase project permissions');

console.log('\n📞 Need Help?');
console.log('- Firebase Console: https://console.firebase.google.com/');
console.log('- Firebase Auth Docs: https://firebase.google.com/docs/auth');
console.log('- Firestore Docs: https://firebase.google.com/docs/firestore');
