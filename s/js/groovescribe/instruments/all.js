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


var measureForNoteLabelClick = 0;

// context menu for labels;
function noteLabelClick(event, instrument, measure) {
    var contextMenu = false;

    // store this in a global, there can only ever be one context menu open at a time.
    // Yes, I agree this sucks
    measureForNoteLabelClick = measure;

    switch (instrument) {
        case "stickings":
            contextMenu = document.getElementById("stickingsLabelContextMenu");
            break;
        case "hh":
            contextMenu = document.getElementById("hhLabelContextMenu");
            break;
        case "tom1":
            contextMenu = document.getElementById("tom1LabelContextMenu");
            break;
        case "tom4":
            contextMenu = document.getElementById("tom4LabelContextMenu");
            break;
        case "snare":
            contextMenu = document.getElementById("snareLabelContextMenu");
            break;
        case "kick":
            contextMenu = document.getElementById("kickLabelContextMenu");
            break;
        default:
            console.log("bad case in noteLabelClick: " + instrument);
            break;
    }

    if (contextMenu) {
        if (!event)
            event = window.event;
        if (event.clientX || event.clientY) {
            contextMenu.style.top = event.clientY - 30 + "px";
            contextMenu.style.left = event.clientX - 35 + "px";
        }
        showContextMenu(contextMenu);
    }

    return false;
};

//
//
//
function noteLabelPopupClick(instrument, action) {
    var setFunction = false;
    var contextMenu = false;

    switch (instrument) {
        case "stickings":
            setFunction = set_sticking_state;
            break;
        case "hh":
            setFunction = set_hh_state;
            break;
        case "tom1":
            setFunction = set_tom1_state;
            break;
        case "tom4":
            setFunction = set_tom4_state;
            break;
        case "snare":
            setFunction = set_snare_state;
            break;
        case "kick":
            setFunction = set_kick_state;
            break;
        default:
            console.log("bad case in noteLabelPopupClick");
            return false;
    }

    if (action == "mute") {
        muteInstrument(instrument, measureForNoteLabelClick, true);
        return false;
    }

    // start at the first note of the measure we want to effect.   Only fill in the
    // notes for that measure
    // the last boolean in the setFunction should only be true on the first call (plays a sound)
    var startIndex = editor.track.notesPerMeasure * (measureForNoteLabelClick - 1);
    for (var i = startIndex; i - startIndex < editor.track.notesPerMeasure; i++) {
        if (action == "all_off") {
            setFunction(i, "off", i == startIndex);

        } else if (instrument == "stickings") {
            switch (action) {
                case "all_right":
                    set_sticking_state(i, "right", i == startIndex, editor.track.notesPerMeasure, editor.track.timeDivision, editor.track.noteValue);
                    break;
                case "all_left":
                    set_sticking_state(i, "left", i == startIndex, editor.track.notesPerMeasure, editor.track.timeDivision, editor.track.noteValue);
                    break;
                case "alternate":
                    set_sticking_state(i, (i % 2 === 0 ? "right" : "left"), i == startIndex, editor.track.notesPerMeasure, editor.track.timeDivision, editor.track.noteValue);
                    break;
                case "all_count":
                    set_sticking_state(i, "count", i == startIndex, editor.track.notesPerMeasure, editor.track.timeDivision, editor.track.noteValue);
                    break;
                default:
                    console.log("Bad sticking case in noteLabelPopupClick");
                    break;
            }
        } else if (instrument == "hh" && action == "downbeats") {
            set_hh_state(i, (i % 2 === 0 ? "normal" : "off"), i == startIndex);

        } else if (instrument == "hh" && action == "upbeats") {
            set_hh_state(i, (i % 2 === 0 ? "off" : "normal"), i == (startIndex + 1));

        } else if (instrument == "snare" && action == "all_on") {
            set_snare_state(i, "accent", i == startIndex);

        } else if (instrument == "snare" && action == "all_on_normal") {
            set_snare_state(i, "normal", i == startIndex);

        } else if (instrument == "snare" && action == "all_on_ghost") {
            set_snare_state(i, "ghost", i == startIndex);

        } else if (instrument == "kick" && action == "hh_foot_nums_on") {
            var num_notes_per_count = editor.track.timeDivision / editor.track.noteValue
            var cur_state = get_kick_state(i, "ABC");
            var kick_is_on = false;
            if (cur_state == constant_ABC_KI_SandK || cur_state == constant_ABC_KI_Normal)
                kick_is_on = true;
            set_kick_state(i, (i % num_notes_per_count === 0 ? (kick_is_on ? "kick_and_splash" : "splash") : (kick_is_on ? "normal" : "off")), i == (startIndex));

        } else if (instrument == "kick" && action == "hh_foot_ands_on") {
            var num_notes_per_count = editor.track.timeDivision / editor.track.noteValue
            var cur_state = get_kick_state(i, "ABC");
            var kick_is_on = false;
            if (cur_state == constant_ABC_KI_SandK || cur_state == constant_ABC_KI_Normal)
                kick_is_on = true;

            set_kick_state(i, (i % num_notes_per_count === (num_notes_per_count / 2) ? (kick_is_on ? "kick_and_splash" : "splash") : (kick_is_on ? "normal" : "off")), i == (startIndex + num_notes_per_count / 2));

        } else if (action == "all_on") {
            setFunction(i, "normal", i == startIndex);

        } else if (action == "cancel") {
            continue; // do nothing.

        } else {
            console.log("Bad IF case in noteLabelPopupClick");

        }
    }

    measureForNoteLabelClick = 0; // reset

    editor.updateSheetMusic();

    return false;
};

