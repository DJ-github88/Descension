/**
 * Drop-in replacement for three's `shadowmask_pars_fragment` that only reads
 * directional (sun) shadow maps.
 *
 * The ground shadow receiver is a giant `ShadowMaterial` plane that overlays the
 * 2D map canvas. three multiplies every shadow-casting light into
 * `getShadowMask()` with no distance attenuation, so one torch cube map
 * darkened a range-sized, hard-edged wedge of the whole floor even where the
 * torch's falloff is zero ("torch shadow" wedges that ignore the light radius).
 * Sun shadows keep working; dynamic-light shadows stay on the 3D meshes, where
 * they are attenuated by the light itself.
 */
export const SUN_ONLY_SHADOW_MASK = /* glsl */ `
float getShadowMask() {

	float shadow = 1.0;

	#ifdef USE_SHADOWMAP

	#if NUM_DIR_LIGHT_SHADOWS > 0

	DirectionalLightShadow directionalLight;

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {

		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;

	}
	#pragma unroll_loop_end

	#endif

	#endif

	return shadow;

}
`;

/**
 * Patch a material so its shadow mask ignores spot/point lights. Returns the
 * material for chaining.
 */
export function applySunOnlyShadowMask(material) {
  if (!material || material.isMaterial !== true) return material;
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <shadowmask_pars_fragment>',
      SUN_ONLY_SHADOW_MASK
    );
  };
  // Keep the patched program out of the plain ShadowMaterial program cache.
  material.customProgramCacheKey = () => 'sun-only-shadow-mask';
  return material;
}
