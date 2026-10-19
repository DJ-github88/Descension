import React, { useState } from 'react';

const KEY = 'mythrill.actorConsequenceLayer.collapsed';
const readCollapsed = () => { try { return window.localStorage.getItem(KEY) === '1'; } catch (_) { return false; } };
const writeCollapsed = value => { try { window.localStorage.setItem(KEY, value ? '1' : '0'); } catch (_) { /* per-device convenience only */ } };

/**
 * Right-edge column for the attachment, strike, spell and blocking adjudication panels (P12 integration
 * closure, 2026-10-18). The column is height-bounded and can be collapsed to a single chip, so the map and
 * creature ability controls underneath stay reachable. Collapsing hides presentation only: no approval,
 * offer or pending command changes, and nothing is dismissed.
 */
export default function ActorConsequenceLayer({ children }) {
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const toggle = () => setCollapsed(value => { writeCollapsed(!value); return !value; });
  return <div className={`actor-consequence-layer${collapsed ? ' acl-collapsed' : ''}`}>
    <button type="button" className="acl-toggle" aria-expanded={!collapsed} onClick={toggle}
      aria-label={collapsed ? 'Show combat adjudication' : 'Hide combat adjudication'}>
      {collapsed ? 'Combat adjudication ▸' : 'Hide ▾'}
    </button>
    {children}
  </div>;
}
