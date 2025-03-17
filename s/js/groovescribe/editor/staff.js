// Javascript for the Groove Scribe HTML application
// Groove Scribe is for drummers and helps create sheet music with an easy to use WYSIWYG groove editor.
//
// Functions for handling a staff in the clickable editor


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
function htmlForStaffContainer(baseindex, indexStartForNotes) {
    var newHTML = ('');

    if (baseindex == 1) // add new measure button
        newHTML += '<span id="addMeasureButtonStart" title="Add measure" onClick="addMeasurePrevButtonClick(event)"><i class="fa fa-plus"></i></span>';
        
    newHTML += ('<div class="staff-container" id="staff-container' + baseindex + '">')
    newHTML += generateStickingContainerHTML(baseindex, indexStartForNotes, editor.track.notesPerMeasure, editor.track.numBeats, editor.track.noteValue);

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
    for (let i = indexStartForNotes; i < editor.track.notesPerMeasure + indexStartForNotes; i++) {
        newHTML += ('						<div id="bg-highlight' + i + '" class="bg-highlight" >\
                                            </div>\n');

        if ((i - (indexStartForNotes - 1)) % noteGroupingSize(editor.track.notesPerMeasure, editor.track.numBeats, editor.track.noteValue) === 0 && i < editor.track.notesPerMeasure + indexStartForNotes - 1) {
            newHTML += ('<div class="space_between_note_groups"> </div> \n');
        }
    }
    newHTML += ('<div class="end_note_space"></div>\n</div>\n');

    newHTML += generateHiHatContainerHTML(indexStartForNotes, baseindex, editor.track.notesPerMeasure, editor.track.numBeats, editor.track.noteValue, indexStartForNotes);
    newHTML += generateTomContainerHTML(indexStartForNotes, baseindex, editor.track.notesPerMeasure, editor.track.numBeats, editor.track.noteValue, indexStartForNotes, 1);
    newHTML += generateSnareContainerHTML(indexStartForNotes, baseindex, editor.track.notesPerMeasure, editor.track.numBeats, editor.track.noteValue, indexStartForNotes);
    newHTML += generateTomContainerHTML(indexStartForNotes, baseindex, editor.track.notesPerMeasure, editor.track.numBeats, editor.track.noteValue, indexStartForNotes, 4);
    newHTML += generateKickContainerHTML(indexStartForNotes, baseindex, editor.track.notesPerMeasure, editor.track.numBeats, editor.track.noteValue, indexStartForNotes);
    newHTML += ('\
                            </div>\
                        </div>\
                    </span>\n');

    let repeat = editor.track.repeatedMeasures.get(baseindex - 1) || 1

    newHTML += generateMeasureButtons(editor.track.numberOfMeasures, baseindex, repeat);

    return newHTML;
}; // end function HTMLforStaffContainer


/**
 * Generates HTML for measure control buttons including remove, repeat, duplicate, and add buttons.
 * 
 * @param {number} numberOfMeasures - Total number of measures in the score
 * @param {number} baseindex - Index of the current measure (1-based)
 * @param {number} repeat - Number of times this measure should be repeated
 * @returns {string} HTML string containing the measure control buttons
 * @requires Functions:
 * - closeMeasureButtonClick - Handler for removing a measure
 * - repeatMeasureIncButtonClick - Handler for incrementing measure repeats
 * - repeatMeasureDecButtonClick - Handler for decrementing measure repeats
 * - duplicateMeasureButtonClick - Handler for duplicating a measure
 * - addMeasureMiddleButtonClick - Handler for adding a measure
 */
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

/**
 * Generates HTML for drum kit line labels (hi-hat, toms, snare, kick).
 * Each label is clickable and includes both left and right click handlers.
 * 
 * @param {number} baseindex - Index of the current measure (1-based)
 * @returns {string} HTML string containing the line labels
 * @requires Functions:
 * - noteLabelClick - Click handler for note labels
 */
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


/**
 * Removes a measure from the score and updates all necessary UI elements.
 * Collects notes from all measures except the one being removed and rebuilds the score.
 * 
 * @param {number} measureNum - Index of the measure to remove (1-based)
 * @requires Functions:
 * - get_sticking_state - Gets sticking notation for a note
 * - get_hh_state - Gets hi-hat state for a note
 * - get_tom_state - Gets tom state for a note
 * - get_snare_state - Gets snare state for a note
 * - get_kick_state - Gets kick state for a note
 * - shiftRepeatedMeasuresAfterIndex - Updates repeat counts after removal
 * @requires editor.track - Track object containing score state
 */
