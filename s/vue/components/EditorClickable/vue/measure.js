import { ref, h, Fragment, createVNode, createCommentVNode, withDirectives, createStaticVNode } from 'vue'
import MeasureButtonAddStart from './measure_button_add_start.js'
import MeasureControls from './measure_controls.js'
import Sticking from './sticking.js'
import LineLabels from './line_labels.js'
import HighHat from './highhat.js'
import Tom from './tom.js'
import Snare from './snare.js'


/**
 * Creates HTML for a music staff container including note grids and labels.
 * Each staff container represents one measure in the score.
 * 
 * @param {number} baseindex - Index for CSS labels (e.g., "staff-container1")
 * @param {number} indexStartForNotes - Starting index for note IDs in this container
 * @returns {string} HTML string containing the complete staff container
 * @requires Functions:
 * - generateLineLabels - Creates drum kit line labels
 * - generateMeasureButtons - Creates measure control buttons
 * @requires editor.track - Track object containing score state
 */
function htmlForStaffContainer2(baseindex, indexStartForNotes) {
  const { notesPerMeasure, numBeats, noteValue } = editor.track;
  const parts = [];

  // Generate instrument containers
  const instruments = [
    { fn: generateTomContainerHTML, args: [4] },
    { fn: generateKickContainerHTML, args: [] }
  ];

  parts.push(instruments.map(({ fn, args }) =>
    fn(indexStartForNotes, baseindex, notesPerMeasure, numBeats, noteValue, indexStartForNotes, ...args)
  ).join(''));
  
  return parts.join('\n');
}


//
//
function generateWriterHTML() {
  var genHTML = "";
  var cur_measure;
  for (cur_measure = 1; cur_measure <= editor.track.numberOfMeasures; cur_measure++) {
    genHTML += htmlForStaffContainer2(cur_measure, (cur_measure - 1) * editor.track.notesPerMeasure);
  }
  return genHTML
}

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
    MeasureButtonAddStart, MeasureControls, Sticking, LineLabels, HighHat, Tom, Snare
  },

  setup() {
    const content = ref("")
    content.value = generateWriterHTML();

    const { notesPerMeasure, numBeats, noteValue } = editor.track;
    const highlightsContent = ref("")  
    highlightsContent.value = generateBackgroundHighlights(0, notesPerMeasure, numBeats, noteValue)

    return { content, highlightsContent }
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
                h(Tom),
                h(Snare),
                createStaticVNode(this.content)
              ])
            ])              
          ])
        ])
      ]),
      h(MeasureControls)
    ])
  }
}

{/* <component v-html="content"></component> */}
          