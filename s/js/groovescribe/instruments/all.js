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


// query the clickable UI and generate a 32 element array representing the notes of one measure
// note: the ui may have fewer notes, but we scale them to fit into the 32 elements proportionally
// If using triplets returns 48 notes.   Otherwise always 32.
//
// (note: Only one measure, not all the notes on the page if multiple measures are present)
// Return value is the number of notes.
function get32NoteArrayFromClickableUI(Sticking_Array, HH_Array, Snare_Array, Kick_Array, Toms_Array, startIndexForClickableUI) {

    var scaler = getNoteScaler(editor.track.notesPerMeasure, editor.track.numBeats, editor.track.noteValue); // fill proportionally

    // fill in the arrays from the clickable UI
    for (var i = 0; i < editor.track.notesPerMeasure; i++) {
        var array_index = (i) * scaler;

        // only grab the stickings if they are visible
        if (isStickingsVisible())
            Sticking_Array[array_index] = get_sticking_state(i + startIndexForClickableUI, "ABC");

        HH_Array[array_index] = get_hh_state(i + startIndexForClickableUI, "ABC");

        if (isTomsVisible()) {
            Toms_Array[0][array_index] = get_tom_state(i + startIndexForClickableUI, 1, "ABC");
            Toms_Array[3][array_index] = get_tom_state(i + startIndexForClickableUI, 4, "ABC");
        }

        Snare_Array[array_index] = get_snare_state(i + startIndexForClickableUI, "ABC");

        Kick_Array[array_index] = get_kick_state(i + startIndexForClickableUI, "ABC");
    }

    var num_notes = Snare_Array.length;
    return num_notes;
}


// creates a grooveData class from the clickable UI elements of the page
//
grooveDataFromClickableUI = function () {
    var track = new editor.track.trackNew();

    track.title = document.getElementById("tuneTitle").value;
    track.author = document.getElementById("tuneAuthor").value;
    track.comments = document.getElementById("tuneComments").value;
    options.showLegend = document.getElementById("showLegend").checked;
    track.kickStemsUp = true;

    for (var i = 0; i < editor.track.numberOfMeasures; i++) {
        var total_notes = editor.track.notesPerMeasure * editor.track.numberOfMeasures;
        track.sticking_array = [];
        track.hh_array = [];
        track.snare_array = [];
        track.kick_array = [];
        track.toms_array = [[], [], [], []];

        // query the clickable UI and generate a arrays representing the notes of all measures
        for (var i = 0; i < total_notes; i++) {

            // only grab the stickings if they are visible
            if (isStickingsVisible())
                track.sticking_array.push(get_sticking_state(i, "ABC"));

            track.hh_array.push(get_hh_state(i, "ABC"));
            track.snare_array.push(get_snare_state(i, "ABC"));
            track.kick_array.push(get_kick_state(i, "ABC"));

            if (isTomsVisible()) {
                track.toms_array[0].push(get_tom_state(i, 1, "ABC"));
                track.toms_array[3].push(get_tom_state(i, 4, "ABC"));
            } else {
                track.toms_array[0].push(false);
                track.toms_array[3].push(false);
            }
        }
    }

    return track;
};