function closeMeasureButtonClick(measureNum) {
    const noteData = {
        stickings: "",
        hh: "",
        tom1: "",
        tom4: "",
        snare: "",
        kick: ""
    };

    const measureStart = (measureNum - 1) * editor.track.notesPerMeasure;
    const measureEnd = measureNum * editor.track.notesPerMeasure;
    const totalNotes = editor.track.notesPerMeasure * editor.track.numberOfMeasures;

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

    editor.expandAuthoringViewWhenNecessary(editor.track.notesPerMeasure, editor.track.numberOfMeasures);
    editor.changeDivisionWithNotes(
        editor.track.timeDivision,
        noteData.stickings,
        noteData.hh,
        noteData.tom1,
        noteData.tom4,
        noteData.snare,
        noteData.kick
    );

    editor.updateSheetMusic();
};


/**
 * Increments the repeat count for a measure and updates the score.
 * Collects all current notes and rebuilds the score with the new repeat count.
 * 
 * @param {number} measureNum - Index of the measure to increment repeats for (1-based)
 * @requires Functions:
 * - get_sticking_state - Gets sticking notation for a note
 * - get_hh_state - Gets hi-hat state for a note
 * - get_tom_state - Gets tom state for a note
 * - get_snare_state - Gets snare state for a note
 * - get_kick_state - Gets kick state for a note
 * @requires editor.track - Track object containing score state
 */
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
    
    const totalNotes = editor.track.notesPerMeasure * editor.track.numberOfMeasures;
    for (let i = 0; i < totalNotes; i++) {
        notes.stickings += get_sticking_state(i, "URL");
        notes.hh += get_hh_state(i, "URL");
        notes.tom1 += get_tom_state(i, 1, "URL");
        notes.tom4 += get_tom_state(i, 4, "URL");
        notes.snare += get_snare_state(i, "URL");
        notes.kick += get_kick_state(i, "URL");
    }

    // Update UI and sheet music
    editor.expandAuthoringViewWhenNecessary(editor.track.notesPerMeasure, editor.track.numberOfMeasures);
    editor.changeDivisionWithNotes(editor.track.timeDivision, notes.stickings, notes.hh, notes.tom1, notes.tom4, notes.snare, notes.kick);
    
    // Scroll to add measure button if it exists
    const addMeasureButton = document.getElementById("addMeasureButton");
    addMeasureButton?.scrollIntoView({ block: "start", behavior: "smooth" });

    editor.updateSheetMusic();
};


/**
 * Decrements the repeat count for a measure and updates the score.
 * Collects all current notes and rebuilds the score with the new repeat count.
 * 
 * @param {number} measureNum - Index of the measure to decrement repeats for (1-based)
 * @requires Functions:
 * - get_sticking_state - Gets sticking notation for a note
 * - get_hh_state - Gets hi-hat state for a note
 * - get_tom_state - Gets tom state for a note
 * - get_snare_state - Gets snare state for a note
 * - get_kick_state - Gets kick state for a note
 * @requires editor.track - Track object containing score state
 */
function repeatMeasureDecButtonClick(measureNum) {
    const count = editor.track.repeatedMeasures.get(measureNum - 1) || 1;
    editor.track.repeatedMeasures.set(measureNum - 1, count - 1);

    let uiStickings = "", uiHH = "", uiTom1 = "", uiTom4 = "", uiSnare = "", uiKick = "";
    const topIndex = editor.track.notesPerMeasure * editor.track.numberOfMeasures;

    for (let i = 0; i < topIndex; i++) {
        uiStickings += get_sticking_state(i, "URL");
        uiHH += get_hh_state(i, "URL");
        uiTom1 += get_tom_state(i, 1, "URL");
        uiTom4 += get_tom_state(i, 4, "URL");
        uiSnare += get_snare_state(i, "URL");
        uiKick += get_kick_state(i, "URL");
    }

    editor.expandAuthoringViewWhenNecessary(editor.track.notesPerMeasure, editor.track.numberOfMeasures);
    editor.changeDivisionWithNotes(editor.track.timeDivision, uiStickings, uiHH, uiTom1, uiTom4, uiSnare, uiKick);

    const addMeasureButton = document.getElementById("addMeasureButton");
    addMeasureButton?.scrollIntoView({ block: "start", behavior: "smooth" });

    editor.updateSheetMusic();
};

