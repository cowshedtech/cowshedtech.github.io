import { ref, h, Fragment, createVNode, createCommentVNode, withDirectives, createStaticVNode } from 'vue'
import MeasureButtonAddStart from './measure_button_add_start.js'
import MeasureControls from './measure_controls.js'
import Sticking from './sticking.js'
import LineLabels from './line_labels.js'
import HighHat from './highhat.js'
import Tom from './tom.js'
import Snare from './snare.js'
import Kick from './kicks.js'


//
//
export default {
  data() {
    return {
      measureIndex: 1,
      repeatCount: 2
    }
  },

  components: {
    MeasureButtonAddStart, MeasureControls, Sticking, LineLabels, HighHat, Tom, Snare, Kick
  },

  setup() {
    const { notesPerMeasure, numBeats, noteValue } = editor.track;
    const highlightsContent = ref("")  
    highlightsContent.value = generateBackgroundHighlights(0, notesPerMeasure, numBeats, noteValue)

    return { highlightsContent }
  },

  render() {
    return h('div', [
      h(MeasureButtonAddStart),
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
                h('div', { class: 'background-highlight-container' }, [
                  h('div', { class: 'opening_note_space' }, [ 
                    createStaticVNode(this.highlightsContent),
                    h('div', { class: 'end_note_space' }, [])
                  ])
                ]),
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