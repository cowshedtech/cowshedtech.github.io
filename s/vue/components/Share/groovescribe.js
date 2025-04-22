// get a really long URL that encodes all of the notes and the rest of the state of the page.
// this will allow us to bookmark or reference a groove and handle undo/redo.
//

function getGSUrlStringFromGrooveData(track, url_destination) {

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

    fullURL += 'TimeSig=' + track.numBeats + '/' + track.noteValue;

    // # of notes
    fullURL += "&Div=" + track.timeDivision;

    if (track.getTitle() !== "")
        fullURL += "&Title=" + encodeURIComponent(track.getTitle());

    if (track.getAuthor() !== "")
        fullURL += "&Author=" + encodeURIComponent(track.getAuthor());

    if (track.getComments() !== "")
        fullURL += "&Comments=" + encodeURIComponent(track.getComments());

    fullURL += "&Tempo=" + midiPlayer.getTempo()

    if (midiPlayer.getSwing() > 0)
        fullURL += "&Swing=" + midiPlayer.getSwing();

    // # of measures
    fullURL += "&Measures=" + track.numberOfMeasures;

    // # metronome setting
    if (metronome.getFrequency() !== 0) {
        fullURL += "&MetronomeFreq=" + metronome.getFrequency();
    }

    // notes
    var total_notes = track.notesPerMeasure * track.numberOfMeasures;
    var HH = "&H=|" + tabLineFromAbcNoteArray('H', track.hh_array, true, true, total_notes, track.notesPerMeasure);
    var Snare = "&S=|" + tabLineFromAbcNoteArray('S', track.snare_array, true, true, total_notes, track.notesPerMeasure);
    var Kick = "&K=|" + tabLineFromAbcNoteArray('K', track.kick_array, true, true, total_notes, track.notesPerMeasure);

    fullURL += HH + Snare + Kick;

    // only add if we need them.  // they are long and ugly. :)
    if (options.areTomsVisible()) {
        var Tom1 = "&T1=|" + tabLineFromAbcNoteArray('T1', track.toms_array[0], true, true, total_notes, track.notesPerMeasure);
        var Tom4 = "&T4=|" + tabLineFromAbcNoteArray('T4', track.toms_array[3], true, true, total_notes, track.notesPerMeasure);
        fullURL += Tom1 + Tom4;
    }

    // only add if we need them.  // they are long and ugly. :)
    if (options.isStickingVisible()) {
        var Stickings = "&Stickings=|" + tabLineFromAbcNoteArray('stickings', track.sticking_array, true, true, total_notes, track.notesPerMeasure);
        fullURL += Stickings;
    }

    return fullURL;
}


// get a really long URL that encodes all of the notes and the rest of the state of the page.
// this will allow us to bookmark or reference a groove and handle undo/redo.
//
function get_GSURLForPage(url_destination) {
    return getGSUrlStringFromGrooveData(editor.track, url_destination)
}