/**
 * Duplicates a measure, copying all its notes to create a new measure.
 * The new measure is inserted after the source measure.
 * 
 * @param {number} measureNum - Index of the measure to duplicate (1-based)
 * @requires Functions:
 * - get_sticking_state - Gets sticking notation for a note
 * - get_hh_state - Gets hi-hat state for a note
 * - get_tom_state - Gets tom state for a note
 * - get_snare_state - Gets snare state for a note
 * - get_kick_state - Gets kick state for a note
 * - shiftRepeatedMeasuresAfterIndex - Updates repeat counts after insertion
 * @requires editor.track - Track object containing score state
 */
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
    collectNotes(0, (measureNum - 1) * editor.track.notesPerMeasure, notes);

    // Collect notes for the measure to be duplicated (twice)
    const measureStart = (measureNum - 1) * editor.track.notesPerMeasure;
    const measureEnd = measureStart + editor.track.notesPerMeasure;
    collectNotes(measureStart, measureEnd, notes);
    collectNotes(measureStart, measureEnd, notes);

    // Collect notes after the measure to be duplicated
    collectNotes(measureNum * editor.track.notesPerMeasure, editor.track.notesPerMeasure * editor.track.numberOfMeasures, notes);

    // Update measure count and repeated measures
    editor.track.numberOfMeasures++;
    shiftRepeatedMeasuresAfterIndex(measureNum - 1, 1);
    editor.track.repeatedMeasures.set(measureNum, editor.track.repeatedMeasures.get(measureNum - 1) || 1);

    // Update UI and sheet music
    editor.expandAuthoringViewWhenNecessary(editor.track.notesPerMeasure, editor.track.numberOfMeasures);
    editor.changeDivisionWithNotes(editor.track.timeDivision, notes.stickings, notes.hh, notes.tom1, notes.tom4, notes.snare, notes.kick);

    // Scroll to add measure button if it exists
    const addMeasureButton = document.getElementById("addMeasureButton");
    addMeasureButton?.scrollIntoView({ block: "start", behavior: "smooth" });

    editor.updateSheetMusic();
};



