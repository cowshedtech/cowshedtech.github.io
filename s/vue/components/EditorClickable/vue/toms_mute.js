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

  methods: {
    handleClick(event) {
        muteInstrument('tom' + this.tomIndex, this.measureIndex, false)
    }
  },

  template: `
    <div :id="'unmutetom' + tomIndex + 'Button' + measureIndex" :class="'unmuteTom' + tomIndex + 'Button'" @click="handleClick">
      <span class="fa-stack unmuteHHStack">
        <i class="fa fa-ban fa-stack-2x" style="color:red"></i>
        <i class="fa fa-volume-down fa-stack-1x"></i>
      </span>
    </div>
  `
}