var class_which_index_last_clicked = 0; // which note was last clicked for the context menu	

// // returns true on error!
// // returns false if working.  (this is because of the onContextMenu handler
function noteRightClick(event, type, id) {
    class_which_index_last_clicked = id;
    var contextMenu;

    switch (type) {
        case "sticking":
            contextMenu = document.getElementById("stickingContextMenu");
            break;
        case "hh":
            contextMenu = document.getElementById("hhContextMenu");
            break;
        case "tom1":
            contextMenu = document.getElementById("tom1ContextMenu");
            break;
        case "tom4":
            contextMenu = document.getElementById("tom4ContextMenu");
            break;
        case "snare":
            contextMenu = document.getElementById("snareContextMenu");
            break;
        case "kick":
            contextMenu = document.getElementById("kickContextMenu");
            break;
        default:
            console.log("Bad case in handleNotePopup");
            break;
    }

    if (contextMenu) {
        if (!event)
            event = window.event;
        if (event.clientX || event.clientY) {
            contextMenu.style.top = event.clientY - 30 + "px";
            contextMenu.style.left = event.clientX - 75 + "px";
        }
        showContextMenu(contextMenu);
    } else {
        return true; //error
    }

    return false;
};

function noteLeftClick(event, type, id) {

    // use a popup if advanced edit is on
    // if (class_advancedEditIsOn === true) {
    //     root.noteRightClick(event, type, id);

    // } else {

        // this is a non advanced edit left click
        switch (type) {
            case "hh":
                set_hh_state(id, is_hh_on(id) ? "off" : "normal", true);
                break;
            case "snare":
                set_snare_state(id, is_snare_on(id) ? "off" : "accent", true);
                break;
            case "tom1":
                set_tom_state(id, 1, is_tom_on(id, 1) ? "off" : "normal", true);
                break;
            case "tom4":
                set_tom_state(id, 4, is_tom_on(id, 4) ? "off" : "normal", true);
                break;
            case "kick":
                set_kick_state(id, is_kick_on(id) ? "off" : "normal", true);
                break;
            case "sticking":
                sticking_rotate_state(id, editor.track.notesPerMeasure, editor.track.timeDivision, editor.track.noteValue);
                break;
            default:
                console.log("Bad case in noteLeftClick: " + type);
                break;
        }

        // TODO
        editor.updateSheetMusic();
    // }

};

function notePopupClick(type, new_setting) {
    var id = class_which_index_last_clicked;

    switch (type) {
        case "sticking":
            set_sticking_state(id, new_setting, true, editor.track.notesPerMeasure, editor.track.timeDivision, editor.track.noteValue);
            break;
        case "hh":
            set_hh_state(id, new_setting, true);
            break;
        case "tom1":
            set_tom1_state(id, new_setting, true);
            break;
        case "tom4":
            set_tom4_state(id, new_setting, true);
            break;
        case "snare":
            set_snare_state(id, new_setting, true);
            break;
        case "kick":
            set_kick_state(id, new_setting, true);
            break;
        default:
            console.log("Bad case in contextMenuClick");
            break;
    }

    editor.updateSheetMusic();
};

// // called when we initially mouseOver a note.
// // We can use it to sense left or right mouse or ctrl events
function noteOnMouseEnter(event, instrument, id) {

    var action = false;

    if (event.ctrlKey)
        action = "on";
    if (event.altKey)
        action = "off";

    if (action) {
        switch (instrument) {
            case "hh":
                set_hh_state(id, action == "off" ? "off" : "normal", true);
                break;
            case "snare":
                set_snare_state(id, action == "off" ? "off" : "accent", true);
                break;
            case "kick":
                set_kick_state(id, action == "off" ? "off" : "normal", true);
                break;
            default:
                console.log("Bad case in noteOnMouseEnter");
                break;
        }
        updateSheetMusic(); // update music
    }

    return false;
};

// each of the instruments can be muted.   Check the UI and zero out the array if the instrument is marked as muted
// for a particular measure
function muteArrayFromClickableUI(Sticking_Array, HH_Array, Snare_Array, Kick_Array, Toms_Array, measureIndex) {
    if (isInstrumentMuted("hh", measureIndex + 1))
        fill_array_with_value_false(HH_Array, HH_Array.length);
    if (isInstrumentMuted("snare", measureIndex + 1))
        fill_array_with_value_false(Snare_Array, Snare_Array.length);
    if (isInstrumentMuted("kick", measureIndex + 1))
        fill_array_with_value_false(Kick_Array, Kick_Array.length);

    for (var i = 0; i < Toms_Array.length; i++) {
        if (isInstrumentMuted("tom" + (i + 1), measureIndex + 1))
            fill_array_with_value_false(Toms_Array[i], Toms_Array[i].length);
    }
}