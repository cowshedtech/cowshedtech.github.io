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
        if (options.isStickingVisible())
            Sticking_Array[array_index] = editor.track.getStickingState(i + startIndexForClickableUI, "ABC");

        HH_Array[array_index] = editor.track.getHighHatState(i + startIndexForClickableUI, "ABC");

        if (options.areTomsVisible()) {
            Toms_Array[0][array_index] = editor.track.getTomState(1, i + startIndexForClickableUI, "ABC");
            Toms_Array[3][array_index] = editor.track.getTomState(4, i + startIndexForClickableUI, "ABC");
        }

        Snare_Array[array_index] = editor.track.getSnareState(i + startIndexForClickableUI, "ABC");

        Kick_Array[array_index] = editor.track.getKickState(i + startIndexForClickableUI, "ABC");
    }

    var num_notes = Snare_Array.length;
    return num_notes;
}


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
        setFunction = editor.track.setStickingStateNoNotify;
    } else if (drumType == "H") {
        setFunction = editor.track.setHighHatStateNoNotify;
    } else if (drumType == "T1") {
        setFunction = editor.track.setTom1StateNoNotify;
    } else if (drumType == "T4") {
        setFunction = editor.track.setTom4StateNoNotify;
    } else if (drumType == "S") {
        setFunction = editor.track.setSnareStateNoNotify;
    } else if (drumType == "K") {
        setFunction = editor.track.setKickStateNoNotify;
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
        setFunction = editor.track.setStickingStateNoNotify;
    } else if (drumType == "H") {
        setFunction = editor.track.setHighHatStateNoNotify;
    } else if (drumType == "T1") {
        setFunction = editor.track.setTom1StateNoNotify;
    } else if (drumType == "T4") {
        setFunction = editor.track.setTom4StateNoNotify;
    } else if (drumType == "S") {
        setFunction = editor.track.setSnareStateNoNotify;
    } else if (drumType == "K") {
        setFunction = editor.track.setKickStateNoNotify;
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