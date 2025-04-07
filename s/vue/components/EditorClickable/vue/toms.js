import Tom from './tom.js'
import NoteSpacer from './all_note_spacer.js'
import MuteButton from './all_button_mute.js'
import TomMenu from './tom_menu.js'

export default {

  data() {
    return {
      trackData: editor.track ? editor.track : null
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
    Tom, TomMenu, NoteSpacer, MuteButton
  },

  setup(props) {
    const { notesPerMeasure, numBeats, noteValue } = editor.track;
    const startNoteIndex = (props.measureIndex - 1) * notesPerMeasure;
    return { startNoteIndex, notesPerMeasure }
  },

  template: `
    <div class="toms-container" id="tom1-container">
      <div class="opening_note_space"></div>
      <template v-for="i in trackData.notesPerMeasure" :key="i">
        <Tom :noteIndex="startNoteIndex + (i - 1)" :tomIndex="tomIndex" />
        <NoteSpacer :track="track" :noteIndex="i" />
      </template>
      <MuteButton :instrument="'tom' + tomIndex" :measureIndex="measureIndex"></MuteButton>
    </div>
    <TomMenu :tomIndex="tomIndex"/>
    <TomLabelMenu :tomIndex="tomIndex"/>
  `
}