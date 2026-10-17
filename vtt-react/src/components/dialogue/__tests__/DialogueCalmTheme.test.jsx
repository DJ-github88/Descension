import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import DialogueControls from '../DialogueControls';
import DialogueSystem from '../DialogueSystem';
import useDialogueStore from '../../../store/dialogueStore';

describe('Dialogue Calm TTRPG System & Controls', () => {
  beforeEach(() => {
    act(() => {
      useDialogueStore.setState({
        activeDialogue: null,
        currentText: '',
        isTyping: false,
        textIndex: 0,
        customPosition: null,
        defaultColor: '#34251a',
        defaultFont: 'cinzel',
        defaultSpeed: 50
      });
    });
  });

  test('dialogueStore has calm TTRPG defaults', () => {
    const state = useDialogueStore.getState();
    expect(state.defaultColor).toBe('#34251a');
    expect(state.defaultFont).toBe('cinzel');
    expect(state.fonts.codex).toBe('cinzel');
    expect(state.textColors.ink).toBe('#34251a');
  });

  test('DialogueControls toggle button opens codex panel with tabs and action buttons', () => {
    render(<DialogueControls />);
    
    const toggleBtn = screen.getByRole('button', { name: /dialogue/i });
    expect(toggleBtn).toBeInTheDocument();
    
    // Open panel
    fireEvent.click(toggleBtn);
    
    expect(screen.getByText('Character Dialogue')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /message/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /style/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send dialogue/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  test('typing message enables Send button and updates char counter', () => {
    render(<DialogueControls />);
    fireEvent.click(screen.getByRole('button', { name: /dialogue/i }));

    const textarea = screen.getByPlaceholderText(/Enter your character's dialogue/i);
    const sendBtn = screen.getByRole('button', { name: /send dialogue/i });

    expect(sendBtn).toBeDisabled();
    expect(screen.getByText('0/500')).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: 'Hail traveler, well met.' } });

    expect(sendBtn).not.toBeDisabled();
    expect(screen.getByText('24/500')).toBeInTheDocument();
  });

  test('DialogueSystem renders speech bubble with calm manuscript formatting', () => {
    const { container } = render(<DialogueSystem />);

    // Initially no active dialogue
    expect(container.firstChild).toBeNull();

    act(() => {
      useDialogueStore.getState().showDialogue('Stay a while and listen.', {
        characterName: 'Deckard Cain',
        color: '#34251a',
        font: 'cinzel'
      });
      // Skip typewriter to show complete text
      useDialogueStore.getState().skipTypewriter();
    });

    expect(screen.getByText('Deckard Cain')).toBeInTheDocument();
    expect(container.querySelector('.dialogue-content')).toHaveTextContent('Stay a while and listen.');
    expect(container.querySelector('.dialogue-word')).toHaveStyle({ color: '#34251a' });
    expect(screen.getByText(/continue/i)).toBeInTheDocument();

    const dialogueBox = container.querySelector('.dialogue-box');
    expect(dialogueBox).toBeInTheDocument();

    const dialogueName = container.querySelector('.dialogue-name');
    expect(dialogueName).toHaveClass('dialogue-font-cinzel');
  });
});
