//
//
function generateMeasureButtons(numberOfMeasures, baseindex, repeat) {
    var buttonsHTML = '';

    buttonsHTML += '<div style="display: inline-block;vertical-align: top; margin-top: 15px; margin-left: 15px; margin-right: 15px">'

    if (numberOfMeasures > 1)
        buttonsHTML += '<div title="Remove Measure" id="closeMeasureButton' + baseindex + '" onClick="closeMeasureButtonClick(' + baseindex + ')" class="closeMeasureButton"><i class="fa fa-times-circle"></i></div>';
    else
        buttonsHTML += '<div class="closeMeasureButton"><i class="fa"></i></div>';

    buttonsHTML += '<div title="Repeat Measure" id="repeateMeasureIncButton' + baseindex + '" onClick="repeatMeasureIncButtonClick(' + baseindex + ')" class="closeMeasureButton"><i class="fa">↑</i></div>';
    buttonsHTML += '<span style="color: var(--highlight-color-on-white);">' + repeat + '</span>';
    buttonsHTML += '<div title="Repeat Measure" id="repeateMeasureDecButton' + baseindex + '" onClick="repeatMeasureDecButtonClick(' + baseindex + ')" class="closeMeasureButton"><i class="fa">↓</i></div>';
    buttonsHTML += '<div title="Duplicate Measure" id="duplicateMeasureButton' + baseindex + '" onClick="duplicateMeasureButtonClick(' + baseindex + ')" class="closeMeasureButton"><i class="fa fa-rotate-left"></i></div>';
    buttonsHTML += '<div title="Add Measure" id="addMeasureMiddleButton' + baseindex + '" onClick="addMeasureMiddleButtonClick(' + baseindex + ')" class="closeMeasureButton"><i class="fa fa-plus"></i></div>';
    buttonsHTML += '</div>'

    return buttonsHTML;
}

//
//
//
function generateLineLabels(baseindex) {
    return `
			<div class="line-labels">
				<div class="hh-label" onClick="noteLabelClick(event, 'hh', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'hh', ${baseindex})">Hi-hat</div>
				<div class="tom-label" id="tom1-label" onClick="noteLabelClick(event, 'tom1', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'tom1', ${baseindex})">Tom</div>
				<div class="snare-label" onClick="noteLabelClick(event, 'snare', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'snare', ${baseindex})">Snare</div>
				<div class="tom-label" id="tom4-label" onClick="noteLabelClick(event, 'tom4', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'tom4', ${baseindex})">Tom</div>
				<div class="kick-label" onClick="noteLabelClick(event, 'kick', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'kick', ${baseindex})">Kick</div>
			</div>
		`;
}

function generateLineLabels(baseindex) {
    return `
        <div class="line-labels">
            <div class="hh-label" onClick="noteLabelClick(event, 'hh', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'hh', ${baseindex})">Hi-hat</div>
            <div class="tom-label" id="tom1-label" onClick="noteLabelClick(event, 'tom1', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'tom1', ${baseindex})">Tom</div>
            <div class="snare-label" onClick="noteLabelClick(event, 'snare', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'snare', ${baseindex})">Snare</div>
            <div class="tom-label" id="tom4-label" onClick="noteLabelClick(event, 'tom4', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'tom4', ${baseindex})">Tom</div>
            <div class="kick-label" onClick="noteLabelClick(event, 'kick', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'kick', ${baseindex})">Kick</div>
        </div>
    `;
}


//
//
function shiftRepeatedMeasuresAfterIndex(measureIndex, direction) {
    // Convert Map to array of entries and sort by measure index
    const sortedEntries = [...editor.track.repeatedMeasures.entries()].sort((a, b) => a[0] - b[0]);
    
    // Process in reverse order to avoid overwriting
    for (let i = sortedEntries.length - 1; i >= 0; i--) {
        const [key, value] = sortedEntries[i];
        if (key > measureIndex) {
            editor.track.repeatedMeasures.set(key + direction, value);
            editor.track.repeatedMeasures.delete(key);
        }
    }
}

