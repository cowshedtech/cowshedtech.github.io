export default {
  
  props: {
    instrument: {
        type: String,
        required: true
      },
      measureIndex: {
      type: Number,
      required: true
    }
  },

  methods: {
    handleClick(event) {
        muteInstrument(this.instrument, this.measureIndex, false)
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



//     <div :id="'unmute' + instrument + 'Button' + measureIndex" :class="'unmute' + instrument + 'Button'" @click="handleClick">
//     <span class="fa-stack unmuteHHStack">
//       <i class="fa fa-ban fa-stack-2x" style="color:red"></i>
//       <i class="fa fa-volume-down fa-stack-1x"></i>
//     </span>
//   </div>