// Javascript for the Groove Scribe HTML application

function set_sticking_state(id, new_state, make_sound) {

    // turn both off
    document.getElementById("sticking_right" + id).style.color = constant_note_hidden_color_rgb;
    document.getElementById("sticking_left" + id).style.color = constant_note_hidden_color_rgb;
    document.getElementById("sticking_both" + id).style.color = constant_note_hidden_color_rgb;
    document.getElementById("sticking_count" + id).style.color = constant_note_hidden_color_rgb;

    switch (new_state) {
        case "off":
            // show them all greyed out.
            document.getElementById("sticking_right" + id).style.color = constant_sticking_right_off_color_rgb;
            document.getElementById("sticking_left" + id).style.color = constant_sticking_left_off_color_rgb;
            break;
        case "right":
            document.getElementById("sticking_right" + id).style.color = constant_sticking_right_on_color_rgb;
            break;
        case "left":
            document.getElementById("sticking_left" + id).style.color = constant_sticking_left_on_color_rgb;
            break;
        case "both":
            document.getElementById("sticking_both" + id).style.color = constant_sticking_both_on_color_rgb;
            break;
        case "count":
            var count_state = root.myGrooveUtils.figure_out_sticking_count_for_index(id, class_notes_per_measure, class_time_division, class_note_value_per_measure);

            document.getElementById("sticking_count" + id).style.color = constant_sticking_count_on_color_rgb;
            document.getElementById("sticking_count" + id).innerHTML = "" + count_state;
            break;

        default:
            console.log("Bad state in set_sticking_state: " + new_state);
            break;
    }
}

function get_sticking_state(id, returnType) {
    var sticking_state = false;
    if (returnType != "ABC" && returnType != "URL") {
        console.log("bad returnType in get_kick_state()");
        returnType = "ABC";
    }

    var right_ele = document.getElementById("sticking_right" + id);
    var left_ele = document.getElementById("sticking_left" + id);
    var both_ele = document.getElementById("sticking_both" + id);
    var count_ele = document.getElementById("sticking_count" + id);

    if (both_ele.style.color == constant_sticking_both_on_color_rgb) {
        // both is on
        if (returnType == "ABC")
            return constant_ABC_STICK_BOTH;
        else if (returnType == "URL")
            return "B";
    } else if (right_ele.style.color == constant_sticking_right_on_color_rgb) {

        if (returnType == "ABC")
            return constant_ABC_STICK_R;
        else if (returnType == "URL")
            return "R";

    } else if (left_ele.style.color == constant_sticking_left_on_color_rgb) {

        if (returnType == "ABC")
            return constant_ABC_STICK_L;
        else if (returnType == "URL")
            return "L";
    } else if (count_ele.style.color == constant_sticking_count_on_color_rgb) {

        if (returnType == "ABC")
            return constant_ABC_STICK_COUNT;
        else if (returnType == "URL")
            return "c";
    } else {
        // none selected.  Call it off
        if (returnType == "ABC")
            return constant_ABC_STICK_OFF; // off (rest)
        else if (returnType == "URL")
            return "-"; // off (rest)
    }

    return false; // should never get here
}


function sticking_rotate_state(id) {
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

    set_sticking_state(id, new_state, true);
}

function isStickingsVisible() {
    var myElements = document.querySelectorAll(".stickings-container");
    for (var i = 0; i < myElements.length; i++) {
        if (myElements[i].style.display == "block")
            return true;
    }

    return false;
}