//
// remove a measure from the page NB measureNum is indexed starting at 1, not 0
closeMeasureButtonClick = function (measureNum) {
    const noteData = {
        stickings: "",
        hh: "",
        tom1: "",
        tom4: "",
        snare: "",
        kick: ""
    };

    const measureStart = (measureNum - 1) * editor.class_notes_per_measure;
    const measureEnd = measureNum * editor.class_notes_per_measure;
    const totalNotes = editor.class_notes_per_measure * editor.track.numberOfMeasures;

    for (let i = 0; i < totalNotes; i++) {
        if (i < measureStart || i >= measureEnd) {
            noteData.stickings += get_sticking_state(i, "URL");
            noteData.hh += get_hh_state(i, "URL");
            noteData.tom1 += get_tom_state(i, 1, "URL");
            noteData.tom4 += get_tom_state(i, 4, "URL");
            noteData.snare += get_snare_state(i, "URL");
            noteData.kick += get_kick_state(i, "URL");
        }
    }

    editor.track.repeatedMeasures.delete(measureNum - 1);
    shiftRepeatedMeasuresAfterIndex(measureNum - 1, -1);
    editor.track.numberOfMeasures--;

    editor.expandAuthoringViewWhenNecessary(editor.class_notes_per_measure, editor.track.numberOfMeasures);
    editor.changeDivisionWithNotes(
        editor.class_time_division,
        noteData.stickings,
        noteData.hh,
        noteData.tom1,
        noteData.tom4,
        noteData.snare,
        noteData.kick
    );

    editor.updateSheetMusic();
};


//
//
function repeatMeasureIncButtonClick(measureNum) {
    // Increment repeat count for the measure
    const count = editor.track.repeatedMeasures.get(measureNum - 1) || 1;
    editor.track.repeatedMeasures.set(measureNum - 1, count + 1);

    // Collect all notes from the UI
    const notes = {
        stickings: '',
        hh: '',
        tom1: '',
        tom4: '',
        snare: '',
        kick: ''
    };
    
    const totalNotes = editor.class_notes_per_measure * editor.track.numberOfMeasures;
    for (let i = 0; i < totalNotes; i++) {
        notes.stickings += get_sticking_state(i, "URL");
        notes.hh += get_hh_state(i, "URL");
        notes.tom1 += get_tom_state(i, 1, "URL");
        notes.tom4 += get_tom_state(i, 4, "URL");
        notes.snare += get_snare_state(i, "URL");
        notes.kick += get_kick_state(i, "URL");
    }

    // Update UI and sheet music
    editor.expandAuthoringViewWhenNecessary(editor.class_notes_per_measure, editor.track.numberOfMeasures);
    editor.changeDivisionWithNotes(editor.class_time_division, notes.stickings, notes.hh, notes.tom1, notes.tom4, notes.snare, notes.kick);
    
    // Scroll to add measure button if it exists
    const addMeasureButton = document.getElementById("addMeasureButton");
    addMeasureButton?.scrollIntoView({ block: "start", behavior: "smooth" });

    editor.updateSheetMusic();
};


//
//
function repeatMeasureDecButtonClick(measureNum) {
    const count = editor.track.repeatedMeasures.get(measureNum - 1) || 1;
    editor.track.repeatedMeasures.set(measureNum - 1, count - 1);

    let uiStickings = "", uiHH = "", uiTom1 = "", uiTom4 = "", uiSnare = "", uiKick = "";
    const topIndex = editor.class_notes_per_measure * editor.track.numberOfMeasures;

    for (let i = 0; i < topIndex; i++) {
        uiStickings += get_sticking_state(i, "URL");
        uiHH += get_hh_state(i, "URL");
        uiTom1 += get_tom_state(i, 1, "URL");
        uiTom4 += get_tom_state(i, 4, "URL");
        uiSnare += get_snare_state(i, "URL");
        uiKick += get_kick_state(i, "URL");
    }

    editor.expandAuthoringViewWhenNecessary(editor.class_notes_per_measure, editor.track.numberOfMeasures);
    editor.changeDivisionWithNotes(editor.class_time_division, uiStickings, uiHH, uiTom1, uiTom4, uiSnare, uiKick);

    const addMeasureButton = document.getElementById("addMeasureButton");
    addMeasureButton?.scrollIntoView({ block: "start", behavior: "smooth" });

    editor.updateSheetMusic();
};

