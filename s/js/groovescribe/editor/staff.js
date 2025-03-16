//
//
function generateMeasureButtons(class_number_of_measures, baseindex, repeat) {
    var buttonsHTML = '';

    buttonsHTML += '<div style="display: inline-block;vertical-align: top; margin-top: 15px; margin-left: 15px; margin-right: 15px">'

    if (class_number_of_measures > 1)
        buttonsHTML += '<div title="Remove Measure" id="closeMeasureButton' + baseindex + '" onClick="myGrooveWriter.closeMeasureButtonClick(' + baseindex + ')" class="closeMeasureButton"><i class="fa fa-times-circle"></i></div>';
    else
        buttonsHTML += '<div class="closeMeasureButton"><i class="fa"></i></div>';

    buttonsHTML += '<div title="Repeat Measure" id="repeateMeasureIncButton' + baseindex + '" onClick="myGrooveWriter.repeatMeasureIncButtonClick(' + baseindex + ')" class="closeMeasureButton"><i class="fa">↑</i></div>';
    buttonsHTML += '<span style="color: var(--highlight-color-on-white);">' + repeat + '</span>';
    buttonsHTML += '<div title="Repeat Measure" id="repeateMeasureDecButton' + baseindex + '" onClick="myGrooveWriter.repeatMeasureDecButtonClick(' + baseindex + ')" class="closeMeasureButton"><i class="fa">↓</i></div>';
    buttonsHTML += '<div title="Duplicate Measure" id="duplicateMeasureButton' + baseindex + '" onClick="myGrooveWriter.duplicateMeasureButtonClick(' + baseindex + ')" class="closeMeasureButton"><i class="fa fa-rotate-left"></i></div>';
    buttonsHTML += '<div title="Add Measure" id="addMeasureMiddleButton' + baseindex + '" onClick="myGrooveWriter.addMeasureMiddleButtonClick(' + baseindex + ')" class="closeMeasureButton"><i class="fa fa-plus"></i></div>';
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
    const sortedEntries = [...editor.class_repeated_measures.entries()].sort((a, b) => a[0] - b[0]);
    
    // Process in reverse order to avoid overwriting
    for (let i = sortedEntries.length - 1; i >= 0; i--) {
        const [key, value] = sortedEntries[i];
        if (key > measureIndex) {
            editor.class_repeated_measures.set(key + direction, value);
            editor.class_repeated_measures.delete(key);
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
    const totalNotes = editor.class_notes_per_measure * editor.class_number_of_measures;

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

    editor.class_repeated_measures.delete(measureNum - 1);
    shiftRepeatedMeasuresAfterIndex(measureNum - 1, -1);
    editor.class_number_of_measures--;

    editor.expandAuthoringViewWhenNecessary(editor.class_notes_per_measure, editor.class_number_of_measures);
    changeDivisionWithNotes(
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
    const count = editor.class_repeated_measures.get(measureNum - 1) || 1;
    editor.class_repeated_measures.set(measureNum - 1, count + 1);

    // Collect all notes from the UI
    const notes = {
        stickings: '',
        hh: '',
        tom1: '',
        tom4: '',
        snare: '',
        kick: ''
    };
    
    const totalNotes = root.class_notes_per_measure * class_number_of_measures;
    for (let i = 0; i < totalNotes; i++) {
        notes.stickings += get_sticking_state(i, "URL");
        notes.hh += get_hh_state(i, "URL");
        notes.tom1 += get_tom_state(i, 1, "URL");
        notes.tom4 += get_tom_state(i, 4, "URL");
        notes.snare += get_snare_state(i, "URL");
        notes.kick += get_kick_state(i, "URL");
    }

    // Update UI and sheet music
    root.expandAuthoringViewWhenNecessary(root.class_notes_per_measure, class_number_of_measures);
    changeDivisionWithNotes(root.class_time_division, notes.stickings, notes.hh, notes.tom1, notes.tom4, notes.snare, notes.kick);
    
    // Scroll to add measure button if it exists
    const addMeasureButton = document.getElementById("addMeasureButton");
    addMeasureButton?.scrollIntoView({ block: "start", behavior: "smooth" });

    editor.updateSheetMusic();
};


//
//
function repeatMeasureDecButtonClick(measureNum) {
    const count = editor.class_repeated_measures.get(measureNum - 1) || 1;
    editor.class_repeated_measures.set(measureNum - 1, count - 1);

    let uiStickings = "", uiHH = "", uiTom1 = "", uiTom4 = "", uiSnare = "", uiKick = "";
    const topIndex = editor.class_notes_per_measure * editor.class_number_of_measures;

    for (let i = 0; i < topIndex; i++) {
        uiStickings += get_sticking_state(i, "URL");
        uiHH += get_hh_state(i, "URL");
        uiTom1 += get_tom_state(i, 1, "URL");
        uiTom4 += get_tom_state(i, 4, "URL");
        uiSnare += get_snare_state(i, "URL");
        uiKick += get_kick_state(i, "URL");
    }

    editor.expandAuthoringViewWhenNecessary(editor.class_notes_per_measure, editor.class_number_of_measures);
    changeDivisionWithNotes(editor.class_time_division, uiStickings, uiHH, uiTom1, uiTom4, uiSnare, uiKick);

    const addMeasureButton = document.getElementById("addMeasureButton");
    addMeasureButton?.scrollIntoView({ block: "start", behavior: "smooth" });

    editor.updateSheetMusic();
};