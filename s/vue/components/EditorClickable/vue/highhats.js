import HighHat from './highhat.js'
import MuteButton from './all_button_mute.js'
import NoteSpacer from './all_note_spacer.js'
import HighHatMenu from './highhat_menu.js'

export default {
  
  props: {
    track: {
      type: Object,
      required: true
    },
    measureIndex: {
      type: Number,
      required: true
    }
  },

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
    HighHat, MuteButton, NoteSpacer, HighHatMenu
  },

  template: `
    <div class="hi-hat-container">
      <div class="opening_note_space"></div>
      <template v-for="i in track.notesPerMeasure" :key="i">
        <HighHat :track="track" :noteIndex="startNoteIndex + (i - 1)" />
        <NoteSpacer :track="track" :noteIndex="i" />
      </template>
      <MuteButton instrument="hh" :measureIndex="measureIndex"></MuteButton>
    </div>
    <HighHatMenu />    
  `
}