import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CameraCompass from '../CameraCompass';
import useGameStore from '../../../store/gameStore';

describe('CameraCompass', () => {
  beforeEach(() => {
    useGameStore.setState({
      viewMode: '2d',
      viewRotation: 0,
      viewTilt: 90
    });
  });

  it('renders title, mode toggles (2D and 2.5D), and rotation controls', () => {
    render(<CameraCompass />);

    expect(screen.getByText('Camera', { selector: '.camera-compass__title' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2D' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2.5D' })).toBeInTheDocument();

    const btn2D = screen.getByRole('button', { name: '2D' });
    expect(btn2D).toHaveClass('active');

    // In 2D mode, tilt presets are not displayed
    expect(screen.queryByRole('button', { name: 'Top' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Iso' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Low' })).not.toBeInTheDocument();
  });

  it('switches to 2.5D mode when clicking the 2.5D button', () => {
    render(<CameraCompass />);

    const btn25D = screen.getByRole('button', { name: '2.5D' });
    fireEvent.click(btn25D);

    expect(useGameStore.getState().viewMode).toBe('2.5d');
    expect(useGameStore.getState().viewTilt).toBe(30);
  });

  it('renders tilt presets when in 2.5D mode and allows setting tilt', () => {
    useGameStore.setState({
      viewMode: '2.5d',
      viewRotation: 0,
      viewTilt: 30
    });

    render(<CameraCompass />);

    const btn25D = screen.getByRole('button', { name: '2.5D' });
    expect(btn25D).toHaveClass('active');

    const topBtn = screen.getByRole('button', { name: 'Top' });
    const isoBtn = screen.getByRole('button', { name: 'Iso' });
    const lowBtn = screen.getByRole('button', { name: 'Low' });

    expect(topBtn).toBeInTheDocument();
    expect(isoBtn).toBeInTheDocument();
    expect(lowBtn).toBeInTheDocument();
    expect(isoBtn).toHaveClass('active');

    fireEvent.click(lowBtn);
    expect(useGameStore.getState().viewTilt).toBe(15);

    fireEvent.click(topBtn);
    expect(useGameStore.getState().viewTilt).toBe(90);
  });

  it('switches back to 2D mode when clicking 2D button', () => {
    useGameStore.setState({
      viewMode: '2.5d',
      viewRotation: 0,
      viewTilt: 30
    });

    render(<CameraCompass />);

    const btn2D = screen.getByRole('button', { name: '2D' });
    fireEvent.click(btn2D);

    expect(useGameStore.getState().viewMode).toBe('2d');
    expect(useGameStore.getState().viewTilt).toBe(90);
  });

  it('supports rotating camera and resetting heading', () => {
    render(<CameraCompass />);

    const rotateRightBtn = screen.getByTitle(/Rotate camera 45° right/i);
    fireEvent.click(rotateRightBtn);
    expect(useGameStore.getState().viewRotation).toBe(45);

    const dialBtn = screen.getByTitle(/Click to reset to north/i);
    fireEvent.click(dialBtn);
    expect(useGameStore.getState().viewRotation).toBe(0);
  });

  it('sets a precise heading with the slider', () => {
    render(<CameraCompass />);

    const headingSlider = screen.getByLabelText('Camera heading');
    fireEvent.change(headingSlider, { target: { value: '137' } });

    expect(useGameStore.getState().viewRotation).toBe(137);
    expect(screen.getByText('137°')).toBeInTheDocument();
  });

  it('sets an exact heading from the number field', () => {
    render(<CameraCompass />);

    const headingNumber = screen.getByRole('spinbutton', { name: 'Camera heading in degrees' });
    fireEvent.change(headingNumber, { target: { value: '273' } });

    expect(useGameStore.getState().viewRotation).toBe(273);
  });

  it('sets a precise tilt with the slider in 2.5D mode', () => {
    useGameStore.setState({
      viewMode: '2.5d',
      viewRotation: 0,
      viewTilt: 30
    });

    render(<CameraCompass />);

    const tiltSlider = screen.getByLabelText('Camera tilt');
    fireEvent.change(tiltSlider, { target: { value: '47' } });

    expect(useGameStore.getState().viewTilt).toBe(47);
  });

  it('collapses to the camera toggle pill and restores the panel', () => {
    render(<CameraCompass />);

    const toggle = screen.getByRole('button', { name: 'Camera' });
    expect(toggle).toHaveClass('active');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: '2D' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Minimize camera controls' }));

    expect(screen.queryByRole('button', { name: '2D' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '2.5D' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Camera' })).not.toHaveClass('active');
    expect(screen.getByRole('button', { name: 'Camera' })).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Camera' }));

    expect(screen.getByRole('button', { name: '2D' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Camera' })).toHaveClass('active');
    expect(screen.getByRole('button', { name: 'Camera' })).toHaveAttribute('aria-expanded', 'true');
  });
});
