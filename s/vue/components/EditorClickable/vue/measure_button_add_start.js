export default {
  
  props: {
    measureIndex: {
      type: Number,
      required: true
    },
  },

  template: `
    <span v-if="measureIndex === 1" id="addMeasureButtonStart" title="Add measure" onClick="addMeasurePrevButtonClick(event)">
        <i class="fa fa-plus"></i>
    </span>`
}


