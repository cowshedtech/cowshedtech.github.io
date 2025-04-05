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
    <div 
        :id="'unmute' + instrument + 'Button' + measureIndex" 
        :class="'unmute' + instrument.charAt(0).toUpperCase() + instrument.slice(1) + 'Button'"
        @click="handleClick">
      <span class="fa-stack unmuteHHStack">
        <i class="fa fa-ban fa-stack-2x" style="color:red"></i>
        <i class="fa fa-volume-down fa-stack-1x"></i>
      </span>
    </div>
  `
}