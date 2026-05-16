import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { getCreatureTokenIconUrl, getIconUrl } from '../../utils/assetManager';
import { isTokenUnlocked } from '../../data/summonableTokens';
import TooltipPortal from '../tooltips/TooltipPortal';
import UnifiedContextMenu from '../level-editor/UnifiedContextMenu';
import '../../styles/unified-context-menu.css';

const TYPE_COLORS = {
  aberration: '#9932CC', beast: '#8B4513', celestial: '#FFD700', construct: '#708090',
  dragon: '#DC143C', elemental: '#20B2AA', fey: '#9370DB', fiend: '#8B0000',
  giant: '#A0522D', humanoid: '#4682B4', monstrosity: '#556B2F', ooze: '#32CD32',
  plant: '#228B22', undead: '#4B0082',
};

const getTypeColor = (type) => TYPE_COLORS[(type || '').toLowerCase()] || '#7a3b2e';
const formatTypeName = (t) => t ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : 'Unknown';
const formatSizeName = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : 'Medium';

const SummonTokenCard = ({ template, character, onDragStart, onDragEnd, onClick, onCustomize }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState(null);
  const cardRef = useRef(null);

  const unlocked = isTokenUnlocked(template, character);
  const isPermanent = template.duration.unit === 'permanent';
  const qty = typeof template.quantity === 'number' ? template.quantity : 1;
  const typeColor = getTypeColor(template.creature.type);
  const maxHp = template.creature.stats?.maxHp || 10;
  const speed = template.creature.stats?.speed || 0;

  const iconUrl = template.creature.tokenIcon
    ? getCreatureTokenIconUrl(template.creature.tokenIcon, template.creature.type)
    : null;

  const handleMouseEnter = (e) => {
    if (!unlocked) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 5 });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => setShowTooltip(false);

  const handleDragStart = (e) => {
    if (!unlocked) { e.preventDefault(); return; }
    e.dataTransfer.setData('application/summon-token', JSON.stringify({
      templateId: template.id,
      templateName: template.name,
    }));
    e.dataTransfer.effectAllowed = 'copy';
    if (onDragStart) onDragStart(template, e);
  };

  const handleDragEnd = (e) => { if (onDragEnd) onDragEnd(template, e); };

  const handleClick = (e) => {
    if (!unlocked) return;
    if (onClick) onClick(template, e);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const getContextMenuItems = () => {
    const items = [];

    items.push({
      icon: <i className="fas fa-crosshairs" style={{ color: '#7a3b2e' }}></i>,
      label: 'Quick Place on Grid',
      onClick: () => { if (onClick) onClick(template); setContextMenu(null); },
    });

    if (onCustomize) {
      items.push({
        icon: <i className="fas fa-edit" style={{ color: '#d4af37' }}></i>,
        label: 'Customize & Place',
        onClick: () => { onCustomize(template); setContextMenu(null); },
      });
    }

    items.push({ type: 'separator' });

    items.push({
      icon: <i className="fas fa-image" style={{ color: '#4682B4' }}></i>,
      label: 'Change Icon',
      onClick: () => { if (onCustomize) onCustomize(template, 'icon'); setContextMenu(null); },
    });

    items.push({
      icon: <i className="fas fa-magic" style={{ color: '#9370DB' }}></i>,
      label: 'Edit Abilities',
      onClick: () => { if (onCustomize) onCustomize(template, 'abilities'); setContextMenu(null); },
    });

    items.push({
      icon: <i className="fas fa-heart" style={{ color: '#DC143C' }}></i>,
      label: 'Edit Stats',
      onClick: () => { if (onCustomize) onCustomize(template, 'stats'); setContextMenu(null); },
    });

    items.push({ type: 'separator' });

    items.push({
      icon: <i className="fas fa-tag" style={{ color: '#7a3b2e' }}></i>,
      label: 'Rename',
      onClick: () => { if (onCustomize) onCustomize(template, 'name'); setContextMenu(null); },
    });

    if (template.creature.abilities && template.creature.abilities.length > 0) {
      items.push({
        icon: <i className="fas fa-scroll" style={{ color: '#8B4513' }}></i>,
        label: 'View Abilities',
        submenu: template.creature.abilities.slice(0, 8).map((a, i) => ({
          icon: <i className="fas fa-bolt" style={{ color: '#d4af37', fontSize: '9px' }}></i>,
          label: typeof a === 'string' ? a : a.name,
          onClick: () => setContextMenu(null),
        })),
      });
    }

    return items;
  };

  const costLabels = Object.entries(template.resourceCost || {})
    .filter(([key]) => key !== 'actionPoints')
    .filter(([_, val]) => val !== 0 && val !== undefined)
    .map(([key, val]) => {
      const name = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return `${typeof val === 'number' ? (val < 0 ? '+' + Math.abs(val) : val) : val} ${name}`;
    });

  return (
    <>
      <div
        ref={cardRef}
        className="compact-creature-card wow-style-card"
        draggable={unlocked}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: unlocked ? 'grab' : 'not-allowed',
          opacity: unlocked ? 1 : 0.5,
          width: '100%',
          padding: '8px 10px',
          position: 'relative',
          filter: unlocked ? 'none' : 'grayscale(40%)',
          transition: 'box-shadow 0.15s ease, transform 0.1s ease',
          userSelect: 'none',
          boxSizing: 'border-box',
        }}
      >
        {!unlocked && (
          <div style={{
            position: 'absolute', top: '4px', right: '6px',
            fontSize: '9px', color: '#b22222', fontWeight: 'bold',
            fontFamily: "'Bookman Old Style', serif",
          }}>
            Lv{template.level}
          </div>
        )}

        <div className="compact-card-header" style={{ gap: '10px', alignItems: 'center' }}>
          <div
            className="compact-creature-icon"
            style={{
              width: '40px', height: '40px', minWidth: '40px',
              backgroundImage: iconUrl ? `url(${iconUrl})` : 'none',
              backgroundSize: 'cover', backgroundPosition: 'center',
              borderRadius: '50%',
              border: `2px solid ${typeColor}`,
              boxShadow: `0 0 6px ${typeColor}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: '#e6dcc6',
            }}
          >
            {!iconUrl && (
              <span style={{ color: '#7a3b2e', fontSize: '18px', fontWeight: 'bold' }}>
                {template.name.charAt(0)}
              </span>
            )}
          </div>

          <div className="compact-creature-name-type" style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
            <h2 className="compact-creature-name" style={{
              fontSize: '11px', lineHeight: '1.2',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              margin: 0,
            }}>
              {template.name}
            </h2>
            <div className="compact-creature-type-size" style={{ marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="compact-creature-type" style={{
                backgroundColor: typeColor, fontSize: '8px', padding: '1px 5px',
              }}>
                {formatTypeName(template.creature.type)}
              </span>
              <span className="compact-creature-size" style={{ fontSize: '8px' }}>
                {formatSizeName(template.creature.size)}
              </span>
            </div>
            <div style={{
              display: 'flex', gap: '8px', marginTop: '3px',
              fontSize: '8px', color: '#5a5a5a', alignItems: 'center',
            }}>
              <span><i className="fas fa-heart" style={{ color: '#DC143C', fontSize: '7px' }}></i> {maxHp}</span>
              {speed > 0 && <span><i className="fas fa-shoe-prints" style={{ fontSize: '7px' }}></i> {speed}</span>}
              {isPermanent
                ? <span style={{ color: '#228b22' }}>Permanent</span>
                : <span>{template.duration.value}{template.duration.unit === 'rounds' ? 'rd' : 'min'}</span>
              }
              {qty > 1 && <span style={{ color: '#d4af37' }}>x{qty}</span>}
            </div>
          </div>
        </div>
      </div>

      {showTooltip && unlocked && (
        <TooltipPortal>
          <div style={{
            position: 'fixed',
            left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px`,
            transform: 'translate(-50%, -100%)',
            background: 'linear-gradient(135deg, rgba(240, 230, 210, 0.98), rgba(213, 203, 176, 0.98))',
            border: '2px solid #a08c70',
            borderRadius: '6px',
            padding: '8px 10px',
            maxWidth: '260px',
            zIndex: 99999,
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            fontFamily: "'Bookman Old Style', 'Garamond', serif",
            color: '#3a3a3a',
          }}>
            <div style={{ color: '#7a3b2e', fontSize: '12px', fontWeight: 'bold', marginBottom: '3px' }}>
              {template.name}
            </div>
            <div style={{ color: '#5a5a5a', fontSize: '9px', marginBottom: '4px', lineHeight: '1.3' }}>
              {template.description}
            </div>
            <div style={{ color: '#7a3b2e', fontSize: '9px', marginBottom: '2px' }}>
              {formatTypeName(template.creature.type)} | {formatSizeName(template.creature.size)} | HP: {maxHp}
            </div>
            {template.creature.abilities && template.creature.abilities.length > 0 && (
              <div style={{ color: '#5a5a5a', fontSize: '8px', marginTop: '3px',
                borderTop: '1px solid rgba(160, 140, 112, 0.5)', paddingTop: '3px' }}>
                {template.creature.abilities.slice(0, 3).map((a, i) => (
                  <div key={i} style={{ marginBottom: '1px' }}>- {typeof a === 'string' ? a : a.name}</div>
                ))}
              </div>
            )}
            {costLabels.length > 0 && (
              <div style={{ color: '#d4af37', fontSize: '8px', marginTop: '3px',
                borderTop: '1px solid rgba(160, 140, 112, 0.5)', paddingTop: '3px' }}>
                Cost: {costLabels.join(', ')}
              </div>
            )}
            <div style={{ color: '#a08c70', fontSize: '8px', marginTop: '4px', fontStyle: 'italic' }}>
              Drag to grid | Right-click to customize
            </div>
          </div>
        </TooltipPortal>
      )}

      {contextMenu && createPortal(
        <UnifiedContextMenu
          visible={true}
          x={contextMenu.x}
          y={contextMenu.y}
          title={template.name}
          items={getContextMenuItems()}
          onClose={() => setContextMenu(null)}
        />,
        document.body
      )}
    </>
  );
};

export default SummonTokenCard;
