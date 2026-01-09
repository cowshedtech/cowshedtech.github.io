import Kick from './kick.js'
import MuteButton from './all_button_mute.js'
import NoteSpacer from './all_note_spacer.js'
import KickMenu from './kick_menu.js'

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
   Kick, KickMenu, MuteButton, NoteSpacer
  },

  template: `
    <div class="kick-container">
      <div class="opening_note_space"></div>
      <template v-for="i in track.notesPerMeasure" :key="i">
        <Kick :noteIndex="startNoteIndex + (i - 1)"/>
        <NoteSpacer :track="track" :noteIndex="i" />
      </template>
      <MuteButton instrument="Kick" :measureIndex="measureIndex"></MuteButton>
    </div>
    <KickMenu />    
  `
}