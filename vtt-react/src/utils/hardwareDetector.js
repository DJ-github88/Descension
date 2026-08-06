/**
 * Hardware & GPU Performance Capability Detector
 * Automatically classifies user hardware into performance tiers (Low, Medium, High)
 * and generates invisible auto-tuning graphics profiles.
 */

export const PERFORMANCE_TIERS = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2
};

export const PERFORMANCE_PRESETS = {
  [PERFORMANCE_TIERS.LOW]: {
    tier: PERFORMANCE_TIERS.LOW,
    tierName: 'low',
    shadowQuality: 'off',
    antiAliasing: false,
    maxFPS: 30,
    particleEffects: false,
    textureQuality: 'low',
    effectsQuality: 'low',
    renderDistance: 1500,
    showDiceRollAnimations: true, // Keep 3D dice on, but low-res & low physics sub-steps
    reducedMotion: false,
    pixelRatioCap: 1.0
  },
  [PERFORMANCE_TIERS.MEDIUM]: {
    tier: PERFORMANCE_TIERS.MEDIUM,
    tierName: 'medium',
    shadowQuality: 'medium',
    antiAliasing: true,
    maxFPS: 60,
    particleEffects: true,
    textureQuality: 'medium',
    effectsQuality: 'medium',
    renderDistance: 3000,
    showDiceRollAnimations: true,
    reducedMotion: false,
    pixelRatioCap: 1.5
  },
  [PERFORMANCE_TIERS.HIGH]: {
    tier: PERFORMANCE_TIERS.HIGH,
    tierName: 'high',
    shadowQuality: 'high',
    antiAliasing: true,
    maxFPS: 120,
    particleEffects: true,
    textureQuality: 'high',
    effectsQuality: 'high',
    renderDistance: 5000,
    showDiceRollAnimations: true,
    reducedMotion: false,
    pixelRatioCap: 2.0
  }
};

/**
 * Detects current browser hardware capabilities and GPU tier.
 * @returns {Object} Hardware specs and recommended performance preset
 */
export function detectHardwareProfile() {
  let gpuVendor = 'Unknown';
  let gpuRenderer = 'Unknown';
  let maxTextureSize = 4096;
  let webGlSupported = false;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      webGlSupported = true;
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 4096;
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        gpuVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'Unknown';
        gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown';
      }
    }
  } catch (e) {
    console.warn('WebGL context probing failed:', e);
  }

  const logicalCores = navigator.hardwareConcurrency || 4;
  const deviceMemoryGB = navigator.deviceMemory || 4; // Approx RAM in GB (Chrome/Edge)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobileUserAgent = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent
  );

  const fullGpuString = `${gpuVendor} ${gpuRenderer}`.toLowerCase();

  // Integrated or software renderer detection
  const isIntegratedGpu = /intel|uhd|hd graphics|iris|mali|adreno|swiftshader|llvmpipe|software/i.test(
    fullGpuString
  );
  const isHighEndGpu = /nvidia|rtx|gtx|geforce|radeon|rx|apple m|apple gpu/i.test(
    fullGpuString
  );

  let calculatedTier = PERFORMANCE_TIERS.MEDIUM;

  if (!webGlSupported || isIntegratedGpu || logicalCores <= 4 || deviceMemoryGB <= 4 || maxTextureSize < 8192) {
    calculatedTier = PERFORMANCE_TIERS.LOW;
  } else if (isHighEndGpu && logicalCores >= 8 && deviceMemoryGB >= 8) {
    calculatedTier = PERFORMANCE_TIERS.HIGH;
  }

  // Force mobile devices with low RAM or integrated GPUs to LOW tier
  if (isMobileUserAgent && (deviceMemoryGB <= 4 || logicalCores <= 4)) {
    calculatedTier = PERFORMANCE_TIERS.LOW;
  }

  const preset = PERFORMANCE_PRESETS[calculatedTier];

  return {
    specs: {
      gpuVendor,
      gpuRenderer,
      isIntegratedGpu,
      isHighEndGpu,
      logicalCores,
      deviceMemoryGB,
      maxTextureSize,
      isTouchDevice,
      isMobileUserAgent
    },
    tier: calculatedTier,
    preset
  };
}
