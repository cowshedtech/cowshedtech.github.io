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