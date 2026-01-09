import Tom from './tom.js'
import NoteSpacer from './all_note_spacer.js'
import MuteButton from './all_button_mute.js'

export default {

  data() {
    return {
      startNoteIndex: this.track ? (this.measureIndex - 1) * this.track.notesPerMeasure : 0,
      tomsVisible: this.options.tomsVisible
    }
  },
  
  inject: ['options', 'track'],
  
  props: {
    measureIndex: {
      type: Number,
      required: true
    },
    tomIndex: {
      type: Number,
      required: true
    },
    abcOn: {
      type: String,
      required: true
    },
    midiNormal: {
      type: Number,
      required: true
    }
  },

  mounted() {
    this.tomsVisible = this.options.tomsVisible;    
  },

  watch: { 
    'options.tomsVisible': function(newVal) {
      if (typeof newVal === 'boolean') {
        this.tomsVisible = newVal;        
      }
    }
  },

  components: {
    Tom, NoteSpacer, MuteButton
  },

  template: `
    <div class="toms-container" id="tom1-container" :style="{ visibility: tomsVisible ? 'visible' : 'hidden' }">
      <div class="opening_note_space"></div>
      <template v-for="i in track.notesPerMeasure" :key="i">
        <Tom :noteIndex="startNoteIndex + (i - 1)" :tomIndex="tomIndex" :abcOn="abcOn" :midiNormal="midiNormal"/>
        <NoteSpacer :track="track" :noteIndex="i" />
      </template>
      <MuteButton :instrument="'Tom' + tomIndex" :measureIndex="measureIndex"></MuteButton>
    </div>    
  `
}