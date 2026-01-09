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

  inject: ['midiPlayer', 'track'],

  computed: {
    isVisible() {
      this.track && this.track.version;
      return this.track.isInstrumentMutedInMeasure(this.instrument, this.measureIndex);
    },
    visibilityStyle() {
      // Override CSS default (display:none) when visible
      return {
        display: this.isVisible ? 'inline-block' : 'none'
      };
    }
  },

  methods: {
    handleClick(event) {
        this.track.toggleMuteInstrumentForMeasure(this.instrument, this.measureIndex);
    }
  },

  template: `
    <div 
        :id="'unmute' + instrument + 'Button' + measureIndex" 
        :class="'unmute' + instrument.charAt(0).toUpperCase() + instrument.slice(1) + 'Button'"
        :style="visibilityStyle"
        @click.stop.prevent="handleClick">
      <span class="fa-stack unmuteHHStack">
        <i class="fa fa-ban fa-stack-2x" style="color:red"></i>
        <i class="fa fa-volume-down fa-stack-1x"></i>
      </span>
    </div>
  `
}