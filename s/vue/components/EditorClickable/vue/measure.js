import { ref } from 'vue'
import MeasureButtonAddStart from './measure_button_add_start.js'
import MeasureControls from './measure_controls.js'
import Sticking from './sticking.js'


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

  // Add sticking container
  // parts.push(generateStickingContainerHTML2(baseindex, indexStartForNotes, notesPerMeasure, numBeats, noteValue));

  // Notes row container with line labels
  parts.push(`
      <span class="notes-row-container">
          ${generateLineLabels(baseindex)}
          <div class="music-line-container">
              <div class="notes-container">
                  ${Array(5).fill().map((_, i) => `<div class="staff-line-${i + 1}"></div>`).join('\n')}
  `);

  // Background highlights
  parts.push(`
      <div class="background-highlight-container">
          <div class="opening_note_space"></div>
          ${generateBackgroundHighlights(indexStartForNotes, notesPerMeasure, numBeats, noteValue)}
          <div class="end_note_space"></div>
      </div>
  `);

  // Generate instrument containers
  const instruments = [
    { fn: generateHiHatContainerHTML, args: [] },
    { fn: generateTomContainerHTML, args: [1] },
    { fn: generateSnareContainerHTML, args: [] },
    { fn: generateTomContainerHTML, args: [4] },
    { fn: generateKickContainerHTML, args: [] }
  ];

  parts.push(instruments.map(({ fn, args }) =>
    fn(indexStartForNotes, baseindex, notesPerMeasure, numBeats, noteValue, indexStartForNotes, ...args)
  ).join(''));

  // Close containers
  parts.push('</div></div></span>');

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
    MeasureButtonAddStart, MeasureControls, Sticking
  },

  setup() {
    const content = ref("")
    content.value = generateWriterHTML();
    return { content }
  },

  template: `
    <MeasureButtonAddStart></MeasureButtonAddStart>
    <div class="staff-container" id="staff-container1">
      <Sticking></Sticking>
      <span v-html="content"></span>
    </div>    
    <MeasureControls></MeasureControls>    
  </div>`
}