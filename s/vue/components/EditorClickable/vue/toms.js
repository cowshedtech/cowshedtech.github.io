import Tom from './tom.js'
import TomsMute from './toms_mute.js'
import NoteSpacer from './note_spacer.js'
import MuteButton from './button_mute.js'

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
    Tom, TomsMute, NoteSpacer, MuteButton
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
  `
}