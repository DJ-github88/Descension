import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { getIconUrl } from '../../utils/assetManager';
import { SpellLibraryProvider } from '../spellcrafting-wizard/context/SpellLibraryContext';
import ExternalItemPreview from './ExternalItemPreview';
import { getSafePortalTarget } from '../../utils/portalUtils';
import useSettingsStore from '../../store/settingsStore';
import useWindowManagerStore from '../../store/windowManagerStore';
import { STEPS } from './wizardSteps';
import { getStepInfo, DAMAGE_TYPES } from './itemWizardConfig';
import StepItemType from './steps/StepItemType';
import StepBasicInfo from './steps/StepBasicInfo';
import StepSlotAndSize from './steps/StepSlotAndSize';
import StepStats from './steps/StepStats';
import StepCombatStats from './steps/StepCombatStats';
import StepChanceOnHit from './steps/StepChanceOnHit';
import StepUtility from './steps/StepUtility';
import StepValue from './steps/StepValue';
import StepDurability from './steps/StepDurability';
import StepAppearance from './steps/StepAppearance';

export default function ItemWizard({ onClose, onComplete, onCancel, initialData = {}, isEditing = false }) {

    const handleClose = (item = null) => {
        if (item) {
            const formattedItem = {
                id: itemData.id || crypto.randomUUID(),
                name: itemData.name || 'Unnamed Item',
                quality: itemData.quality || 'common',
                description: itemData.description || '',
                type: itemData.type,
                subtype: itemData.subtype,
                offHandType: itemData.offHandType,
                hand: itemData.hand,
                requiredLevel: itemData.requiredLevel || 0,

                // For weapons
                ...(itemData.type === 'weapon' && {
                    weaponSlot: itemData.weaponSlot,
                    hand: itemData.hand,
                    weaponStats: itemData.weaponStats
                }),

                // Slots (important for display)
                slots: itemData.type === 'weapon' ?
                    [itemData.weaponSlot] :
                    itemData.slots || [],

                // Base stats - preserve structure with values and isPercentage
                baseStats: itemData.baseStats || {},

                // Combat stats - preserve structure
                combatStats: itemData.combatStats || {},

                // Utility stats - preserve structure
                utilityStats: itemData.utilityStats || {},

                // Value - preserve format
                value: itemData.value || { gold: 0, silver: 0, copper: 0 },

                // Durability - for equippable items
                ...(['weapon', 'armor', 'accessory'].includes(itemData.type) ? {
                    durability: itemData.durability ?? itemData.maxDurability ?? 'd8',
                    maxDurability: itemData.maxDurability ?? 'd8'
                } : {}),

                // Appearance
                iconId: itemData.iconId,
                imageUrl: itemData.imageUrl || (itemData.iconId ? `getIconUrl('${itemData.iconId}', 'items')` : null),

                // Set stackable property based on item type
                stackable: (itemData.type === 'consumable' || itemData.type === 'miscellaneous'),
                maxStackSize: (itemData.type === 'consumable' || itemData.type === 'miscellaneous') ? 5 : undefined,

                // Preserve dimensions and shape if they were provided in initialData
                width: initialData.width || itemData.width || 1,
                height: initialData.height || itemData.height || 1,
                shape: initialData.shape || itemData.shape,

                // Currency item properties
                ...(itemData.type === 'currency' && {
                    subtype: itemData.subtype,
                    currencyType: itemData.currencyType || 'gold',
                    currencyValue: itemData.currencyValue || 1,
                    isCurrency: true
                }),

                // Miscellaneous item properties
                ...(itemData.type === 'miscellaneous' && {
                    // Common properties
                    subtype: itemData.subtype,

                    // Quest items
                    ...(itemData.subtype === 'QUEST' && {
                        questGiver: itemData.questGiver || '',
                        requiredLevel: itemData.requiredLevel || 0,
                        questObjectives: itemData.questObjectives || '',
                        questChain: itemData.questChain || '',
                        timeLimit: itemData.timeLimit || 0
                    }),

                    // Reagents
                    ...(itemData.subtype === 'REAGENT' && {
                        reagentType: itemData.reagentType || '',
                        magicType: itemData.magicType || '',
                        reagentState: itemData.reagentState || '',
                        requiredFor: itemData.requiredFor || '',
                        quantityPerUse: itemData.quantityPerUse || 1,
                        magicalProperties: itemData.magicalProperties || '',
                        source: itemData.source || '',
                        preservationMethod: itemData.preservationMethod || ''
                    }),



                    // Crafting materials
                    ...(itemData.subtype === 'CRAFTING' && {
                        materialType: itemData.materialType || '',
                        professions: itemData.professions || [],
                        gatheringMethod: itemData.gatheringMethod || '',
                        sourceLocations: itemData.sourceLocations || '',
                        specialProperties: itemData.specialProperties || '',
                        recipes: itemData.recipes || ''
                    }),

                    // Trade goods
                    ...(itemData.subtype === 'TRADE_GOODS' && {
                        tradeCategory: itemData.tradeCategory || '',
                        origin: itemData.origin || '',
                        demandLevel: itemData.demandLevel || '',
                        qualityGrade: itemData.qualityGrade || '',
                        merchantNotes: itemData.merchantNotes || ''
                    }),

                    // Keys
                    ...(itemData.subtype === 'KEY' && {
                        keyType: itemData.keyType || '',
                        unlocks: itemData.unlocks || '',
                        location: itemData.location || '',
                        securityLevel: itemData.securityLevel || '',
                        oneTimeUse: itemData.oneTimeUse || false,
                        specialInstructions: itemData.specialInstructions || ''
                    }),
                    // Junk
                    ...(itemData.subtype === 'JUNK' && {
                        junkType: itemData.junkType || '',
                        condition: itemData.condition || '',
                        origin: itemData.origin || '',
                        estimatedValue: itemData.estimatedValue || '',
                        description: itemData.description || ''
                    })

                }),
            };

            if (onComplete) {
                onComplete(formattedItem);
            } else if (onClose) {
                onClose(formattedItem);
            }
        } else if (!item && onCancel) {
            onCancel();
        } else if (onClose) {
            onClose(null);
        }
    };

    // Helper functions for consistent display formatting
    function getDamageTypeColor(type) {
        if (!type) return '#ffffff';

        const colors = {
            slashing: '#A52A2A',
            piercing: '#C0C0C0',
            bludgeoning: '#8B4513',
            fire: '#FF4500',
            cold: '#87CEEB',
            lightning: '#FFD700',
            acid: '#32CD32',
            force: '#ff66ff',
            necrotic: '#4B0082',
            radiant: '#FFFACD',
            poison: '#008000',
            psychic: '#FF69B4',
            thunder: '#0066ff'
        };

        return colors[type.toLowerCase()] || '#ffffff';
    }

    function getWeaponSlotDisplay(slot, hand) {
        if (!slot) return '';

        if (slot === 'MAIN_HAND') return 'Main Hand';
        if (slot === 'OFF_HAND') return 'Off Hand';
        if (slot === 'ONE_HANDED') {
            if (hand === 'MAIN_HAND') return 'Main Hand';
            if (hand === 'OFF_HAND') return 'Off Hand';
            if (hand === 'ONE_HAND') return 'One Hand';
            return 'One-Handed';
        }

        if (slot === 'TWO_HANDED') return 'Two-Handed';
        if (slot === 'RANGED') return 'Ranged';

        return slot.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }

    function getWeaponSubtypeDisplay(subtype) {
        if (!subtype) return '';

        // Map of subtypes to display names
        const subtypeMap = {
            SWORD: 'Sword',
            AXE: 'Axe',
            MACE: 'Mace',
            DAGGER: 'Dagger',
            GREATSWORD: 'Greatsword',
            GREATAXE: 'Greataxe',
            MAUL: 'Maul',
            POLEARM: 'Polearm',
            STAFF: 'Staff',
            BOW: 'Bow',
            CROSSBOW: 'Crossbow',
            THROWN: 'Thrown',
            WAND: 'Wand'
        };

        return subtypeMap[subtype] || subtype.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }

    function getArmorSlotDisplay(slot) {
        if (!slot) return '';

        // Map common slots to display names
        const slotMap = {
            head: 'Head',
            shoulders: 'Shoulders',
            chest: 'Chest',
            wrists: 'Wrists',
            hands: 'Hands',
            waist: 'Waist',
            legs: 'Legs',
            feet: 'Feet',
            off_hand: 'Off Hand',
            back: 'Back'
        };

        return slotMap[slot] || slot.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }

    function getArmorSubtypeDisplay(slot, offHandType, subtype) {
        if (slot === 'off_hand' && offHandType) {
            // Map off-hand types
            const offHandMap = {
                SHIELD: 'Shield',
                SPHERE: 'Sphere',
                TOME: 'Tome',
                TOTEM: 'Totem',
                IDOL: 'Idol'
            };
            return offHandMap[offHandType] || offHandType.charAt(0).toUpperCase() +
                offHandType.slice(1).toLowerCase();
        }

        if (subtype) {
            // Map armor types
            const armorMap = {
                CLOTH: 'Cloth',
                LEATHER: 'Leather',
                MAIL: 'Mail',
                PLATE: 'Plate'
            };
            return armorMap[subtype] || subtype.split('_').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' ');
        }

        return '';
    }

    function getAccessorySlotDisplay(slot) {
        if (!slot) return '';

        const slotMap = {
            neck: 'Neck',
            ring: 'Ring',
            ring1: 'Ring',
            ring2: 'Ring',
            trinket: 'Trinket',
            trinket1: 'Trinket',
            trinket2: 'Trinket'
        };

        return slotMap[slot] || slot.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }

    const [currentStep, setCurrentStep] = useState(STEPS.ITEM_TYPE);
    const [itemData, setItemData] = useState(() => {
        const defaultData = {
            type: '',
            subtype: '',
            name: '',
            description: '',
            quality: 'common',
            requiredLevel: 0,
            baseStats: {
                constitution: { value: 0, isPercentage: false },
                strength: { value: 0, isPercentage: false },
                agility: { value: 0, isPercentage: false },
                intelligence: { value: 0, isPercentage: false },
                spirit: { value: 0, isPercentage: false },
                charisma: { value: 0, isPercentage: false }
            },
            combatStats: {
                healthRestore: { value: 0, isPercentage: false },
                manaRestore: { value: 0, isPercentage: false },
                apRestore: { value: 0, isPercentage: false },
                piercingDamage: { value: 0, isPercentage: false },
                bludgeoningDamage: { value: 0, isPercentage: false },
                slashingDamage: { value: 0, isPercentage: false },
                healingReceived: { value: 0, isPercentage: false },
                healingPower: { value: 0, isPercentage: false },
                maxAP: { value: 0, isPercentage: false },
                maxHealth: { value: 0, isPercentage: false },
                healthRegen: { value: 0, isPercentage: false },
                maxMana: { value: 0, isPercentage: false },
                manaRegen: { value: 0, isPercentage: false },
                initiative: { value: 0, isPercentage: false },
                spellDamage: { types: {} },
                resistances: {},
                conditionModifiers: {},
                onHitEffects: {
                    enabled: false,
                    procType: 'dice',
                    procChance: 15,
                    diceThreshold: 18,
                    cardProcRule: 'face_cards',
                    coinProcRule: 'all_heads',
                    coinCount: 3,
                    procSuit: 'hearts',
                    spellEffect: null,
                    customEffects: [],
                    useRollableTable: false
                }
            },
            weaponStats: {
                baseDamage: {
                    diceCount: 1,
                    diceType: 'd6',
                    damageType: 'slashing',
                    bonusDamage: 0,
                    bonusDamageType: ''
                }
            }
        }

            // Ensure utilityStats always exists and has proper structure
            if (!defaultData.utilityStats) {
                defaultData.utilityStats = {
                    movementSpeed: { value: 0, isPercentage: false },
                    swimSpeed: { value: 0, isPercentage: true },
                    carryingCapacity: { enabled: false, slots: 1 },
                    duration: {
                        type: 'ROUNDS',
                        value: 1
                    }
                };
            }

            // Ensure effects always exists and has proper structure
            if (!defaultData.effects) {
                defaultData.effects = {
                    damage: 0,
                    healing: 0,
                    duration: 0,
                    initiative: 0,
                    resistances: Object.keys(DAMAGE_TYPES).reduce((acc, type) => {
                        acc[type] = 0;
                        return acc;
                    }, {}),
                    conditions: [],
                    special: ''
                };
            }

            return defaultData;
        });

    const mergeDeep = (target, source) => {
        const result = { ...target };
        for (const key of Object.keys(source)) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) &&
                target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])) {
                result[key] = mergeDeep(target[key], source[key]);
            } else {
                result[key] = source[key];
            }
        }
        return result;
    };

    useEffect(() => {
        if (Object.keys(initialData).length > 0) {
            setItemData(prev => mergeDeep(prev, initialData));
        }
    }, []);

    const updateItemData = useCallback((updates) => {
        setItemData(prev => ({ ...prev, ...updates }));
    }, []);

    const renderStepNavigation = () => {
        const maxStep = Math.max(...Object.values(STEPS));
        const isLastStep = currentStep === maxStep;
        return (
            <div className="wizard-step-navigation">
                <button
                    className="wizard-nav-btn"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                >
                    Previous
                </button>
                {isLastStep ? (
                    <button
                        className="wizard-nav-btn wizard-nav-create"
                        onClick={() => handleClose(itemData)}
                    >
                        {isEditing ? 'Update Item' : 'Create Item'}
                    </button>
                ) : (
                    <button
                        className="wizard-nav-btn"
                        onClick={nextStep}
                    >
                        Next
                    </button>
                )}
            </div>
        );
    };


    const renderStep = () => {
        switch (currentStep) {
            case STEPS.ITEM_TYPE:
                return <StepItemType itemData={itemData} updateItemData={updateItemData} />;
            case STEPS.BASIC_INFO:
                return <StepBasicInfo itemData={itemData} updateItemData={updateItemData} />;
            case STEPS.SLOT_AND_SIZE:
                return <StepSlotAndSize itemData={itemData} updateItemData={updateItemData} />;
            case STEPS.STATS:
                return <StepStats itemData={itemData} updateItemData={updateItemData} />;
            case STEPS.COMBAT_STATS:
                return <StepCombatStats itemData={itemData} updateItemData={updateItemData} />;
            case STEPS.CHANCE_ON_HIT:
                return <StepChanceOnHit itemData={itemData} updateItemData={updateItemData} />;
            case STEPS.UTILITY:
                return <StepUtility itemData={itemData} updateItemData={updateItemData} />;
            case STEPS.VALUE:
                return <StepValue itemData={itemData} updateItemData={updateItemData} />;
            case STEPS.DURABILITY:
                return <StepDurability itemData={itemData} updateItemData={updateItemData} />;
            case STEPS.APPEARANCE:
                return <StepAppearance itemData={itemData} updateItemData={updateItemData} />;
            default:
                return null;
        }
    };




    // Get window scale from settings store
    const windowScale = useSettingsStore(state => state.windowScale);

    // Generate unique window ID
    const windowId = useRef(`item-wizard-${Date.now()}-${Math.random()}`).current;
    const [overlayZIndex, setOverlayZIndex] = useState(2000);
    const [modalZIndex, setModalZIndex] = useState(2001);

    // Window manager store actions
    const registerWindow = useWindowManagerStore(state => state.registerWindow);
    const unregisterWindow = useWindowManagerStore(state => state.unregisterWindow);

    const resolvedOnClose = onCancel || onClose;

    // Register modal with window manager on mount
    useEffect(() => {
        const baseZIndex = registerWindow(windowId, 'modal', resolvedOnClose);
        setOverlayZIndex(baseZIndex);
        setModalZIndex(baseZIndex + 1);

        return () => {
            unregisterWindow(windowId);
        };
    }, [windowId, registerWindow, unregisterWindow, resolvedOnClose]);

    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState(() => ({
        x: Math.max(50, (window.innerWidth - 800) / 2),
        y: Math.max(50, (window.innerHeight - 600) / 2)
    }));
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const modalRef = useRef(null);

    // Window position and size for external preview
    const [windowPosition, setWindowPosition] = useState(() => ({
        x: Math.max(50, (window.innerWidth - 800) / 2),
        y: Math.max(50, (window.innerHeight - 600) / 2)
    }));
    const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
    const [tooltipPosition, setTooltipPosition] = useState({ visible: false, x: 0, y: 0, stepName: '' });

    const handleMouseDown = (e) => {
        // Allow dragging from anywhere on the window, but not from interactive elements
        if (!e.target.closest('button, input, select, textarea, .wizard-nav-controls, .close-button')) {
            setIsDragging(true);
            const rect = modalRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };

    // Listen for window scale changes
    useEffect(() => {
        const handleWindowScaleChange = (event) => {
            // Force a re-render to apply the new scale
            setPosition(prev => ({ ...prev }));
        };

        window.addEventListener('windowScaleChanged', handleWindowScaleChange);
        return () => window.removeEventListener('windowScaleChanged', handleWindowScaleChange);
    }, [windowScale]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging && modalRef.current) {
                const newX = e.clientX - dragOffset.x;
                const newY = e.clientY - dragOffset.y;
                const newPosition = { x: newX, y: newY };
                setPosition(newPosition);
                setWindowPosition(newPosition);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    const prevStep = () => {
        let newStep = currentStep - 1;
        if (itemData.type === 'miscellaneous' || itemData.type === 'currency') {
            if (newStep === STEPS.UTILITY || newStep === STEPS.CHANCE_ON_HIT || newStep === STEPS.DURABILITY || newStep === STEPS.COMBAT_STATS) {
                newStep = STEPS.STATS;
            }
        }
        setCurrentStep(newStep);
    };

    const nextStep = () => {
        let newStep = currentStep + 1;
        if (itemData.type === 'miscellaneous' || itemData.type === 'currency') {
            if (newStep === STEPS.COMBAT_STATS || newStep === STEPS.DURABILITY || newStep === STEPS.CHANCE_ON_HIT || newStep === STEPS.UTILITY) {
                newStep = STEPS.VALUE;
            }
        }
        setCurrentStep(newStep);
    };

    const handleStepMouseEnter = (e, stepName, stepInfo) => {
        const rect = e.currentTarget.getBoundingClientRect();
        // Account for window scaling - getBoundingClientRect already accounts for transforms
        const tooltipX = rect.left + rect.width / 2; // Center horizontally
        const tooltipY = rect.top - 12; // Position above the button (12px gap)
        setTooltipPosition({
            visible: true,
            x: tooltipX,
            y: tooltipY,
            stepName,
            stepInfo
        });
    };

    const handleStepMouseLeave = () => {
        setTooltipPosition({ visible: false, x: 0, y: 0, stepName: '' });
    };

    const renderProgressBar = () => {
        // Filter out combat, chance-on-hit, and utility steps for miscellaneous and currency items
        const relevantSteps = Object.entries(STEPS).filter(([_, stepIndex]) => {
            if (itemData.type === 'miscellaneous' || itemData.type === 'currency') {
                return ![STEPS.COMBAT_STATS, STEPS.CHANCE_ON_HIT, STEPS.UTILITY, STEPS.DURABILITY].includes(stepIndex);
            }
            if (!['weapon', 'armor', 'accessory'].includes(itemData.type)) {
                return stepIndex !== STEPS.DURABILITY;
            }
            return true;
        });

        const totalSteps = relevantSteps.length;
        const currentProgress = ((currentStep + 1) / totalSteps) * 100;

        return (
            <div className="wow-progress-bar">
                <div
                    className="wow-progress-fill"
                    style={{ width: `${currentProgress}%` }}
                />
                <div className="wow-progress-segments">
                    {relevantSteps.map(([stepName, stepIndex]) => {
                        const stepInfo = getStepInfo(stepIndex, itemData.type);
                        return (
                            <div
                                key={stepName}
                                className={`wow-progress-segment ${stepIndex < currentStep ? 'completed' : ''
                                    } ${stepIndex === currentStep ? 'active' : ''}`}
                                onClick={() => setCurrentStep(stepIndex)}
                                onMouseEnter={(e) => handleStepMouseEnter(e, stepName, stepInfo)}
                                onMouseLeave={handleStepMouseLeave}
                            >
                                <img
                                    src={getIconUrl(stepInfo.icon, 'items')}
                                    alt={stepInfo.name}
                                    className="step-icon"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };


    // Get safe portal target
    const portalTarget = getSafePortalTarget();

    // Safety check - don't render if no portal target available
    if (!portalTarget) {
        console.error('ItemWizard: No portal target available, cannot render');
        return null;
    }

    return createPortal(
        <SpellLibraryProvider>
            {/* Overlay - rendered as sibling to modal */}
            <div
                className="modal-backdrop"
                style={{ zIndex: overlayZIndex }}
            />

            {/* Modal - rendered as sibling to overlay */}
            <div
                ref={modalRef}
                className="item-wizard-modal spellbook-wizard-layout"
                data-quality={itemData.quality || 'common'}
                style={{
                    position: 'fixed',
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    width: '800px',
                    height: '700px',
                    cursor: isDragging ? 'grabbing' : 'default',
                    transformOrigin: 'top left',
                    transform: `scale(${windowScale})`,
                    willChange: 'transform',
                    zIndex: modalZIndex // Use managed z-index
                }}
                onMouseDown={handleMouseDown}
            >
                <div className="item-wizard-content spellbook-wizard-layout">
                    <div className="wizard-header">
                        <button
                            className="wizard-nav-btn wizard-nav-previous"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                        >
                            Previous
                        </button>
                        <div className="wizard-progress-container">
                            {renderProgressBar()}
                        </div>
                        {currentStep === Object.keys(STEPS).length - 1 ? (
                            <button
                                className="wizard-nav-btn wizard-nav-create"
                                onClick={() => handleClose(itemData)}
                            >
                                Create Item
                            </button>
                        ) : (
                            <button
                                className="wizard-nav-btn wizard-nav-next"
                                onClick={nextStep}
                            >
                                Next
                            </button>
                        )}
                        <button className="close-button" onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleClose();
                        }}>×</button>
                    </div>
                    {/* Single column layout - Preview is now external */}
                    <div className="wizard-main-content">
                        <div className="spell-wizard-step-content">
                            {renderStep()}
                        </div>
                    </div>
                </div>
            </div>

            {/* External Item Preview */}
            <ExternalItemPreview
                itemData={itemData}
                windowPosition={windowPosition}
                windowSize={windowSize}
                isOpen={true}
            />

            {/* Progress Bar Tooltip - Rendered outside modal to escape clipping */}
            {tooltipPosition.visible && tooltipPosition.stepInfo && (
                <div
                    className="step-tooltip-fixed"
                    style={{
                        position: 'fixed',
                        left: `${tooltipPosition.x}px`,
                        top: `${tooltipPosition.y}px`,
                        transform: 'translateX(-50%) translateY(-100%)',
                        zIndex: 99999,
                        pointerEvents: 'none'
                    }}
                >
                    <div className="tooltip-header">
                        <img
                            src={getIconUrl(tooltipPosition.stepInfo.icon, 'items')}
                            alt={tooltipPosition.stepInfo.name}
                            className="tooltip-icon"
                        />
                        <span className="tooltip-title">{tooltipPosition.stepInfo.name}</span>
                    </div>
                    <div className="tooltip-description">
                        {tooltipPosition.stepInfo.description}
                    </div>
                </div>
            )}
        </SpellLibraryProvider>,
        portalTarget
    );
}
