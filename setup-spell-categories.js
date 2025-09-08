// Script to set up spell categories in Firestore
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

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

// Spell categories data
const spellCategories = {
  damage: {
    name: "Damage Spells",
    description: "Offensive spells that deal damage to enemies",
    icon: "spell_fire_fireball02",
    color: "#FF4500",
    spellCount: 0
  },
  healing: {
    name: "Healing Spells",
    description: "Restorative spells that heal wounds and cure ailments",
    icon: "spell_holy_heal",
    color: "#32CD32",
    spellCount: 0
  },
  utility: {
    name: "Utility Spells",
    description: "Versatile spells for exploration and problem-solving",
    icon: "spell_arcane_teleportundercity",
    color: "#4169E1",
    spellCount: 0
  },
  protection: {
    name: "Protection Spells",
    description: "Defensive spells that shield and protect",
    icon: "spell_holy_devotionaura",
    color: "#FFD700",
    spellCount: 0
  },
  illusion: {
    name: "Illusion Spells",
    description: "Deceptive spells that manipulate perception",
    icon: "spell_shadow_charm",
    color: "#9370DB",
    spellCount: 0
  },
  elemental: {
    name: "Elemental Spells",
    description: "Spells that harness the power of the elements",
    icon: "spell_nature_lightning",
    color: "#00CED1",
    spellCount: 0
  }
};

async function setupSpellCategories() {
  try {
    console.log('🔥 Setting up spell categories in Firestore...');
    
    for (const [categoryId, categoryData] of Object.entries(spellCategories)) {
      const categoryRef = doc(db, 'spell_categories', categoryId);
      await setDoc(categoryRef, categoryData);
      console.log(`✅ Created category: ${categoryData.name}`);
    }
    
    console.log('🎉 All spell categories created successfully!');
    console.log('You can now check your Firebase Console to see the new spell_categories collection.');
    
  } catch (error) {
    console.error('❌ Error setting up spell categories:', error);
  }
}

// Run the setup
setupSpellCategories();
