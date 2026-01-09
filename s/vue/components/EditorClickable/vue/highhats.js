import HighHat from './highhat.js'
import MuteButton from './all_button_mute.js'
import NoteSpacer from './all_note_spacer.js'

export default {
  
  props: {
    measureIndex: {
      type: Number,
      required: true
    }
  },

  inject: ['midiPlayer', 'track'],

  data() {
    return {
      startNoteIndex: this.track ? (this.measureIndex - 1) * this.track.notesPerMeasure : 0
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
    HighHat, MuteButton, NoteSpacer
  },

  template: `
    <div class="hi-hat-container">
      <div class="opening_note_space"></div>
      <template v-for="i in track.notesPerMeasure" :key="i">
        <HighHat :noteIndex="startNoteIndex + (i - 1)"/>
        <NoteSpacer :track="track" :noteIndex="i" />
      </template>
      <MuteButton instrument="HighHat" :measureIndex="measureIndex"></MuteButton>
    </div>  
  `
}