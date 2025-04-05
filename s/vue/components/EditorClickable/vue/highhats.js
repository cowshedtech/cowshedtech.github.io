import { h } from 'vue'
import HighHat from './highhat.js'

export default {
  
  props: {
    measureIndex: {
      type: Number,
      required: true
    }
  },

  components: {
   HighHat
  },

  setup() {
    const { notesPerMeasure, numBeats, noteValue } = editor.track;
    const groupSize = noteGroupingSize(notesPerMeasure, numBeats, noteValue)
    return { groupSize }
},

  render() {
    const startIndex = (this.measureIndex - 1) * editor.track.notesPerMeasure;
    
    return h('div', { class: 'hi-hat-container' }, [
      h('div', { class: 'opening_note_space' }, []),
      ...Array.from({ length: editor.track.notesPerMeasure }, (_, i) => [
        h(HighHat, { noteIndex: startIndex + i }),
        (i - (startIndex - 1)) % this.groupSize === 0 && i < startIndex + editor.track.notesPerMeasure - 1 ? h('div', { class: 'space_between_note_groups' }, []) : null
      ]).flat(),
      h('div', { class: 'unmuteHHButton', id: 'unmutehhButton' + this.measureIndex, onClick: () => muteInstrument("hh", this.measureIndex, false) }, [
        h('span', { class: 'fa-stack unmuteHHStack' }, [
          h('i', { class: 'fa fa-ban fa-stack-2x', style: 'color:red' }, []),
          h('i', { class: 'fa fa-volume-down fa-stack-1x' }, [])
        ])
      ])
    ])
  }
}