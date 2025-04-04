import { ref } from 'vue'

function generateTomContainerHTML2(indexStartForNotes, baseindex, notesPerMeasure, numBeats, noteValuePerMeasure, tomNumber) {
    let newHTML = []; // Use an array to build the HTML
    // newHTML.push('<div class="toms-container" id="tom' + tomNumber + '-container">');
    newHTML.push('<div class="opening_note_space"> </div>');

    for (let i = indexStartForNotes; i < notesPerMeasure + indexStartForNotes; i++) {
        newHTML.push(`
            <div id="tom${tomNumber}-${i}" class="tom" onClick="noteLeftClick(event, 'tom${tomNumber}', ${i})" oncontextmenu="event.preventDefault(); noteRightClick(event, 'tom${tomNumber}', ${i})" onmouseenter="noteOnMouseEnter(event, 'tom${tomNumber}', ${i})">
                <div class="tom_circle note_part" id="tom_circle${tomNumber}-${i}"></div>
            </div>
        `);

        if ((i - (indexStartForNotes - 1)) % noteGroupingSize(notesPerMeasure, numBeats, noteValuePerMeasure) === 0 && i < notesPerMeasure + indexStartForNotes - 1) {
            newHTML.push('<div class="space_between_note_groups"> </div>');
        }
    }

    newHTML.push(`<span class="unmuteTom${tomNumber}Button" id="unmutetom${tomNumber}Button${baseindex}" onClick='muteInstrument("tom${tomNumber}", ${baseindex}, false)'><span class="fa-stack unmuteStack"><i class="fa fa-ban fa-stack-2x" style="color:red"></i><i class="fa fa-volume-down fa-stack-1x"></i></span>`);
    // newHTML.push('<div class="end_note_space"></div></div>');
    newHTML.push('<div class="end_note_space"></div>');

    return newHTML.join(''); // Join the array into a single string
}	

//
//
function generateeTomHTML(index) {
  var genHTML = "";
  const { notesPerMeasure, numBeats, noteValue } = editor.track;
  
  return generateTomContainerHTML2(0, 1, notesPerMeasure, numBeats, noteValue, index);
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

  props: {
    index: {
      type: Number
    }
  },

  setup(props) {
    console.log(props.index)
    
    const tomContent = ref("")
    tomContent.value = generateeTomHTML(props.index);
    return { tomContent }
  },

  template: `<div class="toms-container" id="tom1-container" v-html="tomContent"></div>`
}