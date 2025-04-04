import { ref } from 'vue'
import MeasureButtonAddStart from './measure_button_add_start.js'
import MeasureControls from './measure_controls.js'
import Sticking from './sticking.js'


function generateStickingContainerHTML3(baseindex, indexStartForNotes, notesPerMeasure, numBeats, noteValuePerMeasure) {
  var newHTML = [];

  // newHTML.push('<div class="stickings-row-container">');
  newHTML.push('  <div class="line-labels">');
  newHTML.push('     <div class="stickings-label" onClick="noteLabelClick(event, \'stickings\', ' + baseindex + ')" oncontextmenu="event.preventDefault(); noteLabelClick(event, \'stickings\', ' + baseindex + ')">STICKINGS</div>');
  newHTML.push('  </div>');
  newHTML.push('  <div class="music-line-container">');
  newHTML.push('     <div class="notes-container">');
  newHTML.push('       <div class="stickings-container">');
  newHTML.push('         <div class="opening_note_space"> </div>');

  for (var i = indexStartForNotes; i < notesPerMeasure + indexStartForNotes; i++) {
      newHTML.push('       <div id="sticking' + i + '" class="sticking">');
      newHTML.push('         <div class="sticking_right note_part" id="sticking_right' + i + '" onClick="noteLeftClick(event, \'sticking\', ' + i + ')" oncontextmenu="event.preventDefault(); noteRightClick(event, \'sticking\', ' + i + ')" onmouseenter="noteOnMouseEnter(event, \'sticking\')">R</div>');
      newHTML.push('         <div class="sticking_left note_part" id="sticking_left' + i + '" onClick="noteLeftClick(event, \'sticking\', ' + i + ')" oncontextmenu="event.preventDefault(); noteRightClick(event, \'sticking\', ' + i + ')">L</div>');
      newHTML.push('         <div class="sticking_both note_part" id="sticking_both' + i + '" onClick="noteLeftClick(event, \'sticking\', ' + i + ')" oncontextmenu="event.preventDefault(); noteRightClick(event, \'sticking\', ' + i + ')">R/L</div>');
      newHTML.push('         <div class="sticking_count note_part" id="sticking_count' + i + '" onClick="noteLeftClick(event, \'sticking\', ' + i + ')" oncontextmenu="event.preventDefault(); noteRightClick(event, \'sticking\', ' + i + ')">C</div>');
      newHTML.push('       </div>');

      // add space between notes, except on the last note
      if ((i - (indexStartForNotes - 1)) % noteGroupingSize(notesPerMeasure, numBeats, noteValuePerMeasure) === 0 && i < notesPerMeasure + indexStartForNotes - 1) {
          newHTML.push(' <div class="space_between_note_groups"> </div>');
      }
  }
  newHTML.push('       <div class="end_note_space"></div>');
  newHTML.push('     </div>');
  newHTML.push('   </div>');
  // newHTML.push('</div>');

  return newHTML.join(''); // Join the array into a single string
}


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
function generateStickingHTML() {
  var genHTML = "";
  const { notesPerMeasure, numBeats, noteValue } = editor.track;
  
  return generateStickingContainerHTML3(1, 0, notesPerMeasure, numBeats, noteValue);
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

    const stickingContent = ref("")
    stickingContent.value = generateStickingHTML();
    return { content, stickingContent }
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