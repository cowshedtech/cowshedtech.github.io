import { ref } from 'vue'

function generateStickingContainerHTML2(baseindex, indexStartForNotes, notesPerMeasure, numBeats, noteValuePerMeasure) {
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

//
//
function generateStickingHTML() {
  var genHTML = "";
  const { notesPerMeasure, numBeats, noteValue } = editor.track;
  
  return generateStickingContainerHTML2(1, 0, notesPerMeasure, numBeats, noteValue);
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

  setup() {
    const stickingContent = ref("")
    stickingContent.value = generateStickingHTML();
    return { stickingContent }
  },

  template: `<div class="stickings-row-container" v-html="stickingContent"></div>`
}