// Javascript for the Groove Scribe HTML application
// Groove Scribe is for drummers and helps create sheet music with an easy to use WYSIWYG groove editor.
//
// Functions for handling a staff in the clickable editor


/**
 * Enables or disables time division selections based on the current time signature.
 * Handles compatibility between time signatures and different note divisions:
 * - Disables 8th notes for incompatible time signatures
 * - Disables triplets for time signatures not in x/4 time
 * 
 * @requires Functions:
 * - addOrRemoveKeywordFromClassById - Toggles CSS classes on elements
 * @requires DOM elements:
 * - #subdivision_8ths - 8th note subdivision selector
 * - #subdivision_12ths - Triplet quarter note subdivision selector
 * - #subdivision_24ths - Triplet 8th note subdivision selector
 * - #subdivision_48ths - Triplet 16th note subdivision selector
 * @requires editor.track - Track object containing:
 * - numBeats - Number of beats per measure
 * - noteValue - Note value that gets one beat
 */
function setTimeDivisionSelectionOnOrOff() {

    // check for incompatible odd time signature division  9/16 and 1/8 notes for instance
    if ((8 * editor.track.numBeats / editor.track.noteValue) % 1 != 0) {
        addOrRemoveKeywordFromClassById("subdivision_8ths", "disabled", true);
    } else {
        addOrRemoveKeywordFromClassById("subdivision_8ths", "disabled", false);
    }

    if (editor.track.noteValue != 4) {
        // triplets are too complicated right now outside of x/4 time.
        // disable them

        addOrRemoveKeywordFromClassById("subdivision_12ths", "disabled", true);
        addOrRemoveKeywordFromClassById("subdivision_24ths", "disabled", true);
        addOrRemoveKeywordFromClassById("subdivision_48ths", "disabled", true);

    } else {
        addOrRemoveKeywordFromClassById("subdivision_12ths", "disabled", false);
        addOrRemoveKeywordFromClassById("subdivision_24ths", "disabled", false);
        addOrRemoveKeywordFromClassById("subdivision_48ths", "disabled", false);

    }
};