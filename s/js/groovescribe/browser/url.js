// get a really long URL that encodes all of the notes and the rest of the state of the page.
// this will allow us to bookmark or reference a groove and handle undo/redo.
//

 function getUrlStringFromGrooveData(track, url_destination) {

    var fullURL = window.location.protocol + "//" + window.location.host + window.location.pathname;

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

    if (track.title !== "")
        fullURL += "&Title=" + encodeURIComponent(track.title);

    if (track.author !== "")
        fullURL += "&Author=" + encodeURIComponent(track.author);

    if (track.comments !== "")
        fullURL += "&Comments=" + encodeURIComponent(track.comments);

    fullURL += "&Tempo=" + midiPlayer.tempo;

    if (midiPlayer.getSwing() > 0)
        fullURL += "&Swing=" + midiPlayer.getSwing();

    if (!options.highlightOn)
        fullURL += "&Highlight=OFF";

    // # of measures
    fullURL += "&Measures=" + track.numberOfMeasures;

    // if (track.repeatedMeasures.size > 0) {
    // 	let content = "";
    // 	for (let measure of track.repeatedMeasures.keys()) {
    // 		if (content.length > 0) content += ","
    // 		content += measure + 'x' + track.repeatedMeasures.get(measure)
    // 	}
    // 	fullURL += "&rMeasures=" + content;
    // }
    if (track.repeatedMeasures.size > 0) {
        const content = Array.from(track.repeatedMeasures.entries())
            .map(([key, value]) => `${key}x${value}`)
            .join(",");
        fullURL += "&rMeasures=" + content;
    }

    // # metronome setting
    if (metronome.frequency !== 0) {
        fullURL += "&MetronomeFreq=" + metronome.frequency;
    }

    // notes
    var total_notes = track.notesPerMeasure * track.numberOfMeasures;
    var HH = "&H=|" + tabLineFromAbcNoteArray('H', track.hh_array, true, true, total_notes, track.notesPerMeasure);
    var Snare = "&S=|" + tabLineFromAbcNoteArray('S', track.snare_array, true, true, total_notes, track.notesPerMeasure);
    var Kick = "&K=|" + tabLineFromAbcNoteArray('K', track.kick_array, true, true, total_notes, track.notesPerMeasure);

    fullURL += HH + Snare + Kick;

    // only add if we need them.  // they are long and ugly. :)
    if (options.tomsVisible) {
        var Tom1 = "&T1=|" + tabLineFromAbcNoteArray('T1', track.toms_array[0], true, true, total_notes, track.notesPerMeasure);
        var Tom4 = "&T4=|" + tabLineFromAbcNoteArray('T4', track.toms_array[3], true, true, total_notes, track.notesPerMeasure);
        fullURL += Tom1 + Tom4;
    }

    // only add if we need them.  // they are long and ugly. :)
    if (options.showStickings) {
        var Stickings = "&Stickings=|" + tabLineFromAbcNoteArray('stickings', track.sticking_array, true, true, total_notes, track.notesPerMeasure);
        fullURL += Stickings;
    }

    return fullURL;
}

