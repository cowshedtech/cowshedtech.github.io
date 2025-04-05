import Kick from './kick.js'
import KicksMute from './kicks_mute.js'

export default {
  
  props: {
    measureIndex: {
      type: Number,
      required: true
    }
  },

  components: {
   Kick, KicksMute
  },

  setup(props) {
    const { notesPerMeasure, numBeats, noteValue } = editor.track;
    const groupSize = noteGroupingSize(notesPerMeasure, numBeats, noteValue)
    const startNoteIndex = (props.measureIndex - 1) * notesPerMeasure;
    return { startNoteIndex, notesPerMeasure, groupSize}
  },

  template: `
    <div class="kick-container">
      <div class="opening_note_space"></div>
      <template v-for="i in notesPerMeasure" :key="i">
        <Kick :noteIndex="startNoteIndex + (i - 1)" />
        <div v-if="i % groupSize === 0 && i < notesPerMeasure" class="space_between_note_groups"></div>
      </template>
      <KicksMute :measureIndex="measureIndex"></KicksMute>
    </div>
  `
}