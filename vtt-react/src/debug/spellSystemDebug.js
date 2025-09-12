/**
 * Debug utility to check spell system data
 */

import { CLASS_SPECIALIZATIONS } from '../data/classSpellCategories';
import { ALL_CLASS_SPELLS } from '../data/classSpellGenerator';

// Debug function to check what classes are available
export const debugSpellSystem = () => {
  console.log('🔍 Spell System Debug Report');
  console.log('============================');
  
  console.log('\n📂 Available Classes in CLASS_SPECIALIZATIONS:');
  const availableClasses = Object.keys(CLASS_SPECIALIZATIONS);
  console.log(availableClasses);
  
  console.log('\n📚 Available Classes in ALL_CLASS_SPELLS:');
  const spellClasses = Object.keys(ALL_CLASS_SPELLS);
  console.log(spellClasses);
  
  console.log('\n🔍 Looking for "Gambler":');
  console.log('In CLASS_SPECIALIZATIONS:', CLASS_SPECIALIZATIONS['Gambler'] ? 'FOUND' : 'NOT FOUND');
  console.log('In ALL_CLASS_SPELLS:', ALL_CLASS_SPELLS['Gambler'] ? 'FOUND' : 'NOT FOUND');
  
  if (CLASS_SPECIALIZATIONS['Gambler']) {
    console.log('Gambler specializations:', CLASS_SPECIALIZATIONS['Gambler'].specializations.map(s => s.name));
  }
  
  if (ALL_CLASS_SPELLS['Gambler']) {
    console.log('Gambler spells count:', ALL_CLASS_SPELLS['Gambler'].length);
    console.log('Gambler spells:', ALL_CLASS_SPELLS['Gambler'].map(s => s.name));
  }
  
  console.log('\n📊 Summary:');
  console.log(`Total classes with specializations: ${availableClasses.length}`);
  console.log(`Total classes with spells: ${spellClasses.length}`);
  
  const totalSpells = Object.values(ALL_CLASS_SPELLS).reduce((sum, spells) => sum + spells.length, 0);
  console.log(`Total spells generated: ${totalSpells}`);
  
  return {
    availableClasses,
    spellClasses,
    hasGamblerSpecs: !!CLASS_SPECIALIZATIONS['Gambler'],
    hasGamblerSpells: !!ALL_CLASS_SPELLS['Gambler'],
    totalSpells
  };
};

// Auto-run in development
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    debugSpellSystem();
  }, 2000);
}