// takes a string of notes encoded in a serialized string and sets the notes on or off
// uses drum tab format adapted from wikipedia: http://en.wikipedia.org/wiki/Drum_tablature
//
//
//  HiHat support:
//      x: normal
//      X: accent
//      o: open
//		+: close
//      c: crash
//      r: ride
//      b: ride bell
//      m: cow bell (more)
//      s: stacker
//      -: off
//
//   Snare support:
//      o: normal
//      O: accent
//      f: flam
//      d: drag
//      g: ghost
//      x: cross stick
//      -: off
//
//   Kick support:
//      o: normal
//      x: hi hat splash with foot
//      X: kick & hi hat splash with foot simultaneously
//
//  Note that "|" and " " will be skipped so that standard drum tabs can be applied
//  Example:
//     H=|x---x---x---x---|x---x---x---x---|x---x---x---x---|
// or  H=x-x-x-x-x-x-x-x-x-x-x-x-
//     S=|----o-------o---|----o-------o---|----o-------o---|
// or  S=--o---o---o---o---o---o-
//     B=|o-------o-------|o-------o-o-----|o-----o-o-------|
// or  B=o---o---o----oo-o--oo---|
//
function setNotesFromURLData(drumType, noteString, numberOfMeasures) {
    var setFunction;

    if (drumType == "Stickings") {
        setFunction = set_sticking_state;
    } else if (drumType == "H") {
        setFunction = set_hh_state;
    } else if (drumType == "T1") {
        setFunction = set_tom1_state;
    } else if (drumType == "T4") {
        setFunction = set_tom4_state;
    } else if (drumType == "S") {
        setFunction = set_snare_state;
    } else if (drumType == "K") {
        setFunction = set_kick_state;
    }

    // decode the %7C url encoding types
    noteString = decodeURIComponent(noteString);

    // ignore ":" and "|" by removing them
    var notes = noteString.replace(/:|\|/g, '');

    // multiple measures of "how_many_notes"
    var notesOnScreen = editor.track.notesPerMeasure * numberOfMeasures;

    var noteStringScaler = 1;
    var displayScaler = 1;
    if (notes.length > notesOnScreen && notes.length / notesOnScreen >= 2) {
        // if we encounter a 16th note groove for an 8th note board, let's scale it	down
        noteStringScaler = Math.ceil(notes.length / notesOnScreen);
    } else if (notes.length < notesOnScreen && notesOnScreen / notes.length >= 2) {
        // if we encounter a 8th note groove for an 16th note board, let's scale it up
        displayScaler = Math.ceil(notesOnScreen / notes.length);
    }

    //  DisplayIndex is the index into the notes on the HTML page  starts at 1/32\n%%flatbeams
    var displayIndex = 0;
    var topDisplay = editor.track.notesPerMeasure * editor.track.numberOfMeasures;
    for (var i = 0; i < notes.length && displayIndex < topDisplay; i += noteStringScaler, displayIndex += displayScaler) {

        switch (notes[i]) {
            case "$":
                setFunction(displayIndex, "and", false);
                break;
            case "1":
                setFunction(displayIndex, "1", false);
                break;
            case "a":
                setFunction(displayIndex, "a", false);
                break;
            case "B":
                if (drumType == "Stickings")
                    setFunction(displayIndex, "both", false);
                break;
            case "b":
                if (drumType == "H")
                    setFunction(displayIndex, "ride_bell", false);
                else if (drumType == "S")
                    setFunction(displayIndex, "buzz", false);
                break;
            case "c":
                if (drumType == "Stickings")
                    setFunction(displayIndex, "count", false);
                else
                    setFunction(displayIndex, "crash", false);
                break;
            case "e":
                setFunction(displayIndex, "e", false);
                break;
            case "g":
                setFunction(displayIndex, "ghost", false);
                break;
            case "f":
                setFunction(displayIndex, "flam", false);
                break;
            case "d":
                setFunction(displayIndex, "drag", false);
                break;
            case "l":
            case "L":
                if (drumType == "Stickings")
                    setFunction(displayIndex, "left", false);
                break;
            case "m":
                if (drumType == "H")
                    setFunction(displayIndex, "cow_bell", false);
                break;
            case "n":
                if (drumType == "H")
                    setFunction(displayIndex, "metronome_normal", false);
                break;
            case "N":
                if (drumType == "H")
                    setFunction(displayIndex, "metronome_accent", false);
                break;
            case "O":
                setFunction(displayIndex, "accent", false);
                break;
            case "o":
                if (drumType == "H")
                    setFunction(displayIndex, "open", false);
                else
                    setFunction(displayIndex, "normal", false);
                break;
            case "r":
            case "R":
                if (drumType == "H")
                    setFunction(displayIndex, "ride", false);
                else if (drumType == "Stickings")
                    setFunction(displayIndex, "right", false);
                break;
            case "s":
                setFunction(displayIndex, "stacker", false);
                break;
            case "x":
                if (drumType == "S")
                    setFunction(displayIndex, "xstick", false);
                else if (drumType == "K")
                    setFunction(displayIndex, "splash", false);
                else
                    setFunction(displayIndex, "normal", false);
                break;
            case "X":
                if (drumType == "K")
                    setFunction(displayIndex, "kick_and_splash", false);
                else
                    setFunction(displayIndex, "accent", false);
                break;
            case "+":
                setFunction(displayIndex, "close", false);
                break;
            case "-":
                setFunction(displayIndex, "off", false);
                break;
            default:
                console.log("Bad note in setNotesFromURLData: " + notes[i]);
                break;
        }
    }
}



