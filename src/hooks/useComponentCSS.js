import { useEffect, useRef } from 'react';
import cssLoader from '../utils/cssLoader';

/**
 * Hook to manage component-specific CSS loading and cleanup
 * @param {string} componentName - Unique identifier for the component
 * @param {string[]} cssFiles - Array of CSS file paths to load
 * @param {string} isolationClass - CSS class for isolation container
 * @param {boolean} enabled - Whether to load CSS (default: true)
 */
export const useComponentCSS = (componentName, cssFiles, isolationClass, enabled = true) => {
  const containerRef = useRef(null);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !componentName || !cssFiles?.length) {
      return;
    }

    let isMounted = true;

    const loadCSS = async () => {
      try {
        console.log(`🎨 Loading CSS for ${componentName}...`);
        await cssLoader.loadComponentCSS(componentName, cssFiles, isolationClass);
        
        if (isMounted) {
          isLoadedRef.current = true;
          console.log(`✅ CSS loaded successfully for ${componentName}`);
        }
      } catch (error) {
        console.error(`❌ Failed to load CSS for ${componentName}:`, error);
      }
    };

    loadCSS();

    // Cleanup function
    return () => {
      isMounted = false;
      
      if (isLoadedRef.current) {
        console.log(`🧹 Cleaning up CSS for ${componentName}...`);
        cssLoader.unloadComponentCSS(componentName);
        isLoadedRef.current = false;
      }
    };
  }, [componentName, cssFiles, isolationClass, enabled]);

  // Function to apply isolation to a container element
  const applyIsolation = (element) => {
    if (element && isolationClass) {
      cssLoader.addIsolationWrapper(element, isolationClass);
      containerRef.current = element;
    }
    return element;
  };

  // Function to remove isolation from container element
  const removeIsolation = () => {
    if (containerRef.current && isolationClass) {
      cssLoader.removeIsolationWrapper(containerRef.current, isolationClass);
      containerRef.current = null;
    }
  };

  return {
    isLoaded: isLoadedRef.current,
    applyIsolation,
    removeIsolation,
    containerRef
  };
};

/**
 * Hook specifically for spellbook components
 */
export const useSpellbookCSS = (enabled = true) => {
  // Import CSS dynamically using ES6 imports instead of link tags
  useEffect(() => {
    if (!enabled) return;

    let cleanupFunctions = [];

    const loadCSS = async () => {
      try {
        console.log('🎨 Loading spellbook CSS...');

        // Import CSS files dynamically
        await import('../components/spellcrafting-wizard/styles/spellbook-isolation.css');
        await import('../components/spellcrafting-wizard/styles/pathfinder/main.css');
        await import('../components/spellcrafting-wizard/styles/pathfinder/collections.css');

        console.log('✅ Spellbook CSS loaded successfully');
      } catch (error) {
        console.error('❌ Failed to load spellbook CSS:', error);
      }
    };

    loadCSS();

    return () => {
      // Cleanup function - CSS will be removed when component unmounts
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [enabled]);

  return {
    isLoaded: true, // CSS is loaded immediately with dynamic imports
    applyIsolation: (element) => {
      if (element) {
        element.classList.add('spellbook-isolated-container');
      }
      return element;
    },
    removeIsolation: () => {},
    containerRef: { current: null }
  };
};

/**
 * Hook specifically for creature wizard components
 */
export const useCreatureWizardCSS = (enabled = true) => {
  // Import CSS dynamically using ES6 imports instead of link tags
  useEffect(() => {
    if (!enabled) return;

    let cleanupFunctions = [];

    const loadCSS = async () => {
      try {
        console.log('🎨 Loading creature wizard CSS...');

        // Import CSS files dynamically
        await import('../components/creature-wizard/styles/creature-isolation.css');
        await import('../components/creature-wizard/styles/CreatureWizard.css');
        await import('../components/creature-wizard/styles/CreatureLibrary.css');
        await import('../components/creature-wizard/styles/CreatureWindow.css');
        await import('../components/creature-wizard/styles/CompactCreatureCard.css');
        await import('../components/creature-wizard/styles/LibraryStyleCreatureCard.css');
        await import('../components/creature-wizard/styles/CreatureInspectView.css');

        console.log('✅ Creature wizard CSS loaded successfully');
      } catch (error) {
        console.error('❌ Failed to load creature wizard CSS:', error);
      }
    };

    loadCSS();

    return () => {
      // Cleanup function - CSS will be removed when component unmounts
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [enabled]);

  return {
    isLoaded: true, // CSS is loaded immediately with dynamic imports
    applyIsolation: (element) => {
      if (element) {
        element.classList.add('creature-isolated-container');
      }
      return element;
    },
    removeIsolation: () => {},
    containerRef: { current: null }
  };
};

export default useComponentCSS;
