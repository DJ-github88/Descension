/**
 * Clear localStorage script for development
 * 
 * Run this in the browser console to clear localStorage and test character creation
 */

console.log('🧹 Clearing localStorage for fresh start...');

// Clear all mythrill-related localStorage
const keysToRemove = [];
for (let key in localStorage) {
  if (key.startsWith('mythrill-')) {
    keysToRemove.push(key);
  }
}

keysToRemove.forEach(key => {
  localStorage.removeItem(key);
  console.log(`Removed: ${key}`);
});

console.log(`✅ Cleared ${keysToRemove.length} localStorage items`);

// Also clear any other large items that might be taking up space
const allKeys = Object.keys(localStorage);
allKeys.forEach(key => {
  try {
    const value = localStorage.getItem(key);
    if (value && value.length > 10000) { // Items larger than 10KB
      console.log(`Large item found: ${key} (${(value.length / 1024).toFixed(1)}KB)`);
      // Uncomment the next line to remove large items
      // localStorage.removeItem(key);
    }
  } catch (error) {
    console.log(`Error checking ${key}:`, error);
  }
});

// Check current usage
let totalUsage = 0;
for (let key in localStorage) {
  if (localStorage.hasOwnProperty(key)) {
    totalUsage += localStorage[key].length + key.length;
  }
}

console.log(`📊 Current localStorage usage: ${(totalUsage / 1024).toFixed(1)}KB`);

// Enable development bypass if available
if (window.firebaseDebug) {
  console.log('🔧 Enabling development bypass...');
  window.firebaseDebug.enableDevelopmentBypass();
  
  // Wait a moment then check auth state
  setTimeout(() => {
    const authInfo = window.firebaseDebug.getAuthDebugInfo();
    console.log('🔍 Auth state after bypass:', authInfo);
  }, 1000);
}

console.log('✅ Ready for testing! Try creating a character now.');
