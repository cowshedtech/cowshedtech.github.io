export default {
  data() {
    return {
        measureIndex: 1,
        repeatCount: 2
    }
  },

template: `
    <div style="display: inline-block;vertical-align: top; margin-top: 15px; margin-left: 15px; margin-right: 15px">
        <div title="Remove Measure" :id="'closeMeasureButton' + measureIndex" :onClick="'closeMeasureButtonClick('+ measureIndex +')'" class="closeMeasureButton"><i class="fa fa-times-circle"></i></div>
        <div title="Repeat Measure" :id="'repeateMeasureIncButton' + measureIndex" :onClick="'repeatMeasureIncButtonClick('+ measureIndex +')'" class="closeMeasureButton"><i class="fa">↑</i></div>
        <span style="color: var(--highlight-color-on-white);">{{ repeatCount }}</span>
        <div title="Repeat Measure" :id="'repeateMeasureDecButton' + measureIndex" :onClick="'repeatMeasureDecButtonClick('+ measureIndex +')'" class="closeMeasureButton"><i class="fa">↓</i></div>
        <div title="Duplicate Measure" :id="'duplicateMeasureButton' + measureIndex" :onClick="'duplicateMeasureButtonClick('+ measureIndex +')'" class="closeMeasureButton"><i class="fa fa-rotate-left"></i></div>
        <div title="Add Measure" :id="'addMeasureMiddleButton' + measureIndex" :onClick="'addMeasureMiddleButtonClick('+ measureIndex +')'" class="closeMeasureButton"><i class="fa fa-plus"></i></div>
    </div>
  </div>`
}


