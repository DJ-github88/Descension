import React from 'react';
import UnifiedSpellCard from './UnifiedSpellCard';
import ProcEffectDisplay from './ProcEffectDisplay';
import '../../styles/SpellCardWithProcs.css';

/**
 * SpellCardWithProcs Component
 * Wrapper component that displays a spell card alongside its proc effects
 * Allows viewing the complete spell and its proc effects without taking up space on the main card
 */
const SpellCardWithProcs = ({
  spell,
  variant = 'spellbook',
  showActions = false,
  showDescription = true,
  showStats = true,
  showTags = true,
  onEdit = null,
  onDelete = null,
  onDuplicate = null,
  onSelect = null,
  onClick = null,
  onContextMenu = null,
  isSelected = false,
  isDraggable = false,
  className = '',
  rollableTableData = null,
  categories = [],
  procPosition = 'right', // 'right', 'left', 'below'
  showProcs = true,
  ...props
}) => {
  // Check if spell has proc effects
  // mechanicsConfig can be either an array or an object
  const hasProcEffects = (() => {
    if (!spell?.mechanicsConfig) return false;

    // If it's an array, check each config
    if (Array.isArray(spell.mechanicsConfig)) {
      return spell.mechanicsConfig.some(config =>
        config.system === 'PROC_SYSTEM' && config.procOptions?.spellId
      );
    }

    // If it's an object, check if it has proc system configured
    if (typeof spell.mechanicsConfig === 'object') {
      // Check for proc system in the object structure
      return spell.mechanicsConfig.procs?.enabled && spell.mechanicsConfig.procs?.spellId;
    }

    return false;
  })();

  // If no proc effects or showProcs is false, just render the normal spell card
  if (!hasProcEffects || !showProcs) {
    return (
      <UnifiedSpellCard
        spell={spell}
        variant={variant}
        showActions={showActions}
        showDescription={showDescription}
        showStats={showStats}
        showTags={showTags}
        onEdit={onEdit}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onSelect={onSelect}
        onClick={onClick}
        onContextMenu={onContextMenu}
        isSelected={isSelected}
        isDraggable={isDraggable}
        className={className}
        rollableTableData={rollableTableData}
        categories={categories}
        {...props}
      />
    );
  }

  // Determine layout class based on proc position
  const layoutClass = procPosition === 'below' ? 'vertical-layout' : 'horizontal-layout';

  return (
    <div className={`spell-card-with-procs ${layoutClass} ${className}`}>
      {/* Left side or top: Proc effects (if position is left) */}
      {procPosition === 'left' && (
        <ProcEffectDisplay
          spell={spell}
          position="left"
          className="proc-display-left"
        />
      )}

      {/* Main spell card */}
      <div className="main-spell-card">
        <UnifiedSpellCard
          spell={spell}
          variant={variant}
          showActions={showActions}
          showDescription={showDescription}
          showStats={showStats}
          showTags={showTags}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onSelect={onSelect}
          onClick={onClick}
          onContextMenu={onContextMenu}
          isSelected={isSelected}
          isDraggable={isDraggable}
          rollableTableData={rollableTableData}
          categories={categories}
          {...props}
        />
      </div>

      {/* Right side or bottom: Proc effects (if position is right or below) */}
      {(procPosition === 'right' || procPosition === 'below') && (
        <ProcEffectDisplay
          spell={spell}
          position={procPosition}
          className={`proc-display-${procPosition}`}
        />
      )}
    </div>
  );
};

export default SpellCardWithProcs;
