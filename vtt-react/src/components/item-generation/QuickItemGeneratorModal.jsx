import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import useWindowManagerStore from '../../store/windowManagerStore';
import EnhancedQuickItemWizard from './EnhancedQuickItemWizard';
import { getSafePortalTarget } from '../../utils/portalUtils';


const QuickItemGeneratorModal = ({ onComplete, onCancel }) => {
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0, modalX: 0, modalY: 0 });
    const modalRef = useRef(null);
    const hasBeenDragged = useRef(false);
    const posRef = useRef(null);

    const windowId = useRef(`qig-${Date.now()}`).current;
    const registerWindow = useWindowManagerStore(s => s.registerWindow);
    const unregisterWindow = useWindowManagerStore(s => s.unregisterWindow);

    const [zIndex, setZIndex] = useState(2001);

    useEffect(() => {
        const base = registerWindow(windowId, 'modal');
        setZIndex(base + 1);
        return () => unregisterWindow(windowId);
    }, [windowId, registerWindow, unregisterWindow]);

    const handleMouseDown = useCallback((e) => {
        if (e.target.closest('.qig-close')) return;
        e.preventDefault();
        const rect = modalRef.current.getBoundingClientRect();
        if (!hasBeenDragged.current) {
            posRef.current = { x: rect.left, y: rect.top };
            modalRef.current.style.position = 'absolute';
            modalRef.current.style.left = `${rect.left}px`;
            modalRef.current.style.top = `${rect.top}px`;
            modalRef.current.style.margin = '0';
            hasBeenDragged.current = true;
        }
        dragStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            modalX: posRef.current.x,
            modalY: posRef.current.y
        };
        setIsDragging(true);
    }, []);

    useEffect(() => {
        if (!isDragging) return;
        const onMove = (e) => {
            const dx = e.clientX - dragStartRef.current.x;
            const dy = e.clientY - dragStartRef.current.y;
            const newX = dragStartRef.current.modalX + dx;
            const newY = dragStartRef.current.modalY + dy;
            posRef.current = { x: newX, y: newY };
            modalRef.current.style.left = `${newX}px`;
            modalRef.current.style.top = `${newY}px`;
        };
        const onUp = () => setIsDragging(false);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };
    }, [isDragging]);

    const portalTarget = getSafePortalTarget();
    if (!portalTarget) return null;

    return createPortal(
        <div className="qig-overlay" style={{ zIndex }} onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
            <div ref={modalRef} className="qig-modal" onClick={(e) => e.stopPropagation()}>
                <div className="qig-header" onMouseDown={handleMouseDown}>
                    <span className="qig-title">Quick Item Generator</span>
                    <button className="qig-close" onClick={onCancel}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="qig-body">
                    <EnhancedQuickItemWizard onComplete={onComplete} onCancel={onCancel} />
                </div>
            </div>
        </div>,
        portalTarget
    );
};

export default QuickItemGeneratorModal;
