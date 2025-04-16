// Javascript for the Groove Scribe HTML application

function set_sticking_state(id, new_state) {
    editor.track.sticking_array[id] = new_state;
}

function get_sticking_state(id, returnType) {

    let abcState = editor.track.sticking_array[id] ? editor.track.sticking_array[id] : constant_ABC_STICK_OFF;
    let result = abcState;
    
    if (returnType == "URL")
    {
        if (abcState === constant_ABC_STICK_BOTH) returnType = "B";
        if (abcState === constant_ABC_STICK_R) returnType = "R";
        if (abcState === constant_ABC_STICK_L) returnType = "L";
        if (abcState === constant_ABC_STICK_COUNT) returnType = "C";
        if (abcState === constant_ABC_STICK_OFF) returnType = "-";
    }

    return result;    
}



// Swap Right and Left stickings if any are shown
function stickingsReverseRL() {
    for (var i = 0; i < editor.track.numberOfMeasures * editor.notesPerMeasure; i++) {
        var cur_state = get_sticking_state(i, "URL");
        if (cur_state === "R") {
            set_sticking_state(i, "left", false, editor.notesPerMeasure, editor.track.timeDivision, editor.track.noteValue);
        } else if (cur_state === "L") {
            set_sticking_state(i, "right", false, editor.notesPerMeasure, editor.track.timeDivision, editor.track.noteValue);
        }
    }
    editor.updateSheetMusic();
}
