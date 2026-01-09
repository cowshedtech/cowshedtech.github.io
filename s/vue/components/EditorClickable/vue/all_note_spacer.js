export default {
  props: {
    noteIndex: {
      type: Number,
      required: true
    }
  },

  inject: ['midiPlayer', 'track'],


  data() {
    return {
      groupSize: this.track ? this.track.noteGroupingSize() : 4
    }
  },

  computed: {
    groupSize() {
      this.track && this.track.version;
      return this.track.noteGroupingSize();
    }
  },

  template: `
    <div v-if="noteIndex % groupSize === 0 && noteIndex < this.track.notesPerMeasure" class="space_between_note_groups"></div>
  `,
}
