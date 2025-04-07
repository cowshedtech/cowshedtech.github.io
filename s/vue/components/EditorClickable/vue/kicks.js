import Kick from './kick.js'
import MuteButton from './all_button_mute.js'
import NoteSpacer from './all_note_spacer.js'
import KickMenu from './kick_menu.js'

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
      trackData: editor.track ? editor.track : null
    }
  },

  watch: { 
    track: {
      handler(newVal, oldVal) { 
        this.trackData = newVal;
        this.$forceUpdate(); 
      },
      deep: true
    },    
  },

  components: {
   Kick, KickMenu, MuteButton, NoteSpacer
  },

  setup(props) {
    const { notesPerMeasure, numBeats, noteValue } = editor.track;
    const startNoteIndex = (props.measureIndex - 1) * notesPerMeasure;
    return { startNoteIndex, notesPerMeasure}
  },

  template: `
    <div class="kick-container">
      <div class="opening_note_space"></div>
      <template v-for="i in trackData.notesPerMeasure" :key="i">
        <Kick :noteIndex="startNoteIndex + (i - 1)" />
         <NoteSpacer :track="track" :noteIndex="i" />
      </template>
      <MuteButton instrument="kick" :measureIndex="measureIndex"></MuteButton>
    </div>
    <KickMenu />    
  `
}