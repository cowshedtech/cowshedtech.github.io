import Tom from './tom.js'
import NoteSpacer from './all_note_spacer.js'
import MuteButton from './all_button_mute.js'

export default {

  data() {
    return {
      startNoteIndex: this.track ? (this.measureIndex - 1) * this.track.notesPerMeasure : 0
    }
  },
  
  props: {
    track: {
      type: Object,
      required: true
    },
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
    },
    midiPlayer: {
      type: Object,
      required: false
    }
  },

  watch: { 
    track: {
      handler(newVal, oldVal) { 
        this.startNoteIndex = (this.measureIndex - 1) * this.track.notesPerMeasure;        
      },
      deep: true
    },    
  },
  
  components: {
    Tom, NoteSpacer, MuteButton
  },

  template: `
    <div class="toms-container" id="tom1-container">
      <div class="opening_note_space"></div>
      <template v-for="i in track.notesPerMeasure" :key="i">
        <Tom :track="track" :noteIndex="startNoteIndex + (i - 1)" :tomIndex="tomIndex" :abcOn="abcOn" :midiPlayer="midiPlayer"/>
        <NoteSpacer :track="track" :noteIndex="i" />
      </template>
      <MuteButton :instrument="'tom' + tomIndex" :measureIndex="measureIndex"></MuteButton>
    </div>    
  `
}