// add a measure to the page
// currently always at the end of the measures
// copy the notes from the last measure to the new measure
function duplicateMeasureButtonClick(measureNum) {
    // Helper function to collect notes for a given range
    function collectNotes(start, end, target) {
        for (let i = start; i < end; i++) {
            target.stickings += get_sticking_state(i, "URL");
            target.hh += get_hh_state(i, "URL");
            target.tom1 += get_tom_state(i, 1, "URL");
            target.tom4 += get_tom_state(i, 4, "URL");
            target.snare += get_snare_state(i, "URL");
            target.kick += get_kick_state(i, "URL");
        }
    }

    const notes = {
        stickings: "",
        hh: "",
        tom1: "",
        tom4: "",
        snare: "",
        kick: ""
    };

    // Collect notes before the measure to be duplicated
    collectNotes(0, (measureNum - 1) * editor.class_notes_per_measure, notes);

    // Collect notes for the measure to be duplicated (twice)
    const measureStart = (measureNum - 1) * editor.class_notes_per_measure;
    const measureEnd = measureStart + editor.class_notes_per_measure;
    collectNotes(measureStart, measureEnd, notes);
    collectNotes(measureStart, measureEnd, notes);

    // Collect notes after the measure to be duplicated
    collectNotes(measureNum * editor.class_notes_per_measure, editor.class_notes_per_measure * editor.track.numberOfMeasures, notes);

    // Update measure count and repeated measures
    editor.track.numberOfMeasures++;
    shiftRepeatedMeasuresAfterIndex(measureNum - 1, 1);
    editor.track.repeatedMeasures.set(measureNum, editor.track.repeatedMeasures.get(measureNum - 1) || 1);

    // Update UI and sheet music
    editor.expandAuthoringViewWhenNecessary(editor.class_notes_per_measure, editor.track.numberOfMeasures);
    editor.changeDivisionWithNotes(editor.class_time_division, notes.stickings, notes.hh, notes.tom1, notes.tom4, notes.snare, notes.kick);

    // Scroll to add measure button if it exists
    const addMeasureButton = document.getElementById("addMeasureButton");
    addMeasureButton?.scrollIntoView({ block: "start", behavior: "smooth" });

    editor.updateSheetMusic();
};



// add a measure to the page
// currently always at the end of the measures
// copy the notes from the last measure to the new measure
function addMeasureButtonClick(event) {
    const notes = {
        stickings: [],
        hh: [],
        tom1: [],
        tom4: [],
        snare: [],
        kick: []
    };

    // Get encoded notes from UI
    const topIndex = editor.class_notes_per_measure * editor.track.numberOfMeasures;
    for (let i = 0; i < topIndex; i++) {
        notes.stickings.push(get_sticking_state(i, "URL"));
        notes.hh.push(get_hh_state(i, "URL"));
        notes.tom1.push(get_tom_state(i, 1, "URL"));
        notes.tom4.push(get_tom_state(i, 4, "URL"));
        notes.snare.push(get_snare_state(i, "URL"));
        notes.kick.push(get_kick_state(i, "URL"));
    }

    // Add empty measure
    const emptyMeasure = Array(editor.class_notes_per_measure).fill('-');
    notes.stickings.push(...emptyMeasure);
    notes.hh.push(...emptyMeasure);
    notes.tom1.push(...emptyMeasure);
    notes.tom4.push(...emptyMeasure);
    notes.snare.push(...emptyMeasure);
    notes.kick.push(...emptyMeasure);

    editor.track.numberOfMeasures++;
    editor.expandAuthoringViewWhenNecessary(editor.class_notes_per_measure, editor.track.numberOfMeasures);

    // Convert arrays to strings
    const noteStrings = {
        stickings: notes.stickings.join(''),
        hh: notes.hh.join(''),
        tom1: notes.tom1.join(''),
        tom4: notes.tom4.join(''),
        snare: notes.snare.join(''),
        kick: notes.kick.join('')
    };

    editor.changeDivisionWithNotes(editor.class_time_division, 
        noteStrings.stickings, 
        noteStrings.hh, 
        noteStrings.tom1, 
        noteStrings.tom4, 
        noteStrings.snare, 
        noteStrings.kick
    );

    // Scroll to add measure button
    const addMeasureButton = document.getElementById("addMeasureButton");
    addMeasureButton?.scrollIntoView({ block: "start", behavior: "smooth" });

    editor.updateSheetMusic();
};


