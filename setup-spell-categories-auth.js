// Script to set up spell categories in Firestore with authentication
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');
const { getAuth, signInAnonymously } = require('firebase/auth');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDs9SSWy1J_aSX3LvHUBbI9fwi68cuaX7A",
  authDomain: "mythrill-ff7c6.firebaseapp.com",
  projectId: "mythrill-ff7c6",
  storageBucket: "mythrill-ff7c6.firebasestorage.app",
  messagingSenderId: "715658408409",
  appId: "1:715658408409:web:3a926eba858e529d66a9c8",
  measurementId: "G-WL4DX5LRYX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Spell categories data
const spellCategories = {
  damage: {
    name: "Damage Spells",
    description: "Offensive spells that deal damage to enemies",
    icon: "spell_fire_fireball02",
    color: "#8B4513",
    spellCount: 0
  },
  healing: {
    name: "Healing Spells",
    description: "Restorative spells that heal wounds and cure ailments",
    icon: "spell_holy_heal",
    color: "#2d5016",
    spellCount: 0
  },
  utility: {
    name: "Utility Spells",
    description: "Versatile spells for exploration and problem-solving",
    icon: "spell_arcane_teleportundercity",
    color: "#5a1e12",
    spellCount: 0
  },
  protection: {
    name: "Protection Spells",
    description: "Defensive spells that shield and protect",
    icon: "spell_holy_devotionaura",
    color: "#b8860b",
    spellCount: 0
  },
  illusion: {
    name: "Illusion Spells",
    description: "Deceptive spells that manipulate perception",
    icon: "spell_shadow_charm",
    color: "#8b7355",
    spellCount: 0
  },
  elemental: {
    name: "Elemental Spells",
    description: "Spells that harness the power of the elements",
    icon: "spell_nature_lightning",
    color: "#a08c70",
    spellCount: 0
  }
};

async function setupSpellCategories() {
  try {
    console.log('🔐 Signing in anonymously...');
    await signInAnonymously(auth);
    console.log('✅ Authenticated successfully');
    
    console.log('🔥 Setting up spell categories in Firestore...');
    
    for (const [categoryId, categoryData] of Object.entries(spellCategories)) {
      const categoryRef = doc(db, 'spell_categories', categoryId);
      await setDoc(categoryRef, categoryData);
      console.log(`✅ Created category: ${categoryData.name}`);
    }
    
    console.log('🎉 All spell categories created successfully!');
    console.log('You can now check your Firebase Console to see the new spell_categories collection.');
    console.log('Your Community Spells tab should now work with real data!');
    
  } catch (error) {
    console.error('❌ Error setting up spell categories:', error);
    console.log('💡 Tip: Make sure Anonymous authentication is enabled in Firebase Console');
    console.log('   Go to Authentication → Sign-in method → Anonymous → Enable');
  }
}

// Run the setup
setupSpellCategories();
