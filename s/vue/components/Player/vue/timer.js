export default {
  inject: ['midiPlayer'],
  data() {
    return {
      containerIndex: this.midiPlayer?.containerIndex || 1,
      playTime: '0:00',      
    }
  },
  
  methods: {
    updateStats() {
      if (!this.midiPlayer) return
      
      const playTimeThisPlay = this.midiPlayer.getPlayTimeThisPlay();
      const minutes = playTimeThisPlay.getUTCMinutes();
      const seconds = playTimeThisPlay.getSeconds();
      this.playTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }    
  },
  
  mounted() {
    if (this.midiPlayer && this.containerIndex !== this.midiPlayer.containerIndex) {
      this.containerIndex = this.midiPlayer.containerIndex
    }
    eventBus.$on(EventTypes.PLAY_PROGRESS, () => {
			this.updateStats()
		})
  },
  
  beforeUnmount() {
    eventBus.$off(EventTypes.PLAY_PROGRESS);
  },

  template: `
    <span class="MIDIPlayTime" :id="'MIDIPlayTime' + containerIndex">{{ playTime }}</span>    
`
}