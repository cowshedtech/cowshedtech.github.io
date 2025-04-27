import { ref } from 'vue'

export default {
  
  props: {
    measureIndex: {
      type: Number,
      required: true
    },
  },

  data(props) {
    return {
      repeatCount: editor?.track?.repeatedMeasures.get(props.measureIndex - 1) || 1
    }
  },

  mounted() {
    eventBus.$on('track-updated', () => {
			this.repeatCount = editor?.track?.repeatedMeasures.get(this.measureIndex - 1) || 1
		})
  },

  beforeUnmount() {
    eventBus.$off('track-updated');
  },

  methods: {
    handleCloseMeasure() {
      editor.track.deleteMeasure(this.measureIndex);
    },
    handleRepeatInc() {
      editor.track.repeatMeasureInc(this.measureIndex);
    },
    handleRepeatDec() {
      editor.track.repeatMeasureDec(this.measureIndex);
    },
    handleDuplicate() {
      editor.track.duplicateMeasure(this.measureIndex);
    },
    handleAddMiddle() {
      editor.track.addMeasure(this.measureIndex);
    }
  },

  template: `
    <div style="display: inline-block;vertical-align: top; margin-top: 15px; margin-left: 15px; margin-right: 15px">
        <div title="Remove Measure" :id="'closeMeasureButton' + measureIndex" @click.stop.prevent="handleCloseMeasure" class="closeMeasureButton">
          <i class="fa fa-times-circle"></i>
        </div>
        <div title="Repeat Measure" :id="'repeateMeasureIncButton' + measureIndex" @click.stop.prevent="handleRepeatInc" class="closeMeasureButton">
          <i class="fa">↑</i>
        </div>
        <span style="color: var(--highlight-color-on-white);">{{ repeatCount }}</span>
        <div title="Repeat Measure" :id="'repeateMeasureDecButton' + measureIndex" @click.stop.prevent="handleRepeatDec" class="closeMeasureButton">
          <i class="fa">↓</i>
        </div>
        <div title="Duplicate Measure" :id="'duplicateMeasureButton' + measureIndex" @click.stop.prevent="handleDuplicate" class="closeMeasureButton">
          <i class="fa fa-rotate-left"></i>
        </div>
        <div title="Add Measure" :id="'addMeasureMiddleButton' + measureIndex" @click.stop.prevent="handleAddMiddle" class="closeMeasureButton">
          <i class="fa fa-plus"></i>
        </div>    
   </div>`
}




// const addMeasureButton = document.getElementById("addMeasureButton");
//     addMeasureButton?.scrollIntoView({ block: "start", behavior: "smooth" });