/**
 * Adds a new empty measure at the end of the score.
 * Collects all current notes and appends an empty measure.
 * 
 * @param {Event} event - The click event object
 * @requires Functions:
 * - get_sticking_state - Gets sticking notation for a note
 * - get_hh_state - Gets hi-hat state for a note
 * - get_tom_state - Gets tom state for a note
 * - get_snare_state - Gets snare state for a note
 * - get_kick_state - Gets kick state for a note
 * @requires editor.track - Track object containing score state
 */
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
    const topIndex = editor.track.notesPerMeasure * editor.track.numberOfMeasures;
    for (let i = 0; i < topIndex; i++) {
        notes.stickings.push(get_sticking_state(i, "URL"));
        notes.hh.push(get_hh_state(i, "URL"));
        notes.tom1.push(get_tom_state(i, 1, "URL"));
        notes.tom4.push(get_tom_state(i, 4, "URL"));
        notes.snare.push(get_snare_state(i, "URL"));
        notes.kick.push(get_kick_state(i, "URL"));
    }

    // Add empty measure
    const emptyMeasure = Array(editor.track.notesPerMeasure).fill('-');
    notes.stickings.push(...emptyMeasure);
    notes.hh.push(...emptyMeasure);
    notes.tom1.push(...emptyMeasure);
    notes.tom4.push(...emptyMeasure);
    notes.snare.push(...emptyMeasure);
    notes.kick.push(...emptyMeasure);

    editor.track.numberOfMeasures++;
    editor.expandAuthoringViewWhenNecessary(editor.track.notesPerMeasure, editor.track.numberOfMeasures);

    // Convert arrays to strings
    const noteStrings = {
        stickings: notes.stickings.join(''),
        hh: notes.hh.join(''),
        tom1: notes.tom1.join(''),
        tom4: notes.tom4.join(''),
        snare: notes.snare.join(''),
        kick: notes.kick.join('')
    };

    editor.changeDivisionWithNotes(editor.track.timeDivision, 
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


/**
 * Adds a new empty measure after the specified measure.
 * Collects notes before and after the insertion point and adds an empty measure.
 * 
 * @param {number} measureNum - Index of the measure after which to add (1-based)
 * @requires Functions:
 * - get_sticking_state - Gets sticking notation for a note
 * - get_hh_state - Gets hi-hat state for a note
 * - get_tom_state - Gets tom state for a note
 * - get_snare_state - Gets snare state for a note
 * - get_kick_state - Gets kick state for a note
 * - shiftRepeatedMeasuresAfterIndex - Updates repeat counts after insertion
 * @requires editor.track - Track object containing score state
 */
function addMeasureMiddleButtonClick(measureNum) {
    var uiStickings = "";
    var uiHH = "";
    var uiTom1 = "";
    var uiTom4 = "";
    var uiSnare = "";
    var uiKick = "";
    var i;

    // get the encoded notes out of the UI from before measure we are going to repeat
    var loop1End = (measureNum) * editor.track.notesPerMeasure
    for (i = 0; i < loop1End; i++) {
        uiStickings += get_sticking_state(i, "URL");
        uiHH += get_hh_state(i, "URL");
        uiTom1 += get_tom_state(i, 1, "URL");
        uiTom4 += get_tom_state(i, 4, "URL");
        uiSnare += get_snare_state(i, "URL");
        uiKick += get_kick_state(i, "URL");
    }

    // introduce our empty measure
    for (i = 0; i < editor.track.notesPerMeasure; i++) {
        uiStickings += "-";
        uiHH += "-";
        uiTom1 += "-";
        uiTom4 += "-";
        uiSnare += "-";
        uiKick += "-";
    }

    // get the encoded notes out of the UI for measures after measure to be repeated
    var loop3Start = measureNum * editor.track.notesPerMeasure
    var loop3End = editor.track.notesPerMeasure * editor.track.numberOfMeasures;
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

    editor.expandAuthoringViewWhenNecessary(editor.track.notesPerMeasure, editor.track.numberOfMeasures);

    editor.changeDivisionWithNotes(editor.track.timeDivision, uiStickings, uiHH, uiTom1, uiTom4, uiSnare, uiKick);

    // reference the button and scroll it into view
    var add_measure_button = document.getElementById("addMeasureButton");
    if (add_measure_button)
        add_measure_button.scrollIntoView({ block: "start", behavior: "smooth" });

    editor.updateSheetMusic();
};


/**
 * Adds a new empty measure at start of our track
 * Collects notes before and after the insertion point and adds an empty measure.
 * 
 * @param {number} measureNum - Index of the measure after which to add (1-based)
 * @requires Functions:
 * - get_sticking_state - Gets sticking notation for a note
 * - get_hh_state - Gets hi-hat state for a note
 * - get_tom_state - Gets tom state for a note
 * - get_snare_state - Gets snare state for a note
 * - get_kick_state - Gets kick state for a note
 * - shiftRepeatedMeasuresAfterIndex - Updates repeat counts after insertion
 * @requires editor.track - Track object containing score state
 */
function addMeasurePrevButtonClick (event) {
    var uiStickings = "";
    var uiHH = "";
    var uiTom1 = "";
    var uiTom4 = "";
    var uiSnare = "";
    var uiKick = "";
    var i;

    // Introduce an empty measure at the start
    for (i = 0; i < editor.track.notesPerMeasure; i++) {
        uiStickings += "-";
        uiHH += "-";
        uiTom1 += "-";
        uiTom4 += "-";
        uiSnare += "-";
        uiKick += "-";
    }

    // get the encoded notes out of the UI.
    var topIndex = editor.track.notesPerMeasure * editor.track.numberOfMeasures;
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

    editor.expandAuthoringViewWhenNecessary(editor.track.notesPerMeasure, editor.track.numberOfMeasures);

    editor.changeDivisionWithNotes(editor.track.timeDivision, uiStickings, uiHH, uiTom1, uiTom4, uiSnare, uiKick);

    editor.updateSheetMusic();
};


/**
 * Clears all notes from all measures in the score.
 * Resets the score to its initial empty state while preserving measure structure.
 * 
 * @requires editor.track - Track object containing score state
 */
function clearAllNotes() {
    editor.track.repeatedMeasures.clear();
    for (var i = 0; i < editor.track.numberOfMeasures * editor.track.notesPerMeasure; i++) {
        set_sticking_state(i, 'off', editor.track.notesPerMeasure, editor.track.timeDivision, editor.track.noteValue);
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

    editor.changeDivisionWithNotes(editor.track.timeDivision, uiStickings, uiHH, uiTom1, uiTom4, uiSnare, uiKick);
}


/**
 * Shifts the repeated measures map entries after a given index.
 * Used when adding or removing measures to maintain correct repeat counts.
 * 
 * @param {number} measureIndex - Index of the measure to start shifting from (0-based)
 * @param {number} direction - Direction to shift (1 for right, -1 for left)
 * @requires editor.track.repeatedMeasures - Map containing measure repeat counts
 */
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