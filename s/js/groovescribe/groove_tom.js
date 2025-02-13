// Javascript for the Groove Scribe HTML application

var constant_default_tempo = 80;
var constant_note_stem_off_color = "transparent";
var constant_note_on_color_hex = "#000000"; // black
var constant_note_on_color_rgb = 'rgb(0, 0, 0)'; // black
var constant_note_off_color_hex = "#FFF";
var constant_note_off_color_rgb = 'rgb(255, 255, 255)'; // white
var constant_note_border_color_hex = "#999";
var constant_hihat_note_off_color_hex = "#CCC";
var constant_hihat_note_off_color_rgb = 'rgb(204, 204, 204)'; // grey
var constant_note_hidden_color_rgb = "transparent";
var constant_sticking_right_on_color_rgb = "rgb(36, 132, 192)";
var constant_sticking_left_on_color_rgb = "rgb(57, 57, 57)";
var constant_sticking_both_on_color_rgb = "rgb(57, 57, 57)";
var constant_sticking_count_on_color_rgb = "rgb(57, 57, 57)";
var constant_sticking_right_off_color_rgb = "rgb(204, 204, 204)";
var constant_sticking_left_off_color_rgb = "rgb(204, 204, 204)";
var constant_snare_accent_on_color_hex = "#FFF";
var constant_snare_accent_on_color_rgb = "rgb(255, 255, 255)";

function is_tom_on(id, tom_num) {
    var state = get_tom_state(id, tom_num, "ABC");

    if (state !== false)
        return true;

    return false;
}

// returns the ABC notation for the Tom state
// false = off
// "x" = normal tom
function get_tom_state(id, tom_num, returnType) {

    var tomOn = (document.getElementById("tom_circle" + tom_num + "-" + id).style.backgroundColor == constant_note_on_color_rgb);

    if (returnType != "ABC" && returnType != "URL") {
        console.log("bad returnType in get_kick_state()");
        returnType = "ABC";
    }

    if (tomOn) {
        if (returnType == "ABC")
            switch (tom_num) {
                case 1:
                    return constant_ABC_T1_Normal; // normal
                    break;
                case 4:
                    return constant_ABC_T4_Normal; // normal
                    break;
                default:
                    console.log("bad switch in get_tom_state. bad tom num:" + tom_num);
                    break;
            }
        else if (returnType == "URL")
            return "x"; // normal
    }

    if (returnType == "ABC")
        return false; // off (rest)
    else if (returnType == "URL")
        return "-"; // off (rest)
}

// set the tom note on with type
function set_tom_state(id, tom_num, mode, make_sound) {
    // turn stuff on conditionally
    switch (mode) {
        case "off":
            document.getElementById("tom_circle" + tom_num + "-" + id).style.backgroundColor = constant_note_off_color_hex;
            document.getElementById("tom_circle" + tom_num + "-" + id).style.borderColor = constant_note_border_color_hex;
            break;
        case "normal":
            document.getElementById("tom_circle" + tom_num + "-" + id).style.backgroundColor = constant_note_on_color_hex;
            document.getElementById("tom_circle" + tom_num + "-" + id).style.borderColor = constant_note_border_color_hex;
            if (make_sound)
                switch (tom_num) {
                    case 1:
                        play_single_note_for_note_setting(constant_OUR_MIDI_TOM1_NORMAL);
                        break;
                    case 4:
                        play_single_note_for_note_setting(constant_OUR_MIDI_TOM4_NORMAL);
                        break;
                    default:
                        console.log("bad switch in set_tom_state. bad tom num:" + tom_num);
                        break;
                }
            break;
        default:
            console.log("bad switch in set_tom_state");
            break;
    }
}

// silly helpers, but needed for argument compatibility with the other set states
function set_tom1_state(id, mode, make_sound) {
    set_tom_state(id, 1, mode, make_sound);
}

function set_tom4_state(id, mode, make_sound) {
    set_tom_state(id, 4, mode, make_sound);
}



function GetDefaultTom1Groove(notes_per_measure, timeSigTop, timeSigBottom, numMeasures) {
    return GetEmptyGroove(notes_per_measure, numMeasures);
};

function GetDefaultTom4Groove(notes_per_measure, timeSigTop, timeSigBottom, numMeasures) {
    return GetEmptyGroove(notes_per_measure, numMeasures);
};

function GetDefaultTomGroove(notes_per_measure, timeSigTop, timeSigBottom, numMeasures) {
    return GetEmptyGroove(notes_per_measure, numMeasures);
};
