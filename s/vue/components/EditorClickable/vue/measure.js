import { h } from 'vue'
import MeasureButtonAddStart from './measure_button_add_start.js'
import MeasureControls from './measure_controls.js'
import Sticking from './sticking.js'
import LineLabels from './line_labels.js'
import HighHat from './highhats.js'
import Tom from './tom.js'
import Snare from './snare.js'
import Kick from './kicks.js'
import Highlights from './highlights.js'

export default {
  props: {
    measureIndex: {
      type: Number,
      required: true
    },
  },

  components: {
    MeasureButtonAddStart, MeasureControls, Sticking, LineLabels, HighHat, Tom, Snare, Kick
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
                h('div', { class: 'staff-line-1' }, []),
                h('div', { class: 'staff-line-2' }, []),
                h('div', { class: 'staff-line-3' }, []),
                h('div', { class: 'staff-line-4' }, []),
                h('div', { class: 'staff-line-5' }, []),
                h(Highlights),
                h(HighHat),
                h(Tom, { index: 1}),
                h(Snare),
                h(Tom, { index: 4}),
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