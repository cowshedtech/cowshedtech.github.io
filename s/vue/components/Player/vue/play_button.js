const KEYS = {
  SPACEBAR: 'Space',
  PLAY: 'MediaPlayPause',
  STOP: 'MediaStop'
};

const IGNORED_ELEMENTS = new Set(['INPUT', 'TEXTAREA']);    

export default {
  
  inject: ['midiPlayer'],
  
  data() {
    return {
      containerIndex: this.midiPlayer?.containerIndex || 1,
      state: ''
    }
  },
  
  methods: {
    updateState() {
      if (!this.midiPlayer) return
      this.state = this.midiPlayer.getState();
    },
    
    togglePlayPause() {
      this.midiPlayer.startOrStop();
    },
    
    isValidTarget(event) {
      const targetTag = event.target.tagName.toUpperCase();
      return event.target.type !== 'range' && !IGNORED_ELEMENTS.has(targetTag);
    },
    
    handleKeyDown(event) {
      switch (event.code) {
        case KEYS.PLAY:
          this.midiPlayer.startOrPause();
          return false;
        case KEYS.STOP:
          this.midiPlayer.stop();
          return false;
        case KEYS.SPACEBAR:
          if (this.isValidTarget(event)) {
            this.midiPlayer.startOrStop();
            return false;
          }
          break;
      }

      return true;
    }   
  },
  
  mounted() {
    if (this.midiPlayer && this.containerIndex !== this.midiPlayer.containerIndex) {
      this.containerIndex = this.midiPlayer.containerIndex
    }

    eventBus.$on(EventTypes.PLAY_STATE, () => {
			this.updateState()
		})

    // Initialise from the player's current state. The player is marked ready (Stopped)
    // on window 'load', which can fire before this button mounts and subscribes above,
    // so without this the button would miss that event and render the disabled icon.
    this.updateState()

    document.addEventListener('keydown', this.handleKeyDown);   
  },
  
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);          
  },
  
  template: `
    <span 
        title="Play/Pause" 
        :class="['midiPlayImage', state]" 
        :id="'midiPlayImage' + containerIndex"
        @click="togglePlayPause"
    ></span>    
`
}