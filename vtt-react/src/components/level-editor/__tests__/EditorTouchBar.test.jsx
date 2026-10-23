import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditorTouchBar from '../EditorTouchBar';

const base = {
    visible: true,
    canUndo: true,
    canRedo: true,
    onUndo: jest.fn(),
    onRedo: jest.fn(),
    fingerAction: 'draw',
    penDetected: false,
    onToggleFingerAction: jest.fn(),
    onZoomIn: jest.fn(),
    onZoomOut: jest.fn()
};

const renderBar = (props = {}) => render(<EditorTouchBar {...base} {...props} />);

describe('EditorTouchBar', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders nothing when not visible', () => {
        renderBar({ visible: false });
        expect(screen.queryByTestId('editor-touch-bar')).toBeNull();
    });

    it('undo / redo / zoom buttons call their handlers', () => {
        renderBar();
        fireEvent.click(screen.getByLabelText('Undo'));
        fireEvent.click(screen.getByLabelText('Redo'));
        fireEvent.click(screen.getByLabelText('Zoom in'));
        fireEvent.click(screen.getByLabelText('Zoom out'));
        expect(base.onUndo).toHaveBeenCalledTimes(1);
        expect(base.onRedo).toHaveBeenCalledTimes(1);
        expect(base.onZoomIn).toHaveBeenCalledTimes(1);
        expect(base.onZoomOut).toHaveBeenCalledTimes(1);
    });

    it('disables undo / redo when there is nothing to undo / redo', () => {
        renderBar({ canUndo: false, canRedo: false });
        expect(screen.getByLabelText('Undo')).toBeDisabled();
        expect(screen.getByLabelText('Redo')).toBeDisabled();
    });

    it('shows and toggles the finger mode', () => {
        const { rerender } = renderBar();
        const toggle = screen.getByLabelText('Finger: draw');
        expect(toggle).toHaveAttribute('aria-pressed', 'false');
        fireEvent.click(toggle);
        expect(base.onToggleFingerAction).toHaveBeenCalledTimes(1);

        rerender(<EditorTouchBar {...base} fingerAction="pan" />);
        expect(screen.getByLabelText('Finger: pan')).toHaveAttribute('aria-pressed', 'true');
    });

    it('explains the stylus behaviour in the toggle title once a pen is detected', () => {
        renderBar({ penDetected: true });
        expect(screen.getByLabelText('Finger: draw').getAttribute('title')).toMatch(/stylus/i);
    });

    it('hides polygon and selection controls when they do not apply', () => {
        renderBar();
        expect(screen.queryByLabelText('Finish polygon')).toBeNull();
        expect(screen.queryByLabelText('Delete selected drawing')).toBeNull();
    });

    it('polygon controls: needs 3 corners to finish, Back and Cancel always work', () => {
        const onFinishPolygon = jest.fn();
        const onUndoPolygonPoint = jest.fn();
        const onCancelPolygon = jest.fn();
        const { rerender } = renderBar({ polygonPointCount: 2, onFinishPolygon, onUndoPolygonPoint, onCancelPolygon });
        expect(screen.getByText('2 corners')).toBeInTheDocument();
        expect(screen.getByLabelText('Finish polygon')).toBeDisabled();
        fireEvent.click(screen.getByLabelText('Remove last corner'));
        fireEvent.click(screen.getByLabelText('Cancel polygon'));
        expect(onUndoPolygonPoint).toHaveBeenCalledTimes(1);
        expect(onCancelPolygon).toHaveBeenCalledTimes(1);

        rerender(<EditorTouchBar {...base} polygonPointCount={3} onFinishPolygon={onFinishPolygon} />);
        fireEvent.click(screen.getByLabelText('Finish polygon'));
        expect(onFinishPolygon).toHaveBeenCalledTimes(1);
    });

    it('uses the singular for one corner', () => {
        renderBar({ polygonPointCount: 1 });
        expect(screen.getByText('1 corner')).toBeInTheDocument();
    });

    it('selection controls duplicate and delete', () => {
        const onDeleteSelection = jest.fn();
        const onDuplicateSelection = jest.fn();
        renderBar({ selectionCount: 1, onDeleteSelection, onDuplicateSelection });
        fireEvent.click(screen.getByLabelText('Duplicate selected drawing'));
        fireEvent.click(screen.getByLabelText('Delete selected drawing'));
        expect(onDuplicateSelection).toHaveBeenCalledTimes(1);
        expect(onDeleteSelection).toHaveBeenCalledTimes(1);
    });
});
