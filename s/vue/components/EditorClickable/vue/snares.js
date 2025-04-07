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
    }
  },

  data() {
    return {
      trackData: editor.track ? editor.track : null
    }
  },
  
  components: {
    Snare, SnareMenu, MuteButton, NoteSpacer
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

  setup(props) {
    const { notesPerMeasure, numBeats, noteValue } = editor.track;
    const startNoteIndex = (props.measureIndex - 1) * notesPerMeasure;
    return { startNoteIndex, notesPerMeasure}
  },

  template: `
    <div class="snare-container">
      <div class="opening_note_space"></div>
      <template v-for="i in trackData.notesPerMeasure" :key="i">
        <Snare :noteIndex="startNoteIndex + (i - 1)" />
        <NoteSpacer :track="track" :noteIndex="i" />
      </template>
      <MuteButton instrument="snare" :measureIndex="measureIndex"></MuteButton>
    </div>
    <SnareMenu />    
  `
}