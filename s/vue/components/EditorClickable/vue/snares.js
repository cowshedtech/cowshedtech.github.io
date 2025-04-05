import Snare from './snare.js'
import SnaresMute from './snares_mute.js'
import NoteSpacer from './note_spacer.js'

export default {
  
  props: {
    measureIndex: {
      type: Number,
      required: true
    }
  },

  components: {
    Snare, SnaresMute, NoteSpacer
  },

  setup(props) {
    const { notesPerMeasure, numBeats, noteValue } = editor.track;
    const startNoteIndex = (props.measureIndex - 1) * notesPerMeasure;
    return { startNoteIndex, notesPerMeasure}
  },

  template: `
    <div class="snare-container">
      <div class="opening_note_space"></div>
      <template v-for="i in notesPerMeasure" :key="i">
        <Snare :noteIndex="startNoteIndex + (i - 1)" />
        <NoteSpacer :noteIndex="i" />
      </template>
      <SnaresMute :measureIndex="measureIndex"></SnaresMute>
    </div>
  `
}