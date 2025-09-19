/**
 * Test script to verify Firebase fixes
 * 
 * Run this in the browser console to test the fixes:
 * 1. Firebase authentication state
 * 2. Character creation with proper error handling
 * 3. LocalStorage quota management
 */

// Test Firebase authentication and debugging
console.log('🧪 Testing Firebase fixes...');

// 1. Test authentication state debugging
if (window.firebaseDebug) {
  console.log('🔍 Testing authentication debug info...');
  const authInfo = window.firebaseDebug.getAuthDebugInfo();
  console.log('Auth Debug Info:', authInfo);
  
  // Test Firebase connection
  window.firebaseDebug.testFirebaseConnection().then(result => {
    console.log('🔥 Firebase connection test:', result);
  });
  
  // Get storage report
  const storageReport = window.firebaseDebug.getStorageReport();
  console.log('📊 Storage report:', storageReport);
} else {
  console.log('⚠️ Firebase debug tools not available');
}

// 2. Test character creation (if user is authenticated)
async function testCharacterCreation() {
  try {
    // Get character store
    const characterStore = window.useCharacterStore?.getState();
    if (!characterStore) {
      console.log('⚠️ Character store not available');
      return;
    }
    
    console.log('🧪 Testing character creation...');
    
    // Create a test character
    const testCharacter = {
      name: 'Test Character ' + Date.now(),
      race: 'Human',
      subrace: '',
      class: 'Fighter',
      background: 'Soldier',
      level: 1,
      stats: {
        strength: 15,
        agility: 14,
        constitution: 13,
        intelligence: 12,
        spirit: 10,
        charisma: 8
      },
      health: { current: 100, max: 100 },
      experience: 0,
      equipment: [],
      inventory: [],
      spells: [],
      skills: []
    };
    
    // Attempt to create character
    const result = await characterStore.createCharacter(testCharacter);
    console.log('✅ Character creation test result:', result);
    
    // Load characters to verify
    const characters = await characterStore.loadCharacters();
    console.log('📋 Current characters:', characters.length);
    
  } catch (error) {
    console.error('❌ Character creation test failed:', error);
  }
}

// 3. Test localStorage management
function testLocalStorageManagement() {
  console.log('🧪 Testing localStorage management...');
  
  // Try to access localStorage manager
  if (window.localStorageManager) {
    const stats = window.localStorageManager.getStorageStats();
    console.log('📊 Storage stats:', stats);
    
    // Test safe storage
    const testResult = window.localStorageManager.safeSetItem('test-key', 'test-value');
    console.log('💾 Safe storage test:', testResult);
    
    // Clean up test
    localStorage.removeItem('test-key');
  } else {
    console.log('⚠️ LocalStorage manager not available globally');
  }
}

// 4. Test development bypass (if in development)
function testDevelopmentBypass() {
  if (process.env.NODE_ENV === 'development' && window.firebaseDebug) {
    console.log('🧪 Testing development bypass...');
    
    // Enable bypass
    const enabled = window.firebaseDebug.enableDevelopmentBypass();
    console.log('🔧 Development bypass enabled:', enabled);
    
    // Check auth state
    setTimeout(() => {
      const authInfo = window.firebaseDebug.getAuthDebugInfo();
      console.log('🔍 Auth state after bypass:', authInfo);
      
      // Test character creation with bypass
      testCharacterCreation();
    }, 1000);
  }
}

// Run tests
console.log('🚀 Starting Firebase fix tests...');

// Test 1: Authentication debugging
setTimeout(() => {
  if (window.firebaseDebug) {
    window.firebaseDebug.getAuthDebugInfo();
  }
}, 1000);

// Test 2: LocalStorage management
testLocalStorageManagement();

// Test 3: Development bypass (if available)
testDevelopmentBypass();

// Test 4: Character creation (after auth state is established)
setTimeout(() => {
  testCharacterCreation();
}, 3000);

console.log('🧪 Firebase fix tests initiated. Check console for results.');
console.log('💡 Available debug commands:');
console.log('  - window.firebaseDebug.getAuthDebugInfo()');
console.log('  - window.firebaseDebug.testFirebaseConnection()');
console.log('  - window.firebaseDebug.enableDevelopmentBypass()');
console.log('  - window.firebaseDebug.getStorageReport()');
