export default {
  props: {
    track: {
      type: Object,
      required: true
    },
    noteIndex: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      trackData: editor.track ? editor.track : null,
      groupSize: 4
    }
  },

  watch: { 
    track: {
      handler(newVal, oldVal) { 
        this.trackData = newVal;
        const { notesPerMeasure, numBeats, noteValue } = editor.track;
        this.groupSize = noteGroupingSize(notesPerMeasure, numBeats, noteValue)
        this.$forceUpdate(); 
      },
      deep: true
    },    
  },

  onBeforeMount() {
    const { notesPerMeasure, numBeats, noteValue } = editor.track;
    this.groupSize = noteGroupingSize(notesPerMeasure, numBeats, noteValue)
  },

  template: `
    <div v-if="noteIndex % groupSize === 0 && noteIndex < trackData.notesPerMeasure" class="space_between_note_groups"></div>
  `,
}
