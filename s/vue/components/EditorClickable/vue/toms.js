import Tom from './tom.js'
import TomsMute from './toms_mute.js'

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
    Tom, TomsMute
  },

  setup(props) {
    const { notesPerMeasure, numBeats, noteValue } = editor.track;
    const groupSize = noteGroupingSize(notesPerMeasure, numBeats, noteValue)
    const startNoteIndex = (props.measureIndex - 1) * notesPerMeasure;
    return { startNoteIndex, notesPerMeasure, groupSize }
  },

  template: `
    <div class="toms-container" id="tom1-container">
      <div class="opening_note_space"></div>
      <template v-for="i in notesPerMeasure" :key="i">
        <Tom :noteIndex="startNoteIndex + (i - 1)" :tomIndex="tomIndex" />
        <div v-if="i % groupSize === 0 && i < notesPerMeasure" class="space_between_note_groups"></div>
      </template>
      <TomsMute :measureIndex="measureIndex" :tomIndex="tomIndex></TomsMute>
    </div>
  `
}

