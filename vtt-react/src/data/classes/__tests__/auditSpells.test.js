import { BASE_CLASSES_DATA } from '../index';

describe('Audit Class Spells for Formatting', () => {
  it('checks which spells have no formatted stat content or missing configs', () => {
    const unformatted = [];

    Object.entries(BASE_CLASSES_DATA).forEach(([className, classData]) => {
      const spells = classData.spells || [];
      spells.forEach((spell) => {
        const hasPrimaryDamage = spell?.primaryDamage?.dice && spell.primaryDamage.dice !== '6d6';
        const hasDamageFormula = spell?.damageConfig?.formula && spell.damageConfig.formula.trim();
        const hasCardDamage = spell?.resolution === 'CARDS' && spell?.cardConfig && spell?.damageConfig && spell?.effectTypes?.includes('damage');
        const hasCoinDamage = spell?.resolution === 'COINS' && spell?.coinConfig && spell?.damageConfig && spell?.effectTypes?.includes('damage');
        const hasDiceDamage = spell?.resolution === 'DICE' && spell?.diceConfig?.formula && spell.diceConfig.formula.trim() && spell?.damageConfig && spell?.effectTypes?.includes('damage');
        const hasDotDamage = spell?.damageConfig?.hasDotEffect || spell?.damageConfig?.damageType === 'dot';
        const isProphecySpell = spell?.resolution === 'PROPHECY';
        const shouldRenderDamage = !isProphecySpell && (hasPrimaryDamage || hasDamageFormula || hasCardDamage || hasCoinDamage || hasDiceDamage || hasDotDamage);

        const healingData = spell?.healingConfig || (spell?.effects?.healing ? {
          formula: spell.effects.healing.instant?.formula || spell.effects.healing.hot?.formula,
          healingType: spell.effects.healing.hot ? 'hot' : 'instant'
        } : null);
        const shouldRenderHealing = !!healingData;

        const hasBuffContent = spell?.effectTypes?.includes('buff') && (
          spell?.buffConfig?.statModifiers?.length > 0 ||
          spell?.buffConfig?.statusEffects?.length > 0 ||
          spell?.buffConfig?.effects?.length > 0 ||
          spell?.effects?.buff
        );
        const hasDebuffContent = !!(spell?.debuffConfig && (
          spell.debuffConfig.statPenalties?.length > 0 ||
          spell.debuffConfig.statModifiers?.length > 0 ||
          spell.debuffConfig.statusEffects?.length > 0 ||
          spell.debuffConfig.effects?.length > 0 ||
          spell.debuffConfig.duration ||
          spell.debuffConfig.durationType ||
          spell.debuffConfig.durationValue
        ));
        const hasDuration = (spell?.durationType && spell.durationType !== 'instant') ||
          (spell?.effectTypes?.includes('buff') && spell?.buffConfig?.durationType && spell.buffConfig.durationType !== 'instant');
        const hasUtility = spell?.effectTypes?.includes('utility') && (spell?.utilityConfig || spell?.effects?.utility);
        const hasControl = spell?.effectTypes?.includes('control') || spell?.controlConfig;
        const hasTerrain = spell?.effectTypes?.includes('terrain') || spell?.terrainConfig || spell?.effects?.terrain;
        const hasSummoning = (spell?.effectTypes?.includes('summoning') || spell?.effectTypes?.includes('summon')) && (spell?.summoningConfig || spell?.summonConfig);
        const hasTransformation = spell?.effectTypes?.includes('transformation') && (spell?.transformationConfig || spell?.transformConfig);
        const hasPurification = spell?.effectTypes?.includes('purification') && spell?.purificationConfig;
        const hasRestoration = spell?.effectTypes?.includes('restoration') && spell?.restorationConfig;
        const hasStatusEffects = (spell?.statusEffectsConfig || []).length > 0;
        const hasRollableTable = !!((spell?.mechanicsConfig?.rollableTable || spell?.rollableTable)?.enabled);
        const hasProphecy = !!(spell?.prophecyConfig || (Array.isArray(spell?.mechanicsConfig) && spell.mechanicsConfig.find(m => m.system === 'PROPHECY')?.prophecy));
        const hasChaosWeaver = !!(spell?.specialMechanics?.chaosWeaver || spell?.applicationMode === 'manual-tabletop');

        const hasAnyStatContent = shouldRenderDamage || shouldRenderHealing ||
          hasBuffContent || hasDebuffContent || hasDuration || hasUtility || hasControl ||
          hasTerrain || hasSummoning || hasTransformation || hasPurification || hasRestoration ||
          hasProphecy || hasRollableTable || hasStatusEffects || hasChaosWeaver;

        if (!hasAnyStatContent) {
          unformatted.push({
            class: className,
            id: spell.id,
            name: spell.name,
            spellType: spell.spellType,
            effectTypes: spell.effectTypes,
            description: (spell.description || '').substring(0, 80) + '...'
          });
        }
      });
    });

    console.log(`TOTAL UNFORMATTED SPELLS: ${unformatted.length}`);
    unformatted.forEach((s) => {
      console.log(`[${s.class}] (${s.spellType}) ${s.name} [${s.effectTypes?.join(', ')}] -> ${s.id}`);
    });

    expect(unformatted.length).toBe(0);
  });
});
