import { sanitizeHtml } from '../sanitizeHtml';

describe('sanitizeHtml', () => {
  it('strips script tags and inline event handlers', () => {
    const out = sanitizeHtml('<p onclick="alert(1)">hi<img src=x onerror="alert(2)"></p>');
    expect(out).not.toMatch(/onclick/i);
    expect(out).not.toMatch(/onerror/i);
    expect(out).not.toMatch(/<script/i);
    expect(out).toContain('hi');
  });

  it('removes javascript: and data: URLs but keeps safe anchors', () => {
    const out = sanitizeHtml('<a href="javascript:alert(1)">x</a><a href="https://ok.example">y</a>');
    expect(out).not.toMatch(/javascript:/i);
    expect(out).toContain('href="https://ok.example"');
    expect(out).toContain('>y<');
  });

  it('strips embedded script content entirely', () => {
    const out = sanitizeHtml('before<script>alert(1)</script>after');
    expect(out).not.toContain('alert(1)');
    expect(out).toContain('before');
    expect(out).toContain('after');
  });

  it('keeps harmless formatting tags', () => {
    const out = sanitizeHtml('<strong>bold</strong> and <em>italic</em>');
    expect(out).toContain('<strong>bold</strong>');
    expect(out).toContain('<em>italic</em>');
  });

  it('handles empty/non-string input safely', () => {
    expect(sanitizeHtml('')).toBe('');
    expect(sanitizeHtml(null)).toBe('');
  });
});
