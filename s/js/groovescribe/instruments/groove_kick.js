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


// build a string that looks like this
// |o---------------o---------------|
function GetDefaultKickGroove(notes_per_measure, timeSigTop, timeSigBottom, numMeasures) {
    var retString = "";
    var oneMeasureString = "|";
    var i;
    var notes_per_grouping = (notes_per_measure / timeSigTop);

    for(i = 0; i < notes_per_measure; i++) {
        // if the note falls on the beginning of a group
        // and the group is even
        if(i % notes_per_grouping === 0 && (i / notes_per_grouping) % 2 === 0)
            oneMeasureString += "o";
        else
            oneMeasureString += "-";
    }
    for (i = 0; i < numMeasures; i++)
            retString += oneMeasureString;
        retString += "|";

    return retString;
};

//
//
//
function generateKickContainerHTML(indexStartForNotes, baseindex, class_notes_per_measure, class_num_beats_per_measure, class_note_value_per_measure, indexStartForNotes) {
    let newHTML = []; // Use an array to build the HTML
    newHTML.push('<div class="kick-container">');
    newHTML.push('<div class="opening_note_space"> </div> ');

    for (var j = indexStartForNotes; j < class_notes_per_measure + indexStartForNotes; j++) {
        newHTML.push(`
            <div id="kick${j}" class="kick" onClick="myGrooveWriter.noteLeftClick(event, 'kick', ${j})" oncontextmenu="event.preventDefault(); myGrooveWriter.noteRightClick(event, 'kick', ${j})" onmouseenter="myGrooveWriter.noteOnMouseEnter(event, 'kick', ${j})">
                <div class="kick_splash note_part" id="kick_splash${j}"><i class="fa fa-times"></i></div>
                <div class="kick_circle note_part" id="kick_circle${j}"></div>
            </div>
        `);

        if ((j - (indexStartForNotes - 1)) % noteGroupingSize(class_notes_per_measure, class_num_beats_per_measure, class_note_value_per_measure) === 0 && j < class_notes_per_measure + indexStartForNotes - 1) {
            newHTML.push('<div class="space_between_note_groups"> </div> ');
        }
    }
    newHTML.push(`<span class="unmuteKickButton" id="unmutekickButton${baseindex}" onClick='myGrooveWriter.muteInstrument("kick", ${baseindex}, false)'><span class="fa-stack unmuteStack"><i class="fa fa-ban fa-stack-2x" style="color:red"></i><i class="fa fa-volume-down fa-stack-1x"></i></span>`);
    newHTML.push('<div class="end_note_space"></div>\n</div>\n');

    return newHTML.join(''); // Join the array into a single string
}


// merge 2 kick arrays
//  4 possible states
//  false   (off)
//  constant_ABC_KI_Normal
//  constant_ABC_KI_SandK
//  constant_ABC_KI_Splash
function merge_kick_arrays(primary_kick_array, secondary_kick_array) {
    var new_kick_array = [];

    for (var i in primary_kick_array) {

        switch (primary_kick_array[i]) {
            case false:
                new_kick_array.push(secondary_kick_array[i]);
                break;

            case constant_ABC_KI_SandK:
                new_kick_array.push(constant_ABC_KI_SandK);
                break;

            case constant_ABC_KI_Normal:
                if (secondary_kick_array[i] == constant_ABC_KI_SandK ||
                    secondary_kick_array[i] == constant_ABC_KI_Splash)
                    new_kick_array.push(constant_ABC_KI_SandK);
                else
                    new_kick_array.push(constant_ABC_KI_Normal);
                break;

            case constant_ABC_KI_Splash:
                if (secondary_kick_array[i] == constant_ABC_KI_Normal ||
                    secondary_kick_array[i] == constant_ABC_KI_SandK)
                    new_kick_array.push(constant_ABC_KI_SandK);
                else
                    new_kick_array.push(constant_ABC_KI_Splash);
                break;

            default:
                console.log("bad case in merge_kick_arrays()");
                new_kick_array.push(primary_kick_array[i]);
                break;
        }
    }

    return new_kick_array;
}