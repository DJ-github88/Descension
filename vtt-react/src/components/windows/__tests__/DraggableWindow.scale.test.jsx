import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import DraggableWindow from '../DraggableWindow';

let mockWindowScale = 1;
jest.mock('../../../store/settingsStore', () => ({
  __esModule: true,
  default: Object.assign(
    selector => selector({ windowScale: mockWindowScale }),
    { getState: () => ({ windowScale: mockWindowScale }) }
  )
}));

test.each([0.8, 1.2])('header follows the pointer when window artwork is scaled to %s', scale => {
  mockWindowScale = scale;
  const onDragStop = jest.fn();
  const { container } = render(
    <DraggableWindow isOpen bounds={null} defaultPosition={{ x: 100, y: 100 }} onDragStop={onDragStop}>
      <div className="draggable-window-handle">Window header</div>
    </DraggableWindow>
  );
  fireEvent.mouseDown(screen.getByText('Window header'), { button: 0, clientX: 10, clientY: 10 });
  fireEvent.mouseMove(document, { buttons: 1, clientX: 70, clientY: 50 });
  fireEvent.mouseUp(document, { button: 0, clientX: 70, clientY: 50 });

  expect(onDragStop).toHaveBeenCalledWith(expect.objectContaining({ x: 160, y: 140 }));
  expect(container.querySelector('.draggable-window')).toHaveStyle({ transform: `scale(${scale})` });
});
