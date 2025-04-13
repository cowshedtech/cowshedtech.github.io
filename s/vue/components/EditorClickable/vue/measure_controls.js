import { ref } from 'vue'

export default {
  
  props: {
    measureIndex: {
      type: Number,
      required: true
    },
  },

  setup(props) {
    const repeatCount = ref("")
    repeatCount.value = editor.track.repeatedMeasures.get(props.measureIndex - 1) || 1;
    return { repeatCount }
  },

  methods: {
    handleCloseMeasure() {
      closeMeasureButtonClick(this.measureIndex);
    },
    handleRepeatInc() {
      repeatMeasureIncButtonClick(this.measureIndex);
    },
    handleRepeatDec() {
      repeatMeasureDecButtonClick(this.measureIndex);
    },
    handleDuplicate() {
      duplicateMeasureButtonClick(this.measureIndex);
    },
    handleAddMiddle() {
      addMeasureMiddleButtonClick(this.measureIndex);
    }
  },

  template: `
    <div style="display: inline-block;vertical-align: top; margin-top: 15px; margin-left: 15px; margin-right: 15px">
        <div title="Remove Measure" :id="'closeMeasureButton' + measureIndex" @click="handleCloseMeasure" class="closeMeasureButton">
          <i class="fa fa-times-circle"></i>
        </div>
        <div title="Repeat Measure" :id="'repeateMeasureIncButton' + measureIndex" @click="handleRepeatInc" class="closeMeasureButton">
          <i class="fa">↑</i>
        </div>
        <span style="color: var(--highlight-color-on-white);">{{ repeatCount }}</span>
        <div title="Repeat Measure" :id="'repeateMeasureDecButton' + measureIndex" @click="handleRepeatDec" class="closeMeasureButton">
          <i class="fa">↓</i>
        </div>
        <div title="Duplicate Measure" :id="'duplicateMeasureButton' + measureIndex" @click="handleDuplicate" class="closeMeasureButton">
          <i class="fa fa-rotate-left"></i>
        </div>
        <div title="Add Measure" :id="'addMeasureMiddleButton' + measureIndex" @click="handleAddMiddle" class="closeMeasureButton">
          <i class="fa fa-plus"></i>
        </div>    
   </div>`
}


