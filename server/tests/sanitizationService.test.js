/**
 * Regression tests for sanitizationService.sanitizeObject — specifically that
 * string elements nested inside arrays are sanitized (they previously returned
 * early, letting HTML through array fields bypass sanitization).
 */
const { expect } = require('chai');
const { sanitizeObject } = require('../services/sanitizationService');

describe('sanitizationService', () => {
  it('sanitizes string elements nested in arrays', () => {
    const out = sanitizeObject({ tags: ['<img src=x onerror=alert(1)>', 'safe'] });
    expect(out.tags[0]).to.not.include('<');
    expect(out.tags[0]).to.not.include('onerror');
    expect(out.tags[1]).to.equal('safe');
  });

  it('sanitizes strings nested in arrays of objects', () => {
    const out = sanitizeObject({ items: [{ name: '<script>bad</script>ok' }] });
    expect(out.items[0].name).to.not.include('<script>');
    expect(out.items[0].name).to.include('ok');
  });

  it('still sanitizes top-level string fields', () => {
    const out = sanitizeObject({ label: '<b>hello</b>' });
    expect(out.label).to.not.include('<b>');
    expect(out.label).to.include('hello');
  });
});
