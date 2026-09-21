import * as THREE from 'three';
import { applySunOnlyShadowMask, SUN_ONLY_SHADOW_MASK } from '../sunOnlyShadowMask';

describe('sunOnlyShadowMask', () => {
  it('replaces the shadow mask include with a directional-only mask', () => {
    const material = applySunOnlyShadowMask(new THREE.ShadowMaterial());
    const shader = { fragmentShader: 'void main() {\n#include <shadowmask_pars_fragment>\n}' };

    material.onBeforeCompile(shader);

    expect(shader.fragmentShader).toContain('float getShadowMask()');
    expect(shader.fragmentShader).not.toContain('shadowmask_pars_fragment');
    expect(shader.fragmentShader).toContain('NUM_DIR_LIGHT_SHADOWS');
    expect(shader.fragmentShader).toContain('directionalShadowMap');
    expect(shader.fragmentShader).not.toMatch(/NUM_POINT_LIGHT_SHADOWS/);
    expect(shader.fragmentShader).not.toMatch(/NUM_SPOT_LIGHT_SHADOWS/);
  });

  it('keeps the patched program out of the shared ShadowMaterial cache', () => {
    const material = applySunOnlyShadowMask(new THREE.ShadowMaterial());
    expect(material.customProgramCacheKey()).toBe('sun-only-shadow-mask');
  });

  it('returns the material and tolerates invalid input', () => {
    const material = new THREE.ShadowMaterial();
    expect(applySunOnlyShadowMask(material)).toBe(material);
    expect(applySunOnlyShadowMask(null)).toBeNull();
  });

  it('exports a mask that falls back to fully lit without shadow maps', () => {
    expect(SUN_ONLY_SHADOW_MASK).toContain('float shadow = 1.0;');
  });
});
