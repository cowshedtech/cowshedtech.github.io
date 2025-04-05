import { h } from 'vue'
import MeasureButtonAddStart from './measure_button_add_start.js'
import MeasureControls from './measure_controls.js'
import Sticking from './sticking.js'
import LineLabels from './line_labels.js'
import HighHats from './highhats.js'
import Toms from './toms.js'
import Snare from './snare.js'
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
    MeasureButtonAddStart, MeasureControls, Sticking, LineLabels, HighHats, Toms, Snare, Kick
  },

  render() {
    return h('div', [
      h(MeasureButtonAddStart, { measureIndex: 1}),
      h('div', { class: 'staff-container', id: 'staff-container1' }, [
        h(Sticking),
        h('span', { class: 'notes-row-container' }, [
          h('span', [
            h(LineLabels),
            h('div', { class: 'music-line-container' }, [
              h('div', { class: 'notes-container' }, [
                h(StaffLines),
                h(Highlights),
                h(HighHats,  { measureIndex: 1}),
                h(Toms, { measureIndex: 1, tomIndex: 1}),
                h(Snare),
                h(Toms, { measureIndex: 1, tomIndex: 4}),
                h(Kick)
              ])
            ])              
          ])
        ])
      ]),
      h(MeasureControls)
    ])
  }
}