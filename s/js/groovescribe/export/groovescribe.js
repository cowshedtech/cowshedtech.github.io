// get a really long URL that encodes all of the notes and the rest of the state of the page.
// this will allow us to bookmark or reference a groove and handle undo/redo.
//

function getGSUrlStringFromGrooveData(myGrooveData, url_destination) {

    var fullURL = "https://www.mikeslessons.com/groove/";

    if (!url_destination) {
        // then assume it is the groove writer display.  Do nothing
    } else if (url_destination == "display") {
        // asking for the "groove_display" page
        if (fullURL.includes('index.html'))
            fullURL = fullURL.replace('index.html', 'GrooveEmbed.html');
        else if (fullURL.includes('/gscribe'))
            fullURL = fullURL.replace('/gscribe', '/groove/GrooveEmbed.html');
        else
            fullURL += 'GrooveEmbed.html';
    } else if (url_destination == "fullGrooveScribe") {
        // asking for the full GrooveScribe link
        fullURL = 'https://www.mikeslessons.com/gscribe';
    }

    fullURL += '?';

    if (options.debugMode)
        fullURL += "Debug=1&";

    if (options.viewMode)
        fullURL += "Mode=view&";

    if (options.grooveDBAuthoring)
        fullURL += "GDB_Author=1&";

    fullURL += 'TimeSig=' + myGrooveData.numBeats + '/' + myGrooveData.noteValue;

    // # of notes
    fullURL += "&Div=" + myGrooveData.timeDivision;

    if (myGrooveData.title !== "")
        fullURL += "&Title=" + encodeURIComponent(myGrooveData.title);

    if (myGrooveData.author !== "")
        fullURL += "&Author=" + encodeURIComponent(myGrooveData.author);

    if (myGrooveData.comments !== "")
        fullURL += "&Comments=" + encodeURIComponent(myGrooveData.comments);

    fullURL += "&Tempo=" + midiPlayer.getTempo()

    if (midiPlayer.getSwing() > 0)
        fullURL += "&Swing=" + midiPlayer.getSwing();

    // # of measures
    fullURL += "&Measures=" + myGrooveData.numberOfMeasures;

    // # metronome setting
    if (metronome.frequency !== 0) {
        fullURL += "&MetronomeFreq=" + metronome.frequency;
    }

    // notes
    var total_notes = myGrooveData.notesPerMeasure * myGrooveData.numberOfMeasures;
    var HH = "&H=|" + tabLineFromAbcNoteArray('H', myGrooveData.hh_array, true, true, total_notes, myGrooveData.notesPerMeasure);
    var Snare = "&S=|" + tabLineFromAbcNoteArray('S', myGrooveData.snare_array, true, true, total_notes, myGrooveData.notesPerMeasure);
    var Kick = "&K=|" + tabLineFromAbcNoteArray('K', myGrooveData.kick_array, true, true, total_notes, myGrooveData.notesPerMeasure);

    fullURL += HH + Snare + Kick;

    // only add if we need them.  // they are long and ugly. :)
    if (options.tomsVisible) {
        var Tom1 = "&T1=|" + tabLineFromAbcNoteArray('T1', myGrooveData.toms_array[0], true, true, total_notes, myGrooveData.notesPerMeasure);
        var Tom4 = "&T4=|" + tabLineFromAbcNoteArray('T4', myGrooveData.toms_array[3], true, true, total_notes, myGrooveData.notesPerMeasure);
        fullURL += Tom1 + Tom4;
    }

    // only add if we need them.  // they are long and ugly. :)
    if (options.showStickings) {
        var Stickings = "&Stickings=|" + tabLineFromAbcNoteArray('stickings', myGrooveData.sticking_array, true, true, total_notes, myGrooveData.notesPerMeasure);
        fullURL += Stickings;
    }

    return fullURL;
}


// get a really long URL that encodes all of the notes and the rest of the state of the page.
// this will allow us to bookmark or reference a groove and handle undo/redo.
//
function get_GSURLForPage(url_destination) {
    var myGrooveData = editor.grooveDataFromClickableUI()
    return getGSUrlStringFromGrooveData(myGrooveData, url_destination)
}