import React from 'react';
import useSharedInventoryStore from '../../store/sharedInventoryStore';

/**
 * Project 4 H14 GM consumer: read-only views of inventories explicitly shared
 * by their owners for this session. Kept separate from the GM's own inventory.
 */
export default function GmInventorySharePanel() {
  const views = useSharedInventoryStore((state) => state.views);
  const entries = Object.values(views || {});

  if (entries.length === 0) {return null;}

  return (
    <div className="gm-shared-inventory" data-testid="gm-shared-inventory">
      <h4>Shared Inventories (read-only)</h4>
      {entries.map((view) => (
        <div key={view.characterId} className="gm-shared-inventory-entry">
          <strong>{view.characterId}</strong>
          {view.pending || !view.inventoryData
            ? <div>Waiting for the next inventory update…</div>
            : (
              <ul>
                {(view.inventoryData.items || []).map((item) => (
                  <li key={item.id}>{item.name || item.id}</li>
                ))}
              </ul>
            )}
        </div>
      ))}
    </div>
  );
}
