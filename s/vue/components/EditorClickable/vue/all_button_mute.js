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

  data() {
    return {
      // Increment to trigger recomputation of computed props on 'track-updated'
      refreshCounter: 0,
      removeHandler: null
    }
  },

  computed: {
    isVisible() {
      // establish reactive dependency
      void this.refreshCounter;
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

  mounted() {
    this.removeHandler = eventBus.$on('track-updated', () => {
      this.refreshCounter++;
    });
  },

  beforeUnmount() {
    if (this.removeHandler) this.removeHandler();
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