// Javascript for the Groove Scribe HTML application
// Groove Scribe is for drummers and helps create sheet music with an easy to use WYSIWYG groove editor.
//
// Functions for handling a staff in the clickable editor







/**
 * Adds a new empty measure after the specified measure.
 * Collects notes before and after the insertion point and adds an empty measure.
 * 
 * @param {number} measureNum - Index of the measure after which to add (1-based)
 * @requires Functions:
 * - get_sticking_state - Gets sticking notation for a note
 * - editor.track.getHighHatState - Gets hi-hat state for a note
 * - editor.track.getTomState - Gets tom state for a note
 * - editor.track.getSnareState - Gets snare state for a note
 * - editor.track.getKickState - Gets kick state for a note
 * - shiftRepeatedMeasuresAfterIndex - Updates repeat counts after insertion
 * @requires editor.track - Track object containing score state
 */
function addMeasureMiddleButtonClick(measureNum) {
    var uiStickings = "";
    var uiHH = "";
    var uiTom1 = "";
    var uiTom4 = "";
    var uiSnare = "";
    var uiKick = "";
    var i;

    // get the encoded notes out of the UI from before measure we are going to repeat
    var loop1End = (measureNum) * editor.track.notesPerMeasure
    for (i = 0; i < loop1End; i++) {
        uiStickings += editor.track.getStickingState(i, "URL");
        uiHH += editor.track.getHighHatState(i, "URL");
        uiTom1 += editor.track.getTomState(1, i, "URL");
        uiTom4 += editor.track.getTomState(4, i, "URL");
        uiSnare += editor.track.getSnareState(i, "URL");
        uiKick += editor.track.getKickState(i, "URL");
    }

    // introduce our empty measure
    for (i = 0; i < editor.track.notesPerMeasure; i++) {
        uiStickings += "-";
        uiHH += "-";
        uiTom1 += "-";
        uiTom4 += "-";
        uiSnare += "-";
        uiKick += "-";
    }

    // get the encoded notes out of the UI for measures after measure to be repeated
    var loop3Start = measureNum * editor.track.notesPerMeasure
    var loop3End = editor.track.notesPerMeasure * editor.track.numberOfMeasures;
    for (i = loop3Start; i < loop3End; i++) {
        uiStickings += editor.track.getStickingState(i, "URL");
        uiHH += editor.track.getHighHatState(i, "URL");
        uiTom1 += editor.track.getTomState(1, i, "URL");
        uiTom4 += editor.track.getTomState(4, i, "URL");
        uiSnare += editor.track.getSnareState(i, "URL");
        uiKick += editor.track.getKickState(i, "URL");
    }

    editor.track.numberOfMeasures++;

    // We need to move all the repeate measures after this measure up 1 
    shiftRepeatedMeasuresAfterIndex(measureNum - 1, 1);

    editor.expandAuthoringViewWhenNecessary(editor.track.notesPerMeasure, editor.track.numberOfMeasures);

    editor.changeDivisionWithNotes(editor.track.timeDivision, uiStickings, uiHH, uiTom1, uiTom4, uiSnare, uiKick);

    // reference the button and scroll it into view
    var add_measure_button = document.getElementById("addMeasureButton");
    if (add_measure_button)
        add_measure_button.scrollIntoView({ block: "start", behavior: "smooth" });

    sheetMusic.updateFromTrack(editor.track);
};



/**
 * Shifts the repeated measures map entries after a given index.
 * Used when adding or removing measures to maintain correct repeat counts.
 * 
 * @param {number} measureIndex - Index of the measure to start shifting from (0-based)
 * @param {number} direction - Direction to shift (1 for right, -1 for left)
 * @requires editor.track.repeatedMeasures - Map containing measure repeat counts
 */
function shiftRepeatedMeasuresAfterIndex(measureIndex, direction) {
    // Convert Map to array of entries and sort by measure index
    const sortedEntries = [...editor.track.repeatedMeasures.entries()].sort((a, b) => a[0] - b[0]);
    
    // Process in reverse order to avoid overwriting
    for (let i = sortedEntries.length - 1; i >= 0; i--) {
        const [key, value] = sortedEntries[i];
        if (key > measureIndex) {
            editor.track.repeatedMeasures.set(key + direction, value);
            editor.track.repeatedMeasures.delete(key);
        }
    }
}