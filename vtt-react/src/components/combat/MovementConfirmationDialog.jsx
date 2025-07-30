import React from 'react';
import { createPortal } from 'react-dom';
import './MovementConfirmationDialog.css';

const MovementConfirmationDialog = ({
    isOpen,
    onConfirm,
    onCancel,
    movementData,
    position = { x: 400, y: 300 }
}) => {
    if (!isOpen) {
        return null;
    }

    const {
        baseMovement = 30,
        totalDistance = 0,
        currentMovementDistance = 0,
        movementUsedThisTurn = 0,
        feetPerTile = 5,
        currentAP = 0,
        requiredAP = 0,
        creatureName = 'Creature'
    } = movementData || {};



    const baseMovementTiles = Math.floor(baseMovement / feetPerTile);
    const totalTiles = Math.ceil(totalDistance / feetPerTile);
    const currentMovementTiles = Math.ceil(currentMovementDistance / feetPerTile);
    const usedMovementTiles = Math.ceil(movementUsedThisTurn / feetPerTile);
    const extraMovement = Math.max(0, totalDistance - (movementUsedThisTurn + baseMovement));
    const extraAP = requiredAP;

    return createPortal(
        <div className="movement-confirmation-overlay">
            <div 
                className="movement-confirmation-dialog"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`
                }}
            >
                <div className="dialog-header">
                    <h3>
                        {movementUsedThisTurn === 0
                            ? 'Spend AP to Move'
                            : totalDistance > baseMovement
                                ? 'Additional Movement'
                                : 'Confirm Movement'
                        }
                    </h3>
                </div>

                <div className="dialog-content">
                    <div className="movement-info">
                        <div className="creature-info">
                            <strong>{creatureName}</strong>
                        </div>

                        {movementUsedThisTurn === 0 ? (
                            <div className="unlock-movement-info">
                                <div className="unlock-message">
                                    <i className="fas fa-running"></i>
                                    <p>Spend 1 AP to move {Math.round(totalDistance)}ft out of {baseMovement}ft?</p>
                                </div>
                                <div className="movement-breakdown">
                                    <div className="movement-row">
                                        <span>Movement Distance:</span>
                                        <span>{Math.round(totalDistance)} ft</span>
                                    </div>
                                    <div className="movement-row">
                                        <span>Base Speed:</span>
                                        <span>{baseMovement} ft</span>
                                    </div>
                                    <div className="movement-row">
                                        <span>After this move:</span>
                                        <span>Free movement within {baseMovement}ft</span>
                                    </div>
                                </div>
                            </div>
                        ) : totalDistance > baseMovement ? (
                            <div className="extra-movement-info">
                                <div className="extra-message">
                                    <i className="fas fa-bolt"></i>
                                    <p>Spend additional 1 AP to move {Math.round(totalDistance)}ft out of {baseMovement * 2}ft?</p>
                                </div>
                                <div className="movement-breakdown">
                                    <div className="movement-row">
                                        <span>Total Movement:</span>
                                        <span>{Math.round(totalDistance)} ft</span>
                                    </div>
                                    <div className="movement-row">
                                        <span>Extended Limit:</span>
                                        <span>{baseMovement * 2} ft (with extra AP)</span>
                                    </div>
                                    <div className="movement-row">
                                        <span>Already Used:</span>
                                        <span>{Math.round(movementUsedThisTurn)} ft</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="movement-breakdown">
                                <div className="movement-row">
                                    <span>Creature Speed:</span>
                                    <span>{baseMovement} ft per AP</span>
                                </div>
                                <div className="movement-row">
                                    <span>Already Used:</span>
                                    <span>{Math.round(movementUsedThisTurn)} ft ({usedMovementTiles} tiles)</span>
                                </div>
                                <div className="movement-row">
                                    <span>This Movement:</span>
                                    <span>{Math.round(currentMovementDistance)} ft ({currentMovementTiles} tiles)</span>
                                </div>
                                <div className="movement-row">
                                    <span>Total This Turn:</span>
                                    <span>{Math.round(totalDistance)} ft ({totalTiles} tiles)</span>
                                </div>
                                {extraMovement > 0 && (
                                    <div className="movement-row extra-movement">
                                        <span>Exceeds Paid Movement:</span>
                                        <span>{Math.round(extraMovement)} ft</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="ap-cost">
                            <div className="ap-row">
                                <span>Current AP:</span>
                                <span>{currentAP}</span>
                            </div>
                            <div className="ap-row">
                                <span>Additional AP Needed:</span>
                                <span>{requiredAP}</span>
                            </div>
                            {extraAP > 0 && (
                                <div className="ap-row extra-ap">
                                    <span>Cost for Extra Movement:</span>
                                    <span>{extraAP} AP</span>
                                </div>
                            )}
                        </div>

                        {currentAP < requiredAP && (
                            <div className="insufficient-ap-warning">
                                <i className="fas fa-exclamation-triangle"></i>
                                Insufficient Action Points! Need {requiredAP} AP, have {currentAP} AP.
                            </div>
                        )}
                    </div>
                </div>

                <div className="dialog-actions">
                    <button
                        className="movement-button cancel"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className={`movement-button confirm ${currentAP < requiredAP ? 'disabled' : ''}`}
                        onClick={onConfirm}
                        disabled={currentAP < requiredAP}
                    >
                        {currentAP >= requiredAP
                            ? (movementUsedThisTurn === 0
                                ? `Spend ${requiredAP} AP to Move`
                                : totalDistance > baseMovement
                                    ? `Spend Additional ${requiredAP} AP`
                                    : `Confirm Movement`)
                            : 'Insufficient AP'
                        }
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default MovementConfirmationDialog;
