// Javascript for the Groove Scribe HTML application
// Groove Scribe is for drummers and helps create sheet music with an easy to use WYSIWYG groove editor.
//
// Functions for handling a staff in the clickable editor


/**
 * Updates the time signature label in the UI.
 * Displays the current time signature as a fraction with the number of beats
 * on top and the note value on the bottom.
 * 
 * @requires DOM elements:
 * - #timeSigLabel - The element to display the time signature
 * @requires editor.track - Track object containing:
 * - numBeats - Number of beats per measure
 * - noteValue - Note value that gets one beat
 */
function setTimeSigLabel() {
    // turn on/off special features that are only available in 4/4 time

    // set the label
    document.getElementById("timeSigLabel").innerHTML = '<sup>' + editor.track.numBeats + "</sup>/<sub>" + editor.track.noteValue + "</sub>";
};


/**
 * Opens the time signature popup dialog.
 * 
 * @param {string} type - The type of popup action (unused in current implementation)
 * @requires DOM elements:
 * - #timeSigPopup - The popup dialog element
 */
function timeSigPopupOpen(type) {
    var popup = document.getElementById("timeSigPopup");

    if (popup)
        popup.style.display = "block";

};

/**
 * Closes the time signature popup dialog and handles the user's input.
 * If type is 'ok', updates the time signature and recalculates the measure layout.
 * 
 * @param {string} type - The type of close action ('ok' or 'cancel')
 * @param {Function} [callback] - Optional callback function to execute after closing
 * @requires DOM elements:
 * - #timeSigPopup - The popup dialog element
 * - #timeSigPopupTimeSigTop - Input for number of beats
 * - #timeSigPopupTimeSigBottom - Input for note value
 * @requires Functions:
 * - usingTriplets - Checks if triplets are currently in use
 * - calc_notes_per_measure - Calculates notes per measure based on time signature
 * @requires editor.track - Track object containing time signature state
 */
function timeSigPopupClose(type, callback) {
    var popup = document.getElementById("timeSigPopup");

    if (popup)
        popup.style.display = "none";

    // ignore type "cancel"
    if (type == "ok") {
        var newTimeSigTop = document.getElementById("timeSigPopupTimeSigTop").value;
        var newTimeSigBottom = document.getElementById("timeSigPopupTimeSigBottom").value;

        if (usingTriplets() && newTimeSigBottom != 4) {
            editor.changeDivision(16);  // switch to a non triplet division since they are not supported in this time signature
        }

        editor.track.numBeats = newTimeSigTop;
        editor.track.noteValue = newTimeSigBottom;
        var new_notes_per_measure = calc_notes_per_measure(editor.track.timeDivision, editor.track.numBeats, editor.track.noteValue);
        // If new_notes_per_measure is greater it will cause the changeDivision code to error
        // as it tries to read the notes from the UI.   Setting it lower will allow the code to truncate
        // the groove properly to something smaller rather than interpolating the groove into something weird
        if (new_notes_per_measure < editor.track.notesPerMeasure)
            editor.track.notesPerMeasure = new_notes_per_measure;
        editor.changeDivision(editor.track.timeDivision);   // use this function because it will relayout everything
    }
    if (callback) {
        callback();
    }
};


/**
 * Enables or disables time division selections based on the current time signature.
 * Handles compatibility between time signatures and different note divisions:
 * - Disables 8th notes for incompatible time signatures
 * - Disables triplets for time signatures not in x/4 time
 * 
 * @requires Functions:
 * - addOrRemoveKeywordFromClassById - Toggles CSS classes on elements
 * @requires DOM elements:
 * - #subdivision_8ths - 8th note subdivision selector
 * - #subdivision_12ths - Triplet quarter note subdivision selector
 * - #subdivision_24ths - Triplet 8th note subdivision selector
 * - #subdivision_48ths - Triplet 16th note subdivision selector
 * @requires editor.track - Track object containing:
 * - numBeats - Number of beats per measure
 * - noteValue - Note value that gets one beat
 */
function setTimeDivisionSelectionOnOrOff() {

    // check for incompatible odd time signature division  9/16 and 1/8 notes for instance
    if ((8 * editor.track.numBeats / editor.track.noteValue) % 1 != 0) {
        addOrRemoveKeywordFromClassById("subdivision_8ths", "disabled", true);
    } else {
        addOrRemoveKeywordFromClassById("subdivision_8ths", "disabled", false);
    }

    if (editor.track.noteValue != 4) {
        // triplets are too complicated right now outside of x/4 time.
        // disable them

        addOrRemoveKeywordFromClassById("subdivision_12ths", "disabled", true);
        addOrRemoveKeywordFromClassById("subdivision_24ths", "disabled", true);
        addOrRemoveKeywordFromClassById("subdivision_48ths", "disabled", true);

    } else {
        addOrRemoveKeywordFromClassById("subdivision_12ths", "disabled", false);
        addOrRemoveKeywordFromClassById("subdivision_24ths", "disabled", false);
        addOrRemoveKeywordFromClassById("subdivision_48ths", "disabled", false);

    }
};