import Timer from './timer.js'
import PlayButton from './play_button.js'

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
    Timer, PlayButton
  },
  template: `
    <div id="midiPlayer" class="fullWidthEle"><!-- space for the midiplayer to be attached by the javascript -->
      <div :id="'playerControl' + containerIndex" class="playerControl">
          <div :id="'playerControlsRow' + containerIndex" class="playerControlsRow">
              <PlayButton></PlayButton>
              <Timer></Timer>
                <span class="tempoAndProgress" :id="'tempoAndProgress' + containerIndex">
                    <div class="tempoRow">
                        <span class="tempoLabel">BPM</span>
                        <input type="text" 
                                for="tempo" 
                                class="tempoTextField" 
                                pattern="\\d+" 
                                :id="'tempoTextField' + containerIndex" 
                                value="80">
                        <input type="range" 
                                min="30" 
                                max="300" 
                                value="90" 
                                :class="'tempoInput' + touchClass" 
                                :id="'tempoInput' + containerIndex" 
                                list="tempoSettings">
                    </div>
                    <div class="swingRow">
                        <span class="swingLabel">SWING</span>
                        <span for="swingAmount" 
                              class="swingOutput" 
                              :id="'swingOutput' + containerIndex">0% swing</span>
                        <input type="range" 
                                min="0" 
                                max="50" 
                                value="0" 
                                :class="'swingInput' + touchClass" 
                                :id="'swingInput' + containerIndex" 
                                list="swingSettings" 
                                step="5">
                    </div>
                </span>
            </div>    
        </div>
   </div>
`
}