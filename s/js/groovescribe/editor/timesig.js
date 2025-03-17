function setTimeSigLabel() {
    // turn on/off special features that are only available in 4/4 time

    // set the label
    document.getElementById("timeSigLabel").innerHTML = '<sup>' + editor.track.numBeats + "</sup>/<sub>" + editor.class_note_value_per_measure + "</sub>";
};


function timeSigPopupOpen(type) {
    var popup = document.getElementById("timeSigPopup");

    if (popup)
        popup.style.display = "block";

};

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
        editor.class_note_value_per_measure = newTimeSigBottom;
        var new_notes_per_measure = calc_notes_per_measure(editor.class_time_division, editor.track.numBeats, editor.class_note_value_per_measure);
        // If new_notes_per_measure is greater it will cause the changeDivision code to error
        // as it tries to read the notes from the UI.   Setting it lower will allow the code to truncate
        // the groove properly to something smaller rather than interpolating the groove into something weird
        if (new_notes_per_measure < editor.class_notes_per_measure)
            editor.class_notes_per_measure = new_notes_per_measure;
        editor.changeDivision(editor.class_time_division);   // use this function because it will relayout everything
    }
    if (callback) {
        callback();
    }
};


// turns on or off triplet 1/4 and 1/8 note selection based on the current time sig setting
function setTimeDivisionSelectionOnOrOff() {

    // check for incompatible odd time signature division  9/16 and 1/8 notes for instance
    if ((8 * editor.track.numBeats / editor.class_note_value_per_measure) % 1 != 0) {
        addOrRemoveKeywordFromClassById("subdivision_8ths", "disabled", true);
    } else {
        addOrRemoveKeywordFromClassById("subdivision_8ths", "disabled", false);
    }

    if (editor.class_note_value_per_measure != 4) {
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