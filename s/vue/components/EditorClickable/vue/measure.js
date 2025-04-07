import { h, isReactive } from 'vue'
import MeasureButtonAddStart from './measure_button_add_start.js'
import MeasureControls from './measure_controls.js'
import Stickings from './stickings.js'
import LineLabels from './line_labels.js'
import HighHats from './highhats.js'
import Toms from './toms.js'
import Snares from './snares.js'
import Kick from './kicks.js'
import Highlights from './highlights.js'
import StaffLines from './staff_line.js'

export default {
  data() {
    return {
      trackData: editor.track ? editor.track : null
    }
  },
  
  props: {
    track: {
      type: Object,
      required: true
    },
    measureIndex: {
      type: Number,
      required: true
    },    
  },

  watch: { 
    track: {
      handler(newVal, oldVal) { // watch it
        this.trackData = editor.track;
        console.log('measure change [' + this.trackData.title + ']' )
      },
      deep: true
    },    
  },

  components: {
    MeasureButtonAddStart, MeasureControls, Stickings, LineLabels, HighHats, Toms, Snares, Kick, Highlights, StaffLines
  },

  template: `
    <div>
      <MeasureButtonAddStart :measureIndex="measureIndex" />
      <div class="staff-container" id="staff-container1">
        <Stickings :track="track" :measureIndex="measureIndex" />
        <span class="notes-row-container">
          <span>
            <LineLabels :measureIndex="measureIndex" />
            <div class="music-line-container">
              <div class="notes-container">
                <StaffLines />
                <Highlights />
                <HighHats :measureIndex="measureIndex" />
                <Toms :measureIndex="measureIndex" :tomIndex="1" />
                <Snares :measureIndex="measureIndex" />
                <Toms :measureIndex="measureIndex" :tomIndex="4" />
                <Kick :measureIndex="measureIndex" />                
              </div>
            </div>
          </span>
        </span>
      </div>
      <MeasureControls />
    </div>
  `
}