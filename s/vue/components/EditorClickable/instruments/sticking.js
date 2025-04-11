// Javascript for the Groove Scribe HTML application

function set_sticking_state(id, new_state, make_sound, notesPerMeasure, timeDivision, noteValuePerMeasure) {

    editor.track.sticking_array[id] = new_state;

    // turn both off
    // document.getElementById("sticking_right" + id).style.color = constant_note_hidden_color_rgb;
    // document.getElementById("sticking_left" + id).style.color = constant_note_hidden_color_rgb;
    // document.getElementById("sticking_both" + id).style.color = constant_note_hidden_color_rgb;
    // document.getElementById("sticking_count" + id).style.color = constant_note_hidden_color_rgb;

    // switch (new_state) {
    //     case "off":
    //         // show them all greyed out.
    //         document.getElementById("sticking_right" + id).style.color = constant_sticking_right_off_color_rgb;
    //         document.getElementById("sticking_left" + id).style.color = constant_sticking_left_off_color_rgb;
    //         break;
    //     case "right":
    //         document.getElementById("sticking_right" + id).style.color = constant_sticking_right_on_color_rgb;
    //         break;
    //     case "left":
    //         document.getElementById("sticking_left" + id).style.color = constant_sticking_left_on_color_rgb;
    //         break;
    //     case "both":
    //         document.getElementById("sticking_both" + id).style.color = constant_sticking_both_on_color_rgb;
    //         break;
    //     case "count":
    //         var count_state = figure_out_sticking_count_for_index(id, notesPerMeasure, timeDivision, noteValuePerMeasure);

    //         document.getElementById("sticking_count" + id).style.color = constant_sticking_count_on_color_rgb;
    //         document.getElementById("sticking_count" + id).innerHTML = "" + count_state;
    //         break;

    //     default:
    //         console.log("Bad state in set_sticking_state: " + new_state);
    //         break;
    // }
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

    // var sticking_state = false;
    // if (returnType != "ABC" && returnType != "URL") {
    //     console.log("bad returnType in get_kick_state()");
    //     returnType = "ABC";
    // }

    // var right_ele = document.getElementById("sticking_right" + id);
    // var left_ele = document.getElementById("sticking_left" + id);
    // var both_ele = document.getElementById("sticking_both" + id);
    // var count_ele = document.getElementById("sticking_count" + id);

    // if (both_ele.style.color == constant_sticking_both_on_color_rgb) {
    //     // both is on
    //     if (returnType == "ABC")
    //         return constant_ABC_STICK_BOTH;
    //     else if (returnType == "URL")
    //         return "B";
    // } else if (right_ele.style.color == constant_sticking_right_on_color_rgb) {

    //     if (returnType == "ABC")
    //         return constant_ABC_STICK_R;
    //     else if (returnType == "URL")
    //         return "R";

    // } else if (left_ele.style.color == constant_sticking_left_on_color_rgb) {

    //     if (returnType == "ABC")
    //         return constant_ABC_STICK_L;
    //     else if (returnType == "URL")
    //         return "L";
    // } else if (count_ele.style.color == constant_sticking_count_on_color_rgb) {

    //     if (returnType == "ABC")
    //         return constant_ABC_STICK_COUNT;
    //     else if (returnType == "URL")
    //         return "c";
    // } else {
    //     // none selected.  Call it off
    //     if (returnType == "ABC")
    //         return constant_ABC_STICK_OFF; // off (rest)
    //     else if (returnType == "URL")
    //         return "-"; // off (rest)
    // }

    // return false; // should never get here
}


function sticking_rotate_state(id, notesPerMeasure, timeDivision, noteValuePerMeasure) {
    var new_state = false;
    var sticking_state = get_sticking_state(id, "ABC");

    // figure out the next state
    // we could get fancy here and default down strokes to R and upstrokes to L
    // for now we will rotate through (Off, R, L, BOTH) in order
    if (sticking_state == constant_ABC_STICK_OFF) {
        new_state = "right";
    } else if (sticking_state == constant_ABC_STICK_R) {
        new_state = "left";
    } else if (sticking_state == constant_ABC_STICK_L) {
        new_state = "both";
    } else if (sticking_state == constant_ABC_STICK_BOTH) {
        new_state = "count";
    } else {
        new_state = "off";
    }

    set_sticking_state(id, new_state, true, notesPerMeasure, timeDivision, noteValuePerMeasure);
}


function GetDefaultStickingsGroove(notes_per_measure, timeSigTop, timeSigBottom, numMeasures) {
    return GetEmptyGroove(notes_per_measure, numMeasures);
};


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


function stickingsShowHide(force, showElseHide, dontRefreshScreen) {

    var OnElseOff = toggleDisplayByClass(".stickings-container", force, showElseHide, "block");
    toggleDisplayByClass(".stickings-label", force, showElseHide, "block");

    if (force) {
        options.setStickingVisible(showElseHide)
    } else {
        options.setStickingVisible(!options.isStickingVisible())
    }

    // if (!dontRefreshScreen) {
    //     editor.updateSheetMusic();
    // }

    return false; // don't follow the link
};

// if stickings are shown, hide them and vice versa
function stickingsShowHideToggle() {

    var stickingsAreCurrentlyShown = options.isStickingVisible();
    stickingsShowHide(true, !stickingsAreCurrentlyShown, false);
}