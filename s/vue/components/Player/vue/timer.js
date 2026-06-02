// Build marker so we can confirm (at runtime) that the latest module is loaded
// rather than a cached copy.
if (typeof window !== 'undefined') window.__GS_TIMER_BUILD = 3;

export default {
  inject: ['midiPlayer'],
  data() {
    return {
      containerIndex: this.midiPlayer?.containerIndex || 1,
      playTime: '0:00',      
    }
  },
  
  methods: {
    // Ignore progress/state events that belong to another groove's player so that
    // only the groove currently playing advances its timer (matches the reference).
    _isMine(data) {
      if (!data || !data.player) return true
      return data.player === this.midiPlayer
    },

    updateStats(data) {
      if (!this.midiPlayer) return
      if (!this._isMine(data)) return
      // Only the groove that is actually playing should advance. Even if a stray
      // progress event reaches us, ignore it unless our own player is playing.
      if (typeof this.midiPlayer.getState === 'function' && this.midiPlayer.getState() !== 'Playing') return
      
      const playTimeThisPlay = this.midiPlayer.getPlayTimeThisPlay();
      const minutes = playTimeThisPlay.getUTCMinutes();
      const seconds = playTimeThisPlay.getSeconds();
      this.playTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },

    handlePlayState() {
      if (this.midiPlayer && typeof this.midiPlayer.getState === 'function' && this.midiPlayer.getState() !== 'Playing') {
        this.playTime = '0:00';
      }
    }
  },
  
  mounted() {
    if (this.midiPlayer && this.containerIndex !== this.midiPlayer.containerIndex) {
      this.containerIndex = this.midiPlayer.containerIndex
    }
    this._onProgress = (data) => this.updateStats(data)
    this._onState = () => this.handlePlayState()
    eventBus.$on(EventTypes.PLAY_PROGRESS, this._onProgress)
    eventBus.$on(EventTypes.PLAY_STATE, this._onState)
  },
  
  beforeUnmount() {
    if (this._onProgress) eventBus.$off(EventTypes.PLAY_PROGRESS, this._onProgress);
    if (this._onState) eventBus.$off(EventTypes.PLAY_STATE, this._onState);
  },

  template: `
    <span class="MIDIPlayTime" :id="'MIDIPlayTime' + containerIndex">{{ playTime }}</span>    
`
}
