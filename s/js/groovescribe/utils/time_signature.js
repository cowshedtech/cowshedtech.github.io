// Javascript for the Groove Scribe HTML application

// parse a string like "4/4", "5/4" or "2/4"
function parseTimeSigString(timeSigString) {
    var split_arr = timeSigString.split("/");

    if(split_arr.length != 2)
        return [4, 4];

    var timeSigTop = parseInt(split_arr[0], 10);
    var timeSigBottom = parseInt(split_arr[1], 10);

    if(timeSigTop < 1 || timeSigTop > 32)
        timeSigTop = 4;

    // only valid if 2,4,8, or 16
    if(timeSigBottom != 2 && timeSigBottom != 4 && timeSigBottom != 8 && timeSigBottom != 16)
        timeSigBottom = 4;

    return [timeSigTop, timeSigBottom];
};


// the notes per measure is calculated from the note division and the time signature
// in 4/4 time the division is the division (as well as any time signature x/x)
// in 4/8 the num notes is half as many, etc
function calc_notes_per_measure(division, time_sig_top, time_sig_bottom) {

    var numNotes = (division/time_sig_bottom) * time_sig_top;

    return numNotes;
};


// figure it out from the division  Division is number of notes per measure 4, 6, 8, 12, 16, 24, 32, etc...
// Triplets only support 4/4 and 2/4 time signatures for now
 function isTripletDivision(division) {
    if(division % 12 === 0)  // we only support 12 & 24 & 48  1/8th, 1/16, & 1/32 note triplets
        return true;

    return false;
};


// figure out if it is triplets from the number of notes (implied division)
function isTripletDivisionFromNotesPerMeasure(notesPerMeasure, timeSigTop, timeSigBottom) {
    var division = (notesPerMeasure/timeSigTop) * timeSigBottom;

    return isTripletDivision(division);

};

// the note grouping size is how groups of notes within a measure group
// for 8ths and 16th we group with 4
// for triplets we group with 3
// This function is for laying out the HTML
// see abc_gen_note_grouping_size for the sheet music layout grouping size
function noteGroupingSize(notes_per_measure, timeSigTop, timeSigBottom) {
    var note_grouping;
    var usingTriplets = isTripletDivisionFromNotesPerMeasure(notes_per_measure, timeSigTop, timeSigBottom);

    if(usingTriplets) {
        // triplets  ( we only support 2/4 here )
        if(timeSigTop != 2 && timeSigBottom != 4)
            console.log("Triplets are only supported in 2/4 and 4/4 time");
        note_grouping = notes_per_measure / (timeSigTop * (4/timeSigBottom));
    } else if(timeSigTop == 3) {
        // 3/4, 3/8, 3/16
        // 3 groups
        // not triplets
        note_grouping =  (notes_per_measure) / 3
    } else if(timeSigTop % 6 == 0 && timeSigBottom % 8 == 0) {
        // 6/8, 12/8
        // 2 groups in 6/8 rather than 3 groups
        // 4 groups in 12/8
        // not triplets
        note_grouping = notes_per_measure / (2 * timeSigTop/6)
    } else {
        // figure it out from the time signature
        // not triplets
        note_grouping = (notes_per_measure / timeSigTop) * (timeSigBottom/4);
    }
    return note_grouping;
};


function notesPerMeasureInFullSizeArray(is_triplet_division, timeSigTop, timeSigBottom) {
    // a full measure will be defined as 8 * timeSigTop.   (4 = 32, 5 = 40, 6 = 48, etc.)
    // that implies 32nd notes in quarter note beats
    // TODO: should we support triplets here?
    if (is_triplet_division)
        return 48 * (timeSigTop/timeSigBottom);
    else
        return 32 * (timeSigTop/timeSigBottom);
}

// since note values are 16ths or 12ths this corrects for that by multiplying note values
// timeSigTop is the top number in a time signature (4/4, 5/4, 6/8, 7/4, etc)
function getNoteScaler(notes_per_measure, timeSigTop, timeSigBottom) {
    var scaler;

    if (!timeSigTop || timeSigTop < 1 || timeSigTop > 36) {
        console.log("Error in getNoteScaler, out of range: " + timeSigTop);
        scaler = 1;
    } else {
        if (isTripletDivisionFromNotesPerMeasure(notes_per_measure, timeSigTop, timeSigBottom))
            scaler = Math.ceil(notesPerMeasureInFullSizeArray(true, timeSigTop, timeSigBottom) / notes_per_measure);
        else
            scaler = Math.ceil(notesPerMeasureInFullSizeArray(false, timeSigTop, timeSigBottom) / notes_per_measure);
    }

    return scaler;
};

// take any size array and make it larger by padding it with rests in the spaces between
// For triplets, expands to 48 notes per measure
// For non Triplets, expands to 32 notes per measure
function scaleNoteArrayToFullSize(note_array, num_measures, notes_per_measure, timeSigTop, timeSigBottom) {
    var scaler = getNoteScaler(notes_per_measure, timeSigTop, timeSigBottom); // fill proportionally
    var retArray = [];
    var isTriplets = isTripletDivisionFromNotesPerMeasure(notes_per_measure, timeSigTop, timeSigBottom);
    var i;

    if (scaler == 1)
        return note_array; // no need to expand

    // preset to false (rest) all entries in the expanded array
    for (i = 0; i < num_measures * notes_per_measure * scaler; i++)
        retArray[i] = false;

    // sparsely fill in the return array with data from passed in array
    for (i = 0; i < num_measures * notes_per_measure; i++) {
        var ret_array_index = (i) * scaler;

        retArray[ret_array_index] = note_array[i];
    }

    return retArray;
}

// count the number of note positions that are not rests in all the arrays
// FFFxFFFxF  would be 2
function count_active_notes_in_arrays(array_of_arrays, start_index, how_far_to_measure) {
    var num_active_notes = 0;

    for (var i = start_index; i < start_index + how_far_to_measure; i++) {
        for(var which_array = 0; which_array < array_of_arrays.length; which_array++) {
            if (array_of_arrays[which_array][i] !== false) {
                num_active_notes++;
                which_array = array_of_arrays.length;  // exit this inner for loop immediately
            }
        }
    }

    return num_active_notes;
}