import { h } from 'vue'
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
  props: {
    measureIndex: {
      type: Number,
      required: true
    },
  },

  components: {
    MeasureButtonAddStart, MeasureControls, Stickings, LineLabels, HighHats, Toms, Snares, Kick, Highlights, StaffLines
  },

  template: `
    <div>
      <MeasureButtonAddStart :measureIndex="1" />
      <div class="staff-container" id="staff-container1">
        <Stickings :measureIndex="1" />
        <span class="notes-row-container">
          <span>
            <LineLabels :measureIndex="1" />
            <div class="music-line-container">
              <div class="notes-container">
                <StaffLines />
                <Highlights />
                <HighHats :measureIndex="1" />
                <Toms :measureIndex="1" :tomIndex="1" />
                <Snares :measureIndex="1" />
                <Toms :measureIndex="1" :tomIndex="4" />
                <Kick :measureIndex="1" />
              </div>
            </div>
          </span>
        </span>
      </div>
      <MeasureControls />
    </div>
  `
}