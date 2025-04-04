import { ref } from 'vue'

function generateKickContainerHTML2(indexStartForNotes, baseindex, notesPerMeasure, numBeats, noteValuePerMeasure) {
    let newHTML = []; // Use an array to build the HTML
    newHTML.push('<div class="kick-container">');
    newHTML.push('<div class="opening_note_space"> </div> ');

    for (var j = indexStartForNotes; j < notesPerMeasure + indexStartForNotes; j++) {
        newHTML.push(`
            <div id="kick${j}" class="kick" onClick="noteLeftClick(event, 'kick', ${j})" oncontextmenu="event.preventDefault(); noteRightClick(event, 'kick', ${j})" onmouseenter="noteOnMouseEnter(event, 'kick', ${j})">
                <div class="kick_splash note_part" id="kick_splash${j}"><i class="fa fa-times"></i></div>
                <div class="kick_circle note_part" id="kick_circle${j}"></div>
            </div>
        `);

        if ((j - (indexStartForNotes - 1)) % noteGroupingSize(notesPerMeasure, numBeats, noteValuePerMeasure) === 0 && j < notesPerMeasure + indexStartForNotes - 1) {
            newHTML.push('<div class="space_between_note_groups"> </div> ');
        }
    }
    newHTML.push(`<span class="unmuteKickButton" id="unmutekickButton${baseindex}" onClick='muteInstrument("kick", ${baseindex}, false)'><span class="fa-stack unmuteStack"><i class="fa fa-ban fa-stack-2x" style="color:red"></i><i class="fa fa-volume-down fa-stack-1x"></i></span>`);
    newHTML.push('<div class="end_note_space"></div>\n</div>\n');

    return newHTML.join(''); // Join the array into a single string
}

//
//
function generateeKickHTML() {
  var genHTML = "";
  const { notesPerMeasure, numBeats, noteValue } = editor.track;
  
  return generateKickContainerHTML2(0, 1, notesPerMeasure, numBeats, noteValue);
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
    const kickContent = ref("")
    kickContent.value = generateeKickHTML();
    return { kickContent }
  },

  template: `<div class="kick-container" v-html="kickContent"></div>`
}