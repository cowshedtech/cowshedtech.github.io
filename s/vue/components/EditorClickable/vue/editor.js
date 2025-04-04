import { ref } from 'vue'
import ContextMenus from './instruments/context_menus.js'

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
  parts.push(generateStickingContainerHTML(baseindex, indexStartForNotes, notesPerMeasure, numBeats, noteValue));

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
    ContextMenus
  },

  setup() {
    const content = ref("")
    content.value = generateWriterHTML();
    return { content }
  },

  template: `<div id="musicalInput" class="fullWidthEle edit-block">
                <div id="measureContainer">
                  <span id="addMeasureButtonStart" title="Add measure" onClick="addMeasurePrevButtonClick(event)">
                    <i class="fa fa-plus"></i>
                  </span>
                  <div class="staff-container" id="staff-container1">
                    <span v-html="content"></span>
                  </div>    
                  <div style="display: inline-block;vertical-align: top; margin-top: 15px; margin-left: 15px; margin-right: 15px">
                      <div title="Remove Measure" :id="'closeMeasureButton' + measureIndex" :onClick="'closeMeasureButtonClick('+ measureIndex +')'" class="closeMeasureButton"><i class="fa fa-times-circle"></i></div>
                      <div title="Repeat Measure" :id="'repeateMeasureIncButton' + measureIndex" :onClick="'repeatMeasureIncButtonClick('+ measureIndex +')'" class="closeMeasureButton"><i class="fa">↑</i></div>
                      <span style="color: var(--highlight-color-on-white);">{{ repeatCount }}</span>
                      <div title="Repeat Measure" :id="'repeateMeasureDecButton' + measureIndex" :onClick="'repeatMeasureDecButtonClick('+ measureIndex +')'" class="closeMeasureButton"><i class="fa">↓</i></div>
                      <div title="Duplicate Measure" :id="'duplicateMeasureButton' + measureIndex" :onClick="'duplicateMeasureButtonClick('+ measureIndex +')'" class="closeMeasureButton"><i class="fa fa-rotate-left"></i></div>
                      <div title="Add Measure" :id="'addMeasureMiddleButton' + measureIndex" :onClick="'addMeasureMiddleButtonClick('+ measureIndex +')'" class="closeMeasureButton"><i class="fa fa-plus"></i></div>
                  </div>
                </div>
            </div>
            <ContextMenus></ContextMenus>`
}


