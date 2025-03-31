export default {
  data() {
    return {
      containerIndex: midiPlayer?.containerIndex || 1,
      playTime: '0:00',      
    }
  },
  props: { },
  methods: {
    updateStats() {
      if (!midiPlayer) return
      
      const playTimeThisPlay = midiPlayer.getPlayTimeThisPlay();
      const minutes = playTimeThisPlay.getUTCMinutes();
      const seconds = playTimeThisPlay.getSeconds();
      this.playTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }    
  },
  mounted() {
    if (midiPlayer && this.containerIndex !== midiPlayer.containerIndex) {
      this.containerIndex = midiPlayer.containerIndex
    }
    this.removeSubscriber = midiPlayer?.subscribe(EventTypes.PLAY_PROGRESS, () => {
        this.updateStats()
    })
  },
  beforeUnmount() {
    if (this.removeSubscriber) this.removeSubscriber()
  },
  template: `
    <span class="MIDIPlayTime" :id="'MIDIPlayTime' + containerIndex">{{ playTime }}</span>    
`
}