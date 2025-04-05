import HighHat from './highhat.js'
import HighHatMute from './highhats_mute.js'
import NoteSpacer from './note_spacer.js'

export default {
  
  props: {
    measureIndex: {
      type: Number,
      required: true
    }
  },

  components: {
   HighHat, HighHatMute, NoteSpacer
  },

  setup(props) {
    const { notesPerMeasure, numBeats, noteValue } = editor.track;
    const startNoteIndex = (props.measureIndex - 1) * notesPerMeasure;
    return { startNoteIndex, notesPerMeasure}
  },

  template: `
    <div class="hi-hat-container">
      <div class="opening_note_space"></div>
      <template v-for="i in notesPerMeasure" :key="i">
        <HighHat :noteIndex="startNoteIndex + (i - 1)" />
        <NoteSpacer :noteIndex="i" />
      </template>
      <HighHatMute :measureIndex="measureIndex"></HighHatMute>
    </div>
  `
}