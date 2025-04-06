import Tom from './tom.js'
import NoteSpacer from './all_note_spacer.js'
import MuteButton from './all_button_mute.js'
import TomMenu from './tom_menu.js'
import TomLabelMenu from './tom_label_menu.js'


export default {

  props: {
    measureIndex: {
      type: Number,
      required: true
    },
    tomIndex: {
      type: Number,
      required: true
    }
  },

  components: {
    Tom, TomMenu, TomLabelMenu, NoteSpacer, MuteButton
  },

  setup(props) {
    const { notesPerMeasure, numBeats, noteValue } = editor.track;
    const startNoteIndex = (props.measureIndex - 1) * notesPerMeasure;
    return { startNoteIndex, notesPerMeasure }
  },

  template: `
    <div class="toms-container" id="tom1-container">
      <div class="opening_note_space"></div>
      <template v-for="i in notesPerMeasure" :key="i">
        <Tom :noteIndex="startNoteIndex + (i - 1)" :tomIndex="tomIndex" />
        <NoteSpacer :noteIndex="i" />
      </template>
      <MuteButton :instrument="'tom' + tomIndex" :measureIndex="measureIndex"></MuteButton>
    </div>
    <TomMenu :tomIndex="tomIndex"/>
    <TomLabelMenu :tomIndex="tomIndex"/>
  `
}