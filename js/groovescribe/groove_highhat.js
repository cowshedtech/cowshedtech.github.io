// Javascript for the Groove Scribe HTML application
// Groove Scribe is for drummers and helps create sheet music with an easy to use WYSIWYG groove editor.
//
// Functions for handling high hats
//


var constant_note_on_color_hex = "#000000"; // black
var constant_note_on_color_rgb = 'rgb(0, 0, 0)'; // black
var constant_hihat_note_off_color_hex = "#CCC";
var constant_hihat_note_off_color_rgb = 'rgb(204, 204, 204)'; // grey
var constant_note_hidden_color_rgb = "transparent";

function is_hh_on(id) {
    return get_hh_state(id, "ABC") !== false;
}

// returns the ABC notation for the HH state
// false = off
// see the top constants for mappings
function get_hh_state(id, returnType) {
    // Validate returnType
    if (returnType !== "ABC" && returnType !== "URL") {
        console.log("bad returnType in get_hh_state()");
        returnType = "ABC";
    }

    // Define mapping of element IDs to return values
    const stateMap = [
        { id: "hh_ride", abc: constant_ABC_HH_Ride, url: "r" },
        { id: "hh_ride_bell", abc: constant_ABC_HH_Ride_Bell, url: "b" },
        { id: "hh_cow_bell", abc: constant_ABC_HH_Cow_Bell, url: "m" },
        { id: "hh_crash", abc: constant_ABC_HH_Crash, url: "c" },
        { id: "hh_stacker", abc: constant_ABC_HH_Stacker, url: "s" },
        { id: "hh_metronome_normal", abc: constant_ABC_HH_Metronome_Normal, url: "n" },
        { id: "hh_metronome_accent", abc: constant_ABC_HH_Metronome_Accent, url: "N" },
        { id: "hh_open", abc: constant_ABC_HH_Open, url: "o" },
        { id: "hh_close", abc: constant_ABC_HH_Close, url: "+" },
        { id: "hh_accent", abc: constant_ABC_HH_Accent, url: "X" },
        { id: "hh_cross", abc: constant_ABC_HH_Normal, url: "x" }
    ];

    // Find first active state
    const activeState = stateMap.find(state => 
        document.getElementById(state.id + id).style.color === constant_note_on_color_rgb
    );

    // Return appropriate value based on returnType
    if (activeState) {
        return returnType === "ABC" ? activeState.abc : activeState.url;
    }

    // Return default value if no active state found
    return returnType === "ABC" ? false : "-";
}

// TODO: refactor this using a lookup table of constants
function set_hh_state(id, mode, make_sound) {

    // hide everything optional
    document.getElementById("hh_cross" + id).style.color = constant_note_hidden_color_rgb;
    document.getElementById("hh_ride" + id).style.color = constant_note_hidden_color_rgb;
    document.getElementById("hh_ride_bell" + id).style.color = constant_note_hidden_color_rgb;
    document.getElementById("hh_cow_bell" + id).style.color = constant_note_hidden_color_rgb;
    document.getElementById("hh_crash" + id).style.color = constant_note_hidden_color_rgb;
    document.getElementById("hh_stacker" + id).style.color = constant_note_hidden_color_rgb;
    document.getElementById("hh_metronome_normal" + id).style.color = constant_note_hidden_color_rgb;
    document.getElementById("hh_metronome_accent" + id).style.color = constant_note_hidden_color_rgb;
    document.getElementById("hh_open" + id).style.color = constant_note_hidden_color_rgb;
    document.getElementById("hh_close" + id).style.color = constant_note_hidden_color_rgb;
    document.getElementById("hh_accent" + id).style.color = constant_note_hidden_color_rgb;

    // turn stuff on conditionally
    switch (mode) {
        case "off":
            document.getElementById("hh_cross" + id).style.color = constant_hihat_note_off_color_hex;
            break;
        case "normal":
            document.getElementById("hh_cross" + id).style.color = constant_note_on_color_hex;
            if (make_sound)
                play_single_note_for_note_setting(constant_OUR_MIDI_HIHAT_NORMAL);
            break;
        case "ride":
            document.getElementById("hh_ride" + id).style.color = constant_note_on_color_hex;
            if (make_sound)
                play_single_note_for_note_setting(constant_OUR_MIDI_HIHAT_RIDE);
            break;
        case "ride_bell":
            document.getElementById("hh_ride_bell" + id).style.color = constant_note_on_color_hex;
            if (make_sound)
                play_single_note_for_note_setting(constant_OUR_MIDI_HIHAT_RIDE_BELL);
            break;
        case "cow_bell":
            document.getElementById("hh_cow_bell" + id).style.color = constant_note_on_color_hex;
            if (make_sound)
                play_single_note_for_note_setting(constant_OUR_MIDI_HIHAT_COW_BELL);
            break;
        case "crash":
            document.getElementById("hh_crash" + id).style.color = constant_note_on_color_hex;
            if (make_sound)
                play_single_note_for_note_setting(constant_OUR_MIDI_HIHAT_CRASH);
            break;
        case "stacker":
            document.getElementById("hh_stacker" + id).style.color = constant_note_on_color_hex;
            if (make_sound)
                play_single_note_for_note_setting(constant_OUR_MIDI_HIHAT_STACKER);
            break;
        case "metronome_normal":
            document.getElementById("hh_metronome_normal" + id).style.color = constant_note_on_color_hex;
            if (make_sound)
                play_single_note_for_note_setting(constant_OUR_MIDI_HIHAT_METRONOME_NORMAL);
            break;
        case "metronome_accent":
            document.getElementById("hh_metronome_accent" + id).style.color = constant_note_on_color_hex;
            if (make_sound)
                play_single_note_for_note_setting(constant_OUR_MIDI_HIHAT_METRONOME_ACCENT);
            break;
        case "open":
            document.getElementById("hh_cross" + id).style.color = constant_note_on_color_hex;
            document.getElementById("hh_open" + id).style.color = constant_note_on_color_hex;
            if (make_sound)
                play_single_note_for_note_setting(constant_OUR_MIDI_HIHAT_OPEN);
            break;
        case "close":
            document.getElementById("hh_cross" + id).style.color = constant_note_on_color_hex;
            document.getElementById("hh_close" + id).style.color = constant_note_on_color_hex;
            if (make_sound)
                play_single_note_for_note_setting(constant_OUR_MIDI_HIHAT_NORMAL);
            break;
        case "accent":
            document.getElementById("hh_cross" + id).style.color = constant_note_on_color_hex;
            document.getElementById("hh_accent" + id).style.color = constant_note_on_color_hex;
            if (make_sound)
                play_single_note_for_note_setting(constant_OUR_MIDI_HIHAT_ACCENT);
            break;
        default:
            console.log("bad switch in set_hh_state");
            break;
    }
}