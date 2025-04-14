import Snare from './snare.js'
import NoteSpacer from './all_note_spacer.js'
import MuteButton from './all_button_mute.js'
import SnareMenu from './snare_menu.js'

export default {
  
  props: {
    track: {
      type: Object,
      required: true
    },
    measureIndex: {
      type: Number,
      required: true
    },
    midiPlayer: {
      type: Object,
      required: false
    }
  },

  data() {
    return {
      startNoteIndex: this.track ? (this.measureIndex - 1) * this.track.notesPerMeasure : 0
    }
  },
  
  components: {
    Snare, SnareMenu, MuteButton, NoteSpacer
  },

  watch: { 
    track: {
      handler(newVal, oldVal) { 
        this.startNoteIndex = (this.measureIndex - 1) * this.track.notesPerMeasure;        
      },
      deep: true
    },    
  },

  template: `
    <div class="snare-container">
      <div class="opening_note_space"></div>
      <template v-for="i in track.notesPerMeasure" :key="i">
        <Snare :track="track" :noteIndex="startNoteIndex + (i - 1)" :midiPlayer="midiPlayer"/>
        <NoteSpacer :track="track" :noteIndex="i" />
      </template>
      <MuteButton instrument="snare" :measureIndex="measureIndex"></MuteButton>
    </div>
    <SnareMenu />    
  `
}