import PlayButton from './play_button.js'
import Timer from './timer.js'
import Tempo from './tempo.js'
import Swing from './swing.js'

export default {
  data() {
    return {
      containerIndex: midiPlayer?.containerIndex || 1
    }
  },
  props: {},
  mounted() {
    if (midiPlayer && this.containerIndex !== midiPlayer.containerIndex) {
      this.containerIndex = midiPlayer.containerIndex
    }
  },
  components: {
    PlayButton, Timer, Tempo, Swing
  },
  template: `
    <div id="midiPlayer" class="fullWidthEle">
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