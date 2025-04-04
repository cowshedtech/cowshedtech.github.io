import { ref } from 'vue'

function generateSnareContainerHTML2(indexStartForNotes, baseindex, notesPerMeasure, numBeats, noteValuePerMeasure ) {
  let newHTML = ('\
      <div class="opening_note_space"> </div> ');
  for (let i = indexStartForNotes; i < notesPerMeasure + indexStartForNotes; i++) {
    const snareId = `snare${i}`;
    const snareGhostId = `snare_ghost${i}`;
    const snareCircleId = `snare_circle${i}`;
    const snareXstickId = `snare_xstick${i}`;
    const snareBuzzId = `snare_buzz${i}`;
    const snareFlamId = `snare_flam${i}`;
    const snareDragId = `snare_drag${i}`;
    const snareAccentId = `snare_accent${i}`;

    newHTML += `
      <div id="${snareId}" class="snare" onClick="noteLeftClick(event, 'snare', ${i})" oncontextmenu="event.preventDefault(); noteRightClick(event, 'snare', ${i})" onmouseenter="noteOnMouseEnter(event, 'snare', ${i})">
        <div class="snare_ghost note_part" id="${snareGhostId}">(<i class="fa fa-circle dot_in_snare_ghost_note"></i>)</div>
        <div class="snare_circle note_part" id="${snareCircleId}"></div>
        <div class="snare_xstick note_part" id="${snareXstickId}"><i class="fa fa-times"></i></div>
        <div class="snare_buzz note_part" id="${snareBuzzId}"><i class="fa fa-bars"></i></div>
        <div class="snare_flam note_part" id="${snareFlamId}">${generateFlamSVG()}</div>
        <div class="snare_drag note_part" id="${snareDragId}">${generateDragSVG()}</div>
        <div class="snare_accent note_part" id="${snareAccentId}">
          <i class="fa fa-chevron-right"></i>
        </div>
      </div>
    `;

    if ((i - (indexStartForNotes - 1)) % noteGroupingSize(notesPerMeasure, numBeats, noteValuePerMeasure) === 0 && i < notesPerMeasure + indexStartForNotes - 1) {
      newHTML += '<div class="space_between_note_groups"> </div>';
    }
  }

  function generateFlamSVG() {
    return `
      <i class="fa ">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" width="30" height="30">
          <style type="text/css">
            .flam_fill {fill: currentColor}
            .flam_stroke {stroke: currentColor; fill: none; stroke-width: .7}
          </style>
          <defs>
            <path id="flam_ghd" class="flam_fill" d="m1.7-1c-1-1.7-4.5 0.2-3.4 2 1 1.7 4.5-0.2 3.4-2"></path>
            <ellipse id="flam_hd" rx="4.1" ry="2.9" transform="rotate(-20)" class="flam_fill"></ellipse>
          </defs>
          <g id="note" transform="translate(-44 -35)">
            <path class="flam_stroke" d="m52.1 53.34v-14M52.1 39.34c0.6 3.4 5.6 3.8 3 10 1.2-4.4-1.4-7-3-7"></path>
            <use x="50.50" y="53.34" xlink:href="#flam_ghd"></use>
            <path class="flam_stroke" d="m49.5 49.34l9-5"></path>
            <path class="flam_stroke" d="m50.5 58.34c2.9 3 11.6 3 14.5 0M69.5 53.34v-21"></path>
            <use x="66.00" y="53.34" xlink:href="#flam_hd"></use>
          </g>
        </svg>
      </i>
    `;
  }

  function generateDragSVG() {
    return `
      <i class="fa ">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" width="30" height="30">
          <style type="text/css">
            .drag_fill {fill: currentColor}
            .drag_stroke {stroke: currentColor; fill: none; stroke-width: .7}
          </style>
          <defs>
            <path id="drag_ghd" class="drag_fill" d="m1.7-1c-1-1.7-4.5 0.2-3.4 2 1 1.7 4.5-0.2 3.4-2"></path>
            <ellipse id="drag_hd" rx="4.1" ry="2.9" transform="rotate(-20)" class="drag_fill"></ellipse>
          </defs>
          <g id="note" transform="translate(-44 -35)">
            <path class="fill" d="m51.81 38.34 l8.58 0.00v1.60l-8.58 0.00"></path>
            <path class="fill" d="m52.10 41.34 l8.00 0.00v1.60l-8.00 0.00"></path>
            <path class="drag_stroke" d="m52.1 53.34v-15.00"></path>
            <use x="50.50" y="53.34" xlink:href="#drag_ghd"></use>
            <path class="drag_stroke" d="m49.50 49.34l8.00 -15.00"></path>
            <path class="drag_stroke" d="m60.10 53.34v-15.00"></path>
            <use x="58.50" y="53.34" xlink:href="#drag_hd"></use>
            <path class="drag_stroke" d="m50.5 58.34c2.9 3 11.6 3 14.5 0M69.5 53.34v-21"></path>
            <use x="66.00" y="53.34" xlink:href="#drag_hd"></use>
          </g>
        </svg>
      </i>
    `;
  }

  newHTML += '<span class="unmuteSnareButton" id="unmutesnareButton' + baseindex + '" onClick=\'muteInstrument("snare", ' + baseindex + ', false)\'><span class="fa-stack unmuteStack"><i class="fa fa-ban fa-stack-2x" style="color:red"></i><i class="fa fa-volume-down fa-stack-1x"></i></span>';
  newHTML += ('<div class="end_note_space"></div>\n');

  return newHTML; // Return the generated HTML
}	

//
//
function generateeSnareHTML() {
  const { notesPerMeasure, numBeats, noteValue } = editor.track;  
  return generateSnareContainerHTML2(0, 1, notesPerMeasure, numBeats, noteValue);
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
    const snareContent = ref("")
    snareContent.value = generateeSnareHTML();
    return { snareContent }
  },

  template: `<div class="snare-container" v-html="snareContent"></div>`
}