//
//
function addMeasureMiddleButtonClick (measureNum) {
    var uiStickings = "";
    var uiHH = "";
    var uiTom1 = "";
    var uiTom4 = "";
    var uiSnare = "";
    var uiKick = "";
    var i;

    // get the encoded notes out of the UI from before measure we are going to repeat
    var loop1End = (measureNum) * editor.class_notes_per_measure
    for (i = 0; i < loop1End; i++) {
        uiStickings += get_sticking_state(i, "URL");
        uiHH += get_hh_state(i, "URL");
        uiTom1 += get_tom_state(i, 1, "URL");
        uiTom4 += get_tom_state(i, 4, "URL");
        uiSnare += get_snare_state(i, "URL");
        uiKick += get_kick_state(i, "URL");
    }

    // introduce our empty measure
    for (i = 0; i < editor.class_notes_per_measure; i++) {
        uiStickings += "-";
        uiHH += "-";
        uiTom1 += "-";
        uiTom4 += "-";
        uiSnare += "-";
        uiKick += "-";
    }

    // get the encoded notes out of the UI for measures after measure to be repeated
    var loop3Start = measureNum * editor.class_notes_per_measure
    var loop3End = editor.class_notes_per_measure * editor.track.numberOfMeasures;
    for (i = loop3Start; i < loop3End; i++) {
        uiStickings += get_sticking_state(i, "URL");
        uiHH += get_hh_state(i, "URL");
        uiTom1 += get_tom_state(i, 1, "URL");
        uiTom4 += get_tom_state(i, 4, "URL");
        uiSnare += get_snare_state(i, "URL");
        uiKick += get_kick_state(i, "URL");
    }

    editor.track.numberOfMeasures++;

    // We need to move all the repeate measures after this measure up 1 
    shiftRepeatedMeasuresAfterIndex(measureNum - 1, 1);

    editor.expandAuthoringViewWhenNecessary(editor.class_notes_per_measure, editor.track.numberOfMeasures);

    editor.changeDivisionWithNotes(editor.class_time_division, uiStickings, uiHH, uiTom1, uiTom4, uiSnare, uiKick);

    // reference the button and scroll it into view
    var add_measure_button = document.getElementById("addMeasureButton");
    if (add_measure_button)
        add_measure_button.scrollIntoView({ block: "start", behavior: "smooth" });

    editor.updateSheetMusic();
};




// add an empty measure to the front of the score
// copy the notes from the first measure to the new measure
function addMeasurePrevButtonClick (event) {
    var uiStickings = "";
    var uiHH = "";
    var uiTom1 = "";
    var uiTom4 = "";
    var uiSnare = "";
    var uiKick = "";
    var i;

    // Introduce an empty measure at the start
    for (i = 0; i < editor.class_notes_per_measure; i++) {
        uiStickings += "-";
        uiHH += "-";
        uiTom1 += "-";
        uiTom4 += "-";
        uiSnare += "-";
        uiKick += "-";
    }

    // get the encoded notes out of the UI.
    var topIndex = editor.class_notes_per_measure * editor.track.numberOfMeasures;
    for (i = 0; i < topIndex; i++) {

        uiStickings += get_sticking_state(i, "URL");
        uiHH += get_hh_state(i, "URL");
        uiTom1 += get_tom_state(i, 1, "URL");
        uiTom4 += get_tom_state(i, 4, "URL");
        uiSnare += get_snare_state(i, "URL");
        uiKick += get_kick_state(i, "URL");
    }

    editor.track.numberOfMeasures++;

    // We need to move all the repeate measures after this measure up 1 
    shiftRepeatedMeasuresAfterIndex(-1, 1);

    editor.expandAuthoringViewWhenNecessary(editor.class_notes_per_measure, editor.track.numberOfMeasures);

    editor.changeDivisionWithNotes(editor.class_time_division, uiStickings, uiHH, uiTom1, uiTom4, uiSnare, uiKick);

    editor.updateSheetMusic();

    // if(numberOfMeasures === 5)
    // 	window.alert("Please be aware that the Groove Scribe is not designed to write an entire musical score.\n" +
    // 				"You can create as many measures as you want, but your browser may slow down as more measures are added.\n" +
    // 				"There are also many notation features that would be useful for score writing that are not part of Groove Scribe");
};


