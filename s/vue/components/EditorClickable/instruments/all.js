// Javascript for the Groove Scribe HTML application

/**
 * Checks if a specific instrument is muted for a given measure
 * @param {string} instrument - The instrument name (e.g., 'HH', 'Snare')
 * @param {number} measure - The measure number
 * @returns {boolean} True if the instrument is muted, false otherwise
 */
function isInstrumentMuted(instrument, measure) {
    const buttonId = `unmute${instrument}Button${measure}`;
    const button = document.getElementById(buttonId);
    
    return button?.style.display === "inline-block" ?? false;
}


//
//
//
function muteInstrument(instrument, measure, muteElseUnmute) {
    // find unmuteHHButton1  or unmuteSnareButton2
    var buttonName = "unmute" + instrument + "Button" + measure
    var button = document.getElementById(buttonName);
    if (muteElseUnmute)
        button.style.display = "inline-block";
    else
        button.style.display = "none";

        midiPlayer.noteHasChanged();
}




// each of the instruments can be muted.   Check the UI and zero out the array if the instrument is marked as muted
// for a particular measure
function muteArrayFromClickableUI(Sticking_Array, HH_Array, Snare_Array, Kick_Array, Toms_Array, measureIndex) {
    
    if (editor.track.isInstrumentMutedInMeasure(Instruments.HIGH_HAT, measureIndex))
        fill_array_with_value_false(HH_Array, HH_Array.length);
    if (editor.track.isInstrumentMutedInMeasure(Instruments.TOM1, measureIndex))
        fill_array_with_value_false(Toms_Array[0], Toms_Array[0].length);
    if (editor.track.isInstrumentMutedInMeasure(Instruments.SNARE, measureIndex))
        fill_array_with_value_false(Snare_Array, Snare_Array.length);
    if (editor.track.isInstrumentMutedInMeasure(Instruments.TOM4, measureIndex))
        fill_array_with_value_false(Toms_Array[3], Toms_Array[3].length);
    if (editor.track.isInstrumentMutedInMeasure(Instruments.KICK, measureIndex))
        fill_array_with_value_false(Kick_Array, Kick_Array.length);    
}


// query the clickable UI and generate a 32 element array representing the notes of one measure
// note: the ui may have fewer notes, but we scale them to fit into the 32 elements proportionally
// If using triplets returns 48 notes.   Otherwise always 32.
//
// (note: Only one measure, not all the notes on the page if multiple measures are present)
// Return value is the number of notes.
function get32NoteArrayFromClickableUI(Sticking_Array, HH_Array, Snare_Array, Kick_Array, Toms_Array, startIndexForClickableUI) {

    var scaler = getNoteScaler(editor.track.notesPerMeasure, editor.track.numBeats, editor.track.noteValue); // fill proportionally

    // fill in the arrays from the clickable UI
    for (var i = 0; i < editor.track.notesPerMeasure; i++) {
        var array_index = (i) * scaler;

        // only grab the stickings if they are visible
        // if (options.isStickingVisible())
        //     Sticking_Array[array_index] = editor.track.getStickingState(i + startIndexForClickableUI, "ABC");

        HH_Array[array_index] = editor.track.getInstrumentNote(Instruments.HIGH_HAT, i + startIndexForClickableUI);

        if (options.areTomsVisible()) {
            Toms_Array[0][array_index] = editor.track.getInstrumentNote(Instruments.TOM1, i + startIndexForClickableUI, "ABC");
            Toms_Array[3][array_index] = editor.track.getInstrumentNote(Instruments.TOM4, i + startIndexForClickableUI, "ABC");

        }

        Snare_Array[array_index] = editor.track.getInstrumentNote(Instruments.SNARE, i + startIndexForClickableUI);
        Kick_Array[array_index] = editor.track.getInstrumentNote(Instruments.KICK, i + startIndexForClickableUI);       

    }

    var num_notes = Snare_Array.length;
    return num_notes;
}


// 