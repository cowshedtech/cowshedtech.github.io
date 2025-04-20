export default {
  
  props: {
    measureIndex: {
      type: Number,
      required: true
    },
  },

  methods: {
    handleAddStart() {
      editor.track.addMeasure(0);
    }
  },

  template: `
    <span v-if="measureIndex === 1" id="addMeasureButtonStart" title="Add measure" @click="handleAddStart">
        <i class="fa fa-plus"></i>
    </span>`
}


