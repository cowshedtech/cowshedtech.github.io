export default {
  data() {
    return {
      containerIndex: midiPlayer?.containerIndex || 1,
      state: ''
    }
  },
  props: {},
  methods: {
    updateState() {
      if (!midiPlayer) return
      this.state = midiPlayer.getState();
    },
    togglePlayPause() {
      midiPlayer.startOrStop();
    }
  },
  mounted() {
    if (midiPlayer && this.containerIndex !== midiPlayer.containerIndex) {
      this.containerIndex = midiPlayer.containerIndex
    }
    this.removeHandler = midiPlayer?.addChangeHandler(() => {
      this.updateState()
    })
  },
  beforeUnmount() {
    if (this.removeHandler) this.removeHandler()
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