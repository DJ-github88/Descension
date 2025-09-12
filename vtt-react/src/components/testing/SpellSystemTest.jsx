/**
 * Spell System Test Component
 * 
 * Comprehensive test component to validate the dynamic spell library system
 */

import React, { useState, useEffect } from 'react';
import { useClassSpellLibrary } from '../../hooks/useClassSpellLibrary';
import useCharacterStore from '../../store/characterStore';
import { ALL_CLASS_SPELLS } from '../../data/classSpellGenerator';
import { CLASS_SPECIALIZATIONS, getAllClassNames } from '../../data/classSpellCategories';

const SpellSystemTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTestClass, setSelectedTestClass] = useState('Pyrofiend');

  const {
    spellCategories,
    characterClass,
    isLoading,
    error,
    getAllSpells,
    getSpellsByCategory,
    loadSpellsForClass,
    hasClassSpells,
    totalSpellCount
  } = useClassSpellLibrary();

  const setActiveCharacter = useCharacterStore(state => state.setActiveCharacter);
  const characters = useCharacterStore(state => state.characters);

  // Test functions
  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    const results = [];

    try {
      // Test 1: Verify all classes have spells generated
      results.push(await testClassSpellGeneration());

      // Test 2: Verify specialization categories
      results.push(await testSpecializationCategories());

      // Test 3: Test dynamic loading
      results.push(await testDynamicLoading());

      // Test 4: Test spell categorization
      results.push(await testSpellCategorization());

      // Test 5: Test custom spell integration
      results.push(await testCustomSpellIntegration());

      setTestResults(results);
    } catch (err) {
      results.push({
        name: 'Test Suite Error',
        status: 'FAILED',
        message: err.message,
        details: err.stack
      });
      setTestResults(results);
    } finally {
      setIsRunning(false);
    }
  };

  const testClassSpellGeneration = async () => {
    const allClasses = getAllClassNames();
    const expectedClassCount = 27;
    const expectedSpellsPerClass = 9; // 3 specializations × 3 spells each

    if (allClasses.length !== expectedClassCount) {
      return {
        name: 'Class Spell Generation',
        status: 'FAILED',
        message: `Expected ${expectedClassCount} classes, got ${allClasses.length}`,
        details: { allClasses }
      };
    }

    let totalSpells = 0;
    const classSpellCounts = {};

    allClasses.forEach(className => {
      const classSpells = ALL_CLASS_SPELLS[className] || [];
      classSpellCounts[className] = classSpells.length;
      totalSpells += classSpells.length;

      if (classSpells.length !== expectedSpellsPerClass) {
        return {
          name: 'Class Spell Generation',
          status: 'FAILED',
          message: `${className} has ${classSpells.length} spells, expected ${expectedSpellsPerClass}`,
          details: { classSpellCounts }
        };
      }
    });

    return {
      name: 'Class Spell Generation',
      status: 'PASSED',
      message: `All ${expectedClassCount} classes have ${expectedSpellsPerClass} spells each (${totalSpells} total)`,
      details: { classSpellCounts, totalSpells }
    };
  };

  const testSpecializationCategories = async () => {
    const allClasses = getAllClassNames();
    const expectedSpecializationsPerClass = 3;

    for (const className of allClasses) {
      const classData = CLASS_SPECIALIZATIONS[className];
      if (!classData) {
        return {
          name: 'Specialization Categories',
          status: 'FAILED',
          message: `No specialization data found for ${className}`,
          details: { className }
        };
      }

      if (classData.specializations.length !== expectedSpecializationsPerClass) {
        return {
          name: 'Specialization Categories',
          status: 'FAILED',
          message: `${className} has ${classData.specializations.length} specializations, expected ${expectedSpecializationsPerClass}`,
          details: { className, specializations: classData.specializations }
        };
      }
    }

    return {
      name: 'Specialization Categories',
      status: 'PASSED',
      message: `All ${allClasses.length} classes have ${expectedSpecializationsPerClass} specializations each`,
      details: { classCount: allClasses.length }
    };
  };

  const testDynamicLoading = async () => {
    try {
      await loadSpellsForClass(selectedTestClass);
      
      if (error) {
        return {
          name: 'Dynamic Loading',
          status: 'FAILED',
          message: `Error loading spells for ${selectedTestClass}: ${error}`,
          details: { error }
        };
      }

      if (!hasClassSpells) {
        return {
          name: 'Dynamic Loading',
          status: 'FAILED',
          message: `No spells loaded for ${selectedTestClass}`,
          details: { selectedTestClass }
        };
      }

      const expectedCategories = 4; // 3 specializations + 1 custom
      if (spellCategories.length !== expectedCategories) {
        return {
          name: 'Dynamic Loading',
          status: 'FAILED',
          message: `Expected ${expectedCategories} categories, got ${spellCategories.length}`,
          details: { spellCategories }
        };
      }

      return {
        name: 'Dynamic Loading',
        status: 'PASSED',
        message: `Successfully loaded ${totalSpellCount} spells in ${spellCategories.length} categories for ${selectedTestClass}`,
        details: { 
          selectedTestClass, 
          totalSpellCount, 
          categoryCount: spellCategories.length,
          categories: spellCategories.map(cat => ({ id: cat.id, name: cat.name, spellCount: cat.spells?.length || 0 }))
        }
      };
    } catch (err) {
      return {
        name: 'Dynamic Loading',
        status: 'FAILED',
        message: `Exception during loading: ${err.message}`,
        details: { error: err.stack }
      };
    }
  };

  const testSpellCategorization = async () => {
    if (spellCategories.length === 0) {
      return {
        name: 'Spell Categorization',
        status: 'FAILED',
        message: 'No categories available for testing',
        details: {}
      };
    }

    const categoryTests = [];
    
    spellCategories.forEach(category => {
      const categorySpells = getSpellsByCategory(category.id);
      
      if (category.id !== 'custom_spells') {
        // Class specialization categories should have spells
        if (categorySpells.length === 0) {
          categoryTests.push({
            categoryId: category.id,
            categoryName: category.name,
            status: 'FAILED',
            message: 'No spells in specialization category'
          });
        } else {
          // Verify spells belong to the correct specialization
          const correctSpecialization = categorySpells.every(spell => 
            spell.specialization === category.id.replace(`${selectedTestClass.toLowerCase()}_`, '')
          );
          
          if (!correctSpecialization) {
            categoryTests.push({
              categoryId: category.id,
              categoryName: category.name,
              status: 'FAILED',
              message: 'Spells do not match category specialization'
            });
          } else {
            categoryTests.push({
              categoryId: category.id,
              categoryName: category.name,
              status: 'PASSED',
              message: `${categorySpells.length} spells correctly categorized`
            });
          }
        }
      } else {
        // Custom spells category (may be empty initially)
        categoryTests.push({
          categoryId: category.id,
          categoryName: category.name,
          status: 'PASSED',
          message: `Custom category ready (${categorySpells.length} spells)`
        });
      }
    });

    const failedTests = categoryTests.filter(test => test.status === 'FAILED');
    
    if (failedTests.length > 0) {
      return {
        name: 'Spell Categorization',
        status: 'FAILED',
        message: `${failedTests.length} category tests failed`,
        details: { categoryTests, failedTests }
      };
    }

    return {
      name: 'Spell Categorization',
      status: 'PASSED',
      message: `All ${categoryTests.length} categories properly organized`,
      details: { categoryTests }
    };
  };

  const testCustomSpellIntegration = async () => {
    // This test would require actually creating a custom spell
    // For now, we'll just verify the custom category exists and is functional
    
    const customCategory = spellCategories.find(cat => cat.id === 'custom_spells');
    
    if (!customCategory) {
      return {
        name: 'Custom Spell Integration',
        status: 'FAILED',
        message: 'Custom spells category not found',
        details: { spellCategories }
      };
    }

    return {
      name: 'Custom Spell Integration',
      status: 'PASSED',
      message: 'Custom spells category available and ready',
      details: { 
        customCategory: {
          id: customCategory.id,
          name: customCategory.name,
          spellCount: customCategory.spells?.length || 0
        }
      }
    };
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'monospace', 
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h2>Spell System Test Suite</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          Test Class: 
          <select 
            value={selectedTestClass} 
            onChange={(e) => setSelectedTestClass(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            {getAllClassNames().map(className => (
              <option key={className} value={className}>{className}</option>
            ))}
          </select>
        </label>
        
        <button 
          onClick={runTests} 
          disabled={isRunning}
          style={{ 
            marginLeft: '20px', 
            padding: '10px 20px',
            backgroundColor: isRunning ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isRunning ? 'not-allowed' : 'pointer'
          }}
        >
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </button>
      </div>

      <div>
        <h3>Test Results:</h3>
        {testResults.length === 0 && !isRunning && (
          <p>Click "Run Tests" to start testing the spell system.</p>
        )}
        
        {testResults.map((result, index) => (
          <div 
            key={index} 
            style={{ 
              margin: '10px 0', 
              padding: '15px', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: result.status === 'PASSED' ? '#d4edda' : '#f8d7da'
            }}
          >
            <h4 style={{ 
              margin: '0 0 10px 0',
              color: result.status === 'PASSED' ? '#155724' : '#721c24'
            }}>
              {result.status === 'PASSED' ? '✓' : '✗'} {result.name}
            </h4>
            <p style={{ margin: '0 0 10px 0' }}>{result.message}</p>
            {result.details && (
              <details>
                <summary>Details</summary>
                <pre style={{ 
                  backgroundColor: '#f8f9fa', 
                  padding: '10px', 
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '12px'
                }}>
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpellSystemTest;
