/**
 * Suppress native browser tooltips so unstyled default boxes never clash with custom tooltips,
 * without freezing stale generated aria-labels across React DOM node reuse.
 */
const INSTALLED_WINDOWS = new WeakMap();

export function installTooltipShim(targetWindow = typeof window !== 'undefined' ? window : null) {
  if (!targetWindow || typeof targetWindow.addEventListener !== 'function') {
    return () => {};
  }
  const existing = INSTALLED_WINDOWS.get(targetWindow);
  if (existing) {
    return existing;
  }

  const doc = targetWindow.document;

  const onMouseOver = (e) => {
    let el = e.target;
    while (el && el !== doc?.body) {
      if (el.hasAttribute) {
        if (el.hasAttribute('title')) {
          const titleVal = el.getAttribute('title');
          if (titleVal) {
            el.setAttribute('data-original-title', titleVal);
            // Only synthesize a temporary aria-label for icon-only controls (no visible text)
            // that do not already carry an explicit aria-label.
            const hasVisibleText = Boolean(el.textContent && el.textContent.trim());
            if (!hasVisibleText && (!el.hasAttribute('aria-label') || el.getAttribute('data-tooltip-aria-label') === 'true')) {
              el.setAttribute('aria-label', titleVal);
              el.setAttribute('data-tooltip-aria-label', 'true');
            }
            el.removeAttribute('title');
          }
        } else if (el.getAttribute('data-tooltip-aria-label') === 'true' && el.textContent && el.textContent.trim()) {
          // Control gained visible text while hovered: drop temporary generated aria-label.
          el.removeAttribute('aria-label');
          el.removeAttribute('data-tooltip-aria-label');
        }
      }
      el = el.parentElement;
    }
  };

  const onMouseOut = (e) => {
    let el = e.target;
    while (el && el !== doc?.body) {
      if (el.hasAttribute) {
        if (el.hasAttribute('data-original-title')) {
          el.setAttribute('title', el.getAttribute('data-original-title'));
          el.removeAttribute('data-original-title');
        }
        if (el.getAttribute('data-tooltip-aria-label') === 'true') {
          el.removeAttribute('aria-label');
          el.removeAttribute('data-tooltip-aria-label');
        }
      }
      el = el.parentElement;
    }
  };

  targetWindow.addEventListener('mouseover', onMouseOver, true);
  targetWindow.addEventListener('mouseout', onMouseOut, true);

  const uninstall = () => {
    targetWindow.removeEventListener('mouseover', onMouseOver, true);
    targetWindow.removeEventListener('mouseout', onMouseOut, true);
    if (INSTALLED_WINDOWS.get(targetWindow) === uninstall) {
      INSTALLED_WINDOWS.delete(targetWindow);
    }
  };

  INSTALLED_WINDOWS.set(targetWindow, uninstall);
  return uninstall;
}
