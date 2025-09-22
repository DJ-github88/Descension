import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const useDialogueStore = create(
  subscribeWithSelector((set, get) => ({
    // Dialogue state
    isDialogueMode: false,
    activeDialogue: null,
    dialogueQueue: [],
    isTyping: false,
    currentText: '',
    textIndex: 0,
    
    // Settings
    defaultSpeed: 50, // ms per character
    defaultPosition: 'bottom',
    defaultEffect: 'normal',
    defaultColor: '#ffffff',
    
    // Character data for current dialogue
    currentCharacter: null,
    
    // Multiplayer integration
    multiplayerSocket: null,
    isInMultiplayer: false,
    
    // Actions
    setDialogueMode: (enabled) => set({ isDialogueMode: enabled }),
    
    setMultiplayerSocket: (socket, isMultiplayer) => set({ 
      multiplayerSocket: socket,
      isInMultiplayer: isMultiplayer 
    }),
    
    // Show dialogue message
    showDialogue: (text, options = {}) => {
      const state = get();
      
      const dialogueData = {
        id: Date.now() + Math.random(),
        text,
        character: options.character,
        characterName: options.characterName,
        effect: options.effect || state.defaultEffect,
        color: options.color || state.defaultColor,
        speed: options.speed || state.defaultSpeed,
        position: options.position || state.defaultPosition,
        autoHide: options.autoHide,
        closeable: options.closeable !== false,
        timestamp: new Date().toISOString(),
        playerId: options.playerId,
        isGM: options.isGM || false
      };
      
      // If in multiplayer mode, broadcast to other players
      if (state.isInMultiplayer && state.multiplayerSocket && state.multiplayerSocket.connected) {
        state.multiplayerSocket.emit('dialogue_message', {
          dialogueData,
          type: 'dialogue'
        });
      }
      
      // Show dialogue locally
      set({
        activeDialogue: dialogueData,
        currentText: '',
        textIndex: 0,
        isTyping: true,
        currentCharacter: options.character
      });
    },
    
    // Hide current dialogue
    hideDialogue: () => set({
      activeDialogue: null,
      currentText: '',
      textIndex: 0,
      isTyping: false,
      currentCharacter: null
    }),
    
    // Update typewriter state
    updateTypewriter: (currentText, textIndex, isTyping) => set({
      currentText,
      textIndex,
      isTyping
    }),
    
    // Skip typewriter effect
    skipTypewriter: () => {
      const state = get();
      if (state.activeDialogue && state.isTyping) {
        set({
          currentText: state.activeDialogue.text,
          textIndex: state.activeDialogue.text.length,
          isTyping: false
        });
      }
    },
    
    // Queue dialogue message
    queueDialogue: (text, options = {}) => {
      const state = get();
      const dialogueData = {
        id: Date.now() + Math.random(),
        text,
        ...options
      };
      
      set({
        dialogueQueue: [...state.dialogueQueue, dialogueData]
      });
    },
    
    // Process next dialogue in queue
    processNextDialogue: () => {
      const state = get();
      if (state.dialogueQueue.length > 0 && !state.activeDialogue) {
        const nextDialogue = state.dialogueQueue[0];
        const remainingQueue = state.dialogueQueue.slice(1);
        
        set({
          dialogueQueue: remainingQueue
        });
        
        state.showDialogue(nextDialogue.text, nextDialogue);
      }
    },
    
    // Clear dialogue queue
    clearQueue: () => set({ dialogueQueue: [] }),
    
    // Handle incoming multiplayer dialogue
    handleMultiplayerDialogue: (dialogueData) => {
      const state = get();
      
      // Don't show our own messages again
      if (dialogueData.playerId === state.currentPlayerId) {
        return;
      }
      
      // Show the dialogue
      set({
        activeDialogue: dialogueData,
        currentText: '',
        textIndex: 0,
        isTyping: true,
        currentCharacter: dialogueData.character
      });
    },
    
    // Settings management
    updateSettings: (settings) => set({
      defaultSpeed: settings.speed || get().defaultSpeed,
      defaultPosition: settings.position || get().defaultPosition,
      defaultEffect: settings.effect || get().defaultEffect,
      defaultColor: settings.color || get().defaultColor
    }),
    
    // Get current settings
    getSettings: () => {
      const state = get();
      return {
        speed: state.defaultSpeed,
        position: state.defaultPosition,
        effect: state.defaultEffect,
        color: state.defaultColor
      };
    },
    
    // Utility functions
    isDialogueActive: () => {
      const state = get();
      return !!state.activeDialogue;
    },
    
    getQueueLength: () => {
      const state = get();
      return state.dialogueQueue.length;
    },
    
    // Text effects and colors
    textEffects: {
      normal: 'normal',
      wave: 'wave',
      shake: 'shake',
      glow: 'glow',
      rainbow: 'rainbow'
    },
    
    textColors: {
      white: '#ffffff',
      yellow: '#ffff00',
      red: '#ff4444',
      blue: '#4488ff',
      green: '#44ff44',
      purple: '#ff44ff',
      orange: '#ff8844',
      gold: '#ffd700',
      silver: '#c0c0c0'
    },
    
    positions: {
      bottom: 'bottom',
      top: 'top',
      left: 'left',
      right: 'right',
      center: 'center'
    },
    
    // Debug functions
    debugInfo: () => {
      const state = get();
      return {
        isDialogueMode: state.isDialogueMode,
        activeDialogue: !!state.activeDialogue,
        queueLength: state.dialogueQueue.length,
        isTyping: state.isTyping,
        isInMultiplayer: state.isInMultiplayer,
        hasSocket: !!state.multiplayerSocket,
        socketConnected: state.multiplayerSocket?.connected || false
      };
    }
  }))
);

export default useDialogueStore;
