import { ref } from 'vue'

function generateHiHatContainerHTML2(indexStartForNotes, baseindex, notesPerMeasure, numBeats, noteValuePerMeasure) {
    let html = [];
    html.push('<div class="opening_note_space"> </div>');

    for (let i = indexStartForNotes; i < notesPerMeasure + indexStartForNotes; i++) {
        html.push(`
            <div id="hi-hat${i}" class="hi-hat" onClick="noteLeftClick(event, 'hh', ${i})" oncontextmenu="event.preventDefault(); noteRightClick(event, 'hh', ${i})" onmouseenter="noteOnMouseEnter(event, 'hh', ${i})">
                <div class="hh_crash note_part" id="hh_crash${i}"><i class="fa fa-asterisk"></i></div>
                <div class="hh_ride note_part" id="hh_ride${i}"><i class="fa fa-dot-circle-o"></i></div>
                <div class="hh_ride_bell note_part" id="hh_ride_bell${i}"><i class="fa fa-bell-o"></i></div>
                <div class="hh_cow_bell note_part" id="hh_cow_bell${i}"><i class="fa fa-plus-square-o"></i></div>
                <div class="hh_stacker note_part" id="hh_stacker${i}"><i class="fa fa-bars"></i></div>
                <div class="hh_metronome_normal note_part" id="hh_metronome_normal${i}"><i class="fa fa-neuter"></i></div>
                <div class="hh_metronome_accent note_part" id="hh_metronome_accent${i}"><i class="fa fa-map-pin"></i></div>
                <div class="hh_cross note_part" id="hh_cross${i}"><i class="fa fa-times"></i></div>
                <div class="hh_open note_part" id="hh_open${i}"><i class="fa fa-circle-o"></i></div>
                <div class="hh_close note_part" id="hh_close${i}"><i class="fa fa-plus"></i></div>
                <div class="hh_accent note_part" id="hh_accent${i}"><i class="fa fa-angle-right"></i></div>
            </div>
        `);

        if ((i - (indexStartForNotes - 1)) % noteGroupingSize(notesPerMeasure, numBeats, noteValuePerMeasure) === 0 && i < notesPerMeasure + indexStartForNotes - 1) {
            html.push('<div class="space_between_note_groups"> </div>');
        }
    }

    html.push(`<div class="unmuteHHButton" id="unmutehhButton${baseindex}" onClick='muteInstrument("hh", ${baseindex}, false)'><span class="fa-stack unmuteHHStack"><i class="fa fa-ban fa-stack-2x" style="color:red"></i><i class="fa fa-volume-down fa-stack-1x"></i></span></div>`);    

    return html.join(''); // Join the array into a single string
}		

//
//
function generateeHiHatHTML() {
  var genHTML = "";
  const { notesPerMeasure, numBeats, noteValue } = editor.track;
  
  return generateHiHatContainerHTML2(0, 1, notesPerMeasure, numBeats, noteValue, 0);
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
    stickingContent.value = generateeHiHatHTML();
    return { stickingContent }
  },

  template: `<div class="hi-hat-container" v-html="stickingContent"></div>`
}