function getTrackFromUrlString(encodedURLData, track, debugMode) {
    var Stickings_string;
    var HH_string;
    var Snare_string;
    var Kick_string;
    var stickings_set_from_URL = false;
    var i;

    options.debugMode = parseInt(getQueryVariableFromString("Debug", debugMode, encodedURLData), 10);

    var timeSigArray = parseTimeSigString(getQueryVariableFromString("TimeSig", "4/4", encodedURLData));
    track.numBeats = timeSigArray[0];
    track.noteValue = timeSigArray[1];

    track.timeDivision = parseInt(getQueryVariableFromString("Div", 16, encodedURLData), 10);
    track.notesPerMeasure = calc_notes_per_measure(track.timeDivision, track.numBeats, track.noteValue);

    metronome.frequency = parseInt(getQueryVariableFromString("MetronomeFreq", "0", encodedURLData), 10);

    track.numberOfMeasures = parseInt(getQueryVariableFromString("measures", 1, encodedURLData), 10);
    if (track.numberOfMeasures < 1 || isNaN(track.numberOfMeasures))
        track.numberOfMeasures = 1;
    else if (track.numberOfMeasures > constant_MAX_MEASURES)
        track.numberOfMeasures = constant_MAX_MEASURES;

    let repeatedMeasures = getQueryVariableFromString("rMeasures", 1, encodedURLData);
    if (repeatedMeasures && repeatedMeasures.length > 0) {
        repeatedMeasures.split(",").forEach(element => {
        let [key, value] = element.split('x');
            track.repeatedMeasures.set(Number(key), Number(value));
        });
    }

    let highlight = getQueryVariableFromString("Highlight", "ON", encodedURLData);
    if (highlight && highlight.length > 0) {
        if (highlight.toUpperCase() == "OFF") {
            options.highlightOn = false
        } else {
            options.highlightOn = true
        }			
    }
    
    Stickings_string = getQueryVariableFromString("Stickings", false, encodedURLData);
    if (!Stickings_string) {
        Stickings_string = GetDefaultStickingsGroove(track.notesPerMeasure, track.numBeats, track.noteValue, track.numberOfMeasures);
        options.showStickings = false;
    } else {
        options.showStickings = true;
    }

    HH_string = getQueryVariableFromString("H", false, encodedURLData);
    if (!HH_string) {
        getQueryVariableFromString("HH", false, encodedURLData);
        if (!HH_string) {
            HH_string = GetDefaultHHGroove(track.notesPerMeasure, track.numBeats, track.noteValue, track.numberOfMeasures);
        }
    }

    Snare_string = getQueryVariableFromString("S", false, encodedURLData);
    if (!Snare_string) {
        Snare_string = GetDefaultSnareGroove(track.notesPerMeasure, track.numBeats, track.noteValue, track.numberOfMeasures);
    }

    Kick_string = getQueryVariableFromString("K", false, encodedURLData);
    if (!Kick_string) {
        getQueryVariableFromString("B", false, encodedURLData);
        if (!Kick_string) {
            Kick_string = GetDefaultKickGroove(track.notesPerMeasure, track.numBeats, track.noteValue, track.numberOfMeasures);
        }
    }

    // Get the Toms
    for (i = 0; i < 4; i++) {
        // toms are named T1, T2, T3, T4
        var Tom_string = getQueryVariableFromString("T" + (i + 1), false, encodedURLData);
        if (!Tom_string) {
            Tom_string = GetDefaultTomGroove(track.notesPerMeasure, track.numBeats, track.noteValue, track.numberOfMeasures);
        } else {
            options.tomsVisible = true;
        }

        /// the toms array index starts at zero (0) the first one is T1
        track.toms_array[i] = noteArraysFromURLData("T" + (i + 1), Tom_string, track.notesPerMeasure, track.numberOfMeasures);
    }

    track.sticking_array = noteArraysFromURLData("Stickings", Stickings_string, track.notesPerMeasure, track.numberOfMeasures);
    track.hh_array = noteArraysFromURLData("H", HH_string, track.notesPerMeasure, track.numberOfMeasures);
    track.snare_array = noteArraysFromURLData("S", Snare_string, track.notesPerMeasure, track.numberOfMeasures);
    track.kick_array = noteArraysFromURLData("K", Kick_string, track.notesPerMeasure, track.numberOfMeasures);

    track.title = getQueryVariableFromString("title", "", encodedURLData);
    track.title = decodeURIComponent(track.title);
    track.title = track.title.replace(/\+/g, " ");

    track.author = getQueryVariableFromString("author", "", encodedURLData);
    track.author = decodeURIComponent(track.author);
    track.author = track.author.replace(/\+/g, " ");

    track.comments = getQueryVariableFromString("comments", "", encodedURLData);
    track.comments = decodeURIComponent(track.comments);
    track.comments = track.comments.replace(/\+/g, " ");

    midiPlayer.setTempo(parseInt(getQueryVariableFromString("tempo", constant_DEFAULT_TEMPO, encodedURLData), 10));
    if (isNaN(track.tempo) || track.tempo < 20 || track.tempo > 400)
        midiPlayer.setTempo(constant_DEFAULT_TEMPO);

    midiPlayer.setSwing(parseInt(getQueryVariableFromString("swing", 0, encodedURLData), 10));
    if (isNaN(midiPlayer.getSwing()) || midiPlayer.getSwing() < 0 || midiPlayer.getSwing() > 100)
        midiPlayer.setSwing(0);

    return track;
};


// update the current URL so that reloads and history traversal and link shares and bookmarks work correctly
function updateCurrentURL() {
    // Update temporary link out to GS
    var newURLGS = get_GSURLForPage();
    if (linkGrooveScribe)
        linkGrooveScribe.href = newURLGS;
    // Update temporary link out to GS
    var linkGrooveScrib

    var newURL = editor.get_FullURLForPage();

    var newTitle = false;

    addFullURLToUndoStack(newURL);

    var title = document.getElementById("tuneTitle").value.trim();
    if (title !== "")
        newTitle = title;

    var author = document.getElementById("tuneAuthor").value.trim();
    if (author !== "") {
        if (title)
            newTitle += " by " + author;
        else
            newTitle = "Groove by " + author;
    }

    if (!newTitle)
        newTitle = editor.class_app_title;

    document.title = newTitle;
    try {
        window.history.replaceState(null, newTitle, newURL);
    } catch (err) {
        /* empty */
    }

    if (options.debugMode) {
        // put the search data on the bottom of the page to make it easy to cut & paste
        var searchDataEle = document.getElementById("URLSearchData");
        if (searchDataEle) {
            var searchIndex = newURL.indexOf("?");
            var searchURL = newURL.substring(searchIndex).replace("Debug=1&", "");
            searchDataEle.innerHTML = '<p style="margin-left: 10px;"><b>' + searchURL + '</b><p>';
        }
    }
};