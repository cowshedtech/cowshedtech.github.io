export default {
  props: {
    noteIndex: {
      type: Number,
      required: true
    }
  },

  setup(props) {
    const { notesPerMeasure, numBeats, noteValue } = editor.track;
    const groupSize = noteGroupingSize(notesPerMeasure, numBeats, noteValue)
    return { notesPerMeasure, groupSize }
  },

  template: `
    <div v-if="noteIndex % groupSize === 0 && noteIndex < notesPerMeasure" class="space_between_note_groups"></div>
  `,
}
