export default {
  
  props: {
    measureIndex: {
      type: Number,
      required: true
    }
  },

  methods: {
    handleClick(event) {
        muteInstrument('hh', this.measureIndex, false)
    }
  },

  template: `
    <div :id="'unmutehhButton' + measureIndex" class="unmuteHHButton" @click="handleClick">
      <span class="fa-stack unmuteHHStack">
        <i class="fa fa-ban fa-stack-2x" style="color:red"></i>
        <i class="fa fa-volume-down fa-stack-1x"></i>
      </span>
    </div>
  `
}