function setNotesFromABCArray(drumType, abcArray, numberOfMeasures) {
    var setFunction;

    // multiple measures of "how_many_notes"
    var notesOnScreen = editor.track.notesPerMeasure * numberOfMeasures;

    var noteStringScaler = 1;
    var displayScaler = 1;
    if (abcArray.length > notesOnScreen && abcArray.length / notesOnScreen >= 2) {
        // if we encounter a 16th note groove for an 8th note board, let's scale it	down
        noteStringScaler = Math.ceil(abcArray.length / notesOnScreen);
    } else if (abcArray.length < notesOnScreen && notesOnScreen / abcArray.length >= 2) {
        // if we encounter a 8th note groove for an 16th note board, let's scale it up
        displayScaler = Math.ceil(notesOnScreen / abcArray.length);
    }

    if (drumType == "Stickings") {
        setFunction = set_sticking_state;
    } else if (drumType == "H") {
        setFunction = set_hh_state;
    } else if (drumType == "T1") {
        setFunction = set_tom1_state;
    } else if (drumType == "T4") {
        setFunction = set_tom4_state;
    } else if (drumType == "S") {
        setFunction = set_snare_state;
    } else if (drumType == "K") {
        setFunction = set_kick_state;
    }

    //  DisplayIndex is the index into the notes on the HTML page  starts at 1/32\n%%flatbeams
    var displayIndex = 0;
    var topDisplay = editor.track.notesPerMeasure * editor.track.numberOfMeasures;
    for (var i = 0; i < abcArray.length && displayIndex < topDisplay; i += noteStringScaler, displayIndex += displayScaler) {

        switch (abcArray[i]) {
            case constant_ABC_STICK_R:
                setFunction(displayIndex, "right", false);
                break;
            case constant_ABC_STICK_L:
                setFunction(displayIndex, "left", false);
                break;
            case constant_ABC_STICK_BOTH:
                setFunction(displayIndex, "both", false);
                break;
            case constant_ABC_STICK_COUNT:
                setFunction(displayIndex, "count", false);
                break;
            case constant_ABC_STICK_OFF:
                setFunction(displayIndex, "off", false);
                break;
            case constant_ABC_HH_Ride:
                setFunction(displayIndex, "ride", false);
                break;
            case constant_ABC_HH_Ride_Bell:
                setFunction(displayIndex, "ride_bell", false);
                break;
            case constant_ABC_HH_Cow_Bell:
                setFunction(displayIndex, "cow_bell", false);
                break;
            case constant_ABC_HH_Crash:
                setFunction(displayIndex, "crash", false);
                break;
            case constant_ABC_HH_Stacker:
                setFunction(displayIndex, "stacker", false);
                break;
            case constant_ABC_HH_Metronome_Normal:
                setFunction(displayIndex, "metronome_normal", false);
                break;
            case constant_ABC_HH_Metronome_Accent:
                setFunction(displayIndex, "metronome_accent", false);
                break;
            case constant_ABC_HH_Open:
                setFunction(displayIndex, "open", false);
                break;
            case constant_ABC_HH_Close:
                setFunction(displayIndex, "close", false);
                break;
            case constant_ABC_HH_Accent:
                setFunction(displayIndex, "accent", false);
                break;
            case constant_ABC_HH_Normal:
                setFunction(displayIndex, "normal", false);
                break;
            case constant_ABC_T1_Normal:
                setFunction(displayIndex, "normal", false);
                break;
            case constant_ABC_T4_Normal:
                setFunction(displayIndex, "normal", false);
                break;
            case constant_ABC_SN_Ghost:
                setFunction(displayIndex, "ghost", false);
                break;
            case constant_ABC_SN_Accent:
                setFunction(displayIndex, "accent", false);
                break;
            case constant_ABC_SN_Normal:
                setFunction(displayIndex, "normal", false);
                break;
            case constant_ABC_SN_Flam:
                setFunction(displayIndex, "flam", false);
                break;
            case constant_ABC_SN_Drag:
                setFunction(displayIndex, "drag", false);
                break;
            case constant_ABC_SN_XStick:
                setFunction(displayIndex, "xstick", false);
                break;
            case constant_ABC_SN_Buzz:
                setFunction(displayIndex, "buzz", false);
                break;
            case constant_ABC_KI_SandK:
                setFunction(displayIndex, "kick_and_splash", false);
                break;
            case constant_ABC_KI_Splash:
                setFunction(displayIndex, "splash", false);
                break;
            case constant_ABC_KI_Normal:
                setFunction(displayIndex, "normal", false);
                break;
            case false:
                setFunction(displayIndex, "off", false);
                break;
            default:
                console.log("Bad note in setNotesFromABCArray: " + abcArray[i]);
                break;
        }
    }
}