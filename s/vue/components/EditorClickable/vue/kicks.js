import Kick from './kick.js'
import KicksMute from './kicks_mute.js'
import NoteSpacer from './note_spacer.js'

export default {
  
  props: {
    measureIndex: {
      type: Number,
      required: true
    }
  },

  components: {
   Kick, KicksMute, NoteSpacer
  },

  setup(props) {
    const { notesPerMeasure, numBeats, noteValue } = editor.track;
    const startNoteIndex = (props.measureIndex - 1) * notesPerMeasure;
    return { startNoteIndex, notesPerMeasure}
  },

  template: `
    <div class="kick-container">
      <div class="opening_note_space"></div>
      <template v-for="i in notesPerMeasure" :key="i">
        <Kick :noteIndex="startNoteIndex + (i - 1)" />
         <NoteSpacer :noteIndex="i" />
      </template>
      <KicksMute :measureIndex="measureIndex"></KicksMute>
    </div>
  `
}