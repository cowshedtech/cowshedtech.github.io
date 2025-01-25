// Javascript for the Groove Scribe HTML application

// local constants
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



// is the any kick note on for this note in the measure?
function is_kick_on(id) {
    return get_kick_state(id, "ABC") !== false;
}


// returns the ABC notation for the kick state
// false = off
// "F" = normal kick
// "^d," = splash
// "F^d,"  = kick & splash
function get_kick_state(id, returnType) {

    var splashOn = (document.getElementById("kick_splash" + id).style.color == constant_note_on_color_rgb);
    var kickOn = (document.getElementById("kick_circle" + id).style.backgroundColor == constant_note_on_color_rgb);

    if (returnType != "ABC" && returnType != "URL") {
        console.log("bad returnType in get_kick_state()");
        returnType = "ABC";
    }

    if (splashOn && kickOn) {
        if (returnType == "ABC")
            return constant_ABC_KI_SandK; // kick & splash
        else if (returnType == "URL")
            return "X"; // kick & splash
    } else if (splashOn) {
        if (returnType == "ABC")
            return constant_ABC_KI_Splash; // splash only
        else if (returnType == "URL")
            return "x"; // splash only
    } else if (kickOn) {
        if (returnType == "ABC")
            return constant_ABC_KI_Normal; // kick normal
        else if (returnType == "URL")
            return "o"; // kick normal
    }

    if (returnType == "ABC")
        return false; // off (rest)
    else if (returnType == "URL")
        return "-"; // off (rest)
}

// set the kick note on with type
function set_kick_state(id, mode, make_sound) {

    // hide everything optional
    document.getElementById("kick_circle" + id).style.backgroundColor = constant_note_hidden_color_rgb;
    document.getElementById("kick_splash" + id).style.color = constant_note_hidden_color_rgb;

    // turn stuff on conditionally
    switch (mode) {
        case "off":
            document.getElementById("kick_circle" + id).style.backgroundColor = constant_note_off_color_hex;
            document.getElementById("kick_circle" + id).style.borderColor = constant_note_border_color_hex;
            break;
        case "normal":
            document.getElementById("kick_circle" + id).style.backgroundColor = constant_note_on_color_hex;
            document.getElementById("kick_circle" + id).style.borderColor = constant_note_border_color_hex;
            if (make_sound)
                play_single_note_for_note_setting(constant_OUR_MIDI_KICK_NORMAL);
            break;
        case "splash":
            document.getElementById("kick_splash" + id).style.color = constant_note_on_color_hex;
            document.getElementById("kick_circle" + id).style.borderColor = constant_note_hidden_color_rgb;
            if (make_sound)
                play_single_note_for_note_setting(constant_OUR_MIDI_HIHAT_FOOT);
            break;
        case "kick_and_splash":
            document.getElementById("kick_circle" + id).style.backgroundColor = constant_note_on_color_hex;
            document.getElementById("kick_splash" + id).style.color = constant_note_on_color_hex;
            if (make_sound)
                play_single_note_for_note_setting(constant_OUR_MIDI_HIHAT_FOOT);
            if (make_sound)
                play_single_note_for_note_setting(constant_OUR_MIDI_KICK_NORMAL);
            break;
        default:
            console.log("bad switch in set_kick_state");
            break;
    }
}