// clear all the notes on all measures
function clearAllNotes() {
    editor.track.repeatedMeasures.clear();
    for (var i = 0; i < editor.track.numberOfMeasures * editor.class_notes_per_measure; i++) {
        set_sticking_state(i, 'off', editor.class_notes_per_measure, editor.class_time_division, editor.class_note_value_per_measure);
        set_hh_state(i, 'off');
        set_tom1_state(i, 'off');
        set_tom4_state(i, 'off');
        set_snare_state(i, 'off');
        set_kick_state(i, 'off');
    }
    editor.track.numberOfMeasures = 1;

    editor.updateSheetMusic();

    var uiStickings = "";
    var uiHH = "";
    var uiTom1 = "";
    var uiTom4 = "";
    var uiSnare = "";
    var uiKick = "";
    var i;

    editor.changeDivisionWithNotes(editor.class_time_division, uiStickings, uiHH, uiTom1, uiTom4, uiSnare, uiKick);
}


// public function
// function to create HTML for the music staff and notes.   We usually want more than one of these
// baseIndex is the index for the css labels "staff-container1, staff-container2"
// indexStartForNotes is the index for the note ids.
function htmlForStaffContainer(baseindex, indexStartForNotes) {
    var newHTML = ('');

    if (baseindex == 1) // add new measure button
        newHTML += '<span id="addMeasureButtonStart" title="Add measure" onClick="addMeasurePrevButtonClick(event)"><i class="fa fa-plus"></i></span>';
        
    newHTML += ('<div class="staff-container" id="staff-container' + baseindex + '">')
    newHTML += generateStickingContainerHTML(baseindex, indexStartForNotes, editor.class_notes_per_measure, editor.class_num_beats_per_measure, editor.class_note_value_per_measure);

    newHTML += ('  <span class="notes-row-container">')
    newHTML += generateLineLabels(baseindex); // Call the new function where the line labels are needed

    newHTML += ('\				\
                            <div class="music-line-container">\
                                \
                                <div class="notes-container">\
                                <div class="staff-line-1"></div>\
                                <div class="staff-line-2"></div>\
                                <div class="staff-line-3"></div>\
                                <div class="staff-line-4"></div>\
                                <div class="staff-line-5"></div>\n');

    // backgrounds for highlighting.  Evenly spaced cols of space
    newHTML += ('\
                                    <div class="background-highlight-container">\
                                        <div class="opening_note_space"> </div>');
    for (let i = indexStartForNotes; i < editor.class_notes_per_measure + indexStartForNotes; i++) {
        newHTML += ('						<div id="bg-highlight' + i + '" class="bg-highlight" >\
                                            </div>\n');

        if ((i - (indexStartForNotes - 1)) % noteGroupingSize(editor.class_notes_per_measure, editor.class_num_beats_per_measure, editor.class_note_value_per_measure) === 0 && i < editor.class_notes_per_measure + indexStartForNotes - 1) {
            newHTML += ('<div class="space_between_note_groups"> </div> \n');
        }
    }
    newHTML += ('<div class="end_note_space"></div>\n</div>\n');

    newHTML += generateHiHatContainerHTML(indexStartForNotes, baseindex, editor.class_notes_per_measure, editor.class_num_beats_per_measure, editor.class_note_value_per_measure, indexStartForNotes);
    newHTML += generateTomContainerHTML(indexStartForNotes, baseindex, editor.class_notes_per_measure, editor.class_num_beats_per_measure, editor.class_note_value_per_measure, indexStartForNotes, 1);
    newHTML += generateSnareContainerHTML(indexStartForNotes, baseindex, editor.class_notes_per_measure, editor.class_num_beats_per_measure, editor.class_note_value_per_measure, indexStartForNotes);
    newHTML += generateTomContainerHTML(indexStartForNotes, baseindex, editor.class_notes_per_measure, editor.class_num_beats_per_measure, editor.class_note_value_per_measure, indexStartForNotes, 4);
    newHTML += generateKickContainerHTML(indexStartForNotes, baseindex, editor.class_notes_per_measure, editor.class_num_beats_per_measure, editor.class_note_value_per_measure, indexStartForNotes);
    newHTML += ('\
                            </div>\
                        </div>\
                    </span>\n');

    let repeat = editor.track.repeatedMeasures.get(baseindex - 1) || 1

    newHTML += generateMeasureButtons(editor.track.numberOfMeasures, baseindex, repeat);

    return newHTML;
}; // end function HTMLforStaffContainer