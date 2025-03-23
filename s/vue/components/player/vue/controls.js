import PlayButton from './play_button.js'
import Timer from './timer.js'
import Tempo from './tempo.js'
import Swing from './swing.js'

export default {
  data() {
    return {
      containerIndex: midiPlayer?.containerIndex || 1,
      touchClass: ''      
    }
  },
  props: {},
  methods: {
    updateStats() {
      if (!midiPlayer) return      
    }    
  },
  mounted() {
    if (midiPlayer && this.containerIndex !== midiPlayer.containerIndex) {
      this.containerIndex = midiPlayer.containerIndex
    }
    this.removeHandler = midiPlayer?.addChangeHandler(() => {
      this.updateStats()
    })
  },
  beforeUnmount() {
    if (this.removeHandler) this.removeHandler()
  },
  components: {
    PlayButton, Timer, Tempo, Swing
  },
  template: `
    <div id="midiPlayer" class="fullWidthEle"><!-- space for the midiplayer to be attached by the javascript -->
      <div :id="'playerControl' + containerIndex" class="playerControl">
          <div :id="'playerControlsRow' + containerIndex" class="playerControlsRow">
              <PlayButton></PlayButton>
              <Timer></Timer>
                <span class="tempoAndProgress" :id="'tempoAndProgress' + containerIndex">
                    <Tempo></Tempo>
                    <Swing></Swing>
                </span>
            </div>    
        </div>
   </div>
`
}