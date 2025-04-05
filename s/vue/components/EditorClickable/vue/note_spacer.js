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
    // const startNoteIndex = (props.measureIndex - 1) * notesPerMeasure;
    return { notesPerMeasure, groupSize }
  },

  template: `
    <div v-if="noteIndex % groupSize === 0 && i < notesPerMeasure" class="space_between_note_groups"></div>
  `,
}
