const KEYS = {
  SPACEBAR: 'Space',
  PLAY: 'MediaPlayPause',
  STOP: 'MediaStop'
};

const IGNORED_ELEMENTS = new Set(['INPUT', 'TEXTAREA']);    

export default {
  
  data() {
    return {
      containerIndex: midiPlayer?.containerIndex || 1,
      state: ''
    }
  },
  
  methods: {
    updateState() {
      if (!midiPlayer) return
      this.state = midiPlayer.getState();
    },
    
    togglePlayPause() {
      midiPlayer.startOrStop();
    },
    
    isValidTarget(event) {
      const targetTag = event.target.tagName.toUpperCase();
      return event.target.type !== 'range' && !IGNORED_ELEMENTS.has(targetTag);
    },
    
    handleKeyDown(event) {
      switch (event.code) {
        case KEYS.PLAY:
          midiPlayer.startOrPause();
          return false;
        case KEYS.STOP:
          midiPlayer.stop();
          return false;
        case KEYS.SPACEBAR:
          if (this.isValidTarget(event)) {
            midiPlayer.startOrStop();
            return false;
          }
          break;
      }

      return true;
    }   
  },
  
  mounted() {
    if (midiPlayer && this.containerIndex !== midiPlayer.containerIndex) {
      this.containerIndex = midiPlayer.containerIndex
    }

    eventBus.$on(EventTypes.PLAY_STATE, () => {
			this.updateState()
		})
    
    document.addEventListener('keydown', this.handleKeyDown);   
  },
  
  beforeUnmount() {
    if (this.removeSubscriber) this.removeSubscriber()
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